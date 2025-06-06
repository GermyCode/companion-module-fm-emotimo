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
	{ id: 3, label: 'Slide' },
	{ id: 4, label: 'TurnTable' },
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
	{ id: 3, label: 'Slide' },
	{ id: 4, label: 'TurnTable' },
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
				const cmd = 'G300 M'
				const cmd2 = ' V'
				const cmd3 = '\n'

				if (cmd != '') {
					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + actionJog.options.id_mot + cmd2 + actionJog.options.id_speed + cmd3, 'latin1')

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
				const cmd = 'G301 M'
				const cmd2 = ' V'
				const cmd3 = '\n'
				var motorSpeed = 0
				var motorInversion = 1
				var temp = 0

				if (cmd != '') {

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

					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 * new for committestbri
					 */
					const sendBuf = Buffer.from(cmd + actionJogSmart.options.id_mot + cmd2 + motorSpeed + cmd3, 'latin1')

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
				const cmd = 'G301 M'
				const cmd2 = ' V'
				const cmd3 = '\n'
				var motorSpeed = 0
				var motorInversion = 1
				var rawMotorSpeed = 0
				var temp = 0

				if (cmd != '') {

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

					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + actionJogSmart.options.id_mot + cmd2 + motorSpeed + cmd3, 'latin1')

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
				const cmd = 'G302 M'
				const cmd2 = ' P'
				const cmd3 = '\n'
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

					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + setMotorPosition.options.id_mot + cmd2 + temp + cmd3, 'latin1')

					clearInterval(self.heartbeatInterval)
					self.heartbeatInterval = setInterval(() => {
						var cmd = 'G500\n';
						// var cmd = '\x45\x4D\x07\x00\x00\xC1\xA4';
						self.sendEmotimoAPICommand(cmd);
					}, 10000)

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
				const cmd = 'G0 '
				const cmd2 = '\n'
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

					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + cmdParam + temp + cmd2, 'latin1')

					clearInterval(self.heartbeatInterval)
					self.heartbeatInterval = setInterval(() => {
						var cmd = 'G500\n';
						// var cmd = '\x45\x4D\x07\x00\x00\xC1\xA4';
						self.sendEmotimoAPICommand(cmd);
					}, 10000)

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
			callback: async (jogSpeed) => {
				var temp = 0

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
				const cmd = 'G301 M'
				const cmd2 = ' V0'
				const cmd3 = '\n'

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


				/*
				 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
				 * sending a string assumes 'utf8' encoding
				 * which then escapes character values over 0x7F
				 * and destroys the 'binary' content
				 */
				const sendBuf = Buffer.from(cmd + resetSpeed.options.id_mot + cmd2 + cmd3, 'latin1')

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
		stopMotors: {
			name: 'Stop All Motors',
			options: [

			],
			callback: async (haltMotors) => {
				// console.log('Hello world!', event.options.num)
				const cmd = 'G911'


				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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
				const cmd = 'G21 P'


				const sendBuf = Buffer.from(cmd + setPreset.options.num + ' T' + self.presetRunTimes[setPreset.options.num] / 10 + ' A' + self.presetRampTimes[setPreset.options.num] / 10 + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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
				const cmd = 'G20 P'
				const sendBuf = Buffer.from(cmd + recallPreset.options.num + '\n', 'latin1')
				self.setVariableValues({ LastPstID: recallPreset.options.num })

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + runTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + rampTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + resetPresetRunTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + resetPresetRampTime.options.id_pst + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G11 M'
				const sendBuf = Buffer.from(cmd + gotoCoords.options.motorid + ' P' + resolvedCoordsValue + ' T' + resolvedRunValue + ' A' + resolvedRampValue + '\n', 'latin1')

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

		savePstCoords: {
			name: 'Save Preset By Coordinates',
			options: [
				{
					id: 'preset',
					type: 'number',
					label: 'Preset ID',
					default: 0,
					min: 0, 
					max: 127
				},
				{
					type: 'static-text',
					label: 'info',
					value: 'Leave blank if you dont want to store a value'
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
				const preset = gotoCoords.options.preset
				const resolvedRunValue = await self.parseVariablesInString(gotoCoords.options.runtime)
				const resolvedRampValue = await self.parseVariablesInString(gotoCoords.options.ramptime)
				const resolvedPanValue = await self.parseVariablesInString(gotoCoords.options.pCoords)
				const resolvedTiltValue = await self.parseVariablesInString(gotoCoords.options.tCoords)
				const resolvedSlideValue = await self.parseVariablesInString(gotoCoords.options.sCoords)
				const resolvedZoomValue = await self.parseVariablesInString(gotoCoords.options.zCoords)

				var cmd = 'G21 P' + preset
				if (resolvedRunValue) {
					cmd += ' T' + resolvedRunValue
					var varID = 'Pst'+preset+'RunT'
					self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedRunValue*10 )
					self.setVariableValues({ [varID]: resolvedRunValue*10 })
					if (preset === self.getVariableValue('CurrentPstSet')) {
						self.setVariableValues({ CurrentPstSetRun: resolvedRunValue*10 })
					}
				}
				if (resolvedRampValue) {
					cmd += ' A' + resolvedRampValue
					var varID = 'Pst'+preset+'RampT'
					self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedRampValue*10 )
					self.setVariableValues({ [varID]: resolvedRampValue*10 })
					if (preset === self.getVariableValue('CurrentPstSet')) {
						self.setVariableValues({ CurrentPstSetRamp: resolvedRampValue*10 })
					}
				}
				if (resolvedPanValue) {
					cmd += ' X' + resolvedPanValue
				}
				if (resolvedTiltValue) {
					cmd += ' Y' + resolvedTiltValue
				}
				if (resolvedSlideValue) {
					cmd += ' Z' + resolvedSlideValue
				}
				if (resolvedZoomValue) {
					cmd += ' W' + resolvedZoomValue
				}
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
						{ id: 0, label: 'Custom Preset' },
						{ id: 1, label: 'Smart Preset' },
						{ id: 2, label: 'All' },
					],
				},
				{
					id: 'pstid',
					type: 'number',
					label: 'Preset ID',
					min: 0,
					default: 0,
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
				// set variables
				var runtemp = 0
				var ramptemp = 0
				if (runTime.options.count === 0) {
					var preset = runTime.options.pstid
				}	else {
					var preset = self.getVariableValue('CurrentPstSet')
				}
				const resolvedValue = await self.parseVariablesInString(runTime.options.setvalue)
				// stores the inputed run value and gets ramp value from variables
				// runtemp = runTime.options.setvalue
				ramptemp = self.getVariableValue('CurrentPstSetRamp')
				// checks to make sure inputted values are in an acceptiable range
				if (resolvedValue > 600) {
					resolvedValue = 600;
				} else if (resolvedValue < 10) {
					resolvedValue = 10;
				}
				self.setVariableValues({ CurrentPstSetRun: resolvedValue })
				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + resolvedValue + ' RampT: ' + ramptemp)
				// setup variables for api call
				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + preset + ' T' + resolvedValue / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

				if (runTime.options.count === 2) { // if all presets
					var pstnum = 0;
					while (pstnum <= 30) { // loop through all presets setting them to the inputted value
						var varID = 'Pst'+pstnum+'RunT'
						self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedValue)
						self.setVariableValues({ [varID]: resolvedValue })
						// api call
						if (self.config.prot == 'tcp') {
							self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
							if (self.socket !== undefined && self.socket.isConnected) {
								self.socket.send(sendBuf)
							} else {
								self.log('debug', 'Socket not connected :(')
							}
						}
						// this is to wait so all of the api calls arent all at the same time, in ms
						await new Promise(r => setTimeout(r, 200));
						pstnum++
					}
				} else if (runTime.options.count === 1) { // if preset is selected to only change selected preset
					var varID = 'Pst'+preset+'RunT'
					self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedValue)
					self.setVariableValues({ [varID]: resolvedValue })
					// api call
					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}
				}
				else {
					var varID = 'Pst'+preset+'RunT'
					self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedValue)
					self.setVariableValues({ [varID]: resolvedValue })
					// api call
					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}
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
						{ id: 0, label: 'Custom Preset' },
            { id: 1, label: 'Smart Preset' },
            { id: 2, label: 'All' },
          ],
        },
				{
					id: 'pstid',
					type: 'number',
					label: 'Preset ID',
					min: 0,
					default: 0,
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
        // set variables
				var ramptemp = 0
				var runtemp = self.getVariableValue('CurrentPstSetRun')
				if (runTime.options.count === 0) {
					var preset = runTime.options.pstid
				}	else {
					var preset = self.getVariableValue('CurrentPstSet')
				}
				// ramptemp = rampTime.options.setvalue
				const resolvedValue = await self.parseVariablesInString(runTime.options.setvalue)

        // checks to make sure inputted values are in an acceptiable range
				if (resolvedValue > 250) {
					resolvedValue = 250;
				} else if (resolvedValue < 1) {
					resolvedValue = 1;
				}
        self.setVariableValues({ CurrentPstSetRamp: resolvedValue })
				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + resolvedValue)
        // setup variables for api call
        const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + preset + ' T' + runtemp / 10 + ' A' + resolvedValue / 10 + '\n', 'latin1')

        if (rampTime.options.count === 2) { // all presets
          var pstnum = 0;
          while (pstnum <= 30) { // loop through all presets setting them to the inputted value
            var varID = 'Pst'+pstnum+'RampT'
            self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedValue)
            self.setVariableValues({ [varID]: resolvedValue })
            // api call
            if (self.config.prot == 'tcp') {
              self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

              if (self.socket !== undefined && self.socket.isConnected) {
                self.socket.send(sendBuf)
              } else {
                self.log('debug', 'Socket not connected :(')
              }
            }
            // this is to wait so all of the api calls arent all at the same time, in ms
            await new Promise(r => setTimeout(r, 200));
            pstnum++
          }
        } else { // if preset is selected to only change selected preset
          var varID = 'Pst'+preset+'RampT'
          self.log('debug', 'Variable ID: ' + varID + ' to ' + resolvedValue)
          self.setVariableValues({ [varID]: resolvedValue })
          // api call
          if (self.config.prot == 'tcp') {
            self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
            if (self.socket !== undefined && self.socket.isConnected) {
              self.socket.send(sendBuf)
            } else {
              self.log('debug', 'Socket not connected :(')
            }
          }
        }
			}
		},

		setJogSpeedLimitByValue: {
			name: 'Set Motor Jog Speed By Value',
			options: [
				{
					type: 'dropdown',
					id: 'id_mot',
					label: 'Motor ID',
					default: 1,
					choices: MOTOR_ID,
				},
				{
					type: 'number',
					label: 'Amount',
					id: 'amountValue',
					min: 0,
		    	max: 100,
          default: 100,
				},
			],
			callback: async (jogSpeed) => {
				var temp = jogSpeed.options.amountValue

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
		setJogSpeedLimitSmartByValue: {
			name: 'Set Motor Jog Speed Smart By Value',
			options: [
				{
					type: 'number',
					label: 'Amount',
					id: 'amountValue',
					min: 0,
		    	max: 100,
          default: 100,
				},
			],
			callback: async (jogSpeed) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				var motorSpeed = jogSpeed.options.amountValue

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

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

					self.setVariableDefinitions(variableList)

					self.setVariableValues({ [`Pst${preset}RunT`]: 50 })
					self.setVariableValues({ [`Pst${preset}RampT`]: 10 })
					self.setVariableValues({ [`Pst${preset}Stat`]: 0 })
				}

				var ramptemp = self.getVariableValue('Pst' + preset + 'RampT')
				var runtemp = self.getVariableValue('Pst' + preset + 'RunT')

				self.log('debug', 'Preset ID: ' + preset + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				self.setVariableValues({ CurrentPstSet: preset })
				self.setVariableValues({ CurrentPstSetRun: runtemp })
				self.setVariableValues({ CurrentPstSetRamp: ramptemp })

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

				const cmd = 'G21 P'

				const sendBuf = Buffer.from(cmd + preset + ' T' + runtemp / 10 + ' A' + ramptemp / 10 + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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

				const cmd = 'G20 P'
				const sendBuf = Buffer.from(cmd + preset + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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
					default: 1,
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
					default: 1,
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
					default: 1,
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
					default: 1,
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
					default: 1,
					choices: LOOP_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID
				},
			],
			callback: async (LpAPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpAPt.options.id_loop+'APoint');

				pointTemp += LpAPt.options.direction

				if (pointTemp > 29) {
					pointTemp = 29;
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
					default: 1,
					choices: LOOP_ID,
				},
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID
				},
			],
			callback: async (LpBPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpBPt.options.id_loop+'BPoint');

				pointTemp += LpBPt.options.direction

				if (pointTemp > 29) {
					pointTemp = 29;
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
					default: 1,
					choices: LOOP_ID,
				},
			],
			callback: async (LpAPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpAPt.options.id_loop+'APoint');

				const cmd = 'G20 P'
				const sendBuf = Buffer.from(cmd + pointTemp + '\n', 'latin1')

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
		recallBPoint: {
			name: 'Recall Loop B Point',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 1,
					choices: LOOP_ID,
				},
			],
			callback: async (LpBPt) => {
				var pointTemp = self.getVariableValue('Lp'+LpBPt.options.id_loop+'BPoint');

				const cmd = 'G20 P'
				const sendBuf = Buffer.from(cmd + pointTemp + '\n', 'latin1')

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
		recallLoop: {
			name: 'Recall Loop',
			options: [
				{
					type: 'dropdown',
					id: 'id_loop',
					label: 'Loop ID',
					default: 1,
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
					self.checkFeedbacks("LoopStatus")
					const cmd = 'G25 L' + LpRecall.options.id_loop + ' A' + tempA + ' B' + tempB + ' C500 D500'
					const sendBuf = Buffer.from(cmd + '\n', 'latin1')
					const cmd2 = 'G24 L' + LpRecall.options.id_loop + ' N0'
					const sendBuf2 = Buffer.from(cmd2 + '\n', 'latin1')

					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
							setTimeout(() => self.socket.send(sendBuf2), 100);
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}
				} else {
					self.setVariableValues({ LpActive: -1 })
					const cmd = 'G24'
					const sendBuf = Buffer.from(cmd + '\n', 'latin1')

					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}
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

				const cmd = 'G25 L'
				const sendBuf = Buffer.from(cmd + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500' + '\n', 'latin1')

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
					min: -250,
		    	max: 250,
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
				
				if (ramptemp > 250) {
					ramptemp = 250;
				} else if (ramptemp < 1) {
					ramptemp = 1;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' RunT: ' + runtemp + ' RampT: ' + ramptemp)

				var varID = 'Lp'+id_loop+'RampT'
				self.log('debug', 'Variable ID: ' + varID + ' to ' + ramptemp)
        self.setVariableValues({ [varID]: ramptemp })

				self.setVariableValues({ CurrentLpRamp: ramptemp })

				const cmd = 'G25 L'
				const sendBuf = Buffer.from(cmd + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500' + '\n', 'latin1')

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
					choices: DIRECTION_ID
				},
			],
			callback: async (dir) => {
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var runtemp = self.getVariableValue('CurrentLpRun')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				lpAPt += dir.options.direction

				if (lpAPt > 29) {
					lpAPt = 29;
				} else if (lpAPt < 0) {
					lpAPt = 0;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' A Point: ' + lpAPt + ' B Point: ' + lpBPt)

				var varID = 'Lp'+id_loop+'APoint'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + lpAPt)
        self.setVariableValues({ [varID]: lpAPt })
				
				self.setVariableValues({ CurrentLpA: lpAPt })

				const cmd = 'G25 L'
				const sendBuf = Buffer.from(cmd + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500' + '\n', 'latin1')

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
		setLoopBPointSmart: {
			name: 'Smart Set Loop B Point',
			options: [
				{
					id: 'direction',
					type: 'dropdown',
					label: 'Direction',
					default: 1,
					choices: DIRECTION_ID
				},
			],
			callback: async (dir) => {
				var ramptemp = self.getVariableValue('CurrentLpRamp')
				var runtemp = self.getVariableValue('CurrentLpRun')
				var id_loop = self.getVariableValue('CurrentLpSet')
				var lpAPt = self.getVariableValue('CurrentLpA')
				var lpBPt = self.getVariableValue('CurrentLpB')

				lpBPt += dir.options.direction

				if (lpBPt > 29) {
					lpBPt = 29;
				} else if (lpBPt < 0) {
					lpBPt = 0;
				}

				self.log('debug', 'Loop ID: ' + id_loop + ' A Point: ' + lpAPt + ' B Point: ' + lpBPt)

				var varID = 'Lp'+id_loop+'BPoint'
        self.log('debug', 'Variable ID: ' + varID + ' to ' + lpBPt)
        self.setVariableValues({ [varID]: lpBPt })
				
				self.setVariableValues({ CurrentLpB: lpBPt })

				const cmd = 'G25 L'
				const sendBuf = Buffer.from(cmd + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500' + '\n', 'latin1')

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
		recallAPointSmart: {
			name: 'Recall Loop A Point Smart',
			options: [
				
			],
			callback: async (LpAPt) => {
				var temp = self.getVariableValue('CurrentLpA')

				const cmd = 'G20 P'
				const sendBuf = Buffer.from(cmd + temp + '\n', 'latin1')

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
		recallBPointSmart: {
			name: 'Recall Loop B Point Smart',
			options: [
				
			],
			callback: async (LpAPt) => {
				var temp = self.getVariableValue('CurrentLpB')

				const cmd = 'G20 P'
				const sendBuf = Buffer.from(cmd + temp + '\n', 'latin1')

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

				if (id_loop < 0) {
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

				const cmd = 'G25 L'
				const sendBuf = Buffer.from(cmd + id_loop + ' A' + lpAPt + ' B' + lpBPt + ' T' + runtemp / 10 + ' R' + ramptemp / 10 + ' C500 D500' + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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
					const cmd = 'G24 L'

					const sendBuf = Buffer.from(cmd + loop + '\n', 'latin1')

					if (self.config.prot == 'tcp') {
						self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

						if (self.socket !== undefined && self.socket.isConnected) {
							self.socket.send(sendBuf)
						} else {
							self.log('debug', 'Socket not connected :(')
						}
					}
				} else {
					self.setVariableValues({ LpActive: -1 })
					self.checkFeedbacks("LoopStatus")
					const cmd = 'G24'

					const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G202'
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
		calibrateAllTN: {
			name: 'Calibrate All TN',
			options: [
			],
			callback: async (centerRS) => {
				const cmd = 'G812 C0'
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G812 C0 M' + (calTN.options.id_mot-4)
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G213 M' + stopA.options.id_mot
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G214 M' + stopB.options.id_mot
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G217 M'
				var motorID = recStopA.options.id_mot

				if (motorID == 0) {
					motorID = self.getVariableValue('CurrentMtrSet')
				}

				const sendBuf = Buffer.from(cmd + motorID  + '\n', 'latin1')

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
				const cmd = 'G218 M'
				var motorID = recStopB.options.id_mot

				if (motorID == 0) {
					motorID = self.getVariableValue('CurrentMtrSet')
				}

				const sendBuf = Buffer.from(cmd + motorID  + '\n', 'latin1')

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
				const cmd = 'G211 M' + stopA.options.id_mot
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G212 M' + stopB.options.id_mot
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
				const cmd = 'G219 M' + stopB.options.id_mot
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
		clearAllStops: {
			name: 'Clear All Stops',
			options: [
				
			],
			callback: async (stopB) => {
				const cmd = 'G211 M0'
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')
				const cmd2 = 'G212 M0'
				const sendBuf2 = Buffer.from(cmd2 + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
						setTimeout(self.socket.send(sendBuf2), 10)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			}
		},
		zeroMotors: {
			name: 'Zero Motors',
			options: [
				
			],
			callback: async (zero) => {
				const cmd = 'G201'
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')
				

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
				const cmd = 'G213 M' + motor
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
		setStopBSmart: {
			name: 'Set Stop B Smart',
			options: [
				
			],
			callback: async (stopB) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				const cmd = 'G214 M' + motor
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
		clearStopASmart: {
			name: 'Clear Stop A Smart',
			options: [
				
			],
			callback: async (stopA) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				const cmd = 'G211 M' + motor
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
		clearStopBSmart: {
			name: 'Clear Stop B Smart',
			options: [
				
			],
			callback: async (stopB) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				const cmd = 'G212 M' + motor
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
		clearStopByAxisSmart: {
			name: 'Clear Stops by Axis Smart',
			options: [
				
			],
			callback: async (stopB) => {				
				var motor = self.getVariableValue('CurrentMtrSet')
				const cmd = 'G219 M' + motor
				const sendBuf = Buffer.from(cmd + '\n', 'latin1')

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
						{ id: 'amount', label: 'Amount' }
					]
				},
			],
			callback: async (jogSpeed) => {
				var motor = self.getVariableValue('CurrentMtrSet')
				var motorSpeed = self.getVariableValue('CurrentMtrSpeed')

				motorSpeed += jogSpeed.options.direction

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
				const cmd = 'G301 M'
				const cmd2 = ' V'
				const cmd3 = '\n'
				var motorSpeed = 0
				var motorInversion = 1
				var temp = 0

				var motor = self.getVariableValue('CurrentMtrSet')

				if (cmd != '') {

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

					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + motor + cmd2 + motorSpeed + cmd3, 'latin1')

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
		stopCurrentMotor: {
			name: 'Stop Current Motor',
			options: [
				
			],
			callback: async (actionJogSmart) => {
				const cmd = 'G301 M'
				const cmd2 = ' V0'
				const cmd3 = '\n'
				var motorSpeed = 0
				var temp = 0

				var motor = self.getVariableValue('CurrentMtrSet')

				if (cmd != '') {
					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + motor + cmd2 + cmd3, 'latin1')

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
		//These are already general commands without a motor ID
		// recallStopA: {
		// 	name: 'Recall Stop A Smart',
		// 	options: [
		// 		{
		// 			type: 'dropdown',
		// 			id: 'id_mot',
		// 			label: 'Motor ID',
		// 			default: 1,
		// 			choices: MOTOR_ID,
		// 		},
		// 	],
		// 	callback: async (recStopA) => {
		// 		const cmd = 'G217'
		// 		const sendBuf = Buffer.from(cmd + '\n', 'latin1')

		// 		if (self.config.prot == 'tcp') {
		// 			self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

		// 			if (self.socket !== undefined && self.socket.isConnected) {
		// 				self.socket.send(sendBuf)
		// 			} else {
		// 				self.log('debug', 'Socket not connected :(')
		// 			}
		// 		}
		// 	}
		// },
		// recallStopB: {
		// 	name: 'Recall Stop B Smart',
		// 	options: [
		// 		{
		// 			type: 'dropdown',
		// 			id: 'id_mot',
		// 			label: 'Motor ID',
		// 			default: 1,
		// 			choices: MOTOR_ID,
		// 		},
		// 	],
		// 	callback: async (recStopB) => {
		// 		const cmd = 'G218'
		// 		const sendBuf = Buffer.from(cmd + '\n', 'latin1')

		// 		if (self.config.prot == 'tcp') {
		// 			self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

		// 			if (self.socket !== undefined && self.socket.isConnected) {
		// 				self.socket.send(sendBuf)
		// 			} else {
		// 				self.log('debug', 'Socket not connected :(')
		// 			}
		// 		}
		// 	}
		// },


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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + presetRunTimeU.options.num + ' T' + self.presetRunTimes[presetRunTimeU.options.num] / 10 + ' A' + self.presetRampTimes[presetRunTimeU.options.num] / 10 + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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

				const cmd = 'G21 N1 P'
				const sendBuf = Buffer.from(cmd + presetRunTimeD.options.num + ' T' + self.presetRunTimes[presetRunTimeD.options.num] / 10 + ' A' + self.presetRampTimes[presetRunTimeD.options.num] / 10 + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
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
				// console.log('Hello world!', event.options.num)
				const cmd = 'G600 C'
				const sendBuf = Buffer.from(cmd + virtButtonPress.options.vbutton + '\n', 'latin1')

				if (self.config.prot == 'tcp') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		sample_action: {
			name: 'My First Action',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},

		// buttonFeedback: {
		// 	name: 'Button Feedback (highlight/clear)',
		// 	options: [
		// 		{
		// 			type: 'dropdown',
		// 			label: 'highlight/clear',
		// 			id: 'bol',
		// 			choices: [
		// 				{ id: 1, label: 'Highlight' },
		// 				{ id: 0, label: 'Clear' },
		// 			],
		// 			default: '1',
		// 		},
		// 	],
		// 	callback: async (event) => {
		// 		self.state.heldThresholdReached = event.options.bol
		// 		self.checkFeedbacks()
		// 	},
		// },

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
