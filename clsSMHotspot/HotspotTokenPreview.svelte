<script>
    import { beforeUpdate, onMount, tick } from "svelte";
    import { writable } from "svelte/store";
    import ItemHelper from "../helper/ItemHelper.svelte";
    import { AH, onUserAnsChange, XMLToJSON } from "../helper/HelperAI.svelte";
    import l from '../src/libs/editorLib/language';
    export let xml;
    export let editorState;
    export let isReview;
    export let showAns;
    export let uxml;
    let ansSwitch = 0;
    let state = {};
    let hdd = writable({
            xml: "",
            itemType: "",
            cdata: "",
            correctAns: "",
            userAns: [],
            itemLayout: [],
            smController: "h",
            pointerEvents: "auto",
            iconVisible: "h",
            isReview: false,
    });
    let onError = "";
    const unsubs = hdd.subscribe((items)=> {
        state = items;
    })

    // go in block if there is change in remediation mode
    $:{
        
        if (isReview) {
            setReview(); 
            if(editorState && ansSwitch == 0) {
                // check tha answer
                ansSwitch = 1;
                checkAns();
            }
        } else {
            // if review mode is off
            ansSwitch = 0;
            if (editorState) unsetReview();
        }
    }

    // calls whenever there is change in props or state
    beforeUpdate(()=> {
        // go in block if there is change in xml
        if (xml != state.xml) {
            // set the state of xml to the current(changed) xml
            state.xml = xml;
            // reset the correct and user ans
            resetValue();
            // load the module
            loadModule(xml);
        }

        // go in block if there is change in remediation mode
        // if (isReview) {
        //     // check tha answer
        //     checkAns();
        //     setReview(); 
        // } else {
        //     // if review mode is off
        //     if (editorState) unsetReview();
        // }
    })

    // run just after rendering
    onMount(()=> {

        // select token press the Enter Key ADA
        AH.listen('body', 'keydown', '.token', (_this, e)=> { 
            if (e.which === 13) {
                _this.click();
            }
        });

        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
        // //Toggle Button Color
        // AH.bind('#sm_controller button').click(function() {
        //     $('#sm_controller button').removeClass("active btn-primary text-white bg-primary");
        //     $(this).addClass('active btn-primary text-white bg-primary');
        // });

        // Binding set-review and unset-review with the click event
        //For modeOn functions in prepkit
        // $("#set-review").on('click', function() {
        //     setReview();
        // });
        
        // $("#unset-review").on('click', function() {
        //     unsetReview();
        // });
        // binding token with enter key in case of IE
        // if (isIE) {
        //     AH.listen(document, "keyup", ".hotspot-token-preview .token", (_this, event)=> {
        //         if (event.which == 13) {
        //             _this.click();
        //         }
        //     });
        // }
    });

    // when review mode is on
    function setReview() {
        state.isReview = true;
        state.smController = "";
        state.pointerEvents = "none";
        showAnswer("yans", "showIcon");
        //$('#sm_controller .your-ans').addClass("btn-light active"); 
        AH.select(".tokenHeader", 'attr', {tabIndex: "0"});
    }

    // when review mode is off
    function unsetReview() {
        state.isReview = false;
        state.smController = "h";
        state.pointerEvents = "auto";
        showAnswer("yans", "hideIcon");
        AH.select(".tokenHeader", 'removeAttr', 'tabindex');
        //$('#sm_controller button').removeClass("active btn-primary text-white bg-primary");
    }

    // for resetting the value
    function resetValue() {
        state.correctAns = [];
        state.userAns = [];
    }

    // load the module
    function loadModule(loadXml) {
        // Here xml is converted into the json and pass into the parseXMLAuthoring for xml parsing
        loadXml = XMLToJSON(loadXml);
        parseXMLPreview(loadXml);
    }

    // parse function for the preview
    async function parseXMLPreview(MYXML) {
        try {
            // split the correctAns by , & stored it in the current state 
            state.correctAns = MYXML.smxml.div._correctAns.split(",");
            // set the type of module wether it is w,p or s
            state.itemType = MYXML.smxml.div._type;
            // set the state of cdata on the basis of xml and after that parse the xml according to its type
            state.cdata = MYXML.smxml.div.__cdata;
            await tick();
            switch(MYXML.smxml.div._type) {
                case "w" :
                    // if the type is word
                    // function for parse word
                    parseWord(state.cdata);
                    break;
                case "s" :
                    // if the type is sentence
                    // function for parse sentence
                    parseSentance(state.cdata);
                    break;
                case "p" :
                    // if the type is paragraph
                    // function for parse paragraph
                    parseParagraph(state.cdata);
                    break;
                default :
                    console.warn("No type found to parse");
                    break;
            }
            if (uxml) {
               // parse the user ans
               parseUserAns(uxml);
            }
        } catch (error) {
            onError = error;
            console.warn({'error':error.message,'function name':'parseXMLPreview','File name':'HotspotTokenPreview.js'});
        }
    }

    // in case of word 
    function parseWord(str) {
        // replace the newline with " #newline# "
        str = str.replace(/\n/g, " #newline# ");
        //Split the string with space and remove array which contain null value
        let word = str.split(" ").map( (item)=> { return item.trim() } ).filter( (arr)=> { return arr != "" });
        let wordArray = [];
        let tempWord = [];
        /* split punctuation mark in word and store in the tempWord array */
        word.map((data, i)=> {
            let special_symbol = data.match(/[.,]/g);
            if (special_symbol) {
                let splitText = data.split(special_symbol[0]);
                tempWord.push(splitText[0]);
                tempWord.push(special_symbol[0]);
                if (splitText[1].trim()) {
                    tempWord.push(splitText[1]);
                }
            } else {
                tempWord.push(data)
            }
        });
        /*end*/
        // store id, value and selected in wordArray
        // Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
        tempWord.map((data, i)=> {
            wordArray.push({
                id: "ID"+i,
                value: data,
                selected: false,
            });
        });
       state.itemLayout = wordArray;
    }

    // in case of sentence
    function parseSentance(str) {
        //Split the string with fullstop and remove array which contain null value
        let sentance = str.split(".").map( (item)=> { return item.trim() } ).filter( (arr)=> { return arr != "" });
        let sentanceArray = [];
        // store id, value and selected in sentanceArray
        // Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
        sentance.map((data, i)=> {
            sentanceArray.push({
                id: "ID"+i,
                value: data+".",
                selected: false
            });
        });
        state.itemLayout = sentanceArray;
    }

    // in case of paragraph
    function parseParagraph(str) {
        //Split the string with paragraph and remove array which contain null value
        let paragraph = str.split("\n").map( (item)=> { return item.trim() } ).filter( (arr)=> { return arr != "" });
        let paragraphArray = [];
        // store id, value and selected in paragraphArray
        // Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
        paragraph.map((data, i)=> {
            paragraphArray.push({
                id: "ID"+i,
                value: data,
                selected: false
            });
        });
        state.itemLayout = paragraphArray;
    }

    function getCorrect(id) {
        //Return true if this id is correct answer
        return (AH.findInArray(id, state.correctAns) ? true: false);
    }

    // for checking the answer
    function checkAns() {
        // used for switch on next question in prepengine if current question is attempted
		ISSPECIALMODULEUSERXMLCHANGE = 1;
        let resultLength = 0;
        const correctLength = state.correctAns.length;
        //Check if correct answer is equal to user answer
        state.correctAns.map((data, i)=> {
            state.userAns.map((data2, j)=> {
                if (data == data2) {
                    resultLength = resultLength + 1;
                }
            });
        });
        let ans = (correctLength == resultLength && resultLength == state.userAns.length) ? true : false;
        onUserAnsChange({ans: ans, uXml: uxml});

        showAns && showAns(ans ? "Correct" : "Incorrect");
    }

    // for stting the user answer for selected one
    function setSelected(pos) {
        state.itemLayout[pos].selected = !state.itemLayout[pos].selected;
        setUserAns(pos, state.itemLayout[pos].selected);
    }

    function setUserAns(id,selected) {
        let tempUserAns = state.userAns;
        //Push the index in user answer array if clicked first time
        //and delete the index from user answer if it is already selected
        if (selected == true) {
            // push in the userAns if it is selected
            tempUserAns.push("ID"+id);
            state.userAns = tempUserAns;
        } else if (selected == false) {
            let deleteValue = tempUserAns.indexOf("ID"+id);
            if (deleteValue > -1) {
                // delete from the user ans if it is deselected
                tempUserAns.splice(deleteValue, 1);
            }
            state.userAns = tempUserAns;
        }

        // getting height in native
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
        // updating the uaXml
        uxml = "<smans><div userAns='" + state.userAns.join()+"'></div></smans>";
        // AH.select("#special_module_user_xml", 'value', "<smans><div userAns='"+state.userAns.join()+"'></div></smans>")
        // check for correct answer
        checkAns();
    }

    // for showing answer
    function showAnswer(val,iconState) {
        //show correct incorrect icon with respect to iconState
        state.iconVisible = (iconState == "showIcon") ? "" : "h";
        //change token highlight with respect to val
        //either to show correct answer or user answer
        let ans = [];
        if (val == "cans") {
            // if correct ans tab
            ans = state.correctAns;
        } else if (val == "yans") {
            // if user answer tab
            ans = state.userAns;
        }
        state.itemLayout.map((data, j)=> {
            data.selected =  AH.findInArray(data.id, ans) ? true : false;
            //return data;
        });
    }

    // for parsing the user ans function
    function parseUserAns(uans) {
        // converting the xml into the json and stored in userAnswer
        let userAnswer = XMLToJSON(uans);
        // cheking for the 2 elements smans,div, and one attribute of div i.e, userAns
        if (userAnswer.smans && userAnswer.smans.div && userAnswer.smans.div._userAns) {
            // splitting the userAns with ,
            state.userAns = userAnswer.smans.div._userAns.split(",");
            // get the selection on the basis of the user answer
            state.itemLayout.map((data, j)=> {
                data.selected =  AH.findInArray(data.id, state.userAns) ? true :false;
            });
        }
    }

    function handleReviewClick(mode, event) {
        if (mode == 'c') {
            showAnswer("cans", "hideIcon");
        } else {
            showAnswer("yans", "showIcon");
        }
    }
</script>
   
{#if onError != ""}
    <div class="alert alert-danger font-weight-bold">
        <span>Oops Something went wrong please check your ParseXML Function </span>
    </div>
{:else}
    <div class="hotspot-token-preview" tabindex="0">
        <center>
        <ItemHelper 
            on:setReview={setReview}
            on:unsetReview={unsetReview}
            handleReviewClick={handleReviewClick}
            reviewMode={state.isReview}
        />
        <div 
            class="token_highlight_heading font17 p-2 text-left"
            style="
                max-width: 600px;
                border-top: 2px solid #96bbf6;
                background-color: #d9e7fd;
            "
        >
            {l.token_highlight}
        </div>
        <div
            class="p-2"
            style="
                max-width: 600px;
                border: 2px solid #d9e7fd;
                display: flow-root;
                text-align: left;
                justify-content: left;
            "
        >
            {#if state.itemLayout}
                {#each state.itemLayout as data, i }
                    {#if data.value.indexOf('##pt') > -1 }
                        {data.value = data.value.replace(/##pt/g, '.')}
                    {/if}
                    {#if data.value.indexOf('#cm') > -1 }
                        {data.value = data.value.replace(/#cm/g, ',')}
                    {/if}
                    {#if data.value == "," || data.value == "."}
                        <div class="float-left position-relative d-inline" style="width: 1.5px; height: 1px">
                            <span
                                class="float-left position-absolute"
                                style="left: -2.5px"
                            >{data.value}</span>
                        </div>
                    {:else if data.value == "#newline#"}
                        <br/>
                    {:else}
                        <div key={i} class="tokenHeader position-relative float-left d-inline">
                            <span
                                data-id={"ID"+i}
                                data-correct={AH.findInArray("ID"+i, state.correctAns)}
                                on:click={setSelected.bind(this, i)}
                                data-selected={data.selected}
                                tabIndex={(state.pointerEvents == "auto") ? "0" : "1"}
                                class="pointer float-left text-left font14 token {(data.selected) ? 'token_selected' : ''}"
                                style="
                                    margin: 2px;
                                    user-select: none;
                                    border: 1px solid transparent;
                                    padding: 1px 3px;
                                    border-radius: 3px;
                                    pointer-events: {state.pointerEvents}
                                "
                            >
                                {data.value}
                            </span>
                            <span
                                class={state.iconVisible} 
                                style="
                                    position: absolute;
                                    width: 17px;
                                    height: 17px;
                                    right: -8px;
                                    top: -9px;
                                    background: white;
                                    border-radius: 15px 12px 12px;
                                    font-size: 18px;
                                    z-index: 1;
                                    display: {(state.iconVisible == "" && data.selected) ? 'block' : 'none'}
                                "
                            >
                                <span 
                                    class="position-relative {AH.findInArray("ID"+i, state.correctAns) ? 'icomoon-new-24px-checkmark-circle-1': 'icomoon-new-24px-cancel-circle-1'}" 
                                    style="color: {AH.findInArray("ID"+i, state.correctAns) ? 'green' : 'red'}; bottom: 3px; left: 0;" 
                                    aria-label={AH.findInArray("ID"+i, state.correctAns) ? "marked as correct":"marked as incorrect"}
                                ></span>
                            </span>
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>
        </center>
    </div>
{/if}
<style>
    .token:hover {
        border: 1px solid #000!important;
    }

    :global(.bla .token:hover){
        border: 1px solid #fff!important;
    }

    .token_selected {
        background-color: #64bb63;
        color: #fff;
    }

    :global(.bla .token_highlight_heading) {
        color: #000!important;
    }

    .hotspot-token-preview br {
        clear: both;
    }
</style>