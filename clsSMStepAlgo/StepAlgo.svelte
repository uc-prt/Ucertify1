
<!-- 
*  File Name   : StepAlgo.svelte
*  Description : Saving answer tool and question model boxes
*  Author      : Sundaram Tripathi
*  Version     : 1.0
*  Package     : svelte_items
*  Last update :  -->
<script>
    import {writable} from 'svelte/store';
    import { Button, Dialog, Checkbox } from 'svelte-mui/src';
    import l from '../src/libs/editorLib/language.js';
    import { beforeUpdate,onMount } from 'svelte';
    import {AH,XMLToJSON} from "../helper/HelperAI.svelte";

    window.spanCounter = 0;
    let state = {};
    let new_xml = {}
    var all_steps = [];
    export let stopAuthoringUpdate;
    export let xml;
    export let getChildXml;
    let stateData = writable({
        xml                         : '',         
        fillInTheBlanksChoice       : 1,
        opened                      : false,
        deleteIndex                 : "",
        remediationToggle           : false,
        snackback                   : false,
        input_ans                   : '',
        math_input_box              : '',
        spanCounter                 : 0,
        currentId                   : '',
        currentInp                  : ''

    })

    const unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

    onMount(()=>{
        if(xml) {
            new_xml = XMLToJSON(xml);
            showItems(new_xml.smxml.step);
            AH.select("#sticky_checkbox_0").click();
            AH.select('#sticky_checkbox_0').click();
        }
        setTimeout(function() {
            AH.selectAll('.save_button_steps','attr',{disabled:'disabled'});
            initEditor();
        }, 500);


        AH.listen(document,'mouseup','.steps_edit',function(_element,_e){
            //setTimeout(function(){
                console.log('check...');
                let id = parseInt(_e.target.getAttribute('data-seq'));
                if(!Number.isNaN(id)) {
                    let data = _e.target.innerHTML
                    data = data.replace(/&amp;/g,'&'); // replace amp to maintain html entity.
                    all_steps[id].__cdata = data; 
                    //AH.select('#save_step_'+id,'attr',{disabled:'disabled'})
                    updateXML();
                    AH.select('#'+_element.id).click();
                    _e.target.click();
                }
                
            //},0);
        })

        

        AH.listen(document,'click','.editFill',function(curr,e) {
            if(curr.getAttribute("type") == "t") {
                editTextbox(curr.getAttribute("originalKey"));
            } else if(curr.getAttribute("type") == "e") {
                editMathbox(curr.getAttribute("originalKey"));
            }
        })

        AH.listen(document,'touchstart','.editFill',function(curr,e) {
            if(curr.getAttribute("type") == "t") {
                editTextbox(curr.getAttribute("originalKey"));
            } else if(curr.getAttribute("type") == "e") {
                editMathbox(curr.getAttribute("originalKey"));
            }
        })
    })

    function editTextbox(key) {
		key = key.replace(/%{|}%/g, "");
		key = key.split("|");
		let ans = key[0].trim();
        
		let ans_type = ((key[1])?key[1].trim():"");
        state.numeric = ((ans_type == "n")? true : false );
        state.fillInTheBlanksChoice = 1;
        state.open = true;

		if(ans.indexOf("#style#") != -1) {
			let customStyle  = ans.split("#style#")
			AH.select("#responseDialog #customStyleText").value = customStyle[1];
            state.input_ans = customStyle[0];
		} else {
			state.input_ans = ans;
		}	
    }

    function editMathbox(key) {
		key = key.replace(/%{|}%/g, "");
		key = key.split("|");
		let ans = key[0].trim();
		let ans_type = ((key[1])?key[1].trim():"");
        state.customStyle = ((ans.indexOf("#style#") != -1)?true:false);
        state.fillInTheBlanksChoice =2;
        state.open = true;
	
		if(ans.indexOf("#style#") != -1) {
			let customStyle  = ans.split("#style#")
			AH.select("#responseDialog").value = customStyle[1];
            AH.select('#customStyleText').value = customStyle[1];
			AH.select("#input"+i).value = customStyle[0];
		} else {
            state.math_input_box = ans;
		}	
	}
    
    beforeUpdate(()=>{
        if (xml != state.xml) {
            state.xml = xml;
            if (stopAuthoringUpdate === true) return;
            new_xml = XMLToJSON(state.xml);
            
            showItems(new_xml.smxml.step);
        }
    })

    function showItems(steps) {
        steps = replaceVariables(steps);
        all_steps = steps;
        setToggle(all_steps);
        parseXmlAuthoring(steps);
    }

    function setToggle(steps) {
        //let toogle = ''; // 
        steps.map(function(item, index) {
            if(item._viewonly == 1) {
                all_steps[index].toggle = 1;
            } else {
                all_steps[index].toggle = 0;
            }
        })
        return all_steps;
    } 

    function replaceVariables(latex_str) {
        let latex_arr = [];
        let latex_arr_check = latex_str;
        if(latex_arr_check.length == undefined && latex_arr_check != "") {
            latex_arr.push(latex_arr_check);
        } else {
            latex_arr = latex_arr_check;
        }
        latex_arr.map(function(item, index) {
            let cdata = item.__cdata;
            let vars = cdata.match(/<{[\s\S]*?}>/gm);
            if(vars) {
                vars.map(function(element) {
                    let item = element.match(/<\{(.*?)\}>/g);
                    item = item.toString().replace(/<\{|\}>/g, '');
                    item = "var:"+item;
                    item = item.trim();
                    cdata = cdata.replace(element, item);
                });
            }
            latex_arr[index].__cdata = cdata;
        });
        return latex_arr;
    }

    function parseXmlAuthoring(steps) {
        //let go_next_xml = new_xml;
        state.fixed = new_xml.smxml._fixed;
        state.gonext = new_xml.smxml._gonext;
        steps.map(function(item, index) {
            let cdata = item.__cdata;
            let answerKey = cdata.match(/%{[\s\S]*?}%/gm);
            let answerType = '';
            if(answerKey) {
                answerKey.forEach(function(data,i){
                    let originalKey = answerKey[i];
                    let latexKey = "";
                    let editMath = "";
                    answerType = answerKey[i].match(/\|(.*?)}%$/gm);
                    answerType = (answerType) ? answerType[0].replace(/\||}%/gm, '') : 't';
                    let innerKey = "";
                    let icon = "";
                    let type = "";
                    if(answerType == "t") {
                        type = answerType;
                        innerKey = "Textbox";
                        icon = "icomoon-insert-template";
                    } else if(answerType == "n") {
                        type = "t";
                        innerKey = "Numeric";
                        icon = "icomoon-insert-template";
                    } else if(answerType== "e") {
                        type = answerType;
                        innerKey = "Math";
                        latexKey = originalKey.replace(/\%\{|\|e\}\%/g, "");
                        latexKey = "latex=\""+latexKey+"\"";
                        editMath = "editMath";
                        icon = "icomoon-insert-template";
                    }
                    var regex = new RegExp(RegExp.quote(originalKey));
                    cdata = cdata.replace(regex, "<span id=\"latexSpan"+(state.spanCounter = ++state.spanCounter)+"\" "+latexKey+" type='"+type+"' class='alert alert-info editFill "+editMath+"' originalkey='"+originalKey+"' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='"+icon+"'></i>"+innerKey+"</span>");
                });
            }
            all_steps[index].__cdata = cdata;
        });
	}

    function goNext(id) {
        let ref = document.querySelector("#"+id);
        if(ref.checked) {
            state.gonext = true;
            new_xml.smxml._gonext = "1";
        } else {
            state.gonext = false;
            new_xml.smxml._gonext = "0";
        }
        updateXML();
    }

    function fixedAnswer(id) {
        let ref = document.querySelector("#"+id);
        if(ref.checked) {
            //state.variable_button = true;
            state.fixed = true;
            new_xml.smxml._fixed = "1";
        } else {
            //state.variable_button = false;
            state.fixed = false;
            new_xml.smxml._fixed = "0";
        }
        updateXML();
    }

    function handleChangeCheckbox(id, fillid, e) {
        let name = e.target.name;
        let ref = document.querySelector("#"+name+id);
        let val = "_"+e.target.value;
        let seq = id;
        if(ref.checked) {
            new_xml.smxml.step[seq][val] = "1"; 
        } else {
            new_xml.smxml.step[seq][val] = "0";
        }
        let data = document.querySelector('#'+fillid).innerHTML;
        updateXML();
    }


    function handleDisable(i) {
        AH.select('#save_step_'+i,'removeAttr','disabled');
    }
    

    function handleRadio(index, fillid, event) {
        if(all_steps[index].toggle == 1) {
            all_steps[index].toggle = 0
            new_xml.smxml.step[index]._viewonly = "0";
            new_xml.smxml.step[index]._attempt = "1";
        } else {
            all_steps[index].toggle == 1;
            new_xml.smxml.step[index]._viewonly = "1";
            new_xml.smxml.step[index]._attempt = "0";
        }
        let data = document.querySelector('#'+fillid).innerHTML;
        updateXML();
    }

    function deleteEvent(index, data) {
        let delete_event;
        if(data == 'steps') {
            delete_event = all_steps;
            if(delete_event.length > 2) {
                const add = delete_event.splice(index, 1);
            } else {
                AH.alert("You have atleast 2 steps.");
            }
        all_steps = delete_event; 
        updateXML();
        } else if(data == 'algo') {
            state.opened = true;
            state.deleteIndex = index;
        };
        
    }

    function handleSave(id, fillid) {
        let data = document.querySelector('#'+fillid).innerHTML;
        data = data.replace(/&amp;/g,'&'); // replace amp to maintain html entity.
        all_steps[id].__cdata = data; 
        AH.select('#save_step_'+id,'attr',{disabled:'disabled'})
        updateXML();
    }

    function updateXML() {
        let fixans = new_xml.smxml._fixed;
        let gonext = new_xml.smxml._gonext;
        let cdata ;
        let xml = '<smxml type="37" fixed="'+fixans+'" gonext="'+gonext+'">';
        all_steps.map(function(element, i) {
            let seq = i+1;
            let viewonly = element._viewonly;
            let mode = element._mode;
            let attempt = element._attempt;
            let sticky = element._sticky;
            let data = element.__cdata;
            data = reverseHtmlSpecialChars(data);
            data = replaceSpaces(data);
            data  = data.replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
            data  = data.replace(/'/g, '"').replace(/\n/g, '');
            let arr = data.match(/<span(.*?)>(.*?)<\/span>/gi);
            if(arr) {
                for(var i=0; i<arr.length; i++) {
                    let originalkey = arr[i].match(/originalkey="%(.*?)%"/g);
                    if(originalkey) {
                        originalkey = originalkey.toString().replace(/originalkey=/g, '').replace(/"%|%"/g, '%');
                        data = data.replace(arr[i], originalkey);
                    }
                }
            }
            cdata = data;
            xml = xml + "<step seq='"+seq+"'" + ((attempt != undefined)? " attempt ='"+attempt+"'" : ' ') + ((viewonly != undefined)? " viewonly ='"+viewonly+"'" : ' ') + ((mode != undefined)? " mode ='"+mode+"'" : ' ') + ((sticky != undefined)? " sticky ='"+sticky+"'" : ' ') +"><!--[CDATA["+cdata+"]]--></step>";
        });
        xml = xml + "</smxml>";
        getChildXml(xml);
    }

    function reverseHtmlSpecialChars(data) {
        let tags = data.match(/&lt;(.*?)&gt;/gm);
		let tag = '';
		if(tags) {
			for(var i=0; i<tags.length; i++) {
                tag = tags[i];
                tags[i] = tags[i].replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                data = data.replace(tag, tags[i]);
			}
		}
		return data;
    }

    function replaceSpaces(data) {
        let matching = data.match(/var:var\d+\s+\s+/g);
        let match;
        if(matching) {
            matching.map(function(item, index){
                match = item.trim();
                data = data.replace(item,match);
            });
        }
        return data;
    }

    function addEvent(data) {
        let obj = {};
        obj._seq = all_steps.length+1;
        obj._viewonly = "1";
        obj._attempt = "0";
        obj._mode = "0";
        obj.__cdata = "New Step";
        all_steps.push(obj);
        updateXML();
        state.snackback = true;
        var timer = setTimeout(function() {
            initEditor();
            clearTimeout(timer);
        }, 500);
    }

    function initEditor() {
        AH.listen(document,"click",".editMath",function(_this,e){
            state.currentId = _this.getAttribute('id');
        })

        AH.listen(document,'click','.materialOverlay',function(e){
            state.currentId  = null;
            state.currentInp = null;
        })

		tinyMCE.PluginManager.add('res', function(editor, url) {
            editor.addMenuItem('resp', {
                text:"Add response",
                id:'addToken',
                onclick: function () {
                    handleOpen();
                },
                context: 'insert',
                prependToContext: true
            });
        });
		tinymce.PluginManager.load('equationeditor', themeUrl+'svelte_items/tinymce/plugins/equationeditor/plugin.min.js');
		tinymce.init({
            selector: '.tinymce-editor-res',
            inline: true,
            theme: 'modern',
            skin: 'skin02',
            min_width: 100,
            resize: true,
            menubar: false,
            toolbar: true,
            elementpath: false,
            statusbar: false,
            force_br_newlines: true,
            remove_trailing_brs: true,
            forced_root_block: false,
            extended_valid_elements: 'span[onClick|contentEditable]',
            valid_elements: "*[*]",
			fixed_toolbar_container: '#toolbar_container',
            extended_valid_elements: 'uc:syntax,uc:ref',
            custom_elements: 'uc:syntax,~uc:ref',
            plugins: [
                "lists link image charmap print preview anchor",
                "searchreplace code fullscreen",
                "insertdatetime media table contextmenu paste res equationeditor "
            ],
            content_css: themeUrl+'svelte_items/src/libs/mathquill.css',
            toolbar: [
            ' bold italic underline | equationeditor'
            ],
            contextmenu:"resp",
            paste_as_text: true
        });
	}

    function handleClose() {
        if(state.fillInTheBlanksChoice == 2) {
			state.currentInp = null;
		}
        state.open = false; 
    }

    function updateDialog(targetVal) {  
        state.fillInTheBlanksChoice = targetVal;
    }

    function addEditable() {
        let txt = document.querySelector("#input");
        let caretPos = txt.selectionStart;
		let textAreaTxt = txt.value;
        var txtToAdd = "\\MathQuillMathField";
        var txtToAdd  = "user Response";
        txt.value = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
	}

    function latexEdit() {
        state.open = true;
    }

    function storeAns() {
		var validate = 0;
		if(state.fillInTheBlanksChoice == 1) {
			let ans = document.querySelector("#input1").value;
			let numeric = document.querySelector("#responseDialog #numeric").checked;
            if(numeric == true) {
				ans += " |n";
			}
			if(ans.trim() == "") {
				validate = 1;
				validate("All fields are required");
			} else {
				tinyMCE.activeEditor.insertContent("<span type='t' class='alert alert-info editFill' originalKey='%{"+ans.trim()+"}%' style='padding: 5px;outline: none;line-height:40px;cursor:move;color:#000' contentEditable='false'><i style='padding-right:4px' class='icomoon-insert-template'></i>"+((numeric == true)?"Numeric":"Textbox")+"</span>");
			}
        }
        if(state.fillInTheBlanksChoice == 2) {
			let e = document.querySelector("#input").value;
			if(validate == 0) {
				document.querySelector("#"+state.currentId).setAttribute("latex",e);
				document.querySelector("#"+state.currentId).setAttribute("originalKey","%{"+e+"|e}%");
				state.currentId = null;
				state.currentInp = null;
			} else {
				validate("All fields are required");
			}
		}

		if(validate == 0) {
			handleClose();
		}
    }

    function handleOpen() {
        state.open = true;
        state.codetype = false;
        state.numeric = false;
    }
</script> 
<main>
    <div class="mt-imp border">
        <div class="border-bottom d-flex justify-content-between px-2 pt-1">
            <div class="d-inline-block pt-1 float-start cr_step" style={'font-size:20px;position:relative;'}>{l.create_steps}</div>
            <div style={{}}>
                <div class="modes_checkbox d-inline-block top-checkbox_gonext position-relative top2">
                    <Checkbox  
                        id="go_next" 
                        checked = {state.gonext == 1 ? true: false} 
                        on:click={(e)=>{goNext("go_next",e)}} 
                    >{"Go Next"}</Checkbox>  
                </div>
                <div class="modes_checkbox d-inline-block m-l top-checkbox_fix position-relative top2">
                    <Checkbox  
                        id="fixedans_checkbox" 
                        checked = {state.fixed == 1 ? true: false} 
                        on:click={(e)=>{fixedAnswer("fixedans_checkbox",e)}} 
                    >{"Fix Answer"} </Checkbox>
                </div>
            </div>
        </div>
        <div class="outer_steps mt-3 mx-3 clear-both">
            {#each all_steps as item,index}
                <fieldset key={index} style={'border:1px solid grey'} class="new_steps seq_inbox fw shadow-sm mb-2">
                    <legend class="font18 mb ms-2 pl-1" style={'width:1em;float:none;'}>{index+1}</legend>
                    <div class="d-inline-block table_width ms-2 pl-1 pb-2 mb-1" style={'width:97%;'}>
                        <div 
                            data-seq={index} 
                            class="tinymce-editor-res steps_edit p-1 border fillAuthor"
                            id={`fillAuthor_${index}`} 
                            style={'padding:0 8px;overflow:auto;outline:none'} 
                            contentEditable={true}
                            data-text="Enter text here"
                            on:keyup={(e)=>{handleDisable(index,e)}}
                        >
                        {@html item.__cdata}
                        </div>
                    </div>
                    <div class="view_checkbox d-inline-block light-cyan-bg px-2 p-1 full-width fwidth">
                    <div class="test d-inline-block">
                        <span class="pointer d-inline-block plain_text" data-toggle="tooltip" title="Don't use any interactive item!" for={`viewonly_radio_${index}`}>{l.plain_text}</span>
                        <span class="stat-percent ms-4" style={'display:inline-block;position:relative;'}>
                            <span class="form-check form-switch">
                                <input type="checkbox" class="form-check-input" id={"switchElement"+index}
                                    checked={(item.toggle == "1"? false: true)}
                                    on:change={(e)=>{handleRadio(index, 'fillAuthor_'+index,e)}}
                                    color="primary"
                                >
                                <label for={"switchElement"+index}>{l.interactive}</label>
                            </span>
                        </span>
                    </div> 
                    <div class="d-inline-block plain_text ms-3" >
                        <div class="modes_checkbox d-inline-block ms-2">
                            <span class="check_box d-inline-block">
                                {#if item._mode == "1"}
                                    <Checkbox data-seq={index} class="inner_inputs option_checkbox" on:click={(e)=>{handleChangeCheckbox(index, 'fillAuthor_'+index,e)}} type="checkbox" value="mode" name="mode_checkbox_" id={`mode_checkbox_${index}`} checked={true}
                                    />
                                {:else}
                                    <Checkbox data-seq={index} class="inner_inputs option_checkbox" on:click={(e)=>{handleChangeCheckbox(index, 'fillAuthor_'+index,e)}} type="checkbox" value="mode" name="mode_checkbox_" id={`mode_checkbox_${index}`} checked={false}
                                    />
                                {/if}
                            </span>
                            <label class="font-weight-normal me-1 position-relative top2 right35" for={`mode_checkbox_${index}`}>{l.no_validation}</label>
                        </div>
                        {#if index == 0}
                            <div class="stick_checkbox d-inline-block">
                                <span class="check_box d-inline-block">
                                    {#if item._sticky == "1"} 
                                        <Checkbox data-seq={index} checked={true} class="inner_inputs option_checkbox" on:click={handleChangeCheckbox.bind(this, index, 'fillAuthor_'+index)} type="checkbox" value="sticky" name="sticky_checkbox_" id={`sticky_checkbox_${index}`}/>
                                    {:else}
                                        <Checkbox data-seq={index} checked={false} class="inner_inputs option_checkbox" on:click={handleChangeCheckbox.bind(this, index, 'fillAuthor_'+index)} type="checkbox" value="sticky" name="sticky_checkbox_" id={`sticky_checkbox_${index}`}/>
                                    {/if}
                                </span>
                                <label class="font-weight-normal me-1 position-relative top2 right35" for={`sticky_checkbox_${index}`}>{l.sticky}</label>
                            </div>
                        {/if} 
                    </div>
                    <div style={'display:inline-block;float:right;'} class="buttons edit_steps">
                        <div class="d-inline-block mr" style={'display:inline-block;'} on:click={(e)=>{deleteEvent(index, 'steps',e)}}>
                            <button type="button" class="btn btn-light font12">{l.delete}</button>
                        </div> 
                        <div class="d-inline-block" style={'text-align:right;margin-top:6px;'}>
                            <button id={`save_step_${index}`} type="button" on:click={(e)=>{handleSave(index, 'fillAuthor_'+index,e)}} class="btn btn-primary font12 save_button_steps">{l.save}</button>
                        </div>
                    </div>
                    </div>
                </fieldset>
            {/each}
        </div>
        <div class="row mx-3 mt-3 pb-3">
            <Button variant="fab" color="primary" mini aria-label="Add"
                on:click={addEvent.bind(this, 'steps')}
                class="btn btn-outline-primary rounded position-relative bottom0 bg-white shadow-sm height30"
                style={'float:left;width:120px;height:30px;border:1px solid #4285f4;color:#4285f4;text-transform:none;'}>
                <span class="font18">&#43; &nbsp;</span> Add Step
            </Button>
        </div>
        <Dialog class="remove_right_margin" width="560" overlayClass="materialOverlay"  bind:visible={state.open} on:close={handleClose.bind(this)} disableEnforceFocus={true} style="background-color:#fff; border-radius: 5px;">
            <h4 class="mt-0 font21">
                <div class="d-flex justify-content-between">
                    <div>{l.fill_header}</div>
                </div>
                <div class="left10 position-relative">
                    <div class="btn-group mt-2 col-md-12 pl-1">
                        <button type="button" class={"btn btn-light col-md-3" + ((state.fillInTheBlanksChoice == 1)? " active": "")} value={1} on:click={updateDialog.bind(this, 1)} >{l.text}</button>
                        <button type="button" class={"btn btn-light col-md-5" + ((state.fillInTheBlanksChoice == 2)? " active": "")} value={2} on:click={updateDialog.bind(this, 2)} >{l.math_eq}</button>
                    </div>
                </div>
            </h4>
            <!-- </DialogTitle> -->
            <div id="responseDialog" style="height:150px;overflow-y:auto; padding-right: 20px;">
                {#if state.fillInTheBlanksChoice == 1}
                    <div>
                        <div class="d-flex mr-2">
                            <div class="width100">
                                <Checkbox  id = "numeric" checked = {state.numeric}>{"Numeric"}</Checkbox>
                            </div>
                            <input
                                type="text"
                                id = "input1"
                                bind:value = {state.input_ans}
                                class="form-control mr-4 ml-3"
                                style={'margin:5px'}
                                auto:focus = {true}
                                placeholder = {((AH.select("#input1").innerHTML != "")?l.fill_text_placeholder:"")}
                            />
                        </div>
                        <div class="text-danger font-weight-bold ml-2 mt-3">{l.star_note}</div>
                        <div class="text-danger ml-2" style={'text-indent:15px'}>{l.fill_text_help1}</div>
                        <div class="text-danger ml-2" style={'text-indent:15px'}>{l.do_not_include_space}</div>
                    </div>
                {:else}
                    <div>
                        <div class="d-flex">
                            <input
                                type="text"                                
                                id = 'input'
                                class = "latexInp form-control"
                                style = {'margin:5px;width:71%;'}
                                auto:focus = {true}
                                bind:value={state.math_input_box}
                            />                            
                            <Button 
                                variant = "contained" 
                                color = "primary"
                                style = {'border:1px solid #4285f4;color:#4285f4;text-transform:none;'} 
                                on:click = {addEditable}
                                class="btn btn-outline-primary height30 bg-white shadow-sm mt-1 top1 ml-1"
                            >
                            {l.add_response}
                            </Button>                           
                            <div class = "latexEditButton d-inline-block">
                                <Button 
                                    id = {"latexEdit"}
                                    variant = "contained" 
                                    color = "primary"
                                    style = {'margin:5px;display:none;'} 
                                    on:click = {latexEdit}                                   
                                >
                                {l.edit_txt}
                                </Button>
                            </div>
                        </div>
                        <div class="text-danger font-weight-bold ml-2 mt-3">{l.star_note}</div>
                        <div class="text-danger ml-1" style={'text-indent: 15px;'}>{l.fill_math_help1}</div>
                        <div class="text-danger ml-1" style={'text-indent: 15px;'}>{l.fill_math_help2}</div>
                    </div>
                {/if}    
            </div>
            <div class="svelteFooter">
                <Button variant="contained" on:click={handleClose} class="colorStyle" >
                    {l.cancel}
                </Button>
                <Button variant="contained" on:click={storeAns}
                    class="bg-primary text-white">{l.done}
                </Button>
            </div>
        </Dialog>
</main>
<style>
    .font18 {
        font-size: 16px;
    }
    .fwidth   {
        width: 100%;
    }

    .light-cyan-bg {
        background-color: #d4e4ff; 
        color: #333;
    }

    .top2 {
        top: 2px;
    }
    .right5 {
        right: 5px;
    }

    .right35 {
        right: 35px;
    }

    .step_checkbox {
        width: 22%;
        border: 1px solid black;
        margin-left: 10px;
        position: relative;
        bottom: 1px;
        cursor: pointer;
        padding: 3px 2px 0;
    }

    .fixed_ans {
        top: 10px;
        position: relative;
        float: right;
        border: 1px solid #e0e0e0;
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 5px;
        font-size: 15px;
        font-weight: 700;
    }

    .check_box {
        right: 24px;
        position:relative;
        width: 40px;
    }

    .inner_inputs {
        margin: 0 12px!important;
    }      
    
    .pointer {
        cursor: pointer !important;
    }

    .width100 {width: 100px;}

    :global([id^="fillmain"]) {
        overflow:hidden;
        text-align:left;
    }
    :global([id^="fillmain"] pre) {
        background: none;
        border: none;
        font-size: 14px!important;
    }
    :global([id^="fillmain"] .string) {
        min-height:50px;
        margin-top:10px;
        margin-right:10px;
    }
    :global([id^="fillmain"] .footerstr) {
        position:relative;
        margin-top: 10px;
        background-color: #ccc;
        padding: 15px;
        min-height: 60px;
    }
    :global([id^="fillmain"] .footerstr .arrow-up) {
        position: absolute;
        top: -10px;
        right: 50%;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #ccc;
    }
    :global([id^="fillmain"] .fill-row) {
        padding:6px;
    }
    :global([id^="fillmain"] .fillelement, [id^="fillmain"] .drag-resize) {
        height:30px;
        display:inline-block;
        position:relative;
        min-height: 30px;
        margin: 1px;
    }

    :global(#fillmain .drag-resize) {
        height:30px;
        display:inline-block;
        position:relative;
        min-height: 30px;
        margin: 1px;
    }
    :global(#fillmain input[type="text"]) {	
        height:99%!important;
        resize: none;
        font-size:12px;
        color: #000;
        max-width: 800px;
    }
    :global(#fillmain select) {	
        height:99%!important;
        resize: none;
        font-size:12px;
        color: #000;
        max-width: 800px;
    }
    :global([id^="fillmain"] .drag-resize) {
        vertical-align:middle;
        border:1px solid #31B731;
        text-align:center;
        padding:3px;
        font-size: 14px;
    }
    :global([id^="fillmain"] .drag-resize.ui-draggable) {
        cursor:move;
    }
    :global([id^="fillmain"] .drop-hover) {
        border: 1px dashed red!important;
        box-shadow: 0 0 0 2px yellow inset;
        outline: 1px solid blue;
    }
    :global([id^="fillmain"] .fillcheck ul) {
        width:220px;
    }
    :global([id^="fillmain"] .fillcheck li.selected) {
        background-color: #E5E5E5;
    }
    :global(.fillcheck .selected .icomoon-checkmark-3:before) {
        float: left;
        color: blue;
        padding: 3px;
        position: relative;
        right: 14px;
    }
    :global(.fillcheck .icomoon-close-2:before) {
        float: left;
        color: blue;
        position: relative;
        right: 14px;
        font-size: 20px;
    }
    :global(.MathJax_Display) {
            display : inline!important;
    }
    :global([id^="fillmain"] .select) {
        font-size: 15px;
    }
    :global([id^="fillmain"] .textarea) {
        vertical-align:middle;
        border-radius:3px;
        background:#ffe;
        border: 1px solid #ccc;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    }
    :global(.ui-draggable-disabled) {
        cursor: no-drop!important;
        opacity: 0.5!important;
    }

    :global(.colorStyle) {
        background-color: #dee2e6!important;
    }
</style>