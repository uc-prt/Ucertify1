<!--
 *  File Name   : GraphPreview.svelte
 *  Description : Responsible for Preview Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : clsSMGRAPH (Preview)
 *  Last update : 02-Mar-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, beforeUpdate, onMount } from 'svelte';
    import l from '../src/libs/Lang';
    import { writable } from "svelte/store";
    
    import ItemHelper from '../helper/ItemHelper.svelte';
	import { XMLToJSON, AH, onUserAnsChange } from '../helper/HelperAI.svelte';
    import GRAPH from './lib/mathString';

    export let xml;
	export let uxml;
	export let isReview;
	export let showAns;
	export let editorState;
    let state = {};
    let preview_store = writable({
		xml : "",
        QXML: "",
        userAns_data: "",
        moduleType : "none",
        noOfRow: 1,
        review: false,
        init : false,
        open: false,
        modalViewLayout: [],
        checked: true,
	});

    const unsubscribe = preview_store.subscribe(value => {
		state = value;
	});

    // functions responsible for loading the module
    beforeUpdate(async() => {
        if (!state.init) {
            if (typeof (JXG) == 'object' && editorState) {
                state.init = true;
            } else if (typeof(editorState) == 'undefined') {
                AH.addScript('', itemUrl + 'clsSMGraph/lib/jsxgraph.min.js', {callback: function () {
                    state.init = true;
                }});
            }
        }
        if (editorState && editorState.stopPreviewUpdate) {
            xml = AH.select('#special_module_xml').value;
        }
        if (state.init && state.xml != xml) {
            loadModule(xml);
        }
    })

    // functions responsible for doing the changes according to the xml
    afterUpdate(async() => {
        if (state.init) {
            if (state.xml != xml) {
                if (editorState) {
                    // resetting the answer
                    resetAdaModal();
                    AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", "");
                }
                initModule();
                
                preview_store.update( (item) => {
                    item.xml = xml;
                    return item;
                });

                if (isReview && typeof (editorState) == 'undefined') {
                    setReview();
                }
            }

            if (state.review != isReview && editorState) {
                preview_store.update( (item) => {
                    item.review = isReview;
                    return item;
                });
                if (isReview) {
                    GRAPH.modeOn(1);
                    displayAns();
                } else {
                    GRAPH.modeOn(0);
                }
                AH.selectAll('#mathmain #delButton.active', 'removeClass','active');
            }

            if (state.checked && typeof(showAns) == 'undefined') {
                GRAPH.checkAns("#mathmain");
                state.checked = false;
            }
            AH.enableBsAll('[data-bs-toggle="tooltip"]', 'Tooltip')
        }
    })

    // Responible for binding the events
    onMount(async()=> {
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
        AH.set("q_refresh", refreshModule);

        if (!editorState) {
            refreshModule();
        }

        AH.listen('body', 'keydown', '#mathmain #delButton', function (current, event) {
            if (event.ctrlKey && event.altKey && (event.which == 49 || event.keyCode == 49)) {
                openModal();
            }
        });

        AH.listen('body', 'keydown', '#mathmain #ADA_button', function (current, event) {
            if (event.keyCode == 13) {
                openModal();
            }
        });

        AH.listen('body', 'click', '#mathmain', function (current, event) {
            if (event.target.parentNode.id != 'delButton' && event.target.id != 'ADA_button' && event.target.id != 'delButton' && event.target.parentNode.id != 'ADA_button' && event.target.id != 'option-toolbar') {
                displayAns();
            }
        });

        AH.listen('body', 'mouseup', '#mathmain', function (current, event) {
            if (event.target.parentNode.id != 'delButton' && event.target.id != 'ADA_button' && event.target.id != 'delButton' && event.target.parentNode.id != 'ADA_button' && event.target.id != 'option-toolbar') {
                displayAns();
            }
        });

        AH.listen('body', 'click', '.delElem', function (current) {
            let cur_elem = current.children[0];
            cur_elem.classList.toggle('active');
            if ( AH.select('.selected-option').innerHTML == 'point' || AH.select('.selected-option').innerHTML == 'circle' || AH.select('.selected-option').innerHTML == 'association' ) {
                if (cur_elem.classList.contains('active')) {
                    swal(l.delete_msg);
                    AH.find('#mathmain', '#ID0Preview').style.cursor = "pointer";
                } else {
                    AH.find('#mathmain', '#ID0Preview').style.cursor = "default";
                    cur_elem.style.color = 'black';
                }
            } else if (cur_elem.classList.contains('active')) {
                cur_elem.style.color = 'black';
                swal(l.last_delete_msg);
                AH.setCss(current, {
                    backgroundColor: "transparent",
                    boxShadow: "none"
                });
                AH.find('#mathmain', '#ID0Preview').style.cursor = "default";
            }
        });

        AH.listen('body', 'click', '#mathmain .footer_toolbox li', function (current) {
            current.classList.add('btn_active');
            AH.selectAll(AH.siblings(current), 'removeClass', 'btn_active')
        });
    })

    // for refreshing the module
    function refreshModule() {
        if (typeof JXG != 'undefined' && AH.select('#ID0Preview').nodeName && AH.select('#ID0Preview').offsetHeight) {
            initModule();
        }
    }

    // function for iniating module 
    function initModule() {
        GRAPH.readyThis("#mathmain");
        // called for update the graph on graph board
        GRAPH.showansdrag("#mathmain", 'u', 1);
        /* allows user to perform the task and hides 'correct answer' and 'your answer' button */
        GRAPH.modeOn();
    }

    // responsible for showing the answer
    function displayAns() {
        // used for switch on next question in prepengine if current question is attempted
        //ISSPECIALMODULEUSERXMLCHANGE = 1;
        // collect Correct or Incorrect which is returned by checkAns method 
        let result = GRAPH.checkAns("#mathmain");
        if (typeof(is_sm) != "undefined") AH.showmsg(result.ans ? "Correct" : "Incorrect", 3000);
        if (editorState) {
            // shows the answer according to the value of its argument passed
            showAns(result.ans ? "Correct":"Incorrect");
        }
        onUserAnsChange(result)
    }

    // function responsible for loading the module
    function loadModule (loadXml) {
        loadXml = XMLToJSON(loadXml);
        parseXMLAuthoring(loadXml);
        let uaXML = {};
        if (uxml) {
            // converts the user answer xml value into json which is store in 'uxml'
            uaXML = XMLToJSON(uxml);
            if ( uaXML && uaXML.smans && uaXML.smans.div && uaXML.smans.div._userAns) {
                preview_store.update( (item) => {
                    item.userAns_data = uaXML.smans.div._userAns;
                    return item;
                });
            }	
        }
    }

    // function responsible for parsing the xml
    function parseXMLAuthoring(MYXML) {
        preview_store.update( (item) => {
            item.QXML = MYXML.smxml.plot;
            item.moduleType = MYXML.smxml.plot._type;
            return item;
        });
    }

    // function responsible for opening the modal
    function openModal() {
        AH.getBS('#graph_modal', 'Modal').show();
        loadModalView();

        AH.selectAll('[resetValue="1"]', 'value', '');
    }

    // function for setting the uxml on key update
    function modifyUxmlOnKey() {
        let tempRowVal = [];
        let row;
        switch (state.moduleType) {
            case "circle":
                // selects all row
                row = document.querySelectorAll('.mainDiv');
                //var tempRowVal = [];
                row.forEach(function(item) {
                    // selects all input field in perticular row
                    let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
                    // creates array with input fields value which are defined for x and y co-ordinate and radius after separating comma and '/' which is required where it is suitable 
                    let tempCol = [col[0].value + "," + col[1].value + "/" + col[2].value];
                    // pushes the value of 'tempCol' array into array 'tempRowVal'
                    tempRowVal.push(tempCol);
                });
                // updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|' 

                AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
                // calls unsetReview method
                unsetReview();
                break;
            case "point":
            case "polygon": 
                // selects the all rows available in ADA modal box
                row = document.querySelectorAll('.mainDiv');
                //var tempRowVal = [];
                row.forEach(function(item) {
                    // selects all input field in perticular row
                    let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
                    // creates array with input fields value which are defined for x and y co-ordinate
                    let tempCol = [col[0].value + "," + col[1].value];
                    // pushes the data of 'tempCol' in array 'tempRowVal'
                    tempRowVal.push(tempCol);
                });
                // updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|' 
                AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
                // calls unsetReview method
                unsetReview();
                break;
            case "sine":
            case "cosine":
            case "line":
            case "ray":
            case "segment":
            case "vector":
            case "parabola":
                row = document.querySelectorAll('.mainDiv');
                //var tempRowVal = [];
                row.forEach(function(item) {
                    let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
                    // contains the array of value point x1, y1 and  x2, y2 separated with '|' from ADA dialog box
                    let tempCol = [col[0].value + "," + col[1].value + "|" + col[2].value + "," + col[3].value];
                    // pushes the data in 'tempRowVal' array
                    tempRowVal.push(tempCol);
                });
                // updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|'
                AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
                // calls unsetReview method
                unsetReview();
                break;
            case "association":
                // it is discarded by Pete sir
                row = document.querySelectorAll('.mainDiv');
                //var tempRowVal = [];
                row.forEach(function(item) {
                    let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
                    let tempCol = [col[0].value + "," + col[1].value + "," + col[2].value];
                    tempRowVal.push(tempCol);
                });

                AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
                unsetReview()
                break;
        }
        displayAns();
        AH.getBS('#graph_modal', 'Modal').hide();
    }

    // used for ADA and adds or removes the row 
    function updateRow (type) {
        if (type == "add") {
            // increases the row by 1 if 'add' button clicked
            state.noOfRow = state.noOfRow + 1;
        } else if (type == 'remove') {
            if (state.noOfRow == 1) {
                swal("Default row can't be deleted");
            } else {
                //  decreases the row by 1 if 'remove' button clicked and row is greater than 1
                state.noOfRow = state.noOfRow - 1;
            }
        }
        loadModalView();
    }
    
    // loads the ADA modal box according to the value of state 'moduleType'
    function loadModalView() {
        let modalViewLayout = [];
        for (let index = 0; index < state.noOfRow; index++) {
            // pushes the value return by getRow method in array 'modalViewLayout'
            modalViewLayout = [
                ...modalViewLayout, {
                    moduleType : state.moduleType,
                    index: index,
                }
            ]
        }
        preview_store.update((item) => {
            item.modalViewLayout = modalViewLayout;
            return item;
        });
    }

    /* shows correct or incorrect message and correct answer and your answer button and does not allow user to perform the task */
    function setReview() {
        AH.selectAll('#mathmain #delButton.active', 'removeClass','active');
        isReview = true;
        // does not allow user to perform the task and shows correct answer and your answer button
        GRAPH.modeOn("on");
        // shows the stroke and fill color of the point and graph
        GRAPH.showansdrag('#mathmain', 'u', 1);
        // display the correct or incorrect 
        displayAns();
    }

    /* hides correct or incorrect message and correct answer and your answer button and allow user to perform the task removes red or green color of border of preview container */
    function unsetReview() {
        AH.selectAll('#mathmain #delButton.active', 'removeClass','active');
        isReview = false;
        // allow user to perform the task
        GRAPH.modeOn();
        // does not show the point and graph stroke and fill color to indicate that answer is correct or incorrect, shows border color of preview container in gray color */
        GRAPH.showansdrag('#mathmain', 'u', 0);
    }

    // function for handling the review mode
    function handleReviewMode(mode) {
        if (mode == 'c') {
            GRAPH.showansdrag('#mathmain', 'c', 1)
        } else if (mode == 'u') {
            GRAPH.showansdrag('#mathmain', 'u', 1)
        }
    }

    // function for resetting the modal
    function resetAdaModal () {
        state.noOfRow = 1;
        AH.selectAll('[id^=divAllTextBox]:not([id="divAllTextBox0"])', 'remove');
        AI.selectAll('.getFieldVal:not(:disabled)', 'value', '');
    }
</script>
<div>
    <link onload="this.rel='stylesheet'" rel="preload" as="style" href={itemUrl + "clsSMGraph/css/Math.min.css"}/>
    
    <center>
        <ItemHelper 
            on:setReview = {setReview}
            on:unsetReview = {unsetReview}
            reviewMode={isReview}
            handleReviewClick = {handleReviewMode}
        />
        <div
            id="mathmain"
            class="userAns position-relative bg-white"
            style = "height:{(Number(state.QXML._height) + 2)}px;width:{state.QXML._width}px;"
        >
        <div id="option-toolbar" class="text-dark">
            <ul class="controls">
                <li value="plotgraph" class="selected-option text-uppercase m-0">{state.QXML._type}</li>
            </ul>
            <button 
                tabindex="0" 
                id="ADA_button" 
                class= "ADAButton float-start mt-1 btn w-auto h-auto p-1 btn-light ml" 
                aria-label={l.ada_graph_msg} 
            >
                <span data-bs-toggle="tooltip"  title={l.ada_graph_msg} class="icomoon-keyboard-2 s2"></span>
            </button>
            <div
                class="btn-group tools delElem h-imp" 
            >
                <button
                    type="button"
                    class="btn btn-light p-1 focus_div"
                    id="delButton"
                    data-placement="right"
                    tabindex="0"
                    aria-label={l.ada_message} 
                >
                    <span title={l.delete} data-bs-toggle="tooltip"  class={"icomoon-new-24px-delete-1"}></span>
                </button>
            </div>
        </div>

        {#if state.QXML._reflection}
            <div
                id={state.QXML._id + "Preview"} 
                data-userans={state.userAns_data}
                data-anskey={state.QXML._anskey}
                type={state.QXML._type} 
                class={"drag-resize dropable " + state.QXML._type}
                data-xtickdistance={state.QXML._xtickdistance}
                data-ytickdistance={state.QXML._ytickdistance} 
                data-xaxis={state.QXML._xaxis} 
                data-yaxis={state.QXML._yaxis} 
                data-snapsize={state.QXML._snapsize} 
                data-equation={state.QXML._equation}
                data-reflection = {state.QXML._reflection}
                style = "
                    height: {state.QXML._height - 40}px;
                    width: {state.QXML._width}px;
                    border: 1px solid #ccc;
                "
            ></div>
        {:else}
            <div
                id={state.QXML._id + "Preview"} 
                data-userans={state.userAns_data}
                data-anskey={state.QXML._anskey}
                type={state.QXML._type} 
                class={"drag-resize dropable " + state.QXML._type}
                data-xtickdistance={state.QXML._xtickdistance}
                data-ytickdistance={state.QXML._ytickdistance} 
                data-xaxis={state.QXML._xaxis} 
                data-yaxis={state.QXML._yaxis} 
                data-snapsize={state.QXML._snapsize} 
                data-equation={state.QXML._equation}
                style = "
                    height: {state.QXML._height - 40}px;
                    width: {state.QXML._width}px;
                    border: 1px solid #ccc;
                "
            ></div>
        {/if}
        <ul class="footer_toolbox h">
            <li class="btn_active btn-point" rel="point" data-value="P"></li>
            <li rel="segment" class="btn-segment" data-value="S"></li>
            <li rel="segment_left_point_hollow" class="btn-SLH" data-value="SLH"></li>
            <li rel="segment_right_point_hollow" class="btn-SRH" data-value="SRH"></li>
            <li rel="segment_both_point_hollow" class="btn-SBH" data-value="SBH"></li>
            <li rel="ray_left_direction" class="btn-RL" data-value="RL"></li>
            <li rel="ray_right_direction" class="btn-RR" data-value="RR"></li>
            <li rel="ray_left_direction_right_hollow" class="btn-RRH" data-value="RRH"></li>
            <li rel="ray_right_direction_left_hollow" class="btn-RLH" data-value="RLH"></li>	
        </ul>
        </div>
    </center>

    <div id="graph_modal" class="modal fade" tabIndex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{l.set_ans}</h5>
                    <div class="row">
                        <div class="col-12">
                            <div class="float-end">
                                <button class="btn btn-light" id="updateRow" on:click={()=> {updateRow("add")}}>{l.add_point}</button>
                                <button class="btn btn-light ml-1" id="delete_btn" on:click={()=> {updateRow("remove")}}>{l.del_row}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body overflow-y">
                    <div class="row">
                        {#each  state.modalViewLayout as data}
                            {#if data.moduleType == 'circle'}
                                <div class="row mainDiv mt-4" key={"divAllTextBox" + (data.index)} id={"divAllTextBox" + (data.index)}>
                                    <div class="col-12 text-center">
                                        <span class="text-justify">
                                            <label class="ml-2 text-body">
                                                {l.pointx + (data.index + 1)}
                                                <input type="number" resetValue="1" class="point_x_1 getFieldVal form-control " id="setAnsByKey" placeholder={l.insert_numeric_data}/>
                                            </label>
                                            <label class="ml-2 text-body">
                                                {l.pointy + (data.index + 1)}
                                                <input type="number" resetValue="1" class="point_y_1 getFieldVal form-control" placeholder={l.insert_numeric_data}/>
                                            </label>
                                        </span>
                                    </div>
                                    <div class="col-12 text-center">
                                        <label class="text-body">
                                            {"Radius " + (data.index + 1)}
                                            <input type="number" resetValue="1" class="point_x_2 getFieldVal form-control" placeholder={l.insert_numeric_data}/>
                                        </label>
                                    </div>
                                </div>
                            {:else if data.moduleType == 'association' }
                                <div class="row mainDiv mt-2" key={"divAllTextBox" + (data.index)} id={"divAllTextBox" + (data.index)}>
                                    <div class="col-12 text-center">
                                        <span class="text-justify">
                                            <label
                                                class="ml-2 text-body">
                                                {l.pointx + (data.index + 1)} 
                                                <input type="number" resetValue="1" class="association_x_point getFieldVal form-control" placeholder={l.insert_numeric_data}/>
                                            </label>
                                            <label class="ml-2 text-body">
                                                {l.pointy + (data.index + 1)}
                                                <input type="number" value="0.4" disabled="disabled" class="point_y_1 pe-none getFieldVal form-control" placeholder={l.insert_numeric_data}/>
                                            </label>
                                        </span>
                                    </div>
                                    <div class="col-12 text-center">
                                        <label class="text-body">
                                            {l.pointx2}
                                            <input type="number" resetValue="1" class="association_point getFieldVal form-control" placeholder={l.insert_numeric_data}/>
                                        </label>
                                    </div>
                                </div>
                            {:else if data.moduleType == 'point' || data.moduleType == 'polygon'}
                                <div class="row mainDiv mt-2" key={"divAllTextBox" + (data.index)} id={"divAllTextBox" + (data.index)}>
                                    <div class="col-12 text-center">
                                        <label class="text-body">
                                            {l.pointx + (data.index + 1)}
                                            <input type="number" resetValue="1" class="form-control getFieldVal" name={"point_" + (data.index)} id={"x_" + (data.index)} placeholder={l.insert_numeric_data}/>
                                        </label>
                                        <label class="ml-2 text-body">
                                            {l.pointy + (data.index + 1)}
                                            <input type="number" resetValue="1" class="form-control getFieldVal" name={"point_" + (data.index)} id={"y_" + (data.index)} placeholder={l.insert_numeric_data}/>
                                        </label>
                                    </div>
                                </div>
                            {:else}
                                <div class="row mainDiv mt-4" key={"divAllTextBox" + (data.index)} id={"divAllTextBox" + (data.index)}>
                                    <div class="col-12 text-center">
                                        <label class="text-body">
                                            {l.pointx1}
                                            <input type="number" resetValue="1" class="point_x_1 getFieldVal form-control" id="setAnsByKey" placeholder={l.insert_numeric_data}/>
                                        </label>
                                        <label class="ml-2 text-body">
                                            {l.pointy1}
                                            <input type="number" resetValue="1" class="point_y_1 getFieldVal form-control" id="setAnsByKey" placeholder={l.insert_numeric_data}/>
                                        </label>
                                        <label class="text-body">
                                            {l.pointx2}
                                            <input type="number" resetValue="1" class="point_x_2 getFieldVal form-control" id="setAnsByKey" placeholder={l.insert_numeric_data}/>
                                        </label>
                                        <label class="ml-2 text-body">
                                            {l.pointy2}
                                            <input type="number" resetValue="1" class="point_y_2 getFieldVal form-control" id="setAnsByKey" placeholder={l.insert_numeric_data}/>
                                        </label>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.cancel}</button>
                    <button type="button" class="btn btn-secondary" on:click={modifyUxmlOnKey}>{l.ok_btn}</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #graph_modal .modal-body {
        max-height: 350px;
    }
</style>