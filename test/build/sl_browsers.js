'use strict';

var _ = require('lodash');

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
	sl_chrome46:
	{
		base		: 'SauceLabs',
		browserName	: 'chrome',
		platform	: 'Windows 7',
		version		: '46',
	},
	sl_chrome_mac:
	{
		base		: 'SauceLabs',
		browserName	: 'chrome',
		// platform	: 'macOS',
		platform	: 'OS X 10.10',
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
	sl_ie9:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows 7',
		version		: '9'
	},
	sl_ie10:
	{
		base		: 'SauceLabs',
		browserName	: 'internet explorer',
		platform	: 'Windows 8',
		version		: '10'
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
		'sl_ie9',
		'sl_ie10',
		'sl_ie11'
	],


	sl_pc:
	[
		'sl_chrome',
		'sl_chrome46',
		'sl_firefox',
		'sl_edge',
		'sl_ie'
	],
	sl_mac:
	[
		'sl_safari',
		'sl_chrome_mac'
	],
	sl_mobile:
	[
		'sl_ios_safari',
		'sl_android'
	],
};

groups.sauce = [].concat(
	// groups.sl_ie,
	groups.sl_pc,
	groups.sl_mac,
	groups.sl_mobile
);

groups.sauce = _.uniq(groups.sauce);

module.exports =
{
	list: browsers,
	groups: groups,
};
