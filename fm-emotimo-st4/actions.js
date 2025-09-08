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
	{ id: 3, label: 'M3/Slide' },
	{ id: 4, label: 'M4/Zoom' },
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
	{ id: 3, label: 'M3/Slide' },
	{ id: 4, label: 'M4/Zoom' },
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
	{ id: -100000, label: 'Neg Fastest' },
	{ id: -50000, label: 'Neg Fast' },
	{ id: -25000, label: 'Neg Medium' },
	{ id: -5000, label: 'Neg Slow' },
	{ id: 0, label: 'Stopped' },
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

module.exports = function (self) {
	self.setActionDefinitions({
		jogMotor: {
			name: 'Motor Jog',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 2,
					choices: MOTOR_ID,
				},
				{
					type: 'dropdown',
					id: 'id_speed',
					label: 'Motor Speed',
					default: 0,
					choices: MOTOR_SPEED,
				}
			],
			callback: async (actionJog) => {
				self.sendEmotimoAPICommand('G300 M' + actionJog.options.id_mot + ' V' + actionJog.options.id_speed)
			},
		},
		jogMotorSmart: {
			name: 'Motor Jog Smart',
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
			callback: async (actionJogSmart) => {
				var motorSpeed = 0
				var motorInversion = 1
				var temp = 0

				if (actionJogSmart.options.id_mot == 1) {
					temp = self.getVariableValue('PanSpeedLimit')
					motorInversion = self.getVariableValue('PanInversion')
				} else if (actionJogSmart.options.id_mot == 2) {
					temp = self.getVariableValue('TiltSpeedLimit')
					motorInversion = self.getVariableValue('TiltInversion')
				} else if (actionJogSmart.options.id_mot == 3) {
					temp = self.getVariableValue('M3SpeedLimit')
					motorInversion = self.getVariableValue('M3Inversion')
				} else if (actionJogSmart.options.id_mot == 4) {
					temp = self.getVariableValue('M4SpeedLimit')
					motorInversion = self.getVariableValue('M4Inversion')
				} else if (actionJogSmart.options.id_mot == 5) {
					temp = self.getVariableValue('TN1SpeedLimit')
					motorInversion = self.getVariableValue('TN1Inversion')
				} else if (actionJogSmart.options.id_mot == 6) {
					temp = self.getVariableValue('TN2SpeedLimit')
					motorInversion = self.getVariableValue('TN2Inversion')
				} else if (actionJogSmart.options.id_mot == 7) {
					temp = self.getVariableValue('TN3SpeedLimit')
					motorInversion = self.getVariableValue('TN3Inversion')
				} else if (actionJogSmart.options.id_mot == 8) {
					temp = self.getVariableValue('RollSpeedLimit')
					motorInversion = self.getVariableValue('RollInversion')
				} else if (actionJogSmart.options.id_mot == 9) {
					temp = self.getVariableValue('FocusSpeedLimit')
					motorInversion = self.getVariableValue('FocusInversion')
				}

				if (actionJogSmart.options.id_mot < 5 || actionJogSmart.options.id_mot == 8) {
					motorSpeed = motorInversion * actionJogSmart.options.direction * temp / 100.0 * 500.0
				} else {
					motorSpeed = motorInversion * actionJogSmart.options.direction * temp / 100.0 * 100.0
				}

				self.log('debug', 'Temp: ' + temp + ' Motor Speed: ' + motorSpeed)
				self.sendEmotimoAPICommand('G301 M' + actionJogSmart.options.id_mot + ' V' + motorSpeed)
			},
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
			callback: async (actionJogSmart) => {
				var motorSpeed = 0
				var motorInversion = 1
				var rawMotorSpeed = 0
				var temp = 0

				if (actionJogSmart.options.id_mot == 1) {
					temp = self.getVariableValue('PanSpeedLimit')
					rawMotorSpeed = self.getVariableValue('PanCruiseSpeed')
					motorInversion = self.getVariableValue('PanInversion')
				} else if (actionJogSmart.options.id_mot == 2) {
					temp = self.getVariableValue('TiltSpeedLimit')
					rawMotorSpeed = self.getVariableValue('TiltCruiseSpeed')
					motorInversion = self.getVariableValue('TiltInversion')
				} else if (actionJogSmart.options.id_mot == 3) {
					temp = self.getVariableValue('M3SpeedLimit')
					rawMotorSpeed = self.getVariableValue('M3CruiseSpeed')
					motorInversion = self.getVariableValue('M3Inversion')
				} else if (actionJogSmart.options.id_mot == 4) {
					temp = self.getVariableValue('M4SpeedLimit')
					rawMotorSpeed = self.getVariableValue('M4CruiseSpeed')
					motorInversion = self.getVariableValue('M4Inversion')
				} else if (actionJogSmart.options.id_mot == 5) {
					temp = self.getVariableValue('TN1SpeedLimit')
					rawMotorSpeed = self.getVariableValue('TN1CruiseSpeed')
					motorInversion = self.getVariableValue('TN1Inversion')
				} else if (actionJogSmart.options.id_mot == 6) {
					temp = self.getVariableValue('TN2SpeedLimit')
					rawMotorSpeed = self.getVariableValue('TN2CruiseSpeed')
					motorInversion = self.getVariableValue('TN2Inversion')
				} else if (actionJogSmart.options.id_mot == 7) {
					temp = self.getVariableValue('TN3SpeedLimit')
					rawMotorSpeed = self.getVariableValue('TN3CruiseSpeed')
					motorInversion = self.getVariableValue('TN3Inversion')
				} else if (actionJogSmart.options.id_mot == 8) {
					temp = self.getVariableValue('RollSpeedLimit')
					rawMotorSpeed = self.getVariableValue('RollCruiseSpeed')
					motorInversion = self.getVariableValue('RollInversion')
				} else if (actionJogSmart.options.id_mot == 9) {
					temp = self.getVariableValue('FocusSpeedLimit')
					rawMotorSpeed = self.getVariableValue('FocusCruiseSpeed')
					motorInversion = self.getVariableValue('FocusInversion')
				}

				if (actionJogSmart.options.id_mot < 5 || actionJogSmart.options.id_mot == 8) {
					rawMotorSpeed += actionJogSmart.options.direction * 25
					if (rawMotorSpeed > 500) {
						rawMotorSpeed = 500
					} else if (rawMotorSpeed < -500) {
						rawMotorSpeed = -500
					} 
					motorSpeed = motorInversion * temp / 100.0 * rawMotorSpeed
				} else {
					rawMotorSpeed += actionJogSmart.options.direction * 5
					if (rawMotorSpeed > 100) {
						rawMotorSpeed = 100
					} else if (rawMotorSpeed < -100) {
						rawMotorSpeed = -100
					} 
					motorSpeed = motorInversion * temp / 100.0 * rawMotorSpeed
				}

				if (actionJogSmart.options.id_mot == 1) {
					self.setVariableValues({ PanCruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 2) {
					self.setVariableValues({ TiltCruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 3) {
					self.setVariableValues({ M3CruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 4) {
					self.setVariableValues({ M4CruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 5) {
					self.setVariableValues({ TN1CruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 6) {
					self.setVariableValues({ TN2CruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 7) {
					self.setVariableValues({ TN3CruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 8) {
					self.setVariableValues({ RollCruiseSpeed: rawMotorSpeed })
				} else if (actionJogSmart.options.id_mot == 9) {
					self.setVariableValues({ FocusCruiseSpeed: rawMotorSpeed })
				}

				self.log('debug', 'Temp: ' + temp + ' Motor Speed: ' + motorSpeed)
				self.sendEmotimoAPICommand('G301 M' + actionJogSmart.options.id_mot + ' V' + motorSpeed)
			},
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
			callback: async (setMotorPosition) => {
				
				var temp = 0
				var increment = 0

				if (cmd != '') {
					if (setMotorPosition.options.id_mot == 5) {
						temp = self.getVariableValue('FPos')
						increment = self.getVariableValue('FStep')
					} else if (setMotorPosition.options.id_mot == 6) {
						temp = self.getVariableValue('IPos')
						increment = self.getVariableValue('IStep')
					} else if (setMotorPosition.options.id_mot == 7) {
						temp = self.getVariableValue('ZPos')
						increment = self.getVariableValue('ZStep')
					}

					temp += (setMotorPosition.options.direction * increment);
					// self.log('debug', 'Motor ID' + setMotorPosition.options.id_mot + 'Position' + temp)

					if (temp > 10000) {
						temp = 10000;
					} else if (temp < 0) {
						temp = 0;
					}

					if (setMotorPosition.options.id_mot == 5) {
						self.setVariableValues({ FPos: temp })
					} else if (setMotorPosition.options.id_mot == 6) {
						self.setVariableValues({ IPos: temp })
					} else if (setMotorPosition.options.id_mot == 7) {
						self.setVariableValues({ ZPos: temp })
					}

					self.sendEmotimoAPICommand('G302 M' + setMotorPosition.options.id_mot + ' P' + temp)
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
			callback: async (setMotorPosition) => {
				var cmdParam ='X'
				var temp = 0
				var increment = 0

				if (cmd != '') {
					if (setMotorPosition.options.id_mot == 1) {
						temp = self.getVariableValue('PPos')
						increment = self.getVariableValue('PStep')
						cmdParam = 'X'
					} else if (setMotorPosition.options.id_mot == 2) {
						temp = self.getVariableValue('TPos')
						increment = self.getVariableValue('TStep')
						cmdParam = 'Y'
					} else if (setMotorPosition.options.id_mot == 3) {
						temp = self.getVariableValue('SPos')
						increment = self.getVariableValue('SStep')
						cmdParam = 'Z'
					} else if (setMotorPosition.options.id_mot == 4) {
						temp = self.getVariableValue('MPos')
						increment = self.getVariableValue('MStep')
						cmdParam = 'W'
					} else if (setMotorPosition.options.id_mot == 5) {
						temp = self.getVariableValue('FPos')
						increment = self.getVariableValue('FStep')
						cmdParam = 'F'
					} else if (setMotorPosition.options.id_mot == 6) {
						temp = self.getVariableValue('IPos')
						increment = self.getVariableValue('IStep')
						cmdParam = 'I'
					} else if (setMotorPosition.options.id_mot == 7) {
						temp = self.getVariableValue('ZPos')
						increment = self.getVariableValue('ZStep')
						cmdParam = 'C'
					} else if (setMotorPosition.options.id_mot == 8) {
						temp = self.getVariableValue('RPos')
						increment = self.getVariableValue('RStep')
						cmdParam = 'R'
					}

					temp += (setMotorPosition.options.direction * increment);
					// self.log('debug', 'Motor ID' + setMotorPosition.options.id_mot + 'Position' + temp)

					if (setMotorPosition.options.id_mot == 1) {
						self.setVariableValues({ PPos: temp })
					} else if (setMotorPosition.options.id_mot == 2) {
						self.setVariableValues({ TPos: temp })
					} else if (setMotorPosition.options.id_mot == 3) {
						self.setVariableValues({ SPos: temp })
					} else if (setMotorPosition.options.id_mot == 4) {
						self.setVariableValues({ MPos: temp })
					} else if (setMotorPosition.options.id_mot == 5) {
						self.setVariableValues({ FPos: temp })
					} else if (setMotorPosition.options.id_mot == 6) {
						self.setVariableValues({ IPos: temp })
					} else if (setMotorPosition.options.id_mot == 7) {
						self.setVariableValues({ ZPos: temp })
					} else if (setMotorPosition.options.id_mot == 8) {
						self.setVariableValues({ RPos: temp })
					}

					self.sendEmotimoAPICommand('G0 ' + cmdParam + temp)
				}
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
			callback: async (toggleIncrement) => {
				var temp = 0

				if (toggleIncrement.options.id_mot == 1) {
					temp = self.getVariableValue('PStep')
				} else if (toggleIncrement.options.id_mot == 2) {
					temp = self.getVariableValue('TStep')
				} else if (toggleIncrement.options.id_mot == 3) {
					temp = self.getVariableValue('SStep')
				} else if (toggleIncrement.options.id_mot == 4) {
					temp = self.getVariableValue('MStep')
				} else if (toggleIncrement.options.id_mot == 5) {
					temp = self.getVariableValue('FStep')
				} else if (toggleIncrement.options.id_mot == 6) {
					temp = self.getVariableValue('IStep')
				} else if (toggleIncrement.options.id_mot == 7) {
					temp = self.getVariableValue('ZStep')
				} else if (toggleIncrement.options.id_mot == 8) {
					temp = self.getVariableValue('RStep')
				}

				if (toggleIncrement.options.id_mot < 3) {
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

				} else if (toggleIncrement.options.id_mot < 5) {
					if (temp == 1000) {
						temp = 10000;
					} else {
						temp = 1000;
					}
				} else if (toggleIncrement.options.id_mot < 8) {
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

				self.log('debug', 'Model: ' + self.config.model + ' Motor ID: ' + toggleIncrement.options.id_mot + ' Increment: ' + temp)

				if (toggleIncrement.options.id_mot == 1) {
					temp = self.setVariableValues({ PStep: temp })
				} else if (toggleIncrement.options.id_mot == 2) {
					temp = self.setVariableValues({ TStep: temp })
				} else if (toggleIncrement.options.id_mot == 3) {
					temp = self.setVariableValues({ SStep: temp })
				} else if (toggleIncrement.options.id_mot == 4) {
					temp = self.setVariableValues({ MStep: temp })
				} else if (toggleIncrement.options.id_mot == 5) {
					self.setVariableValues({ FStep: temp })
				} else if (toggleIncrement.options.id_mot == 6) {
					self.setVariableValues({ IStep: temp })
				} else if (toggleIncrement.options.id_mot == 7) {
					self.setVariableValues({ ZStep: temp })
				} else if (toggleIncrement.options.id_mot == 8) {
					self.setVariableValues({ RStep: temp })
				}
			}
		},
		setJogSpeedLimit: {
			name: 'Set Motor Jog Speed',
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
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' },
						{ id: 'set', label: 'Set Value' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -100,
		    	max: 100,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
				{
					type: 'number',
					label: 'Set Value',
					id: 'setValue',
					min: 0,
		    	max: 100,
          default: 100,
					isVisible: (options) => options.direction === 'set',
				},
			],
			callback: async (jogSpeed) => {
				var temp = 0

				if (jogSpeed.options.direction === 'set') {
					temp = jogSpeed.options.setValue
				} else {
					if (jogSpeed.options.id_mot == 1) {
						temp = self.getVariableValue('PanSpeedLimit')
					} else if (jogSpeed.options.id_mot == 2) {
						temp = self.getVariableValue('TiltSpeedLimit')
					} else if (jogSpeed.options.id_mot == 3) {
						temp = self.getVariableValue('M3SpeedLimit')
					} else if (jogSpeed.options.id_mot == 4) {
						temp = self.getVariableValue('M4SpeedLimit')
					} else if (jogSpeed.options.id_mot == 5) {
						temp = self.getVariableValue('TN1SpeedLimit')
					} else if (jogSpeed.options.id_mot == 6) {
						temp = self.getVariableValue('TN2SpeedLimit')
					} else if (jogSpeed.options.id_mot == 7) {
						temp = self.getVariableValue('TN3SpeedLimit')
					} else if (jogSpeed.options.id_mot == 8) {
						temp = self.getVariableValue('RollSpeedLimit')
					}

					if (jogSpeed.options.direction === 'amount') {
						temp += jogSpeed.options.amountValue
					} else {
						temp += jogSpeed.options.direction
					}
				}

				if (temp > 100) {
					temp = 100;
				} else if (temp < 0) {
					temp = 0;
				}

				self.log('debug', 'Motor ID: ' + jogSpeed.options.id_mot + ' Speed: ' + temp)

				if (jogSpeed.options.id_mot == 1) {
					self.setVariableValues({ PanSpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 2) {
					self.setVariableValues({ TiltSpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 3) {
					self.setVariableValues({ M3SpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 4) {
					self.setVariableValues({ M4SpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 5) {
					self.setVariableValues({ TN1SpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 6) {
					self.setVariableValues({ TN2SpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 7) {
					self.setVariableValues({ TN3SpeedLimit: temp })
				} else if (jogSpeed.options.id_mot == 8) {
					self.setVariableValues({ RollSpeedLimit: temp })
				}
			}
		},
		resetJogSpeedLimit: {
			name: 'Reset Motor Jog Speed',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (resetSpeed) => {
				if (resetSpeed.options.id_mot == 1) {
					self.setVariableValues({ PanSpeedLimit: 100 })
				} else if (resetSpeed.options.id_mot == 2) {
					self.setVariableValues({ TiltSpeedLimit: 100 })
				} else if (resetSpeed.options.id_mot == 3) {
					self.setVariableValues({ M3SpeedLimit: 100 })
				} else if (resetSpeed.options.id_mot == 4) {
					self.setVariableValues({ M4SpeedLimit: 100 })
				} else if (resetSpeed.options.id_mot == 5) {
					self.setVariableValues({ TN1SpeedLimit: 25 })
				} else if (resetSpeed.options.id_mot == 6) {
					self.setVariableValues({ TN2SpeedLimit: 25 })
				} else if (resetSpeed.options.id_mot == 7) {
					self.setVariableValues({ TN3SpeedLimit: 25 })
				} else if (resetSpeed.options.id_mot == 8) {
					self.setVariableValues({ RollSpeedLimit: 100 })
				}

			}
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
			callback: async (resetSpeed) => {
				if (resetSpeed.options.id_mot == 1) {
					self.setVariableValues({ PanCruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 2) {
					self.setVariableValues({ TiltCruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 3) {
					self.setVariableValues({ M3CruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 4) {
					self.setVariableValues({ M4CruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 5) {
					self.setVariableValues({ TN1CruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 6) {
					self.setVariableValues({ TN2CruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 7) {
					self.setVariableValues({ TN3CruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 8) {
					self.setVariableValues({ RollCruiseSpeed: 0 })
				} else if (resetSpeed.options.id_mot == 9) {
					self.setVariableValues({ FocusCruiseSpeed: 0 })
				}

				self.sendEmotimoAPICommand('G301 M' + resetSpeed.options.id_mot + ' V0')
			}
		},
		stopMotors: {
			name: 'Stop All Motors',
			options: [

			],
			callback: async (haltMotors) => {
				self.setVariableValues({ 'LastPstID': -1 })
				self.sendEmotimoAPICommand('G911')
			},
		},

		//Presets
		savePset: {
			name: 'Save Preset',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Preset Number',
					default: 0,
					min: 0,
					max: 127,
				},
			],
			callback: async (setPreset) => {
				// console.log('Hello world!', event.options.num)
				var preset = setPreset.options.num
				var panpos = self.getVariableValue('PPos')
				var tiltpos = self.getVariableValue('TPos')
				var m3pos = self.getVariableValue('SPos')
				var m4pos = self.getVariableValue('MPos')

				self.setVariableValues({ [`Pst${preset}PanPos`]: panpos })
				self.setVariableValues({ [`Pst${preset}TiltPos`]: tiltpos })
				self.setVariableValues({ [`Pst${preset}M3Pos`]: m3pos })
				self.setVariableValues({ [`Pst${preset}M4Pos`]: m4pos })

				self.sendEmotimoAPICommand('G21 P' + preset + ' T' + self.presetRunTimes[setPreset.options.num] / 10 + ' A' + self.presetRampTimes[setPreset.options.num] / 10)
			},
		},
		recallPset: {
			name: 'Recall Preset',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Preset Number',
					default: 0,
					min: 0,
					max: 127,
				},
			],
			callback: async (recallPreset) => {
				// console.log('Hello world!', event.options.num)
				const cmd = 'G20 P' + recallPreset.options.num
				self.setVariableValues({ LastPstID: recallPreset.options.num })
				self.sendEmotimoAPICommand(cmd)
			},
		},
		setPresetRunTime: {
			name: 'Set Preset Run Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_pst',
					label: 'Preset ID',
					default: 0,
					choices: PRESET_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (runTime) => {
				var runtemp = self.getVariableValue('Pst' + runTime.options.id_pst + 'RunT')
				var ramptemp = self.getVariableValue('Pst' + runTime.options.id_pst + 'RampT')

				if (runTime.options.direction === 'amount') {
					runtemp += runTime.options.amountValue
				} else {
					runtemp += runTime.options.direction
				}

				if (runtemp > 600) {
					runtemp = 600;
				} else if (runtemp < 10) {
					runtemp = 10;
				}

				self.log('debug', 'Preset ID: ' + runTime.options.id_pst + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+runTime.options.id_pst+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
				self.setVariableValues({ [varID]: runtemp })

				self.sendEmotimoAPICommand('G21 N1 P' + runTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},
		setPresetRampTime: {
			name: 'Set Preset Ramp Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_pst',
					label: 'Preset ID',
					default: 0,
					choices: PRESET_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (rampTime) => {
				var ramptemp = self.getVariableValue('Pst' + rampTime.options.id_pst + 'RampT')
				var runtemp = self.getVariableValue('Pst' + rampTime.options.id_pst + 'RunT')

				if (rampTime.options.direction === 'amount') {
					ramptemp += rampTime.options.amountValue
				} else {
					ramptemp += rampTime.options.direction
				}

				if (ramptemp > 250) {
					ramptemp = 250;
				} else if (ramptemp < 1) {
					ramptemp = 1;
				}

				self.log('debug', 'Preset ID: ' + rampTime.options.id_pst + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+rampTime.options.id_pst+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
				self.setVariableValues({ [varID]: ramptemp })

				self.sendEmotimoAPICommand('G21 N1 P' + rampTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},
		resetPresetRunTime: {
			name: 'Reset Preset Run Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_pst',
					label: 'Preset ID',
					default: 0,
					choices: PRESET_ID,
					// allowCustom: true,
					// allowExpression: true,
				},
			],
			callback: async (resetPresetRunTime) => {
				var runtemp = 50;
				var ramptemp = self.getVariableValue('Pst' + resetPresetRunTime.options.id_pst + 'RampT')

				self.log('debug', 'Preset ID: ' + resetPresetRunTime.options.id_pst + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+resetPresetRunTime.options.id_pst+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
				self.setVariableValues({ [varID]: runtemp })

				self.sendEmotimoAPICommand('G21 N1 P' + resetPresetRunTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},
		resetPresetRampTime: {
			name: 'Reset Preset Ramp Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_pst',
					label: 'Preset ID',
					default: 0,
					choices: PRESET_ID,
					// allowCustom: true,
				},
			],
			callback: async (resetPresetRampTime) => {
				var ramptemp = 10;
				var runtemp = self.getVariableValue('Pst' + resetPresetRampTime.options.id_pst + 'RunT')

				self.log('debug', 'Preset ID: ' + resetPresetRampTime.options.id_pst + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Pst'+resetPresetRampTime.options.id_pst+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
				self.setVariableValues({ [varID]: ramptemp })

				self.sendEmotimoAPICommand('G21 N1 P' + resetPresetRampTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
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
			callback: async (motorProfile) => {
				const selProf = motorProfile.options.prodileid
				self.setVariableValues({ CurrentMtrProf: selProf})

				self.sendEmotimoAPICommand('G102 P' + selProf)
			}
		},




//============================
//  ***   SMART STUFFS   ***
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
			callback: async (gotoCoords) => {
				const resolvedCoordsValue = await self.parseVariablesInString(gotoCoords.options.coords)
				const resolvedRunValue = await self.parseVariablesInString(gotoCoords.options.runtime)
				const resolvedRampValue = await self.parseVariablesInString(gotoCoords.options.ramptime)

				self.sendEmotimoAPICommand('G11 M' + gotoCoords.options.motorid + ' P' + resolvedCoordsValue + ' T' + resolvedRunValue + ' A' + resolvedRampValue)
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
			callback: async (savePstCoords) => {
				if (savePstCoords.options.smart == 0) {
					var preset = self.getVariableValue('CurrentPstSet')
				} else {
					var preset = savePstCoords.options.preset
				}
				// If a variable gets inputted, get that value, otherwise it takes the inputted value
				var resolvedRunValue = await self.parseVariablesInString(savePstCoords.options.runtime)
				var resolvedRampValue = await self.parseVariablesInString(savePstCoords.options.ramptime)
				var resolvedPanValue = await self.parseVariablesInString(savePstCoords.options.pCoords)
				var resolvedTiltValue = await self.parseVariablesInString(savePstCoords.options.tCoords)
				var resolvedSlideValue = await self.parseVariablesInString(savePstCoords.options.sCoords)
				var resolvedZoomValue = await self.parseVariablesInString(savePstCoords.options.zCoords)
				
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
			callback: async (setMotorPos) => {
				const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
				// If a variable gets inputted, get that value, otherwise it takes the inputted value
				var resolvedPanValue = await self.parseVariablesInString(setMotorPos.options.pCoords)
				var resolvedTiltValue = await self.parseVariablesInString(setMotorPos.options.tCoords)
				var resolvedSlideValue = await self.parseVariablesInString(setMotorPos.options.sCoords)
				var resolvedZoomValue = await self.parseVariablesInString(setMotorPos.options.zCoords)
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
					self.log('debug', `Setting motor M3/Slide to position ${resolvedSlideValue}`)
					self.setVariableValues({ 'SPos': resolvedSlideValue })
					self.sendEmotimoAPICommand(`G200 M3 P${resolvedSlideValue}`)
					await wait(200) // waits 200ms before continuing
				}
				//Zoom
				if (resolvedZoomValue) { // if not blank, do things
					self.log('debug', `Setting motor M4/Zoom to position ${resolvedZoomValue}`)
					self.setVariableValues({ 'MPos': resolvedZoomValue })
					self.sendEmotimoAPICommand(`G200 M4 P${resolvedZoomValue}`)
					await wait(200) // waits 200ms before continuing
				}
			}
		},


		// Sets the run time based on an inputted value
		setPresetRunTimeByValue: {
			name: 'Set Preset Run Time By Value',
			options: [
				{ // select to change all presets or just selected one
					id: 'count',
					type: 'dropdown',
					label: 'All or Current Preset',
					default: 1,
					choices: [
						{ id: 0, label: 'Select Preset' },
						{ id: 1, label: 'Smart Preset' },
						{ id: 2, label: 'All' },
					],
				},
				{
					type: 'dropdown',
					id: 'pstid',
					label: 'Preset ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.count === 0,
				},
				{ // input value for the run time
					id: 'setvalue',
					type: 'textinput',
					label: 'Value',
					min: 10,
					max: 600,
					default: '50',
					useVariables: true,
				},
			],
			callback: async (runTime) => {
				const resolvedValue = await self.parseVariablesInString(runTime.options.setvalue)
				let ramptemp
				let preset
				if (runTime.options.count === 0) {
					preset = runTime.options.pstid
					ramptemp = self.getVariableValue(`Pst${preset}RampT`)
				} else {
					preset = self.getVariableValue('CurrentPstSet')
					ramptemp = self.getVariableValue('CurrentPstSetRamp')
				}
			
				let runtime = Number(resolvedValue)
				// checks to make sure inputted values are in an acceptiable range
				if (runtime > 600) runtime = 600
				else if (runtime < 10) runtime = 10
			
				self.setVariableValues({ CurrentPstSetRun: runtime })
			
				const rampT = ramptemp / 10
				const runT = runtime / 10
			
				// === If count is 2, apply to all presets in SetPsts ===
				if (runTime.options.count === 2) {
					const setListRaw = self.getVariableValue('SetPsts')
					let setList = []

					try {
						setList = JSON.parse(setListRaw)
					} catch (e) {
						self.log('debug', 'Invalid JSON in SetPsts: ' + setListRaw)
					}
			
					for (const p of setList) {
						if (self.getVariableValue(`Pst${p}RunT`) === runtime) {
							self.log('debug', `Preset ${p} already at Run: ${runtime}, skipping.`)
							continue
						}
						self.log('debug', 'p: ' + p)
						const ramptime = self.getVariableValue(`Pst${p}RampT`)
						self.log('debug', `Preset ID: ${p} RunT: ${runtime} RampT: ${ramptime}`)
						self.setVariableValues({ [`Pst${p}RunT`]: runtime })

						self.sendEmotimoAPICommand(`G21 N1 P${p} T${runT} A` + ramptime/10)
						await new Promise((r) => setTimeout(r, 200))
					}
				}
				// === Only one preset selected (manual or current set) ===
				else {
					if (self.getVariableValue(`Pst${preset}RunT`) === runtime) {
						self.log('debug', `Preset ${preset} already at Run: ${runtime}, skipping.`)
						return
					}
					self.log('debug', `Preset ID: ${preset} RunT: ${runtime} RampT: ${ramptemp}`)
					self.setVariableValues({ [`Pst${preset}RunT`]: runtime })

					self.sendEmotimoAPICommand(`G21 N1 P${preset} T${runT} A${rampT}`)
				}
			}
		},

    // Sets the ramp time based on an inputted value
    setPresetRampTimeByValue: {
			name: 'Set Preset Ramp Time By Value',
			options: [
        { // select to change all presets or just selected one
          id: 'count',
					type: 'dropdown',
					label: 'All or Current Preset',
          default: 1,
          choices: [
						{ id: 0, label: 'Select Preset' },
            { id: 1, label: 'Smart Preset' },
            { id: 2, label: 'All' },
          ],
        },
				{
					type: 'dropdown',
					id: 'pstid',
					label: 'Preset ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.count === 0,
				},
        { // input value for the ramp time
          id: 'setvalue',
					type: 'textinput',
					label: 'Value',
          min: 1,
		    	max: 250,
          default: '10',
					useVariables: true,
        },
			],
			callback: async (rampTime) => {
				const resolvedValue = await self.parseVariablesInString(rampTime.options.setvalue)
				let runtemp
				let preset
				if (rampTime.options.count === 0) {
					preset = rampTime.options.pstid
					runtemp = self.getVariableValue(`Pst${preset}RunT`)
				} else {
					preset = self.getVariableValue('CurrentPstSet')
					runtemp = self.getVariableValue('CurrentPstSetRun')
				}
			
				let ramptime = Number(resolvedValue)
				// checks to make sure inputted values are in an acceptiable range
				if (ramptime > 600) ramptime = 600
				else if (ramptime < 10) ramptime = 10
			
				self.setVariableValues({ CurrentPstSetRamp: ramptime })
			
				const baseCmd = ''
				const rampT = ramptime / 10
				const runT = runtemp / 10
			
				// === If count is 2, apply to all presets in SetPsts ===
				if (rampTime.options.count === 2) {
					const setListRaw = self.getVariableValue('SetPsts')
					let setList = []
			
					try {
						setList = JSON.parse(setListRaw)
					} catch (e) {
						self.log('debug', 'Invalid JSON in SetPsts: ' + setListRaw)
					}
			
					for (const p of setList) {
						if (self.getVariableValue(`Pst${p}RampT`) === ramptime) {
							self.log('debug', `Preset ${p} already at Ramp: ${ramptime}, skipping.`)
							continue
						}
						self.log('debug', 'p: ' + p)
						const runtime = self.getVariableValue(`Pst${p}RunT`)
						self.log('debug', `Preset ID: ${p} RunT: ${runtime} RampT: ${ramptime}`)
						self.setVariableValues({ [`Pst${p}RampT`]: ramptime })

						self.sendEmotimoAPICommand(`G21 N1 P${p} T` + runtime/10 + ` A${rampT}`)
						await new Promise((r) => setTimeout(r, 200))
					}
				}
				// === Only one preset selected (manual or current set) ===
				else {
					if (self.getVariableValue(`Pst${preset}RampT`) === ramptime) {
						self.log('debug', `Preset ${preset} already at Ramp: ${ramptime}, skipping.`)
						return
					}
					self.log('debug', `Preset ID: ${preset} RunT: ${runtime} RampT: ${ramptemp}`)
					self.setVariableValues({ [`Pst${preset}RampT`]: ramptemp })

					self.sendEmotimoAPICommand(`G21 N1 P${preset} T${runT} A${rampT}`)
				}
			}
		},

		setLoopRunTimeByValue: {
			name: 'Set Loop Run Time By Value',
			options: [
				{ // select to change all loops or just selected one
					id: 'count',
					type: 'dropdown',
					label: 'All or Current Loop',
					default: 1,
					choices: [
						{ id: 0, label: 'Select Loop' },
						{ id: 1, label: 'Smart Loop' },
						{ id: 2, label: 'All' },
					],
				},
				{
					type: 'dropdown',
					id: 'lpid',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.count === 0,
				},
				{ // input value for the run time
					id: 'setvalue',
					type: 'textinput',
					label: 'Value',
					min: 10,
					max: 600,
					default: '50',
					useVariables: true,
				},
			],
			callback: async (runTime) => {
				const resolvedValue = await self.parseVariablesInString(runTime.options.setvalue)
				let loop
				if (runTime.options.count === 0) {
					loop = runTime.options.lpid
				} else {
					loop = self.getVariableValue('CurrentLpSet')
				}

				let runtime = Number(resolvedValue)
				// checks to make sure inputted values are in an acceptiable range
				if (runtime > 600) runtime = 600
				else if (runtime < 10) runtime = 10

				// === If count is 2, apply to all loops in SetLps ===
				if (runTime.options.count === 2) {
					const setListRaw = self.getVariableValue('SetLps')
					let setList = []
			
					try {
						setList = JSON.parse(setListRaw)
					} catch (e) {
						self.log('debug', 'Invalid JSON in SetPsts: ' + setListRaw)
					}

					for (const p of setList) {
						if (self.getVariableValue(`Lp${p}RunT`) === runtime) {
							self.log('debug', `Loop ${p} already at Run: ${runtime}, skipping.`)
							continue
						}
						self.log('debug', `Loop ID: ${p} RunT: ${runtime}`)
						self.setVariableValues({ CurrentLpRun: runtime })
						self.setVariableValues({ [`Lp${p}RunT`]: runtime })

						await new Promise((r) => setTimeout(r, 200))
					}
				}
				// === Only one loop selected (manual or current set) ===
				else {
					if (self.getVariableValue(`Lp${loop}RunT`) === runtime) {
						self.log('debug', `Loop ${loop} already at Run: ${runtime}, skipping.`)
						return
					}
					self.log('debug', `Loop ID: ${loop} RunT: ${runtime}`)
					if (self.getVariableValue('CurrentLpSet') === loop) {
						self.setVariableValues({ CurrentLpRun: runtime })
					}
					self.setVariableValues({ [`Lp${loop}RunT`]: runtime })
				}
			}
		},

		// Sets the ramp time based on an inputted value
		setLoopRampTimeByValue: {
			name: 'Set Loop Ramp Time By Value',
			options: [
				{ // select to change all presets or just selected one
					id: 'count',
					type: 'dropdown',
					label: 'All or Current Loop',
					default: 1,
					choices: [
						{ id: 0, label: 'Select Loop' },
						{ id: 1, label: 'Smart Loop' },
						{ id: 2, label: 'All' },
					],
				},
				{
					type: 'dropdown',
					id: 'lpid',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
					isVisible: (options) => options.count === 0,
				},
				{ // input value for the ramp time
					id: 'setvalue',
					type: 'textinput',
					label: 'Value',
					min: 1,
		    	max: 250,
					default: '10',
					useVariables: true,
				},
			],
			callback: async (rampTime) => {
				const resolvedValue = await self.parseVariablesInString(rampTime.options.setvalue)
				let loop
				if (rampTime.options.count === 0) {
					loop = rampTime.options.lpid
				} else {
					loop = self.getVariableValue('CurrentLpSet')
				}
			
				let ramptime = Number(resolvedValue)
				// checks to make sure inputted values are in an acceptiable range
				if (ramptime > 600) ramptime = 600
				else if (ramptime < 10) ramptime = 10

				// === If count is 2, apply to all loops in SetLps ===
				if (rampTime.options.count === 2) {
					const setListRaw = self.getVariableValue('SetLps')
					let setList = []
			
					try {
						setList = JSON.parse(setListRaw)
					} catch (e) {
						self.log('debug', 'Invalid JSON in SetLps: ' + setListRaw)
					}

					for (const p of setList) {
						if (self.getVariableValue(`Lp${p}RampT`) === ramptime) {
							self.log('debug', `Loop ${p} already at Ramp: ${ramptime}, skipping.`)
							continue
						}
						self.log('debug', `Loop ID: ${p} RampT: ${ramptime}`)
						self.setVariableValues({ CurrentLpRamp: ramptime })
						self.setVariableValues({ [`Lp${p}RampT`]: ramptime })

						await new Promise((r) => setTimeout(r, 200))
					}
				}
				// === Only one loop selected (manual or current set) ===
				else {
					if (self.getVariableValue(`Lp${loop}RampT`) === ramptime) {
						self.log('debug', `Loop ${loop} already at Ramp: ${ramptime}, skipping.`)
						return
					}
					self.log('debug', `Loop ID: ${loop} RampT: ${ramptime}`)
					if (self.getVariableValue('CurrentLpSet') == loop) {
						self.setVariableValues({ CurrentLpRamp: ramptime })
					}
					self.setVariableValues({ [`Lp${loop}RampT`]: ramptime })
				}
			}
		},

//=============================
//  ***   Smart Presets   ***
//=============================

    // Sets the run time based on increments
		setPresetRunTimeSmart: {
			name: 'Smart Set Preset Run Time',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (runTime) => {
				var runtemp = self.getVariableValue('CurrentPstSetRun')
				var ramptemp = self.getVariableValue('CurrentPstSetRamp')
				var preset = self.getVariableValue('CurrentPstSet')

				if (runTime.options.direction === 'amount') {
					runtemp += runTime.options.amountValue
				} else {
					runtemp += runTime.options.direction
				}

				if (runtemp > 600) {
					runtemp = 600;
				} else if (runtemp < 10) {
					runtemp = 10;
				}

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

        var varID = 'Pst'+preset+'RunT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
        self.setVariableValues({ [varID]: runtemp })

				self.setVariableValues({ CurrentPstSetRun: runtemp })

				self.sendEmotimoAPICommand('G21 N1 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},

		// Sets the ramp time based on increments
		setPresetRampTimeSmart: {
			name: 'Smart Set Preset Ramp Time',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (rampTime) => {
				var ramptemp = self.getVariableValue('CurrentPstSetRamp')
				var runtemp = self.getVariableValue('CurrentPstSetRun')
				var preset = self.getVariableValue('CurrentPstSet')

				if (rampTime.options.direction === 'amount') {
					ramptemp += rampTime.options.amountValue
				} else {
					ramptemp += rampTime.options.direction
				}
				
				if (ramptemp > 250) {
					ramptemp = 250;
				} else if (ramptemp < 1) {
					ramptemp = 1;
				}

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

        var varID = 'Pst'+preset+'RampT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
        self.setVariableValues({ [varID]: ramptemp })

				self.setVariableValues({ CurrentPstSetRamp: ramptemp })

				self.sendEmotimoAPICommand('G21 N1 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},

    // Resets the run time smart
		resetPresetRunTimeSmart: {
			name: 'Reset Preset Run Time Smart',
			options: [
				
			],
			callback: async (resetPresetRunTime) => {
				var preset = self.getVariableValue('CurrentPstSet')
				var runtemp = 50;
				var ramptemp = self.getVariableValue('Pst' + preset + 'RampT')

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)


        var varID = 'Pst'+preset+'RunT'
        self.log('debug', 'Variable ID: ' + varID)
        self.setVariableValues({ [varID]: runtemp })

				self.setVariableValues({ CurrentPstSetRun: runtemp })

				self.sendEmotimoAPICommand('G21 N1 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},

    // Resets the ramp time smart
		resetPresetRampTimeSmart: {
			name: 'Reset Preset Ramp Time Smart',
			options: [
				
			],
			callback: async (resetPresetRampTime) => {
				var preset = self.getVariableValue('CurrentPstSet')
				var ramptemp = 10;
				var runtemp = self.getVariableValue('Pst' + preset + 'RunT')

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

        var varID = 'Pst'+preset+'RampT'
        self.log('debug', 'Variable ID: ' + varID)
        self.setVariableValues({ [varID]: ramptemp })

				self.setVariableValues({ CurrentPstSetRamp: ramptemp })

				self.sendEmotimoAPICommand('G21 N1 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			}
		},

		// Goes to the next or previous preset number
		setPresetID: {
			name: 'Set Preset ID',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [...DIRECTION_ID,
						{ id: 'goto', label: 'Goto Preset' }
					]
				},
				{
					id: 'gotoPst',
					type: 'number',
					label: 'Goto Preset ID',
					default: 0,
					min: 0,
					max: 127,
					isVisible: (options) => options.direction === 'goto'
				}
			],
			callback: async (pst) => {
				var preset = self.getVariableValue('CurrentPstSet')
				if (pst.options.direction === 'goto') {
					preset = pst.options.gotoPst
				} else {
					preset += pst.options.direction
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

    // saves the position at the selected preset
		savePsetSmart: {
			name: 'Save Preset Smart',
			options: [
			
			],
			callback: async (setPreset) => {
				var runtemp = self.getVariableValue('CurrentPstSetRun')
				var ramptemp = self.getVariableValue('CurrentPstSetRamp')
				var preset = self.getVariableValue('CurrentPstSet')

				self.sendEmotimoAPICommand('G21 P' + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10)
			},
		},

    // recalls the selected preset
		recallPsetSmart: {
			name: 'Recall Preset Smart',
			options: [
				
			],
			callback: async (recallPreset) => {
				var preset = self.getVariableValue('CurrentPstSet')
				self.setVariableValues({ LastPstID: preset })

				self.sendEmotimoAPICommand('G20 P' + preset)
			},
		},

//=====================
//  ***   Loops   ***
//=====================

    // sets the selected loop run time
    setLoopRunTime: {
			name: 'Set Loop Run Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (runTime) => {
				var runtemp = self.getVariableValue('Lp'+runTime.options.id_loop+'RunT')

				if (runTime.options.direction === 'amount') {
					runtemp += runTime.options.amountValue
				} else {
					runtemp += runTime.options.direction
				}

				if (runtemp > 600) {
					runtemp = 600;
				} else if (runtemp < 10) {
					runtemp = 10;
				}

				var varID = 'Lp'+runTime.options.id_loop+'RunT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
        self.setVariableValues({ [varID]: runtemp })
			}
		},
		setLoopRampTime: {
			name: 'Set Loop Ramp Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (rampTime) => {
				var ramptemp = self.getVariableValue('Lp'+rampTime.options.id_loop+'RampT')

				if (rampTime.options.direction === 'amount') {
					ramptemp += rampTime.options.amountValue
				} else {
					ramptemp += rampTime.options.direction
				}

				if (ramptemp > 250) {
					ramptemp = 250;
				} else if (ramptemp < 1) {
					ramptemp = 1;
				}

				var varID = 'Lp'+rampTime.options.id_loop+'RunT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
        self.setVariableValues({ [varID]: ramptemp })
			}
		},
		resetLoopRunTime: {
			name: 'Reset Loop Run Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
			],
			callback: async (resetLpRunTime) => {
				var runtemp = 50;

				var varID = 'Lp'+resetLpRunTime.options.id_loop+'RampT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
        self.setVariableValues({ [varID]: runtemp })
			}
		},
		resetLoopRampTime: {
			name: 'Reset Loop Ramp Time',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
			],
			callback: async (resetLpRampTime) => {
				var ramptemp = 50;

				var varID = 'Lp'+resetLpRampTime.options.id_loop+'RampT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
        self.setVariableValues({ [varID]: ramptemp })
			}
		},
		setLoopAPoint: {
			name: 'Set Loop A Point',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'pst', label: 'Set Preset' }
					]
				},
				{
					type: 'number',
					label: 'Preset ID',
					id: 'psetid',
					min: 0,
		    	max: 127,
					default: 0,
					isVisible: (options) => options.direction === 'pst',
				},
			],
			callback: async (LpAPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpAPt.options.id_loop+'APoint');

				if (dir.options.direction === 'pst') {
					pointTemp = LpAPt.options.psetid
				} else {
					pointTemp += LpAPt.options.direction
				}

				if (pointTemp > 127) {
					pointTemp = 127;
				} else if (pointTemp < 0) {
					pointTemp = 0;
				}

				var varID = 'Lp'+LpAPt.options.id_loop+'APoint'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + pointTemp)
        self.setVariableValues({ [varID]: pointTemp })
			}
		},
		setLoopBPoint: {
			name: 'Set Loop B Point',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'pst', label: 'Set Preset' }
					]
				},
				{
					type: 'number',
					label: 'Preset ID',
					id: 'psetid',
					min: 0,
		    	max: 127,
					default: 0,
					isVisible: (options) => options.direction === 'pst',
				},
			],
			callback: async (LpBPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpBPt.options.id_loop+'BPoint');

				if (dir.options.direction === 'pst') {
					pointTemp = LpBPt.options.psetid
				} else {
					pointTemp += LpBPt.options.direction
				}

				if (pointTemp > 127) {
					pointTemp = 127;
				} else if (pointTemp < 0) {
					pointTemp = 0;
				}

				var varID = 'Lp'+LpBPt.options.id_loop+'BPoint'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + pointTemp)
        self.setVariableValues({ [varID]: pointTemp })
			}
		},
		recallAPoint: {
			name: 'Recall Loop A Point',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
			],
			callback: async (LpAPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpAPt.options.id_loop+'APoint');
				self.sendEmotimoAPICommand('G20 P' + pointTemp)
			}
		},
		recallBPoint: {
			name: 'Recall Loop B Point',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
			],
			callback: async (LpBPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpBPt.options.id_loop+'BPoint');
				self.sendEmotimoAPICommand('G20 P' + pointTemp)
			}
		},
		recallLoop: {
			name: 'Recall Loop',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 0,
					choices: LOOP_ID,
				},
			],
			callback: async (LpRecall) => {
				var tempA = self.getVariableValue('Lp'+LpRecall.options.id_loop+'APoint');
				var tempB = self.getVariableValue('Lp'+LpRecall.options.id_loop+'BPoint');
				var loopActive = self.getVariableValue('LpActive')

				self.log('debug', 'Active Loop: ' + loopActive)
				if (loopActive == -1) {
					self.setVariableValues({ LpActive: LpRecall.options.id_loop })
					self.setVariableValues({ LastPstID: -1})
					self.checkFeedbacks("LoopStatus")

					self.sendEmotimoAPICommand('G25 L' + LpRecall.options.id_loop + ' A' + tempA + ' B' + tempB + ' C500 D500')
					setTimeout(() => self.sendEmotimoAPICommand('G24 L' + LpRecall.options.id_loop + ' N0'), 100);
				} else {
					self.setVariableValues({ LpActive: -1 })
					self.sendEmotimoAPICommand('G24')
				}
			}
		},

		//Smart Loops
		setLoopRunTimeSmart: {
			name: 'Smart Set Loop Run Time',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -250,
		    	max: 250,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (runTime) => {
				var runtemp = self.getVariableValue('CurrentLpRun')
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				if (runTime.options.direction === 'amount') {
					runtemp += runTime.options.amountValue
				} else {
					runtemp += runTime.options.direction
				}

				if (runtemp > 600) {
					runtemp = 600;
				} else if (runtemp < 10) {
					runtemp = 10;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Lp'+id_loop+'RunT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
        self.setVariableValues({ [varID]: runtemp })

				self.setVariableValues({ CurrentLpRun: runtemp })

				self.sendEmotimoAPICommand('G25 L' + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
			}
		},
		setLoopRampTimeSmart: {
			name: 'Smart Set Loop Ramp Time',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -300,
		    	max: 300,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
			],
			callback: async (rampTime) => {
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var runtemp = self.getVariableValue('CurrentLpRun')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				if (rampTime.options.direction === 'amount') {
					ramptemp += rampTime.options.amountValue
				} else {
					ramptemp += rampTime.options.direction
				}
				
				if (ramptemp > 300) {
					ramptemp = 300;
				} else if (ramptemp < 1) {
					ramptemp = 1;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Lp'+id_loop+'RampT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
        self.setVariableValues({ [varID]: ramptemp })

				self.setVariableValues({ CurrentLpRamp: ramptemp })

				self.sendEmotimoAPICommand('G25 L' + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
			}
		},
		resetLoopRunTimeSmart: {
			name: 'Reset Loop Run Time Smart',
			options: [
				
			],
			callback: async (resetLpRunTime) => {
				var runtemp = 50;
				var id_loop = self.getVariableValue('CurrentLpSet')

				var varID = 'Lp'+id_loop+'RampT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + runtemp)
        self.setVariableValues({ [varID]: runtemp })

				self.setVariableValues({ CurrentLpRun: runtemp })
			}
		},
		resetLoopRampTimeSmart: {
			name: 'Reset Loop Ramp Time Smart',
			options: [
				
			],
			callback: async (resetLpRampTime) => {
				var ramptemp = 50;
				var id_loop = self.getVariableValue('CurrentLpSet')

				var varID = 'Lp'+id_loop+'RampT'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
        self.setVariableValues({ [varID]: ramptemp })

				self.setVariableValues({ CurrentLpRamp: ramptemp })
			}
		},
		setLoopAPointSmart: {
			name: 'Smart Set Loop A Point',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'pst', label: 'Set Preset' }
					]
				},
				{
					type: 'number',
					label: 'Preset ID',
					id: 'psetid',
					min: 0,
		    	max: 127,
					default: 0,
					isVisible: (options) => options.direction === 'pst',
				},
			],
			callback: async (dir) => {
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var runtemp = self.getVariableValue('CurrentLpRun')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				if (dir.options.direction === 'pst') {
					lpAPt = dir.options.psetid
				} else {
					lpAPt += dir.options.direction
				}

				if (lpAPt > 127) {
					lpAPt = 127;
				} else if (lpAPt < 0) {
					lpAPt = 0;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' A Point: ' + lpAPt + ' B Point: ' + lpBPt)

				var varID = 'Lp'+id_loop+'APoint'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + lpAPt)
        self.setVariableValues({ [varID]: lpAPt })
				
				self.setVariableValues({ CurrentLpA: lpAPt })

				self.sendEmotimoAPICommand('G25 L' + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
			}
		},
		setLoopBPointSmart: {
			name: 'Smart Set Loop B Point',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'pst', label: 'Set Preset' }
					]
				},
				{
					type: 'number',
					label: 'Preset ID',
					id: 'psetid',
					min: 0,
		    	max: 127,
					default: 0,
					isVisible: (options) => options.direction === 'pst',
				},
			],
			callback: async (dir) => {
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var runtemp = self.getVariableValue('CurrentLpRun')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				if (dir.options.direction === 'pst') {
					lpBPt = dir.options.psetid
				} else {
					lpBPt += dir.options.direction
				}

				if (lpBPt > 127) {
					lpBPt = 127;
				} else if (lpBPt < 0) {
					lpBPt = 0;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' A Point: ' + lpAPt + ' B Point: ' + lpBPt)

				var varID = 'Lp'+id_loop+'BPoint'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + lpBPt)
        self.setVariableValues({ [varID]: lpBPt })
				
				self.setVariableValues({ CurrentLpB: lpBPt })

				self.sendEmotimoAPICommand('G25 L' + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
			}
		},
		recallAPointSmart: {
			name: 'Recall Loop A Point Smart',
			options: [
				
			],
			callback: async (LpAPt) => {
				var temp = self.getVariableValue('CurrentLpA')
				self.sendEmotimoAPICommand('G20 P' + temp)
			}
		},
		recallBPointSmart: {
			name: 'Recall Loop B Point Smart',
			options: [
				
			],
			callback: async (LpAPt) => {
				var temp = self.getVariableValue('CurrentLpB')
				self.sendEmotimoAPICommand('G20 P' + temp)
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
						{ id: 'goto', label: 'Goto Loop' }
					]
				},
				{
					id: 'gotoLoop',
					type: 'number',
					label: 'Goto Loop ID',
					default: 0,
					isVisible: (options) => options.direction === 'goto'
				}
			],
			callback: async (loop) => {
				var id_loop = self.getVariableValue('CurrentLpSet')

				if (loop.options.direction === 'goto') {
					id_loop = loop.options.gotoLoop
				} else {
					id_loop += loop.options.direction
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
		saveLpSmart: {
			name: 'Save Loop Smart',
			options: [
			
			],
			callback: async (setLoop) => {
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var runtemp = self.getVariableValue('CurrentLpRun')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				self.sendEmotimoAPICommand('G25 L' + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500')
			},
		},
		recallLpSmart: {
			name: 'Recall Loop Smart',
			options: [
				
			],
			callback: async (recallLoop) => {
				var loop = self.getVariableValue('CurrentLpSet')
				var loopActive = self.getVariableValue('LpActive')

				if (loopActive == -1) {
					self.setVariableValues({ LpActive: loop })
					self.checkFeedbacks("LoopStatus")

					self.sendEmotimoAPICommand('G24 L' + loop)
				} else {
					self.setVariableValues({ LpActive: -1 })
					self.checkFeedbacks("LoopStatus")

					self.sendEmotimoAPICommand('G24')
				}
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
			callback: async (centerRS) => {
				self.sendEmotimoAPICommand('G202')
			}
		},
		calibrateAllTN: {
			name: 'Calibrate All TN',
			options: [
			],
			callback: async (centerRS) => {
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
			callback: async (calTN) => {
				self.sendEmotimoAPICommand('G812 C0 M' + (calTN.options.id_mot-4))
			}
		},
		
		//Limits
		setStopA: {
			name: 'Set Stop A',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (stopA) => {
				self.sendEmotimoAPICommand('G213 M' + stopA.options.id_mot)
			}
		},
		setStopB: {
			name: 'Set Stop B',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (stopB) => {
				self.sendEmotimoAPICommand('G214 M' + stopB.options.id_mot)
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
			callback: async (recStopA) => {
				var motorID = recStopA.options.id_mot

				if (motorID == 0) {
					motorID = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G217 M' + motorID)
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
			callback: async (recStopB) => {
				var motorID = recStopB.options.id_mot

				if (motorID == 0) {
					motorID = self.getVariableValue('CurrentMtrSet')
				}
				self.sendEmotimoAPICommand('G218 M' + motorID)
			}
		},
		clearStopA: {
			name: 'Clear Stop A',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (stopA) => {
				self.sendEmotimoAPICommand('G211 M' + stopA.options.id_mot)
			}
		},
		clearStopB: {
			name: 'Clear Stop B',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (stopB) => {
				self.sendEmotimoAPICommand('G212 M' + stopB.options.id_mot)
			}
		},
		clearStopByAxis: {
			name: 'Clear Stops by Axis',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
			],
			callback: async (stopB) => {
				self.sendEmotimoAPICommand('G219 M' + stopB.options.id_mot)
			}
		},
		clearAllStops: {
			name: 'Clear All Stops',
			options: [
				
			],
			callback: async (stopB) => {
				self.sendEmotimoAPICommand('G211 M0')
				setTimeout(self.sendEmotimoAPICommand('G212 M0'), 10)
			}
		},
		zeroMotors: {
			name: 'Zero Motors',
			options: [
				
			],
			callback: async (zero) => {
				self.sendEmotimoAPICommand('G201')
			}
		},

		//Smart Motor Setup
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
			callback: async (pst) => {
				
				var motor = self.getVariableValue('CurrentMtrSet')
				var motorName = self.getVariableValue('CurrentMtrStr')
				var motorSpeed = 0
				var motorInvert = 0
				var motorPosName = ''
				var motorNegName = ''
				var motorInvertName = ''

				motor += pst.options.direction
				
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
					motorSpeed = self.getVariableValue('M3SpeedLimit')
					motorInvert = self.getVariableValue('M3Inversion')
					motorPosName = motorName + ' Pos'
					motorNegName = motorName + ' Neg'
				} else if (motor == 4) {
					motorName = 'M4'
					motorSpeed = self.getVariableValue('M4SpeedLimit')
					motorInvert = self.getVariableValue('M4Inversion')
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
		setStopASmart: {
			name: 'Set Stop A Smart',
			options: [
				
			],
			callback: async (stopA) => {		
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G213 M' + motor)
			}
		},
		setStopBSmart: {
			name: 'Set Stop B Smart',
			options: [
				
			],
			callback: async (stopB) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G214 M' + motor)
			}
		},
		clearStopASmart: {
			name: 'Clear Stop A Smart',
			options: [
				
			],
			callback: async (stopA) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G211 M' + motor)
			}
		},
		clearStopBSmart: {
			name: 'Clear Stop B Smart',
			options: [
				
			],
			callback: async (stopB) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G212 M' + motor)
			}
		},
		clearStopByAxisSmart: {
			name: 'Clear Stops by Axis Smart',
			options: [
				
			],
			callback: async (stopB) => {				
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G219 M' + motor)
			}
		},

		setJogSpeedLimitSmart: {
			name: 'Set Motor Jog Speed Smart',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' },
						{ id: 'set', label: 'Set Value' }
					]
				},
				{
					type: 'number',
					label: 'Amount ( - for less)',
					id: 'amountValue',
					min: -100,
		    	max: 100,
          default: 5,
					isVisible: (options) => options.direction === 'amount',
				},
				{
					type: 'number',
					label: 'Set Value',
					id: 'setValue',
					min: 0,
		    	max: 100,
          default: 100,
					isVisible: (options) => options.direction === 'set',
				},
			],
			callback: async (jogSpeed) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				var motorSpeed = self.getVariableValue('CurrentMtrSpeed')

				if (jogSpeed.options.direction === 'set') {
					motorSpeed = jogSpeed.options.setValue
				} else {
					if (jogSpeed.options.direction === 'amount') {
						motorSpeed += jogSpeed.options.amountValue
					} else {
						motorSpeed += jogSpeed.options.direction
					}
				}

				if (motorSpeed > 100) {
					motorSpeed = 100;
				} else if (motorSpeed < 0) {
					motorSpeed = 0;
				}

				self.log('debug', 'Motor ID: ' + motor + ' Speed: ' + motorSpeed)

				if (motor == 1) {
					self.setVariableValues({ PanSpeedLimit: motorSpeed })
				} else if (motor == 2) {
					self.setVariableValues({ TiltSpeedLimit: motorSpeed })
				} else if (motor == 3) {
					self.setVariableValues({ M3SpeedLimit: motorSpeed })
				} else if (motor == 4) {
					self.setVariableValues({ M4SpeedLimit: motorSpeed })
				} else if (motor == 5) {
					self.setVariableValues({ TN1SpeedLimit: motorSpeed })
				} else if (motor == 6) {
					self.setVariableValues({ TN2SpeedLimit: motorSpeed })
				} else if (motor == 7) {
					self.setVariableValues({ TN3SpeedLimit: motorSpeed })
				} else if (motor == 8) {
					self.setVariableValues({ RollSpeedLimit: motorSpeed })
				} else if (motor == 9) {
					self.setVariableValues({ FocusSpeedLimit: motorSpeed })
				}

				self.setVariableValues({ CurrentMtrSpeed: motorSpeed })

			}
		},
		resetJogSpeedLimitSmart: {
			name: 'Reset Motor Jog Speed Smart',
			options: [
				
			],
			callback: async (resetSpeed) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				if (motor == 1) {
					self.setVariableValues({ PanSpeedLimit: 100 })
					self.setVariableValues({ CurrentMtrSpeed: 100 })
				} else if (motor == 2) {
					self.setVariableValues({ TiltSpeedLimit: 100 })
					self.setVariableValues({ CurrentMtrSpeed: 100 })
				} else if (motor == 3) {
					self.setVariableValues({ M3SpeedLimit: 100 })
					self.setVariableValues({ CurrentMtrSpeed: 100 })
				} else if (motor == 4) {
					self.setVariableValues({ M4SpeedLimit: 100 })
					self.setVariableValues({ CurrentMtrSpeed: 100 })
				} else if (motor == 5) {
					self.setVariableValues({ TN1SpeedLimit: 25 })
					self.setVariableValues({ CurrentMtrSpeed: 25 })
				} else if (motor == 6) {
					self.setVariableValues({ TN2SpeedLimit: 25 })
					self.setVariableValues({ CurrentMtrSpeed: 25 })
				} else if (motor == 7) {
					self.setVariableValues({ TN3SpeedLimit: 25 })
					self.setVariableValues({ CurrentMtrSpeed: 25 })
				} else if (motor == 8) {
					self.setVariableValues({ RollSpeedLimit: 100 })
					self.setVariableValues({ CurrentMtrSpeed: 100 })
				}

			}
		},
		jogMotorSmarter: {
			name: 'Motor Jog Smarter',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: [
						...DIRECTION_ID,
						{ id: 'amount', label: 'Amount' }
					]
				},
			],
			callback: async (actionJogSmart) => {
				var motorSpeed = 0
				var motorInversion = 1
				var temp = 0

				var motor = self.getVariableValue('CurrentMtrSet')

				if (motor == 1) {
					temp = self.getVariableValue('PanSpeedLimit')
					motorInversion = self.getVariableValue('PanInversion')
				} else if (motor == 2) {
					temp = self.getVariableValue('TiltSpeedLimit')
					motorInversion = self.getVariableValue('TiltInversion')
				} else if (motor == 3) {
					temp = self.getVariableValue('M3SpeedLimit')
					motorInversion = self.getVariableValue('M3Inversion')
				} else if (motor == 4) {
					temp = self.getVariableValue('M4SpeedLimit')
					motorInversion = self.getVariableValue('M4Inversion')
				} else if (motor == 5) {
					temp = self.getVariableValue('TN1SpeedLimit')
					motorInversion = self.getVariableValue('TN1Inversion')
				} else if (motor == 6) {
					temp = self.getVariableValue('TN2SpeedLimit')
					motorInversion = self.getVariableValue('TN2Inversion')
				} else if (motor == 7) {
					temp = self.getVariableValue('TN3SpeedLimit')
					motorInversion = self.getVariableValue('TN3Inversion')
				} else if (motor == 8) {
					temp = self.getVariableValue('RollSpeedLimit')
					motorInversion = self.getVariableValue('RollInversion')
				} else if (motor == 9) {
					temp = self.getVariableValue('FocusSpeedLimit')
					motorInversion = self.getVariableValue('FocusInversion')
				}

				if (motor < 5 || motor == 8) {
					motorSpeed = motorInversion * actionJogSmart.options.direction * temp / 100.0 * 500.0
				} else {
					motorSpeed = motorInversion * actionJogSmart.options.direction * temp / 100.0 * 100.0
				}

				self.log('debug', 'Temp: ' + temp + ' Motor Speed: ' + motorSpeed)

				self.sendEmotimoAPICommand('G301 M' + motor + ' V' + motorSpeed)
			},
		},
		stopCurrentMotor: {
			name: 'Stop Current Motor',
			options: [
				
			],
			callback: async (actionJogSmart) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				self.sendEmotimoAPICommand('G301 M' + motor + ' V0')
			},
		},
		invertCurrentAxis: {
			name: 'Invert Current Motor',
			options: [
				
			],
			callback: async (invertAxis) => {
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
					inversionState = self.getVariableValue('M3Inversion')
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

		presetRunTimeU: {
			name: 'Preset Run Time Increment',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Preset Number',
					default: 0,
					min: 0,
					max: 127,
				},
			],
			callback: async (presetRunTimeU) => {
				self.presetRunTimes[presetRunTimeU.options.num] += 1;
				self.sendEmotimoAPICommand('G21 N1 P' + presetRunTimeU.options.num + ' T' + self.presetRunTimes[presetRunTimeU.options.num] / 10 + ' A' + self.presetRampTimes[presetRunTimeU.options.num] / 10)
			},
		},
		presetRunTimeD: {
			name: 'Preset Run Time Decrement',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Preset Number',
					default: 0,
					min: 0,
					max: 127,
				},
			],
			callback: async (presetRunTimeD) => {
				self.presetRunTimes[presetRunTimeD.options.num] -= 1;
				self.sendEmotimoAPICommand('G21 N1 P' + presetRunTimeD.options.num + ' T' + self.presetRunTimes[presetRunTimeD.options.num] / 10 + ' A' + self.presetRampTimes[presetRunTimeD.options.num] / 10)
			},
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
			callback: async (virtButtonPress) => {
				self.sendEmotimoAPICommand('G600 C' + virtButtonPress.options.vbutton)
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
			callback: async (action) => {
				const cmd = unescape(await self.parseVariablesInString(action.options.id_send))

				if (cmd != '') {
					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + action.options.id_end, 'latin1')

					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}

					if (self.config.prot == 'udp') {
						if (self.udp !== undefined) {
							self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

							self.udp.send(sendBuf)
						}
					}
				}
			},
		},
	})
}
