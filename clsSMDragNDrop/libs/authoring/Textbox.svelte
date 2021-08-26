<!--
 *  File Name   : Textbox.svelte
 *  Description : Responsible for Textbox
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (authoring)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let modules;
    export let index = 0;
    export let deleteElem;
    export let elemModal;
    let textbox_data = [];
    let textbox = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            textbox = []
            textbox[0] = modules;
        } else {
            textbox = modules;
        }

        textbox_data = [];
        textbox.map(function (data) {
            textbox_data = [...textbox_data, data];
        });
    } else {
        textbox_data = [];
    }

</script>


{#if textbox_data && textbox_data.length > 0}
    <div key={"textbox_" + index + textbox_data.length}>
        {#each textbox_data as data, index}
            <div
                key="{index}"
                id="{data._id}"
                class="drag-resize cursor_move ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data._top}px;
                    left: {data._left}px;
                    height:{data._height}px;
                    width: {data._width}px;
                    z-index: 1;
                "
            >
                <input
                    type={data._type}
                    id="{data._id}"
                    class={data._id + " elem dnd_textbox form-control min_height_0"} 
                    name=""
                    value={(data._defaultans) ? data._defaultans : ''}
                    placeholder = "{(data._placeholder) ? data._placeholder : ""}"
                />
                <div 
                    class="btn-group tools h" 
                    data-t="input"
                >
                    <button type="button" on:click={(event)=> elemModal("input", event.currentTarget, data._id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("input", data._id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}


		