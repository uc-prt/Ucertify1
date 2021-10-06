<script>
    import {writable} from 'svelte/store';
    import { Button, Dialog, Checkbox } from 'svelte-mui/src';
    import l from '../src/libs/editorLib/language.js';
    import { onMount } from 'svelte';
    import {AH} from "../helper/HelperAI.svelte";

    var that;
    var ALGO = ALGO || {mathtype:""};
    let arr_val = {};

    var modal_array = [];
    var analyze_array = [{'var1':1}];
    var store = '';

    let state = {};

    let unsubscribe = writable({
        opened                      :false,
        deleteIndex                 : "",
        showPane                    : false,
        algoQXML                    : "",
        algoxmlDialog               : false,
        analyzeValuesDialog         : false,
        algovalue                   : '',
        toggleVariableDrawer        :false,
        toggleHelpingDrawer         :false
    })

    export let algo_qxml;
    export let view;
    export let handleAlgoState;
    export let single_variables; 
    export let updateAlgoState;
    export let onref;

    onMount(()=>{
        setTimeout(()=> {
            onref(that);
            if (algo_qxml) {
                AH.select("#algo_qxml").value = algo_qxml;
            }
        },1000);        
        algoFunction();
        getText();

        AH.listen(document,'click','.algo_function',(_this)=>{
            pasteFunc(_this);
        })


        AH.listen(document,'focus','.func_values',(_this)=>{
            store = _this.getAttribute('id');
        })
    })

    function pasteFunc(_this) {
        let val = _this.text();
        state.toggleHelpingDrawer = false;
        AH.select('#'+store).innerText = val;
    }

    function algoFunction() {
        ALGO.math = {
            algo_randObj : {
                text:"Random Word",
                description:"Find the random string or character",
                param:"(javascript,java,C,react,php)",
                use:"algo_randObj('JS,PHP,JAVA')",
                f : function (object) {
                    let val_eval = object.split(',');   
                    return true;
                }
            },
            algo_randInt : {
                text:"Random Integer",
                description:"Find the random integer value (min-value, max-value, no. of values after decimal)",
                param:"minimunvalue,maximumvalue",
                agrlength:2,
                use:"algo_randInt(1,4,2)",
                f : function (min, max, fix_decimal) {  
                    return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(fix_decimal);
                }
            },
            algo_randFloat : {
                text:"Random Float",
                description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",
                param:"minimunvalue,maximumvalue",
                agrlength:2,
                use:"algo_randFloat(1.1,4.5,2)",
                f : function  (min, max, fix_decimal) {
                    return (Math.random() * (max - min) + min).toFixed(fix_decimal);
                }
            },
            algo_ucSqrt : {
                text:"Square root",
                description:"Find the square root (value, no. of values after decimal)",
                param:"minimunvalue,maximumvalue",
                agrlength:2,
                use:"algo_ucSqrt(9,2)",
                f : function  (min, max) {
                    return (Math.sqrt(min)).toFixed(max);
                }
            },
            algo_ucPow : {
                text:"Power",
                description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",
                param:"minimunvalue,maximumvalue",
                agrlength:2,
                use:"algo_ucPow(4,3,2)",
                f : function  (min, max, fix_decimal) {
                    return (Math.pow(min, max)).toFixed(fix_decimal);
                }
            },
            algo_current : {
                text:"Variables",
                description:"To directly use any variable",
                use:"algo_current('var1')",
                f : function  (min) {
                    return Math.pow(min);
                }
            },
            algo_ucAbs : {
                text:"Absolute",
                description:"To use any absolute value",
                use:"algo_ucAbs(-5)",
                f : function  (min) {
                    return Math.abs(min);
                }
            },
            algo_ucRound : {
                text:"Round",
                description:"To use any value in round figure",
                use:"algo_ucRound(2.5)",
                f : function (val) {
                    return Math.round(val);
                }
            },
            algo_evalCondition : {
                text:"Evaluate",
                description:"To evaluate any condition",
                use:"algo_evalCondition(2>1,'true','false')",
                f : function  (ex, tr, fl) {
                    if(ex) {
                        return tr;
                    } else {
                        return fl;
                    }
                }
            },  
            algo_compareValue : {
                text:"Compare values",
                description:"To compare any two values",
                use:"algo_compareValue(2,1,'greater','smaller','equal')",
                f : function  (min, max, greater, smaller, equal) {
                    if(min > max) {
                        return greater;
                    } else if (min < max) {
                        return smaller;
                    } else if (min == max) {
                        return equal;
                    }
                }
            },
            algo_fixed : {
                text:"Fixed values",
                description:"To fix any value after specific decimals",
                use:"algo_fixed(2.345231,2)",
                f : function  (min, max) {
                    return;
                }
            },
            algo_randomStep: {
                text:"Get multiple",
                description:"To get any random step number between two values",
                use:"algo_randomStep(1,30,5)",
                f : function  (min, max, step) {
                    return;
                }
            }, 
            algo_randpythagorus : {
                text:"Pythagorus",
                description:"Generate the random pythagorian value (key, min-value, max-value)",
                param:"index,minimunvalue,maximumvalue",
                agrlength:2,
                use:"algo_randpythagorus(1,1,50)",
                f : function (indexkey, min, max) {  
                    return;
                }
            },
            algo_reduced : {
                text:"Reduced ratio",
                description:"Gives ratio based on first argument in reduced form.",
                param:"var1, var2",
                agrlength:2,
                use:'algo_reduced(algo_current("var1"),algo_current("var2"))',
                f : function (min, max) {  
                    return;
                }
            },
            algo_groupObj : {
                text:"Group Object",
                description:"Generate the random value of same index (objectvalues, group_alias)",
                param:"objectvalues, group_alias",
                agrlength:2,
                use:'algo_groupObj("frontend,backend,database","g1") & algo_groupObj("javascript,php,oracle","g1")',
                f : function (objects, group_alias) {  
                    return;
                }
            },
        }
    }

    function getText() {
        let modal_help = [];
        let temp_count = 0 ;
        for(let i in ALGO.math) {
            let text = '<h4 class="inline-block">'+ALGO.math[i].text+':</h4><span class="algo_function pointer"> '+ALGO.math[i].use+'</span>';
            text += '<div><b>Description</b>: <span>'+ALGO.math[i].description+'</span></div><hr />';
            modal_help[temp_count] = text;
            temp_count++
        }
        modal_array = modal_help;
    }

    function showPane(afterCall) {
        state.toggleVariableDrawer = true;
        afterCall && afterCall();
    }

    function showHelpingPane() {
        
        state.toggleHelpingDrawer = true;
        

        AH.listen(document,'paste',AH.find(document,'[contenteditable]'),function(curr,e){
            e.preventDefault(); var text = ''; 
            if (e.clipboardData || e.originalEvent.clipboardData) { 
                text = (e.originalEvent || e).clipboardData.getData('text/plain'); 
            } else if (window.clipboardData) {
                text = window.clipboardData.getData('Text'); 
            } if (document.queryCommandSupported('insertText')) { 
                document.execCommand('insertText', false, text); 
            } else { document.execCommand('paste', false, text); 
        }
        })
    }

    function closeHelpingPane() {
        state.toggleHelpingDrawer = false;
    }

    function closePane(call) {
            state.toggleVariableDrawer = false;
            if (!view && call == "changeAlgoState" && handleAlgoState) {  // Confusion
                handleAlgoState();
            }
    }

    function  createValuesObject(obj,name,value) {
        if (typeof obj[name] == "undefined") {
            obj[name] = {};
        }
        obj[name] = value;
    }


    function saveVariables(valid) {
        let algo = "<algostatic>";
        let algo_str = '';
        let next_line = '';
        AH.selectAll('.new_variable').forEach(function(_this,i) {    
            let var_name = AH.find(_this,'#var_name_'+i).innerHTML;
            let var_value = AH.find(_this,'#var_value_'+i).innerHTML;
            var_value = var_value.replace(/&nbsp;/g,"");
            var_value = var_value.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            createValuesObject(arr_val,var_name,var_value);
            let final_values = var_name+"="+var_value;
            algo_str = algo_str + next_line + final_values ;
            single_variables[i] = final_values;  // confusion
            algo = algo + final_values + "\n";
            next_line = '\n';
        });
        algo = algo + "</algostatic>";
        if(checkRepeated()) {
            return;
        }
        if(unOrdered()) {
            return;
        }
        if(checkValidFunc(algo_str)) {
            state.algoQXML = algo;
            updateAlgoState({algo_qxml: algo}); // consfusion
            AH.select("#algo_qxml").value = algo;
            console.log('-->',algo);
            closePane("changeAlgoState");
        }
    }

    function checkRepeated() {
        let check_var = [];
        single_variables.map(function(item,i) {
            check_var.push(item.split('=')[0]);
        });
        let counts = [];
        for(let i = 0; i <= check_var.length; i++) {
            if(counts[check_var[i]] === undefined) {
                counts[check_var[i]] = 1;
            } else {
                swal({
                    html: true,          
                    title: '',
                    text: "<b>"+check_var[i]+" is repeated.</b><br />A variable cannot be defined multiple times!",
                    type: "error"
                });
                return true;
            }
        }
        return false;
    }

    function unOrdered() {
        let check_var = [];
        let used_var = '';
        let condition_check = false;
        single_variables.map(function(item,i) {
            check_var.push(item.split('=')[0].trim());
            used_var = item.split('=')[1];
            let check_format = item.match(/var\d+/g);
            if(check_format) {
                check_format.map(function (data) {
                    let find_elem = check_var.indexOf(data);
                    if(find_elem == -1) {
                        swal({
                            html: true,          
                            title: '',
                            text: "<b>"+data+" cannot be used before it is defined.</b>",
                            type: "error"
                        });
                        condition_check = true;
                    } 
                });
            }
        });
        return condition_check;
    }

    function checkValidFunc(algo_str) {
        let var_list = '';
        try {
            var_list = that.generateVariables(algo_str);
            if(var_list != true) {
                swal({
                    html: true,          
                    title: '',
                    text: var_list,
                    type: "error"
                });
                return false;
            }
        } catch(e) {
            swal({
                html: true,          
                title: '',
                text: "<b>"+e+"<br/><br/>Variables are not correctly defined.</b>",
                type: "error"
            });
        }
        return var_list;
    }

    function generateVariables(algostr) {
        const regex_mathtype = /is_advance[\s]*=([\s"'\d]*)/;
            let fnName = "";
			let	var_list = {};				
            let xml = algostr.split("\n");
			try {			
                ALGO.mathtype = +xml[0].match(regex_mathtype)[1].match(/[\d]+/);
			} catch(err) {
                ALGO.mathtype = "";
			}		
			for (let i = 0; i < xml.length; i++) {	
                let xml_id = xml[i],
                xml_arr = xml_id.split("=");
                let algo_fn = xml_arr[1].indexOf('algo_');
                fnName = xml_arr[1].substring(algo_fn, xml_arr[1].indexOf('(')).trim();
                let invalidArgument = "Number of arguments in "+xml_arr[0]+" is incorrect";
				if (typeof ALGO.math[fnName] != 'object') {
                    fnName = "";
                }					
				if (fnName != "") {	
                    const regExp = /\(([\s\S]*)\)/;
					let val_eval = [],
					matches = regExp.exec(xml_arr[1]),
					min,
					max,
					fix_decimal,
                    indexkey;
					switch (fnName.trim()) {
                        case "algo_randInt":
							val_eval = matches[1].split(',');
                            if(val_eval.length>3 || val_eval.length<2) {
                                return invalidArgument;
                            }	
							min = parseInt(val_eval[0]);
							max = parseInt(val_eval[1]);
							fix_decimal = parseInt(val_eval[2]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
							break;
						case "algo_randFloat":
							val_eval = matches[1].split(',');
                            if(val_eval.length>3 || val_eval.length<2) {
                                return invalidArgument;
                            }					
							min = parseFloat(val_eval[0]);
							max = parseFloat(val_eval[1]);								
							fix_decimal = parseInt(val_eval[2]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
							break;
						case "algo_ucSqrt":
							val_eval = matches[1].split(',');	
                            if(val_eval.length>2 || val_eval.length<1) {
                                return invalidArgument;
                            }
							min = parseInt(val_eval[0]);
							max = parseInt(val_eval[1]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min, max);
							break;
						case "algo_ucPow":
							val_eval = matches[1].split(',');
                            if(val_eval.length>3 || val_eval.length<2) {
                                return invalidArgument;
                            }	
							min = parseInt(val_eval[0]);
							max = parseInt(val_eval[1]);
							fix_decimal = parseInt(val_eval[2]);
							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
                            break;
                        case "algo_current":
                            val_eval = matches[1].split(',');
                            if(val_eval.length>1) {
                                return invalidArgument;
                            }	
                            min = parseInt(val_eval[0]);
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min);
                            break;
                        case "algo_ucAbs":
                            val_eval = matches[1].split(',');
                            if(val_eval.length>1) {
                                return invalidArgument;
                            }	
                            min = parseInt(val_eval[0]);
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min);
                            break;
                        case "algo_ucRound":
                            val_eval = matches[1].split(',');
                            if(val_eval.length > 1) {
                                return invalidArgument;
                            }
                            let val = val_eval[0];	
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (val);
                            break;
                        case "algo_evalCondition":
                            val_eval = matches[1].split(',');
                            if(val_eval.length!=3) {
                                return invalidArgument;
                            }
                            fix_decimal = val_eval[0];	
                            min = val_eval[1];
                            max = val_eval[2];
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (fix_decimal,min,max);     
                        case "algo_compareValue":
                            val_eval = matches[1].split(',');	
                            if(val_eval.length!=5) {
                                return invalidArgument;
                            }
                            min = val_eval[0];
                            max = val_eval[1];
                            let greater = val_eval[2];
                            let smaller = val_eval[3];
                            fix_decimal = val_eval[4];
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min, max, greater, smaller, fix_decimal);                      
                        case"algo_fixed":    
                            val_eval = matches[1].split(',');	
                            if(val_eval.length!=2) {
                                return invalidArgument;
                            }
                            min = val_eval[0];
                            max = val_eval[1]; 
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min, max);
                            break;
                        case"algo_randomStep":    
                            val_eval = matches[1].split(',');
                            if(val_eval.length>3 || val_eval.length<2) {
                                return invalidArgument;
                            }	
                            min = val_eval[0];
                            max = val_eval[1]; 
                            fix_decimal = val_eval[2];
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min, max, fix_decimal);
                        case "algo_randpythagorus":
                            val_eval = matches[1].split(','); 
                            if(val_eval.length!=3) {
                                return invalidArgument;
                            }
                            indexkey = parseInt(val_eval[0]);  
                            min = parseInt(val_eval[1]);
                            max = parseInt(val_eval[2]);
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (indexkey,min,max);
                            break;  
                        case "algo_groupObj":
                            val_eval = matches[1].split(','); 
                            var objects = parseInt(val_eval[0]);  
                            var group_alias = parseInt(val_eval[1]);
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (objects,group_alias);
                            break; 
                        case "algo_reduced":
                            val_eval = matches[1].split(',');
                            if(val_eval.length!=2) {
                                return invalidArgument;
                            } 
                            min = parseInt(val_eval[0]);  
                            max = parseInt(val_eval[1]);
                            var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max);
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
							let testing = eval(expression);
							let	str = "";
							for (let k=0; k<testing.length; k++) {
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
            return true;
    }

    function  addVariable() {
        let tempVar = editorState.single_variables;
        tempVar.push("var=0");
        editorState.single_variables = tempVar;
	}

    function deleteVar(index) {
		    state.opened = true;
			state.deleteIndex = index;
	}

    function deleteConfirm() {
        let index = state.deleteIndex;
        if(single_variables.length != 1) {
            delete arr_val[single_variables[index].split('=')[0]];
            single_variables.splice(index,1);
        } else {
            swal("Minimum one variable is required.");
        }        
        state.opened = false;
    }

    function handleCloseVariable() {
        state.opened = false;
    }

    function getalgoXml() {
        state.algoxmlDialog = true;
        var timer = setTimeout(function() {
            //jQuery('#algoxml_Dialog').val("<algostatic>"+single_variables.join('\n')+"</algostatic>");
            AH.select('#algoxml_Dialog').value = "<algostatic>"+single_variables.join('\n')+"</algostatic>";
            clearTimeout(timer);
        },50);
    }

    function saveAlgo() {
        let dialogXml = AH.select('#algoxml_Dialog').value;
        dialogXml = dialogXml.replace(/<algostatic>/g,"").replace(/<\/algostatic>/g,"");
        dialogXml = dialogXml.trim();
        single_variables.splice(0,that.props.single_variables.length);
        dialogXml.split("\n").map(function(data,i) {
            single_variables[i] = data.trim();
        });
        if(checkRepeated()) {
            return;
        }
        if(unOrdered()) {
            return;
        }
        if(checkValidFunc(dialogXml)) {
            state.algoQXML = AH.select("#algoxml_Dialog").value;
            AH.select("#algo_qxml").value = AH.select("#algoxml_Dialog").value;
            updateAlgoState({algo_qxml: AH.select("#algoxml_Dialog").value});
            state.algoxmlDialog  = false;
        }
    }



</script>


<div>
    <button 
        style="margin-right : 6px"
        class = "btn btn-light validate btn-sm d-none"
        type = "button"
        on:click = {getalgoXml}
    >
        {l.algo_xml}
    </button>
    <Sidepanel right bind:visible={state.toggleVariableDrawer} width="300px">
        <div tabIndex="0" role="button" style="margin-top:40px;">
            <div class="" style="padding: 5px 10px; width: inherit; height: 100%">
                <div class="inline-block relative" style="font-size: 20px; top: 8px">{l.create_variable}</div> 
                    <span 
                        on:click={showHelpingPane} 
                        class="icomoon-help" 
                        style="font-size: 20px; margin-left: 10px; cursor: pointer; position: relative; top: 11px"
                    ></span>              
                    <Button 
                        variant="fab" 
                        color="primary"
                        aria-label="Add"
                        on:click={addVariable}
                        unelevated={true}
            		    outlined={true}
                        class="rounded-circle float-end shadow"
                        style="width: 35px; height: 35px; background: #4285f4; margin-top:5px;"
                    >
                        <i class="icomoon-plus"></i>
                    </Button>   
                    <div class="outer_variables mt-xl clearboth">
                    <hr />
                    {#each editorState.single_variables as item, index}
                        {#if item}
                            <div key={index} class="new_variable seq_inbox d-flex">
                                <div 
                                    class="inline-block section_table form-control func_name" 
                                    id="var_name_{index}" 
                                    contentEditable={true} 
                                    style="margin: 8px 4px; border: 1px solid grey"
                                >
                                    {item.split('=')[0].trim()}
                                </div>
                                <div 
                                    class="inline-block bundle_width form-control func_values" 
                                    id="var_value_{index}" 
                                    contentEditable={true} 
                                    style="margin: 8px 4px; border: 1px solid grey; word-break: break-all; height: 37px;overflow:auto;"
                                >
                                    {item.split('=')[1].trim()}
                                </div>
                                <div 
                                    class="mt-2 pt-1" 
                                    style="width: 33px; display: inline-block; border-radius: 50%; font-size: 17px; border: 2px solid white; height: 33px" 
                                    on:click={deleteConfirm.bind(this, index)}
                                >
                                    <a href="#" style="font-size: 16px; margin-left: 6.3px" class="btn-md icomoon-new-24px-delete-1"></a>
                                </div>
                                <hr />
                            </div>
                        {/if}
                    {/each}
                </div>
                <div style="textAlign: right; margin-top: 6px">
                    <button type="button" on:click={saveVariables} class="btn btn-primary float-end" >{l.save_variable}</button>
                </div>
            </div>
        </div>
    </Sidepanel>
    <Sidepanel right bind:visible={state.toggleHelpingDrawer}>
        <div tabIndex="0" role="button">
            <div class="relative" style="padding: 5px 10px; width: inherit; height: 100%;top:55px">
                <div class="inline-block" style="font-size: 20px;">{l.functions}</div>
                <span on:click={closeHelpingPane} class="icomoon-arrow-right-6 font24 relative" style="top:5px;left:105px;"></span>
                <div class="outer_variables mt-xl clearboth">
                    <hr />
                    <div>
                        {#each modal_array as item, index}
                            {@html item}
                        {/each}
                    </div>
                </div>
          </div>
        </div>
    </Sidepanel>
    <Dialog bind:visible={state.algoxmlDialog} width={700} style="background: #fff; border-radius: 5px;">
        <h4 class="mt-1 font21 mb-4">
            <div class="d-flex justify-content-between">
                <div>{l.algo_xml}</div>
            </div>
        </h4>
        <div style="borderBottom: 1px solid #00000000; overflow-y: auto; overflow-x: hidden;height:365px;">
            <textarea
                id="algoxml_Dialog"
                style="
                    width: 100%;
                    margin: 3px 0;
                    min-height: {(window.in_frame == 1) ? '100px' :'250px'},
                    border: 0px;
                    resize: none;
                    outline: none;
                    box-shadow: none;
                    border-bottom: 1px solid #777373;
                "
            >{state.algovalue}</textarea>
        </div>
        <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
            <Button on:click={()=> state.algoxmlDialog = false}>
                {l.cancel}
            </Button>
            <Button on:click={saveAlgo}>
                {l.save}
            </Button>
        </div>            
    </Dialog>

    <Dialog bind:visible={state.analyzeValuesDialog} width={700} style="background: #fff; border-radius: 5px;">
        <h4 class="mt-1 font21 mb-4">
            <div class="d-flex justify-content-between">
                <div> {l.val_variations}</div>
            </div>
        </h4>
        <div style="borderBottom: 1px solid #00000000; overflow-y: auto; overflow-x: hidden;height:365px;">
            <div
                id="analyzeValues_Dialog"
                style="
                    width: 100%;
                    margin: 3px 0;
                    minHeight: {((window.in_frame == 1) ? "100px" :"250px")};
                    border: 0px;
                    resize: none;
                    outline: none;
                    boxShadow: none;
                "
            >   <table class="sorttable table4 uc-table mce-item-table">
                    <thead>
                        <tr>
                            {#each Object.keys(arr_val) as item, i}
                                <th data-toggle="tooltip" key={i} data-original-title={arr_val[item]}>{item}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each analyze_array as p}
                            <tr>
                                {#each Object.keys(p) as k, i}
                                    <td key={i}>{p[k]}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <div slot="footer" class="svelteFooter">
            <Button 
                on:click={()=>state.analyzeValuesDialog = false}
                unelevated={true}
            	outlined={true}
            >
                {l.cancel}
            </Button>
        </div>
    </Dialog>
    <textarea class="h-imp" id="algo_qxml"></textarea>
</div>

<style>
    :global(.side-panel) {
        width: 330px !important;
    }
    :global(.algo_function:hover) {
        -webkit-transition: color 1s; 
        -moz-transition: color 1s;
        transition: color 1s;
        color: #00bcd4;
        font-size: 14.2px;
    }
    @media screen and (max-width: 800px) {
        .validate {
            font-size: 12px;
            padding: 0.375rem 0.50rem;
        }
    }
</style>