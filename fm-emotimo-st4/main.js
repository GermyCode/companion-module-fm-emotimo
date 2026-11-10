const { InstanceBase, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base');
const UpgradeScripts = require('./upgrades');
const UpdateActions = require('./actions');
const UpdateFeedbacks = require('./feedbacks');
const UpdateVariableDefinitions = require('./variables');
const { variableList } = require('./variables');
const {
	MOTOR_ID,
	TN_MOTOR_ID,
	DIRECTION_ID,
	MOTOR_SPEED,
	MOTOR_PROFILES,
	MOTOR_PROFILES_VELOCITIES,
	PRESET_ID,
	LOOP_ID,
	VIRTUAL_BUTTON
} = require('./lists');

const presets = require('./presets');

const config = require('./config');
const { QUERY_CAPABILITIES } = require('./models');

class eMotimoModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal);

		// Assign the methods from the listed files to this class
		Object.assign(this, {
				...config,
			// 	...UpdateActions,
			// 	...UpdateFeedbacks,
			// ...UpdateVariableDefinitions,
			...presets,
		});

		this.commandQueue = [];
		this.backgroundQueue = [];
		this.commandInFlight = false;
		this.commandTimer = null;
		this._destroyed = false;
		this._startupTimer = null;

		this.motorVelocityModes = new Map();
		this.motionGeneration = 0;

		this.keepAliveInterval = null;
		this.positionPollInterval = null;
		this.keepAliveMs = 10000;

		this.responseBuffer = '';
		this.responseFlushTimer = null;
		this.responseIdleMs = 250;
		this.sendDelayMs = 100;
		this.recentList = [''];
		this.keepRecentAmmount = 5 // 0-4 = 5 Total
	}

	async init(config) {
		this.config = config
		this.log('debug', 'Instance Init');

		this.updateActions(); // export actions
		this.updateFeedbacks(); // export feedbacks
		this.updateVariableDefinitions(); // export variable definitions
		// this.updatePresets();

		await this.configUpdated(config);
		this.checkFeedbacks();
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'Destroying eMotimo module');

		this._destroyed = true;
		this._cleanupSocket();
	}

	async configUpdated(config) {
		this.log('debug', "Config Updated");

		if (this._destroyed) return;

		this._cleanupSocket();

		this.config = config

		this.config.host = String(this.config.host ?? '').trim();

		const port = Number(this.config.port);

		this.config.port =
			Number.isInteger(port) &&
			port >= 1 &&
			port <= 65535 ? port : 5000;

		this.config.model = this.config.model || 'Spectrum ST4';

		const rawPresetCount = this.config.startupPstAmount;
		const parsedPresetCount = Number(rawPresetCount);

		this.config.startupPstAmount =
			rawPresetCount == null ||
			rawPresetCount === '' ||
			!Number.isFinite(parsedPresetCount) ? 15 : Math.max(0, Math.min(128, Math.trunc(parsedPresetCount)));

		const rawInterval = this.config.interval;
		const parsedInterval = Number(rawInterval);

		this.config.interval =
			rawInterval == null ||
			rawInterval === '' ||
			!Number.isFinite(parsedInterval) ||
			parsedInterval < 0 ? 5000 : parsedInterval === 0 ? 0 : Math.min(60000, Math.max(500, Math.trunc(parsedInterval)));

		this.config.prot = 'tcp';

		const capabilities =
			QUERY_CAPABILITIES[this.config.model] ??
			QUERY_CAPABILITIES.Other;

		this.performanceQueryIds = [...capabilities.performance];
		this.stopQueryIds = [...capabilities.stops];

		this.customPanName = this.config.customNamePan || 'Pan';
		this.customTiltName = this.config.customNameTilt || 'Tilt';
		this.customM3Name = this.config.customNameM3 || 'M3';
		this.customPaM4me = this.config.customNameM4 || 'M4';

		if (this.config.prot == 'tcp') {
			this.init_tcp();

			this.init_tcp_variables();
		}

		this.init_emotimo_variables();
		this.initPresets();
	}

	updateActions() {
		UpdateActions(this);
	}

	updateFeedbacks() {
		UpdateFeedbacks(this);
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this);
		this._variableDefinitionsCount = variableList.length;
	}

	ensureVariableDefinitions(definitions) {
		for (const definition of definitions) {
			const exists = variableList.some(
				item => item.variableId === definition.variableId
			);

			if (!exists) {
				variableList.push(definition);
			}
		}

		// Only publish the definitions if this instance
		// hasn't already registered the current list.
		if (this._variableDefinitionsCount !== variableList.length) {
			this.setVariableDefinitions(variableList);
			this._variableDefinitionsCount = variableList.length;
		}
	}

	// DONT ADD \n OR ANY ENDING CRLF TO END, IT WILL BE HANDELED AUTOMATICALLY
	sendEmotimoAPICommand = function (str, addToFront = false) {
		if (!this.socket?.isConnected) {
			this.log('warn', `Command dropped: not connected (${str})`);
			return;
		}
		if (addToFront) {
			// add to front, index 0
			this.commandQueue.unshift(str);
		} else {
			// add to end, index -1
			this.commandQueue.push(str);
		}
		if (this.recentList[0] != str) { // if str is NOT already the most recent
			if (this.recentList.length >= this.keepRecentAmmount) this.recentList.pop(); // remove the last entry if length is longer than allowed
			this.recentList.unshift(str); // add to frontm index 0
		}
		this.processQueue();
	}

	queueBackgroundQuery(command) {
		if (this._destroyed || !this.socket?.isConnected) {
			return false;
		}

		// Avoid duplicate outstanding queries
		if (
			this.commandQueue.includes(command) ||
			this.backgroundQueue.includes(command)
		) {
			return true;
		}

		this.backgroundQueue.push(command);
		this.processQueue();

		return true;
	}

	processQueue() {
		if (this.commandInFlight) return;
		if (
			this.commandQueue.length === 0 &&
			this.backgroundQueue.length === 0
		) return;

		if (!this.socket?.isConnected) {
			this.commandQueue = [];
			this.backgroundQueue = [];
			return;
		}

		const cmd = this.commandQueue.length > 0
			? this.commandQueue.shift()
			: this.backgroundQueue.shift();

		this.commandInFlight = true;

		try {
			this._sendNow(cmd);
		} finally {
			this.commandTimer = setTimeout(() => {
				this.commandTimer = null;
				this.commandInFlight = false;
				this.processQueue();
			}, this.sendDelayMs);
		}
	}

	_sendNow = function (str) {
		/*
		* create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
		* sending a string assumes 'utf8' encoding
		* which then escapes character values over 0x7F
		* and destroys the 'binary' content
		*/

		const sendBuf = Buffer.from(str + '\n', 'latin1');

		this.log('debug', 'sending to ' + this.config.host + ': ' + sendBuf.toString());

		if (!this.socket?.isConnected) {
			this.log('warn', 'Cannot send: socket disconnected');
			return false;
		}

		try {
			const sent = this.socket.send(sendBuf);

			if (sent === false) {
				this.log('warn', `Command not sent: ${str}`);
				return false;
			}

			// Track successfully submitted velocity commands
			const match = str.trim().match(
				/^(G30[01])\s+M(\d+)\s+V(-?\d+(?:\.\d+)?)$/i
			);

			if (match) {
				const mode = match[1].toUpperCase();
				const motorId = Number(match[2]);
				const velocity = Number(match[3]);

				if (velocity === 0) {
					this.motorVelocityModes.delete(motorId);
				} else {
					this.motorVelocityModes.set(motorId, mode);
				}
			} else if (str.trim().toUpperCase() === 'G911') {
				this.motorVelocityModes.clear();
			}

			return true;
		} catch (err) {
			this.log('error', `Send failed: ${err.message}`);
			return false;
		}
	};

	stopAllMotors() {
		// Invalidate any delayed movement actions
		this.motionGeneration++;

		// Cancel the current queue timer
		if (this.commandTimer) {
			clearTimeout(this.commandTimer);
			this.commandTimer = null;
		}

		// Discard all commands waiting to be sent
		this.commandQueue = [];
		this.backgroundQueue = [];
		this.commandInFlight = false;
		this.recentList = [''];

		// Send the stop immediately, outside the normal queue
		const sent = this._sendNow('G911');

		if (!sent) {
			this.log('error', 'Emergency stop could not be sent: TCP unavailable');
		}

		return sent;
	}

	stopMotorJog(motorId) {
		const id = Number(motorId);

		if (
			!Number.isInteger(id) ||
			!MOTOR_ID.some(m => Number(m.id) === id)
		) {
			this.log('error', `Invalid motor ID for stop: ${motorId}`);
			return false;
		}

		// Cancel delayed movement starts
		this.motionGeneration++;

		// Remove pending velocity commands for this motor
		this.commandQueue = this.commandQueue.filter(command => {
			const match = command.trim().match(
				/^G30[01]\s+M(\d+)\s+V/i
			);

			return !match || Number(match[1]) !== id;
		});

		if (!this.socket?.isConnected) {
			this.log('error', `Cannot stop motor ${id}: TCP unavailable`);
			return false;
		}

		// Use the velocity mode last sent to this motor
		const mode = this.motorVelocityModes.get(id);

		if (mode) {
			return this._sendNow(`${mode} M${id} V0`);
		}

		// Unknown mode: issue both documented zero-velocity forms
		const stop300 = this._sendNow(`G300 M${id} V0`);
		const stop301 = this._sendNow(`G301 M${id} V0`);

		return stop300 && stop301;
	}

	stopLoop() {
		// Invalidate delayed loop-start commands
		this.motionGeneration++;

		// Remove queued loop-start commands
		this.commandQueue = this.commandQueue.filter(command =>
			!/^G24\s+L\d+/i.test(command.trim())
		);

		// G24 without a loop ID exits looping mode
		return this._sendNow('G24');
	}

	init_tcp() {
		this.log('debug', 'Initializing TCP connection');

		this.updateStatus(InstanceStatus.Connecting);

		// if the host ip config feild is empty, return
		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig);
			return;
		}
		this.log('debug', "Opening TCP:" + this.config.host.toString() + ":" + this.config.port.toString());
		const socket = new TCPHelper(this.config.host, this.config.port);
		this.socket = socket;

		socket.on('connect', () => {
			if (this._destroyed || this.socket !== socket) return;

			this.log('info', 'TCP connection established');

			// Begin each TCP session with a clean command state
			this._resetTransportState();

			// Keep the controller's API session alive
			this._sendNow('G999');

			// Refresh device information on every successful TCP connection
			this._scheduleStartupFetch(socket);
		});

		socket.on('status_change', (status, message) => {
			if (this._destroyed || this.socket !== socket) return;

			this.updateStatus(status, message);

			if (
				status !== InstanceStatus.Ok &&
				status !== InstanceStatus.Connecting
			) {
				this._resetTransportState();
			}
		});

		socket.on('error', (err) => {
			if (this._destroyed || this.socket !== socket) return;

			this.log('warn', `TCP connection error: ${err.message}`);

			// Reset commands, but DO NOT destroy TCPHelper
			this._resetTransportState();
		});

		socket.on('end', () => {
			if (this._destroyed || this.socket !== socket) return;

			this.log('warn', 'TCP connection ended');

			this._resetTransportState();
		});

		/*
		States that when data is recieved, do this,
		if the save response config is enabled then it saves the response as a variable in companion
		then send the data recieved to get delt with
		*/
		socket.on('data', (data) => {
			if (this._destroyed || this.socket !== socket) return;

			if (this.config.saveresponse) {
				let dataResponse = data

				if (this.config.convertresponse == 'string') {
					dataResponse = data.toString();
				} else if (this.config.convertresponse == 'hex') {
					dataResponse = data.toString('hex');
				}

				this.setVariableValues({ tcp_response: dataResponse });
			}

			// Buffer incoming TCP data before parsing
			this._handleTCPChunk(data, socket);
		});

		// Remove any previous communication timers
		if (this.keepAliveInterval) {
			clearInterval(this.keepAliveInterval);
		}

		if (this.positionPollInterval) {
			clearInterval(this.positionPollInterval);
		}

		// Dedicated API keepalive - independent of command queue
		this.keepAliveInterval = setInterval(() => {
			if (
				this._destroyed ||
				this.socket !== socket ||
				!socket.isConnected
			) {
				return;
			}

			this._sendNow('G999');
		}, this.keepAliveMs);

		// Independent motor position polling
		const pollMs = Number(this.config.interval);

		if (Number.isFinite(pollMs) && pollMs > 0) {
			this.positionPollInterval = setInterval(() => {
				if (
					this._destroyed ||
					this.socket !== socket ||
					!socket.isConnected
				) {
					return;
				}

				// Don't add another G500 if one is already queued
				if (this.commandQueue.includes('G500')) return;

				this.sendEmotimoAPICommand('G500');

			}, pollMs);
		}

		this.log('debug', 'Keepalive and position polling initialized');
	}

	_scheduleStartupFetch(socket) {
		// Replace any previous scheduled fetch
		if (this._startupTimer) {
			clearTimeout(this._startupTimer);
			this._startupTimer = null;
		}

		this._startupTimer = setTimeout(() => {
			this._startupTimer = null;

			// Don't fetch using an old or disconnected socket
			if (
				this._destroyed ||
				this.socket !== socket ||
				!socket.isConnected
			) {
				return;
			}

			// Refresh current positions even if startup fetching is disabled
			this.sendEmotimoAPICommand('G500', true);

			// Additional read-only startup queries
			if (this.config.fetch) {
				this.fetchStartup(socket);
			}

		}, 500);
	}

	_handleTCPChunk(chunk, socket) {
		// Cancel any pending idle flush
		if (this.responseFlushTimer) {
			clearTimeout(this.responseFlushTimer);
			this.responseFlushTimer = null;
		}

		// Append new data to whatever was left from before
		this.responseBuffer += chunk.toString('latin1');

		// Extract complete CR, LF, or CRLF-terminated lines
		const lines = this.responseBuffer.split(/\r\n|\r|\n/);

		// The last element may be an incomplete response
		this.responseBuffer = lines.pop() || '';

		// Process each complete response separately
		for (const line of lines) {
			this._handleTCPLine(line);
		}

		// Prevent an invalid or endless response from growing forever
		if (this.responseBuffer.length > 16384) {
			this.log('warn', 'TCP response buffer exceeded 16 KB; discarding');
			this.responseBuffer = '';
			return;
		}

		// Compatibility fallback for replies without a line ending
		if (this.responseBuffer) {
			this.responseFlushTimer = setTimeout(() => {
				this.responseFlushTimer = null;

				if (
					this._destroyed ||
					this.socket !== socket ||
					!socket.isConnected
				) {
					return;
				}

				const remaining = this.responseBuffer;
				this.responseBuffer = '';

				this.log('debug', 'Processing unterminated TCP response');
				this._handleTCPLine(remaining);
			}, this.responseIdleMs);
		}
	}

	_handleTCPLine(line) {
		const response = line.trim();

		// Ignore empty lines
		if (!response) return;

		this.log('debug', `Response: ${response}`);

		// ST4/ST4.3 can return G500 without "Positions:"
		const status = response.match(
			/^([01]{4})\s+(-?\d+(?:\s*,\s*-?\d+){6})$/
		);

		const normalized = status
			? `Positions: ${status[1]},${status[2]}`
			: response;

		try {
			this.handleTCPResponse(normalized);
		} catch (err) {
			this.log('warn',
				`Unable to parse eMotimo response "${response}": ${err.message}`
			);
		}
	}

	_resetTransportState() {
		if (this._startupTimer) {
			clearTimeout(this._startupTimer);
			this._startupTimer = null;
		}

		// Cancel an outstanding queue timer
		if (this.commandTimer) {
			clearTimeout(this.commandTimer);
			this.commandTimer = null;
		}

		// Never replay commands from the previous connection
		this.commandQueue = [];
		this.backgroundQueue = [];
		this.commandInFlight = false;

		// Forget the previous session's commands
		this.recentList = [''];

		// Discard incomplete responses from the old TCP session
		if (this.responseFlushTimer) {
			clearTimeout(this.responseFlushTimer);
			this.responseFlushTimer = null;
		}

		this.responseBuffer = '';

		// The previous connection's motor state is no longer trustworthy
		this.motorVelocityModes.clear();

		// Invalidate delayed commands from the previous connection
		this.motionGeneration++;
	}

	_cleanupSocket() {
		// Stop API keepalive
		if (this.keepAliveInterval) {
			clearInterval(this.keepAliveInterval);
			this.keepAliveInterval = null;
		}

		// Stop position polling
		if (this.positionPollInterval) {
			clearInterval(this.positionPollInterval);
			this.positionPollInterval = null;
		}

		// Stop command queue timer
		if (this.commandTimer) {
			clearTimeout(this.commandTimer);
			this.commandTimer = null;
		}

		// Stop delayed startup fetch
		if (this._startupTimer) {
			clearTimeout(this._startupTimer);
			this._startupTimer = null;
		}

		// Reset communication state
		this.commandQueue = [];
		this.backgroundQueue = [];
		this.commandInFlight = false;
		this.recentList = [''];

		// Discard incomplete responses from the old TCP session
		if (this.responseFlushTimer) {
			clearTimeout(this.responseFlushTimer);
			this.responseFlushTimer = null;
		}

		this.responseBuffer = '';

		// Reset motor control tracking
		this.motorVelocityModes.clear();

		// Invalidate delayed motor commands
		this.motionGeneration++;

		// Close the old socket
		if (this.socket) {
			const oldSocket = this.socket;
			this.socket = null;

			try {
				oldSocket.removeAllListeners();
				oldSocket.destroy();
			} catch (err) {
				this.log('warn', `Socket cleanup error: ${err.message}`);
			}
		}
	}

	handleTCPResponse = function (dataPacket) {
		var tokens = dataPacket.toString().split(':');

		this.log('debug', 'Parse: ' + tokens[0]);
		switch (tokens[0].trim()) { // trim to remove any ' ' or \n or anything similar
			// response from the G500 command
			case 'Positions':
				const requiredPositions = this.config.model === 'SA2.6 Conductor' ? 10 : 8;
				if (!tokens[1]) {
					this.log('warn', 'G500 response has no position data');
					return;
				}

				var data = tokens[1].split(',').map(v => v.trim());

				// Movement flags + 7 axis positions
				if (
					data.length < requiredPositions ||
					data.slice(0, requiredPositions).some(v => v === '' || !Number.isFinite(Number(v)))
				) {
					this.log('warn', `Invalid G500 response: ${dataPacket}`);
					return;
				}
				// this.log('debug', "Position Update:" + data[0] + ":" + data[1]); //Data[0] has movement flags led by a space data[1] is Pan Position
				if (parseInt(data[0]) !== 0 || this.getVariableValue('LpActive') !== -1) {
					this.setVariableValues({ IsMoving: true });
					this.checkFeedbacks('MovingStatus');
				} else {
					this.setVariableValues({ IsMoving: false });
					this.checkFeedbacks('MovingStatus');
				}
				this.setVariableValues({ PPos: Number(data[1])});
				this.setVariableValues({ TPos: Number(data[2])});
				this.setVariableValues({ M3Pos: Number(data[3])});
				this.setVariableValues({ M4Pos: Number(data[4])});
				this.setVariableValues({ FPos: Number(data[5])});
				this.setVariableValues({ IPos: Number(data[6])});
				this.setVariableValues({ ZPos: Number(data[7])});
				if (data.length >= 10) {
					this.setVariableValues({
						RPos: Number(data[8]),
						RSFocusPos: Number(data[9]),
					});
				}
				return;
			// response from the G21 command
			case 'Preset Set':
				var data = tokens[1].split(' ');
				this.log('debug', "ID:" + data[0] + ":" + data[1]); //Data[0] is empty there is a space here
				const presetId = Number(data[1]);
				if (!isNaN(presetId) && presetId >= 0) {
					this.setVariableValues({ [`Pst${presetId}Stat`]: 1 });

					let setpstsRaw = this.getVariableValue('SetPsts');
					let setpsts = [];

					try {
						setpsts = JSON.parse(setpstsRaw) || [];
					} catch (e) {
						setpsts = [];
					}

					// Only add if not already present
					if (!setpsts.includes(presetId)) {
						setpsts.push(presetId);
						this.setVariableValues({ SetPsts: JSON.stringify(setpsts) });
					}

					var panpos = this.getVariableValue('PPos');
					var tiltpos = this.getVariableValue('TPos');
					var m3pos = this.getVariableValue('M3Pos');
					var m4pos = this.getVariableValue('M4Pos');

					this.setVariableValues({ [`Pst${presetId}PanPos`]: panpos });
					this.setVariableValues({ [`Pst${presetId}TiltPos`]: tiltpos });
					this.setVariableValues({ [`Pst${presetId}M3Pos`]: m3pos });
					this.setVariableValues({ [`Pst${presetId}M4Pos`]: m4pos });

					if (presetId === this.getVariableValue('CurrentPstSet')) {
						this.setVariableValues({ CurrentPstPanPos: panpos });
						this.setVariableValues({ CurrentPstTiltPos: tiltpos });
						this.setVariableValues({ CurrentPstM3Pos: m3pos });
						this.setVariableValues({ CurrentPstM4Pos: m4pos });
					}
				}
				this.checkFeedbacks("SetPreset");
				this.checkFeedbacks("SetPresetSmart");
				return;
			// response from the G24 Command
			case 'Entering Loop':
				this.setVariableValues({ LastPstID: -1});
				this.setVariableValues({ LpActive: Number(tokens[1]) });
				this.setVariableValues({ IsMoving: true });
				this.checkFeedbacks('MovingStatus');
				this.checkFeedbacks("LoopStatus");
				this.checkFeedbacks("CurrentLooping");
				this.checkFeedbacks("CurrentPreset");
				return;
			// response from the G24 command
			case 'Exiting Loop':
				this.setVariableValues({ LpActive: -1 });
				this.checkFeedbacks("LoopStatus");
				this.checkFeedbacks("CurrentLooping");
				return;
			case 'Loop Not Configured':
				let lastSent = this.recentList[0];
				let [w1, w2] = lastSent.split(' ');
				if (w1 === 'G24') {
					let [q1, q2, preset] = w2.match(/^([A-Za-z]+)(\d+)$/); // Turning 'L0' -> ['L0', 'L', '0']
					let setLpsRaw = this.getVariableValue('SetLps');
					let setlps = [];

					try { // convert the '[]' to []
						setlps = JSON.parse(setLpsRaw) || [];
					} catch (e) {
						setlps = [];
					}

					if (setlps.includes(preset)) {
						let index = setlps.findIndex((x) => x === preset);
						setlps.splice(index, 1);
						this.setVariableValues({ SetLps: JSON.stringify(setlps) }); // parse '[]' to [], push w2, set back to '[]'
						this.checkFeedbacks('SetLoop');
					}
				}
				return;
			case 'Stop All Initiated':
				this.setVariableValues({ LpActive: -1 });
				this.checkFeedbacks("LoopStatus");
				this.checkFeedbacks("CurrentLooping");
				this.setVariableValues({ LastPstID: -1 });
				this.checkFeedbacks("CurrentPreset");
				return;
			case 'Reset Stops':
				let motor = Number(tokens[1]);
				if (motor != 0) {
					try { // map the motor id to a name using the MOTOR_ID object list
						var axis = MOTOR_ID.find(m => m.id === motor).label
						this.setVariableValues({ [`${axis}StopA`]: 0 });
						this.setVariableValues({ [`${axis}StopB`]: 0 });
					}
					catch (e) {
						this.log('error', `couldn't find id: ${motor} in MOTOR_ID. Error: ${e}`);
					}
				} else { // reset all axis
					for (const i of this.stopQueryIds) {
						try { // map the motor id to a name using the MOTOR_ID object list
							var axis = MOTOR_ID.find(m => m.id === i).label
							this.setVariableValues({ [`${axis}StopA`]: 0 });
							this.setVariableValues({ [`${axis}StopB`]: 0 });
						}
						catch (e) {
							this.log('error', `Couldn't find id: ${i} in MOTOR_ID. Error: ${e}`);
						}
					}
				}

				this.checkFeedbacks("StopAStatus");
				this.checkFeedbacks("StopBStatus");
				this.checkFeedbacks("StopAStatusSmart");
				this.checkFeedbacks("StopBStatusSmart");
				return;
			case 'Motor Profile Set':
				this.setVariableValues({ CurrentMtrProf: tokens[1].trim()});
				this.checkFeedbacks('MotorProfileSatus');
				return;
			default:
		}
		// other special responses //

		// response for the G752 Command (preset fetch)
		if (tokens[0].startsWith('Preset ')) {
			const line = dataPacket.toString();
			const match = line.match(/Preset (\d+): X(-?\d+)\s+Y(-?\d+)\s+Z(-?\d+)\s+W(-?\d+).*?RunTime:\s*(\d+)\s+RampTime:\s*(\d+)/);

			if (match) {
				const [, preset, pan, tilt, m3, m4, run, ramp] = match.map(Number);

				// Check if it's an "active" preset
				const isActive = pan !== 0 || tilt !== 0 || m3 !== 0 || m4 !== 0 || run !== 50 || ramp !== 10;

				if (isActive) {
					// adding the active preset to the PRESET_ID list in the actions file
					if (!PRESET_ID.some(p => p.id === preset)) {
						PRESET_ID.push({ id: preset, label: `Pst${preset}`});
						this.updateActions();
					}

					this.ensureVariableDefinitions([
						{ name: `Preset${preset}RunT`, variableId: `Pst${preset}RunT` },
						{ name: `Preset${preset}RampT`, variableId: `Pst${preset}RampT` },
						{ name: `Preset${preset}Status`, variableId: `Pst${preset}Stat` },
						{ name: `Preset${preset}PanPos`, variableId: `Pst${preset}PanPos` },
						{ name: `Preset${preset}TiltPos`, variableId: `Pst${preset}TiltPos` },
						{ name: `Preset${preset}M3Pos`, variableId: `Pst${preset}M3Pos` },
						{ name: `Preset${preset}M4Pos`, variableId: `Pst${preset}M4Pos` },
					]);

					this.setVariableValues({
						[`Pst${preset}Stat`]: 1,
						[`Pst${preset}PanPos`]: pan,
						[`Pst${preset}TiltPos`]: tilt,
						[`Pst${preset}M3Pos`]: m3,
						[`Pst${preset}M4Pos`]: m4,
						[`Pst${preset}RunT`]: run,
						[`Pst${preset}RampT`]: ramp
					});
					if (preset === this.getVariableValue('CurrentPstSet')) {
						this.setVariableValues({ 'CurrentPstRun': run });
						this.setVariableValues({ 'CurrentPstRamp': ramp });
					}

					let setpstsRaw = this.getVariableValue('SetPsts');
					let setpsts = [];

					try {
						setpsts = JSON.parse(setpstsRaw) || [];
					} catch (e) {
						setpsts = [];
					}

					// Only add if not already present
					if (!setpsts.includes(preset)) {
						setpsts.push(preset);
						this.setVariableValues({ SetPsts: JSON.stringify(setpsts) });
					}

					this.checkFeedbacks("SetPreset");
					this.checkFeedbacks("SetPresetSmart");
				}
				return;
			}
		}
		if (tokens[0].startsWith('Motor performance set for')) {
			const response = dataPacket.toString().trim();

			const match = response.match(
				/^Motor performance set for (\w+):\s*Vel\.:\s*(-?\d+)(?:,\s*Accel\.:\s*(-?\d+),\s*IRUN:\s*(\d+),\s*IHOLD:\s*(\d+))?$/i
			);

			if (!match) {
				this.log('warn', `Unrecognized G101 response: ${response}`);
				return;
			}

			const [, axis, vel, accel, irun, ihold] = match;

			const speeds = {
				Vel: vel,
				Accel: accel ?? '',
				IRUN: irun ?? '',
				IHOLD: ihold ?? '',
			};

			// Preserve the existing object-style variable value
			this.setVariableValues({
				[`${axis}SpeedProfileValues`]: speeds,
			});

			// Match a known motor profile using the Pan values
			if (axis === 'Pan' && accel !== undefined) {
				const profile = MOTOR_PROFILES_VELOCITIES.find(item => {
					const [, motor] = item.id.split(',');

					return motor === 'Pan' &&
						item.Vel === vel &&
						item.Accel === accel &&
						item.IRUN === irun &&
						item.IHOLD === ihold;
				});

				if (profile) {
					const profileName = profile.id.split(',')[0];

					this.setVariableValues({
						CurrentMtrProf: profileName,
					});

					this.checkFeedbacks('MotorProfileSatus');
				}
			}

			return;
		}
		if (tokens[0].startsWith('Com\'d Not Recognized')) {
			this.log('error', `eMotimo rejected a command: ${dataPacket.toString().trim()}`);
			return;
		}
		// response for the G25 Command (save loop): response: 'Loop 2 Set' -> ['Loop', '2', 'Set']
		if (tokens[0].startsWith('Loop') && tokens[0].endsWith('Set')) {
			const [loop, preset, set] = tokens[0].split(' ');
			let setLpsRaw = this.getVariableValue('SetLps');
			let setlps = [];

			try { // convert the '[]' to []
				setlps = JSON.parse(setLpsRaw) || [];
			} catch (e) {
				setlps = [];
			}

			if (!setlps.includes(preset)) {
				setlps.push(preset);
				this.setVariableValues({ SetLps: JSON.stringify(setlps) }); // parse '[]' to [], push preset, set back to '[]'
				this.checkFeedbacks('SetLoop');
			}
			return;
		}
		if (tokens[0].startsWith('Recalling Preset ')) {
			let [w1, w2, preset] = tokens[0].split(' ');
			this.setVariableValues({ LastPstID: Number(preset) });
			this.checkFeedbacks('CurrentPreset');
			this.setVariableValues({ IsMoving: true });
				this.checkFeedbacks('MovingStatus');
			return;
		}

		/*
		logic for stops:
		normal set stop response would be: StopA:motor_id,Position
		requesting motor stop location response would be: Pan StopA:location
		normal response: 'StopA' -> ['StopA', undefined]
		request: 'Pan StopA' -> ["Pan", "StopA"]
		*/
		const [w1, w2] = tokens[0].split(' ');
		var axis = w2 ? w1 : undefined; // motor name, when the second argument exists, aka its not a normal response
		const stop = w2 ? w2 : w1; // 'StopA' or 'StopB'
		switch (stop) {
			case 'StopA':
				var positionRaw = tokens[1];
				if (axis === undefined) { // if its a normal response
					var [motor, positionRaw] = tokens[1].split(',');
					try { // map the motor id to a name using the MOTOR_ID object list
						axis = MOTOR_ID.find(m => m.id === Number(motor)).label;
					}
					catch (e) {
						this.log('error', `couldn't find id: ${motor} in MOTOR_ID. Error: ${e}`);
					}
				}
				var position = positionRaw.trim(); // remove any \n or anything

				if (position != '-2000000000') {
					this.setVariableValues({ [`${axis}StopA`]: 1 });
				} else {
					this.setVariableValues({ [`${axis}StopA`]: 0 });
				}
				this.checkFeedbacks("StopAStatus");
				this.checkFeedbacks("StopAStatusSmart");
				return;
			case 'StopB':
				var positionRaw = tokens[1];
				if (axis === undefined) { // if its a normal response
					var [motor, positionRaw] = tokens[1].split(',');
					try { // map the motor id to a name using the MOTOR_ID object list
						axis = MOTOR_ID.find(m => m.id === Number(motor)).label;
					}
					catch (e) {
						this.log('error', `couldn't find id: ${motor} in MOTOR_ID. Error: ${e}`);
					}
				}
				var position = positionRaw.trim(); // remove any \n or anything

				if (position != '2000000000') {
					this.setVariableValues({ [`${axis}StopB`]: 1 });
				} else {
					this.setVariableValues({ [`${axis}StopB`]: 0 });
				}
				this.checkFeedbacks("StopBStatus");
				this.checkFeedbacks("StopBStatusSmart");
				return;
		}
	}

	init_tcp_variables() {
		// this.setVariableDefinitions([{ name: 'Last TCP Response', variableId: 'tcp_response' }]); //Calling this function overwrites other variables already declared we want to declare them all in variables.js

		this.setVariableValues({ tcp_response: '' });
	}

	init_emotimo_variables() {
		this.setVariableValues({ PPos: 0 });
		this.setVariableValues({ TPos: 0 });
		this.setVariableValues({ M3Pos: 0 });
		this.setVariableValues({ M4Pos: 0 });
		this.setVariableValues({ FPos: 5000 });
		this.setVariableValues({ IPos: 5000 });
		this.setVariableValues({ ZPos: 5000 });
		this.setVariableValues({ RSFocusPos: 0 });
		if (this.config.model == 'SA2.6 Conductor') {
			this.setVariableValues({ TStep: 1 });
			this.setVariableValues({ PStep: 1 });
		} else {
			this.setVariableValues({ TStep: 1000 });
			this.setVariableValues({ PStep: 1000 });
		}
		this.setVariableValues({ SStep: 1000 });
		this.setVariableValues({ MStep: 1000 });
		this.setVariableValues({ FStep: 50 });
		this.setVariableValues({ IStep: 50 });
		this.setVariableValues({ ZStep: 50 });
		this.setVariableValues({ RStep: 1 });
		this.setVariableValues({ PanSpeedLimit: 100 });
		this.setVariableValues({ TiltSpeedLimit: 100 });
		this.setVariableValues({ M3SpeedLimit: 100 });
		this.setVariableValues({ M4SpeedLimit: 100 });
		this.setVariableValues({ TN1SpeedLimit: 50 });
		this.setVariableValues({ TN2SpeedLimit: 50 });
		this.setVariableValues({ TN3SpeedLimit: 50 });
		this.setVariableValues({ RollSpeedLimit: 100 });
		this.setVariableValues({ FocusSpeedLimit: 100 });
		this.setVariableValues({ PanCruiseSpeed: 0 });
		this.setVariableValues({ TiltCruiseSpeed: 0 });
		this.setVariableValues({ M3CruiseSpeed: 0 });
		this.setVariableValues({ M4CruiseSpeed: 0 });
		this.setVariableValues({ TN1CruiseSpeed: 0 });
		this.setVariableValues({ TN2CruiseSpeed: 0 });
		this.setVariableValues({ TN3CruiseSpeed: 0 });
		this.setVariableValues({ RollCruiseSpeed: 0 });
		this.setVariableValues({ FocusCruiseSpeed: 0 });
		this.setVariableValues({ Pst0Stat: 0 });
		this.setVariableValues({ Pst0RunT: 50 });
		this.setVariableValues({ Pst0RampT: 10 });
		this.setVariableValues({ Lp0RunT: 50 });
		this.setVariableValues({ Lp0RampT: 10 });
		this.setVariableValues({ Lp0APoint: 0 });
		this.setVariableValues({ Lp0BPoint: 0 });
		this.setVariableValues({ Lp0DwellA: 500 });
		this.setVariableValues({ Lp0DwellB: 500 });
		this.setVariableValues({ LpActive: -1 });
		this.setVariableValues({ PanStopA: 0 });
		this.setVariableValues({ PanStopB: 0 });
		this.setVariableValues({ TiltStopA: 0 });
		this.setVariableValues({ TiltStopB: 0 });
		this.setVariableValues({ M3StopA: 0 });
		this.setVariableValues({ M3StopB: 0 });
		this.setVariableValues({ M4StopA: 0 });
		this.setVariableValues({ M4StopB: 0 });
		this.setVariableValues({ TNFocusStopA: 0 });
		this.setVariableValues({ TNFocusStopB: 0 });
		this.setVariableValues({ TNIrisStopA: 0 });
		this.setVariableValues({ TNIrisStopB: 0 });
		this.setVariableValues({ TNZoomStopA: 0 });
		this.setVariableValues({ TNZoomStopB: 0 });
		this.setVariableValues({ RSRollStopA: 0 });
		this.setVariableValues({ RSRollStopB: 0 });
		this.setVariableValues({ RSFocusStopA: 0 });
		this.setVariableValues({ RSFocusStopB: 0 });
		this.setVariableValues({ CurrentPstSet: 0 });
		this.setVariableValues({ CurrentPstRun: 50 });
		this.setVariableValues({ CurrentPstRamp: 10 });
		this.setVariableValues({ CurrentLpSet: 0 });
		this.setVariableValues({ CurrentLpA: 0 });
		this.setVariableValues({ CurrentLpB: 0 });
		this.setVariableValues({ CurrentLpRun: 50 });
		this.setVariableValues({ CurrentLpRamp: 10 });
		this.setVariableValues({ CurrentLpDwellA: 500 });
		this.setVariableValues({ CurrentLpDwellB: 500 });
		this.setVariableValues({ CurrentMtrSet: 1 });
		this.setVariableValues({ CurrentMtrStr: 'Pan' });
		this.setVariableValues({ CurrentMtrPosStr: 'Pan Right' });
		this.setVariableValues({ CurrentMtrNegStr: 'Pan Left' });
		this.setVariableValues({ CurrentMtrSpeed: 100 });
		this.setVariableValues({ PanInversion: 1 });
		this.setVariableValues({ TiltInversion: 1 });
		this.setVariableValues({ M3Inversion: 1 });
		this.setVariableValues({ M4Inversion: 1 });
		this.setVariableValues({ TN1Inversion: 1 });
		this.setVariableValues({ TN2Inversion: 1 });
		this.setVariableValues({ TN3Inversion: 1 });
		this.setVariableValues({ RollInversion: -1 });
		this.setVariableValues({ FocusInversion: 1 });
		this.setVariableValues({ CurrentMtrInversion: 'Normal' });
		this.setVariableValues({ LastPstID: -1 });
		this.setVariableValues({ CurrentMtrProf: -1 });
		this.setVariableValues({ SetLps: "[]" });
		this.setVariableValues({ SetPsts: "[]" });
	}

	fetchStartup(socket) {
		if (
			this._destroyed ||
			this.socket !== socket ||
			!socket?.isConnected
		) {
			return;
		}

		const commands = [];

		// Request configured number of presets
		for (let i = 0; i < this.config.startupPstAmount; i++) {
			commands.push(`G752 P${i}`);
		}

		// Request motor performance information
		for (const id of this.performanceQueryIds) {
			commands.push(`G101 M${id}`);
		}

		// Request virtual stop A positions
		for (const id of this.stopQueryIds) {
			commands.push(`G215 M${id}`);
		}

		// Request virtual stop B positions
		for (const id of this.stopQueryIds) {
			commands.push(`G216 M${id}`);
		}

		// Let the existing command queue control the sending rate
		for (const command of commands) {
			this.queueBackgroundQuery(command);
		}

		this.log(
			'info',
			`Queued ${commands.length} startup information requests`
		);
	}
}

runEntrypoint(eMotimoModuleInstance, UpgradeScripts);