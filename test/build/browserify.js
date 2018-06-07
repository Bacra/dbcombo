'use strict';

var browserify = require('browserify');
var fs = require('fs');
var b = browserify();
b.add(__dirname+'/../../src/seajs-plugin.js');
b.bundle().pipe(fs.createWriteStream(__dirname+'/../../dist/seajs-plugin.js'));

var b = browserify();
b.add(__dirname+'/../../benchmark/benchmark.js');
b.bundle().pipe(fs.createWriteStream(__dirname+'/../../dist/benchmark4browser.js'));
