var depsArr = [
	null,		// 0, [0]
	[0],		// 1, [0, 1]
	[0, 1],		// 2, [0, 1, 2]
	[2],		// 3, [0, 1, 2, 3]
	[2, 3],		// 4, [0, 1, 2, 3, 4]
	null,		// 5, [5]
	[1, 5]		// 6, [0, 1, 5, 6]
];

var fileMap = exports.map = {};
var fileArr = exports.arr = [];

for (var i = depsArr.length; i--;)
{
	var file = 'a'+i+'.js';
	var item = {deps: depsArr[i], index: i, file: file};
	fileArr[item.index] = fileMap[file] = item;
}
