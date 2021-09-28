<!--
 *  File Name   : Drag.svelte
 *  Description : Responsible for Drag
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

    let drag = modules;
    let drag_value = [];

    $: if (modules) {
        if(Array.isArray(modules) == false) {
            drag = []
            drag[0] = modules;
        } else {
            drag = modules;
        }

        drag_value = [];

        drag.map(function (data) {
            drag_value = [
                ...drag_value, {
                    id : data._id,
                    title: data.title,
                    top: data._top+"px",
                    left: data._left+"px",
                    height: data._height+"px",
                    width: data._width+"px",
                    border: validBorderColor(data._border_color),
                    backgroundColor: validColor(data._bgcolor,data._invisible),
                    backgroundImage:((data._image) ? "url('"+ bgImage(data._image) +"')" : "none"),
                    text: data._value
                }
            ]
        });
    } else {
        drag_value = [];
    }

    // function used for getting the valid color
	function validColor(_bgcolor, _invisible) {
		if (_invisible == "1") {
			return "";
		} else if(_bgcolor) {
			return _bgcolor;
		} else {
			return "#CCFFCC";
		}
	}

    // function used for getting the valid border color
    function validBorderColor(_bordercolor) {
		if(_bordercolor) {
			return "1px solid "+_bordercolor;
		} else {
			return "";
		}
	}

    // function used for getting the background image
	function bgImage(img) {
		if(img) {
			let str = img.split(',')[0];
			return (window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + str;
		} else {
			return "";
		}
	}


</script>
		
{#if drag_value && drag_value.length > 0}
    <div key={"drag_" + index + drag_value.length}>
        {#each drag_value as data, index}
            <div 
                key={index}
                id={data.id}
                data-title={data.title}
                class="drag-resize cursor_move dragable ui-draggable ui-resizable"
                tabindex="0"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                    border: {data.border};
                    background-color: {data.backgroundColor};
                    background-image: {data.backgroundImage};
                "
                aria-disabled="false"
            >
                <p>{data.text ? data.text : ''}</p>
                <div 
                    class="btn-group tools h" 
                    data-t="drag" 
                >
                    <button type="button" on:click={(event)=> elemModal("drag", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("drag", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}