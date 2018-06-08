'use strict';

// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
var browsers =
{
	sl_chrome:
	{
		browserName	: 'chrome',
		platform	: 'Windows 10',
		version		: 'beta'
	},
	sl_firefox:
	{
		browserName	: 'firefox',
		platform	: 'Windows 10',
		version		: 'beta'
	},
	sl_safari:
	{
		browserName	: 'safari',
		platform	: 'macOS 10.13',
		version		: '11.1'
	},
	sl_ie8:
	{
		browserName	: 'internet explorer',
		platform	: 'Windows 7',
		version		: '8'
	},
	sl_ie9:
	{
		browserName	: 'internet explorer',
		platform	: 'Windows 7',
		version		: '9'
	},
	sl_ie11:
	{
		browserName	: 'internet explorer',
		platform	: 'Windows 10',
		version		: '11'
	},
	sl_edge:
	{
		browserName	: 'MicrosoftEdge',
		platform	: 'Windows 10',
		version		: '16'
	},
	sl_ios_safari:
	{
		browserName			: 'Safari',
		deviceName			: 'iPhone Simulator',
		deviceOrientation	: 'portrait',
		platformName		: 'iOS'
	},
	sl_android:
	{
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
