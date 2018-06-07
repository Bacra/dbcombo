'use strict';

var expect	= require('expect.js');
var parse	= require('../').parse;
var DEF		= require('../lib/def');

describe('#parse', function()
{
	describe('#str2groups', function()
	{
		it('#normal', function()
		{
			assertGroups('1', [1]);
			assertGroups('Y1', [1]);
			assertGroups('YY1', [1]);
			assertGroups('Z1', [1]);
			assertGroups('ZZ1', [1]);
			assertGroups('ZZZZZZZ1', [1]);
			assertGroups('1Z1', [1,1]);
			assertGroups('1ZZ1', [1, , 1]);
			assertGroups('1Y1', [1,1]);
			assertGroups('1YY1', [1, , 1]);
			assertGroups('1W4X1', [1, , , , 1]);
			assertGroups('1W4XY1', [1, , , , , 1]);
			assertGroups('W4X1', [1]);
		});

		it('#err_WX', function()
		{
			assertGroups4ErrorWX('4X1', '4X');
			assertGroups4ErrorWX('4X', '4X');
			assertGroups4ErrorWX('WX1', 'WX');
			assertGroups4ErrorWX('1WX1', 'WX');
			assertGroups4ErrorWX('WCX1', 'WCX');
			assertGroups4ErrorWX('W1', 'W');
			assertGroups4ErrorWX('1W1', 'W');
			assertGroups4ErrorWX('1WTCX1', 'WTCX');
		});

		it('#groupLength', function()
		{
			var key = 'Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1/Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1/Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1';

			expect(parse.str2groups(key)).to.have.length(DEF.MAX_GROUP_URI*3);
		});
	});


	describe('#parse', function()
	{
		it('#key2', function()
		{
			assertParse2('1', [0]);
			assertParse2('11', [0, 1]);
			assertParse2('101', [0, 2]);
			assertParse2('00101', [0, 2]);
			assertParse2('1000000011', [0, 1, 9]);
			assertParse2('10000000111', [0, 1, 2, 10]);
			assertParse2('00000001111', [0, 1, 2, 3]);
		});

		it('#key32', function()
		{
			assertParse32('1000001', [0, 30]);
			assertParse32('1Y1Y1', [0, 31, 62]);
			assertParse32('1ZY1Y1', [0, 31, 93]);
			assertParse32('Y31000000Y1Y1', [0, 31, 92, 93, 94]);
			assertParse32('Y2W24X/W35X/W35X/W33XY8Z', [34, 4000]);
			assertParse32('Y2W24X/W35XW35XW33XY8Z', [34, 4000]);
			assertParse32('Y2W24X/W103XY8Z', [34, 4000]);
		});
	});

	it('#maxIndexInGroup', function()
	{
		expect(parse.maxIndexInGroup([16777510])).to.be(24);
	});
});


function assertParse2(key, result)
{
	key = parseInt(key, 2).toString(32);
	expect(parse(key)).to.eql(result);
}

function assertParse32(key, result)
{
	expect(parse(key)).to.eql(result);
}

function assertGroups(key, result)
{
	expect(parse.str2groups(key)).to.eql(result);
}

function assertGroups4ErrorWX(key, errInterval)
{
	expect(parse.str2groups).withArgs(key)
		.throwError(function(err)
		{
			expect(err.message).to.be('INVALID REPEAT MARK W/X,'+errInterval);
		});
}
