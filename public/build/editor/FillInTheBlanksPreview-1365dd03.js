
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, T as Draggable, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, a4 as jquery, A as AH, L as beforeUpdate, X as XMLToJSON, _ as onUserAnsChange, w as writable, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component, f as space, j as attr_dev, l as set_style, k as add_location, n as insert_dev, r as group_outros, u as check_outros, x as detach_dev, P as binding_callbacks, h as text } from './main-32dbc3f7.js';
import { I as ItemHelper } from './ItemHelper-3ab6eed2.js';
import { F as FillInTheBlanksToolbar } from './mathquill-6380f475.js';
import './style-inject.es-1c867377.js';
import 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';

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

/**
 * MathQuill v0.10.1               http://mathquill.com
 * by Han, Jeanine, and Mary  maintainers@mathquill.com
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL
 * was not distributed with this file, You can obtain
 * one at http://mozilla.org/MPL/2.0/.
 */

(function() {

  var jQuery = window.jQuery,
    undefined$1,
    mqCmdId = 'mathquill-command-id',
    mqBlockId = 'mathquill-block-id',
    min = Math.min,
    max = Math.max;
  
  function noop() {}
  
  /**
   * A utility higher-order function that makes defining variadic
   * functions more convenient by letting you essentially define functions
   * with the last argument as a splat, i.e. the last argument "gathers up"
   * remaining arguments to the function:
   *   var doStuff = variadic(function(first, rest) { return rest; });
   *   doStuff(1, 2, 3); // => [2, 3]
   */
  var __slice = [].slice;
  function variadic(fn) {
    var numFixedArgs = fn.length - 1;
    return function() {
      var args = __slice.call(arguments, 0, numFixedArgs);
      var varArg = __slice.call(arguments, numFixedArgs);
      return fn.apply(this, args.concat([ varArg ]));
    };
  }
  
  /**
   * A utility higher-order function that makes combining object-oriented
   * programming and functional programming techniques more convenient:
   * given a method name and any number of arguments to be bound, returns
   * a function that calls it's first argument's method of that name (if
   * it exists) with the bound arguments and any additional arguments that
   * are passed:
   *   var sendMethod = send('method', 1, 2);
   *   var obj = { method: function() { return Array.apply(this, arguments); } };
   *   sendMethod(obj, 3, 4); // => [1, 2, 3, 4]
   *   // or more specifically,
   *   var obj2 = { method: function(one, two, three) { return one*two + three; } };
   *   sendMethod(obj2, 3); // => 5
   *   sendMethod(obj2, 4); // => 6
   */
  var send = variadic(function(method, args) {
    return variadic(function(obj, moreArgs) {
      if (method in obj) return obj[method].apply(obj, args.concat(moreArgs));
    });
  });
  
  /**
   * A utility higher-order function that creates "implicit iterators"
   * from "generators": given a function that takes in a sole argument,
   * a "yield_" function, that calls "yield_" repeatedly with an object as
   * a sole argument (presumably objects being iterated over), returns
   * a function that calls it's first argument on each of those objects
   * (if the first argument is a function, it is called repeatedly with
   * each object as the first argument, otherwise it is stringified and
   * the method of that name is called on each object (if such a method
   * exists)), passing along all additional arguments:
   *   var a = [
   *     { method: function(list) { list.push(1); } },
   *     { method: function(list) { list.push(2); } },
   *     { method: function(list) { list.push(3); } }
   *   ];
   *   a.each = iterator(function(yield_) {
   *     for (var i in this) yield_(this[i]);
   *   });
   *   var list = [];
   *   a.each('method', list);
   *   list; // => [1, 2, 3]
   *   // Note that the for-in loop will yield 'each', but 'each' maps to
   *   // the function object created by iterator() which does not have a
   *   // .method() method, so that just fails silently.
   */
  function iterator(generator) {
    return variadic(function(fn, args) {
      if (typeof fn !== 'function') fn = send(fn);
      var yield_ = function(obj) { return fn.apply(obj, [ obj ].concat(args)); };
      return generator.call(this, yield_);
    });
  }
  
  /**
   * sugar to make defining lots of commands easier.
   * TODO: rethink this.
   */
  function bind(cons /*, args... */) {
    var args = __slice.call(arguments, 1);
    return function() {
      return cons.apply(this, args);
    };
  }
  
  /**
   * a development-only debug method.  This definition and all
   * calls to `pray` will be stripped from the minified
   * build of mathquill.
   *
   * This function must be called by name to be removed
   * at compile time.  Do not define another function
   * with the same name, and only call this function by
   * name.
   */
  function pray(message, cond) {
    if (!cond) throw new Error('prayer failed: '+message);
  }
  var P = (function(prototype, ownProperty, undefined$1) {
    // helper functions that also help minification
    function isObject(o) { return typeof o === 'object'; }
    function isFunction(f) { return typeof f === 'function'; }
  
    // used to extend the prototypes of superclasses (which might not
    // have `.Bare`s)
    function SuperclassBare() {}
  
    return function P(_superclass /* = Object */, definition) {
      // handle the case where no superclass is given
      if (definition === undefined$1) {
        definition = _superclass;
        _superclass = Object;
      }
  
      // C is the class to be returned.
      //
      // It delegates to instantiating an instance of `Bare`, so that it
      // will always return a new instance regardless of the calling
      // context.
      //
      //  TODO: the Chrome inspector shows all created objects as `C`
      //        rather than `Object`.  Setting the .name property seems to
      //        have no effect.  Is there a way to override this behavior?
      function C() {
        var self = new Bare;
        if (isFunction(self.init)) self.init.apply(self, arguments);
        return self;
      }
  
      // C.Bare is a class with a noop constructor.  Its prototype is the
      // same as C, so that instances of C.Bare are also instances of C.
      // New objects can be allocated without initialization by calling
      // `new MyClass.Bare`.
      function Bare() {}
      C.Bare = Bare;
  
      // Set up the prototype of the new class.
      var _super = SuperclassBare[prototype] = _superclass[prototype];
      var proto = Bare[prototype] = C[prototype] = C.p = new SuperclassBare;
  
      // other variables, as a minifier optimization
      var extensions;
  
  
      // set the constructor property on the prototype, for convenience
      proto.constructor = C;
  
      C.mixin = function(def) {
        Bare[prototype] = C[prototype] = P(C, def)[prototype];
        return C;
      };
  
      return (C.open = function(def) {
        extensions = {};
  
        if (isFunction(def)) {
          // call the defining function with all the arguments you need
          // extensions captures the return value.
          extensions = def.call(C, proto, _super, C, _superclass);
        }
        else if (isObject(def)) {
          // if you passed an object instead, we'll take it
          extensions = def;
        }
  
        // ...and extend it
        if (isObject(extensions)) {
          for (var ext in extensions) {
            if (ownProperty.call(extensions, ext)) {
              proto[ext] = extensions[ext];
            }
          }
        }
  
        // if there's no init, we assume we're inheriting a non-pjs class, so
        // we default to applying the superclass's constructor.
        if (!isFunction(proto.init)) {
          proto.init = _superclass;
        }
  
        return C;
      })(definition);
    }
  
    // as a minifier optimization, we've closured in a few helper functions
    // and the string 'prototype' (C[p] is much shorter than C.prototype)
  })('prototype', ({}).hasOwnProperty);
  /*************************************************
   * Base classes of edit tree-related objects
   *
   * Only doing tree node manipulation via these
   * adopt/ disown methods guarantees well-formedness
   * of the tree.
   ************************************************/
  
  // L = 'left'
  // R = 'right'
  //
  // the contract is that they can be used as object properties
  // and (-L) === R, and (-R) === L.
  var L = -1;
  var R = 1;
  
  function prayDirection(dir) {
    pray('a direction was passed', dir === L || dir === R);
  }
  
  /**
   * Tiny extension of jQuery adding directionalized DOM manipulation methods.
   *
   * Funny how Pjs v3 almost just works with `jQuery.fn.init`.
   *
   * jQuery features that don't work on $:
   *   - jQuery.*, like jQuery.ajax, obviously (Pjs doesn't and shouldn't
   *                                            copy constructor properties)
   *
   *   - jQuery(function), the shortcut for `jQuery(document).ready(function)`,
   *     because `jQuery.fn.init` is idiosyncratic and Pjs doing, essentially,
   *     `jQuery.fn.init.apply(this, arguments)` isn't quite right, you need:
   *
   *       _.init = function(s, c) { jQuery.fn.init.call(this, s, c, $(document)); };
   *
   *     if you actually give a shit (really, don't bother),
   *     see https://github.com/jquery/jquery/blob/1.7.2/src/core.js#L889
   *
   *   - jQuery(selector), because jQuery translates that to
   *     `jQuery(document).find(selector)`, but Pjs doesn't (should it?) let
   *     you override the result of a constructor call
   *       + note that because of the jQuery(document) shortcut-ness, there's also
   *         the 3rd-argument-needs-to-be-`$(document)` thing above, but the fix
   *         for that (as can be seen above) is really easy. This problem requires
   *         a way more intrusive fix
   *
   * And that's it! Everything else just magically works because jQuery internally
   * uses `this.constructor()` everywhere (hence calling `$`), but never ever does
   * `this.constructor.find` or anything like that, always doing `jQuery.find`.
   */
  var $ = P(jQuery, function(_) {
    _.insDirOf = function(dir, el) {
      return dir === L ?
        this.insertBefore(el.first()) : this.insertAfter(el.last());
    };
    _.insAtDirEnd = function(dir, el) {
      return dir === L ? this.prependTo(el) : this.appendTo(el);
    };
  });
  
  var Point = P(function(_) {
    _.parent = 0;
    _[L] = 0;
    _[R] = 0;
  
    _.init = function(parent, leftward, rightward) {
      this.parent = parent;
      this[L] = leftward;
      this[R] = rightward;
    };
  
    this.copy = function(pt) {
      return Point(pt.parent, pt[L], pt[R]);
    };
  });
  
  /**
   * MathQuill virtual-DOM tree-node abstract base class
   */
  var Node = P(function(_) {
    _[L] = 0;
    _[R] = 0;
    _.parent = 0;
  
    var id = 0;
    function uniqueNodeId() { return id += 1; }
    this.byId = {};
  
    _.init = function() {
      this.id = uniqueNodeId();
      Node.byId[this.id] = this;
  
      this.ends = {};
      this.ends[L] = 0;
      this.ends[R] = 0;
    };
  
    _.dispose = function() { delete Node.byId[this.id]; };
  
    _.toString = function() { return '{{ MathQuill Node #'+this.id+' }}'; };
  
    _.jQ = $();
    _.jQadd = function(jQ) { return this.jQ = this.jQ.add(jQ); };
    _.jQize = function(jQ) {
      // jQuery-ifies this.html() and links up the .jQ of all corresponding Nodes
      var jQ = $(jQ || this.html());
  
      function jQadd(el) {
        if (el.getAttribute) {
          var cmdId = el.getAttribute('mathquill-command-id');
          var blockId = el.getAttribute('mathquill-block-id');
          if (cmdId) Node.byId[cmdId].jQadd(el);
          if (blockId) Node.byId[blockId].jQadd(el);
        }
        for (el = el.firstChild; el; el = el.nextSibling) {
          jQadd(el);
        }
      }
  
      for (var i = 0; i < jQ.length; i += 1) jQadd(jQ[i]);
      return jQ;
    };
  
    _.createDir = function(dir, cursor) {
      prayDirection(dir);
      var node = this;
      node.jQize();
      node.jQ.insDirOf(dir, cursor.jQ);
      cursor[dir] = node.adopt(cursor.parent, cursor[L], cursor[R]);
      return node;
    };
    _.createLeftOf = function(el) { return this.createDir(L, el); };
  
    _.selectChildren = function(leftEnd, rightEnd) {
      return Selection(leftEnd, rightEnd);
    };
  
    _.bubble = iterator(function(yield_) {
      for (var ancestor = this; ancestor; ancestor = ancestor.parent) {
        var result = yield_(ancestor);
        if (result === false) break;
      }
  
      return this;
    });
  
    _.postOrder = iterator(function(yield_) {
      (function recurse(descendant) {
        descendant.eachChild(recurse);
        yield_(descendant);
      })(this);
  
      return this;
    });
  
    _.isEmpty = function() {
      return this.ends[L] === 0 && this.ends[R] === 0;
    };
  
    _.children = function() {
      return Fragment(this.ends[L], this.ends[R]);
    };
  
    _.eachChild = function() {
      var children = this.children();
      children.each.apply(children, arguments);
      return this;
    };
  
    _.foldChildren = function(fold, fn) {
      return this.children().fold(fold, fn);
    };
  
    _.withDirAdopt = function(dir, parent, withDir, oppDir) {
      Fragment(this, this).withDirAdopt(dir, parent, withDir, oppDir);
      return this;
    };
  
    _.adopt = function(parent, leftward, rightward) {
      Fragment(this, this).adopt(parent, leftward, rightward);
      return this;
    };
  
    _.disown = function() {
      Fragment(this, this).disown();
      return this;
    };
  
    _.remove = function() {
      this.jQ.remove();
      this.postOrder('dispose');
      return this.disown();
    };
  });
  
  function prayWellFormed(parent, leftward, rightward) {
    pray('a parent is always present', parent);
    pray('leftward is properly set up', (function() {
      // either it's empty and `rightward` is the left end child (possibly empty)
      if (!leftward) return parent.ends[L] === rightward;
  
      // or it's there and its [R] and .parent are properly set up
      return leftward[R] === rightward && leftward.parent === parent;
    })());
  
    pray('rightward is properly set up', (function() {
      // either it's empty and `leftward` is the right end child (possibly empty)
      if (!rightward) return parent.ends[R] === leftward;
  
      // or it's there and its [L] and .parent are properly set up
      return rightward[L] === leftward && rightward.parent === parent;
    })());
  }
  
  
  /**
   * An entity outside the virtual tree with one-way pointers (so it's only a
   * "view" of part of the tree, not an actual node/entity in the tree) that
   * delimits a doubly-linked list of sibling nodes.
   * It's like a fanfic love-child between HTML DOM DocumentFragment and the Range
   * classes: like DocumentFragment, its contents must be sibling nodes
   * (unlike Range, whose contents are arbitrary contiguous pieces of subtrees),
   * but like Range, it has only one-way pointers to its contents, its contents
   * have no reference to it and in fact may still be in the visible tree (unlike
   * DocumentFragment, whose contents must be detached from the visible tree
   * and have their 'parent' pointers set to the DocumentFragment).
   */
  var Fragment = P(function(_) {
    _.init = function(withDir, oppDir, dir) {
      if (dir === undefined$1) dir = L;
      prayDirection(dir);
  
      pray('no half-empty fragments', !withDir === !oppDir);
  
      this.ends = {};
  
      if (!withDir) return;
  
      pray('withDir is passed to Fragment', withDir instanceof Node);
      pray('oppDir is passed to Fragment', oppDir instanceof Node);
      pray('withDir and oppDir have the same parent',
           withDir.parent === oppDir.parent);
  
      this.ends[dir] = withDir;
      this.ends[-dir] = oppDir;
  
      // To build the jquery collection for a fragment, accumulate elements
      // into an array and then call jQ.add once on the result. jQ.add sorts the
      // collection according to document order each time it is called, so
      // building a collection by folding jQ.add directly takes more than
      // quadratic time in the number of elements.
      //
      // https://github.com/jquery/jquery/blob/2.1.4/src/traversing.js#L112
      var accum = this.fold([], function (accum, el) {
        accum.push.apply(accum, el.jQ.get());
        return accum;
      });
  
      this.jQ = this.jQ.add(accum);
    };
    _.jQ = $();
  
    // like Cursor::withDirInsertAt(dir, parent, withDir, oppDir)
    _.withDirAdopt = function(dir, parent, withDir, oppDir) {
      return (dir === L ? this.adopt(parent, withDir, oppDir)
                        : this.adopt(parent, oppDir, withDir));
    };
    _.adopt = function(parent, leftward, rightward) {
      prayWellFormed(parent, leftward, rightward);
  
      var self = this;
      self.disowned = false;
  
      var leftEnd = self.ends[L];
      if (!leftEnd) return this;
  
      var rightEnd = self.ends[R];
  
      if (leftward) ; else {
        parent.ends[L] = leftEnd;
      }
  
      if (rightward) {
        rightward[L] = rightEnd;
      } else {
        parent.ends[R] = rightEnd;
      }
  
      self.ends[R][R] = rightward;
  
      self.each(function(el) {
        el[L] = leftward;
        el.parent = parent;
        if (leftward) leftward[R] = el;
  
        leftward = el;
      });
  
      return self;
    };
  
    _.disown = function() {
      var self = this;
      var leftEnd = self.ends[L];
  
      // guard for empty and already-disowned fragments
      if (!leftEnd || self.disowned) return self;
  
      self.disowned = true;
  
      var rightEnd = self.ends[R];
      var parent = leftEnd.parent;
  
      prayWellFormed(parent, leftEnd[L], leftEnd);
      prayWellFormed(parent, rightEnd, rightEnd[R]);
  
      if (leftEnd[L]) {
        leftEnd[L][R] = rightEnd[R];
      } else {
        parent.ends[L] = rightEnd[R];
      }
  
      if (rightEnd[R]) {
        rightEnd[R][L] = leftEnd[L];
      } else {
        parent.ends[R] = leftEnd[L];
      }
  
      return self;
    };
  
    _.remove = function() {
      this.jQ.remove();
      this.each('postOrder', 'dispose');
      return this.disown();
    };
  
    _.each = iterator(function(yield_) {
      var self = this;
      var el = self.ends[L];
      if (!el) return self;
  
      for (; el !== self.ends[R][R]; el = el[R]) {
        var result = yield_(el);
        if (result === false) break;
      }
  
      return self;
    });
  
    _.fold = function(fold, fn) {
      this.each(function(el) {
        fold = fn.call(this, fold, el);
      });
  
      return fold;
    };
  });
  
  
  /**
   * Registry of LaTeX commands and commands created when typing
   * a single character.
   *
   * (Commands are all subclasses of Node.)
   */
  var LatexCmds = {}, CharCmds = {};
  /********************************************
   * Cursor and Selection "singleton" classes
   *******************************************/
  
  /* The main thing that manipulates the Math DOM. Makes sure to manipulate the
  HTML DOM to match. */
  
  /* Sort of singletons, since there should only be one per editable math
  textbox, but any one HTML document can contain many such textboxes, so any one
  JS environment could actually contain many instances. */
  
  //A fake cursor in the fake textbox that the math is rendered in.
  var Cursor = P(Point, function(_) {
    _.init = function(initParent, options) {
      this.parent = initParent;
      this.options = options;
  
      var jQ = this.jQ = this._jQ = $('<span class="mq-cursor">&#8203;</span>');
      //closured for setInterval
      this.blink = function(){ jQ.toggleClass('mq-blink'); };
  
      this.upDownCache = {};
    };
  
    _.show = function() {
      this.jQ = this._jQ.removeClass('mq-blink');
      if ('intervalId' in this) //already was shown, just restart interval
        clearInterval(this.intervalId);
      else { //was hidden and detached, insert this.jQ back into HTML DOM
        if (this[R]) {
          if (this.selection && this.selection.ends[L][L] === this[L])
            this.jQ.insertBefore(this.selection.jQ);
          else
            this.jQ.insertBefore(this[R].jQ.first());
        }
        else
          this.jQ.appendTo(this.parent.jQ);
        this.parent.focus();
      }
      this.intervalId = setInterval(this.blink, 500);
      return this;
    };
    _.hide = function() {
      if ('intervalId' in this)
        clearInterval(this.intervalId);
      delete this.intervalId;
      this.jQ.detach();
      this.jQ = $();
      return this;
    };
  
    _.withDirInsertAt = function(dir, parent, withDir, oppDir) {
      var oldParent = this.parent;
      this.parent = parent;
      this[dir] = withDir;
      this[-dir] = oppDir;
      // by contract, .blur() is called after all has been said and done
      // and the cursor has actually been moved
      if (oldParent !== parent && oldParent.blur) oldParent.blur();
    };
    _.insDirOf = function(dir, el) {
      prayDirection(dir);
      this.jQ.insDirOf(dir, el.jQ);
      this.withDirInsertAt(dir, el.parent, el[dir], el);
      this.parent.jQ.addClass('mq-hasCursor');
      return this;
    };
    _.insLeftOf = function(el) { return this.insDirOf(L, el); };
    _.insRightOf = function(el) { return this.insDirOf(R, el); };
  
    _.insAtDirEnd = function(dir, el) {
      prayDirection(dir);
      this.jQ.insAtDirEnd(dir, el.jQ);
      this.withDirInsertAt(dir, el, 0, el.ends[dir]);
      el.focus();
      return this;
    };
    _.insAtLeftEnd = function(el) { return this.insAtDirEnd(L, el); };
    _.insAtRightEnd = function(el) { return this.insAtDirEnd(R, el); };
  
    /**
     * jump up or down from one block Node to another:
     * - cache the current Point in the node we're jumping from
     * - check if there's a Point in it cached for the node we're jumping to
     *   + if so put the cursor there,
     *   + if not seek a position in the node that is horizontally closest to
     *     the cursor's current position
     */
    _.jumpUpDown = function(from, to) {
      var self = this;
      self.upDownCache[from.id] = Point.copy(self);
      var cached = self.upDownCache[to.id];
      if (cached) {
        cached[R] ? self.insLeftOf(cached[R]) : self.insAtRightEnd(cached.parent);
      }
      else {
        var pageX = self.offset().left;
        to.seek(pageX, self);
      }
    };
    _.offset = function() {
      //in Opera 11.62, .getBoundingClientRect() and hence jQuery::offset()
      //returns all 0's on inline elements with negative margin-right (like
      //the cursor) at the end of their parent, so temporarily remove the
      //negative margin-right when calling jQuery::offset()
      //Opera bug DSK-360043
      //http://bugs.jquery.com/ticket/11523
      //https://github.com/jquery/jquery/pull/717
      var self = this, offset = self.jQ.removeClass('mq-cursor').offset();
      self.jQ.addClass('mq-cursor');
      return offset;
    };
    _.unwrapGramp = function() {
      var gramp = this.parent.parent;
      var greatgramp = gramp.parent;
      var rightward = gramp[R];
      var cursor = this;
  
      var leftward = gramp[L];
      gramp.disown().eachChild(function(uncle) {
        if (uncle.isEmpty()) return;
  
        uncle.children()
          .adopt(greatgramp, leftward, rightward)
          .each(function(cousin) {
            cousin.jQ.insertBefore(gramp.jQ.first());
          })
        ;
  
        leftward = uncle.ends[R];
      });
  
      if (!this[R]) { //then find something to be rightward to insLeftOf
        if (this[L])
          this[R] = this[L][R];
        else {
          while (!this[R]) {
            this.parent = this.parent[R];
            if (this.parent)
              this[R] = this.parent.ends[L];
            else {
              this[R] = gramp[R];
              this.parent = greatgramp;
              break;
            }
          }
        }
      }
      if (this[R])
        this.insLeftOf(this[R]);
      else
        this.insAtRightEnd(greatgramp);
  
      gramp.jQ.remove();
  
      if (gramp[L].siblingDeleted) gramp[L].siblingDeleted(cursor.options, R);
      if (gramp[R].siblingDeleted) gramp[R].siblingDeleted(cursor.options, L);
    };
    _.startSelection = function() {
      var anticursor = this.anticursor = Point.copy(this);
      var ancestors = anticursor.ancestors = {}; // a map from each ancestor of
        // the anticursor, to its child that is also an ancestor; in other words,
        // the anticursor's ancestor chain in reverse order
      for (var ancestor = anticursor; ancestor.parent; ancestor = ancestor.parent) {
        ancestors[ancestor.parent.id] = ancestor;
      }
    };
    _.endSelection = function() {
      delete this.anticursor;
    };
    _.select = function() {
      var anticursor = this.anticursor;
      if (this[L] === anticursor[L] && this.parent === anticursor.parent) return false;
  
      // Find the lowest common ancestor (`lca`), and the ancestor of the cursor
      // whose parent is the LCA (which'll be an end of the selection fragment).
      for (var ancestor = this; ancestor.parent; ancestor = ancestor.parent) {
        if (ancestor.parent.id in anticursor.ancestors) {
          var lca = ancestor.parent;
          break;
        }
      }
      pray('cursor and anticursor in the same tree', lca);
      // The cursor and the anticursor should be in the same tree, because the
      // mousemove handler attached to the document, unlike the one attached to
      // the root HTML DOM element, doesn't try to get the math tree node of the
      // mousemove target, and Cursor::seek() based solely on coordinates stays
      // within the tree of `this` cursor's root.
  
      // The other end of the selection fragment, the ancestor of the anticursor
      // whose parent is the LCA.
      var antiAncestor = anticursor.ancestors[lca.id];
  
      // Now we have two either Nodes or Points, guaranteed to have a common
      // parent and guaranteed that if both are Points, they are not the same,
      // and we have to figure out which is the left end and which the right end
      // of the selection.
      var leftEnd, rightEnd, dir = R;
  
      // This is an extremely subtle algorithm.
      // As a special case, `ancestor` could be a Point and `antiAncestor` a Node
      // immediately to `ancestor`'s left.
      // In all other cases,
      // - both Nodes
      // - `ancestor` a Point and `antiAncestor` a Node
      // - `ancestor` a Node and `antiAncestor` a Point
      // `antiAncestor[R] === rightward[R]` for some `rightward` that is
      // `ancestor` or to its right, if and only if `antiAncestor` is to
      // the right of `ancestor`.
      if (ancestor[L] !== antiAncestor) {
        for (var rightward = ancestor; rightward; rightward = rightward[R]) {
          if (rightward[R] === antiAncestor[R]) {
            dir = L;
            leftEnd = ancestor;
            rightEnd = antiAncestor;
            break;
          }
        }
      }
      if (dir === R) {
        leftEnd = antiAncestor;
        rightEnd = ancestor;
      }
  
      // only want to select Nodes up to Points, can't select Points themselves
      if (leftEnd instanceof Point) leftEnd = leftEnd[R];
      if (rightEnd instanceof Point) rightEnd = rightEnd[L];
  
      this.hide().selection = lca.selectChildren(leftEnd, rightEnd);
      this.insDirOf(dir, this.selection.ends[dir]);
      this.selectionChanged();
      return true;
    };
  
    _.clearSelection = function() {
      if (this.selection) {
        this.selection.clear();
        delete this.selection;
        this.selectionChanged();
      }
      return this;
    };
    _.deleteSelection = function() {
      if (!this.selection) return;
  
      this[L] = this.selection.ends[L][L];
      this[R] = this.selection.ends[R][R];
      this.selection.remove();
      this.selectionChanged();
      delete this.selection;
    };
    _.replaceSelection = function() {
      var seln = this.selection;
      if (seln) {
        this[L] = seln.ends[L][L];
        this[R] = seln.ends[R][R];
        delete this.selection;
      }
      return seln;
    };
  });
  
  var Selection = P(Fragment, function(_, super_) {
    _.init = function() {
      super_.init.apply(this, arguments);
      this.jQ = this.jQ.wrapAll('<span class="mq-selection"></span>').parent();
        //can't do wrapAll(this.jQ = $(...)) because wrapAll will clone it
    };
    _.adopt = function() {
      this.jQ.replaceWith(this.jQ = this.jQ.children());
      return super_.adopt.apply(this, arguments);
    };
    _.clear = function() {
      // using the browser's native .childNodes property so that we
      // don't discard text nodes.
      this.jQ.replaceWith(this.jQ[0].childNodes);
      return this;
    };
    _.join = function(methodName) {
      return this.fold('', function(fold, child) {
        return fold + child[methodName]();
      });
    };
  });
  /*********************************************
   * Controller for a MathQuill instance,
   * on which services are registered with
   *
   *   Controller.open(function(_) { ... });
   *
   ********************************************/
  
  var Controller = P(function(_) {
    _.init = function(root, container, options) {
      this.id = root.id;
      this.data = {};
  
      this.root = root;
      this.container = container;
      this.options = options;
  
      root.controller = this;
  
      this.cursor = root.cursor = Cursor(root, options);
      // TODO: stop depending on root.cursor, and rm it
    };
  
    _.handle = function(name, dir) {
      var handlers = this.options.handlers;
      if (handlers && handlers.fns[name]) {
        var mq = handlers.APIClasses[this.KIND_OF_MQ](this);
        if (dir === L || dir === R) handlers.fns[name](dir, mq);
        else handlers.fns[name](mq);
      }
    };
  
    var notifyees = [];
    this.onNotify = function(f) { notifyees.push(f); };
    _.notify = function() {
      for (var i = 0; i < notifyees.length; i += 1) {
        notifyees[i].apply(this.cursor, arguments);
      }
      return this;
    };
  });
  /*********************************************************
   * The publicly exposed MathQuill API.
   ********************************************************/
  
  var API = {}, Options = P(), optionProcessors = {}, Progenote = P(), EMBEDS = {};
  
  /**
   * Interface Versioning (#459, #495) to allow us to virtually guarantee
   * backcompat. v0.10.x introduces it, so for now, don't completely break the
   * API for people who don't know about it, just complain with console.warn().
   *
   * The methods are shimmed in outro.js so that MQ.MathField.prototype etc can
   * be accessed.
   */
  function insistOnInterVer() {
    if (window.console) console.warn(
      'You are using the MathQuill API without specifying an interface version, ' +
      'which will fail in v1.0.0. You can fix this easily by doing this before ' +
      'doing anything else:\n' +
      '\n' +
      '    MathQuill = MathQuill.getInterface(1);\n' +
      '    // now MathQuill.MathField() works like it used to\n' +
      '\n' +
      'See also the "`dev` branch (2014\u20132015) \u2192 v0.10.0 Migration Guide" at\n' +
      '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
    );
  }
  // globally exported API object
  function MathQuill(el) {
    insistOnInterVer();
    return MQ1(el);
  }  MathQuill.prototype = Progenote.p;
  MathQuill.interfaceVersion = function(v) {
    // shim for #459-era interface versioning (ended with #495)
    if (v !== 1) throw 'Only interface version 1 supported. You specified: ' + v;
    insistOnInterVer = function() {
      if (window.console) console.warn(
        'You called MathQuill.interfaceVersion(1); to specify the interface ' +
        'version, which will fail in v1.0.0. You can fix this easily by doing ' +
        'this before doing anything else:\n' +
        '\n' +
        '    MathQuill = MathQuill.getInterface(1);\n' +
        '    // now MathQuill.MathField() works like it used to\n' +
        '\n' +
        'See also the "`dev` branch (2014\u20132015) \u2192 v0.10.0 Migration Guide" at\n' +
        '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
      );
    };
    insistOnInterVer();
    return MathQuill;
  };
  MathQuill.getInterface = getInterface;
  
  var MIN = getInterface.MIN = 1, MAX = getInterface.MAX = 2;
  function getInterface(v) {
    if (!(MIN <= v && v <= MAX)) throw 'Only interface versions between ' +
      MIN + ' and ' + MAX + ' supported. You specified: ' + v;
  
    /**
     * Function that takes an HTML element and, if it's the root HTML element of a
     * static math or math or text field, returns an API object for it (else, null).
     *
     *   var mathfield = MQ.MathField(mathFieldSpan);
     *   assert(MQ(mathFieldSpan).id === mathfield.id);
     *   assert(MQ(mathFieldSpan).id === MQ(mathFieldSpan).id);
     *
     */
    function MQ(el) {
      if (!el || !el.nodeType) return null; // check that `el` is a HTML element, using the
        // same technique as jQuery: https://github.com/jquery/jquery/blob/679536ee4b7a92ae64a5f58d90e9cc38c001e807/src/core/init.js#L92
      var blockId = $(el).children('.mq-root-block').attr(mqBlockId);
      var ctrlr = blockId && Node.byId[blockId].controller;
      return ctrlr ? APIClasses[ctrlr.KIND_OF_MQ](ctrlr) : null;
    }    var APIClasses = {};
  
    MQ.L = L;
    MQ.R = R;
  
    function config(currentOptions, newOptions) {
      if (newOptions && newOptions.handlers) {
        newOptions.handlers = { fns: newOptions.handlers, APIClasses: APIClasses };
      }
      for (var name in newOptions) if (newOptions.hasOwnProperty(name)) {
        var value = newOptions[name], processor = optionProcessors[name];
        currentOptions[name] = (processor ? processor(value) : value);
      }
    }
    MQ.config = function(opts) { config(Options.p, opts); return this; };
    MQ.registerEmbed = function(name, options) {
      if (!/^[a-z][a-z0-9]*$/i.test(name)) {
        throw 'Embed name must start with letter and be only letters and digits';
      }
      EMBEDS[name] = options;
    };
  
    var AbstractMathQuill = APIClasses.AbstractMathQuill = P(Progenote, function(_) {
      _.init = function(ctrlr) {
        this.__controller = ctrlr;
        this.__options = ctrlr.options;
        this.id = ctrlr.id;
        this.data = ctrlr.data;
      };
      _.__mathquillify = function(classNames) {
        var ctrlr = this.__controller, root = ctrlr.root, el = ctrlr.container;
        ctrlr.createTextarea();
  
        var contents = el.addClass(classNames).contents().detach();
        root.jQ =
          $('<span class="mq-root-block"/>').attr(mqBlockId, root.id).appendTo(el);
        this.latex(contents.text());
  
        this.revert = function() {
          return el.empty().unbind('.mathquill')
          .removeClass('mq-editable-field mq-math-mode mq-text-mode')
          .append(contents);
        };
      };
      _.config = function(opts) { config(this.__options, opts); return this; };
      _.el = function() { return this.__controller.container[0]; };
      _.text = function() { return this.__controller.exportText(); };
      _.latex = function(latex) {
        if (arguments.length > 0) {
          this.__controller.renderLatexMath(latex);
          if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
          return this;
        }
        return this.__controller.exportLatex();
      };
      _.html = function() {
        return this.__controller.root.jQ.html()
          .replace(/ mathquill-(?:command|block)-id="?\d+"?/g, '')
          .replace(/<span class="?mq-cursor( mq-blink)?"?>.?<\/span>/i, '')
          .replace(/ mq-hasCursor|mq-hasCursor ?/, '')
          .replace(/ class=(""|(?= |>))/g, '');
      };
      _.reflow = function() {
        this.__controller.root.postOrder('reflow');
        return this;
      };
    });
    MQ.prototype = AbstractMathQuill.prototype;
  
    APIClasses.EditableField = P(AbstractMathQuill, function(_, super_) {
      _.__mathquillify = function() {
        super_.__mathquillify.apply(this, arguments);
        this.__controller.editable = true;
        this.__controller.delegateMouseEvents();
        this.__controller.editablesTextareaEvents();
        return this;
      };
      _.focus = function() { this.__controller.textarea.focus(); return this; };
      _.blur = function() { this.__controller.textarea.blur(); return this; };
      _.write = function(latex) {
        this.__controller.writeLatex(latex);
        this.__controller.scrollHoriz();
        if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
        return this;
      };
      _.cmd = function(cmd) {
        var ctrlr = this.__controller.notify(), cursor = ctrlr.cursor;
        if (/^\\[a-z]+$/i.test(cmd)) {
          cmd = cmd.slice(1);
          var klass = LatexCmds[cmd];
          if (klass) {
            cmd = klass(cmd);
            if (cursor.selection) cmd.replaces(cursor.replaceSelection());
            cmd.createLeftOf(cursor.show());
            this.__controller.scrollHoriz();
          }
        }
        else cursor.parent.write(cursor, cmd);
        if (ctrlr.blurred) cursor.hide().parent.blur();
        return this;
      };
      _.select = function() {
        var ctrlr = this.__controller;
        ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
        while (ctrlr.cursor[L]) ctrlr.selectLeft();
        return this;
      };
      _.clearSelection = function() {
        this.__controller.cursor.clearSelection();
        return this;
      };
  
      _.moveToDirEnd = function(dir) {
        this.__controller.notify('move').cursor.insAtDirEnd(dir, this.__controller.root);
        return this;
      };
      _.moveToLeftEnd = function() { return this.moveToDirEnd(L); };
      _.moveToRightEnd = function() { return this.moveToDirEnd(R); };
  
      _.keystroke = function(keys) {
        var keys = keys.replace(/^\s+|\s+$/g, '').split(/\s+/);
        for (var i = 0; i < keys.length; i += 1) {
          this.__controller.keystroke(keys[i], { preventDefault: noop });
        }
        return this;
      };
      _.typedText = function(text) {
        for (var i = 0; i < text.length; i += 1) this.__controller.typedText(text.charAt(i));
        return this;
      };
      _.dropEmbedded = function(pageX, pageY, options) {
        var clientX = pageX - $(window).scrollLeft();
        var clientY = pageY - $(window).scrollTop();
  
        var el = document.elementFromPoint(clientX, clientY);
        this.__controller.seek($(el), pageX, pageY);
        var cmd = Embed().setOptions(options);
        cmd.createLeftOf(this.__controller.cursor);
      };
    });
    MQ.EditableField = function() { throw "wtf don't call me, I'm 'abstract'"; };
    MQ.EditableField.prototype = APIClasses.EditableField.prototype;
  
    /**
     * Export the API functions that MathQuill-ify an HTML element into API objects
     * of each class. If the element had already been MathQuill-ified but into a
     * different kind (or it's not an HTML element), return null.
     */
    for (var kind in API) (function(kind, defAPIClass) {
      var APIClass = APIClasses[kind] = defAPIClass(APIClasses);
      MQ[kind] = function(el, opts) {
        var mq = MQ(el);
        if (mq instanceof APIClass || !el || !el.nodeType) return mq;
        var ctrlr = Controller(APIClass.RootBlock(), $(el), Options());
        ctrlr.KIND_OF_MQ = kind;
        return APIClass(ctrlr).__mathquillify(opts, v);
      };
      MQ[kind].prototype = APIClass.prototype;
    }(kind, API[kind]));
  
    return MQ;
  }
  
  MathQuill.noConflict = function() {
    window.MathQuill = origMathQuill;
    return MathQuill;
  };
  var origMathQuill = window.MathQuill;
  window.MathQuill = MathQuill;
  
  function RootBlockMixin(_) {
    var names = 'moveOutOf deleteOutOf selectOutOf upOutOf downOutOf'.split(' ');
    for (var i = 0; i < names.length; i += 1) (function(name) {
      _[name] = function(dir) { this.controller.handle(name, dir); };
    }(names[i]));
    _.reflow = function() {
      this.controller.handle('reflow');
      this.controller.handle('edited');
      this.controller.handle('edit');
    };
  }
  var Parser = P(function(_, super_, Parser) {
    // The Parser object is a wrapper for a parser function.
    // Externally, you use one to parse a string by calling
    //   var result = SomeParser.parse('Me Me Me! Parse Me!');
    // You should never call the constructor, rather you should
    // construct your Parser from the base parsers and the
    // parser combinator methods.
  
    function parseError(stream, message) {
      if (stream) {
        stream = "'"+stream+"'";
      }
      else {
        stream = 'EOF';
      }
  
      throw 'Parse Error: '+message+' at '+stream;
    }
  
    _.init = function(body) { this._ = body; };
  
    _.parse = function(stream) {
      return this.skip(eof)._(''+stream, success, parseError);
  
      function success(stream, result) { return result; }
    };
  
    // -*- primitive combinators -*- //
    _.or = function(alternative) {
      pray('or is passed a parser', alternative instanceof Parser);
  
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        return self._(stream, onSuccess, failure);
  
        function failure(newStream) {
          return alternative._(stream, onSuccess, onFailure);
        }
      });
    };
  
    _.then = function(next) {
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        return self._(stream, success, onFailure);
  
        function success(newStream, result) {
          var nextParser = (next instanceof Parser ? next : next(result));
          pray('a parser is returned', nextParser instanceof Parser);
          return nextParser._(newStream, onSuccess, onFailure);
        }
      });
    };
  
    // -*- optimized iterative combinators -*- //
    _.many = function() {
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        var xs = [];
        while (self._(stream, success, failure));
        return onSuccess(stream, xs);
  
        function success(newStream, x) {
          stream = newStream;
          xs.push(x);
          return true;
        }
  
        function failure() {
          return false;
        }
      });
    };
  
    _.times = function(min, max) {
      if (arguments.length < 2) max = min;
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        var xs = [];
        var result = true;
        var failure;
  
        for (var i = 0; i < min; i += 1) {
          result = self._(stream, success, firstFailure);
          if (!result) return onFailure(stream, failure);
        }
  
        for (; i < max && result; i += 1) {
          result = self._(stream, success, secondFailure);
        }
  
        return onSuccess(stream, xs);
  
        function success(newStream, x) {
          xs.push(x);
          stream = newStream;
          return true;
        }
  
        function firstFailure(newStream, msg) {
          failure = msg;
          stream = newStream;
          return false;
        }
  
        function secondFailure(newStream, msg) {
          return false;
        }
      });
    };
  
    // -*- higher-level combinators -*- //
    _.result = function(res) { return this.then(succeed(res)); };
    _.atMost = function(n) { return this.times(0, n); };
    _.atLeast = function(n) {
      var self = this;
      return self.times(n).then(function(start) {
        return self.many().map(function(end) {
          return start.concat(end);
        });
      });
    };
  
    _.map = function(fn) {
      return this.then(function(result) { return succeed(fn(result)); });
    };
  
    _.skip = function(two) {
      return this.then(function(result) { return two.result(result); });
    };
  
    // -*- primitive parsers -*- //
    var string = this.string = function(str) {
      var len = str.length;
      var expected = "expected '"+str+"'";
  
      return Parser(function(stream, onSuccess, onFailure) {
        var head = stream.slice(0, len);
  
        if (head === str) {
          return onSuccess(stream.slice(len), head);
        }
        else {
          return onFailure(stream, expected);
        }
      });
    };
  
    var regex = this.regex = function(re) {
      pray('regexp parser is anchored', re.toString().charAt(1) === '^');
  
      var expected = 'expected '+re;
  
      return Parser(function(stream, onSuccess, onFailure) {
        var match = re.exec(stream);
  
        if (match) {
          var result = match[0];
          return onSuccess(stream.slice(result.length), result);
        }
        else {
          return onFailure(stream, expected);
        }
      });
    };
  
    var succeed = Parser.succeed = function(result) {
      return Parser(function(stream, onSuccess) {
        return onSuccess(stream, result);
      });
    };
  
    var fail = Parser.fail = function(msg) {
      return Parser(function(stream, _, onFailure) {
        return onFailure(stream, msg);
      });
    };
  
    var letter = Parser.letter = regex(/^[a-z]/i);
    var letters = Parser.letters = regex(/^[a-z]*/i);
    var digit = Parser.digit = regex(/^[0-9]/);
    var digits = Parser.digits = regex(/^[0-9]*/);
    var whitespace = Parser.whitespace = regex(/^\s+/);
    var optWhitespace = Parser.optWhitespace = regex(/^\s*/);
  
    var any = Parser.any = Parser(function(stream, onSuccess, onFailure) {
      if (!stream) return onFailure(stream, 'expected any character');
  
      return onSuccess(stream.slice(1), stream.charAt(0));
    });
  
    var all = Parser.all = Parser(function(stream, onSuccess, onFailure) {
      return onSuccess('', stream);
    });
  
    var eof = Parser.eof = Parser(function(stream, onSuccess, onFailure) {
      if (stream) return onFailure(stream, 'expected EOF');
  
      return onSuccess(stream, stream);
    });
  });
  /*************************************************
   * Sane Keyboard Events Shim
   *
   * An abstraction layer wrapping the textarea in
   * an object with methods to manipulate and listen
   * to events on, that hides all the nasty cross-
   * browser incompatibilities behind a uniform API.
   *
   * Design goal: This is a *HARD* internal
   * abstraction barrier. Cross-browser
   * inconsistencies are not allowed to leak through
   * and be dealt with by event handlers. All future
   * cross-browser issues that arise must be dealt
   * with here, and if necessary, the API updated.
   *
   * Organization:
   * - key values map and stringify()
   * - saneKeyboardEvents()
   *    + defer() and flush()
   *    + event handler logic
   *    + attach event handlers and export methods
   ************************************************/
  
  var saneKeyboardEvents = (function() {
    // The following [key values][1] map was compiled from the
    // [DOM3 Events appendix section on key codes][2] and
    // [a widely cited report on cross-browser tests of key codes][3],
    // except for 10: 'Enter', which I've empirically observed in Safari on iOS
    // and doesn't appear to conflict with any other known key codes.
    //
    // [1]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#keys-keyvalues
    // [2]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#fixed-virtual-key-codes
    // [3]: http://unixpapa.com/js/key.html
    var KEY_VALUES = {
      8: 'Backspace',
      9: 'Tab',
  
      10: 'Enter', // for Safari on iOS
  
      13: 'Enter',
  
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      20: 'CapsLock',
  
      27: 'Esc',
  
      32: 'Spacebar',
  
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
  
      37: 'Left',
      38: 'Up',
      39: 'Right',
      40: 'Down',
  
      45: 'Insert',
  
      46: 'Del',
  
      144: 'NumLock'
    };
  
    // To the extent possible, create a normalized string representation
    // of the key combo (i.e., key code and modifier keys).
    function stringify(evt) {
      var which = evt.which || evt.keyCode;
      var keyVal = KEY_VALUES[which];
      var key;
      var modifiers = [];
  
      if (evt.ctrlKey) modifiers.push('Ctrl');
      if (evt.originalEvent && evt.originalEvent.metaKey) modifiers.push('Meta');
      if (evt.altKey) modifiers.push('Alt');
      if (evt.shiftKey) modifiers.push('Shift');
  
      key = keyVal || String.fromCharCode(which);
  
      if (!modifiers.length && !keyVal) return key;
  
      modifiers.push(key);
      return modifiers.join('-');
    }
  
    // create a keyboard events shim that calls callbacks at useful times
    // and exports useful public methods
    return function saneKeyboardEvents(el, handlers) {
      var keydown = null;
      var keypress = null;
  
      var textarea = jQuery(el);
      var target = jQuery(handlers.container || textarea);
  
      // checkTextareaFor() is called after keypress or paste events to
      // say "Hey, I think something was just typed" or "pasted" (resp.),
      // so that at all subsequent opportune times (next event or timeout),
      // will check for expected typed or pasted text.
      // Need to check repeatedly because #135: in Safari 5.1 (at least),
      // after selecting something and then typing, the textarea is
      // incorrectly reported as selected during the input event (but not
      // subsequently).
      var checkTextarea = noop, timeoutId;
      function checkTextareaFor(checker) {
        checkTextarea = checker;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checker);
      }
      target.bind('keydown keypress input keyup focusout paste', function(e) { checkTextarea(e); });
  
  
      // -*- public methods -*- //
      function select(text) {
        // check textarea at least once/one last time before munging (so
        // no race condition if selection happens after keypress/paste but
        // before checkTextarea), then never again ('cos it's been munged)
        checkTextarea();
        checkTextarea = noop;
        clearTimeout(timeoutId);
  
        textarea.val(text);
        if (text && textarea[0].select) textarea[0].select();
        shouldBeSelected = !!text;
      }
      var shouldBeSelected = false;
  
      // -*- helper subroutines -*- //
  
      // Determine whether there's a selection in the textarea.
      // This will always return false in IE < 9, which don't support
      // HTMLTextareaElement::selection{Start,End}.
      function hasSelection() {
        var dom = textarea[0];
  
        if (!('selectionStart' in dom)) return false;
        return dom.selectionStart !== dom.selectionEnd;
      }
  
      function handleKey() {
        handlers.keystroke(stringify(keydown), keydown);
      }
  
      // -*- event handlers -*- //
      function onKeydown(e) {
        keydown = e;
        keypress = null;
  
        if (shouldBeSelected) checkTextareaFor(function(e) {
          if (!(e && e.type === 'focusout') && textarea[0].select) {
            textarea[0].select(); // re-select textarea in case it's an unrecognized
          }
          checkTextarea = noop; // key that clears the selection, then never
          clearTimeout(timeoutId); // again, 'cos next thing might be blur
        });
  
        handleKey();
      }
  
      function onKeypress(e) {
        // call the key handler for repeated keypresses.
        // This excludes keypresses that happen directly
        // after keydown.  In that case, there will be
        // no previous keypress, so we skip it here
        if (keydown && keypress) handleKey();
  
        keypress = e;
  
        checkTextareaFor(typedText);
      }
      function typedText() {
        // If there is a selection, the contents of the textarea couldn't
        // possibly have just been typed in.
        // This happens in browsers like Firefox and Opera that fire
        // keypress for keystrokes that are not text entry and leave the
        // selection in the textarea alone, such as Ctrl-C.
        // Note: we assume that browsers that don't support hasSelection()
        // also never fire keypress on keystrokes that are not text entry.
        // This seems reasonably safe because:
        // - all modern browsers including IE 9+ support hasSelection(),
        //   making it extremely unlikely any browser besides IE < 9 won't
        // - as far as we know IE < 9 never fires keypress on keystrokes
        //   that aren't text entry, which is only as reliable as our
        //   tests are comprehensive, but the IE < 9 way to do
        //   hasSelection() is poorly documented and is also only as
        //   reliable as our tests are comprehensive
        // If anything like #40 or #71 is reported in IE < 9, see
        // b1318e5349160b665003e36d4eedd64101ceacd8
        if (hasSelection()) return;
  
        var text = textarea.val();
        if (text.length === 1) {
          textarea.val('');
          handlers.typedText(text);
        } // in Firefox, keys that don't type text, just clear seln, fire keypress
        // https://github.com/mathquill/mathquill/issues/293#issuecomment-40997668
        else if (text && textarea[0].select) textarea[0].select(); // re-select if that's why we're here
      }
  
      function onBlur() { keydown = keypress = null; }
  
      function onPaste(e) {
        // browsers are dumb.
        //
        // In Linux, middle-click pasting causes onPaste to be called,
        // when the textarea is not necessarily focused.  We focus it
        // here to ensure that the pasted text actually ends up in the
        // textarea.
        //
        // It's pretty nifty that by changing focus in this handler,
        // we can change the target of the default action.  (This works
        // on keydown too, FWIW).
        //
        // And by nifty, we mean dumb (but useful sometimes).
        textarea.focus();
  
        checkTextareaFor(pastedText);
      }
      function pastedText() {
        var text = textarea.val();
        textarea.val('');
        if (text) handlers.paste(text);
      }
  
      // -*- attach event handlers -*- //
      target.bind({
        keydown: onKeydown,
        keypress: onKeypress,
        focusout: onBlur,
        paste: onPaste
      });
  
      // -*- export public methods -*- //
      return {
        select: select
      };
    };
  }());
  /***********************************************
   * Export math in a human-readable text format
   * As you can see, only half-baked so far.
   **********************************************/
  
  Controller.open(function(_, super_) {
    _.exportText = function() {
      return this.root.foldChildren('', function(text, child) {
        return text + child.text();
      });
    };
  });
  Controller.open(function(_) {
    _.focusBlurEvents = function() {
      var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor;
      var blurTimeout;
      ctrlr.textarea.focus(function() {
        ctrlr.blurred = false;
        clearTimeout(blurTimeout);
        ctrlr.container.addClass('mq-focused');
        if (!cursor.parent)
          cursor.insAtRightEnd(root);
        if (cursor.selection) {
          cursor.selection.jQ.removeClass('mq-blur');
          ctrlr.selectionChanged(); //re-select textarea contents after tabbing away and back
        }
        else
          cursor.show();
      }).blur(function() {
        ctrlr.blurred = true;
        blurTimeout = setTimeout(function() { // wait for blur on window; if
          root.postOrder('intentionalBlur'); // none, intentional blur: #264
          cursor.clearSelection().endSelection();
          blur();
        });
        $(window).on('blur', windowBlur);
      });
      function windowBlur() { // blur event also fired on window, just switching
        clearTimeout(blurTimeout); // tabs/windows, not intentional blur
        if (cursor.selection) cursor.selection.jQ.addClass('mq-blur');
        blur();
      }
      function blur() { // not directly in the textarea blur handler so as to be
        cursor.hide().parent.blur(); // synchronous with/in the same frame as
        ctrlr.container.removeClass('mq-focused'); // clearing/blurring selection
        $(window).off('blur', windowBlur);
      }
      ctrlr.blurred = true;
      cursor.hide().parent.blur();
    };
  });
  
  /**
   * TODO: I wanted to move MathBlock::focus and blur here, it would clean
   * up lots of stuff like, TextBlock::focus is set to MathBlock::focus
   * and TextBlock::blur calls MathBlock::blur, when instead they could
   * use inheritance and super_.
   *
   * Problem is, there's lots of calls to .focus()/.blur() on nodes
   * outside Controller::focusBlurEvents(), such as .postOrder('blur') on
   * insertion, which if MathBlock::blur becomes Node::blur, would add the
   * 'blur' CSS class to all Symbol's (because .isEmpty() is true for all
   * of them).
   *
   * I'm not even sure there aren't other troublesome calls to .focus() or
   * .blur(), so this is TODO for now.
   */
  /*****************************************
   * Deals with the browser DOM events from
   * interaction with the typist.
   ****************************************/
  
  Controller.open(function(_) {
    _.keystroke = function(key, evt) {
      this.cursor.parent.keystroke(key, evt, this);
    };
  });
  
  Node.open(function(_) {
    _.keystroke = function(key, e, ctrlr) {
      var cursor = ctrlr.cursor;
  
      switch (key) {
      case 'Ctrl-Shift-Backspace':
      case 'Ctrl-Backspace':
        ctrlr.ctrlDeleteDir(L);
        break;
  
      case 'Shift-Backspace':
      case 'Backspace':
        ctrlr.backspace();
        break;
  
      // Tab or Esc -> go one block right if it exists, else escape right.
      case 'Esc':
      case 'Tab':
        ctrlr.escapeDir(R, key, e);
        return;
  
      // Shift-Tab -> go one block left if it exists, else escape left.
      case 'Shift-Tab':
      case 'Shift-Esc':
        ctrlr.escapeDir(L, key, e);
        return;
  
      // End -> move to the end of the current block.
      case 'End':
        ctrlr.notify('move').cursor.insAtRightEnd(cursor.parent);
        break;
  
      // Ctrl-End -> move all the way to the end of the root block.
      case 'Ctrl-End':
        ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
        break;
  
      // Shift-End -> select to the end of the current block.
      case 'Shift-End':
        while (cursor[R]) {
          ctrlr.selectRight();
        }
        break;
  
      // Ctrl-Shift-End -> select to the end of the root block.
      case 'Ctrl-Shift-End':
        while (cursor[R] || cursor.parent !== ctrlr.root) {
          ctrlr.selectRight();
        }
        break;
  
      // Home -> move to the start of the root block or the current block.
      case 'Home':
        ctrlr.notify('move').cursor.insAtLeftEnd(cursor.parent);
        break;
  
      // Ctrl-Home -> move to the start of the current block.
      case 'Ctrl-Home':
        ctrlr.notify('move').cursor.insAtLeftEnd(ctrlr.root);
        break;
  
      // Shift-Home -> select to the start of the current block.
      case 'Shift-Home':
        while (cursor[L]) {
          ctrlr.selectLeft();
        }
        break;
  
      // Ctrl-Shift-Home -> move to the start of the root block.
      case 'Ctrl-Shift-Home':
        while (cursor[L] || cursor.parent !== ctrlr.root) {
          ctrlr.selectLeft();
        }
        break;
  
      case 'Left': ctrlr.moveLeft(); break;
      case 'Shift-Left': ctrlr.selectLeft(); break;
      case 'Ctrl-Left': break;
  
      case 'Right': ctrlr.moveRight(); break;
      case 'Shift-Right': ctrlr.selectRight(); break;
      case 'Ctrl-Right': break;
  
      case 'Up': ctrlr.moveUp(); break;
      case 'Down': ctrlr.moveDown(); break;
  
      case 'Shift-Up':
        if (cursor[L]) {
          while (cursor[L]) ctrlr.selectLeft();
        } else {
          ctrlr.selectLeft();
        }
  
      case 'Shift-Down':
        if (cursor[R]) {
          while (cursor[R]) ctrlr.selectRight();
        }
        else {
          ctrlr.selectRight();
        }
  
      case 'Ctrl-Up': break;
      case 'Ctrl-Down': break;
  
      case 'Ctrl-Shift-Del':
      case 'Ctrl-Del':
        ctrlr.ctrlDeleteDir(R);
        break;
  
      case 'Shift-Del':
      case 'Del':
        ctrlr.deleteForward();
        break;
  
      case 'Meta-A':
      case 'Ctrl-A':
        ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
        while (cursor[L]) ctrlr.selectLeft();
        break;
  
      default:
        return;
      }
      e.preventDefault();
      ctrlr.scrollHoriz();
    };
  
    _.moveOutOf = // called by Controller::escapeDir, moveDir
    _.moveTowards = // called by Controller::moveDir
    _.deleteOutOf = // called by Controller::deleteDir
    _.deleteTowards = // called by Controller::deleteDir
    _.unselectInto = // called by Controller::selectDir
    _.selectOutOf = // called by Controller::selectDir
    _.selectTowards = // called by Controller::selectDir
      function() { pray('overridden or never called on this node'); };
  });
  
  Controller.open(function(_) {
    this.onNotify(function(e) {
      if (e === 'move' || e === 'upDown') this.show().clearSelection();
    });
    _.escapeDir = function(dir, key, e) {
      prayDirection(dir);
      var cursor = this.cursor;
  
      // only prevent default of Tab if not in the root editable
      if (cursor.parent !== this.root) e.preventDefault();
  
      // want to be a noop if in the root editable (in fact, Tab has an unrelated
      // default browser action if so)
      if (cursor.parent === this.root) return;
  
      cursor.parent.moveOutOf(dir, cursor);
      return this.notify('move');
    };
  
    optionProcessors.leftRightIntoCmdGoes = function(updown) {
      if (updown && updown !== 'up' && updown !== 'down') {
        throw '"up" or "down" required for leftRightIntoCmdGoes option, '
              + 'got "'+updown+'"';
      }
      return updown;
    };
    _.moveDir = function(dir) {
      prayDirection(dir);
      var cursor = this.cursor, updown = cursor.options.leftRightIntoCmdGoes;
  
      if (cursor.selection) {
        cursor.insDirOf(dir, cursor.selection.ends[dir]);
      }
      else if (cursor[dir]) cursor[dir].moveTowards(dir, cursor, updown);
      else cursor.parent.moveOutOf(dir, cursor, updown);
  
      return this.notify('move');
    };
    _.moveLeft = function() { return this.moveDir(L); };
    _.moveRight = function() { return this.moveDir(R); };
  
    /**
     * moveUp and moveDown have almost identical algorithms:
     * - first check left and right, if so insAtLeft/RightEnd of them
     * - else check the parent's 'upOutOf'/'downOutOf' property:
     *   + if it's a function, call it with the cursor as the sole argument and
     *     use the return value as if it were the value of the property
     *   + if it's a Node, jump up or down into it:
     *     - if there is a cached Point in the block, insert there
     *     - else, seekHoriz within the block to the current x-coordinate (to be
     *       as close to directly above/below the current position as possible)
     *   + unless it's exactly `true`, stop bubbling
     */
    _.moveUp = function() { return moveUpDown(this, 'up'); };
    _.moveDown = function() { return moveUpDown(this, 'down'); };
    function moveUpDown(self, dir) {
      var cursor = self.notify('upDown').cursor;
      var dirInto = dir+'Into', dirOutOf = dir+'OutOf';
      if (cursor[R][dirInto]) cursor.insAtLeftEnd(cursor[R][dirInto]);
      else if (cursor[L][dirInto]) cursor.insAtRightEnd(cursor[L][dirInto]);
      else {
        cursor.parent.bubble(function(ancestor) {
          var prop = ancestor[dirOutOf];
          if (prop) {
            if (typeof prop === 'function') prop = ancestor[dirOutOf](cursor);
            if (prop instanceof Node) cursor.jumpUpDown(ancestor, prop);
            if (prop !== true) return false;
          }
        });
      }
      return self;
    }
    this.onNotify(function(e) { if (e !== 'upDown') this.upDownCache = {}; });
  
    this.onNotify(function(e) { if (e === 'edit') this.show().deleteSelection(); });
    _.deleteDir = function(dir) {
      prayDirection(dir);
      var cursor = this.cursor;
  
      var hadSelection = cursor.selection;
      this.notify('edit'); // deletes selection if present
      if (!hadSelection) {
        if (cursor[dir]) cursor[dir].deleteTowards(dir, cursor);
        else cursor.parent.deleteOutOf(dir, cursor);
      }
  
      if (cursor[L].siblingDeleted) cursor[L].siblingDeleted(cursor.options, R);
      if (cursor[R].siblingDeleted) cursor[R].siblingDeleted(cursor.options, L);
      cursor.parent.bubble('reflow');
  
      return this;
    };
    _.ctrlDeleteDir = function(dir) {
      prayDirection(dir);
      var cursor = this.cursor;
      if (!cursor[L] || cursor.selection) return ctrlr.deleteDir();
  
      this.notify('edit');
      Fragment(cursor.parent.ends[L], cursor[L]).remove();
      cursor.insAtDirEnd(L, cursor.parent);
  
      if (cursor[L].siblingDeleted) cursor[L].siblingDeleted(cursor.options, R);
      if (cursor[R].siblingDeleted) cursor[R].siblingDeleted(cursor.options, L);
      cursor.parent.bubble('reflow');
  
      return this;
    };
    _.backspace = function() { return this.deleteDir(L); };
    _.deleteForward = function() { return this.deleteDir(R); };
  
    this.onNotify(function(e) { if (e !== 'select') this.endSelection(); });
    _.selectDir = function(dir) {
      var cursor = this.notify('select').cursor, seln = cursor.selection;
      prayDirection(dir);
  
      if (!cursor.anticursor) cursor.startSelection();
  
      var node = cursor[dir];
      if (node) {
        // "if node we're selecting towards is inside selection (hence retracting)
        // and is on the *far side* of the selection (hence is only node selected)
        // and the anticursor is *inside* that node, not just on the other side"
        if (seln && seln.ends[dir] === node && cursor.anticursor[-dir] !== node) {
          node.unselectInto(dir, cursor);
        }
        else node.selectTowards(dir, cursor);
      }
      else cursor.parent.selectOutOf(dir, cursor);
  
      cursor.clearSelection();
      cursor.select() || cursor.show();
    };
    _.selectLeft = function() { return this.selectDir(L); };
    _.selectRight = function() { return this.selectDir(R); };
  });
  // Parser MathCommand
  var latexMathParser = (function() {
    function commandToBlock(cmd) {
      var block = MathBlock();
      cmd.adopt(block, 0, 0);
      return block;
    }
    function joinBlocks(blocks) {
      var firstBlock = blocks[0] || MathBlock();
  
      for (var i = 1; i < blocks.length; i += 1) {
        blocks[i].children().adopt(firstBlock, firstBlock.ends[R], 0);
      }
  
      return firstBlock;
    }
  
    var string = Parser.string;
    var regex = Parser.regex;
    var letter = Parser.letter;
    var any = Parser.any;
    var optWhitespace = Parser.optWhitespace;
    var succeed = Parser.succeed;
    var fail = Parser.fail;
  
    // Parsers yielding either MathCommands, or Fragments of MathCommands
    //   (either way, something that can be adopted by a MathBlock)
    var variable = letter.map(function(c) { return Letter(c); });
    var symbol = regex(/^[^${}\\_^]/).map(function(c) { return VanillaSymbol(c); });
  
    var controlSequence =
      regex(/^[^\\a-eg-zA-Z]/) // hotfix #164; match MathBlock::write
      .or(string('\\').then(
        regex(/^[a-z]+/i)
        .or(regex(/^\s+/).result(' '))
        .or(any)
      )).then(function(ctrlSeq) {
        var cmdKlass = LatexCmds[ctrlSeq];
  
        if (cmdKlass) {
          return cmdKlass(ctrlSeq).parser();
        }
        else {
          return fail('unknown command: \\'+ctrlSeq);
        }
      })
    ;
  
    var command =
      controlSequence
      .or(variable)
      .or(symbol)
    ;
  
    // Parsers yielding MathBlocks
    var mathGroup = string('{').then(function() { return mathSequence; }).skip(string('}'));
    var mathBlock = optWhitespace.then(mathGroup.or(command.map(commandToBlock)));
    var mathSequence = mathBlock.many().map(joinBlocks).skip(optWhitespace);
  
    var optMathBlock =
      string('[').then(
        mathBlock.then(function(block) {
          return block.join('latex') !== ']' ? succeed(block) : fail();
        })
        .many().map(joinBlocks).skip(optWhitespace)
      ).skip(string(']'))
    ;
  
    var latexMath = mathSequence;
  
    latexMath.block = mathBlock;
    latexMath.optBlock = optMathBlock;
    return latexMath;
  })();
  
  Controller.open(function(_, super_) {
    _.exportLatex = function() {
      return this.root.latex().replace(/(\\[a-z]+) (?![a-z])/ig,'$1');
    };
    _.writeLatex = function(latex) {
      var cursor = this.notify('edit').cursor;
  
      var all = Parser.all;
      var eof = Parser.eof;
  
      var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);
  
      if (block && !block.isEmpty()) {
        block.children().adopt(cursor.parent, cursor[L], cursor[R]);
        var jQ = block.jQize();
        jQ.insertBefore(cursor.jQ);
        cursor[L] = block.ends[R];
        block.finalizeInsert(cursor.options, cursor);
        if (block.ends[R][R].siblingCreated) block.ends[R][R].siblingCreated(cursor.options, L);
        if (block.ends[L][L].siblingCreated) block.ends[L][L].siblingCreated(cursor.options, R);
        cursor.parent.bubble('reflow');
      }
  
      return this;
    };
    _.renderLatexMath = function(latex) {
      var root = this.root, cursor = this.cursor;
  
      var all = Parser.all;
      var eof = Parser.eof;
  
      var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);
  
      root.eachChild('postOrder', 'dispose');
      root.ends[L] = root.ends[R] = 0;
  
      if (block) {
        block.children().adopt(root, 0, 0);
      }
  
      var jQ = root.jQ;
  
      if (block) {
        var html = block.join('html');
        jQ.html(html);
        root.jQize(jQ.children());
        root.finalizeInsert(cursor.options);
      }
      else {
        jQ.empty();
      }
  
      delete cursor.selection;
      cursor.insAtRightEnd(root);
    };
    _.renderLatexText = function(latex) {
      var root = this.root, cursor = this.cursor;
  
      root.jQ.children().slice(1).remove();
      root.eachChild('postOrder', 'dispose');
      root.ends[L] = root.ends[R] = 0;
      delete cursor.selection;
      cursor.show().insAtRightEnd(root);
  
      var regex = Parser.regex;
      var string = Parser.string;
      var eof = Parser.eof;
      var all = Parser.all;
  
      // Parser RootMathCommand
      var mathMode = string('$').then(latexMathParser)
        // because TeX is insane, math mode doesn't necessarily
        // have to end.  So we allow for the case that math mode
        // continues to the end of the stream.
        .skip(string('$').or(eof))
        .map(function(block) {
          // HACK FIXME: this shouldn't have to have access to cursor
          var rootMathCommand = RootMathCommand(cursor);
  
          rootMathCommand.createBlocks();
          var rootMathBlock = rootMathCommand.ends[L];
          block.children().adopt(rootMathBlock, 0, 0);
  
          return rootMathCommand;
        })
      ;
  
      var escapedDollar = string('\\$').result('$');
      var textChar = escapedDollar.or(regex(/^[^$]/)).map(VanillaSymbol);
      var latexText = mathMode.or(textChar).many();
      var commands = latexText.skip(eof).or(all.result(false)).parse(latex);
  
      if (commands) {
        for (var i = 0; i < commands.length; i += 1) {
          commands[i].adopt(root, root.ends[R], 0);
        }
  
        root.jQize().appendTo(root.jQ);
  
        root.finalizeInsert(cursor.options);
      }
    };
  });
  /********************************************************
   * Deals with mouse events for clicking, drag-to-select
   *******************************************************/
  
  Controller.open(function(_) {
    _.delegateMouseEvents = function() {
      var ultimateRootjQ = this.root.jQ;
      //drag-to-select event handling
      this.container.bind('mousedown.mathquill', function(e) {
        var rootjQ = $(e.target).closest('.mq-root-block');
        var root = Node.byId[rootjQ.attr(mqBlockId) || ultimateRootjQ.attr(mqBlockId)];
        var ctrlr = root.controller, cursor = ctrlr.cursor, blink = cursor.blink;
        var textareaSpan = ctrlr.textareaSpan, textarea = ctrlr.textarea;
  
        var target;
        function mousemove(e) { target = $(e.target); }
        function docmousemove(e) {
          if (!cursor.anticursor) cursor.startSelection();
          ctrlr.seek(target, e.pageX, e.pageY).cursor.select();
          target = undefined$1;
        }
        // outside rootjQ, the MathQuill node corresponding to the target (if any)
        // won't be inside this root, so don't mislead Controller::seek with it
  
        function mouseup(e) {
          cursor.blink = blink;
          if (!cursor.selection) {
            if (ctrlr.editable) {
              cursor.show();
            }
            else {
              textareaSpan.detach();
            }
          }
  
          // delete the mouse handlers now that we're not dragging anymore
          rootjQ.unbind('mousemove', mousemove);
          $(e.target.ownerDocument).unbind('mousemove', docmousemove).unbind('mouseup', mouseup);
        }
  
        if (ctrlr.blurred) {
          if (!ctrlr.editable) rootjQ.prepend(textareaSpan);
          textarea.focus();
        }
        e.preventDefault(); // doesn't work in IE\u22648, but it's a one-line fix:
        e.target.unselectable = true; // http://jsbin.com/yagekiji/1
  
        cursor.blink = noop;
        ctrlr.seek($(e.target), e.pageX, e.pageY).cursor.startSelection();
  
        rootjQ.mousemove(mousemove);
        $(e.target.ownerDocument).mousemove(docmousemove).mouseup(mouseup);
        // listen on document not just body to not only hear about mousemove and
        // mouseup on page outside field, but even outside page, except iframes: https://github.com/mathquill/mathquill/commit/8c50028afcffcace655d8ae2049f6e02482346c5#commitcomment-6175800
      });
    };
  });
  
  Controller.open(function(_) {
    _.seek = function(target, pageX, pageY) {
      var cursor = this.notify('select').cursor;
  
      if (target) {
        var nodeId = target.attr(mqBlockId) || target.attr(mqCmdId);
        if (!nodeId) {
          var targetParent = target.parent();
          nodeId = targetParent.attr(mqBlockId) || targetParent.attr(mqCmdId);
        }
      }
      var node = nodeId ? Node.byId[nodeId] : this.root;
      pray('nodeId is the id of some Node that exists', node);
  
      // don't clear selection until after getting node from target, in case
      // target was selection span, otherwise target will have no parent and will
      // seek from root, which is less accurate (e.g. fraction)
      cursor.clearSelection().show();
  
      node.seek(pageX, cursor);
      this.scrollHoriz(); // before .selectFrom when mouse-selecting, so
                          // always hits no-selection case in scrollHoriz and scrolls slower
      return this;
    };
  });
  /***********************************************
   * Horizontal panning for editable fields that
   * overflow their width
   **********************************************/
  
  Controller.open(function(_) {
    _.scrollHoriz = function() {
      var cursor = this.cursor, seln = cursor.selection;
      var rootRect = this.root.jQ[0].getBoundingClientRect();
      if (!seln) {
        var x = cursor.jQ[0].getBoundingClientRect().left;
        if (x > rootRect.right - 20) var scrollBy = x - (rootRect.right - 20);
        else if (x < rootRect.left + 20) var scrollBy = x - (rootRect.left + 20);
        else return;
      }
      else {
        var rect = seln.jQ[0].getBoundingClientRect();
        var overLeft = rect.left - (rootRect.left + 20);
        var overRight = rect.right - (rootRect.right - 20);
        if (seln.ends[L] === cursor[R]) {
          if (overLeft < 0) var scrollBy = overLeft;
          else if (overRight > 0) {
            if (rect.left - overRight < rootRect.left + 20) var scrollBy = overLeft;
            else var scrollBy = overRight;
          }
          else return;
        }
        else {
          if (overRight > 0) var scrollBy = overRight;
          else if (overLeft < 0) {
            if (rect.right - overLeft > rootRect.right - 20) var scrollBy = overRight;
            else var scrollBy = overLeft;
          }
          else return;
        }
      }
      this.root.jQ.stop().animate({ scrollLeft: '+=' + scrollBy}, 100);
    };
  });
  /*********************************************
   * Manage the MathQuill instance's textarea
   * (as owned by the Controller)
   ********************************************/
  
  Controller.open(function(_) {
    Options.p.substituteTextarea = function() {
      return $('<textarea autocapitalize=off autocomplete=off autocorrect=off ' +
                 'spellcheck=false x-palm-disable-ste-all=true />')[0];
    };
    _.createTextarea = function() {
      var textareaSpan = this.textareaSpan = $('<span class="mq-textarea"></span>'),
        textarea = this.options.substituteTextarea();
      if (!textarea.nodeType) {
        throw 'substituteTextarea() must return a DOM element, got ' + textarea;
      }
      textarea = this.textarea = $(textarea).appendTo(textareaSpan);
  
      var ctrlr = this;
      ctrlr.cursor.selectionChanged = function() { ctrlr.selectionChanged(); };
      ctrlr.container.bind('copy', function() { ctrlr.setTextareaSelection(); });
    };
    _.selectionChanged = function() {
      var ctrlr = this;
      forceIERedraw(ctrlr.container[0]);
  
      // throttle calls to setTextareaSelection(), because setting textarea.value
      // and/or calling textarea.select() can have anomalously bad performance:
      // https://github.com/mathquill/mathquill/issues/43#issuecomment-1399080
      if (ctrlr.textareaSelectionTimeout === undefined$1) {
        ctrlr.textareaSelectionTimeout = setTimeout(function() {
          ctrlr.setTextareaSelection();
        });
      }
    };
    _.setTextareaSelection = function() {
      this.textareaSelectionTimeout = undefined$1;
      var latex = '';
      if (this.cursor.selection) {
        latex = this.cursor.selection.join('latex');
        if (this.options.statelessClipboard) {
          // FIXME: like paste, only this works for math fields; should ask parent
          latex = '$' + latex + '$';
        }
      }
      this.selectFn(latex);
    };
    _.staticMathTextareaEvents = function() {
      var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor,
        textarea = ctrlr.textarea, textareaSpan = ctrlr.textareaSpan;
  
      this.container.prepend('<span class="mq-selectable">$'+ctrlr.exportLatex()+'$</span>');
      ctrlr.blurred = true;
      textarea.bind('cut paste', false)
      .focus(function() { ctrlr.blurred = false; }).blur(function() {
        if (cursor.selection) cursor.selection.clear();
        setTimeout(detach); //detaching during blur explodes in WebKit
      });
      function detach() {
        textareaSpan.detach();
        ctrlr.blurred = true;
      }
  
      ctrlr.selectFn = function(text) {
        textarea.val(text);
        if (text) textarea.select();
      };
    };
    _.editablesTextareaEvents = function() {
      var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor,
        textarea = ctrlr.textarea, textareaSpan = ctrlr.textareaSpan;
  
      var keyboardEventsShim = saneKeyboardEvents(textarea, this);
      this.selectFn = function(text) { keyboardEventsShim.select(text); };
  
      this.container.prepend(textareaSpan)
      .on('cut', function(e) {
        if (cursor.selection) {
          setTimeout(function() {
            ctrlr.notify('edit'); // deletes selection if present
            cursor.parent.bubble('reflow');
          });
        }
      });
  
      this.focusBlurEvents();
    };
    _.typedText = function(ch) {
      if (ch === '\n') return this.handle('enter');
      var cursor = this.notify().cursor;
      cursor.parent.write(cursor, ch);
      this.scrollHoriz();
    };
    _.paste = function(text) {
      // TODO: document `statelessClipboard` config option in README, after
      // making it work like it should, that is, in both text and math mode
      // (currently only works in math fields, so worse than pointless, it
      //  only gets in the way by \text{}-ifying pasted stuff and $-ifying
      //  cut/copied LaTeX)
      if (this.options.statelessClipboard) {
        if (text.slice(0,1) === '$' && text.slice(-1) === '$') {
          text = text.slice(1, -1);
        }
        else {
          text = '\\text{'+text+'}';
        }
      }
      // FIXME: this always inserts math or a TextBlock, even in a RootTextBlock
      this.writeLatex(text).cursor.show();
    };
  });
  /*************************************************
   * Abstract classes of math blocks and commands.
   ************************************************/
  
  /**
   * Math tree node base class.
   * Some math-tree-specific extensions to Node.
   * Both MathBlock's and MathCommand's descend from it.
   */
  var MathElement = P(Node, function(_, super_) {
    _.finalizeInsert = function(options, cursor) { // `cursor` param is only for
        // SupSub::contactWeld, and is deliberately only passed in by writeLatex,
        // see ea7307eb4fac77c149a11ffdf9a831df85247693
      var self = this;
      self.postOrder('finalizeTree', options);
      self.postOrder('contactWeld', cursor);
  
      // note: this order is important.
      // empty elements need the empty box provided by blur to
      // be present in order for their dimensions to be measured
      // correctly by 'reflow' handlers.
      self.postOrder('blur');
  
      self.postOrder('reflow');
      if (self[R].siblingCreated) self[R].siblingCreated(options, L);
      if (self[L].siblingCreated) self[L].siblingCreated(options, R);
      self.bubble('reflow');
    };
  });
  
  /**
   * Commands and operators, like subscripts, exponents, or fractions.
   * Descendant commands are organized into blocks.
   */
  var MathCommand = P(MathElement, function(_, super_) {
    _.init = function(ctrlSeq, htmlTemplate, textTemplate) {
      var cmd = this;
      super_.init.call(cmd);
  
      if (!cmd.ctrlSeq) cmd.ctrlSeq = ctrlSeq;
      if (htmlTemplate) cmd.htmlTemplate = htmlTemplate;
      if (textTemplate) cmd.textTemplate = textTemplate;
    };
  
    // obvious methods
    _.replaces = function(replacedFragment) {
      replacedFragment.disown();
      this.replacedFragment = replacedFragment;
    };
    _.isEmpty = function() {
      return this.foldChildren(true, function(isEmpty, child) {
        return isEmpty && child.isEmpty();
      });
    };
  
    _.parser = function() {
      var block = latexMathParser.block;
      var self = this;
  
      return block.times(self.numBlocks()).map(function(blocks) {
        self.blocks = blocks;
  
        for (var i = 0; i < blocks.length; i += 1) {
          blocks[i].adopt(self, self.ends[R], 0);
        }
  
        return self;
      });
    };
  
    // createLeftOf(cursor) and the methods it calls
    _.createLeftOf = function(cursor) {
      var cmd = this;
      var replacedFragment = cmd.replacedFragment;
  
      cmd.createBlocks();
      super_.createLeftOf.call(cmd, cursor);
      if (replacedFragment) {
        replacedFragment.adopt(cmd.ends[L], 0, 0);
        replacedFragment.jQ.appendTo(cmd.ends[L].jQ);
      }
      cmd.finalizeInsert(cursor.options);
      cmd.placeCursor(cursor);
    };
    _.createBlocks = function() {
      var cmd = this,
        numBlocks = cmd.numBlocks(),
        blocks = cmd.blocks = Array(numBlocks);
  
      for (var i = 0; i < numBlocks; i += 1) {
        var newBlock = blocks[i] = MathBlock();
        newBlock.adopt(cmd, cmd.ends[R], 0);
      }
    };
    _.placeCursor = function(cursor) {
      //insert the cursor at the right end of the first empty child, searching
      //left-to-right, or if none empty, the right end child
      cursor.insAtRightEnd(this.foldChildren(this.ends[L], function(leftward, child) {
        return leftward.isEmpty() ? leftward : child;
      }));
    };
  
    // editability methods: called by the cursor for editing, cursor movements,
    // and selection of the MathQuill tree, these all take in a direction and
    // the cursor
    _.moveTowards = function(dir, cursor, updown) {
      var updownInto = updown && this[updown+'Into'];
      cursor.insAtDirEnd(-dir, updownInto || this.ends[-dir]);
    };
    _.deleteTowards = function(dir, cursor) {
      if (this.isEmpty()) cursor[dir] = this.remove()[dir];
      else this.moveTowards(dir, cursor, null);
    };
    _.selectTowards = function(dir, cursor) {
      cursor[-dir] = this;
      cursor[dir] = this[dir];
    };
    _.selectChildren = function() {
      return Selection(this, this);
    };
    _.unselectInto = function(dir, cursor) {
      cursor.insAtDirEnd(-dir, cursor.anticursor.ancestors[this.id]);
    };
    _.seek = function(pageX, cursor) {
      function getBounds(node) {
        var bounds = {};
        bounds[L] = node.jQ.offset().left;
        bounds[R] = bounds[L] + node.jQ.outerWidth();
        return bounds;
      }
  
      var cmd = this;
      var cmdBounds = getBounds(cmd);
  
      if (pageX < cmdBounds[L]) return cursor.insLeftOf(cmd);
      if (pageX > cmdBounds[R]) return cursor.insRightOf(cmd);
  
      var leftLeftBound = cmdBounds[L];
      cmd.eachChild(function(block) {
        var blockBounds = getBounds(block);
        if (pageX < blockBounds[L]) {
          // closer to this block's left bound, or the bound left of that?
          if (pageX - leftLeftBound < blockBounds[L] - pageX) {
            if (block[L]) cursor.insAtRightEnd(block[L]);
            else cursor.insLeftOf(cmd);
          }
          else cursor.insAtLeftEnd(block);
          return false;
        }
        else if (pageX > blockBounds[R]) {
          if (block[R]) leftLeftBound = blockBounds[R]; // continue to next block
          else { // last (rightmost) block
            // closer to this block's right bound, or the cmd's right bound?
            if (cmdBounds[R] - pageX < pageX - blockBounds[R]) {
              cursor.insRightOf(cmd);
            }
            else cursor.insAtRightEnd(block);
          }
        }
        else {
          block.seek(pageX, cursor);
          return false;
        }
      });
    };
  
    // methods involved in creating and cross-linking with HTML DOM nodes
    /*
      They all expect an .htmlTemplate like
        '<span>&0</span>'
      or
        '<span><span>&0</span><span>&1</span></span>'
  
      See html.test.js for more examples.
  
      Requirements:
      - For each block of the command, there must be exactly one "block content
        marker" of the form '&<number>' where <number> is the 0-based index of the
        block. (Like the LaTeX \newcommand syntax, but with a 0-based rather than
        1-based index, because JavaScript because C because Dijkstra.)
      - The block content marker must be the sole contents of the containing
        element, there can't even be surrounding whitespace, or else we can't
        guarantee sticking to within the bounds of the block content marker when
        mucking with the HTML DOM.
      - The HTML not only must be well-formed HTML (of course), but also must
        conform to the XHTML requirements on tags, specifically all tags must
        either be self-closing (like '<br/>') or come in matching pairs.
        Close tags are never optional.
  
      Note that &<number> isn't well-formed HTML; if you wanted a literal '&123',
      your HTML template would have to have '&amp;123'.
    */
    _.numBlocks = function() {
      var matches = this.htmlTemplate.match(/&\d+/g);
      return matches ? matches.length : 0;
    };
    _.html = function() {
      // Render the entire math subtree rooted at this command, as HTML.
      // Expects .createBlocks() to have been called already, since it uses the
      // .blocks array of child blocks.
      //
      // See html.test.js for example templates and intended outputs.
      //
      // Given an .htmlTemplate as described above,
      // - insert the mathquill-command-id attribute into all top-level tags,
      //   which will be used to set this.jQ in .jQize().
      //   This is straightforward:
      //     * tokenize into tags and non-tags
      //     * loop through top-level tokens:
      //         * add #cmdId attribute macro to top-level self-closing tags
      //         * else add #cmdId attribute macro to top-level open tags
      //             * skip the matching top-level close tag and all tag pairs
      //               in between
      // - for each block content marker,
      //     + replace it with the contents of the corresponding block,
      //       rendered as HTML
      //     + insert the mathquill-block-id attribute into the containing tag
      //   This is even easier, a quick regex replace, since block tags cannot
      //   contain anything besides the block content marker.
      //
      // Two notes:
      // - The outermost loop through top-level tokens should never encounter any
      //   top-level close tags, because we should have first encountered a
      //   matching top-level open tag, all inner tags should have appeared in
      //   matching pairs and been skipped, and then we should have skipped the
      //   close tag in question.
      // - All open tags should have matching close tags, which means our inner
      //   loop should always encounter a close tag and drop nesting to 0. If
      //   a close tag is missing, the loop will continue until i >= tokens.length
      //   and token becomes undefined. This will not infinite loop, even in
      //   production without pray(), because it will then TypeError on .slice().
  
      var cmd = this;
      var blocks = cmd.blocks;
      var cmdId = ' mathquill-command-id=' + cmd.id;
      var tokens = cmd.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);
  
      pray('no unmatched angle brackets', tokens.join('') === this.htmlTemplate);
  
      // add cmdId to all top-level tags
      for (var i = 0, token = tokens[0]; token; i += 1, token = tokens[i]) {
        // top-level self-closing tags
        if (token.slice(-2) === '/>') {
          tokens[i] = token.slice(0,-2) + cmdId + '/>';
        }
        // top-level open tags
        else if (token.charAt(0) === '<') {
          pray('not an unmatched top-level close tag', token.charAt(1) !== '/');
  
          tokens[i] = token.slice(0,-1) + cmdId + '>';
  
          // skip matching top-level close tag and all tag pairs in between
          var nesting = 1;
          do {
            i += 1, token = tokens[i];
            pray('no missing close tags', token);
            // close tags
            if (token.slice(0,2) === '</') {
              nesting -= 1;
            }
            // non-self-closing open tags
            else if (token.charAt(0) === '<' && token.slice(-2) !== '/>') {
              nesting += 1;
            }
          } while (nesting > 0);
        }
      }
      return tokens.join('').replace(/>&(\d+)/g, function($0, $1) {
        return ' mathquill-block-id=' + blocks[$1].id + '>' + blocks[$1].join('html');
      });
    };
  
    // methods to export a string representation of the math tree
    _.latex = function() {
      return this.foldChildren(this.ctrlSeq, function(latex, child) {
        return latex + '{' + (child.latex() || ' ') + '}';
      });
    };
    _.textTemplate = [''];
    _.text = function() {
      var cmd = this, i = 0;
      return cmd.foldChildren(cmd.textTemplate[i], function(text, child) {
        i += 1;
        var child_text = child.text();
        if (text && cmd.textTemplate[i] === '('
            && child_text[0] === '(' && child_text.slice(-1) === ')')
          return text + child_text.slice(1, -1) + cmd.textTemplate[i];
        return text + child.text() + (cmd.textTemplate[i] || '');
      });
    };
  });
  
  /**
   * Lightweight command without blocks or children.
   */
  var Symbol = P(MathCommand, function(_, super_) {
    _.init = function(ctrlSeq, html, text) {
      if (!text) text = ctrlSeq && ctrlSeq.length > 1 ? ctrlSeq.slice(1) : ctrlSeq;
  
      super_.init.call(this, ctrlSeq, html, [ text ]);
    };
  
    _.parser = function() { return Parser.succeed(this); };
    _.numBlocks = function() { return 0; };
  
    _.replaces = function(replacedFragment) {
      replacedFragment.remove();
    };
    _.createBlocks = noop;
  
    _.moveTowards = function(dir, cursor) {
      cursor.jQ.insDirOf(dir, this.jQ);
      cursor[-dir] = this;
      cursor[dir] = this[dir];
    };
    _.deleteTowards = function(dir, cursor) {
      cursor[dir] = this.remove()[dir];
    };
    _.seek = function(pageX, cursor) {
      // insert at whichever side the click was closer to
      if (pageX - this.jQ.offset().left < this.jQ.outerWidth()/2)
        cursor.insLeftOf(this);
      else
        cursor.insRightOf(this);
    };
  
    _.latex = function(){ return this.ctrlSeq; };
    _.text = function(){ return this.textTemplate; };
    _.placeCursor = noop;
    _.isEmpty = function(){ return true; };
  });
  var VanillaSymbol = P(Symbol, function(_, super_) {
    _.init = function(ch, html) {
      super_.init.call(this, ch, '<span>'+(html || ch)+'</span>');
    };
  });
  var BinaryOperator = P(Symbol, function(_, super_) {
    _.init = function(ctrlSeq, html, text) {
      super_.init.call(this,
        ctrlSeq, '<span class="mq-binary-operator">'+html+'</span>', text
      );
    };
  });
  
  /**
   * Children and parent of MathCommand's. Basically partitions all the
   * symbols and operators that descend (in the Math DOM tree) from
   * ancestor operators.
   */
  var MathBlock = P(MathElement, function(_, super_) {
    _.join = function(methodName) {
      return this.foldChildren('', function(fold, child) {
        return fold + child[methodName]();
      });
    };
    _.html = function() { return this.join('html'); };
    _.latex = function() { return this.join('latex'); };
    _.text = function() {
      return (this.ends[L] === this.ends[R] && this.ends[L] !== 0) ?
        this.ends[L].text() :
        this.join('text')
      ;
    };
  
    _.keystroke = function(key, e, ctrlr) {
      if (ctrlr.options.spaceBehavesLikeTab
          && (key === 'Spacebar' || key === 'Shift-Spacebar')) {
        e.preventDefault();
        ctrlr.escapeDir(key === 'Shift-Spacebar' ? L : R, key, e);
        return;
      }
      return super_.keystroke.apply(this, arguments);
    };
  
    // editability methods: called by the cursor for editing, cursor movements,
    // and selection of the MathQuill tree, these all take in a direction and
    // the cursor
    _.moveOutOf = function(dir, cursor, updown) {
      var updownInto = updown && this.parent[updown+'Into'];
      if (!updownInto && this[dir]) cursor.insAtDirEnd(-dir, this[dir]);
      else cursor.insDirOf(dir, this.parent);
    };
    _.selectOutOf = function(dir, cursor) {
      cursor.insDirOf(dir, this.parent);
    };
    _.deleteOutOf = function(dir, cursor) {
      cursor.unwrapGramp();
    };
    _.seek = function(pageX, cursor) {
      var node = this.ends[R];
      if (!node || node.jQ.offset().left + node.jQ.outerWidth() < pageX) {
        return cursor.insAtRightEnd(this);
      }
      if (pageX < this.ends[L].jQ.offset().left) return cursor.insAtLeftEnd(this);
      while (pageX < node.jQ.offset().left) node = node[L];
      return node.seek(pageX, cursor);
    };
    _.chToCmd = function(ch) {
      var cons;
      // exclude f because it gets a dedicated command with more spacing
      if (ch.match(/^[a-eg-zA-Z]$/))
        return Letter(ch);
      else if (/^\d$/.test(ch))
        return Digit(ch);
      else if (cons = CharCmds[ch] || LatexCmds[ch])
        return cons(ch);
      else
        return VanillaSymbol(ch);
    };
    _.write = function(cursor, ch) {
      var cmd = this.chToCmd(ch);
      if (cursor.selection) cmd.replaces(cursor.replaceSelection());
      cmd.createLeftOf(cursor.show());
    };
  
    _.focus = function() {
      this.jQ.addClass('mq-hasCursor');
      this.jQ.removeClass('mq-empty');
  
      return this;
    };
    _.blur = function() {
      this.jQ.removeClass('mq-hasCursor');
      if (this.isEmpty())
        this.jQ.addClass('mq-empty');
  
      return this;
    };
  });
  
  API.StaticMath = function(APIClasses) {
    return P(APIClasses.AbstractMathQuill, function(_, super_) {
      this.RootBlock = MathBlock;
      _.__mathquillify = function() {
        super_.__mathquillify.call(this, 'mq-math-mode');
        this.__controller.delegateMouseEvents();
        this.__controller.staticMathTextareaEvents();
        return this;
      };
      _.init = function() {
        super_.init.apply(this, arguments);
        this.__controller.root.postOrder(
          'registerInnerField', this.innerFields = [], APIClasses.MathField);
      };
      _.latex = function() {
        var returned = super_.latex.apply(this, arguments);
        if (arguments.length > 0) {
          this.__controller.root.postOrder(
            'registerInnerField', this.innerFields = [], APIClasses.MathField);
        }
        return returned;
      };
    });
  };
  
  var RootMathBlock = P(MathBlock, RootBlockMixin);
  API.MathField = function(APIClasses) {
    return P(APIClasses.EditableField, function(_, super_) {
      this.RootBlock = RootMathBlock;
      _.__mathquillify = function(opts, interfaceVersion) {
        this.config(opts);
        if (interfaceVersion > 1) this.__controller.root.reflow = noop;
        super_.__mathquillify.call(this, 'mq-editable-field mq-math-mode');
        delete this.__controller.root.reflow;
        return this;
      };
    });
  };
  /*************************************************
   * Abstract classes of text blocks
   ************************************************/
  
  /**
   * Blocks of plain text, with one or two TextPiece's as children.
   * Represents flat strings of typically serif-font Roman characters, as
   * opposed to hierchical, nested, tree-structured math.
   * Wraps a single HTMLSpanElement.
   */
  var TextBlock = P(Node, function(_, super_) {
    _.ctrlSeq = '\\text';
  
    _.replaces = function(replacedText) {
      if (replacedText instanceof Fragment)
        this.replacedText = replacedText.remove().jQ.text();
      else if (typeof replacedText === 'string')
        this.replacedText = replacedText;
    };
  
    _.jQadd = function(jQ) {
      super_.jQadd.call(this, jQ);
      if (this.ends[L]) this.ends[L].jQadd(this.jQ[0].firstChild);
    };
  
    _.createLeftOf = function(cursor) {
      var textBlock = this;
      super_.createLeftOf.call(this, cursor);
  
      if (textBlock[R].siblingCreated) textBlock[R].siblingCreated(cursor.options, L);
      if (textBlock[L].siblingCreated) textBlock[L].siblingCreated(cursor.options, R);
      textBlock.bubble('reflow');
  
      cursor.insAtRightEnd(textBlock);
  
      if (textBlock.replacedText)
        for (var i = 0; i < textBlock.replacedText.length; i += 1)
          textBlock.write(cursor, textBlock.replacedText.charAt(i));
    };
  
    _.parser = function() {
      var textBlock = this;
  
      // TODO: correctly parse text mode
      var string = Parser.string;
      var regex = Parser.regex;
      var optWhitespace = Parser.optWhitespace;
      return optWhitespace
        .then(string('{')).then(regex(/^[^}]*/)).skip(string('}'))
        .map(function(text) {
          // TODO: is this the correct behavior when parsing
          // the latex \text{} ?  This violates the requirement that
          // the text contents are always nonempty.  Should we just
          // disown the parent node instead?
          TextPiece(text).adopt(textBlock, 0, 0);
          return textBlock;
        })
      ;
    };
  
    _.textContents = function() {
      return this.foldChildren('', function(text, child) {
        return text + child.text;
      });
    };
    _.text = function() { return '"' + this.textContents() + '"'; };
    _.latex = function() { return '\\text{' + this.textContents() + '}'; };
    _.html = function() {
      return (
          '<span class="mq-text-mode" mathquill-command-id='+this.id+'>'
        +   this.textContents()
        + '</span>'
      );
    };
  
    // editability methods: called by the cursor for editing, cursor movements,
    // and selection of the MathQuill tree, these all take in a direction and
    // the cursor
    _.moveTowards = function(dir, cursor) { cursor.insAtDirEnd(-dir, this); };
    _.moveOutOf = function(dir, cursor) { cursor.insDirOf(dir, this); };
    _.unselectInto = _.moveTowards;
  
    // TODO: make these methods part of a shared mixin or something.
    _.selectTowards = MathCommand.prototype.selectTowards;
    _.deleteTowards = MathCommand.prototype.deleteTowards;
  
    _.selectOutOf = function(dir, cursor) {
      cursor.insDirOf(dir, this);
    };
    _.deleteOutOf = function(dir, cursor) {
      // backspace and delete at ends of block don't unwrap
      if (this.isEmpty()) cursor.insRightOf(this);
    };
    _.write = function(cursor, ch) {
      cursor.show().deleteSelection();
  
      if (ch !== '$') {
        if (!cursor[L]) TextPiece(ch).createLeftOf(cursor);
        else cursor[L].appendText(ch);
      }
      else if (this.isEmpty()) {
        cursor.insRightOf(this);
        VanillaSymbol('\\$','$').createLeftOf(cursor);
      }
      else if (!cursor[R]) cursor.insRightOf(this);
      else if (!cursor[L]) cursor.insLeftOf(this);
      else { // split apart
        var leftBlock = TextBlock();
        var leftPc = this.ends[L];
        leftPc.disown();
        leftPc.adopt(leftBlock, 0, 0);
  
        cursor.insLeftOf(this);
        super_.createLeftOf.call(leftBlock, cursor);
      }
    };
  
    _.seek = function(pageX, cursor) {
      cursor.hide();
      var textPc = fuseChildren(this);
  
      // insert cursor at approx position in DOMTextNode
      var avgChWidth = this.jQ.width()/this.text.length;
      var approxPosition = Math.round((pageX - this.jQ.offset().left)/avgChWidth);
      if (approxPosition <= 0) cursor.insAtLeftEnd(this);
      else if (approxPosition >= textPc.text.length) cursor.insAtRightEnd(this);
      else cursor.insLeftOf(textPc.splitRight(approxPosition));
  
      // move towards mousedown (pageX)
      var displ = pageX - cursor.show().offset().left; // displacement
      var dir = displ && displ < 0 ? L : R;
      var prevDispl = dir;
      // displ * prevDispl > 0 iff displacement direction === previous direction
      while (cursor[dir] && displ * prevDispl > 0) {
        cursor[dir].moveTowards(dir, cursor);
        prevDispl = displ;
        displ = pageX - cursor.offset().left;
      }
      if (dir*displ < -dir*prevDispl) cursor[-dir].moveTowards(-dir, cursor);
  
      if (!cursor.anticursor) {
        // about to start mouse-selecting, the anticursor is gonna get put here
        this.anticursorPosition = cursor[L] && cursor[L].text.length;
        // ^ get it? 'cos if there's no cursor[L], it's 0... I'm a terrible person.
      }
      else if (cursor.anticursor.parent === this) {
        // mouse-selecting within this TextBlock, re-insert the anticursor
        var cursorPosition = cursor[L] && cursor[L].text.length;        if (this.anticursorPosition === cursorPosition) {
          cursor.anticursor = Point.copy(cursor);
        }
        else {
          if (this.anticursorPosition < cursorPosition) {
            var newTextPc = cursor[L].splitRight(this.anticursorPosition);
            cursor[L] = newTextPc;
          }
          else {
            var newTextPc = cursor[R].splitRight(this.anticursorPosition - cursorPosition);
          }
          cursor.anticursor = Point(this, newTextPc[L], newTextPc);
        }
      }
    };
  
    _.blur = function() {
      MathBlock.prototype.blur.call(this);
      fuseChildren(this);
    };
  
    function fuseChildren(self) {
      self.jQ[0].normalize();
  
      var textPcDom = self.jQ[0].firstChild;
      pray('only node in TextBlock span is Text node', textPcDom.nodeType === 3);
      // nodeType === 3 has meant a Text node since ancient times:
      //   http://reference.sitepoint.com/javascript/Node/nodeType
  
      var textPc = TextPiece(textPcDom.data);
      textPc.jQadd(textPcDom);
  
      self.children().disown();
      return textPc.adopt(self, 0, 0);
    }
  
    _.focus = MathBlock.prototype.focus;
  });
  
  /**
   * Piece of plain text, with a TextBlock as a parent and no children.
   * Wraps a single DOMTextNode.
   * For convenience, has a .text property that's just a JavaScript string
   * mirroring the text contents of the DOMTextNode.
   * Text contents must always be nonempty.
   */
  var TextPiece = P(Node, function(_, super_) {
    _.init = function(text) {
      super_.init.call(this);
      this.text = text;
    };
    _.jQadd = function(dom) { this.dom = dom; this.jQ = $(dom); };
    _.jQize = function() {
      return this.jQadd(document.createTextNode(this.text));
    };
    _.appendText = function(text) {
      this.text += text;
      this.dom.appendData(text);
    };
    _.prependText = function(text) {
      this.text = text + this.text;
      this.dom.insertData(0, text);
    };
    _.insTextAtDirEnd = function(text, dir) {
      prayDirection(dir);
      if (dir === R) this.appendText(text);
      else this.prependText(text);
    };
    _.splitRight = function(i) {
      var newPc = TextPiece(this.text.slice(i)).adopt(this.parent, this, this[R]);
      newPc.jQadd(this.dom.splitText(i));
      this.text = this.text.slice(0, i);
      return newPc;
    };
  
    function endChar(dir, text) {
      return text.charAt(dir === L ? 0 : -1 + text.length);
    }
  
    _.moveTowards = function(dir, cursor) {
      prayDirection(dir);
  
      var ch = endChar(-dir, this.text);
  
      var from = this[-dir];
      if (from) from.insTextAtDirEnd(ch, dir);
      else TextPiece(ch).createDir(-dir, cursor);
  
      return this.deleteTowards(dir, cursor);
    };
  
    _.latex = function() { return this.text; };
  
    _.deleteTowards = function(dir, cursor) {
      if (this.text.length > 1) {
        if (dir === R) {
          this.dom.deleteData(0, 1);
          this.text = this.text.slice(1);
        }
        else {
          // note that the order of these 2 lines is annoyingly important
          // (the second line mutates this.text.length)
          this.dom.deleteData(-1 + this.text.length, 1);
          this.text = this.text.slice(0, -1);
        }
      }
      else {
        this.remove();
        this.jQ.remove();
        cursor[dir] = this[dir];
      }
    };
  
    _.selectTowards = function(dir, cursor) {
      prayDirection(dir);
      var anticursor = cursor.anticursor;
  
      var ch = endChar(-dir, this.text);
  
      if (anticursor[dir] === this) {
        var newPc = TextPiece(ch).createDir(dir, cursor);
        anticursor[dir] = newPc;
        cursor.insDirOf(dir, newPc);
      }
      else {
        var from = this[-dir];
        if (from) from.insTextAtDirEnd(ch, dir);
        else {
          var newPc = TextPiece(ch).createDir(-dir, cursor);
          newPc.jQ.insDirOf(-dir, cursor.selection.jQ);
        }
  
        if (this.text.length === 1 && anticursor[-dir] === this) {
          anticursor[-dir] = this[-dir]; // `this` will be removed in deleteTowards
        }
      }
  
      return this.deleteTowards(dir, cursor);
    };
  });
  
  CharCmds.$ =
  LatexCmds.text =
  LatexCmds.textnormal =
  LatexCmds.textrm =
  LatexCmds.textup =
  LatexCmds.textmd = TextBlock;
  
  function makeTextBlock(latex, tagName, attrs) {
    return P(TextBlock, {
      ctrlSeq: latex,
      htmlTemplate: '<'+tagName+' '+attrs+'>&0</'+tagName+'>'
    });
  }
  
  LatexCmds.em = LatexCmds.italic = LatexCmds.italics =
  LatexCmds.emph = LatexCmds.textit = LatexCmds.textsl =
    makeTextBlock('\\textit', 'i', 'class="mq-text-mode"');
  LatexCmds.strong = LatexCmds.bold = LatexCmds.textbf =
    makeTextBlock('\\textbf', 'b', 'class="mq-text-mode"');
  LatexCmds.sf = LatexCmds.textsf =
    makeTextBlock('\\textsf', 'span', 'class="mq-sans-serif mq-text-mode"');
  LatexCmds.tt = LatexCmds.texttt =
    makeTextBlock('\\texttt', 'span', 'class="mq-monospace mq-text-mode"');
  LatexCmds.textsc =
    makeTextBlock('\\textsc', 'span', 'style="font-variant:small-caps" class="mq-text-mode"');
  LatexCmds.uppercase =
    makeTextBlock('\\uppercase', 'span', 'style="text-transform:uppercase" class="mq-text-mode"');
  LatexCmds.lowercase =
    makeTextBlock('\\lowercase', 'span', 'style="text-transform:lowercase" class="mq-text-mode"');
  
  
  var RootMathCommand = P(MathCommand, function(_, super_) {
    _.init = function(cursor) {
      super_.init.call(this, '$');
      this.cursor = cursor;
    };
    _.htmlTemplate = '<span class="mq-math-mode">&0</span>';
    _.createBlocks = function() {
      super_.createBlocks.call(this);
  
      this.ends[L].cursor = this.cursor;
      this.ends[L].write = function(cursor, ch) {
        if (ch !== '$')
          MathBlock.prototype.write.call(this, cursor, ch);
        else if (this.isEmpty()) {
          cursor.insRightOf(this.parent);
          this.parent.deleteTowards(dir, cursor);
          VanillaSymbol('\\$','$').createLeftOf(cursor.show());
        }
        else if (!cursor[R])
          cursor.insRightOf(this.parent);
        else if (!cursor[L])
          cursor.insLeftOf(this.parent);
        else
          MathBlock.prototype.write.call(this, cursor, ch);
      };
    };
    _.latex = function() {
      return '$' + this.ends[L].latex() + '$';
    };
  });
  
  var RootTextBlock = P(RootMathBlock, function(_, super_) {
    _.keystroke = function(key) {
      if (key === 'Spacebar' || key === 'Shift-Spacebar') return;
      return super_.keystroke.apply(this, arguments);
    };
    _.write = function(cursor, ch) {
      cursor.show().deleteSelection();
      if (ch === '$')
        RootMathCommand(cursor).createLeftOf(cursor);
      else {
        var html;
        if (ch === '<') html = '&lt;';
        else if (ch === '>') html = '&gt;';
        VanillaSymbol(ch, html).createLeftOf(cursor);
      }
    };
  });
  API.TextField = function(APIClasses) {
    return P(APIClasses.EditableField, function(_, super_) {
      this.RootBlock = RootTextBlock;
      _.__mathquillify = function() {
        return super_.__mathquillify.call(this, 'mq-editable-field mq-text-mode');
      };
      _.latex = function(latex) {
        if (arguments.length > 0) {
          this.__controller.renderLatexText(latex);
          if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
          return this;
        }
        return this.__controller.exportLatex();
      };
    });
  };
  /****************************************
   * Input box to type backslash commands
   ***************************************/
  
  var LatexCommandInput =
  CharCmds['\\'] = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\';
    _.replaces = function(replacedFragment) {
      this._replacedFragment = replacedFragment.disown();
      this.isEmpty = function() { return false; };
    };
    _.htmlTemplate = '<span class="mq-latex-command-input mq-non-leaf">\\<span>&0</span></span>';
    _.textTemplate = ['\\'];
    _.createBlocks = function() {
      super_.createBlocks.call(this);
      this.ends[L].focus = function() {
        this.parent.jQ.addClass('mq-hasCursor');
        if (this.isEmpty())
          this.parent.jQ.removeClass('mq-empty');
  
        return this;
      };
      this.ends[L].blur = function() {
        this.parent.jQ.removeClass('mq-hasCursor');
        if (this.isEmpty())
          this.parent.jQ.addClass('mq-empty');
  
        return this;
      };
      this.ends[L].write = function(cursor, ch) {
        cursor.show().deleteSelection();
  
        if (ch.match(/[a-z]/i)) VanillaSymbol(ch).createLeftOf(cursor);
        else {
          this.parent.renderCommand(cursor);
          if (ch !== '\\' || !this.isEmpty()) this.parent.parent.write(cursor, ch);
        }
      };
      this.ends[L].keystroke = function(key, e, ctrlr) {
        if (key === 'Tab' || key === 'Enter' || key === 'Spacebar') {
          this.parent.renderCommand(ctrlr.cursor);
          e.preventDefault();
          return;
        }
        return super_.keystroke.apply(this, arguments);
      };
    };
    _.createLeftOf = function(cursor) {
      super_.createLeftOf.call(this, cursor);
  
      if (this._replacedFragment) {
        var el = this.jQ[0];
        this.jQ =
          this._replacedFragment.jQ.addClass('mq-blur').bind(
            'mousedown mousemove', //FIXME: is monkey-patching the mousedown and mousemove handlers the right way to do this?
            function(e) {
              $(e.target = el).trigger(e);
              return false;
            }
          ).insertBefore(this.jQ).add(this.jQ);
      }
    };
    _.latex = function() {
      return '\\' + this.ends[L].latex() + ' ';
    };
    _.renderCommand = function(cursor) {
      this.jQ = this.jQ.last();
      this.remove();
      if (this[R]) {
        cursor.insLeftOf(this[R]);
      } else {
        cursor.insAtRightEnd(this.parent);
      }
  
      var latex = this.ends[L].latex();
      if (!latex) latex = ' ';
      var cmd = LatexCmds[latex];
      if (cmd) {
        cmd = cmd(latex);
        if (this._replacedFragment) cmd.replaces(this._replacedFragment);
        cmd.createLeftOf(cursor);
      }
      else {
        cmd = TextBlock();
        cmd.replaces(latex);
        cmd.createLeftOf(cursor);
        cursor.insRightOf(cmd);
        if (this._replacedFragment)
          this._replacedFragment.remove();
      }
    };
  });
  
  /************************************
   * Symbols for Advanced Mathematics
   ***********************************/
  
  LatexCmds.notin =
  LatexCmds.cong =
  LatexCmds.equiv =
  LatexCmds.oplus =
  LatexCmds.otimes = P(BinaryOperator, function(_, super_) {
    _.init = function(latex) {
      super_.init.call(this, '\\'+latex+' ', '&'+latex+';');
    };
  });
  
  LatexCmds['\u2260'] = LatexCmds.ne = LatexCmds.neq = bind(BinaryOperator,'\\ne ','&ne;');
  
  LatexCmds.ast = LatexCmds.star = LatexCmds.loast = LatexCmds.lowast =
    bind(BinaryOperator,'\\ast ','&lowast;');
    //case 'there4 = // a special exception for this one, perhaps?
  LatexCmds.therefor = LatexCmds.therefore =
    bind(BinaryOperator,'\\therefore ','&there4;');
  
  LatexCmds.cuz = // l33t
  LatexCmds.because = bind(BinaryOperator,'\\because ','&#8757;');
  
  LatexCmds.prop = LatexCmds.propto = bind(BinaryOperator,'\\propto ','&prop;');
  
  LatexCmds['\u2248'] = LatexCmds.asymp = LatexCmds.approx = bind(BinaryOperator,'\\approx ','&asymp;');
  
  LatexCmds.isin = LatexCmds['in'] = bind(BinaryOperator,'\\in ','&isin;');
  
  LatexCmds.ni = LatexCmds.contains = bind(BinaryOperator,'\\ni ','&ni;');
  
  LatexCmds.notni = LatexCmds.niton = LatexCmds.notcontains = LatexCmds.doesnotcontain =
    bind(BinaryOperator,'\\not\\ni ','&#8716;');
  
  LatexCmds.sub = LatexCmds.subset = bind(BinaryOperator,'\\subset ','&sub;');
  
  LatexCmds.sup = LatexCmds.supset = LatexCmds.superset =
    bind(BinaryOperator,'\\supset ','&sup;');
  
  LatexCmds.nsub = LatexCmds.notsub =
  LatexCmds.nsubset = LatexCmds.notsubset =
    bind(BinaryOperator,'\\not\\subset ','&#8836;');
  
  LatexCmds.nsup = LatexCmds.notsup =
  LatexCmds.nsupset = LatexCmds.notsupset =
  LatexCmds.nsuperset = LatexCmds.notsuperset =
    bind(BinaryOperator,'\\not\\supset ','&#8837;');
  
  LatexCmds.sube = LatexCmds.subeq = LatexCmds.subsete = LatexCmds.subseteq =
    bind(BinaryOperator,'\\subseteq ','&sube;');
  
  LatexCmds.supe = LatexCmds.supeq =
  LatexCmds.supsete = LatexCmds.supseteq =
  LatexCmds.supersete = LatexCmds.superseteq =
    bind(BinaryOperator,'\\supseteq ','&supe;');
  
  LatexCmds.nsube = LatexCmds.nsubeq =
  LatexCmds.notsube = LatexCmds.notsubeq =
  LatexCmds.nsubsete = LatexCmds.nsubseteq =
  LatexCmds.notsubsete = LatexCmds.notsubseteq =
    bind(BinaryOperator,'\\not\\subseteq ','&#8840;');
  
  LatexCmds.nsupe = LatexCmds.nsupeq =
  LatexCmds.notsupe = LatexCmds.notsupeq =
  LatexCmds.nsupsete = LatexCmds.nsupseteq =
  LatexCmds.notsupsete = LatexCmds.notsupseteq =
  LatexCmds.nsupersete = LatexCmds.nsuperseteq =
  LatexCmds.notsupersete = LatexCmds.notsuperseteq =
    bind(BinaryOperator,'\\not\\supseteq ','&#8841;');
  
  
  //the canonical sets of numbers
  LatexCmds.N = LatexCmds.naturals = LatexCmds.Naturals =
    bind(VanillaSymbol,'\\mathbb{N}','&#8469;');
  
  LatexCmds.P =
  LatexCmds.primes = LatexCmds.Primes =
  LatexCmds.projective = LatexCmds.Projective =
  LatexCmds.probability = LatexCmds.Probability =
    bind(VanillaSymbol,'\\mathbb{P}','&#8473;');
  
  LatexCmds.Z = LatexCmds.integers = LatexCmds.Integers =
    bind(VanillaSymbol,'\\mathbb{Z}','&#8484;');
  
  LatexCmds.Q = LatexCmds.rationals = LatexCmds.Rationals =
    bind(VanillaSymbol,'\\mathbb{Q}','&#8474;');
  
  LatexCmds.R = LatexCmds.reals = LatexCmds.Reals =
    bind(VanillaSymbol,'\\mathbb{R}','&#8477;');
  
  LatexCmds.C =
  LatexCmds.complex = LatexCmds.Complex =
  LatexCmds.complexes = LatexCmds.Complexes =
  LatexCmds.complexplane = LatexCmds.Complexplane = LatexCmds.ComplexPlane =
    bind(VanillaSymbol,'\\mathbb{C}','&#8450;');
  
  LatexCmds.H = LatexCmds.Hamiltonian = LatexCmds.quaternions = LatexCmds.Quaternions =
    bind(VanillaSymbol,'\\mathbb{H}','&#8461;');
  
  //spacing
  LatexCmds.quad = LatexCmds.emsp = bind(VanillaSymbol,'\\quad ','    ');
  LatexCmds.qquad = bind(VanillaSymbol,'\\qquad ','        ');
  /* spacing special characters, gonna have to implement this in LatexCommandInput::onText somehow
  case ',':
    return VanillaSymbol('\\, ',' ');
  case ':':
    return VanillaSymbol('\\: ','  ');
  case ';':
    return VanillaSymbol('\\; ','   ');
  case '!':
    return Symbol('\\! ','<span style="margin-right:-.2em"></span>');
  */
  
  //binary operators
  LatexCmds.diamond = bind(VanillaSymbol, '\\diamond ', '&#9671;');
  LatexCmds.bigtriangleup = bind(VanillaSymbol, '\\bigtriangleup ', '&#9651;');
  LatexCmds.ominus = bind(VanillaSymbol, '\\ominus ', '&#8854;');
  LatexCmds.uplus = bind(VanillaSymbol, '\\uplus ', '&#8846;');
  LatexCmds.bigtriangledown = bind(VanillaSymbol, '\\bigtriangledown ', '&#9661;');
  LatexCmds.sqcap = bind(VanillaSymbol, '\\sqcap ', '&#8851;');
  LatexCmds.triangleleft = bind(VanillaSymbol, '\\triangleleft ', '&#8882;');
  LatexCmds.sqcup = bind(VanillaSymbol, '\\sqcup ', '&#8852;');
  LatexCmds.triangleright = bind(VanillaSymbol, '\\triangleright ', '&#8883;');
  //circledot is not a not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
  LatexCmds.odot = LatexCmds.circledot = bind(VanillaSymbol, '\\odot ', '&#8857;');
  LatexCmds.bigcirc = bind(VanillaSymbol, '\\bigcirc ', '&#9711;');
  LatexCmds.dagger = bind(VanillaSymbol, '\\dagger ', '&#0134;');
  LatexCmds.ddagger = bind(VanillaSymbol, '\\ddagger ', '&#135;');
  LatexCmds.wr = bind(VanillaSymbol, '\\wr ', '&#8768;');
  LatexCmds.amalg = bind(VanillaSymbol, '\\amalg ', '&#8720;');
  
  //relationship symbols
  LatexCmds.models = bind(VanillaSymbol, '\\models ', '&#8872;');
  LatexCmds.prec = bind(VanillaSymbol, '\\prec ', '&#8826;');
  LatexCmds.succ = bind(VanillaSymbol, '\\succ ', '&#8827;');
  LatexCmds.preceq = bind(VanillaSymbol, '\\preceq ', '&#8828;');
  LatexCmds.succeq = bind(VanillaSymbol, '\\succeq ', '&#8829;');
  LatexCmds.simeq = bind(VanillaSymbol, '\\simeq ', '&#8771;');
  LatexCmds.mid = bind(VanillaSymbol, '\\mid ', '&#8739;');
  LatexCmds.ll = bind(VanillaSymbol, '\\ll ', '&#8810;');
  LatexCmds.gg = bind(VanillaSymbol, '\\gg ', '&#8811;');
  LatexCmds.parallel = bind(VanillaSymbol, '\\parallel ', '&#8741;');
  LatexCmds.nparallel = bind(VanillaSymbol, '\\nparallel ', '&#8742;');
  LatexCmds.bowtie = bind(VanillaSymbol, '\\bowtie ', '&#8904;');
  LatexCmds.sqsubset = bind(VanillaSymbol, '\\sqsubset ', '&#8847;');
  LatexCmds.sqsupset = bind(VanillaSymbol, '\\sqsupset ', '&#8848;');
  LatexCmds.smile = bind(VanillaSymbol, '\\smile ', '&#8995;');
  LatexCmds.sqsubseteq = bind(VanillaSymbol, '\\sqsubseteq ', '&#8849;');
  LatexCmds.sqsupseteq = bind(VanillaSymbol, '\\sqsupseteq ', '&#8850;');
  LatexCmds.doteq = bind(VanillaSymbol, '\\doteq ', '&#8784;');
  LatexCmds.frown = bind(VanillaSymbol, '\\frown ', '&#8994;');
  LatexCmds.vdash = bind(VanillaSymbol, '\\vdash ', '&#8870;');
  LatexCmds.dashv = bind(VanillaSymbol, '\\dashv ', '&#8867;');
  LatexCmds.nless = bind(VanillaSymbol, '\\nless ', '&#8814;');
  LatexCmds.ngtr = bind(VanillaSymbol, '\\ngtr ', '&#8815;');
  
  //arrows
  LatexCmds.longleftarrow = bind(VanillaSymbol, '\\longleftarrow ', '&#8592;');
  LatexCmds.longrightarrow = bind(VanillaSymbol, '\\longrightarrow ', '&#8594;');
  LatexCmds.Longleftarrow = bind(VanillaSymbol, '\\Longleftarrow ', '&#8656;');
  LatexCmds.Longrightarrow = bind(VanillaSymbol, '\\Longrightarrow ', '&#8658;');
  LatexCmds.longleftrightarrow = bind(VanillaSymbol, '\\longleftrightarrow ', '&#8596;');
  LatexCmds.updownarrow = bind(VanillaSymbol, '\\updownarrow ', '&#8597;');
  LatexCmds.Longleftrightarrow = bind(VanillaSymbol, '\\Longleftrightarrow ', '&#8660;');
  LatexCmds.Updownarrow = bind(VanillaSymbol, '\\Updownarrow ', '&#8661;');
  LatexCmds.mapsto = bind(VanillaSymbol, '\\mapsto ', '&#8614;');
  LatexCmds.nearrow = bind(VanillaSymbol, '\\nearrow ', '&#8599;');
  LatexCmds.hookleftarrow = bind(VanillaSymbol, '\\hookleftarrow ', '&#8617;');
  LatexCmds.hookrightarrow = bind(VanillaSymbol, '\\hookrightarrow ', '&#8618;');
  LatexCmds.searrow = bind(VanillaSymbol, '\\searrow ', '&#8600;');
  LatexCmds.leftharpoonup = bind(VanillaSymbol, '\\leftharpoonup ', '&#8636;');
  LatexCmds.rightharpoonup = bind(VanillaSymbol, '\\rightharpoonup ', '&#8640;');
  LatexCmds.swarrow = bind(VanillaSymbol, '\\swarrow ', '&#8601;');
  LatexCmds.leftharpoondown = bind(VanillaSymbol, '\\leftharpoondown ', '&#8637;');
  LatexCmds.rightharpoondown = bind(VanillaSymbol, '\\rightharpoondown ', '&#8641;');
  LatexCmds.nwarrow = bind(VanillaSymbol, '\\nwarrow ', '&#8598;');
  
  //Misc
  LatexCmds.ldots = bind(VanillaSymbol, '\\ldots ', '&#8230;');
  LatexCmds.cdots = bind(VanillaSymbol, '\\cdots ', '&#8943;');
  LatexCmds.vdots = bind(VanillaSymbol, '\\vdots ', '&#8942;');
  LatexCmds.ddots = bind(VanillaSymbol, '\\ddots ', '&#8945;');
  LatexCmds.surd = bind(VanillaSymbol, '\\surd ', '&#8730;');
  LatexCmds.triangle = bind(VanillaSymbol, '\\triangle ', '&#9651;');
  LatexCmds.ell = bind(VanillaSymbol, '\\ell ', '&#8467;');
  LatexCmds.top = bind(VanillaSymbol, '\\top ', '&#8868;');
  LatexCmds.flat = bind(VanillaSymbol, '\\flat ', '&#9837;');
  LatexCmds.natural = bind(VanillaSymbol, '\\natural ', '&#9838;');
  LatexCmds.sharp = bind(VanillaSymbol, '\\sharp ', '&#9839;');
  LatexCmds.wp = bind(VanillaSymbol, '\\wp ', '&#8472;');
  LatexCmds.bot = bind(VanillaSymbol, '\\bot ', '&#8869;');
  LatexCmds.clubsuit = bind(VanillaSymbol, '\\clubsuit ', '&#9827;');
  LatexCmds.diamondsuit = bind(VanillaSymbol, '\\diamondsuit ', '&#9826;');
  LatexCmds.heartsuit = bind(VanillaSymbol, '\\heartsuit ', '&#9825;');
  LatexCmds.spadesuit = bind(VanillaSymbol, '\\spadesuit ', '&#9824;');
  //not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
  LatexCmds.parallelogram = bind(VanillaSymbol, '\\parallelogram ', '&#9649;');
  LatexCmds.square = bind(VanillaSymbol, '\\square ', '&#11036;');
  
  //variable-sized
  LatexCmds.oint = bind(VanillaSymbol, '\\oint ', '&#8750;');
  LatexCmds.bigcap = bind(VanillaSymbol, '\\bigcap ', '&#8745;');
  LatexCmds.bigcup = bind(VanillaSymbol, '\\bigcup ', '&#8746;');
  LatexCmds.bigsqcup = bind(VanillaSymbol, '\\bigsqcup ', '&#8852;');
  LatexCmds.bigvee = bind(VanillaSymbol, '\\bigvee ', '&#8744;');
  LatexCmds.bigwedge = bind(VanillaSymbol, '\\bigwedge ', '&#8743;');
  LatexCmds.bigodot = bind(VanillaSymbol, '\\bigodot ', '&#8857;');
  LatexCmds.bigotimes = bind(VanillaSymbol, '\\bigotimes ', '&#8855;');
  LatexCmds.bigoplus = bind(VanillaSymbol, '\\bigoplus ', '&#8853;');
  LatexCmds.biguplus = bind(VanillaSymbol, '\\biguplus ', '&#8846;');
  
  //delimiters
  LatexCmds.lfloor = bind(VanillaSymbol, '\\lfloor ', '&#8970;');
  LatexCmds.rfloor = bind(VanillaSymbol, '\\rfloor ', '&#8971;');
  LatexCmds.lceil = bind(VanillaSymbol, '\\lceil ', '&#8968;');
  LatexCmds.rceil = bind(VanillaSymbol, '\\rceil ', '&#8969;');
  LatexCmds.opencurlybrace = LatexCmds.lbrace = bind(VanillaSymbol, '\\lbrace ', '{');
  LatexCmds.closecurlybrace = LatexCmds.rbrace = bind(VanillaSymbol, '\\rbrace ', '}');
  LatexCmds.lbrack = bind(VanillaSymbol, '[');
  LatexCmds.rbrack = bind(VanillaSymbol, ']');
  
  //various symbols
  LatexCmds['\u222b'] =
  LatexCmds['int'] =
  LatexCmds.integral = bind(Symbol,'\\int ','<big>&int;</big>');
  
  LatexCmds.slash = bind(VanillaSymbol, '/');
  LatexCmds.vert = bind(VanillaSymbol,'|');
  LatexCmds.perp = LatexCmds.perpendicular = bind(VanillaSymbol,'\\perp ','&perp;');
  LatexCmds.nabla = LatexCmds.del = bind(VanillaSymbol,'\\nabla ','&nabla;');
  LatexCmds.hbar = bind(VanillaSymbol,'\\hbar ','&#8463;');
  
  LatexCmds.AA = LatexCmds.Angstrom = LatexCmds.angstrom =
    bind(VanillaSymbol,'\\text\\AA ','&#8491;');
  
  LatexCmds.ring = LatexCmds.circ = LatexCmds.circle =
    bind(VanillaSymbol,'\\circ ','&#8728;');
  
  LatexCmds.bull = LatexCmds.bullet = bind(VanillaSymbol,'\\bullet ','&bull;');
  
  LatexCmds.setminus = LatexCmds.smallsetminus =
    bind(VanillaSymbol,'\\setminus ','&#8726;');
  
  LatexCmds.not = //bind(Symbol,'\\not ','<span class="not">/</span>');
  LatexCmds['\u00ac'] = LatexCmds.neg = bind(VanillaSymbol,'\\neg ','&not;');
  
  LatexCmds['\u2026'] = LatexCmds.dots = LatexCmds.ellip = LatexCmds.hellip =
  LatexCmds.ellipsis = LatexCmds.hellipsis =
    bind(VanillaSymbol,'\\dots ','&hellip;');
  
  LatexCmds.converges =
  LatexCmds.darr = LatexCmds.dnarr = LatexCmds.dnarrow = LatexCmds.downarrow =
    bind(VanillaSymbol,'\\downarrow ','&darr;');
  
  LatexCmds.dArr = LatexCmds.dnArr = LatexCmds.dnArrow = LatexCmds.Downarrow =
    bind(VanillaSymbol,'\\Downarrow ','&dArr;');
  
  LatexCmds.diverges = LatexCmds.uarr = LatexCmds.uparrow =
    bind(VanillaSymbol,'\\uparrow ','&uarr;');
  
  LatexCmds.uArr = LatexCmds.Uparrow = bind(VanillaSymbol,'\\Uparrow ','&uArr;');
  
  LatexCmds.to = bind(BinaryOperator,'\\to ','&rarr;');
  
  LatexCmds.rarr = LatexCmds.rightarrow = bind(VanillaSymbol,'\\rightarrow ','&rarr;');
  
  LatexCmds.implies = bind(BinaryOperator,'\\Rightarrow ','&rArr;');
  
  LatexCmds.rArr = LatexCmds.Rightarrow = bind(VanillaSymbol,'\\Rightarrow ','&rArr;');
  
  LatexCmds.gets = bind(BinaryOperator,'\\gets ','&larr;');
  
  LatexCmds.larr = LatexCmds.leftarrow = bind(VanillaSymbol,'\\leftarrow ','&larr;');
  
  LatexCmds.impliedby = bind(BinaryOperator,'\\Leftarrow ','&lArr;');
  
  LatexCmds.lArr = LatexCmds.Leftarrow = bind(VanillaSymbol,'\\Leftarrow ','&lArr;');
  
  LatexCmds.harr = LatexCmds.lrarr = LatexCmds.leftrightarrow =
    bind(VanillaSymbol,'\\leftrightarrow ','&harr;');
  
  LatexCmds.iff = bind(BinaryOperator,'\\Leftrightarrow ','&hArr;');
  
  LatexCmds.hArr = LatexCmds.lrArr = LatexCmds.Leftrightarrow =
    bind(VanillaSymbol,'\\Leftrightarrow ','&hArr;');
  
  LatexCmds.Re = LatexCmds.Real = LatexCmds.real = bind(VanillaSymbol,'\\Re ','&real;');
  
  LatexCmds.Im = LatexCmds.imag =
  LatexCmds.image = LatexCmds.imagin = LatexCmds.imaginary = LatexCmds.Imaginary =
    bind(VanillaSymbol,'\\Im ','&image;');
  
  LatexCmds.part = LatexCmds.partial = bind(VanillaSymbol,'\\partial ','&part;');
  
  LatexCmds.infty = LatexCmds.infin = LatexCmds.infinity =
    bind(VanillaSymbol,'\\infty ','&infin;');
  
  LatexCmds.alef = LatexCmds.alefsym = LatexCmds.aleph = LatexCmds.alephsym =
    bind(VanillaSymbol,'\\aleph ','&alefsym;');
  
  LatexCmds.xist = //LOL
  LatexCmds.xists = LatexCmds.exist = LatexCmds.exists =
    bind(VanillaSymbol,'\\exists ','&exist;');
  
  LatexCmds.and = LatexCmds.land = LatexCmds.wedge =
    bind(VanillaSymbol,'\\wedge ','&and;');
  
  LatexCmds.or = LatexCmds.lor = LatexCmds.vee = bind(VanillaSymbol,'\\vee ','&or;');
  
  LatexCmds.o = LatexCmds.O =
  LatexCmds.empty = LatexCmds.emptyset =
  LatexCmds.oslash = LatexCmds.Oslash =
  LatexCmds.nothing = LatexCmds.varnothing =
    bind(BinaryOperator,'\\varnothing ','&empty;');
  
  LatexCmds.cup = LatexCmds.union = bind(BinaryOperator,'\\cup ','&cup;');
  
  LatexCmds.cap = LatexCmds.intersect = LatexCmds.intersection =
    bind(BinaryOperator,'\\cap ','&cap;');
  
  // FIXME: the correct LaTeX would be ^\circ but we can't parse that
  LatexCmds.deg = LatexCmds.degree = bind(VanillaSymbol,'\\degree ','&deg;');
  
  LatexCmds.ang = LatexCmds.angle = bind(VanillaSymbol,'\\angle ','&ang;');
  LatexCmds.measuredangle = bind(VanillaSymbol,'\\measuredangle ','&#8737;');
  /*********************************
   * Symbols for Basic Mathematics
   ********************************/
  
  var Digit = P(VanillaSymbol, function(_, super_) {
    _.createLeftOf = function(cursor) {
      if (cursor.options.autoSubscriptNumerals
          && cursor.parent !== cursor.parent.parent.sub
          && ((cursor[L] instanceof Variable && cursor[L].isItalic !== false)
              || (cursor[L] instanceof SupSub
                  && cursor[L][L] instanceof Variable
                  && cursor[L][L].isItalic !== false))) {
        LatexCmds._().createLeftOf(cursor);
        super_.createLeftOf.call(this, cursor);
        cursor.insRightOf(cursor.parent.parent);
      }
      else super_.createLeftOf.call(this, cursor);
    };
  });
  
  var Variable = P(Symbol, function(_, super_) {
    _.init = function(ch, html) {
      super_.init.call(this, ch, '<var>'+(html || ch)+'</var>');
    };
    _.text = function() {
      var text = this.ctrlSeq;
      if (this[L] && !(this[L] instanceof Variable)
          && !(this[L] instanceof BinaryOperator)
          && this[L].ctrlSeq !== "\\ ")
        text = '*' + text;
      if (this[R] && !(this[R] instanceof BinaryOperator)
          && !(this[R] instanceof SupSub))
        text += '*';
      return text;
    };
  });
  
  Options.p.autoCommands = { _maxLength: 0 };
  optionProcessors.autoCommands = function(cmds) {
    if (!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)) {
      throw '"'+cmds+'" not a space-delimited list of only letters';
    }
    var list = cmds.split(' '), dict = {}, maxLength = 0;
    for (var i = 0; i < list.length; i += 1) {
      var cmd = list[i];
      if (cmd.length < 2) {
        throw 'autocommand "'+cmd+'" not minimum length of 2';
      }
      if (LatexCmds[cmd] === OperatorName) {
        throw '"' + cmd + '" is a built-in operator name';
      }
      dict[cmd] = 1;
      maxLength = max(maxLength, cmd.length);
    }
    dict._maxLength = maxLength;
    return dict;
  };
  
  var Letter = P(Variable, function(_, super_) {
    _.init = function(ch) { return super_.init.call(this, this.letter = ch); };
    _.createLeftOf = function(cursor) {
      var autoCmds = cursor.options.autoCommands, maxLength = autoCmds._maxLength;
      if (maxLength > 0) {
        // want longest possible autocommand, so join together longest
        // sequence of letters
        var str = this.letter, l = cursor[L], i = 1;
        while (l instanceof Letter && i < maxLength) {
          str = l.letter + str, l = l[L], i += 1;
        }
        // check for an autocommand, going thru substrings longest to shortest
        while (str.length) {
          if (autoCmds.hasOwnProperty(str)) {
            for (var i = 2, l = cursor[L]; i < str.length; i += 1, l = l[L]);
            Fragment(l, cursor[L]).remove();
            cursor[L] = l[L];
            return LatexCmds[str](str).createLeftOf(cursor);
          }
          str = str.slice(1);
        }
      }
      super_.createLeftOf.apply(this, arguments);
    };
    _.italicize = function(bool) {
      this.isItalic = bool;
      this.jQ.toggleClass('mq-operator-name', !bool);
      return this;
    };
    _.finalizeTree = _.siblingDeleted = _.siblingCreated = function(opts, dir) {
      // don't auto-un-italicize if the sibling to my right changed (dir === R or
      // undefined) and it's now a Letter, it will un-italicize everyone
      if (dir !== L && this[R] instanceof Letter) return;
      this.autoUnItalicize(opts);
    };
    _.autoUnItalicize = function(opts) {
      var autoOps = opts.autoOperatorNames;
      if (autoOps._maxLength === 0) return;
      // want longest possible operator names, so join together entire contiguous
      // sequence of letters
      var str = this.letter;
      for (var l = this[L]; l instanceof Letter; l = l[L]) str = l.letter + str;
      for (var r = this[R]; r instanceof Letter; r = r[R]) str += r.letter;
  
      // removeClass and delete flags from all letters before figuring out
      // which, if any, are part of an operator name
      Fragment(l[R] || this.parent.ends[L], r[L] || this.parent.ends[R]).each(function(el) {
        el.italicize(true).jQ.removeClass('mq-first mq-last');
        el.ctrlSeq = el.letter;
      });
  
      // check for operator names: at each position from left to right, check
      // substrings from longest to shortest
      outer: for (var i = 0, first = l[R] || this.parent.ends[L]; i < str.length; i += 1, first = first[R]) {
        for (var len = min(autoOps._maxLength, str.length - i); len > 0; len -= 1) {
          var word = str.slice(i, i + len);
          if (autoOps.hasOwnProperty(word)) {
            for (var j = 0, letter = first; j < len; j += 1, letter = letter[R]) {
              letter.italicize(false);
              var last = letter;
            }
  
            var isBuiltIn = BuiltInOpNames.hasOwnProperty(word);
            first.ctrlSeq = (isBuiltIn ? '\\' : '\\operatorname{') + first.ctrlSeq;
            last.ctrlSeq += (isBuiltIn ? ' ' : '}');
            if (TwoWordOpNames.hasOwnProperty(word)) last[L][L][L].jQ.addClass('mq-last');
            if (nonOperatorSymbol(first[L])) first.jQ.addClass('mq-first');
            if (nonOperatorSymbol(last[R])) last.jQ.addClass('mq-last');
  
            i += len - 1;
            first = last;
            continue outer;
          }
        }
      }
    };
    function nonOperatorSymbol(node) {
      return node instanceof Symbol && !(node instanceof BinaryOperator);
    }
  });
  var BuiltInOpNames = {}; // the set of operator names like \sin, \cos, etc that
    // are built-into LaTeX: http://latex.wikia.com/wiki/List_of_LaTeX_symbols#Named_operators:_sin.2C_cos.2C_etc.
    // MathQuill auto-unitalicizes some operator names not in that set, like 'hcf'
    // and 'arsinh', which must be exported as \operatorname{hcf} and
    // \operatorname{arsinh}. Note: over/under line/arrow \lim variants like
    // \varlimsup are not supported
  var AutoOpNames = Options.p.autoOperatorNames = { _maxLength: 9 }; // the set
    // of operator names that MathQuill auto-unitalicizes by default; overridable
  var TwoWordOpNames = { limsup: 1, liminf: 1, projlim: 1, injlim: 1 };
  (function() {
    var mostOps = ('arg deg det dim exp gcd hom inf ker lg lim ln log max min sup'
                   + ' limsup liminf injlim projlim Pr').split(' ');
    for (var i = 0; i < mostOps.length; i += 1) {
      BuiltInOpNames[mostOps[i]] = AutoOpNames[mostOps[i]] = 1;
    }
  
    var builtInTrigs = // why coth but not sech and csch, LaTeX?
      'sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'.split(' ');
    for (var i = 0; i < builtInTrigs.length; i += 1) {
      BuiltInOpNames[builtInTrigs[i]] = 1;
    }
  
    var autoTrigs = 'sin cos tan sec cosec csc cotan cot ctg'.split(' ');
    for (var i = 0; i < autoTrigs.length; i += 1) {
      AutoOpNames[autoTrigs[i]] =
      AutoOpNames['arc'+autoTrigs[i]] =
      AutoOpNames[autoTrigs[i]+'h'] =
      AutoOpNames['ar'+autoTrigs[i]+'h'] =
      AutoOpNames['arc'+autoTrigs[i]+'h'] = 1;
    }
  
    // compat with some of the nonstandard LaTeX exported by MathQuill
    // before #247. None of these are real LaTeX commands so, seems safe
    var moreNonstandardOps = 'gcf hcf lcm proj span'.split(' ');
    for (var i = 0; i < moreNonstandardOps.length; i += 1) {
      AutoOpNames[moreNonstandardOps[i]] = 1;
    }
  }());
  optionProcessors.autoOperatorNames = function(cmds) {
    if (!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)) {
      throw '"'+cmds+'" not a space-delimited list of only letters';
    }
    var list = cmds.split(' '), dict = {}, maxLength = 0;
    for (var i = 0; i < list.length; i += 1) {
      var cmd = list[i];
      if (cmd.length < 2) {
        throw '"'+cmd+'" not minimum length of 2';
      }
      dict[cmd] = 1;
      maxLength = max(maxLength, cmd.length);
    }
    dict._maxLength = maxLength;
    return dict;
  };
  var OperatorName = P(Symbol, function(_, super_) {
    _.init = function(fn) { this.ctrlSeq = fn; };
    _.createLeftOf = function(cursor) {
      var fn = this.ctrlSeq;
      for (var i = 0; i < fn.length; i += 1) {
        Letter(fn.charAt(i)).createLeftOf(cursor);
      }
    };
    _.parser = function() {
      var fn = this.ctrlSeq;
      var block = MathBlock();
      for (var i = 0; i < fn.length; i += 1) {
        Letter(fn.charAt(i)).adopt(block, block.ends[R], 0);
      }
      return Parser.succeed(block.children());
    };
  });
  for (var fn in AutoOpNames) if (AutoOpNames.hasOwnProperty(fn)) {
    LatexCmds[fn] = OperatorName;
  }
  LatexCmds.operatorname = P(MathCommand, function(_) {
    _.createLeftOf = noop;
    _.numBlocks = function() { return 1; };
    _.parser = function() {
      return latexMathParser.block.map(function(b) { return b.children(); });
    };
  });
  
  LatexCmds.f = P(Letter, function(_, super_) {
    _.init = function() {
      Symbol.p.init.call(this, this.letter = 'f', '<var class="mq-f">f</var>');
    };
    _.italicize = function(bool) {
      this.jQ.html('f').toggleClass('mq-f', bool);
      return super_.italicize.apply(this, arguments);
    };
  });
  
  // VanillaSymbol's
  LatexCmds[' '] = LatexCmds.space = bind(VanillaSymbol, '\\ ', '&nbsp;');
  
  LatexCmds["'"] = LatexCmds.prime = bind(VanillaSymbol, "'", '&prime;');
  
  LatexCmds.backslash = bind(VanillaSymbol,'\\backslash ','\\');
  if (!CharCmds['\\']) CharCmds['\\'] = LatexCmds.backslash;
  
  LatexCmds.$ = bind(VanillaSymbol, '\\$', '$');
  
  // does not use Symbola font
  var NonSymbolaSymbol = P(Symbol, function(_, super_) {
    _.init = function(ch, html) {
      super_.init.call(this, ch, '<span class="mq-nonSymbola">'+(html || ch)+'</span>');
    };
  });
  
  LatexCmds['@'] = NonSymbolaSymbol;
  LatexCmds['&'] = bind(NonSymbolaSymbol, '\\&', '&amp;');
  LatexCmds['%'] = bind(NonSymbolaSymbol, '\\%', '%');
  
  //the following are all Greek to me, but this helped a lot: http://www.ams.org/STIX/ion/stixsig03.html
  
  //lowercase Greek letter variables
  LatexCmds.alpha =
  LatexCmds.beta =
  LatexCmds.gamma =
  LatexCmds.delta =
  LatexCmds.zeta =
  LatexCmds.eta =
  LatexCmds.theta =
  LatexCmds.iota =
  LatexCmds.kappa =
  LatexCmds.mu =
  LatexCmds.nu =
  LatexCmds.xi =
  LatexCmds.rho =
  LatexCmds.sigma =
  LatexCmds.tau =
  LatexCmds.chi =
  LatexCmds.psi =
  LatexCmds.omega = P(Variable, function(_, super_) {
    _.init = function(latex) {
      super_.init.call(this,'\\'+latex+' ','&'+latex+';');
    };
  });
  
  //why can't anybody FUCKING agree on these
  LatexCmds.phi = //W3C or Unicode?
    bind(Variable,'\\phi ','&#981;');
  
  LatexCmds.phiv = //Elsevier and 9573-13
  LatexCmds.varphi = //AMS and LaTeX
    bind(Variable,'\\varphi ','&phi;');
  
  LatexCmds.epsilon = //W3C or Unicode?
    bind(Variable,'\\epsilon ','&#1013;');
  
  LatexCmds.epsiv = //Elsevier and 9573-13
  LatexCmds.varepsilon = //AMS and LaTeX
    bind(Variable,'\\varepsilon ','&epsilon;');
  
  LatexCmds.piv = //W3C/Unicode and Elsevier and 9573-13
  LatexCmds.varpi = //AMS and LaTeX
    bind(Variable,'\\varpi ','&piv;');
  
  LatexCmds.sigmaf = //W3C/Unicode
  LatexCmds.sigmav = //Elsevier
  LatexCmds.varsigma = //LaTeX
    bind(Variable,'\\varsigma ','&sigmaf;');
  
  LatexCmds.thetav = //Elsevier and 9573-13
  LatexCmds.vartheta = //AMS and LaTeX
  LatexCmds.thetasym = //W3C/Unicode
    bind(Variable,'\\vartheta ','&thetasym;');
  
  LatexCmds.upsilon = //AMS and LaTeX and W3C/Unicode
  LatexCmds.upsi = //Elsevier and 9573-13
    bind(Variable,'\\upsilon ','&upsilon;');
  
  //these aren't even mentioned in the HTML character entity references
  LatexCmds.gammad = //Elsevier
  LatexCmds.Gammad = //9573-13 -- WTF, right? I dunno if this was a typo in the reference (see above)
  LatexCmds.digamma = //LaTeX
    bind(Variable,'\\digamma ','&#989;');
  
  LatexCmds.kappav = //Elsevier
  LatexCmds.varkappa = //AMS and LaTeX
    bind(Variable,'\\varkappa ','&#1008;');
  
  LatexCmds.rhov = //Elsevier and 9573-13
  LatexCmds.varrho = //AMS and LaTeX
    bind(Variable,'\\varrho ','&#1009;');
  
  //Greek constants, look best in non-italicized Times New Roman
  LatexCmds.pi = LatexCmds['\u03c0'] = bind(NonSymbolaSymbol,'\\pi ','&pi;');
  LatexCmds.lambda = bind(NonSymbolaSymbol,'\\lambda ','&lambda;');
  
  //uppercase greek letters
  
  LatexCmds.Upsilon = //LaTeX
  LatexCmds.Upsi = //Elsevier and 9573-13
  LatexCmds.upsih = //W3C/Unicode "upsilon with hook"
  LatexCmds.Upsih = //'cos it makes sense to me
    bind(Symbol,'\\Upsilon ','<var style="font-family: serif">&upsih;</var>'); //Symbola's 'upsilon with a hook' is a capital Y without hooks :(
  
  //other symbols with the same LaTeX command and HTML character entity reference
  LatexCmds.Gamma =
  LatexCmds.Delta =
  LatexCmds.Theta =
  LatexCmds.Lambda =
  LatexCmds.Xi =
  LatexCmds.Pi =
  LatexCmds.Sigma =
  LatexCmds.Phi =
  LatexCmds.Psi =
  LatexCmds.Omega =
  LatexCmds.forall = P(VanillaSymbol, function(_, super_) {
    _.init = function(latex) {
      super_.init.call(this,'\\'+latex+' ','&'+latex+';');
    };
  });
  
  // symbols that aren't a single MathCommand, but are instead a whole
  // Fragment. Creates the Fragment from a LaTeX string
  var LatexFragment = P(MathCommand, function(_) {
    _.init = function(latex) { this.latex = latex; };
    _.createLeftOf = function(cursor) {
      var block = latexMathParser.parse(this.latex);
      block.children().adopt(cursor.parent, cursor[L], cursor[R]);
      cursor[L] = block.ends[R];
      block.jQize().insertBefore(cursor.jQ);
      block.finalizeInsert(cursor.options, cursor);
      if (block.ends[R][R].siblingCreated) block.ends[R][R].siblingCreated(cursor.options, L);
      if (block.ends[L][L].siblingCreated) block.ends[L][L].siblingCreated(cursor.options, R);
      cursor.parent.bubble('reflow');
    };
    _.parser = function() {
      var frag = latexMathParser.parse(this.latex).children();
      return Parser.succeed(frag);
    };
  });
  
  // for what seems to me like [stupid reasons][1], Unicode provides
  // subscripted and superscripted versions of all ten Arabic numerals,
  // as well as [so-called "vulgar fractions"][2].
  // Nobody really cares about most of them, but some of them actually
  // predate Unicode, dating back to [ISO-8859-1][3], apparently also
  // known as "Latin-1", which among other things [Windows-1252][4]
  // largely coincides with, so Microsoft Word sometimes inserts them
  // and they get copy-pasted into MathQuill.
  //
  // (Irrelevant but funny story: though not a superset of Latin-1 aka
  // ISO-8859-1, Windows-1252 **is** a strict superset of the "closely
  // related but distinct"[3] "ISO 8859-1" -- see the lack of a dash
  // after "ISO"? Completely different character set, like elephants vs
  // elephant seals, or "Zombies" vs "Zombie Redneck Torture Family".
  // What kind of idiot would get them confused.
  // People in fact got them confused so much, it was so common to
  // mislabel Windows-1252 text as ISO-8859-1, that most modern web
  // browsers and email clients treat the MIME charset of ISO-8859-1
  // as actually Windows-1252, behavior now standard in the HTML5 spec.)
  //
  // [1]: http://en.wikipedia.org/wiki/Unicode_subscripts_andsuper_scripts
  // [2]: http://en.wikipedia.org/wiki/Number_Forms
  // [3]: http://en.wikipedia.org/wiki/ISO/IEC_8859-1
  // [4]: http://en.wikipedia.org/wiki/Windows-1252
  LatexCmds['\u00b9'] = bind(LatexFragment, '^1');
  LatexCmds['\u00b2'] = bind(LatexFragment, '^2');
  LatexCmds['\u00b3'] = bind(LatexFragment, '^3');
  LatexCmds['\u00bc'] = bind(LatexFragment, '\\frac14');
  LatexCmds['\u00bd'] = bind(LatexFragment, '\\frac12');
  LatexCmds['\u00be'] = bind(LatexFragment, '\\frac34');
  
  var PlusMinus = P(BinaryOperator, function(_) {
    _.init = VanillaSymbol.prototype.init;
  
    _.contactWeld = _.siblingCreated = _.siblingDeleted = function(opts, dir) {
      if (dir === R) return; // ignore if sibling only changed on the right
      this.jQ[0].className =
        (!this[L] || this[L] instanceof BinaryOperator ? '' : 'mq-binary-operator');
      return this;
    };
  });
  
  LatexCmds['+'] = bind(PlusMinus, '+', '+');
  //yes, these are different dashes, I think one is an en dash and the other is a hyphen
  LatexCmds['\u2013'] = LatexCmds['-'] = bind(PlusMinus, '-', '&minus;');
  LatexCmds['\u00b1'] = LatexCmds.pm = LatexCmds.plusmn = LatexCmds.plusminus =
    bind(PlusMinus,'\\pm ','&plusmn;');
  LatexCmds.mp = LatexCmds.mnplus = LatexCmds.minusplus =
    bind(PlusMinus,'\\mp ','&#8723;');
  
  CharCmds['*'] = LatexCmds.sdot = LatexCmds.cdot =
    bind(BinaryOperator, '\\cdot ', '&middot;', '*');
  //semantically should be &sdot;, but &middot; looks better
  
  var Inequality = P(BinaryOperator, function(_, super_) {
    _.init = function(data, strict) {
      this.data = data;
      this.strict = strict;
      var strictness = (strict ? 'Strict' : '');
      super_.init.call(this, data['ctrlSeq'+strictness], data['html'+strictness],
                       data['text'+strictness]);
    };
    _.swap = function(strict) {
      this.strict = strict;
      var strictness = (strict ? 'Strict' : '');
      this.ctrlSeq = this.data['ctrlSeq'+strictness];
      this.jQ.html(this.data['html'+strictness]);
      this.textTemplate = [ this.data['text'+strictness] ];
    };
    _.deleteTowards = function(dir, cursor) {
      if (dir === L && !this.strict) {
        this.swap(true);
        this.bubble('reflow');
        return;
      }
      super_.deleteTowards.apply(this, arguments);
    };
  });
  
  var less = { ctrlSeq: '\\le ', html: '&le;', text: '\u2264',
               ctrlSeqStrict: '<', htmlStrict: '&lt;', textStrict: '<' };
  var greater = { ctrlSeq: '\\ge ', html: '&ge;', text: '\u2265',
                  ctrlSeqStrict: '>', htmlStrict: '&gt;', textStrict: '>' };
  
  LatexCmds['<'] = LatexCmds.lt = bind(Inequality, less, true);
  LatexCmds['>'] = LatexCmds.gt = bind(Inequality, greater, true);
  LatexCmds['\u2264'] = LatexCmds.le = LatexCmds.leq = bind(Inequality, less, false);
  LatexCmds['\u2265'] = LatexCmds.ge = LatexCmds.geq = bind(Inequality, greater, false);
  
  var Equality = P(BinaryOperator, function(_, super_) {
    _.init = function() {
      super_.init.call(this, '=', '=');
    };
    _.createLeftOf = function(cursor) {
      if (cursor[L] instanceof Inequality && cursor[L].strict) {
        cursor[L].swap(false);
        cursor[L].bubble('reflow');
        return;
      }
      super_.createLeftOf.apply(this, arguments);
    };
  });
  LatexCmds['='] = Equality;
  
  LatexCmds['\u00d7'] = LatexCmds.times = bind(BinaryOperator, '\\times ', '&times;', '[x]');
  
  LatexCmds['\u00f7'] = LatexCmds.div = LatexCmds.divide = LatexCmds.divides =
    bind(BinaryOperator,'\\div ','&divide;', '[/]');
  
  CharCmds['~'] = LatexCmds.sim = bind(BinaryOperator, '\\sim ', '~', '~');
  /***************************
   * Commands and Operators.
   **************************/
  
  var scale, // = function(jQ, x, y) { ... }
  //will use a CSS 2D transform to scale the jQuery-wrapped HTML elements,
  //or the filter matrix transform fallback for IE 5.5-8, or gracefully degrade to
  //increasing the fontSize to match the vertical Y scaling factor.
  
  //ideas from http://github.com/louisremi/jquery.transform.js
  //see also http://msdn.microsoft.com/en-us/library/ms533014(v=vs.85).aspx
  
    forceIERedraw = noop,
    div = document.createElement('div'),
    div_style = div.style,
    transformPropNames = {
      transform:1,
      WebkitTransform:1,
      MozTransform:1,
      OTransform:1,
      msTransform:1
    },
    transformPropName;
  
  for (var prop in transformPropNames) {
    if (prop in div_style) {
      transformPropName = prop;
      break;
    }
  }
  
  if (transformPropName) {
    scale = function(jQ, x, y) {
      jQ.css(transformPropName, 'scale('+x+','+y+')');
    };
  }
  else if ('filter' in div_style) { //IE 6, 7, & 8 fallback, see https://github.com/laughinghan/mathquill/wiki/Transforms
    forceIERedraw = function(el){ el.className = el.className; };
    scale = function(jQ, x, y) { //NOTE: assumes y > x
      x /= (1+(y-1)/2);
      jQ.css('fontSize', y + 'em');
      if (!jQ.hasClass('mq-matrixed-container')) {
        jQ.addClass('mq-matrixed-container')
        .wrapInner('<span class="mq-matrixed"></span>');
      }
      var innerjQ = jQ.children()
      .css('filter', 'progid:DXImageTransform.Microsoft'
          + '.Matrix(M11=' + x + ",SizingMethod='auto expand')"
      );
      function calculateMarginRight() {
        jQ.css('marginRight', (innerjQ.width()-1)*(x-1)/x + 'px');
      }
      calculateMarginRight();
      var intervalId = setInterval(calculateMarginRight);
      $(window).load(function() {
        clearTimeout(intervalId);
        calculateMarginRight();
      });
    };
  }
  else {
    scale = function(jQ, x, y) {
      jQ.css('fontSize', y + 'em');
    };
  }
  
  var Style = P(MathCommand, function(_, super_) {
    _.init = function(ctrlSeq, tagName, attrs) {
      super_.init.call(this, ctrlSeq, '<'+tagName+' '+attrs+'>&0</'+tagName+'>');
    };
  });
  
  //fonts
  LatexCmds.mathrm = bind(Style, '\\mathrm', 'span', 'class="mq-roman mq-font"');
  LatexCmds.mathit = bind(Style, '\\mathit', 'i', 'class="mq-font"');
  LatexCmds.mathbf = bind(Style, '\\mathbf', 'b', 'class="mq-font"');
  LatexCmds.mathsf = bind(Style, '\\mathsf', 'span', 'class="mq-sans-serif mq-font"');
  LatexCmds.mathtt = bind(Style, '\\mathtt', 'span', 'class="mq-monospace mq-font"');
  //text-decoration
  LatexCmds.underline = bind(Style, '\\underline', 'span', 'class="mq-non-leaf mq-underline"');
  LatexCmds.overline = LatexCmds.bar = bind(Style, '\\overline', 'span', 'class="mq-non-leaf mq-overline"');
  LatexCmds.overrightarrow = bind(Style, '\\overrightarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-right"');
  LatexCmds.overleftarrow = bind(Style, '\\overleftarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-left"');
  
  // `\textcolor{color}{math}` will apply a color to the given math content, where
  // `color` is any valid CSS Color Value (see [SitePoint docs][] (recommended),
  // [Mozilla docs][], or [W3C spec][]).
  //
  // [SitePoint docs]: http://reference.sitepoint.com/css/colorvalues
  // [Mozilla docs]: https://developer.mozilla.org/en-US/docs/CSS/color_value#Values
  // [W3C spec]: http://dev.w3.org/csswg/css3-color/#colorunits
  var TextColor = LatexCmds.textcolor = P(MathCommand, function(_, super_) {
    _.setColor = function(color) {
      this.color = color;
      this.htmlTemplate =
        '<span class="mq-textcolor" style="color:' + color + '">&0</span>';
    };
    _.latex = function() {
      return '\\textcolor{' + this.color + '}{' + this.blocks[0].latex() + '}';
    };
    _.parser = function() {
      var self = this;
      var optWhitespace = Parser.optWhitespace;
      var string = Parser.string;
      var regex = Parser.regex;
  
      return optWhitespace
        .then(string('{'))
        .then(regex(/^[#\w\s.,()%-]*/))
        .skip(string('}'))
        .then(function(color) {
          self.setColor(color);
          return super_.parser.call(self);
        })
      ;
    };
  });
  
  // Very similar to the \textcolor command, but will add the given CSS class.
  // Usage: \class{classname}{math}
  // Note regex that whitelists valid CSS classname characters:
  // https://github.com/mathquill/mathquill/pull/191#discussion_r4327442
  var Class = LatexCmds['class'] = P(MathCommand, function(_, super_) {
    _.parser = function() {
      var self = this, string = Parser.string, regex = Parser.regex;
      return Parser.optWhitespace
        .then(string('{'))
        .then(regex(/^[-\w\s\\\xA0-\xFF]*/))
        .skip(string('}'))
        .then(function(cls) {
          self.htmlTemplate = '<span class="mq-class '+cls+'">&0</span>';
          return super_.parser.call(self);
        })
      ;
    };
  });
  
  var SupSub = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '_{...}^{...}';
    _.createLeftOf = function(cursor) {
      if (!cursor[L] && cursor.options.supSubsRequireOperand) return;
      return super_.createLeftOf.apply(this, arguments);
    };
    _.contactWeld = function(cursor) {
      // Look on either side for a SupSub, if one is found compare my
      // .sub, .sup with its .sub, .sup. If I have one that it doesn't,
      // then call .addBlock() on it with my block; if I have one that
      // it also has, then insert my block's children into its block,
      // unless my block has none, in which case insert the cursor into
      // its block (and not mine, I'm about to remove myself) in the case
      // I was just typed.
      // TODO: simplify
  
      // equiv. to [L, R].forEach(function(dir) { ... });
      for (var dir = L; dir; dir = (dir === L ? R : false)) {
        if (this[dir] instanceof SupSub) {
          // equiv. to 'sub sup'.split(' ').forEach(function(supsub) { ... });
          for (var supsub = 'sub'; supsub; supsub = (supsub === 'sub' ? 'sup' : false)) {
            var src = this[supsub], dest = this[dir][supsub];
            if (!src) continue;
            if (!dest) this[dir].addBlock(src.disown());
            else if (!src.isEmpty()) { // ins src children at -dir end of dest
              src.jQ.children().insAtDirEnd(-dir, dest.jQ);
              var children = src.children().disown();
              var pt = Point(dest, children.ends[R], dest.ends[L]);
              if (dir === L) children.adopt(dest, dest.ends[R], 0);
              else children.adopt(dest, 0, dest.ends[L]);
            }
            else var pt = Point(dest, 0, dest.ends[L]);
            this.placeCursor = (function(dest, src) { // TODO: don't monkey-patch
              return function(cursor) { cursor.insAtDirEnd(-dir, dest || src); };
            }(dest, src));
          }
          this.remove();
          if (cursor && cursor[L] === this) {
            if (dir === R && pt) {
              pt[L] ? cursor.insRightOf(pt[L]) : cursor.insAtLeftEnd(pt.parent);
            }
            else cursor.insRightOf(this[dir]);
          }
          break;
        }
      }
      this.respace();
    };
    Options.p.charsThatBreakOutOfSupSub = '';
    _.finalizeTree = function() {
      this.ends[L].write = function(cursor, ch) {
        if (cursor.options.autoSubscriptNumerals && this === this.parent.sub) {
          if (ch === '_') return;
          var cmd = this.chToCmd(ch);
          if (cmd instanceof Symbol) cursor.deleteSelection();
          else cursor.clearSelection().insRightOf(this.parent);
          return cmd.createLeftOf(cursor.show());
        }
        if (cursor[L] && !cursor[R] && !cursor.selection
            && cursor.options.charsThatBreakOutOfSupSub.indexOf(ch) > -1) {
          cursor.insRightOf(this.parent);
        }
        MathBlock.p.write.apply(this, arguments);
      };
    };
    _.moveTowards = function(dir, cursor, updown) {
      if (cursor.options.autoSubscriptNumerals && !this.sup) {
        cursor.insDirOf(dir, this);
      }
      else super_.moveTowards.apply(this, arguments);
    };
    _.deleteTowards = function(dir, cursor) {
      if (cursor.options.autoSubscriptNumerals && this.sub) {
        var cmd = this.sub.ends[-dir];
        if (cmd instanceof Symbol) cmd.remove();
        else if (cmd) cmd.deleteTowards(dir, cursor.insAtDirEnd(-dir, this.sub));
  
        // TODO: factor out a .removeBlock() or something
        if (this.sub.isEmpty()) {
          this.sub.deleteOutOf(L, cursor.insAtLeftEnd(this.sub));
          if (this.sup) cursor.insDirOf(-dir, this);
          // Note `-dir` because in e.g. x_1^2| want backspacing (leftward)
          // to delete the 1 but to end up rightward of x^2; with non-negated
          // `dir` (try it), the cursor appears to have gone "through" the ^2.
        }
      }
      else super_.deleteTowards.apply(this, arguments);
    };
    _.latex = function() {
      function latex(prefix, block) {
        var l = block && block.latex();
        return block ? prefix + (l.length === 1 ? l : '{' + (l || ' ') + '}') : '';
      }
      return latex('_', this.sub) + latex('^', this.sup);
    };
    _.respace = _.siblingCreated = _.siblingDeleted = function(opts, dir) {
      if (dir === R) return; // ignore if sibling only changed on the right
      this.jQ.toggleClass('mq-limit', this[L].ctrlSeq === '\\int ');
    };
    _.addBlock = function(block) {
      if (this.supsub === 'sub') {
        this.sup = this.upInto = this.sub.upOutOf = block;
        block.adopt(this, this.sub, 0).downOutOf = this.sub;
        block.jQ = $('<span class="mq-sup"/>').append(block.jQ.children())
          .attr(mqBlockId, block.id).prependTo(this.jQ);
      }
      else {
        this.sub = this.downInto = this.sup.downOutOf = block;
        block.adopt(this, 0, this.sup).upOutOf = this.sup;
        block.jQ = $('<span class="mq-sub"></span>').append(block.jQ.children())
          .attr(mqBlockId, block.id).appendTo(this.jQ.removeClass('mq-sup-only'));
        this.jQ.append('<span style="display:inline-block;width:0">&#8203;</span>');
      }
      // like 'sub sup'.split(' ').forEach(function(supsub) { ... });
      for (var i = 0; i < 2; i += 1) (function(cmd, supsub, oppositeSupsub, updown) {
        cmd[supsub].deleteOutOf = function(dir, cursor) {
          cursor.insDirOf((this[dir] ? -dir : dir), this.parent);
          if (!this.isEmpty()) {
            var end = this.ends[dir];
            this.children().disown()
              .withDirAdopt(dir, cursor.parent, cursor[dir], cursor[-dir])
              .jQ.insDirOf(-dir, cursor.jQ);
            cursor[-dir] = end;
          }
          cmd.supsub = oppositeSupsub;
          delete cmd[supsub];
          delete cmd[updown+'Into'];
          cmd[oppositeSupsub][updown+'OutOf'] = insLeftOfMeUnlessAtEnd;
          delete cmd[oppositeSupsub].deleteOutOf;
          if (supsub === 'sub') $(cmd.jQ.addClass('mq-sup-only')[0].lastChild).remove();
          this.remove();
        };
      }(this, 'sub sup'.split(' ')[i], 'sup sub'.split(' ')[i], 'down up'.split(' ')[i]));
    };
  });
  
  function insLeftOfMeUnlessAtEnd(cursor) {
    // cursor.insLeftOf(cmd), unless cursor at the end of block, and every
    // ancestor cmd is at the end of every ancestor block
    var cmd = this.parent, ancestorCmd = cursor;
    do {
      if (ancestorCmd[R]) return cursor.insLeftOf(cmd);
      ancestorCmd = ancestorCmd.parent.parent;
    } while (ancestorCmd !== cmd);
    cursor.insRightOf(cmd);
  }
  
  LatexCmds.subscript =
  LatexCmds._ = P(SupSub, function(_, super_) {
    _.supsub = 'sub';
    _.htmlTemplate =
        '<span class="mq-supsub mq-non-leaf">'
      +   '<span class="mq-sub">&0</span>'
      +   '<span style="display:inline-block;width:0">&#8203;</span>'
      + '</span>'
    ;
    _.textTemplate = [ '_' ];
    _.finalizeTree = function() {
      this.downInto = this.sub = this.ends[L];
      this.sub.upOutOf = insLeftOfMeUnlessAtEnd;
      super_.finalizeTree.call(this);
    };
  });
  
  LatexCmds.superscript =
  LatexCmds.supscript =
  LatexCmds['^'] = P(SupSub, function(_, super_) {
    _.supsub = 'sup';
    _.htmlTemplate =
        '<span class="mq-supsub mq-non-leaf mq-sup-only">'
      +   '<span class="mq-sup">&0</span>'
      + '</span>'
    ;
    _.textTemplate = [ '^' ];
    _.finalizeTree = function() {
      this.upInto = this.sup = this.ends[R];
      this.sup.downOutOf = insLeftOfMeUnlessAtEnd;
      super_.finalizeTree.call(this);
    };
  });
  
  var SummationNotation = P(MathCommand, function(_, super_) {
    _.init = function(ch, html) {
      var htmlTemplate =
        '<span class="mq-large-operator mq-non-leaf">'
      +   '<span class="mq-to"><span>&1</span></span>'
      +   '<big>'+html+'</big>'
      +   '<span class="mq-from"><span>&0</span></span>'
      + '</span>'
      ;
      Symbol.prototype.init.call(this, ch, htmlTemplate);
    };
    _.createLeftOf = function(cursor) {
      super_.createLeftOf.apply(this, arguments);
      if (cursor.options.sumStartsWithNEquals) {
        Letter('n').createLeftOf(cursor);
        Equality().createLeftOf(cursor);
      }
    };
    _.latex = function() {
      function simplify(latex) {
        return latex.length === 1 ? latex : '{' + (latex || ' ') + '}';
      }
      return this.ctrlSeq + '_' + simplify(this.ends[L].latex()) +
        '^' + simplify(this.ends[R].latex());
    };
    _.parser = function() {
      var string = Parser.string;
      var optWhitespace = Parser.optWhitespace;
      var succeed = Parser.succeed;
      var block = latexMathParser.block;
  
      var self = this;
      var blocks = self.blocks = [ MathBlock(), MathBlock() ];
      for (var i = 0; i < blocks.length; i += 1) {
        blocks[i].adopt(self, self.ends[R], 0);
      }
  
      return optWhitespace.then(string('_').or(string('^'))).then(function(supOrSub) {
        var child = blocks[supOrSub === '_' ? 0 : 1];
        return block.then(function(block) {
          block.children().adopt(child, child.ends[R], 0);
          return succeed(self);
        });
      }).many().result(self);
    };
    _.finalizeTree = function() {
      this.downInto = this.ends[L];
      this.upInto = this.ends[R];
      this.ends[L].upOutOf = this.ends[R];
      this.ends[R].downOutOf = this.ends[L];
    };
  });
  
  LatexCmds['\u2211'] =
  LatexCmds.sum =
  LatexCmds.summation = bind(SummationNotation,'\\sum ','&sum;');
  
  LatexCmds['\u220f'] =
  LatexCmds.prod =
  LatexCmds.product = bind(SummationNotation,'\\prod ','&prod;');
  
  LatexCmds.coprod =
  LatexCmds.coproduct = bind(SummationNotation,'\\coprod ','&#8720;');
  
  var Fraction =
  LatexCmds.frac =
  LatexCmds.dfrac =
  LatexCmds.cfrac =
  LatexCmds.fraction = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\frac';
    _.htmlTemplate =
        '<span class="mq-fraction mq-non-leaf">'
      +   '<span class="mq-numerator">&0</span>'
      +   '<span class="mq-denominator">&1</span>'
      +   '<span style="display:inline-block;width:0">&#8203;</span>'
      + '</span>'
    ;
    _.textTemplate = ['(', ')/(', ')'];
    _.finalizeTree = function() {
      this.upInto = this.ends[R].upOutOf = this.ends[L];
      this.downInto = this.ends[L].downOutOf = this.ends[R];
    };
  });
  
  var LiveFraction =
  LatexCmds.over =
  CharCmds['/'] = P(Fraction, function(_, super_) {
    _.createLeftOf = function(cursor) {
      if (!this.replacedFragment) {
        var leftward = cursor[L];
        while (leftward &&
          !(
            leftward instanceof BinaryOperator ||
            leftward instanceof (LatexCmds.text || noop) ||
            leftward instanceof SummationNotation ||
            leftward.ctrlSeq === '\\ ' ||
            /^[,;:]$/.test(leftward.ctrlSeq)
          ) //lookbehind for operator
        ) leftward = leftward[L];
  
        if (leftward instanceof SummationNotation && leftward[R] instanceof SupSub) {
          leftward = leftward[R];
          if (leftward[R] instanceof SupSub && leftward[R].ctrlSeq != leftward.ctrlSeq)
            leftward = leftward[R];
        }
  
        if (leftward !== cursor[L]) {
          this.replaces(Fragment(leftward[R] || cursor.parent.ends[L], cursor[L]));
          cursor[L] = leftward;
        }
      }
      super_.createLeftOf.call(this, cursor);
    };
  });
  
  var SquareRoot =
  LatexCmds.sqrt =
  LatexCmds['\u221a'] = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\sqrt';
    _.htmlTemplate =
        '<span class="mq-non-leaf">'
      +   '<span class="mq-scaled mq-sqrt-prefix">&radic;</span>'
      +   '<span class="mq-non-leaf mq-sqrt-stem">&0</span>'
      + '</span>'
    ;
    _.textTemplate = ['sqrt(', ')'];
    _.parser = function() {
      return latexMathParser.optBlock.then(function(optBlock) {
        return latexMathParser.block.map(function(block) {
          var nthroot = NthRoot();
          nthroot.blocks = [ optBlock, block ];
          optBlock.adopt(nthroot, 0, 0);
          block.adopt(nthroot, optBlock, 0);
          return nthroot;
        });
      }).or(super_.parser.call(this));
    };
    _.reflow = function() {
      var block = this.ends[R].jQ;
      scale(block.prev(), 1, block.innerHeight()/+block.css('fontSize').slice(0,-2) - .1);
    };
  });
  
  var Vec = LatexCmds.vec = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\vec';
    _.htmlTemplate =
        '<span class="mq-non-leaf">'
      +   '<span class="mq-vector-prefix">&rarr;</span>'
      +   '<span class="mq-vector-stem">&0</span>'
      + '</span>'
    ;
    _.textTemplate = ['vec(', ')'];
  });
  
  var NthRoot =
  LatexCmds.nthroot = P(SquareRoot, function(_, super_) {
    _.htmlTemplate =
        '<sup class="mq-nthroot mq-non-leaf">&0</sup>'
      + '<span class="mq-scaled">'
      +   '<span class="mq-sqrt-prefix mq-scaled">&radic;</span>'
      +   '<span class="mq-sqrt-stem mq-non-leaf">&1</span>'
      + '</span>'
    ;
    _.textTemplate = ['sqrt[', '](', ')'];
    _.latex = function() {
      return '\\sqrt['+this.ends[L].latex()+']{'+this.ends[R].latex()+'}';
    };
  });
  
  function DelimsMixin(_, super_) {
    _.jQadd = function() {
      super_.jQadd.apply(this, arguments);
      this.delimjQs = this.jQ.children(':first').add(this.jQ.children(':last'));
      this.contentjQ = this.jQ.children(':eq(1)');
    };
    _.reflow = function() {
      var height = this.contentjQ.outerHeight()
                   / parseFloat(this.contentjQ.css('fontSize'));
      scale(this.delimjQs, min(1 + .2*(height - 1), 1.2), 1.2*height);
    };
  }
  
  // Round/Square/Curly/Angle Brackets (aka Parens/Brackets/Braces)
  //   first typed as one-sided bracket with matching "ghost" bracket at
  //   far end of current block, until you type an opposing one
  var Bracket = P(P(MathCommand, DelimsMixin), function(_, super_) {
    _.init = function(side, open, close, ctrlSeq, end) {
      super_.init.call(this, '\\left'+ctrlSeq, undefined$1, [open, close]);
      this.side = side;
      this.sides = {};
      this.sides[L] = { ch: open, ctrlSeq: ctrlSeq };
      this.sides[R] = { ch: close, ctrlSeq: end };
    };
    _.numBlocks = function() { return 1; };
    _.html = function() { // wait until now so that .side may
      this.htmlTemplate = // be set by createLeftOf or parser
          '<span class="mq-non-leaf">'
        +   '<span class="mq-scaled mq-paren'+(this.side === R ? ' mq-ghost' : '')+'">'
        +     this.sides[L].ch
        +   '</span>'
        +   '<span class="mq-non-leaf">&0</span>'
        +   '<span class="mq-scaled mq-paren'+(this.side === L ? ' mq-ghost' : '')+'">'
        +     this.sides[R].ch
        +   '</span>'
        + '</span>'
      ;
      return super_.html.call(this);
    };
    _.latex = function() {
      return '\\left'+this.sides[L].ctrlSeq+this.ends[L].latex()+'\\right'+this.sides[R].ctrlSeq;
    };
    _.oppBrack = function(opts, node, expectedSide) {
      // return node iff it's a 1-sided bracket of expected side (if any, may be
      // undefined), and of opposite side from me if I'm not a pipe
      return node instanceof Bracket && node.side && node.side !== -expectedSide
        && (this.sides[this.side].ch === '|' || node.side === -this.side)
        && (!opts.restrictMismatchedBrackets
          || OPP_BRACKS[this.sides[this.side].ch] === node.sides[node.side].ch
          || { '(': ']', '[': ')' }[this.sides[L].ch] === node.sides[R].ch) && node;
    };
    _.closeOpposing = function(brack) {
      brack.side = 0;
      brack.sides[this.side] = this.sides[this.side]; // copy over my info (may be
      brack.delimjQs.eq(this.side === L ? 0 : 1) // mismatched, like [a, b))
        .removeClass('mq-ghost').html(this.sides[this.side].ch);
    };
    _.createLeftOf = function(cursor) {
      if (!this.replacedFragment) { // unless wrapping seln in brackets,
          // check if next to or inside an opposing one-sided bracket
          // (must check both sides 'cos I might be a pipe)
        var opts = cursor.options;
        var brack = this.oppBrack(opts, cursor[L], L)
                    || this.oppBrack(opts, cursor[R], R)
                    || this.oppBrack(opts, cursor.parent.parent);
      }
      if (brack) {
        var side = this.side = -brack.side; // may be pipe with .side not yet set
        this.closeOpposing(brack);
        if (brack === cursor.parent.parent && cursor[side]) { // move the stuff between
          Fragment(cursor[side], cursor.parent.ends[side], -side) // me and ghost outside
            .disown().withDirAdopt(-side, brack.parent, brack, brack[side])
            .jQ.insDirOf(side, brack.jQ);
          brack.bubble('reflow');
        }
      }
      else {
        brack = this, side = brack.side;
        if (brack.replacedFragment) brack.side = 0; // wrapping seln, don't be one-sided
        else if (cursor[-side]) { // elsewise, auto-expand so ghost is at far end
          brack.replaces(Fragment(cursor[-side], cursor.parent.ends[-side], side));
          cursor[-side] = 0;
        }
        super_.createLeftOf.call(brack, cursor);
      }
      if (side === L) cursor.insAtLeftEnd(brack.ends[L]);
      else cursor.insRightOf(brack);
    };
    _.placeCursor = noop;
    _.unwrap = function() {
      this.ends[L].children().disown().adopt(this.parent, this, this[R])
        .jQ.insertAfter(this.jQ);
      this.remove();
    };
    _.deleteSide = function(side, outward, cursor) {
      var parent = this.parent, sib = this[side], farEnd = parent.ends[side];
  
      if (side === this.side) { // deleting non-ghost of one-sided bracket, unwrap
        this.unwrap();
        sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
        return;
      }
  
      var opts = cursor.options, wasSolid = !this.side;
      this.side = -side;
      // if deleting like, outer close-brace of [(1+2)+3} where inner open-paren
      if (this.oppBrack(opts, this.ends[L].ends[this.side], side)) { // is ghost,
        this.closeOpposing(this.ends[L].ends[this.side]); // then become [1+2)+3
        var origEnd = this.ends[L].ends[side];
        this.unwrap();
        if (origEnd.siblingCreated) origEnd.siblingCreated(cursor.options, side);
        sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
      }
      else { // if deleting like, inner close-brace of ([1+2}+3) where outer
        if (this.oppBrack(opts, this.parent.parent, side)) { // open-paren is
          this.parent.parent.closeOpposing(this); // ghost, then become [1+2+3)
          this.parent.parent.unwrap();
        } // else if deleting outward from a solid pair, unwrap
        else if (outward && wasSolid) {
          this.unwrap();
          sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
          return;
        }
        else { // else deleting just one of a pair of brackets, become one-sided
          this.sides[side] = { ch: OPP_BRACKS[this.sides[this.side].ch],
                               ctrlSeq: OPP_BRACKS[this.sides[this.side].ctrlSeq] };
          this.delimjQs.removeClass('mq-ghost')
            .eq(side === L ? 0 : 1).addClass('mq-ghost').html(this.sides[side].ch);
        }
        if (sib) { // auto-expand so ghost is at far end
          var origEnd = this.ends[L].ends[side];
          Fragment(sib, farEnd, -side).disown()
            .withDirAdopt(-side, this.ends[L], origEnd, 0)
            .jQ.insAtDirEnd(side, this.ends[L].jQ.removeClass('mq-empty'));
          if (origEnd.siblingCreated) origEnd.siblingCreated(cursor.options, side);
          cursor.insDirOf(-side, sib);
        } // didn't auto-expand, cursor goes just outside or just inside parens
        else (outward ? cursor.insDirOf(side, this)
                      : cursor.insAtDirEnd(side, this.ends[L]));
      }
    };
    _.deleteTowards = function(dir, cursor) {
      this.deleteSide(-dir, false, cursor);
    };
    _.finalizeTree = function() {
      this.ends[L].deleteOutOf = function(dir, cursor) {
        this.parent.deleteSide(dir, true, cursor);
      };
      // FIXME HACK: after initial creation/insertion, finalizeTree would only be
      // called if the paren is selected and replaced, e.g. by LiveFraction
      this.finalizeTree = this.intentionalBlur = function() {
        this.delimjQs.eq(this.side === L ? 1 : 0).removeClass('mq-ghost');
        this.side = 0;
      };
    };
    _.siblingCreated = function(opts, dir) { // if something typed between ghost and far
      if (dir === -this.side) this.finalizeTree(); // end of its block, solidify
    };
  });
  
  var OPP_BRACKS = {
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
    '\\{': '\\}',
    '\\}': '\\{',
    '&lang;': '&rang;',
    '&rang;': '&lang;',
    '\\langle ': '\\rangle ',
    '\\rangle ': '\\langle ',
    '|': '|'
  };
  
  function bindCharBracketPair(open, ctrlSeq) {
    var ctrlSeq = ctrlSeq || open, close = OPP_BRACKS[open], end = OPP_BRACKS[ctrlSeq];
    CharCmds[open] = bind(Bracket, L, open, close, ctrlSeq, end);
    CharCmds[close] = bind(Bracket, R, open, close, ctrlSeq, end);
  }
  bindCharBracketPair('(');
  bindCharBracketPair('[');
  bindCharBracketPair('{', '\\{');
  LatexCmds.langle = bind(Bracket, L, '&lang;', '&rang;', '\\langle ', '\\rangle ');
  LatexCmds.rangle = bind(Bracket, R, '&lang;', '&rang;', '\\langle ', '\\rangle ');
  CharCmds['|'] = bind(Bracket, L, '|', '|', '|', '|');
  
  LatexCmds.left = P(MathCommand, function(_) {
    _.parser = function() {
      var regex = Parser.regex;
      var string = Parser.string;
      var succeed = Parser.succeed;
      var optWhitespace = Parser.optWhitespace;
  
      return optWhitespace.then(regex(/^(?:[([|]|\\\{)/))
        .then(function(ctrlSeq) { // TODO: \langle, \rangle
          var open = (ctrlSeq.charAt(0) === '\\' ? ctrlSeq.slice(1) : ctrlSeq);
          return latexMathParser.then(function (block) {
            return string('\\right').skip(optWhitespace)
              .then(regex(/^(?:[\])|]|\\\})/)).map(function(end) {
                var close = (end.charAt(0) === '\\' ? end.slice(1) : end);
                var cmd = Bracket(0, open, close, ctrlSeq, end);
                cmd.blocks = [ block ];
                block.adopt(cmd, 0, 0);
                return cmd;
              })
            ;
          });
        })
      ;
    };
  });
  
  LatexCmds.right = P(MathCommand, function(_) {
    _.parser = function() {
      return Parser.fail('unmatched \\right');
    };
  });
  
  var Binomial =
  LatexCmds.binom =
  LatexCmds.binomial = P(P(MathCommand, DelimsMixin), function(_, super_) {
    _.ctrlSeq = '\\binom';
    _.htmlTemplate =
        '<span class="mq-non-leaf">'
      +   '<span class="mq-paren mq-scaled">(</span>'
      +   '<span class="mq-non-leaf">'
      +     '<span class="mq-array mq-non-leaf">'
      +       '<span>&0</span>'
      +       '<span>&1</span>'
      +     '</span>'
      +   '</span>'
      +   '<span class="mq-paren mq-scaled">)</span>'
      + '</span>'
    ;
    _.textTemplate = ['choose(',',',')'];
  });
  
  var Choose =
  LatexCmds.choose = P(Binomial, function(_) {
    _.createLeftOf = LiveFraction.prototype.createLeftOf;
  });
  
  LatexCmds.editable = // backcompat with before cfd3620 on #233
  LatexCmds.MathQuillMathField = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\MathQuillMathField';
    _.htmlTemplate =
        '<span class="mq-editable-field">'
      +   '<span class="mq-root-block">&0</span>'
      + '</span>'
    ;
    _.parser = function() {
      var self = this,
        string = Parser.string, regex = Parser.regex, succeed = Parser.succeed;
      return string('[').then(regex(/^[a-z][a-z0-9]*/i)).skip(string(']'))
        .map(function(name) { self.name = name; }).or(succeed())
        .then(super_.parser.call(self));
    };
    _.finalizeTree = function() {
      var ctrlr = Controller(this.ends[L], this.jQ, Options());
      ctrlr.KIND_OF_MQ = 'MathField';
      ctrlr.editable = true;
      ctrlr.createTextarea();
      ctrlr.editablesTextareaEvents();
      ctrlr.cursor.insAtRightEnd(ctrlr.root);
      RootBlockMixin(ctrlr.root);
    };
    _.registerInnerField = function(innerFields, MathField) {
      innerFields.push(innerFields[this.name] = MathField(this.ends[L].controller));
    };
    _.latex = function(){ return this.ends[L].latex(); };
    _.text = function(){ return this.ends[L].text(); };
  });
  
  // Embed arbitrary things
  // Probably the closest DOM analogue would be an iframe?
  // From MathQuill's perspective, it's a Symbol, it can be
  // anywhere and the cursor can go around it but never in it.
  // Create by calling public API method .dropEmbedded(),
  // or by calling the global public API method .registerEmbed()
  // and rendering LaTeX like \embed{registeredName} (see test).
  var Embed = LatexCmds.embed = P(Symbol, function(_, super_) {
    _.setOptions = function(options) {
      function noop () { return ""; }
      this.text = options.text || noop;
      this.htmlTemplate = options.htmlString || "";
      this.latex = options.latex || noop;
      return this;
    };
    _.parser = function() {
      var self = this;
        string = Parser.string, regex = Parser.regex, succeed = Parser.succeed;
      return string('{').then(regex(/^[a-z][a-z0-9]*/i)).skip(string('}'))
        .then(function(name) {
          // the chars allowed in the optional data block are arbitrary other than
          // excluding curly braces and square brackets (which'd be too confusing)
          return string('[').then(regex(/^[-\w\s]*/)).skip(string(']'))
            .or(succeed()).map(function(data) {
              return self.setOptions(EMBEDS[name](data));
            })
          ;
        })
      ;
    };
  });
  var MQ1 = getInterface(1);
  for (var key in MQ1) (function(key, val) {
    if (typeof val === 'function') {
      MathQuill[key] = function() {
        insistOnInterVer();
        return val.apply(this, arguments);
      };
      MathQuill[key].prototype = val.prototype;
    }
    else MathQuill[key] = val;
  }(key, MQ1[key]));
  
  }());

/* clsSMFill\FillInTheBlanksPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMFill\\FillInTheBlanksPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-zb1ued-style";
	style.textContent = "xmp{display:inline}[id^=\"fillmain\"]{overflow:hidden;max-width:1024px;text-align:left}[id^=\"fillmain\"] pre{background:none;border:none;font-size:14px!important}[id^=\"fillmain\"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^=\"fillmain\"] .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^=\"fillmain\"] .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^=\"fillmain\"] .fill-row{padding:6px}[id^=\"fillmain\"] .fillelement, [id^=\"fillmain\"] .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}[id^=\"fillmain\"] input[type=\"text\"], [id^=\"fillmain\"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^=\"fillmain\"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^=\"fillmain\"] .drag-resize.ui-draggable{cursor:move}[id^=\"fillmain\"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^=\"fillmain\"] .fillcheck ul{width:220px}[id^=\"fillmain\"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^=\"fillmain\"] .select{font-size:15px}[id^=\"fillmain\"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}.bla [id^=\"fillmain\"] .dragable:focus, .bla [id^=\"fillmain\"] .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}[id^=\"fillmain\"] select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#555;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Helvetica,Arial,'Times New Roman',Verdana,sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.prettyprint{display:-ms-grid!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbEluVGhlQmxhbmtzUHJldmlldy5zdmVsdGUiLCJzb3VyY2VzIjpbIkZpbGxJblRoZUJsYW5rc1ByZXZpZXcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbi8qKlxyXG4gKiAgRmlsZSBOYW1lICAgOiBGaWxsSW5UaGVCbGFua3NQcmV2aWV3LmpzXHJcbiAqICBEZXNjcmlwdGlvbiA6IENvbnRhaW5lciBmb3IgYWxsIEZpbGwgaW4gVGhlIEJsYW5rcyBwcmV2aWV3IE1vZHVsZVxyXG4gKlx0QXV0aG9yICAgICAgOiBQcmFkZWVwIFlhZGF2XHJcbiAqICBWZXJzaW9uICAgICA6IDEuMFxyXG4gKiAgUGFja2FnZSAgICAgOiBzdmVsdGVfaXRlbXNcclxuICogIExhc3QgdXBkYXRlIDogMTcgRGVjIDIwMTdcclxuICovXHJcblx0aW1wb3J0IHt1Y0ZpbGx9IGZyb20gJy4vZmlsbEpTU3RyaW5nJztcclxuXHRpbXBvcnQganUgZnJvbSAnLi4vc3JjL2xpYnMvanNsaWInO1xyXG5cdGltcG9ydCBJdGVtSGVscGVyIGZyb20gJy4uL2hlbHBlci9JdGVtSGVscGVyLnN2ZWx0ZSc7XHJcblx0aW1wb3J0IEZpbGxJblRoZUJsYW5rc1Rvb2xiYXIgZnJvbSAnLi9GaWxsSW5UaGVCbGFua3NUb29sYmFyLnN2ZWx0ZSc7XHJcblx0aW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xyXG5cdGltcG9ydCB7IGJlZm9yZVVwZGF0ZSwgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSc7XHJcblx0aW1wb3J0IHsgQUgsIG9uVXNlckFuc0NoYW5nZSwgWE1MVG9KU09OIH0gZnJvbSAnLi4vaGVscGVyL0hlbHBlckFJLnN2ZWx0ZSc7XHJcblxyXG5cdC8vTWF0aHF1aWxsLCBzZXEgaXMgaW1wb3J0YW50IGFuZCBtYXRocXVpbCBpcyBkZXBlbmRlbnQgb24gcXVlcnksIHNvIGRvIG5vdCByZW1vdmUgdGhpc1xyXG5cdGltcG9ydCAnLi4vc3JjL2xpYnMvbWF0aHF1aWxsLmNzcyc7XHJcblx0aW1wb3J0ICdodHRwczovL2FqYXguZ29vZ2xlYXBpcy5jb20vYWpheC9saWJzL2pxdWVyeS8xLjExLjAvanF1ZXJ5Lm1pbi5qcyc7XHJcblx0aW1wb3J0ICcuLi9zcmMvbGlicy9tYXRoUXVpbGxfbmV3JztcclxuXHJcblx0ZXhwb3J0IGxldCBtYW51YWxfZ3JhZGU7XHJcblx0ZXhwb3J0IGxldCB4bWw7XHJcblx0ZXhwb3J0IGxldCB1eG1sO1xyXG5cdGV4cG9ydCBsZXQgaXNSZXZpZXc7XHJcblx0ZXhwb3J0IGxldCBlZGl0b3JTdGF0ZTtcclxuXHRleHBvcnQgbGV0IHNtVmFsaWRhdGU7XHJcblx0ZXhwb3J0IGxldCBzaG93QW5zO1xyXG5cdC8vIHZhcmlhYmxlIGRlY2xhcmF0aW9uXHJcblx0bGV0IHNtQ29udHJvbGxlckNhbGxiYWNrO1xyXG5cdGxldCBjZGF0YSA9IFwiXCI7XHJcblx0bGV0IGRyYWdEYXRhID0gXCJcIjtcclxuXHRsZXQgQ2hlY2tEdXBsaWNhdGUgPSBbXTtcclxuXHRsZXQgZHJhZ0lEID0gMDtcclxuXHRsZXQgZXJyb3JDYXRjaEZsYWcgPSAxO1xyXG5cdGxldCBmaWxsTWF0aCA9IFtdO1xyXG5cdGxldCBmaWxsSWQ7XHJcblx0bGV0IHBhcnNlZFhtbCA9IHt9O1xyXG5cdGxldCBwYXJzZWRVeG1sID0ge307XHJcblx0bGV0IGNvbnRhaW5lcklEID0gXCJmaWxsbWFpblwiO1xyXG5cdGdsb2JhbFRoaXMuYWpheF9lSWQgPSBcIiNmaWxsbWFpblwiO1xyXG5cdGxldCBzdGF0ZSA9IHt9O1xyXG5cdGxldCBoZGQgPSB3cml0YWJsZSh7XHJcblx0XHRcdG1hdGNodHlwZSA6IFwiMFwiLFxyXG5cdFx0XHRpZ25vcmV0eXBlOlwiXCIsXHJcblx0XHRcdG11bHRpOlwiXCIsXHJcblx0XHRcdHRvdGFsY29ycmVjdGFuczowLFxyXG5cdFx0XHRzaG93VG9vbGJhcjogZmFsc2UsXHJcblx0XHRcdGlzTWF0aHF1aWxsOmZhbHNlLFxyXG5cdFx0XHRmaWxsTWF0aDogW10sXHJcblx0XHRcdGZvb3RlclN0cjogZmFsc2UsXHJcblx0XHR9KTtcclxuXHRjb25zdCB1bnN1YnNjcmliZSA9IGhkZC5zdWJzY3JpYmUoKGl0ZW1zKT0+IHtcclxuXHRcdHN0YXRlID0gaXRlbXM7XHJcblx0fSlcclxuXHJcblx0JDogKGlzUmV2aWV3KSA/IHNldFJldmlldygpIDogdW5zZXRSZXZpZXcoKTtcclxuXHJcblx0b25Nb3VudCgoKT0+IHtcclxuXHRcdHdpbmRvdy5KID0ganU7XHJcblx0XHR1Y0ZpbGwuc2V0VXBkYXRlKHVwZGF0ZU1vZHVsZS5iaW5kKHRoaXMpKTtcclxuXHRcdGxldCBtYXRoSXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklEKTtcclxuXHRcdG1hdGhJdGVtID0gbWF0aEl0ZW0gPyBtYXRoSXRlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtYXRocXVpbGwnKSA6IG1hdGhJdGVtO1xyXG5cdFx0aWYgKHN0YXRlLmlzTWF0aHF1aWxsKSB7XHJcblx0XHRcdEFILnNlbGVjdEFsbChcImRpdlwiICsgYWpheF9lSWQsICAnY3NzJywgeydvdmVyZmxvdyc6ICdhdXRvJ30pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gQmluZGluZyB0aGUgZXZlbnRzIFxyXG5cdFx0QUguYmluZChhamF4X2VJZCwgJ2NsaWNrJywgZGlzcGxheUFucyk7XHJcblx0XHRBSC5iaW5kKGFqYXhfZUlkLCAna2V5dXAnLCBkaXNwbGF5QW5zKTtcclxuXHRcdEFILmJpbmQoYWpheF9lSWQsICdjaGFuZ2UnLCBkaXNwbGF5QW5zKTtcclxuXHJcblx0XHRBSC5saXN0ZW4oZG9jdW1lbnQsIFwiY2xpY2tcIiwgXCJzcGFuLm1xLWVkaXRhYmxlLWZpZWxkLm1xLWZvY3VzZWRcIiwgb25lZGl0b0ZvY3VzZWQpO1xyXG5cdFx0QUgubGlzdGVuKGRvY3VtZW50LCBcImNoYW5nZVwiLCBcInNwYW4ubXEtZWRpdGFibGUtZmllbGQubXEtZm9jdXNlZFwiLCBvbmVkaXRvRm9jdXNlZCk7XHJcblxyXG5cdFx0Ly8gZm9yIGxvYWRpbmcgdGhlIG1vZHVsZSBvbiB0aGUgYmFzaXMgb2YgdGhlIHVwZGF0ZWQgdGhlIHhtbFxyXG5cdFx0bG9hZE1vZHVsZSgpO1xyXG5cdH0pXHJcblxyXG5cdC8qXHJcblx0KiogVGhpcyBmdW5jdGlvbiB3aWxsIGNhbGwgd2hlbiBjb21wZW50IHJlY2lldmluZyBuZXcgcHJvcCBpbiBvdGhlciB3b3JkcyB3aGVuZXZlciBcclxuXHQqKiBhbnkgdGhpbmcgY2hhbmdlcyBpbiB4bWwgdGhpcyBmdW5jdGlvbiB3aWxsIGNhbGwgYXV0b21hdGljYWxseVxyXG5cdCovXHJcblx0YmVmb3JlVXBkYXRlKChuZXh0UHJvcHMpPT4ge1xyXG5cdFx0Ly8gY2hlY2sgZm9yIHRoZSByZW1lZGlhdGlvbiBtb2RlIFxyXG5cdFx0Ly8gaWYgdGhlIHJlbWVkaWF0aW9uIG1vZGUgaXMgb25cclxuXHRcdC8vIGlmIChpc1Jldmlldykge1xyXG5cdFx0Ly8gXHQvLyBzaG93IHRoZSBhbnNlcnQgYnkgY2FsbGluZyB0aGUgc2V0UmV2aWV3IGZ1bmN0aW9uXHJcblx0XHQvLyBcdHNldFJldmlldygpO1xyXG5cdFx0Ly8gfSBlbHNlIHtcclxuXHRcdC8vIFx0dW5zZXRSZXZpZXcoKVxyXG5cdFx0Ly8gfVxyXG5cdFx0Ly8gZm9yIGNoZWNraW5nIHRoYXQgdGhlcmUgaXMgY2hhbmdlIGluIHRoZSB4bWxcclxuXHRcdGlmICh4bWwgIT0gc3RhdGUueG1sKSB7XHJcblx0XHRcdGlmIChlZGl0b3JTdGF0ZSAmJiBlZGl0b3JTdGF0ZS5zdG9wUHJldmlld1VwZGF0ZSA9PSB0cnVlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdC8vIGZvciBsb2FkaW5nIHRoZSBtb2R1bGUgb24gdGhlIGJhc2lzIG9mIHRoZSB1cGRhdGVkIHRoZSB4bWxcclxuXHRcdFx0bG9hZE1vZHVsZSgpO1xyXG5cdFx0XHQvLyBmb3IgYWRkaW5nIHRoZSB0YWJpbmRleFxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bGV0IG5vZGUgPSAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXZpZXdBcmVhJyk7XHJcblx0XHRcdFx0aWYobm9kZS5jaGlsZE5vZGVzWzBdICYmIG5vZGUuY2hpbGROb2Rlc1swXS5ub2RlTmFtZSA9PSAnVEFCTEUnKSB7XHJcblx0XHRcdFx0XHRub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3ByZXZpZXdBcmVhIHRkJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpdGVtIGluIG5vZGUpeyBcclxuXHRcdFx0XHRcdFx0aWYoIW5vZGVbaXRlbV0uZmlyc3RFbGVtZW50Q2hpbGQgJiYgbm9kZVtpdGVtXS5ub2RlTmFtZSA9PSAnVEQnKXtcclxuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKG5vZGVbaXRlbV0uY2hpbGROb2Rlc1swXS5ub2RlVHlwZSk7XHJcblx0XHRcdFx0XHRcdFx0bm9kZVtpdGVtXS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnMCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGl0ZW0gaW4gbm9kZS5jaGlsZE5vZGVzKXsgXHJcblx0XHRcdFx0XHRcdGlmKG5vZGUuY2hpbGROb2Rlc1tpdGVtXS5ub2RlVHlwZSA9PSAzKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblx0XHRcdFx0XHRcdFx0dHh0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCcwJyk7XHJcblx0XHRcdFx0XHRcdFx0dHh0LmlubmVySFRNTCA9IG5vZGUuY2hpbGROb2Rlc1tpdGVtXS50ZXh0Q29udGVudDtcclxuXHRcdFx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbaXRlbV0ucmVwbGFjZVdpdGgodHh0KTtcclxuXHRcdFx0XHRcdFx0XHQvL25vZGUuY2hpbGROb2Rlc1tpdGVtXS5ub2RlVmFsdWUgPSA8c3BhbiB0YWJpbmRlPVwiMFwiPnt9PC9zcGFuPjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwxMDAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8gZm9yIGxvYWRpbmcgdGhlIG1vZHVsZSBpbml0aWFsbHkgXHRcclxuXHRmdW5jdGlvbiBsb2FkTW9kdWxlKCkge1xyXG5cdFx0c3RhdGUueG1sID0geG1sO1xyXG5cdFx0Ly8gY29udmVydGluZyB0aGUgeG1sIHRvIGpzb24gdXNpbmcgWE1MVG9KU09OIGZ1bmN0aW9uXHJcblx0XHRwYXJzZWRYbWwgPSBYTUxUb0pTT04oeG1sKTtcclxuXHRcdC8vIGNoZWNraW5nIGZvciB1c2VyIGFuc1xyXG5cdFx0aWYgKHV4bWwpIHtcclxuXHRcdFx0aWYgKCF3aW5kb3cuaXNSZXNldE1hdGgpIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJ1eG1sIGxvYWRlZFwiLCB3aW5kb3cuaXNSZXNldE1hdGgpO1xyXG5cdFx0XHRcdHBhcnNlZFV4bWwgPSBYTUxUb0pTT04odXhtbCk7XHJcblx0XHRcdFx0c3RhdGUudXhtbCA9IHV4bWw7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKFwiVXhtbCBub3QgbG9hZGVkXCIsIHdpbmRvdy5pc1Jlc2V0TWF0aCk7XHJcblx0XHRcdFx0d2luZG93LmlzUmVzZXRNYXRoID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIHBhcnNpbmcgdGhlIGF1dGhvcmluZyB4bWxcclxuXHRcdHBhcnNlWG1sQXV0aG9yaW5nKHBhcnNlZFhtbCwgcGFyc2VkVXhtbCk7XHJcblx0XHR1Y0ZpbGwuc2hvd2RyYWdhbnMoYWpheF9lSWQsICd1Jyk7XHJcblx0XHRpZigheG1sKSB7XHJcblx0XHRcdGxldCBlcnJNc2cgPSBzbVZhbC52YWxpZGF0ZShlZGl0b3JTdGF0ZS5jb250ZW50X3R5cGUsIGVkaXRvclN0YXRlLnN1YnR5cGUgLCBlZGl0b3JTdGF0ZS5jb250ZW50X2ljb24pO1xyXG5cdFx0XHRzbVZhbGlkYXRlKGVyck1zZyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1cGRhdGVVc2VyQW5zKHBhcnNlZFVhbnMpIHtcclxuXHRcdGxldCB1YVhNTE5ldyA9IFwiXCI7XHJcblx0XHQvLyBmaW5kaW5nIHRoZSBjb3JyZWN0IGFuc1xyXG5cdFx0bGV0IGFuc3dlcktleSA9IHBhcnNlZFhtbC5zbXhtbC50ZXh0Ll9fY2RhdGEubWF0Y2goLyV7W1xcc1xcU10qP30lL2dtKTtcclxuXHRcdGxldCBhbnN3ZXJUeXBlID0gXCJcIjtcclxuXHRcdC8vIGlmIGNvcnJlY3QgYW5zd2VyIGlzIGZvdW5kIHRyYXZlcnNlaW5nIGVhY2ggY29ycmVjdCBhbnNcclxuXHRcdGlmIChhbnN3ZXJLZXkpIHtcclxuXHRcdFx0YW5zd2VyS2V5LmZvckVhY2goKGN1cnJlbnRBbnMsIGkpPT4ge1xyXG5cdFx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcclxuXHRcdFx0XHRpZiAocGFyc2VkVWFucykge1xyXG5cdFx0XHRcdFx0aWYgKHBhcnNlZFVhbnMuc21hbnMpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHVhbnMgPSBwYXJzZWRVYW5zLnNtYW5zLmRpdjtcclxuXHRcdFx0XHRcdFx0aWYoQXJyYXkuaXNBcnJheSh1YW5zKSA9PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0XHRcdHVhbnMgPSBbXVxyXG5cdFx0XHRcdFx0XHRcdHVhbnNbMF0gPSBwYXJzZWRVYW5zLnNtYW5zLmRpdjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZih1YW5zKSB7XHJcblx0XHRcdFx0XHRcdFx0dWFYTUxOZXcgPSB1YW5zW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGZpbmRpbmcgdGhlIHR5cGUgYnkgZmluZGluZyB0aGUgbWF0Y2ggd2l0aCBzdHJpbmcgY29udGFpbmluZyB8IGluIHRoZSBzdGFydCBhbmQgZW5kIHdpdGggfSVcclxuXHRcdFx0XHRhbnN3ZXJUeXBlID0gY3VycmVudEFucy5tYXRjaCgvXFx8KC4qPyl9JSQvZ20pO1xyXG5cdFx0XHRcdC8vIHJlbW92aW5nIHRoZSB8IHN5bWJvbCBhbmQgfSUgYW5kIHNhdmUgdGhlIHJlbWFpbmluZyB0aGluZyBpbiBhbnN3ZXJUeXBlIGlmIG1hdGNoIGlzIGZvdW5kIG90aGVyd2lzZSBrZXB0IHRoZSBhbnN3ZXJUeXBlIGJhbG5rXHJcblx0ICAgIFx0XHRhbnN3ZXJUeXBlID0gKGFuc3dlclR5cGUpID8gYW5zd2VyVHlwZVswXS5yZXBsYWNlKC9cXHx8fSUvZ20sJycpIDogJyc7XHJcblx0ICAgIFx0XHRhbnN3ZXJUeXBlID0gYW5zd2VyVHlwZS50cmltKCk7XHJcblx0XHRcdFx0aWYgKHVhWE1MTmV3ICYmIHVhWE1MTmV3Ll91c2VyQW5zKSB7XHJcblx0XHRcdFx0XHQvLyBzdG9yaW5nIHRoZSB1c2VyYW5zIGF0dHJpYnV0ZSB2YWx1ZSBpbiB1c2VyYW5zd2VyXHJcblx0XHRcdFx0XHRsZXQgaWQgPSBcIlwiO1xyXG5cdFx0XHRcdFx0aWYgKGFuc3dlclR5cGUgPT0gJycgfHwgYW5zd2VyVHlwZSA9PSAnYycpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRm9yIHRleHRib3hcclxuXHRcdFx0XHRcdFx0aWQgPSBgI2VsZW0ke2l9IC5maWxsaW50aGVibGFua2A7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFuc3dlclR5cGUgPT0gJ24nKSB7IFxyXG5cdFx0XHRcdFx0XHQvLyBpZiB0aGUgdHlwZSBpcyBudW1lcmljXHJcblx0XHRcdFx0XHRcdGlkID0gYCNlbGVtJHtpfSAuZmlsbGludGhlYmxhbmtgO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhbnN3ZXJUeXBlID09IFwiZFwiIHx8IGFuc3dlclR5cGUgPT0gXCJkc1wiKSB7XHJcblx0XHRcdFx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcclxuXHRcdFx0XHRcdFx0aWQgPSBgI2VsZW0ke2l9YDtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5zd2VyVHlwZSA9PSBcInNcIikge1xyXG5cdFx0XHRcdFx0XHQvLyBjaGVja2luZyBjcmVhdGVTZWxlY3RCb3ggZm9yIHRoZSB1c2VyIGFuc1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhbnN3ZXJUeXBlID09IFwiZVwiKSB7XHJcblx0XHRcdFx0XHRcdGlkID0gYCNlbGVtJHtpfWA7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFuc3dlclR5cGUuaW5kZXhPZihcIntcIiA9PSAwKSB8fCBhbnN3ZXJUeXBlLmluZGV4T2YoXCJ7XCIgPT0gMSkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRm9yIG11bHRpbGluZSBcclxuXHRcdFx0XHRcdFx0aWQgPSBgI2VsZW0ke2l9IC50ZXh0YXJlYWA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoQUguaXNWYWxpZChpZCkgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCkpIHtcclxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCkuc2V0QXR0cmlidXRlKCd1c2VyYW5zJywgdWFYTUxOZXcuX3VzZXJBbnMpO1xyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGN1cnJlbnRBbnMsIGlkLCBhbnN3ZXJUeXBlLCB1YVhNTE5ldy5fdXNlckFucyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIHRoaXMgZnVuY3Rpb24gcmVzcG9uc2libGUgZm9yIHBhcnNpbmcgdGhlIHhtbCBcclxuXHRmdW5jdGlvbiBwYXJzZVhtbEF1dGhvcmluZyhNWVhNTCwgdWFYTUw9ZmFsc2UpIHtcclxuXHRcdC8vIGZldGNoaW5nIHRoZSBjZGF0YVxyXG5cdFx0Y2RhdGEgPSBNWVhNTC5zbXhtbC50ZXh0Ll9fY2RhdGE7XHJcblx0XHRkcmFnRGF0YSA9IFwiXCI7XHJcblx0XHRDaGVja0R1cGxpY2F0ZSA9IFtdO1xyXG5cdFx0ZHJhZ0lEID0gMDtcclxuXHRcdHN0YXRlLmZvb3RlclN0ciA9IGZhbHNlO1xyXG5cdFx0QUguc2VsZWN0QWxsKFwiLnNtbm90ZXNcIiwgJ2hpZGUnKTtcclxuXHJcblx0XHQvLyBjb252ZXJ0aW5nIHRoZSBtYXRjaFR5cGUgdG8gbWF0Y2h0eXBlXHJcblx0XHRpZiAoTVlYTUwuc214bWwudGV4dC5fbWF0Y2hUeXBlKSB7XHJcblx0XHRcdE1ZWE1MLnNteG1sLnRleHQuX21hdGNodHlwZSA9IE1ZWE1MLnNteG1sLnRleHQuX21hdGNoVHlwZTtcclxuXHRcdFx0ZGVsZXRlIE1ZWE1MLnNteG1sLnRleHQuX21hdGNoVHlwZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb252ZXJ0aW5nIHRoZSBpZ25vcmVUeXBlIHRvIGlnbm9yZXR5cGVcclxuXHRcdGlmIChNWVhNTC5zbXhtbC50ZXh0Ll9pZ25vcmVUeXBlKSB7XHJcblx0XHRcdE1ZWE1MLnNteG1sLnRleHQuX2lnbm9yZXR5cGUgPSBNWVhNTC5zbXhtbC50ZXh0Ll9pZ25vcmVUeXBlO1xyXG5cdFx0XHRkZWxldGUgTVlYTUwuc214bWwudGV4dC5faWdub3JlVHlwZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXR0aW5nIHN0YXRlIFxyXG5cdFx0c3RhdGUubWF0Y2h0eXBlID0gTVlYTUwuc214bWwudGV4dC5fbWF0Y2h0eXBlO1xyXG5cdFx0c3RhdGUuaWdub3JldHlwZSA9IE1ZWE1MLnNteG1sLnRleHQuX2lnbm9yZXR5cGU7XHJcblx0XHRzdGF0ZS5tdWx0aSA9IChNWVhNTC5zbXhtbC50ZXh0Ll9tdWx0aXBsZSA9PSBcIm11bHRpcGxlXCIpID8gXCIxXCIgOiBcIlwiO1xyXG5cclxuXHRcdC8vIGZpbmRpbmcgdGhlIGNvcnJlY3QgYW5zXHJcblx0XHRsZXQgYW5zd2VyS2V5ID0gY2RhdGEubWF0Y2goLyV7W1xcc1xcU10qP30lL2dtKTtcclxuXHRcdGxldCBhbnN3ZXJUeXBlID0gJyc7XHJcblx0XHRsZXQgY2hlY2tUeXBlID0gW107XHJcblx0XHRsZXQgdWFYTUxOZXcgPSBcIlwiO1xyXG5cdFx0bGV0IHRvdGFsTWFya3MgPSAwO1xyXG5cdFx0Ly8gaWYgY29ycmVjdCBhbnN3ZXIgaXMgZm91bmQgdHJhdmVyc2VpbmcgZWFjaCBjb3JyZWN0IGFuc1xyXG5cdFx0aWYgKGFuc3dlcktleSkge1xyXG5cdFx0XHRhbnN3ZXJLZXkuZm9yRWFjaCgodiwgaSk9PntcclxuXHRcdFx0XHR0b3RhbE1hcmtzKys7XHJcblx0XHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSB1c2VyIGFuc1xyXG5cdFx0XHRcdGlmICh1YVhNTCkge1xyXG5cdFx0XHRcdFx0aWYgKHVhWE1MLnNtYW5zKSB7XHJcblx0XHRcdFx0XHRcdGxldCB1YW5zID0gdWFYTUwuc21hbnMuZGl2O1xyXG5cdFx0XHRcdFx0XHRpZihBcnJheS5pc0FycmF5KHVhbnMpID09IGZhbHNlKSB7XHJcblx0XHRcdFx0XHRcdFx0dWFucyA9IFtdXHJcblx0XHRcdFx0XHRcdFx0dWFuc1swXSA9IHVhWE1MLnNtYW5zLmRpdjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZih1YW5zKSB7XHJcblx0XHRcdFx0XHRcdFx0dWFYTUxOZXcgPSB1YW5zW2ldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgb3JpZ2luYWxLZXkgPSBhbnN3ZXJLZXlbaV07XHJcblx0XHRcdFx0Ly8gZmluZGluZyB0aGUgdHlwZSBieSBmaW5kaW5nIHRoZSBtYXRjaCB3aXRoIHN0cmluZyBjb250YWluaW5nIHwgaW4gdGhlIHN0YXJ0IGFuZCBlbmQgd2l0aCB9JVxyXG5cdFx0XHRcdGFuc3dlclR5cGUgPSBhbnN3ZXJLZXlbaV0ubWF0Y2goL1xcfCguKj8pfSUkL2dtKTtcclxuXHRcdFx0XHQvLyByZW1vdmluZyB0aGUgfCBzeW1ib2wgYW5kIH0lIGFuZCBzYXZlIHRoZSByZW1haW5pbmcgdGhpbmcgaW4gYW5zd2VyVHlwZSBpZiBtYXRjaCBpcyBmb3VuZCBvdGhlcndpc2Uga2VwdCB0aGUgYW5zd2VyVHlwZSBiYWxua1xyXG5cdCAgICBcdFx0YW5zd2VyVHlwZSA9IChhbnN3ZXJUeXBlKSA/IGFuc3dlclR5cGVbMF0ucmVwbGFjZSgvXFx8fH0lL2dtLCcnKSA6ICcnO1xyXG5cdCAgICBcdFx0YW5zd2VyVHlwZSA9IGFuc3dlclR5cGUudHJpbSgpO1xyXG5cdFx0XHRcdGNoZWNrVHlwZS5wdXNoKGFuc3dlclR5cGUpO1xyXG5cdFx0XHRcdC8vIGluIGNhc2Ugb2YgdGV4dGJveCBvciBjb2RldHlwZVxyXG5cdCAgICBcdFx0aWYoYW5zd2VyVHlwZSA9PSAnJyB8fCBhbnN3ZXJUeXBlID09ICdjJykge1xyXG5cdFx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLnNtbm90ZXNcIiwgJ3Nob3cnKTtcclxuXHRcdFx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcclxuXHRcdFx0XHRcdGlmKHVhWE1MTmV3KSB7XHJcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgdGV4dGJveCBpbiB0aGUgcHJldmlldyBhcmVhIHdpdGggdXNlciBhbnNcclxuXHRcdFx0XHRcdFx0Y3JlYXRlVGV4dGJveChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgdGV4dGJveCBpbiB0aGUgcHJldmlldyBhcmVhXHJcblx0XHRcdFx0XHRcdGNyZWF0ZVRleHRib3gob3JpZ2luYWxLZXksaSk7XHJcblx0XHRcdFx0XHR9XHJcblx0ICAgIFx0XHR9IGVsc2UgaWYoYW5zd2VyVHlwZSA9PSAnbicpIHsgXHJcblx0XHRcdFx0XHQvLyBpZiB0aGUgdHlwZSBpcyBudW1lcmljXHJcblx0XHRcdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXHJcblx0XHRcdFx0XHRpZih1YVhNTE5ldykge1xyXG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIG51bWVyaWMgdGV4dGJveCBpbiB0aGUgcHJldmlldyBhcmVhIHdpdGggdXNlciBhbnNcclxuXHRcdFx0XHRcdFx0Y3JlYXRlTnVtZXJpY2JveChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcclxuXHRcdFx0XHRcdH1lbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSBudW1lcmljIHRleHRib3ggaW4gdGhlIHByZXZpZXcgYXJlYVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVOdW1lcmljYm94KG9yaWdpbmFsS2V5LGkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdCAgICBcdFx0fSBlbHNlIGlmKGFuc3dlclR5cGUgPT0gXCJkXCIgfHwgYW5zd2VyVHlwZSA9PSBcImRzXCIpIHtcclxuXHRcdFx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcclxuXHRcdFx0XHRcdGlmKHVhWE1MTmV3KXtcclxuXHRcdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSBkcmFnICYgZHJvcCB0ZXh0Ym94IGluIHRoZSBwcmV2aWV3IGFyZWEgd2l0aCB1c2VyIGFuc1xyXG5cdFx0XHRcdFx0XHRjcmVhdGVEcmFnRHJvcChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgZHJhZyAmIGRyb3AgdGV4dGJveCBpbiB0aGUgcHJldmlldyBhcmVhXHJcblx0XHRcdFx0XHRcdGNyZWF0ZURyYWdEcm9wKG9yaWdpbmFsS2V5LGkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdCAgICBcdFx0XHRcclxuXHQgICAgXHRcdH0gZWxzZSBpZihhbnN3ZXJUeXBlID09IFwic1wiKSB7XHJcblx0XHRcdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXHJcblx0XHRcdFx0XHRpZih1YVhNTE5ldykge1xyXG5cdFx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIHNlbGVjdCBib3ggaW4gdGhlIHByZXZpZXcgYXJlYSB3aXRoIHVzZXIgYW5zXHJcblx0XHRcdFx0XHRcdGNyZWF0ZVNlbGVjdEJveChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgc2VsZWN0IGJveCBpbiB0aGUgcHJldmlldyBhcmVhXHJcblx0XHRcdFx0XHRcdGNyZWF0ZVNlbGVjdEJveChvcmlnaW5hbEtleSxpKTtcclxuXHRcdFx0XHRcdH1cclxuXHQgICAgXHRcdH0gZWxzZSBpZihhbnN3ZXJUeXBlID09IFwiZVwiKSB7XHJcblx0XHRcdFx0XHRzdGF0ZS5pc01hdGhxdWlsbCA9IHRydWU7XHJcblx0XHRcdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXHJcblx0XHRcdFx0XHRpZiAodWFYTUxOZXcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gY3JlYXRpbmcgdGV4dGJveCB3aXRoIHVzZXIgYW5zIGluIHByZXZpZXcgYXJlYVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVNYXRoRGl2KG9yaWdpbmFsS2V5LGksdWFYTUxOZXcpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gY3JlYXRpbmcgdGV4dGJveCBpbiBwcmV2aWV3IGFyZWFcclxuXHRcdFx0XHRcdFx0Y3JlYXRlTWF0aERpdihvcmlnaW5hbEtleSxpKTtcclxuXHRcdFx0XHRcdH1cclxuXHQgICAgXHRcdH0gZWxzZSBpZihhbnN3ZXJUeXBlLmluZGV4T2YoXCJ7XCIgPT0gMCkgfHwgYW5zd2VyVHlwZS5pbmRleE9mKFwie1wiID09IDEpKSB7XHJcblx0XHRcdFx0XHRBSC5zZWxlY3RBbGwoXCIuc21ub3Rlc1wiLCAnc2hvdycpO1xyXG5cdFx0XHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSB1c2VyIGFuc1xyXG5cdFx0XHRcdFx0aWYgKHVhWE1MTmV3KSB7XHJcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgdGV4dGFyZWEgaW4gdGhlIHByZXZpZXcgYXJlYSB3aXRoIHVzZXIgYW5zXHJcblx0XHRcdFx0XHRcdGNyZWF0ZU11bHRpbGluZUJveChvcmlnaW5hbEtleSxpLHVhWE1MTmV3KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgdGV4dGFyZWEgaW4gdGhlIHByZXZpZXcgYXJlYVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVNdWx0aWxpbmVCb3gob3JpZ2luYWxLZXksaSk7XHRcclxuXHRcdFx0XHRcdH1cclxuXHQgICAgXHRcdH1cclxuXHRcdFx0XHRsZXQgaW5uZXJLZXkgPSBvcmlnaW5hbEtleS5yZXBsYWNlKFwiJXtcIixcIlwiKS5yZXBsYWNlKFwifSVcIixcIlwiKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRBSC5zZWxlY3RBbGwoXCIjXCIrY29udGFpbmVySUQsICdhdHRyJywge1widG90YWxjb3JyZWN0YW5zXCI6IHRvdGFsTWFya3N9ICk7XHJcblx0XHQvLyBSZXNvbHZlIGh0bWwgZW50aXR5XHJcblx0XHRjZGF0YSA9IEFILmlnbm9yZUVuaXR5KGNkYXRhKTtcclxuXHRcdFxyXG5cdFx0Ly8gcHV0IHRoZSBjZGF0YSBpbiB0aGUgcHJldmlld2FyZWFcclxuXHRcdEFILmZpbmQoXCIjXCIrY29udGFpbmVySUQsIFwiI3ByZXZpZXdBcmVhXCIsIHthY3Rpb246J2h0bWwnLCBhY3Rpb25EYXRhOiBjZGF0YX0pO1xyXG5cdFx0Ly8gcHV0IHRoZSBkcmFnRGF0YSBpbiB0aGUgZHJhZ2FyZWFcclxuXHRcdEFILmZpbmQoXCIjXCIrY29udGFpbmVySUQsIFwiLmRyYWdBcmVhXCIse2FjdGlvbjogJ2h0bWwnLCBhY3Rpb25EYXRhOiBkcmFnRGF0YX0pO1xyXG5cdFx0bGV0IHBhcmVudCA9IEFILmZpbmQoXCIjXCIrY29udGFpbmVySUQsIFwiLmRyYWdBcmVhXCIpO1xyXG5cdCAgICBsZXQgZGl2cyA9IHBhcmVudD8uY2hpbGRyZW4gPyBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikgOiBbXTtcclxuXHQgICAgd2hpbGUgKGRpdnMubGVuZ3RoKSB7XHJcblx0ICAgICAgICBwYXJlbnQuYXBwZW5kKGRpdnMuc3BsaWNlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGRpdnMubGVuZ3RoKSwgMSlbMF0pO1xyXG5cdCAgICB9XHJcblx0XHQvLyBzZXQgdGhlIG1heCB3aWR0aCBvZiB0aGUgdGV4dGJveFxyXG5cdCAgICBzZXRNYXhXaWR0aCgpO1xyXG5cdCAgICBzZXRTTU5vdGVzKCk7XHJcblx0XHRydW5Nb2R1bGUoKTtcclxuXHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoQUguZmluZChhamF4X2VJZCwgXCIucHJldHR5cHJpbnRcIiwgJ2FsbCcpLmxlbmd0aCA+PSAxKSB7XHJcblx0XHRcdFx0aWYoQUguZmluZChhamF4X2VJZCwgXCIucHJldHR5cHJpbnQgLkwwXCIsICdhbGwnKS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0aWYodHlwZW9mKHByZXR0eVByaW50KSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdC8qY29kZSB0byBwcmV2ZW50IHByZXR0eSBwcmludCBleGlzdGluZyBwcmV0aWZpZWQgY29kZSAwNC8wMi8yMDE4Ki9cclxuXHRcdFx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLnByZXR0eXByaW50XCIpLmZvckVhY2goKF90aGlzKT0+e1xyXG5cdFx0XHRcdFx0XHRcdF90aGlzLmNsYXNzTGlzdC5hZGQoXCJwcmV0dHlwcmludFJlcGxpY2FcIik7XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LnJlbW92ZShcInByZXR0eXByaW50XCIpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLmxpbmVudW1zXCIpLmZvckVhY2goKF90aGlzKT0+IHtcclxuXHRcdFx0XHRcdFx0XHRfdGhpcy5jbGFzc0xpc3QuYWRkKFwibGluZW51bXNSZXBsaWNhXCIpO1xyXG5cdFx0XHRcdFx0XHRcdF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJsaW5lbnVtc1wiKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdEFILmZpbmQoYWpheF9lSWQsIFwiLnByZXR0eXByaW50UmVwbGljYVwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LmFkZChcInByZXR0eXByaW50XCIpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0QUguZmluZChhamF4X2VJZCwgXCIubGluZW51bXNSZXBsaWNhXCIpLmZvckVhY2goKF90aGlzKT0+IHtcclxuXHRcdFx0XHRcdFx0XHRfdGhpcy5jbGFzc0xpc3QuYWRkKFwibGluZW51bXNcIik7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHQvKioqKioqKiovXHJcblx0XHRcdFx0XHRcdHByZXR0eVByaW50KCk7XHJcblx0XHRcdFx0XHRcdC8qY29kZSB0byBwcmV2ZW50IHByZXR0eSBwcmludCBleGlzdGluZyBwcmV0aWZpZWQgY29kZSAwNC8wMi8yMDE4Ki9cclxuXHRcdFx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLnByZXR0eXByaW50UmVwbGljYVwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LmFkZChcInByZXR0eXByaW50XCIpO1xyXG5cdFx0XHRcdFx0XHRcdF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJwcmV0dHlwcmludFJlcGxpY2FcIik7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRBSC5zZWxlY3RBbGwoXCIubGluZW51bXNSZXBsaWNhXCIpLmZvckVhY2goKF90aGlzKT0+IHtcclxuXHRcdFx0XHRcdFx0XHRfdGhpcy5jbGFzc0xpc3QuYWRkKFwibGluZW51bXNcIik7XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMuY2xhc3NMaXN0LnJlbW92ZShcImxpbmVudW1zUmVwbGljYVwiKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdC8qKioqKioqL1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cdFx0fSwyMDAwKTtcclxuXHJcblx0XHRpZiAoQUguZmluZChhamF4X2VJZCwgXCJ0YWJsZS51Yy10YWJsZVwiLCAnYWxsJykubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRBSC5maW5kKGFqYXhfZUlkLCBcInRhYmxlLnVjLXRhYmxlXCIsIHthY3Rpb246J2FkZENsYXNzJywgYWN0aW9uRGF0YTogJ2ZvbnQxNCd9KTtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyBmb3IgcmVtb3ZpbmcgYnJcclxuXHRcdFx0XHRpZiAoQUguZmluZChhamF4X2VJZCwgXCJ0YWJsZS51Yy10YWJsZVwiKS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nPy5ub2RlTmFtZSA9PSBcIkJSXCIpIHtcclxuXHRcdFx0XHRcdEFILmZpbmQoYWpheF9lSWQsIFwidGFibGUudWMtdGFibGVcIikucHJldmlvdXNFbGVtZW50U2libGluZy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybihlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdC8vIGZ1bmN0aW9uIGNhbGxzIHdoZW4gcmVtZWRpYXRpb24gbW9kZSBpcyBvblxyXG5cdGZ1bmN0aW9uIHNldFJldmlldygpIHtcclxuXHRcdGlzUmV2aWV3ID0gdHJ1ZTtcclxuXHRcdC8vIEZvciBtYXRocXVsIGJhc2VkIFxyXG5cdFx0aWYgKHhtbC5pbmNsdWRlcyhcInVzZXIgUmVzcG9uc2V7XCIpICkgd2luZG93LmlzUmVzZXRNYXRoID0gdHJ1ZTtcclxuXHRcdHN0YXRlLnNob3dUb29sYmFyID0gZmFsc2U7XHJcblx0XHQvLyBzaG93IHRoZSBhbnN3ZXIgYW5kIGFsc28gYmluZCB0aGUga2V5cyBldmVudCBmb3IgYWRhXHJcblx0XHR1Y0ZpbGwubW9kZU9uKFwib25cIik7XHJcblx0XHR1Y0ZpbGwuc2hvd2RyYWdhbnMoYWpheF9lSWQsICd1JywgMSk7XHJcblx0XHRBSC5zZWxlY3RBbGwoJy5yZW1lZF9kaXNhYmxlJywgJ3Nob3cnKTtcclxuXHRcdGF1dG9yZXNpemUoMSk7XHJcblx0XHRsZXQgbWF0aEl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJRCk7XHJcblx0XHRtYXRoSXRlbSA9IG1hdGhJdGVtID8gbWF0aEl0ZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWF0aHF1aWxsJykgOiBtYXRoSXRlbTtcclxuXHRcdGlmIChtYXRoSXRlbSkge1xyXG5cdFx0XHRBSC5zZXRDc3MoYWpheF9lSWQsIHtcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHRBSC5pbnNlcnQoYWpheF9lSWQsIFwiPGRpdiBjbGFzcz0nc3Bpbm5lci13cmFwcGVyJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGUhaW1wb3J0YW50O29wYWNpdHk6MCFpbXBvcnRhbnQ7Jz48L2Rpdj5cIiwgJ2FmdGVyYmVnaW4nKTtcclxuXHRcdH1cclxuXHRcdGRpc3BsYXlBbnMoKTtcclxuXHRcdC8vIGZvciBlZGl0b3JcclxuXHRcdC8vIHVjRmlsbC5tb2RlT24oXCJvblwiKTtcclxuXHRcdC8vIHN0YXRlLnNob3dUb29sYmFyID0gZmFsc2U7XHJcblx0XHQvLyB1Y0ZpbGwuc2hvd2RyYWdhbnMoYWpheF9lSWQsICd1JywgMSk7XHJcblx0XHQvLyBzbUNvbnRyb2xsZXJDYWxsYmFjay5hY3RpdmVZb3VyQW5zd2VyKCk7XHJcblx0XHQvLyBBSC5zZWxlY3RBbGwoJy5jb3JyX2RpdicsICdoaWRlJyk7XHJcblx0XHQvLyBBSC5zZWxlY3RBbGwoJy5yZW1lZF9kaXNhYmxlJywnc2hvdycpO1xyXG5cdH1cclxuXHJcblx0Ly8gZnVuY3Rpb24gY2FsbHMgd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9mZlxyXG5cdGZ1bmN0aW9uIHVuc2V0UmV2aWV3KCkge1xyXG5cdFx0aXNSZXZpZXcgPSBmYWxzZTtcclxuXHRcdEFILnNlbGVjdEFsbCgnLm1hdGhxdWlsbCcsICdjc3MnLCB7J2JvcmRlcic6ICdub25lJ30pO1xyXG5cdFx0dWNGaWxsLm1vZGVPbigpO1xyXG5cdFx0QUguc2VsZWN0QWxsKCcucmVtZWRfZGlzYWJsZSwgLmNvcnJfZGl2JywgJ2hpZGUnKTtcclxuXHRcdHVjRmlsbC5zaG93ZHJhZ2FucyhhamF4X2VJZCwgJ3UnLCAwKTtcclxuXHRcdGxldCBtYXRoSXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklEKTtcclxuXHRcdG1hdGhJdGVtID0gbWF0aEl0ZW0gPyBtYXRoSXRlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtYXRocXVpbGwnKSA6IG1hdGhJdGVtO1xyXG5cdFx0YXV0b3Jlc2l6ZSgpO1xyXG5cdFx0aWYgKG1hdGhJdGVtKSB7XHJcblx0XHRcdEFILnNlbGVjdEFsbChhamF4X2VJZCwgJ2NzcycsIHtcInBvc2l0aW9uXCI6IFwidW5zZXRcIn0pO1xyXG5cdFx0XHRBSC5zZWxlY3RBbGwoXCIuc3Bpbm5lci13cmFwcGVyXCIsICdyZW1vdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBpZiB0aGUgcmVtZWRpYXRpb24gbW9kZSBpZiBvZmYgaW4gZWRpdG9yXHJcblx0XHQvLyB1Y0ZpbGwubW9kZU9uKCk7XHJcblx0XHQvLyB1Y0ZpbGwuc2hvd2RyYWdhbnMoYWpheF9lSWQsICd1JywgMCk7XHJcblx0XHQvLyBBSC5zZXRDc3MoJy5lZGl0X3N0ZXAnLCB7J2JvcmRlcic6J25vbmUnfSk7XHJcblx0XHQvLyBBSC5zZWxlY3RBbGwoJy5jb3JyX2RpdicsJ2hpZGUnKTtcclxuXHR9XHJcblxyXG5cdC8vIGZvciByZXNpemluZyB0aGUgdGV4dGFyZWFcclxuXHRmdW5jdGlvbiBhdXRvcmVzaXplKGZsYWcpIHtcclxuXHRcdGxldCBmdGJfdGV4dGFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHRhcmVhLmtzXCIpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBmdGJfdGV4dGFyZWEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IGUgPSBmdGJfdGV4dGFyZWFbaV07XHJcblx0XHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgIGUuc3R5bGUuY3NzVGV4dCA9ICdoZWlnaHQ6YXV0bztvdmVyZmxvdzogYXV0bzsnO1xyXG5cdFx0XHQgICAgaWYoZmxhZylcclxuXHRcdFx0ICAgIFx0aWYod2luZG93LmlzSUUpXHJcblx0XHRcdCAgICBcdFx0ZS5zdHlsZS5jc3NUZXh0ID0gJ2hlaWdodDonICsgKGUuc2Nyb2xsSGVpZ2h0KzEwKSArICdweDtvdmVyZmxvdzogaGlkZGVuJztcclxuXHRcdFx0ICAgIFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRlLnN0eWxlLmNzc1RleHQgPSAnaGVpZ2h0OicgKyAoZS5zY3JvbGxIZWlnaHQpICsgJ3B4O292ZXJmbG93OiBoaWRkZW4nO1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XHJcblx0XHRcdH0sMTAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGZvciBkaXNwbGF5aW5nIHRoZSBhbnN3ZXJcclxuXHRmdW5jdGlvbiBkaXNwbGF5QW5zKCkge1xyXG5cdFx0Ly8gY2hlY2sgdGhlIGFucyBhbmQgY3JlYXRlIHVzZXIgYW5zXHJcblx0XHRsZXQgYW5zID0gdWNGaWxsLmNoZWNrQW5zKGFqYXhfZUlkKTtcclxuXHRcdC8vIFRvIHNhdmUgdGhlIHVzZXIgYW5zd2VyXHJcblx0XHRsZXQgYW5zd2VyID0geyBhbnM6IHVjRmlsbC5yZXN1bHQsIHVYbWw6IHVjRmlsbC51c2VyQW5zWE1MfTtcclxuXHRcdG9uVXNlckFuc0NoYW5nZShhbnN3ZXIpO1xyXG5cdFx0aWYoZWRpdG9yU3RhdGUpIHsgc2hvd0FucyhhbnMpOyB9XHJcblx0fVxyXG5cclxuXHQvLyBmb3IgdG9nZ2xpbmcgdGhlIHRvb2xiYXIgaW4gY2FzZSBvZiBtYXRoIG1vZHVsZVxyXG5cdGZ1bmN0aW9uIHRvZ2dsZVRvb2xiYXIodmFsdWUpIHtcclxuXHRcdHN0YXRlLnNob3dUb29sYmFyID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBvbmVkaXRvRm9jdXNlZCh4LCBldmVudCkge1xyXG5cdFx0bGV0IGlzRmlsbElkID0gdHJ1ZTtcclxuXHRcdGxldCBmaWxsSWQ7XHJcblx0XHR3aGlsZSAoaXNGaWxsSWQpIHtcclxuXHRcdFx0eCA9IHgucGFyZW50RWxlbWVudDtcclxuXHRcdFx0aWYoeC5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcclxuXHRcdFx0XHRpc0ZpbGxJZCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZpbGxJZCA9IHguZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcdFxyXG5cdFx0bGV0IGxhdGV4QXJyYXkgPSBbXTtcclxuXHRcdFx0XHJcblx0XHRBSC5zZWxlY3RBbGwoXCIjXCIgKyBmaWxsSWQgKyBcIiBzcGFuLm1xLWVkaXRhYmxlLWZpZWxkXCIpLmZvckVhY2goKGVsZW1lbnQpPT4ge1x0XHJcblx0XHRcdGxldCBjb21tYW5kSWQgPSB4LmdldEF0dHJpYnV0ZSgnbWF0aHF1aWxsLWNvbW1hbmQtaWQnKTtcclxuXHRcdFx0bGF0ZXhBcnJheS5wdXNoKGNvbW1hbmRJZCk7XHJcblx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRsZXQgbWF0aElkID0geC5nZXRBdHRyaWJ1dGUoJ21hdGhxdWlsbC1jb21tYW5kLWlkJyk7XHJcblx0XHRsZXQgaW5kZXhJZCA9IGxhdGV4QXJyYXkuaW5kZXhPZihtYXRoSWQpO1xyXG5cdFx0c3RhdGUuc3BhbklkID0gaW5kZXhJZDtcclxuXHRcdHN0YXRlLmRpdklkID0gIGZpbGxJZDtcclxuXHRcdHN0YXRlLnNob3dUb29sYmFyID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdXBkYXRlTW9kdWxlKGtleSwgdmFsdWUpIHtcclxuXHRcdHN0YXRlW2tleV0gPSB2YWx1ZTtcclxuXHRcdGlmIChrZXkgPT0gJ3V4bWwnKSB7XHJcblx0XHRcdHBhcnNlZFV4bWwgPSBYTUxUb0pTT04oc3RhdGUudXhtbCk7XHJcblx0XHRcdC8vIHBhcnNpbmcgdGhlIGF1dGhvcmluZyB4bWxcclxuXHRcdFx0dXBkYXRlVXNlckFucyhwYXJzZWRVeG1sKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGZvciBnaXZpbmcgdGhlIHVjLXRhYmxlIHN0eWxlXHJcblx0ZnVuY3Rpb24gc2V0U01Ob3Rlcygpe1xyXG5cdFx0aWYoQUguZmluZChhamF4X2VJZCwgXCJ0YWJsZS51Yy10YWJsZVwiLCAnYWxsJykubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRsZXQgdGFibGVXaWR0aCA9IChBSC5maW5kKGFqYXhfZUlkLCBcInRhYmxlLnVjLXRhYmxlXCIpLmNsaWVudFdpZHRoKSArIDk7XHJcblx0XHRcdEFILnNldENzcyhBSC5maW5kKGFqYXhfZUlkLCBcIi5zbW5vdGVzXCIpLCB7XHJcblx0XHRcdFx0J3dpZHRoJzogdGFibGVXaWR0aCArIFwicHhcIixcclxuXHRcdFx0XHQnbWFyZ2luJzogXCJhdXRvXCIsXHJcblx0XHRcdFx0J3BhZGRpbmctdG9wJzogXCI1cHhcIlxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGZvciBhZGRpbmcgdGhlIGV2ZW50IHRvIHNlbGVjdCBhbmQgYWRkIGRyYWcgYW5kIGRyb3AgZnVuY3Rpb25hbGl0eSB0byBlbGVtZW50XHJcblx0ZnVuY3Rpb24gcnVuTW9kdWxlKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJydW5tb2R1bGVcIik7XHJcblx0XHRcdC8vIGZvciBhZGRpbmcgdGhlIGV2ZW50IHRvIHNlbGVjdCBhbmQgYWRkIGRyYWcgYW5kIGRyb3AgZnVuY3Rpb25hbGl0eSB0byBlbGVtZW50XHJcblx0XHRcdHVjRmlsbC5yZWFkeUZpbGwoYWpheF9lSWQpO1xyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdGlmIChlcnJvckNhdGNoRmxhZyA8PSAxMDApIHtcclxuXHRcdFx0XHR2YXIgdGltZXIgPSBzZXRUaW1lb3V0KCgpPT4ge1xyXG5cdFx0XHRcdFx0cnVuTW9kdWxlKCk7XHJcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cdFx0XHRcdH0sIDUwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJFcnJvciBhdCBydW5Nb2R1bGUgZnVuY3Rpb25cIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZXJyb3JDYXRjaEZsYWcrKztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGZvciBzZXR0aW5nIG1heGltdW0gd2lkdGggb2YgdGhlIGRyYWcgYXJlYVxyXG5cdGZ1bmN0aW9uIHNldE1heFdpZHRoKCkge1xyXG5cdFx0bGV0IG1heERyYWdEcm9wV2lkdGggPSBbXTtcclxuXHRcdEFILnNlbGVjdEFsbChcIi5kcmFnQXJlYSBkaXZcIikuZm9yRWFjaCgoX3RoaXMsIGkpPT4ge1xyXG5cdCAgICBcdG1heERyYWdEcm9wV2lkdGgucHVzaChfdGhpcy5pbm5lckhUTUwubGVuZ3RoICogMTAgKyAzMCk7IFxyXG5cdCAgICB9KTtcclxuXHJcblx0ICAgIEFILnNlbGVjdEFsbChcIiNwcmV2aWV3QXJlYSBbaWRePWVsZW1dXCIpLmZvckVhY2goKF90aGlzKT0+IHtcclxuXHQgICAgXHRpZiAoX3RoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcmFnLXJlc2l6ZScpKSB7XHJcblx0ICAgIFx0XHRBSC5zZXRDc3MoX3RoaXMsIHtcIm1heC13aWR0aFwiOiBNYXRoLm1heCguLi5tYXhEcmFnRHJvcFdpZHRoKX0pO1xyXG5cdCAgICBcdH1cclxuXHQgICAgfSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGlzIHNpeCBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGlucHV0IGFyZWEgaW4gdGhlXHJcblx0ICogUHJldmlldyBzZWN0aW9uIG9uIHRoZSBiYXNpcyBvZiB0aGUgYXV0aG9yaW5nIHhtbFxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIGNyZWF0ZU1hdGhEaXYoZGF0YSwgaSwgdWFYTUwgPSBmYWxzZSkge1xyXG5cdFx0bGV0IG9yaWdpbmFsRGF0YSA9IGRhdGE7XHJcblx0XHQvLyByZW1vdmluZyB0aGUgJXsgLCB9JSBzeW1ib2wgZnJvbSB0aGUgZGF0YSAgXHJcblx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKC8le3x9JS9nLCBcIlwiKTtcclxuXHRcdC8vIHNwbGl0dGluZyBpdCB3aXRoIHxcclxuXHRcdGRhdGEgPSBkYXRhLnNwbGl0KFwifFwiKTtcclxuXHRcdC8vIHJlcGxhY2luZyB0aGUgdXNlciBSZXNwb25zZSBpbiBNYXRoUXVpbGxNYXRoRmllbGRcclxuXHRcdGxldCBhZGRNYXRocXVpbGwgPSBkYXRhWzBdLnJlcGxhY2UoL3VzZXIgUmVzcG9uc2UvZywgJ1xcXFxNYXRoUXVpbGxNYXRoRmllbGQnKTtcclxuXHRcdC8vIHRoZW4gc3BsaXRpbmcgd2l0aCAjI1xyXG5cdFx0bGV0IHNwbGl0RGF0YSA9ICBhZGRNYXRocXVpbGwuc3BsaXQoXCIjI1wiKTtcclxuXHRcdGxldCByYW5kb21LZXkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzcGxpdERhdGEubGVuZ3RoKVxyXG5cdFx0Ly8gdGFraW5nIHJhbmRvbSBvcHRpb25cclxuXHRcdGxldCByYW5kb21PcHRpb24gPSBzcGxpdERhdGFbcmFuZG9tS2V5XTtcclxuXHRcdC8vIHN0b3JpbmcgdGhlIHJhbmRvbU9wdGlvbiBpbiB1c2VyYXNuIGJ5IHJlcGxhY2luZyB0aGUgTWF0aFF1aWxsTWF0aEZpZWxkeyhhbnkgdmFsdWUpfSB0byBNYXRoUXVpbGxNYXRoRmllbGR7fVxyXG5cdFx0bGV0IHVzZXJhbnMgPSByYW5kb21PcHRpb24ucmVwbGFjZSgvTWF0aFF1aWxsTWF0aEZpZWxkeyguKj8pfS9nLCAnTWF0aFF1aWxsTWF0aEZpZWxke30nKTtcclxuXHRcdGxldCBkZWZhdWx0YW5zID0gMDtcclxuXHRcdGxldCBhbnNrZXkgPSByYW5kb21PcHRpb247XHJcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXHJcblx0XHRpZih1YVhNTCkge1xyXG5cdFx0XHRpZih1YVhNTC5fdXNlckFucykge1xyXG5cdFx0XHRcdC8vIHN0b3JpbmcgdGhlIHVzZXJhbnMgYXR0cmlidXRlIHZhbHVlIGluIHVzZXJhbnN3ZXJcclxuXHRcdFx0XHR1c2VyYW5zID0gdWFYTUwuX3VzZXJBbnM7XHJcblx0XHRcdFx0Ly8gY2hlY2sgZm9yIHRoZSBfdXNlckFuc1NlcVxyXG5cdFx0XHRcdGlmKHVhWE1MLl91c2VyQW5zU2VxKSB7XHJcblx0XHRcdFx0XHQvLyBzdG9yaW5nIHRoZSBhbnNrZXkgYW5kIHVzZXJBbnNTZXFcclxuXHRcdFx0XHRcdGFuc2tleSA9IHVhWE1MLl9hbnNrZXk7XHJcblx0XHRcdFx0XHRyYW5kb21LZXkgPSB1YVhNTC5fdXNlckFuc1NlcTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAocmFuZG9tT3B0aW9uLmluZGV4T2YoXCJcXE1hdGhRdWlsbE1hdGhGaWVsZFwiKSA+IC0xKSB7XHJcblx0XHRcdGFuc2tleSA9IHJhbmRvbU9wdGlvbjtcclxuXHRcdFx0ZGVmYXVsdGFucyA9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0QUguc2VsZWN0QWxsKCcjZWxlbScraSwgJ2hpZGUnKTtcclxuXHJcblx0XHRsZXQgbWF0aGVxID0gYDxzcGFuIGlkPVwiZWxlbSR7aX1cIiBjbGFzcz1cImF1dG9faGVpZ2h0IGVkaXRfc3RlcCBmaWxsbWF0aGVsZW1lbnQgbWF0aHF1aWxsXCIgdXNlckFuc1NlcT1cIiR7cmFuZG9tS2V5fVwiIHVzZXJhbnM9XCIke3VzZXJhbnN9XCIgYW5za2V5PVwiJHthbnNrZXl9XCIgZGVmYXVsdGFucz1cIiR7ZGVmYXVsdGFuc31cIiBtYXRodHlwZT1cIjFcIj48L3NwYW4+YDtcclxuXHRcdGxldCB0YWcgPSBgPGRpdiBpZD1cIm1haW5fZGl2XCIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBmaWx0ZXIgYXV0b19oZWlnaHQgZmlsbGVsZW1lbnQgbWF0aGl0ZW0gaW5saW5lLWJsb2NrXCI+PGRpdiBjbGFzcz1cImRpc2FibGVfZGl2IGZoIGZ3aWR0aCBhYnNvbHV0ZSBoXCI+PC9kaXY+PGRpdiBjbGFzcz1cInJlbWVkX2Rpc2FibGUgZmggZndpZHRoIGFic29sdXRlIGhcIj48L2Rpdj48c3BhbiAgaWQ9XCJtJHtpfVwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiIGNsYXNzPVwiYXV0b19oZWlnaHQgaCBjb3JyX2RpdiBmaWxsbWF0aGVsZW1lbnQgbWF0aHF1aWxsXCIgdXNlckFuc1NlcT1cIiR7cmFuZG9tS2V5fVwiIGFuc2tleT1cIiR7YW5za2V5fVwiIGRlZmF1bHRhbnM9XCIke2RlZmF1bHRhbnN9XCIgbWF0aHR5cGU9XCIxXCI+JHthbnNrZXl9PC9zcGFuPiR7bWF0aGVxfTwvZGl2PmA7XHJcblxyXG5cdFx0Ly8gcnBsYWNpbmcgdGhlIGNkYXRhXHJcblx0XHRjZGF0YSA9IGNkYXRhLnJlcGxhY2Uob3JpZ2luYWxEYXRhLCB0YWcpO1xyXG5cclxuXHRcdGxldCBtcUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCk9PiB7IFxyXG5cdFx0XHQvLyBjaGVja2luZyB0aGUgTWF0aFF1aWxsIGZ1bmN0aW9uIGlzIGRlZmluZWQgb3Igbm90XHJcblx0XHRcdGlmICh0eXBlb2YgTWF0aFF1aWxsID09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHRcdC8vIGlmIGZvdW5kIGNsZWFyIHRoZSBpbnRlcnZhbFxyXG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwobXFJbnRlcnZhbCk7XHJcblx0XHRcdFx0QUguc2VsZWN0QWxsKCcjZWxlbScraSwgJ3Nob3cnKTtcclxuXHRcdFx0XHQvLyBBY2NvcmRpbmcgdG8gQVBJIERPQzogQnkgZGVmYXVsdCwgTWF0aFF1aWxsIG92ZXJ3cml0ZXMgdGhlIGdsb2JhbCBNYXRoUXVpbGwgdmFyaWFibGUgd2hlbiBsb2FkZWQuIElmIHlvdSBkbyBub3Qgd2FudCB0aGlzIGJlaGF2aW9yLCB5b3UgY2FuIHVzZSB0aGlzIFxyXG5cdFx0XHRcdGxldCBNUSA9IE1hdGhRdWlsbC5nZXRJbnRlcmZhY2UoMik7XHJcblx0XHRcdFx0QUguc2VsZWN0QWxsKFwiLm1hdGhxdWlsbFwiKS5mb3JFYWNoKChfdGhpcyk9PiB7XHJcblx0XHRcdFx0XHRsZXQgbWF0aEl0ZW1JZCAgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0XHRcdFx0XHRsZXQgZGVmYXVsdGFucyA9IF90aGlzLmdldEF0dHJpYnV0ZSgnZGVmYXVsdGFucycpO1xyXG5cdFx0XHRcdFx0Ly8gYWRkaW5nIHRoZSB1c2VyYW5zIGluIHRoZSBtYXRoSXRlbWlkXHJcblx0XHRcdFx0XHRpZihkZWZhdWx0YW5zID09IDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGxhdGV4ID0gX3RoaXMuZ2V0QXR0cmlidXRlKCd1c2VyYW5zJyk7XHJcblx0XHRcdFx0XHRcdEFILnNlbGVjdEFsbCgnIycrbWF0aEl0ZW1JZCwgJ3RleHQnLCBsYXRleCk7IFxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0QUguc2VsZWN0QWxsKCcjJyttYXRoSXRlbUlkLCAndGV4dCcsIF90aGlzLmdldEF0dHJpYnV0ZSgndXNlcmFucycpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8qKlxyXG5cdFx0XHRcdFx0ICogQWNjb3JkaW5nIHRvIEFwaSBkb2NcclxuXHRcdFx0XHRcdCAqIE1RLlN0YXRpY01hdGgoaHRtbF9lbGVtZW50KSBDcmVhdGVzIGEgbm9uLWVkaXRhYmxlIE1hdGhRdWlsbCBpbml0aWFsaXplZCB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgSFRNTCBlbGVtZW50IGFuZCByZXR1cm5zIGEgU3RhdGljTWF0aCBvYmplY3QuXHJcblx0XHRcdFx0XHQgKiBJZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbHJlYWR5IGEgc3RhdGljIG1hdGggaW5zdGFuY2UsXHJcbiBcdFx0XHRcdFx0ICogdGhpcyB3aWxsIHJldHVybiBhIG5ldyBTdGF0aWNNYXRoIG9iamVjdCB3aXRoIHRoZSBzYW1lIC5pZC4gSWYgdGhlIGVsZW1lbnQgaXMgYSBkaWZmZXJlbnQgdHlwZSBvZiBNYXRoUXVpbGwsIHRoaXMgd2lsbCByZXR1cm4gbnVsbC5cclxuXHRcdFx0XHRcdCoqL1xyXG5cdFx0XHRcdFx0ZmlsbE1hdGhbbWF0aEl0ZW1JZF0gPSBNUS5TdGF0aWNNYXRoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1hdGhJdGVtSWQpKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dWNGaWxsLmZpbGxNYXRoID0gZmlsbE1hdGg7XHJcblx0XHRcdH1cclxuXHRcdH0sIDEwMClcdFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlVGV4dGJveChkYXRhLGksdWFYTUw9ZmFsc2UpIHtcclxuXHRcdHZhciB1c2VyQW5zd2VyICA9IFwiXCI7XHJcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXHJcblx0XHRpZih1YVhNTCkge1xyXG5cdFx0XHRpZih1YVhNTC5fdXNlckFucykge1xyXG5cdFx0XHRcdC8vIHN0b3JpbmcgdGhlIHVzZXJhbnMgYXR0cmlidXRlIHZhbHVlIGluIHVzZXJhbnN3ZXJcclxuXHRcdFx0XHR1c2VyQW5zd2VyID0gdWFYTUwuX3VzZXJBbnM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xyXG5cdFx0bGV0IGNzU3R5bGUgPSBcIlwiO1xyXG5cdFx0Ly8gcmVtb3ZpbmcgdGhlICV7ICwgfSUgc3ltYm9sIGZyb20gdGhlIGRhdGEgIFxyXG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSgvJXt8fSUvZyxcIlwiKTtcclxuXHRcdC8vIHNwbGl0dGluZyBpdCB3aXRoIHxcclxuXHRcdGRhdGEgPSBkYXRhLnNwbGl0KFwifFwiKTtcclxuXHRcdC8vIGlmIHRoZSB0eXBlIGlzIGNvZGV0eXBlIHRoZW4gbWFrZSBpdHMgdmFsdWUgMSBlbHNlIGJsYW5rXHJcblx0XHRsZXQgY29kZXR5cGUgPSAoZGF0YVsxXSAmJiBkYXRhWzFdLnRyaW0oKSA9PSBcImNcIikgPyBcIjFcIiA6IFwiXCI7XHJcblx0XHRsZXQgYW5za2V5ID0gZGF0YVswXS50cmltKCk7XHJcblxyXG5cdFx0Ly8gY2hlY2sgZm9yIGlmIGFueSBzdHlsaW5nIGlzIGdpdmVuIG9yIG5vdFxyXG5cdFx0aWYoYW5za2V5LmluZGV4T2YoXCIjc3R5bGUjXCIpICE9IC0xKSB7XHJcblx0XHRcdGxldCBjdXN0b21TdHlsZSAgPSBhbnNrZXkuc3BsaXQoXCIjc3R5bGUjXCIpO1xyXG5cdFx0XHQvLyBzdG9yZSB0aGUgY29ycmVjdCBhbnNcclxuXHRcdFx0YW5za2V5ID0gY3VzdG9tU3R5bGVbMF07XHJcblx0XHRcdC8vIHN0b3JlIHRoZSBjdXN0b20gc3R5bGVcclxuXHRcdFx0Y3NTdHlsZSA9IGN1c3RvbVN0eWxlWzFdO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHR4dFdpZHRoICA9IFtdO1xyXG5cdFx0Ly8gc3BsaXQgdGhlIGFuc2tleSB3aXRoICxcclxuXHRcdGxldCBhbnNsZW4gPSBhbnNrZXkuc3BsaXQoXCIsXCIpO1xyXG5cdFx0Ly8gZmluZGlpbmcgd2lkdGggb2YgdGhlIHRleHRib3hcclxuXHRcdEFILnNlbGVjdEFsbChhbnNsZW4pLmZvckVhY2goKHZhbCwgaik9PiB7XHJcblx0XHRcdHR4dFdpZHRoW2pdID0gKChhbnNsZW5bal0ubGVuZ3RoKSoxMCszMCk7XHJcblx0XHR9KTtcclxuXHRcdC8vIGFkZGluZyBpbmZvcm1hdGlvbiBvZiB0aGUgdGFnIGFuZCB0ZXh0Ym94XHJcblx0XHRsZXQgdGV4dGJveCA9IGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZpbGxpbnRoZWJsYW5rIGtzXCIgYW5za2V5PVwiJHthbnNrZXkudHJpbSgpfVwiIHZhbHVlPVwiJHt1c2VyQW5zd2VyfVwiIHVzZXJhbnM9XCIke3VzZXJBbnN3ZXJ9XCIgZGVmYXVsdGFucz1cIlwiIGhhc2tleXdvcmRzPVwiXCIgY29kZXR5cGU9XCIke2NvZGV0eXBlfVwiIGhhc25vdGtleXdvcmRzPVwiXCIga2V5d29yZHR5cGU9XCJcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBkYXRhLXJvbGU9XCJub25lXCIgc3R5bGU9XCJ3aWR0aDoke01hdGgubWF4KC4uLnR4dFdpZHRoKX1weDske2NzU3R5bGV9XCIgLz5gXHJcblx0XHRsZXQgdGFnID0gYDxkaXYgaWQ9XCJlbGVtJHtpfVwiIGNsYXNzPVwiZmlsbGVsZW1lbnRcIj4ke3RleHRib3h9PC9kaXY+YDtcclxuXHRcdC8vIHJlcGxhY2UgdGhlIGNkYXRhXHJcblx0XHRjZGF0YSA9IGNkYXRhLnJlcGxhY2Uob3JpZ2luYWxEYXRhLHRhZyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjcmVhdGVOdW1lcmljYm94KGRhdGEsaSx1YVhNTD1mYWxzZSkge1xyXG5cdFx0dmFyIHVzZXJBbnN3ZXIgID0gXCJcIjtcclxuXHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcclxuXHRcdGlmICh1YVhNTCkge1xyXG5cdFx0XHRpZiAodWFYTUwuX3VzZXJBbnMpIHtcclxuXHRcdFx0XHQvLyBzdG9yaW5nIHRoZSB1c2VyYW5zIGF0dHJpYnV0ZSB2YWx1ZSBpbiB1c2VyYW5zd2VyXHJcblx0XHRcdFx0dXNlckFuc3dlciA9IHVhWE1MLl91c2VyQW5zO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgb3JpZ2luYWxEYXRhID0gZGF0YTtcclxuXHRcdGxldCBjc1N0eWxlID0gXCJcIjtcclxuXHRcdC8vIHJlbW92aW5nIHRoZSAleyAsIH0lIHN5bWJvbCBmcm9tIHRoZSBkYXRhICBcclxuXHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoLyV7fH0lL2csXCJcIik7XHJcblx0XHQvLyBzcGxpdHRpbmcgaXQgd2l0aCB8XHJcblx0XHRkYXRhID0gZGF0YS5zcGxpdChcInxcIik7XHJcblx0XHQvLyBpZiB0aGUgdHlwZSBpcyBjb2RldHlwZSB0aGVuIG1ha2UgaXRzIHZhbHVlIDEgZWxzZSBibGFua1xyXG5cdFx0bGV0IGNvZGV0eXBlID0gKGRhdGFbMV0gJiYgZGF0YVsxXS50cmltKCkgPT0gXCJjXCIpID8gXCIxXCIgOiBcIlwiO1xyXG5cdFx0bGV0IGFuc2tleSA9IGRhdGFbMF0udHJpbSgpO1xyXG5cdFx0Ly8gY2hlY2sgZm9yIGlmIGFueSBzdHlsaW5nIGlzIGdpdmVuIG9yIG5vdFxyXG5cdFx0aWYgKGFuc2tleS5pbmRleE9mKFwiI3N0eWxlI1wiKSAhPSAtMSkge1xyXG5cdFx0XHRsZXQgY3VzdG9tU3R5bGUgID0gYW5za2V5LnNwbGl0KFwiI3N0eWxlI1wiKTtcclxuXHRcdFx0Ly8gc3RvcmUgdGhlIGNvcnJlY3QgYW5zXHJcblx0XHRcdGFuc2tleSA9IGN1c3RvbVN0eWxlWzBdO1xyXG5cdFx0XHQvLyBzdG9yZSB0aGUgY3VzdG9tIHN0eWxlXHJcblx0XHRcdGNzU3R5bGUgPSBjdXN0b21TdHlsZVsxXTtcclxuXHRcdH1cclxuXHRcdGxldCB0eHRXaWR0aCAgPSBbXTtcclxuXHRcdC8vIHNwbGl0IHRoZSBhbnNrZXkgd2l0aCAsXHJcblx0XHRsZXQgYW5zbGVuID0gYW5za2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdC8vIGZpbmRpaW5nIHdpZHRoIG9mIHRoZSB0ZXh0Ym94XHJcblx0XHRBSC5zZWxlY3RBbGwoYW5zbGVuKS5mb3JFYWNoKChlbG0sIGopPT4ge1xyXG5cdFx0XHR0eHRXaWR0aFtqXSA9ICgoYW5zbGVuW2pdLmxlbmd0aCkqMTArMzApO1xyXG5cdFx0fSk7XHJcblx0XHQvLyBhZGRpbmcgaW5mb3JtYXRpb24gb2YgdGhlIHRhZyBhbmQgdGV4dGJveFxyXG5cdFx0bGV0IHRleHRib3ggPSBgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBvbktleURvd249XCJpZihpc05hTihldmVudC5rZXkpKXt2YXIga2V5X2FyciA9IFsxMywgMzcsIDM4LCAzOSwgNDAsIDgsIDY5LCAxMDEsIDQ2LCAxNiwgOV07aWYoIWtleV9hcnIuaW5jbHVkZXMoZXZlbnQua2V5Q29kZSkpIGV2ZW50LnByZXZlbnREZWZhdWx0KCl9IFwiY2xhc3M9XCJmaWxsaW50aGVibGFuayBrc1wiIGFuc2tleT1cIiR7YW5za2V5LnRyaW0oKX1cIiB2YWx1ZT1cIiR7dXNlckFuc3dlcn1cIiB1c2VyYW5zPVwiJHt1c2VyQW5zd2VyfVwiIGRlZmF1bHRhbnM9XCJcIiBoYXNrZXl3b3Jkcz1cIlwiIGNvZGV0eXBlPVwiJHtjb2RldHlwZX1cIiBoYXNub3RrZXl3b3Jkcz1cIlwiIGtleXdvcmR0eXBlPVwiXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgZGF0YS1yb2xlPVwibm9uZVwiIHN0eWxlPVwid2lkdGg6ICR7KE1hdGgubWF4KC4uLnR4dFdpZHRoKSsoMjApKX1weDske2NzU3R5bGV9XCIgLz5gO1xyXG5cdFx0bGV0IHRhZyA9IGA8ZGl2IGlkPVwiZWxlbSR7aX1cIiBjbGFzcz1cImZpbGxlbGVtZW50XCI+JHt0ZXh0Ym94fTwvZGl2PmA7XHJcblx0XHQvLyByZXBsYWNlIHRoZSBjZGF0YVxyXG5cdFx0Y2RhdGEgPSBjZGF0YS5yZXBsYWNlKG9yaWdpbmFsRGF0YSx0YWcpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlU2VsZWN0Qm94KGRhdGEsaSx1YVhNTD1mYWxzZSkge1xyXG5cdFx0bGV0IG9yaWdpbmFsRGF0YSA9IGRhdGE7XHJcblx0XHQvLyByZW1vdmluZyB0aGUgJXsgLCB9JSBzeW1ib2wgZnJvbSB0aGUgZGF0YSAgXHJcblx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKC8le3x9JS9nLFwiXCIpO1xyXG5cdFx0Ly8gc3BsaXR0aW5nIGl0IHdpdGggfFxyXG5cdFx0ZGF0YSA9IGRhdGEuc3BsaXQoXCJ8XCIpO1xyXG5cdFx0bGV0IG9wdGlvbnNWYWx1ZSA9IGRhdGFbMF0udHJpbSgpO1xyXG5cdFx0Ly8gc3BsaXR0aW5nIHdpdGggLCB0byBleHRyYWN0IGFsbCB0aGUgb3B0aW9uXHJcblx0XHRvcHRpb25zVmFsdWUgPSBvcHRpb25zVmFsdWUuc3BsaXQoXCIsXCIpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpKTtcclxuXHRcdGxldCBvcHRpb25zID0gJzxvcHRpb24gdmFsdWU9XCJcIj4mbmJzcDtQbGVhc2UgU2VsZWN0PC9vcHRpb24+JztcclxuXHJcblx0XHQvLyBpdGVyYXRpbmcgdGhyb3VnaCBlYWNoIG9wdGlvbnNcclxuXHRcdEFILnNlbGVjdEFsbChvcHRpb25zVmFsdWUpLmZvckVhY2goKF90aGlzLCBqKT0+IHtcclxuXHRcdFx0Ly8gY2hlY2tpbmcgY29ycmVjdFxyXG5cdFx0XHRsZXQgaXNDb3JyZWN0ID0gKChvcHRpb25zVmFsdWVbal0uaW5kZXhPZignKicpID09IDApPyBcIjFcIiA6IFwiMFwiKTtcclxuXHRcdFx0Ly8gY2hlY2tpbmcgZGVmYXVsdCBzZWxlY3RlZCB2YWx1ZVxyXG5cdFx0XHRsZXQgc2VsZWN0ZWQgPSAoKG9wdGlvbnNWYWx1ZVtqXS5pbmRleE9mKCcrJykgPT0gMCk/ICdzZWxlY3RlZD1cInNlbGVjdGVkXCInIDogXCJcIik7XHJcblx0XHRcdC8vIGV4dHJhY3RpbmcgdmFsdWUgb2YgdGhlIG9wdGlvblxyXG5cdFx0XHRsZXQgaW5uZXJWYWwgPSAoKG9wdGlvbnNWYWx1ZVtqXS5pbmRleE9mKCcqJykgPT0gMCB8fCBvcHRpb25zVmFsdWVbal0uaW5kZXhPZignKycpID09IDApPyBvcHRpb25zVmFsdWVbal0uc2xpY2UoMSkgOiBvcHRpb25zVmFsdWVbal0gKTtcclxuXHRcdFx0bGV0IHVzZXJBbnN3ZXIgPSBcIlwiO1xyXG5cdFx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYXNuXHJcblx0XHRcdGlmKHVhWE1MKSB7XHJcblx0XHRcdFx0aWYodWFYTUwuX3VzZXJBbnMpIHtcclxuXHRcdFx0XHRcdHNlbGVjdGVkID0gJyc7XHJcblx0XHRcdFx0XHQvLyBzcGxpaXRpbmcgd2l0aCAsIFxyXG5cdFx0XHRcdFx0bGV0IHNlbCA9IHVhWE1MLl91c2VyQW5zLnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0XHRcdC8vIGNoZWNraW1nIGZvciB0aGUgb3B0aW9uIHdoaWNoIGlzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyXHJcblx0XHRcdFx0XHRpZihqID09IHNlbFswXS50cmltKCktMSkge1xyXG5cdFx0XHRcdFx0XHRzZWxlY3RlZCA9ICdzZWxlY3RlZD1cInNlbGVjdGVkXCInO1xyXG5cdFx0XHRcdFx0XHR1c2VyQW5zd2VyID0gXCIxXCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gcmVwbGFjaW5nICNjbSB3aXRoICwgJiAjcGwgd2l0aCArIGluIG9wdGlvbiB0ZXh0XHJcblx0XHRcdGlubmVyVmFsID0gaW5uZXJWYWwucmVwbGFjZSgvXFwjY20vZ21pLFwiLFwiKS5yZXBsYWNlKC9cXCNwbC9nbWksXCIrXCIpO1xyXG5cdFx0XHQvLyBjcmVhdGluZyBvcHRpb25zXHJcblx0XHRcdG9wdGlvbnMgKz0gYDxvcHRpb24gdmFsdWU9XCIke2p9XCIgY29ycmVjdGFucz1cIiR7aXNDb3JyZWN0fVwiIHVzZXJhbnM9XCIke3VzZXJBbnN3ZXJ9XCIgJHtzZWxlY3RlZH0+Jm5ic3A7JHtpbm5lclZhbH08L29wdGlvbj5gO1xyXG5cdFx0fSlcclxuXHRcdC8vIGNyZWF0aW5nIHNlbGVjdGJveFxyXG5cdFx0bGV0IHNlbGVjdGJveCA9IGA8c2VsZWN0IGNsYXNzPVwiZmlsbGludGhlYmxhbmsga3NcIiBkYXRhLXJvbGU9XCJub25lXCI+JHtvcHRpb25zfTwvc2VsZWN0PmA7XHJcblx0XHRsZXQgdGFnID0gYDxkaXYgaWQ9XCJlbGVtJHtpfVwiIGNsYXNzPVwiZmlsbGVsZW1lbnRcIj4ke3NlbGVjdGJveH08L2Rpdj5gO1xyXG5cdFx0Ly8gcmVwbGFjZSB0aGUgY2RhdGFcclxuXHRcdGNkYXRhID0gY2RhdGEucmVwbGFjZShvcmlnaW5hbERhdGEsdGFnKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNyZWF0ZU11bHRpbGluZUJveChkYXRhLCBpLCB1YVhNTD1mYWxzZSkge1xyXG5cdFx0bGV0IHVzZXJBbnN3ZXJNICA9IFwiXCI7XHJcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHVzZXIgYW5zXHJcblx0XHRpZiAodWFYTUwpIHtcclxuXHRcdFx0aWYgKHVhWE1MLl91c2VyQW5zKSB7XHJcblx0XHRcdFx0Ly8gc3RvcmluZyB0aGUgdXNlcmFucyBhdHRyaWJ1dGUgdmFsdWUgaW4gdXNlcmFuc3dlclxyXG5cdFx0XHRcdHVzZXJBbnN3ZXJNID0gdWFYTUwuX3VzZXJBbnM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xyXG5cdFx0Ly8gcmVtb3ZpbmcgdGhlICV7ICwgfSUgc3ltYm9sIGZyb20gdGhlIGRhdGEgIFxyXG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSgvJXt8fSUvZyxcIlwiKTtcclxuXHRcdC8vIHNwbGl0dGluZyBpdCB3aXRoIHxcclxuXHRcdGRhdGEgPSBkYXRhLnNwbGl0KFwifFwiKTtcclxuXHRcdGxldCBhbnNrZXkgPSBkYXRhWzBdLnRyaW0oKTtcclxuXHJcblx0XHQvLyBwYXJzZSB0aGUgYXR0ciBpbiBqc29uXHJcblx0XHRsZXQgYXR0cnMgPSBKU09OLnBhcnNlKGRhdGFbMV0pO1xyXG5cdFx0Ly8gY3JlYXRpbmcgdGV4dGFyZWFcclxuXHRcdGxldCBtdWx0aWxpbmVCb3ggID0gYDx0ZXh0YXJlYSBjbGFzcz1cInRleHRhcmVhIGtzXCIgcm93cz1cIiR7YXR0cnMucm93c31cIiBjb2xzPVwiJHthdHRycy5jb2xzfVwiIGFuc2tleT1cIiR7YW5za2V5fVwiIHZhbHVlPVwiJHt1c2VyQW5zd2VyTX1cIiBkZWZhdWx0YW5zPVwiJHsoKGF0dHJzLmRlZmF1bHRBbnMpID8gYXR0cnMuZGVmYXVsdEFuczogXCJcIil9XCIgdXNlcmFucz1cIiR7dXNlckFuc3dlck19XCIgaGFza2V5d29yZHM9XCJcIiBoYXNub3RrZXl3b3Jkcz1cIlwiIGtleXdvcmR0eXBlPVwiMVwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGRhdGEtcm9sZT1cIm5vbmVcIj4ke3VzZXJBbnN3ZXJNfTwvdGV4dGFyZWE+YDtcclxuXHRcdGxldCB0YWcgPSBgPGRpdiBpZD1cImVsZW0ke2l9XCIgY2xhc3M9XCJmaWxsZWxlbWVudFwiIHN0eWxlPVwiaGVpZ2h0OmF1dG9cIj4ke211bHRpbGluZUJveH08L2Rpdj5gO1xyXG5cdFx0Ly8gcmVwbGFjZSB0aGUgY2RhdGFcclxuXHRcdGNkYXRhID0gY2RhdGEucmVwbGFjZShvcmlnaW5hbERhdGEsIHRhZyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjcmVhdGVEcmFnRHJvcChkYXRhLGksdWFYTUw9ZmFsc2UpIHtcclxuXHRcdGxldCBvcmlnaW5hbERhdGEgPSBkYXRhO1xyXG5cdFx0Ly8gcmVtb3ZpbmcgdGhlICV7ICwgfSUgc3ltYm9sIGZyb20gdGhlIGRhdGEgIFxyXG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSgvJXt8fSUvZyxcIlwiKTtcclxuXHRcdC8vIHNwbGl0dGluZyBpdCB3aXRoIHxcclxuXHRcdGRhdGEgPSBkYXRhLnNwbGl0KFwifFwiKTtcclxuXHRcdGxldCBhbnNrZXkgPSBkYXRhWzBdLnRyaW0oKTtcclxuXHRcdC8vIGlmIHRoZSB0eXBlIGlzIGRzIHRoZW4gbWFrZSBkcmFnU2luZ2xlIHZhbHVlIDEgZWxzZSAwXHJcblx0XHRsZXQgZHJhZ1NpbmdsZSA9ICgoZGF0YVsxXS50cmltKCkgPT0gXCJkc1wiKT8gXCIxXCI6IFwiMFwiKTtcclxuXHRcdC8vIHNwbGl0IHRoZSBhbnNrZXkgd2l0aCAsXHJcblx0XHRsZXQgdG90YWxEcmFnID0gYW5za2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdGxldCBkcm9wQW5zID0gJyc7XHJcblxyXG5cdFx0Ly8gdHJhdmVyc2luZyB0aHJvdWdoIGVhY2ggb3B0aW9uXHJcblx0XHRBSC5zZWxlY3RBbGwodG90YWxEcmFnKS5mb3JFYWNoKChlbG0sIGopPT4ge1xyXG5cdFx0XHRsZXQgaXNEdXBsaWNhdGUgPSBmYWxzZTtcclxuXHRcdFx0bGV0IG1heFdpZHRoID0gKCh0b3RhbERyYWdbal0ubGVuZ3RoKSoxMCszMCk7XHJcblx0XHRcdGxldCBkcmFnQW5zID0gdG90YWxEcmFnW2pdO1xyXG5cdFx0XHQvLyBzdG9yaW5nIHRoZSBpbmNvcnJlY3QgdmFsdWVzXHJcblx0XHRcdGxldCBpZ25vcmUgPSB0b3RhbERyYWdbal0ubWF0Y2goL2l+fH5pL2cpO1xyXG5cdFx0XHRsZXQgdGVtcEFucyA9IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAoaWdub3JlKSB7XHJcblx0XHRcdFx0Ly8gcmVtb3ZpbmcgfmksaX4gZnJvbSB0aGUgZHJhZ2Fuc1xyXG5cdFx0XHRcdGRyYWdBbnMgPSB0b3RhbERyYWdbal0ucmVwbGFjZSgvaX58fmkvZyxcIlwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkcm9wQW5zICs9IFwiSURcIiArIGRyYWdJRCArIFwiLFwiO1xyXG5cdFx0XHRcdHRlbXBBbnMgPSBcIklEXCIgKyBkcmFnSUQgKyBcIixcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gZnVuY3Rpb24gZm9yIGNoZWNraW5nIGR1cGxpY2F0ZSB2YWx1ZXNcclxuXHRcdFx0QUguc2VsZWN0QWxsKENoZWNrRHVwbGljYXRlKS5mb3JFYWNoKChlbG0sIHopPT4ge1xyXG5cdFx0XHRcdGlmIChDaGVja0R1cGxpY2F0ZVt6XS5hbnMgPT0gZHJhZ0Fucykge1xyXG5cdFx0XHRcdFx0aXNEdXBsaWNhdGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0aWYgKCFpZ25vcmUpIHtcclxuXHRcdFx0XHRcdFx0ZHJvcEFucyA9ICBkcm9wQW5zLnJlcGxhY2UodGVtcEFucyxcIlwiKTtcclxuXHRcdFx0XHRcdFx0ZHJvcEFucyArPSBDaGVja0R1cGxpY2F0ZVt6XS5pZCtcIixcIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gaWYgdmFsdWUgaXMgbm90IGR1cGxpY2F0ZVxyXG5cdFx0XHRpZiAoaXNEdXBsaWNhdGUgPT0gZmFsc2UpIHtcclxuXHRcdFx0XHRDaGVja0R1cGxpY2F0ZS5wdXNoKHtcclxuXHRcdFx0XHRcdFwiYW5zXCI6ZHJhZ0FucyxcclxuXHRcdFx0XHRcdFwiaWRcIjpcIklEXCIrZHJhZ0lEXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGlzRHVwbGljYXRlID09IGZhbHNlKSBkcmFnRGF0YSArPSBgPGRpdiBpZD1cIklEJHtkcmFnSUR9XCIgZHJhZ2FibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCIgY2xhc3M9XCJkcmFnLXJlc2l6ZSBkcmFnYWJsZSBrc1wiIGNhcHRpb249XCIke2RyYWdBbnMucmVwbGFjZSgvXFwjY20vZ21pLFwiLFwiKS5yZXBsYWNlKC9cXFwiL2dtaSxcIiNkb3VibGVxdW90ZSNcIil9XCIgcGF0aD1cIi8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy9cIiBkcmFnLXNpbmdsZT1cIiR7ZHJhZ1NpbmdsZX1cIiBiZ2NvbG9yPVwiI0NDRkZDQ1wiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjojQ0NGRkNDO2hlaWdodDphdXRvO21heC13aWR0aDoke21heFdpZHRofXB4O3BhZGRpbmc6M3B4IDEwcHggM3B4IDEwcHg7IG1hcmdpbjogMnB4IDJweDtcIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4ke2RyYWdBbnMucmVwbGFjZSgvXFwjY20vZ21pLFwiLFwiKX08L2Rpdj5gO1xyXG5cdFx0XHQgXHJcblx0XHRcdGlmIChpc0R1cGxpY2F0ZSA9PSBmYWxzZSkgZHJhZ0lEKys7XHJcblx0XHR9KTtcclxuXHRcdGxldCB1c2VyQW5zd2VyID0gXCJcIjtcclxuXHRcdC8vIGNoZWNraW5nIGZvciB0aGUgdXNlciBhbnNcclxuXHRcdGlmICh1YVhNTCkge1xyXG5cdFx0XHRpZiAodWFYTUwuX3VzZXJBbnMpIHtcclxuXHRcdFx0XHQvLyBzdG9yaW5nIHRoZSB1c2VyYW5zIGF0dHJpYnV0ZSB2YWx1ZSBpbiB1c2VyYW5zd2VyXHJcblx0XHRcdFx0dXNlckFuc3dlciA9IHVhWE1MLl91c2VyQW5zO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBhZGRpbmcgaW5mb3JtYXRpb24gaW4gaHRtbFxyXG5cdFx0bGV0IGRyb3AgPSAnPGRpdiBpZD1cImVsZW0nK2krJ1wiIHRhYmluZGV4PVwiMFwiIGRyb3B6b25lPVwiMVwiIGNsYXNzPVwiZHJhZy1yZXNpemUgZHJvcGFibGUga3NcIiBwYXRoPVwiLy9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljL1wiIGFuc2tleT1cIicrZHJvcEFucy5zbGljZSgwLC0xKSsnXCIgY2FwdGlvbj1cIlwiIHVzZXJhbnM9XCInK3VzZXJBbnN3ZXIrJ1wiIGRyb3BlZD1cIicrdXNlckFuc3dlcisnXCIgYmdjb2xvcj1cIiNGRkZGQ0NcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDI1NSwgMjA0KTsgbWluLXdpZHRoOiA1MHB4OyBoZWlnaHQ6IGF1dG87IHBhZGRpbmc6IDVweCAxMHB4IDVweDtcIj4nK3VzZXJBbnN3ZXIrJzwvZGl2Pic7XHJcblx0XHQvLyByZXBsYWNlIHRoZSBjZGF0YVxyXG5cdFx0Y2RhdGEgPSBjZGF0YS5yZXBsYWNlKG9yaWdpbmFsRGF0YSxkcm9wKTtcclxuXHRcdHN0YXRlLmZvb3RlclN0ciA9IHRydWU7XHJcblx0fVxyXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblx0Ly8gZm9yIHNob3dpbmcgY29ycmVjdCBhbnN3ZXIuXHJcblx0ZnVuY3Rpb24gY29ycmVjdEFuc3dlcigpIHtcclxuXHRcdHVjRmlsbC5zaG93ZHJhZ2FucyhhamF4X2VJZCwgJ2MnLCAxKTtcclxuXHRcdEFILnNlbGVjdEFsbCgnLmNvcnJfZGl2JywgJ3Nob3cnKTtcclxuXHRcdEFILnNlbGVjdEFsbCgnLnJlbWVkX2Rpc2FibGUnLCAnc2hvdycpO1xyXG5cdFx0YXV0b3Jlc2l6ZSgxKTtcclxuXHR9XHJcblxyXG5cdC8vIGZvciBzaG93aW5nIHVzZXIgYW5zd2VyLlxyXG5cdGZ1bmN0aW9uIHlvdXJBbnN3ZXIoKSB7XHJcblx0XHR1Y0ZpbGwuc2hvd2RyYWdhbnMoYWpheF9lSWQsICd1JywgMSk7XHJcblx0XHRBSC5zZWxlY3RBbGwoJy5jb3JyX2RpdicsICdoaWRlJyk7XHJcblx0XHRhdXRvcmVzaXplKDEpO1xyXG5cdH1cclxuXHJcblx0Ly9UbyBoYW5kbGUgcmV2aWV3IHRvZ2dsZVxyXG5cdGZ1bmN0aW9uIGhhbmRsZVJldmlldyhtb2RlLCBldmVudCkge1xyXG5cdFx0aWYgKG1vZGUgPT0gJ2MnKSB7XHJcblx0XHRcdGNvcnJlY3RBbnN3ZXIoZXZlbnQpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR5b3VyQW5zd2VyKGV2ZW50KTtcclxuXHRcdH1cclxuXHR9XHJcbjwvc2NyaXB0PlxyXG5cdFxyXG48ZGl2IGNsYXNzPXt4bWwgPyBcIm14LTQgcGwtMiBwbC1tZC0wXCI6IFwiXCJ9PlxyXG5cdDxjZW50ZXI+XHJcblx0XHQ8SXRlbUhlbHBlciBcclxuXHRcdFx0YmluZDp0aGlzPXtzbUNvbnRyb2xsZXJDYWxsYmFja31cclxuXHRcdFx0b246c2V0UmV2aWV3ID0ge3NldFJldmlld31cclxuXHRcdFx0b246dW5zZXRSZXZpZXcgPSB7dW5zZXRSZXZpZXd9XHJcblx0XHRcdGhhbmRsZVJldmlld0NsaWNrPXtoYW5kbGVSZXZpZXd9XHJcblx0XHRcdHJldmlld01vZGU9e2lzUmV2aWV3fVxyXG5cdFx0Lz5cclxuXHRcdDxkaXYgXHJcblx0XHRcdGlkPXtjb250YWluZXJJRH1cclxuXHRcdFx0Y2xhc3M9XCJmaWxsbWFpbiB7aXNSZXZpZXcgPyAncGUtbm9uZScgOiBudWxsfVwiXHJcblx0XHRcdG1hdGNodHlwZT17c3RhdGUubWF0Y2h0eXBlfVxyXG5cdFx0XHRtdWx0aT17c3RhdGUubXVsdGl9XHJcblx0XHRcdGlnbm9yZXR5cGU9e3N0YXRlLmlnbm9yZXR5cGV9XHJcblx0XHRcdG1hbnVhbF9ncmFkZT17bWFudWFsX2dyYWRlIHx8IDB9XHJcblx0XHRcdHRvdGFsY29ycmVjdGFucz17c3RhdGUudG90YWxjb3JyZWN0YW5zfVxyXG5cdFx0PlxyXG5cdFx0XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJzdHJpbmdcIiBpZD1cInByZXZpZXdBcmVhXCIgc3R5bGU9XCJmb250LWZhbWlseTonUm9ib3RvLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDFlbVwiPjwvZGl2PlxyXG5cdFx0XHR7I2lmIHN0YXRlLnNob3dUb29sYmFyfSBcclxuXHRcdFx0XHQ8RmlsbEluVGhlQmxhbmtzVG9vbGJhciAgXHJcblx0XHRcdFx0XHRzcGFuSWQ9e3N0YXRlLnNwYW5JZH0gXHJcblx0XHRcdFx0XHRkaXZJZD17c3RhdGUuZGl2SWR9IFxyXG5cdFx0XHRcdFx0YWN0aW9uPXt1Y0ZpbGwuZmlsbE1hdGhbZmlsbElkXX0gXHJcblx0XHRcdFx0XHRzaG93PXt0b2dnbGVUb29sYmFyfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdHsvaWZ9XHJcblx0XHRcdDxkaXYgc3R5bGU9XCJjb2xvcjogI2I5NGE0ODsgbWFyZ2luLXRvcDogNXB4XCIgY2xhc3M9XCJzbW5vdGVzXCI+XHJcblx0XHRcdFx0eyNpZiBzdGF0ZS5tYXRjaHR5cGUgPT0gXCIwXCJ9XHJcblx0XHRcdFx0XHQqRXhhY3QgbWF0Y2hpbmcgaXMgcmVxdWlyZWQuXHJcblx0XHRcdFx0ezplbHNlfVxyXG5cdFx0XHRcdFx0Kk1hdGNoaW5nIGlzIG5vdCBjYXNlIHNlbnNpdGl2ZS5cclxuXHRcdFx0XHR7L2lmfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cImZvb3RlclN0clwiIHN0eWxlPVwiZGlzcGxheToge3N0YXRlLmZvb3RlclN0ciA/ICdibG9jaycgOiAnbm9uZSd9XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImFycm93LXVwXCI+PC9kaXY+XHJcblx0XHRcdFx0PGNlbnRlciBjbGFzcz1cImRyYWdBcmVhXCI+PC9jZW50ZXI+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0PC9jZW50ZXI+XHJcbjwvZGl2PlxyXG48dGV4dGFyZWEgY2xhc3M9XCJoXCIgaWQ9XCJzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiPjwvdGV4dGFyZWE+XHJcbjxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cclxuXHQvKkBpbXBvcnQgJ2xheW91dC90aGVtZXMvYm9vdHN0cmFwNC9jc3MvYm9vdHN0cmFwNUJldGExLmNzcyc7ICovXHJcblx0Omdsb2JhbCh4bXApIHtcclxuXHRcdGRpc3BsYXk6IGlubGluZTtcclxuXHR9XHJcblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0pIHtcclxuXHRcdG92ZXJmbG93OmhpZGRlbjtcclxuXHRcdG1heC13aWR0aDoxMDI0cHg7XHJcblx0XHR0ZXh0LWFsaWduOmxlZnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIHByZSkge1xyXG5cdFx0YmFja2dyb3VuZDogbm9uZTtcclxuXHRcdGJvcmRlcjogbm9uZTtcclxuXHRcdGZvbnQtc2l6ZTogMTRweCFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5zdHJpbmcpIHtcclxuXHRcdG1pbi1oZWlnaHQ6NTBweDtcclxuXHRcdG1hcmdpbi10b3A6MTBweDtcclxuXHRcdG1hcmdpbi1yaWdodDoxMHB4O1xyXG5cdH1cclxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZm9vdGVyU3RyKSB7XHJcblx0XHRwb3NpdGlvbjpyZWxhdGl2ZTtcclxuXHRcdG1hcmdpbi10b3A6IDEwcHg7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xyXG5cdFx0cGFkZGluZzogMTVweDtcclxuXHRcdG1pbi1oZWlnaHQ6IDYwcHg7LyoxMDBweDsqL1xyXG5cdH1cclxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZm9vdGVyU3RyIC5hcnJvdy11cCkge1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0dG9wOiAtMTBweDtcclxuXHRcdHJpZ2h0OiA1MCU7XHJcblx0XHR3aWR0aDogMDtcclxuXHRcdGhlaWdodDogMDtcclxuXHRcdGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG5cdFx0Ym9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG5cdFx0Ym9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCAjY2NjO1xyXG5cdH1cclxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZmlsbC1yb3cpIHtcclxuXHRcdHBhZGRpbmc6NnB4O1xyXG5cdH1cclxuXHQ6Z2xvYmFsKFtpZF49XCJmaWxsbWFpblwiXSAuZmlsbGVsZW1lbnQsIFtpZF49XCJmaWxsbWFpblwiXSAuZHJhZy1yZXNpemUpe1xyXG5cdFx0aGVpZ2h0OjMwcHg7XHJcblx0XHRkaXNwbGF5OmlubGluZS1ibG9jaztcclxuXHRcdHBvc2l0aW9uOnJlbGF0aXZlO1xyXG5cdFx0bWluLWhlaWdodDogMzBweDtcclxuXHRcdG1hcmdpbjogMXB4IDAgMXB4IDA7XHJcblx0XHR0b3A6IC0zcHg7XHJcblx0fVxyXG5cdDpnbG9iYWwodGQgLmRyYWctcmVzaXplKSB7XHJcblx0XHR0b3A6IDAgIWltcG9ydGFudDtcclxuXHR9XHJcblx0Omdsb2JhbCh0ZCAuZmlsbGVsZW1lbnQpIHtcclxuXHRcdHRvcDogMHB4ICFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIGlucHV0W3R5cGU9XCJ0ZXh0XCJdLCBbaWRePVwiZmlsbG1haW5cIl0gc2VsZWN0KSB7XHRcclxuXHRcdGhlaWdodDo5OSUhaW1wb3J0YW50O1xyXG5cdFx0cmVzaXplOiBub25lO1xyXG5cdFx0Zm9udC1zaXplOjEycHg7XHJcblx0XHRjb2xvcjogIzAwMDtcclxuXHRcdG1heC13aWR0aDogODAwcHg7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5kcmFnLXJlc2l6ZSkge1xyXG5cdFx0dmVydGljYWwtYWxpZ246bWlkZGxlO1xyXG5cdFx0Ym9yZGVyOjFweCBzb2xpZCAjMzFCNzMxO1xyXG5cdFx0dGV4dC1hbGlnbjpjZW50ZXI7XHJcblx0XHRwYWRkaW5nOjNweDtcclxuXHRcdGZvbnQtc2l6ZTogMTRweDtcclxuXHR9XHJcblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLmRyYWctcmVzaXplLnVpLWRyYWdnYWJsZSkge1xyXG5cdFx0Y3Vyc29yOm1vdmU7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5kcm9wLWhvdmVyKSB7XHJcblx0XHRib3JkZXI6IDFweCBkYXNoZWQgcmVkIWltcG9ydGFudDtcclxuXHRcdGJveC1zaGFkb3c6IDAgMCAwIDJweCB5ZWxsb3cgaW5zZXQ7XHJcblx0XHRvdXRsaW5lOiAxcHggc29saWQgYmx1ZTtcclxuXHR9XHJcblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLmZpbGxjaGVjayB1bCkge1xyXG5cdFx0d2lkdGg6MjIwcHg7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5maWxsY2hlY2sgbGkuc2VsZWN0ZWQpIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6ICNFNUU1RTU7XHJcblx0fVxyXG5cdDpnbG9iYWwoLmZpbGxjaGVjayAuc2VsZWN0ZWQgLmljb21vb24tY2hlY2ttYXJrLTM6YmVmb3JlKSB7XHJcblx0XHRmbG9hdDogbGVmdDtcclxuXHRcdGNvbG9yOiBibHVlO1xyXG5cdFx0cGFkZGluZzogM3B4O1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0cmlnaHQ6IDE0cHg7XHJcblx0fVxyXG5cdDpnbG9iYWwoLmZpbGxjaGVjayAuaWNvbW9vbi1jbG9zZS0yOmJlZm9yZSkge1xyXG5cdFx0ZmxvYXQ6IGxlZnQ7XHJcblx0XHRjb2xvcjogYmx1ZTtcclxuXHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHRcdHJpZ2h0OiAxNHB4O1xyXG5cdFx0Zm9udC1zaXplOiAyMHB4O1xyXG5cdH1cclxuXHQ6Z2xvYmFsKC5NYXRoSmF4X0Rpc3BsYXkpIHtcclxuXHRcdFx0ZGlzcGxheSA6IGlubGluZSFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoW2lkXj1cImZpbGxtYWluXCJdIC5zZWxlY3QpIHtcclxuXHRcdGZvbnQtc2l6ZTogMTVweDtcclxuXHR9XHJcblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gLnRleHRhcmVhKSB7XHJcblx0XHR2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG5cdFx0Ym9yZGVyLXJhZGl1czozcHg7XHJcblx0XHRiYWNrZ3JvdW5kOiNmZmU7XHJcblx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG5cdFx0LXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSk7XHJcblx0XHRib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSk7XHJcblx0fVxyXG5cdDpnbG9iYWwoLnVpLWRyYWdnYWJsZS1kaXNhYmxlZCkge1xyXG5cdFx0Y3Vyc29yOiBuby1kcm9wIWltcG9ydGFudDtcclxuXHRcdG9wYWNpdHk6IDAuNSFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoLnNlbCkge1xyXG5cdFx0Ym9yZGVyIDoycHggc29saWQgI0ZGMDAwMCFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoLmJsYSBbaWRePVwiZmlsbG1haW5cIl0gLmRyYWdhYmxlOmZvY3VzLCAuYmxhIFtpZF49XCJmaWxsbWFpblwiXSAuZHJvcGFibGU6Zm9jdXMpIHtcclxuXHRcdGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDFweCB0cmFuc3BhcmVudCwgaW5zZXQgMCAwIDAgMXB4ICNmZmZmZmYsIGluc2V0IDAgMCAwIDJweCAjZmZmO1xyXG5cdFx0b3V0bGluZTogbm9uZTtcclxuXHR9XHJcblxyXG5cdDpnbG9iYWwoLmhpZ2hsaWdodF9tYWluKSB7XHJcblx0XHRib3JkZXIgOiAxcHggZGFzaGVkICMwMDA7XHJcblx0fVxyXG5cclxuXHQ6Z2xvYmFsKC5jb3BpZWRjbHIpIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6ICNDQ0MhaW1wb3J0YW50O1xyXG5cdH1cclxuXHJcblx0Omdsb2JhbChbaWRePVwiZmlsbG1haW5cIl0gc2VsZWN0OjotbXMtZXhwYW5kKSB7XHJcblx0XHRtYXJnaW4tbGVmdDogMnB4O1xyXG5cdH1cclxuXHQ6Z2xvYmFsKC5maWxsaW50aGVibGFuaykge1xyXG5cdFx0aGVpZ2h0OiAzMHB4O1xyXG5cdFx0cGFkZGluZzogNXB4IDEwcHg7XHJcblx0XHRmb250LXNpemU6IDE0cHg7XHJcblx0XHRtYXJnaW4tYm90dG9tOjNweDtcclxuXHRcdGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG5cdFx0LXdlYmtpdC1ib3JkZXItcmFkaXVzOiAzcHg7XHJcblx0XHQtbW96LWJvcmRlci1yYWRpdXM6IDNweDtcclxuXHRcdGJvcmRlci1yYWRpdXM6IDNweDtcclxuXHRcdGNvbG9yOiAjNTU1O1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogI0ZGRTtcclxuXHRcdHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcblx0XHRiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xyXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcclxuXHRcdGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2EsQXJpYWwsJ1RpbWVzIE5ldyBSb21hbicsVmVyZGFuYSxzYW5zLXNlcmlmO1xyXG5cdFx0LXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSk7XHJcblx0XHRib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSk7XHJcblx0XHQtd2Via2l0LXRyYW5zaXRpb246IGJvcmRlci1jb2xvciBlYXNlLWluLW91dCAuMTVzLGJveC1zaGFkb3cgZWFzZS1pbi1vdXQgLjE1cztcclxuXHRcdHRyYW5zaXRpb246IGJvcmRlci1jb2xvciBlYXNlLWluLW91dCAuMTVzLGJveC1zaGFkb3cgZWFzZS1pbi1vdXQgLjE1cztcclxuXHR9XHJcblxyXG5cdDpnbG9iYWwoLmZpbGxpbnRoZWJsYW5rOmZvY3VzKSB7XHJcblx0XHRib3JkZXItY29sb3I6IHJnYmEoODIsMTY4LDIzNiwwLjgpO1xyXG5cdFx0b3V0bGluZTogMDtcclxuXHRcdC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpLDAgMCA4cHggcmdiYSg4MiwxNjgsMjM2LDAuNik7XHJcblx0XHQtbW96LWJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMDc1KSwwIDAgOHB4IHJnYmEoODIsMTY4LDIzNiwwLjYpO1xyXG5cdFx0Ym94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpLDAgMCA4cHggcmdiYSg4MiwxNjgsMjM2LDAuNik7XHJcblx0fVxyXG5cdDpnbG9iYWwoLmNvcnJlY3RfaW5jb3JyZWN0X2ljb25fZmlsbCkge1xyXG5cdFx0cG9zaXRpb246YWJzb2x1dGU7XHJcblx0XHR3aWR0aDoxN3B4O1xyXG5cdFx0aGVpZ2h0OjE4cHg7XHJcblx0XHRyaWdodDotNHB4O1xyXG5cdFx0dG9wOi03cHg7XHJcblx0XHRmb250LXNpemU6IDE3cHg7XHJcblx0XHR3aGl0ZS1zcGFjZTogbm9ybWFsICFpbXBvcnRhbnQ7XHJcblx0XHR6LWluZGV4OiA5ICFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdDpnbG9iYWwoLmNvcnJfZGl2KSB7XHJcblx0XHRkaXNwbGF5OiBub25lO1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0d2lkdGg6IDEwMCU7XHJcblx0XHRoZWlnaHQ6IDEwMCU7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjMjFhODFkO1xyXG5cdFx0Y29sb3I6ICNmZmZmZmY7XHJcblx0XHR0b3A6IDAlO1xyXG5cdFx0cGFkZGluZy10b3A6IDRweDtcclxuXHRcdGJvcmRlci1yYWRpdXM6IDNweDtcclxuXHRcdGN1cnNvcjogbm9uZSAhaW1wb3J0YW50O1xyXG5cdH1cclxuXHQ6Z2xvYmFsKC5hdXRvX2hlaWdodCkge1xyXG5cdFx0aGVpZ2h0OmF1dG8haW1wb3J0YW50O1xyXG5cdH1cclxuXHQ6Z2xvYmFsKC5wcmV0dHlwcmludCkge1xyXG5cdFx0ZGlzcGxheTogLW1zLWdyaWQhaW1wb3J0YW50O1xyXG5cdH1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMDVCUyxHQUFHLEFBQUUsQ0FBQyxBQUNiLE9BQU8sQ0FBRSxNQUFNLEFBQ2hCLENBQUMsQUFDTyxnQkFBZ0IsQUFBRSxDQUFDLEFBQzFCLFNBQVMsTUFBTSxDQUNmLFVBQVUsTUFBTSxDQUNoQixXQUFXLElBQUksQUFDaEIsQ0FBQyxBQUNPLG9CQUFvQixBQUFFLENBQUMsQUFDOUIsVUFBVSxDQUFFLElBQUksQ0FDaEIsTUFBTSxDQUFFLElBQUksQ0FDWixTQUFTLENBQUUsSUFBSSxVQUFVLEFBQzFCLENBQUMsQUFDTyx3QkFBd0IsQUFBRSxDQUFDLEFBQ2xDLFdBQVcsSUFBSSxDQUNmLFdBQVcsSUFBSSxDQUNmLGFBQWEsSUFBSSxBQUNsQixDQUFDLEFBQ08sMkJBQTJCLEFBQUUsQ0FBQyxBQUNyQyxTQUFTLFFBQVEsQ0FDakIsVUFBVSxDQUFFLElBQUksQ0FDaEIsZ0JBQWdCLENBQUUsSUFBSSxDQUN0QixPQUFPLENBQUUsSUFBSSxDQUNiLFVBQVUsQ0FBRSxJQUFJLEFBQ2pCLENBQUMsQUFDTyxxQ0FBcUMsQUFBRSxDQUFDLEFBQy9DLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxLQUFLLENBQ1YsS0FBSyxDQUFFLEdBQUcsQ0FDVixLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxDQUFDLENBQ1QsV0FBVyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUNuQyxZQUFZLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQ3BDLGFBQWEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQUFDL0IsQ0FBQyxBQUNPLDBCQUEwQixBQUFFLENBQUMsQUFDcEMsUUFBUSxHQUFHLEFBQ1osQ0FBQyxBQUNPLDREQUE0RCxBQUFDLENBQUMsQUFDckUsT0FBTyxJQUFJLENBQ1gsUUFBUSxZQUFZLENBQ3BCLFNBQVMsUUFBUSxDQUNqQixVQUFVLENBQUUsSUFBSSxDQUNoQixNQUFNLENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNuQixHQUFHLENBQUUsSUFBSSxBQUNWLENBQUMsQUFDTyxlQUFlLEFBQUUsQ0FBQyxBQUN6QixHQUFHLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDbEIsQ0FBQyxBQUNPLGVBQWUsQUFBRSxDQUFDLEFBQ3pCLEdBQUcsQ0FBRSxHQUFHLENBQUMsVUFBVSxBQUNwQixDQUFDLEFBQ08sNERBQTRELEFBQUUsQ0FBQyxBQUN0RSxPQUFPLEdBQUcsVUFBVSxDQUNwQixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsSUFBSSxDQUNkLEtBQUssQ0FBRSxJQUFJLENBQ1gsU0FBUyxDQUFFLEtBQUssQUFDakIsQ0FBQyxBQUNPLDZCQUE2QixBQUFFLENBQUMsQUFDdkMsZUFBZSxNQUFNLENBQ3JCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3hCLFdBQVcsTUFBTSxDQUNqQixRQUFRLEdBQUcsQ0FDWCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ08sMENBQTBDLEFBQUUsQ0FBQyxBQUNwRCxPQUFPLElBQUksQUFDWixDQUFDLEFBQ08sNEJBQTRCLEFBQUUsQ0FBQyxBQUN0QyxNQUFNLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FDaEMsVUFBVSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNsQyxPQUFPLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQ3hCLENBQUMsQUFDTyw4QkFBOEIsQUFBRSxDQUFDLEFBQ3hDLE1BQU0sS0FBSyxBQUNaLENBQUMsQUFDTyx1Q0FBdUMsQUFBRSxDQUFDLEFBQ2pELGdCQUFnQixDQUFFLE9BQU8sQUFDMUIsQ0FBQyxBQUNPLGdEQUFnRCxBQUFFLENBQUMsQUFDMUQsS0FBSyxDQUFFLElBQUksQ0FDWCxLQUFLLENBQUUsSUFBSSxDQUNYLE9BQU8sQ0FBRSxHQUFHLENBQ1osUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQUFDWixDQUFDLEFBQ08sa0NBQWtDLEFBQUUsQ0FBQyxBQUM1QyxLQUFLLENBQUUsSUFBSSxDQUNYLEtBQUssQ0FBRSxJQUFJLENBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ08sZ0JBQWdCLEFBQUUsQ0FBQyxBQUN6QixPQUFPLENBQUcsTUFBTSxVQUFVLEFBQzVCLENBQUMsQUFDTyx3QkFBd0IsQUFBRSxDQUFDLEFBQ2xDLFNBQVMsQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDTywwQkFBMEIsQUFBRSxDQUFDLEFBQ3BDLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGNBQWMsR0FBRyxDQUNqQixXQUFXLElBQUksQ0FDZixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRCxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEFBQzlDLENBQUMsQUFDTyxzQkFBc0IsQUFBRSxDQUFDLEFBQ2hDLE1BQU0sQ0FBRSxPQUFPLFVBQVUsQ0FDekIsT0FBTyxDQUFFLEdBQUcsVUFBVSxBQUN2QixDQUFDLEFBQ08sSUFBSSxBQUFFLENBQUMsQUFDZCxNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQVUsQUFDcEMsQ0FBQyxBQUNPLDRFQUE0RSxBQUFFLENBQUMsQUFDdEYsVUFBVSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDdEYsT0FBTyxDQUFFLElBQUksQUFDZCxDQUFDLEFBRU8sZUFBZSxBQUFFLENBQUMsQUFDekIsTUFBTSxDQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxBQUN6QixDQUFDLEFBRU8sVUFBVSxBQUFFLENBQUMsQUFDcEIsZ0JBQWdCLENBQUUsSUFBSSxVQUFVLEFBQ2pDLENBQUMsQUFFTyxtQ0FBbUMsQUFBRSxDQUFDLEFBQzdDLFdBQVcsQ0FBRSxHQUFHLEFBQ2pCLENBQUMsQUFDTyxlQUFlLEFBQUUsQ0FBQyxBQUN6QixNQUFNLENBQUUsSUFBSSxDQUNaLE9BQU8sQ0FBRSxHQUFHLENBQUMsSUFBSSxDQUNqQixTQUFTLENBQUUsSUFBSSxDQUNmLGNBQWMsR0FBRyxDQUNqQixXQUFXLENBQUUsSUFBSSxDQUNqQixxQkFBcUIsQ0FBRSxHQUFHLENBQzFCLGtCQUFrQixDQUFFLEdBQUcsQ0FDdkIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUN0QixXQUFXLENBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUNqRSxrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDckQsVUFBVSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUM3QyxrQkFBa0IsQ0FBRSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDN0UsVUFBVSxDQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxBQUN0RSxDQUFDLEFBRU8scUJBQXFCLEFBQUUsQ0FBQyxBQUMvQixZQUFZLENBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FDbEMsT0FBTyxDQUFFLENBQUMsQ0FDVixrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNsRixlQUFlLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FDL0UsVUFBVSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEFBQzNFLENBQUMsQUFDTyw0QkFBNEIsQUFBRSxDQUFDLEFBQ3RDLFNBQVMsUUFBUSxDQUNqQixNQUFNLElBQUksQ0FDVixPQUFPLElBQUksQ0FDWCxNQUFNLElBQUksQ0FDVixJQUFJLElBQUksQ0FDUixTQUFTLENBQUUsSUFBSSxDQUNmLFdBQVcsQ0FBRSxNQUFNLENBQUMsVUFBVSxDQUM5QixPQUFPLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDdEIsQ0FBQyxBQUNPLFNBQVMsQUFBRSxDQUFDLEFBQ25CLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsS0FBSyxDQUFFLE9BQU8sQ0FDZCxHQUFHLENBQUUsRUFBRSxDQUNQLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxJQUFJLENBQUMsVUFBVSxBQUN4QixDQUFDLEFBQ08sWUFBWSxBQUFFLENBQUMsQUFDdEIsT0FBTyxJQUFJLFVBQVUsQUFDdEIsQ0FBQyxBQUNPLFlBQVksQUFBRSxDQUFDLEFBQ3RCLE9BQU8sQ0FBRSxRQUFRLFVBQVUsQUFDNUIsQ0FBQyJ9 */";
	append_dev(document_1.head, style);
}

// (898:3) {#if state.showToolbar}
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
		source: "(898:3) {#if state.showToolbar}",
		ctx
	});

	return block;
}

// (909:4) {:else}
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
		source: "(909:4) {:else}",
		ctx
	});

	return block;
}

// (907:4) {#if state.matchtype == "0"}
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
		source: "(907:4) {#if state.matchtype == \\\"0\\\"}",
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
			set_style(div0, "font-family", "'Roboto, sans-serif; font-size: 1em");
			add_location(div0, file, 896, 3, 32107);
			set_style(div1, "color", "#b94a48");
			set_style(div1, "margin-top", "5px");
			attr_dev(div1, "class", "smnotes");
			add_location(div1, file, 905, 3, 32412);
			attr_dev(div2, "class", "arrow-up");
			add_location(div2, file, 913, 4, 32704);
			attr_dev(center0, "class", "dragArea");
			add_location(center0, file, 914, 4, 32738);
			attr_dev(div3, "class", "footerStr");
			set_style(div3, "display", /*state*/ ctx[5].footerStr ? "block" : "none");
			add_location(div3, file, 912, 3, 32621);
			attr_dev(div4, "id", /*containerID*/ ctx[7]);
			attr_dev(div4, "class", div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? "pe-none" : null));
			attr_dev(div4, "matchtype", div4_matchtype_value = /*state*/ ctx[5].matchtype);
			attr_dev(div4, "multi", div4_multi_value = /*state*/ ctx[5].multi);
			attr_dev(div4, "ignoretype", div4_ignoretype_value = /*state*/ ctx[5].ignoretype);
			attr_dev(div4, "manual_grade", div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0);
			attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value = /*state*/ ctx[5].totalcorrectans);
			add_location(div4, file, 886, 2, 31845);
			add_location(center1, file, 878, 1, 31645);
			attr_dev(div5, "class", div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "");
			add_location(div5, file, 877, 0, 31599);
			attr_dev(textarea, "class", "h");
			attr_dev(textarea, "id", "special_module_user_xml");
			add_location(textarea, file, 919, 0, 32815);
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

		displayAns();
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
		if (!document_1.getElementById("svelte-zb1ued-style")) add_css();

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
//# sourceMappingURL=FillInTheBlanksPreview-1365dd03.js.map
