'use strict';

var os = require('os');

module.exports = function(config)
{
	var browsers = ['Chrome', 'Firefox'];
	var platform = os.platform();

	if (platform == 'win32')
		browsers.push('IE');
	else if (platform == 'darwin')
		browsers.push('Safari');

	return {
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		// browsers: ['Chrome'],
		browsers: browsers,


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
	};
};
