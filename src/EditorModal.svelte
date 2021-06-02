<script>
    export let visible = false;
    export let modal;
    export let updateEditorModule;
    export let beforeCloseFunc = null;
    import { Dialog, Button } from 'svelte-mui';
    import { beforeUpdate , tick } from 'svelte';
    beforeUpdate(async()=> {

    });
</script>

<Dialog width={modal.width} beforeClose={beforeCloseFunc} bind:visible>
    <div slot="title" style="text-align: left; {modal.header.style}">
        {@html modal.header.body}
    </div>
    <div class="modalContent" style="overflow-y: auto; overflow-x: hidden; {modal.body.style}">{@html modal.body.body}</div>
    <div slot="actions" class="actions center" style="display: {modal.action ? 'block' : 'none'}">
        {#if modal.action}{@html modal.action.body} {/if}
    </div>
    <div slot="footer" class="svelteFooter">
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
        <Button color="#ccc" unelevated={true} outlined={true} on:click={()=> visible = false}>Cancel</Button>
    </div>
</Dialog>
