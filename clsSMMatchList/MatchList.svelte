
<!-- 
*  File Name   : MatchList.svelte
*  Description : Match the list options and type
*  Author      : Sundaram Tripathi
*  Version     : 1.0
*  Package     : pe-items
*  Last update :  -->

<script> 
	
    import {onMount,afterUpdate,beforeUpdate} from 'svelte';
	import {writable} from 'svelte/store';
	import Loader from '../helper/Loader.svelte';
	import {AH,XMLToJSON,JSONToXML} from "../helper/HelperAI.svelte";
    import {smVal} from './lib/ValidateItems';
    import l from '../src/libs/Lang.js'
    import { Button, Dialog, Checkbox } from 'svelte-mui/src';


	////exporting vaiables
	export let editorState;
    export let xml;
    export let getChildXml;
    export let smValidate;


    // variables declration
    let timer = {};
    let tempdata1 = [];
    let tempdata2 = [];
    let listheading1 = "";
    let listheading2 = "";
    let multimatch = "";
    let list1 = [];
    let list2 = [];
    let localCData = [];
    let cdata = "";
    let editFlag = false;
    let editValue = "";
    let clsname = "";
    let columnid = "";
    let columnname = "";
    let index;
    let row = 0;
    let state = {};

////// Holding states in writable form /////

    let stateData = writable({
        snackback               :false,
        xml                     :"",
        listheading1            :"",
        listheading2            :"",
        multimatch              :"",
        openResponseDialog      :false,
        setting                 :1,
        openImageDialog         :false,
        imageClass              : "",
        maxnode                 : 0,
        clname                  :"",
        anchorEl                : null,
        drag_mode               : false,
        openDeleteDialog        : false,
        row_id                  :"",
		dir						: false,
    })

    const unsubscribe = stateData.subscribe((items) => {
        state = items;
    })


        
    beforeUpdate(()=>{
		
        if( state.xml!= xml ) {
            state.xml = xml;
			tempdata1 = [];
    		tempdata2 = [];
			
			
            var newXml = XMLToJSON(state.xml);
            parseXMLAuthoring(newXml);
         }
    })

	function loadLibs() {
        let config = {
            preload: true,
            type: 'stylesheet',
            as: 'style'
        }
        AH.createLink(themeUrl + 'pe-items/svelte/clsSMMatchList/css/matchlistAuth.css', config);
    }

    onMount(()=>{
		loadLibs();
        // preventing the enter key in the textarea
        AI.listen(document,'keydown','textarea',function(event) {
            if(event.keyCode == 13) {
                event.preventDefault();
            }
		});
		// jQuery(document).off("keydown","textarea").on("keydown", "textarea", function(event) {
		// 	if (event.keyCode == 13) {
		// 		event.preventDefault();
		// 	}
		// });
		// for deleting the image
		AI.listen(document,'click','.image_delete', (_ele) => {
			let oldImage = AI.find(_ele.parentElement.parentElement,'textarea').value;
			let newValue = state.xml.replace(oldImage, "insert value");
			getChildXml(newValue);
		})


		// jQuery('#matchListArea').tooltip({
		// 	selector: '[data-toggle="tooltip"]'
		// });
		
		
		AI.listen(document,'mouseup','.ui-droppable',function() {
			setTimeout(function() {
				document.querySelectorAll(".matchlist-delete").forEach((_elm) => {
					_elm.classList.add("tts_nospeak");
				})
			})
		})
		//jQuery('.algo_div span').css('color','#333');
		let algo_div_len = document.querySelectorAll(".algo_div span");
		for(let i = 0; i < algo_div_len.length; i++) {
			algo_div_len[i].style.color = "#333";
		}

		// jQuery(document).on('keydown', '.delete_match_node, .delete_match_node_auth', function(event) {
		// 	if ((event.keyCode == 13 || event.which == 13)) {
		// 	// click the element which currently get the focus and enter key is down
		// 	jQuery(this).trigger('click');
		// 	event.preventDefault();
		// 	}
		// });
		AI.listen(document,'keydown','.delete_match_node, .delete_match_node_auth', function(data,event) {
			if((event.keyCode == 13 || event.which == 13)) {
				// Need ti fix one more line here....
				event.preventDefault();
			}
		})
    })

    // this function is responsible for parsing the xml
	function parseXMLAuthoring(QXML) {
		list1 = [];
		list2 = [];
		localCData = [];
		// setting the state with the value in the xml
		state.listheading1 = QXML.smxml.matchlist._listheading1;
		state.listheading2 = QXML.smxml.matchlist._listheading2;
		state.multimatch = QXML.smxml.matchlist._multimatch;
		state.drag_mode = (QXML.smxml.matchlist._multimatch == 2) ? true : false
		
		// storing the values in multimatch and cdata
		multimatch = QXML.smxml.matchlist._multimatch;
		cdata = QXML.smxml.matchlist.__cdata;

		// checking for if is_algo is defined in xml or not
		if (QXML.smxml.matchlist._is_algo) {
			// if is_algo is true then put the value in isalgo as true else false
			state.isalgo = (QXML.smxml.matchlist._is_algo == "true" ? true : false);
		} else {
			// if is_algo is not defined means its value will be false
			state.isalgo = false;
		}

		// for the maximum no of node i.e, max_node
		if (QXML.smxml.matchlist._max_node) {
			var num = Number(QXML.smxml.matchlist._max_node);
			state.maxnode = ( num > 0 ? num : 0 )
		} else {
			state.maxnode = '';
		}
		// splitting the cdata with new line
		cdata = cdata.split("\n");

		
		// traversing through the cdata
		// jQuery(cdata).each( function (i) {
		cdata.forEach(function(data,i) {
			if (cdata[i].trim() != "") {
				// Finding the opening and closing brackets in cdata
				if (cdata[i].indexOf("[") >= 0 && cdata[i].indexOf("]") >= 0) {
					// extracting value 1 by replcing the content start with [ and end with ]
					let value1 = cdata[i].replace(cdata[i].match(/\[(.*?)\]/g),"").replace(/^\s+/g, "");
					let value2 = cdata[i].match(/\[(.*?)\]/g)[0];
					// finding the value 2 by finding the text start with [ and end with ] and the removing these brackets
					value2 = value2.replace("[","").replace("]","");
					// store the value in the localCData
					// localCData.push({
					// 	value1: value1,
					// 	value2: value2,
					// 	id:i
					// });
					localCData = [
						...localCData, {
							value1: value1,
							value2: value2,
							id:i
						}
					]
					list2[i] = cdata[i].replace(cdata[i].match(/\[(.*?)\]/g),"").replace(/^\s+/g, ""); // value 1
					list1[i] = cdata[i].match(/\[(.*?)\]/g)[0]; 
					list1[i] = list1[i].replace("[","").replace("]",""); // value 2
				} else {
					errMessage = "Bracket is Missing in line no. "+i;
					state.snackback = true;
				}
			}
		});
		
		
		//forceUpdate();
    } 
    // this function calls & updated the xml whenever there is change in list heading textbox & maxnode textbox
	function updateXml(e) {
		// updating the xml to json by XMLToJSON function
		var newXml = XMLToJSON(state.xml);
		// if there is change in listheading 1
		if (e.target.id == "listheading1") {
			state.listheading1 = e.target.value;
		} else if (e.target.id == "listheading2") {
			// if there is change in listheading 2
			state.listheading2 = e.target.value;
		} else if (e.target.id == "maxnode") {
			// if there is change in maxnode
			if (isNaN(e.target.value)) {
				AI.showmsg(
					'Error Message',
					'Please enter numeric value',
					'error'
				);
			} else if (e.target.value > 6) {
				AI.showmsg('Please insert value between 1 to 6');
			} else {
				state.maxnode = e.target.value;
			}
		}
		timer['updateXMl1'] = setTimeout(function() {
			// updating the attribute values
			newXml.smxml.matchlist._listheading1 = state.listheading1;
			newXml.smxml.matchlist._listheading2 = state.listheading2;
			if (state.maxnode) {
				newXml.smxml.matchlist._max_node = state.maxnode;
			} else {
				// deleting max_node if it is not in use
				delete newXml.smxml.matchlist._max_node;
			}
			// update and store the xml 
			getChildXml(JSONToXML(newXml));
			clearTimeout(timer['updateXMl1']);
		}, 200);
    }
    
    // whenever add button is clicked
	function updateCData() {
		//var rowInFirstColumn = jQuery("#matchListArea [class*='textarea_1']").length;
		var rowInFirstColumn = AI.selectAll("#matchListArea [class*='textarea_1']").length;
		
		//var rowInSeconfColumn = jQuery("#matchListArea [class*='textarea_2']").length;
		var rowInSeconfColumn = AI.selectAll("#matchListArea [class*='textarea_2']").length;
		if (rowInFirstColumn > 19 || rowInSeconfColumn > 19) {
			AI && AI.showmsg('Maximum possible options are 20');
		} else {
			row++;
			// converting the xml in json using the function XMLToJSON 
			let xml = XMLToJSON(state.xml);
			// updating the cdata
			xml.smxml.matchlist.__cdata = xml.smxml.matchlist.__cdata + `\nOption 2 Value of row ${row}[Option 1 value of row ${row}]\n`;
			// update and store the xml 
			getChildXml(JSONToXML(xml));
			setTimeout(function() {
				var err = smVal.validate(editorState.content_type, editorState.item, editorState.content_icon);
				smValidate(err);
			}, 200);
		} 
	}
	
	function openMediaDialog() {
		//jQuery("#modal-media-upload").modal("show");
		AH.getBS("#modal-media-upload", "Modal").show();
	}

	

    // function calls onchange of the textarea in which option value is given if isalgo is off
	function editCData(val1, val2, i, e) {
		if (!e.target.value) return;
		if (e.target.id == "matchList1") {
			localCData[i].value1 = e.target.value.replace(/\n/gm,"");
			//forceUpdate();
		} else if (e.target.id == "matchList2") {
			localCData[i].value2 = e.target.value.replace(/\n/gm,"");
			//forceUpdate();
		}
		// converting the xml to json 
		let xml = XMLToJSON(state.xml);
		timer['editCdata'] = setTimeout(function() { 
			let newCData = "\n";
			// jQuery(localCData).each(function(i) { // Replaced
				localCData.forEach(function(data,i){
				newCData += localCData[i].value1+"["+localCData[i].value2+"]\n";
			});
			// updating the cdata
			xml.smxml.matchlist.__cdata = newCData;
			// updating the xml
			getChildXml(JSONToXML(xml));
			clearTimeout(timer['editCdata']);
		}, 500);
	}
    
    // function calls onchange of the textarea in which option value is given if isalgo is on
	function editalgoCData(val1, i, placeIndex, e) {
		if (!e.target.value) return;
		if (e.target.id == "matchList1") {
			let placeindex2 = placeIndex.split("_")[1];
			for (var j = 0; j < localCData.length; j++) {
				if (((j+1) == (i+1))) {
					let str = localCData[i].value1;
					var strarr = str.split("%%");
					for (var k = 0; k < strarr.length; k++) {
						if (k == placeindex2) {
							strarr[k] = e.target.value;
							break;
						}	
					}
					break;
				}
			}
			strarr = strarr.join("%%");
			localCData[i].value1 = strarr;
			//forceUpdate();
		} else if (e.target.id == "matchList2") {
			let placeindex2 = placeIndex.split("_")[1];
			for (var j = 0; j < localCData.length; j++) {
				if (((j+1) == (i+1))) {
					let str = localCData[i].value2;
					var strarr = str.split("%%");
					for (var k = 0; k < strarr.length; k++) {
						if (k == placeindex2) {
							strarr[k] = e.target.value;
							break;
						}	
					}
					break;
				}
			}
			strarr = strarr.join("%%");
			localCData[i].value2 = strarr;
			//forceUpdate();
		}
		let xml = XMLToJSON(state.xml);
		timer['algo'] = setTimeout(function() {
			let newCData = "\n";
			// jQuery(localCData).each(function(i) { // Replaced
			localCData.forEach(function(data,i){
				newCData += localCData[i].value1+"["+localCData[i].value2+"]\n";
			});
			xml.smxml.matchlist.__cdata = newCData;
			getChildXml(JSONToXML(xml));
			clearTimeout(timer['algo']);
		}, 500);	
    }
    
    // for deleting the current option
	function removeCData(list1Val, list2Val, id) {
		//AH.alert("checking")
		state.openDeleteDialog = true;
		state.row_id = id;
		
    }
    
    // this function calls when the setting btn option is clicked
	function changeSetting(value) {
		let xml = XMLToJSON(state.xml);
		// if Normal options is selected
		if (value == 2) {
			if (state.drag_mode) {
			xml.smxml.matchlist._multimatch = 0;
			} else {
			xml.smxml.matchlist._multimatch = 2;
			}
		} else if (value == 3) {
			// for swap list
			let tempArr = xml.smxml.matchlist.__cdata.split('\n');
			let swapedCdata = "";
			tempArr.map((items,i)=>{
				let tempList = items.split(/\[(.*?)\]/);
				if (tempList.length > 1) {
					swapedCdata += `${tempList[1]}[${tempList[0].trim()}]\n`;
				}
			});
			xml.smxml.matchlist.__cdata = swapedCdata;
		}
		// updating and storing the xml
		getChildXml(JSONToXML(xml));
		handleMenuClose();
    }
    
	// whenever the image icon is clicked this function calls
	function openImageDialog(class_name) {
		state.openImageDialog = true;
		state.imageClass = class_name;
		// extrcting image details
		let image = {};


		if(AH.select('.'+class_name+' + img').nodeName) {
			image.name = AH.select('.'+class_name+' + img').getAttribute("src").split('/').pop();
			image.alt = AH.select('.'+class_name+' + img').getAttribute("alt");
		} else {
			image.name = "";
			image.alt = "";
		}

		// show value in the opened dailog
		timer['image'] = setTimeout(function() {
			AH.select('#MatchlistImg').value = image.name;
			AH.select('#MatchlistAlt').value = image.alt;
			clearTimeout(timer['image']);
		},200);
    }
    
    // calls when image icon is clicked and is_algo is true 
	function openImageDialogAlgo(class_name, ids, i, clname) {
		state.openImageDialog = true;
		clsname = class_name;
		index = ids;
		columnid = i;
		columnname = clname;
	

		state.imageClass = class_name;
		state.clname = clname;
		// extrcting image details
		let image = {};
		//image.name = (jQuery('.'+class_name+' + img').attr("src")) ? jQuery('.'+class_name+' + img').attr("src").split('/').pop() : "";
		if(AH.select('.'+class_name,' + img').getAttribute('src') != null) {
			image.name = AH.select('.'+class_name+' + img').getAttribute("src").split('/').pop();
			image.alt = AH.select('.'+class_name+' + img').getAttribute("alt");
		} else {
			image.name = "";
			image.alt = "";
		}

		//image.alt = (jQuery('.'+class_name+' + img').attr("alt")) ? jQuery('.'+class_name+' + img').attr("alt"): "";

		
		
		// show value in the opened dailog
		timer['algoImage'] = setTimeout(function() {
			//jQuery('#MatchlistImg').val(image.name);
			AH.select('#MatchlistImg').value = image.name;

			//jQuery('#MatchlistAlt').val(image.alt);
			AH.select('#MatchlistAlt').value = image.alt;
			clearTimeout(timer['algoImage']);
		},500);
    }

    // on click of cancel btn of image dialog this function called
	function closeImageDialog() {
		state.openImageDialog = false;
    }
    
    // on click of done btn of image dialog this function called
	function insertImage() {
		if (state.isalgo == true) {	
			// @pradeep sir : in both condition same code is written can we make it in one
			if ((state.clname == "matchlist2") || (state.clname == "matchlist1")) {
				let image = {};
				// getting the image information
				
				image.name = AH.select("#MatchlistImg").value;
				image.alt = AH.select('#MatchlistAlt').value;
				image.oldValue = AH.select('.'+state.imageClass).value;
				state.openImageDialog = false;
				// replace with new value in the xml
				image.newValue = state.xml.replace(image.oldValue,'*'+image.name+'##'+image.alt);
				// updates the xml
				getChildXml(image.newValue);
			}
		} else {
			// finding the cdata
			let cdataArr = (/\<\!\[CDATA\[([\s\S]*?)\]\]\>/gi).exec(state.xml);
			let cdata = "";
			let keyIndex = parseInt((state.imageClass).match(/\d+$/g));
			let image = {};
			// getting image information
			//image.name = jQuery('#MatchlistImg').val();
			image.name = AH.select("#MatchlistImg").value;
			//image.alt = jQuery('#MatchlistAlt').val();
			image.alt = AH.select('#MatchlistAlt').value;
			//image.oldValue = jQuery('.'+state.imageClass).val();
			image.oldValue = AH.select('.'+state.imageClass).value;
			state.openImageDialog = false;
			if (cdataArr) {
				cdata = cdataArr[1];
				// replacing two newlines with singline newline and spliting it with newline
				cdata = (cdata.replace("\n\n","\n")).trim();
				cdataArr = cdata.split("\n");
				// adding new image details
				cdataArr[keyIndex] = cdataArr[keyIndex].replace(image.oldValue,'*'+image.name+'##'+image.alt);
				// join cdataArr with neeline
				cdata = cdataArr.join("\n");
				// replace the cdata with new value
				image.newValue = xml.replace(/\<\!\[CDATA\[[\s\S]*?\]\]\>/gi,"<![CDATA[\n"+cdata+"\n]]>");
			} else {
				// adding new image details
				image.newValue = xml.replace(image.oldValue,'*'+image.name+'##'+image.alt);
			}
			// update the xml
			getChildXml(image.newValue);
		}
	}
    
    // called when algorithmic checkbox state is changed (on click)
	function changeisalgo(e) {
		
		// convert xml to json
		let xml = XMLToJSON(state.xml);
		state.isalgo = e.target.checked;
		// if checkbox is checked 
		// if (e.target.checked) {
		// 	xml.smxml.matchlist._is_algo = true; 
		// } else {
		// 	xml.smxml.matchlist._is_algo = false;
		// }
		xml.smxml.matchlist._is_algo = e.target.checked;
		// updates the xml
		getChildXml(JSONToXML(xml));
	}

    // on click of delete icon which is adjusent to the option btn this function is called
	function removetextbox(ids, placeIndex, test, i, e) {
		if (test == "matchlist1") {
			var strarr;
			let placeindex2 = placeIndex.split("_")[1];
			for (var j = 0; j < localCData.length; j++) {
				if (((j+1) == (i+1))) {
					let str = localCData[i].value1;
					strarr = str.split("%%");
					for (var k = 0; k < strarr.length; k++) {
						if (k == placeindex2) {
							strarr.splice(k, 1);
							break;
						}	
					}
					break;
				}
			}
			strarr = strarr.join("%%");
			localCData[i].value1 = strarr;
			if (localCData[i].value1 == '' || localCData[i].value1 == 'undefined' ) {
				localCData[i].value1 = 'insert value';
			}
		}
		if (test == "matchlist2") {
			var strarr;
			let placeindex2 = placeIndex.split("_")[1];
			for (var j = 0; j < localCData.length; j++) {
				if (((j+1) == (i+1))) {
					let str = localCData[i].value2;
					strarr = str.split("%%");
					for (var k = 0; k < strarr.length; k++) {
						if (k == placeindex2) {
							strarr.splice(k, 1);
							break;
						}	
					}
					break;
				}
			}
			strarr = strarr.join("%%");
			localCData[i].value2 = strarr;
			if (localCData[i].value2 == '' || localCData[i].value2 == 'undefined' ) {
				localCData[i].value2 = 'insert value';
			}
		}
		let xml = XMLToJSON(state.xml);
		var timer = setTimeout(function() {
			let newCData = "\n";
			//jQuery(localCData).each(function(i) { // Replaced
			localCData.forEach(function(data,i) {
				newCData += localCData[i].value1+"["+localCData[i].value2+"]\n";
			});
			xml.smxml.matchlist.__cdata = newCData;
			getChildXml(JSONToXML(xml));
			clearTimeout(timer);
		}, 500);
		state.dir = !state.dir;
    }
    
    function addListItem(index) {
		// convert xml to json 
		let xml = XMLToJSON(state.xml);
		// splitting cdata with newline and storring it in variable newArr
		let newArr = xml.smxml.matchlist.__cdata.split('\n');
		if (newArr[(newArr.length - 1)] == "") {
			newArr.pop();
			newArr.unshift("");
		} 
		if ((newArr[0] == "") && (newArr[1] == "")) {
			newArr.shift();
		}
		// gettng the index of the option 
		let str = newArr[parseInt(index+1)];
		// extracting value 1
		let value1 = str.replace(str.match(/\[(.*?)\]/g),"").replace(/^\s+/g, "");
		let value2 = str.match(/\[(.*?)\]/g)[0];
		value2 = value2.substring(1, value2.length-1);
		// extracting value 2
		value2 = '['+value2+']';
		// adding new option value
		value1 = value1+'%%Option 2 Value';
		// store the final string at that index
		let fStr = value1+value2;
		newArr[parseInt(index+1)] = fStr;
		// join the array
		newArr = newArr.join('\n');
		// update the cdata
		xml.smxml.matchlist.__cdata = newArr;
		// stores and update the xml using the function getChildXml
		getChildXml(JSONToXML(xml));
    }
    
    // called when dropdown is open 
	function handleMenuOpen(event) {
		state.anchorEl = event.currentTarget;
    }
    
    // called when dropdown is close 
	function handleMenuClose() {
		state.anchorEl = null;
    }
    
    function removeRow() {
		
		state.openDeleteDialog = false;
		
		let not_matched_data = "";
		// storing the values of the option in a except the deleted one
		// jQuery(localCData).each(function(index_no) { // Replaced
		localCData.forEach(function(data,index_no) {
			// check min no of options
			if (localCData.length > 1) {
				if (localCData[index_no].id != state.row_id) {
					not_matched_data += localCData[index_no].value1 + "[" + localCData[index_no].value2 + "]\n";
				}
			} else {
				AI.showmsg('At least one field required.');
				not_matched_data += localCData[index_no].value1 + "[" + localCData[index_no].value2 + "]\n";
			}
		});
		// convert xml to json
		let xml = XMLToJSON(state.xml);
		// updating cdata
		xml.smxml.matchlist.__cdata = '\n' + not_matched_data;
		// updating the xml
		getChildXml(JSONToXML(xml));
	}
	
	
    

	// tempdata1 = [];
	// tempdata2 = [];

	// $:{
	// 	localCData.forEach(function(data,i){
	// 		if(state.isalgo == true) {
	// 			tempdata1 = data.value1.split("%%")
    //         	tempdata2 = data.value2.split("%%")
	// 		}
	// 	})
	// }


</script>

<main>
    <center>
        <div id="fixedMatchList" class="border h-auto fwidth">
            <div class="mb-1">
                <div class="border-bottom w-100 d-inline-block pb-0 px-3 pt-3">
                    <div class="d-flex row">
                        <div class="col-md-6 pr-1">
                            <label for="listheading1" class="mb-0 float-left">{l.matchlist_heading1}</label>
                            <input type="text" id="listheading1" class="form-control" on:change={updateXml} value={state.listheading1} />
                        </div>
                        <div class="col-md-6 pl-1">
                            <label for="listheading2" class="mb-0 float-left">{l.matchlist_heading2}</label>
                            <input type="text" id="listheading2" class="form-control" on:change={updateXml} value={state.listheading2} />
                        </div>
                    </div>
                    <div class="d-flex width1 float-left">
                        <div class="h float-left w-sm mr-2">
                            <label for="maxnode" class="mb-0 float-left">Maxnode:</label>
                            <input type="text" id="maxnode" class="form-control" placeholder="Enter number only 1 to 6" on:change={updateXml} value={state.maxnode} />
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="mt-2 d-flex">
                          
                                    <Checkbox
                                        checked={state.drag_mode}
                                        on:click = {(e)=>{changeSetting("2",e)}}
                                        id="isDragDrop"
                                        color="primary"
                          	            style="position:relative;right:10px;"> 
										  Drag & Drop</Checkbox>
										  
                                    <Checkbox
                                        
                                        on:click = {(e)=>{changeSetting("3",e)}}
                                        id="isSwap"
                                        color="primary"
                                    >Swap List</Checkbox>
                              
                        </div>
                        <div class="mt-2">
                         
                                    <Checkbox 
                                        defaultChecked = {(state.isalgo == true ? true : false)}
                                        on:click = {changeisalgo} 
                                        name = {"isalgo"} 
                                        id = {"isalgo"}
                                        color="primary"
                                    >Algorithmic </Checkbox>
                               
                        </div>
                    </div>
                </div>
            </div>
            <div id="matchListArea" class="row-fluid p-2 clear-both">
				
                {#each localCData as data, i}
                
                        {#if state.isalgo === true}
							
							<div class="h-imp">
								{tempdata1 = data.value1.split("%%")}
								{tempdata2 = data.value2.split("%%")}
							</div>

                                
                                    <div key={i} class="d-flex align-items-center mb-2" dir={state.dir}>
                                        <div class="d-inline-block clear-both pointer light-cyan-bg mx-0 my-1 p-2 width10">
                                            <div class="float-left clear-both">
												
                                                {#each tempdata2 as temp, j}

                                                        <div class="d-flex align-items-center">
                                                            <div class="pull-left word_break width200 p-1 max_width_300" style={'border-radius:3px;'}>
                                                                <textarea rows="3" cols="20" style={"resize:none;"} class={(temp.charAt(0) == "*") ? "h form-control textarea_2_"+i+"_"+j : "form-control textarea_2_"+i+"_"+j} id="matchList2" on:change = {(e)=>{editalgoCData(temp,i,i+'_'+j,e)}} value={temp}/>
                                                                {#if temp.charAt(0) == "*"}
                                                                    <img class="authoringImage" src={"//s3.amazonaws.com/jigyaasa_content_static/"+temp.substr(1).split("##")[0]} alt={(temp.split("##")[1]) ? temp.split("##")[1] :null} />
                                                                
                                                                {/if}													
                                                            </div>
                                                            <div class="pull-right">
                                                                {#if temp.charAt(0) == "*"} 
                                                                    <div class="icomoon-close-2 s4 image_delete" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete Image"></div>
                                                                
                                                                {/if}
                                                                <button type="button" class="d-block btn btn-outline-primary btn-sm edit_btn bg-white mb-1" on:click={(e)=>{openImageDialogAlgo("textarea_2_"+i+"_"+j,i+"_"+j,i,"matchlist2",e)}}><span class="icomoon-images d-flex align-items-center pt-sm1 pb-sm1" data-bs-toggle="tooltip" data-bs-placement="right" title="Add Image"></span></button>													
                                                                <button type="button" class="btn btn-outline-primary btn-sm edit_btn textdel bg-white" on:click={(e)=>{removetextbox("textarea_2_"+i+"_"+j,i+"_"+j,"matchlist2",i,e)}} style={ state.isalgo ? { display:'block'} : {display : 'none'} }><span class="icomoon-24px-delete-1 d-flex align-items-center pt-sm1 pb-sm1" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete"></span></button>
                                                            </div>
                                                        </div>
                                                    
                                                {/each}
                                                <div class="float-left ms-1">
													<button type="button" class={"add_button px-1 btn btn-outline-primary btn-sm bg-white d-flex align-items-center pr-2 "+"listitem"+i} on:click={addListItem.bind(this,i)}>
                                                    <span class="font24">&#43;</span>Add item</button>
                                                </div>
                                            </div>
                                            <div class="pull-right">
												
                                                {#each tempdata1 as temp1, k}
                                                
                                                        <div class="d-flex align-items-center">
                                                            <div class="pull-left word_break width200 p-1 max_width_300" style={"border-radius:3px;"}>
                                                                <textarea rows="3" cols="20" style={"resize:none;"} class={(temp1.charAt(0) == "*") ? "h form-control textarea_1_"+i+"_"+k : "form-control textarea_1_"+i+"_"+k} id="matchList1" on:change={(e)=>{editalgoCData(temp1,i,i+'_'+k,e)}} value={temp1}/>
                                                                {#if temp1.charAt(0) == "*"}
                                                                    <img class="authoringImage" src={"//s3.amazonaws.com/jigyaasa_content_static/"+temp1.substr(1).split("##")[0]} alt={(temp1.split("##")[1]) ? temp1.split("##")[1] :null} />
                                                                {/if}
                                                                
                                                            </div>
                                                            <div class="pull-right">
                                                                {#if temp1.charAt(0) == "*"}
                                                                    <div class="icomoon-close-2 s4 image_delete" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete Image"></div>
                                                                {/if}
                                                                <button type="button" class="d-block btn btn-outline-primary btn-sm edit_btn bg-white mb-1" on:click={(e)=>{openImageDialogAlgo("textarea_1_"+i+"_"+k,i+"_"+k,i,"matchlist1",e)}}><span class="icomoon-images d-flex align-items-center pt-sm1 pb-sm1" data-bs-toggle="tooltip" data-bs-placement="right" title="Add Image"></span></button>
                                                                <button type="button" class="btn btn-outline-primary btn-sm edit_btn textdel bg-white" on:click={(e)=>{removetextbox("textarea_2_"+i+"_"+k,i+"_"+k,"matchlist1",i,e)}} style={ state.isalgo ? 'display:block;' : 'display : none' }><span class="icomoon-24px-delete-1 d-flex align-items-center pt-sm1 pb-sm1" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete"></span></button> 
                                                            </div>
                                                        </div>
                                                {/each}
                                            </div>
                                        </div>
                                        <div class="width1 float-right">
                                            <a on:click={()=>{removeCData(data.value1,data.value2,data.id)}}>
                                                <span aria-hidden="true" class="delete_match_node_auth icomoon icomoon-new-24px-delete-1 s3 py-1" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete"></span>
                                            </a>
                                        </div>
                                    </div>
                        {:else}
                            
                                <div key={i} class="d-flex align-items-center mb-2">
                                    <div class="pointer d-inline-block clear-both light-cyan-bg mx-0 my-1 p-2 width10">
                                        <div class="pull-left d-flex align-items-center">
                                            <div class="pull-left word_break width200 p-1 max_width_300" style={'borderRadius:3px;'}>
                                                <textarea rows="3" cols="20" style={"resize:none;"} class={(data.value2.charAt(0) == "*") ? "h form-control textarea_2_"+i : "form-control textarea_2_"+i} id="matchList2" on:change={(e)=>{editCData(data.value2,data.value2,i,e)}} value={data.value2} />
                                                
                                                {#if data.value2.charAt(0) == "*"}
                                                    <img class="authoringImage" src={"//s3.amazonaws.com/jigyaasa_content_static/"+data.value2.substr(1).split("##")[0].split('%%')[0]} alt={(data.value2.split("##")[1]) ? data.value2.split("##")[1] :null} /> 
                                                {/if}													
                                            </div>
                                            <div class="pull-right mt">
                                                {#if data.value2.charAt(0) == "*"} 
                                                    <div class="icomoon-close-2 s4 image_delete" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete Image"></div> 
                                                {/if}
                                                <button type="button" class="btn btn-outline-primary btn-sm edit_btn bg-white" on:click={()=>{openImageDialog("textarea_2_"+i)}}>
                                                    <span class="icomoon-images d-flex align-items-center pt-sm1 pb-sm1" data-bs-toggle="tooltip" data-bs-placement="right" title="Add Image">
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="pull-right d-flex align-items-center">
                                            <div class="pull-left word_break width200 p-1 max_width_300" style={"border-radius:3px"}}>
                                                <textarea rows="3" cols="20" style={"resize:none;"} class={(data.value1.charAt(0) == "*") ? "h form-control textarea_1_"+i : "form-control textarea_1_"+i} id="matchList1" on:change={(e)=>{editCData(data.value1,data.value2,i,e)}} value={data.value1} />

                                                {#if data.value1.charAt(0) == "*"}
                                                    <img class="authoringImage" src={"//s3.amazonaws.com/jigyaasa_content_static/"+data.value1.substr(1).split("##")[0].split('%%')[0]} alt={(data.value1.split("##")[1]) ? data.value1.split("##")[1] :null} />
                                                {/if}
                                            </div>
                                            <div class="pull-right mt">
                                                {#if data.value1.charAt(0) == "*"}
                                                    <div class="icomoon-close-2 s4 image_delete" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete Image"></div> 
                                                {/if}
                                                <button type="button" class="btn btn-outline-primary btn-sm edit_btn bg-white" on:click={()=>{openImageDialog("textarea_1_"+i)}}>
                                                    <span class="icomoon-images d-flex align-items-center pt-sm1 pb-sm1" data-bs-toggle="tooltip" data-bs-placement="right" title="Add Image"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="width1 float-right">
                                        <a on:click={()=>{removeCData(data.value1,data.value2,data.id)}}>
                                            <span aria-hidden="true" class="icomoon icomoon-new-24px-delete-1 s3 delete_match_node py-1" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="right" title="Delete"></span>
                                        </a>
                                    </div>
                                </div>
                            
                        {/if}
                        
                {/each}
                
            </div>
            <div class="text-left ml-2 pb-3">
                <button 
                    id = "add_node"
                    aria-label = "Add node"
                    class = "btn btn-outline-primary btn-sm d-flex align-items-center pr-md add_button"
                    on:click ={updateCData}>
                    <span class="font24">&#43;</span>Add node
                </button>
            </div>
        </div>
	</center>
	<Dialog bind:visible={state.openImageDialog} disableEnforceFocus={true} style={'width:600px;'}>
				<div style="text-align: left;font-weight:bold;" class="mb-5">
					<div>Add Image</div>
				</div>
		        	<div>
		        		<div class="imageDialog">
				        	<div class="row mx-0">
						        <div class="col-md-6 px-1">
									<div class="form-group">
										<label class="control-label font-weight-normal mb-0" for="MatchlistImg">Background Image</label>
										<input type="text" class="form-control form-control-md" id="MatchlistImg" placeholder="Image url" />
									</div>
						        </div>
						        <div class="col-md-6 px-1">
									<div class="form-group">
										<label class="control-label font-weight-normal mb-0" for="MatchlistAlt">Background Alt</label>
										<input type="text" class="form-control form-control-md" id="MatchlistAlt" placeholder="Background alt text" />
									</div>
						        </div>
						        <div class="col-md-6 px-1">
						    		<button class="btn btn-outline-primary" on:click={openMediaDialog}>Upload Image</button>
						    	</div>
						    </div>
				        </div>
		        	</div>
						<div slot="footer" class="svelteFooter">
							<input type="button" class="cancel_btn_pop btn btn-light colorgray1" variant="contained" on:click={closeImageDialog} value={l.cancel} />
							<Button variant="contained" id="cdata" on:click={insertImage} class="text-white bg-primary">
								Done
							</Button>
						</div>
				</Dialog>
				
				<Dialog
					bind:visible={state.openDeleteDialog}
					style={'width:500px;'}
				>
					<div style="font-weight:bold;">{l.save_header}</div>
					<div>
						<div class="row">
						<span class="col-md-12" style={'margin-top:40px;margin-bottom:40px;'}>{l.del_confirmation}</span>
						</div>
					</div>
				

					<div slot="footer" class="svelteFooter">
						<Button variant="contained" on:click={removeRow}
							class="bg-primary text-white"> Yes </Button>
						<input type="button" variant="contained" on:click={() => {state.openDeleteDialog = false;}} class="btn btn-light colorgray" value="No" />
					</div>
			
					
					
				</Dialog>
</main>
<style>

	

	.colorgray {
        width:56px;
        background-color: rgb(255, 206, 206);
    }
	.colorgray1 {
		width:74px;
		background: #E0E0E0;
	}

	.font24 {
		font-size: 22px !important;
		margin-right: 5px;
    }

	.add_button {
		height:31px;
	}

	
</style>