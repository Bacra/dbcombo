module.exports =
{
	// 忽略 benchmark里面的microtime require， (找不到这个包，需要独立安装)
	externals: [{microtime: 'null'}],
};
