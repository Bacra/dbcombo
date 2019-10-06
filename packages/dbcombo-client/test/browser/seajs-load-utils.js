'use strict';

var Promise = require('bluebird');

exports.initAndClearSeajsModuleCache = function initAndClearSeajsModuleCache(name, subtitle)
{
	delCache(seajs.cache);
	delCache(seajs.data.fetchedList);
	delCache(seajs.data.DBComboRequestUriMap);

	// 清理数据
	seajs.DBComboIgnoreExtDepsIndexs.splice(0, seajs.DBComboIgnoreExtDepsIndexs.length);

	// 构建新的db目录
	var dirname;
	if (name)
		dirname = name.replace(/[#\s]/g, '_');
	else
		dirname = 'default';

	if (subtitle)
		dirname += '_'+subtitle.replace(/[#\s]/g, '_');

	seajs.config(
	{
		DBComboFile: 'combo_dist/'+dirname,
		DBComboDelayRequest: false
	});
};

function delCache(cache)
{
	if (!cache) return;
	for(var i in cache)
	{
		if (cache.hasOwnProperty(i)) delete cache[i];
	}
}

exports.assertSeajsUse = function(uris, callback)
{
	return new Promise(function(resolve, reject)
		{
			seajs.use(uris, function()
			{
				try {
					callback.apply(this, arguments);
					resolve();
				}
				catch(err)
				{
					reject(err);
				}
			});
		});
};
