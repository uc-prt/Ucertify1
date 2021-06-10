<script>
	import { onMount, beforeUpdate, afterUpdate , tick, onDestroy } from 'svelte';
	import { Button, Dialog, Checkbox, Snackbar, Textfield } from 'svelte-mui/src';
	import {tag_player} from '../helper/helperFunctions';
	import { writable } from 'svelte/store';
	import l from '../src/libs/editorLib/language';
	import Loader from '../helper/Loader.svelte';
	import UCLIB from '../src/libs/editorLib/UCLIB';
	import { AH } from '../helper/HelperAI.svelte';
	export let editorState;
	export let ucEditor;
	export let showAns;

	let xml='', _module='', qxml='', uxml='<smans></smans>', windowHtml='', message = '';
	let state = {};
	let hdd = writable({
			xml : '',
			uxml: '',
			module : '0',
			stepIndex : 0,
			toggle : false,
			snackback : false,
			testMode : '0',
			remediationToggle : false,
			qxml : '',
			titleData : "",
			stemData : "",
			remediationData : "",
			remediationToggle: false,
			webAutogradeNotCalled: true,
			toggleMode: "",
		});
	const unsubscribe = hdd.subscribe((item)=> {
		state = item;
	});


	// call before the rendering
	onMount(async ()=> {
		state.xml = editorState.xml;
		let smxml = editorState.xml.match(/<smxml(.*?)>/gim);
		let type = smxml.toString().match(/type="(.*?)"|type='(.*?)'/gim);
		type = type.toString().replace(/type=|"/gim, '');
		state.module = type;
		editorState.activator = true;
		await tick();
		didMount();
	});

	// called immediately before the component is destroyed
	onDestroy(()=> {
		AH.select('#testMode', 'attr', {id: 'answerCheck'}).innerHTML = (l.remediation);
	})

	// call just after rendering
	function didMount() {
		setTimeout(function() {
			// getting the form details
			windowHtml = getAuthoringForm(editorState.xml, state.module.toString());
			// cheking the browser for the authoringFrame Height
			if (/Edge/i.test(navigator.userAgent)) {
				AH.select("#authoringFrame", 'attr', {height: window.innerHeight - 31});
			} else {
				if (/Mac/i.test(navigator.userAgent)) {
					AH.select("#authoringFrame", 'attr',{height: window.innerHeight - 60});
				} else {
					AH.select("#authoringFrame", 'attr',{height: window.innerHeight + 12});
				}
			}
			AH.select('#preview', 'hide');
			// if find any form then remove from the authoring area
			AH.find('#authoringArea', 'form', {action: 'remove'});
			AH.insert('#authoringArea', windowHtml, 'beforeend');
			setTimeout(function() {
				// submiting the form
				AH.find(document, 'form[target="authoringFrame"]').submit();
				editorState.activator = true;
			}, 100);
		}, 200);

		// for answer checking
		AH.listen(document, 'click', '#answerCheck', ()=> {
			remediationMode();
		});
		// for testmode
		AH.listen(document, 'click', '#testMode', function() {
			testMode(1);
			AH.select('#testMode', 'attr', {id: 'answerCheck'}).innerHTML = l.remediation;
		});

		// for binding the onclick event in case of type 17 to show correct/incorrect
		setTimeout(function() {
			if (state.module == '17') {
				AH.bind('#authoringFrame','load', ()=> {
					let frameDoc = AH.select('#authoringFrame').contentDocument;
		        	AH.listen(frameDoc, 'click', 'body', function(_this) {
		        		if (state.testMode == '1') {
		        			message = (AH.select('#labAnswer').value == '1') ? 'Correct' : 'Incorrect';
		        			state.snackback = true; 
		        		}
		        	});
					editorState.activator = false;
		        });
			}
		}, 200);

		AH.listen('#clickRun', "click", ()=> {
			showAns(AH.select('#checkAnsStr').value);
		});
	}

	// calls whenever there is change in state or prop
	beforeUpdate(async()=> {
		// checking for the remediation / test mode
		if (editorState.toggleMode != state.toggleMode) {
			if (editorState.toggleMode == true) { //Test Mode
				state.testMode = 1;
				testMode(0);
			} else { //Authoring Mode
				editorState.activator = true;
				state.testMode = 0;
				AH.select('#headerTitle', 'html', l.authoring);
				AH.select('#answerCheck', 'css', {visibility: "hidden", display: "none"});
				AH.select("#authoringFrame", 'attr', {'data-authoring': '1'});
				// if find any form then remove from the authoring area
				AH.find('#authoringArea', 'form', {action: 'remove'});
				// for getting the authoring form
				windowHtml = getAuthoringForm(state.qxml, state.module);
				AH.insert('#authoringArea', windowHtml, 'beforeend');
				AH.selectAll('#tilteShow,#stemShow,#remediationShow', 'remove');
				AH.select('#title', 'html', state.titleData);
				AH.select('#stem', 'html', state.stemData);
				AH.select('#remediation', 'html', state.remediationData);
				AH.selectAll('#title,#stem,#remediation,#externalInputs', 'show');
				unRenderPlayer();
				setTimeout(function() {
					// submit the authoring form details
					AH.select('form[target="authoringFrame"]').submit();
					ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
				}, 100);
			}
			state.toggleMode = editorState.toggleMode;
		}
	});

	// encode the string whuch is passed as parameter and return the encoded string
	function php_urlencode(str) {
		str = escape(str);
		return str.replace(/[*+\/@]|%20/g, function (s) {
				switch (s) {
					case "*": s = "%2A"; break;
					case "+": s = "%2B"; break;
					case "/": s = "%2F"; break;
					case "@": s = "%40"; break;
					case "%20": s = "+"; break;
				}
			return s;
		});
	}

	// getting the question xml
	function getQxml(fromRemed) {
		return new Promise((resolve, reject)=> {
			try {
				let tempQxml
				setTimeout(function() {
					if (state.module == '22') {
						tempQxml = (fromRemed == '1') ? state.qxml : AH.select("#authoringFrame")?.contentWindow.save_data?.();
					} else {
						tempQxml = (fromRemed == '1') ? state.qxml : AH.select("#authoringFrame")?.contentWindow.generateXML?.();
					}
					resolve(tempQxml);
				},50);
			} catch (error) {
				reject(error);
			};
			
		})
	}
	async function testMode(fromRemed) {
		editorState.activator = true;
		AH.empty('#authoringFrame');
		// removing the form in the authoring area
		AH.find('#authoringArea', 'form', {action: 'remove'});
		//@Pradeep: calling havey process
		// getting the qxml
		qxml = await getQxml(fromRemed);
		console.log("qxml Fetched");
		// for rendering the player
		renderPlayer();
		AH.select('#headerTitle', 'html', l.preview);
		AH.select('#answerCheck', 'css', {visibility: "visible", display: "inline-block"});
		AH.select("#authoringFrame", 'attr', {'data-authoring': '0'});
		// for getting the test form
		var testHtml = getTestForm(qxml, '<smans></smans>', state.module);
		// append in the authoring area
		AH.insert('#authoringArea', testHtml, 'beforeend');
		AH.selectAll('#tilteShow, #stemShow, #remediationShow', 'remove');

		// for getting the titleData, stemData , remediation data
		let titleData = AH.select('#title').innerHTML, 
		stemData = AH.select('#stem').innerHTML, 
		remediationData = AH.select('#remediation').innerHTML;
		AH.insert(AH.select(AH.empty('#title'), 'hide'), '<div id="tilteShow">' + titleData + '</div>', 'afterend');
		AH.insert(AH.select(AH.empty('#stem'), 'hide'), '<div id="stemShow">' + stemData + '</div>', 'afterend');
		AH.insert(AH.select(AH.empty('#remediation'),'hide'), '<div id="remediationShow">' + remediationData + '</div>', 'afterend');
		AH.select('#externalInputs', 'hide');
		state.qxml = qxml;
		state.titleData = titleData;
		state.stemData = stemData;
		state.remediationData = remediationData;
		setTimeout(function() {
			// for submitting the form
			AH.selectAll("#stemShow .ebook_item_text, #remediationShow .ebook_item_text", 'attr', {contenteditable: false});
			AH.select('form[target="authoringFrame"]').submit();
		}, 200);
	} 

	// getting the form details
	function getAuthoringForm(xml, type) {
		switch(type) {
			case "17":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/labsimulation/?in_editor=1"><input type="hidden" name="authoringmode" value="1"/><textarea class="h" name="qxml">' + php_urlencode(xml) + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea></form>';
			case "18":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/relationship/?in_editor=1"><input type="hidden" name="authoringmode" value="1"/><textarea class="h" name="qxml">' + php_urlencode(xml) + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea></form>';
			case "22":
				return '<form method="post" target="authoringFrame" action="'+baseUrl+'sim/web/?in_editor=1"><input type="hidden" name="authoringmode" value="1"/><textarea class="h" name="qxml">' + xml + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea></form>';	
		}
	}

	// for getting the test form details
	function getTestForm(xml, uxml, type) {
		switch(type) {
			case "17":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/labsimulation/?in_editor=1"><textarea class="h" name="qxml" id="qxml">' + php_urlencode(xml) + '</textarea><textarea class="h" name="uxml" id="uxml">' + php_urlencode(uxml) + '</textarea><input type="hidden" name="content_guid" value="0"/></form>';
			case "18":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/relationship/?in_editor=1"><textarea class="h" name="qxml">' + php_urlencode(xml) + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea><input type="hidden" name="content_guid" value="0"/></form>';
			case "22":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/web/?in_editor=1"><textarea class="h" name="qxml">' + xml + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea><input type="hidden" name="content_guid" value="0"/></form>';	
		}
	}

	// for getting the remediation form
	function getRemediationForm(xml, uxml, type) {
		switch(type) {
			case "17":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/labsimulation/?in_editor=1"><input type="hidden" name="isReview" value="1"/><textarea class="h" name="qxml">' + php_urlencode(xml) + '</textarea><textarea class="h" name="uxml">' + php_urlencode(uxml) + '</textarea><input type="hidden" name="content_guid" value="0"/></form>';
			case "18":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/relationship/?in_editor=1"><input type="hidden" name="isReview" value="1"/><textarea class="h" name="qxml">' + php_urlencode(xml) + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea><input type="hidden" name="content_guid" value="0"/></form>';
			case "22":
				return '<form method="post" target="authoringFrame" action="' + baseUrl + 'sim/web/?in_editor=1"><input type="hidden" name="isReview" value="1"/><textarea class="h" name="qxml">' + xml + '</textarea><textarea class="h" name="uxml">' + uxml + '</textarea><input type="hidden" name="content_guid" value="0"/></form>';	
		}
	}
	function unRenderPlayer() {
		AH.empty('#authoringDiv player');
			AH.find('#authoringDiv', 'player', {action: 'removeClass', actionData: 'hidecontent'});
			AH.selectAll('#editor img').forEach((_this)=> {
				if (!_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm) && _this.getAttribute('id') != 'editor-header-img') {
					_this.getAttribute('src', _this.getAttribute('src'));
				}
		});
	}
	function renderPlayer() {
		AH.empty('#authoringDiv player');
		tag_player(AH.select('#authoringDiv'));
		AH.find('#authoringDiv', 'player', {action: 'addClass', actionData: 'hidecontent'});
		AH.selectAll('#editor img').forEach((_this)=> {
			if (!_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm) && _this.getAttribute('id') != 'editor-header-img') {
				_this.getAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/' + _this.getAttribute('src'));
			}
		});
	}
	function  reset() {
		switch(state.module) {
			case "18":
				AH.select("#authoringFrame").contentWindow.location.reload();
				break;
		}
	}

	// for getting uxml
	function remediationMode() {
		AH.select("#authoringFrame", 'attr', {'data-authoring': '0'});
		try {
			if (state.module == '17') {
				// getting the uxml from the function getAnswerXMLLabsim() 
				uxml = AH.select("#authoringFrame").contentWindow.getAnswerXMLLabsim();
				uxml = uxml.uxml;
			} else if (state.module == '18') {
				uxml = AH.select("#authoringFrame").contentWindow.generateXML();	
				uxml = JSON.stringify(uxml.xml);
			} else if (state.module == '22') {
				let tab_data = AH.select("#authoringFrame").contentWindow.webAutoEvaluate(); 
				if (tab_data) {
					state.remediationToggle = true;
					state.webAutogradeNotCalled = false;
					AH.select('#remediationModel', 'html', tab_data);
					let answer = tab_data.replace(/\s=\s/gim, '=').match(/ans="(.*?)"/img);
					answer = (answer) ? answer.toString().replace(/ans=|"/img, '') : '';
					showAns(UCLIB.ucfirst(answer));
				}
			} else {
				uxml = AH.select("#authoringFrame").contentWindow.save_data();
			}
		} catch(err) {
			console.log(err);
		}
		if (state.webAutogradeNotCalled) {
			AH.find('#authoringArea', 'form');
			// for getting the remediation form
			windowHtml = getRemediationForm(state.qxml, uxml, state.module);
			AH.insert('#authoringArea', windowHtml, 'beforeend');
			setTimeout(function() {
				// submitting the form
				AH.select('form[target="authoringFrame"]').submit();
				editorState.activator = true;
			}, 100);
		}
	}
</script>

<div id="authoringArea">
	<center>
		<div id="frame">
			<iframe 
				id="authoringFrame" 
				title="Hardware Lab"
				allowFullScreen={true} 
				webkitallowfullscreen={true} 
				mozallowfullscreen={true} 
				height="650" 
				width="94%" 
				name="authoringFrame" 
				data-authoring="1"
			></iframe>
		</div>
	</center>
	<input type="hidden" name="labAnswer" id="labAnswer" val="0" />
	<input type="hidden" id="checkAnsStr" name="checkAnsStr" value=""/>
	<button id="clickRun" name="clickRun" style="display: none"></button>
</div>
<Snackbar
	bind:visible={state.snackback}
	timeout={10}
>
	{message}
</Snackbar>
<Dialog					
	bind:visible={state.remediationToggle}
	width={450}
>
	<div slot="title" style="text-align: left;">
		<div style="">Review</div>
	</div>
	<div id="remediationModel">
		<center class="mt-xl">
			<Loader size={60} />
			<h4>{l.calculate_answer}<br/> {l.please_wait}</h4>
		</center>
	</div>
	<div slot="footer" class="svelteFooter">
		<Button
			unelevated={true}
            outlined={true}
			color="primary"
			on:Click={()=>{ state.remediationToggle = false }}
		>
			{l.done}
		</Button>
	</div>  
</Dialog>