var Promise = require('bluebird');

exports.clearSeajsModuleCache = function clearSeajsModuleCache()
{
	delCache(seajs.cache);
	delCache(seajs.data.fetchedList);
	seajs.data.DBComboIgnoreExtDepsIndexs = [];
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
