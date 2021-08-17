
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, U as Draggable, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, M as append_styles, v as validate_slots, o as onMount, A as AH, L as beforeUpdate, X as XMLToJSON, a3 as onUserAnsChange, w as writable, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component, e as element, f as space, j as attr_dev, k as add_location, l as set_style, n as insert_dev, p as append_dev, r as group_outros, u as check_outros, x as detach_dev, Q as binding_callbacks, h as text } from './main-36d58a4a.js';
import { I as ItemHelper } from './ItemHelper-3d969b8e.js';
import { F as FillInTheBlanksToolbar } from './mathquill-c533f43e.js';
import './style-inject.es-1c867377.js';

const JS = new JUI();
class fillJS {
	constructor(options) {
		//super();
		this.userAnsXML = "";
		this.sInfo = true;
		this.labBinded = true;
		this.delPreSpaces = {};
		this.init();
		this.iscorrect = '-2';
		this.previous_droped_item = {};
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
						// Remove the dragable disabled from previous
						if (Object.entries(this.previous_droped_item) && this.previous_droped_item[drop_target]) {
							this.previous_droped_item[drop_target].setAttribute('draggable','true');
							this.previous_droped_item[drop_target].setAttribute('aria-disabled','false');
							this.previous_droped_item[drop_target].classList.remove('ui-draggable-disabled', 'ui-state-disabled');
						}
						
						// Add the diabled features to current droped item
						let selected = document.querySelector('#' + drag_id);
						selected.setAttribute('draggable','false');
						selected.setAttribute('aria-disabled','true');
						selected.classList.add('ui-draggable-disabled', 'ui-state-disabled');
						this.previous_droped_item[drop_target] = selected;
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
						if (_this.getAttribute("correctans") > 0) _this.selected = true;
					} else if (ansType=='u') {
						if (_this.getAttribute("userans") > 0) _this.selected = true;
						if (_this.selected && _this.getAttribute('correctans') == 1) { this.a++; }
					}
				});
				if (this.totalcorrect == this.a) is_correct = 1;
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
		this.iscorrect = is_correct;
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
			if (JS.findInArray(pElem.getAttribute('userans'), ansKey) == undefined || JS.findInArray(pElem.getAttribute('userans'), ansKey) == false) {
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
					_value.setAttribute('userans', '');
					if (_value.selected) {
						this.a++;
						if (_value.getAttribute("correctans") != 1) {
							this.result = false;
						} else {
							this.temp++;
						}
						this.uAnsSel = this.uAnsSel+(index)+",";
						_value.setAttribute('userans', index);
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

/* clsSMFill\FillInTheBlanksPreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;

const file = "clsSMFill\\FillInTheBlanksPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-1fzfbpq", "xmp{display:inline}#fillmain{overflow:hidden;max-width:1024px;text-align:left}#fillmain pre{background:none;border:none;font-size:14px!important}#fillmain .string{min-height:50px;margin-top:10px;margin-right:10px}#fillmain .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}#fillmain .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}#fillmain .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}#fillmain input[type=\"text\"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}#fillmain .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}#fillmain .drag-resize.ui-draggable{cursor:move}#fillmain .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}#fillmain .fillcheck ul{width:220px}#fillmain .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}#fillmain .select{font-size:15px}#fillmain .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}#fillmain .dragable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}#fillmain .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}#fillmain select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#555;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Helvetica,Arial,'Times New Roman',Verdana,sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.prettyprint{display:-ms-grid!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,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 */");
}

// (872:3) {#if state.showToolbar}
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
		source: "(872:3) {#if state.showToolbar}",
		ctx
	});

	return block;
}

// (883:4) {:else}
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
		source: "(883:4) {:else}",
		ctx
	});

	return block;
}

// (881:4) {#if state.matchtype == "0"}
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
		source: "(881:4) {#if state.matchtype == \\\"0\\\"}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div5;
	let center1;
	let itemhelper;
	let t0;
	let div4;
	let div0;
	let t1;
	let t2;
	let div1;
	let t3;
	let div3;
	let div2;
	let t4;
	let center0;
	let div4_class_value;
	let div4_matchtype_value;
	let div4_multi_value;
	let div4_ignoretype_value;
	let div4_manual_grade_value;
	let div4_totalcorrectans_value;
	let div5_class_value;
	let t5;
	let textarea;
	let current;

	let itemhelper_props = {
		handleReviewClick: /*handleReview*/ ctx[11],
		reviewMode: /*isReview*/ ctx[0]
	};

	itemhelper = new ItemHelper({ props: itemhelper_props, $$inline: true });
	/*itemhelper_binding*/ ctx[16](itemhelper);
	itemhelper.$on("setReview", /*setReview*/ ctx[8]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[9]);
	let if_block0 = /*state*/ ctx[5].showToolbar && create_if_block_1(ctx);

	function select_block_type(ctx, dirty) {
		if (/*state*/ ctx[5].matchtype == "0") return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	const block = {
		c: function create() {
			div5 = element("div");
			center1 = element("center");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div4 = element("div");
			div0 = element("div");
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			div1 = element("div");
			if_block1.c();
			t3 = space();
			div3 = element("div");
			div2 = element("div");
			t4 = space();
			center0 = element("center");
			t5 = space();
			textarea = element("textarea");
			attr_dev(div0, "class", "string");
			attr_dev(div0, "id", "previewArea");
			add_location(div0, file, 870, 2, 31319);
			set_style(div1, "color", "#b94a48");
			set_style(div1, "margin-top", "5px");
			attr_dev(div1, "class", "smnotes");
			add_location(div1, file, 879, 3, 31568);
			attr_dev(div2, "class", "arrow-up");
			add_location(div2, file, 887, 4, 31860);
			attr_dev(center0, "class", "dragArea");
			add_location(center0, file, 888, 4, 31894);
			attr_dev(div3, "class", "footerStr");
			set_style(div3, "display", /*state*/ ctx[5].footerStr ? 'block' : 'none');
			add_location(div3, file, 886, 3, 31777);
			attr_dev(div4, "id", /*containerID*/ ctx[7]);
			attr_dev(div4, "class", div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? 'pe-none' : null));
			attr_dev(div4, "matchtype", div4_matchtype_value = /*state*/ ctx[5].matchtype);
			attr_dev(div4, "multi", div4_multi_value = /*state*/ ctx[5].multi);
			attr_dev(div4, "ignoretype", div4_ignoretype_value = /*state*/ ctx[5].ignoretype);
			attr_dev(div4, "manual_grade", div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0);
			attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value = /*state*/ ctx[5].totalcorrectans);
			set_style(div4, "font-family", "\"Open Sans\",sans-serif");
			set_style(div4, "font-size", "16px");
			add_location(div4, file, 859, 2, 30995);
			add_location(center1, file, 851, 1, 30795);
			attr_dev(div5, "class", div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "");
			add_location(div5, file, 850, 0, 30749);
			attr_dev(textarea, "class", "h");
			attr_dev(textarea, "id", "special_module_user_xml");
			add_location(textarea, file, 893, 0, 31971);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, center1);
			mount_component(itemhelper, center1, null);
			append_dev(center1, t0);
			append_dev(center1, div4);
			append_dev(div4, div0);
			append_dev(div4, t1);
			if (if_block0) if_block0.m(div4, null);
			append_dev(div4, t2);
			append_dev(div4, div1);
			if_block1.m(div1, null);
			append_dev(div4, t3);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div3, t4);
			append_dev(div3, center0);
			insert_dev(target, t5, anchor);
			insert_dev(target, textarea, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);

			if (/*state*/ ctx[5].showToolbar) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty[0] & /*state*/ 32) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div4, t2);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div1, null);
				}
			}

			if (!current || dirty[0] & /*state*/ 32) {
				set_style(div3, "display", /*state*/ ctx[5].footerStr ? 'block' : 'none');
			}

			if (!current || dirty[0] & /*isReview*/ 1 && div4_class_value !== (div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? 'pe-none' : null))) {
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
			transition_in(if_block0);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			transition_out(if_block0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			/*itemhelper_binding*/ ctx[16](null);
			destroy_component(itemhelper);
			if (if_block0) if_block0.d();
			if_block1.d();
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(textarea);
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
				e.style.cssText = 'height:auto;overflow: auto;';
				if (flag) if (window.isIE) e.style.cssText = 'height:' + (e.scrollHeight + 10) + 'px;overflow: hidden'; else e.style.cssText = 'height:' + e.scrollHeight + 'px;overflow: hidden';
				clearTimeout(timer);
			},
			100
		);
	}
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('FillInTheBlanksPreview', slots, []);
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

	onMount(async () => {
		AH.addScript("", "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js");
		AH.addScript("", window.itemUrl + "src/libs/mathQuill_new.js");
		ucFill.setUpdate(updateModule.bind(this));
		let mathItem = document.getElementById(containerID);

		mathItem = mathItem
		? mathItem.getElementsByClassName('mathquill')
		: mathItem;

		if (state.isMathquill) {
			AH.selectAll("div" + ajax_eId, 'css', { 'overflow': 'auto' });
		}

		// Binding the events 
		AH.bind(ajax_eId, 'click', displayAns);

		AH.bind(ajax_eId, 'keyup', displayAns);
		AH.bind(ajax_eId, 'change', displayAns);
		AH.listen(document, "click", "span.mq-editable-field.mq-focused", oneditoFocused);
		AH.listen(document, "change", "span.mq-editable-field.mq-focused", oneditoFocused);

		// for loading the module on the basis of the updated the xml
		loadModule();
	});

	/*
** This function will call when compent recieving new prop in other words whenever 
** any thing changes in xml this function will call automatically
*/
	beforeUpdate(() => {
		// for checking that there is change in the xml
		if (xml != state.xml) {
			if (editorState && editorState.stopPreviewUpdate == true) return false;

			// for loading the module on the basis of the updated the xml
			loadModule();

			// for adding the tabindex
			setTimeout(
				function () {
					let node = document.getElementById('previewArea');

					if (node.childNodes[0] && node.childNodes[0].nodeName == 'TABLE') {
						node = document.querySelectorAll('#previewArea td');

						for (let item in node) {
							if (!node[item].firstElementChild && node[item].nodeName == 'TD') {
								node[item].setAttribute('tabindex', '0');
							}
						}
					} else {
						for (let item in node.childNodes) {
							if (node.childNodes[item].nodeType == 3) {
								let txt = document.createElement("span");
								txt.setAttribute('tabindex', '0');
								txt.innerHTML = node.childNodes[item].textContent;
								node.childNodes[item].replaceWith(txt);
							}
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
				parsedUxml = XMLToJSON(uxml);
				$$invalidate(5, state.uxml = uxml, state);
			} else {
				window.isResetMath = false;
			}
		}

		// parsing the authoring xml
		parseXmlAuthoring(parsedXml, parsedUxml);

		//ucFill.showdragans(ajax_eId, 'u'); //@prabhat: Its creating issue when we check the answer from editor for the drop down.
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
				answerType = answerType ? answerType[0].replace(/\||}%/gm, '') : '';

				answerType = answerType.trim();

				if (uaXMLNew && uaXMLNew._userAns) {
					// storing the userans attribute value in useranswer
					let id = "";

					if (answerType == '' || answerType == 'c') {
						// For textbox
						id = `#elem${i} .fillintheblank`;
					} else if (answerType == 'n') {
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
						document.querySelector(id).setAttribute('userans', uaXMLNew._userAns);
					}
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
		AH.selectAll(".smnotes", 'hide');

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

		let answerType = '';
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
				answerType = answerType ? answerType[0].replace(/\||}%/gm, '') : '';

				answerType = answerType.trim();

				// in case of textbox or codetype
				if (answerType == '' || answerType == 'c') {
					AH.selectAll(".smnotes", 'show');

					// checking for the user ans
					if (uaXMLNew) {
						// create the textbox in the preview area with user ans
						createTextbox(originalKey, i, uaXMLNew);
					} else {
						// create the textbox in the preview area
						createTextbox(originalKey, i);
					}
				} else if (answerType == 'n') {
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
					AH.selectAll(".smnotes", 'show');

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

		AH.selectAll("#" + containerID, 'attr', { "totalcorrectans": totalMarks });

		// Resolve html entity
		cdata = AH.ignoreEnity(cdata);

		// put the cdata in the previewarea
		AH.find("#" + containerID, "#previewArea", { action: 'html', actionData: cdata });

		// put the dragData in the dragarea
		AH.find("#" + containerID, ".dragArea", { action: 'html', actionData: dragData });

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
				if (AH.find(ajax_eId, ".prettyprint", 'all').length >= 1) {
					if (AH.find(ajax_eId, ".prettyprint .L0", 'all').length == 0) {
						if (typeof prettyPrint == 'function') {
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

		if (AH.find(ajax_eId, "table.uc-table", 'all').length > 0) {
			AH.find(ajax_eId, "table.uc-table", { action: 'addClass', actionData: 'font14' });

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

		ucFill.showdragans(ajax_eId, 'u', 1);
		AH.selectAll('.remed_disable', 'show');
		autoresize(1);
		let mathItem = document.getElementById(containerID);

		mathItem = mathItem
		? mathItem.getElementsByClassName('mathquill')
		: mathItem;

		if (mathItem) {
			AH.setCss(ajax_eId, { "position": "relative" });
			AH.insert(ajax_eId, "<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>", 'afterbegin');
		}

		displayAns();
	}

	// function calls when remediation mode is off
	function unsetReview() {
		$$invalidate(0, isReview = false);
		AH.selectAll('.mathquill', 'css', { 'border': 'none' });
		ucFill.modeOn();
		AH.selectAll('.remed_disable, .corr_div', 'hide');
		ucFill.showdragans(ajax_eId, 'u', 0);
		let mathItem = document.getElementById(containerID);

		mathItem = mathItem
		? mathItem.getElementsByClassName('mathquill')
		: mathItem;

		autoresize();

		if (mathItem) {
			AH.selectAll(ajax_eId, 'css', { "position": "unset" });
			AH.selectAll(".spinner-wrapper", 'remove');
		}
	}

	// for displaying the answer
	function displayAns() {
		// check the ans and create user ans
		let ans = ucFill.checkAns(ajax_eId);

		// To save the user answer
		let answer = {
			ans: ucFill.result,
			uXml: ucFill.userAnsXML
		};

		onUserAnsChange(answer);

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

			if (x.getAttribute('id')) {
				isFillId = false;
				fillId = x.getAttribute('id');
			}
		}

		let latexArray = [];

		AH.selectAll("#" + fillId + " span.mq-editable-field").forEach(element => {
			let commandId = x.getAttribute('mathquill-command-id');
			latexArray.push(commandId);
		});

		let mathId = x.getAttribute('mathquill-command-id');
		let indexId = latexArray.indexOf(mathId);
		$$invalidate(5, state.spanId = indexId, state);
		$$invalidate(5, state.divId = fillId, state);
		$$invalidate(5, state.showToolbar = true, state);
	}

	function updateModule(key, value) {
		$$invalidate(5, state[key] = value, state);

		if (key == 'uxml') {
			parsedUxml = XMLToJSON(state.uxml);

			// parsing the authoring xml
			updateUserAns(parsedUxml);
		}
	}

	// for giving the uc-table style
	function setSMNotes() {
		if (AH.find(ajax_eId, "table.uc-table", 'all').length > 0) {
			let tableWidth = AH.find(ajax_eId, "table.uc-table").clientWidth + 9;

			AH.setCss(AH.find(ajax_eId, ".smnotes"), {
				'width': tableWidth + "px",
				'margin': "auto",
				'padding-top': "5px"
			});
		}
	}

	// for adding the event to select and add drag and drop functionality to element
	function runModule() {
		try {
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
			if (_this.classList.contains('drag-resize')) {
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
		let addMathquill = data[0].replace(/user Response/g, '\\MathQuillMathField');

		// then spliting with ##
		let splitData = addMathquill.split("##");

		let randomKey = Math.floor(Math.random() * splitData.length);

		// taking random option
		let randomOption = splitData[randomKey];

		// storing the randomOption in userasn by replacing the MathQuillMathField{(any value)} to MathQuillMathField{}
		let userans = randomOption.replace(/MathQuillMathField{(.*?)}/g, 'MathQuillMathField{}');

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
		} else if (randomOption.indexOf("\MathQuillMathField") > -1) {
			anskey = randomOption;
			defaultans = 1;
		}

		AH.selectAll('#elem' + i, 'hide');
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

					AH.selectAll('#elem' + i, 'show');

					// According to API DOC: By default, MathQuill overwrites the global MathQuill variable when loaded. If you do not want this behavior, you can use this 
					let MQ = MathQuill.getInterface(2);

					AH.selectAll(".mathquill").forEach(_this => {
						let mathItemId = _this.getAttribute('id');
						let defaultans = _this.getAttribute('defaultans');

						// adding the userans in the mathItemid
						if (defaultans == 1) {
							var latex = _this.getAttribute('userans');
							AH.selectAll('#' + mathItemId, 'text', latex);
						} else {
							AH.selectAll('#' + mathItemId, 'text', _this.getAttribute('userans'));
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

		let options = '<option value="">&nbsp;Please Select</option>';

		// iterating through each options
		AH.selectAll(optionsValue).forEach((_this, j) => {
			// checking correct
			let isCorrect = optionsValue[j].indexOf('*') == 0 ? "1" : "0";

			// checking default selected value
			let selected = optionsValue[j].indexOf('+') == 0
			? 'selected="selected"'
			: "";

			// extracting value of the option
			let innerVal = optionsValue[j].indexOf('*') == 0 || optionsValue[j].indexOf('+') == 0
			? optionsValue[j].slice(1)
			: optionsValue[j];

			let userAnswer = "";

			// checking for the user asn
			if (uaXML) {
				if (uaXML._userAns) {
					selected = '';

					// spliiting with , 
					let sel = uaXML._userAns.split(",");

					// checkimg for the option which is selected by the user
					if (j == sel[0].trim() - 1) {
						selected = 'selected="selected"';
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

		let tag = `<span id="elem${i}" class="fillelement" style="height:auto">${multilineBox}</span>`;

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

		let dropAns = '';

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
		let drop = '<div id="elem' + i + '" tabindex="0" dropzone="1" class="drag-resize dropable ks" path="//s3.amazonaws.com/jigyaasa_content_static/" anskey="' + dropAns.slice(0, -1) + '" caption="" userans="' + userAnswer + '" droped="' + userAnswer + '" bgcolor="#FFFFCC" style="background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;">' + userAnswer + '</div>';

		// replace the cdata
		cdata = cdata.replace(originalData, drop);

		$$invalidate(5, state.footerStr = true, state);
	}

	/*----------------------------------------------------------------- */
	// for showing correct answer.
	function correctAnswer() {
		ucFill.showdragans(ajax_eId, 'c', 1);
		AH.selectAll('.corr_div', 'show');
		AH.selectAll('.remed_disable', 'show');
		autoresize(1);
	}

	// for showing user answer.
	function yourAnswer() {
		ucFill.showdragans(ajax_eId, 'u', 1);
		AH.selectAll('.corr_div', 'hide');
		autoresize(1);
	}

	//To handle review toggle
	function handleReview(mode, event) {
		if (mode == 'c') {
			correctAnswer();
		} else {
			yourAnswer();
		}
	}

	const writable_props = [
		'manual_grade',
		'xml',
		'uxml',
		'isReview',
		'editorState',
		'smValidate',
		'showAns'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<FillInTheBlanksPreview> was created with unknown prop '${key}'`);
	});

	function itemhelper_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			smControllerCallback = $$value;
			$$invalidate(4, smControllerCallback);
		});
	}

	$$self.$$set = $$props => {
		if ('manual_grade' in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
		if ('xml' in $$props) $$invalidate(2, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(12, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(13, editorState = $$props.editorState);
		if ('smValidate' in $$props) $$invalidate(14, smValidate = $$props.smValidate);
		if ('showAns' in $$props) $$invalidate(15, showAns = $$props.showAns);
	};

	$$self.$capture_state = () => ({
		ucFill,
		ItemHelper,
		FillInTheBlanksToolbar,
		writable,
		beforeUpdate,
		onMount,
		AH,
		onUserAnsChange,
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
		if ('manual_grade' in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
		if ('xml' in $$props) $$invalidate(2, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(12, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(13, editorState = $$props.editorState);
		if ('smValidate' in $$props) $$invalidate(14, smValidate = $$props.smValidate);
		if ('showAns' in $$props) $$invalidate(15, showAns = $$props.showAns);
		if ('smControllerCallback' in $$props) $$invalidate(4, smControllerCallback = $$props.smControllerCallback);
		if ('cdata' in $$props) cdata = $$props.cdata;
		if ('dragData' in $$props) dragData = $$props.dragData;
		if ('CheckDuplicate' in $$props) CheckDuplicate = $$props.CheckDuplicate;
		if ('dragID' in $$props) dragID = $$props.dragID;
		if ('errorCatchFlag' in $$props) errorCatchFlag = $$props.errorCatchFlag;
		if ('fillMath' in $$props) fillMath = $$props.fillMath;
		if ('fillId' in $$props) $$invalidate(6, fillId = $$props.fillId);
		if ('parsedXml' in $$props) parsedXml = $$props.parsedXml;
		if ('parsedUxml' in $$props) parsedUxml = $$props.parsedUxml;
		if ('containerID' in $$props) $$invalidate(7, containerID = $$props.containerID);
		if ('state' in $$props) $$invalidate(5, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
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
			add_css,
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

		if (/*manual_grade*/ ctx[1] === undefined && !('manual_grade' in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'manual_grade'");
		}

		if (/*xml*/ ctx[2] === undefined && !('xml' in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[12] === undefined && !('uxml' in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[13] === undefined && !('editorState' in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'editorState'");
		}

		if (/*smValidate*/ ctx[14] === undefined && !('smValidate' in props)) {
			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'smValidate'");
		}

		if (/*showAns*/ ctx[15] === undefined && !('showAns' in props)) {
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
//# sourceMappingURL=FillInTheBlanksPreview-d1226f23.js.map
