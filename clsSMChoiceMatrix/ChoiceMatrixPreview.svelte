<!--
 *   File Name   : ChoiceMatrixPreview.svelte
 *   Description : Choice Matrix module
 *   Author      : Sundaram Tripathi (uc-sdt)
 *   Package     : svelte_items
 *   Last update : 05-May-2021
 *   Last Update By : Pradeep Yadav
 -->
 <script>
    import lib from './parseCSV.js'; 
    import { onMount,beforeUpdate,afterUpdate } from "svelte";
    import {AH,XMLToJSON, onUserAnsChange } from "../helper/HelperAI.svelte";
    import { writable } from "svelte/store";
    import ItemHelper from '../helper/ItemHelper.svelte';
    export let showAns;
    export let editorState;
    export let xml; 
    export let uxml;
    export let isReview;
    let useransNew;

    let cm = { cdata:"" };
    let isIE;
    let mainId = ""; 
    let state = {};
    let ansDisable = 0;
    let stateData = writable({
        cdata: "",
        stem: "",
        xml: "",
        theme:"",
        font:"",
        maxWidth:"",
        totalcorrectans:"" 
    })
    let theme_color = {
		theme1: '#5B9BD5',
		theme2: '#3B67BC',
		theme3: '#F6C3A2',
		theme4: '#70AD47',
		theme5: '#745998'
	}
	let theme_color_terms = {
		theme1: '#DEEAF6',
		theme2: '#D4DEF1',
		theme3: '#FAE0CF',
		theme4: '#E2EFD9',
		theme5: '#E1DAE9',
	}
    const unsubscribe = stateData.subscribe((items) => { 
        state = items;
    })

    $: 
    {
        if (isReview) {
            // this condition will true in test area
            modeOn();
            if(editorState && ansDisable == 0) {
                ansDisable = 1;
                displayAnswer();
            }                                   
        } else {
            ansDisable = 0;
            previewUserAns();
            modeOff();
        }
    }
    
    
    ///////  XML change then automatically reload code ///////////////
    beforeUpdate(()=> {
        if (xml != state.xml) {
            state.xml = xml ;
            loadModule(xml, uxml);
        }

        
    });  

    // function for checking the focus
/*    function checkFocus(list){
        let is_focus = false;
        jQuery(".choiceMatrixRender").find("."+list).each(function() {
            if(jQuery(this).is(":focus")) {
                is_focus = true;
                return false;
            }
        });
        return is_focus;
    }  */

    afterUpdate(()=> {
        if(!isReview) hideCorIncorIcon();
    })
    
    onMount(()=> {
        // Check the radio when press the Enter Key ADA
        AI.listen('body', 'keydown','.label_choice', function(_this,e) {
            if(e.which === 13) {
                _this.click();
            }
        });
    });

    function setReview() {
        modeOn();
    }

    function unSetReview() {
        previewUserAns();
        modeOff();
    }

    /////////////// Loding the xml and uaXML ///////////////////
    function loadModule(loadXml,uaXML) {
        loadXml = XMLToJSON(loadXml);
        parseXMLPreview(loadXml,uaXML);
    }

    ///////// FUnction parsing the xml ////////////////////////
    function parseXMLPreview(MYXML,uaXML) {
        // setting state of theme, font, maxwidth
        state.theme=MYXML.smxml._theme;
        state.font=MYXML.smxml._font;
        state.maxWidth = ((MYXML.smxml._maxwidth)?MYXML.smxml._maxwidth: 800 );
        

        let formattedData = lib.parseCSVFormat(MYXML.smxml.__cdata);
        let cdata = formattedData;
        let rawData = [];

        // copy cdata into rawData////// 

        /* jQuery.map(cdata, function (value, index) {
            rawData[index] = value;
        });   Replaced     */

        rawData = JSON.parse(JSON.stringify(cdata));


        
        state.cdata = rawData; 
        state.stem = rawData.stem;
        cm.cdata = rawData;
        let len = cm.cdata.term.length;
        state.totalcorrectans = len ;
        modeOff();
        
        // User anser checking/////////
        if (uaXML) {
            try {
                // parsing the json data
                uaXML = JSON.parse(uaXML);
                let rawUaXML = [];
                // storing uaXML in rawUaXML and storing its value
            /*    jQuery.map(uaXML, function (value, index) {
                    rawUaXML[index] = value;
                }); replaced   */

                rawUaXML = JSON.parse(JSON.stringify(uaXML));
                
                
                //    setting the data-userans on the basis of ans
                setTimeout(function(){
                    rawUaXML.ans.map(function(data,i) {
                        //alert("#"+data.userAns);
                        //jQuery(".test_area").find("#"+data.userAns).attr("data-userans",data.userAns);
                        AH.selectAll(".test_area"+" #"+data.userAns,'attr',{"data-userans":data.userAns})
                    });
                    previewUserAns();
                },100)

                    // for showing the userans , that is the answer which is marked by the user
                    
                
            } catch (e) {
                //uaXML = "";
            }
        } else {
            // if is not user ans then unchecked all the radio btn
           
                let test_radio_len = document.getElementsByClassName('test_radio');
                for(let i = 0; i < test_radio_len.length; i++) {
                    test_radio_len[i].checked = false;
                    test_radio_len[i].setAttribute('data-userans',"");           
                }
            }
    }

    ///////////  Storing the user answer whenever clicked////////////////
    function setUserAns(e) {
        let id = e.target.id;
        let name = e.target.name;
        // set the user ans blank
    //    jQuery(mainId+" .test_area input[name=" + name + "]").attr("data-userans", ""); Replaced

        let test_area_input = document.querySelectorAll(mainId+" .test_area input[name=" + name + "]");
        for (let i = 0; i < test_area_input.length; i++ ) {
            test_area_input[i].setAttribute("data-userans","");
        }
    



        // setting the data-userans on which user is clicked
        AH.selectAll(mainId+" .test_area" + " #" + id + "",'attr',{"data-userans":id});
       
        let userans = { "type": "34", "ans": [] };

        /////////// updating the user ans /////////////////////////
        
        let test_radio = document.getElementsByClassName('test_radio');
        for(let i = 0; i<test_radio.length; i++ ) {
            if (test_radio[i].checked == true) {
                userans.ans.push({
                    id: test_radio[i].getAttribute("data-termid"),
                    userAns: test_radio[i].getAttribute("id")
                })
            }
        }  
    
        // for autograding
        
        // updaing the value in the textarea 

        
        //AH('special_module_user_xml').value = JSON.stringify(userans);

        useransNew = JSON.stringify(userans);

        displayAnswer();  
    }

    ///////////////////////// This function display answer wether the function is correct or incorrect///////////////////
    function displayAnswer() {
        // check the ans
        let ans = checkAns();
        // mark the answer correct or incorrect x
        ans = (ans == 1) ? true : false;
        if (uxml)  {
            AH.select("#answer").checked = ans; 
        } else {
            if (editorState) showAns((ans) ? "Correct" : "Incorrect");
        }
        onUserAnsChange({uXml: useransNew, ans: ans})
    } 

    // function check the answer
    function checkAns() {
        let is_correct = 0;
        let temp = 0;  
        let test_radio_ans = document.getElementsByClassName('test_radio');
        for (let i =0; i < test_radio_ans.length; i++) {
            if (test_radio_ans[i].getAttribute('value') == test_radio_ans[i].getAttribute('data-correct')) {
                if (test_radio_ans[i].checked == true) {
                    test_radio_ans[i].setAttribute('as',1);
                    is_correct = 1;
                } else {
                    is_correct = 0;
                    test_radio_ans[i].setAttribute('as',0);
                    return false;
                }
            }
        }

        // for calculating the point
        for (let i = 0; i < test_radio_ans.length; i++) {
            if (test_radio_ans[i].getAttribute('value') == test_radio_ans[i].getAttribute('data-correct')) {
                if (test_radio_ans[i].checked == true) {
                    temp++;
                }
            }
            if (typeof calculatePoint != "undefined") {
                calculatePoint(state.totalcorrectans, temp);
            }
        }
        return is_correct;
    }

    // for user aswer tab
    function yourAnswer() {
        previewUserAns();
        // for showing the correct/incorrect icon
        showCorIncorIcon();
    }

    /////////  Preview the user answer ///////////////
    function previewUserAns() {
        let test_radio_len = document.getElementsByClassName('test_radio');
        for (let i=0; i < test_radio_len.length; i++) {
            if(test_radio_len[i].getAttribute('id')==test_radio_len[i].getAttribute('data-userans')) {
                test_radio_len[i].checked = true;
            } else {
                test_radio_len[i].checked = false;
            }
        }
    }

    // correct answer tab
    function correctAnswer() {
        previewCorrectAns();
        // for showing the correct/incorrect icon
        hideCorIncorIcon();
    }

    // for showing correct answer
    function previewCorrectAns() {

        let test_radio = document.querySelectorAll((mainId+" .test_radio"));
        for( let i = 0; i < test_radio.length; i++ ) {
            if(test_radio[i].getAttribute('value') == test_radio[i].getAttribute('data-correct')) {
                test_radio[i].checked = true;
            } else {
                test_radio[i].checked = false;
            }
        }
        
    }

    /////// This function setReview mode ////////////// 
    function modeOn() {
        isReview = true;	
        let test_radio = AH.selectAll(mainId + " .test_radio");
        for (let i = 0; i < test_radio.length; i++) {
            test_radio[i].disabled = true;
        }
        yourAnswer();
    }

    /////// This function unsetReview mode //////////////  
    function modeOff() {
        isReview = false;
        let testRadios = document.getElementsByClassName('test_radio');
        for (let i = 0; i < testRadios.length; i++) {
            testRadios[i].disabled = false;
        }
    
        hideCorIncorIcon();  

        // AH.select(".dbg-success input","checked").forEach((_elm)=>{
        //     AH.siblings(_elm,".label_choice").forEach((_e)=>{
        //         _e.setAttribute("title","")                    
        //     })
        // }); Fix
        

        // AH.select(".dbg-danger input:checked").forEach((_elm)=>{
        //     AH.siblings(_elm,".label_choice").forEach((_e)=>{
        //         _e.setAttribute("title","")                    
        //     })
        // }); Fix
    }

    // This function showing correct or incorrect icon////////////////
    function showCorIncorIcon() {     
        AH.select(".dbg-success input", "checked").forEach((_elm)=>{
            AH.siblings(_elm,'.fa-check').forEach((_e)=>{
                _e.style.display = "inline-flex";
            });
        })
        
        
        

        AH.select(".dbg-danger input", "checked").forEach((_elm)=>{
            AH.siblings(_elm,'.fa-close').forEach((_e)=>{
                _e.style.display = "inline-flex";
            });
        })


        AH.selectAll('.dbg-success input, .dbg-danger input', 'removeAttr', 'as');
        
       
        AH.select(".dbg-success input", "checked").forEach((_succRem)=> {
            _succRem.setAttribute("as", 1);
        })

        //jQuery(".dbg-danger input:checked").attr("as", 0); // Removed
        
        AH.select(".dbg-success input", "checked").forEach((_dangRem)=> {
            _dangRem.setAttribute("as", 0);
        })

         
        AH.select(".dbg-success input","checked").forEach((_elm)=> {
            AH.siblings(_elm,'.label_choice').forEach((_e)=> {
                _e.setAttribute("title","is marked as correct");
            });
        })

        //jQuery(".dbg-danger input:checked").siblings(".label_choice").attr("title", "is marked as incorrect");
        AH.select(".dbg-danger input","checked").forEach((_elm)=>{
            AH.siblings(_elm,'.label_choice').forEach((_e)=>{
                _e.setAttribute("title","is marked as incorrect");
            });
        })
    }

    /////// Hiding correct or incorrect answer ////////////////
    function hideCorIncorIcon() {
        
        let hide_icon_length =  document.getElementsByClassName('fa-check');
        let hide_icon_length1 = document.getElementsByClassName('fa-close');
        for (let i=0; i<hide_icon_length.length; i++) {
            hide_icon_length[i].style.display = 'none';
            hide_icon_length1[i].style.display = 'none';
        }
    }

    // for setting the icon style
    function setIconStyle(ie) {
        if (ie == true) {
            return({
                paddingLeft: '14px',
                display: 'inline-flex',
                position: 'absolute'
            });
        } else {
            return({
                paddingLeft:"15px",
                display: 'none',
                position: 'absolute'
            }); 
        }
    }
    
    //To handle review toggle
	function handleReview(mode, event) {
		if (mode == 'c') {
			correctAnswer(event)
		} else {
			yourAnswer(event);
		}
	}
</script>
<main>
    <div id = "choicemain" style = {'margin-bottom:20px'}>
        <ItemHelper
            on:setReview = {setReview}
            on:unsetReview = {unSetReview}
            handleReviewClick={handleReview}
            reviewMode={isReview}
        />
        <center>
            <table class = {"table testmode_table "} id="test_table" style="{'position:relative; margin-top:20px;width:'+state.maxWidth+"px"};font-family: Georgia;">
                <thead>
                    <tr class = "table-head">
                        
                        <th
                            class = {(((theme_color[state.theme]) == '#5B9BD5') ? 'theme_color_theme1' : ((theme_color[state.theme]) == '#3B67BC') ? 'theme_color_theme2': ((theme_color[state.theme]) == '#F6C3A2') ?  'theme_color_theme3' : ((theme_color[state.theme]) == '#70AD47') ? 'theme_color_theme4' : ((theme_color[state.theme]) == '#745998') ? 'theme_color_theme5' : '' ) + " preview_header " + ((state.theme !== "theme3") ? "text-center text-white" : "text-center") }
                            tabindex = {0}
                            
                            
                        >
                        {state.stem.replace(/\n/gm, "</br>").replace(/#cm/gm,",")}</th>
                        {#if state.cdata}
                            {#each state.cdata.option as data, i} 
                                <th
                                    key = {i}
                                    class = {(((theme_color[state.theme]) == '#5B9BD5') ? 'theme_color_theme1' : ((theme_color[state.theme]) == '#3B67BC') ? 'theme_color_theme2': ((theme_color[state.theme]) == '#F6C3A2') ?  'theme_color_theme3' : ((theme_color[state.theme]) == '#70AD47') ? 'theme_color_theme4' : ((theme_color[state.theme]) == '#745998') ? 'theme_color_theme5' : '' ) + " preview_header adjust_width " + ((state.theme !== "theme3") ? data.id + "text-center text-white" : data.id + "text-center")}
                                    tabindex = {0}
                                    
                                >{data.text.replace(/\n/gm, "</br>").replace(/#cm/gm,",")}</th>
                            {/each}
                        {/if}
                    </tr> 
                </thead>
                <tbody>
                    {#if cm.cdata}
                        {#each cm.cdata.term as data,i} 
                            <tr key = {i}>
                                <td
                                    class = { (((i % 2)==0) ? (((theme_color_terms[state.theme]) == '#DEEAF6') ? 'theme_color_terms_theme1' : ((theme_color_terms[state.theme]) == '#D4DEF1') ? 'theme_color_terms_theme2': ((theme_color_terms[state.theme]) == '#FAE0CF') ?  'theme_color_terms_theme3' : ((theme_color_terms[state.theme]) == '#E2EFD9') ? 'theme_color_terms_theme4' : ((theme_color_terms[state.theme]) == '#E1DAE9') ? 'theme_color_terms_theme5' : '#FFF' )  : '#FFF' )  +" "+  data.id +" position-relative"}
                                    tabindex = {0}
                                    style = "font-size:14pt;vertical-align:middle;font-family:{state.font}"
                                >
                                {data.text.replace(/\n/gm, "</br>").replace(/#cm/gm,",")}</td>
                                
                                {#each cm.cdata.option as data2, j} 
                                <td
                                    key = {j}
                                    id = {'tb' + (i) + (j)}
                                    
                                    class = {  (((i % 2)==0) ? (((theme_color_terms[state.theme]) == '#DEEAF6') ? 'theme_color_terms_theme1' : ((theme_color_terms[state.theme]) == '#D4DEF1') ? 'theme_color_terms_theme2': ((theme_color_terms[state.theme]) == '#FAE0CF') ?  'theme_color_terms_theme3' : ((theme_color_terms[state.theme]) == '#E2EFD9') ? 'theme_color_terms_theme4' : ((theme_color_terms[state.theme]) == '#E1DAE9') ? 'theme_color_terms_theme5' : '#FFF' )  : '#FFF' )  + " "+"text-center test_area"  + ((data2.id == data.correct) ? 'dbg-success' : 'dbg-danger') +' position-relative'} 
                                    
                                >
                                    <i
                                        class = "fa fa-check"
                                        aria-hidden = "true"
                                        style = {setIconStyle(isIE)}
                                    ></i>  
                                    <i
                                        class = "fa fa-close"
                                        aria-hidden = "true"
                                        style = {setIconStyle(isIE)}
                                    ></i>
                                    <input
                                        type = "radio"
                                        class = "test_radio CMRad"
                                        style = {'vertical-align:middle;'}
                                        value = {data2.id}
                                        name = {"tm" + (i + 1)}
                                        id = {'t' + (i) + (j)}
                                        data-termid = {data.id}
                                        data-correct = {data.correct}
                                        data-userans = ""
                                        on:click = {setUserAns}
                                        data-role = "none"
                                        tabindex = {-1}
                                    />
                                    <label 
                                        tabindex = {0} 
                                        class = "label_choice customRadCM {((j % 2 == 0) ? 'tureitemColorCM' : 'falseitemColorCM')}" 
                                        for={'t' + (i) + (j)}
                                    >
                                    </label>
                                </td>
                                {/each}
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </center>               
    </div>
</main>
    
<style>
    :global(.fa-check) {
        color: #46A546;
        position:relative;
        left:50px;
    }

    :global(.fa-close) {
        color: #A80000; 
        left:50px;
    }

    :global(.fa-close) {
        margin-left: 20px; 
        font-size: 18px; 
        position: absolute;
        top: 10px;
    }

    :global(.fa-check) {
        margin-left: 20px; 
        font-size: 18px; 
        position: absolute;
        top: 10px;
    }
    :global(.fa-close), .fa-check,.middle_align {
        vertical-align: middle!important;
    }

    :global(.middle_align) {
        width: 164px;
        min-width: 164px;
    } 

    :global(.topic_input) {
        min-width: 257px;
    }

    :global(.preview_header) {
        font-size: 16pt;
        font-weight: bold;
        vertical-align: middle;
    }

    :global(.adjust_width) {
        width: 10%;
        text-align: center;
    }

    .theme_color_theme1 {
        background-color: #5B9BD5!important;
    }

    .theme_color_theme2 {
        background-color: #3B67BC!important;
    }

    .theme_color_theme3 {
        background-color: #F6C3A2!important;
    }

    .theme_color_theme4 {
        background-color: #70AD47!important;
    }

    .theme_color_theme5 {
        background-color: #745998!important;
    }


    

    .theme_color_terms_theme1 {
        background-color: #DEEAF6;
    }

    .theme_color_terms_theme2 {
        background-color: #D4DEF1;
    }

    .theme_color_terms_theme3 {
        background-color: #FAE0CF;
    }

    .theme_color_terms_theme4 {
        background-color: #E2EFD9;
    }

    .theme_color_terms_theme5 {
        background-color: #E1DAE9;
    }
</style>   