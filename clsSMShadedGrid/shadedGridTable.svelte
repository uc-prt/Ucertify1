<script>
    import { createEventDispatcher } from 'svelte';
    export let table_id, table_class, total_row_count, table_value;
    const dispatch = createEventDispatcher();
</script>
<table id={table_id} class={table_class}>
    <tbody>
        {#if total_row_count && total_row_count.length > 0}
            {#each total_row_count as data, i}
                <tr id={data.id}>
                    {#if table_value && table_value.length > 0}
                        {#each table_value as value}
                            {#if i == value.rowno}
                                <td 
                                    id={value.id} 
                                    data-hidden="no" 
                                    tabindex="0" 
                                    data-grid="no" 
                                    data-id={value.dataid} 
                                    class={`${value.class} gridColor pointer`}
                                    on:click="{(e)=>dispatch('gridClick', {value: e})}"
                                    on:keyup="{(e)=>dispatch('adaKeyupClick', {value: e})}" 
                                    style="width: {value.width}; height: {value.height}"
                                ></td>
                            {/if}
                        {/each}
                    {/if}
                </tr>
            {/each}
        {/if}
    </tbody>
</table>