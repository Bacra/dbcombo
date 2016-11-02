var assert	= require('assert');
var parse	= require('../').parse;

describe('#parse', function()
{
	it('#base', function()
	{
		assert.deepEqual(parse('1000001'), [0, 30]);
		assert.deepEqual(parse('Y31000000Y1Y1'), [0, 31, 92, 93, 94]);
		assert.deepEqual(parse('Y2W24X/W35X/W35X/W33XY8Z'), [34, 4000]);
		assert.deepEqual(parse('Y2W24X/W35XW35XW33XY8Z'), [34, 4000]);
		assert.deepEqual(parse('Y2W24X/W103XY8Z'), [34, 4000]);
	});


	it('#maxIndexInGroup', function()
	{
		assert.equal(parse.maxIndexInGroup([16777510]), 24);
	});
});
