var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var stringify = require('../lib/stringify');
var indexs2path = require('./indexs2path');
var seajsCombo = require('./seajs-combo-sethash');

var list51 = [12, 33, 200, 800, 10000];
var list52 = [
	'js/mail/seajs/combo.js',
	'js/mail/list/listhandler.js',
	'js/mail/list.js',
	'js/mail/list/listhandler2.js',
	'js/mail/list/listhandler3.js'
];


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

	stringify(list51);
	indexs2path(list51);
	seajsCombo(list52);

	var key = '#'+list52.length;


	// 添加测试
	suite.add('stringify'+key, function()
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
		})
		.run({ 'async': true });
}


// in node
if (typeof window == 'undefined')
	runHandler(4, console.log);
else
	window.runBenchmarkHandler = runHandler;
