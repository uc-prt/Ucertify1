<script>
    import { createEventDispatcher } from 'svelte';
    export let btnClass = '', btnName, id;
    const dispatch = createEventDispatcher();
</script>
<button 
    type="button" 
    class="btn btn-sm btn-outline-primary {btnClass}" 
    id="{id}"
    on:click="{()=>dispatch('btnClick')}"
>
    <span class="icomoon-new-24px-add-circle-1 s3"></span>
    <span class="position-relative top1">{btnName}</span>
</button>