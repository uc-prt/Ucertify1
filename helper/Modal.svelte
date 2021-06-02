<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>
<div class="backdrop" on:click="{()=>dispatch('cancel')}"></div>
<div class="modalSvelte">
    <header><slot name="header"/></header>
    <div class="content"><slot/></div>
    <footer>
        <slot name="footer ">
            <button class="modalSvelteClose" on:click="{()=>dispatch('close')}">Close</button>
        </slot>
    </footer>
</div>