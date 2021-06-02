var ALGO = ALGO || {mathtype:""};

ALGO.init = function (algostr, genereted_str) {	
	let var_list = '';
	try {
		var_list = ALGO.util.generateVariables (algostr, genereted_str);
	} catch(e) {
		swal({
			html: true,          
			title: '',
			text: "<b>"+e+"<br/><br/>Variables are not correctly defined!</b>",
			type: "error"
		});
	}
	console.log('var llist',var_list);
	return var_list;
};

ALGO.util = {
	generateVariables : function (algostr, genereted_str) {
		const regex_mathtype = /is_advance[\s]*=([\s"'\d]*)/;
		//if (genereted_str != "" && genereted_str != "undefined") {
			//return JSON.parse(genereted_str);
		//} else {
			let fnName = "",
				var_list = {};				
			var xml = algostr.split("\n");
			try {			
                ALGO.mathtype = +xml[0].match(regex_mathtype)[1].match(/[\d]+/);
			} catch(err) {
                ALGO.mathtype = "";
			}		
			for (let i = 0; i < xml.length; i++) {			
                let xml_id = xml[i],
				xml_arr = xml_id.split("=");
				fnName = xml_arr[1].substr(0, xml_arr[1].indexOf('(')).trim();	
				switch (fnName) {
					case "rand_int":
					fnName = "randInt";
					break;
					case "rand_float":
						fnName = "randFloat";
						break;
					case "uc_sqrt":
						fnName = "ucSqrt";
						break;
					case "rand_obj":
						fnName = "randObj";
						break;
				}	
				if (typeof ALGO.math[fnName] != 'object') {
					fnName = "";
				}					
				if (fnName != "") {	 
					const regExp = /\(([^)]+)\)/;
					let val_eval = [],
					matches = regExp.exec(xml_arr[1]),
					min,
					max,
					fix_decimal;
					switch (fnName.trim()) {
						case "randInt":
							val_eval = matches[1].split(',');	
							min = parseInt(val_eval[0]);
							max = parseInt(val_eval[1]);
							fix_decimal = parseInt(val_eval[2]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
							break;
						case "randFloat":
							val_eval = matches[1].split(',');					
							min = parseFloat(val_eval[0]);
							max = parseFloat(val_eval[1]);								
							fix_decimal = parseInt(val_eval[2]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
							break;
						case "ucSqrt":
							val_eval = matches[1].split(',');	
							min = parseInt(val_eval[0]);
							max = parseInt(val_eval[1]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min, max);
							break;
						case "ucPow":
							val_eval = matches[1].split(',');	
							min = parseInt(val_eval[0]);
							max = parseInt(val_eval[1]);
							fix_decimal = parseInt(val_eval[2]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
						break;						
						default:		
							let string = JSON.stringify(matches[1]);					
							string = string.trim().replace(/"|\\/g,'');					
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (string);
					}						 
				}
				if (fnName == "") {								
					const regExp_arth = /(\*|\+|\-|\/|\^|\%|\(|\)|\,|\[|\]|\#)/g,
						regExp_semicolon = /;|\\/g;				
					let test = xml_arr[1].split(regExp_arth),
						expression = "";
					var iscartesian = false;			
					for (let j = 0; j < test.length; j++) {
						test[j] = test[j].trim();
						if (test[j] != ";" && test[j] != "") {
							test[j] = test[j].replace(regExp_semicolon,'');
							if (test[j] == "#") {
								test[j] = "'";								
							} else {
								test[j] = var_list.hasOwnProperty(test[j]) ? var_list[test[j]] : isNaN(+test[j])?test[j]:+test[j];
							}
							let t = test[j];
							t = typeof t == "string" ? t.trim() : t;						
							if (t == 'math.setCartesian') {								
								iscartesian = true;
							}
							expression = expression + test[j];
						} else {
							continue;
						}
					}		
					if (ALGO.mathtype == 2) {
						if (iscartesian == true) {
							var testing = eval(expression),
								str = "";
							for (var k=0;k<testing.length;k++) {
								testing[k] = "("+testing[k]+") ";
								str = str+testing[k];
							}	
							var_list[xml_arr[0].trim()] = str;
						}					
						if (!iscartesian) {
							var_list[xml_arr[0].trim()] = eval(expression).toString();					
						}						
						if (var_list[xml_arr[0].trim()] == "") {
							var_list[xml_arr[0].trim()] = "None of these"
						}				
					} 
					if (ALGO.mathtype == "") {						
						var_list[xml_arr[0].trim()] = eval(expression.trim());
					}
				}				
			}	
			return var_list;
		//}
    }
};
ALGO.init.replaceVariables = function (latex_str, var_list) {
    for (let i in var_list) {
		let temp = "<\{"+i+"\}>";
		var re = new RegExp(temp, "g");
        latex_str = latex_str.replace(re, var_list[i]);		
    }	
    return latex_str;
}

ALGO.math = {
	randObj : {
		text:"Randomize Object",
		description:"Find the random string or character",
		param:"(javascript,java,C,react,php)",
		use:"randObj(javascript,php,java,c)",
		f : function (object) {
			let val_eval = object.split(',');	
			return val_eval[ALGO.math.randInt.f(0,val_eval.length-1)];
		}
	},
	randInt : {
		text:"Randomize Integer",
		description:"Find the random integer value (min-value, max-value, no. of values after decimal)",
		param:"minimunvalue,maximumvalue",
		agrlength:2,
		use:"randInt(1,4,2)",
		f : function (min, max, fix_decimal) {	
			return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(fix_decimal);
		}
	},
	randFloat : {
		text:"Randomize Float",
		description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",
		param:"minimunvalue,maximumvalue",
		agrlength:2,
		use:"randFloat(1,4,2)",
		f : function  (min, max, fix_decimal) {
			return (Math.random() * (max - min) + min).toFixed(fix_decimal);
		}
	},
	ucSqrt : {
		text:"Square root",
		description:"Find the square root (value, no. of values after decimal)",
		param:"minimunvalue,maximumvalue",
		agrlength:2,
		use:"ucSqrt(9,2)",
		f : function  (min, max) {
			return (Math.sqrt(min)).toFixed(max);
		}
	},
	ucPow : {
		text:"Power",
		description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",
		param:"minimunvalue,maximumvalue",
		agrlength:2,
		use:"ucPow(4,3,2)",
		f : function  (min, max, fix_decimal) {
			return (Math.pow(min, max)).toFixed(fix_decimal);
		}
	}		
};

module.exports = ALGO;