<script>
	import { onMount, beforeUpdate, onDestroy } from 'svelte';
	import { Button, Dialog, Checkbox, Snackbar, Textfield } from 'svelte-mui/src';
	import {tag_player} from '../helper/PrepengineFooter.svelte';
	import { writable } from 'svelte/store';
	import { AH } from '../helper/HelperAI.svelte';
	import Loader from '../helper/Loader.svelte';
	import UCLIB from '../src/libs/editorLib/UCLIB';
	import l from '../src/libs/editorLib/language';
	export let setInlineEditor = ()=>{};
	export let editorState;
	export let getChildXml = ()=>{};
	let _module='', type='', version='', user_filter_ans='', qxml='', message="";
	let state = {};
	let hdd = writable({
			xml: '',
			uxml: '',
			title: "",
			defaultValue: "",
			toggle: false,
			snackback: false,
			sequence: '0',
			multicheck: false,
			remediationToggle: false,
			titleData: "",
			stemData: "",
			remediationData : "",
			toggleMode: "",
		});
	let unsubscribe = hdd.subscribe((item)=> {
		state = item;
	});

	onMount(async()=> {
		didMount();
	})

	beforeUpdate(async()=> {
		// check for toggle mode
		if (state.toggleMode != editorState.toggleMode) { 
			state.toggleMode = editorState.toggleMode;
			qxml = (state.xml) ? document.getElementById("authoringFrame").contentWindow.save_data(1, 0, true) : '';
			if (editorState.toggleMode == true) { //Test mode on
				// check for the xml
				if(state.xml) {
					qxml = qxml.toString().replace(/'/gm,"\\x27");
					qxml = qxml.toString().match(/<correct>[\s\S]*?<\/correct>/img);
					qxml = qxml.toString().replace(/\$/g, "#dollar");
					// replace the special corrector in the xml inside the correct tag
					qxml  = state.xml.toString().replace(/<correct>[\s\S]*?<\/correct>/img,qxml.toString());
					qxml = qxml.toString().replace(/#dollar/g, "$");

					if(qxml.match(/<correct>\s*<!\[CDATA\[\s*\]\]>\s*<\/correct>/gmi) && (!state.xml.match(/<correct>\s*<!\[CDATA\[\s*\]\]>\s*<\/correct>/gmi))) {
						qxml = 	state.xml;
					} 
					else {
						state.xml = qxml;
						getChildXml(qxml);	
					}
				} else {
					window.is_review = 0;
				}
				AH.select("#authoringFrame", 'attr', {'data-authoring': '0'});
				AH.select('#headerTitle').innerHTML = l.preview;
				AH.find('#authoringArea', 'form', {action: 'remove'});
				renderPlayer();
				AH.empty('#authoringFrame');
				// updating the qxml 
				let testHtml = '<form method="post" target="authoringFrame" action="'+baseUrl+'sim/?in_editor=1"><input type="hidden" name="first_time" value="1"/><input type="hidden" name="testmode" value="1"/><input type="hidden" name="qxml" value=\''+qxml+'\'/><input type="hidden" name="content_guid" value="0" /></form>';
				AH.insert('#authoringArea',testHtml, 'beforeend');
				state.titleData = AH.select('#title').innerHTML;
				state.stemData = AH.select('#stem').innerHTML;
				state.remediationData = AH.select('#remediation').innerHTML;
				AH.insert(AH.select(AH.empty('#title'), 'hide'), `<div id="tilteShow">${state.titleData}</div>`, 'afterend');
				AH.insert(AH.select(AH.empty('#stem'), 'hide'),`<div id="stemShow">${state.stemData}</div>`, 'afterend');
				AH.insert(AH.select(AH.empty('#remediation'), 'hide'), `<div id="remediationShow">${state.remediationData}</div>`, 'afterend');
				AH.select('#externalInputs', 'hide');
				// submit the form  and send data to sim/index.php
				setTimeout(function() {
					AH.find(document, 'form[target="authoringFrame"]').submit();
					editorState.activator = true;
				}, 200);
			} else { //Authoring Mode.
				if(state.xml) {
					let uxml = document.getElementById("authoringFrame").contentWindow.save_data(0, 0, true);
					if (!uxml.match(/<!\[CDATA\[\s*html=dW5kZWZpbmVk\s*\]\]>/gmi)) {
			  			state.uxml = uxml;
			  		}
					getChildXml(state.xml);
					// get all the details according to th current xml
					var windowHtml = getAuthoringForm(state.xml);
					AH.empty('#authoringFrame');
					AH.find('#authoringArea', 'form', {action: 'remove'});
					AH.insert('#authoringArea', windowHtml,'beforeend');
					// submit the form  and send data to sim/index.php
					setTimeout(function() {
						AH.find(document, 'form[target="authoringFrame"]').submit();
						editorState.activator=true;
					}, 200);
		  		}
		  		AH.select('#headerTitle', 'html', l.authoring);
				AH.select("#authoringFrame", 'attr', {'data-authoring': '1'});
				AH.find(document, '#tilteShow,#stemShow,#remediationShow', {action: 'remove'});
				AH.select('#title', 'html', state.titleData);
				AH.select('#stem', 'html', state.stemData);
				AH.select('#remediation', 'html', state.remediationData);
				AH.selectAll('#title,#stem,#remediation,#externalInputs', 'show');
				unRenderPlayer();
                setInlineEditor("#stem");
                setInlineEditor("#remediation");
			}
		}
	})

	// calls after unmount
	onDestroy(() => {
		AH.select('#preview', 'show');
		editorState.activator = false;
	});

	// calls just after rendering of the function
	function didMount() {
		if (window.inNative) {
			// for getting height in Native
            window.getHeight && window.getHeight();
        }
		setTimeout(function() {
			AH.select('#preview', 'hide');
			state.xml = editorState.xml;
			if(editorState.xml) {
				// get all the details according to th current xml
				var windowHtml = getAuthoringForm(editorState.xml);
				AH.insert('#authoringArea', windowHtml, 'beforeend');
				setTimeout(function() {
					// submit the form getting by getAuthoringForm function
					AH.find(document, 'form[target="authoringFrame"]').submit();
					editorState.activator = true;
				}, 200);
			} else {
				AH.select('#authoringArea', 'hide');	
				editorState.activator = false;
			}
		}, 100);
		AH.listen(document, "click", "#your_ans_filter li", function(_this) {
			if(user_filter_ans == "") {
				user_filter_ans = AH.select('#user_answer').innerHTML;
			}
			filterUserAnswer(_this.textContent.trim().toLowerCase().replace(" ","_"));
		});
		AH.listen(document, 'click', '#answerCheck', remediationMode);
		setTimeout(function() {
			AH.bind('#authoringFrame','load', function() { 
				editorState.activator = false;
	    	});
		}, 200);
		setTimeout(function() {
			let frameHeight =   window.innerHeight - 60;
			if (in_frame == 1) {
				frameHeight = window.innerHeight;
			} 
			AH.select("#authoringFrame", 'attr', {height: frameHeight});
		}, 500);
	}

	// this function returns the form conaining all the details in xml
	function getAuthoringForm(xml) {
		try {
			let _qxml = `<textarea class="h hidden" name="qxml" id="qxml">${xml}</textarea>`;
			let defaultValues = _qxml.match(/<default>[\s\S]*?<\/default>/gmi);
			defaultValues = (defaultValues.toString()) ? defaultValues.toString().replace(/<!\[CDATA\[|\]\]>|<default>|<\/default>/gmi,'').trim() : '';
  			AH.select('#defaultValues').value = defaultValues;
  			xml = xml.match(/<smxml([\s\S]*?)<(.*?)>/gmi);
			xml = xml.toString().replace(/<smxml(.*?)>/img,'');
			_module = xml.match(/<\w+/img);
			_module = _module.toString().replace(/</img,'');
			let newXml = AH.parseHtml(xml);
			AH.select('#externalTitle').value = newXml.getAttribute('title');
			let multicheck = (newXml.getAttribute('multicheck') == 'true') ? true : false;
			state.multicheck = multicheck;
			state.sequence = newXml.getAttribute('sequence');
			type = `<input type="hidden" name="type" value="${newXml.getAttribute('type')}">`;
			version = `<input type="hidden" name="version" value="${newXml.getAttribute('version')}">`;
			multicheck = `<input type="hidden" name="multicheck" value="${state.multicheck}">`;
			let windowHtml = `<form method="post" target="authoringFrame" action="${baseUrl}sim/?in_editor=1"><input type="hidden" name="module" value="${_module}"><input type="hidden" name="title" value=""><input type="hidden" name="sequence" value="${state.sequence}">${type + version + multicheck + _qxml}<input type="hidden" name="autheringmode" value="1"></form>`;
			return windowHtml;
		}
		catch(err) {
			console.log(err);
		}
	}

	// for filtering the user answer
	function filterUserAnswer(filter_type) {
		let user_answer_array = user_filter_ans.split("<br>");
		let correct_answer_string = AH.select('#correct_answer').innerHTML;
		if (filter_type=="only_unique") {
			let uniqueAnswers = [];
			user_answer_array.forEach((el, i)=> {
			    if(AH.inArray(el, uniqueAnswers) === -1) uniqueAnswers.push(el);
			});
			setTimeout(function() {
		    	AH.select('#user_answer', 'html', uniqueAnswers.join("<br>"));
		    }, 1000);
			
		} else if(filter_type=="only_relevant") {
			let releventAnswers = [];
			user_answer_array.forEach(function(el, i){
				if (correct_answer_string.indexOf(el)!=-1) {
					 if (AH.inArray(el, releventAnswers) === -1) releventAnswers.push(el);
				}
			});
			setTimeout(function() {
		    	AH.select('#user_answer', 'html', releventAnswers.join("<br>"));
		    }, 1000);
			
		} else {
			setTimeout(function() {
		    	AH.select('#user_answer', 'html', user_filter_ans);
		    }, 1000);				
		}
	}

	// not found where it is called @pradeep sir please check once
	function toggle() {
			qxml = document.getElementById("authoringFrame").contentWindow.save_data(1, 0, true);
			if(state.toggle == false) { //Test mode on
				qxml = qxml.toString().replace(/'/gm,"\\x27");
				AH.select("#authoringFrame", 'attr', {'data-authoring': '0'});
				qxml = qxml.toString().match(/<correct>[\s\S]*?<\/correct>/img);
				qxml  = state.xml.toString().replace(/<correct>[\s\S]*?<\/correct>/img,qxml.toString());
				if(qxml.match(/<correct>\s*<!\[CDATA\[\s*\]\]>\s*<\/correct>/gmi) && (!state.xml.match(/<correct>\s*<!\[CDATA\[\s*\]\]>\s*<\/correct>/gmi))) {
					qxml = 	state.xml;
				} else {
					state.xml = qxml;
					getChildXml(qxml);	
				}
				AH.find('#authoringArea', 'form').remove();
				renderPlayer();
				AH.empty('#authoringFrame');
				let testHtml = '<form method="post" target="authoringFrame" action="'+baseUrl+'sim/?in_editor=1"><input type="hidden" name="first_time" value="1"/><input type="hidden" name="testmode" value="1"/><input type="hidden" name="qxml" value=\''+qxml+'\'/><input type="hidden" name="content_guid" value="0" /></form>';
				AH.insert('#authoringArea', testHtml, 'beforeend');
				AH.insert(AH.select('#title', 'hide'), `<div id="tilteShow">${AH.select('#title').innerHTML}</div>`, 'afterend');
				AH.insert(AH.select('#stem', 'hide'), `<div id="stemShow">${AH.select('#stem').innerHTML}</div>`, 'afterend');
				AH.insert(AH.select('#remediation', 'hide'), `<div id="remediationShow">${AH.select('#remediation').innerHTML}</div>`, 'afterend');
				AH.select('#externalInputs', 'hide');
				setTimeout(function() {
					AH.find(document, 'form[target="authoringFrame"]').submit();
					editorState.activator = true;
				}, 200);
		} else { //Authoring Mode.
			let uxml = document.getElementById("authoringFrame").contentWindow.save_data(0, 0, true);
			if(!uxml.match(/<!\[CDATA\[\s*html=dW5kZWZpbmVk\s*\]\]>/gmi)) {
	  			state.uxml = uxml;
	  		}
			AH.select("#authoringFrame", 'attr', {'data-authoring': '1'});
			getChildXml(state.xml);
			// get all the details according to th current xml
			var windowHtml = getAuthoringForm(state.xml);
			AH.empty('#authoringFrame');
			AH.find('#authoringArea', 'form', {action: 'remove'});
			AH.insert('#authoringArea', windowHtml, 'beforeend');
			setTimeout(function() {
				// submit the form and send data to sim/index.php
				AH.find(document, 'form[target="authoringFrame"]').submit();
				editorState.activator = true;
			}, 200);
			AH.find(document, '#tilteShow,#stemShow,#remediationShow', {action: 'remove'});
			AH.selectAll('#title,#stem,#remediation,#externalInputs', 'show');
			AH.select('#heading', 'html', 'Authoring');
			unRenderPlayer();
		}
		state.toggle = !state.toggle;
	}

	// calls whenever there is change in sequence and update the xml accordingly
	function handleSequence(event) {
		// getting the selected dropdown value
		let value = event.target.value;
		state.sequence = value;
		// updating the xml
		state.xml = state.xml.toString().replace(/sequence="(.*?)"/,'sequence="'+value+'"');
		// updating and storing the xml
		getChildXml(state.xml);
  	}
	  
	// calls whenever there is change in title textbox and update the xml accordingly
	function changeTitle(event) {
		state.xml = state.xml.toString().replace(/title="(.*?)"/img,'title="'+event.target.value+'"');
		// updating and storing the xml
		getChildXml(state.xml);
	}
	
	// calls whenever there is change in multicheck checkbox and update the xml accordingly
  	function multicheck(event) {
		state.multicheck = event.target.checked;
		// updating the xml on the basis of multicheck is checked 
		state.xml = state.xml.toString().replace(/multicheck="(.*?)"/img,'multicheck="'+event.target.checked+'"');
		// updating and storing the xml
		getChildXml(state.xml);
	}
	  
	// calls whenever there is change in default textfield and update the xml accordingly
  	function changeDefault(event) {
		state.xml = state.xml.toString().replace(/<default>\s*<\!\[CDATA\[([\s\S]*?)\]\]>\s*<\/default>/img,'<default><![CDATA['+event.target.value+']]></default>');
		// updating the xml and storing the xml 
		getChildXml(state.xml);
	}
	
	// for rendering the player
  	function renderPlayer() {
		AH.empty('#authoringDiv player');
		tag_player(AH.select('#authoringDiv'));
		AH.find('#authoringDiv', 'player', 'addClass', 'hidecontent');
		AH.selectAll('#editor img').forEach(function(_this) {
				let _src = _this.getAttribute('src');
				if (!_this.getAttribute('header-logo') && _src.indexOf('vimeocdn') == -1 && !_src.match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
					_this.setAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/'+ _src);
				}
		});
	}

	// for unrendering the player
	function unRenderPlayer() {
		AH.empty('#authoringDiv player');
		AH.find('#authoringDiv', 'player', {action: 'removeClass', actionData: 'hidecontent'});
		AH.selectAll('#editor img').forEach(function(_this) {
			let _src = _this.getAttribute('src');
			if (_src.indexOf('vimeocdn') == -1 && !_src.match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_this.setAttribute('src', _src);
			}
		});
	}

	// calls when remediation Mode is click
  	function remediationMode() {
  		if (state.xml) {
  			let iframe = document.getElementById("authoringFrame");
 			let uxml = iframe.contentWindow.save_data(0, 0, true);
			if (uxml.match(/<!\[CDATA\[\s*html=dW5kZWZpbmVk\s*\]\]>/gmi) && state.uxml != '') {
				uxml = state.uxml;
			} else {
				state.uxml = uxml;
			}
			state.remediationToggle = true;
			AH.ajax({
				url: baseUrl+'editor/index.php', // point to server-side PHP script 
				data: {
					ajax : '1', 
					action : "external_reviewmode",
					get_message: state.xml, 
					uxml: uxml,
					content_subtype: 16
				},                         
				type: 'post',
			}).then((response)=> {
				response = response.replace(/\n/gmi,'<br/>');
				let answer = response.replace(/\s=\s/gim,'=').match(/ans="(.*?)"/img);
				answer = (answer) ? answer.toString().replace(/ans=|"/img,'') : '';
				message = UCLIB.ucfirst(answer);
				state.snackback = true;
				AH.find(document, '#remediationModel').innerHTML = (response);
			})	
  		} else {
  			window.is_review = 1;
  			renderPlayer();
  		}
	}
	
	// for resetting the function 
	// not found where it is called @pradeep sir please check once
  	function resetData() {
  		if(AH.select("#authoringFrame").getAttribute('data-authoring') == '0') {
  			document.getElementById("authoringFrame").contentWindow.resetInEditor();
  			state.uxml = "<smxml></smxml>";
  		} else {
			state.xml = state.xml.toString().replace(/<!\[CDATA\[[\s\S]*?\]\]>/gmi,'<![CDATA[]]>');	
			state.uxml = state.uxml.toString().replace(/<!\[CDATA\[[\s\S]*?\]\]>/gmi,'<![CDATA[]]>');
  			getChildXml(state.xml);
  			AH.find(document, 'form[target="authoringFrame"]').submit();
  			editorState.activator = true;
  		}
	  }
</script>

<div id="authoringArea">
	<div id="externalInputs" class="mt-md"> 
		<div class="col-md-12 float-left">
			<div class="row mx-0">
				<div class="col-md-6">
					<Textfield 
						id="externalTitle" 
						label={l.title}
						style="padding-top:0;"
						on:change={changeTitle} 
					/>
				</div>
				<div class="col-md-6">
					<Textfield
						id="defaultValues"
						label={l.default}
						multiline
						fullWidth
						on:change={changeDefault}
					/>
				</div>
			</div>
			<div class="row mt-3 mx-0">
				<div class="col-md-6 float-left">
					<Checkbox
						on:click = {multicheck}
					>
						{l.multi_check} :
					</Checkbox>
				</div>
				<div class="col-md-6">
					<div class="float-left" style="line-height: 27px;font-family:'Roboto, sans-serif'">{l.sequence} : </div>
					<div>
						<select
							value={state.sequence}
							on:blur={handleSequence}
							style="margin-left:10px"
						>
							<option value="0">{"No match"}</option>
							<option value="1">{"Loose match"}</option>
							<option value="2">{"Exact match"}</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
	<center>
		<div id="frame">
			<iframe 
				id="authoringFrame" 
				title="External Module"
				allowFullScreen={true} 
				webkitallowfullscreen="true" 
				mozallowfullscreen="true" 
				height="550" 
				width="94%" 
				name="authoringFrame" 
				data-authoring="1"
			></iframe>
		</div>
	</center>
</div>
<Dialog		          
	bind:visible={state.remediationToggle}
	width={450}
>
	<div slot="title" style="text-align: left;">
		<div style="">Review</div>
	</div>
	<div>
		<div id="remediationModel">
			<center>
				<Loader size={70} />
				<h4>{l.calculate_answer}<br/> {l.please_wait}</h4>
			</center>
		</div>
	</div>
	<div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
		<Button
			on:click={()=> state.remediationToggle = false}
		>
			{l.done}
		</Button>
	</div>
</Dialog>
<Snackbar
	bind:visible={state.snackback} 
	bg="#f44336" 
	bottom={true} 
	timeout={10}
	style="position: absolute;z-index:9999"
>
	{message}
</Snackbar>