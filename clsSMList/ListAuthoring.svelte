<script>
    import l from '../src/libs/editorLib/language.js';
    import {writable} from 'svelte/store';
    import { onMount,beforeUpdate,afterUpdate } from "svelte";
    import {AH,XMLToJSON,JSONToXML} from "../helper/HelperAI.svelte";
    import data_parser from './papaparse.min';
    import { Button, Dialog, Checkbox } from 'svelte-mui/src';
    

    let state = {};
    let temp_array = [];
    let file_name;
    let child_generated;
    let row_no;
    let object_data;
    let count = true;;

    


    export let xml;
   // export let guid;
    export let getChildXml;
    export let editorState;

    
    //alert(editorState.xml);
    //////////////// Described states////////////

    let stateData = writable({
        xml                         : '',
        handle_disable_show         : true,
        selected_length             : 0,
        editorModalHandle           : false,
        counter                     : 0,
        EditorModalBox              : false
    })

    let modal = {
			header: [],
			body: [],
			footer: [],
			maxWidth: 'sm',
    };
        
    const unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

    let handle_disable = false;
    let progress_data = '';
    let handle_generate;

    $:{
        console.log('Editor State =>'+editorState.guid);
        console.log("Checking $");
        if (state.data_cdata && state.data_cdata[1].cg) {
            handle_disable = true;
        }
        handle_generate = state.xml && ((state.xml.smxml._disabled_generate == 1) ? true: false);
        //alert(state.xml.smxml);
        if (state.data_cdata) {
            progress_data = Math.ceil((state.counter * 100) / (state.data_cdata.length - 1)) + '%';
        }
        if(state.data_cdata) {
            child_generated = (state.data_cdata[1].cg) ? false: true;
        }
    }

    onMount(()=>{

        AH.listen(document,'click','.checkall',function(_this){
            console.log('Test ',_this.checked);
            let chk = _this.checked;
            
            AH.selectAll('table.table input[type=checkbox]:enabled,.sticky-col input[type=checkbox]:enabled,.sticky-intersect input[type=checkbox]:enabled','checked',chk);
            AH.select(_this,'attr',chk);
        })
        // used to show the tooltip
        // jQuery('#authoring_container').tooltip({
        //     selector: '[data-toggle="tooltip"]'
        // });
        // jQuery(document).on('change', '.checkall', function() {
        //     jQuery('.select_editable_guid').prop('checked', jQuery(this).prop('checked'));
        // });
        AH.listen(document,'change','.checkall',((_this)=>{
            AH.selectAll('.select_editable_guid',{checked:_this.getAttribute("checked")});
        }))
        // jQuery(document).on('change', '.checkall, .select_editable_guid', function() {
        //     var selected_length = jQuery('.select_editable_guid:checked').length;
        //     if (selected_length > 0) {
                
        //         state.handle_disable_show = false;
        //         state.selected_length = selected_length;
                
        //     } else {
        //             state.handle_disable_show = true;
        //             state.selected_length = 0;
        //     }
        // });
        AH.listen(document,'change','.checkall, .select_editable_guid',function() {
            let selected_length = AH.select('.select_editable_guid','checked').length;
            if (selected_length > 0) {
                
                state.handle_disable_show = false;
                state.selected_length = selected_length;
                
            } else {
                    state.handle_disable_show = true;
                    state.selected_length = 0;
            }
        })
    })

    afterUpdate(()=>{
        if (xml != state.xml) {
            state.xml = xml;
            loadModule(xml);
        }
        if (editorState.guid && state.data_cdata && state.data_cdata[0].pg == '') {
            setParentGuid(editorState.guid);
        }
    })

     // loads the module
    function loadModule(xml) {
        // contains the json data of xml
        let newXML = XMLToJSON(xml);
        // used for parse the xml and updates the xml
        parseXMLAuthoring(newXML);
    }

    // parses the xml data and update the xml
    function parseXMLAuthoring(MYXML) {
        try {
            if(count) {
            // contains the information of each rows in the form of json 
                temp_array = JSON.parse(MYXML.smxml.__cdata).list;
                count =false;
            }
            state.data_cdata = temp_array;
            state.xml = MYXML;
        } catch (error) {
            console.log({ 'error': error });
        }
    }


     // used for import the csv file
    function handleImport() {
        // opens the file select dialog box for import the csv
        document.querySelector('#fileUpload').click();

    }

    // used for update the xml
    function updateXML(cdata_value) {
        // updates the cdata value of xml
        state.xml.smxml.__cdata = cdata_value;
        // updates the xml
        getChildXml(JSONToXML(state.xml)); 
    }

    //used for update the column(s) value in xml
    function handleEdit(event) {
        // contains the id of that column in which changes made
        let target_id = event.target.id;
        // finds the row no in which changes made
        row_no = target_id.split('_')[1];
        // finds the column no in which changes made
        let col_no = target_id.split('_')[2];
        // contains previous column value
        let previous_data;
        // updates the respective column value according to change in column value
        ((col_no == 0) ? (previous_data = state.data_cdata[row_no].c1, state.data_cdata[row_no].c1 = document.querySelector('#' + target_id).innerText) : (previous_data = state.data_cdata[row_no].c2, state.data_cdata[row_no].c2 = document.querySelector('#' + target_id).innerText));
        // updates the xml
        updateXML(JSON.stringify({ "list": state.data_cdata }));
        if (state.data_cdata[row_no].cg && ((col_no == 0) ? (previous_data != state.data_cdata[row_no].c1): (previous_data != state.data_cdata[row_no].c2))) {
            // modal = {
            //     header: {
            //         body: (<div>{l.save_header}</div>),
            //         class: "editor_modal_title"
            //     },
            //     body: {
            //     body: (<div>{l.child_update}</div>),
            //         class: "editor_modal_content",
            //         style: {height: 'auto'}
            //     },
            //     footer: {
            //         body: [{label: 'OK', class: "bg-primary text-white", onAction: ()=> self.handleUpdate(row_no)}],
            //         class: "editor_modal_action"
            //     },
            //     maxWidth: 'sm',
            // };
            state.EditorModalBox = true;
            editorModalUpdate(true);
        }
    }

    // used for update the guids which exist in "Current Guid" and "Used in Guids" field of respective row
    function handleUpdate(rowNo) {
        editorModalUpdate(false);
        updateOldGuidsOption(rowNo, state.data_cdata[rowNo].cg, state.data_cdata[rowNo].pg, state.data_cdata[rowNo].rn, state.data_cdata[rowNo].ag);
    }


    // generates the guid for each rows
    function generateItems(parent_guid, current_row_val) {
        return new Promise((resolve) => {
            try {
                // stores the random row no
                let random_rows = [], randomRowNo;
                for (let index_no = 0; index_no < 3; index_no += 1) {
                    // contains the random row no returned by the method "findRandomRowNo"
                    randomRowNo = findRandomRowNo(current_row_val, random_rows);
                    while (!randomRowNo) {
                        // calls the method "findRandomRowNo" till it does not get the row no
                        randomRowNo = findRandomRowNo(current_row_val, random_rows);
                    }
                    if (randomRowNo) {
                        // pushes the row no received randomly
                        random_rows.push(randomRowNo);
                    }
                }
                
                let algo_xml_data = AH.get('algo_var_data');
                
                algo_xml_data = algo_xml_data && algo_xml_data.replace(/"/gm, "\"");
                // creates the object that has to be send for generate the guid on server side
                let question_obj = { "question": "", "answers": [], "correct_ans_str": "A", "total_answers": 4, "correct_answers": 1, "title": "", "parent_guid": parent_guid, "explanation": "Answer <seq no=\"a\"></seq> is correct.", "algo_qxml": algo_xml_data};
                // updates the correct answer value in array key answers of object question_obj
                question_obj.answers.push({ "is_correct": "1", "answer": state.data_cdata[current_row_val].c2, "id": "01" });
                for (let index_no1 = 0; index_no1 < 3; index_no1 += 1) {
                    // updates the other options value in array key answers of object question_obj
                    question_obj.answers.push({ "is_correct": "0", "answer": state.data_cdata[random_rows[index_no1]].c2, "id": "0" + (index_no1 + 2) });
                }
                // sets the title for guid
                //question_obj.title = $('#title').html() + ': ' + state.data_cdata[current_row_val].c1;
                question_obj.title = document.querySelector('#title').innerHTML + ': ' + state.data_cdata[current_row_val].c1;
                // sets the question data for guid
                question_obj.question = state.data_cdata[current_row_val].c1;
                // request for get the guid
                // AH.ajax({
                //     //ajax: "1",
                    
                //     url: baseUrl + 'editor/index.php', // denotes file where ajax request will be handle by server
                //    // cache: false, // does not stores request data in cache memory
                //     data: {
                //         str_content: question_obj, // object data which needs to be used for create the new guid
                //         func: "get_guid_from_api", // condition in which block ajax request will be received and response will be send from server
                //         //snippet: $('#title').html() + ': ' + self.state.data_cdata[current_row_val].c1
                //         snippet: document.querySelector('#title').innerHTML + ': ' + state.data_cdata[current_row_val].c1
                //     },
                //     type: "post", // used for security purpose
                //     success: function (response) {
                //         // contains the response in object form
                //         var json_received_string = JSON.parse(response);
                //         if (json_received_string && json_received_string.content_guid) {
                //             // stores the generated guid in current_guid key of respective row
                //             temp_array[current_row_val].cg = json_received_string.content_guid;
                //             for (var index_no1 = 0; index_no1 < 3; index_no1 += 1) {
                //                 // stores the generated guid in all rows "used_in_guids" key with the help of which current guid is generated
                //                 temp_array[random_rows[index_no1]].ag.push(json_received_string.content_guid);
                //                 // stores the row no which are used for create the generated guid
                //                 temp_array[current_row_val].rn.push(random_rows[index_no1]);
                //             }
                //             if (current_row_val == (state.data_cdata.length - 1)) {
                //                 // updates the xml with created guids
                //                 updateXML(JSON.stringify({ "list": temp_array }));
                //             }
                //         }
                //         resolve(json_received_string.content_guid);
                //     }
                // });
                console.log('check disabled 1 =>',state.xml.smxml._disabled_generate);
                updateXML(state.xml.smxml._disabled_generate);
                AH.ajax({
                    type: "post",
                    url: baseUrl + 'editor/index.php',
                    longData: true,
                    data: {
                        str_content: JSON.stringify(question_obj), 
                        func: "get_guid_from_api", 
                        snippet: document.querySelector('#title').innerHTML + ': ' + state.data_cdata[current_row_val].c1,
                    },
                    onEnd: function() {
                        AH.activate(0);
                    }
                }).then(function(response) {
                    console.log(response);
                // contains the response in object form
                    // contains the response in object form
                    let json_received_string = JSON.parse(response);
                    if (json_received_string && json_received_string.content_guid) {
                        // stores the generated guid in current_guid key of respective row
                        temp_array[current_row_val].cg = json_received_string.content_guid;
                        for (let index_no1 = 0; index_no1 < 3; index_no1 += 1) {
                            // stores the generated guid in all rows "used_in_guids" key with the help of which current guid is generated
                            temp_array[random_rows[index_no1]].ag.push(json_received_string.content_guid);
                            // stores the row no which are used for create the generated guid
                            temp_array[current_row_val].rn.push(random_rows[index_no1]);
                        }
                        if (current_row_val == (state.data_cdata.length - 1)) {
                            // updates the xml with created guids
                            updateXML(JSON.stringify({ "list": temp_array }));
                            console.log('check disabled2 =>',state.xml.smxml._disabled_generate);
                            
                            //updateXML(JSON.stringify({ "list": Object.assign({},temp_array) }));
                        }
                    }
                        resolve(json_received_string.content_guid);
                })
            } catch (error) {
                console.log({'error': error});
                resolve(null);
            }
        });
    }

     // returns the random row no
    function findRandomRowNo(current_row_no, random_rows) {
        // contains the random no
        let random_row_value = Math.floor(Math.random() * (state.data_cdata.length - 1)) + 1;
        if (random_row_value == current_row_no || random_rows.indexOf(random_row_value) > -1) {
            // retuns the false if it is equal to current row or already stored in random_rows array
            return false;
        } else {
            // retuns the random value if it is not equal to current row and neither stored in random_rows array
            return random_row_value;
        }
    }

    // used for delete the row
    function handleDelete(index_no) {
        console.log('checking');
        if (state.data_cdata.length >= 6) {
            // removes the respective row from xml
            state.data_cdata.splice(index_no, 1);
        } else {
            AH.showmsg(l.min4_rows_allowed, 4000);
        }
        if (!state.data_cdata[1].cg || state.data_cdata[state.data_cdata.length - 1].cg) {
            // used for disabled the Generate/Update Items button
            state.xml.smxml._disabled_generate = 1;
        } else {
            // used for enabled the Generate/Update Items button
            state.xml.smxml._disabled_generate = 0;
        }
        // updates the xml
        updateXML(JSON.stringify({ "list": state.data_cdata }));
    }

    // updates the guids data
    function ajaxRequestForDataUpdate(rowNo, current_guid, row_no_array, parent_guid, close_activator) {
        // object that has to be send on server for update the guid
        return new Promise(function (resolve) {
            try {
               
                let algo_xml_data1 = AH.get('algo_var_data');
               
                algo_xml_data1 = algo_xml_data1 && algo_xml_data1.replace(/"/gm, "\"");
                let question_obj = { "question": state.data_cdata[rowNo].c1, "answers": [], "correct_ans_str": "A", "total_answers": 4, "correct_answers": 1, "title": state.xml.smxml._pt + ": " + state.data_cdata[rowNo].c1, "parent_guid": parent_guid, "explanation": "Answer <seq no=\"a\"></seq> is correct.", "algo_qxml": algo_xml_data1};
                // updates the answers key data of object "question_obj"
                question_obj.answers.push({ "is_correct": "1", "answer": state.data_cdata[rowNo].c2, "id": "01" });
                for (let index_no1 = 0; index_no1 < 3; index_no1 += 1) {
                    // updates the answers key data of object "question_obj"
                    question_obj.answers.push({ "is_correct": "0", "answer": state.data_cdata[row_no_array[index_no1]].c2, "id": "0" + (index_no1 + 2) });
                }
                // ajax resquest for update the guid
                // AH.ajax({
                //     ajax: "1",
                    
                //     url: baseUrl + 'editor/index.php', // defines where ajax request will be send
                //     cache: false, // does not stores data in cache memory
                //     data: {
                //         str_content: question_obj, // data in the form of object for update the guid
                //         func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
                //         content_guid: current_guid // sends the guid that has to be update
                //     },
                //     type: "post", // send the data with for security
                //     success: function (response) {
                //         // contains the response in object form
                //         var json_received_string = JSON.parse(response);
                //         if (json_received_string.content_guid && (close_activator == true)) {
                //             // close the activator
                //             console.log('ajaxRequestForDataUpdate');
                //             AH.activate(0);
                //             // shows the warning message
                            
                //             AI && AI.showmsg(l.child_updated, 4000);
                //         }
                //         resolve(json_received_string.content_guid);
                //     }
                // });

                AH.ajax({
                    type: "post",
                    url: baseUrl + 'editor/index.php',
                    data: {
                        str_content: question_obj, // data in the form of object for update the guid
                        func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
                        content_guid: current_guid // sends the guid that has to be update
                    },
                    onEnd: function() {
                        AH.activate(0);
                    }
                }).then(function(response) {
                // contains the response in object form
                     // contains the response in object form
                        let json_received_string = JSON.parse(response);
                        if (json_received_string.content_guid && (close_activator == true)) {
                            // close the activator
                            console.log('ajaxRequestForDataUpdate');
                            AH.activate(0);
                            // shows the warning message
                            
                            AI && AH.showmsg(l.child_updated, 4000);
                        }
                        resolve(json_received_string.content_guid);
                    
                })
            } catch(error) {
                console.log({'error': error});
                resolve(null);
            }
        });
    }

    async function updateOldGuidsOption(rowNo, current_guid, parent_guid, created_with_rows, used_in) {
        // shows the activator
        console.log('updateOldGuidsOption 1');
        AH.activate(2);
        for (let index_no = 0; index_no < state.data_cdata.length; index_no += 1) {
            if (index_no != 0) {
                if (used_in.indexOf(state.data_cdata[index_no].cg) > - 1) {
                    // updates that rows current_guid which contains argument current_guid data in their "used_in_guids" array
                    let received_data = await updateRelatedGuids(index_no, state.data_cdata[index_no].cg, parent_guid, state.data_cdata[index_no].rn, state.data_cdata[index_no].ag);
                    if (!received_data) {
                        
                        AH.showmsg(l.check_net_update_ids, 4000);
                        console.log('updateOldGuidsOption 2');
                        AH.activate(0);
                        break;
                    }
                }
                if (index_no == (state.data_cdata.length - 1)) {
                    // update the guid store in argument current_guid
                    let received_data1 = await ajaxRequestForDataUpdate(rowNo, current_guid, created_with_rows, parent_guid, true);
                    if (!received_data1) {
                        
                        AH.showmsg(l.check_net_update_ids, 4000);
                        console.log('updateOldGuidsOption 3');
                        AH.activate(0);
                    }
                }
            }
        }
        // updates the parent guid
        updateParentGuid();
    }

     // updates that rows current_guid which contains argument current_guid data in their "used_in_guids" array
    function updateRelatedGuids(rowNo, current_guid, parent_guid, created_with_rows) {
        // called for update the guids data
        return ajaxRequestForDataUpdate(rowNo, current_guid, created_with_rows, parent_guid, false);
    }

    // used for set the parent guid in each rows xml and updates the xml
    function setParentGuid(guid_data) {
        console.log("guid_data "+guid_data);
        // used for defined the title of child items
        // state.xml.smxml._pt = $('#title').html();
        state.xml.smxml._pt = document.querySelector('#title').innerHTML;
        // used for enabled the Generate/Update Items button
        state.xml.smxml._disabled_generate = 0;
        // sets the parent guid for each row

        for (let key in state.data_cdata) {
            state.data_cdata[key].pg = guid_data;
        }

        console.log({'cdata ':state.data_cdata});
        //updates the xml
        updateXML(JSON.stringify({ "list": state.data_cdata }));
    }

    // userd for validation purpose before generate the items
    function generateQuestions() {
        // used for generate the guids for each row
        handleGenerateItems();
    }

     // used for generate the guid for each rows
    async function handleGenerateItems() {
        
        console.log('handle generate');
        if ((state.data_cdata).length >= 5) {
            // used for disabled the Generate/Update Items button
            state.xml.smxml._disabled_generate = 1;
            // sets the user guid in xml
            
            state.xml.smxml._imported_by = user_guid;
            // sets the uploaded csv file name in xml
            state.xml.smxml._file = file_name;
            let date_obj = new Date();
            // sets the date of uploaded csv file name in xml
            state.xml.smxml._imported_on = date_obj.toDateString();
            let is_failed = false;
            // shows the progress bar
            //jQuery('#warning_label_container').removeClass('h');
            AI.select('#warning_label_container','removeClass','h');
            
            // not allowed user to perform any operation
            //jQuery('#authoring_container').css('pointer-events', 'none');
            AH.setCss('#authoring_container',{
                'pointer-events': 'none'
            })
            for (let index_no = 0; index_no < state.data_cdata.length; index_no += 1) {
                if (index_no != 0 && state.data_cdata[index_no].cg == '') {
                    // called for generate the guid for each row
                    let guid_data = await generateItems(state.data_cdata[index_no].pg, index_no);
                    if (typeof guid_data == 'undefined' || !guid_data) {
                        is_failed = true;
                        // shows warning message
                        AH.showmsg(l.check_network, 4000);
                        // used for enabled the Generate/Update Items button
                        state.xml.smxml._disabled_generate = 0;
                        // allows user to perform the operation
                        //jQuery('#authoring_container').css('pointer-events', 'auto');
                        AH.setCss('#authoring_container',{
                            'pointer-events': 'auto'
                        })
                        // hides the progress bar
                        //jQuery('#warning_label_container').addClass('h');
                        AH.select("#warning_label_container",'addClass','h')
                        break;
                    } else {
                        // increases the counter according to the generated guids
                            state.counter = state.counter + 1;
                    }
                }
            }
            if (!is_failed) {
                
                AH.showmsg(l.child_items_generated, 4000);
                // allows user to perform the operation
                //jQuery('#authoring_container').css('pointer-events', 'auto');
                AH.setCss("#authoring_container",{
                    'pointer-events':'auto'
                })
                // updates the parent guid
                updateParentGuid();
            }
        } else {
            // shows warning message
            
            AH.showmsg(l.min4_max500_allowed, 4000);
        }
    }

    // used for show all the child guids which are selected
    function showAllChild() {
        // array for contain the child guid of selected row
        let routerGuid = [];
        // jQuery('.select_editable_guid:checked').each(function() {
        //     // pushes the child guid
        //     routerGuid.push(jQuery(this).attr('target-guid'));
        // });
        AH.select('.select_editable_guid','checked').forEach((_this)=>{
            routerGuid.push(_this.getAttribute('target-guid'));
        })
        // url for show the selected child guids
       
        let futureUrl = baseUrl + 'editor/v2/?action=edit&content_guid=' + routerGuid[0] + '&no_header=1&react_content=1&no_domain=1&router_guid=' + routerGuid.join(",");
        // opens the url in new tab
        window.open(futureUrl, '_blank');
    }

    // used for add the rows
    function addOption() {
        if ((state.data_cdata).length < 501) {
            // contains the row data in object form
            object_data = { "c1": "Data" + state.data_cdata.length, "c2": "Meaning" + state.data_cdata.length, "pg": state.data_cdata[0].pg, "cg": "", "ag": [], "rn": []};
            // pushes the data into data_cdata array
            state.data_cdata.push(object_data);
            if (state.data_cdata[1].cg) {
                // used for enabled the Generate/Update Items button
                state.xml.smxml._disabled_generate = 0;
            }
            // updates the xml
            updateXML(JSON.stringify({ "list": state.data_cdata }));
        } else {
            // shows warning message
           
            AH.showmsg(l.max500_rows_allowed, 4000);
        }
    }

    // used for upload csv file and update the xml
    function uploadCsv() {
        try {
            // selects the element have id 'fileUpload' 
            let fileUpload = document.getElementById("fileUpload");
            // used for check the file extention 
            let regex = /\.csv$/;
            file_name = fileUpload.files[0].name;
            if (regex.test(fileUpload.value.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    if (state.data_cdata[1].cg == '') {
                        // Returns a newly constructed FileReader.
                        let reader = new FileReader();
                        // A handler for the M event. This event is triggered each time the reading operation is successfully completed
                        reader.onload = function (event) {
                            // converts csv data into json string data
                            let importedCsv = csvToJson(event.target.result);
                            if (importedCsv) {
                                // updates the xml
                                updateXML(importedCsv);
                                count = true;
                                AH && AH.showmsg(l.file_uploaded, 4000);
                            }
                            fileUpload.value = '';
                        }
                        reader.readAsText(fileUpload.files[0]);
                    }
                } else {
                    // shows the warning message
                AH.showmsg(l.html5_not_supported, 4000);
                }
            } else {
                // shows the warning message
                
                AH.showmsg(l.upload_valid_csv, 4000);
            }
        } catch (error) {
            console.log({ 'error': error });
        }
    }


    // converts csv data into json string data
    function csvToJson(csv) {
        // converts csv file data into Array
        let csv_array = data_parser.parse(csv).data;
        // contains rows data which is not blank 	
        csv_array = csv_array.filter(function(data) { 
            let sub_csv_array = data.filter(function(val) {
                if (val && val.trim() != "") {
                    return val;
                }
            });
            return sub_csv_array.length > 0;
        });
        // contains the row
        let row_data = [];
        // object for update the xml
        let str_data = {};
        if (csv_array.length <= 501 && csv_array.length >= 5) {
            for (let index_no = 0; index_no < csv_array.length; index_no += 1) {
                if (csv_array[index_no] && csv_array[index_no].length > 0) {
                    // contains the column data in the form of array
                    let column_data = csv_array[index_no];
                    // object for update the xml
                    str_data = { "c1": "", "c2": "", "pg": state.data_cdata[0].pg, "cg": "", "ag": [], "rn": []};
                    for (let index_no1 = 0; index_no1 < column_data.length; index_no1 += 1) {
                        if (column_data.length > 1) {
                            if ((column_data[index_no1] && column_data[index_no1].trim() != "") && (index_no1 == 0 || index_no1 == 1)) {
                                if (index_no1 == 0) {
                                    // updates the first column value in xml
                                    str_data.c1 = column_data[index_no1].replace(/'/gm, '\'').replace(/"/gm, "\"");
                                } else {
                                    // updates the second column value in xml
                                    str_data.c2 = column_data[index_no1].replace(/'/gm, '\'').replace(/"/gm, "\"");
                                }
                            } else {
                                if ((column_data[index_no1] && column_data[index_no1].trim() != "") && index_no1 > 1) {
                                    // shows warning message
                                    
                                    AH.showmsg(l.exact2_column_allowed, 4000);
                                    return false;
                                } else {
                                    if (index_no1 <= 1) {
                                        // shows warning message
                                        
                                        AH.showmsg(l.blank_column_notallowed, 4000);
                                        return false;
                                    }
                                }
                            }
                        } else {
                            // shows warning message
                            
                            AH.showmsg(l.exact2_column_allowed, 4000);
                            return false;
                        }
                    }
                    // stores each rows data in object form
                    row_data.push(str_data);
                } else {
                    // shows warning message
                    
                    AH.showmsg(l.blank_column_notallowed, 4000);
                    return false;
                }
            }
            // retuns the data of each csv file in json string
            return JSON.stringify({ "list": row_data });
        } else {
            // shows warning message
        
            AH.showmsg(l.min_max_validation, 4000);
        }
    }

    function updateParentGuid() {
        // @eslint issue, it's global method
        console.log("updateParentGuid 1");
        AH.activate(2);
        // AH.ajax({
        //     //ajax: "1",
        //     // @eslint issue, it's global variable
        //     url: baseUrl + 'editor/index.php', // defines where ajax request will be send
        //     //cache: false, // does not stores data in cache memory
        //     data: {
        //         // @eslint issue, it's global method
        //         str_content: JSONToXML(state.xml), // data in the form of object for update the guid
        //         func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
        //         content_guid: state.data_cdata[1].pg, // sends the guid that has to be update
        //         update_parent: 1
        //     },
        //     //type: "post", // send the data with for security
        //     success: function (response) {
        //         // contains the response in object form
        //         var json_received_string = JSON.parse(response);
        //         if (!json_received_string.content_guid) {
        //             // shows warning message
        //             // @eslint issue, it's global variable
        //             AI && AI.showmsg(l.check_net_and_save, 4000);
        //         }
        //         // @eslint issue, it's global method
        //         console.log("updateParentGuid 2");
        //         AH.activate(0);
        //         // hides the progress bar
        //         //jQuery('#warning_label_container').addClass('h');
        //         document.querySelector("#warning_label_container").classList.add("h");
        //     }
        // });

        AH.ajax({
            type: "post",
            url: baseUrl + 'editor/index.php',
            data: {
                str_content: JSONToXML(state.xml), // data in the form of object for update the guid
                func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
                content_guid: state.data_cdata[1].pg, // sends the guid that has to be update
                update_parent: 1
            },
            onEnd: function() {
                AH.activate(0);
            }
        }).then(function(response) {
            // contains the response in object form
            let json_received_string = JSON.parse(response);
            if (!json_received_string.content_guid) {
                // shows warning message
                // @eslint issue, it's global variable
                AH && AH.showmsg(l.check_net_and_save, 4000);
            }
            // @eslint issue, it's global method
            console.log("updateParentGuid 2");
            AH.activate(0);
            // hides the progress bar
            //jQuery('#warning_label_container').addClass('h');
            //document.querySelector("#warning_label_container").classList.add("h");
            AH.select("#warning_label_container","addClass","h")
        })
    }


    
    // $:{
    //     if (state.data_cdata && state.data_cdata[1].cg) {
    //         handle_disable = true;
    //     }
    //     handle_generate = state.xml && ((state.xml.smxml._disabled_generate == 1) ? true: false);
    //     alert(state.xml.smxml);
    //     if (state.data_cdata) {
    //         progress_data = Math.ceil((state.counter * 100) / (state.data_cdata.length - 1)) + '%';
    //     }
    //     if(state.data_cdata) {
    //         child_generated = (state.data_cdata[1].cg) ? false: true
    //     }
    // }
    

     // used for hide and show the warning dialog box
    function editorModalUpdate(args) {
        
        state.editorModalHandle = args;
        
    }


</script>
<div>
    <div id="authoring_container" class="container w-100 px-3 py-3">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div id="warning_label_container" class="progress w-100 h my-2 height20">
                        <div class="progress-bar bg-success progress-bar-striped progress-bar-animated font-weight-bolder" style={"width:"+ progress_data}><b>{state.counter + '/' + (state.data_cdata && (state.data_cdata.length - 1))}</b></div>
                    </div>
                    <div>
                        <span class="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title={((handle_disable) ? l.new_not_allowed: l.csv_file)}>
                            <button class={"btn btn-primary btn-md" + ((handle_disable) ? " pointer_event_none": "")} name="import_csv_btn" on:click={handleImport} disabled={handle_disable}>{l.import_csv}</button>
                        </span>
                        <input id="fileUpload" type="file" on:change={uploadCsv} class="upload h" />
                        <span class="d-inline-block ml-2" data-bs-toggle="tooltip" data-bs-placement="top" title={((handle_generate) ? ((handle_disable) ? l.already_generated: l.save_war_msg): ((handle_disable) ? l.new_row_tooltip: l.generate_items))}>
                            <button class={"btn btn-primary btn-md" + ((handle_generate) ? ' pointer_event_none': '')} name="generate_question_btn" id="generate_question_btn" on:click={generateQuestions} disabled={handle_generate}>{((handle_generate) ? l.generate_item: ((state.data_cdata && state.data_cdata[1].cg) ? l.update_item: l.generate_item))}</button>
                        </span>
                        <span class="d-inline-block ml-2" data-bs-toggle="tooltip" data-bs-placement="top" title={((state.handle_disable_show) ? ((handle_disable) ? l.child_not_selected: l.child_not_generated): l.show_all)}>
                            <button class={"btn btn-primary btn-md width125" + ((state.handle_disable_show) ? " pointer_event_none": "")} name="show_all_child" id="show_all_child" disabled={state.handle_disable_show} on:click={showAllChild}>{((state.selected_length > 0) ? l.show_all_label + ' (' + state.selected_length +')': l.show_all_label)}</button>
                        </span>
                    </div>
                
                    {#if state.data_cdata}
                            
                            <table class="table clearfix mx-0" id="csv_data_table">
                                <tr>
                                    <th class="width80 text-center align-middle">
                                        <span class="d-inline-block p-0" data-bs-toggle="tooltip" data-bs-placement="top" title={((child_generated) ? l.child_not_generated: '')}>
                                            <input type="checkbox" name="checkall" rel="chk_1" class={"mr-3 mt-1 custom_checkbox_new float-left uc_checkbox checkall mng_track_checkbox mt-sm2 m-r" + ((child_generated) ? ' pointer_event_none': '')} disabled={child_generated}/>
                                            <span class="mr-2"><b class="font17">#</b></span>
                                        </span>
                                    </th>
                                    <th class="min_wid_95 width_max_content max_width_300 align-middle">
                                        <b class="font17">{state.data_cdata[0].c1}</b>
                                    </th>
                                    <th class="min_wid_95 width_max_content max_width_300 align-middle">
                                        <b class="font17">{state.data_cdata[0].c2}</b>
                                    </th>
                                    <th class="width65 text-center align-middle">
                                        <b class="font17">{l.action_txt}</b>
                                    </th>
                                </tr>
                                
                                    {#each state.data_cdata as object_data, index}
                                    
                                    
                                        {#if index > 0}
                                            <tr>
                                                <td class="width80 text-center align-middle">
                                                    <span class="d-inline-block p-0" data-bs-toggle="tooltip" title={((object_data.cg) ? '': l.child_not_generated)} data-bs-placement="right">
                                                        <input type="checkbox" class={"mr-2 mt-1 custom_checkbox_new float-left select_editable_guid"+ ((object_data.cg) ? '': ' pointer_event_none')} target-guid={object_data.cg} disabled={((object_data.cg) ? false: true)}/>
                                                        <div class="inline-block btn-secondary btn-circle rounded-circle width27 height27 font12 text-center p-1 btn-sm square">{((index < 10) ? '0' + index : index)}</div>
                                                    </span>
                                                </td>
                                                <td id={"col_" + index + "_" + 0} contentEditable="true" on:blur={handleEdit} class="min_wid_95 width_max_content max_width_300 word-wrap-break align-middle">{object_data.c1}</td>
                                                <td id={"col_" + index + "_" + 1} contentEditable="true" on:blur={handleEdit} class="min_wid_95 width_max_content max_width_300 word-wrap-break align-middle">{object_data.c2}</td>
                                                <td class="width65 text-center align-middle">
                                                    <span class="d-inline-block ml-2" data-bs-toggle="tooltip" data-bs-placement="top" title={((object_data.cg) ? l.deletion_not_allowed: l.del_row)}>
                                                        <button class={"btn" + ((object_data.cg) ? ' pointer_event_none': '')} name={"delete_elm" + index} id={"delete_elm" + index} on:click={()=>{handleDelete(index)}} disabled={((object_data.cg) ? true: false)}>
                                                            <span class="icomoon icomoon-24px-delete-1 s4"></span>
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        {/if}
                                    {/each}

                                
                            </table>
                            
                    {/if}
                    <button  data-bs-toggle="tooltip" data-bs-placement="top" title={l.add_child} class="btn btn-primary btn-md mt-2" name="Add_row" id="Add_row" on:click={addOption}>{l.add_option}</button>
                </div>
            </div>
        </div>
    </div>
    <!-- <EditorModal
        header={modal.header}
        body={modal.body}
        footer={modal.footer}
        fullWidth="true"
        maxWidth={modal.maxWidth}
        customFooter = {true}
        onUpdate={editorModalUpdate.bind(this)}
        handle={state.editorModalHandle}
    /> -->
    <!-- <Dialog
		bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}} style={'width:500px;'} >
            <div slot="title">{l.save_header}</div>
            <div>
                <div class="row">
                    <span class="col-md-12" style={'margin:40px;'}>{l.child_update}</span>
                </div>
            </div>
            <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));"> 
                <Button
                    variant="contained"
                    on:click={handleUpdate(row_no)}
                    class="text-white bg-primary"
                    style={'text-transform:none;float:right;margin:5px;'}
                >OK
                </Button>
            </div>
					
	</Dialog> -->

    <Dialog
					bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}}
					style={'width:500px;'}
				>
					<div style="font-weight:bold;">{l.save_header}</div>
					<div>
						<div class="row">
						<span class="col-md-12" style={'margin-top:40px;margin-bottom:40px;'}>{l.child_update}</span>
						</div>
					</div>
				

					<div slot="footer" class="svelteFooter">
						
						<input type="button" variant="contained" on:click={() => {state.EditorModalBox = false}} class="btn btn-light colorgray" value="No" />

						<Button variant="contained" on:click={()=>{handleUpdate(row_no)}}
							class="bg-primary text-white"> OK </Button>
					</div>
			
					
					
				</Dialog>







</div>

<style>
    .height20  {
        height: 20px !important;
    }
    .width125 {
        width: 125px;
    }
    .width80  {
        width: 80px;
    }
    .min_wid_95  {
        min-width:95px;
    }
    .width_max_content {
        width: max-content;
    }
    .font17 {
       font-size: 15px!important;
    }

    .custom_checkbox_new {
        display: block;
        position: relative;
        width: 20px;
        height: 20px;
        margin-bottom: 0;
        cursor: pointer;
        font-size: 18px;
    }
    .width27 {
        width: 27px;
    }

    .height27  {
        height: 27px !important;
    }
    .width65  {
        width: 65px;
    }

    td {
        text-align: center;
    }

</style>