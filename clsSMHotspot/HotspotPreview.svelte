<script>
	import { onMount, beforeUpdate } from 'svelte';
	import hotspotScript from './hotspotScript.js';
	import DooScribPlugin from './hotspotDrawingScript.js';
	import { XMLToJSON, onUserAnsChange, AH } from '../helper/HelperAI.svelte';
	import ItemHelper from '../helper/ItemHelper.svelte';
	import {movetarget} from './libs/util.svelte';
	import { writable } from 'svelte/store';
	export let xml;
	export let uxml;
	export let ansStatus;
	export let isReview;
	export let showAns;
	export let editorState;

	const HotJS = new hotspotScript();
	let parseXml = "";
	let answerStatus;
	let ansDisable = 0;
	let bgImgPath = '//s3.amazonaws.com/jigyaasa_content_static/';
	let alt = "";
	let moduleArr = {
		textclick: "1",
		textselect: "2",
		imagehighlight: "3",
		hotspot: "4",
	};
	let state = {};
	let hdd = writable({
		imgwidth: "auto",
		imgheight: "auto",
	})
	let itemBorder = 0;
	let itemBorderColor = "gray";
	let isUxmlTarget = false;
	let itemAreaTop = '';
	let itemAreaHeight = '';
	let itemAreaWidth = '';
	let itemAreaLeft = '';
	let targetLeft 		= 100;
	let targetTop 		= 100;
	let targetView      = "none";
	let ans_x 			= 0;
	let ans_y 			= 0;
	let ans_h 			= 0;
	let ans_w 			= 0;
	let type			= "";
	let img_url 		= "";
	let manual_grade 	= 0;
	let onError			= null; 
	let item_type       = "";
	let xmlHeight       = 0;
	let xmlWidth        = 0;
	let userCorrect     = "";
	let correctans		= "";
	let totalCorrectAns;
	let scrollEnabled   = false;
	let linecolor = "black";
	let drawstr	= "";
	let count = 0;
	let xaxis = [];
	let yaxis = [];
	let divHeight = 0;
	let divWidth = 0;
	var typeName = 'textclick';
	var correctAnsStr = '';
	var correctHtml = '';
	const unsubscribe = ((items)=>{
		state = items;
	})

	$: {
		if (isReview) {
			//targetView = "block";
			setReview();
			if(editorState && ansDisable == 0) {
				showAns(answerStatus ? "Correct" : "Incorrect");
				ansDisable = 1;
			}
		} else {
			//targetView = "none";
			ansDisable = 0;
			unsetReview();
		}
	}

	$:	if (xml) {
		// Here replacing the not standard cdata into the valid cdata format
		let myXml = xml.replace("<!--[CDATA[", "<![CDATA[").replace("]]-->", "]]>");
			
		// checking xml for if cdata is found or not 
		if (myXml.match(/<\!\[CDATA\[{|<\!--\[CDATA\[{/gm)) {
			// saving value b/w the {, } symbol
			correctans =  myXml.toString().match(/{(.*)}/gmi);
			totalCorrectAns = correctans.toString().match(/},"\d+"/gm);
			totalCorrectAns = (totalCorrectAns) ? totalCorrectAns.pop() : null;
			totalCorrectAns = (totalCorrectAns) ? totalCorrectAns.replace(/"|}|,/gm,"") : 1;
			myXml = myXml.replace(correctans, "");
			correctans = correctans[0];
		}
		parseXml = XMLToJSON(xml);
		xmlParser();
		preRender();
	}

	onMount(async () => {
		parseXml = XMLToJSON(xml);
		xmlParser();
		preRender();
		HotJS.readyThis('hptmain0', isReview);
		if (isReview) {
			HotJS.modeOnHot(1);
		} else {
			HotJS.modeOnHot();
		}

		AH.listen('#previewArea', 'click', '.textClick', function() {
			checkAnswer();
		});
		
		AH.listen('#previewArea', 'click', '[type="textselect"]', function() {
			checkAnswer();
		});
	});

	function xmlParser() {
		item_type = parseXml['smxml']['div']['_type'];
		xmlHeight = parseXml['smxml']['_height'];
		xmlWidth = parseXml['smxml']['_width'];
		if (item_type == undefined || item_type == "") {
			item_type = parseXml['smxml']['_name'].toLowerCase();
		}
		typeName = item_type;
		img_url = parseXml['smxml']['_bgimg'];
		switch (moduleArr[item_type]) {
			// in case of text click 
			case "1": 
					//getting the width and height
					divHeight = parseXml.smxml._height+'px';
					divWidth = parseXml.smxml._width+'px';
					// for parsing the xml
					parseTextClick(parseXml.smxml.div.__cdata);
					AH.select(AH.parent('#textID0'), 'show', 'block');
					AH.selectAll('#drawPreview,table[id="hptmain2"]', 'hide');
					break;
			case "2": 
					// in case of text select module
					if (!isNaN(parseXml.smxml._height)) {
						parseXml.smxml._height = parseXml.smxml._height+'px';	
					}
					divHeight = parseXml.smxml._height;
					divWidth = parseXml.smxml._width+'px';
					// for parsing the xml
					parseTextSelect(parseXml.smxml.div.__cdata);
					AH.select(AH.parent('#textID0'), 'show', 'block');
					AH.selectAll('#drawPreview,table[id="hptmain2"]', 'hide');
					break;
			case "3": {
					// In case of image highlight 
					//bgImg = parseXml.smxml._bgimg;
					//var image = document.getElementById('hiddenImage');
					let image = new Image();
					image.addEventListener('load', function(event) {
						state.imgheight = (parseXml.smxml._height > this.height) ? parseXml.smxml._height+'px' : this.height+'px';
						state.imgwidth = (parseXml.smxml._width > this.width) ? parseXml.smxml._width + 'px' : this.width + 'px';
						AH.find('#hptdraw0', 'canvas', {action: 'attr', actionData: {height:  state.imgheight, width: state.imgwidth} });
						AH.empty('#textID0');
						unsetReview();
					}, false);
					image.setAttribute('src', bgImgPath + parseXml.smxml._bgimg);
					// used for set the background image of the Draw highlighted module
					//imgUrl = "url('https:" + bgImgPath + parseXml.smxml._bgimg + "')";
					//this.flagUpdate = false;
				}
				break;
			case "4": {
					// in case of hotspot (spot an image)
					// setting backgroundImage , alt, width, height, left , top ,border, bordercolor on the basis of xml
					img_url = parseXml.smxml._bgimg;
					alt = parseXml.smxml._alt;
					ans_y = parseFloat(parseXml['smxml']['div']['_top']);
					ans_x = parseFloat(parseXml['smxml']['div']['_left'])+13;
					ans_h = parseFloat(parseXml['smxml']['div']['_height']);
					ans_w = parseFloat(parseXml['smxml']['div']['_width']);
					alt = parseXml['smxml']['div']['_alt'];
					type = parseXml['smxml']['div']['type'];
					itemBorder  = parseXml.smxml.div._border;
					itemBorderColor  = parseXml.smxml.div._bordercolor;
					itemAreaWidth = parseXml.smxml.div._width+'px';
					itemAreaHeight = parseXml.smxml.div._height+'px';
					itemAreaLeft = parseXml.smxml.div._left+'px';
					itemAreaTop = parseXml.smxml.div._top+'px';
					
					let image = new Image();
					image.onload = function() {
						let bgImgHeight = this.height+'px';
						let bgImgWidth =  this.width+'px';
						state.imgheight =  (parseXml.smxml.div._imgheight)  ? parseXml.smxml.div._imgheight+'px' : "auto !important";
						state.imgwidth = (parseXml.smxml.div._imgwidth) ? parseXml.smxml.div._imgwidth+'px' :  "auto !important";
						AH.select('#hptmain0', 'css', {height: bgImgHeight, width: bgImgWidth});
					};
					image.src = bgImgPath + parseXml.smxml._bgimg;
				}
				break; 
		}
		
	}

	function preRender() {
		if (isReview) {
			targetView = "block";
		}
		var image = new Image();
		image.onload = function() {
			if (moduleArr[item_type] == "3") {
				state.imgheight = (parseXml.smxml._height > this.height) ? parseXml.smxml._height+'px' : this.height+'px';
				state.imgwidth = (parseXml.smxml._width > this.width) ? parseXml.smxml._width + 'px' : this.width + 'px';
			} else {
				state.imgheight =  (parseXml.smxml.div._imgheight)  ? parseXml.smxml.div._imgheight+'px' : "auto !important";
				state.imgwidth = (parseXml.smxml.div._imgwidth) ? parseXml.smxml.div._imgwidth+'px' :  "auto !important";
			}
		};
		image.src = bgImgPath + img_url;
		if (uxml) {
			userCorrect = uxml;
			let parseUxml = XMLToJSON(uxml);
			if (parseUxml.SMANS && parseUxml.SMANS.div) {
				isUxmlTarget = true;
				ans_x = parseUxml.SMANS.div._targetLeft;
				ans_y = parseUxml.SMANS.div._targetTop;
			}
		}
	}

	function checkAnswer (event) {
		let result = {}; 
		if (typeName == 'textclick' || typeName == 'textselect') {
			result = HotJS.check_Ans('#previewArea #hptmain0');
		} else {
			result = movetarget(event, ans_h, ans_w, parseInt(itemAreaLeft), parseInt(itemAreaTop));
			isUxmlTarget = true;
			ans_x = result.left;
			ans_y = result.top;
			ansStatus = result.ans;
			answerStatus = ansStatus;
			if (editorState) showAns(ansStatus ? "Correct" : "Incorrect");
		}
		onUserAnsChange(result);
	}
	function onModalTouch(event) {
		console.log(event);
	}

	// used in native for toggle
	function toggleSelectArea() {
		scrollEnabled = scrollEnabled ? false : true;
	}

	// when remediation mode is on
	function setReview() {
		targetView = "block";
		//isDotCreate = false;
		// if the module is imagehighlight then it draw the correct answer on the module using the function drawOnCanvas
		if (moduleArr[item_type] == "3") {
			let el = AH.find('#previewArea', 'canvas');
			let pts = el.getAttribute('correctans'); 
			if ( pts!='') pts = JSON.parse(pts);
			HotJS.drawOnCanvas(el, pts, 'green');
		}
		// called the function unbind lab which basically show the draggable element in preview area if found which is found in case of spot an image
		HotJS.modeOnHot(1);
		// check the answer wether the answer is correct or not
		//checkAnswer();
		AH.select("#hptmain0", 'css', {pointerEvents: "none"});
	}

	// when remediation mode is off
	function unsetReview() {
		targetView = "none";
		// if the module is imagehighlight then it hide the correct answer ans show user ans on the module using the function drawOnCanvas
		if (moduleArr[item_type] == "3") {
			AH.find('#previewArea', 'canvas', {action: 'remove'});
			imageDraw('#previewArea', 0);
			var timer = setTimeout(function() {
				let el = AH.find('#previewArea', 'canvas');
				// getting the value of the user ans
				let getAns = AH.select('#special_module_parse').value,
				// getting the user answer coordinates
				cans   = getAns.substring(getAns.indexOf('{'),getAns.lastIndexOf('}')+1);

				// parsing it into the JSON element
				if ( cans!='') cans = JSON.parse(cans);
				// passed the points in the canvas
				HotJS.drawOnCanvas(el, cans, linecolor);
				clearTimeout(timer);
			},500);
		}
		// called the function bind lab which basically hide the draggable element in preview area if found which is found in case of spot an image
		HotJS.modeOnHot();
		AH.select("#hptmain0", 'css', {pointerEvents: "auto"});
	}

	// for image draw
	function imageDraw(hid,review) {
		let imgObj =  AH.find(hid, '#hptmain0');
		hid = imgObj;
		// let imgWidth  = imgObj.clientWidth;
		// let imgHeight = imgObj.clientHeight;
		let surface = new DooScribPlugin({
            target: imgObj,
            width: +( state.imgwidth.replace('px', '') ),
            height: +( state.imgheight.replace('px', '') ),
            correctans: correctans,
            cssClass: 'drawSurface',
            penSize: 4,
            type: 'imagehighlight',
            editable: (!review) ? true: false,
            onMove: function () { },
            onClick: function () { },
            onPaint: function (e) {
                // storeing the X and Y values
                xaxis.push(e.X);
                yaxis.push(e.Y);
            },
            onRelease: function (e) {
				onReleaseFunc(e, hid, review);
            }
        });
		linecolor = String(xml.match(/linecolor=\"([^\"]+)\"/gm));
		linecolor = linecolor.substring("11", (linecolor.length - 1));
		//var res = AH.siblings(hid).find((_elm)=> _elm.matches('div') ).getAttribute('id');
		if (!review) {
			AH.listen('#previewArea', 'click', '#reset', ()=> {
				surface.clearSurface();
				drawstr = ''; count = 0;
				userCorrect =  "";
				AH.selectAll(AH.select(hid).children, 'attr', {userans: ''});
			});
		}
		window.surface = surface;
	}

	// calls in key up / onrelase of mouse
	function onReleaseFunc(e, hid, review){
		let userAnswers = '';
		let inNativeIsCorrect = false;

		// check for the review mode is on or off
		if (!review) {	// if review mode is off
			drawstr = '';
			// getting the  value of the point 
			var coor = document.querySelector('#special_module_parse').value;
			coor = coor.substring(coor.indexOf('{'),coor.lastIndexOf('}')+1);

			// getting the coordinates using the getCoordinate function
			if (coor!='') {	
				coor = 	Object.keys(JSON.parse(coor)).length;
				drawstr = HotJS.getCoordinate(hid, xaxis, yaxis, coor);
			} else {
				drawstr = HotJS.getCoordinate(hid, xaxis, yaxis, count);
			}
			// for getting window height in case of native
			if (window.inNative) {
				window.getHeight && window.getHeight();
			}	

			// for autograding
			window.ISSPECIALMODULEUSERXMLCHANGE = 1;
			// puuting the value in the textarea for saving the user ans
			AH.select("#special_module_user_xml").value = drawstr;
			userCorrect = drawstr;
			xaxis=[]; yaxis=[];
			// for getting the correctans
			let pts  = AH.find(hid, 'canvas').getAttribute('correctans');
			// for getting the user ans
			let cans = AH.find(hid, 'canvas').getAttribute('userans');

			// parsing both the json if they are not empty
			if ( cans!='') cans = JSON.parse(cans);
			if ( pts!='') pts = JSON.parse(pts);

			// comparing them with the function , it will return 1 if the answer is correct
			let flag = HotJS.compareDrawing(cans,pts,hid);
			let message = "Incorrect";
			// for setting the answer correct if flag > 0
			if (flag > 0) {
				inNativeIsCorrect = true;
				message = "Correct";
				state.answerType3 = true;
				if (editorState) showAns("Correct");
			} else {
				inNativeIsCorrect = false;
				message = "Incorrect";
				state.answerType3 = false;
				
			}
			if (editorState) showAns(message);
			userAnswers = AH.select('#special_module_user_xml').value;
			var result = {'ans': flag, 'uXml': userAnswers};
			onUserAnsChange(result);
			// @uc-abk: When user drawed canvas within the correct area : flag will 1
			(flag > 0) ? (AH.select("#answer").checked =  true) : (AH.select("#answer").checked = false);
			if (window.inNative) window.postMessage(JSON.stringify({ inNativeIsCorrect, userAnswers }), "*");
		}
	}
	
	function parseTextClick(cdata) {
		var cdataStr = '';
		// get the correct answer in correctans
		var correctans = cdata.match(/%{(.*?)}%/gm);
		if (correctans) {
			totalCorrectAns = correctans.length;
			for(var i=0;i<correctans.length;i++) {
				// replacing the space with <uc:space> and then replacing the correctans with it
				correctAnsStr = correctans[i].replace(/\s+/gm,'<uc:space>');
				cdata = cdata.replace(correctans[i],correctAnsStr);
			}
		}
		correctAnsStr = '';
		cdata = cdata.split(' ');
		for(var i=0;i<cdata.length;i++) {
			//if the data is correct answer
			if (cdata[i].match(/%{|%}/gm)) {
				// for setting the data-correctans 1 if that value is correct
				cdata[i] = cdata[i].replace(/<uc:space>/gm,' ').replace(/%{|}%/gm,''); 
				cdataStr += '<p class="textClick" data-index="'+i+'" data-userans="0" data-correctans="1">'+cdata[i]+'</p>';
				correctAnsStr += cdata[i]+'|';
			} else {
				// for setting the data-correctans 0 if that value is correct
				cdataStr += '<p class="textClick" data-index="'+i+'" data-userans="0" data-correctans="0">'+cdata[i]+'</p>';
			} 
		}
		correctAnsStr = correctAnsStr.replace(/\|$/gm,'');
		 // showing the text in the preview area 	
		AH.select(' #previewArea  #textID0').innerHTML =  cdataStr;
	}
	function parseTextSelect(cdata) {
		correctAnsStr = '';
		// store the correct answer in correct ans 
		var correctans = cdata.match(/%{(.*?)}%/gm);
		// if exists
		if (correctans) {
			// storing it the correct ans in correctAnsStr seperted by | 
			for (var index_no = 0; index_no <correctans.length; index_no += 1) {
				correctAnsStr += correctans[index_no].replace(/%{|}%/gm, '') + '|';
			}
			// replace the symbol with the span
			correctHtml = cdata.replace(/%{/gm, '<span class="selecttext selected">').replace(/}%/gm, '<span>');
			totalCorrectAns = correctans.length;

			// removing last pipe symbol in the correctAnsStr
			correctAnsStr = correctAnsStr.replace(/\|$/gm, '');
		}
		// removing the symbol from the cdata
		var showdata = cdata.replace(/%{|}%/gm, '');
		var timer = setTimeout(function() {			
			// show the text in the html
			AH.select(' #previewArea  #textID0').innerHTML =  showdata;
			clearTimeout(timer);
		}.bind(self), 100);
	}

	function loadModule(_type) {
		switch(_type) {
			// if the type is text click or text select
			case "1":
			case "2": {
					let data_userans = "";
					let data_userhtml = "";
					if (uxml) {
						let _uxml = XMLToJSON(uxml);
						window.test = uxml;
						// extract the userans and userhtml
						if (_uxml?.smans?.div) {
							data_userans = _uxml.smans.div['_data-userAns'];
							data_userhtml = _uxml.smans.div['_data-userHtml'];
						}
					}
					// return the div
					return (`
						<div is id="hptmain0" totalCorrectAns=${totalCorrectAns}>
							<div 
								id="textID0" 
								type="${typeName}" 
								data-correcthtml="${correctHtml}" 
								data-correctans="${correctAnsStr}"
								data-userans="${data_userans}" 
								data-userhtml="${data_userhtml}" 
								class="drag-resize hotspotTxt" 
								style="max-width:${divWidth}; height:${divHeight}; line-height: 1.4;"
							>
							</div>
						</div>
					`);
				}
			default : return("<div>Incorrect question type</div>");
		}
	}
	
</script>
<main>
	<center>
		<ItemHelper 
			on:setReview = {setReview}
			on:unsetReview = {unsetReview}
		/>
		<div id="previewArea" class="relative">
			<!-- if the type is text click or text select -->
			{#if moduleArr[item_type] == "4"}
				<table id="hptmain0" class='smbase smhotspot border-0 h-auto w-auto uc-table'>
					<tbody>
						<tr>
							<td class="border">
								<div id="SM0" class="relative">
									<div 
										id='SM0' 
										class="SM position-relative m-0 p-0" 
										style="{`
											position: relative;
											margin: 0px;
											padding: 0px;
											width: 100%;
											height: 100%;
											border: ${(itemBorder) ? itemBorder + 'px solid' : ''};
											border-color: ${itemBorderColor};
										`}"
									>
										<img 
											id="im0" 
											tabindex="0" 
											style="max-width:none; width: {state.imgwidth}; height: {state.imgheight};" 
											class="hotSpotImg" 
											src={bgImgPath+img_url} 
											alt={alt} 
											on:click={checkAnswer}
										/>
										<div 
											id='hotArea' 
											class="hotArea hotArea hotAreaPreview" 
											style="{`
												display: ${targetView};
												left:${itemAreaLeft};
												top:${itemAreaTop};
												height:${itemAreaHeight};
												width:${itemAreaWidth};
											`}"
										>
											&nbsp;
										</div>
										<span
											id='target' 
											class="target targetImg icomoon-plus-circle-2"
											class:showBlock="{isUxmlTarget}"
											style = "{`
												left:${ans_x}px;
												top:${ans_y}px;
											`}"
										>
										</span>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>	
			{:else if moduleArr[item_type] == "3"}
				<center key="imageHeight_3">
					<div 
						style="
							height: 32px; 
							width: {window.inNative ? window.innerWidth : state.imgwidth}; 
							background: #d9e7fd; 
							border-top: 2px solid #96bbf6;
						"
					>
						<div 
							id="reset" 
							style="height: 27px; width: 90px; top:2px;"
							class="reset btn btn-outline-primary position-relative btn-sm mt-sm2 mr-sm2 float-end">
							<span class="icomoon-new-24px-reset-1 s3" style="vertical-align: text-top"></span> 
							<span class="position-relative bottom1">Reset</span>
						</div>
					</div>
					<div 
						id="hptmain0"
						totalCorrectAns={totalCorrectAns}
						dd={state.imgwidth}
						style="
							width: {state.imgwidth || '250px'}; 
							height: {state.imgheight || '600px'}; 
							background-image: url('{bgImgPath+img_url}'); 
							background-repeat: no-repeat; 
							position: relative; 
							border: 2px solid #d9e7fd;
						"
					></div>
					{#if scrollEnabled}
						<div 
							class="position-fixed index0" 
							style="right: 0; top: 0; left: 0; bottom: 0; background: rgba(0,0,0,0.4)"
						></div>
					{/if}
				</center>
			{:else}
				{@html loadModule(moduleArr[item_type])}
			{/if}
		</div>
	</center>
	<input 
		type="hidden" 
		id="special_module_parse" 
		name="special_module_parse" 
		userans="" 
		value={userCorrect} 
	/>
	<textarea class="h" id="special_module_user_xml"></textarea>
</main>

<style>
	main {
		text-align: center !important;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		font-size: 26px;
	}
	.targetImg {
		display : none;
		position: absolute;
		z-index: 10;
		width: 17px;
		height:15px;
		border-radius: 50%;
		background: #fff;
		color: #1c3ad4;
	}	
	
	.showBlock {
		display : block;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
