<!--
 *  File Name   : Tabhead.svelte
 *  Description : Responsible for Tabhead
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
    let tabhead_data = [];
    let tabhead = modules;
    
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            tabhead = []
            tabhead[0] = modules;
        } else {
            tabhead = modules;
        }

        tabhead_data = [];
        tabhead.map(function (data) {
            tabhead_data = [
                ...tabhead_data, {
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    id: data._id,
                    classes: "drag-resize cursor_move ui-draggable dndtabhead ui-resizable"
                }
            ];
        });
    } else {
        tabhead_data = []
    }
</script>


{#if tabhead_data && tabhead_data.length > 0}
    <div key={"tabhead_" + index + tabhead_data.length}>
        {#each tabhead_data as data, index}
            <div
                key={index}
                id={data.id}
                data-title={data.id}
				data-type="tabhead"
                class={data.classes}
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
            >
            <div 
                class="btn-group tools h" 
                data-t="tabhead"
            >
                <button type="button" on:click={(event)=> elemModal("tabhead", event.currentTarget, data.id)} class="btn btn-light p-sm">
                    <i class="icomoon-24px-edit-1"></i>
                </button>
                <button type="button" on:click={()=> deleteElem("tabhead", data.id)} class="btn btn-light p-sm">
                    <i class="icomoon-new-24px-delete-1"></i>
                </button>
            </div>
            </div>
        {/each}
    </div>
{/if}


		