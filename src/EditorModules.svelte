<script>
    import Drawer from '../helper/Drawer.svelte';
    import { Sidepanel } from 'svelte-mui/src';
    import {AH} from '../helper/HelperAI.svelte';
    import { flip } from 'svelte/animate';
    import { onMount, tick } from 'svelte';
    // export let enableClose;
    export let isAjax;
    export let onClose = false;
    export let openDrawer = false;
    export let goback;
    export let editorItems;
    export let actionData;
    export let newGroupList;
    export let newKeywordsList;
    export let ajaxData;
    let grid;
    let filters = [];
    onMount(async ()=> {
        initIsotope();
        AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body'});
    })

    function initIsotope() {
		setTimeout(function () {
			grid = new Isotope(document.querySelector('.grid'), {
				itemSelector: '.grid-item',
				layoutMode: 'fitRows',
				getSortData: {
					subtype: "[data-subtype]",
					group: "[data-group] parseInt",

				}
			});
			grid.arrange({
				sortBy: 'group',
				sortAscending: true
			});
		}, 100);
    }
    
    function handleItem(data, isReload) {
		if (from_myproject != 1) {
			AH.updateEditorUrl(data);
        }
        ajaxData = "";
		AI.set("editorActivated", false);
		actionData.content_icon = data.content_icon;
		actionData.type = data.type;
		actionData.loaditem = data.subtype;
        actionData.content_guid = '';
		actionData.itemXML = data.xml;
		actionData.inline_item = data.inline_item;
        actionData.is_algo = data.is_algo;
        actionData.editorKey += 1;
	}

	function handleItemAjax(data, isReload) {
		if (isReload) {
			if (data.action == "new") {
				if (from_myproject != 1) {
					AH.updateEditorUrl(data);
				}
				content_guid = "";
				ajaxData = "";
				AI.set('isAjax', false);
			}
		}
		AI.set("editorActivated", false);
		actionData.content_icon = data.content_icon;
		actionData.moduleType = data.type;
		actionData.type = data.type;
		actionData.loaditem = data.subtype;
		actionData.itemXML = data.xml;
        actionData.content_guid = '';
		actionData.inline_item = data.inline_item;
        actionData.is_algo = data.is_algo;
        actionData.editorKey += 1;
        actionData.drawerBox = false;
    }
    
    async function openFullMenu() {
		actionData.menuView = "main";
        actionData.assetBackColor = "#dddddd";
		actionData.mainBackColor = "#4c4c4c";
		actionData.fullMenu = true,
		actionData.sidePane = false;
        await tick();
    }
    
    function filterGroup(group) {
		AH.selectAll(".shortList", 'css', {backgroundColor: "#fff"});
		AH.select("#" + group, 'css', {backgroundColor: "#f3f3f3"});
		grid.arrange({
			filter: (group == "all_item") ? "*" : ("." + group)
		});
		closeFullMenu();
    }

    function filterAdvance(e) {
		grid.arrange({
			filter: function (_this) {
				if (e == "all") return true;
				if (_this.getAttribute("data-keywords")) {
					let keywords = _this.getAttribute("data-keywords").split(",");
					for (let i = 0; i < keywords.length; i++) {
						if (keywords[i].trim() == e) {
							return true;
						}
					}
				}
				return false;
			}
		});
		closeFullMenu();
	}
    
    function closeFullMenu() {
		actionData.sidePane = true;
		actionData.fullMenu = false;
    }
    
    function doSearch(e) {
		filters[0] = e.target.value;
		runFilter(filters[0]);
    }
    
    function runFilter(filters) {
		grid.arrange({
			filter: function (_this) {
				if (filters) {
					var qsRegex = new RegExp(filters, 'gi');
					if (!_this.querySelector('#itemTitle').textContent.match(qsRegex)) {
						return false;
					}
				}
				return true;
			}
		});
    }
    function menuView(view) {
		if (view == "main") {
			actionData.menuView = "main";
			actionData.mainBackColor = "#4c4c4c";
			actionData.assetBackColor = "#dddddd";
		} else if (view == "asset") {
			actionData.menuView = "asset";
            actionData.mainBackColor = "#dddddd";
            actionData.assetBackColor = "#4c4c4c";
        }
        
    }
    
    function onCloseBtn(enableClose, onClose) {
		if (enableClose) {
			onClose ? onClose(false) : (actionData.editorModalHandle = false);
		} else {
			author_area ? window.parent.close_frame_modal() : window.parent.editorClose();
		}
	}
</script>

<div
    style="
        background-color: #FFF;
        margin-left:56px;
        position: relative;
        bottom: 14px;
        overflow-x: hidden;
        padding-top: 14px;
    "
>
    <div class="col-lg-12 pr-1">
        <div
            class="badge badge-primary font-weight-normal pt-1 pull-right"
            id="item_status"
            style="
                font-size: 12px;
                letter-spacing: 1px;
                width: 38px;
                display: inline;
                height: 18px;
                font-family: 'PT Sans Caption', sans-serif;
                margin-top: 4px;
            "
        >V2.0</div>
        {#if enableClose == '1'}
        <button
            class="close"
            on:click={()=> onCloseBtn()}
            style ="
                position: absolute;
                z-index: 999;
                right: 0;
                margin: 12px;
                font-weight: 400;
                font-size: 42px;
            ">
            <span aria-hidden="true">×</span>
        </button>
        {/if} 
        <div class="mainArea isotope grid" style = "overflow: auto; height: 379px;">
            {#each editorItems as data, i (data.id)} 
                <div
                    key={i}
                    animate:flip
                    class={`${data.group} col-lg-4 grid-item padNull`}
                    style="height: {actionData.embed ? '130px' : '175px'}"
                    id="allEditorItem"
                    data-cy={'item'+ i}
                    on:click={()=> isAjax ? handleItemAjax(data) : handleItem(data)}
                    data-category={data.group}
                    data-type={data.type}
                    data-subtype={data.subtype}
                    data-group={data.grp_seq}
                    data-keywords={data.keywords}
                >
                    <div>
                        <div
                            id="itemTitle"
                            class="pull-left"
                            style="
                                font-size: 17px;
                                color: #4c4c4c;
                                width: 48%;
                                font-weight: 100;
                                textAlign: center;
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                            "
                        >
                            {data.title}
                        </div>
                        <div
                            id="itemLogo"
                            class="text-center pull-right pl-2"
                            style="
                                width: 50%;
                                position: absolute;
                                top: 50%;
                                right: 0;
                                transform: translateY(-50%);
                            "
                        >
                            <span class={data.icon} style="font-size: 67px;color: #4c4c4c;"></span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
{#if openDrawer}
    <Drawer
        width={59}
        on:close={()=> openDrawer = false}
        backdrop={false}
        closeByEsc={false}
    >
        <div slot="content">
            <div
                class="icomoon-search-2 text-center "
                style="
                    cursor: pointer;
                    font-size: 20px;
                    padding-top: 16px;
                    height: 51px;
                    min-height: 51px;
                    background-color: #4c4c4c;
                    color: #fff;
                "
                on:click={openFullMenu}
            >
            </div>
            <ul style="padding: 0;">
                {#each newGroupList as data, i (data.name)}
                    {#if (i <= 8) }
                        <li 
                            id={data.name}
                            class="shortList groupList"
                            on:click={filterGroup.bind(this, data.name)}
                            data-bs-toggle="tooltip"
                            title={data.title}
                            data-bs-placement="right"
                        >
                            <span class={data.icon} style="margin: auto; font-size: 20px;"></span>
                        </li >
                    {/if}
                {/each}
                <li
                    on:click={openFullMenu}
                    class="groupList"
                    data-bs-toggle="tooltip"
                    title="More"
                    data-bs-placement="right"
                >
                    <span class="icomoon-grid-2"></span>
                </li>
            </ul>
        </div>
    </Drawer>
{/if}
<Sidepanel left bind:visible={actionData.fullMenu}>
    <div>
        <div
            style="
                font-size: 20px;
                padding-left: 16px;
                height: 51px;
                background-color: #4c4c4c;
                width: 285px;
            "
        >
            <span
                class="icomoon-arrow-left-4"
                style="
                    text-align: left;
                    color: #fff;
                    font-size: 24px;
                    position: relative;
                    top: 14px;
                    padding-right: 9px;
                "
                on:click={closeFullMenu}
            ></span>
            <input
                type="text"
                placeholder={"Search Here"}
                style="
                    width: 236px;
                    height: 49px;
                    float: right;
                    margin-top: 1px;
                    border: 0;
                    font-size: 17px;
                    outline: 0;
                    padding: 7px;
                "
                on:input={doSearch}
            />
        </div>
        <ul style="list-style-type: none;padding: 0px;">
            <li class="text-light p-0" style="height: 37px;">
                <div 
                    class="float-left col-6 text-center py-2 border border-right border-top-0 border-left-0 border-bottom-0" 
                    style="background-color: {actionData.mainBackColor}; color: {actionData.assetBackColor};" 
                    on:click={()=> menuView("main")}
                > 
                    Item
                </div>
                <div 
                    class="float-right col-6 text-center py-2" 
                    style="background-color: {actionData.assetBackColor}; color: {actionData.mainBackColor};" 
                    on:click={()=> menuView("asset")}
                >
                    Asset
                </div>
            </li>
            {#if actionData.menuView == "main" }
                {#each newGroupList as data, i }
                    <div class="listHover" key={i}>
                        <li
                            on:click={()=> filterGroup(data.name)}
                            style="cursor: pointer; text-align:left; padding: 15px 10px;"
                        >
                            <span style="padding-right: 15px; font-size: 20px;" class={data.icon}></span>
                            <span>{data.title}</span>
                        </li>
                        <hr style="margin:0;"/>
                    </div>
                {/each}
            {:else if actionData.menuView == "asset" }
                {#each newKeywordsList as data2, j }
                    <div class="listHover" key={j}>
                        <li
                            on:click={()=> filterAdvance(data2.name)}
                            style="cursor: pointer; textTransform: capitalize; padding: 15px 19px;"
                        >
                            <span style="padding-right: 15px; font-size: 20px;" class={data2.icon}></span>
                            <span>{data2.title.replace("_", " ")}</span>
                        </li>
                        <hr style="margin:0;"/>
                    </div>
                {/each}
            {/if}
        </ul>
    </div>
</Sidepanel>


<style>
	.padNull {
        cursor: pointer;
        width: 280px;
        margin: 15px;
        background-color: #fff;
        border-radius: 3px;
        border: 2px solid #000;
        box-shadow: rgb(76, 76, 76) 1px 6px 10px;
    }
    .groupList {
        text-align: center; 
        cursor: pointer; 
        padding-top: 16px; 
        height: 54px;
        border: 1px solid #ccc;
        border-top: none;
    }
    :global(.side-panel) {
        width: 295px !important;
    }
</style>