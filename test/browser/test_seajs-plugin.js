var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');

describe('#seajs-plugin', function()
{
	describe('#single', function()
	{
		before(function()
		{
			loadUtils.clearSeajsModuleCache();
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


	describe('#deps', function()
	{
		before(function()
		{
			loadUtils.clearSeajsModuleCache();
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
	});
});
