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
	sl_android51:
	{
		base		: 'SauceLabs',
		browserName	: 'android',
		version		: '5.1'
	}
};



var groups =
{
	ie: [
		// 'sl_ie6',
		// 'sl_ie7',
		// 'sl_ie8',
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
		'sl_android51'
	],
	sauce: Object.keys(browsers)
};

module.exports =
{
	browsers: browsers,
	groups: groups,
};
