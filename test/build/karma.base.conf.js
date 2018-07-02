'use strict';

module.exports = function(config)
{
	return {
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: 'test/',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'browserify'],


		// list of files / patterns to load in the browser
		files:
		[
			'test_*.js',
			'browser/init-seajs.js',
			'browser/test_*.js',
			{pattern: 'browser/source/**/*', included: false, served: true},
		],


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors:
		{
			'**/test_*.js': ['browserify'],
			'browser/init-seajs.js': ['browserify'],
		},

		browserify:
		{
			debug: true,
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha', 'progress'],


		// web server port
		// port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
	};
};
