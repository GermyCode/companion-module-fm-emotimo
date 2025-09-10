const { variableList } = require('./variables')

const CHOICES_END = [
	{ id: '', label: 'None' },
	{ id: '\n', label: 'LF - \\n (Common UNIX/Mac)' },
	{ id: '\r\n', label: 'CRLF - \\r\\n (Common Windows)' },
	{ id: '\r', label: 'CR - \\r (Old MacOS)' },
	{ id: '\x00', label: 'NULL - \\x00 (Can happen)' },
	{ id: '\n\r', label: 'LFCR - \\n\\r (Just stupid)' },
]

const MOTOR_ID = [
	{ id: 1, label: 'Pan' },
	{ id: 2, label: 'Tilt' },
	{ id: 3, label: 'M3-Slide' },
	{ id: 4, label: 'M4-Zoom' },
	{ id: 5, label: 'TN 1' },
	{ id: 6, label: 'TN 2' },
	{ id: 7, label: 'TN 3' },
	{ id: 8, label: 'Roll' },
	{ id: 9, label: 'Focus' },
]

const MOTOR_ID_UNSET = [ //This is used to have a null value so we can pull the CurrentMtrSet value instead
	{ id: 0, label: 'Unset' },
	{ id: 1, label: 'Pan' },
	{ id: 2, label: 'Tilt' },
	{ id: 3, label: 'M3-Slide' },
	{ id: 4, label: 'M4-Zoom' },
	{ id: 5, label: 'TN 1' },
	{ id: 6, label: 'TN 2' },
	{ id: 7, label: 'TN 3' },
	{ id: 8, label: 'Roll' },
	{ id: 9, label: 'Focus' },
]

const TN_MOTOR_ID = [
	{ id: 5, label: 'TN 1' },
	{ id: 6, label: 'TN 2' },
	{ id: 7, label: 'TN 3' },
]

const DIRECTION_ID = [
	{ id: 1, label: 'Positive' },
	{ id: -1, label: 'Negative' },
]

const MOTOR_SPEED = [
	{ id: 0, label: 'Default' },
	{ id: 5000, label: 'Slow' },
	{ id: 25000, label: 'Medium' },
	{ id: 50000, label: 'Fast' },
	{ id: 100000, label: 'Fastest' },

]

const MOTOR_PROFILES = [
	{ id: 0, label: 'Quiet/Fast' },
	{ id: 1, label: 'Quiet/Medium' },
	{ id: 2, label: 'Quiet/Slow' },
	{ id: 3, label: 'Timelapse' },
	{ id: 4, label: 'Fastest' },
	{ id: 5, label: 'User Defined 1' },
	{ id: 6, label: 'User Defined 2' },
	{ id: 7, label: 'Inertia Wheels' },
]

var PRESET_ID = [
	{ id: 0, label: 'Pst0' },
]

var LOOP_ID = [
	{ id: 0, label: 'Lp0' },
]

const VIRTUAL_BUTTON = [
	{ id: 0, label: 'Enter' },
	{ id: 1, label: 'Up' },
	{ id: 2, label: 'Right' },
	{ id: 3, label: 'Down' },
	{ id: 4, label: 'Left' },
	{ id: 5, label: 'Back' },
	{ id: 6, label: 'Enter Held' },
	{ id: 7, label: 'Empty' },
	{ id: 8, label: 'Empty' },

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

const MOTOR_OPTIONS = [
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
		id: 'id_mot',
		label: 'Motor ID',
		default: 1,
		choices: MOTOR_ID,
		isVisible: (options) => options.settype === 'id',
	},
]

module.exports = function (self) {
	self.setActionDefinitions({

//============================
//  ***   MOTOR STUFFS   ***
//============================

		jogMotor: {
			name: 'Motor Jog',
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
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
					isVisible: (options) => options.settype === 'id',
				},
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
				self.log('warn', 'Action: Jog Motors')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id_mot
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}

				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';
				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not fund');
					return;
				}

				var motorSpeed = 0

				if (data.options.id_speed === 1) { // If default speed is selected
					var motorInversion = 1
					var temp = 0
					temp = self.getVariableValue(`${motor_name}SpeedLimit`)
					motorInversion = self.getVariableValue(`${motor_name}Inversion`)

					self.log('warn', 'motorInversion: ' + motorInversion);
					self.log('warn', 'temp: ' + temp);

					if (motor_id < 5 || motor_id == 8) {
						motorSpeed = motorInversion * data.options.dir * temp / 100.0 * 500.0
					} else {
						motorSpeed = motorInversion * data.options.dir * temp / 100.0 * 100.0
					}

					self.log('warn', 'motorSpeed: ' + motorSpeed);

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
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: Jog Motors STOP')
				if (data.options.settype ===  'id') {
					var motor_id = data.options.id_mot
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}

				self.sendEmotimoAPICommand('G300 M' + motor_id + ' V0')
			},
		},
		setJogSpeedLimit: {
			name: 'Set Motor Jog Speed',
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
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
					isVisible: (options) => options.settype === 'id',
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
				self.log('warn', 'Action: setJogSpeedLimit')

				const motor_id = data.options.id_mot
				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';
				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not fund');
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
					speedtemp = 100
				}

				if (speedtemp > 100) {
					speedtemp = 100;
				} else if (speedtemp < 0) {
					speedtemp = 0;
				}

				self.log('debug', 'Motor ID: ' + data.options.id_mot + ' Speed: ' + speedtemp)

				self.setVariableValues({ [`${motor_name}SpeedLimit`]: speedtemp })
			}
		},

		setCruiseSpeed: {
			name: 'Set Motor Cruise Speed',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
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
				self.log('warn', 'Action: Set Cruise Speed')
				var motorSpeed = 0
				var motorInversion = 1
				var rawMotorSpeed = 0
				var temp = 0

				const motor_id = data.options.id_mot;
				// gets the label of the motor by the id provided, if none is found it gives 'Unknown'
				const motor_name = (MOTOR_ID.find(m => String(m.id) === String(motor_id))?.label) ?? 'Unknown';

				if (motor_name === 'Unknown') {
					self.log('error', 'Module: Motor Id: ' + motor_id + ' not fund');
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
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: resetCruiseSpeed')
				if (data.options.id_mot == 1) {
					self.setVariableValues({ PanCruiseSpeed: 0 })
				} else if (data.options.id_mot == 2) {
					self.setVariableValues({ TiltCruiseSpeed: 0 })
				} else if (data.options.id_mot == 3) {
					self.setVariableValues({ 'M3-SlideCruiseSpeed': 0 })
				} else if (data.options.id_mot == 4) {
					self.setVariableValues({ 'M4-ZoomCruiseSpeed': 0 })
				} else if (data.options.id_mot == 5) {
					self.setVariableValues({ TN1CruiseSpeed: 0 })
				} else if (data.options.id_mot == 6) {
					self.setVariableValues({ TN2CruiseSpeed: 0 })
				} else if (data.options.id_mot == 7) {
					self.setVariableValues({ TN3CruiseSpeed: 0 })
				} else if (data.options.id_mot == 8) {
					self.setVariableValues({ RollCruiseSpeed: 0 })
				} else if (data.options.id_mot == 9) {
					self.setVariableValues({ FocusCruiseSpeed: 0 })
				}

				self.sendEmotimoAPICommand('G301 M' + data.options.id_mot + ' V0')
			}
		},

		tnpositionDrive: {
			name: 'Send TN Motor Position',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
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
				self.log('warn', 'Action: tnpositionDrive')
				var temp = 0
				var increment = 0

				if (cmd != '') {
					if (data.options.id_mot == 5) {
						temp = self.getVariableValue('FPos')
						increment = self.getVariableValue('FStep')
					} else if (data.options.id_mot == 6) {
						temp = self.getVariableValue('IPos')
						increment = self.getVariableValue('IStep')
					} else if (data.options.id_mot == 7) {
						temp = self.getVariableValue('ZPos')
						increment = self.getVariableValue('ZStep')
					}

					temp += (data.options.direction * increment);
					// self.log('debug', 'Motor ID' + data.options.id_mot + 'Position' + temp)

					if (temp > 10000) {
						temp = 10000;
					} else if (temp < 0) {
						temp = 0;
					}

					if (data.options.id_mot == 5) {
						self.setVariableValues({ FPos: temp })
					} else if (data.options.id_mot == 6) {
						self.setVariableValues({ IPos: temp })
					} else if (data.options.id_mot == 7) {
						self.setVariableValues({ ZPos: temp })
					}

					self.sendEmotimoAPICommand('G302 M' + data.options.id_mot + ' P' + temp)
				}
			},
		},
		positionDrive: {
			name: 'Send Motor Position',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
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
				self.log('warn', 'Action: positionDrive')
				var cmdParam ='X'
				var temp = 0
				var increment = 0

				if (data.options.id_mot == 1) {
					temp = self.getVariableValue('PPos')
					increment = self.getVariableValue('PStep')
					cmdParam = 'X'
				} else if (data.options.id_mot == 2) {
					temp = self.getVariableValue('TPos')
					increment = self.getVariableValue('TStep')
					cmdParam = 'Y'
				} else if (data.options.id_mot == 3) {
					temp = self.getVariableValue('SPos')
					increment = self.getVariableValue('SStep')
					cmdParam = 'Z'
				} else if (data.options.id_mot == 4) {
					temp = self.getVariableValue('MPos')
					increment = self.getVariableValue('MStep')
					cmdParam = 'W'
				} else if (data.options.id_mot == 5) {
					temp = self.getVariableValue('FPos')
					increment = self.getVariableValue('FStep')
					cmdParam = 'F'
				} else if (data.options.id_mot == 6) {
					temp = self.getVariableValue('IPos')
					increment = self.getVariableValue('IStep')
					cmdParam = 'I'
				} else if (data.options.id_mot == 7) {
					temp = self.getVariableValue('ZPos')
					increment = self.getVariableValue('ZStep')
					cmdParam = 'C'
				} else if (data.options.id_mot == 8) {
					temp = self.getVariableValue('RPos')
					increment = self.getVariableValue('RStep')
					cmdParam = 'R'
				}

				temp += (data.options.direction * increment);
				// self.log('debug', 'Motor ID' + data.options.id_mot + 'Position' + temp)

				if (data.options.id_mot == 1) {
					self.setVariableValues({ PPos: temp })
				} else if (data.options.id_mot == 2) {
					self.setVariableValues({ TPos: temp })
				} else if (data.options.id_mot == 3) {
					self.setVariableValues({ SPos: temp })
				} else if (data.options.id_mot == 4) {
					self.setVariableValues({ MPos: temp })
				} else if (data.options.id_mot == 5) {
					self.setVariableValues({ FPos: temp })
				} else if (data.options.id_mot == 6) {
					self.setVariableValues({ IPos: temp })
				} else if (data.options.id_mot == 7) {
					self.setVariableValues({ ZPos: temp })
				} else if (data.options.id_mot == 8) {
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
					id: 'id_mot',
					label: 'Motor ID',
					default: 5,
					choices: MOTOR_ID,
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: toggleIncrement')
				var temp = 0

				if (data.options.id_mot == 1) {
					temp = self.getVariableValue('PStep')
				} else if (data.options.id_mot == 2) {
					temp = self.getVariableValue('TStep')
				} else if (data.options.id_mot == 3) {
					temp = self.getVariableValue('SStep')
				} else if (data.options.id_mot == 4) {
					temp = self.getVariableValue('MStep')
				} else if (data.options.id_mot == 5) {
					temp = self.getVariableValue('FStep')
				} else if (data.options.id_mot == 6) {
					temp = self.getVariableValue('IStep')
				} else if (data.options.id_mot == 7) {
					temp = self.getVariableValue('ZStep')
				} else if (data.options.id_mot == 8) {
					temp = self.getVariableValue('RStep')
				}

				if (data.options.id_mot < 3) {
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

				} else if (data.options.id_mot < 5) {
					if (temp == 1000) {
						temp = 10000;
					} else {
						temp = 1000;
					}
				} else if (data.options.id_mot < 8) {
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

				self.log('debug', 'Model: ' + self.config.model + ' Motor ID: ' + data.options.id_mot + ' Increment: ' + temp)

				if (data.options.id_mot == 1) {
					temp = self.setVariableValues({ PStep: temp })
				} else if (data.options.id_mot == 2) {
					temp = self.setVariableValues({ TStep: temp })
				} else if (data.options.id_mot == 3) {
					temp = self.setVariableValues({ SStep: temp })
				} else if (data.options.id_mot == 4) {
					temp = self.setVariableValues({ MStep: temp })
				} else if (data.options.id_mot == 5) {
					self.setVariableValues({ FStep: temp })
				} else if (data.options.id_mot == 6) {
					self.setVariableValues({ IStep: temp })
				} else if (data.options.id_mot == 7) {
					self.setVariableValues({ ZStep: temp })
				} else if (data.options.id_mot == 8) {
					self.setVariableValues({ RStep: temp })
				}
			}
		},

		stopMotors: {
			name: 'Stop All Motors',
			options: [],
			callback: async () => {
				self.log('warn', 'Action: stopMotors')
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
				self.log('warn', 'Action: homeRS')
				self.sendEmotimoAPICommand('G202')
			}
		},
		calibrateAllTN: {
			name: 'Calibrate All TN',
			options: [],
			callback: async () => {
				self.log('warn', 'Action: calibrateAllTN')
				self.sendEmotimoAPICommand('G812 C0')
			}
		},
		calibrateTNMotor: {
			name: 'Calibrate TN Motor',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 5,
					choices: TN_MOTOR_ID,
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: calibrateTNMotor')
				self.sendEmotimoAPICommand('G812 C0 M' + (data.options.id_mot-4))
			}
		},

		invertCurrentAxis: {
			name: 'Invert Current Motor',
			options: [],
			callback: async () => {
				self.log('warn', 'Action: invertCurrentAxis')
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
					self.setVariableValues({ 'M3-SlideInversion': inversionState })
				} else if (motor == 4) {
					inversionState = self.getVariableValue('M4-ZoomInversion')
					inversionState *= -1
					self.setVariableValues({ 'M4-ZoomInversion': inversionState })
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
				self.log('warn', 'Action: setStopA')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id_mot
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
				self.log('warn', 'Action: setStopB')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id_mot
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G213 M' + motor_id)
			}
		},

		recallStopA: {
			name: 'Recall Stop A',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 0,
					choices: MOTOR_ID_UNSET,
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: recallStopA')
				const motor_id = data.options.id_mot

				if (motor_id == 0) {
					motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G217 M' + motor_id)
			}
		},
		recallStopB: {
			name: 'Recall Stop B',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 0,
					choices: MOTOR_ID_UNSET,
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: recallStopB')
				const motor_id = data.options.id_mot

				if (motor_id == 0) {
					motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G218 M' + motor_id)
			}
		},

		clearStopA: {
			name: 'Clear Stop A',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('warn', 'Action: clearStopA')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id_mot
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
				self.log('warn', 'Action: clearStopB')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id_mot
				} else {
					var motor_id = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G219 M' + motor_id)
			}
		},
		clearStopByAxis: {
			name: 'Clear Stops by Axis',
			options: [...MOTOR_OPTIONS],
			callback: async (data) => {
				self.log('warn', 'Action: clearStopByAxis')
				if (data.options.settype === 'id') { // Not Smart type
					var motor_id = data.options.id_mot
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
				self.log('warn', 'Action: clearAllStops')
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
					choices: DIRECTION_ID
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: setMotorID')
				var motor = self.getVariableValue('CurrentMtrSet')
				var motorName = self.getVariableValue('CurrentMtrStr')
				var motorSpeed = 0
				var motorInvert = 0
				var motorPosName = ''
				var motorNegName = ''
				var motorInvertName = ''

				motor += data.options.direction
				
				if (motor > 9) {
					motor = 9;
				} else if (motor < 1) {
					motor = 1;
				}

				if (motor == 1) {
					motorName = 'Pan'
					motorSpeed = self.getVariableValue('PanSpeedLimit')
					motorInvert = self.getVariableValue('PanInversion')
					motorPosName = motorName + ' Right'
					motorNegName = motorName + ' Left'
				} else if (motor == 2) {
					motorName = 'Tilt'
					motorSpeed = self.getVariableValue('TiltSpeedLimit')
					motorInvert = self.getVariableValue('TiltInversion')
					motorPosName = motorName + ' Up'
					motorNegName = motorName + ' Down'
				} else if (motor == 3) {
					motorName = 'Slide'
					motorSpeed = self.getVariableValue('M3-SlideSpeedLimit')
					motorInvert = self.getVariableValue('M3-SlideInversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				} else if (motor == 4) {
					motorName = 'M4'
					motorSpeed = self.getVariableValue('M4-ZoomSpeedLimit')
					motorInvert = self.getVariableValue('M4-ZoomInversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				} else if (motor == 5) {
					motorName = 'Focus'
					motorSpeed = self.getVariableValue('TN1SpeedLimit')
					motorInvert = self.getVariableValue('TN1Inversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				} else if (motor == 6) {
					motorName = 'Iris'
					motorSpeed = self.getVariableValue('TN2SpeedLimit')
					motorInvert = self.getVariableValue('TN2Inversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				} else if (motor == 7) {
					motorName = 'Zoom'
					motorSpeed = self.getVariableValue('TN3SpeedLimit')
					motorInvert = self.getVariableValue('TN3Inversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				} else if (motor == 8) {
					motorName = 'Roll'
					motorSpeed = self.getVariableValue('RollSpeedLimit')
					motorInvert = self.getVariableValue('RollInversion')
					motorPosName = motorName + ' CW'
					motorNegName = motorName + ' CCW'
				} else if (motor == 9) {
					motorName = 'RS Focus'
					motorSpeed = self.getVariableValue('FocusSpeedLimit')
					motorInvert = self.getVariableValue('FocusInversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				}

				if (motorInvert == 1) {
					motorInvertName = 'Normal'
				} else {
					motorInvertName = 'Inverted'
				}

				self.setVariableValues({ CurrentMtrSet: motor })
				self.setVariableValues({ CurrentMtrStr: motorName })
				self.setVariableValues({ CurrentMtrPosStr: motorPosName })
				self.setVariableValues({ CurrentMtrNegStr: motorNegName })
				self.setVariableValues({ CurrentMtrSpeed: motorSpeed})
				self.setVariableValues({ CurrentMtrInversion: motorInvertName})
				
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
				}
			],
			callback: async (data) => {
				self.log('warn', 'Action: setMotorProfile')
				const selProf = data.options.prodileid
				self.setVariableValues({ CurrentMtrProf: selProf})

				self.sendEmotimoAPICommand('G102 P' + selProf)
			}
		},

		stopCurrentMotor: {
			name: 'Stop Current Motor',
			options: [],
			callback: async () => {
				self.log('warn', 'Action: stopCurrentMotor')
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G301 M' + motor + ' V0')
			},
		},

		zeroMotors: {
			name: 'Zero Motors',
			options: [],
			callback: async () => {
				self.log('warn', 'Action: zeroMotors')
				self.sendEmotimoAPICommand('G201')
			}
		},

//============================
//  ***   PRESET STUFFS   ***
//============================

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
					type: 'number',
					id: 'id',
					label: 'Preset ID',
					default: 0,
					min: 0,
					max: 127,
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: savePset')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
				}

				var runtemp = self.getVariableValue('Pst'+preset+'RunT') || 50
				var ramptemp = self.getVariableValue('Pst'+preset+'RampT') || 10

				if (!PRESET_ID.some(p => p.id === preset)) {
					self.log('debug', 'Preset ' + preset + ' is not already set. Setting now')
					self.sendEmotimoAPICommand('G21 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
					setTimeout(() => {
						self.log('debug', 'Getting info for new preset')
						self.sendEmotimoAPICommand('G752 P' + preset)
					}, 100)
				} else {
				self.sendEmotimoAPICommand('G21 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
				}
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
					type: 'number',
					id: 'id',
					label: 'Preset ID',
					default: 0,
					min: 0,
					max: 127,
					isVisible: (options) => options.settype === 'id',
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: recallPset')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
				}

				if (!PRESET_ID.some(p => p.id === preset)) {
					self.log('error', 'Module: Cannot recall preset ' + preset + ' because it is not set yet')
					return;
				}

				const cmd = 'G20 P' + preset
				self.setVariableValues({ LastPstID: preset })
				self.log('debug', 'Recalled Preset: ' + preset)
				self.sendEmotimoAPICommand(cmd)
			},
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
					id: 'gotoPst',
					type: 'number',
					label: 'Set Preset ID',
					default: 0,
					min: 0,
					max: 127,
					isVisible: (options) => options.direction === 'set'
				}
			],
			callback: async (data) => {
				self.log('warn', 'Action: setPresetID')
				var preset = self.getVariableValue('CurrentPstSet')
				if (data.options.direction === 'set') {
					preset = data.options.gotoPst
				} else {
					preset += data.options.direction
				}

				if (preset < 0) {
					preset = 0;
				} else if (preset > 127) { 
					preset = 127;
				}

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

					self.setVariableValues({ [`Pst${preset}RunT`]: 50 })
					self.setVariableValues({ [`Pst${preset}RampT`]: 10 })
					self.setVariableValues({ [`Pst${preset}Stat`]: 0 })
				}

				var ramptemp = self.getVariableValue(`Pst${preset}RampT`)
				var runtemp = self.getVariableValue(`Pst${preset}RunT`)
				var panpos = self.getVariableValue(`Pst${preset}PanPos`)
				var tiltpos = self.getVariableValue(`Pst${preset}TiltPos`)
				var m3pos = self.getVariableValue(`Pst${preset}M3Pos`)
				var m4pos = self.getVariableValue(`Pst${preset}M4Pos`)

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp + ' PanPos: ' + panpos + ' TiltPos: ' + tiltpos + ' M3Pos: ' + m3pos + ' M4Pos: ' + m4pos)

				self.setVariableValues({ CurrentPstSet: preset })
				self.setVariableValues({ CurrentPstSetRun: runtemp })
				self.setVariableValues({ CurrentPstSetRamp: ramptemp })
				self.setVariableValues({ CurrentPstPanPos: panpos })
				self.setVariableValues({ CurrentPstTiltPos: tiltpos })
				self.setVariableValues({ CurrentPstM3Pos: m3pos })
				self.setVariableValues({ CurrentPstM4Pos: m4pos })

				self.checkFeedbacks("SetPresetSmart")
			}
		},

		setPresetRunTime: {
			name: 'Set Preset Run Time',
			options: [...PST_OPTIONS],
			callback: async (data) => {
				self.log('warn', 'Action: setPresetRunTime')
				var skip = false
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Pst'+preset+'RunT')
					var ramptemp = self.getVariableValue('Pst'+preset+'RampT')
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
					var runtemp = self.getVariableValue('CurrentPstSetRun')
					var ramptemp = self.getVariableValue('CurrentPstSetRamp')
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
					skip = true
				} else if (runtemp < 10) {
					runtemp = 10;
					skip = true
				}

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+preset+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
				self.setVariableValues({ [varID]: runtemp })
				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstSetRun: runtemp })
				}

				if (skip) return;
				self.sendEmotimoAPICommand('G21 N1 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},
		setPresetRampTime: {
			name: 'Set Preset Ramp Time',
			options: [...PST_OPTIONS],
			callback: async (data) => {
				self.log('warn', 'Action: setPresetRampTime')
				var skip = false
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Pst'+preset+'RunT')
					var ramptemp = self.getVariableValue('Pst'+preset+'RampT')
				} else {
					var preset = self.getVariableValue('CurrentPstSet')
					var runtemp = self.getVariableValue('CurrentPstSetRun')
					var ramptemp = self.getVariableValue('CurrentPstSetRamp')
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
					skip = true
				} else if (ramptemp < 5) {
					ramptemp = 5;
					skip = true
				}

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+preset+'RampT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
				self.setVariableValues({ [varID]: ramptemp })

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstSetRamp: ramptemp })
				}

				if (skip) return;
				self.sendEmotimoAPICommand('G21 N1 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},

//============================
//  ***   LOOP STUFFS   ***
//============================

		saveLp: {
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
				self.log('warn', 'Action: saveLp')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Lp'+preset+'RunT');
					var ramptemp = self.getVariableValue('Lp'+preset+'RampT');
					var lpAPt = self.getVariableValue('Lp'+preset+'APoint');
					var lpBPt = self.getVariableValue('Lp'+preset+'BPoint');
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var ramptemp = self.getVariableValue('CurrentLpRamp')
					var runtemp = self.getVariableValue('CurrentLpRun')
					var lpAPt = self.getVariableValue('CurrentLpA')
					var lpBPt = self.getVariableValue('CurrentLpB')
				}
				self.sendEmotimoAPICommand('G25 L' + preset + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
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
				self.log('warn', 'Action: recallLoop')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var runtemp = self.getVariableValue('Lp'+preset+'RunT');
					var ramptemp = self.getVariableValue('Lp'+preset+'RampT');
					var tempA = self.getVariableValue('Lp'+preset+'APoint');
					var tempB = self.getVariableValue('Lp'+preset+'BPoint');
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var ramptemp = self.getVariableValue('CurrentLpRamp')
					var runtemp = self.getVariableValue('CurrentLpRun')
					var tempA = self.getVariableValue('CurrentLpA')
					var tempB = self.getVariableValue('CurrentLpB')
				}

				var loopActive = self.getVariableValue('LpActive')

				self.log('debug', 'Active Loop: ' + loopActive)
				if (loopActive == -1) {
					self.setVariableValues({ LpActive: preset })
					self.setVariableValues({ LastPstID: -1})
					self.checkFeedbacks("LoopStatus")

					self.sendEmotimoAPICommand('G25 L' + preset + ' A' + tempA + ' B' + tempB + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
					setTimeout(() => self.sendEmotimoAPICommand('G24 L' + preset + ' N0'), 100);
				} else {
					self.setVariableValues({ LpActive: -1 })
					self.checkFeedbacks("LoopStatus")
					self.sendEmotimoAPICommand('G24')
				}
			}
		},

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
				self.log('warn', 'Action: setLoopID')
				var id_loop = self.getVariableValue('CurrentLpSet')

				if (data.options.direction === 'set') {
					id_loop = data.options.gotoLoop
				} else {
					id_loop += data.options.direction
				}

				if (id_loop > 7) {
					id_loop = 7;
				} else if (id_loop < 0) {
					id_loop = 0;
				}

				var exists = false
				for (const item of variableList) {
					if (item.variableId === `Lp${id_loop}RunT`) {
						exists = true
						break
					}
				}

				if (!exists) {
					self.log('debug', `Loop ${id_loop} does not exist yet. Adding now`)

					LOOP_ID.push({ id: id_loop, label: `Lp${id_loop}` })
					let setLpsRaw = self.getVariableValue('SetLps')
					let setlps = []

					try {
						setlps = JSON.parse(setLpsRaw) || []
					} catch (e) {
						setlps = []
					}

					// Only add if not already present
					if (!setlps.includes(id_loop)) {
						setlps.push(id_loop)
						self.setVariableValues({ SetLps: JSON.stringify(setlps) })
					}
					self.updateActions()

					variableList.push({ name: `Loop${id_loop}RunT`, variableId: `Lp${id_loop}RunT` })
					variableList.push({ name: `Loop${id_loop}RampT`, variableId: `Lp${id_loop}RampT` })
					variableList.push({ name: `Loop${id_loop}APoint`, variableId: `Lp${id_loop}APoint` })
					variableList.push({ name: `Loop${id_loop}BPoint`, variableId: `Lp${id_loop}BPoint` })

					self.setVariableDefinitions(variableList)

					self.setVariableValues({ [`Lp${id_loop}RunT`]: 50 })
					self.setVariableValues({ [`Lp${id_loop}RampT`]: 10 })
					self.setVariableValues({ [`Lp${id_loop}APoint`]: 0 })
					self.setVariableValues({ [`Lp${id_loop}BPoint`]: 0 })
				}

				var ramptemp = self.getVariableValue('Lp' + id_loop + 'RampT')
				var runtemp = self.getVariableValue('Lp' + id_loop + 'RunT')
				var lpApt = self.getVariableValue('Lp' + id_loop + 'APoint')
				var lpBpt = self.getVariableValue('Lp' + id_loop + 'BPoint')

				self.log('debug', 'Loop ID: ' + id_loop + ' A: ' + lpApt + ' B: ' + lpBpt + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				self.setVariableValues({ CurrentLpSet: id_loop })
				self.setVariableValues({ CurrentLpRun: runtemp })
				self.setVariableValues({ CurrentLpRamp: ramptemp })
				self.setVariableValues({ CurrentLpA: lpApt })
				self.setVariableValues({ CurrentLpB: lpBpt })

				self.checkFeedbacks("SetLoopSmart")
			}
		},

		setLoopRunTime: {
			name: 'Set Loop Run Time',
			options: [...LP_OPTIONS],
			callback: async (data) => {
				self.log('warn', 'Action: setLoopRunTime')
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

				var varID = 'Lp'+preset+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
				self.setVariableValues({ [varID]: runtemp })

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpRun: runtemp })
				}
			}
		},
		setLoopRampTime: {
			name: 'Set Loop Ramp Time',
			options: [...LP_OPTIONS],
			callback: async (data) => {
				self.log('warn', 'Action: setLoopRampTime')
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
					if (ramptemp < 10) {
						ramptemp = 10;
					} else {
						ramptemp += data.options.ammount;
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

				var varID = 'Lp'+preset+'RampT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
				self.setVariableValues({ [varID]: ramptemp })

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpRamp: ramptemp })
				}
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
					type: 'number',
					label: 'Preset ID',
					id: 'psetid',
					min: 0,
					max: 127,
					default: 0,
					isVisible: (options) => options.direction === 'id',
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: setLoopAPoint')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var pointTemp = self.getVariableValue('Lp'+preset+'APoint');
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var pointTemp = self.getVariableValue('CurrentLpA');
				}

				if (data.options.direction === 'id') {
					pointTemp = data.options.psetid
				} else {
					pointTemp += data.options.direction
				}

				if (pointTemp > 127) {
					pointTemp = 127;
				} else if (pointTemp < 0) {
					pointTemp = 0;
				}

				var varID = 'Lp'+preset+'APoint'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + pointTemp)
				self.setVariableValues({ [varID]: pointTemp })

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
					type: 'number',
					label: 'Preset ID',
					id: 'psetid',
					min: 0,
					max: 127,
					default: 0,
					isVisible: (options) => options.direction === 'id',
				},
			],
			callback: async (data) => {
				self.log('warn', 'Action: setLoopBPoint')
				if (data.options.settype === 'id') { // Not Smart type
					var preset = data.options.id
					var pointTemp = self.getVariableValue('Lp'+preset+'BPoint');
				} else {
					var preset = self.getVariableValue('CurrentLpSet')
					var pointTemp = self.getVariableValue('CurrentLpB');
				}

				if (data.options.direction === 'id') {
					pointTemp = data.options.psetid
				} else {
					pointTemp += data.options.direction
				}

				if (pointTemp > 127) {
					pointTemp = 127;
				} else if (pointTemp < 0) {
					pointTemp = 0;
				}

				var varID = 'Lp'+preset+'BPoint'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + pointTemp)
				self.setVariableValues({ [varID]: pointTemp })

				if (data.options.settype === 'smart' || preset === self.getVariableValue('CurrentLpSet')) {
					self.setVariableValues({ CurrentLpB: pointTemp })
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
				self.log('warn', 'Action: gotoCoords')
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
				self.log('warn', 'Action: savePstCoords')
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
					self.setVariableValues({ CurrentPstSetRun: resolvedRunValue })
				} else {
					self.setVariableValues({ [`Pst${preset}RunT`]: resolvedRunValue })
				}

				if (!resolvedRampValue) { // if blank, set a default value instead
					resolvedRampValue = 10
				}
				cmd2 += ' A' + resolvedRampValue / 10
				if (preset === self.getVariableValue('CurrentPstSet')) {
					self.setVariableValues({ CurrentPstSetRun: resolvedRampValue })
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
				self.log('warn', 'Action: setMotorPosition')
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
					self.log('debug', `Setting motor M3-Slide to position ${resolvedSlideValue}`)
					self.setVariableValues({ 'SPos': resolvedSlideValue })
					self.sendEmotimoAPICommand(`G200 M3 P${resolvedSlideValue}`)
					await wait(200) // waits 200ms before continuing
				}
				//Zoom
				if (resolvedZoomValue) { // if not blank, do things
					self.log('debug', `Setting motor M4-Zoom to position ${resolvedZoomValue}`)
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
				self.log('warn', 'Action: virtualInput')
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
				self.log('warn', 'Action: send CMD')
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
