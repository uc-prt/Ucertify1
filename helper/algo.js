// var ALGO = ALGO || {mathtype:''};
// var duplicateCounter = 0;

class AlgoMath {
    constructor() { }
    randObj = {
        text:'Randomize Object',
        description:'Find the random string or character',
        param:'(javascript,java,C,react,php)',
        func : function (object) {
            let val_eval = object.split(',');
            return val_eval[this.randInt.func(0,val_eval.length - 1)];
        }
    }

    randInt = {
        text:'Randomize Integer',
        description:'Find the random integer value',
        param:'minimunvalue,maximumvalue',
        agrlength:2,
        func : function (min, max, excludevalue) {
            var num;
            if (excludevalue != '' && excludevalue != undefined) {
                var arr = excludevalue.split(',');
                num = Math.floor(Math.random() * (max - min + 1)) + min;
                return (arr.indexOf(String(num)) > -1) ?  this.randInt.func(min,max,excludevalue) : num;
            } else {
                num = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            return num;
        }
    }

    randFloat = {
        text:'Randomize Float',
        description:'Find the random float/decimal value',
        param:'minimunvalue,maximumvalue',
        agrlength:2,
        func : function (min, max, excludevalue) {
            var num;
            if (excludevalue != '' && excludevalue != undefined) {
                var arr = excludevalue.split(',');
                var newarr = [];
                for (var i in arr) {
                    if (arr[i] != '') {
                        newarr.push(String(arr[i]));
                    }
                }
                num = (Math.random() * (max - min) + min).toFixed(1);
                var flag = 0;
                if (newarr.indexOf(String(num)) > -1) {
                    flag = 1;
                    return this.randFloat.func(min,max,excludevalue);
                }
                return (flag == 0 && newarr.indexOf(String(parseInt(num, 10))) > -1) ? this.randFloat.func(min,max,excludevalue) : num;
            } else {
                num = (Math.random() * (max - min) + min).toFixed(1);
            }
            return num;
        }
    }
}

class AlgoUtils extends AlgoMath {
    constructor() { 
        super();
        this.mathtype = '';
    }

    generateVariables(qxml, uxml) {
        const regex_mathtype = /is_advance[\s]*=([\s"'\d]*)/;
        if (uxml != '' && uxml != '<smans type="8"></smans>' && !uxml.match(/<smans type="*.?[0-9]"><\/smans>/g)) {
            return JSON.parse(uxml);
        } else {
            let fnName = '';
            let var_list = {};
            var xml = qxml.split('\n');
            try {
                this.mathtype = +xml[0].match(regex_mathtype)[1].match(/[\d]+/);
                for (let i = 1; i < xml.length - 1; i++) {
                    let xml_id = xml[i];
                    let xml_arr = xml_id.split('=');
                    xml_arr[1] = this.changeEquation(xml_arr[1]);
                    fnName = xml_arr[1].substr(0, xml_arr[1].indexOf('(')).trim();
                    switch (fnName) {
                    case 'rand_int':
                        fnName = 'randInt';
                        break;
                    case 'rand_float':
                        fnName = 'randFloat';
                        break;
                    case 'rand_obj':
                        fnName = 'randObj';
                        break;
                    }
                    if (typeof ALGO.math[fnName] != 'object') {
                        fnName = '';
                    }
                    if (fnName != '') {
                        const regExp = /\(([^)]+)\)/;
                        let val_eval = [],
                            matches = regExp.exec(xml_arr[1]),
                            min,
                            max;
                        if (xml_arr[1].indexOf('exclude') > -1) {
                            var excludeval = [];
                            excludeval = /exclude\((.*?)\)/.exec(xml_arr[1]);
                            matches.exclude = excludeval[1];
                        }
                        var excludevalue;
                        switch (fnName.trim()) {
                        case 'randInt':
                            val_eval = matches[1].split(',');
                            min = parseInt(val_eval[0]);
                            max = parseInt(val_eval[1]);
                            excludevalue = (matches.exclude != undefined) ? String(matches.exclude) : '';
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,excludevalue);
                            break;
                        case 'randFloat':
                            val_eval = matches[1].split(',');
                            min = parseFloat(val_eval[0]);
                            max = parseFloat(val_eval[1]);
                            excludevalue = (matches.exclude != undefined) ? String(matches.exclude) : '';
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,excludevalue);
                            break;
                        default:
                            let string = JSON.stringify(matches[1]);
                            string = string.trim().replace(/"|\\/g,'');
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (string);
                        }
                    }
                    if (fnName == '') {
                        const regExp_arth = /(\*|\+|-|\/|\^|%|\(|\)|,|\[|\]|#)/g,
                            regExp_semicolon = /;|\\/g;
                        let test = xml_arr[1].split(regExp_arth),
                            expression = '';
                        var iscartesian = false;
                        for (let j = 0; j < test.length; j++) {
                            test[j] = test[j].trim();
                            if (test[j] != ';' && test[j] != '') {
                                test[j] = test[j].replace(regExp_semicolon,'');
                                if (test[j] == '#') {
                                    test[j] = '\'';
                                } else {
                                    test[j] = var_list.hasOwnProperty(test[j]) ? var_list[test[j]] : (isNaN(+test[j]) ? test[j] : +test[j]);
                                }
                                let t = test[j];
                                t = typeof t == 'string' ? t.trim() : t;
                                if (t == 'math.setCartesian') {
                                    iscartesian = true;
                                }
                                expression = expression + test[j];
                            } else {
                                continue;
                            }
                        }
                        if (this.mathtype == 2) {
                            if (iscartesian == true) {
                                var testing = eval(expression),
                                    str = '';
                                for (var k = 0;k < testing.length;k++) {
                                    testing[k] = '(' + testing[k] + ') ';
                                    str = str + testing[k];
                                }
                                var_list[xml_arr[0].trim()] = str;
                            }
                            if (!iscartesian) {
                                var_list[xml_arr[0].trim()] = eval(expression).toString();
                            }
                            if (var_list[xml_arr[0].trim()] == '') {
                                var_list[xml_arr[0].trim()] = 'None of these';
                            }
                        }
                        if (this.mathtype == '') {
                            var_list[xml_arr[0].trim()] = Evaluatex.evaluate(expression.trim());
                        }
                    }
                }
            } catch (err) {
                console.log({func:'Algo.util@160',error:err});
                this.mathtype = '';
            }
            return var_list;
        }
    }

    replaceVariables(latex_str, var_list) {
        var variable_list = {};
        for (var i in var_list) {
            variable_list[i] = var_list[i];
        }
        // const regExp_less = /&lt;/g,
        //     regEX_great = /&gt;/g;
        for (let i in var_list) {
            // let temp = '&lt;{' + i + '}&gt;'
            let temp = '<{' + i + '}>',
            re = new RegExp(temp, 'g');
            latex_str = latex_str.replace(re, variable_list[i]);
        }
        return latex_str;
    }

    convertLatex(changeSeq) {
        let MQ = MathQuill.getInterface(2),
            problemSpan = changeSeq;
        MQ.StaticMath(problemSpan);
    }

    countDecimals(value) {
        if (!this.isFloat(value)) return 0;
        if (Math.floor(value) === value) return 0;
        return value.toString().split('.')[1].length || 0;
    }

    isFloat(x) {
        return typeof(x, 'number') && !!(x % 1);
    }

    changeEquation (equation) {
        var expression;
        if (equation && equation.indexOf('UCALGOCUSTUM') > -1) {
            expression = /UCALGOCUSTUM\((.*?)<configalgo>/g.exec(equation)[1];
            var configJSON = JSON.parse(/<configalgo>(.*?)<\/configalgo>/g.exec(equation)[1]);
            for (var i in configJSON) {
                if (i == 'tofix') {
                    expression = (configJSON[i] != '') ? '(' + expression + ').toFixed(' + configJSON[i] + ')' : expression;
                }
            }
        } else {
            if (!isNaN(equation)) {
                if (this.countDecimals(equation) > 2) {
                    var float_val = +equation;
                    equation = float_val.toFixed(2);
                }
            }
            expression = equation;
        }
        return expression;
    }
}

export default class LatexAlgo extends AlgoUtils {
    constructor() {
        super();
        this.duplicateCounter = 0;
    }

    init(res) {
        let qxml = res.special_module_xml;
        let uxml = res.user_answer_details;
        this.duplicateCounter++;
        let question = res.question;
        let var_list = this.generateVariables (qxml, uxml);
        // Resolve the question title
        question = this.replaceVariables(question, var_list);
        res.question = question;
        // Resolve the question answer
        let answers = res.answers;
        for ( var i = 0; i < answers.length; i++ ) {
            answers[i].answer = this.replaceVariables(answers[i].answer, var_list);
        }
        res.answers = answers;
        // Resolve the question explanation
        let explanation = res.explanation;
        explanation = this.replaceVariables(explanation, var_list);
        res.explanation = explanation;
        return res;
        // $('#special_module_user_xml').val(JSON.stringify(var_list));
        /*
        $(containers[0]).html(latex_string);
        $(containers[1]).each(function () {
            const _this = $(this);
            latex_string = _this.html();
            latex_string = this.replaceVariables(latex_string, var_list);
            _this.html(latex_string);
        });
        if (duplicateCounter <= 3) {
            var optionArray = [];
            $(containers[1]).each(function () {
                const _this = $(this);
                var thishtml = _this.html();
                thishtml = thishtml.replace(/<seq.*?>|<\/seq>/g,'');
                optionhtml = thishtml.trim();
                if (optionhtml != null && optionhtml != '') {
                    if (optionArray.indexOf(optionhtml) > -1) {
                        ALGO.init(qxml, uxml, mode, containers);
                        return;
                    } else {
                        optionArray.push(optionhtml);
                    }
                }
            });
        } else {
            console.warn('Duplicate answer limit exceeds');
        }
        if ($(containers[2]).html()) {
            latex_string = $(containers[2]).html();
            if (latex_string != '') {
                latex_string = this.replaceVariables(latex_string, var_list);
                $(containers[2]).html(latex_string);
            }
        }
        */
    }
}