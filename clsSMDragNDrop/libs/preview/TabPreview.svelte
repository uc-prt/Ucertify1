<!--
 *  File Name   : TabPreview.svelte
 *  Description : Responsible for TabPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import DragPreview from './DragPreview.svelte';
    import DropPreview from './DropPreview.svelte';
    import RadioPreview from './RadioPreview.svelte';
    import SelectPreview from './SelectPreview.svelte';
    import TextboxPreview from './TextboxPreview.svelte';
    import CheckboxPreview from './CheckboxPreview.svelte';
    import TabheadPreview from './TabheadPreview.svelte';
    import HotspotPreview from './HotspotPreview.svelte';
    import MenulistPreview from './MenulistPreview.svelte';
    import TabPillsPreview from './TabPillsPreview.svelte';

    export let modules;
    export let containerID;
    export let uxml = '';
    export let checkImages;
    let tab_preview = modules;

    $ : if (modules) {
        if (Array.isArray(modules) == false) {
            tab_preview = []
            tab_preview[0] = modules;
        } else {
            tab_preview = modules;
        }
    } else {
        tab_preview = [];
    }
</script>
		
<div>
    {#if tab_preview && tab_preview.length > 0}
        <ul class="nav nav-tabs margin-bottom dndTest mt-3" data-correctans="" data-userans="" data-defaultans="">
            {#each tab_preview as data, index}
                <li key={"tab_list_" + index} class="nav-item">
                    <a href={"#dnd"+data._id} data-bs-target={"#dnd" + data._id} data-bs-toggle="tab" class={((data._display == "1")?" active nav-link":" nav-link")}>{data._value}</a>
                </li>
            {/each}
        </ul>
        <div class="tab-content dndTest" type="tab" style="position:relative">
            {#each tab_preview as data, index}
                <div
                    key={"tab_preview_" + index}
                    id={"dnd" + data._id} 
                    role="tabpanel"
                    type="tab"
                    class={"tab-pane " + ((data._display == "1") ? "active": "")}
                    data-correctans=""
                    data-userans=""
                    data-defaultans=""
                >
                    {#if data._bgimg}
                        <img on:load={() => {checkImages(2)}} src={(window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + data._bgimg} alt={data._alt} />
                    {/if}
                    <DragPreview modules={((data.drag) ? data.drag : [])} containerID={containerID} />
                    <DropPreview modules={((data.drop) ? data.drop : [])} containerID={containerID} uxml={uxml} />
                    <RadioPreview modules={((data.radio) ? data.radio : [])} containerID={containerID} uxml={uxml} />
                    <SelectPreview modules={((data.select) ? data.select : [])} containerID={containerID} uxml={uxml} />
                    <TextboxPreview modules={((data.textbox) ? data.textbox : [])} containerID={containerID} uxml={uxml} />
                    <CheckboxPreview modules={((data.checkbox) ? data.checkbox : [])} containerID={containerID} uxml={uxml} />
                    <TabheadPreview modules={((data.tabhead) ? data.tabhead : [])} containerID={containerID} />
                    <HotspotPreview modules={((data.hotspot) ? data.hotspot : [])} containerID={containerID} uxml={uxml}/>
                    <MenulistPreview modules={((data.menulist) ? data.menulist : [])} containerID={containerID} />
                    <TabPillsPreview modules={((data.tab) ? data.tab : [])} {checkImages} uxml={uxml}/>
                </div>
            {/each}
        </div>
    {/if}
</div>