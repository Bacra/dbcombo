var expect = require('expect.js');

describe('#seajs-plugin', function()
{
	it('#single', function(done)
	{
		seajs.use('c.js', function(obj)
		{
			debugger;
			try {
				expect(obj).to.be.eql({c: true});
				done();
			}
			catch(err)
			{
				done(err);
			}
		});
	});
});
