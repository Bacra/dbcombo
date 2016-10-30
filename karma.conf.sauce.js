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
	}
};


var browserGroups =
{
	ie: ['ie6', 'ie7', 'ie8', 'ie9', 'ie11'],
	pc: ['chrome', 'firefox', 'edge'],
	mac: ['safari'],
	mobile: [],
};


module.exports = function(config)
{
	if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)
	{
		console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
		process.exit(1)
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

	config.set(extend(baseConfig,
	{
		port			: 4443,
		browsers		: browsers,
		singleRun		: true,
		customLaunchers	: customLaunchers,
		// Increase timeout in case connection in CI is slow
		captureTimeout	: timeout,
		browserNoActivityTimeout: timeout,

		sauceLabs:
		{
			public				: 'public',
			testName			: pkg.name,
			recordScreenshots	: false,
			connectOptions:
			{
				port	: 5757,
				logfile	: 'sauce_connect.log'
			},
		}
	}));
};
