module.exports = {
	globDirectory: 'wwwroot/',
	globPatterns: [
		'**/*.{bin,json}'
	],
	swDest: 'wwwroot/sw.js',
	maximumFileSizeToCacheInBytes: 5000000,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};