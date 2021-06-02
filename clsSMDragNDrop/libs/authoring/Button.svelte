<!--
 *  File Name   : Button.svelte
 *  Description : Responsible for Button Preview
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

    let button_preview_data = [];
    let button_preview = modules;

    
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            button_preview = []
            button_preview[0] = modules;
        } else {
            button_preview = modules;
        }
        button_preview_data = [];
        button_preview.map(function (data) {
            button_preview_data = [
                ...button_preview_data, {
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    id: data._id,
                    value: data._value
                }
            ];
        });
    } else {
        button_preview_data = [];
    }
</script>


{#if button_preview_data && button_preview_data.length > 0}
    <div key={"button_" + index + button_preview_data.length}>
        {#each button_preview_data as data, index}
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
                <button 
                    type="button"
                    class={data.id + " elem dnd_button"} 
                    data-title={data.id}
                >
                    {data.value ? data.value : ''}
                </button>
                <div 
                    class="btn-group tools h" 
                    data-t="button"
                >
                    <button type="button" on:click={(event)=> elemModal("button", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("button", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}

		