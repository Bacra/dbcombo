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
	},
	sl_firefox:
	{
		base		: 'SauceLabs',
		browserName	: 'firefox',
		platform	: 'Windows 10',
	},
	sl_safari:
	{
		base		: 'SauceLabs',
		browserName	: 'safari',
		// platform	: 'macOS',
		platform	: 'OS X 10.10',
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
	sl_ie:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows 10',
	},
	sl_edge:
	{
		base		: 'SauceLabs',
		browserName	: 'MicrosoftEdge',
		platform	: 'Windows 10',
	},
	sl_ios_safari:
	{
		// base				: 'SauceLabs',
		// browserName			: 'Safari',
		// deviceName			: 'iPhone Simulator',
		// deviceOrientation	: 'portrait',
		// platformName		: 'iOS'

		base		: 'SauceLabs',
		browserName	: 'iphone',
		version		: '10.3'
	},
	sl_android:
	{
		// base				: 'SauceLabs',
		// browserName			: 'Android Emulator',
		// deviceOrientation	: 'portrait',
		base		: 'SauceLabs',
		browserName	: 'android',
		version		: '6.0'
	}
};



var groups =
{
	sl_ie:
	[
		'sl_ie8',
		'sl_ie9',
		'sl_ie11'
	],
	sl_dev: ['sl_chrome'],


	sl_pc:
	[
		'sl_chrome',
		'sl_firefox',
		'sl_edge',
		'sl_ie'
	],
	sl_mac: ['sl_safari'],
	sl_mobile:
	[
		'sl_ios_safari',
		'sl_android'
	],
};

groups.sauce = [].concat(groups.sl_pc, groups.sl_mac, groups.sl_mobile);

module.exports =
{
	browsers: browsers,
	groups: groups,
};
