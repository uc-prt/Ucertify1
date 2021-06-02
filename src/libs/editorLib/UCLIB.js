/**
 *  File Name   : UCLIB.js
 *  Author      : Binit Rai
 *  Function    : UCLIB
 *  Version     : 1.0
 *  Packege     : pegoldnative
 *  Last update : 30 April 2016
 *  Deoendency  : No any dependency ( Core javascript library )
 */
var UCLIB = {};
//var FACTS = require('./CATFACTS.js')

UCLIB.ucfirst = function ( s ) {
  s += '';
  let f = s.charAt(0).toUpperCase();
  return f + s.substr(1);
};

UCLIB.decbin  = function ( number ) {
  if ( number < 0 ) number = 0xFFFFFFFF + number + 1;
  return parseInt(number, 10).toString(2);
};

UCLIB.bindec  = function ( binStr ) {
  binStr = (binStr + '').replace(/[^01]/gi, '');
  return parseInt(binStr, 2)
};

UCLIB.strrev = function ( string ) {
  string = string + '';
  var chars =  FACTS.uniChars;
  var graphemeExtend = new RegExp('(.)([' + chars.join('') + ']+)', 'g')
  string = string.replace(graphemeExtend, '$2$1')
  return string.split('').reverse().join('')
};

UCLIB.isDefined = v => typeof v != 'undefined' && v != "";
UCLIB.isObject  = v => UCLIB.isDefined(v) && typeof v == 'object';

UCLIB.changeObjectKey = function ( obj, prefix ) {
  var temp = {};
  for ( key in obj ) {
    let newKey = prefix+key;
    temp[newKey] = obj[key];
  }
  return temp;
};

UCLIB.replaceSpclInObjKey = function ( obj, symbolFind, symbolReplace  ) {
  var temp = {};
  for ( key in obj ) {
    let newKey = key;
    if ( key.indexOf(symbolFind) !== -1 ) {
      newKey = key.replace('.','-');
    }
    temp[newKey] = obj[key];
  }
  return temp;
};

UCLIB.ucwords = function ( s ) {
 return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
      return $1.toUpperCase();
    });
};

UCLIB.chr = function ( codePt ) {
  if (codePt > 0xFFFF) {
    codePt -= 0x10000
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF))
  }
  return String.fromCharCode(codePt)
};

UCLIB.rand = function ( min, max ) {
  var argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
};

UCLIB.isNumeric = function ( mixin ) {
  var whitespace =
    ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  return (typeof mixin === 'number' || (typeof mixin === 'string' && whitespace.indexOf(mixin.slice(-1)) ===
    -1)) && mixin !== '' && !isNaN(mixin);
};

UCLIB.is_int = function ( mixed_var  ) {
 return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
};

UCLIB.is_object = function ( mixed_var ) {
  if ( Object.prototype.toString.call(mixed_var) === '[object Array]' ) {
    return false;
  }
  return mixed_var !== null && typeof mixed_var === 'object';
};

UCLIB.in_array = function ( needle, haystack, argStrict ) {
  var key = '',
    strict = !!argStrict;
  if ( strict ) {
    for ( key in haystack ) {
      if ( haystack[key] === needle ) {
        return true;
      }
    }
  } else {
    for ( key in haystack ) {
      if ( haystack[key] == needle ) {
        return true;
      }
    }
  }
  return false;
};

UCLIB.array_reverse = function ( array, preserve_keys ) {
  var isArray = Object.prototype.toString.call(array) === '[object Array]',
  tmp_arr = preserve_keys ? {} : [],key;
  if ( isArray && !preserve_keys ) {
    return array.slice(0).reverse();
  }
  if ( preserve_keys ) {
    var keys = [];
    for (key in array) {
      keys.push(key)
    }
    var i = keys.length
    while ( i-- ) {
      key = keys[i];
      tmp_arr[key] = array[key];
    }
  } else {
    for ( key in array ) {
      tmp_arr.unshift(array[key]);
    }
  }
  return tmp_arr;
};

UCLIB.array_slice = function ( arr, offst, lgth, preserve_keys ) {
  var key = '';
  if ( Object.prototype.toString.call(arr) !== '[object Array]' ||
    (preserve_keys && offst !== 0)) {
    var lgt = 0, newAssoc = {};
    for ( key in arr ) {
      lgt           += 1;
      newAssoc[key] = arr[key];
    }
    arr  = newAssoc;
    offst = (offst < 0) ? lgt + offst : offst;
    lgth  = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;
    var assoc = {}; var start = false, it = -1,arrlgth = 0, no_pk_idx = 0
    for ( key in arr ) {
      ++it;
      if ( arrlgth >= lgth ) {
        break;
      }
      if ( it == offst ) {
        start = true;
      }
      if ( !start ) {
        continue;
      }
      ++arrlgth;
      if (UCLIB.is_int(key) && !preserve_keys) {
        assoc[no_pk_idx++] = arr[key];
      } else {
        assoc[key] = arr[key];
      }
    }
    return assoc;
  }
  if ( lgth === undefined ) {
    return arr.slice(offst);
  } else if ( lgth >= 0 ) {
    return arr.slice(offst, offst + lgth);
  } else {
    return arr.slice(offst, lgth);
  }
};

UCLIB.strPad = function ( ipStr, pLen, pStr, pType ) {
  var _half = '', _padToGo;
  var strPadLoop = function (s, len) {
    var _clct = '',i;
    while ( _clct.length < len ) {
      _clct += s;
    }
    _clct = _clct.substr(0, len);
    return _clct;
  };
  ipStr += '';
  pStr = pStr !== undefined ? pStr : ' ';
  if ( pType !== 'STR_PAD_LEFT' && pType !== 'STR_PAD_RIGHT' && pType !== 'STR_PAD_BOTH' ) {
     pType = 'STR_PAD_RIGHT';
  }
  if ( ( _padToGo = pLen - ipStr.length ) > 0 ) {
    if ( pType === 'STR_PAD_LEFT' ) {
      ipStr = strPadLoop(pStr, _padToGo) + ipStr;
    } else if ( pType === 'STR_PAD_RIGHT' ) {
      ipStr = ipStr + strPadLoop(pStr, _padToGo);
    } else if (pType === 'STR_PAD_BOTH') {
      _half = strPadLoop(pStr, Math.ceil(_padToGo / 2));
      ipStr    = _half + ipStr + _half;
      ipStr    = ipStr.substr(0, pLen);
    }
  }
  return ipStr;
};

UCLIB.explode = function ( delimiter, string, limit ) {
  if ( arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
  if ( delimiter === '' || delimiter === false || delimiter === null) return false;
  if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
    'object') {
    return {0: ''};
  }
  if ( delimiter === true ) delimiter = '1';
  delimiter += '';
  string += '';
  var s = string.split(delimiter);
  if (typeof limit === 'undefined') return s;
  if (limit === 0) limit = 1;
  if (limit > 0) {
    if (limit >= s.length) return s;
    return s.slice(0, limit - 1)
      .concat([s.slice(limit - 1)
        .join(delimiter)
      ]);
  }
  if (-limit >= s.length) return []
  s.splice(s.length + limit)
  return s;
};

UCLIB.implode = function ( glue, pieces ) {
  var i = '', retVal = '', tGlue = '';
  if ( arguments.length === 1 ) {
    pieces = glue;
    glue   = '';
  }
  if ( typeof pieces === 'object' ) {
    if ( Object.prototype.toString.call(pieces) === '[object Array]' ) return pieces.join(glue);
    for ( i in pieces ) {
      retVal += tGlue + pieces[i];
      tGlue   = glue;
    }
    return retVal;
  }
  return pieces;
};

UCLIB.array_filter  = function (arr, func) {
  var retObj = {}, k;
  func = func || function (v) {
    return v;
  }
  if (Object.prototype.toString.call(arr) === '[object Array]') retObj = [];
  for ( k in arr ) {
    if (func(parseInt(arr[k]))) retObj[k] = arr[k]
  }
  return retObj
};

UCLIB.strpos = function ( str, find, init ) {
  var i = (str + '').indexOf(find, (init || 0));
  return i === -1 ? false : i;
};

UCLIB.stripos = function ( str, find, init ) {
  var _str = (str + '').toLowerCase() , _find = (find + '').toLowerCase(), _idx = 0;
  if ( ( _idx = _str.indexOf(_find, init)) !== -1 ) return _idx;
  return false;
};

UCLIB.str_ireplace = function ( search, replace, subject, countObj ) {
  var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0, f = '', r = '', s = '', ra = '', otemp = '', oi = '', ofjl = '';
  var os = subject;
  var osa = Object.prototype.toString.call(os) === '[object Array]';
  if ( typeof (search) === 'object') {
    temp = search;
    search = [];
    for (i = 0; i < temp.length; i += 1) {
      search[i] = temp[i].toLowerCase();
    }
  } else {
    search = search.toLowerCase();
  }
  if (typeof (subject) === 'object') {
    temp = subject;
    subject = [];
    for (i = 0; i < temp.length; i += 1) {
      subject[i] = temp[i].toLowerCase();
    }
  } else {
    subject = subject.toLowerCase()
  }
  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace;
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp;
    }
  }
  temp = '';
  f    = [].concat(search);
  r    = [].concat(replace);
  ra   = Object.prototype.toString.call(r) === '[object Array]';
  s    = subject;
  s    = [].concat(s);
  os   = [].concat(os);
  if ( countObj ) {
    countObj.value = 0;
  }
  for (i = 0, sl = s.length; i < sl; i++) {
    if ( s[i] === '' ) {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      otemp = os[i] + '';
      oi = temp.indexOf(f[j]);
      ofjl = f[j].length;
      if (oi >= 0) {
        os[i] = (otemp).split(otemp.substr(oi, ofjl)).join(repl);
      }
      if ( countObj ) {
        countObj.value += ((temp.split(f[j])).length - 1);
      }
    }
  }
  return osa ? os : os[0];
};

UCLIB.array_flip = function ( srcArray ) {
  var key, destArray = {};
  if ( srcArray && typeof srcArray === 'object' && srcArray.change_key_case ) {
    return srcArray.flip();
  }
  for ( key in srcArray ) {
    if ( !srcArray.hasOwnProperty(key) ) {
      continue;
    }
    destArray[srcArray[key]] = key;
  }
  return destArray;
};

UCLIB.array_unique = function ( inputArr ) {
  var key = '', opArr = {}, val = '';
  var _arrayFind = function ( n, srcArray ) {
    var fkey = '';
    for ( fkey in srcArray  ) {
      if ( srcArray.hasOwnProperty(fkey) ) {
        if ( (srcArray[fkey] + '') === (n + '') ) {
          return fkey;
        }
      }
    }
    return false;
  };
  for (key in inputArr) {
    if ( inputArr.hasOwnProperty(key) ) {
      val = inputArr[key]
      if (false === _arrayFind(val, opArr)) {
        opArr[key] = val;
      }
    }
  }
  return opArr;
};

UCLIB.array_merge = function (obj1, obj2) {
    var obj3 = {};
    for (let attrname in obj1) { 
      obj3[attrname] = obj1[attrname];
    }
    for (let attrname in obj2) {
      obj3[attrname] = obj2[attrname]; 
    }
    return obj3;
}

UCLIB.is_array = function ( arrayVar) {
  return ( (arrayVar.constructor === Array )? true : false );
}

UCLIB.shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

UCLIB.count = function ( arrayVar) {
  if( arrayVar.constructor === Array ) {
    return arrayVar.length;
  }
  else {
    return 0;
  }
}

UCLIB.ord = function ( string ) {
  var str = string + '', code = str.charCodeAt(0);
  if ( 0xD800 <= code && code <= 0xDBFF ) {
    var hi = code;
    if ( str.length === 1) {
      return code;
    }
    var low = str.charCodeAt(1);
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
  }
  if ( 0xDC00 <= code && code <= 0xDFFF ) {
    return code;
  }
  return code;
};

UCLIB.array_values = function ( iArray ) {
  var opArr = [], key = '';
  if ( iArray && typeof iArray === 'object' && iArray.change_key_case ) {
    return iArray.values();
  }
  for (key in iArray) {
    opArr[opArr.length] = iArray[key]
  }
  return opArr;
};

UCLIB.extend = function (obj, src) {
  Object.keys(src).forEach( function (key) { 
      if(obj[key] == src[key]){}
      else{obj[key] = src[key];}
    });
  return obj;
};

UCLIB.utf8_encode = function ( argString ) {
  if ( argString === null || typeof argString === 'undefined' ) {
    return '';
  }
  var string = (argString + '');
  var utftext = '', start, end, stringl = 0;
  start = end = 0;
  stringl = string.length;
  for ( var n = 0; n < stringl; n++ ) {
    var c1 = string.charCodeAt(n);
    var enc = null;
    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      );
    } else if ((c1 & 0xF800) != 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    } else {
      if ((c1 & 0xFC00) != 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      var c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) != 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }
  if (end > start) {
    utftext += string.slice(start, stringl);
  }
  return utftext;
}

UCLIB.md5 = function ( str ) {
  var xl;
  var rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  };
  var addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };
  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function (x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)));
  };
  var _FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var _GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b);
  };
  var _HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var _II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  var convertToWordArray = function (str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  var wordToHex = function (lValue) {
    var wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValue_temp = '0' + lByte.toString(16)
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2)
    }
    return wordToHexValue
  }
  var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14,
    S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  str = UCLIB.utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
  return temp.toLowerCase()
};

UCLIB.baseConvert = function ( ip, iBase, oBase ) {
  if ( typeof ip != 'string' ) ip = ip.toString();
  if ( iBase == 64 || oBase == 64 ) {
      var _range = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz()';
    } else {
    var _range = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    }
    _range         = _range.split('');
    var _iRange    = _range.slice(0, iBase);
    var _lRange    = _range.slice(0, oBase);

    var _decVal = ip.split('').reverse().reduce( function ( carry, digit, index ) {
      if ( _iRange.indexOf( digit ) === -1 ) throw new Error('Invalid digit `'+digit+'` for base '+iBase+'.');
      return carry += _iRange.indexOf(digit) * (Math.pow(iBase, index));
    }, 0);

  var _op = '';
  while ( _decVal > 0 ) {
    _op     = _lRange[ _decVal % oBase ] + _op;
    _decVal = ( _decVal - ( _decVal % oBase ) ) / oBase;
  }

  return _op || '0';
};

UCLIB.GUID64_decode =  s => UCLIB.baseConvert(s, 64, 10);

UCLIB.GUID64_encode = ( i, size = 2 ) => {
  let _str = UCLIB.baseConvert( i, 10, 64 );
  return UCLIB.strPad( _str, size, "0", "STR_PAD_LEFT" );
};

UCLIB.shuffleArray = ( array ) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j    = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

UCLIB.range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);

UCLIB.getRange =  (value, min_value, max_value, default_value) => {
  value = value || default_value;
  value = Math.min(max_value,Math.max(min_value,value));
  return value;
};

UCLIB.getDefault = (value, default_value) => value || default_value;

UCLIB.str2Pass = ( pwd ) => {
  let salt = 'ucertify';
  return UCLIB.md5(salt+pwd)
};

UCLIB.byte2array = function (byte, defarray, len = 1) {
  var bin = UCLIB.decbin(byte);
  bin = UCLIB.strrev(UCLIB.strPad(bin, 8 * len, "0", 'STR_PAD_LEFT'));
  var str = bin.split('');
  var i = 0, options = {};
  for( let j in defarray ) {
    options[j] = parseInt ( str[i] );
    i++;
  }
  return options;
};

UCLIB.getUserPoints = function(scoreByte, answerPoints) {
  scoreByte     = UCLIB.clearBit(scoreByte,7);
  scorePercent  = UCLIB.ord(scoreByte);
  userPoints    = Math.round ( parseInt(scorePercent) * parseInt( answerPoints ) / 100);
  return userPoints;
};

UCLIB.getUserQuestionStatus = function(timeSpent, answerPoints, userPoints){
  if (timeSpent <= 0) {
    status = -1;//unattempted
  }
  else {
    status = 1;//patially correct
    if (userPoints <= 0) {
      status = 0;//incorrect
    }
    else if (answerPoints == userPoints) {
      status = 2;//correct
    }
  } 
  return status;  
};

UCLIB.apiInitializeRandomSeq = function(ver, is_random, length) {
  strdata = String(ver);
  for ( let i = 0; i < length; i++ ) {   
    r = UCLIB.chr(0);
    if (is_random == 1) {
      r = UCLIB.chr(Math.random (0, 7));
    }
    strdata += r;
  }
  return strdata;
};

UCLIB.setUserAnswerStr = function(user_answer,ansSeqType = 0) {
  var num   = ['1','2','3','4','5','6','7','8'];
  var alpha = ['A','B','C','D','E','F','G','H'];
  var byte  = UCLIB.chr(0);
  if (typeof user_answer != 'object') {
    user_answer = user_answer.split(",");
  }
  for (let k in user_answer) {
    var i = user_answer[k];
    if (ansSeqType == 2) {
      i = UCLIB.getAnswerSeqStr(i, ansSeqType, true);
    }
    if (num.indexOf(i) > -1) {
      byte = UCLIB.setBit(byte, parseInt(i) - 1);
    }
    else if(alpha.indexOf(i) > -1) {
        byte = UCLIB.setBit(byte, UCLIB.ord(i.toLowerCase()) - 65);
      }
  }
  return byte;
};

UCLIB.setBookmark = function (byte, bookmark) {
  byte = (bookmark) ? UCLIB.setBit(byte, 7) : UCLIB.clearBit(byte, 7);
  return byte;
};

UCLIB.setScore = function (byte, user_points, answer_points) {
  bookmark = UCLIB.getBit(byte,7);
  if (parseInt(answer_points) <= 0) {
    answer_points = 1;
  }
  var score = Math.round(user_points * 100 / answer_points);
  score     = Math.min(score,100);
  byte      = UCLIB.chr(score);
  byte      = UCLIB.setBookmark(byte, bookmark);
  return byte;
};

UCLIB.testBit = function (int_type, offset) {
  int_type = parseInt( int_type );
  let mask = 1 << offset;
  return (int_type & mask);
};

UCLIB.getBit = function (byte, offset) {
  let int_type = UCLIB.ord(byte);
  let val = UCLIB.testBit(int_type, offset);
  if (val != "") {
      return 1;
  }
  return 0;
};

UCLIB.setBit = function(byte, offset){
    let int_type = UCLIB.ord(byte);
    let mask = 1 << offset;
    return UCLIB.chr(int_type | mask);
};

UCLIB.clearBit = function (byte, offset) {
    let int_type = UCLIB.ord(byte);
    let mask = ~ (1 << offset);
    return UCLIB.chr(int_type & mask);
};

UCLIB.getAnswerSeqStr = function (seq, type = 0, flip = false) {
  var ansSeq0 = {};
  if ( type == 1 ) {
    return seq;
  }
  else if (type == 2) {
    ansSeq0[1]  = "I";
    ansSeq0[2]  = "II";
    ansSeq0[3]  = "III";
    ansSeq0[4]  = "IV";
    ansSeq0[5]  = "V";
    ansSeq0[6]  = "VI";
    ansSeq0[7]  = "VII";
    ansSeq0[8]  = "VIII";
    ansSeq0[9]  = "IX";
    ansSeq0[10] = "X";
    if (flip) {
      rAnsSeq0 = {};
      rAnsSeq0 = UCLIB.array_flip(ansSeq0);
      return rAnsSeq0[seq];
    }
    return  ansSeq0[seq];
  }
  else {
    ansSeq0[1]  = "A";
    ansSeq0[2]  = "B";
    ansSeq0[3]  = "C";
    ansSeq0[4]  = "D";
    ansSeq0[5]  = "E";
    ansSeq0[6]  = "F";
    ansSeq0[7]  = "G";
    ansSeq0[8]  = "H";
    ansSeq0[9]  = "I";
    ansSeq0[10] = "J";
    return  ansSeq0[seq];
  } 
};

UCLIB.getTestTimeSpent = function (time_array, item_sequence) { 
  let index1     = (item_sequence * 2) -1;
  let index2     = (item_sequence * 2);
  let byte1      = time_array[index1]; 
  let byte2      = time_array[index2]; 
  let time_spent = parseInt( (UCLIB.ord(byte1) * 255) + (UCLIB.ord(byte2)) );
  return time_spent > 0 ? time_spent : 0;
}

UCLIB.setTestTimeSpent = function (time_array, item_sequence, timespent) {
  timespent      = parseInt(timespent);
  let time1      = Math.floor(timespent / 255);
  let time2      = timespent % 255;
  let timespent1 = Math.min(time1, 255);
  let timespent2 = Math.min(time2, 255);
  let byte1      = UCLIB.chr(timespent1);  
  let byte2      = UCLIB.chr(timespent2);  
  let str        = UCLIB.setByteInString(time_array, byte1,((item_sequence * 2) -1));
  str            = UCLIB.setByteInString(str, byte2, ((item_sequence * 2)));
  return str;
}

UCLIB.setByteInString = function (str, byte, position) {
  if (typeof str == 'object') {
    var array = true;
    str = str.join(",");
  }
  if ( position <= 0 ) {
    position = 0;
    str = byte + str.substr( parseInt( position ) + 1, 1);
  }
  else {
    str = str.substr(0, position).toString() + byte.toString() + str.substr( parseInt( position ) + 1).toString();
  }
  if ( array ) {
    str = str.split(",");
  }
  return str;
}

UCLIB.getBookmark = function (byte) {
  return UCLIB.getBit ( byte,7 );
};

UCLIB.getScore = function (byte, points = 1) {
  byte = UCLIB.clearBit( byte, 7 );
  let score_percent = UCLIB.ord( byte );
  return parseInt( score_percent );
};

UCLIB.getUserAnswerStr = function (byte, ansSeqType = 0) {
 var user_answer  = [], j = 0;
 var rang = UCLIB.range (0, 7) ;
 for (let k in rang ) {
   i = parseInt ( rang[k] );
   if ( UCLIB.getBit ( byte, i) == 1 ) {
      user_answer[j] = UCLIB.getAnswerSeqStr ( i+1, ansSeqType);
      j++;
    } 
 }
 return user_answer;
};

//@TODO:? @abhishek why we need this if else?= function (byte): done, not using anywhere {
UCLIB.getAnswerPoints = function (byte) {
     var point = UCLIB.ord ( byte );
     return parseInt( point );
};

UCLIB.cleanTest = function (ts) {
  var permission = { can_review : 1, can_result : 1, can_grade  : 0 };

  if ( ts['test_mode']>2 ) {
    permission.can_review = 0;
    permission.can_result = 0;
  }

  if ( ts['test_mode'] == 2 ) {
    permission.can_result = 1;
    permission.can_review = 0;
  }

  if ( ts['manual_grading'] == 1 && ts['is_test_over'] == 1 ) {
    permission.can_result = 0;
    permission.can_review = 0;
  }

  return permission;
};

UCLIB.api_setAnswerSeq = function (answers,total_answers=0,correct_answers=0,ansSeqType=0) {
  var i = 0;
  var total_answers = 0;
  var correct_answers = 0;

  for ( let akey in answers ) {
    a = answers[akey];
    total_answers++;

    if ( a['is_correct'] >= 1 ) {
      correct_answers ++;
    }

    var answer = a['answer'];
    answers[akey]["seq_str"] = UCLIB.getAnswerSeqStr(i+1,ansSeqType);
    aotpos = UCLIB.strpos(answer,"<!");
    if ( aotpos === false ) {
      aotpos = UCLIB.strpos(answer, "<seq no=");
      if (aotpos === false) {
          answers[akey]['seq_tag'] = '<seq no="'+UCLIB.chr(97 + i)+'" />' ;
      }
      else {
        aotendpos = UCLIB.strpos(answer, "/>");
        answers[akey]['seq_tag'] = answer.substr(aotpos, aotendpos - aotpos + 2);
      }

    }
    else {
       answers[akey]['seq_tag'] = answer.substr(aotpos, 5);
    }
    i++;
  }
 
  return answers;
};

UCLIB.replaceAnsSeq = function ( explanation, answers ) {
  if ( !explanation.includes("<seq no=") ) return explanation;

  for (let i in answers) {
    let a = answers[i];
    explanation = explanation.split(a['seq_tag']).join(a['seq_str']);
  }
  return explanation;
};

UCLIB.addCorrectAnswerStr = function ( answers ) {
  var correct = [];
  for ( let i in answers ) {
    let ans  = answers[i];
    if ( ans.is_correct == '1') {
      correct.push(ans.seq_str);
    } 
  }
  return correct.join(',');
};

module.exports = UCLIB;
