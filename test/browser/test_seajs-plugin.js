var seajs = require('seajs/dist/sea-debug.js');
var expect = require('expect.js');

window.seajs = seajs.seajs;
window.define = seajs.define;

seajs = seajs.seajs;

describe('#seajs-plugin', function()
{
	it('#require-seajs', function()
	{
		expect(seajs).to.be.an('object');
		expect(seajs.use).to.be.a('function');
	});
});
