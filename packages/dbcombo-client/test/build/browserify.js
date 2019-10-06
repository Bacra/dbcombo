'use strict';

var browserify = require('browserify');
var fs = require('fs');
var b = browserify();
b.add(__dirname+'/../../src/seajs-plugin.js');
b.bundle().pipe(fs.createWriteStream(__dirname+'/../../dist/seajs-plugin.js'));

var b2 = browserify();
b2.add(__dirname+'/../../benchmark/benchmark.js');
b2.bundle().pipe(fs.createWriteStream(__dirname+'/../../dist/benchmark4browser.js'));
