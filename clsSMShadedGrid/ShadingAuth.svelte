<!--
 *  File Name   : ShadingAuth.svelte
 *  Description : Container for Shading Authoring Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 05-Feb-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount, afterUpdate } from "svelte";
    import { XMLToJSON, AH, JSONToXML} from '../helper/HelperAI.svelte';
    import l from '../src/libs/editorLib/language';
    import InputField from './inputField.svelte';
    import ShadedGridTable from "./shadedGridTable.svelte";
    export let getChildXml;
    export let xml;
    let state = {
        xml:'',
        gridWidth: "",
        gridHeight: "",
        rowCount: "1",
        colCount: "4",
        cellWidth: "2",
        cellHeight: "2",
        correctAns: [],
        correctCount: 1,
        shadedCell: [],
        cellLocked: 'false',
        hiddenCell: [],
        authorMethod: "byLocation",
        methodCount: "",
        lockedCellValue: "",
    };
    let cellShaded;
    let showSelectedAns = "";
    let sizeMultipleIndex = 40;
    let table_value, total_row_count, table_corr_value;

    onMount(() => {
        state.xml = xml;
        loadModule(xml);
    });

    $: {
        let index, showAnsIndex;
        table_value = [], total_row_count = [], table_corr_value = [];
        // to create grids
        for (let i = 0; i < state.rowCount; i++) {
            total_row_count = [
                ...total_row_count, {
                    id : 'gridRow_' + i
                }
            ];
			for (let j = 0; j < state.colCount; j++) {
				index = state.shadedCell.indexOf(i + "_" + j);
                cellShaded = (index!= -1) ? "gridSelected" : "";
                // To check for correct answer cells
                showAnsIndex = state.correctAns.indexOf(i + "_" + j);
                if (state.correctAns != "") {
					showSelectedAns = (showAnsIndex!= -1) ? "gridSelected" : "";
				} else {
					showSelectedAns = "";
				}
                table_value = [
                    ...table_value, {
                        id : "grid"+ i + "_" + j,
                        dataid: i + "_" + j,
                        class: cellShaded,
                        width: parseInt(state.gridWidth) + 'px',
                        height: parseInt(state.gridHeight) + 'px',
                        rowno: i
                    }
                ];
                table_corr_value = [
                    ...table_corr_value, {
                        id : "grid_a"+ i + "_" + j,
                        dataid: i + "_" + j,
                        class: showSelectedAns,
                        width: parseInt(state.gridWidth) + 'px',
                        height: parseInt(state.gridHeight) + 'px',
                        rowno: i
                    }
                ];
			}
        }
        if (xml!=state.xml) {
			state.xml = xml;
			loadModule(xml); 	
		}
    }

    // loads the module and update the xml
    function loadModule(loadXml) {
        // contains the json data of xml
		loadXml = XMLToJSON(loadXml);
        // parses the xml and updates the sliders elements value
		parseXMLAuthoring(loadXml);
    }

    // parses the xml and updates the values of sliders elements
    function parseXMLAuthoring(MYXML) {
        try {
            state.correctAns = (MYXML.smxml._correctAns.trim()) ? MYXML.smxml._correctAns.split(",") : [];
            state.shadedCell = (MYXML.smxml._shadedCell.trim()) ? MYXML.smxml._shadedCell.split(",") : [];
            state.rowCount = MYXML.smxml._rowCount;
            state.colCount = MYXML.smxml._colCount;
            state.gridWidth = parseInt(MYXML.smxml._cellWidth) * sizeMultipleIndex;
            state.gridHeight = parseInt(MYXML.smxml._cellHeight) * sizeMultipleIndex;
            state.cellWidth = MYXML.smxml._cellWidth;
            state.cellHeight = MYXML.smxml._cellHeight;
            state.cellLocked = MYXML.smxml._lockedCell;
            if(state.cellLocked == 'true') {
                AH.select('#lock_author_cell').checked = true;
            } else {
                AH.select('#lock_author_cell').checked = false;
            }
            // update the xml after converting json xml into xml
			getChildXml(JSONToXML(MYXML));
		} catch(events) {
            console.warn({
                'error': events.message,
                'function name': 'parseXMLAuthoring',
                'File name': 'ShadingAuth.svelte'
            });
		}
	}
    
    //it manages the click event on grid
    function authorClick(e) {
        let cell = e.detail.value.target.id;
		let selectedGrid;
		let index;
		selectedGrid = AH.select(".shadingAuth #"+cell).getAttribute("data-id");
		if ((!AH.select(".shadingAuth #"+cell).classList.contains("lockedGrid"))) {
			if (AH.select(".shadingAuth #"+cell).getAttribute("data-grid") == "no") {
                AH.selectAll(".shadingAuth #"+cell, 'addClass', 'gridSelected');
                AH.select(".shadingAuth #"+cell).setAttribute("data-grid", "selected");
				if (!state.shadedCell.includes( selectedGrid)) {
					state.shadedCell.push(selectedGrid);
				}
			} else {
				index = state.shadedCell.indexOf(selectedGrid);
                state.shadedCell.splice(index, 1);
                AH.selectAll(".shadingAuth #"+cell, 'removeClass', 'gridSelected');
				AH.select(".shadingAuth #"+cell).setAttribute("data-grid", "no");
			}
		}
        // updates the xml when the value of any elements changed
		updateXml();
    }

    // to handle click event of correct answer grid
    function boxClick(e) {
		let selectedGrid;
		let index;
		let targetId = e.detail.value.target.id;
		selectedGrid = AH.select(".shadingAuth #"+targetId).getAttribute("data-id");
		if ((!AH.select(".shadingAuth #" + targetId).classList.contains("lockedGrid"))) {
			if (AH.select(".shadingAuth #"+targetId).getAttribute("data-grid") == "no") {
                AH.select(".shadingAuth #"+targetId).setAttribute("data-grid", "selected");
                AH.selectAll(".shadingAuth #"+targetId, 'addClass', 'gridSelected');
				if (!state.correctAns.includes( selectedGrid)) {
					state.correctAns.push(selectedGrid);
				}
			} else {
				index = state.correctAns.indexOf(selectedGrid);
                state.correctAns.splice(index, 1);
                AH.selectAll(".shadingAuth #"+targetId, 'removeClass', 'gridSelected');
                AH.select(".shadingAuth #"+targetId).setAttribute("data-grid", "no");
			}
		}
        // updates the xml when the value of any elements changed
		updateXml();
	}

    // updates the xml when the value of any elements changed
    function updateXml() {
		setTimeout( function() {
			let updatedXml = '<smxml type="44" name="Shading" rowCount="' + state.rowCount + '" colCount="' + state.colCount + '" cellWidth="' + state.cellWidth + '" cellHeight="' + state.cellHeight + '" correctAns="' + state.correctAns + '" correctCount="' + state.methodCount + '" shadedCell="' + state.shadedCell + '" lockedCell="' + state.cellLocked + '" HiddenCell="' + state.hiddenCell + '" lockedCellValue="' + state.lockedCellValue + '"><!--[CDATA[]]--></smxml>';
			getChildXml(updatedXml);			
		}, 100);
	}

    // to handle on change event of input fields
    function handleChange(eve) {
        let cur_elem = eve.detail.value.target;
        let cellWidthVal = AH.select('#cellWidth').value;
        let cellHeightVal = AH.select('#cellHeight').value;
        let rowCountVal = AH.select('#rowCount').value;
        let colCountVal = AH.select('#colCount').value;
        let methodCountVal = AH.select('#methodCount').value;
        let elementVal = cur_elem.value;
		let min = cur_elem.min;
		let element_id = cur_elem.id;
        let max = cur_elem.max;
        state[cur_elem.name] = cur_elem.value;
        state.gridWidth = parseInt(cellWidthVal) * sizeMultipleIndex;
        state.gridHeight = cellHeightVal * sizeMultipleIndex;
        state.rowCount = rowCountVal;
        state.colCount = colCountVal;
        state.methodCount = methodCountVal;

        if (element_id != "methodCount" && AH.select('#methodCount').value != "") {
            state.methodCount = AH.select('#methodCount').getAttribute('min');
        }
        // For handeling input's min and max value on Keyup 
		if (elementVal != "") {
			let labelText = AH.select("#" + cur_elem.id).getAttribute("data-label"); 
			if (parseInt(elementVal) < parseInt(min)) {
				AH.alert(labelText+ " can be between \n"+ min + " to " + max);
				state[cur_elem.name] = min;
			} else if (parseInt(elementVal) > parseInt(max)) {
				AH.alert(labelText+ " can be between \n"+ min + " to " + max);
				state[cur_elem.name] = max;
			}
		}
		resetValues();
        updateXml();
    }

    // to reset the shaded grid and correct answer grid
    function resetValues() {
        AH.selectAll("#authoringMethod_table .gridColor,.authShadeTable .gridColor", 'removeClass', 'lockedGrid');
        AH.selectAll("#authoringMethod_table .gridColor,.authShadeTable .gridColor").forEach((gridVal) => {
            gridVal.setAttribute("data-grid", "no");
        });
        state.correctAns = [];
        state.shadedCell = [];
        state.cellLocked = 'false';
        state.lockedCellValue = '';
    }

    // to handle on blur event of input fields
    function inputChangeBlur(eve) {
        let cur_elem_blur = eve.detail.value.target;
        if (cur_elem_blur.value == '') {
            AH.alert(l.empty_field);
            state[cur_elem_blur.name] = cur_elem_blur.min;
            resetValues();
            updateXml();
        }
    }

    // to lock the shaded grid if it is part of corrct answer. done by checkbox
    function checkboxHandler (e) {
		let lockCell = 0;
		state.shadedCell.map(function(data, i) {
			state.correctAns.map(function(data2, j) {
				if (data == data2) {
					lockCell = lockCell + 1;
				}
			});
		});
		if (state.shadedCell.length == 0) {
            AH.alert("Please shade the cells");
            e.preventDefault();
		} else {
			if (lockCell == state.shadedCell.length || state.methodCount != '') {
				state.cellLocked = state.cellLocked == 'true' ? 'false' : 'true';
                let auth_id = '';
                AH.selectAll(".authShadeTable td.gridSelected").forEach((value) => {
                    auth_id += value.getAttribute('data-id') + ',';	
                });
                auth_id = auth_id.substr(auth_id, auth_id.length - 1);
                if (state.cellLocked == 'true') {
                    AH.selectAll(".authShadeTable td.gridSelected, .authMethodTable #grid_a"+auth_id.split(',').join(',.authMethodTable #grid_a'), 'addClass', 'lockedGrid');
                    state.lockedCellValue = auth_id;
                } else {
                    AH.selectAll(".authShadeTable td.gridSelected, .authMethodTable #grid_a"+auth_id.split(',').join(',.authMethodTable #grid_a'), 'removeClass', 'lockedGrid');
                    state.lockedCellValue = '';
                }
				updateXml();
			} else {
                AH.alert(l.lock_author_cell);
                e.preventDefault();
			}	
		}
    }
    
    // to handle change event of select field to specify the correct answer method
    function handleAuthoringMethod(event) {
        state.authorMethod = event.target.value;
        let _this = AH.select("[name="+event.target.name+"]");
        AH.selectAll('.'+_this.options[_this.selectedIndex].getAttribute('data-show'), 'addClass', 'd-inline-block')
        AH.selectAll('.'+_this.options[_this.selectedIndex].getAttribute('data-hide'), 'removeClass', 'd-inline-block')
        if (AH.select("[name='"+event.target.name+"']").value == "byCount") {
			state.correctAns = "";
			state.methodCount = 1;
		} else {
			state.methodCount = "";
		}
		resetValues();
		updateXml();
    }
    
    // for ada checkbox
    function adaKeyupCheckbox(e) {
        if (e.keyCode == 13) {
            checkboxHandler(e);
        }
    }

    // for ada correct ans grid
    function adaKeyupBoxClick(e) {
        if (e.detail.value.keyCode == 13) {
            boxClick(e);
        }
    }

    // for ada shaded grid
    function adaKeyupAuthorClick(e) {   
        if (e.detail.value.keyCode == 13) {
            authorClick(e);
        }
    }
    
</script>
<div class="shadingAuth">
    <div class="col-sm-12 mb-4 font-weight-bold font15">{l.canvas_options}</div>
    <div class="row form-group">
        <div class="row mx-0 px-3 mb-4">
            <InputField 
                labelname={l.row_count} 
                max=10 
                name=rowCount 
                id="rowCount" 
                datalabel={"Number of rows"} 
                value={state.rowCount} 
                on:handleChange = {handleChange}
                on:inputChangeBlur = {inputChangeBlur}
            />
            <InputField 
                labelname={l.col_count} 
                max=10 
                name=colCount 
                id="colCount" 
                datalabel={"Number of column"} 
                value={state.colCount} 
                on:handleChange = {handleChange}
                on:inputChangeBlur = {inputChangeBlur}
            />
        </div>
        <div class="row mx-0 px-3">
            <InputField 
                labelname={l.cell_width} 
                max=5 
                name=cellWidth 
                id="cellWidth" 
                datalabel={"Width Value"} 
                value={state.cellWidth} 
                shwmsg="1"
                msgdetail={sizeMultipleIndex}
                on:handleChange = {handleChange}
                on:inputChangeBlur = {inputChangeBlur}
            />
            <InputField 
                labelname={l.cell_height} 
                max=5 
                name=cellHeight 
                id="cellHeight" 
                datalabel={"Height Value"} 
                value={state.cellHeight} 
                shwmsg="1"
                msgdetail={sizeMultipleIndex}
                on:handleChange = {handleChange}
                on:inputChangeBlur = {inputChangeBlur}
            />
        </div>
    </div>
    <div class="col-sm-12 mb-4 font-weight-bold font15">{l.author_shaded}</div>
    <div class="col-sm-12 mb-4">
        <ShadedGridTable 
            table_id="shadingtable" 
            table_class="shadingTable authShadeTable"
            total_row_count={total_row_count}
            table_value={table_value}
            on:gridClick = {authorClick}
            on:adaKeyupClick = {adaKeyupAuthorClick}
        />
    </div>
    <div class="col-sm-12 mb-5">
        <div class="input-check">
            <label for="lock_author_cell" class="custom_checkbox_new float-left mr-1">
                <input 
                    type="checkbox" 
                    id = "lock_author_cell"
                    value={state.cellLocked}
                    on:click = {checkboxHandler}
                    on:keyup={adaKeyupCheckbox}
                    aria-label = 'Lock Author checkbox'
                >
                <div class="check_mark_custom pt-sm1"></div>
            </label>
            <label for="lock_author_cell">{l.lock_shaded_cells}</label>
        </div>
    </div>
    <hr class="border-dashed-top" />
    <div class="col-sm-12 mb-4 font-weight-bold font15">{l.set_corr_ans}</div>
    <div class="col-sm-12 mb-4 font-weight-bold font15">{l.method}</div>
    <div class="col-sm-12 mb-4 font-weight-bold font15">
        <select 
            value={state.authorMethod} 
            name="authorMethod" 
            class="bg-gray-hover form-control width-authoring d-inline-block" 
            on:change={handleAuthoringMethod}
        >
            <option value="byLocation" id="byLoc_sel" data-show="locationMethod" data-hide="countMethod" selected="selected">{l.set_corr_loc}</option>
            <option value="byCount" id="bycount_sel" data-show="countMethod" data-hide="locationMethod">{l.set_corr_count}</option>
        </select>
        <div class="mb-4 ml-3 width-authoring countMethod h">
            <InputField 
                max={state.rowCount * state.colCount}
                value={state.methodCount}
                on:handleChange = {handleChange}
                on:inputChangeBlur = {inputChangeBlur}
                set_corr_ans = 1
            />
        </div>
    </div>
    <div class="col-sm-12 mb-4 locationMethod h d-inline-block">
        <ShadedGridTable 
            table_id="authoringMethod_table" 
            table_class="shadingTable authMethodTable"
            total_row_count={total_row_count}
            table_value={table_corr_value}
            on:gridClick = {boxClick}
            on:adaKeyupClick = {adaKeyupBoxClick}
        />
    </div>
</div>