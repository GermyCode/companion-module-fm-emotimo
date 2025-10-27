const { variableList } = require('./variables')
const {
	MOTOR_ID,
	TN_MOTOR_ID,
	DIRECTION_ID,
	MOTOR_SPEED,
	MOTOR_PROFILES,
	MOTOR_PROFILES_VELOCITIES,
	PRESET_ID,
	LOOP_ID,
	VIRTUAL_BUTTON,
	DEFAULTS
} = require('./lists')

const CHOICES_END = [
	{ id: '', label: 'None' },
	{ id: '\n', label: 'LF - \\n (Common UNIX/Mac)' },
	{ id: '\r\n', label: 'CRLF - \\r\\n (Common Windows)' },
	{ id: '\r', label: 'CR - \\r (Old MacOS)' },
	{ id: '\x00', label: 'NULL - \\x00 (Can happen)' },
	{ id: '\n\r', label: 'LFCR - \\n\\r (Just stupid)' },
]

const CHOICES_SET_TYPE = [
	{ id: 'id', label: 'ID' },
	{ id: 'smart', label: 'Smart' },
]

const CHOICES_SET = [
	{ id: 'set', label: 'Set Value' },
	{ id: 'up', label: 'Positive' },
	{ id: 'down', label: 'Negative' },
	{ id: 'reset', label: 'Reset' },
]

const PST_OPTIONS = [
	{
		type: 'dropdown',
		id: 'settype',
		label: 'Set Type',
		default: 'smart',
		choices: CHOICES_SET_TYPE,
		tooltip: 'Smart: The current preset selected\nID: Select a specific preset ID to change',
	},
	{
		type: 'dropdown',
		id: 'id',
		label: 'ID',
		default: 0,
		choices: PRESET_ID,
		isVisible: (options) => options.settype === 'id',
		tooltip: 'If you dont see a specific preset ID, make sure it is set first',
	},
	{
		type: 'dropdown',
		id: 'setopt',
		label: 'Set Options',
		default: 'set',
		choices: CHOICES_SET,
		tooltip: 'Set Value: set a specific value\nPositive: Increase by a value each time\nNegative: Decrease by a value each time\nReset: Reset to the default value',
	},
	{
		type: 'number',
		label: 'Value',
		id: 'setvalue',
		min: 10,
		max: 600,
		default: 50,
		isVisible: (options) => options.setopt === 'set'
	},
	{
		type: 'number',
		label: 'Value',
		id: 'ammount',
		min: 1,
		max: 600,
		default: 5,
		isVisible: (options) => options.setopt === 'up' || options.setopt === 'down'
	},
]

const LP_OPTIONS = [
	{
		type: 'dropdown',
		id: 'settype',
		label: 'Set Type',
		default: 'smart',
		choices: CHOICES_SET_TYPE,
		tooltip: 'Smart: The current loop selected\nID: Select a specific loop ID to change',
	},
	{
		type: 'dropdown',
		id: 'id',
		label: 'ID',
		default: 0,
		choices: LOOP_ID,
		isVisible: (options) => options.settype === 'id',
		tooltip: 'If you dont see a specific preset ID, make sure it is set first',
	},
	{
		type: 'dropdown',
		id: 'setopt',
		label: 'Set Options',
		default: 'set',
		choices: CHOICES_SET,
		tooltip: 'Set Value: set a specific value\nIncrement: Increase by a value each time\nDecrement: Decrease by a value each time\nReset: Reset to the default value',
	},
	{
		type: 'number',
		label: 'Value',
		id: 'setvalue',
		min: 0,
		max: 600,
		default: 50,
		isVisible: (options) => options.setopt === 'set'
	},
	{
		type: 'number',
		label: 'Value',
		id: 'ammount',
		min: 1,
		max: 600,
		default: 5,
		isVisible: (options) => options.setopt === 'up' || options.setopt === 'down'
	},
]

const MOTOR_OPTIONS = [
	{
		type: 'dropdown',
		id: 'settype',
		label: 'Set Type',
		default: 'smart',
		choices: CHOICES_SET_TYPE,
		tooltip: 'Smart: The current motor selected\nID: Select a specific motor ID to change',
	},
	{
		type: 'dropdown',
		id: 'id',
		label: 'Motor ID',
		default: 1,
		choices: MOTOR_ID,
		isVisible: (options) => options.settype === 'id',
	},
]

const DWELL_OPTIONS = [
	{
		type: 'dropdown',
		id: 'settype',
		label: 'Set Type',
		default: 'smart',
		choices: CHOICES_SET_TYPE,
		tooltip: 'Smart: The current loop selected\nID: Select a specific loop ID to change',
	},
	{
		type: 'dropdown',
		id: 'id',
		label: 'ID',
		default: 0,
		choices: LOOP_ID,
		isVisible: (options) => options.settype === 'id',
		tooltip: 'If you dont see a specific preset ID, make sure it is set first',
	},
	{
		type: 'dropdown',
		id: 'setopt',
		label: 'Set Options',
		default: 'set',
		choices: CHOICES_SET,
		tooltip: 'Set Value: set a specific value\nIncrement: Increase by a value each time\nDecrement: Decrease by a value each time\nReset: Reset to the default value',
	},
	{
		type: 'static-text',
		label: 'Info',
		value: 'In Miliseconds, 1000ms = 1 sec, default 500ms = 0.5 sec',
	},
	{
		type: 'number',
		label: 'Value',
		id: 'setvalue',
		min: 300,
		max: 60000,
		default: 500,
		isVisible: (options) => options.setopt === 'set'
	},
	{
		type: 'number',
		label: 'Value',
		id: 'ammount',
		min: 1,
		max: 60000,
		default: 100,
		isVisible: (options) => options.setopt === 'up' || options.setopt === 'down'
	},
]

makeNewLoop = function(self, id) {
	self.log('debug', `Loop ${id} does not exist yet. Adding now`)
	LOOP_ID.push({ id: id, label: `Lp${id}` })
	self.updateActions()

	variableList.push({ name: `Loop${id}RunT`, variableId: `Lp${id}RunT` })
	variableList.push({ name: `Loop${id}RampT`, variableId: `Lp${id}RampT` })
	variableList.push({ name: `Loop${id}APoint`, variableId: `Lp${id}APoint` })
	variableList.push({ name: `Loop${id}BPoint`, variableId: `Lp${id}BPoint` })
	variableList.push({ name: `Loop${id}DwellA`, variableId: `Lp${id}DwellA` })
	variableList.push({ name: `Loop${id}DwellB`, variableId: `Lp${id}DwellB` })

	self.setVariableDefinitions(variableList)

	self.setVariableValues({ [`Lp${id}RunT`]: 50 })
	self.setVariableValues({ [`Lp${id}RampT`]: 10 })
	self.setVariableValues({ [`Lp${id}APoint`]: 0 })
	self.setVariableValues({ [`Lp${id}BPoint`]: 0 })
	self.setVariableValues({ [`Lp${id}DwellA`]: 500 })
	self.setVariableValues({ [`Lp${id}DwellB`]: 500 })
}

makeNewPreset = function(self, id) {
	self.log('debug', `Preset ${id} does not exist yet. Adding now`)
	PRESET_ID.push({ id: id, label: `Pst${id}` })
	self.updateActions()

	variableList.push({ name: `Preset${id}RunT`, variableId: `Pst${id}RunT` })
	variableList.push({ name: `Preset${id}RampT`, variableId: `Pst${id}RampT` })
	variableList.push({ name: `Preset${id}Status`, variableId: `Pst${id}Stat` })
	variableList.push({ name: `Preset${id}PanPos`, variableId: `Pst${id}PanPos` })
	variableList.push({ name: `Preset${id}TiltPos`, variableId: `Pst${id}TiltPos` })
	variableList.push({ name: `Preset${id}M3Pos`, variableId: `Pst${id}M3Pos` })
	variableList.push({ name: `Preset${id}M4Pos`, variableId: `Pst${id}M4Pos` })

	self.setVariableDefinitions(variableList)

	self.setVariableValues({ [`Pst${id}RunT`]: 50 })
	self.setVariableValues({ [`Pst${id}RampT`]: 10 })
	self.setVariableValues({ [`Pst${id}Stat`]: 0 })
}

module.exports = function (self) {
	self.setActionDefinitions({

//============================
//  ***   MOTOR STUFFS   ***
//============================

		jogMotor: {
			name: 'Motor Jog',
			options: [...MOTOR_OPTIONS,
				{
					type: 'dropdown',
					id: 'id_speed',
					label: 'Motor Speed',
					default: 0,
					choices: MOTOR_SPEED,
					tooltip: 'Default: Uses the current motor profile speed'
				},
				{
					type: 'dropdown',
					id: 'dir',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: Jog Motors')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}

				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';
				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not found');
					return;
				}

				var motorSpeed = 0

				if (data.options.id_speed === 0) { // If default speed is selected
					var motorInversion = 1
					var temp = 0
					temp = self.getVariableValue(`${motor_name}SpeedLimit`)
					motorInversion = self.getVariableValue(`${motor_name}Inversion`)

					if (motor_id < 5 || motor_id == 8) {
						motorSpeed = motorInversion * data.options.dir * temp / 100.0 * 500.0
					} else {
						motorSpeed = motorInversion * data.options.dir * temp / 100.0 * 100.0
					}

					self.sendEmotimoAPICommand('G301 M' + motor_id + ' V' + motorSpeed)
					return;
				}

				motorSpeed = data.options.id_speed * data.options.dir
				self.sendEmotimoAPICommand('G300 M' + motor_id + ' V' + motorSpeed)
			},
		},
		jogMotorStop: {
			name: 'Motor Jog STOP',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'id',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current motor selected\nID: Select a specific ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: Jog Motors STOP')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G300 M' + motor_id + ' V0')
			},
		},
		setJogSpeedLimit: {
			name: 'Set Motor Jog Speed',
			options: [...MOTOR_OPTIONS,
				{
					type: 'dropdown',
					id: 'setopt',
					label: 'Set Options',
					default: 'set',
					choices: CHOICES_SET,
					tooltip: 'Set Value: set a specific value\nPositive: Increase by a value each time\nNegative: Decrease by a value each time\nReset: Reset to the default value',
				},
				{
					type: 'number',
					label: 'Value',
					id: 'setvalue',
					min: 0,
		    	max: 100,
          default: 100,
					isVisible: (options) => options.setopt === 'set',
				},
				{
					type: 'number',
					label: 'Value',
					id: 'ammount',
					min: -100,
		    	max: 100,
          default: 5,
					isVisible: (options) => options.setopt === 'up' || options.setopt === 'down'
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setJogSpeedLimit')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}

				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';
				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not found');
					return;
				}

				var speedtemp = self.getVariableValue(`${motor_name}SpeedLimit`)

				if (data.options.setopt === 'set') {
					speedtemp = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					speedtemp += data.options.ammount
				} else if (data.options.setopt === 'down') {
					speedtemp -= data.options.ammount
				} else if (data.options.setopt === 'reset') {
					if (data.options.id === 5 || data.options.id === 6 || data.options.id === 7) {
						speedtemp = 50;
					} else {
						speedtemp = 100
					}
				}

				if (speedtemp > 100) {
					speedtemp = 100;
				} else if (speedtemp < 0) {
					speedtemp = 0;
				}

				self.log('debug', 'Motor ID: ' + motor_id + ' Speed: ' + speedtemp)

				self.setVariableValues({ [`${motor_name}SpeedLimit`]: speedtemp })

				if (data.options.settype === 'smart' || motor_id === self.getVariableValue('CurreCurrentMtrSetCurrentMtrSetntLpSet')) {
					self.setVariableValues({ CurrentMtrSpeed: speedtemp })
				}
			}
		},

		setCruiseSpeed: {
			name: 'Set Motor Cruise Speed',
			options: [
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 2,
					choices: MOTOR_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: Set Cruise Speed')
				var motorSpeed = 0
				var motorInversion = 1
				var rawMotorSpeed = 0
				var temp = 0

				const motor_id = data.options.id;
				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';

				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not found');
					return;
				}

				temp = self.getVariableValue(`${motor_name}SpeedLimit`)
				rawMotorSpeed = self.getVariableValue(`${motor_name}CruiseSpeed`)
				motorInversion = self.getVariableValue(`${motor_name}Inversion`)

				if (motor_id < 5 || motor_id == 8) {
					rawMotorSpeed += data.options.direction * 25
					if (rawMotorSpeed > 500) {
						rawMotorSpeed = 500
					} else if (rawMotorSpeed < -500) {
						rawMotorSpeed = -500
					}
					motorSpeed = motorInversion * temp / 100.0 * rawMotorSpeed
				} else {
					rawMotorSpeed += data.options.direction * 5
					if (rawMotorSpeed > 100) {
						rawMotorSpeed = 100
					} else if (rawMotorSpeed < -100) {
						rawMotorSpeed = -100
					}
					motorSpeed = motorInversion * temp / 100.0 * rawMotorSpeed
				}

				self.setVariableValues({ [`${motor_name}CruiseSpeed`]: rawMotorSpeed })

				self.log('debug', 'Temp: ' + temp + ' Motor Speed: ' + motorSpeed)
				self.sendEmotimoAPICommand('G301 M' + motor_id + ' V' + motorSpeed)
			},
		},
		resetCruiseSpeed: {
			name: 'Reset Motor Cruise Speed',
			options: [
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: resetCruiseSpeed')
				if (data.options.id == 1) {
					self.setVariableValues({ PanCruiseSpeed: 0 })
				} else if (data.options.id == 2) {
					self.setVariableValues({ TiltCruiseSpeed: 0 })
				} else if (data.options.id == 3) {
					self.setVariableValues({ M3CruiseSpeed: 0 })
				} else if (data.options.id == 4) {
					self.setVariableValues({ M4CruiseSpeed: 0 })
				} else if (data.options.id == 5) {
					self.setVariableValues({ TN1CruiseSpeed: 0 })
				} else if (data.options.id == 6) {
					self.setVariableValues({ TN2CruiseSpeed: 0 })
				} else if (data.options.id == 7) {
					self.setVariableValues({ TN3CruiseSpeed: 0 })
				} else if (data.options.id == 8) {
					self.setVariableValues({ RollCruiseSpeed: 0 })
				} else if (data.options.id == 9) {
					self.setVariableValues({ FocusCruiseSpeed: 0 })
				}

				self.sendEmotimoAPICommand('G301 M' + data.options.id + ' V0')
			}
		},

		tnpositionDrive: {
			name: 'Send TN Motor Position',
			options: [
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 5,
					choices: TN_MOTOR_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: tnpositionDrive')
				var temp = 0
				var increment = 0

				if (cmd != '') {
					if (data.options.id == 5) {
						temp = self.getVariableValue('FPos')
						increment = self.getVariableValue('FStep')
					} else if (data.options.id == 6) {
						temp = self.getVariableValue('IPos')
						increment = self.getVariableValue('IStep')
					} else if (data.options.id == 7) {
						temp = self.getVariableValue('ZPos')
						increment = self.getVariableValue('ZStep')
					}

					temp += (data.options.direction * increment);
					// self.log('debug', 'Motor ID' + data.options.id + 'Position' + temp)

					if (temp > 10000) {
						temp = 10000;
					} else if (temp < 0) {
						temp = 0;
					}

					if (data.options.id == 5) {
						self.setVariableValues({ FPos: temp })
					} else if (data.options.id == 6) {
						self.setVariableValues({ IPos: temp })
					} else if (data.options.id == 7) {
						self.setVariableValues({ ZPos: temp })
					}

					self.sendEmotimoAPICommand('G302 M' + data.options.id + ' P' + temp)
				}
			},
		},
		positionDrive: {
			name: 'Send Motor Position',
			options: [
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: positionDrive')
				var cmdParam ='X'
				var temp = 0
				var increment = 0

				if (data.options.id == 1) {
					temp = self.getVariableValue('PPos')
					increment = self.getVariableValue('PStep')
					cmdParam = 'X'
				} else if (data.options.id == 2) {
					temp = self.getVariableValue('TPos')
					increment = self.getVariableValue('TStep')
					cmdParam = 'Y'
				} else if (data.options.id == 3) {
					temp = self.getVariableValue('SPos')
					increment = self.getVariableValue('SStep')
					cmdParam = 'Z'
				} else if (data.options.id == 4) {
					temp = self.getVariableValue('MPos')
					increment = self.getVariableValue('MStep')
					cmdParam = 'W'
				} else if (data.options.id == 5) {
					temp = self.getVariableValue('FPos')
					increment = self.getVariableValue('FStep')
					cmdParam = 'F'
				} else if (data.options.id == 6) {
					temp = self.getVariableValue('IPos')
					increment = self.getVariableValue('IStep')
					cmdParam = 'I'
				} else if (data.options.id == 7) {
					temp = self.getVariableValue('ZPos')
					increment = self.getVariableValue('ZStep')
					cmdParam = 'C'
				} else if (data.options.id == 8) {
					temp = self.getVariableValue('RPos')
					increment = self.getVariableValue('RStep')
					cmdParam = 'R'
				}

				temp += (data.options.direction * increment);
				// self.log('debug', 'Motor ID' + data.options.id + 'Position' + temp)

				if (data.options.id == 1) {
					self.setVariableValues({ PPos: temp })
				} else if (data.options.id == 2) {
					self.setVariableValues({ TPos: temp })
				} else if (data.options.id == 3) {
					self.setVariableValues({ SPos: temp })
				} else if (data.options.id == 4) {
					self.setVariableValues({ MPos: temp })
				} else if (data.options.id == 5) {
					self.setVariableValues({ FPos: temp })
				} else if (data.options.id == 6) {
					self.setVariableValues({ IPos: temp })
				} else if (data.options.id == 7) {
					self.setVariableValues({ ZPos: temp })
				} else if (data.options.id == 8) {
					self.setVariableValues({ RPos: temp })
				}

				self.sendEmotimoAPICommand('G0 ' + cmdParam + temp)
			},
		},
		toggleIncrement: {
			name: 'Toggle Motor Increment',
			options: [
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 5,
					choices: MOTOR_ID,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: toggleIncrement')
				var temp = 0

				if (data.options.id == 1) {
					temp = self.getVariableValue('PStep')
				} else if (data.options.id == 2) {
					temp = self.getVariableValue('TStep')
				} else if (data.options.id == 3) {
					temp = self.getVariableValue('SStep')
				} else if (data.options.id == 4) {
					temp = self.getVariableValue('MStep')
				} else if (data.options.id == 5) {
					temp = self.getVariableValue('FStep')
				} else if (data.options.id == 6) {
					temp = self.getVariableValue('IStep')
				} else if (data.options.id == 7) {
					temp = self.getVariableValue('ZStep')
				} else if (data.options.id == 8) {
					temp = self.getVariableValue('RStep')
				}

				if (data.options.id < 3) {
					if (self.config.model == 'SA2.6 Conductor') {
						if (temp == 1) {
							temp = 10;
						} else {
							temp = 1;
						}
					} else {
						if (temp == 1000) {
							temp = 10000;
						} else {
							temp = 1000;
						}
					}

				} else if (data.options.id < 5) {
					if (temp == 1000) {
						temp = 10000;
					} else {
						temp = 1000;
					}
				} else if (data.options.id < 8) {
					if (temp == 200) {
						temp = 50;
					} else {
						temp = 200;
					}
				} else {
					if (temp == 1) {
						temp = 10;
					} else {
						temp = 1;
					}
				}

				self.log('debug', 'Model: ' + self.config.model + ' Motor ID: ' + data.options.id + ' Increment: ' + temp)

				if (data.options.id == 1) {
					temp = self.setVariableValues({ PStep: temp })
				} else if (data.options.id == 2) {
					temp = self.setVariableValues({ TStep: temp })
				} else if (data.options.id == 3) {
					temp = self.setVariableValues({ SStep: temp })
				} else if (data.options.id == 4) {
					temp = self.setVariableValues({ MStep: temp })
				} else if (data.options.id == 5) {
					self.setVariableValues({ FStep: temp })
				} else if (data.options.id == 6) {
					self.setVariableValues({ IStep: temp })
				} else if (data.options.id == 7) {
					self.setVariableValues({ ZStep: temp })
				} else if (data.options.id == 8) {
					self.setVariableValues({ RStep: temp })
				}
			}
		},

		stopMotors: {
			name: 'Stop All Motors',
			options: [],
			callback: async () => {
				self.log('info', 'Action Triggered: stopMotors')
				self.setVariableValues({ 'LastPstID': -1 })
				self.sendEmotimoAPICommand('G911')
			},
		},

		homeRS: {
			name: 'Center RS',
			options: [
				{
					type: 'dropdown',
					id: 'id_end',
					label: 'Command End Character:',
					default: '\n',
					choices: CHOICES_END,
				},
			],
			callback: async () => {
				self.log('info', 'Action Triggered: homeRS')
				self.sendEmotimoAPICommand('G202')
			}
		},
		calibrateAllTN: {
			name: 'Calibrate All TN',
			options: [],
			callback: async () => {
				self.log('info', 'Action Triggered: calibrateAllTN')
				self.sendEmotimoAPICommand('G812 C0')
			}
		},
		calibrateTNMotor: {
			name: 'Calibrate TN Motor',
			options: [
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 5,
					choices: TN_MOTOR_ID,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: calibrateTNMotor')
				self.sendEmotimoAPICommand('G812 C0 M' + (data.options.id-4))
			}
		},

		invertCurrentAxis: {
			name: 'Invert Current Motor',
			options: [],
			callback: async () => {
				self.log('info', 'Action Triggered: invertCurrentAxis')
				var motor = self.getVariableValue('CurrentMtrSet')
				var motorInvertName = ''
				var inversionState = 0

				if (motor == 1) {
					inversionState = self.getVariableValue('PanInversion')
					inversionState *= -1
					self.setVariableValues({ PanInversion: inversionState })
				} else if (motor == 2) {
					inversionState = self.getVariableValue('TiltInversion')
					inversionState *= -1
					self.setVariableValues({ TiltInversion: inversionState })
				} else if (motor == 3) {
					inversionState = self.getVariableValue('M3-SlideInversion')
					inversionState *= -1
					self.setVariableValues({ M3Inversion: inversionState })
				} else if (motor == 4) {
					inversionState = self.getVariableValue('M4Inversion')
					inversionState *= -1
					self.setVariableValues({ M4Inversion: inversionState })
				} else if (motor == 5) {
					inversionState = self.getVariableValue('TN1Inversion')
					inversionState *= -1
					self.setVariableValues({ TN1Inversion: inversionState })
				} else if (motor == 6) {
					inversionState = self.getVariableValue('TN2Inversion')
					inversionState *= -1
					self.setVariableValues({ TN2Inversion: inversionState })
				} else if (motor == 7) {
					inversionState = self.getVariableValue('TN3Inversion')
					inversionState *= -1
					self.setVariableValues({ TN3Inversion: inversionState })
				} else if (motor == 8) {
					inversionState = self.getVariableValue('RollInversion')
					inversionState *= -1
					self.setVariableValues({ RollInversion: inversionState })
				} else if (motor == 9) {
					inversionState = self.getVariableValue('FocusInversion')
					inversionState *= -1
					self.setVariableValues({ FocusInversion: inversionState })
				}

				if (inversionState == 1) {
					motorInvertName = 'Normal'
				} else {
					motorInvertName = 'Inverted'
				}

				self.setVariableValues({ CurrentMtrInversion: motorInvertName})
			},
		},

		//Limits
		setStopA: {
			name: 'Set Stop A',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setStopA')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G213 M' + motor_id)
			}
		},
		setStopB: {
			name: 'Set Stop B',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setStopB')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G214 M' + motor_id)
			}
		},

		recallStopA: {
			name: 'Recall Stop A',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current motor selected\nID: Select a specific motor ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 0,
					choices: MOTOR_ID,
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: recallStopA')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G217 M' + motor_id)
			}
		},
		recallStopB: {
			name: 'Recall Stop B',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current motor selected\nID: Select a specific motor ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'Motor ID',
					default: 0,
					choices: MOTOR_ID,
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: recallStopB')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G218 M' + motor_id)
			}
		},

		clearStopA: {
			name: 'Clear Stop A',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: clearStopA')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G219 M' + motor_id)
			}
		},
		clearStopB: {
			name: 'Clear Stop B',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: clearStopB')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G219 M' + motor_id)
			}
		},
		clearStopsByAxis: {
			name: 'Clear Stops by Axis',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: clearStopByAxis')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G219 M' + motor_id)
			}
		},
		clearAllStops: {
			name: 'Clear All Stops',
			options: [],
			callback: async () => {
				self.log('info', 'Action Triggered: clearAllStops')
				self.sendEmotimoAPICommand('G219 M0')
			}
		},

		// other
		setMotorID: {
			name: 'Set Motor ID',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [...DIRECTION_ID,
						{ id: 'set', label: 'Set Preset' }
					]
				},
				{
					id: 'setID',
					type: 'number',
					label: 'Set Preset ID',
					default: 0,
					min: 0,
					max: 127,
					isVisible: (options) => options.direction === 'set'
				}
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setMotorID')
				var motor_id = self.getVariableValue('CurrentMtrSet')
				if (data.options.direction === 'set') {
					motor_id = data.options.setPst
				} else {
					motor_id += data.options.direction
				}

				if (motor_id > 9) {
					motor_id = 9;
				} else if (motor_id < 1) {
					motor_id = 1;
				}

				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';
				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not found');
					return;
				}

				var motorSpeedLimit = self.getVariableValue(`${motor_name}SpeedLimit`)
				var motorInvert = self.getVariableValue(`${motor_name}Inversion`)
				var motorPosName = motor_name + ' Pos'
				var motorNegName = motor_name + ' Neg'
				var motorInvertName = ''

				if (motorInvert == 1) {
					motorInvertName = 'Normal'
				} else {
					motorInvertName = 'Inverted'
				}

				self.setVariableValues({ CurrentMtrSet: motor_id })
				self.setVariableValues({ CurrentMtrStr: motor_name })
				self.setVariableValues({ CurrentMtrPosStr: motorPosName })
				self.setVariableValues({ CurrentMtrNegStr: motorNegName })
				self.setVariableValues({ CurrentMtrSpeed: motorSpeedLimit})
				self.setVariableValues({ CurrentMtrInversion: motorInvertName})

				self.log('debug', `Motor ID: ${motor_id} / Motor Name: ${motor_name} / Motor Pos Name: ${motorPosName} / Motor Neg Name: ${motorNegName} / Motor Speed: ${motorSpeedLimit} / Motor Inversion: ${motorInvertName}`)
				self.checkFeedbacks("StopAStatusSmart")
				self.checkFeedbacks("StopBStatusSmart")
			}
		},

		setMotorProfile: {
			name: 'Set Motor Profile',
			options: [
				{
					id: 'prodileid',
					type: 'dropdown',
					label: 'Profile: Default: User 1',
					default: 5,
					choices: MOTOR_PROFILES,
				},
				{
					type: 'checkbox',
					id: 'lockout',
					label: 'Lockout',
					default: false,
					tooltip: 'if its already moving somewhere, it wont recall somewhere else until it reaches its destination or it stops. Or if its the most recent recalled preset, it wont do anything',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setMotorProfile')
				let profile = data.options.prodileid
				if (data.options.lockout) {
					if (self.getVariableValue('IsMoving') || profile === MOTOR_PROFILES.find((i) => i.label === self.getVariableValue('CurrentMtrProf')).id) {
						self.log('warn', 'Lockout Initiated, wait till it reaches its destination, or recall a different profile first')
						return;
					}
				}
				self.sendEmotimoAPICommand('G102 P' + profile)
			}
		},

		zeroMotors: {
			name: 'Zero Motors',
			options: [],
			callback: async () => {
				self.log('info', 'Action Triggered: zeroMotors')
				self.sendEmotimoAPICommand('G201')
			}
		},

//============================
//  ***   PRESET STUFFS   ***
//============================

		// To-DO: Make reset preset action
		// option to soft reset it, where it only resets companion things, and an option to full reset, sets preset positions in the emotimo to the default whatever positions
		// To-DO: Make request action, to get the inputted preset/stop/performance values from the emotimo
		// options for preset/stop/performance, where it sends the command to request approprate data

		savePset: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current preset selected\nPreset: Select a specific preset to change',
				},
				{
					type: 'textinput',
					id: 'id',
					label: 'Preset ID',
					default: '0',
					// min: 0,
					// max: 127,
					useVariables: { local: true },
					regex: '/^(?:([0-9]|[1-9][0-9]|1[01][0-9]|12[0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-127) or a variable',
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: savePset')
				if (data.options.settype === 'id') { // Not Smart type
					const s = (await self.parseVariablesInString(data.options.id)).trim()
					const preset = Number(s)
					if (!Number.isFinite(preset) || preset < 0 || preset > 127) {
						self.log('warn', `Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
				}
				var runtemp = self.getVariableValue('Pst'+preset+'RunT') || 50
				var ramptemp = self.getVariableValue('Pst'+preset+'RampT') || 10

				self.sendEmotimoAPICommand(`G21 P${preset} T${runtemp / 10} A${ramptemp / 10}`)
				// self.pstModified = false
			},
		},
		recallPset: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
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
				{
					type: 'checkbox',
					id: 'lockout',
					label: 'Lockout',
					default: false,
					tooltip: 'if its already moving somewhere, it wont recall somewhere else until it reaches its destination or it stops. Or if its the most recent recalled preset, it wont do anything',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: recallPset')
				if (data.options.settype === 'id') { // Not Smart type
					const s = (await self.parseVariablesInString(data.options.id)).trim()
					var preset = Number(s)
					if (!Number.isFinite(preset) || preset < 0 || preset > 127) {
						self.log('warn', `Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
				}

				if (data.options.lockout) {
					if (self.getVariableValue('IsMoving') || self.getVariableValue('LastPstID') === preset) {
						self.log('warn', 'Lockout Initiated, wait till it reaches its destination, or recall a different preset first')
						return;
					}
				}

				let setPstsRaw = self.getVariableValue('SetPsts')
				let setpsts = []

				try { // convert the '[]' to []
					setpsts = JSON.parse(setPstsRaw) || []
				} catch (e) {
					setpsts = []
				}

				if (!PRESET_ID.some(p => p.id === preset) || !setpsts.includes(preset)) {
					self.log('error', 'Module: Cannot recall preset ' + preset + ' because it is not configured yet')
					return;
				}

				// if (self.pstModified) { // if its not saved or its been modified, then send command
					var runtemp = self.getVariableValue('Pst'+preset+'RunT') || 50
					var ramptemp = self.getVariableValue('Pst'+preset+'RampT') || 10
					self.sendEmotimoAPICommand(`G20 P${preset} T${runtemp / 10} A${ramptemp / 10}`)
					// self.pstModified = false
				// } else {
				// 	self.sendEmotimoAPICommand(`G20 P${preset}`);
				// }
			},
		},
		// removePset: {
		// 	name: 'Remove Preset',
		// 	options: [
		// 		{
		// 			type: 'dropdown',
		// 			id: 'settype',
		// 			label: 'Set Type',
		// 			default: 'smart',
		// 			choices: CHOICES_SET_TYPE,
		// 			tooltip: 'Smart: The current preset selected\nPreset: Select a specific preset to change',
		// 		},
		// 		{
		// 			type: 'dropdown',
		// 			id: 'setopt',
		// 			label: 'Set Options',
		// 			default: 'soft',
		// 			choices: [
		// 				{ id: 'soft', label: 'Soft Remove'},
		// 				{ id: 'full', label: 'Full Remove'},
		// 			],
		// 			tooltip: 'Soft Remove: removes companion side variables\nFull Remove: removes/resets emotimo side',
		// 		},
		// 		{
		// 			type: 'number',
		// 			id: 'id',
		// 			label: 'Preset ID',
		// 			default: 1,
		// 			min: 1,
		// 			max: 127,
		// 			isVisible: (options) => options.settype === 'id',
		// 		},
		// 	],
		// 	callback: async (data) => {
		// 		self.log('info', 'Action Triggered: removePset')
		// 		if (data.options.settype === 'id') { // Not Smart type
		// 			var preset = data.options.id
		// 		} else {
		// 			var preset = self.getVariableValue('CurrentPstSet')
		// 		}

		// 		if (preset < 0) {
		// 			preset = 0;
		// 		} else if (preset > 127) {
		// 			preset = 127;
		// 		}

		// 		if (preset <= 0) {
		// 			self.log('warn', 'Cannot remove preset 0')
		// 			return;
		// 		}

		// 		if (variableList.some(o => o.variableId === `Pst${preset}Stat`) || data.options.setopt === 'full') { // if it exists in the variable list. OR if full is selected jsut incase it doesnt exist in the list but you want to remove it from the emotimo
		// 			if (data.options.setopt === 'soft') {
		// 				self.log('debug', 'soft removing preset ' + preset)
		// 			}
		// 			if (preset === self.getVariableValue('CurrentPstSet')) {
		// 				self.setVariableValues({ CurrentPstSet: preset-1})
		// 			}

		// 			// cant use .filter here since its a const import
		// 			for (let i = PRESET_ID.length - 1; i >= 0; i--) {
		// 				if (PRESET_ID[i].id === preset) {
		// 					PRESET_ID.splice(i, 1)
		// 				}
		// 			}
		// 			self.updateActions()

		// 			let variableListNew = variableList.filter(o => !o.variableId.startsWith(`Pst${preset}`)); // filters out all entries that start with 'Pst{preset}' and new variableList becomes everything else but that
		// 			self.updateVariableDefinitions(variableListNew);

		// 			self.updateFeedbacks();

		// 			if (data.options.setopt === 'full') {
		// 				self.log('debug', 'Full removing preset ' + preset)
		// 				let part1CMD = 'G21 P' + preset + ' T' + DEFAULTS['RunT'] / 10 + ' A' + DEFAULTS['RampT'] / 10
		// 				let part2CMD = ' X' + DEFAULTS['PanPos'] + ' Y' + DEFAULTS['TiltPos'] + ' Z' + DEFAULTS['M3Pos'] + ' W' + DEFAULTS['M4Pos']
		// 				self.sendEmotimoAPICommand(part1CMD + part2CMD)
		// 			}
		// 		} else {
		// 			self.log('warn', 'Preset info ' + preset + ' Does not exist. Nothing removed');
		// 			return;
		// 		}
		// 	},
		// },

		removePsetTemp: {
			name: 'Remove Preset',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Preset ID',
					default: 0,
					min: 1,
					max: 127,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: removePset')
				let preset = data.options.id
				if (preset < 0) {
					preset = 0;
				} else if (preset > 127) {
					preset = 127;
				}
				if (preset <= 0) {
					self.log('warn', 'Cannot remove preset 0')
					return;
				}

				self.setVariableValues({ [`Pst${preset}Stat`]: 0 })
				self.checkFeedbacks('SetPreset')
				self.checkFeedbacks('SetPresetSmart')
			}
		},
		setPresetID: {
			name: 'Set Preset ID',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [...DIRECTION_ID,
						{ id: 'set', label: 'Set Preset' }
					]
				},
				{
					type: 'textinput',
					id: 'id',
					label: 'Preset ID',
					default: 0,
					// min: 0,
					// max: 127,
					useVariables: { local: true },
					regex: '/^(?:([0-9]|[1-9][0-9]|1[01][0-9]|12[0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-127) or a variable',
					isVisible: (options) => options.direction === 'set',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setPresetID')
				var preset = self.getVariableValue('CurrentPstSet')
				if (data.options.direction === 'set') {
					const s = (await self.parseVariablesInString(data.options.id)).trim()
					preset = Number(s)
					if (!Number.isFinite(preset) || preset < 0 || preset > 127) {
						self.log('warn', `Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					preset += data.options.direction
				}

				if (preset < 0) {
					preset = 0;
				} else if (preset > 127) {
					preset = 127;
				}

				if (!variableList.some(o => o.variableId === `Pst${preset}Stat`)) {
					makeNewPreset(self, preset)
				}

				var ramptemp = self.getVariableValue(`Pst${preset}RampT`)
				var runtemp = self.getVariableValue(`Pst${preset}RunT`)
				var panpos = self.getVariableValue(`Pst${preset}PanPos`)
				var tiltpos = self.getVariableValue(`Pst${preset}TiltPos`)
				var m3pos = self.getVariableValue(`Pst${preset}M3Pos`)
				var m4pos = self.getVariableValue(`Pst${preset}M4Pos`)

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp + ' PanPos: ' + panpos + ' TiltPos: ' + tiltpos + ' M3Pos: ' + m3pos + ' M4Pos: ' + m4pos)

				self.setVariableValues({ CurrentPstSet: preset })
				self.setVariableValues({ CurrentPstRun: runtemp })
				self.setVariableValues({ CurrentPstRamp: ramptemp })
				self.setVariableValues({ CurrentPstPanPos: panpos })
				self.setVariableValues({ CurrentPstTiltPos: tiltpos })
				self.setVariableValues({ CurrentPstM3Pos: m3pos })
				self.setVariableValues({ CurrentPstM4Pos: m4pos })

				self.checkFeedbacks("SetPreset")
				self.checkFeedbacks("CurrentPreset")
			}
		},

		setPresetRunTime: {
			name: 'Set Preset Run Time',
			options: [...PST_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setPresetRunTime')
				var skip = false
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Pst'+preset+'RunT')
					var ramptemp = self.getVariableValue('Pst'+preset+'RampT')
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
					var runtemp = self.getVariableValue('CurrentPstRun')
					var ramptemp = self.getVariableValue('CurrentPstRamp')
				}

				if (data.options.setopt === 'set') {
					runtemp = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					runtemp += data.options.ammount
				} else if (data.options.setopt === 'down') {
					runtemp -= data.options.ammount
				} else if (data.options.setopt === 'reset') {
					runtemp = 50
				}

				if (runtemp > 600) {
					runtemp = 600;
				} else if (runtemp < 10) {
					runtemp = 10;
				}

				if (!variableList.some(o => o.variableId === `Pst${preset}Stat`)) {
					makeNewPreset(self, preset)
				}

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+preset+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
				self.setVariableValues({ [varID]: runtemp })

				// self.pstModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstRun: runtemp })
				}
			}
		},
		setPresetRampTime: {
			name: 'Set Preset Ramp Time',
			options: [...PST_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setPresetRampTime')
				var skip = false
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Pst'+preset+'RunT')
					var ramptemp = self.getVariableValue('Pst'+preset+'RampT')
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
					var runtemp = self.getVariableValue('CurrentPstRun')
					var ramptemp = self.getVariableValue('CurrentPstRamp')
				}

				if (data.options.setopt === 'set') {
					ramptemp = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					ramptemp += data.options.ammount
				} else if (data.options.setopt === 'down') {
					ramptemp -= data.options.ammount
				} else if (data.options.setopt === 'reset') {
					ramptemp = 10
				}

				if (ramptemp > 300) {
					ramptemp = 300;
				} else if (ramptemp < 5) {
					ramptemp = 5;
				}

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+preset+'RampT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
				self.setVariableValues({ [varID]: ramptemp })

				// self.pstModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstRamp: ramptemp })
				}
			}
		},

//============================
//  ***   LOOP STUFFS   ***
//============================

		setLoopID: {
			name: 'Set Loop ID',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [...DIRECTION_ID,
						{ id: 'set', label: 'Set Loop' }
					]
				},
				{
					id: 'gotoLoop',
					type: 'number',
					label: 'Set Loop ID',
					default: 0,
					isVisible: (options) => options.direction === 'set'
				}
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopID')
				var preset = self.getVariableValue('CurrentLpSet')

				if (data.options.direction === 'set') {
					preset = data.options.gotoLoop
				} else {
					preset += data.options.direction
				}

				if (preset > 7) {
					preset = 7;
				} else if (preset < 0) {
					preset = 0;
				}

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var ramptemp = self.getVariableValue('Lp' + preset + 'RampT')
				var runtemp = self.getVariableValue('Lp' + preset + 'RunT')
				var lpApt = self.getVariableValue('Lp' + preset + 'APoint')
				var lpBpt = self.getVariableValue('Lp' + preset + 'BPoint')
				var dwellA = self.getVariableValue('Lp'+preset+'DwellA');
				var dwellB = self.getVariableValue('Lp'+preset+'DwellB');

				self.log('debug', `Loop ID: ${preset} A${lpApt} B${lpBpt} T${(Number(runtemp) / 10)} R${(Number(ramptemp) / 10)} C${dwellA} D${dwellB}`)

				self.setVariableValues({ CurrentLpSet: preset })
				self.setVariableValues({ CurrentLpRun: runtemp })
				self.setVariableValues({ CurrentLpRamp: ramptemp })
				self.setVariableValues({ CurrentLpA: lpApt })
				self.setVariableValues({ CurrentLpB: lpBpt })
				self.setVariableValues({ CurrentLpDwellA: dwellA })
				self.setVariableValues({ CurrentLpDwellB: dwellB })

				self.checkFeedbacks("SetLoopSmart")
			}
		},

		setLoopAPoint: {
			name: 'Set Loop A Point',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current preset/loop selected\nID: Select a specific loop ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.settype === 'id',
					tooltip: 'If you dont see a specific loop ID, make sure it is set first',
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'id', label: 'Set to ID' }
					]
				},
				{
					type: 'textinput',
					id: 'pstid',
					label: 'Preset ID',
					default: '0',
					// min: 0,
					// max: 127,
					useVariables: { local: true },
					regex: '/^(?:([0-9]|[1-9][0-9]|1[01][0-9]|12[0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-127) or a variable',
					isVisible: (options) => options.direction === 'id',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopAPoint')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var pointTemp = self.getVariableValue('Lp'+preset+'APoint');
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var pointTemp = self.getVariableValue('CurrentLpA');
				}

				if (data.options.direction === 'id') {
					const s = (await self.parseVariablesInString(data.options.pstid)).trim()
					var pointTemp = Number(s)
					if (!Number.isFinite(pointTemp) || pointTemp < 0 || pointTemp > 127) {
						self.log('warn', `Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					pointTemp += data.options.direction
				}

				if (pointTemp > 127) {
					pointTemp = 127;
				} else if (pointTemp < 0) {
					pointTemp = 0;
				}

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var varID = 'Lp'+preset+'APoint'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + pointTemp)
				self.setVariableValues({ [varID]: pointTemp })

				// self.lpModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpA: pointTemp })
				}
			}
		},
		setLoopBPoint: {
			name: 'Set Loop B Point',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current preset/loop selected\nID: Select a specific loop ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.settype === 'id',
					tooltip: 'If you dont see a specific loop ID, make sure it is set first',
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'id', label: 'Set to ID' }
					]
				},
				{
					type: 'textinput',
					id: 'pstid',
					label: 'Preset ID',
					default: '0',
					// min: 0,
					// max: 127,
					useVariables: { local: true },
					regex: '/^(?:([0-9]|[1-9][0-9]|1[01][0-9]|12[0-7])|\\$\\([^)]*\\))$/',
					tooltip: 'Enter a number (0-127) or a variable',
					isVisible: (options) => options.direction === 'id',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopBPoint')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var pointTemp = self.getVariableValue('Lp'+preset+'BPoint');
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var pointTemp = self.getVariableValue('CurrentLpB');
				}

				if (data.options.direction === 'id') {
					const s = (await self.parseVariablesInString(data.options.pstid)).trim()
					var pointTemp = Number(s)
					if (!Number.isFinite(pointTemp) || pointTemp < 0 || pointTemp > 127) {
						self.log('warn', `Preset must be 0-127; got ${s}`)
						return;
					}
				} else {
					pointTemp += data.options.direction
				}

				if (pointTemp > 127) {
					pointTemp = 127;
				} else if (pointTemp < 0) {
					pointTemp = 0;
				}

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var varID = 'Lp'+preset+'BPoint'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + pointTemp)
				self.setVariableValues({ [varID]: pointTemp })

				// self.lpModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpB: pointTemp })
				}
			}
		},

		setLoopRunTime: {
			name: 'Set Loop Run Time',
			options: [...LP_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopRunTime')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Lp'+preset+'RunT')
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var runtemp = self.getVariableValue('CurrentLpRun')
				}

				if (data.options.setopt === 'set') {
					runtemp = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					// if current runtemp is 0, if they increase by 5 itll still be set to 0
					// since 5 < 10, so if thats the case then set it to 10, else default behavior
					runtemp += data.options.ammount;
					if (runtemp < 10) {
						runtemp = 10;
					}
				} else if (data.options.setopt === 'down') {
					// if runtemp is 10 and they decrease, set it to 0, else default behavior
					runtemp -= data.options.ammount
					if (runtemp < 10) {
						runtemp = 0;
					}
				} else if (data.options.setopt === 'reset') {
					runtemp = 50
				}

				// basic limiting runtemp
				// if over the limit, set to limit
				// else if they SET the runtemp to say 3, which is invalid, default to 0
				if (runtemp > 600) { runtemp = 600 }
				else if (runtemp < 10 && runtemp > 0) { runtemp = 0 }

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var varID = 'Lp'+preset+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
				self.setVariableValues({ [varID]: runtemp })

				self.lpModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpRun: runtemp })
				}
			}
		},
		setLoopRampTime: {
			name: 'Set Loop Ramp Time',
			options: [...LP_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopRampTime')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var ramptemp = self.getVariableValue('Lp'+preset+'RampT')
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var ramptemp = self.getVariableValue('CurrentLpRamp')
				}

				if (data.options.setopt === 'set') {
					ramptemp = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					// if current ramptemp is 0, if they increase by 5 itll still be set to 0
					// since 5 < 10, so if thats the case then set it to 10, else default behavior
					ramptemp += data.options.ammount;
					if (ramptemp < 10) {
						ramptemp = 10;
					}
				} else if (data.options.setopt === 'down') {
					// if ramptemp is 10 and they decrease, set it to 0, else default behavior
					ramptemp -= data.options.ammount
					if (ramptemp < 10) {
						ramptemp = 0;
					}
				} else if (data.options.setopt === 'reset') {
					ramptemp = 10
				}

				// basic limiting ramptemp
				// if over the limit, set to limit
				// else if they SET the ramptemp to say 3, which is invalid, default to 0
				if (ramptemp > 600) { ramptemp = 600 }
				else if (ramptemp < 10 && ramptemp > 0) { ramptemp = 0 }

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var varID = 'Lp'+preset+'RampT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
				self.setVariableValues({ [varID]: ramptemp })

				// self.lpModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpRamp: ramptemp })
				}
			}
		},

		setLoopDwellTimeA: {
			name: 'Set Loop Dwell Time A Point',
			options: [...DWELL_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopDwellTimeA')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var dwell = self.getVariableValue('Lp'+preset+'DwellA')
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var dwell = self.getVariableValue('CurrentLpDwellA')
				}

				if (data.options.setopt === 'set') {
					dwell = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					// if current dwell is 0, if they increase by 5 itll still be set to 0
					// since 5 < 10, so if thats the case then set it to 10, else default behavior
					dwell += data.options.ammount;
				} else if (data.options.setopt === 'down') {
					// if dwell is 10 and they decrease, set it to 0, else default behavior
					dwell -= data.options.ammount
				} else if (data.options.setopt === 'reset') {
					dwell = 500
				}

				// basic limiting
				if (dwell > 60000) { dwell = 60000 }
				else if (dwell < 300) { dwell = 300 }

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var varID = 'Lp'+preset+'DwellA'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + dwell)
				self.setVariableValues({ [varID]: dwell })

				// self.lpModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpDwellA: dwell })
				}
			}
		},
		setLoopDwellTimeB: {
			name: 'Set Loop Dwell Time B Point',
			options: [...DWELL_OPTIONS],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setLoopDwellTimeB')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var dwell = self.getVariableValue('Lp'+preset+'DwellB')
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var dwell = self.getVariableValue('CurrentLpDwellB')
				}

				if (data.options.setopt === 'set') {
					dwell = data.options.setvalue
				} else if (data.options.setopt === 'up') {
					// if current dwell is 0, if they increase by 5 itll still be set to 0
					// since 5 < 10, so if thats the case then set it to 10, else default behavior
					dwell += data.options.ammount;
				} else if (data.options.setopt === 'down') {
					// if dwell is 10 and they decrease, set it to 0, else default behavior
					dwell -= data.options.ammount
				} else if (data.options.setopt === 'reset') {
					dwell = 500
				}

				// basic limiting
				if (dwell > 60000) { dwell = 60000 }
				else if (dwell < 300) { dwell = 300 }

				if (!variableList.some(i => i.variableId === `Lp${preset}RunT`)) { // if it doesnt exist
					makeNewLoop(self, preset)
				}

				var varID = 'Lp'+preset+'DwellB'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + dwell)
				self.setVariableValues({ [varID]: dwell })

				// self.lpModified = true

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpDwellB: dwell })
				}
			}
		},

		saveLp: { // Sends loop settings to the emotimo. This isnt necessary since it sends the settings anyways when a loop is recalled. This is just a sanity check action.
			name: 'Save Loop',
			options: [
				{
					type: 'static-text',
					label: 'info',
					value: 'Sends loop settings to the emotimo. This isnt necessary since it sends the settings anyways when a loop is recalled. This is just a sanity check action.'
				},
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current preset/loop selected\nID: Select a specific loop ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.settype === 'id',
					tooltip: 'If you dont see a specific loop ID, make sure it is setup first',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: saveLp')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
				} else {
					var preset = self.getVariableValue('CurrentLpSet');
				}
				var runtemp = self.getVariableValue('Lp'+preset+'RunT');
				var ramptemp = self.getVariableValue('Lp'+preset+'RampT');
				var lpAPt = self.getVariableValue('Lp'+preset+'APoint');
				var lpBPt = self.getVariableValue('Lp'+preset+'BPoint');
				var dwellA = self.getVariableValue('Lp'+preset+'DwellA');
				var dwellB = self.getVariableValue('Lp'+preset+'DwellB');

				self.sendEmotimoAPICommand(`G25 L${preset} A${lpAPt} B${lpBPt} T${(Number(runtemp) / 10)} R${(Number(ramptemp) / 10)} C${dwellA} D${dwellB}`);
				// self.lpModified = false
			},
		},
		recallLoop: {
			name: 'Recall Loop',
			options: [
				{
					type: 'dropdown',
					id: 'settype',
					label: 'Set Type',
					default: 'smart',
					choices: CHOICES_SET_TYPE,
					tooltip: 'Smart: The current preset/loop selected\nID: Select a specific loop ID to change',
				},
				{
					type: 'dropdown',
					id: 'id',
					label: 'ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.settype === 'id',
					tooltip: 'If you dont see a specific loop ID, make sure it is setup first',
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: recallLoop')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
				} else {
					var preset = self.getVariableValue('CurrentLpSet');
				}
				var runtemp = self.getVariableValue('Lp'+preset+'RunT');
				var ramptemp = self.getVariableValue('Lp'+preset+'RampT');
				var lpAPt = self.getVariableValue('Lp'+preset+'APoint');
				var lpBPt = self.getVariableValue('Lp'+preset+'BPoint');
				var dwellA = self.getVariableValue('Lp'+preset+'DwellA');
				var dwellB = self.getVariableValue('Lp'+preset+'DwellB');

				var loopActive = self.getVariableValue('LpActive')

				// self.log('debug', 'Active Loop: ' + loopActive)
				if (loopActive == -1) { // no loop active, to start loop
					if (!LOOP_ID.some(p => p.id === preset)) {
						self.log('warn', 'Loop ' + preset + ' is not configured yet')
						return;
					}

					// let setLpsRaw = self.getVariableValue('SetLps')
					// let setlps = []

					// try { // convert the '[]' to []
					// 	setlps = JSON.parse(setLpsRaw) || []
					// } catch (e) {
					// 	setlps = []
					// }

					// if (!setlps.includes(preset) || self.lpModified) { // if its not saved or its been modified, then send command
						self.sendEmotimoAPICommand(`G25 L${preset} A${lpAPt} B${lpBPt} T${(Number(runtemp) / 10)} R${(Number(ramptemp) / 10)} C${dwellA} D${dwellB}`);
						// self.lpModified = false
					// }
					setTimeout(() => self.sendEmotimoAPICommand(`G24 L${preset}`), 100);
				} else { // loop active, to stop it
					self.sendEmotimoAPICommand('G24')
				}
			}
		},

//============================
//  ***   OTHER STUFFS   ***
//============================

		gotoCoords: {
			name: 'Goto Coordinates',
			options: [
				{
					id: 'motorid',
					type: 'dropdown',
					label: 'Motor:',
					default: 1,
					choices: MOTOR_ID
				},
				{
					id: 'coords',
					type: 'textinput',
					label: 'Value',
					default: '0',
					useVariables: true,
				},
				{
					id: 'runtime',
					type: 'textinput',
					label: 'Run Time (Seconds)',
					default: '5.0',
					useVariables: true,
				},
				{
					id: 'ramptime',
					type: 'textinput',
					label: 'Ramp Time (Seconds)',
					default: '0.5',
					useVariables: true,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: gotoCoords')
				const resolvedCoordsValue = await self.parseVariablesInString(data.options.coords)
				const resolvedRunValue = await self.parseVariablesInString(data.options.runtime)
				const resolvedRampValue = await self.parseVariablesInString(data.options.ramptime)

				self.sendEmotimoAPICommand('G11 M' + data.options.motorid + ' P' + resolvedCoordsValue + ' T' + resolvedRunValue + ' A' + resolvedRampValue)
			}
		},
		savePstCoords: {
			name: 'Save Preset By Coordinates',
			options: [
				{
					id: 'smart',
					type:'dropdown',
					label: 'Smart or select preset id',
					choices: [
						{ id: 0, label: 'Smart' },
						{ id: 1, label: 'Preset ID' }
					],
					default: 0
				},
				{
					id: 'preset',
					type: 'number',
					label: 'Preset ID',
					default: 0,
					min: 0,
					max: 127,
					isVisible: (options) => options.smart === 1,
				},
				{
					type: 'static-text',
					label: 'info',
					value: 'Leave blank to store current motor position'
				},
				{
					id: 'pCoords',
					type: 'textinput',
					label: 'Pan Coords',
					useVariables: true,
				},
				{
					id: 'tCoords',
					type: 'textinput',
					label: 'Tilt Coords',
					useVariables: true,
				},
				{
					id: 'sCoords',
					type: 'textinput',
					label: 'Slide Coords',
					useVariables: true,
				},
				{
					id: 'zCoords',
					type: 'textinput',
					label: 'Zoom Coords',
					useVariables: true,
				},
				{
					id: 'runtime',
					type: 'textinput',
					label: 'Run Time',
					default: '50',
					min: 10,
					max: 600,
					useVariables: true,
				},
				{
					id: 'ramptime',
					type: 'textinput',
					label: 'Ramp Time',
					default: '10',
					min:5,
					max:300,
					useVariables: true,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: savePstCoords')
				if (data.options.smart == 0) {
					var preset = self.getVariableValue('CurrentPstSet')
				} else {
					var preset = data.options.preset
				}
				// If a variable gets inputted, get that value, otherwise it takes the inputted value
				var resolvedRunValue = await self.parseVariablesInString(data.options.runtime)
				var resolvedRampValue = await self.parseVariablesInString(data.options.ramptime)
				var resolvedPanValue = await self.parseVariablesInString(data.options.pCoords)
				var resolvedTiltValue = await self.parseVariablesInString(data.options.tCoords)
				var resolvedSlideValue = await self.parseVariablesInString(data.options.sCoords)
				var resolvedZoomValue = await self.parseVariablesInString(data.options.zCoords)

				// find if the variables/preset already exists
				var exists = false
				for (const item of variableList) {
					if (item.variableId === `Pst${preset}Stat`) {
						exists = true
						break
					}
				}
				if (!exists) {
					self.log('debug', `Preset ${preset} does not exist yet. Adding now`)

					PRESET_ID.push({ id: preset, label: `Pst${preset}` })
					self.updateActions()

					variableList.push({ name: `Preset${preset}RunT`, variableId: `Pst${preset}RunT` })
					variableList.push({ name: `Preset${preset}RampT`, variableId: `Pst${preset}RampT` })
					variableList.push({ name: `Preset${preset}Status`, variableId: `Pst${preset}Stat` })
					variableList.push({ name: `Preset${preset}PanPos`, variableId: `Pst${preset}PanPos` })
					variableList.push({ name: `Preset${preset}TiltPos`, variableId: `Pst${preset}TiltPos` })
					variableList.push({ name: `Preset${preset}M3Pos`, variableId: `Pst${preset}M3Pos` })
					variableList.push({ name: `Preset${preset}M4Pos`, variableId: `Pst${preset}M4Pos` })

					self.setVariableDefinitions(variableList)
				}

				// G21 needs all axis to have a value in order to store a custom location
				var cmd = 'G21 P' + preset
				var cmd2 = ' F0 I0 C0'

				// Pan
				if (!resolvedPanValue) { // if blank, get the current position instead
					resolvedPanValue = self.getVariableValue('MPos')
				}
				cmd += ' X' + resolvedPanValue
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstPanPos: resolvedPanValue })
				} else {
					self.setVariableValues({ [`Pst${preset}PanPos`]: resolvedPanValue })
				}
				// Tilt
				if (!resolvedTiltValue) { // if blank, get the current position instead
					resolvedTiltValue = self.getVariableValue('MPos')
				}
				cmd += ' Y' + resolvedTiltValue
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstTiltPos: resolvedTiltValue })
				} else {
					self.setVariableValues({ [`Pst${preset}TiltPos`]: resolvedTiltValue })
				}
				// Slide
				if (!resolvedSlideValue) { // if blank, get the current position instead
					resolvedSlideValue = self.getVariableValue('MPos')
				}
				cmd += ' Z' + resolvedSlideValue
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstM3Pos: resolvedSlideValue })
				} else {
					self.setVariableValues({ [`Pst${preset}M3Pos`]: resolvedSlideValue })
				}
				//Zoom
				if (!resolvedZoomValue) { // if blank, get the current position instead
					resolvedZoomValue = self.getVariableValue('MPos')
				}
				cmd += ' W' + resolvedZoomValue
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstM4Pos: resolvedZoomValue })
				} else {
					self.setVariableValues({ [`Pst${preset}M4Pos`]: resolvedZoomValue })
				}

				if (!resolvedRunValue) { // if blank, set a default value instead
					resolvedRunValue = 50
				}
				cmd2 += ' T' + resolvedRunValue / 10
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstRun: resolvedRunValue })
				} else {
					self.setVariableValues({ [`Pst${preset}RunT`]: resolvedRunValue })
				}

				if (!resolvedRampValue) { // if blank, set a default value instead
					resolvedRampValue = 10
				}
				cmd2 += ' A' + resolvedRampValue / 10
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstRun: resolvedRampValue })
				} else {
					self.setVariableValues({ [`Pst${preset}RampT`]: resolvedRampValue })
				}

				self.setVariableValues({ [`Pst${preset}RunT`]: resolvedRunValue})
				self.setVariableValues({ [`Pst${preset}RampT`]: resolvedRampValue})
				self.setVariableValues({ [`Pst${preset}Stat`]: 0 })

				self.sendEmotimoAPICommand(cmd + cmd2)
			}
		},
		setMotorPosition: {
			name: 'Set Motor Position',
			options: [
				{
					type: 'static-text',
					label: 'WARNING',
					value: 'Sets the internal motor position to a value, does NOT move the motor'
				},
				{
					type: 'static-text',
					label: 'info',
					value: 'Leave blank to keep current value.'
				},
				{
					id: 'pCoords',
					type: 'textinput',
					label: 'Pan Coords',
					useVariables: true,
				},
				{
					id: 'tCoords',
					type: 'textinput',
					label: 'Tilt Coords',
					useVariables: true,
				},
				{
					id: 'sCoords',
					type: 'textinput',
					label: 'Slide Coords',
					useVariables: true,
				},
				{
					id: 'zCoords',
					type: 'textinput',
					label: 'Zoom Coords',
					useVariables: true,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: setMotorPosition')
				const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
				// If a variable gets inputted, get that value, otherwise it takes the inputted value
				var resolvedPanValue = await self.parseVariablesInString(data.options.pCoords)
				var resolvedTiltValue = await self.parseVariablesInString(data.options.tCoords)
				var resolvedSlideValue = await self.parseVariablesInString(data.options.sCoords)
				var resolvedZoomValue = await self.parseVariablesInString(data.options.zCoords)
				let sendBuf

				// Pan
				if (resolvedPanValue) { // if not blank, do things
					self.log('debug', `Setting motor PAN to position ${resolvedPanValue}`)
					self.setVariableValues({ 'PPos': resolvedPanValue })
					self.sendEmotimoAPICommand(`G200 M1 P${resolvedPanValue}`)
					await wait(200) // waits 200ms before continuing
				}
				// Tilt
				if (resolvedTiltValue) { // if not blank, do things
					self.log('debug', `Setting motor Tilt to position ${resolvedTiltValue}`)
					self.setVariableValues({ 'TPos': resolvedTiltValue })
					self.sendEmotimoAPICommand(`G200 M2 P${resolvedTiltValue}`)
					await wait(200) // waits 200ms before continuing
				}
				// Slide
				if (resolvedSlideValue) { // if not blank, do things
					self.log('debug', `Setting motor M3 to position ${resolvedSlideValue}`)
					self.setVariableValues({ 'SPos': resolvedSlideValue })
					self.sendEmotimoAPICommand(`G200 M3 P${resolvedSlideValue}`)
					await wait(200) // waits 200ms before continuing
				}
				//Zoom
				if (resolvedZoomValue) { // if not blank, do things
					self.log('debug', `Setting motor M4 to position ${resolvedZoomValue}`)
					self.setVariableValues({ 'MPos': resolvedZoomValue })
					self.sendEmotimoAPICommand(`G200 M4 P${resolvedZoomValue}`)
					await wait(200) // waits 200ms before continuing
				}
			}
		},
		virtualInput: {
			name: 'Virtual Button Input',
			options: [
				{
					id: 'vbutton',
					type: 'dropdown',
					label: 'Button Input',
					default: 0,
					choices: VIRTUAL_BUTTON,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: virtualInput')
				self.sendEmotimoAPICommand('G600 C' + data.options.vbutton)
			},
		},
		send: {
			name: 'Send Command',
			options: [
				{
					type: 'textinput',
					id: 'id_send',
					label: 'Command:',
					tooltip: 'Use %hh to insert Hex codes',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					id: 'id_end',
					label: 'Command End Character:',
					default: '\n',
					choices: CHOICES_END,
				},
			],
			callback: async (data) => {
				self.log('info', 'Action Triggered: send CMD')
				const cmd = unescape(await self.parseVariablesInString(data.options.id_send))

				if (cmd != '') {
					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + data.options.id_end, 'latin1')

					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}
				}
			},
		},
	})
}
