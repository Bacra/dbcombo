module.exports =
{
	resolve: {
		// root:
		modulesDirectories: [__dirname+'/node_modules']
	},
	entry: {
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
