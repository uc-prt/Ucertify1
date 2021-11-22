<script>
    import { onMount } from 'svelte';
    import { Textfield } from 'svelte-mui/src';
import Button from 'svelte-mui/src/Button.svelte';
    import { AH } from '../helper/HelperAI.svelte';
    export let playerState;
    export let oldValue;
    export let setInputState;
    export let setVideoAsset;
    export let handleTranscriptDialog
    export let insertImage;
    export let createSteptable;
    export let correctLabelStyle;
    export let l;
    export let mapping;
    export let transcript_hide;
    export let guid;
    export let category;
    export let option;
    
    
    let labType = {
        'playground': l.coding,
        'simulation': l.simulation,
        'terminal': l.terminal,
        'lablink': l.lablink,
        'insight': l.insight,
    }
    let prevValueOption = {};

    let securityCheckbox = false;

    function getJsonAttrValue(data, input_id) {
            if (data != '') {
                let tempValue = '';
                data = JSON.parse(data);
                for (var key in data) {
                    if (playerState[key] != undefined && key != 'intervals') {
                        tempValue = data[key];
                        if (key == 'nofeedback') {
                            tempValue = (data[key] == 0) ? true : false;
                        }
                        playerState[key] = (tempValue == 1 || tempValue == 0) ? Boolean(tempValue) : tempValue;
                    }
                    if (AH.selectAll(input_id + ' #' + key).length > 0) {
                        AH.select(input_id + ' #' + key).value = data[key];
                    }
                }   
            }
        }
    
    onMount(async ()=> {
        let changeTimer = setTimeout(function() {
            if (tinyMCE.activeEditor.selection.getContent()) {
                AH.selectAll("#showPlayerList input[id='show_caption'], #showPlayerList input[id='title']", 'value', tinyMCE.activeEditor.selection.getContent());
                correctLabelStyle();
            }
            clearTimeout(changeTimer);
        }, 500);
        
        const val = await playerState; // to wait till playerState is loaded
        let input_id, tag_name, player_category = '', player_type = '', new_key = '', json_value = '';
        if (AH.isValid(oldValue.obj)) {
            tag_name = oldValue.obj.outerHTML.match(/\w+/gim)[0];
        }
        //Manage player type for both new and old player tag
        player_type = (AI.isValid(mapping[oldValue.type])) ? mapping[oldValue.type] : oldValue.type;
        if (player_type == 'toggleoutput' || tag_name == 'span') {
            player_type = 'exhibit';
        }
        //Manage player category for both new and old player tag
        if (oldValue.category && oldValue.category != '') {
            player_category = oldValue.category;
        } else if (AI.isValid(category[player_type])) {
            player_category = category[player_type];
        }
        //Get type for snt and seq tag
        if (player_type == '' || player_type == undefined) {
            player_category = player_type = tag_name;
        }
        if(player_type){
            playerState.type = player_type
        }
        if(player_category){
            playerState.category = player_category
        }
        playerState.editBtnVisibility = (oldValue.asset) ? true : false;
        playerState.oldPlayground = (oldValue.playground && player_type == 'playground' && !AI.isValid(oldValue.asset)) ? true : false;
        playerState.oldSimulation = (oldValue.config && player_type == 'simulation'  && !AI.isValid(oldValue.asset)) ? true : false;
        playerState.open = true;
        playerState.showData = true;
        if (transcript_hide.indexOf(oldValue.sub_type) == -1) {
            AH.setAttr('.edit_transcript', {'disabled': true, 'guid':''});
        }
    
        for (let key in oldValue) {
            if (key != 'type' && key != 'obj' && key != 'bookmark' && key != 'category' && oldValue[key] != '') {
                if (key == 'security' || key == 'token') {
                    playerState.security = true;
                }
                if (key == 'is_multiple' && oldValue[key] == 1) {
                    playerState.multiple = true;
                }
                if (!playerState.intervals && (key == 'stepcaptions' || key == 'intervals')) {
                    playerState.intervals = true;
                }
                if ((key == 'sub_type' || key == 'imgsrc') && player_type == 'weblink') {
                    playerState.embed = (oldValue[key] == 'embed' && !AI.isValid(oldValue.imgsrc)) ? 'inline' : 'new_tab';
                } else if (key == 'sub_type') {
                    playerState.sub_type = oldValue[key];
                }
                if (playerState.sub_type != 'scorm' && AI.isValid(oldValue.asset_m)) {
                    playerState.sub_type = 'scorm';
                }
                if (key == 'is_sql') {
                    playerState.embed = 'overlay';
                }
                if (key == 'border_check') {
                    playerState.bordered = true;
                }
                if (oldValue.img && player_type == 'weblink' && playerState.embed != 'new_tab') {
                    playerState.embed = 'new_tab';
                }
                if (guid.indexOf(key) > -1) {
                    new_key = 'asset';
                } else if (tag_name == 'span' && key == 'playground') {
                    new_key = "show_caption";
                } else if (mapping[key] != undefined) {
                    new_key = mapping[key];
                } else {
                    new_key = key;
                }
                //Manage Old exhibit, toggleout, span tag and convert into new exhibit
                if (player_type == 'exhibit' && oldValue.category == undefined) {
                    if (AI.isValid(oldValue.asset) || (AI.isValid(oldValue.guid) && oldValue['guid'].trim().length == 5)) {
                        playerState.sub_type = 'item';
                        playerState.embed = 'overlay'; 
                        playerState.layout = (tag_name == 'span' || oldValue.layout == 'link') ? 'link' : 'button';
                        
                    } else if (AI.isValid(oldValue.img) || (AI.isValid(oldValue.layout) && oldValue.layout == 'link')) {
                        playerState.sub_type = 'image'; 
                        playerState.embed = 'overlay';
                        playerState.layout = (oldValue.layout) ? 'link' : 'button';
                        
                    } else if (AI.isValid(oldValue.image_url) || AI.isValid(oldValue.toggle_link)) {
                        playerState.sub_type = (tag_name == 'span') ? 'text' : 'image';
                        playerState.embed = 'inline';
                        playerState.layout = 'button';
                        
                        if (tag_name == 'span') {
                            AH.selectAll('.span_text_data', 'removeClass', 'span_text_data');
                            AH.selectAll(oldValue.obj, 'addClass', 'span_text_data');
                            AH.select('.link_tag #text').value = AH.select('.span_text_data').nextElementSibling.textContent;
                            if (key == 'guid') {
                                new_key = 'false';
                            }
                        }
                    }
                    if (key == 'title') {
                        new_key = 'show_caption';
                    }
                }
                if (player_type == 'snt') {
                    playerState.snt = oldValue[key];
                } else if (player_type == 'seq') {
                    playerState.seq = oldValue[key];
                }
    
                if (document.querySelectorAll(input_id + ' #' + new_key).length > 0) {
                    AH.select(input_id + ' #' + new_key).value = oldValue[key].trim();
                }
    
                if (player_type == "video") {
                    if (new_key == 'group_guids' && oldValue[key].trim().length == 5) {
                        AH.setAttr('.edit_transcript', {'guid': oldValue[key]});
                        AH.select('.edit_transcript').disabled = false;
                    } else if (new_key == "asset") {
                        var asset_value = oldValue[key].trim();
                        AH.setAttr(input_id + ' #' + new_key, {'data-value': asset_value})
                        AH.select(input_id + ' #' + new_key).value = (oldValue.sub_type == 'youtube') ? ('https://www.youtube.com/watch?v=' + asset_value) : asset_value;
                    }
                }
    
                if (player_type == 'download' && key == 'img') {
                    AH.select(input_id + ' #icon').value = oldValue[key];
                }
                //Convert player version 1 attributes into player version 2
                if (oldValue.category == undefined && option.indexOf(key) > -1) {
                    json_value += (json_value != '') ? `,"${key}":"${oldValue[key].trim()}"` : `{"${key}":"${oldValue[key].trim()}"`;
                }
                if (key == 'token' || key == 'wid') {
                    json_value = json_value.replace('}', '').replace('wid', 'wID') + '}';
                    AH.select(input_id + ' #security').value = json_value;
                } else if (key == 'option' || key == 'styles' || json_value != '') {
                    if (json_value != '') {
                        json_value = json_value.replace('}', '') + '}';
                    } else {
                        json_value = oldValue[key];
                    }
                    getJsonAttrValue(json_value, input_id);
                    json_value = '';
                }
            }
        }
        if (oldValue.stepcaptions) {
            createSteptable('create');
        }
        if (oldValue.playground && !AI.isValid(oldValue.asset)) {
            let playground_val = (oldValue.playground).replace(/#nl#/g, "\n").replace(/\#t\#/g, "\t").replace(/\#s\#/g, "  ").replace(/\#lt\#/g, "<").replace(/\#gt\#/g, ">");
            if (playground_val.indexOf('<playcode style="display: none;">') > -1) {
                playground_val = playground_val.split('<playcode style="display: none;">')[1].replace('</playcode></player>', '');
            }
            AH.select('#xml_data').value = playground_val.trim();
        }
        securityCheckbox = playerState.prevValue?.security_checkbox == "on";
        prevValueOption = JSON.parse(playerState?.prevValue?.option || "{}");
        correctLabelStyle();    
    });
$:console.log(playerState);
$:console.log(prevValueOption);
</script>
    <div>
        {#if playerState.category == "knowledge_check"}
            <div class="knowledge_check_tag" key="tag_quiz">
                <p class="mt-2 mb-sm">{l.knowledge_check}</p>
                <div>
                    <Textfield
                        placeholder={l.enter_title}
                        fullWidth="true"
                        id="title"
                        value={playerState?.prevValue?.title || ""}
                        label={l.title}
                    />
                </div>
                <div class="mt-sm">
                    <Textfield
                        fullWidth="true"
                        placeholder={l.multi_item_id}
                        id="asset"
                        value={playerState?.prevValue?.asset || ""}
                        label={l.item_id}
                        error={(playerState.msg != '') ? playerState.msg : false}
                        helperText={playerState.msg}
                        is_multiple="1"
                    />
                </div>
                <div class="mt-4">
                    <input
                        type="checkbox"
                        bind:checked={playerState.nofeedback}
                        value={playerState.nofeedback}
                        color="default"
                        class="custom_checkbox_new"
                        id="graded_checkbox"
                    />
                    <label for="graded_checkbox" class="position-relative top_minus4">
                        {l.graded}
                    </label>
                </div>
                <input type="hidden" id="nofeedback" name="nofeedback" value={playerState.nofeedback ? 0 : 1} />
            </div>
        {:else if playerState.category == 'lab'}
            <div class="lab_tag" key="tag_lab">
                <p class="mt-2">{labType[playerState.type]}</p>
                <div class="row alignRight position-relative">
                    <div class="col-xs-12">
                        <label for="type" class="text-dark d-inline" >{l.type}</label>
                        <!-- svelte-ignore a11y-no-onchange -->
                        <select 
                            id="type" 
                            name="type" 
                            class="text-left btn border mr p-2 ml-md mr-2 w-60 clearfix pointer" 
                            bind:value={playerState.type} 
                            on:change={(e)=>{setInputState('type', e.target.value)}}
                        >
                            <option value="playground">{l.playground}</option>
                            <option value="simulation">{l.simulation_txt}</option>
                            <option value="terminal">{l.terminal_txt}</option>
                            <option value="lablink">{l.livelab}</option>
                            <option value="insight">{l.lab3d}</option>
                        </select>
                        {#if playerState.type == "terminal"}
                            <!-- svelte-ignore a11y-no-onchange -->
                            <select 
                                id="sub_type" 
                                name="sub_type" 
                                class="text-left btn border p-2 width80 clearfix pointer" 
                                bind:value={playerState.sub_type} 
                                on:change={(e)=>{setInputState('sub_type', e.target.value)}}
                            >
                                <option value="java">{l.java_txt}</option>
                                <option value="linus">{l.linux_txt}</option>
                                <option value="dos">{l.dos_txt}</option>
                            </select>
                        {/if}
                        {#if playerState.type == "insight"}
                            <!-- svelte-ignore a11y-no-onchange -->
                            <select 
                                id="sub_type" 
                                name="sub_type" 
                                class="text-left btn border p-2 clearfix pointer" 
                                bind:value={playerState.sub_type} 
                                on:change={(e)=>{setInputState('sub_type', e.target.value)}}
                            >
                                <option value="insight">{l.lab3d}</option>
                                <option value="scorm">{l.scorm_txt}</option>
                            </select>
                        {/if}
                    </div>
                </div>
                <div class="row alignRight position-relative"> 
                    <div class="col-xs-12">
                        <Textfield
                            id={(playerState.type == 'simulation' && playerState.oldSimulation) ? "default" :"title"}
                            fullWidth="1"
                            value={playerState?.prevValue?.title || ""}
                            label={(playerState.type == 'simulation' && playerState.oldSimulation) ? l.default : l.title}
                            placeholder={(playerState.type == 'simulation' && playerState.oldSimulation) ? l.default_val : l.enter_title}
                        />
                    </div>
                </div>
                {#if playerState.type == 'playground' && playerState.oldPlayground}
                    <div class="row">
                        <div class="col-xs-12 mt-sm">
                            <Textfield
                                id="xml_data"
                                placeholder={l.enter_xml}
                                multiline="true"
                                rows="4"
                                variant="outlined"
                                fullWidth="true"
                                label={l.xml}
                            />
                        </div>
                    </div>
                {/if}
                <div class="row alignRight position-relative">
                    <div class="col-xs-{(playerState.type == 'simulation') ? '9 mt-sm w-75' : '12'}" >
                        {#if (playerState.type == 'insight' && playerState.sub_type == 'scorm')}
                            <Textfield
                                id="asset"
                                value={playerState?.prevValue?.asset || ""}
                                fullWidth="true"
                                placeholder={l.scorm_url}
                                label={l.url_txt}
                            />
                        {:else}
                            <Textfield
                                id={(playerState.type == 'simulation' && playerState.oldSimulation) ? "config" : "asset"}
                                fullWidth="true"
                                value={playerState?.prevValue?.asset || ""}
                                label={(playerState.type == 'simulation' && playerState.oldSimulation) ? l.simulator_name : l.item_id}
                                placeholder={(playerState.type == 'simulation' && playerState.oldSimulation) ? l.simulator_place : l.enter_item}
                                error={(playerState.msg != '') ? playerState.msg : false}
                                messagePersist={true}
                                helperText={playerState.msg}
                                is_multiple="0"
    
                            />
                        {/if}
                    </div>
                    {#if playerState.type == 'simulation'}
                        <div class="col-xs-3 pt-sm pr w-25 position-relative simButton">
                            <!-- svelte-ignore a11y-no-onchange -->
                            <select 
                                id="embed" 
                                name="embed" 
                                class="text-left btn border p-2 w-100 clearfix mt-3 pointer" 
                                bind:value={playerState.embed} 
                                on:change={(e)=>{setInputState('embed', e.target.value)}}
                            >
                                <option value="inline">{l.embed}</option>
                                <option value="new_tab">{l.new_tab}</option>
                                <option value="overlay">{l.overlay}</option>
                            </select>
                        </div>
                    <div class ="row position-relative alignRight">
                        <div class="col-xs-12 mt-sm pr-0">
                            {#if (playerState.embed == 'overlay' || playerState.embed == 'new_tab')}
                                <Textfield
                                    placeholder={l.enter_btn_name}
                                    fullWidth="true"
                                    id="button_name"
                                    value="{prevValueOption?.button_name || ""}"
                                    label={l.btn_name}
                                />
                            {/if}
                            {#if (playerState.embed == 'inline' && playerState.oldSimulation)}
                                <Textfield
                                    placeholder={l.correct_val}
                                    fullWidth="true"
                                    id="correct"
                                    label={l.correct}
                                />
                            {/if}
                        </div>
                    </div>
                {/if}
                </div>
               
                {#if (playerState.type == 'insight' && playerState.sub_type == 'scorm')}
                    <div class="row position-relative alignRight">
                        <div class="col-xs-6 mt-sm">
                            <Textfield
                                id="asset_m"
                                label={l.mobile_url}
                                value={playerState.prevValue.asset_m}
                                fullWidth="true"
                                placeholder={l.mobile_url_place}
                            />
                        </div>
                    </div>
                    <div class="row position-relative alignRight">
                        <div class="col-xs-12 mt-sm">
                            <Textfield
                                id="group_guids"
                                label={l.transcript_id}
                                value={playerState.prevValue.scorm_caption_id}
                                fullWidth="true"
                                placeholder={l.scorm_place}
                            />
                        </div>
                    </div>
                    <div class="row position-relative alignRight">
                        <div class="container col-xs-9 mt-sm pr" item>
                            <Textfield
                                id="img"
                                fullWidth="true"
                                value={playerState.prevValue.image}
                                placeholder={(playerState.type == 'download') ? l.enter_icon_url : l.enter_img_url}
                                label={l.image_txt}
                            />
                        </div>
                        <div class="col-xs-3 pt-sm">
                            <button 
                                type="button" 
                                class="btn btn-secondary clearfix mt-1 ml-xs w-100" 
                                on:click={()=>{ insertImage('img') }}
                            >{l.insert_img}</button>
                        </div>
                    </div>
                    <div class="row position-relative alignRight">
                        <div class="col-xs-12 mt-sm">
                            <Textfield
                                id="alt"
                                label={l.img_alt}
                                value={playerState.prevValue.alt}
                                placeholder={l.img_desc}
                                fullWidth="true"
                            />
                        </div>
                    </div>
                {/if}
                {#if playerState.type == 'lablink'}
                    <div class="mt-4">
                        <input
                            type="checkbox"
                            bind:checked={playerState.isplayer}
                            on:change={() => playerState.isplayer?"":playerState.prevValue.option = ""}
                            color="default"
                            class="custom_checkbox_new"
                            id="isplayer_checkbox"
                        />
                        <label for="isplayer_checkbox" class="position-relative top_minus4">
                            {l.learn_mode}
                        </label>
                    </div>
                {/if}
                {#if playerState.isplayer}
                    <input type="hidden" id="isplayer" name="isplayer" value="1" />
                {/if}
            </div>
        {:else if playerState.category == 'media'}
            <div class="media_tag" id={(playerState.type == 'video') ? "video_player_container" : 'audio_player_container'} key="tag_media">
                {#if playerState.type == 'audio'}
                    <p class="mt-2">{l.audio_des}</p>
                {:else}
                    <p class="mt-2">{l.video_des}</p>
                {/if}
                <div class="pt-1">
                    <label for="type" class="text-dark d-inline">{l.type}</label>
                    <!-- svelte-ignore a11y-no-onchange -->
                    <select 
                        id="type" 
                        name="type" 
                        class="text-left btn border mr p-2 ml-md mr-2 w-60 clearfix pointer" 
                        bind:value={playerState.type} 
                        on:change={(e)=>{setInputState('type', e.target.value)}}
                    >
                        <option value="audio">{l.audio_txt}</option>
                        <option value="video">{l.video_txt}</option>
                    </select>
                </div>
                <div>
                    <Textfield
                        id="title"
                        fullWidth="true"
                        placeholder={l.enter_title}
                        label={l.title}
                        value={playerState?.prevValue?.title || ""}
                        disabled={(playerState.security && playerState.type == 'video') ? true : false}
                    />
                </div>
                <div class="mt-sm">
                    <Textfield
                        id="asset"
                        fullWidth="true"
                        class={playerState.type == 'video' ? "video_asset" : "audio_asset"} 
                        value={playerState?.prevValue?.asset || ""}
                        placeholder={l.media_url}
                        label={l.url_txt}
                        disabled={(playerState.security && playerState.type == 'video') ? true : false}
                    />
                </div>
                {#if playerState.type == 'video'}
                    <div>
                        <div 
                            class="{(playerState.security || playerState.intervals || playerState.sub_type == 'youtube' || playerState.sub_type == 'lynda') ? 'transcript_container d-none' : 'd-flex transcript_container mt-sm'}"
                        >
                            <div item class="col-xs-7 position-relative textTranscript">
                                <Textfield
                                    id="group_guids"
                                    fullWidth="true"
                                    label={l.transcript_id}
                                    placeholder={l.enter_id}
                                    value="{playerState?.prevValue?.group_guids || ''}"
                                    disabled={(playerState.security || playerState.intervals || playerState.sub_type == 'youtube' || playerState.sub_type == 'lynda') ? true : false}
                                />
                            </div>
                            <div class="col-xs-5">
                                <div class="mt-2 pull-right">
                                    <button 
                                        class="btn btn-outline-dark add_transcript mr-2" 
                                        on:click={()=>{handleTranscriptDialog()}} 
                                        title={l.add_transcript_msg}
                                    >
                                        {l.add_transcript_msg}
                                    </button>
                                    <button disabled="disabled" class="btn btn-outline-dark edit_transcript" title={l.edit_transcript_msg}>{l.edit_msg}</button>
                                </div>
                            </div>
                        </div>
                        <div class="mt-sm" rel={(playerState.security || playerState.intervals) ? "tooltip" : ""} data-original-title={(playerState.security || playerState.intervals) ? l.image_prev_msg : ''} >
                            <Textfield
                                id="preview"
                                label={l.preview_img}
                                value={playerState?.prevValue?.preview || ""}
                                fullWidth="true"
                                placeholder={l.preview_url}
                                disabled={playerState.security || playerState.intervals}
                            />
                        </div>
                        <div class="mt-4">
                            <div class='mt-2'>
                                <input
                                    type="checkbox"
                                    bind:checked={securityCheckbox}
                                    on:change={e => {
                                        if(securityCheckbox){
                                            playerState.prevValue.security_checkbox = 'on';
                                        }else{
                                            playerState.prevValue.security_checkbox = 'off';
                                            playerState.prevValue.security = '';
                                        }
                                    }}
                                    color="default"
                                    class="custom_checkbox_new"
                                    id="security_checkbox"
                                    disabled={playerState.multiple || playerState.intervals}
                                />
                                <label for="security_checkbox" class="position-relative top_minus4 {(playerState.multiple || playerState.intervals) ? 'text-muted' : ''}">
                                    {l.security_info}
                                    {#if playerState.security}
                                        <span class={(playerState.multiple || playerState.intervals) ? "icomoon-info s2 align-middle pl MuiFormControlLabel-label-88 MuiFormControlLabel-disabled-87 " : "icomoon-info s2 align-middle pl position-relative"} rel="tooltip"  title={l.security_title}></span>
                                    {:else}
                                        <span class={(playerState.multiple || playerState.intervals) ? "icomoon-info s2 align-middle pl MuiFormControlLabel-label-88 MuiFormControlLabel-disabled-87 position-relative" : "icomoon-info s2 align-middle pl position-relative"} rel="tooltip"   title={l.security_title}></span>
                                    {/if}
                                </label>
                            </div>
                            {#if securityCheckbox}
                                <div class='position-relative alignLeft'>
                                    <Textfield
                                        id="security"
                                        label={l.security_txt}
                                        fullWidth="true"
                                        value="{playerState?.prevValue?.security || ""}"
                                        placeholder={l.security_place}
                                    />
                                </div>
                            {/if}
                        </div>
                        <div class="mt-2">
                            <input
                                type="checkbox"
                                bind:checked={playerState.multiple}
                                value={playerState.multiple}
                                color="default"
                                class="custom_checkbox_new"
                                id="multiple_checkbox"
                                disabled={playerState.security || playerState.intervals}
                            />
                            <label for="multiple_checkbox" class="position-relative top_minus4 {(playerState.security || playerState.intervals) ? 'text-muted' : ''}">
                                {l.multiple_video}
                            </label>
                            {#if playerState.multiple}
                                <p class="mt-md mb-0">{l.multiple_info}</p>
                            {/if}
                        </div>
                        <div class={playerState.multiple ? "mt-md" : "mt-2"}>
                            <input
                                type="checkbox"
                                bind:checked={playerState.intervals}
                                value={playerState.intervals}
                                color="default"
                                class="custom_checkbox_new"
                                id="intervals_checkbox"
                                disabled={playerState.security || playerState.multiple}
                            />
                            <label for="intervals_checkbox" class="position-relative top_minus4 {(playerState.security || playerState.multiple) ? 'text-muted' : ''}">
                                {l.add_interval}
                            </label>
                        </div>
                        <div>
                            {#if playerState.intervals}
                                <div class="mt-md">
                                    <div class="get_video_duration h"></div>
                                    <table class="table table-hover table-striped stepplayertable table-bordered" tablesorter="">
                                        <thead>
                                            <tr>
                                                <th style="width: 11px">#</th>
                                                <th class="width80">{l.interval_txt} <br/><small>{l.in_sec}</small></th>
                                                <th>{l.caption_txt}</th>
                                                <th style="width: 1px"><span class="icomoon icomoon-new-24px-gear-1 s3" rel="tooltip" data-original-title={l.action_txt}></span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr data-id="1">
                                                <td class="align-middle sr">{l.one_num}</td>
                                                <td><input type="number" id="num_input" name="num_input" min="0" step="1" class="intervaltext form-control form-control-sm width80 pr-sm" placeholder={l.interval_txt} /></td>
                                                <td><input type="text" id="caption_input" name="caption_input" maxlength="200" class="captiontext w-100 form-control form-control-sm" placeholder={l.caption_txt}/></td>
                                                <td class="middle"><a href="#" class="deleteinterval" data-id="1"><span rel="tooltip" data-original-title={l.delete} class="icomoon icomoon-new-24px-delete-1 s3"></span></a></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {#if playerState.msg != ''}
                                        <p class="help-block text-danger mb-0 mt">{playerState.msg}</p>
                                    {/if}
                                    <button class="btn mt-3 btn-secondary float-left mt-lg" on:click={()=>{createSteptable('add')}}>{l.add_interval}</button>
                                    <input type="hidden" id="intervals" name="intervals" value="" />
                                    <input type="hidden" id="stepcaptions" name="stepcaptions" value="" />
                                </div>
                            {/if}
                        </div>
                        {#if (!playerState.security && !playerState.intervals)}
                            <div>
                                <input type="hidden" id="is_multiple" name="is_multiple" value={playerState.multiple ? 1 : 0} />
                                <input type="hidden" id="sub_type" name="sub_type" value={playerState.sub_type} />
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {:else if playerState.category == 'link'}
            <div class="link_tag" key="tag_link">
                {#if playerState.type == 'download'}
                    <p class="mt-2">{l.download_info}</p>
                {/if}
                {#if playerState.type == 'pdf'}
                    <p class="mt-2">{l.pdf_info}</p>
                {/if}
                {#if playerState.type == 'exhibit'}
                    <p class="mt-2">{l.exhibit_info}</p>
                {/if}
                {#if playerState.type == 'weblink'}
                    <p class="mt-2">{l.weblink_info}</p>
                {/if}
                <div container class="row">
                    <div class="pt-2 col-xs-10 alignRight position-relative">
                        <label for="type" class="text-dark d-inline">{l.type}</label>
                        <select 
                            id="type" 
                            name="type" 
                            class="text-left btn border mr p-2 ml-md mr-2 w-60 clearfix pointer" 
                            bind:value={playerState.type} 
                            on:change={(e)=>{setInputState('type', e.target.value)}}
                        >
                            <option value="download">{l.download_txt}</option>
                            <option value="exhibit">{l.exhibit_txt}</option>
                            <option value="pdf">{l.pdf_txt}</option>
                            <option value="weblink">{l.weblink_txt}</option>
                            <option value="embed_content">{l.embed_content}</option>
                        </select>
                        {#if playerState.type == "exhibit"}
                            <select 
                                id="sub_type" 
                                name="sub_type" 
                                class="text-left btn border p-2 width90 clearfix pointer" 
                                bind:value={playerState.sub_type} 
                                on:change={(e)=>{setInputState('sub_type', e.target.value)}}
                            >
                                <option value="item">{l.item}</option>
                                <option value="image">{l.image_txt}</option>
                                <option value="text">{l.text}</option>
                            </select>
                        {/if}
                        {#if playerState.type == "download"}
                            <select id="icon" bind:value={playerState.prevValue.img} name="icon" class="text-left btn border p-2 clearfix pointer">
                                <option value="">{l.select_img}</option>
                                <option value="ciw-integration/download-icon.png">{l.download_txt}</option>
                                <option value="microsoft-office-access-icon-1_0008h7.png">{l.ms_access}</option>
                                <option value="excel-icon_0008h9.png">{l.ms_excel}</option>
                                <option value="word_0009hl.png">{l.ms_word}</option>
                                <option value="pdf_0003m4.png">{l.pdf_txt}</option>
                                <option value="saslogo_0008AE.png">{l.sas_txt}</option>
                                <option value="text_0008ha.png">{l.text}</option>
                                <option value="zip-icon_000a4t.png">{l.zip_txt}</option>
                            </select>
                        {/if}
                    </div>
                </div>
                {#if playerState.type == 'embed_content'}
                    <div>
                        <Textfield
                            id="asset"
                            fullWidth="true"
                            placeholder={l.enter_item}
                            label={l.item_id}
                            value={playerState.snt}
                        />
                        <div class="mt-4">
                            <input 
                                type="checkbox" 
                                class="custom_checkbox_new"
                                id="asset_checkbox"
                                bind:checked={playerState.inline}
                                value={playerState.inline}
                                color="default"
                            />
                            <label for="asset_checkbox" class="position-relative top_minus4">{l.inline}</label>
                            <input type="hidden" id="inline" name="inline" value={playerState.inline ? 1 : ''} />
                        </div>
                    </div>
                {:else}
                {#if playerState.type != 'exhibit'}
                    <div>
                        <Textfield
                            id="title"
                            placeholder={l.enter_title}
                            fullWidth="true"
                            value={playerState?.prevValue?.title || ""}
                            label={l.title}
                            sval="title"
                        />
                    </div>
                {:else}
                    <div class="row alignRight position-relative">
                        <div item class={(playerState.type == 'exhibit') ? 'mt-sm pr col-xs-5 exhibitShow':'mt-sm pr col-xs-5'}>
                            <Textfield 
                                fullWidth="true" 
                                id="show_caption" 
                                label={l.show_caption} 
                                placeholder={l.img_show}
                                value={prevValueOption?.show_caption || ''}
                            />
                        </div>
                        <div class={(playerState.type == 'exhibit') ? 'mt-sm col-xs-5 exhibitShow': 'mt-sm col-xs-5'}>
                            <Textfield 
                                fullWidth="true" 
                                id="hide_caption" 
                                label={l.hide_caption} 
                                placeholder={l.img_hide}
                                value={prevValueOption?.hide_caption || ''}
                            />
                        </div>
                        <div class={(playerState.type == 'exhibit') ? 'pt-sm col-xs-2 exhibiLink exhibitbtnlnk' : 'pt-sm col-xs-2'}>
                            <!-- svelte-ignore a11y-no-onchange -->
                            <select 
                                id="layout" 
                                name="layout" 
                                class="text-left btn border p-2 clearfix mt-sm pointer" 
                                bind:value={playerState.layout} 
                                on:change={(e)=>{setInputState('layout', e.target.value)}}
                            >
                                <option value="button">{l.btn_txt}</option>
                                <option value="link">{l.link_txt}</option>
                            </select>
                        </div>
                    </div>
                {/if}
                <div class={(playerState.type == 'exhibit') ? 'd-flex' : ((playerState.type == 'weblink') ? 'd-flex' : '')}>
                    <div class="mt-sm pr col-xs-{playerState.type == 'weblink' ? '9 w-75' : (playerState.type == 'exhibit' ? '10 width8P' : '12')}">
                        <Textfield
                            id={(playerState.type == 'exhibit' && playerState.exhibitType == 'link') ? "layout" : "asset"}
                            fullWidth="true"
                            placeholder={(playerState.type == 'exhibit') ? l.enter_item : l.enter_url}
                            label={(playerState.type == 'exhibit') ? l.item_id : l.url_txt}
                            value={(playerState.type == 'exhibit' && playerState.exhibitType == 'link') ? playerState.exhibitType : playerState.prevValue.asset}
                            disabled={(playerState.type == 'exhibit' && playerState.sub_type != 'item') ? true : false}
                            error={(playerState.msg != '') ? playerState.msg : false}
                            helperText={playerState.msg}
                            is_multiple={(playerState.type == 'exhibit' && playerState.sub_type == 'item') ? 0 : null}
                        />
                    </div>
                    {#if (playerState.type == 'weblink' || playerState.type == 'exhibit') }
                        <div class="pt-sm col-xs-{(playerState.type == 'weblink') ? '3 textWidth' : (playerState.type == 'exhibit' ? '2 embedovrlyBtn' : '0')}">
                            <!-- svelte-ignore a11y-no-onchange -->
                            <select 
                                id="embed" 
                                name="embed" 
                                class="text-left btn border p-2 w-100 clearfix mt-sm pointer" 
                                value={prevValueOption.embed} 
                                on:change={(e)=>{setInputState('embed', e.target.value)}}
                            >
                                <option value="inline">{l.embed}</option>
                                {#if playerState.type != 'exhibit'}
                                    <option value="new_tab">{l.new_tab} </option>
                                {/if}
                                <option value="overlay">{l.overlay} </option>
                            </select>
                        </div>
                    {/if}
                </div>
                {#if ((playerState.type == 'download' || (playerState.type == 'exhibit' && playerState.sub_type == 'image')) || (playerState.type == 'weblink' && playerState.embed != 'inline'))}
                    <div container spacing={12} class={(playerState.type == 'exhibit' && playerState.sub_type == 'image') ? 'd-flex' : (playerState.type == 'download') ? 'd-flex' : 'd-flex'}>
                        <div item class={(playerState.type == 'exhibit' && playerState.sub_type == 'image') ? 'mt-sm pr col-xs-9 insertImageTxt' : 'mt-sm pr col-xs-9 insertImageTxt w-75'}>
                            <Textfield
                                id="img"
                                value={playerState.prevValue.img || ""}
                                fullWidth="true"
                                placeholder={(playerState.type == 'download') ? l.enter_icon_url : l.enter_img_url}
                                label={l.image_txt}
                            />
                        </div>
                        <div class={(playerState.type == 'exhibit' && playerState.sub_type == 'image') ? 'pt-sm col-xs-3 mt-4 insertBtn' : 'pt-sm col-xs-3 mt-4 insertBtn'}>
                            <button type="button" class="btn btn-secondary clearfix mt-1 ml-xs w-100" on:click={()=>{insertImage('img')}}>{l.insert_img}</button>
                        </div>
                    </div>
                    <div class="mt-sm">
                        <Textfield
                            id="alt"
                            bind:value={playerState.prevValue.alt}
                            label={l.img_alt}
                            placeholder={l.img_desc}
                            fullWidth="true"
                        />
                    </div>
                {/if}
                {#if playerState.type == 'weblink'}
                    <div>
                        <div class="mt-sm">
                            <Textfield
                                id="height"
                                fullWidth="true"
                                placeholder={playerState.embed == 'inline' ? l.img_height : l.frame_height}
                                label={ (playerState.embed == 'inline') ? l.frame_ht : l.imgage_ht}
                            />
                        </div>
                        {#if playerState.embed != 'inline'}
                            <div class="mt-sm">
                                <Textfield
                                    id="width"
                                    fullWidth="true"
                                    placeholder={l.enter_img_width}
                                    label={l.img_width}
                                />
                            </div>
                        {/if}
                    </div>
                {/if}
                {#if (playerState.type == 'exhibit' && playerState.sub_type == 'text')}
                    <div class="mt-sm">
                        <Textfield
                            id="text"
                            placeholder={l.enter_txt}
                            multiline="true"
                            rows="4"
                            variant="outlined"
                            fullWidth="true"
                            label={l.text}
                        />
                    </div>
                {/if}
                {#if (playerState.type == 'exhibit')}
                    <div class={(playerState.type == 'exhibit' && playerState.sub_type == 'image') ? 'd-flex alignRight position-relative' : 'row alignRight position-relative'}>
                        <div class="mt-4">
                            <input 
                                type="checkbox" 
                                class="custom_checkbox_new"
                                id="exhibit_inline_checkbox"
                                bind:checked={playerState.inline}
                                value={playerState.inline}
                                color="default"
                            />
                            <label for="exhibit_inline_checkbox" class="position-relative top_minus4">{l.inline}</label>
                            <input type="hidden" id="inline" name="inline" value={playerState.inline ? 1 : ''} />
                        </div>
                        {#if (playerState.sub_type == 'image' && playerState.embed == 'inline')}
                            <div class="mt-4">
                                <input
                                    type="checkbox"
                                    bind:checked={playerState.bordered}
                                    value={playerState.bordered}
                                    color="default"
                                    class="custom_checkbox_new"
                                    id="bordered_checkbox"
                                />
                                <label for="bordered_checkbox" class="position-relative top_minus4">
                                    {l.border_txt}
                                </label>
                                <input type="hidden" id="bordered" name="bordered" value={playerState.bordered ? 1 : ''} />
                            </div>
                        {/if}
                    </div>
                {/if}
                {/if}
            </div>
        {:else if playerState.category == 'objects'}
            <div class="objects_tag" key="tag_objects">
                <p class="mt-2">{l.player3d_des}</p>
                <div>
                    <Textfield
                        id="title"
                        fullWidth="true"
                        label={l.title}
                        value={playerState?.prevValue?.title || ""}
                        placeholder={l.enter_title}
                    />
                </div>
                <div>
                    <Textfield
                        fullWidth="true"
                        id="asset"
                        value={playerState?.prevValue?.asset || ""}
                        placeholder={l.multi_item_id}
                        label={l.item_id}
                        error={(playerState.msg != '') ? playerState.msg : false}
                        helperText={playerState.msg}
                        is_multiple={1}
                    />
                </div>
            </div>
        {:else if playerState.category == 'snt'}
            <div class="snt_tag" key="tag_snt">
                <p class="mt-2">{l.snt_des}</p>
                <div class="row">
                    <div class="pt-2 col-xs-12 alignRight position-relative">
                        <label for="refid" class="text-dark d-inline">{l.des_txt}</label>
                        <select 
                            bind:value={playerState.snt} 
                            id="refid" 
                            name="refid" 
                            class="text-left border p-2 ml-md clearfix width99 pointer" 
                            on:change={(e)=>{setInputState('snt', e.target.value)}}
                        >
                            <option value='00cRX'>{l.snt_41}</option>
                            <option value='00cRV'>{l.snt_40}</option>                            
                            <option value='00cRn'>{l.snt_39}</option>                            
                            <option value='00cRC'>{l.snt_38}</option>                            
                            <option value='00cRb'>{l.snt_37}</option>                            
                            <option value='00cRB'>{l.snt_36}</option>                                                        
                        </select>
                    </div>
                </div>
            </div>
        {:else if playerState.category == 'seq'}
            <div class="seq_tag" key="tag_seq">
                <p class="mt-2">{l.seq_des}</p>
                <div>
                <Textfield
                    fullWidth="true"
                    placeholder={l.enter_seq_title}
                    id="no"
                    label={l.seq_lable}
                    value={playerState.seq}
                    on:blur={(e)=>{ setInputState('seq', e.target.value)}}
                />
                </div>
            </div>
        {:else}
            <div class="knowledge_check_tag" key="tag_quiz">
                <p class="mt-2 mb-sm">{l.knowledge_check}</p>
                <div>
                    <Textfield
                        placeholder={l.enter_title}
                        fullWidth="true"
                        id="title"
                        value="{playerState?.prevValue?.title || ""}"
                        label={l.title}
                    />
                </div>
                <div class="mt-sm">
                    <Textfield
                        fullWidth="true"
                        placeholder={l.multi_item_id}
                        id="asset"
                        value={playerState?.prevValue?.asset || ""}
                        label={l.item_id}
                        error={(playerState.msg != '') ? playerState.msg : false}
                        helperText={playerState.msg}
                        is_multiple="1"
                    />
                </div>
                <div class="mt-4">
                    <input
                        type="checkbox"
                        bind:checked={playerState.nofeedback}
                        value={playerState.nofeedback}
                        color="default"
                        class="custom_checkbox_new"
                        id="graded_checkbox"
                    />
                    <label for="graded_checkbox" class="position-relative top_minus4">
                        {l.graded}
                    </label>
                </div>
                <input type="hidden" id="nofeedback" name="nofeedback" value={playerState.nofeedback ? 0 : 1} />
            </div>
        {/if}
        </div>
    <style>
    .row {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }
    .alignRight {
        right:10px;
    }
    .alignLeft {
        left: 10px;
    }
    
    .checkGrade:hover {
        background-color: white;
    }
    .simButton {
        right: 18px;
        bottom: 5px; 
    }
    .exhibitShow {
        flex-grow: 0;
        max-width: 41.66667%;
        flex-basis: 41.66667%
    }
    .exhibiLink {
        flex-grow: 0;
        max-width: 16.66667%;
        flex-basis: 16.66667%;
    }
    .width8P {
        width: 80%;
    }
    .exhibitbtnlnk {
        right: 18px;
        position: relative;
        top: 10px;
    }
    .embedovrlyBtn {
        position: relative;
        top: 8px;
        left: 3px;
    }
    .insertImageTxt {
        width: 78%;
        margin-right: 8px;
    }
    .insertBtn{
        position: relative;
        bottom: 18px;
        width: 129px;
    }
    .textTranscript {
        width: 60%;
        margin-right:33px;
    }
    .addIntervalMultInfo {
        position: relative;
    }
    .custom_checkbox_new {
        position: relative;
        width: 20px;
        height: 20px;
        margin-bottom: 0;
        cursor: pointer;
        font-size: 18px;
    }
    
    .fontSize {
        position: relative;
        bottom: 5px;
        font-size: medium
    }
    
    .alginLeft {
        left: 10px;
    }
    
    .borderCheck {
        left: 12px;
        bottom: 9px;
    }
    
    .textWidth {
        width: 140px;
    }
    </style>