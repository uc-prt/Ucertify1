<!--
 *  File Name   : ChoiceMatrix.svelte
 *  Description : Decided the "Term" & "Option"
 *  Author      : Sundaram Tripathi
 *  Package     : pe-items
 *  Last update : 05-May-2021
 *  Last Updated By : Pradeep Yadav
-->
<svelte:head>
	<link href="./choiceMatrix.css" rel="stylesheet" />
</svelte:head>

<script>  
	import { onMount,afterUpdate } from "svelte";
	import { writable } from "svelte/store";
	import l from '../src/libs/Lang'
	import lib1 from './parseCSV.js';
	import {XMLToJSON, AH} from "../helper/HelperAI.svelte";
	export let getChildXml;
	export let xml;

	// variable declaration
	let themeOption = ['light_blue','dark_blue','peach','green','purple'];
	let widthVal = "";
	let icon_class = "icomoon-new-24px-delete-1 s3";
	let lastAction;
	let state = {};
	let stateData = writable({ 
		cdata 		: "",
		stem		: "",
		xml			: "",
		theme		: "",
		font		: "",
		maxWidth	: "",
	});
	const unsubscribe = stateData.subscribe((items) => {
		state = items;
	})

		////////////    Exectuing each time the xml will change //////////////

	afterUpdate(() => {
		if (xml!=state.xml) {
			state.xml = xml;
			loadModule(xml); 	
		}
	})
	
    onMount(() => {		
		AH.listen(document,'keydown','textarea',function(event) {
			if (event.keyCode == 13) {
		    	event.preventDefault();
		    }
		})
		
		document.querySelector('.add_stem, .add_stem').addEventListener("click",function(event) {
			event.preventDefault();
		});
		// try catch block in error handling
		try {
			// check if xml is not blank
            if (xml) {
				// load the module on the basis of xml 
				loadModule(xml);
				// update the cdata accordingly
				reverseXml();
            }
        } catch(e) {
            console.log({Error:e.message, File:"choiceMatrix", Line:"65"});
		}
		
		AH.listen(document,'keydown','.delete_column', function(_this, event) {
			if ((event.keyCode == 13 || event.which == 13)) {
			// click the element which currently get the focus and enter key is down
			AH.trigger(_this, 'click');
			//_this.dispatchEvent(new Event("click"));
			event.preventDefault();
			}
		});

		AH.listen(document,'keydown','.delete_row', function(_this,event) {
			if ((event.keyCode == 13 || event.which == 13)) {
			// click the element which currently get the focus and enter key is down
			_this.dispatchEvent(new Event("click"));
			event.preventDefault();
			}
		})

	})

	// it load the module 
	function loadModule(loadXml) {
		// convert the xml into json and pass it in the parseXMLAuthoring function to parse the xml
		loadXml = XMLToJSON(loadXml);
		parseXMLAuthoring(loadXml);
	}

	// it is used for parsing the xml for authoring area
	function parseXMLAuthoring(MYXML) {
        let formattedData = lib1.parseCSVFormat(MYXML.smxml.__cdata);
		let cdata = formattedData;
		let rawData = [];
		// copying the JSON data in the rawData and make it array 
		
	    rawData = JSON.parse(JSON.stringify(cdata));
		state.cdata = rawData;
		state.stem = rawData.stem;
		state.theme = MYXML.smxml._theme;
		state.font = MYXML.smxml._font;
		state.maxWidth = ((MYXML.smxml._maxwidth)?parseInt(MYXML.smxml._maxwidth):800);
			
			
			//document.getElementById("msg").value = rawData['stem'];
			//jQuery('#msg').val(rawData.stem); // Need TO FIX
			
		

		//	for checking the radio btn according to the xml
		/*	let timer = setTimeout(function() {
				jQuery(".preview_radio").each(function() {
					jQuery(this)[0].checked = ((jQuery(this).attr('value') == jQuery(this).attr('data-correct')) ? true : false);
				});
				clearTimeout(timer);
			}.bind(this),200) // Replaced 
		*/

		let timer = setTimeout(function() {
			let radio_len1 = document.getElementsByClassName('preview_radio');
			for(let i = 0; i<radio_len1.length; i++) {
				radio_len1[i].checked = ((radio_len1[i].getAttribute('value') == radio_len1[i].getAttribute('data-correct')) ? true : false );
			}
			clearTimeout(timer);
		},200)
	}

	// calls on change in the stem textarea
	function updateStem(e) {
        state.stem = e.target.value
		state.cdata.stem = e.target.value;
		// updaing the cdata
		reverseXml();
	}

	//////////// Update the cdata ///////////////////
	function reverseXml() {
		let csvReverse = reverseCSVFormat(state.cdata);
		csvReverse = csvReverse.replace(/\’|\′/g,"'").replace(/\″|\“|\”/g,"\"");
		let updatedXml = `<smxml type="27" name="ChoiceMatrix" theme="${state.theme}" font="${state.font}" maxwidth="${state.maxWidth}"><!--[CDATA[${csvReverse}]]--></smxml>`;
		getChildXml(updatedXml);    
	}


	// it format the cdata
	function reverseCSVFormat(data) {
		// value of stem
		let csvFormat = data.stem+",";
		// getting values of option and appending it to the csvFormat
		data.option.map((val1)=> {
			csvFormat += val1.text+",";
		});
		csvFormat += "\n";

		data.term.map((val2,j)=> {
			// adding the text of term
			csvFormat += val2.text+",";

			// adding 1,0 n the basis of radio is checked or not
			data.option.map((val1)=> {
				csvFormat += ( (val2.correct == val1.id) ? "1," : "0," );
			});
			csvFormat += "\n";
		});

		// returning all the appended data
		return csvFormat;
	}

	function updateTermValue(e) {
		//it update the text of that particular term by finding the id of the changed term textarea
		state.cdata && (state.cdata.term.map(function(data, i) {
			if (data.id == e.target.id) {
				data.text = e.target.value;
			}
		}));
		// update the cdata
		reverseXml();
	}

	////////////// updating the option ///////////////
	function updateOptionValue(e) {
		//it update the text of that particular option by finding the id of the changed option textarea
		state.cdata && (state.cdata.option.map(function(data, i) {
			if (data.id == e.target.id) {
				data.text = e.target.value;
			}
		}));
		// update the cdata
		reverseXml();
	}

	///////////  Added row rows  /////////////////
	function addStem() {
		let id = (state.cdata.term.length + 1);
		if (id <= 6) {
			state.cdata.term.push({id: "t" + id, correct: "", text: "Term Sample text"});
			reverseXml();
		} else {
			AH.alert('Maximum possible value of rows are 6.');
		}
	}

	/////////  This function is added the column  ///////////////
	function addOption() {
        let id = (state.cdata.option.length + 1);
		if (id <= 4) {
			state.cdata.option.push({id: "o" + id, text: "Option"});
			reverseXml();
		} else {
			AH.alert('Maximum possible value of columns are 4.');
		}
	}

	//////////// This function delete the rows /////////////
	function removeTerm(id) {
		if(state.cdata.term.length > 2) {
			let newTerm = [];
			let count = 1;
			state.cdata.term.map(function(data,i) {
				if(data.id == id) {
					state.cdata.term.splice(i,1);
				}
			}); 
			state.cdata.term.map(function(data,i) {
					newTerm.push({
						id:"t"+count,
						correct:data.correct,
						text:data.text
					});
				count++;
			});

			state.cdata.term = newTerm;

			let radio_len = document.getElementsByClassName('preview_radio');
			for (let i = 0; i < radio_len; i++) {
				radio_len[i].checked = false;
			}
			//updating the cdata
			reverseXml();
		} else {
			AH.showmsg("You must have at least two rows.");  
		}
	}

	// when delete btn of option is cliked
	function removeOption(id) {
		// checking min no of option 
		if (state.cdata.option.length > 2) {
			let newOption = [];
			let count = 1;
			// removing that particular option
			state.cdata.option.map(function(data,i) {
				if (data.id == id) {
					state.cdata.option.splice(i,1);
				}
			});
			
			state.cdata.option.map(function(data,i) {
				newOption.push({
					id:"o"+count,
					text:data.text
				});
				count++;
			});

			// remove the correct answer
			removeCorrectAns();

			state.cdata.option = newOption;
			// updates the xml
			reverseXml();
		} else {
			AH.alert("You must have at least two columns.");
		}
	}

	// for removing the correct ans
	function removeCorrectAns() {
		state.cdata && (state.cdata.term.map(function(data,i) {
			data.correct = "";
		}));
	}

	// for setting the correct answer
	function setCorrectAns(e) {
		// getting name of the clicked radio btn to find the index
		let rname = e.target.name;
		let rindex = rname - 1;
		// store the value of target in correct key of the term at that index 
		state.cdata.term[rindex].correct = e.target.value;
		reverseXml();
	}


	////// This function is fired then change theme ////////////
	function changeTheme(e) {
		// update the state
        state.theme = e.target.value;
		// update the cdata
		reverseXml(); // Remove setTimeout in this place
	}

	// when there is change in table
	function handleMaxwidth() {
		// getting the value of width
		widthVal = document.querySelector('#customWidth').value;
		// setting the width of the table
	//	jQuery('#test_table').width(widthVal+"px"); // Replaced
	document.getElementById('test_table').style.width = widthVal +'px';

		// check for th timeout if exist clear the timeout to save memory
		(lastAction) ? clearTimeout(lastAction) : "";
		lastAction = setTimeout(function() { 
			// checking condition that the table width must between the 500 and 1000
			
			if (widthVal < 500) {  //// jQuery('#customWidth').val() remove this
                state.maxWidth = 500;
				let timer = setTimeout(function() { reverseXml(); clearTimeout(timer); },100);  //  Fixed
				swal("Width should not be less than 500px");
			}
			if (widthVal > 1000) { //// jQuery('#customWidth').val() remove this
                
                state.maxWidth = 1000;
				let timer = setTimeout(function() { reverseXml(); clearTimeout(timer); },100);  // Fixed
				swal("Width should not be greater than 1000px");
			} 
		},1500);
		// update the state
        state.maxWidth = widthVal;
		// update the cdata
		reverseXml(); 
	}
</script>

<main>
    <div>
        <div id = "authoring" class = "p-2 border">
            <div class = "col-12 col-lg-12 p-0">
                <div class = "form-group row full_day mx-0 pt-2 pb-1 w-100">
				<!-- <label for = "select_themes" class = "mb-0 pl-1 mt-2 mr-2">{l.themes}</label> -->
                    <div class = "float-left mb-1 pr-2 ">
						<label 
							for = "select_themes" 
							class = "mb-0 pl-1 mt-2 mr-2 float-left"
						>
							{l.themes}
						</label>
                        <select on:click = {changeTheme} 
                            value = {state.theme}
                            class = "form-control form-control-md px-2 enroll_date_td width150 float-left"
                            id = "select_themes"
                            name = "select_themes"
						>
							{#each themeOption as theme, i}
								<option value = "theme{++i}">{l[theme]}</option>
							{/each}
                        </select> 
						<label for = "customWidth" class = "mb-0 mt-2 mr-2 ml-2 float-left">{l.table_width}</label>
                        <input 
							class = "form-control form-control-md px-2 width90 float-left" 
							step = "10" 
							min = "500" 
							max = "1000" 
							type = "number" 
							value={parseInt(state.maxWidth)} 
							id = "customWidth" 
							on:keyup = {handleMaxwidth.bind(this)} 
							on:change = {handleMaxwidth.bind(this)} 
						/>
                        <span class ='d-inline-block mt-sm pt-sm ml-1 width20 float-left'>px</span>
                    </div>
                </div>
                <div class = "table-responsive mt-4 d-flex align-items-center">
                    <table class = "table table-bordered relative w-75 ml-0 mt-0" id = "my_table">
                        <thead>
                            <tr class = "table-head">
                                <th 
									class = "topic_input text-center" 
									id = "hello" 
									style = "background-color:{((state.theme == 'theme1') ? "#5B9BD5": ((state.theme == 'theme2') ? "#3B67BC": ((state.theme == 'theme3') ? "#F6C3A2": ((state.theme == 'theme4') ? "#70AD47": "#745998"))))}"
								>
                                    <textarea
                                        on:change = {updateStem} 
                                        value = {state.stem}
                                        class = "form-control form-control-md px-2 min_height_38 text-dark"
                                        style = {'outline:none;'}
                                        cols="15"
                                        rows="1"
                                    />	
                                </th>
                                {#if state.cdata}
                                    {#each state.cdata.option as data,i}
                                        <th
                                            key = {i} 
                                            class = {"middle_align text-center " + data.id} 
											style = "background-color: {((state.theme == 'theme1') ? "#5B9BD5": ((state.theme == 'theme2') ? "#3B67BC": ((state.theme == 'theme3') ? "#F6C3A2": ((state.theme == 'theme4') ? "#70AD47": "#745998"))))}"
                                        >
                                            <div class = "float-left">
                                                <textarea 
                                                    id = {data.id}
                                                    on:change = {updateOptionValue} 
                                                    value = {data.text}
                                                    class = "form-control form-control-md px-2 min_height_38 text-dark"
                                                    cols ="10"
                                                    rows ="1"
                                                />
                                            </div>
                                            <div 
                                                class = "float-left pointer pt-1 ml-2 delete_column height35 top1 position-relative"
                                                on:click = {removeOption.bind(this,data.id)}
												tab-index = "0"
                                            >
                                                <span class = {icon_class}></span>
                                            </div>
                                        </th>
                                    {/each}
                                {/if}
                            </tr>
                        </thead>
                        <tbody>
                            {#if state.cdata}
                                {#each state.cdata.term as data,i}
                                    <tr key={i}>
                                        <td  class = {"min_width_200 h-auto " + data.id} style = "font-weight: bold; background-color:{(((i % 2) == 0)?((state.theme == 'theme1') ? "#DEEAF6": ((state.theme == 'theme2') ? "#D4DEF1": ((state.theme == 'theme3') ? "#FAE0CF": ((state.theme == 'theme4') ? "#E2EFD9": "#E1DAE9")))): "#FFF")}">
                                            <textarea 
                                                id = {data.id}  
                                                on:input = {updateTermValue} 
                                                value = {data.text}
                                                class = "form-control form-control-md width96 float-left min_height_38" style = "outline: none;height: 38px;"
                                                
                                            />
                                            <div 
                                                class = "pointer pt-1 mt-sm2 ml-2 delete_row height34" 
                                                on:click = {removeTerm.bind(this,data.id)}
                                                tab-index = "0"
                                            >
                                                <span class = {icon_class}></span>
                                            </div>
                                        </td>
                                        {#each state.cdata.option as data2,j}
												<td class = "text-center align-middle h-auto min_width_125 max_width_150" key={j}
												style = "background-color:{(((i % 2) == 0)?((state.theme == 'theme1') ? "#DEEAF6": ((state.theme == 'theme2') ? "#D4DEF1": ((state.theme == 'theme3') ? "#FAE0CF": ((state.theme == 'theme4') ? "#E2EFD9": "#E1DAE9")))): "#FFF")}"
												>
                                                    <label class = "label_choice pointer d-block w-100 mb-0" for={'a'+(i)+(j)}>
                                                        <input 
                                                            type = "radio" 
                                                            class = "preview_radio align-middle" 
                                                            value = {data2.id}  
                                                            name = {i+1} 
                                                            id = {'a'+(i)+(j)}
                                                            on:click = {setCorrectAns}
                                                            data-correct = {data.correct}
                                                        />
                                                    </label>
                                                </td>
                                        {/each}
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
                <small class = "text-danger font13"><strong>* {l.note_label}</strong> {l.comment_choiceMatrix}</small>
                <div class = "text-center" style = {'width:80%;'}>
                        <button 
                            type = "button" 
                            class = "btn btn-outline-primary btn-sm add_stem pr-md ml-2 px-2" 
                            id = "btn" 
							on:click = {addStem}
							style = {'width: 171px;'}
                        >
                            {l.add_row}
						</button>

						<button  
						type = "button" 
						class = "btn btn-outline-primary btn-sm add_option pr-md ml-2 px-2" 
						id = "btn_opt" 
						on:click = {addOption}
						style = {'width: 171px;'}
					>
						{l.add_column}
					</button>
						
                   
                </div>
            </div>   
        </div>
    </div>
</main>
<style>

.fa-check {
	color: #46A546;
}

.fa-close {
	color: #A80000;
}

.fa-close,
.fa-check {
	margin-left: 9px;
	font-size: 18px;
}

.fa-close,
.fa-check,
.middle_align {
	vertical-align: middle!important;
}

.middle_align {
	width: 164px;
	min-width: 164px;
}

.topic_input {
	min-width: 257px;
}

.preview_header {
	font-size: 16pt;
	font-weight: bold;
	vertical-align: middle;
}

.adjust_width {
    width: 12%;
    text-align: center;
}

.width180 {
	width: 180px;
}

.width150 {
	width: 150px;
}

.full_day {
	background-color: #eee !important;
	color: #000 !important;
}


.width90  {
	width: 90px;
}

.width20 {
	width: 20px;
}

.relative { 
	position: relative;
}

.min_height_38 {
	min-height: 38px;
}

.min_width_200  {
	min-width: 200px !important;
}

.min_width_125  {
	min-width: 125px;
}

.max_width_150 {  
	max-width: 150px !important;
}

.height34  {
	height: 34px !important;
}

.width96 {
	width: 96%;
}



</style>