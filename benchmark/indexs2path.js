'use strict';

module.exports = indexs2hash;

function indexs2hash(indexs)
{
  var result = [];
  var str = [];
  var len = 0;

  for(var i = indexs.length; i--;)
  {
    var newStr = ''+indexs[i];
    len+=newStr.length+1;
    if (len > 250)
    {
      len = newStr.length;
      result.push(str.join(','));
      str = [];
    }

    str.push(newStr);
  }

  if (str.length)
  {
    result.push(str.join(','));
  }

  return result.join('/');
}
