<script>
    import { createEventDispatcher } from 'svelte';
    import { fade, scale} from 'svelte/transition';
    export let width = 300;
    export let backdrop = true;
    export let closeByEsc = true;
    let height = window.innerHeight;
    const dispatch = createEventDispatcher();
    let drawer;

    function handle_keydown(event) {
        if (event.keyCode == 27 && closeByEsc) {
            dispatch('close');
        }
    }
</script>

<svelte:window on:keydown={handle_keydown}/>
<div class="drawer" role="dialog" aria-modal="true" bind:this={drawer}>
    {#if backdrop}<div id="backdrop" transition:fade on:click={()=> dispatch('close')}></div>{/if}
    <div 
        class="drawerBody" 
        transition:scale
        style="height:{height}px; width: {width}px;"
    >
        <div class="drawerHeader"><slot name="header"></slot></div>
        <div class="drawerContent">
            <slot name="content"><span>Enter Content here...</span></slot>
        </div>
    </div>
</div>

<style>
    .drawer {
        border: 1px solid gray;
        position: fixed;
        top: -1px;
        left: -1px;
    }
    #backdrop {
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: 99;
        background: rgba(0,0,0,0.3);
    }
    .drawerBody {
        position: absolute;
        overflow-y: auto;
        background: white;
        z-index: 99999999999999999999;
    }
</style>