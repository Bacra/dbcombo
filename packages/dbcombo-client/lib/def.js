'use strict';

var HEX = 32;
var EACH_GROUP_FILE_NUM = exports.EACH_GROUP_FILE_NUM = HEX-1;


var MAX_GROUP_KEY_LENGTH = exports.MAX_GROUP_KEY_LENGTH = Math.pow(2, EACH_GROUP_FILE_NUM).toString(HEX).length;

// 只有>= 这个key，才能达到MAX_GROUP_KEY_LENGTH表示长度
var MAX_ONE_KEY = (HEX-1).toString(HEX);
var MIN_FULL_GROUP_KEY = new Array(MAX_GROUP_KEY_LENGTH).join(MAX_ONE_KEY);
exports.MIN_FULL_GROUP_KEY_LENGTH = parseInt(MIN_FULL_GROUP_KEY, HEX)+1;

// 受到文件夹长度限制
// http://stackoverflow.com/questions/14500893/is-the-255-char-limit-for-filenames-on-windows-and-unix-the-whole-path-or-part
exports.MAX_GROUP_URI = 250/MAX_GROUP_KEY_LENGTH | 0;
