module.exports = uniq_arrmap;

function uniq_arrmap(arr)
{
	var result = [];
	for(var i = arr.length; i--;)
	{
		result[arr[i]] = true;
	}

	var result2 = [];
	for(var i = result.length; i--;)
	{
		if (result[i])
		{
			result2.push(i);
		}
	}
}
