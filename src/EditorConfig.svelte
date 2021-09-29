<script context="module">
import {editorDetails} from './EditorDetails.svelte';
import { AH } from '../helper/HelperAI.svelte';
import l from '../src/libs/editorLib/language';
let editorStage = false;
let updateParent = false;
let handleModal = false;
const text_data = "<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec.</div>";
export const editorConfig = {
    getSection: function(data, type = false, node = false) {
        //let inlineClass = (type == "inline") ? " inline" : "";
        let sectionHtml = "";
        if (typeof data == "object") {
            let itemHtml = data.getAttribute('data-html');
            let itemType = data.getAttribute('data-type');
            //@Pradeep : code for class selection----------------------------------------------
            sectionHtml = getSectionAttr(itemHtml, itemType);
        } else {
            sectionHtml =  checkUnWrapped(data, node);
        }
        return sectionHtml;
    },
    getSectionDef: getSectionAttr,
    eBookItemTypeOld: 'section[type="ebook-item"]',
    eBookItemType: 'div[type="ebook-item"]',
    initAddFeatureSelector: function(stem, remediation, content) {
        content = content ? content : "Place your text here.";
        return {
            '#stem': {data: stem, holder: "stem", copyInto: "oldStemData", store: {stem, oldStemData: stem}, label:'Stem', }, 
            '#remediation': {data: remediation, holder: "remediation", store: {remediation}, label:'Remediation', inline: "inline"},
            '#content': {data: content, holder: "content", store: {content}, label:'Content'},
        };
    }, 
    setParent: function(statUpdate, handleModalFunc) {
        updateParent = statUpdate;
        if (handleModalFunc) handleModal = handleModalFunc;
    },
    maintainAlignments: function(data, action=false) {
		if (!AH.isValid(data)) {
			data = "";
		}
		if (action == "all" && AH.isValid(data)) {
			for (let type in data) {
				data[type] = data[type].replace(/(?![^<>]*>)\s\s/g, '&#160; ');
			}
		} else {
			data = data.replace(/(?![^<>]*>)\s\s/g, '&#160; ');
		}
		return data;
	},
    getConfig: function(state, data = {}) {
        // Editor Layout will decide here what we are going to show.
        let subtype = +state.item;
        let type = state.content_type ||  state.moduleType;
        let configData = {};
        console.warn({subtype, type});
        for(let key in editorDetails[type]) {
            if (editorDetails[type][key]) {
                if (typeof editorDetails[type][key] == "object") {
                    if (editorDetails[type][key].view) {
                        let isRestricted = editorDetails[type][key].restrict && editorDetails[type][key].restrict.find((restrict)=> restrict == subtype);
                        if (isRestricted || isRestricted == 0) {
                            configData[key] = false;
                        } else {
                            let isObject = (editorDetails[type][key].view == "*") ? true : editorDetails[type][key].view.find((allowedSubtype)=> allowedSubtype == subtype)
                            configData[key] = isObject ? editorDetails[type][key] : false;
                        }
                    } 
                } else {
                    configData[key] = editorDetails[type][key]; 
                }
            }
        }
        return configData;

    },
    mathMl: function(type, target, state) {
       switch(type) {
           case 'reset' : AH.get('mathjaxEnabled') && MathJax.typesetClear();
           break;
           case 'set' :  AH.get('mathjaxEnabled') && MathJax.typeset(["#previewSection"]);
           break;
           case 'setAll': AH.get('mathjaxEnabled') && MathJax.typeset();
           break;
           case 'getMathIn' : AH.get('mathjaxEnabled') && MathJax.startup.document.getMathItemsWithin(target); 
           break;
           case 'add': 
                // Configure MathJax
                /*
                MathJax = {
                    startup: {
                      elements: null,          // The elements to typeset (default is document body)
                      typeset: true,           // Perform initial typeset?
                      ready: Startup.defaultReady.bind(Startup),          // Called when components are loaded
                      pageReady: Startup.defaultPageReady.bind(Startup),  // Called when MathJax and page are ready
                      document: document,      // The document (or fragment or string) to work in
                      input: [],               // The names of the input jax to use from among those loaded
                      output: null,            // The name for the output jax to use from among those loaded
                      handler: null,           // The name of the handler to register from among those loaded
                      adaptor: null            // The name for the DOM adaptor to use from among those loaded
                    }
                  };
                */
                window.MathJax = {
                    options: {
                        enableMenu: false,
                    },
                    startup: {
                        elements: ["#previewSection"],
                        ready: () => {
                            console.warn('MathJax is loaded, but not yet initialized');
                            MathJax.startup.defaultReady();
                            console.warn('MathJax is initialized, and the initial typeset is queued');
                            MathJax.startup.promise.then(() => {
                                console.warn('MathJax initial typesetting complete');
                                AH.set("mathjaxEnabled", true);
                            });
                          }
                    },
                };

                AH.addScript("", 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-chtml.js',{target: 'body'});
                // AH.ajax({
                //     url: `https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-chtml.js`,
                //     async: true,
                //     data: {},
                //     type: 'GET',
                //     dataType: "script",
                // }).then((script)=> {
                //     setTimeout(()=> {
                //         AH.addScript(script);
                //     },10000)
                // });
           break;
       }
    }, 
    findMathError: function() {
        AH.set("mathjaxEnabled", false);
        let item  = document.querySelectorAll('#authoringSection math');
        if (item) {
            nodeFinder.find(item, mathTagCorrection.bind(this));
        }
    },
    checkBlank: function(state, Items, updateModule) {
        if (state.viewConfig.checkRequired) {
            switch(state.viewConfig.required) {
                case 'stem' : 
                    let check = Items.UI.doNotCheckStem && !Items.UI.doNotCheckStem(state);
                    if (state.stem == "" && !check) {
                        updateModule('message', "You must specify a question.");
                        updateModule('saveDialog', false);
                        updateModule('snackback', true);
                        AH.activate(0);
                        return true;
                    }
                break;
                case 'title' : 
                    if (state.title == "") {
                        updateModule('message', "You must specify a title.");
                        updateModule('saveDialog', false);
                        updateModule('snackback', true);
                        AH.activate(0);
                        return true;
                    }
                break;
            }
        }
        return false;
    },
    editorTable: function(lang) {
        return ([
            {
              text: lang.deftable,
              html: "<table class='sorttable uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.smplbortab,
              html: "<table class='sorttable table1 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.unbortab,
              html: "<table class='sorttable table2 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.borbacktab,
              html: "<table class='sorttable table3 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.hrowsbor,
              html: "<table class='sorttable table4 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th</tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.strptab,
              html: "<table class='sorttable table5 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.tabhovdes,
              html: "<table class='sorttable table6 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.mulstrp,
              html: "<table class='sorttable table7 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.separate,
              html: "<table class='sorttable table8 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table>",
            },
            {
              text: lang.grycolor,
              html: "<table class='uc-table'><caption>Table 1: Add Table Caption Here</caption><thead><tr><th colspan='3' width='40%'>Do This</th><th>How & Why</th></tr></thead><tbody><tr><td>1.</td><td colspan='2'>Activate the <b>Index-Match</b> worksheet.</td><td class='gray-col'>It contains sales data by rep and product.</td></tr><tr><td>2.</td><td colspan='2'>Observe G10:I11.</td><td class='gray-col'>This range contains an interface for looking up sales values for a combination of rep and product. In this small a table, such an interface isn't entirely necessary. But you can imagine how useful this could be with a very large amount of data.</td></tr></tbody></table>",
            }
          ]);
    },
    onlyContent: function(type, subtype) {
        let restricted = {'p': "n", 'f': '52'};
        if (restricted[type]) {
            return (restricted[type].length > 1) ? restricted[type].includes(subtype) : true;
        }
        return false;
    },
    otherContent: function(content_type, subtype) {
      let type = {'p': "n", 'a': "n", 'e': "n", 'f': "45,52"};
      if (type[content_type]) {
        return (type[content_type].length > 1) ? type[content_type].includes(subtype) : true;
      }
      return false;
    },
    controls: function(config) {
        return `<main data-remove="true" contenteditable="false" class="controls_button"><div class="block-controls"><div class="block-controls__container"><div class="block-controls__bar"><div class="block-controls__config" style=""><button class="button--controls h-imp">Edit</button></div>${createControls(config)}</div></div></div></div></main>`;
    },
    add_item_button : '<main data-remove="true" class="remove_me text-center" style="outline:none;height:25px" contenteditable="false"><button type="button" class="add_item_template add_item_button_style">+</button></main>',
    keyboardShortcutLayout: function() {
        return(`
            <div id="accordions" class="panel-group mb-0 mx-3 mt-3">
                <div class="card mb">
                    <div class="card-header p-0 height35 rounded-0 bg-secondary">
                        <a data-bs-toggle="collapse" href="#commonShortcuts" class="card-link text-white outline1 d-inline-block w-100 px-3 collapsed" aria-expanded="false"><p class="d-inline-block text-white font18 pt-1 mb-0">Common Shortcuts</p><span class="icomoon-arrow-down-2 s6 float-right pt-1"></span></a>
                    </div>
                    <div id="commonShortcuts" class="collapse show" data-parent="#accordions">
                        <div class="card-body">
                            <table role="presentation" class="m-0 border-0 common-shortcut-table table-striped font15">
                                <tbody>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + C</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Copy</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + X</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Cut</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + V</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Paste</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + F</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Find</span></div></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card mb">
                    <div class="card-header p-0 height35 rounded-0 bg-secondary">
                        <a data-bs-toggle="collapse" href="#testShortcuts" class="card-link text-white outline1 d-inline-block w-100 px-3"><p class="d-inline-block text-white font18 pt-1 mb-0">Editor Shortcuts</p><span class="icomoon-arrow-down-2 s6 float-right pt-1"></span></a>
                    </div>
                    <div id="testShortcuts" class="collapse" data-parent="#accordions">
                        <div class="card-body">
                            <table role="presentation" class="m-0 border-0 test-table table-striped font15">
                                <tbody>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Shift + Enter</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Cursor out from code block</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Enter + Enter</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Cursor out from list</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + C</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Code Format</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + H</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Open Keyboard shortcut (Help)</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + V</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Paste Special (Formatting)</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + N</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Next Item (Multiple Item)</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + P</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Previous Item (Multiple Item)</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + T</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Switch Tab (Editor View)</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + S</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Save</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + L</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Item List</span></div></td></tr>
                                    <tr><td class="py-1 font-weight-bold w-50 pr-0">Ctrl + Alt + Plus</td><td class="py-1"><div class="d-flex"><span class="font-weight-bold">:</span><span class="pl-3">Add New Section</span></div></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`
        );
    },
    createToolMenu: function(state, lang) {
        // Tool menu array
        let preCheck = (!state.verticalView || state.content_type == "f");
        let toolMenuJson = [
            {
                id: 'xmlMenu',
                funcName: ()=> updateParent("","", 'getXml'),
                label: "XML",
                view: (state.viewConfig.showXMl) ? true : false,
            },
            {
                id: 'renderPlayerMenu',
                funcName: ()=> updateParent("","", 'renderPlayer'),
                label: lang.render_tag,
                view: preCheck ? true : false,
            },
            {
                id: 'todoMenu',
                funcName: loadTodoMenu,
                funcArg: "Show Todo",
                label: "Task Details",
                view: (preCheck && todo_table) ? true : false,
            },
            {
                id: 'domainMenu',
                funcName: toggleDomain.bind(this, true),
                funcArg: true,
                label: lang.domain,
                view: (is_domain && ('q,u'.includes(state.content_type) || getQueryString("is_flashcard") == 1)) ? true : false,
            },
            {
                id: 'versionControlMenu',
                funcName: versionControl.bind(this, true),
                funcArg: true,
                label: lang.version_control,
                view: (content_for_newEditor) ? true : false,
            },
            {
                id: 'toggleExamMenu',
                funcName: toggleExam.bind(this, true),
                funcArg: true,
                label: lang.exam_objective,
                view: (from_myproject == 1 && (state.content_type == 'u' && state.content_type == 'f')) ? true : false,
            },
            {
                id: 'versionControlCurrentMenu',
                funcName: versionControlCurrent,
                funcArg: true,
                label: lang.restore_currect,
                view: (version_date) ? true : false,
            },
            {
                id: 'web_pagesMenu',
                funcName: toggleDomain.bind(this, true),
                funcArg: true,
                label: lang.web_pages,
                view: (state.content_type == 'p') ? true : false,
            },
            // {
            //     id: 'diagnosticMenu',
            //     funcName: handleDiagnostic.bind(this, state),
            //     label: lang.diagnostic,
            //     extraProp: {disableEnforceFocus: true},
            //     view: true,
            // },
            {
                id: 'analyze_ebookMenu',
                funcName: ()=> updateParent('AnalyzeEbookMenu', true, ''),
                label: lang.analyze_ebook,
                view: (state.oldStemData != '') ? true : false, // not showing currently
            },
            {
                id: 'vttParserMenu',
                funcName: vttParser,
                label: "VTT Parser",
                view: preCheck && (state.content_type == 'p' || state.item == 45) ? true : false,
            },
        ];

        return toolMenuJson;
    },
    createIteractive: function() {
        // side pane section array
      return [{
        "text":{
            "p_tag":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/paragraph_000oaO.png",
                "label":l.para,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'>Place Your Text Here</div>"
            }
        },
        "list":{
            "interactive_tags_1":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/black_arrow_bullet_000oao.png",
                "label":l.blarlist,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='arrowlist-bullet'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul></div>"
            },
            "interactive_tags_2":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/blue_arrow_bullet_000oaP.png",
                "label":l.bluearlist,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='arrow-bullet'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul></div>"
            },
            "interactive_tags_3":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/blue_arrow_bullet_grey_bg_000oap.png",
                "label":l.blarbullet,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='arrow-bullet arrow-bullet-list'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul></div>"
            },
            "interactive_tags_4":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/blue_circle_bullet_000oau.png",
                "label":l.blcrcbbullet,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='circle-bullet darkblue-txt'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul></div>"
            },
            "interactive_tags_5":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/white_circle_list_000oaV.png",
                "label":l.whcrclist,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='whitecircle-list la' style='counter-increment: li-counter 0;'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "interactive_tags_6":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/redCircle_000A9f.png",
                "label":l.redcrlist,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='circle-list' style='counter-increment: li-counter 0;'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "interactive_tags_7":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/blue_circle_bullet_black_text_000oB8.png",
                "label":l.bcbwbt,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='circle-bullet'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul></div>"
            },
            "list_0":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type0_000oB6.png",
                "label":l.tickbull,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='tick-bullet'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul></div>"
            },
            "list_1":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type1_000oB9.png",
                "label":l.listtype1,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='list1'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "list_2":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type2_000oB7.png",
                "label":l.listtype2,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='list2'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "list_3":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type3_000oBA.png",
                "label":l.listtype3,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='list3'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "list_4":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type4_000oBB.png",
                "label":l.listtype4,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='list4'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><ol class='list4'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "list_5":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type5_000oBa.png",
                "label":l.listtype5,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ol id='interactive_list' class='list5'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ol></div>"
            },
            "list_6":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/list_type6_000oBb.png",
                "label":l.listtype6,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><ul id='interactive_list' class='list6'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li><ul class='list6'><li>PLACE YOUR TEXT HERE</li><li>PLACE YOUR TEXT HERE</li></ul><li>PLACE YOUR TEXT HERE</li></ul>"
            },
            config:{
                "hide":true,
                "editing_type" : "1",
                "editing_type_1":"interactive_tags_1|arrowlist-bullet|#interactive_list,interactive_tags_2|arrow-bullet|#interactive_list,interactive_tags_3|arrow-bullet arrow-bullet-list|#interactive_list,interactive_tags_4|circle-bullet darkblue-txt|#interactive_list,interactive_tags_5|whitecircle-list la|#interactive_list,interactive_tags_6|circle-bullet|#interactive_list,list_1|list1|#interactive_list,list_2|list2|#interactive_list,list_3|list3|#interactive_list,list_4|list4|#interactive_list,list_5|list5|#interactive_list,list_6|list6|#interactive_list",
            }
        },
        "table":{
            "table_0":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_0_000oBE.png",
                "label":l.deftable,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_1":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_1_000oBf.png",
                "label":l.smplbortab,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table1 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_2":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_2_000oBc.png",
                "label":l.unbortab,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table2 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_3":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_3_000oBg.png",
                "label":l.borbacktab,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table3 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_4":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_4_000oBD.png",
                "label":l.hrowsbor,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table4 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th</tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_5":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_5_000oBd.png",
                "label":l.strptab,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table5 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_6":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_6_000oBe.png",
                "label":l.tabhovdes,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table6 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_7":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_7_000oBG.png",
                "label":l.mulstrp,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table7 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_8":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_8_000oBF.png",
                "label":l.separate,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table8 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            "table_9":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_9_0007d4.png",
                "label":l.grycolor,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='uc-table'><caption>Table 1: Add Table Caption Here</caption><thead><tr><th colspan='3' width='40%'>Field 1</th><th>Field 2</th></tr></thead><tbody><tr><td>1.</td><td colspan='2'>Lorem ipsum dolor sit amet,</td><td class='gray-col'>Lorem ipsum dolor sit amet.</td></tr><tr><td>2.</td><td colspan='2'>Lorem ipsum dolor sit amet,</td><td class='gray-col'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td></tr></tbody></table></div>"
            },
            "table_10":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/table_10_000oBH.png",
                "label":l.blueshade,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><table class='sorttable table10 uc-table' tablesorter=''><caption>Table 1: Add Table Caption Here</caption><thead><tr><th>Name</th><th>Field 1</th></tr></thead><tbody><tr><td>Malcom</td><td>Lorem ipsum dolor sit amet, </td></tr></tbody></table></div>"
            },
            config:{
                "hide":true,
                "editing_type" : "1",
                "editing_type_1":
                "table_0|sorttable uc-table|.sorttable,table_1|sorttable table1 uc-table|.sorttable,table_2|sorttable table2 uc-table|.sorttable,table_3|sorttable table3 uc-table|.sorttable,table_4|sorttable table4 uc-table|.sorttable,table_5|sorttable table5 uc-table|.sorttable,table_6|sorttable table6 uc-table|.sorttable,table_7|sorttable table7 uc-table|.sorttable,table_8|sorttable table8 uc-table|.sorttable,table_10|sorttable table10 uc-table|.sorttable",
            }
        },
        "code-block":{
            "black":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/black_one_000oBL.png",
                "label":l.code_block2,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><uc:syntax console=''>Place Your Text Here<br />Place Your Text Here</uc:syntax></div>"
            },
            "black_nonum":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/black_nonum_000oBk.png",
                "label":l.code_block3,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><uc:syntax console='' hidelinenums=''>Place Your Text Here<br />Place Your Text Here</uc:syntax></div>"
            },
            "white":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/white_000oBl.png",
                "label":l.code_block4,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><uc:syntax white=''>Place Your Text Here<br />Place Your Text Here</uc:syntax></div>"
            },
            "white_nonum":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/white_nonum_000oBM.png",
                "label":l.code_block5,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><uc:syntax hidelinenums=''>Place Your Text Here<br />Place Your Text Here</uc:syntax></div>"
            },
            config:{
                "hide":true,
                "editing_type" : "1",
                "uc_syntax": true,
                // @uc-abk added this line due to not working change type dynamically.
                "editing_type_1":"Hide Numbers||uc\\:syntax|hidelinenums|default,black_nonum||uc\\:syntax|console|black|black_nonum||uc\\:syntax|console hidelinenums,white_nonum||uc\\:syntax|white|white_nonum"
                //by Saquib sir:  "editing_type_1":"Hide Numbers||uc\\:syntax|hidelinenums|default,black||uc\\:syntax|console,black_nonum||uc\\:syntax|console nonum,white||uc\\:syntax|white,white_nonum||uc\\:syntax|white,"
            }
        },
        "panel":{
            "interactive_tags_13":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panels_1_000oBP.png",
                "label":l.panel_success,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='board panel-success'><div class='panel-heading'><span class='ebook_item_text'>PLACE HEADING FOR THE PANEL HERE</span></div><div class='panel-body'><div class='ebook_item_text'>PLACE YOUR TEXT/BODY OF THE PANEL HERE</div></div></div></div>"
            },
            "interactive_tags_14":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panels_2_000oBo.png",
                "label":l.panel_info,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='board panel-info'><div class='panel-heading'><span class='ebook_item_text'>PLACE HEADING FOR THE PANEL HERE</span></div><div class='panel-body'><div class='ebook_item_text'>PLACE YOUR TEXT/BODY OF THE PANEL HERE</div></div></div></div>"
            },
            "interactive_tags_15":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panels_3_000oBN.png",
                "label":l.panel_primary,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='board panel-primary'><div class='panel-heading'><span class='ebook_item_text'>PLACE HEADING FOR THE PANEL HERE</span></div><div class='panel-body'><div class='ebook_item_text'>PLACE YOUR TEXT/BODY OF THE PANEL HERE</div></div></div></div>"
            },
            "interactive_tags_16":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panels_4_000oBn.png",
                "label":l.panel_danger,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='board panel-danger'><div class='panel-heading'><span class='ebook_item_text'>PLACE HEADING FOR THE PANEL HERE</span></div><div class='panel-body'><div class='ebook_item_text'>PLACE YOUR TEXT/BODY OF THE PANEL HERE</div></div></div></div>"
            },
            "interactive_tags_17":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panels_5_000oBO.png",
                "label":l.panel_warning,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='board panel-warning'><div class='panel-heading'><span class='ebook_item_text'>PLACE HEADING FOR THE PANEL HERE</span></div><div class='panel-body'><div class='ebook_item_text'>PLACE YOUR TEXT/BODY OF THE PANEL HERE</div></div></div></div>"
            },
            config:{
                "hide":true,
                "editing_type" : "1",
                "editing_type_1":"interactive_tags_13|board panel-success|.board,interactive_tags_14|board panel-info|.board,interactive_tags_15|board panel-primary|.board,interactive_tags_16|board panel-danger|.board,interactive_tags_17|board panel-warning|.board"
            }
    
        },
        "Accordion":{
            "panel_1":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panel_1_000oBp.png",
                "label":l.acc_list1,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><section type='ebook_item' sub_type='panel'><section class='drop_list drop_list_a drop_list1' nd='0'><section nd='1'><header class='ebook_item_text'><span style='cursor:auto;'>Panel 1</span></header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</article></section><section nd='1'><header class='ebook_item_text'><span style='cursor:auto;'>Panel 2</span></header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</article></section></section></section></div>"
            },
            "panel_2":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panel_2_000oBQ.png",
                "label":l.acc_list2,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><section type='ebook_item' sub_type='panel'><section class='drop_list drop_list_a drop_list2' nd='0'><section nd='1'><header class='ebook_item_text'><span style='cursor:auto;'>Panel 1</span></header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </article></section><section nd='1'><header class='ebook_item_text'><span style='cursor:auto;'>Panel 2</span></header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</article></section></section></section></div>"
            },
            "panel_3":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panel_3_000oBq.png",
                "label":l.acc_list3,  
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><section type='ebook_item' sub_type='panel'><section class='drop_list drop_list_b drop_list3' nd='0'><section nd='1'><header class='ebook_item_text'> This is a title for my toggle!</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </article></section><section nd='1'><header class='ebook_item_text'> This is a title for my toggle!</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </article></section><section nd='1'><header class='ebook_item_text'> This is a title for my toggle!</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</article></section></section></section></div>"
            },
            "panel_4":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/panel_4_000oBR.png",
                "label":l.acc_list4,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><section type='ebook_item' sub_type='panel'><section class='drop_list drop_list_b drop_list4' nd='0'><section nd='1'><header class='ebook_item_text'> This is a title for my toggle! </header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </article></section><section nd='1'><header class='ebook_item_text'> This is a title for my toggle!</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </article></section><section nd='1'><header class='ebook_item_text'> This is a title for my toggle!</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</article></section></section></section></div>"
            },
            config:{
                "hide":true,
                "editing_type" : "1",
                "editing_type_1":"panel_1|drop_list drop_list_a drop_list1|.drop_list,panel_2|drop_list drop_list_a drop_list2|.drop_list,panel_3|drop_list drop_list_b drop_list3|.drop_list,panel_4|drop_list drop_list_b drop_list4|.drop_list",
                "render_tags" : true,
            }
        },
        "box" :{
            "interactive_tags_18":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/interactive_item/panels_6.png",
                "label":l.panelblue,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='bbox box1'><div class='ebook_item_text'>Place your text here</div></div></div>"
            },
            "interactive_tags_19":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/interactive_item/panels_7.png",
                "label":l.panelgreen,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='bbox box2'><div class='ebook_item_text'>Place your text here</div></div></div>"
            },
            "interactive_tags_20":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/interactive_item/panels_8.png",
                "label":l.panelsky,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='bbox box3'><div class='ebook_item_text'>Place your text here</div></div></div>"
            },
            "interactive_tags_21":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/interactive_item/panels_9.png",
                "label":l.panelgrad,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='bbox box4'><div class='ebook_item_text'>Place your text here</div></div></div>"
            },
            "interactive_tags_box22":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/interactive_item/block_bg.png",
                "label":l.blockgrey,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='bbox box5'><div class='ebook_item_text'>Place your text here</div></div></div>"
            },
            "interactive_tags_box23":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/box6_000o1Q.png",
                "label":l.block_with_border,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='bbox box6'><div class='ebook_item_text'>Place your text here</div></div></div>"
            },
            
            config:{
                "hide":true,
                "editing_type" : "1",
                "editing_type_1":"interactive_tags_18|box1 bbox|.bbox,interactive_tags_19|box2 bbox|.bbox,interactive_tags_20|bbox box3|.bbox,interactive_tags_21|bbox box4|.bbox,interactive_tags_box22|bbox box5|.bbox,interactive_tags_box23|bbox box6|.bbox"
            }
        },
        "CALLOUTS":{
            "SNT0":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/default_snt_000OjP_000oBr.jpg",
                "label":"Default Fact",
                "html": getIntractiveHtml("snt", {label: "Default Fact", icon: "default_v2"}),
            },
            "SNT1":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/note_snt_000Ojc_000oBU.jpg",
                "label":"Note",
                "html": getIntractiveHtml("snt", {label: "Note", icon: "notes_v2"}),
            },
            "SNT2":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/tips_snt_000OjD_000oBt.jpg",
                "label":"Tips",
                "html": getIntractiveHtml("snt", {label: "Tips", icon: "tips_v2"}),
            },
            "SNT3":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/decision_snt_000Ojd_000oBw.jpg",
                "label":"Decision",
                "html": getIntractiveHtml("snt", {label: "Decision", icon: "decision_v2"}),
            },
            "SNT4":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/example_snt_000OjE_000oBV.jpg",
                "label":"Example",
                "html":getIntractiveHtml("snt", {label: "Example", icon: "example_v2"}),
            },
            "SNT5":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/cautions_snt_000Oje_000oBs.jpg",
                "label":"Cautions",
                "html":getIntractiveHtml("snt", {label: "Cautions", icon: "cautions_v2"}),
            },
            "SNT6":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/lab_snt_000OjF_000oBv.jpg",
                "label":"Lab",
                "html":getIntractiveHtml("snt", {label: "Lab", icon: "lab_v2"}),
            },
            "SNT7":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/warnig_snt_000Ojf_000oBW.jpg",
                "label":"Warnings",
                "html":getIntractiveHtml("snt", {label: "Warnings", icon: "warnings_v2"}),
            },
            "SNT8":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/research_snt_000OjG_000oBT.jpg",
                "label":"Research",
                "html":getIntractiveHtml("snt", {label: "Research", icon: "notes_v2"}),
            },
            "SNT9":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/know_snt_000Ojg_000oBS.jpg",
                "label":"Know",
                "html":getIntractiveHtml("snt", {label: "Know", icon: "know_v2"}),
            },
            "SNT10":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/responsibilty_snt_000OjH_000oBu.jpg",
                "label":"Resp",
                "html":getIntractiveHtml("snt", {label: "Resp", icon: "resp_v2"}),
            },
            "SNT11":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/spotlight_snt_000Ojh_000ob2.jpg",
                "label":"Spotlight",
                "html":getIntractiveHtml("snt", {label: "Spotlight", icon: "spotlight_v2"}),
            },
            "SNT12":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/realworld_snt_000OjI_000ob1.jpg",
                "label":"RealWorld",
                "html":getIntractiveHtml("snt", {label: "RealWorld", icon: "realworld_v2"}),
            },
            "SNT14":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/job_snt_000Oji_000oBz.jpg",
                "label":"Job",
                "html":getIntractiveHtml("snt", {label: "Job", icon: "job_v2"}),
            },
            "SNT15":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/exam_snt_000OjJ_000oBy.jpg",
                "label":"Exam",
                "html":getIntractiveHtml("snt", {label: "Exam", icon: "exam_v2"}),
            },
            "SNT16":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/learn_wgu_snt_000Ojj_000oBZ.jpg",
                "label":"Learn WGU",
                "html":getIntractiveHtml("snt", {label: "Learn WGU", icon: "learnwgu_v2"}),
            },
            "SNT17":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/wgu_000OjR_000ob3.jpg",
                "label":"Learn Reflect Nursing",
                "html":getIntractiveHtml("snt", {label: "Learn Reflect Nursing", icon: "learn-reflect-nursing_v2"}),
            },
            "SNT18":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/reading_nursing_snt_000OjK_000ob0.jpg",
                "label":"Reading Nursing",
                "html":getIntractiveHtml("snt", {label: "Reading Nursing", icon: "reading_v2"}),
            },
            "SNT19":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/bits_snt_000Ojk_000oBx.jpg",
                "label":"Bits",
                "html":getIntractiveHtml("snt", {label: "Bits", icon: "bits_v2"}),
            },
            "SNT20":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/bytes_snt_000OjL_000oBY.jpg",
                "label":"Bytes",
                "html":getIntractiveHtml("snt", {label: "Bytes", icon: "bytes_v2"}),
            },
            "SNT21":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/ip_snt_000Ojl_000ob7.jpg",
                "label":"IP",
                "html":getIntractiveHtml("snt", {label: "IP", icon: "ip_v2"}),
            },
            "SNT22":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/gp_snt_000OjM_000ob8.jpg",
                "label":"GP",
                "html":getIntractiveHtml("snt", {label: "GP", icon: "gp_v2"}),
            },
            "SNT23":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/chain_snt_000Ojm_000ob9.jpg",
                "label":"Chain",
                "html":getIntractiveHtml("snt", {label: "Chain", icon: "chain_v2"}),
            },
            "SNT24":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/ethics_snt_000OjN_000ob5.jpg",
                "label":"Ethics",
                "html":getIntractiveHtml("snt", {label: "Ethics", icon: "ethics_v2"}),
            },
            "SNT25":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/excercise_snt_000Ojn_000ob6.jpg",
                "label":"Exercise",
                "html":getIntractiveHtml("snt", {label: "Exercise", icon: "exercise_v2"}),
            },
            "SNT26":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/spinner_snt_000OjO_000obA.jpg",
                "label":"Spinner",
                "html":getIntractiveHtml("snt", {label: "Spinner", icon: "spinner_v2"}),
            },
            "SNT27":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/design_scenario_000Ojo_000ob4.jpg",
                "label":"Design Scenario",
                "html":getIntractiveHtml("snt", {label: "Design Scenario", icon: "design_v2"}),
            },
            config: {
                "hide":true,
                "editing_type":"1",
                "editing_type_1":"SNT0|CUSTOM|CALLOUTS,SNT1|CUSTOM|CALLOUTS,SNT2|CUSTOM|CALLOUTS,SNT3|CUSTOM|CALLOUTS,SNT4|CUSTOM|CALLOUTS,SNT5|CUSTOM|CALLOUTS,SNT6|CUSTOM|CALLOUTS,SNT7|CUSTOM|CALLOUTS,SNT8|CUSTOM|CALLOUTS,SNT9|CUSTOM|CALLOUTS,SNT10|CUSTOM|CALLOUTS,SNT11|CUSTOM|CALLOUTS,SNT12|CUSTOM|CALLOUTS,SNT14|CUSTOM|CALLOUTS,SNT15|CUSTOM|CALLOUTS,SNT16|CUSTOM|CALLOUTS,SNT17|CUSTOM|CALLOUTS,SNT18|CUSTOM|CALLOUTS,SNT19|CUSTOM|CALLOUTS,SNT20|CUSTOM|CALLOUTS,SNT21|CUSTOM|CALLOUTS,SNT22|CUSTOM|CALLOUTS,SNT23|CUSTOM|CALLOUTS,SNT24|CUSTOM|CALLOUTS,SNT25|CUSTOM|CALLOUTS,SNT26|CUSTOM|CALLOUTS,SNT27|CUSTOM|CALLOUTS",
            }
        },
        "quotes":{
            "interactive_tags_11":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/quotes_000obB.png", 
                "label":l.quotes,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='double_quotes relative'><span class='quote_fsize'>&ldquo;</span><span class='ebook_item_text'>PLACE YOUR TEXT HERE</span><span class='quote_fsize absolute'>&rdquo;</span></div></div>"
            },
        },
        "image-annotation":{
            "annotation":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/world_000Oyo_000obd.png",
                "label": "Image Annotation",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='an_c' d-n='0' style='width: 500px;'><div class='an_p' d-w='500' d-i='world_000OVa.png' d-c='0' d-v='1' d-m='0'><figure class='uc-figure'><img src='//s3.amazonaws.com/jigyaasa_content_static/world_000OVa.png' alt='Image Alternative Text ' class='img-bordered'><figcaption class='an_f'>Image Caption</figcaption></figure><svg class='an_svg h' width='100%' height='249'></svg></div></div><div img-anno-desc='d' class='ebook_item_text'></div></div>"
            }
        },
        "image-align" : {
            "left_image_align" : {
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-11-13_at_4.34.56_PM_000ozv.png",
                "label": "Left Image Alignment",
                "html": getIntractiveHtml('imageAlign', {class: 'left_img1', width: '206', height: '137', caption: '', caption_class: 'caption_left1', is_center: false})
            },
            "right_image_align" : {
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/right_align_000o1O_000obc.png",
                "label": "Right Image Alignment",
                "html": getIntractiveHtml('imageAlign', {class: 'right_img1', width: '206', height: '137', caption: '', caption_class: 'caption_right1', is_center: false})
            },
            "center_image_align" : {
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/center_align_000o1l_000obb.png",
                "label": "Center Image Alignment",
                "html": getIntractiveHtml('imageAlign', {class: 'center_img1', width: '221', height: '149', caption: '', caption_class: 'caption_center1', is_center: true})
            },
            config: {
                //left_image_shadow_align|left_img2 i_align|.i_align,right_image_shadow_align|right_img2 i_align|.i_align,left_image_caption_align|caption_left1 i_align|.i_align,right_image_caption_align|caption_right1 i_align|.i_align,center_image_shadow_align|center_img2 i_align|.i_align,center_image_caption_align|caption_center1 i_align|.i_align
                "hide":true,
                "editing_type" : "1",
                "editing_type_1":"left_image_align|left_img1 i_align|.i_align,right_image_align|right_img1 i_align|.i_align,center_image_align|center_img1 i_align|.i_align"
            }
        },
        "Multicolumn":{
            "interactive_tags_5":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/column_1_000obG.png",
                "label":"Column(For dividing in two columns)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='queue'><div class='prop-lg-6'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-lg-6'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div></div></div>"
            },
            "division_1":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_1_000obH.png",
                "label":"Division into two parts (Type1)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='division1'><span class='ebook_item_text'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/win1.jpg' alt='win1.jpg'/>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networksA computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.</span></div></div>"
            },
            "division_2":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_2_000obK.png",
                "label":"Division into two parts (Type2)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='division2'><span class='ebook_item_text'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/win2.jpg' alt='win1.jpg'/>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networksA computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.</span></div></div>"
            },
            "division_3":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_3_000obl.png",
                "label":"Division into three part (Type1)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='division3'><span class='ebook_item_text'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab1.jpg' alt='tab1.jpg'/>A computer network is easily via various interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networksA computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.</span></div></div>"
            },
            "division_4":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_4_000obO.png",
                "label":"Division into three parts (Type2)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='division4'><span class='ebook_item_text'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab2.jpg' alt='tab2.jpg'/>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networksA computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.</span></div></div>"
            },
            "division_5":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_5_000obo.png",
                "label":"Division into four parts (Type1)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='division5'><span class='ebook_item_text'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/win2.jpg' alt='win1.jpg'/>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networksA computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.</span></div></div>"
            },
            "division_6":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_6_000obN.png",
                "label":"Division into four parts (Type2)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='division6'><span class='ebook_item_text'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab2.jpg' alt='tab1.jpg'/>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networksA computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via various means: email, instant messaging, chat rooms, telephone video telephone calls, and video conferencing. Providing access to information on shared storage devices is an important feature of many networks. A network allows sharing of files, data,and other types of information giving authorized users the ability to access information stored on other computers on the network. A network allows sharing of network and computing resources.</span></div></div>"
            },
            "division_7":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_4x8_000obM.png",
                "label":"Division with image and text (4 x 8)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='queue'><div class='prop-lg-4'><center><div class='ebook_item_text'><figure class='uc-figure'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab2.jpg' alt='Image1' /><figcaption>Figure 1-2: Image Caption</figcaption></figure></div></center></div><div class='prop-lg-8'><div class='ebook_item_text'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></div></div></div>"
            },
            "division_8":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/division_image_left1_000obh.png",
                "label":"Division with image in left 1",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='left_img1'><div class='ebook_item_text'><figure class='uc-figure'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab2.jpg' alt='Image1' /></figure>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></div></div>"
            }, 
            "division_9":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/division_image_left2_000obj.png",
                "label":"Division with image in left 2",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='left_img2'><div class='ebook_item_text'><figure class='uc-figure'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/win2.jpg' alt='Image1' /></figure><div class='link'><b>Heading</div>:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </div></div></div>"
            },
            "division_12":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/right_000B9Y_000obP.png",
                "label":"Division with image in right 1",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='left_img1'><div class='ebook_item_text'><figure class='float-right'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab2.jpg' alt='Image1' class='float-right' /></figure>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></div></div>"
            },
            "division_10":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/division_image_right_7x5_000obi.png",
                "label":"Division with image in right 2",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='queue'><div class='ebook_item_text'><div class='prop-lg-7'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div><div class='prop-lg-5'><figure class='uc-figure'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/tab2.jpg' alt='Image1' /><figcaption>Figure 1-2: Image Caption</figcaption></figure></div></div></div></div>"
            },
            "interactive_tags_6":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/column_2_000obI.png",
                "label":"For dividing in three columns",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='queue'><div class='prop-md-4'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-md-4'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-md-4'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div></div></div>"
            },
            "interactive_tags_7":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/column_3_000obf.png",
                "label":"For dividing in four columns",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='queue'><div class='prop-sm-3'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-sm-3'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-sm-3'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-sm-3'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div></div></div>"
            },
            "interactive_tags_8":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/column_4_000obJ.png",
                "label":"For dividing into columns with a divider line",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='queue'><div class='prop-lg-6 divider'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div><div class='prop-lg-6'><div class='ebook_item_text'>PLACE YOUR TEXT/IMAGE HERE</div></div></div></div>"
            },
            "division_11":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/divisions_7b_000obn.png",
                "label":"List Division",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div class='list_division1'><div class='ebook_item_text'><ul><li>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via varmeans: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing accesinformation on shared storage devices is an important feature of many networksA computer network facilitates interperscommunications</li><li>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via varmeans: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing accesinformation on shared storage devices is an important feature of many networksA computer network facilitates interperscommunications</li><li>A computer network facilitates interpersonal communications allowing users to communicate efficiently and easily via varmeans: email, instant messaging, chat rooms, telephone, video telephone calls, and video conferencing. Providing accesinformation on shared storage devices is an important feature of many networksA computer network facilitates interperscommunications</li></ul></div></div></div>"
            }  
        },
        "embed":{
            "Knowledge Check":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/quiz_player_000obT.png", 
                "label":"Knowledge Check",    
                "html": getIntractiveHtml("player", {playerAttr: "category='knowledge_check' type='quiz' "}),
            },
            "Lab":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/playground_player_000obU.png",
                "label":"Lab",
                "html": getIntractiveHtml("player", {playerAttr: "category='lab' type='playground'"}),
            },
            "Link":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/download_player_000obu.png",
                "label":"Link",
                "html":getIntractiveHtml("player", {playerAttr: "category='link' type='download'"}),
            },
            "Media":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/audio_player_000obV.png",
                "label":"Media",
                "html":getIntractiveHtml("player", {playerAttr: "category='media' type='audio'"}),
            },
            "3D Object":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/insight_player_000obt.png",
                "label":"3D Object",
                "html":getIntractiveHtml("player", {playerAttr: "category='objects' type='object3d'"}),
            },
            "Instruction":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/uc_snt_000obv.png",
                "label":"Instruction",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}' class='ebook_item_text'><snt refid='' data-style=''></snt></div>"
            },
            "Option Reference":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/UC_seq_000obs.png",
                "label":"Option Reference",
                "html":"<div type='ebook-item' sub_type='${itemType}' data-section='${stemClass}' class='ebook_item_text'><seq no=''></seq></div>"
            }
        },
        "Timeline":{
            "timeline":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/time_000obY.png",
                "label":l.timeline,
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='timeline' data-type='timeline' class='slide_data pt-3'><section  data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='3' data-top='-39'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><section data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='3' data-top='-39'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><section data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='3' data-top='-39'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><section data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='3' data-top='-39'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section></div></div>"
            },
            "box_timeline": {
                "default_image": "//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-09-30_at_8.09.12_AM_000oJk.png",
                "label": "Box Timeline",
                "html": "<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='sub_timeline' data-type='timeline' class='slide_data'><ul class='box_timeline w-75 pt-3'><li data-parent='parent_element' ctrl-container='child_prep' data-position='relative' data-top='-26' data-right='9'><div data-child='child_element'><div class='ebook_item_text'>1990</div></div><div class='ebook_item_text'>Quisque ac laoreet purus, eu dapibus ligula. Mauris nec tincidunt mi, eget finibus sem. Morbi viverra.</divc></li><li data-parent='parent_element' ctrl-container='child_prep' data-position='relative' data-top='-26' data-right='9'><div data-child='child_element'><div class='ebook_item_text'>2000</div></div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed erat consectetur.</div></li></ul></div></div>"
            },
            "slideshow":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/slide_000obw.png", 
                "label": "Box Timeline (Type 2)",
                "html":"<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='slideshow' data-type='timeline' class='slide_data pt-3'><section class='slider_fade active' data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='2' data-top='-24'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><section class='slider_fade' data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='2' data-top='-24'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><section class='slider_fade' data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='2' data-top='-24'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><section class='slider_fade' data-parent='parent_element' ctrl-container='child_app' data-position='absolute' data-right='2' data-top='-24'><header data-child='child_element' class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</header><article class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</article></section><a class='slider_prev slider_controls' onclick='changeSlide(this, -1)'>&#10094;</a><a class='slider_next slider_controls' onclick='changeSlide(this, 1)'>&#10095;</a></div></div>"
            },
            "vertical_timeline1": {
                "default_image": "//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-09-29_at_3.00.12_PM_000oiJ.png",
                "label": "Vertical Timeline (Type 1)",
                "html": "<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='sub_timeline' data-type='timeline' class='slide_data'><ul class='verticle_timeline'><li data-parent='parent_element' data-elm='li' data-position='absolute' data-top='16' data-right='2'><time class='ebook_item_text' datetime='2013-04-16'>4/16/13 21:30</time><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div></div></li><li data-parent='parent_element' data-elm='li' data-position='absolute' data-top='16' data-right='2'><time class='ebook_item_text' datetime='2013-04-16 21:30'>4/16/13 21:30</time><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div></div></li></ul></div></div>"
            },
            "vertical_timeline2": {
                "default_image": "//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-09-30_at_8.17.16_AM_000oJL.png",
                "label": "Vertical Timeline (Type 2)",
                "html": "<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='sub_timeline' data-type='timeline' class='slide_data clearfix'><ul class='verticle_timeline2 w-100'><li data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-20' data-right='130'><div data-child='child_element'><div class='ebook_item_text'>9/2/1990</div></div><div class='ebook_item_text'>Quisque ac laoreet purus, eu dapibus ligula. Mauris nec tincidunt mi.</div></li><li data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-20' data-right='130'><div data-child='child_element'><div class='ebook_item_text'>9/2/1991</div></div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed erat consectetur, tempor odio sit amet.</div></li></ul></div></div>"
            },
            "listing_timeline1": {
                "default_image": "//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-09-30_at_6.21.11_PM_000oj8.png",
                "label": "Listing Timeline",
                "html": "<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='sub_timeline' data-type='timeline' class='slide_data'><ul class='listing_timeline pt-3'><li data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-27' data-right='-58'><div data-child='child_element'><div class='ebook_item_text'>2002</div></div><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></li><li data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-27' data-right='-58'><div  data-child='child_element'><div class='ebook_item_text'>2003</div></div><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div></div></li></ul></div></div>"
            },
            "listing_timeline2": {
                "default_image": "//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-09-30_at_6.12.43_PM_000oj6.png",
                "label": "Listing Timeline 2",
                "html": "<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='sub_timeline' data-type='timeline' class='slide_data overflow'><div class='horizontal_timeline'><ul class='w-100 overflow pt-3'><li class='mt-3' data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-31' data-left='34' data-arrow='2'><div  data-child='child_element'><div class='ebook_item_text'>1990</div></div><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></div></li><li class='mt-3' data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-31' data-left='34' data-arrow='2'><div  data-child='child_element'><div class='ebook_item_text'>1991</div></div><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></div></li><li class='mt-3' data-parent='parent_element' ctrl-container='child_prep' data-position='absolute' data-top='-31' data-left='34' data-arrow='2'><div data-child='child_element'><div class='ebook_item_text'>1992</div></div><div><div class='ebook_item_text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></div></li></ul></div></div></div>"
            },
            "listing_timeline3": {
                "default_image": "//s3.amazonaws.com/jigyaasa_content_static/Screenshot_2020-09-30_at_6.16.19_PM_000oj7.png",
                "label": "Listing Timeline 3",
                "html": "<div data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'><div type='sub_timeline' data-type='timeline' class='slide_data'><div class='fw overflow table-responsive'><div class='timeline timeline-view'><div class='center-block flex'><div class='dot' data-parent='parent_element' data-elm='li' data-position='absolute'  data-right='-52' data-top='6' data-arrow='2'><span class='s3 icomoon-calendar'></span><div></div><section class='align-items-center d-flex justify-content-center'><div class='ebook_item_text'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></section><date class='ebook_item_text'>09/10/2001</date></div><div class='dot' data-parent='parent_element' data-elm='li' data-position='absolute' data-right='-52' data-top='6' data-arrow='2'><span class='s3 icomoon-calendar'></span><div></div><section class='align-items-center d-flex justify-content-center'><div class='ebook_item_text'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></section><date class='ebook_item_text'>09/10/2002</date></div><div class='dot' data-parent='parent_element' data-elm='li' data-position='absolute' data-right='-52' data-top='6' data-arrow='2'><span class='s3 icomoon-calendar'></span><div></div><section class='align-items-center d-flex justify-content-center'><div class='ebook_item_text'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></section><date class='ebook_item_text'>09/10/2003</date></div><div class='dot' data-parent='parent_element' data-elm='li' data-position='absolute' data-right='-52' data-top='6' data-arrow='2'><span class='s3 icomoon-calendar'></span><div></div><section class='align-items-center d-flex justify-content-center'><div class='ebook_item_text'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div></section><date class='ebook_item_text'>09/10/2004</date></div></div></div></div></div></div>"
            },
            config: {
                "hide": true,
                "editing_type": "1",
                "editing_change_type": "2",
                "editing_type_1": "timeline|timeline|.slide_data,slideshow|slideshow|.slide_data,vertical_timeline1|verticaltimeline1|.slide_data,vertical_timeline2|verticaltimeline2|.slide_data,box_timeline|boxtimeline|.slide_data,listing_timeline1|listing_timeline1|.slide_data,listing_timeline2|listing_timeline2|.slide_data,listing_timeline3|listing_timeline3|.slide_data"
            }
        },
        "Others":{
            "next_feature":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/addnext_000obX.png", 
                "label":"Next Feature",    
                "html":"<div type='ebook-item' sub_type='${itemType}' data-section='${stemClass}' class='ebook_item_text'><div class='uc_step_explanation' data-btnnme='Next'><div class='uc_step'>This is Step1</div><div class='uc_step'>This is Step2</div><div class='addnext_caption' data-bs-toggle='tooltip' data-original-title='Enter Button Caption'>Next</div></div></div>",
            },
            "hint_feature":{
                "default_image":"//s3.amazonaws.com/jigyaasa_content_static/hintimage_000obx.png", 
                "label":"Hint Feature",    
                "html":"<div type='ebook-item' sub_type='${itemType}' data-section='${stemClass}' class='ebook_item_text'><ul class='uc_answer_hint list2'><li>Hint1</li><li>Hint2</li><li>Hint3</li><li>Hint4</li></ul></div>",
            },
            // "sub-slideshow":{
            //     "default_image":"//s3.amazonaws.com/jigyaasa_content_static/time_000obY.png",
            //     "label":"Sub-Slideshow",
            //     "html":"<div type='ebook-item' sub_type='${itemType}' data-section='${stemClass}' class='ebook_item_text'><div type='sub-slideshow' class='slide_data'><section><article><img src='//s3.amazonaws.com/jigyaasa_content_static/interactive_item/paragraph.png' /><br/>Content one</article></section><section><article>Content Two</article></section><section><article><img src='//s3.amazonaws.com/jigyaasa_content_static/interactive_item/paragraph.png'/><br/>Content Three</article></section><section><article>Content Four</article></section></div></div>"
            // },
            config:{
                "hide":true,
                "render_tags" : true,
            }
            
        }
      }];
    },
    getItemDetails: function(content_type, subtype, current_item_icon) {
        // get inforamtion from userArray
        if (userArray) {
            let editorItemArray = JSON.parse(userArray);
            if (content_type && subtype) {
                if (current_item_icon) {
                    let current_icon_data = editorItemArray.editor_item_type_details[content_type][subtype][current_item_icon];
                    return current_icon_data;
                } else {
                    let current_icon_group = editorItemArray.editor_item_type_details[content_type][subtype];
                    return AH.isValid(current_icon_group) ? current_icon_group : 0;
                }
                
            } else {
                return editorItemArray.content_sub_type_list_details;
            }
        }
        return null;
    },
    itemList: function() {
        // Create EditorItems list
        if (userArray) {
			let editorItems = [];
			let editorItemArray = JSON.parse(userArray);
            let allItem = editorItemArray.editor_item_type_details;
            let alphabet = "a,c,e,f,p,q,s".split(',');
            alphabet.forEach(function (letter) {
				createEditorArray(allItem[alphabet[letter]], editorItems);
			});
            return editorItems;
        }
    },
    shouldWrap: function(container) {
        // check content is properly wrapped or not
        let nodes = document.querySelector(container).childNodes;
        let result = false;
        for (let item of nodes) {  
            if (item.nodeType == 3 || (!item.getAttribute('data-section') && !item.className.includes('sec_button') && !item.className.includes('sec_button_new'))) {
                result = true;
                break;
            } 
        }
        return result;
    },
    editorVideo: function(state) {
        let helpVideo  = {
            0: '//player.vimeo.com/external/290348936.hd.mp4?s=a13a32bc22efff0e3b2813f64ee52ab6413166ea',
        };
        return helpVideo[state.item];
    },
    saveButton: function(state) {
        // Save dialog checkbox array
        let buttons = [
                { 
                    type: "save", 
                    label: "Save any unsaved changes", 
                   // func: (from_myproject == 1 && state.guid.length == 5 && state.course_list) ? self.publishSelected.bind(self) : self.saveData.bind(self, '0'), 
                    tooltip: '' 
                },
            ];
        return buttons;
    },
    checkStage: function(state) {
        // Stage for current open guid
        let stageLimit = 3;
        if (from_myproject == 1 && AH.isValid(stageArray) && stageArray != "null") {
            editorStage = typeof stageArray == "object" ? stageArray : JSON.parse(stageArray);
            editorStage = editorStage['item_stage'];
            editorStage && (stageLimit = editorStage.length);
        }
        AH.set("stageLimit", stageLimit);
        getItemStage(state);
    },
    stage: function(sateSeq) {
        // Sate array
        let stage = editorStage || {
            '-1': "Rework", 
            0: "Designer",
            1: "SME",
            2: "Editor",
            3: "Reviewer",
            9: "Published",
            '-9': "Viewer",
            '-99': "N/A",
        };
        return stage[sateSeq] || "N/A";
    },
    status: function() {
        // Save dialog stage status config
        let stage = (from_myproject == 1) ? AH.get('stage') : 9;
        let skipLabel = (from_myproject == 1) ? "Skip" : "Skip";
        let status = {
            '-1':[
                { type: 'rework', label: "Discard Item", func: 'saveAction', permission:true, tooltip: 'Change stage to draft and rework.'},
                { type: 'cancel', label: "Cancel", func: false, permission:true, tooltip: 'Cancel the save action and proceed further.' },
                { type: 'skip', label: skipLabel, func: 'saveAction', permission:true, tooltip: 'Save content but not change the stage.' },
                { type: 'approve', label: "Move To Next Stage", stage: 1, permission:true, func: 'saveAction', btnBg: "primary", tooltip: 'Save and move to stage 1.'},
            ],
            0:[
                { type: 'rework', label: "Discard Item", func: 'saveAction', permission:true, tooltip: 'Change stage to draft and rework.'},
                { type: 'cancel', label: "Cancel", func: false, permission:true, tooltip: 'Cancel the save action and proceed further.' },
                { type: 'skip', label: skipLabel, func: 'saveAction', permission:true, tooltip: 'Save content but not change the stage.' },
                { type: 'approve', label: "Move To Next Stage", stage: 1, permission:true, func: 'saveAction', btnBg: "primary", tooltip: 'Save and move to stage 1.'},
            ],
            1: [
                { type: 'rework', label: "Discard Item", func: 'saveAction', permission:true, tooltip: 'Content has issue.'},
                { type: 'cancel', label: "Cancel", func: false, permission:true, tooltip: 'Cancel the save action and proceed further.' },
                { type: 'skip', label: skipLabel, func: 'saveAction', permission:true, tooltip: 'Save content but not change the stage.' },
                { type: 'approve', label: "Move To Next Stage", stage: 2, permission:true, func: 'saveAction', btnBg: "primary", tooltip: 'Save and move to stage 2.'},
            ],
            2: [
                { type: 'rework', label: "Rework", permission:true, func: 'saveAction', tooltip: 'Change stage to draft and rework.'},
                { type: 'cancel', label: "Cancel", func: false, permission:true, tooltip: 'Cancel the save action and proceed further.' },
                { type: 'skip', label: skipLabel, func: 'saveAction', permission:true, tooltip: '' },
                { type: 'approve', label: "Approve", func: 'saveAction', stage: 3, btnBg: "primary", permission:true, tooltip: 'Save and move to stage 3.'},
            ],
            3: [
                { type: 'rework', label: "Rework", func: 'saveAction', permission:true, tooltip: 'Change stage to draft and rework.'},
                { type: 'cancel', label: "Cancel", func: false, permission:true, tooltip: 'Cancel the save action and proceed further.' },
                { type: 'skip', label: skipLabel, func: 'saveAction', permission:true, tooltip: 'Save content but not change the stage.' },
                { type: 'approve', label: "Approve", func: 'saveAction', stage: 3, btnBg: "primary", permission:true, tooltip: 'Save only.'},
            ],
            9:[
                { type: 'rework', label: "Discard Changes", func: 'saveAction', permission:false, tooltip: 'Change stage to draft and rework.' },
                { type: 'cancel', label: "Cancel", func: false, permission: true, tooltip: 'Cancel the save action and proceed further.' },
                { type: 'skip', label: false, func: 'saveAction', permission: false, tooltip: 'Save content but not change the stage.' },
                { type: 'approve', label: "Save", func: 'saveAction', btnClass: '', btnBg: "primary", permission:true, tooltip: 'Save only.' },
            ],
        };
       
        return status[stage] || status[9];
    },
    getWebpageTags: function(type) {
        // webpage templates
        let tags = {
            'exam': `{# exam_objective_url (Exam objectives URL at vendor website.) #}
            <br /><br />
            {# exam_page_url (Exam page URL at vendor website.) #}
            <br /><br />
            {# exam_validity (Provide url and write short description to find out validity of this exam/certification) #}
            <br /><br />
            {# pre_requisites (free flow give details on prerequisites for the exam: Experience, other certifications or exams ) #}
            <br /><br />
            {# test_provider (exam conducted by) #}
            <br /><br />
            {# questions (Total Number of questions in actual exam.) #}
            <br /><br />
            {# duration (Time to complete the exam) in minutes#}
            <br /><br />
            {# exam_format (Describe exam format, question type question format and if exam is multipart or not. Also add any related notes) #}
            <br /><br />
            {# pass_score (Passing Score for the exam) #}
            <br /><br />
            {# min_score (minimum score in the scale on which exam is measured) #}
            <br /><br />
            {# max_score (maximum score in the scale on which exam is measured) #}
            <br /><br />
            {# exam_retake_policy (what is exam retake policy if you fail)#}
            <br /><br />
            {# exam_fee (exam fees, always in USD)#}
            <br /><br />
            {# exam_fee_notes (additional information about the exam fees )#}
            <br /><br />
            `,
            'examdetails': `{# keywords (Search terms being used by users to search the web for exam)#}
            <br /><br />
            {# about_product_short (typically 3-6 words) #}
            <br /><br />
            {# about_product #}
            <br /><br />
            {# about_exam_short (typically 2-3 sentences) #}
            <br /><br />
            {# about_exam (What is so special and unique about this exams) #}
            <br /><br />
            {# career_prospects (People who pass this exam normally have these job roles/career prospects) #}
            <br /><br />
            {# skills_measured(5-10 bullet points based on skills required.#}
            <br /><br />
            {# related_exams (related exams list)#}
            <br /><br />
            {# related_certification (related certification list)#}
            <br /><br />
            {# course_duration (Course Duration)#}
            <br /><br />
            {# video_tutorial (Video Tutorial)#} 
            <br /><br />
            {# video_thumbnail (Video Thumbnail)#}
            <br /><br /> 
            `,
        };
        return tags[type];
    },
    isUnValidItem: function(state, subtype) {
        // chekcing of invalid item in editor
        if (!subtype && subtype != 0) {
            return true;
        } else if (subtype == "Blank") { 
            return true;
        } if (AH.get('error') && subtype != 0 && subtype != 8) {
            return true;
        }
        return false;
    },
    isDeepUpdate: function(subType) {
        // deepUpdate allow for items
        var isDefined = [38,4,6,7,15,13,23,24,25,16,9,17,18,22,32,33,27,36,20];
        if (subType == 'Blank') {
             return true;
        } else {
            return (isDefined.indexOf(+subType) != -1) ? true : false;
        }
    },
    setParentData: function(guid, subtye) {
        // seting instance of editor methods for call outside
        if (AH.isValid(guid) && AH.isValid(subtye)) {
            window.parent.new_guid = guid;
            window.parent.new_content_subtype = subtye;
        }
    },
    escapeSymbols: function(str = "") {
        // checking entity
		for (let i = 0; i < Object.keys(Symbols).length; i++) {
			let reg = new RegExp(Object.keys(Symbols)[i], "g");
			str = str.replace(reg, Symbols[Object.keys(Symbols)[i]]);
		}
		return str;
    },
    replaceUnwantedEntity: function(content, clean = false) {
        // valdiate mcq data
		if (AH.isValid(content)) {
			try {
                //@Prabhat: This is to convert the self closing seq tag to explict closing tag.
                // Examples: <seq refid="112" /> to <seq refid="112" ></seq> 
                let self_seq_close = content.match(/<seq(.*?)\s*\/>/g);
                if (self_seq_close) {
                    content = content.replace(/<seq(.*?)\s*\/>/g, '<seq$1></seq>');
                }
                let self_snt_close = content.match(/<snt(.*?)\s*\/>/g);
                if (self_snt_close) {
                    content = content.replace(/<snt(.*?)\s*\/>/g, '<snt$1></snt>');
                }
                if (clean == 'only_self_close') {
                    return (content);
                }
				if (clean) {
					content = content.replace(/&#65279;/g, "");
					if (clean == "revert") { 
						content = content.replace(/&#160;/g, ' ');
					} else {
						content = content.replace(/> /g, '>&#160;');
					}
					if (clean == "onlyEntity") return content;
				}
				let val = content.match(/<map(.|\n)*?<\/map>/g);
				if (val) {
					val = val[0].replace(/<br \/>/g, '').replace(/<br\/>/g, '').replace(/<br>/g, '').replace(/\n/g, '').replace(/> </g, '><');
					content = content.replace(/<map(.|\n)*?<\/map>/g, val);
				}
                
                var matches = AH.find(content, ".ebook_item_text", 'all')[0].innerHTML;
				if (AH.isValid(matches) && matches.startsWith("<div>") && matches.endsWith("</div>")) {
					let pattern = matches;
					pattern = matches.replace(/\>\<\/seq\>/g, " \/\>");
					matches = matches.slice(5);
					matches = matches.substring(0, matches.length - 6);
					content = content.replace(pattern, matches);
				}
			} catch (e) {
				console.warn("It seems incorrect active area / cursor position");
			}
		}
		return (content);
    },
    preTagTypes: [
        {tag: '<pre class="prettyprint black linenums">', customTag: '<uc:syntax console="">'},
        {tag: '<pre class="prettyprint linenums">', customTag: '<uc:syntax>'},
        {tag: '<pre class="prettyprint black linenums">', customTag: '<uc:syntax console>'},
        {tag: '<pre class="prettyprint cmd linenums">', customTag: '<uc:syntax command>'},
        {tag: '<pre class="prettyprint cmd linenums">', customTag: '<uc:syntax command="">'},
        {tag: '<pre class="prettyprint white linenums">', customTag: '<uc:syntax white>'},
        {tag: '<pre class="prettyprint white linenums">', customTag: '<uc:syntax white="">'},
        {tag: '<pre class="prettyprint">', customTag: '<uc:syntax hidelinenums>'},
        {tag: '<pre class="prettyprint">', customTag: '<uc:syntax hidelinenums="">'},
        {tag: '<pre class="prettyprint black">', customTag: '<uc:syntax console hidelinenums>'},
        {tag: '<pre class="prettyprint black">', customTag: '<uc:syntax console="" hidelinenums="">'},
        {tag: '<pre class="prettyprint white">', customTag: '<uc:syntax nonum white>'},
        {tag: '<pre class="prettyprint white">', customTag: '<uc:syntax nonum="" white="">'},
        {tag: '<pre class="prettyprint cmd">', customTag: '<uc:syntax command nonum>'},
        {tag: '<pre class="prettyprint cmd">', customTag: '<uc:syntax command="" nonum="">'},
        {tag: '<pre class="prettyprint linenums hidelinenums">', customTag: '<uc:syntax hidelinenums>'},
        {tag: '<pre class="prettyprint linenums hidelinenums">', customTag: '<uc:syntax hidelinenums="">'},
        {tag: '</pre>', customTag: '</uc:syntax>'},
    ],
    contextMenuList: "link image resp resp1 | player | addnew",
    toolbaarContext: " code | undo  redo | bold italic underline strikethrough | custom-alignleft custom-aligncenter custom-alignright | nanospell equationeditor mybutton2  mybutton | player",
    editorPlugin: function(owner) {
        // editor plugin config
        let isContext = (owner == ".tinymce-editor") ? false : true;
        //`insertdatetime media table ${ isContext ? 'contextmenu' : ""} paste visualblocks playertag playericon changeInModule res equationeditor`,
        return([
            "placeholder",
            "lists link image", //print preview anchor   (was part of this line)
            "searchreplace code", // fullscreen
            `table ${ isContext ? 'contextmenu' : ""} paste playertag changeInModule res equationeditor`,
            "addnewsection",
            "charmap "
        ]);
    },
    editorTable_class_list:  [
        { title: "None", value: "" },
        { title: "Table1", value: "uc-table sorttable table1" },
        { title: "Table2", value: "uc-table sorttable table2" },
        { title: "Table3", value: "uc-table sorttable table3" },
        { title: "Table4", value: "uc-table sorttable table4" },
        { title: "Table5", value: "uc-table sorttable table5" },
        { title: "Table6", value: "uc-table sorttable table6" },
        { title: "Table7", value: "uc-table sorttable table7" },
        { title: "Table8", value: "uc-table sorttable table8" }
    ],
    getSnt: function(content, state, strForRender) {
        // parse fetched snt from php
        let sntMatch = (content) ? content.match(/<snt(.*?)<\/snt>|<snt(.*?)\/>/gmi) : "";
        if (sntMatch) {
            for (let i in sntMatch) {
                let refid = sntMatch[i].match(/refid="(.*?)"/gmi);
                refid = (refid[0]) ? refid[0].replace(/refid=|"/gmi, '') : "";
                sntMatch[i] = sntMatch[i].replace('></snt>', ' />').replace(/data-style="(.*?)"/, 'style="$1"');
                if (refid) {
                    let newArray = state.sntTags;
                    newArray[refid] = sntMatch[i];
                    strForRender += '<<' + refid + sntMatch[i] + '>>';
                    updateParent('sntTags', newArray);
                }
            }
            updateParent('strForRender', state.strForRender + strForRender);
        }
    },
    setSnt: function(content_id, parsedContent, state, previewSnt) {
        // Update snt ids
        let content = document.querySelector(content_id) && document.querySelector(content_id).innerHTML;
        let sntMatch = (content) ? content.match(/<snt(.*?)<\/snt>/gmi) : "";
        if (sntMatch) {
            for (let i in sntMatch) {
                let refid = sntMatch[i].match(/refid="(.*?)"/gmi);
                refid = (refid[0]) ? refid[0].replace(/refid=|"/gmi, '') : "";
                let regex = "<<" + refid.trim().toString() + "[\\s\\S]*?>>";
                let match_snt = parsedContent.toString().match(new RegExp(regex, "gim"));
                if (match_snt) {
                    match_snt = match_snt[0].replace(/<<(.*?)</gmi, '<').replace(/>>/gmi, '');
                    let newArray = state.sntTags;
                    newArray[refid] = match_snt;
                    updateParent('sntTags', newArray);
                }
            }
        }
        AH.select(content_id).innerHTML = previewSnt(content);
    },
		
};

function getItemStage(state) {
    // get item's current stage from php side
    if (state.guid) {
        let w = {
            columns: 'content_guid,stage',
            content_guid: state.guid,
        };
		AH.getAPIDataJ( 'cat2.item_content_draft_get', w, async (res)=> {
            if (res && res[state.guid]) {
                AH.set('stage', res[state.guid]['stage']);
            } else {
                AH.set('stage', 9);
            }
        });
        // AH.ajax({
        //     url: baseUrl + 'editor/index.php',
        //     async: true,
        //     data: { 
        //         ajax: "1", 
        //         action: 'get_item_stage', 
        //         content_guid: state.guid,
        //     }
        // }).then((stage)=> {
        //     if (stage) {
        //         AH.set('stage', stage);
        //         // Need to update parent after it
        //     }
        // });
    }
}
function loadTodoMenu() {
    // show todo menu
		//self.handleMenuClose();
    let snippet = "";
    let type = {
        q: "Quiz",
        e: "Exercise",
        l: "Hands On test",
        g: "Glossary",
        f: "FlashCard",
        kc: "Knowledge check",
        t: "Test Prep &amp; Assessment",
        unas: "TBD"
    };
    if (todo_table) {
        let todo = [];
        let table = "";
        let cognitive_level_new = [];
        todo = JSON.parse(todo_table);
        cognitive_level_new = JSON.parse(cognitive_level);
        let todoView = "";
        todo.map(function (data) {
            todoView += (`
                        <tr>
                        <td id="snippetVal">-</td>
                        <td>${JSON.parse(data.quote).task_obj}</td>
                        <td>${type[JSON.parse(data.quote).task_item]}</td>
                        <td id="itemTypeVal">-</td>
                        <td>${cognitive_level_new[JSON.parse(data.quote).cognitive_level]}</td>
                        <td>${data.text}</td>
                        <td id="tagsVal">-</td>
                    </tr>`
            );
        });
        table = `
                <table class="sorttable uc-table table-bordered">
                    <thead>
                        <tr>
                            <th>${l.textsnippet}</th>
                            <th>${l.sectiondetail}</th>
                            <th>${l.item}</th>
                            <th>${l.itemType}</th>
                            <th>${l.cognitive_level}</th>
                            <th>${l.comments}</th>
                            <th>${l.tags}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${todoView}
                    </tbody>
                </table>`;
        AH.activate("2");
        AH.ajax({
            url: baseUrl + 'editor/index.php',
            cache: false,
            data: {
                action: "getTodoData",
                guid: JSON.parse(todo[0]['quote']).task_obj,
                course_code: editor.course
            },
        }).then((response)=> {
            //$("#todo_table").html(table);
            let modal = {
                header  : {
                    body: "Todo Table",
                },
                body    : {
                    body: table,
                },
                footer  : {
                    body: [],
                },
                maxWidth: 'md',
            };
            //self.editorModalUpdate(true);
            handleModal(modal);
            AH.activate(0)
            snippet = JSON.parse(response);
            let arr = snippet;
            snippet = snippet[JSON.parse(todo[0]['quote']).task_obj]['snippet'];
            document.getElementById("snippetVal").innerHTML = snippet;
            let itemType = JSON.parse(todo[0]['quote']).task_type;
            itemType = itemType.split("|");
            try {
                document.getElementById('itemTypeVal').innerHTML = (arr[itemType[0]][itemType[1]][itemType[2]]['title']);
            } catch (e) {
                console.warn("Item Type Not Found");
            }
            let tag_val = JSON.parse(todo[0]['quote']).task_tag;
            document.getElementById('tagsVal').innerHTML = (arr['tag_snippet'][tag_val]);
        });
        return table;
    }
}
function versionControl(flag) {
   updateParent('versionToggle', flag, 'editor');
}
function toggleExam(flag) {
    updateParent('examToggle', flag, 'editor');
}
function versionControlCurrent() {
    window.location = window.location.href.replace(/&get-diff(.*?)$/gmi, '');
}

function toggleDomain(flag) {
    updateParent('domainToggle', flag, 'editor');
}
function handleDiagnostic(state) {
    if (state.guid) {
        //self.handleMenuClose();
        AH.activate(2);
        AH.ajax({
            url: baseUrl + "ext/content_diagnostic/?action=report&from_editor=1&report=*&content_guid=" + state.guid, 
        }).then((data)=> {
            handleModal({
                header  : {
                    body: "Diagnostic Report",
                },
                body    : {
                    body: data,
                },
                footer  : {
                    body: [],
                },
                width: 500,
            });
            AH.activate(0);
        });
    } else {
        AH.alert("Please save the question to check diagnostic");
    }
}
function clickanalyzeebook() {
    updateParent('AnalyzeEbookMenu', true, 'editor');
    //self.handleMenuClose();
}
function vttParser() {
    window.open(baseUrl + "utils/vtt_parser.php", '_blank');
}

function getIntractiveHtml(type, data) {
    // wrap up sections for editable
    let editorAttr = "data-section='${stemClass}' type='ebook-item' sub_type='${itemType}'";
    switch(type) {
        case 'snt': return(`<div ${editorAttr} class='def_factbox_v2'><div class='title'><span class='fact_icon_v2 ${data.icon}'></span><span data-update='true' class='ebook_item_text'>${data.label}</span></div><div class='fact_description_v2'><div class='ebook_item_text'>PLACE YOUR TEXT HERE</div></div></div>`);
        case 'player': return(`<div ${editorAttr} class='ebook_item_text'><player ${data.playerAttr}></player></div>`);
        case 'imageAlign': return(`<div ${editorAttr} class='ebook_item_text'><div class='clearfix i_align ${data.class}'>${(data.is_center == true) ? text_data: ''}<figure class='uc-figure'><img src='//s3.amazonaws.com/jigyaasa_content_static/ebook_interactivity/images/a.jpg' alt='Write Figure description here' width='${data.width}' height='${data.height}' caption-class='${data.caption_class}' current-class='${data.class}' normal-class='${data.class}'/>${data.caption}</figure>${text_data}</div></div>`);
        default : "<div>Type Not Defined";
    }
}

function createControls(config) {
    // section control configs
    let controlList = [
        {
            className:'__move-up',
            title: 'Move Up',
            iconClass: 'icomoon-arrow-up-4',
        },
        {
            className:'__move-down',
            title: 'Move Down',
            iconClass: 'icomoon-arrow-down-4',
        },
        {
            className:'__change-type',
            title: 'Change Type',
            iconClass: 'icomoon-24px-edit-1',
            off: 'text,quotes,image-annotation,Others,Multicolumn'
        },
        {
            className:'__remove',
            title: 'Delete',
            iconClass: 'icomoon-new-24px-delete-1',
        },
        {
            className:'__add',
            title: 'Add',
            iconClass: 'icomoon-new-24px-add-circle-1',
        }
    ];
    let links = "";
    controlList.forEach((item)=> {
        if (!item.off || !item.off.includes(config)) {
            links += `<a href="#" class="block-controls${item.className} ${item.iconClass}" data-bs-toggle="tooltip" title="${item.title}" data-bs-original-title="${item.title}"></a>`;
        }
    });
    return `<div class="block-controls__tools">${links}</div>`;
}

function createEditorArray(allItem, editorItems) {
    // editor's action new item list
    for (let subtype in allItem) {
        for (let icon in allItem[subtype]) {
            let currentItem = allItem[subtype][icon];
            if (is_external == "1") {
                if (currentItem.visible < 1) {
                    continue;
                    // Hiding selected item for External users.
                }
            }
            editorItems.push({
                title: currentItem.title,
                icon: currentItem.icon,
                type: currentItem.type,
                subtype: currentItem.subtype,
                content_icon: currentItem.content_icon,
                grading: currentItem.grading,
                category: currentItem.category,
                xml: currentItem.xml,
                group: currentItem.group,
                visible: currentItem.visible,
                inline_item: (currentItem.inline_item) ? currentItem.inline_item : "0",
                is_algo: (currentItem.algo) ? currentItem.algo : "0",
            });
        }
    }

    return editorItems;
}

function checkUnWrapped(data, node) {
   // let filter = ("#remediation" == node) ? false : true;
   //let filter = ("#stem" == node) ? false : true;
   // checking content that needed or not wrapping
    let container = document.querySelector(node);
    let wrappedHtml = "";
    let dataBuffer = "";
    let enableRawChecking = false;
    if (container) {
        container.childNodes.forEach((item, index)=> {
            if (item.getAttribute && item.getAttribute('data-section')) {
                if (dataBuffer != "") {
                    wrappedHtml += `<div data-section="sec_button" type="ebook-item" sub_type="text" class="ebook_item_text">${dataBuffer}</div>`;
                    dataBuffer = "";
                }
                wrappedHtml += item.outerHTML;
            } else {
                enableRawChecking = "wrap";
                dataBuffer += AH.isValid(item.outerHTML) ? item.outerHTML : item.textContent;
                if (container.childNodes.length == (index + 1)) {
                    wrappedHtml += `<div data-section="sec_button" type="ebook-item" sub_type="text" class="ebook_item_text">${dataBuffer}</div>`;
                    dataBuffer = "";
                }
            }
        });
        
    } 
    if (enableRawChecking == "wrap") {
        data = wrappedHtml;
    } else {
        let reg = new RegExp(/^<div [^\/]+?(?:\".*?\"|'.*?'|.*?)*?>/);
        let res = reg.exec(data);
        if (!res || !res[0].includes('data-section')) {
            data = `<div data-section="sec_button" type="ebook-item" sub_type="text" class="ebook_item_text">${data}</div>`;
        } 
    }
    return data;
}

function mathTagCorrection(currentNode) {
    // auto correction for math ml tag
    let convertTags = 'mstyle,mtd';
    return new Promise((resolve) => {
        let newChild = false;
        if (currentNode.nodeType == 3) {
            newChild = document.createElement('mo');
        } else if (currentNode.nodeName.startsWith('m') && convertTags.includes(currentNode.nodeName)) {
            if (currentNode.childElementCount < 1) {
                currentNode.innerHTML = "<mo>" +  currentNode.innerHTML + "</mo>";
            }
        } else if (!currentNode.nodeName.startsWith('m')) {
            newChild = document.createElement('mtext');
        }
        if (newChild && currentNode.nodeValue.trim().length > 0) {
            newChild.innerHTML = currentNode.nodeValue;
            currentNode.parentNode.replaceChild(newChild, currentNode);
            resolve(newChild);
        } else {
            resolve(currentNode);
        }
    })
}

function getSectionAttr(itemHtml, itemType) {
    // get attributes for content wrappers
    let trackStem = document.querySelector('#stem_show') || document.querySelector('#content_show');
    let stemClass = trackStem && trackStem.childNodes.length > 0 ? "sec_button_new" : "sec_button";
    let sectionHtml = itemHtml.replace('${stemClass}', stemClass).replace('${itemType}', itemType);
    return sectionHtml;
}

var nodeFinder = (function() {
    // node traveser for content
    var track, origin, changeNode = true, action=false, counter = false, round = 0, stack = false;
    var treeView = function(node, child, trigger) {
        var currentChild = child;

        if (track == node) {
            try {
                currentChild = trigger ? child : currentChild.nextSibling;
            } catch (e) {
                //console.warn(e);
            }
        } else {
            track = node;
            currentChild = node.firstChild;
        }

        if (currentChild && changeNode) {
            var innerChildCount = currentChild ? currentChild.childElementCount : 0;
            if (innerChildCount >= 1) {
                treeView(currentChild, null, false);
            } else {
                if (action) {
                    action(currentChild).then((newChild)=> {
                        treeView(node, newChild, false);
                    });
                } else {
                    treeView(node, currentChild, false);
                }
            }
        } else if (node != origin) {
            track = node.parentNode;
            treeView(node.parentNode, node, false);
        } else {
            track = null;
            if (round != counter && stack[round]) {
                round = round+1;
                origin = stack[round];
                treeView(stack[round], null, false);
            }
        }
    };    
    var find = function(root, newAction = false) {
        origin = root[0];
        track = null;
        action = newAction;
        counter = root.length;
        round = 0;
        stack = root;
        treeView(root[0], null, false);
    };
    return {
        find,
    };

})();

// eneity list
const Symbols = {
	"″":"&quote;",
	"“":"&quote;",
	"”":"&quote;",
	"’":"&apos;",
	"′":"&apos;",
	"'":"&apos;",
	"¡":"&iexcl;",
	"¢":"&cent;",
	"£":"&pound;",
	"™":"&#8482;",
	"¤":"&curren;",
	"¥":"&yen;",
	"¦":"&brvbar;",
	"§":"&sect;",
	"¨":"&uml;",
	"©":"&copy;",
	"ª":"&ordf;",
	"«":"&laquo;",
	"¬":"&not;",
	"®":"&reg;",
	"¯":"&macr;",
	"°":"&deg;",
	"±":"&plusmn;",
	"²":"&sup2;",
	"³":"&sup3;",
	"´":"&acute;",
	"µ":"&micro;",
	"¶":"&para;",
	"¸":"&cedil;",
	"¹":"&sup1;",
	"º":"&ordm;",
	"»":"&raquo;",
	"¼":"&frac14;",
	"½":"&frac12;",
	"¾":"&frac34;",
	"¿":"&iquest;",
	"×":"&times;",
	"÷":"&divide;",
	"∀":"&forall;",
	"∂":"&part;",
	"∃":"&exist;",
	"∅":"&empty;",
	"∇":"&nabla;",
	"∈":"&isin;",
	"∉":"&notin;",
	"∋":"&ni;",
	"∏":"&prod;",
	"∑":"&sum;",
	"−":"&minus;",
	"∗":"&lowast;",
	"√":"&radic;",
	"∝":"&prop;",
	"∞":"&infin;",
	"∠":"&ang;",
	"∧":"&and;",
	"∨":"&or;",
	"∩":"&cap;",
	"∪":"&cup;",
	"∫":"&int;",
	"∴":"&there4;",
	"∼":"&sim;",
	"≅":"&cong;",
	"≈":"&asymp;",
	"≠":"&ne;",
	"≡":"&equiv;",
	"≤":"&le;",
	"≥":"&ge;",
	"⊂":"&sub;",
	"⊃":"&sup;",
	"⊄":"&nsub;",
	"⊆":"&sube;",
	"⊇":"&supe;",
	"⊕":"&oplus;",
	"⊗":"&otimes;",
	"⊥":"&perp;",
	"⋅":"&sdot;",
	"Α":"&Alpha;",
	"Β":"&Beta;",
	"Γ":"&Gamma;",
	"Δ":"&Delta;",
	"Ε":"&Epsilon;",
	"Ζ":"&Zeta;",
	"Η":"&Eta;",
	"Θ":"&Theta;",
	"Ι":"&Iota;",
	"Κ":"&Kappa;",
	"Λ":"&Lambda;",
	"Μ":"&Mu;",
	"Ν":"&Nu;",
	"Ξ":"&Xi;",
	"Ο":"&Omicron;",
	"Π":"&Pi;",
	"Ρ":"&Rho;",
	"Σ":"&Sigma;",
	"Τ":"&Tau;",
	"Υ":"&Upsilon;",
	"Φ":"&Phi;",
	"Χ":"&Chi;",
	"Ψ":"&Psi;",
	"Ω":"&Omega;",
	"α":"&alpha;",
	"β":"&beta;",
	"γ":"&gamma;",
	"δ":"&delta;",
	"ε":"&epsilon;",
	"ζ":"&zeta;",
	"η":"&eta;",
	"θ":"&theta;",
	"ι":"&iota;",
	"κ":"&kappa;",
	"λ":"&lambda;",
	"μ":"&mu;",
	"ν":"&nu;",
	"ξ":"&xi;",
	"ο":"&omicron;",
	"π":"&pi;",
	"ρ":"&rho;",
	"ς":"&sigmaf;",
	"σ":"&sigma;",
	"τ":"&tau;",
	"υ":"&upsilon;",
	"φ":"&phi;",
	"χ":"&chi;",
	"ψ":"&psi;",
	"ω":"&omega;",
	"ϑ":"&thetasym;",
	"ϒ":"&upsih;",
	"ϖ":"&piv;",
	"À":"&Agrave;",
	"Á":"&Aacute;",
	"Â":"&Acirc;",
	"Ã":"&Atilde;",
	"Ä":"&Auml;",
	"Å":"&Aring;",
	"Æ":"&AElig;",
	"Ç":"&Ccedil;",
	"È":"&Egrave;",
	"É":"&Eacute;",
	"Ê":"&Ecirc;",
	"Ë":"&Euml;",
	"Ì":"&Igrave;",
	"Í":"&Iacute;",
	"Î":"&Icirc;",
	"Ï":"&Iuml;",
	"Ð":"&ETH;",
	"Ñ":"&Ntilde;",
	"Ò":"&Ograve;",
	"Ó":"&Oacute;",
	"Ô":"&Ocirc;",
	"Õ":"&Otilde;",
	"Ö":"&Ouml;",
	"Ø":"&Oslash;",
	"Ù":"&Ugrave;",
	"Ú":"&Uacute;",
	"Û":"&Ucirc;",
	"Ü":"&Uuml;",
	"Ý":"&Yacute;",
	"Þ":"&THORN;",
	"ß":"&szlig;",
	"à":"&agrave;",
	"á":"&aacute;",
	"â":"&acirc;",
	"ã":"&atilde;",
	"ä":"&auml;",
	"å":"&aring;",
	"æ":"&aelig;",
	"ç":"&ccedil;",
	"è":"&egrave;",
	"é":"&eacute;",
	"ê":"&ecirc;",
	"ë":"&euml;",
	"ì":"&igrave;",
	"í":"&iacute;",
	"î":"&icirc;",
	"ï":"&iuml;",
	"ð":"&eth;",
	"ñ":"&ntilde;",
	"ò":"&ograve;",
	"ó":"&oacute;",
	"ô":"&ocirc;",
	"õ":"&otilde;",
	"ö":"&ouml;",
	"ø":"&oslash;",
	"ù":"&ugrave;",
	"ú":"&uacute;",
	"û":"&ucirc;",
	"ü":"&uuml;",
	"ý":"&yacute;",
	"þ":"&thorn;",
	"ÿ":"&yuml;"
};

</script>