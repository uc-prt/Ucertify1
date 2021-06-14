<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let loop;
    export let className;
    export let class1;
    export let tableId;
    export let tableClass;
    export let value;
    
   

   
</script>
<table id={tableId} class={tableClass} > 
    <tr>
        {#each loop as val,i}
            {#if val.decpoint == true}
                <td key={val.key} class={class1}  width="50" disabled="true">
                </td>
            {:else}
                <td width="50" class="text-center">
                    <span id={val.id} name={val.name} data-tag={val.dataTag} class={className}  height="20" on:click="{(e)=>dispatch('handleClickCombo',e)}">{value}</span>
                </td>
            {/if}
        {/each}
    </tr>
</table>

<style>
.gridded_tab {
    background-color: #f0f0f0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.minus_tab,
.plus_tab,
.slash_tab {
    text-align: center;
}

.items_element:hover {
    border: 1.2px solid #777;
}

.sla_point {
    padding: 6px 11px;
}

table {
    border-width: 0px!important;
}

</style>