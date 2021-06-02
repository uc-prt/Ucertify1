<!--
 *  File Name   : Step.svelte
 *  Description : Responsible for Step
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (authoring)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>    
    import Button from './Button.svelte';
    import Checkbox from './Checkbox.svelte';
    import Drag from './Drag.svelte';
    import Drop from './Drop.svelte';
    import Hotspot from './Hotspot.svelte';
    import Img from './Img.svelte';
    import Label from './Label.svelte';
    import Menulist from './Menulist.svelte';
    import Multilinebox from './Multilinebox.svelte';
    import Radio from './Radio.svelte';
    import Select from './Select.svelte';
    import Tab from './Tab.svelte';
    import Tabhead from './Tabhead.svelte';
    import Textbox from './Textbox.svelte';
        
    export let modules;
    export let index = 0;
    export let deleteElem;
    export let elemModal;
    export let checkImageStatus;
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
		

{#if step && step.length > 0}
    <div key={"step_" + index + step.length}>
        {#each step as data, index}
            <div
                key={index}
                id={data._id}
                type="step"
                class="step"
                style="position: relative"
            >
                <div class="btn-group tools" data-type="step" data-t="step"><button type="button" on:click={(event) => elemModal('step', event.currentTarget, data._id)} class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></button></div>
                
                {#if data._bgimg}
					<img src={"https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg} on:load={()=> {checkImageStatus(1)}} alt={data._alt}/>
                {/if}

                <Drag index={10} modules={((data.drag) ? data.drag : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Drop index={10} modules={((data.drop) ? data.drop : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Radio index={10} modules={((data.radio) ?data.radio : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Select index={10} modules={((data.select) ?data.select : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Textbox index={10} modules={((data.textbox) ?data.textbox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Multilinebox index={10} modules={((data.multilinebox) ?data.multilinebox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Checkbox index={10} modules={((data.checkbox) ? data.checkbox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Button index={10} modules={((data.button) ? data.button : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Tabhead index={10} modules={((data.tabhead) ? data.tabhead : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Img index={10} modules={((data.img) ? data.img : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Label index={10} modules={((data.label) ? data.label : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Hotspot index={10} modules={((data.hotspot) ? data.hotspot : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Menulist index={10} modules={((data.menulist) ? data.menulist : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                <Tab index={10} modules={((data.tab) ? data.tab : "")} elemModal = {elemModal} deleteElem = {deleteElem} {checkImageStatus}/>
            </div>
        {/each}
    </div>
{/if}