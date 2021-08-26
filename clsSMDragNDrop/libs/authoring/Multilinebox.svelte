<!--
 *  File Name   : Multilinebox.svelte
 *  Description : Responsible for Multilinebox
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
    let multilinebox_data = [];
    let multilinebox_preview = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            multilinebox_preview = []
            multilinebox_preview[0] = modules;
        } else {
            multilinebox_preview = modules;
        }
        multilinebox_data = [];
        multilinebox_preview.map( function (data) {
            multilinebox_data = [
                ...multilinebox_data , {
                id : data._id,
                top: data._top + "px",
                left: data._left + "px",
                height: data._height + "px" ,
                width: data._width + "px",
            }];
        });
    } else {
        multilinebox_data = [];
    }
</script>

{#if multilinebox_data && multilinebox_data.length > 0}
	<div key={"multilinebox_" + index + multilinebox_data.length}>
        {#each multilinebox_data as data, index}
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
                    z-index: 1;                
                "
            >
                <textarea 
                    class={data.id+" elem dnd_textarea form-control min_height_0"} 
                    data-title={data.id}
                ></textarea>
                <div 
                    class="btn-group tools h" 
                    data-t="multiline"
                >
                    <button type="button" on:click={(event)=> elemModal("multiline", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("multiline", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}
