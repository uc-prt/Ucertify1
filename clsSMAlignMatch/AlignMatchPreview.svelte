<!--
 *  File Name   : AlignMatchPreview.svelte
 *  Description : Container for AlignMatch preview Module
 *  Author      : Rashmi Kumari
 *  Package     : svelte_items
 *  Last update : 05-Jan-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
    import { onMount, beforeUpdate, afterUpdate } from "svelte";
    import { XMLToJSON, AH, onUserAnsChange} from '../helper/HelperAI.svelte';
    import ItemHelper from '../helper/ItemHelper.svelte';
    import ShowAnswer from './showAnswer.svelte';
    import l from '../src/libs/editorLib/language';
    import './css/alignmatch.min.css';
    
    export let xml;
    export let uxml;
    export let showAns;
    export let isReview;
    export let updateCSV;
    export let editorState;
    let customIsReview = isReview;
    const CORRECT = 2,
        INCORRECT = 0;
    let jsonData = {},
        state = {
            // contains xml
            xml: "",
            // not used
            content: "",
            // not used
            settings: "",
            // shows the remediation status
            remediationState: false,
            // allowed to perform the task
            gameStatus: false,
            // used for set the match container width
            maxWidth: "",
            // contains user answer performed
            userAnswerArr: [],
            // used to set the height of the categories item container
            imgHeight: "",
            // not used
            idCheck: 0,
            correct_match: []
        }
    // contains userXML
    let userXML = {};
    let windowwidth;
    let targetView      = "none";
    let isAnswerCorrect = []; //used for coloring of individual row(true: green row, false: red row)
    let blnAllAttempted = false; //used to check if all the questions are attempted and correct atleast once, if firstTime correct then accidently incorrect, it doesn't matter. At least once correct.
    let correctAnswerArray = []; //stores correct Answer tagWise
    let obj = [], tmpArr = [], noOfQuestions;
    // contains correct attemped by user
    let ignoreItemIdKeys =  [];
    // contains the items id which not exist in 'correctAnswerArray' array
    let ignoreItemIds = [];
    onMount(() => {	
        state.xml = xml;
        state.uxml = uxml;
        if (state.uxml == '<smans type="35"></smans>' || state.uxml == '<SMANS></SMANS>') {
            // sets the user answer xml value blank if task not performed by user
            state.uxml = '';
        }
        /* @saquib:Added this condition due to usexml break*/
        if (state.uxml && state.uxml.includes("&useransxml=")) {
            // replaces the string '&useransxml=' to blank of user answer xml 
            let replacedVal = state.uxml.replace("&useransxml=", "");
            // re-set the value of user answer xml after remove the string '&useransxml='
            state.uxml = replacedVal;
        }
        loadModule(xml);
        if (editorState && editorState.isCSV) {
            // updates the value of props isCSV
            updateElements('csv'); // update elements
        }
    });

    beforeUpdate(() => {
        loadModule(xml);
    });

    afterUpdate(() => {
        if (ignoreItemIdKeys.length > 0) {
            if (!blnAllAttempted) {
                ignoreItemIdKeys.forEach( (i, id) => {
                    // contains the value of key 'tags' of item have id equals to the value of variable 'id'
                    let tag = obj[id].tags;
                    correctAnswerArray[tag].slice(1).forEach( (i, val) => {
                        // contains the items id which not exist in 'correctAnswerArray' array
                        ignoreItemIds.push(val.id);
                    });
                });
            }
        }
    });
    
    $: {        
		if (isReview) {
            targetView = "block";
            setReview();
		} else {
            targetView = "none";
            unsetReview();
            updateElements();
        }
	}

    // loads the module according to the value of question xml and user xml
    function loadModule(loadXml) {
        reverseToInitial();
        // contains json data of xml
        loadXml = XMLToJSON(loadXml);
        // updates the xml after parsing the xml and shows answer
        parseXMLPreview(loadXml);
        // update the image after trigger the loaded event
        updateImage();
    }

    // update the image after trigger the loaded event
    function updateImage() {
        AH.selectAll(".elementContainer").forEach(function () {
            // it is category selector
            let element_id = this;
            AH.find(element_id, 'img', 'all').forEach(function (j, val) {
                // contains index of the category
                let id = AH.select(val).getAttribute('data-check');
                // removes the value of height from item container that exist inside current category
                AH.select('.categoryitemcontainer_' + id).height = '';
                // removes the value of height from previous button that exist inside current category
                AH.select('.prevbutton_' + id).height = '';
                // removes the value of height from next button that exist inside current category
                AH.select('.nextbutton_' + id).height = '';
                // fired the load event to the element equals the value of variable 'val'
                AH.select(val).trigger("load");
            });
        });
    }

    // updates the xml after parsing the xml and shows answer
    function parseXMLPreview(MYXML) {
        // sets the value of state maxWidth
        state.maxWidth = ((MYXML.smxml._maxwidth) ? MYXML.smxml._maxwidth : 800);
        // contains the value of cdata
        jsonData = JSON.parse(MYXML.smxml.__cdata);
        // creates temporary array obj & temporary array tmpArr
        jsonData.item.items.forEach(function (item) {
            // contains data of array key 'items' defined at index equals to the value of variable 'key' 
            obj[item.id] = item;
        });
        // contains no of question exist
        noOfQuestions = jsonData.item.items.length / jsonData.category.categories.length;
        correctAnswerArray = [];
        state.correct_match = [];
        jsonData.item.items.forEach(function (value, seq) {
            if (correctAnswerArray[value.tags] == null) {
                // makes value blank at index equals to the value of key 'tags' of object defined in variable 'value' of array correctAnswerArray
                correctAnswerArray[value.tags] = [];
                // makes value blank at index equals to the value of key 'tags' of object defined in variable 'value' of array tmpArr
                tmpArr[value.tags] = [];
            }
            correctAnswerArray[value.tags].push(value);
            // pushes the object defined in variable 'value' into array defined at index equals to the value of key 'tags' of object defined in variable 'value'
            tmpArr[value.tags].push(value);
            state.correct_match['category_' + seq] = false;
            value.sequence = seq;
        });
        // used to check that user answer value is defined in array tmpArr or not
        let tmpArrDone = false;
        if (xml != undefined && (state.uxml != '' && state.uxml != undefined)) {
            // contains json data of user answer xml
            userXML = JSON.parse(state.uxml);
            // shows the answer (Correct/Incorrect)
            displayAnswer();
            // destruct the array have value equals to the value of key 'correct_attempt' of userXML object
            Object.keys(userXML.items).forEach((itemArr) => {
                if (userXML.items[itemArr].slice(-1)[0] == 2) {
                    // sets the value 'true' at index equals to the value of variable 'itemKey' of array isAnswerCorrect
                    isAnswerCorrect[itemArr] = true;
                }
            });
            // contains true if attemped question equals to the no of exist question otherwise contains false
            blnAllAttempted = (userXML.correct_attempt.length === noOfQuestions);
            if (blnAllAttempted) {
                // apply the opacity '0.7' and cursor style 'not-allowed' and adds class complete to the Match container
                AH.selectAll('.alignTestarea', 'addClass', 'complete');
                AH.setCss(".categorycontainer", {'opacity': '0.7','cursor': 'not-allowed'});
                // disabled the 'Match' button
                AH.select('.matchbutton').disabled = true;
            }
            // returns enumerable properties of a simple array.
            let firstRowIds = Object.keys(userXML.items);
            // checks for blank question exist or not
            let blnQueExists;
            for (let i in tmpArr) {
                for (let j in tmpArr[i]) {
                    if (j == 0) {
                        // defines the value true or false according to the matched condition
                        blnQueExists = firstRowIds.indexOf(tmpArr[i][j].id) > -1;
                    } else if (!blnQueExists) {
                        // sets the value of multi-dimention array tmpArr at row equals to the value of variable 'i' and column equals to the value of variable 'j'
                        tmpArr[i][j] = {
                            // defines the value blank of key 'imageurl'
                            imageurl: '',
                            // defines the value 'Unattempted' of key 'label' 
                            label: 'Unattempted'
                        }
                    } else if (blnQueExists) {
                        // contains value of item id from the value of 'id' key defined at row equals to the value of variable 'i' and column 0 of multi-dimention array 'tmpArr' 
                        let queId = tmpArr[i][0].id;
                        // contains the value defined at row equals to the value of variable 'queId' and column equals to the value of variable 'j' - 1
                        let _uXmlAnsItem = userXML.items[queId][j - 1];
                        // sets the value of multi-dimention array tmpArr at row equals to the value of variable 'i' and column equals to the value of 'j' to the value of key equals to the value of variable '_uXmlAnsItem' of object obj
                        tmpArr[i][j] = obj[_uXmlAnsItem];
                    }
                }
            }
            // sets the value 'true' of variable 'tmpArrDone'  to show that user answer value is defined in tmpArr array
            tmpArrDone = true;
        }

        if (!tmpArrDone) {
            for (let i in tmpArr) {
                for (let j in tmpArr[i]) {
                    if (j > 0) {
                        // sets the value of multi-dimention array tmpArr at row equals to the value of variable 'i' and column equals to the value of variable 'j'
                        tmpArr[i][j] = {
                            imageurl: '',
                            imagealt: '',
                            label: 'Unattempted'
                        }
                    }
                }
            }
        }

        // sets the value of state userAnswerArr
        state.userAnswerArr = tmpArr;
        // sets the value of state xml
        state.xml = jsonData;
        // allow to start the game
        beginGame();
    }

    // shows the answer (Correct/Incorrect)
    function displayAnswer() {
        // contains true or false according to match the condition
        let blnAllCorrect = (userXML.answer && userXML.answer == CORRECT);
        // shows correct or incorrect according to the value of variable 'blnAllCorrect'
        if(editorState)  {
            showAns(blnAllCorrect ? 'Correct' : 'Incorrect');
        } else {
            AH.select("#answer").checked = blnAllCorrect;
            if (!editorState && state.uxml && state.uxml != '') {
                let blnAllCorrectStatus = blnAllCorrect ? true : false; 
                onUserAnsChange({uXml: state.uxml, ans: blnAllCorrectStatus});
            }
        }
    }

    // return an array that contains the value of that properties which are the own properties of object not inherited properties which is passed in argument at the time of function calling 
    function objectValues(obj) {
        let res = [];
        for (let index in obj) {
            if (obj.hasOwnProperty(index)) {
                // pushes the value of key that is equals to the value of variable 'index' of object 'obj'
                res.push(obj[index]);
            }
        }
        // not clear what does it work
        window.prettifyContent && prettifyContent({
            imgAltText: 1,
            container: ['#alignmatch-table']
        });
        // returns the array res
        return res;
    }

    // sets the height of next, previous buttons and also of category item container
    function onImgLoad(event) {
        // contains the index of the category in which this image lies
        let id = event.target.getAttribute('data-check');
        // contains the height of the item container including keyword 'px'
        let containerHeight = AH.select('.categoryitemcontainer_' + id).style.height;
        // contains the value after reducing 11 from the value of height 
        let elementContainerHeight = containerHeight.substr(0, containerHeight.indexOf("p")) - 11;
        // contains real height of the image
        let height = event.target.naturalHeight;
        if (elementContainerHeight != '' && elementContainerHeight != null && !isNaN(elementContainerHeight)) {
            if (elementContainerHeight <= height) {
                // sets the value of state 'height'
                state.imgHeight = height;
                // used to set the height of item container and of next, previous buttons
                updateColumnHeight(state.imgHeight, id);
            }
        } else {
            // sets the value of state 'height'
            state.imgHeight = height;
            // used to set the height of item container and of next, previous buttons
            updateColumnHeight(state.imgHeight, id);
        }
    }

    // used to set the height of item container and of next, previous buttons
    function updateColumnHeight(height, index) {
        // sets the height of item container of category have index defined in variable 'index'
        AH.select('.categoryitemcontainer_' + index).style.height = (height + 11) + "px";
        // sets the height of item previous button of category have index defined in variable 'index'
        AH.select('.prevbutton_' + index).style.height = (height + 50) + "px";
        // sets the height of item next button of category have index defined in variable 'index'
        AH.select('.nextbutton_' + index).style.height = (height + 50) + "px";
    }

    // shows the item randomly after click on next or previous button and in case of csv it updates the value of props isCSV
    function updateElements(action) {
        setTimeout(function () {
            AH.selectAll(".categoryinnercontainer ", 'all').forEach(function (container, i) {
                AH.find(container, '.element', 'all').forEach(function (val, k) {
                    // sets unique id attribute of each items lies in same category
                    val.setAttribute('id', 'element_' + (k + 1));
                    val.style.display = 'none';
                });
                // contains number of questions exist
                let eleLen = AH.find(container, '.element', 'all').length;
                // contains the random number that cab be 1 to value of variable 'eleLen'
                let toShow = Math.floor(Math.random() * eleLen) + 1;
                // shows the item have id 'element_' + value of the variable 'toShow' inside the category at index equals to the value of variable 'key'
                AH.select('.categoryitemcontainer_'+ i + ' #element_' + toShow).style.display = '';
            });
        }, 200);

        if (action == 'csv') {
            setTimeout(function () {
                // sets the value 'false' of prop isCSV 
                updateCSV('csv', false);
                console.log("csv Updated");
            }, 1200);
        }
    }

    // allow to start the game
    function beginGame() {
        setTimeout(function () {
            if (!blnAllAttempted) {
                // sets the value 'true' of state gameStatus that allow to perform the task
                state.gameStatus = true
            }
        }, 200);
    }

    // sets the value 'false' of state gameStatus
    function reverseToInitial() {
        state.gameStatus = false;
    }

    // For ADA
    function keydownAda(event) {
        if (event.which === 13) {
            // click the textarea element or image upload icon on which keydown
            this.click();
        }
    }

    function prevbutton() {
        if (!blnAllAttempted) {
            // selects next sibling item that have class 'categoryinnercontainer'
            let categoryinnercontainer = AH.nextElm(this, '.categoryinnercontainer');
            // selects items that is visible in that category which previous button clicked
            let catInnerImg;
            AH.find(categoryinnercontainer, '.categoryitemcontainer .categoryiteminnercontainer .element', 'all').forEach(function (i) {
                if(getComputedStyle(i, null).display == 'table-cell') {
                    catInnerImg = i;
                }
            });
            if (catInnerImg && AH.prevElm(catInnerImg)) {
                // shows previous sibling item and hides current item of that category whicn previous button clicked 
                AH.prevElm(catInnerImg).style.display = '';
                AH.nextElm(AH.prevElm(catInnerImg)).style.display = 'none';
            } else {
                // hides the currently visible item that exist in that category which previous button clicked
                if (catInnerImg) {
                    catInnerImg.style.display = 'none';
                }
                // hides all items inside that category which previous button clicked and shows the last item
                AH.find(categoryinnercontainer, '.categoryitemcontainer .categoryiteminnercontainer .element').style.display = 'none';
                AH.find(categoryinnercontainer, '.categoryitemcontainer .categoryiteminnercontainer .element:last-child').style.display = '';
            }
            return false;
        }
    }

    function nextbutton() {
        if (!blnAllAttempted) {
            // selects previous sibling item that have class 'categoryinnercontainer'
            let categoryinnercontainer = AH.prevElm(this, '.categoryinnercontainer');
            let catInnerImg;
            // selects items that is visible in that category which next button clicked
            AH.find(categoryinnercontainer, '.categoryitemcontainer .categoryiteminnercontainer .element', 'all').forEach(function (i) {
                if(getComputedStyle(i, null).display == 'table-cell') {
                    catInnerImg = i;
                }
            });
            if (catInnerImg && AH.nextElm(catInnerImg)) {
                // shows next sibling item and hides current item of that category whicn next button clicked 
                AH.nextElm(catInnerImg).style.display = '';
                AH.prevElm(AH.nextElm(catInnerImg)).style.display = 'none';
            } else {
                // hides the currently visible item that exist in that category which next button clicked
                if (catInnerImg) {
                    catInnerImg.style.display = 'none';
                }
                // hides all items inside that category which next button clicked and shows the first item
                AH.find(categoryinnercontainer, '.categoryitemcontainer .categoryiteminnercontainer .element').style.display = 'none';
                AH.find(categoryinnercontainer, '.categoryitemcontainer .categoryiteminnercontainer .element:first-child').style.display = '';
            }
            return false;
        }
    }

    function setReview() {
        //@Prabhat: this was throwing so commenting this line.https://www.screencast.com/t/UMeRnIsZmH
        // isReview = true;
        customIsReview = true;
        targetView = "block";
        setTimeout(function() {
            AH.selectAll('.your_ans_td:first-child').forEach((tdval) => {
                let td_id = tdval.getAttribute('col');
                if(isAnswerCorrect[td_id]) {
                    AH.parent(tdval).classList.add('typeCorrect');
                } else {
                    AH.parent(tdval).classList.add('typeIncorrect');
                }
            });
        }, 100);
        // shows the answer (Correct/Incorrect)
        displayAnswer();
    }

    function unsetReview() {
        targetView = "none";
        isReview = false;
        customIsReview = false;
    }

    function matchButton() {
        if (!blnAllAttempted) {
            // selects the closest element that have class 'alignTestarea' when click on match button
            let alignTestarea = this.closest('.alignTestarea');
            // selects the visible items inside container category
            let visibleEle = [];
            AH.find(alignTestarea, '.categorycontainer .categoryinnercontainer .categoryitemcontainer .categoryiteminnercontainer .element', 'all').forEach(function(val) {
                if(getComputedStyle(val, null).display == 'table-cell') {
                    visibleEle = [...visibleEle, val];
                }
            });
            let tagName, firstTagName;
            let blnCorrect = null;
            let currentItem = null;
            let mainKey = null;
            visibleEle.forEach(function (value, key) {
                // contains the value of 'data-tags' attribute of element defined in variable 'value'
                tagName = value.getAttribute('data-tags');
                // used for contain the item value
                let itemValue;
                if (key == 0) {
                    // sets the value of variable 'tagName' to variable 'firstTagName'
                    firstTagName = tagName;
                }
                if (AH.find(value, 'img')) {
                    // contains value of src attribute of img tag exist inside the element defined in variable 'value'
                    itemValue = AH.find(value, 'img').getAttribute('src');
                } else {
                    // contains text of div element exist inside the element defined in variable 'value'
                        
                    itemValue = '';
                    if(AH.find(value, 'div') != null) { 
                        itemValue = AH.find(value, 'div').textContent;
                    }
                }
                /**userXML generation start*/
                // contains all the items available
                let items = state.xml.item.items;
                //changed to for in loop
                for (let i in items) {
                    // contains value exist at index 'i' of array 'items'
                    let qxmlItem = items[i];
                    if (qxmlItem.tags == tagName) {
                        // contains image src or text according to the value of key 'imageurl' of object qxmlItem
                        let valueOfItem = ((qxmlItem.imageurl) ? '//s3.amazonaws.com/jigyaasa_content_static//' + qxmlItem.imageurl : qxmlItem.label);
                        if (valueOfItem == itemValue) {
                            // contains object qxmlItem
                            currentItem = qxmlItem;
                            break;
                        }
                    }
                }

                if (userXML.items == null) {
                    // defines empty object into the value of items key of object userXML
                    userXML.items = {};
                }

                if (key == 0) {
                    // sets value equals to the value of variable tagName of variable 'blnCorrect'
                    blnCorrect = tagName;
                    // contains the value of key 'id' of object 'currentItem'
                    mainKey = currentItem.id;
                    // assign blank array at the key have value equals to the value of variable 'mainKey' of key 'items' of object userXML
                    userXML.items[mainKey] = [];
                } else {
                    if (tagName != blnCorrect) {
                        // sets value 'null' of variable 'blnCorrect'
                        blnCorrect = null;
                    }
                    // pushes the value 'id' key of object currentItem into array defined at key equals to the value of variable 'mainKey'
                    userXML.items[mainKey].push(currentItem.id);
                    // defines the object that have key 'imageurl' and 'label' into state object userAnswerArr where array key is equals to the value of variable 'firstTagName' and index is equals to the value of variable 'key' image url and
                    state.userAnswerArr[firstTagName][key] = {
                        imageurl: currentItem.imageurl,
                        label: currentItem.label
                    }
                }
                /**userXML generation end */
            });
            // defines the value of variable 'wrongAnswer'
            let wrongAnswer = (blnCorrect == null);
            // pushes the value 'CORRECT/INCORRECT' according to the value of variable 'wrongAnswer' into array key 'items' of object userXML
            userXML.items[mainKey].push(wrongAnswer ? INCORRECT : CORRECT);

            /**storing only the ids of questions that are attempted and correct as least once.
                ***SECTION START */
            userXML.correct_attempt = userXML.correct_attempt || [];
            if (!wrongAnswer && userXML.correct_attempt.indexOf(mainKey) == -1) {
                // pushes the value of variable 'mainKey' into array key 'correct_attempt' of object userXML
                userXML.correct_attempt.push(mainKey);
            }
            /**SECTION END */
            // update the value of array isAnswerCorrect have key equals to the value of variable 'mainKey'
            isAnswerCorrect[mainKey] = !wrongAnswer;
            // sets the value of state 'userAnswerArr'
            state.userAnswerArr = state.userAnswerArr;
            // defines the variable 'correctCount'
            let correctCount = 0;
            for (let item in userXML.items) {
                // contains array defined at key equals to the value of variable 'item' in array key 'items' of object userXML
                let itemArr = userXML.items[item];
                if (itemArr.slice(-1)[0] === CORRECT) {
                    // increases the value of variable 'correctCount' by 1
                    correctCount += 1;
                }
            }
            // finds total no of question exist
            let totalcount = AH.selectAll(".categoryiteminnercontainer:first-child .elementContainer .element").length;
            if (typeof calculatePoint != "undefined") {
                // sets the value of variable 'totalcount' to the input element have id 'answer_points' and type hidden and value of the variable 'correctCount' to the input element have id 'user_points' and type hidden
                calculatePoint(totalcount, correctCount);
            }
            // by default sets INCORRECT value of the key 'answer' of userXML object
            userXML.answer = INCORRECT;
            if (noOfQuestions === correctCount) {
                // sets CORRECT value of the key 'answer' of userXML object
                userXML.answer = CORRECT;
            }
            // contains true if attemped question equals to the no of exist question otherwise contains false
            blnAllAttempted = (userXML.correct_attempt.length === noOfQuestions);
            if (!wrongAnswer) {
                // enables reset button if any matching made correct
                AH.select('#reset_btn').disabled = false;
                AH.selectAll(".categoryinnercontainer ", 'all').forEach(function (container, i) {
                    if (AH.find(container, '.element', 'all').length > 1) {
                        AH.find(container, '.element', 'all').forEach(function (val) {
                            // removes the visible element have class 'element' inside the category defined at index equals to the value of variable 'key'
                            if(getComputedStyle(val, null).display == 'table-cell') {
                                state.correct_match[val.getAttribute('seq_no')] = true;
                            }
                        });
                        setTimeout(function() {
                            AH.find(container, '.element', 'all').forEach(function (val, k) {
                                // sets unique id attribute of each items lies in same category
                                val.setAttribute('id', 'element_' + (k + 1));
                                val.style.display = 'none';
                            });
                            // contains number of questions exist
                            let eleLen = AH.find(container, '.element', 'all').length;
                            // contains the random number that cab be 1 to value of variable 'eleLen'
                            let toShow = Math.floor(Math.random() * eleLen) + 1;
                            // shows the item have id 'element_' + value of the variable 'toShow' inside the category at index equals to the value of variable 'key'
                            AH.select('.categoryitemcontainer_'+ i + ' #element_' + toShow).style.display = '';
                        }, 100);
                    } else {
                        // apply the opacity '0.7' and cursor style 'not-allowed' and adds class complete to the Match container
                        AH.setCss(".categorycontainer", {'opacity': '0.7','cursor': 'not-allowed'});
                        AH.selectAll('.categorycontainer', 'addClass', "complete")
                        // not allowed click on previous and next button 
                        AH.setCss(".nextbutton", {'pointer-events': 'none'});
                        AH.setCss(".prevbutton", {'pointer-events': 'none'});
                        // disabled the 'Match' button
                        AH.select('.matchbutton').disabled = true;
                        // shows game completion message
                        AH.showmsg("Game Completed!!",3000);
                        // shows the answer (Correct/Incorrect)
                        displayAnswer();
                    }
                });
            } else {
                // apply shake effect for transition just like as slide
                if (AH.select(".categorycontainer ").classList.contains("wrong_ans")) {
                    AH.selectAll('.categorycontainer', 'removeClass', "wrong_ans");
                }
                setTimeout(function() {
                    AH.selectAll('.categorycontainer', 'addClass', "wrong_ans");
                }, 100)
                // shows the warning message
                AH.showmsg("Please match all the items correctly.",3000);
            }
            // allow to start the game
            beginGame();
            // tells that user xml changed
            ISSPECIALMODULEUSERXMLCHANGE = 1;
            // update the user answer xml
            state.uxml = JSON.stringify(userXML);
            AH.select("#special_module_user_xml").value = JSON.stringify(userXML);
            //AH.selectAll('.yourAnswer .remedcolumn td:first-child')
        }
    }

    function resetButton() {
        // makes user answer xml value blank
        userXML = {};
        isAnswerCorrect = []; //used for coloring of individual row(true: green row, false: red row)
        blnAllAttempted = false; //used to check if all the questions are attempted and correct atleast once, if firstTime correct then accidently incorrect, it doesn't matter. At least once correct.
        correctAnswerArray = []; //stores correct Answer tagWise
        AH.selectAll('.categorycontainer', 'removeClass', 'complete');
        AH.setCss(".categorycontainer", {'opacity': '1', 'cursor': 'pointer'});
        // allows click on next and previous button
        AH.setCss(".nextbutton", {'pointer-events': 'auto'});
        AH.setCss(".prevbutton", {'pointer-events': 'auto'});
        // enabled the 'Match' button
        AH.select('.matchbutton').disabled = false;
        // removes performed useranswer
        state.uxml = '';
        // makes value blank of state 'xml'
        state.xml = '';
        state.correct_match = [];
        // reload the module after removing user answer that was performed previously
        loadModule(xml);
        // shows the first item of each row
        const elementContainerAll = AH.selectAll('.categoryitemcontainer .categoryiteminnercontainer .elementContainer');
        if(elementContainerAll && elementContainerAll.length){
            elementContainerAll.forEach(eleContainer => {
                const eleContainerChild = AH.findChild(eleContainer, '.element', 'all');
                if(eleContainerChild && eleContainer.length){
                    eleContainerChild.forEach(ele => ele.style.display='none');
                    const randIndex = Math.round(Math.random()*eleContainerChild.length)-1;
                    eleContainerChild[randIndex].style.display = '';
                }
            })
        }
        // disabled the reset button
        AH.select('#reset_btn').disabled = true;
    }

    function handleReviewMode(mode) {
        if (mode == 'c') {
            //AH.select('.correctAnswer').style.display = 'block';
            AH.select('.correctAnswer','removeClass','h');
            //AH.select('.yourAnswer').style.display = 'none';
            AH.select('.yourAnswer','css',{display:'none'});
        } else if (mode == 'u') {
            //AH.select('.yourAnswer').style.display = 'block';
            AH.select('.yourAnswer','css',{display:'block'});
            //AH.select('.correctAnswer').style.display = 'none';
            AH.select('.correctAnswer','addClass','h');
        }
    }

</script>
<svelte:window bind:innerWidth={windowwidth} />
<div>
    <ItemHelper
        on:setReview = {setReview}
        on:unsetReview = {unsetReview}
        handleReviewClick={handleReviewMode}
        reviewMode={isReview}
        customReviewMode={customIsReview}
    />
    <div class="alignTestarea px-3 mx-auto mt-3 {targetView == 'block' ? 'h' : ''}" style="max-width: { state.maxWidth }">
        <div class="categorycontainer center-block {(windowwidth > 1200) ? 'span9' : ''}">
            {#if state.xml}
                {#each state.xml.category.categories as datai, index}
                    <div class="row np mb-3" key={index}>
                        <div class="prevbutton col-lg-1 col-md-1 col-sm-2 col-2 px-sm-3 px-0 prevbutton_{index}" tabindex={0} title="previous" on:click|preventDefault="{prevbutton}" on:keydown="{keydownAda}">
                            <span class="icomoon-arrow-left font26 btnGrp"></span>
                        </div>
                        <div class="categoryinnercontainer p-0 r-lg col-lg-10 col-md-10 col-sm-8 col-8">
                            <div class="categorytitle card_border">
                                <div class="font20 text-center text-dark" tabindex={0} title={datai.text}>{@html datai.text}</div>
                            </div>
                            <div class="categoryitemcontainer p-1 categoryitemcontainer_{index}">
                                <div class="categoryiteminnercontainer w-100 h-100 text-center">
                                    <div class="elementContainer w-100 h-100 d-table">
                                        {#each state.xml.item.items as dataj}
                                            {#if datai.id == dataj.category && (ignoreItemIds.indexOf(dataj.id) == -1)}
                                                {#if state.correct_match['category_'+ dataj.sequence] == false}
                                                    <div class="element bg-white m-0" seq_no='category_{dataj.sequence}' key={dataj.id} data-tags={dataj.tags} style="display: none">
                                                        {#if dataj.imageurl != ''}
                                                            <img data-check={index} src="//s3.amazonaws.com/jigyaasa_content_static//{dataj.imageurl}" on:load={onImgLoad} class="img-fluid" tabindex={0} alt="{(dataj.imagealt) ? dataj.imagealt : "No alt of image"}" title={(dataj.imagealt) ? dataj.imagealt : "No alt of image"}/>
                                                        {:else if dataj.label != ''}
                                                            <div class="elementText" tabindex={0} title={dataj.label}>{@html dataj.label}</div>
                                                        {/if}
                                                    </div>
                                                {/if}
                                            {/if}
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nextbutton col-md-1 col-lg-1 col-sm-2 col-2 px-sm-3 px-0 nextbutton_{index}" tabindex={0} title="next" on:click="{nextbutton}" on:keydown="{keydownAda}">
                            <span class="icomoon-arrow-right-2 font26 btnGrp"></span>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <div class="text-center">
            {#if AH.get('alignMatchReset') == true}
                <button type="button" id="reset_btn" class="btn btn-primary me-sm-2 me-0 mb-2 reset_btn" disabled="disabled" on:click="{resetButton}">{l.reset}</button>
            {/if}
            {#if state.xml}
                <button type="button" class="matchbutton btn btn-primary mb-2" on:click="{matchButton}">{state.xml.settings.matchButtonText}</button>
            {/if}
        </div>
    </div>
    {#if targetView == 'block'}
        <div class="finalResult">
            <div class="scoreDiv">
                <div class="correctAnswer h"> 
                    <ShowAnswer jsondataCategory={jsonData.category}  objValues={objectValues(correctAnswerArray)} {state} correct_ans_bg="typeCorrect"/>
                </div>
                <div class="yourAnswer">
                    <ShowAnswer user_ans_table=1 jsondataCategory={jsonData.category}  objValues={objectValues(correctAnswerArray)} {state} your_ans_class="your_ans_td"/>
                </div>
            </div>
        </div>
    {/if}
</div>