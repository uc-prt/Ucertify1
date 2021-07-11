<script>
    /**
     *  File Name   : Eval.svelte
     *  Description : Container for EvalPro Module
     *  Author      : Pradeep Yadav
     *  Version     : 1.2
     *  Package     : svelte_items/svelte
     *  Created     : 30 Feb 2021
     *  Updated By  : Prabhat Kumar <prabhat.kumar@ucertify.com>
     *  Updated Date: 12-May-2021
     */
    import { onMount, beforeUpdate, tick } from 'svelte';
    import { Button, Dialog, Snackbar } from 'svelte-mui/src';
    import {tag_player} from '../helper/helperFunctions';
    import l from '../src/libs/editorLib/language';
    import { writable } from 'svelte/store';
    import { AH } from '../helper/HelperAI.svelte';
    import Loader from '../helper/Loader.svelte';
    import '../src/libs/codemirror.min.css';
    import '../src/libs/monokai.css';
    import '../src/libs/simplescrollbars.css';

    export let toggleMode;
    export let xml;
    export let getChildXml = () => {};
    export let setInlineEditor;
    export let editorState;
    let location_origin = (location.origin).replace('localhost', 'localhost:3000');
    let evalpro_url = location_origin + '/layout/themes/bootstrap4/svelte_items/evalPro/index.php';
    let all_databases = {
            'mssql': ["MSSQL"], 
            'sql': ["740DB", "C170PRE", "C995HSTK", "C995PRE", "DBFUND", "GSA1", "c995", "myDBs", "ucDB", "RECRUIT"], 
            'psql': ["gsa1", "mydbs", "postgresdb", "ucdb", 'postgres_db', "ucdb_db", "sandbox"],
        };
    let lang_type = (["c", "c#", "c++", "java", "javascript", "mssql", "node.js", "php", "psql", "python", "r", "ruby", "sql"]).sort();
    let message = '';
    let isPreview = "";
    let aXml = "";
    let language = "";
    let windowHtml = "";
    let showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
    let showPost = parseInt(findAttribute(xml, "showpost", "SMXML"));
    let showEditor = parseInt(findAttribute(xml, "showeditor", "SMXML"));
    let qxml = "";
    let xmlArr = [];
    let defaultStartXml = '<SMXML type="24" name="evalpro" language="php">';
    let currentDB = 'myDBs';
    let lastTestCaseHtml = false;
    let editor;
    let preEditor;
    let postEditor;
    let marker = [];
    let preData = "";
    let postData = "";
    let langArr = [];
    let state = {};
    window.QXML = xml;
    let hdd = writable({
        open: false,
        xml: '',
        uxml: '',
        module: '',
        toggle: false,
        toggleMode: false,
        snackback: false,
        lang_type: 'php',
        xmlArr: [],
        remediationToggle: false,
        qxml: '',
        titleData: "",
        stemData: "",
        remediationData: "",
        perspective: "Right",
        partial_match: "1,1,1",
        ignore_special_char: "0,0,0",
        case_insensitive: "0,0,0",
        preShow: showPre || 0,
        postShow: showPost || 0,
        editorShow: showEditor || 2,
        enableLines: 0,
        databases: [],
        output: "",
        database_modal_open: false,
        database: "myDBs",
        preBlockShow: 0,
        postBlockShow: 0,
        is_graph: 0,
        ignore_error: 0,
        ignore_formatting: 0
    })

    /**
     * To unsubscribe the store.
     */
    const unsubscribe = hdd.subscribe((items)=> {
        state = items;
    });

    $: if (xml != state.xml) state.xml = xml;

    /**
     * Function call before render. Do all the necessory configuration before rendering.
    */
    onMount(()=> {
        let smxml = xml.match(/<smxml(.*?)>/gim);
        let type = smxml.toString().match(/type="(.*?)"|type='(.*?)'/gim);
        type = type[0].replace(/type=|"/gim, '');
        state.module = type;
    
        AH.select(AH.prevElm("#authoringLoadComponent", "br"), 'remove');
        let caseSensitive = xml.match(/case_sensitive='(.*?)'/gm);
        let specialChar = xml.match(/special_char='(.*?)'/gm);
        let partialMatch = xml.match(/partial_match='(.*?)'/gm);
        if (caseSensitive && specialChar && partialMatch) {
            state.ignore_special_char = specialChar[0].split("=")[1].replace(/["']/g, "");
            state.case_insensitive = caseSensitive[0].split("=")[1].replace(/["']/g, "");
            state.partial_match = partialMatch[0].split("=")[1].replace(/["']/g, "");
        }
        // let defaultXml = xml.match(/<SMXML[\s\S]*?<\/SMXML>/gim);
        langArr = xml.match(/<SMXML[\s\S]*?<\/SMXML>/gim);
        
        if (langArr.length == 1) {
            language = langArr.toString().match(/language="(.*?)"/gim);
            language = language.toString().replace(/language=|"/gi, '');
            xmlArr[language] = xml;
            state.lang_type = language;
            state.xmlArr = xmlArr;
        } else {
            for (let i = 0; i < langArr.length; i++) {
                language = langArr[i].match(/language="(.*?)"/gim);
                language = language.toString().replace(/language=|"/gi, '');
                xmlArr[language] = langArr[i];
            }
            state.xmlArr = xmlArr;
        }
        
        getChildXml(xmlArr[state.lang_type]); //important
        AH.select('#preview', 'hide');
        state.xml = xml;
        setDefaultXML(state.xml);
        setTestCase()
        if (typeof(CodeMirror) == "function") {
            renderCodeMirror();
        } else {
            AH.ajax({
                type: "GET",
                url: itemUrl + "src/libs/codemirror.js",
                dataType: "script",
            }).then((data)=> {
                AH.addScript(data, "", {target: "body"});
                setTimeout(renderCodeMirror, 500);
            })
        }
        
        let delBtns = AH.selectAll(".caseDelBtn");
        delBtns.forEach((event) => {
            event.removeEventListener("click", deleteCase);
            event.addEventListener("click", deleteCase);
        });
        AH.listen(document, 'click', '#answerCheck', ()=> {
            remediationMode();
        });
        AH.bind("#enable-line", "keyup", () => {
            state.xml = generateXml();
            getChildXml(state.xml);
        });
        AH.selectAll(".MuiIconButton-label-122", 'css', {display: "inline !important"});
    })

    /**
     * Function call before update the dom. If anything change this will be called before render.
    */
    beforeUpdate(async ()=> {
        if (toggleMode != state.toggleMode) {
            state.toggleMode = toggleMode;
            qxml = generateXml(true);
            AH.select("#output", 'html', "");
            if (state.toggleMode == true) {
                //Test mode on
                renderPlayer();
                AH.select('#headerTitle', 'html', l.preview);
                AH.enableBsAll('[data-bs-toggle="tooltip"]', 'Tooltip', {container: 'body'});
                state.qxml = qxml;
                state.titleData  = AH.select('#title').innerHTML;
                state.stemData = AH.select('#stem').innerHTML;
                state.remediationData = AH.select('#remediation').innerHTML;
                await tick();
                AH.insert(AH.select(AH.empty('#title'), 'hide'), '<div id="tilteShow">' + state.titleData + '</div>', 'afterend');
                AH.insert(AH.select(AH.empty('#stem'),'hide'), '<div id="stemShow">' + get_ucsyntax(state.stemData) + '</div>', 'afterend');
                AH.insert(AH.select(AH.empty('#remediation'),'hide'), '<div id="remediationShow">' + get_ucsyntax(state.remediationData) + '</div>', 'afterend');
                AH.selectAll('#externalInputs,#addTestCase', 'hide');
                AH.selectAll(".action_block", 'removeClass', 'd-flex');
                AH.selectAll(".action_block, .language_select_button, .database_select_button, .pre-div", 'hide');
                AH.selectAll(".selected_language", 'removeClass', 'hidden');
                // hide the pre and post block in case of preview
                addPreBlock(0);
                addPostBlock(0);
                (state.stemData.match(/<uc:syntax/gm) || state.remediationData.match(/<uc:syntax/gm)) ? prettyPrint(): '';
                isPreview = 1;
                disableLine();
                showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
                showPost = parseInt(findAttribute(xml, "showpost", "SMXML"));
                showEditor = parseInt(findAttribute(xml, "showeditor", "SMXML"));
                if (showPre < 2) {
                    preEditor.setOption("readOnly", true);
                    AH.select(".pre-div .CodeMirror-scroll").className = "CodeMirror-scroll bg-light"
                } else {
                    preEditor.setOption("readOnly", false);
                    AH.select(".pre-div .CodeMirror-scroll").className = "CodeMirror-scroll"
                }

                if (showPost < 2) {
                    postEditor.setOption("readOnly", true);
                    AH.select(".pre-div .CodeMirror-scroll").className = "CodeMirror-scroll bg-light"
                    // $(".pre-div .CodeMirror-scroll")[1].className = "CodeMirror-scroll bg-light"
                } else {
                    postEditor.setOption("readOnly", false);
                    AH.select(".pre-div .CodeMirror-scroll").className = "CodeMirror-scroll"
                    // $(".pre-div .CodeMirror-scroll")[1].className = "CodeMirror-scroll"
                }

                if (showEditor < 2) {
                    editor.setOption("readOnly", true);
                    AH.select(".replEditor .CodeMirror-scroll").className = "CodeMirror-scroll bg-light"
                } else {
                    editor.setOption("readOnly", false);
                    AH.select(".replEditor .CodeMirror-scroll").className = "CodeMirror-scroll"
                }
                AH.select(".replEditor", 'css', {
                    "minHeight": "125px",
                    "height": "542px",
                    "display": "block",
                });
            } else { //Authoring Mode.
                AH.select('#headerTitle', 'html', l.authoring);
                AH.find('#authoringArea', 'form', {action: 'remove'});
                AH.insert('#authoringArea', windowHtml, 'beforeend');
                AH.find(document, '#tilteShow, #stemShow, #remediationShow, smxml', {action: 'remove'});
                AH.select('#title', 'html', state.titleData);
                AH.select('#stem', 'html', state.stemData);
                AH.select('#remediation', 'html', state.remediationData);
                AH.selectAll('#title,#stem,#remediation,#externalInputs,#addTestCase', 'show');
                AH.selectAll(".action_block", 'addClass', 'd-flex')
                AH.selectAll('.action_block', 'show');
                AH.selectAll(".language_select_button,.database_select_button", 'show');
                AH.selectAll(".selected_language", 'addClass', 'hidden');
                unRenderPlayer();
                isPreview = 0;
                (state.module == "24") ? AH.select('#selectLanguage', 'show') : '';
                if (editor) { //re-rendering codeMirror
                    editor.toTextArea();
                    preEditor.toTextArea();
                    postEditor.toTextArea();
                    let privXML = stringBetween(xml, "editor");
                    renderCodeMirror();
                    editor.setValue(privXML.trim());
                }
                setInlineEditor("#stem");
                setInlineEditor("#remediation");
            }
        } 
        showHideInputBlock(state.lang_type);
        if (state.toggleMode == false) {
            // Update the pre, editor, post block 
            adjustEditorBlockUI();
        }
    })

    /**
     * Function to toggle the DB. If the lang is other than sql, psql and mssql then it will hide the database option.
     * @param val : Boolean value to show and hide the database option.
     */
    function toggleDB(val) {
        editorState.db_changed = val;
    }

    /**
     * Function to add the pre code block.
     * @param isPreBlockShow : Boolean value to show and hide the pre block.
     */
    function addPreBlock(isPreBlockShow) {
        state.preBlockShow = (isPreBlockShow > -1) ? isPreBlockShow : !state.preBlockShow;
        AH.selectAll(".pre-div", 'css', {
            "minHeight": "90px",
            "height": "100px",
            "display": "block"
        });
        // Refresh the code mirror in case of show the preEditor area
        if (!state.preBlockShow || isPreBlockShow) {
            preEditor.setSize('100%', '100%');
            var show = setInterval(function() {
                preEditor.refresh();
            }, 10);
            setTimeout(()=> {
                clearInterval(show);
            }, 100);
        }
    }

    /**
     * Function to add the post code block.
     * @param isPostBlockShow : Boolean value to show and hide the post block.
     */
    function addPostBlock(isPostBlockShow) {
        state.postBlockShow = (isPostBlockShow > -1) ? isPostBlockShow : !state.postBlockShow;
        AH.selectAll(".post-div", 'css', {
            "minHeight": "90px",
            "height": "100px",
            "display": "block"
        });
        // Refresh the code mirror in case of show the preEditor area.
        if (!state.postBlockShow || isPostBlockShow) {
            postEditor.setSize('100%', '100%');
            var show = setInterval(function() {
                postEditor.refresh();
            }, 10);
            setTimeout(()=> {
                clearInterval(show);
            }, 100);
        }
    }

    /**
     * Change to open the language dialog.
     */
    function handleLanguageModalOpen() {
        state.open = !state.open;
        setTimeout(function() {
            document.querySelector('.evalpro_dialog > div+div.content').style.margin = "16px 0";
        }, 50);
    }

    /**
     * Function to show and hide the user input block.
     * @param lang : If the language is psql, sql or mssql then no need to show it.
     */
    function showHideInputBlock(lang) {
        if (lang == "sql" || lang == "psql" || lang == 'mssql') {
            AH.select(AH.parent("#input"),'hide');
            AH.select("#output", 'css', {height: '549px'});
        } else {
            AH.select(AH.parent("#input"), 'show');
            AH.select("#output", 'css', {height: '401px'});
        }
        
    }

    /**
     * Change to language change
     * @param lang : Language from dropdown.
     */
    function handleLanguageSelection(lang) {
        state.open = !state.open;
        state.databases = all_databases[lang];

        //start @sneh:added because the symbole like ++ were executed not been treated as string.
        RegExp.escape = function(symbol) {
            return symbol.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };

        let term_lang = new RegExp(RegExp.escape(state.lang_type), "i");
        showHideInputBlock(lang);
        if (state.xmlArr[lang]) {
            state.xml = state.xmlArr[lang];
            state.lang_type = lang;
            editor.setOption("mode", "text/x-" + term_lang);
            windowHtml = state.xmlArr[lang].replace(/language="[\s\S]*?" +/g, 'language="' + lang + '"');
            getChildXml(windowHtml);
            parseXML(windowHtml);
            setDefaultXML();
            setTestCase();
            AH.select("#output", 'html', "");
        } else {
            let xml_group = Object.keys(state.xmlArr);
            let newXML = state.xmlArr[xml_group[xml_group.length - 1]].replace(/language="[\s\S]*?" +/i, 'language="' + lang + '" ');
            state.xml = newXML;
            state.lang_type = lang;
            
            editor.setOption("mode", "text/x-" + state.lang_type);
            preEditor.setOption("mode", "text/x-" + state.lang_type);
            postEditor.setOption("mode", "text/x-" + state.lang_type);
            parseXML(newXML);
            setDefaultXML();
            setTestCase();
            windowHtml = newXML;
            getChildXml(windowHtml);
        }
    }

    /**
     * Function to show and hide the database dialog box.
     */
    function handleDatabaseModalOpen() {
        state.database_modal_open = !state.database_modal_open;
        setTimeout(function() {
            document.querySelector('.evalpro_dialog > div+div.content').style.margin = "16px 0";
        }, 50);
    }
    
    /**
     * Function to handle the database selection.
     * @param database : Database selected from dropdown.
     */
    function handleDatabaseItem(database) {
        state.database_modal_open = !state.database_modal_open;
        state.database = database;
        currentDB = database;
        setDefaultXML();
    }

    /**
     * Function to adjust the Editor Block.
     */
    function adjustEditorBlockUI() {
        let preBlockHeight = 0;
        let postBlockHeight = 0;
        if (preData && preData.trim().length) {
            preBlockHeight = 141;
            AH.selectAll(".pre-div", 'css', {
                "minHeight": "80px",
                "height": preBlockHeight + "px",
                "display": "block"
            });
        } 
        if (postData && postData.trim().length) {
            postBlockHeight = 141;
            AH.selectAll(".post-div", 'css', {
                "minHeight": "80px",
                "height": postBlockHeight + "px",
                "display": "block",
            });
        }
        let editorBlockHeight = 427 - (preBlockHeight + postBlockHeight);
        AH.selectAll(".replEditor", 'css', {
            "minHeight": "60px",
            "height": editorBlockHeight + "px",
            "display": "block",
        });
    }

    /**
     * Function to convert any string first character to uppercase.
     * @param str : Any string.
     */
    function toTitleCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    /**
     * Function to show the output block.
     */
    function showOutputData() {
        let raw_btn_val = AH.select("#raw_btn").value;
        if (raw_btn_val == "raw") {
            AH.select('#output').innerHTML = '<textarea class="w-100 border-0" style="height:480px;">' + state.output + '</textarea>';
            return 1; 
        }

        if (state.lang_type == 'sql' || state.lang_type == 'mssql' || state.lang_type == 'psql' || state.lang_type == 'c++') {
            AH.select('#output').innerHTML = '<pre>' + state.output + '</pre>';
        } else {
            AH.select('#output').innerHTML = state.output;
        }
    }

    /**
     * Function to handle the enable disable the line.
     */
    function disableLine() {
        let mode = {},
            previousCode,
            $usedLine,
            //lineEnableNo,
            language,
            disableline;

        try {
            previousCode = editor.getValue();
            $usedLine = editor.lineCount();
            //lineEnableNo = enableline;
            language = state.lang_type;
            disableline = AH.select("#enable-line").value;
        } catch (error) {
            console.log(error);
        }
        if (typeof mode.review == "undefined") {
            mode.review = 0;
        }

        if ((mode.test == 1 || mode.review || 1) && parseInt(disableline)) {
            let $lineEnable = disableline;
            if ($lineEnable) {
                $lineEnable = $lineEnable.split(",");
                $lineEnable.sort(function(a, b) {
                    return a - b
                });
                let $line = [];
                let $readOnly = [];
                for (let j = 0; j < $lineEnable.length; j++) {
                    if (!$line[j]) {
                        $line[j] = [];
                    }

                    if (j == 0) {
                        $line[j][0] = j;
                        $line[j][1] = $lineEnable[j];
                    } else {
                        $line[j][0] = $line[j - 1][1];
                        $line[j][1] = $lineEnable[j];
                    }
                }

                let $i = 0;
                for ($i = 0; $i < $lineEnable.length; $i++) {
                    for (let $k = $line[$i][0]; $k <= $line[$i][1] - 2; $k++) {
                        $k = parseInt($k);
                        $readOnly.push($k);
                        editor.addLineClass($k, 'wrap', 'bg-light');
                    }

                    marker.push(editor.markText({
                        line: $line[$i][0],
                        ch: 0
                    }, {
                        line: $line[$i][1] - 2
                    }, {
                        inclusiveRight: true,
                        inclusiveLeft: true,
                        readOnly: true
                    }));
                }

                for (let $l = $line[$i - 1][1]; $l < $usedLine; $l++) {
                    $l = parseInt($l);
                    $readOnly.push($l);
                    editor.addLineClass($l, 'wrap', 'bg-light');
                }
                // hide all bottom codes after enable line
                if (language == 'python' || disableline == 1) {
                    editor.markText({
                        line: $line[$i - 1][1],
                        ch: 0
                    }, {
                        line: $usedLine
                    }, {
                        inclusiveRight: true,
                        inclusiveLeft: true,
                        collapsed: true
                    });
                    editor.markText({
                        line: $line[$i - 1][1],
                        ch: 0
                    }, {
                        line: $line[$i - 1][1] + $usedLine
                    }, {
                        inclusiveRight: true,
                        inclusiveLeft: true,
                        readOnly: true
                    });

                }

                if (language != 'python') {
                    editor.markText({
                        line: parseInt($line[$i - 1][1]),
                        ch: 0
                    }, {
                        line: $usedLine
                    }, {
                        inclusiveRight: true,
                        inclusiveLeft: true,
                        collapsed: true
                    });

                    editor.markText({
                        line: $line[$i - 1][1],
                        ch: 0
                    }, {
                        line: $line[$i - 1][1] + $usedLine
                    }, {
                        inclusiveRight: true,
                        inclusiveLeft: true,
                        readOnly: true
                    });
                }
            }
        }
    }

    /**
     * Function to render the code mirror.
     */
    function renderCodeMirror() {
        createEditor();
        setDefaultXML();
        getChildXml(generateXml());
        
        if (document.getElementById("aXml")) {
            let xmlEditor = CodeMirror.fromTextArea(document.getElementById("aXml"), {
                lineNumbers: false,
                mode: "application/xml",
                autoCloseBrackets: true,
                lineWrapping: true,
                matchBrackets: true
            });
        }

        editor.setOption("extraKeys", { //Changing Tabs into 4 spaces 
            Tab: function(command) {
                let spaces = Array(command.getOption("indentUnit") + 1).join(" ");
                command.replaceSelection(spaces);
            },
            F11: function(command) {
                command.setOption("fullScreen", !command.getOption("fullScreen"));
            },
            Esc: function(command) {
                if (command.getOption("fullScreen")) command.setOption("fullScreen", false);
            }
        });
        AH.bind(".CodeMirror-linenumber", 'click', function(event) {
            
            if (AH.prevElm(event.target, ".dot")) {
                AH.prevElm(event.target, ".dot").remove();
            } else {
                AH.insert(event.target, '<div class="dot" style="position:absolute; z-index: 9999;width: 7px; height: 7px; border-radius: 50%; top: 8px; background-color: red;"></div>', 'beforebegin');
            }
        });
    }

    /**
     * Function to reset the database when reset button clicked.
     */
    function resetDB() {
        AH.select("#evalProRunCode", 'attr', {disabled: "disabled"});
        AH.select("#output").innerHTML = ('<div class="EvalbgBlue"><div class="Evalloader"><span>{</span><span>}</span></div></div>');
        AH.ajax({
            url: themeUrl + "svelte_items/evalPro/index.php",
            type: 'POST',
            data: {
                'ajax': 1,
                'in_editor': 0,
                'user_guid': window.user_guid,
                'db_name': currentDB,
                'language': findAttribute(xml, 'language'),
                'resetDB': state.lang_type == 'mssql' ? 2 : 1
            }
        }).then((data)=> {
            AH.select('#output', 'html', "Database reset complete!");
            AH.select("#evalProRunCode", 'removeAttr', "disabled");
        }).catch((rqst, err)=> {
            AH.select("#output", 'html',  "Database reset complete!");
            AH.select("#evalProRunCode", 'removeAttr', "disabled");
        });
    }

    /**
     * Function to create the editor.
     */
    function createEditor() {
        let params_config = {
            lineNumbers: true,
            mode: 'text/x-' + state.lang_type,
            styleActiveLine: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            scrollbarStyle: "simple",
            matchBrackets: true,
            tabSize: 2,
            gutters: ["CodeMirror-linenumbers", "breakpoints"]
        };
        preEditor = CodeMirror.fromTextArea(document.getElementById("pre-editor"), params_config);
        editor = CodeMirror.fromTextArea(document.getElementById("repl-editor"), params_config);
        postEditor = CodeMirror.fromTextArea(document.getElementById("post-editor"), params_config);
        parseXML();
        editor.on("change", function(event, line) {
            if (!isPreview) {
                let xml = generateXml(true);
                getChildXml(xml);
            } else {
                saveEvalProAnswer();
            }
            checkLine(line);
        });
        preEditor.on("change", function() {
            if (!isPreview) {
                let xml = generateXml(true);
                getChildXml(xml);
            } else {
                saveEvalProAnswer();
            }
        });
        postEditor.on("change", function() {
            if (!isPreview) {
                let xml = generateXml(true);
                getChildXml(xml);
            } else {
                saveEvalProAnswer();
            }
        });
    }

    /**
     * Function to check the answer when check answer button clicked.
     */
    function remediationMode() {
        state.remediationToggle = true;
        answerCheckEvalpro();
    }

    /**
     * Function to check the line for marker.
     * @param line : Line number.
     */
    function checkLine(line) {
        marker.forEach((marker) => {
            marker.clear();
        });
    }

    /**
     * Function to check the evalpro answer when check answer button clicked.
     */
    function answerCheckEvalpro() {
        setDefaultXML('answer_check');
        let uxml = generateXml(true);
        AH.ajax({
            url: evalpro_url, 
            data: {
                "uxml": uxml,
                "ajax": 1,
                'in_editor': 1,
                'user_guid': window.user_guid
            }
        }).then((response)=> {
            response = JSON.parse(response);
            if (response['ajaxRes'] == 1) {
                AH.select('#remediationModel', 'html', response['html']);
                message = "Passed";

                if (response['answer'] == "0") {
                    message = "Failed";
                }

                state.snackback = true;
            }
        });
    }

    /**
     * Function to get the string between two string.
     * @param data : Any string data.
     * @param str_1 : First start string.
     * @param str_2 : Second end string.
     */
    function stringBetween(data, str_1, str_2) {
        let regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
        if (str_2) {
            regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
        }

        let matchedStr = regEx.exec(data);

        if (matchedStr) {
            return matchedStr[1];
        } else {
            return null;
        }
    }

    /**
     * Function to get the attribute value from xml.
     * @param XML : XML.
     * @param attr : Attribute name.
     * @param tag : Tag name.
     */
    function findAttribute(XML, attr, tag = "") {
        let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w+)\".*?>", "gm");
        let matchedStr = regEx.exec(XML);
        if (matchedStr) {
            return matchedStr[1];
        } else {
            return null;
        }
    }

    /**
     * Function to unRenderPlayer.
     */
    function unRenderPlayer() {
        AH.empty('#authoringDiv player');
        AH.find('#authoringDiv', 'player', {action: 'removeClass', actionData: 'hidecontent'});
        AH.selectAll('#editor img').forEach((_elm)=> {
            if (!_elm.getAttribute('header-logo') && !_elm.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                _elm.setAttribute('src', _elm.getAttribute('src'));
            }
        });
    }

    /**
     * Function to render the player.
     */
    function renderPlayer() {
        AH.empty('#authoringDiv player');
        tag_player(AH.select('#authoringDiv'));
        AH.find('#authoringDiv', 'player', {action: 'addClass', actionData: 'hidecontent'});
        AH.selectAll('#editor img').forEach((_elm)=> {
            if (!_elm.getAttribute('header-logo') && !_elm.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
                _elm.setAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/' + _elm.getAttribute('src'));
            }
        });
    }

    /**
     * Function to check the output of the code when run button clicked.
     * @param event : Event
     * @param raw : Raw (not in use need to delete this)
     */
    function runCode(event, raw = false) {
        AH.select("#output", 'html', '<div class="EvalbgBlue"><div class="Evalloader"><span>{</span><span>}</span></div></div>');
        event.target.disabled = true;
        let code = preEditor.getValue();
        code += "\n" + editor.getValue();
        if (state.lang_type != 'sql' || state.lang_type != 'mssql' || state.lang_type != 'psql') {
            code += "\n";
            code += postEditor.getValue();
        }
        AH.ajax({
            type: "POST",
            url: evalpro_url,
            data: {
                code: code,
                repltype: state.lang_type,
                stdin: AH.select("#sampleInput").value,
                'run_code': 1,
                'user_guid': window.user_guid,
                'db_name': currentDB ? currentDB : "myDBs",
                'is_graph': state.is_graph,
                'ignore_error': state.ignore_error,
                'ignore_formatting' : state.ignore_formatting
            },
            dataType: 'json',
        }).then((res)=> {
            res = typeof res != "object" ? JSON.parse(res) : res;
            AH.select('#output', 'css', {
                "color": "black",
                "background": "transparent"
            });
            event.target.disabled = false;
            if (res.status_message == "Successful") {
                if (res.output) {
                    state.output = res.output;
                    let is_raw_data = AH.select("#raw_btn").value;
                    if (is_raw_data == "raw") {
                        let oup = res.output;
                        AH.select('#output', 'html', '<textarea style="height: 480px;" class="w-100 border-0">' + oup + '</textarea>');
                        return 1;
                    }

                    if (state.lang_type == 'sql' || state.lang_type == 'mssql' || state.lang_type == 'psql' || state.lang_type == 'c++') {
                        let oup = res.output;
                        AH.select('#output', 'html', '<pre>' + oup + '</pre>');
                    } else {
                        if ((res.output).includes("image_data:")) {
                            let image_url = (res.output).split("image_data:");
                            AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
                        } else if (state.lang_type == "r" || state.is_graph) {
                            AH.select("#output", 'html', "<pre>"+ res.output + "</pre>");
                        } else {
                            AH.select('#output', 'html', res.output);
                        }
                    }

                    if (isPreview && (state.lang_type == 'sql' || state.lang_type == 'mssql' || state.lang_type == 'psql')) {
                        let lang_name = state.lang_type;
                        let uXML = AH.select("#special_module_user_xml").value;
                        let id_date = new Date;
                        uXML = uXML.replace("</SMXML>", '<backup id="' + lang_name + id_date.getTime() + '">' + code.trim() + '</backup></SMXML>');
                        if (/\<output\>/g.test(uXML)) {
                            uXML = uXML.replace(/\<output\>[\s\S]*?\<\/output\>/g, '<output>' + AH.select('#output').innerHTML + '</output>');
                        } else {
                            uXML = uXML.replace('</enableline>', '</enableline><output>' + AH.select('#output').innerHTML + '</output>');
                        }

                        AH.select("#special_module_user_xml").val(uXML);
                    }
                } else {
                    AH.select('#output', 'html', "Your code didn't print anything.");
                }
            } else {
                // We need to focus on this for error handling and formating the message
                AH.select('#output', 'html', "<pre class='compilerPre'>"+parseLineNumber(res.stderr)+"</pre>");
                AH.select('#output', 'css', {
                    "color": "#EB3941",
                    "background": "#FFF0F0"
                });
            }
        });
    }

    /**
     * Function to parse the line number.
     * @param errorMsg : Error msg get after code run.
     */
    function parseLineNumber(errorMsg="") {
        let section = {
            pre: (preEditor.getValue() != "" ) ? preEditor.lineCount() : 0,
            editor: (editor.getValue() != "") ? editor.lineCount() : 0,
            post: (postEditor.getValue() != "") ? postEditor.lineCount() : 0,
        };
        let showpre = state.preShow;
        let showpost = state.postShow;
        let showeditor = state.editorShow;
        switch(state.lang_type) {
            case 'sql':
                let line = errorMsg.split('at line');
                if (line[1]) {
                    let lineNo = (line[1].trim()).substring(0, 2);
                    lineNo = lineNo.replace(":", "");
                    if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= (section.pre + section.editor))
                        || (showeditor && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && showeditor && showpost) 
                        )  {
                        lineNo = getSectionLine(+(lineNo), section);
                        if(isNaN(lineNo)) {
                            errorMsg = `${line[0]}${line[1].substr(2, line[1].length)}`;
                        } else {
                            errorMsg = `${line[0]}: ${lineNo} ${line[1].substr(2, line[1].length)}`;
                        }
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                }
                break;
            case 'java': {
                let line = errorMsg.split('Solution.java:');
                if (line[1]) {
                    let lineNo = line[1].substr(0,2);
                    lineNo = getSectionLine(lineNo, section);
                    lineNo = isNaN(lineNo) ? lineNo.replace(":", "") : lineNo;
                    if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= (section.pre + section.editor))
                        || (showeditor && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && showeditor && showpost) 
                        ) {
                        errorMsg =  errorMsg.replace(/ Line \d*/, ` Line ${lineNo}`);
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                }
            }
            break;
            case 'python' : {
                // In case of exception error <module> tag is coming so remove this from code
                let is_module = errorMsg.indexOf("<module>");
                let is_multiple_line = errorMsg.indexOf("line ", is_module);
                if (is_module > -1 && is_multiple_line > -1) {
                    errorMsg = errorMsg.substring(is_module + ("<module>".length));
                }
                let line = errorMsg.split('line');
                if (line[1]) {
                    line[1] = line[1].trim();
                    let lineNo = line[1].substr(0, 2);
                    lineNo = lineNo.replace(/,/g, '');
                    if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= (section.pre + section.editor))
                        || (showeditor && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && showeditor && showpost) 
                        )  {
                        lineNo = getSectionLine(lineNo, section);
                        errorMsg =  errorMsg.replace(/ line \d*/, ` line ${lineNo}`);
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                } 
            }
            break;
            case 'php': {
                let line = errorMsg.split('in /home/ucertify');
                if(line[1]) {
                    let lineNo = (line[1].split("line"));
                    lineNo = getSectionLine(+lineNo[1], section);
                    if (errorMsg.indexOf("unexpected end of file") > -1) {
                        errorMsg = errorMsg.split("on line");
                        errorMsg = errorMsg[0];
                    } else if ((!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && lineNo <= section.pre)
                        || (showpost && lineNo >= (section.pre + section.editor))
                        || (showeditor && lineNo > section.pre && lineNo <= (section.pre + section.editor))
                        || (showpre && showeditor && showpost) 
                        )  {
                        errorMsg = line[0] + "on line " + lineNo;
                    } else {
                        errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
                    }
                }
            }
            break;

        }
        return errorMsg;
    }
    
    /**
     * Function to get the selection line.
     * @param lineNo : Line number of the error.
     * @param section : Pre, Post or Editor section.
     */
    function getSectionLine(lineNo, section) {
        if (lineNo <= section.pre) {
            //No need here.
        } else if (lineNo <= (section.pre + section.editor)) {
            lineNo = lineNo - section.pre;
            console.warn({section:'editor',lineNo});
        } else if (lineNo <= (section.pre + section.editor + section.post)) {
            lineNo = lineNo - (section.pre + section.editor);
        }

        return lineNo;
    }
    
    /**
     * Function to parse the XML.
     * @param xml : XML.
     */
    function parseXML(xml) {
        xml = xml ? xml : window.QXML;
        currentDB = findAttribute(xml, "db_name", "SMXML") ? findAttribute(xml, "db_name", "SMXML") : "myDBs";
        state.database = currentDB;
        if (findAttribute(xml, "language") == 'sql' || findAttribute(xml, "language") == 'mssql' || findAttribute(xml, "language") == 'psql') {
            window.onbeforeunload = function(event) {
                resetDB();
            };
        }
        let editorData = stringBetween(xml, "editor");
        editor.setValue(editorData ? editorData.trim() : "");

        preData = stringBetween(xml, "pre");
        preEditor.setValue(preData ? preData.trim() : "");
        

        postData = stringBetween(xml, "post");
        postEditor.setValue(postData ? postData.trim() : "");
        showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
        showPost = parseInt(findAttribute(xml, "showpost", "SMXML"));
        // Need to verify the content guid for the showeditor is not 2
        showEditor = 2; //parseInt(findAttribute(xml, "showeditor", "SMXML"));
        let is_graph = findAttribute(xml, "is_graph", "SMXML") ? parseInt(findAttribute(xml, "is_graph", "SMXML")) : 0;
        let ignore_error = findAttribute(xml, "ignore_error", "SMXML") ? parseInt(findAttribute(xml, "ignore_error", "SMXML")) : 0;
        let ignore_formatting = findAttribute(xml, "ignore_formatting", "SMXML") ? parseInt(findAttribute(xml, "ignore_formatting", "SMXML")) : 0;
        state.preShow = showPre ? showPre : 0;
        state.postShow = showPost ? showPost : 0;
        state.editorShow = showEditor ? showEditor : 0;
        state.is_graph = is_graph;
        state.ignore_error = ignore_error;
        state.ignore_formatting = ignore_formatting;

        state.enableLines = stringBetween(xml, "enableline");
        AH.select("#enable-line", 'value', state.enableLines || 0);

        if ((state.lang_type == "sql" || state.lang_type == "psql") && currentDB == "myDBs") {
            toggleDB(false);
        } else {
            toggleDB(true);
        }
        
        if (preData && (preData.trim()).length) {
            addPreBlock(1);
        } 
        if (postData && (postData.trim()).length) {
            addPostBlock(1);
        }
        return editorData;
    }

    /**
     * Function to set Default XML.
     * @param type : from where this is being called.
     */
    function setDefaultXML(type) {
        let preAttr = ' showpre="' + state.preShow + '"';
        let postAttr = 'showpost="' + state.postShow + '"';
        let editorAttr = 'showeditor="' + state.editorShow + '"';
        let currDB = document.querySelector("#select_db");
        if (currDB && currDB.value != currentDB) {
            toggleDB(true);
            currentDB = currDB.value ? currDB.value : currentDB;
        }
        let showDb = '';
        if (state.lang_type == 'sql' || state.lang_type == 'psql' || state.lang_type == 'mssql') {
            showDb = 'db_name="' + currentDB + '"';
            state.databases = all_databases[state.lang_type];
        }
        defaultStartXml = "<SMXML type=\"" + state.module + "\" name=\"evalpro\" case_sensitive=\'" + state.case_insensitive + "\' special_char=\'" + state.ignore_special_char +"\' partial_match=\'" + state.partial_match + "\' language=\"" + state.lang_type + "\"" + preAttr + " " + postAttr + " " + editorAttr + " " + showDb + " is_graph=\"" + state.is_graph +  "\" ignore_error=\"" + state.ignore_error +  "\" ignore_formatting=\"" + state.ignore_formatting + "\">";
        if (editor && type != "answer_check") {
            generateXml();
        }
    }

    /**
     * Function to generate the xml after any update.
     * @param isFormatted : Is formated or not.
     */
    function generateXml(isFormatted) {
        aXml = "";
        aXml = defaultStartXml + getCodeXml() + testCasesXml() + enableLineXml() + "</SMXML>";
        if (isFormatted) {
            return aXml;
        }
        getChildXml(aXml);
        return aXml;
    }

    /**
     * Function to save the evalpro answer.
     */
    function saveEvalProAnswer() {
        let uXml = generateXml(1);
        AH.select("#special_module_user_xml", 'value', uXml);
    }

    /**
     * Function to get the code xml.
     */
    function getCodeXml() {
        let codeXml = "";
        let pre_code = preEditor ? preEditor.getValue() : "";
        let post_code = postEditor ? postEditor.getValue() : "";
        if (editor) {
            codeXml = editor.getValue();
        }
        return "<pre>" + pre_code + "\n</pre><editor>" + codeXml + "</editor><post>\n" + post_code + "</post>";
    }

    /**
     * Function to set the testcases.
     */
    function setTestCase() {
        let testMatch = stringBetween(state.xml, "testcases");
        let testcaseString = testMatch.replace(/<\/case>(\n)*(\s)*<case>/g, ";").replace(/<\/case>|<case>/g, "");
        AH.select("#id1", 'value', testcaseString);
        let sample = stringBetween(state.xml, "case");
        if (sample) {
            sample = sample.replace(/\|.*/g, "");
            let inpValue = (/\{|\[|\(/g).test(sample) ? sample.replace(/\|.+/g, "") : sample.replace(/\|.+/g, "").replace(/\,/g, "\n");
            if (inpValue.indexOf('__sep__')) {
                inpValue = inpValue.replace(/__sep__/g, "\n");
            }
            AH.select("#sampleInput", 'value', inpValue);
            let caseStacks = testcaseString.split(";");
            AH.select("#caseContainer", 'html', "");
            caseStacks.forEach((event, item) => {
                let caseArr = event.split("|");
                addMore(caseArr[0], caseArr[1], item);
            });
        }
    }

    /**
     * Function to cancel the testcase modal.
     */
    function cancelTestCase() {
        if (lastTestCaseHtml) {
            AH.select('#caseContainer', 'html', lastTestCaseHtml);
            bindBtns();
        }
    }

    /**
     * Function to open the testcase modal.
     */
    function onOpenTestCase() {
        lastTestCaseHtml = document.getElementById('caseContainer').innerHTML;
    }

    /**
     * Function to bind the buttons.
     */
    function bindBtns() {
        let delBtns = document.querySelectorAll(".caseDelBtn");
        delBtns.forEach((event) => {
            event.removeEventListener("click", deleteCase);
            event.addEventListener("click", deleteCase);
        });
        let part_match = document.querySelectorAll(".partial_match .case_insensitive .ignore_special_char");
        part_match.forEach((event, index) => {
            event.removeEventListener("click", setDefaultXML);
            event.addEventListener("click", setDefaultXML);
        });
    }

    /**
     * Function to add more testcase when + button clicked from Add Testcase modal.
     * @param inp : Input.
     * @param oup : Output.
     * @param i : optional parameter.
     */
    function addMore(inp = "", oup = "", i) {
        let caseStack = document.createElement("div"),
        isSql = state.lang_type == "sql" || state.lang_type == "psql" ? "h-imp" : "";
        caseStack.className = 'caseStack m-sm';
        inp = (typeof inp == 'object') ? "" : inp;
        let index = AH.select("#caseContainer").children.length;
        let case_insensitive = state.case_insensitive;
        case_insensitive = case_insensitive.split(",");
        let case_insensitive_checked = case_insensitive[i] == 1 ? 'checked="checked"' : '';

        let ignore_special_char = state.ignore_special_char;
        ignore_special_char = ignore_special_char.split(",");
        let ignore_special_char_checked = ignore_special_char[i] == 1 ? 'checked="checked"' : '';

        let partial_match = state.partial_match;
        partial_match = partial_match.split(",");
        let partial_match_checked = partial_match[i] == 1 ? 'checked="checked"' : '';

        caseStack.innerHTML = `<div class="w-100 p-3 mt-2 mb-2" style="background: #f1f1f1"><div class="w-100"><h5 class="float-left p-1" style="width: 90%"><lable class="bage mr-4 test_case_label">${l.testcase + (index + 1)}</lable><label class="container_eval mr-4">${l.case_insensitive}<input class="case_insensitive" type="checkbox" value="${state.case_insensitive}" ${case_insensitive_checked}><span class="checkmark_eval"></span></label><label class="container_eval mr-4">${l.ignore_special_char}<input class="ignore_special_char" type="checkbox" value="${state.ignore_special_char}" ${ignore_special_char_checked}><span class="checkmark_eval"></span></label><label class="container_eval">${l.partial_match}<input class="partial_match" type="checkbox" value="${state.partial_match}" ${partial_match_checked}><span class="checkmark_eval"></span></label></h5><span tabIndex="0" class="float-right p-2 icomoon-new-24px-delete-1 s5 pointer caseDelBtn"></span></div><textarea class="form-control d-inline-block mr-md ${isSql}" style="width: 48%;height: 100px;" placeholder="${l.input_seperated_comma}">${inp}</textarea>
            <textarea class="form-control d-inline-block ml-md" style="height: 100px;width:${(state.lang_type == "sql" || state.lang_type == "psql" || state.lang_type == "mssql" ? "98%" : "48%")}" placeholder="${l.output}">${oup}</textarea></div>`;
        document.querySelector("#caseContainer").appendChild(caseStack);
        bindBtns();
    }

    /**
     * Function to check the case insensitive.
     */
    function checkCaseInsensitive() {
        let caseInsensitive = [];
        let nodes = document.querySelectorAll(".case_insensitive");
        for (let points of nodes) {
            caseInsensitive.push(points.checked ? 1 : 0);
        }

        return caseInsensitive.join(",");
    }

    /**
     * Function to check the special characters.
     */
    function checkSpecialChar() {
        let specialChar = [];
        let node = document.querySelectorAll(".ignore_special_char");
        for (let point of node) {
            specialChar.push(point.checked ? 1 : 0);
        }

        return specialChar.join(",");
    }

    /**
     * Function to check the partial match.
     */
    function checkMatchPartial() {
        let matchPartial = [];
        let match_node = document.querySelectorAll(".partial_match");
        for (let child of match_node) {
            matchPartial.push(child.checked ? 1 : 0);
        }

        return matchPartial.join(",");
    }

    /**
     * Function to delete the testcases.
     * @param event : Event parameter.
     */
    function deleteCase(event) {
        if (AH.select("#caseContainer").children.length == 1) {
            AH.alert("you can not delete default node");
        } else {
            let getParent = event.target.parentElement;
            getParent = getParent.parentElement;
            getParent = getParent.parentElement;
            getParent.remove();
            let counter = 1;
            AH.selectAll(".test_case_label").forEach((_elm)=> {
                _elm.textContent = (l.testcase + (counter++));
            });
        }
    }

    /**
     * Function to add the testcases.
     */
    function addTestCase() {
        let tempXml = xml;
        let case_match_insensitive = checkCaseInsensitive();
        let casematch_specail_char = checkSpecialChar();
        let partialmatch = checkMatchPartial();
        state.case_insensitive = case_match_insensitive;
        state.ignore_special_char = casematch_specail_char;
        state.partial_match = partialmatch;
        tempXml = tempXml.replace(/case_sensitive='[\s\S]*?' +/g, "case_sensitive='" + case_match_insensitive + "' ");
        tempXml = tempXml.replace(/special_char='[\s\S]*?' +/g, "special_char='" + casematch_specail_char + "' ");
        tempXml = tempXml.replace(/partial_match='[\s\S]*?' +/g, "partial_match='" + partialmatch + "' ");
        let caseStacks = AH.selectAll(".caseStack");
        let caseArr = [];
        caseStacks.forEach((e) => {
            let inp = e.children[0].children[1].value;
            let oup = e.children[0].children[2].value;
            caseArr.push(inp + "|" + oup + ";");
        });
        AH.select("#id1", 'value', (caseArr.join("")).replace(/;$/gm, "") );
        let testCasesValue = document.querySelector("#id1").value;
        testCasesValue = "<case>" + testCasesValue.replace(/;/g, "</case><case>") + "</case>";
        getChildXml(tempXml.replace(/<testcases>[\s\S]*?<\/testcases>/g, "<testcases>" + testCasesValue + "</testcases>"));
    }

    /**
     * Function to add the testcase in xml.
     */
    function testCasesXml() {
        let testCasesXml = stringBetween(xml, "testcases");
        return (testCasesXml ? ("<testcases>" + testCasesXml + "</testcases>") : "");
    }

    /**
     * Function to add the enable line number in xml.
     */
    function enableLineXml() {
        let enabledLine = document.querySelector("#enable-line").value ? document.querySelector("#enable-line").value : 0;
        return ("<enableline>" + enabledLine + "</enableline>");
    }

    /**
     * Function to handle the shortcut.
     * @param event : Event parameter.
     */
    function onkeyTouch(event) {
        //Added for ADA
        if ((event.ctrlKey) && (event.shiftKey) && (event.keyCode == 13)) {
            AH.select(".evalProRunCode").focus();
            AH.select(".evalProRunCode").click();
        } else if ((event.ctrlKey) && (event.shiftKey) && (event.keyCode == 32)) { 
            //ctrl+shift+space key
            AH.select("#editor-footer").focus();
            AH.select("#editor-footer").click();
        }
    }
</script>
<div tabIndex={l.zero} id="authoringArea">
    <div style="height: auto;">
        <div class="container">
            <div class="row">
                <div class="clearboth w-100" style="padding-top: {10}px;">
                    <div id="editor-top" style="width: 60%; min-height: 546px;" class="float-left">
                        <div class="full-editor" style="min-height: inherit;">
                            <div 
                                class="card card-default" 
                                id="resizeable-editor" 
                                style="margin:0; border-radius: 4px 4px 0 0; border-bottom: 0;"
                            >
                                <div class="card-header editor-heading pt-md" style="height:44px;">
                                    <div class="float-left" style="margin: -9px -14px 0 -17px">
                                        <button 
                                            type="button" 
                                            tabIndex={l.zero} 
                                            class="btn btn-md btn-light mr px-2 pt-1 language_select_button font14" 
                                            on:click={handleLanguageModalOpen}
                                        > 
                                            {(state.lang_type) == "php" ? "PHP" : toTitleCase((state.lang_type))}
                                            <span class="icomoon-arrow-down-2 font20 position-relative" style="top: 3px;"></span>
                                        </button>
                                        {#if (state.lang_type=='sql' || state.lang_type=='mssql' || state.lang_type == "psql")}
                                            <button 
                                                type="button" 
                                                tabIndex={l.zero} 
                                                class="btn btn-md btn-light mr px-2 pt-1 database_select_button font14" 
                                                on:click={handleDatabaseModalOpen}
                                            > 
                                                {state.database}
                                                <span class="icomoon-arrow-down-2 position-relative" style="font-size: 20px;top:3px;"></span>
                                            </button>
                                        {/if}
                                        <span class="d-inline-block pt-2 pl-2 selected_language  h-imp font14">
                                            {(state.lang_type) == "php" ? "PHP" : toTitleCase((state.lang_type))}
                                        </span>
                                    </div>
                                    <div class="float-right" style="margin: -9px -14px 0 4px;">
                                        <button 
                                            type="button" 
                                            tabIndex={l.zero} 
                                            class="btn btn-md btn-light mr px-2 font14" 
                                            id="addTestCase" 
                                            name="addTestCase" 
                                            on:click={onOpenTestCase} 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#testcaseActivator"
                                        >
                                            {l.add_testcase}
                                        </button>
                                        {#if (state.lang_type =='sql' || state.lang_type == 'mssql' || state.lang_type == "psql")} 
                                            <button type="button" on:click={resetDB} class="btn btn-light mr px-2 font14">{l.resetDB}</button>
                                        {/if}
                                        <button 
                                            type="button" 
                                            tabIndex={l.zero} 
                                            class="evalProRunCode btn btn-light px-2 font14" 
                                            on:click={runCode} 
                                            href="#output" 
                                            id="evalProRunCode" 
                                            name="submitcode"
                                        >
                                            <i class="fa fa-play"></i> 
                                            {(l.run).toUpperCase()}
                                        </button>
                                    </div>
                                </div>
                                
                                <div 
                                    class="card-body" 
                                    id="code-editor" 
                                    style="overflow: none; border-bottom: 1px solid #dddddd; padding: 0px; min-height: 483px; height: 488px;">
                                    <div class="card-header editor-heading py-1 pr-2 d-flex align-items-center justify-content-between action_block font14">
                                        <span>Pre</span>
                                        <button 
                                            type="button" 
                                            tabIndex={l.zero} 
                                            id="pre_editor_add_button" 
                                            class="btn btn-sm btn-light px-2 pull-right font14" 
                                            style="background-color: #fff" 
                                            on:click={() => addPreBlock(-1)} 
                                        >
                                            {state.preBlockShow ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div class="{state.preBlockShow ? '' : 'h-imp'} pre-div">
                                        <textarea id='pre-editor' class="h" placeholder={l.pre_code} name="pre-editor"></textarea>    
                                    </div>
                                    <div style="height: 44px;"class="card-header editor-heading pr-2 d-flex align-items-center justify-content-between action_block font14">
                                        <span class="d-inline span4">Editor</span>
                                        <div class="pull-right">
                                            <label tabIndex={l.zero} class="d-inline-block" for="enable-line">{l.enableline}:</label>
                                            <input 
                                                type="text" 
                                                placeholder={l.separate_by_quote} 
                                                class="form-control d-inline-block pt-1" 
                                                style="margin-left: 10px; width: 125px" 
                                                id="enable-line" 
                                            />
                                        </div>
                                    </div>
                                    <div class="replEditor">
                                        <textarea id='repl-editor' class="h" placeholder={l.write_function_here} name="repl-editor"></textarea>   
                                    </div>
                                    <div class="card-header editor-heading py-1 pr-2 d-flex align-items-center justify-content-between action_block font14">
                                        <span>Post</span>
                                        <button 
                                            type="button" 
                                            id="post_editor_add_button" 
                                            class="btn btn-sm btn-light px-2 pull-right font14" 
                                            style="background-color: #fff" 
                                            on:click={() => addPostBlock(-1)}
                                        >
                                            {state.postBlockShow ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div class="post-div {state.postBlockShow ? '' : 'h-imp'}" >
                                        <textarea id='post-editor' class="h" placeholder={l.postcode} name="post-editor"></textarea> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="editor-footer" class="float-right" style="width: 39.5%; min-height: 120px; height: 585px">
                        <div>
                            <div class="card card-default m-b">
                                <div class="card-header font14" style="height:44px">
                                    {l.input}
                                </div>
                                <div id="input" class="card-body p-0">
                                    <textarea 
                                        name="sampleInput" 
                                        class="sampleInput" 
                                        id="sampleInput" 
                                        placeholder={l.seperate_by_enter_key} 
                                        style="margin: 0px; width: 100%; height: 80px; padding: 10px; resize: none; outline: none; border: 0px"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="card card-default" style="margin-bottom: 0px">   
                                <div class="card-header pr-0 pt-1" style="height: 44px;">
                                    <span class="pt-2 d-inline-block font14" tabIndex={l.zero}>{l.output}</span>  
                                    {#if !isPreview} 
                                        <select 
                                            id="raw_btn" 
                                            class="form-control secure-icon d-inline-block mr pull-right font14" 
                                            name="raw_btn" 
                                            style="height: 34px; width: 90px;"
                                            on:change={showOutputData}
                                            on:blur={showOutputData}
                                        >
                                            <option value="html" selected="selected">HTML</option>
                                            <option value="raw">RAW</option>
                                        </select>
                                    {/if}
                                </div>
                                <div 
                                    id="output" 
                                    tabIndex={l.zero} 
                                    class="test card-body output" 
                                    style="resize: vertical; overflow: auto; padding: 10px; height: 342px; min-height: 342px"
                                >
                                    <span></span>
                                </div>
                            </div>
                            <div class="card card-default" id="test_card" style="display: none;">
                                <div class="card-header" style="height: 44px;">
                                    <a data-bs-toggle="tab" id="testcase-tab" class="inputOutput font14" href="#testcase">{l.testcases}</a>
                                </div>
                                <div id="testcase" class="card-body in" style="resize: none; overflow: auto; padding: 10px; height: 180px">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {#if (state.lang_type=='sql' || state.lang_type=='mssql' || state.lang_type == "psql")}
            <Dialog bind:visible={state.database_modal_open} width={225} aria-labelledby="simple-dialog-title" style="background-color:#fff;" class="dialog evalpro_dialog">
                <div style="text-align: left;width: 225px; margin-left: 17px;">
                    <div class="font20">Select Database <span class="position-relative" style="left: 20px; top: -12px; font-size: 20px; cursor: pointer;" on:click = {handleDatabaseModalOpen}>X</span></div>
                </div>
                <div style="position: relative; top: 14px;">
                    {#each state.databases as database} 
                        <div class="dropdown-item evalpro_dropdown" tabindex="0" on:click={handleDatabaseItem.bind(this, database)} key={database} style="height: 50px; line-height: 45px; cursor: pointer; padding-left: 20px;">
                            {database}
                        </div>
                    {/each}
                </div>
            </Dialog>
        {/if}
        <Dialog bind:visible={state.open} width={225} style="background-color:#fff;" class="dialog evalpro_dialog">
            <div style="text-align: left; width: 225px;  margin-left: 17px">
                <div class="font20">Select Language <span class="position-relative" style="left: 20px; top: -12px; font-size: 20px; cursor: pointer;" on:click = {handleLanguageModalOpen}>X</span></div>
            </div>
            <div style="position: relative; top: 14px;">
                {#each lang_type as lang}
                    <div class="dropdown-item evalpro_dropdown" tabindex="0" on:click={handleLanguageSelection.bind(this, lang)} key={lang} style="height:60px; cursor: pointer; padding-left: 20px">
                        <div class="text-center d-inline-block" style="height: 50px; width: 50px; background: #ccc;border-radius: 50%;">
                            <img style="border-radius: 50%;height:50px;" src={window.itemUrl + "images/" + (lang == "c#" ? "csharp" : lang ) + "_lang.png"} alt="Language"/>
                        </div>
                        <div class="pl-1 d-inline-block" style="padding: 15px;">{lang.charAt(0).toUpperCase() + lang.slice(1)}</div>
                    </div>
                {/each}
            </div>
        </Dialog>
        <div class="modal fade" id="testcaseActivator" tabIndex={l.minus_1} role="dialog" aria-labelledby="testcaseActivatorLabel">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <input class="form-control testCaseInput h-imp" type="text" id="id1" />
                        <h4>{l.add_testcase}</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body overflow-auto mt-0 pt-0" style="max-height:440px;">
                        <div id="caseContainer" class="float-right mt-sm overflow-auto" style="width: 100%">
                            <div class="caseStack m-sm">
                                <h5 class="float-left" style="width: auto">
                                    <span tabIndex={l.zero}>{l.select_case_match}</span>                           
                                    <select
                                        value={state.testcase_sensitive}
                                        on:change={setDefaultXML}
                                        on:blur={setDefaultXML}
                                        style="margin: 2px 24px"
                                        classes="v-bottom"
                                        id="testcase_sensitive" 
                                    >                               
                                        <option value="0">{l.case_insensitive}</option>
                                        <option value="1">{l.partial_matching}</option>
                                        <option value="2">{l.special_char}</option>
                                    </select>
                                </h5>
                                <textarea style="height: 100px;" class={state.lang_type == "sql" || state.lang_type == "psql" ? "form-control width-md1 d-inline-block mr-md h-imp" : "form-control width-md1 d-inline-block mr-md"} placeholder="Input seperated by ','"></textarea>
                                <textarea style="height; 100px;" class={'form-control '+(state.lang_type == "sql" || state.lang_type == "psql" ? "span9" : "width-md1")+' d-inline-block ml-md'} placeholder="Output"></textarea>
                                <span tabIndex="0" class="float-right icomoon-new-24px-delete-1 s5 pointer caseDelBtn"></span>
                            </div>
                        </div>
                        <div class="d-inline-flex pull-right" style="width: 50px;">
                            <Button 
                                color="primary" 
                                unelevated="true"
                                on:click={addMore} 
                                aria-label="Add" 
                                style="height: 40px; width: 40px; border-radius: 50%"
                            >
                                <spna class="icomoon-plus"></spna>
                            </Button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" on:click={addTestCase} class="btn btn-light addTestCase" data-bs-dismiss="modal">{l.submit}</button>
                        <button type="button" class="btn btn-light" on:click={cancelTestCase} data-bs-dismiss="modal">{l.cancel}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <textarea id="special_module_user_xml" class="h"></textarea>
    <Dialog bind:visible={state.remediationToggle} width={960} class="dialog bg-white">
        <div style="text-align: left;">
            <div class="font20">{l.remediation}</div>
        </div>
        <div id="remediationModel">
            <center class="mt-xl">
                <Loader size = {60} thickness = {3} />
                <h4>{l.calculate_answer}<br/>{l.please_wait}</h4>
            </center>
        </div>
        <Snackbar
            bind:visible={state.snackback} 
            bg="#333" 
            bottom={true}  
            timeout={3000} 
            style="position:fixed; bottom:50px"
        >
            {message}
        </Snackbar>
        <div slot="footer" class="svelteFooter">
            <Button
                raised={true}
                on:click = {()=>{ state.remediationToggle = false}}
                class="bg-light"
            >
                {l.cancel}
            </Button>
        </div>
    </Dialog>
    <input type="hidden" id="ansModeAnswer" value="" />
</div>
<svelte:window on:keyup={onkeyTouch}  />