<script>
    import StepAlgoPreview from '../clsSMStepAlgo/StepAlgoPreview.svelte';

    export let xml;
    export let remedStatus;
    export let showAns;
    export let stopPreviewUpdate;
    export let editorState;
    export let content_icon;
    export let isReview;
    export let uxml;


</script>

<main>
    {#if editorState?.content_icon == 2 ||  content_icon == 2}
        <StepAlgoPreview xml = {xml} remedStatus = {remedStatus} showAns = {showAns} stopPreviewUpdate = {stopPreviewUpdate} isReview = {isReview} uxml={uxml}  />
    {/if}
</main>