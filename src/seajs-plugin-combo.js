var DBComboClient = require('../');
var Config = require('./seajs-plugin-base');

var data = seajs.data;
var Module = seajs.Module;
var STATUS = Module.STATUS;
var DBComboRequestUriMap = data.DBComboRequestUriMap = {};
var push = Array.prototype.push;

seajs.on('load', setComboHash);
seajs.on('fetch', setRequestUri);


function setComboHash(uris)
{
	var len = uris.length;
	var needComboUris = [];

	for (var i = 0; i < len; i++)
	{
		var uri = uris[i];
		// 忽略已经存在的
		// 注意：已经存在的不一定是插件生成的，也有可能是其他插件，如local_code添加的
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
	if (Config.DBComboFile)
	{
		var info = DBComboRequestUriMap[emitDate.uri];
		if (info && info.groups && info.groups.length)
		{
			// 下发info，其他fetch的可能也要用
			emitDate.DBComboRequestData = info;
			emitDate.requestUri = genRequestUri(info);
		}
	}
}

exports.genRequestUri = genRequestUri;
function genRequestUri(info)
{
	return Config.DBComboFile + '/' + DBComboClient.stringify.groups2str(info.groups) + info.type;
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
		var info = Config.DBComboIndexHandler(arr[i]);
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
	if (!Config.DBComboFile) return true;

	if (data.DBComboExcludes)
	{
		return data.DBComboExcludes.test ?
			data.DBComboExcludes.test(uri) :
			data.DBComboExcludes(uri);
	}
}

function isComboUri(uri)
{
	return Config.DBComboFile && uri.substr(0, Config.DBComboFile.length+1) == Config.DBComboFile+'/';
}
