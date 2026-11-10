const { Regex } = require('@companion-module/base')

const { MODELS } = require('./models.js')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'Controls Spectrum ST4, ST4.3, Studio, and SA2.6 Conductor over TCP.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 4,
				regex: Regex.IP.replace(/\/$/, '|^$/'),
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
				id: 'model',
				label: 'Select Your Camera Model',
				width: 6,
				default: MODELS[0].id,
				choices: MODELS,
				minChoicesForSearch: 5,
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
			},
			{
				type: 'checkbox',
				id: 'fetch',
				label: 'Fetch Presets, Motor Performance, and Virtual Stops on Connect',
				width: 10,
				default: true,
			},
			{
				type: 'static-text',
				id: 'startupPstAmountInfo',
				width: 12,
				label: 'Startup Preset Fetch',
				value: 'Requests the first X preset IDs. Set to 0 to skip preset requests. Presets with default values may not appear until saved.',
				isVisible: (config) => !!config.fetch
			},
			{
				type: 'number',
				id: 'startupPstAmount',
				label: 'Presets to Fetch',
				width: 4,
				default: 15,
				min: 0,
				max: 128,
				step: 1,
				isVisible: (config) => !!config.fetch,
			},
			{
				type: 'static-text',
				id: 'intervalInfo',
				width: 12,
				label: 'Update Interval',
				value: 'Requests updated motor positions at the specified interval. Default: 5000 ms. Use 2000 ms for more frequent updates. Set to 0 to disable position polling; connection keepalive remains active.',
			},
			{
				type: 'number',
				id: 'interval',
				label: 'Position Polling Interval (ms)',
				width: 4,
				default: 5000,
				min: 0,
				max: 60000,
				step: 500,
			},

			// ########################
			// ## Custom motor Names ##
			// ########################
			// {
			// 	type: 'checkbox',
			// 	id: 'customNames',
			// 	label: 'Overwrite the default motor names with custom ones. Leave blank for default. Only Available for Spectrum ST4',
			// 	width: 10,
			// 	default: false,
			// 	isVisible: (config) => config.model === 'Spectrum ST4',
			// },
			// {
			// 	type: 'textinput',
			// 	id: 'customNamePan',
			// 	label: 'Pan:',
			// 	width: 4,
			// 	default: '',
			// 	isVisible: (config) => !!config.customNames && config.model === 'Spectrum ST4',
			// },
			// {
			// 	type: 'textinput',
			// 	id: 'customNameTilt',
			// 	label: 'Tilt:',
			// 	width: 4,
			// 	default: '',
			// 	isVisible: (config) => !!config.customNames && config.model === 'Spectrum ST4',
			// },
			// {
			// 	type: 'textinput',
			// 	id: 'customNameM3',
			// 	label: 'M3:',
			// 	width: 4,
			// 	default: '',
			// 	isVisible: (config) => !!config.customNames && config.model === 'Spectrum ST4',
			// },
			// {
			// 	type: 'textinput',
			// 	id: 'customNameM4',
			// 	label: 'M4:',
			// 	width: 4,
			// 	default: '',
			// 	isVisible: (config) => !!config.customNames && config.model === 'Spectrum ST4',
			// },
		]
	}
}