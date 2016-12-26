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

var isLoadInRequest = false;
function setRequestUri(emitDate)
{
	if (Config.DBComboFile)
	{
		var info = DBComboRequestUriMap[emitDate.uri];
		if (info && info.groups && info.groups.length)
		{
			// 下发info，其他fetch的可能也要用
			emitDate.DBComboRequestData = info;
			if (!emitDate.requested)
			{
				emitDate.requestUri = info.requestUri;
			}

			if (!isLoadInRequest && info.indexs)
			{
				isLoadInRequest = true;
				var depsGroups = files2groups(info.indexs, true);
				var depsIndexs = DBComboClient.parse.groups2indexs(depsGroups);
				loadDeps(depsIndexs);
				isLoadInRequest = false;
			}
		}
	}
}


function loadDeps(deps)
{
	var mod = Module.get(data.cwd + "_deps_use_" + data.cid(), deps)

	mod._entry && mod._entry.push(mod);
	mod.history = {};
	mod.remain = 1;

	mod.callback = function()
	{
		delete mod.callback;
		delete mod.history;
		delete mod.remain;
		delete mod._entry;
	};

	mod.load();
}

exports.genRequestUri = genRequestUri;
function genRequestUri(info)
{
	return Config.DBComboFile
		+ (data.DBComboFileExtname === false ? '' : data.DBComboFileExtname || '_db')
		+ '/' + DBComboClient.stringify.groups2str(info.groups)
		+ info.type;
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
	var groups = files2groups(files);

	if (groups.length)
	{
		var result =
		{
			type	: type,
			groups	: groups,
			indexs	: DBComboClient.parse.groups2indexs(groups)
		};

		result.requestUri = genRequestUri(result);

		// 建立request uri映射关系
		for (var indexs = result.indexs, i = indexs.length; i--;)
		{
			DBComboRequestUriMap[Module.resolve(indexs[i])] = result;
		}

		return result;
	}
}


/**
 * @param  {Array} arr       files/indexs
 * @param  {Boolean} isDeps  is sacn deps
 * @param  {Array} groups    groups for merge
 * @return {Array}           groups
 */
function files2groups(arr, isDeps, groups)
{
	var indexs = [];
	groups || (groups = []);

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

			if (info.deps && isDeps)
			{
				files2groups(info.deps, groups);
			}
		}
		else if (data.debug)
		{
			console.log('no file index:%s', arr[i]);
		}
	}

	return DBComboClient.stringify.indexs2groups(indexs, groups);
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
