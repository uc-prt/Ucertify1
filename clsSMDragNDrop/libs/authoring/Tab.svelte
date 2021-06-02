<!--
 *  File Name   : Tab.svelte
 *  Description : Responsible for Tab
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
    import Tabhead from './Tabhead.svelte';
    import Textbox from './Textbox.svelte';
    import { onMount } from 'svelte';
    import Tabpills from './Tabpills.svelte';
    export let modules;
    export let index = 0;
    export let deleteElem;
    export let elemModal;
    export let checkImageStatus;
    var tab_preview = modules;
    $: if (modules) {
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
		

{#if tab_preview && tab_preview.length > 0}
    <div key={"tab_" + index + tab_preview.length}>
        <ul class="nav nav-tabs margin-bottom mt-3 px-2">
            {#each tab_preview as data, index}
                <li for={data._id} key={"tab_list_" + index} class="tbhead nav-item">
                    <a href={"#"+data._id} data-bs-target={"#"+data._id} data-bs-toggle="tab" class={((data._display == "1")?" active nav-link":" nav-link")}>{data._value}</a>
                    <div 
                        class="btn-group tools tabTools h" 
                        data-t="label"
                    >
                        <button type="button" on:click={(event)=> elemModal("tab", event.currentTarget, data._id)} class="btn btn-light p-sm">
                            <i class="icomoon-24px-edit-1"></i>
                        </button>
                        <button type="button" on:click={()=> deleteElem("tab", data._id)} class="btn btn-light p-sm">
                            <i class="icomoon-new-24px-delete-1"></i>
                        </button>
                    </div>
                </li>
            {/each}
        </ul>
        <div class="tab-content" type="tab" style="position:relative">
            {#each tab_preview as data, index}
                <div
                    id={data._id} 
                    class={"tab-pane"+((data._display == "1")?" active":"")}
                    role="tabpanel"
                >
                    {#if data._bgimg}
                        <img src={ "https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg} on:load={()=> {checkImageStatus(1)}} alt={data._alt} />
                    {/if}

                    <Drag index={11} modules={((data.drag) ? data.drag : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Drop index={11} modules={((data.drop) ? data.drop : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Radio index={11} modules={((data.radio) ?data.radio : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Select index={11} modules={((data.select) ?data.select : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Textbox index={11} modules={((data.textbox) ?data.textbox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Multilinebox index={11} modules={((data.multilinebox) ?data.multilinebox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Checkbox index={11} modules={((data.checkbox) ? data.checkbox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Button index={11} modules={((data.button) ? data.button : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Tabhead index={11} modules={((data.tabhead) ? data.tabhead : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Img index={11} modules={((data.img) ? data.img : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Label index={11} modules={((data.label) ? data.label : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Hotspot index={11} modules={((data.hotspot) ? data.hotspot : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Menulist index={11} modules={((data.menulist) ? data.menulist : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Tabpills index={11} modules={((data.tab) ? data.tab : "")} elemModal = {elemModal} deleteElem = {deleteElem} {checkImageStatus}/>
                </div>
            {/each}
        </div>
    </div>
{/if}