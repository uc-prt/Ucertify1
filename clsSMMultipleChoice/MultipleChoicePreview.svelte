<script>
	import { beforeUpdate, onMount } from "svelte";
	import { writable } from "svelte/store";
	import { AH } from "../helper/HelperAI.svelte";
	import OptionContainer from "./OptionContainer.svelte";
	export let isReview;
	export let editorState;

	let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	let state = {};
	let hdd = writable({
			correctAnswers:"",
			optionData:"",
			reviewMode:false
		});
	const unsubscribe = ((items)=> {
		state = items;
	});

	onMount(async()=> {
		loadOldModule();
	});

	beforeUpdate(async()=> {
		loadOldModule();
		if (isReview != state.reviewMode) {
			state.reviewMode = isReview;
        }
	})

	function loadOldModule() {
		state.correctAnswers = editorState.mcqAjaxData.correct_answers;
		state.optionData = editorState.mcqAjaxData.answers;
		setTimeout(function() {
			AH.addClass(AH.find("#previewSection", ".prettyprintReplica", 'all'), ["prettyprint", "linenums"]);
			try {
				(JSON.stringify(editorState.mcqAjaxData.answers).match(/<uc:syntax/gm)) ? prettyPrint() : '';
			} catch(e) {
				console.warn(e);
			}
			AH.addClass(AH.find("#previewSection", ".prettyprint"), "prettyprintReplica");
			AH.addClass(AH.find("#previewSection",".prettyprintReplica"), ["prettyprint", "linenums"]);
		}, 200);
	} 
</script>

{#if state.optionData}
	<OptionContainer 
		letters={letters} 
		correctAnswers={state.correctAnswers} 
		reviewMode={state.reviewMode} 
		data={state.optionData} 
		previewMode={true}
	/>
{/if}