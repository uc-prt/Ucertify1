<script>
    //import l from '../lib/Lang';
    import { onMount, onDestroy, beforeUpdate, afterUpdate, tick} from 'svelte';
    import {ucTree} from './treeviewHelper';
    import {AH, XMLToJSON, onUserAnsChange} from '../helper/HelperAI.svelte';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import { writable } from 'svelte/store';
    
    //import {jsTree} from './libs/jstree.min.js';
    export let isReview;
    export let xml;
    export let uaxml;
    export let editorState = false;
    export let showAns;
    let isRerender = 1;
    let booleanDelete = true;
    let treeid = 'treemain0',
    listItemCorrect = [],
    listItemAll = [];
    let icons = ["database-icon", "table-icon", "file-icon", "file-icon", "icomoon-new-24px-delete-1"];
            //let calcNodes 
            //let countInArray 
    let parsedXml = {};
    let timer = {};
    let state = {};
    const hdd = writable({
        xml: "",
        blank: false,
        remediationToggle: false,
        showCheckbox: 0,
        headingListCorrect: "",
        headingListAll: "",
        sort: "",
        options: "",
        parsedOptions: "",
        totalCorrectAns: 0,
        listItemAll: [],
        treeNodes: [],
        icons: "database-icon,table-icon,file-icon",
    });
    const unsubscribe = hdd.subscribe((items)=> state = items);
    $: if (isReview) {
        setReview();
    } else {
        unsetReview();
    }
    // Built-in method of react lifecycle and called just afetr render method once throughtout the program execution  
    onMount(async ()=> {
        setTimeout(function () {
            ucTree.readyThis('#' + treeid, state.parsedOptions);
            // Forces to re-render the component
            calcNodes(parsedXml.smxml.tree.__cdata);
        }, 1000);
        // used to initialized tree plugin and bind some required events that needed
        if (typeof inNative != "undefined") {
            // Used in Native for cut and copy functionality
            cutAndCopyFunctionality();
            // Used in Native for delete and paste functionality		
            deleteAndPasteFunctionality();
            // Used in Native for delete functionality
            deleteFunctionality();
        }

        AH.listen('body', 'keydown', '.jstree-clicked', (_this, event)=> {
            if (event.which === 13) {
                // Used for cut and copy the draggable element when it is performed via keyboard
                cutAndCopyFunctionality();
            }
        });

        AH.listen(document, 'keydown', '.vakata-context-hover', (_this, event)=> {
            if (event.which == 13 || event.keyCode == 13) {
                // clicked the selected option of the contextmenu
                AH.trigger(AH.find(_this, 'a'), 'click');
                setTimeout(function () {
                    let firstRow = AH.selectAll('#treemain0 .treeall .jstree-container-ul li')[0].querySelector('a');
                    if (firstRow) {
                        // used for focus the first row of the droppable area
                        firstRow.classList.add('jstree-hovered')
                        firstRow.focus();
                    }
                }, 200);
            }
        });

        AH.listen('body', 'keydown', '.jstree-clicked', (e)=> {
            if (e.which === 13) {
                //Used for delete and paste the draggable element when it is performed via keyboard
                deleteAndPasteFunctionality();
            }
        });

        AH.listen('body', 'keyup', '.treeall', (_this, event)=> {
            if (event.which == 13 || event.keyCode == 13) {
                // removes the class 'jstree-wholerow-clicked' that indicates selected row on Draggable area
                AH.find('.treecorrect', '.jstree-wholerow-clicked').classList.remove('jstree-wholerow-clicked');
                // removes the class 'jstree-clicked' that indicates selected Draggable element
                AH.find('.treecorrect', '.jstree-clicked').classList.remove('jstree-clicked');
            }
        });

        AH.listen('body', 'keydown', '.treeall', (_this, event)=> {
            if (event.which == 9 || event.keyCode == 9) {
                // used for remove the visibily of selection from draggable element on droppable area when 'tab' key pressed on droppable area
                AH.trigger(AH.find('.treeall', '.jstree-clicked'), 'click');
                // removes the class 'jstree-wholerow-clicked' and 'jstree-wholerow-hovered' that indicates selected row on Draggable area that was previously selected
                AH.selectAll('.treecorrect .jstree-wholerow-clicked', 'removeClass', ['jstree-wholerow-clicked','jstree-wholerow-hovered']);
                // removes the class 'jstree-clicked' and 'jstree-hovered' from draggable element that was previously selected and set the value 'false' of attribute 'aria-selected' of priviously selected row on draggable area
                AH.find('.treecorrect', '[aria-selected="true"]').setAttribute('aria-selected', false);
                AH.removeClass(AH.find('.treecorrect', '[aria-selected="true"]').querySelector('.jstree-clicked'), 'jstree-clicked jstree-hovered');
                // used for focus the first draggable element on draggable area using 'tab' key
                AH.trigger(AH.selectAll('.treecorrect li[role="treeitem"]', 'visible')[0].querySelector('.jstree-anchor'), 'click').focus();
                // removes the class 'jstree-wholerow-clicked' and add class 'jstree-wholerow-hovered' to the first row on Draggable area
                AH.find(AH.selectAll('.treecorrect li[role="treeitem"]', 'visible')[0], 'div', {action: 'addClass', actionData: 'jstree-wholerow-hovered'}).classList.remove('jstree-wholerow-clicked');
                // removes the class 'jstree-clicked' and add class 'jstree-hovered' from the first row of draggable element on draggable area
                AH.find(AH.selectAll('.treecorrect li[role="treeitem"]','visible')[0], '.jstree-anchor', {action:'addClass', actionData: 'jstree-hovered'})
                AH.find(AH.selectAll('.treecorrect li[role="treeitem"]','visible')[0], '.jstree-anchor', {action: 'removeClass', actionData: 'jstree-clicked'}).focus();
                // prevents the event from being bubbled
                event.preventDefault();
            }
        });

        AH.listen('body', 'keydown', '.treecorrect', (_this, event)=> {
            if (event.shiftKey && (event.which == 9 || event.keyCode == 9)) {
                // used for focus the first row on droppable area when 'shift' + 'tab' key pressed on draggable area
                AH.find(AH.selectAll('#treemain0 .treeall .jstree-container-ul li')[0], 'a', {action: 'addClass', actionData: 'jstree-hovered'}).focus();
                // prevents the event from being bubbled
                event.preventDefault();
            }
        });
        AH.listen('body', 'keydown', '.treeall .jstree-clicked',(_this, event)=> {
            if ((event.ctrlKey && event.altKey && (event.which == 68 || event.keyCode == 68))) {
                //Used for open the contextmenu when 'ctrl' + 'alt' + 'd' key pressed
                AH.trigger(_this, 'contextmenu');
            }
        });

        AH.setCss(".liItemIndex", {"font-size": "14px !important"});
        // used for mobile team
        if (window.inNative && window.inNative != undefined) {
            timer['pre_timer4'] = setTimeout(function () {
                window.postMessage(`height___${AI.select("#treemain0").clientHeight}`, '*'); // increases the height of react native outer container
                clearTimeout(timer['pre_timer4']);
            }, 2000);
        }
    });
    
    // Used to unmount the component, this is build in lifecycle method of react
    onDestroy(()=> {
        listItemCorrect = [], listItemAll = [];
        //AH.select('.reactStyle').remove();
    });
    
    // Called when props or state gets change
    beforeUpdate(async ()=> {
        console.log("beforeupdate");
        if (window.inNative && window.inNative != undefined) {
            timer['pre_timer6'] = setTimeout(function () {
                window.postMessage(`height___${AH.select("#treemain0").clientHeight}`, '*'); // increases the height of react native outer container
                clearTimeout(timer['pre_timer6']);
            }, 500);
        }
        // Checks that current props and previous props are same or not if not the render the component otherwise remains in idle state
        if (xml != state.xml) {
            state.blank = true;
            await tick();
            isRerender++;
            // For loading the module according to change the value of props 
            loadModule(xml, uaxml);
            console.log("Parsing completed");
        }
    });

    afterUpdate(()=> {
        if (parsedXml?.smxml?.tree?.__cdata) {

            // used to initialized tree plugin and bind some required events that needed
            ucTree.readyThis('#' + treeid, state.parsedOptions);
            // Forces to re-render the component
            calcNodes(parsedXml.smxml.tree.__cdata);
            
        }
    })
    
    // For cut and copy the Draggable element
    function cutAndCopyFunctionality() {
        AH.listenAll(".treecorrect li", 'touchend, keydown', (event)=> {
            handleCut(event);
        });
        if (window.inNative && window.inNative != undefined) {
            window.getHeight && window.getHeight();
        }
    }

    // For delete the draggable element from droppable area and paste the Draggable element on draggable container
    function deleteAndPasteFunctionality() {
        AH.listenAll(".treeall li", 'touchstart', ()=> {
            cmTime.s = new Date().getTime();
        });
        AH.selectAll(".treeall li", 'touchend, click', (event)=> {
            handlePaste(event, deleteAndPasteFunctionality);
        });
        AH.listenAll('.delete_button', 'touchend, keydown', (event)=> {
            if (booleanDelete) {
                // used for delete the draggable element from Droppable area to paste in Draggable area
                ucTree.handleDelete(event, deleteAndPasteFunctionality);
            }
        });
        if (window.inNative && window.inNative != undefined) {
            window.getHeight && window.getHeight();
        }
    }

    // It calls copyNode method if review mode is off and value of booleanDelete variable is true
    function handleCut(evt) {
        if (!window.reviewMode && booleanDelete) {
            // Used to copy the draggable element
            ucTree.copyNode(evt);
            booleanDelete = false;
        }
    }

    // It calls pasteNode method if review mode is off and value of booleanDelete variable is false
    function handlePaste(evt, handleDeleteCallback) {
        if (!window.reviewMode && !booleanDelete) {
            // Used to pase the Draggable element on Droppable area
            ucTree.pasteNode(evt, handleDeleteCallback);
            booleanDelete = true;
        }
        if (window.inNative && window.inNative != undefined) {
            window.getHeight && window.getHeight();
        }
    }
    
    // Used to disabled the activity to be performed when it is in review mode 
    function setReview() {
        ucTree.tempVar = 'c';
        isReview = true;
        if (timer['review']) clearTimeout(timer['review']);
            try {
                timer['review'] = setTimeout(function () {
                    if (AI.find('#' + treeid, '.treeall')) {
                        ucTree.treeInit('#' + treeid, state.parsedOptions);
                        if (editorState) {
                            showAns(ucTree?.checkedAns?.ans ? "Correct" : "Incorrect");
                        } else {
                            // Shows correct or incorrect according to the return value of ucTree.checkAns() method
                            let result = ucTree.checkAns('#' + treeid);
                            onUserAnsChange(result);
                            result && ucTree.showans(result.ans);
                        }
                        // shows the button of currect answer and your answer and check the answer and shows and does not allow the user to perform the task
                        ucTree.modeOn('on');
                    }
                }, 900);
            } catch (error) {
                console.log({ 'error': error });
            }
    }
    
    // Used to enabled the activity to be performed when it is not in review mode
    function unsetReview() {
        ucTree.tempVar = 'u'
        isReview = false;
        // hides the button of currect answer and your answer and allow the user to perform the task
        ucTree.modeOn();
        // Used for mobile native team
        if (typeof inNative != "undefined") {
            cutAndCopyFunctionality();
            deleteAndPasteFunctionality();
        }
    }
    
    // For loading the module according to change in props it calls parseXml method after converting the xml into json and passes into parseXml method in the form of argument
    function loadModule(loadXml, uaXML) {
        listItemCorrect = [], listItemAll = [];
        state.listItemAll = [];
        state.xml = xml;
        loadXml = XMLToJSON(loadXml);
        parseXml(loadXml, uaXML);
        state.blank = false;
    }

    // Used for parse the xml and assign the data into variables and states so according to these values UI changed
    function parseXml(QXML, userXML) {
        parsedXml = QXML;
        if (QXML.smxml.list) {
            QXML.smxml.tree = QXML.smxml.list;
        }

        (QXML.smxml.tree._headingCorrect) ? state.headingListCorrect = QXML.smxml.tree._headingCorrect : '';
        (QXML.smxml.tree._headingAll) ? state.headingListAll = QXML.smxml.tree._headingAll : '';
        (QXML.smxml.tree._headingcorrect) ? state.headingListCorrect = QXML.smxml.tree._headingcorrect : '';
        (QXML.smxml.tree._headingall) ? state.headingListAll = QXML.smxml.tree._headingall : '';
        (QXML.smxml.tree._sort) ? state.sort = QXML.smxml.tree._sort : '';
        (QXML.smxml.tree._options) ? state.options = QXML.smxml.tree._options : '';
        if (QXML.smxml.tree._icons) {
            state.icons = QXML.smxml.tree._icons;
            let new_icons = state.icons.split(',');
            icons = [new_icons[0], new_icons[1], new_icons[2], new_icons[2], "icomoon-new-24px-delete-1"];
        }
        
        // parses the options state value
        parseOptions(state.options);
        var listItem = QXML.smxml.tree.__cdata.trim().replace(/\t/gmi, '');
        listItem = listItem.split(/\n/gmi);
        // for set the data to draggable and non dragable elements
        setItemValueAll(listItem, userXML);
    }
    
    // assign the draggable elements label text to treeData state
    function calcNodes(treeData) {
        // replaces the non Draggable elements and # and data between curly braces including curly brace from draggable elements and last closing square bracket from cdata
        let countData = treeData.replace(/#{1,2}\w.*|\s|###\[/g, "").replace(/\[|\{.*?\}/g, "").replace(/\]$/g, "");
        // split with ']' retruns each draggable element's label text in an array
        countData = countData.split(']');
        // sorts the draggable element's label text in assending order
        countData.sort();
        // assign the draggable element's label text into treeData state
        state.treeData = countData;
        // calls delNodes
        delNodes();
    }
    
    // used to add or remove the 'h-imp' class from Draggable element
    function delNodes() {
        // contains all draggable elements that are dragged
        let allAssignedNodes = AH.find(".treeall", 'li[aria-level="2"]', 'all');
        // contains all draggable elements
        let allPresentNodes = AH.find(".treecorrect", 'li', 'all');
        for (let e of allPresentNodes) {
            // text of label of Draggable element
            let leafItem = AH.find(e, 'span').innerText;
            let leafCount = 0;
            for (let n of allAssignedNodes) {
                // checks if leafItem is equals to dragged elements label text then increase the leafCount value by 1
                if (AH.find(n, 'span').innerText == leafItem) {
                    ++leafCount;
                }
                // checks if Dragged element exist in Draggable elements array then assign the value to 1 otherwise 0 is applied
                let valInArray = countInArray(leafItem, state.treeData);
                // If leafCount equals to valInArray and valInArray is greater than 0 then adds 'h-imp' class to draggable elements in case of web not in mobile
                if (leafCount == valInArray && valInArray > 0 ) {
                    if (window.inNative && window.inNative != undefined) {
                        AH.select(e, 'hide');
                    } else {
                        // adds h-imp class to draggable element
                        AH.select(e, 'addClass', 'h-imp');
                        //e.className += " h-imp";
                    }

                } else {
                    if (window.inNative && window.inNative != undefined) {
                        e.style.display = "block";
                    } else {
                        // removes the 'h-imp' class from draggable element	
                        //e.className = e.className.replace(/h-imp/g, "");
                        AH.select(e, 'removeClass', 'h-imp');
                    }
                }
            }
        }
    }

    // checkes if dragged element belongs to any elements in draggable elements array then returns the count value according to match
    function countInArray(item, array) {
        let count = 0;
        for (let index_no = 0; index_no < array.length; ++index_no) {
            if (array[index_no] == item.replace(/\s/g, '')) {
                count += 1;
            }
        }
        return count;
    }

    // for set the data to draggable and non dragable elements
    function setItemValueAll(listItem, userXML) {
        let userDiv;
        let useransArray = [];
        if (userXML) {
            // assign the userXML json data to userXML variable
            userXML = XMLToJSON(userXML);
        }
        if (userXML) {
            if (userXML.smans) {
                if (userXML.smans.div) {
                    // assign the userXML.smans.div json data to userDiv variable
                    userDiv = userXML.smans.div
                    if (Array.isArray(userDiv)) {
                        for (let i = 0; i < userDiv.length; i++) {
                            // assign the 'userDiv[i]._uans' in useransArray at index 'userDiv[i]._id' 
                            useransArray[userDiv[i]._id] = userDiv[i]._uans;
                        }
                    } else {
                        // assign the 'userDiv._uans' in useransArray at index 'userDiv[i]._id'
                        useransArray[userDiv._id] = userDiv._uans;
                    }
                }
            }
        }
        var ID = 0,
            cans = '',
            countCorrect = 0;
        var parentId = [-1, 0];
        for (var i = 0; i < listItem.length; i++) {
            listItem[i] = listItem[i].trim();
            // assign the numeric data returned by getLevel method
            var level = getLevel(listItem[i]);
            listItem[i] = listItem[i].replace(/#/g, '');
            // assign the numeric data returned by getDragable method
            var isDragable = getDragable(listItem[i]);
            listItem[i] = listItem[i].replace(/\[|\]/g, '');
            // assign the numeric data returned by getParant method
            var isParant = getParant(listItem[i]);
            // replaces the starting data exists in {} including brackets or starting '*' character with blank
            listItem[i] = listItem[i].toString().trim().replace(/^{(.*?)}|^\*/gmi, '');
            if (isDragable) {
                // checks if any elements exist where draggable element can be drop
                if (listItemCorrect[ID - 1]) {
                    if (listItemCorrect[ID - 1]['level'] > 0 && listItemCorrect[ID - 1]['item'].length > 0) {
                        // assign the label value
                        level = listItemCorrect[ID - 1]['level'] + 1;
                    }
                }
                var oid = setOptions(listItem[i], 100 + i, level, isParant, ID - 1);
                if (isParant) {
                    cans = cans + isParant + oid + ",";
                } else {
                    cans = cans + oid + ",";
                }

                if (listItemCorrect[ID - 1]) {
                    if (listItemCorrect[ID - 1]['level'] > 0 && listItemCorrect[ID - 1]['item'].length > 0) {
                        // assign the correctAns value of non draggable element exist at index 'ID-1'
                        listItemCorrect[ID - 1]['correctAns'] = cans;
                    }
                }
                // increases the countCorrect value
                countCorrect++;
            } else {
                if (level > 0) {
                    cans = "";
                    listItemCorrect[ID] = [];
                    listItemCorrect[ID]['ID'] = ID;
                    listItemCorrect[ID]['item'] = listItem[i];
                    listItemCorrect[ID]['level'] = level;
                    listItemCorrect[ID]['parentId'] = parentId[level - 1];
                    listItemCorrect[ID]['isParant'] = isParant;
                    if (useransArray[ID]) {
                        // assign the 'useransArray[ID]' data in "listItemCorrect[ID]['userAns']"
                        listItemCorrect[ID]['userAns'] = useransArray[ID];
                    }
                    // assign the value of 'ID' in parentId array have key 'level'
                    parentId['level'] = ID;
                    // increases the ID value
                    ID++;
                }
            }
        }
        // assign the total correct answer in 'totalCorrectAns' variable
        state.totalCorrectAns = countCorrect;
        if (state.sort == 1) {
            // Sort the available Draggable element
            multi_array_sort();
        } else {
            // asign the draggable elements after suffle it
            listItemAll = shuffle(listItemAll);
        }
        state.listItemAll = listItemAll;
    }

    // parses the options attributes values for context menu
    function parseOptions(options) {
        if (window.inNative && window.inNative != undefined) return;
        // checks if contextmenu list options are given then split it with comma (,)
        options = (options) ? options.split(',') : '';
        let json = {};
        if (options) {
            for (let index_no in options) {
                // split the option with '|'
                let v = options[index_no].trim().split("|");
                let tmp = [];
                // if v.length is 3 then assigns data in temporary array
                if (v.length == 3) {
                    tmp['seq'] = v[0];
                    tmp['label'] = v[1];
                    tmp['icon'] = v[2];
                    tmp['action'] = "contextAction";
                }
                // temporary array converts into object and assign it to contextmenu list json
                json['opt' + index_no] = AH.extend({}, tmp);
            }
        }
        // sets Default label at the second last position of contextmenu list
        json['opt' + Object.keys(json).length] = {
            "seq": 0,
            "label": "Default",
            "icon": icons[2],
            "action": "contextAction"
        };
        // sets Delete label at the end of contextmenu list
        json['opt' + Object.keys(json).length] = {
            "label": "Delete",
            "icon": icons[4],
            "action": "deleteList"
        };
        // Parses the Json data into string using JSON.stringify() method and then parses string into JSON format using JSON.parse() method
        var jsonData = JSON.parse(JSON.stringify(json));
        Object.values(jsonData).forEach((item)=> {
            if (item.action == 'contextAction') {
                item.action = ucTree.contextAction;
            } else if (item.action == 'deleteList') {
                item.action = ucTree.deleteList;
            }
        });
        state.parsedOptions = jsonData;
    }
    
    // Sort the available Draggable element
    function multi_array_sort() {
        listItemAll.sort(function (a, b) {
            if (a.item === b.item) {
                return (b.ID - a.ID);
            } else if (a.item > b.item) {
                return 1;
            } else if (a.item < b.item) {
                return -1;
            }
        });
    }
    
    // returns the icon from icons array for contextmenu
    function getIcon(level) {
        if (level == 0) {
            level = 4;
        }
        return icons[level - 1];
    }
    
    // returns the length of # in perticular string
    function getLevel(str) {
        var level = str.match(/#/gmi);
        if (level) {
            return level.length;
        }
        return 0;
    }

    // Suffles the draggable elements on draggable container
    function shuffle(aelement) {
        for (let i = aelement.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [aelement[i - 1], aelement[j]] = [aelement[j], aelement[i - 1]];
        }
        return aelement;
    }

    // Returns 1 or 0 to indicate that it is draggable or not 1 for true and 0 for false
    function getDragable(str) {
        if (str.substr(0, 1) == '[' && str.substr(str.length - 1) == ']') {
            return 1;
        }
        return 0;
    }
    
    // returns 0, * or data between curly brace including both opening and closing such as {2}. If return value is not equals to 0 then parent and all its children have same icon
    function getParant(str) {
        str = str.trim();
        var parant = 0;
        if (str.substr(0, 1) == "*") {
            state.showCheckbox = 1 ;
            parant = '*';
        } else if (str.substr(0, 1) == "{" && str.substr(2, 1) == "}") {
            parant = str.substr(0, 3);
        }
        return parant;
    }

    // returns the numeric data according to matching the data of passed arguments when called it with the data of array 'listItemAll' have index 'i' of key 'item'
    function setOptions(optionName, ID, level, isParant, pID) {
        var totalItem = listItemAll.length;
        for (var i = 0; i < totalItem; i++) {
            if (listItemAll[i]['isParant'] == '{1}') {
                // set not to drag draggable element multiple time for creating the tree below droppable container
                listItemAll[i]['multi'] = 0;
            } else {
                // set to drag draggable element multiple time for creating the tree below droppable container
                listItemAll[i]['multi'] = 1;
            }
            if (listItemAll[i]['item'].length > 0 && listItemAll[i]['item'].toLowerCase() == optionName.toLowerCase()) {
                if (listItemAll[i]['isParant'].toString().indexOf("|") === false) {
                    // sets the value of isParant key of listItemAll[i] array
                    listItemAll[i]['isParant'] = listItemAll[i]['isParant'] + '|' + listItemAll[i]['pID'];
                }
                // sets the value of isParant key of listItemAll[i] array
                listItemAll[i]['isParant'] = listItemAll[i]['isParant'] + ',' + isParant + '|' + pID;
                // returns value of listItemAll[i]['ID']
                return listItemAll[i]['ID'];
            }
        }
        // create a variable with index length of array listItemAll and assign the data to it
        listItemAll[totalItem] = [];
        listItemAll[totalItem]['item'] = optionName;
        listItemAll[totalItem]['ID'] = ID;
        listItemAll[totalItem]['level'] = level;
        listItemAll[totalItem]['pID'] = pID;
        listItemAll[totalItem]['isParant'] = isParant;
        return ID;
    }
    
        // used for handle the UI of preview component according to change in state or props
    </script> 
    <svelte:head>
        <link rel="stylesheet" href="{window.themeUrl}pe-items/clsSMTree/libs/treeview.min.css" />
        <link rel="stylesheet" href={window.editor.baseUrlTheme + "pe-items/css/jstree/style.min.css"} />
    </svelte:head>
    <main>
        {#if state.blank}
            <div></div>
        {:else}
            <div>
                <ItemHelper 
                    on:setReview = {setReview}
                    on:unsetReview = {unsetReview}
                    handleReviewClick={(mode)=> ucTree.showans('#treemain0', mode)}
                    reviewMode={isReview}
                />
                <button type="button" on:click={delNodes} class="h h-imp" style="display: none" id="delNodes"></button>
                <center>
                    <div id="treemain0" data-totalCorrectAns={state.totalCorrectAns} class="treemain">
                        {#if !window.inNative}
                            <div class="row-fluid">
                                <div class="span6">
                                    <div class="heading">{state.headingListCorrect}</div>
                                </div>
                                <div class="span6">
                                    <div class="heading">{state.headingListAll}</div>
                                </div>
                            </div>
                        {/if}
                        <div class="row-fluid tree">
                            {#if (window.inNative && window.inNative != undefined)}
                                <div class="heading">{state.headingListCorrect}</div>
                            {/if}
                            <div class="span6 treeall" data-showcheckbox={state.showCheckbox}>
                                <ul id="testme">
                                    {#each listItemCorrect as _listItemCorrect}
                                        {#if _listItemCorrect.item.length > 0}
                                            {#if (window.inNative && window.inNative != undefined)} 
                                                <li 
                                                    class='liItemIndex' 
                                                    tid={_listItemCorrect.ID} 
                                                    correctans={_listItemCorrect.correctAns} 
                                                    userans={_listItemCorrect.userAns} 
                                                    data-jstree={JSON.stringify({opened: true, selected: (_listItemCorrect.isParant ? true : false)})}
                                                >
                                                    {_listItemCorrect.item}
                                                </li>
                                            {:else}
                                                <li 
                                                    key="treeC_{isRerender}_{_listItemCorrect.ID}"
                                                    class='liItemIndex' 
                                                    tid={_listItemCorrect.ID} 
                                                    correctans={_listItemCorrect.correctAns} 
                                                    userans={_listItemCorrect.userAns} 
                                                    data-jstree={JSON.stringify({opened: true, selected: (_listItemCorrect.isParant ? true : false), icon: getIcon(_listItemCorrect['level'])})}
                                                >
                                                    {_listItemCorrect.item}
                                                </li> 
                                                
                                            {/if}
                                        {/if}
                                    {/each}
                                </ul>
                            </div>
    
                            {#if (AH.isValid(window.inNative))}
                                <div class="heading" id="headingTwo">{state.headingListAll}</div>
                            {/if}
                            <div id="test" class={AH.isValid(window.inNative) ? "w-100" : "treecorrect_outer"}>
                                <div class="span6 treecorrect" style= "width: 100%">
                                    <ul>
                                        {#each state.listItemAll as data, i}
                                            <li 
                                                key="trreAll_{isRerender}_{i}" 
                                                class="liItemIndex"  
                                                tid={data.ID} 
                                                seq={data.isParant.toString().replace(/,\s|{|}/gmi, '')} 
                                                multi={data.multi} 
                                                data-jstree={JSON.stringify({icon: getIcon(data.level)})}
                                            >
                                                <span class="data_style">{data.item}</span>
                                                <span class="delete_button"></span>
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </center>
            </div>
        {/if}
    </main>