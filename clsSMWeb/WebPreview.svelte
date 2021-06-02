



<script> 
    let themeUrl = (window.baseThemeURL) ? window.baseThemeURL: window.baseUrlTheme;
    //import {Title, Content, Actions, InitialFocus} from '@smui/dialog';
    import { afterUpdate, onMount, beforeUpdate } from 'svelte';
    import { Button, Dialog } from 'svelte-mui/src';
    import Loader from '../helper/Loader.svelte';
    import {writable} from 'svelte/store';
    import l from '../../lib/Lang';
    import { AH } from '../helper/HelperAI.svelte';
    export const xml = window.uaXML && !/smans/gi.test(window.uaXML) ? window.uaXML : window.QXML;
    export let inQuizPlayer;
    export let editorState;
    let isPreview = "";
    // defines that editor is not initialized
    let rendered = 0;
    // contains the xml
    
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
    let splitter1 = '';
    let splitter2 = '';
    let splitter3 = '';
    let userAnswer = '';
    let isOldTestcase = false;
    let state = {};
    let stateData = writable({
        xml                         : '',
        uxml                        : '',
        module                      : '',
        toggle                      : false,
        snackback                   : false,
        lang_type                   : 'php',
        xmlArr                      : [],
        remediationToggle           : false,
        qxml                        : '',
        titleData                   : "", 
        stemData                    : "",
        remediationData             : "",
        goDark                      : (window.sessionStorage.goDark && window.sessionStorage.goDark == true ? true : false)
    });
        
    let unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

       
    // called every time when any props or state gets changed
    beforeUpdate(()=>{
        if (window.QXML) {
            if (window.isReviewMode) {
                let timer = setTimeout(function () {
                    // checks the answer and not allowed user to perform the task
                    setReview();
                    // clear the timeout 'timer'
                    clearTimeout(timer);
                }.bind(this), 1000);
            } else {
                let timer_next = setTimeout(function () {
                    // allowed user to perform the task in that editor which was not made readonly at the time of question creation
                    unsetReview();
                    // clear the timeout 'timer_next'
                    clearTimeout(timer_next);
                }.bind(this), 200);
            }
        }
    });

    afterUpdate(()=>{
        document.querySelectorAll('.CodeMirror').forEach(function(el,i){ el.CodeMirror.refresh(); });
    })

    function loadLibs() {
        if(!editorState) {
            AH.createLink('pe-items/svelte/clsSMWeb/libs/codemirror.min.css');
            AH.createLink('pe-items/svelte/clsSMWeb/libs/monokai.css');
            AH.createLink('pe-items/svelte/clsSMWeb/libs/simplescrollbars.css');
            AH.createLink('pe-items/svelte/clsSMWeb/libs/webitem.min.css');
        }
    }
    
    onMount(()=>{
        loadLibs()
        // used for mobile team
        if (window.inNative) {
            window.getHeight && window.getHeight();
         /*   jQuery('#html_pane').on('click', function () {
                jQuery(this).find('a').removeClass('active');
                jQuery('#css_panel,#js_panel').css('display', 'none');
                jQuery('#html_panel').css('display', 'block').find('a').addClass('active');
                let html_tags = htmlEditor.getValue();
                htmlEditor.setValue(html_tags);
            }); //Replaced*/
        
            document.querySelector('#html_pane').addEventListener('click',function(_this) {
                AI.select(_this).querySelector('a').classList.remove('active');
                document.getElementById('css_panel').style.display = 'none';
                document.getElementById('js_panel').style.display = 'none';
                document.getElementById('html_panel').style.display = 'block';
                let container = document.querySelect('#html_panel');
                container.querySelector('a').classList.add('active');
                let html_tags = htmlEditor.getValue();
                htmlEditor.setValue(html_tags);
            })


            /*jQuery('#css_pane').on('click', function () {
                jQuery(this).find('a').removeClass('active');
                jQuery('#html_panel,#js_panel').css('display', 'none');
                jQuery('#css_panel').css('display', 'block').find('a').addClass('active');
                let css_data = cssEditor.getValue();    
                cssEditor.setValue(css_data);
            });*/// Replaced

            document.querySelector('#html_pane').addEventListener('click',function(_this){
                let contain = AI.select(_this);
                contain.querySelect('a').classList.remove('active');
                document.getElementById('html_panel').style.display = 'none';
                document.getElementById('js_panel').style.display = 'none';
                let container = document.getElementById('css_panel');
                container.style.display = 'block';
                container.querySelector('a').classList.add('active');
                let css_data = cssEditor.getValue();    
                cssEditor.setValue(css_data);
            })  



        /*    jQuery('#js_pane').on('click', function () {
                jQuery(this).find('a').removeClass('active');
                jQuery('#css_panel,#html_panel').css('display', 'none');
                jQuery('#js_panel').css('display', 'block').find('a').addClass('active');
                let js_data = jsEditor.getValue();
                jsEditor.setValue(js_data);
            });  */

            document.querySelector('#js_pane').addEventListener('click',function(_this){
                let js_Pane = AI.select(_this);
                js_Pane.querySelector('a').classList.remove('active');
                document.getElementById('css_panel').style.display = 'none';
                document.getElementById('html_panel').style.display = 'none';
                let js_panel_container = document.getElementById('js_panel');
                js_panel_container.style.display = 'block';
                js_panel_container.querySelect('a').classlist.add('active');
                let js_data = jsEditor.getValue();
                jsEditor.setValue(js_data);

            })
            // conditon can be removed as its defined above
            if (window.inNative) {
                setTimeout(function () {
                    window.postMessage(`height___${document.getElementById("#mainContainer").offsetHeight}`, '*');
                }, 500);
            }
        }

        setTimeout(function () {
            if (typeof (CodeMirror) == "function") {
                // initialize the html, css and js editor by converting textareas having id 'html_editor', 'css_editor', 'js_editor' in html, css and js editor
                renderCodeMirror();
            } else {
                //jQuery(function () {
                    AI.ajax({
                        // Specifies the type of request
                        //type: "GET",
                        // Specifies the URL to send the request to
                        url: themeUrl + "pe-items/lib/codemirror.js",
                        // Denotes that request will not be handled asynchronously
                        //async: false,
                        // Denotes data type expected of the server response
                        //dataType: "script",
                        // Denotes that browser will cache the requested pages
                        //cache: true,
                        // Runs the function when the request succeeds
                        // success: function (data) {
                        //     let sc = document.createElement("script");
                        // // sets the data received from 'codemirror.js' file inside the script tag
                        //     sc.innerHTML = data;
                        // // appends this created script tag in body element of the document
                        //     document.body.appendChild(sc);   
                            // renderCodeMirror();
                        // }
                    }).then(function(data) {
                        let sc = document.createElement("script");
                        // sets the data received from 'codemirror.js' file inside the script tag
                            sc.innerHTML = data;
                        // appends this created script tag in body element of the document
                            document.body.appendChild(sc);   
                            renderCodeMirror();
                            // Fixed codemirror alignments
                            // document.querySelectorAll('.CodeMirror').forEach(function(el,i){
                            //     el.CodeMirror.refresh();
                            // })

                    }) 
                //});
            }
            //jQuery(function () {
                    AI.ajax({
                    // Specifies the type of request
                   // type: "GET",
                    // Specifies the URL to send the request to
                    url: themeUrl + "pe-items/lib/split.js",
                    // Denotes that request will not be handled asynchronously
                    //async: false, 
                   // // Denotes data type expected of the server response
                   // dataType: "script",
                    // Denotes that browser will cache the requested pages
                   // cache: true,
                    // Runs the function when the request succeeds
                /*    success: function (data) {
                        if (document.querySelector("#splitterWeb")) {
                            // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                            splitter();
                            // returns from the function to prevent from re-appened the code if it was already defined
                            return true;
                        }
                        // creates script element
                        let script_data = document.createElement("script");
                        // sets the data received from 'splitter.js' file inside the script tag
                        script_data.innerHTML = data;
                        // appends this created script tag in body element of the document
                        document.body.appendChild(script_data);
                        if (!inQuizPlayer) {
                            // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                            splitter();
                        } else {
                            // sets the width and floating property of the js, html, css and result editor
                            changeStyle();
                        }
                    }   */
                }).then(function(data){
                    if (document.querySelector("#splitterWeb")) {
                            // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                            splitter();
                            // returns from the function to prevent from re-appened the code if it was already defined
                            return true;
                        }
                        // creates script element
                        let script_data = document.createElement("script");
                        // sets the data received from 'splitter.js' file inside the script tag
                        script_data.innerHTML = data;
                        // appends this created script tag in body element of the document
                        document.body.appendChild(script_data);
                        if (!inQuizPlayer) {
                            // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                            splitter();
                        } else {
                            // sets the width and floating property of the js, html, css and result editor
                            changeStyle();
                        }
                });
            //});
        }, 500);

    /*    jQuery(document).off('click', '#answerCheck').on('click', '#answerCheck', function () {
            // shows the output of the code written on the editors and sets the value of state 'remediationToggle' to true for identify that remediation mode is on
            remediationMode();
        });  // Replaced*/
        AI.listen(document,'click','#answerCheck',function(){
            remediationMode();
        })

    /*    jQuery("#set-review").on('click', function () {
            // checks the answer and not allowed user to perform the task
            setReview();
        });  //Replaced (Fixed with XML Part)
    */
    

        // jQuery("#unset-review").on('click', function () {
        //     // allowed user to perform the task in that editor which was not made readonly at the time of question creation
        //     unsetReview(); //Replaced (Fixed with XML Part)
        // });
        
        


        window.save_data = function () {
            if (typeof (CodeMirror) == "function") {
                // shows the output of the code in 'Result' editor
                //self.runCode();
                answerCheckWeb();
            }
        }
        // it is used only re-render purpose as its value first changes but callback function again reset it its initial value
        
        state.goDark =!state.goDark;
    });

    function setReview() {
        // checks the answer
        answerCheckWeb();
        htmlEditor.setOption("readOnly", true);
        cssEditor.setOption("readOnly", true);
        jsEditor.setOption("readOnly", true);
    }

    function unsetReview() {
        if (typeof (CodeMirror) == "function") {
            htmlEditor.setOption("readOnly", (readHTML ? false : true));
            cssEditor.setOption("readOnly", (readCSS ? false : true));
            jsEditor.setOption("readOnly", (readJS ? false : true));
        }
    }

     // updates the xml
    function getChildXml(xml) {
        xml = xml;
    }

    
    function splitter() {
        // This code will running on mobile
        if (window.inNative) {
            return true;
        } else {
            // in case when js editor is visible and either html or css or both editor visible
            if (showJS && (showHTML || showCSS)) {
                // it is used to styled the splitter bar that exists on the left edge of the js editor
                // splitter1 = jQuery('#top_content').height(394).split({
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
                // splitter2 = jQuery('#firstEditorDiv').height(394).split({
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
                // it is used to styled the splitter bar that exists on the left edge of the result editor in case when only one html, js or css editor is visible
                // splitter3 = jQuery('#accordion').height(394).split({
                //     // Add a vertical splitter bar
                //     orientation: 'vertical',
                //     // Specify how many pixels where you can't move the splitter bar on the edge
                //     limit: 80,
                //     // Set the position of the splitter bar
                //     position: '60%'
                // });
                let Splitter3 = Split(['#accordion'],{
                sizes: [100],
                direction: 'vertical',
                //direction: "vertical",
            })
            }
        }

    }

     // sets the width and floating property of the js, html, css and result editor
    function changeStyle() {
        // used for mobile team
        if (window.inNative) {
            return;
        }
        if (showJS && (showHTML || showCSS)) {
            // sets the width 50% of html/css editor if only one exist otherwise sets width 50% of parent element which contains both editor that have id 'firstEditorDiv' and float left
           // jQuery("#firstEditorDiv")[0].style.cssText = "float:left;width:50%"; // Replaced
            document.getElementById("firstEditorDiv")[0].style.cssText = 'float:left;width:50%';
            // sets the width 50% of js editor and float left
            //jQuery("#jsEditorDiv")[0].style.cssText = "float:left;width:50%"; // Replaced
            document.getElementById("jsEditorDiv")[0].style.cssText = 'float:left;width:50%';
            // it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
            //jQuery("#top_content")[0].style.cssText = "clear:both;overflow:auto"; // Replaced
            document.getElementById("top_content")[0].style.cssText = "clear:both;overflow:auto"
        }
        if (showHTML && showCSS) {
            // it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
            //jQuery("#top_content")[0].style.cssText = "clear:both;overflow:auto"; // Replaced
           document.querySelector("#top_content")[0].style.cssText = 'clear:both;overflow:auto';
            // sets html editor's width 50% and float left
           // jQuery("#html_panel")[0].style.cssText = "float:left;width:50%"; // Replaced
            document.querySelector("#html_panel")[0].style.cssText = "float:left;width:50%";
            // sets css editor's width 50% and float left
           // jQuery("#css_panel")[0].style.cssText = "float:left;width:50%"; // Replaced
            document.querySelector("#css_panel")[0].style.cssText = "float:left;width:50%";
        }
        if ((showHTML + showCSS + showJS) == 1) {
            // sets css property  width 50% and float left of parent element that contains html, css and js editor 
            //jQuery("#top_content")[0].style.cssText = "float:left;width:60%";
            document.querySelector("#top_content")[0].style.cssText = "float:left;width:60%";
            // sets css property  width 40% and float left of element that contains result editor 
            document.querySelector("#bottom_content")[0].style.cssText = "float:left;width:40%";
            //jQuery("#bottom_content")[0].style.cssText = "float:left;width:40%";
        }
    }

    // changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
    function changeTheme() {
        // contains the checked status of the 'Dark Mode' checkbox
        let check = document.querySelector("#goDark").checked;
        // updates the value of state 'goDark' according to the value of variable 'check'
        state.goDark = check ;
        // stores the value of variable 'check' in 'goDark' variable of sessionStorage object
        window.sessionStorage.goDark = check;
        if (check) {
            htmlEditor.setOption("theme", "monokai");
            cssEditor.setOption("theme", "monokai");
            jsEditor.setOption("theme", "monokai");
        } else {
            htmlEditor.setOption("theme", "default");
            cssEditor.setOption("theme", "default");
            jsEditor.setOption("theme", "default");
        }
    }

    // updates the value of 'src' attribute of 'img', 'audio' and 'video' tag if any of these tags exist otherwise returns as it is
    function newSource() {
        let htmlData = htmlEditor.getValue();
        let video_and_audio_data = ['mp4', 'ogg', 'webm', 'mp3', 'wav'];
        let img_data = ['gif', 'tif', 'png', 'jpg', 'js'];
        htmlData = htmlData.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function (fullMatch, src) {
            if (src) {
                for (let i = 0; i < video_and_audio_data.length; i++) {
                    if (src.indexOf(video_and_audio_data[i]) > -1) {
                        // returns the data after updating the src value of audio and video tag to access it globally
                        return fullMatch.replace(src, 'https://s3.amazonaws.com/jigyaasa_content_stream/' + src);
                    }
                }
                for (let i = 0; i < img_data.length; i++) {
                    if (src.indexOf(img_data[i]) > -1) {
                        // retuns the data after updating the src value of 'img' tag o globally access it
                        return fullMatch.replace(src, 'https://s3.amazonaws.com/jigyaasa_content_static/' + src);
                    }
                }
            }
            // returns the html data after updating the 'src' value of 'img', 'video' and 'audio' tag
            return fullMatch;
        });
        // returns the html data if 'img', 'video' and 'audio' tag not exist
       //console.log({'data':htmlData})
        return htmlData;
    }

    // returns the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag and hides the 'Loading...' containing after load
    function prepareSource() {
        try {
            
            // contains the html editor value after updating the src value of img, video and audio tag
            let htmlData = "<div id='loader' style='position: fixed;width: 100%;height: 100vh;z-index: 9999;background-color:#fff;'>Loading...</div>" + newSource();

            let cssData = cssEditor.getValue();
            let jsData = jsEditor.getValue();
            cssData = cssData.replace(/url\(['"](.*?)['"]\)/g, 'url("https://s3.amazonaws.com/jigyaasa_content_static/$1")');
            jsData = jsData.replace(/src.*?["'](.*?)["']/gi, 'src = "https://s3.amazonaws.com/jigyaasa_content_static/$1"');
            jsData = `window.addEventListener("load", function(ev) {
                document.getElementById('loader').style.display = 'none';
            });${jsData}`;
            // contains the combined data of html, css and js editor
            let fullData = htmlData + "\<style\>" + cssData + "\<\/style\>\<script\>" + jsData + "\<\/script\>";
            return fullData;
        } catch (e) {
            console.log({ e, func: 'prepareSource@393' });
            return "";
        }
    } 

        // initialize the html, css and js editor by converting textareas having id 'html_editor', 'css_editor', 'js_editor' in html, css and js editor
        function renderCodeMirror() {
        if (rendered) {
            // returns true to prevent from re-initialize the editors if it was already initialized
            return true;
        }
        
        // initialize the css editor
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
        // used for set the value of html, css, js editors, makes editor readonly which was made disabled at the time of question creation, hide the editors which was made hidden at the time of questio creation and change the theme of html, css and js editors according to the check status of 'Dark Theme' checkbox
        parseXML();
        // used for mobile team
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
        if (typeof (htmlEditor) == "object" && !window.isReviewMode) {
            htmlEditor.on("change", function () {
                // used for update the user answer xml value when value of html editor gets changed and review mode is off
                saveWebAnswer(htmlEditor.getValue(), "html");
            });
        }
        if (typeof (cssEditor) == "object" && !window.isReviewMode) {
            cssEditor.on("change", function () {
                // used for update the user answer xml value when value of css editor gets changed and review mode is off
                saveWebAnswer(cssEditor.getValue(), "css");
            });
        }
        if (typeof (jsEditor) == "object" && !window.isReviewMode) {
            jsEditor.on("change", function () {
                // used for update the user answer xml value when value of js editor gets changed and review mode is off
                saveWebAnswer(jsEditor.getValue(), "js");
            });
        }
        // not sure why it is used as this id does not exist here
        if (document.getElementById("aXml")) {
            let xmlEditor = CodeMirror.fromTextArea(document.getElementById("aXml"), {
                lineNumbers: false,
                mode: "application/xml",
                autoCloseBrackets: true,
                lineWrapping: true,
                matchBrackets: true
            });
        }
        htmlEditor.setOption("extraKeys", {
            // Changing Tabs into 4 spaces 
            Tab: function (cm) {
                let spaces = Array(cm.getOption("indentUnit") + 3).join(" ");
                cm.replaceSelection(spaces);
            },
            // used for toggle between fullScreen but it not worked for me
            F11: function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            // used for remove the fullScreen mode but it not worked for me
            Esc: function (cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        });
        // defines that editor is initialized
        rendered = 1;
    }

    // shows the output of the code written on the editors and sets the value of state 'remediationToggle' to true for identify that remediation mode is on
    function remediationMode() {
        // sets the value of state 'remediationToggle' to true that indicates that remediation mode is on
       state.remediationToggle = true ;
        // shows the output of the code in 'Result' editor
        runCode();
    }

     // used for show the result of testcases
     function answerCheckWeb(isRun = true) {
        // contains rows of Remediation dialog box in each row 2 columns exist in first column testcase number defined and in second column their result status defined
        let case_result = [];
        // shows the output of the code in 'Result' editor according to the value of argument variable 'isRun'
        isRun ? runCode() : "";
        // contains the string defined in 'Testcases' field of 'Autograde' dialog box
        let get_test_cases = stringBetween(window.QXML, '<autograde type="testcase">', '</autograde>');
        // enters in this block if any testcase defined in 'Testcases' of 'Autograde' dialog box
        if (get_test_cases) {
            // contains the string if exist in variable 'get_test_cases' otherwise blank value contains
            get_test_cases = get_test_cases ? get_test_cases.trim() : "";
            // replaces string starts from '</case>' and ends at '<case>' with ';' and replaces single '</case>' or '<case>' with blank 
            get_test_cases = get_test_cases.replace(/<\/case>[\s\S]*?<case>/gm, ";").replace(/<\/case>|<case>/g, "");
            // contains array of defined testcses which exist in 'Testcases' field of 'Autograde' dialog box
            get_test_cases = get_test_cases.split(";");
            // loops through the each testcase
            for (let i in get_test_cases) {
                // enters in this block if testcase is defined in 'Testcases' field of 'Autograde' dialog box
                if (testcaseCheck(get_test_cases[i])) {
                    // pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Test Case' and result status as Passed if value returned by method testcaseCheck is true
                    case_result.push('<tr>' +
                        '<td>Test Case' + (parseInt(i) + 1) + '</td>' +
                        '<td>Passed</td>' +
                        '</tr>');
                } else {
                    // pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Test Case' and result status as Failed if value returned by method testcaseCheck is false
                    case_result.push('<tr>' +
                        '<td>Test Case' + (parseInt(i) + 1) + '</td>' +
                        '<td>Failed</td>' +
                        '</tr>');
                }
            }
        }
        // contains the testcases defined in 'Internal Script' field of 'Autograde' dialog box
        let get_internal_cases = stringBetween(window.QXML, '<autograde type="internal">', '</autograde>');
        // enters in this block if any testcase defined in 'Internal Script' of 'Autograde' dialog box
        if (get_internal_cases) {
            // contains string if exist in 'Internal Script' otherwise contains blank value
            get_internal_cases = get_internal_cases ? get_internal_cases.trim() : "";
            // replaces string starts from '</case>' and ends at '<case>' with ';' and replaces single '</case>' or '<case>' with blank 
            get_internal_cases = get_internal_cases.replace(/<\/case>[\s\S]*?<case>/gm, ";").replace(/<\/case>|<case>/g, "");
            // contains array of defined testcses which exist in 'Internal Script' field of 'Autograde' dialog box
            get_internal_cases = get_internal_cases.split(";");
            for (let i in get_internal_cases) {
                // pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Passed if value returned by method internalCheck is true
                if (internalCheck(get_internal_cases[i])) {
                    case_result.push('<tr>' +
                        '<td>Internal Case' + (parseInt(i) + 1) + '</td>' +
                        '<td>Passed</td>' +
                        '</tr>');
                } else {
                    case_result.push('<tr>' +
                        '<td>Internal Case' + (parseInt(i) + 1) + '</td>' +
                        '<td>Failed</td>' +
                        '</tr>');
                }
            }
        }
        // contains the testcases defined in 'External Script' field of 'Autograde' dialog box
        let get_external_cases = stringBetween(window.QXML, '<autograde type="custom">', '</autograde>');
        // enters in this block if any testcase defined in 'External Script' of 'Autograde' dialog box
        if (get_external_cases) {
            // contains the value of 'Extenal Script' field 
            let get_case = get_external_cases.replace(/<case>|<\/case>/gm, "");
            // pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Failed  if value returned by method externalCheck is true
            if (externalCheck(get_case)) {
                case_result.push('<tr>' +
                    '<td>External Case</td>' +
                    '<td>Passed</td>' +
                    '</tr>');
            } else {
                // pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Failed  if value returned by method externalCheck is false
                case_result.push('<tr>' +
                    '<td>External Case</td>' +
                    '<td>Failed</td>' +
                    '</tr>');
            }
        }
        // joins the array 'case_result' in string 
        let case_str = case_result.join("");
        // used for show the answer correct of incorrect in mobile
        let inNativeIsCorrect = null
        if (/Failed/gi.test(case_str)) {
            // uncheck the element have id 'answer' if 'Failed' string exist in result string
            //jQuery("#answer").prop("checked", false);
            AI.select("#answer").checked = false;
            // sets the value 'false' of variable 'inNativeIsCorrect' to show incorrect answer in mobile
            inNativeIsCorrect = false;
        } else {
            //jQuery("#answer").prop("checked", true);
            AI.select("#answer").checked = true;
            // sets the value 'true' of variable 'inNativeIsCorrect' to show correct answer in mobile
            inNativeIsCorrect = true;
        }
        // used for mobile team
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
        // used for mobile team
        if (window.inNative) { // replaced #special_module_user_xml
            window.postMessage(JSON.stringify({ userAnswers: document.getElementById("special_module_user_xml").value, inNativeIsCorrect }));
        }
        // defines the table containing the field 'Test Case' and 'Result' in table head and value stored in variable 'case_str' as body part of the table
        let reviewLayout = "<table style=\"width:500px;\" class=\"table\"><thead class=\"thead-inverse\"><tr><th>Test Case</th><th>Result</th></tr></thead>" + case_str + "</table>";
        // enters in this block if remediation mode is on
        if (state.remediationToggle) {
            // sets the table in element have id 'remediationModel' means in remediation dialog box
            //jQuery("#remediationModel").html(reviewLayout); // Replaced
            
            document.getElementById('remediationModel').innerHTML = reviewLayout;
        }
        // returns the defined table
        return (reviewLayout);
    }

     // returns true or false according to the matched value of testcase defined in 'Testcases' field of 'Autograde' dialog box
    function testcaseCheck(get_cases) {
        // contains the array after spliting by symbol '|'
        let caseArr = get_cases.split("|");
        // denotes that array argument passed
        let fInp = 0;
        // contains the name of the function defined in testcase
        let test_func = caseArr[0];
        // contains the arguments of the function defined in testcase
        let test_inp = caseArr[1];
        // contains return value of the function defined in testcase
        let test_oup = caseArr[2];
        // used for hold the error message
        let error = {};
        // used for contain the value of js editor
        let js_data = "";
        try {
            if (typeof (caseArr[1]) == 'string' && caseArr[1].indexOf('{arr') < 0) {
                // contains an array after replacing '{pip}' with '|' and spliting with comma
                test_inp = caseArr[1].replace('{pip}', '|').split(",");
            } else if (caseArr[1].indexOf('{arr') > -1) {
                // contains an array after replacing '{arr' or '}' with blank value and spliting with comma
                test_inp = (caseArr[1].replace(/\{arr|\}/g, '')).split(",");
                // updates value '1' to denote that array argument passed
                fInp = 1;
            } else {
                // contains the arguments of the function defined in testcase
                test_inp = caseArr[1];
            }
            // contains the value of js editor after removing white space from start and end of the string
            js_data = jsEditor.getValue().trim();
            // removes all the text that exist in same line starting from 'document.write' string of js editor value 
            js_data = js_data.replace(/document\.write.*/gm, '');
            // if function name, argument of the function or value of function return is not declaired in testcase then without checking answer it returns from function by returning value 'false'
            if (!test_func || !test_inp || !test_oup) {
                // sets the error message
                error["validation"] = "Invalid Test Cases";
                // returns value false
                return false;
            }
            // if type of the function is undefined then also returns from function without checking the answer after setting error message
            if (typeof (test_func) == undefined) {
                error["func_check"] = "Function case is undefined";
                return false;
            }
            // pattern for contain the 
            let re = new RegExp("function " + test_func + ".*?\\)", "g");
            // array for hold the matched text return by the 'exec' method
            let params = [];
            // contains the text that matches in js editor value for pattern defined in variable 're'
            params = re.exec(js_data);
            // converts array 'params' into string
            params = params.join();
        } catch (err) {
            // holdes error mesaage in case of any error occurred
            error['function_exist'] = "Given Function doesn't exist";
        }
        // used for contains the js editor value and function call string with arguments
        let eval_str = "";
        try {
            if (typeof (inp) == 'array' || typeof (inp) == 'object' && !fInp) {
                // contains js editor value and calls function with argument defined in testcase after joining the argument in string and wrapping in parenthesis if it is object
                eval_str = js_data + '\n' + test_func + '(' + test_inp.join() + ');';
            } else if (fInp) {
                // contains js editor value and calls function with argument defined in testcase after wrapping the argument in square bracket then in parenthesis if value of variable 'fInp' holds 1
                eval_str = js_data + '\n' + test_func + '([' + test_inp + ']);';
            } else {
                // contains js editor value and calls function with argument defined in testcase after wrapping argument in parenthesis 
                eval_str = js_data + '\n' + test_func + '(' + test_inp + ');';
            }
            // evalute the string hold in variable 'eval_str' and contains its output
            let actual_outp = eval(eval_str);
            // returns true/false if evaluated value mathches with function return value defined in testcase
            if (actual_outp == test_oup) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            // sets the error message in case of error 
            error['output_error'] = err;
            // returns from function by returning value 'false'
            return false;
        }
    }

     // splite the testcase and returns the array according to the value of old or new testcase format for match html or css
    function splitCase(caseData, type) {
        if (type == 'style') {
            if (caseData.includes("$")) {
                // indicates the it is new testcase format for css match
                isOldTestcase = false;
                // splite from symbol '$' and returns the array
                return caseData.split("$");
            } else {
                // indicates the it is old testcase format for css match
                isOldTestcase = true;
                // splite from symbol '{' and returns the array
                return caseData.split("{");
            }
        } else {
            if (caseData.includes("?")) {
                // indicates the it is new testcase format for html match
                isOldTestcase = false;
                // splite from symbol '?' and returns the array
                return caseData.split("?");
            } else {
                // indicates the it is old testcase format for html match
                isOldTestcase = true;
                // splite from symbol '|' and returns the array
                return caseData.split("|");
            }
        }
    }

    // returns '0' or '1' according to the match status of the testcase in html editor
    function checkOldAttrTestCase(pattern, outp, min, part) {
        // array containing all the matched string in html editor defined in matching pattern
        let matchHtml = htmlEditor.getValue().match(pattern);
        // used for define the testcase result status 
        let result = 0;
        if (matchHtml) {
            if (part) {
                // creates temporary array for hold the matched data
                let tempMatch = [];
                matchHtml.map((value) => {
                    if (value.replace(/\s/g, '').includes(part.replace(/\s/g, ''))) {
                        tempMatch.push(value);
                    } else {
                        console.log(value, part);
                    }
                });
                // updates the value of variable 'matchHtml'
                matchHtml = tempMatch;
            }
            if (min) {
                // holds '0' if number of matched occurence is less than min value otherwise holds 1
                result = matchHtml.length < outp ? 0 : 1;
            } else {
                // holds '0' if number of occurence is greater than max value otherwise holds 1
                result = matchHtml.length > outp ? 0 : 1;
            }
        }
        // returns the value of variable result
        return result;
    }

    // returns '0' or '1' according to the match status of the testcase in html editor
    function checkNewTestCase(min, counter, outp) {
        // used for define the testcase result status 
        let result = 1;
        if (min) {
            // holds '0' if number of matched occurence is less than min value
            if ((counter) < outp) {
                result = 0;
            }
        } else {
            // holds '0' if number of matched occurence is greater than max value
            if ((counter) > outp) {
                result = 0;
            }
        }
        // holds '0' too if counter value is 0
        if (counter == 0) {
            result = 0;
        }
        // returns the result value
        return result;
    }

    // used for call the 'attr_match', 'style_match' or 'str_match' method with required arguments and returns the value according to the return value of these methods
    function internalCheck(get_cases) {
        // splite the testcase and returns the array according to the value of old or new testcase format for match html or css
        let caseArr = splitCase(get_cases);
        let str = "", i;
        if (caseArr[0].indexOf("style_match") > -1) {
            // returns true or false according to the return value of method 'style_match'
            return style_match(caseArr[1], caseArr[2], caseArr[3]);
        } else if (caseArr[0].indexOf("attr_match") > -1) {
            // enters in this block in case of string matched in defined tag and that tag contains character '?'
            if (caseArr.length > 4) {
                for (i = 2; i < (caseArr.length - 1); i++) {
                    if (i == 2) {
                        // adds the string defined in array 'caseArr' at index '2' in string defined in variable 'str'
                        str = str + caseArr[i];
                    } else {
                        // adds the character '?' and string defined in array 'caseArr' at index equals to the value of variable 'i' in string defined in variable 'str'
                        str = str + '?' + caseArr[i];
                    }
                }
                // returns true of false according to the return value of method 'attr_match'
                return attr_match(caseArr[1], str, caseArr[(caseArr.length - 1)]);
            } else {
                // returns true of false according to the return value of method 'attr_match'
                return attr_match(caseArr[1], caseArr[2], caseArr[3]);
            }
        } else {
            // enters in this block in case of string matched anywhere in whole html or js editor and that editor contains character '?'
            if (caseArr.length > 4) {
                for (i = 2; i < (caseArr.length - 1); i++) {
                    if (i == 2) {
                        // adds the string defined in array 'caseArr' at index '2' in string defined in variable 'str'
                        str = str + caseArr[i];
                    } else {
                        // adds the character '?' and string defined in array 'caseArr' at index equals to the value of variable 'i' in string defined in variable 'str'
                        str = str + '?' + caseArr[i];
                    }
                }
                // returns true of false according to the return value of method 'str_match'
                return str_match(caseArr[1], str, caseArr[(caseArr.length - 1)]);
            } else {
                // returns true of false according to the return value of method 'str_match'
                return str_match(caseArr[1], caseArr[2], caseArr[3]);
            }
        }
    }


     // returns true or false according to the match property value of defined css selector
    function style_match(src, selector, inp) {
        // denotes the status of the testcase according to the matched value
        let flag_check = 1;
        // Window object that allows to access the iframe's document and its internal DOM
        let frameDoc = document.getElementsByClassName('result_frame')[0].contentWindow.document;
        // enters in this block if pseudo selector used
        if (selector.indexOf("::") > -1) {
            // array of pseudo selector
            let pseudo_elm = selector.split('::');
            // string containing pseudo class with prefix ':'
            let str = ':' + pseudo_elm[1];
            // selects element on which pseudo selection applied
            let pseudo_elm_selector = pseudo_elm[0];
        }
        let indx, new_class, new_selector, new_tag_name;
        // enters in this block if hover, active or visited pseudo class applied
        if (selector.indexOf(':hover') > -1 || selector.indexOf(':visited') > -1 || selector.indexOf(':active') > -1) {
            // contains the last index of colon in pseudo selector
            indx = selector.lastIndexOf(':');
            // selects the element on which pseudo classes applied
            new_selector = selector.substring(0, indx);
            // contains the value of pseudo class
            let class_name = selector.substring((indx + 1), selector.length);
            // contains the value of pseudo class with prefix '.'
            new_class = '.' + class_name;
            if (frameDoc.querySelector(new_selector)) {
                // contains the name of the tag on which pseudo selection applied
                new_tag_name = frameDoc.querySelector(new_selector).nodeName.toLowerCase();
                // creates the element defined in variable 'new_tag_name'
                let create_elm = document.createElement(new_tag_name);
                // sets the class attribute with value of pseudo class
                create_elm.setAttribute('class', class_name);
                // append the created element in body tag that exist in iframe of result field
                frameDoc.querySelector('body').appendChild(create_elm);
            } else {
                // if element not found on which pseudo selection applied then returns false
                return false;
            }
            // pattern for matching the value of starts with defined pseudo selector and any number of space between pseudo selector and opening curly brace and any value containing in curly brace including braces
            let patt = new RegExp(selector + '[ ]*{([\\s\\S]*?)}', "");
            // contains the text matched in style tag defined in variable 'patt' after removing new line character
            let is_matched = frameDoc.querySelector('style').innerHTML.replace(/\\n/, "").match(patt);
            // enters in this block if matching found
            if (is_matched) {
                // containing the value defined with pseudo selector in curly brace excluding braces
                let prop_and_val = frameDoc.querySelector('style').innerHTML.replace(/\\n/, "").match(patt)[0].replace(patt, function (fullmatch, propsNval) {
                    // returns value exist inside curly brace
                    return propsNval;
                });
                // creates textNode containing value of variable 'new_class' and value of variable 'prop_and_val' after wraping it in curly brace
                let txt = document.createTextNode(new_class + '{' + prop_and_val + '}');
                // append this text to style tag
                frameDoc.querySelector('style').appendChild(txt);
            } else {
                // return false if defined pattern not matched in style tag
                return false;
            }
        }
        // used for select the element
        let data;
        if (new_class && frameDoc.querySelector('style').innerHTML.replace(/\\n/, "").match(new_class)) {
            // selects element have class attribute that is equals to the value of variable 'new_class'
            data = frameDoc.querySelector(new_class);
        } else if (pseudo_elm_selector) {
            // selects element with tag name that is equals to the value of variable 'pseudo_elm_selector'
            data = frameDoc.querySelector(pseudo_elm_selector);
        } else {
            // selects element with css selector defined in variable 'selector'
            data = frameDoc.querySelector(selector);
        }
        // splite the testcase and returns the array according to the value of old or new testcase format for match css
        let input = splitCase(inp, 'style');
        // contains the value of css property that exist in array 'input' at index '0'
        let outp = input[1];
        // for contain the value of css property of defined css selector
        let checkStyle;
        // enters in this block if pseudo class defined
        if (str) {
            // enters in this block if selector element defined
            if (data) {
                // contains the value of css property defined in array 'input' at index '0' of element that is stored in variable 'data' and have pseudo class which is equals to the value of variable 'str'
                checkStyle = window.getComputedStyle(data, str).getPropertyValue(input[0]);
            }
        } else {
            // enters in this block if selector element defined
            if (data) {
                // contains the value of css property defined in array 'input' at index '0' of element that is stored in variable 'data'
                checkStyle = window.getComputedStyle(data).getPropertyValue(input[0]);
            }
        }
        // enters in this block if pseudo class exist
        if (selector.indexOf(':hover') > -1 || selector.indexOf(':visited') > -1 || selector.indexOf(':active') > -1) {
            // selects the element that have class which is previously defined using pesudo class
            let delete_elm = frameDoc.getElementsByClassName(class_name)[0];
            // removes the element have class which is equals to the value of variable 'delete_elm'
            delete_elm.parentNode.removeChild(delete_elm);
            // removes the textNode from style tag that was previously added
            frameDoc.querySelector('style').innerHTML = frameDoc.querySelector('style').innerHTML.replace(/\\n/gm, "").replace(txt.textContent, "");
        }
        // sets the value '0' of variable 'flag_check' if defined value of testcase css property is not equals to the matched value of css property for defined css selector
        if (checkStyle != outp) {
            flag_check = 0;
        }

        // returns true of false according to the value of variable 'flag_check'
        if (flag_check) {
            return true;
        } else {
            return false;
        }
    }

    // used for return the result status of the testcases defined for match in html editor  
    function attr_match(src, inp, outp) {
        let flag_check = 1, // by default sets the value 1 that indicates that matching is ok
            // denotes that tag matching is required
            singular = 0,
            // denotes that string matching is required in defined tag 
            justString = 0,
            // denotes that attribute matching is required of defined tag 
            hasTagsAttribute = 0,
            // denotes that attribute and their value matching is required of defined tag 
            hasTagsAttributeValue = 0,
            // denotes that 'max' flag is not enabled
            max = false,
            // denotes that 'min' flag is not enabled
            min = false;
        let i;
        try {
            if (inp.indexOf("{1}") > -1) {
                // denotes that testcase is defined for match tag in html editor
                singular = 1;
                // removes the flag '{1}' from testcase string
                inp = inp.replace("{1}", "");
            }
            if (inp.indexOf("{2}") > -1) {
                // denotes that testcase is defined for match string in defined tag in html editor
                justString = 1;
                // removes the flag '{2}' from testcase string
                inp = inp.replace("{2}", "");
            }
            if (inp.indexOf("{3}") > -1) {
                // denotes that testcase is defined for match only attribute not their value of defined tag in html editor
                hasTagsAttribute = 1;
                // removes the flag '{3}' from testcase string
                inp = inp.replace("{3}", "");
            }
            if (inp.indexOf("{4}") > -1) { //if check value of attribute only
                // denotes that testcase is defined for match attribute and their value of defined tag in html editor
                hasTagsAttributeValue = 1;
                // removes the flag '{4}' from testcase string
                inp = inp.replace("{4}", "");
            }
            if (outp.indexOf('min') > -1) {
                // denotes that 'min' flag is enabled
                min = true;
                // removes the 'min' text from defined flag and contains the numeric value only
                outp = parseInt(outp.replace('min', ''));
            } else if (outp.indexOf('max') > -1) {
                // denotes that 'max' flag is enabled
                max = true;
                // removes the 'max' text from defined flag and contains the numeric value only
                outp = parseInt(outp.replace('max', ''));
            }
            if (src == "HTML") {
                // Window object that allows to access the iframe's document and its internal DOM
                let frameDoc = document.getElementsByClassName('result_frame')[0].contentWindow.document;
                // in case of tag match enters in this block
                if (singular) {
                    // contains number of matching tag exist
                    let lengthCheck = frameDoc.getElementsByTagName(inp).length;
                    // enters in this block in case of min flag is enabled
                    if (min) {
                        // sets the value of variable flag_check '0' in case of defined min value is greater than number of matching tag
                        if (lengthCheck < outp) {
                            flag_check = 0;
                        }
                    } else {
                        // sets the value of variable flag_check '0' in case of defined max value is less than number of matching tag
                        if (lengthCheck > outp) {
                            flag_check = 0;
                        }
                    }
                } else {
                    let tag_name, allCheck, counter = 0, str_data = "", match_str = "";
                    // enters in this block in case of testcase defined for match string in perticular tag
                    if (justString) {
                        // contains an array after spliting testcase value with '{'
                        tag_name = inp.split('{');
                        if (tag_name.length > 2) {
                            for (i = 1; i < tag_name.length; i++) {
                                if (i == 1) {
                                    // adds the string defined in array tag_name at index '1' in string 'str_data'
                                    str_data = str_data + tag_name[i];
                                } else {
                                    // adds the string '{' and string defined in array tag_name at index equals to the value of variable 'i' in string 'str_data'
                                    str_data = str_data + '{' + tag_name[i];
                                }
                            }
                            // adds the string 'str_data' in string 'match_str'
                            match_str = match_str + str_data;
                        } else {
                            // adds the string defined in array tag_name at index '1' in string 'match_str'
                            match_str = match_str + tag_name[1];
                        }
                        // enters in this block if testcase is defined in old format
                        if (isOldTestcase) {
                            // creates pattern to match the string inside any tag
                            let checkHtml = new RegExp(`<.*?>(${tag_name[0]})<\/.*?>`, 'gi');
                            // contains '0' or '1' according to the match status of the testcase in html editor
                            flag_check = checkOldAttrTestCase(checkHtml, outp, min);
                        } else {
                            // selects all tag in which string existing have to check
                            allCheck = frameDoc.querySelectorAll(tag_name[0]);
                            // loops through the available tags in which string existing have to check
                            for (i = 0; i < allCheck.length; i++) {
                                if ((allCheck[i].innerHTML).toLowerCase().replace(/\s+/gm, '').trim().indexOf((match_str).toLowerCase().replace(/\s+/gm, '').trim()) > -1) {
                                    // increases the value of variable counter by 1 if string exist in defined tag
                                    counter++;
                                }
                            }
                            // contains '0' or '1' according to the match status of the testcase in html editor
                            flag_check = checkNewTestCase(min, counter, outp);
                        }
                    } else if (hasTagsAttribute) {
                        // contains the array of testcase
                        tag_name = inp.split('{');
                        if (isOldTestcase) {
                            // pattern for match the desize attribute containing any value
                            let attrReg = new RegExp(`${tag_name[0]}(\\s*=\\s*)["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?`, 'gi');
                            // contains '0' or '1' according to the match status of the testcase in html editor
                            flag_check = checkOldAttrTestCase(attrReg, outp, min);
                            if (!flag_check) {
                                // pattern for match the whole value starts from character '<' and ends at '>'
                                let nextTry = new RegExp(`<(\\w+)(.*?)>`, 'gi');
                                // array containing matched string in html editor
                                let matchText = htmlEditor.getValue().match(nextTry);
                                // sets true of false according to the value of array matchText at index 0 and it contains the name of the attribute defined in array tag_name at index 0
                                flag_check = matchText[0] && matchText[0].includes(tag_name[0]) ? true : false;
                            }
                        } else {
                            // selects all tags in iframe that is defined in testcase 
                            allCheck = frameDoc.querySelectorAll(tag_name[0]);
                            for (i = 0; i < allCheck.length; i++) {
                                if (allCheck[i].hasAttribute(tag_name[1])) {
                                    // increases the value of counter if attribute matched in any tag defined in testcase
                                    counter++;
                                }
                            }
                            // contains '0' or '1' according to the match status of the testcase in html editor
                            flag_check = checkNewTestCase(min, counter, outp);
                        }
                    } else if (hasTagsAttributeValue) {
                        // contains the array of testcase
                        tag_name = inp.split('{');
                        if (isOldTestcase) {
                            // array contains attribute at index '0' and its value at index '1'
                            tag_name = inp.split('$');
                            // pattern for match the desize attribute containing any value
                            let attrValueReg = new RegExp(`${tag_name[0]}(\\s*=\\s*)["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?`, 'gi');
                            // contains '0' or '1' according to the match status of the testcase in html editor
                            flag_check = checkOldAttrTestCase(attrValueReg, outp, min, tag_name[1]);
                        } else {
                            // selects all tags in iframe that is defined in testcase 
                            allCheck = frameDoc.querySelectorAll(tag_name[0]);
                            for (i = 0; i < allCheck.length; i++) {
                                // contains the value of defined attribute 
                                let a = allCheck[i].getAttribute(tag_name[1]) ? allCheck[i].getAttribute(tag_name[1]) : "";
                                // removes the semicolon from value of defined attribute
                                a = a.replace(/;/g, '');
                                let urlPrefixReg = new RegExp(/https:\/\/s3.amazonaws.com\/jigyaasa_content_stream\/|https:\/\/s3.amazonaws.com\/jigyaasa_content_static\//,'gm'); // regx returning the comparing of url stream/static
                                if (a.replace(/\s+/g, '').trim().replace(urlPrefixReg, "") == tag_name[2].replace(/\s+/g, '').trim()) {
                                    // increases the value of counter by 1 if matched value of defined attribute is equals to the value of defined value in testcase
                                    counter++;
                                }
                            }
                            // contains '0' or '1' according to the match status of the testcase in html editor
                            flag_check = checkNewTestCase(min, counter, outp);
                        }
                    }
                }
            }
            // returns true or false according to the value of variable flag_check
            return (flag_check ? true : false);
        } catch (error) {
            // message the log on console in case of any error occured
            console.log({ error, func: 'attr_match', 'Cause': 'Old Case, need to convert like attr_match?HTML?TAG{ATTR{Value{MatchType}?MAX/MIN' });
            // returns false in case of any error occured
            return false;
        }
    }

     // used for match testcase string in whole html/js editor in case of html/js and in case of css it matches the media query, css selector and css property defined together in whole css editor 
    function str_match(src, inp, outp) {
        // indicates that string is matched in html/js editor according to the value of argument variable 'src'
        let flag_check = 1,
            singular = 0,
            justString = 0,
            complexTags = 0,
            tag_data = "",
            max = false,
            min = false;
        let input_data = inp;
        if (inp.indexOf("{1}") > -1) {
            // it is not in use for this function
            singular = 1;
            // removes the flag '{1}' from testcase string
            inp = inp.replace("{1}", "");
        }
        if (inp.indexOf("{2}") > -1) {
            // it is not in use for this function
            justString = 1;
            // removes the flag '{2}' from testcase string
            inp = inp.replace("{2}", "");
        }
        if (inp.indexOf("{3}") > -1) {
            // it is not in use for this function
            complexTags = 1;
            // removes the flag '{3}' from testcase string
            inp = inp.replace("{3}", "");
        }
        if (outp.indexOf('min') > -1) {
            // indicates that 'min' flag is enable
            min = true;
            // removes the 'min' text from defined flag and contains the numeric value
            outp = parseInt(outp.replace('min', ''));
        } else if (outp.indexOf('max') > -1) {
            // indicates that 'max' flag is enable
            max = true;
            // removes the 'max' text from defined flag and contains the numeric value
            outp = parseInt(outp.replace('max', ''));
        }
        // contains array of each character
        let word_arr = inp.split("");
        for (let i = 0; i < word_arr.length; i++) {
            if (word_arr[i].match(/\W/g)) {
                // adds flag '\\' before non word character 
                word_arr[i] = "\\" + word_arr[i];
            }
        }
        // converts array 'word_arr' into string after applying flag '\\' before non word character
        inp = word_arr.join("");
        // in case of 'str_match' in html, string matched in whole html part so no need of this block
        if (src == 'HTML') {
            // contains the testcase data that have to be match
            tag_data = inp;
            // contains string data that have to be match
            inp = justString ? inp : (complexTags ? "\<" + inp + ".*?\>.*?\<\/" + inp + "\>" : (singular ? '<' + inp.replace('[', ' ').replace(']', '') + '(| |\/| \/)>' : '<' + inp.replace('[', ' ').replace(']', '') + '>' + '.*?\<\/' + tag_data + '\>'));
        }
        // contains pattern to be match defined testcase in 
        let re = "",
            // container for hold the html editor value
            html_tags = "",
            // container for hold the css editor value
            css_data = "",
            // container for hold the js editor value
            js_data = "";
        try {
            // contains new RegExp object for match defined string globally
            re = new RegExp(inp, "g");
            html_tags = htmlEditor.getValue().trim();
            css_data = cssEditor.getValue().trim();
            js_data = jsEditor.getValue().trim();
            css_data = css_data.replace(/\n/gm, '');
            js_data = js_data.replace(/\ /g, '');
        } catch (e) {
            // returns back in case of any error
            return false;
        }
        if (src == 'HTML') {
            if (html_tags.match(re)) {
                if (html_tags.match(re).length == outp && html_tags) {
                    flag_check = 1;
                } else if (html_tags.match(re).length <= outp && html_tags && html_tags.match(re).length && max) {
                    flag_check = 1;
                } else if (html_tags.match(re).length >= outp && html_tags && html_tags.match(re).length && min) {
                    flag_check = 1;
                } else {
                    flag_check = 0;
                }
            } else {
                flag_check = 0;
            }
        } else if (src == 'CSS') {
            // contains the array of matching data
            input_data = input_data.split('{');
            // creates an array for contain the defined media queries
            let media_arr = [];
            // initialize the counter
            let counter = 0;
            // removes space from the value of css editor that exist inside parenthesis
            css_data = css_data.replace(/\(.*?\)/gm, function (match_data) { return match_data.replace(/[ ]/gm, ""); });
            // replaces '@' with '\n@'
            css_data = css_data.replace(/@/gm, '\n@');
            // contains the media data that starts from character '@' and ends before first curly brace 
            css_data = css_data.replace(/@([\s\S]*?){([\s\S]*?){([\s\S]*?)}([\s\S]*?)}/gm, function (match_data, media_data) {
                // contains meida query data that starts from character '@' and ends before first curly brace 
                let find_media_data = media_data;
                // contains an array of string defined in variable 'find_media_data' after spliting it with white space character
                find_media_data = find_media_data.split(" ");
                // array for store media data that are stored in array 'find_media_data' after removing blank values
                let store_data = [];
                for (let i = 0; i < find_media_data.length; i++) {
                    if (find_media_data[i] != "") {
                        // pushes data into array 'store_data' which is defined in array 'find_media_data' at index equals to the value of variable 'i'
                        store_data.push(find_media_data[i]);
                    }
                }
                // contains string after joining array 'store_data 'with' white space
                store_data = store_data.join(" ");
                // replaces old media data with new one after removing unnecessary more that one white space that comes together
                match_data = match_data.replace(media_data, store_data);
                // pushes the matched media query data into array 'media_arr'
                media_arr.push(match_data);
                // returns updated defined media queries data
                return match_data;
            });
            // loops through number of defined media query in css editor
            for (let j = 0; j < media_arr.length; j++) {
                // checks for match the media data defined in testcase with media data exist in array 'media_arr' at index equals to the value of variable 'j'
                let media_match = media_arr[j].indexOf(input_data[0].trim());
                // enters in this block if media query matched with the data defined in array 'media_arr' at index equals to the value of variable 'j'
                if (media_match > -1) {
                    // contains the css selector
                    let selector_match;
                    // goes inside this block if multiple selector defined in testcase
                    if (input_data[1].indexOf(',') > -1) {
                        // contains array of all selector that defined in testcase
                        let sub_input = input_data[1].split(",");
                        for (let i = 0; i < sub_input.length; i++) {
                            // contains index of css selector, defined in array 'sub_input' at index equlas to the value of variable 'i', in array 'media_arr' at index equals to the value of variable 'j'
                            selector_match = media_arr[j].indexOf(sub_input[i].trim());
                            // exist from loop if variable 'selector_match' contains value less than '0' means if any css selector does not exist in array 'media_arr' at index equals to the value of variable 'j' 
                            if (selector_match < 0) {
                                break;
                            }
                        }
                    } else {
                        // contains index of css selector in array 'media_arr' at index equals to the value of variable 'j' in case of single css selector defined
                        selector_match = media_arr[j].indexOf(input_data[1].trim());
                    }
                    // enters in this block if selector matches in media query's string defined in array 'media_arr' at index equals to the value of variable 'j'
                    if (selector_match > -1) {
                        // contains the index of property string defined in media query that exist in array 'media_arr' at index equals to the value of variable 'j'
                        let find_str = media_arr[j].indexOf(input_data[2].trim());
                        // identify that property matched or not, initially defined that it is not matched
                        let prop_match = false;
                        // enters in this block if property string exist in array 'media_arr' at index equals to the value of variable 'j'
                        if (find_str > -1) {
                            // instead of this only variable 'find_str' can be used as contains the same value
                            let find_str_index = media_arr[j].indexOf(input_data[2].trim());
                            // contains the character exist at index equals to the value of variable 'find_str_index' by reducing 1
                            let prop_data = media_arr[j].charAt((find_str_index - 1));
                            // enters in this block for indicate that property matched if property is not combined with any other word such as in case of 'color' property then it will ignore 'background-color' property
                            if (prop_data !== '-') {
                                prop_match = true;
                            }
                        }
                        // enters in this block if property matched in array 'media_arr' at index equals to the value of variable 'j'
                        if (prop_match) {
                            // increments value of variable 'counter' by 1
                            counter = counter + 1;
                        }
                    }
                }
            }
            if (counter == outp) {
                return true;
            } else {
                return false;
            }
        } else {
            if (js_data.match(re)) {
                if (js_data.match(re).length == outp) {
                    flag_check = 1;
                } else if (js_data.match(re).length <= outp && js_data && js_data.match(re).length && max) {
                    flag_check = 1;
                } else if (js_data.match(re).length >= outp && js_data && js_data.match(re).length && min) {
                    flag_check = 1;
                } else {
                    flag_check = 0;
                }
            } else {
                flag_check = 0;
            }
        }
        if (flag_check) {
            return true;
        } else {
            return false;
        }
    }


    // used for check the result status of 'External Script' defined in 'Autograde' dialog box
    function externalCheck(get_cases) {
        try {
            // contains RegExp pattern for match the string 'var flagONN'
            let re = /var flagONN/gm;
            // contains the value of js editor
            let js_data = jsEditor.getValue().trim();
            js_data = js_data.replace(/^.*?body.*?\\n/gm, '');
            // removes all the text that exist in same line starting from 'document.write' string of js editor value 
            js_data = js_data.replace(/document\.write.*/gm, '');
            // contains the value after evaluate the script
            let result;
            if (!re.test(get_cases)) {
                // contains the value return by the script defined in js editor and in 'External Script' field of 'Autograde' dialog box
                result = eval(js_data + '\n' + get_cases);
            } else {
                // contains the value return by the script defined in 'External Script' field of 'Autograde
                result = eval(get_cases);
            }
            // returns the value stored in variable 'result'
            return result;
        } catch (err) {
            // shows log message in case of any error occurred
            console.log({ msg: err, func: 'externalCheck@1108' });
            // returns false in case of any error occurred
            return false;
        }
    }

     // returns the text defined between opening and closing tag that is passed at the time of function call in string passed at first argument at the time of function call (basically in xml)
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

    // used for unrender the player tag
    function unRenderPlayer() {
        // makes player tag empty that exist inside element have id: authoringDiv
       // jQuery('#authoringDiv player').empty(); // Replaced
        AI.empty('#authoringDiv player');
        // removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
       // jQuery('#authoringDiv').find('player').removeClass('hidecontent'); // Replaced
        AI.select('#authoringDiv').querySelector('player').classList.remove('hidecontent');



    /*    jQuery('#editor img').each(function () {
            if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                // sets the value of 'src' attribute of img tag that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static'
                jQuery(self).attr('src', jQuery(self).attr('src'));  // Replaced
            }
        });
    */

        document.querySelector('#editor img').forEach(function(_this,i){
            if (!_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                _this.setAttribute('src',_this.getAttribute('src'));
            }
        })
    }

    // used for render the player tag
    function renderPlayer() {
        // makes player tag empty that exist inside element have id: authoringDiv
        //jQuery('#authoringDiv player').empty(); // Replaced
        AI.empty('#authoringDiv player');
        // used for set the data of player tag
      //  tag_player(jQuery('#authoringDiv')); // Replaced
          tag_player(document.querySelect('#authoringDiv'));
        // adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
       // jQuery('#authoringDiv').find('player').addClass('hidecontent'); // Replaced
        AI.select('#authoringDiv').querySelector('player').classList.add('hidecontent');

    /*    jQuery('#editor img').each(function () {
            if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                // sets the value of 'src' attribute of img tag by adding string '//s3.amazonaws.com/jigyaasa_content_static/' before its previous src that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static'
                jQuery(self).attr('src', '//s3.amazonaws.com/jigyaasa_content_static/' + jQuery(self).attr('src'));
            }
        }); Replaced
    */
        document.querySelector('#editor img').forEach(function(_this,i){
            if(!_this.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                _this.getAttribute('src','//s3.amazonaws.com/jigyaasa_content_static/'+_this.getAttribute('src'));
            }
        })
    }

    // shows the output of the code in 'Result' editor
    function runCode() {
       // jQuery('html, body').animate({ scrollTop: jQuery('#result_div').offset().top }, 'slow'); // Replaced
        window.scroll({
            top: 500,
            behavior: 'smooth'  
        });
        let date = new Date();
        date = date.getTime();
        let iframeId = "uC" + date;
     //   jQuery('#result_div').html('<iframe class="result_frame w-100 border-0" style="height:347px" id="' + iframeId + '"></iframe>'); //Replaced
     document.querySelector('#result_div').innerHTML = '<iframe class="result_frame w-100 border-0" style="height:347px" id="' + iframeId + '"></iframe>';
        // returns the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag and hides the 'Loading...' containing after load
        let source = prepareSource();
        let iframe = document.querySelector('#uC' + date);
        iframe.onload = answerCheckWeb.bind(this, false);
        let iframe_doc = iframe.contentDocument;
        iframe_doc.open();
        iframe_doc.write(source);
        iframe_doc.close();
    }

    // makes blank the value of user answer xml and also of html,css and js editors but this method is not called from any where within the component
    function reset() {
        // makes blank the value of html editor
        htmlEditor.setValue("");
        // makes blank the value of css editor
        cssEditor.setValue("");
        // makes blank the value of js editor
        jsEditor.setValue("");
        // makes blank value of user answer xml
     //   jQuery("#special_module_user_xml").val(""); // Replaced
    if (document.getElementById('special_module_user_xml')!=null)
        document.getElementById('special_module_user_xml').value ='';
        // makes blank the value of 'uaXML' of window object
        window.uaXML = "";
    }

     // used for set the value of html, css, js editors, makes editor readonly which was made disabled at the time of question creation, hide the editors which was made hidden at the time of questio creation and change the theme of html, css and js editors according to the check status of 'Dark Theme' checkbox
    function parseXML(xml) {
        // contains the xml 
        xml = xml ? xml : window.QXML;  
        // contains the html editor value from xml
        let htmlData = stringBetween(xml, "tag");
        // sets the value of html editor
        htmlEditor.setValue(htmlData ? htmlData.trim() : "");
        // contains the css editor value from xml
        let cssData = stringBetween(xml, "css");
        // sets the value of css editor
        cssEditor.setValue(cssData ? cssData.trim() : "");
        // contains the js editor value from xml
        let jsData = stringBetween(xml, "js");
        // sets the value of js editor
        jsEditor.setValue(jsData ? jsData.trim() : "");
        // contains the value of 'disable' attribute of web tag from xml
        let disableData = findAttribute(window.QXML, "disable", "web");
        if (/html/g.test(disableData)) {
            // sets the value '0' of variable 'readHTML' to indicate that html editor is 'readonly' and no any operation can be performed on this editor
            readHTML = 0;
            // makes the html editor as 'readonly'
            htmlEditor.setOption("readOnly", true);
        }
        if (/js/g.test(disableData)) {
            // sets the value '0' of variable 'readJS' to indicate that js editor is 'readonly' and no any operation can be performed on this editor
            readJS = 0;
            jsEditor.setOption("readOnly", true);
        }
        if (/css/g.test(disableData)) {
            // sets the value '0' of variable 'readCSS' to indicate that css editor is 'readonly' and no any operation can be performed on this editor
            readCSS = 0;
            cssEditor.setOption("readOnly", true);
        }
        // contains the value of 'hide' attribute of 'web' tag from xml
        let hideData = findAttribute(window.QXML, "hide", "web");
        // updates the value of variable 'hideData' according to its value
        hideData = hideData ? hideData : ",,";
        // converts 'hideData' into array and 
        hideData = hideData.split(",");
        // used for hide the html, css or js editor according to the value of array 'hideData' defined at index '0', '1', '2'
        hideEditors(parseInt(hideData[0]), parseInt(hideData[1]), parseInt(hideData[2]));
        // changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
        changeTheme();
    }

    // used for hide the html, css or js editor according to the value of argument variable 'html', 'css', 'js'
    function hideEditors(html = 1, css = 1, js = 1) {
        // contains the value 1 or 0 that determines that html editor will be visible or not
        showHTML = isNaN(html) ? 1 : html;
        // contains the value 1 or 0 that determines that css editor will be visible or not
        showCSS = isNaN(css) ? 1 : css;
        // contains the value 1 or 0 that determine that js editor will be visible or not
        showJS = isNaN(js) ? 1 : js;
        // used for mobile team
        if (window.inNative) {
            if (!showHTML) {
            //    jQuery("#html_panel, #html_pane, #css_panel").hide(); // Replaced
                document.getElementById('html_panel').style.display = 'none';
                document.getElementById('html_pane').style.display = 'none';
                document.getElementById('css_panel').style.display = 'none';
            }
            if (!showCSS) {
            //    jQuery("#css_panel,#css_pane,#js_panel").hide(); // Replaced
                document.getElementById('css_panel').style.display = 'none';
                document.getElementById('css_pane').style.display = 'none';
                document.getElementById('js_panel').style.display = 'none';
            }
            if (!showJS) {
            //    jQuery("#js_panel,#js_pane,#css_panel").hide(); // Replaced
                document.getElementById('js_panel').style.display = 'none';
                document.getElementById('js_pane').style.display = 'none';
                document.getElementById('css_panel').style.display = 'none';

            }
            if (showHTML && showCSS && showJS) {
            //    jQuery("#css_panel,#js_panel").hide(); // Replaced
                document.getElementById('css_panel').style.display = 'none';
                document.getElementById('js_panel').style.display = 'none';
            }
            return;
        }
        if (!showHTML) {
            // hides the html editor if the value of variable 'showHTML' is 0
          //jQuery("#html_panel").hide(); // Replaced
            document.getElementById('html_panel').style.display = 'none';
            Split(['#css_panel','#js_panel'],{
                sizes:[50,50],
            })
        }
        if (!showCSS) {
           //  hides the css editor if the value of variable 'showCSS' is 0
            //jQuery("#css_panel").hide(); // Replaced
            document.getElementById('css_panel').style.display = 'none';
            Split(['#html_panel','#js_panel'],{
                sizes:[50,50],
            })
        }
        if (!showJS) {
           //  hides the js editor if the value of variable 'showJS' is 0
            //jQuery("#js_panel").hide(); // Replaced
            document.getElementById('js_panel').style.display = 'none';
            Split(['#css_panel','#html_panel'],{
                sizes:[50,50],
            })
        }
    }

    // used for update the user answer xml value
    function saveWebAnswer(code, code_lang) {
        // contains the user answer xml of question xml
        let qxml = !/smans/g.test(window.uaXML) && window.uaXML ? window.uaXML : window.QXML;
        // variable for hold the html, css and js editor value in xml format way
        let uXml = "";
        if (code_lang == 'html') {
            // replace the old code of html editor with new one
            uXml = qxml.replace(/<tag>[\s\S]*?<\/tag>/g, "<tag>" + code + "</tag>");
        } else if (code_lang == 'css') {
            // replace the old code of css editor with new one
            uXml = qxml.replace(/<css>[\s\S]*?<\/css>/g, "<css>" + code + "</css>");
        } else {
            // replace the old code of js editor with new one
            uXml = qxml.replace(/<js>[\s\S]*?<\/js>/g, "<js>" + code + "</js>");
        }
        // this block is used for mobile team
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
        // defines that user answer xml is changed
        ISSPECIALMODULEUSERXMLCHANGE = 1;
        // save the user answer xml
        //jQuery("#special_module_user_xml").val(uXml); // Replaced
        if (document.getElementById('special_module_user_xml')!=null)
            document.getElementById('special_module_user_xml').value = uXml;
        
        // assign the user answer xml in variable 'userAnswers'
        //let userAnswers = userAnswer = jQuery("#special_module_user_xml").val(); // Replaced
        let userAnswers;
        if(document.querySelector("#special_module_user_xml")!=null)
             userAnswers = userAnswer = document.getElementById("special_module_user_xml").value;
        // used for mobile team
        if (window.inNative) {
            window.postMessage('height___' + document.getElementsByClassName('container-fluid')[0].offsetHeight, '*');
            window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect: false }), '*');
        }
        // assign the user answer xml value in 'uaXML' variable of window object
        window.uaXML = uXml;
    }
    </script>
    
    <div>
        <!-- <link rel="stylesheet" href="{themeUrl}pe-items/svelte/clsSMWeb/libs/codemirror.min.css" type="text/css" /> 
        <link rel="stylesheet" href="{themeUrl}pe-items/svelte/clsSMWeb/libs/monokai.css" type="text/css" />
        <link rel="stylesheet" href="{themeUrl}pe-items/svelte/clsSMWeb/libs/simplescrollbars.css" type="text/css" />
        <link rel="stylesheet" href="{themeUrl}pe-items/svelte/clsSMWeb/libs/webitem.min.css" type="text/css" /> -->

    <div id="authoringArea" class="font14" >
        {#if window.isIE || window.isIEEleven} 
            <div class="alert alert-danger">
                You are using Internet Explorer, ES6 functionality of javascript will not work!
            </div>
        {/if}
        <button type="button" class="h h-imp" id="set-review" on:click={()=>{setReview()}}>set review</button>
        <button type="button" class="h h-imp" id="unset-review" on:click={()=>{unsetReview()}}>unset review</button>
        <div>
            
                {#if window.inNative }
                    
                    <div class="container-fluid" id="mainContainer">
                        <div class="row">
                            <div id="web_toolbar" class="bg-gray height44 web_toolbar text-dark">
                                <div class="mt-2 pt pl-3 float-left">
                                    <span class="icomoon-coding-44px s3 align-middle mr-1"></span><span class="align-middle">{l.html_css_js}</span>
                                </div>
                                <div class="float-right mt-2 mr-2">
                                    <button class="btn border-0 px-0 ml-2 mr-2" type="button" data-toggle="dropdown"><span class="icomoon-menu-2 s3 text-secondary pt-s d-block"></span></button>
                                    <ul class="dropdown-menu dropdown-menu-right" x-placement="bottom-end">
                                        <li>
                                            <label htmlFor="goDark" class="dropdown-item mb-0 pointer">
                                                <input type="checkbox" defaultChecked={state.goDark} on:click={changeTheme} id="goDark" class="position-absolute transparent" />
                                                <span>{(state.goDark) ? l.normal_mode : l.dark_mode}</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <div class="inline-block pull-right">
                                    <button type="button" class="btn btn-primary runcode_btn ml mt" on:click={runCode}>{l.run}</button>
                                </div>
                            </div>
                            <div style={'width: 100%;background: white;'} class="content_parent">
                                <ul class="nav nav-pills nav-fill" role="tablist">
                                    <li class="nav-item" id="html_pane">
                                        <a class="nav-link active text-white" href="#html_panel" role="tab" data-toggle="tab">{l.html}</a>
                                    </li>
                                    <li class="nav-item" id="css_pane">
                                        <a class="nav-link text-white" href="#css_panel" role="tab" data-toggle="tab">{l.css}</a>
                                    </li>
                                    <li class="nav-item" id="js_pane">
                                        <a class="nav-link text-white" href="#js_panel" role="tab" data-toggle="tab">{l.js}</a>
                                    </li>
                                </ul>
                                <div id="top_content" class="tab-content">
                                    <div id="firstEditorDiv">
                                        <div id="html_panel" class="m-0 p-0 rounded-0 tab-pane fade show active" role="tabpanel" >
                                            <div id="html" class="card-body code_box content-div m-0 p-0" style={'height: 347px'}>
                                                <textarea name="html" id="html_editor"></textarea>
                                            </div>
                                        </div>
                                        <div id="css_panel" class="m-0 p-0 rounded-0 tab-pane fade show" role="tabpanel">
                                            <div id="css" class="card-body code_box content-div m-0 p-0" style={'height: 347px' }>
                                                <textarea name="css" class="css_text" id="css_editor"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="jsEditorDiv">
                                        <div id="js_panel" class="m-0 p-0 rounded-0 tab-pane fade show" role="tabpanel">
                                            <div id="js" class="card-body code_box content-div m-0 p-0" style={'height: 347px' }>
                                                <textarea name="js" id="js_editor"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="bottom_content">
                                    <div class="card rounded-0 nm">
                                        <div class="card-header rounded-0">
                                            <span>{l.result}</span>
                                        </div>
                                        <div id="result_div" style={'min-height: 347px' } class="card-body content-div m-0 p-0 rounded-0">
    
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                        </div>
                    </div>
                    {:else}
                        <div class="container-fluid">
                            <div class="row">
                                <div id="web_toolbar" class="bg-light w-100 height44 web_toolbar text-dark">
                                    <div class="mt-2 pt pl-3 float-left">
                                        <span class="icomoon-coding-44px s3 align-middle mr-1"></span><span class="align-middle">{l.html_css_js}</span>
                                    </div>
                                    <div class="float-right mt-2">
                                        <button class="btn border-0 px-0 ml-2 mr-2" type="button" data-toggle="dropdown"><span class="icomoon-menu-2 s3 text-secondary pt-s d-block"></span></button>
                                        <ul class="dropdown-menu dropdown-menu-right" x-placement="bottom-end">
                                            <li>
                                                <label htmlFor="goDark" class="dropdown-item mb-0 pointer">
                                                    <input type="checkbox" defaultChecked={state.goDark} on:click={changeTheme} id="goDark" class="position-absolute transparent" />
                                                    <span>{(state.goDark) ? l.normal_mode : l.dark_mode}</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="inline-block pull-right">
                                        <button type="button" class="btn btn-primary runcode_btn ml mt" on:click={runCode}>{l.run}</button>
                                    </div>
                                </div>
                                <div id="accordion" style={'width:100%; background:white; '}>
                                    <div id="top_content">
                                        <div id="firstEditorDiv" style='display:flex;'>
                                            <div id="html_panel" class="card m-0 p-0 rounded-0">
                                                <div class="card-header rounded-0">
                                                    <span>{l.html}</span>
                                                </div>
                                                <div id="html" class="card-body code_box content-div m-0 p-0" style={'height: 347px '}>
                                                    <textarea name="html" id="html_editor"></textarea>
                                                </div>
                                            </div>
                                            <div id="css_panel" class="card m-0 p-0 rounded-0">
                                                <div class="card-header rounded-0">
                                                    <span>{l.css}</span>
                                                </div>
                                                <div id="css" class="card-body code_box content-div m-0 p-0" style={'height: 347px' }>
                                                    <textarea name="css" id="css_editor"></textarea>
                                                </div>
                                            </div>
                                            <!-- <div id="jsEditorDiv"> -->
                                                <div id="js_panel" class="card m-0 p-0 rounded-0">
                                                    <div class="card-header rounded-0">
                                                        <span>{l.js}</span>
                                                    </div>
                                                    <div id="js" class="card-body code_box content-div m-0 p-0" style={'height: 347px '}>
                                                        <textarea name="js" id="js_editor"></textarea>
                                                    </div>
                                                </div>
                                            <!-- </div> -->
                                        </div>
                                        <!-- <div id="jsEditorDiv">
                                            <div id="js_panel" class="card m-0 p-0 rounded-0">
                                                <div class="card-header rounded-0">
                                                    <span>{l.js}</span>
                                                </div>
                                                <div id="js" class="card-body code_box content-div m-0 p-0" style={'height: 347px '}>
                                                    <textarea name="js" id="js_editor"></textarea>
                                                </div>
                                            </div>
                                        </div> -->
                                    </div>
                                    <div id="bottom_content" style={'overflow: hidden'}>
                                        <div class="card rounded-0 nm">
                                            <div class="card-header rounded-0">
                                                <span>{l.result}</span>
                                            </div>
                                            <div id="result_div" style={'height: 347px' } class="card-body content-div m-0 p-0 rounded-0">
        
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
            
        </div>
        <!--   <Dialog
            bind:visible={state.remediationToggle}
                on:close={() => state.remediationToggle = false }
            title={l.remediation} width="650">
                <div slot="title">{l.remediation}</div>
                <Content>
                <div id="remediationModel">
                            <center class="mt-xl">
                                
                                <h4>{l.calculate_answer}<br /> {l.please_wait}</h4>
                            </center>
                        </div>
                </Content>
                    <Actions>     
                        <Button key="cancel_btn" class="cancel_btn_pop" style={'float:right;margin:10px;background-color:gray;'} variant="contained" on:click={() => state.remediationToggle = false }>
                            {l.cancel}
                        </Button>
                    </Actions>
            </Dialog> -->
            <Dialog		          
	bind:visible={state.remediationToggle}
	width="650"
    on:close={() => state.remediationToggle = false}
>
	<div slot="title" style="text-align: left;">
		<div style="">{l.remediation}</div>
	</div>
	<div>
		<div id="remediationModel">
			<center>
				<Loader size={70} />
				<h4>{l.calculate_answer}<br/> {l.please_wait}</h4>
			</center>
		</div>
	</div>
	<div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
		<Button key="cancel_btn" class="cancel_btn_pop" style={'float:right;margin:10px;background-color:gray;'} variant="contained" on:click={() => state.remediationToggle = false }>
            {l.cancel}
        </Button>
	</div>
</Dialog>
        <input type="hidden" id="ansModeAnswer" value="" />
    </div>
    </div>