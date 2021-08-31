<!--
 *  File Name   : Drop.svelte
 *  Description : Responsible for Drop
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
    let drop_auth = modules;
    let drop_data = [];

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            drop_auth = []
            drop_auth[0] = modules;
        } else {
            drop_auth = modules
        }
        drop_data = [];
        drop_auth.map(function(data) {
            drop_data = [
                ...drop_data, {
                    id : data._id,
                    caption: data._value,
                    title: data.title,
                    bgcolor: validColor(data._bgcolor, data._invisible),
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    border: validBorderColor(data._border),
                }
            ];
        });
    } else {
        drop_data = [];
    }

    // function used for getting the valid color
	function validColor(_bgcolor, _invisible) {
		if (_invisible == "1") {
			return "";
		} else if (_bgcolor) {
			return _bgcolor;
		} else {
			return "#FFFFCC";
		}
	}

    // function used for getting the valid border color
	function validBorderColor(_bordercolor) {
		if (_bordercolor) {
			return "1px solid " + _bordercolor;
		} else {
			return "";
		}
	}
</script>


{#if drop_data && drop_data.length > 0}
    <div key={"drop_" + index + drop_data.length}>
        {#each drop_data as data, index}
            <div 
                key={index}
                id={data.id}
                data-title={data.title}
                tabindex="0"
                class="drag-resize cursor_move dropable ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                    border: {data.border};
                    background-color: {data.bgcolor};
                    z-index:1
                "
            >
                <p>{data.caption ? data.caption : ''}</p>
                <div 
                    class="btn-group tools h" 
                    data-t="drop" 
                >
                    <button type="button" on:click={(event)=> elemModal("drop", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("drop", data.id)} id="editButton" class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}