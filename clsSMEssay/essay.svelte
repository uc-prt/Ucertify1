<script>
    import { beforeUpdate,onMount } from "svelte";
    import { AH, XMLToJSON } from "../helper/HelperAI.svelte";
    import SUNEDITOR from 'suneditor';
    import plugins from 'suneditor/src/plugins';
    import { Checkbox } from 'svelte-mui/src';
    export let xml;
    export let getChildXml;
    export let l;
    let isUpload = false;
    let author_xml;
    const headingArray = [{"font": "fontSize 6","text": "Heading 1"}, {"font": "fontSize 5","text": "Heading 2"}, {"font": "fontSize 4","text": "Heading 3"},{"font": "fontSize 3","text": "Heading 4"},{"font": "fontSize 2","text": "Heading 5"},{"font": "fontSize 1","text": "Heading 6"}];
    let essayAuthEditor;
    let timer = null;
    let state = {
        files_number : 1,
        cdata : true,
    };
    
    onMount(()=> {
        initEdit();
        let listenrTarget = AH.find('#SM_essay', 'a,button,input,select');
        AH.listenAll(listenrTarget, "blur", (e)=> { 
            console.log(e.target);
            updateXML(500); 
        });
        // AH.listenAll(listenrTarget, "keyup", ()=> { updateXML(500); });
        // AH.listenAll(listenrTarget, "keydown", ()=> { updateXML(500); });

        AH.bind("#files_number", 'keydown', (e)=> {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                AH.select("#err_txt").innerHTML = "Digits Only";
                AH.selectAll("#err_txt", 'show');
                return false;
            }
        });

        // if ((navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/")) > -1) {
        //     jQuery('#uploadChk').keyup(function(e) { if (e.keyCode == 32) this.click() });
        // }

        let parsedXmlNode = AH.parseHtml(xml);
        if (AH.find(parsedXmlNode, 'default') && AH.find(parsedXmlNode, 'default').getAttribute('type') == 1) {
            AH.selectAll('.upload-area', 'removeClass', 'h');
            AH.select('#uploadChk').checked = true;
            console.log(AH.find(parsedXmlNode, 'default').getAttribute('fileTypeExts'));
            AH.select(`#choose_ext option[value="${AH.find(parsedXmlNode, 'default').getAttribute('fileTypeExts')}"]`, 'attr',{selected: 'selected'});
            AH.select('#files_number').value = AH.find(parsedXmlNode, 'default').getAttribute('limit');
        }

        //updateXML();
        parseXml(xml);
    });

    function initEdit() {
        essayAuthEditor = SUNEDITOR.create('essay_editorAuth', { 
            width: 'auto',
            toolbarContainer: "#essayToolbar",
            placeholder: "Write text here.",
            plugins: plugins, 
            resizingBar: false,
            showPathLabel: false,
            buttonList: [
                ['formatBlock'],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['list', 'outdent', 'indent', 'align'],
                ['removeFormat'],
            ] 
        });

        essayAuthEditor.onChange = (content, core)=> {
            updateXML(1000, content);
        }
        essayAuthEditor.onKeyDown = (e, core)=> {
            if (e.keyCode == 86 || e.keyCode == 67) {
                updateXML(1000);
            }
        }
    }
    // // it detects any change in xml.
    // beforeUpdate(()=> {
    //     if (xml != author_xml) {
    //         author_xml = xml;
    //         parseXml(xml);
    //     }
    // });
    

    // if xml change the it updates cdata
    function parseXml(xml) {
        if (state.cdata) {
            state.cdata = false;
            let qxml = XMLToJSON(xml);
            if ( AI.isValid(qxml) && AI.isValid(qxml.smxml.default) ) {
                essayAuthEditor.setContents(qxml.smxml.default.__cdata);
            }
        }
    }

    // it checks the no .of files for upload. 
    function maxLengthCheck(e, maxLength) {
        state.files_number = e.value;
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            AH.select("#err_txt").innerHTML = "Digits Only";
            AH.selectAll("#err_txt", 'show');
            return false;
        }
    }

    // it updates the xml;
    function updateXML(time, content) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            let val = content || essayAuthEditor.getContents();
            let xmlDom = AH.parseHtml(xml);
            let chooseExtOpt = AH.selectAll("#choose_ext option", "selected")[0];
            let defaultDom = xmlDom.querySelector('default');
            if (AH.select("#uploadChk").checked) {
                if (defaultDom) {
                    AH.setAttr(defaultDom, {
                        'type': 1,
                        'fileTypeExts': (chooseExtOpt ? chooseExtOpt.value : ""),
                        'limit': AH.select('#files_number').value
                    });
                } else {
                    let defHtml = AH.parseHtml(`<default type="1" fileTypeExts="${chooseExtOpt ? chooseExtOpt.value : ''}" limit="${AH.select('#files_number').value}"></default>`);
                    xmlDom.appendChild(defHtml);
                }
            } else if (defaultDom) {
                defaultDom.setAttribute('type', 0)
                defaultDom.removeAttribute(...['fileTypeExts', 'limit']);
            }

            if (defaultDom) {
                defaultDom.innerHTML = `<!--[CDATA[${val}]]-->`;
            } else {
                let defHtml = AH.parseHtml(`<default type="0"><!--[CDATA[${val}]]--></default>`);
                xmlDom.appendChild(defHtml);
                //xmlDom.querySelector('default').innerHTML = '';
            }
            //console.log(xmlDom);
            author_xml = formatXml(xmlDom.outerHTML);
            getChildXml(author_xml);
        }, time);
    }
</script>

<main id="SM_essay">
    <div class="hero-unit">
        <div id="essayToolbar" class="sun-editor"></div>
        <textarea id="essay_editorAuth" class="text-left editor sun-editor-editable"></textarea>
        <Checkbox 	
            bind:checked={isUpload}
            on:click={updateXML}
            id="uploadChk"
            name="uploadChk"
            color="primary"
        >
            <span>Upload</span>
        </Checkbox>
        {#if isUpload}
            <div class="upload-area mt-3 text-left">
                <div class="row">
                    <div class="col-sm-3">
                        <label for="choose_ext" class="mb-0 pt-sm1 font14">{l.file_extension_text} </label>
                    </div>
                    <div class="col-sm-8">
                        <select name="choose_ext" id="choose_ext" class="form-control form-control-md" on:blur="{()=> updateXML(500)}">
                            <option value="*.txt,*.doc,*.docx,*.pdf,*.jpg,*.png,*.gif,*.bmp,*.jpeg" selected="selected">All(*.*)</option>
                            <option value="*.txt">*.txt</option>
                            <option value="*.pdf">*.pdf</option>
                            <option value="*.doc,*.docx">*.doc,*.docx</option>
                            <option value="*.doc,*.docx,*.pdf">*.doc,*.docx,*.pdf</option>
                            <option value="*.jpg,*.png,*.gif,*.bmp,*.jpeg">*.jpg,*.png,*.gif,*.bmp,*.jpeg</option>
                        </select>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-sm-3">
                        <label for="files_number" class="mb-0 font14 pt-1">{l.number_of_files} </label>
                    </div>
                    <div class="col-sm-8">
                        <input 
                            type="number" 
                            class="form-control form-control-md float-left filenumber" 
                            name="files_number" 
                            id="files_number" 
                            value={state.files_number} 
                            step="1" 
                            min="1" 
                            max="10" 
                            on:change={maxLengthCheck.bind(this, 2)} 
                            required="required"
                        />
                        <small class="font11">{l.you_can_upload}</small>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>
<style>

    :global(a:hover) {
        text-decoration: none;
    }
    .hero-unit {
        border: 1px solid #ccc;
        width: 84%;
        padding: 18px!important;
        font-size: 15px!important;
        margin-bottom: 30px;
        font-weight: 200;
        line-height: 30px;
        color: inherit;
        background-color: #eeeeee;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
    }
    #essay_editorAuth {
        max-height: 250px;
        height: 250px;
        background-color: white;
        border-collapse: separate;
        border: 1px solid rgb(204, 204, 204);
        padding: 4px;
        box-sizing: content-box;
        -webkit-box-shadow: rgba(0, 0, 0, 0.0745098) 0px 1px 1px 0px inset;
        box-shadow: rgba(0, 0, 0, 0.0745098) 0px 1px 1px 0px inset;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        border-top-left-radius: 3px;
        overflow: scroll;
        outline: none;
    }
    .essay-btn, .essay-btn-add {
        display: inline-block;
        padding: 4px 8px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        color: #333333;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
        background-color: #f5f5f5;
        background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);
        background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));
        background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);
        background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);
        background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);
        background-repeat: repeat-x;
        /* filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0); */
        border-color: #e6e6e6 #e6e6e6 #bfbfbf;
        border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
        /* filter: progid:DXImageTransform.Microsoft.gradient(enabled = false); */
        border: 1px solid #cccccc;
        border-bottom-color: #b3b3b3;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);
        -moz-box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);
    }
    .dropdown-item {
        display: block;
        width: 100%;
        padding: 4px 12px;
        clear: both;
        font-weight: 400;
        color: #212529;
        text-align: inherit;
        white-space: nowrap;
        background-color: transparent;
        border: 0;
    }
    .essay-btn {
        margin-bottom: 15px;
    }
    .essay-container .upload-area #files_number {
        width: 115px;
    }
    .essay-container {
        width: 89%;
    }
</style>