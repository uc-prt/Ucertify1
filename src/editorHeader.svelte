<script>
    /**
     *  File Name   : editorHeader.svelte
     *  Description : Header for Editor area
     *  Author      : Pradeep Yadav
     *  Version     : 1.2
     *  Package     : svelte_items/svelte
     *  Created     : 30 Feb 2021
     *  Updated By  : Prabhat Kumar<prabhat.kumar@ucertify.com>
     *  Updated Date: 12-May-2021
     */
    import { Menu, Menuitem, Button, Sidepanel } from 'svelte-mui/src';
    import {editorConfig} from './EditorConfig.svelte';
    import {AH} from '../helper/HelperAI.svelte';
    import { onMount, tick } from 'svelte';
    export let editorState;
    export let itemHelper;
    export let handleModal;
    export let updateEditorModule;
    export let toolMenu;
    export let handleCheckbox;
    export let editAlgo;
    export let solveVariable;
    export let analyzeVariable;
    export let toggleRemediation;
    export let l;
    let deviceIframeContainer = ["background:url(" + editor.baseUrlTheme + "svelte_items/images/mobile.svg);width:370px;height:707px;margin:0 auto;padding: 105px 5px;", "background:url(" + editor.baseUrlTheme + "svelte_items/images/tab.svg);width:871px;height:1242px;margin:0 auto;padding: 105px 5px;"];
	let deviceIframeProperty = ["overflow: auto;height: 500px;background: #fff;padding:0 10px;margin-left:2px;", "overflow: auto;height: 1045px;background: #fff;padding:0 10px;margin-left:2px;"];
    let openGudids;
    let editorRouter = [];
    let modal = {
			header  : [],
			body    : [],
			footer  : [],
			width   : 300,
		};
    let isNew = window.frameElement ? AH.url(window.frameElement.src) : false;
    let editorUrl = AH.url();
    let guid_group = [];
    let itemDetails = {};
    let currentGuid = "";
    let editorSeq = 0;
    let totalItem = 0;
    let listDrawer = false;

    onMount(async()=> {
        editorUrl = new URLSearchParams(window.location.href);
        itemDetails = editorConfig.getItemDetails();
        await tick();
        if (editorUrl.get('router_guid')) {
            guid_group = editorUrl.get('router_guid').split(',');
        } else {
            guid_group = editorUrl.get('content_guid');
        }
        currentGuid =  editorUrl.get('content_guid');
        editorSeq = currentGuid ? guid_group.indexOf(currentGuid) : 0;
        totalItem = editorUrl.get('router_guid') ? guid_group.length : 1;
    })

    function closeEditor() {
        if (!AH.get('save_item')) {
            let saved = AH.isValid(AH.get('save_response')) ? AH.get('save_response') : false;
            // Specific to Unity 
            let authFrame = document.getElementById("authoringFrame");
            if (authFrame && typeof authFrame.contentWindow.responsiveVoice !== 'undefined' && typeof authFrame.contentWindow.pauseVoice != 'undefined') {
                authFrame.contentWindow.pauseVoice();
            }
            if (window.parent.editorClose) {
            window.parent.editorClose(saved);
            } else {
            window.parent.close_frame_modal(saved);
            }
        } else {
            AH.set("unSavedProjectData", true);
            editorState.saveDialog = true;
        }
    }

    export function onItemListButton() {
        if (!AH.get('listUpdate')) {
            AH.activate(1);
            loadRouterGuids().then((res)=> {
                listDrawer =  res;
                AH.activate(0);
            });
        } else {
            listDrawer = true;
        }
    }

    function loadRouterGuids() {
        return new Promise((resolve)=> {
            let group_guids = getQueryString('router_guid') ? getQueryString('router_guid') : getQueryString('content_guid');
            AH.ajax({
                url: baseUrl + 'editor/index.php',
                data: { ajax: "1", action: 'get_router_guids', group_guids: group_guids },
            }).then((response)=> {
                try {
                    editorRouter = JSON.parse(response);
                    openGudids = editorUrl.get('router_guid') ? editorUrl.get('router_guid') : editorUrl.get('content_guid');
                    openGudids = openGudids.replace('#', '');
                    openGudids = openGudids ? openGudids.split(",") : [];
                } catch (e) {
                    console.log(e);
                    editorRouter = [];
                }
                AH.set("listUpdate", true);
                resolve(true);
            });
        })
    }

    function loadSelectedItem(data) {
        if (getQueryString('router_guid')) {
            checkNavigation("click", data);
        }
    }

    async function onListButton(event) {
        AH.getBS(event.target, 'Tooltip').hide?.();
        await tick();
      if (!AH.get('save_item')) {
        goBack();
      } else {
        AH.set("unSavedBack", true);
        editorState.saveDialog = true;
      }
    }

    export function checkNavigation(action, data) {
        if (!editorUrl.get('router_guid')) {
            return false;
        }
        if (!AH.get('save_item')) {
            navigate(action, data);
        } else {
            AH.set("unsavedSata", true);
            AH.set('router_action', action);
            AH.set('router_data', data);
            AH.set('moveAction', action ? "Next" : "Previous");
            editorState.saveDialog = true;
        }
    }

    function navigate(action, data) {
        let currentSelected = editorSeq;
        currentGuid = editorUrl.get('content_guid');
        AH.set('moveAction', false);
        if (action) {
            if (action == "click") {
                currentSelected = guid_group.findIndex((item)=> item == data.content_guid);
            } else {
                if ((currentSelected + 1) == guid_group.length) {
                    AH.showmsg("Editor is on last item.");
                    return ;
                } else {
                    currentSelected = currentSelected + 1;
                }
            }
        } else {
            if (currentSelected > 0) {
                currentSelected =  currentSelected - 1;
            } else {
                AH.showmsg("Editor is on first item.");
                return;
            }
        }
        currentGuid = guid_group[currentSelected];
        editorUrl.set('content_guid', currentGuid);
        if (editorUrl.get('get-diff') == 1) {
            editorUrl.delete('get-diff');
            editorUrl.delete('version_date');
            editorUrl.delete('from_draft');
        }
        AH.toggleDom(window.parent.document.querySelector('.load_data'), 'show');
        window.location = decodeURIComponent(editorUrl.toString());
    }
    function showContext() {
        AH.activate(1);
        AH.ajax({
            url: baseUrl + 'editor/index.php',
            data: { ajax: "1", action: 'get_parent_context', cource_code: editor.course, content_guid: (parent2 || parent1), show_all: (parent2 ? 0 : 1) },
        }).then((response)=> {
            modal = {
                header  : {
                    body: '<div>Parent Context</div>',
                    class: "editor_modal_title"
                },
                body    : {
                    body: response,
                    class: "editor_modal_content",
                    style: "height: 400px"
                },
                footer  : {
                    body: [],
                    class:"editor_modal_action"
                },
                width: 500,
            };
            AH.activate(0);
            handleModal(modal);
        });
    }

    function  showItemMeta() {
        if (AH.get('current_item_icon')) {
            AH.set("current_item_icon",  editorState.content_icon);
        }
        AH.activate(2);
        AH.ajax({
            url: baseUrl + 'editor/index.php',
            data: { 
                ajax: "1", 
                action: 'get_item_meta', 
                cource_code: editor.course, 
                content_guid: editorState.guid,
                content_id: editorState.propsAjaxData.content_id,
                content_icon: editorConfig.getItemDetails(editorState.content_type, editorState.item),
                current_icon_data: editorConfig.getItemDetails(editorState.content_type, editorState.item, editorState.content_icon),
                show_icon: editorState.viewConfig.showItemMetaIcon ? 1 : 0,
                draft: editorState.draft,
            },
        }).then((response)=> {
            modal = {
                header  : {
                    body: '<div>Item Information</div>',
                    class: "editor_modal_title"
                },
                body    : {
                    body: response,
                    class: "editor_modal_content",
                    style: "height: auto;"
                },
                footer  : {
                    body: [{label: 'Update', class: "inf_update_btn bg-primary text-white", style: "display: none;", onAction: ()=> updateItemInfData()}],
                    class:"editor_modal_action"
                },
                width: 520,
            };
            AH.activate(0);
            handleModal(modal);
		});
    }

    AH.listen(document,'change','#cong_level',function(_this) {
        updateItemInfData(_this);
    })


    function updateItemInfData(item) {
        if (item) {
            if (item.getAttribute('icon')) {
                AH.removeClass(".item_icon_list .active", 'active');
                AH.addClass(item, "active");
            } else if (item.id == "cong_level") {
                AH.set("cong_level", item.value);
            } else {
                item.setAttribute('contentEditable', true);
            }
            AH.select(".inf_update_btn").style.display = "inline-block";
        } else {
            AH.activate(2);
            let queryData = { 
                ajax: "1", 
                action: 'update_editor_item_inf', 
                content_guid: AH.get('current_guid'),
                ref_id: AH.select(".item_ref_id").textContent,
                isDraft: AH.get('draft'),
                content_icon:  AH.get("current_item_icon"),
                cong_level: AH.get("cong_level"),
                course: editor.course,
                anno_id: AH.select("#cong_level").getAttribute('annoid')
            };
            AH.ajax({
                url: baseUrl + 'editor/index.php',
                data: queryData
            }).then((response)=> {
                    AH.activate(0);
                    if (response == 1) {
                        AH.showmsg("Data updated successfully.");
                    } else {
                        AH.showmsg("Updation failed.");
                    }
            });
        }
    }


    function handleHelp(type) {
        let videoUrl = "";
        if (type == "editor") {
            videoUrl = editorConfig.editorVideo(editorState);
        } else if (itemHelper.UI && itemHelper.UI.helpVideo) {
            videoUrl = (typeof itemHelper.UI.helpVideo == "object") ? itemHelper.UI.helpVideo[editorState.content_icon] : itemHelper.UI.helpVideo; 
        }
        let videoHtml = videoUrl ? `<video src="${videoUrl}&amp;profile_id=174" controls height="100%" width="100%" height="100%" width="100%" autoplay />` : 'Help video not available for this item.';
        modal = {
            header  : {
                body: (type == "editor") ? "Editor Help Video" : "Item Help Video",
                class: "editor_modal_title"
            },
            body    : {
                body: videoHtml,
                class:"editor_modal_content", 
                style: "width:669px",
            },
            footer  : {
                body: [],
                class:"editor_modal_action"
            },
            width: 700,
        };
        handleModal(modal);
    }

    export function callPendingAction() {
        if (from_myproject == 1 && AH.get('unSavedProjectData')) {
            AH.set("unSavedProjectData", false);
            if (window.parent.close_frame_modal) {
                window.parent.close_frame_modal();
            } else {
                window.parent.editorClose();
            }
        } else if (AH.get("unSavedBack")) {
            AH.set("unSavedBack", false);
            goBack();
        } else if (AH.get('moveAction') && editorUrl.get('router_guid'))  {
            navigate(AH.get('router_action'), AH.get('router_data'));
        }
    }

    function goBack() {
		let urlVars = AH.getUrlVars();
		let func = urlVars["func"];
		let action = urlVars["action"];
		let directNavigate = (urlVars['content_subtype'] && urlVars['content_type']) ? 1 : 0;
		if ((func && func == "navigate_items") || (action && action == "edit") || directNavigate == 1) {
			if (urlVars["from_myproject"] == 1) {
				window.location.href = baseUrl + "editor/?action=new&no_header=1$from_myproject=1&in_frame=1&in_full_preview=1&is_overlay=1";
			} else {
				//window.location.href = baseUrl + "editor/?action=new&no_header=1";
                //this.props.editorParent("addNew");
                updateEditorModule("", "", "addNew");
			}
		} else {
			setTimeout(function () { editorState.myComponent = "back"; }, 200);
			state.myComponent = "blank";
		}
	}

    function handleKeyboardShortcut() {
        modal = {
            header  : {
                body: l.keyboard_shortcut,
                class: "editor_modal_title"
            },
            body    : {
                body: editorConfig.keyboardShortcutLayout(),
                class: "editor_modal_content", 
                style: "height:300px;"
            },
            footer  : {
                body: [],
                class:"editor_modal_action"
            },
            width: 500,
        };
        handleModal(modal);
    }

    function createVariableCall() {
        if (editorState.variable_button) {

        } else {

        }
    }
	function toggleDevice(deviceName) {
		let arrIndex = '';
		if (deviceName == "mobile")
			arrIndex = 0;
		else if (deviceName == "tab")
			arrIndex = 1;
		else {
			AH.select("#previewSection").setAttribute('style', "overflow-x: auto; padding-bottom: 15px;");
			AH.select("#layoutMode").setAttribute('style', "");
			return;
		}
		AH.select("#previewSection").setAttribute('style', deviceIframeContainer[arrIndex]);
		AH.select("#layoutMode").setAttribute('style', deviceIframeProperty[arrIndex]);
	}	
</script>


<div>
    <div 
    id="top"
    style="
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 99;
    "
    >
        <header
            style="
                background-color: #fff; 
                height: 45px;
            "
            class="navbar-light navbar-fixed-top fixed-top"
        >
            <div
                id="left_header"
                class="float-left text-dark"
                style="
                    display: flex; 
                    color: #212529 !important;
                "
            >
                <div 
                    id="ucheader_logo" 
                    class="text-center height44 uclogo width160" 
                    aria-hidden="true"
                >
                    <div id="editor-header-logo" >
                        <img
                            src={window.baseUrl + "layout/themes/bootstrap4/images/logo/ucertify_logo.png"}
                            id="editor-header-img"
                            width="160"
                            height="44"
                            alt="uCertify Editor"
                            header-logo = "1"
                        />
                    </div>
                </div>
                <div>
                    <Menu origin="top left">
                        <div slot="activator">
                            <Button id="icon_menu" ripple={false} class="tools_btn" style="margin-top:4px;">
                                <span>Tools</span>
                            </Button>
                        </div>
                        {#each toolMenu as menuData, i (menuData.id)}
                            {#if menuData.view}
                                <Menuitem key={menuData.id} on:click={()=>menuData.funcName()} class="font15">{menuData.label}</Menuitem>
                            {/if}
                        {/each}
                        {#if editorState.variable_button}
                            <Menuitem key="ditAlgo" on:click={editAlgo} class="font15">Edit Algorithmic</Menuitem>
                        {:else}
                            <Menuitem key="toggleAlgo" on:click={handleCheckbox} class="font15">Show Algorithmic</Menuitem>
                        {/if}
                        {#if editorState.variable_button}
                            <div class="algo_controls" >
                                <Menuitem key="solve_algo" on:click={solveVariable} class="font15">
                                    Solve Variables
                                </Menuitem>
                                <Menuitem on:click={analyzeVariable} class="font15">
                                    Analyze Variables
                                </Menuitem>
                                <Menuitem on:click={()=> {editorState.variable_button = false }} class="font15">
                                    Remove Algorithmic
                                </Menuitem>
                            </div>
                        {/if}
                    </Menu>
                </div>
                <div
                    class="device_btn text-center"
                    id="device_btn"
                    style="
                        display: none;
                        fontSize: 20px;
                        color: #000;
                    "
                >
                    <Button
                        size="small"
                        data-bs-original-title="Desktop View"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        style="background-color: transparent; height:44px;"
                        on:click={toggleDevice.bind(this, "desktop")}
                    >
                        <span
                            class="responsiveBtn icomoon-laptop font18"
                            id="desktop_btn"
                            style="cursor: pointer; color: #000;"
                        ></span>
                    </Button>
                    <Button
                        size="small"
                        data-bs-original-title="Tablet View"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        style="background-color: transparent; height:44px;"
                        on:click={toggleDevice.bind(this, "tab")}
                    >
                        <span
                            class="responsiveBtn icomoon-tablet font18"
                            id="tab_btn"
                            style="cursor: pointer; color: #000"
                        ></span>
                    </Button>
                    <Button
                        size="small"
                        data-bs-original-title="Mobile View"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        style="background-color: transparent;height:44px;"
                        on:click={toggleDevice.bind(this, "mobile")}
                    >
                        <span
                            class="responsiveBtn icomoon-mobile font18"
                            id="mobile_btn"
                            style="cursor: pointer; color: #000"
                        ></span>
                    </Button>
                </div>
                <div class="toolbar_contain" id="toolbar_container" style="margin-top: 7px;"></div>
            </div>
            <div
                id="right_header"
                class="float-right"
                style="display: flex; bottom: 4px; padding-right: 13px; margin-top: 7px"
            >
                {#if editorState.viewConfig.isQuestion  && editorState.editorView == "preview"}
                    <div
                        style="
                            position: relative; 
                            height: 30px;
                            display: flex;
                        "
                    >
                        {#if editorState.viewConfig.isFullMode} 
                            <div id="externalToggleDiv">
                                <div
                                    id="answerCheck"
                                    class="px-2 py-1 pointer r-sm position-relative mr-2"
                                    data-bs-original-title="Remediation"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    style="fontSize: 13px; top: 1px;cursor: pointer;"
                                >
                                    {"Check Answer"}
                                </div>  
                            </div>
                        {:else}
                            <div
                                id="remedToggle"
                                class="position-relative text-dark pr-1"
                                style="height: 34px; font-size:16px;"
                            >
                                <div class="form-check form-switch">
                                    <label 
                                        class="form-check-label mt-1" 
                                        for="flexSwitchCheckChecked"
                                        style="cursor: pointer;text-align: right;width:93px;"
                                    >
                                        <input 
                                            class="form-check-input mt-2 pe-none" 
                                            type="checkbox" 
                                            id="flexSwitchCheckChecked" 
                                            style="position:absolute;bottom:4px;"
                                            on:click={toggleRemediation}
                                        >
                                        Review
                                    </label>
                                </div>
                            </div>
            
                        {/if}
                    </div>
                {/if}
                <div
                    class="badge badge-secondary font-weight-normal pt-1 pointer"
                    id="show_guid"
                    data-bs-placement="bottom"
                    style="
                        font-size: 14px;
                        letter-spacing: 1px;
                        width: fit-content;
                        display: {editorState.guid ? 'inline' : 'none'};
                        height: 23px;
                        font-family: 'PT Sans Caption', sans-serif;
                        margin-top: 4px;
                    "
                >{editorState.guid}</div>
                <div
                    class="badge badge-info font-weight-normal pt-1"
                    id="item_status"
                    style="
                        font-size: 14px;
                        letter-spacing: 1px;
                        width: fit-content;
                        display: {editorState.guid ? 'inline' : 'none'};
                        height: 23px;
                        font-family: 'PT Sans Caption', sans-serif;
                        margin-top: 4px;
                        margin-left: 3px;
                    "
                >{editorState.draft == "1" ? "Draft" : "Published"}</div>
                <div
                    class="badge badge-primary font-weight-normal pt-1"
                    id="item_status"
                    style="
                        font-size: 14px;
                        letter-spacing: 1px;
                        width: fit-content;
                        display: inline;
                        height: 23px;
                        font-family: 'PT Sans Caption', sans-serif;
                        margin-top: 4px;
                        margin-left: 3px;
                    "
                >V2.0</div>
                {#if window.frameElement}
                    <button
                        type="button"
                        class="auto ml m-t-n-sm btn p-0 bg-transparent height44"
                        title="Close"
                        data-bs-toggle="tooltip"
                        tabIndex="0"
                        data-bs-placement="bottom"
                        on:click={closeEditor}
                        id="editor_close"
                    >
                        <span class="icomoon-close s3"></span>
                    </button>
                {/if}
            </div>
        </header>
    </div>
    <footer
        style="
            background-color: #e9ecef; 
            height: 48px;
            left : unset;
            border-radius: 5px;
            right: 40px;
            padding-right: 8px;
            padding-left: 8px;
            border: 1px solid #ccc;
        "
        class="navbar-light navbar-fixed-bottom fixed-bottom"
    >
        <div
            id="right_footer"
            class="float-right footer_box"
        >
            {#if ((getQueryString('router_guid') || getQueryString('content_guid'))) }
                <button
                    id="list_button"
                    type="button"
                    tabIndex="0"
                    class="auto bg-transparent pointer"
                    title="Item List"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    on:click={onItemListButton}
                >
                    <span class="icomoon-dragselect s3"></span>{"List"}
                </button>
            {/if}
            {#if (window.from_myproject != 1 || (isNew && isNew.get('show_add_new_button') == 1) ) } 
                  <button
                      id="back_editor_button"
                      type="button"
                      tabIndex="0"
                      class="auto bg-transparent ie_back_btn pointer text-truncate"
                      title="Add New"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      on:click={onListButton}
                  >
                      <span class="icomoon-list-plus-new s3"></span>{"Add New"}
                  </button>
            {/if}
            <div>
                <button
                    type="button"
                    class="auto bg-transparent save_xml_btn r-sm"
                    title="Save Content"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    id="save_xml"
                    tabIndex="0"
                    style="paddingRight: 0px"
                >
                    <span class="icomoon-24px-save-3 s3"></span>Save
                </button>
                <div class="btn-group" role="group" style="margin-left: -18px;">
                    <button 
                        id="save_xml_new" 
                        title="Save as new"
                        type="button"
                        class="btn bg-transparent dropdown-toggle" 
                        action="none"
                        data-bs-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="false"
                        tabIndex="0"
                        style="paddingLeft: 10px; margin-top: 0; vertical-align: bottom"
                    >
                    </button>
                    <div class="dropdown-menu" aria-labelledby="save_xml_new">
                        <Menuitem class="save_xml_btn dropdown-item vertical-center" action="save_as">
                            <span class="icomoon-24px-save-as-3 mr-sm"></span>Save As
                        </Menuitem>
                    </div>
                </div>
            </div>
            <button
                id="previousBtn"
                tabIndex="0"
                type="button"
                class="btn_design backbtncomp r-sm bg-transparent"
                data-bs-original-title="Previous"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                on:click={()=> checkNavigation(false)}
            >
                <span style="bottom:0;" class="text-truncate">Previous</span><span class="icomoon-24px-previous" style="bottom:-1px"></span>
            </button>
            <button
                id="counterButton"
                type="button"
                tabIndex="0"
                class="btn_design backbtncomp r-sm bg-transparent text-truncate"
                data-bs-original-title="Current Item Sequence"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                style="padding: 0"
            >
                <span class="">{(editorSeq + 1)} of {totalItem}</span>
            </button>
            <button
                id="nextBtn"
                type="button"
                tabIndex="0"
                class="btn_design backbtncomp r-sm bg-transparent text-truncate"
                data-bs-original-title="Next"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                on:click={()=> checkNavigation(1)}
            >
                <span class="icomoon-24px-next" style="bottom:-1px;"></span>Next
            </button>
            {#if editorState.guid.length > 4 }
                <div>
                    <button
                        id="infoButton"
                        type="button"
                        tabIndex="0"
                        class="btn_design backbtncomp r-sm bg-transparent"
                        data-bs-placement="bottom"
                        data-bs-toggle="dropdown"
                    >
                        <span class="icomoon-info s3"></span>Info
                    </button>
                    <ul class="dropdown-menu dropdown-menu-left info_controls">
                        {#if editorState.viewConfig.isQuestion && (window.from_myproject == 1 || window.from_ebook == 1)}
                            <Menuitem on:click={showContext}>
                                <span>
                                    <span class="icomoon-newspaper mr-sm"></span>
                                    Context
                                </span>
                            </Menuitem>
                        {/if}
                        <Menuitem on:click={showItemMeta}>
                            <span>
                                <span class="icomoon-globe-2 mr-sm"></span>
                                Item Details
                            </span>
                        </Menuitem>
                    </ul>
                </div>
            {/if}
            <div>
                <button
                    id="helpButton"
                    type="button"
                    tabIndex="0"
                    class="btn_design backbtncomp r-sm bg-transparent"
                    data-bs-placement="top"
                    data-bs-toggle="dropdown"
                >
                    <span class="icomoon-help s3"></span>Help
                </button>
                <ul class="dropdown-menu dropdown-menu-left help_controls">
                    <Menuitem on:click={handleHelp}>
                        <span>
                            <span class="icomoon-24px-help-video mr-sm"></span>Help Video
                        </span>
                    </Menuitem>
                    <Menuitem on:click={handleKeyboardShortcut}>
                        <span>
                            <span class="icomoon-accessibility mr-sm"></span>
                            Accessibility
                        </span>
                    </Menuitem>
                    <Menuitem on:click={()=> handleHelp('editor')}>
                        <span>
                            <span class="icomoon-24px-help-video mr-sm"></span>
                            Editor Video
                        </span>
                    </Menuitem>
                </ul>
            </div>
        </div>
    </footer>
</div>
<Sidepanel left bind:visible={listDrawer}>
    <div
        style="
            font-size: 20px;
            height: 51px;
        "
    >
        <ul class="nav nav-pills m-0">
            <li class="nav-item">
                <a class="text-dark nav-link active" href={"javascript:void(0);"}>
                    <span class="icomoon-toc-sm align-middle mr-sm s3"></span>
                    Items
                </a>
            </li>
        </ul>
        <ul style="padding: 0;">
            {#if openGudids}
                {#each openGudids as guidSeq}
                    <Menuitem
                        id={"seq_" + guidSeq}
                        class="shortList border-bottom"
                        on:click={loadSelectedItem.bind(this, editorRouter[guidSeq])}
                        style="cursor: pointer; font-size: 15px; background:  {(guidSeq == currentGuid) ? '#e9ecef': 'none'}"
                    >
                        <span class="text-truncate">
                            <span 
                                style="margin-right: 3px;" 
                                class="font16 position-relative m-r-xxs {itemDetails[editorRouter[guidSeq].content_type][editorRouter[guidSeq].content_subtype].icon || 'icomoon-all-items-2'} sidepaneIcon top2" 
                            ></span>
                            {editorRouter[guidSeq].snippet}
                        </span>
                        
                    </Menuitem>
                {/each}
            {/if}
        </ul>
    </div>
</Sidepanel>