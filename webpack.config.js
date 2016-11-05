module.exports =
{
	resolve: {
		// root:
		modulesDirectories: [__dirname+'/node_modules']
	},
	entry: {
		'test/test_stringify': './test/test_stringify.js',
		'test/test_parse': './test/test_parse.js',
		'test/test_seajs-plugin': './test/browser/test_seajs-plugin.js',
		'seajs-plugin': './src/seajs-plugin.js',
		'benchmark4browser': './benchmark/benchmark.js'
	},
	// 忽略 benchmark里面的microtime require， (找不到这个包，需要独立安装)
	externals: [{microtime: 'null'}],
	output: {
		path: 'dist',
		filename: '[name].js'
	}
};
