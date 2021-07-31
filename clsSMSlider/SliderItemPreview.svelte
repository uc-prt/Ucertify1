<!--
 *  File Name   : SliderItemPreview.svelte
 *  Description : Container for Slider preview Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 19-Jan-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount } from "svelte";
    import l from '../src/libs/editorLib/language';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import { AH, XMLToJSON, onUserAnsChange } from '../helper/HelperAI.svelte';
    import './css/slider.min.css';

    export let xml;
    export let uxml;
    export let showAns;
    export let isReview;
    export let editorState;
    let localSliderData = [], userAnsXML, user_ans_tab = true ;
    let state = {
        datauserans: {}
    };
    let targetView      = "none";
    let result, onError = "";
    $: {
		if (isReview) {
            targetView = "block";
            // display the correct or incorrect according to the answer matched
            displayAns();
            setReview();
		} else {
            targetView = "none";
        }
        if (xml != state.xml) {
            // update the value of state 'xml'
            state.xml = xml;
            // updates the value of sliders elements and load the module
            loadModule(xml);

            // used to contain the json data of previous xml and next xml
            let oldjsonraw, newjsonraw;
            // assign the json data of previous xml into variable 'oldjsonraw'
            oldjsonraw = XMLToJSON(xml == "" ? state.xml : xml);
            // assign the json data of next xml into variable 'newjsonraw'
            newjsonraw = XMLToJSON(state.xml);
            // contains the array of json object having key slider of json oldjsonraw
            let oldjson = jsontoArray(oldjsonraw.smxml.slider);
            // contains the array of json object having key slider of json newjsonraw
            let newjson = jsontoArray(newjsonraw.smxml.slider);
            oldjson.map(function (data, i) {
                if (newjson[i] != undefined) {
                    if (data._defaultans != newjson[i]._defaultans) {
                        /* updates the value of state 'datauserans' having key  'data.key' to the value of slider key at index 'i' of json jsonraw */
                        state.datauserans[data._key] = newjson[i]._defaultans;
                    }
                }
            })
            if (uxml) {
                let uaXML;
                // converts user answer xml into json object and assign the value to uaXML variable
                uaXML = XMLToJSON(uxml);
                if (typeof (uaXML.smans.slider) != "undefined") { //@sneh: added this line because map function was generating error in quiz player
                    localSliderData.map(function (data, i) {
                        // updates the value of array state datauserans at defined index with the value of slider's key array at index 'i' of json uaXML 
                        state.datauserans[data.sliderid] = uaXML.smans.slider[i]._userAns;
                    });
                }
            }
        }
	}
    // function loadLibs() {
    //     let config = {
    //         preload: true,
    //         type: 'stylesheet',
    //         as: 'style'
    //     }
    //     AH.createLink(window.itemFolder + 'clsSMSlider/css/slider.min.css', config);
		
    // }
    onMount(() => {
        //loadLibs();
        loadModule(xml);
        // used for native team
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
    });

    // converts json into array
    function jsontoArray(obj) {
        if (Array.isArray(obj) == false) {
            // contains json data
            let temp = obj;
            // creates array
            obj = [];
            // assign the json data at index 0 
            obj[0] = temp;
        }
        // returns an array containing json data
        return obj;
    }

    //checked
    // updates the value of sliders elements and load the module
    function loadModule(loadXml) {
        loadXml = XMLToJSON(loadXml);
        // parses the xml and updates the values of sliders elements
        parseXMLPreview(loadXml);
    }

    //checked
    // parses the xml and updates the values of sliders elements
    function parseXMLPreview(SLIDERXML) {
        try {
            // contains array of slider object
            let sliderData = SLIDERXML.smxml.slider;
            // creates an array for storing the data to update the values of sliders elements
            localSliderData = [];
            if (sliderData) {
                if (Array.isArray(sliderData) == false) {
                    // creates an array
                    sliderData = [];
                    // assign the value of slider key at index zero
                    sliderData[0] = SLIDERXML.smxml.slider;
                }
            }
            for (let i = 0; i < sliderData.length; i++) {
                localSliderData.push({
                    // used to set the id of the range element of the slider at index 'i'
                    sliderid: sliderData[i]._key,
                    // used to set the value of range element of slider at index 'i' when correct answer button is clicked
                    anskey: sliderData[i]._anskey,
                    // used to set the title value of the slider at index 'i'
                    title_val: sliderData[i]._title,
                    // used to set the step value of the slider at index 'i'
                    step_val: sliderData[i]._step,
                    // used to set the default value of the slider at index 'i'
                    defaultans: sliderData[i]._defaultans,
                    // not used any where so can be remove it
                    defaultans_id: "defaultans" + sliderData[i]._key,
                    // not used any where so can be remove it
                    title_id: "title" + sliderData[i]._key,
                    // not used any where so can be remove it
                    step_id: "step" + sliderData[i]._key,
                    // not used any where so can be remove it
                    sliderans: "slider" + sliderData[i]._key,
                    // not used any where so can be remove it
                    remove_item: "remove_item" + sliderData[i]._key,
                    // not used any where so can be remove it
                    minid: "min" + sliderData[i]._key,
                    // not used any where so can be remove it
                    maxid: "max" + sliderData[i]._key,
                    sliderop: "sliderop" + sliderData[i]._key,
                    // used to define the min value of the range element and value of label min of slider at index 'i'
                    minval: sliderData[i]._minmax.split(",")[0],
                    // used to define the max value of the range element and value of label max of slider at index 'i'
                    maxval: sliderData[i]._minmax.split(",")[1],
                });
            }
        } catch (error) {
            onError = error;
            console.log({
                'error': error,
                'function': 'parseXMLPreview',
                'File': 'SliderItemPreview.js'
            });
        }
    }

    // display the correct or incorrect according to the answer matched
    function displayAns() {
        // contains correct or incorrect according to the return value of checkAns method
        let ans = checkAns();
        if (editorState) {
            // shows the answer correct or incorrect according to the value of variable 'ans'
            showAns(ans);
        }
    }

    /* defines the user answer xml, checks the answer and returns correct or incorrect according to the match of result */
    function checkAns() {
        // used for switch on next question in prepengine if current question is attempted
        ISSPECIALMODULEUSERXMLCHANGE = 1;
        // used to create user answer xml
        userAnsXML = "<smans type='30'>";
        result = true;
        localSliderData.map(function (data) {
            state.datauserans[data.sliderid] = (state.datauserans[data.sliderid]) === undefined ? data.defaultans : state.datauserans[data.sliderid];
            if (parseInt(data.anskey) != parseInt(state.datauserans[data.sliderid])) {
                result = false;
            } 
            userAnsXML += "<slider id='" + data.sliderid + "' userAns='" + state.datauserans[data.sliderid] + "'></slider>";
        });
        userAnsXML += "</smans>";
        // defined this condition for not update the user answer xml if user has not performed anything
        // if (localSliderData.length > 0) {
        //     // defines the user answer xml
        //     uxml = userAnsXML;
        // }
        if(!editorState) {
            onUserAnsChange({uXml: userAnsXML, ans: result});
        }
        if (result) {
            //AH.select("#answer").checked = true; //@sneh : this was commented that's why in quiz player answer was not recording
            return "Correct";
        } else {
            //AH.select("#answer").checked = false; //@sneh : this was commented that's why in quiz player answer was not recording
            return "Incorrect";
        }
    }

    // change the value of state datauserans after changing the value of slider range
    function handleRange() {
        // updates the value of state datauserans at given key 
        state.datauserans[this.id] = this.value;
        // updates the value of state datauserans
        state.datauserans = state.datauserans;
        // display the correct or incorrect according to the answer matched
        displayAns();
    }

    //checked
    // checks and show the answer, shows correct answer and your answer button and not allow the user to perform the task
    function setReview() {
        targetView = "block";
        isReview = true;
    }

    //checked
    // allow the user to perform the task and hides correct answer and your answer button
    function unsetReview() {
        targetView = "none";
        isReview = false;
    }

    //checked
    function handleReviewMode(mode) {
        if (mode == 'c') {
            user_ans_tab = false;
        } else if (mode == 'u') {
            user_ans_tab = true;
        }
    }
    
</script>
{#if onError != "" }
    <div class="alert alert-danger font-weight-bold">
        <span>{l.oops_msg} </span>
    </div>
{/if}
<div class="text-center">
    <ItemHelper 
        on:setReview = {setReview}
        on:unsetReview = {unsetReview}
        reviewMode={isReview}
        handleReviewClick = {handleReviewMode}
    />
    <div id="slidermain">
        <div class="slider_item_container">
            {#each localSliderData as data, i}
                <div key={i} class="clearfix slider_container my-3 rounded w-100">
                    <div class="slider_heading_test text-start text-white bg-primary" tabindex="0">
                        <span> {data.title_val}</span>
                    </div>
                    <div class="col-md-12 select_slider_test w-100 pt-3 px-3 pb-2">
                        <input
                            id={data.sliderid}
                            type="range"
                            name="sliderrange"
                            min={data.minval}
                            max={data.maxval}
                            step={data.step_val}
                            class="slideritem"
                            value={(targetView == "block" && user_ans_tab == false) ? parseInt(data.anskey) : (state.datauserans[data.sliderid] == 0 || state.datauserans[data.sliderid] == undefined) ? parseInt(data.defaultans) : parseInt(state.datauserans[data.sliderid])}
                            disabled={targetView == 'block' ? true : false}
                            on:input={handleRange}
                            tabindex="0"
                        />
                        {#if (targetView == "block" && user_ans_tab == true)}
                            {#if data.anskey == state.datauserans[data.sliderid]}
                                <span class="correct_incorrect_icon_fill position-absolute">
                                    <span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold text-success"></span>
                                </span>
                            {:else}
                                <span class="correct_incorrect_icon_fill position-absolute">
                                    <span class="icomoon-new-24px-cancel-circle-1 font-weight-bold text-danger"></span>
                                </span>
                            {/if}
                        {/if}
                        <div class="range_details mt-2 row mx-0">
                            <div class="minRange float-start col px-0 text-start" tabindex="0">
                                <span>{l.min_val}: {data.minval}</span>
                            </div>
                            <div class="rangevalue col px-0" tabindex="0">
                                <div class="current_val">
                                    {#if !(targetView == "block" && user_ans_tab == false)}
                                        <span>{l.current_val}: {(state.datauserans[data.sliderid] == 0  || state.datauserans[data.sliderid] == undefined) ? (data.defaultans) : (state.datauserans[data.sliderid])} </span>
                                    {:else}
                                        <span> {l.correct_val}: {data.anskey} </span>
                                    {/if}
                                </div>
                            </div>
                            <div class="max_val float-end col px-0 text-end" tabindex="0">
                                <span> {l.max_val}: {data.maxval} </span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
