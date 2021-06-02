<!--
 *  File Name   : StepPreview.svelte
 *  Description : Responsible for StepPreview
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
    import MultilineboxPreview from './MultilineboxPreview.svelte';
    import TabPreview from './TabPreview.svelte';
    import ButtonPreview from './ButtonPreview.svelte';
    import LabelPreview from './LabelPreview.svelte';
    
    export let modules;
    export let containerID;
    export let uxml = '';
    export let checkImages;
    let step = modules;
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            step = []
            step[0] = modules;
        } else {
            step = modules;
        }
    } else {
        step = [];
    }
</script>
		
<div>
    {#if step && step.length > 0}
        {#each step as data, index}
            <div
                key={index}
                id={"dnd" + data._id}
                type="step"
                class="step dndTest"
                style="position: relative"
                data-ddisplay=""
                data-udisplay=""
                data-cdisplay=""
            >
                {#if data._bgimg}
					<img on:load={() => {checkImages(2)}} on:error={(e)=>{e.target.onerror = null; e.target.src="https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg}} src={window.inNative ? "____s3.amazonaws.com__jigyaasa_content_static__" + data._bgimg :"https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg} alt={data._alt}/>
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
                <MultilineboxPreview modules={((data.multilinebox) ? data.multilinebox : [])} containerID={containerID}  uxml={uxml}/>
                <TabPreview {checkImages} modules={((data.tab) ? data.tab : [])} containerID={containerID} />
                <ButtonPreview modules={((data.button) ? data.button : [])} containerID={containerID} />
                <LabelPreview modules={((data.label) ? data.label : [])} containerID={containerID} />
            </div>
        {/each}
    {/if}
</div>