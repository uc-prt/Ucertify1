<!-- 
 *  File Name   : Gridded.js
 *  Description : Layout decided for gridded sheet
 *  Author      : Sundaram Tripathi
 *  Version     : 1.0
 *  Package     : pe-gold
 *  Last update : 14-March-2021  -->

<script>
    import l from '../src/libs/editorLib/language.js';
    import {writable} from 'svelte/store';
    import {AH,XMLToJSON,JSONToXML} from "../helper/HelperAI.svelte";
    import { onMount, afterUpdate, beforeUpdate } from 'svelte';
    import GriddedHelper from './GriddedHelper.svelte';



    let state = {};
    export let getChildXml;
    let correctAns = [];

    export let xml;

    let stateData = writable({
            rowNum                  : 4,
            colNum                  : 4,
            tableName               : "Gridded System",
            plus_minus              : 0,
            slash_val               : 0,
            decimal_val             : 0,
            xml                     : '',
            textSize                : 14,
            resAns                  : '',
            correctAns              : [],
            correctAnsSplit         : [],
            listAns                 : [],
            res                     : '',
            fixed_decimal_val       : 0,
            decimal_point           : 0,
    })

    const unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

    

    beforeUpdate(()=>{

        AI.selectAll('.tdFont','css',{
            fontSize:'14px'
        })
    
    })


    onMount(()=>{
        AH.listen('body','keydown','.td_data',((_this,e)=>{
            console.log("Evnts => ",e);
            if(e.which === 13) {
                _this.click();
            }
        }))
    })

    afterUpdate(()=>{
        if (xml != state.xml) {
            state.xml = xml;
            loadModule(xml);
        }
        firstRowItem();
        slashFunc();
        decimalFloating();
        plusMinusSign();
        createdSheetRow();
    })

    function loadModule(loadXml) {
        loadXml = XMLToJSON(loadXml);
        parseXMLAuthoring(loadXml);
    }

    function parseXMLAuthoring(MYXML) {
        try {
                state.rowNum = MYXML.smxml._row;
                state.colNum = MYXML.smxml._col;
                state.slash_val =  MYXML.smxml._slash;
                state.plus_minus = MYXML.smxml._plusminus;
                state.decimal_val =  MYXML.smxml._decimal;
                state.textSize = MYXML.smxml._font;
                state.correctAns =  MYXML.smxml._correctAns;
                state.correctAnsSplit = MYXML.smxml._correctAns.split(',');

                getChildXml(JSONToXML(MYXML));
                if (MYXML.smxml._plusminus == 1) {
                    document.getElementById('plus_minus_checkbox').checked = true;
                }
                if (MYXML.smxml._slash == 1) {
                    document.getElementById('fraction_slash_checkbox').checked = true;
                }
                if (MYXML.smxml._decimal == 1) {
                    document.getElementById('floating_decimal_checkbox').checked = true;
                }
            } catch (events) {
                console.warn({
                'error': events.message,
                'function name': 'parseXMLAuthoring',
                'File name': 'Gridded.js'
                });
            }
    }

    // Set boolean value in plus/minus
    function plusMinusSetVal() {
        state.plus_minus = (state.plus_minus == 0) ? 1 : 0;
        updateXml();
    }

    // slash function set value true or false
    function slashFuncSetVal(event) {
        state.slash_val = (state.slash_val == 0) ? 1 : 0;
            updateXml();
    }

    // This function disable decimal input box
    function fixedFunc(event) {
        if (state.fixed_decimal_val == 0) {
            state.fixed_decimal_val = 1;
            let elem = document.getElementById('Fixed_decimal_column');
            elem.disabled = false;
            elem.style.display = 'inline-block';
        } else {
            state.fixed_decimal_val = 0;
            state.decimal_point = 0 ;

            let elem = document.getElementById('Fixed_decimal_column');
            elem.value = " ";
            elem.disabled = true;
            elem.style.display = 'none';
            updateXml();
        }
    }
    

    // Set value decimal floating
    function decimalFuncSetVal (event) {
        state.decimal_val = (state.decimal_val == 0) ? 1 : 0;
        updateXml();
    }

    // This function decided to row or column function
    function changeRowCol(event) {
        if((event.target.value).length > 1) {
            AH.alert('accept only single value');
            event.target.value = 4;
            return false;
        }
        console.log('check');

        let val = event.target.value;
        if (!(val > 0 && val <= 10)) {
            AH.alert(l.grid_one_to_ten);
            return false;
        }
        if (event.target.name == "col_nmbr") {
            if (event.target.value < 1) {
                AH.alert(l.col_less_one);
                eva
                event.target.value = 1;
                return false;
            } else if (event.target.value > 6) {
                AH.alert(l.type_one_to_seven);
                event.target.value = "";
                return false;
            }
            state.colNum = event.target.value;
        } else {
            if (event.target.value < 1) {
            AH.alert(l.row_less_one);
            event.target.value = 1;
            return false;
            } else if (event.target.value > 10) {
                AH.alert(l.type_one_to_ten);
                event.target.value = '';
            return false;
            }
            state.rowNum = event.target.value;
        }
        updateXml();
    }

    function fixedDecimalPoints(event) {
        let decimalPosition = event.target.value;
        if((event.target.value).length > 1) {
            AH.alert('accept only single value');
            event.target.value = "";
            return false;
        }
        if (event.target.value == "") {
            decimalPosition = '';
        }
        if (event.target.value.length > 1 || event.target.value < 1 || state.colNum <= event.target.value) {
            decimalPosition = 1;
            event.target.value = 1;
            AH.alert(l.decimal_position+(state.colNum-1)+".");
            //$(".sa-info").show();
            //document.querySelector('.sa-info').style.display = 'block';
            AH.select('.sa-info','css',{display:'block'});
        }
        state.decimal_point = decimalPosition;
        updateXml();
        
    }

    // Update the xml
    function updateXml() {
        // setTimeout( function() {
            
            let updatedXml = '<smxml type="56" name="Gridded" plusminus="'+state.plus_minus+'" slash="'+state.slash_val+'" decimal="'+state.decimal_val+'" fixed_point="'+state.decimal_point+'" font="'+state.textSize+'" row="'+state.rowNum+'" col="'+state.colNum+'" correctAns="'+state.res+'" ><!--[CDATA[]]--></smxml>';
            getChildXml(updatedXml);
            
        // }, 500);
        
    }


    

    // Create a sheet according to range
    let totalRows = [],totalCols = [];
    function createdSheetRow() {
        AH.select('.tdFont','css',{fontSize:state.textSize})
        totalRows = [];
        let dec_point = state.decimal_point;
        for (let i = 0; i < state.rowNum; i++) {
            totalCols = [];

            for (let j = 0; j < state.colNum; j++) {
                if (j == dec_point - 1 && dec_point != 0) {
                    totalCols = [
                        ...totalCols,{
                            key:"col"+i+j,
                            decpoint: true
                        }
                    ]
                } else {
                    if (totalCols.length < state.colNum) {
                        totalCols = [
                            ...totalCols,{
                                key: "col"+i+j,
                                name: j,
                                id: "td" + j + "-" + i + j,
                                decpoint: false
                            }
                        ]
                    }
                }
            }
            totalRows = [
                ...totalRows,{
                    key: "row"+i
                }
            ]
        }

       
    
};

 

    // created a slash row in gridded sheet
    let Cols_slash;
    function slashFunc(event) {
        Cols_slash = [];
        let dec_point = state.decimal_point;
        for (let j = 0; j < state.colNum; j++) {
            if (j == dec_point - 1 && dec_point != 0) {
                Cols_slash = [
                    ...Cols_slash,{
                        key: "col"+j,
                        decpoint: true
                    }
                ]
            } else {
            if (Cols_slash.length < state.colNum) {
                Cols_slash = [
                    ...Cols_slash,{
                        id: "td" + j,
                        name: j,
                        dataTag: j,
                        decpoint: false
                    }
                ]
            }
        }
        }
    }

    // Create a decimal floating row
    let Cols_decimal;
    function decimalFloating(event) {
        Cols_decimal = [];
        let dec_point = state.decimal_point;
        for (let j = 0; j < state.colNum; j++) {
            if (j == dec_point - 1 && dec_point != 0 ) {
                Cols_decimal = [
                    ...Cols_decimal,{
                        key: "col"+j,
                        decpoint: true
                    }
                ]
            } else {
                if (Cols_decimal.length < state.colNum) {
                    Cols_decimal.push(
                            Cols_decimal = [
                                ...Cols_decimal,{
                                    id: "td" + j,
                                    name: j,
                                    dataTag: j,
                                    decpoint: false
                                }
                            ]
                    );
                }

            }

        }
       
    }

     // create plus and minus row
    let Cols_Minus = [],Cols = []; 
    function plusMinusSign(event)  {
            let Rows = [];
            Cols = [];
            Cols_Minus = [];
            let Rows_Minus = [];
            let dec_point = state.decimal_point;
            for (let j = 0; j < state.colNum; j++) {
                    if (j == dec_point - 1 && dec_point != 0) {
                        
                        Cols = [
                            ...Cols,{
                                id: "td" + j,
                                dataTag: j,
                                name: j,
                                decpoint: true
                            }
                        ]
                    } else {
                        if (Cols.length < state.colNum) {
                            
                            Cols = [
                                ...Cols,{
                                    id: "td" + j,
                                    dataTag: j,
                                    name: j,
                                    decpoint: false
                                }
                            ]
                        }
                    }
                    if (j == dec_point - 1 && dec_point != 0) {
                        Cols_Minus = [
                            ...Cols_Minus,{
                                id: "td" + j,
                                dataTag: j,
                                name: j,
                                decpoint: true
                            }
                        ]
                    } else {
                        if (Cols_Minus.length < state.colNum) {
                            Cols_Minus = [
                                ...Cols_Minus,{
                                    id: "td" + j,
                                    name: j,
                                    dataTag: j,
                                    decpoint: false
                                }
                            ]
                        }
                    }
            }
        
    }


    // Create very first row and store data according to click
    let ColsFirstRow = [];
    function firstRowItem() {

        let Rows = [];
        ColsFirstRow = [];
        let dec_point = state.decimal_point;
        for (let j = 0; j < state.colNum; j++) {
            if (j === dec_point - 1 && dec_point != 0 ) {
               
                ColsFirstRow = [
                    ...ColsFirstRow,{
                        decpoint: true
                    }
                ]
            } else {
                if (ColsFirstRow.length < state.colNum) {
                   
                    ColsFirstRow = [
                        ...ColsFirstRow,{
                            id: 'td'+j,
                            value: (state.correctAnsSplit[j] == "%blank%") ? '' : state.correctAnsSplit[j],
                            name: j,
                            dataTag: j,
                            decpoint: false
                        }
                    ]
                }
            }
        }
       
    }

     // Check validation first row input type
    function rowValidation(event) {
        console.log('number' + state.plus_minus);
        let a = state.rowNum-1;
        if (event.target.value.length > 1) {
            AH.alert(l.double_digit);
            event.target.value = '';
            return false;
        } else if (event.target.value < 0) {
            AH.alert(l.less_one);
            event.target.value = "";
            return false;
        } else if ( a < event.target.value) {
            AH.alert(l.number_from + a);
            event.target.value = '';
            return false;
        } else if (state.plus_minus == 0 &&  event.target.value == "+" || event.target.value == "-") {
            AH.alert('Plz select plus and minus option');
            event.target.value = "";
            return false;
        } else if (state.slash_val == 0 &&  event.target.value == "/") {
            AH.alert('Plz select slash option');
            event.target.value = "";
            return false;
        } else if (state.decimal_val == 0 &&  event.target.value == ".") {
            AH.alert('Plz select decimal option');
            event.target.value = "";
            return false;
        }



        let attribute = event.target.attributes.getNamedItem('data-tag').value;
        correctAns[attribute] = event.target.value;
        for (let i=0; i<correctAns.length; i++ ) {
            if (typeof(correctAns[i]) == 'undefined' || correctAns[i]=="") {
                correctAns[i] = "%blank%";
                //console.log(correctAns);
            }
        }
        if (correctAns[(correctAns.length)-1] == "%blank%") {
            correctAns.pop();
        }
        
            state.listAns = correctAns;
        
        state.res = state.listAns.toString();
        updateXml();
    }

     // Change color in sheet according to user input
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

    function handleClick(event) {
        let cell_class = event.target.getAttribute('name');
        let column_index = document.getElementsByName(cell_class);
        for (let i = 0; i < column_index.length; i++) {
            if (column_index[i].classList.contains("active")) {
                column_index[i].classList.remove("active");
            }
        }
        event.target.classList.add("active");
        let target_id = event.target.id;
        let target_to_display = target_id.split("-");
        document.getElementById(target_to_display[0]).value = event.target.innerHTML;

        let attribute = event.target.attributes.getNamedItem('data-tag').value;
        correctAns[attribute] = event.target.innerHTML;

        for (let i = 0; i < correctAns.length; i++ ) {
            if (typeof(correctAns[i]) == 'undefined') {
                correctAns[i] = "%blank%";
                //console.log(correctAns);
            }
        }
        
        state.listAns = correctAns;
        
        state.res = state.listAns.toString();
        updateXml();
    }

    // Insert a data in top row according to click  and change colors
    function handleClickCombo(event) {
        //let cell_class = event.target.getAttribute('name');
        let cell_class = (event.detail.target).getAttribute('name')
        let column_index = document.getElementsByName(cell_class);
        for (let i = 0; i < column_index.length; i++) {
            if (column_index[i].classList.contains("active")) {
                column_index[i].classList.remove("active");
            }
        }
        (event.detail.target).classList.add("active");
        let target_id = (event.detail.target).id;
        let target_to_display = target_id.split("-");
        document.getElementById(target_to_display[0]).value = (event.detail.target).innerHTML;

        //let attribute = event.target.attributes.getNamedItem('data-tag').value;
        let attribute = (event.detail.target).attributes.getNamedItem('data-tag').value;
        correctAns[attribute] = (event.detail.target).innerHTML;

        for (let i = 0; i < correctAns.length; i++ ) {
            if (typeof(correctAns[i]) == 'undefined') {
                correctAns[i] = "%blank%";
                //console.log(correctAns);
            }
        }
        
        state.listAns = correctAns;
        
        state.res = state.listAns.toString();
        updateXml();
    }

    function removeClass() {
        let el = document.getElementsByClassName('points');
        for (let i = 0; i < el.length; i++) {
            if (el[i].classList.contains("active")) {
                el[i].classList.remove("active");
            }
        }
    }

</script>
<main>
    <div class="griddedModule">
        <table border="1" id="tab2" class="tab2" style={'border-collapse: collapse;text-align: center;' } >
            <tbody>
                <tr>
                    {#each ColsFirstRow as val,i}
                        
                        {#if val.decpoint == true}
                            <input type="text" style='width:50px;text-align:center;'  value="." class="tdFont" disabled="true" />
                        {:else}
                                <input type="text" id={val.id} name={val.name} value={val.value == undefined ? '' : val.value } data-tag={val.dataTag} style={'width:50px;text-align:center;'} on:change={rowValidation} on:input={highLight} class="tdFont fo" />
                        {/if}
                    {/each}
                </tr>
            </tbody>
        </table>
        {#if state.plus_minus == 1}
            <GriddedHelper 
                on:handleClickCombo={handleClickCombo}
                loop = {Cols}
                class1 = "tdFont plus_tab points"
                className="tdFont plus_tab items_element"
                tableId ="plus_minus_tab"
                tableClass ="plus_minus_tab gridded_tab mt-0 myP"
                value = "+"
            ></GriddedHelper>
            <GriddedHelper 
                on:handleClickCombo={handleClickCombo}
                loop = {Cols_Minus}
                class1 = "tdFont plus_tab"
                className="tdFont minus_point text-center items_element"
                tableId ="plus_minus_tab"
                tableClass ="plus_minus_tab gridded_tab mt-0 myP"
                value = "-"
            ></GriddedHelper>
        {/if}
        {#if state.decimal_val == 1}
            <GriddedHelper 
                on:handleClickCombo={handleClickCombo}
                loop = {Cols_slash}
                class1 = "tdFont points"
                className="tdFont text-center items_element decl_point"
                tableId ="slash_tab"
                tableClass ="slash_tab gridded_tab mt-0 myP"
                value = "."
            ></GriddedHelper>
        {/if}
        {#if state.slash_val == 1}
                <GriddedHelper 
                    on:handleClickCombo={handleClickCombo}
                    loop = {Cols_slash}
                    class1 = "tdFont points"
                    className="tdFont text-center items_element sla_point"
                    tableId ="slash_tab"
                    tableClass ="slash_tab gridded_tab mt-0 myP"
                    value = "/"
                ></GriddedHelper>
        {/if}

        <table id="gridded_sheet" class="gridded_tab lastGrid mt-0 myP">
            
                {#each totalRows as data, no}
                    <tr key="row{no}">
                        {#each totalCols as val, i}
                            {#if val.decpoint == true}
                            <td key={val.key} class ='tdFont text-center points'  width="50" disabled="true">
                                
                            </td>
                            {:else}
                                <td width="50" class="text-center">
                                    <span tabIndex={0} key={val.key} name={val.name} data-tag={val.name} class ='tdFont td_data text-center items_element' id={val.id}  on:click={handleClick}>{+no}</span>
                                </td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
           
        </table>

        <div class="accordion mt-5" id="accordionExample" style="background-color:#F0F0F0;">
            <div class="accordion-item">
            <h2 class="accordion-header mt-0" id="headingOne">
                <button class="accordion-button collapsed py-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    {l.layout_options}
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
                <div class="accordion-body">
                    <div class="row form-group">
                
                        <div class="col-sm-6">
                            <div class="font-weight-bold">{l.row_count}</div>
                            <div>
                                <input type="number" min="1" max="10"  value={state.rowNum} name="col_range" id="col_range" class="form-control  inline-block" data-label="Number of rows" on:change={changeRowCol} />
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="font-weight-bold">{l.col_count}</div>
                            <div>
                                <input type="number" min="1" max="6"  value={state.colNum} name="col_nmbr" id="col_range" class="form-control  inline-block" data-label="Number of rows" on:change={changeRowCol} />
                            </div>
                        </div>
                    
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-6">
                            <div class="inline-block">
                                    <input type="checkbox" class="custom_checkbox_new float-left"
                                            id = "plus_minus_checkbox"
                                            inputProps={{ 'aria-label': 'Plus/Minus Column' }}
                                            on:click = {plusMinusSetVal}
                                    /><label for="plus_minus_checkbox" class="pl-1">Plus/Minus Column</label>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="inline-block">
                                    <input type="checkbox" id = "fraction_slash_checkbox" class="custom_checkbox_new float-left" inputProps={{ 'aria-label': 'Fraction/Slash' }} on:click = {slashFuncSetVal} /><label for = "fraction_slash_checkbox" class="pl-1">Fraction/Slash</label>
                            </div>
                        </div>
                    </div>
    
                <div class="row form-group">
                    <div class="col-sm-6">
                        <div class="inline-block">
                                <input type="checkbox" id = "fixed_decimal_checkbox" class="custom_checkbox_new float-left" inputProps={{ 'aria-label': 'Fixed Decimal' }} on:click = {fixedFunc}
                                /> <label for="fixed_decimal_checkbox" class="pl-1"> Fixed Decimal</label>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="inline-block">
                            <input type="checkbox" id = "floating_decimal_checkbox" class="custom_checkbox_new float-left" inputProps={{ 'aria-label': 'Floating Decimal' }} on:click = {decimalFuncSetVal}
                            /><label for="floating_decimal_checkbox" class="pl-1">Floating Decimal</label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 inline-block pl-0">
                    <div>
                        <input type="number" min="1" max="7"  name="Fixed_decimal_column" id="Fixed_decimal_column" class="form-control  inline-block" placeholder="Fixed decimal column" style={'display: none'} data-label="Fixed decimal column" disabled="true" on:change={fixedDecimalPoints} />
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</main>
<style>
    .custom_checkbox_new {
        display: block;
        position: relative;
        width: 20px;
        height: 20px;
        margin-bottom: 0;
        cursor: pointer;
        font-size: 18px;
    }

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

:global(.minus_tab,
.plus_tab,
.slash_tab) {
    text-align: center;
}

.gridded_tab {
    background-color: #f0f0f0;
    user-select: none;
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
    top: 3px;
    right: 34px;
}

.myP tbody {
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

.minus_point,
.decl_point {
    padding: 6px 12px;
}

:global(.sla_point) {
    padding: 6px 11px;
}

.griddedModule table tr td:last-child {
    border-right: 1px solid #ccc !important;
}

.griddedModule .lastGrid tr:last-child td {
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
</style>
