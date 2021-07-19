<!--
 *  File Name   : ItemHelper.svelte
 *  Description : Responsible for setting review
 *  Author      : Pradeep Yadav
 *  Package     : Editor
 *  Last update : 10-Dec-2020
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { createEventDispatcher } from 'svelte';
    export let reviewMode = false;
    export let handleReviewClick;
    const dispatch = createEventDispatcher();
    function handleSmClick(event) {
        document.querySelectorAll('.smControlerBtn button').forEach((el)=> el.classList.remove('active'));
        event.target.classList.add('active');
        if (handleReviewClick) handleReviewClick(event.target.getAttribute('mode'), event);
    }
</script>
<center>
<button tabindex="0" type="button" class="h h-imp" id="set-review" on:click="{()=>dispatch('setReview')}"></button>
<button tabindex="0" type="button" class="h h-imp" id="unset-review" on:click="{()=>dispatch('unsetReview')}"></button>
{#if reviewMode}
    <div class="smControlerBtn btn-group mb-3" role="group" aria-label="Answer buttons">
        <button tabindex="0" type="button" mode="c" class="btn btn-light correct-ans" on:click="{handleSmClick}">Correct Answer</button>
        <button tabindex="0" type="button" mode="u" class="btn btn-light your-ans active" on:click="{handleSmClick}">Your Answer</button>
    </div>
{/if}
</center>
<style>
    :global(.smControlerBtn .btn-light:not([disabled]):not(.disabled).active) {
        color: #fff!important;
        -webkit-box-shadow: inset 0 2px 0 #1266f1!important;
        box-shadow: inset 0 2px 0 #1266f1!important;
        background-color: #2572f2!important;
        border-color: #2572f2!important;
        border-top-color: #0c57d3!important;
    }
</style>
