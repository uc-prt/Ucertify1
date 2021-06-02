<!--
 *  File Name   : Hotspot.svelte
 *  Description : Responsible for Hotspot
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
    let hotspot_data = [];
    let hotspot = modules;
    
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            hotspot = []
            hotspot[0] = modules;
        } else {
            hotspot = modules;
        }
        hotspot_data = [];
        hotspot.map( function (data, index) {
            let inner_component = [];
            let innerText = JSON.parse(((data.__text) ? data.__text : data.__cdata));
            for (let key in innerText) {
                inner_component.push({
                    top: innerText[key][0] + "px",
                    left: innerText[key][1] + "px",
                    width: innerText[key][2] + "px",
                    height: innerText[key][3] + "px",
                })
            }
            hotspot_data = [
                ...hotspot_data, {
                id: data._id,
                top: data._top+"px",
                left: data._left+"px",
                height: data._height+"px",
                width: data._width+"px",
                backgroundImage: "url('" + bgImage(data._bgimg) + "')",
                bgimg: data._bgimg,
                child: inner_component
            }]
        });
    } else {
        hotspot_data = [];
    }

    // function for getting the background image
	function bgImage(img) {
		if (img) {
			return (window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + img;
		} else {
			return "";
		}
	}

</script>


{#if hotspot_data && hotspot_data.length > 0} 
    <div key={"hotspot_" + index + hotspot_data.length}>
        {#each hotspot_data as data, index}
            <div 
                key={index}
                id={data.id}
                class="drag-resize cursor_move hotspot_auth ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                    border: {data.border};
                    background-image: {data.backgroundImage}
                "
            >
                {#if data.bgimg}
                    <img style="display: none" alt="hotspot" src={("https://s3.amazonaws.com/jigyaasa_content_static/") + data.bgimg } />
                {/if}
                {#if data.child.length > 0}
                    {#each data.child as child_data, child_index}
                        <div
                            key={child_index}
                            id={data.id + "_" + (child_index + 1)}
                            data-correctans="0"
                            class="drag-resize hs_item ui-draggable cursor_move ui-resizable"
                            style = "
                                position: absolute;
                                top: {child_data.top};
                                left: {child_data.left};
                                height: {child_data.height};
                                width: {child_data.width};
                            "
                        >
                            <div 
                                class="btn-group tools h" 
                                data-t="hotspot_click"
                            >
                                <button type="button" on:click={(event)=> elemModal("hotspot_click", event.currentTarget, data.id + "_" + (child_index + 1))} class="btn btn-light p-sm">
                                    <i class="icomoon-24px-edit-1"></i>
                                </button>
                                <button type="button" on:click={()=> deleteElem("hotspot_click", data.id + "_" + (child_index + 1))} class="btn btn-light p-sm">
                                    <i class="icomoon-new-24px-delete-1"></i>
                                </button>
                            </div>
                            <div class="resizer icomoon-resize"></div>
                        </div>
                    {/each}
                {/if}

                <div 
                    class="btn-group tools h" 
                    data-t="hotspot"
                >
                    <button type="button" on:click={(event)=> elemModal("hotspot", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("hotspot", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                    <button type="button" on:click={()=> elemModal("hotspot_click", '[id=' + data.id + ']')} class="btn btn-light p-sm">
                        <i class="icomoon-plus"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}
    