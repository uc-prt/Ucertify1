<!--
 *  File Name   : RadioPreview.svelte
 *  Description : Responsible for RadioPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate } from "svelte";
    import { XMLToJSON } from "../../../helper/HelperAI.svelte";

    export let modules;
    export let containerID = '';
    export let uxml = '';
    let radio_data = [];
    let radio = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            radio = []
            radio[0] = modules;
        } else {
            radio = modules;
        }

        radio_data = [];
        radio.map( function (data) {
            if(uxml != '') {
                let uaXML = XMLToJSON(uxml);
                if(uaXML && uaXML.smans) {
                    if(uaXML.smans.div) {
                        let uans = uaXML.smans.div;
                        if(Array.isArray(uans) == false) {
                            uans = []
                            uans[0] = uaXML.smans.div;
                        }
                        for (let j in uans) {
                            if (uans[j]._id == "dnd" + data._id) {
                                data._userans = uans[j]._userAns;
                            }
                        }
                    }
                }
            }

            radio_data = [
                ...radio_data ,{
                    id : data._id,
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px" ,
                    width: data._width + "px",
                    userans: (data._userans) ? data._userans : "",
                    correctans: data._correctans,
                    defaultans: data._defaultans,
                    checktype: data._checktype,
                    name: data._name,
                }
            ]
        });
    } else {
        radio_data = [];
    }

    afterUpdate(()=> {
        if (radio_data.length > 0 && containerID != '') {
            radio.map( function (data) {
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
    {#if radio_data && radio_data.length > 0}
        {#each radio_data as data, index}
            <div
                key={index}
                as="-1"
                id= {"dnd" + data.id}
                class="only-dragable dndTest"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                    z-index: 1;
                "
            >
                {#if data.defaultans == "1" && data.userans == ''}
                    <input 
                        type="radio"
                        id={"rad" + data.id} 
                        class={"dnd" + data.id + " custRad dndradio"} 
                        data-title={data.id}
                        data-correctans={data.correctans}
                        data-defaultans={data.defaultans}
                        data-userans={1}
                        checked="checked"
                        data-udisplay=""
                        data-udisabled=""
                        data-checktype={data.checktype}
                        name={data.name}
                        value="1"
                    />
                {:else}
                    <input 
                        type="radio"
                        id={"rad" + data.id} 
                        class={"dnd" + data.id + " custRad dndradio"} 
                        data-title={data.id}
                        data-correctans={data.correctans}
                        data-defaultans={data.defaultans}
                        data-userans={data.userans}
                        data-udisplay=""
                        data-udisabled=""
                        data-checktype={data.checktype}
                        name={data.name}
                        value="0"
                    />
                {/if}
                <label
                    for={"rad" + data.id}
                    class={((data.checktype == "true") ? "tureitemColor" : "falseitemColor") + " customRad radio_sim " + ((window.inNative) ? "native" : "" )}
                    data-correctans=""
                    data-userans=""
                    data-defaultans=""
                >
                </label>
            </div>
        {/each}
    {/if}
</div>