<!--
 *  File Name   : AudioRecorder.svelte
 *  Description : Container for AudioRecorder Authoring Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 15-Feb-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount,afterUpdate,beforeUpdate } from "svelte";
    import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
    import l from '../src/libs/editorLib/language';
    export let getChildXml;
    export let xml;
    let recognition;
    let synth;
    let resetClicked = 'no';
    let areaLabelForStopButton;
    let areaLabelForModalContent;
    let areaLabelForRecordButton;
    let timeForRecording = 15;
    let manageTimer, voiceForSpeech;
    let state = {
        language: '',
        cdata: '',
        disabled: true,
        xml: '',
        status: '',
        isReset: true,
        showTranscript: false,
        counter: 0
    } 

    onMount(() => {
        // stores the xml value in xml state
        state.xml = xml;
        loadModule(xml);
    });

    // $: {
    //     if ((xml != state.xml)) {
    //         // stores the xml value in xml state
	// 		state.xml = xml;
    //         loadModule(xml);
    //     }
    // }
    afterUpdate(()=>{
        if ((xml != state.xml)) {
            // stores the xml value in xml state
			state.xml = xml;
            loadModule(xml);
        }
    })
    // load the module according to the value of xml
    function loadModule(loadXml) {
        // contains json data of xml
        let newXml = XMLToJSON(loadXml);
        // parses the xml data and update the xml
        parseXMLAuthoring(newXml);
    }

    // parses the xml data and update the xml
    function parseXMLAuthoring(MYXML) {
        try {
            // used to set the value of the state language from the value of language key of xml json
            state.language = MYXML.smxml._language,
            // used to set the value of the state cdata from the value of cdata key of xml json
            state.cdata = MYXML.smxml.__cdata,
            // used to set the value of the state status from the value of status key of xml json
            state.status = MYXML.smxml._status,
            // used to sets the value of the state disabled to false if the value of 'status' key of xml json is 'recordingStopped' otherwise 'true' 
            state.disabled = ((MYXML.smxml._status == 'recordingStopped') ? false: true),
            // used to set the value of the state isReset from the value of isReset key of xml json
            state.isReset = ((MYXML.smxml._isReset == 'true') ? true: false),
            // used to set the value of the state showTranscript from the value of showTranscript key of xml json
            state.showTranscript = ((MYXML.smxml._showTranscript == 'true') ? true: false);
            // used for update the xml and disabled the element for language selection and to show the transcript checkbox
            checkState();
        } catch(event) {
            console.warn({
                'error': event.message,
                'function name': 'parseXMLAuthoring',
                'File name': 'AudioRecorder.svelte'
            });
        } 
    }

    // assign the value of 'showTranscript' state to target elements checked value
    function handleCheck(event) {
        state.showTranscript = event.target.checked;
        // used for update the xml and disabled the element for language selection and to show the transcript checkbox
        checkState();
    }

    // used for update the xml and disabled the element for language selection and to show the transcript checkbox
    function checkState() {
        //let state_timer = setTimeout(function() {
            // creates the xml according to the value of states: status, language, isReset, showTranscript and cdata
            let xml = '<smxml type="43" name="AudioRecorder" status="' + state.status + '" language="' + state.language + '" isReset="' + state.isReset + '" showTranscript="' + state.showTranscript + '"><!--[CDATA[' + state.cdata + ']]--></smxml>';
            // update the xml
            updateData(xml);
            (state.status != '') ? (
                // disabled the show transcript checkbox and language select dropdown
                AH.select('.disability_apply, #showTranscript').disabled = 'disabled',
                // makes label of language select and show transcript to look like disabled
                AH.selectAll('.transcript_container, .select_label_container label', 'addClass', 'disabledState')
            ) : (
                // enables the show transcript checkbox and language select dropdown
                AH.select('.disability_apply, #showTranscript').disabled = '',
                // makes label of language select and show transcript to look like active
                AH.selectAll('.transcript_container, .select_label_container label', 'removeClass', 'disabledState')
            );
            // used for screen reader to read the message when user reached on play button
            areaLabelForStopButton = AH.select('#authoring_container #stopButton span').getAttribute('data-original-title');
            // used for screen reader to read the message when user reached on record button
            areaLabelForRecordButton = AH.select('#authoring_container #recordButton span').getAttribute('data-original-title');
            // used for screen reader to read the message when user open the reset modalbox
            areaLabelForModalContent = AH.select('#dialogBody').innerText;
            // clear the previously set timeout
        //    clearTimeout(state_timer);
        //}, 100);
    }

    // updates the xml
    function updateData(xml) {
        getChildXml(xml);
    }

    // used for handle the states value
    function handleChange(event) {
        state[event.target.name] = event.target.value;
        // used for update the xml and disabled the element for language selection and to show the transcript checkbox
        checkState();
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
                AH.getBS('#authoring_confirm_modal','Modal').show();
                // focus on reset modalbox for screen reader purpose
                AH.select('.modal-body').focus();
                break;
            default:
                dictate();
                state.status = 'recording';
                state.isReset = false;
                // used for count the second after recording start
                state.counter = 0;
                // used for automatically end the recording after 15 sec
                timeForRecording = 15;
                // ends recording after 15 sec
                manageTime();
                // used for update the xml and disabled the element for language selection and to show the transcript checkbox
                checkState();
                // adds the stop recording icon to record button
                AH.selectAll('#recordButton span', 'removeClass', ['icomoon-circle-2', 's2', 'text-danger']);
                AH.selectAll('#recordButton span', 'addClass', 'icomoon-24px-stop');
        }
    }

    //check that reset button is clicked or not
    function setData() {
        resetClicked = 'yes';
    }

    // called for speak the recorded text
    function playRecording() {
        if (window.speechSynthesis) {
            synth = window.speechSynthesis;
            if (state.cdata != '') {
                // hides the initial state image of the audio container and recording gif
                AH.selectAll('.authRecordingOn, .authInitialState', 'addClass', 'h');
                // shows the play gif
                AH.selectAll('.authAudioPlaying', 'removeClass', 'h');
                state.disabled = true;
                // used for update the xml and disabled the element for language selection and to show the transcript checkbox
                checkState();
                // removes all utterances from the utterance queue.
                //synth.cancel();
                // speak the recorded text after defining some properties value and adding event
                isSpeechSynthesisSupported();
            } else {
                // hides the play and recording gif
                AH.selectAll('.authRecordingOn, .authAudioPaused', 'addClass', 'h');
                // shows the initial state image of the audio container
                AH.selectAll('.authInitialState', 'removeClass', 'h');
                // message for no data recorded
                AH.alert(l.no_data_msg);
            }
        } else {
            // message for not supported speechSynthesis
            AH.alert(l.browser_support_msg);
            return;
        }
    }

    // speak the text after defining some properties value and adding event
    function isSpeechSynthesisSupported() {
        // Returns a new SpeechSynthesisUtterance object instance
        let utterThis = new SpeechSynthesisUtterance(state.cdata);
        // sets the voice name according to the value of language state
        let voice_name = ((state.language == 'de-DE') ? "Google Deutsch" : (state.language == 'fr-FR') ? "Google français" : (state.language == 'es-ES') ? "Google español" : (state.language == 'hi-IN') ? "Google हिन्दी": (state.language == 'ja-JP') ? "Google 日本語": (state.language == 'ko-KR') ? "Google 한국의": (state.language == 'it-IT') ? "Google italiano": "Google US English");
        // event listener fired when the utterance has finished being spoken.
        utterThis.addEventListener('end', function() {
            // hides the gif of recording and play
            AH.selectAll('.authAudioPlaying, .authRecordingOn', 'addClass', 'h');
            // shows the initial state image of the audio container
            AH.selectAll('.authInitialState', 'removeClass', 'h');
            // enables the play button
            state.disabled = false;
            // used for update the xml and disabled the element for language selection and to show the transcript checkbox
            checkState();
            // removes all utterances from the utterance queue.
            synth.cancel();
        });
        // array of available voices
        setTimeout(function () {
            voiceForSpeech = synth.getVoices();
            for (let index_no = 0; index_no < voiceForSpeech.length; index_no++) {
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
                }
            }
        }, 10);
    }

    // stops capturing incoming audio
    function stopRecording() {
        // handles with gif of recording and play and icon of record button
        manageStopStatus();
        // clears the timeout which is started when recording stared
        clearTimeout(manageTimer);
        // change the value of status state
        state.status = 'recordingStopped';
        // change the value of disabled state to false that enables the play button
        state.disabled = false;
        // used for update the xml and disabled the element for language selection and to show the transcript checkbox
        checkState();
        // shows the initial view of the audio container
        AH.select('.authInitialState', 'removeClass', 'h');
        /* stops the speech recognition service from listening to incoming audio, and attempts to return a SpeechRecognitionResult using the audio captured so far. */
        recognition.stop();
    }

    // handles with gif of recording and play and icon of record button
    function manageStopStatus() {
        // hides the gif of recording and playing
        AH.selectAll('.authAudioPlaying, .authRecordingOn', 'addClass', 'h');
        // shows the initial state image of the audio container
        AH.selectAll('.authInitialState', 'removeClass', 'h');
        // removes the stop icon from recording button and adds start recording icon
        AH.selectAll('#recordButton span', 'removeClass', 'icomoon-24px-stop');
        AH.selectAll('#recordButton span', 'addClass', ['icomoon-circle-2', 's2', 'text-danger']);
    }

    // reset the previous recorded data
    function manageData() {
        // when reset modalbox open after click on reset button
        if (resetClicked == 'yes') {
            // reset the previously recorded data
                resetAudioData();
            
            resetClicked = 'no';
        } else {
            // when reset modalbox open after click on record button
            state.cdata = '',
            // disabled the play button
            state.disabled = true,
            state.status = '';
            // used for update the xml and disabled the element for language selection and to show the transcript checkbox
            checkState();
            let manage_data_timer = setTimeout(function() {
                // called for start the recording
                startRecording();
                // clear the timeout
                clearTimeout(manage_data_timer);
            }, 120);
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
                    clearTimeout(manageTimer);
                    // shows message that recording ended
                    AH.alert(l.recording_ended);
                    // handles with gif of recording and play and icon of record button
                    manageStopStatus();
                    // shows the initial state image of the audio container
                    AH.selectAll('.authInitialState', 'removeClass', 'h');
                    state.status = 'recordingStopped';
                    // enables the play button
                    state.disabled = false;
                    // used for update the xml and disabled the element for language selection and to show the transcript checkbox
                    checkState();
                }
            });
        } else {
            // shows the message that SpeechRecognition not supported
            AH.alert(l.browser_support_msg);
            return;
        }
    }

    // ends recording after 15 sec
    function manageTime() {
        timeForRecording = timeForRecording - 1;
        state.counter = state.counter + 1;
        manageTimer = setTimeout(function() {
            if (timeForRecording > 0) {
                // calls again the method manageTime for counting the second value
                manageTime();
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
        AH.select('#resetButton').disabled = '';
        // hides the initial state image of the audio container and play gif
        AH.selectAll('.authAudioPlaying, .authInitialState', 'addClass', 'h');
        // shows recording gif
        AH.selectAll('.authRecordingOn', 'removeClass', 'h');
        /* The onresult property of the SpeechRecognition interface represents an event handler that will run when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app */
        recognition.onresult = (event) => {
            let speechToText = '';
            for (let index_no = 0; index_no < event.results.length; index_no = index_no + 1) {
                speechToText += event.results[index_no][0].transcript;
            }
            // sets the value of textual data into cdata state that is recognised by SpeechRecognition
            state.cdata = speechToText.trim();
            // used for update the xml and disabled the element for language selection and to show the transcript checkbox
            checkState();
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
        
        state.language = '';
        state.cdata = '';
        state.disabled = true;
        state.xml = '';
        state.status = '';
        state.isReset = true;
        // clears the timeout which is started when recording stared
        clearTimeout(manageTimer);
        
        // used for update the xml and disabled the element for language selection and to show the transcript checkbox
        checkState();
    } 

    // reset the data of 'resetClicked' to 'no' when no button is clicked in modalbox
    function modalResponse() {
        resetClicked = 'no';
    } 

    // for ada checkbox
    function adaKeyupCheckbox(e) {
        if (e.keyCode == 13) {
            handleCheck(e);
        }
    }
</script>
<div id="authoring_container" class="container">
    <div class="row">
        <div class="col-12" tabindex="0" aria-label="Recording will end after 15 sec">
            <b class="noteColor bolder">{l.note_label}</b>
            {l.recording_warning}
        </div>
        <div class="col-6 py-2 mb-1">
            <div class="pb-2"><b>{l.spoken_label}</b></div>
            <textarea id="data_container" disabled="disabled" name="cdata" class="form-control" rows="3" cols="75" on:change={handleChange} value={state.cdata} aria-label={l.spoken_label + " " + ((state.cdata != "") ? state.cdata: "Nothing")}></textarea>
        </div>
        <div class="col-6 py-2 mb-1">
            <div class="select_label_container">
                <label for="language_select"><b>{l.select_lang}</b></label>
            </div>
            <select id="language_select" name="language" class="disability_apply form-control form-control-sm" on:change={handleChange} on:blur={handleChange} value={state.language} aria-label="Select the language for Recording">
                <option value="en-US" aria-label="English United States">{l.english_us}</option>
                <option value="de-DE" aria-label="German">{l.german_lang}</option>
                <option value="fr-FR" aria-label="French">{l.french_lang}</option>
                <option value="es-ES" aria-label="Spanish">{l.spanish_lang}</option>
                <option value="hi-IN" aria-label="Hindi">{l.hindi_lang}</option>
                <option value="ja-JP" aria-label="Japanese">{l.japanese_lang}</option>
                <option value="ko-KR" aria-label="Korean">{l.korean_lang}</option>
                <option value="it-IT" aria-label="Italian">{l.italiano}</option>
            </select>
            <div class="form-check form-check-inline transcript_container mt-3">
                <label for="showTranscript" class="custom_checkbox_new float-left mr-1">
                    <input 
                        type="checkbox" 
                        on:click={handleCheck}
                        on:keyup={adaKeyupCheckbox}
                        name="showTranscript" 
                        id="showTranscript"
                        tabindex="0"
                        class="form-check-input"
                        checked={state.showTranscript}
                    >
                    <div class="check_mark_custom pt-sm1"></div>
                </label>
                <label for="showTranscript" class="form-check-label">{l.show_transcript}</label>
            </div>
        </div>
        <div class="col-12 col-md-8 offset-md-2">
            <div class="border rounded shadow-sm">
                <div class="p-2 tokenfield bg-light mb-3" aria-label="Audio Recorder" tabindex="0">
                    <b>{l.audio_recorder}</b>
                </div>
                <div class="mx-auto text-danger recording_status initialState mb-3 d-flex mx-auto">
                    <span class="align-self-center mx-auto authInitialState tokenfield" aria-label="Click on record to start recording" tabindex="0">{l.starting_message}</span>
                    <div class="h authRecordingOn w-100 h-100 tokenfield" aria-label="recording is on" tabindex="0">
                        <img src="//s3.amazonaws.com/jigyaasa_content_static/6ba174bf48e9b6dc8d8bd19d13c9caa9_000Awg.gif" alt="recording is on" class="w-100 h-100 img_fit"/>
                    </div>
                    <div class="h authAudioPlaying w-100 h-100 tokenfield" aria-label="Audio is playing" tabindex="0">
                        <img src="//s3.amazonaws.com/jigyaasa_content_static/giphy_000AYi.gif" alt="audio is playing" class="w-100 h-100 img_fit"/>
                    </div>
                </div>
                <div id="controls_container" class="bg-light text-center w-100 p-2">
                    <button 
                        type="button" 
                        name="recordButton" 
                        id="recordButton" 
                        on:click={startRecording} 
                        class="btn btn-light py-0" 
                        aria-label={"Click for " + areaLabelForRecordButton}
                    >
                        <span class="icomoon-circle-2 s2 text-danger position-relative top1" data-bs-toggle="tooltip" data-placement="top" data-original-title={((state.status == "recording") ? "Stop Recording": "Start Recording")}></span>
                    </button>
                    <button 
                        type="button" 
                        name="stopButton" 
                        id="stopButton" 
                        on:click={playRecording} 
                        disabled={state.disabled} 
                        class="btn btn-light py-0" 
                        aria-label={"Click for " + areaLabelForStopButton}
                    >
                        <span class="icomoon-24px-autoplay-4 position-relative top1" data-bs-toggle="tooltip" data-placement="top" data-original-title="Play Audio"></span>
                    </button>
                    <button 
                        type="button" 
                        name="resetButton" 
                        id="resetButton" 
                        on:click={setData} 
                        class="btn btn-light py-0" 
                        disabled={state.isReset} 
                        data-bs-toggle="modal" 
                        data-bs-target="#authoring_confirm_modal" 
                        aria-label="Click on this button for override the previous recording"
                    >
                        <span class="icomoon-new-24px-reset-1 position-relative top1" data-bs-toggle="tooltip" data-placement="top" title="Reset Data"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="authoring_modal_container container">
    <div class="modal fade" id="authoring_confirm_modal">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title tokenfield" aria-label="Confirmation Dialog box" tabindex="0">{l.confirm_label}</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" tabindex="0" aria-label="Click on this button for close the confirmation dialog box">&times;</button>
                </div>
                <div class="modal-body tokenfield" tabindex="0" aria-label={areaLabelForModalContent} id="dialogBody" name="dialogBody">
                    {l.modal_data}
                </div>
                <div class="modal-footer">
                    <button type="button" class="authoring_dismiss_modal btn btn-light pr-2" data-bs-dismiss="modal" on:click={modalResponse} tabindex="0" aria-label="Click on this button for neglecte to override previous recording">{l.no_label}</button>
                    <button type="button" class="authoring_dismiss_done btn btn-primary" data-bs-dismiss="modal" on:click={manageData} tabindex="0" aria-label="Click on this button for override the previous recording">{l.yes_label}</button>
                </div>
            </div>
        </div>
    </div>
</div>