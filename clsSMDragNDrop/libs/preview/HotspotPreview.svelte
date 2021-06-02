<!--
 *  File Name   : HotspotPreview.svelte
 *  Description : Responsible for HotspotPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { XMLToJSON } from "../../../helper/HelperAI.svelte";
    export let modules;
    export let uxml;
    export let module_type;
    let hotspot_data = [];
    let hotspot = modules;
    let module_height = 0;
    let div_height = 'auto';
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            hotspot = []
            hotspot[0] = modules;
        } else {
            hotspot = modules;
        }
        hotspot_data = [];

		if (module_type == '15') {
			try {
				hotspot.map((data) => {
					module_height = data._height;
					if (module_height < data._height) {
						module_height = data._height
					}
				});
			} catch(e) {
				module_height = 350;
			}
		}
        
        div_height = (module_height == 0) ? 'auto' : (module_height + 100) + 'px';
        hotspot.map( function (data, index) {
            let inner_component = [];
            let innerText = JSON.parse(((data.__text) ? data.__text : data.__cdata));
            for (let key in innerText) {
                inner_component.push({
                    top: innerText[key][0] + "px",
                    left: innerText[key][1] + "px",
                    width: innerText[key][2] + "px",
                    height: innerText[key][3] + "px",
                })
            }	
            if (uxml) {
                let uaXML = XMLToJSON(uxml);
                if(uaXML && uaXML.smans) {
                    if(uaXML.smans.div) {
                        let uans = uaXML.smans.div;
                        if(Array.isArray(uans) == false) {
                            uans = []
                            uans[0] = uaXML.smans.div;
                        }
                        for(let j in uans) {
                            if(uans[j]._id == "dnd" + data._id) {
                                data._userans = uans[j]._userAns;
                            }
                        }
                    }
                }
            }
            hotspot_data =[
                ...hotspot_data, {
                id: data._id,
                top: data._top+"px",
                left: data._left+"px",
                height: data._height+"px",
                width: data._width+"px",
                backgroundImage: "url('" + bgImage(data._bgimg) + "')",
                userans: (data._userans) ? data._userans : '',
                bgimg: data._bgimg,
                child: inner_component
            }]
        });
    } else {
        hotspot_data = [];
    }

    // function for getting the background image
	function bgImage(img) {
		if (img) {
			return (window.inNative ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + img;
		} else {
			return "";
		}
	}

</script>

<div>
    <div class="hotspotContainer" style="{'height:' + div_height}">
        {#if hotspot_data && hotspot_data.length > 0} 
            {#each hotspot_data as data, index}
                <div 
                    key={index}
                    id={"dnd" + data.id}
                    class="drag-resize hotspot_test dndTest"
                    style="
                        position: absolute;
                        top: {data.top};
                        left: {data.left};
                        height: {data.height};
                        width: {data.width};
                        border: {data.border};
                        background-image: {data.backgroundImage}
                    "
                    data-userans={data.userans}
                >
                    {#if data.bgimg}
                        <div>
                            <img style="display: none" alt="hotspot" src={( (window.inNative) ? "https://s3.amazonaws.com/jigyaasa_content_static/" : "https://s3.amazonaws.com/jigyaasa_content_static/") + data.bgimg + "?" + Date.now() } />
                        </div>
                    {/if}

                    {#if data.child.length > 0}
                        {#each data.child as child_data, child_index}
                            <div
                                key={child_index}
                                id={data.id + "_" + (child_index + 1)}
                                data-correctans="0"
                                class="drag-resize hs_item ui-droppable"
                                style = "
                                    position: absolute;
                                    top: {child_data.top};
                                    left: {child_data.left};
                                    height: {child_data.height};
                                    width: {child_data.width};
                                "
                            >
                            </div>
                        {/each}
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
</div>