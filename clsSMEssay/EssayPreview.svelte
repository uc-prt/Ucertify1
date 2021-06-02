<script>
    import { beforeUpdate, onMount } from "svelte";
    import {AH, XMLToJSON} from '../helper/HelperAI.svelte';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import sunEditor from 'suneditor';
    import plugins from 'sunEditor/src/plugins';
    import EssayNewReact from './eaasy_new_react.js';

    export let xml;
    export let uaxml;
    export let isReview;
    export let editorState;
    let ucEssay;
    let files;
    let state = {
        userans: '',
        appPath: "",
        essayStr: '',
        userAns: '',
        site_url: ""
    };
    let essay_class = "working_file";
    let eid = "essayPreviewContainer";
    let localEssayData = {};
    let uAns ="";
    let essayEditor;
    const headingArray = [{"font": "fontSize 6","text": "Heading 1"}, {"font": "fontSize 5","text": "Heading 2"}, {"font": "fontSize 4","text": "Heading 3"},{"font": "fontSize 3","text": "Heading 4"},{"font": "fontSize 2","text": "Heading 5"},{"font": "fontSize 1","text": "Heading 6"}];

    $: essay_class = isReview ? "working_file h" : "working_file";

    onMount(()=> {
        editorState && AH.set(editorState.content_type+"_refresh", setEssayContent.bind(this));
        loadXML(xml, uaxml);
        // Intialize editor plugin
        initEdit();
    });

    function initEdit() {
        essayEditor = sunEditor.create('essay_edit', { 
            height: '300px',
            value: uAns,
            width: 'auto',
            toolbarContainer:"#essayPreviewToolbar",
            placeholder: "Write text here.",
            resizingBar: false,
            showPathLabel: false,     
            plugins:plugins,
            fontSize: 10,
            defaultStyle: "padding-left: 10px",
            buttonList: [
                ['formatBlock'],
                ['bold', 'italic', 'underline'],
                ['list', 'outdent', 'indent', 'align'],
                ['removeFormat'],
            ],
        });
        let elemId = '#' + eid;
        ucEssay = new EssayNewReact(elemId, essayEditor);
        //ucEssay.essay_ready();
    }

    function setEssayContent() {
        console.log("set Content")
        essayEditor.setContents(uAns);
    }
        
    // it is called when state updated
    beforeUpdate(()=> {
        if (xml != state.xml) {
            state.xml = xml ;
            console.log("Updating from Preview");
            loadXML(xml, uaxml);
        }
    });
    
    // its for loading the xml.
    function loadXML(essayXML, uaxml) {
        let essayUser = (uaxml) ? XMLToJSON(uaxml) : "";
        essayXML = XMLToJSON(essayXML);
       // userxml_is_empty = updateAttrToLower(userxml_is_empty);
        // if(userxml_is_empty) {
        //     if(!userxml_is_empty.smans) {
        //         uaxml = "";
        //     }
        // }
        // Parsing XMLs
        try {
            let essay = essayXML.smxml.default ? essayXML.smxml.default : essayXML.smxml;
            uAns = essayUser && (essayUser.smans.userans).charCodeAt(0)!=10 ? essayUser.smans.userans : (essay.__cdata !== undefined ? essay.__cdata : '');
            //self.userAnsXML = $('#special_module_user_xml').val();
            localEssayData = {
                userans: uAns,
                filetypeexts: essay._filetypeexts,
                limit: essay._limit,
                type: essay._type == "5" ? "0" : essay._type,
                upload: essayUser ? essayUser.smans.upload : "",
                path: essayUser ? essayUser.smans.path : "",
            };
        } catch(error) {
            console.log({error, func:'loadXml', file:'EssayPreview.svelte'});
        }
    }
    
    // its update attributes of user answer xml to lowercase.
    function updateAttrToLower(data) {
        let isLower = false;
        if(data.SMANS) {
            data.smans = data.SMANS;
            delete data.SMANS;
            isLower = true;
        }
        return data;
    }
    
    // calls on click of abort
    function handleClick(e) {
        ucEssay.remove_file(e.currentTarget, '#' + eid);
    }

    // calls when review mode is on
    function setReview() {
        isReview = true;
        essayEditor.disabled(); // Disable editing for module
        ucEssay.modeOn("on");
    }
    
    // calls when review mode is off after on
    function unsetReview(type) {
        isReview = false;
        essayEditor.enabled(); // Enable editing for module
        if (type != 0) {
            AH.select('#upload', 'show');
            AH.select('#upload', 'removeClass', 'h');
        }
        ucEssay.modeOn('');
    }
</script>
<svelte:head>
    <link href="{window.baseUrlTheme || window.baseThemeURL}pe-items/helper/sunEditor/src/assets/css/suneditor.css" rel="stylesheet" />
</svelte:head>
<main>
    <p id ="demo"></p>
    <div>
        {#if localEssayData }
            <ItemHelper 
                on:setReview = {setReview}
                on:unsetReview = {unsetReview.bind(this, localEssayData.type)}
            />
            <div 
                id={eid} 
                data-filetypeexts={localEssayData.filetypeexts} 
                data-limit={localEssayData.limit} 
                class="essay-container m-auto hero-unit"
            >
                <div id="essayPreviewToolbar" class="sun-editor"></div>
                <textarea id="essay_edit" class="text-left editor sun-editor-editable" ></textarea>
                <div id="upload" class={window.isReview == true || isReview == true || localEssayData.type == "0" ? "h" : ""}>
                    <div id="drop">
                        Drag & Drop Files Here
                        <div class="text-center" style="font-size: 12px;font-weight: normal;position:relative;top:45px; word-wrap:break-word">You can upload upto {localEssayData.limit} {localEssayData.filetypeexts} files.</div>
                        <a href="#upl" class="essay-btn btn btn-light darkgrey_border">Browse</a>
                        <input 
                            type="file" 
                            name="upl" 
                            bind:files 
                            on:change={(event)=> ucEssay.getUploads(files, event)}
                            id="upl" 
                            multiple="multiple" 
                            style="opacity:0.5"
                        />
                    </div>
                </div>
                <ul class={localEssayData.type == "0" ? "essay_upload_status text-left h" : "essay_upload_status text-left working_file" } style="list-style-type: none;">
                    {#if localEssayData.upload != ''}
                        {#each localEssayData.upload.split(',') as uploaded, index}
                            <li class="working">
                                <span class="download">
                                    <a target="_blanks" href={localEssayData.path + uploaded} title='Download File' class="essay_dwl_file">
                                        <i class="icomoon-file-download"></i>
                                    </a>
                                </span>
                                <span class="filename">{uploaded}</span>
                                {#if !isReview}
                                    <span class="abort" on:click={handleClick}>abort</span>
                                {/if}
                            </li>
                        {/each}
                    {/if}
                </ul>
            </div>

        {/if}
    </div>
</main>
<style>
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
    .essay_upload_status {
        margin-top: 10px;
    }
    .abort {
        padding-left: 15px;
        cursor: pointer;
    }
    .essay-btn, #essayfile-button, #editfiles, .essay-btn-add {
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
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0);
        border-color: #e6e6e6 #e6e6e6 #bfbfbf;
        border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
        filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
        border: 1px solid #cccccc;
        border-bottom-color: #b3b3b3;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);
        -moz-box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);
    }
    #upload {
        font-family: 'PT Sans Narrow', sans-serif;
        background-color: #E0E0E0;
        background-image: -webkit-linear-gradient(top, #E0E0E0, #E0E0E0);
        background-image: -moz-linear-gradient(top, #E0E0E0, #E0E0E0);
        background-image: linear-gradient(top, #E0E0E0, #E0E0E0);
        width: 100%;
        /* padding: 30px; */
        padding: 30px 30px 0;
        border-radius: 3px;
        border-collapse: separate;
        border: 1px solid rgb(204, 204, 204);
        margin-top: 2px;
    }
    #drop {
        background-color: #EEEEEE;
        padding: 25px 30px;
        margin-bottom: 30px;
        border: 20px solid rgba(0, 0, 0, 0);
        border-radius: 3px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #7f858a;
        border: 1px solid #CCCCCC;
    }
    /* .can_upload {
        font-size: 12px;
        font-weight: 100;
        position: relative;
        top: 45px;
        overflow-wrap: break-word;
    } */
    #drop a {
        /* background-color: #007a96; */
        padding: 12px 5%;
        color: #2B2E31;
        font-size: 14px;
        border-radius: 2px;
        cursor: pointer;
        display: inline-block;
        margin-top: 12px;
        margin-bottom: 12px;
        line-height: 1;
        text-decoration: none;
        position: relative;
        top: 30px;
    }
    #drop input {
        display: none;
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
    .essay-container {
        width: 89%;
    }
</style>