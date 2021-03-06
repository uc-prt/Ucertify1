
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, J as append_styles, v as validate_slots, I as beforeUpdate, A as AH, X as XMLToJSON, o as onMount, a8 as afterUpdate, w as writable, y as l, K as JSONToXML, a2 as onUserAnsChange, C as validate_each_argument, N as binding_callbacks, O as bind, e as element, c as create_component, f as space, j as attr_dev, k as add_location, n as insert_dev, m as mount_component, p as append_dev, q as listen_dev, Y as add_flush_callback, t as transition_in, a as transition_out, x as detach_dev, b as destroy_component, H as destroy_each, r as group_outros, u as check_outros } from './main-34a3b679.js';
import { I as ItemHelper } from './ItemHelper-8c058fd0.js';
import './style-inject.es-1c867377.js';
import { F as FillInTheBlanksToolbar } from './mathquill-f6114b87.js';

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
							var testing = (0, eval)(expression),
								str = "";
							for (var k=0;k<testing.length;k++) {
								testing[k] = "("+testing[k]+") ";
								str = str+testing[k];
							}	
							var_list[xml_arr[0].trim()] = str;
						}					
						if (!iscartesian) {
							var_list[xml_arr[0].trim()] = (0, eval)(expression).toString();					
						}						
						if (var_list[xml_arr[0].trim()] == "") {
							var_list[xml_arr[0].trim()] = "None of these";
						}				
					} 
					if (ALGO.mathtype == "") {						
						var_list[xml_arr[0].trim()] = (0, eval)(expression.trim());
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
};

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

/* clsSMStepAlgo\StepAlgoPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1, console: console_1 } = globals;
const file = "clsSMStepAlgo\\StepAlgoPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-35ayfz", ".darkgrey_border{border:1px solid #ccc!important}.p-lg{padding:15px}.true-hover{outline:0;border:2px solid #14ca14!important}.false-hover{outline:0;border:1px solid #e45252!important}.default-hover{border-color:transparent!important;-webkit-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;-moz-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important}.blocked{display:block !important}.border_green{border:3px solid green!important}.border_red{border:3px solid red!important}.sticky{z-index:800;position:sticky;top:0\r\n\t}.corr_div{position:absolute!important;width:100%;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default;left:0}.corr_div_correct{position:relative;width:38px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}[id^=\"fillmain\"]{overflow:hidden;text-align:left}[id^=\"fillmain\"] pre{background:none;border:none;font-size:14px!important}[id^=\"fillmain\"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^=\"fillmain\"] .footerstr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^=\"fillmain\"] .footerstr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^=\"fillmain\"] .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}[id^=\"fillmain\"] input[type=\"text\"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^=\"fillmain\"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^=\"fillmain\"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^=\"fillmain\"] .drag-resize.ui-draggable{cursor:move}[id^=\"fillmain\"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^=\"fillmain\"] .fillcheck ul{width:220px}[id^=\"fillmain\"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^=\"fillmain\"] .select{font-size:15px}[id^=\"fillmain\"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.auto_width{width:auto!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,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 */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[71] = list[i];
	child_ctx[73] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[71] = list[i];
	child_ctx[73] = i;
	return child_ctx;
}

// (1145:1) {#if state.blank == false}
function create_if_block(ctx) {
	let center;
	let itemhelper;
	let t0;
	let div0;
	let div0_class_value;
	let div0_style_value;
	let t1;
	let div1;
	let div1_class_value;
	let div1_style_value;
	let t2;
	let fillintheblankstoolbar;
	let updating_display;
	let t3;
	let div2;
	let button;
	let button_style_value;
	let div2_class_value;
	let current;
	let mounted;
	let dispose;

	itemhelper = new ItemHelper({
			props: {
				handleReviewClick: /*handleReview*/ ctx[12],
				reviewMode: /*isReview*/ ctx[0],
				customReviewMode: /*customIsReview*/ ctx[1]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[10]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[11]);
	let each_value_1 = /*state*/ ctx[6].itemArray;
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*answer_array*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	function fillintheblankstoolbar_display_binding(value) {
		/*fillintheblankstoolbar_display_binding*/ ctx[16](value);
	}

	let fillintheblankstoolbar_props = {
		spanId: /*state*/ ctx[6].spanId,
		divId: /*state*/ ctx[6].divId,
		action: /*fill_math*/ ctx[2][/*fillId*/ ctx[5]],
		show: /*toggleToolbar*/ ctx[8]
	};

	if (/*state*/ ctx[6].showToolbar !== void 0) {
		fillintheblankstoolbar_props.display = /*state*/ ctx[6].showToolbar;
	}

	fillintheblankstoolbar = new FillInTheBlanksToolbar({
			props: fillintheblankstoolbar_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(fillintheblankstoolbar, 'display', fillintheblankstoolbar_display_binding));

	const block = {
		c: function create() {
			center = element("center");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t1 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			create_component(fillintheblankstoolbar.$$.fragment);
			t3 = space();
			div2 = element("div");
			button = element("button");
			button.textContent = `${l.next}`;
			attr_dev(div0, "class", div0_class_value = /*state*/ ctx[6].correct_answer ? 'your' : 'your h-imp');
			attr_dev(div0, "style", div0_style_value = "width:" + (AH.isValid(window.inNative) ? "100%" : "700px"));
			add_location(div0, file, 1155, 3, 36146);

			attr_dev(div1, "class", div1_class_value = /*state*/ ctx[6].correct_answer
			? 'h-imp correct'
			: 'correct');

			attr_dev(div1, "style", div1_style_value = "width:" + (AH.isValid(window.inNative) ? "100%" : "700px"));
			add_location(div1, file, 1168, 3, 36920);
			attr_dev(button, "type", "button");
			attr_dev(button, "style", button_style_value = 'width:auto;font-size:15px;margin:15px 0;');
			attr_dev(button, "class", "btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3");
			add_location(button, file, 1185, 4, 37901);
			attr_dev(div2, "class", div2_class_value = /*state*/ ctx[6].hideNext ? 'h-imp' : null);
			add_location(div2, file, 1184, 3, 37851);
			add_location(center, file, 1146, 2, 35931);
		},
		m: function mount(target, anchor) {
			insert_dev(target, center, anchor);
			mount_component(itemhelper, center, null);
			append_dev(center, t0);
			append_dev(center, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			append_dev(center, t1);
			append_dev(center, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(center, t2);
			mount_component(fillintheblankstoolbar, center, null);
			append_dev(center, t3);
			append_dev(center, div2);
			append_dev(div2, button);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[17], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			if (dirty[0] & /*customIsReview*/ 2) itemhelper_changes.customReviewMode = /*customIsReview*/ ctx[1];
			itemhelper.$set(itemhelper_changes);

			if (dirty[0] & /*isSticky, state, special_module, isReview*/ 209) {
				each_value_1 = /*state*/ ctx[6].itemArray;
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div0, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (!current || dirty[0] & /*state*/ 64 && div0_class_value !== (div0_class_value = /*state*/ ctx[6].correct_answer ? 'your' : 'your h-imp')) {
				attr_dev(div0, "class", div0_class_value);
			}

			if (dirty[0] & /*isSticky, state, special_module, isReview, answer_array*/ 217) {
				each_value = /*answer_array*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty[0] & /*state*/ 64 && div1_class_value !== (div1_class_value = /*state*/ ctx[6].correct_answer
			? 'h-imp correct'
			: 'correct')) {
				attr_dev(div1, "class", div1_class_value);
			}

			const fillintheblankstoolbar_changes = {};
			if (dirty[0] & /*state*/ 64) fillintheblankstoolbar_changes.spanId = /*state*/ ctx[6].spanId;
			if (dirty[0] & /*state*/ 64) fillintheblankstoolbar_changes.divId = /*state*/ ctx[6].divId;
			if (dirty[0] & /*fill_math, fillId*/ 36) fillintheblankstoolbar_changes.action = /*fill_math*/ ctx[2][/*fillId*/ ctx[5]];

			if (!updating_display && dirty[0] & /*state*/ 64) {
				updating_display = true;
				fillintheblankstoolbar_changes.display = /*state*/ ctx[6].showToolbar;
				add_flush_callback(() => updating_display = false);
			}

			fillintheblankstoolbar.$set(fillintheblankstoolbar_changes);

			if (!current || dirty[0] & /*state*/ 64 && div2_class_value !== (div2_class_value = /*state*/ ctx[6].hideNext ? 'h-imp' : null)) {
				attr_dev(div2, "class", div2_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			transition_in(fillintheblankstoolbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			transition_out(fillintheblankstoolbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(center);
			destroy_component(itemhelper);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			destroy_component(fillintheblankstoolbar);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(1145:1) {#if state.blank == false}",
		ctx
	});

	return block;
}

// (1158:4) {#each state.itemArray as item, index}
function create_each_block_1(ctx) {
	let div3;
	let div2;
	let div1;
	let div0;
	let raw_value = /*item*/ ctx[71].cdata + "";
	let div0_seq_value;
	let div1_id_value;
	let div1_class_value;
	let div1_key_value;
	let div2_id_value;
	let div2_class_value;
	let t;
	let div3_data_sticky_value;
	let div3_tabindex_value;

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t = space();
			attr_dev(div0, "seq", div0_seq_value = "s" + /*index*/ ctx[73]);
			add_location(div0, file, 1161, 9, 36795);
			attr_dev(div1, "id", div1_id_value = 'data-block_' + /*index*/ ctx[73]);

			attr_dev(div1, "class", div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*state*/ ctx[6].display == 1 && /*special_module*/ ctx[4]?.smans && /*special_module*/ ctx[4]?.smans["s" + /*index*/ ctx[73]] != undefined && /*isReview*/ ctx[0]
			? /*special_module*/ ctx[4]?.smans["s" + /*index*/ ctx[73]].overall == 1
				? 'border_green'
				: 'border_red'
			: ''));

			attr_dev(div1, "key", div1_key_value = /*index*/ ctx[73]);
			add_location(div1, file, 1160, 8, 36467);
			attr_dev(div2, "id", div2_id_value = "s" + /*index*/ ctx[73]);
			attr_dev(div2, "class", div2_class_value = "bg-white");
			add_location(div2, file, 1159, 7, 36418);
			attr_dev(div3, "data-sticky", div3_data_sticky_value = /*isSticky*/ ctx[7](/*index*/ ctx[73]));
			attr_dev(div3, "class", "bt-pd bg-white mt-3");
			attr_dev(div3, "tabindex", div3_tabindex_value = 0);
			add_location(div3, file, 1158, 6, 36329);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div1);
			append_dev(div1, div0);
			div0.innerHTML = raw_value;
			append_dev(div3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 64 && raw_value !== (raw_value = /*item*/ ctx[71].cdata + "")) div0.innerHTML = raw_value;
			if (dirty[0] & /*state, special_module, isReview*/ 81 && div1_class_value !== (div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*state*/ ctx[6].display == 1 && /*special_module*/ ctx[4]?.smans && /*special_module*/ ctx[4]?.smans["s" + /*index*/ ctx[73]] != undefined && /*isReview*/ ctx[0]
			? /*special_module*/ ctx[4]?.smans["s" + /*index*/ ctx[73]].overall == 1
				? 'border_green'
				: 'border_red'
			: ''))) {
				attr_dev(div1, "class", div1_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(1158:4) {#each state.itemArray as item, index}",
		ctx
	});

	return block;
}

// (1170:4) {#each answer_array as item,index}
function create_each_block(ctx) {
	let div3;
	let div2;
	let div1;
	let div0;
	let raw_value = /*item*/ ctx[71].__cdata + "";
	let div0_seq_value;
	let div1_id_value;
	let div1_class_value;
	let div1_key_value;
	let div2_id_value;
	let div2_class_value;
	let t;
	let div3_data_sticky_value;
	let div3_tabindex_value;

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t = space();
			attr_dev(div0, "seq", div0_seq_value = "s" + /*index*/ ctx[73]);
			add_location(div0, file, 1174, 9, 37566);
			attr_dev(div1, "id", div1_id_value = 'data-block_' + /*index*/ ctx[73]);

			attr_dev(div1, "class", div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*state*/ ctx[6].display == 1 && /*special_module*/ ctx[4]?.smans && /*special_module*/ ctx[4].smans["s" + /*index*/ ctx[73]] != undefined && /*isReview*/ ctx[0]
			? /*special_module*/ ctx[4].smans["s" + /*index*/ ctx[73]].overall == 1
				? 'border_green'
				: 'border_red'
			: ''));

			attr_dev(div1, "key", div1_key_value = /*index*/ ctx[73]);
			add_location(div1, file, 1173, 8, 37240);
			attr_dev(div2, "id", div2_id_value = "s" + /*index*/ ctx[73]);
			attr_dev(div2, "class", div2_class_value = "bg-white ");
			add_location(div2, file, 1172, 7, 37190);
			attr_dev(div3, "data-sticky", div3_data_sticky_value = /*isSticky*/ ctx[7](/*index*/ ctx[73]));
			attr_dev(div3, "class", "bt-pd bg-white mt-3");
			attr_dev(div3, "tabindex", div3_tabindex_value = 0);
			add_location(div3, file, 1171, 6, 37104);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div1);
			append_dev(div1, div0);
			div0.innerHTML = raw_value;
			append_dev(div3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*answer_array*/ 8 && raw_value !== (raw_value = /*item*/ ctx[71].__cdata + "")) div0.innerHTML = raw_value;
			if (dirty[0] & /*state, special_module, isReview*/ 81 && div1_class_value !== (div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*state*/ ctx[6].display == 1 && /*special_module*/ ctx[4]?.smans && /*special_module*/ ctx[4].smans["s" + /*index*/ ctx[73]] != undefined && /*isReview*/ ctx[0]
			? /*special_module*/ ctx[4].smans["s" + /*index*/ ctx[73]].overall == 1
				? 'border_green'
				: 'border_red'
			: ''))) {
				attr_dev(div1, "class", div1_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(1170:4) {#each answer_array as item,index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let current;
	let if_block = /*state*/ ctx[6].blank == false && create_if_block(ctx);

	const block = {
		c: function create() {
			main = element("main");
			if (if_block) if_block.c();
			add_location(main, file, 1143, 0, 35888);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			if (if_block) if_block.m(main, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*state*/ ctx[6].blank == false) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*state*/ 64) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(main, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
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

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('StepAlgoPreview', slots, []);
	let step_xml;
	let smans = {};
	let usans = {};
	let element_id, element_div = '';
	let cdata = '';
	let fill_math = [];
	var answer_array = [];
	let btntype;
	let resultNew = {};
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
	let txtWidth = [];
	let globWith = '';
	let new_xml;
	let { xml } = $$props;
	let { stopPreviewUpdate } = $$props;
	let { isReview } = $$props;
	let { uxml } = $$props;
	let MQ;
	let customIsReview = isReview;

	let stateData = writable({
		blank: true,
		hideNext: false,
		itemArray: [],
		classChange: -1,
		isColor: true,
		smController: "h",
		display: -1,
		showToolbar: true,
		isMathquill: false,
		correct_answer: true,
		main_steps: false,
		your_answer: []
	});

	const unsubscribe = stateData.subscribe(items => {
		$$invalidate(6, state = items);
	});

	beforeUpdate(() => {
		AH.addScript("", itemUrl + "src/libs/mathQuill_new.js");

		if (uxml) {
			let answer = XMLToJSON(uxml);

			if (answer?.smans) {
				if (answer?.smans.div) {
					if (answer?.smans.div._userAns) {
						parseSteps(uxml);
					}
				}
			}
		}

		if (xml != state.xml) {
			$$invalidate(6, state.xml = xml, state);
			if (stopPreviewUpdate == true) return false;

			if (!uxml) {
				steps = 0;
				$$invalidate(6, state.itemArray = [], state);
				(usans = {});
				$$invalidate(6, state.hideNext = false, state);
				reset();
			}

			$$invalidate(6, state.blank = false, state);
			new_xml = XMLToJSON(state.xml);
			loadModule(new_xml);
		}
	});

	onMount(() => {
		AH.listen(document, 'keydown', '.edit_step', function (data, e) {
			//let ele = $(this);
			let l = e.target.value.split('').length * 10 + 45 + 'px';

			data.style.width = l;

			if (e.target.previousSibling) {
				e.target.previousSibling.style.width = l;
			}

			globWith = l;
		});

		//window.J = ju;
		AH.set('stepAlgo', this);

		if (in_editor) {
			AH.addScript("", "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js");
		}

		//AH.addScript("", itemUrl + "src/libs/mathQuill_new.js");
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		setTimeout(
			function () {
				//jQuery('.toolbar_container_one').addClass('h-imp');
				AH.selectAll('.toolbar_container_one', 'addClass', 'h-imp');
			},
			100
		);

		AH.listen(document, 'click', '.edit_step', _element => {
			setOutline(_element);
		});

		AH.listen(document, 'keyup', '.edit_step', _element => {
			setOutline(_element);
		});

		AH.listen(document, 'change', '.edit_step', _element => {
			setOutline(_element);
		});

		AH.listen(document, 'click', 'span.mq-editable-field.mq-focused', _e => {
			let span_math = _e;
			let is_fillid = true;
			let fillid;

			while (is_fillid) {
				span_math = span_math.parentElement;

				if (span_math.getAttribute('id')) {
					is_fillid = false;
					fillid = span_math.getAttribute('id');
					$$invalidate(5, fillId = fillid);
				}
			}

			let latex_array = [];

			AH.selectAll("#" + fillid + " span.mq-editable-field").forEach(_this => {
				let command_id = _this.getAttribute('mathquill-command-id');
				latex_array.push(command_id);
			}); // Need to fixed it

			let math_id = _e.getAttribute('mathquill-command-id');
			let index_id = latex_array.indexOf(math_id);
			$$invalidate(6, state.spanId = index_id, state);
			$$invalidate(6, state.divId = fillid, state);
			AH.selectAll('.toolbar_container_one', 'removeClass', 'h-imp');
			$$invalidate(6, state.showToolbar = true, state);
		});

		// jQuery(document).on('click', '.next_step', function(e) {
		// 	if (typeof QUIZPLAYERID != "undefined") {
		// 		window.parent.autoResize(QUIZPLAYERID);
		// 	}
		// 	e.preventDefault();
		// 	inputFilled();
		// });
		AH.listen(document, 'click', '.next_step', function (curr, e) {
			if (typeof QUIZPLAYERID != "undefined") {
				window.parentElement.autoResize(QUIZPLAYERID);
			}

			e.preventDefault();
			inputFilled();
		});

		// setTimeout(function() {
		// 	jQuery("#set-review").on('click', function() {
		// 		setReview();
		// 	});
		// 	jQuery("#unset-review").on('click', function() {
		// 		unsetReview();
		// 	});
		// },1000);
		setTimeout(
			function () {
				AH.listen(document, 'click', '#set-review', function () {
					setReview();
				});

				AH.listen(document, 'click', '#unset-review', function () {
					unsetReview();
				});
			},
			1000
		);

		if (window.inNative) {
			setTimeout(
				function () {
					window.postMessage('height___' + document.getElementsByClassName('inNativeStyle')[0].offsetHeight, '*');
				},
				200
			);
		}

		if (window.inNative) {
			window.checkReview = isReview => isReview ? self.setReview() : self.unsetReview();
		}
	});

	function setOutline(_element) {
		if (_element.nodeName) {
			if (_element.classList.contains('mathquill')) {
				mathquillAns(_element, false);
			} else {
				let inp_id = _element.getAttribute('id');
				let inp_div = _element.closest('div').getAttribute('seq');
				let inp_val = _element.value;
				usans = createAns(usans, inp_id, inp_div, inp_val);
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
							ans_arr.map(function (obj) {
								let math_field = obj.toString().replace(/MathQuillMathField\{|\}/g, '');

								if (math_field == '') {
									//jQuery("#"+key).removeClass('answer_input');
									AH.select("#" + key, 'removeClass', 'answer_input');
								} else {
									//jQuery("#"+key).addClass('answer_input');
									AH.select("#" + key, 'addClass', 'answer_input');
								}
							});
						} else {
							//jQuery("#"+key).addClass('answer_input');
							AH.select("#" + key, 'addClass', 'answer_input');
						}
					} else {
						//jQuery("#"+key).removeClass('answer_input');
						AH.select("#" + key, 'removeClass', 'answer_input');
					}
				}
			}
		}
	}

	function loadModule(new_xml) {
		flagxml = false;

		if (new_xml.smxml.algo != "undefined" && new_xml.smxml.algo) {
			flagxml = true;
		}

		if (flagxml) {
			var_list = ALGO.init(new_xml.smxml.algo);
		}

		let xml_str = JSON.stringify(new_xml);

		if (flagxml) {
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
		$$invalidate(3, answer_array = answer_arr_clone.slice());

		if (typeof Object.assign != 'function') {
			Object.assign = function (target) {

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

		answer_arr_clone.map(function (item, i) {
			$$invalidate(3, answer_array[i] = Object.assign({}, item), answer_array);
		});

		if (oldstep != '') {
			steps = oldstep;

			for (let i = 0; i <= oldstep; i++) {
				createStep(i);
			}
		} else {
			createStep();
		}

		if (uxml) {
			let answer = XMLToJSON(uxml);

			if (answer?.smans) {
				if (answer?.smans.div) {
					if (answer?.smans.div._userAns) {
						var timer = setTimeout(
							function () {
								parseUserAns(uxml);
								clearTimeout(timer);
							},
							50
						);
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

					if (AH.select('#' + j).classList.contains('mathquill')) {
						//jQuery('#'+j).attr('userans', box_value);
						AH.select('#' + j, 'userans', box_value);

						mathquillAns('#' + j, "math_user");
					} else {
						//jQuery('#'+j).val(box_value).focus().blur(); 
						AH.select('#' + j).value = box_value;

						setOutline(AH.select('#' + j));
					}

					optionrem = 0;
					inputFilled();
					checkAns(val);
				}
			}
		} //forceUpdate();
	}

	function createStep(i) {
		if (flagxml) {
			$$invalidate(4, special_module.var_list = var_list, special_module);
		}

		$$invalidate(4, special_module.cuurentStep = steps, special_module);
		optionrem = 0;
		const item = state.itemArray;
		parseXmlAuthoring(step_xml, i);
		item.push({ cdata });
		$$invalidate(6, state.itemArray = item, state);
	}

	function reset() {
		//jQuery(document).find('.sticky').removeClass('sticky');
		AH.find(document, '.sticky', {
			action: 'removeClass',
			actionData: 'sticky'
		});

		//jQuery('.edit_step').removeAttr('disabled');
		AH.selectAll('.edit_step', 'removeAttr', 'disabled');

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

		if (answer_key) {
			//jQuery(answer_key).each(function(i) {
			answer_key.forEach(function (data, i) {
				if (index != undefined) {
					var org_cdata = answer_array[index].__cdata;
				}
				let originalKey = answer_key[i];
				answer_type = answer_key[i].match(/\|(.*?)}%$/gm);
				answer_type = answer_type ? answer_type[0].replace(/\||}%/gm, '') : '';
				answer_type = answer_type.trim();

				if (answer_type == '' || answer_type == 'c') {
					if (index != undefined) {
						createTextbox(originalKey, i, user_xml, index, org_cdata);
					} else {
						createTextbox(originalKey, i, user_xml);
					}
				} else if (answer_type == 'n') {
					if (index != undefined) {
						createTextbox(originalKey, i, user_xml, index, org_cdata);
					} else {
						createTextbox(originalKey, i, user_xml);
					}
				} else if (answer_type == "e") {
					$$invalidate(6, state.isMathquill = true, state);

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
		if (step_xml.smxml.step[index] != undefined) {
			if (step_xml.smxml.step[index]._sticky == 1) {
				return "sticky";
			}
		}
	}

	function toggleToolbar(value) {
		$$invalidate(6, state.showToolbar = value, state);
	}

	function moveNext() {
		if (typeof QUIZPLAYERID != "undefined") {
			var timer = setTimeout(
				function () {
					window.parentElement.autoResize(QUIZPLAYERID);
					clearTimeout(timer);
				},
				0
			);
		}

		if (step_xml.smxml.step[steps + 1] != undefined || step_xml.smxml.step[steps]._attempt == "1") {
			if (step_xml.smxml._gonext == 1) {
				nextbtnAnswer();
			} else {
				if (step_xml.smxml.step[steps]._attempt == 1) {
					if (AH.selectAll('.edit_step').length == AH.selectAll('.answer_input').length) {
						//checkAns();
						checkAns(steps);
					} else {
						notFilled();
					}
				} else {
					nextStep();
					addSticky();
				}
			}

			if (step_xml.smxml.step.length <= step_xml.smxml.step[steps]._seq && step_xml.smxml.step[steps]._attempt != 1) {
				$$invalidate(6, state.hideNext = true, state);
			}
		} else {
			$$invalidate(6, state.hideNext = true, state);
		}
	}

	function nextStep() {
		AH.selectAll('.edit_step').forEach(_this => {
			if (_this.classList.contains('mathquill')) {
				if (_this.previousElementSibling.classList.contains("disable_div")) {
					AH.select(_this.previousElementSibling, 'removeClass', 'h');
				}
			} else {
				_this.disabled = true;
			}

			_this.classList.add('data-check');
		});

		optionrem = 0;

		if (step_xml.smxml.step[steps + 1] == undefined && step_xml.smxml.step[steps]._attempt == "1") {
			$$invalidate(6, state.hideNext = true, state);
			setUserAns(usans);
			overAll();
			return;
		}

		if (steps != step_xml.smxml.step.length - 1) {
			steps += 1;
			createStep(steps);
			setUserAns(usans);
			overAll();
		} else {
			console.log("All steps are attempted");
		}
	}

	function setUserAns(user_ans) {
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		//ISSPECIALMODULEUSERXMLCHANGE = 1; ## fixed in onUserAnsChange;
		var cond = flagxml
		? 'lists=' + JSON.stringify(special_module.var_list)
		: ' ';

		//jQuery("#special_module_user_xml").val("<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>");
		//AH.select("#special_module_user_xml").value = "<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>"; ## fixed in onUserAnsChange;
		resultNew.special = "<smans><div " + cond + " currStep='" + steps + "' userAns='" + JSON.stringify(user_ans) + "'></div></smans>";
	}

	function overAll() {
		let over = false;
		let userAnswers = null;
		let inNativeIsCorrect = false;

		if (step_xml.smxml.step.length == state.itemArray.length) {
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

					resultNew.answer = false;
					inNativeIsCorrect = false;
				} else {
					//jQuery("#answer").prop("checked", true);
					AH.select("#answer").checked = true;

					resultNew.answer = true;
					inNativeIsCorrect = true;
				}
			}
		}

		//userAnswers = jQuery('#special_module_user_xml').val();
		//userAnswers = document.querySelector("#special_module_user_xml").value;
		userAnswers = resultNew.special;

		if (window.inNative) {
			window.postMessage('height___' + document.getElementsByClassName('inNativeStyle')[0].offsetHeight, '*');
			window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect }), '*');
		}

		onUserAnsChange({
			uXml: resultNew.special,
			ans: resultNew.answer
		});
	}

	function addSticky() {
		//jQuery('[data-sticky]').addClass('sticky');
		AH.select('[data-sticky]', 'addClass', 'sticky');
	}

	function createTextbox(data, i, user_xml, index, org_cdata) {
		let original_data = data;
		data = data.replace(/%{|}%/g, "");
		data = data.split("|");
		let codetype = data[1] && data[1].trim() == "n" ? "1" : "";
		let corr_ans = data[0].trim();
		let csStyle = "";

		if (corr_ans.indexOf("#style#") != -1) {
			let customStyle = corr_ans.split("#style#");
			corr_ans = customStyle[0];
			csStyle = customStyle[1];
		}

		txtWidth = [];
		let anslen = corr_ans.split(",");

		// jQuery(anslen).each(function(j){
		// 	txtWidth[j] = ((anslen[j].length)*10+30)
		// });
		anslen.forEach(function (data, j) {
			txtWidth[j] = anslen[j].length * 8 * anslen.length;
		});

		if (index != undefined) {
			textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i, index, org_cdata);
		} else {
			textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i);
		}
	}

	function textBox(
		data,
	txtWidth,
	csStyle,
	original_data,
	user_xml,
	corr_ans,
	i,
	index,
	org_cdata
	) {
		if (index != undefined) {
			element_id = "s" + index + "_t" + i;
			element_div = "s" + index;
			let textbox = '<input type="text" id="' + element_id + '" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:' + (Math.max(...txtWidth) + 20) + 'px;' + csStyle + '" />';
			let tag = '<span id="' + element_div + '" class="text-center filter fillelement position-relative inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="text" class="corr_div" style="width:' + (Math.max(...txtWidth) + 20) + 'px;' + csStyle + '" >' + data[0] + '</span>' + textbox + '</span>';
			let cd_ans = org_cdata.replace(original_data, tag);
			$$invalidate(3, answer_array[index].__cdata = cd_ans, answer_array);
		} else {
			if (user_xml <= oldstep) {
				var steps_counter = user_xml;
			} else {
				var steps_counter = steps;
			}

			element_id = "s" + steps_counter + "_t" + i;
			element_div = "s" + steps_counter;
			let textbox = '<input type="text" id="' + element_id + '" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none"  style="width:38px;' + csStyle + '" />';
			let tag = '<span id="' + element_div + '" class="text-center filter fillelement position-relative inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="" class="corr_div h-imp">' + data[0] + '</span>' + textbox + '</span>';
			cdata = cdata.replace(original_data, tag);
			smans = createAns(smans, element_id, element_div, corr_ans);
			$$invalidate(4, special_module.smans = smans, special_module);
		}
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
		AH.selectAll('.edit_step').forEach(_element => {
			if (!_element.classList.contains('answer_input')) {
				_element.style.border = '2px solid #ff0000';

				var timer = setTimeout(
					function () {
						_element.style.border = '1px solid #ccc';
						clearTimeout(timer);
					},
					500
				);
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
				if (usans["s" + curr] && usans["s" + curr][prop] != undefined) {
					if (smans["s" + curr][prop].value == usans["s" + curr][prop].value) {
						inputHover('correct', prop);
					} else if ((/\,/g).test(smans["s" + curr][prop].value)) {
						let s_ans = smans["s" + curr][prop].value.split(",");
						let u_ans = usans["s" + curr][prop].value;

						if (s_ans.indexOf(u_ans) > -1) {
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
			} //} catch(e) {
			//	console.warn(e);
		} //}

		if (step_xml.smxml.step[steps]._mode == 1) {
			showAnsMod(j, "s" + j);
		} else {
			showAns(j, "s" + j);
		}
	}

	function inputHover(option, elem) {
		if (step_xml.smxml.step[steps]._mode != 1) {
			if (option == 'correct') {
				//jQuery('#'+elem).removeClass('false-hover');
				AH.select('#' + elem, 'removeClass', 'false-hover');

				//jQuery('#'+elem).addClass('true-hover');
				AH.select('#' + elem, 'addClass', 'true-hover');
			} else if (option == 'wrong') {
				//jQuery('#'+elem).removeClass('true-hover');
				AH.select('#' + elem, 'removeClass', 'true-hover');

				//jQuery('#'+elem).addClass('false-hover');
				AH.select('#' + elem, 'addClass', 'false-hover');
			}

			if (optionrem > 1) {
				let len = Math.max(...txtWidth);

				if (len < 45) {
					len = '45px';
				}

				//jQuery('#'+elem).prev().removeClass('h-imp');
				AH.select(AH.select('#' + elem).previousElementSibling, 'css', { width: len + 'px' });

				AH.select(AH.select('#' + elem).previousElementSibling.nextSibling, 'css', { width: len + 'px' });
				AH.select(AH.select('#' + elem).previousElementSibling, 'removeClass', 'h-imp');
			}

			if (step_xml.smxml._fixed != 1) {
				var timer = setTimeout(
					function () {
						//jQuery('#'+elem).prev().addClass('h-imp');
						AH.select(AH.select('#' + elem).previousElementSibling.nextSibling, 'css', { width: globWith });

						AH.select(AH.select('#' + elem).previousElementSibling, 'addClass', 'h-imp');
						clearTimeout(timer);
					},
					2000
				);
			}
		}

		if (uxml) {
			//jQuery('.edit_step').each(function(i, obj) {
			AH.selectAll('.edit_step').forEach(function (obj, i) {
				//if (jQuery(this).hasClass('mathquill')) {
				if (obj.classList.contains('mathquill')) {
					//jQuery('#'+elem).prevAll('.disable_div').removeClass('h');	
					if (AH.select('#' + elem).previousElementSibling.classList.contains("disable_div")) {
						AH.select(AH.select('#' + elem).previousElementSibling, 'removeClass', 'h');
					}
				} else if (obj.classList.contains('answer_input')) {
					//jQuery(this).prop('disabled', 'disabled');
					obj.disabled = true; //} else if(jQuery(this).hasClass('answer_input')) {
				}

				//jQuery(this).addClass('data-check');
				obj.classList.add('data-check');
			});
		}
	}

	function showAns(j, outer) {
		var overall = 0;

		if (wrong_choice > 0) {
			$$invalidate(6, state.classChange = state.itemArray.length - 1, state);
			$$invalidate(6, state.isColor = false, state);
			overall = 0;

			if (j <= oldstep) {
				smans[outer].overall = overall;
			} else {
				//smans[element_div].overall = overall;
				smans[outer].overall = overall;

				overAll();
			}
		} else {
			$$invalidate(6, state.classChange = state.itemArray.length - 1, state);
			$$invalidate(6, state.isColor = true, state);
			overall = 1;

			if (j <= oldstep) {
				smans[outer].overall = overall;
			} else {
				//smans[element_div].overall = overall; this line break for after review mode
				smans[outer].overall = overall;

				nextStep();
			}
		}

		if (optionrem > 1) {
			nextStep();
		}

		if (usans[element_div] && usans[element_id] != undefined) {
			usans[element_div].optry = optionrem;
		}

		var timer = setTimeout(
			function () {
				$$invalidate(6, state.classChange = -1, state);
				clearTimeout(timer);
			},
			2500
		);
	}

	function showAnsMod(j, outer) {
		var overall = 0;

		if (wrong_choice > 0) {
			overall = 0;

			if (j <= oldstep) {
				smans[outer].overall = overall;
			} else {
				smans[element_div].overall = overall;
			}
		} else {
			overall = 1;

			if (j <= oldstep) {
				smans[outer].overall = overall;
			} else {
				smans[element_div].overall = overall;
			}
		}

		nextStep();
	}

	function setReview() {
		$$invalidate(0, isReview = true);
		overAll();
		yourAnswer();

		//jQuery('.fillintheblank').prop("disabled", true);
		document.querySelectorAll('.fillintheblank').disabled = true;
	}

	function unsetReview() {
		$$invalidate(0, isReview = false);
		$$invalidate(6, state.display = -1, state);
		$$invalidate(6, state.smController = ' h', state);

		//jQuery('.fillintheblank').removeClass('default-hover');
		AH.selectAll('.fillintheblank', 'removeClass', 'default-hover');

		//jQuery('.fillintheblank').prop("disabled", false);
		AH.selectAll('.fillintheblank').disabled = false;

		$$invalidate(6, state.main_steps = false, state);
		$$invalidate(6, state.correct_answer = true, state);

		//jQuery('.remed_disable').css('display', 'none');
		AH.selectAll('.remed_disable', 'css', { display: 'none' });

		if (step_xml.smxml.step[steps + 1] == undefined && step_xml.smxml.step[steps]._attempt == "1" || step_xml.smxml.step[steps + 1] == undefined && step_xml.smxml.step[steps]._viewonly == "1") {
			if (AH.selectAll('.edit_step').length == AH.selectAll('.data-check').length) {
				$$invalidate(6, state.hideNext = true, state);
			} else {
				$$invalidate(6, state.hideNext = false, state);
			}
		} else {
			$$invalidate(6, state.hideNext = false, state);
		}

		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
	}

	function correctAnswer() {
		$$invalidate(6, state.display = -1, state);
		AH.selectAll('.fillintheblank', 'addClass', 'default-hover');

		/// Manage correct answer position ////
		//AH.selectAll('.edit_step', 'hide');
		// setTimeout(function(){
		// 	AI.selectAll('.corr_div_correct').forEach((_this)=>{
		// 		_this.style.position = "absolute";
		// 	})
		// },100);
		// AH.selectAll('#text','removeClass','corr_div');
		// AH.selectAll('#text','addClass','corr_div_correct');
		showCorrect();

		$$invalidate(6, state.main_steps = true, state);
		$$invalidate(6, state.correct_answer = false, state);

		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
	}

	function showCorrect() {
		let show_ans = step_xml.smxml.step;

		show_ans.map(function (item, index) {
			let cdata_ans = item.__cdata;
			let org_cdata = cdata_ans;
			creatingInteractive('corr_ans', org_cdata, index);
		});
	}

	function yourAnswer() {
		$$invalidate(6, state.display = 1, state);
		$$invalidate(6, state.hideNext = true, state);
		$$invalidate(6, state.smController = '', state);

		// setTimeout(function(){
		// 	AI.selectAll('.corr_div_correct').forEach((_this)=>{
		// 		_this.style.position = "relative";
		// 	})
		// },100)
		// AI.selectAll('.your .edit_step').forEach((_this)=>{
		// 	_this.style.display = 'block';
		// })
		//AI.remove('.correct .edit_step');
		// if(new_xml.smxml._fixed === '1') {
		// 	AH.selectAll('.your .corr_div').forEach((_this)=>{
		// 		_this.style.position = "relative!important"
		// 	})
		// }
		//$('.fillintheblank').removeClass('default-hover');
		AH.selectAll(".fillintheblank", "removeClass", "default-hover");

		// AH.selectAll('#text','addClass','corr_div');
		// AH.selectAll('#text','removeClass','corr_div_correct');
		$$invalidate(6, state.main_steps = false, state);

		$$invalidate(6, state.correct_answer = true, state);

		// if(step_xml.smxml._fixed) {
		// 	AI.selectAll('.edit_step ','css',{display:'none'})
		// }
		//jQuery('.remed_disable').css('display', 'block');
		AH.selectAll('.remed_disable', 'css', { display: 'block' });

		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
	}

	function parseSteps(steps) {
		let user_step = XMLToJSON(steps);

		if (flagxml) {
			lists = JSON.parse(user_step.smans.div._lists);
		}

		oldstep = JSON.parse(user_step.smans.div._currStep);
	}

	function nextbtnAnswer() {
		let current = `s${steps}`;

		//let textboxes = jQuery('#'+current).find('.edit_step');
		let textboxes = AH.find('#' + current, '.edit_step', 'all');

		textboxes.forEach(function (item, index) {
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
			checkAns(steps);
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
		data = data.replace(/%{|}%/g, "");
		data = data.split("|");
		data[0] = data[0].replace(/user Response/g, '\\MathQuillMathField');

		// let split_data = addMathquill.split("##");
		let split_data = data[0].split("##");

		let random_key = Math.floor(Math.random() * split_data.length);
		let random_option = split_data[random_key];
		let userans = random_option.replace(/MathQuillMathField{(.*?)}/g, 'MathQuillMathField{}');
		let defaultans = 0;
		let anskey = random_option;
		let answer_element = anskey.replace(/\\MathQuillMathField/g, '');

		if (random_option.indexOf("\MathQuillMathField") > -1) {
			anskey = random_option;
			defaultans = 1;
		}

		if (index != undefined) {
			mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element, index, org_cdata);
		} else {
			mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element);
		}
	}

	function mathQuill(
		userans,
	data,
	original_data,
	user_xml,
	i,
	random_key,
	defaultans,
	anskey,
	answer_element,
	index,
	org_cdata
	) {
		let corr_ans = data[0].trim();

		if (user_xml <= oldstep) {
			var steps_counter = user_xml;
		} else {
			var steps_counter = steps;
		}

		if (index != undefined) {
			element_id = "s0" + index + "_t" + i;
			element_div = "s0" + index;
			let ans_id = "m0" + index + "_t" + i;
			let matheq = '<span  id="' + element_id + '" class="auto_height auto_width  edit_step fillmathelement h-100 mathquill mq' + steps_counter + '" userAnsSeq="' + random_key + '" userans="' + userans + '" anskey="' + anskey + '" defaultans="' + defaultans + '" mathtype="1">' + 's' + '</span>';
			let tag = '<span id="' + element_div + '" class="text-center filter fillelement position-relative inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="' + ans_id + '" class="corr_div fillmathelement position-absolute h-100 mathquill mq' + steps_counter + '" userAnsSeq="' + random_key + '" anskey="' + anskey + '" defaultans="' + defaultans + '" mathtype="1">' + answer_element + '</span>' + matheq + '</span>';
			let cd_ans = org_cdata.replace(original_data, tag);
			$$invalidate(3, answer_array[index].__cdata = cd_ans, answer_array);
		} else {
			element_id = "s" + steps_counter + "_t" + i;
			element_div = "s" + steps_counter;
			let ans_id = "m" + steps_counter + "_t" + i;
			let matheq = '<span  id="' + element_id + '" class="auto_height auto_width edit_step fillmathelement h-100 mathquill mq' + steps_counter + '" userAnsSeq="' + random_key + '" userans="' + userans + '" anskey="' + anskey + '" defaultans="' + defaultans + '" mathtype="1">' + 's' + '</span>';
			let tag = '<span id="' + element_div + '" class="text-center filter fillelement position-relative inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="' + ans_id + '" class="corr_div  h-imp fillmathelement h-100 mathquill mq' + steps_counter + '" userAnsSeq="' + random_key + '" anskey="' + anskey + '" defaultans="' + defaultans + '" mathtype="1">' + answer_element + '</span>' + matheq + '</span>';
			cdata = cdata.replace(original_data, tag);
			smans = createAns(smans, element_id, element_div, corr_ans);
			$$invalidate(4, special_module.smans = smans, special_module);
		}

		let time_interval = setInterval(
			(function () {
				if (typeof MathQuill == "function" && window.jQuery) {
					clearInterval(time_interval);

					if (!MQ) {
						MQ = MathQuill.getInterface(2);
					}

					//jQuery(".mathquill.mq"+steps_counter).each(function() {
					AH.selectAll(".mathquill.mq" + steps_counter).forEach(_this => {
						//let math_itemid  = jQuery(this).attr('id');
						let math_itemid = _this.getAttribute('id');

						//let defaultans = jQuery(this).attr('defaultans');
						let defaultans = _this.getAttribute('defaultans');

						if (defaultans == 1) {
							//let latex = jQuery(this).attr('userans');
							let latex = _this.getAttribute('userans');

							//jQuery('#'+math_itemid).text(latex);
							if (latex != null) AH.select('#' + math_itemid).innerText = latex;
						} else {
							//jQuery('#'+math_itemid).text(jQuery(this).attr('userans'));
							AH.select('#' + math_itemid).innerText = _this.getAttribute("userans");
						}

						try {
							$$invalidate(2, fill_math[math_itemid] = MQ.StaticMath(document.getElementById(math_itemid)), fill_math);
						} catch(e) {
							console.log(e);
						}
					});
				}
			}).bind(this),
			100
		);
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
			
			let math_item = MQ.StaticMath(document.getElementById(math_itemid));

			for (let i = 0; i <= math_item.innerFields.length - 1; i++) {
				innerfield[i] = math_item.innerFields[i].latex();
			}

			let new_math_field = original_latex;

			// let mathfield = original_latex.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);
			let mathfield = original_latex.match(/\\MathQuillMathField{(.*?)\}/g);

			for (let i in mathfield) {
				const create_mathfield = '\\MathQuillMathField{' + innerfield[i] + '}';

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

	afterUpdate(() => {
		AH.selectAll(`[data-mce-bogus="all"]`, 'remove', 'remove');
	});

	const writable_props = ['xml', 'stopPreviewUpdate', 'isReview', 'uxml'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<StepAlgoPreview> was created with unknown prop '${key}'`);
	});

	function fillintheblankstoolbar_display_binding(value) {
		if ($$self.$$.not_equal(state.showToolbar, value)) {
			state.showToolbar = value;
			$$invalidate(6, state);
		}
	}

	const click_handler = () => setTimeout(
		function () {
			moveNext();
		},
		100
	);

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(13, xml = $$props.xml);
		if ('stopPreviewUpdate' in $$props) $$invalidate(14, stopPreviewUpdate = $$props.stopPreviewUpdate);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(15, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		writable,
		ALGO,
		l,
		onMount,
		afterUpdate,
		beforeUpdate,
		AH,
		XMLToJSON,
		JSONToXML,
		onUserAnsChange,
		FillInTheBlanksToolbar,
		ItemHelper,
		step_xml,
		smans,
		usans,
		element_id,
		element_div,
		cdata,
		fill_math,
		answer_array,
		btntype,
		resultNew,
		var_list,
		special_module,
		lists,
		oldstep,
		answer_arr,
		fillId,
		steps,
		wrong_choice,
		optionrem,
		flagxml,
		state,
		txtWidth,
		globWith,
		new_xml,
		xml,
		stopPreviewUpdate,
		isReview,
		uxml,
		MQ,
		customIsReview,
		stateData,
		unsubscribe,
		timer,
		timer_next,
		setOutline,
		inputFilled,
		loadModule,
		parseUserAns,
		createStep,
		reset,
		parseXmlAuthoring,
		creatingInteractive,
		getClass,
		getCorrect,
		isSticky,
		toggleToolbar,
		moveNext,
		nextStep,
		setUserAns,
		overAll,
		addSticky,
		createTextbox,
		textBox,
		createAns,
		notFilled,
		checkAns,
		inputHover,
		showAns,
		showAnsMod,
		setReview,
		unsetReview,
		correctAnswer,
		showCorrect,
		yourAnswer,
		parseSteps,
		nextbtnAnswer,
		handleReview,
		createMathDiv,
		mathQuill,
		mathquillAns
	});

	$$self.$inject_state = $$props => {
		if ('step_xml' in $$props) step_xml = $$props.step_xml;
		if ('smans' in $$props) smans = $$props.smans;
		if ('usans' in $$props) usans = $$props.usans;
		if ('element_id' in $$props) element_id = $$props.element_id;
		if ('element_div' in $$props) element_div = $$props.element_div;
		if ('cdata' in $$props) cdata = $$props.cdata;
		if ('fill_math' in $$props) $$invalidate(2, fill_math = $$props.fill_math);
		if ('answer_array' in $$props) $$invalidate(3, answer_array = $$props.answer_array);
		if ('btntype' in $$props) btntype = $$props.btntype;
		if ('resultNew' in $$props) resultNew = $$props.resultNew;
		if ('var_list' in $$props) var_list = $$props.var_list;
		if ('special_module' in $$props) $$invalidate(4, special_module = $$props.special_module);
		if ('lists' in $$props) lists = $$props.lists;
		if ('oldstep' in $$props) oldstep = $$props.oldstep;
		if ('answer_arr' in $$props) answer_arr = $$props.answer_arr;
		if ('fillId' in $$props) $$invalidate(5, fillId = $$props.fillId);
		if ('steps' in $$props) steps = $$props.steps;
		if ('wrong_choice' in $$props) wrong_choice = $$props.wrong_choice;
		if ('optionrem' in $$props) optionrem = $$props.optionrem;
		if ('flagxml' in $$props) flagxml = $$props.flagxml;
		if ('state' in $$props) $$invalidate(6, state = $$props.state);
		if ('txtWidth' in $$props) txtWidth = $$props.txtWidth;
		if ('globWith' in $$props) globWith = $$props.globWith;
		if ('new_xml' in $$props) new_xml = $$props.new_xml;
		if ('xml' in $$props) $$invalidate(13, xml = $$props.xml);
		if ('stopPreviewUpdate' in $$props) $$invalidate(14, stopPreviewUpdate = $$props.stopPreviewUpdate);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(15, uxml = $$props.uxml);
		if ('MQ' in $$props) MQ = $$props.MQ;
		if ('customIsReview' in $$props) $$invalidate(1, customIsReview = $$props.customIsReview);
		if ('stateData' in $$props) stateData = $$props.stateData;
		if ('timer' in $$props) $$invalidate(40, timer = $$props.timer);
		if ('timer_next' in $$props) $$invalidate(41, timer_next = $$props.timer_next);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*customIsReview, isReview*/ 3) {
			 {
				if (customIsReview != isReview) {
					if (isReview) {
						var timer = setTimeout(
							function () {
								setReview();
								clearTimeout(timer);
							},
							500
						);
					} else {
						var timer_next = setTimeout(
							function () {
								unsetReview();
								clearTimeout(timer_next);
							},
							200
						);
					}

					$$invalidate(1, customIsReview = isReview);
				}
			}
		}
	};

	return [
		isReview,
		customIsReview,
		fill_math,
		answer_array,
		special_module,
		fillId,
		state,
		isSticky,
		toggleToolbar,
		moveNext,
		setReview,
		unsetReview,
		handleReview,
		xml,
		stopPreviewUpdate,
		uxml,
		fillintheblankstoolbar_display_binding,
		click_handler
	];
}

class StepAlgoPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 13,
				stopPreviewUpdate: 14,
				isReview: 0,
				uxml: 15
			},
			add_css,
			[-1, -1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "StepAlgoPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[13] === undefined && !('xml' in props)) {
			console_1.warn("<StepAlgoPreview> was created without expected prop 'xml'");
		}

		if (/*stopPreviewUpdate*/ ctx[14] === undefined && !('stopPreviewUpdate' in props)) {
			console_1.warn("<StepAlgoPreview> was created without expected prop 'stopPreviewUpdate'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<StepAlgoPreview> was created without expected prop 'isReview'");
		}

		if (/*uxml*/ ctx[15] === undefined && !('uxml' in props)) {
			console_1.warn("<StepAlgoPreview> was created without expected prop 'uxml'");
		}
	}

	get xml() {
		throw new Error("<StepAlgoPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<StepAlgoPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get stopPreviewUpdate() {
		throw new Error("<StepAlgoPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stopPreviewUpdate(value) {
		throw new Error("<StepAlgoPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<StepAlgoPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<StepAlgoPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<StepAlgoPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<StepAlgoPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMMixedItem\ItemPluginPreview.svelte generated by Svelte v3.40.2 */
const file$1 = "clsSMMixedItem\\ItemPluginPreview.svelte";

// (17:4) {#if editorState?.content_icon == 2 ||  content_icon == 2}
function create_if_block$1(ctx) {
	let stepalgopreview;
	let current;

	stepalgopreview = new StepAlgoPreview({
			props: {
				xml: /*xml*/ ctx[0],
				remedStatus: /*remedStatus*/ ctx[1],
				showAns: /*showAns*/ ctx[2],
				stopPreviewUpdate: /*stopPreviewUpdate*/ ctx[3],
				isReview: /*isReview*/ ctx[6],
				uxml: /*uxml*/ ctx[7]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(stepalgopreview.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(stepalgopreview, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const stepalgopreview_changes = {};
			if (dirty & /*xml*/ 1) stepalgopreview_changes.xml = /*xml*/ ctx[0];
			if (dirty & /*remedStatus*/ 2) stepalgopreview_changes.remedStatus = /*remedStatus*/ ctx[1];
			if (dirty & /*showAns*/ 4) stepalgopreview_changes.showAns = /*showAns*/ ctx[2];
			if (dirty & /*stopPreviewUpdate*/ 8) stepalgopreview_changes.stopPreviewUpdate = /*stopPreviewUpdate*/ ctx[3];
			if (dirty & /*isReview*/ 64) stepalgopreview_changes.isReview = /*isReview*/ ctx[6];
			if (dirty & /*uxml*/ 128) stepalgopreview_changes.uxml = /*uxml*/ ctx[7];
			stepalgopreview.$set(stepalgopreview_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(stepalgopreview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(stepalgopreview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(stepalgopreview, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(17:4) {#if editorState?.content_icon == 2 ||  content_icon == 2}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let main;
	let current;
	let if_block = (/*editorState*/ ctx[4]?.content_icon == 2 || /*content_icon*/ ctx[5] == 2) && create_if_block$1(ctx);

	const block = {
		c: function create() {
			main = element("main");
			if (if_block) if_block.c();
			add_location(main, file$1, 15, 0, 322);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			if (if_block) if_block.m(main, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*editorState*/ ctx[4]?.content_icon == 2 || /*content_icon*/ ctx[5] == 2) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*editorState, content_icon*/ 48) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(main, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ItemPluginPreview', slots, []);
	let { xml } = $$props;
	let { remedStatus } = $$props;
	let { showAns } = $$props;
	let { stopPreviewUpdate } = $$props;
	let { editorState } = $$props;
	let { content_icon } = $$props;
	let { isReview } = $$props;
	let { uxml } = $$props;

	const writable_props = [
		'xml',
		'remedStatus',
		'showAns',
		'stopPreviewUpdate',
		'editorState',
		'content_icon',
		'isReview',
		'uxml'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemPluginPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(0, xml = $$props.xml);
		if ('remedStatus' in $$props) $$invalidate(1, remedStatus = $$props.remedStatus);
		if ('showAns' in $$props) $$invalidate(2, showAns = $$props.showAns);
		if ('stopPreviewUpdate' in $$props) $$invalidate(3, stopPreviewUpdate = $$props.stopPreviewUpdate);
		if ('editorState' in $$props) $$invalidate(4, editorState = $$props.editorState);
		if ('content_icon' in $$props) $$invalidate(5, content_icon = $$props.content_icon);
		if ('isReview' in $$props) $$invalidate(6, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(7, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		StepAlgoPreview,
		xml,
		remedStatus,
		showAns,
		stopPreviewUpdate,
		editorState,
		content_icon,
		isReview,
		uxml
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(0, xml = $$props.xml);
		if ('remedStatus' in $$props) $$invalidate(1, remedStatus = $$props.remedStatus);
		if ('showAns' in $$props) $$invalidate(2, showAns = $$props.showAns);
		if ('stopPreviewUpdate' in $$props) $$invalidate(3, stopPreviewUpdate = $$props.stopPreviewUpdate);
		if ('editorState' in $$props) $$invalidate(4, editorState = $$props.editorState);
		if ('content_icon' in $$props) $$invalidate(5, content_icon = $$props.content_icon);
		if ('isReview' in $$props) $$invalidate(6, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(7, uxml = $$props.uxml);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		xml,
		remedStatus,
		showAns,
		stopPreviewUpdate,
		editorState,
		content_icon,
		isReview,
		uxml
	];
}

class ItemPluginPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			xml: 0,
			remedStatus: 1,
			showAns: 2,
			stopPreviewUpdate: 3,
			editorState: 4,
			content_icon: 5,
			isReview: 6,
			uxml: 7
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ItemPluginPreview",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[0] === undefined && !('xml' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'xml'");
		}

		if (/*remedStatus*/ ctx[1] === undefined && !('remedStatus' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'remedStatus'");
		}

		if (/*showAns*/ ctx[2] === undefined && !('showAns' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'showAns'");
		}

		if (/*stopPreviewUpdate*/ ctx[3] === undefined && !('stopPreviewUpdate' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'stopPreviewUpdate'");
		}

		if (/*editorState*/ ctx[4] === undefined && !('editorState' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'editorState'");
		}

		if (/*content_icon*/ ctx[5] === undefined && !('content_icon' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'content_icon'");
		}

		if (/*isReview*/ ctx[6] === undefined && !('isReview' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'isReview'");
		}

		if (/*uxml*/ ctx[7] === undefined && !('uxml' in props)) {
			console.warn("<ItemPluginPreview> was created without expected prop 'uxml'");
		}
	}

	get xml() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get remedStatus() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set remedStatus(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get stopPreviewUpdate() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stopPreviewUpdate(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get content_icon() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set content_icon(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<ItemPluginPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<ItemPluginPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ItemPluginPreview;
//# sourceMappingURL=ItemPluginPreview-57250d87.js.map
