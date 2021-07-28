<!--
 *  File Name   : DragNDropPreview.svelte
 *  Description : Responsible for Preview Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (Preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
	// Importing all the required components
	import { onMount, beforeUpdate, afterUpdate } from 'svelte';
	import ItemHelper from '../helper/ItemHelper.svelte';
	import { AH, onUserAnsChange, XMLToJSON } from "../helper/HelperAI.svelte";
	import { writable } from "svelte/store";
	import DND from './libs/preview/dndString';
	import TextboxPreview from './libs/preview/TextboxPreview.svelte';
	import DragPreview from './libs/preview/DragPreview.svelte';
	import DropPreview from './libs/preview/DropPreview.svelte';
	import SelectPreview from './libs/preview/SelectPreview.svelte';
	import RadioPreview from './libs/preview/RadioPreview.svelte';
	import MultilineboxPreview from './libs/preview/MultilineboxPreview.svelte';
	import CheckboxPreview from './libs/preview/CheckboxPreview.svelte';
	import TabheadPreview from './libs/preview/TabheadPreview.svelte';
	import LabelPreview from './libs/preview/LabelPreview.svelte';
	import HotspotPreview from './libs/preview/HotspotPreview.svelte';
	import MenulistPreview from './libs/preview/MenulistPreview.svelte';
	import ButtonPreview from './libs/preview/ButtonPreview.svelte';
	import StepPreview from './libs/preview/StepPreview.svelte';
	import TabPreview from './libs/preview/TabPreview.svelte';
	import l from '../src/libs/Lang';
	import './css/dragndrop.min.css';


	// exporting the variables
	export let xml;
	export let uxml;
	export let isReview;
	export let showAns;
	export let editorState;

	// initializing the variable
	let QXML = "";
	let image_loaded = 0;
	let bgImg = "";
	let imgHeight = "";
	let imgWidth = "";
	let step = [];
	let alt = "";
	let totalcorrectans = 0;
	let borderclass = "";
	let borderclassname = 'img-bordered';
	let container_id = 'dndmainPreview';
	let moduleType = 1;
	let state = {};
	// writable for preview
	let preview_store = writable({
		xml: '',
		check: "checked",
		totalcorrectans: "",
		review : false,
		data: [],
	})

	// subscribing to the store
	const unsubscribe = preview_store.subscribe(value => {
		state = value;
	});

	// this is called for the first time use for binding the events
	onMount( async function() {
		if (window.inNative) {
			if (typeof window.getHeight == "function") {	
				window.getHeight && window.getHeight();
			}
		}

		if (xml) {
			AH.setCss( document.getElementById('dndsteps'), {
				display: 'none'
			});
		}

		AH.listen(document, 'click', '.record', function(current_element) {
			if (!current_element.classList.contains('lab_disable'))
            current_element.setAttribute("clicked", 1);
        });

		AH.listen('body', 'click', '#reviewUserAns', function() {
			// for your ans
			AH.selectAll('#sm_controller button', 'removeClass', 'active');
			AH.addClass('#sm_controller .your-ans', 'active');
			yourAnswer();
		});

		AH.listen('body', 'click', '#reviewCorrectAns', function() {
			// for correct ans
			AH.selectAll('#sm_controller button', 'removeClass', 'active');
			AH.addClass('#sm_controller .correct-ans', 'active');
			correctAnswer();
		});

		AH.listen(document, 'click', '#'+ container_id, function() {
			displayAns();
		});

		AH.listen(document, 'keyup', '#'+ container_id, function() {
			displayAns();
		});

		AH.listen(document, 'change', '#'+ container_id, function() {
			displayAns();
		});

		AH.listen(document, 'mouseup', '#'+ container_id, function() {
			displayAns();
		});
		
		// prevent to open context menu
		AH.bind('body', 'contextmenu', function(event) {
			event.preventDefault()
		});
		
	})

	// call everytime when updating will happen
	afterUpdate(async() => {
		// if there is change in xml
		if (state.xml != xml) {
			loadModule(xml);
		}
		// run only in case of editor no need to run it in case of preview
		// if (state.review != isReview && editorState ) { // Its creating issue in student area
		if (state.review != isReview ) {
			preview_store.update( (item) => {
				item.review = isReview;
				return item;
			});
			if (isReview) {
				displayAns();
				DND.modeOn(1);
				DND.showansdrag("#" + container_id, 'u', 1);
				AH.selectAll('#sm_controller button', 'removeClass', 'active');
				AH.addClass('#sm_controller .your-ans', 'active');
			} else {
				DND.modeOn(0);
			}
			
		}
	});

	

	// for checking the answer and creating the user ans
	function displayAns() {
		let result = DND.checkAns("#"+ container_id);
		if (typeof(is_sm) != "undefined") AH.showmsg(result.ans ? "Correct" : "Incorrect", 3000);
		if (editorState) {
			showAns(result.ans ? "Correct" : "Incorrect");
		}
		onUserAnsChange(result);
	}

	// call whenever there is change in xml and changes the module accordingly
	function loadModule(loadXml) {
		let newXml = XMLToJSON(loadXml);
		parseXMLPreview(newXml);
		totalcorrectans = setTotalCorrectAns(newXml);
		preview_store.update( (item) => {
			item.xml = loadXml;
			item.totalcorrectans = totalcorrectans;
			item.data = loadNestedModule(newXml);
			return item;
		});

		checkImages();
		refreshModule();
	}

	// whenever the module will refresh means there is change in xml it will called 
	function refreshModule() {
		let dnd_timeout = setTimeout(function() {
			DND.readyThis("#"+ container_id);
			DND.showansdrag("#" +container_id, 'u');
			if (isReview) {
				// if review mode is on
				displayAns(); // display the answe
				DND.modeOn(1); // for showing correct answer and your answer tab
				DND.showansdrag("#" + container_id, 'u', 1);
				AH.selectAll('#sm_controller button', 'removeClass', 'active');
				AH.addClass('#sm_controller .your-ans', 'active');
			} else {
				try {
					DND.modeOn(0);
					if (typeof(showAns) == 'undefined') {
						displayAns();
					}
				} catch (err) {
					console.warn({err: err});
				}
			}
			clearTimeout(dnd_timeout);
		}, 500);
	}

	// parse the xml for preview
	function parseXMLPreview(MYXML) {
		try {
			// getting he required data
			QXML = MYXML;
			bgImg = MYXML.smxml._bgimg;
			moduleType = MYXML.smxml._type || 1;
			alt = (MYXML.smxml._alt) ? MYXML.smxml._alt : "";
			imgHeight = MYXML.smxml._height;
			imgWidth = MYXML.smxml._width;
			borderclass = (MYXML.smxml._borderrequired == 1) ? borderclassname : '';
			step = MYXML.smxml.step;
			if (Array.isArray(step) == false && step) {
				step = [];
				step[0] = QXML.smxml.step;
			}
		} catch (error) {
            console.warn({
				error,
				fun: 'parseXMLPreview',
				file: 'DragNDropPreview.svelte'
			});
		}
	}

	// setting the container height and width on the basis of image height and width
	function checkImages(is_image_load) {		
		let container = document.querySelectorAll("#" + container_id + " img");
		if (container.length > 0) {
			container.forEach(function (value) {
				if (value.complete) {
					let originalHeight = value.clientHeight > value.naturalHeight ? value.clientHeight : value.naturalHeight;
					let originalWidth = value.clientWidth > value.naturalWidth ? value.clientWidth : value.naturalWidth;
					if (Number(originalWidth) != 0 || Number(originalHeight) != 0 || (typeof from_myproject != "undefined" && from_myproject ==  1)) {
						AH.setCss("#" + container_id, {
							height: ((imgHeight && imgHeight >= originalHeight) ? imgHeight : originalHeight) + "px",
							width: ((imgWidth && imgWidth >= originalWidth) ? imgWidth : originalWidth) + "px"
						})
					}
				}
			})
		}
		if (is_image_load == 1 || is_image_load == 2) {
			image_loaded = 1;
			if (window.inNative) {
				window.postMessage(`height___${ AH.select("#" + container_id+">img").naturalHeight }`)
			}
			refreshModule();
		}
	}

	// for getting the total no of correct answers
	function setTotalCorrectAns(qXml) {
		var item = qXml ? qXml.smxml : null;
		var count = 0;
		// if there is xml
		if(item) {
			// iterating throgh the xml and store the elements in item 
			for (let i in item) {
				if (Array.isArray(item[i]) == false) {
					let arr = [];
					arr.push(item[i]);
					item[i] = arr;
				}
			}
			/** Counting the total length of the element **/
			if (item['drop']) {
				count = count+item['drop'].length;
			}
			if (item['select']) {
				count = count+item['select'].length;
			}
			if (item['textbox']) {
				count = count+item['textbox'].length;
			}
			if (item['checkbox']) {
				count = count+item['checkbox'].length;
			}
			if (item['radio']) {
				item['radio'].map(function(data) {
					if(parseInt(data._correctans) == 1) {
						count = count+1;
					}
				});
			}
			if (item['hotspot']) {
				item['hotspot'].map(function(data) {
					let innerText = JSON.parse(((data.__text)?data.__text:data.__cdata));
					count = count+Object.keys(innerText).length;
				})
			}

			if (item['jscript']) {
				try {
					eval.call(window, item['jscript'][0]);
				} catch (e) {
					console.warn(e);
				}
			}
			return count;
		}
	}

	// convert object to lower case
	function objToLower(obj) {
		let newX = {};
		for ( let index in obj ) {
			newX[index.toLowerCase()] = obj[index];
		}
		return newX;
	}

	// return the data of the nested module according to the xml
	function loadNestedModule(qXml) {
		var smxml = qXml ? qXml.smxml : null;
		var customDrag = [], customDrop = [];
		if (smxml) {
			if (smxml.div) {
				smxml.div.map(function(data,i){
					data = objToLower(data);
					if (data._anskey == "" || data._anskey == undefined) {
						/*added this condition because key was diffrent with id*/
						if (data._key.indexOf("key") <= -1) {
							data._id = "ID"+data._key;
							data._key = "key"+data._key;
						}
						/********/
						customDrag.push(data);
					} else {
						let id = data._id.split("ID");
						/*added this condition because key was diffrent with id*/
						if (data._key.indexOf("key") <= -1) {
							data._id = "ID"+data._key;
							data._key = "key"+data._key;
							data._anskey = "ID"+data._anskey;
							/********/
						} else {
							let key = data._key.split("key");
							if (id[1] == key[1]) {
								let k = data._anskey.split("key");
								let k2 = k[1];
								if (k2) data._anskey = "ID"+k2;
							} else if (parseInt(id[1]) != parseInt(key[1])) {
								if (data._anskey.indexOf("ID") <= -1) {
									data._anskey = "ID"+key[1];
								}
							}
						}
						customDrop.push(data);
					}
				});
			}

			return [smxml, customDrag, customDrop];
		}
	}

	// for the correct answer
	function correctAnswer() {
		DND.showansdrag('#'+container_id, 'c',1);
	}

	// for showing the user ans
	function yourAnswer() {
		DND.showansdrag('#'+container_id, 'u',1);
	}

	// call on the setreview function
	function setReview() {
		displayAns();
		isReview = true;
		DND.modeOn(1);
	}

	// unset review function
	function unsetReview() {
		isReview = false;
		DND.modeOn(0);
	}

	// for changing the load stte
	function changeLoadState() {
        AH.select('#pre_sample_image').remove();
        image_loaded = 1;
	}
</script>

<div>
	<ItemHelper 
		on:setReview = {setReview}
		on:unsetReview = {unsetReview}
	/>
	
	<div id="dndsteps" class="h" >
		<input id="base" type="radio" on:click={() => DND.setStep('base')} defaultValue="1" defaultChecked name="rbs" class="baseradio dndradio" /> 
		{l.base_steps}
		{#if step && step.length}
			{#each step as data, index}
				<span key={index}>
					<input 
						id={"step_dnd" + data._id} 
						type="radio" 
						on:click={() => DND.setStep("dnd" + data._id)} 
						defaultValue="1" 
						name="rbs" 
						class="baseradio dndradio" 
					/>
					{"dnd" + data._id}
				</span>
			{/each}
		{/if}	
	</div>

	<center>
		<div class="btn-group mb-xl clearfix review h mb-3" id="sm_controller">
			<button 
				type="button" 
				class="btn btn-light correct-ans" 
				id="reviewCorrectAns" 
			>{l.correct_answer}</button>
			<button 
				type="button" 
				class="btn active your-ans btn-light" 
				id="reviewUserAns" 
				style="margin-left:-4px;"
			>
				{l.your_answer}
			</button>
		</div>
                    
		<div
			id={container_id}
			zoom=""
			totalcorrectans = {totalcorrectans}
			class="container_div"
		>
			{#if bgImg}
				<img on:error={(e)=>{e.target.onerror = null; e.target.src="https://s3.amazonaws.com/jigyaasa_content_static/" + bgImg}} height={imgHeight+"px"} width={imgWidth+"px"} src={window.inNative ? "____s3.amazonaws.com__jigyaasa_content_static__"+bgImg.replace(/\//g,'__') : "https://s3.amazonaws.com/jigyaasa_content_static/"+bgImg} class={borderclass} alt={alt ? alt : l.sample_img} on:load={() => {checkImages(1)}}/>
			{:else}
                <img id="pre_sample_image" src="https://s3.amazonaws.com/jigyaasa_content_static/bg_000PLn.png" alt="{l.sample_img}" on:load={changeLoadState}/>
            {/if}

			{#if state.data && image_loaded}
				<DragPreview modules={state.data[0].drag} containerID={container_id} />
				<DragPreview modules={state.data[1]} containerID={container_id} />
				<DropPreview modules={state.data[0].drop} containerID={container_id} uxml={uxml}/>
				<DropPreview modules={state.data[2]} containerID={container_id} uxml={uxml}/>
				<SelectPreview modules={state.data[0].select} containerID={container_id}  uxml={uxml}/>
				<TextboxPreview modules={state.data[0].textbox} containerID={container_id} uxml={uxml}/>
				<RadioPreview modules={state.data[0].radio} containerID={container_id} uxml={uxml}/>
				<MultilineboxPreview modules={state.data[0].multilinebox} containerID={container_id} uxml={uxml} />
				<CheckboxPreview modules={state.data[0].checkbox} containerID={container_id} uxml={uxml} />
				<TabheadPreview modules={state.data[0].tabhead} containerID={container_id} />
				<LabelPreview modules={state.data[0].label} containerID={container_id} />
				<HotspotPreview modules={state.data[0].hotspot} module_type={moduleType} containerID={container_id} uxml={uxml} />
				<MenulistPreview modules={state.data[0].menulist} containerID={container_id} />
				<ButtonPreview modules={state.data[0].button} containerID={container_id} />
				<StepPreview modules={state.data[0].step} containerID={container_id} {checkImages} uxml={uxml}/>
				<TabPreview modules={state.data[0].tab} containerID={container_id} {checkImages} uxml={uxml}/>
				{#if state.data[0].hotspot}
					<img class="targetImg" tabindex="0" alt="target_img" src={window.itemFolder +"images/target.png"} style="display: none" />
				{/if}
			{/if}
		</div>
	</center>
</div>

<style>
	#dndsteps {
		text-align: center;
		border: 1px solid #999999;
		background-color: #DDDDDD;
		width: 100%;
	}
	:global(#sm_controller) {
        margin-top: 20px;
        display: none;
    }
	:global(.correct_incorrect_icon) {
		z-index: 9 !important;
	}
	:global(input.dnd_textbox) {
		text-align: center;
		border-radius: 4px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>