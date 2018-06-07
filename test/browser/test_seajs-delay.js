'use strict';

var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');
var Promise = require('bluebird');


describe('#delay', function()
{
	var suite = this;
	before(function()
	{
		loadUtils.initAndClearSeajsModuleCache(suite.title);
		seajs.config({DBComboDelayRequest: true});
	});

	it('#first', function()
	{
		return Promise.all(
		[
			loadUtils.assertSeajsUse('a11.js', function(obj)
			{
				expect(obj).to.be.eql({a11: true});
			}),
			loadUtils.assertSeajsUse('a12.js', function(obj)
			{
				expect(obj).to.be.eql({a12: true});
			}),
			loadUtils.assertSeajsUse('a13.js', function(obj)
			{
				expect(obj).to.be.eql({a13: true});
			})
		]);
	});

	it('#cache', function()
	{
		return Promise.all(
		[
			loadUtils.assertSeajsUse('a11.js', function(obj)
			{
				expect(obj).to.be.eql({a11: true});
			}),
			loadUtils.assertSeajsUse('a12.js', function(obj)
			{
				expect(obj).to.be.eql({a12: true});
			}),
			loadUtils.assertSeajsUse('a13.js', function(obj)
			{
				expect(obj).to.be.eql({a13: true});
			})
		]);
	});

	it('#depart', function()
	{
		return loadUtils.assertSeajsUse('a11.js', function(obj)
		{
			expect(obj).to.be.eql({a11: true});
		});
	});

	it('#depart2', function()
	{
		return loadUtils.assertSeajsUse(['a11.js', 'a12.js'], function(obj)
		{
			expect(obj).to.be.eql({a11: true});
		});
	});

	it('#cache outside', function()
	{
		return loadUtils.assertSeajsUse(['a11.js', 'outside.js'], function(obj, obj2)
		{
			expect(obj).to.be.eql({a11: true});
			expect(obj2).to.be.eql({outside: true});
		});
	});

	it('#nocache outside', function()
	{
		loadUtils.initAndClearSeajsModuleCache(suite.title, this.test.title);
		seajs.config({DBComboDelayRequest: true});

		return Promise.all(
		[
			loadUtils.assertSeajsUse(['a11.js', 'a12.js'], function(obj)
			{
				expect(obj).to.be.eql({a11: true});
			}),
			loadUtils.assertSeajsUse('a13.js', function(obj)
			{
				expect(obj).to.be.eql({a13: true});
			}),
			loadUtils.assertSeajsUse('outside.js', function(obj)
			{
				expect(obj).to.be.eql({outside: true});
			})
		]);
	});
});
