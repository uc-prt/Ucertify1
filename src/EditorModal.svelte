<script>
    export let visible = false;
    export let modal;
    export let beforeCloseFunc = null;
    import { Dialog, Button } from 'svelte-mui';
</script>

<Dialog beforeClose={beforeCloseFunc} style="background-color:#fff; border-radius: 5px;max-width: {Math.max(modal.width, 590)}px; width: 100%; font-size: 14px;" bind:visible>
    <h4 class="mt-1 font21 mb-4" style="text-align: left; {modal.header.style}">
        {@html modal.header.body}
    </h4>
    <div class="modalContent" style="overflow-y: auto; overflow-x: hidden; {modal.body.style}">{@html modal.body.body}</div>
    <div slot="actions" class="actions center" style="display: {modal.action ? 'block' : 'none'}">
        {#if modal.action}{@html modal.action.body} {/if}
    </div>
    <div slot="footer" class="svelteFooter">
        <Button color="#ccc" unelevated={true} outlined={true} on:click={()=> visible = false}>Cancel</Button>
        {#each modal.footer.body as item, index}
            <Button 
                on:click={item.onAction}
                class= {item.class}
                style = {item.style}
                color= {item.color || "primary"}
                unelevated={true}
            	outlined={true}
            >
                {item.label}
            </Button>
        {/each}
        
    </div>
</Dialog>
