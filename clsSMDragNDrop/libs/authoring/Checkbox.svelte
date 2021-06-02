<!--
 *  File Name   : Checkbox.svelte
 *  Description : Responsible for Checkbox Preview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (authoring)
 *  Last update : 19-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let modules;
    export let index = 0;
    export let deleteElem;
    export let elemModal;
    let checkbox_data = [];
    let checkbox = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            checkbox = []
            checkbox[0] = modules;
        } else {
            checkbox = modules;
        }
        checkbox_data = [];
        checkbox.map(function (data) {
            checkbox_data = [
                ...checkbox_data, {
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    id: data._id,
                }
            ];
        });
    } else {
        checkbox_data = [];
    }

</script>

{#if checkbox_data.length > 0}
    <div key={"checkbox_" + index + checkbox_data.length}>
        {#each checkbox_data as data, index}
            <div
                key={index}
                id={data.id}
                class="drag-resize cursor_move ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
            >
                <input 
                    type="checkbox"
                    class={data.id + " elem dndcheckbox"} 
                    data-title={data.id}
                />
                <div 
                    class="btn-group tools h" 
                    data-t="checkbox"
                >
                    <button type="button" on:click={(event)=> elemModal("checkbox", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("checkbox", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}


		