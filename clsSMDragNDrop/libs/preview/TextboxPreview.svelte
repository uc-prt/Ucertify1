<!--
 *  File Name   : TextboxPreview.svelte
 *  Description : Responsible for TextboxPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { XMLToJSON } from "../../../helper/HelperAI.svelte";
    import { afterUpdate } from 'svelte';

    export let modules;
    export let containerID = '';
    export let uxml = '';
    let textbox_data = [];
    let textbox = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            textbox = []
            textbox[0] = modules;
        } else {
            textbox = modules;
        }

        textbox_data = [];
        textbox.map(function (data) {
            if (uxml != '') {
                let uaXML = XMLToJSON(uxml);
                if (uaXML && uaXML.smans) {
                    if (uaXML.smans.div) {
                        let uans = uaXML.smans.div;
                        if (Array.isArray(uans) == false) {
                            uans = []
                            uans[0] = uaXML.smans.div;
                        }
                        for (let j in uans) {
                            if(uans[j]._id == "dnd"+data._id) {
                                data._userans = uans[j]._userAns;
                            }
                        }
                    }
                }
            }
            textbox_data = [...textbox_data, data];
        });
    } else {
        textbox_data = [];
    }

    afterUpdate( ()=> {
        if (textbox_data.length > 0 && containerID != '') {
            textbox.map(function (data) {
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
    })
</script>

<div>
    {#if textbox_data && textbox_data.length > 0}
        {#each textbox_data as data, index}
                <div
                    key="{index}"
                    id="{"dnd" + data._id}"
                    class="drag-resize dndTest"
                    style="
                        position: absolute;
                        top: {data._top}px;
                        left: {data._left}px;
                        height:{data._height}px;
                        width: {data._width}px;
                        z-index: 1;
                    "
                >
                    <input
                        type={data._type}
                        class="{"dnd" + data._id + " dnd_textbox " + data._custom_class}"
                        name=""
                        data-correctans = {(data._correctans) ? data._correctans : ''}
                        data-userans = "{(data._userans) ? data._userans : ""}"
                        data-udisplay = ""
                        data-udisabled = ""
                        data-defaultans = "{(data._defaultans) ? data._defaultans : ""}"
                        placeholder = "{(data._placeholder) ? data._placeholder : ""}"
                        data-nocase = "{(data._nocase) ? data._nocase : ""}"
                        data-ismultipleanswer = "{(data._ismultipleanswer) ? data._ismultipleanswer : ""}"
                    />
            </div>
        {/each}
    {/if}
</div>

		