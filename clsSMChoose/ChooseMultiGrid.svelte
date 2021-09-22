<!--
 *  File Name   : ChooseMultiGrid.svelte
 *  Description : Container for defining multigrid question Authoring Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 19-Jan-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
	import { onMount } from "svelte";
	import l from '../src/libs/editorLib/language';
	import { XMLToJSON, AH, JSONToXML } from '../helper/HelperAI.svelte';
	let state = {
		xml: "",            
		headingCorrect: "",			
		CDATA: "",
		maxrow: 0,
		maxcol: 0,
		openImageDialog: false,
		imageClass: "",			
		delid: "", 
		imgVal: "",	
		altVal: ""	
	}
	let authoring_data = {
		localCData1:[],
		rowindex:[]
	};

	export let xml;
	export let getChildXml;
	let cols, counter, counter1, count, table_row;

	onMount(() => {
		state.xml = xml;
		loadModule(xml); 

		AH.listen(document,'click','.columnContainer',function(e) {
			var elem_id = e.getAttribute('id');
			setTimeout(function () {
				if(AH.find('#' + elem_id,'img','all').length > 0) {
					let im = AH.find('#' + elem_id,'img').getAttribute('src');
					im = im.replace(/\/\/s3.amazonaws.com\/jigyaasa_content_static\//, '');
					AH.select('#MatchlistImg').value = im;
					AH.select('#MatchlistAlt').value = AH.find('#' + elem_id,'img').getAttribute('alt');
				} else {
					AH.select('#MatchlistImg').value = '';
					AH.select('#MatchlistAlt').value = '';
				}
			},300);
		})



	});
	$: {
		count = 0;
		counter = 0;
		cols = parseInt(state.maxcol);
		counter1 = cols;
		table_row = [];
		authoring_data.localCData1.slice(0, parseInt(state.maxrow)).map(function (data, index) {
			authoring_data.localCData1.slice(counter, counter1).map( (value) => {
				count++;
				table_row = [
                ...table_row, {
					id: 'td' + (count - 1),
					key: "heading" + (count - 1),
					name: "authcheck" + (count - 1),
					delbtn: "delbtn" + (count - 1),
					count: count - 1,
					authTA: "authTA" + (count - 1),
					colData: value,
					row: index
				}];
			});
			counter = counter1;
			counter1 = counter1 + cols;
		});
	}

	// loads the module and update the xml
	function loadModule(loadXml) {
		// contains the json data of xml
		loadXml = XMLToJSON(loadXml);
		state.headingCorrect = loadXml.smxml.list._headingCorrect;
		state.maxrow = loadXml.smxml.list._row;
		state.maxcol = loadXml.smxml.list._col;
		// parses the xml and updates the elements value
		parseXMLAuthoring(loadXml);
	}

    // parses the xml and updates the values of elements
	function parseXMLAuthoring(MYXML) {
		authoring_data.localCData1 = [];
		let cdata = MYXML.smxml.list.__cdata.split("\n");
		for(let i in cdata) {
			if (cdata[i].trim() != "") {
				dataToPush(cdata[i],i);	
			} else {				
				let istobepushed = false;
				for (let j = i; j < cdata.length; j++) {
					if (cdata[j].trim() == "" && j != (cdata.length-1)) {						
						istobepushed = false;
					} else {						
						istobepushed = true;
						break;
					}
				}
				if (istobepushed == true) {
					dataToPush(cdata[i],i);	
				}
			}
		}
		storeCorrectXYValue(authoring_data.localCData1);
		storeIndexValue(authoring_data.localCData1);		
		state.headingCorrect = MYXML.smxml.list._headingCorrect;		
	}

	// add values in the array
	function dataToPush(value,index) {
		authoring_data.localCData1.push({
			value: value.replace(/^\s+/g, ""),
			colval: "",
			rowval: "",
			mainseq: "",
			x: 0,
			y: 0,
			id: index,
		});
	} 

	//to update multigrid table heading
	function updateSetting(e) {
		let xml = XMLToJSON(state.xml);	
		switch(e.target.id) {			
			case "headingCorrect" :
			{			
				state.headingCorrect = e.target.value;
				xml.smxml.list._headingCorrect = e.target.value;
				break;
			}
		}
		state.xml = JSONToXML(xml);
	}

	//to update xml
	function updateXML() {
		let xml = XMLToJSON(state.xml);
		setTimeout(function() {
			let newCData = "";
			authoring_data.localCData1.forEach(function(localCDataVal, i) {
				(i < (authoring_data.localCData1.length - 1) ? newCData += localCDataVal.value + "\n" : newCData += localCDataVal.value);							
			});
			xml.smxml.list.__cdata = newCData;
			getChildXml(JSONToXML(xml));
		},200);
	}

	//to update fixed box via checkbox
	function updateCorrect(data, index_no, event) {
		authoring_data.localCData1[index_no].value = (event.target.checked == true && authoring_data.localCData1[index_no].value.trim().charAt(0) != "!" ? "!" + authoring_data.localCData1[index_no].value.trim() : authoring_data.localCData1[index_no].value.trim().slice(1));	
		updateXML();
	}

	//to edit values in multigrid table
	function editCdata(i,e) {	
		authoring_data.localCData1[i].value = (authoring_data.localCData1[i].value.charAt(0) == "!" ? "!"+e.target.value.replace(/\n/gm,"") : e.target.value.replace(/\n/gm,""));		
	}

	//to store correct x y value
	function storeCorrectXYValue(layout) {
		let temporary = 0,
			counter_new = 0;	
		for (let i = 0; i < layout.length; i++) {
			if (temporary == state.maxcol) {
				temporary = 0;
				counter_new = counter_new+3;									
			}
			layout[i].x = temporary;
			layout[i].y = counter_new;									
			temporary++;	
		}
	}

	//to set index value in array
	function storeIndexValue(array) {		
		let k = 1,
			j = 1,
			count = 1,
			ref = 0;
		authoring_data.rowindex = [];		
		for(let i = 0; i < array.length; i++) {		
			array[i].colval = j;
			array[i].rowval = k;
			array[i].ischecked = false;
			array[i].mainseq = k+"-"+j;
			j++;			
			if (count == state.maxcol) {
				authoring_data.rowindex.push({["row"+k]:[]});				
				for(let l = ref; l <= i; l++) {
					authoring_data.rowindex[k-1]["row"+k].push(l);
				}
				ref = i+1;				
				j = 1;
				k++;
				count = 0;						
			}
			count++;		
		}
		return array;
	}

	//to open upload image dialog
	function openImageDialog(e,class_name) {
		console.log('checking....... image');
		state.openImageDialog = true;
		state.imageClass = class_name;
		let timer;
		if (state.imgVal || state.altVal) {
			(timer) ? clearTimeout(timer) : null;
			timer = setTimeout(function() {
				clearTimeout(timer);
				AH.select('#MatchlistImg').value = state.imgVal;
				AH.select('#MatchlistAlt').value = state.altVal;
			}, 200);
		}
		AH.getBS(AI.select('#addImageModal'), 'Modal').show();
	}

	//close upload image dialog
	function closeImageDialog() {
		state.openImageDialog = false;
	}

	//to insert image in multigrid table
	function insertImage() {
		let image = {};		
		image.name = AH.select('#MatchlistImg').value;
		image.alt = AH.select('#MatchlistAlt').value;
		let id = state.imageClass.substr(6, state.imageClass.length);
		state.imgVal = AH.select('#MatchlistImg').value;
		state.altVal = AH.select('#MatchlistAlt').value;
		image.oldValue = AH.select('#' + state.imageClass).value;
		if (image.name != '') {
			state.openImageDialog = false;	
		} else {
			AH.alert(l.validate_dialog, 4, true);
			return;
		}	
		if (authoring_data.localCData1[id].value.charAt(0) == "!") {
			image.newValue = '!*' + image.name + '##' + image.alt;
		} else {
			image.newValue = '*' + image.name + '##' + image.alt;
		}
		setTimeout(()=> {
			authoring_data.localCData1[id].value = image.newValue;
		},50);
		let xml = XMLToJSON(state.xml);
		setTimeout(function() {
			let newCData = "";
			authoring_data.localCData1.forEach(function(localCDataValue, i) {
				(i < (authoring_data.localCData1.length-1) ? newCData += localCDataValue.value + "\n" : newCData += localCDataValue.value);												
			});					
			xml.smxml.list.__cdata = newCData;
			getChildXml(JSONToXML(xml));
		},200);
	}

	//to delete image
	function deleteimage(id) {			
		let oldImage = authoring_data.localCData1[id].value;
		let newValue = (oldImage.charAt(0) == "!") ? "!Option value" : "Option value";	
		setTimeout(()=> {
			authoring_data.localCData1[id].value=newValue;
		},50);
		let xml = XMLToJSON(state.xml);
		setTimeout(function() {
			let newCData = "";
			authoring_data.localCData1.forEach(function(localCDataValue, i) {
				(i < (authoring_data.localCData1.length-1) ? newCData += localCDataValue.value+"\n" : newCData += localCDataValue.value);																	
			});
			xml.smxml.list.__cdata = newCData;
			getChildXml(JSONToXML(xml));
		},200);
	}

	//to manipulate row col to get desired value
	function manipulateRowCol(roworcol,bool) {
		let xml = XMLToJSON(state.xml);
		setTimeout(function() {
			let newCData = "";
			authoring_data.localCData1.forEach(function(localCDataValue, i) {
				(i < (authoring_data.localCData1.length-1) ? newCData += localCDataValue.value+"\n" : newCData += localCDataValue.value);						
			});
			(roworcol == "row" ? xml.smxml.list._row = (bool == true ? (parseInt(xml.smxml.list._row)+1).toString() : (parseInt(xml.smxml.list._row)-1).toString()) : (xml.smxml.list._col = (bool == true ? (parseInt(xml.smxml.list._col)+1).toString() : (parseInt(xml.smxml.list._col)-1).toString())));								
			xml.smxml.list.__cdata = newCData;
			state.xml = JSONToXML(xml)
			getChildXml(state.xml);
		},200);	
	}

	//add new row to the multigrid table
	function addRow() {
		if (state.maxrow <= 9) {
			addRowAfterPassedLimitCriteria();
		} else {
			AH.alert('Maximum possible value of rows are 10.');
		}
	}

	// to add row if condition satisfied
	function addRowAfterPassedLimitCriteria() {
		state.maxrow = (parseInt(state.maxrow) + 1);		
		setTimeout(()=> {
			for (let index_no = authoring_data.localCData1.length; index_no < (parseInt(state.maxrow) * parseInt(state.maxcol)); index_no += 1) {
				authoring_data.localCData1.push({
					value:  "Option value" + index_no,
					colval: "",
					rowval: "",
					mainseq: "",
					x: 0,
					y: 0,
					id: index_no,
				});
			}
			storeCorrectXYValue(authoring_data.localCData1);
			storeIndexValue(authoring_data.localCData1);
		}, 50);
		manipulateRowCol("row", true);
	}

	//to remove row from multigrid table
	function removeRow() {
		if (state.maxrow > 2) {	
			state.maxrow = parseInt(state.maxrow)-1;
			let array = [];				
			storeCorrectXYValue(authoring_data.localCData1);
			setTimeout(()=> {
				for(var i = parseInt(state.maxcol)-1; i >= 0; i--) {					
					array = authoring_data.localCData1.splice(authoring_data.rowindex[state.delid]["row"+(state.delid+1)][i], 1);					
				}
			},50);				
			manipulateRowCol("row",false);				
		} else {
			alert(l.row_limit);
		}
	}

	// to add col if condition satisfied
	function addColumn() {
		if (state.maxcol <= 4) {
			addColumnAfterPassedLimitCriteria();
		} else {
			AH.alert('Maximum possible value of columns are 5.');
		}
	}

	// to add col if condition satisfied
	function addColumnAfterPassedLimitCriteria() {			
		state.maxcol = (parseInt(state.maxcol) + 1);
		setTimeout(()=> {
			let indexNum = state.maxcol - 1;
			let originalColLength = state.maxcol - 1;
			for (let index_no = authoring_data.localCData1.length; index_no < (parseInt(state.maxrow) * parseInt(state.maxcol)); index_no += 1) {
				authoring_data.localCData1.splice(indexNum, 0, {
					value:  "Option value" + index_no,
					colval: "",
					rowval: "",
					mainseq: "",
					x: 0,
					y: 0,
					id: index_no,
				});
				indexNum = indexNum + originalColLength + 1;
			}
			storeCorrectXYValue(authoring_data.localCData1);
			storeIndexValue(authoring_data.localCData1);
		}, 50);
		manipulateRowCol("col", true);
	}

	//to remove row from multigrid table
	function removeOption() {	 	
		let array = [];
		state.maxcol = parseInt(state.maxcol)-1;				
		storeCorrectXYValue(authoring_data.localCData1);
		setTimeout(()=>{
			for (let i = parseInt(state.maxrow)-1; i >=0 ; i--) {					
				array = authoring_data.localCData1.splice(authoring_data.rowindex[i]["row"+(i+1)][state.delid], 1);					
			}
		},50);
		manipulateRowCol("col",false);
	}

	function openConfirmationRow(id) {
		state.delid = id;
		AH.getBS(AI.select('#confirmationRowModal'), 'Modal').show();
	}

	function openConfirmationCol(id) {
		state.delid = id;
		AH.getBS(AI.select('#confirmationColModal'), 'Modal').show();
	}

	//to open upload image modal
	function uploadImage() {
		AH.getBS(AI.select('#modal-media-upload'), 'Modal').show();
	}

	// For ADA
    function keydownAda(event) {
        if (event.which === 13) {
            // click the icons or image upload icon on which keydown
            this.click();
        }
    }

		</script>
		<div id="mainDiv" class="pb-2 border float-none mx-auto my-0" style ="min-width: '300px', min-height: '1px'">
	<div class="choose_head_content bg-white text-left border-bottom px-2 pt-2 pb-2 mt-1" style ="overflow-x: 'hidden'">				
		<div class="form-group row mx-0 mb-1">
			<label for="headingCorrect" class="mt-2 width80 float-start font15">Title</label>
			<div class="width10 ml-3 float-end">
				<input on:change={updateSetting} on:blur={updateXML} id="headingCorrect" name="headingCorrect" type="text" class="form-control" value={state.headingCorrect} />
			</div>
		</div>
	</div>
	<div class="choose_item_container d-flex align-items-center text-left bg-white overflow-auto m-2">
		<table class="table relative" id="mytable">
			<thead>
				<tr class="table-head border-top">
					{#each authoring_data.localCData1.slice(0, parseInt(state.maxcol)+1) as data, i } 
						{#if i != 0}
							<th key={i-1} class="text-left bg-white align-middle">
								<div tabindex="0" title="Delete Column" role="button" id="delcol{i-1}" data-id={i-1} key="delcol{i-1}" on:keydown="{keydownAda}" on:click="{() => {openConfirmationCol(i-1)}}">
									<span aria-hidden="true" class="remove-item icomoon-24px-delete-1 s3 text-dark"></span>
								</div>
							</th>
						{:else}
							<th class="bg-white"></th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each authoring_data.localCData1.slice(0, parseInt(state.maxrow)) as item, i}
					<tr>
						<td class="text-center width46">
							<span tabindex="0" title="Delete Row" role="button" class="pointer font18 position-relative" id="delrow{i}" on:keydown="{keydownAda}" on:click="{() => {openConfirmationRow(i)}}" >
								<span aria-hidden="true" class="remove-item icomoon-24px-delete-1 s3 text-dark"></span>
							</span>
						</td>
						{#if table_row && table_row.length > 0}
							{#each table_row as data}
								{#if data.row == i}
									<td class="columnContainer p-0 width200" id ={data.id}>
										<div key={data.key} class="light-cyan-bg p-2 width200 d-flex">
											<input 
												tabindex="0"
												type="checkbox" 
												checked={data.colData.value.charAt(0) == "!"}  
												on:click={updateCorrect.bind(this, data.colData.value, data.count)}
												name="{data.name}" 
												id="{data.name}" 
												aria-label="fix cell checkbox"
												key="{data.name}" 
												class="m-2 position-relative top1"
												role="button"
											/>
											<i class="icomoon-lock-sm s3 m-2 text-dark"></i>
											<div tabindex="0" role="button" data-bs-toggle="tooltip" title="Add Image" class="edit_btn text-dark mt-1 ml-2" on:keydown="{keydownAda}" on:click={(e) => {openImageDialog(e,data.authTA)}}>
												<span class="icomoon-images s4"></span>
											</div>
											{#if (data.colData.value.charAt(0) == "*") || ((data.colData.value.charAt(0) == "!") &&  (data.colData.value.charAt(1) == "*"))}
												<div tabindex="0" id="{data.delbtn}" role="button" class="icomoon-close-2 s3 image_delete text-dark pointer float-right ml-3 mt-2" on:keydown="{keydownAda}" on:click={() => {deleteimage(data.count)}}></div>
											{/if}
										</div>
										{#if (data.colData.value.indexOf("*") != 0 && data.colData.value.indexOf("*") != 1)}
											<div class="p-2">
												<input
													type="text"											
													multiline
													rows={2}											
													id="{data.authTA}" 
													name="{data.authTA}" 
													key="{data.authTA}" 
													aria-label="Option Value"
													value={((data.colData.value.charAt(0) == "!") ? data.colData.value.slice(1): data.colData.value)}
													on:change={editCdata.bind(data.colData.value, data.count)}	
													on:blur={updateXML}		
													class="px-2 pb-2 form-control"								
												/>
											</div>
										{/if}
										{#if data.colData.value.charAt(0) == "*"}
											<img id= "{data.authTA}" style ="height: 70px; width: 100%; object-fit: contain;" class="authoringImage px-2" src="//s3.amazonaws.com/jigyaasa_content_static/{data.colData.value.split("##")[0].slice(1)}" alt={(data.colData.value.split("##")[1]) ? data.colData.value.split("##")[1] :null} />
										{/if}
										{#if (data.colData.value.charAt(0) == "!") &&  (data.colData.value.charAt(1) == "*")}
											<img id= "{data.authTA}" class="authoringImage px-2" style="height: 70px; width: 100%; object-fit: contain;" src="//s3.amazonaws.com/jigyaasa_content_static/{data.colData.value.split("##")[0].slice(2)}" alt={(data.colData.value.split("##")[1]) ? data.colData.value.split("##")[1] :null} />
										{/if}
									</td>
								{/if}
							{/each}
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<button type="button" class="btn btn-sm btn-outline-primary mx-1 width109 align-items-center d-flex mb-3 add_cat_btn" id="addColumn" on:click={addColumn}>
			<span class="icomoon-new-24px-add-circle-1 s3 mr-1"></span> Add Column
		</button>
	</div>
	<div class="text-center my-2">
		<button type="button" class="btn btn-sm btn-outline-primary mx-1 width94 mb-2 mt-2 pr-md" id="addRow" on:click={addRow}>
			<span class="icomoon-new-24px-add-circle-1 s3 mr-1 top1 position-relative"></span> Add Row
		</button>
	</div>						
	<input id="check" type="hidden" class="" value="" /> 
	<input type="hidden" name="special_module_xml" id="special_module_xml" defaultValue={state.xml} />
</div>

<div class="modal" id="confirmationRowModal">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">{state.maxrow<=2?"Warning!": "Confirmation"}</h4>
				<button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true" >&times;</button>
			</div>
			<div class="modal-body text-center">
				<div class="row">
					<div class="col-sm-12">
						<p>{state.maxrow<=2? l.row_limit:l.del_confirmation}</p>
					</div>
				</div>
			</div>
			<div class="modal-footer mt-0">
				{#if state.maxrow<=2}
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">OK</button>
				{:else}
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">No</button>
					<button type="button" id="cdata" class="btn btn-primary" data-bs-dismiss="modal" on:click={removeRow}>Yes</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="modal" id="confirmationColModal">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">{state.maxcol<=2?"Warning!": "Confirmation"}</h4>
				<button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true" >&times;</button>
			</div>
			<div class="modal-body text-center">
				<div class="row">
					<div class="col-sm-12">
						<p>{state.maxcol<=2? l.col_limit:l.del_confirmation}</p>
					</div>
				</div>
			</div>
			<div class="modal-footer mt-0">
				{#if state.maxcol<=2}
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">OK</button>
				{:else}
					<button type="button" class="btn btn-light" data-bs-dismiss="modal">No</button>
					<button type="button" id="cdata" class="btn btn-primary" data-bs-dismiss="modal" on:click={removeOption}>Yes</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="modal" id="addImageModal">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Add Image</h4>
				<button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true" >&times;</button>
			</div>
			<div class="modal-body">
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
							<button type="button" class="btn btn-md btn-outline-primary" id="upload_img" name="upload_img" on:click="{uploadImage}">Upload image</button>
							<div class="upload_status"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer mt-0">
				<button type="button" on:click={closeImageDialog} class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
				<button type="button" id="cdata" on:click={insertImage} class="btn btn-primary" data-bs-dismiss="modal">Done</button>
			</div>
		</div>
	</div>
</div>

<!--not in use - maybe used in future-->
<!--<div class="modal" id="addNewMatchlistModal">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Add New MatchList</h4>
				<button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true" >&times;</button>
			</div>
			<div class="modal-body text-center">
				<div id="listValue">
					<div class="float-start">
						<input type="text" id="list1Value" placeholder={((AH.select("#list1Value").innerHTML() != "")?"List 1 Value": "")}>
					</div>
					<div class="float-end">
						<input type="text" id="list2Value" placeholder={((AH.select("#list2Value").innerHTML() != "")?"List 2 Value": "")}>
					</div>
				</div>
				<div class="clear-both">*For multiple responses separate the value with | symbol in List 2 box</div>
			</div>
			<div class="modal-footer mt-0">
				<button type="button" on:click={closeImageDialog} class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
				<button type="button" id="cdata" on:click={insertImage} class="btn btn-primary" data-bs-dismiss="modal">Done</button>
			</div>
		</div>
	</div>
</div>-->
