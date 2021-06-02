<!--
 *  File Name   : ChartPreview.svelte
 *  Description : Responsible for Preview Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : clsSMChart (Preview)
 *  Last update : 15-Mar-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, beforeUpdate, onMount } from "svelte";
	import { writable } from "svelte/store";
	import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
    import CHART from './lib/chart'
    import l from '../src/libs/Lang';
    import Highcharts from 'highcharts';
    import ItemHelper from "../helper/ItemHelper.svelte";
    export let xml;
	export let uxml;
	export let isReview;
	export let showAns;
	export let editorState;
    let state = {};

    // newXml used for contain the xml in json format, chartObj contains the instance of the highcharts
    let newXml = "", chartObj = '';
    // used for contain the x and y point value of each row of 'Set Answer' dialog box that comes when keyup on ADA button
    let tempRowVal = [];
    // holds the user answer value performed via ADA button 
    let holdUserAns = [];
    window.Highcharts = Highcharts;
    let preview_store = writable({
        userans: '',
        init: false,
        // used contain the xml value
        xml: '',
        modalViewLayout: '',
        // used for set the height of the chart container
        height: "500",
        // used for set the width of the chart container
        width: "550",
        // used for update the x-axis points
        xval: "",
        // used for defined the gap between 2 point on y-axis
        yinterval: "",
        // used for set the maximum value of y-axis
        ymax: "",
        // used for set the minimum value of y-axis
        ymin: "",
        // used for set the maximum value of x-axis
        xmax: "",
        // used for set the minimum value of x-axis
        xmin: "",
        // used for set the gap between 2 points on x-axis
        xinterval: "",
        // used for by default plot the chat with default answer value
        defaultans: "",
        // not clear why it is used
        snapTo: "",
        // contains the correct answer value for match the answer
        correctans: "",
        // used for set the x-axis label value
        xlabel: "",
        // used for set the y-axis label value
        ylabel: "",
        // used for set the chart label value
        title: "",
        // used for set the color of column/point except in case of histogram
        color: "",
        // this or above value can be removed as it is defined at 2 places in the same scope
        moduleType: "none",
        // used for update the body rows of the 'Set Answer' dialogbox when performed by the help of 'ADA' button
        noOfRow: 1
    });

    // subscribing to the state
    const unsubscribe = preview_store.subscribe(value => {
		state = value;
	});
    
    // updating module on change of the xml
    beforeUpdate(async()=> {
        if (!editorState && !state.init) {
            AH.addScript('', themeUrl + 'pe-items/svelte/clsSMChart/lib/highchart_draggable.js', { callback: function () {
                state.init = true;
            }});
        }
        if ((state.init || (editorState && editorState.links) ) && state.xml != xml) {
            updateXmlData(xml);
        }
    })

    // updating xml and review mode 
    afterUpdate(async() => {
        if (state.init || (editorState && editorState.links)) {
            if (state.xml != xml) {
                // instance of highcharts
                let charts = Highcharts.charts, chartObj;
                charts.forEach(function(chart) {
                    if (chart && chart.renderTo.id === 'answerID0') {
                        chartObj = chart;
                    }
                });
                (chartObj) ? chartObj.redraw() : '';
                // used for load and draw the chart
                CHART.readyThis('#chartmain0', 0, uxml);
                // if block will not execute as there are only 3 types of chart used here and they are line, column and histogram
                let res, arr, user_data_json;
                if (newXml.smxml.chart._type == 'dotplot') {
                    res = '|';
                    arr = JSON.parse("[" + newXml.smxml.chart._defaultans + "]");
                    for (let index_no = 0; index_no < arr.length; index_no += 1) {
                        res = res + index_no + ',' + arr[index_no] * 10 + '|';
                    }
                } else {
                    // define the variable with value '|'
                    res = '|';
                    // contains the default answer value in json format
                    arr = JSON.parse("[" + newXml.smxml.chart._defaultans + "]");
                    for (let index_no = 0; index_no < arr.length; index_no += 1) {
                        // sets each columns/points x point value as defined in index_no variable and y point value as value of arr object defined at index equals to the value of variable 'index_no' separated by comma (,) with sufix '|'
                        res = res + index_no + ',' + arr[index_no] + '|';
                    }

                    // used in case when user answer is set
                    if (uxml) {
                        user_data_json = XMLToJSON(uxml);
                        // containts the 'x' and 'y' axis co-ordinate value of user answer columns or points
                        user_data_json = user_data_json.smans.div._userAns;
                    }
                    // sets the user answer value
                    AH.select('#answerID0').setAttribute('userans', ((user_data_json) ? user_data_json : res));
                }
                
                preview_store.update( (item) => {
                    item.xml = xml;
                    return item;
                });
                initPreview();
                AH.enableBsAll('[data-bs-toggle="tooltip"]', 'Tooltip');
            }

            if (state.review != isReview && editorState) {
                preview_store.update( (item) => {
                    item.review = isReview;
                    return item;
                });
                if (isReview) {
                    setReview(); 
                } else {
                    unsetReview();
                }
            }

        }
    })

    // Binding some initial events for answer checking
    onMount(async()=> {
        try {
            if (uxml == '<smans type="38"></smans>') {
                uxml = '';
            }
        } catch(error) {
            console.warn({'error': error});
        }

        if (window.inNative) {
            window.getHeight && window.getHeight();
            AH.select("#answerID0").ontouchmove = function(e) {
                e.preventDefault();
            }
            AH.insert(document.head, `<style>.highcharts-data-labels{top: 115px!important;}</style>`, 'beforeend');
        }

        AH.listen('body', 'click', '#chartmain0', function (current, event) {
            if (event.target.id != 'chart_header_container' && event.target.parentNode.id != 'ADA_Btn_point' && event.target.id != 'ADA_Btn_point') {
                displayAns();
            }
        });

        AH.listen('body', 'mouseup', '#chartmain0', function (current, event) {
            if (event.target.id != 'chart_header_container' && event.target.parentNode.id != 'ADA_Btn_point' && event.target.id != 'ADA_Btn_point') {
                displayAns();
            }
        });

        AH.listen('body', 'touchend', '#chartmain0', function (current, event) {
            if (event.target.id != 'chart_header_container' && event.target.parentNode.id != 'ADA_Btn_point' && event.target.id != 'ADA_Btn_point') {
                displayAns();
            }
        });

        AH.listen('body', 'keydown', '#chartmain0 #delete_prev, #chartmain0 #add_prev', function (current, event) {
            if (event.ctrlKey && event.altKey && (event.which == 49 || event.keyCode == 49)) {
                openModal();
            }
        });

        AH.listen('body', 'keydown', '.ADA_Btn', function (current, event) {
            // array for contain the user answer value performed via ADA dialog box
            holdUserAns = [];
            for (let i = 1; i <= (tempRowVal.length * 2); i = i + 2) {
                // contains the y point value of each row
                let convertArr = tempRowVal.toString().split(",")[i];
                // pushes the y point value into array holdUserAns for set the user answer value
                holdUserAns.push(convertArr);
            }
            if (event.keyCode == 13) {
                openModal();
            }
        });
    })

    // function called for opening the modal
    function openModal() {
        AH.getBS('#chart_modal', 'Modal').show();
        loadModalView();
    }

    // for modifying and updating the chart in case of ada
    function modifyUxmlOnKey() {
        // creates temporary array
        tempRowVal = [];
        switch (state.moduleType) {
            case "column":
            case "line":
            case "histogram":
            case "dotplot":
                // contains number of rows exist in 'Set Answer' dialog box
                let row = document.querySelectorAll('.mainDiv');
                // loops through each rows
                row.forEach(function (item) {
                    // contains both column which is used for x and y value of column/point
                    let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
                    // contains the x and y value of the column/point
                    let tempCol = [col[0].value + "," + col[1].value];
                    // pushes the value of the variable 'tempCol' in array 'tempRowVal'
                    tempRowVal.push(tempCol);
                });
                // updates the value of the user answer with stored value in temporary array 'tempRowVal'
                AH.select("#answerID0").setAttribute("userans", tempRowVal.join('|'));
                // allows user to perform the task and sets the initial border color of the chart container and shows add, delete, and ADA button
                unsetReview();
                break;
        }
        AH.getBS('#chart_modal', 'Modal').hide();
    }

    // updating row
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

    // function create the json which is responsible for the content of the modal
    function loadModalView() {
        // creates an array to contain the row and column for contain the x and y values of column/point using 'Set Answer' dialogbox that comes using ADA button
        let modalViewLayout = [];
        for (let i = 0; i < state.noOfRow; i++) {
            // contains the row with defined data 
            modalViewLayout = [
                ...modalViewLayout, {
                    moduleType: state.moduleType,
                    value: holdUserAns[i]
                }
            ]
        }
        preview_store.update((item) => {
            item.modalViewLayout = modalViewLayout;
            return item;
        });
    }

    // function for removing unwanted paths
    function resetPaths() {
        try {
            let charts = Highcharts.charts, chartObj;
            charts.forEach(function(chart) {
                if (chart && chart.renderTo.id === 'answerID0') {
                    chartObj = chart;
                }
            });

            let data = chartObj.series[0].data, paths = [];
            for (let index in data) {
                paths[index] = data[index].id
            }

            let dom_path = AH.selectAll('#answerID0 path[point-id]'), dom_path_points = [];
            for ( let index = 0; index < dom_path.length; index++) {
                dom_path_points[index] = dom_path[index].getAttribute('point-id');
            }

            for ( let index = 0; index < dom_path_points.length; index++) {
                if (!paths.includes(dom_path_points[index])) {
                    AH.select('[point-id="'+dom_path_points[index]+'"]','remove')
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    // function for initiating the preview
    function initPreview() {
        if (typeof Highcharts == "object") {
            // used for load and draw the chart
            CHART.readyThis('#chartmain0', 0, uxml);
            // shows the user answer but not change the border color or column/point color and not shows check or cancel mark
            CHART.showansdrag('#chartmain0', 'u', 0);
            if (isReview) {
                // shows the user answer and not allowed user to perform the task
                setReview()
            } else {
                // allows user to perform the task and sets the initial border color of the chart container and shows add, delete, and ADA button
                unsetReview()
            }
        }
    }

    // shows add, delete and ADA buttons, updates the user answer value, sets value of states values and load the chart
    function updateXmlData(xml_data) {
        // contains the json data of xml
        newXml = XMLToJSON(xml_data);
        // updates the states value with related value of qxml
        parseXml(newXml);
        let userans = '', uaXML = {};
        if (uxml) {
            // contains the json data of user answer
            uaXML = XMLToJSON(window.uaXML);
            if ( uaXML && uaXML.smans && uaXML.smans.div && uaXML.smans.div._userAns) {
                // contains the value of user answer
                userans = uaXML.smans.div._userAns;
            }
        }

        preview_store.update( (item) => {
            item.moduleType = newXml.smxml.chart._type;
            item.userans = userans;
            return item;
        });
        // shows the add, delete and ADA buttons	
        AH.selectAll('#chartmain0 .setdata', 'css', {
            display: 'block'
        });
        
        // hides ADA button in Mobile app
        if (window.inNative) {
            AH.setCss('#chartmain0 #ADA_Btn_point', {
                display: 'none'
            })
        }
    }

    // updates the states value with related value of qxml
    function parseXml(QXML) {
        try {
            // updates some states value
            preview_store.update( (item) => {
                // contains the value of chart type
                item.moduleType = QXML.smxml.chart._type;
                // contains the color value for column/point color
                item.color = QXML.smxml.chart._color;
                // contains the correct answer value
                item.correctans = QXML.smxml.chart._correctans;
                // contains the default answer value
                item.defaultans = QXML.smxml.chart._defaultans;
                // contains height value for chart container
                item.height = QXML.smxml.chart._height;
                // contains the snapTo value for chart
                item.snapTo = QXML.smxml.chart._snapto;
                // contains title value for chart
                item.title = QXML.smxml.chart._title;
                // contains width of the chart container
                item.width = QXML.smxml.chart._width;
                // contains x-axis interval value
                item.xinterval = QXML.smxml.chart._xinterval;
                // contains label value of x-axis
                item.xlabel = QXML.smxml.chart._xlabel;
                // contains maximum value of x-axis
                item.xmax = QXML.smxml.chart._xmax;
                // contains minimum value of x-axis
                item.xmin = QXML.smxml.chart._xmin;
                // contains the xval value for chart
                item.xval = QXML.smxml.chart._xval;
                // contains interval value of y-axis
                item.yinterval = QXML.smxml.chart._yinterval;
                // contains label value of y-axis
                item.ylabel = QXML.smxml.chart._ylabel;
                // contains maximum value of y-axis
                item.ymax = QXML.smxml.chart._ymax;
                // contains minimum value of y-axis
                item.ymin = QXML.smxml.chart._ymin;
                return item;
            });     
            // creates an array
            let xval = [];
            // contains minimun value of x-axis
            let xmin = parseInt(QXML.smxml.chart._xmin);
            // contains maximun value of x-axis
            let xmax = parseInt(QXML.smxml.chart._xmax);
            // contains x-axis interval value
            let xinterval = parseInt(QXML.smxml.chart._xinterval);
            for (let index = xmin; index <= xmax; index = index + xinterval) {
                // contains possible x-points from min to max with specified interval 
                xval.push(index);
            }
            // change the xval value of qxml
            QXML.smxml.chart._xval = "[" + xval.toString() + "]";
            // update the state 'xval' value
            preview_store.update( (item) => {
                item.xval = QXML.smxml.chart._xval;
                return item;
            });
        } catch (error) {
            console.warn({ 'error': error, 'function': 'parseXML', 'File': 'ChartPreview.svelte' });
        }
    }

    // function for handling the review mode
    function handleReviewMode(mode) {
        if (mode == 'c') {
            CHART.showansdrag('#chartmain0', 'c', 1)
        } else if (mode == 'u') {
            CHART.showansdrag('#chartmain0', 'u', 1)
        }
    }

    // function when the review mode is on
    function setReview () {
        isReview = true;
        // used for show the correct answer
        CHART.tempVar = 'c';
        // used for load and draw the chart
        CHART.readyThis("#chartmain0", 1, uxml);
        // shows the correct answer
        CHART.showansdrag("#chartmain0", 'c', 1);
        // shows the user answer with changed color of columns/points and also change the color of chart container
        CHART.showansdrag("#chartmain0", 'u', 1);
        
        // hides the add, delete and ADA buttons
        AH.selectAll('#chartmain0 .setdata', 'css', {
            display: 'none'
        });
        // shows the message correct or incorrect according to the return value of 'CHART.checkAns' method
        displayAns();
        // sets the value of css properties opacity and visibility of columns/points
        AH.selectAll(".highcharts-tracker", 'css' , {
            opacity: "1",
            visibility: "visible" 
        });
        resetPaths();
    }

    // responsible for showing the answer
    function displayAns() {
        let ans = (CHART.checkAns('#chartmain0')) ? l.correct : l.incorrect;
        if (editorState) {
            // shows the answer according to the value of its argument passed
            showAns(ans);
        }
    }

    // function when the review mode is off
    function unsetReview () {
        isReview = false;
        // used for show the user answer
        CHART.tempVar = 'u';
        // used for load and draw the chart
        CHART.readyThis("#chartmain0", 0, uxml);
        // shows the user answer but not change the border color or column/point color and not shows check or cancel mark
        CHART.showansdrag("#chartmain0", 'u', 0);
        // returns the result status and creates the user answer xml and shows the correct or incorrect message according to the status of result in snackbar
        CHART.checkAns("#chartmain0");
        // shows the 'add' (+), 'delete' and 'ADA' buttons
        AH.selectAll('#chartmain0 .setdata', 'css', {
            display: 'block'
        });
        // hides ADA button in Mobile app
        if (window.inNative) {
            AH.select('#chartmain0 #ADA_Btn_point').classList.add('h');
        }
        // sets the border color of the chart container
        AH.selectAll('#answerID0', 'css', {
            "border": "1px solid rgb(204, 204, 204)" 
        });
        resetPaths();
    }

    // function when the review mode is off
    function updateInputElm(index, event) {
        // holds the changed value of input field which value changed in 'Set Answer' dialogbox
        holdUserAns[index] = event.target.value;
        loadModalView();
    }

</script>

<div>
    <center>
        <ItemHelper 
            on:setReview = {setReview}
            on:unsetReview = {unsetReview}
            reviewMode={isReview}
            handleReviewClick = {handleReviewMode}
        />
        <div id="chartmain0" class="userAns">
            {#if window.inNative}
                <div class="native_chart_header" style="width:{state.width}px;">
                    <span class="setdata native_add p-2 float-end position-relative" on:click={() => CHART.updatePointPreview('addPoint', 'answerID0')}><span class="s3"></span><span class="position-relative native_add_text">{l.add}</span></span>
                    <span class="setdata position-relative native_remove" on:click={() => CHART.updatePointPreview('removePoint', 'answerID0')}><span class="s3"></span><span class="position-relative">{l.remove}</span></span>
                </div>
            {:else}
                <div id="chart_header_container" style="width: {state.width}px;">
                    <div class="float-end pt-1 pr-1">
                        <div class="float-start">
                            <button tabindex="0" aria-label={l.add} id="add_prev" class="setdata btn-light btn w-auto h-auto p-1 bg-white border float-start" on:click={() => CHART.updatePointPreview('addPoint', 'answerID0')}>
                                <span data-bs-toggle="tooltip" title={l.add} class="icomoon-plus s2"></span>
                            </button>
                            <button tabindex="0" aria-label={l.delete} id="delete_prev" class="setdata btn-light btn w-auto h-auto p-1 bg-white border ms-1 float-start"  on:click={() => CHART.updatePointPreview('removePoint', 'answerID0')}>
                                <span data-bs-toggle="tooltip" title={l.delete} class="icomoon-new-24px-delete-1 s2"></span>
                            </button>
                            <button tabindex="0" id="ADA_Btn_point" aria-label={l.open_modal} class={"setdata ADA_Btn btn-light btn w-auto h-auto p-1 bg-white border ms-1 float-start"}  >
                                <span data-bs-toggle="tooltip" title={l.ada_chart_msg} class="icomoon-keyboard-2 s2"></span>
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
            <div id="answerID0" type={state.moduleType} width={state.width} height={state.height} class={'drag-resize chart_preview_container ' + state.moduleType} snapto={state.snapTo} xval={state.xval} yval={state.yval} yinterval={state.yinterval} ymin={state.ymin} ymax={state.ymax} defaultans={state.defaultans} userans={state.userans} correctans={state.correctans} xlabel={state.xlabel} ylabel={state.ylabel} title={state.title} color={state.color} style="width: {state.width}px;"></div>
        </div>
    </center>
    <div id="chart_modal" class="modal fade" tabIndex="-1">
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
                    {#each  state.modalViewLayout as data, i}
                        {#if data.moduleType == 'column' ||  data.moduleType == 'line' ||  data.moduleType == 'histogram' ||  data.moduleType == 'dotplot'}
                            <div class="row mainDiv mt-2" id={"divAllTextBox" + (i)}>
                                <label class="col-6 text-body">
                                    {"Point " + (i + 1)}
                                    <input type="number" value={i} readonly="readonly" class="getFieldVal form-control mt-2" />
                                </label>
                                <label class="col-6 text-body">
                                    {"Value " + (i + 1)}
                                    <input type="number" value={data.value} on:change= { (e) => {updateInputElm(i, e)}} placeholder="Insert numeric data" class="point_x_1 getFieldVal form-control mt-2" id={"setAnsByKey" + (i + 1)} />
                                </label>
                            </div>
                        {/if}
                    {/each}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.cancel}</button>
                    <button type="button" on:click={modifyUxmlOnKey} class="btn btn-secondary">{l.ok_btn}</button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    #chart_modal .modal-body {
        max-height: 350px;
    }

    .native_chart_header {
        background: #e0e0e0;
        height: 36px;
    }

    .chart_preview_container {
        border: 1px solid #ccc;
        overflow: visible !important;
    }

    .native_add {
        background: #e0e0e0; 
        width: auto;
        bottom: 10px
    }

    .native_add_text {
        bottom: 2px; 
        left: 2px;
    }
    
    .native_remove {
        padding: 7.5px; 
        background: #e0e0e0; 
        width: auto; 
        left: 220px; 
        top: 7px;
    }

    #chart_header_container {
        background: #e0e0e0; 
        height: 38px;
    }
</style>