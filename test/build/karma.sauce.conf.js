'use strict';

var pkg = require('../../package.json');
var browsers = require('./sl_browsers.js');

module.exports = function(config, browserArr)
{
	// master 也运行
	// if (process.env.TRAVIS_BRANCH && process.env.TRAVIS_BRANCH != 'sauce-runner')
	// {
	// 	console.log('Run sauce only sauce-runner branch.');
	// 	process.exit();
	// }

	if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)
	{
		console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
		process.exit(1);
	}

	var timeout = 300000;
	var buildId = process.env.TRAVIS_JOB_NUMBER || process.env.SAUCE_BUILD_ID || Date.now();
	var taskName = pkg.name+'_'+pkg.version;

	var data =
	{
		// port			: 4445,
		browsers		: browserArr,
		retryLimit		: 2,
		concurrency		: 5,
		customLaunchers	: browsers.list,
		// Increase timeout in case connection in CI is slow
		captureTimeout	: timeout,
		browserNoActivityTimeout: timeout,
		reporters: process.env.CI
			? ['mocha', 'dots', 'saucelabs'] // avoid spamming CI output
			: ['mocha', 'progress', 'saucelabs'],

		sauceLabs:
		{
			build				: taskName+'_'+buildId,
			public				: 'public',
			testName			: taskName,
			tunnelIdentifier	: taskName+'_'+buildId,

			// commandTimeout		: 300,
			// idleTimeout			: 90,
			// maxDuration			: 1800,

			recordScreenshots	: false,
			recordVideo			: false,

			// @see https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options
			options:
			{
				// recordScreenshots	: true,
				// recordVideo			: true,
				videoUploadOnPass	: false,
				recordLogs			: true,
				captureHtml			: false,
				// priority			: 0,
				extendedDebugging	: true,
				// webdriverRemoteQuietExceptions: false,
			},


			// customData: {},
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

	// https://github.com/karma-runner/karma-sauce-launcher/issues/73
	if (process.env.TRAVIS_JOB_NUMBER)
	{
		delete data.sauceLabs.tunnelIdentifier;
		data.startConnect = false;
	}

	return data;
};
