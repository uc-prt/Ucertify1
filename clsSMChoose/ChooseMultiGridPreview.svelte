<!--
 *  File Name   : ChooseMultiGridPreview.svelte
 *  Description : Container for defining multigrid question Preview Module
 *  Author      : Rashmi Kumari
 *  Package     : pe-items
 *  Last update : 19-Jan-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
	import { onMount, afterUpdate } from "svelte";
	import l from '../src/libs/editorLib/language';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import Sortable from 'sortablejs-swap';
    import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
    export let xml;
    export let uxml;
    export let showAns;
    export let isReview;
    export let editorState;
    let targetView      = "none";
    let showcorrectanswer, box_width, corr_ans_count;
    let preview_data = { 
        layout : [],
        maxRow : 0,
        maxCol : 0,
        localCData : [],
        layoutchanged : [],
        original_xml_copy:'',		
        countrow : 0,
        countcol : 0,
        totalheading : 0,
        correctxmlarray : [],
        user_ans_xml: [],
        main_user_xml1 : [],
        isShuffeled : false,
        imagepath : "//s3.amazonaws.com/jigyaasa_content_static/",
        result:'correct'
    };
    let state = {
        snackback:false,
        xml: "",
        headingCorrect: "",		
        static: false,
        isdragging: false,			
        colstobeshown: 3,
        isanyheading: false,
        showlabelofshuffle:'block'			
    }

    $: {
        if (isReview) {
            targetView = "block";
            setReview();
		} else {
            targetView = "none";
        }
    }

    $: {
        if (xml != state.xml) {	
			preview_data.isShuffeled = false;		
			state.showlabelofshuffle = 'block';
			if (preview_data.main_user_xml1.length > 0) {
				preview_data.main_user_xml1.length = 0;
			}			
            state.isanyheading = false;
			if (uxml) {
				let counter = 1, tempxml = XMLToJSON(xml);
				preview_data.main_user_xml1 = uxml;	
				if (tempxml.smxml.list._whichfixed == "horizontal") {
					for (let i in preview_data.main_user_xml1) {
						preview_data.main_user_xml1[i].gid = "g"+(parseInt(preview_data.main_user_xml1[i].x)+1);
						(tempxml.smxml.list._col == counter ? counter = 1 : counter++)
					}
				}		
			}
            // update the value of state 'xml'
            state.xml = xml;
            // updates the value of sliders elements and load the module
            loadModule(xml);
            box_width = ((638 - preview_data.countcol * 2) / preview_data.countcol) + 'px';
		}
    }

    onMount(() => {
        loadModule(xml);
        try {
			if (uxml == '<smans type="6"></smans>') {
				uxml = '';
			}
		} catch(error) {
			console.warn({'error': error});
		}
		
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
    });

    afterUpdate(()=> {
        let el = AH.select("#sortable");
        // for sorting
        let sortable = new Sortable(el, {
            animation: 150,
            swap: true,
            swapClass: 'bg-light',
            onUpdate: function () {
                preview_data.user_ans_xml = [];
                AH.selectAll('#sortable li').forEach((value, i) => {
                    value.id = 'p'+i;
                    value.setAttribute('data-optid', i);
                    value.setAttribute('name', i);
                    preview_data.user_ans_xml = [
                        ...preview_data.user_ans_xml, {
                            id: i,
                            value: AH.select("#"+ value.getAttribute('id')).innerText != '' ? AH.select("#"+ value.getAttribute('id')).innerText : AH.find("#"+ value.getAttribute('id'), 'img').getAttribute('img_val')
                        }
                    ]
                }) ;
            },
        });
        // resets the localCData
        preview_data.localCData.forEach((val) => {
            val.iscorrect = '';
            corr_ans_count = 0;
        });
        // updates value of iscorrect in the localCData
        preview_data.localCData.forEach((val, i) => {
            if(val.ischecked == true) {
                val.iscorrect = true;
            }
            preview_data.localCData.forEach((valu) => {
                if (preview_data.correctxmlarray[i].value == preview_data.user_ans_xml[i].value && valu.value == preview_data.correctxmlarray[i].value) {
                    valu.iscorrect = true;
                }
            });
        });
        preview_data.localCData.forEach((val) => {
            if (val.iscorrect != true) {
                val.iscorrect = false;
                corr_ans_count++;
            }
        });
    })

    // updates the value of sliders elements and load the module
    function loadModule(loadXml) {	
		loadXml = XMLToJSON(loadXml);
        state.headingCorrect = loadXml.smxml.list._headingCorrect;
        preview_data.maxRow = parseInt(loadXml.smxml.list._row);
		preview_data.maxCol = parseInt(loadXml.smxml.list._col);
        parseXMLPreview(loadXml);
    }

    // parses the xml and updates the values of sliders elements
    function parseXMLPreview(MYXML) {
        let cdata = MYXML.smxml.list.__cdata.split("\n");
        for (let i in cdata) {
            if (cdata[i].trim() != "") {
                if (cdata[i].trim().charAt(0) == "!") {
                    state.isanyheading = true;
                }
            }
        }
        preview_data.localCData = [];
        preview_data.correctxmlarray = [];
        preview_data.totalheading = MYXML.smxml.list._col;
        preview_data.countcol = MYXML.smxml.list._col;
        preview_data.countrow = MYXML.smxml.list._row;
        for (let i in cdata) {
            if (cdata[i].trim() != "") {							
                state.colstobeshown = parseInt(preview_data.countcol);
                datatopush(cdata[i].trim(),i);			
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
                    datatopush(cdata[i].trim(),i);
                }
            }
        }		
        storeCorrectXYValue(preview_data.correctxmlarray);
        storeCorrectXYValue(preview_data.localCData);
        shuffle();
        preview_data.user_ans_xml = [];
        preview_data.localCData.forEach((val, i) => {
            preview_data.user_ans_xml.push({
                id: i,
                value: val.value
            });
        });
    }

    // add values in the array
    function datatopush(value,index) {
		preview_data.localCData.push({
			value: value.trim(),
			colval: "",
			rowval: "",
			mainseq: "",
			x:0,
			y:0,
			id:index		
		});
		preview_data.correctxmlarray.push({
			value:value.trim(),
			colval:"",
			rowval:"",
			mainseq:"",
			x:"",
			y:"",
			id:index,
		});			
    }	

    //store correct XY value
    function storeCorrectXYValue(layout) {
		let temporary = 0,
			counter = 0;	
		for (let i = 0; i < layout.length; i++) {
			if (temporary == preview_data.countcol) {
				temporary = 0;
				counter = counter + 3;									
			}
			layout[i].x = temporary;
			layout[i].y = counter;									
			temporary++;	
		}
    }

    //to make shuffle array
    function makeshuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

    //for shuffleing
	function shuffle() {
		preview_data.isShuffeled = true;
		preview_data.localCData = shuffleArray(preview_data.localCData);
		storeCorrectXYValue(preview_data.localCData);		
		state.showlabelofshuffle = 'none';
    }
    
    //shuffling
    function shuffleArray(array) {
		let arraytoshuffle = [];
		if (state.isanyheading == true) {	
			for (let i = 0; i < array.length; i++) {
				if (array[i].value.charAt(0) != "!") {
					arraytoshuffle.push(array[i]);
                    array[i].ischecked = false;
				} else {
                    array[i].ischecked = true;
                }
			};
			arraytoshuffle = makeshuffle(arraytoshuffle);		
			let j = 0;		
			for (let i = 0; i < array.length; i++) {			
				if (array[i].value.charAt(0) != "!") {
					array[i] = arraytoshuffle[j];
					j++;
				}		
			}
		} else {
			array = makeshuffle(array);		
		}		        
		array = storeIndexValue(array);
		return array;
    } 

    //to store value of index
    function storeIndexValue(array) {
		let k = 1,
			j = 1,
			count = 1;
		for (let i = 0; i < array.length; i++) {
            array[i].colval = j;
            preview_data.correctxmlarray[i].colval = j;
            array[i].rowval = k;
            preview_data.correctxmlarray[i].rowval = k;
            array[i].mainseq = k+"-"+j;
            preview_data.correctxmlarray[i].mainseq = k+"-"+j;
			j++;			
            if (array[i].value.charAt(0) != "!") {
                preview_data.correctxmlarray[i].ischecked = false;
            } else {
                preview_data.correctxmlarray[i].ischecked = true;
            }
			if (count == preview_data.totalheading) {				
				j = 1;
				k++;
				count = 0;						
			}
			count++;		
		}		
		return array;
    }

    // checks and show the answer, shows correct answer and your answer button and not allow the user to perform the task
    function setReview() {
        targetView = "block";
        state.snackback = true;
        state.static = true;
        showcorrectanswer = true;
        displayAns();
    }

    // allow the user to perform the task and hides correct answer and your answer button
    function unsetReview() {
        targetView = "none";
        state.snackback = false;
        state.static = false;
    }
    
    function handleReviewMode(mode) {
        if (mode == 'c') {
            showcorrectanswer = false;
        } else if (mode == 'u') {
            showcorrectanswer = true;
        }
    }

    function checkAns() {
        // used for switch on next question in prepengine if current question is attempted
        ISSPECIALMODULEUSERXMLCHANGE = 1;
        let result;
        if (corr_ans_count > 0 ) {
            result = 'Incorrect';
        } else {
            result = 'Correct';
        }
        return result;
    }

    // display the correct or incorrect according to the answer matched
    function displayAns() {
        // contains correct or incorrect according to the return value of checkAns method
        let ans = checkAns();
        if (editorState) {
            // shows the answer correct or incorrect according to the value of variable 'ans'
            showAns(ans);
        }
    }

    //for keyboard navigation
    function hotkeysAda(event) {
        if (event.which === 13) {
            let _id = event.target.id;
            if (this.classList.contains('copied')) {
                AH.selectAll('#'+_id, 'removeClass', 'copied');
            } else {
                if ( AH.selectAll("#chid .copied").length < 1) {
                    AH.selectAll('#'+_id, 'addClass', 'copied');
                    state.copied = AH.select("#chid .copied");
                }
                exchangeValue(state.copied, AH.select('#'+_id));
            }
        }
    }
    
    // function to update shuffing in case of keyboard navigation
    function exchangeValue (selected_opt, removeclass) {
		if (removeclass != undefined) {
			if (selected_opt.getAttribute("id") != removeclass.getAttribute("id")) {
                AH.selectAll('.copied', 'removeClass', 'copied');
                preview_data.main_user_xml1 = [];
                let idofselectedopt = selected_opt.getAttribute("data-optid"),
					idofremoveddiv = removeclass.getAttribute("data-optid");	
                [preview_data.user_ans_xml[idofselectedopt].value, preview_data.user_ans_xml[idofremoveddiv].value] = [preview_data.user_ans_xml[idofremoveddiv].value, preview_data.user_ans_xml[idofselectedopt].value];
                let aHolder = document.createElement("div");
                let bHolder = document.createElement("div");

                AH.select('#sortable').replaceChild(aHolder, AH.select(selected_opt));
                AH.select('#sortable').replaceChild(bHolder,AH.select(removeclass));

                AH.select('#sortable').replaceChild(AH.select(removeclass),aHolder);
                AH.select('#sortable').replaceChild(AH.select(selected_opt),bHolder);
                
                if(window.inNative) {
					window.getHeight && window.getHeight();
				}
			}
		}
	}
</script>

<link
  onload="this.rel='stylesheet'"
  rel="preload"
  as="style"
  href={editor.baseUrlTheme + "pe-items/clsSMChoose/css/ChooseMultiGrid.min.css"}
/>
<div id="chid">
  <ItemHelper
    on:setReview={setReview}
    on:unsetReview={unsetReview}
    reviewMode={isReview}
    handleReviewClick={handleReviewMode}
  />
  <div id="choose" class="text-center mx-auto">
    <div class="choose_header font17 text-left rounded-top m-0">
      {state.headingCorrect}
    </div>
    <div class="choose_body bg-white">
      <ul
        id="sortable"
        data-row={preview_data.maxRow}
        data-col={preview_data.maxCol}
        class="p-2 d-inline-block w-100 m-0"
      >
        {#if showcorrectanswer == false}
          {#each preview_data.correctxmlarray as value, i}
            <li
              tabindex={value.ischecked == true ? '-1' : '0'}
              id={'p'+i}
              name={i}
              key={'p'+i}
              data-optid={i}
              data-ischecked={value.ischecked}
              class="matchlist_item pe-none {value.ischecked == true ? 'bg-primary text-white' : ''} align-items-center justify-content-center d-flex position-relative ui-draggable m-0"
              style="width: {box_width}"
            >
              {#if value.value.charAt(0) == "!"}
                {#if value.value.charAt(1) == "*"}
                  <img
                    style="height: 70px; width: 100%; object-fit: contain;"
                    class="px-2"
                    src="//s3.amazonaws.com/jigyaasa_content_static/{value.value.split('!')[1].split("##")[0].slice(1)}"
                    alt={(value.value.split("##")[1]) ? value.value.split("##")[1] :null}
                  />
                {:else}
                  {value.value.slice(1)}
                {/if}
              {:else if value.value.charAt(0) == "*"}
                <img
                  style="height: 70px; width: 100%; object-fit: contain;"
                  class="px-2"
                  src="//s3.amazonaws.com/jigyaasa_content_static/{value.value.split("##")[0].slice(1)}"
                  alt={(value.value.split("##")[1]) ? value.value.split("##")[1] :null}
                />
              {:else}
                {value.value}
              {/if}
            </li>
          {/each}
        {/if}
        {#each preview_data.localCData as value, i}
          <li
            tabindex={value.ischecked == true ? '-1' : '0'}
            id={'p'+i}
            name={i}
            key={'p'+i}
            data-optid={i}
            data-ischecked={value.ischecked}
            on:keydown={hotkeysAda}
            class="matchlist_item {showcorrectanswer == false ? 'd-none' : 'd-flex'} {isReview ? 'isreviewbgcolor pe-none' : ''} {value.ischecked == true ? 'bg-primary text-white pe-none' : ''} align-items-center justify-content-center position-relative ui-draggable m-0"
            style="width: {box_width}"
          >
            {#if targetView == 'block' && showcorrectanswer == true && value.ischecked == false}
              {#if value.iscorrect == true}
                <span
                  class="icomoon-new-24px-checkmark-circle-1 s4 text-success position-absolute userans_status"
                />
              {:else}
                <span
                  class="icomoon-new-24px-cancel-circle-1 s4 text-danger position-absolute userans_status"
                />
              {/if}
            {/if}
            {#if value.value.charAt(0) == "!"}
              {#if value.value.charAt(1) == "*"}
                <img
                  img_val={value.value}
                  style="height: 70px; width: 100%; object-fit: contain;"
                  class="px-2"
                  src="//s3.amazonaws.com/jigyaasa_content_static/{value.value.split('!')[1].split("##")[0].slice(1)}"
                  alt={(value.value.split("##")[1]) ? value.value.split("##")[1] :null}
                />
              {:else}
                {value.value.slice(1)}
              {/if}
            {:else if value.value.charAt(0) == "*"}
              <img
                img_val={value.value}
                style="height: 70px; width: 100%; object-fit: contain;"
                class="px-2"
                src="//s3.amazonaws.com/jigyaasa_content_static/{value.value.split("##")[0].slice(1)}"
                alt={(value.value.split("##")[1]) ? value.value.split("##")[1] :null}
              />
            {:else}
              {value.value}
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    <div
      class="choose_bottom font12 m-0 text-left font-weight-bold text-danger p-2 rounded-bottom"
      id="instruction"
    >
      {l.drag_drop_set_seq_msg}
    </div>
  </div>
</div>
