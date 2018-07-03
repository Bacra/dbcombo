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

	config.set({browsers: browsers});
};
