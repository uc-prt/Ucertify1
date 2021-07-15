<!-- 
 *  File Name   : GriddedPreview.js
 *  Description : Showing the gridded sheet for student
 *  Author      : Sundaram Tripathi
 *  Version     : 1.0
 *  Package     : pe-gold
 *  Last update : 26-june-2021  -->
 <script>
    import l from '../src/libs/editorLib/language.js';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import {writable} from 'svelte/store';
    import {AH,XMLToJSON,JSONToXML,onUserAnsChange} from "../helper/HelperAI.svelte";
    import { afterUpdate, beforeUpdate, onMount } from 'svelte';
    import GriddedHelper from './GriddedHelper.svelte';
    



    export let isReview;
    export let xml;
    export let showAns;
    export let uxml;
    export let editorState;

    // Declare global variables ////

    let bool = ' '; 
    let userAns = [];
    let ans = [];
    let myAns = [];
    let c = 0;
    let correctInc;
    let isAnswerCorrect = '';
    let answerStatus = '';
    let authAnsSplit;
    let incorrectCls = "";
    let userXML;



    let stateData = writable({  
        rowNum                  : 4,
        colNum                  : 4,
        item                    : 1,
        plus_minus              : 0,
        slash_val               : 0,
        decimal_val             : 0,
        xml                     : '',
        textSizeP               : 0,
        correctAns              : [],
        userList                : [],
        isMathquill             :false,
        smController            : "h",
        pointerEvents           : "auto",
        decimal_point           : 0,
        iconVisible             : "h",
        
    })

    let state = {};
    
    const unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

    $:{
        if (isReview) {
                setReview(); 
               // this.checkAns();
        } else {
                
                unsetReview();
        }
    }

    onMount(()=>{
        // $('body').on('keydown', '.td_data', function(e) { 
        //     if (e.which === 13) {
        //         $(this).click();
        //     }
        // });
        AH.listen(document,'keydown','.td_data',((data,e)=>{
            if(e.which === 13) {
                data.click();
            }
        }))

        // jQuery('#sm_controller button').click(function() {
        //     jQuery('#sm_controller button').removeClass("active btn-secondary text-white bg-secondary");
        //     jQuery(this).addClass('active btn-secondary text-white bg-secondary');
        // });
        AH.listen(document,'click','#sm_controller button',((e)=>{
            AH.selectAll('#sm_controller button','removeClass',['active,btn-secondary,text-white,bg-secondary']);
            AH.selectAll(e,'addClass',['active,btn-secondary,text-white,bg-secondary']);
        }))

        

        AH.listen(document,'click','#set-review',function(){
            setReview();
        })

        

        AH.listen(document,'click','#unset-review',function(){
            unsetReview();
        })
    })

    
    function loadModule(loadXml) {
        loadXml = XMLToJSON(loadXml);
        parseXMLPreview(loadXml); 
    }

    function parseXMLPreview(MYXML) {
	    try {
			
			state.rowNum = MYXML.smxml._row;
            state.colNum = MYXML.smxml._col;  
            state.slash_val = MYXML.smxml._slash;
            state.plus_minus = MYXML.smxml._plusminus;
            state.decimal_val =  MYXML.smxml._decimal;
            state.textSizeP = MYXML.smxml._font;
            state.correctAns = MYXML.smxml._correctAns.split(',');
            state.decimal_point = MYXML.smxml._fixed_point;

            
            //if (window.uaXML) {
            if(uxml) {
                // let timer = setTimeout(function() {
                    //parseUserAns(window.uaXML);
                    parseUserAns(uxml)
                //     clearTimeout(timer);
                // },50);
            }
		} catch (error) {
                onError = error;
                console.log({'error':error.message,'function name':'parseXMLPreview','File name':'GriddedPreview.js'});
        }
    }

    function parseUserAns(uans) {
            let userAnswer = XMLToJSON(uans);
            if (userAnswer.smans && userAnswer.smans.div && userAnswer.smans.div._userAns) {
                userAns = userAnswer.smans.div._userAns.split(",");
                bool = userAnswer.smans.div._correct;
               // $("#answer").prop("checked", bool)
                ans = userAns;
                //forceUpdate();
            }
    }

    beforeUpdate(()=>{
        if (xml != state.xml) {
            state.xml = xml;
            loadModule(xml);
        }  
        //if (this.props.remedStatus != nextProps.remedStatus) {
           
        //} 
        //if (window.QXML) {
        if(xml) {
            console.log('qxml');
        }
        firstRowItemPre();
        decimalFloatingPre();
        slashFuncPre();
        plusMinusSignPre();
        createdSheetRowPre();
        
    })

    function handleClick(event) {
        
        //////////////changing color according to user/////////
        let cell_class = event.target.getAttribute('name');
            let column_index = document.getElementsByName(cell_class);
            for (let i = 0; i < column_index.length; i++) {
                if (column_index[i].classList.contains("active")) {
                    column_index[i].classList.remove("active");
                }
            }
            event.target.classList.add("active");

          ////////Throw the select data in top row///////
            let target_id = event.target.id;
            let target_to_display = target_id.split("-"); 
            document.getElementById(target_to_display[0]).value = event.target.innerHTML;
            setUserAns(event); //////// Call function for answer checking
    }

    function setUserAns (event)  {
        let countRes;
        let resNew;
        let ansBool;

       //////// This code set the answer///////////
        let attr = event.target.attributes.getNamedItem('data-tag').value;
        if (event.target.innerHTML === '') {
            userAns[attr] = event.target.value;
        }else {
            userAns[attr] = event.target.innerHTML;
        }
        for (let i = 0; i<userAns.length; i++ ) {
            if (typeof(userAns[i]) == 'undefined' || userAns[i] == "") {
                userAns[i] = "%blank%";
            }
        }

        if (userAns[(userAns.length)-1] == "%blank%") {
            userAns.pop();
        }
        
        
            state.userList = userAns;
        
            authAnsSplit = state.correctAns;
            
            let user = state.userList;
            if (user.length == authAnsSplit.length) {
                for (let i = 0; i < authAnsSplit.length; i++) {
                    if (user[i] == authAnsSplit[i]) {
                        c++;  

                    }   
                }
                if (c == user.length) {
                   
                    countRes = l.correct
                    isAnswerCorrect = true;
                    c = 0;
                //return true;
                } else {
                   
                    countRes = l.incorrect;
                    isAnswerCorrect = false;
                    c = 0;
                    //return false;
                    
                }
            } else {
                countRes = l.incorrect;
                // return false;
            }
            // if (!window.QXML) {
            if(editorState) {
                showAns(countRes);
            }
            ansBool = (countRes == "correct") ? true : false;

            userXML = "<smans><div type='56' correct='"+isAnswerCorrect+"' userAns='"+state.userList+"'></div></smans>"
            
            //AH.select("#special_module_user_xml").value = userXML
            
            resNew = "<smans><div type='56' correct='"+isAnswerCorrect+"' userAns='"+state.userList+"'></div></smans>";
            if (bool != ' ' && c == user.length) {
                //jQUery("#answer").prop("checked", bool);
                AH.select("#answer",'attr',{"checked":bool});
            } else {
                //jQuery("#answer").prop("checked", isAnswerCorrect);
                AH.select("#answer",'attr',{"checked":isAnswerCorrect});
            }
            uxml = userXML
            onUserAnsChange({uXml:resNew,ans:ansBool});
        
        
    }


    function handleClickCombo(event) {
        
        //////////////changing color according to user/////////
        let cell_class = (event.detail.target).getAttribute('name');
            let column_index = document.getElementsByName(cell_class);
            for (let i = 0; i < column_index.length; i++) {
                if (column_index[i].classList.contains("active")) {
                    column_index[i].classList.remove("active");
                }
            }
            (event.detail.target).classList.add("active");

          ////////Throw the select data in top row///////
            let target_id = (event.detail.target).id;
            let target_to_display = target_id.split("-"); 
            document.getElementById(target_to_display[0]).value = (event.detail.target).innerHTML;
            setUserAnsCombo(event); //////// Call function for answer checking
    }

    function setUserAnsCombo (event)  {
        let countRes;

       //////// This code set the answer///////////
        let attr = (event.detail.target).attributes.getNamedItem('data-tag').value;
        if ((event.detail.target).innerHTML === '') {
            userAns[attr] = (event.detail.target).value;
        }else {
            userAns[attr] = (event.detail.target).innerHTML;
        }
        for (let i = 0; i<userAns.length; i++ ) {
            if (typeof(userAns[i]) == 'undefined' || userAns[i] == "") {
                userAns[i] = "%blank%";
            }
        }

        if (userAns[(userAns.length)-1] == "%blank%") {
            userAns.pop();
        }
        
        
            state.userList = userAns;
        
            authAnsSplit = state.correctAns;
            
            let user = state.userList;
            if (user.length == authAnsSplit.length) {
                for (let i = 0; i < authAnsSplit.length; i++) {
                    if (user[i] == authAnsSplit[i]) {
                        c++;  

                    }   
                }
                if (c == user.length) {
                   
                    countRes = l.correct
                    isAnswerCorrect = true;
                    c = 0;
                //return true;
                } else {
                    countRes = l.incorrect;
                    isAnswerCorrect = false;
                    c = 0;
                    //return false;
                    
                }
            } else {
                countRes = l.incorrect;
                // return false;
            }
            //if (!window.QXML) {
            if(editorState) {
                showAns(countRes);
            }
            
            
            //jQuery("#special_module_user_xml").val("<smans><div type='56' correct='"+isAnswerCorrect+"' userAns='"+state.userList+"'></div></smans>");
            AH.select("#special_module_user_xml").value = "<smans><div type='56' correct='"+isAnswerCorrect+"' userAns='"+state.userList+"'></div></smans>"
            if (bool != ' ' && c == user.length) {
                //jQUery("#answer").prop("checked", bool);
                
                AH.select("#answer",'attr',{"checked":bool});
            } else {
                //jQuery("#answer").prop("checked", isAnswerCorrect);
                
                AH.select("#answer",'attr',{"checked":isAnswerCorrect});
            }
        
        
    }

    function rowValidation(event) {  
        let a = state.rowNum - 1;
        if (event.target.value.length > 1) {
            AH.alert('Double digit not accepted');
            event.target.value = '';
            return false;
        }else if (event.target.value < 0) {
            AH.alert("Less then 1 not accepted");
            event.target.value = "";
            return false;
        }else if ( a < event.target.value) {
            AH.alert('Number insert only 0 to '+state.rowNum);
            event.target.value = '';
            return false;
        }
        setUserAns(event);
    }

    function highLight(event) {    
        let cell_class = event.target.getAttribute('name');
        let column_index = document.getElementsByName(cell_class);
        for (let i = 1; i < column_index.length; i++) {
            if (column_index[i].classList.contains("active")) {
                column_index[i].classList.remove("active");
            }    
            if (column_index[i].innerHTML == event.target.value) {
                    column_index[i].classList.add("active");
                }
        } 
    }


     ////////////////// Create very first row and store data according to click//////////

    let ColsPre = [];
    function firstRowItemPre() {
            let Rows = [];
            ColsPre = [];
            let dec_point = state.decimal_point;
            for (let j = 0; j < state.colNum; j++) {
                if (ans[j] === "%blank%"){
                    myAns[j] = " ";
                } else {
                    myAns[j] = ans[j];
                }
                if (j == dec_point - 1 && dec_point != 0) {
                    ColsPre = [
                        ...ColsPre,{
                            decpoint: true,
                        }
                    ]
                } else {
                    if (ColsPre.length < state.colNum) {
                        ColsPre = [
                            ...ColsPre,{
                                id: 't'+j,
                                dataTag: j,
                                name: 'p'+j,
                                value: myAns[j],
                                spanid: "t_"+j,
                                decpoint: false
                            }
                        ]

                    }
                }
            }
           
    }



    let totalRows = [];
    let totalCols = [];
    function createdSheetRowPre() {
        totalRows = [];
            let dec_point = state.decimal_point;
            for (let i = 0; i < state.rowNum; i++) {
                totalCols = [];
                for (let j = 0; j < state.colNum; j++) {
                    if (j == dec_point - 1 && dec_point != 0) {
                       

                        totalCols = [
                            ...totalCols,{
                                key: "col"+i+j,
                                decpoint: true
                            }
                        ]
                    } else {
                        if (totalCols.length < state.colNum) {
                            
                            totalCols = [
                                ...totalCols,{
                                    tabIndex: 0,
                                    key: "col"+i+j,
                                    name: 'p'+j,
                                    dataTag: j,
                                    id: "t" + j + "-" + i + j,
                                    decpoint: false,
                                }
                            ]
                        }
                    }
                }
                //totalRows.push(<tr key={"row"+i}>{totalCols}</tr>);
                totalRows = [
                    ...totalRows,{
                        key: "row"+i
                    }
                ]
            }
    }

    let Cols_slash = [];
    function slashFuncPre(event) {
            let Rows_slash = [];
            Cols_slash = [];
            let dec_point = state.decimal_point;
            for (let j = 0; j < state.colNum; j++) {
                    if (j == dec_point - 1 && dec_point != 0) {
                        Cols_slash = [
                            ...Cols_slash,{
                                key: "col"+j,
                                decpoint: true,
                            }
                        ]
                    } else {
                        if (Cols_slash.length < state.colNum) {
                            Cols_slash = [
                                ...Cols_slash,{
                                    id: "t" + j,
                                    name: 'p'+j,
                                    dataTag: j,
                                    decpoint: false
                                }
                            ]
                        }
                    }
            }
    };

    let Cols_decimal = [];
    function decimalFloatingPre(event) {
        let Rows_decimal = [];
        Cols_decimal = [];
        let dec_point = state.decimal_point;
        for (let j = 0; j < state.colNum; j++) {
            if (j == dec_point-1 && dec_point != 0) { 
                Cols_decimal = [
                    ...Cols_decimal,{
                        key: "col"+j,
                        decpoint: true
                    }
                ]
            } else {
                if (Cols_decimal.length < state.colNum) {
                    Cols_decimal = [
                        ...Cols_decimal,{
                            id: "t" + j,
                            name: 'p'+j,
                            dataTag: j,
                            decpoint: false
                        }
                    ]
                }
            }
        }
    };

    

    ///////////////// Set review and unset review function//////////////

    function setReview() {
        console.trace();
        state.smController = "",
        state.pointerEvents = "none"
        isReview = true;
        showAnswer("yans", "showIcon");
        //jQuery('#sm_controller .your-ans').addClass("btn-light active");

        AH.selectAll('#sm_controller .your-ans','addClass',['btn-light','active']);


        //jQuery(".tokenHeader").attr("tabindex", "0");
        AH.selectAll(".tokenHeader","attr",{"tabindex":0})

        //document.querySelector(".tokenHeader").setAttribute("tabindex","0");
        setTimeout(getCorrect(),200); 
        // if (!window.QXML) {
        if(editorState) {
            showAns((isAnswerCorrect)?(l.correct):(l.incorrect));
        } 
    }

    function getCorrect() {
	    for (let i = 0; i < state.correctAns.length; i++) {
            if (state.correctAns[i] == state.userList[i]) {
                //jQuery('#t_'+i).removeClass("icomoon-new-24px-cancel-circle-1").addClass("icomoon-new-24px-checkmark-circle-1");
                AH.select('#t_'+i,'removeClass','icomoon-new-24px-cancel-circle-1');
                AH.select('#t_'+i,'addClass','icomoon-new-24px-checkmark-circle-1');
            } else {
                //jQuery('#t_'+i).removeClass("icomoon-new-24px-checkmark-circle-1").addClass("icomoon-new-24px-cancel-circle-1");
                AH.select('#t_'+i,'removeClass','icomoon-new-24px-checkmark-circle-1');
                AH.select('#t_'+i,'addClass','icomoon-new-24px-cancel-circle-1')
            }
        }
        
	}
 
    function unsetReview() {  
        state.smController = "h",
        state.pointerEvents = "auto"
        isReview = false;
        showAnswer("yans", "hideIcon");
        //jQuery(".tokenHeader").removeAttr("tabindex");
        AH.selectAll(".tokenHeader", 'removeAttr', 'tabindex');
    }

    function showAnswer(val,iconState) {
        
      //show correct incorrect icon with respect to iconState
        if (iconState == "showIcon") {
            state.iconVisible = "";
        } else {
            state.iconVisible = "h";
        }


        if (val == "cans") {
            let ele = document.getElementsByClassName('gridded_tab');
            ele.disabled = true;
            ans = state.correctAns;
        } else if (val == "yans") {
            ans = userAns;
            
        }
    }


    ///////////////////////////// create plus and minus row//////////////////
    let Cols = [];
    let Cols_Minus = [];
    function plusMinusSignPre(event)  {
        Cols = [];
        Cols_Minus = [];
        let dec_point = state.decimal_point;
        //let arr = [];
        for (let j = 0; j < state.colNum; j++) {
            if (j == dec_point - 1 && dec_point != 0) {
                Cols = [
                    ...Cols,{
                        // id: "td" + j + '-' + i,
                        dataTag: j,
                        name: j,
                        decpoint: true
                    }
                ]
            } else {
                if (Cols.length < state.colNum) {
                    Cols = [
                        ...Cols,{
                            id: "t" + j,
                            name: 'p'+j,
                            dataTag: j,
                            decpoint: false
                        }
                    ]
                }
            }
            if (j == dec_point - 1 && dec_point != 0) {
                    Cols_Minus = [
                        ...Cols_Minus,{
                            // id: "td" + j + '-' + i,
                            dataTag: j,
                            name: j,
                            decpoint: true
                        }
                    ]
            } else {
                if (Cols_Minus.length < state.colNum) {
                    Cols_Minus = [
                        ...Cols_Minus,{
                            id: "t" + j,
                            name: 'p'+j,
                            dataTag: j,
                            decpoint: false
                        }
                    ]
                }
            }
        }
    };

    function handleReview(mode) {
        if (mode == 'c') {
			showAnswer("cans", "hideIcon");
		} else {
			showAnswer("yans", "showIcon");
		}
    }
    //let displayClass = ((state.iconVisible == "" && (state.userAns).includes(val.id)));

</script>

<main>
    <center>
        <div class="griddedModule">
            <center> 
                <ItemHelper 
                    handleReviewClick={handleReview}
                    reviewMode={isReview}
                />
            </center>
            <table border="1" id="tab2" style={'border-collapse:collapse;text-align:center'} >
                <tr style="display:flex;">
                    {#each ColsPre as val,i}
                        {#if val.decpoint == true}
                            <input type="text" style={'width:50px;text-align:center;'}  value="." disabled="true" class="tdFont" />
                        {:else}
                            
                                <input type="text" id={val.id} data-tag={val.dataTag} name={val.name} style={'width:50px;text-align:center;'} on:change={rowValidation} on:input={highLight} value={(myAns[i] === undefined)?" ":myAns[i]} class="tdFont">
                            
                                <span  class={state.iconVisible+' relative'}>
                                    <span id={val.spanid} class="answer_icon">
                                    </span>
                                </span>
                            
                        {/if}
                    {/each}
                </tr>
            </table>

                {#if state.plus_minus == 1}
                    <GriddedHelper 
                        on:handleClickCombo = {handleClickCombo}
                        loop = {Cols}
                        class1 = "tdFont plus_tab"
                        className="tdFontP plus_tab items_element"
                        tableId ="plus_minus_tab"
                        tableClass ="plus_minus_tab gridded_tab mt-0 myP"
                        value = "+"
                    ></GriddedHelper>
                    <GriddedHelper 
                        on:handleClickCombo = {handleClickCombo}
                        loop = {Cols_Minus}
                        class1 = "tdFont plus_tab"
                        className="tdFontP plus_tab items_element minus_point"
                        tableId ="plus_minus_tab"
                        tableClass ="plus_minus_tab gridded_tab mt-0 myP"
                        value = "-"
                    ></GriddedHelper>
                {/if}

            {#if state.decimal_val == 1}
                <GriddedHelper 
                    on:handleClickCombo = {handleClickCombo}
                    loop = {Cols_decimal}
                    class1 = "tdFont points"
                    className="tdFontP text-center items_element decl_point"
                    tableId ="slash_tab"
                    tableClass ="slash_tab gridded_tab mt-0 mb-0 myP"
                    value = "."
                ></GriddedHelper>
            {/if}
            {#if state.slash_val == 1}
                <GriddedHelper  
                    on:handleClickCombo = {handleClickCombo}
                    loop = {Cols_slash}
                    class1 = "tdFont points"
                    className="tdFontP text-center items_element sla_point"
                    tableId ="tdFontP slash_tab"
                    tableClass ="slash_tab gridded_tab mt-0"
                    value = "/"
                ></GriddedHelper>
            {/if}
        
            <table id="gridded_sheet" class="gridded_tab mt-0 lastGrid create_tab myP">
                <tbody>
                    {#each totalRows as data,no}
                        <tr key={data.key}>
                            {#each totalCols as val,i}
                                {#if val.decpoint}
                                    <td key={val.key} class ='tdFont text-center' width="50" disabled="true">    
                                    </td>
                                {:else}
                                    <td width="50" class="text-center">
                                        <span tabindex={val.tabIndex} key={val.key} name={val.name} data-tag={val.dataTag} class="tdFontP text-center td_data algn items_element" id={val.id} on:click={handleClick}>{+no}</span>
                                    </td>
                                {/if}
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>

        </div>
    </center>
</main>

<style>
    
    :global(.layoutHeading) {
        font-weight: bold;
        font-size: 16px;
        color: #1877b1;
    }

    :global(.items_element:hover) {
        border: 1.2px solid #777;
    }

    :global(.moreOptions) {
        -webkit-box-shadow: 3px 4px 6px #c4c5c5;
        -moz-box-shadow: 3px 4px 6px #c4c5c5;
        box-shadow: 3px 4px 6px #c4c5c5;
        background-color: #f0f0f0;
        border-top: 1px solid #1877b1;
        border-bottom: 1px solid #1877b1;
    }

    :global(.moreOptionDetails) {
        background-color: #f7f7f7;
    }

    :global(.input_col) {
        position: relative;
        left: 5px;
    }

    :global(.layoutheading) {
        padding: 5px;
        font-size: 20px;
        font-weight: bold;
    }


    :global(.numbr_range) {
        position: relative;
        left: 130px;
    }

    :global(.numbr_range_txt) {
        position: relative;
        left: 200px;
    }

    :global(.plus_minus_fraction) {
        position: relative;
        top: 20px;
    }

    :global(.floating_fraction) {
        position: relative;
        top: 27px;
    }

    :global(.plus_minus_span) {
        position: relative;
        left: 5px;
    }

    :global(.floating_decimal) {
        float: right;
        margin-right: 45px;
    }

    :global(.fontStyle) {
        width: 100px;
        float: right;
        margin-right: 60px;
    }

    :global(.fraction_slash) {
        position: relative;
        left: 177px;
    }

    :global(.minus_tab),
    .plus_tab,
    .slash_tab {
        text-align: center;
    }

    :global(.gridded_tab) {
        background-color: #f0f0f0!important;
        user-select: none!important;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    :global(.font_size_label) {
        position: relative;
        left: 198px;
    }

    :global(.font_size) {
        position: relative;
        left: 225px;
    }


    :global(.decimal_col) {
        position: relative;
        left: 208px;
        width: 90px;
    }

    :global(.correct_color) {
        background-color: #E9FFE9;
    }

    :global(.fixed_decimal_check) {
        position: relative;
        top: 26px;
        left: 13px;
    }

    :global(.correct_incorrect_icon_fill) {
        position: relative;
        width: 19px;
        height: 19px;
        right: 121px;
        top: -55px;
        background: white;
        border-radius: 50%;
    }

    :global(.row_column_decimal) {
        position: relative;
        top: 30px;
        left: 5px;

    }

    :global(.fixed_point_class) {
        position: relative;
        left: 7px;
    }

    :global(.row_column) {
        position: relative;
        left: 5px;
    }

    :global(.answer_icon) {
        position: absolute;
        top: 7px;
        right: 34px;
    }

    :global(.myP tbody) {
        cursor: pointer;
    }

    :global(.col_range) {
        width: 205px;
    }

    :global(.posSize) {
        position: relative;
        left: 7px;
    }

    :global(.fontSmall) {
        font-size: 12px;
        text-align: center;
    }

    :global(.fontNormal) {
        font-size: 14px;
        text-align: center;
    }

    :global(.fontLarge) {
        font-size: 24px;
        text-align: center;
    }

    :global(.fontExtraLarge) {
        font-size: 26px;
        text-align: center;
    }

    :global(.grid) {
        position: relative;
        top: 10px;
        box-shadow: 10px 5px 10px #000;
    }

    :global(.items_element) {
        border: 1px solid #8080807a;
        padding: 6px 10px;
        border-radius: 50%;
        background-color: white;
    }

    :global(.griddedModule .active) {
        color: white;
        transition: 1s;
        background: #696969;
        border: 2px solid #fff;
    }

    :global(.minus_point),
    .decl_point {
        padding: 6px 12px;
    }

    :global(.sla_point) {
        padding: 6px 11px;
    }

    :global(.griddedModule table tr td:last-child) {
        border-right: 1px solid #ccc !important;
    }

    :global(.griddedModule .lastGrid tr:last-child td) {
        border-bottom: 1px solid #ccc !important;
    }

    :global(.griddedModule td) {
        border: 1px solid #f0f0f0 !important;
        border-left: 1px solid #ccc !important;
    }

    :global(.token:hover) {
        border: 1px solid #000 !important;
    }

    :global(.bla .token:hover) {
        border: 1px solid #fff !important;
    }

    :global(.token_selected) {
        background-color: #64bb63;
        color: #fff;
    }

    :global(.bla .token_highlight_heading) {
        color: #000 !important;
    }

    :global(.griddedModule .expandIcon) {
        font-size: 27px;
        font-weight: bold;
        color: #1877b1;
    }
    :global(table td) {
        padding: .5rem .5rem!important;
        vertical-align: top!important;
        border-top: 1px solid #dee2e6!important;
    }
    :global(table th) {
        padding: .5rem .5rem!important;
        vertical-align: top!important;
        border-top: 1px solid #dee2e6!important;
    }
</style>