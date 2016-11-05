var stringify = require('../lib/stringify.js');

var Module = seajs.Module;
var FETCHING = Module.STATUS.FETCHING;

var data = seajs.data;
var DBComboUriGroupsData = data.DBComboUriGroupsData = {};
var DBComboFileGroupsData = data.DBComboFileGroupsData = {};
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
		if (DBComboUriGroupsData[uri]) continue;

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
		var info = DBComboUriGroupsData[emitDate.uri];
		if (info && info.groups)
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
	var info = files2groups(files);

	if (info && info.files.length)
	{
		var files = info.files;
		var result =
		{
			groups	: info.groups,
			type	: type
		};

		for (var i = files.length; i--;)
		{
			DBComboUriGroupsData[files[i]] = result;
		}

		return result;
	}
}


function files2groups(files)
{
	var indexs = [];
	var inList = [];
	var groups = [];

	for (var i = files.length; i--;)
	{
		var file = files[i];
		if (DBComboFileGroupsData[file])
		{
			groups.push(DBComboFileGroupsData[file].groups);
			inList.push(file);
		}
		else
		{
			var info = DBComboIndexHandler(file);
			if (info)
			{
				inList.push(file);
				indexs.push(info.index);
				if (info.deps && info.deps.length)
				{
					var depsGroups = files2groups(info.deps);
					if (depsGroups)
					{
						groups.push(depsGroups.groups);
						DBComboFileGroupsData[file]
							= DBComboFileGroupsData[info.index]
							= {
								index: info.index,
								groups: depsGroups.groups
							};
					}
				}
			}
			else if (data.debug)
			{
				console.log('no file index:'+files[i]);
			}
		}
	}

	if (inList.length)
	{
		groups.push(seajs.DBComboKey.indexs2groups(indexs));

		return {
			groups: seajs.DBComboKey.mergeGroups.apply(null, groups),
			files: inList
		};
	}
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
