var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');

describe('#seajs-plugin', function()
{
	it('#single', function()
	{
		loadUtils.clearSeajsModuleCache();

		return loadUtils.assertSeajsUse('a2.js', function(obj)
			{
				expect(obj).to.be.eql({a2: true});
			});
	});

	it('#deps', function()
	{
		loadUtils.clearSeajsModuleCache();

		return loadUtils.assertSeajsUse('a0.js', function(obj)
			{
				expect(obj).to.be.eql({a0: true});
			});
	});
});
