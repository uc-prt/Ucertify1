<!--
 *  File Name   : WebAuthoring.svelte
 *  Description : Show the editors html,css and js
 *  Author      : Sundaram Tripathi
 *  Package     : svelte_items
 *  Last update : 24-June-2021
 *  Last Updated By : Pradeep Yadav
 *  Latest Update by : Sundaram Tripathi
-->
<!-- <svelte:head>
    <link rel="stylesheet" href="{themeUrl}pe-items/svelte_items/clsSMWeb/libs/codemirror.min.css"  /> 
    <link rel="stylesheet" href="{themeUrl}pe-items/svelte_items/clsSMWeb/libs/monokai.css"  />
    <link rel="stylesheet" href="{themeUrl}pe-items/svelte_items/clsSMWeb/libs/simplescrollbars.css"  />
    <link rel="stylesheet" href="{themeUrl}pe-items/svelte_items/clsSMWeb/libs/webitem.min.css"  /> 
</svelte:head> -->

<script>
    //import l from '../../lib/Lang';
    import l from '../src/libs/editorLib/language.js';
    import { onMount, beforeUpdate } from 'svelte';
    import { Checkbox } from 'svelte-mui/src';
    import { writable } from 'svelte/store';
    import { AH } from '../helper/HelperAI.svelte';
    export let xml;
    export let getChildXml;
    export let toggleMode;
    export let isReview;
    export let showAns;

        
    let isPreview = 0;
    let defaultStartXml = '<smxml type="22" addhtml="0" name="Web">';
    let isCaption = "";     
    let isAutograde = "";  
    let mode = document.querySelector(".switch-input.switch-input");
    let htmlEditor;
    let cssEditor;
    let jsEditor;
    let showHTML = 1;
    let readHTML = 1;
    let showCSS = 1;
    let readCSS = 1;
    let showJS = 1;
    let readJS = 1;
    let state = {};
    let disabled_hide = ['Editable','Hidden','Disabled'];



    let stateData = writable({
        xml                         : '',
        uxml                        : '',
        module                      : '',
        toggle                      : false,
        snackback                   : false,
        lang_type                   : 'php',
        xmlArr                      : [],
        remediationToggle           : false,
        
        // used for check or uncheck the 'Dark Theme' checkbox
        goDark                      : (window.sessionStorage.goDark && window.sessionStorage.goDark == "true" ? true : false)
    })

    let unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

    function changeTheme() {
        console.log('chacking theme');
        let check = document.querySelector("#goDark").checked;
        state.goDark = check;
        stateData.update( (item) => {
            item.goDark = check;
            return item;
        });

        window.sessionStorage.goDark = check;
        if (check) {
            htmlEditor && htmlEditor.setOption("theme", "monokai");
            cssEditor && cssEditor.setOption("theme", "monokai");
            jsEditor && jsEditor.setOption("theme", "monokai");
        } else {
            htmlEditor && htmlEditor.setOption("theme", "default");
            cssEditor && cssEditor.setOption("theme", "default");
            jsEditor && jsEditor.setOption("theme", "default");
        }
    }

    // used for update the xml and returns updated xml
    function generateXml(isFormatted) {
        // used for contain the updated xml
        let aXml = "";
        // contains the value of caption field
        if (document.querySelector("#launch_caption")!=null) isCaption = AH.select("#launch_caption").value;
        if (isCaption) {
            // sets the caption field value in 'launch_caption' attribute of 'smxml' tag
            defaultStartXml = `<smxml type="22" addhtml="0" name="Web" launch_caption="${isCaption}">`;
        }
        // contains the all editors value, all answer matching cases defined in Autograde dialog box and status of the editors as hidden, disabled or Editable 
        aXml = defaultStartXml + testCasesXml() + `\n<web libs="" files=",," ${handleDisable()}>\n<![CDATA[\n${getCode()}\n]]>\n</web>\n</SMXML>`;
        // this block will not execute as argument is not passed from any where at the time of function calling 
        if (isFormatted === true) {
            return aXml;
        }
        // updates the xml
        getChildXml(aXml);
        // returns the updated xml
        return aXml;
    }

    // used for show the output of written code
    function runCode() {
        //jQuery('html, body').animate({ scrollTop: jQuery('#result_div').offset().top }, 'slow'); // replaced
        window.scroll({
            top: 500,
            behavior: 'smooth'  
        });
        // creates the date object
        let date = new Date();
        // gets the time in milliseconds
        date = date.getTime();
        // sets the iframe inside the result field 
        //   jQuery('#result_div').html('<iframe class="result_frame w-100 border-0" style="height:344px" id="uC' + date + '"></iframe>');

        AH.selectAll('#result_div', 'html', '<iframe class="result_frame w-100 border-0" style="height:344px" id="uC' + date + '"></iframe>');
        // contains the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag
        
        let source = prepareSource();
        // selects the iframe element
        let iframe = AH.select('#uC' + date);
        //  returns the Document object generated by a frame or iframe element. Allow to access the Document object that belongs to a frame or iframe element
        let iframe_doc = iframe.contentDocument;
        // opens a new browser window, or a new tab, depending on browser settings and the parameter values
        iframe_doc.open();
        // writes the combiled html, css and js data in iframe after wrapping css data in style tag and js data in script tag
        iframe_doc.write(source);
        // closes the current window
        iframe_doc.close();
    }

    function enableAutograde(e) {
        if (e.target.checked) {
            isAutograde = 'active="1"';
            AH.selectAll("#test_case_text, #occurence_text, #exscript_text").forEach((_elm)=> {_elm.disabled = false});
        } else {
            isAutograde = "";
            AH.selectAll("#test_case_text, #occurence_text, #exscript_text").forEach((_elm)=> {_elm.disabled = true});
        }
        // used for update the xml and returns updated xml
        generateXml();
    }
    
    beforeUpdate(()=> { 
        // if(!is_visible) {
        //     createLink('pe-items/svelte_items/clsSMWeb/libs/codemirror.min.css');
        //     createLink('pe-items/svelte_items/clsSMWeb/libs/monokai.css');
        //     createLink('pe-items/svelte_items/clsSMWeb/libs/simplescrollbars.css');
        //     createLink('pe-items/svelte_items/clsSMWeb/libs/webitem.min.css');
        //     is_visible = 1;
        // }

        // contains the xml
        xml = xml ? xml : state.xml;
        if (toggleMode) {
            // defined in 'Web.js' it loads Preview or Authoring component according to the value of this variable but in this file it is not in use
            isPreview = 0;
        }
    })

    // afterUpdate(()=>{
    //     document.querySelectorAll('.CodeMirror').forEach(function(el,i){ el.CodeMirror.refresh(); });
    // })


     // called once throught the program execution just after render method
    onMount(()=> {

            AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body'});
            

            AH.bind(".modal", 'show.bs.modal', ()=> {
                setTimeout(function () {
                    if (AH.select('#disable_modal','visible').length > 0) {
                        AH.select('#html_disable').focus();
                    } else {
                        AH.select('#close_dialog_btn').focus();
                    }
                }, 500);
            }); 

            AH.listen(document, 'keydown', 'body', (_this, event)=> {
                if (event.ctrlkey && event.altkey && (event.which == 85 || event.keyCode == 85)) {
                    if(AH.select('#disable_modal','visible').length > 0) {
                        AH.selectAll('#html_disable').focus();
                    } else {
                        AH.selectAll('#close_dialog_btn').focus();
                    }
                }
            });

            AH.listen(document, 'click', '#grade_accordion .card', (_this, event)=> {
                let card_len = document.getElementsByClassName('card');
                for ( let i = 0; i < card_len.length; i++ ) {
                    AH.select(card_len[i], 'css',{border: "none"});
                }
                AH.select(_this, 'css', {border: '1px solid #000'});
            }) 


            // for remove the border from card element if focus is on checkbox, close button and on textarea
            // jQuery(document).on('focus', '#autograde_cb, #close_dialog_btn, #done_grading_btn', function () {
            //     jQuery('.card').css('border', 'none');
            // });  // Replaced

            AH.listen(document, 'click', '#autograde_cb, #close_dialog_btn, #done_grading_btn', ()=> {
                let card_len = document.getElementsByClassName('card');
                for ( let i = 0; i < card_len.length; i++ ) {
                    AH.select(card_len[i], 'css', {border: 'none'});
                }
            })

            // used for show the tooltip
            //AH.enableBsAll("[data-toggle='tooltip']", 'Tooltip');
            AH.select('#preview', 'hide');
           // setTimeout(function () {
                if (typeof (CodeMirror) == "function") {
                    // initialize the html, css and js editor if the type of 'CodeMirror' is function

                    renderCodeMirror();
                    parseXML();
                } else {
                    //jQuery(function () {
                        AI.ajax({
                            type: "GET",
                            url: itemUrl + "src/libs/codemirror.js",
                            dataType: "script",
                        }).then(function (data){
                                //  AI.activate(0);
                                let sc = document.createElement("script");
                                // sets the data received from 'codemirror.js' file inside the script tag
                                sc.innerHTML = data;
                                // appends this created script tag in body element of the document
                                document.body.appendChild(sc);
                                // initialize the html, css and js editor
        
                                renderCodeMirror(); //Fixed with codemirror
                                parseXML();
                            });
                     //   })
                }
                AI.ajax({
                    type: "GET",
                    url: itemUrl + "src/libs/split.js",
                    async: true,
                    dataType: "script",
                }).then((data)=> {
                   AH.activate(0);
                    if (document.querySelector("#splitterWeb")) {
                        // sets the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                        splitter();
                        // returns from the function to prevent from re-appened the code if it was already defined
                        return true;
                    }
                    // creates script element
                    let sc = document.createElement("script");
                    // defines the 'id' of the created script tag
                    sc.id = "splitterWeb";
                    // sets the data received from 'splitter.js' file inside the script tag
                    sc.innerHTML = data;
                    // appends this created script tag in body element of the document
                    document.body.appendChild(sc);
                    // sets the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                    splitter();
                });
       // }, 200);
       // setTimeout(()=> {
            // for manage the extra white space between last editor splitter
           // jQuery('#authoringDiv').css({ 'width': '99%', 'margin-left': '7px' }); // Replace
            AH.select('#authoringDiv', 'css', {marginLeft: '7px', width: '99%'});
       // }, 1300);
    });

    

    // used for set the value of attribute 'disable' and 'hide' of web tag in xml
    function handleDisable() {
        
        let html = parseInt(document.querySelector("#html_disable").value);
        let css = parseInt(document.querySelector("#css_disable").value);
        let js = parseInt(document.querySelector("#js_disable").value);
        let disableStr = (html ? 'html ' : '') + (css ? 'css ' : '') + (js ? 'js' : '');
        disableStr = disableStr.trim();
        disableStr = disableStr ? 'disable="' + disableStr.split(" ").join() + '"' : "";
        let hiddenStr = (html == 0 ? "0 " : "1 ") + (css == 0 ? "0 " : "1 ") + (js == 0 ? "0 " : "1 ");
        hiddenStr = hiddenStr.trim();
        hiddenStr = hiddenStr ? 'hide="' + hiddenStr.split(" ").join() + '"' : "";
        let finalStr = disableStr + ' ' + hiddenStr;
        return finalStr;
    }


     // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    function splitter() {

        // in case when js editor is visible and either html or css or both editor visible
        if (showJS && (showHTML || showCSS)) {
            // it is used to styled the splitter bar that exists on the left edge of the js editor
            // let splitter1 = jQuery('#top_content').height(394).split({
            //     // Add a vertical splitter bar
            //     orientation: 'vertical',
            //     // Specify how many pixels where you can't move the splitter bar on the edge
            //     limit: 160,
            //     // Set the position of the splitter bar
            //     position: '68%'
            // });
            
            let splitter1 = Split(['#top_content'],{
                sizes: [50],
                direction: 'vertical',
               
            })
        
            
        
        }
        // in case when html and css both editor is visible
        if (showHTML && showCSS) {
            // it is used to styled the splitter bar that exists on the left edge of the css editor
            // let splitter2 = jQuery('#firstEditorDiv').height(394).split({
            //     // Add a vertical splitter bar
            //     orientation: 'vertical',
            //     // Specify how many pixels where you can't move the splitter bar on the edge
            //     limit: 80,
            //     // Set the position of the splitter bar
            //     position: '50%'
            // });

            let splitter2 = Split(['#firstEditorDiv'],{
                sizes: [100],
                direction: 'vertical',
                //direction: "vertical",
            })
            Split(['#html_panel','#css_panel','#js_panel'],{
                sizes: [50,50,50],
            })



        }
        // in case when only one editor visible
        if ((showHTML + showCSS + showJS) == 1) {
            // it is used to styled the splitter bar that exists on the left edge of the result editor
            // let splitter3 = jQuery('#wrap').height(394).split({
            //     // Add a vertical splitter bar
            //     orientation: 'vertical',
            //     // Specify how many pixels where you can't move the splitter bar on the edge
            //     limit: 80,
            //     // Set the position of the splitter bar
            //     position: '60%'
            // });

            // let Splitter3 = Split(['#wrap'],{
            //     minSize: [60],
            //     direction: "vertical",
            // })
            let Splitter3 = Split(['#wrap'],{
                sizes: [100],
                direction: 'vertical',
                //direction: "vertical",
            })
           
            
            
            
        }
    }

     // used to create the xml of autograding conditions defined in 'Autograde' dialog box
     function testCasesXml() {
        if (!isAutograde) {
            // returns blank value if value of variable 'isAutograde' is blank 
            return "";
        }
        // contains the value of 'Testcases' field of 'Autograde' modal box
        let test_cases = document.querySelector("#test_case_text").value;
        // contains the value of 'Internal Script' field of 'Autograde' modal box
        let internal_cases = document.querySelector("#occurence_text").value;
        // contains the value of 'External Script' field of 'Autograde' modal box
        let external_case = document.querySelector("#exscript_text").value;
        // defines that the value of 'Testcases' field of 'Autograde' modal box is blank
        let flag_test = 0;
        // defines that the value of 'Internal Script' field of 'Autograde' modal box is blank
        let flag_internal = 0;
        // defines that the value of 'External Script' field of 'Autograde' modal box is blank
        let flag_external = 0;
        if (test_cases) {
            // defines that the value of 'External Script' field of 'Autograde' modal box is not blank
            flag_test = 1;
            // wraps the each defined conditions value of 'Testcases' field separated by semicolon (;) of 'Autograde' modal box in 'case' tag
            test_cases = '<case>' + test_cases.split(";").join("</case><case>") + '</case>';
            
            test_cases = '\n<autograde type="testcase">' + test_cases + '</autograde>';
        }
        if (internal_cases) {
            flag_internal = 1;
            internal_cases = '<case>' + internal_cases.split(";").join("</case><case>") + '</case>';
            internal_cases = '\n<autograde type="internal">' + internal_cases + '</autograde>';
        }
        if (external_case) {
            // defines that the value of 'External Script' field of 'Autograde' modal box is not blank
            flag_external = 1;
            
            external_case = '\n<autograde type="custom">' + external_case + '</autograde>';
        }
        
        let testStr = '<webautograde active="1" testcase="' + flag_test + '" internal="' + flag_internal + '" custom="' + flag_external + '">' + test_cases + internal_cases + external_case + '\n</webautograde>';
        // returns the value of variable 'testStr'
        return testStr;
    }


    



    
    function newSource() {
        let htmlData = htmlEditor.getValue();
        let video_and_audio_data = ['mp4', 'ogg', 'webm', 'mp3', 'wav'];
        let img_data = ['gif', 'tif', 'png', 'jpg'];
        htmlData = htmlData.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function (fullMatch, src) {
            if (src) {
                for (let i = 0; i < video_and_audio_data.length; i++) {
                    if (src.indexOf(video_and_audio_data[i]) > -1) {
                        return fullMatch.replace(src, 'https://s3.amazonaws.com/jigyaasa_content_stream/' + src);
                    }
                }
                for (let i = 0; i < img_data.length; i++) {
                    if (src.indexOf(img_data[i]) > -1) {
                        return fullMatch.replace(src, 'https://s3.amazonaws.com/jigyaasa_content_static/' + src);
                    }
                }
            }
        });
        return htmlData;
    }

    function getCode() {
       
        try {
            
            let htmlData = htmlEditor.getValue();
            
            
            let cssData = cssEditor.getValue();
            
            let jsData = jsEditor.getValue();
            
            let fullData = "<tag>" + htmlData + "</tag>\n<css>" + cssData + "</css>\n<js>" + jsData + "</js>";
            // returns the string stored in variable 'fullData'
            return fullData;
        } catch (e) {
            // returns blank value when any error occurred
            return "";
        }
    }

    function prepareSource() {
        try {
            let htmlData = htmlEditor.getValue();
            let cssData = cssEditor.getValue();
            let jsData = jsEditor.getValue();
            htmlData = newSource();
            cssData = cssData.replace(/url\(['"](.*?)['"]\)/g, "url('https://s3.amazonaws.com/jigyaasa_content_static/$1')");
            jsData = jsData.replace(/src.*?["'](.*?)["']/gi, "src = 'https://s3.amazonaws.com/jigyaasa_content_static/$1'");
            
            /// Need to fix
            let fullData = htmlData + "\<style\>" + cssData + "\<\/style\>\<script\>" + jsData + "\<\/script\>";
            // returns the data after combining html, css and js data
            return fullData;


        } catch(e) {
            return '';
        }
    }

    function renderCodeMirror() {
        if (AI.get('renderCodeMirror')) {
            return true;
        }
        cssEditor = CodeMirror.fromTextArea(document.getElementById("css_editor"), {
            lineNumbers: true,
            mode: 'css',
            styleActiveLine: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            scrollbarStyle: "simple",
        
            matchBrackets: true,
            gutters: ["CodeMirror-linenumbers", "breakpoints"]
        });
        // initialize the html editor
        htmlEditor = CodeMirror.fromTextArea(document.getElementById("html_editor"), {
            lineNumbers: true,
            mode: 'text/html',
            styleActiveLine: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            scrollbarStyle: "simple",
            matchBrackets: true,
            gutters: ["CodeMirror-linenumbers", "breakpoints"]
        });
        // initialize the js editor
        jsEditor = CodeMirror.fromTextArea(document.getElementById("js_editor"), {
            lineNumbers: true,
            mode: 'text/javascript',
            styleActiveLine: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            scrollbarStyle: "simple",
            matchBrackets: true,
            
            gutters: ["CodeMirror-linenumbers", "breakpoints"]
        });
        if (typeof (htmlEditor) == "object" && !isReview) {
            htmlEditor.on("change", function () {
                generateXml();
            });
        }
        if (typeof (cssEditor) == "object" && !isReview) {
            cssEditor.on("change", function () {
                generateXml();
            });
             // AI.listen(cssEditor,'change',function(){
            //     generateXml();
            // })
        }
        if (typeof (jsEditor) == "object" && !isReview) {
            jsEditor.on("change", function () {
                generateXml();
            });
             // AI.listen(cssEditor,'change',function(){
            //     generateXml();
            // })
        }
        htmlEditor.setOption("extraKeys", {
            // Changing Tabs into 4 spaces  
            Tab: function (cm) {
                let spaces = Array(cm.getOption("indentUnit") + 3).join(" ");
                cm.replaceSelection(spaces);
            },
            F11: function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            Esc: function (cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        });

        // calls for set the editors value if it was defined 
        parseXML();

        // defines that editor is initialized
        AI.set('renderCodeMirror', true);
    }

    function stringBetween(data, str_1, str_2) {
        // contains RegExp pattern for match in string
        let regEx;
        if (str_2) {
            // creates the pattern if opening and closing both tag provided at the time of function calling
            regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
        } else {
            // creates the pattern if opening and closing both tag not provided at the time of function calling
            regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
        }
        // contains the text according to the match data in xml string
        let matchedStr = regEx.exec(data);
        if (matchedStr) {
            // returns the text between given opening and closing tag if it exist
            return matchedStr[1];
        } else {
            // returns the null if text not found between given opening and closing tag
            return null;
        }
    }

    // returns the value of attribute defined in second argument from tag defined in 3rd argument in xml string defined in argument 1
    function findAttribute(XML, attr, tag = "") {
        // creates new RegExp object for match the value of attribute of any tag
        let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w.*?)\".*?>", "gm");
        // contains the matched text in 'XML' string if it matched otherwise null value holds
        let matchedStr = regEx.exec(XML);
        if (matchedStr) {
            // returns the value of attribute defined in argument variable 'attr' of tag defined in argument variable 'tag' of XML
            return matchedStr[1];
        } else {
            // returns null if no matched data found
            return null;
        }
    }

    // used for contain the actual text value from formatted xml text
    function getCase(str) {
        // replaces the string '</case><case>' with semicolon (;) and '</case>','<case>' or '\n' with blank value
        str = str.replace(/\n/gm, "").replace(/<\/case><case>/gm, ";").replace(/<\/case>|<case>/g, "");
        // returns the formatted string
        return str;
    }

    // used for unrender the player tag
    function unRenderPlayer() {
        // makes player tag empty that exist inside element have id: authoringDiv
        //jQuery('#authoringDiv player').empty();
        AI.empty('#authoringDiv player');
        // removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
        //jQuery('#authoringDiv').find('player').removeClass('hidecontent'); // Replaced
        document.querySelector("#authoringDiv").querySelector('player').classList.remove('hidecontent'); 
        // jQuery('#editor img').each(function () { // Replaced
        //     if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
        //         // sets the value of 'src' attribute of img tag that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static' 
        //         jQuery(self).attr('src', jQuery(self).attr('src'));
        //     }
        // }); 
        

        document.querySelector('#editor img').forEach(function(_this,i){
            if( !_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                _this.getAttribute('src',_this.getAttribute('src'));
            }
        })
    }

    // used for render the player tag
    function renderPlayer() {
        // makes player tag empty that exist inside element have id: authoringDiv
        //jQuery('#authoringDiv player').empty(); // Replaced
        AI.empty('#authoringDiv player');
        
        // used for set the data of player tag
        //   tag_player(jQuery('#authoringDiv')); // Replaced
        //tag_player(document.querySelector('#authoringDiv'));
        
            // adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
        //jQuery('#authoringDiv').find('player').addClass('hidecontent'); // Replaced
        setTimeout(function(){
            document.querySelector('#authoringDiv').querySelector('player').classList.add('hidecontent');
        },200)
    
        document.querySelector('#editor img').forEach(function(_this,i){
            if(!_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                _this.getAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/' + _this.getAttribute('src'));
            }
        });
    }
    

     // makes blank the value of user answer xml and also of html,css and js editors
     function reset() {
        // makes blank the value of html editor
        htmlEditor.setValue("");
        // makes blank the value of css editor
        cssEditor.setValue("");
        // makes blank the value of js editor
        jsEditor.setValue("");
        // makes blank value of user answer xml
        //jQuery("#special_module_user_xml").val(""); // Replaced
        document.getElementById('special_module_user_xml').value = "";
        // makes blank the value of 'uaXML' of window object
        window.uaXML = "";
    }

    function parseXML() {
        let htmlData = stringBetween(xml, "tag");
        
        if(htmlData != null)
        htmlEditor.setValue(htmlData ? htmlData.trim() : "");
        let cssData = stringBetween(xml, "css");
        
        if(cssData != null)
        cssEditor.setValue(cssData ? cssData.trim() : "");
        let jsData = stringBetween(xml, "js");
        
        if(jsData != null)
        jsEditor.setValue(jsData ? jsData.trim() : "");
        let disableData = findAttribute(xml, "disable", "web");
        let html_disable = document.querySelector("#html_disable");
        let css_disable = document.querySelector("#css_disable");
        let js_disable = document.querySelector("#js_disable");
        if (/html/g.test(disableData)) {
            html_disable.value = 1;
        }
        if (/js/g.test(disableData)) {
            js_disable.value = 1;
        }
        if (/css/g.test(disableData)) {
            // sets value '1' of 'CSS' field to show 'Disabled' option seleced of CSS field in 'Disable/Hide' dialog box
            css_disable.value = 1;
        }
        // contains the caption field value
        let caption = findAttribute(xml, "launch_caption", "smxml");
        // sets the caption field value
        AH.select("#launch_caption", 'value', caption);
        // contains the 'hide' attribute value of 'web' tag of xml
        let hideData = findAttribute(xml, "hide", "web");
        // if hide attribute value exist then it contains that value otherwise contains value ",,"
        hideData = hideData ? hideData : ",,";
        // creates and array containing the value of variable 'hideData' by spliting it comma (,)
        hideData = hideData.split(",");
        if (parseInt(hideData[0]) == 0) {
            // sets value '0' of 'HTML' field to show 'Hidden' option seleced of CSS field in 'Disable/Hide' dialog box
            html_disable.value = 0;
        }
        if (parseInt(hideData[1]) == 0) {
            // sets value '0' of 'CSS' field to show 'Hidden' option seleced of CSS field in 'Disable/Hide' dialog box
            css_disable.value = 0;
        }
        if (parseInt(hideData[2]) == 0) {
            // sets value '0' of 'JS' field to show 'Hidden' option seleced of JS field in 'Disable/Hide' dialog box
            js_disable.value = 0;
        }
        
        let test_cases = stringBetween(xml, '<autograde type=\"testcase\">', "<\/autograde>");
        let internal_cases = stringBetween(xml, '<autograde type=\"internal\">', "<\/autograde>");
        let external_cases = stringBetween(xml, '<autograde type=\"custom\">', "<\/autograde>");
        test_cases = test_cases ? getCase(test_cases) : "";
        internal_cases = internal_cases ? getCase(internal_cases) : "";
        external_cases = external_cases ? external_cases.replace(/<\/case>|<case>/g, "") : "";
        
        if(document.querySelector("#test_case_text")) {
            document.querySelector("#test_case_text").value = test_cases;
            document.querySelector("#occurence_text").value = internal_cases;
            document.querySelector("#exscript_text").value = external_cases.replace(/<\/case>|<case>/g, "");
        }
        if (test_cases || internal_cases || external_cases) {
            // sets the value 1 of variable 'isAutograde'
            isAutograde = 1;
            // enables 'Testcases' field of 'Autograde' dialog box
            document.querySelector("#test_case_text").disabled = false;
            // enables 'Internal Script' field of 'Autograde' dialog box
            document.querySelector("#occurence_text").disabled = false;
            // enables 'External Script' field of 'Autograde' dialog box
            document.querySelector("#exscript_text").disabled = false;
            // checked the 'Autograde' checkbox
            document.querySelector("#autograde_cb").checked = true;
        }
        // sets the theme of html, css and js editors according to the checked status of 'Dark Theme' checkbox
        changeTheme();
    }

</script>
    
    
<div id="authoringArea" style="line-height:20px;font-size:14px;">
    <div>
        <div class="container-fluid">
            <div class="row">
                <div id="web_toolbar" style="height: 50px;" class="bg-light w-100 p-2">
                    <div class="inline-block pull-left">
                        <button 
                            type="button" 
                            data-bs-toggle="modal" 
                            data-bs-target="#autograde_modal" 
                            class="btn btn-primary mr-2"
                        >{l.autograde}</button>
                    </div>
                    <div class="inline-block pull-left">
                        <button 
                            type="button" 
                            data-bs-toggle="modal" 
                            data-bs-target="#disable_modal" 
                            class="btn btn-primary mr-2"
                        >{l.disable}</button>
                    </div>
                    <div class="inline-block pull-left width150">
                        <input 
                            type="text" 
                            id="launch_caption" 
                            class="form-control" 
                            placeholder="Caption" 
                            on:keyup={generateXml} 
                        />
                    </div>
                    <div class="inline-block width150 relative bottom6 pull-left ml-lg">
                        <span class="themeStyle form-check form-check-inline">
                            <Checkbox  
                                checked={state.goDark} 
                                on:click={changeTheme} 
                                id="goDark"
                            >
                                Dark Theme
                            </Checkbox>
                        </span>  
                    </div>
                    <div class="inline-block pull-right">
                        <button 
                            type="button" 
                            class="btn btn-primary ml" 
                            on:click={runCode}
                        >
                            <i class="fa fa-code"></i> {l.run}
                        </button>
                    </div>
                </div>
                <div id="wrap" style='width:100%; background:white;padding:0px;'>
                    <div id="top_content">
                        <div id="firstEditorDiv" style='display:flex;'>
                            <div id="html_panel" class="card m-0 p-0 rounded-0">
                                <div class="card-header rounded-0">
                                    <span>{l.html}</span>
                                </div>
                                <div id="html" class="card-body code_box content-div m-0 p-0" style='height:347px;'>
                                    <textarea name="html" id="html_editor"></textarea>
                                </div>
                            </div>
                            <div id="css_panel" class="card m-0 p-0 rounded-0">
                                <div class="card-header rounded-0">
                                    <span>{l.css}</span>
                                </div>
                                <div id="css" class="card-body code_box content-div m-0 p-0" style='height:347px;'>
                                    <textarea name="css" id="css_editor"></textarea>
                                </div>
                            </div>
                            <div id="js_panel" class="card m-0 p-0 rounded-0">
                                <div class="card-header rounded-0">
                                    <span>{l.js}</span>
                                </div>
                                <div id="js" class="card-body code_box content-div m-0 p-0" style='height:347px;'>
                                    <textarea name="js" id="js_editor"></textarea>
                                </div>
                            </div>
                        </div>
                        <!-- <div id="jsEditorDiv">
                            <div id="js_panel" class="card m-0 p-0 rounded-0">
                                <div class="card-header rounded-0">
                                    <span>{l.js}</span>
                                </div>
                                <div id="js" class="card-body code_box content-div m-0 p-0" style={'height:347px;'}>
                                    <textarea name="js" id="js_editor"></textarea>
                                </div>
                            </div>
                        </div> -->
                    </div>
                    <div id="bottom_content">
                        <div class="card rounded-0 nm">
                            <div class="card-header rounded-0">
                                <span>{l.result}</span>
                            </div>
                            <div 
                                id="result_div" 
                                style="min-height: 351px;" 
                                class="card-body content-div m-0 p-0 rounded-0"
                            >

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="autograde_modal" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title form-check form-check-inline">
                        <label for="autograde_cb" class="form-check-label pr-2">{l.autograde}</label> 
                        <input 
                            type="checkbox" 
                            name="autograde_cb" 
                            id="autograde_cb" 
                            class="form-check-input" 
                            on:click={enableAutograde} 
                        />
                    </h4>
                    <button 
                        type="button" 
                        class="close" 
                        data-bs-dismiss="modal" 
                        aria-hidden="true" 
                        id="close_dialog_btn" 
                        auto:focus="autofocus"
                    >×</button>
                </div>
                <div class="modal-body overflow-auto">
                    <div class="panel-group" id="grade_accordion">
                        <div class="card mb-2">
                            <div class="card-header" data-bs-toggle="collapse" data-bs-target="#test_case_collapse">
                                <h4 class="panel-title">
                                    <a 
                                        class="text-dark" 
                                        data-bs-toggle="collapse" 
                                        data-bs-parent="#grade_accordion" 
                                        href="#test_case_collapse"
                                    >
                                        {l.testcases}
                                    </a>
                                    <span 
                                        class="icomoon-help float-right s4" 
                                        data-bs-toggle="tooltip" 
                                        title="custom function name|input1,input2,..inputN|Output" 
                                        data-bs-placement="left"
                                    ></span>
                                </h4>
                            </div>
                            <div id="test_case_collapse" class="collapse in">
                                <div class="card-body p-md">
                                    <textarea 
                                        id="test_case_text" 
                                        class="form-control" 
                                        style="maxHeight:150px;minHeight:80px;" 
                                        placeholder="custom function name|input1,input2,..inputN|Output" 
                                        disabled='disabled' 
                                        on:keyup={generateXml}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-2">
                            <div class="card-header" data-bs-toggle="collapse" data-bs-target="#internal_script_collapse">
                                <h4 class="panel-title">
                                    <a 
                                        class="text-dark" 
                                        data-bs-toggle="collapse" 
                                        data-bs-parent="#grade_accordion" 
                                        href="#internal_script_collapse"
                                    >
                                        {l.internalScript}
                                    </a>
                                        <span 
                                        class="icomoon-help float-right s4" 
                                        data-bs-toggle="tooltip" 
                                        title="1. attr_match?HTML?tag name&#123;1&#125;?occurance.(for tag match) &#10;2. attr_match?HTML?tag name" 
                                        data-bs-placement="left"
                                    ></span> 
                                </h4>
                            </div>
                            <div id="internal_script_collapse" class="panel-collapse collapse">
                                <div class="card-body p-md">
                                    <textarea 
                                        id="occurence_text" 
                                        class="form-control" 
                                        style='max-height:150px;min-height:80px;' 
                                        placeholder="function as suggested in help block?Lang?keyword?occurance" 
                                        disabled='disabled' 
                                        on:keyup={generateXml}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-2">
                            <div class="card-header" data-bs-toggle="collapse" data-bs-target="#external_script_collapse">
                                <h4 class="panel-title">
                                    <a 
                                        class="text-dark" 
                                        data-bs-toggle="collapse" 
                                        data-bs-parent="#grade_accordion" 
                                        href="#external_script_collapse"
                                    >
                                        {l.externalScript}
                                    </a>
                                    <span 
                                        class="icomoon-help float-right s4" 
                                        data-bs-toggle="tooltip" 
                                        title="Write your own script" 
                                        data-bs-placement="left"
                                    ></span>
                                </h4>
                            </div>
                            <div id="external_script_collapse" class="panel-collapse collapse">
                                <div class="card-body p-md">
                                    <textarea 
                                        id="exscript_text" 
                                        class="form-control" 
                                        style="max-height:150px; min-height:80px;" 
                                        placeholder="Write your own script" 
                                        disabled='disabled' 
                                        on:keyup={generateXml}
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button 
                        type="button" 
                        class="btn btn-primary" 
                        data-bs-dismiss="modal" 
                        name="done_grading_btn" 
                        id="done_grading_btn"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="disable_modal" class="modal fade" role="dialog">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{l.disable}</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="html_disable">{l.html}:</label>
                        <select class="form-control" id="html_disable" on:blur={generateXml} auto:focus="autofocus">
                            <option value="">{l.editable}</option>
                            <option value="0">{l.hidden}</option>
                            <option value="1">{l.disabled}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="css_disable">{l.css}:</label>
                        <select class="form-control" id="css_disable" on:blur={generateXml}>
                            <option value="">{l.editable}</option>
                            <option value="0">{l.hidden}</option>
                            <option value="1">{l.disabled}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="js_disable">{l.js}:</label>
                        <select class="form-control" id="js_disable" on:blur={generateXml}>
                            <option value="">{l.editable}</option>
                            <option value="0">{l.hidden}</option>
                            <option value="1">{l.disabled}</option>
                        </select>
                    </div>
                    <div class="float-right">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{l.done}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <input type="hidden" id="ansModeAnswer" value="" />
</div>