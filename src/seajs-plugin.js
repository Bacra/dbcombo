var DBComboClient = require('../');

var Module = seajs.Module;
var STATUS = Module.STATUS;

var data = seajs.data;
var DBComboRequestUriMap = data.DBComboRequestUriMap = {};
var DBComboIndex2uriData = data.DBComboIndex2uriData = {};
var DBComboIndexHandler;
var DBComboFile;
var push = Array.prototype.push;

seajs.on('load', setComboHash);
seajs.on('fetch', setRequestUri);
seajs.on('config', setConfig);
// 拓展resolve，支持index转uri，方便index的数据转化
seajs.on('resolve', index2uri);

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


function index2uri(emitDate)
{
	if (!emitDate.uri && typeof emitDate.id == 'number')
	{
		var uri = DBComboIndex2uriData[emitDate.id];
		if (!uri)
		{
			var info = DBComboIndexHandler(emitDate.id);
			if (info && info.file)
			{
				uri = Module.resolve(''+info.file);
				if (uri) DBComboIndex2uriData[emitDate.id] = uri;
			}
		}
		if (uri) emitDate.uri = uri;
	}
}

function setComboHash(uris)
{
	var len = uris.length;
	var needComboUris = [];

	for (var i = 0; i < len; i++)
	{
		var uri = uris[i]
		if (DBComboRequestUriMap[uri]) continue;

		var mod = Module.get(uri);

		// Remove fetching and fetched uris, excluded uris, combo uris
		if (mod.status < STATUS.FETCHING && !isExcluded(uri) && !isComboUri(uri))
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
		var info = DBComboRequestUriMap[emitDate.uri];
		if (info && info.groups)
		{
			// 下发index，其他fetch的可能也要用
			// emitDate.DBComboRequestData = info;
			emitDate.requestUri = genRequestUri(info);
		}
	}
}

function genRequestUri(info)
{
	return DBComboFile+'/'+DBComboClient.stringify.groups2str(info.groups) + info.type;
}


function paths2hash(files)
{
	var types = typeGroup(files);
	for (var type in types)
	{
		if (types.hasOwnProperty(type))
		{
			setHash(types[type], type);
		}
	}
}

function setHash(files, type)
{
	var groups = files2groups(files, []);

	if (groups.length)
	{
		var result =
		{
			groups	: groups,
			type	: type
		};

		// 建立request uri映射关系
		var indexs = DBComboClient.parse.groups2indexs(groups);
		for (var i = indexs.length; i--;)
		{
			DBComboRequestUriMap[Module.resolve(indexs[i])] = result;
		}

		return result;
	}
}

function files2groups(arr, groups)
{
	var indexs = [];

	for(var i = arr.length; i--;)
	{
		var info = DBComboIndexHandler(arr[i]);
		if (info)
		{
			var mod = Module.get(Module.resolve(info.index), info.deps);
			if (mod.status < STATUS.FETCHING)
			{
				indexs.push(info.index);
			}

			if (info.deps)
			{
				files2groups(info.deps, groups);
			}
		}
		else if (data.debug)
		{
			console.log('no file index:%s', arr[i]);
		}
	}

	DBComboClient.stringify.indexs2groups(indexs, groups);
	return groups;
}





//
//  ["a.js", "c/d.js", "c/e.js", "a.css", "b.css", "z"]
// ==>
//  {js: ["a.js", "c/d.js", "c/e.js"], css: ["a.css", "b.css"] }
//

function typeGroup(files)
{
	var types = {};

	for (var i = 0, len = files.length; i < len; i++)
	{
		var file = files[i]
		var ext = getExt(file)
		if (ext)
		{
			(types[ext] || (types[ext] = [])).push(file)
		}
	}

	return types;
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
