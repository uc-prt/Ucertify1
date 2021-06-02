<script>
    import { createEventDispatcher } from 'svelte';
    export let classVal, funcClick, buttonName, disabledValue=false, id, modalbtn, key="";
    const dispatch = createEventDispatcher();
</script>
<button
    type="button"
    id={id}
    class="{classVal}"
    on:click={(e)=>dispatch('updateXmlValue', {index: key, func: funcClick, value: e})}
    disabled={disabledValue}
>
    <span class="d-flex align-items-center">
        {#if modalbtn != 1}<span class="icomoon-new-24px-add-circle-1 s3 me-1"></span> {/if}{buttonName}
    </span>
</button>