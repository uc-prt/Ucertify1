
<!-- 
*  File Name   : ChooseNPreview.js
*  Description : Show the module according to authoring side.
*  Author      : Sundaram Tripathi
*  Version     : 1.0
*  Package     : svelte_items
*  Last update :  -->

<script>
	import { afterUpdate, onMount } from "svelte";
	import ucChoose from './chooseAuthString';
	import { writable } from "svelte/store";
	import ItemHelper from '../helper/ItemHelper.svelte';
	import {AH,XMLToJSON,onUserAnsChange} from "../helper/HelperAI.svelte";
	import Sortable from 'sortablejs';
	import './css/choose.min.css';
	
    
    export let cmed;
    export let showAns;
    export let xml; 
	
	export let stopPreviewUpdate;
	export let editorState;
	export let isReview; 
	export let uxml;


	
    

    let containerID = (cmed)?"choose"+cmed:"choose";
    ucChoose.ajax_eId = (cmed)?"#choose"+cmed:"#choose";
    var localCData = [];
    let state = {};
    let stateData = writable({
        xml                         :"",
        headingCorrect              :"",
        allowSort                   :"",
        isSentence                  :"",
        isParagraph                 :"",
        chooseClass                 :"",
        totalcorrectans             :"",
		stateXMLToJSON				:"",
    })

    //let onError = "";

    let unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })


    // for displaying the answer
	function displayAns() {
		var ans = "";
		// create smans and return correct if answer is correct
		if (state.isSentence == "1" || state.isParagraph == "1") {
			ans = ucChoose.CheckResultchoose("#"+containerID);
		} else {
			ans = ucChoose.CheckResultchoose("#"+containerID);
		}
		onUserAnsChange({uXml:ans.u,ans:ans.b});
		
		// show the answer wether the answer is correct or not
		if (editorState) {
			showAns(ans.b ? "Correct" : "Incorrect");
		}
    } 
	$:{
		setTimeout(function(){
			if (isReview) {
					setReview();
			} else {
					unsetReview();
			}
		},200)
	}
    

    // this function executes just after render
    onMount(()=>{ 
        getHeight();
        // binding up the events
        AH.listen(document,'click',"#"+containerID,function(){
			setTimeout(function(){ displayAns() },100);
			
		})

		

		AH.listen(document,'click','#show_ans_group button',(_this)=>{
			AH.removeClass('#show_ans_group button','active');
			AH.addClass(_this,'active');
		})

    })

	
		
		


    // this function returns the height of editorRender class	
	function getHeight() {
		

		AH.bind(document,'click',function(){
			if(document.querySelector(".editorRender")) {
				let heights = document.querySelector(".editorRender").clientHeight;
				return heights;
			}
		})

	
    }
    
    // calls when review mode is on
	function setReview() {
		console.log('checking');
		disableMouse("none");
		ucChoose.modeOn("on");
		isReview = true;
		ucChoose.review("#"+containerID, 0);
		
		AH.removeClass('#show_ans_group button','active');

		
		AH.removeClass('#show_ans_group .your-ans','active');
		displayAns();
    }
    
    // calls jsut after review mode is off from the setReview
	function unsetReview() {
		disableMouse("auto");
		isReview = false;
		ucChoose.modeOn();
		ucChoose.review("#"+containerID, 0); 
    }
    
    // this function added the pointerEvents property in all li of element having id sortable
	function disableMouse(event) {
		//alert('check');
		
		AH.selectAll("#sortable li").forEach((_this)=>{
			_this.style.pointerEvents = event;
		})
    }
    
    // this function calls whenever there is change in state or props
    afterUpdate(()=>{

		// for the change in xml 
		if (xml != state.xml) {
			if (stopPreviewUpdate == true) return false;
			if (cmed) { 
				containerID = "choose"+cmed; 
				ucChoose.ajax_eId = "#choose"+cmed;
			}
			state.xml = xml;
			// convert xml to json using XMLToJSON func
			state.stateXMLToJSON = XMLToJSON(xml)
			// load the module on the basis of the basis of updated xml
			loadModule(state.stateXMLToJSON);
			
			var timer = setTimeout(function() {
				// if there isno user ans found then remove tha nas
				if (!uxml) {
					removeUserAns();
				}
				
				ucChoose.removeActive("#"+containerID);
				//ucChoose.readyThis("#"+containerID);
		    	ucChoose.review("#"+containerID, 0); 
				ucChoose.init("#"+containerID);
		    	ucChoose.CheckResultchoose("#"+containerID);
				
				let sortable = new Sortable(AH.find("#"+containerID,"#sortable"),{
					animation: 150
				});

		    	
		    	if (state.allowSort != "1" || state.isSentence == "1" || state.isParagraph == "1") {
					
					new Sortable(AH.find("#"+containerID,"#sortable"),{
						onEnd: function(evt) {
							var itemEl = evt.item;
							evt.to;
							evt.from;
							evt.oldIndex; 
							evt.newIndex;
							evt.oldDraggableIndex;
							evt.newDraggableIndex;
							evt.clone
							evt.pullMode;
						}
					})
					
		    	}
		    	if (state.isSentence == "1" || state.isParagraph == "1") {
		    		ucChoose.dragSenParItem("#"+containerID);
        			//ucChoose.removeActive("#"+containerID);
				}
				clearTimeout(timer);

			},200);
		}

		
		
    })


    // function loads the module from the xml
	function loadModule(loadXml) {
		
		// parsing the xml for the preview
		parseXMLPreview(loadXml);

		// checking for user ans (uaXML)
		if (uxml) {
			//let uaXML = uxml;
			let uaXML = XMLToJSON(uxml);
			// if in uxml smans and list is found
			if (uaXML && uaXML.SMANS && uaXML.SMANS && uaXML.SMANS.list) {
				// split the user answer with ,
				let userans = uaXML.SMANS.list._useranswer.split(",");
				let newCData = [];
				// iterating through the userans and store the information in localCData
				for (let i in userans) {
					if (userans[i]) {
						let singleuxml = userans[i].split("|");
						for (let j in localCData) {
							if (localCData[j]['optid'] == singleuxml[0]) {
								localCData[j]['user_answer'] = singleuxml[2];
								localCData[j]['user_seq'] = singleuxml[1];
								newCData.push(localCData[j]);
							}
						}
					}
				}
				localCData = newCData;
			}
		} 
    }
    
    // this function parse the xml for preview
	function parseXMLPreview(MYXML) {
		try {
		localCData = [];
		//forceUpdate();
		let cdata = MYXML.smxml.list.__cdata.split("\n");
		let corrSeqCount = 1;
		let countCorrectAns = 0;
		let optid = 0;
		// iterating through the cdata
		
		cdata.forEach(function(data,i) {
			if (cdata[i].trim() != "") {
				// if found * at first pos then means correctans
				if (cdata[i].trim().charAt(0) == "*") {
					countCorrectAns++;
				}
				// storing the value in localCData
				localCData.push({
					value:cdata[i].trim(),
					isCorrect:((cdata[i].trim().charAt(0) == "*") ? "1" : "0"),
					seq:((cdata[i].trim().charAt(0) == "*") ? corrSeqCount : "0"),
					user_answer:"0",
					optid:optid
				});
				((cdata[i].trim().charAt(0) == "*") ? corrSeqCount++ : "");
				optid++;	
			}
		});
		// shuffling the array
		shuffleArray(localCData);
		// updating all the xml attributes to the lower case
		MYXML = updateAttrToLower(MYXML);
		// setting state 
		
        state.headingCorrect = MYXML.smxml.list._headingcorrect;
        state.allowSort = ((MYXML.smxml.list._allowsort)? MYXML.smxml.list._allowsort :"0");
        state.isSentence = ((MYXML.smxml.list._issentence)? MYXML.smxml.list._issentence :"0");
        state.isParagraph = ((MYXML.smxml.list._isparagraph)? MYXML.smxml.list._isparagraph : "0");
        state.totalcorrectans = countCorrectAns;
		

		//this.forceUpdate();
		var timer = setTimeout(function() {

			//adding user_seq to each li
			AH.find("#sortable",".sentence_li","all").forEach(function(data,i){
				data.setAttribute("user_seq",i+1);
			})
			//forceUpdate();
			clearTimeout(timer);
		}.bind(this),200)
		} catch(error) {
			this.onError = error;
			console.warn({'error':error.message,'function name':'parseXMLPreview','File name':'ChooseNReorderPreview.js'});
		}	
    }
    
    // update the attribute to lower case
	function updateAttrToLower(data) {
		let xml = data;
		// convert headingCorrect attribute to headingcorrect
		if (xml.smxml.list._headingCorrect) {
			xml.smxml.list._headingcorrect = xml.smxml.list._headingCorrect;
			delete xml.smxml.list._headingCorrect;
		}
		// convert allowSort attribute to allowsort
		if (xml.smxml.list._allowSort) {
			xml.smxml.list._allowsort = xml.smxml.list._allowSort;
			delete xml.smxml.list._allowSort;
		}
		// convert isParagraph attribute to isparagraph
		if (xml.smxml.list._isParagraph) {
			xml.smxml.list._isparagraph = xml.smxml.list._isParagraph;
			delete xml.smxml.list._isParagraph;
		}
		// convert isSentence attribute to issentence
		if (xml.smxml.list._isSentence) {
			xml.smxml.list._issentence = xml.smxml.list._isSentence;
			delete xml.smxml.list._isSentence;
		}
		return xml;
    }
    
    function cmu(e) {
		if (state.isSentence != "1" && state.isParagraph != "1") {
			ucChoose.cmu("#"+containerID,e);
		}
    }
    
    function cmm(_this,e) {
		if (state.isSentence != "1" && state.isParagraph != "1") {
			ucChoose.cmm(_this,e);
		}
    }
    
    function cmd(_this,e) {
		if (state.isSentence != "1" && state.isParagraph != "1") {
			ucChoose.cmd(_this,e);
			ISSPECIALMODULEUSERXMLCHANGE = 1;
		}
    }
    
    // returns the shuffled array
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
    }
    
    
    // for removing the userans
	function removeUserAns() {
		
		AH.selectAll("#sortable li").forEach((_this)=>{
			_this.setAttribute("user_answer","0");
			_this.setAttribute("style","")
		})

		
		AH.selectAll("#sortable li .prefix").forEach((_this)=>{
			_this.innerHTML = "";
		})
    }
    

    // Return the html and css
    function setInnerHtml(item) { 
        
        let htmlContent = '<div class="prefix pl-1 mr-2"'+((state.isSentence == "1")?"nw":"")+'"></div>'+((state.isParagraph == "1")?'<div class="pg_handle">&equiv;</div>':"")+((item.value.charAt(0) == "*")? item.value.slice(1) :item.value)
        
        return htmlContent;
	}

	function handleReviewMode(mode , e){
		//alert(mode);
		if (mode == 'c') {
			ucChoose.showAns('#'+containerID,e.currentTarget,'c')
		} else {
			ucChoose.showAns('#'+containerID,e.currentTarget,'u')
		}
	}
	//alert(isReview);
	
</script>
<main>
    <div>
        <center>
			<ItemHelper 
		
		on:setReview = {setReview}
		on:unsetReview = {unsetReview}
		handleReviewClick={handleReviewMode}
		reviewMode={isReview}
	/>
            

        </center>
        <center>
            <div id={containerID} type={(state.isSentence == "1")?"sentence":(state.isParagraph=="1")?"paragraph":'normal'} class="bg-white">
                <div class="choose_header font17 pl-4">{state.headingCorrect}</div>
                <ul
                     
                    id="sortable"
                    totalcorrectans={state.totalcorrectans}
                    checkseq={state.allowSort}
                    class="ui-sortable w-auto mt-0 p-2"
                    on:mouseup={cmu.bind(this)}
                    on:mousemove = {cmm.bind(this)}
                    on:mousedown = {cmd.bind(this)} 
                    style = {'border-left:10px solid #d9e7fd;border-right: 10px solid #d9e7fd'}
                >
                    {#each localCData as data,i} 
                    
                            <li
                                
                                key={i}
                                class={(state.isSentence == "1")?"sentence_li":(state.isParagraph=="1")?"paragraph_li":''}
                                is_correct={data.isCorrect}
                                optid={data.optid}
                                correct_seq={data.seq}
                                user_answer={data.user_answer}
                                u={data.user_answer}
                                user_seq={(data.user_seq)?data.user_seq:i}
                                id={'id'+i}
                                tabIndex="0"
                            >{@html setInnerHtml(data)}</li>
                    
                    {/each}
                </ul>
                <div class="choose_bottom pl-4" id="instruction">
					{#if state.allowSort == 1 || state.isSentence == 1 || state.isParagraph == 1}
						Click to select. Drag and Drop to set sequence.
					{:else}
						Sequencing of the selected item is not required. Click to select items.
					{/if}
                </div>
            </div>
        </center>
    </div>
</main>