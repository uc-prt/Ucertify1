
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, T as Draggable, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, a4 as jquery, A as AH, L as beforeUpdate, X as XMLToJSON, w as writable, j as attr_dev, k as add_location, n as insert_dev, B as noop, x as detach_dev, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component, f as space, l as set_style, r as group_outros, u as check_outros, P as binding_callbacks, h as text } from './main-0211720b.js';
import { I as ItemHelper } from './ItemHelper-179e801c.js';
import { F as FillInTheBlanksToolbar } from './FillInTheBlanksToolbar-36bfcda7.js';

const JS = new JUI();
class fillJS {
	constructor(options) {
		//super();
		this.userAnsXML = "";
		this.sInfo = true;
		this.labBinded = true;
		this.delPreSpaces = {};
		this.init();
	}
	init() {
		this.delPreSpaces = {
			loopGaurd : 0,
			withLines : ( fillid )=> {
				if (this.delPreSpaces.loopGaurd > 0) { 
					if (typeof activate == "function") activate(1);
					JS.selectAll(fillid, 'hide');
				}
				var ln = JS.selectAll('.linenums li').length, li_arr = [];
	
				if (ln == 0 && this.delPreSpaces.loopGaurd <= 4) {
					this.delPreSpaces.loopGaurd ++;
					setTimeout(()=> {this.delPreSpaces.withLines(fillid);}, 1000);
					return false;
				} else {
					this.showFillModule( fillid );
				}
	
				JS.selectAll('.linenums li').forEach((_this, i)=> {
					if (JS.find(_this, 'span').innerHTML == "&nbsp;" || JS.find(_this, 'span').innerHTML == "") {
						_this.remove();
					} else {
						li_arr.push(_this);
					}
				});
	
				li_arr.forEach((val, i)=> {
					if (val.children.classList.contains('fillelement') || val.children.classList.contains('dropable')) {
						let ht;
						val.children.forEach((_this)=> {
							(_this.innerHTML == "") ? _this.remove() : ht = _this;
						});
						JS.prevElm(val).append(ht);
						JS.insert(JS.prevElm(val), JS.nextElm(val).innerHTML, 'beforeend');
						JS.nextElm(val).remove();
						val.remove();
					}
				});	
			},
			withoutLines : (fillid)=> {
				//var _this = this;
				var fill_pre = JS.find(fillid, '.fillelement,.dropable', 'all');
				fill_pre.forEach((_this)=> {
					var pre_prv  = JS.prevElm(_this).innerHTML.trim();
					var pre_nxt  = JS.nextElm(_this).innerHTML.trim();
					if ( delPreSpaces.loopGaurd > 0 ) { 
						if (typeof activate == "function") activate(1);
						JS.selectAll(fillid, 'hide');
					}
	
					var ln  = JS.find(fillid, '.kwd', 'all').length;
		
					if ( ln == 0 && delPreSpaces.loopGaurd <= 4 ) {
						delPreSpaces.loopGaurd ++;
						setTimeout(()=> { delPreSpaces.withoutLines(fillid); }, 1000);
						return false;
					} else {
						this.showFillModule( fillid );
					}
					
					if ( pre_prv == "") {
						JS.prevElm(_this).remove();
					} else {
						JS.prevElm(_this).innerHTML = pre_prv;
					}
		
					if ( pre_nxt == "" ) {
						JS.nextElm(_this).remove();
					} else {
						JS.nextElm(_this).innerHTML = pre_nxt;
					}
				});
	
			},
	
			showFillModule : (fillid)=> {
				if (typeof activate == "function") activate(0);
				if (typeof quizPlayerStatic != "undefined") {
					if (typeof QuizPlayer != "undefined") {
						QuizPlayer.setNewHeight( quizPlayerStatic );
					}
				}
				JS.selectAll(fillid, 'show');
			}
		};
	}

	setUpdate(func) {
		this.updateModule = func;
	}

	readyFill(fillid) {
		let drag_id = "";
		let drop_target = "";
		JS.bind(fillid +' select', 'change',()=> {
			JS.trigger(fillid, 'click');
		});
		this.dragOptionFill = {
			appendTo: "body",
			zIndex:100,
			revert: (is_valid_drop)=> {
				if (!is_valid_drop) {
					if (this.sInfo) {
						this.sInfo = false;
						setTimeout(function() {
							this.sInfo = true;
						}, 60*1000);
						JS.showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 100);
					}
					/*if (!!$("#error")[0].play) {
						try{ $("#error")[0].currentTime = 0; }catch(err) {}
						$("#error")[0].play();
					}*/
					return true;
				}
			},
			helper: (e)=> {
				var target = e.target;
				try {
					if (target.classList.contains("dropable")) {
						target = JS.find(fillid, '#'+ e.target.getAttribute('droped'));
					}
					this.img = {
						"width": JS.select(target).clientWidth,
						"height": 'auto'
					};
					e.target.draggable("option", "cursorAt", {
						left: Math.floor(this.img.width / 2),
						top: -10,
					});
					var cl = e.target.cloneNode(true).css({
						width: this.img.width+"px",
						height: this.img.height+"px",
						"position":"absolute",
						"text-align":"center"
					});
					return cl;
				} catch(err) {
					console.warn("Helper:",err);
				}
			},
			onDragStart: (e)=> {
				e.target.dataset["drag_enable"] = true;
			},
			onDragEnter: (e)=> {
				e.target.classList.add("drop-hover");
			},
			onDragLeave: (e)=> {
				e.target.classList.remove('drop-hover');
			},
			onDrop: ( event, dragElm )=> {
				const _this = event.target;
				const drop_id = dragElm.getAttribute('droped') ? dragElm.getAttribute('droped') : dragElm.getAttribute('id');
				if (_this.getAttribute("droped").trim() != "") ;

				_this.innerHTML = dragElm.innerHTML;
				JS.select(_this, 'attr', {userans: drop_id, droped: drop_id, path: dragElm.getAttribute('path')});
				JS.select(_this, 'css', {backgroundColor: dragElm.style.backgroundColor});
				// .draggable($.extend(ucFill.dragOptionFill,{revert:false}))
				drop_target = _this.id;
				//ucFill.checkAns("#previewArea");
				this.checkAns(fillid);
				_this.classList.remove("drop-hover");
			},
			onDragEnd: (e, dragElm)=> {
				let _this = e.target;
				if (_this.classList.contains('dropable')) {
					if (_this.dataset["drag_enable"]) ;
					JS.select(_this, 'css',{ backgroundColor: _this.getAttribute('bgcolor')});
					_this.textContent = _this.getAttribute('caption');
					JS.selectAll(_this, 'attr', {droped: "", userans: ""});
				}
				drag_id = _this.id;
				if (_this.classList.contains('dropable')) {	
					const rel_id = JS.select('#' + drop_target).getAttribute('droped');
					if (rel_id && JS.select('#' + rel_id).getAttribute('drag-single') == 1) {
						this.dnd.disableDrag('#' + rel_id);
					}
				} else {
					if (drag_id && JS.select('#' + drag_id).getAttribute('drag-single') == 1 && drop_target != "") {
						this.dnd.disableDrag('#' + drag_id);
					}
				}
				this.checkAns(fillid);
				drop_target="";
			},
			scroll: 'true',
			refreshPositions: true,
			cursor: "default",
			//copy: true,
		};
		window.fillid = fillid;
		if (!this.dnd) {
			this.dnd = new Draggable(this.dragOptionFill);
		}
		// Set Drag area
		JS.find(fillid, '.dragable', 'all').forEach((elm)=> this.dnd.setDrag(elm));
		//$(fillid).find('.dragable').draggable();
		
		JS.find(fillid, '.dropable', 'all').forEach((_elm)=> {
			const pre_id = _elm.getAttribute('droped');
			if (pre_id && JS.select('#' + pre_id).getAttribute('drag-single') == 1) {
				this.dnd.disableDrag( JS.select('#'+ pre_id) );
			}
		});
		
		//$(fillid).find('.dragable').draggable(ucFill.dragOptionFill);
		
		JS.find(fillid, '[droped*=ID]', 'all').forEach((_this, i)=> {
			if (JS.find(fillid, '#'+ _this.getAttribute('droped')).getAttribute('multi_drag') == "0") {
				this.dnd.disableDrag(JS.find(fillid, '#'+_this.getAttribute('droped')));
			}
		});

		JS.find(fillid, '.dropable', 'all').forEach((elm)=> this.dnd.setDrop(elm));
		//$(fillid).find('.dropable');
	}

	bindKeyup(fillid) {
		//Add keyboard Support class
		JS.find(fillid, ".fillelement", 'all').forEach((_this)=> { JS.selectAll(Array.from(_this.children), 'addClass', "ks"); });
		JS.find(fillid, ".dragable", 'all').forEach((_this)=> { _this.classList.add("ks"); });
		JS.find(fillid, ".dropable", 'all').forEach((_this)=> { _this.classList.add("ks"); });

		JS.listen(document, "click", fillid, (_this, event)=> {
			if (!this.checkFocus("ks")) {
				JS.selectAll(JS.find(fillid, ".copiedclr", 'all'), 'removeClass', "copiedclr");
			}
		});

		// JS.bind(JS.find(fillid, "input"), "keypress", (e)=> {
		// 	if (e.which == 13) {
		// 		e.preventDefault();
		// 		return false;
		// 	}
		// });

		/*
		if (typeof hotkeys == 'function') {
			hotkeys.unbind('alt+down,enter,delete,esc','fillintheblank');
			hotkeys("alt+down,enter,delete,esc",'fillintheblank', (event, handler)=> {
				switch (handler.key) {
					case 'alt+down' :
						activateKs();
					break;
					case 'enter' :
						if ($("#sm_controller").css("display") == "none") {
							if (checkFocus("dragable")) {
								copyDraggable();
							} else if (checkFocus("dropable")) {
								pasteDraggable();
							}
						}
					break;
					case 'delete' :
						if ($("#sm_controller").css("display") == "none") {
							if (checkFocus("dropable")) {
								removeDraggable();
							}
						}
					break;
					case 'esc' :
						if ($("#sm_controller").css("display") == "none") {
							if (checkFocus("ks")) {
								$(fillid).find(".copiedclr").removeClass("copiedclr");
								count = 0;
								count_prev = 0;
								copied_id = "";
								ks_activated = false;
								$('.ks').last().focus();
								$('.ks').last().blur();
							}	
						}
					break;
				}
			});
			hotkeys.setScope('fillintheblank');
			hotkeys.filter = function(event) {
				return true;
			}
		}
		*/
	}

	checkFocus(list) {
		this.checkAns && this.checkAns(ajax_eId);
		var is_focus = false;
		JS.find(ajax_eId, "."+list, 'all').forEach((_this)=> {
			if (JS.isFocus(_this)) {
				is_focus = true;
				return false;
			}
		});
		return is_focus;
	}

	showdragans(fillid, ansType, review) {
		if (typeof review === "undefined") review = 0;
		JS.find(fillid, 'select,input,textarea,.dropable,span.edit_step', 'all').forEach((_this)=> {
			this.showchilddragans(fillid, _this, ansType, review);
		});
	}
	
	showchilddragans(fillid, pElem, ansType, review) { 
		let is_correct = -2;
		if (pElem.classList.contains('dropable')) {
			pElem.innerHTML = pElem.getAttribute('caption').replace(/\#doublequote#/gmi,'"');
			JS.setCss(pElem, {"background-color": pElem.getAttribute("bgcolor")} );
			if (ansType == 'c') {
				var ansKey = pElem.getAttribute('anskey').split(',');
				ansKey.forEach((value, index)=> {
					if (value.trim() != "") {
						const $anskey = JS.find(fillid, '#'+value);
						if ($anskey) {
							pElem.innerHTML = $anskey.getAttribute('caption').replace(/\#doublequote#/gmi,'"');
							JS.setCss(pElem, {backgroundColor: $anskey.getAttribute("bgcolor")});
						}
						return false;
					}
				});
			} else if (ansType == 'u') {
				is_correct = -1;
				if (pElem.getAttribute('userans').trim() != "") {
					this.userans = JS.find(fillid, '#'+ pElem.getAttribute('userans'));
					if (this.userans) {
						pElem.innerHTML = this.userans.getAttribute('caption').replace(/\#doublequote#/gmi,'"');
						JS.setCss(pElem, {backgroundColor: this.userans.getAttribute("bgcolor")});
					}
				}
				const cans = pElem.getAttribute('anskey');
				const uans = pElem.getAttribute('userans');
				if (uans != "" && cans.indexOf(uans) > -1) { is_correct = 1; } 
			}
		}

		if (pElem.classList.contains('edit_step')) {
			if (review == 1) {
				if (ansType=='c') {
					JS.selectAll('.edit_step', 'css', {
						'border' : 'none',
						'display' : 'none',
					});
				} else if (ansType=='u') {
					JS.selectAll('.edit_step', 'css', {
						'cursor' : 'none',
						'display': 'block',
					});

					is_correct = this.fillTestText(fillid, pElem);
				}
			}
		}

		if (pElem.parentElement.classList.contains('fillelement')) {
			if (pElem.nodeName == "SELECT") {
				is_correct = -1;
				this.totalcorrect = JS.find(pElem, "[correctans='1']", 'all').length;
				this.a = 0;
				
				JS.find(pElem, "option", 'all').forEach((_this, i)=> {
					_this.removeAttribute("selected");
					if (ansType=='c') {
						if (_this.getAttribute("correctans") > 0) _this.setAttribute("selected", true);
					} else if (ansType=='u') {
						if (_this.getAttribute("userans") > 0) _this.setAttribute("selected", true);
						if (_this.selected && _this.getAttribute('correctans') == 1) { this.a++; }
					}
				});
				if (this.totalcorrect == this.a) is_correct = 1;
				//console.log(JS.find(pElem, 'option', {action: 'selected'}))
				//if ($(pElem).find(':selected').length < 1) $(pElem).find("option:first").prop("selected","selected");
				//if (!pElem.selected) JS.find(pElem, "option", 'all')[0].setAttribute("selected", "selected");
			} else if (pElem.nodeName == "INPUT" || pElem.nodeName == "TEXTAREA") {
				if (typeof(pElem.type) == "undefined") {this.type = 'text';}
				if (ansType=='c') {  //correct answer
					var anskey = pElem.getAttribute("anskey").split(',');
					if (anskey.length > 1) {
						var tooltip = "<p style='text-align:left;'>All of the answers are correct!<br>";
						anskey.forEach((value, index)=> {
							tooltip += "(" + (index + 1) + ") " + value.replace(/#cm/g,',')  + "<br>";
						});
						JS.setAttr(pElem, {'rel': 'multiple_answers', 'title' : tooltip + '</p>' , 'data-html': 'true'});
						//$('[rel="multiple_answers"]').tooltip();
					}
					pElem.value = pElem.getAttribute("anskey").replace(/#cm/g,',');
				} else if (ansType=='u') {  //user answer
					pElem.removeAttribute(['rel', 'title', 'data-html']);
					//$('[rel=multiple_answers]').tooltip('dispose');
					if (pElem.getAttribute("userans") == "" && pElem.getAttribute("defaultAns") !== "") {
						pElem.value = pElem.getAttribute("defaultAns");
					} else {
						var __ans = pElem.getAttribute("userans");
						if (pElem.nodeName == "TEXTAREA") {
							__ans = __ans.replace(/#singlequote#/g, "'");
							__ans = __ans.replace(/#dblquote#/g, '"');
						}
						pElem.value = __ans;
					}
					is_correct = this.fillTestText(fillid, pElem);
				}
			}
		}
		if (ansType == 'u' && review==1) {
			if (is_correct != -2 && parseInt(JS.select(fillid).getAttribute("manual_grade")) != 1) {
				const correct_incorrect_mark = this.markUserAnswer(is_correct);
				if (pElem.classList.contains('dropable')) {
					JS.insert(pElem, correct_incorrect_mark, 'beforeend');
					pElem.setAttribute('as', is_correct);
				} else if (pElem.classList.contains('edit_step')) {
					if (is_correct == 1) {
						JS.selectAll("#"+ pElem.getAttribute('id'), 'css', { 'border': '2px solid green'});
					} else {
						JS.selectAll("#"+ pElem.getAttribute('id'),'css', {'border': '2px solid red'});
					}

					pElem.setAttribute('as', is_correct);
				} else {
					JS.insert(pElem.parentElement, correct_incorrect_mark, 'beforeend');
					pElem.parentElement.setAttribute('as', is_correct);
				}
			}
			pElem.setAttribute('title', is_correct == 1 ? 'is marked as Correct' : 'is marked as incorrect');
		} else {
			JS.find(fillid, '.correct_incorrect_icon_fill', {action:'remove'});
			pElem.setAttribute('title','');
		}
	}

	fillTestText(fillid, pElem) {
		var is_correct = -1, 
		anskey = pElem.getAttribute("anskey").trim(), 
		userans = pElem.value ? pElem.value.trim() : "",
		haskey = pElem.getAttribute('haskeywords'),
		hasnkey = pElem.getAttribute('hasnotkeywords'),
		codetype = pElem.getAttribute("codetype"),
		mathtype = pElem.getAttribute("mathtype");
		if (pElem.nodeName != "TEXTAREA") {
			//userans = pElem.value.trim();
			if (/\d,\d/.test(userans)) { // TRUE when comma is used any numerical value like 500,000
				userans = pElem.value.trim().replace(/,/g,"#cm");
			} 
			// @uc-abk added for one Custoumer Bug "answer,anotherAnswer" getting incorrect.
			let temp = userans.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g);
			if (userans.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g)) {
				temp = temp.toString().replace(/,/g, "#cm");
			}
			userans = userans.replace(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g, temp);
		}
		if (codetype == 1) {
			var regex_code = [/\s+/g,/\;$/,/"/g];
			var regex_replace = ["", "", "'"];
			for (let l=0; l < regex_code.length; l++) {
				userans = userans.replace(regex_code[l],regex_replace[l]);
				anskey = anskey.replace(regex_code[l],regex_replace[l]);
			}
		}

		if (mathtype == 1) {
			userans = pElem.getAttribute("userans").trim();
			//userans = userans;
		}
		
		if (JS.select(fillid).getAttribute('matchtype') == 1) {
			anskey = anskey.toLowerCase();
			userans = userans.toLowerCase();
		}

		if (JS.select(fillid).getAttribute('ignoretype') == 1) {
			if (JS.select(fillid).getAttribute('multi') != 0) {
				var ans = [];
				anskey.split(',').forEach((val, index)=> {
					ans.push(val.replace(/[^a-zA-Z0-9]/gi, ""));
				});
				anskey = ans.join(',');
			} else {
				anskey = anskey.replace(/[^a-zA-Z0-9]/gi, "");
			}
			userans = userans.replace(/[^a-zA-Z0-9]/gi, "");
		}

		if (pElem.getAttribute('keywordtype') == 1 && haskey.length > 0 && hasnkey.length > 0) {
			var valid = 0 ,valid_is = 0;
			haskey.split(',').forEach((val, index)=> {
				if (userans.indexOf(val) != -1) valid++;
			});
			hasnkey.split(',').forEach((val, index)=> {
				if (userans.indexOf(val) != -1) valid_is++;
			});
			if (haskey.split(',').length == valid && valid_is == 0) userans = anskey;
		}
		if (JS.select(fillid).getAttribute('multi') != 0) {
			// if (anskey.substr(0, 1) != ",") {
			// 	anskey = ","+anskey;
			// }
			// if (anskey.substr(-1, 1) != ",") {
			// 	anskey += ",";
			// }
			
			userans = userans.replace(/,/gm, "#cm");
			//userans = ","+userans+",";
			if (userans != "" && this.checkInArray(anskey.split(","),userans.split(',')) ) {
				is_correct = 1;
				userans = userans.replace(/#cm/gm, ",");
			}
		} else {
			if (userans == anskey) {
				is_correct = 1;
			}
		}
		
		return is_correct;
	}

	markUserAnswer(is_correct) {
		const droped_value_indicator_html = '<span class="'+((is_correct == 1) ? "icomoon-new-24px-checkmark-circle-1 font-weight-bold" : "icomoon-new-24px-cancel-circle-1 font-weight-bold")+'" style="color:'+((is_correct == 1) ? "green" : "red" )+';">';
		let correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="background:white;border-radius:15px 12px 12px;"> '  + droped_value_indicator_html + '</span></span>';
		if (JS.find(ajax_eId, '.prettyprint', 'all').length > 0) {
			correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="bottom:22px;background:none;border-radius:12px;"> '  + droped_value_indicator_html + '</span></span>';
		}
		return correct_incorrect_mark;
	}

	checkAns(fillid) {
		this.userAnsXML = "<smans type='9'>\n";
		this.result = true;
		this.temp = 0;
		JS.find(fillid, 'select,input,textarea,.dropable,span.edit_step.mathquill', 'all').forEach((_this)=> {
			this.userAnsXML = this.checkChildAnswer(fillid, _this, this.userAnsXML);
		});
		this.userAnsXML += "</smans>";
		window.ISSPECIALMODULEUSERXMLCHANGE = 1;
		JS.select("#special_module_user_xml").value = this.userAnsXML;
		this.updateModule('uxml', this.userAnsXML);

		if (parseInt(JS.select(fillid).getAttribute('manual_grade')) != 1) {
			JS.select("#answer").checked = ((this.result) ? true : false);
			if (this.result) {
				JS.select("#answer").checked = true;
				if (typeof(is_sm) != "undefined") JS.showmsg("Correct", 3);
				return "Correct";
			} else {
				JS.select("#answer").checked = false;
				if (typeof(is_sm) != "undefined") JS.showmsg("Incorrect", 3);
				return "Incorrect";
				
			}
		}
	}

	checkInArray(tree, branch) {
		let matchedBranch = [];
		for (let i = 0; i < tree.length; i++) {
			for (let j = 0; j < branch.length; j++) {
				if (!matchedBranch.includes(branch[j]) && (branch[j].trim() == tree[i].trim())) {
					matchedBranch.push(branch[j]);
					continue;
				}
			}
		}
		let result = (branch.length - matchedBranch.length);
		//console.log({branch,tree,matchedBranch,result});
		return result == 0 ? true : false;
	}

	checkChildAnswer(fillid, pElem, userAnsXML) {
		if (pElem.classList.contains('dropable')) {
			var ansKey = pElem.getAttribute('anskey').split(',');
			if (JS.findInArray(pElem.getAttribute('userans'), ansKey) == false) {
				this.result = false;
			} else {
				this.temp++;
			}
			if (typeof calculatePoint != "undefined") {
				calculatePoint(JS.select(fillid).getAttribute('totalcorrectans'), this.temp);
			}
			userAnsXML += `<div id='${pElem.getAttribute("id")}' userAns='${pElem.getAttribute('userans')}'></div>\n`;
			//@simran - start
		} else if (pElem.classList.contains('mathquill')) {
			var innerfield = [];
			var mathItemId = pElem.getAttribute('id');
			var anskey = pElem.getAttribute("anskey").trim();
			var originalLatex = pElem.getAttribute("userans").trim();
			
			var MQ = MathQuill.getInterface(2);
			var mathItem = MQ.StaticMath(document.getElementById(mathItemId));
			
			for (var i = 0; i <= mathItem.innerFields.length - 1; i++) {
				innerfield[i] = mathItem.innerFields[i].latex();
			}

			let newMathField = originalLatex;
			let mathField = originalLatex.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);

			if (innerfield.indexOf("")<0) {
				for (i in mathField) {
					const createFeild = '\\MathQuillMathField{'+innerfield[i]+'}';
					const newMf = mathField[i].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g , createFeild);
					const regex = mathField[i];
					newMathField = newMathField.replace(regex , newMf);
				}
			}

			originalLatex = newMathField;
		
			let userans = originalLatex;

			if (anskey != userans) {
				this.result = false;
			} else {
				this.temp++;
			}
			
			pElem.getAttribute("userans", userans);
		
			userAnsXML += `<div id='${pElem.getAttribute("id")}' userAns='${userans}' anskey='${anskey}' userAnsSeq='${pElem.getAttribute("userAnsSeq")}'></div>\n`;

		//@simran - end
		} else if (pElem.parentElement.classList.contains('fillelement')) {
			if (pElem.nodeName == "SELECT") {
				this.uAnsSel = "";
				this.a = 0;
				this.totalcorrect = JS.find(pElem, "[correctans='1']", 'all').length;
				JS.find(pElem, "option", 'all').forEach((_value, index)=> {
					if (_value.selected) {
						this.a++;
						if (_value.getAttribute("correctans") != 1) {
							this.result = false;
						} else {
							this.temp++;
						}
						this.uAnsSel = this.uAnsSel+(index)+",";
					}
				});
				if (this.a != this.totalcorrect) this.result = false;
				if (typeof calculatePoint != "undefined") {
					calculatePoint(JS.select(fillid).getAttribute('totalcorrectans'), this.temp);
				}
				userAnsXML += `<div id='${pElem.parentElement.getAttribute("id")}' userAns='${this.uAnsSel}'></div>\n`;
			} else if (pElem.nodeName == "INPUT" || pElem.nodeName == "TEXTAREA") {
				var anskey = pElem.getAttribute("anskey").trim(), 
				userans = pElem.value.trim(),
				codetype = pElem.getAttribute("codetype");
				if (codetype == 1) {
					var regex_code = [/\s+/g,/\;$/,/"/g];
					var regex_replace = ["","","'"];
					for (let l=0; l<regex_code.length; l++)  {
						userans = userans.replace(regex_code[l],regex_replace[l]);
						anskey = anskey.replace(regex_code[l],regex_replace[l]);
					}
				}
				if (JS.select(fillid).getAttribute('matchtype') == 1) {
					anskey = anskey.toLowerCase();
					userans = userans.toLowerCase();
				}
				if (JS.select(fillid).getAttribute('ignoretype') == 1) {
					if (JS.select(fillid).getAttribute('multi') != 0) {
						let ans = [];
						anskey.split(',').forEach((val, index)=> {
							ans.push(val.replace(/[^a-zA-Z0-9]/gi, ""));
						});
						anskey = ans.join(',');
					} else {
						anskey = anskey.replace(/[^a-zA-Z0-9]/gi, "");
					}
					userans = userans.replace(/[^a-zA-Z0-9]/gi, "");
				}
				//Multiple in textBox
				if (JS.select(fillid).getAttribute('multi') != 0) {
					//if (anskey.substr(0, 1) != ",") {anskey = ","+anskey;}
					//if (anskey.substr(-1, 1) != ",") {anskey += ",";}
					userans = userans.replace(/,/g,"#cm");
					if (userans == "" || !this.checkInArray(anskey.split(','),userans.split(','))) {
						this.result = false;
					} else {
						this.temp++;
					}
				} else {
					var haskey = pElem.getAttribute('haskeywords'), 
					hasnkey	   = pElem.getAttribute('hasnotkeywords');
					if (pElem.getAttribute('keywordtype') == 1 && haskey.length > 0 && hasnkey.length > 0) {
						var valid = 0 ,valid_is = 0;
						haskey.split(',').forEach((val, index)=> {
							if (userans.indexOf(val) != -1) valid++;
						});
						hasnkey.split(',').forEach((val, index)=> {
							if (userans.indexOf(val) != -1) valid_is++;
						});
						if (haskey.split(',').length != valid || valid_is != 0) {
							this.result = false;
						} else {
							this.temp++;
						}
					} else {
						if (anskey != userans) {
							this.result = false;
						} else {
							this.temp++;
						}
					}
				}
				if (typeof calculatePoint != "undefined") {
					calculatePoint(JS.select(fillid).getAttribute('totalcorrectans'), this.temp);
				}
				var __ans = pElem.value;
				if (pElem.nodeName == "TEXTAREA") {
					__ans = __ans.replace(/'/g, "#singlequote#");
					__ans = __ans.replace(/"/g, "#dblquote#");
				}
				if (pElem.nodeName == "INPUT") ;
				userAnsXML += `<div id='${pElem.parentElement.getAttribute("id")}' userAns='${__ans}'></div>\n`;
			}
		}
		return userAnsXML;
		
	}

	modeOn(modeType, isReview) {
		JS.selectAll('.test, .review', 'addClass', 'h');
		if (modeType) {
			if (typeof hotkeys == 'function') {
				hotkeys.unbind('alt+down,enter,delete','fillintheblank');
				hotkeys.deleteScope('fillintheblank');
			}
			JS.selectAll('.review', 'removeClass', 'h');
			//try{
				this.unBindLab();
			//} catch(e) {
			//}
			this.showdragans(ajax_eId, 'u',1);
			
		} else {
			this.bindKeyup(ajax_eId);
			JS.selectAll('.test', 'removeClass', 'h');
			this.bindLab();
			this.showdragans(ajax_eId, 'u');
		}
	}

	bindLab() {
		this.labBinded = true;
		JS.find(ajax_eId, 'select,input,textarea', {action: 'removeAttr', actionData: 'disabled'});
		try {
			this.readyFill(ajax_eId);
		} catch(e) {
			console.log("catch");
		}
	}	

	unBindLab() {
		this.labBinded = false;
		JS.find(ajax_eId, 'input,select,textarea', 'all').forEach((_this)=> {
			if (this.nodeName == "INPUT" || this.nodeName == "TEXTAREA") { 
				_this.getAttribute('userans', _this.value); 
			} else if (this.nodeName == "SELECT") {
				_this.querySelectorAll("option").forEach((elm, index)=> {
					elm.selected ? elm.setAttribute('userans', 1) : elm.setAttribute('userans', '');
				});
			}
		});
		// @pradeep -  remove disabled due to ada read.
		//$(ajax_eId).find('select,input,textarea').prop('disabled','disabled');
		
		//JS.find(ajax_eId, '.dragable .dropable').off('click dragenter mouseenter mouseleave touchstart keyup');
		//JS.find(ajax_eId, '.dragable').draggable("destroy");
		// JS.find(ajax_eId, '.dropable').each(function() {
		// 	if ($(this).hasClass('ui-draggable')) $(this).draggable("destroy");
		// });
		
	}

	pre_fill(fillid) {
		var fill_pre = JS.find(fillid, '.fillelement,.dropable', 'all');
		if (JS.find(fillid, '.prettyprint', 'all').length > 0) {
			if (typeof activate == "function") activate(1);
			JS.selectAll(fillid, 'hide');
			if (JS.find(fillid, 'pre').classList.contains('lg')) JS.selectAll(fillid, 'css', {'width': 930+'px'});
			setTimeout(()=> {
				if (JS.find(fillid, 'pre').classList.contains('linenums')) {
					this.delPreSpaces.withLines(fillid);
				} else {
					this.delPreSpaces.withoutLines(fillid);
				}
				this.delPreSpaces.showFillModule( fillid );
			},1000);
		}
	}
}

const ucFill = new fillJS();

/* clsSMFill/FillInTheBlanksPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMFill/FillInTheBlanksPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-83d7ak-style";
	style.textContent = "xmp{display:inline}[id^=\"fillmain\"]{overflow:hidden;max-width:1024px;text-align:left}[id^=\"fillmain\"] pre{background:none;border:none;font-size:14px!important}[id^=\"fillmain\"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^=\"fillmain\"] .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^=\"fillmain\"] .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^=\"fillmain\"] .fill-row{padding:6px}[id^=\"fillmain\"] .fillelement, [id^=\"fillmain\"] .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}[id^=\"fillmain\"] input[type=\"text\"], [id^=\"fillmain\"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^=\"fillmain\"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^=\"fillmain\"] .drag-resize.ui-draggable{cursor:move}[id^=\"fillmain\"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^=\"fillmain\"] .fillcheck ul{width:220px}[id^=\"fillmain\"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^=\"fillmain\"] .select{font-size:15px}[id^=\"fillmain\"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}.bla [id^=\"fillmain\"] .dragable:focus, .bla [id^=\"fillmain\"] .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}[id^=\"fillmain\"] select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#555;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Helvetica,Arial,'Times New Roman',Verdana,sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.prettyprint{display:-ms-grid!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbEluVGhlQmxhbmtzUHJldmlldy5zdmVsdGUiLCJzb3VyY2VzIjpbIkZpbGxJblRoZUJsYW5rc1ByZXZpZXcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4vKipcbiAqICBGaWxlIE5hbWUgICA6IEZpbGxJblRoZUJsYW5rc1ByZXZpZXcuanNcbiAqICBEZXNjcmlwdGlvbiA6IENvbnRhaW5lciBmb3IgYWxsIEZpbGwgaW4gVGhlIEJsYW5rcyBwcmV2aWV3IE1vZHVsZVxuICpcdEF1dGhvciAgICAgIDogUHJhZGVlcCBZYWRhdlxuICogIFZlcnNpb24gICAgIDogMS4wXG4gKiAgUGFja2FnZSAgICAgOiBwZS1pdGVtc1xuICogIExhc3QgdXBkYXRlIDogMTcgRGVjIDIwMTdcbiAqL1xuXHRpbXBvcnQge3VjRmlsbH0gZnJvbSAnLi9maWxsSlNTdHJpbmcnO1xuXHRpbXBvcnQganUgZnJvbSAnLi4vc3JjL2xpYnMvanNsaWInO1xuXHQvL2ltcG9ydCBzbVZhbCBmcm9tICcuLi9saWIvVmFsaWRhdGVJdGVtcyc7XG5cdGltcG9ydCBJdGVtSGVscGVyIGZyb20gJy4uL2hlbHBlci9JdGVtSGVscGVyLnN2ZWx0ZSc7XG5cdGltcG9ydCBGaWxsSW5UaGVCbGFua3NUb29sYmFyIGZyb20gJy4vRmlsbEluVGhlQmxhbmtzVG9vbGJhci5zdmVsdGUnO1xuXHRpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cdGltcG9ydCB7IGJlZm9yZVVwZGF0ZSwgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSc7XG5cdGltcG9ydCB7IEFILCBYTUxUb0pTT04gfSBmcm9tICcuLi9oZWxwZXIvSGVscGVyQUkuc3ZlbHRlJztcblx0ZXhwb3J0IGxldCBtYW51YWxfZ3JhZGU7XG5cdGV4cG9ydCBsZXQgeG1sO1xuXHRleHBvcnQgbGV0IHV4bWw7XG5cdGV4cG9ydCBsZXQgaXNSZXZpZXc7XG5cdGV4cG9ydCBsZXQgZWRpdG9yU3RhdGU7XG5cdGV4cG9ydCBsZXQgc21WYWxpZGF0ZTtcblx0ZXhwb3J0IGxldCBzaG93QW5zO1xuXHQvLyB2YXJpYWJsZSBkZWNsYXJhdGlvblxuXHRsZXQgc21Db250cm9sbGVyQ2FsbGJhY2s7XG5cdGxldCBjZGF0YSA9IFwiXCI7XG5cdGxldCBkcmFnRGF0YSA9IFwiXCI7XG5cdGxldCBDaGVja0R1cGxpY2F0ZSA9IFtdO1xuXHRsZXQgZHJhZ0lEID0gMDtcblx0bGV0IGVycm9yQ2F0Y2hGbGFnID0gMTtcblx0bGV0IGZpbGxNYXRoID0gW107XG5cdGxldCBmaWxsSWQ7XG5cdGxldCBwYXJzZWRYbWwgPSB7fTtcblx0bGV0IHBhcnNlZFV4bWwgPSB7fTtcblx0bGV0IGNvbnRhaW5lcklEID0gXCJmaWxsbWFpblwiO1xuXHRnbG9iYWxUaGlzLmFqYXhfZUlkID0gXCIjZmlsbG1haW5cIjtcblx0bGV0IHN0YXRlID0ge307XG5cdGxldCBoZGQgPSB3cml0YWJsZSh7XG5cdFx0XHRtYXRjaHR5cGUgOiBcIjBcIixcblx0XHRcdGlnbm9yZXR5cGU6XCJcIixcblx0XHRcdG11bHRpOlwiXCIsXG5cdFx0XHR0b3RhbGNvcnJlY3RhbnM6MCxcblx0XHRcdHNob3dUb29sYmFyOiBmYWxzZSxcblx0XHRcdGlzTWF0aHF1aWxsOmZhbHNlLFxuXHRcdFx0ZmlsbE1hdGg6IFtdLFxuXHRcdFx0Zm9vdGVyU3RyOiBmYWxzZSxcblx0XHR9KTtcblx0Y29uc3QgdW5zdWJzY3JpYmUgPSBoZGQuc3Vic2NyaWJlKChpdGVtcyk9PiB7XG5cdFx0c3RhdGUgPSBpdGVtcztcblx0fSlcblxuXHQkOiAoaXNSZXZpZXcpID8gc2V0UmV2aWV3KCkgOiB1bnNldFJldmlldygpO1xuXG5cdG9uTW91bnQoKCk9PiB7XG5cdFx0d2luZG93LkogPSBqdTtcblx0XHR1Y0ZpbGwuc2V0VXBkYXRlKHVwZGF0ZU1vZHVsZS5iaW5kKHRoaXMpKTtcblx0XHRBSC5hZGRTY3JpcHQoXCJcIiwgZWRpdG9yLmJhc2VVcmxUaGVtZStcInBlLWl0ZW1zL3N2ZWx0ZS9jbHNTTUZpbGwvbGlicy9tYXRoUXVpbGxfbmV3LmpzXCIpO1xuXHRcdGxldCBtYXRoSXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklEKTtcblx0XHRtYXRoSXRlbSA9IG1hdGhJdGVtID8gbWF0aEl0ZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWF0aHF1aWxsJykgOiBtYXRoSXRlbTtcblx0XHRpZiAoc3RhdGUuaXNNYXRocXVpbGwpIHtcblx0XHRcdEFILnNlbGVjdEFsbChcImRpdlwiICsgYWpheF9lSWQsICAnY3NzJywgeydvdmVyZmxvdyc6ICdhdXRvJ30pO1xuXHRcdH1cblx0XHQvLyBCaW5kaW5nIHRoZSBldmVudHMgXG5cdFx0QUguYmluZChhamF4X2VJZCwgJ2NsaWNrJywgZGlzcGxheUFucyk7XG5cdFx0QUguYmluZChhamF4X2VJZCwgJ2tleXVwJywgZGlzcGxheUFucyk7XG5cdFx0QUguYmluZChhamF4X2VJZCwgJ2NoYW5nZScsIGRpc3BsYXlBbnMpO1xuXG5cdFx0QUgubGlzdGVuKGRvY3VtZW50LCBcImNsaWNrXCIsIFwic3Bhbi5tcS1lZGl0YWJsZS1maWVsZC5tcS1mb2N1c2VkXCIsIG9uZWRpdG9Gb2N1c2VkKTtcblx0XHRBSC5saXN0ZW4oZG9jdW1lbnQsIFwiY2hhbmdlXCIsIFwic3Bhbi5tcS1lZGl0YWJsZS1maWVsZC5tcS1mb2N1c2VkXCIsIG9uZWRpdG9Gb2N1c2VkKTtcblxuXHRcdC8vIGZvciBsb2FkaW5nIHRoZSBtb2R1bGUgb24gdGhlIGJhc2lzIG9mIHRoZSB1cGRhdGVkIHRoZSB4bWxcblx0XHRsb2FkTW9kdWxlKCk7XG5cdH0pXG5cblx0Lypcblx0KiogVGhpcyBmdW5jdGlvbiB3aWxsIGNhbGwgd2hlbiBjb21wZW50IHJlY2lldmluZyBuZXcgcHJvcCBpbiBvdGhlciB3b3JkcyB3aGVuZXZlciBcblx0KiogYW55IHRoaW5nIGNoYW5nZXMgaW4geG1sIHRoaXMgZnVuY3Rpb24gd2lsbCBjYWxsIGF1dG9tYXRpY2FsbHlcblx0Ki9cblx0YmVmb3JlVXBkYXRlKChuZXh0UHJvcHMpPT4ge1xuXHRcdC8vIGNoZWNrIGZvciB0aGUgcmVtZWRpYXRpb24gbW9kZSBcblx0XHQvLyBpZiB0aGUgcmVtZWRpYXRpb24gbW9kZSBpcyBvblxuXHRcdC8vIGlmIChpc1Jldmlldykge1xuXHRcdC8vIFx0Ly8gc2hvdyB0aGUgYW5zZXJ0IGJ5IGNhbGxpbmcgdGhlIHNldFJldmlldyBmdW5jdGlvblxuXHRcdC8vIFx0c2V0UmV2aWV3KCk7XG5cdFx0Ly8gfSBlbHNlIHtcblx0XHQvLyBcdHVuc2V0UmV2aWV3KClcblx0XHQvLyB9XG5cdFx0Ly8gZm9yIGNoZWNraW5nIHRoYXQgdGhlcmUgaXMgY2hhbmdlIGluIHRoZSB4bWxcblx0XHRpZiAoeG1sICE9IHN0YXRlLnhtbCkge1xuXHRcdFx0aWYgKGVkaXRvclN0YXRlICYmIGVkaXRvclN0YXRlLnN0b3BQcmV2aWV3VXBkYXRlID09IHRydWUpIHJldHVybiBmYWxzZTtcblx0XHRcdC8vIGZvciBsb2FkaW5nIHRoZSBtb2R1bGUgb24gdGhlIGJhc2lzIG9mIHRoZSB1cGRhdGVkIHRoZSB4bWxcblx0XHRcdGxvYWRNb2R1bGUoKTtcblx0XHRcdC8vIGZvciBhZGRpbmcgdGhlIHRhYmluZGV4XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxldCBub2RlID0gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmV2aWV3QXJlYScpO1xuXHRcdFx0XHRpZihub2RlLmNoaWxkTm9kZXNbMF0gJiYgbm9kZS5jaGlsZE5vZGVzWzBdLm5vZGVOYW1lID09ICdUQUJMRScpIHtcblx0XHRcdFx0XHRub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3ByZXZpZXdBcmVhIHRkJyk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaXRlbSBpbiBub2RlKXsgXG5cdFx0XHRcdFx0XHRpZighbm9kZVtpdGVtXS5maXJzdEVsZW1lbnRDaGlsZCAmJiBub2RlW2l0ZW1dLm5vZGVOYW1lID09ICdURCcpe1xuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKG5vZGVbaXRlbV0uY2hpbGROb2Rlc1swXS5ub2RlVHlwZSk7XG5cdFx0XHRcdFx0XHRcdG5vZGVbaXRlbV0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsJzAnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaXRlbSBpbiBub2RlLmNoaWxkTm9kZXMpeyBcblx0XHRcdFx0XHRcdGlmKG5vZGUuY2hpbGROb2Rlc1tpdGVtXS5ub2RlVHlwZSA9PSAzKXtcblx0XHRcdFx0XHRcdFx0bGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXHRcdFx0XHRcdFx0XHR0eHQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsJzAnKTtcblx0XHRcdFx0XHRcdFx0dHh0LmlubmVySFRNTCA9IG5vZGUuY2hpbGROb2Rlc1tpdGVtXS50ZXh0Q29udGVudDtcblx0XHRcdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzW2l0ZW1dLnJlcGxhY2VXaXRoKHR4dCk7XG5cdFx0XHRcdFx0XHRcdC8vbm9kZS5jaGlsZE5vZGVzW2l0ZW1dLm5vZGVWYWx1ZSA9IDxzcGFuIHRhYmluZGU9XCIwXCI+e308L3NwYW4+O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSwxMDAwKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIGZvciBsb2FkaW5nIHRoZSBtb2R1bGUgaW5pdGlhbGx5IFx0XG5cdGZ1bmN0aW9uIGxvYWRNb2R1bGUoKSB7XG5cdFx0c3RhdGUueG1sID0geG1sO1xuXHRcdC8vIGNvbnZlcnRpbmcgdGhlIHhtbCB0byBqc29uIHVzaW5nIFhNTFRvSlNPTiBmdW5jdGlvblxuXHRcdHBhcnNlZFhtbCA9IFhNTFRvSlNPTih4bWwpO1xuXHRcdC8vIGNoZWNraW5nIGZvciB1c2VyIGFuc1xuXHRcdGlmICh1eG1sKSB7XG5cdFx0XHRpZiAoIXdpbmRvdy5pc1Jlc2V0TWF0aCkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJ1eG1sIGxvYWRlZFwiLCB3aW5kb3cuaXNSZXNldE1hdGgpO1xuXHRcdFx0XHRwYXJzZWRVeG1sID0gWE1MVG9KU09OKHV4bWwpO1xuXHRcdFx0XHRzdGF0ZS51eG1sID0gdXhtbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlV4bWwgbm90IGxvYWRlZFwiLCB3aW5kb3cuaXNSZXNldE1hdGgpO1xuXHRcdFx0XHR3aW5kb3cuaXNSZXNldE1hdGggPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gcGFyc2luZyB0aGUgYXV0aG9yaW5nIHhtbFxuXHRcdHBhcnNlWG1sQXV0aG9yaW5nKHBhcnNlZFhtbCwgcGFyc2VkVXhtbCk7XG5cdFx0dWNGaWxsLnNob3dkcmFnYW5zKGFqYXhfZUlkLCAndScpO1xuXHRcdGlmKCF4bWwpIHtcblx0XHRcdGxldCBlcnJNc2cgPSBzbVZhbC52YWxpZGF0ZShlZGl0b3JTdGF0ZS5jb250ZW50X3R5cGUsIGVkaXRvclN0YXRlLnN1YnR5cGUgLCBlZGl0b3JTdGF0ZS5jb250ZW50X2ljb24pO1xuXHRcdFx0c21WYWxpZGF0ZShlcnJNc2cpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVVzZXJBbnMocGFyc2VkVWFucykge1xuXHRcdGxldCB1YVhNTE5ldyA9IFwiXCI7XG5cdFx0Ly8gZmluZGluZyB0aGUgY29ycmVjdCBhbnNcblx0XHRsZXQgYW5zd2VyS2V5ID0gcGFyc2VkWG1sLnNteG1sLnRleHQuX19jZGF0YS5tYXRjaCgvJXtbXFxzXFxTXSo/fSUvZ20pO1xuXHRcdGxldCBhbnN3ZXJUeXBlID0gXCJcIjtcblx0XHQvLyBpZiBjb3JyZWN0IGFuc3dlciBpcyBmb3VuZCB0cmF2ZXJzZWluZyBlYWNoIGNvcnJlY3QgYW5zXG5cdFx0aWYgKGFuc3dlcktleSkge1xuXHRcdFx0YW5zd2VyS2V5LmZvckVhY2goKGN1cnJlbnRBbnMsIGkpPT4ge1xuXHRcdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXG5cdFx0XHRcdGlmIChwYXJzZWRVYW5zKSB7XG5cdFx0XHRcdFx0aWYgKHBhcnNlZFVhbnMuc21hbnMpIHtcblx0XHRcdFx0XHRcdGxldCB1YW5zID0gcGFyc2VkVWFucy5zbWFucy5kaXY7XG5cdFx0XHRcdFx0XHRpZihBcnJheS5pc0FycmF5KHVhbnMpID09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRcdHVhbnMgPSBbXVxuXHRcdFx0XHRcdFx0XHR1YW5zWzBdID0gcGFyc2VkVWFucy5zbWFucy5kaXY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih1YW5zKSB7XG5cdFx0XHRcdFx0XHRcdHVhWE1MTmV3ID0gdWFuc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZmluZGluZyB0aGUgdHlwZSBieSBmaW5kaW5nIHRoZSBtYXRjaCB3aXRoIHN0cmluZyBjb250YWluaW5nIHwgaW4gdGhlIHN0YXJ0IGFuZCBlbmQgd2l0aCB9JVxuXHRcdFx0XHRhbnN3ZXJUeXBlID0gY3VycmVudEFucy5tYXRjaCgvXFx8KC4qPyl9JSQvZ20pO1xuXHRcdFx0XHQvLyByZW1vdmluZyB0aGUgfCBzeW1ib2wgYW5kIH0lIGFuZCBzYXZlIHRoZSByZW1haW5pbmcgdGhpbmcgaW4gYW5zd2VyVHlwZSBpZiBtYXRjaCBpcyBmb3VuZCBvdGhlcndpc2Uga2VwdCB0aGUgYW5zd2VyVHlwZSBiYWxua1xuXHQgICAgXHRcdGFuc3dlclR5cGUgPSAoYW5zd2VyVHlwZSkgPyBhbnN3ZXJUeXBlWzBdLnJlcGxhY2UoL1xcfHx9JS9nbSwnJykgOiAnJztcblx0ICAgIFx0XHRhbnN3ZXJUeXBlID0gYW5zd2VyVHlwZS50cmltKCk7XG5cdFx0XHRcdGlmICh1YVhNTE5ldyAmJiB1YVhNTE5ldy5fdXNlckFucykge1xuXHRcdFx0XHRcdC8vIHN0b3JpbmcgdGhlIHVzZXJhbnMgYXR0cmlidXRlIHZhbHVlIGluIHVzZXJhbnN3ZXJcblx0XHRcdFx0XHRsZXQgaWQgPSBcIlwiO1xuXHRcdFx0XHRcdGlmIChhbnN3ZXJUeXBlID09ICcnIHx8IGFuc3dlclR5cGUgPT0gJ2MnKSB7XG5cdFx0XHRcdFx0XHQvLyBGb3IgdGV4dGJveFxuXHRcdFx0XHRcdFx0aWQgPSBgI2VsZW0ke2l9IC5maWxsaW50aGVibGFua2A7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhbnN3ZXJUeXBlID09ICduJykgeyBcblx0XHRcdFx0XHRcdC8vIGlmIHRoZSB0eXBlIGlzIG51bWVyaWNcblx0XHRcdFx0XHRcdGlkID0gYCNlbGVtJHtpfSAuZmlsbGludGhlYmxhbmtgO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5zd2VyVHlwZSA9PSBcImRcIiB8fCBhbnN3ZXJUeXBlID09IFwiZHNcIikge1xuXHRcdFx0XHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSB1c2VyIGFuc1xuXHRcdFx0XHRcdFx0aWQgPSBgI2VsZW0ke2l9YDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFuc3dlclR5cGUgPT0gXCJzXCIpIHtcblx0XHRcdFx0XHRcdC8vIGNoZWNraW5nIGNyZWF0ZVNlbGVjdEJveCBmb3IgdGhlIHVzZXIgYW5zXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhbnN3ZXJUeXBlID09IFwiZVwiKSB7XG5cdFx0XHRcdFx0XHRpZCA9IGAjZWxlbSR7aX1gO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5zd2VyVHlwZS5pbmRleE9mKFwie1wiID09IDApIHx8IGFuc3dlclR5cGUuaW5kZXhPZihcIntcIiA9PSAxKSkge1xuXHRcdFx0XHRcdFx0Ly8gRm9yIG11bHRpbGluZSBcblx0XHRcdFx0XHRcdGlkID0gYCNlbGVtJHtpfSAudGV4dGFyZWFgO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoQUguaXNWYWxpZChpZCkgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCkpIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpLnNldEF0dHJpYnV0ZSgndXNlcmFucycsIHVhWE1MTmV3Ll91c2VyQW5zKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coY3VycmVudEFucywgaWQsIGFuc3dlclR5cGUsIHVhWE1MTmV3Ll91c2VyQW5zKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvLyB0aGlzIGZ1bmN0aW9uIHJlc3BvbnNpYmxlIGZvciBwYXJzaW5nIHRoZSB4bWwgXG5cdGZ1bmN0aW9uIHBhcnNlWG1sQXV0aG9yaW5nKE1ZWE1MLCB1YVhNTD1mYWxzZSkge1xuXHRcdC8vIGZldGNoaW5nIHRoZSBjZGF0YVxuXHRcdGNkYXRhID0gTVlYTUwuc214bWwudGV4dC5fX2NkYXRhO1xuXHRcdGRyYWdEYXRhID0gXCJcIjtcblx0XHRDaGVja0R1cGxpY2F0ZSA9IFtdO1xuXHRcdGRyYWdJRCA9IDA7XG5cdFx0c3RhdGUuZm9vdGVyU3RyID0gZmFsc2U7XG5cdFx0QUguc2VsZWN0QWxsKFwiLnNtbm90ZXNcIiwgJ2hpZGUnKTtcblxuXHRcdC8vIGNvbnZlcnRpbmcgdGhlIG1hdGNoVHlwZSB0byBtYXRjaHR5cGVcblx0XHRpZiAoTVlYTUwuc214bWwudGV4dC5fbWF0Y2hUeXBlKSB7XG5cdFx0XHRNWVhNTC5zbXhtbC50ZXh0Ll9tYXRjaHR5cGUgPSBNWVhNTC5zbXhtbC50ZXh0Ll9tYXRjaFR5cGU7XG5cdFx0XHRkZWxldGUgTVlYTUwuc214bWwudGV4dC5fbWF0Y2hUeXBlO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnRpbmcgdGhlIGlnbm9yZVR5cGUgdG8gaWdub3JldHlwZVxuXHRcdGlmIChNWVhNTC5zbXhtbC50ZXh0Ll9pZ25vcmVUeXBlKSB7XG5cdFx0XHRNWVhNTC5zbXhtbC50ZXh0Ll9pZ25vcmV0eXBlID0gTVlYTUwuc214bWwudGV4dC5faWdub3JlVHlwZTtcblx0XHRcdGRlbGV0ZSBNWVhNTC5zbXhtbC50ZXh0Ll9pZ25vcmVUeXBlO1xuXHRcdH1cblxuXHRcdC8vIHNldHRpbmcgc3RhdGUgXG5cdFx0c3RhdGUubWF0Y2h0eXBlID0gTVlYTUwuc214bWwudGV4dC5fbWF0Y2h0eXBlO1xuXHRcdHN0YXRlLmlnbm9yZXR5cGUgPSBNWVhNTC5zbXhtbC50ZXh0Ll9pZ25vcmV0eXBlO1xuXHRcdHN0YXRlLm11bHRpID0gKE1ZWE1MLnNteG1sLnRleHQuX211bHRpcGxlID09IFwibXVsdGlwbGVcIikgPyBcIjFcIiA6IFwiXCI7XG5cblx0XHQvLyBmaW5kaW5nIHRoZSBjb3JyZWN0IGFuc1xuXHRcdGxldCBhbnN3ZXJLZXkgPSBjZGF0YS5tYXRjaCgvJXtbXFxzXFxTXSo/fSUvZ20pO1xuXHRcdGxldCBhbnN3ZXJUeXBlID0gJyc7XG5cdFx0bGV0IGNoZWNrVHlwZSA9IFtdO1xuXHRcdGxldCB1YVhNTE5ldyA9IFwiXCI7XG5cdFx0bGV0IHRvdGFsTWFya3MgPSAwO1xuXHRcdC8vIGlmIGNvcnJlY3QgYW5zd2VyIGlzIGZvdW5kIHRyYXZlcnNlaW5nIGVhY2ggY29ycmVjdCBhbnNcblx0XHRpZiAoYW5zd2VyS2V5KSB7XG5cdFx0XHRhbnN3ZXJLZXkuZm9yRWFjaCgodiwgaSk9Pntcblx0XHRcdFx0dG90YWxNYXJrcysrO1xuXHRcdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXG5cdFx0XHRcdGlmICh1YVhNTCkge1xuXHRcdFx0XHRcdGlmICh1YVhNTC5zbWFucykge1xuXHRcdFx0XHRcdFx0bGV0IHVhbnMgPSB1YVhNTC5zbWFucy5kaXY7XG5cdFx0XHRcdFx0XHRpZihBcnJheS5pc0FycmF5KHVhbnMpID09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRcdHVhbnMgPSBbXVxuXHRcdFx0XHRcdFx0XHR1YW5zWzBdID0gdWFYTUwuc21hbnMuZGl2O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodWFucykge1xuXHRcdFx0XHRcdFx0XHR1YVhNTE5ldyA9IHVhbnNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IG9yaWdpbmFsS2V5ID0gYW5zd2VyS2V5W2ldO1xuXHRcdFx0XHQvLyBmaW5kaW5nIHRoZSB0eXBlIGJ5IGZpbmRpbmcgdGhlIG1hdGNoIHdpdGggc3RyaW5nIGNvbnRhaW5pbmcgfCBpbiB0aGUgc3RhcnQgYW5kIGVuZCB3aXRoIH0lXG5cdFx0XHRcdGFuc3dlclR5cGUgPSBhbnN3ZXJLZXlbaV0ubWF0Y2goL1xcfCguKj8pfSUkL2dtKTtcblx0XHRcdFx0Ly8gcmVtb3ZpbmcgdGhlIHwgc3ltYm9sIGFuZCB9JSBhbmQgc2F2ZSB0aGUgcmVtYWluaW5nIHRoaW5nIGluIGFuc3dlclR5cGUgaWYgbWF0Y2ggaXMgZm91bmQgb3RoZXJ3aXNlIGtlcHQgdGhlIGFuc3dlclR5cGUgYmFsbmtcblx0ICAgIFx0XHRhbnN3ZXJUeXBlID0gKGFuc3dlclR5cGUpID8gYW5zd2VyVHlwZVswXS5yZXBsYWNlKC9cXHx8fSUvZ20sJycpIDogJyc7XG5cdCAgICBcdFx0YW5zd2VyVHlwZSA9IGFuc3dlclR5cGUudHJpbSgpO1xuXHRcdFx0XHRjaGVja1R5cGUucHVzaChhbnN3ZXJUeXBlKTtcblx0XHRcdFx0Ly8gaW4gY2FzZSBvZiB0ZXh0Ym94IG9yIGNvZGV0eXBlXG5cdCAgICBcdFx0aWYoYW5zd2VyVHlwZSA9PSAnJyB8fCBhbnN3ZXJUeXBlID09ICdjJykge1xuXHRcdFx0XHRcdEFILnNlbGVjdEFsbChcIi5zbW5vdGVzXCIsICdzaG93Jyk7XG5cdFx0XHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSB1c2VyIGFuc1xuXHRcdFx0XHRcdGlmKHVhWE1MTmV3KSB7XG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIHRleHRib3ggaW4gdGhlIHByZXZpZXcgYXJlYSB3aXRoIHVzZXIgYW5zXG5cdFx0XHRcdFx0XHRjcmVhdGVUZXh0Ym94KG9yaWdpbmFsS2V5LGksdWFYTUxOZXcpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIHRleHRib3ggaW4gdGhlIHByZXZpZXcgYXJlYVxuXHRcdFx0XHRcdFx0Y3JlYXRlVGV4dGJveChvcmlnaW5hbEtleSxpKTtcblx0XHRcdFx0XHR9XG5cdCAgICBcdFx0fSBlbHNlIGlmKGFuc3dlclR5cGUgPT0gJ24nKSB7IFxuXHRcdFx0XHRcdC8vIGlmIHRoZSB0eXBlIGlzIG51bWVyaWNcblx0XHRcdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXG5cdFx0XHRcdFx0aWYodWFYTUxOZXcpIHtcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgbnVtZXJpYyB0ZXh0Ym94IGluIHRoZSBwcmV2aWV3IGFyZWEgd2l0aCB1c2VyIGFuc1xuXHRcdFx0XHRcdFx0Y3JlYXRlTnVtZXJpY2JveChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcblx0XHRcdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIG51bWVyaWMgdGV4dGJveCBpbiB0aGUgcHJldmlldyBhcmVhXG5cdFx0XHRcdFx0XHRjcmVhdGVOdW1lcmljYm94KG9yaWdpbmFsS2V5LGkpO1xuXHRcdFx0XHRcdH1cblx0ICAgIFx0XHR9IGVsc2UgaWYoYW5zd2VyVHlwZSA9PSBcImRcIiB8fCBhbnN3ZXJUeXBlID09IFwiZHNcIikge1xuXHRcdFx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcblx0XHRcdFx0XHRpZih1YVhNTE5ldyl7XG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIGRyYWcgJiBkcm9wIHRleHRib3ggaW4gdGhlIHByZXZpZXcgYXJlYSB3aXRoIHVzZXIgYW5zXG5cdFx0XHRcdFx0XHRjcmVhdGVEcmFnRHJvcChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSBkcmFnICYgZHJvcCB0ZXh0Ym94IGluIHRoZSBwcmV2aWV3IGFyZWFcblx0XHRcdFx0XHRcdGNyZWF0ZURyYWdEcm9wKG9yaWdpbmFsS2V5LGkpO1xuXHRcdFx0XHRcdH1cblx0ICAgIFx0XHRcdFxuXHQgICAgXHRcdH0gZWxzZSBpZihhbnN3ZXJUeXBlID09IFwic1wiKSB7XG5cdFx0XHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSB1c2VyIGFuc1xuXHRcdFx0XHRcdGlmKHVhWE1MTmV3KSB7XG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIHNlbGVjdCBib3ggaW4gdGhlIHByZXZpZXcgYXJlYSB3aXRoIHVzZXIgYW5zXG5cdFx0XHRcdFx0XHRjcmVhdGVTZWxlY3RCb3gob3JpZ2luYWxLZXksaSx1YVhNTE5ldyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgc2VsZWN0IGJveCBpbiB0aGUgcHJldmlldyBhcmVhXG5cdFx0XHRcdFx0XHRjcmVhdGVTZWxlY3RCb3gob3JpZ2luYWxLZXksaSk7XG5cdFx0XHRcdFx0fVxuXHQgICAgXHRcdH0gZWxzZSBpZihhbnN3ZXJUeXBlID09IFwiZVwiKSB7XG5cdFx0XHRcdFx0c3RhdGUuaXNNYXRocXVpbGwgPSB0cnVlO1xuXHRcdFx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcblx0XHRcdFx0XHRpZiAodWFYTUxOZXcpIHtcblx0XHRcdFx0XHRcdC8vIGNyZWF0aW5nIHRleHRib3ggd2l0aCB1c2VyIGFucyBpbiBwcmV2aWV3IGFyZWFcblx0XHRcdFx0XHRcdGNyZWF0ZU1hdGhEaXYob3JpZ2luYWxLZXksaSx1YVhNTE5ldyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGNyZWF0aW5nIHRleHRib3ggaW4gcHJldmlldyBhcmVhXG5cdFx0XHRcdFx0XHRjcmVhdGVNYXRoRGl2KG9yaWdpbmFsS2V5LGkpO1xuXHRcdFx0XHRcdH1cblx0ICAgIFx0XHR9IGVsc2UgaWYoYW5zd2VyVHlwZS5pbmRleE9mKFwie1wiID09IDApIHx8IGFuc3dlclR5cGUuaW5kZXhPZihcIntcIiA9PSAxKSkge1xuXHRcdFx0XHRcdEFILnNlbGVjdEFsbChcIi5zbW5vdGVzXCIsICdzaG93Jyk7XG5cdFx0XHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSB1c2VyIGFuc1xuXHRcdFx0XHRcdGlmICh1YVhNTE5ldykge1xuXHRcdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSB0ZXh0YXJlYSBpbiB0aGUgcHJldmlldyBhcmVhIHdpdGggdXNlciBhbnNcblx0XHRcdFx0XHRcdGNyZWF0ZU11bHRpbGluZUJveChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSB0ZXh0YXJlYSBpbiB0aGUgcHJldmlldyBhcmVhXG5cdFx0XHRcdFx0XHRjcmVhdGVNdWx0aWxpbmVCb3gob3JpZ2luYWxLZXksaSk7XHRcblx0XHRcdFx0XHR9XG5cdCAgICBcdFx0fVxuXHRcdFx0XHRsZXQgaW5uZXJLZXkgPSBvcmlnaW5hbEtleS5yZXBsYWNlKFwiJXtcIixcIlwiKS5yZXBsYWNlKFwifSVcIixcIlwiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRBSC5zZWxlY3RBbGwoXCIjXCIrY29udGFpbmVySUQsICdhdHRyJywge1widG90YWxjb3JyZWN0YW5zXCI6IHRvdGFsTWFya3N9ICk7XG5cdFx0Ly8gUmVzb2x2ZSBodG1sIGVudGl0eVxuXHRcdGNkYXRhID0gQUguaWdub3JlRW5pdHkoY2RhdGEpO1xuXHRcdFxuXHRcdC8vIHB1dCB0aGUgY2RhdGEgaW4gdGhlIHByZXZpZXdhcmVhXG5cdFx0QUguZmluZChcIiNcIitjb250YWluZXJJRCwgXCIjcHJldmlld0FyZWFcIiwge2FjdGlvbjonaHRtbCcsIGFjdGlvbkRhdGE6IGNkYXRhfSk7XG5cdFx0Ly8gcHV0IHRoZSBkcmFnRGF0YSBpbiB0aGUgZHJhZ2FyZWFcblx0XHRBSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELCBcIi5kcmFnQXJlYVwiLHthY3Rpb246ICdodG1sJywgYWN0aW9uRGF0YTogZHJhZ0RhdGF9KTtcblx0XHRsZXQgcGFyZW50ID0gQUguZmluZChcIiNcIitjb250YWluZXJJRCwgXCIuZHJhZ0FyZWFcIik7XG5cdCAgICBsZXQgZGl2cyA9IHBhcmVudD8uY2hpbGRyZW4gPyBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikgOiBbXTtcblx0ICAgIHdoaWxlIChkaXZzLmxlbmd0aCkge1xuXHQgICAgICAgIHBhcmVudC5hcHBlbmQoZGl2cy5zcGxpY2UoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGl2cy5sZW5ndGgpLCAxKVswXSk7XG5cdCAgICB9XG5cdFx0Ly8gc2V0IHRoZSBtYXggd2lkdGggb2YgdGhlIHRleHRib3hcblx0ICAgIHNldE1heFdpZHRoKCk7XG5cdCAgICBzZXRTTU5vdGVzKCk7XG5cdFx0cnVuTW9kdWxlKCk7XG5cdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0aWYoQUguZmluZChhamF4X2VJZCwgXCIucHJldHR5cHJpbnRcIiwgJ2FsbCcpLmxlbmd0aCA+PSAxKSB7XG5cdFx0XHRcdGlmKEFILmZpbmQoYWpheF9lSWQsIFwiLnByZXR0eXByaW50IC5MMFwiLCAnYWxsJykubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRpZih0eXBlb2YocHJldHR5UHJpbnQpID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdC8qY29kZSB0byBwcmV2ZW50IHByZXR0eSBwcmludCBleGlzdGluZyBwcmV0aWZpZWQgY29kZSAwNC8wMi8yMDE4Ki9cblx0XHRcdFx0XHRcdEFILnNlbGVjdEFsbChcIi5wcmV0dHlwcmludFwiKS5mb3JFYWNoKChfdGhpcyk9Pntcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LmFkZChcInByZXR0eXByaW50UmVwbGljYVwiKTtcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LnJlbW92ZShcInByZXR0eXByaW50XCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRBSC5zZWxlY3RBbGwoXCIubGluZW51bXNcIikuZm9yRWFjaCgoX3RoaXMpPT4ge1xuXHRcdFx0XHRcdFx0XHRfdGhpcy5jbGFzc0xpc3QuYWRkKFwibGluZW51bXNSZXBsaWNhXCIpO1xuXHRcdFx0XHRcdFx0XHRfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwibGluZW51bXNcIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdEFILmZpbmQoYWpheF9lSWQsIFwiLnByZXR0eXByaW50UmVwbGljYVwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XG5cdFx0XHRcdFx0XHRcdF90aGlzLmNsYXNzTGlzdC5hZGQoXCJwcmV0dHlwcmludFwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0QUguZmluZChhamF4X2VJZCwgXCIubGluZW51bXNSZXBsaWNhXCIpLmZvckVhY2goKF90aGlzKT0+IHtcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LmFkZChcImxpbmVudW1zXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvKioqKioqKiovXG5cdFx0XHRcdFx0XHRwcmV0dHlQcmludCgpO1xuXHRcdFx0XHRcdFx0Lypjb2RlIHRvIHByZXZlbnQgcHJldHR5IHByaW50IGV4aXN0aW5nIHByZXRpZmllZCBjb2RlIDA0LzAyLzIwMTgqL1xuXHRcdFx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLnByZXR0eXByaW50UmVwbGljYVwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XG5cdFx0XHRcdFx0XHRcdF90aGlzLmNsYXNzTGlzdC5hZGQoXCJwcmV0dHlwcmludFwiKTtcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LnJlbW92ZShcInByZXR0eXByaW50UmVwbGljYVwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLmxpbmVudW1zUmVwbGljYVwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XG5cdFx0XHRcdFx0XHRcdF90aGlzLmNsYXNzTGlzdC5hZGQoXCJsaW5lbnVtc1wiKTtcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LnJlbW92ZShcImxpbmVudW1zUmVwbGljYVwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0LyoqKioqKiovXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdH0sMjAwMCk7XG5cblx0XHRpZiAoQUguZmluZChhamF4X2VJZCwgXCJ0YWJsZS51Yy10YWJsZVwiLCAnYWxsJykubGVuZ3RoID4gMCkge1xuXHRcdFx0QUguZmluZChhamF4X2VJZCwgXCJ0YWJsZS51Yy10YWJsZVwiLCB7YWN0aW9uOidhZGRDbGFzcycsIGFjdGlvbkRhdGE6ICdmb250MTQnfSk7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHQvLyBmb3IgcmVtb3ZpbmcgYnJcblx0XHRcdFx0aWYgKEFILmZpbmQoYWpheF9lSWQsIFwidGFibGUudWMtdGFibGVcIikucHJldmlvdXNFbGVtZW50U2libGluZz8ubm9kZU5hbWUgPT0gXCJCUlwiKSB7XG5cdFx0XHRcdFx0QUguZmluZChhamF4X2VJZCwgXCJ0YWJsZS51Yy10YWJsZVwiKS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0fVxuXHRcblx0Ly8gZnVuY3Rpb24gY2FsbHMgd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXG5cdGZ1bmN0aW9uIHNldFJldmlldygpIHtcblx0XHRpc1JldmlldyA9IHRydWU7XG5cdFx0Ly8gRm9yIG1hdGhxdWwgYmFzZWQgXG5cdFx0aWYgKHhtbC5pbmNsdWRlcyhcInVzZXIgUmVzcG9uc2V7XCIpICkgd2luZG93LmlzUmVzZXRNYXRoID0gdHJ1ZTtcblx0XHRzdGF0ZS5zaG93VG9vbGJhciA9IGZhbHNlO1xuXHRcdC8vIHNob3cgdGhlIGFuc3dlciBhbmQgYWxzbyBiaW5kIHRoZSBrZXlzIGV2ZW50IGZvciBhZGFcblx0XHR1Y0ZpbGwubW9kZU9uKFwib25cIik7XG5cdFx0dWNGaWxsLnNob3dkcmFnYW5zKGFqYXhfZUlkLCAndScsIDEpO1xuXHRcdEFILnNlbGVjdEFsbCgnLnJlbWVkX2Rpc2FibGUnLCAnc2hvdycpO1xuXHRcdGF1dG9yZXNpemUoMSk7XG5cdFx0bGV0IG1hdGhJdGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySUQpO1xuXHRcdG1hdGhJdGVtID0gbWF0aEl0ZW0gPyBtYXRoSXRlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtYXRocXVpbGwnKSA6IG1hdGhJdGVtO1xuXHRcdGlmIChtYXRoSXRlbSkge1xuXHRcdFx0QUguc2V0Q3NzKGFqYXhfZUlkLCB7XCJwb3NpdGlvblwiOiBcInJlbGF0aXZlXCJ9KTtcblx0XHRcdEFILmluc2VydChhamF4X2VJZCwgXCI8ZGl2IGNsYXNzPSdzcGlubmVyLXdyYXBwZXInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZSFpbXBvcnRhbnQ7b3BhY2l0eTowIWltcG9ydGFudDsnPjwvZGl2PlwiLCAnYWZ0ZXJiZWdpbicpO1xuXHRcdH1cblxuXHRcdC8vIGZvciBlZGl0b3Jcblx0XHQvLyB1Y0ZpbGwubW9kZU9uKFwib25cIik7XG5cdFx0Ly8gc3RhdGUuc2hvd1Rvb2xiYXIgPSBmYWxzZTtcblx0XHQvLyB1Y0ZpbGwuc2hvd2RyYWdhbnMoYWpheF9lSWQsICd1JywgMSk7XG5cdFx0Ly8gc21Db250cm9sbGVyQ2FsbGJhY2suYWN0aXZlWW91ckFuc3dlcigpO1xuXHRcdC8vIEFILnNlbGVjdEFsbCgnLmNvcnJfZGl2JywgJ2hpZGUnKTtcblx0XHQvLyBBSC5zZWxlY3RBbGwoJy5yZW1lZF9kaXNhYmxlJywnc2hvdycpO1xuXHR9XG5cblx0Ly8gZnVuY3Rpb24gY2FsbHMgd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9mZlxuXHRmdW5jdGlvbiB1bnNldFJldmlldygpIHtcblx0XHRpc1JldmlldyA9IGZhbHNlO1xuXHRcdEFILnNlbGVjdEFsbCgnLm1hdGhxdWlsbCcsICdjc3MnLCB7J2JvcmRlcic6ICdub25lJ30pO1xuXHRcdHVjRmlsbC5tb2RlT24oKTtcblx0XHRBSC5zZWxlY3RBbGwoJy5yZW1lZF9kaXNhYmxlLCAuY29ycl9kaXYnLCAnaGlkZScpO1xuXHRcdHVjRmlsbC5zaG93ZHJhZ2FucyhhamF4X2VJZCwgJ3UnLCAwKTtcblx0XHRsZXQgbWF0aEl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJRCk7XG5cdFx0bWF0aEl0ZW0gPSBtYXRoSXRlbSA/IG1hdGhJdGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21hdGhxdWlsbCcpIDogbWF0aEl0ZW07XG5cdFx0YXV0b3Jlc2l6ZSgpO1xuXHRcdGlmIChtYXRoSXRlbSkge1xuXHRcdFx0QUguc2VsZWN0QWxsKGFqYXhfZUlkLCAnY3NzJywge1wicG9zaXRpb25cIjogXCJ1bnNldFwifSk7XG5cdFx0XHRBSC5zZWxlY3RBbGwoXCIuc3Bpbm5lci13cmFwcGVyXCIsICdyZW1vdmUnKTtcblx0XHR9XG5cblx0XHQvLyBpZiB0aGUgcmVtZWRpYXRpb24gbW9kZSBpZiBvZmYgaW4gZWRpdG9yXG5cdFx0Ly8gdWNGaWxsLm1vZGVPbigpO1xuXHRcdC8vIHVjRmlsbC5zaG93ZHJhZ2FucyhhamF4X2VJZCwgJ3UnLCAwKTtcblx0XHQvLyBBSC5zZXRDc3MoJy5lZGl0X3N0ZXAnLCB7J2JvcmRlcic6J25vbmUnfSk7XG5cdFx0Ly8gQUguc2VsZWN0QWxsKCcuY29ycl9kaXYnLCdoaWRlJyk7XG5cdH1cblxuXHQvLyBmb3IgcmVzaXppbmcgdGhlIHRleHRhcmVhXG5cdGZ1bmN0aW9uIGF1dG9yZXNpemUoZmxhZykge1xuXHRcdGxldCBmdGJfdGV4dGFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHRhcmVhLmtzXCIpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZnRiX3RleHRhcmVhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgZSA9IGZ0Yl90ZXh0YXJlYVtpXTtcblx0XHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCAgICBlLnN0eWxlLmNzc1RleHQgPSAnaGVpZ2h0OmF1dG87b3ZlcmZsb3c6IGF1dG87Jztcblx0XHRcdCAgICBpZihmbGFnKVxuXHRcdFx0ICAgIFx0aWYod2luZG93LmlzSUUpXG5cdFx0XHQgICAgXHRcdGUuc3R5bGUuY3NzVGV4dCA9ICdoZWlnaHQ6JyArIChlLnNjcm9sbEhlaWdodCsxMCkgKyAncHg7b3ZlcmZsb3c6IGhpZGRlbic7XG5cdFx0XHQgICAgXHRlbHNlXG5cdFx0XHRcdFx0XHRlLnN0eWxlLmNzc1RleHQgPSAnaGVpZ2h0OicgKyAoZS5zY3JvbGxIZWlnaHQpICsgJ3B4O292ZXJmbG93OiBoaWRkZW4nO1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0fSwxMDApO1xuXHRcdH1cblx0fVxuXG5cdC8vIGZvciBkaXNwbGF5aW5nIHRoZSBhbnN3ZXJcblx0ZnVuY3Rpb24gZGlzcGxheUFucygpIHtcblx0XHQvLyBjaGVjayB0aGUgYW5zIGFuZCBjcmVhdGUgdXNlciBhbnNcblx0XHRsZXQgYW5zID0gdWNGaWxsLmNoZWNrQW5zKGFqYXhfZUlkKTtcblx0XHRpZihlZGl0b3JTdGF0ZSkgeyBzaG93QW5zKGFucyk7IH1cblx0fVxuXG5cdC8vIGZvciB0b2dnbGluZyB0aGUgdG9vbGJhciBpbiBjYXNlIG9mIG1hdGggbW9kdWxlXG5cdGZ1bmN0aW9uIHRvZ2dsZVRvb2xiYXIodmFsdWUpIHtcblx0XHRzdGF0ZS5zaG93VG9vbGJhciA9IHZhbHVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25lZGl0b0ZvY3VzZWQoeCwgZXZlbnQpIHtcblx0XHRsZXQgaXNGaWxsSWQgPSB0cnVlO1xuXHRcdGxldCBmaWxsSWQ7XG5cdFx0d2hpbGUgKGlzRmlsbElkKSB7XG5cdFx0XHR4ID0geC5wYXJlbnRFbGVtZW50O1xuXHRcdFx0aWYoeC5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcblx0XHRcdFx0aXNGaWxsSWQgPSBmYWxzZTtcblx0XHRcdFx0ZmlsbElkID0geC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFx0XG5cdFx0bGV0IGxhdGV4QXJyYXkgPSBbXTtcblx0XHRcdFxuXHRcdEFILnNlbGVjdEFsbChcIiNcIiArIGZpbGxJZCArIFwiIHNwYW4ubXEtZWRpdGFibGUtZmllbGRcIikuZm9yRWFjaCgoZWxlbWVudCk9PiB7XHRcblx0XHRcdGxldCBjb21tYW5kSWQgPSB4LmdldEF0dHJpYnV0ZSgnbWF0aHF1aWxsLWNvbW1hbmQtaWQnKTtcblx0XHRcdGxhdGV4QXJyYXkucHVzaChjb21tYW5kSWQpO1xuXHRcdH0pO1xuXHRcdFx0XG5cdFx0bGV0IG1hdGhJZCA9IHguZ2V0QXR0cmlidXRlKCdtYXRocXVpbGwtY29tbWFuZC1pZCcpO1xuXHRcdGxldCBpbmRleElkID0gbGF0ZXhBcnJheS5pbmRleE9mKG1hdGhJZCk7XG5cdFx0c3RhdGUuc3BhbklkID0gaW5kZXhJZDtcblx0XHRzdGF0ZS5kaXZJZCA9ICBmaWxsSWQ7XG5cdFx0c3RhdGUuc2hvd1Rvb2xiYXIgPSB0cnVlO1x0XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVNb2R1bGUoa2V5LCB2YWx1ZSkge1xuXHRcdHN0YXRlW2tleV0gPSB2YWx1ZTtcblx0XHRpZiAoa2V5ID09ICd1eG1sJykge1xuXHRcdFx0cGFyc2VkVXhtbCA9IFhNTFRvSlNPTihzdGF0ZS51eG1sKTtcblx0XHRcdC8vIHBhcnNpbmcgdGhlIGF1dGhvcmluZyB4bWxcblx0XHRcdHVwZGF0ZVVzZXJBbnMocGFyc2VkVXhtbCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gZm9yIGdpdmluZyB0aGUgdWMtdGFibGUgc3R5bGVcblx0ZnVuY3Rpb24gc2V0U01Ob3Rlcygpe1xuXHRcdGlmKEFILmZpbmQoYWpheF9lSWQsIFwidGFibGUudWMtdGFibGVcIiwgJ2FsbCcpLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCB0YWJsZVdpZHRoID0gKEFILmZpbmQoYWpheF9lSWQsIFwidGFibGUudWMtdGFibGVcIikuY2xpZW50V2lkdGgpICsgOTtcblx0XHRcdEFILnNldENzcyhBSC5maW5kKGFqYXhfZUlkLCBcIi5zbW5vdGVzXCIpLCB7XG5cdFx0XHRcdCd3aWR0aCc6IHRhYmxlV2lkdGggKyBcInB4XCIsXG5cdFx0XHRcdCdtYXJnaW4nOiBcImF1dG9cIixcblx0XHRcdFx0J3BhZGRpbmctdG9wJzogXCI1cHhcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gZm9yIGFkZGluZyB0aGUgZXZlbnQgdG8gc2VsZWN0IGFuZCBhZGQgZHJhZyBhbmQgZHJvcCBmdW5jdGlvbmFsaXR5IHRvIGVsZW1lbnRcblx0ZnVuY3Rpb24gcnVuTW9kdWxlKCkge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInJ1bm1vZHVsZVwiKTtcblx0XHRcdC8vIGZvciBhZGRpbmcgdGhlIGV2ZW50IHRvIHNlbGVjdCBhbmQgYWRkIGRyYWcgYW5kIGRyb3AgZnVuY3Rpb25hbGl0eSB0byBlbGVtZW50XG5cdFx0XHR1Y0ZpbGwucmVhZHlGaWxsKGFqYXhfZUlkKTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGlmIChlcnJvckNhdGNoRmxhZyA8PSAxMDApIHtcblx0XHRcdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dCgoKT0+IHtcblx0XHRcdFx0XHRydW5Nb2R1bGUoKTtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHR9LCA1MCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJFcnJvciBhdCBydW5Nb2R1bGUgZnVuY3Rpb25cIik7XG5cdFx0XHR9XG5cdFx0XHRlcnJvckNhdGNoRmxhZysrO1xuXHRcdH1cblx0fVxuXG5cdC8vIGZvciBzZXR0aW5nIG1heGltdW0gd2lkdGggb2YgdGhlIGRyYWcgYXJlYVxuXHRmdW5jdGlvbiBzZXRNYXhXaWR0aCgpIHtcblx0XHRsZXQgbWF4RHJhZ0Ryb3BXaWR0aCA9IFtdO1xuXHRcdEFILnNlbGVjdEFsbChcIi5kcmFnQXJlYSBkaXZcIikuZm9yRWFjaCgoX3RoaXMsIGkpPT4ge1xuXHQgICAgXHRtYXhEcmFnRHJvcFdpZHRoLnB1c2goX3RoaXMuaW5uZXJIVE1MLmxlbmd0aCAqIDEwICsgMzApOyBcblx0ICAgIH0pO1xuXG5cdCAgICBBSC5zZWxlY3RBbGwoXCIjcHJldmlld0FyZWEgW2lkXj1lbGVtXVwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XG5cdCAgICBcdGlmIChfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2RyYWctcmVzaXplJykpIHtcblx0ICAgIFx0XHRBSC5zZXRDc3MoX3RoaXMsIHtcIm1heC13aWR0aFwiOiBNYXRoLm1heCguLi5tYXhEcmFnRHJvcFdpZHRoKX0pO1xuXHQgICAgXHR9XG5cdCAgICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIHNpeCBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGlucHV0IGFyZWEgaW4gdGhlXG5cdCAqIFByZXZpZXcgc2VjdGlvbiBvbiB0aGUgYmFzaXMgb2YgdGhlIGF1dGhvcmluZyB4bWxcblx0Ki9cblxuXHRmdW5jdGlvbiBjcmVhdGVNYXRoRGl2KGRhdGEsIGksIHVhWE1MID0gZmFsc2UpIHtcblx0XHRsZXQgb3JpZ2luYWxEYXRhID0gZGF0YTtcblx0XHQvLyByZW1vdmluZyB0aGUgJXsgLCB9JSBzeW1ib2wgZnJvbSB0aGUgZGF0YSAgXG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSgvJXt8fSUvZywgXCJcIik7XG5cdFx0Ly8gc3BsaXR0aW5nIGl0IHdpdGggfFxuXHRcdGRhdGEgPSBkYXRhLnNwbGl0KFwifFwiKTtcblx0XHQvLyByZXBsYWNpbmcgdGhlIHVzZXIgUmVzcG9uc2UgaW4gTWF0aFF1aWxsTWF0aEZpZWxkXG5cdFx0bGV0IGFkZE1hdGhxdWlsbCA9IGRhdGFbMF0ucmVwbGFjZSgvdXNlciBSZXNwb25zZS9nLCAnXFxcXE1hdGhRdWlsbE1hdGhGaWVsZCcpO1xuXHRcdC8vIHRoZW4gc3BsaXRpbmcgd2l0aCAjI1xuXHRcdGxldCBzcGxpdERhdGEgPSAgYWRkTWF0aHF1aWxsLnNwbGl0KFwiIyNcIik7XG5cdFx0bGV0IHJhbmRvbUtleSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNwbGl0RGF0YS5sZW5ndGgpXG5cdFx0Ly8gdGFraW5nIHJhbmRvbSBvcHRpb25cblx0XHRsZXQgcmFuZG9tT3B0aW9uID0gc3BsaXREYXRhW3JhbmRvbUtleV07XG5cdFx0Ly8gc3RvcmluZyB0aGUgcmFuZG9tT3B0aW9uIGluIHVzZXJhc24gYnkgcmVwbGFjaW5nIHRoZSBNYXRoUXVpbGxNYXRoRmllbGR7KGFueSB2YWx1ZSl9IHRvIE1hdGhRdWlsbE1hdGhGaWVsZHt9XG5cdFx0bGV0IHVzZXJhbnMgPSByYW5kb21PcHRpb24ucmVwbGFjZSgvTWF0aFF1aWxsTWF0aEZpZWxkeyguKj8pfS9nLCAnTWF0aFF1aWxsTWF0aEZpZWxke30nKTtcblx0XHRsZXQgZGVmYXVsdGFucyA9IDA7XG5cdFx0bGV0IGFuc2tleSA9IHJhbmRvbU9wdGlvbjtcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXG5cdFx0aWYodWFYTUwpIHtcblx0XHRcdGlmKHVhWE1MLl91c2VyQW5zKSB7XG5cdFx0XHRcdC8vIHN0b3JpbmcgdGhlIHVzZXJhbnMgYXR0cmlidXRlIHZhbHVlIGluIHVzZXJhbnN3ZXJcblx0XHRcdFx0dXNlcmFucyA9IHVhWE1MLl91c2VyQW5zO1xuXHRcdFx0XHQvLyBjaGVjayBmb3IgdGhlIF91c2VyQW5zU2VxXG5cdFx0XHRcdGlmKHVhWE1MLl91c2VyQW5zU2VxKSB7XG5cdFx0XHRcdFx0Ly8gc3RvcmluZyB0aGUgYW5za2V5IGFuZCB1c2VyQW5zU2VxXG5cdFx0XHRcdFx0YW5za2V5ID0gdWFYTUwuX2Fuc2tleTtcblx0XHRcdFx0XHRyYW5kb21LZXkgPSB1YVhNTC5fdXNlckFuc1NlcTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocmFuZG9tT3B0aW9uLmluZGV4T2YoXCJcXE1hdGhRdWlsbE1hdGhGaWVsZFwiKSA+IC0xKSB7XG5cdFx0XHRhbnNrZXkgPSByYW5kb21PcHRpb247XG5cdFx0XHRkZWZhdWx0YW5zID0gMTtcblx0XHR9XG5cblx0XHRBSC5zZWxlY3RBbGwoJyNlbGVtJytpLCAnaGlkZScpO1xuXG5cdFx0bGV0IG1hdGhlcSA9IGA8c3BhbiBpZD1cImVsZW0ke2l9XCIgY2xhc3M9XCJhdXRvX2hlaWdodCBlZGl0X3N0ZXAgZmlsbG1hdGhlbGVtZW50IG1hdGhxdWlsbFwiIHVzZXJBbnNTZXE9XCIke3JhbmRvbUtleX1cIiB1c2VyYW5zPVwiJHt1c2VyYW5zfVwiIGFuc2tleT1cIiR7YW5za2V5fVwiIGRlZmF1bHRhbnM9XCIke2RlZmF1bHRhbnN9XCIgbWF0aHR5cGU9XCIxXCI+PC9zcGFuPmA7XG5cdFx0bGV0IHRhZyA9IGA8ZGl2IGlkPVwibWFpbl9kaXZcIiBjbGFzcz1cInRleHQtY2VudGVyIGZpbHRlciBhdXRvX2hlaWdodCBmaWxsZWxlbWVudCBtYXRoaXRlbSBpbmxpbmUtYmxvY2tcIj48ZGl2IGNsYXNzPVwiZGlzYWJsZV9kaXYgZmggZndpZHRoIGFic29sdXRlIGhcIj48L2Rpdj48ZGl2IGNsYXNzPVwicmVtZWRfZGlzYWJsZSBmaCBmd2lkdGggYWJzb2x1dGUgaFwiPjwvZGl2PjxzcGFuICBpZD1cIm0ke2l9XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCIgY2xhc3M9XCJhdXRvX2hlaWdodCBoIGNvcnJfZGl2IGZpbGxtYXRoZWxlbWVudCBtYXRocXVpbGxcIiB1c2VyQW5zU2VxPVwiJHtyYW5kb21LZXl9XCIgYW5za2V5PVwiJHthbnNrZXl9XCIgZGVmYXVsdGFucz1cIiR7ZGVmYXVsdGFuc31cIiBtYXRodHlwZT1cIjFcIj4ke2Fuc2tleX08L3NwYW4+JHttYXRoZXF9PC9kaXY+YDtcblxuXHRcdC8vIHJwbGFjaW5nIHRoZSBjZGF0YVxuXHRcdGNkYXRhID0gY2RhdGEucmVwbGFjZShvcmlnaW5hbERhdGEsIHRhZyk7XG5cblx0XHRsZXQgbXFJbnRlcnZhbCA9IHNldEludGVydmFsKCgpPT4geyBcblx0XHRcdC8vIGNoZWNraW5nIHRoZSBNYXRoUXVpbGwgZnVuY3Rpb24gaXMgZGVmaW5lZCBvciBub3Rcblx0XHRcdGlmICh0eXBlb2YgTWF0aFF1aWxsID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHQvLyBpZiBmb3VuZCBjbGVhciB0aGUgaW50ZXJ2YWxcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChtcUludGVydmFsKTtcblx0XHRcdFx0QUguc2VsZWN0QWxsKCcjZWxlbScraSwgJ3Nob3cnKTtcblx0XHRcdFx0Ly8gQWNjb3JkaW5nIHRvIEFQSSBET0M6IEJ5IGRlZmF1bHQsIE1hdGhRdWlsbCBvdmVyd3JpdGVzIHRoZSBnbG9iYWwgTWF0aFF1aWxsIHZhcmlhYmxlIHdoZW4gbG9hZGVkLiBJZiB5b3UgZG8gbm90IHdhbnQgdGhpcyBiZWhhdmlvciwgeW91IGNhbiB1c2UgdGhpcyBcblx0XHRcdFx0bGV0IE1RID0gTWF0aFF1aWxsLmdldEludGVyZmFjZSgyKTtcblx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLm1hdGhxdWlsbFwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XG5cdFx0XHRcdFx0bGV0IG1hdGhJdGVtSWQgID0gX3RoaXMuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXHRcdFx0XHRcdGxldCBkZWZhdWx0YW5zID0gX3RoaXMuZ2V0QXR0cmlidXRlKCdkZWZhdWx0YW5zJyk7XG5cdFx0XHRcdFx0Ly8gYWRkaW5nIHRoZSB1c2VyYW5zIGluIHRoZSBtYXRoSXRlbWlkXG5cdFx0XHRcdFx0aWYoZGVmYXVsdGFucyA9PSAxKSB7XG5cdFx0XHRcdFx0XHR2YXIgbGF0ZXggPSBfdGhpcy5nZXRBdHRyaWJ1dGUoJ3VzZXJhbnMnKTtcblx0XHRcdFx0XHRcdEFILnNlbGVjdEFsbCgnIycrbWF0aEl0ZW1JZCwgJ3RleHQnLCBsYXRleCk7IFxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRBSC5zZWxlY3RBbGwoJyMnK21hdGhJdGVtSWQsICd0ZXh0JywgX3RoaXMuZ2V0QXR0cmlidXRlKCd1c2VyYW5zJykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBBY2NvcmRpbmcgdG8gQXBpIGRvY1xuXHRcdFx0XHRcdCAqIE1RLlN0YXRpY01hdGgoaHRtbF9lbGVtZW50KSBDcmVhdGVzIGEgbm9uLWVkaXRhYmxlIE1hdGhRdWlsbCBpbml0aWFsaXplZCB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgSFRNTCBlbGVtZW50IGFuZCByZXR1cm5zIGEgU3RhdGljTWF0aCBvYmplY3QuXG5cdFx0XHRcdFx0ICogSWYgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYWxyZWFkeSBhIHN0YXRpYyBtYXRoIGluc3RhbmNlLFxuIFx0XHRcdFx0XHQgKiB0aGlzIHdpbGwgcmV0dXJuIGEgbmV3IFN0YXRpY01hdGggb2JqZWN0IHdpdGggdGhlIHNhbWUgLmlkLiBJZiB0aGUgZWxlbWVudCBpcyBhIGRpZmZlcmVudCB0eXBlIG9mIE1hdGhRdWlsbCwgdGhpcyB3aWxsIHJldHVybiBudWxsLlxuXHRcdFx0XHRcdCoqL1xuXHRcdFx0XHRcdGZpbGxNYXRoW21hdGhJdGVtSWRdID0gTVEuU3RhdGljTWF0aChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtYXRoSXRlbUlkKSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHVjRmlsbC5maWxsTWF0aCA9IGZpbGxNYXRoO1xuXHRcdFx0fVxuXHRcdH0sIDEwMClcdFxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlVGV4dGJveChkYXRhLGksdWFYTUw9ZmFsc2UpIHtcblx0XHR2YXIgdXNlckFuc3dlciAgPSBcIlwiO1xuXHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcblx0XHRpZih1YVhNTCkge1xuXHRcdFx0aWYodWFYTUwuX3VzZXJBbnMpIHtcblx0XHRcdFx0Ly8gc3RvcmluZyB0aGUgdXNlcmFucyBhdHRyaWJ1dGUgdmFsdWUgaW4gdXNlcmFuc3dlclxuXHRcdFx0XHR1c2VyQW5zd2VyID0gdWFYTUwuX3VzZXJBbnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xuXHRcdGxldCBjc1N0eWxlID0gXCJcIjtcblx0XHQvLyByZW1vdmluZyB0aGUgJXsgLCB9JSBzeW1ib2wgZnJvbSB0aGUgZGF0YSAgXG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSgvJXt8fSUvZyxcIlwiKTtcblx0XHQvLyBzcGxpdHRpbmcgaXQgd2l0aCB8XG5cdFx0ZGF0YSA9IGRhdGEuc3BsaXQoXCJ8XCIpO1xuXHRcdC8vIGlmIHRoZSB0eXBlIGlzIGNvZGV0eXBlIHRoZW4gbWFrZSBpdHMgdmFsdWUgMSBlbHNlIGJsYW5rXG5cdFx0bGV0IGNvZGV0eXBlID0gKGRhdGFbMV0gJiYgZGF0YVsxXS50cmltKCkgPT0gXCJjXCIpID8gXCIxXCIgOiBcIlwiO1xuXHRcdGxldCBhbnNrZXkgPSBkYXRhWzBdLnRyaW0oKTtcblxuXHRcdC8vIGNoZWNrIGZvciBpZiBhbnkgc3R5bGluZyBpcyBnaXZlbiBvciBub3Rcblx0XHRpZihhbnNrZXkuaW5kZXhPZihcIiNzdHlsZSNcIikgIT0gLTEpIHtcblx0XHRcdGxldCBjdXN0b21TdHlsZSAgPSBhbnNrZXkuc3BsaXQoXCIjc3R5bGUjXCIpO1xuXHRcdFx0Ly8gc3RvcmUgdGhlIGNvcnJlY3QgYW5zXG5cdFx0XHRhbnNrZXkgPSBjdXN0b21TdHlsZVswXTtcblx0XHRcdC8vIHN0b3JlIHRoZSBjdXN0b20gc3R5bGVcblx0XHRcdGNzU3R5bGUgPSBjdXN0b21TdHlsZVsxXTtcblx0XHR9XG5cdFx0bGV0IHR4dFdpZHRoICA9IFtdO1xuXHRcdC8vIHNwbGl0IHRoZSBhbnNrZXkgd2l0aCAsXG5cdFx0bGV0IGFuc2xlbiA9IGFuc2tleS5zcGxpdChcIixcIik7XG5cdFx0Ly8gZmluZGlpbmcgd2lkdGggb2YgdGhlIHRleHRib3hcblx0XHRBSC5zZWxlY3RBbGwoYW5zbGVuKS5mb3JFYWNoKCh2YWwsIGopPT4ge1xuXHRcdFx0dHh0V2lkdGhbal0gPSAoKGFuc2xlbltqXS5sZW5ndGgpKjEwKzMwKTtcblx0XHR9KTtcblx0XHQvLyBhZGRpbmcgaW5mb3JtYXRpb24gb2YgdGhlIHRhZyBhbmQgdGV4dGJveFxuXHRcdGxldCB0ZXh0Ym94ID0gYDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZmlsbGludGhlYmxhbmsga3NcIiBhbnNrZXk9XCIke2Fuc2tleS50cmltKCl9XCIgdmFsdWU9XCIke3VzZXJBbnN3ZXJ9XCIgdXNlcmFucz1cIiR7dXNlckFuc3dlcn1cIiBkZWZhdWx0YW5zPVwiXCIgaGFza2V5d29yZHM9XCJcIiBjb2RldHlwZT1cIiR7Y29kZXR5cGV9XCIgaGFzbm90a2V5d29yZHM9XCJcIiBrZXl3b3JkdHlwZT1cIlwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGRhdGEtcm9sZT1cIm5vbmVcIiBzdHlsZT1cIndpZHRoOiR7TWF0aC5tYXgoLi4udHh0V2lkdGgpfXB4OyR7Y3NTdHlsZX1cIiAvPmBcblx0XHRsZXQgdGFnID0gYDxkaXYgaWQ9XCJlbGVtJHtpfVwiIGNsYXNzPVwiZmlsbGVsZW1lbnRcIj4ke3RleHRib3h9PC9kaXY+YDtcblx0XHQvLyByZXBsYWNlIHRoZSBjZGF0YVxuXHRcdGNkYXRhID0gY2RhdGEucmVwbGFjZShvcmlnaW5hbERhdGEsdGFnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZU51bWVyaWNib3goZGF0YSxpLHVhWE1MPWZhbHNlKSB7XG5cdFx0dmFyIHVzZXJBbnN3ZXIgID0gXCJcIjtcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXG5cdFx0aWYgKHVhWE1MKSB7XG5cdFx0XHRpZiAodWFYTUwuX3VzZXJBbnMpIHtcblx0XHRcdFx0Ly8gc3RvcmluZyB0aGUgdXNlcmFucyBhdHRyaWJ1dGUgdmFsdWUgaW4gdXNlcmFuc3dlclxuXHRcdFx0XHR1c2VyQW5zd2VyID0gdWFYTUwuX3VzZXJBbnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xuXHRcdGxldCBjc1N0eWxlID0gXCJcIjtcblx0XHQvLyByZW1vdmluZyB0aGUgJXsgLCB9JSBzeW1ib2wgZnJvbSB0aGUgZGF0YSAgXG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSgvJXt8fSUvZyxcIlwiKTtcblx0XHQvLyBzcGxpdHRpbmcgaXQgd2l0aCB8XG5cdFx0ZGF0YSA9IGRhdGEuc3BsaXQoXCJ8XCIpO1xuXHRcdC8vIGlmIHRoZSB0eXBlIGlzIGNvZGV0eXBlIHRoZW4gbWFrZSBpdHMgdmFsdWUgMSBlbHNlIGJsYW5rXG5cdFx0bGV0IGNvZGV0eXBlID0gKGRhdGFbMV0gJiYgZGF0YVsxXS50cmltKCkgPT0gXCJjXCIpID8gXCIxXCIgOiBcIlwiO1xuXHRcdGxldCBhbnNrZXkgPSBkYXRhWzBdLnRyaW0oKTtcblx0XHQvLyBjaGVjayBmb3IgaWYgYW55IHN0eWxpbmcgaXMgZ2l2ZW4gb3Igbm90XG5cdFx0aWYgKGFuc2tleS5pbmRleE9mKFwiI3N0eWxlI1wiKSAhPSAtMSkge1xuXHRcdFx0bGV0IGN1c3RvbVN0eWxlICA9IGFuc2tleS5zcGxpdChcIiNzdHlsZSNcIik7XG5cdFx0XHQvLyBzdG9yZSB0aGUgY29ycmVjdCBhbnNcblx0XHRcdGFuc2tleSA9IGN1c3RvbVN0eWxlWzBdO1xuXHRcdFx0Ly8gc3RvcmUgdGhlIGN1c3RvbSBzdHlsZVxuXHRcdFx0Y3NTdHlsZSA9IGN1c3RvbVN0eWxlWzFdO1xuXHRcdH1cblx0XHRsZXQgdHh0V2lkdGggID0gW107XG5cdFx0Ly8gc3BsaXQgdGhlIGFuc2tleSB3aXRoICxcblx0XHRsZXQgYW5zbGVuID0gYW5za2V5LnNwbGl0KFwiLFwiKTtcblx0XHQvLyBmaW5kaWluZyB3aWR0aCBvZiB0aGUgdGV4dGJveFxuXHRcdEFILnNlbGVjdEFsbChhbnNsZW4pLmZvckVhY2goKGVsbSwgaik9PiB7XG5cdFx0XHR0eHRXaWR0aFtqXSA9ICgoYW5zbGVuW2pdLmxlbmd0aCkqMTArMzApO1xuXHRcdH0pO1xuXHRcdC8vIGFkZGluZyBpbmZvcm1hdGlvbiBvZiB0aGUgdGFnIGFuZCB0ZXh0Ym94XG5cdFx0bGV0IHRleHRib3ggPSBgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBvbktleURvd249XCJpZihpc05hTihldmVudC5rZXkpKXt2YXIga2V5X2FyciA9IFsxMywgMzcsIDM4LCAzOSwgNDAsIDgsIDY5LCAxMDEsIDQ2LCAxNiwgOV07aWYoIWtleV9hcnIuaW5jbHVkZXMoZXZlbnQua2V5Q29kZSkpIGV2ZW50LnByZXZlbnREZWZhdWx0KCl9IFwiY2xhc3M9XCJmaWxsaW50aGVibGFuayBrc1wiIGFuc2tleT1cIiR7YW5za2V5LnRyaW0oKX1cIiB2YWx1ZT1cIiR7dXNlckFuc3dlcn1cIiB1c2VyYW5zPVwiJHt1c2VyQW5zd2VyfVwiIGRlZmF1bHRhbnM9XCJcIiBoYXNrZXl3b3Jkcz1cIlwiIGNvZGV0eXBlPVwiJHtjb2RldHlwZX1cIiBoYXNub3RrZXl3b3Jkcz1cIlwiIGtleXdvcmR0eXBlPVwiXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgZGF0YS1yb2xlPVwibm9uZVwiIHN0eWxlPVwid2lkdGg6ICR7KE1hdGgubWF4KC4uLnR4dFdpZHRoKSsoMjApKX1weDske2NzU3R5bGV9XCIgLz5gO1xuXHRcdGxldCB0YWcgPSBgPGRpdiBpZD1cImVsZW0ke2l9XCIgY2xhc3M9XCJmaWxsZWxlbWVudFwiPiR7dGV4dGJveH08L2Rpdj5gO1xuXHRcdC8vIHJlcGxhY2UgdGhlIGNkYXRhXG5cdFx0Y2RhdGEgPSBjZGF0YS5yZXBsYWNlKG9yaWdpbmFsRGF0YSx0YWcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlU2VsZWN0Qm94KGRhdGEsaSx1YVhNTD1mYWxzZSkge1xuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xuXHRcdC8vIHJlbW92aW5nIHRoZSAleyAsIH0lIHN5bWJvbCBmcm9tIHRoZSBkYXRhICBcblx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKC8le3x9JS9nLFwiXCIpO1xuXHRcdC8vIHNwbGl0dGluZyBpdCB3aXRoIHxcblx0XHRkYXRhID0gZGF0YS5zcGxpdChcInxcIik7XG5cdFx0bGV0IG9wdGlvbnNWYWx1ZSA9IGRhdGFbMF0udHJpbSgpO1xuXHRcdC8vIHNwbGl0dGluZyB3aXRoICwgdG8gZXh0cmFjdCBhbGwgdGhlIG9wdGlvblxuXHRcdG9wdGlvbnNWYWx1ZSA9IG9wdGlvbnNWYWx1ZS5zcGxpdChcIixcIikubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpO1xuXHRcdGxldCBvcHRpb25zID0gJzxvcHRpb24gdmFsdWU9XCJcIj4mbmJzcDtQbGVhc2UgU2VsZWN0PC9vcHRpb24+JztcblxuXHRcdC8vIGl0ZXJhdGluZyB0aHJvdWdoIGVhY2ggb3B0aW9uc1xuXHRcdEFILnNlbGVjdEFsbChvcHRpb25zVmFsdWUpLmZvckVhY2goKF90aGlzLCBqKT0+IHtcblx0XHRcdC8vIGNoZWNraW5nIGNvcnJlY3Rcblx0XHRcdGxldCBpc0NvcnJlY3QgPSAoKG9wdGlvbnNWYWx1ZVtqXS5pbmRleE9mKCcqJykgPT0gMCk/IFwiMVwiIDogXCIwXCIpO1xuXHRcdFx0Ly8gY2hlY2tpbmcgZGVmYXVsdCBzZWxlY3RlZCB2YWx1ZVxuXHRcdFx0bGV0IHNlbGVjdGVkID0gKChvcHRpb25zVmFsdWVbal0uaW5kZXhPZignKycpID09IDApPyAnc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiJyA6IFwiXCIpO1xuXHRcdFx0Ly8gZXh0cmFjdGluZyB2YWx1ZSBvZiB0aGUgb3B0aW9uXG5cdFx0XHRsZXQgaW5uZXJWYWwgPSAoKG9wdGlvbnNWYWx1ZVtqXS5pbmRleE9mKCcqJykgPT0gMCB8fCBvcHRpb25zVmFsdWVbal0uaW5kZXhPZignKycpID09IDApPyBvcHRpb25zVmFsdWVbal0uc2xpY2UoMSkgOiBvcHRpb25zVmFsdWVbal0gKTtcblx0XHRcdGxldCB1c2VyQW5zd2VyID0gXCJcIjtcblx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhc25cblx0XHRcdGlmKHVhWE1MKSB7XG5cdFx0XHRcdGlmKHVhWE1MLl91c2VyQW5zKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWQgPSAnJztcblx0XHRcdFx0XHQvLyBzcGxpaXRpbmcgd2l0aCAsIFxuXHRcdFx0XHRcdGxldCBzZWwgPSB1YVhNTC5fdXNlckFucy5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0Ly8gY2hlY2tpbWcgZm9yIHRoZSBvcHRpb24gd2hpY2ggaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXJcblx0XHRcdFx0XHRpZihqID09IHNlbFswXS50cmltKCktMSkge1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWQgPSAnc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiJztcblx0XHRcdFx0XHRcdHVzZXJBbnN3ZXIgPSBcIjFcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gcmVwbGFjaW5nICNjbSB3aXRoICwgJiAjcGwgd2l0aCArIGluIG9wdGlvbiB0ZXh0XG5cdFx0XHRpbm5lclZhbCA9IGlubmVyVmFsLnJlcGxhY2UoL1xcI2NtL2dtaSxcIixcIikucmVwbGFjZSgvXFwjcGwvZ21pLFwiK1wiKTtcblx0XHRcdC8vIGNyZWF0aW5nIG9wdGlvbnNcblx0XHRcdG9wdGlvbnMgKz0gYDxvcHRpb24gdmFsdWU9XCIke2p9XCIgY29ycmVjdGFucz1cIiR7aXNDb3JyZWN0fVwiIHVzZXJhbnM9XCIke3VzZXJBbnN3ZXJ9XCIgJHtzZWxlY3RlZH0+Jm5ic3A7JHtpbm5lclZhbH08L29wdGlvbj5gO1xuXHRcdH0pXG5cdFx0Ly8gY3JlYXRpbmcgc2VsZWN0Ym94XG5cdFx0bGV0IHNlbGVjdGJveCA9IGA8c2VsZWN0IGNsYXNzPVwiZmlsbGludGhlYmxhbmsga3NcIiBkYXRhLXJvbGU9XCJub25lXCI+JHtvcHRpb25zfTwvc2VsZWN0PmA7XG5cdFx0bGV0IHRhZyA9IGA8ZGl2IGlkPVwiZWxlbSR7aX1cIiBjbGFzcz1cImZpbGxlbGVtZW50XCI+JHtzZWxlY3Rib3h9PC9kaXY+YDtcblx0XHQvLyByZXBsYWNlIHRoZSBjZGF0YVxuXHRcdGNkYXRhID0gY2RhdGEucmVwbGFjZShvcmlnaW5hbERhdGEsdGFnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZU11bHRpbGluZUJveChkYXRhLCBpLCB1YVhNTD1mYWxzZSkge1xuXHRcdGxldCB1c2VyQW5zd2VyTSAgPSBcIlwiO1xuXHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcblx0XHRpZiAodWFYTUwpIHtcblx0XHRcdGlmICh1YVhNTC5fdXNlckFucykge1xuXHRcdFx0XHQvLyBzdG9yaW5nIHRoZSB1c2VyYW5zIGF0dHJpYnV0ZSB2YWx1ZSBpbiB1c2VyYW5zd2VyXG5cdFx0XHRcdHVzZXJBbnN3ZXJNID0gdWFYTUwuX3VzZXJBbnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xuXHRcdC8vIHJlbW92aW5nIHRoZSAleyAsIH0lIHN5bWJvbCBmcm9tIHRoZSBkYXRhICBcblx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKC8le3x9JS9nLFwiXCIpO1xuXHRcdC8vIHNwbGl0dGluZyBpdCB3aXRoIHxcblx0XHRkYXRhID0gZGF0YS5zcGxpdChcInxcIik7XG5cdFx0bGV0IGFuc2tleSA9IGRhdGFbMF0udHJpbSgpO1xuXG5cdFx0Ly8gcGFyc2UgdGhlIGF0dHIgaW4ganNvblxuXHRcdGxldCBhdHRycyA9IEpTT04ucGFyc2UoZGF0YVsxXSk7XG5cdFx0Ly8gY3JlYXRpbmcgdGV4dGFyZWFcblx0XHRsZXQgbXVsdGlsaW5lQm94ICA9IGA8dGV4dGFyZWEgY2xhc3M9XCJ0ZXh0YXJlYSBrc1wiIHJvd3M9XCIke2F0dHJzLnJvd3N9XCIgY29scz1cIiR7YXR0cnMuY29sc31cIiBhbnNrZXk9XCIke2Fuc2tleX1cIiB2YWx1ZT1cIiR7dXNlckFuc3dlck19XCIgZGVmYXVsdGFucz1cIiR7KChhdHRycy5kZWZhdWx0QW5zKSA/IGF0dHJzLmRlZmF1bHRBbnM6IFwiXCIpfVwiIHVzZXJhbnM9XCIke3VzZXJBbnN3ZXJNfVwiIGhhc2tleXdvcmRzPVwiXCIgaGFzbm90a2V5d29yZHM9XCJcIiBrZXl3b3JkdHlwZT1cIjFcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBkYXRhLXJvbGU9XCJub25lXCI+JHt1c2VyQW5zd2VyTX08L3RleHRhcmVhPmA7XG5cdFx0bGV0IHRhZyA9IGA8ZGl2IGlkPVwiZWxlbSR7aX1cIiBjbGFzcz1cImZpbGxlbGVtZW50XCIgc3R5bGU9XCJoZWlnaHQ6YXV0b1wiPiR7bXVsdGlsaW5lQm94fTwvZGl2PmA7XG5cdFx0Ly8gcmVwbGFjZSB0aGUgY2RhdGFcblx0XHRjZGF0YSA9IGNkYXRhLnJlcGxhY2Uob3JpZ2luYWxEYXRhLCB0YWcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlRHJhZ0Ryb3AoZGF0YSxpLHVhWE1MPWZhbHNlKSB7XG5cdFx0bGV0IG9yaWdpbmFsRGF0YSA9IGRhdGE7XG5cdFx0Ly8gcmVtb3ZpbmcgdGhlICV7ICwgfSUgc3ltYm9sIGZyb20gdGhlIGRhdGEgIFxuXHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoLyV7fH0lL2csXCJcIik7XG5cdFx0Ly8gc3BsaXR0aW5nIGl0IHdpdGggfFxuXHRcdGRhdGEgPSBkYXRhLnNwbGl0KFwifFwiKTtcblx0XHRsZXQgYW5za2V5ID0gZGF0YVswXS50cmltKCk7XG5cdFx0Ly8gaWYgdGhlIHR5cGUgaXMgZHMgdGhlbiBtYWtlIGRyYWdTaW5nbGUgdmFsdWUgMSBlbHNlIDBcblx0XHRsZXQgZHJhZ1NpbmdsZSA9ICgoZGF0YVsxXS50cmltKCkgPT0gXCJkc1wiKT8gXCIxXCI6IFwiMFwiKTtcblx0XHQvLyBzcGxpdCB0aGUgYW5za2V5IHdpdGggLFxuXHRcdGxldCB0b3RhbERyYWcgPSBhbnNrZXkuc3BsaXQoXCIsXCIpO1xuXHRcdGxldCBkcm9wQW5zID0gJyc7XG5cblx0XHQvLyB0cmF2ZXJzaW5nIHRocm91Z2ggZWFjaCBvcHRpb25cblx0XHRBSC5zZWxlY3RBbGwodG90YWxEcmFnKS5mb3JFYWNoKChlbG0sIGopPT4ge1xuXHRcdFx0bGV0IGlzRHVwbGljYXRlID0gZmFsc2U7XG5cdFx0XHRsZXQgbWF4V2lkdGggPSAoKHRvdGFsRHJhZ1tqXS5sZW5ndGgpKjEwKzMwKTtcblx0XHRcdGxldCBkcmFnQW5zID0gdG90YWxEcmFnW2pdO1xuXHRcdFx0Ly8gc3RvcmluZyB0aGUgaW5jb3JyZWN0IHZhbHVlc1xuXHRcdFx0bGV0IGlnbm9yZSA9IHRvdGFsRHJhZ1tqXS5tYXRjaCgvaX58fmkvZyk7XG5cdFx0XHRsZXQgdGVtcEFucyA9IFwiXCI7XG5cblx0XHRcdGlmIChpZ25vcmUpIHtcblx0XHRcdFx0Ly8gcmVtb3ZpbmcgfmksaX4gZnJvbSB0aGUgZHJhZ2Fuc1xuXHRcdFx0XHRkcmFnQW5zID0gdG90YWxEcmFnW2pdLnJlcGxhY2UoL2l+fH5pL2csXCJcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkcm9wQW5zICs9IFwiSURcIiArIGRyYWdJRCArIFwiLFwiO1xuXHRcdFx0XHR0ZW1wQW5zID0gXCJJRFwiICsgZHJhZ0lEICsgXCIsXCI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIGZ1bmN0aW9uIGZvciBjaGVja2luZyBkdXBsaWNhdGUgdmFsdWVzXG5cdFx0XHRBSC5zZWxlY3RBbGwoQ2hlY2tEdXBsaWNhdGUpLmZvckVhY2goKGVsbSwgeik9PiB7XG5cdFx0XHRcdGlmIChDaGVja0R1cGxpY2F0ZVt6XS5hbnMgPT0gZHJhZ0Fucykge1xuXHRcdFx0XHRcdGlzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRpZiAoIWlnbm9yZSkge1xuXHRcdFx0XHRcdFx0ZHJvcEFucyA9ICBkcm9wQW5zLnJlcGxhY2UodGVtcEFucyxcIlwiKTtcblx0XHRcdFx0XHRcdGRyb3BBbnMgKz0gQ2hlY2tEdXBsaWNhdGVbel0uaWQrXCIsXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gaWYgdmFsdWUgaXMgbm90IGR1cGxpY2F0ZVxuXHRcdFx0aWYgKGlzRHVwbGljYXRlID09IGZhbHNlKSB7XG5cdFx0XHRcdENoZWNrRHVwbGljYXRlLnB1c2goe1xuXHRcdFx0XHRcdFwiYW5zXCI6ZHJhZ0Fucyxcblx0XHRcdFx0XHRcImlkXCI6XCJJRFwiK2RyYWdJRFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGlmIChpc0R1cGxpY2F0ZSA9PSBmYWxzZSkgZHJhZ0RhdGEgKz0gYDxkaXYgaWQ9XCJJRCR7ZHJhZ0lEfVwiIGRyYWdhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiIGNsYXNzPVwiZHJhZy1yZXNpemUgZHJhZ2FibGUga3NcIiBjYXB0aW9uPVwiJHtkcmFnQW5zLnJlcGxhY2UoL1xcI2NtL2dtaSxcIixcIikucmVwbGFjZSgvXFxcIi9nbWksXCIjZG91YmxlcXVvdGUjXCIpfVwiIHBhdGg9XCIvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvXCIgZHJhZy1zaW5nbGU9XCIke2RyYWdTaW5nbGV9XCIgYmdjb2xvcj1cIiNDQ0ZGQ0NcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6I0NDRkZDQztoZWlnaHQ6YXV0bzttYXgtd2lkdGg6JHttYXhXaWR0aH1weDtwYWRkaW5nOjNweCAxMHB4IDNweCAxMHB4OyBtYXJnaW46IDJweCAycHg7XCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+JHtkcmFnQW5zLnJlcGxhY2UoL1xcI2NtL2dtaSxcIixcIil9PC9kaXY+YDtcblx0XHRcdCBcblx0XHRcdGlmIChpc0R1cGxpY2F0ZSA9PSBmYWxzZSkgZHJhZ0lEKys7XG5cdFx0fSk7XG5cdFx0bGV0IHVzZXJBbnN3ZXIgPSBcIlwiO1xuXHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcblx0XHRpZiAodWFYTUwpIHtcblx0XHRcdGlmICh1YVhNTC5fdXNlckFucykge1xuXHRcdFx0XHQvLyBzdG9yaW5nIHRoZSB1c2VyYW5zIGF0dHJpYnV0ZSB2YWx1ZSBpbiB1c2VyYW5zd2VyXG5cdFx0XHRcdHVzZXJBbnN3ZXIgPSB1YVhNTC5fdXNlckFucztcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gYWRkaW5nIGluZm9ybWF0aW9uIGluIGh0bWxcblx0XHRsZXQgZHJvcCA9ICc8ZGl2IGlkPVwiZWxlbScraSsnXCIgdGFiaW5kZXg9XCIwXCIgZHJvcHpvbmU9XCIxXCIgY2xhc3M9XCJkcmFnLXJlc2l6ZSBkcm9wYWJsZSBrc1wiIHBhdGg9XCIvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvXCIgYW5za2V5PVwiJytkcm9wQW5zLnNsaWNlKDAsLTEpKydcIiBjYXB0aW9uPVwiXCIgdXNlcmFucz1cIicrdXNlckFuc3dlcisnXCIgZHJvcGVkPVwiJyt1c2VyQW5zd2VyKydcIiBiZ2NvbG9yPVwiI0ZGRkZDQ1wiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyMDQpOyBtaW4td2lkdGg6IDUwcHg7IGhlaWdodDogYXV0bzsgcGFkZGluZzogNXB4IDEwcHggNXB4O1wiPicrdXNlckFuc3dlcisnPC9kaXY+Jztcblx0XHQvLyByZXBsYWNlIHRoZSBjZGF0YVxuXHRcdGNkYXRhID0gY2RhdGEucmVwbGFjZShvcmlnaW5hbERhdGEsZHJvcCk7XG5cdFx0c3RhdGUuZm9vdGVyU3RyID0gdHJ1ZTtcblx0fVxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gZm9yIHNob3dpbmcgY29ycmVjdCBhbnN3ZXIuXG5cdGZ1bmN0aW9uIGNvcnJlY3RBbnN3ZXIoKSB7XG5cdFx0dWNGaWxsLnNob3dkcmFnYW5zKGFqYXhfZUlkLCAnYycsIDEpO1xuXHRcdEFILnNlbGVjdEFsbCgnLmNvcnJfZGl2JywgJ3Nob3cnKTtcblx0XHRBSC5zZWxlY3RBbGwoJy5yZW1lZF9kaXNhYmxlJywgJ3Nob3cnKTtcblx0XHRhdXRvcmVzaXplKDEpO1xuXHR9XG5cblx0Ly8gZm9yIHNob3dpbmcgdXNlciBhbnN3ZXIuXG5cdGZ1bmN0aW9uIHlvdXJBbnN3ZXIoKSB7XG5cdFx0dWNGaWxsLnNob3dkcmFnYW5zKGFqYXhfZUlkLCAndScsIDEpO1xuXHRcdEFILnNlbGVjdEFsbCgnLmNvcnJfZGl2JywgJ2hpZGUnKTtcblx0XHRhdXRvcmVzaXplKDEpO1xuXHR9XG5cblx0Ly9UbyBoYW5kbGUgcmV2aWV3IHRvZ2dsZVxuXHRmdW5jdGlvbiBoYW5kbGVSZXZpZXcobW9kZSwgZXZlbnQpIHtcblx0XHRpZiAobW9kZSA9PSAnYycpIHtcblx0XHRcdGNvcnJlY3RBbnN3ZXIoZXZlbnQpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHlvdXJBbnN3ZXIoZXZlbnQpO1xuXHRcdH1cblx0fVxuPC9zY3JpcHQ+XG5cdFxuPGRpdiBjbGFzcz17eG1sID8gXCJteC00IHBsLTIgcGwtbWQtMFwiOiBcIlwifT5cblx0eyNpZiBzdGF0ZS5pc01hdGhxdWlsbH1cblx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj17d2luZG93LnRoZW1lVXJsK1wicGUtaXRlbXMvc3ZlbHRlL2Nzcy9tYXRocXVpbGwuY3NzXCJ9IC8+XG5cdHsvaWZ9XG5cdDxJdGVtSGVscGVyIFxuXHRcdGJpbmQ6dGhpcz17c21Db250cm9sbGVyQ2FsbGJhY2t9XG5cdFx0b246c2V0UmV2aWV3ID0ge3NldFJldmlld31cblx0XHRvbjp1bnNldFJldmlldyA9IHt1bnNldFJldmlld31cblx0XHRoYW5kbGVSZXZpZXdDbGljaz17aGFuZGxlUmV2aWV3fVxuXHRcdHJldmlld01vZGU9e2lzUmV2aWV3fVxuXHQvPlxuXHQ8Y2VudGVyPlxuXHRcdDxkaXYgXG5cdFx0XHRpZD17Y29udGFpbmVySUR9XG5cdFx0XHRjbGFzcz1cImZpbGxtYWluIHtpc1JldmlldyA/ICdwZS1ub25lJyA6IG51bGx9XCJcblx0XHRcdG1hdGNodHlwZT17c3RhdGUubWF0Y2h0eXBlfVxuXHRcdFx0bXVsdGk9e3N0YXRlLm11bHRpfVxuXHRcdFx0aWdub3JldHlwZT17c3RhdGUuaWdub3JldHlwZX1cblx0XHRcdG1hbnVhbF9ncmFkZT17bWFudWFsX2dyYWRlIHx8IDB9XG5cdFx0XHR0b3RhbGNvcnJlY3RhbnM9e3N0YXRlLnRvdGFsY29ycmVjdGFuc31cblx0XHQ+XG5cdFx0XG5cdFx0XHQ8ZGl2IGNsYXNzPVwic3RyaW5nXCIgaWQ9XCJwcmV2aWV3QXJlYVwiIHN0eWxlPVwiZm9udC1mYW1pbHk6J1JvYm90bywgc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxZW1cIj48L2Rpdj5cblx0XHRcdHsjaWYgc3RhdGUuc2hvd1Rvb2xiYXJ9IFxuXHRcdFx0XHQ8RmlsbEluVGhlQmxhbmtzVG9vbGJhciAgXG5cdFx0XHRcdFx0c3BhbklkPXtzdGF0ZS5zcGFuSWR9IFxuXHRcdFx0XHRcdGRpdklkPXtzdGF0ZS5kaXZJZH0gXG5cdFx0XHRcdFx0YWN0aW9uPXt1Y0ZpbGwuZmlsbE1hdGhbZmlsbElkXX0gXG5cdFx0XHRcdFx0c2hvdz17dG9nZ2xlVG9vbGJhcn1cblx0XHRcdFx0Lz5cblx0XHRcdHsvaWZ9XG5cdFx0XHQ8ZGl2IHN0eWxlPVwiY29sb3I6ICNiOTRhNDg7IG1hcmdpbi10b3A6IDVweFwiIGNsYXNzPVwic21ub3Rlc1wiPlxuXHRcdFx0XHR7I2lmIHN0YXRlLm1hdGNodHlwZSA9PSBcIjBcIn1cblx0XHRcdFx0XHQqRXhhY3QgbWF0Y2hpbmcgaXMgcmVxdWlyZWQuXG5cdFx0XHRcdHs6ZWxzZX1cblx0XHRcdFx0XHQqTWF0Y2hpbmcgaXMgbm90IGNhc2Ugc2Vuc2l0aXZlLlxuXHRcdFx0XHR7L2lmfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZm9vdGVyU3RyXCIgc3R5bGU9XCJkaXNwbGF5OiB7c3RhdGUuZm9vdGVyU3RyID8gJ2Jsb2NrJyA6ICdub25lJ31cIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImFycm93LXVwXCI+PC9kaXY+XG5cdFx0XHRcdDxjZW50ZXIgY2xhc3M9XCJkcmFnQXJlYVwiPjwvY2VudGVyPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdDwvY2VudGVyPlxuPC9kaXY+XG48c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG5cdC8qQGltcG9ydCAnbGF5b3V0L3RoZW1lcy9ib290c3RyYXA0L3BlLWl0ZW1zL3N2ZWx0ZS9jc3MvYm9vdHN0cmFwNUJldGExLmNzcyc7ICovXG5cdDpnbG9iYWwoeG1wKSB7XG5cdFx0ZGlzcGxheTogaW5saW5lO1xuXHR9XG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdKSB7XG5cdFx0b3ZlcmZsb3c6aGlkZGVuO1xuXHRcdG1heC13aWR0aDoxMDI0cHg7XG5cdFx0dGV4dC1hbGlnbjpsZWZ0O1xuXHR9XG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIHByZSkge1xuXHRcdGJhY2tncm91bmQ6IG5vbmU7XG5cdFx0Ym9yZGVyOiBub25lO1xuXHRcdGZvbnQtc2l6ZTogMTRweCFpbXBvcnRhbnQ7XG5cdH1cblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLnN0cmluZykge1xuXHRcdG1pbi1oZWlnaHQ6NTBweDtcblx0XHRtYXJnaW4tdG9wOjEwcHg7XG5cdFx0bWFyZ2luLXJpZ2h0OjEwcHg7XG5cdH1cblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLmZvb3RlclN0cikge1xuXHRcdHBvc2l0aW9uOnJlbGF0aXZlO1xuXHRcdG1hcmdpbi10b3A6IDEwcHg7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogI2NjYztcblx0XHRwYWRkaW5nOiAxNXB4O1xuXHRcdG1pbi1oZWlnaHQ6IDYwcHg7LyoxMDBweDsqL1xuXHR9XG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5mb290ZXJTdHIgLmFycm93LXVwKSB7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdHRvcDogLTEwcHg7XG5cdFx0cmlnaHQ6IDUwJTtcblx0XHR3aWR0aDogMDtcblx0XHRoZWlnaHQ6IDA7XG5cdFx0Ym9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XG5cdFx0Ym9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuXHRcdGJvcmRlci1ib3R0b206IDEwcHggc29saWQgI2NjYztcblx0fVxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZmlsbC1yb3cpIHtcblx0XHRwYWRkaW5nOjZweDtcblx0fVxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZmlsbGVsZW1lbnQsIFtpZF49XCJmaWxsbWFpblwiXSAuZHJhZy1yZXNpemUpe1xuXHRcdGhlaWdodDozMHB4O1xuXHRcdGRpc3BsYXk6aW5saW5lLWJsb2NrO1xuXHRcdHBvc2l0aW9uOnJlbGF0aXZlO1xuXHRcdG1pbi1oZWlnaHQ6IDMwcHg7XG5cdFx0bWFyZ2luOiAxcHggMCAxcHggMDtcblx0XHR0b3A6IC0zcHg7XG5cdH1cblx0Omdsb2JhbCh0ZCAuZHJhZy1yZXNpemUpIHtcblx0XHR0b3A6IDAgIWltcG9ydGFudDtcblx0fVxuXHQ6Z2xvYmFsKHRkIC5maWxsZWxlbWVudCkge1xuXHRcdHRvcDogMHB4ICFpbXBvcnRhbnQ7XG5cdH1cblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gaW5wdXRbdHlwZT1cInRleHRcIl0sIFtpZF49XCJmaWxsbWFpblwiXSBzZWxlY3QpIHtcdFxuXHRcdGhlaWdodDo5OSUhaW1wb3J0YW50O1xuXHRcdHJlc2l6ZTogbm9uZTtcblx0XHRmb250LXNpemU6MTJweDtcblx0XHRjb2xvcjogIzAwMDtcblx0XHRtYXgtd2lkdGg6IDgwMHB4O1xuXHR9XG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5kcmFnLXJlc2l6ZSkge1xuXHRcdHZlcnRpY2FsLWFsaWduOm1pZGRsZTtcblx0XHRib3JkZXI6MXB4IHNvbGlkICMzMUI3MzE7XG5cdFx0dGV4dC1hbGlnbjpjZW50ZXI7XG5cdFx0cGFkZGluZzozcHg7XG5cdFx0Zm9udC1zaXplOiAxNHB4O1xuXHR9XG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5kcmFnLXJlc2l6ZS51aS1kcmFnZ2FibGUpIHtcblx0XHRjdXJzb3I6bW92ZTtcblx0fVxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZHJvcC1ob3Zlcikge1xuXHRcdGJvcmRlcjogMXB4IGRhc2hlZCByZWQhaW1wb3J0YW50O1xuXHRcdGJveC1zaGFkb3c6IDAgMCAwIDJweCB5ZWxsb3cgaW5zZXQ7XG5cdFx0b3V0bGluZTogMXB4IHNvbGlkIGJsdWU7XG5cdH1cblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLmZpbGxjaGVjayB1bCkge1xuXHRcdHdpZHRoOjIyMHB4O1xuXHR9XG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5maWxsY2hlY2sgbGkuc2VsZWN0ZWQpIHtcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjRTVFNUU1O1xuXHR9XG5cdDpnbG9iYWwoLmZpbGxjaGVjayAuc2VsZWN0ZWQgLmljb21vb24tY2hlY2ttYXJrLTM6YmVmb3JlKSB7XG5cdFx0ZmxvYXQ6IGxlZnQ7XG5cdFx0Y29sb3I6IGJsdWU7XG5cdFx0cGFkZGluZzogM3B4O1xuXHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0XHRyaWdodDogMTRweDtcblx0fVxuXHQ6Z2xvYmFsKC5maWxsY2hlY2sgLmljb21vb24tY2xvc2UtMjpiZWZvcmUpIHtcblx0XHRmbG9hdDogbGVmdDtcblx0XHRjb2xvcjogYmx1ZTtcblx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0cmlnaHQ6IDE0cHg7XG5cdFx0Zm9udC1zaXplOiAyMHB4O1xuXHR9XG5cdDpnbG9iYWwoLk1hdGhKYXhfRGlzcGxheSkge1xuXHRcdFx0ZGlzcGxheSA6IGlubGluZSFpbXBvcnRhbnQ7XG5cdH1cblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLnNlbGVjdCkge1xuXHRcdGZvbnQtc2l6ZTogMTVweDtcblx0fVxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAudGV4dGFyZWEpIHtcblx0XHR2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuXHRcdGJvcmRlci1yYWRpdXM6M3B4O1xuXHRcdGJhY2tncm91bmQ6I2ZmZTtcblx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpO1xuXHRcdGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMDc1KTtcblx0fVxuXHQ6Z2xvYmFsKC51aS1kcmFnZ2FibGUtZGlzYWJsZWQpIHtcblx0XHRjdXJzb3I6IG5vLWRyb3AhaW1wb3J0YW50O1xuXHRcdG9wYWNpdHk6IDAuNSFpbXBvcnRhbnQ7XG5cdH1cblx0Omdsb2JhbCguc2VsKSB7XG5cdFx0Ym9yZGVyIDoycHggc29saWQgI0ZGMDAwMCFpbXBvcnRhbnQ7XG5cdH1cblx0Omdsb2JhbCguYmxhIFtpZF49XCJmaWxsbWFpblwiXSAuZHJhZ2FibGU6Zm9jdXMsIC5ibGEgW2lkXj1cImZpbGxtYWluXCJdIC5kcm9wYWJsZTpmb2N1cykge1xuXHRcdGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDFweCB0cmFuc3BhcmVudCwgaW5zZXQgMCAwIDAgMXB4ICNmZmZmZmYsIGluc2V0IDAgMCAwIDJweCAjZmZmO1xuXHRcdG91dGxpbmU6IG5vbmU7XG5cdH1cblxuXHQ6Z2xvYmFsKC5oaWdobGlnaHRfbWFpbikge1xuXHRcdGJvcmRlciA6IDFweCBkYXNoZWQgIzAwMDtcblx0fVxuXG5cdDpnbG9iYWwoLmNvcGllZGNscikge1xuXHRcdGJhY2tncm91bmQtY29sb3I6ICNDQ0MhaW1wb3J0YW50O1xuXHR9XG5cblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gc2VsZWN0OjotbXMtZXhwYW5kKSB7XG5cdFx0bWFyZ2luLWxlZnQ6IDJweDtcblx0fVxuXHQ6Z2xvYmFsKC5maWxsaW50aGVibGFuaykge1xuXHRcdGhlaWdodDogMzBweDtcblx0XHRwYWRkaW5nOiA1cHggMTBweDtcblx0XHRmb250LXNpemU6IDE0cHg7XG5cdFx0bWFyZ2luLWJvdHRvbTozcHg7XG5cdFx0bGluZS1oZWlnaHQ6IDIwcHg7XG5cdFx0LXdlYmtpdC1ib3JkZXItcmFkaXVzOiAzcHg7XG5cdFx0LW1vei1ib3JkZXItcmFkaXVzOiAzcHg7XG5cdFx0Ym9yZGVyLXJhZGl1czogM3B4O1xuXHRcdGNvbG9yOiAjNTU1O1xuXHRcdGJhY2tncm91bmQtY29sb3I6ICNGRkU7XG5cdFx0dmVydGljYWwtYWxpZ246IG1pZGRsZTtcblx0XHRiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xuXHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0Zm9udC1mYW1pbHk6IEhlbHZldGljYSxBcmlhbCwnVGltZXMgTmV3IFJvbWFuJyxWZXJkYW5hLHNhbnMtc2VyaWY7XG5cdFx0LXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSk7XG5cdFx0Ym94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpO1xuXHRcdC13ZWJraXQtdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIGVhc2UtaW4tb3V0IC4xNXMsYm94LXNoYWRvdyBlYXNlLWluLW91dCAuMTVzO1xuXHRcdHRyYW5zaXRpb246IGJvcmRlci1jb2xvciBlYXNlLWluLW91dCAuMTVzLGJveC1zaGFkb3cgZWFzZS1pbi1vdXQgLjE1cztcblx0fVxuXG5cdDpnbG9iYWwoLmZpbGxpbnRoZWJsYW5rOmZvY3VzKSB7XG5cdFx0Ym9yZGVyLWNvbG9yOiByZ2JhKDgyLDE2OCwyMzYsMC44KTtcblx0XHRvdXRsaW5lOiAwO1xuXHRcdC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpLDAgMCA4cHggcmdiYSg4MiwxNjgsMjM2LDAuNik7XG5cdFx0LW1vei1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSksMCAwIDhweCByZ2JhKDgyLDE2OCwyMzYsMC42KTtcblx0XHRib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSksMCAwIDhweCByZ2JhKDgyLDE2OCwyMzYsMC42KTtcblx0fVxuXHQ6Z2xvYmFsKC5jb3JyZWN0X2luY29ycmVjdF9pY29uX2ZpbGwpIHtcblx0XHRwb3NpdGlvbjphYnNvbHV0ZTtcblx0XHR3aWR0aDoxN3B4O1xuXHRcdGhlaWdodDoxOHB4O1xuXHRcdHJpZ2h0Oi00cHg7XG5cdFx0dG9wOi03cHg7XG5cdFx0Zm9udC1zaXplOiAxN3B4O1xuXHRcdHdoaXRlLXNwYWNlOiBub3JtYWwgIWltcG9ydGFudDtcblx0XHR6LWluZGV4OiA5ICFpbXBvcnRhbnQ7XG5cdH1cblx0Omdsb2JhbCguY29ycl9kaXYpIHtcblx0XHRkaXNwbGF5OiBub25lO1xuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHR3aWR0aDogMTAwJTtcblx0XHRoZWlnaHQ6IDEwMCU7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogIzIxYTgxZDtcblx0XHRjb2xvcjogI2ZmZmZmZjtcblx0XHR0b3A6IDAlO1xuXHRcdHBhZGRpbmctdG9wOiA0cHg7XG5cdFx0Ym9yZGVyLXJhZGl1czogM3B4O1xuXHRcdGN1cnNvcjogbm9uZSAhaW1wb3J0YW50O1xuXHR9XG5cdDpnbG9iYWwoLmF1dG9faGVpZ2h0KSB7XG5cdFx0aGVpZ2h0OmF1dG8haW1wb3J0YW50O1xuXHR9XG5cdDpnbG9iYWwoLnByZXR0eXByaW50KSB7XG5cdFx0ZGlzcGxheTogLW1zLWdyaWQhaW1wb3J0YW50O1xuXHR9XG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxNUJTLEdBQUcsQUFBRSxDQUFDLEFBQ2IsT0FBTyxDQUFFLE1BQU0sQUFDaEIsQ0FBQyxBQUNPLGdCQUFnQixBQUFFLENBQUMsQUFDMUIsU0FBUyxNQUFNLENBQ2YsVUFBVSxNQUFNLENBQ2hCLFdBQVcsSUFBSSxBQUNoQixDQUFDLEFBQ08sb0JBQW9CLEFBQUUsQ0FBQyxBQUM5QixVQUFVLENBQUUsSUFBSSxDQUNoQixNQUFNLENBQUUsSUFBSSxDQUNaLFNBQVMsQ0FBRSxJQUFJLFVBQVUsQUFDMUIsQ0FBQyxBQUNPLHdCQUF3QixBQUFFLENBQUMsQUFDbEMsV0FBVyxJQUFJLENBQ2YsV0FBVyxJQUFJLENBQ2YsYUFBYSxJQUFJLEFBQ2xC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 */";
	append_dev(document_1.head, style);
}

// (872:1) {#if state.isMathquill}
function create_if_block_2(ctx) {
	let link;
	let link_href_value;

	const block = {
		c: function create() {
			link = element("link");
			attr_dev(link, "rel", "stylesheet");
			attr_dev(link, "href", link_href_value = window.themeUrl + "pe-items/svelte/css/mathquill.css");
			add_location(link, file, 872, 2, 30532);
		},
		m: function mount(target, anchor) {
			insert_dev(target, link, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(link);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(872:1) {#if state.isMathquill}",
		ctx
	});

	return block;
}

// (894:3) {#if state.showToolbar}
function create_if_block_1(ctx) {
	let fillintheblankstoolbar;
	let current;

	fillintheblankstoolbar = new FillInTheBlanksToolbar({
			props: {
				spanId: /*state*/ ctx[5].spanId,
				divId: /*state*/ ctx[5].divId,
				action: /*ucFill*/ ctx[3].fillMath[/*fillId*/ ctx[6]],
				show: /*toggleToolbar*/ ctx[10]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(fillintheblankstoolbar.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(fillintheblankstoolbar, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const fillintheblankstoolbar_changes = {};
			if (dirty[0] & /*state*/ 32) fillintheblankstoolbar_changes.spanId = /*state*/ ctx[5].spanId;
			if (dirty[0] & /*state*/ 32) fillintheblankstoolbar_changes.divId = /*state*/ ctx[5].divId;
			if (dirty[0] & /*ucFill*/ 8) fillintheblankstoolbar_changes.action = /*ucFill*/ ctx[3].fillMath[/*fillId*/ ctx[6]];
			fillintheblankstoolbar.$set(fillintheblankstoolbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fillintheblankstoolbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fillintheblankstoolbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(fillintheblankstoolbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(894:3) {#if state.showToolbar}",
		ctx
	});

	return block;
}

// (905:4) {:else}
function create_else_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("*Matching is not case sensitive.");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(905:4) {:else}",
		ctx
	});

	return block;
}

// (903:4) {#if state.matchtype == "0"}
function create_if_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("*Exact matching is required.");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(903:4) {#if state.matchtype == \\\"0\\\"}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div5;
	let t0;
	let itemhelper;
	let t1;
	let center1;
	let div4;
	let div0;
	let t2;
	let t3;
	let div1;
	let t4;
	let div3;
	let div2;
	let t5;
	let center0;
	let div4_class_value;
	let div4_matchtype_value;
	let div4_multi_value;
	let div4_ignoretype_value;
	let div4_manual_grade_value;
	let div4_totalcorrectans_value;
	let div5_class_value;
	let current;
	let if_block0 = /*state*/ ctx[5].isMathquill && create_if_block_2(ctx);

	let itemhelper_props = {
		handleReviewClick: /*handleReview*/ ctx[11],
		reviewMode: /*isReview*/ ctx[0]
	};

	itemhelper = new ItemHelper({ props: itemhelper_props, $$inline: true });
	/*itemhelper_binding*/ ctx[16](itemhelper);
	itemhelper.$on("setReview", /*setReview*/ ctx[8]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[9]);
	let if_block1 = /*state*/ ctx[5].showToolbar && create_if_block_1(ctx);

	function select_block_type(ctx, dirty) {
		if (/*state*/ ctx[5].matchtype == "0") return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block2 = current_block_type(ctx);

	const block = {
		c: function create() {
			div5 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			create_component(itemhelper.$$.fragment);
			t1 = space();
			center1 = element("center");
			div4 = element("div");
			div0 = element("div");
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			div1 = element("div");
			if_block2.c();
			t4 = space();
			div3 = element("div");
			div2 = element("div");
			t5 = space();
			center0 = element("center");
			attr_dev(div0, "class", "string");
			attr_dev(div0, "id", "previewArea");
			set_style(div0, "font-family", "'Roboto, sans-serif; font-size: 1em");
			add_location(div0, file, 892, 3, 31062);
			set_style(div1, "color", "#b94a48");
			set_style(div1, "margin-top", "5px");
			attr_dev(div1, "class", "smnotes");
			add_location(div1, file, 901, 3, 31358);
			attr_dev(div2, "class", "arrow-up");
			add_location(div2, file, 909, 4, 31642);
			attr_dev(center0, "class", "dragArea");
			add_location(center0, file, 910, 4, 31675);
			attr_dev(div3, "class", "footerStr");
			set_style(div3, "display", /*state*/ ctx[5].footerStr ? "block" : "none");
			add_location(div3, file, 908, 3, 31560);
			attr_dev(div4, "id", /*containerID*/ ctx[7]);
			attr_dev(div4, "class", div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? "pe-none" : null));
			attr_dev(div4, "matchtype", div4_matchtype_value = /*state*/ ctx[5].matchtype);
			attr_dev(div4, "multi", div4_multi_value = /*state*/ ctx[5].multi);
			attr_dev(div4, "ignoretype", div4_ignoretype_value = /*state*/ ctx[5].ignoretype);
			attr_dev(div4, "manual_grade", div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0);
			attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value = /*state*/ ctx[5].totalcorrectans);
			add_location(div4, file, 882, 2, 30810);
			add_location(center1, file, 881, 1, 30799);
			attr_dev(div5, "class", div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "");
			add_location(div5, file, 870, 0, 30461);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			if (if_block0) if_block0.m(div5, null);
			append_dev(div5, t0);
			mount_component(itemhelper, div5, null);
			append_dev(div5, t1);
			append_dev(div5, center1);
			append_dev(center1, div4);
			append_dev(div4, div0);
			append_dev(div4, t2);
			if (if_block1) if_block1.m(div4, null);
			append_dev(div4, t3);
			append_dev(div4, div1);
			if_block2.m(div1, null);
			append_dev(div4, t4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div3, t5);
			append_dev(div3, center0);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*state*/ ctx[5].isMathquill) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					if_block0.m(div5, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);

			if (/*state*/ ctx[5].showToolbar) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty[0] & /*state*/ 32) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div4, t3);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block2.d(1);
				if_block2 = current_block_type(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(div1, null);
				}
			}

			if (!current || dirty[0] & /*state*/ 32) {
				set_style(div3, "display", /*state*/ ctx[5].footerStr ? "block" : "none");
			}

			if (!current || dirty[0] & /*isReview*/ 1 && div4_class_value !== (div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? "pe-none" : null))) {
				attr_dev(div4, "class", div4_class_value);
			}

			if (!current || dirty[0] & /*state*/ 32 && div4_matchtype_value !== (div4_matchtype_value = /*state*/ ctx[5].matchtype)) {
				attr_dev(div4, "matchtype", div4_matchtype_value);
			}

			if (!current || dirty[0] & /*state*/ 32 && div4_multi_value !== (div4_multi_value = /*state*/ ctx[5].multi)) {
				attr_dev(div4, "multi", div4_multi_value);
			}

			if (!current || dirty[0] & /*state*/ 32 && div4_ignoretype_value !== (div4_ignoretype_value = /*state*/ ctx[5].ignoretype)) {
				attr_dev(div4, "ignoretype", div4_ignoretype_value);
			}

			if (!current || dirty[0] & /*manual_grade*/ 2 && div4_manual_grade_value !== (div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0)) {
				attr_dev(div4, "manual_grade", div4_manual_grade_value);
			}

			if (!current || dirty[0] & /*state*/ 32 && div4_totalcorrectans_value !== (div4_totalcorrectans_value = /*state*/ ctx[5].totalcorrectans)) {
				attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value);
			}

			if (!current || dirty[0] & /*xml*/ 4 && div5_class_value !== (div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "")) {
				attr_dev(div5, "class", div5_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			if (if_block0) if_block0.d();
			/*itemhelper_binding*/ ctx[16](null);
			destroy_component(itemhelper);
			if (if_block1) if_block1.d();
			if_block2.d();
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

function autoresize(flag) {
	let ftb_textarea = document.querySelectorAll(".textarea.ks");

	for (let i = 0; i < ftb_textarea.length; i++) {
		let e = ftb_textarea[i];

		var timer = setTimeout(
			function () {
				e.style.cssText = "height:auto;overflow: auto;";
				if (flag) if (window.isIE) e.style.cssText = "height:" + (e.scrollHeight + 10) + "px;overflow: hidden"; else e.style.cssText = "height:" + e.scrollHeight + "px;overflow: hidden";
				clearTimeout(timer);
			},
			100
		);
	}
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("FillInTheBlanksPreview", slots, []);
	let { manual_grade } = $$props;
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let { editorState } = $$props;
	let { smValidate } = $$props;
	let { showAns } = $$props;

	// variable declaration
	let smControllerCallback;

	let cdata = "";
	let dragData = "";
	let CheckDuplicate = [];
	let dragID = 0;
	let errorCatchFlag = 1;
	let fillMath = [];
	let fillId;
	let parsedXml = {};
	let parsedUxml = {};
	let containerID = "fillmain";
	globalThis.ajax_eId = "#fillmain";
	let state = {};

	let hdd = writable({
		matchtype: "0",
		ignoretype: "",
		multi: "",
		totalcorrectans: 0,
		showToolbar: false,
		isMathquill: false,
		fillMath: [],
		footerStr: false
	});

	const unsubscribe = hdd.subscribe(items => {
		$$invalidate(5, state = items);
	});

	onMount(() => {
		window.J = jquery;
		ucFill.setUpdate(updateModule.bind(this));
		AH.addScript("", editor.baseUrlTheme + "pe-items/svelte/clsSMFill/libs/mathQuill_new.js");
		let mathItem = document.getElementById(containerID);

		mathItem = mathItem
		? mathItem.getElementsByClassName("mathquill")
		: mathItem;

		if (state.isMathquill) {
			AH.selectAll("div" + ajax_eId, "css", { "overflow": "auto" });
		}

		// Binding the events 
		AH.bind(ajax_eId, "click", displayAns);

		AH.bind(ajax_eId, "keyup", displayAns);
		AH.bind(ajax_eId, "change", displayAns);
		AH.listen(document, "click", "span.mq-editable-field.mq-focused", oneditoFocused);
		AH.listen(document, "change", "span.mq-editable-field.mq-focused", oneditoFocused);

		// for loading the module on the basis of the updated the xml
		loadModule();
	});

	/*
** This function will call when compent recieving new prop in other words whenever 
** any thing changes in xml this function will call automatically
*/
	beforeUpdate(nextProps => {
		// check for the remediation mode 
		// if the remediation mode is on
		// if (isReview) {
		// 	// show the ansert by calling the setReview function
		// 	setReview();
		// } else {
		// 	unsetReview()
		// }
		// for checking that there is change in the xml
		if (xml != state.xml) {
			if (editorState && editorState.stopPreviewUpdate == true) return false;

			// for loading the module on the basis of the updated the xml
			loadModule();

			// for adding the tabindex
			setTimeout(
				function () {
					let node = document.getElementById("previewArea");

					if (node.childNodes[0] && node.childNodes[0].nodeName == "TABLE") {
						node = document.querySelectorAll("#previewArea td");

						for (let item in node) {
							if (!node[item].firstElementChild && node[item].nodeName == "TD") {
								//console.log(node[item].childNodes[0].nodeType);
								node[item].setAttribute("tabindex", "0");
							}
						}
					} else {
						for (let item in node.childNodes) {
							if (node.childNodes[item].nodeType == 3) {
								let txt = document.createElement("span");
								txt.setAttribute("tabindex", "0");
								txt.innerHTML = node.childNodes[item].textContent;
								node.childNodes[item].replaceWith(txt);
							} //node.childNodes[item].nodeValue = <span tabinde="0">{}</span>;
						}
					}
				},
				1000
			);
		}
	});

	// for loading the module initially 	
	function loadModule() {
		$$invalidate(5, state.xml = xml, state);

		// converting the xml to json using XMLToJSON function
		parsedXml = XMLToJSON(xml);

		// checking for user ans
		if (uxml) {
			if (!window.isResetMath) {
				console.warn("uxml loaded", window.isResetMath);
				parsedUxml = XMLToJSON(uxml);
				$$invalidate(5, state.uxml = uxml, state);
			} else {
				console.warn("Uxml not loaded", window.isResetMath);
				window.isResetMath = false;
			}
		}

		// parsing the authoring xml
		parseXmlAuthoring(parsedXml, parsedUxml);

		ucFill.showdragans(ajax_eId, "u");

		if (!xml) {
			let errMsg = smVal.validate(editorState.content_type, editorState.subtype, editorState.content_icon);
			smValidate(errMsg);
		}
	}

	function updateUserAns(parsedUans) {
		let uaXMLNew = "";

		// finding the correct ans
		let answerKey = parsedXml.smxml.text.__cdata.match(/%{[\s\S]*?}%/gm);

		let answerType = "";

		// if correct answer is found traverseing each correct ans
		if (answerKey) {
			answerKey.forEach((currentAns, i) => {
				// checking for the user ans
				if (parsedUans) {
					if (parsedUans.smans) {
						let uans = parsedUans.smans.div;

						if (Array.isArray(uans) == false) {
							uans = [];
							uans[0] = parsedUans.smans.div;
						}

						if (uans) {
							uaXMLNew = uans[i];
						}
					}
				}

				// finding the type by finding the match with string containing | in the start and end with }%
				answerType = currentAns.match(/\|(.*?)}%$/gm);

				// removing the | symbol and }% and save the remaining thing in answerType if match is found otherwise kept the answerType balnk
				answerType = answerType ? answerType[0].replace(/\||}%/gm, "") : "";

				answerType = answerType.trim();

				if (uaXMLNew && uaXMLNew._userAns) {
					// storing the userans attribute value in useranswer
					let id = "";

					if (answerType == "" || answerType == "c") {
						// For textbox
						id = `#elem${i} .fillintheblank`;
					} else if (answerType == "n") {
						// if the type is numeric
						id = `#elem${i} .fillintheblank`;
					} else if (answerType == "d" || answerType == "ds") {
						// checking for the user ans
						id = `#elem${i}`;
					} else if (answerType == "s") ; else if (answerType == "e") {
						id = `#elem${i}`; // checking createSelectBox for the user ans
					} else if (answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
						// For multiline 
						id = `#elem${i} .textarea`;
					}

					if (AH.isValid(id) && document.querySelector(id)) {
						document.querySelector(id).setAttribute("userans", uaXMLNew._userAns);
					} //console.log(currentAns, id, answerType, uaXMLNew._userAns);
				}
			});
		}
	}

	// this function responsible for parsing the xml 
	function parseXmlAuthoring(MYXML, uaXML = false) {
		// fetching the cdata
		cdata = MYXML.smxml.text.__cdata;

		dragData = "";
		CheckDuplicate = [];
		dragID = 0;
		$$invalidate(5, state.footerStr = false, state);
		AH.selectAll(".smnotes", "hide");

		// converting the matchType to matchtype
		if (MYXML.smxml.text._matchType) {
			MYXML.smxml.text._matchtype = MYXML.smxml.text._matchType;
			delete MYXML.smxml.text._matchType;
		}

		// converting the ignoreType to ignoretype
		if (MYXML.smxml.text._ignoreType) {
			MYXML.smxml.text._ignoretype = MYXML.smxml.text._ignoreType;
			delete MYXML.smxml.text._ignoreType;
		}

		// setting state 
		$$invalidate(5, state.matchtype = MYXML.smxml.text._matchtype, state);

		$$invalidate(5, state.ignoretype = MYXML.smxml.text._ignoretype, state);
		$$invalidate(5, state.multi = MYXML.smxml.text._multiple == "multiple" ? "1" : "", state);

		// finding the correct ans
		let answerKey = cdata.match(/%{[\s\S]*?}%/gm);

		let answerType = "";
		let uaXMLNew = "";
		let totalMarks = 0;

		// if correct answer is found traverseing each correct ans
		if (answerKey) {
			answerKey.forEach((v, i) => {
				totalMarks++;

				// checking for the user ans
				if (uaXML) {
					if (uaXML.smans) {
						let uans = uaXML.smans.div;

						if (Array.isArray(uans) == false) {
							uans = [];
							uans[0] = uaXML.smans.div;
						}

						if (uans) {
							uaXMLNew = uans[i];
						}
					}
				}

				let originalKey = answerKey[i];

				// finding the type by finding the match with string containing | in the start and end with }%
				answerType = answerKey[i].match(/\|(.*?)}%$/gm);

				// removing the | symbol and }% and save the remaining thing in answerType if match is found otherwise kept the answerType balnk
				answerType = answerType ? answerType[0].replace(/\||}%/gm, "") : "";

				answerType = answerType.trim();

				// in case of textbox or codetype
				if (answerType == "" || answerType == "c") {
					AH.selectAll(".smnotes", "show");

					// checking for the user ans
					if (uaXMLNew) {
						// create the textbox in the preview area with user ans
						createTextbox(originalKey, i, uaXMLNew);
					} else {
						// create the textbox in the preview area
						createTextbox(originalKey, i);
					}
				} else if (answerType == "n") {
					// if the type is numeric
					// checking for the user ans
					if (uaXMLNew) {
						// create the numeric textbox in the preview area with user ans
						createNumericbox(originalKey, i, uaXMLNew);
					} else {
						// create the numeric textbox in the preview area
						createNumericbox(originalKey, i);
					}
				} else if (answerType == "d" || answerType == "ds") {
					// checking for the user ans
					if (uaXMLNew) {
						// create the drag & drop textbox in the preview area with user ans
						createDragDrop(originalKey, i, uaXMLNew);
					} else {
						// create the drag & drop textbox in the preview area
						createDragDrop(originalKey, i);
					}
				} else if (answerType == "s") {
					// checking for the user ans
					if (uaXMLNew) {
						// create the select box in the preview area with user ans
						createSelectBox(originalKey, i, uaXMLNew);
					} else {
						// create the select box in the preview area
						createSelectBox(originalKey, i);
					}
				} else if (answerType == "e") {
					$$invalidate(5, state.isMathquill = true, state);

					// checking for the user ans
					if (uaXMLNew) {
						// creating textbox with user ans in preview area
						createMathDiv(originalKey, i, uaXMLNew);
					} else {
						// creating textbox in preview area
						createMathDiv(originalKey, i);
					}
				} else if (answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
					AH.selectAll(".smnotes", "show");

					// checking for the user ans
					if (uaXMLNew) {
						// create the textarea in the preview area with user ans
						createMultilineBox(originalKey, i, uaXMLNew);
					} else {
						// create the textarea in the preview area
						createMultilineBox(originalKey, i);
					}
				}

				let innerKey = originalKey.replace("%{", "").replace("}%", "");
			});
		}

		AH.selectAll("#" + containerID, "attr", { "totalcorrectans": totalMarks });

		// Resolve html entity
		cdata = AH.ignoreEnity(cdata);

		// put the cdata in the previewarea
		AH.find("#" + containerID, "#previewArea", { action: "html", actionData: cdata });

		// put the dragData in the dragarea
		AH.find("#" + containerID, ".dragArea", { action: "html", actionData: dragData });

		let parent = AH.find("#" + containerID, ".dragArea");
		let divs = (parent?.children) ? Array.from(parent.children) : [];

		while (divs.length) {
			parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
		}

		// set the max width of the textbox
		setMaxWidth();

		setSMNotes();
		runModule();

		var timer = setTimeout(
			function () {
				if (AH.find(ajax_eId, ".prettyprint", "all").length >= 1) {
					if (AH.find(ajax_eId, ".prettyprint .L0", "all").length == 0) {
						if (typeof prettyPrint == "function") {
							/*code to prevent pretty print existing pretified code 04/02/2018*/
							AH.selectAll(".prettyprint").forEach(_this => {
								_this.classList.add("prettyprintReplica");
								_this.classList.remove("prettyprint");
							});

							AH.selectAll(".linenums").forEach(_this => {
								_this.classList.add("linenumsReplica");
								_this.classList.remove("linenums");
							});

							AH.find(ajax_eId, ".prettyprintReplica").forEach(_this => {
								_this.classList.add("prettyprint");
							});

							AH.find(ajax_eId, ".linenumsReplica").forEach(_this => {
								_this.classList.add("linenums");
							});

							/********/
							prettyPrint();

							/*code to prevent pretty print existing pretified code 04/02/2018*/
							AH.selectAll(".prettyprintReplica").forEach(_this => {
								_this.classList.add("prettyprint");
								_this.classList.remove("prettyprintReplica");
							});

							AH.selectAll(".linenumsReplica").forEach(_this => {
								_this.classList.add("linenums");
								_this.classList.remove("linenumsReplica");
							});
						} /*******/
					}
				}

				clearTimeout(timer);
			},
			2000
		);

		if (AH.find(ajax_eId, "table.uc-table", "all").length > 0) {
			AH.find(ajax_eId, "table.uc-table", { action: "addClass", actionData: "font14" });

			try {
				// for removing br
				if (AH.find(ajax_eId, "table.uc-table").previousElementSibling?.nodeName == "BR") {
					AH.find(ajax_eId, "table.uc-table").previousElementSibling.remove();
				}
			} catch(e) {
				console.warn(e);
			}
		}
	}

	// function calls when remediation mode is on
	function setReview() {
		$$invalidate(0, isReview = true);

		// For mathqul based 
		if (xml.includes("user Response{")) window.isResetMath = true;

		$$invalidate(5, state.showToolbar = false, state);

		// show the answer and also bind the keys event for ada
		ucFill.modeOn("on");

		ucFill.showdragans(ajax_eId, "u", 1);
		AH.selectAll(".remed_disable", "show");
		autoresize(1);
		let mathItem = document.getElementById(containerID);

		mathItem = mathItem
		? mathItem.getElementsByClassName("mathquill")
		: mathItem;

		if (mathItem) {
			AH.setCss(ajax_eId, { "position": "relative" });
			AH.insert(ajax_eId, "<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>", "afterbegin");
		}
	} // for editor
	// ucFill.modeOn("on");

	// state.showToolbar = false;
	// ucFill.showdragans(ajax_eId, 'u', 1);
	// smControllerCallback.activeYourAnswer();
	// AH.selectAll('.corr_div', 'hide');
	// AH.selectAll('.remed_disable','show');
	// function calls when remediation mode is off
	function unsetReview() {
		$$invalidate(0, isReview = false);
		AH.selectAll(".mathquill", "css", { "border": "none" });
		ucFill.modeOn();
		AH.selectAll(".remed_disable, .corr_div", "hide");
		ucFill.showdragans(ajax_eId, "u", 0);
		let mathItem = document.getElementById(containerID);

		mathItem = mathItem
		? mathItem.getElementsByClassName("mathquill")
		: mathItem;

		autoresize();

		if (mathItem) {
			AH.selectAll(ajax_eId, "css", { "position": "unset" });
			AH.selectAll(".spinner-wrapper", "remove");
		}
	} // if the remediation mode if off in editor
	// ucFill.modeOn();

	// for displaying the answer
	function displayAns() {
		// check the ans and create user ans
		let ans = ucFill.checkAns(ajax_eId);

		if (editorState) {
			showAns(ans);
		}
	}

	// for toggling the toolbar in case of math module
	function toggleToolbar(value) {
		$$invalidate(5, state.showToolbar = value, state);
	}

	function oneditoFocused(x, event) {
		let isFillId = true;
		let fillId;

		while (isFillId) {
			x = x.parentElement;

			if (x.getAttribute("id")) {
				isFillId = false;
				fillId = x.getAttribute("id");
			}
		}

		let latexArray = [];

		AH.selectAll("#" + fillId + " span.mq-editable-field").forEach(element => {
			let commandId = x.getAttribute("mathquill-command-id");
			latexArray.push(commandId);
		});

		let mathId = x.getAttribute("mathquill-command-id");
		let indexId = latexArray.indexOf(mathId);
		$$invalidate(5, state.spanId = indexId, state);
		$$invalidate(5, state.divId = fillId, state);
		$$invalidate(5, state.showToolbar = true, state);
	}

	function updateModule(key, value) {
		$$invalidate(5, state[key] = value, state);

		if (key == "uxml") {
			parsedUxml = XMLToJSON(state.uxml);

			// parsing the authoring xml
			updateUserAns(parsedUxml);
		}
	}

	// for giving the uc-table style
	function setSMNotes() {
		if (AH.find(ajax_eId, "table.uc-table", "all").length > 0) {
			let tableWidth = AH.find(ajax_eId, "table.uc-table").clientWidth + 9;

			AH.setCss(AH.find(ajax_eId, ".smnotes"), {
				"width": tableWidth + "px",
				"margin": "auto",
				"padding-top": "5px"
			});
		}
	}

	// for adding the event to select and add drag and drop functionality to element
	function runModule() {
		try {
			console.log("runmodule");

			// for adding the event to select and add drag and drop functionality to element
			ucFill.readyFill(ajax_eId);
		} catch(e) {
			if (errorCatchFlag <= 100) {
				var timer = setTimeout(
					() => {
						runModule();
						clearTimeout(timer);
					},
					50
				);
			} else {
				console.warn("Error at runModule function");
			}

			errorCatchFlag++;
		}
	}

	// for setting maximum width of the drag area
	function setMaxWidth() {
		let maxDragDropWidth = [];

		AH.selectAll(".dragArea div").forEach((_this, i) => {
			maxDragDropWidth.push(_this.innerHTML.length * 10 + 30);
		});

		AH.selectAll("#previewArea [id^=elem]").forEach(_this => {
			if (_this.classList.contains("drag-resize")) {
				AH.setCss(_this, {
					"max-width": Math.max(...maxDragDropWidth)
				});
			}
		});
	}

	/**
 * This six function responsible for creating the input area in the
 * Preview section on the basis of the authoring xml
*/
	function createMathDiv(data, i, uaXML = false) {
		let originalData = data;

		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g, "");

		// splitting it with |
		data = data.split("|");

		// replacing the user Response in MathQuillMathField
		let addMathquill = data[0].replace(/user Response/g, "\\MathQuillMathField");

		// then spliting with ##
		let splitData = addMathquill.split("##");

		let randomKey = Math.floor(Math.random() * splitData.length);

		// taking random option
		let randomOption = splitData[randomKey];

		// storing the randomOption in userasn by replacing the MathQuillMathField{(any value)} to MathQuillMathField{}
		let userans = randomOption.replace(/MathQuillMathField{(.*?)}/g, "MathQuillMathField{}");

		let defaultans = 0;
		let anskey = randomOption;

		// checking for the user ans
		if (uaXML) {
			if (uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userans = uaXML._userAns;

				// check for the _userAnsSeq
				if (uaXML._userAnsSeq) {
					// storing the anskey and userAnsSeq
					anskey = uaXML._anskey;

					randomKey = uaXML._userAnsSeq;
				}
			}
		} else if (randomOption.indexOf("MathQuillMathField") > -1) {
			anskey = randomOption;
			defaultans = 1;
		}

		AH.selectAll("#elem" + i, "hide");
		let matheq = `<span id="elem${i}" class="auto_height edit_step fillmathelement mathquill" userAnsSeq="${randomKey}" userans="${userans}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1"></span>`;
		let tag = `<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div><span  id="m${i}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${randomKey}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1">${anskey}</span>${matheq}</div>`;

		// rplacing the cdata
		cdata = cdata.replace(originalData, tag);

		let mqInterval = setInterval(
			() => {
				// checking the MathQuill function is defined or not
				if (typeof MathQuill == "function") {
					// if found clear the interval
					clearInterval(mqInterval);

					AH.selectAll("#elem" + i, "show");

					// According to API DOC: By default, MathQuill overwrites the global MathQuill variable when loaded. If you do not want this behavior, you can use this 
					let MQ = MathQuill.getInterface(2);

					AH.selectAll(".mathquill").forEach(_this => {
						let mathItemId = _this.getAttribute("id");
						let defaultans = _this.getAttribute("defaultans");

						// adding the userans in the mathItemid
						if (defaultans == 1) {
							var latex = _this.getAttribute("userans");
							AH.selectAll("#" + mathItemId, "text", latex);
						} else {
							AH.selectAll("#" + mathItemId, "text", _this.getAttribute("userans"));
						}

						/**
 * According to Api doc
 * MQ.StaticMath(html_element) Creates a non-editable MathQuill initialized with the contents of the HTML element and returns a StaticMath object.
 * If the given element is already a static math instance,
 					 * this will return a new StaticMath object with the same .id. If the element is a different type of MathQuill, this will return null.
**/
						fillMath[mathItemId] = MQ.StaticMath(document.getElementById(mathItemId));
					});

					$$invalidate(3, ucFill.fillMath = fillMath, ucFill);
				}
			},
			100
		);
	}

	function createTextbox(data, i, uaXML = false) {
		var userAnswer = "";

		// checking for the user ans
		if (uaXML) {
			if (uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userAnswer = uaXML._userAns;
			}
		}

		let originalData = data;
		let csStyle = "";

		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g, "");

		// splitting it with |
		data = data.split("|");

		// if the type is codetype then make its value 1 else blank
		let codetype = data[1] && data[1].trim() == "c" ? "1" : "";

		let anskey = data[0].trim();

		// check for if any styling is given or not
		if (anskey.indexOf("#style#") != -1) {
			let customStyle = anskey.split("#style#");

			// store the correct ans
			anskey = customStyle[0];

			// store the custom style
			csStyle = customStyle[1];
		}

		let txtWidth = [];

		// split the anskey with ,
		let anslen = anskey.split(",");

		// findiing width of the textbox
		AH.selectAll(anslen).forEach((val, j) => {
			txtWidth[j] = anslen[j].length * 10 + 30;
		});

		// adding information of the tag and textbox
		let textbox = `<input type="text" class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...txtWidth)}px;${csStyle}" />`;

		let tag = `<div id="elem${i}" class="fillelement">${textbox}</div>`;

		// replace the cdata
		cdata = cdata.replace(originalData, tag);
	}

	function createNumericbox(data, i, uaXML = false) {
		var userAnswer = "";

		// checking for the user ans
		if (uaXML) {
			if (uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userAnswer = uaXML._userAns;
			}
		}

		let originalData = data;
		let csStyle = "";

		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g, "");

		// splitting it with |
		data = data.split("|");

		// if the type is codetype then make its value 1 else blank
		let codetype = data[1] && data[1].trim() == "c" ? "1" : "";

		let anskey = data[0].trim();

		// check for if any styling is given or not
		if (anskey.indexOf("#style#") != -1) {
			let customStyle = anskey.split("#style#");

			// store the correct ans
			anskey = customStyle[0];

			// store the custom style
			csStyle = customStyle[1];
		}

		let txtWidth = [];

		// split the anskey with ,
		let anslen = anskey.split(",");

		// findiing width of the textbox
		AH.selectAll(anslen).forEach((elm, j) => {
			txtWidth[j] = anslen[j].length * 10 + 30;
		});

		// adding information of the tag and textbox
		let textbox = `<input type="number" onKeyDown="if(isNaN(event.key)){var key_arr = [13, 37, 38, 39, 40, 8, 69, 101, 46, 16, 9];if(!key_arr.includes(event.keyCode)) event.preventDefault()} "class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width: ${Math.max(...txtWidth) + 20}px;${csStyle}" />`;

		let tag = `<div id="elem${i}" class="fillelement">${textbox}</div>`;

		// replace the cdata
		cdata = cdata.replace(originalData, tag);
	}

	function createSelectBox(data, i, uaXML = false) {
		let originalData = data;

		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g, "");

		// splitting it with |
		data = data.split("|");

		let optionsValue = data[0].trim();

		// splitting with , to extract all the option
		optionsValue = optionsValue.split(",").map(item => item.trim());

		let options = "<option value=\"\">&nbsp;Please Select</option>";

		// iterating through each options
		AH.selectAll(optionsValue).forEach((_this, j) => {
			// checking correct
			let isCorrect = optionsValue[j].indexOf("*") == 0 ? "1" : "0";

			// checking default selected value
			let selected = optionsValue[j].indexOf("+") == 0
			? "selected=\"selected\""
			: "";

			// extracting value of the option
			let innerVal = optionsValue[j].indexOf("*") == 0 || optionsValue[j].indexOf("+") == 0
			? optionsValue[j].slice(1)
			: optionsValue[j];

			let userAnswer = "";

			// checking for the user asn
			if (uaXML) {
				if (uaXML._userAns) {
					selected = "";

					// spliiting with , 
					let sel = uaXML._userAns.split(",");

					// checkimg for the option which is selected by the user
					if (j == sel[0].trim() - 1) {
						selected = "selected=\"selected\"";
						userAnswer = "1";
					}
				}
			}

			// replacing #cm with , & #pl with + in option text
			innerVal = innerVal.replace(/\#cm/gmi, ",").replace(/\#pl/gmi, "+");

			// creating options
			options += `<option value="${j}" correctans="${isCorrect}" userans="${userAnswer}" ${selected}>&nbsp;${innerVal}</option>`;
		});

		// creating selectbox
		let selectbox = `<select class="fillintheblank ks" data-role="none">${options}</select>`;

		let tag = `<div id="elem${i}" class="fillelement">${selectbox}</div>`;

		// replace the cdata
		cdata = cdata.replace(originalData, tag);
	}

	function createMultilineBox(data, i, uaXML = false) {
		let userAnswerM = "";

		// checking for the user ans
		if (uaXML) {
			if (uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userAnswerM = uaXML._userAns;
			}
		}

		let originalData = data;

		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g, "");

		// splitting it with |
		data = data.split("|");

		let anskey = data[0].trim();

		// parse the attr in json
		let attrs = JSON.parse(data[1]);

		// creating textarea
		let multilineBox = `<textarea class="textarea ks" rows="${attrs.rows}" cols="${attrs.cols}" anskey="${anskey}" value="${userAnswerM}" defaultans="${attrs.defaultAns ? attrs.defaultAns : ""}" userans="${userAnswerM}" haskeywords="" hasnotkeywords="" keywordtype="1" autocomplete="off" data-role="none">${userAnswerM}</textarea>`;

		let tag = `<div id="elem${i}" class="fillelement" style="height:auto">${multilineBox}</div>`;

		// replace the cdata
		cdata = cdata.replace(originalData, tag);
	}

	function createDragDrop(data, i, uaXML = false) {
		let originalData = data;

		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g, "");

		// splitting it with |
		data = data.split("|");

		let anskey = data[0].trim();

		// if the type is ds then make dragSingle value 1 else 0
		let dragSingle = data[1].trim() == "ds" ? "1" : "0";

		// split the anskey with ,
		let totalDrag = anskey.split(",");

		let dropAns = "";

		// traversing through each option
		AH.selectAll(totalDrag).forEach((elm, j) => {
			let isDuplicate = false;
			let maxWidth = totalDrag[j].length * 10 + 30;
			let dragAns = totalDrag[j];

			// storing the incorrect values
			let ignore = totalDrag[j].match(/i~|~i/g);

			let tempAns = "";

			if (ignore) {
				// removing ~i,i~ from the dragans
				dragAns = totalDrag[j].replace(/i~|~i/g, "");
			} else {
				dropAns += "ID" + dragID + ",";
				tempAns = "ID" + dragID + ",";
			}

			// function for checking duplicate values
			AH.selectAll(CheckDuplicate).forEach((elm, z) => {
				if (CheckDuplicate[z].ans == dragAns) {
					isDuplicate = true;

					if (!ignore) {
						dropAns = dropAns.replace(tempAns, "");
						dropAns += CheckDuplicate[z].id + ",";
					}
				}
			});

			// if value is not duplicate
			if (isDuplicate == false) {
				CheckDuplicate.push({ "ans": dragAns, "id": "ID" + dragID });
			}

			if (isDuplicate == false) dragData += `<div id="ID${dragID}" dragable="true" tabindex="0" class="drag-resize dragable ks" caption="${dragAns.replace(/\#cm/gmi, ",").replace(/\"/gmi, "#doublequote#")}" path="//s3.amazonaws.com/jigyaasa_content_static/" drag-single="${dragSingle}" bgcolor="#CCFFCC" style="background-color:#CCFFCC;height:auto;max-width:${maxWidth}px;padding:3px 10px 3px 10px; margin: 2px 2px;" aria-disabled="false">${dragAns.replace(/\#cm/gmi, ",")}</div>`;
			if (isDuplicate == false) dragID++;
		});

		let userAnswer = "";

		// checking for the user ans
		if (uaXML) {
			if (uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userAnswer = uaXML._userAns;
			}
		}

		// adding information in html
		let drop = "<div id=\"elem" + i + "\" tabindex=\"0\" dropzone=\"1\" class=\"drag-resize dropable ks\" path=\"//s3.amazonaws.com/jigyaasa_content_static/\" anskey=\"" + dropAns.slice(0, -1) + "\" caption=\"\" userans=\"" + userAnswer + "\" droped=\"" + userAnswer + "\" bgcolor=\"#FFFFCC\" style=\"background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;\">" + userAnswer + "</div>";

		// replace the cdata
		cdata = cdata.replace(originalData, drop);

		$$invalidate(5, state.footerStr = true, state);
	}

	/*----------------------------------------------------------------- */
	// for showing correct answer.
	function correctAnswer() {
		ucFill.showdragans(ajax_eId, "c", 1);
		AH.selectAll(".corr_div", "show");
		AH.selectAll(".remed_disable", "show");
		autoresize(1);
	}

	// for showing user answer.
	function yourAnswer() {
		ucFill.showdragans(ajax_eId, "u", 1);
		AH.selectAll(".corr_div", "hide");
		autoresize(1);
	}

	//To handle review toggle
	function handleReview(mode, event) {
		if (mode == "c") {
			correctAnswer();
		} else {
			yourAnswer();
		}
	}

	const writable_props = [
		"manual_grade",
		"xml",
		"uxml",
		"isReview",
		"editorState",
		"smValidate",
		"showAns"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<FillInTheBlanksPreview> was created with unknown prop '${key}'`);
	});

	function itemhelper_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			smControllerCallback = $$value;
			$$invalidate(4, smControllerCallback);
		});
	}

	$$self.$$set = $$props => {
		if ("manual_grade" in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
		if ("xml" in $$props) $$invalidate(2, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(12, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("editorState" in $$props) $$invalidate(13, editorState = $$props.editorState);
		if ("smValidate" in $$props) $$invalidate(14, smValidate = $$props.smValidate);
		if ("showAns" in $$props) $$invalidate(15, showAns = $$props.showAns);
	};

	$$self.$capture_state = () => ({
		ucFill,
		ju: jquery,
		ItemHelper,
		FillInTheBlanksToolbar,
		writable,
		beforeUpdate,
		onMount,
		AH,
		XMLToJSON,
		manual_grade,
		xml,
		uxml,
		isReview,
		editorState,
		smValidate,
		showAns,
		smControllerCallback,
		cdata,
		dragData,
		CheckDuplicate,
		dragID,
		errorCatchFlag,
		fillMath,
		fillId,
		parsedXml,
		parsedUxml,
		containerID,
		state,
		hdd,
		unsubscribe,
		loadModule,
		updateUserAns,
		parseXmlAuthoring,
		setReview,
		unsetReview,
		autoresize,
		displayAns,
		toggleToolbar,
		oneditoFocused,
		updateModule,
		setSMNotes,
		runModule,
		setMaxWidth,
		createMathDiv,
		createTextbox,
		createNumericbox,
		createSelectBox,
		createMultilineBox,
		createDragDrop,
		correctAnswer,
		yourAnswer,
		handleReview
	});

	$$self.$inject_state = $$props => {
		if ("manual_grade" in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
		if ("xml" in $$props) $$invalidate(2, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(12, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("editorState" in $$props) $$invalidate(13, editorState = $$props.editorState);
		if ("smValidate" in $$props) $$invalidate(14, smValidate = $$props.smValidate);
		if ("showAns" in $$props) $$invalidate(15, showAns = $$props.showAns);
		if ("smControllerCallback" in $$props) $$invalidate(4, smControllerCallback = $$props.smControllerCallback);
		if ("cdata" in $$props) cdata = $$props.cdata;
		if ("dragData" in $$props) dragData = $$props.dragData;
		if ("CheckDuplicate" in $$props) CheckDuplicate = $$props.CheckDuplicate;
		if ("dragID" in $$props) dragID = $$props.dragID;
		if ("errorCatchFlag" in $$props) errorCatchFlag = $$props.errorCatchFlag;
		if ("fillMath" in $$props) fillMath = $$props.fillMath;
		if ("fillId" in $$props) $$invalidate(6, fillId = $$props.fillId);
		if ("parsedXml" in $$props) parsedXml = $$props.parsedXml;
		if ("parsedUxml" in $$props) parsedUxml = $$props.parsedUxml;
		if ("containerID" in $$props) $$invalidate(7, containerID = $$props.containerID);
		if ("state" in $$props) $$invalidate(5, state = $$props.state);
		if ("hdd" in $$props) hdd = $$props.hdd;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview*/ 1) {
			 isReview ? setReview() : unsetReview();
		}
	};

	return [
		isReview,
		manual_grade,
		xml,
		ucFill,
		smControllerCallback,
		state,
		fillId,
		containerID,
		setReview,
		unsetReview,
		toggleToolbar,
		handleReview,
		uxml,
		editorState,
		smValidate,
		showAns,
		itemhelper_binding
	];
}

class FillInTheBlanksPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-83d7ak-style")) add_css();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				manual_grade: 1,
				xml: 2,
				uxml: 12,
				isReview: 0,
				editorState: 13,
				smValidate: 14,
				showAns: 15
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FillInTheBlanksPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*manual_grade*/ ctx[1] === undefined && !("manual_grade" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'manual_grade'");
		}

		if (/*xml*/ ctx[2] === undefined && !("xml" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[12] === undefined && !("uxml" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[13] === undefined && !("editorState" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'editorState'");
		}

		if (/*smValidate*/ ctx[14] === undefined && !("smValidate" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'smValidate'");
		}

		if (/*showAns*/ ctx[15] === undefined && !("showAns" in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'showAns'");
		}
	}

	get manual_grade() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set manual_grade(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get smValidate() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set smValidate(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default FillInTheBlanksPreview;
//# sourceMappingURL=FillInTheBlanksPreview-2952206f.js.map
