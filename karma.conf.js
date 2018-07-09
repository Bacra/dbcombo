'use strict';

var commonConfig = require('karma-config-brcjs');

module.exports = function(config)
{
	commonConfig(config);

	config.set({pkg: require('./package.json')});

	if (process.argv[5] == 'benchmark')
	{
		config.set(
		{
			basePath: 'benchmark/',
			files: ['benchmark.js'],
			frameworks: ['browserify'],
			// 不要并发，减少浏览器之间的相互影响
			concurrency: 1,
			browserify: {debug: true},
			preprocessors:
			{
				'benchmark.js': ['browserify']
			},
		});
	}
	else
	{
		config.set(
		{
			files:
			[
				'test_*.js',
				'browser/init-seajs.js',
				'browser/test_*.js',
				{pattern: 'browser/source/**/*', included: false, served: true},
			],
			preprocessors:
			{
				'**/test_*.js': ['browserify'],
				'browser/init-seajs.js': ['browserify'],
			},
		});
	}
};
