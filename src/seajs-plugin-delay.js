var DBComboClient = require('../');
var ComboPlugin = require('./seajs-plugin-combo');
var delayUriMap = {};

seajs.on('fetch', function(emitData)
{
	if (emitData.DBComboRequestData
		&& emitData.requestUri
		&& !delayUriMap[emitData.requestUri])
	{
		delayRequest(emitData);
	}
});


seajs.on('request', function(emitData)
{
	var item = delayUriMap[emitData.requestUri];
	if (item)
	{
		emitData.requested	= true;
		item.onRequest		= emitData.onRequest;
		item.charset		= emitData.charset;
	}
});



var delays = {};
var delayWait;
function delayRequest(info)
{
	var type = info.DBComboRequestData.type;
	var list = delays[type] || (delays[type] = []);
	var emitData =
		{
			requestUri: info.requestUri,
			groups: info.DBComboRequestData.groups
		};

	list.push(emitData);
	delayUriMap[info.requestUri] = emitData;

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
