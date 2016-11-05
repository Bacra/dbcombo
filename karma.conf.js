// Karma configuration
var extend = require('extend');
var baseConfig = require('./test/build/karma.base.conf.js');
var osConfig = require('./test/build/karma.os.conf.js');
var devConfig = require('./test/build/karma.dev.conf.js');
var sauceConfig = require('./test/build/karma.sauce.conf.js');
var browsers = require('./test/build/sl_browsers.js');

module.exports = function(config)
{
	var key = process.argv[4];
	var base = baseConfig(config);
	var custom;

	if (key == 'dev')
		custom = devConfig(config);
	else if (browsers.groups[key])
		custom = sauceConfig(config);
	else
		custom = osConfig(config);

	config.set(extend({}, base, custom));
};
