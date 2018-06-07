'use strict';

// Karma configuration
var extend = require('extend');
var baseConfig = require('./test/build/karma.base.conf.js');
var osConfig = require('./test/build/karma.os.conf.js');
var devConfig = require('./test/build/karma.dev.conf.js');
var sauceConfig = require('./test/build/karma.sauce.conf.js');
var browsers = require('./test/build/sl_browsers.js');

module.exports = function(config)
{
	var key = process.argv[4];
	var base = baseConfig(config);
	var custom;

	if (key == 'dev')
		custom = devConfig(config);
	else if (browsers.groups[key])
		custom = sauceConfig(config, key);
	else
		custom = osConfig(config);

	custom = extend({}, base, custom);

	if (process.argv[5] == 'benchmark')
	{
		custom.basePath = 'benchmark/';
		custom.files = ['benchmark.js'];
		custom.frameworks = [];
		// 不要并发，减少浏览器之间的相互影响
		custom.concurrency = 1;

		// custom.frameworks = ['benchmark'];
		// custom.reporters = ['benchmark'];
		custom.webpack = require('./test/build/webpack.base.conf.js');
		custom.preprocessors =
		{
			'benchmark.js': ['webpack']
		};
	}

	config.set(custom);
};
