var expect = require('expect.js');
require('../../src/seajs-plugin');

seajs.config(
{
	base: '/base/browser/source/',
});

describe('#seajs', function()
{
	it('#handler', function()
	{
		expect(seajs).to.be.an('object');
		expect(seajs.use).to.be.a('function');
	});

	it('#require', function(done)
	{
		seajs.use('seajs-plugin-src/outside.js', function(obj)
		{
			try {
				expect(obj).to.be.eql({outside: true});
				done();
			}
			catch(err)
			{
				done(err);
			}
		});
	});
});
