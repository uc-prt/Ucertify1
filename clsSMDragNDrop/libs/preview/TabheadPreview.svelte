<!--
 *  File Name   : TabheadPreview.svelte
 *  Description : Responsible for TabheadPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate } from 'svelte';

    export let modules;
    export let containerID = '';
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
            let styling = changeStyletoString(Object.assign({
                position: 'absolute',
                top: data._top + "px",
                left: data._left + "px",
                height: data._height + "px" ,
                width: data._width + "px",
            }, addInlineStyle(data._style)));

            tabhead_data = [
                ...tabhead_data, {
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    styles: styling,
                    id: data._id,
                    classes: "drag-resize dndtabhead dndTest " + data._class
                }
            ];
        });
    } else {
        tabhead_data = [];
    }

    afterUpdate( ()=> {
        if (tabhead_data.length > 0 && containerID != '') {
            tabhead.map(function (data) {
                let eventArr = ["onclick","ondblclick","oncontextmenu","ondragstart","ondrag","ondragend","ondrop","onmouseover","onmouseup","onmousedown","onchange","onfocus","onblur","onkeyup","onkeypress","onkeydown"];
                let container = document.querySelector('#'+ containerID);
                eventArr.forEach(function(value, index) {
                    if (!!container) {
                        let new_container = container.querySelectorAll("#dnd" + data._id);
                        if (!!new_container) {
                            new_container.forEach(function(element) {
                                element.removeAttribute(eventArr[index])
                            });
                        }
                    }
                });

                Object.keys(data).forEach(function(key){
                    let evt = key.replace("_","").trim();
                    if (eventArr.includes(evt) && !!container) {
                        let new_container = container.querySelectorAll("#dnd" + data._id);
                        if (!!new_container) {
                            new_container.forEach(function(element) {
                                element.setAttribute(evt, data[key]);
                            });
                        }
                    }
                });
            });
        }
    })

    // function for getting the style sheet from the object in string format
    function changeStyletoString(data) {
        let style = '';
        for (let key in data) { 
            style += key.replace(/_/g, '-') + ":" + data[key] + ";";
        }
        return style;
    }

    // function for adding inline style from the object
    function addInlineStyle(stylesheet) {
		if (typeof stylesheet != "undefined") {
			let style = {};
			let inlineStyle = stylesheet.split(";");
			inlineStyle.map(function(value) {
				try {
					let new_property  = value.split(":");
					style[new_property[0]] = new_property[1];
				} catch(err) {
					console.warn(err);
				}
			});
			return (style);
		}
	}
</script>

<div>
    {#if tabhead_data && tabhead_data.length > 0}
        {#each tabhead_data as data, index}
            <div
                key={index}
                id={"dnd"+data.id}
				data-type="tabhead"
                class={data.classes}
                style={data.styles}
                name=""
                data-userans=""
                data-udisplay=""
                data-udisabled=""
            >
            </div>
        {/each}
    {/if}
</div>

		