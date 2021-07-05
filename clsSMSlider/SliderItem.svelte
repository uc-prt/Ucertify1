<!--
 *  File Name   : SliderItem.svelte
 *  Description : Container for Slider Authoring Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 19-Jan-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount } from "svelte";
	import l from '../src/libs/editorLib/language';
    import InputItem from './inputItem.svelte';
	import { writable } from "svelte/store";
	import { XMLToJSON, AH, JSONToXML } from '../helper/HelperAI.svelte';
    import SliderButton from "./SliderButton.svelte";
    let sliderData = "";
    let localSliderData = [];
    let isValidationOK = true;
    let target_id = '';
    export let xml;
    export let getChildXml;
    let state = {};
    let authordata = writable({ 
        xml: {},
        acorrect: {},
        adefault: {},
        aanswer: {},
        astep: {},
        formkey: ''
    });

    const unsubscribe = authordata.subscribe((items) => {
		state = items;
    })
    $: {
        if (xml!=state.xml) {
			state.xml = xml
			loadModule(xml); 	
		}
    }
    onMount(() => {
        state.xml = xml;
        loadModule(xml);
    });

    // loads the module and update the xml
    function loadModule(loadXml) {
        // contains the json data of xml
        loadXml = XMLToJSON(loadXml);
        // parses the xml and updates the sliders elements value
        parseXMLAuthoring(loadXml);
    }

    // parses the xml and updates the values of sliders elements
    function parseXMLAuthoring(SLIDERXML) {
        // contains array of slider object
        sliderData = SLIDERXML.smxml.slider;
        // empties an array firstly for storing the data to update the values of sliders elements
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
                sliderid: sliderData[i]._key,
                // used to set the id of the range element at index 'i'
                sliderid1: "a_" + sliderData[i]._key,
                // used to set the value of range and of the element have class slideroutput  at index 'i'
                anskey: sliderData[i]._anskey,
                // used to set the title value of the slider at index 'i'
                title_val: sliderData[i]._title,
                // used to set the step value of the slider at index 'i'
                step_val: sliderData[i]._step,
                // used to set the default value of the slider at index 'i'
                defaultans: sliderData[i]._defaultans,
                // used to set the id of default element of the slider at index 'i'
                defaultans_id: "defaultans" + sliderData[i]._key,
                // used to set the id of title element of the slider at index 'i'
                title_id: "title" + sliderData[i]._key,
                // used to set the id of step element of the slider at index 'i'
                step_id: "step" + sliderData[i]._key,
                // used to set the id and name of the hidden element have class sliderans of the slider at index 'i'
                sliderans: "slider" + sliderData[i]._key,
                // used to set the id of delete button of the slider at index 'i'
                remove_item: "remove_item" + sliderData[i]._key,
                // used to set the id of min element of the slider at index 'i'
                minid: "min" + sliderData[i]._key,
                // used to set the id of max element of the slider at index 'i'
                maxid: "max" + sliderData[i]._key,
                // used to set the id of correct element of the slider at index 'i'
                sliderop: "sliderop" + sliderData[i]._key,
                // used to set the min value of the slider at index 'i'
                minval: sliderData[i]._minmax.split(",")[0],
                // used to set the max value of the slider at index 'i'
                maxval: sliderData[i]._minmax.split(",")[1],
            });
            localSliderData= localSliderData;
        }
    }

    // updates the xml when the value of any elements changed
    function updateXmlValue(eve) {    
        let index = eve.detail.index;
        let e = eve.detail.value;
        let selector = eve.detail.func;
        // contains the target element's value
        let value = eve.detail.value.target.value;
        // contains the json data of state xml
        let xml = XMLToJSON(state.xml);
        // assign the value of slider key of xml json into variable sliderData
        sliderData = xml.smxml.slider;
        if (sliderData) {
            if (Array.isArray(sliderData) == false) {
                // creates an array for key slider of xml json
                xml.smxml.slider = [];
                // assign the value of index zero of slider key array of xml json
                xml.smxml.slider[0] = sliderData;
            }
        } else if (typeof (sliderData) == 'string') {
            // makes the value of slider key of xml json to empty
            xml.smxml.slider = [];
        }

        switch (selector) {
            case "setTitle":
                // sets the value of title key at given index of slider key of xml json 
                xml.smxml.slider[index]._title = value;
                break;
            case "setStep":
                // sets the value of step key at given index of slider key of xml json 
                xml.smxml.slider[index]._step = value;
                break;
            case "setDefault":
                let target_value_current = parseInt(eve.detail.value.target.value);
                // sets the value of defaultans key at given index of slider key of xml json after converting the target element's value in integer 
                xml.smxml.slider[index]._defaultans = target_value_current;
                break;
            case "setDefaultOnBlur":
            case "setMinOnBlur":
            case "setMaxOnBlur":
                isValidationOK = true;
                target_id = '';
                // contains the value of target element after converting it into integer
                let target_value = parseInt(eve.detail.value.target.value);
                // contains the min value of target element after converting it into integer
                let target_min = parseInt(eve.detail.value.target.min);
                // contains the max value of target element after converting it into integer
                let target_max = parseInt(eve.detail.value.target.max);
                if ((target_value > target_max) || (target_value < target_min)) {
                    //eve.detail.value.target.focus();
                    //AH.select('#'+eve.detail.value.target.id).focus();
                    // shows the warning message if value exceeds it's max value
                    AH.alert("Value must be greater than or equal to " + target_min + " and less than or equal to " + target_max);
                    isValidationOK = false;
                    target_id = eve.detail.value.target.id;
                } else {
                    // array containing min and max value at index 0 and 1 of slider at given index
                    let minmax_data = xml.smxml.slider[index]._minmax.split(',');
                    // contains min value after parsing it into integer
                    let min_data = parseInt(minmax_data[0]);
                    // contains max value after parsing it into integer
                    let max_data = parseInt(minmax_data[1]);
                    // contains defaultans value of slider at given index after parsing it into integer
                    let default_data = parseInt(AH.select('#defaultansID' + index).value);
                    if ((selector == "setMinOnBlur") && (min_data > max_data)) {
                        // focus the min field
                        //eve.detail.value.target.focus();
                        //AH.select('#'+eve.detail.value.target.id).focus();
                        // warning message if min field value is greater than max field value of slider at given index
                        AH.alert("Minimum value must be less than or equal to the maximum value.");
                        isValidationOK = false;
                        target_id = eve.detail.value.target.id;
                    } else if ((selector == "setMaxOnBlur") && (min_data > max_data)) {
                        // focus the max field
                        //eve.detail.value.target.focus();
                        //AH.select('#'+eve.detail.value.target.id).focus();
                        // warning message if max field value is less than min field value of slider at given index
                        AH.alert("Max value must be greater than or equal to min value");
                        isValidationOK = false;
                        target_id = eve.detail.value.target.id;
                    } else if ((min_data <= max_data) && ((default_data > max_data) || (default_data < min_data))) {
                        // warning message if min and max field value is ok but the value of defaultans field of slider at given index is either greater than th value of max or less than the value of min field
                        AH.alert("Value must be greater than or equal to " + min_data + " and less than or equal to " + max_data);
                        // focus the defaultans field of slider at given index
                        AH.select('#defaultansID' + index).focus();
                        isValidationOK = false;
                        target_id = 'defaultansID' + index;
                    }
                }
                break;
            case "setMin":
            case "setMax":
                // contains the value of target element after parsing it into integer
                value = parseInt(eve.detail.value.target.value);
                // array containing min and max value at index 0 and 1 of slider at given index
                let minmax = xml.smxml.slider[index]._minmax.split(',');
                if (selector == "setMin") {
                    // assign the value of min field at index 0 of array minmax
                    minmax[0] = value;
                } else {
                    // assign the value of max field at index 1 of array minmax
                    minmax[1] = value;
                }
                // joins the minmax array into string separated by comma
                minmax = minmax.join(',');
                // assign the value of minmax string into the value of minmax key of slider key at given index of xml json
                xml.smxml.slider[index]._minmax = minmax;
                break;
            case "delete":
                // close the delete confirmation dialog box
                AH.getBS('#delete_modal','Modal').hide();
                if (xml.smxml.slider.length > 1) {
                    // removes given index slider from slider key array of xml json
                    xml.smxml.slider.splice(index, 1);
                    // used for reset the id of the Sliders
                    for (let index_no = 0; index_no < xml.smxml.slider.length; index_no += 1) {
                        xml.smxml.slider[index_no]._key = 'ID' + index_no;
                    }
                } else {
                    AH.alert("You can not delete the default slider");
                }
                break;
            case "add":
                if (xml.smxml.slider.length < 10) {
                    // adds the slider at index 'xml.smxml.slider.length' in slider key array of json xml
                    xml.smxml.slider[parseInt(xml.smxml.slider.length)] = {
                        '_key': "ID" + xml.smxml.slider.length,
                        '_minmax': "0,100",
                        '_step': "1",
                        '_title': "",
                        '_anskey': "0",
                        '_defaultans': "0",
                    };
                } else {
                    AH.alert("You can not add more than 10 sliders");
                }
                break;
            case "setAnswer":
                // sets the value for correct answer of the slider at given index in slider key array of json xml
                xml.smxml.slider[index]._anskey = value;
        }
        // update the xml after converting json xml into xml
        getChildXml(JSONToXML(xml));
    }
</script>
<div id="mainslider" class="border">
    <div class="slider_item_container">
        {#each localSliderData as data, i}
            <div key={i} class="clearfix slider_container shadow-sm slider_container mb-3 rounded">
                <div class="slider_heading pt-sm text-white font-weight-bold bg-primary">
                    <span class="slider_title float-start ml-3"> {i + 1}</span>
                    <span
                        class="removeitem icomoon-24px-delete-1 height21 float-end {(isValidationOK) ? '' : 'pointer_event_none'}"
                        id={data.remove_item}
                        on:click={() => { (isValidationOK) && (state.formkey= i);AH.getBS('#delete_modal','Modal').show(); } }
                        tabindex="0"
                        data-bs-toggle="tooltip"
                        title="Delete item"
                    >
                    </span>
                </div>
                <div class="col-md-12 select_slider pt-4 px-3 pb-2">
                    <InputItem 
                        classVal={((isValidationOK) ? '' : 'cursor_not_allowed')}
                        id={data.title_id}
                        value={data.title_val}
                        key={i}
                        on:updateXmlValue = {updateXmlValue}
                        funcChange={'setTitle'}
                        inputText=1
                    />
                    <InputItem 
                        classVal={((isValidationOK) ? '' : 'cursor_not_allowed')}
                        id={data.sliderid1}
                        value={data.anskey}
                        defaultValue={data.defaultans}
                        key={i}
                        step={data.step_val}
                        on:updateXmlValue = {updateXmlValue}
                        funcChange={'setAnswer'}
                        min={data.minval}
                        max={data.maxval}
                        inputRange=1
                        disabledValue={((isValidationOK) ? '' : true)}
                    />
                    <div class="clear-both mt-2">
                        <InputItem 
                            label={l.min_val} 
                            classVal="slidermin"
                            name="minval"
                            id={data.minid}
                            value={data.minval}
                            min={0}
                            max={999}
                            key={i}
                            on:updateXmlValue = {updateXmlValue}
                            funcChange={'setMin'}
                            funcBlur={'setMinOnBlur'}
                            disabledValue = {(((target_id.indexOf('minID') < 0) && (target_id != '')) ? 'disabled' : (((target_id != data.defaultans_id) && (target_id != '')) ? 'disabled' : false))}
                        />
                        <InputItem 
                            label={l.max_val} 
                            classVal="slidermax"
                            name="maxval"
                            id={data.maxid}
                            value={data.maxval}
                            min={data.minval}
                            max={999}
                            key={i}
                            on:updateXmlValue = {updateXmlValue}
                            funcChange={'setMax'}
                            funcBlur={'setMaxOnBlur'}
                            disabledValue = {(((target_id.indexOf('maxID') < 0) && (target_id != '')) ? 'disabled' : (((target_id != data.defaultans_id) && (target_id != '')) ? 'disabled' : false))}
                        />
                        <InputItem 
                            label={l.default} 
                            classVal="sliderdefaultans"
                            name="defaultans"
                            id={data.defaultans_id}
                            value={data.defaultans}
                            min={data.minval}
                            max={data.maxval}
                            key={i}
                            on:updateXmlValue = {updateXmlValue}
                            funcChange={'setDefault'}
                            funcBlur={'setDefaultOnBlur'}
                            disabledValue = {(((target_id.indexOf('defaultansID') < 0) && (target_id != '')) ? 'disabled' : (((target_id != data.defaultans_id) && (target_id != '')) ? 'disabled' : false))}
                        />
                        <InputItem 
                            label={l.step} 
                            classVal="sliderstep"
                            name="stepval"
                            id={data.step_id}
                            value={data.step_val}
                            min=0
                            max=5
                            key={i}
                            on:updateXmlValue = {updateXmlValue}
                            funcChange={'setStep'}
                            funcBlur={'setDefaultOnBlur'}
                            disabledValue = {((isValidationOK) ? false : true)}
                        />
                        <div class="float-start mb-2 pr-2 width100">
                            <label for={data.sliderop} class="pr-4 me-3 mb-0">{l.correct}</label>
                            <div class="slideroutput mt-0 text-center">
                                <output
                                    for={data.sliderid}
                                    id={data.sliderop}
                                    class="slideropt position-relative"
                                >
                                    {data.anskey}
                                </output>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" name={data.sliderans} id={data.sliderans} class="sliderans" />
                </div>
            </div>
        {/each}
    </div>
    <div class="slider_head_content pb-3 text-start pl-3 pt-0 ms-1">
        <div>
            <SliderButton 
                classVal="add-option btn btn-outline-primary btn-sm pr-2"
                on:updateXmlValue = {updateXmlValue}
                funcClick={'add'}
                disabledValue = {((isValidationOK) ? false : true)}
                buttonName={l.add_slider}
            />
        </div>
    </div>
</div>
<input type="hidden" id="special_module_xml" value={state.xml} />

<div class="modal" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered span4">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{l.save_header}</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div class="modal-body text-center">
                <div class="row">
                    <span class="col-md-12">{l.del_confirmation}</span>
                </div>
            </div>
            <div class="modal-footer mt-0">
                <button type="button" id="cancel_btn" class="btn btn-light" data-bs-dismiss="modal">{l.no_label}</button>
                <SliderButton 
                    classVal="btn btn-primary"
                    id="ok_btn"
                    key={state.formkey}
                    on:updateXmlValue = {updateXmlValue}
                    funcClick={'delete'}
                    buttonName={l.yes_label}
                    modalbtn=1
                />
            </div>
        </div>
    </div>
</div>