var expect	= require('expect.js');
var parse	= require('../').parse;

describe('#parse', function()
{
	it('#base', function()
	{
		expect(parse('1000001')).to.eql([0, 30]);
		expect(parse('Y31000000Y1Y1')).to.eql([0, 31, 92, 93, 94]);
		expect(parse('Y2W24X/W35X/W35X/W33XY8Z')).to.eql([34, 4000]);
		expect(parse('Y2W24X/W35XW35XW33XY8Z')).to.eql([34, 4000]);
		expect(parse('Y2W24X/W103XY8Z')).to.eql([34, 4000]);
	});

	it('#maxIndexInGroup', function()
	{
		expect(parse.maxIndexInGroup([16777510])).to.be(24);
	});
});
