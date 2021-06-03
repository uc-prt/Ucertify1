<!--
 *  File Name   : AudioPreview.svelte
 *  Description : Container for all AudioRecorder Preview Module
 *  Author      : Rashmi Kumari
 *  Package     : pe-items
 *  Last update : 15-Feb-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount, afterUpdate } from "svelte";
    import { XMLToJSON, AH} from '../helper/HelperAI.svelte';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import l from '../src/libs/editorLib/language';
    export let xml;
    export let uxml;
    export let showAns;
    export let isReview;
    export let editorState;

    let recognition;
    let synth;
    let previewResetClicked = 'no';
    let areaLabelForPreviewStopButton = "Play Audio";
    let areaLabelForPreviewModalContent;
    let areaLabelForPreviewRecordButton = "Start Recording";
    let previewTimeForRecording = 15;
    let previewManageTimer;
    let state = {
        disabled: true,
        cdata: '',
        language: '',
        correctAns: '',
        xml: '',
        status: '',
        pointerEvents: "auto",
        isReset: true,
        showTranscript: false,
        counter: 0,
    }

    // Called once throughout the programm execution
    onMount(() => {
        if (!(window.webkitSpeechRecognition || window.SpeechRecognition)) {
            // shows the warning message that your browser does not support the speechRecognition
            AH.alert(l.browser_support_msg);
        }
        if (xml != state.xml) {
            // sets the state xml
            state.xml = xml;
            /* reset the recorded data and disabled the reset and play button and updates the xml and re-render the component */
            resetValue();
            // load the module according to the value of xml
            loadModule(xml);
        }
    })

    // Called every time when any state gets changed
    $: {
		if (isReview) {
            setReview();
		} else {
            unsetReview();
        }
        loadModule(xml);
	}

    // load the module according to the value of xml
    function loadModule(loadXml) {
        // contains json data of xml
        let newXml = XMLToJSON(loadXml);
        // parses the xml data and update the xml
        parseXMLPreview(newXml);
    }

    // parses the xml data and update the xml
    function parseXMLPreview(MYXML) {
        try {
            // used to set the value of the state language from the value of language key of xml json
            state.language = MYXML.smxml._language,
            // used to set the value of the state cdata from the value of cdata key of xml json
            state.correctAns = MYXML.smxml.__cdata,
            // used to set the value of the state showTranscript from the value of showTranscript key of xml json
            state.showTranscript = ((MYXML.smxml._showTranscript == 'true') ? true: false);
            if (uxml) {
                let timer = setTimeout(function() {
                    // parses the user answer xml and update the xml
                    parseUserAns(uxml);
                    // clear the timeout
                    clearTimeout(timer);
                }, 100);
            }
        } catch(event) {
            console.warn({
                'error': event.message,
                'function name': 'parseXMLPreview',
                'File name': 'AudioPreview.svelte'
            });
        }
    }

    // parses the user answer xml and update the xml
    function parseUserAns(userAns) {
        // contains json data of user answer xml
        let MYXML = XMLToJSON(userAns);
        // used to set the value of the state language from the value of language key of the user answer xml json
        state.language = MYXML.smans._language;
        // used to set the value of the state cdata from the value of cdata key of the user answer xml json
        state.cdata = MYXML.smans.__cdata;
        // used to set the value of the state status from the value of status key of the user answer xml json
        state.status = MYXML.smans._status;
        // used to sets the value of the state disabled to false if the value of 'status' key of the user answer xml json is 'recordingStopped' otherwise 'true'
        state.disabled = ((MYXML.smans._status == 'recordingStopped') ? false: true);
        // used to set the value of the state isReset from the value of isReset key of user answer xml json
        state.isReset = ((MYXML.smans._isReset == 'true') ? true: false);
        // used to set the value of the state showTranscript from the value of showTranscript key of the user answer xml json
        state.showTranscript = ((MYXML.smans._showTranscript == 'true') ? true: false);
    }

    /* reset the recorded data and disabled the reset and play button and updates the xml and re-render the component */
    function resetValue() {
        state.disabled = true;
        state.cdata = '';
        state.xml = '';
        state.status = '';
        state.isReset = true;
    }

    // reset the previous recorded data
    function manageData() {
        // when reset modalbox open after click on reset button
        if (previewResetClicked == 'yes') {
            // reset the previously recorded data
            resetAudioData();
            previewResetClicked = 'no';
        } else {
            // when reset modalbox open after click on record button
            state.cdata = '',
            state.disabled = true,
            state.status = '',
            state.pauseRecording = ''
            /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
            previewCheckState();
            let manage_data_timer = setTimeout(function() {
                // called for start the recording
                startRecording();
                // clear the timeout
                clearTimeout(manage_data_timer);
            }, 120);
        }
    }

    // disabled the reset and play button and blanks the value of cdata and xml of state
    function resetAudioData() {
        // handles with gif of recording and play and icon of record button
        manageStopStatus();
        if (state.status == 'recording') {
            /* stops the speech recognition service from listening to incoming audio, and attempts to return a SpeechRecognitionResult using the audio captured so far. */
            recognition.stop();
        }
        state.cdata = '';
        state.disabled = true;
        state.xml = '';
        state.status = '';
        state.isReset = true;
        // clears the timeout which is started when recording stared
        clearTimeout(previewManageTimer);
        /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
        previewCheckState();
    }

    /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
    function previewCheckState() {
        setTimeout(function() {
            let uXml = '<smans type="43" name="AudioRecorder" disabled="' + state.disabled + '" status="' + state.status + '" language="' + state.language + '" isReset="' + state.isReset + '" showTranscript="' + state.showTranscript + '"><![CDATA[' + state.cdata + ']]></smans>';
            AH.select("#special_module_user_xml").value = uXml;
            ISSPECIALMODULEUSERXMLCHANGE = 1;
            // stores user answer xml data in uaXML variable of window object to access it globally
            uxml = AH.select("#special_module_user_xml").value;
            // used for screen reader to read the message when user reached on play button
            areaLabelForPreviewStopButton = AH.select('#stopButtonTooltip').getAttribute('data-original-title');
            // used for screen reader to read the message when user reached on record button
            areaLabelForPreviewRecordButton = AH.select('#recordButtonTooltip').getAttribute('data-original-title');
            // used for screen reader to read the message when user open the reset modalbox
            areaLabelForPreviewModalContent = AH.select('#previewDialogBody').innerText;
            if (state.correctAns.trim() != '') {
                // check the answer
                checkAns();
            }
        }, 100);
    }

    // stops capturing incoming audio
    function stopRecording() {
        // handles with gif of recording and play and icon of record button
        manageStopStatus();
        clearTimeout(previewManageTimer);
        state.status = 'recordingStopped';
        state.disabled = false;
        /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
        previewCheckState();
        // hides recording gif
        AH.selectAll('.previewRecordingOn', 'addClass', 'h');
        // shows the initial state image
        AH.selectAll('.previewInitialState', 'removeClass', 'h');
        /* stops the speech recognition service from listening to incoming audio, and attempts to return a SpeechRecognitionResult using the audio captured so far. */
        recognition.stop();
    }

    // ends recording after 15 sec
    function previewManageTime() {
        previewTimeForRecording = previewTimeForRecording - 1;
        state.counter = state.counter + 1;
        previewManageTimer = setTimeout(function() {
            if (previewTimeForRecording > 0) {
                // calls again the method previewManageTime for counting the second value
                previewManageTime();
            } else {
                // stops the recording
                stopRecording();
            }
        }, 1000);
    }

    // start the listening to incoming audio, enables reset button, stores the recognised data to cdata state and update the xml 
    function dictate() {
        // checks if SpeechRecognition supported then defines some properties value of SpeechRecogniton and adds  some event listener as well
        isSpeechRecognitionSupported();
        /* starts the speech recognition service listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition. */
        recognition.start();
        // enables reset button
        AH.select('#preview_container #resetButton').disabled = false;
        // hides the initial state image of the audio container and play gif
        AH.selectAll('.previewAudioPlaying, .previewInitialState', 'addClass', 'h');
        // shows recording gif
        AH.selectAll('.previewRecordingOn', 'removeClass', 'h');
        /* The onresult property of the SpeechRecognition interface represents an event handler that will run when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app */
        recognition.onresult = (event) => {
            let speechToText = '';
            for (let index_no = 0; index_no < event.results.length; index_no = index_no + 1) {
                speechToText += event.results[index_no][0].transcript;
            }
            // sets the value of textual data into cdata state that is recognised by SpeechRecognition
            state.cdata = speechToText.trim();
            /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
            previewCheckState();
        }
    }

    // handles with gif of recording and play and icon of record button
    function manageStopStatus() {
        // hides the gif of recording and playing
        AH.selectAll('.previewAudioPlaying, .previewRecordingOn', 'addClass', 'h');
        // shows the initial state image of the audio container
        AH.selectAll('.previewInitialState', 'removeClass', 'h');
        // removes the stop icon from recording button and adds start recording icon
        AH.selectAll('#preview_recordButton span', 'removeClass', 'icomoon-24px-stop');
        AH.selectAll('#preview_recordButton span', 'addClass', ['icomoon-circle-2', 'text-danger']);
    }

    // speak the text after defining some properties value and adding event
    function isSpeechSynthesisSupported() {
        // Returns a new SpeechSynthesisUtterance object instance
        let utterThis = new SpeechSynthesisUtterance(state.cdata);
        // array of available voices
        let voiceForSpeech = synth.getVoices();
        // sets the voice name according to the value of language state
        let voice_name = ((state.language == 'de-DE') ? "Google Deutsch" : (state.language == 'fr-FR') ? "Google français" : (state.language == 'es-ES') ? "Google español" : (state.language == 'hi-IN') ? "Google हिन्दी": (state.language == 'ja-JP') ? "Google 日本語": (state.language == 'ko-KR') ? "Google 한국의": (state.language == 'it-IT') ? "Google italiano": "Google US English");
        // event listener fired when the utterance has finished being spoken.
        utterThis.addEventListener('end', function() {
            // hides the gif of recording and play
            AH.selectAll('.previewAudioPlaying, .previewRecordingOn', 'addClass', 'h');
            // shows the initial state image of the audio container
            AH.selectAll('.previewInitialState', 'removeClass', 'h');
            // enables the play button
            state.disabled = false;
            /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
            previewCheckState();
            // removes all utterances from the utterance queue.
            synth.cancel();
        });
        for (let index_no = 0; index_no < voiceForSpeech.length; index_no = index_no + 1) {
            if (voiceForSpeech[index_no].name == voice_name) {
                //  sets the voice that will be used to speak the utterance.
                utterThis.voice = voiceForSpeech[index_no];
                // sets the pitch at which the utterance will be spoken at.
                utterThis.pitch = 1;
                // sets the speed at which the utterance will be spoken at.
                utterThis.rate = 1;
                // sets the language of the utterance
                utterThis.lang = state.language;
                // adds an utterance to the utterance queue; it will be spoken when any other utterances queued before it have been spoken.
                synth.speak(utterThis);
                break;
            }
        }
    }

    // starts the recording
    function startRecording() {
        switch(state.status) {
            case 'recording':
                // stops the recording when stop recording button clicked
                stopRecording();
                break;
            case 'recordingStopped':
                // for show the reset modalbox when start recording button clicked and recording is done previously
                AH.getBS('#preview_confirm_modal','Modal').show();
                // focus on reset modalbox for screen reader purpose
                AH.select('.modal-body').focus();
                break;
            default:
                dictate();
                state.status = 'recording',
                state.isReset = false,
                // used for count the second after recording start
                state.counter = 0;
                // used for automatically end the recording after 15 sec
                previewTimeForRecording = 15;
                // ends recording after 15 sec
                previewManageTime();
                /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
                previewCheckState();
                // adds the stop recording icon to record button
                AH.selectAll('#preview_recordButton span', 'removeClass', ['icomoon-circle-2', 'text-danger']);
                AH.selectAll('#preview_recordButton span', 'addClass', 'icomoon-24px-stop');
        }
    }

    // checks if SpeechRecognition supported then defines some properties value of SpeechRecogniton and adds  some event listener as well
    function isSpeechRecognitionSupported() {
        if (window.webkitSpeechRecognition || window.SpeechRecognition) {
            window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            // creates new recognition object
            recognition = new SpeechRecognition();
            //Controls whether continuous results are returned for each recognition
            recognition.continuous = true;
            // returns interim results 
            recognition.interimResults = true;
            //  sets the language of the current SpeechRecognition
            recognition.lang = state.language;
            // used for globally access the recogniton 
            window.recognitionData = recognition;
            recognition.addEventListener('end', function() {
                if (!state.isReset) {
                    // clears the timeout which is started when recording stared
                    clearTimeout(previewManageTimer);
                    // shows message that recording ended
                    AH.alert(l.recording_ended);
                    // handles with gif of recording and play and icon of record button
                    manageStopStatus();
                    // shows the initial state image of the audio container
                    AH.selectAll('.previewInitialState', 'removeClass', 'h');
                    state.status = 'recordingStopped';
                    state.disabled = false;
                    /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
                    previewCheckState();
                }
            });
        } else {
            // shows the message that SpeechRecognition not supported
			AH.alert(l.browser_support_msg);
            return;
        }
    }

    //check that reset button is clicked or not
    function setData() {
        previewResetClicked = 'yes';
    }

    // reset the data of 'resetClicked' to 'no' when no button is clicked in modalbox
    function modalResponse() {
        previewResetClicked = 'no';
    }

    // called for speak the recorded text
    function playRecording() {
        if (window.speechSynthesis) {
            synth = window.speechSynthesis;
            if (state.cdata != '') {
                // hides the initial state image of the audio container and recording gif
                AH.selectAll('.previewRecordingOn, .previewInitialState', 'addClass', 'h');
                // shows the play gif
                AH.selectAll('.previewAudioPlaying', 'removeClass', 'h');
                state.disabled = true;
                /* used for check the answer, store the user answer xml and defines the title for stop button, record button and reset modal box for use it when screen reader used */
                previewCheckState();
                // removes all utterances from the utterance queue.
                //synth.cancel();
                // speak the recorded text after defining some properties value and adding event
                isSpeechSynthesisSupported();
            } else {
                // hides the play and recording gif
                AH.selectAll('.previewRecordingOn, .previewAudioPlaying', 'addClass', 'h');
                // shows the initial state image of the audio container
                AH.selectAll('.previewInitialState', 'removeClass', 'h');
                // message for no data recorded
				AH.alert(l.no_data_msg);
            }
        } else {
            // message for not supported speechSynthesis
			AH.alert(l.browser_support_msg);
            return;
        }
    } 

    // checks the answer
    function checkAns() {
        let ans = "";
        if  (state.correctAns.trim() != '') {
            if (state.correctAns.toLowerCase() == state.cdata.toLowerCase()) {
                // label of message
                ans = l.correct;
                AH.select("#answer").checked = true;
                state.useransstatus = true;
            } else {
                // label of message
                ans = l.incorrect;
                AH.select("#answer").checked = false;
                state.useransstatus = false;
            }
            // shows the answer
            if (editorState) {
                showAns(ans);
            }
        } else {
            // message, no data found for match the answer
            AH.alert(l.matching_msg);
            return;
        }
    }
    let answer_status;
    function setReview() {
        isReview = true;
        state.pointerEvents = "none";
        answer_status = true;
        // check the answer
        checkAns();
        if (state.useransstatus == true) {
            // change the user answer data container's text and border color to #50af50
            AH.setCss('#preview_data_container', {'color': '#50af50'});
        } else {
            // change the user answer data container's text and border color to #c30f0f
            AH.setCss('#preview_data_container', {'color': '#c30f0f'});
        }
        /* hides the answer container in which correct answer will be seen after click on correct answer button */
        AH.selectAll(AH.parent(AH.selectAll('#preanswer_data_container')), 'addClass', 'h');
        /* shows the answer container in which user answer will be seen after click on your answer button */
        AH.selectAll(AH.parent(AH.selectAll('#preview_data_container')), 'removeClass', 'h');
    }

    /* allows the user to perform the task, shows the recording end notification message, hides correct and your answer button */
    function unsetReview() {
        isReview = false;
        state.pointerEvents = "auto";
        answer_status = false;
        // hides both container in which your answer and correct answer data will be seen
        AH.selectAll(AH.parent(AH.selectAll('#preview_data_container')), 'addClass', 'h');
    }

    function handleReviewMode(mode) {
        if(mode == 'c') {
            answer_status = false;
        } else if (mode == 'u') {
            answer_status = true;
        }
    }
</script>
<link onload="this.rel='stylesheet'" rel="preload" as="style" href={editor.baseUrlTheme + "clsSMAudioRecorder/css/AudioStyle.min.css"} />
<div id="preview_container" class="container">
    <div class="row">
        <ItemHelper 
            on:setReview = {setReview}
            on:unsetReview = {unsetReview}
            reviewMode={isReview}
            handleReviewClick = {handleReviewMode}
        />
        {#if isReview}
            {#if answer_status != true}
                <div class="col-12 py-3">
                    <textarea 
                        id="preanswer_data_container" 
                        name="cdata" 
                        class="w-100 form-control border-success typeCorrect" 
                        rows="2" 
                        value={state.correctAns} 
                        readOnly="readonly" 
                        tabindex="0" 
                        aria-label="correct Answer is {state.correctAns}"></textarea>
                </div>
            {:else}
                <div class="col-12 py-3">
                    <textarea 
                        id="preview_data_container" 
                        name="cdata" 
                        class="w-100 form-control {(state.useransstatus == true) ? 'border-success typeCorrect' : 'border-danger typeIncorrect' }" 
                        rows="2" 
                        value={state.cdata} 
                        readOnly="readonly" 
                        tabindex="0" 
                        aria-label="Your answer is {state.cdata} which is {((state.cdata.toLowerCase().trim() == state.correctAns.toLowerCase().trim()) ? "Correct": "Incorrect")}"></textarea>
                </div>
            {/if}
            <div class="col-12 pb-3" tabindex="0" aria-label="matching is case insensitive">
                <b class="noteColor bolder">{l.note_label}</b>
                {l.insensitive_message}
            </div>
        {:else}
            <div class="col-12 pb-3">
                <div class="" tabindex="0" aria-label="Recording will end after 15 sec">
                    <b class="noteColor bolder">{l.note_label}</b>
                    {l.recording_warning}
                </div>
            </div>
            {#if state.showTranscript == true}
                <div class="col-12 pb-3">
                    <div><label for="preview_show_transcript"><b>{l.spoken_label}</b></label></div>
                    <textarea id="preview_show_transcript" name="preview_show_transcript" class="w-100 form-control" rows="2" value={state.cdata} readOnly="readonly" tabindex="0" aria-label={l.spoken_label + " " + ((state.cdata.trim() != "") ? state.cdata.trim(): "Nothing")}></textarea>
                </div>
            {/if}
            <div class="col-12 col-md-8 offset-md-2">
                <div class="border rounded shadow-sm">
                    <div class="p-2 tokenfield bg-light mb-3" aria-label="Audio Recorder" tabindex="0"><b>{l.audio_recorder}</b></div>
                    <div class="mx-auto text-danger recording_status initialState mb-3 d-flex mx-auto">
                        <span class="align-self-center mx-auto previewInitialState tokenfield" aria-label="Click on record to start recording" tabindex="0">{l.starting_message}</span>
                        <div class="h previewRecordingOn tokenfield" aria-label="recording is on" tabindex="0">
                            <img src="//s3.amazonaws.com/jigyaasa_content_static/6ba174bf48e9b6dc8d8bd19d13c9caa9_000Awg.gif" alt="recording is on" class="w-100 h-100 img_fit"/>
                        </div>
                        <div class="h previewAudioPlaying tokenfield" aria-label="Audio is playing" tabindex="0">
                            <img src="//s3.amazonaws.com/jigyaasa_content_static/giphy_000AYi.gif" alt="audio is playing" class="w-100 h-100 img_fit"/>
                        </div>
                    </div>
                    <div id="controls_container" class="bg-light text-center w-100 p-2 {(state.pointerEvents == 'none') ? 'pointerEventOff': 'pointerEventOn'}">
                        <button 
                            type="button" 
                            name="preview_recordButton" 
                            id="preview_recordButton" 
                            on:click={startRecording} 
                            class="btn btn-light py-0" 
                            aria-label="Click for {areaLabelForPreviewRecordButton}"
                        >
                            <span class="icomoon-circle-2 s2 text-danger position-relative top1" data-bs-toggle="tooltip" data-placement="top" data-original-title={((state.status == "recording") ? "Stop Recording": "Start Recording")} id="recordButtonTooltip" name="recordButtonTooltip"></span>
                        </button>
                        <button 
                            type="button" 
                            name="preview_stopButton" 
                            id="preview_stopButton" 
                            on:click={playRecording} 
                            disabled={state.disabled} 
                            class="btn btn-light py-0" 
                            aria-label="Click for {areaLabelForPreviewStopButton}"
                        >
                            <span class="icomoon-24px-autoplay-4 position-relative top1" data-bs-toggle="tooltip" data-placement="top" data-original-title="Play Audio" id="stopButtonTooltip" name="stopButtonTooltip"></span>
                        </button>
                        <button 
                            type="button" 
                            name="resetButton" 
                            id="resetButton" 
                            class="btn btn-light py-0" 
                            disabled={state.isReset} 
                            on:click={setData} 
                            data-bs-toggle="modal" 
                            data-bs-target="#preview_confirm_modal" 
                            aria-label="Click on this button for override the previous recording"
                        >
                            <span class="icomoon-new-24px-reset-1 position-relative top1" data-bs-toggle="tooltip" data-placement="top" title="Reset Data"></span>
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
<div class="preview_modal_container container">
    <div class="modal fade" id="preview_confirm_modal">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title tokenfield" aria-label="Confirmation Dialog box" tabindex="0">{l.confirm_label}</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" tabindex="0" aria-label="Click on this button for close the confirmation dialog box">&times;</button>
                </div>
                <div class="modal-body tokenfield" tabindex="0" aria-label={areaLabelForPreviewModalContent} id="previewDialogBody" name="previewDialogBody">
                    {l.modal_data}
                </div>
                <div class="modal-footer">
                    <button type="button" class="preview_dismiss_modal btn btn-light pr-2" data-bs-dismiss="modal" on:click={modalResponse} tabindex="0" aria-label="Click on this button for neglecte to override previous recording">{l.no_label}</button>
                    <button type="button" class="preview_dismiss_done btn btn-primary" data-bs-dismiss="modal" on:click={manageData} tabindex="0" aria-label="Click on this button for override the previous recording">{l.yes_label}</button>
                </div>
            </div>
        </div>
    </div>
</div>