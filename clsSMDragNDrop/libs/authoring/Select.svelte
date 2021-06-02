<!--
 *  File Name   : Select.svelte
 *  Description : Responsible for Select
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
    let select_data = [];
    let select = modules;

    $: if (modules) {
        if(Array.isArray(modules) == false) {
            select = []
            select[0] = modules;
        } else {
            select = modules;
        }
        select_data = [];
        select.map( function (data) {

            let option = [];
            if (data.__text) {
                data.__text.split("\n").map(function(option_data, index) {
                    if (option_data.trim().charAt(0) == "+") {
                        option.push({
                            key: index,
                            correctans: 0,
                            defaultans: 1,
                            text: option_data.trim().slice(1),
                            selected : 1,
                        })
                    } else if (option_data.trim().charAt(0) == "*") {
                        option.push({
                            key: index,
                            correctans: 1,
                            defaultans: 0,
                            text: option_data.trim().slice(1),
                        })
                    } else {
                        option.push({
                            key: index,
                            correctans: 0,
                            defaultans: 0,
                            text: option_data.trim(),
                        })
                    }
                });
            }
            select_data = [
                ...select_data , {
                    id : data._id,
                    top: data._top + "px",
                    left: data._left + "px",
                    height: data._height + "px" ,
                    width: data._width + "px",
                    select: option
                }
            ];
        });
    } else {
        select_data = [];
    }

</script>


{#if select_data && select_data.length > 0}
    <div key={"select_" + index + select_data.length}>
        {#each select_data as data, index}
            <div
                key={index}
                id= {data.id}
                class="drag-resize cursor_move ui-draggable ui-resizable"
                style="
                    position: absolute;
                    top: {data.top};
                    left: {data.left};
                    height: {data.height};
                    width: {data.width};
                "
            >
                <select
                    class = {data.id + " elem dnd_select min_height_0"}
                    disabled="disabled"
                >
                    {#if data.select.length}
                        {#each data.select as option}
                            {#if option.selected == 1} 
                                <option selected="selected" key={option.key} data-correctans={option.correctans} data-defaultans={option.defaultans} data-userans="" value={option.key + 1}>{option.text}</option>
                            {:else}
                                <option key={option.key} data-correctans={option.correctans} data-defaultans={option.defaultans} data-userans="" value={option.key + 1}>{option.text}</option>
                            {/if}
                        {/each}
                    {:else}
                        <option>Please Select</option>
                    {/if}
                </select>
                <div 
                    class="btn-group tools h" 
                    data-t="dropdown"
                >
                    <button type="button" on:click={(event)=> elemModal("dropdown", event.currentTarget, data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                    <button type="button" on:click={()=> deleteElem("dropdown", data.id)} class="btn btn-light p-sm">
                        <i class="icomoon-new-24px-delete-1"></i>
                    </button>
                </div>
                <div class="resizer icomoon-resize"></div>
            </div>
        {/each}
    </div>
{/if}