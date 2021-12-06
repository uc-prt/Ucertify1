<!--
 *  File Name   : Tabpills.svelte
 *  Description : Responsible for Tabpills
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
    export let modules;
    export let deleteElem;
    export let elemModal;
    export let checkImageStatus;

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
        <ul class="nav nav-pills margin-bottom mt-3 px-2" role="tablist">
            {#each tab_pills_preview as data, index}
                <li for={data._id} key={"tab_pills_list_" + index} class="nav-item">
                    <a data-bs-toggle="pill" data-toggle="pill" data-bs-target={"#"+data._id} data-target={"#"+data._id} class={"nav-link" + ((data._display == "1") ? " active" :"")} href={"#"+data._id} >{data._value}</a>
                </li>
            {/each}
        </ul>
        <div class="tab-content" type="tab" style="position:relative">
            {#each tab_pills_preview as data, index}
                <div
                    key={"tab_pills_preview_" + index}
                    id={data._id}
                    role="tabpanel"
                    class={"tab-pane " + ((data._display == "1") ? "active": "")}
                >
                    {#if data._bgimg}
                        <img on:load={()=> {checkImageStatus(1)}} src={"https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg} alt={data._alt} />
                    {/if}
                    <Drag index={0} modules={((data.drag) ? data.drag : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Drop index={0} modules={((data.drop) ? data.drop : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Radio index={0} modules={((data.radio) ?data.radio : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Select index={0} modules={((data.select) ?data.select : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Textbox index={0} modules={((data.textbox) ?data.textbox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Multilinebox index={0} modules={((data.multilinebox) ?data.multilinebox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Checkbox index={0} modules={((data.checkbox) ? data.checkbox : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Button index={0} modules={((data.button) ? data.button : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Tabhead index={0} modules={((data.tabhead) ? data.tabhead : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Img index={0} modules={((data.img) ? data.img : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Label index={0} modules={((data.label) ? data.label : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Hotspot index={0} modules={((data.hotspot) ? data.hotspot : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                    <Menulist index={0} modules={((data.menulist) ? data.menulist : "")} elemModal = {elemModal} deleteElem = {deleteElem} />
                </div>
            {/each}
        </div>
    {/if}
</div>