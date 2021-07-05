<!--
 *  File Name   : ShadingPreview.svelte
 *  Description : Container for Shading Authoring Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 05-Feb-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount, afterUpdate } from "svelte";
    import { XMLToJSON, AH, onUserAnsChange} from '../helper/HelperAI.svelte';
    import l from '../src/libs/editorLib/language';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import "./css/ShadingStyle.min.css";
    export let xml;
    export let uxml;
    export let isReview;
    export let showAns;
    export let editorState;

    let showSelectedAns = "";
    let ans = [];
    let ansCheck, userTab = true;
    let ansNotPerformed;
    let incorrectCls = "";
    let countRes = "";
    let sizeMultipleIndex = 40;
    let class_val = 1;
    let cellIndex, showAnsIndex, locked_cell_values, shaded_cell_values, preview_table, total_row_count;
    let state = {
        rowCount: 1,
        colCount: 4,
        gridWidth: 80,
        gridHeight: 80,
        correctAns: [],
        correctCount: "",
        userAns: [],
        shadedCell: [],
        cellLocked: false,
        hiddenCell: [],
        smController: "h",
        itemLayout: [],
        iconVisible: "h",
        pointerEvents: "auto",
        checkLockCell: "",
        lockedCellValue: "",
        //pointerEvents: ""
    }

    onMount(() => {
        state.xml = xml;
        resetValue();
        if (!uxml) {
            state.userAns = [];
        }
        loadModule(xml);
        //for future use
		//let timer = setTimeout(function() {
			//AH.select("#special_module_user_xml").innerText = "<smans userAns='" + state.userAns.join() + "'></smans>";
            //new_uxml = "<smans userAns='" + state.userAns.join() + "'></smans>";
			//clearTimeout(timer);
		//}, 500);
    });
    
    $: {
        if (isReview) {
            setReview(); 
            
        } else {
            unsetReview();
        }
        if (xml!=state.xml) {
			state.xml = xml;
			loadModule(xml);
		}
        total_row_count = [], preview_table = [];
		cellIndex;
		showAnsIndex;
		locked_cell_values = (state.lockedCellValue != undefined && state.lockedCellValue != '') ? state.lockedCellValue.split(',') : '';
        shaded_cell_values = (state.shadedCell != '') ? state.shadedCell.split(',') : '';
        //to create grid
        for (let i = 0; i < state.rowCount; i++) {
            total_row_count = [
                ...total_row_count, {
                    id : 'gridRow_' + i
                }
            ];
            for (let j = 0; j < state.colCount; j++) {
                cellIndex = (i + "_" + j);
				if (ans != "") {
					showAnsIndex = ans.indexOf(cellIndex);
					showSelectedAns = (showAnsIndex != -1) ? "gridSelected" : "";
				} else {
					showSelectedAns = "";
                }
                preview_table = [
                    ...preview_table, {
                        id: 'p' + cellIndex,
                        tabindex: (state.pointerEvents == "auto") ? "0" : "",
                        arialabel: "Grids row "+ (i+1) + " and column " + (j+1) + " is selected",
                        pevdata: cellIndex,
                        class: showSelectedAns,
                        width: parseInt(state.gridWidth) + 'px',
                        height: parseInt(state.gridHeight) + 'px',
                        classDetails: getClassDetail(cellIndex,locked_cell_values,shaded_cell_values),
                        correctAnswerColor: setCorrectAnswerColor(cellIndex),
                        spanclass: (getCorrect(cellIndex)) ? "icomoon-24px-correct" : "icomoon-24px-close",
                        spanarialabel: (getCorrect(cellIndex)) ? (getNotPerformed(cellIndex) ? "marked as unattempted" : "marked as correct") : "marked as incorrect",
                        spanstyle: (!state.userAns.includes(cellIndex) ? (getNotPerformed(cellIndex) ? "#222" : "") : ((getCorrect(cellIndex)) ? "#136d13" : "#c30f0f")),
                        spandisplay: ((state.iconVisible == "" && state.userAns.includes(cellIndex)) || (state.iconVisible == "" && !state.userAns.includes(cellIndex) && getNotPerformed(cellIndex))) ? "block" : "none",
                        rowno: i,
                        corrspanclass: (getCorrect(cellIndex)) ? "icomoon-24px-correct" : "",
                        corrspanstyle: (getCorrect(cellIndex)) ? "#136d13" : "",
                    }
                ]
            }
        }
    }

    // Set correct answer color
    function setCorrectAnswerColor(id) {
		// Return grid Color green for correct answer, red for incorrect answer and grey for not performed
		ansCheck =  (state.iconVisible == "" && state.userAns.includes(id)) ? ((getCorrect(id)) ? " gridCorrect" : " gridIncorrect") : ""; 
		ansNotPerformed = (state.iconVisible == "" && !state.userAns.includes(id)) ? ((getNotPerformed(id)) ? " gridNotPerformed" : "") : ""; 
		ansCheck = ansCheck + ansNotPerformed;
		 return ansCheck;
    }
    
    //to show shaded grid according to uxml
    function parseUserAns(uans) {
        let userAnswer = XMLToJSON(uans);
		state.userAns = userAnswer.smans._userAns.split(",");
        if (userAnswer.smans._userAns) {
			let user_ans_cell = '#p' + userAnswer.smans._userAns.split(',').join(',#p');
            AH.selectAll('.shadingPreview .shadingTable td', 'removeClass', "gridSelected");
            AH.selectAll('.shadingPreview .shadingTable td').forEach(function(table_td) {
                table_td.dataset.grid = "no";
            });
            AH.selectAll(user_ans_cell, 'addClass', "gridSelected");
            AH.selectAll(user_ans_cell).forEach(function(table_td) {
                table_td.dataset.grid = "selected";
            });
		}
    }

    // loads the module according to the value of question xml and user xml
    function loadModule(loadXml) {
        loadXml = XMLToJSON(loadXml);
        parseXMLPreview(loadXml);
    }

    // updates the xml after parsing the xml and shows answer
    function parseXMLPreview(MYXML) {
		try {
                state.rowCount = MYXML.smxml._rowCount;
                state.colCount = MYXML.smxml._colCount;
                state.gridWidth = parseInt(MYXML.smxml._cellWidth) * sizeMultipleIndex;
                state.gridHeight = parseInt(MYXML.smxml._cellHeight) * sizeMultipleIndex;
                state.correctAns = MYXML.smxml._correctAns.split(",");
                state.correctCount = MYXML.smxml._correctCount;
                state.cellLocked = MYXML.smxml._lockedCell;
                state.hiddenCell = MYXML.smxml._hiddenCell;
                state.shadedCell = MYXML.smxml._shadedCell;
                state.lockedCellValue = MYXML.smxml._lockedCellValue;
                setDefaultValues();
                
                if (uxml) {
                    parseUserAns(uxml);
                }
		} catch(error) {
                console.warn({'error':error.message,'function name':'parseXMLPreview','File name':'ShadingPreview.js'});
        }
	}

    //reset the shaded grid and correct grid
    function resetValue() {
        state.correctAns = [];
        state.correctCount = [];
        state.shadedCell = [];
    }

    //to check if the shaded grid is correct or not
    function getCorrect(id) {
		//Return true if this id is correct answer
		if (state.correctAns != 0) {
			if (state.correctAns.includes(id)) {
				return true;
			} else {
				return false;
			}	
		} else {
			if (state.userAns.length == state.correctCount) {
				incorrectCls = "#136d13";
				return true;
			} else {
				incorrectCls = "#c30f0f";
				return false;
			}
		}
    }

    //to check if the correct ans grid is checked or not
    function getNotPerformed(id) {
		let result;
		if (state.correctAns != 0) {
			result = ( state.correctAns.includes(id) && !state.userAns.includes(id)) ? true : false;
		}
		return result;
    }

    // Set lock to author shaded cells
    function getClassDetail(cellIndex, locked_cell_values, shaded_cell_values) {
		let classDetail = '';
		if (locked_cell_values.indexOf(cellIndex) != -1) {
			classDetail +="lockedGrid ";
		}
		if (shaded_cell_values.indexOf(cellIndex) != -1 && class_val == 1) {
			classDetail +="gridSelected";
		}
		return classDetail;
    }

    //set default values after loading 
    function setDefaultValues() {
		let shadedCell = (state.shadedCell != '') ? '#p' + state.shadedCell.split(',').join(',#p') : '';
		AH.selectAll('.shadingPreview .shadingTable td', 'removeClass', ['gridSelected', 'lockedGrid']);
        AH.selectAll('.shadingPreview .shadingTable td').forEach(function(table_td) {
            table_td.dataset.grid = "no";
        });
        if (shadedCell != '') {
            AH.selectAll(shadedCell, 'addClass', 'gridSelected');
            AH.selectAll(shadedCell).forEach(function(table_td) {
                table_td.dataset.grid = "selected";
            });
        }
        let lockedCell = (state.lockedCellValue != undefined && state.lockedCellValue != '') ? '#p' + state.lockedCellValue.split(',').join(',#p') : '';
        if (lockedCell != '') {
            AH.selectAll(lockedCell, 'addClass', 'lockedGrid');
            AH.selectAll(lockedCell).forEach(function(table_td) {
                table_td.dataset.grid = "selected";
            });
        }
    }

    //function to execute when the grid is clicked
    function gridClickPreview(e) {
		let targetId = e.target.id;
        class_val--;
		if ((!AH.select(".shadingPreview [id='"+targetId+"']").classList.contains("lockedGrid"))) {
			if (!AH.select(".shadingPreview [id='"+targetId+"']").classList.contains("gridSelected")) {
                AH.select(".shadingPreview [id='"+targetId+"']").setAttribute("data-grid", "selected");
                AH.selectAll(".shadingPreview [id='"+targetId+"']", 'addClass', "gridSelected");
			} else {
                AH.select(".shadingPreview [id='"+targetId+"']").setAttribute("data-grid", "no");
                AH.selectAll(".shadingPreview [id='"+targetId+"']", 'removeClass', "gridSelected");
			}
		}

        //state.userAns = userAns;
        let u_answer = checkAns();
        if(!editorState) {
            onUserAnsChange({uXml: state.userxml, ans: u_answer});
        }
    }

    //to show correct and user answer 
    function showAnswer(val , iconState) {
        //show correct incorrect icon with respect to iconState
        if (iconState == "showIcon") {
            state.iconVisible = "";
        } else {
            state.iconVisible = "h";
		}
		
        //show correct answer and user answer
        if (val == "cans") {
			ans = state.correctAns;
        } else if(val == "yans") {
			ans = state.userAns;
		}
    }

    //to check answer
    function checkAns() {
		const correctLength = state.correctAns.length;
		let resultLength = 0;
		let resultCountLen = 0;
        let ans_val = "", ans_status = '';
        state.userAns = [];
		AH.selectAll('.shadingPreview .shadingTable .gridSelected').forEach(function(value) {
			state.userAns.push(value.getAttribute("pevdata-id"))
		});
        AH.select("#special_module_user_xml").innerText = "<smans userAns='"+state.userAns.join()+"'></smans>";
		state.userxml = "<smans userAns='"+state.userAns.join()+"'></smans>";

		if (state.correctAns != "") {
			state.correctAns.map(function(data, i) {
				state.userAns.map(function(data2, j) {
					if (data == data2) {
						resultLength = resultLength + 1;
					}
				});
			});
			
			//Check if total no. of user answer is equal to correct answer
			if (correctLength == resultLength && resultLength == state.userAns.length) {
				ans_val = l.correct;
			} else {
				ans_val = l.incorrect;
			}
			if (typeof calculatePoint != "undefined") {
				calculatePoint(state.correctAns.length, resultLength);
			}
            if (ans_val == 'Incorrect') {
                ans_status = false;
            } else {
                ans_status = true;
            }
            if(editorState)  {
			    showAns(ans_val);
            }
		}

        if (state.correctCount != "" && state.correctAns == "") {
			if (state.userAns.length == state.correctCount) {
				countRes = l.correct;
				resultCountLen = state.correctCount;
			} else {
				countRes = l.incorrect;
			}
			if (typeof calculatePoint != "undefined") {
				calculatePoint(state.correctCount, resultCountLen);
			}
			if(editorState)  {
			    showAns(countRes);
            }
		}
        
        if(!editorState) {
            onUserAnsChange({uXml: state.userxml, ans: ans_status});
        }
        
        return ans_status;
    }

    //if review mode is OFF
    function unsetReview() {
        showAnswer("yans", "hideIcon");
        isReview = false;
        (state.correctCount != "" && state.correctAns == "") ? AH.selectAll('#correctCountStatus', 'addClass', 'h') : "";
    }

    //if review mode is ON
    function setReview() {
        showAnswer("yans", "showIcon");
        isReview = true;
        checkAns();
        (state.correctCount != "" && state.correctAns == "" ) ? AH.selectAll('#correctCountStatus', 'removeClass', 'h') : "";
    }

    //ada
    function adaKeyupGridClick(e) {
        if (e.keyCode == 13) {
            gridClickPreview(e);
        }
    }

    //to switch correct ans and your ans tab
    function handleReviewMode(mode) {
        if (mode == 'c') {
            userTab = false;
        } else if (mode == 'u') {
            userTab = true;
        }
    }

</script>
<!-- <link onload="this.rel='stylesheet'" rel="preload" as="style" href={editor.baseUrlTheme + "clsSMShadedGrid/css/ShadingStyle.min.css"} /> -->
<div class="shadingPreview">
    <ItemHelper 
        on:setReview = {setReview}
        on:unsetReview = {unsetReview}
        reviewMode={isReview}
        handleReviewClick = {handleReviewMode}
    />
    <table id="table" class="table-bordered shadingTable" style="pointer-events: {isReview ? 'none' : ''};">
        <tbody>
            {#if total_row_count && total_row_count.length > 0}
                {#each total_row_count as val, i}
                    <tr>
                        {#if preview_table && preview_table.length > 0}
                            {#each preview_table as data}
                                {#if i == data.rowno}
                                    <td 
                                        id={data.id} 
                                        tabindex={data.tabindex} 
                                        aria-label={data.arialabel} 
                                        data-grid="no" 
                                        pevdata-id={data.pevdata}
                                        class={`${(isReview && userTab == false) ? '' : data.class} ${data.classDetails} ${(isReview && userTab == false) ? (data.spanclass == 'icomoon-24px-correct' ? 'gridCorrect' : '') : data.correctAnswerColor} gridColor pointer border-dark text-center`}
                                        on:click={gridClickPreview} 
                                        on:keyup="{adaKeyupGridClick}"
                                        style="width: {data.width}; height: {data.height}; pointerEvents: pointerEvents"
                                    >
                                        {#if isReview}
                                            {#if userTab == true}
                                                <span class={state.iconVisible} style="display: {data.spandisplay}">
                                                    <span class="{data.spanclass}" aria-label="{data.spanarialabel}" style="color: {data.spanstyle}"></span>
                                                </span>
                                            {:else}
                                                <span>
                                                    <span class="{data.corrspanclass}" aria-label="{data.spanarialabel}" style="color: {data.corrspanstyle}"></span>
                                                </span>
                                            {/if}
                                        {/if}
                                    </td>
                                {/if}
                            {/each}
                        {/if}
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
    <div class="h mt-5 text-center" id="correctCountStatus" style="color: {incorrectCls}">
        {l.you_were_req_to_select} {state.correctCount} {l.grid_mark_ans_correct}
    </div>
</div>