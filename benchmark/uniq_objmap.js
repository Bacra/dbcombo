module.exports = uniq_objmap;

function uniq_objmap(arr)
{
	var map = {};
	var newArr = [];

	for(var i = arr.length; i--;)
	{
		if (!map[arr[i]])
		{
			map[arr[i]] = true;
			newArr.push(arr[i]);
		}
	}

	return newArr;
}
