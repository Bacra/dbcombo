var DEF = require('./def');
var EACH_GROUP_FILE_NUM = DEF.EACH_GROUP_FILE_NUM;
var MAX_GROUP_KEY_LENGTH = DEF.MAX_GROUP_KEY_LENGTH;
var MATH_LOGE2 = Math.log(2);

function str2groups(str)
{
	var arr = str.split('');
	var groups = [];
	var index = 0;
	var groupval = '';

	for(var i = arr.length, val; i--;)
	{
		val = arr[i];
		// Z是跳过的31位，Y是不足7位时候的补位
		if (val == 'Z' || val == 'Y' || val == 'X')
		{
			if (groupval) groups[index] = parseInt(groupval, 32);
			groupval = '';

			// 重复Repeat Z的优化写法
			if (val == 'X')
			{
				var skipStr = '';
				for(i--; i && arr[i] != 'W'; i--)
				{
					skipStr = arr[i]+skipStr;
				}
				var skipLen = Number(skipStr);
				if (!skipLen) throw new Error('INVALID REPEAT MARK W/X,'+arr[i]+skipStr+'X');
				index += skipLen;
			}
			else
			{
				index++;
			}
		}
		else if (val == 'W')
		{
			throw new Error('INVALID REPEAT MARK W/X,W');
		}
		else if (val != '/')
		{
			groupval = val + groupval;
			// 31位数字parse之后，长度最长为7
			if (groupval.length >= MAX_GROUP_KEY_LENGTH)
			{
				if (groupval) groups[index] = parseInt(groupval, 32);
				index++;
				groupval = '';
			}
		}
	}

	if (groupval) groups[index] = parseInt(groupval, 32);

	return groups;
}

function num2indexs(num, offset)
{
	var indexs = [];
	for(var index = 0; num; index++, num = num >>> 1)
	{
		if (num & 1)
		{
			indexs.push(offset+index);
		}
	}

	return indexs;
}

function groups2indexs(groups)
{
	var indexs = [];

	for(var i = 0, len = groups.length, result; i < len; i++)
	{
		result = num2indexs(groups[i], i * EACH_GROUP_FILE_NUM);
		Array.prototype.push.apply(indexs, result);
	}

	return indexs;
}

function parse(str)
{
	return groups2indexs(str2groups(str));
}


function maxIndexInGroup(groups)
{
	var lastIndex = groups.length -1;
	var lastItem = groups[lastIndex];
	return lastIndex*EACH_GROUP_FILE_NUM+Math.log(lastItem)/MATH_LOGE2 | 0;
}

exports = module.exports = parse;
exports.str2groups = str2groups;
exports.num2indexs = num2indexs;
exports.groups2indexs = groups2indexs;
exports.maxIndexInGroup = maxIndexInGroup;
