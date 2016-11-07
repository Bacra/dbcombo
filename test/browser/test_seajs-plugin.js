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

		it('#cache outside', function()
		{
			return loadUtils.assertSeajsUse(['a2.js', 'outside.js'], function(obj)
				{
					expect(obj).to.be.eql({a2: true});
				});
		});

		it('#nocache outside', function()
		{
			loadUtils.clearSeajsModuleCache();
			return loadUtils.assertSeajsUse(['a2.js', 'outside.js'], function(obj)
				{
					expect(obj).to.be.eql({a2: true});
				});
		});
	});


	describe('#delay', function()
	{
		before(function()
		{
			loadUtils.clearSeajsModuleCache();
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
			return loadUtils.assertSeajsUse(['a11.js', 'outside.js'], function(obj)
			{
				expect(obj).to.be.eql({a11: true});
			});
		});

		it('#nocache outside', function()
		{
			loadUtils.clearSeajsModuleCache();

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
});
