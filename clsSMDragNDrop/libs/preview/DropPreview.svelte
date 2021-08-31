<!--
 *  File Name   : DropPreview.svelte
 *  Description : Responsible for DropPreview
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
    let dropPreview = modules;
    let drop_data = [];
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            dropPreview = []
            dropPreview[0] = modules;
        } else {
            dropPreview = modules;
        }
        drop_data = [];
        dropPreview.map(function(data) {
            let ansKey = "";
            if (data._anskey) {
                let allAnsKey = data._anskey.split(",");
                allAnsKey.forEach(function(value) {
                    ansKey += "dnd" + value + ",";  
                });
                ansKey = ansKey.slice(0, -1);
            }

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
                            if (uans[j]._id == "dnd"+data._id) {
                                data._userans = uans[j]._userAns;
                            }
                        }
                    }
                }
            }

            drop_data = [
                ...drop_data, {
                    id : "dnd"+data._id,
                    anskey: (data._anskey)? ansKey : "",
                    caption: data._value,
                    userans: setUserAns(data._userans, data._defaultans),
                    droped: setUserAns(data._userans, data._defaultans),
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
        dropPreview = [];
        drop_data = [];
    }

    afterUpdate(() => {
        if (dropPreview && drop_data.length > 0 && containerID != '') {
            dropPreview.map(function (data) {
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
    });

	function validColor(_bgcolor, _invisible) {
		if (_invisible == "1") {
			return "";
		} else if (_bgcolor) {
			return _bgcolor;
		} else {
			return "#FFFFCC";
		}
	}

	function validBorderColor(_bordercolor) {
		if (_bordercolor) {
			return "1px solid " + _bordercolor;
		} else {
			return "";
		}
	}

	function setUserAns(uans, defaultans) {
		if (uans) {
			return uans;
		} else if (defaultans) {
			return defaultans;
		} else {
			return "";
		}
	}
</script>

<div>
    {#if drop_data && drop_data.length > 0}
        {#each drop_data as data, index}
            <div 
                key={index}
                id={data.id}
                name=""
                tabindex="0"
                data-anskey={data.anskey}
                data-caption={data.caption}
                data-userans={data.userans}
                data-droped={data.droped}
                data-bgcolor={data.bgcolor}
                data-path={(window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/")}
                data-dragimage=""
                data-dropimage=""
                data-bgimage=""
                class="drag-resize dropable ui-droppable dndTest"
                droping= {data.userans ? '2' : '1'}
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                    border: {data.border};
                    z-index: 1 
                "
            >
                <p></p>
            </div>
        {/each}
    {/if}
</div>
