var DBComboClient = require('../');
var ComboPlugin = require('./seajs-plugin-combo');
var delayUriMap = {};
var data = seajs.data;

seajs.on('fetch', delayRequest);
seajs.on('request', saveRequestData);


function saveRequestData(emitData)
{
	var item = data.DBComboDelayRequest && delayUriMap[emitData.requestUri];
	if (item)
	{
		emitData.requested	= true;
		item.onRequest		= emitData.onRequest;
		item.charset		= emitData.charset;
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
	var requestUris = [];
	var charset;

	for(var i = list.length; i--;)
	{
		var item = list[i];
		if (item.onRequest)
		{
			charset || (charset = item.charset);
			groups = DBComboClient.stringify.mergeGroups(groups, item.groups);
			callbacks.push(item.onRequest);
			requestUris.push(item.requestUri);
		}
		else
		{
			console.error('no onRequest:%s', item.requestUri);
		}
	}

	if (callbacks.length == 1)
	{
		seajs.request(requestUris[0], callbacks[0], charset);
	}
	else if (callbacks.length > 1)
	{
		var url = ComboPlugin.genRequestUri({type: type, groups: groups});
		seajs.request(url, function()
			{
				for(var i = callbacks.length; i--;)
				{
					callbacks[i]();
				}
			},
			charset);
	}
}
