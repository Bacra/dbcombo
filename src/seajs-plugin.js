var stringify = require('../lib/stringify.js');

var Module = seajs.Module;
var FETCHING = Module.STATUS.FETCHING;

var data = seajs.data;
var DBComboIndexData = data.DBComboIndexData = {};
var DBComboIndexHandler;
var DBComboFile;

seajs.on('load', setComboHash);
seajs.on('fetch', setRequestUri);
seajs.on('config', setConfig);

seajs.DBComboKey = stringify;


var urlClearReg = /\?.*$/;
function DBComboIndexHandlerDefault(uri)
{
	if (!data.DBComboFileIndex) return;
	return data.DBComboFileIndex[uri.replace(urlClearReg, '')];
}

function setConfig(options)
{
	if (typeof options.DBComboFileIndex == 'function')
		DBComboIndexHandler = options.DBComboFileIndex;
	else if (options.DBComboFileIndex)
		DBComboIndexHandler = DBComboIndexHandlerDefault;

	if ('DBComboFile' in options)
	{
		if (options.DBComboFile)
			DBComboFile = seajs.resolve(options.DBComboFile);
		else
			DBComboFile = null;
	}
}


function setComboHash(uris)
{
	var len = uris.length;
	var needComboUris = [];

	for (var i = 0; i < len; i++)
	{
		var uri = uris[i]
		if (DBComboIndexData[uri]) continue;

		var mod = Module.get(uri);

		// Remove fetching and fetched uris, excluded uris, combo uris
		if (mod.status < FETCHING && !isExcluded(uri) && !isComboUri(uri))
		{
			needComboUris.push(uri);
		}
	}

	if (needComboUris.length) paths2hash(needComboUris);
}


function setRequestUri(emitDate)
{
	if (DBComboFile)
	{
		var info = DBComboIndexData[emitDate.uri];
		if (info && info.indexs)
		{
			// 下发index，其他fetch的可能也要用
			emitDate.DBComboFileInfo = info;
			emitDate.requestUri = info.requestUri
				|| DBComboFile+'/'+seajs.DBComboKey.groups2str(info.groups) + info.type;
		}
	}
}

function paths2hash(files)
{
	var group = files2group(files);
	for (var type in group)
	{
		if (group.hasOwnProperty(type))
		{
			setHash(group[type], type);
		}
	}
}

function setHash(files, type)
{
	var indexs = [];
	var inList = [];

	for (var i = files.length; i--;)
	{
		var info = DBComboIndexHandler(files[i]);
		if (info)
		{
			var fileIndex = info.index;
			inList.push(files[i]);
			indexs.push(fileIndex);
		}
		else if (data.debug)
		{
			console.log('no file index:'+files[i]);
		}
	}

	if (inList.length)
	{
		var result =
		{
			indexs	: indexs,
			groups	: seajs.DBComboKey.indexs2groups(indexs),
			type	: type
		};

		for (var i = inList.length; i--;)
		{
			DBComboIndexData[inList[i]] = result;
		}
	}
}

//
//  ["a.js", "c/d.js", "c/e.js", "a.css", "b.css", "z"]
// ==>
//  {js: ["a.js", "c/d.js", "c/e.js"], css: ["a.css", "b.css"] }
//

function files2group(files)
{
	var group = {};

	for (var i = 0, len = files.length; i < len; i++)
	{
		var file = files[i]
		var ext = getExt(file)
		if (ext)
		{
			(group[ext] || (group[ext] = [])).push(file)
		}
	}

	return group;
}

var extReg = /\.[^\.\s]+$/;
function getExt(file)
{
	var m = file.match(extReg);
	return (m && m[0]) || "";
}

function isExcluded(uri)
{
	if (!DBComboFile) return true;

	if (data.DBComboExcludes)
	{
		return data.DBComboExcludes.test ?
			data.DBComboExcludes.test(uri) :
			data.DBComboExcludes(uri);
	}
}

function isComboUri(uri)
{
	return DBComboFile && uri.substr(0, DBComboFile.length+1) == DBComboFile+'/';
}
