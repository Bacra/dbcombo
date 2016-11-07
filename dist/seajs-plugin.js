/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var DEF = __webpack_require__(13);
	var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
	var MAX_GROUP_KEY_LENGTH = DEF.MAX_GROUP_KEY_LENGTH;
	var MAX_GROUP_URI = DEF.MAX_GROUP_URI;
	var MAX_NOT_REPEAT_GROUP_MARK = 4;

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

		for(var i = groups.length; i--;)
		{
			if (groups[i])
			{
				ZXHandler();
				var tmp = groups[i].toString(32);
				if (tmp.length < 7) tmp = 'Y'+tmp;
				str += tmp;
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
		var lengths = [];
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

			for(var i = argsLength, item; i--;)
			{
				item = args[i][index];
				if (item) groupResult |= item;
			}

			newGroups[index] = groupResult;
		}

		return newGroups;
	}


	exports = module.exports = stringify;
	exports.indexs2groups = indexs2groups;
	exports.groups2str = groups2str;
	exports.mergeGroups = mergeGroups;


/***/ },
/* 13 */
/***/ function(module, exports) {

	var EACH_GROUP_FILE_NUM = exports.EACH_GROUP_FILE_NUM = 31;
	var MAX_GROUP_KEY_LENGTH = exports.MAX_GROUP_KEY_LENGTH = Math.pow(2, EACH_GROUP_FILE_NUM).toString(32).length;
	// 受到文件夹长度限制
	// http://stackoverflow.com/questions/14500893/is-the-255-char-limit-for-filenames-on-windows-and-unix-the-whole-path-or-part
	exports.MAX_GROUP_URI = 250/MAX_GROUP_KEY_LENGTH | 0;


/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var DBComboClient = __webpack_require__(16);

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


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		stringify: __webpack_require__(12),
		parse: __webpack_require__(17)
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var DEF = __webpack_require__(13);
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


/***/ }
/******/ ]);