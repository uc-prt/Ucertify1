
<!-- 
*  File Name   : ChooseNReorder.js
*  Description : Container for all Choose And Reorder Authoring Module
*  Author      : Sundaram Tripathi
*  Version     : 1.0
*  Package     : svelte_items
*  Last update :  -->

<script>
    import l from '../src/libs/editorLib/language.js';
    

    import { Button, Dialog, Checkbox } from 'svelte-mui/src';
    import {writable} from 'svelte/store';
    import {AH,XMLToJSON,JSONToXML} from "../helper/HelperAI.svelte";
    import { beforeUpdate } from 'svelte';
    import smVal from '../src/libs/editorLib/ValidateItems';
    import './css/choose.min.css';
    
    let localCData = [];
    let oldCData = [];
    let state = {};
    //var isCorrect = [];
    export let xml;
    export let getChildXml;
    export let changed_advance_xml;
    export let editorState;
    export let smValidate;
    //export uaXML

    /// Declare States

    let stateData = writable({
        xml                         : "",
        headingCorrect              : "",
        allowSort                   : "",
        isSentence                  : "",
        isParagraph                 : "",
        isadvance                   : false,
        CDATA                       : "",
        istoggled                   : false,
        openImageDialog             : false,
        openErrorDialog             : false,
        row_value                   : '',
        col_value                   : '',
        err_message                 : l.min_row_col_value,
        tomaketable                 : 'none',
        open                        : false,
        data_id                     : '',
        data_value                  : '',
        stateXMLToJSON              : '',
    }) 

    const unsubscribe = stateData.subscribe((items) => {
        state = items;
    })
    

    let isCorrect = [];
    $: {
        localCData.forEach(function(data,i){
            isCorrect[i] = ((data.value.charAt(0) == "*")?true:false)
            
            
        })
    }

    beforeUpdate(()=> {
        if (state.xml != xml) {
            state.xml = xml;
            // load module with the changed xml
            state.stateXMLToJSON = XMLToJSON(xml);
            //loadModule(xml);
            loadModule();
        }
    })

    // this function responsible for loading the module
    function loadModule() {
        //loadXml = XMLToJSON(loadXml);   // convert xml to json using XMLToJSON Function
        parseXMLAuthoring(state.stateXMLToJSON);  // xml parsing function
    }


    // xml parsing function
    function parseXMLAuthoring(MYXML) {
        let cdata, oldcdata;
        try {
            localCData = [];
            oldCData = [];
            //this.forceUpdate();
            /* used to check if 'MYXML.smxml.list._oldCData' is set or not */
            if (MYXML.smxml.list._oldCData) {
                oldcdata = MYXML.smxml.list._oldCData.split('###');
            }
            // split the cdata with new line
            cdata = MYXML.smxml.list.__cdata.split("\n");
            // finding the row and col then change the module to multogrid using changed_advance_xml
            if (MYXML.smxml.list._row && MYXML.smxml.list._col) {
                delete MYXML.smxml.list._allowsort;
                delete MYXML.smxml.list._headingAll;
                changed_advance_xml(JSONToXML(MYXML), 26);
            }
            // extracting data in localCData array
            cdata.forEach(function(data,i) {
                if (cdata[i].trim() != "") {
                    localCData.push({
                        value: cdata[i].replace(/^\s+/g, ""),
                        id: i
                    });
                }
            });
            if (oldcdata) {
                    oldcdata.forEach(function(data,index_no) {
                    if (oldcdata[index_no].trim() != "") {
                        oldCData.push({
                            value: oldcdata[index_no].replace(/^\s+/g, ""),
                            id: index_no
                        });
                    }
                });
            }
            // it update the attribute in lower case
            updateAttrToLower(MYXML);

            // setting state
                state.headingCorrect = MYXML.smxml.list._headingcorrect;
                state.allowSort = MYXML.smxml.list._allowsort;
                state.isSentence = MYXML.smxml.list._issentence;
                state.isParagraph = MYXML.smxml.list._isparagraph;
            //forceUpdate();
        } catch (error) {
            console.warn({
                'error': error,
                'function name': 'parseXMLAuthoring',
                'File name': 'ChooseNReorder.js'
            });
        }
    }


    // Used for Add new option if it passes the limit criteria
    function addNewItem() {
        let len = AH.find("#choose","#sortable li",'all').length;
        
        if (len <= 9) {
            addAfterPassedLimitCriteria();
        } else {
            AH && AH.alert('Maximum possible value of nodes are 10.');
        }
    }




     // this function is reponsible for updating the xml on the basis of checkbox option
    // selected (sequencing, in sentence, in paragraph) and the change in heading title
    function updateSetting(e) {
        //let xml = XMLToJSON(state.xml);
        let xml = state.stateXMLToJSON;
        switch (e.target.id) {
            case "allowSort":
                // if allowsort is checked
                if(state.isParagraph == "1" || state.isSentence == "1") {
                    document.querySelector("#allowSort").checked = true;
                }
                
                xml.smxml.list._allowsort = ((e.target.checked == true) ? "1" : "0");
                break;
            case "isSentence":
                // if issentence is checked             
                if (e.target.checked == true) {
                    
                    
                    if(document.querySelector('#allowSort').checked == false) {
                        
                        document.querySelector("#allowSort").click();
                        
                        document.querySelector("#allowSort").disabled = true;
                    } else {
                        
                        document.querySelector('#allowSort').disabled = true;
                    }
                    state.isSentence = "1";
                    state.allowSort = "1";
                    // changing the value of the attribute
                    xml.smxml.list._issentence = "1";
                    xml.smxml.list._allowSort = "1";
                    xml.smxml.list._isparagraph = "0";
                } else {
                    // if unchecked
                    
                    document.querySelector('#allowSort').disabled = false;
                    document.querySelector('#allowSort').click();
                    
                    state.isSentence = "0";
                    state.allowSort = "1";
                    
                    // updating attributes
                    xml.smxml.list._issentence = "0";
                    xml.smxml.list._allowSort = "0";
                }
                break;
            case "isParagraph":
                // if isParagraph is checked 
                if (e.target.checked == true) {
                
                    if(document.querySelector("#allowSort").getAttribute("checked") == false) {
                       // disable allowshort option when check isSentence and isParagraph
                        document.querySelector('#allowSort').click();
                        document.querySelector('#allowSort').disabled = true;
                    } else {
                    
                        document.querySelector("#allowSort").disabled = true;
                    }
                    
                    state.isParagraph = "1";
                    state.allowSort = "1";
                    
                    // updating attributes
                    xml.smxml.list._isparagraph = "1";
                    xml.smxml.list._allowSort = "1";
                    xml.smxml.list._issentence = "0";
                } else {
                    // if unchecked
                    document.querySelector("#allowSort").disabled = false; // removing disable on allowsort
                    document.querySelector("#allowSort").click()
                    
                    state.isParagraph = "0";
                    state.allowSort = "1";
                    
                    // changing the value of the attribute
                    xml.smxml.list._isparagraph = "0";
                    xml.smxml.list._allowSort = "0";
                }
                //xml.smxml.list._isparagraph = ((e.target.checked == true)? "1" : "0");
                break;
            case "headingCorrect":
                // if change ocuur in heading
                    state.headingCorrect = e.target.value
                // update attribute
                xml.smxml.list._headingCorrect = e.target.value;
                break;
        }
        // updating the xml
        getChildXml(JSONToXML(xml));
    }

     // it update the correct answer on clicking of checkbox button is clicked
    function updateCorrect(i, e) {
        if (e.target.checked == true) {
            // if checkbox is checked that means answer is correct so add * 
            localCData[i].value = "*" + localCData[i].value.trim();
        } else {
            localCData[i].value = localCData[i].value.trim().slice(1);
        }

        // xml to json
        //let xml = XMLToJSON(state.xml);
        let xml = state.stateXMLToJSON;
        var timer = setTimeout(function() {
            let newCData = "\n";
            // storing new data in newCData
            
            localCData.forEach(function(data,i) {
                newCData += localCData[i].value + "\n";
            });
            // updating attributes
            xml.smxml.list.__cdata = newCData;
            // updating the xml
            getChildXml(JSONToXML(xml));
            clearTimeout(timer);
        }.bind(this), 200);
    }


    // to add new option/item
    function addAfterPassedLimitCriteria() {
        // change the xml to json
        //let xml = XMLToJSON(state.xml);
        let xml = state.stateXMLToJSON;
        // update the cdata with new value
        xml.smxml.list.__cdata = xml.smxml.list.__cdata + "\n*Option value";
        /* It is used for update the data of 'xml.smxml.list._oldCData' after adding the new item to make it visible also in MultiGrid mode */
        if (xml.smxml.list._oldCData) {
            if (xml.smxml.list._oldCData.lastIndexOf('###') == (xml.smxml.list._oldCData.length - 3)) {
                xml.smxml.list._oldCData += '*Option value';
            } else {
                xml.smxml.list._oldCData += '###*Option value';
            }
        }
        // update and store the xml
        getChildXml(JSONToXML(xml));
        if (!xml.smxml.list._row && !xml.smxml.list._col) {
            var errMsg = smVal.validate(editorState.content_type, editorState.item, editorState.content_icon);
            smValidate(errMsg);
        }
    }
    //// Function call from multigrid item ////////////
    function moveToAdvance(e) {
        if (localCData.length >= 4) {
            if (localCData.length % 2 == 0) {
                    state.istoggled = !state.istoggled;
                    state.openImageDialog = true;
            } else {
                var temp = Math.sqrt(localCData.length);
                if (Number.isInteger(temp)) {
                   
                    state.istoggled = !state.istoggled;
                    state.openImageDialog = true;
                   
                } else {
                        state.istoggled = !state.istoggled;
                        state.openErrorDialog = true;
                        state.err_message = l.provide_value_suggestion;
                    
                }
            }
        } else {
                state.istoggled = !state.istoggled;
                state.openErrorDialog = true;
                state.err_message = l.min_row_col_value;
        }
    }

    // it update the attribute in lower case
    function updateAttrToLower(data) {
        let xml = data;
        let isLower = false;
        // convert headingCorrect attribute to headingcorrect
        if (xml.smxml.list._headingCorrect) {
            xml.smxml.list._headingcorrect = xml.smxml.list._headingCorrect;
            delete xml.smxml.list._headingCorrect;
            isLower = true;
        }

        // convert allowSort attribute to allowsort
        if (xml.smxml.list._allowSort) {
            xml.smxml.list._allowsort = xml.smxml.list._allowSort;
            delete xml.smxml.list._allowSort;
            isLower = true;
        }

        // convert isParagraph attribute to isparagraph
        if (xml.smxml.list._isParagraph) {
            xml.smxml.list._isparagraph = xml.smxml.list._isParagraph;
            delete xml.smxml.list._isParagraph;
            isLower = true;
        }

        // convert isSentence attribute to issentence
        if (xml.smxml.list._isSentence) {
            xml.smxml.list._issentence = xml.smxml.list._isSentence;
            delete xml.smxml.list._isSentence;
            isLower = true;
        }
        // update ans store the xml
        if (isLower == true) getChildXml(JSONToXML(xml));
    }

    // calls whenever there is change in option value and update the cdata accordingly
    function editCdata(i, isCorr, e) {
        localCData[i].value = e.target.value;
        try {
            if (oldCData[i]) {
                if (oldCData[i].value.indexOf('##') > 0) {
                    oldCData[i].value = oldCData[i].value.split('##')[0] + '##' + e.target.value;
                } else if (oldCData[i].value.indexOf('##') < 1 && oldCData[i].value.indexOf('!') == 0) {
                    oldCData[i].value = '!' + e.target.value;
                } else {
                    oldCData[i].value = e.target.value;
                }
            }
        } catch(error) {
            console.warn({'error': error});
        }
        
        //this.forceUpdate();
        // if answer is correct then add * 
        localCData[i].value = (isCorr == true ? "*" + localCData[i].value : localCData[i].value);
        // xml to json
        //let xml = XMLToJSON(state.xml);
        let xml = state.stateXMLToJSON;
        setTimeout(function() {
            let newCData = "\n", newoldCData = '###';
            // getting all values in newCData
            localCData.forEach(function(data,i){
                newCData += localCData[i].value + "\n";
            });
            if (oldCData) {
            
                oldCData.forEach(function(data,index_no) {
                    if (newoldCData == '') {
                        newoldCData += oldCData[index_no].value;
                    } else {
                        newoldCData += '###' + oldCData[index_no].value;
                    }
                });
            }
            // updating it in cdata
            xml.smxml.list.__cdata = newCData;
            /* For update the 'xml.smxml.list._oldCData' when textual data are changed in Normal mode */
            xml.smxml.list._oldCData = newoldCData;
            // update and store the xml
            getChildXml(JSONToXML(xml));
        }.bind(this), 200);
    }

    // calls to remove the item
    function removeItem(data, id) {
        let a = "", newoldcdata_container = "";
        // getting all the values in a except the deleted one
        
        localCData.forEach(function(data,i) {
            if (localCData[i].id != id) {
                a += localCData[i].value + "\n";
            }
        });
        /* Checks if oldCData exist then after deletion the element it assigned left value in newoldcdata_container variable */
        if (oldCData) {
           
            oldCData.forEach(function(data,index_no) {
                if (oldCData[index_no].id != id) {
                    if (newoldcdata_container == '') {
                        newoldcdata_container += oldCData[index_no].value;
                    } else {
                        newoldcdata_container += '###' + oldCData[index_no].value;
                    }
                }
            });
        }
        state.open = false;
        
        // xml to json
        //let xml = XMLToJSON(state.xml);
        let xml = state.stateXMLToJSON;
        // update cdata
        xml.smxml.list.__cdata = a;
        /* For Assigning value in 'xml.smxml.list._oldCData' which is not deleted */
        xml.smxml.list._oldCData = newoldcdata_container;
        // update the cdata
        getChildXml(JSONToXML(xml));
    }
    

</script>
<main>
    <div>
        <center>
            <div id="main" class="border">
                <div class="choose_head_content px-3 pt-3 pb-0">
                    <div class="d-flex ms-2 ps-4">
                        <label for="headingCorrect" class="mt-1 pt-1">Title</label>
                        <input 
                            id="headingCorrect" 
                            type="text" 
                            class="sm_input_text mt mb"
                            on:change = {updateSetting} 
                            value = {state.headingCorrect} 
                        />
                    </div>
                    <div class="clearfix mt ps-4">
                        <div class="col-md-3 pd-0 float-left">
                            <Checkbox on:click={updateSetting} id="allowSort" color="" checked = {((state.allowSort == 1)? true : false)}>{l.allow_sort}</Checkbox>
                        </div> 
                        <div class="col-md-3 pd-0 float-left">
                                <Checkbox on:click={updateSetting} id="isSentence" color="primary" checked = {((state.isSentence == 1)? true : false)} >{l.in_sentence}</Checkbox>
                        </div>
                        <div class="col-md-3 pd-0 float-left">
                                <Checkbox on:click={updateSetting} id="isParagraph" color="primary" checked = {((state.isParagraph == 1)? true : false)}>{l.in_paragraph}</Checkbox>
                        </div>
                    </div>
                </div>
                <div class="choose_item_container mb ps-4">
                    
                    {#each localCData as data, i}
                            <div class="clearfix mt choose_options" key={i}>
                                <div class="form-row mt-head">
                                    <div class="col-1">
                                    <input type="checkbox" id="check_correct_ans" name="check_correct_ans" class="secure-icon float-end" on:click={updateCorrect.bind(data.value,i)} checked={((data.value.charAt(0) == "*")?true:false)} style="position:relative;top:11px;right:15px;"/></div>
                                    <div class="col">
                                        <textarea
                                            class = "height32 outline0 mb-1 ms-0 "
                                            on:change={editCdata.bind(data.value,i,isCorrect[i])}
                                            >{((data.value.charAt(0) == "*")?data.value.slice(1):data.value)}</textarea>
                                    </div>
                                    <div>
                                        <span 
                                            class="remove-item icomoon-24px-delete-1 height30 top1 position-relative float-start"
                                            on:click={()=>{state.open = true, state.data_value= data.value, state.data_id = data.id}}
                                            tabindex="0" style="right:39px"
                                        >
                                        </span>
                                    </div>
                                </div>
                            </div>
                        
                    {/each}
                    <div class="alert alert-info message_content">
                        <p class="mb-md">
                            Add a new item by clicking the <b>Add Item</b> button at the bottom-left corner.
                        </p>
                    </div>
                    <button 
                        type="button" 
                        id="add-item"
                        class="btn btn-sm btn-outline-primary btn-sm float-left d-flex align-items-center mt-3 addbutton"
                        on:click={addNewItem} 
                    >
                        <!-- <AddIcon/>  --><span class="addbuttonplus">&#43;</span> &nbsp; Add option
                    </button>
                </div>
                <input id="check" type="hidden" class="" value="" /> 
                <input type="hidden" name="special_module_xml" id="special_module_xml" defaultValue={state.xml} />
            </div>
        </center>	
    </div>

    <Dialog bind:visible={state.open} on:close={() => {state.open = false}} >
        <h4>Confirmation</h4>
        <div class="row">
            <span class="col-md-12 mt-4">Do you really want to delete?</span>
        </div>

        <div slot="footer" class="svelteFooter">
            <input type="button" variant="contained" on:click={() => {state.open = false}} class="btn btn-light colorgray" value="No" />
            <Button variant="contained" on:click={removeItem.bind(this,state.data_value,state.data_id)}
                class="bg-primary text-white"> Yes </Button>
        </div>
    </Dialog>

</main>



<style>

    :global(.colorgray) {
        width:56px;
        background-color: lightgrey;
    }
    .addbutton {
        position: relative;
        left: 32px;
        height: 31px;
    }
    .addbuttonplus {
        font-size: 24px;
    }

    .height30  {
        height: 30px !important;
    }

    .top1 {
        top: 1px;
    }
    :global(.top6) {
	    top: 6px;
    }

    .font20 {
        font-size: 18px;
    } 

    .width90  {
        width: 90px;
    }
    
</style>