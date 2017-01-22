var path = require('path');

module.exports =
{
	// Suppress warnings and errors logged by benchmark.js when bundled using webpack.
	// https://github.com/bestiejs/benchmark.js/issues/106
	module:
	{
		noParse:
		[
			path.resolve(__dirname, '../../node_modules/benchmark/benchmark.js')
		],
	},
	// 忽略 benchmark里面的microtime require， (找不到这个包，需要独立安装)
	// externals:
	// [
	// 	{microtime: 'null'},
	// ],
};
