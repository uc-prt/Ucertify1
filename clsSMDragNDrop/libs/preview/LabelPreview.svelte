<!--
 *  File Name   : LabelPreview.svelte
 *  Description : Responsible for LabelPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate } from "svelte";
    import { AH } from "../../../helper/HelperAI.svelte";
    export let modules;
    export let containerID = '';
				
    let label_preview_data = [];
    let labelPreview = modules;
    
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            labelPreview = []
            labelPreview[0] = modules;
        } else {
            labelPreview = modules;
        }
        label_preview_data = [];
        labelPreview.map( function (data) {
            let styling = changeStyletoString(Object.assign({
                position: 'absolute',
                top: data._top + "px",
                left: data._left + "px",
                height: data._height + "px" ,
                width: data._width + "px",
                border: data._border_size + "px solid " + data._border_color,
                background_color : data._background_color,
            }, addInlineStyle(data._style)));

            let para_styling = changeStyletoString(addParaStyle(data));

            label_preview_data = [
                ...label_preview_data, {
                id : data._id,
                style : styling,
                classes: "dndlabel dndTest "+((data._label_class) ? data._label_class : ""),
                paraStyle: para_styling,
                parahtml:  setInnerHtml(data._richtext ? data.__cdata : ((data._title != undefined) ? AH.ignoreEnity(data._title) : ''))
            }];
        });
    } else {
        label_preview_data = [];
    }

    // function for getting the style sheet from the object in string format
    function changeStyletoString(data) {
        let style = '';
        for (let key in data) { 
            style += key.replace(/_/g, '-') + ":" + data[key] + ";";
        }
        return style;
    }

    // for adding inline paragraph style
    function addParaStyle(data) {
		if (typeof data._label_class != "undefined") {
			return addInlineStyle(data._style);
		}
    }

    // function for setting inner html
    function setInnerHtml(htmlEnt) {
        return (htmlEnt ? htmlEnt.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        }) : "" );
    }

    // function for adding inline style from the object
    function addInlineStyle(stylesheet) {
		if (typeof stylesheet != "undefined") {
			let style = {};
			let inlineStyle = stylesheet.split(",");
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

    afterUpdate(()=> {
        if (label_preview_data.length > 0 && containerID != '') {
            labelPreview.map( function (data) {
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
</script>

<div>
    {#if label_preview_data && label_preview_data.length}
        {#each label_preview_data as data, index}
            <!-- svelte-ignore a11y-positive-tabindex -->
            <div
                key={index}
                id={"dnd"+data.id}
                class={data.classes}
                tabindex="1"
                style={data.style}
            >
                <p style={data.paraStyle}>{data.parahtml}</p>
            </div>
        {/each}
    {/if}
</div>