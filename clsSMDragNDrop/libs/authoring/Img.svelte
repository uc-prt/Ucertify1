<!--
 *  File Name   : Img.svelte
 *  Description : Responsible for Img
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
    let img_data = [];
    let img = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            img = []
            img[0] = modules;
        } else {
            img = modules;
        }
        img_data = [];
        img.map( function (data) {
            img_data = [
                ...img_data ,{
                    id : data._id,
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px" ,
                    width: data._width + "px",
                    src: data._bgimg,
                }
            ]
        });
    } else {
        img_data = [];
    }

</script>

{#if img_data && img_data.length > 0}
    <div key={"img_" + index + img_data.length}>
        {#each img_data as data, index}
            <div
                key={index}
                id= {data.id}
				class="drag-resize cursor_move ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
            >
                <img
                    src={data.src}
                    class={data._id + " elem dnd_img"} 
                    data-title={data.id}
                    style='display : inline;'
                    alt=""
                />
                <div 
                    class="btn-group tools h" 
                    data-t="img"
                >
                    <button type="button" on:click={(event)=> elemModal("img", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("img", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}