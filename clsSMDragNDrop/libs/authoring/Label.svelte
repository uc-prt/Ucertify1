<!--
 *  File Name   : Label.svelte
 *  Description : Responsible for Label
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (authoring)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let modules;
    export let index = 0;
    export let deleteElem;
    export let elemModal;
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
            let styling = changeStyletoString({
                position: 'absolute',
                top: data._top + "px",
                left: data._left + "px",
                height: data._height + "px" ,
                width: data._width + "px",
                border: data._border_size + "px solid " + data._border_color,
                background_color : data._background_color,
            });

            label_preview_data = [
                ...label_preview_data, {
                id : data._id,
                style : styling,
                classes: "drag-resize cursor_move dndlabel ui-draggable ui-resizable " + ((data._label_class) ? data._label_class : ""),
                parahtml: data._richtext ? setInnerHtml(data.__cdata) : data._title,
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

    // function for setting the inner html
    function setInnerHtml(htmlEnt) {
        return (htmlEnt ? htmlEnt.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        }) : "" );
    }

</script>

{#if label_preview_data && label_preview_data.length}
    <div key={"label_" +  index + label_preview_data.length}>

        {#each label_preview_data as data, index}
            <!-- svelte-ignore a11y-positive-tabindex -->
            <div
                key={index}
                id={data.id}
                class={data.classes}
                tabindex="1"
                style={data.style}
            >
                <p class='pl_7'>{data.parahtml ? data.parahtml : ''}</p>
                <div 
                    class="btn-group tools h" 
                    data-t="label"
                >
                    <button type="button" on:click={(event)=> elemModal("label", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("label", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}