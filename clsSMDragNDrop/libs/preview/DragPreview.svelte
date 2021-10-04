<!--
 *  File Name   : DragPreview.svelte
 *  Description : Responsible for DragPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let modules;
    let drag = modules;
    let drag_value = [];

    $: if ( modules ) {
        init()
    } else {
        drag_value = [];
    }

    // for initializing the drag
    function init() {
        if (Array.isArray(modules) == false) {
            drag = []
            drag[0] = modules;
        } else {
            drag = modules
        }
        drag_value = [];
        drag.map(function (data) {
            drag_value = [
                ...drag_value, {
                    id : "dnd" + data._id,
                    caption: data._value,
                    bgcolor: validColor(data._bgcolor,data._invisible),
                    multi_drag: data._multi_drag,
                    dragimage: (data._image) ? data._image.split(',')[1] : "",
                    dropimage: (data._image) ? data._image.split(',')[2] : "",
                    bgimage: (data._image) ? data._image.split(',')[0] : "",
                    top: data._top+"px",
                    left: data._left+"px",
                    height: data._height+"px",
                    width: data._width+"px",
                    border: validBorderColor(data._border_color),
                    backgroundColor: validColor(data._bgcolor,data._invisible),
                    backgroundImage:((data._image) ? "url('"+ bgImage(data._image) +"')" : "none"),
                    value: data._value
                }
            ]
        });
    }

	function validColor(_bgcolor, _invisible) {
		if (_invisible == "1") {
			return "";
		} else if(_bgcolor) {
			return _bgcolor;
		} else {
			return "#CCFFCC";
		}
	}

	function validBorderColor(_bordercolor) {
		if(_bordercolor) {
			return "1px solid "+_bordercolor;
		} else {
			return "";
		}
	}

	function bgImage(img) {
		if(img) {
			let str = img.split(',')[0];
			return (window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + str;
		} else {
			return "";
		}
	}
</script>	
<div>
    {#if drag_value && drag_value.length > 0}
        {#each drag_value as data, index}
            <div 
                key={index}
                id={data.id}
                draging="1"
                name=""
                class="drag-resize dragable ui-draggable dndTest"
                data-caption={data.caption}
                data-bgcolor={data.bgcolor}
                data-multi_drag={data.multi_drag}
                data-dragimage={data.dragimage}
                data-dropimage={data.dropimage}
                data-bgimage={data.bgimage}
                data-detail=""
                tabindex="0"
                data-path={(window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/")}
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
                {#if data.value}<p>{@html data.value}</p>{/if}	
            </div>
        {/each}
    {/if}
</div>