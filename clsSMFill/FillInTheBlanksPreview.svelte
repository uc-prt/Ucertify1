<!-- <svelte:head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
</svelte:head> -->

<script>
/**
 *  File Name   : FillInTheBlanksPreview.js
 *  Description : Container for all Fill in The Blanks preview Module
 *	Author      : Pradeep Yadav
 *  Version     : 1.0
 *  Package     : pe-items
 *  Last update : 17 Dec 2017
 */
	import {ucFill} from './fillJSString';
	import ju from '../src/libs/jslib';
	import ItemHelper from '../helper/ItemHelper.svelte';
	import FillInTheBlanksToolbar from './FillInTheBlanksToolbar.svelte';
	import { writable } from 'svelte/store';
	import { beforeUpdate, onMount } from 'svelte';
	import { AH, onUserAnsChange, XMLToJSON } from '../helper/HelperAI.svelte';

	//Mathquill, seq is important and mathquil is dependent on query, so do not remove this
	import '../css/mathquill.css';
	import 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
	import './libs/mathQuill_new';

	export let manual_grade;
	export let xml;
	export let uxml;
	export let isReview;
	export let editorState;
	export let smValidate;
	export let showAns;
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
			matchtype : "0",
			ignoretype:"",
			multi:"",
			totalcorrectans:0,
			showToolbar: false,
			isMathquill:false,
			fillMath: [],
			footerStr: false,
		});
	const unsubscribe = hdd.subscribe((items)=> {
		state = items;
	})

	$: (isReview) ? setReview() : unsetReview();

	onMount(()=> {
		window.J = ju;
		ucFill.setUpdate(updateModule.bind(this));
		let mathItem = document.getElementById(containerID);
		mathItem = mathItem ? mathItem.getElementsByClassName('mathquill') : mathItem;
		if (state.isMathquill) {
			AH.selectAll("div" + ajax_eId,  'css', {'overflow': 'auto'});
		}
		// Binding the events 
		AH.bind(ajax_eId, 'click', displayAns);
		AH.bind(ajax_eId, 'keyup', displayAns);
		AH.bind(ajax_eId, 'change', displayAns);

		AH.listen(document, "click", "span.mq-editable-field.mq-focused", oneditoFocused);
		AH.listen(document, "change", "span.mq-editable-field.mq-focused", oneditoFocused);

		// for loading the module on the basis of the updated the xml
		loadModule();
	})

	/*
	** This function will call when compent recieving new prop in other words whenever 
	** any thing changes in xml this function will call automatically
	*/
	beforeUpdate((nextProps)=> {
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
			setTimeout(function(){
				let node =  document.getElementById('previewArea');
				if(node.childNodes[0] && node.childNodes[0].nodeName == 'TABLE') {
					node = document.querySelectorAll('#previewArea td');
					for (let item in node){ 
						if(!node[item].firstElementChild && node[item].nodeName == 'TD'){
							//console.log(node[item].childNodes[0].nodeType);
							node[item].setAttribute('tabindex','0');
						}
					}
				} else {
					for (let item in node.childNodes){ 
						if(node.childNodes[item].nodeType == 3){
							let txt = document.createElement("span");
							txt.setAttribute('tabindex','0');
							txt.innerHTML = node.childNodes[item].textContent;
							node.childNodes[item].replaceWith(txt);
							//node.childNodes[item].nodeValue = <span tabinde="0">{}</span>;
						}
					}
				}
			},1000);
		}
	});

	// for loading the module initially 	
	function loadModule() {
		state.xml = xml;
		// converting the xml to json using XMLToJSON function
		parsedXml = XMLToJSON(xml);
		// checking for user ans
		if (uxml) {
			if (!window.isResetMath) {
				console.warn("uxml loaded", window.isResetMath);
				parsedUxml = XMLToJSON(uxml);
				state.uxml = uxml;
			} else {
				console.warn("Uxml not loaded", window.isResetMath);
				window.isResetMath = false;
			}
		}
		// parsing the authoring xml
		parseXmlAuthoring(parsedXml, parsedUxml);
		ucFill.showdragans(ajax_eId, 'u');
		if(!xml) {
			let errMsg = smVal.validate(editorState.content_type, editorState.subtype , editorState.content_icon);
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
			answerKey.forEach((currentAns, i)=> {
				// checking for the user ans
				if (parsedUans) {
					if (parsedUans.smans) {
						let uans = parsedUans.smans.div;
						if(Array.isArray(uans) == false) {
							uans = []
							uans[0] = parsedUans.smans.div;
						}
						if(uans) {
							uaXMLNew = uans[i];
						}
					}
				}
				// finding the type by finding the match with string containing | in the start and end with }%
				answerType = currentAns.match(/\|(.*?)}%$/gm);
				// removing the | symbol and }% and save the remaining thing in answerType if match is found otherwise kept the answerType balnk
	    		answerType = (answerType) ? answerType[0].replace(/\||}%/gm,'') : '';
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
					} else if (answerType == "s") {
						// checking createSelectBox for the user ans
					} else if (answerType == "e") {
						id = `#elem${i}`;
					} else if (answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
						// For multiline 
						id = `#elem${i} .textarea`;
					}
					if (AH.isValid(id) && document.querySelector(id)) {
						document.querySelector(id).setAttribute('userans', uaXMLNew._userAns);
						//console.log(currentAns, id, answerType, uaXMLNew._userAns);
					}
				}
				
			});
		}
	}

	// this function responsible for parsing the xml 
	function parseXmlAuthoring(MYXML, uaXML=false) {
		// fetching the cdata
		cdata = MYXML.smxml.text.__cdata;
		dragData = "";
		CheckDuplicate = [];
		dragID = 0;
		state.footerStr = false;
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
		state.matchtype = MYXML.smxml.text._matchtype;
		state.ignoretype = MYXML.smxml.text._ignoretype;
		state.multi = (MYXML.smxml.text._multiple == "multiple") ? "1" : "";

		// finding the correct ans
		let answerKey = cdata.match(/%{[\s\S]*?}%/gm);
		let answerType = '';
		let checkType = [];
		let uaXMLNew = "";
		let totalMarks = 0;
		// if correct answer is found traverseing each correct ans
		if (answerKey) {
			answerKey.forEach((v, i)=>{
				totalMarks++;
				// checking for the user ans
				if (uaXML) {
					if (uaXML.smans) {
						let uans = uaXML.smans.div;
						if(Array.isArray(uans) == false) {
							uans = []
							uans[0] = uaXML.smans.div;
						}
						if(uans) {
							uaXMLNew = uans[i];
						}
					}
				}

				let originalKey = answerKey[i];
				// finding the type by finding the match with string containing | in the start and end with }%
				answerType = answerKey[i].match(/\|(.*?)}%$/gm);
				// removing the | symbol and }% and save the remaining thing in answerType if match is found otherwise kept the answerType balnk
	    		answerType = (answerType) ? answerType[0].replace(/\||}%/gm,'') : '';
	    		answerType = answerType.trim();
				checkType.push(answerType);
				// in case of textbox or codetype
	    		if(answerType == '' || answerType == 'c') {
					AH.selectAll(".smnotes", 'show');
					// checking for the user ans
					if(uaXMLNew) {
						// create the textbox in the preview area with user ans
						createTextbox(originalKey,i,uaXMLNew);
					} else {
						// create the textbox in the preview area
						createTextbox(originalKey,i);
					}
	    		} else if(answerType == 'n') { 
					// if the type is numeric
					// checking for the user ans
					if(uaXMLNew) {
						// create the numeric textbox in the preview area with user ans
						createNumericbox(originalKey,i,uaXMLNew);
					}else {
						// create the numeric textbox in the preview area
						createNumericbox(originalKey,i);
					}
	    		} else if(answerType == "d" || answerType == "ds") {
					// checking for the user ans
					if(uaXMLNew){
						// create the drag & drop textbox in the preview area with user ans
						createDragDrop(originalKey,i,uaXMLNew);
					} else {
						// create the drag & drop textbox in the preview area
						createDragDrop(originalKey,i);
					}
	    			
	    		} else if(answerType == "s") {
					// checking for the user ans
					if(uaXMLNew) {
						// create the select box in the preview area with user ans
						createSelectBox(originalKey,i,uaXMLNew);
					} else {
						// create the select box in the preview area
						createSelectBox(originalKey,i);
					}
	    		} else if(answerType == "e") {
					state.isMathquill = true;
					// checking for the user ans
					if (uaXMLNew) {
						// creating textbox with user ans in preview area
						createMathDiv(originalKey,i,uaXMLNew);
					} else {
						// creating textbox in preview area
						createMathDiv(originalKey,i);
					}
	    		} else if(answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
					AH.selectAll(".smnotes", 'show');
					// checking for the user ans
					if (uaXMLNew) {
						// create the textarea in the preview area with user ans
						createMultilineBox(originalKey,i,uaXMLNew);
					} else {
						// create the textarea in the preview area
						createMultilineBox(originalKey,i);	
					}
	    		}
				let innerKey = originalKey.replace("%{","").replace("}%","");
			});
		}
		AH.selectAll("#"+containerID, 'attr', {"totalcorrectans": totalMarks} );
		// Resolve html entity
		cdata = AH.ignoreEnity(cdata);
		
		// put the cdata in the previewarea
		AH.find("#"+containerID, "#previewArea", {action:'html', actionData: cdata});
		// put the dragData in the dragarea
		AH.find("#"+containerID, ".dragArea",{action: 'html', actionData: dragData});
		let parent = AH.find("#"+containerID, ".dragArea");
	    let divs = parent?.children ? Array.from(parent.children) : [];
	    while (divs.length) {
	        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
	    }
		// set the max width of the textbox
	    setMaxWidth();
	    setSMNotes();
		runModule();
		var timer = setTimeout(function(){
			if(AH.find(ajax_eId, ".prettyprint", 'all').length >= 1) {
				if(AH.find(ajax_eId, ".prettyprint .L0", 'all').length == 0) {
					if(typeof(prettyPrint) == 'function') {
						/*code to prevent pretty print existing pretified code 04/02/2018*/
						AH.selectAll(".prettyprint").forEach((_this)=>{
							_this.classList.add("prettyprintReplica");
							_this.classList.remove("prettyprint");
						});
						AH.selectAll(".linenums").forEach((_this)=> {
							_this.classList.add("linenumsReplica");
							_this.classList.remove("linenums");
						});
						AH.find(ajax_eId, ".prettyprintReplica").forEach((_this)=> {
							_this.classList.add("prettyprint");
						});
						AH.find(ajax_eId, ".linenumsReplica").forEach((_this)=> {
							_this.classList.add("linenums");
						});
						/********/
						prettyPrint();
						/*code to prevent pretty print existing pretified code 04/02/2018*/
						AH.selectAll(".prettyprintReplica").forEach((_this)=> {
							_this.classList.add("prettyprint");
							_this.classList.remove("prettyprintReplica");
						});
						AH.selectAll(".linenumsReplica").forEach((_this)=> {
							_this.classList.add("linenums");
							_this.classList.remove("linenumsReplica");
						});
						/*******/
					}
				}
			}
			clearTimeout(timer);
		},2000);

		if (AH.find(ajax_eId, "table.uc-table", 'all').length > 0) {
			AH.find(ajax_eId, "table.uc-table", {action:'addClass', actionData: 'font14'});
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
		isReview = true;
		// For mathqul based 
		if (xml.includes("user Response{") ) window.isResetMath = true;
		state.showToolbar = false;
		// show the answer and also bind the keys event for ada
		ucFill.modeOn("on");
		ucFill.showdragans(ajax_eId, 'u', 1);

		// To save the user answer
		var save_result = {};
		save_result.ans = ucFill.iscorrect;
		save_result.uXml = AH.select("#special_module_user_xml").value;
		onUserAnsChange(save_result);

		AH.selectAll('.remed_disable', 'show');
		autoresize(1);
		let mathItem = document.getElementById(containerID);
		mathItem = mathItem ? mathItem.getElementsByClassName('mathquill') : mathItem;
		if (mathItem) {
			AH.setCss(ajax_eId, {"position": "relative"});
			AH.insert(ajax_eId, "<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>", 'afterbegin');
		}

		// for editor
		// ucFill.modeOn("on");
		// state.showToolbar = false;
		// ucFill.showdragans(ajax_eId, 'u', 1);
		// smControllerCallback.activeYourAnswer();
		// AH.selectAll('.corr_div', 'hide');
		// AH.selectAll('.remed_disable','show');
	}

	// function calls when remediation mode is off
	function unsetReview() {
		isReview = false;
		AH.selectAll('.mathquill', 'css', {'border': 'none'});
		ucFill.modeOn();
		AH.selectAll('.remed_disable, .corr_div', 'hide');
		ucFill.showdragans(ajax_eId, 'u', 0);
		let mathItem = document.getElementById(containerID);
		mathItem = mathItem ? mathItem.getElementsByClassName('mathquill') : mathItem;
		autoresize();
		if (mathItem) {
			AH.selectAll(ajax_eId, 'css', {"position": "unset"});
			AH.selectAll(".spinner-wrapper", 'remove');
		}

		// if the remediation mode if off in editor
		// ucFill.modeOn();
		// ucFill.showdragans(ajax_eId, 'u', 0);
		// AH.setCss('.edit_step', {'border':'none'});
		// AH.selectAll('.corr_div','hide');
	}

	// for resizing the textarea
	function autoresize(flag) {
		let ftb_textarea = document.querySelectorAll(".textarea.ks");
		for (let i = 0; i < ftb_textarea.length; i++) {
			let e = ftb_textarea[i];
			var timer = setTimeout(function(){
			    e.style.cssText = 'height:auto;overflow: auto;';
			    if(flag)
			    	if(window.isIE)
			    		e.style.cssText = 'height:' + (e.scrollHeight+10) + 'px;overflow: hidden';
			    	else
						e.style.cssText = 'height:' + (e.scrollHeight) + 'px;overflow: hidden';
				clearTimeout(timer);
			},100);
		}
	}

	// for displaying the answer
	function displayAns() {
		// check the ans and create user ans
		let ans = ucFill.checkAns(ajax_eId);
		if(editorState) { showAns(ans); }
	}

	// for toggling the toolbar in case of math module
	function toggleToolbar(value) {
		state.showToolbar = value;
	}

	function oneditoFocused(x, event) {
		let isFillId = true;
		let fillId;
		while (isFillId) {
			x = x.parentElement;
			if(x.getAttribute('id')) {
				isFillId = false;
				fillId = x.getAttribute('id');
			}
		}
			
		let latexArray = [];
			
		AH.selectAll("#" + fillId + " span.mq-editable-field").forEach((element)=> {	
			let commandId = x.getAttribute('mathquill-command-id');
			latexArray.push(commandId);
		});
			
		let mathId = x.getAttribute('mathquill-command-id');
		let indexId = latexArray.indexOf(mathId);
		state.spanId = indexId;
		state.divId =  fillId;
		state.showToolbar = true;	
	}

	function updateModule(key, value) {
		state[key] = value;
		if (key == 'uxml') {
			parsedUxml = XMLToJSON(state.uxml);
			// parsing the authoring xml
			updateUserAns(parsedUxml);
		}
	}

	// for giving the uc-table style
	function setSMNotes(){
		if(AH.find(ajax_eId, "table.uc-table", 'all').length > 0) {
			let tableWidth = (AH.find(ajax_eId, "table.uc-table").clientWidth) + 9;
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
			console.log("runmodule");
			// for adding the event to select and add drag and drop functionality to element
			ucFill.readyFill(ajax_eId);
		} catch(e) {
			if (errorCatchFlag <= 100) {
				var timer = setTimeout(()=> {
					runModule();
					clearTimeout(timer);
				}, 50);
			} else {
				console.warn("Error at runModule function");
			}
			errorCatchFlag++;
		}
	}

	// for setting maximum width of the drag area
	function setMaxWidth() {
		let maxDragDropWidth = [];
		AH.selectAll(".dragArea div").forEach((_this, i)=> {
	    	maxDragDropWidth.push(_this.innerHTML.length * 10 + 30); 
	    });

	    AH.selectAll("#previewArea [id^=elem]").forEach((_this)=> {
	    	if (_this.classList.contains('drag-resize')) {
	    		AH.setCss(_this, {"max-width": Math.max(...maxDragDropWidth)});
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
		let splitData =  addMathquill.split("##");
		let randomKey = Math.floor(Math.random() * splitData.length)
		// taking random option
		let randomOption = splitData[randomKey];
		// storing the randomOption in userasn by replacing the MathQuillMathField{(any value)} to MathQuillMathField{}
		let userans = randomOption.replace(/MathQuillMathField{(.*?)}/g, 'MathQuillMathField{}');
		let defaultans = 0;
		let anskey = randomOption;
		// checking for the user ans
		if(uaXML) {
			if(uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userans = uaXML._userAns;
				// check for the _userAnsSeq
				if(uaXML._userAnsSeq) {
					// storing the anskey and userAnsSeq
					anskey = uaXML._anskey;
					randomKey = uaXML._userAnsSeq;
				}
			}
		} else if (randomOption.indexOf("\MathQuillMathField") > -1) {
			anskey = randomOption;
			defaultans = 1;
		}

		AH.selectAll('#elem'+i, 'hide');

		let matheq = `<span id="elem${i}" class="auto_height edit_step fillmathelement mathquill" userAnsSeq="${randomKey}" userans="${userans}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1"></span>`;
		let tag = `<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div><span  id="m${i}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${randomKey}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1">${anskey}</span>${matheq}</div>`;

		// rplacing the cdata
		cdata = cdata.replace(originalData, tag);

		let mqInterval = setInterval(()=> { 
			// checking the MathQuill function is defined or not
			if (typeof MathQuill == "function") {
				// if found clear the interval
				clearInterval(mqInterval);
				AH.selectAll('#elem'+i, 'show');
				// According to API DOC: By default, MathQuill overwrites the global MathQuill variable when loaded. If you do not want this behavior, you can use this 
				let MQ = MathQuill.getInterface(2);
				AH.selectAll(".mathquill").forEach((_this)=> {
					let mathItemId  = _this.getAttribute('id');
					let defaultans = _this.getAttribute('defaultans');
					// adding the userans in the mathItemid
					if(defaultans == 1) {
						var latex = _this.getAttribute('userans');
						AH.selectAll('#'+mathItemId, 'text', latex); 
					} else {
						AH.selectAll('#'+mathItemId, 'text', _this.getAttribute('userans'));
					}
					/**
					 * According to Api doc
					 * MQ.StaticMath(html_element) Creates a non-editable MathQuill initialized with the contents of the HTML element and returns a StaticMath object.
					 * If the given element is already a static math instance,
 					 * this will return a new StaticMath object with the same .id. If the element is a different type of MathQuill, this will return null.
					**/
					fillMath[mathItemId] = MQ.StaticMath(document.getElementById(mathItemId));
				});

				ucFill.fillMath = fillMath;
			}
		}, 100)	
	}

	function createTextbox(data,i,uaXML=false) {
		var userAnswer  = "";
		// checking for the user ans
		if(uaXML) {
			if(uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userAnswer = uaXML._userAns;
			}
		}
		let originalData = data;
		let csStyle = "";
		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g,"");
		// splitting it with |
		data = data.split("|");
		// if the type is codetype then make its value 1 else blank
		let codetype = (data[1] && data[1].trim() == "c") ? "1" : "";
		let anskey = data[0].trim();

		// check for if any styling is given or not
		if(anskey.indexOf("#style#") != -1) {
			let customStyle  = anskey.split("#style#");
			// store the correct ans
			anskey = customStyle[0];
			// store the custom style
			csStyle = customStyle[1];
		}
		let txtWidth  = [];
		// split the anskey with ,
		let anslen = anskey.split(",");
		// findiing width of the textbox
		AH.selectAll(anslen).forEach((val, j)=> {
			txtWidth[j] = ((anslen[j].length)*10+30);
		});
		// adding information of the tag and textbox
		let textbox = `<input type="text" class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...txtWidth)}px;${csStyle}" />`
		let tag = `<div id="elem${i}" class="fillelement">${textbox}</div>`;
		// replace the cdata
		cdata = cdata.replace(originalData,tag);
	}

	function createNumericbox(data,i,uaXML=false) {
		var userAnswer  = "";
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
		data = data.replace(/%{|}%/g,"");
		// splitting it with |
		data = data.split("|");
		// if the type is codetype then make its value 1 else blank
		let codetype = (data[1] && data[1].trim() == "c") ? "1" : "";
		let anskey = data[0].trim();
		// check for if any styling is given or not
		if (anskey.indexOf("#style#") != -1) {
			let customStyle  = anskey.split("#style#");
			// store the correct ans
			anskey = customStyle[0];
			// store the custom style
			csStyle = customStyle[1];
		}
		let txtWidth  = [];
		// split the anskey with ,
		let anslen = anskey.split(",");
		// findiing width of the textbox
		AH.selectAll(anslen).forEach((elm, j)=> {
			txtWidth[j] = ((anslen[j].length)*10+30);
		});
		// adding information of the tag and textbox
		let textbox = `<input type="number" onKeyDown="if(isNaN(event.key)){var key_arr = [13, 37, 38, 39, 40, 8, 69, 101, 46, 16, 9];if(!key_arr.includes(event.keyCode)) event.preventDefault()} "class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width: ${(Math.max(...txtWidth)+(20))}px;${csStyle}" />`;
		let tag = `<div id="elem${i}" class="fillelement">${textbox}</div>`;
		// replace the cdata
		cdata = cdata.replace(originalData,tag);
	}

	function createSelectBox(data,i,uaXML=false) {
		let originalData = data;
		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g,"");
		// splitting it with |
		data = data.split("|");
		let optionsValue = data[0].trim();
		// splitting with , to extract all the option
		optionsValue = optionsValue.split(",").map(item => item.trim());
		let options = '<option value="">&nbsp;Please Select</option>';

		// iterating through each options
		AH.selectAll(optionsValue).forEach((_this, j)=> {
			// checking correct
			let isCorrect = ((optionsValue[j].indexOf('*') == 0)? "1" : "0");
			// checking default selected value
			let selected = ((optionsValue[j].indexOf('+') == 0)? 'selected="selected"' : "");
			// extracting value of the option
			let innerVal = ((optionsValue[j].indexOf('*') == 0 || optionsValue[j].indexOf('+') == 0)? optionsValue[j].slice(1) : optionsValue[j] );
			let userAnswer = "";
			// checking for the user asn
			if(uaXML) {
				if(uaXML._userAns) {
					selected = '';
					// spliiting with , 
					let sel = uaXML._userAns.split(",");
					// checkimg for the option which is selected by the user
					if(j == sel[0].trim()-1) {
						selected = 'selected="selected"';
						userAnswer = "1"
					}
				}
			}
			// replacing #cm with , & #pl with + in option text
			innerVal = innerVal.replace(/\#cm/gmi,",").replace(/\#pl/gmi,"+");
			// creating options
			options += `<option value="${j}" correctans="${isCorrect}" userans="${userAnswer}" ${selected}>&nbsp;${innerVal}</option>`;
		})
		// creating selectbox
		let selectbox = `<select class="fillintheblank ks" data-role="none">${options}</select>`;
		let tag = `<div id="elem${i}" class="fillelement">${selectbox}</div>`;
		// replace the cdata
		cdata = cdata.replace(originalData,tag);
	}

	function createMultilineBox(data, i, uaXML=false) {
		let userAnswerM  = "";
		// checking for the user ans
		if (uaXML) {
			if (uaXML._userAns) {
				// storing the userans attribute value in useranswer
				userAnswerM = uaXML._userAns;
			}
		}
		let originalData = data;
		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g,"");
		// splitting it with |
		data = data.split("|");
		let anskey = data[0].trim();

		// parse the attr in json
		let attrs = JSON.parse(data[1]);
		// creating textarea
		let multilineBox  = `<textarea class="textarea ks" rows="${attrs.rows}" cols="${attrs.cols}" anskey="${anskey}" value="${userAnswerM}" defaultans="${((attrs.defaultAns) ? attrs.defaultAns: "")}" userans="${userAnswerM}" haskeywords="" hasnotkeywords="" keywordtype="1" autocomplete="off" data-role="none">${userAnswerM}</textarea>`;
		let tag = `<div id="elem${i}" class="fillelement" style="height:auto">${multilineBox}</div>`;
		// replace the cdata
		cdata = cdata.replace(originalData, tag);
	}

	function createDragDrop(data,i,uaXML=false) {
		let originalData = data;
		// removing the %{ , }% symbol from the data  
		data = data.replace(/%{|}%/g,"");
		// splitting it with |
		data = data.split("|");
		let anskey = data[0].trim();
		// if the type is ds then make dragSingle value 1 else 0
		let dragSingle = ((data[1].trim() == "ds")? "1": "0");
		// split the anskey with ,
		let totalDrag = anskey.split(",");
		let dropAns = '';

		// traversing through each option
		AH.selectAll(totalDrag).forEach((elm, j)=> {
			let isDuplicate = false;
			let maxWidth = ((totalDrag[j].length)*10+30);
			let dragAns = totalDrag[j];
			// storing the incorrect values
			let ignore = totalDrag[j].match(/i~|~i/g);
			let tempAns = "";

			if (ignore) {
				// removing ~i,i~ from the dragans
				dragAns = totalDrag[j].replace(/i~|~i/g,"");
			} else {
				dropAns += "ID" + dragID + ",";
				tempAns = "ID" + dragID + ",";
			}
			
			// function for checking duplicate values
			AH.selectAll(CheckDuplicate).forEach((elm, z)=> {
				if (CheckDuplicate[z].ans == dragAns) {
					isDuplicate = true;
					if (!ignore) {
						dropAns =  dropAns.replace(tempAns,"");
						dropAns += CheckDuplicate[z].id+",";
					}
				}
			});

			// if value is not duplicate
			if (isDuplicate == false) {
				CheckDuplicate.push({
					"ans":dragAns,
					"id":"ID"+dragID
				});
			}
			if (isDuplicate == false) dragData += `<div id="ID${dragID}" dragable="true" tabindex="0" class="drag-resize dragable ks" caption="${dragAns.replace(/\#cm/gmi,",").replace(/\"/gmi,"#doublequote#")}" path="//s3.amazonaws.com/jigyaasa_content_static/" drag-single="${dragSingle}" bgcolor="#CCFFCC" style="background-color:#CCFFCC;height:auto;max-width:${maxWidth}px;padding:3px 10px 3px 10px; margin: 2px 2px;" aria-disabled="false">${dragAns.replace(/\#cm/gmi,",")}</div>`;
			 
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
		let drop = '<div id="elem'+i+'" tabindex="0" dropzone="1" class="drag-resize dropable ks" path="//s3.amazonaws.com/jigyaasa_content_static/" anskey="'+dropAns.slice(0,-1)+'" caption="" userans="'+userAnswer+'" droped="'+userAnswer+'" bgcolor="#FFFFCC" style="background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;">'+userAnswer+'</div>';
		// replace the cdata
		cdata = cdata.replace(originalData,drop);
		state.footerStr = true;
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
			correctAnswer(event)
		} else {
			yourAnswer(event);
		}
	}
</script>
	
<div class={xml ? "mx-4 pl-2 pl-md-0": ""}>
	<center>
		<ItemHelper 
			bind:this={smControllerCallback}
			on:setReview = {setReview}
			on:unsetReview = {unsetReview}
			handleReviewClick={handleReview}
			reviewMode={isReview}
		/>
		<div 
			id={containerID}
			class="fillmain {isReview ? 'pe-none' : null}"
			matchtype={state.matchtype}
			multi={state.multi}
			ignoretype={state.ignoretype}
			manual_grade={manual_grade || 0}
			totalcorrectans={state.totalcorrectans}
		>
		
			<div class="string" id="previewArea" style="font-family:'Roboto, sans-serif; font-size: 1em"></div>
			{#if state.showToolbar} 
				<FillInTheBlanksToolbar  
					spanId={state.spanId} 
					divId={state.divId} 
					action={ucFill.fillMath[fillId]} 
					show={toggleToolbar}
				/>
			{/if}
			<div style="color: #b94a48; margin-top: 5px" class="smnotes">
				{#if state.matchtype == "0"}
					*Exact matching is required.
				{:else}
					*Matching is not case sensitive.
				{/if}
			</div>
			<div class="footerStr" style="display: {state.footerStr ? 'block' : 'none'}">
				<div class="arrow-up"></div>
				<center class="dragArea"></center>
			</div>
		</div>
	</center>
</div>
<textarea class="h" id="special_module_user_xml"></textarea>
<style type="text/css">
	/*@import 'layout/themes/bootstrap4/css/bootstrap5Beta1.css'; */
	:global(xmp) {
		display: inline;
	}
	:global([id^="fillmain"]) {
		overflow:hidden;
		max-width:1024px;
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
	:global([id^="fillmain"] .footerStr) {
		position:relative;
		margin-top: 10px;
		background-color: #ccc;
		padding: 15px;
		min-height: 60px;/*100px;*/
	}
	:global([id^="fillmain"] .footerStr .arrow-up) {
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
	:global([id^="fillmain"] .fillelement, [id^="fillmain"] .drag-resize){
		height:30px;
		display:inline-block;
		position:relative;
		min-height: 30px;
		margin: 1px 0 1px 0;
		top: -3px;
	}
	:global(td .drag-resize) {
		top: 0 !important;
	}
	:global(td .fillelement) {
		top: 0px !important;
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
		vertical-align: middle;
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
	:global(.sel) {
		border :2px solid #FF0000!important;
	}
	:global(.bla [id^="fillmain"] .dragable:focus, .bla [id^="fillmain"] .dropable:focus) {
		box-shadow: inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;
		outline: none;
	}

	:global(.highlight_main) {
		border : 1px dashed #000;
	}

	:global(.copiedclr) {
		background-color: #CCC!important;
	}

	:global([id^="fillmain"] select::-ms-expand) {
		margin-left: 2px;
	}
	:global(.fillintheblank) {
		height: 30px;
		padding: 5px 10px;
		font-size: 14px;
		margin-bottom:3px;
		line-height: 20px;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
		color: #555;
		background-color: #FFE;
		vertical-align: middle;
		background-image: none;
		border: 1px solid #ccc;
		font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
		box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
		-webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
		transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
	}

	:global(.fillintheblank:focus) {
		border-color: rgba(82,168,236,0.8);
		outline: 0;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);
		-moz-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);
		box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);
	}
	:global(.correct_incorrect_icon_fill) {
		position:absolute;
		width:17px;
		height:18px;
		right:-4px;
		top:-7px;
		font-size: 17px;
		white-space: normal !important;
		z-index: 9 !important;
	}
	:global(.corr_div) {
		display: none;
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #21a81d;
		color: #ffffff;
		top: 0%;
		padding-top: 4px;
		border-radius: 3px;
		cursor: none !important;
	}
	:global(.auto_height) {
		height:auto!important;
	}
	:global(.prettyprint) {
		display: -ms-grid!important;
	}
</style>