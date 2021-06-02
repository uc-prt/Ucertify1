<!--
 *  File Name   : Insight.svelte
 *  Description : Responsible for Authoring Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : Insight (Authoring & Preview)
 *  Last update : 09-Feb-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import { writable } from 'svelte/store';
    import { AH , XMLToJSON, JSONToXML} from '../helper/HelperAI.svelte';
    import l from '../../lib/Lang';
    import Loader from '../helper/Loader.svelte';
    import swal from 'sweetalert';
    import Sortable from 'sortablejs';

    export let xml;
    export let getChildXml;
    export let user;
    export let editorState;
    export let itemIcons;
    const category = { 'quiz': 'knowledge_check', 'terminal': 'lab', 'simulation': 'lab', 'insight': 'lab', 'lablink': 'lab', 'playground': 'lab', 'video': 'media', 'audio': 'media', 'exhibit': 'link', 'pdf': 'link', 'weblink': 'link', 'download': 'link', 'object3d': 'objects' };
    let itemArray = ['quiz', 'link', 'terminal', 'object3d', 'exhibit', 'insight', 'lablink', 'playground', 'simulation'],
    sceneTemp = "",
    characterData  = "",
    localcharacterData   = [],
    localcharacterChoice = [],
    insightData = [],
    stepData    = "",
    isSmartChat = "",
    localstepData     = [],
    scoreCategoryData = "",
    localscoreCategoryData = [],
    assetData       = "",
    localassetData  = [],
    tabData         = "",
    localtabData    = [],
    modeData        = "",
    localmodeData   = [],
    assetsData      = "",
    localassetsData = [],
    defaultScene = 0,
    sceneName    = "",
    sceneJson    = "",
    qxml         = "",
    resultTitle  = "",
    BGsrc      = "",
    began      = "",
    updateAnimation = [],
    sceneData       = {},
    localpage_value  = 0,
    data_active = 1,
    state = {},
    menuLayout   = [],
    sceneArr     = [],
    is_scene_load = false,
    show_dom = false;

    // it need to change by baseUrl
    let check_domain = (window.location.origin.search('localhost') > 0 || window.location.origin.search('demo-a.ucertify.com') > 0);
    let curDomain = (check_domain) ? 'https://www.jigyaasa.info/' : baseUrl;

    // creating the authoring writable store
    let auth_store = writable({
        xml: "",
        activeTab: 1,
        category: 'knowledge_check',
        type: 'simulation',
        content_type: 'q,u',
        content_subtype: '16',
        currentItem: "",
        msg : "",
        sceneData: "",
        tabvalue: 0,
        layout: 0,
        toggleMode: "",
        end: 12,
    });

    // subscribing to the store
    const unsubscribe = auth_store.subscribe((item)=> {
		state = item;
	});

    // calling beforeUpdate which calls before every time there is update
    beforeUpdate(async() => {
        if (is_scene_load) {

            // checking for authoring and preview mode
            if (editorState.toggleMode != state.toggleMode) {
                if (editorState.toggleMode) {
                    qxml = state.xml;
                    auth_store.update( (item) => {
                        item.xml = qxml;
                        return item;
                    });

                    getChildXml(qxml);

                    if (AH.selectAll('#authoringArea form').length) {
                        AH.select('#authoringArea form').remove();
                    }

                    let formaction = baseUrl + 'sim/smartsim/index.php?insight=1&in_editor=1&insight_navigation=1';
                    let testHtml = '<form method="post" target="authoringFrame" action="' + formaction + '"><input type="hidden" name="no_header" value="1"/><textarea class="h" name="qxml">'+qxml+'</textarea><input type="hidden" name="uxml" value=""/><input type="hidden" name="content_guid" value="0" /></form>';

                    AH.insert('#authoringArea', testHtml, 'beforeend');
                    let element = AH.selectAll('#title, #stem,.insight_tabs, #remediation, .editor_placeholder');
                    for (let index = 0; index < element.length; index++) {
                        AH.setCss(element[index], {
                            display: 'none',
                        })
                    }
                    AH.insert('#title', '<div id="tilteShow">' + AH.select('#title').innerHTML + '</div>', 'afterend');
                    AH.insert('#stem', '<div id="stemShow">' + AH.select('#stem').innerHTML + '</div>', 'afterend');
                    AH.insert('#remediation', '<div id="remediationShow">' + AH.select('#remediation').innerHTML + '</div>', 'afterend');
                    editorState.activator = true;
                    AH.select('form[target="authoringFrame"]').submit();
                    AH.select("#authoringFrame").style.display = 'block';
                } else {
                    AH.selectAll('#tilteShow, #stemShow, #remediationShow' , 'remove');
                    let element = AH.selectAll('#title, #stem, #remediation, #externalInputs, .insight_tabs, .editor_placeholder');
                    for (let index = 0; index < element.length; index++) {
                        AH.setCss(element[index], {
                            display: 'block',
                        })
                    }
                    try { 
                        AH.select("#authoringFrame").contentWindow.responsiveVoice.cancel(); 
                    } catch(e) { 
                        console.log(e); 
                    }
                    AH.select("#authoringFrame").style.display = 'none';
                }
                auth_store.update( (item) => {
                    item.toggleMode = editorState.toggleMode;
                    return item;
                });
            }

            // checking for change in xml
            if (state.xml != xml) {
                loadModule(xml);
                auth_store.update( (item) => {
                    item.xml = xml;
                    return item;
                });

                loadScene(state.end);
            }

            // setting visibles tabs according to the selected scene
            if (state.sceneData) {
                for (let index = 0; index < state.sceneData.scene.length; index++) {
                    if (sceneName == state.sceneData.scene[index].title) {
                        defaultScene = index;
                        if (AH.select('.insightTab8').nodeName && AH.select('.insightTab5').nodeName && AH.select('.insightTab4').nodeName) {
                            if (state.sceneData.scene[defaultScene].anim.length < 1) {
                                AH.select('.insightTab8').style.display = 'none';
                            } else {
                                AH.select('.insightTab8').style.display = 'block';
                            }
                            if (state.sceneData.scene[defaultScene].assets.length < 2) {
                                AH.select('.insightTab4').style.display = 'none';
                                AH.select('.insightTab5').style.display = 'none';
                            } else {
                                AH.select('.insightTab4').style.display = 'block';
                            }
                        }
                    } 
                }
            }
        } else {
            // removing editor activator after scene fetch
            editorState.activator = true;
        }
    });

    // binding up neccessary events 
    onMount( async() => {
        // for getting the insight data
        getDataFromApi();

        AH.listen('body', 'keyup', '#stem .ebook_item_text', function () {
            updateXmlValue();
        });


        AH.listen('body', 'keyup', '#search', function (current, event) {
            searchTable(event);
        });

        AH.listen('body', 'click', '.pagination_btn', function (current, event) {
            data_active = event.target.value;
            AH.selectAll(".pagination_btn", "removeClass", "active");
            current.classList.add('active');
            menuLayout = [];
            createPagination();
            state.end = 24;
        });

        AH.listen('body', 'click', '#table_list tr', function (current, event) {
            let guid = AH.find(current, 'td').innerText;
            let index = AH.select("#currentItem").value;
            localstepData[index].guids = guid;
            updateXmlValue(event, index, "", "", guid);
            AH.getBS('#player_modal', 'Modal').hide();
        });

        document.querySelector("#authoringFrame").addEventListener('load', ()=> { 
            if (editorState.toggleMode) {
                editorState.activator = false;
            }
		});

        AH.select('#preview').style.display = 'none';
        AH.select('#authoringFrame').style.display = 'none';

        AH.listen('body', 'click', '.tabbutton', function(element) {
            AH.selectAll('.tabbutton', 'removeClass', 'active');
            element.classList.add('active');
            auth_store.update( (item) => {
                item.tabvalue = Number(element.getAttribute('data-tab'));
                return item;
            });
        });
    })

    // afterUpdate is called after updation of the varibale here it set the content type & also manage sortable event
    afterUpdate( async() => {
        let isFound = itemArray.indexOf(state.type);
        if (isFound > -1) {
            setContentType();
        }

        if (state.tabvalue == 6) {
            let sortable = new Sortable(AH.select('#sortable'), {
                animation: 150,
                handle: '.allowDraggable',
                onEnd: function (evt) {
                    if (evt.oldIndex > evt.newIndex) {
                        for (let index = evt.oldIndex; index > evt.newIndex; index--) {
                            let tempValue = localstepData[index - 1];
                            localstepData[index-1] = localstepData[index];
                            localstepData[index] = tempValue;
                        }
                    } else if (evt.oldIndex < evt.newIndex) {
                        for (let index = evt.oldIndex; index < evt.newIndex; index++) {
                            let tempValue = localstepData[index + 1];
                            localstepData[index+1] = localstepData[index];
                            localstepData[index] = tempValue;
                        }
                    } else {
                        localstepData[evt.oldIndex] = localstepData[evt.newIndex];
                    }
                    
                    let swap_element = AH.selectAll('.step_swap');
                    swap_element.forEach((el) => {
                        el.click();
                    });
                    AH.select('.insightTab6').click();
                    let insight_timer = setTimeout( ()=> {
                        AH.select('.insightTab7').click();
                        clearTimeout(insight_timer);
                    }, 10);
                },
            });
        }

    });

    // used for fetching the insight data from the api
    function getDataFromApi() {
        AH.activate(2);
        AH.ajax({
            type: 'GET',
            url: baseUrl + 'editor/index.php?action=getinsight&insightId=054oF',
            onEnd: function() {
                editorState.activator = false;
                AH.activate(0);
                show_dom = true;
                is_scene_load = true;
            }
        }).then(function(data) {
            data = JSON.parse(data);
            auth_store.update( (item) => {
                item.sceneData = data;
                return item;
            });

            createPagination();
            loadScene(12);

            if (AH.selectAll("#placeHolderRemediation").length) {
                let parent = AH.select("#placeHolderRemediation").parentElement;
                parent.classList.add("float-start");
                parent.classList.add("col-12");
                parent.style.zIndex = '9';
            }
        });
    }

    // responsible for loading the module on the basis of xml
    function loadModule(loadXml) {
        let new_xml = XMLToJSON(loadXml);
        parseXMLAuthoring(new_xml); 
    }

    // create variable and store data in variable and used for parsing the xml
    function parseXMLAuthoring(INSIGHTXML) {
        localstepData          = [];
        localcharacterData 	   = [];
        localcharacterChoice   = [];
        localscoreCategoryData = [];
        localassetData         = [];
        localassetsData        = [];
        localtabData           = [];
        localmodeData          = [];
        insightData            = JSON.parse(INSIGHTXML.smxml.__cdata);
        stepData               = insightData.steps;
        scoreCategoryData      = insightData.scoreCategories;
        assetData              = insightData.assets;
        tabData                = insightData.link;
        modeData               = insightData.mode;
        sceneName              = INSIGHTXML.smxml._sceneName;
        sceneJson              = INSIGHTXML.smxml._sceneJson;
        isSmartChat            = INSIGHTXML.smxml._isSmartChat;
        began				   = insightData.begin;
        BGsrc				   = insightData.bgImage;
        resultTitle			   = insightData.detail;
        // setting the pagination count according to the total scenes
        if (state.sceneData) {
            for (let index = 0; index < state.sceneData.scene.length; index++) {
                if (sceneName == state.sceneData.scene[index].title) {
                    defaultScene = index;
                } 
            }
        }

        characterData = insightData.characters;
        // set all data of charaters like name id visiblity etc.

        for (let index = 0; index < characterData.length; index++) {
            localcharacterData = [
                ...localcharacterData, {
                visible  : characterData[index].visible,
                name     : characterData[index].name,
            }];	
            localcharacterChoice = [
                ...localcharacterChoice, {
                visible  : characterData[index].visible,
                name     : characterData[index].name,
            }];	
        }

        assetsData = insightData.assets;
        // set all data of assets like name id visiblity etc

        for (let index = 0; index < assetsData.length; index++) {
            localassetsData = [
                ...localassetsData, {
                name         : assetsData[index].asset,
                visible      : assetsData[index].visible,
                assets_click : assetData[index].assets_click,
                tooltip      : assetData[index].tooltip,
                anim         : assetData[index].anim,
                focus		 : assetData[index].focus,
            }];	
        }

        // push all data into variables
        if (Object.keys(stepData).length) {
            for (let index = 0; index < stepData.length; index++) {
                if (typeof stepData[index].image == 'undefined') {
                    stepData[index].image = '';
                }
                localstepData = [ 
                    ...localstepData, {
                    id      		 : stepData[index].id,
                    name     		 : stepData[index].name,
                    allowChoices     : stepData[index].allowChoices,
                    camera     		 : stepData[index].camera,
                    voice     		 : stepData[index].voice,
                    message     	 : stepData[index].message,
                    stepIndex     	 : stepData[index].stepIndex,
                    guids     	     : stepData[index].guids,
                    choicesScore     : stepData[index].choicesScore,
                    state			 : stepData[index].state,
                    speech			 : stepData[index].speech,
                    auto			 : stepData[index].auto,
                    choicesCategory  : stepData[index].choicesCategory,
                    condition        : stepData[index].condition,
                    image            : stepData[index].image,
                    choices     	 : [],
                    title			 : stepData[index].title,
                    important_node   : stepData[index].important_node,
                    level_text       : stepData[index].level_text
                }];
            }
            for (let index = 0; index < localstepData.length; index++) {
                for (let sub_index = 0; sub_index < stepData[index].choices.length; sub_index++) {
                    if (typeof stepData[index].choices[sub_index].fdbk_char_cam == 'undefined') {
                        stepData[index].choices[sub_index].fdbk_char_cam = stepData[index].choices[sub_index].camera;
                    }
                    if (typeof stepData[index].choices[sub_index].fdbk_char_voice == 'undefined') {
                        stepData[index].choices[sub_index].fdbk_char_voice = stepData[index].choices[sub_index].voice;
                    }
                    localstepData[index].choices = [ 
                        ...localstepData[index].choices, {
                        id      		 : stepData[index].choices[sub_index].id,
                        correct     	 : stepData[index].choices[sub_index].correct,
                        text             : stepData[index].choices[sub_index].text,
                        feedback         : stepData[index].choices[sub_index].feedback,
                        choicesScore     : stepData[index].choices[sub_index].choicesScore,
                        choicesCategory  : stepData[index].choices[sub_index].choicesCategory,
                        stepIndex        : stepData[index].choices[sub_index].stepIndex,
                        feedback_charact : stepData[index].choices[sub_index].feedback_charact,
                        fdbk_char_cam    : stepData[index].choices[sub_index].fdbk_char_cam,
                        fdbk_char_voice  : stepData[index].choices[sub_index].fdbk_char_voice
                    }];	
                }
            }
        }
        if (Object.keys(scoreCategoryData).length) {
            for (let index = 0; index < scoreCategoryData.length; index++) {
                localscoreCategoryData = [
                    ...localscoreCategoryData, {
                    id      : scoreCategoryData[index].id,
                    name    : scoreCategoryData[index].name,
                    value   : scoreCategoryData[index].value,
                }];		
            }
        }
        if (Object.keys(assetData).length) {
            for (let index = 0; index < assetData.length; index++) {
                localassetData = [
                    ...localassetData, {
                    src         : assetData[index].src,
                    title       : assetData[index].title,
                    icon        : assetData[index].icon ,
                    text        : assetData[index].text ,
                }];		
            }
        }
        if (Object.keys(tabData).length) {
            for (let index = 0; index < tabData.length; index++) {
                localtabData = [ ...localtabData , {
                    title      : tabData[index].title,
                    name       : tabData[index].name ,
                    guid       : tabData[index].guid ,
                    focus      : tabData[index].focus ,
                    dialog     : tabData[index].dialog,
                }];
            }
        }

        localmodeData = (modeData) ? modeData :  0;
    }

    // for uploading the image 
    function onChoiceImageSelect(event, i) {
        let files = event.target.files[0];
        const fd = new FormData();
        let rand =  Math.floor(100 * Math.random()) + 1;
        let image_name = 'uc_' + rand + 'choice' + i;
        if (files.size > 32768) {
            fd.append('image',files, '/' + image_name + '.png');
            AH.select('#bgResult').nodeName && AH.select("#bgResult").setAttribute("src", curDomain + 'labs/insight/Images/loading.gif');
            AH.select("#samplechoice_image" + i).nodeName && AH.select("#samplechoice_image" + i).setAttribute("src", curDomain + 'labs/insight/Images/loading.gif');
            
            AH.ajax({
                type:'POST',
                url: baseUrl+'editor/index.php?func=choiceupload&folder=Choice_question_images',
                data: fd,
                formData: true,
            }).then(function() {
                AH.select("#result_img").nodeName && AH.select("#result_img").setAttribute('value', curDomain + 'labs/insight/Choice_question_images/' + image_name + '.png');
                AH.select("#choice_question_image" + i).nodeName && AH.select("#choice_question_image" + i).setAttribute('value', curDomain + 'labs/insight/Choice_question_images/' + image_name + '.png');
                AH.select("#result_img").nodeName && AH.select("#result_img").click();
                AH.select("#choice_question_image" + i).nodeName && AH.select("#choice_question_image" + i).click();
            })
        } else {
            if (AH.select("#result_img").nodeName) {
                AH.select("#result_img").innerText = "File size is too small";
            }
            if (AH.select("#choice_question_image").nodeName) {
                AH.select("#choice_question_image").innerText = "File size is too small";
            }
            swal("File size is too small");
        }
    }

    // for removing the tags in the tags
    function removeTags(text) {
        let strippedText = text.replace(/(<([^>]+)>)/ig, '').replace(/\n/g, ' ');
        return strippedText;
    }

    // for setting the content type and content subtype
    function setContentType() {
        let content_type = '', content_subtype = '';
        switch (state.type) {
            case "terminal":
                content_type = "q,f";
                content_subtype = "13";
                break;
            case "lablink":
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
            default:
                content_type = content_subtype = '';
                break;
        }
        if (state.content_type != content_type || state.content_subtype != content_subtype) {
            auth_store.update( (item) => {
                item.content_type = content_type;
                item.content_subtype = content_subtype;
                return item;
            });
        }
    }

    // For getting the snippet 
    function getSnippet() {
        AH.selectAll(".list_content, #not_found, #info_data, .search_list", 'addClass', 'h')
        AH.select("#not_found").innerText = l.no_record;
        if (state.content_type != '' || state.content_subtype != '') {
            if (editor.course) {
                AH.select("#list_process").classList.remove("h");
                AH.ajax({
                    url: baseUrl + 'editor/index.php?action=getSnippet&ajax=1',
                    data: {
                        course_code: editor.course.split('.')[0],
                        content_type: state.content_type,
                        content_subtype: state.content_subtype
                    },
                    type: 'post',
                }).then(function (response) {
                    if (response != 0) {
                        let data = JSON.parse(response);
                        let table = '';
                        for (let index in data) {
                            table += '<tr><td>' + index + '</td>';
                            table += '<td>' + data[index]['snippet'] + '</td>';
                            table += '<td class="text-center player_modal_tooltip" data-bs-toggle="tooltip" title="' + ((itemIcons[state.content_subtype]) ? (itemIcons[state.content_subtype].title) : '') + '"><i class="' + ((itemIcons[state.content_subtype]) ? (itemIcons[state.content_subtype].icon) : '') + '"></i></td></tr>';
                        }
                        AH.select("#table_list").innerHTML = table;
                        if (table == '') {
                            AH.selectAll("#not_found", 'removeClass', "h");
                        } else {
                            AH.selectAll("#list_content_tbl, .search_list", 'removeClass', "h");
                        }
                        let tooltip_timer = setTimeout(function() {
                            AH.enableBsAll('.player_modal_tooltip', 'Tooltip', {
                                container: '#player_modal'
                            });
                            clearTimeout(tooltip_timer);
                        }, 100);
                    } else {
                        AH.selectAll("#not_found", 'removeClass', "h");
                    }
                    AH.select("#list_process").classList.add("h");
                }).catch(function() {
                    AH.selectAll("#list_process, .search_list", 'addClass', "h");
                    AH.selectAll("#not_found", 'removeClass', "h");
                    AH.showmsg(l.unable_to_get);
                    AH.activate(0);
                });
            } else {
                AH.selectAll("#not_found", 'removeClass', "h");
                AH.select("#not_found").innerText = l.load_course;
            }
        }
    }

    // for searching in the table
    function searchTable(event) {
        let input_val = event.target.value, count = 0;
        let table_tr = AH.selectAll('.table_search tbody tr');
        for (let index = 0; index < table_tr.length; index++) {
            let text = table_tr[index].innerText;
            if (text && input_val && (text.toLowerCase().indexOf(input_val.toLowerCase()) == -1)) {
                table_tr[index].classList.add('h');
            } else {
                table_tr[index].classList.remove('h');
                count++;
            }
        }
        if (count > 0) {
            AH.select('#not_found').classList.add('h');
            AH.select('#list_content_tbl').classList.remove('h');
        } else {
            AH.select('#not_found').classList.remove('h');
            AH.select('#list_content_tbl').classList.add('h');
        }
    }

    // for creating the pagination on scene tab
    function createPagination() {
        if (state.sceneData.scene.length > 12 * data_active) {
            data_active = parseInt(data_active) + 1;
            let end = 12 * data_active;
            menuLayout = [
                ...menuLayout, 
                {
                    data_active: data_active,
                    end: end
                }
            ];
        } else {
            menuLayout = [];
        }
    }

    // whenever there is change in the knowledge item dropdown
    function handlePlayer(event) {
        AH.selectAll(".list_content, #not_found, .search_list", 'addClass', 'h')
        AH.selectAll("#info_data", 'removeClass', 'h')
        AH.select('#table_list').innerHTML = '';
        auth_store.update( (item) => {
            item.msg = '';
            return item;
        });
    }

    // for loading the scene
    function loadScene(end) {
        localpage_value = end;
        sceneArr = [];
        state.sceneData && state.sceneData.scene.map((data, i)=>{
            if (i < end && i < state.sceneData.scene.length) {
                if (i == defaultScene) {
                    sceneArr = [
                        ...sceneArr, {
                            key: i,
                            background: '#F0F0F0',
                            alt: data.title,
                            type: 0
                        }
                    ]
                } else if (data.by == user['user_guid']) {
                    sceneArr = [
                        ...sceneArr, {
                            key: i,
                            alt: data.title,
                            type: 1
                        }
                    ]
                } else {
                    sceneArr = [
                        ...sceneArr, {
                            key: i,
                            alt: data.title,
                            type: 2
                        }
                    ]
                }
            }
        });
        auth_store.update( (item) => {
            item.layout = item.layout++;
            return item;
        });
    }
    
    // for updating the xml value this function is responsible
    function updateXmlValue(event, index ,parentIndex="", selector , value) {
        if (event) {
            value = event.target.value;
        }
        let xml = XMLToJSON(state.xml);
        switch(selector) { 
            case "addItem":
                AH.getBS('#player_modal', 'Modal').show();
                auth_store.update( (item) => {
                    item.currentItem = index;;
                    return item;
                });
                break;
            case "setCharacter" : 
                localcharacterData[index].name = value;
                localcharacterChoice[index].name = value;
                sceneData = state.sceneData;
                sceneData.scene[defaultScene].characters[index].name = value;
                auth_store.update( (item) => {
                    item.sceneData = sceneData;
                    return item;
                });
                break;
            case "setCategoryName" :
                localscoreCategoryData[index].name = value;
                break;
            case "deleteStep" :
                localstepData.splice(index, 1);
                break;
            case "deleteScene" :
                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this scene!",
                    type: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then(function(isConfirm) {
                    if (!isConfirm && index > 0) {
                        state.sceneData.scene.splice(index,1);
                        var output = JSON.stringify(state.sceneData);
                        AH.select('#pagination_btn1').click();
                        AH.ajax({
                            type: 'POST',
                            data: {myData:output},
                            url: baseUrl+'editor/index.php?action=setinsight&insightId=054oF',
                        }).then( () => {
                            swal("Delete successfully");
                        });
                    }
                });
                break;
            case "addStep" :
                var avaliableCharacter = 0;
                for (let increment = 0; increment < localcharacterData.length; increment++) {
                    if (localcharacterData[increment].visible == 0) {
                        avaliableCharacter = increment;
                        break;
                    }
                }
                localstepData[localstepData.length] = {
                    'id'          : localstepData.length,
                    'name'        : avaliableCharacter,
                    'allowChoices': 0,
                    "camera"      : state.sceneData.scene[defaultScene].characters[avaliableCharacter].camera,
                    "speech"      : 0,
                    "auto"        : 0,
                    "state"       : "talking",
                    "voice"       : state.sceneData.scene[defaultScene].characters[avaliableCharacter].voice,
                    "choices"     : [],
                    "message"     : "",
                    "level_text"   : "",
                    "important_node"   : ""
                };
                break;
            case "addChoice" :
                var avaliableCharacterChoice = 0;
                for (let increment = 0; increment < localcharacterChoice.length; increment++) {
                    if (localcharacterChoice[increment].visible == 0) {
                        avaliableCharacterChoice = increment;
                        break;
                    }
                }
                localstepData[index].choices[localstepData[index].choices.length] = {
                    'id'              : localstepData[index].choices.length,
                    "choicesScore"    : 0,
                    "choicesCategory" : 0,
                    "correct"         : 0,
                    "text"            : "",
                    "feedback"        : "",
                    "feedback_charact": avaliableCharacterChoice,
                    "fdbk_char_cam"   : state.sceneData.scene[defaultScene].characters[avaliableCharacterChoice].camera,
                    "fdbk_char_voice" : state.sceneData.scene[defaultScene].characters[avaliableCharacterChoice].voice
                };
                break;
            case "deleteChoice" :
                localstepData[parentIndex].choices.splice(index,1);
                break;
            case "assetVisible" :
                if (localassetsData[index].visible == 0) {
                    localassetsData[index].visible = 1;
                } else {
                    localassetsData[index].visible = 0;
                }
                sceneData = state.sceneData;
                sceneData.scene[defaultScene].assets[index].visible = value;
                auth_store.update( (item) => {
                    item.sceneData = sceneData;
                    return item;
                });
                break;
            case "setAssetsClick" :
                localassetsData[index].assets_click = parseInt(value);
                break;
            case "setTooltip" :
                localassetsData[index].tooltip = value;
                break;
            case "assetAnim" :
                localassetsData[index].anim = Number(value);
                localassetsData[index].focus = state.sceneData.scene[defaultScene].anim[Number(value)].name;
                sceneData = state.sceneData;
                sceneData.scene[defaultScene].assets[index].anim = Number(value);
                auth_store.update( (item) => {
                    item.sceneData = sceneData;
                    return item;
                });
                break;
            case "updateChoiceType" :
                //Added for alert switch blank page issue.
                if (localstepData[index].name   == "") {
                    localstepData[index].name = 0;
                }

                if (localstepData[index].image == "") {
                    localstepData[index].image = 0;
                }

                var avaliableCharacterChoice = 0;
                for (let increment = 0; increment < localcharacterChoice.length; increment++) {
                    if (localcharacterChoice[increment].visible == 0) {
                        avaliableCharacterChoice = increment;
                        break;
                    }
                }
                localstepData[index].allowChoices  = parseInt(value);
                if (localstepData[index].choices.length === 0) {
                    if (value == 1 || value == 3) {
                        localstepData[index].choices[localstepData[index].choices.length] = {
                            'id'              : localstepData[index].choices.length,
                            "choicesScore"    : 0,
                            "choicesCategory" : 0,
                            "correct"         : 0,
                            "text"            : "",
                            "feedback"        : "",
                            "image"		      : "",
                            "feedback_charact": avaliableCharacterChoice,
                            "fdbk_char_cam"   : state.sceneData.scene[defaultScene].characters[avaliableCharacterChoice].camera,
                            "fdbk_char_voice" : state.sceneData.scene[defaultScene].characters[avaliableCharacterChoice].voice
                        };
                    }
                }
                if (value == 2 || value == 4 || value == 5) {
                    localstepData[index].guids = "";
                    localstepData[index].cvalue = "";
                    localstepData[index].choicesScore = 10;
                    localstepData[index].choicesCategory = 0;
                    localstepData[index].message = "";
                }
                if (value == 7) {
                    localstepData[index].camera = 0;
                    localstepData[index].name   = "";
                    localstepData[index].voice  = 1;
                    localstepData[index].image  = "";
                }
                break;
            case "updateStepChracter" :
                localstepData[index].voice = state.sceneData.scene[defaultScene].characters[value].voice;
                localstepData[index].camera = state.sceneData.scene[defaultScene].characters[value].camera;
                localstepData[index].name  = parseInt(value);
                break;
            case "updateFeedbackChracter" :
                    localstepData[parentIndex].choices[index].feedback_charact = parseInt(value);
                    localstepData[parentIndex].choices[index].fdbk_char_voice = state.sceneData.scene[defaultScene].characters[value].voice;
                    localstepData[parentIndex].choices[index].fdbk_char_cam  = state.sceneData.scene[defaultScene].characters[value].camera;
                    break;
            case "updateSpeech" :
                if (localstepData[index].speech == 0) {
                    localstepData[index].speech  = 1;
                } else {
                    localstepData[index].speech  = 0;
                }
                break;
            case "updateAuto" :
                if (localstepData[index].auto == 0) {
                    localstepData[index].auto  = 1;
                } else {
                    localstepData[index].auto  = 0;
                }
                break;
            
            case "setImageSrc":
                localstepData[index].image = value;
                break;
            case "updateIntroVoice" :
                localstepData[index].voice = parseInt(value);
                break;
            case "setStepStatement" :
                // For remove the html tag to be seen in smart chat scene in chat box
                if (sceneName == "Smart Chat") {
                    if (value) {
                        value = value.toString().replace(/<[^>]*>/gm, '');
                    }
                }
                localstepData[index].message = value;
                break;
            case "setStepBTN" :
                localstepData[index].btn = value;
                break;
            case "setStepanim" :
                localstepData[index].anim = value;
                break;
            
            case "setStepCondition" :
                localstepData[index].condition = value;
                break;
            case "setGuids" :
                localstepData[index].guids = value;
                break;
            case "setChoiceText" :
                localstepData[parentIndex].choices[index].text = value;
                break;
            case "setChoiceFeedback" :
                localstepData[parentIndex].choices[index].feedback = value;
                break;
            case "setChoiceCategoryValue" :
                localstepData[parentIndex].choices[index].choicesScore = parseInt(event.target.value);
                break;
            case "setChoiceStepIndex" :
                if (event.target.value < 0 || event.target.value > localstepData.length) {
                    localstepData[parentIndex].choices[index].stepIndex = parentIndex;
                } else {
                    localstepData[parentIndex].choices[index].stepIndex = event.target.value;
                }
                break;
            case "setChoiceCorrect" :
                localstepData[parentIndex].choices[index].correct = parseInt(value);
                break;
            case "setChoiceCorrectR":
                for (let dd = 0; dd < localstepData[parentIndex].choices.length; dd++) {
                    if (index == dd) {
                        localstepData[parentIndex].choices[dd].correct = Number(value);	
                    } else {
                        localstepData[parentIndex].choices[dd].correct = 0;
                    }
                }
                break;
            case "setChoiceCategory" :
                localstepData[parentIndex].choices[index].choicesCategory = Number(value);
                break;
            case "setStepCategory" :
                localstepData[index].choicesCategory = parseInt(value);
                break;
            case "setStepCategoryValue" :
                localstepData[index].choicesScore = event.target.value;
                break;
            case "addCategory" :
                localscoreCategoryData[localscoreCategoryData.length] = {
                    'id'    : localscoreCategoryData.length,
                    'name'  : "",
                    'value' : "0",
                };
                break;
            case "deleteCategory" :
                auth_store.update( (item) => {
                    item.open = false;
                    return item;
                });

                if (localscoreCategoryData.length > 1) {
                    localscoreCategoryData.splice(index,1);
                } else {
                    swal("You cannot delete default node");
                }
                break;
            case "addtab" :
                localtabData[localtabData.length] = {
                    'title' : "",
                    'name'  : "",
                    'guid'  : "",
                    'dialog': "",
                };
                break;
            case "setTabTitle" :
                localtabData[index].title = value;
                break;
            case "setTabDialog" :
                localtabData[index].dialog = value;
                break;
            case "setTabName" :
                localtabData[index].name = value;
                localtabData[index].focus = state.sceneData.scene[defaultScene].anim[value].name;
                break;
            case "setTabGuid" :
                localtabData[index].guid = value;
                break;
            case "deleteTab" :
                localtabData.splice(index, 1);
                break;
            case "setScene" :
                defaultScene = value;
                sceneName    = state.sceneData.scene[defaultScene].title;
                sceneJson    = state.sceneData.scene[defaultScene].json;
                isSmartChat    = (state.sceneData.scene[defaultScene].is_smartchat == "1") ? "1" : "0";
                let sceneCharacters = [];
                if (state.sceneData.scene[defaultScene].assets.length < 2) {
                    AH.select('.insightTab4').style.display = 'none';
                    AH.select('.insightTab5').style.display = 'none';
                } else {
                    AH.select('.insightTab4').style.display = 'block';
                }
                for (let i = 0; i < state.sceneData.scene[defaultScene].characters.length; i++) {
                    sceneCharacters = [
                        ...sceneCharacters, {
                        id     : i,
                        name   : state.sceneData.scene[defaultScene].characters[i].name,
                        visible: state.sceneData.scene[defaultScene].characters[i].visible
                    }];
                }
                let sceneAssets = [];
                for (let i = 0 ; i < state.sceneData.scene[defaultScene].assets.length; i++) {
                    sceneAssets = [
                        ...sceneAssets, {
                        name    : state.sceneData.scene[defaultScene].assets[i].asset,
                        visible : state.sceneData.scene[defaultScene].assets[i].visible,
                        anim    : state.sceneData.scene[defaultScene].assets[i].anim,
                        tooltip : state.sceneData.scene[defaultScene].assets[i].tooltip,
                    }];
                }
                localcharacterData     = sceneCharacters;
                localcharacterChoice   = sceneCharacters;
                localassetsData 	   = sceneAssets;
                localscoreCategoryData = [];
                localscoreCategoryData[localscoreCategoryData.length] = {
                    'id'    : localscoreCategoryData.length,
                    'name'  : "Mission",
                    'value' : "0",
                };
                localstepData = [];
                if (state.sceneData.scene[defaultScene].anim.length < 1) {
                    AH.select('.insightTab8').style.display = 'none';
                } else {
                    AH.select('.insightTab8').style.display = 'block';
                }
                loadScene(localpage_value);
                break;
            case "updateMode" :
                localmodeData = parseInt(value);
                break;
            case "voiceData2" :
                for (let indent = 0; indent < localstepData.length; indent++) {
                    if (localstepData[indent].name == index) {
                        localstepData[indent].voice = parseInt(value);
                    }
                }
                state.sceneData.scene[defaultScene].characters[index].voice = parseInt(value);
                break;
            case "visibleCharacter" :
                if (localcharacterData[index].visible == 0) {
                    localcharacterData[index].visible = 1;
                } else {
                    localcharacterData[index].visible = 0;
                }
                sceneData = state.sceneData;
                sceneData.scene[defaultScene].characters[index].visible = value;
                auth_store.update( (item) => {
                    item.sceneData = sceneData;
                    return item;
                });
                state.sceneData.scene[defaultScene].characters[index].visible = value;
                break;
            case "trigerchoiceimage" :
                AH.select("#choiceimg"+index).click();
                break;
            case "titleUpdate":
                resultTitle = value;
                break;
            case "BGupdate":
                BGsrc = value;
                AH.select("#bgResult").setAttribute('src',value);
                break;
            case "beganupdate":
                began = value;
                /* It not allowed to add more than one word at the name of Begin button */
                /*let begin = value.replace(/[^a-zA-Z]/gi, '');
                began = begin;*/
                AH.select("#begin_Button").value = began;
                break;
            case "labelupdate":
                localstepData[index].level_text = event.target.value;
                break;
            case "updateNote":
                localstepData[index].important_node = event.target.value;
                break;
        }

        for (let index = 0; index < localscoreCategoryData.length; index++) {
            localscoreCategoryData[index].value = 0;
        }

        for (let index = 0; index < localstepData.length; index++) {
            if (localstepData[index].allowChoices == 1 || localstepData[index].allowChoices == 3 ||  localstepData[index].allowChoices == 6) { 
                for (let sub_index = 0; sub_index < localstepData[index].choices.length; sub_index++) {
                    let choicesScoreIndex = localstepData[index].choices[sub_index].choicesCategory;
                    localscoreCategoryData[choicesScoreIndex].value += parseInt(localstepData[index].choices[sub_index].choicesScore);
                    localstepData[index].choices[sub_index].id = sub_index;
                }
            } 
            if (localstepData[index].allowChoices == 2 || localstepData[index].allowChoices == 4 || localstepData[index].allowChoices ==  5) {
                var scoreIndex = localstepData[index].choicesCategory;	
                localscoreCategoryData[scoreIndex].value += parseInt(localstepData[index].choicesScore);	
            }
            localstepData[index].id = index;
        }

        xml.smxml._sceneName = sceneName;
        xml.smxml._sceneJson = sceneJson;
        xml.smxml._isSmartChat = isSmartChat;
        let insightupdatedData = { 'characters': localcharacterData, 'steps': localstepData, 'scoreCategories': localscoreCategoryData, 'assets': localassetsData, 'link': localtabData, 'mode': localmodeData, 'bgImage': BGsrc, 'detail': resultTitle, 'begin': began, 'insight_intro': tinyMCE.get("stem").getContent({ format: 'text' }).trim()}
        insightupdatedData = JSON.stringify(insightupdatedData, null, 4);
        xml.smxml.__cdata = insightupdatedData;
        xml = JSONToXML(xml);
		if (xml.indexOf('<!--[CDATA') > -1) {
			xml = xml.replace('<!--[CDATA', '<![CDATA').replace(']]-->', ']]>');
        }
        getChildXml(xml);
    }

    // for deleting the steps or mission
    function triggerDelete(event, type, index) {
        swal({
            text: l.del_confirmation,
            type: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function(isConfirm) {
            if (isConfirm) {
                updateXmlValue(event, index, "", type);
            }
        });
    }
    
</script>

<div id="authoringArea">
    <center>
        <div id="frame">
            <iframe id="authoringFrame" title="insight_frame" name="authoringFrame" height="580" width="94%" ></iframe>
        </div>
    </center>
    
    {#if state.tabvalue == 6}
        <div id="player_modal" class="modal player_dialog fade" tabIndex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body overflow-y">
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <label class="input-group-text" for="module_type">{l.module}</label>
                                    <!-- svelte-ignore a11y-no-onchange -->
                                    <select id="module_type" on:change={handlePlayer} bind:value={state.type} class="form-select">
                                        <option value="simulation">{l.simulation_txt}</option>
                                        <option value="playground">{l.playground}</option>
                                        <option value="terminal">{l.terminal_txt}</option>
                                        <option value="lablink">{l.livelab}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input type="hidden" name="currentItem" id="currentItem" value={state.currentItem}/>
                            <div class="col-12 mb-0 mt-3 px-0 search_list h">
                                <input class="form-control search" id="search" name="search" type="text" placeholder={l.search_item_txt}/>
                            </div>
                            <div class="col-12 px-0 float-start" style="max-height: 300px;">
                                <table id="list_content_tbl" class="h list_content table table-hover table_list table_search w-100">
                                    <thead class="always_show">
                                        <tr>
                                            <th class="text-dark border">{l.item_id}</th>
                                            <th class="text-dark border">{l.title}</th>
                                            <th class="text-dark border">{l.type}</th>
                                        </tr>
                                    </thead>
                                    <tbody id="table_list"></tbody>
                                </table>
                                <div class="alert alert-info col-12 float-start mb-0 mt-4" id="info_data">{l.select_instruction}</div>
                                <div class="alert alert-danger mt-2 col-12 float-start h" id="not_found">{l.no_record}</div>
                                <center id="list_process" class="mt-4 pt-1 h">
                                    <Loader size={60} msg={'Please Wait'} />
                                </center>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.cancel}</button>
                        <button type="button" class="btn btn-secondary" on:click={getSnippet}>{l.list_content}</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if show_dom}
        <div class="insight_tabs">
            <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Tabs">
                <div class="btn-group col-12 flex-wrap px-0" role="group" aria-label="Insight Tabs">
                    <button type="button" data-tab="0" class:active = {state.tabvalue == 0} class="btn btn-outline-secondary tabbutton insightTab1">{l.scene}</button>
                    <button type="button" data-tab="1" class:active = {state.tabvalue == 1} class="btn btn-outline-secondary tabbutton insightTab2">{l.intro}</button>
                    <button type="button" data-tab="2" class:active = {state.tabvalue == 2} class="btn btn-outline-secondary tabbutton insightTab3">{l.characters}</button>
                    <button type="button" data-tab="3" class:active = {state.tabvalue == 3} class="btn btn-outline-secondary tabbutton insightTab4 h">{l.assets}</button>
                    <button type="button" data-tab="4" class:active = {state.tabvalue == 4} class="btn btn-outline-secondary tabbutton insightTab5 h">{l.chat_windows}</button>
                    <button type="button" data-tab="5" class:active = {state.tabvalue == 5} class="btn btn-outline-secondary tabbutton insightTab6">{l.mission}</button>
                    <button type="button" data-tab="6" class:active = {state.tabvalue == 6} class="btn btn-outline-secondary tabbutton insightTab7">{l.communication}</button>
                    <button type="button" data-tab="7" class:active = {state.tabvalue == 7} class="btn btn-outline-secondary tabbutton insightTab8 h">{l.animation}</button>
                    <button type="button" data-tab="8" class:active = {state.tabvalue == 8} class="btn btn-outline-secondary tabbutton insightTab9">{l.result}</button>
                </div>
            </div>

            {#if state.tabvalue == 0}
                <center>
                    <div class="img_gridView row col-12">
                        {#if sceneArr.length > 0}
                            {#each sceneArr as data} 
                                <div key={data.key} class="col-lg-3 col-sm-4 col scene_image float-start p-2" class:bg-light={data.type == 0}>
                                    <div class="card card-body shadow-sm  p-2 h-100">
                                        <div class="image_view w-100 bg-light d-flex">
                                            <img 
                                                alt = {data.alt}
                                                width="200"
                                                height="200"
                                                src = {curDomain + 'labs/insight/Images/'+data.alt+'/scene.png'}
                                                class="w-100 border rounded"
                                            />
                                        </div>
                                        <div class="row pt-2">
                                            <div class="col-sm-12">
                                                <div class="image_dec font18 overflow-hidden w-100 h-100 pt-2 text-center text-truncate" data-bs-toggle="tooltip" title="{data.alt}">
                                                    <span htmlFor={"choose_btn" + (data.key)}>{data.alt}</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-12">
                                                <div class="grid_btn pt-2">
                                                    {#if data.type == 0}
                                                        <button type="button" 
                                                            value={data.key}
                                                            class="btn choose_btn btn-secondary float-end px-1 px-sm-3"
                                                            id={"choose_btn"+(data.key)} 
                                                            on:click = {(event) => {
                                                                updateXmlValue(event, "", "", "setScene")
                                                            }}
                                                        >
                                                            {l.no_of_token}
                                                        </button>
                                                    {:else if data.type == 1}
                                                        <button type="button" value={data.key}
                                                            class="btn choose_btn btn-light float-end text-dark"
                                                            id={"choose_btn"+(data.key)} 
                                                            data-bs-toggle="tooltip"
                                                            title={l.click_to_select + (data.alt).toLowerCase() + "."}
                                                            on:click = {(event) => {
                                                                updateXmlValue(event, "", "", "setScene")
                                                            }}
                                                        >
                                                            {l.select}
                                                        </button>
                                                        <button type="button" on:click = {(event) => {updateXmlValue(event, data.key, data.key, "deleteScene")}} class="delete_button ml-auto" tabIndex="0" role="button" aria-pressed="false"  style="border: none;background: white">
                                                            <span class="icomoon-remove-2 s4" style="color: #000;cursor: pointer;"></span>
                                                        </button>
                                                    {:else}
                                                        <button type="button" value={data.key}
                                                            class="btn choose_btn float-end btn-light text-dark px-1 px-sm-3"
                                                            id={"choose_btn"+(data.key)} 
                                                            data-bs-toggle="tooltip"
                                                            title={l.click_to_select + (data.alt).toLowerCase()+"."}
                                                            on:click = {(event) => {
                                                                updateXmlValue(event, "", "", "setScene")
                                                            }}
                                                        >
                                                            {l.select}
                                                        </button>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                    <div class="col-12 float-start pb-3 px-0 row">
                        <div class="col-12 px-0">
                            {#if menuLayout.length > 0}
                                {#each menuLayout as data} 
                                    <div class="pagination m-sm-1 justify-content-center">
                                        <button tabIndex="0" type="button" class="btn btn-outline-dark page-item form-control pagination_btn active col-6 col-sm-3" id={"pagination_btn" + (data.data_active)} value={data.data_active} key={data.data_active} on:click={() => {loadScene(data.end)}}>{l.load_more}</button>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </div>
                </center>
            {:else if state.tabvalue == 1}
                <div>
                    <div class="row col-md-10 mx-auto my-5">
                        <div class="col-sm-7">
                            <div class="card card-body intro_image_view shadow-sm p-2 min_height_300">
                                <img 
                                    alt = {sceneName}
                                    src = {curDomain + 'labs/insight/Images/' + sceneName +'/scene.png'}
                                    class = "min_height_300 w-100"
                                />
                            </div>							
                        </div>
                        <div class="col-sm-5 mt-3 mt-sm-0">    
                            <div class="form-group row mb-0">
                                <div class="input-group mb-3">
                                    <label for="select_Mode" class="input-group-text" data-bs-toggle="tooltip" title={l.select_game_mode} htmlFor="select_Mode" on:click="{(event) => { updateXmlValue(event,"select_Mode","","triggerForm")}}"> Mode </label>
                                    
                                    <!-- svelte-ignore a11y-no-onchange -->
                                    <select 
                                        class="form-select" 
                                        id="select_Mode"
                                        bind:value={localmodeData}
                                        on:change= {(event) => updateXmlValue(event, sceneTemp, "", "updateMode")} 
                                    >
                                        <option value={0}>{l.test}</option>
                                        <option value={1}>{l.learn}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row mb-0">
                                <div class="input-group mb-3">
                                    <label class="input-group-text" for="begin_Button" data-bs-toggle="tooltip" title={l.start_button}>{l.name_text}</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        placeholder="{l.placeholder_text}" 
                                        id= "begin_Button"
                                        bind:value={began}
                                        on:change= {(event) => updateXmlValue(event, 0, "", "beganupdate")}
                                        aria-describedby="buttonHelpBlock"
                                    />
                                </div>
                                <div class="col-md-12">
                                    <small id="buttonHelpBlock" class="form-text text-muted font14 buttonHelpBlock mb-2">
                                    {l.button_text}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if state.tabvalue == 2}
                <div class="col-md-10 mx-auto offset-3 mt-5">
                    <table class="w-100">
                        <tbody>
                            {#each localcharacterData as data, index}
                                <tr key={index}>
                                    <td align="center" class="char_image">
                                        <div class="text-center">
                                            <img width="145px" height="145px" alt={'Character '+(index + 1)} src={curDomain + 'labs/insight/Images/'+sceneName+'/chracter' + (index + 1) + '.png'}/>
                                        </div>
                                    </td>
                                    <td class="p-3">
                                        <div class="form-check form-switch ms-3">
                                            <input class="form-check-input" tabindex="0" type="checkbox" id={'char_visibl' + (index)}  on:change= {(event) => { updateXmlValue(event, index, "", "visibleCharacter")}}  value={data.visible} checked={(data.visible == 0) ? true : false} />
                                            <label class="form-check-label mt-small" data-bs-toggle="tooltip" title={l.set_chr_visiblity} for={'char_visibl' + (index)}>Visibility</label>
                                        </div>
                                        <div class="form-group row mb-2">
                                            <div class="input-group">
                                                <label for={'character_name'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.add_chr_nm} htmlFor={'character_name'+(index)}> Character Name </label>
                                                
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    placeholder="Character Name" 
                                                    id= {'character_name'+(index)}
                                                    bind:value={data.name}
                                                    disabled={data.visible == 0 ? (false) : (true)}
                                                    on:change= {(event) => updateXmlValue(event, index, "", "setCharacter")}
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row mb-2">
                                            <div class="input-group">
                                                <label for={'char_voice'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.chr_voice} htmlFor={'char_voice'+(index)}> {l.character_voice} </label>
                                                {#if (state.sceneData.scene[defaultScene].characters[index].voice == 1 || state.sceneData.scene[defaultScene].characters[index].voice == 3 || state.sceneData.scene[defaultScene].characters[index].voice == 7 || state.sceneData.scene[defaultScene].characters[index].voice == 9)}
                                                    <!-- svelte-ignore a11y-no-onchange -->
                                                    <select 
                                                        class="form-select" 
                                                        id={'char_voice' + index}
                                                        bind:value={state.sceneData.scene[defaultScene].characters[index].voice}
                                                        on:change= {(event) => updateXmlValue(event, index, "", "voiceData2")} 
                                                        disabled={data.visible == 0 ? (false) : (true)}
                                                    >
                                                        <option value={1}>{l.male_one}</option>
                                                        <option value={3}>{l.male_two}</option>
                                                        <option value={7}>{l.male_three}</option>
                                                        <option value={9}>{l.male_four}</option>
                                                    </select>
                                                {:else}
                                                    <!-- svelte-ignore a11y-no-onchange -->
                                                    <select 
                                                        class="form-select" 
                                                        id={'char_voice' + index}
                                                        bind:value={state.sceneData.scene[defaultScene].characters[index].voice}
                                                        on:change= {(event) => updateXmlValue(event, index, "", "voiceData2")} 
                                                        disabled={data.visible == 0 ? (false) : (true)}
                                                    >
                                                        <option value={0}>{l.female_one}</option>
                                                        <option value={2}>{l.female_two}</option>
                                                        <option value={4}>{l.female_three}</option>
                                                        <option value={6}>{l.female_four}</option>
                                                        <option value={8}>{l.female_five}</option>
                                                        <option value={10}>{l.female_six}</option>
                                                    </select>
                                                {/if}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else if state.tabvalue == 3} 
                <div class="col-md-10 mx-auto offset-3 mt-5">
                    <table class="w-100">
                        <tbody>
                            {#each state.sceneData.scene[defaultScene].assets as data, index}
                                <tr key={index}>
                                    <td align="center" class="w-25">
                                        <div class="text-center">
                                            <img class="img-thumbnail" width="145px" height="145px" alt={'Assets '+(index + 1)} src={curDomain + 'labs/insight/Images/'+sceneName+'/assets' + (index + 1) + '.png'}/>
                                        </div>
                                        <div class="text-center mt-2">
                                            <input type="text" bind:value={data.asset} disabled="disabled" class="form-control" />
                                        </div>
                                    </td>
                                    <td class="p-3">
                                        <div class="form-check form-switch ms-3">
                                            <input class="form-check-input" tabindex="0" type="checkbox" id={'asset_visible' + (index)}  on:change= {(event) => { updateXmlValue(event, index, "", "assetVisible")}} value={data.visible} checked={localassetsData[index].visible == 0 ? (false) : (true)}/>
                                            <label class="form-check-label mt-small" data-bs-toggle="tooltip" title={l.asset_visibility} for={'asset_visible' + (index)}>{l.visibility}</label>
                                        </div>
                                        <div class="form-group row mb-2">
                                            <div class="input-group">
                                                <label for={'asset_anim'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.asset_animation} htmlFor={'asset_anim'+(index)}> {l.animation} </label>
                                                <!-- svelte-ignore a11y-no-onchange -->
                                                <select 
                                                    class="form-select" 
                                                    id={'asset_anim' + index}
                                                    bind:value={data.anim}
                                                    on:change= {(event) => updateXmlValue(event, index, "", "assetAnim")} 
                                                    disabled={localassetsData[index].visible == 0 ? (true) : (false)}
                                                >
                                                    {#each state.sceneData.scene[defaultScene].anim as animation, key}
                                                        <option value={key} key={key}>{animation.name}</option>
                                                    {/each}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row mb-2">
                                            <div class="input-group">
                                                <label for={'asset_label'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.tooltip_txt} htmlFor={'asset_label'+(index)}> {l.tooltip} </label>
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    placeholder="Tooltip Name" 
                                                    id= {'asset_label' + (index)}
                                                    bind:value={data.tooltip}
                                                    disabled={localassetsData[index].visible == 0 ? (true) : (false)}
                                                    on:change= {(event) => updateXmlValue(event, index, "", "setTooltip")}
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row mb-2">
                                            <div class="input-group">
                                                <label for={'asset_stepindex'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.tooltip_txt} htmlFor={'asset_stepindex'+(index)}> {l.onclick_step} </label>
                                                <input 
                                                    type="number" 
                                                    class="form-control"
                                                    id= {'asset_stepindex' + (index)}
                                                    min="1"
                                                    max={localstepData.length} 
                                                    bind:value={data.assets_click}
                                                    disabled={localassetsData[index].visible == 0 ? (true) : (false)}
                                                    on:change= {(event) => updateXmlValue(event, index, "", "setAssetsClick")}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else if state.tabvalue == 5} 
                <div class="table_container col-md-10 mx-auto offset-2 mt-4">
                    {#if localscoreCategoryData.length > 0}
                        <table class="w-100 table mb-2" style="border: 1px solid #dee2e6!important;">
                            <tbody>
                                {#each localscoreCategoryData as data, index}
                                    <tr key={index}>
                                        <td align="center" class="tabcol border-0 ps-3">
                                            <div class="row">
                                                <div class="col-5 col-lg-9 col-sm-7">
                                                    <input
                                                        type="text"
                                                        bind:value={data.name}
                                                        on:change={(event) => { updateXmlValue(event, index,"","setCategoryName")}}
                                                        class = "form-control"
                                                        id={"main_mission" + (index)}
                                                        placeholder={"Mission #" + (index + 1) + " title"}
                                                    />
                                                </div>
                                                <div class="col-7 col-sm-3 px-0">
                                                    <div class="input-group">
                                                        <label for="inputPassword" data-bs-toggle="tooltip" title={l.points_text} class="input-group-text">{l.points}</label> 
                                                        <input type="number" min="0" bind:value={data.value} max="100" class="cursor_not_allowed form-control px-0 text-center" disabled={true}>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td align="center" class="border-0 float-end">
                                            <button type="button" class="bg-white delete_button ms-auto text-white border-0 mt-1" on:click={(event) => { triggerDelete(event, 'deleteCategory', index)}} tabindex="0" role="button" aria-pressed="false">
                                                <span data-bs-toggle="tooltip" title={l.delete}  class="icomoon-remove-2 s4 pointer text-dark"></span>
                                            </button>
                                        </td>
                                    </tr>
                                {/each}      
                            </tbody>
                        </table>
                    {/if}
                    <div class="row">
                        <div class="col-12">
                            <div class="add_step float-end mt-2" on:click={(event) => {updateXmlValue(event, localscoreCategoryData.length ,"","addCategory")}}>
                                <button data-bs-toggle="tooltip" title={l.new_mission} class="btn rounded-pill img-shadow border shadow-sm">
                                    <b>{l.add_mission}</b>
                                    <span class="icomoon-plus-circle-2 s4 relative ms-1 float-end"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if state.tabvalue == 6} 
                <div>
                    <div id="sortable">
                        {#if localstepData.length > 0}
                            {#each localstepData as data, index}
                                <div class="accordion p-2" id={"steps_accordian" + index} >
                                    <div class="accordion-item">
                                        <div class="accordion-header allowDraggable" style="cursor: move;" id={"steps_heading" + index}>
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#{"steps_collapse" + index}" aria-expanded="false" aria-controls="{"steps_collapse" + index}">
                                                <span>
                                                    <span class="icomoon-new-24px-arrow-right-2 position-relative icon_setup s4"></span>
                                                    {'Step ' + (index + 1)}
                                                </span>
                                            </button>
                                        </div>
                                        <div id="{"steps_collapse" + index}" class="accordion-collapse collapse" aria-labelledby={"steps_heading" + index} data-bs-parent={"#steps_accordian" + index}>
                                            <div class="accordion-body">
                                                <div class="row">
                                                    <input type="hidden" class="step_swap" on:click={(event) => { updateXmlValue(event, index, "","swapSteps")}} />
                                                    {#if data.allowChoices != 7}
                                                        <div class="col-3 pt-1">
                                                            <div class="row mb-2 mx-0">
                                                                <label for={'select-character'+(index)} class="d-inline font18 px-0 text-truncate" htmlFor={'select-character'+(index)}>{l.choose_character}</label>
                                                            </div>
                                                            <div class="row mx-0">
                                                                <div class="stmnt_img w-100 px-0">
                                                                    {#if localcharacterData[data.name].visible == 0}
                                                                        <img style="width: 100%; height:100%;" alt={'Character '+ ( data.name + 1) + '' + index} src={curDomain + 'labs/insight/Images/' + sceneName + '/chracter' + (data.name + 1) + '.png'}/>
                                                                    {:else}
                                                                        <img style="width: 100%; height:100%;" alt={'Character '+ (data.name + 1)} src={curDomain + 'labs/insight/Images/character.png'}/>
                                                                    {/if}
                                                                </div>
                                                            </div>
                                                            <div class="row mx-0">
                                                                {#if localcharacterData[data.name].visible == 0}
                                                                    <div class="input-group input-group-sm mt-1 px-0">
                                                                        <!-- svelte-ignore a11y-no-onchange -->
                                                                        <select 
                                                                            class="form-select" 
                                                                            id={"select-character" + (index)}
                                                                            bind:value={data.name}
                                                                            on:change= {(event) => updateXmlValue(event, index, "", "updateStepChracter")} 
                                                                        >
                                                                            {#each localcharacterData as character, keys}
                                                                                {#if localcharacterData[keys].visible == 0}
                                                                                    <option value={keys}>{character.name}</option>
                                                                                {/if}
                                                                            {/each}
                                                                        </select>
                                                                    </div>
                                                                {:else}
                                                                    <div class="input-group input-group-sm mt-1 px-0">
                                                                        <!-- svelte-ignore a11y-no-onchange -->
                                                                        <select 
                                                                            class="form-select" 
                                                                            id={"select-character" + (index)}
                                                                            bind:value={data.name}
                                                                            on:change= {(event) => updateXmlValue(event, index, "", "updateStepChracter")} 
                                                                        >
                                                                            {#each localcharacterData as character, keys}
                                                                                {#if localcharacterData[keys].visible == 0}
                                                                                    <option value={keys}>{character.name}</option>
                                                                                {/if}
                                                                            {/each}
                                                                            <option value={data.name} k={data.name}>{l.not_visible}</option>
                                                                        </select>
                                                                    </div>
                                                                {/if}
                                                            </div>
                                                        </div>
                                                    {/if}
                                                    <div class={(data.allowChoices != 7) ? "col-9 pl-0" :"col-12"}>
                                                        <div class="row mx-0">
                                                            {#if data.allowChoices == 7} 
                                                                <div class="col-lg-2 col-3 form-group pl-0">
                                                                    <div class="float-start w-100">
                                                                        <div class="input-group input-group-sm">
                                                                            <label for="selectVoice" data-bs-toggle="tooltip" title={l.narrater_voice} class="input-group-text">{l.voice}</label>
                                                                            <!-- svelte-ignore a11y-no-onchange -->
                                                                            <select 
                                                                                class="form-select" 
                                                                                id="selectVoice"
                                                                                bind:value={data.voice}
                                                                                on:change= {(event) => updateXmlValue(event, index, "", "updateIntroVoice")} 
                                                                            >
                                                                                <option value={0}>{l.female}</option>
                                                                                <option value={1}>{l.male}</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            {/if}
                                                
                                                            <div class="col-lg-4 col-6 form-group pl-0">
                                                                <div class="input-group input-group-sm">
                                                                    <label for={"select-type" + (index)} data-bs-toggle="tooltip" title={l.type_of_step} class="d-md-block d-none input-group-text">{l.conversion_type}</label>
                                                                    <!-- svelte-ignore a11y-no-onchange -->
                                                                    <select 
                                                                        class="form-select" 
                                                                        id={"select-type" + (index)}
                                                                        bind:value={data.allowChoices}
                                                                        on:change= {(event) => updateXmlValue(event, index, "", "updateChoiceType")} 
                                                                    >
                                                                        <option value={0}>{l.statement}</option>
                                                                        <option value={1}>{l.choice}</option>
                                                                        <option value={2}>{l.item}</option>
                                                                        <option value={3}>{l.multichoice}</option>
                                                                        <option value={7}>{l.alert}</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            {#if data.allowChoices <= 0}
                                                                <div class="col-4 col-lg-3 col-md-4 pr-0">
                                                                    <div class="form-check form-switch mt-1">
                                                                        <input class="form-check-input" tabindex="0" type="checkbox" data-bs-toggle="tooltip" title={l.autocomplete_txt} id={'selectAuto' + (index)}  on:change= {(event) => { updateXmlValue(event, index, "", "updateAuto")}}  bind:value={data.auto} checked={data.auto == 0 ? false : true}/>
                                                                        <label class="text-truncate form-check-label mt-small" data-bs-toggle="tooltip" title={l.autocomplete_txt} for={"selectAuto" + (index)}>{l.autocomplete}</label>
                                                                    </div>
                                                                </div>
                                                            {/if}
                                                            <div class="{ (data.allowChoices > 0) ? 'col-1 ml-auto text-right px-0' : 'col-lg-5 col-2 px-0 text-right'}">
                                                                <button data-bs-toggle="tooltip" title={l.delete} type="button" class="bg-white delete_button mx-auto border-0 px-0" tabindex="0" role="button" aria-pressed="false" on:click= {(event) => { triggerDelete(event, 'deleteStep', index) } }>
                                                                    <span class="icomoon-remove-2 s4 pointer text-dark"></span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div class="row mx-0">
                                                            <!-- Uploading in choice and multichoice-->
                                                            {#if data.allowChoices == 1 || data.allowChoices == 3}
                                                                <div class="col-4 px-0">
                                                                    <!-- svelte-ignore a11y-img-redundant-alt -->
                                                                    <img 
                                                                        id={"samplechoice_image"+ index}
                                                                        alt = "Choice Question Image"
                                                                        src = {(data.image == "" || data.image == null || data.image == "undefined") ? (curDomain + 'labs/insight/Images/bl.jpg') : (data.image)}
                                                                        class="img-thumbnail choiceimage rounded-0 w-100"
                                                                    />
                                                                    <button type="button" class="btn btn-dark rounded-0 w-100 text-truncate"
                                                                        data-bs-toggle="tooltip"
                                                                        title={l.image_size_txt}
                                                                        on:click = {(event) => { updateXmlValue(event , index, "", "trigerchoiceimage")}}
                                                                    >
                                                                        {l.file_elem}
                                                                    </button>
                                                                </div>
                                                                <input class="h" accept="image/png" type="file" id={"choiceimg" + index} on:change={(event) => onChoiceImageSelect(event, index)}/> 
                                                                <input
                                                                    type="hidden"
                                                                    bind:value={data.image}
                                                                    id={"choice_question_image" + (index)}
                                                                    class="form-control w-50 choice_image_upld"
                                                                    on:click = {(event) => { updateXmlValue(event , index, "", "setImageSrc")}}
                                                                    placeholder={l.image_link}
                                                                />
                                                            {/if}
                                                            <div class={ data.allowChoices == 7 ? "float-start col px-0" : "border-dark float-start ml-0 pl-2 px-0"} class:col-8 = {data.allowChoices == 1 || data.allowChoices == 3}>
                                                                <div class={ data.allowChoices == 7 ? "border-dark" : "" } >
                                                                    <textarea
                                                                        class="commu_textarea w-100"
                                                                        value={removeTags(data.message)}
                                                                        id={"statementTxt" + index}
                                                                        on:change={(event) => {updateXmlValue(event, index, "", "setStepStatement")}}
                                                                        placeholder="Conversation text"
                                                                    ></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Item id, mission , score -->
                                                {#if (data.allowChoices == 2 || data.allowChoices == 4 || data.allowChoices == 5) }
                                                    <div class="col-12 mt-2 px-0">
                                                        <div class="row">
                                                            <div class="col-3">
                                                                <div class="input-group">
                                                                    <label
                                                                        for={"itemTxt" + index}
                                                                        class="input-group-text"
                                                                        data-bs-toggle="tooltip"
                                                                        title={l.guid_value}
                                                                    >
                                                                        {(data.allowChoices == 5 || data.allowChoices == 4) ? 'Value' : 'Item Id'}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        bind:value={data.guids}
                                                                        on:change={ (event) => { updateXmlValue(event, index, "", "setGuids") }}
                                                                        placeholder="Enter Value"
                                                                        class="form-control"
                                                                        id={"itemTxt" + index}
                                                                    />
                                                                    <div
                                                                        class="add_item_button border btn p-1"
                                                                        tabindex="0"
                                                                        on:click={ (event) => {updateXmlValue( event, index, "", "addItem")}}
                                                                    >
                                                                        <span class="align-middle text-dark pointer icomoon-new-24px-add-circle-1 s4"></span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="col-3">
                                                                <div class="input-group">
                                                                    <label
                                                                        for={"selectMission" + index}
                                                                        class="input-group-text"
                                                                        data-bs-toggle="tooltip"
                                                                        title={l.mission_name}
                                                                    >
                                                                        {l.mission}
                                                                    </label>
                                                                    <!-- svelte-ignore a11y-no-onchange -->
                                                                    <select 
                                                                        class="form-select" 
                                                                        id={"selectMission" + (index)}
                                                                        bind:value={data.choicesCategory}
                                                                        on:change= {(event) => updateXmlValue(event, index, "", "setStepCategory")} 
                                                                    >
                                                                        {#each localscoreCategoryData as category, keys}
                                                                                <option value={keys}>{category.name}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="col-3">
                                                                <div class="input-group">
                                                                    <label
                                                                        for={"selectScore" + index}
                                                                        class="input-group-text"
                                                                        data-bs-toggle="tooltip"
                                                                        title={l.score_value}
                                                                    >
                                                                        {l.score}
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        bind:value={data.choicesScore}
                                                                        on:change={ (event) => { updateXmlValue(event, index, "", "setStepCategoryValue") }}
                                                                        id={"selectScore" + index}
                                                                        class="form-control"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/if}

                                                <!-- Speech checkbox-->
                                                {#if data.allowChoices <= 0}
                                                    <div class="col-12 mt-2 px-0">
                                                        <div class="row">
                                                            <div class="col-3">
                                                                <div class="form-check form-switch ms-3 mt-2">
                                                                    <input class="form-check-input" tabindex="0" data-bs-toggle="tooltip" title={l.speech_input} type="checkbox" id={'selectSpeech' + (index)}  on:change= {(event) => { updateXmlValue(event, index, "", "updateSpeech")}}  bind:value={data.speech} checked={data.speech == 0 ? (false) : (true)}/>
                                                                    <label class="form-check-label mt-small" data-bs-toggle="tooltip" title={l.speech_txt} for={"selectSpeech" + (index)}>{l.speech}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/if}

                                                <!-- Branching Conditions -->
                                                {#if data.allowChoices > 4 && data.allowChoices != 7 && data.allowChoices != 8}
                                                    <div class="col-12 mt-2 px-0">
                                                        <div class="form-floating">
                                                            <input type="text" class="form-control" id="branching_condition" placeholder="Enter conditions here" bind:value={data.condition} on:change = {(event) => {updateXmlValue(event, index , "", "setStepCondition")}}>
                                                            <label for="branching_condition">{l.branch_condition}</label>
                                                        </div>
                                                    </div>
                                                {/if}

                                                <!-- Button Name & Animation -->
                                                {#if data.allowChoices == 8}
                                                    <div class="col-12 mt-2 px-0">
                                                        <div class="row">
                                                            <div class="col-6">
                                                                <div class="form-floating">
                                                                    <input type="text" class="form-control" id="button_name" placeholder={l.enter_btn_name} bind:value={data.btn} on:change = {(event) => {updateXmlValue(event, index , "", "setStepBTN")}}>
                                                                    <label for="button_name">{l.btn_name}</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6">
                                                                <div class="form-floating">
                                                                    <!-- svelte-ignore a11y-no-onchange -->
                                                                    <select 
                                                                        class="form-select" 
                                                                        id="animation" 
                                                                        data-bs-toggle="tooltip"
                                                                        title={l.animation}
                                                                        bind:value = {data.anim}
                                                                        on:change = {(event) => {updateXmlValue(event, index , "", "setStepanim")}}
                                                                    >
                                                                        {#each state.sceneData.scene[defaultScene].anim as animation , key}
                                                                            <option value={key} key={key}>{animation.name}</option>
                                                                        {:else}
                                                                            <option value="" key="0" selected disabled>{l.no_anim_avail}</option>
                                                                        {/each}
                                                                    </select>
                                                                    <label for="animation">{l.animation}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/if}

                                                <!--Choice accordian-->
                                                {#if (data.allowChoices == 1 || data.allowChoices == 3 || data.allowChoices == 6)}
                                                    {#each data.choices as choices, key}
                                                        <div class="accordion py-2" id={"choices_accordian" + index + "_" + key} >
                                                            <div class="accordion-item">
                                                                <div class="accordion-header" id={"choices_heading" + index + "_" + key}>
                                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#{"choices_collapse" + index + "_" + key}" aria-expanded="false" aria-controls="{"choices_collapse" + index + "_" + key}">
                                                                        {'Choice ' + (key + 1)}
                                                                    </button>
                                                                </div>
                                                                <div id="{"choices_collapse" + index + "_" + key}" class="accordion-collapse collapse" aria-labelledby={"choices_heading" + index + "_" + key} data-bs-parent={"#choices_accordian" + index + "_" + key}>
                                                                    <div class="row">
                                                                        <div class="col-12">
                                                                            <div class="row p-2">
                                                                                <div class="col-6">
                                                                                    <div class="form-floating">
                                                                                        <input type="text" class="form-control" id="textUpdate" data-bs-toggle="tooltip" placeholder={l.enter_choice_text} title={l.choice_text} bind:value={choices.text} on:change = {(event) => {updateXmlValue(event, key, index , "setChoiceText")}}>
                                                                                        <label for="textUpdate">{l.text}</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-6">
                                                                                    <div class="form-floating">
                                                                                        <input type="text" class="form-control" id={'updatefeedback' + index} placeholder={l.enter_choice_feedback} data-bs-toggle="tooltip" title={l.feedback_text} bind:value={choices.feedback} on:change = {(event) => {updateXmlValue(event, key, index , "setChoiceFeedback")}}>
                                                                                        <label for={'updatefeedback' + index}>Feedback</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-12">
                                                                            <div class="row p-2">
                                                                                <div class="col-6">
                                                                                    <div class="form-floating">

                                                                                        {#if (localcharacterChoice[data.name].visible == 0)}
                                                                                            <!-- svelte-ignore a11y-no-onchange -->
                                                                                            <select 
                                                                                                class="form-select" 
                                                                                                id={'feedback_character' + index} 
                                                                                                data-bs-toggle="tooltip"
                                                                                                title= {l.fb_char_name}
                                                                                                bind:value = {choices.feedback_charact}
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index, "updateFeedbackChracter")}}
                                                                                            >
                                                                                                {#each localcharacterChoice as character , character_key}
                                                                                                    {#if character.visible == 0}
                                                                                                        <option value={character_key} key={character_key}>{character.name}</option>
                                                                                                    {/if}
                                                                                                {/each}
                                                                                            </select>
                                                                                        {:else}
                                                                                            <!-- svelte-ignore a11y-no-onchange -->
                                                                                            <select 
                                                                                                class="form-select" 
                                                                                                id={'feedback_character' + index} 
                                                                                                data-bs-toggle="tooltip"
                                                                                                title= {l.fb_char_name}
                                                                                                bind:value = {data.name}
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index, "updateFeedbackChracter")}}
                                                                                            >
                                                                                                {#each localcharacterChoice as character , character_key}
                                                                                                    {#if character.visible == 0}
                                                                                                        <option value={character_key} key={character_key}>{character.name}</option>
                                                                                                    {/if}
                                                                                                {/each}
                                                                                                <option value={data.name} k={data.name}>{l.not_visible}</option>
                                                                                            </select>
                                                                                        {/if}
                                                                                        <label for={'feedback_character' + index}>{l.fb_char}</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-6">
                                                                                    <div class="form-floating">
                                                                                        <!-- svelte-ignore a11y-no-onchange -->
                                                                                        <select 
                                                                                            class="form-select" 
                                                                                            id={'selectMission' + key} 
                                                                                            data-bs-toggle="tooltip"
                                                                                            title= "Mission Name"
                                                                                            bind:value = {choices.choicesCategory}
                                                                                            on:change = {(event) => {updateXmlValue(event, key, index, "setChoiceCategory")}}
                                                                                        >
                                                                                            {#each localscoreCategoryData as category , category_key}
                                                                                                <option value={category_key} key={category_key}>{category.name}</option>
                                                                                            {/each}
                                                                                        </select>
                                                                                        <label for={'selectMission' + key}>{l.mission}</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-12">
                                                                            <div class="row p-2">
                                                                                {#if data.allowChoices == 3}
                                                                                    <div class="col-3">
                                                                                        <div class="form-floating">
                                                                                            <!-- svelte-ignore a11y-no-onchange -->
                                                                                            <select 
                                                                                                class="form-select" 
                                                                                                id={'selectCorrect' + key} 
                                                                                                data-bs-toggle="tooltip"
                                                                                                title= {l.select_choics}
                                                                                                bind:value = {choices.correct}
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index, "setChoiceCorrect")}}
                                                                                            >
                                                                                                <option value={0}>{l.false}</option>
                                                                                                <option value={1}>{l.true}</option>
                                                                                                <option value={2}>{l.none}</option>
                                                                                            </select>
                                                                                            <label for={'selectCorrect' + key}>{l.correct}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-3">
                                                                                        <div class="form-floating">
                                                                                            <input type="number" 
                                                                                                class="form-control" 
                                                                                                id={'selectScoreChoice' + key} 
                                                                                                min="0" 
                                                                                                max="100" 
                                                                                                placeholder={l.score_value} 
                                                                                                data-bs-toggle="tooltip"
                                                                                                title={l.score_value} 
                                                                                                bind:value={choices.choicesScore} 
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index , "setChoiceCategoryValue")}}
                                                                                            >
                                                                                            <label for={'selectScoreChoice' + key}>Score</label>
                                                                                        </div>
                                                                                    </div>
                                                                                {:else if data.allowChoices == 1}
                                                                                    <div class="col-3">
                                                                                        <div class="form-floating">
                                                                                            <!-- svelte-ignore a11y-no-onchange -->
                                                                                            <select 
                                                                                                class="form-select" 
                                                                                                id={'selectCorrect' + key} 
                                                                                                data-bs-toggle="tooltip"
                                                                                                title= "Select true or false to indicate if the choice correct or not."
                                                                                                bind:value = {choices.correct}
                                                                                                defaultValue={choices.correct}
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index, "setChoiceCorrectR")}}
                                                                                            >
                                                                                                <option value={0}>{l.false}</option>
                                                                                                <option value={1}>{l.true}</option>
                                                                                            </select>
                                                                                            <label for={'selectCorrect' + key}>{l.correct}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-3">
                                                                                        <div class="form-floating">
                                                                                            <input type="number" 
                                                                                                class="form-control" 
                                                                                                id={'selectScoreChoice' + key} 
                                                                                                min="0" 
                                                                                                max="100" 
                                                                                                placeholder={l.score_value} 
                                                                                                data-bs-toggle="tooltip"
                                                                                                title={l.score_value} 
                                                                                                bind:value={choices.choicesScore} 
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index , "setChoiceCategoryValue")}}
                                                                                            >
                                                                                            <label for={'selectScoreChoice' + key}>{l.score}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-3">
                                                                                        <div class="form-floating">
                                                                                            <input type="number" 
                                                                                                class="form-control" 
                                                                                                id={'selectChoicestepIndex' + key} 
                                                                                                min="1" 
                                                                                                max={localstepData.length}
                                                                                                data-bs-toggle="tooltip"
                                                                                                title={l.step_index_txt}
                                                                                                bind:value={choices.stepIndex} 
                                                                                                on:change = {(event) => {updateXmlValue(event, key, index , "setChoiceStepIndex")}}
                                                                                            >
                                                                                            <label for={'selectChoicestepIndex' + key}>{l.step_index}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                {/if}
                                                                                <div class="{(data.allowChoices == 1) ? 'col-3' : 'col-6'}">
                                                                                    <button data-bs-toggle="tooltip" title={l.delete} type="button" class="float-end bg-white delete_button ms-auto text-white border-0 mt-1" tabindex="0" role="button" aria-pressed="false" on:click={(event) => {updateXmlValue(event, key, index, "deleteChoice")}}>
                                                                                        <span class="icomoon-remove-2 s4 pointer text-dark"></span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    {/each}

                                                    <!--Add Choices buttons-->
                                                    <div class="col-12">
                                                        <div class="row">
                                                            <div class="col-12 px-0 mt-2">
                                                                <div class="add_choices float-start" on:click={(event) => {updateXmlValue(event, index ,"","addChoice")}}>
                                                                    <button data-bs-toggle="tooltip" title={l.new_mission} class="btn rounded-pill img-shadow border shadow-sm">
                                                                        <b>{l.add_choice}</b>
                                                                        <span class="icomoon-plus-circle-2 s4 relative ms-1 float-end"></span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/if}

                                                <!--Level and insert note-->
                                                <div class="col-12 mt-3 px-0">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <div class="input-group">
                                                                <label class="input-group-text" for={"level_text" + index}>{l.level_text}</label>
                                                                <input type="text" class="form-control" id={"level_text" + index} placeholder={l.level_placeholder} bind:value={data.level_text} on:change = {(event) => {updateXmlValue(event, index , "", "labelupdate")}}>
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="input-group">
                                                                <label class="input-group-text" for={"important_note" + index}>{l.insert_note}</label>
                                                                <input type="text" class="form-control" id={"important_note" + index} placeholder={l.note_placeholder} bind:value={data.important_node} on:change = {(event) => {updateXmlValue(event, index , "", "updateNote")}}>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                    <div class="add_step text-center mt-3">
                        <button data-bs-toggle="tooltip" title={l.new_step} on:click={(event) => {updateXmlValue(event, localstepData.length ,"","addStep")}} class="btn  rounded-pill img-shadow border shadow-sm">
                            <b>Add Step</b>
                            <span class="icomoon-plus-circle-2 s4 relative ms-1 float-end"></span>
                        </button>
                    </div>
                </div>
            {:else if state.tabvalue == 7} 
                <div class="mx-auto py-2 row">
                    <div class="row">
                        <div class="relative text-center mt-2">
                            <button on:click={(event) => {updateXmlValue(event, sceneTemp, "", "addtab")}} class="btn bg-white rounded-pill img-shadow mb-2 border shadow-sm">
                                <b>{l.add_anim}</b>
                                <span class="icomoon-plus-circle-2 s4 relative ms-1 float-end"></span>
                            </button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table w-100">
                            {#if localtabData.length > 0}
                                {#each localtabData as data, index}
                                    <tr key={index}>
                                        <td>
                                            <div class="text-center">({index + 1})</div>
                                        </td>
                                        <td>
                                            <div class="form-group row mb-2">
                                                <div class="input-group">
                                                    <label for={'anim_btnName'+(index)} class="input-group-text" title={l.btn_name} data-bs-toggle="tooltip" htmlFor={'anim_btnName'+(index)}> {l.btn_name} </label>
                                                    <input 
                                                        type="text" 
                                                        class="form-control" 
                                                        placeholder={l.enter_btn_name}
                                                        id= {'anim_btnName' + (index)}
                                                        bind:value={data.title}
                                                        on:change= {(event) => updateXmlValue(event, index, "", "setTabTitle")}
                                                    />
                                                </div>
                                            </div>
                                            <div class="form-group row mb-2">
                                                <div class="input-group">
                                                    <label for={'anim_play'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.animation_play} htmlFor={'anim_play'+(index)}> {l.animation_play} </label>
                                                    <!-- svelte-ignore a11y-no-onchange -->
                                                    <select 
                                                        class="form-select" 
                                                        id={'anim_play' + index}
                                                        bind:value={data.name}
                                                        on:change= {(event) => updateXmlValue(event, index, "", "setTabName")} 
                                                    >
                                                        {#each state.sceneData.scene[defaultScene].anim as animation, key}
                                                            <option value={key} key={key}>{animation.name}</option>
                                                        {/each}
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="form-group row mb-2">
                                                <div class="input-group">
                                                    <label for={'anim_dilog'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.dialog} htmlFor={'anim_dilog'+(index)}> {l.dialog} </label>
                                                    <input 
                                                        type="text" 
                                                        class="form-control" 
                                                        placeholder={l.dialog} 
                                                        id= {'anim_dilog' + (index)}
                                                        bind:value={data.dialog}
                                                        on:change= {(event) => updateXmlValue(event, index, "", "setTabDialog")}
                                                    />
                                                </div>
                                            </div>
                                            <div class="form-group row mb-2">
                                                <div class="input-group">
                                                    <label for={'anim_stepindex'+(index)} class="input-group-text" data-bs-toggle="tooltip" title={l.step_index} htmlFor={'anim_stepindex'+(index)}> {l.step_index} </label>
                                                    <input 
                                                        type="number" 
                                                        class="form-control" 
                                                        id= {'anim_stepindex' + (index)}
                                                        min="1" 
                                                        max={localstepData.length}
                                                        bind:value={data.guid}
                                                        on:change= {(event) => updateXmlValue(event, index, "", "setTabGuid")}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td align="center">
                                            <button on:click={(event) => {updateXmlValue(event, index, "", "deleteTab")}} data-bs-toggle="tooltip" title={l.delete} type="button" class="bg-white delete_button ms-auto text-white border-0 mt-1" tabindex="0" role="button" aria-pressed="false">
                                                <span class="icomoon-remove-2 s4 pointer text-dark"></span>
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </table>
                    </div>
                </div>
            {:else if state.tabvalue == 8} 
                <div class="mx-auto pt-2 row">
                    <div class="row">
                        <div class="col-6 m-auto">
                            <img 
                                alt = {sceneName}
                                id = "bgResult"
                                src = {(BGsrc && BGsrc.trim() != '') ? BGsrc : (curDomain + 'labs/insight/Images/bl.jpg')}
                                class="img-thumbnail w-100"
                            />
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-4 col-lg-4 col-sm-6 m-auto">
                            <input class="h" accept="image/png" type="file" id={"choiceimg" + sceneTemp} on:change={(e) => onChoiceImageSelect(e, sceneTemp)}/> 
                            <input
                                type="hidden"
                                bind:value={BGsrc}
                                id="result_img"
                                class="choice_image_upld"
                                on:click = {(event) => { updateXmlValue(event, sceneTemp, "", "BGupdate")}}
                                placeholder="Image Link"
                                aria-describedby="result_screen_img"
                            />
                            <button type="button" class="btn btn-dark w-100"
                                data-bs-toggle="tooltip"
                                title={l.image_size_txt}
                                on:click= {(event) => { updateXmlValue(event, sceneTemp, "", "trigerchoiceimage")}}
                            >
                                {l.result_bg}
                            </button>
                            <small id="result_screen_img" class="form-text text-center text-muted">
                                {l.result_info}
                            </small>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6 m-auto">
                            <div class="input-group">
                                <label class="input-group-text" for='result_title' data-bs-toggle="tooltip" title={l.enter_result_title}>{l.result_title}</label>
                                <input
                                    type="text"
                                    class = "form-control"
                                    placeholder = {l.title}
                                    id='result_title'
                                    bind:value={resultTitle}
                                    on:change={ (event) => {updateXmlValue(event, sceneTemp, "", "titleUpdate")}}
                                />
                            </div>
                            <small id="result_screen_img" class="form-text text-muted text-center font14">{l.result_btn_info}</small>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
    
</div>
<style>
    .scene_image {
        width: 32%;
        margin: 5px 0;
        padding: 5px;
    }

    .choiceimage {
        height: 225px;
    }

    .image_view {
        height: 70%;
        min-height: 100px;
    }

    .choose_btn {
        padding: 2px 20px;
    }

    .stmnt_img {
        height: 228px;
        border: 1px solid;
        margin: 0 auto;
    }

    .commu_textarea {
        padding: 10px;
        height: 261px;
        max-height: 261px;
        overflow-y: scroll;
        font-size: 14px !important;
    }

    .min_height_300 {
        min-height: 300px;
    }

    .icon_setup {
        top: 3px;
        right: 10px;
    }

    .tabbutton:hover {
        box-shadow: 0 0 0 .2rem rgba(135,135,135,.5)!important;
    }
</style>