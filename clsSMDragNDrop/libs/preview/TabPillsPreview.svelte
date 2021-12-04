<!--
 *  File Name   : TabpillsPreview.svelte
 *  Description : Responsible for TabpillsPreview
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

    export let modules;
    export let uxml = '';
    export let checkImages;
    let tab_pills_preview = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            tab_pills_preview = []
            tab_pills_preview[0] = modules;
        } else {
            tab_pills_preview = modules;
        }
    } else {
        tab_pills_preview = [];
    }
</script>
		
<div>
    {#if tab_pills_preview && tab_pills_preview.length > 0}
        <ul class="nav nav-pills margin-bottom dndTest" data-correctans="" data-userans="" data-defaultans="" role="tablist">
            {#each tab_pills_preview as data, index}
                <li key={"tab_pills_list_" + index} class="nav-item">
                    <a class={"nav-link" + ((data._display == "1") ? " active" :"")} href={"#dnd"+data._id} data-bs-toggle="pill" data-toggle="pill"  data-bs-target={"#dnd"+data._id} data-target={"#dnd"+data._id} >{data._value}</a>
                </li>
            {/each}
        </ul>
        <div class="tab-content dndTest" type="tab" style="position:relative">
            {#each tab_pills_preview as data, index}
                <div
                    key={"tab_pills_preview_" + index}
                    id={"dnd" + data._id} 
                    type="tab"
                    role="tabpanel"
                    class={"tab-pane " + ((data._display == "1") ? "active": "")}
                    data-correctans=""
                    data-userans=""
                    data-defaultans=""
                >
                    {#if data._bgimg}
                        <img on:load={() => {checkImages(2)}} src={(window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + data._bgimg} alt={data._alt} />
                    {/if}
                    <DragPreview modules={((data.drag) ? data.drag : [])}  />
                    <DropPreview modules={((data.drop) ? data.drop : [])}  uxml={uxml} />
                    <RadioPreview modules={((data.radio) ? data.radio : [])}  uxml={uxml} />
                    <SelectPreview modules={((data.select) ? data.select : [])}  uxml={uxml} />
                    <TextboxPreview modules={((data.textbox) ? data.textbox : [])}  uxml={uxml} />
                    <CheckboxPreview modules={((data.checkbox) ? data.checkbox : [])}  uxml={uxml} />
                    <TabheadPreview modules={((data.tabhead) ? data.tabhead : [])}  />
                    <HotspotPreview modules={((data.hotspot) ? data.hotspot : [])}  uxml={uxml}/>
                    <MenulistPreview modules={((data.menulist) ? data.menulist : [])}  />
                </div>
            {/each}
        </div>
    {/if}
</div>