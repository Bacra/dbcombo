var baseConfig	= require('./karma.conf.base.js');
var extend		= require('extend');
var pkg			= require('./package.json');

module.exports = function(config)
{
	if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)
	{
		console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
		process.exit(1)
	}

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
		sl_ie_6:
		{
			base		: 'SauceLabs',
			browserName	: 'internet explorer',
			platform	: 'Windows XP',
			version		: '6'
		},
		sl_ie_7:
		{
			base		: 'SauceLabs',
			browserName	: 'internet explorer',
			platform	: 'Windows XP',
			version		: '7'
		},
		sl_ie_8:
		{
			base		: 'SauceLabs',
			browserName	: 'internet explorer',
			platform	: 'Windows XP',
			version		: '8'
		},
		sl_ie_9:
		{
			base		: 'SauceLabs',
			browserName	: 'internet explorer',
			platform	: 'Windows 7',
			version		: '9'
		},
		sl_ie_11:
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

	config.set(extend(baseConfig,
	{
		port: 4443,
		sauceLabs:
		{
			'public'			: 'public',
			testName			: pkg.name,
			recordScreenshots	: false,
			connectOptions:
			{
				port	: 5757,
				logfile	: 'sauce_connect.log'
			},
		},

		// Increase timeout in case connection in CI is slow
		captureTimeout	: 120000,
		customLaunchers	: customLaunchers,
		browsers		: Object.keys(customLaunchers),
		singleRun		: true
	}));
};
