<script>
    import { onMount } from 'svelte';
    import { Checkbox, Textfield } from 'svelte-mui/src';
    import { AH } from '../helper/HelperAI.svelte';
    export let playerState;
    export let setInputState;
    export let setVideoAsset;
    export let handleTranscriptDialog
    export let insertImage;
    export let createSteptable;
    export let correctLabelStyle;
    export let l;
    let labType = {
        'playground': l.coding,
        'simulation': l.simulation,
        'terminal': l.terminal,
        'lablink': l.lablink,
        'insight': l.insight,

    }
    onMount(()=> {
        let changeTimer = setTimeout(function() {
            if (tinyMCE.activeEditor.selection.getContent()) {
                AH.selectAll("#showPlayerList input[id='show_caption'], #showPlayerList input[id='title']", 'value', tinyMCE.activeEditor.selection.getContent());
                correctLabelStyle();
            }
            clearTimeout(changeTimer);
        }, 500);
    })
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
                    label={l.title}
                />
            </div>
            <div class="mt-sm">
                <Textfield
                    fullWidth="true"
                    placeholder={l.multi_item_id}
                    id="asset"
                    label={l.item_id}
                    error={(playerState.msg != '') ? playerState.msg : false}
                    helperText={playerState.msg}
                    is_multiple="1"
                />
            </div>
            <div class="mt-xl alignRight position-relative checkGrade">
                <Checkbox
                    bind:checked={playerState.nofeedback}
                    value={playerState.nofeedback}
                    color="default"
                >
                    <span>{l.graded}</span>
                </Checkbox>
            </div>
            <input type="hidden" id="nofeedback" name="nofeedback" value={playerState.nofeedback ? 0 : 1} />
        </div>
    {:else if playerState.category == 'lab'}
        <div class="lab_tag" key="tag_lab">
            <p class="mt-2">{labType[playerState.type]}</p>
            <div class="row alignRight position-relative">
                <div class="col-xs-12">
                    <label for="type" class="text-dark d-inline" >{l.type}</label>
                    <select 
                        id="type" 
                        name="type" 
                        class="btn border mr p-2 ml-md mr-2 w-60 clearfix pointer" 
                        value={playerState.type} 
                        on:blur={(e)=>{ setInputState('type', e.target.value)}}
                    >
                        <option value="playground">{l.playground}</option>
                        <option value="simulation">{l.simulation_txt}</option>
                        <option value="terminal">{l.terminal_txt}</option>
                        <option value="lablink">{l.livelab}</option>
                        <option value="insight">{l.lab3d}</option>
                    </select>
                    {#if playerState.type == "terminal"}
                        <select 
                            id="sub_type" 
                            name="sub_type" 
                            class="btn border p-2 width80 clearfix pointer" 
                            value={playerState.sub_type} 
                            on:blur={(e)=>{setInputState('sub_type', e.target.value)}}
                        >
                            <option value="java">{l.java_txt}</option>
                            <option value="linus">{l.linux_txt}</option>
                            <option value="dos">{l.dos_txt}</option>
                        </select>
                    {/if}
                    {#if playerState.type == "insight"}
                        <select 
                            id="sub_type" 
                            name="sub_type" 
                            class="btn border p-2 clearfix pointer" 
                            value={playerState.sub_type} 
                            on:blur={(e)=>{setInputState('sub_type', e.target.value)}}
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
                            fullWidth="true"
                            placeholder={l.scorm_url}
                            label={l.url_txt}
                        />
                    {:else}
                        <Textfield
                            id={(playerState.type == 'simulation' && playerState.oldSimulation) ? "config" : "asset"}
                            fullWidth="true"
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
                        <select 
                            id="embed" 
                            name="embed" 
                            class="btn border p-2 w-100 clearfix mt-3 pointer" 
                            value={playerState.embed} 
                            on:blur={(e)=>{setInputState('embed', e.target.value)}}
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
                            placeholder={l.img_desc}
                            fullWidth="true"
                        />
                    </div>
                </div>
            {/if}
            {#if playerState.type == 'lablink'}
                <div class="mt-xl position-relative alignRight">
                    <Checkbox
                        bind:checked={playerState.isplayer}
                        value={playerState.isplayer}
                        color="default"
                    ><span class="mr-0 mb-0 height27">{l.learn_mode}</span></Checkbox>
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
            <div class="pt-2">
                <label for="type" class="text-dark d-inline">{l.type}</label>
                <select 
                    id="type" 
                    name="type" 
                    class="btn border mr p-2 ml-md mr-2 w-60 clearfix pointer" 
                    value={playerState.type} 
                    on:blur={(e)=>{setInputState('type', e.target.value)}}
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
                    disabled={(playerState.security && playerState.type == 'video') ? true : false}
                />
            </div>
            <div class="mt-sm">
                <Textfield
                    id="asset"
                    fullWidth="true"
                    class={playerState.type == 'video' ? "video_asset" : "audio_asset"} 
                    placeholder={l.media_url}
                    label={l.url_txt}
                    on:change={playerState.type == 'video' ? (e)=>{setVideoAsset('asset', e.target.value)} : null}
                    disabled={(playerState.security && playerState.type == 'video') ? true : false}
                />
            </div>
            {#if playerState.type == 'video'}
                <div>
                    <div 
                        class="row {(playerState.security || playerState.intervals || playerState.sub_type == 'youtube' || playerState.sub_type == 'lynda') ? 'transcript_container d-none' : 'transcript_container mt-sm'}"
                    >
                        <div item class="col-xs-7 position-relative alignRight">
                            <Textfield
                                id="group_guids"
                                fullWidth="true"
                                label={l.transcript_id}
                                placeholder={l.enter_id}
                                on:change={playerState.type == 'video' ? (e)=>{setVideoAsset('guid', e.target.value)} : null}
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
                            fullWidth="true"
                            placeholder={l.preview_url}
                            disabled={playerState.security || playerState.intervals}
                        />
                    </div>
                    <div class="mt-xl position-relative alignRight">
                        <div class={(playerState.security ? '' : 'd-flex ')}>
                            <Checkbox
                                bind:checked={playerState.security}
                                value={playerState.security}
                                color="default"
                                disabled={playerState.multiple || playerState.intervals}
                            >
                                <span class="mr-0 mb-0 height27">{l.security_info}</span>
                            </Checkbox>
                            {#if playerState.security}
                                <span class={(playerState.multiple || playerState.intervals) ? "icomoon-info s2 align-middle pl MuiFormControlLabel-label-88 MuiFormControlLabel-disabled-87" : "icomoon-info s2 align-middle pl position-relative icomoonInfoSec"} rel="tooltip"  title={l.security_title}></span>
                            {:else}
                                <span class={(playerState.multiple || playerState.intervals) ? "icomoon-info s2 align-middle pl MuiFormControlLabel-label-88 MuiFormControlLabel-disabled-87" : "icomoon-info s2 align-middle pl position-relative icomoonInfo"} rel="tooltip"  title={l.security_title}></span>
                            {/if}
                             
                        </div>
                        {#if playerState.security}
                            <div class='position-relative alignLeft'>
                                <Textfield
                                    id="security"
                                    label={l.security_txt}
                                    fullWidth="true"
                                    placeholder={l.security_place}
                                />
                            </div>
                        {/if}
                    </div>
                    <div class="mt-lg position-relative alignRight">
                        <Checkbox
                            bind:checked={playerState.multiple}
                            value={playerState.multiple}
                            color="default"
                            disabled={playerState.security || playerState.intervals}
                        >
                            <span class="mr-0 mb-0 height27">{l.multiple_video}</span>
                        </Checkbox>
                        {#if playerState.multiple}
                            <p class="mt-md mb-0">{l.multiple_info}</p>
                        {/if}
                    </div>
                    <div class={playerState.multiple ? "mt-md" : "mt-lg position-relative alignRight"}>
                        <Checkbox
                            bind:checked={playerState.intervals}
                            value={playerState.intervals}
                            color="default"
                            disabled={playerState.security || playerState.multiple}
                        >
                            <span class="mr-0 mb-0 height27">{l.add_interval}</span>
                        </Checkbox>
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
                                <button class="btn btn-secondary float-left mt-lg" on:click={()=>{createSteptable('add')}}>{l.add_interval}</button>
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
                        class="btn border mr p-2 ml-md mr-2 w-60 clearfix pointer" 
                        value={playerState.type} 
                        on:blur={(e)=>{setInputState('type', e.target.value)}}
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
                            class="btn border p-2 width90 clearfix pointer" 
                            value={playerState.sub_type} 
                            on:blur={(e)=>{setInputState('sub_type', e.target.value)}}
                        >
                            <option value="item">{l.item}</option>
                            <option value="image">{l.image_txt}</option>
                            <option value="text">{l.text}</option>
                        </select>
                    {/if}
                    {#if playerState.type == "download"}
                        <select id="icon" name="icon" class="btn border p-2 clearfix pointer">
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
            {#if playerState.type != 'exhibit'}
                <div>
                    <Textfield
                        id="title"
                        placeholder={l.enter_title}
                        fullWidth="true"
                        label={l.title}
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
                        />
                    </div>
                    <div class={(playerState.type == 'exhibit') ? 'mt-sm col-xs-5 exhibitShow': 'mt-sm col-xs-5'}>
                        <Textfield 
                            fullWidth="true" 
                            id="hide_caption" 
                            label={l.hide_caption} 
                            placeholder={l.img_hide}
                        />
                    </div>
                    <div class={(playerState.type == 'exhibit') ? 'pt-sm col-xs-2 exhibiLink exhibitbtnlnk' : 'pt-sm col-xs-2'}>
                        <select 
                            id="layout" 
                            name="layout" 
                            class="btn border p-2 clearfix mt-sm pointer" 
                            value={playerState.layout} 
                            on:blur={(e)=>{setInputState('layout', e.target.value)}}
                        >
                            <option value="button">{l.btn_txt}</option>
                            <option value="link">{l.link_txt}</option>
                        </select>
                    </div>
                </div>
            {/if}
            <div class={(playerState.type == 'exhibit') ? 'd-flex' : ''}>
                <div class="mt-sm pr col-xs-{playerState.type == 'weblink' ? 9 : (playerState.type == 'exhibit' ? '10 width8P' : '12')}">
                    <Textfield
                        id={(playerState.type == 'exhibit' && playerState.exhibitType == 'link') ? "layout" : "asset"}
                        fullWidth="true"
                        placeholder={(playerState.type == 'exhibit') ? l.enter_item : l.enter_url}
                        label={(playerState.type == 'exhibit') ? l.item_id : l.url_txt}
                        bind:value={playerState.exhibitType}
                        disabled={(playerState.type == 'exhibit' && playerState.sub_type != 'item') ? true : false}
                        error={(playerState.msg != '') ? playerState.msg : false}
                        helperText={playerState.msg}
                        is_multiple={(playerState.type == 'exhibit' && playerState.sub_type == 'item') ? 0 : null}
                    />
                </div>
                {#if (playerState.type == 'weblink' || playerState.type == 'exhibit') }
                    <div class="pt-sm col-xs-{(playerState.type == 'weblink') ? '3' : (playerState.type == 'exhibit' ? '2 embedovrlyBtn' : '0')}">
                        <select 
                            id="embed" 
                            name="embed" 
                            class="btn border p-2 w-100 clearfix mt-sm pointer" 
                            value={playerState.embed} 
                            on:blur={(e)=>{setInputState('embed', e.target.value)}}
                        >
                            <option value="inline">{l.embed}</option>
                            <option value="new_tab">{playerState.type != 'exhibit' ? l.new_tab : l.overlay}</option>
                        </select>
                    </div>
                {/if}
            </div>
            {#if ((playerState.type == 'download' || (playerState.type == 'exhibit' && playerState.sub_type == 'image')) || (playerState.type == 'weblink' && playerState.embed != 'inline'))}
                
                    <div container spacing={12} class={(playerState.type == 'exhibit' && playerState.sub_type == 'image') ? 'd-flex' : (playerState.type == 'download') ? 'd-flex' : ''}>
                        <div item class={(playerState.type == 'exhibit' && playerState.sub_type == 'image') ? 'mt-sm pr col-xs-9 insertImageTxt' : 'mt-sm pr col-xs-9 insertImageTxt'}>
                            <Textfield
                                id="img"
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
                    <div class="mt-xl col-xs-2 p-0">
                        <Checkbox
                            bind:checked={playerState.inline}
                            value={playerState.inline}
                            color="default"
                        >
                            <span class="mr-0 mb-0 height27">{l.inline}</span>
                        </Checkbox>
                        <input type="hidden" id="inline" name="inline" value={playerState.inline ? 1 : ''} />
                    </div>
                    {#if (playerState.sub_type == 'image' && playerState.embed == 'inline')}
                        <div class="mt-xl col-xs-4">
                            <Checkbox
                                bind:checked={playerState.bordered}
                                value={playerState.bordered}
                                color="default"
                            >
                                <span class="mr-0 mb-0 height27">{l.border_txt}</span>
                            </Checkbox>
                            <input type="hidden" id="bordered" name="bordered" value={playerState.bordered ? 1 : ''} />
                        </div>
                    {/if}
                 </div>
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
                    placeholder={l.enter_title}
                />
            </div>
            <div>
                <Textfield
                    fullWidth="true"
                    id="asset"
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
                        value={playerState.snt} 
                        id="refid" 
                        name="refid" 
                        class="btn border p-2 ml-md clearfix width99 pointer" 
                        on:blur={(e)=>{setInputState('snt', e.target.value)}}
                    >
                        <option value='1441'>{l.snt_41}</option>
                        <option value='1440'>{l.snt_40}</option>                            
                        <option value='1439'>{l.snt_39}</option>                            
                        <option value='1438'>{l.snt_38}</option>                            
                        <option value='1437'>{l.snt_37}</option>                            
                        <option value='1436'>{l.snt_36}</option>                                                        
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
                    label={l.title}
                />
            </div>
            <div class="mt-sm">
                <Textfield
                    fullWidth="true"
                    placeholder={l.multi_item_id}
                    id="asset"
                    label={l.item_id}
                    error={(playerState.msg != '') ? playerState.msg : false}
                    helperText={playerState.msg}
                    is_multiple="1"
                />
            </div>
            <div class="mt-xl">
                <Checkbox
                    bind:checked={playerState.nofeedback}
                    value={playerState.nofeedback}
                    color="default"
                >
                    <span>{l.graded}</span>
                </Checkbox>
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
    .icomoonInfo {
        top:13px;
        right:230px;
    }
    .icomoonInfoSec {
        bottom: 31px;
        left:315px;
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
    }
</style>