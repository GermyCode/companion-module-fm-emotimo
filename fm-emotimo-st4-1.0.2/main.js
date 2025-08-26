const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const { variableList } = require('./variables')
// const UpdatePresets = require('./presets')

const presets = require('./presets')

const config = require('./config')
const { MODELS } = require('./models.js')

class eMotimoModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			// 	...config,
			// 	...UpdateActions,
			// 	...UpdateFeedbacks,
			// ...UpdateVariableDefinitions,
			...presets,
		})
	}

	async init(config) {
		this.config = config
		this.log('debug', 'Instance Init');
		// this.updateStatus(InstanceStatus.Ok)

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
		this.config.model = this.config.model || 'ST4'
		this.config.startupPstAmount = this.config.startupPstAmount || 30
		this.config.interval = this.config.interval || 5000
		this.config.prot = 'tcp'

		if (this.config.prot == 'tcp') {
			this.init_tcp()

			this.init_tcp_variables()
		}

		this.init_emotimo_variables() //Moved this all to variables.js
		this.initPresets()

		// Give socket time to establish
		setTimeout(() => this.fetchAllPresets(), 1000)
	}

	// // Return config fields for web config
	// getConfigFields() {
	// 	return [
	// 		{
	// 			type: 'textinput',
	// 			id: 'host',
	// 			label: 'Target IP',
	// 			width: 8,
	// 			regex: Regex.IP,
	// 		},
	// 		{
	// 			type: 'textinput',
	// 			id: 'port',
	// 			label: 'Target Port',
	// 			width: 4,
	// 			regex: Regex.PORT,
	// 		},
	// 	]
	// }
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					"This module controls the ST4, ST4.3 and SA2.6",
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 4,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				default: 5000,
				regex: Regex.PORT,
			},
			{
				type: 'dropdown',
				id: 'prot',
				label: 'Connect with TCP / UDP',
				default: 'tcp',
				choices: [
					{ id: 'tcp', label: 'TCP' },
					{ id: 'udp', label: 'UDP' },
				],
			},
			{
				type: 'static-text',
				id: 'modelInfo',
				width: 12,
				label: 'Camera Model',
				value: 'Please Select the camera model.',
			},
			{
				type: 'dropdown',
				id: 'model',
				label: 'Select Your Camera Model',
				width: 6,
				default: MODELS[0].id,
				choices: MODELS,
				minChoicesForSearch: 5,
			},
			{
				type: 'static-text',
				id: 'startupPstAmountInfo',
				width: 12,
				label: 'Startup Preset Fetch',
				value: 'Fetches the first X presets on startup. If the positions are all 0, then it doesn\'t store it.',
			},
			{
				type: 'textinput',
				id: 'startupPstAmount',
				label: 'Fetch amount',
				width: 3,
				default: 30,
			},
			{
				type: 'static-text',
				id: 'intervalInfo',
				width: 12,
				label: 'Update Interval',
				value:
					'Please enter the amount of time in milliseconds to request new information from the device. Set to 0 to disable. Recomended 2000ms to get acurate positions.',
			},
			{
				type: 'textinput',
				id: 'interval',
				label: 'Update Interval',
				width: 3,
				default: 5000,
			},
			{
				type: 'static-text',
				id: 'dummy2',
				width: 12,
				label: ' ',
				value: ' ',
			},
		]
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
		var self = this;

		/*
		* create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
		* sending a string assumes 'utf8' encoding
		* which then escapes character values over 0x7F
		* and destroys the 'binary' content
		*/
		const sendBuf = Buffer.from(str + '\n', 'latin1')

		self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

		if (self.config.prot == 'tcp') {
			if (self.socket !== undefined && self.socket.isConnected) {
				self.socket.send(sendBuf)
			} else {
				self.log('debug', 'Socket not connected :(')
			}
		} else if (self.config.prot == 'udp') {
			if (self.udp !== undefined) {
				self.udp.send(sendBuf)
			} else {
				self.log('debug', 'UDP brokie :(')
			}
		}
	};

	handleTCPResponse = function (dataPacket) {
		var tokens = dataPacket.toString().split(':')

		this.log('debug', "Parse:" + tokens[0]);
		if (tokens[0].startsWith('Preset ') && !tokens[0].startsWith('Preset Set')) {
			const line = dataPacket.toString()
			const match = line.match(/Preset (\d+): X(-?\d+)\s+Y(-?\d+)\s+Z(-?\d+)\s+W(-?\d+).*?RunTime:\s*(\d+)\s+RampTime:\s*(\d+)/)
		
			if (match) {
				const [, preset, pan, tilt, m3, m4, run, ramp] = match.map(Number)
				
				// Check if it's an "active" preset
				const isActive = pan !== 0 || tilt !== 0 || m3 !== 0 || m4 !== 0 || run !== 50 || ramp !== 10

				if (isActive) {
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
			}
		}
		else {
			switch (tokens[0]) {
				case 'Positions':
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
					this.setVariableValues({ MPos: Number(data[4])})
					this.setVariableValues({ FPos: Number(data[5])})
					this.setVariableValues({ IPos: Number(data[6])})
					this.setVariableValues({ ZPos: Number(data[7])})
					// this.setVariableValues({ RPos: Number(data[8])})
					break
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
						var m4pos = this.getVariableValue('MPos')

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
					break
				// preset stuff here
				case 'Exiting Loop':
					this.setVariableValues({ LpActive: -1 })
					this.checkFeedbacks("LoopStatus")
					break
				case 'Stop All Initiated':
					this.setVariableValues({ LpActive: -1 })
					this.checkFeedbacks("LoopStatus")
					this.setVariableValues({ LastPstID: -1 })
					break
				case 'Reset Stops':
					var data = tokens[1]
					this.log('debug', "Motor:" + data); //Data[0] is empty there is a space here
					if (data == 1) {
						this.setVariableValues({ PanStopA: 0 })
						this.setVariableValues({ PanStopB: 0 })
						this.log('debug', "Pan Cleared");
					} else if (data == 2) {
						this.setVariableValues({ TiltStopA: 0 })
						this.setVariableValues({ TiltStopB: 0 })
					} else if (data == 3) {
						this.setVariableValues({ M3StopA: 0 })
						this.setVariableValues({ M3StopB: 0 })
					} else if (data == 4) {
						this.setVariableValues({ M4StopA: 0 })
						this.setVariableValues({ M4StopB: 0 })
					} else if (data == 5) {
						this.setVariableValues({ TNFocusStopA: 0 })
						this.setVariableValues({ TNFocusStopB: 0 })
					} else if (data == 6) {
						this.setVariableValues({ TNIrisStopA: 0 })
						this.setVariableValues({ TNIrisStopB: 0 })
					} else if (data == 7) {
						this.setVariableValues({ TNZoomStopA: 0 })
						this.setVariableValues({ TNZoomStopB: 0 })
					} else if (data == 8) {
						this.setVariableValues({ RSRollStopA: 0 })
						this.setVariableValues({ RSRollStopB: 0 })
					} else if (data == 9) {
						this.setVariableValues({ RSFocusStopA: 0 })
						this.setVariableValues({ RSFocusStopB: 0 })
					} else {
						this.log('debug', "Error");
					}
					this.checkFeedbacks("StopAStatus")
					this.checkFeedbacks("StopBStatus")
					this.checkFeedbacks("StopAStatusSmart")
					this.checkFeedbacks("StopBStatusSmart")
					break
				case 'StopA':
					var data = tokens[1].split(',')
					this.log('debug', "ID:" + data[0] + ":" + data[1]); //Data[0] is empty there is a space here
					var motor = data[0]
					var position = data[1]
					if (position != "-2000000000") {
						if (motor == 1) {
							this.setVariableValues({ PanStopA: 1 })
						} else if (motor == 2) {
							this.setVariableValues({ TiltStopA: 1 })
						} else if (motor == 3) {
							this.setVariableValues({ M3StopA: 1 })
						} else if (motor == 4) {
							this.setVariableValues({ M4StopA: 1 })
						} else if (motor == 5) {
							this.setVariableValues({ TNFocusStopA: 1 })
						} else if (motor == 6) {
							this.setVariableValues({ TNIrisStopA: 1 })
						} else if (motor == 7) {
							this.setVariableValues({ TNZoomStopA: 1 })
						} else if (motor == 8) {
							this.setVariableValues({ RSRollStopA: 1 })
						} else if (motor == 9) {
							this.setVariableValues({ RSFocusStopA: 1 })
						}
					} else {
						if (motor == 1) {
							this.setVariableValues({ PanStopA: 0 })
						} else if (motor == 2) {
							this.setVariableValues({ TiltStopA: 0 })
						} else if (motor == 3) {
							this.setVariableValues({ M3StopA: 0 })
						} else if (motor == 4) {
							this.setVariableValues({ M4StopA: 0 })
						} else if (motor == 5) {
							this.setVariableValues({ TNFocusStopA: 0 })
						} else if (motor == 6) {
							this.setVariableValues({ TNIrisStopA: 0 })
						} else if (motor == 7) {
							this.setVariableValues({ TNZoomStopA: 0 })
						} else if (motor == 8) {
							this.setVariableValues({ RSRollStopA: 0 })
						} else if (motor == 9) {
							this.setVariableValues({ RSFocusStopA: 0 })
						}
					}
					this.checkFeedbacks("StopAStatus")	
					this.checkFeedbacks("StopAStatusSmart")
					break
				case 'StopB':
					var data = tokens[1].split(',')
					this.log('debug', "ID:" + data[0] + ":" + data[1]); //Data[0] is empty there is a space here
					var motor = data[0]
					var position = data[1]
					if (position != "-2000000000") {
						if (motor == 1) {
							this.setVariableValues({ PanStopB: 1 })
						} else if (motor == 2) {
							this.setVariableValues({ TiltStopB: 1 })
						} else if (motor == 3) {
							this.setVariableValues({ M3StopB: 1 })
						} else if (motor == 4) {
							this.setVariableValues({ M4StopB: 1 })
						} else if (motor == 5) {
							this.setVariableValues({ TNFocusStopB: 1 })
						} else if (motor == 6) {
							this.setVariableValues({ TNIrisStopB: 1 })
						} else if (motor == 7) {
							this.setVariableValues({ TNZoomStopB: 1 })
						} else if (motor == 8) {
							this.setVariableValues({ RSRollStopB: 1 })
						} else if (motor == 9) {
							this.setVariableValues({ RSFocusStopB: 1 })
						}
					} else {
						if (motor == 1) {
							this.setVariableValues({ PanStopB: 0 })
						} else if (motor == 2) {
							this.setVariableValues({ TiltStopB: 0 })
						} else if (motor == 3) {
							this.setVariableValues({ M3StopB: 0 })
						} else if (motor == 4) {
							this.setVariableValues({ M4StopB: 0 })
						} else if (motor == 5) {
							this.setVariableValues({ TNFocusStopB: 0 })
						} else if (motor == 6) {
							this.setVariableValues({ TNIrisStopB: 0 })
						} else if (motor == 7) {
							this.setVariableValues({ TNZoomStopB: 0 })
						} else if (motor == 8) {
							this.setVariableValues({ RSRollStopB: 0 })
						} else if (motor == 9) {
							this.setVariableValues({ RSFocusStopB: 0 })
						}
					}
					this.checkFeedbacks("StopBStatus")
					this.checkFeedbacks("StopBStatusSmart")
					break
				case 'All Stops Cleared':
					this.setVariableValues({ PanStopA: 0 })
					this.setVariableValues({ PanStopB: 0 })
					this.setVariableValues({ TiltStopA: 0 })
					this.setVariableValues({ TiltStopB: 0 })
					this.setVariableValues({ M3StopA: 0 })
					this.setVariableValues({ M3StopB: 0 })
					this.setVariableValues({ M4StopA: 0 })
					this.setVariableValues({ M4StopB: 0 })
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
					this.checkFeedbacks("StopAStatus")
					this.checkFeedbacks("StopBStatus")
					this.checkFeedbacks("StopAStatusSmart")
					this.checkFeedbacks("StopBStatusSmart")
					break
				default:
					break
			}
		}
	}

	init_tcp() {
		this.log('debug', "Init TCP");
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.log('debug', "Opening TCP:" + this.config.host.toString() + ":" + this.config.port.toString());
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

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
				//Insert TCP Parsing Here
				this.handleTCPResponse(data)
			})

			// clear old heartbeat
			if (this.heartbeatInterval) {
				clearInterval(this.heartbeatInterval)
			}

			this.log('debug', "Heartbeat Initialized");
			this.heartbeatInterval = setInterval(() => {
				// var cmd = '\x45\x4D\x07\x00\x00\xC1\xA4';
				this.sendEmotimoAPICommand('G500');
				setTimeout(() => this.sendEmotimoAPICommand('G999'), 100);
			}, this.config.interval)

		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp_variables() {
		// this.setVariableDefinitions([{ name: 'Last TCP Response', variableId: 'tcp_response' }]) //Calling this function overwrites other variables already declared we want to declare them all in variables.js

		this.setVariableValues({ tcp_response: '' })
	}

	init_emotimo_variables() {
		// this.setVariableDefinitions([
		// 	{ name: 'FocusPosition', variableId: 'FPos' },
		// 	{ name: 'IrisPosition', variableId: 'IPos' },
		// 	{ name: 'ZoomPosition', variableId: 'ZPos' },
		// ])

		this.setVariableValues({ PPos: 0 })
		this.setVariableValues({ TPos: 0 })
		this.setVariableValues({ SPos: 0 })
		this.setVariableValues({ MPos: 0 })
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
		this.setVariableValues({ MStep: 1000 })
		this.setVariableValues({ FStep: 50 })
		this.setVariableValues({ IStep: 50 })
		this.setVariableValues({ ZStep: 50 })
		this.setVariableValues({ RStep: 1 })
		this.setVariableValues({ PanSpeedLimit: 100 })
		this.setVariableValues({ TiltSpeedLimit: 100 })
		this.setVariableValues({ M3SpeedLimit: 100 })
		this.setVariableValues({ M4SpeedLimit: 100 })
		this.setVariableValues({ TN1SpeedLimit: 50 })
		this.setVariableValues({ TN2SpeedLimit: 50 })
		this.setVariableValues({ TN3SpeedLimit: 50 })
		this.setVariableValues({ RollSpeedLimit: 100 })
		this.setVariableValues({ FocusSpeedLimit: 100 })
		this.setVariableValues({ PanCruiseSpeed: 0 })
		this.setVariableValues({ TiltCruiseSpeed: 0 })
		this.setVariableValues({ M3CruiseSpeed: 0 })
		this.setVariableValues({ M4CruiseSpeed: 0 })
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
		this.setVariableValues({ M3StopA: 0 })
		this.setVariableValues({ M3StopB: 0 })
		this.setVariableValues({ M4StopA: 0 })
		this.setVariableValues({ M4StopB: 0 })
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
		this.setVariableValues({ M3Inversion: 1 })
		this.setVariableValues({ M4Inversion: 1 })
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

	fetchAllPresets() {
		let i = 0

		const sendNext = () => {
			if (i >= 128) {
				this.log('debug', 'Finished fetching all presets')
				return
			}
			if (this.socket && this.socket.isConnected) {
				this.socket.once('data', (data) => {
					const str = data.toString().trim()

					// Check for default (empty) preset
					if (str === `Preset ${i}: X0 Y0 Z0 W0 F0 I0 C0 RunTime: 50 RampTime: 10`) {
						if (i <= this.config.startupPstAmount ) {
							this.log('debug', `Preset ${i} is empty.`)
						}
						var preset = this.getVariableValue('CurrentPstSet')
						var panpos = this.getVariableValue('Pst' + preset + 'PanPos')
						var tiltpos = this.getVariableValue('Pst' + preset + 'TiltPos')
						var m3pos = this.getVariableValue('Pst' + preset + 'M3Pos')
						var m4pos = this.getVariableValue('Pst' + preset + 'M4Pos')
						this.setVariableValues({ CurrentPstPanPos: panpos })
						this.setVariableValues({ CurrentPstTiltPos: tiltpos })
						this.setVariableValues({ CurrentPstM3Pos: m3pos })
						this.setVariableValues({ CurrentPstM4Pos: m4pos })
						if (i >= this.config.startupPstAmount) {
							this.log('debug', `Finished fetching startup presets.`)
							return
						}
					}

					// Continue processing
					this.handleTCPResponse(data)
	
					i++
					setTimeout(sendNext, 100)
				})
				this.log('debug', `Sending: G752 P${i}`)
				this.sendEmotimoAPICommand(`G752 P${i}`)
			} else {
				this.log('warn', 'Socket not connected')
			}
		}
		sendNext()
	}
}

runEntrypoint(eMotimoModuleInstance, UpgradeScripts)
