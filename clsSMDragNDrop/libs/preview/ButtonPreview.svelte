<!--
 *  File Name   : ButtonPreview.svelte
 *  Description : Responsible for ButtonPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate } from 'svelte';

    export let modules;
    export let containerID = '';
    let button_preview_data = [];
    let button_preview = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            button_preview = []
            button_preview[0] = modules;
        } else {
            button_preview = modules;
        }

        button_preview_data = [];
        button_preview.map(function (data) {
            button_preview_data = [
                ...button_preview_data, {
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    id: data._id,
                    classes: "drag-resize dndTest "+data._class,
                    value: data._value
                }
            ];
        });
    } else {
        button_preview_data = [];
    }

    afterUpdate( ()=> {
        if (button_preview_data.length > 0 && containerID != '') {
            button_preview.map(function (data) {
                let eventArr = ["onclick","ondblclick","oncontextmenu","ondragstart","ondrag","ondragend","ondrop","onmouseover","onmouseup","onmousedown","onchange","onfocus","onblur","onkeyup","onkeypress","onkeydown"];
                let container = document.querySelector('#'+ containerID);
                eventArr.forEach(function(value, index) {
                    if (!!container) {
                        let new_container = container.querySelectorAll(".dnd" + data._id);
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
                        let new_container = container.querySelectorAll(".dnd" + data._id);
                        if (!!new_container) {
                            new_container.forEach(function(element) {
                                element.setAttribute(evt, data[key]);
                            });
                        }
                    }
                });
            });
        }
    });
</script>

<div>
    {#if button_preview_data && button_preview_data.length > 0}
        {#each button_preview_data as data, index}
            <div
                key={index}
                id={"dnd"+data.id}
                class={data.classes}
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
                data-correctans=""
                data-defaultans=""
                data-userans=""
                tabindex="0"
            >
                <button 
                    type="button"
                    class={"dnd" + data.id + " dnd_button"} 
                    name=""
                    tabindex="-1"
                    value={data.value ? data.value : ''}
                    data-correctans=""
                    data-defaultans=""
                    data-userans=""
                >
                    {data.value ? data.value : ''}
                </button>
            </div>
        {/each}
    {/if}
</div>

		