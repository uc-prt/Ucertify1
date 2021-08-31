<script>
/**
 *  File Name   : FillInTheBlanks.svelte
 *  Description : Container for all Fill In The Blanks Authoring Module
 *	Author      : Pradeep Yadav
	*  Version     : 1.0
	*  Package     : svelte_items
	*  Last update : 21 Jan 2021
	*  Last updated by : Pradeep Yadav
	*/
	import { AH, XMLToJSON } from '../helper/HelperAI.svelte';
	import { Button, Dialog, Checkbox, Snackbar } from 'svelte-mui/src';
	import { writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	export let xml;
	export let editorState;
	export let l;
	export let getChildXml;
	// variable declararion
	let cmTime = {};
	let math_eq_count = 0;
	let multiline_count = 0;
	let drag_drop_count = 0;
	let drop_down_count = 0;
	window.spanCounter = 0;
	window.currentId = "";
	window.currentInp = "";
	let timer = {};
	let replaceCharacters = {'&apos;': '#apos#'};
	let message = "";
	let state = {};
	let dragSingle = false;
	let hdd = writable({
		snackback:false,
		matchtype:"",
		ignoretype:"",
		open:false,
		settingmenuopen:false,
		fillInTheBlanksChoice:1,
		multi:"",
		valueMultiple:[],
		codetype:false,
		numeric:false,
		customStyle:false,
		customStyleData: "",
		input1: "",
		fillMultiAttr: {},
		fillDropDown:[
				{
					value:"",
					id:"0",
					checked:""	
				}
			],
		fillDragDrop:[
			{
				value:"",
				id:"0",
				checked:"checked"		
			}
		],
		fillMultiLine:[
			{
				value:"",
				id:"0"	
			}
		],
		fillEquation:[
			{
				value:"",
				id:"0"	
			}
		],
		anchorEl: null,
		case_sensetive:false,
		ignore_spcl_char:false,
		multisetting:false,
	})

	const unsubscribe = hdd.subscribe((items)=> {
		state = items;
	});

	// this function loaded before the rendering and check that it has xml or not . If it has then calls the reverseXml function.
	onMount(()=> {
		didMount();
		// for handling the error
		try {
			// checking if there is any xml in the xml props
			if (xml) {
				AH.select('#authoringLoadComponent').focus();
				// updates the cdata
				reverseXml();
			}
		} catch(e) {
			console.log({Error: e, File:"FillInTheBlanks", Line:"116"});
		}
		// used to show the tooltip
		// $(document).ready(function() {
		// 	$('[data-bs-toggle="tooltip"]').tooltip(); 
		// });
	})

	onDestroy(()=> {
		tinymce.remove('.tinymce-editor-res');
	})

	// this function is responsible for loading the module
	function loadModule(loadXml) {
		// Here first xml is converted into the JSON with the function XMLToJSON 
		let newXml = XMLToJSON(loadXml);
		// passing the xml in parsing function which parse the xml
		parseXmlAuthoring(newXml);
	}

	// this function is called to parse the xml initially
	function parseXmlAuthoring(MYXML) {
		// taking data from the xml
		let cdata = MYXML.smxml.text.__cdata;

		// if MYXML.smxml.text._matchtype is 0 then case_sensetive will be true otherwis false
		let case_sensetive = (MYXML.smxml.text._matchtype == 0) ? true : false;
		// if MYXML.smxml.text._ignoretype  is 1 then ignore_spcl_char will be true otherwis false
		let ignore_spcl_char = (MYXML.smxml.text._ignoretype == 1) ? true : false; 
		// if there is in xml multiple=multiple then multisetting value will be true
		let multisetting = (MYXML.smxml.text._multiple == 'multiple') ? true : false; 

		// setting state of the attributes
		state.matchtype = MYXML.smxml.text._matchtype;
		state.ignoretype = (MYXML.smxml.text._ignoretype) ? MYXML.smxml.text._ignoretype : "";
		state.multi = (MYXML.smxml.text._multiple) ? MYXML.smxml.text._multiple : "";
		state.case_sensetive = case_sensetive;
		state.ignore_spcl_char = ignore_spcl_char;
		state.multisetting = multisetting;

		// taking correct ans from the cdata and storing it in variable answerKey
		let answerKey = cdata.match(/%{[\s\S]*?}%/gm);
		let answerType = '';

		// checking if there is any correct ans set
		if (answerKey) {
			// iterating through each answerkey
			answerKey.forEach((v, i)=> {
				let originalKey = answerKey[i];
				let latexKey = "";
				let editMath = "";

				// here fimding the answerType by matching finding the text between | and }%
				answerType = answerKey[i].match(/\|(.*?)}%$/gm);
				// if there is any answerType exists then save it o0therwise its type will be t
				answerType = (answerType) ? answerType[0].replace(/\||}%/gm,'') : 't';
				let innerKey = "";
				let icon = "";
				let type = "";
				// in case of textbox
				if (answerType == "t") {
					type = answerType;
					innerKey = "Textbox";
					icon = "icomoon-insert-template";
				} else if (answerType == "c") {
					// in case  of codeType
					type = answerType;
					innerKey = "Textbox";
					icon = "icomoon-insert-template";
				} else if(answerType == "n") {
					// in case of numeric
					type = "t";
					innerKey = "Numeric";
					icon = "icomoon-insert-template";
				} else if(answerType == "s") {
					// in case of dropdown
					type = answerType;
					innerKey = "Dropdown";
					icon = "icomoon-fill-drop-down";
				} else if(answerType == "d" || answerType == "ds") {
					// in case of drag & drop (d), drag single (ds)
					type = answerType;
					innerKey = "Drag & Drop";
					icon = "icomoon-fill-drag-drop";
				} else if(answerType== "e") {
					// in case of mathmatical expressions
					type = answerType;
					innerKey = "Math";
					// removing the symbol %{ , |e}% from the answerKey
					latexKey = originalKey.replace(/\%\{|\|e\}\%/g,"");
					latexKey = "latex=\""+latexKey+"\"";
					editMath = "editMath";
					icon = "icomoon-insert-template";
				}else if(answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
					// in case of multiline
					type = "m";
					innerKey = "Multiline";
					icon = "icomoon-insert-template";
				}
				let regex = new RegExp("(?=[^'])"+RegExp.quote(originalKey)+"(?=[^'])","gmi"); //@updesh  added for more than one same originalKey value
				// convert &apos; with #apos#
				originalKey = replaceCharactersFunc(originalKey, replaceCharacters, "reverse");
				cdata = cdata.replace(regex,"<span id=\"latexSpan"+(++window.spanCounter)+"\" "+latexKey+" type='"+type+"' class='alert alert-info editFill "+editMath+"' originalKey='"+originalKey+"' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='"+icon+"'></i>"+innerKey+"</span>");
			});
		}
		// added into the authoring section
		AH.select("#fillAuthor").innerHTML = cdata;
	}

	// this function responsible for removing special character in the html
	function htmlSpecialChars(data) {
		// find all the opening and closing tag
		let tags = data.match(/<[^>]*>/gm);
		let tag = '';
		// if match found
		if (tags) {
			// itterating through the length
			for (let i=0;i < tags.length;i++) {
				//Checking table and converting < , > symbol with &lt; & &gt; respectively
				if(!tags[i].match(/<thead|<\/thead|<tbody|<\/tbody|<th|<\/th|<td|<\/td|<tr|<\/tr|<table|<\/table|<span|<\/span|<caption>|<\/caption>|<br>|<i|<\/i/gm)) {
					tag = tags[i];
					tags[i] = tags[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
					data = data.replace(tag,tags[i]);
				}
			}
		}
		// returning the converted data
		return data;
	}

	// this function is opposite of htmlSpecialChars function i.e., change the html entities back to html symbol
	function reverseHtmlSpecialChars(data) {
		// for matching the text start with &lt; & end with &gt;
		let tags = data.match(/&lt;([\s\S]*?)&gt;/gm);
		let tag = '';
		// if match found
		if (tags) {
			for(let i=0; i<tags.length; i++) {
					tag = tags[i];
					// replace &lt; & &gt; with < & > 
					tags[i] = tags[i].replace(/&lt;/g, "<").replace(/&gt;/g, ">");
					data = data.replace(tag, tags[i]);
			}
		}
		// retrun the converted data
		return data;
	}

	// this function updates the xml
	function reverseXml() {
		// get the content of the authoring area (.fillAuthor) with tinyMCE Plugin 
		let data = tinyMCE.activeEditor.getContent({format: 'raw'});
		// reverse the html special char
		data = reverseHtmlSpecialChars(data);
		// replacing the html entity of &quot; & &nbsp;
		data  = data.replace(/&quot;/g,'"').replace(/&nbsp;/g,' ');
		// finding the data with span tag
		let arr = data.match(/<span([\s\S]*?)>([\s\S]*?)<\/span>/gi);
		// if match found
		if (arr) {
			for(let i=0;i<arr.length;i++) {
				// finding the attribute originalkey and its value
				let originalkey = arr[i].match(/originalkey="%([\s\S]*?)%"/g);
				// if match found
				if(originalkey) {
					// extracting the value of the originalkey attribute
					originalkey = originalkey.toString().replace(/originalkey=/g,'').replace(/"%|%"/g,'%');
					data = data.replace(arr[i],originalkey);
				}
			}
		}
		// convert #apos# with &apos;
		data = replaceCharactersFunc(data, replaceCharacters);
		// converting the #pipe into the html entities
		(data) ? data = data.replace(/#pipe/g,"&#124;"): null;
		// updating the xml
		let xml  = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="'+state.matchtype+'" ignoretype="'+state.ignoretype+'" multiple="'+state.multi+'" ><!--[CDATA['+data+']]--></text></smxml>';
		// update and store the xml using the function getChildXml
		getChildXml(xml);
	}

	// this function loaded just after rendering
	function didMount() {
		initEditor();
		// calls just after rendering , and initiallizes the tinyMCE Plugin and its events

		// binding event with the fillAuthor
		AH.bind("#fillAuthor", "keyup", reverseXml.bind(this) );
		AH.bind("#fillAuthor", "mouseup", reverseXml.bind(this) );
		AH.bind("#fillAuthor", "change", reverseXml.bind(this) );

		// binding event on the response box "click touchstart"
		AH.listen(document, "click", ".editFill", (_this, event)=> {
			let key = _this.getAttribute("originalKey");
			// convert #apos# with &apos;
			key = replaceCharactersFunc(key, replaceCharacters);
			// if type is textbox or codetype
			if(_this.getAttribute("type") == "t" || _this.getAttribute("type") == "c") {
				// for filling the value when dialog is open
				editTextbox(key);
			} else if(_this.getAttribute("type") == "e") {
				// if the type is mathmetical expressions
				editMathbox(key); // for filling the value when dialog is open
			} else if(_this.getAttribute("type") == "d" || _this.getAttribute("type") == "ds") {
				// if the type is drag & drop or drag single
				editDragDrop(key);
			} else if(_this.getAttribute("type") == "s") {
				// for the dropdown
				editSelectbox(key);
			} else if(_this.getAttribute("type") == "m") {
				// for the multiline
				editMultiline(key);
			}
		})
		// for setting the current state of the item
		setFillType(editorState.itemXML);
		// for loading the moduke
		loadModule(xml)
		cmTime = {};
		AH.listen(document, 'touchstart', '#fillAuthor', ()=> {
			cmTime.s = new Date().getTime();
		})
		AH.listen(document, 'touchend', '#fillAuthor', ()=> {
			cmTime.e  = new Date().getTime() - cmTime.s;
			if (cmTime.e/1000>1) {
				handleOpen();	
				cmTime = {};
			}
		});
		AH.listen(document, 'keydown', '.drop_down_delete, .drag_drop_delete, .mathematical_delete, .latexEditButton', (_this, event)=> {
			if ((event.keyCode == 13 || event.which == 13)) {
				// click the element which currently get the focus and enter key is down
				_this.click();
			}
		});
	}

	// This function responsible for setting the state for the fillInTheBlanksChoice
	function setFillType(type) {
		switch(type) {
			case "editor_item_1.xml" :
				// for mathemetcial expression
				state.fillInTheBlanksChoice = 6;
				break;
			case "editor_item_5.xml" :
				// for textbox
				state.fillInTheBlanksChoice = 1;
				break;
			case "editor_item_7.xml" :
				// for drag & drop , drag single
				state.fillInTheBlanksChoice = 3;
				break;
			case "editor_item_6.xml" :
				// for dropdown
				state.fillInTheBlanksChoice = 2;
				break;
			case "editor_item_3.xml" :
				// for multiline
				state.fillInTheBlanksChoice = 5;
				break;
		}
	}

	// calls just after rendering , and initiallizes the tinyMCE Plugin and its events
	function initEditor() {
		AH.listen(document, "click", ".editMath", (_this, e)=> {
			window.currentId = _this.getAttribute('id');
		});
		tinyMCE.PluginManager.add('res', function(editor, url) {
			editor.addMenuItem('resp', {
				text:l.add_response,
				id:'addToken',
				onclick: ()=> {
					handleOpen();
				},
				context: 'insert',
				prependToContext: true
			});
		});
		tinymce.PluginManager.load('equationeditor', themeUrl+'svelte_items/tinymce/plugins/equationeditor/plugin.min.js');
		tinymce.init({
			selector: '.tinymce-editor-res',
			inline: true,
			theme: 'modern',
			skin:'skin02',
			min_width:100,
			resize:true,
			menubar:false,
			toolbar: true,
			elementpath: false,
			statusbar: false,
			force_br_newlines : true,
			remove_trailing_brs: true,
			forced_root_block : false,
			extended_valid_elements:'span[onClick|contentEditable]',
			valid_elements : "*[*]",
			fixed_toolbar_container:'#toolbar_container',
			extended_valid_elements : 'uc:syntax,uc:ref',
			custom_elements : 'uc:syntax,~uc:ref',
			setup : function(editor) { 
				editor.addButton('tabl', {
					text: 'Table',
					onclick: function() {
						createTableHtml();	
						AH.listen('.modal_items_fill','click', '.item_int_fill', (_this, event)=> {
							createTables(_this, editor, tinyMCE);
						});
					}
				});
				editor.addButton('custom-alignleft', {
					icon:"alignleft",
					onclick:function() {
						if( tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == tinyMCE.activeEditor.selection.getNode().innerHTML) {
							if(tinyMCE.activeEditor.selection.getNode().classList.contains("ebook_item_text")) {
								AH.showmsg(l.align_content_message);
							} else {
								editor.execCommand('mceToggleFormat', false, 'alignleft');
							}
						} else {
							AH.showmsg(l.align_content_message);
						}
					}
				});
				editor.addButton('custom-aligncenter', {
					icon:"aligncenter",
					onclick:function() {
						if ( tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == tinyMCE.activeEditor.selection.getNode().innerHTML) {
							if (tinyMCE.activeEditor.selection.getNode().classList.contains("ebook_item_text")) {
								AH.showmsg(l.align_content_message);
							} else {
								editor.execCommand('mceToggleFormat', false, 'aligncenter');
							}
						} else {
							AH.showmsg(l.align_content_message);
						}
					}
				});
				editor.addButton('custom-alignright', {
					icon:"alignright",
					onclick:function() {
						if ( tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == tinyMCE.activeEditor.selection.getNode().innerHTML) {
							if (tinyMCE.activeEditor.selection.getNode().classList.contains("ebook_item_text")) {
								AH.showmsg(l.align_content_message);
							} else {
								editor.execCommand('mceToggleFormat', false, 'alignright');
							}
						} else {
							AH.showmsg(l.align_content_message);
						}
					}
				});
				editor.on('change', function(e) {
					e.target.focus(); // shifting focus first to node.
					timer['tinyChange'] && clearTimeout(timer['tinyChange']);
					timer['tinyChange'] = setTimeout(function() {
						if (e.target.id == tinyMCE.activeEditor.id) {
							reverseXml();
						} else {
							console.warn({
								Error : "Please click first on table", 
								target: e.target.id,
								active: tinyMCE.activeEditor.id
							});
							AH.showmsg("Please click the table first then manipulate.");
						}
					},500);
				});
				editor.on('mouseup', function() {
					tinymce.activeEditor.execCommand('mceDirectionLTR');
					window.selecteddata = tinymce.activeEditor.selection.getContent();
				});
			},
			plugins: [
				"lists link image charmap print preview anchor",
				"searchreplace code fullscreen",
				"insertdatetime media table contextmenu paste res equationeditor "
			],
			content_css: themeUrl+'svelte_items/src/libs/mathquill.css',
			toolbar: [
				' bold italic underline | equationeditor | tabl | custom-alignleft custom-aligncenter custom-alignright '
			],
			contextmenu:"resp",
			paste_as_text: true
		});
	}

	function createTableHtml() {
		AH.selectAll('.modal_items_fill', 'html', ' ');
		let o = interactive_item[0].table; 
		Object.keys(o).forEach((key)=> {
			let item = o[key];
			if (item.hide != true) {
				AH.insert('.modal_items_fill', `<div id="${item.label}" data-html="${item.html}" data-type="${key}" class="${key} item_int_fill thumbnail btn col-sm-5" style="max-width:100%;height:130px;background-image:url(${item.default_image});background-size:contain;background-position:center;background-repeat:no-repeat;overflow:hidden;"><div class="item_labelClass">${item.label}</div></div>`, 'beforeend');
			}
		});
		AH.getBS("#items_list_fill", 'Modal').show();
	}

	function createTables(_this, editor, tinyMCE) {
		let table_html = _this.getAttribute('data-html');
		let tab_html = ""; 
		tab_html = table_html.replace("<div class='ebook_item_text'>", " ").replace("</div>"," ");
		editor.focus();
		tinyMCE.activeEditor.execCommand("mceInsertContent", false, tab_html);
		AH.getBS("#items_list_fill",'Modal').hide();
	}

	// function is responsible for adding the event NOT IN USE @pradeep_sir Please verify
	function addEvent (node,eventName,func) {
		if ("undefined" == typeof node || null == node) {              
		} else {
			if (!node.ownerDocument.addEventListener && node.ownerDocument.attachEvent) {   
				node.attachEvent('on' + eventName, func);
			} else node.addEventListener(eventName,func,false);
		}
	}

	// this function change the value of the attribute matchtype, ignoretype and multiple in xml
	function storeAttr() {
		state.matchtype = "1";
		state.ignoretype = "0";
		state.multi = "";
		for (let i=0;i < state.valueMultiple.length; i++) {
			if (state.valueMultiple[i] == "1") {
				state.matchtype = "0";
				break;
			}
		}
		for (let i=0;i < state.valueMultiple.length; i++) {
			if (state.valueMultiple[i] == "2") {
				state.ignoretype = "1";
				break;
			}
		}
		for (let i=0;i<state.valueMultiple.length;i++) {
			if (state.valueMultiple[i] == "3") {
				state.multi = "multiple";
				break;
			}
		}
		AH.select("#fillAuthor").focus();
		// updating the cdata 
		reverseXml(); 
	}

	/*
	** These function responsible for adding the options
	*/
	function addDropDownOption() {
		drop_down_count++;
		let tempArr = state.fillDropDown;
		tempArr.push({
			value:"",
			id: drop_down_count,
			checked:""
		});
		state.fillDropDown = tempArr;
	}

	function addDragDropOption() {
		drag_drop_count++;
		let tempArr = state.fillDragDrop;
		tempArr.push({
			value:"",
			id:drag_drop_count,
			checked:"checked"
		});
		state.fillDragDrop = tempArr;
	}

	function addMultiLineOption() {
		multiline_count++;
		let tempArr = state.fillMultiLine;
		tempArr.push({
			value:"",
			id:multiline_count
		});
		state.fillMultiLine = tempArr;
	}

	function addMathEquation() {	
		math_eq_count++;
		//let tempArr = state.fillEquation;
		let tempArr = {
			value:"",
			id:math_eq_count
		};
		state.fillEquation = [...state.fillEquation, tempArr];
	}
	/*---------End of the function-------------*/

	// for updating the dialog
	function updateDialog (getValue) {
		state.fillInTheBlanksChoice = getValue;	
	}

	function handleOpen () {
		/*Open Response Dialog Box*/
		state.open = true;
		state.codetype = false;
		state.numeric = false;
	}

	// for handling cancel button
	function handleClose () {
		/*Unset editFlag for textbox*/
		if (state.fillInTheBlanksChoice == 1) {
		
		}
		/*END*/

		/*Restore default dropdown option*/
		if (state.fillInTheBlanksChoice == 2) {
			state.fillDropDown = [];
			state.fillDropDown.push({
				value:"",
				id:"",
				checked:""
			});
		}
		/*END*/

		/*Restore Default Drag Drop Option*/
		if (state.fillInTheBlanksChoice == 3) {
			state.fillDragDrop = [];
			state.fillDragDrop.push({
				value:"",
				id:"",
				checked:"checked"
			});
		}
		/*END*/

		/*Restore Default MultiLine Option*/
		if (state.fillInTheBlanksChoice == 5) {
			state.fillMultiLine = [];
			state.fillMultiLine.push({
				value:"",
				id:""
			});
		}
		/*END*/

		/*Restore Default MathEquation Option*/
		if (state.fillInTheBlanksChoice == 6) {
			window.currentId = null;
			state.fillEquation = [{
				value:"a+b",
				id:"0"
			}];
		}
		/*END*/

		state.open = false; /*Open Response Dialog*/
	}

	/*
	** These function reponsible for entering details when the response box is clicked
	*/
	function editTextbox(key) {
		// removing the symbol '%{' & '}%' in the key 
		key = key.replace(/%{|}%/g,"");
		key = key.split("|");
		// store the split key 0 index which contains the ans of that textbox
		let ans = key[0].trim();
		// extracting ans_type
		let ans_type = ((key[1])?key[1].trim():"");

		// setting state 
		state.codetype = ((ans_type == "c") ? true : false);
		state.numeric = ((ans_type == "n") ? true : false );
		state.customStyle = ((ans.indexOf("#style#") != -1) ? true : false);
		state.fillInTheBlanksChoice = 1;
		state.open = true;

		// if there is #style# found that means if there is styling given then 
		if (ans.indexOf("#style#") != -1) {
			let customStyle  = ans.split("#style#");
			// for filling the style value in the style textbox
			//AH.select("#responseDialog #customStyleText").value = customStyle[1];
			state.customStyleData = customStyle[1];
			// for filling the correct ans
			//AH.select("#input1").value = customStyle[0];
			state.input1 = customStyle[0];
		} else {
			// if styling not given then ans will contain the correct ans
			//AH.select("#input1").value = ans;
			state.input1 = ans;
		}
		
	}

	function editMathbox(key) {
		state.fillEquation = [];
		// removing the %{,}% symbol from the key
		key = key.replace(/%{|}%/g,"");
		// splitting the key on pipe symbol
		key = key.split("|");
		// contain the ans
		let ans = key[0].trim();
		let anskey = ans.split("##")
		// getting ans_type
		let ans_type = ((key[1])?key[1].trim():"");
		// open thr dialog
		state.customStyle = (ans.indexOf("#style#") != -1) ? true : false;
		state.fillInTheBlanksChoice = 6;
		state.open = true;
		let tempEqArr = {};
		let latexEdit = {};

		if (ans.indexOf("#style#") != -1) {
			let customStyle  = ans.split("#style#")
			AH.select("#responseDialog #customStyleText").value = customStyle[1];
			AH.select("#input"+i).value = customStyle[0];
		} else {
			for (let i = 0; i <= anskey.length-1; i++) {
				latexEdit[i] = anskey[i];
				tempEqArr = {
					value: anskey[i],
					id: i
				};
			}
			state.fillEquation = [...state.fillEquation, tempEqArr];
			state.latexEditData = latexEdit;
		}		
	}

	function editSelectbox(key) {
		// removing the %{,}% symbol from the key
		key = key.replace(/%{|}%/g,"");
		// splitting the key on pipe symbol
		key = key.split("|");
		// contain the ans
		let ans = key[0].trim();
		
		state.fillDropDown = [];
		let tempDropDown = [];
		// split with ,
		let allValue = ans.split(",").map(item => item.trim());
		allValue.forEach((v,i)=> {
			let opt = allValue[i];
			let check = "";
			// if found * then check that radio btn
			if (opt.indexOf('*') == 0) {
				check = "checked";
				opt = opt.slice(1);
				AH.select("#responseDialog #correct"+i).checked = true;
			}
			tempDropDown.push({
				value: opt,
				id:"",
				checked: check
			});
			check = "";
		});
		state.fillDropDown = tempDropDown;
		state.fillInTheBlanksChoice = 2;
		state.open = true;
		//this.setState({open:true});
	}

	function editDragDrop(key) {
		// first convert |d with #endpipe and the | with #pipe and then #endpipe with |d again
		key = key.replace(/\|d/g, "#endPipe").replace(/\|/g, "#pipe").replace(/#endPipe/g,"|d");
		// removing the %{,}% symbol from the key
		key = key.replace(/%{|}%/g,"");
		// split with |
		key = key.split("|");
		let ans = key[0].trim();
		// checking for the drag single
		dragSingle = ((key[1].trim() == "ds")? true : false );
		state.fillDragDrop = [];
		let dragDrop = [];
		// spliting the ans with ,
		let allValue = ans.split(",");
		allValue.forEach((v, i)=> {
			let opt = allValue[i];
			let check = "checked";
			// if finding ~i or i~ then unchecked the checkbox
			if (opt.match(/i~|~i/g)) {
				check = "";
				// removing ~i or i~ from the option
				opt = opt.replace(/i~|~i/g,"");
			}
			dragDrop.push({
				value:opt,
				id:"",
				checked:check
			});
			check = "checked";
		});
		state.fillDragDrop = dragDrop;
		state.fillInTheBlanksChoice = 3;
		state.open = true;
	}

	function editMultiline(key) {
		// removing the %{,}% symbol from the key
		key = key.replace(/%{|}%/g,"");
		// spliting the key with |
		key = key.split("|");
		let ans = key[0].trim();
		let attrs = key[1].trim();

		// parsing the attrs into the json
		attrs = JSON.parse(attrs);
	
		state.fillMultiLine = [];
		let tempMulti = [];
		tempMulti.push({
			value:ans,
			id:""
		});
		state.fillMultiLine = tempMulti;
		state.fillMultiAttr = attrs;
		state.fillInTheBlanksChoice = 5;
		state.open = true;

		// putting the values of defaultAns , row and col
		if (attrs.defaultAns) AH.select("#responseDialog #defaultMultiAns").value = attrs.defaultAns;
		AH.select("#responseDialog #rows").value = attrs.rows;
		AH.select("#responseDialog #cols").value = attrs.cols;
	}
	/*----------------------end of the functions----------------------------------------*/

	// responsible for validation
	function showError(err) {
		//AH.select("#responseDialog").effect("shake");
		message = err;
		state.snackback = true;
	}

	// if type = reverse then convert &apos; with #apos# else #apos# with &apos;
	function replaceCharactersFunc(str, replaceCharacters, type) {
		for (var i in replaceCharacters) {
			if (type == 'reverse') {
				// convert &apos; with #apos#
				str = str.replace(new RegExp(i, 'g'), replaceCharacters[i]);
			} else { 
				// convert #apos# with &apos;
				str = str.replace(new RegExp(replaceCharacters[i], 'g'), i);
			}
		}
		return str;
	}

	// function calls when the done button is clicked
	function storeAns() {
		let validate = 0;
		switch(state.fillInTheBlanksChoice){
			case 1 : {
				// if type is textbox
				//if(state.fillInTheBlanksChoice == 1) {

					// contain the ans
					let ans = AH.select("#input1").value;
					// contain the setting values
					let codetype = AH.select("#responseDialog #codetype").checked;
					let numeric = AH.select("#responseDialog #numeric").checked;
					let customStyle = AH.select("#responseDialog #customStyle").checked;

					// if customStyle is true add the style in the answer
					if (customStyle == true) {
						ans += "#style#" + AH.select("#responseDialog #customStyleText").value;
					}
					// for codetype or numeric add |c or |n in answer
					if (codetype == true) {
						ans += " |c";
					} else if (numeric == true) {
						ans += " |n";
					}
					// contain the answer					
					var given_ans = ans.includes('|') ? ans.split('|')[0].trim() : ans;

					// function for validation
					if (ans == "") {
						validate = 1;
						showError("All fields are required");
					} else if (!given_ans) {
						validate = 1;
						showError("Please write data for match");
						AH.select("#input1").focus();
					} else if (codetype == true && numeric == true) {
						validate = 1;
						showError("You cannot use codetype and numeric at the same time");
					} else {
						// convert &apos; with #apos#
						let ansnew = replaceCharactersFunc(ans, replaceCharacters, "reverse");

						// add the textbox in the authoring area
						tinyMCE.activeEditor.insertContent("<span type='t' class='alert alert-info editFill' originalKey='%{"+ansnew.trim()+"}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-insert-template align-middle'></i>"+((numeric == true)?"Numeric":"Textbox")+"</span>");
					}
				}
			break;
			case 2: {
				// for dropdown
				//if(this.state.fillInTheBlanksChoice == 2) {
					let a = AH.find("#responseDialog", "[id^=dropDown]", 'all');
					let str = "";
					let anyCorrect = "no";
					let isValue = "yes";
					// traversing throgh the dropdown
					a.forEach((_this)=> {
						// finding correct ans
						let correctAttr = _this.getAttribute('data-correct');
						// cheeck wether the check box is checked or not
						let isCorrect = AH.select(`#responseDialog #${correctAttr}`).checked;
						let ans = _this.value;
						if (ans.trim() == "") {
							isValue = "no";
						} 
						if (isCorrect == true) {
							// if checked then add *
							anyCorrect = "yes";
							str += `*${ans},`;
						} else {
							// otherwsise add the option with ,
							str += ans + ","
						}
					});
					// remove last comma
					str = str.slice(0,-1);

					// validation here
					if (anyCorrect == "no") {
						validate = 1;
						showError("Please select atleast one correct answer");
					} else if(isValue == "no") {
						validate = 1;
						showError("All fields are required");
					} else {
						// convert &apos; with #apos#
						let strnew = replaceCharactersFunc(str, replaceCharacters, "reverse");
						tinyMCE.activeEditor.insertContent("<span type='s' class='alert alert-info editFill' originalKey='%{"+strnew+"|s}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-fill-drop-down align-middle'></i>Dropdown</span>");
					}
				}
			break;
			case 3: {
				// for drag & drop, drag single
				//if(this.state.fillInTheBlanksChoice == 3) {
					// finding all the dragDrop options
					let d = AH.find("#responseDialog", "[id^=dragDrop]", 'all');
					let str = "";
					// check dragSingle is checked or not
					dragSingle = AH.select("#responseDialog #drag_single").checked;
					// if dragSingle is checked then assign the dragType ds else d
					let dragType = ((dragSingle == true) ? "ds" : "d");
					let isValue = "yes";
					let isChecked = false;
					// traversing each dragdrop option
					d.forEach((_this)=> {
						// finding the correct attr
						let correctAttr = _this.getAttribute('data-correct');
						// check for the option is correct or not
						let isCorrect = AH.select(`#responseDialog #${correctAttr}`).checked;
						let ans = _this.value;
						if(ans.trim() == "") isValue = "no";
						if(isCorrect == true) {
							// if correct the n add it with ,
							str += ans + ",";
							isChecked = true;
						} else {
							// if incorrect then add ~i 
							str += ans + "~i,";
						}
					});
					// removing last ,
					str = str.slice(0,-1);

					// validation
					if(!isChecked) {
						validate = 1;
						showError("Please select atleast one correct answer");
					} else if(isValue == "no") {
						validate = 1;
						showError("All fields are required");
					} else {
						// convert &apos; with #apos#
						let strnew = replaceCharactersFunc(str, replaceCharacters, "reverse");
						strnew = strnew.replace(/&#124;/g,"#pipe").replace(/\|/g,"#pipe");
						//add content
						tinyMCE.activeEditor.insertContent("<span type='"+dragType+"' class='alert alert-info editFill' originalKey='%{"+strnew+"|"+dragType+"}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-fill-drag-drop align-middle'></i>Drag & Drop</span>");
					}
				}
			break;
			case 5: {
				// if the type is multiline
				//if(this.state.fillInTheBlanksChoice == 5) {

					// getting all the feild values
					let m = AH.select("#responseDialog #multiLineCorrect").value; // correct answer
					let defaultAns = AH.select("#responseDialog #defaultMultiAns").value; // default ans
					let rows = AH.select("#responseDialog #rows").value; // rows
					let cols = AH.select("#responseDialog #cols").value; // cols
					let opt= `{"defaultAns": "${defaultAns}","rows":"${rows}","cols":"${cols}"}`; // adding values in json format

					// for validation
					if(m == "" || rows == "" || cols == "") {
						validate = 1;
						showError("All fields are required");
					} else if(isNaN(rows)) {
						validate = 1;
						showError("Please fill numeric data only.");
						AH.select("#responseDialog #rows").focus();
					} else if (isNaN(cols)) {
						validate = 1;
						showError("Please fill numeric data only.");
						AH.select("#responseDialog #cols").focus();
					} else {
						// convert &apos; with #apos#
						let optnew = replaceCharactersFunc(opt, replaceCharacters, "reverse");
						tinyMCE.activeEditor.insertContent("<span type='m' class='alert alert-info editFill' originalKey='%{"+m+"|"+optnew+"}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-insert-template align-middle'></i>Multiline</span>");
					}
				}
			break;
			case 6: {
				// for mathemetical expression
				//if(this.state.fillInTheBlanksChoice == 6) {
					let MathArray = [];
					for(let i=0; i<=math_eq_count; i++) {
						if(document.querySelector("#input"+i)) {
							// if any value is blank then change the value of validate to 1
							if (!AH.select("#input"+i).value) {
								validate = 1;
							}
							MathArray.push(AH.select("#input"+i).value);
						}
					}

					let e = MathArray.join("##",math_eq_count);

					// for validation
					if (validate == 0) {
						if (window.currentId) {
							AH.select('#' + window.currentId, 'attr', {latex: e});
							AH.select('#' + window.currentId, 'attr', {originalKey: `%{${e}|e}%`});
							window.currentId = null;
							window.currentInp = null;
						} else {
							tinyMCE.activeEditor.insertContent("<span id=\"latexSpan"+window.spanCounter+"\" type='e' class='alert alert-info editFill editMath' latex='"+e+"' originalKey='%{"+e+"|e}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-insert-template'></i>Math</span>");
						}
					} else {
						showError("All fields are required");
					}
					// tinyMCE.activeEditor.insertContent("<span id=\"latexSpan"+window.spanCounter+"\" type='e' class='alert alert-info editFill editMath' latex='"+e+"' originalKey='%{"+e+"|e}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-insert-template'></i>Math</span>");	
				}
			break;

		}

		// for updating the cdata
		if (validate == 0) {
			reverseXml();
			// close the dialog
			handleClose();
		}
		
	}

	// for removing the drag and drop options
	function removeDragDrop(id) {
		let tempFDD = state.fillDragDrop;
		let len = Object.values(state.fillDragDrop).length;
		if (len != 1) {
			tempFDD.splice(id, 1);
		}	
		state.fillDragDrop = tempFDD;
	}

	// for removing the drop down options
	function removeDropDown(id) {
		AH.hideBsAll('.drop_down_delete', 'Tooltip');
		let tempFDD = state.fillDropDown;
		let len = Object.values(state.fillDropDown).length;
		if (len != 1) {
			tempFDD.splice(id, 1);
		}	
		state.fillDropDown = tempFDD;
	}

	// for removing the math equation options
	function removeMathEquation(id) {
		let len = Object.values(state.fillEquation).length;
		if (len != 1) {
			state.fillEquation = state.fillEquation.filter(curr => curr.id != id);
		}	
	}

	// for adding user response in fib mathametical expression
	function addEditable(i) {
		let txt = AH.select("#input"+i);
		let caretPos   = txt.selectionStart;
		let textAreaTxt = txt.value;
		var txtToAdd  = "user Response";
		txt.value = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
	}
	
	// open the latex dialog
	function latexEdit(i) {
		if (!window.currentId) {
			AH.showmsg("Equation didn't created yet.")
			return;
		}
		state.open = true;//false
	}

	// changes the fillInTheBlanksChoice state when changing dropdown
	function updatedropdown(event) {
		state.fillInTheBlanksChoice = event.target.value;
	};

	// open the setting dialog
	function openSetting() {
		state.settingmenuopen = !state.settingmenuopen;
	}	

	// responsible for handling the reponses on checkbox in setting dialog
	function handleSetting(value, event) {
		if (value == 1) {
			state.case_sensetive = event.target.checked;
		}
		if (value == 2) {
			state.ignore_spcl_char = event.target.checked;
		}
		if (value == 3) {
			state.multisetting = event.target.checked;
		}

		let setting_arr = [];
		
		if (state.case_sensetive == true) {
			setting_arr.push("1");
		}
		if (state.ignore_spcl_char == true) {
			setting_arr.push("2");
		}
		if (state.multisetting == true) {
			setting_arr.push("3");
		}
		state.valueMultiple = setting_arr;
		storeAttr(); 
		//self.forceUpdate();		
	}
</script>
<div>
	<div class="py-2 px-2 text-right" style="background-color:#d9e7fd">
		<span 
			on:click={openSetting} 
			class="icomoon-new-24px-gear-1 s3 text-dark pointer" 
			data-bs-toggle="tooltip" 
			title="Setting"
		></span>
		<div class="modal left_second table_fill fade" id="items_list_fill" role="dialog" style="z-index: 9998!important">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-body modal_items_fill">  
					</div>
				</div>
			</div>
		</div>
	</div>
	<div 
		class="tinymce-editor-res fillAuthor"
		id="fillAuthor" 
		style="height:300px;border:solid 2px #d9e7fd;padding:8px;overflow:auto;outline:none" 
		contentEditable={true}
	>
	</div>
	<Dialog class="remove_right_margin" width="700" bind:visible={state.open} style="background-color:#fff; border-radius: 5px;">
		<h4 class="mt-0 font21">
			<div class="d-flex justify-content-between">
				<div>{l.fill_header}</div>
			</div>
			<div class="left10 position-relative">
				<div class="btn-group mt-2 ml-0">
					<button type="button" class="btn btn-light px-2 {(state.fillInTheBlanksChoice == 1 ? 'active' : '')}" value={1} on:click={updateDialog.bind(this, 1)} >Text</button>
					<button type="button" class="btn btn-light px-2 {(state.fillInTheBlanksChoice == 2 ? 'active' : '')}" value={2} on:click={updateDialog.bind(this, 2)} >Drop downs</button>
					<button type="button" class="btn btn-light px-2 {(state.fillInTheBlanksChoice == 3 ? 'active' : '')}" value={3} on:click={updateDialog.bind(this, 3)} >Drag & drop</button>
					<button type="button" class="btn btn-light px-2 {(state.fillInTheBlanksChoice == 5 ? 'active' : '')}" value={5} on:click={updateDialog.bind(this, 5)} >Multiline</button>
					<button type="button" class="btn btn-light px-2 {(state.fillInTheBlanksChoice == 6 ? 'active' : '')}" value={6} on:click={updateDialog.bind(this, 6)} >Mathematical equations</button>
				</div>
			</div>
		</h4>
		<div id="responseDialog" style="height:320px;overflow-y:auto; padding-right: 20px;">
			{#if state.fillInTheBlanksChoice == 1}
				<div>
					<div class="d-flex justify-content-start height36">
						<Checkbox 	
							checked={state.codetype}
							id="codetype"
							color="primary"
							on:click={()=> {state.codetype = !state.codetype }}
						>
							<span>Code Type</span>
						</Checkbox>
						<Checkbox 	
							checked={state.numeric}
							id="numeric"
							on:click={()=> {state.numeric = !state.numeric }}
							color="primary"
						>
							<span>Numeric</span>
						</Checkbox>
					</div>
					<input			
						id="input1"
						style="margin:5px; width: 99%"
						type={state.numeric ? "number" : "text"}
						placeholder={((AH.select("#input1").innerHTML != "") ? l.fill_text_placeholder:"")}
						class="form-control"
						value="{state.input1}"
					/>
					<div class="d-flex justify-content-start ml-1 height36">
						<Checkbox 	
							checked={state.customStyle}
							id="customStyle"
							on:click={()=> {state.customStyle = !state.customStyle}}
							color="primary"
						>
							<span>Enable Style</span>
						</Checkbox>
					</div>
					<input
						type="text"
						multiline
						id="customStyleText"
						disabled={!state.customStyle}
						rowsMax={4}
						style="width: 99%; margin: 5px;"
						class="form-control ml-1"
						placeholder="Custom Style"
						value="{state.customStyleData}"
					/>
					<div class="text-danger font-weight-bold">* Note:</div>
					<div class="text-danger" style="padding-left:15px">{l.fill_text_help1}</div>
					<div class="text-danger" style="padding-left:15px">{l.fill_text_help2}</div>
				</div>
			{/if}
			{#if state.fillInTheBlanksChoice == 2}
				<div>
					{#each state.fillDropDown as data, i}
						<div key={i} class="d-flex ml-1">
							<div 
								style="
									float: left;
									position: relative;
									top: 10px;
									padding: 4px 8px 2px 0;
									border-radius: 4px;
								"
							>
								<input
									type="radio" 
									id={"correct"+i}
									name="dropdownCorrectAns"
									checked={data.checked} 
									value={data.value} 
								/>
							</div>
							<input
								type="text"
								id={"dropDown"+i}
								style="margin: 5px; left:8px"
								bind:value={data.value}
								placeholder={l.fill_dropdown_placeholder}
								data-correct={"correct" + i}
								class="width10 form-control"
							/>
							<span 
								on:click={removeDropDown.bind(this,i)}  
								class="icomoon-24px-delete-1 text-dark pointer position-relative s3 mt-2 pt-2 drop_down_delete"
								style="height:32px;bottom:1px;"
								data-bs-toggle="tooltip" 
								title="Delete"
								tabIndex="0"
							></span>
						</div>
					{/each}
					<div class="float-left mt-3 ml-1">
						<Button 
							variant="fab" 
							color="primary"
							aria-label="Add"
							on:click={addDropDownOption}
							class="btn btn-outline-primary rounded position-relative bottom0 bg-white shadow-sm float-right"
							style="width: 120px; height: 30px; border: 1px solid #4285f4; color: #4285f4;text-transform: none;"
						>
							Add option
						</Button>
					</div>
					<br />
					<div class="text-danger mt-5 font-weight-bold ml-1">* Note:</div>
					<div class="text-danger ml-1" style="padding-left: 15px">{l.fill_dropdown_help1}</div>
					<div class="text-danger ml-1" style="padding-left: 15px">{l.fill_dropdown_help2}</div>
					<div class="text-danger ml-1" style="padding-left: 15px">{l.fill_dropdown_help3}</div>
				</div>
			{/if}
			{#if state.fillInTheBlanksChoice == 3}
				<div class="ml-1">
					<div style="clear: both" class="mb-3">
						<div class="position-relative float-left rounded" style="top: 8px; padding: 4px 8px 2px 0">
							<input
								type="checkbox" 
								name="dragDropCorrectAns"
								id="drag_single" 
								bind:checked={dragSingle}
							/>
						</div>
						<label for="drag_single" class="font-weight-normal mb-0 form-check-label relative w-75" style="top: 11px; left:5px">{l.drag_single}</label>
					</div>
					{#each state.fillDragDrop as data, i}
						<div key={i} class="d-flex clear-both">
							<div class="position-relative float-left rounded" style="top: 10px;padding: 4px 8px 2px 0">
								<input
									type="checkbox" 
									checked={data.checked}
									name="dragDropCorrectAns"
									id={"correctDrag"+i}
									value={data.value} 
								/>
							</div>
							<input
								type="text"
								id={"dragDrop"+i}
								bind:value={data.value}
								style="margin:5px;left: 8px"
								placeholder={l.fill_dropdown_placeholder}
								class="width10 form-control"
								data-correct={"correctDrag" + i}
							/>
							<span 
								on:click={removeDragDrop.bind(this,i)}  
								class="icomoon-24px-delete-1 text-dark pointer position-relative s3 mt-2 pt-2 drag_drop_delete height32 bottom1"
								data-bs-toggle="tooltip"
								data-bs-placement="top" 
								title="Delete"
								tabIndex="0"
							></span>
						</div>
					{/each}
					<div class="float-left mt-3">
						<Button 
							variant="fab" 
							color="primary"
							mini
							aria-label="Add"
							on:click={addDragDropOption.bind(this)}
							class="btn btn-outline-primary rounded position-relative bg-white shadow-sm float-right bottom0"
							style="width: 120px;border: 1px solid #4285f4; color: #4285f4;text-transform: none; height:30px;"
						>
							Add option
						</Button>
					</div>
					<div class="text-danger mt-5 pt-3 font-weight-bold">* Note:</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_dragdrop_help1}</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_dragdrop_help2}</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_dragdrop_help3}</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_dragdrop_help4}</div>
				</div>
			{/if}
			{#if state.fillInTheBlanksChoice == 4}
				<div><h2>Under Development</h2></div>
			{/if}
			{#if state.fillInTheBlanksChoice == 5}
				<div>
					<div class="d-flex">
						<div style="margin-right: 11px; width: 69%">
							<label class="mb-0 ml-2" for="defaultMultiAns">Default Answer</label>
							<input
								type="text"
								id="defaultMultiAns"
								style="margin:5px;width:100%"
								placeholder={((AH.select("#defaultMultiAns").innerHTML != "") ? l.default_answer : "Default Answer")}
								class="form-control"
								value={state.fillMultiAttr.defaultAns}
							/>
						</div>
						<div>
							<label class="mb-0 ml-2" for="rows">Row</label>
							<input
								id="rows"
								type="number"
								min="1"
								style="margin:5px; width: 100px"					      
								placeholder={((AH.select("#rows").innerHTML != "") ? l.rows : "Rows")}
								class="form-control"
								value={state.fillMultiAttr.rows}
							/>
						</div>
						<div class="mr-sm2">
							<label class="mb-0 ml-2" for="cols">Column</label>
							<input
								id="cols"
								type="number"
								min="1"
								style="margin: 5px; width: 100px"
								placeholder={((AH.select("#cols").innerHTML != "") ? l.cols : "Cols")}
								class="form-control"
								value={state.fillMultiAttr.cols}
							/>
						</div>
					</div>
					{#each state.fillMultiLine as data,i}
						<div key={i}>
							<input
								type="text"
								id="multiLineCorrect"
								multiline
								style="margin: 5px; width: 98%"
								value={data.value}
								placeholder={l.fill_text_placeholder}
								class="form-control"
							/>
						</div>
					{/each}
				</div>
			{/if}
			{#if state.fillInTheBlanksChoice == 6}
				<div>
					{#each state.fillEquation as data, i}
						<div key={i} class="row ml-0 mb-2">
							<div class="col-sm-7 pl-0">
								<input
									type="text"
									id={"input"+i}
									class="form-control latexInp position-relative top3 width-xl1 ml-1"
									bind:value={data.value}
									placeholder={l.fill_text_placeholder}
								/>
							</div>
							<div class="col-sm-3 pt-1">
								<Button 
									variant="fab" 
									color="primary"
									aria-label="Response"
									on:click={addEditable.bind(this,i)}
									class="rounded btn btn-outline-primary top5 position-relative bg-white shadow-sm float-right p-0"
									style="width: 120px; height:30px; text-transform: none; border: 1px solid #4285f4; color: #4285f4;"
								>
									Add response
								</Button>
							</div>
							<div class="col-sm-1 pt-2 position-relative" style="right:15px;">
								<div class="latexEditButton d-inline-block" tabIndex="0" style="height:28px;">
									<span 
										id= {"latexEdit"+i}
										variant="contained" 
										on:click={latexEdit.bind(this,i)}										
										class="icomoon-24px-edit-1 text-dark pointer position-relative s3 bottom1"
										data-bs-toggle="tooltip" 
										data-bs-placement="top" 
										title="Edit"
									>
									</span>
								</div>
							</div>
							<div class="col-sm-1 pt-2 position-relative" style="right:32px;">
								<span 
									on:click={removeMathEquation.bind(this,data.id)}  
									class="icomoon-24px-delete-1 text-dark pointer position-relative s3 mathematical_delete"
									style="height:28px;bottom: 1px;"
									data-bs-toggle="tooltip" 
									data-bs-placement="top" 
									title="Delete"
									tabIndex="0"
								></span>
							</div>
						</div>
					{/each}
					<div class="float-left mt-2 ml-1">
						<Button 
							variant="fab" 
							color="primary"
							aria-label="Add"
							on:click={addMathEquation}
							class="rounded btn btn-outline-primary top5 position-relative bg-white shadow-sm float-right p-0"
							style="width: 120px; height:30px; text-transform: none; border: 1px solid #4285f4; color: #4285f4;"
						>
							+ Add option
						</Button>
					</div>
					<div class="text-danger mt-5 pt-4 font-weight-bold ml-1">* Note:</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_math_help1}</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_math_help2}</div>
					<div class="text-danger" style="padding-left: 15px">{l.fill_math_help3}</div>
				</div>
			{/if}
		</div>
		<div slot="footer" class="svelteFooter">
			<Button
				on:click={handleClose}
				unelevated={true}
				outlined={true}
				class="text-capitalize"
				color="#ccc"
			> {l.cancel} </Button>
			<Button
				on:click={storeAns}
				unelevated={true}
				outlined={true}
				class="text-capitalize"
				color="primary"
			> {l.done} </Button>
		</div>
	</Dialog>
	
	<Dialog class="remove_right_margin" width="600" bind:visible={state.settingmenuopen} style="background-color:#fff; border-radius: 5px;">
		<h4 class="mt-1 font21 mb-4">
			<div class="d-flex justify-content-between">
				<div>Settings</div>
			</div>
		</h4>
		<div>
			<Checkbox 
				checked = {state.case_sensetive}
				on:click={handleSetting.bind(this, "1")}
				color="primary"
			>
				<span>{l.case_sensetive}</span>
			</Checkbox>

			<Checkbox 
				checked = {state.ignore_spcl_char}
				on:click={handleSetting.bind(this, "2")}
				color="primary"
			>
				<span>{l.ignore_spcl_char}</span>
			</Checkbox>

			<Checkbox 
				checked = {state.multisetting}
				on:click={handleSetting.bind(this, "3")}
				color="primary"
			>
				<span>{l.multi}</span>
			</Checkbox>
			<span class="text-danger">
				<b>Note:</b> All the above options are applicable to Fill in the Blanks (with text) and Fill in the Blanks (with multiline).
			</span>
		</div>
		<div slot="footer" class="svelteFooter">
			<Button
				on:click={openSetting}
				color="primary"
				unelevated={true}
				outlined={true}
			>OK</Button>
		</div>
	</Dialog>
	<Snackbar bind:visible={state.snackback} bg="#f44336" bottom={true} timeout={4000} style="position:fixed; bottom:50px;z-index:99999">
		{#if message}
			{message}
		{:else} 
			Some Error occured during this process.
		{/if}
		<span slot="action">
			<Button color="#ff0" on:click={() => (state.snackback = false)}>Close</Button>
		</span>
	</Snackbar>
</div>