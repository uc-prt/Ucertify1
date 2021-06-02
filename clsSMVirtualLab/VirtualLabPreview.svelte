<script>
	import { beforeUpdate } from "svelte";
	export let editorState;
	let xml;


	beforeUpdate(()=> {
		if (xml != editorState.xml) {
			xml = editorState.xml;
		}
	})
	
</script>
<div id="VirtualLabPreview" style="white-space: pre-wrap;word-wrap: break-word;font-weight: bold">
	{xml}
</div>