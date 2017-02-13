module.exports = uniq_objmap;

function uniq_objmap(arr)
{
	var map = {};
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
