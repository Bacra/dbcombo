var assert		= require('assert');
var stringify	= require('../').stringify;
var DEF			= require('../lib/def');

describe('#stringify', function()
{
	it('#base', function()
	{
		assert.equal(stringify([0]), 'Y1');
		assert.equal(stringify([1]), 'Y2');
		assert.equal(stringify([0,1]), 'Y3');
		assert.equal(stringify([0, 30]), '1000001');
		assert.equal(stringify([0, 31]), 'Y1Y1');
		assert.equal(stringify([0, 31, 31]), 'Y1Y1');
		assert.equal(stringify([0, 31, 92, 93, 94]), 'Y31000000Y1Y1');
		assert.equal(stringify([0, 93, 92, 31, 94]), 'Y31000000Y1Y1');
		assert.equal(stringify([1000]), 'Y80W32X');
		assert.equal(stringify([2000]), 'Y2000W29X/W35X');
		assert.equal(stringify([5000]), 'Yg0W21X/W35X/W35X/W35X/W35X');
		assert.equal(stringify([4000, 34]), 'Y2W24X/W35X/W35X/W33XY8Z');
	});


	it('#long', function()
	{
		var i = DEF.MAX_GROUP_URI * 3;
		var arr = [];
		while(i--)
		{
			arr.push(i * DEF.EACH_GROUP_FILE_NUM);
		}

		var key = stringify(arr);
		assert.equal(key, 'Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1/Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1/Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1');
	});


	it('#long2', function()
	{
		var i = DEF.MAX_GROUP_URI * 2;
		var arr = [];
		while(i--)
		{
			arr.push(i * DEF.EACH_GROUP_FILE_NUM+i);
		}

		var key = stringify(arr);

		assert.equal(key, 'Y40Y20/Y10YgY8Y4Y2Y1Z1000000Yg00000Y800000Y400000Y200000Y100000Yg0000Y80000Y40000Y20000Y10000Yg000Y8000Y4000Y2000Y1000Yg00Y800Y400Y200Y100Yg0Y80Y40Y20Y10YgY8/Y4Y2Y1Z1000000Yg00000Y800000Y400000Y200000Y100000Yg0000Y80000Y40000Y20000Y10000Yg000Y8000Y4000Y2000Y1000Yg00Y800Y400Y200Y100Yg0Y80Y40Y20Y10YgY8Y4Y2Y1');
	});
});
