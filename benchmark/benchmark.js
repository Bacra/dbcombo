var Benchmark = require('benchmark');
var stringify = require('../lib/stringify');
var indexs2path = require('./indexs2path');
var seajsCombo = require('./seajs-combo-sethash');
var uniqdeps = require('./uniqdeps');
var DEF = require('../lib/def');

var list51 = [12, 33, 200, 800, 10000];
var list52 = [
	'js/mail/seajs/combo.js',
	'js/mail/list/listhandler.js',
	'js/mail/list.js',
	'js/mail/list/listhandler2.js',
	'js/mail/list/listhandler3.js'
];

var indexMap = {};
var indexArr = [];
var i = 31;
for(var i = DEF.EACH_GROUP_FILE_NUM; i--;)
{
	indexMap[i] = indexArr[i] = 1 << i;
}


function map(arr, handler)
{
	var newArr = [];
	for(var i = 0, len = arr.length; i < len; i++)
	{
		newArr.push(handler(arr[i], i));
	}
	return newArr;
}

function runHandler(copy, showMsg)
{
	while(copy--)
	{
		list51 = list51.concat(map(list51, function(item, index)
			{
				return item += (index+1)*(copy+1+index);
			}));
		list52 = list52.concat(map(list52, function(item)
			{
				return item.split('.')[0]+'_'+copy+'.js';
			}));
	}

	var key = '#'+list52.length;

	// index 转二进制
	function index2binaryBenchmark()
	{
		var suite = new Benchmark.Suite;
		return suite.add('direct', function()
			{
				var init = 12;
				for(var i = DEF.EACH_GROUP_FILE_NUM; i--;)
				{
					init = init | (1 << i);
				}
			})
			.add('map', function()
			{
				var init = 12;
				for(var i = DEF.EACH_GROUP_FILE_NUM; i--;)
				{
					init = init | indexMap[i];
				}
			})
			.add('arr', function()
			{
				var init = 12;
				for(var i = DEF.EACH_GROUP_FILE_NUM; i--;)
				{
					init = init | indexArr[i];
				}
			})
			.on('cycle', function(event)
			{
				showMsg(String(event.target));
			})
			.on('complete', function()
			{
				showMsg('Fastest is ' + this.filter('fastest').map('name'));
			});
	}


	// url序列测试
	function urlStringifyBenchmark()
	{
		stringify(list51);
		indexs2path(list51);
		seajsCombo(list52);

		var suite = new Benchmark.Suite;
		return suite.add('stringify'+key, function()
			{
				stringify(list51);
			})
			.add('indexs2path'+key, function()
			{
				indexs2path(list51);
			})
			.add('seajscombo'+key, function()
			{
				seajsCombo(list52);
			})
			.on('cycle', function(event)
			{
				showMsg(String(event.target));
			})
			.on('complete', function()
			{
				showMsg('Fastest is ' + this.filter('fastest').map('name'));
			});
	}


	// 排重
	function uniqdepsBenchmark()
	{
		stringify.indexs2groups(list51);
		uniqdeps(list52);

		var suite = new Benchmark.Suite;
		return suite.add('indexs2groups'+key, function()
			{
				stringify.indexs2groups(list51);
			})
			.add('uniqdeps'+key, function()
			{
				uniqdeps(list52);
			})
			.on('cycle', function(event)
			{
				showMsg(String(event.target));
			})
			.on('complete', function()
			{
				showMsg('Fastest is ' + this.filter('fastest').map('name'));
			});
	}

	return [
		index2binaryBenchmark(),
		urlStringifyBenchmark(),
		uniqdepsBenchmark()
	];
}



function runSuites(arr, callback, index)
{
	index || (index = 0);

	var suite = arr[index];
	if (suite)
	{
		suite.on('complete', function()
			{
				runSuites(arr, callback, ++index);
			})
			.run({async: true});
	}
	else
	{
		callback && callback();
	}
}


// in node
if (typeof window == 'undefined')
{
	runSuites(runHandler(4, console.log));
}
else
{
	// fix benchmark
	window.define = {amd: {}};

	if (window.__karma__)
	{
		// 使用karma-benchmark就要改写代码风格
		// 不舒服，所以可以兼容一下，然后使用他的runner和reporter
		if (window.__karma_benchmark_suites__)
		{
			window.__karma_benchmark_suites__ = runHandler(4, console.log);
		}
		// 如果不使用那个framework，就自己重写一下apator
		else
		{
			window.__karma__.start = function()
			{
				runSuites(runHandler(4, console.log), function()
					{
						window.__karma__.complete(
						{
							coverage: global.__coverage__
						});
					});
			};
		}
	}
	else
	{
		runSuites(runHandler(4, window.showBenchmarkHandler || (window.console && console.log)));
	}
}
