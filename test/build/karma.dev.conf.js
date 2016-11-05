module.exports = function(config)
{
	return {
		autoWatch: true,
		singleRun: false,
		concurrency: Infinity,
		logLevel: config.LOG_ERROR,
		browsers: ['Chrome'],
	};
}
