<!--
 *  File Name   : MultilineboxPreview.svelte
 *  Description : Responsible for MultilineboxPreview
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
    let multilinebox_data = [];
    let multilinebox_preview = modules;

    $: if (modules) {
        if (Array.isArray(modules) == false) {
            multilinebox_preview = []
            multilinebox_preview[0] = modules;
        } else {
            multilinebox_preview = modules;
        }

        multilinebox_data = [];
        multilinebox_preview.map( function (data) {
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

            multilinebox_data = [
                ...multilinebox_data , {
                id : data._id,
                top: data._top + "px",
                left: data._left + "px",
                height: data._height + "px" ,
                width: data._width + "px",
                correctans: ((data.correctans) ? setCorrect(data.correctans):""),
                defaultans: ((data.defaultans) ? data.defaultans.__cdata : ""),
                parser: ((data._parser) ? data._parser : ""),
                placeholder: (data._placeholder) ? data._placeholder : "",
                nocase : data._nocase,
                userans: (data._userans) ? data._userans : '',
                classes: "dnd" + data._id + " dnd_textarea " + data._custom_class
            }];
        });
    } else {
        multilinebox_data = [];
    }

    function setCorrect(crt){
		if(crt.__cdata) {
			return crt.__cdata
		} else if (typeof (crt) == 'object' && crt[0]) {
            return (crt[0].__cdata) ? (crt[0].__cdata) : crt[0];
		} else if (typeof crt == "string" && crt.length > 1) {
			return crt;
		} else {
			return "";
		}
	}

    // was created in js unused function for now but keeping it fot future reference
	// function changeStep(data) {
	// 	let id = data.match(/('.*?')/gm);
	// 	id = id[0].replace(/'|"/gm,'');
	// 	setStep(id);
	// }

    afterUpdate(()=> {
        if (multilinebox_data.length > 0 && containerID != '') {
            multilinebox_preview.map( function (data) {
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
    {#if multilinebox_data && multilinebox_data.length > 0}
        {#each multilinebox_data as data, index}
                <div
                key={index}
                id={"dnd"+data.id}
                class="drag-resize dndTest"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};  
                    z-index: 1;              
                "
            >
                <textarea 
                    class={data.classes} 
                    data-title={data.id}
                    data-correctans={data.correctans}
                    data-defaultans={((data.defaultans)?data.defaultans.__cdata:"")}
                    data-parser={data.parser}
                    placeholder={data.placeholder}
                    data-nocase={data.nocase}
                    data-userans={data.userans}
                ></textarea>
            </div>
        {/each}
    {/if}
</div>