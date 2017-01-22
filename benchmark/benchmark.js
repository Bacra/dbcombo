var stringify = require('../lib/stringify');
var indexs2path = require('./indexs2path');
var seajsCombo = require('./seajs-combo-sethash');
var uniq_objmap = require('./uniq_objmap');
var uniq_arrmap = require('./uniq_arrmap');
var DEF = require('../lib/def');

// Suppress warnings and errors logged by benchmark.js when bundled using webpack.
// https://github.com/bestiejs/benchmark.js/issues/106
var Benchmark = require('benchmark').runInContext(
	{
		'_': require('lodash'),
		'platform': require('platform')
	});

// 修正karma中运行，需要window下的全局Benchmark
if (typeof window == 'object') window.Benchmark = Benchmark;


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
				var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
				for(var i = EACH_GROUP_FILE_NUM; i--;)
				{
					init = init | (1 << i);
				}
			})
			.add('map', function()
			{
				var init = 12;
				var map = indexMap;
				var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
				for(var i = EACH_GROUP_FILE_NUM; i--;)
				{
					init = init | map[i];
				}
			})
			.add('arr', function()
			{
				var init = 12;
				var map = indexArr;
				var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
				for(var i = EACH_GROUP_FILE_NUM; i--;)
				{
					init = init | map[i];
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
	function uniqBenchmark()
	{
		stringify.indexs2groups(list51);
		uniq_arrmap(list51);
		uniq_objmap(list52);

		var suite = new Benchmark.Suite;
		return suite.add('indexs2groups'+key, function()
			{
				stringify.indexs2groups(list51);
			})
			.add('arrmap'+key, function()
			{
				uniq_arrmap(list51);
			})
			.add('objmap'+key, function()
			{
				uniq_objmap(list52);
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
		uniqBenchmark()
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
	var tc = window.__karma__;

	if (tc)
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
			tc.start = function()
			{
				var arr = runHandler(4, console.log);
				var len = 0;
				for(var i = arr.length; i-- && arr[i];)
				{
					len++;
					arr[i].on('complete', function()
						{
							tc.result({success: true});
						})
						.on('error', function()
						{
							tc.result({success: false});
						});
				}

				tc.info({total: len});

				runSuites(arr, function()
					{
						tc.complete(
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
