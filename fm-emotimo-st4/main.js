const { InstanceBase, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const { variableList } = require('./variables')
// const UpdatePresets = require('./presets')

const presets = require('./presets')

const config = require('./config')

class eMotimoModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
				...config,
			// 	...UpdateActions,
			// 	...UpdateFeedbacks,
			// ...UpdateVariableDefinitions,
			...presets,
		})

		this.commandQueue = [];
		this.commandInFlight = false;
		this.sendDelayMs = 100;
	}

	async init(config) {
		this.config = config
		this.log('debug', 'Instance Init');

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		// this.updatePresets()

		await this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.log('debug', "Config Updated");

		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config

		this.config.host = this.config.host || ''
		this.config.port = this.config.port || 5000
		this.config.model = this.config.model || 'Spectrum ST4'
		this.config.startupPstAmount = this.config.startupPstAmount || 30
		this.config.interval = this.config.interval || 5000
		this.config.prot = 'tcp'
		this.fetchStat = false
		this.motorCount = this.config.model === 'Spectrum ST4' ? 4 : 0; this.log('err' , 'Error getting motor count'); //(this.config.model === 'Spectrum ST4.3') ? 6 : (this.config.model === 'SA2.6 Conductor') ? 9 : 

		if (this.config.prot == 'tcp') {
			this.init_tcp()

			this.init_tcp_variables()
		}

		this.init_emotimo_variables()
		this.initPresets()

		// Give socket time to establish
		if (config.fetch) setTimeout(() => this.fetchStartup(), (this.config.interval));
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	sendEmotimoAPICommand = function (str) {
		if (str === 'G500') {
			this.commandQueue.unshift(str);
		} else {
			this.commandQueue.push(str);
		}
		if (this.commandQueue.length > 1) this.log('err', 'more than 1 enqueue: ' + this.commandQueue)
		this.processQueue();
	}

	async processQueue() {
		if (this.commandInFlight) return;           // one already in flight
		if (this.commandQueue.length === 0) return; // nothing waiting

		this.log('debug', 'Command queue: ' + this.commandQueue)

		const cmd = this.commandQueue.shift();
		this.commandInFlight = true;

		// actually send it
		this._sendNow(cmd);
	}

	_sendNow = function (str) {
		/*
		* create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
		* sending a string assumes 'utf8' encoding
		* which then escapes character values over 0x7F
		* and destroys the 'binary' content
		*/

		const sendBuf = Buffer.from(str + '\n', 'latin1')

		this.log('debug', 'sending to ' + this.config.host + ': ' + sendBuf.toString())

		if (this.socket !== undefined && this.socket.isConnected) {
			try {
				this.socket.send(sendBuf);
			} catch (err) {
				this.log('error', `Send failed: ${err.message}`);
				this.commandInFlight = false;
			}
		} else {
			this.log('error', 'Module: Socket not connected :(')
			this.commandInFlight = false; // free up if failed
		}
	};

	init_tcp() {
		this.log('debug', "Init TCP");
		// if theres a socket already connected, remove it
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		// if the host ip config feild is empty, return
		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig)
			return;
		}
		this.log('debug', "Opening TCP:" + this.config.host.toString() + ":" + this.config.port.toString());
		this.socket = new TCPHelper(this.config.host, this.config.port)
		if (this.config.host == '') {
			this.socket.isConnected == false
		}

		this.socket.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})

		this.socket.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'Module: Network error: ' + err.message)
			// restart the whole module
			this._onDead('Network error: ' + err.message)
		})

		this.socket.on('close', (res) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, res.message)
			this.log('error', 'Module: Network error: ' + res.message)
			// restart the whole module
			this._onDead('Connection closed by emotimo: ' + res.message)
		})

		/*
		States that when data is recieved, do this,
		if the save response config is enabled then it saves the response as a variable in companion
		then send the data recieved to get delt with
		*/
		this.socket.on('data', (data) => {
			this.log('debug', 'Response: ' + data.toString());
			if (this.config.saveresponse) {
				let dataResponse = data

				if (this.config.convertresponse == 'string') {
					dataResponse = data.toString()
				} else if (this.config.convertresponse == 'hex') {
					dataResponse = data.toString('hex')
				}

				this.setVariableValues({ tcp_response: dataResponse })
			}
			// command queue processing
			setTimeout(() => {
				this.commandInFlight = false;
				this.processQueue(); // send next
			}, this.sendDelayMs);
			// TCP Parsing Here
			this.handleTCPResponse(data)
		})

		// if there is still a heartbeat going, remove it
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval)
		}

		// this._markRx() // mark the last response date
		this.pending = false // not currently waiting on a response

		// initialize new heartbeat
		this.heartbeatInterval = setInterval(() => {
			if (!this.socket?.isConnected) { // if the socket is not connected
				this.log('error', 'Module: Socket not connected for heartbeat :(')
				return;
			}
			if (this.retryCount > 5) {
				this.retryCount = 0
				this._onDead('Retry cap reached')
				return;
			}
			if (this.pending) { // if were already waiting on a response dont send another
				this.log('debug', 'Already waiting on a heartbeat response')
				this.updateStatus(InstanceStatus.Connecting, 'Lost connection, trying to reconnect');
				this.retryCount++;
				return; 
			}
			if (this.fetchStat) return;
			this.pending = true;
			const cmd = 'G500'
			this.sendEmotimoAPICommand(cmd)
			this.retryCount = 0
		}, this.config.interval)
		this.log('debug', "Heartbeat Initialized");
	}

	_cleanupSocket() {
		if (this.heartbeatInterval) { clearInterval(this.heartbeatInterval); this.heartbeatInterval = null }

		if (this.commandQueue) this.commandQueue = null

		if (this.socket) {
			try { this.socket.removeAllListeners() } catch {}
			try { this.socket.destroy() } catch {}
			this.socket = null
		}
	}

	_scheduleReconnect(reason = 'unknown') {
		if (this._reconnectTimer) return // already scheduled
		if (!this._backoff) this._backoff = 2000 // starts at 2s then doubles every try
		const delay = this._backoff
		this._backoff = Math.min(this._backoff * 2, 10000) // cap at 10s
		this.log('error', `Reconnecting (reason: ${reason}) in ${delay}ms`)
		this._reconnectTimer = setTimeout(() => {
			this._reconnectTimer = null
			this.init_tcp()
		}, delay)
	}

	_onDead(origin = 'unknown') {
		this.log('error', `Connection marked dead via ${origin}`)
		this._cleanupSocket()
		this._scheduleReconnect(origin)
	}

	handleTCPResponse = function (dataPacket) {
		var tokens = dataPacket.toString().split(':')

		this.log('debug', "Parse:" + tokens[0]);
		switch (tokens[0]) {
			// response from the G500 command
			case 'Positions':
				if (this.pending) {
					this.pending = false;
					this.updateStatus(InstanceStatus.Ok, 'Connection Active')
				}
				var data = tokens[1].split(',')
				// this.log('debug', "Position Update:" + data[0] + ":" + data[1]); //Data[0] has movement flags led by a space data[1] is Pan Position
				if (parseInt(data[0]) !== 0) {
					if (this.getVariableValue('IsMoving') !== 1) {
						this.setVariableValues({ IsMoving: 1 })
					}
				} else if (this.getVariableValue('IsMoving') !== 0) {
					this.setVariableValues({ IsMoving: 0 })
				}
				this.setVariableValues({ PPos: Number(data[1])})
				this.setVariableValues({ TPos: Number(data[2])})
				this.setVariableValues({ SPos: Number(data[3])})
				this.setVariableValues({ ZPos: Number(data[4])})
				this.setVariableValues({ FPos: Number(data[5])})
				this.setVariableValues({ IPos: Number(data[6])})
				this.setVariableValues({ ZPos: Number(data[7])})
				// this.setVariableValues({ RPos: Number(data[8])})
				return;
			case 'Preset Set':
				var data = tokens[1].split(' ')
				this.log('debug', "ID:" + data[0] + ":" + data[1]); //Data[0] is empty there is a space here
				const presetId = data[1]
				if (!isNaN(presetId) && presetId >= 0) {
					this.setVariableValues({ [`Pst${presetId}Stat`]: 1 })

					let setpstsRaw = this.getVariableValue('SetPsts')
					let setpsts = []

					try {
						setpsts = JSON.parse(setpstsRaw) || []
					} catch (e) {
						setpsts = []
					}

					// Only add if not already present
					if (!setpsts.includes(presetId)) {
						setpsts.push(presetId)
						this.setVariableValues({ SetPsts: JSON.stringify(setpsts) })
					}

					var panpos = this.getVariableValue('PPos')
					var tiltpos = this.getVariableValue('TPos')
					var m3pos = this.getVariableValue('SPos')
					var m4pos = this.getVariableValue('ZPos')

					this.setVariableValues({ [`Pst${presetId}PanPos`]: panpos })
					this.setVariableValues({ [`Pst${presetId}TiltPos`]: tiltpos })
					this.setVariableValues({ [`Pst${presetId}M3Pos`]: m3pos })
					this.setVariableValues({ [`Pst${presetId}M4Pos`]: m4pos })

					if (presetId === this.getVariableValue('CurrentPstSet')) {
						this.setVariableValues({ CurrentPstPanPos: panpos })
						this.setVariableValues({ CurrentPstTiltPos: tiltpos })
						this.setVariableValues({ CurrentPstM3Pos: m3pos })
						this.setVariableValues({ CurrentPstM4Pos: m4pos })
					}
				}
				this.checkFeedbacks("SetPreset")
				this.checkFeedbacks("SetPresetSmart")
				return;
			case 'Exiting Loop':
				this.setVariableValues({ LpActive: -1 })
				this.checkFeedbacks("LoopStatus")
				return;
			case 'Stop All Initiated':
				this.setVariableValues({ LpActive: -1 })
				this.checkFeedbacks("LoopStatus")
				this.setVariableValues({ LastPstID: -1 })
				return;
			case 'Reset Stops':
				let motor = Number(tokens[1])
				if (motor != 0) {
					try { // map the motor id to a name using the MOTOR_ID object list // TO-DO make a general spot for MOTOR_ID and PRESET_ID instead of having to use UpdateActions.whatever
						var axis = UpdateActions.MOTOR_ID.find(m => m.id === motor).label
						this.setVariableValues({ [`${axis}StopA`]: 0 })
						this.setVariableValues({ [`${axis}StopB`]: 0 })
					}
					catch (e) {
						this.log('error', `couldn't find id: ${motor} in MOTOR_ID. Error: ${e}`)
					}
				} else { // reset all axis
					for (let i = 1; i <= this.motorCount; i++) {
						try { // map the motor id to a name using the MOTOR_ID object list // TO-DO make a general spot for MOTOR_ID and PRESET_ID instead of having to use UpdateActions.whatever
							var axis = UpdateActions.MOTOR_ID.find(m => m.id === i).label
							this.setVariableValues({ [`${axis}StopA`]: 0 })
							this.setVariableValues({ [`${axis}StopB`]: 0 })
						}
						catch (e) {
							this.log('error', `Couldn't find id: ${i} in MOTOR_ID. Error: ${e}`)
						}
					}
				}

				this.checkFeedbacks("StopAStatus")
				this.checkFeedbacks("StopBStatus")
				this.checkFeedbacks("StopAStatusSmart")
				this.checkFeedbacks("StopBStatusSmart")
				return;
			case 'Motor Profile Set':
				this.setVariableValues({ CurrentMtrProf: tokens[1].trim()})
				this.checkFeedbacks('MotorProfileSatus')
				return;
			default:
		}
		// other special responses //

		// Mainly for the fetch preset thing when it connects
		// response for the G752 Command (preset fetch)
		if (tokens[0].startsWith('Preset ')) {
			const line = dataPacket.toString()
			const match = line.match(/Preset (\d+): X(-?\d+)\s+Y(-?\d+)\s+Z(-?\d+)\s+W(-?\d+).*?RunTime:\s*(\d+)\s+RampTime:\s*(\d+)/)
		
			if (match) {
				this.pending = false
				const [, preset, pan, tilt, m3, m4, run, ramp] = match.map(Number)

				// Check if it's an "active" preset
				const isActive = pan !== 0 || tilt !== 0 || m3 !== 0 || m4 !== 0 || run !== 50 || ramp !== 10

				if (isActive) {
					// adding the active preset to the PRESET_ID list in the actions file
					if (!UpdateActions.PRESET_ID.some(p => p.id === preset)) {
						UpdateActions.PRESET_ID.push({ id: preset, label: `Pst${preset}`})
						this.updateActions()
					}

					variableList.push({ name: `Preset${preset}RunT`, variableId: `Pst${preset}RunT` })
					variableList.push({ name: `Preset${preset}RampT`, variableId: `Pst${preset}RampT` })
					variableList.push({ name: `Preset${preset}Status`, variableId: `Pst${preset}Stat` })
					variableList.push({ name: `Preset${preset}PanPos`, variableId: `Pst${preset}PanPos` })
					variableList.push({ name: `Preset${preset}TiltPos`, variableId: `Pst${preset}TiltPos` })
					variableList.push({ name: `Preset${preset}M3Pos`, variableId: `Pst${preset}M3Pos` })
					variableList.push({ name: `Preset${preset}M4Pos`, variableId: `Pst${preset}M4Pos` })

					this.setVariableDefinitions(variableList)

					this.setVariableValues({
						[`Pst${preset}Stat`]: 1,
						[`Pst${preset}PanPos`]: pan,
						[`Pst${preset}TiltPos`]: tilt,
						[`Pst${preset}M3Pos`]: m3,
						[`Pst${preset}M4Pos`]: m4,
						[`Pst${preset}RunT`]: run,
						[`Pst${preset}RampT`]: ramp,
					})
					if (preset === this.getVariableValue('CurrentPstSet')) {
						this.setVariableValues({ 'CurrentPstSetRun': run })
						this.setVariableValues({ 'CurrentPstSetRamp': ramp })
					}

					let setpstsRaw = this.getVariableValue('SetPsts')
					let setpsts = []

					try {
						setpsts = JSON.parse(setpstsRaw) || []
					} catch (e) {
						setpsts = []
					}

					// Only add if not already present
					if (!setpsts.includes(preset)) {
						setpsts.push(preset)
						this.setVariableValues({ SetPsts: JSON.stringify(setpsts) })
					}

					this.checkFeedbacks("SetPreset")
					this.checkFeedbacks("SetPresetSmart")
				}
				return;
			}
		}
		if (tokens[0].startsWith('Motor performance set for')) {
			let data = tokens[0].split(' ')
			let axis = data[4]
			// TO-DO TEMP NAMING FIX
			if (axis === 'M3') {
				axis = 'M3-Slide'
			} else if (axis === 'M4') {
				axis = 'M4-Zoom'
			}
			// if 
			// this.setVariableValues({ [`${CurrentMtrProf}`]: })
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
		// TO-DO TEMP NAMING FIX
		if (axis === 'M3') {
			axis = 'M3-Slide'
		} else if (axis === 'M4') {
			axis = 'M4-Zoom'
		}
		switch (stop) {
			case 'StopA':
				var positionRaw = tokens[1]
				if (axis === undefined) { // if its a normal response
					var [motor, positionRaw] = tokens[1].split(',')
					try { // map the motor id to a name using the MOTOR_ID object list // TO-DO make a general spot for MOTOR_ID and PRESET_ID instead of having to use UpdateActions.whatever
						axis = UpdateActions.MOTOR_ID.find(m => m.id === Number(motor)).label
					}
					catch (e) {
						this.log('error', `couldn't find id: ${motor} in MOTOR_ID. Error: ${e}`)
					}
				}
				var position = positionRaw.trim() // remove any \n or anything

				if (position != '-2000000000') {
					this.setVariableValues({ [`${axis}StopA`]: 1 })
				} else {
					this.setVariableValues({ [`${axis}StopA`]: 0 })
				}
				this.checkFeedbacks("StopAStatus")	
				this.checkFeedbacks("StopAStatusSmart")
				return;
			case 'StopB':
				var positionRaw = tokens[1]
				if (axis === undefined) { // if its a normal response
					var [motor, positionRaw] = tokens[1].split(',')
					try { // map the motor id to a name using the MOTOR_ID object list // TO-DO make a general spot for MOTOR_ID and PRESET_ID instead of having to use UpdateActions.whatever
						axis = UpdateActions.MOTOR_ID.find(m => m.id === Number(motor)).label
					}
					catch (e) {
						this.log('error', `couldn't find id: ${motor} in MOTOR_ID. Error: ${e}`)
					}
				}
				var position = positionRaw.trim() // remove any \n or anything

				if (position != '2000000000') {
					this.setVariableValues({ [`${axis}StopB`]: 1 })
				} else {
					this.setVariableValues({ [`${axis}StopB`]: 0 })
				}
				this.checkFeedbacks("StopBStatus")	
				this.checkFeedbacks("StopBStatusSmart")
				return;
		}
		this.log('error', 'ERROR Parsing Response: ' + dataPacket.toString())
	}

	init_tcp_variables() {
		// this.setVariableDefinitions([{ name: 'Last TCP Response', variableId: 'tcp_response' }]) //Calling this function overwrites other variables already declared we want to declare them all in variables.js

		this.setVariableValues({ tcp_response: '' })
	}

	init_emotimo_variables() {
		this.setVariableValues({ PPos: 0 })
		this.setVariableValues({ TPos: 0 })
		this.setVariableValues({ SPos: 0 })
		this.setVariableValues({ ZPos: 0 })
		this.setVariableValues({ FPos: 5000 })
		this.setVariableValues({ IPos: 5000 })
		this.setVariableValues({ ZPos: 5000 })
		this.setVariableValues({ RPos: 0 })
		if (this.config.model == 'SA2.6 Conductor') {
			this.setVariableValues({ TStep: 1 })
			this.setVariableValues({ PStep: 1 })
		} else {
			this.setVariableValues({ TStep: 1000 })
			this.setVariableValues({ PStep: 1000 })
		}
		this.setVariableValues({ SStep: 1000 })
		this.setVariableValues({ ZStep: 1000 })
		this.setVariableValues({ FStep: 50 })
		this.setVariableValues({ IStep: 50 })
		this.setVariableValues({ ZStep: 50 })
		this.setVariableValues({ RStep: 1 })
		this.setVariableValues({ PanSpeedLimit: 100 })
		this.setVariableValues({ TiltSpeedLimit: 100 })
		this.setVariableValues({ 'M3-SlideSpeedLimit': 100 })
		this.setVariableValues({ 'M4-ZoomSpeedLimit': 100 })
		this.setVariableValues({ TN1SpeedLimit: 50 })
		this.setVariableValues({ TN2SpeedLimit: 50 })
		this.setVariableValues({ TN3SpeedLimit: 50 })
		this.setVariableValues({ RollSpeedLimit: 100 })
		this.setVariableValues({ FocusSpeedLimit: 100 })
		this.setVariableValues({ PanCruiseSpeed: 0 })
		this.setVariableValues({ TiltCruiseSpeed: 0 })
		this.setVariableValues({ 'M3-SlideCruiseSpeed': 0 })
		this.setVariableValues({ 'M4-ZoomCruiseSpeed': 0 })
		this.setVariableValues({ TN1CruiseSpeed: 0 })
		this.setVariableValues({ TN2CruiseSpeed: 0 })
		this.setVariableValues({ TN3CruiseSpeed: 0 })
		this.setVariableValues({ RollCruiseSpeed: 0 })
		this.setVariableValues({ FocusCruiseSpeed: 0 })
		this.setVariableValues({ Pst0Stat: 0 })
		this.setVariableValues({ Pst0RunT: 50 })
		this.setVariableValues({ Pst0RampT: 10 })
		this.setVariableValues({ Lp0RunT: 50 })
		this.setVariableValues({ Lp0RampT: 10 })
		this.setVariableValues({ Lp0APoint: 0 })
		this.setVariableValues({ Lp0BPoint: 0 })
		this.setVariableValues({ LpActive: -1 })
		this.setVariableValues({ PanStopA: 0 })
		this.setVariableValues({ PanStopB: 0 })
		this.setVariableValues({ TiltStopA: 0 })
		this.setVariableValues({ TiltStopB: 0 })
		this.setVariableValues({ 'M3-SlideStopA': 0 })
		this.setVariableValues({ 'M3-SlideStopB': 0 })
		this.setVariableValues({ 'M4-ZoomStopA': 0 })
		this.setVariableValues({ 'M4-ZoomStopB': 0 })
		this.setVariableValues({ TNFocusStopA: 0 })
		this.setVariableValues({ TNFocusStopB: 0 })
		this.setVariableValues({ TNIrisStopA: 0 })
		this.setVariableValues({ TNIrisStopB: 0 })
		this.setVariableValues({ TNZoomStopA: 0 })
		this.setVariableValues({ TNZoomStopB: 0 })
		this.setVariableValues({ RSRollStopA: 0 })
		this.setVariableValues({ RSRollStopB: 0 })
		this.setVariableValues({ RSFocusStopA: 0 })
		this.setVariableValues({ RSFocusStopB: 0 })
		this.setVariableValues({ CurrentPstSet: 0 })
		this.setVariableValues({ CurrentPstSetRun: 50 })
		this.setVariableValues({ CurrentPstSetRamp: 10 })
		this.setVariableValues({ CurrentLpSet: 0 })
		this.setVariableValues({ CurrentLpA: 0 })
		this.setVariableValues({ CurrentLpB: 0 })
		this.setVariableValues({ CurrentLpRun: 50 })
		this.setVariableValues({ CurrentLpRamp: 10 })
		this.setVariableValues({ CurrentMtrSet: 1 })
		this.setVariableValues({ CurrentMtrStr: 'Pan' })
		this.setVariableValues({ CurrentMtrPosStr: 'Pan Right' })
		this.setVariableValues({ CurrentMtrNegStr: 'Pan Left' })
		this.setVariableValues({ CurrentMtrSpeed: 100 })
		this.setVariableValues({ PanInversion: 1 })
		this.setVariableValues({ TiltInversion: 1 })
		this.setVariableValues({ 'M3-SlideInversion': 1 })
		this.setVariableValues({ 'M4-ZoomInversion': 1 })
		this.setVariableValues({ TN1Inversion: 1 })
		this.setVariableValues({ TN2Inversion: 1 })
		this.setVariableValues({ TN3Inversion: 1 })
		this.setVariableValues({ RollInversion: -1 })
		this.setVariableValues({ FocusInversion: 1 })
		this.setVariableValues({ CurrentMtrInversion: 'Normal' })
		this.setVariableValues({ LastPstID: -1 })
		this.setVariableValues({ CurrentMtrProf: -1 })
		this.setVariableValues({ SetLps: "[0]" })
	}

	async fetchStartup() {
		this.fetchStat = true

		try {
			await this.fetchLoop('preset', 0, this.config.startupPstAmount, i => `G752 P${i}`)
			await this.fetchLoop('Stops A', 1, this.motorCount, i => `G215 M${i}`)
			await this.fetchLoop('Stops B', 1, this.motorCount, i => `G216 M${i}`)
			await this.fetchLoop('Motor Performance', 1, this.motorCount, i => `G101 M${i}`)

			this.log('debug', 'All startup fetches complete')
		} catch (err) {
			this.log('error', 'Fetch error: ' + err.message)
		}
		this.fetchStat = false
	}

	fetchLoop(label, min, max, commandBuilder) {
		return new Promise((resolve, reject) => {
			let i = min

			const sendNext = () => {
				if (!this.socket || !this.socket.isConnected) {
					reject(new Error(`${label}: socket not connected`))
					return
				}

				if (i > max) {
					this.log('debug', `Finished fetching ${label}`)
					resolve()
					return
				}

				this.sendEmotimoAPICommand(commandBuilder(i))
				i++
				setTimeout(sendNext, this.sendDelayMs * 1.5)
			}

			sendNext()
		})
	}
}

runEntrypoint(eMotimoModuleInstance, UpgradeScripts)
