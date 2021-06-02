<!-- 
*  File Name   : StepAlgoPreview.svelte
*  Description : show the boxes for users side
*  Author      : Sundaram Tripathi
*  Version     : 1.0
*  Package     : pe-items
*  Last update :  -->
<script>
    import {writable} from 'svelte/store';
	import ju from '../src/libs/jslib';
	import ALGO from "./Step.js";
    import l from '../src/libs/editorLib/language.js';
    import { onMount,afterUpdate, beforeUpdate } from 'svelte';
    import {AH,XMLToJSON,JSONToXML} from "../helper/HelperAI.svelte";
	import FillInTheBlanksToolbar from '../clsSMFill/FillInTheBlanksToolbar.svelte';
	import ItemHelper from '../helper/ItemHelper.svelte';
	

	

    let step_xml;
    let smans = {};
    let usans = {};
    let element_id, element_div = '';
    let cdata = '';
    let fill_math = [];
    var answer_array = [];
	let btntype;


    let var_list = '';
	let special_module = {};
	let lists = '';
	let oldstep = '';
	let answer_arr = [];
	let fillId;
	let steps = 0;
	let wrong_choice = 0;
	let optionrem = 0;	
	let flagxml = false;
    let state = {};

    export let xml;
    export let stopPreviewUpdate;
	export let isReview;
	export let editorState;
	export let uxml;



	

    let stateData = writable({
            blank                   : true,
			hideNext                : false,
			itemArray               : [],
			classChange             : -1,
			isColor                 : true,
			smController            : "h",
			display                 : -1,
			showToolbar             : true,
			isMathquill             : false,
			correct_answer          : true,
			main_steps              : false,
			your_answer             : []
    });

    const unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

	$:{
		if (isReview) {
			var timer = setTimeout(function() {
				setReview();
				clearTimeout(timer);
			},500);	
		} else {
			var timer_next = setTimeout(function() {
				unsetReview();
				clearTimeout(timer_next);
			},200);
		}
	}

	beforeUpdate(()=>{
		if(state.isMathquill) {
			loadLibs();
		}
		if (uxml) {
			let answer = XMLToJSON(uxml);
			if (answer.smans) {
				if (answer.smans.div) {
					if (answer.smans.div._userAns) {
						parseSteps(uxml);
					}
				}
			}
		}
		//if (this.props.remedStatus != nextProps.remedStatus) {

			
			
		//}

		if (xml != state.xml) {
			state.xml = xml;
			if (stopPreviewUpdate == true) return false;
			if (!uxml) {
				steps = 0;
				state.itemArray = [];	
				step_xml, smans, usans = {};
				state.hideNext = false;			
				reset();
			}
			state.blank = false;
			let new_xml = XMLToJSON(state.xml);
			loadModule(new_xml);
		}

		// if (state.review != isReview && editorState) {
        //         stateData.update( (item) => {
        //             item.review = isReview;
        //             return item;
        //         });
        //         if (isReview) {
        //             setReview(); 
        //         } else {
        //             unsetReview();
        //         }
        // }

		
		// if (isReview) {
		// 	var timer = setTimeout(function() {
		// 		setReview();
		// 		clearTimeout(timer);
		// 	},500);	
		// } else {
		// 	var timer_next = setTimeout(function() {
		// 		unsetReview();
		// 		clearTimeout(timer_next);
		// 	},200);
		// }
		
	})


	function loadLibs() {
        let config = {
            preload: true,
            type: 'stylesheet',
            as: 'style'
        }
		AH.createLink(themeUrl+"pe-items/css/mathquill.css", config);
	}

	// $: {
	// 	if(state.isMathquill) {
	// 		alert('checking');
	// 		loadLibs();
	// 	}
	// }

	onMount(()=>{
		window.J = ju;
		AI.set('stepAlgo', this);
		if(window.inNative) {
			window.getHeight && window.getHeight();
        }
		setTimeout(function() {
			//jQuery('.toolbar_container_one').addClass('h-imp');
			AH.selectAll('.toolbar_container_one','addClass','h-imp');
		}, 100);

		// jQuery(document).on('click keyup change focus', '.edit_step', function(e) {
			
		// 	console.log(e.type);
		// 	let element = jQuery(this);
		// 	if (element.hasClass('mathquill')) {
		// 		mathquillAns(element, false);	
		// 	} else {
		// 		let inp_id = element.attr('id');	
		// 		let inp_div = element.closest('div').attr('seq');
		// 		let inp_val = element.val();
		// 		usans = createAns(usans, inp_id, inp_div, inp_val);
		// 		special_module.usans = usans;
		// 		let smans_overall = smans;
		// 		setUserAns(usans);
		// 	}
		// });


		AH.listen(document,'click','.edit_step',(_element) => {
			setOutline(_element)
		})

		AH.listen(document,'keyup','.edit_step',(_element)=>{
			setOutline(_element)
		})

		AH.listen(document,'change','.edit_step',(_element)=>{
			setOutline(_element)
		})


		// document.querySelector('.edit_step').addEventListener('focus', (_element)=>{
		// 	console.log('event lishener =>'+_element);
		// })



		/*jQuery(document).on("click", "span.mq-editable-field.mq-focused", function(event) {
			console.log('checking mathquill');
			let is_fillid = true;
			let fillid;
			let span_math = jQuery(this);
			while(is_fillid) {
				span_math = span_math.parent();
				if (span_math.attr('id')) {
					is_fillid = false;
					fillid = span_math.attr('id');
					fillId = fillid;
				}
			}
			
			let latex_array = [];
			jQuery("#" +fillid + " span.mq-editable-field").map(function() {
				let command_id = jQuery(this).attr('mathquill-command-id');
				latex_array.push(command_id);
			}).get();
			let math_id = jQuery(this).attr('mathquill-command-id');
			let index_id = latex_array.indexOf(math_id);
			state.spanId = index_id;
			state.divId = fillid;
			
			jQuery('.toolbar_container_one').removeClass('h-imp');
			state.showToolbar = true;
			
		});*/


		AH.listen(document,'click','span.mq-editable-field.mq-focused',(_e)=>{
			let span_math = _e;
			let is_fillid = true;
			let fillid;
			while(is_fillid) {
				span_math = span_math.parentElement;
				if (span_math.getAttribute('id')) {
					is_fillid = false;
					fillid = span_math.getAttribute('id');
					fillId = fillid;
				}
			}
			//let latex_array = [];
			// jQuery("#" +fillid + " span.mq-editable-field").map(function() {
			// 	console.log('checking map');
			// 	let command_id = jQuery(this).attr('mathquill-command-id');
			// 	latex_array.push(command_id);
			// }).get();
			let latex_array = [];
			AH.selectAll("#" +fillid + " span.mq-editable-field").forEach((_this)=> {
				let command_id = _this.getAttribute('mathquill-command-id');
				latex_array.push(command_id);
			}); // Need to fixed it

			//let math_id = jQuery(this).attr('mathquill-command-id');
			//let index_id = latex_array.indexOf(math_id);
			let math_id = _e.getAttribute('mathquill-command-id');
			let index_id = latex_array.indexOf(math_id);
			state.spanId = index_id;
			state.divId = fillid;
			
			AH.selectAll('.toolbar_container_one','removeClass','h-imp');
			state.showToolbar = true;
		})
		
		// jQuery(document).on('click', '.next_step', function(e) {
		// 	if (typeof QUIZPLAYERID != "undefined") {
		// 		window.parent.autoResize(QUIZPLAYERID);
		// 	}
		// 	e.preventDefault();
		// 	inputFilled();
		// });

		AH.listen(document,'click','.next_step',function(curr,e) {
			if (typeof QUIZPLAYERID != "undefined") {
				window.parentElement.autoResize(QUIZPLAYERID);
			}
			e.preventDefault();
			inputFilled();
		})
		
		// setTimeout(function() {
		// 	jQuery("#set-review").on('click', function() {
		// 		setReview();
		// 	});
		// 	jQuery("#unset-review").on('click', function() {
		// 		unsetReview();
		// 	});
		// },1000);

		setTimeout(function() {
			AH.listen(document,'click','#set-review',function() {
				setReview();
			})
			AH.listen(document,'click','#unset-review',function() {
				unsetReview();
			})
		},1000);

		if (window.inNative) {
			setTimeout(function() {
				window.postMessage('height___'+document.getElementsByClassName('inNativeStyle')[0].offsetHeight,'*');
			}, 200);
		}

		if(window.inNative) {
			window.checkReview = (isReview) => isReview ? self.setReview() : self.unsetReview();
			AH.addScript("https://ucertify.com/themes/bootstrap4/prepengine/mathquill.js"); //This file should be downloaded and used locally.
		} else {
			//console.log("checking path =>"+editor.baseUrlTheme+"prepengine/mathquill.js");
			AH.addScript("",editor.baseUrlTheme+"pe-items/clsSMStepAlgo/libs/mathQuill_new.js", { callback: function () {

			}});
		}
	})

	function setOutline(_element) {
		if ( _element.nodeName) {
			if (_element.classList.contains('mathquill')) {
				mathquillAns(_element, false);
			} else {
				let inp_id =  _element.getAttribute('id');
				let inp_div = _element.closest('div').getAttribute('seq');
				let inp_val = _element.value;
				usans = createAns(usans, inp_id, inp_div, inp_val);
				let smans_overall = smans;
				setUserAns(usans);
			}
		}
	}

	function inputFilled() {
		if (usans) {
			for (let i in usans) {
				for (let key in usans[i]) {
					let ans_val = usans[i][key].value;
					if (ans_val != '') {
						let ans_arr = ans_val.match(/MathQuillMathField\{(.*?)\}/g);
						if (ans_arr) {
							ans_arr.map(function(obj) {
								let math_field = obj.toString().replace(/MathQuillMathField\{|\}/g, '')
								if (math_field == '') {
									//jQuery("#"+key).removeClass('answer_input');
									AH.select("#"+key,'removeClass','answer_input');
								} else {
									//jQuery("#"+key).addClass('answer_input');
									AH.select("#"+key,'addClass','answer_input');
								}
							});
						} else {
							//jQuery("#"+key).addClass('answer_input');
							AH.select("#"+key,'addClass','answer_input');
						}
					} else {
						//jQuery("#"+key).removeClass('answer_input');
						AH.select("#"+key,'removeClass','answer_input');
					}
				}
			}
		}
	}

    function loadModule(new_xml) {
		flagxml = false;
		if(new_xml.smxml.algo != "undefined" && new_xml.smxml.algo) {
			flagxml = true;		
		}
		if(flagxml) {
			var_list = ALGO.init(new_xml.smxml.algo);
		}
		let xml_str = JSON.stringify(new_xml);
		if(flagxml) {
			if (uxml) {
				let answer = XMLToJSON(uxml);
				if (answer.smans) {
					if (answer.smans.div) {
						if (answer.smans.div._lists) {
							var_list = lists;
						}
					}
				}
			}
			step_xml = ALGO.init.replaceVariables(xml_str, var_list);
			step_xml = JSON.parse(step_xml);
		} else {
			step_xml = new_xml;
		}
		let answer_arr_clone = step_xml.smxml.step;
		answer_array = answer_arr_clone.slice();
		if (typeof Object.assign != 'function') {
			Object.assign = function(target) {
				'use strict';
				if (target == null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}
				target = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];
					if (source != null) {
						for (var key in source) {
							if (Object.prototype.hasOwnProperty.call(source, key)) {
								target[key] = source[key];
							}
						}
					}
				}
				return target;
			};
		}
		answer_arr_clone.map(function(item, i) {
			answer_array[i] = Object.assign({}, item);
		});
		if (oldstep != '') {
			steps = oldstep;
			for (let i=0; i<=oldstep; i++) {
				createStep(i);
			}
		} else {
			createStep();
		}
		if (uxml) {
			let answer = XMLToJSON(uxml);
			if (answer.smans) {
				if (answer.smans.div) {
					if (answer.smans.div._userAns) {
						var timer = setTimeout(function() {
							parseUserAns(uxml);
							clearTimeout(timer);
						},50);
					}
				}
			}
		}
	}

	function parseUserAns(uans) {
		let user_answer = XMLToJSON(uans);
        if (user_answer.smans && user_answer.smans.div && user_answer.smans.div._userAns) {
			user_answer = JSON.parse(user_answer.smans.div._userAns);
			for (let i in user_answer) {
				for (let j in user_answer[i]) {
					let runn = i.split('');
					let val = runn[1];
					let box_value = user_answer[i][j].value;
					if (AH.select('#'+j).classList.contains('mathquill')) {
						//jQuery('#'+j).attr('userans', box_value);
						AH.select('#'+j,'userans',box_value);
						mathquillAns('#'+j, "math_user");
					} else {
						//jQuery('#'+j).val(box_value).focus().blur(); 
						AH.select('#'+j).value = box_value;
						setOutline(AH.select('#'+j))
					}
					optionrem = 0; 
					inputFilled();
					checkAns(val);
				}
			}
            //forceUpdate();
        }
	}

    function createStep(i) {
		if(flagxml) {
			special_module.var_list = var_list;
		}
		special_module.cuurentStep = steps;
		optionrem = 0;	
		const item = state.itemArray;
		parseXmlAuthoring(step_xml, i);
		item.push({ cdata });         
		state.itemArray = item;
		if (i <= oldstep) {
			var curr = i;
		} else {
			var curr = steps;
		}
		var timer = setTimeout(function() {
			if((step_xml.smxml.step[curr+1] == undefined && step_xml.smxml.step[curr]._attempt == "1") || (step_xml.smxml.step[curr+1] == undefined && step_xml.smxml.step[curr]._viewonly == "1")) {
				try {
					// self.setState({hideNext:true}); 
				} catch(e) {
					console.log(e);
				}
			}
			clearTimeout(timer);
		},500);
	}

    function reset() {
		//jQuery(document).find('.sticky').removeClass('sticky');
		AH.find(document,'.sticky',{
			action:'removeClass',
			actionData:'sticky'
		})
		//jQuery('.edit_step').removeAttr('disabled');
		AH.selectAll('.edit_step','removeAttr','disabled');

		//jQuery('.edit_step').val('');
		AH.selectAll('.edit_step').value = '';
	}

    function parseXmlAuthoring(MYXML, user_xml) {
		if (user_xml <= oldstep) {
			cdata = MYXML.smxml.step[user_xml].__cdata;	
			creatingInteractive(user_xml, cdata);
		} else {
			if (MYXML.smxml.step[steps] != undefined) {
				cdata = MYXML.smxml.step[steps].__cdata;
				creatingInteractive(user_xml, cdata);
			}
		}
	}

	function creatingInteractive(user_xml, cdata, index) {
		let answer_key = cdata.match(/%{[\s\S]*?}%/gm);
		let answer_type = '';
		let check_type = [];
		let uaxml_new = "";
		let total_marks = 0;
		if (answer_key) {
			//jQuery(answer_key).each(function(i) {
			answer_key.forEach(function(data,i) {
				if(index != undefined) {
					var org_cdata = answer_array[index].__cdata;
				}
				total_marks++;
				let originalKey = answer_key[i];
				answer_type = answer_key[i].match(/\|(.*?)}%$/gm);
				answer_type = (answer_type) ? answer_type[0].replace(/\||}%/gm, '') : '';
				answer_type = answer_type.trim();
				check_type.push(answer_type);
				if (answer_type == '' || answer_type == 'c') {
					if(index != undefined) {
						createTextbox(originalKey, i, user_xml, index, org_cdata);
					} else {
						createTextbox(originalKey, i, user_xml);
					}
				} else if (answer_type == 'n') {
					if(index != undefined) {
						createTextbox(originalKey, i, user_xml, index, org_cdata);
					} else {
						createTextbox(originalKey, i, user_xml);
					}
				} else if (answer_type == "e") {
					state.isMathquill = true;
					
					if (index != undefined) {
						createMathDiv(originalKey, i, user_xml, index, org_cdata);
					} else {
						createMathDiv(originalKey, i, user_xml);
					}
				}
			});
		} else {
			return '';
		}
	}

	function getClass(index) {
		if (index == state.classChange) {
			if (state.isColor) {
				return "border_green";
			} else {
				return "border_red";
			}
		} else {
			return "";
		}
	}

	function getCorrect(id) {
		if (state.display == 1) {
			if (special_module.smans != undefined) {
				if (special_module.smans[id] != undefined) {	
					if (special_module.smans[id].overall == 1) {
						return 'border_green';
					} else {
						return 'border_red';
					}
				}
			}
		} else {
			return '';
		}
	}

	function isSticky(index) {
		if(step_xml.smxml.step[index] != undefined) {
			if (step_xml.smxml.step[index]._sticky == 1) {
				return "sticky";
			}
		}
	}

	function toggleToolbar(value) {
		state.showToolbar = value;
	}

	function moveNext() {
		if (typeof QUIZPLAYERID != "undefined") {
			var timer = setTimeout(function(){
				window.parentElement.autoResize(QUIZPLAYERID);
				clearTimeout(timer);
			}, 0);
		}
		if (step_xml.smxml.step[steps+1] != undefined || step_xml.smxml.step[steps]._attempt == "1") {
			if(step_xml.smxml._gonext == 1) {
				nextbtnAnswer();
			} else {	
				if (step_xml.smxml.step[steps]._attempt == 1) {
					if (AH.selectAll('.edit_step').length == AH.selectAll('.answer_input').length) {
						checkAns();
					} else {
						notFilled();
					}
				} else { 
					nextStep();
					addSticky();
				}
			}
			if((step_xml.smxml.step.length <= (step_xml.smxml.step[steps]._seq)) && step_xml.smxml.step[steps]._attempt != 1) {
				state.hideNext = true;
			}
		} else {
			state.hideNext = true;
		}
	}

	function nextStep() {
		
		// jQuery('.edit_step').each(function() {		
		// 	if (jQuery(this).hasClass('mathquill')) {	
		// 		jQuery(this).prevAll('.disable_div').removeClass('h');		
		// 	} else {		
		// 		//jQuery(this).prop('disabled', 'disabled');
		// 	}		
		// 	jQuery(this).addClass('data-check');		
		// });
		AH.selectAll('.edit_step').forEach((_this)=>{
			if(_this.classList.contains('mathquill')) {
				if(((_this.previousElementSibling).classList.contains("disable_div"))) {
					AH.select(_this.previousElementSibling,'removeClass','h');
				}
			} else {
				_this.disabled = true;
			}
			_this.classList.add('data-check');
		})
		optionrem = 0;
		if(step_xml.smxml.step[steps+1] == undefined && step_xml.smxml.step[steps]._attempt == "1") {
			state.hideNext = true;
			setUserAns(usans);
			overAll();
			return;
		}
		if (steps != step_xml.smxml.step.length -1) {
			steps += 1;
			createStep();
			setUserAns(usans);
			overAll();
		} else {
			console.log("All steps are attempted");
		}
	} 


	

	function setUserAns(user_ans) {
		if(window.inNative) {
			window.getHeight && window.getHeight();
        }
		ISSPECIALMODULEUSERXMLCHANGE = 1;
		var cond = flagxml ? 'lists='+JSON.stringify(special_module.var_list) : ' ';
		
		//jQuery("#special_module_user_xml").val("<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>");
		AH.select("#special_module_user_xml").value = "<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>";
		// if(document.querySelector("#special_module_user_xml")!=null) {
		// 	document.querySelector("#special_module_user_xml").value = "<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>";
		// }
	}

	function overAll() {
		let over = false;
		let userAnswers = null;
		let inNativeIsCorrect = false;
		if(step_xml.smxml.step.length == state.itemArray.length) {
			let check = true;
			for (let i in smans) {
				if (smans[i].overall != undefined) {
					if (smans[i].overall == 1) {
						over = true;
					} else {
						over = false;
					}
					check = check && over;
				}
				if (check == false) {
					//jQuery("#answer").prop("checked", false);
					AH.select("#answer").checked = false;
					inNativeIsCorrect = false;
				} else {
					//jQuery("#answer").prop("checked", true);
					if(document.querySelector("#answer") != null) {
						document.querySelector("#answer").checked = true;
						inNativeIsCorrect = true;
					}
				}
			}
		}

		//userAnswers = jQuery('#special_module_user_xml').val();
		if(document.querySelector("#special_module_user_xml") !=null )
		userAnswers = document.querySelector("#special_module_user_xml").value;
		if (window.inNative) {
			window.postMessage('height___'+document.getElementsByClassName('inNativeStyle')[0].offsetHeight,'*');
			window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect }), '*');
		}
	}

	function addSticky() {
		//jQuery('[data-sticky]').addClass('sticky');
		AH.select('[data-sticky]','addClass','sticky');
	}
	

	function createTextbox(data, i, user_xml, index, org_cdata) {
		let original_data = data;
		data = data.replace(/%{|}%/g, "");
		data = data.split("|");
		let codetype = (data[1] && data[1].trim() == "n") ? "1" : "";
		let corr_ans = data[0].trim();
		let csStyle = "";
		if(corr_ans.indexOf("#style#") != -1) {
			let customStyle  = corr_ans.split("#style#");
			corr_ans = customStyle[0];
			csStyle = customStyle[1];
		}
		let txtWidth  = [];
		let anslen = corr_ans.split(",");
		// jQuery(anslen).each(function(j){
		// 	txtWidth[j] = ((anslen[j].length)*10+30)
		// });
		anslen.forEach(function(data,j){
			txtWidth[j] = ((anslen[j].length)*10+30)
		})
		if(index != undefined) {
			textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i, index, org_cdata);
		} else {
			textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i);
		}
	}

	function textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i, index, org_cdata) {
		if(index != undefined) {
			element_id = "s"+index+"_t"+i;
			element_div = "s"+index;
			let textbox = '<input type="text" id="'+element_id+'" class="fillintheblank ks nmb text-center span0 edit_st" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:'+(Math.max(...txtWidth) + 20)+'px;'+csStyle+'" />';
			let tag = '<span id="'+element_div+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="text" class="corr_div">'+data[0]+'</span>'+textbox+'</span>';
			let cd_ans = org_cdata.replace(original_data, tag);
			answer_array[index].__cdata = cd_ans;
		} else {	
			if (user_xml <= oldstep) {
				var steps_counter = user_xml;
			} else {
				var steps_counter = steps;
			}
			element_id = "s"+steps_counter+"_t"+i;
			element_div = "s"+steps_counter;
			let textbox = '<input type="text" id="'+element_id+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none"  style="width:'+(Math.max(...txtWidth) + 20)+'px;'+csStyle+'" />';
			let tag = '<span id="'+element_div+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="" class="corr_div h-imp">'+data[0]+'</span>'+textbox+'</span>';
			cdata = cdata.replace(original_data, tag);
			smans = createAns(smans, element_id, element_div, corr_ans)
			special_module.smans = smans;
		}
	}

	function createAns(obj, element_id, element_div, correctval) {
		if (typeof obj[element_div] == "undefined" || typeof obj[element_div][element_id] == "undefined") {
			if (typeof obj[element_div] == "undefined") {
				obj[element_div] = {};
			}
			obj[element_div][element_id] = {};
		}
		obj[element_div][element_id].value = correctval;
		return obj;
	}

	/*function notFilled() {
		jQuery('.edit_step').each(function(i, obj) {
			let element = jQuery(this);
			if (!jQuery(this).hasClass('answer_input')) {
				element.css({border: '2px solid #ff0000'});
				var timer = setTimeout(function() {
					element.css({border: '1px solid #ccc'});
					clearTimeout(timer);
				}, 500);
			}
			return; 
		});
	}*/

	function notFilled() {
		AH.selectAll('.edit_step').forEach((_element)=> {
			
			if (!_element.classList.contains('answer_input')) {
				_element.style.border = '2px solid #ff0000';
				var timer = setTimeout(function() {
					_element.style.border = '1px solid #ccc'
					clearTimeout(timer);
				}, 500);
			}
			return; 
		});
	}


	function checkAns(j) {
		
		wrong_choice = 0;
		optionrem += 1;
		for (let i in smans) {
			for (let prop in smans[i]) {
				if (j < oldstep) {
					var curr = j;
				} else {
					var curr = steps;
				}
				//try {
					if (usans["s"+curr] && usans["s"+curr][prop] != undefined) {
						if (smans["s"+curr][prop].value == usans["s"+curr][prop].value) {
							inputHover('correct', prop);
						} else if (/\,/g.test(smans["s"+curr][prop].value)) {
							let s_ans = (smans["s"+curr][prop].value).split(",");
							let u_ans = usans["s"+curr][prop].value;
							if(s_ans.indexOf(u_ans) > -1) {
								inputHover('correct', prop);
							} else {
								wrong_choice = 1;
								inputHover('wrong', prop);
							}
						} else {
							wrong_choice = 1;
							inputHover('wrong', prop);
						}
					}
				//} catch(e) {
				//	console.warn(e);
				//}
			}
		}
		if (step_xml.smxml.step[steps]._mode == 1) { 
			showAnsMod(j, "s"+j);
		} else {
			showAns(j, "s"+j);
		}
	}

	function inputHover(option, elem) {
		if (step_xml.smxml.step[steps]._mode != 1) { 
			if (option == 'correct') {
				//jQuery('#'+elem).removeClass('false-hover');
				AH.select('#'+elem,'removeClass','false-hover');
				//jQuery('#'+elem).addClass('true-hover');
				AH.select('#'+elem,'addClass','true-hover');
			} else if (option == 'wrong') {
				//jQuery('#'+elem).removeClass('true-hover');
				AH.select('#'+elem,'removeClass','true-hover');
				//jQuery('#'+elem).addClass('false-hover');
				AH.select('#'+elem,'addClass','false-hover');
			}
			if (optionrem>1) {
				//jQuery('#'+elem).prev().removeClass('h-imp');
				AH.select(AI.select('#'+elem).previousElementSibling,'removeClass','h-imp');
			}
			if(step_xml.smxml._fixed != 1) {
				var timer = setTimeout(function() {
					//jQuery('#'+elem).prev().addClass('h-imp');
					AH.select(AI.select('#'+elem).previousElementSibling,'addClass','h-imp');
				 	clearTimeout(timer);
				},2000);
			}
		}
		if (uxml) {
			//jQuery('.edit_step').each(function(i, obj) {
			AH.selectAll('.edit_step').forEach(function(obj, i) {		
				//if (jQuery(this).hasClass('mathquill')) {
					if (obj.classList.contains('mathquill')) {		
					//jQuery('#'+elem).prevAll('.disable_div').removeClass('h');	
					if((AH.select('#'+elem).previousElementSibling).classList.contains("disable_div")) {
						AH.select(AH.select('#'+elem).previousElementSibling,'removeClass','h');
					}


				//} else if(jQuery(this).hasClass('answer_input')) {
				}	else if(obj.classList.contains('answer_input')) {		
					//jQuery(this).prop('disabled', 'disabled');
					obj.disabled = true;
				}		
				//jQuery(this).addClass('data-check');
				obj.classList.add('data-check');
			});
		}
	}

	function showAns(j, outer) {
		var overall = 0;
		if (wrong_choice>0) {
			state.classChange = state.itemArray.length-1; 
			state.isColor = false;
			overall = 0;
			if (j<=oldstep) {
				smans[outer].overall = overall;
			} else {
				smans[element_div].overall = overall;
				overAll();
			}
		} else {
			state.classChange = state.itemArray.length-1; 
			state.isColor = true;
			overall = 1;
			if (j<=oldstep) {
				smans[outer].overall = overall;
			} else {
				smans[element_div].overall = overall;
				nextStep();
			}
		}
		if (optionrem>1) {
			nextStep();
		}
		if (usans[element_div] &&  usans[element_id] != undefined) {
			usans[element_div].optry = optionrem;
		}
		var timer = setTimeout(function() {
			state.classChange = -1;
			clearTimeout(timer);
		}, 2500);
	}

	function showAnsMod(j, outer) {
		var overall = 0;
		if (wrong_choice>0) {
			overall = 0;
			if (j<=oldstep) {
				smans[outer].overall = overall;
			} else {
				smans[element_div].overall = overall;
			}
		} else {
			overall = 1;
			if (j<=oldstep) {
				smans[outer].overall = overall;
			} else {
				smans[element_div].overall = overall;
			}
		}
		nextStep();
	}

	function handleToggle(btn) {
		if (btn == 1) {
			btntype = "correctans";
		} else if (btn == 2) {
			btntype = "yourans";
		}
		//forceUpdate(); 
	}

	function setReview() {
		
		isReview = true;
		overAll();	
		yourAnswer();
		//jQuery('.fillintheblank').prop("disabled", true);
		document.querySelectorAll('.fillintheblank').disabled = true;
	}

	function unsetReview() {
		
		isReview = false;
		state.display = -1;
		state.smController = ' h';
		
		//jQuery('.fillintheblank').removeClass('default-hover');
		AH.selectAll('.fillintheblank','removeClass','default-hover');
		//jQuery('.fillintheblank').prop("disabled", false);
		AH.selectAll('.fillintheblank').disabled = false;
		state.main_steps = false;
		state.correct_answer = true;
		
		//jQuery('.remed_disable').css('display', 'none');
		AH.selectAll('.remed_disable','css',{display:'none'});
		if((step_xml.smxml.step[steps+1] == undefined && step_xml.smxml.step[steps]._attempt == "1") || (step_xml.smxml.step[steps+1] == undefined && step_xml.smxml.step[steps]._viewonly == "1")) {
			if (AH.selectAll('.edit_step').length == AH.selectAll('.data-check').length) {
				state.hideNext =  true;
			} else {
				state.hideNext = false;
			}
		} else {			
			state.hideNext = false;
		}
		if(window.inNative) {
            window.getHeight && window.getHeight();
        }
	}

	function correctAnswer() {
		//handleToggle(1);
		state.display = -1;
		//jQuery('.fillintheblank').addClass('default-hover');
		AH.selectAll('.fillintheblank','addClass','default-hover');
		showCorrect();
		state.main_steps = true;
		state.correct_answer = false;
	
		if(window.inNative) {
			window.getHeight && window.getHeight();
        }
	}

	function showCorrect() {
		let show_ans = step_xml.smxml.step;
		show_ans.map(function(item, index) {
			let cdata_ans = item.__cdata;	
			let org_cdata = cdata_ans;		
			creatingInteractive('corr_ans', org_cdata, index);
		});
	}

	function yourAnswer() {
		//handleToggle(2);
		
		state.display = 1;
		state.hideNext = true;
		state.smController = '';
		
		//$('.fillintheblank').removeClass('default-hover');
		AH.selectAll(".fillintheblank","removeClass","default-hover");
		state.main_steps = false;
		state.correct_answer = true;
		
		//jQuery('.remed_disable').css('display', 'block');
		AH.selectAll('.remed_disable','css',{display:'block'});
		if(window.inNative) {
			window.getHeight && window.getHeight();
        }
	}

	function parseSteps(steps) {
		let user_step = XMLToJSON(steps);
		if(flagxml) {
			lists = JSON.parse(user_step.smans.div._lists);
		}
		oldstep = JSON.parse(user_step.smans.div._currStep);
	}

	function nextbtnAnswer() {
		
		let current = `s${steps}`;
		//let textboxes = jQuery('#'+current).find('.edit_step');
		let textboxes = AH.find('#'+current,'.edit_step','all');
		textboxes.forEach(function(item,index) {
			if (item.classList.contains('mathquill')) {
				mathquillAns(item, false);	
			} else {
				//let inp_id = jQuery(item).attr('id');
				let inp_id = item.getAttribute('id');
				//let inp_val = jQuery(item).val();
				let inp_val = item.value;
				usans = createAns(usans, inp_id, current, inp_val);
			}
		});
		if (step_xml.smxml.step[steps]._attempt == 1) {
			checkAns();
		} else { 
			nextStep();
			addSticky();
		}
	}

	// AH.createLink('../clsSMFill/css/fillintheblank.css');


		//To handle review toggle
	function handleReview(mode, event) {
		
		if (mode == 'c') {
			correctAnswer();
		} else {
			yourAnswer();
		}
	}


	function createMathDiv(data, i, user_xml, index, org_cdata) {
		let original_data = data;
		data = data.replace(/%{|}%/g,"");
		data = data.split("|");
		data[0] = data[0].replace(/user Response/g, '\\MathQuillMathField');
		// let split_data = addMathquill.split("##");
		let split_data = data[0].split("##");
		let random_key = Math.floor(Math.random() * split_data.length)
		let random_option = split_data[random_key];
		let userans = random_option.replace(/MathQuillMathField{(.*?)}/g,'MathQuillMathField{}');
		let defaultans = 0;
		let anskey = random_option;
		let answer_element = anskey.replace(/\\MathQuillMathField/g,'');
		if (random_option.indexOf("\MathQuillMathField") > -1) {
			anskey = random_option;
			defaultans = 1;
		}	
		if(index != undefined) {
			mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element, index, org_cdata);
		} else {
			mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element);
		}
	}


	function mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element, index, org_cdata) {
		let corr_ans = data[0].trim();
		if (user_xml <= oldstep) {
			var steps_counter = user_xml;
		} else {
			var steps_counter = steps;
		}
		if(index != undefined) {
			element_id = "s0"+index+"_t"+i;
			element_div = "s0"+index;
			let ans_id = "m0"+index+"_t"+i;
			let matheq = '<span  id="'+element_id+'" class="auto_height edit_st fillmathelement mathquill mq'+steps_counter+'" userAnsSeq="'+random_key+'" userans="'+userans+'" anskey="'+anskey+'" defaultans="'+defaultans+'" mathtype="1">'+'s'+'</span>';
			let tag = '<span id="'+element_div+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+ans_id+'" class="corr_div fillmathelement mathquill mq'+steps_counter+'" userAnsSeq="'+random_key+'" anskey="'+anskey+'" defaultans="'+defaultans+'" mathtype="1">'+answer_element+'</span>'+matheq+'</span>';
			let cd_ans = org_cdata.replace(original_data, tag);
			answer_array[index].__cdata = cd_ans;
		} else {
			element_id = "s"+steps_counter+"_t"+i;
			element_div = "s"+steps_counter;
			let ans_id = "m"+steps_counter+"_t"+i;
			let matheq = '<span  id="'+element_id+'" class="auto_height edit_step fillmathelement mathquill mq'+steps_counter+'" userAnsSeq="'+random_key+'" userans="'+userans+'" anskey="'+anskey+'" defaultans="'+defaultans+'" mathtype="1">'+'s'+'</span>';
			let tag = '<span id="'+element_div+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+ans_id+'" class="corr_div h-imp fillmathelement mathquill mq'+steps_counter+'" userAnsSeq="'+random_key+'" anskey="'+anskey+'" defaultans="'+defaultans+'" mathtype="1">'+answer_element+'</span>'+matheq+'</span>';
			cdata = cdata.replace(original_data, tag);
			smans = createAns(smans, element_id, element_div, corr_ans);
			special_module.smans = smans;
		}

		let time_interval = setInterval(function() { 
			if (typeof MathQuill == "function") {
				clearInterval(time_interval);
				let MQ = MathQuill.getInterface(2);
				//jQuery(".mathquill.mq"+steps_counter).each(function() {
				AH.selectAll(".mathquill.mq"+steps_counter).forEach((_this)=> {
					//let math_itemid  = jQuery(this).attr('id');
					let math_itemid  = _this.getAttribute('id');
					//let defaultans = jQuery(this).attr('defaultans');
					let defaultans = _this.getAttribute('defaultans');
					if (defaultans == 1) {
						//let latex = jQuery(this).attr('userans');
						let latex = _this.getAttribute('userans');
						//jQuery('#'+math_itemid).text(latex);
						AH.select('#'+math_itemid).innerText = latex
					} else {
						//jQuery('#'+math_itemid).text(jQuery(this).attr('userans'));
						AH.select('#'+math_itemid).innerText = _this.getAttribute("userans");
					}
					try {
						fill_math[math_itemid]  = MQ.StaticMath(document.getElementById(math_itemid));
					} catch(e) {
						console.log(e);
					}
				});
			}
		}.bind(this),100);	
	}

	function mathquillAns(element, math_user) {
		let innerfield = [];
		let div_outer = jQuery(element).closest('div').find("span.fillelement").attr('id');
		let math_itemid = jQuery(element).attr('id');
		let original_latex = jQuery(element).attr("userans").trim();
		let userans;
		if (math_user == "math_user") {
			userans = original_latex; 
		} else {
			let MQ = MathQuill.getInterface(2);
			let math_item = MQ.StaticMath(document.getElementById(math_itemid));
			for (let i=0; i<= math_item.innerFields.length-1 ; i++) {
				innerfield[i] = math_item.innerFields[i].latex();
			}
			let new_math_field = original_latex;
			// let mathfield = original_latex.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);
			let mathfield = original_latex.match(/\\MathQuillMathField{(.*?)\}/g);
			for (let i in mathfield) {
				const create_mathfield = '\\MathQuillMathField{'+innerfield[i]+'}';
				// const new_mathfield = mathfield[i].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g , create_mathfield);
				const new_mathfield = mathfield[i].replace(/\\MathQuillMathField{(.*?)\}/g, create_mathfield);
				let regex = mathfield[i];
				new_math_field = new_math_field.replace(regex, new_mathfield);
			}
			original_latex = new_math_field;
			userans = original_latex;
		}

		usans = createAns(usans, math_itemid, div_outer, userans);
		setUserAns(usans);
	}
	

</script>

<main>
	{#if state.blank == false}
		
		<center>
			<!-- <div class={"btn-group clearfix review " +state.smController} id="sm_controller">
				<button type="button" class={btntype == "correctans" ? "btn btn-light correct-ans active" : "btn btn-light correct-ans"} on:click={() => {correctAnswer(); }}>{l.correct_answer}</button>
				<button type="button" class={btntype == "yourans" ? "btn btn-light your-ans active" : "btn btn-light your-ans"} on:click={() => {yourAnswer();}}>{l.your_answer}</button>
			</div> -->
			<ItemHelper 
				
				on:setReview = {setReview}
				on:unsetReview = {unsetReview}
				handleReviewClick={handleReview}
				reviewMode={isReview}
			/>
			<div class={state.main_steps ? 'h-imp': 'inNativeStyle'} style={"width:" + (AH.isValid(window.inNative) ? "100%" : "700px")}>
				
				{#each state.itemArray as item, index}
						<div data-sticky={isSticky(index)} class="bt-pd bg-white mt-3"> 	 	
							<div id={"s"+index} class={"bg-white " + ((state.display == 1) ? ((special_module.smans != undefined) ?  ((special_module.smans["s"+index] != undefined) ? ((special_module.smans["s"+index].overall == 1) ? 'border_green': 'border_red') : '')  : '')  : '')}>
								<div id={'data-block_'+index} class={"main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " +((index == state.classChange) ? ((state.isColor) ? 'border_green' : 'border_red') : '')} key={index}>
									<div seq={"s"+index}>{@html item.cdata}</div>
								</div>
							</div>
						</div>
				{/each}
				
			</div>
			<div class={state.correct_answer ? 'h-imp': ''} style={"width:" + (AH.isValid(window.inNative) ? "100%" : "700px")}>
				{#each answer_array as item,index}
			
						<div data-sticky={isSticky(index)} class="bt-pd bg-white mt-3">
							<div id={"s"+index} class={"bg-white " + ((state.display == 1) ? ((special_module.smans != undefined) ?  ((special_module.smans["s"+index] != undefined) ? ((special_module.smans["s"+index].overall == 1) ? 'border_green': 'border_red') : '')  : '')  : '')}>
								<div id={'data-block_'+index} class={"main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " +((index == state.classChange) ? ((state.isColor) ? 'border_green' : 'border_red') : '')} key={index}>
									<div seq={"s"+index}>{@html item.__cdata}</div>
								</div>
							</div>
						</div>
				
				{/each}
			</div>
			{#if state.showToolbar}
				<FillInTheBlanksToolbar  spanId={state.spanId} divId={state.divId} action={fill_math[fillId]} show={(value) => {toggleToolbar(value)}}/>
			{/if}

				<div class={state.hideNext ? 'h-imp': null}>
					<button type="button" style={'width:auto;font-size:15px;margin:15px 0;'} class="btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3"  on:click={() => setTimeout(function(){moveNext()},100)} >{l.next}</button>
				</div>
		</center>
	{/if}
</main>

<style>
	:global(.darkgrey_border) {
  	  border: 1px solid #ccc!important;
	}

	:global(.p-lg) {
  	  padding: 15px;
	}
	:global(.true-hover) {
		outline: 0;
		border: 2px solid #14ca14!important;
	}

	:global(.false-hover) {
		outline: 0;
		border: 2px solid #e45252!important;
	}

	:global(.default-hover) {
		border-color: transparent!important;
		-webkit-box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;
		-moz-box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;
		box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;
	}

	:global(.blocked) {
		display: block !important;
	}

	:global(.border_green) {
		border: 3px solid green!important;
	}

	:global(.border_red) {
		border: 3px solid red!important;
	}

	:global(.sticky) {
		z-index: 800;
		position: sticky;
		top: 0
	}

	:global(.corr_div) {
		position: absolute!important;
		width: 60px;
		line-height: 30px;
		background-color: #21a81d;
		color: #ffffff;
		z-index: 1;
		display: inline-block;
		vertical-align: middle;
		cursor: default;
	}

	:global([id^="fillmain"]) {
        overflow:hidden;
        /*width:700px;  testing*/
        text-align:left;
    }
    :global([id^="fillmain"] pre) {
        background: none;
        border: none;
        font-size: 14px!important;
    }
    :global([id^="fillmain"] .string) {
        min-height:50px;
        margin-top:10px;
        margin-right:10px;
    }
    :global([id^="fillmain"] .footerstr) {
        position:relative;
        margin-top: 10px;
        background-color: #ccc;
        padding: 15px;
        min-height: 60px;/*100px;*/
    }
    :global([id^="fillmain"] .footerstr .arrow-up) {
        position: absolute;
        top: -10px;
        right: 50%;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #ccc;
    }
    :global([id^="fillmain"] .fill-row) {
        padding:6px;
    }
    :global([id^="fillmain"] .fillelement, [id^="fillmain"] .drag-resize) {
        height:30px;
        display:inline-block;
        position:relative;
        min-height: 30px;
        margin: 1px;
    }
    :global([id^="fillmain"] input[type="text"], [id^="fillmain"] select) {	
        height:99%!important;
        resize: none;
        font-size:12px;
        color: #000;
        max-width: 800px;
    }
    :global([id^="fillmain"] .drag-resize) {
        vertical-align:middle;
        border:1px solid #31B731;
        text-align:center;
        padding:3px;
        font-size: 14px;
    }
    :global([id^="fillmain"] .drag-resize.ui-draggable) {
        cursor:move;
    }
    :global([id^="fillmain"] .drop-hover) {
        border: 1px dashed red!important;
        box-shadow: 0 0 0 2px yellow inset;
        outline: 1px solid blue;
    }
    :global([id^="fillmain"] .fillcheck ul) {
        width:220px;
    }
    :global([id^="fillmain"] .fillcheck li.selected) {
        background-color: #E5E5E5;
    }
    :global(.fillcheck .selected .icomoon-checkmark-3:before) {
        float: left;
        color: blue;
        padding: 3px;
        position: relative;
        right: 14px;
    }
    :global(.fillcheck .icomoon-close-2:before) {
        float: left;
        color: blue;
        position: relative;
        right: 14px;
        font-size: 20px;
    }
    :global(.MathJax_Display) {
            display : inline!important;
    }
    :global([id^="fillmain"] .select) {
        font-size: 15px;
    }
    :global([id^="fillmain"] .textarea) {
        vertical-align:middle;
        border-radius:3px;
        background:#ffe;
        border: 1px solid #ccc;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    }
    :global(.ui-draggable-disabled) {
        cursor: no-drop!important;
        opacity: 0.5!important;
    }

</style>