'use strict';

var path = require('path');
function fixMocha(files)
{
	files.unshift(
	{
		pattern: path.resolve('./node_modules/core-js/client/core.js'),
		included: true,
		served: true,
		watched: false
	});
}

fixMocha.$inject = ['config.files'];

module.exports = function(config)
{
	config.set(
	{
		// mocha不支持ie9后，需要core-js
		frameworks: ['mocha', 'browserify', 'inline-mocha-fix'],
		plugins:
		[
			'karma-*',
			{
				'framework:inline-mocha-fix': ['factory', fixMocha]
			}
		],
	});
};
