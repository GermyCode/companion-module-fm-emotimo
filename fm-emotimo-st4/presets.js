const { combineRgb } = require('@companion-module/base')
const { COLORS } = require('./color.js')

let { MODELS, SERIES_SPECS } = require('./models.js')

module.exports = {
	initPresets: function () {
		let presets = {}
		let SERIES = {}

		// Variables for Base64 image data do not edit
		let image_up =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIFJREFUKM+90EEKgzAQRmFDFy49ghcp5FquVPBighcRegHBjWDJ68D8U6F7m00+EnhkUlW3ru6rdyCV0INQzSg1zFLLKmU2aeCQQMEEJXIQORRsTLNyKJhNm3IoaPBg4mQorp2Mh1+00kKN307o/bZrpt5O/FlPU/c75X91/fPd6wPRD1eHyHEL4wAAAABJRU5ErkJggg=='
		let image_down =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIlJREFUKM/F0DEOwyAMBVAjDxk5Qo7CtdiClIv1KJF6gUpZIhXxY2zTDJ2benoS8LFN9MsKbYjxF2XRS1UZ4bCeGFztFmNqphURpidm146kpwFvLDYJpPQtLSLNoySyP2bRpoqih2oSFW8K3lYAxmJGXA88XMnjeuDmih7XA8vXvNeeqX6U6aY6AacbWAQNWOPUAAAAAElFTkSuQmCC'
		let image_left =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHpJREFUKM+1kTEOgCAQBM9Q2JjwA/mJPA2fxlN4giWF8TRBBhMpbKSaZie3i8gPb4Y8FNZKGm8YIAONkNWacIruQLejy+gyug1dQhfRqZa0v6gYA6QfqSWapZnto1B6XdUuFaVHoJunr2MD21nIdJYUEhLYfoGmP777BKKIXC0eYSD5AAAAAElFTkSuQmCC'
		let image_right =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHhJREFUKM+10LERgCAMQFE4CktHcBRWcRMYzVEcwdKCI+od+fGksVCq3/AuiXOfvZnaNXzRClVrEKtMLdSqP2RTRQAFMAFGwAlw7MAk0sAzGnhVoerLKg/F5Pv4NoFNZZNGpk9sxJYeLsDdL5T7S8IFOM/R3OZ+fQeQZV9pMy+bVgAAAABJRU5ErkJggg=='
		let image_up_right =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABhlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+X02G5AAAAgXRSTlMAAte32QZhZx7d+TywDTf8/d5VstYPOxULNvKmSY8TFBrxyeGCluJeELQ5uw7ULND4BedlKuv2P/vDA8UgCk30WO41s8+5X8dABAz6QhHVaR156JpPnihSfTJDNOMBm4bzSICqr23NsRjcGRbtjTCS2lzsOmyu9+WLKb2fTL8+RPDhqO4yAAABfElEQVRYw+3WZW/CUBQG4AO0FBsOwwcMm7sLc3d3d3e388/HGGs7lpD0tsm+9P3S5CT3SdPec+8BkCNHzv9FAVAAEABYdQDkA7jo9GNUIDMBzstb5vr0/Gx8Z35zOjI36R2xbu+619eWa2xCoK0FClF5h1cWxDHEwilEOyLlQc8hokoAlMRcESBh7siQlJBWKkijNaHuPrWBED9iYiDQ7Pv1D4Z4/DXyFo2JgeAghQEkEgAvT6IgNo/PIUmgd62oj80mqEIpINoXRkmg2j2UBDIWVXKLTSXEUIOF/xbV5aRQsJvvUOoqMqjZZ+c7FcX8ThYCtTbxHV0fkEGDA73D3Dpzi/6rWEYAdSn579PZ/t3IBJChkef0dLRlHXdkJ6TSmSnmiYPq1LQIiGHX9BvZYinJ7/+R6q1czUG0j9KSOTxDc6UhshZhMIQrS78mncwZtzErrNcYL6V2Zd0tJ6i7QFtAYPcvHv25W6J+/Y3BrRA/x6WGuGN5mpUjhyyfsGtrpKE95HoAAAAASUVORK5CYII='
		let image_down_right =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABXFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jYfXuAAAAc3RSTlMAQ98Ox1j9gAtRNTqBPfgu9p/MTQ+G1Qfx7Y0VBYyJgjkGd3ysU+Zz1IQvMM20PgwBp8Mi4TSUiDvlPxylsaF2WfcjJh0S+wLzQLmY4l/ovX3ra1rPLAOSKa4RUEvgcZwbFHqPzodGbX7qPMvCtsEq1laguT+HEwAAAVlJREFUWMPt1sduwkAQgOGxDfFCIITe0nvvvZHee++992TeX4pJQIC9hPWaQ6T41x6skfY7WGPJAGZm/6qgZjIH4AMgOp2Lq32batTkdW/trPt9+qC70DVmSKS2BXF7A1fX9DDnN2FUSpe8y5hID3SZuJMmrcwmoSFm5vD0BDWSNTnCUmZoD1PZtJCDGfIgRUpBMjPkR4rEAwUtFIkHAkKRuCCaxAdRJE5IK/FCGumWF1JLEW5ILfFD2ST9UBaJA6JLPBCQ57xAJcp5NQbtSgBReJSsH8QI5No8ODo+u397ecL3T35IGhcRA4jig8E9qmjAX2OGnAV5ggrxr0ELOaByVmg6B1TGvEYyTvxcKUaMv/ii7xN/VAZYY2dfSHkkPOYY7Kpf7OmLzLfGPIFGd6izWrRUjdYt9Xfo+ULsLpgRKqGtGyadAEIUmnuhXSAwMAXD5j+omZlZRl+X30CWTm2dHwAAAABJRU5ErkJggg=='
		let image_up_left =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABLFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PVkEkAAAAY3RSTlMAAQ/6Uc0OEAvHTzL7TcudsMHvdwnfUwMcG8UGiIfTrIkg9QI+/ZTDe460km73LNovCo1vQUuR4Lwk45/OK+3UERTkekziZlSK8QQnoOsFaaXmLqOylvPZLYDRZTUWUpiTDfAuEmiSAAABUklEQVRYw+3WZ2+DMBAG4EtTygrQ7NHsJt1777333vv+/38o6gIMSo0dqf3AK1lIZ/mRjPEJgCBBgvxtQr8WqDKbCiWUG1AnYXU7C7UJqKQSR5oKQwqIPphsYW24nEPjJCYXilf9F+G+qeTmThTP5w8X8gK9NLqOGMGPhD8fdXtBkGihlmlsmF5aqK2xg9FmQe3/DupuEhTpoT41z/V1HVHfxWRRo/6ORBfyjILx9mRo+2MDlS3ggF5q4uP9qzmVNjfOA+EDdDLcWA8IW6FJEJPkCbFI3hCDZEFVPsmC7mQuyYJ0iUuyIAG4JDvEJTkgHskJcUgExC6RECmxQ4REDa24ILsU6wL/rfYHskmX9C87Pfi9aA5cUmnRx/kffDmncSCkat7X342KSzOIuesNR1WSl7GU8Xfbbs9Gyoo0TvRp6Tie8d2TOsyx51UMEiQIS94B13oTqqYgGGoAAAAASUVORK5CYII='
		let image_down_left =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABg1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8aT76cAAAAgHRSTlMAafwJfflezc+3WA7Z5Rk6PAvpBNE73kJT89QxZ48czNIv9A1DnI3qKQUaymjT4a7HdVuGf85LR20CVHr+tLBlA0GvYSTYZEnbAcazNPX4yB4GrAgnmL6Bcj4qIVKIe8kdVadIEe27B90bOG/3Er1rYJq1wibyh+4Q5CMzRllMXDo5euMAAAGfSURBVFjD7dblUwJBGAbw5aSlBJRGQERBkLC7u7u7u7veP90jDnaEcdhjP+k9X5h9Zu43O7PLe4eQECH/KGsIaUooOEcLK75LpehH628idSrE+nMANfyQ3MY2BRm0C6mM462tUwJAJtVyUB1WmsoSFZEk46D6TBcYS3UKPpCYawxD5VxHImVD/RHIxMQbGintkGQcppkcOkuutQPYfkDfmjck556ZTSydve2YY5UWk0Mww672VPh+XFqCU8tA+whtL+KOpa+bF3Rh8B4ymDNaSnSzG9IPIpsL34/HTPZfS58auMPYuYNMWcQXOsD3U9ZDOkZkkCvqwSIqUI2WfEDmgiQxRANiIp8GKtDLO6/Znw19oOdXhKoROtEUBr1F5Y9f4dt1XygqKgh6YqcHwMQkQBWICr1H6czTgrpoQde0IGnekJEWNEwLMv/GPDDB/M/fDioVeLYA5GqoYt+xNRY4toJkCiBUG7vTEVxJu2Z549RbqXQuba7uVDZWO66mgw6d7kYaEPvvCb+REIp/srGzLP4aa0n8zKFkKUSIkD+Qb9QrYMvxAbaBAAAAAElFTkSuQmCC'

		let motorNames = ['Pan', 'Tilt', 'Slide', 'M4', 'TN Focus', 'TN Iris', 'TN Zoom', 'Roll', 'RS Focus']

		// ########################
		// ##### Smart Motor #####
		// ########################
		presets.MotorHeader1 = {
			category: 'Motors',
			name: 'Streamdeck Motor Page',
			type: 'text',
			text: 'This is an Example Motor Setup Page for Streamdeck'
		},

		presets.CurMotNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Neg',
			style: {
				text: '$(companion-module-emotimo-st4-3:CurrentMtrNegStr)\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'smart',
								id_speed: 0,
								dir: -1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'smart',
							}
						}
					],
				},
			],
		},
		presets.CurMotPos = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Pos',
			style: {
				text: '$(companion-module-emotimo-st4-3:CurrentMtrPosStr)\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'smart',
								id_speed: 0,
								dir: 1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'smart',
							}
						}
					],
				},
			],
		},
		presets.curMtrAxisInversion = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Inversion',
			style: {
				text: 'Direction:\\n$(companion-module-emotimo-st4-3:CurrentMtrInversion)',
				size: '14',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'invertCurrentAxis',
						}
					],
				},
			],
		}
		presets.curMotorSpeedInc = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Increment',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
				}
			],
		},

		presets.MotorLineBreak1 = {
			category: 'Motors',
			name: '',
			type: 'text',
			text: ''
		},

		presets.IncreaseMtrSetup = {
			category: 'Motors',
			type: 'button',
			name: 'Increase Motor ID',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setMotorID',
							options: {
								direction: 1
							}
						}
					],
				}
			],
		},
		presets.curMtrSetup = {
			category: 'Motors',
			type: 'button',
			name: 'Selected Motor',
			style: {
				text: 'Motor\\nID:\\n$(companion-module-emotimo-st4-3:CurrentMtrSet)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [{}],
		},
		presets.DecreaseMtrSetup = {
			category: 'Motors',
			type: 'button',
			name: 'Decrease Motor ID',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setMotorID',
							options: {
								direction: -1
							}
						}
					],
				}
			],
		},
		presets.curMtrSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Speed',
			style: {
				text: 'Speed:\\n$(companion-module-emotimo-st4-3:CurrentMtrSpeed)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},

		presets.MotorLineBreak2 = {
			category: 'Motors',
			name: '',
			type: 'text',
			text: ''
		},
		
		presets.SetCurMtrStopA = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Stop A',
			style: {
				text: '$(companion-module-emotimo-st4-3:CurrentMtrStr) Stop A',
				color: COLORS.WHITE,
				bgcolor: combineRgb(127, 0, 0),
				},
			steps: [
				{
					up: [
						{
							actionId: 'setStopA',
							options: {
								settype: 'smart'
							}
						}
					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'recallStopA',
								options: {
									settype: 'smart'
								},
							},
						],
					},
				}
			],
			feedbacks: [
				{
					feedbackId: 'StopAStatusSmart',
					style: {
						bgcolor: COLORS.DARK_GREEN,
						color: COLORS.BLACK,
					},
				}
			]
		},
		presets.clearStopsByCurAxis = {
			category: 'Motors',
			type: 'button',
			name: 'Clear Current Motor Stops',
			style: {
				text: 'Clear $(companion-module-emotimo-st4-3:CurrentMtrStr) Stops',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
				},
			steps: [
				{
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'clearStopsByAxis',
								options: {
									settype: 'smart',
								}
							},
						],
					},
				}
			],
		},
		presets.SetCurMtrStopB = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Stop B',
			style: {
				text: '$(companion-module-emotimo-st4-3:CurrentMtrStr) Stop B',
				color: COLORS.WHITE,
				bgcolor: combineRgb(127, 0, 0),
				},
			steps: [
				{
					down: [
						 
					],
					up: [
						{
							actionId: 'setStopB',
							options: {
								settype: 'smart'
							}
						}
					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'recallStopB',
								options: {
									settype: 'smart'
								},
							},
						],
					},
				}
			],
			feedbacks: [
				{
					feedbackId: 'StopBStatusSmart',
					style: {
						bgcolor: COLORS.DARK_GREEN,
						color: COLORS.BLACK,
					},
				}
			]
		},
		presets.curMotorSpeedDec = {
			category: 'Motors',
			type: 'button',
			name: 'Current Motor Decrement',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
				}
			],
		}
		
		presets.MotorHeader2 = {
			category: 'Motors',
			name: 'Rotary Encoders',
			type: 'text',
			text: 'These are only available for Surfaces that support Rotary Encoders (Ex. Streamdeck+)'
		},

		presets.MotorIDRotary2 = {
			category: 'Motors',
			type: 'button',
			name: 'Motor ID',
			options: { rotaryActions: true },
			style: {
				text: 'Motor ID Rotary',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setMotorID',
							options: {
								direction: -1
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setMotorID',
							options: {
								direction: 1
							}
						}
					],
				},
			],
		},
		presets.MotorSpeedRotary2 = {
			category: 'Motors',
			type: 'button',
			name: 'Motor Speed Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Motor Speed Rotary',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 1
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 1
							}
						}
					],
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},

		presets.MotorHeader3 = {
			category: 'Motors',
			name: 'Motor Arrows',
			type: 'text',
			text: 'These are Pan/Tilt Velocity Controls with Arrow Images'
		},

		// ########################
		// # Motor Arrow Presets #
		// ########################
		presets.MotLeftUp = {
			category: 'Motors',
			type: 'button',
			name: 'PanLeft TiltUp',
			style: {
				text: '',
				png64: image_up_left,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: -1
							}
						},
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: 1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},
		presets.MotTiltUp = {
			category: 'Motors',
			type: 'button',
			name: 'Tilt Up',
			style: {
				text: '',
				png64: image_up,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: 1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},
		presets.MotRightUp = {
			category: 'Motors',
			type: 'button',
			name: 'PanRight TiltUp',
			style: {
				text: '',
				png64: image_up_right,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: 1
							}
						},
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: 1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},

		presets.MotorLineBreak3 = {
			category: 'Motors',
			name: '',
			type: 'text',
			text: ''
		},

		presets.MotPanLeft = {
			category: 'Motors',
			type: 'button',
			name: 'Pan Left',
			style: {
				text: '',
				png64: image_left,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
					],
				},
			],
		},
		presets.StopMotors = {
			category: 'Motors',
			type: 'button',
			name: 'Stop All Motors',
			style: {
				text: 'E-Stop\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.RED,
			},
			steps: [
				{
					down: [
						{
							actionId: 'stopMotors',
						}
					],
					up: [
						{
							actionId: 'stopMotors',
						}
					],
				},
			],
		},
		presets.MotPanRight = {
			category: 'Motors',
			type: 'button',
			name: 'Pan Right',
			style: {
				text: '',
				png64: image_right,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
					],
				},
			],
		},

		presets.MotorLineBreak4 = {
			category: 'Motors',
			name: '',
			type: 'text',
			text: ''
		},

		presets.MotLeftDown = {
			category: 'Motors',
			type: 'button',
			name: 'PanLeft TiltDown',
			style: {
				text: '',
				png64: image_down_left,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: -1
							}
						},
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: -1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},
		presets.MotTiltDown = {
			category: 'Motors',
			type: 'button',
			name: 'Tilt Down',
			style: {
				text: '',
				png64: image_down,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: -1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},
		presets.MotRightDown = {
			category: 'Motors',
			type: 'button',
			name: 'PanRight TiltDown',
			style: {
				text: '',
				png64: image_down_right,
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: 1
							}
						},
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: -1
							}
						}
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},

		// ########################
		// #### Motor	Rotary	####
		// ########################

		// presets.MotorHeader4 = {
		// 	category: 'Motors',
		// 	name: 'Position Control',
		// 	type: 'text',
		// 	text: 'These are Rotary Encoder Commands that give you Position Control of the Specified Axis.\nThese are only available for Surfaces that support Rotary Encoders (Ex. Streamdeck+)'
		// },

		// presets.FocusPositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Focus Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Focus Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 5,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 5,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 5
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.IrisPositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Iris Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Iris Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 6,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 6,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 6
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.ZoomPositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Zoom Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Zoom Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 7,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 7,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 7
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.PanPositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Pan Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Pan Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 1,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 1,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 1
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.TiltPositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Tilt Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Tilt Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 2,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 2,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 2
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.SlidePositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Slide Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Slide Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 3,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 3,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 3
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.M4PositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'M4 Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'M4 Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 4,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 4,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 4
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },
		// presets.RollPositionControl = {
		// 	category: 'Motors',
		// 	type: 'button',
		// 	name: 'Roll Position Control',
		// 	options: { rotaryActions: true },
		// 	style: {
		// 		text: 'Roll Pos. Rotary',
		// 		color: COLORS.WHITE,
		// 		bgcolor: COLORS.DARK_DARK_BLUE,
		// 	},
		// 	steps: [
		// 		{
		// 			rotate_left: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 8,
		// 						direction: -1
		// 					}
		// 				}
		// 			],
		// 			rotate_right: [
		// 				{
		// 					actionId: 'positionDrive',
		// 					options: {
		// 						id_mot: 8,
		// 						direction: 1
		// 					}
		// 				}
		// 			],
		// 			down: [
		// 				{
		// 					actionId: 'toggleIncrement',
		// 					options: {
		// 						id_mot: 8
		// 					}
		// 				}
		// 			],
		// 		},
		// 	],
		// },

		// presets.MotorHeader8 = {
		// 	category: 'Motors',
		// 	name: 'Velocity Control',
		// 	type: 'text',
		// 	text: 'These can be used to set a cruise control Speed. The motor will not stop until it reaches a Virtual Limit or the cruise speed is cleared. These are only available for Surfaces that support Rotary Encoders (Ex. Streamdeck+)'
		// }
		// for (let inc = 1; inc < 10; inc++) {
		// 	presets[motorNames[inc-1] + 'CruiseSpeed'] = {
		// 		category: 'Motors',
		// 		type: 'button',
		// 		name: motorNames[inc-1] + ' Velocity Control',
		// 		options: { rotaryActions: true },
		// 		style: {
		// 			text: motorNames[inc-1] + ' Vel. Rotary',
		// 			color: COLORS.WHITE,
		// 			bgcolor: COLORS.DARK_DARK_BLUE,
		// 		},
		// 		steps: [
		// 			{
		// 				rotate_left: [
		// 					{
		// 						actionId: 'setCruiseSpeed',
		// 						options: {
		// 							id_mot: inc,
		// 							direction: -1
		// 						}
		// 					}
		// 				],
		// 				rotate_right: [
		// 					{
		// 						actionId: 'setCruiseSpeed',
		// 						options: {
		// 							id_mot: inc,
		// 							direction: 1
		// 						}
		// 					}
		// 				],
		// 				down: [
		// 					{
		// 						actionId: 'resetCruiseSpeed',
		// 						options: {
		// 							id_mot: inc
		// 						}
		// 					}
		// 				],
		// 			},
		// 		],
		// 	}
		// }
		
		// ########################
		// #### Motor	Speeds	####
		// ########################

		presets.MotorHeader5 = {
			category: 'Motors',
			name: 'Axis Speed Limit',
			type: 'text',
			text: 'This is a multiplier ranging from 0-100% that throttles the max speed of the axis'
		}
		for (let inc = 1; inc < 9; inc++) {
			presets['motorSpeedInc' + inc] = {
				category: 'Motors',
				type: 'button',
				name: motorNames[inc-1] + ' Increment',
				style: {
					text: '⬆️',
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setJogSpeedLimit',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'up',
									ammount: 5
								}
							}
						],
					}
				],
			}
		}
		presets.MotorLineBreak5 = {
			category: 'Motors',
			name: '',
			type: 'text',
			text: ''
		},

		presets.panSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Pan Speed',
			style: {
				text: 'Pan\\nSpeed:\\n$(companion-module-emotimo-st4-3:PanSpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 1,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.tiltSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Tilt Speed',
			style: {
				text: 'Tilt\\nSpeed:\\n$(companion-module-emotimo-st4-3:TiltSpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 2,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.m3SpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'M3 Speed',
			style: {
				text: 'Slide\\nSpeed:\\n$(companion-module-emotimo-st4-3:M3-SlideSpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 3,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.m4SpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'M4 Speed',
			style: {
				text: 'M4\\nSpeed:\\n$(companion-module-emotimo-st4-3:M4-ZoomSpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 4,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.focusSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Focus Speed',
			style: {
				text: 'Focus\\nSpeed:\\n$(companion-module-emotimo-st4-3:TN1SpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 5,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.irisSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Iris Speed',
			style: {
				text: 'Iris\\nSpeed:\\n$(companion-module-emotimo-st4-3:TN2SpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 6,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.zoomSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Zoom Speed',
			style: {
				text: 'Zoom\\nSpeed:\\n$(companion-module-emotimo-st4-3:TN3SpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 7,
								setopt: 'reset',
							}
						}
					],
				},
			],
		},
		presets.rollSpeedLimit = {
			category: 'Motors',
			type: 'button',
			name: 'Roll Speed',
			style: {
				text: 'Roll\\nSpeed:\\n$(companion-module-emotimo-st4-3:RollSpeedLimit)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setJogSpeedLimit',
							options: {
								settype: 'id',
								id: 8,
								setopt: 'reset',
							}
						}
					],
				},
			],
		}
		presets.MotorLineBreak6 = {
			category: 'Motors',
			name: '',
			type: 'text',
			text: ''
		}

		for (let inc = 1; inc < 9; inc++) {	
				presets['motorSpeedDec' + inc] = {
					category: 'Motors',
					type: 'button',
					name: motorNames[inc-1] + ' Decrement',
					style: {
						text: '⬇️',
						color: COLORS.WHITE,
						bgcolor: COLORS.DARK_BLUE,
						},
					steps: [
						{
							down: [
								{
									actionId: 'setJogSpeedLimit',
									options: {
										settype: 'id',
										id: inc,
										setopt: 'down',
										ammount: 5
									}
								}
							],
						}
					],
				}
		}

		// ########################
		// #### Motor	Presets ####
		// ########################
		presets.MotorHeader6 = {
			category: 'Motors',
			name: 'Jog Motors by Axis',
			type: 'text',
			text: 'These buttons can be used for Live Velocity Control of the Specified Axis'
		}

		presets.MotPanNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Pan Left',
			style: {
				text: 'Pan Left\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
					],
				},
			],
		},
		presets.MotPanPos = {
			category: 'Motors',
			type: 'button',
			name: 'Pan Right',
			style: {
				text: 'Pan Right\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 1,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 1,
							}
						},
					],
				},
			],
		},

		presets.MotTiltNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Tilt Down',
			style: {
				text: 'Tilt Down\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},
		presets.MotTiltPos = {
			category: 'Motors',
			type: 'button',
			name: 'Tilt Up',
			style: {
				text: 'Tilt Up\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 2,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 2,
							}
						},
					],
				},
			],
		},

		presets.MotSlideNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Slide Neg',
			style: {
				text: 'Slide Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 3,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 3,
							}
						},
					],
				},
			],
		},
		presets.MotSlidePos = {
			category: 'Motors',
			type: 'button',
			name: 'Slide Pos',
			style: {
				text: 'Slide Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 3,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 3,
							}
						},
					],
				},
			],
		},

		presets.MotM4Neg = {
			category: 'Motors',
			type: 'button',
			name: 'M4 Neg',
			style: {
				text: 'M4/Zoom Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 4,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 4,
							}
						},
					],
				},
			],
		},
		presets.MotM4Pos = {
			category: 'Motors',
			type: 'button',
			name: 'M4 Pos',
			style: {
				text: 'M4/Zoom Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 4,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 4,
							}
						},
					],
				},
			],
		},

		presets.MotFocusNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Focus Neg',
			style: {
				text: 'Focus Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 5,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 5,
							}
						},
					],
				},
			],
		},
		presets.MotFocusPos = {
			category: 'Motors',
			type: 'button',
			name: 'Focus Pos',
			style: {
				text: 'Focus Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 5,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 5,
							}
						},
					],
				},
			],
		},

		presets.MotIrisNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Iris Neg',
			style: {
				text: 'Iris Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 6,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 6,
							}
						},
					],
				},
			],
		},
		presets.MotIrisPos = {
			category: 'Motors',
			type: 'button',
			name: 'Iris Pos',
			style: {
				text: 'Iris Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 6,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 6,
							}
						},
					],
				},
			],
		},

		presets.MotZoomNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Zoom Neg',
			style: {
				text: 'Zoom Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 7,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 7,
							}
						},
					],
				},
			],
		},
		presets.MotZoomPos = {
			category: 'Motors',
			type: 'button',
			name: 'Zoom Pos',
			style: {
				text: 'Zoom Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 7,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 7,
							}
						},
					],
				},
			],
		},

		presets.MotRollNeg = {
			category: 'Motors',
			type: 'button',
			name: 'Roll Neg',
			style: {
				text: 'Roll Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 8,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 8,
							}
						},
					],
				},
			],
		},
		presets.MotRollPos = {
			category: 'Motors',
			type: 'button',
			name: 'Roll Pos',
			style: {
				text: 'Roll Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 8,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 8,
							}
						},
					],
				},
			],
		},

		presets.MotRSFocusNeg = {
			category: 'Motors',
			type: 'button',
			name: 'RSFocus Neg',
			style: {
				text: 'RSFocus Neg\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 9,
								id_speed: 0,
								dir: -1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 9,
							}
						},
					],
				},
			],
		},
		presets.MotRSFocusPos = {
			category: 'Motors',
			type: 'button',
			name: 'RSFocus Pos',
			style: {
				text: 'RSFocus Pos\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jogMotor',
							options: {
								settype: 'id',
								id: 9,
								id_speed: 0,
								dir: 1
							}
						},
					],
					up: [
						{
							actionId: 'jogMotorStop',
							options: {
								settype: 'id',
								id: 9,
							}
						},
					],
				},
			],
		}

		// ########################
		// ####	Motor	Stops	####
		// ########################
		presets.MotorHeader7 = {
			category: 'Motors',
			name: 'Stops by Axis',
			type: 'text',
			text: 'These buttons can be used to Set/Clear the Virtual Limits for the Specified Axis'
		}

		for (let inc = 1; inc < 9; inc++) {
			presets['setStopA' + inc] = {
				category: 'Motors',
				type: 'button',
				name: motorNames[inc-1] + ' Stop A',
				style: {
					text: motorNames[inc-1] + ' Stop A',
					color: COLORS.WHITE,
					bgcolor: combineRgb(127, 0, 0),
				},
				steps: [
					{
						up: [
							{
								actionId: 'setStopA',
								options: {
									settype: 'id',
									id: inc
								}
							}
						],
						2000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
									actionId: 'recallStopA',
									options: {
										settype: 'id',
										id: inc
									},
								},
							],
						},
					}
				],
				feedbacks: [
					{
						feedbackId: 'StopAStatus',
						options: {
							id_mot: inc,
						},
						style: {
							bgcolor: COLORS.DARK_GREEN,
							color: COLORS.BLACK,
						},
					}
				]
			},
			presets['setStopB' + inc] = {
				category: 'Motors',
				type: 'button',
				name: motorNames[inc-1] + ' Stop B',
				style: {
					text: motorNames[inc-1] + ' Stop B',
					color: COLORS.WHITE,
					bgcolor: combineRgb(127, 0, 0),
					},
				steps: [
					{
						up: [
							{
								actionId: 'setStopB',
								options: {
									settype: 'id',
									id: inc
								}
							}
						],
						2000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
									actionId: 'recallStopB',
									options: {
										settype: 'id',
										id: inc
									},
								},
							],
						},
					}
				],
				feedbacks: [
					{
						feedbackId: 'StopBStatus',
						options: {
							id_mot: inc,
						},
						style: {
							bgcolor: COLORS.DARK_GREEN,
							color: COLORS.BLACK,
						},
					}
				]
			},
			presets['clearStops' + inc] = {
				category: 'Motors',
				type: 'button',
				name: 'Clear ' + motorNames[inc-1] + ' Stops',
				style: {
					text: 'Clear ' + motorNames[inc-1] + ' Stops',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					},
				steps: [
					{
						2000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
									actionId: 'clearStopsByAxis',
									options: {
										settype: 'id',
										id: inc
									}
								},
							],
						},
					}
				],
				feedbacks: [
					{
						style: {
							color: COLORS.WHITE,
							bgcolor: COLORS.RED,
						}
					}
				]
			}
		}

		presets.clearAllStops = {
			category: 'Motors',
			type: 'button',
			name: 'Clear All Stops',
			style: {
				text: 'Clear All Stops',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
				},
			steps: [
				{
					down: [

					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'clearAllStops',
							},
						],
					},
				}
			],
		},

		// ########################
		// ####### Presets #######
		// ########################

		presets.PresetHeader1 = {
			category: 'Presets',
			name: 'Smart Presets',
			type: 'text',
			text: 'These buttons use the Current Preset ID to Setup and Recall Presets'
		},

		presets.IncreasePstSetup = {
			category: 'Presets',
			type: 'button',
			name: 'Increase Preset ID',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetID',
							options: {
								direction: 1
							}
						}
					],
				}
			],
		},
		presets.smartIncreaseRun = {
			category: 'Presets',
			type: 'button',
			name: 'Increase RunTime',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetRunTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
				}
			],
		},
		presets.smartIncreaseRamp = {
			category: 'Presets',
			type: 'button',
			name: 'Increase RampTime',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_PURPLE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetRampTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
				}
			],
		},

		presets.PresetLineBreak1 = {
			category: 'Presets',
			name: '',
			type: 'text',
			text: ''
		},

		presets.curpstsetup = {
			category: 'Presets',
			type: 'button',
			name: 'Selected Preset',
			style: {
				text: 'Preset\\nID:\\n$(companion-module-emotimo-st4-3:CurrentPstSet)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						
					],
				},
			],
		},
		presets.curpstRunsetup = {
			category: 'Presets',
			type: 'button',
			name: 'Selected Preset Run',
			style: {
				text: 'Run:\\n$(companion-module-emotimo-st4-3:CurrentPstSetRun)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetRunTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},
		presets.curpstRampsetup = {
			category: 'Presets',
			type: 'button',
			name: 'Selected Preset Ramp',
			style: {
				text: 'Ramp:\\n$(companion-module-emotimo-st4-3:CurrentPstSetRamp)',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetRampTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},

		presets.PresetLineBreak2 = {
			category: 'Presets',
			name: '',
			type: 'text',
			text: ''
		},

		presets.DecreasePstSetup = {
			category: 'Presets',
			type: 'button',
			name: 'Decrease Preset ID',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetID',
							options: {
								direction: -1
							}
						}
					],
				}
			],
		},
		presets.smartDecreaseRun = {
			category: 'Presets',
			type: 'button',
			name: 'Decrease RunTime',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetRunTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
				}
			],
		},
		presets.smartDecreaseRamp = {
			category: 'Presets',
			type: 'button',
			name: 'Decrease RampTime',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_PURPLE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetRampTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
				}
			],
		},
		presets.recallSmart = {
			category: 'Presets',
			type: 'button',
			name: 'Preset Smart Recall',
			style: {
				text: 'Pre $(companion-module-emotimo-st4-3:CurrentPstSet)',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_RED,
				},
			steps: [
				{
					up: [
						{
							actionId: 'recallPset',
							options: {
								settype: 'smart',
							}
						}
					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'savePset',
								options: {
									settype: 'smart'
								},
								delay: 0,
							},
						],
					},
				},
			],
			feedbacks: [
				{
					feedbackId: 'SetPresetSmart',
					options: {
						
					},
					style: {
						bgcolor: COLORS.DARK_GREEN,
						color: COLORS.BLACK,
					},
				},
			]
		},

		presets.PresetHeader2 = {
			category: 'Presets',
			name: 'Rotary Encoders',
			type: 'text',
			text: 'These are only available for Surfaces that support Rotary Encoders (Ex. Streamdeck+)'
		},

		presets.PresetRunTimeRotary = {
			category: 'Presets',
			type: 'button',
			name: 'Preset Run Time Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Preset Run Time Rotary',
				color: COLORS.WHITE,
				bgcolor: COLORS.TEAL,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setPresetRunTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setPresetRunTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
					down: [
						{
							actionId: 'setPresetRunTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},
		presets.PresetRampTimeRotary = {
			category: 'Presets',
			type: 'button',
			name: 'Preset Ramp Time Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Preset Ramp Time Rotary',
				color: COLORS.WHITE,
				bgcolor: COLORS.TEAL,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setPresetRampTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setPresetRampTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
					down: [
						{
							actionId: 'setPresetRampTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		}

		for (let inc = 0; inc < 5; inc++) {
			presets['PresetHeaderHigh' + (inc+3)] = {
				category: 'Presets',
				name: 'Preset ' + inc,
				type: 'text',
				text: 'These are the buttons specific for Preset ' + inc
			},

			presets['increaseRunTime' + inc] = {
				category: 'Presets',
				type: 'button',
				name: 'Increase RunTime Preset ' + inc,
				style: {
					text: '⬆️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setPresetRunTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'up',
									ammount: 5
								}
							}
						],
					}
				],
			},
			presets['increaseRampTime' + inc] = {
				category: 'Presets',
				type: 'button',
				name: 'Increase RampTime Preset ' + inc,
				style: {
					text: '⬆️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setPresetRampTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'up',
									ammount: 5
								}
							}
						],
					}
				],
			},

			presets['PresetLineBreakHigh' + (inc+3)] = {
				category: 'Presets',
				name: '',
				type: 'text',
				text: ''
			},
			
			presets['Preset' + inc + 'RunTime'] = {
				category: 'Presets',
				type: 'button',
				name: 'Preset Run Time ' + inc,
				style: {
					text: 'Pst\\nRunT:\\n$(companion-module-emotimo-st4-3:Pst' + inc + 'RunT)',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
				},
				steps: [
					{
						down: [
							{
								actionId: 'setPresetRunTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'reset',
								}
							}
						]
					}
				],
			},
			presets['Preset' + inc + 'RampTime'] = {
				category: 'Presets',
				type: 'button',
				name: 'Preset Ramp Time ' + inc,
				style: {
					text: 'Pst\\nRampT:\\n$(companion-module-emotimo-st4-3:Pst' + inc + 'RampT)',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
				},
				steps: [
					{
						down: [
							{
								actionId: 'setPresetRampTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'reset',
								}
							}
						],
					},
				],
			},

			presets['PresetLineBreakMid' + (inc+3)] = {
				category: 'Presets',
				name: '',
				type: 'text',
				text: ''
			},

			presets['decreaseRunTime' + inc] = {
				category: 'Presets',
				type: 'button',
				name: 'Decrease RunTime Preset ' + inc,
				style: {
					text: '⬇️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setPresetRunTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'down',
									ammount: 5
								}
							}
						],
					}
				],
			},
			presets['decreaseRampTime' + inc] = {
				category: 'Presets',
				type: 'button',
				name: 'Decrease RampTime Preset ' + inc,
				style: {
					text: '⬇️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setPresetRampTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'down',
									ammount: 5
								}
							}
						],
					}
				],
			},

			presets['recallPreset' + inc] = {
				category: 'Presets',
				type: 'button',
				name: 'Preset ' + inc,
				style: {
					text: 'Pre ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_RED,
					},
				steps: [
					{
						down: [
						],
						up: [
							{
								actionId: 'recallPset',
								options: {
									settype: 'id',
									id: inc
								}
							}
						],
						2000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
									actionId: 'savePset',
									options: {
										settype: 'id',
										id: inc
									},
									delay: 0,
								},
							],
						},
					},
				],
				feedbacks: [
					{
						feedbackId: 'SetPreset',
						options: {
							presetNum: inc
						},
						style: {
							bgcolor: COLORS.DARK_GREEN,
							color: COLORS.BLACK,
						},
					},
				]
			},
			presets['PresetLineBreakLow' + (inc+3)] = {
				category: 'Presets',
				name: '',
				type: 'text',
				text: ''
			}
		}

		// ########################
		// ####	 Loops		####
		// ########################

		presets.IncreaseLpSetup = {
			category: 'Loops',
			type: 'button',
			name: 'Increase Loop ID',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopID',
							options: {
								direction: 1
							}
						}
					],
				}
			],
		},

		presets.smartIncreaseAPoint = {
			category: 'Loops',
			type: 'button',
			name: 'Increase Loop A Point',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopAPoint',
							options: {
								settype: 'smart',
								direction: 1
							}
						}
					],
				}
			],
		},
		presets.smartIncreaseBPoint = {
			category: 'Loops',
			type: 'button',
			name: 'Increase Loop B Point',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.TEAL,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopBPoint',
							options: {
								settype: 'smart',
								direction: 1
							}
						}
					],
				}
			],
		},

		presets.smartIncreaseRunLp = {
			category: 'Loops',
			type: 'button',
			name: 'Increase Loop RunTime',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopRunTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
				}
			],
		},
		presets.smartIncreaseRampLp = {
			category: 'Loops',
			type: 'button',
			name: 'Increase Loop RampTime',
			style: {
				text: '⬆️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_PURPLE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopRampTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 5
							}
						}
					],
				}
			],
		},

		presets.LineBreak2 = {
			category: 'Loops',
			name: '',
			type: 'text',
			text: ' '
		},

		presets.curLpsetup = {
			category: 'Loops',
			type: 'button',
			name: 'Selected Loop',
			style: {
				text: 'Loop\\nID:\\n$(companion-module-emotimo-st4-3:CurrentLpSet)',
				size: 18,
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [{}]
		},
		presets.curLpAPointsetup = {
			category: 'Loops',
			type: 'button',
			name: 'Selected Loop A Point',
			style: {
				text: 'Loop A Point:\\n$(companion-module-emotimo-st4-3:CurrentLpA)',
				size: 18,
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [{}],
		},
		presets.curLpBPointsetup = {
			category: 'Loops',
			type: 'button',
			name: 'Selected Loop B Point',
			style: {
				text: 'Loop B Point:\\n$(companion-module-emotimo-st4-3:CurrentLpB)',
				size: 18,
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [{}],
		},
		presets.curRunLp = {
			category: 'Loops',
			type: 'button',
			name: 'Selected Loop Run',
			style: {
				text: 'Loop Run:\\n$(companion-module-emotimo-st4-3:CurrentLpRun)',
				size: 18,
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopRunTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},
		presets.curRampLp = {
			category: 'Loops',
			type: 'button',
			name: 'Selected Loop Ramp',
			style: {
				text: 'Loop Ramp:\\n$(companion-module-emotimo-st4-3:CurrentLpRamp)',
				size: 18,
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopRampTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},

		presets.LineBreak3 = {
			category: 'Loops',
			name: '',
			type: 'text',
			text: ' '
		},

		presets.DecreaseLpSetup = {
			category: 'Loops',
			type: 'button',
			name: 'Decrease Loop ID',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_DARK_GREEN,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopID',
							options: {
								direction: -1
							}
						}
					],
				}
			],
		},
		presets.smartDecreaseAPoint = {
			category: 'Loops',
			type: 'button',
			name: 'Decrease Loop A Point',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopAPoint',
							options: {
								settype: 'smart',
								direction: -1
							}
						}
					],
				}
			],
		},
		presets.smartDecreaseBPoint = {
			category: 'Loops',
			type: 'button',
			name: 'Decrease Loop B Point',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.TEAL,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopBPoint',
							options: {
								settype: 'smart',
								direction: -1
							}
						}
					],
				}
			],
		},

		presets.smartDecreaseRunLp = {
			category: 'Loops',
			type: 'button',
			name: 'Decrease Loop RunTime',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopRunTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
				}
			],
		},
		presets.smartDecreaseRampLp = {
			category: 'Loops',
			type: 'button',
			name: 'Decrease Loop RampTime',
			style: {
				text: '⬇️',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_PURPLE,
				},
			steps: [
				{
					down: [
						{
							actionId: 'setLoopRampTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 5
							}
						}
					],
				}
			],
		},

		presets.recallLpSmart = {
			category: 'Loops',
			type: 'button',
			name: 'Loop Smart Recall',
			style: {
				text: 'Loop\\n$(companion-module-emotimo-st4-3:CurrentLpSet)\\nRecall',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_RED,
				},
			steps: [
				{
					up: [
						{
							actionId: 'recallLoop',
							options: {
								settype: 'smart',
							}
						}
					],
				},
			],
			feedbacks: [
				{
					feedbackId: 'LoopStatus',
					options: {},
					style: {
						bgcolor: COLORS.DARK_GREEN,
						color: COLORS.BLACK,
					},
				},
			]
		},

		presets.LineBreak4 = {
			category: 'Loops',
			name: '',
			type: 'text',
			text: ' '
		}

		for (let inc = 0; inc < 8; inc++) {
			presets['Loop' + inc + 'Recall'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop ' + inc + ' Recall',
				style: {
					text: 'Loop\\n' + inc + '\\nRecall',
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_RED,
				},
				steps: [
					{
						down: [
							{
								actionId: 'recallLoop',
								options: {
									settype: 'id',
									id: inc
								}
							}
						],
					},
				],
			}
		}

		presets.LoopEncoderHeader = {
			category: 'Loops',
			name: 'Rotary Encoders',
			type: 'text',
			text: 'These are only available for Surfaces that support Rotary Encoders (Ex. Streamdeck+)'
		},

		presets.LoopRunTimeRotary = {
			category: 'Loops',
			type: 'button',
			name: 'Loop Run Time Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Loop Run Time Rotary',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setLoopRunTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 1
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setLoopRunTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 1
							}
						}
					],
					down: [
						{
							actionId: 'setLoopRunTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},
		presets.LoopRampTimeRotary = {
			category: 'Loops',
			type: 'button',
			name: 'Loop Ramp Time Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Loop Ramp Time Rotary',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setLoopRampTime',
							options: {
								settype: 'smart',
								setopt: 'down',
								ammount: 1
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setLoopRampTime',
							options: {
								settype: 'smart',
								setopt: 'up',
								ammount: 1
							}
						}
					],
					down: [
						{
							actionId: 'setLoopRampTime',
							options: {
								settype: 'smart',
								setopt: 'reset'
							}
						}
					],
				},
			],
		},
		presets.LoopAPointRotary = {
			category: 'Loops',
			type: 'button',
			name: 'Loop A Point Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Loop A Point Rotary',
				size: '14',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setLoopAPoint',
							options: {
								settype: 'smart',
								direction: -1
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setLoopAPoint',
							options: {
								settype: 'smart',
								direction: 1
							}
						}
					],
				},
			],
		},
		presets.LoopBPointRotary = {
			category: 'Loops',
			type: 'button',
			name: 'Loop B Point Rotary',
			options: { rotaryActions: true },
			style: {
				text: 'Loop B Point Rotary',
				size: '14',
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_LIGHT_BLUE,
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'setLoopBPoint',
							options: {
								settype: 'smart',
								direction: -1
							}
						}
					],
					rotate_right: [
						{
							actionId: 'setLoopBPoint',
							options: {
								settype: 'smart',
								direction: 1
							}
						}
					],
				},
			],
		}

		for (let inc = 0; inc < 8; inc++) {
			presets['Loop' + inc + 'HighLine'] = {
				category: 'Loops',
				name: 'Loop ' + inc,
				type: 'text',
				text: 'Setup and Recall Buttons for Loop ' + inc
			},

			presets['increaseLpRunTime' + inc] = {
				category: 'Loops',
				type: 'button',
				name: 'Increase RunTime Loop ' + inc,
				style: {
					text: '⬆️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopRunTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'up',
									ammount: 5
								}
							}
						],
					}
				],
			},
			presets['increaseLpRampTime' + inc] = {
				category: 'Loops',
				type: 'button',
				name: 'Increase RampTime Loop ' + inc,
				style: {
					text: '⬆️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopRampTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'up',
									ammount: 5
								}
							}
						],
					}
				],
			},

			presets['Loop' + inc + 'APointInc'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop ' + inc + ' A Point Inc',
				style: {
					text: '⬆️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopAPoint',
								options: {
									settype: 'id',
									id: inc,
									direction: 1
								}
							}
						],
					}
				],
			},
			presets['Loop' + inc + 'BPointInc'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop ' + inc + ' B Point Inc',
				style: {
					text: '⬆️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopBPoint',
								options: {
									settype: 'id',
									id: inc,
									direction: 1
								}
							}
						],
					}
				],
			},

			presets['Loop' + inc + 'LineBreak'] = {
			category: 'Loops',
			name: '',
			type: 'text',
			text: ' '
			},

			presets['Loop' + inc + 'RunTime'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop Run Time ' + inc,
				style: {
					text: 'Loop\\nRunT:\\n$(companion-module-emotimo-st4-3:Lp' + inc + 'RunT)',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
				},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopRunTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'reset'
								}
							}
						],
					},
				],
			},
			presets['Loop' + inc + 'RampTime'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop Ramp Time ' + inc,
				style: {
					text: 'Loop\\nRampT:\\n$(companion-module-emotimo-st4-3:Lp' + inc + 'RampT)',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
				},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopRampTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'reset'
								}
							}
						],
					},
				],
			},

			presets['Loop' + inc + 'APoint'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop A Point ' + inc,
				style: {
					text: 'Loop\\nA Point:\\n$(companion-module-emotimo-st4-3:Lp' + inc + 'APoint)',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
				},
				steps: [{}]
			},
			presets['Loop' + inc + 'BPoint'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop B Point ' + inc,
				style: {
					text: 'Loop\\nB Point:\\n$(companion-module-emotimo-st4-3:Lp' + inc + 'BPoint)',
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
				},
				steps: [{}],
			},

			presets['Loop' + inc + 'LowLineBreak'] = {
				category: 'Loops',
				name: '',
				type: 'text',
				text: ' '
			},

			presets['decreaseLpRunTime' + inc] = {
				category: 'Loops',
				type: 'button',
				name: 'Decrease RunTime Loop ' + inc,
				style: {
					text: '⬇️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopRunTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'down',
									ammount: 5
								}
							}
						],
					}
				],
			},
			presets['decreaseLpRampTime' + inc] = {
				category: 'Loops',
				type: 'button',
				name: 'Decrease RampTime Loop ' + inc,
				style: {
					text: '⬇️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopRampTime',
								options: {
									settype: 'id',
									id: inc,
									setopt: 'down',
									ammount: 5
								}
							}
						],
					}
				],
			},

			presets['Loop' + inc + 'APointDec'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop ' + inc + ' A Point Dec',
				style: {
					text: '⬇️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
					},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopAPoint',
								options: {
									settype: 'id',
									id: inc,
									direction: -1
								}
							}
						],
					}
				],
			},
			presets['Loop' + inc + 'BPointDec'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop ' + inc + ' B Point Dec',
				style: {
					text: '⬇️ ' + inc,
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_BLUE,
				},
				steps: [
					{
						down: [
							{
								actionId: 'setLoopBPoint',
								options: {
									settype: 'id',
									id: inc,
									direction: -1
								}
							}
						],
					}
				],
			},

			presets['Loop' + inc + 'Recall2'] = {
				category: 'Loops',
				type: 'button',
				name: 'Loop ' + inc + ' Recall',
				style: {
					text: 'Loop\\n' + inc + '\\nRecall',
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_RED,
				},
				steps: [
					{
						down: [
							{
								actionId: 'recallLoop',
								options: {
									settype: 'id',
									id: inc
								}
							}
						],
					},
				],
			}
		}

		// ########################
		// ####	 Other		####
		// ########################

		presets.rsHome = {
			category: 'Other',
			type: 'button',
			name: 'Center RS',
			style: {
				text: 'Center RS',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'homeRS',
							options: {
								id_end: '\n'
							}
						}
					],
				},
			],
		},
		presets.calibrateTN = {
			category: 'Other',
			type: 'button',
			name: 'Calibrate TN Motor',
			style: {
				text: 'Cal. TN Motor',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'calibrateTNMotor',
							options: {
							id: 5
							}
						}
					],
				},
			],
		},
		presets.calibrateAllTN = {
			category: 'Other',
			type: 'button',
			name: 'Calibrate All TN',
			style: {
				text: 'Cal. All TN',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'calibrateAllTN'
						}
					],
				},
			],
		},
		presets.zeroMotor = {
			category: 'Other',
			type: 'button',
			name: 'Zero Motors',
			style: {
				text: 'Zero Motors',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'zeroMotors'
						}
					],
				},
			],
		},

		// ########################
		// #### UI Navigation ####
		// ########################

		presets.VirtUp = {
			category: 'UI Navigation',
			type: 'button',
			name: 'Nav Up',
			style: {
				text: 'Up\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'virtualInput',
							options: {
								vbutton: 1,
							}
						}
					],
				},
			],
		},
		presets.VirtRight = {
			category: 'UI Navigation',
			type: 'button',
			name: 'Nav Right',
			style: {
				text: 'Right\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'virtualInput',
							options: {
								vbutton: 2,
							}
						}
					],
				},
			],
		},
		presets.VirtDown = {
			category: 'UI Navigation',
			type: 'button',
			name: 'Nav Down',
			style: {
				text: 'Down\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'virtualInput',
							options: {
								vbutton: 3,
							}
						}
					],
				},
			],
		},
		presets.VirtLeft = {
			category: 'UI Navigation',
			type: 'button',
			name: 'Nav Left',
			style: {
				text: 'Left\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'virtualInput',
							options: {
								vbutton: 4,
							}
						}
					],
				},
			],
		},
		presets.VirtEnter = {
			category: 'UI Navigation',
			type: 'button',
			name: 'Nav Enter',
			style: {
				text: 'Select\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'virtualInput',
							options: {
								vbutton: 0,
							}
						},
					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'virtualInput',
								options: {
									vbutton: 6,
								},
								delay: 0,
							},
						],
					},
				},
			],
		},
		presets.VirtBack = {
			category: 'UI Navigation',
			type: 'button',
			name: 'Nav Back',
			style: {
				text: 'Escape\\n',
				size: '18',
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'virtualInput',
							options: {
								vbutton: 5,
							}
						}
					],
				},
			],
		},


		this.setPresetDefinitions(presets);
	}
}