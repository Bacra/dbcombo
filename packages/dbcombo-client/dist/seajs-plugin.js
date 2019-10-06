(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports =
{
	stringify: require('./lib/stringify'),
	parse: require('./lib/parse')
};

},{"./lib/parse":3,"./lib/stringify":4}],2:[function(require,module,exports){
'use strict';

var HEX = 32;
var EACH_GROUP_FILE_NUM = exports.EACH_GROUP_FILE_NUM = HEX-1;


var MAX_GROUP_KEY_LENGTH = exports.MAX_GROUP_KEY_LENGTH = Math.pow(2, EACH_GROUP_FILE_NUM).toString(HEX).length;

// 只有>= 这个key，才能达到MAX_GROUP_KEY_LENGTH表示长度
var MAX_ONE_KEY = (HEX-1).toString(HEX);
var MIN_FULL_GROUP_KEY = new Array(MAX_GROUP_KEY_LENGTH).join(MAX_ONE_KEY);
exports.MIN_FULL_GROUP_KEY_LENGTH = parseInt(MIN_FULL_GROUP_KEY, HEX)+1;

// 受到文件夹长度限制
// http://stackoverflow.com/questions/14500893/is-the-255-char-limit-for-filenames-on-windows-and-unix-the-whole-path-or-part
exports.MAX_GROUP_URI = 250/MAX_GROUP_KEY_LENGTH | 0;

},{}],3:[function(require,module,exports){
'use strict';

var DEF = require('./def');
var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
var MAX_GROUP_KEY_LENGTH = DEF.MAX_GROUP_KEY_LENGTH;
var MATH_LOGE2 = Math.log(2);
var push = Array.prototype.push;

function str2groups(str)
{
	var arr = str.split('');
	var groups = [];
	var index = 0;
	var groupval = '';

	for(var i = arr.length, val; i--;)
	{
		val = arr[i];
		// Z是跳过的31位，Y是不足7位时候的补位
		if (val == 'Z' || val == 'Y' || val == 'X')
		{
			if (groupval) groups[index] = parseInt(groupval, 32);
			groupval = '';

			// 重复Repeat Z的优化写法
			if (val == 'X')
			{
				var skipStr = '';
				for(i--; i && arr[i] != 'W'; i--)
				{
					skipStr = arr[i]+skipStr;
				}
				var skipLen = Number(skipStr);
				if (!skipLen) throw new Error('INVALID REPEAT MARK W/X,'+arr[i]+skipStr+'X');
				index += skipLen;
			}
			else
			{
				index++;
			}
		}
		else if (val == 'W')
		{
			throw new Error('INVALID REPEAT MARK W/X,W');
		}
		else if (val != '/')
		{
			groupval = val + groupval;
			// 31位数字parse之后，长度最长为7
			if (groupval.length >= MAX_GROUP_KEY_LENGTH)
			{
				if (groupval) groups[index] = parseInt(groupval, 32);
				index++;
				groupval = '';
			}
		}
	}

	if (groupval) groups[index] = parseInt(groupval, 32);

	return groups;
}

function num2indexs(num, offset)
{
	var indexs = [];
	for(var index = 0; num; index++, num = num >>> 1)
	{
		if (num & 1)
		{
			indexs.push(offset+index);
		}
	}

	return indexs;
}

function groups2indexs(groups)
{
	var indexs = [];

	for(var i = 0, len = groups.length, result; i < len; i++)
	{
		result = num2indexs(groups[i], i * EACH_GROUP_FILE_NUM);
		push.apply(indexs, result);
	}

	return indexs;
}

function parse(str)
{
	return groups2indexs(str2groups(str));
}


function maxIndexInGroup(groups)
{
	var lastIndex = groups.length -1;
	var lastItem = groups[lastIndex];
	return lastIndex*EACH_GROUP_FILE_NUM+Math.log(lastItem)/MATH_LOGE2 | 0;
}

exports = module.exports = parse;
exports.str2groups = str2groups;
exports.num2indexs = num2indexs;
exports.groups2indexs = groups2indexs;
exports.maxIndexInGroup = maxIndexInGroup;

},{"./def":2}],4:[function(require,module,exports){
'use strict';

var DEF = require('./def.js');
var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
var MAX_GROUP_URI = DEF.MAX_GROUP_URI;
var MAX_NOT_REPEAT_GROUP_MARK = 4;
var MIN_FULL_GROUP_KEY_LENGTH = DEF.MIN_FULL_GROUP_KEY_LENGTH;

// console.log('DEFIND,%d,%d,%d,%d', EACH_GROUP_FILE_NUM, MAX_GROUP_KEY_LENGTH, MAX_GROUP_URI, MAX_NOT_REPEAT_GROUP_MARK);

var OFFSET2INDEX = (function()
	{
		var i = EACH_GROUP_FILE_NUM;
		var arr = [];
		while(i--)
		{
			arr[i] = 1 << i;
		}

		return arr;
	})();


var MARK_Z_GROUPS = (function()
	{
		var arr = [];
		var str = '';
		for(var i = 1; i < MAX_NOT_REPEAT_GROUP_MARK; i++)
		{
			arr[i] = (str += 'Z');
		}

		return arr;
	})();


function indexs2groups(indexs, groups)
{
	groups || (groups = []);

	for(var i = indexs.length; i--;)
	{
		var index = indexs[i];
		var groupIndex = index/EACH_GROUP_FILE_NUM | 0;
		var lowOffset = index%EACH_GROUP_FILE_NUM;
		var indexVal = OFFSET2INDEX[lowOffset];

		// console.log('index:%d groupIndex:%d indexVal:%d lowOffset:%d file:%s', index, groupIndex, indexVal, lowOffset);
		groups[groupIndex] = (groups[groupIndex] || 0) | indexVal;
	}

	return groups;
}


// 生成urlkey，高位→低位
// 除了32位的字符，转换后有如下特殊字符
// Z  分组无任何数据，占位使用
// Y  分组转成字符串之后，长度不足MAX_GROUP_KEY_LENGTH，补位
// /  数据可能超过文件名长度限制，用来分割
// W...X  当有很多Z的时候，为了美化，进行repeat处理; ...表示重复的次数
function stringify(indexs)
{
	return groups2str(indexs2groups(indexs));
}


function groups2str(groups)
{
	var str = '';
	var continuousEmptyGroups = 0;

	function ZXHandler()
	{
		if (continuousEmptyGroups)
		{
			if (MARK_Z_GROUPS[continuousEmptyGroups])
				str += MARK_Z_GROUPS[continuousEmptyGroups];
			else
				str += 'W'+continuousEmptyGroups+'X';

			continuousEmptyGroups = 0;
		}
	}

	for(var i = groups.length, val; i--;)
	{
		if (groups[i])
		{
			ZXHandler();

			val = groups[i];
			if (val < MIN_FULL_GROUP_KEY_LENGTH)
				str += 'Y'+val.toString(32);
			else
				str += val.toString(32);
		}
		else
		{
			continuousEmptyGroups++;
		}

		if (i && !(i%MAX_GROUP_URI))
		{
			ZXHandler();
			str += '/';
		}
	}


	ZXHandler();
	// console.log('groups len:%d, %o, url:%s', groups.length, groups, str);

	return str;
}



function mergeGroups()
{
	var args = arguments;
	var argsLength = args.length;
	var newGroups = [];
	var maxLength = 0;

	// group的最大长度
	for(var i = argsLength, item; i--;)
	{
		item = args[i].length;
		if (item > maxLength) maxLength = item;
	}

	for(var index = 0; index < maxLength; index++)
	{
		var groupResult = 0;

		for(var i2 = argsLength, item2; i2--;)
		{
			item2 = args[i2][index];
			if (item2) groupResult |= item2;
		}

		newGroups[index] = groupResult;
	}

	return newGroups;
}


exports = module.exports = stringify;
exports.indexs2groups = indexs2groups;
exports.groups2str = groups2str;
exports.mergeGroups = mergeGroups;

},{"./def.js":2}],5:[function(require,module,exports){
'use strict';

var Module = seajs.Module;
var DBComboIndex2uriData = exports.DBComboIndex2uriData = seajs.data.DBComboIndex2uriData = {};
exports.DBComboIndexHandler = DBComboIndexHandlerDefault;
exports.DBComboFile = null;


seajs.on('config', setConfig);
// 拓展resolve，支持index转uri，方便index的数据转化
seajs.on('resolve', index2uri);

function index2uri(emitDate)
{
	if (!emitDate.uri && typeof emitDate.id == 'number')
	{
		var uri = DBComboIndex2uriData[emitDate.id];
		if (!uri)
		{
			var info = exports.DBComboIndexHandler(emitDate.id);
			if (info && info.file)
			{
				uri = Module.resolve(''+info.file);
				if (uri) DBComboIndex2uriData[emitDate.id] = uri;
			}
		}
		if (uri) emitDate.uri = uri;
	}
}



var urlClearReg = /\?.*$/;
function DBComboIndexHandlerDefault(uri)
{
	if (!seajs.data.DBComboFileIndex) return;
	return seajs.data.DBComboFileIndex[uri.replace(urlClearReg, '')];
}

function setConfig(options)
{
	if (typeof options.DBComboFileIndex == 'function')
		exports.DBComboIndexHandler = options.DBComboFileIndex;
	else if (options.DBComboFileIndex)
		exports.DBComboIndexHandler = DBComboIndexHandlerDefault;

	if ('DBComboFile' in options)
	{
		if (options.DBComboFile)
			exports.DBComboFile = Module.resolve(options.DBComboFile);
		else
			exports.DBComboFile = null;
	}
}

},{}],6:[function(require,module,exports){
'use strict';

var DBComboClient = require('../');
var Config = require('./seajs-plugin-base');

var data = seajs.data;
var Module = seajs.Module;
var STATUS = Module.STATUS;
var DBComboRequestUriMap = data.DBComboRequestUriMap = {};
var DBComboIgnoreExtDepsIndexs = seajs.DBComboIgnoreExtDepsIndexs = [];
var isLoadInRequest = false;

seajs.on('load', comboLoadhandler);
seajs.on('fetch', setRequestUri);

function comboLoadhandler(uris)
{
	if (!Config.DBComboFile || !uris.length) return;

	if (!isLoadInRequest)
	{
		isLoadInRequest = true;
		// 先分析有没有额外的依赖
		// 额外的依赖，通过新的module进行加载
		loadExtDeps(uris);
		isLoadInRequest = false;
	}
	else
	{
		// 正真获取combo的url
		setComboHash(uris);
	}
}

function loadExtDeps(uris)
{
	var startTime = +new Date;
	var runtime = {depth: 1};
	var depsGroups = [];
	files22groups(uris, depsGroups, runtime);

	// @todo 如何避免子模块onload的之后，触发加载他的依赖的递归计算
	// 虽然已经屏蔽了递归，但感觉弄到index分析，也很多余
	if (runtime.depth > 1)
	{
		seajs.emit('dbcombo:load_ext_deps',
			{
				usage: +new Date - startTime,
				depth: runtime.depth
			});
	}

	var depsIndexs = DBComboClient.parse.groups2indexs(depsGroups);
	loadDeps(depsIndexs);
}

function setComboHash(uris)
{
	var needComboUris = [];

	for (var i = 0, len = uris.length; i < len; i++)
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

	if (needComboUris.length)
	{
		seajs.emit('dbcombo:combo_length', needComboUris.length);
		paths2hash(needComboUris);
	}
}

function setRequestUri(emitDate)
{
	if (Config.DBComboFile && isLoadInRequest)
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
		+ '/V' + info.type;
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
 * @param  {Array} arr   files/indexs
 * @return {Array}       groups
 */
function files2groups(arr)
{
	var indexs = [];

	for(var i = arr.length; i--;)
	{
		var info = Config.DBComboIndexHandler(arr[i]);
		if (info)
		{
			// var mod = Module.get(Module.resolve(info.index), info.deps);
			// if (mod.status < STATUS.FETCHING)
			// {
				indexs.push(info.index);
			// }
		}
		else if (data.debug)
		{
			console.log('no file index:%s', arr[i]);
		}
	}

	return DBComboClient.stringify.indexs2groups(indexs);
}


/**
 * @param  {Array} arr       files/indexs
 * @param  {Array} groups    groups for merge
 * @param  {Object} runtime  runtime info. eq: depth
 */
function files22groups(arr, groups, runtime)
{
	var indexs = [];
	for(var i = arr.length; i--;)
	{
		var info = Config.DBComboIndexHandler(arr[i]);
		// 计算过一次，就不计算了
		// 如果上一次没有用，业务自行清理这个标志位
		// 避免递归重复计算
		if (info && !DBComboIgnoreExtDepsIndexs[info.index])
		{
			DBComboIgnoreExtDepsIndexs[info.index] = true;
			indexs.push(info.index);

			if (info.deps)
			{
				if (runtime && runtime.depth) runtime.depth++;
				files22groups(info.deps, groups, runtime);
			}
		}
	}

	DBComboClient.stringify.indexs2groups(indexs, groups);
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

var extReg = /\.[^.\s]+$/;
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

},{"../":1,"./seajs-plugin-base":5}],7:[function(require,module,exports){
'use strict';

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

},{"../":1,"./seajs-plugin-combo":6}],8:[function(require,module,exports){
'use strict';

require('./seajs-plugin-combo');
require('./seajs-plugin-delay');

},{"./seajs-plugin-combo":6,"./seajs-plugin-delay":7}]},{},[8]);
