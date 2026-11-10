
module.exports = {
	MODELS: [
		{ id: 'Spectrum ST4', series: 'ST4', label: 'Spectrum ST4' },
		{ id: 'Spectrum ST4.3', series: 'ST4.3', label: 'Spectrum ST4.3' },
		{ id: 'Spectrum Studio', series: 'ST4.3', label: 'Spectrum Studio' },
		{ id: 'SA2.6 Conductor', series: 'SA2.6', label: 'SA2.6 Conductor' },
		{ id: 'Other', series: 'Other', label: 'Other Cameras' }
	],
	QUERY_CAPABILITIES: {
		'Spectrum ST4': {
			performance: [1, 2, 3, 4],
			stops: [1, 2, 3, 4],
		},
		'Spectrum ST4.3': {
			performance: [1, 2, 3, 4],
			stops: [1, 2, 3, 4, 5, 6, 7],
		},
		'Spectrum Studio': {
			performance: [1, 2, 3, 4],
			stops: [1, 2, 3, 4, 5, 6, 7],
		},
		'SA2.6 Conductor': {
			performance: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			stops: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		},
		'Other': {
			performance: [],
			stops: [],
		},
	},
}
