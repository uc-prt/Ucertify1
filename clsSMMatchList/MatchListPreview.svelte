
<!-- 
*  File Name   : MatchListPreview.svelte
*  Description : Drag the option
*  Author      : Sundaram Tripathi
*  Version     : 1.0
*  Package     : svelte_items
*  Last update :  04-june-21 
-->
<script>

	
	import {Draggable} from "../src/libs/javscript_helper/JUI.js";
	//import smVal from '../lib/ValidateItems';
	import l from '../src/libs/Lang';	
	import { beforeUpdate, onMount } from 'svelte';
	import ItemHelper from '../helper/ItemHelper.svelte';
	import ucMlid from './matchlistJSString';
	import {AH,XMLToJSON,onUserAnsChange} from "../helper/HelperAI.svelte";
	import './css/matchList.min.css';
	import { Button, Dialog } from 'svelte-mui/src';
	
	export let user_guid;
	export let showAns;
	export let cmed;
	export let xml;
	export let isReview;
	export let uxml;
	export let editorState;

	let listheading1 = "";
	let listheading2 = "";
	let multimatch = "";	
	let list1 = [];
	let list2 = [];
	let cdata = "";
	let isShuffeled = false;
	let totalCorrectAns = 0;
	let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	let is_algo = false;
	let max_node = 0;
	let is_remediation = false;
	let match_lines = [];
	let errorCatchFlag = 1;
	let originalseq1 = "";
	let originalseq2 = "";
	ucMlid.sinfo = true;
	// let setList1Html;
	// let setList2Html;
	let btnflag = 1;
	let listenCall = 0;
	let containerID = (cmed) ? "matchmain" + cmed : "matchmain";
	let dragable;
	var top1 = 0;
	//let ucMlid = {};

	let state = {
		xml: '',
		remedStatus:'',
		dropDialog:'',
		isReview: false,
	}

	$: {
	if (isReview == true) {
			
			// for displaying the ans
			displayAns();
			AH.select("#shuffleArea", "hide" );
			ucMlid.modeOn("on");
			// if mode is normal or swap list
			if (multimatch == 1 || multimatch == 0) {
				AH.select(".both-ans").click();
				//AH.find("#"+containerID , "#sm_controller", {action: "addClass", actionData: "h"});
				AH.select("#"+containerID +" #sm_controller",'addClass','h');
				//AH.find("#"+containerID, "#sm_controller_default", {action: 'removeClass', actionData: 'h'});
				AH.select("#"+containerID +' #sm_controller_default','removeClass','h')
				//AH.find("#"+containerID, "#sm_controller_default", "css", {display:'inline-block'});
				AH.select("#"+containerID+ " #sm_controller_default","css",{display:"inline-block"})
			} else {
				// if mode is drag & drop
				
				//jQuery("#"+containerID).find("#sm_controller_default").addClass("h");
				AH.select("#"+containerID+" "+"#sm_controller_default","addClass","h");

				//jQuery("#"+containerID).find("#sm_controller").removeClass("h");
				AH.select("#"+containerID + " " + "#sm_controller","removeClass","h");
				setTimeout(function(){
					document.getElementsByClassName("your-ans")[0].click();
				},500);
			}
		} else {
			// if remdiation mode is off
			isReview = false;
			//jQuery("#"+containerID).find("#sm_controller_default").css("display", "none");
			AH.select("#"+containerID+" "+"#sm_controller_default","css",{display:'none'});
			
			if(isShuffeled == true) {
				AH.select("#shuffleArea","css",{display:'none'});
			} else {
				AH.select("#shuffleArea","css",{display:"block"});
			}
			// set the user ans in the module 
			ucMlid.modeOn();
		}
	}
	// for displaying the answer
	function displayAns() {
		let ans = ucMlid.checkAns("#"+containerID);

		onUserAnsChange({uXml:ans.u,ans:ans.ans});

		if(editorState) {
			showAns(ans.ans ? 'Correct' : 'Incorrect');
		}
	}

	function loadLibs() {
        let config = {
            preload: true,
            type: 'stylesheet',
            as: 'style'
        }
		AH.createLink("https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css", config);
		//AH.createLink(itemUrl+'css/matchList.min.css');
		//AH.createLink(baseThemeURL + 'svelte_items/clsSMMatchList/css/matchList.min.css', config);
    }
	
	onMount(async()=> {

		// ucMlid = await import ('./matchlistJSString');

		loadLibs();
		
		dragable = new Draggable({
			onDragEnter: ((event)=>{	
				AH.select(event.target,'addClass','drop-hover');
			}),
			onDragLeave:((event)=>{
				AH.select(event.target,'removeClass','drop-hover');
			}),
			onDragEnd:(event)=>{
				displayAns();

				AH.selectAll('.list2').forEach(function(data,_this){
					AH.select(data,'removeClass','drop-hover');
				})

				AH.selectAll('.list3').forEach(function(data,_this){
					AH.select(data,'removeClass','drop-hover');
				})
				

				
				if (!ucMlid.is_valid_drop) {
					if (ucMlid.sinfo) {
						ucMlid.sinfo = false;
						setTimeout(function() {
							ucMlid.sinfo = true;
						}, 60 * 1000);
						// if (!UCINFO.isIphone) {
							if (typeof(AH.alert) == 'function') 
								AH.alert('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.');
								
							if(ucMlid.chkDoNotShow(user_guid) != true) {
								state.dropDialog = true;
								// if (typeof(bindDialog) == 'function') 
									// bindDialog({ click: this, wd: 450, ht: 236, data: '<div title="How to drop?"><img src="' + jQuery(mlid).attr('path') + 'match_drop_000BOG.gif" /><br/><span><label><input type="checkbox" style="top:2px;" class="relative donotshowdialog"> Do not show this dialog again</label></span></div>' });
							}
						//}
					}
					// return true;
				}
        	}
		})
		
		// AH.listen(document,'mouseup','.shuffleList1',function(){
		// 	console.log('shuffleList1');
		// 	setTimeout(function(){
		// 		displayAns();
		// 	},200)
		// }) // Replaced

		// AH.listen(document,'mouseup','.shuffleList2',function(){
		// 	console.log('shuffleList2');
		// 	setTimeout(function(){
		// 		displayAns();
		// 	},200)
		// })

		AH.listen('#matchmain ','click','.matchlist-delete',function(e){
			setTimeout(function(){
				displayAns()
			},200)    
		})


		AH.listen(document,'click','#set-review',function(){
			setReview();
		}) 
		

		// binding up the unsetreview function 
		// jQuery("#unset-review").on('click',function(){
		// 	unsetReview();
		// });// Will Replaced

		AH.listen(document,'click','#unset-review',function() {
			unsetReview();
		}) 

		setTimeout(function(){ 
			//jQuery("#"+containerID+" img").on('load', function() {
			let imgContainerId = AH.select("#"+containerID+" img");
			AH.listen(document,'load',imgContainerId, ()=> {
				// if review mode is on
				if (isReview) {
					// if multimatch is normal or swap list
					if (multimatch == 1 || multimatch == 0) {
						
						
						AH.select("#"+containerID+" #sm_controller",'addClass','h');
						
						
						AH.select("#"+containerID+" #sm_controller_default","removeClass","h");
					}
					else {
						AH.select("#"+containerID+" #sm_controller_default",'addClass','h');
						AH.select("#"+containerID+" #sm_controller",'removeClass','h');

					}
					unsetReview();
					setReview();
				} else {
					setReview();
					unsetReview();
				}
			});
		}.bind(this),500);
		setTimeout(function(){
			listen();
		},1500);
	})

	// function for binding keyup using hotkeys function which is defined in prepengine-footer.js
	function listen(){
		if(listenCall > 3) return false;
		if(typeof hotkeys == "function"){
			setTimeout(function(){
				console.log("hotkey function is ",typeof hotkeys == "function")
				ucMlid.bindKeyup();
			},1000);
		} else{
			console.log("Hotkey try = ",listenCall);
			listenCall++;
			listen();
		}
	}

	// function calls when remediation mode is on it basically display the ans
	function setReview() {
		isReview = true;
		is_remediation = true;
		// check the answer
		displayAns();
		//jQuery("#shuffleArea").hide();
		if(document.querySelector('#shuffleAre')!=null)
		document.querySelector('#shuffleAre').style.display = "none"; //WIll Replaced
		// for showing the answer
		ucMlid.modeOn("on");
		// if mode is normal mode or swap list
		if(multimatch == 1 || multimatch == 0) {
			
			AH.find("#"+containerID,"#sm_controller").classList.add("h");
			
			AH.find("#"+containerID,"#sm_controller").style.display = "none";
			
			AH.find("#"+containerID,"#sm_controller_default").style.display = "inline-block";
			
			var timer = setTimeout(function() {
				//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
				AH.find("#"+containerID,'#sm_controller_default .both-ans').click();
				clearTimeout(timer);				
			}, 50);
		} else {
			// if drag & drop
			
			AH.select("#"+containerID+" "+"#sm_controller_default").classList.add("h");
			
			AH.find("#"+containerID,"#sm_controller_default").style.display = "none";
			
			AH.selectAll("#"+containerID+" "+"#sm_controller").style.display = "inline-block";
			//containerId.querySelector('#ssm_controller').style.display = "inline-block";

			var timer_next = setTimeout(function() {
				//jQuery("#"+containerID).find('#sm_controller_default .your-ans').click();
				AH.find("#"+containerID,'#sm_controller_default .your-ans').click();
				clearTimeout(timer_next);				
			}, 200);
		}
	}

	// function calls when remediation mode is off after on.
	function unsetReview() {
		isReview = false;
		//jQuery('.review_2, .review_default').addClass('h');
		AH.addClass('.review_2, .review_default','h');

		//jQuery('.review_2, .review_default').hide();
		let removeclass = document.querySelectorAll('.review_2, .review_default');
		for(let i = 0; i < removeclass.length; i++) {
			removeclass[i].style.display = "none";
		}
		// review_default2.style.display = "none";
		is_remediation = false;
		// if shuffled
		if(isShuffeled == true) {
			AH.select('#shuffleArea','css',{display:'none'});
		} else {
			AH.select('#shuffleArea','css',{display:'block'});
		}
		// set the user ans in the module 
		ucMlid.modeOn();
	}

	beforeUpdate(()=>{
		// checking for the change in the new xml
		if(state.xml != xml) {
			state.xml = xml;
			if(cmed) { 
				containerID = "matchmain"+cmed; 
				ucMlid.ajax_eId = "#matchmain"+cmed;
			}
			isShuffeled = false;
			AH.select('#shuffleArea','css',{display:'block'});
			// convert the xml into the json
			var newXml = XMLToJSON(xml);
			// parse the xml for the preview mode
			parseXMLPreview(newXml);
			//forceUpdate();  Only react uses
			runModule();
			/*For Shuffling */
			/*if(!window.QXML) {
				var err  = smVal.validate(this.props.content_type, this.props.subtype , this.props.content_icon);
				this.props.smValidate(err);
			}*/			
		}
	})

	// calls whenever xml is updated and update the module accordingly
	function runModule(){
		try{
			showModule();
		}catch(e) {
			if(errorCatchFlag<=100) {
				var timer = setTimeout(function() {
					runModule();
					clearTimeout(timer);
				},50);
			} else {
				console.log("runModule14:Error");
				console.log(e);
			}
			errorCatchFlag++;
		}
	}

	// it basically parse the user answer and calls only one time in test area 
	function parseUserAnswer() {
		let matchUa = XMLToJSON(uxml);
		if(uxml && matchUa.smans && matchUa.smans.matchlist && matchUa.smans.matchlist._userans) {
			let matchUa = XMLToJSON(uxml);
			let listseq1 = matchUa.smans.matchlist._list1seq.split(",");
			let listseq2 = matchUa.smans.matchlist._list2seq.split(",");
			originalseq1 = ((matchUa.smans.matchlist._originalseq1)? matchUa.smans.matchlist._originalseq1.split(",") : "" );
			originalseq2 = ((matchUa.smans.matchlist._originalseq2)? matchUa.smans.matchlist._originalseq2.split(",") : "" );
			/* Preserve List Sequence1*/
			let newArr = [];
			for (let i of listseq1) {
				for ( let j in list1 )  {
						if (list1[j]['id'] == i) {
						newArr.push(list1[j]);
					}
				}
			}
			list1 = newArr;
			/*****/
			/* Preserve List Sequence2*/
			let newArr2 = [];
			for (let i of listseq2) {
				for ( let j in list2 )  {
						if (list2[j]['id'] == i) {
						newArr2.push(list2[j]);
					}
				}
			}
			list2 = newArr2;
			/*****/	

			if(matchUa.smans.matchlist._userans) {
				const userAns = matchUa.smans.matchlist._userans.split(",");
				for(let k in userAns) {
					for(let m in list1) {
						let uans = userAns[k].split(/\[|\]/g)[1];
						uans = uans.split("|");
						for(let n in uans) {
							if(list1[m]['id'] == uans[n]) {
								list1[m]['userans'] += userAns[k].split(/\[|\]/g)[0]+",";
							}
						}
					}
				}
			}
			// self.forceUpdate(); it works only in react
		} else {
			// shuffle list 1
			list1 = shuffleArray(list1);
			
			// shuffle list 2
			list2 = shuffleArray(list2);
			
			// remove the user ans
			ucMlid.removeUserAns();
			
			//forceUpdate();
		}
		ucMlid.showUserAns("#"+containerID);
		ucMlid.remove_lines("#"+containerID);
		// set the user ans in the module 
		ucMlid.modeOn();
	}

	// it is called whenever xml is updated 
	function showModule() {
		// for checking user ans
		if(!uxml) {
			// remove the user ans if there is no user ans
			ucMlid.removeUserAns();
		}
		// adding draggable and drop events
		ucMlid.showUserAns("#"+containerID);
		ucMlid.remove_lines("#"+containerID);
		ucMlid.modeOn();
		if(!editorState) {
			// if it is open in test area parse the user answer
			//console.log('parseUserAnswer');
			parseUserAnswer();
		}

		// checking for the reviewMode
		if(isReview) {
			//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
			AH.find("#"+containerID,'#sm_controller_default .both-ans').click();
			var timer = setTimeout(function(){
				is_remediation = true;
				displayAns();
				AH.select("#shuffleArea",'css',{display:'none'});
				ucMlid.modeOn("on");
				if(multimatch == 1 || multimatch == 0) {
					
					AH.select("#"+containerID+" #sm_controller",'addClass','h');
					
					
					AH.select("#"+containerID+" #sm_controller_default","removeClass","h");
					
				}
				else {
					AH.select("#"+containerID + " #sm_controller_default",'addClass','h');
					AH.select("#"+containerID+" #sm_controller","removeClass","h");
				}
				clearTimeout(timer);
			},100);
			
		} else {
			//jQuery('.review_2, .review_default').addClass('h');
			let review = document.querySelectorAll(".review_2, .review_default");
			for(let i = 0; i < review.length; i++ ) {
				review[i].classList.add("h");
			}
		}
	}

	// it is called whenever xml is updated  and parse the xml for preview
	function parseXMLPreview(QXML) {
		try {
			list1 = [];
			list2 = [];

			// fetching value from the xml
			listheading1 = QXML.smxml.matchlist._listheading1;
			listheading2 = QXML.smxml.matchlist._listheading2;
			multimatch = QXML.smxml.matchlist._multimatch;
			cdata = QXML.smxml.matchlist.__cdata;
			// if is_algo is in xml, if is_algo is equal to true then set its value true otherwise set the valur to false
			if (QXML.smxml.matchlist._is_algo) {
				is_algo = (QXML.smxml.matchlist._is_algo == "true" ? true : false);
			} else {
				is_algo = false;
			}
			// checking for the max_node (max no of node)
			if (QXML.smxml.matchlist._max_node) {
				var num = Number(QXML.smxml.matchlist._max_node);
				max_node = ( num > 0 ? num : 0 );
			} else {
				max_node = 0;
			}
			
			// splitting the cdata with the new line
			cdata = cdata.split("\n");
			var count = 0;
			var countList1 =1;
			var multipleValue = false;
			var multipleValueList2 = false;
			var tempAns = "";

			// traversing through the cdata
			
				cdata.forEach(function(data,i) {
				if(cdata[i].trim() != "") {
					totalCorrectAns ++;
					var correctAns = "";
					// finding the text which start with [ and end with ]
					if(cdata[i].match(/\[(.*?)\]/g)) {
						// storing the value in ans then removing the brackets and spliting it with | symbol
						var ans = (cdata[i].match(/\[(.*?)\]/g)[0]);
						ans = ans.replace("[","").replace("]","");
						ans = ans.split("|");
					}
					// traversing through list 2 
					
					list2.forEach(function(data,l){
						if(list2[l].value == cdata[i].replace(cdata[i].match(/\[(.*?)\]/g),"").trim()) {
							tempAns = list2[l].id;
							multipleValueList2 = true;
						}
					});
					if(multipleValueList2 != true) {
						list2.push({
							id:alphabet[count],
							correctans:"",
							value: cdata[i].replace(cdata[i].match(/\[(.*?)\]/g),"").trim()
						});
						correctAns = list2[count].id;
					}else {
						correctAns = tempAns;
					}
					// traversing through list one
					
						list1.forEach(function(data1,k){
						if(list1[k].value == ans) { // value will never true as here string is comparing with array
							multipleValue = true;
							if(multipleValueList2 != true)
							{
								list1[k].correctans = list1[k].correctans+","+list2[count].id;
							} else {
								list1[k].correctans = list1[k].correctans+","+tempAns;
							}
						}
					});
					if(multipleValue !=true) {
						
						ans.forEach(function(data,i){
							list1.push({
								id:countList1,
								correctans:correctAns,
								userans:"",
								value: ans[i]
							});
							countList1++;
						});
					}
					multipleValue = false;
					((multipleValueList2 == false)?count++:"");
					multipleValueList2 = false;
				}
			});

			// for the max node
			if (max_node > 0 && max_node <= list1.length) {
				//  shuffling the list
				list1 = shuffleArray(list1);
				var temparr = [];
				for (var i = 0; i < max_node; i++) {
					temparr.push(list1[i]);	
				}
				list1 = temparr;
				temparr = [];
				temparr.length = 0;
				var f = 0;
				for (var i = 0; i < list1.length; i++) {
					var correctarr = list1[i].correctans.split(",");
					for (var j = 0; j < correctarr.length; j++) {
						for (var k = 0; k < list2.length; k++) {
							f = 0;
							if (correctarr[j] == list2[k].id) {
								if (temparr.length <= 0) {
									temparr.push(list2[k]);
								} else {
									for (var l = 0; l < temparr.length; l++) {
										if (correctarr[j] == temparr[l].id) {
											f = 1;
											break;
										}
									}
									if (f != 1) {
										temparr.push(list2[k]);
									}	
								}
							}
						}
					}
				}
				list2 = temparr;
			}
	    } catch(error) {
			console.log({error,fun:'ParseXMLPreview',file:'MatchlistPreview.svelte'});
		}
	}

	// shuffle the array
	function shuffleArray(array) {
	    for (let i = array.length - 1; i > 0; i--) {
	        let j = Math.floor(Math.random() * (i + 1));
	        let temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

	// shuffle the option
	function shuffleItems() {
		isShuffeled = true;
		ucMlid.removeUserAns();
		ucMlid.showUserAns("#"+containerID);
		ucMlid.remove_lines("#"+containerID);
		ucMlid.modeOn();
		list1 = shuffleArray(list1);
		list2 = shuffleArray(list2);
		AH.select('#shuffleArea','css',{display:'none'});
	}

	// it removes the dplicate element in a array
	function remove_duplicates_es6(arr) {
		arr = arr.filter (function (value, index, array) { 
			return array.indexOf (value) == index;
		});
		return arr;
	}

	let setList1;
	let setList2;

	// function randomChoice (arr) {
	// 	console.log("arr arr");
	// 	let randIndex = Math.floor(Math.random() * arr.length);
	// 	item.originalseq = randIndex; // change
	// 	return arr[randIndex];
	// }

	function setList1Html(item,count) { 
		function randomChoice (arr) {
			
			let randIndex = Math.floor(Math.random() * arr.length);
			item.originalseq = randIndex; // change
			return arr[randIndex];
		}	
		if (is_algo == true && is_remediation != true) {
			if(originalseq1) {
				var seq = originalseq1[i];
				item.originalseq = seq; // change
				item.value = item.value.split("%%")[seq];
			} else {
				item.value = randomChoice(item.value.split("%%"));
			}
		}
		let img_src = item.value.substr(1).split("##")[0].split('%%')[0]; // For alt implementating with ##
		let img_alt = (item.value.substr(1).split("##")[1]) ? item.value.substr(1).split("##")[1] : "";
		setList1 = `<span class="serial">${(count+1)}.</span>`+((item.value.charAt(0) == "*") ? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />` : (is_algo == true ? item.value : item.value));
		return setList1;

	}
	
	function setList2Html(item,count) {
		function randomChoice (arr) {
			var randIndex = Math.floor(Math.random() * arr.length);
			//data.originalseq = randIndex;
			item.originalseq = randIndex;
			return arr[randIndex];
		} 
		if (is_algo == true && is_remediation != true) {
			if(originalseq2) {
				var seq = originalseq2[i];
				data.originalseq = seq;
				item.value = item.value.split("%%")[seq];
			} else {
				item.value = randomChoice(item.value.split("%%"));
			}
		}
		let img_src = item.value.substr(1).split("##")[0].split('%%')[0]; // For alt implementating with ##
		let img_alt = (item.value.substr(1).split("##")[1]) ? item.value.substr(1).split("##")[1] : "";
		setList2 = `<span class="serial">${count}.</span>`+((item.value.charAt(0) == "*") ? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />` : (is_algo == true ? item.value : item.value))
		return setList2;
	}

	function handleReview(mode) {
		if (mode == 'c') {
			ucMlid.showAllCorrectAns('#'+containerID);
		} else {
			ucMlid.showAllAns('#'+containerID);
		}
	}

	AH.listen('body','click','.clr',(_this)=>{
		AH.selectAll('.clr','removeClass','btn-primary');
		AH.selectAll('.clr','addClass','btn-light');
		AH.select(_this,'removeClass','btn-light');
		AH.select(_this,'addClass','btn-primary');
	})



</script>

<main>
    <div id="previewSection" class="px-2">
		<center>
			{#if editorState}
				<div 
					id="shuffleArea" 
					class="shuffle text-center" 
					on:click={shuffleItems} 
					style='font-size:17px;cursor:pointer;display:none;color:#aaa;'
				>
					{l.shuffle}
				</div>
			{/if}
			<div 
				
				id={containerID} 
				path="//s3.amazonaws.com/jigyaasa_content_static/" 
				multimatch={multimatch} 
				totalcorrectans={totalCorrectAns}
				style='font-family:Roboto, sans-serif;font-size:1em;'
			>
				<div class="btn-group clearfix review_2 h" id="sm_controller">
					<ItemHelper 
						on:setReview = {setReview} 
						on:unsetReview = {unsetReview} 
						handleReviewClick={handleReview}
						reviewMode={isReview} 
					/>
				</div>
				<div class={btnflag == 0 ? "h":""}>
					<div class="btn-group clearfix review_default h" id="sm_controller_default">
						<button type="button" tabindex={0} class="btn btn-light correct-ans clr" on:click={() => ucMlid.showCorrect('#'+containerID)} on:keyup={(e) => {if (e.keyCode == 13) ucMlid.showCorrect('#'+containerID)}}>Correct Answer</button>
						<button type="button" tabindex={0} class="btn btn-primary both-ans clr" on:click={() => ucMlid.showAll('#'+containerID)} on:keyup={(e) => {if (e.keyCode == 13) ucMlid.showAll('#'+containerID)}}>Compare</button>
						<button type="button" tabindex={0} class="btn btn-light your-answer clr" on:click={() => ucMlid.showYour('#'+containerID)} on:keyup={(e) => {if (e.keyCode == 13) ucMlid.showYour('#'+containerID)}}>Your Answer</button>
					</div>
				</div>
				<div class="row-fluid">
					<div class="span4">
						<div class="heading">{listheading1}</div>
					</div>
					<div class="span3"></div>
					<div class="span4">
						<div class="heading">{listheading2}</div>
					</div>
				</div>
				
				{#if (multimatch == 0 || multimatch == 1)}
				<div class="row-fluid">
					<div class="span4 shuffleList1" dragable="1">
						{#each list1 as data,i}
								<div
									key={i}
									id={data.id}
									class="list1 ui-draggable"
									data-correctans={data.correctans}
									data-userans={data.userans}
									style={'position:relative;'}
									tabindex={0}
									draggable = "true"
									data-originalseq={(data.originalseq)?data.originalseq:"0"}
								>
									{@html setList1Html(data,i)}
								</div>
							
						{/each}
					</div>
					<div class="span3"></div>
					<div class="span4 shuffleList2">
					{#each list2 as data,i}
						<div 
							key={i}
							id={data.id} 
							class="list2 ui-droppable" 
							data-correctans="" 
							data-userans=""
							dropzone = "1"
							style={'position:relative;'}
							tabindex={0}
							data-originalseq={(data.originalseq)?data.originalseq:"0"}
						>
							{@html setList2Html(data,alphabet[i])}
						</div>
					{/each}
					</div>
				</div>
				{:else}
					<div class="row-fluid shuffleList1">
						{#each list1 as data,i}
							<div key={i} class="row-fluid">
								<span class="span4">
									<div 
										id={data.id}
										class="list1"
										tabindex={0}
										data-correctans={data.correctans}
										data-userans={data.userans}
										
										data-originalseq={(data.originalseq)?data.originalseq:"0"}
									>{@html setList1Html(data,i)}</div>
								</span>
								<span class="span3">
									<div id={data.id} class="arrow"></div>
								</span>
								<span class="span4">
									<div
										id={data.id}
										class="list3 ui-droppable"
										data-droped=""
										data-correctans={data.correctans}
										data-userans={data.userans}
										mrel={data.id}
										dropzone = "1"
										draggable = "true"
										tabindex={0}
										aria-label={`Droped`}
										data-originalseq={(data.originalseq)?data.originalseq:"0"}
									>
										Place Here
									</div>
								</span>
							</div>
						{/each}
						<div class="row-fluid match_options shuffleList2">
							{#each list2 as data,i}
								<div
									key={i}
									id={data.id}
									class="list4 ui-draggable"
									data-correctans=""
									dragable = "1"
									draggable = "true"

									data-userans=""
									tabindex={0}
									data-originalseq={(data.originalseq)?data.originalseq:"0"}
								>
									{@html setList2Html(data,alphabet[i])}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</center>
	</div>
	<Dialog 
		bind:visible={state.dropDialog} 
		width="450px"
		height="271px"
		style="background: #fff; border-radius: 5px;"
	>
		<div style="font-weight:bold;" class="clearfix">
			<div title="How to drop?" class="float-start">How to drop?</div>
			<div class="float-end">
				<Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>
					<i class="mi mi-close"><span class="u-sr-only">close</span></i>
				</Button>
			</div>
		</div>
		<div>
			<div class="row">
				<img 
					alt="gif file" 
					src={AH.select("#matchmain").getAttribute('path') + "match_drop_000BOG.gif"} 
				/>
				<br/>
				<span class="mt-2">
					<input type="checkbox" style="top:2px;" class="relative donotshowdialog" id="dropId" />
					<label for="dropId">Do not show this dialog again</label>
				</span>

			</div>
		</div>		
	</Dialog> 
</main>

<style>
	.u-sr-only {
		position: absolute;
		left: -10000px;
		top: auto;
		width:1px;
		height:1px;
		overflow:hidden;
	}
	@media(max-width:500px) {
		.shuffle {
			text-align:center;
		}
	}
</style>