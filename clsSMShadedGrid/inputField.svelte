<script>
    import { createEventDispatcher } from 'svelte';
    import l from '../src/libs/editorLib/language';
    export let labelname;
    export let datalabel;
    export let name, id, max, value, msgdetail, shwmsg, set_corr_ans;
    const dispatch = createEventDispatcher();
</script>
{#if set_corr_ans == 1}
    <input 
        type="number" 
        min="1" 
        max={max} 
        class="form-control inputChange" 
        id="methodCount" 
        name="methodCount" 
        data-label="Number of correct" 
        value={value} 
        on:change="{(e)=>dispatch('handleChange', {value: e})}"
        on:blur="{(e)=>dispatch('inputChangeBlur', {value: e})}"
    />
{:else}
    <div class="col-sm-6 inline-block">
        <div class="font-weight-bold mb-2">{labelname}</div>
        <div>
            <input type="number" min="1" max="{max}" name="{name}" id="{id}" class="form-control width100 inline-block inputChange" data-label="{datalabel}" 
                value={value} on:change="{(e)=>dispatch('handleChange', {value: e})}" on:blur="{(e)=>dispatch('inputChangeBlur', {value: e})}"/>
        </div>
        {#if shwmsg == 1}
            <div class="mt-1">
                <span class="font13 text-danger">
                    <span class="icomoon-24px-info-5 pr-1"></span>
                    {l.multiple_of} {msgdetail}px
                </span>
            </div>
        {/if}
    </div>
{/if}