/**
 *  file-name : AlgoUtil.js
 *
 *  @author   : Prabhat Kumar <prabhat.kumar@ucertify.com>
 *  @version  : 1.0
 *  @package  : helper/AlgoUtil.js
 *  @detail   : responsible managing utility functions for algorithimic contents
 *  Last updated by   : Prabhat Kumar <prabhat.kumar@ucertify.com>
 *  Last updated date : 08 July 2021
 */
// functions required in algo
export default class AlgoUtil {
    constructor() { }
	randInt( a, b, c = false ) {
		var unique = this.unique;
		if ( c ) {
			if ( unique != "" ) {
				var de = this.mt_rand( a, b );
				if ( unique[0] == de ) {
					this.randInt( a, b, true );
				} else {
					unique = [];
					this.unique = unique;
					return de;
				}
			} else {
				d            = this.mt_rand( a, b );
				unique[0]    = d;
				this.unique = unique;
				return d;
			}
		}
		return this.mt_rand( a, b );
	}

	// Function to get the random number between min and max value.
	mt_rand (min, max) { 
		min = parseInt(min, 10);
		max = parseInt(max, 10);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	randFloat( a, b, c ) {
		var dec        = Math.pow( 10, c );
		expression = mt_rand( a * dec, b * dec ) / dec;
		return this.number_format( expression, c );
	}
	
    randObj() {
		var array = arguments;
		var a     = arguments.length;
		if ( a == 1 ) {
			array = array[0].split(',');
		}
		var len    = array.length;
		var number = this.mt_rand( 0, len - 1 );
		return array[number];
	}
	
    reduced() {
		var input = arguments;
		var count = arguments.length;
		if ( count < 1 ) {
			return ''; // empty input
		}
		if ( count == 1 ) {
			return input[0]; // only 1 input
		}

		var gcd = this.gcd( input[0], input[1] ); // find gcd of inputs
		for ( var i = 2; i < count; i++ ) {
			gcd = this.gcd( gcd, input[ i ] );
		}
		var $var = input[0] / gcd; // init output
		for ( var i = 0; i < count; i++ ) {
			$var = ( input[ i ] / gcd ); // calc ratio
			return $var;
		}
	}
	
    gcd( a, b ) {
		if ( a == 0 || b == 0 ) {
			return Math.abs( max( Math.abs( a ), Math.abs( b ) ) );
		}

		r = a % b;
		return ( r != 0 ) ? this.gcd( b, r ) : Math.abs( b );
	}
	
    ucSqrt( a, b, c = 1 ) {
		var sum = Math.sqrt(a);
		if ( c == 0 ) {
			return Math.round( sum, b );
		} else {
			return this.number_format( sum, b );
		}
	}
	
    ucPow( a, b ) {
		return Math.pow( a, b );
	}
	
    ucAbs( a ) {
		return Math.abs( a );
	}
	
    ucRound( a ) {
		return Math.round( a );
	}
	
    current( item ) {
		return this.algo_var_list[ item ];
	}
	
    evalCondition( expression, true_result, false_result ) {
		if ( expression ) {
			return true_result;
		} else {
			return false_result;
		}
	}
	
    fixed( expression, a, b = 1 ) {
		if ( b == 0 ) {
			return Math.round( expression, a );
		} else {
			return this.number_format( expression, a );
		}
	}

    number_format (number, decimals, dec_point, thousands_sep) {
		// Strip all characters but numerical ones.
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + Math.round(n * k) / k;
			};
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}
    compareValue( var1, var2, greater_output, smaller_output, equal_output ) {
		if ( var1 > var2 ) {
			return greater_output;
		} else if ( var1 < var2 ) {
			return smaller_output;
		} else if ( var1 == var2 ) {
			return equal_output;
		}
	}
	
    groupObj( objects, group_alias ) {
		var group   = this.group;
		var obj_arr = objects.split(',');
		if ( group[group_alias] != "" ) {
			var len                = obj_arr.length;
			var index              = this.mt_rand(0, len - 1);
			group[ group_alias ]   = index;
			this.group             = group;
			var objVal             = this.breakgroupObjString(obj_arr[index]);
			return objVal;
		} else {
			var index   = group[ group_alias ];
			var obj_arr = objects.split(',');
			var objVal  = this.breakgroupObjString(obj_arr[index]);
			return objVal;
		}
	}
	
    breakgroupObjString( str ) {
		if ( str.indexOf( '#' ) != -1) {
			var stringArray = str.split('#');
			var k           = this.array_rand( stringArray );
			return stringArray[k];
		} else {
			return str;
		}
	}

	array_rand (array, num) { 
		const keys = Object.keys(array)
		if (typeof num === 'undefined' || num === null) {
			num = 1
		} else {
			num = +num
		}
		if (isNaN(num) || num < 1 || num > keys.length) {
			return null
		}
		// shuffle the array of keys
		for (let i = keys.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1)) // 0 ≤ j ≤ i
			const tmp = keys[j]
			keys[j] = keys[i]
			keys[i] = tmp
		}
		return num === 1 ? keys[0] : keys.slice(0, num)
	}

    randomStep( min, max, step ) {
		var tempArray = [];
		if ( min < max ) {
			var count = 0;
			tempArray[count] = min;
			for ( var i = min; i <= max; i++ ) {
				min = min + step;
				if ( min <= max ) {
					count++;
					tempArray[count] = min;
				}
			}
		}
		return ( tempArray.length != 0 ) ? tempArray[this.array_rand(tempArray)] : 0;
	}
	
    randpythagorus( index, min, max = '' ) {
		if ( index == 1 ) {
			var c        = 0;
			var m        = min;
			var limit    = max;
			var temp_arr = [];
			var count = 0;
			while ( c < limit ) {
				for ( var n = 1; n < m; ++n ) {
					a = m * m - n * n;
					b = 2 * m * n;
					c = m * m + n * n;
					if ( c > limit ) {
						break;
					}
					
					temp_arr[count] = a;
					temp_arr[count] = b;
					count++;
				}
				m++;
			}
			var k = this.array_rand(temp_arr);
			var v = temp_arr[k];
			return v;
		} else if ( index == 2 || index == 3 ) {
			var n = min;
			if ( n == 1 || n == 2 ) {
			} else if ( n % 2 == 0 ) {
				var var1 = n * n / 4;
				return ( index == 2 ) ? ( var1 - 1 ) : ( var1 + 1 );
			} else if ( n % 2 != 0 ) {
				var var1 = n * n + 1;
				return ( index == 2 ) ? ( var1 / 2 - 1 ) : ( var1 / 2 );
			}
		}
	}
}
