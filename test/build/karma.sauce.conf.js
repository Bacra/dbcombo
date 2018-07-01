'use strict';

var pkg = require('../../package.json');
var browsers = require('./sl_browsers.js');

module.exports = function(config, browserGroup)
{
	if (process.env.TRAVIS_BRANCH && process.env.TRAVIS_BRANCH != 'sauce-runner')
	{
		console.log('Run sauce only sauce-runner branch.');
		process.exit();
	}

	if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)
	{
		console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
		process.exit(1);
	}


	var browserArr = browsers.groups[browserGroup];
	if (!browserArr || !browserArr.length)
	{
		var browserKey = 'sl_'+browserGroup;
		if (browsers.browsers[browserKey])
		{
			browserArr = [browserKey];
		}
		else
		{
			console.log('undefined browser group, %s', browserGroup);
			process.exit(1);
		}
	}

	var timeout = browserGroup == 'mobile' || browserGroup == 'sauce' ? 300000 : 120000;
	var buildId = process.env.TRAVIS_JOB_NUMBER || process.env.SAUCE_BUILD_ID || Date.now();

	return {
		// port			: 4445,
		browsers		: browserArr,
		singleRun		: true,
		retryLimit		: 2,
		concurrency		: 5,
		customLaunchers	: browsers.browsers,
		// Increase timeout in case connection in CI is slow
		captureTimeout	: timeout,
		browserNoActivityTimeout: timeout,
		reporters: process.env.CI
			? ['dots', 'saucelabs'] // avoid spamming CI output
			: ['progress', 'saucelabs'],

		sauceLabs:
		{
			build				: browserGroup+'_'+buildId,
			public				: 'public',
			testName			: pkg.name,
			recordScreenshots	: false,
			connectOptions:
			{
				// port: 5757,
				// logfile: 'sauce_connect.log',
				'no-ssl-bump-domains': 'all',

				// Log output from the `sc` process to stdout?
				verbose: true,
				// Enable verbose debugging (optional)
				verboseDebugging: true,
				// Together with verbose debugging will output HTTP headers as well (optional)
				vv: true,
			},
		}
	};
};
