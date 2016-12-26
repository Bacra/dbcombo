var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');

describe('#seajs', function()
{
	it('#handler', function()
	{
		expect(seajs).to.be.an('object');
		expect(seajs.use).to.be.a('function');
	});

	it('#require', function()
	{
		loadUtils.initAndClearSeajsModuleCache();
		return loadUtils.assertSeajsUse('outside.js', function(obj)
			{
				expect(obj).to.be.eql({outside: true});
			});
	});
});
