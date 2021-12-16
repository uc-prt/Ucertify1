import JUI, {Draggable} from '../src/libs/javscript_helper/JUI.js';
const JS = new JUI();

export default class fillJS {
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
				var ln = JS.selectAll('.linenums li').length, cr = true, li_arr = [];
	
				if (ln == 0 && this.delPreSpaces.loopGaurd <= 4) {
					this.delPreSpaces.loopGaurd ++;
					setTimeout(()=> {this.delPreSpaces.withLines(fillid)}, 1000);
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
						JS.prevElm(val).append(ht)
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
						setTimeout(()=> { delPreSpaces.withoutLines(fillid) }, 1000);
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
		let distance = 80, step = 5;
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
				
				if (_this.getAttribute("droped").trim() != "") {
					//JS.find(fillid, '#' + _this.getAttribute("droped")).draggable('enable');
				}

				_this.innerHTML = dragElm.innerHTML;
				JS.select(_this, 'attr', {userans: drop_id, droped: drop_id, path: dragElm.getAttribute('path')});
				JS.select(_this, 'css', {backgroundColor: dragElm.style.backgroundColor});
				// .draggable($.extend(ucFill.dragOptionFill,{revert:false}))
				drop_target = _this.id;
				//ucFill.checkAns("#previewArea");
				this.checkAns(fillid);
				_this.classList.remove("drop-hover")
			},
			onDragEnd: (e, dragElm)=> {
				let _this = e.target;
				if (_this.classList.contains('dropable')) {
					if (_this.dataset["drag_enable"]) {
						//$(fillid).find('#'+_this.attr('droped')).draggable('enable');
					}
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
		//

		//Initialize
		let count = 0;
		let count_prev = 0;
		let copied_id = "";
		let ks_activated = false;
		let drag_id = "";
		let drop_target = "";

		JS.listen(document, "click", fillid, (_this, event)=> {
			
			if (!window.isReview && !this.checkFocus("ks")) {
				JS.selectAll(JS.find(fillid, ".copiedclr", 'all'), 'removeClass', "copiedclr");
				count = 0;
				count_prev = 0;
				copied_id = "";
				ks_activated = false;
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
					_this.selected = false;
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
							tooltip += "(" + (index + 1) + ") " + value.replace(/#cm/g,',')  + "<br>"
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
			JS.find(fillid, '.correct_incorrect_icon_fill', {action:'remove'})
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
			userans = userans.replace(/,/gm, "#cm");
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
			correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="bottom:22px;background:none;border-radius:12px;"> '  + droped_value_indicator_html + '</span></span>'
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
	//	updateModule('uxml', this.userAnsXML);

		if (parseInt(JS.select(fillid).nodeName && JS.select(fillid).getAttribute('manual_grade') || '1') != 1) {
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
			
			pElem.setAttribute("userans", userans);
		
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
				pElem.setAttribute('userans', userans);
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
				if (JS.select(fillid).getAttribute('multi') != 0 || anskey.includes("#cm")) {
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
				if (pElem.nodeName == "INPUT") {
					//__ans = __ans.replace(/,/g, "#cm");
				}
				userAnsXML += `<div id='${pElem.parentElement.getAttribute("id")}' userAns='${__ans}'></div>\n`;
			}
		}
		return userAnsXML;
		
	}

	modeOn(modeType, isReview) {
		if (typeof modeType == "undefined") {
			//modeType = 1;
		}
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

export const ucFill = new fillJS();