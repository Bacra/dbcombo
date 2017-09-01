var DBComboClient = require('../');
var ComboPlugin = require('./seajs-plugin-combo');
var delayUriMap = {};
var data = seajs.data;
var Module = seajs.Module;

seajs.on('fetch', delayRequest);
seajs.on('request', saveRequestData);


function saveRequestData(emitData)
{
	var delayItem = !emitData.requested
			&& data.DBComboDelayRequest
			&& delayUriMap[emitData.requestUri];

	if (delayItem)
	{
		emitData.requested	= true;
		delayItem.emitData	= emitData;
	}
}


var delays = {};
var delayWait;
function delayRequest(emitData)
{
	if (!data.DBComboDelayRequest
		|| !emitData.DBComboRequestData
		|| !emitData.requestUri
		|| delayUriMap[emitData.requestUri])
	{
		return;
	}

	var indexs = emitData.DBComboRequestData.indexs;
	if (!indexs || (data.DBComboDelayRequestMaxUri && indexs.length > data.DBComboDelayRequestMaxUri))
	{
		return;
	}


	var type = emitData.DBComboRequestData.type;
	var list = delays[type] || (delays[type] = []);
	var delayItem =
		{
			requestUri	: emitData.requestUri,
			groups		: emitData.DBComboRequestData.groups,
			emitData	: emitData
		};

	list.push(delayItem);
	delayUriMap[emitData.requestUri] = delayItem;

	if (!delayWait) delayWait = setTimeout(requestAll);
}


function requestAll()
{
	delayWait = null;

	for(var type in delays)
	{
		requestOneType(type, delays[type]);
	}

	delays = {};
	delayUriMap = {};
}

function requestOneType(type, list)
{
	var groups = [];
	var callbacks = [];
	var charset;

	for(var i = list.length; i--;)
	{
		var delayItem = list[i];
		if (delayItem.groups)
		{
			charset || (charset = delayItem.emitData.charset);
			groups.push(delayItem.groups);
			callbacks.push(delayItem.emitData.onRequest);
		}
		else
		{
			seajs.request(delayItem.requestUri, delayItem.emitData.onRequest, delayItem.emitData.charset);
		}
	}

	if (groups.length)
	{
		var url = ComboPlugin.genRequestUri(
			{
				type: type,
				groups: groups.length == 1 ? groups[0] : DBComboClient.stringify.mergeGroups.apply(null, groups)
			});

		seajs.emit('dbcombo:delay_merge', groups.length);
		seajs.request(url, function()
			{
				for(var i = callbacks.length; i--;)
				{
					callbacks[i] && callbacks[i]();
				}
			},
			charset);
	}
}

// 由于延迟加载，可能会导致require.async变成同步
// 影响到模块的初始化顺序
// 由于无法重写async方法，所以只能改写use...好伤

var _orignalUseHandle = Module.use;
Module.use = function(ids, callbacks, uri)
{
	var args = arguments;
	var self = this;
	if (uri && uri.indexOf('_async_') != -1)
	{
		setTimeout(function()
		{
			_orignalUseHandle.apply(self, args);
		});
	}
	else
	{
		_orignalUseHandle.apply(self, args);
	}
};
