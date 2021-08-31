<!--
 *  File Name   : Menulist.svelte
 *  Description : Responsible for Menulist
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
    let menulist_data = [];
    let menulist_preview = modules;

    
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            menulist_preview = []
            menulist_preview[0] = modules;
        } else {
            menulist_preview = modules;
        }
        menulist_data = [];
        menulist_preview.map( function (data) {
            menulist_data = [
                ...menulist_data, {
                    top:data._top+"px",
                    left:data._left+"px",
                    height:data._height+"px",
                    width:data._width+"px",
                    id: data._id,
                }
            ]
        });
    } else {
        menulist_data = [];
    }
</script>


{#if menulist_data && menulist_data.length > 0}
    <div key={"menulist_" + index + menulist_data.length}>
        {#each menulist_data as data, index}
            <div
                key={index}
                id={data.id}
                data-title={data.id}
                class="drag-resize cursor_move ui-draggable dndarea ui-resizable"
                style="
                    position: absolute;
                    top:{data.top};
                    left:{data.left};
                    height:{data.height};
                    width:{data.width};
                    z-index: 1;
                "
            >
                <div 
                    class="btn-group tools h" 
                    data-t="menulist"
                >
                    <button type="button" on:click={(event)=> elemModal("menulist", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("menulist", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}