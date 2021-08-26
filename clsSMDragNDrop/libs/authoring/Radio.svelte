<!--
 *  File Name   : Radio.svelte
 *  Description : Responsible for Radio
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
    let radio_data = [];
    let radio = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            radio = []
            radio[0] = modules;
        } else {
            radio = modules;
        }
        radio_data = [];
        radio.map( function (data) {
            radio_data = [
                ...radio_data ,{
                    id : data._id,
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px" ,
                    width: data._width + "px",
                    name: data._name,
                }
            ]
        });
    } else {
        radio_data = [];
    }

</script>

{#if radio_data && radio_data.length > 0}
    <div key={"radio_" + index + radio_data.length}>
        {#each radio_data as data, index}
            <div
                key={index}
                id= {data.id}
                class="only-dragable drag-resize cursor_move ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                    z-index: 1;
                "
            >
                <input 
                    type="radio"
                    data-id= {data.id}
                    id={data.id} 
                    class={data.id + " elem dndradio"} 
                    data-title={data.id}
                    name={data.name}
                    value="0"
                />
                <div 
                    class="btn-group tools h" 
                    data-t="radio"
                >
                    <button type="button" on:click={(event)=> elemModal("radio", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("radio", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}