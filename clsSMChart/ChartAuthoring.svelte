<!--
 *  File Name   : ChartAuthoring.svelte
 *  Description : Responsible for Authoring Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : clsSMChart (Authoring)
 *  Last update : 15-Mar-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, beforeUpdate, onMount } from "svelte";
	import { writable } from "svelte/store";
	import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
    import CHART_AUTH from './lib/chartAuthoringScript';
    import l from '../src/libs/Lang';
    import ChartModalBox from "./lib/ChartModalBox.svelte";
    export let xml;
    export let editorState;
    export let getChildXml;
    let state = {};
    let width = '600px', cid = 'ID0';
    let is_resource_added = false;
    // created writable store
    let auth_store = writable({
        // used for contain the xml
        xml: '',
        // used for contain the type of chart used
        moduleType: '',
        // contains the height of the chart board
        height: "500",
        // contains the width of the chart board
        width: "550",
        // contains the xval value of the xml
        xval: "",
        // contains the yinterval value of the xml
        yinterval: "",
        // contains the ymax value of the xml
        ymax: "500",
        // contains the ymin value of the xml
        ymin: "",
        // contains the xmax value of the xml
        xmax: "",
        // contains the xmin value of the xml
        xmin: "",
        // contains the xinterval value of the xml
        xinterval: "",
        // contains the defaultans value of the xml
        defaultans: "",
        // contains the snapTo value of the xml
        snapTo: "",
        // contains the correctans value of the xml
        correctans: "",
        // contains the xlabel value of the xml
        xlabel: "",
        // contains the ylabel value of the xml
        ylabel: "",
        // contains the title value of the xml
        title: "",
        // contains the color value of the xml
        color: ""
	});

    // for subscribing the store
    const unsubscribe = auth_store.subscribe(value => {
		state = value;
	});

    // for updating the module/xml whenever there is change in the xml
    beforeUpdate(async() => {
		if (state.xml != xml) {
            AH.select('#special_module_xml').value = xml;
            updateXmlAuthData(xml);
		}
	});

    // for binding some events
    onMount(async() => {
        AH.listen('body','keyup', '#authoring-modal .validate', function (current, event) {
            event.preventDefault();
            event.stopPropagation();

            if (event.keyCode == 13) {
                if (AH.selectAll('#authoring-modal .showError').length == 0) {
                    AH.select('#authoring-modal .addElement').click();
                } else {
                    AH.select('#authoring-modal .showError').focus();
                }
            }
            CHART_AUTH.validate(current);
        });

        AH.listen('body','change', 'select', function (current) {
            CHART_AUTH.changeType(current);
        });

        AH.listen('body','click', '.resetElement', function () {
            CHART_AUTH.resetModal();
            AH.select("#chart-width").value = AH.select("#chart-width").getAttribute("data-dwidth");
            AH.select("#chart-height").value = AH.select("#chart-height").getAttribute("data-dheight");
            AH.select("#xlabel").value = AH.select("#xlabel").getAttribute("data-dxtitle");
            AH.select("#ylabel").value = AH.select("#ylabel").getAttribute("data-dylabel");
            AH.select("#defaultans").value = AH.select("#defaultans").getAttribute("data-dans");
            AH.select("#color").selectedIndex = 0;
            AH.select("#snapto").value = AH.select("#snapto").getAttribute("data-dsnapto");
            AH.select("#ymin").value = AH.select("#ymin").getAttribute("data-dymin");
            AH.select("#ymax").value = AH.select("#ymax").getAttribute("data-dymax");
            AH.select("#yinterval").value = AH.select("#yinterval").getAttribute("data-dyinterval");
            AH.select("#xmin").value = AH.select("#xmin").getAttribute("data-dxmin");
            AH.select("#xmax").value = AH.select("#xmax").getAttribute("data-dxmax");
            AH.select("#xinterval").value = AH.select("#xinterval").getAttribute("data-dxinterval");

            if (AH.select("#chart-type").value == "dotplot") {
                AH.select("#authoring-modal #chart_title").value = "Dot Plot";
            } else if (AH.select("#chart-type").value == "column") {
                AH.select("#authoring-modal #chart_title").value = "Column";
            } else if (AH.select("#chart-type").value == "line") {
                AH.select("#authoring-modal #chart_title").value = "Line";
            } else if (AH.select("#chart-type").value == "histogram") {
                AH.select("#authoring-modal #chart_title").value = "Histogram";
            }
        });

        AH.listen('body','mousemove', '#chartmain', function () {
            updateXML();
        });

        AH.listen('body','click', '#chartmain, .addElement, .updateGraph', function () {
            updateXML();
        });

        AH.listen('body', 'click', '#xmlDone', function () {
            CHART_AUTH.initChart();
        });
    });

    // for adding the highchart draggable plugin and initiating the chart
    afterUpdate(async() => {
        if (!is_resource_added && xml) {
            AH.addScript('', itemUrl + 'clsSMChart/lib/highchart_draggable.js', { callback: function () {
                CHART_AUTH.initChart();
                editorState.links = true;
            }});
            is_resource_added = true;
        }
    })

    // function for updating the xml
    function updateXML() {
        if (state.xml != AH.select('#special_module_xml').value) {
            getChildXml(AH.select('#special_module_xml').value);
        }
    }

    // updates all states value according to the value of xml
    function updateXmlAuthData(xml_data) {
        // contains the json data of the xml
        let newXml = XMLToJSON(xml_data);
        // parses the xml and updates the value of all states except 'xml' and 'moduleType'
        parseXml(newXml);
        auth_store.update( (item) => {
            item.xml = xml_data;
            item.moduleType = newXml.smxml.chart._type;
            return item;
        });
        // this block will not execute as there are only 3 types of chart used and they are line, column, histogram
        if (newXml.smxml.chart._type == 'dotplot') {
            AH.selectAll('#chartmain .setdata', 'css', {
                display: 'none'
            });
        }
    }

    // function for updating the state and parsing the xml
    function parseXml(QXML) {
        // updates the value of the states
        auth_store.update( (item) => {
            // updates the value of state 'color' with color attribute value of chart tag of xml
            item.color = QXML.smxml.chart._color;
            // updates the value of state 'correctans' with correctans attribute value of chart tag of xml
            item.correctans = QXML.smxml.chart._correctans;
            // updates the value of state 'defaultans' with defaultans attribute value of chart tag of xml
            item.defaultans = QXML.smxml.chart._defaultans;
            // updates the value of state 'height' with height attribute value of chart tag of xml
            item.height = QXML.smxml.chart._height;
            // updates the value of state 'snapTo' with snapTo attribute value of chart tag of xml
            item.snapTo = QXML.smxml.chart._snapTo;
            // updates the value of state 'title' with title attribute value of chart tag of xml
            item.title = QXML.smxml.chart._title;
            // updates the value of state 'width' with width attribute value of chart tag of xml
            item.width = QXML.smxml.chart._width;
            // updates the value of state 'xinterval' with xinterval attribute value of chart tag of xml
            item.xinterval = QXML.smxml.chart._xinterval;
            // updates the value of state 'xlabel' with xlabel attribute value of chart tag of xml
            item.xlabel = QXML.smxml.chart._xlabel;
            // updates the value of state 'xmax' with xmax attribute value of chart tag of xml
            item.xmax = QXML.smxml.chart._xmax;
            // updates the value of state 'xmin' with xmin attribute value of chart tag of xml
            item.xmin = QXML.smxml.chart._xmin;
            // updates the value of state 'xval' with xval attribute value of chart tag of xml
            item.xval = QXML.smxml.chart._xval;
            // updates the value of state 'yinterval' with yinterval attribute value of chart tag of xml
            item.yinterval = QXML.smxml.chart._yinterval;
            // updates the value of state 'ylabel' with ylabel attribute value of chart tag of xml
            item.ylabel = QXML.smxml.chart._ylabel;
            // updates the value of state 'ymax' with ymax attribute value of chart tag of xml
            item.ymax = QXML.smxml.chart._ymax;
            // updates the value of state 'ymin' with ymin attribute value of chart tag of xml
            item.ymin = QXML.smxml.chart._ymin;
            return item;
        });
    }
</script>

<main>
    <div id="authoringDiv">
        <ChartModalBox />
        <center>
            <div id="chartmain" style="width: {width}; background: #e8e8e8;" class="position-relative">
                <div style="height: 41px" class="position-relative w-100">
                    <div class="float-end mr-2 pt-1">
                        <span>
                            <button aria-label={l.add} class="setdata btn-light btn m-0 w-auto h-auto p-1 bg-white border ml" data-toggle="tooltip" on:click={() => { CHART_AUTH.updatePoint('addPoint', cid) }} data-original-title={l.add} >
                                <span class="icomoon-plus s2 updateGraph"></span>
                            </button>
                            <button aria-label={l.delete} tabindex="0" class="setdata btn btn-light m-0 w-auto h-auto p-1 bg-white border ml" data-toggle="tooltip" on:click={() => { CHART_AUTH.updatePoint('removePoint', cid) }} data-original-title={l.delete}>
                                <span class="icomoon-new-24px-delete-1 s2 updateGraph"></span>
                            </button>
                        </span>
                        <span id="option-toolbar">
                            <span class="btn-group model-icon tools" on:click={() => { CHART_AUTH.elemModal('plotchart', cid) }} data-t="plotchart">
                                <button aria-label={l.edit_chart} tabindex="0" data-toggle="tooltip" data-original-title={l.edit_chart}  class="bg-white btn btn-light p-1"><i class="icomoon-24px-edit-1"></i></button>
                            </span>
                        </span>
                    </div>
                </div>
                <div id="ID0" type={state.moduleType} width={state.width} height={state.height} class={'drag-resize ' + state.moduleType} snapTo={state.snapTo} xval={state.xval} yval={state.yval} yinterval={state.yinterval} ymin={state.ymin} ymax={state.ymax} defaultans={state.defaultans} correctans={state.correctans} xlabel={state.xlabel} ylabel={state.ylabel} title={state.title} color={state.color} style="width: {width}; border: 1px solid #ccc;"></div>
            </div>
        </center>
        <textarea class="h" id="special_module_xml" name="special_module_xml" value={state.xml} data-xml=""></textarea>
    </div>
</main>