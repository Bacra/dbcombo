var expect = require('expect.js');
var loadUtils = require('./seajs-load-utils');

describe('#seajs-plugin', function()
{
	it('#single', function()
	{
		loadUtils.clearSeajsModuleCache();
		return loadUtils.assertSeajsUse('c.js', function(obj)
			{
				expect(obj).to.be.eql({c: true});
			});
	});
});
