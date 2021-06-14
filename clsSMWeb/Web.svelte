<script>
	/**
	 * File: Web.svelte
	 * Desciption: Web module loader for editor side
	 * Author: Sundaram
	 * Last Update: Pradeep Yadav <pradeepdv45@gmail.com> on 23 May 2021
	 */
    import WebPreview from './WebPreview.svelte';
    import WebAuthoring from './WebAuthoring.svelte';
    import l from './libs/Lang.js';
    import { beforeUpdate, onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { AH } from '../helper/HelperAI.svelte';
	export let xml;
	export let uaXML;
	export let inEditor;
	export let editorState;
	export let toggleMode;
	export let getChildXml;
	export let showAns;
	export let setInlineEditor;
	export let isReview;

	let isPreview = 0;
	let state = {};
	let DataState = writable({
		currentComponent 			: 2,
		titleData					: "",
		stemData					: "",
		remediationData				: "",
		toggle						: toggleMode
	})

	let unsubscribe = DataState.subscribe((items)=>{
		state = items;
	})

	// called every time when any props or state gets changed and update the xml
	beforeUpdate(()=> {
		if (editorState) {
			// contains the xml
			//window.QXML = xml;
			if (toggleMode != state.toggle) {
				console.log({toggleMode});
				state.toggle = toggleMode;
				if (toggleMode == true) {
					AI.set('renderCodeMirror', false);
					// assign the value '1' to variable 'isPreview' to load the 'WebPreview' conponent
					isPreview = 1;
					renderPlayer();
					// sets the content 'Preview' of header title that can be seen on the top of the 'Title' label
					AH.select('#headerTitle', 'html', l.preview);
					// shows the label 'Check Answer' in inline way
					AH.select('#answerCheck', 'css', {visibility: "visible", display: "inline-block"});
					// used for show the tooltip
					AH.enableBsAll('[data-toggle="tooltip"]', 'Tooltip');

					// contains the 'Title' field value of 'Authoring' area // Replaced
					let titleData = AH.select('#title').innerHTML;
					// contains the 'Stem' field value of 'Authoring' area // Replaced
					let stemData = AH.select('#stem').innerHTML;
					// contains the 'Remediation' field value of 'Authoring' area
					let remediationData = AH.select('#remediation').innerHTML;
					
					// stes the value of state 'titleData' with value of 'Title' field of 'Authoring' area
					state.titleData = titleData;
					// stes the value of state 'stemData' with value of 'Stem' field of 'Authoring' area
					state.stemData = stemData;
					// stes the value of state 'remediationData' with value of 'Remediation' field of 'Authoring' area
					state.remediationData = remediationData;
					
					// hides the 'Title' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'titleShow' and text stored in variable 'titleData'
					//jQuery('#title').empty().hide().after('<div id="tilteShow">' + titleData + '</div>');  // Replaced
					AH.empty("#title");
					AH.select("#title", 'hide');
					AH.select("#title", 'html', `<div id="tilteShow">${titleData}</div>`);

					// hides the 'Stem' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'stemShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'stemData'
					//	jQuery('#stem').empty().hide().after('<div id="stemShow">' + get_ucsyntax(stemData) + '</div>'); // Replaced

					AH.empty("#stem");
					AH.select("#stem", 'hide');
					AH.select("#stem", 'html', `<div id="stemShow">${get_ucsyntax(stemData)}</div>`);
					
					// hides the 'Remediation' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'remediationShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'remediationData'
					//jQuery('#remediation').hide().empty().after('<div id="remediationShow">' + get_ucsyntax(remediationData) + '</div>'); Replaced
					AH.empty("#remediation");
					AH.select("#remediation", 'hide');
					AH.select('#remediation', 'html', `<div id="remediationShow">${get_ucsyntax(remediationData)}</div>`);


					AH.selectAll('#externalInputs, #authoringActions, #addTestCase', 'hide');
					// loads preview component
					state.currentComponent = 1;//<WebPreview xml={xml} inQuizPlayer={0} key={1} />;
					
				} else {
					// sets the value of variable isPreview 0 that means loads the authoring component
					isPreview = 0;
					// makes user answer value blank
					//window.uaXML = '';
					// hidess the label 'Check Answer'
					AH.select("#answerCheck", 'css', {visibility: "hidden", display: "none"});
					// sets the content 'Authoring' of header title that can be seen on the top of the 'Title' label
					AH.select('#headerTitle', 'html', l.authoring);
					// removes the form element from 'Authoring area
					AH.find("#authoringArea",'form', {action: 'remove'});
					// append the html 'stored' in variable 'windowHtml' in authoring area
					//jQuery('#authoringArea').append(windowHtml);
					// removes the element that was added on preview area at the place of 'Title', 'Stem' and 'Remediation' field
					AH.selectAll('#tilteShow, #stemShow, #remediationShow', 'remove');
					
					// sets the content of the 'Title' field of Authoring area
					AH.select('#title', 'html', state.titleData);
					// sets the content of the 'Stem' field of Authoring area
					AH.select('#stem', 'html', state.stemData);
					// sets the content of the 'Remediation' field of Authoring area
					AH.select('#remediation', 'html', state.remediationData);

					AH.selectAll('#title, #stem, #remediation, #externalInputs, #authoringActions, #addTestCase', 'show', 'block'); // Replaced;
					
					unRenderPlayer();
					// loads authoring component
					state.currentComponent = 0;
					// stes the value '0' of margin-bottom of 'ol' tag that exist in 'Authoring' area
					//jQuery("#authoringSection ol").attr("style","margin-bottom:0!important");
					//AH.select('#authoringSection ol').setAttribute("style","margin-bottom:0!important");
					try {
						// removes the id of all elements that comes under 'Stem' label and un-initialize the tinymce editor
						setInlineEditor("#stem");
						// removes the id of all elements that comes under Remediation' label and un-initialize the tinymce editor
						setInlineEditor("#remediation");
					} catch(e) {
						console.log(e);
					}
				}
			}
		} else {
			getComp();
        }
        
	})

	function loadLibs() {
        let config = {
            preload: true,
            type: 'stylesheet',
            as: 'style'
        }
        AH.createLink(window.itemFolder + 'clsSMWeb/libs/codemirror.min.css', config);
        AH.createLink(window.itemFolder + 'clsSMWeb/libs/monokai.css', config);
        AH.createLink(window.itemFolder + 'clsSMWeb/libs/simplescrollbars.css', config);
		AH.createLink(window.itemFolder + 'clsSMWeb/libs/webitem.min.css', config);
    }

	// called once throughtout the program execution just after render method
	onMount(async ()=> {
		loadLibs();
		await tick();
		if (editorState) {
			//AI.set('web',this);
			getComp();
			// logs the message on console if module loaded in editor
			console.log('Web in editormode');
		} else {
			AH.listen(document, 'mouseover', '#webModule', ()=> {
				if (isHover == 0) {
					isHover = 1;
					//state.currentComponent = "<h1>uCertify</h1>";
					state.currentComponent = 1;
				}
			});	
			// sets the value of state 'currentComponent' and loads 'WebPreview' component by setting the value of property 'inQuizPlayer' as '1' and property 'key' as '2'
			state.currentComponent = 1;//<WebPreview xml={window.QXML} inQuizPlayer={1} key={2} />;
		}
		await tick();
	})

	function getComp() {
		if (editorState) {
			// in case of Editor loads preview or authoring component according to the value of variable 'isPreview'
			setTimeout(()=> {
				state.currentComponent = (isPreview == 1) ? 1 : 0;
			}, 1000);
		} else {
			// render preview component in case other than Editor such as book, quiz etc
			state.currentComponent = 1;//<WebPreview xml={window.QXML} inQuizPlayer={0} key={1} />; 
		}
	}

	// used for unrender the player tag
	function unRenderPlayer() {
		// makes player tag empty that exist inside element have id: authoringDiv
		//jQuery('#authoringDiv player').empty(); // Replaced 
		AH.empty('#authoringDiv player');
		// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
		AH.find('#authoringDiv', 'player',{action: 'removeClass', actionData: 'hidecontent'});
		
		AH.selectAll("#editor img").forEach((_this)=> {
			if(!_this.getAttribute('header-logo') && !_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)){
				_this.setAttribute('src', _this.getAttribute('src'));
			}
		});
	}
	
	// render the player tag
    function renderPlayer() {
		// makes player tag empty that exist inside element have id: authoringDiv
		//jQuery('#authoringDiv player').empty(); // Replaced
		AH.empty('#authoringDiv player');
		// used for set the data of player tag
		//tag_player(AH.select('#authoringDiv')); // Need to fix it
		// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
		AH.find('#authoringDiv', 'player', {action: 'addClass', actionData: 'hidecontent'});

		AH.selectAll("#editor img").forEach((_this)=> {
			if (!_this.getAttribute('header-logo') && !_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_this.setAttribute('src','//s3.amazonaws.com/jigyaasa_content_static/' + _this.getAttribute('src'));
			}
		});
    }
</script>
<main>
	<div id="webModule">
		{#if state.currentComponent == 2}
			Loading...
		{:else if state.currentComponent == 1} 
			<WebPreview 
				key="1"
				xml={xml} 
				inQuizPlayer={ editorState ? 0 : 1}  
				editorState={editorState}
				uaXML={uaXML}
			/> 
		{:else if state.currentComponent == 0}
			<WebAuthoring  
				key="2"
				xml={xml} 
				toggleMode={toggleMode} 
				getChildXml={getChildXml} 
				showAns={showAns}
				editorState={editorState}
				isReview={isReview}
			/>
		{/if}
	</div>
</main>