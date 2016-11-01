var baseConfig	= require('./karma.conf.base.js');
var extend		= require('extend');
var pkg			= require('./package.json');

// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
var customLaunchers =
{
	sl_chrome:
	{
		base		: 'SauceLabs',
		browserName	: 'chrome',
		platform	: 'Windows 10',
		version		: '35'
	},
	sl_firefox:
	{
		base		: 'SauceLabs',
		browserName	: 'firefox',
		platform	: 'Windows 10',
		version		: '35'
	},
	sl_safari:
	{
		base		: 'SauceLabs',
		browserName	: 'safari',
		platform	: 'OS X 10.11',
		version		: '10'
	},
	sl_ie6:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows XP',
		version		: '6'
	},
	sl_ie7:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows XP',
		version		: '7'
	},
	sl_ie8:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows XP',
		version		: '8'
	},
	sl_ie9:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows 7',
		version		: '9'
	},
	sl_ie11:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows 8.1',
		version		: '11'
	},
	sl_edge:
	{
		base		: 'SauceLabs',
		browserName	: 'MicrosoftEdge',
		platform	: 'Windows 10',
		version		: '14'
	},
	sl_ios_safari8:
	{
		base		: 'SauceLabs',
		browserName	: 'iphone',
		version		: '8.4'
	},
	sl_ios_safari9:
	{
		base		: 'SauceLabs',
		browserName	: 'iphone',
		version		: '9.3'
	},
	sl_android42:
	{
		base		: 'SauceLabs',
		browserName	: 'android',
		version		: '4.2'
	},
	sl_android51:
	{
		base		: 'SauceLabs',
		browserName	: 'android',
		version		: '5.1'
	}
};


var browserGroups =
{
	ie: [
		'sl_ie6',
		'sl_ie7',
		'sl_ie8',
		'sl_ie9',
		'sl_ie11'
	],
	pc: [
		'sl_chrome',
		'sl_firefox',
		'sl_edge'
	],
	mac: ['sl_safari'],
	mobile: [
		'sl_ios_safari8',
		'sl_ios_safari9',
		'sl_android42',
		'sl_android51'
	],
};


module.exports = function(config)
{
	if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)
	{
		console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
		process.exit(1);
	}

	var browserGroup = process.argv[4] || 'pc';
	var browsers = browserGroups[browserGroup];
	if (!browsers || !browsers.length)
	{
		var browserKey = 'sl_'+browserGroup;
		if (customLaunchers[browserKey])
		{
			browsers = [browserKey];
		}
		else
		{
			console.log('undefined browser group, %s', browserGroup);
			process.exit(1);
		}
	}

	var timeout = browserGroup == 'mobile' ? 120000 : 300000;
	var buildId = process.env.TRAVIS_JOB_NUMBER || process.env.SAUCE_BUILD_ID || Date.now();

	var customConfig = extend(baseConfig,
	{
		// port			: 4445,
		browsers		: browsers,
		singleRun		: true,
		retryLimit		: 1,
		customLaunchers	: customLaunchers,
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
				port	: 5757,
				logfile	: 'sauce_connect.log'
			},
		}
	});

	// delete customConfig.port;
	config.set(customConfig);
};
