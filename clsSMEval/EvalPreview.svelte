
<script>
	/**
	 *  File Name   : EvalPreview.svelte
	 *  Description : Container for EvalPro Module
	 *	Author      : Pradeep Yadav
	 *  Version     : 1.2
	 *  Package     : svelte_items
	 *  Created     : 11 March 2021
	*/
	import { user } from "../../../store";
	import { onMount, beforeUpdate } from 'svelte';
	import { Button, Dialog } from 'svelte-mui/src';
	import { writable } from 'svelte/store';
	import l from '../src/libs/editorLib/language';
	import { AH, onUserAnsChange } from '../helper/HelperAI.svelte';
	import ItemHelper from '../helper/ItemHelper.svelte';
	import  '../src/libs/codemirror.min.css';
	import '../src/libs/monokai.css';
	import '../src/libs/simplescrollbars.css';

	export let xml;
	export let uxml;
	export let ansStatus;
	export let isReview;
	export let content_guid;
	export let sample_input;
	let location_origin = (location.origin).replace('localhost', 'localhost:3000');
    let evalpro_url = location_origin + '/layout/themes/bootstrap4/svelte_items/evalPro/index.php';
    let user_guid = '';
	let tempGuid;
	let client = {};
	let markerFlag = false;
	let language = "PHP";
	let isPreview = "";
	let xmlArr = [];
	let langArr = [];
	let lang_type = [];
	window.QXML = xml;
	window.uaXML = uxml;
	xml = !(/<SMXML/gi.test(uxml)) || !uxml ? xml : uxml;
	let mode = document.querySelector(".switch-input.switch-input");
	let showPre = "";
	let showPost = "";
	let showEditor = 2;
	//let defaultStartXml = '<SMXML type="24" name="evalpro" language="php">';
	let direction = "";
	//let editorFlag = 1;
	let resetProp = {'psql': 3};
	let editor;
	let preEditor;
	let postEditor;
	let UXML;
	let db_name = "myDBs";
	let is_graph = 0;
	let ignore_error = 0;
	let ignore_formatting = 0;
	let ignore_reset_db = 0;
	let is_pre_tag  = 0;
	let marker = [];
	let state = {};
	let hdd = writable({
		xml: '',
		uxml: '',
		module: '',
		toggle: false,
		snackback: false,
		lang_type: 'php',
		xmlArr: [],
		remediationToggle: false,
		qxml: '',
		titleData: "",
		stemData: "",
		remediationData: "",
		perspective: "Right",
		confirmBoxOpen: false,
		submitCliked: false,
		isSubmit: false,
		goDark: (window.sessionStorage.goDark && window.sessionStorage.goDark == "true" ? true : false)
	});

	const unsubs = hdd.subscribe((items)=> {
		state = items;
	})
	const userunsubs = user.subscribe((user) => {
		user_guid = user.user_guid;
	})
	onMount(()=> {
		lang_type = ["c", "c#", "c++", "java", "javascript", "mssql", "node.js", "php", "psql", "python", "r", "ruby", "sql"];
		db_name = findAttribute(window.QXML, 'db_name');
		is_graph = findAttribute(window.QXML, 'is_graph');
		ignore_error = findAttribute(window.QXML, 'ignore_error');
		ignore_formatting = findAttribute(window.QXML, 'ignore_formatting');
		ignore_reset_db = findAttribute(window.QXML, 'ignore_reset_db');
		is_pre_tag = findAttribute(window.QXML, 'is_pre_tag');
		let smxml = (xml).match(/<smxml(.*?)>/gim);
		let type = smxml.toString().match(/type="(.*?)"|type='(.*?)'/gim);
		type = type[0].replace(/type=|"/gim, '');
		state.module = type;
		//@Sneh: Added for ADA
		AH.bind(document, 'keyup', (e)=> {
			if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 13)) { //ctrl+shift+Enter key
				AH.select(".evalProRunCode").focus()
				AH.select(".evalProRunCode").click();
			} else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 32)) { //ctrl+shift+space key
				AH.select("#editor-footer").focus()
				AH.select("#editor-footer").click();
			}
		});
		didMount();
	})

	beforeUpdate(()=> {
		AH.select("#item_answer", 'addClass', ["mb-xl","multiItem"]);
		AH.select('#answerCheck', 'css', {
			visibility: "hidden",
			display: "none"
		});
		AH.select('#headerTitle', 'html', l.authoring);
		AH.find('#authoringArea', 'form', {action: 'remove'});
		AH.find(document, '#tilteShow,#stemShow,#remediationShow', {action: 'remove'});
		AH.select('#title', 'html', state.titleData);
		AH.select('#stem', 'html', state.stemData);
		AH.select('#remediation', 'html', state.remediationData);
		unRenderPlayer();
		isPreview = 1;
		(state.module == "24") && AH.select('#selectLanguage', 'show');
		showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
		showPost = parseInt(findAttribute(xml, "showpost", "SMXML"));
		showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
		showEditor = parseInt(findAttribute(xml, "showeditor", "SMXML"));
		showEditor = (Number.isNaN(showEditor)) ? 2 : showEditor;
		if (window.QXML) {
			if (isReview) {
				setReview();
			} else {
				unsetReview();
			}
		}
		if (!isReview && editor ) { //re-rendering codeMirror
			window.uaXML = window.uaXML ? window.uaXML : window.QXML;
			UXML = window.uaXML;
			editor.toTextArea();
			if (preEditor) {
				preEditor.toTextArea();
			}
			if (postEditor) {
				postEditor.toTextArea();
			}
			let privXML = stringBetween(UXML, "editor");
			renderCodeMirror();
			editor.setValue(privXML.trim());
		}
		destructor()
	})

	function didMount() {
		// Update the lineSection for first time if lineSection is not available in uxml
		let qxml = !(/<SMXML/gi.test(uxml)) || !uxml ? xml : uxml;
		//To add the lineSection 
		if (qxml.indexOf('lineSection=') === -1) {
			let uXml = qxml.split("<SMXML");
			uXml = "<SMXML " + 'lineSection="0,0,0"' + uXml[1]; 
			AH.select("#special_module_user_xml").value = (uXml);
			window.uaXML = uXml;
		}
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		xml.match(/<SMXML[\s\S]*?<\/SMXML>/gim);
		langArr = xml.match(/<SMXML[\s\S]*?<\/SMXML>/gim);
		if (langArr.length == 1) {
			language = langArr.toString().match(/language="(.*?)"/gim);
			language = language.toString().replace(/language=|"/gi, '');
			xmlArr[language] = xml;
			state.lang_type = language;
			state.xmlArr = xmlArr;
		} else {
			for (let i = 0; i < langArr.length; i++) {
				language = langArr[i].match(/language="(.*?)"/gim);
				language = language.toString().replace(/language=|"/gi, '');
				xmlArr[language] = langArr[i];
			}
			state.xmlArr = xmlArr;
		}

		getChildXml(xmlArr[state.lang_type]); //important
		AH.select('#preview', 'hide');
		state.xml = xml;
		if (typeof(CodeMirror) == "function") {
			renderCodeMirror();
		} else {
			AH.ajax({
                type: "GET",
                url: itemUrl + "src/libs/codemirror.js",
                dataType: "script",
            }).then((data)=> {
                AH.addScript(data, "", {target: "body"});
                renderCodeMirror();
            })
		}

		AH.listen(document, 'click', '#answerCheck', remediationMode.bind(this));
		
		//state.goDark = !state.goDark;
		/*
		AH.ajax({
			type: "GET",
			url: themeUrl+"svelte_items/lib/splitter.js",
			async:false,
			dataType: "script",
			cache: true,
		}).then((data)=> {
				AH.addScript(data, {target: 'body'})
				if (window.frameElement) {
					AH.bind(window, 'resize', function() {
						if (window.innerWidth > 0) {
							//AH.select('#uc-item-test-template').width('100vw').split({orientation:'vertical', limit:300, position:'70%'}, $(".left-test-template"), $(".right-test-template"));
							//AH.select('.evalpro_module').height('100vh').split({orientation:'vertical', limit:300, position:'60%'}, $("#editor-top"), $("#editor-footer"));
						}
					});
				} else {
					//AH.select('#uc-item-test-template').width('100vw').split({orientation:'vertical', limit:300, position:'70%'}, AH.selectAll(".left-test-template"), AH.selectAll(".right-test-template"));
					//AH.select('.evalpro_module').height('100vh').split({orientation:'vertical', limit:300, position:'60%'}, AH.selectAll("#editor-top"), AH.selectAll("#editor-footer"));
				}
				AH.selectAll('.right-test-template', 'removeClass', 'border-left');
				AH.selectAll('#uc-item-test-template .test-layout, .left-test-template', 'addClass','border-bottom');
		});

		*/
	}

	function setReview() {
		if (typeof(CodeMirror) == 'function') {
			editor.setOption("readOnly", true);
			if (showPost > 1) {
				postEditor.setOption("readOnly", true);
			}

			if (showPre > 1) {
				preEditor.setOption("readOnly", true);
			}

			if (showEditor > 1) {
				editor.setOption("readOnly", true);
			}
		}
		//@prabhat: removed the extra ajax call from submit click
		// answerCheckEvalpro();
		submitEvalAns();
	}

	function unsetReview() {
		try {
			if (typeof(CodeMirror) == 'function') {
				editor.setOption("readOnly", false);
				if (showPost > 1) {
					postEditor.setOption("readOnly", false);
				}

				if (showPre > 1) {
					preEditor.setOption("readOnly", false);
				}

				if (showEditor > 1) {
					editor.setOption("readOnly", false);
				}
			}
		} catch (e) {
			console.warn({
				error: e,
				func: 'unsetReview'
			});
		}
	}

	//this code is to enable/disable lines
	function disableLine() {
		let mode = {},
			$usedLine = "",
			language = "",
			disableline = "";
		try {
			$usedLine = editor.lineCount();
			language = state.lang_type;
			disableline = !isReview ? stringBetween(xml, "enableline") : 0;
			var max_enable_line = disableline.split(",");
			max_enable_line = parseInt(max_enable_line[max_enable_line.length-1]);
			if ($usedLine > max_enable_line) {
				for(var i=max_enable_line+1; i <= $usedLine+1; i++ ){
					disableline += "," + i;
				}
			}
		} catch (e) {
			console.log({
				e,
				func: 'disableLine'
			});
		}

		if (typeof mode.review == "undefined") {
			mode.review = 0;
		}

		if ((mode.test == 1 || mode.review || 1) && parseInt(disableline)) {
			let $lineEnable = disableline;
			if ($lineEnable) {
				$lineEnable = $lineEnable.split(",");
				$lineEnable.sort(function(a, b) {
					return a - b
				});
				let $line = [];
				let $readOnly = [];
				for (let j = 0; j < $lineEnable.length; j++) {
					if (!$line[j]) {
						$line[j] = [];
					}

					if (j == 0) {
						$line[j][0] = j;
						$line[j][1] = $lineEnable[j];
					} else {
						$line[j][0] = $line[j - 1][1];
						$line[j][1] = $lineEnable[j];
					}
				}
				let _i = 0;
				for (_i = 0; _i < $lineEnable.length; _i++) {
					for (let $k = $line[_i][0]; $k <= $line[_i][1] - 2; $k++) {
						$k = parseInt($k);
						$readOnly.push($k);
						editor.addLineClass($k, 'wrap', 'bg-light');
					}

					marker.push(editor.markText({
						line: $line[_i][0],
						ch: 0
					}, {
						line: $line[_i][1] - 2
					}, {
						inclusiveRight: true,
						inclusiveLeft: true,
						readOnly: true
					}));
				}

				for (let $l = $line[_i - 1][1]; $l < $usedLine; $l++) {
					$l = parseInt($l);
					$readOnly.push($l);
					editor.addLineClass($l, 'wrap', 'bg-light');
				}
				// hide all bottom codes after enable line
				if (language == 'python' || disableline == 1) {
					editor.markText({
						line: $line[_i - 1][1],
						ch: 0
					}, {
						line: $usedLine
					}, {
						inclusiveRight: true,
						inclusiveLeft: true,
						collapsed: true
					});
					editor.markText({
						line: $line[_i - 1][1],
						ch: 0
					}, {
						line: $line[_i - 1][1] + $usedLine
					}, {
						inclusiveRight: true,
						inclusiveLeft: true,
						readOnly: true
					});

				}

				if (language != 'python') {
					editor.markText({
						line: parseInt($line[_i - 1][1]) - 1,
						ch: 0
					}, {
						line: $usedLine
					}, {
						inclusiveRight: true,
						inclusiveLeft: true,
						collapsed: true
					});
					editor.markText({
						line: $line[_i - 1][1],
						ch: 0
					}, {
						line: $line[_i - 1][1] + $usedLine
					}, {
						inclusiveRight: true,
						inclusiveLeft: true,
						readOnly: true
					});
				}
			}
		}

		markerFlag = false;
	}

	function getChildXml(newXml) {
		xml = newXml;
	}

	function toTitleCase(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function checkLine(line) {
		if (line) {
			markerFlag ? disableLine() : null;
		} else {
			markerFlag = true;
			marker.forEach((marker) => {
				marker.clear();
			});
		}
	}

	function updateOuput() {
		let currentUxml = AH.select("#special_module_user_xml").value;
		AH.select("#output", 'css', {background: "rgb(255, 255, 255)"});
		if (currentUxml) {
			let submit_output = stringBetween(currentUxml, "submitoutput");
			if (submit_output != null) {
				submit_output = submit_output.split("||");
				// Remove this line of code later
				if (submit_output[4] == undefined) {
					submit_output[4] = submit_output[2];
				}
				if (submit_output[0] == "1") {
					AH.select("#output", 'html', '<pre class="compilerPre px-1">'+ submit_output[4] + "</pre>");
					AH.select("#output", 'css', {background: "rgb(255, 240, 240)"});
				} else if (submit_output[4] != "" && submit_output[4] != undefined) {
					if ((submit_output[4]).includes("image_data:")) {
						let image_url = (submit_output[4]).split("image_data:");
						AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
					} else if (submit_output[1] == "2") {
						let formating_class= submit_output['3'] == '1' ? '' : 'd-flex overflow-x-scroll overflow-y-scroll';
						AH.select("#output", 'html', "<pre class=" + formating_class + ">" + submit_output[4] + "</pre>");
					} else if (submit_output[1] == "1") {
						AH.select("#output", 'html', "<pre>" + submit_output[4] + "</pre>");
					} else {
						AH.select("#output", 'html', submit_output[4]);
					}
					AH.select("#output", 'css', {background: "rgb(255, 255, 255)"});
				} else {
					AH.select("#output", 'html', 'Your code didn\'t print anything.');
				}
			}
		}
	}

	function renderCodeMirror() {		
		if (showPre > 0) {
			preEditor = CodeMirror.fromTextArea(document.getElementById("pre-editor"), {
				lineNumbers: true,
				mode: 'text/x-' + state.lang_type,
				styleActiveLine: true,
				autoCloseBrackets: true,
				lineWrapping: true,
				scrollbarStyle: "simple",
				readOnly: showPre > 1 ? false : true,
				matchBrackets: true,
				tabSize: 2,
				gutters: ["CodeMirror-linenumbers", "breakpoints"]
			});
		}
		editor = CodeMirror.fromTextArea(document.getElementById("repl-editor"), {
			lineNumbers: true,
			mode: 'text/x-' + state.lang_type,
			lineWrapping: true,
			styleActiveLine: true,
			autoCloseBrackets: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			tabSize: 2,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});
		if (showPost > 0) {
			postEditor = CodeMirror.fromTextArea(document.getElementById("post-editor"), {
				lineNumbers: true,
				mode: 'text/x-' + state.lang_type,
				styleActiveLine: true,
				autoCloseBrackets: true,
				lineWrapping: true,
				scrollbarStyle: "simple",
				readOnly: showPost > 1 ? false : true,
				matchBrackets: true,
				tabSize: 2,
				gutters: ["CodeMirror-linenumbers", "breakpoints"]
			});
		}
		parseXML();
		disableLine();
		editor.on("change", function(event, changes) {
			saveEvalProAnswer(editor.getValue(), 'editor');
			checkLine(changes);
		});
		editor.on("keyup", function (cm, event) {
			var currentCurrsor = cm.getCursor();
			var isDisabled = cm.findMarksAt(currentCurrsor);
			if (event.keyCode == 13 && isDisabled.length > 0) {	
				console.log("Keyup", isDisabled);
				checkLine();
				setTimeout(()=> {
					CodeMirror.commands.newlineAndIndent(cm, null);
				}, 100);
			}
		});
		if (typeof(preEditor) == "object") {
			preEditor.on("change", function() {
				saveEvalProAnswer(preEditor.getValue(), 'pre');
			});
		}
		if (typeof(postEditor) == "object") {
			postEditor.on("change", function() {
				saveEvalProAnswer(postEditor.getValue(), 'post');
			});
		}
		if (document.getElementById("aXml")) {
			CodeMirror.fromTextArea(document.getElementById("aXml"), {
				lineNumbers: false,
				mode: "application/xml",
				autoCloseBrackets: true,
				lineWrapping: true,
				matchBrackets: true
			});
		}

		editor.setOption("extraKeys", { //Changing Tabs into 4 spaces 
			Tab: function(cm) {
				let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
				cm.replaceSelection(spaces);
			},
			F11: function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			Esc: function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			},
			'Ctrl-Enter': function(cm) {
				//@pradeep: To add New when curros is on Disable Line.
				checkLine();
				setTimeout(()=> {
					CodeMirror.commands.newlineAndIndent(cm, null);
				},500);
			}
		});

		if (isReview) {
			//@prabhat: removed the extra ajax call from submit click
			// answerCheckEvalpro();
			editor.setOption("readOnly", true);
			if (showPost > 1) {
				postEditor.setOption("readOnly", true);
			}

			if (showPre > 1) {
				preEditor.setOption("readOnly", true);
			}

			if (showEditor > 1) {
				editor.setOption("readOnly", true);
			}
		}

		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
		if (client['updateOuput']) {
			clearTimeout(client['updateOuput']);
		}
		client['updateOuput'] = setTimeout(()=> {
			updateOuput();
			let check = window.sessionStorage.goDark;
			if (check == 'true') {
				AH.select("#goDark").checked = true;
				changeTheme();
			}
		}, 500);
	}

	function changeTheme() {
		let check = document.querySelector("#goDark").checked;
		state.goDark = check;
		window.sessionStorage.goDark = check;
		if(check) {
			if (showPre > 0) {
				preEditor.setOption("theme","monokai");
			}
			if (showPost > 0) {
				postEditor.setOption("theme","monokai");
			}
			editor.setOption("theme","monokai");
			AH.find(AH.parent('#goDark'), 'span', {action: 'text', actionData: 'Light Mode'});
		} else {
			if (showPre > 0) {
				preEditor.setOption("theme","default");
			}
			if (showPost > 0) {
				postEditor.setOption("theme","default");
			}
			editor.setOption("theme","default");
			AH.find(AH.parent('#goDark'), 'span', {action: 'text', actionData: 'Dark Mode'});
		}
	}

	function reRender() {
		try {
			editor.toTextArea();
			preEditor && preEditor.toTextArea();
			postEditor && postEditor.toTextArea();
		} catch (error) {
			console.log({
				error,
				func: 'reRender',
				pre: showPre,
				post: showPost,
			});
		}
		renderCodeMirror();
	}
	// Function to reset the db 
	function resetDB() {
		AH.selectAll("#reset_button, #evalProRunCode", 'attr', {disabled: "disabled"});
		AH.select("#output", 'html', '<div class="EvalbgBlue relative" style="top:40%"><div class="Evalloader"><span>{</span><span>}</span></div></div>');
		AH.ajax({
			url: evalpro_url,
			type: 'POST',
			data: {
				'ajax': 1,
				'in_editor': 0,
				'is_svelte' : 1,
				'user_guid': user_guid,
				'db_name': db_name,
				'language': language,
				'resetDB': resetProp[language] || 1,
			},
		}).then((data)=> {
			AH.selectAll("#reset_button, #evalProRunCode", 'attr', {disabled: false});
			AH.select('#output', 'html', "Database reset complete!");
			//$("#evalProRunCode").attr("disabled", false);
			if (window.inNative) {
				window.postMessage("EvalUserXml__");
			}
		}).catch((rqst, err)=> {
			AH.selectAll("#reset_button, #evalProRunCode", 'attr', {disabled: false});
			AH.select("#output", 'html', "Database reset complete!");
			if (window.inNative) {
				window.postMessage("EvalUserXml__");
			}
		});
	}

	function remediationMode() {
		state.remediationToggle = true;
		answerCheckEvalpro();
	}

	function submitEvalAns() {
		let _uxml = AH.select("#special_module_user_xml").value;
		_uxml = _uxml || window.QXML;
		if ( _uxml == undefined || _uxml == 'undefined' || _uxml == '') { 
			return; 
		}
		AH.ajax({
			url: evalpro_url, 
			data: {
				'func': 'check_answer',
				'is_svelte' : 1,
				'special_module_user_xml': _uxml,
				'user_guid': user_guid,
				'content_guid': content_guid
			},
		}).then((response)=> {
			var result = JSON.parse(response);
			var save_result = {};
			save_result.ans =  result?.answer;
			save_result.uXml = result?.new_xml;
			onUserAnsChange(save_result); // To save the answer
			// Need to move this code in DE 
			result = result?.extAnswerStr;
			if (result.indexOf("<submit_output>") != -1 ) {
				result = result.split("<submit_output>");
				var error_detail = result[1].split("||");
				if (error_detail[0] == "1") {
					AH.select("#output", 'html', '<pre class="compilerPre d-flex overflow-x-scroll overflow-y-scroll">'+ error_detail[4] + "</pre>");
					AH.select("#output", 'css', {background: "rgb(255, 240, 240)"});
				} else if (error_detail[4] != "") {
					if ((error_detail[4]).includes("image_data:")) {
						var image_url = (error_detail[4]).split("image_data:");
						AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
					} else if (error_detail[1] == "2") {
						var formating_class= error_detail['3'] == '1' ? '' : 'd-flex overflow-x-scroll overflow-y-scroll';
						AH.select("#output", 'html', "<pre class=" + formating_class + ">" + error_detail[4] + "</pre>");
					} else if (error_detail[1] == "1") {
						AH.select("#output", 'html', "<pre>" + error_detail[4] + "</pre>");
					} else {
						AH.select("#output", 'html', error_detail[4]);
					}
					AH.select("#output", 'css', {background: "rgb(255, 255, 255)"});
				} else {
					AH.select("#output", 'html', "Your code didn\'t print anything.");
				}
				
				// result = result[0];
			}
		});
	}
	function answerCheckEvalpro() {
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
		let _uxml = AH.select("#special_module_user_xml").value;
		_uxml = _uxml || window.QXML;
		AH.ajax({
			url: evalpro_url, 
			data: {
				"uxml": _uxml,
				"ajax": 1,
				'is_svelte' : 1,
				'in_editor': 1,
				'user_guid': user_guid
			},
		}).then((response)=> {
			response = JSON.parse(response);
			if (response['ajaxRes'] == 1) {
				AH.select('#remediationModel', 'html', response['html']);
				setUserAns(response['answer'] == "0" ? false : true);
				state.snackback = true;
			}
		});
	}

	function setUserAns(status) {
		AH.select("#answer"),checked = status;
	}

	function stringBetween(data, str_1, str_2) {
		let regEx;
		if (str_2) {
			regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
		} else {
			regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
		}

		let matchedStr = regEx.exec(data);
		if (matchedStr) {
			return matchedStr[1];
		} else {
			return null;
		}
	}

	function findAttribute(XML, attr, tag = "") {
		let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w+)\".*?>", "gm");
		let matchedStr = regEx.exec(XML);
		if (matchedStr) {
			return matchedStr[1];
		} else {
			return null;
		}
	}

	function unRenderPlayer() {
		AH.empty('#authoringDiv player');
		AH.find('#authoringDiv', 'player', {action: 'removeClass', actionData: 'hidecontent'});
		AH.selectAll('#editor img').forEach((_elm)=> {
			if (!_elm.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_elm.setAttribute('src', _elm.getAttribute('src'));
			}
		});
	}

	function renderPlayer() {
		AH.empty('#authoringDiv player');
		tag_player(AH.select('#authoringDiv'));
		AH.find('#authoringDiv', 'player', {action: 'addClass', actionData: 'hidecontent' });
		AH.selectAll('#editor img').forEach((_elm)=> {
			if (!_elm.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_elm.setAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/' + _elm.getAttribute('src'));
			}
		});
	}

	function updateNativeHeight() {
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
	}

	function runCode(e) {
		if (!state.isSubmit) {
			e.target.disabled = true;
		}
		AH.select("#reset_button", 'attr', {disabled: true});
		let uXML = AH.select("#special_module_user_xml").value;
		AH.select("#output", 'css', {background: "rgb(255, 255, 255)"});
		AH.select("#output", 'html', '<div class="EvalbgBlue relative" style="position: relative; top:50%; transform: translateY(-50%);"><div class="Evalloader"><span>{</span><span>}</span></div></div>');
		let preCode = stringBetween(window.uaXML, "pre");
		let postCode = stringBetween(window.uaXML, "post");
		let code = "";
		if (state.lang_type != 'sql' && state.lang_type != 'psql') {
			code = preCode ? preCode : "";
			code += editor.getValue();
			code += postCode ? postCode : "";
		} else {
			code = preCode ? preCode : "";
			code += editor.getValue();
			if (showPost > 0) {
				code += postCode ? postCode : "";
			}
		}
		//@Pradeep - for native ajax
		var codeData = {
			code: code,
			repltype: state.lang_type,
			stdin: AH.select("#sampleInput").value,
			'run_code': 1,
			'is_svelte' : 1,
			'user_guid': user_guid,
			// 'test_session_unique_id': window.test_session_uid,
			'content_guid': content_guid,
			'db_name': db_name,
			'is_graph' : is_graph,
			'ignore_error' : ignore_error,
			'ignore_reset_db' : ignore_reset_db,
			'is_pre_tag' : is_pre_tag
		}
		if (window.inNative) {
			codeData.in_native = 1;
			codeData.native_user = 'demo@ucertify.com';
			codeData.native_pwd = 'demo123';
			codeData.isBySocial = "false";
		}
		
		AH.ajax({
			type: "POST",
			url: evalpro_url,
			data: codeData,
			dataType: 'json',
		}).then((res)=> {
			res = typeof res != "object" ? JSON.parse(res) : res;
			AH.select("#reset_button", 'attr', {disabled:  false});
			AH.select('#output', 'css', {
				color: "black",
				background: "transparent"
			});
			//AH.select("#evalProRunCode").removeAttribute('disabled');
			e.target.disabled = false;
			if (res.status_message == "Successful") {
				if (res.output) {
					let oup = res.output;
					if (state.lang_type == 'sql' || state.lang_type == 'psql' || state.lang_type == 'c++' || is_pre_tag == '1') {
						AH.select('#output', 'html', '<pre>' + oup + '</pre>');
					} else {
						if (oup.includes("image_data:")) {
							let image_url = oup.split("image_data:");
							AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
						} else if (state.lang_type == "r" || is_graph == '1') {
							let formating_class= ignore_formatting == '1' ? '' : 'd-flex overflow-x-scroll overflow-y-scroll';
							AH.select("#output", 'html', "<pre class=" + formating_class + ">"+ oup + "</pre>");
						} else {
							AH.select('#output', 'html', oup);
						}
					}
					ISSPECIALMODULEUSERXMLCHANGE = 1;
					AH.select("#special_module_user_xml", 'value', uXML);
					window.uaXML = uXML;
					updateNativeHeight();
					if (window.inNative) {
						window.postMessage("EvalUserXml__" + uXML);
					}
				} else {
					AH.select('#output', 'html', "Your code didn't print anything.");
				}
			} else {
				var errorOut = res.output == null ? "There are some issues to execute the code. Please try after a few seconds." : parseLineNumber(res.stderr || res);
				AH.select('#output', 'html', "<pre class='compilerPre'>"+errorOut.trim()+"</pre>");
				AH.select('#output', 'css', {
					color: "#EB3941",
					background: "#FFF0F0"
				});
				if (window.inNative) {
					window.postMessage("EvalUserXml__");
				}
			}
		});
		//@pradeep: check answer status.
		//answerCheckEvalpro();
	}

	function parseLineNumber(errorMsg) {
		let section = {
            pre: (typeof(preEditor) == "object" && preEditor.getValue() != "" ) ? preEditor.lineCount() : 0,
            editor: (typeof(editor) == "object" && editor.getValue() != "") ? editor.lineCount() : 0,
            post: (typeof(postEditor) == "object" && postEditor.getValue() != "") ? postEditor.lineCount() : 0,
		};
		let showpre = showPre;
        let showpost = showPost;
        let showeditor = showEditor;
        switch(state.lang_type) {
            case 'sql':
				let line = errorMsg.split('at line');
                if (line[1]) {
					let lineNo = (line[1].trim()).substring(0, 2);
					lineNo = lineNo.replace(":", "");
					if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= section.pre + section.editor)
                        || (showeditor && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && showeditor && showpost) 
                        ) {
                        lineNo = getSectionLine(+(lineNo), section);
                        if(isNaN(lineNo)) {
							errorMsg = `${line[0]}${line[1].substr(2, line[1].length)}`;
                        } else {
							errorMsg = `${line[0]} at line ${lineNo} ${line[1].substr(2, line[1].length)}`;
                        }
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
					}
				}
				break;
            case 'java': {
				let line = errorMsg.split('Solution.java:');
				if (line[1]) {
					let lineNo = line[1].substr(0, 2);
					lineNo = getSectionLine((lineNo), section);
					lineNo = isNaN(lineNo) ? lineNo.replace(":", "") : lineNo;
					if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= section.pre + section.editor)
                        || (showeditor && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && showeditor && showpost) 
                        ) {
						errorMsg =  errorMsg.replace(/ Line \d*/, ` Line ${lineNo}`);
                        // errorMsg = `Line ${lineNo}: ` + line[1].substr(2,line[1].length);
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                }
            }
            break;
            case 'python' : {
				// In case of exception error <module> tag is coming so remove this from code
				let is_module = errorMsg.indexOf("<module>");
				let is_multiple_line = errorMsg.indexOf("line ", is_module);
				if (is_module > -1 && is_multiple_line > -1) {
                    errorMsg = errorMsg.substring(is_module + ("<module>".length));
				}
				let line = errorMsg.split('line');
				if (line[1]) {
                    line[1] = line[1].trim();
					let lineNo = line[1].match(/\d+/);
					if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= section.pre + section.editor)
                        || (showeditor && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && showeditor && showpost) 
                        ) {
						lineNo = getSectionLine(lineNo, section);
						// previous_line = (previous_line == "") ? line[0] : previous_line;
						errorMsg =  errorMsg.replace(/ line \d*/, ` line ${lineNo}`);
						// previous_line =  previous_line.replace(/ line \d*,/, "");
                        // errorMsg = previous_line + ` Line ${lineNo} ` + line[1].substr(1, line[1].length);
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                } 
            }
            break;
            case 'php': {
                let line = errorMsg.split('in /home/ucertify');
                if(line[1]) {
                    let lineNo = (line[1].split("line"));
                    lineNo = getSectionLine(+lineNo[1], section);
                    if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= section.pre + section.editor)
                        || (showeditor && lineNo > section.pre && lineNo <= section.pre+section.editor)
                        || (showpre && showeditor && showpost) 
                        )  {
                        errorMsg = line[0] + "on line " + lineNo;
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                }
            }
            break;

        }
		return errorMsg;
    }
    
    function getSectionLine(lineNo, section) {
		if(lineNo <= section.pre) {
            //No need here.
            console.log({section:'pre',lineNo});
        } else if (lineNo <= (section.pre + section.editor)) {
            lineNo = lineNo - section.pre;
            console.log({section:'editor',lineNo});
        } else if (lineNo <= (section.pre + section.editor + section.post)) {
            lineNo = lineNo - (section.pre + section.editor);
            console.log({section:'post',lineNo});
        }

        return lineNo;
    }

	// function reset() {
	// 	editor.setValue("");
	// }

	function parseXML(xml) {
		xml = xml ? xml : xml;
		let editorData = stringBetween(xml, "editor");
		editor.setValue(editorData ? editorData.trim() : "");

		let preData = stringBetween(xml, "pre");
		(typeof(preEditor) == "object" ? preEditor.setValue(preData ? preData.trim() : "") : true);

		let postData = stringBetween(xml, "post");
		(typeof(postEditor) == "object" ? postEditor.setValue(postData ? postData.trim() : "") : true);
		
		changeDirection(null, null, "Right");
		let sample = sample_input.replace(/\|.*/g, "");
		let submit_output = stringBetween(xml, "submitoutput");
		if (submit_output != "" && submit_output != null && submit_output != 'undefined') {
			submit_output = submit_output.split("||");
			sample = submit_output[2];
		}
		sample = (/\{|\[|\(/g).test(sample) ? sample.replace(/\|.+/g, "") : sample.replace(/\|.+/g, "").replace(/\,/g, "\n");
		if (sample.indexOf('__sep__')) {
			sample = sample.replace(/__sep__/g, "\n");
		}
		document.querySelector("#sampleInput").value = sample;
		if (state.lang_type == 'sql' || state.lang_type == 'psql') {
			document.querySelector("#sampleInput").value = "";
		}
		
		return editorData;
	}

	function changeDirection(event, index, value) {
		direction = value ? value : "Right";
		state.perspective = direction;
		let code = document.querySelector("#editor-top");
		let run = document.querySelector("#editor-footer");
		let editor_div = document.querySelector("#code-editor");
		run.style.cssText = "width:39.74%;min-height:120px;height:585px; padding-left: 0; padding-right: 0;";
		AH.select('#output' , 'css', {minHeight: "160px"});
		AH.select('#testcase' , 'css', {height: "180px"})
		AH.select('#sampleInput' , 'css', {height: "100%"});
		//AH.select('#container', 'removeClass', 'px-2').classList.add(['border-left', 'border-right'])
		AH.find('#container', '#no-main', {action: 'addClass', actionData: 'px-0'});
		
		AH.selectAll('.test_card', 'css', {minWidth: "94%"});
		code.style.cssText = "width:60%;height:calc(100vh - 45px); padding-left: 0; padding-right: 0;";
		if (showPre && showPost && showEditor) {
			AH.selectAll(".pre-div", 'css', {
				maxHeight: "calc(25vh - 23px)",
				height: "calc(25vh - 23px)",
				display: "block",
				overflow: "auto"
			}); //manage pre post here
			AH.selectAll(".replEditor", 'css', {
				minHeight: "calc(50vh - 45px)",
				height: "calc(50vh - 45px)"
			});
		} else if (showPre && showPost) {
			AH.selectAll(".pre-div", 'css', {
				maxHeight: "calc(50vh - 45px)",
				overflow: "auto",
				height: "auto",
				display: "block"
			}); //manage pre post here
			AH.selectAll(".replEditor", 'css', {
				"display": "none"
			});
		} else if (showPre && showEditor) {
			let pre_visible_height = showPre == 1 ? 'auto' : '250px';
			let editor_visible_height = AH.select(".full-editor").clientHeight - AH.select("#pre_div").clientHeight - 106;
			AH.select("#pre_div").style.cssText = `height:${pre_visible_height}; max-height: calc(50vh - 45px);overflow:auto;display:block`; //manage pre post here
			AH.selectAll(".replEditor", 'css', {
				minHeight: "100px",
				height: `${editor_visible_height}`
			});
		} else if (showPost && showEditor) {
			AH.select("#post_div").style.cssText = "min-height:calc(50vh - 45px);height:calc(50vh - 45px);display:block"; //manage pre post here
			AH.select(".replEditor", 'css', {
				minHeight: "calc(50vh - 45px)",
				height: "calc(50vh - 45px)"
			});
		} else if (showPre) {
			AH.select("#pre_div").style.cssText = "min-height:calc(100vh - 90px);height:calc(100vh - 90px);display:block"; //manage pre post here
			AH.selectAll(".replEditor", 'css', {
				display: "none"
			});
		} else if (showPost) {
			AH.select("#post_div").style.cssText = "min-height:calc(100vh - 90px);height:calc(100vh - 90px);display:block"; //manage pre post here
			AH.selectAll(".replEditor", 'css', {
				display: "none"
			});
		} else {
			AH.selectAll(".replEditor", 'css', {
				display: "block"
			});
			AH.selectAll(".replEditor", 'css', {
				minHeight: "350px",
				height: "calc(100vh - 90px)"
			});
		}

		if (showPre < 2 && showPre > 0) {
			preEditor.setOption("readOnly", true);
			AH.select("#pre_div .CodeMirror-scroll").className = "CodeMirror-scroll bg-light"
			AH.selectAll("#pre_div .pre_msg", 'addClass', 'd-block');
			AH.selectAll("#pre_div .pre_msg", 'removeClass', 'd-none');
			AH.select("#pre_div", 'css', {paddingBottom: '20px'});
		} else if (showPre) {
			preEditor.setOption("readOnly", false);
			AH.select("#pre_div .CodeMirror-scroll").className = "CodeMirror-scroll";
			AH.selectAll("#pre_div .pre_msg", 'removeClass', 'd-block')
			AH.selectAll("#pre_div .pre_msg",'addClass', 'd-none');
		}

		if (showPost < 2 && showPost > 0) {
			postEditor.setOption("readOnly", true);
			AH.select("#post_div .CodeMirror-scroll").className = "CodeMirror-scroll bg-light";
			AH.select("#post_div .post_msg", 'addClass', 'd-block')
			AH.select("#post_div .post_msg", 'removeClass', 'd-none');
			AH.select("#post_div", 'css', {paddingTop: '20px'});
		} else if (showPost) {
			postEditor.setOption("readOnly", false);
			AH.select("#post_div .CodeMirror-scroll").className = "CodeMirror-scroll";
			AH.selectAll("#post_div .post_msg", 'removeClass', 'd-block');
			AH.selectAll("#post_div .post_msg", 'addClass', 'd-none');
		};

		switch (value) {
			case 'Left': {
				run.className = "float-left";
				code.className = "float-right";
				break;
			}
			case 'Right': {
				run.className = "float-right";
				code.className = "float-left";
				break;
			}
			default: {
				setTimeout(function() {
					AH.select('#output', 'css', {height: '125px'});
				}, 301)
				code.style.cssText = "margin-bottom: 5px; overflow: auto";
				code.className = null;
				editor_div.style.minHeight = "auto";
				AH.selectAll("#output, #testcase", 'css', {minHeight: "125px"});
				AH.select("#sampleInput", 'css', {height: "100%"});
				run.style.cssText = "";
				run.className = null;
				AH.selectAll('.test_card', 'css', {minWidth: "350px"});
			}
		}
		//Responsive for mobile devices
		if (window.inNative) return true;

		if (window.screen.availWidth < 768) {
			code.style.cssText = "margin-bottom:20px;width:100%";
			run.style.cssText = "width:100%";
			code.className = "";
			run.className = "";
			editor_div.style.minHeight = "199px";
			editor_div.style.maxHeight = "200px";
			AH.select('#output', 'css', {minHeight: "60px"});
			AH.select('#output', 'css', {height: "160px"});
		}

		if (state.lang_type == "sql" || state.lang_type == "psql") {
			document.querySelector("#input").parentElement.style.display = 'none';
			document.querySelector("#output").style.height = 'calc(100vh - 46px)';
		} else {
			AH.selectAll('.output_div', 'addClass', 'border-top-0');
 			AH.selectAll('.input_div', 'addClass', 'border-bottom-0');
 			//$('.editor-footer-div').height('100vh').split({orientation:'horizontal', limit:130, position:'21%'}, $(".input_div"), $(".output_div"));
		}
		//AH.parent(AH.select('.uc-item-test-template:not(.not_in_quizplayer)'), 'body').style.overflow =  'hidden';
	}
	
	function saveEvalProAnswer(code, type) {
		let qxml = !(/<SMXML/gi.test(window.uaXML)) || !window.uaXML ? window.QXML : window.uaXML;
		let prefix = qxml.split(`<${type}>`); // getting part of before tag
		let suffix = qxml.split(`</${type}>`); // getting part og after tag
		//@pradeep: Combining with new code for that tag
		let uXml = prefix[0] + `<${type}>` + code + `</${type}>` + suffix[1];
		
		//To add the lineSection 
		var lineSection = [
            (typeof(preEditor) == "object" && preEditor.getValue() != "" ) ? preEditor.lineCount() : 0,
            (typeof(editor) == "object" && editor.getValue() != "") ? editor.lineCount() : 0,
            (typeof(postEditor) == "object" && postEditor.getValue() != "") ? postEditor.lineCount() : 0,
		];
		lineSection = lineSection.join(",");
		uXml = uXml.replace(/lineSection="[\s\S]*?"/g, 'lineSection="' + lineSection + '"');
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
		ISSPECIALMODULEUSERXMLCHANGE = 1;
		AH.select("#special_module_user_xml",'value', uXml);
		window.uaXML = uXml;
	}

	//Pradeep -
	function destructor() {
		if (tempGuid != window.content_guid) {
			tempGuid = window.content_guid;;
			db_name = findAttribute(window.QXML, 'db_name');
		}
	}
</script>

<div>
	<div id="authoringArea" class="" style="line-height: 20px;">
		<center>
			<ItemHelper 
				on:setReview = {setReview}
				on:unsetReview = {unsetReview}
			/>
		</center>
		<button type="button" class="h h-imp" id="evalRerender" onClick={reRender}></button>
		<div class="row mx-0 evalpro_module position-relative" style="height: calc(100vh - 45px);">
			<div id="editor-top" style="width: 60%; height: calc(100vh - 45px); min-width: 300px; padding-right: 0 !important;" class="float-left px-0">
				<div class="full-editor" style="min-height: inherit;">
					<div 
						class="card card-default rounded-0 " 
						id="resizeable-editor" 
						style="margin: 0, border-radius: 4px 4px 0 0; border-bottom: 0;border-right: 0;font:17px;"
					>
						<div class="card-header px-2 height44 editor-heading d-flex justify-content-between align-items-center py-1" style="padding-top: 11px;">
							<div>
								<span 
									tabIndex="0" 
									on:click={() => {state.confirmBoxOpen = true }} 
									class="icomoon-code s3 mr d-inline-block float-left" 
									data-bs-toggle="tooltip" 
									data-placement="top" 
									title="ADA Info"
								></span>
								<span class="d-inline-block m-t-n-xxs float-left mr">Editor | </span>
								<span tabIndex="0" class="d-inline-block m-t-n-xxs float-left mr">{(state.lang_type) == "php" ? "PHP" : toTitleCase((state.lang_type))}</span>
							</div>
							<div>
								{#if state.lang_type == 'sql' || state.lang_type == 'psql'}
									<button type="button" id="reset_button" onClick={resetDB} class="btn btn-outline-primary mr-2">{l.resetDB}</button>
								{/if}
								<button 
									type="button" 
									class="evalProRunCode btn btn-primary m-l-xxs" 
									on:click={runCode} 
									href="#output" 
									id="evalProRunCode" 
									name="submitcode"
								>{l.run_code}</button>
								<button class="btn border-0 px-0 ml-2" data-toggle="dropdown" >
										<span class="icomoon-menu-2 s3 text-secondary pt-s d-block" aria-label="Three dots dropdown"></span>
								</button>
								<ul class="dropdown-menu dropdown-menu-right">
									<li>
										<label for="goDark" class="dropdown-item mb-0 pointer">
											<input 
												type="checkbox" 
												defaultChecked={state.goDark} 
												on:click={changeTheme} i
												d="goDark" 
												class="position-absolute transparent"
											/>
											<span>Dark Mode</span>
										</label>
									</li>
								</ul>
							</div>
						</div>
						<div 
							class="card-body" 
							id="code-editor" 
							style="overflow: none; border-bottom: 1px solid #dddddd; padding: 0px; min-height: 315px; height: calc(100vh - 45px)"
						>
							<div class="pre-div position-relative" id="pre_div">
								<textarea id='pre-editor' class="d-none" placeholder="pre code" name="pre-editor"></textarea>
								<div 
									class="pre_msg text-center w-100 text-danger font-weight-bold bg-light-danger position-absolute d-none"
									style="bottom: 0; font: 12px;"
								>
									Section above is non-editable. Write your code below.
								</div>	
							</div>
							<div class="replEditor">
								<textarea id='repl-editor' placeholder="Write your function here..." name="repl-editor"></textarea>	
							</div>
							<div class="pre-div position-relative" id="post_div">
								<div 
									class="post_msg text-center w-100 text-danger font-weight-bold bg-light-danger position-absolute d-none"
									style="top: 0;font-size: 12px;"
								>
									Section below is non-editable. Write your code above.
								</div>
								<textarea id='post-editor' class="d-none" placeholder="post code" name="post-editor"></textarea>	
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div tabIndex="0" id="editor-footer" class="float-right px-0" style="width: 40%; min-height: 120px; height: 585px; padding-left: 0 !important; padding-right: 0 !important;">
				<div class="editor-footer-div relative" style="height: calc(100vh - 45px)!important;">
					<div class="card card-default rounded-0 border-right-0 font17 inNativeStyleInput input_div overflow-hidden" style="height: 131.5px;">
						<div tabIndex="0" class="card-header px-2" style="height:47px">
							{l.input}
						</div>
						<div id="input" class="card-body p-0">
							<textarea 
								tabIndex="0" 
								name="sampleInput" 
								class="sampleInput" 
								id="sampleInput" 
								placeholder="Separate input by 'enter' key" 
								style="margin: 0px; width: 100%; height: 100%; padding: 10px; resize: none; outline: none; border: 0px;"></textarea>
						</div>
					</div>
					
					<div class="card card-default rounded-0 border-right-0 font17 inNativeStyleInput output_div overflow-hidden" style="margin-bottom: 0px;">   
						<div tabIndex="0" class="card-header px-2" style="height:44px;">
							{l.output}
						</div>
						<div 
							tabIndex="0" 
							id="output" 
							class="card-body output overflow-auto pb-5 text-dark" 
							style="padding: 10px 10px 25px 10px; height: calc(100vh - 221px);"
						>
							<span tabIndex="0"></span>
						</div>
					</div>
					<div class="card card-default rounded-0 border-right-0 font17" id="test_card" style="display: none">
						<div class="card-header px-2 height44">
							<a data-toggle="tab" id="testcase-tab" class="inputOutput" href="#testcase">{l.testcases}</a>
						</div>
						<div id="testcase" class="card-body in" style="resize: none; overflow: auto; padding: 10px; height: 180px;">
						</div>
					</div>
				</div>
			</div>
		</div>
		<textarea class="h" id="qxml_inp" name="qxml_inp" value={window.QXML} readOnly></textarea>
		<textarea class="h" id="special_module_user_xml"></textarea>
		<input type="hidden" id="ansModeAnswer" value="" />
	</div>
	<Dialog bind:visible={state.confirmBoxOpen} width={545}>
		<div slot="title" style="text-align: left;">
			<div style="">{l.eval_ada_info}</div>
		</div>
		<div style="padding-top: 20px">
			{l.eval_ada1_msg} <br />
			{l.eval_ada2_msg}
		</div>
		<div slot="footer" class="svelteFooter">
			<Button
				unelevated={true}
				color="primary"
				on:click={() => { state.confirmBoxOpen = false }}
			>
				OK
			</Button>
		</div>
	</Dialog>
</div>

<style lang="text/css" global>

	body {
		overflow: hidden!important;
		position: fixed;
		width: 100%;
	}
	:global(.split_container .left_pane, .split_container .panel) {
		padding: 0!important;
	}
	:global(.pb-5, .py-5) {
		padding-bottom: 3rem!important;
	}
	:global(.CodeMirror) {
		font-family: Monaco, monospace, "Courier New", Courier, Arial !important;
		word-spacing: 3px !important;
	}
	:global(.compilerPre) {
		background: 0 0;
		font-size: 15px!important;
		border: none;
		color: red;
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>