const { combineRgb } = require('@companion-module/base')
const { COLORS } = require('./color.js')
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
} = require('./lists')
module.exports = async function (self) {

	self.setFeedbackDefinitions({
		ChannelState: {
			name: 'Example Feedback',
			type: 'boolean',
			label: 'Channel State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: (feedback) => {
				if(feedback.options.num > 5) {
					return true
				} else {
					return false
				}
			},
		},
		MovingStatus: {
			name: 'Moving Status',
			type: 'boolean',
			label: 'Moving Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				if (self.getVariableValue('IsMoving')) {
					return true;
				}
				return false;
			},
		},
		SetPreset: {
			name: 'Set Preset',
			type: 'boolean',
			label: 'Channel State',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'settype',
					type: 'dropdown',
					label: 'Set Type',
					default: 'smart',
					choices: [
						{ id: 'id', label: 'ID' },
						{ id: 'smart', label: 'Smart' },
					],
					tooltip: 'Smart: The current preset selected\nPreset: Select a specific preset to change',
				},
				{
					type: 'textinput',
					id: 'id',
					label: 'Preset ID',
					default: '0',
					useVariables: { local: true },
					regex: '/^(?:([0-9]|[1-9][0-9]|1[01][0-9]|12[0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-127) or a variable',
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (feedback) => {
				let preset;
				if (feedback.options.settype === 'id') { // Not Smart type
					// const s = (await self.parseVariablesInString(feedback.options.id)).trim()
					// preset = Number(s)
					preset = Number(feedback.options.id)
					if (!Number.isFinite(preset) || preset < 0 || preset > 127) {
						self.log('warn', `Feedback SetPreset: Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					preset = self.getVariableValue('CurrentPstSet')
				}

				if (self.getVariableValue(`Pst${preset}Stat`)) {
					return true
				}
				return false
			},
		},
		CurrentPreset: {
			name: 'Current Recalled Preset',
			type: 'boolean',
			label: 'Current Recalled Preset',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'settype',
					type: 'dropdown',
					label: 'Set Type',
					default: 'smart',
					choices: [
						{ id: 'id', label: 'ID' },
						{ id: 'smart', label: 'Smart' },
					],
					tooltip: 'Smart: The current preset selected\nPreset: Select a specific preset to change',
				},
				{
					type: 'textinput',
					id: 'id',
					label: 'Preset ID',
					default: '0',
					useVariables: { local: true },
					regex: '/^(?:([0-9]|[1-9][0-9]|1[01][0-9]|12[0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-127) or a variable',
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (feedback) => {
				let preset;
				if (feedback.options.settype === 'id') { // Not Smart type
					// const s = (await self.parseVariablesInString(feedback.options.id)).trim()
					// preset = Number(s)
					preset = Number(feedback.options.id)
					if (!Number.isFinite(preset) || preset < 0 || preset > 127) {
						self.log('warn', `Feedback CurrentPreset: Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					preset = self.getVariableValue('CurrentPstSet')
				}
				if (preset === self.getVariableValue('LastPstID')) {
					return true;
				}
				return false;
			},
		},
		SetLoop: {
			name: 'Set Loop',
			type: 'boolean',
			label: 'Channel State',
			defaultStyle: {
				bgcolor: combineRgb(102, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'settype',
					type: 'dropdown',
					label: 'Set Type',
					default: 'smart',
					choices: [
						{ id: 'id', label: 'ID' },
						{ id: 'smart', label: 'Smart' },
					],
					tooltip: 'Smart: The current preset selected\nPreset: Select a specific preset to change',
				},
				{
					type: 'textinput',
					id: 'id',
					label: 'Loop ID',
					default: '0',
					useVariables: { local: true },
					regex: '/^(?:([0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-7) or a variable',
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (feedback) => {
				let preset;
				if (feedback.options.settype === 'id') { // Not Smart type
					// const s = (await self.parseVariablesInString(feedback.options.id)).trim()
					// preset = Number(s)
					preset = Number(feedback.options.id)
					if (!Number.isFinite(preset) || preset < 0 || preset > 127) {
						self.log('warn', `Feedback SetLoop: Loop must be 0-7; got ${s}`)
						return;
					}
				} else {
					preset = self.getVariableValue('CurrentPstSet')
				}
				let setlps = []
				try { // convert the "[]" to []
					setlps = JSON.parse(this.getVariableValue('SetLps')) || []
				} catch (e) {
					setlps = []
				}

				// self.log('warn', 'setlps', setlps)

				if (setlps.includes(String(preset))) {
					return true
				}
				return false
			},
		},
		LoopStatus: {
			name: 'Looping Status',
			type: 'boolean',
			label: 'Looping Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				var state = self.getVariableValue('LpActive')
				if(state >= 0) {
					return true
				} else {
					return false
				}
			},
		},
		CurrentLooping: {
			name: 'Current Looping',
			type: 'boolean',
			label: 'Current Looping',
			defaultStyle: {
				bgcolor: COLORS.MEDIUM_GREEN,
				color: COLORS.BLACK,
			},
			options: [
				{
					id: 'settype',
					type: 'dropdown',
					label: 'Set Type',
					default: 'smart',
					choices: [
						{ id: 'id', label: 'ID' },
						{ id: 'smart', label: 'Smart' },
					],
					tooltip: 'Smart: The current preset selected\nPreset: Select a specific preset to change',
				},
				{
					type: 'textinput',
					id: 'id',
					label: 'Preset ID',
					default: '0',
					useVariables: { local: true },
					regex: '/^(?:([0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (-1 -> 7) or a variable',
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (feedback) => {
				let preset;
				if (feedback.options.settype === 'id') { // Not Smart type
					// const s = (await self.parseVariablesInString(feedback.options.id)).trim()
					// preset = Number(s)
					preset = Number(feedback.options.id)
					if (!Number.isFinite(preset) || preset < 0 || preset > 7) {
						self.log('warn', `Feedback CurrentLooping: Preset must be -1 -> 7; got ${s}`)
						return;
					}
				} else {
					preset = self.getVariableValue('CurrentLpSet')
				}
				if (self.getVariableValue('LpActive') === preset) {
					return true;
				}
				return false;
			},
		},
		StopAStatus: {
			name: 'Stop A Status',
			type: 'boolean',
			label: 'Stop A Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: (feedback) => {
				var state = 0

				if (feedback.options.id_mot == 1) {
					state = self.getVariableValue('PanStopA')
				} else if (feedback.options.id_mot == 2) {
					state = self.getVariableValue('TiltStopA')
				} else if (feedback.options.id_mot == 3) {
					state = self.getVariableValue('M3StopA')
				} else if (feedback.options.id_mot == 4) {
					state = self.getVariableValue('M4StopA')
				} else if (feedback.options.id_mot == 5) {
					state = self.getVariableValue('TNFocusStopA')
				} else if (feedback.options.id_mot == 6) {
					state = self.getVariableValue('TNIrisStopA')
				} else if (feedback.options.id_mot == 7) {
					state = self.getVariableValue('TNZoomStopA')
				} else if (feedback.options.id_mot == 8) {
					state = self.getVariableValue('RSRollStopA')
				} else if (feedback.options.id_mot == 9) {
					state = self.getVariableValue('RSFocusStopA')
				}

				if(state == 1) {
					// feedback.defaultStyle.bgcolor = combineRgb(127, 0, 0)
					return true
				} else {
					// feedback.defaultStyle.bgcolor = combineRgb(0, 127, 0)
					return false
				}
			},
		},
		StopBStatus: {
			name: 'Stop B Status',
			type: 'boolean',
			label: 'Stop B Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: (feedback) => {
				var state = 0

				if (feedback.options.id_mot == 1) {
					state = self.getVariableValue('PanStopB')
				} else if (feedback.options.id_mot == 2) {
					state = self.getVariableValue('TiltStopB')
				} else if (feedback.options.id_mot == 3) {
					state = self.getVariableValue('M3StopB')
				} else if (feedback.options.id_mot == 4) {
					state = self.getVariableValue('M4StopB')
				} else if (feedback.options.id_mot == 5) {
					state = self.getVariableValue('TNFocusStopB')
				} else if (feedback.options.id_mot == 6) {
					state = self.getVariableValue('TNIrisStopB')
				} else if (feedback.options.id_mot == 7) {
					state = self.getVariableValue('TNZoomStopB')
				} else if (feedback.options.id_mot == 8) {
					state = self.getVariableValue('RSRollStopB')
				} else if (feedback.options.id_mot == 9) {
					state = self.getVariableValue('RSFocusStopB')
				}

				if(state == 1) {
					// feedback.defaultStyle.bgcolor = combineRgb(127, 0, 0)
					return true
				} else {
					// feedback.defaultStyle.bgcolor = combineRgb(0, 127, 0)
					return false
				}
			},
		},
		StopAStatusSmart: {
			name: 'Stop A Status Smart',
			type: 'boolean',
			label: 'Stop A Status Smart',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				var motorID = self.getVariableValue('CurrentMtrSet')
				var state = undefined

				if (motorID == 1) {
					state = self.getVariableValue('PanStopA')
				} else if (motorID == 2) {
					state = self.getVariableValue('TiltStopA')
				} else if (motorID == 3) {
					state = self.getVariableValue('M3StopA')
				} else if (motorID == 4) {
					state = self.getVariableValue('M4StopA')
				} else if (motorID == 5) {
					state = self.getVariableValue('TNFocusStopA')
				} else if (motorID == 6) {
					state = self.getVariableValue('TNIrisStopA')
				} else if (motorID == 7) {
					state = self.getVariableValue('TNZoomStopA')
				} else if (motorID == 8) {
					state = self.getVariableValue('RSRollStopA')
				} else if (motorID == 9) {
					state = self.getVariableValue('RSFocusStopA')
				}

				if(state) {
					return true
				} else {
					return false
				}
			},
		},
		StopBStatusSmart: {
			name: 'Stop B Status Smart',
			type: 'boolean',
			label: 'Stop B Status Smart',
			defaultStyle: {
				bgcolor: combineRgb(0, 127, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				var motorID = self.getVariableValue('CurrentMtrSet')
				var state = undefined

				if (motorID == 1) {
					state = self.getVariableValue('PanStopB')
				} else if (motorID == 2) {
					state = self.getVariableValue('TiltStopB')
				} else if (motorID == 3) {
					state = self.getVariableValue('M3StopB')
				} else if (motorID == 4) {
					state = self.getVariableValue('M4StopB')
				} else if (motorID == 5) {
					state = self.getVariableValue('TNFocusStopB')
				} else if (motorID == 6) {
					state = self.getVariableValue('TNIrisStopB')
				} else if (motorID == 7) {
					state = self.getVariableValue('TNZoomStopB')
				} else if (motorID == 8) {
					state = self.getVariableValue('RSRollStopB')
				} else if (motorID == 9) {
					state = self.getVariableValue('RSFocusStopB')
				}

				// console.log("B Status: " + state + " Motor: " + motorID +"\n")
				if(state) {
					return true
				} else {
					return false
				}
			},
		},
		MotorProfileSatus: {
			name: 'Motor Profile Satus',
			type: 'boolean',
			label: 'Motor Profile Satus',
			defaultStyle: {
				bgcolor: COLORS.MEDIUM_LAVENDER,
				color: COLORS.WHITE,
			},
			options: [
				{
					type: 'dropdown',
					id: 'id_prof',
					label: 'Motor ID',
					default: 5,
					choices: MOTOR_PROFILES,
				},
			],
			callback: (feedback) => {
				var prof = MOTOR_PROFILES.find(m => m.id === feedback.options.id_prof).label
				if (self.getVariableValue('CurrentMtrProf') === prof) var state = 1;
				if(state === 1) {
					return true
				} else {
					return false
				}
			},
		},
		// CurrentAxisSpeed: {
			//Can we use a feedback to dynamically change the Current Axis Speed Text
		// }
	})
}


// heldFeedback: {
		// 	type: 'boolean',
		// 	name: 'Button Hold Time Reached',
		// 	description: 'Indicate if button is held long enough for secondary action',
		// 	defaultStyle: {
		// 		color: combineRgb(0, 0, 0),//COLORS.BLACK,
		// 		bgcolor: combineRgb(255, 255, 0),//COLORS.YELLOW,
		// 	},
		// 	options: [],
		// 	callback: function () {
		// 		return self.state.heldThresholdReached
		// 	},
		// },