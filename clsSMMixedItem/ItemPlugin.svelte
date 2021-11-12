<script>
    import NewAuthoring from '../clsSMStepAlgo/StepAlgo.svelte';

    export let xml;
    export let editorState;
    export let getChildXml;
    export let stopAuthoringUpdate;
    export let uxml;
    export let showAns;
    

</script>
<main>
    {#if parseInt(editorState.content_icon) == 2}
        <NewAuthoring xml = {xml} getChildXml = {getChildXml} stopAuthoringUpdate = {stopAuthoringUpdate} uxml={uxml} showAns={showAns} />
    {/if}
</main>