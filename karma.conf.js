// npm run test-e2e Chrome
// npm run test-e2e sl_dev
// npm run test-e2e sl_pc

'use strict';

// Karma configuration
var debug = require('debug')('dbcombo-client:karma.conf');
var extend = require('extend');
var baseConfig = require('./test/build/karma.base.conf.js');
var osConfig = require('./test/build/karma.os.conf.js');
var sauceConfig = require('./test/build/karma.sauce.conf.js');
var browsers = require('./test/build/sl_browsers.js');

module.exports = function(config)
{
	var key = process.argv[4];
	var base = baseConfig(config);
	var custom = {};

	debug('karma key:%s', key);

	if (key == 'travis')
	{
		key = process.env.TRAVIS_BRANCH == 'master'
			&& process.env.TRAVIS_EVENT_TYPE != 'cron' ? 'sl_chrome' : 'sauce';
	}

	if (browsers.groups[key])
		custom = sauceConfig(config, browsers.groups[key]);
	else if (browsers.list[key])
		custom = sauceConfig(config, [key]);
	else if (!key)
		custom = osConfig(config);
	else
		custom.browsers = key.split(',');

	custom = extend({}, base, custom);

	if (process.argv[5] == 'benchmark')
	{
		custom.basePath = 'benchmark/';
		custom.files = ['benchmark.js'];
		custom.frameworks = ['browserify'];
		// 不要并发，减少浏览器之间的相互影响
		custom.concurrency = 1;

		// custom.frameworks = ['benchmark'];
		// custom.reporters = ['benchmark'];
		custom.preprocessors =
		{
			'benchmark.js': ['browserify']
		};
		custom.browserify =
		{
			debug: true,
		};
	}

	config.set(custom);
};
