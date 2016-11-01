// Karma configuration
var extend = require('extend');
var baseConfig = require('./test/build/karma.base.conf.js');
var osConfig = require('./test/build/karma.os.conf.js');
var sauceConfig = require('./test/build/karma.sauce.conf.js');

module.exports = function(config)
{
	var key = process.argv[4];
	var base = baseConfig(config);
	var custom = key ? sauceConfig(config) : osConfig(config);

	config.set(extend({}, base, custom));
};
