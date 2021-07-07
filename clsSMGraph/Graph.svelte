<!--
 *  File Name   : Graph.svelte
 *  Description : Responsible for Authoring Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : clsSMGRAPH (Authoring)
 *  Last update : 02-Mar-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, beforeUpdate, onMount } from "svelte";
	import { writable } from "svelte/store";
	import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
    import GRAPH_AUTH from './lib/mathAuthString'
    import l from '../src/libs/Lang';
    import MathModal from "./lib/MathModal.svelte";
    import swal from 'sweetalert';
    export let xml;
    export let editorState;
    export let getChildXml;
    let state = {};
    let QXML = '';
    let is_resource_added = false;
    let auth_store = writable({
		xml : "",
	});

    const unsubscribe = auth_store.subscribe(value => {
		state = value;
	});

    // reset the lab after removing the algorithm
    $: if (!editorState.variable_button && editorState.stopAuthoringUpdate) {
        editorState.stopAuthoringUpdate = false;
        editorState.stopPreviewUpdate = false;
        GRAPH_AUTH.stopUpdate = false;
        if (AH.select('#special_module_xml').nodeName) {
            AH.select('#special_module_xml').value = state.xml ? state.xml : '';
            GRAPH_AUTH.initGraph();
        }
    }

    // functions responsible for loading the module on the basis of xml
    beforeUpdate(async() => {
        AH.selectAll('#mthmain [tabindex="0"].active', 'removeClass', 'active');
		if (state.xml != xml && !(editorState.stopAuthoringUpdate)) {
            AH.select('#special_module_xml').value = xml;
			loadModule(xml);
		}
	});

    // function responsible for binding the events
    onMount(async()=> {
        AH.listen('body', 'keyup', '.equation', function () {
            if (AH.select('input[id$="equation"]').nodeName && AH.select('input[id$="equation"]').value == '' ) {
                AH.selectAll('.err-msg', 'removeClass', 'd-none');
                AH.selectAll('.equation', 'css', {
                    border: '1px solid red'
                });
            } else {
                AH.selectAll('.err-msg', 'addClass', 'd-none');
                AH.selectAll('.equation', 'css', {
                    border: '1px solid #CED4DA'
                });
            }
        });

        AH.listen('body', 'change', '#graph-type', function () {
            GRAPH_AUTH.resetModal();
        });

        AH.listen('body', 'mousemove', '#mthmain, .addElement, .resetElement', function () {
            updateXml();
        });

        AH.listen('body', 'mouseup', '#mthmain, .addElement, .resetElement', function () {
            updateXml();
        });

        AH.listen('body', 'click', '#mthmain, .addElement, .resetElement', function () {
            updateXml();
        });

        AH.listen('body', 'click', '#xmlDone', function () {
            editorState.variable_button = false;
            if (!(!editorState.variable_button && editorState.stopAuthoringUpdate)) {
                GRAPH_AUTH.initGraph();
            }
        });

        AH.listen('body', 'keypress', '#mthmain [tabindex="0"]', function (current, event) {
            if ((event.keyCode == 13 || event.which == 13) && (event.target.id != 'delete_btn' && event.target.id != 'updateRow')) {
                current.click();
            }
        });

        AH.listen('body', 'hidden.bs.modal', '#authoring-modal', function () {
            GRAPH_AUTH.visible_class = '';
        });

        AH.listen('body', 'change', 'input.integer', function (current) {
            changeValue(current);
        });

        AH.listen('body', 'keyup', 'input.integer', function (current) {
            changeValue(current);
        });

        AH.listen('body', 'input', 'input.integer', function (current) {
            changeValue(current);
        });

        AH.listen('body', 'click', '#deleteElm', function (current) {
            let cur_elem = current.children[0];
            let attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#ID0' , 'attributes')); 
            cur_elem.classList.toggle('active');
            if ( AH.select('#' + attrs.id).classList.contains('point') || AH.select('#' + attrs.id).classList.contains('circle') || AH.select('#' + attrs.id).classList.contains('association') ) {
                if (cur_elem.classList.contains('active')) {
                    swal(l.delete_msg);
                    cur_elem.style.color = 'black';
                }
            } else if (cur_elem.classList.contains('active')) {
                cur_elem.style.color = 'black';
                swal(l.last_delete_msg);
            }
        });

        AH.listen('body', 'keypress', '#authoring-modal input', function (current, event) {
            if (event.which == 13) {
                return false;
            }
        });

        AH.listen('body', 'keyup', '#authoring-modal .validate', function (current, event) {
            event.preventDefault();
            event.stopPropagation();
            if (event.keyCode == 13) {
                AH.select('#authoring-modal .addElement').click();
            }
            GRAPH_AUTH.isValid = false;
            AH.selectAll('.error', 'remove');
            AH.setCss(current, {
                border: '1px solid red',
                background:  "#FFCECE"
            })
            if (current.value == '') {
                AH.insert(current.parentElement, '<span class="error text-danger">' + l.fill_field + '</span>', 'beforeend');
            } else if (current.classList.contains('num') && current.value <= 0) {
                AH.insert(current.parentElement, '<span class="error text-danger">' + l.value_gt_zero + '</span>', 'beforeend');
            } else if (!isNumeric(current.value) && current.classList.contains('num')) {
                AH.insert(current.parentElement, '<span class="error text-danger">' + l.enter_number + '</span>', 'beforeend');
            } else {
                GRAPH_AUTH.isValid = true;
                AH.setCss(current, {
                    border: '1px solid #ced4da',
                    background:  "none"
                });
            }
        });

        AH.listen('body', 'change', '#authoring-modal .select', function (current) {
            GRAPH_AUTH.resetData(current);
        });

        AH.listen('body', 'click', '.add-equation', function () {
            AH.insert('.numberlinePlot', AH.select('.plotEq').innerHTML, 'beforeend');
            AH.find('.numberlinePlot', '.remove-eq', {
                action: 'css',
                actionData: {
                    display: 'block'
                }
            });
        });

        AH.listen('body', 'click', '.remove-eq', function (current) {
            current.parentElement.remove();
        });

        AH.listen('body', 'click', '.footer_toolbox li', function (current) {
            current.classList.add('btn_active');
            AH.selectAll(AH.siblings(current), 'removeClass', 'btn_active')
        });
    });

    // for updating the xml into the state
    afterUpdate(async() => {
        if (!is_resource_added) {
            if (typeof(JXG) != 'undefined') {
                GRAPH_AUTH.initGraph();
            } else {
                AH.addScript('', itemUrl + 'clsSMGraph/lib/jsxgraph.min.js', { callback: function () {
                    GRAPH_AUTH.initGraph();
                }});
            }
            
            is_resource_added = true;
        }
        if ( state.xml != xml && AH.select('#special_module_xml').value && typeof(JXG) != 'undefined' && !(editorState.stopAuthoringUpdate)) {
            auth_store.update( (item) => {
                item.xml = xml;
                return item;
            });
        }
    })

    // for checking the the number is numeric or
    function isNumeric(num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    }

    // call whenever there is change in the graph type select box
    function changeValue(current) {
        let fixed = current.value.replace(/[^0-9]/g, "");
        if (current.value !== fixed) {
            current.value = fixed;
        }
    }

    // function responsible for updating the xml
    function updateXml() {
        if (editorState.stopAuthoringUpdate) {
            return false;
        }
        let xml = AH.select('#special_module_xml').value;
        if (state.xml != xml) {
            // updates the props of the component
            getChildXml(xml);
        }
    }

    // funcion responsible for loading the module
    function loadModule(loadXml) {
        // assign the json value to variable loadXml after converting xml into json
        loadXml = XMLToJSON(loadXml);
        // sets the value of variable QXML and re-render the component
        parseXMLAuthoring(loadXml);
    }

    // function responsible for parsing the xml
    function parseXMLAuthoring(MYXML) {
        QXML = MYXML.smxml.plot;
        if (QXML._type == 'association') {
            swal(l.deprecated);
        }
    }

    // function responsible for solving the algorithm and after that stops the update until algorithm is remove
    function solveAuthoring() {
        AH.activate(2);
        let tempXml = state.xml;
        let data = {};
        data['special_module_xml'] = tempXml;
        data['algo_qxml'] = AH.select("#algo_qxml").nodeName ? AH.select("#algo_qxml").value : '';

        AH.ajax({
            url: baseUrl + 'editor/index.php',
            data: { ajax: "1", action: 'parse_algo', content_text: JSON.stringify(data) },
            type: 'POST',
            onEnd: function() {
                AH.activate(0);
            }
        }).then( function(response) {
            let res = JSON.parse(response);

            AH.select('#special_module_xml').value = res.special_module_xml;
            loadModule(res.special_module_xml)
            
            GRAPH_AUTH.initGraph();

            editorState.stopPreviewUpdate = true;
            editorState.stopAuthoringUpdate = true;
            GRAPH_AUTH.stopUpdate = true;
        });
    }
</script>

<div>
    <center>

        {#if (editorState.is_algo && editorState.variable_button)}
            <button class="btn btn-light float-left m-sm" type="button" on:click={solveAuthoring}>{l.solve}</button> 
        {/if}
        <div
            id="mthmain"
            style="
                height: {QXML._height}px;
                width: {QXML._width}px;
                clear: both;
            "
            class="position-relative bg-white"
        >
            <div id="option-toolbar" class="text-dark">
                <ul class="controls">
                    <li value="plotgraph" class="selected-option text-uppercase">{QXML._type}</li>
                </ul>
                <div class="btn-group delete-tools zindex0 pe-0 h" id="deleteElm" >
                    <div
                        class="btn btn-light p-1"
                        tabIndex="0"
                    >
                        <i data-bs-toggle="tooltip" title={l.delete} class="icomoon-new-24px-delete-1"></i>
                    </div>
                </div>
                <div class="btn-group edit-tools zindex0 ps-0" data-t="plotgraph" id="plotgraph">
                    <div
                        class="btn btn-light p-1"
                        tabIndex="0"
                        on:click={(event) => GRAPH_AUTH.elemModal('plotgraph', event.currentTarget, QXML._id)}
                    >
                        <i title={l.edit_graph} data-bs-toggle="tooltip" class="icomoon-24px-edit-1"></i>
                    </div>
                </div>
            </div>
            <div
                id={QXML._id}
                type={QXML._type}
                class={"drag-resize dropable " + QXML._type}
                data-xtickdistance={QXML._xtickdistance}
                data-ytickdistance={QXML._ytickdistance}
                data-xaxis={QXML._xaxis}
                data-yaxis={QXML._yaxis}
                data-snapsize={QXML._snapsize}
                data-equation={QXML._equation}
                style="
                    height: {(QXML._height - 40)}px;
                    width: {QXML._width}px;
                    border: 1px solid #ccc;
                "
            ></div>
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
        <MathModal l={l} is_association={(QXML._type == 'association') ? 1: 0 }/>
    </center>
    <input type="hidden" id="special_module_xml"/>
</div>