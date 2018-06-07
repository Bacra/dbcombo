'use strict';

var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');


describe('#deps', function()
{
	var suite = this;
	before(function()
	{
		loadUtils.initAndClearSeajsModuleCache(suite.title);
	});

	it('#first', function()
	{
		return loadUtils.assertSeajsUse('a1.js', function(obj)
			{
				expect(obj).to.be.eql({a1: true});
			});
	});

	it('#depart', function()
	{
		return loadUtils.assertSeajsUse('a0.js', function(obj)
			{
				expect(obj).to.be.eql({a0: true});
			});
	});

	it('#cache', function()
	{
		return loadUtils.assertSeajsUse('a2.js', function(obj)
			{
				expect(obj).to.be.eql({a2: true});
			});
	});

	it('#cache outside', function()
	{
		return loadUtils.assertSeajsUse(['a2.js', 'outside.js'], function(obj, obj2)
			{
				expect(obj).to.be.eql({a2: true});
				expect(obj2).to.be.eql({outside: true});
			});
	});

	it('#nocache outside', function()
	{
		loadUtils.initAndClearSeajsModuleCache(suite.title, this.test.title);
		return loadUtils.assertSeajsUse(['a1.js', 'outside.js'], function(obj, obj2)
			{
				expect(obj).to.be.eql({a1: true});
				expect(obj2).to.be.eql({outside: true});
			});
	});
});
