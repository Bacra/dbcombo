var depsArr = [
	null,		// 0, [0]
	[0],		// 1, [0, 1]
	[0, 1],		// 2, [0, 1, 2]
	,,,,,,

	null,		// 10, [10]
	[10],		// 11, [10, 11]
	null,		// 12, [12]
	[0, 12]		// 13, [0, 12, 13]
];

var fileMap = exports.map = {};
var fileArr = exports.arr = [];

for (var i = depsArr.length; i--;)
{
	var file = 'a'+i+'.js';
	var item = {deps: depsArr[i], index: i, file: file};
	fileArr[item.index] = fileMap[file] = item;
}
