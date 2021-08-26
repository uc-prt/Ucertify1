<!--
 *  File Name   : SelectPreview.svelte
 *  Description : Responsible for SelectPreview
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
let user_ans = 0;
let select_data = [];
let select = modules;

$: if (modules) {
    if (Array.isArray(modules) == false) {
        select = []
        select[0] = modules;
    } else {
        select = modules;
    }
    select_data = [];
    select.map( function (data) {
        if(uxml != '') {
            let uaXML = XMLToJSON(uxml);
            if (uaXML && uaXML.smans) {
                if(uaXML.smans.div) {
                    let uans = uaXML.smans.div;
                    if(Array.isArray(uans) == false) {
                        uans = []
                        uans[0] = uaXML.smans.div;
                    }
                    for(let j in uans) {
                        if(uans[j]._id == "dnd"+data._id) {
                            data._userans = uans[j]._userAns;
                        }
                    }
                }
            }
        }

        let option = [];
        if (data.__text) {
            data.__text.split("\n").map(function(option_data, index) {
                if (data._userans == ( index + 1 ) + ",") {
                    user_ans = 1;
                } else {
                    user_ans = 0;
                }
                if (option_data.trim().charAt(0) == "+") {
                    option.push({
                        key: index,
                        correctans: 0,
                        defaultans: 1,
                        userans: (user_ans) ? user_ans : '',
                        text: option_data.trim().slice(1),
                        selected : 1,
                    })
                } else if (option_data.trim().charAt(0) == "*") {
                    option.push({
                        key: index,
                        correctans: 1,
                        defaultans: 0,
                        userans: (user_ans) ? user_ans : '',
                        text: option_data.trim().slice(1),
                    })
                } else {
                    option.push({
                        key: index,
                        correctans: 0,
                        defaultans: 0,
                        userans: (user_ans) ? user_ans : '',
                        text: option_data.trim(),
                    })
                }
            });
        }
        select_data = [
            ...select_data , {
                id : "dnd" + data._id,
                top: data._top + "px",
                left: data._left + "px",
                height: data._height + "px" ,
                width: data._width + "px",
                userans: (data._userans) ? data._userans : "",
                select: option
            }
        ];
    });
} else {
    select_data = [];
}
afterUpdate(()=> {
    if (select_data.length > 0 && containerID != '') {
        select.map(function (data) {
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
            Object.keys(data).forEach(function(key) {
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
    {#if select_data && select_data.length > 0}
        {#each select_data as data, index}
            <div
                key={index}
                as="-1"
                id= {data.id}
                class="drag-resize dndTest"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
            >
                <select
                    class = {data.id + " dnd_select align_baseline_middle"}
                    name=""
                    size="0"
                    data-userans={data.userans}
                    data-udisplay=""
                    data-udisabled=""
                    data-correctans=""
                    data-defaultans=""
                >
                    {#if data.select.length}
                        {#each data.select as option}
                            {#if option.selected == 1} 
                                <option selected="selected" key={option.key} data-correctans={option.correctans} data-defaultans={option.defaultans} data-userans={option.userans} value={option.key + 1}>{option.text}</option>
                            {:else}
                                <option key={option.key} data-correctans={option.correctans} data-defaultans={option.defaultans} data-userans={option.userans} value={option.key + 1}>{option.text}</option>
                            {/if}
                        {/each}
                    {:else}
                        <option>Please Select</option>
                    {/if}
                </select>
            </div>
        {/each}
    {/if}
</div>