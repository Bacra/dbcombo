var sea = require('seajs/dist/sea-debug.js');
var seajs = module.exports = window.seajs = sea.seajs;
window.define = sea.define;
seajs.config({debug: true});

// 增加combo插件
require('../../src/seajs-plugin');

var souceInfo = require('./source/seajs-plugin-src/source.map.js');
seajs.config(
{
	base: '/base/browser/source/seajs-plugin-src/',
	cwd: '/base/browser/source/seajs-plugin-src/',
	DBComboFile: 'db.js',
	DBComboDelayRequest: true,
	DBComboFileIndex: function(file)
	{
		if (isNaN(file))
		{
			var key = file && file.replace(/^.*\//, '');
			var info = souceInfo.map[key];
			console.log('inde file key, %s => %s, info:%o', file, key, info);
			return info;
		}
		else
		{
			return souceInfo.arr[file];
		}
	}
});
