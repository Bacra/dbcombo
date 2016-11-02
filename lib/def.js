var EACH_GROUP_FILE_NUM = exports.EACH_GROUP_FILE_NUM = 31;
var MAX_GROUP_KEY_LENGTH = exports.MAX_GROUP_KEY_LENGTH = Math.pow(2, EACH_GROUP_FILE_NUM).toString(32).length;
// 受到文件夹长度限制
// http://stackoverflow.com/questions/14500893/is-the-255-char-limit-for-filenames-on-windows-and-unix-the-whole-path-or-part
exports.MAX_GROUP_URI = 250/MAX_GROUP_KEY_LENGTH | 0;
