<script>
    import { onMount, beforeUpdate, afterUpdate } from 'svelte';
	import { Button, Dialog } from 'svelte-mui/src';
    import { writable } from 'svelte/store';
    import { AH } from '../helper/HelperAI.svelte';
    import Loader from '../helper/Loader.svelte';
    import PlayerItem from './PlayerItem.svelte';
    import l from './libs/Lang';
    export let playerBookmark;
    export let editorState;
    export let value;
    export let renderPlayerFunc;
    let itemArray = ['quiz', 'link', 'terminal', 'object3d', 'exhibit', 'insight', 'lablink', 'playground', 'simulation'];
    const option = ['nofeedback', 'embed', 'no_of_attempt', 'correct', 'default', 'preview', 'isplayer', 'display', 'mode_checkbox', 'show_caption', 'hide_caption', 'button_name', 'intervals', 'notitle', 'token', 'wid', 'loid', 'inline'];
    const style = ['class', 'style', 'height', 'width' ,'color', 'align', 'size', 'layout', 'bordered'];
    const guid = ['guid', 'guids', 'labguid', 'help', 'asset'];
    const category = {'quiz' : 'knowledge_check', 'terminal': 'lab', 'simulation' : 'lab', 'insight' : 'lab', 'lablink' : 'lab', 'playground' : 'lab', 'video' : 'media', 'audio' : 'media', 'exhibit' : 'link', 'pdf' : 'link', 'weblink' : 'link', 'download' : 'link', 'object3d' : 'objects'};
    const mapping = {'stepplayer' : 'video', 'wguvideo' : 'video', 'external' : 'simulation', 'label' : 'title', 'imgwidth' : 'width', 'imgheight' : 'height', 'imgsrc' : 'img', 'imgalt' : 'alt', 'image_url' : 'img', 'alt_txt' : 'alt', 'toggle_link' : 'hide_caption', 'lab' : 'insight', 'image' : 'img', 'scorm_caption_id': 'group_guids'};
    const listItem = ['exhibit', 'insight', 'lablink', 'playground', 'simulation', 'external'];
    const transcript_hide = ['youtube', 'lynda'];
    let state = {};
    let prevState = {};
    let hdd = writable({
            open: true,
            add_transcript: false,
            category: 'knowledge_check',
            type: 'quiz',
            nofeedback: true,
            embed: 'inline',
            isplayer: false,
            security: false,
            multiple: false,
            intervals: false,
            btn_style: 'btn',
            exhibitType: 'asset',
            editBtnVisibility: false,
            sqlLab: false,
            layout: 'button',
            from_coverage: false,
            snt: '00cRX',
            seq: '',
            weblinkEmbed: false,
            spanstyle: '',
            islistContent: false,
            content_type: 'q,u',
            content_subtype: '',
            sub_type: '',
            bordered: false,
            delNode: false,
            rowID: '',
            showData: false,
            msg: '',
            oldPlayground: false,
            oldSimulation: false,
            inline: false,
            prevValue: "",
        });
    const unsubscribe = hdd.subscribe((items) => {
        state = items;
    })
    
    onMount(async()=> {
        console.warn("on player mount", editorState.playerArr);
        if (typeof (window.WebVTTParser) == "undefined") {
            AH.addScript("", baseUrlTheme + 'svelte_items/lib/webparser.js');
        }
        prevState = state;
        state.prevValue = editorState.playerArr;
        didMount();
    });

    beforeUpdate(async()=> {
        console.warn("Before update", {pre:state.prevValue, player:editorState.playerArr});
        onUpdate(editorState.playerArr);
    })

    function onUpdate(oldValue) {
        console.warn({l:"onUpdate", oldValue});
        //It will only when dialog will be opened
        if (oldValue && !state.showData) {
            let input_id, tag_name, player_category = '', player_type = '', new_key = '', json_value = '';
            if (AI.isValid(oldValue.obj)) {
                tag_name = oldValue.obj.outerHTML.match(/\w+/gim)[0]
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
            state.msg = '';
            player_type && (state.type = player_type);
            player_category && (state.category = player_category);
            state.editBtnVisibility = (oldValue.asset) ? true : false;
            state.oldPlayground = (oldValue.playground && player_type == 'playground' && !AI.isValid(oldValue.asset)) ? true : false;
            state.oldSimulation = (oldValue.config && player_type == 'simulation'  && !AI.isValid(oldValue.asset)) ? true : false;
            state.open = true;
            state.showData = true;
            
            input_id = '.' + player_category + '_tag';
            let updateTimer = setTimeout(()=> {
                if (transcript_hide.indexOf(editorState.playerArr.sub_type) == -1) {
                    AH.setAttr('.edit_transcript', {'disabled': true, 'guid':''});
                }

                for (let key in editorState.playerArr) {
                    if (key != 'type' && key != 'obj' && key != 'bookmark' && key != 'category' && editorState.playerArr[key] != '') {
                        if (key == 'security' || key == 'token') {
                            state.security = true;
                        }
                        if (key == 'is_multiple' && editorState.playerArr[key] == 1) {
                            state.multiple = true;
                        }
                        if (!state.intervals && (key == 'stepcaptions' || key == 'intervals')) {
                            state.intervals = true;
                        }
                        if ((key == 'sub_type' || key == 'imgsrc') && player_type == 'weblink') {
                            state.embed = (editorState.playerArr[key] == 'embed' && !AI.isValid(editorState.playerArr.imgsrc)) ? 'inline' : 'new_tab';
                        } else if (key == 'sub_type') {
                            state.sub_type = editorState.playerArr[key];
                        }
                        if (state.sub_type != 'scorm' && AI.isValid(editorState.playerArr.asset_m)) {
                            state.sub_type = 'scorm';
                        }
                        if (key == 'is_sql') {
                            state.embed = 'overlay';
                        }
                        if (key == 'border_check') {
                            state.bordered = true;
                        }
                        if (editorState.playerArr.img && player_type == 'weblink' && state.embed != 'new_tab') {
                            state.embed = 'new_tab';
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
                        if (player_type == 'exhibit' && editorState.playerArr.category == undefined) {
                            if (AI.isValid(editorState.playerArr.asset) || (AI.isValid(editorState.playerArr.guid) && editorState.playerArr['guid'].trim().length == 5)) {
                                state.sub_type = 'item';
                                state.embed = 'overlay'; 
                                state.layout = (tag_name == 'span' || editorState.playerArr.layout == 'link') ? 'link' : 'button';
                                
                            } else if (AI.isValid(editorState.playerArr.img) || (AI.isValid(editorState.playerArr.layout) && editorState.playerArr.layout == 'link')) {
                                state.sub_type = 'image'; 
                                state.embed = 'overlay';
                                state.layout = (editorState.playerArr.layout) ? 'link' : 'button';
                                
                            } else if (AI.isValid(editorState.playerArr.image_url) || AI.isValid(editorState.playerArr.toggle_link)) {
                                state.sub_type = (tag_name == 'span') ? 'text' : 'image';
                                state.embed = 'inline';
                                state.layout = 'button';
                                
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
                            state.snt = editorState.playerArr[key];
                        } else if (player_type == 'seq') {
                            state.seq = editorState.playerArr[key];
                        }
                        if (document.querySelectorAll(input_id + ' #' + new_key).length > 0) {
                            AH.select(input_id + ' #' + new_key).value = editorState.playerArr[key].trim();
                        }

                        if (player_type == "video") {
                            if (new_key == 'group_guids' && editorState.playerArr[key].trim().length == 5) {
                                AH.setAttr('.edit_transcript', {'guid': editorState.playerArr[key]});
                                AH.select('.edit_transcript').disabled = false;
                            } else if (new_key == "asset") {
                                var asset_value = editorState.playerArr[key].trim();
                                AH.select(input_id + ' #' + new_key).setAttribute('data-value', asset_value)
                                AH.select(input_id + ' #' + new_key).value = (editorState.playerArr.sub_type == 'youtube') ? ('https://www.youtube.com/watch?v=' + asset_value) : asset_value;
                            }
                        }

                        if (player_type == 'download' && key == 'img') {
                            AH.select(input_id + ' #icon').value = editorState.playerArr[key];
                        }
                        //Convert player version 1 attributes into player version 2
                        if (editorState.playerArr.category == undefined && option.indexOf(key) > -1) {
                            json_value += (json_value != '') ? `,"${key}":"${editorState.playerArr[key].trim()}"` : `{"${key}":"${editorState.playerArr[key].trim()}"`;
                        }
                        if (key == 'token' || key == 'wid') {
                            json_value = json_value.replace('}', '').replace('wid', 'wID') + '}';
                            AH.select(input_id + ' #security').value = json_value;
                        } else if (key == 'option' || key == 'styles' || json_value != '') {
                            if (json_value != '') {
                                json_value = json_value.replace('}', '') + '}';
                            } else {
                                json_value = editorState.playerArr[key];
                            }
                            getJsonAttrValue(json_value, input_id);
                            json_value = '';
                        }
                    }
                }
                if (editorState.playerArr.stepcaptions) {
                    createSteptable('create');
                }
                if (editorState.playerArr.playground && !AI.isValid(editorState.playerArr.asset)) {
                    let playground_val = (editorState.playerArr.playground).replace(/#nl#/g, "\n").replace(/\#t\#/g, "\t").replace(/\#s\#/g, "  ").replace(/\#lt\#/g, "<").replace(/\#gt\#/g, ">");
                    if (playground_val.indexOf('<playcode style="display: none;">') > -1) {
                        playground_val = playground_val.split('<playcode style="display: none;">')[1].replace('</playcode></player>', '');
                    }
                    AH.select('#xml_data').value = playground_val.trim();
                }
                correctLabelStyle();
                clearTimeout(updateTimer);
            }, 100);
        } else if (!state.open) {
            state.open = true;
        }
    }

    afterUpdate(async ()=> {
        AH.enableBsAll("[rel=tooltip]", 'Tooltip'); // Enable tooltip for all selected dom.
        let isFound = itemArray.indexOf(state.type);
        if (isFound > -1) {
            setContentType();
            if (!state.islistContent && listItem.indexOf(state.type) == -1) {
                state.islistContent = true;
            } else if (state.islistContent && listItem.indexOf(state.type) > -1) {
                state.islistContent = false;
            }
        } else if (isFound == -1 && state.islistContent) {
            state.islistContent = false;
        }
        if (AH.select('.link_tag #sub_type').value == 'item' && state.sub_type != 'item') {
            state.sub_type = 'item';
        }
        if (prevState.type != state.type || prevState.sub_type != state.sub_type) {
            state.msg = '';
        }
        if (prevState.type != state.type) {
            state.embed = 'inline';
            AH.select('.' + state.category +'_tag input[disabled]').setAttribute("disabled", false);
        }
        AH.addClass('.' + state.category +'_tag input[disabled]', "cursor_not_allowed");
        prevState = state;
    })

    function didMount() {
        AH.listen(document.body, 'click', '.deleteinterval', function (_this) { 
            if (AH.selectAll('.stepplayertable tbody tr').length > 1) {
                state.delNode = true;
                state.rowID = _this.getAttribute('data-id');
            } else {
                AH.showmsg(l.can_not_del);
            }
        });
        AH.listen(document.body, 'click', '#table_list tr', function (_this) {
            let item_id = AH.select('#showPlayerList #asset').value.trim();
            AH.find(_this, 'td', 'all')[0].classList.toggle('tick');
            AH.selectAll("#table_list tr td.tick").forEach(function(elm) {
                item_id += (item_id != '') ? ',' + elm.parentElement.getAttribute('id') : elm.parentElement.getAttribute('id');
            });
            if (!AH.find(_this, 'td', 'all')[0].classList.contains('tick')) {
                item_id = item_id.replace(',' + _this.getAttribute('id'), '');
            }
            AH.select('#showPlayerList #asset').value = Array.from(new Set(item_id.split(','))).toString();
            correctLabelStyle();
        });
        AH.listen(document.body, 'change', '#showPlayerList input[type="text"], #showPlayerList textarea', function () {
            correctLabelStyle();
        });
        AH.listen(document, "click", ".edit_item_id", function(_elm) {
            editContent(_elm.getAttribute('guid'));
        });
        AH.listen(document.body,'click','.edit_transcript', function() {
            openTranscript(AH.select('.edit_transcript').getAttribute('guid'));
        });
        AH.listen(document.body, 'change', '.link_tag #icon', function () {
            AH.select('.link_tag #img').value = AH.select('.link_tag #icon option','selected')[0].value;
            AH.select('.link_tag #alt').value = AH.select('.link_tag #icon option[value!=""]','selected')[0].textContent;
            correctLabelStyle();
        });
        AH.listen(document.body, 'keyup','.vtt_textarea', function() {
            validateVTT();
        });
    }

    function getJsonAttrValue(data, input_id) {
        if (data != '') {
            let tempValue = '';
            data = JSON.parse(data);
            for (var key in data) {
                if (state[key] != undefined && key != 'intervals') {
                    tempValue = data[key];
                    if (key == 'nofeedback') {
                        tempValue = (data[key] == 0) ? true : false;
                    }
                    state[key] = (tempValue == 1 || tempValue == 0) ? Boolean(tempValue) : tempValue;
                }
                if (AH.selectAll(input_id + ' #' + key).length > 0) {
                    AH.select(input_id + ' #' + key).value = data[key];
                }
            }   
        }
    }

    function  correctLabelStyle(input_id) {
        input_id = input_id || '.' + state.category + '_tag';
        AH.find(input_id, 'input[type="text"], textarea', 'all').forEach(function (_this) {
            if (_this.value.trim().length != 0) {
                AH.find(_this.parentElement.parentElement, 'label', 'all').forEach((_currThis)=> AH.setCss(_currThis,{transform: "translate(0, 1.5px) scale(0.75)", "color": "rgba(0, 0, 0, 0.54)"}) );
            } else {
                AH.find(_this.parentElement.parentElement, 'label', 'all').forEach((_currThis)=>_currThis.removeAttribute('style') );
            }
        });
    }

    function createSteptable(type) {
        if (type == 'add') {
            appendData();
        } else {
            let intervals = AH.select('#intervals').value;
            let interval_array = (intervals != undefined) ? intervals.split(",") : [];
            let stepcaptions = AH.select('#stepcaptions').value;
            let stepcaption_array = (stepcaptions != undefined) ? stepcaptions.split("###") : [];
            for (let i in stepcaption_array) {
                stepcaption_array[i] = stepcaption_array[i].replace(/\\(\W)/g, "$1");
            }
            AH.select('.stepplayertable tbody').innerHTML = '';
            interval_array,forEach((val, i)=> {
                appendData(val, stepcaption_array[i]);
            });
        }
    }

    function appendData(intervalvalue, captiontext) {
        intervalvalue = intervalvalue || '';
        captiontext = captiontext || '';
        let seq_num = parseInt(AH.selectAll('.stepplayertable tbody tr').length) + 1;
        AH.insert('.stepplayertable tbody', `<tr data-id="${seq_num}"><td class="align-middle">${seq_num}</td><td><input type="number" min="0" step="1" class="intervaltext form-control form-control-sm width80 pr-sm" placeholder="Interval" value="${intervalvalue}" /></td><td><input type="text" class="captiontext w-100 form-control form-control-sm" placeholder="Caption" maxlength="200" value="${captiontext}" /></td><td><a href="#" class="deleteinterval" data-id="${seq_num}"><span rel="tooltip" data-original-title="Delete" class="icomoon icomoon-new-24px-delete-1 s3"></span></a></td></tr>`,'beforeend');
    }

    function handleClose() {
        state.open = false;
        state.showData = false;
        editorState.playerState = false;
    }

    function handlePlayer(event) {
        AH.select('#showPlayerList input[type="text"]').value = '';
        AH.selectAll('.listContent, #search').forEach((elm)=> {
            elm.setAttribute('disabled', false);
            elm.classList.remove('cursor_not_allowed'); 
        });
        AH.selectAll('.list_content, #not_found, .table_list_guid', 'hide');
        let tag_category = swapJson(category);
        state.editBtnVisibility = false;
        state.category = event.target.value;
        state.type = (tag_category[event.target.value] != undefined) ? tag_category[event.target.value] : event.target.value;
    }

    function setInputState(key, value) {
        state[key] =  (value !== false) ? value : !state[key];
    }

    function insertImage(id) {
        try {
            AH.editorModal(id);
        } catch(err) {
            AH.getBS("#modal-media-upload", 'Modal').show();
        }
    }

    function  youtube_parser(url) {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length==11) ? match[7] : false;
    }

    function setVideoAsset(id, newValue) {
        if (newValue.startsWith('https://www.youtube')) {
            newValue = youtube_parser(newValue);
            state.sub_type = 'youtube';
        } else if (((newValue.indexOf("//player.vimeo.com") != -1) || (id == 'guid' && newValue.trim() != '')) && AH.select('#group_guids').value.trim() != '') {
            state.sub_type = 'video_plus';
        } else if (newValue.startsWith('//www.lynda.com')) {
            state.sub_type = 'lynda';
        }  else {
            state.sub_type = '';
        }
        if (id != 'guid') {
            AH.select('.media_tag #asset').setAttribute('data-value', newValue);
            AH.setAttr('.edit_transcript', {'disabled': true, 'guid': ''});
            AH.select('#group_guids', 'enabled')[0].value = '';
            AH.trigger(AH.select('#group_guids', 'enabled')[0], 'change');
        } else {
            AH.select('.edit_transcript').setAttribute('guid', newValue);
            AH.select('.edit_transcript').disabled =  !(AH.select('.edit_transcript').getAttribute('guid').length == '5');
        }
    }

    function validateVTT() {
        let parser = new WebVTTParser();
        let result = parser.parse(AH.select('.vtt_textarea').value, "subtitles/captions/descriptions");
        if (result.errors.length > 0) {
            let msg = 'Error : <br>';
            for (let index = 0; index < result.errors.length; index++) {
                let error = result.errors[index];
                let message = (index + 1) + ") Line " + error.line
                if (error.col){ 
                    message += ", column " + error.col
                }
                msg += message + ": " + error.message + '<br>'
            }
            AH.select('.message_block').classList.remove('h');
            AH.select('.message_block').innerHTML = msg;
            AH.select('#save_btn').disabled = true;
        } else {
            AH.select('.message_block').classList.add('h');
            AH.select('.message_block').innerHTML = '';
            AH.select('#save_btn').disabled = false;
        }
    }

    function addTranscript() {
        let is_error = 0;
        AH.selectAll('.vtt_input').forEach(function(_this) {
            if (_this.value == '') {
                is_error = 1;
            }
        });

        if (is_error == 1) {
            AI.showmsg(l.required_field);
        } else {
            AH.ajax({
                url: baseUrl+'utils/vtt_parser.php',
                type: 'POST',
                data: AH.serialize('#vtt_module'),
                onStart: function() {
                    AI.activate(2);
                },
            }).then((response)=> {
                    state.add_transcript = false;
                    AH.select('.media_tag #group_guids').value = response;
                    AH.trigger('.media_tag #group_guids', 'change');
                    AH.select('.edit_transcript').setAttribute('guid', response);
                    AH.select('.edit_transcript').disabled = false;
                    AH.showmsg(l.vtt_added);
                    AI.activate(0);
            })
        }
    }

    function openTranscript(media_guid) {
        var anchor_tag = document.createElement('a');
        anchor_tag.href = baseUrl + 'editor/v2/?action=edit&content_guid=' +  media_guid + '&no_header=1&react_content=1&no_domain=1&video_player=1';
        anchor_tag.target = '_blank';
        anchor_tag.click();
    }

    function updateVideoLink() {
        let url=document.getElementById('media_url').value.trim();
        let video = document.getElementById('myVideo');
        let source = document.createElement('source');
        source.setAttribute('type', 'video/mp4');
        let get_duration = 1;
        AH.select('.video_duration_container').classList.add('h');
        AH.select('#media_title').value.trim() == '' && AH.select('.video_title').classList.remove('h') 
        if (url.indexOf("http://youtube.com") == 0) {
            AH.select('.video_duration_container').classList.remove('h');
            get_duration = 0;
        } else if (url.indexOf("//player.vimeo.com") != -1) {
            source.setAttribute('src', url);
        } else {
            source.setAttribute('src','http://s3.amazonaws.com/jigyaasa_content_stream/' + url);
        }
        //AH.select(video).innerHTML = source;
        video.append(source);
        AH.select('#media_duration').setAttribute('value','');
        updateVideoDuration(get_duration)
    }

    function updateVideoDuration(get_duration) {
        if (!get_duration) {
            return;
        }
        let video = document.getElementById('myVideo');
        AI.activate(2);
        video.addEventListener('loadedmetadata', function() {
            AH.select('#media_duration').value = Math.ceil(video.duration);
            AI.activate(0);
        });
        video.addEventListener('error', function(event) { 
            AH.showmsg(l.valid_link);
            state.add_transcript = false;
            AI.activate(0);
        }, true);
    }

    function editContent(edit_item_id) {
        let src;
        if (!edit_item_id) {
            let guid = AH.select('#showPlayerList #asset').value;
            src  = baseUrl+"editor/v2/?action=edit&content_guid="+guid+"&in_frame=1&from_ebook=1&react_content=1&course_code="+editor.course;       
            if (guid.indexOf(',') !== -1) {
                    AH.selectAll(".table_list_guid, #listProcess, .list_content", 'hide');
                    let guidList = "<table class='table table-striped'><thead><tr><th style='background-color:#E3E3E3;'>Item ID</th><th class='check-mail' style='background-color:#E3E3E3;'>Action</th></tr></thead>";
                    guid = guid.split(',');
                    for (let i in guid) {
                        guidList += "<tr><td>"+guid[i]+"</td><td><button type='button' guid='"+guid[i]+"' class='edit_item_id btn btn-secondary pull-right'>Edit</button></td></tr>";
                    }   
                    guidList += "</table>";
                    AH.selectAll(".table_list_guid", 'show')[0].innerHTML = guidList;
            } else {
                openEditorFrame(src);
            }
        } else {
            src  = baseUrl+"editor/v2/?action=edit&from_myproject=1&content_guid="+edit_item_id+"&in_frame=1&react_content=1&from_coverage=1&course_code="+editor.course;
            openEditorFrame(src, "quiz_new");
        }
    }
    function setContentType() {
        let content_type = '', content_subtype = '';
        switch(state.type) {
            case "quiz": 
                content_type = "q,u";
                break;
            case "exhibit":
                content_type = "f";
                break;
            case "terminal":
                content_type = "q,f";
                content_subtype = "13";
                break;
            case "object3d":
                content_type = "f";
                content_subtype = "52";
                break;
            case "insight": 
                content_type = "f,q";
                content_subtype = "32,34,36";
                break;
            case "lablink" :
                content_type = "q";
                content_subtype = "25";
                break;
            case "playground":
                content_type = "q";
                content_subtype = "24";
                break;
            case "simulation":
                content_type = "q";
                content_subtype = "16";
                break;
            default : 
                content_type = content_subtype = '';
                break;
        }
        if (state.content_type != content_type || state.content_subtype != content_subtype) {
            state.content_type = content_type;
            state.content_subtype = content_subtype;
        }
    }
    function listContent() {
        AH.selectAll(".list_content, #not_found, .table_list_guid", 'hide');
        AH.toggleDom("#list_process" ,'show');
        let listTimer = setTimeout(function() {
            if (state.content_type != '' || state.content_subtype != '') {
                AH.ajax({
                    url: baseUrl+'educator/project/project.php?func=get_content_list&ajax=1',
                    data: {
                        course_code: editor.course,
                        content_type: state.content_type.split(','),
                        content_subtype: (state.content_subtype != '') ? state.content_subtype.split(',') : ''
                    },                         
                }).then((response)=> {
                    AH.toggleDom("#list_process", 'hide');
                    AH.toggleDom(".list_content", 'show');
                    if (response == "") {
                        AH.toggleDom(".list_content", 'hide');
                        AH.toggleDom("#not_found", 'show');
                    } else {
                        AH.toggleDom("#not_found", 'hide');
                        AH.select("#table_list").innerHTML = response;
                    }
                }).catch((e)=> {
                    AH.showmsg(l.unable_to_get);
                    AI.activate(0);           
                });
            } else {
                AH.toggleDom("#list_process", 'hide');
                AH.toggleDom("#not_found", 'show');
            }
            clearTimeout(listTimer);
        }, 500);
    }
    function addNewContent() {
        let src = baseUrl+'editor/?action=new&in_frame=1&from_educator=1&add_coverage=1&from_myproject=1&is_flashcard=1&refer_content=1&course_code='+editor.course+'&p1='+parent1+'&p2='+parent2;
        if (state.type == 'snt' || state.type == 'link') {
            src = src+'&content_type=f&content_subtype=22';
        } else {
            src = src+'&group_type=q,u,f&goback=1';
        }
        if (state.type == 'quiz') {
            openEditorFrame(src, 'quiz_new');
        } else {
            openEditorFrame(src);
        }
        state.editBtnVisibility = true;
    }
    function searchTable(event) {
        let input_val = event.target.value, count = 0;
        AH.selectAll('.table_search tbody tr').forEach((val, key)=> {
            if (val.textContent.toLowerCase().indexOf(input_val.toLowerCase()) == -1) {
                AH.selectAll('.table_search tbody tr')[key].style.display = "none";
            } else {
                AH.selectAll('.table_search tbody tr')[key].style.display = "block";
                count++;
            }
        });
        if (count > 0) {
            AH.toggleDom('#not_found', 'hide');
            AH.toggleDom('#list_content_tbl', 'show');
        } else {
            AH.toggleDom('#not_found', 'show');
            AH.toggleDom('#list_content_tbl', 'hide');
        }
    }
    function openEditorFrame(src, type) {
        type = type || 0;
        let data = '<div style="height:101%"><div class="load_data"><img class="absolute" style="top:0;bottom:0;left:0;right:0;margin:auto;" src="'+themeUrl+'foundation/css/images/loading.gif"/></div><iframe allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" id="editorFrame" class="editor_frame" type="'+type+'" frameborder = "0" src = "'+src+'" height = "0" width = "0" onload=showWeblinkIframeEditor(this)></iframe></div>';
        AH.select("#frame_container").innerHTML = data;
        AH.select('#go_back_window').closest('#bottombar').style.display = "none";
        AH.select("#modal_editor").classList.add("no_margin_top");
        AH.find('#modal_editor', '.modal-dialog').style.width = '100%';
        AH.setCss(AH.find('#modal_editor', '.modal-content'), {'height': window.innerHeight-47, 'margin':'auto','max-width':window.innerWidth});
        AH.getBS('#modal_editor', 'modal', {'backdrop':'static'}).show();
    }
    function changeDeleteValues() {
        AH.select('.stepplayertable tr[data-id='+state.rowID+']').remove();
        state.delNode = false;
    }
    function handleSubmit() {
        let player = '', option_attr = '', style_attr = '', id_value = '', tag_category = (category[state.type] != undefined) ? category[state.type] : '';
        player = '<player category="' + tag_category + '" type="' + state.type + '"';
        if (state.type == 'video') {
            if (state.intervals) {
                let interval_array = [], caption_array = [];
                AH.selectAll('.stepplayertable tbody tr').forEach(function(_this) {
                    let intervaltext = _this.querySelector('.intervaltext').value;
                    let captiontext = _this.querySelector('.captiontext').value;
                    captiontext = captiontext.replace(/([^\ \w])/g,"\\$1");
                    interval_array.push(intervaltext);
                    caption_array.push(captiontext);
                });
                AH.select('.media_tag #intervals').value = interval_array.join(",");
                let captionstr = caption_array.join("###");
                AH.select('.media_tag #stepcaptions').value = captionstr;
            } else if (!state.security) {
                let transcript = AH.select('.media_tag #group_guids').value.trim();
                setVideoAsset((transcript != '') ? 'guid' : 'asset', AH.select('.media_tag #asset').value);
                AH.select('.media_tag #sub_type').value = state.sub_type;
            }
        }
        let selector = state.category + '_tag', exhibit_txt = '', entity = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\'': '&apos;', '"': '&quot;' };
        AH.selectAll('.' + selector + ' input, .' + selector + ' select, .' + selector + ' #text').forEach((_this)=> {
            if (_this.getAttribute('id') != undefined && _this.value.trim() != '' && _this.getAttribute('id') != 'type' && _this.getAttribute('id') != 'icon' && !_this.disabled) {
                if (option.indexOf(_this.getAttribute('id')) > -1) {
                    option_attr += (option_attr != '') ? ',"' + _this.getAttribute('id') + '":"' + _this.value.trim() + '"' : '"' + _this.getAttribute('id') + '":"' + _this.value.trim() + '"';
                } else if (style.indexOf(_this.getAttribute('id')) > -1) {
                    style_attr += (style_attr != '') ? ',"' + _this.getAttribute('id') + '":"' + _this.value.trim() + '"' : '"' + _this.getAttribute('id') + '":"' + _this.value.trim() + '"';
                } else if (guid.indexOf(_this.getAttribute('id')) > -1) {
                    player += ' asset="' + ((_this.closest('.video_asset')) ? _this.getAttribute('data-value').trim() : _this.value.trim())+'"';
                } else {
                    if (_this.getAttribute('id') == 'security') {
                        id_value = _this.value.trim();
                        player += " "+_this.getAttribute('id')+"='" + id_value.replace(/'/g,'"') + "'";
                    } else if (_this.getAttribute('id') == 'text') {
                        exhibit_txt = _this.value.trim();
                        for (var i in entity) {
                            if (exhibit_txt.indexOf(i)) {
                                exhibit_txt = exhibit_txt.replace(new RegExp(i, 'g'), entity[i]);
                            }
                        }
                        player += ` ${_this.getAttribute('id')}="${exhibit_txt}"`;
                    } else {
                        player +=` ${_this.getAttribute('id')}="${_this.value.trim()}"`;
                    }
                    
                }
            }
        });
        player = createPlayerVersionTwo(player, option_attr, style_attr);
        if (state.type == 'playground' && document.querySelector('#xml_data')) {
            let xml_data = AH.select('#xml_data').value;
            xml_data = xml_data.replace(/\n/g, "#nl#").replace(/\r\n/g, "#nl#").replace(/\t/g, "#t#").replace(/\ \ /g, "#s#").replace(/\</g, "#lt#").replace(/\>/g, "#gt#");
            player += '><playcode style="display: none">'+xml_data.trim()+'</playcode></player>';
        } else if (state.category == 'snt' || state.category == 'seq') {
            let tag_attr = (state.category == 'snt') ? 'refid="'+state.snt+'"' : 'no="'+state.seq+'"';
            player = '<'+state.category+' '+tag_attr+'></'+state.category+'>'; 
        } else {
            player = player+'></player>';
        }
        var tinyInsertTimer = setTimeout(function() {
            AH.select('#'+tinyMCE.activeEditor.id+'_show').innerHTML = AH.select('#'+tinyMCE.activeEditor.id).innerHTML;
            clearTimeout(tinyInsertTimer);
        }, 200);
        if (value.obj) {
            value.obj.remove();
        }
        // Insert on submit
        tinyMCE.activeEditor.insertContent("#rmv" + player + "#rmv");
        //Prevent to remove editor content
        setTimeout(function() { 
            var text = tinyMCE.activeEditor.getContent();
            var newText = text.replace(/#rmv/g, "");
            tinyMCE.activeEditor.setContent(newText);
        }, 100);
        let bookmark = (value.bookmark) ? value.bookmark : playerBookmark;
        (bookmark) ? tinyMCE.activeEditor.selection.moveToBookmark(bookmark) : '';
        state.open = false;
        state.showData = false;
        editorState.playerState = false;
        //Set tag in editor
        setTimeout(function() {
            renderPlayerFunc();
        }, 500);
    }
    function createPlayerVersionTwo(player, option_attr, style_attr) {
        if (option_attr != '') {
            player += " option='{"+option_attr+"}'";
        }
        if (style_attr != '') {
            player += " styles='{"+style_attr+"}'";
        }

        return player;
    }
    function validateItemId() {
        let msg = '';
        let input_id = document.querySelector('#showPlayerList #asset'); 
        let asset = (input_id && input_id.getAttribute('is_multiple')) ? input_id.value.trim() : ''; 
        let is_valid = true;
        let updateTimer = setTimeout(function() { 
            if (asset != '') {
                if (!!asset.match(/,(\s+)?$/) && !asset.match(/^[,]*$/)) {
                    asset = asset.replace(/,(\s+)?$/, '');
                    input_id.value = asset;
                }
                if (input_id.getAttribute('is_multiple') == 0) {
                    if (asset.indexOf(',') > -1) {
                        state.msg = l.multi_err;
                        is_valid = false;
                    } else if (!asset.match('^[A-Za-z0-9]+$') || asset.length != 5) {
                        state.msg = l.invalid_id;
                        is_valid = false;
                    } 
                } 
                if (is_valid) {
                    AI.activate(2);
                    AH.ajax({
                        url: baseUrl+'editor/index.php?func=get_item_details',
                        data: {
                            item_id: asset,
                        },                        
                    }).then((response)=> {
                        if (response != 1) {
                            asset = asset.split(',') ;
                            let obj = JSON.parse(response), item_id = '', invalid_id = '', content_type = state.content_type, content_subtype = '';
                            for (let i in obj) {
                                content_subtype = (state.content_subtype != '') ? state.content_subtype : obj[i].content_subtype;
                                if (content_type.indexOf(obj[i].content_type) === -1 || content_subtype.indexOf(obj[i].content_subtype) === -1) {
                                    item_id += (item_id != '') ? ', ' + obj[i].content_guid : obj[i].content_guid;
                                }
                            }
                            if (Object.keys(obj).length != asset.length) {
                                for (let i in asset) {
                                    if (!AI.isValid(obj[asset[i]])) {
                                        invalid_id += (invalid_id != '') ? ', ' + asset[i] : asset[i];
                                    }
                                }
                            }
                            if (item_id != '' || invalid_id != '') {
                                msg = "Item id" + ((item_id.indexOf(',') > -1) ? "s" : "") + " (" + item_id + ") " + ((item_id.indexOf(',') > -1) ? "do" : "does") + " not match with the selected player type" + ((invalid_id != '') ? " and " : ".");
                                if (invalid_id != '') {
                                    msg = (item_id != '') ? msg : '';
                                    msg += "Item id" + ((invalid_id.indexOf(',') > -1) ? "s" : "") + " (" + invalid_id + ") " + ((invalid_id.indexOf(',') > -1) ? "are" : "is") + " invalid.";
                                }
                            } else {
                                handleSubmit();
                            }
                        } else {
                            msg = l.invalid_id;
                        }
                        state.msg = msg;
                        AI.activate(0); 
                    }).catch((e)=> {
                        AH.showmsg(l.unable_to_get);
                        AI.activate(0);           
                    }); 
                }
            } else {
                //Check video intervals should not more than video duration
                if (state.type == 'video' && state.intervals) {
                    validateVideoIterval();
                } else {
                    state.msg = msg;
                    handleSubmit();
                }
            }
            clearTimeout(updateTimer);
        }, 100);   
    }
    function validateVideoIterval() {
        let video_url = AH.select('.media_tag #asset').value;
        AH.empty('.get_video_duration');
        if (video_url != '') {
            if (video_url.indexOf("//s3.amazonaws.com/jigyaasa_content_stream/") == -1 && video_url.indexOf("https://") == -1 && video_url.indexOf("//player.vimeo.com") == -1) {
                video_url = '//s3.amazonaws.com/jigyaasa_content_stream/' + video_url;
            }
            AH.insert('.get_video_duration', '<video id="temp_video_tag" autoplay muted><source src="' + video_url + '" type="video/mp4"></video>', 'afterend');
            AI.activate(2);
            let video_iterval = 0, video = document.getElementById('temp_video_tag'), video_duration = 0;
            video.addEventListener('loadedmetadata', function getVideoDuration(event) {
                AH.selectAll('.stepplayertable .intervaltext').forEach(function(_this) {
                    video_iterval += parseInt(_this.value);
                });
                video_duration = Math.ceil(video.duration);
                AH.empty('.get_video_duration');
                AI.activate(0);
                video.removeEventListener('loadedmetadata', getVideoDuration);
                if (video_iterval > video_duration) {
                    state.msg = l.interval_err + ' (' + video_duration + ' seconds)';
                } else {
                    handleSubmit();
                }
            });
            video.addEventListener('error', function playVideoError() { 
                AI.showmsg(l.video_url_err);
                AI.activate(0);
                video.removeEventListener('error', playVideoError);
            }, true);
        }
    }
    function swapJson(json) {
        let swap = {};
        if (json) {
            for(let key in json){
                swap[json[key]] = key;
            }
        }
        return swap;
    }

    function handleTranscriptDialog() {
        if (!state.add_transcript) {
            if (window.editor.course == null) {
                AH.alert(l.load_course);
            } else if (AH.select('.media_tag #asset').value == '') {
                AH.alert(l.asset_not_empty);
            } else {
                AH.activate(2);
                let url = AH.select('.media_tag #asset').getAttribute('data-value');
                AH.ajax({
                    url: baseUrl+'utils/vtt_parser.php', 
                    data: {
                            func:'check_media', 
                            ajax:1, 
                            video_url:url
                        }
                }).then((response)=> {
                    if (response.msg == 'Media already exist!') {
                        AI.showmsg(l.vtt_exists);
                        AH.select('.edit_transcript').disabled =  (response.vtt != 1);
                        AH.select('.edit_transcript').setAttribute('guid', response.guid);
                        AH.select('.media_tag #group_guids').value = response.guid;
                        AH.trigger('.media_tag #group_guids', 'change');
                    } else {
                        state.add_transcript = true;
                        if (state.add_transcript) {
                            setTimeout(function() {
                                AH.select('#media_title').value = AH.select('.media_tag #title').value;
                                AH.select('#media_url').value = AH.select('.media_tag #asset').getAttribute('data-value');
                                AH.select('#courses').value = window.editor.course;
                                updateVideoLink();
                            }, 100);
                        }
                    }
                    AH.activate(0);
                },'json');
            }
        } else {
            state.add_transcript = false;
        }
    }
</script>

<Dialog width="600" bind:visible={state.open} style="background-color:#fff; border-radius: 5px;">
    <h4 class="mt-1 font21">
        <div class="d-flex justify-content-between">
            <div>Player Info</div>
        </div>
    </h4>
    <div style="overflow-y: auto;">
        <div style="padding-right: 0px; padding-left: 0px; width: 100%" class="col-12 pull-left npl npr mt-md">
            <select 
                id="#playerCat"
                bind:value={state.category} 
                on:blur={handlePlayer} 
                style="margin-left: 0px;" 
                class='v-bottom btn dialogSelectBorder p-2'
            >
                <option value='knowledge_check'>{l.know_check_txt}</option>
                <option value='lab'>{l.lab_txt}</option>
                <option value='link'>{l.link_txt}</option>
                <option value='media'>{l.media_txt}</option>
                <option value='objects'>{l.obj3d_txt}</option>
                <option value='snt'>{l.instruction_txt}</option>
                <option value='seq'>{l.opt_ref}</option>
            </select>
            <div id="showPlayerList">
                <PlayerItem
                    bind:playerState={state}
                    setInputState={setInputState}
                    setVideoAsset={setVideoAsset}
                    handleTranscriptDialog={handleTranscriptDialog}
                    insertImage={insertImage}
                    createSteptable={createSteptable}
                    correctLabelStyle={correctLabelStyle}
                    l={l}
                />
            </div>
        </div>
        <div class={(state.islistContent) ? "col-md-12 mt-lg pt-sm pl-0 pr-0 float-left" : "h"} id="guid_list">
            <div>
                <button type="button" class={state.editBtnVisibility ? "btn btn-secondary mr-2 clearfix pull-left mb-2" : "h"} on:click={()=>{editContent(false)}}>{l.edit_txt}</button>
                {#if ((state.from_coverage == 1 || getQueryString("is_flashcard") == 1) && in_frame)}
                    <span>
                        <button type="button" class="btn btn-secondary clearfix pull-left listContent" on:click={listContent}>{l.list_content}</button>
                        <button type="button" class="btn btn-secondary clearfix pull-left listContent ml-2" on:click={addNewContent}>{l.create_new_txt}</button>
                        <div class="mb-xl col-md-5 col-sm-4 col-5 pull-right p-0 list_content h">
                            <input class="form-control search search_width" id="search" name="search" type="text" placeholder={l.search_item_txt} on:keyup={searchTable} />
                        </div>
                        <div class="list_content h">
                            <table id="list_content_tbl" class="table table_list table_search table-striped table-hover">
                                <thead class="always_show">
                                    <tr>
                                        <th class="span1_imp">{l.item_id}</th>
                                        <th colspan="2">{l.title}</th>
                                    </tr>
                                </thead>
                                <tbody id="table_list"></tbody>
                            </table>
                        </div>
                    </span>
                {/if}
            </div>
            <div class="table_list_guid"></div>
            <div class="alert alert-danger h mt-xl" id="not_found">{l.no_record}</div>
            <center id="list_process" class="mt-xl pt-1 h">
                <Loader size={60} thickness={2} />
                <h4>Please Wait</h4>
            </center>
        </div>
    </div>
    <div slot="footer" class="svelteFooter">
        <Button
            unelevated={true}
            outlined={true}
            color="#ccc"
            on:click={handleClose}
            class="#ccc"
        >
            {l.cancel}
        </Button>
        <Button
            id="xmlDone"
            class="submitBtton"
            unelevated={true}
            on:click={validateItemId}
            color="primary"
        >
            {l.submit}
        </Button>
    </div>
</Dialog>

<Dialog width="600" bind:visible={state.delNode} style="background-color:#fff; border-radius: 5px;">
    <h4 class="mt-1 font21 mb-2">
        <div class="d-flex justify-content-between">
            <div>{l.save_header}</div>
        </div>
    </h4>
    <div>{l.del_confirmation}</div>
    <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
        <Button
            id="xmlDone"
            variant="contained"
            disableRipple="true"
            on:click={setInputState.bind(this, 'delNode', false)}
            color="#ccc"
        >
            {l.no_label}
        </Button>
        <Button
            variant="contained"
            disableRipple="true"
            on:click={changeDeleteValues}
            color="primary"
        >
            {l.yes_label}
        </Button>
    </div>
</Dialog>
<Dialog width="600" bind:visible={state.add_transcript} style="background-color:#fff; border-radius: 5px;">
    <h4 class="mt-1 font21 mb-4">
        <div class="d-flex justify-content-between">
            <div>{l.add_transcript_msg}</div>
        </div>
    </h4>
    <div style="">
        <div class="add_transcript_dialog min_height_352">
            <div class="row">
                <div class="col-12">
                    <form name="vtt_module" id="vtt_module">
                        <input type="hidden" class="form-control vtt_input" name="media_url" id="media_url"/>
                        <div class="form-group text-left video_title h">
                            <label class="control-label font-weight-normal d-inline-flex" for="media_title"><span class="mendatory_label float-left">{l.title}</span></label>
                            <input type="text" class="form-control vtt_input" name="media_title" id="media_title" placeholder={l.title} title={l.title}/>
                        </div>
                        <div class="form-group text-left video_duration_container">
                            <label class="control-label font-weight-normal d-inline-flex" for="media_duration"><span class="mendatory_label float-left">{l.duration}</span></label>
                            <input type="text" class="form-control vtt_input" name="media_duration" id="media_duration" placeholder={l.duration} title={l.duration}/>
                        </div>
                        <input type="hidden" class="form-control vtt_input" name="courses" id="courses"/>
                        <input type="hidden" class="form-control vtt_input" name="func" value="from_video_player" id="func"/>
                        <div class="h">
                            <video id="myVideo" width="320" height="240" controls>
                            </video>
                        </div>
                        <div class="form-group text-left">
                            <label class="control-label font-weight-normal d-inline-flex" for="vtt"><span class="mendatory_label float-left">{l.vtt}</span></label>
                            <div class="mb-2 message_block text-b-red h"></div>
                            <textarea name="vtt" class="form-control max_height_350 min_height_295 vtt_input vtt_textarea" placeholder={l.enter_vtt} title={l.enter_vtt} id="vtt" rows="12" cols="250"></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div slot="footer" class="footer bttmBtn" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
        <Button
            variant="contained"
            disableRipple="true"
            on:click={handleTranscriptDialog}
            color="primary"
            class="BtnOutline"
        >
            {l.cancel}
        </Button>
        <Button
            id="xmlDone"
            variant="contained"
            disableRipple="true"
            on:click={addTranscript}
            color="primary"
            class="BtnDark"
        >
            {l.add_vtt}
        </Button>
    </div>
</Dialog>
<style>
    :global(.submitBtton) {
        background-color: #616970!important;
    }

    :global(.deleteinterval:hover) {
        text-decoration: none;
    }

    :global(.deleteinterval) {
        color: #b0281a;
    }

    :global(.BtnDark) {
        color: #fff!important;
        background-color: #343a40!important;
        border-color: #343a40!important;
        position: relative;
        left: 6px;
    }

    :global(.BtnOutline) {
        color: #343a40!important;
        border: 1px solid #343a40!important;
    }

    :global(.bttmBtn) {
        display: inline-block;
        float: right;
        position: relative;
        right: 24px;
        bottom: 10px;
    }

   

</style>