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

