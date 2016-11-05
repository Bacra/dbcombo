var depsArr = [
	[2, 3], [3], null, [4], [2]
];

var fileMap = exports.map = {};
var fileArr = exports.arr = [];

for (var i = depsArr.length; i--;)
{
	var item = {deps: depsArr[i], index: i};
	var file = 'a'+i+'.js';
	fileArr[item.index] = fileMap[file] = item;
}
