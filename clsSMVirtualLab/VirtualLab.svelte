<script>
	import { onMount } from "svelte";
	export let getChildXml;
	export let editorState;

	onMount(()=> {
		document.querySelector('#xml').value = (editorState.xml);
	});
	function changeXml(e) {
		getChildXml(e.target.value);
	}
</script>
<center>
	<div id="VirtualLab">
		<textarea id="xml" style="min-height: 250px; width:550px;" on:change={changeXml}></textarea>
	</div>
</center>