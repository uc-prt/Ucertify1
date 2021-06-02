<!--
 *  File Name   : CheckboxPreview.svelte
 *  Description : Responsible for CheckboxPreview
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
    let checkbox_data = [];
    let checkbox = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            checkbox = []
            checkbox[0] = modules;
        } else {
            checkbox = modules;
        }
        
        checkbox_data = [];
        checkbox.map(function (data) {
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

            checkbox_data = [
                ...checkbox_data, {
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px",
                    width: data._width + "px",
                    id: data._id,
                    userans: (data._userans) ? data._userans : "",
                    correctans: (data._correctans) ? data._correctans : "",
                    defaultans: (data._defaultans) ? data._defaultans : "",
                }
            ];
        });
    } else {
        checkbox_data = [];
    }

    afterUpdate( ()=> {
        if (checkbox_data && checkbox_data.length > 0 && containerID != '') {
            checkbox.map(function (data) {
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
    {#if checkbox_data.length > 0}
        {#each checkbox_data as data, index}
            <div
                key={index}
                id={"dnd"+data.id}
                class="only-dragable dndTest"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
            >
                {#if data.defaultans == "1" && data.userans == ''} 
                    <input 
                        type="checkbox"
                        class={"dnd" + data.id + " dndcheckbox"} 
                        data-correctans={data.correctans}
                        data-defaultans={data.defaultans}
                        data-userans="1"
                        data-udisplay=""
                        data-udisabled=""
                        name=""
                        value=""
                        checked = {true}
                    />
                {:else}
                    <input 
                        type="checkbox"
                        class={"dnd" + data.id + " dndcheckbox"} 
                        data-correctans={data.correctans}
                        data-defaultans={data.defaultans}
                        data-userans={data.userans}
                        data-udisplay=""
                        data-udisabled=""
                        name=""
                        value=""
                    />
                {/if}
            </div>
        {/each}
    {/if}
</div>

		