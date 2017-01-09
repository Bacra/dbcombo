var DBComboClient = require('../');
var ComboPlugin = require('./seajs-plugin-combo');
var delayUriMap = {};
var data = seajs.data;

seajs.on('fetch', delayRequest);
seajs.on('request', saveRequestData);


function saveRequestData(emitData)
{
	var item = !emitData.requested
			&& data.DBComboDelayRequest
			&& delayUriMap[emitData.requestUri];

	if (item)
	{
		emitData.requested	= true;
		item.emitData		= emitData;
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
	var emitData =
		{
			requestUri: emitData.requestUri,
			groups: emitData.DBComboRequestData.groups
		};

	list.push(emitData);
	delayUriMap[emitData.requestUri] = emitData;

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
		var item = list[i];
		if (item.groups)
		{
			charset || (charset = item.emitData.charset);
			groups.push(item.groups);
			callbacks.push(item.emitData.onRequest);
		}
		else
		{
			seajs.request(item.requestUri, item.emitData.onRequest, item.emitData.charset);
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
