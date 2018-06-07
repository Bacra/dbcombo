'use strict';

var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');

describe('#combo', function()
{
	var suite = this;
	before(function()
	{
		loadUtils.initAndClearSeajsModuleCache(suite.title);
	});

	it('#first', function()
	{
		return loadUtils.assertSeajsUse('a0.js', function(obj)
			{
				expect(obj).to.be.eql({a0: true});
			});
	});

	it('#cache', function()
	{
		return loadUtils.assertSeajsUse('a0.js', function(obj)
			{
				expect(obj).to.be.eql({a0: true});
			});
	});
});
