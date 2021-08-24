/**
 *  File: AlgoParser.js
 *   Author: Prabhat Kumar<prabhat.kumar@ucertify.com>
 *  Version: 1.0
 *  @package  : helper/AlgoParser.js
  *  @detail   : responsible managing utility functions for algorithimic contents
 */
 // all the function required is defined in algo_util.php
import AlgoUtil from './AlgoUtil';

export default class clsAlgo extends AlgoUtil {
    constructor() {
        super();
        this.algo_var_tag  = '<algouserans>';
        this.algo_var_list = [];
        this.group         = [];
        this.unique        = [];
    }
    
    resolveContent( cdata ) {
        var _this = this;
        // store all the varibale values in array format
        var var_list = _this.createVar( cdata.algo_qxml, cdata.user_answer_details );
        // encode the extracted variable values encolosing in the algouserans tag
        cdata['algouserans'] = _this.createUserAns( var_list );
        // replace all the string
        cdata.question           = _this.replaceStr( cdata.question, var_list );
        cdata.explanation        = _this.replaceStr( cdata.explanation, var_list );
        cdata.special_module_xml = _this.replaceStr( cdata.special_module_xml, var_list );
        if ( cdata.user_answer_details ) {
            cdata.user_answer_details = (cdata.user_answer_details).replace( '/<algouserans>.*/', '' );
        }
        
        if ( (cdata.answers).length > 1 ) {
            (cdata.answers).forEach(function(v, k) {
                cdata['answers'][ k ]['answer'] = _this.replaceStr( cdata['answers'][ k ]['answer'], var_list );
            });
        }
        // return final data
        return cdata;
    }

    // for replacing the string
    replaceStr( str, var_list ) {
        var_list = this.ksort( var_list );
        find       = Object.keys( var_list );
        find       = this.preg_filter( /^/, 'var:', find );
        var replace    = this.array_values( var_list );
        var new_string = this.str_ireplace( find, replace, str );
        return new_string;
    }
    // str_ireplace function
    str_ireplace (search, replace, subject, countObj) { 
        let i = 0
        let j = 0
        let temp = ''
        let repl = ''
        let sl = 0
        let fl = 0
        let f = ''
        let r = ''
        let s = ''
        let ra = ''
        let otemp = ''
        let oi = ''
        let ofjl = ''
        let os = subject
        const osa = Object.prototype.toString.call(os) === '[object Array]'
        // var sa = ''
        if (typeof (search) === 'object') {
            temp = search
            search = []
            for (i = 0; i < temp.length; i += 1) {
                search[i] = temp[i].toLowerCase()
            }
        } else {
            search = search.toLowerCase()
        }
        if (typeof (subject) === 'object') {
            temp = subject
            subject = []
            for (i = 0; i < temp.length; i += 1) {
                subject[i] = temp[i].toLowerCase()
            }
        } else {
            subject = subject.toLowerCase()
        }
        if (typeof (search) === 'object' && typeof (replace) === 'string') {
            temp = replace
            replace = []
            for (i = 0; i < search.length; i += 1) {
                replace[i] = temp
            }
        }
        temp = ''
        f = [].concat(search)
        r = [].concat(replace)
        ra = Object.prototype.toString.call(r) === '[object Array]'
        s = subject
        // sa = Object.prototype.toString.call(s) === '[object Array]'
        s = [].concat(s)
        os = [].concat(os)
        if (countObj) {
            countObj.value = 0
        }
        for (i = 0, sl = s.length; i < sl; i++) {
            if (s[i] === '') {
                continue
            }
            for (j = 0, fl = f.length; j < fl; j++) {
                if (f[j] === '') {
                    continue
                }
                temp = s[i] + ''
                repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
                s[i] = (temp).split(f[j]).join(repl)
                otemp = os[i] + ''
                oi = temp.indexOf(f[j])
                ofjl = f[j].length
                if (oi >= 0) {
                    os[i] = (otemp).split(otemp.substr(oi, ofjl)).join(repl)
                }
                if (countObj) {
                    countObj.value += ((temp.split(f[j])).length - 1)
                }
            }
        }
        return osa ? os : os[0]
    }

    array_values (input) { 
        const tmpArr = [];
        let key = '';
        for (key in input) {
            tmpArr[tmpArr.length] = input[key];
        }
        return tmpArr
    }

    preg_filter(regex, key, str ) {
        var new_str = str.map( function (st) {
            return st.replace(regex, key);
        });
        return new_str;
    }
    createUserAns( var_list ) {
        // encode the extracted variable values encolosing in the algouserans tag
        return '<algouserans>' + JSON.stringify( var_list ) + '</algouserans>';
    }

    createVar( algo_str, user_ans = '' ) {
        // checking wether the user ans  have <algouserans> tag or not
        console.log('user_ans: '. user_ans);
        console.log('test: ', this.isUserAnsHaveAlgoVar( user_ans ));
        if ( this.isUserAnsHaveAlgoVar( user_ans ) ) {
            // extract the value beetween the tag and returning alog variables if user_answer_detail is found
            return this.generateVarFromUserAns( user_ans );
        }

        // generate the variable from the algo str
        return this.generateVarFromAlgoStr( algo_str );
    }

    isUserAnsHaveAlgoVar( user_ans ) {
        // checking wether the user ans  have <algouserans> tag or not
        return user_ans.toLowerCase().indexOf((this.algo_var_tag.toLowerCase())) != -1;
    }

    generateVarFromUserAns( user_ans ) {
        // extract the value beetween the tag and returning alog variables if user_answer_detail is found
        var algo_str        = this.extractAlgoStrFromUserAns( user_ans );
        algo_str            = algo_str.trim();
        var algo_vars      = JSON.parse( algo_str );
        this.algo_var_list = algo_vars;
        return algo_vars;
    }

    generateVarFromAlgoStr( algo_str ) {
        var var_list = [];
        var _this = this;
        // removing the tag algostatic from the algo xml
        var algo_str = algo_str.replace( '<algostatic>', '' );
        algo_str = algo_str.replace( '</algostatic>', '' );
        // remove the initial and last extra white spaces
        algo_str = algo_str.trim();
        // convert the algo str in array by spliting it with new line
        var algo_stmt = algo_str.split( "\n" );
        var _this = this;
        algo_stmt.forEach(function(v , k) {
            // splitting it with =
            v =  v.split( '=', );
            // storing the right side
            var vv = v[1];
            // and replac the algo_ with this. and add return , so for algo_randInt(6,10) , final result will be like return this.randInt(6,10)
            vv       = vv.replace(/algo_/g, '_this.');
            vv       =  vv + ';';
            var var_name = v[0];
            var var_val = '';
            try {
                // evaluate all the function
                var_val = eval(vv);
            } catch ( err ) {
            }
            var_list[ var_name ] = var_val;
            // stored the variable values
            _this.algo_var_list = var_list;
        });
        // return stored value
        return var_list;
    }

    extractAlgoStrFromUserAns( user_ans ) {
        var tagname = 'algouserans';
        var pattern = new RegExp('/<\s*?' + $tagname + '\b[^>]*>(.*?)</' + tagname + '\b[^>]*>/s');
        var matches = user_ans.match( pattern );
        return matches[1];
    }

    ksort(obj){
        var keys = Object.keys(obj).sort(),sortedObj = {};
        for(var i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }
        return sortedObj;
    }
}