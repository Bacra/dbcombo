'use strict';

// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
var browsers =
{
	sl_chrome:
	{
		base		: 'SauceLabs',
		browserName	: 'chrome',
		platform	: 'Windows 10',
		version		: 'beta'
	},
	sl_firefox:
	{
		base		: 'SauceLabs',
		browserName	: 'firefox',
		platform	: 'Windows 10',
		version		: 'beta'
	},
	sl_safari:
	{
		base		: 'SauceLabs',
		browserName	: 'safari',
		platform	: 'macOS 10.13',
		version		: '11.1'
	},
	sl_ie8:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows 7',
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
		platform	: 'Windows 10',
		version		: '11'
	},
	sl_edge:
	{
		base		: 'SauceLabs',
		browserName	: 'MicrosoftEdge',
		platform	: 'Windows 10',
		version		: '16'
	},
	sl_ios_safari:
	{
		base				: 'SauceLabs',
		browserName			: 'Safari',
		deviceName			: 'iPhone Simulator',
		deviceOrientation	: 'portrait',
		platformName		: 'iOS'
	},
	sl_android:
	{
		base				: 'SauceLabs',
		browserName			: 'Android Emulator',
		deviceOrientation	: 'portrait',
	}
};



var groups =
{
	ie: [
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
		'sl_ios_safari',
		'sl_android'
	],
	sauce: Object.keys(browsers)
};

module.exports =
{
	browsers: browsers,
	groups: groups,
};
