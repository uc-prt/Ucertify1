<script>
    import { beforeUpdate, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { AH, JSONToXML, XMLToJSON } from "../helper/HelperAI.svelte";
    import l from '../src/libs/editorLib/language';
    export let xml;
    export let isReview;
    export let editorState;
    export let getChildXml;

    let state = {};
    let hdd = writable({
        xml: "",
        cdata: "",
        viewToken: "",
        viewTemplate: "",
        correctAns: [],
        itemLayout: [],
        activeToken: "",
        confirmDialog: false
    });
    const unsub = hdd.subscribe((items)=> {
        state = items;
    })
    // calls whenever there is change in state or props 
    beforeUpdate(()=> {
        // check if there is change in xml
        if (xml != state.xml) {
            state.xml = xml;
            // for refreshing the module with new xml
            loadModule(xml);
        }
    })

    // called just after rendering
    onMount(()=> {
        // check the conditions if it is IE
        // if (isIE) {
        //     AH.listen(document, "keyup", ".hotspot-token .token", (_this, event)=> {
        //         // binding the enter key in case of ada
        //         if (event.which == 13) {
        //             AH.trigger(_this, 'click');
        //         }
        //     });
        // }
        
        // storing and updating the xml
        getChildXml(xml+" ");
        // for showing the Enter text tab by default 
        toggleTemplateToken("none", "block");

        // for showing the text into the editable area of the Enter text
        AH.selectAll('.text_area', 'value', state.cdata.trim().replace(/[ ]+/gm, ' '));

        // function for showing warning for the unneccessary space
        AH.bind(".text_area", "keydown", (event)=> {
            let key_pressed = event;
            var element_name = document.querySelector('.text_area');
            // getting start pos
            var startPos = element_name.selectionStart;
            // getting end pos
            var endPos = element_name.selectionEnd;
            if (endPos == startPos) {
                // if space key is pressed
                if (key_pressed.which == 32) {
                    if ((AH.select('.text_area').value.charAt(startPos - 1) == " ") || (AH.select('.text_area').value.charAt(startPos) == " ")) {
                        AH.alert(l.space_warning);
                        key_pressed.preventDefault();
                    }
                }
            }
        });
    });

    // parse the xml and load the module accordingly
    function loadModule(loadXml) {
        // Here xml is converted into the json and pass into the parseXMLAuthoring for xml parsing
        loadXml = XMLToJSON(loadXml);
        parseXMLAuthoring(loadXml);
    }

    // parsing the xml for authoring
    async function parseXMLAuthoring(MYXML) {
        // getting the correct ans sepereted by , in array format
        state.correctAns = (MYXML.smxml.div._correctAns.trim()) ? MYXML.smxml.div._correctAns.split(",") : [];
        state.cdata = MYXML.smxml.div.__cdata;
        state.activeToken = MYXML.smxml.div._type;
        // switching the module on the basis of the type used
        switch(MYXML.smxml.div._type) {
            case "w" :
                // in case of word
                parseWord(state.cdata);
                break;
            case "s" :
                // in case of sentence
                parseSentance(state.cdata);
                break;
            case "p" :
                // in case of paragraph
                parseParagraph(state.cdata);
                break;
            default :
                console.warn("No type found to parse");
            break;
        }
    }

    // parsing the word
    function parseWord(str) {
        // replace the newline with " #newline# "
        str = str.replace(/\n/g, " #newline# ");
        //Split the string with space and remove array which contain null value
        let word = str.split(" ").map( (item)=> { return item.trim() } ).filter( (arr)=> { return arr != "" });
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
        let wordArray = [];
        // store id, value and selected in wordArray
        // Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
        tempWord.map((data, i)=> {
            wordArray.push({
                id: "ID"+i,
                value: data,
                selected: getSelected(i)
            });
        });
        
        state.itemLayout = wordArray;
    }

    // parsing the sentence
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
                selected: getSelected(i)
            });
        });
        state.itemLayout = sentanceArray;
    }

    // parsing the paragraph
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
                selected: getSelected(i)
            });
        });
        state.itemLayout = paragraphArray;
    }

    // update the cdata whenever there is chamge in textarea
    function updateCdata(e) {
        // convert the XML into JSON using XMLToJSON func and stored in xml
        let xml = XMLToJSON(state.xml);
        // clear the correctAns 
        xml.smxml.div._correctAns = "";
        // updtae the cdata
        xml.smxml.div.__cdata = e.target.value;
        // stores and update the xml 
        getChildXml(JSONToXML(xml));
    }

    // calls whenever tab is changed
    function toggleTemplateToken(viewToken, viewTemplate) {
        state.viewToken = viewToken;
        state.viewTemplate = viewTemplate;
    }

    // return true if that particular position was selected
    function getSelected(pos) {
        return (AH.findInArray("ID" + pos, state.correctAns) ? true: false);
    }

    // for changing the mode word, sentence, paragraph
    function setTemplateType(type) {
        // convert the XML into JSON using XMLToJSON func and stored in xml
        let xml = XMLToJSON(state.xml);
        // update the type w,p,s 
        xml.smxml.div._type = type;
        // clear the correctAns 
        xml.smxml.div._correctAns = "";
        // stores and update the xml 
        getChildXml(JSONToXML(xml));
    }

    // for setting the correct answer which is selected
    function setSelected(pos) {
        state.itemLayout[pos].selected = !state.itemLayout[pos].selected;
        setCorrectAnswer(pos,state.itemLayout[pos].selected);
    }

    // set the correct answer
    function setCorrectAnswer(id, selected) {
        if (selected == true) {
            // if token is selected then push it in correctAns
            state.correctAns.push("ID"+id);
        } else if (selected == false) {
            let deleteValue = state.correctAns.indexOf("ID"+id);
            if (deleteValue > -1) {
                // if token is deselected then delete that element from the correctAns
                state.correctAns.splice(deleteValue,1);
            } 
        }
        // join the correctAns with , sepereted and stored in crt
        let crt = state.correctAns.filter( function(arr) { return arr != "" }).join();
        // update the correctAns attribute in the xml
        updateCorrect(crt);
    }

    // update correct answer
    function updateCorrect(correct) {
        // convert the XML into JSON using XMLToJSON func and stored in xml
        let xml = XMLToJSON(state.xml);
        // updating the correctAns
        xml.smxml.div._correctAns = correct;
        // stores and update the xml 
        getChildXml(JSONToXML(xml));
    }

    // whenever clear button is clicked
    function clearToken() {
        // convert the XML into JSON using XMLToJSON func and stored in xml
        let xml = XMLToJSON(state.xml);
        // updating the correctAns
        xml.smxml.div._correctAns = "";
        // stores and update the xml 
        getChildXml(JSONToXML(xml));
    }
</script>

<div class="hotspot-token p-2 border">
    <div class="row ml-sm2">
        <div class="btn-group amazonpaybutton mb-2 mr-4" role="group">
            <button 
                type="button"
                class={(state.viewTemplate == "block")? "btn btn-light active" : "btn btn-light "} 
                on:click={toggleTemplateToken.bind(this, "none", "block")}
            >
                {l.edit_template}
            </button>
            <button 
                type="button"
                class={(state.viewToken == "block")?"btn btn-light active":"btn btn-light"}  
                on:click={toggleTemplateToken.bind(this, "block", "none")}
            >
                {l.edit_token}
            </button>
        </div>
        <div style="display: {state.viewToken}">
            <div class="btn-group border-0 bg-none">
                <button 
                    type="button" 
                    class={(state.activeToken == "w") ? "btn btn-light active" : "btn btn-light"} 
                    on:click={setTemplateType.bind(this, "w")}
                >
                    {l.word}
                </button>
                <button 
                    type="button" 
                    class={(state.activeToken == "s") ? "btn btn-light active" : "btn btn-light"} 
                    on:click={setTemplateType.bind(this, "s")}
                >
                    {l.sentance}
                </button>
                <button 
                    type="button"
                    class={(state.activeToken == "p") ? "btn btn-light active" : "btn btn-light"} 
                    on:click={setTemplateType.bind(this, "p")}
                >
                    {l.paragraph}
                </button>
            </div>
            <button type="button" class="btn btn-outline-primary ml-2" on:click={clearToken.bind(this)}>{l.clear}</button>
        </div>
    </div>
    <textarea 
        style="display: {state.viewTemplate}" 
        on:change={updateCdata.bind(this)} 
        rows="10" 
        cols="65"
        class="text_area p-2 mt-3 fwidth"
    ></textarea>
    <div style="display: {state.viewToken}" class="mt-3 light-cyan-bg border">
        <div class="d-inline-block px-1 py-2 word_break">
        {#if state.itemLayout}
            {#each state.itemLayout as data, i }
                {#if data.value == "," || data.value == "."}
                    <div class="float-start position-relative done_percent_bar" style="width: 2px">
                        <span 
                            class="position-absolute float-start top5"
                            style="left: -3px"
                        >
                            {data.value}
                        </span>
                    </div>
                {:else if data.value == "#newline#" }
                    <br/>
                {:else}
                    <div
                        data-id={"ID"+i}
                        on:click={setSelected.bind(this, i)}
                        data-selected={data.selected}
                        tabIndex="0"
                        class="token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left {data.selected ? 'token_selected' : 'token bg-white'}"
                        style="user-select: none;border-radius: 3px; font: 14px;"
                    >
                        {data.value}
                    </div>
                {/if}
            {/each}
        {/if}
        </div>
    </div>
    <div style="display: {state.viewToken}">
        <div class="pl-2 pt-2 font-weight-bold">{state.correctAns.length} {l.no_of_token}</div>
    </div>
    <div class="text-danger pl-2 pt-2" style="font: 13px;">
        <span class="font-weight-bolder">* {l.note_label}</span>
        <span>{l.token_message}</span>
    </div>
</div>
<style>
    .token_selected {
        background-color: #64bb63;
        color: #fff;
    }
</style>