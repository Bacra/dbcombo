'use strict';

module.exports = uniq_arrmap;

function uniq_arrmap(arr)
{
	var map = [];
	var result = [];

	for(var i = arr.length, item; i--;)
	{
		item = arr[i];
		if (!map[item])
		{
			map[item] = true;
			result.push(item);
		}
	}

	return result;
}
