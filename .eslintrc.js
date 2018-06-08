module.exports =
{
	env: {node: true},
	extends: 'eslint:recommended',
	rules:
	{
		'no-console': 'off',
	},
	globals:
	{
		seajs: true,
		window: true,
		define: true,
	},
}
