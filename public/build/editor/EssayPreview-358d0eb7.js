
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, M as append_styles, v as validate_slots, o as onMount, A as AH, L as beforeUpdate, X as XMLToJSON, a0 as onUserAnsChange, E as is_function, c as create_component, f as space, e as element, h as text, j as attr_dev, k as add_location, l as set_style, a1 as null_to_empty, m as mount_component, n as insert_dev, p as append_dev, q as listen_dev, F as set_data_dev, t as transition_in, a as transition_out, b as destroy_component, x as detach_dev, H as run_all, C as validate_each_argument, z as empty, K as destroy_each, r as group_outros, u as check_outros, B as noop } from './main-74719bf5.js';
import { I as ItemHelper } from './ItemHelper-52ad5320.js';
import { s as styleInject } from './style-inject.es-1c867377.js';
import { s as sunEditor, p as plugins } from './index-14efcedc.js';

const essayUploadUrl = 'http://ucertify.com/reactUpload.php/';//remove hard code, use from constant
let editor;
class EssayNewReact extends JUI {
    constructor(eid, essayEditor) {
        super();
        this.timer = {};
        this.eid = eid;
        this.essay_ready(eid, essayEditor);
    }

    // getting the essay module ready
    essay_ready(eid, essayEditor) {
        let eidNode = document.querySelector(eid);
        editor = essayEditor;
        setTimeout(()=> {
            this.bind('#drop a', 'click', (event)=> {
                this.find(event.target.parentNode, 'input').click();
            });

            // it initialize the knob plugin listen for clicks on the cancel icon. 
            
            //SUNEDITOR.create(this.find(eid, '#essay_edit'), { toolbarSelector: '[data-role=editor2-toolbar]' });
            this.selectAll('[data-role=magic-overlay]').forEach(function(_this) {
                var target = _this.dataset['target'];
                // overlay.offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
            });

            essayEditor.onChange = (contents, core)=> {
                this.updateXML(eid, 200, contents);
            };
            essayEditor.onKeyDown = (e, core)=> {
                if (e.keyCode == 86 || e.keyCode == 67) {
                    this.updateXML(eid, 200, e.target.innerHTM);
                }
            };

            let ua = window.navigator.userAgent;
            let ms_old_ie = ua.indexOf('MSIE ');
            let ms_new_ie = ua.indexOf('Trident/');
            this.listen(eidNode, 'click', 'a.essay_dwl_file', (_this)=> {
                if ((ms_old_ie > -1) || (ms_new_ie > -1)) {
                    var path = _this.getAttribute('href');
                    _this.removeAttribute('href');
                    window.open(path);
                    setTimeout(()=> { this.select('a.essay_dwl_file').setAttribute('href', path); }, 500);
                }
                setTimeout(()=> { this.select('#center').remove(); }, 500);
            });
        }, 500);
    }

    // for getting path of the s3
    getPath() {
        let path = "";
        if (typeof test_session_uid != "undefined") {
            var folder = this.getForlderName(test_session_uid);
            path = "//s3.amazonaws.com/test_session/" + folder + '/';
        } else if (typeof user_guid != 'undefined') {
            path = "//s3.amazonaws.com/test_session/" + user_guid + '/';
        }
        return path;
    }

    getUploads(...media) { 
        let path = this.getPath();
        console.log("Upload media selected", media);
        let allExt = "," + this.select(this.eid).getAttribute('data-filetypeexts');
        Array.prototype.forEach.call(media[0], (_f)=> {
            let form_data = new FormData();
            form_data.append('Filedata', _f);
            let file_ext = _f.name.split('.');
            let tpl = this.parseHtml('<li class="working"><span class="download" disabled="disabled"><a target="_blank" onclick="setTimeout(function(){activate(0)},500);" href="' + path + _f.name + '" title="Download File"  class="essay_dwl_file icomoon-file-download"></a></span><span class="filename"></span><span class="fileSize"></span><span class="abort">abort</span><div id="progressbar"><div class="bar" style={{width: "0"}}></div></div></li>');
            this.find(tpl, '.filename', {action: 'text', actionData: _f.name});
            this.insert(this.find(tpl, '.fileSize'), `<i>${this.formatFileSize(_f.size)}</i>`, 'beforeend');
            if (this.find(this.eid, '.essay_upload_status li', 'all').length >= this.select(this.eid).getAttribute('data-limit')) {
                this.showmsg('The number of files uploaded exceeds the queue size limit (' + this.select(this.eid).getAttribute('data-limit') + ')');
            } else if (!this.findInArray(file_ext[1].toLowerCase(), allExt.split(",*.")) ) {
                this.showmsg('The file format/file extension is not valid.');
            } else {
                this.find(this.eid, '.essay_upload_status', {action: 'addClass', actionData: 'working_file'});
                //data.context = tpl.appendTo(".essay_upload_status");
                this.select(".essay_upload_status").append(tpl);
                this.essay_sendFile_ToServer(this.eid, form_data, status);
            }
        });
    }

    // Helper function that formats the file sizes
    formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

    //It Calculate the completion percentage of the upload on progress event.
    essay_sendFile_ToServer(eid, formData, status) {
        this.activate(1);
        let tsuid = (typeof test_session_uid == "undefined") ? "" : test_session_uid;
        let uploadURL = essayUploadUrl + "?func=essay&exts=" + this.select(eid).dataset['filetypeexts'] + "&test_session_uid=" + tsuid; //Upload URL
        console.log(uploadURL);
        this.ajax({
            url: uploadURL,
            dataType: 'text',
            formData: true,
            contentType: false,
            processData: false,
            cache: false,
            data: formData,
        }).then(()=> {
            this.activate(0);
            this.select(".essay_upload_status", 'css', {display: 'block'});
            this.select('#progressbar .bar', 'remove');
            this.selectAll('.download', 'removeAttr', 'disabled');
            this.updateXML(this.eid);
            //status.setProgress(100);
            this.showmsg("File uploaded sucessfully.");
        }).catch((...e)=> {
            this.activate(0);
            console.log('File is recorded but not uploaded due to server error.',e);
            this.select('#progressbar .bar', 'remove');
            this.selectAll('.download', 'removeAttr', 'disabled');
        });
    }

    // it returns array of extracted data.
    ext_array(exts) { 
        let ext_arr = [];
        this.selectAll(exts.split(',')).forEach((val, i)=> {
            let _ext = val.split('.');
            ext_arr.push(_ext[1]);
        });
        return ext_arr;
    }

    updateXML(essayID, time, content) {
        if (this.timer['updateXML']) clearTimeout(this.timer['updateXML']);
        this.timer['updateXML'] = setTimeout(()=> {
            let val = content || editor.getContents();
            let file_str = "";
            this.find(essayID,'.essay_upload_status li', 'all').forEach((_this)=> {
                if (file_str == "") {
                    file_str = _this.querySelector('.filename').innerHTML; 
                } else {
                    file_str = file_str + ',' + _this.querySelector('.filename').innerHTML;
                }
            });
            if (window.inNative) {
                window.getHeight();
            }
            let userAnsXML = `<smans type='5'><userans><![CDATA[${val}]]></userans><upload><![CDATA[${file_str}]]></upload><path><![CDATA[${this.getPath()}]]></path></smans>`;
            window.ISSPECIALMODULEUSERXMLCHANGE = 1;
            this.select('#special_module_user_xml', 'value', userAnsXML);
            // from onUserAnsChange 
            globalThis.saveUserAnswerInSapper?.({uXml: userAnsXML, ans: "manual"});
            if (window.inNative) window.postMessage(JSON.stringify({userAnsXML, essayPreview: true}), "*");
        }, time);
    }

    // it removes the file.
    remove_file(item, eid) {
        let filename = this.parent(item).querySelector('.filename').innerHTML;
        if (this.find(eid, '.essay_upload_status li', 'all').length <= 1) this.find(eid, '.essay_upload_status').classList.remove('working_file');
        this.activate(1);
        this.ajax({
            url: essayUploadUrl, 
            data: { "action": "remove_file", "file_name": filename }
        }).then((data)=> {
            this.parent(item).remove();
            this.updateXML(eid);
            this.activate(0);
        });
    }

    // for getting folder name of the s3 of file
    getForlderName(test_session_uid) {
        let folder = test_session_uid;
        if (test_session_uid > 856399 || test_session_uid < 700000) {
            let last = this.str_pad(test_session_uid % 10000, 4, '0');
            let first = this.str_pad(Math.floor(test_session_uid / 10000), 1, '0');
            folder = first + "/" + last;
        }
        return folder;

    }

    // used in this.getForlderName
    // it takes three arguments first is string second is length, third is padstring.
    // it checks if string.length is less than length then is returns the string with padstring and string otherwise it returns string.
    str_pad(str, length, padstring) {
        while (str.length < length) {
            str = padString + str;
        }
        return str;
    }

    /*
    ** it adds the class ‘h’ to the element have class review and test and after that if it 
    ** is called with passing argument have value then it hides the element have id ‘upload’ and class ‘abort’ 
    ** otherwise shows the element have class ‘abort’ and set the attribute contenteditable 
    ** to true to the element have id ‘essay_edit’ 
    */
    modeOn(modeType) {
        this.selectAll('.test, .review', 'addClass', 'h');
        if (modeType) {
            this.selectAll('#upload, .abort', 'hide');
        } else {
            // jQuery(elemId).find('#upload').show();
            this.select('#essay_edit').setAttribute('contenteditable', 'true');
            this.selectAll('.abort', 'show');
        }
    }
}

var css_248z = "/* used color #000 , #fff , #CCC, #f5f5f5, #f9f9f9 */\r\n/* font color #333, background color: #fff */\r\n/* grey color #e1e1e1 , #d1d1d1 , #c1c1c1 , #b1b1b1 */\r\n/* blue color #c7deff , #80bdff , #3f9dff , #4592ff, #407dd1, #3288ff */\r\n/* red color #b94a48 , #f2dede , #eed3d7 */\r\n\r\n/** --- suneditor main */\r\n.sun-editor {width:auto; height:auto; box-sizing:border-box; font-family:Helvetica Neue, sans-serif; border:1px solid #dadada; background-color:#FFF; color:#000; user-select:none; -o-user-select:none; -moz-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -ms-user-select:none;}\r\n.sun-editor * {box-sizing:border-box;  -webkit-user-drag:none; overflow:visible;}\r\n.sun-editor-common input, .sun-editor-common select, .sun-editor-common textarea, .sun-editor-common button {font-size:14px; line-height:1.5;}\r\n.sun-editor-common body, .sun-editor-common div, .sun-editor-common dl, .sun-editor-common dt, .sun-editor-common dd, .sun-editor-common ul, .sun-editor-common ol, .sun-editor-common li,\r\n.sun-editor-common h1, .sun-editor-common h2, .sun-editor-common h3, .sun-editor-common h4, .sun-editor-common h5, .sun-editor-common h6, .sun-editor-common pre, .sun-editor-common code,\r\n.sun-editor-common form, .sun-editor-common fieldset, .sun-editor-common legend, .sun-editor-common textarea, .sun-editor-common p, .sun-editor-common blockquote, .sun-editor-common th,\r\n.sun-editor-common td, .sun-editor-common input, .sun-editor-common select, .sun-editor-common textarea, .sun-editor-common button {margin:0; padding:0; border:0;}\r\n.sun-editor-common dl, .sun-editor-common ul, .sun-editor-common ol, .sun-editor-common menu, .sun-editor-common li {list-style:none !important;}\r\n.sun-editor-common hr {margin:6px 0 6px 0 !important;}\r\n.sun-editor textarea {resize:none; border:0; padding:0;}\r\n.sun-editor button {border:0 none; background-color:transparent; touch-action:manipulation; cursor:pointer; outline:none;}\r\n.sun-editor input, .sun-editor select, .sun-editor textarea, .sun-editor button {vertical-align:middle;}\r\n.sun-editor button span {display:block; margin:0; padding:0;}\r\n.sun-editor button .txt {display:block; margin-top:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}\r\n\r\n\r\n/* button children are pointer event none */\r\n.sun-editor button * {\r\n    pointer-events: none;\r\n    backface-visibility: hidden;\r\n    -webkit-backface-visibility: hidden;\r\n    -moz-backface-visibility: hidden;\r\n}\r\n\r\n\r\n/** --- Icons ---------------------------------------------------------- */\r\n/* default svg */\r\n.sun-editor button > svg, .sun-editor .se-svg {\r\n    width: 16px;\r\n    height: 16px;\r\n    margin: auto;\r\n    fill: currentColor;\r\n    display: block;\r\n    text-align: center;\r\n    float: none;\r\n}\r\n/* close class icon */\r\n.sun-editor .close > svg, .sun-editor .se-dialog-close > svg {\r\n    width: 10px;\r\n    height: 10px;\r\n}\r\n/* se-select-btn icon */\r\n.sun-editor .se-btn-select > svg {\r\n    float: right;\r\n    width: 10px;\r\n    height: 10px;\r\n}\r\n/* se-btn-list inner icon */\r\n.sun-editor .se-btn-list > .se-list-icon {\r\n    display: inline-block;\r\n    width: 16px;\r\n    height: 16px;\r\n    margin: -1px 10px 0 0;\r\n    vertical-align: middle;\r\n}\r\n/* se-line-breaker inner icon */\r\n.sun-editor .se-line-breaker > button > svg {\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n\r\n/* icon class */\r\n.sun-editor button > i::before {\r\n    -moz-osx-font-smoothing:grayscale;\r\n    -webkit-font-smoothing:antialiased;\r\n    display: inline-block;\r\n    font-style: normal;\r\n    font-variant: normal;\r\n    text-rendering:auto;\r\n    font-size: 15px;\r\n    line-height: 2;\r\n}\r\n.sun-editor button > [class=\"se-icon-text\"] {\r\n    font-size: 20px;\r\n    line-height: 1;\r\n}\r\n\r\n/** --- arrow icon ---------------------------------------------------------- */\r\n.sun-editor .se-arrow, .sun-editor .se-arrow::after {position:absolute; display:block; width:0; height:0; border:11px solid transparent;}\r\n/* arrow up */\r\n.sun-editor .se-arrow.se-arrow-up {top:-11px; left:20px; margin-left:-11px; border-top-width:0; border-bottom-color:rgba(0, 0, 0, .25);}\r\n.sun-editor .se-arrow.se-arrow-up::after {top:1px; margin-left:-11px; content:\" \"; border-top-width:0; border-bottom-color:#fff;}\r\n.sun-editor .se-toolbar .se-arrow.se-arrow-up::after {border-bottom-color:#fafafa;}\r\n/* arrow down */\r\n.sun-editor .se-arrow.se-arrow-down {top:0px; left:0px; margin-left:-11px; border-bottom-width:0; border-top-color:rgba(0, 0, 0, .25);}\r\n.sun-editor .se-arrow.se-arrow-down::after {top:-12px; margin-left:-11px; content:\" \"; border-bottom-width:0; border-top-color:#fff;}\r\n.sun-editor .se-toolbar .se-arrow.se-arrow-down::after {border-top-color:#fafafa;}\r\n\r\n/** --- container */\r\n.sun-editor .se-container {position:relative; width:100%; height:100%;}\r\n\r\n/** button */\r\n.sun-editor button {color:#000;}\r\n\r\n/** --- se-btn button */\r\n.sun-editor .se-btn {float:left; width:34px; height:34px; border:0; border-radius:4px; margin:1px !important; padding:0; font-size:12px; line-height:27px;}\r\n.sun-editor .se-btn:enabled:hover, .sun-editor .se-btn:enabled:focus {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-btn:enabled:active {background-color:#d1d1d1; border-color:#c1c1c1; -webkit-box-shadow:inset 0 3px 5px #c1c1c1; box-shadow:inset 0 3px 5px #c1c1c1;}\r\n/** --- primary button */\r\n.sun-editor .se-btn-primary {color:#000; background-color:#c7deff; border:1px solid #80bdff; border-radius:4px;}\r\n.sun-editor .se-btn-primary:hover, .sun-editor .se-btn-primary:focus {color:#000; background-color:#80bdff; border-color:#3f9dff; outline:0 none;}\r\n.sun-editor .se-btn-primary:active {color:#fff; background-color:#3f9dff; border-color:#4592ff; -webkit-box-shadow:inset 0 3px 5px #4592ff; box-shadow:inset 0 3px 5px #4592ff;}\r\n\r\n/** --- Input */\r\n.sun-editor input, .sun-editor select, .sun-editor textarea {color:#000; border:1px solid #ccc; border-radius:4px;}\r\n.sun-editor input:focus, .sun-editor select:focus, .sun-editor textarea:focus {border-color:#80bdff; border-width:1px; border-style:solid; outline:0; -webkit-box-shadow:0 0 0 0.2rem #c7deff; box-shadow:0 0 0 0.2rem #c7deff; transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out;}\r\n\r\n/* se-btn button active*/\r\n.sun-editor .se-btn:enabled.active {color:#4592ff; outline:0 none;}\r\n.sun-editor .se-btn:enabled.active:hover, .sun-editor .se-btn:enabled.active:focus {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-btn:enabled.active:active {background-color:#d1d1d1; border-color:#c1c1c1; -webkit-box-shadow:inset 0 3px 5px #c1c1c1; box-shadow:inset 0 3px 5px #c1c1c1;}\r\n/* se-btn button on */\r\n.sun-editor .se-btn:enabled.on {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-btn:enabled.on:hover, .sun-editor .se-btn:enabled.on:focus {background-color:#d1d1d1; border-color:#c1c1c1; outline:0 none;}\r\n.sun-editor .se-btn:enabled.on:active {background-color:#c1c1c1; border-color:#b1b1b1; -webkit-box-shadow:inset 0 3px 5px #b1b1b1; box-shadow:inset 0 3px 5px #b1b1b1;}\r\n/* disabled buttons, icon blur */\r\n.sun-editor .se-btn:disabled, .sun-editor .se-btn-list:disabled, .sun-editor button:disabled {cursor:not-allowed; background-color:inherit; color:#bdbdbd;}\r\n\r\n/** --- loading box */\r\n.sun-editor .se-loading-box {position:absolute; display:none; width:100%; height:100%; top:0; left:0; background-color:#fff; opacity:.7; filter:alpha(opacity=70); z-index:2147483647;}\r\n.sun-editor .se-loading-box .se-loading-effect {position:absolute; display:block; top:50%; left:50%; height:25px; width:25px; border-top:2px solid #07d; border-right:2px solid transparent; border-radius:50%; animation:spinner .8s linear infinite; margin:-25px 0 0 -25px;}\r\n\r\n/** --- line breaker */\r\n.sun-editor .se-line-breaker {position:absolute; display:none; width:100%; height:1px; cursor:text; border-top:1px solid #3288ff; z-index:7;}\r\n.sun-editor .se-line-breaker > button.se-btn {position:relative; display:inline-block; width:30px; height:30px; top:-15px; float:none; left:-50%; background-color:#fff; border:1px solid #0c2240; opacity:0.6; cursor:pointer;}\r\n.sun-editor .se-line-breaker > button.se-btn:hover {opacity:0.9; background-color:#fff; border-color:#041b39;}\r\n/** --- line breaker --- component - top, bottom */\r\n.sun-editor .se-line-breaker-component {position:absolute; display:none; width:24px; height:24px; background-color:#fff; border:1px solid #0c2240; opacity:0.6; border-radius:4px; cursor:pointer; z-index:7;}\r\n.sun-editor .se-line-breaker-component:hover {opacity:0.9;}\r\n\r\n/** --- toolbar ---------------------------------------------------------- */\r\n.sun-editor .se-toolbar {display:block; position:relative; height:auto; width:100%; overflow:visible; padding:4px 3px 0 3px; margin:0; background-color:#fafafa; outline:1px solid #dadada; z-index:5;}\r\n.sun-editor .se-toolbar-cover {position:absolute; display:none; font-size:36px; width:100%; height:100%; top:0; left:0; background-color:#fefefe; opacity:.5; filter:alpha(opacity=50); cursor:not-allowed; z-index:4;}\r\n.sun-editor .se-toolbar-separator-vertical {display:inline-block; height:0px; width:0px; margin:1px; vertical-align:top;}\r\n/* inline toolbar */\r\n.sun-editor .se-toolbar.se-toolbar-inline {display:none; position:absolute; z-index:2147483647; box-shadow:0 3px 9px rgba(0,0,0,.5); -webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);}\r\n/* balloon toolbar */\r\n.sun-editor .se-toolbar.se-toolbar-balloon {display:none; position:absolute; z-index:2147483647; width:auto; box-shadow:0 3px 9px rgba(0,0,0,.5); -webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);}\r\n/* sticky toolbar */\r\n.sun-editor .se-toolbar.se-toolbar-sticky {position:fixed; top:0px;}\r\n.sun-editor .se-toolbar-sticky-dummy {display:none; position:static; z-index:-1;}\r\n\r\n/** --- tool bar --- module --- button, module, group ----------------------------------------------------------  */\r\n/* module */\r\n.sun-editor .se-btn-module {display:inline-block;}\r\n.sun-editor .se-btn-module-border {border:1px solid #dadada; border-radius:4px;}\r\n.sun-editor .se-btn-module-enter {display:block; width:100%; height:1px; margin-bottom:5px; background-color:transparent;}\r\n/* ---more - layer */\r\n.sun-editor .se-toolbar-more-layer {margin:0 -3px; background-color:#f3f3f3;}\r\n.sun-editor .se-toolbar-more-layer .se-more-layer {display:none;  border-top:1px solid #dadada;}\r\n.sun-editor .se-toolbar-more-layer .se-more-layer .se-more-form {display:inline-block; width:100%; height:auto; padding:4px 3px 0 3px;}\r\n/* ---more - button */\r\n.sun-editor .se-btn-module .se-btn-more.se-btn-more-text {width:auto; padding:0 4px;}\r\n.sun-editor .se-btn-module .se-btn-more:hover, .sun-editor .se-btn-module .se-btn-more:focus {color:#000; background-color:#d1d1d1; border-color:#c1c1c1; outline:0 none;}\r\n.sun-editor .se-btn-module .se-btn-more.on {color:#333; background-color:#d1d1d1; border-color:#c1c1c1; outline:0 none;}\r\n.sun-editor .se-btn-module .se-btn-more.on:hover {color:#000; background-color:#c1c1c1; border-color:#b1b1b1; outline:0 none;}\r\n/* innser ul */\r\n.sun-editor .se-menu-list {float:left; padding:0; margin:0;}\r\n.sun-editor .se-menu-list li {position:relative; float:left; padding:0; margin:0;}\r\n/* tool bar select button (font, fontSize, formatBlock) */\r\n.sun-editor .se-btn-select {width:auto; display:flex; padding:4px 6px;}\r\n.sun-editor .se-btn-select .txt {flex:auto; text-align:left;}\r\n.sun-editor.se-rtl .se-btn-select svg {margin:auto 1px;}\r\n.sun-editor .se-btn-select.se-btn-tool-font {width:100px;}\r\n.sun-editor .se-btn-select.se-btn-tool-format {width:82px;}\r\n.sun-editor .se-btn-select.se-btn-tool-size {width:78px;}\r\n\r\n/** --- menu tray -------------------------------------------------------------- */\r\n.sun-editor .se-btn-tray {position:relative; width:100%; height:100%; margin:0; padding:0;}\r\n.sun-editor .se-menu-tray {position:absolute; top:0px; left:0px; width:100%; height:0px;}\r\n\r\n/** --- submenu layer ---------------------------------------------------------- */\r\n.sun-editor .se-submenu {overflow-x:hidden; overflow-y:auto;}\r\n.sun-editor .se-list-layer {display:none; position:absolute; top:0px; left:0px; height:auto; z-index:5; border:1px solid #bababa; border-radius:4px; padding:6px 0; background-color:#fff; -webkit-box-shadow:0 3px 9px rgba(0, 0, 0, .5); box-shadow:0 3px 9px rgba(0, 0, 0, .5); outline:0 none;}\r\n.sun-editor .se-list-layer .se-list-inner {padding:0; margin:0; overflow-x:initial; overflow-y:initial; overflow:visible;}\r\n.sun-editor .se-list-layer button {margin:0; width:100%;}\r\n/* submenu layer - common list form */\r\n.sun-editor .se-list-inner .se-list-basic {width:100%; padding:0;}\r\n.sun-editor .se-list-inner .se-list-basic li {width:100%;}\r\n.sun-editor .se-list-inner .se-list-basic li > button {min-width:100%; width:max-content;}\r\n/* submenu layer - common list form button on */\r\n.sun-editor .se-list-inner .se-list-basic li button.active {background-color:#80bdff; border:1px solid #3f9dff; border-left:0; border-right:0;}\r\n.sun-editor .se-list-inner .se-list-basic li button.active:hover {background-color:#3f9dff; border:1px solid #4592ff; border-left:0; border-right:0;}\r\n.sun-editor .se-list-inner .se-list-basic li button.active:active {background-color:#4592ff; border:1px solid #407dd1; border-left:0; border-right:0; -webkit-box-shadow:inset 0 3px 5px #407dd1; box-shadow:inset 0 3px 5px #407dd1;}\r\n/* submenu layer - list button */\r\n.sun-editor .se-btn-list {width:100%; height:auto; min-height:32px; padding:0 14px; cursor:pointer; font-size:12px; line-height:normal; text-indent:0; text-decoration:none; text-align:left;}\r\n.sun-editor .se-btn-list.default_value {background-color:#f3f3f3; border-top:1px dotted #b1b1b1; border-bottom:1px dotted #b1b1b1;}\r\n.sun-editor .se-btn-list:hover, .sun-editor .se-btn-list:focus {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-btn-list:active {background-color:#d1d1d1; border-color:#c1c1c1; -webkit-box-shadow:inset 0 3px 5px #c1c1c1; box-shadow:inset 0 3px 5px #c1c1c1;}\r\n/** --- submenu layer - se-list-inner > exception */\r\n/* submenu layer - font size */\r\n.sun-editor .se-list-layer.se-list-font-size {min-width:140px; max-height:300px;}\r\n/* submenu layer - font family */\r\n.sun-editor .se-list-layer.se-list-font-family {min-width:156px;}\r\n.sun-editor .se-list-layer.se-list-font-family .default {border-bottom:1px solid #CCC;}\r\n/* submenu layer - hr */\r\n.sun-editor .se-list-layer.se-list-line {width:125px;}\r\n/* submenu layer - align */\r\n.sun-editor .se-list-layer.se-list-align .se-list-inner {left:9px; width:125px;}\r\n/** submenu layer - format block, paragraph style, text style */\r\n.sun-editor .se-list-layer.se-list-format {min-width:156px;}\r\n.sun-editor .se-list-layer.se-list-format li {padding:0; width:100%;}\r\n.sun-editor .se-list-layer.se-list-format ul .se-btn-list {line-height:100%;}\r\n.sun-editor .se-list-layer.se-list-format ul .se-btn-list[data-value=\"h1\"] {height:60px;}\r\n.sun-editor .se-list-layer.se-list-format ul .se-btn-list[data-value=\"h2\"] {height:34px;}\r\n.sun-editor .se-list-layer.se-list-format ul p {font-size:13px;}\r\n.sun-editor .se-list-layer.se-list-format ul div {font-size:13px; padding:4px 2px;}\r\n.sun-editor .se-list-layer.se-list-format ul h1 {font-size:2em; font-weight:bold; color:#333;}\r\n.sun-editor .se-list-layer.se-list-format ul h2 {font-size:1.5em; font-weight:bold; color:#333;}\r\n.sun-editor .se-list-layer.se-list-format ul h3 {font-size:1.17em; font-weight:bold; color:#333;}\r\n.sun-editor .se-list-layer.se-list-format ul h4 {font-size:1em; font-weight:bold; color:#333;}\r\n.sun-editor .se-list-layer.se-list-format ul h5 {font-size:0.83em; font-weight:bold; color:#333;}\r\n.sun-editor .se-list-layer.se-list-format ul h6 {font-size:0.67em; font-weight:bold; color:#333;}\r\n.sun-editor .se-list-layer.se-list-format ul blockquote {font-size:13px; color:#999; height:22px; margin:0; background-color:transparent; line-height:1.5; border-style:solid; border-color:#b1b1b1; padding:0 0 0 7px; border-left-width:5px;}\r\n.sun-editor .se-list-layer.se-list-format ul pre {font-size:13px; color:#666; padding:4px 11px; margin:0; background-color:#f9f9f9; border:1px solid #e1e1e1; border-radius:4px;}\r\n/* submenu layer --- table selector */\r\n.sun-editor .se-selector-table {display:none; position:absolute; top:34px; left:1px; z-index:5; padding:5px 0; float:left; margin:2px 0 0; font-size:14px; text-align:left; list-style:none; background-color:#fff; -webkit-background-clip:padding-box; background-clip:padding-box; border:1px solid #ccc; border-radius:4px; -webkit-box-shadow:0 6px 12px rgba(0, 0, 0, .175); box-shadow:0 6px 12px rgba(0, 0, 0, .175);}\r\n.sun-editor .se-selector-table .se-table-size {font-size:18px; padding:0 5px;}\r\n.sun-editor .se-selector-table .se-table-size-picker {position:absolute !important; z-index:3; font-size:18px; width:10em; height:10em; cursor:pointer;}\r\n.sun-editor .se-selector-table .se-table-size-highlighted {position:absolute !important; z-index:2; font-size:18px; width:1em; height:1em; background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QTZCNzMzN0I3RUYxMUU4ODcwQ0QwMjM1NTgzRTJDNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QTZCNzMzNkI3RUYxMUU4ODcwQ0QwMjM1NTgzRTJDNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MzYyNEUxRUI3RUUxMUU4ODZGQzgwRjNBODgyNTdFOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MzYyNEUxRkI3RUUxMUU4ODZGQzgwRjNBODgyNTdFOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl0yAuwAAABBSURBVDhPY/wPBAxUAGCDGvdBeWSAeicIDTfIXREiQArYeR9hEBOEohyMGkQYjBpEGAxjg6ib+yFMygCVvMbAAABj0hwMTNeKJwAAAABJRU5ErkJggg==') repeat;}\r\n.sun-editor .se-selector-table .se-table-size-unhighlighted {position:relative !important; z-index:1; font-size:18px; width:10em; height:10em; background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASAgMAAAAroGbEAAAACVBMVEUAAIj4+Pjp6ekKlAqjAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfYAR0BKhmnaJzPAAAAG0lEQVQI12NgAAOtVatWMTCohoaGUY+EmIkEAEruEzK2J7tvAAAAAElFTkSuQmCC') repeat;}\r\n.sun-editor .se-selector-table .se-table-size-display {padding-left:5px;}\r\n/* submenu layer --- color selector button */\r\n.sun-editor .se-list-layer .se-selector-color {display:flex; width:max-content; max-width:270px; height:auto; padding:0; margin:auto;}\r\n.sun-editor .se-list-layer .se-selector-color .se-color-pallet {width:100%; height:100%; padding:0;}\r\n.sun-editor .se-list-layer .se-selector-color .se-color-pallet li {display:flex; float:left; position:relative; margin:0;}\r\n.sun-editor .se-list-layer .se-selector-color .se-color-pallet button {display:block; cursor:default; width:30px; height:30px; text-indent:-9999px;}\r\n.sun-editor .se-list-layer .se-selector-color .se-color-pallet button.active, \r\n.sun-editor .se-list-layer .se-selector-color .se-color-pallet button:hover, \r\n.sun-editor .se-list-layer .se-selector-color .se-color-pallet button:focus {border:3px solid #fff;}\r\n/* submenu layer - form group (color selector) */\r\n.sun-editor .se-submenu-form-group {display:flex; width:100%; min-height:40px; height:auto; padding:4px;}\r\n.sun-editor .se-submenu-form-group input {flex:auto; display:inline-block; width:auto; height:33px; color:#555; font-size:12px; margin:1px 0 1px 0; padding:0; border-radius:0.25rem; border:1px solid #ccc;}\r\n.sun-editor .se-submenu-form-group button {float:right; width:34px; height:34px; margin:0 2px !important;}\r\n.sun-editor .se-submenu-form-group button.se-btn {border:1px solid #ccc;}\r\n.sun-editor .se-submenu-form-group > div {position:relative;}\r\n/** submenu layer - color input */\r\n.sun-editor .se-submenu-form-group .se-color-input {width:72px; text-transform:uppercase; border:none; border-bottom:2px solid #b1b1b1; outline:none;}\r\n.sun-editor .se-submenu-form-group .se-color-input:focus {border-bottom:3px solid #b1b1b1;}\r\n\r\n/** --- editor area */\r\n.sun-editor .se-wrapper {position:relative !important; width:100%; height:auto; overflow:hidden; z-index:1;}\r\n.sun-editor .se-wrapper .se-wrapper-inner {width:100%; height:100%; min-height:65px; overflow-y:auto; overflow-x:auto; -webkit-overflow-scrolling:touch; user-select:text; -o-user-select:text; -moz-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -ms-user-select:text;}\r\n.sun-editor .se-wrapper .se-wrapper-inner:focus {outline:none;}\r\n.sun-editor .se-wrapper .se-wrapper-code {background-color:#191919; color:#fff; font-size:13px; word-break:break-all; padding:4px; margin:0; resize:none !important;}\r\n.sun-editor .se-wrapper .se-wrapper-wysiwyg {background-color:#fff; display:block;}\r\n.sun-editor .se-wrapper .se-wrapper-code-mirror {font-size:13px;}\r\n/** --- placeholder */\r\n.sun-editor .se-wrapper .se-placeholder {position:absolute; display:none; white-space:nowrap; text-overflow:ellipsis; z-index:1; color:#b1b1b1; font-size:13px; line-height:1.5; top:0; left:0; right:0; overflow:hidden; margin-top:0px; padding-top:16px; padding-left:16px; margin-left:0px; padding-right:16px; margin-right:0px; pointer-events:none; backface-visibility:hidden; -webkit-backface-visibility:hidden; -moz-backface-visibility:hidden;}\r\n\r\n/** --- resizing bar */\r\n.sun-editor .se-resizing-bar {display:flex; width:auto; height:auto; min-height:16px; border-top:1px solid #dadada; padding:0 4px; background-color:#fafafa; cursor:ns-resize;}\r\n.sun-editor .se-resizing-bar.se-resizing-none {cursor:default;}\r\n.sun-editor .se-resizing-back {position:absolute; display:none; cursor:default; top:0; left:0; width:100%; height:100%; z-index:2147483647;}\r\n/** resizing bar - nabigation */\r\n.sun-editor .se-resizing-bar .se-navigation {flex:auto; position:relative; width:auto; height:auto; color:#666; margin:0; padding:0; font-size:10px; font-weight:bold; line-height:1.5; background:transparent;}\r\n/** resizing bar - charCounter */\r\n.sun-editor .se-resizing-bar .se-char-counter-wrapper {flex:none; position:relative; display:block; width:auto; height:auto; margin:0; padding:0; color:#999; font-size:13px; background:transparent;}\r\n.sun-editor .se-resizing-bar .se-char-counter-wrapper.se-blink {color:#b94a48; animation:blinker 0.2s linear infinite;}\r\n.sun-editor .se-resizing-bar .se-char-counter-wrapper .se-char-label {margin-right:4px;}\r\n\r\n/* --- dialog ---------------------------------------------------------- */\r\n.sun-editor .se-dialog {position:absolute; display:none; top:0; left:0; width:100%; height:100%; z-index:2147483647;}\r\n.sun-editor .se-dialog label, .sun-editor .se-dialog input, .sun-editor .se-dialog button {font-size:14px; line-height:1.5; color:#111; margin:0;}\r\n.sun-editor .se-dialog .se-dialog-back {position:absolute; width:100%; height:100%; top:0; left:0; background-color:#222; opacity:0.5;}\r\n/* dialog - modal */\r\n.sun-editor .se-dialog .se-dialog-inner {position:absolute; width:100%; height:100%; top:0; left:0;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-content {position:relative; width:auto; max-width:500px; margin:20px auto; background-color:#fff; -webkit-background-clip:padding-box; background-clip:padding-box; border:1px solid rgba(0, 0, 0, .2); border-radius:4px; outline:0; -webkit-box-shadow:0 3px 9px rgba(0, 0, 0, .5); box-shadow:0 3px 9px rgba(0, 0, 0, .5);}\r\n@media screen and (max-width:509px) { .sun-editor .se-dialog .se-dialog-inner .se-dialog-content {width:100%;} }\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-content label {display:inline-block; max-width:100%; margin-bottom:5px; font-weight:bold;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-content .se-btn-primary {display:inline-block; padding:6px 12px; margin:0 0 10px 0 !important; font-size:14px; font-weight:normal; line-height:1.42857143; text-align:center; white-space:nowrap; vertical-align:middle; -ms-touch-action:manipulation; touch-action:manipulation; border-radius:4px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-header {height:50px; padding:6px 15px 6px 15px; border-bottom:1px solid #e5e5e5;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-header .se-dialog-close {float:right; font-weight:bold; text-shadow:0 1px 0 #fff; -webkit-appearance:none; filter:alpha(opacity=100); opacity:1;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-header .se-modal-title {float:left; font-size:14px; font-weight:bold; margin:0; padding:0; line-height:2.5;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-body {position:relative; padding:15px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form {margin-bottom:10px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form-footer {margin-top:10px; margin-bottom:0;}\r\n.sun-editor .se-dialog .se-dialog-inner input:disabled {background-color:#f3f3f3;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-size-text {width:100%;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-size-text .size-w {width:70px; text-align:center;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-size-text .size-h {width:70px; text-align:center;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-size-x {margin:0 8px 0 8px; width:25px; text-align:center;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-footer {height:55px; padding:10px 15px 0px 15px; text-align:right; border-top:1px solid #e5e5e5;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-footer > div {float:left;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-footer > div > label {margin:0 5px 0 0;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-btn-radio {margin-left:12px; margin-right:6px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-btn-check {margin-left:12px; margin-right:4px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form-footer .se-dialog-btn-check {margin-left:0; margin-right:4px;}\r\n/* dialog - modal - form - files */\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-dialog-form-files {position:relative; display:flex; align-items:center;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-dialog-form-files > input {flex:auto;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-dialog-form-files .se-dialog-files-edge-button {flex:auto; opacity:0.8; border:1px solid #ccc;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-dialog-form-files .se-dialog-files-edge-button.se-file-remove > svg {width:8px; height:8px;} /* custom.\"remove icon\" */\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-dialog-form-files .se-dialog-files-edge-button:hover {background-color:#f0f0f0; outline:0 none;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-dialog-form-files .se-dialog-files-edge-button:active {background-color:#e9e9e9; -webkit-box-shadow:inset 0 3px 5px #d6d6d6; box-shadow:inset 0 3px 5px #d6d6d6;}\r\n/* dialog - modal - input */\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-select {display:inline-block; width:auto; height:34px; font-size:14px; text-align:center; line-height:1.42857143;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-control {display:inline-block; width:70px; height:34px; font-size:14px; text-align:center; line-height:1.42857143;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-form {display:block; width:100%; height:34px; font-size:14px; line-height:1.42857143; padding:0 4px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-form.se-input-url {direction:ltr;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-form.se-input-url:disabled {text-decoration:line-through; color:#999;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-video-ratio {width:70px; margin-left:4px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form a {color:#004cff;}\r\n/* dialog - revert button */\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-btn-revert {border:1px solid #ccc;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-btn-revert:hover {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-btn-revert:active {background-color:#d1d1d1; border-color:#c1c1c1; -webkit-box-shadow:inset 0 3px 5px #c1c1c1; box-shadow:inset 0 3px 5px #c1c1c1;}\r\n/* dialog - inner tab */\r\n.sun-editor .se-dialog-tabs {width:100%; height:25px; border-bottom:1px solid #e5e5e5;}\r\n.sun-editor .se-dialog-tabs button {background-color:#e5e5e5; border-right:1px solid #e5e5e5; float:left; outline:none; padding:2px 13px; transition:0.3s;}\r\n.sun-editor .se-dialog-tabs button:hover {background-color:#fff;}\r\n.sun-editor .se-dialog-tabs button.active {background-color:#fff;border-bottom:0;}\r\n\r\n/* dialog - modal - math */\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-form.se-math-exp {resize:vertical; height:4rem; border:1px solid #ccc; font-size:13px; padding:4px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-input-select.se-math-size {width:6em; height:28px; margin-left:1em;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-math-preview {font-size:13px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-math-preview > span {display:inline-block; -webkit-box-shadow:0 0 0 0.1rem #c7deff; box-shadow:0 0 0 0.1rem #c7deff;}\r\n/* dialog - modal - se-link-preview */\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-link-preview {display:block; height:auto; max-height:18px; margin:4px 0 0 4px; font-size:13px; font-weight:normal; font-family:inherit; color:#666; background-color:transparent; overflow:hidden; text-overflow:ellipsis; word-break:break-all; white-space:pre;}\r\n/* .sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-mention-item {line-height:28px;min-height:25px;padding:0 5px;cursor:pointer;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-mention-item:hover {background-color:#e1e1e1}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-mention-item.se-mention-active {background-color: #d1d1d1; border-radius:3px;}\r\n.sun-editor .se-dialog .se-dialog-inner .se-dialog-form .se-mention-search {margin-bottom: 10px;} */\r\n\r\n/** --- controller ---------------------------------------------------------- */\r\n.sun-editor .se-controller .se-arrow.se-arrow-up {border-bottom-color:rgba(0, 0, 0, .25);}\r\n.sun-editor .se-controller {position:absolute; display:none; overflow:visible; z-index:6; border:1px solid rgba(0, 0, 0, .25); border-radius:4px; text-align:start; text-decoration:none; text-shadow:none; text-transform:none; letter-spacing:normal; word-break:normal; word-spacing:normal; word-wrap:normal; white-space:normal; background-color:#fff; -webkit-background-clip:padding-box; background-clip:padding-box; -webkit-box-shadow:0 5px 10px rgba(0, 0, 0, .2); box-shadow:0 5px 10px rgba(0, 0, 0, .2); line-break:auto;}\r\n\r\n/* controller - button group */\r\n.sun-editor .se-controller .se-btn-group {position:relative; display:flex; vertical-align:middle; padding:2px; top:0; left:0;}\r\n.sun-editor .se-controller .se-btn-group .se-btn-group-sub {left:50%; min-width:auto; width:max-content; display:none;/* display: inline-table; */}\r\n.sun-editor .se-controller .se-btn-group .se-btn-group-sub button {margin:0; min-width:72px;}\r\n.sun-editor .se-controller .se-btn-group button {position:relative; min-height:34px; height:auto; border:none; border-radius:4px; margin:1px; padding:5px 10px; font-size:12px; line-height:1.5; display:inline-block; font-weight:normal; text-align:center; white-space:nowrap; vertical-align:middle; -ms-touch-action:manipulation; touch-action:manipulation;}\r\n.sun-editor .se-controller .se-btn-group button:hover:enabled, .sun-editor .se-controller .se-btn-group button:focus:enabled {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-controller .se-btn-group button:active:enabled {background-color:#d1d1d1; border-color:#c1c1c1; -webkit-box-shadow:inset 0 3px 5px #c1c1c1; box-shadow:inset 0 3px 5px #c1c1c1;}\r\n.sun-editor .se-controller .se-btn-group button span {display:block; padding:0; margin:0;}\r\n/* controller - buttn group active */\r\n.sun-editor .se-controller .se-btn-group button:enabled.active {color:#4592ff; outline:0 none;}\r\n.sun-editor .se-controller .se-btn-group button:enabled.active:hover, .sun-editor .se-controller .se-btn-group button:enabled.active:focus {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-controller .se-btn-group button:enabled.active:active {background-color:#d1d1d1; border-color:#c1c1c1; -webkit-box-shadow:inset 0 3px 5px #c1c1c1; box-shadow:inset 0 3px 5px #c1c1c1;}\r\n/* controller - buttn group on */\r\n.sun-editor .se-controller .se-btn-group button:enabled.on {background-color:#e1e1e1; border-color:#d1d1d1; outline:0 none;}\r\n.sun-editor .se-controller .se-btn-group button:enabled.on:hover, .sun-editor .se-controller .se-btn-group button:enabled.on:focus {background-color:#d1d1d1; border-color:#c1c1c1; outline:0 none;}\r\n.sun-editor .se-controller .se-btn-group button:enabled.on:active {background-color:#c1c1c1; border-color:#b1b1b1; -webkit-box-shadow:inset 0 3px 5px #b1b1b1; box-shadow:inset 0 3px 5px #b1b1b1;}\r\n\r\n/* controller - resizing(image, iframe) */\r\n.sun-editor .se-controller-resizing {margin-top:-50px !important; padding:0; font-size:14px; font-style:normal; font-weight:normal; line-height:1.42857143;}\r\n.sun-editor .se-controller-resizing .se-btn-group .se-btn-group-sub.se-resizing-align-list {width:74px;}\r\n.sun-editor .se-resizing-container {position:absolute; display:none; outline:1px solid #3f9dff; background-color:transparent;}\r\n.sun-editor .se-resizing-container .se-modal-resize {position:absolute; display:inline-block; background-color:#3f9dff; opacity:0.3;}\r\n.sun-editor .se-resizing-container .se-resize-dot {position:absolute; top:0px; left:0px; width:100%; height:100%}\r\n.sun-editor .se-resizing-container .se-resize-dot > span {position:absolute; width:7px; height:7px; background-color:#3f9dff; border:1px solid #4592ff;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.tl {top:-5px; left:-5px; cursor:nw-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.tr {top:-5px; right:-5px; cursor:ne-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.bl {bottom:-5px; left:-5px; cursor:sw-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.br {right:-5px; bottom:-5px; cursor:se-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.lw {left:-7px; bottom:50%; cursor:w-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.th {left:50%; top:-7px; cursor:n-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.rw {right:-7px; bottom:50%; cursor:e-resize;}\r\n.sun-editor .se-resizing-container .se-resize-dot > span.bh {right:50%; bottom:-7px; cursor:s-resize;}\r\n.sun-editor .se-resizing-container .se-resize-display {position:absolute; right:0; bottom:0; padding:5px; margin:5px; font-size:12px; color:#fff; background-color:#333; border-radius:4px;}\r\n/* controller - table */\r\n.sun-editor .se-controller-table {width:auto; padding:0; font-size:14px; font-style:normal; font-weight:normal; line-height:1.42857143;}\r\n.sun-editor .se-controller-table-cell {width:auto; padding:0; font-size:14px; font-style:normal; font-weight:normal; line-height:1.42857143;}\r\n/* controller - link */\r\n.sun-editor .se-controller-link {padding:0; font-size:14px; font-style:normal; font-weight:normal; line-height:1.42857143;}\r\n.sun-editor .se-controller-link::before, .sun-editor .se-controller-link::after {-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box;}\r\n.sun-editor .se-controller-link .link-content {padding:0; margin:0;}\r\n.sun-editor .se-controller-link .link-content a {display:inline-block; color:#4592ff; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:middle; margin-left:5px;}\r\n\r\n/* --- browser ---------------------------------------------------------- */\r\n.sun-editor .se-file-browser {position:absolute; display:none; top:0; left:0; width:100%; height:100%; z-index:2147483647;}\r\n.sun-editor .se-file-browser label, .sun-editor .se-file-browser input, .sun-editor .se-file-browser button {font-size:14px; line-height:1.5; color:#111; margin:0;}\r\n.sun-editor .se-file-browser .se-file-browser-back {position:absolute; display:block; width:100%; height:100%; top:0; left:0; background-color:#222; opacity:0.5;}\r\n.sun-editor .se-file-browser .se-file-browser-inner {position:absolute; display:block; width:100%; height:100%; top:0; left:0;}\r\n.sun-editor .se-file-browser .se-file-browser-inner .se-file-browser-content {position:relative; width:960px; max-width:100%; margin:20px auto; background-color:#fff; -webkit-background-clip:padding-box; background-clip:padding-box; border:1px solid rgba(0, 0, 0, .2); border-radius:4px; outline:0; -webkit-box-shadow:0 3px 9px rgba(0, 0, 0, .5); box-shadow:0 3px 9px rgba(0, 0, 0, .5);}\r\n/* --- browser - header */\r\n.sun-editor .se-file-browser .se-file-browser-header {height:auto; min-height:50px; padding:6px 15px 6px 15px; border-bottom:1px solid #e5e5e5;}\r\n.sun-editor .se-file-browser .se-file-browser-header .se-file-browser-close {float:right; font-weight:bold; text-shadow:0 1px 0 #fff; -webkit-appearance:none; filter:alpha(opacity=100); opacity:1;}\r\n.sun-editor .se-file-browser .se-file-browser-header .se-file-browser-close > svg {width:12px; height:12px;}\r\n.sun-editor .se-file-browser .se-file-browser-header .se-file-browser-title {font-size:16px; font-weight:bold; margin:0; padding:0; line-height:2.2;}\r\n/* --- browser - header - tags */\r\n.sun-editor .se-file-browser .se-file-browser-tags {display:block; width:100%; padding:0; text-align:left; margin:0 -15px;}\r\n.sun-editor .se-file-browser .se-file-browser-tags a {display:inline-block; background-color:#f5f5f5; padding:6px 12px; margin:8px 0 8px 8px; color:#333; text-decoration:none; border-radius:32px; -moz-border-radius:32px; -webkit-border-radius:32px; -moz-background-clip:padding; -webkit-background-clip:padding-box; background-clip:padding-box; cursor:pointer;}\r\n.sun-editor .se-file-browser .se-file-browser-tags a:hover {background-color:#e1e1e1;}\r\n.sun-editor .se-file-browser .se-file-browser-tags a:active {background-color:#d1d1d1;}\r\n.sun-editor .se-file-browser .se-file-browser-tags a.on {background-color:#ebf3fe; color:#4592ff;}\r\n.sun-editor .se-file-browser .se-file-browser-tags a.on:hover {background-color:#d8e8fe;}\r\n.sun-editor .se-file-browser .se-file-browser-tags a.on:active {background-color:#c7deff;}\r\n/* --- browser - body */\r\n.sun-editor .se-file-browser .se-file-browser-body {position:relative; height:auto; min-height:350px; padding:20px; overflow-y:auto;}\r\n.sun-editor .se-file-browser .se-file-browser-body .se-file-browser-list {position:relative; width:100%;}\r\n@media screen and (max-width:992px) { .sun-editor .se-file-browser .se-file-browser-inner .se-file-browser-content {width:748px;} }\r\n@media screen and (max-width:768px) { .sun-editor .se-file-browser .se-file-browser-inner .se-file-browser-content {width:600px;} }\r\n/* --- browser - column */\r\n.sun-editor .se-file-browser .se-file-browser-list .se-file-item-column {position:relative; display:block; height:auto; float:left;}\r\n\r\n/* --- browser --- custom - \"se-image-list\" - column */\r\n.sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-column {width:calc(25% - 20px); margin:0 10px;}\r\n@media screen and (max-width:992px) { .sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-column {width:calc(33% - 20px);} }\r\n@media screen and (max-width:768px) { .sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-column {width:calc(50% - 20px);} }\r\n/* --- browser --- custom - \"se-image-list\" - item */\r\n.sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-img {position:relative; display:block; cursor: pointer; width:100%; height:auto; border-radius:4px; outline:0; margin:10px 0;}\r\n.sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-img:hover {opacity:0.8; -webkit-box-shadow:0 0 0 0.2rem #3288ff; box-shadow:0 0 0 0.2rem #3288ff;}\r\n.sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-img > img {position:relative; display:block; width:100%; border-radius:4px; outline:0; height:auto;}\r\n.sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-img > .se-file-img-name {position: absolute; z-index:1; font-size:13px; color:#fff; left:0px; bottom:0; padding:5px 10px; background-color:transparent; width:100%; height:30px; border-bottom-right-radius:4px; border-bottom-left-radius:4px;}\r\n.sun-editor .se-file-browser .se-file-browser-list.se-image-list .se-file-item-img > .se-file-img-name.se-file-name-back {background-color:#333; opacity:0.6;}\r\n\r\n/** --- notice */\r\n.sun-editor .se-notice {position:absolute; top:0; display:none; z-index:7; width:100%; height:auto; word-break:break-all; font-size:13px; color:#b94a48; background-color:#f2dede; padding:15px; margin:0; border:1px solid #eed3d7; user-select:text; -o-user-select:text; -moz-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -ms-user-select:text;}\r\n.sun-editor .se-notice button {float:right; padding:7px;}\r\n\r\n/** --- tooltip */\r\n.sun-editor .se-tooltip {position:relative; overflow:visible;}\r\n.sun-editor .se-tooltip .se-tooltip-inner {visibility:hidden; position:absolute; display:block; width:auto; top:120%; left:50%; background:transparent; opacity:0; z-index:1; line-height:1.5; transition:opacity 0.5s; margin:0; padding:0; bottom:auto; float:none; pointer-events:none; backface-visibility:hidden; -webkit-backface-visibility:hidden; -moz-backface-visibility:hidden;}\r\n.sun-editor .se-tooltip .se-tooltip-inner .se-tooltip-text {position:relative; display:inline-block; width:auto; left:-50%; font-size:0.9em; margin:0; padding:4px 6px; border-radius:2px; background-color:#333; color:#fff; text-align:center; line-height:unset; white-space:nowrap; cursor:auto;}\r\n.sun-editor .se-tooltip .se-tooltip-inner .se-tooltip-text::after {content:\"\"; position:absolute; bottom:100%; left:50%; margin-left:-5px; border-width:5px; border-style:solid; border-color:transparent transparent #333 transparent;}\r\n.sun-editor .se-tooltip:hover .se-tooltip-inner {visibility:visible; opacity:1;}\r\n.sun-editor .se-tooltip .se-tooltip-inner .se-tooltip-text .se-shortcut {display:block !important;}\r\n.sun-editor .se-tooltip .se-tooltip-inner .se-tooltip-text .se-shortcut > .se-shortcut-key {display:inline; font-weight:bold;}\r\n\r\n\r\n/** --- RTL ---------------------------------------------------------- */\r\n/* tray */\r\n.sun-editor.se-rtl .se-btn-tray {direction:rtl;}\r\n\r\n/* button--- */\r\n/* button - select text */\r\n.sun-editor.se-rtl .se-btn-select .txt {flex:auto; text-align:right; direction:rtl;}\r\n/* button - se-menu-list */\r\n.sun-editor.se-rtl .se-btn-list {text-align:right;}\r\n.sun-editor.se-rtl .se-btn-list > .se-list-icon {margin:-1px 0 0 10px;}\r\n/* button - se-menu-list - li */\r\n.sun-editor.se-rtl .se-menu-list {float:right;}\r\n.sun-editor.se-rtl .se-menu-list li {float:right;}\r\n\r\n/* menu list--- */\r\n.sun-editor.se-rtl .se-list-layer * {direction:rtl;}\r\n/* menu list - format block */\r\n.sun-editor.se-rtl .se-list-layer.se-list-format ul blockquote {padding:0 7px 0 0; border-right-width:5px; border-left-width:0;}\r\n/* menu list - color picker */\r\n.sun-editor.se-rtl .se-list-layer .se-selector-color .se-color-pallet li {float:right;}\r\n\r\n/* placeholder */\r\n.sun-editor.se-rtl .se-wrapper .se-placeholder {direction:rtl;}\r\n\r\n/* tooltip */\r\n.sun-editor.se-rtl .se-tooltip .se-tooltip-inner .se-tooltip-text {direction:rtl;}\r\n.sun-editor.se-rtl .se-tooltip .se-tooltip-inner .se-tooltip-text .se-shortcut {direction:ltr;}\r\n\r\n/* dialog--- */\r\n.sun-editor.se-rtl .se-dialog * {direction:rtl;}\r\n/* dialog - header */\r\n.sun-editor.se-rtl .se-dialog .se-dialog-inner .se-dialog-header .se-dialog-close {float:left;}\r\n.sun-editor.se-rtl .se-dialog .se-dialog-inner .se-dialog-header .se-modal-title {float:right;}\r\n/* dialog - tabs */\r\n.sun-editor.se-rtl .se-dialog-tabs button {float:right;}\r\n.sun-editor.se-rtl .se-dialog .se-dialog-inner .se-dialog-size-text {padding-right:34px;}\r\n/* dialog - footer */\r\n.sun-editor.se-rtl .se-dialog .se-dialog-inner .se-dialog-content .se-btn-primary {float:left}\r\n.sun-editor.se-rtl .se-dialog .se-dialog-inner .se-dialog-footer > div {float:right;}\r\n.sun-editor.se-rtl .se-dialog .se-dialog-inner .se-dialog-footer > div > label {margin:0 0 0 5px;}\r\n\r\n/* fileBrowser--- */\r\n.sun-editor.se-rtl .se-file-browser * {direction:rtl;}\r\n/* fileBrowser - header */\r\n.sun-editor.se-rtl .se-file-browser .se-file-browser-tags {text-align:right;}\r\n.sun-editor.se-rtl .se-file-browser .se-file-browser-tags a {margin: 8px 8px 0 8px;}\r\n.sun-editor.se-rtl .se-file-browser .se-file-browser-header .se-file-browser-close {float:left;}\r\n\r\n/** controller--- */\r\n.sun-editor.se-rtl .se-controller .se-btn-group {direction:rtl;}\r\n/** --- RTL ---------------------------------------------------------- */\r\n\r\n\r\n/** animation */\r\n@keyframes blinker { 50% {opacity:0;} }\r\n@keyframes spinner { to {transform:rotate(361deg);} }";
styleInject(css_248z);

/* clsSMEssay\EssayPreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMEssay\\EssayPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-f0bx9o", ".hero-unit.svelte-f0bx9o.svelte-f0bx9o{border:1px solid #ccc;width:84%;padding:18px!important;font-size:15px!important;margin-bottom:30px;font-weight:200;line-height:30px;color:inherit;background-color:#eeeeee;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px}.essay_upload_status.svelte-f0bx9o.svelte-f0bx9o{margin-top:10px}.abort.svelte-f0bx9o.svelte-f0bx9o{padding-left:15px;cursor:pointer}.essay-btn.svelte-f0bx9o.svelte-f0bx9o,#essayfile-button.svelte-f0bx9o.svelte-f0bx9o,#editfiles.svelte-f0bx9o.svelte-f0bx9o{display:inline-block;padding:4px 8px;font-size:12px;line-height:20px;text-align:center;vertical-align:middle;cursor:pointer;color:#333333;text-shadow:0 1px 1px rgba(255, 255, 255, 0.75);background-color:#f5f5f5;background-image:-moz-linear-gradient(top, #ffffff, #e6e6e6);background-image:-webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));background-image:-webkit-linear-gradient(top, #ffffff, #e6e6e6);background-image:-o-linear-gradient(top, #ffffff, #e6e6e6);background-image:linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat:repeat-x;border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);border:1px solid #cccccc;border-bottom-color:#b3b3b3;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);-moz-box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05)}#upload.svelte-f0bx9o.svelte-f0bx9o{font-family:'PT Sans Narrow', sans-serif;background-color:#E0E0E0;background-image:-webkit-linear-gradient(top, #E0E0E0, #E0E0E0);background-image:-moz-linear-gradient(top, #E0E0E0, #E0E0E0);background-image:linear-gradient(top, #E0E0E0, #E0E0E0);width:100%;padding:30px 30px 0;border-radius:3px;border-collapse:separate;border:1px solid rgb(204, 204, 204);margin-top:2px}#drop.svelte-f0bx9o.svelte-f0bx9o{background-color:#EEEEEE;padding:25px 30px;margin-bottom:30px;border:20px solid rgba(0, 0, 0, 0);border-radius:3px;text-align:center;font-size:16px;font-weight:bold;color:#7f858a;border:1px solid #CCCCCC}#drop.svelte-f0bx9o a.svelte-f0bx9o{padding:12px 5%;color:#2B2E31;font-size:14px;border-radius:2px;cursor:pointer;display:inline-block;margin-top:12px;margin-bottom:12px;line-height:1;text-decoration:none;position:relative;top:30px}#drop.svelte-f0bx9o input.svelte-f0bx9o{display:none}.essay-btn.svelte-f0bx9o.svelte-f0bx9o{margin-bottom:15px}.essay-container.svelte-f0bx9o.svelte-f0bx9o{width:89%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,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 */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[22] = list[i];
	child_ctx[24] = i;
	return child_ctx;
}

// (153:8) {#if localEssayData }
function create_if_block(ctx) {
	let itemhelper;
	let t0;
	let div4;
	let div0;
	let t1;
	let textarea;
	let t2;
	let div3;
	let div2;
	let t3;
	let div1;
	let t4;
	let t5_value = /*localEssayData*/ ctx[3].limit + "";
	let t5;
	let t6;
	let t7_value = /*localEssayData*/ ctx[3].filetypeexts + "";
	let t7;
	let t8;
	let t9;
	let a;
	let t11;
	let input;
	let div3_class_value;
	let t12;
	let ul;
	let ul_class_value;
	let div4_data_filetypeexts_value;
	let div4_data_limit_value;
	let current;
	let mounted;
	let dispose;
	itemhelper = new ItemHelper({ $$inline: true });
	itemhelper.$on("setReview", /*setReview*/ ctx[6]);

	itemhelper.$on("unsetReview", function () {
		if (is_function(/*unsetReview*/ ctx[7].bind(this, /*localEssayData*/ ctx[3].type))) /*unsetReview*/ ctx[7].bind(this, /*localEssayData*/ ctx[3].type).apply(this, arguments);
	});

	let if_block = /*localEssayData*/ ctx[3].upload != '' && create_if_block_1(ctx);

	const block = {
		c: function create() {
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div4 = element("div");
			div0 = element("div");
			t1 = space();
			textarea = element("textarea");
			t2 = space();
			div3 = element("div");
			div2 = element("div");
			t3 = text("Drag & Drop Files Here\r\n                        ");
			div1 = element("div");
			t4 = text("You can upload upto ");
			t5 = text(t5_value);
			t6 = space();
			t7 = text(t7_value);
			t8 = text(" files.");
			t9 = space();
			a = element("a");
			a.textContent = "Browse";
			t11 = space();
			input = element("input");
			t12 = space();
			ul = element("ul");
			if (if_block) if_block.c();
			attr_dev(div0, "id", "essayPreviewToolbar");
			attr_dev(div0, "class", "sun-editor");
			add_location(div0, file, 163, 16, 5686);
			attr_dev(textarea, "id", "essay_edit");
			attr_dev(textarea, "class", "text-left editor sun-editor-editable");
			add_location(textarea, file, 164, 16, 5759);
			attr_dev(div1, "class", "text-center");
			set_style(div1, "font-size", "12px");
			set_style(div1, "font-weight", "normal");
			set_style(div1, "position", "relative");
			set_style(div1, "top", "45px");
			set_style(div1, "word-wrap", "break-word");
			add_location(div1, file, 168, 24, 6081);
			attr_dev(a, "href", "#upl");
			attr_dev(a, "class", "essay-btn btn btn-light darkgrey_border svelte-f0bx9o");
			add_location(a, file, 169, 24, 6310);
			attr_dev(input, "type", "file");
			attr_dev(input, "name", "upl");
			attr_dev(input, "id", "upl");
			input.multiple = "multiple";
			set_style(input, "opacity", "0.5");
			attr_dev(input, "class", "svelte-f0bx9o");
			add_location(input, file, 170, 24, 6409);
			attr_dev(div2, "id", "drop");
			attr_dev(div2, "class", "svelte-f0bx9o");
			add_location(div2, file, 166, 20, 5992);
			attr_dev(div3, "id", "upload");

			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(window.isReview == true || /*isReview*/ ctx[0] == true || /*localEssayData*/ ctx[3].type == "0"
			? "h"
			: "") + " svelte-f0bx9o"));

			add_location(div3, file, 165, 16, 5860);

			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(/*localEssayData*/ ctx[3].type == "0"
			? "essay_upload_status text-left h"
			: "essay_upload_status text-left working_file") + " svelte-f0bx9o"));

			set_style(ul, "list-style-type", "none");
			add_location(ul, file, 181, 16, 6860);
			attr_dev(div4, "id", /*eid*/ ctx[4]);
			attr_dev(div4, "data-filetypeexts", div4_data_filetypeexts_value = /*localEssayData*/ ctx[3].filetypeexts);
			attr_dev(div4, "data-limit", div4_data_limit_value = /*localEssayData*/ ctx[3].limit);
			attr_dev(div4, "class", "essay-container m-auto hero-unit svelte-f0bx9o");
			add_location(div4, file, 157, 12, 5445);
		},
		m: function mount(target, anchor) {
			mount_component(itemhelper, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div4, anchor);
			append_dev(div4, div0);
			append_dev(div4, t1);
			append_dev(div4, textarea);
			append_dev(div4, t2);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div1, t4);
			append_dev(div1, t5);
			append_dev(div1, t6);
			append_dev(div1, t7);
			append_dev(div1, t8);
			append_dev(div2, t9);
			append_dev(div2, a);
			append_dev(div2, t11);
			append_dev(div2, input);
			append_dev(div4, t12);
			append_dev(div4, ul);
			if (if_block) if_block.m(ul, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input, "change", /*input_change_handler*/ ctx[11]),
					listen_dev(input, "change", /*change_handler*/ ctx[12], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty & /*localEssayData*/ 8) && t5_value !== (t5_value = /*localEssayData*/ ctx[3].limit + "")) set_data_dev(t5, t5_value);
			if ((!current || dirty & /*localEssayData*/ 8) && t7_value !== (t7_value = /*localEssayData*/ ctx[3].filetypeexts + "")) set_data_dev(t7, t7_value);

			if (!current || dirty & /*isReview, localEssayData*/ 9 && div3_class_value !== (div3_class_value = "" + (null_to_empty(window.isReview == true || /*isReview*/ ctx[0] == true || /*localEssayData*/ ctx[3].type == "0"
			? "h"
			: "") + " svelte-f0bx9o"))) {
				attr_dev(div3, "class", div3_class_value);
			}

			if (/*localEssayData*/ ctx[3].upload != '') {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(ul, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (!current || dirty & /*localEssayData*/ 8 && ul_class_value !== (ul_class_value = "" + (null_to_empty(/*localEssayData*/ ctx[3].type == "0"
			? "essay_upload_status text-left h"
			: "essay_upload_status text-left working_file") + " svelte-f0bx9o"))) {
				attr_dev(ul, "class", ul_class_value);
			}

			if (!current || dirty & /*localEssayData*/ 8 && div4_data_filetypeexts_value !== (div4_data_filetypeexts_value = /*localEssayData*/ ctx[3].filetypeexts)) {
				attr_dev(div4, "data-filetypeexts", div4_data_filetypeexts_value);
			}

			if (!current || dirty & /*localEssayData*/ 8 && div4_data_limit_value !== (div4_data_limit_value = /*localEssayData*/ ctx[3].limit)) {
				attr_dev(div4, "data-limit", div4_data_limit_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(itemhelper, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div4);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(153:8) {#if localEssayData }",
		ctx
	});

	return block;
}

// (183:20) {#if localEssayData.upload != '' }
function create_if_block_1(ctx) {
	let each_1_anchor;
	let each_value = /*localEssayData*/ ctx[3].upload.split(',');
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*handleClick, isReview, localEssayData*/ 41) {
				each_value = /*localEssayData*/ ctx[3].upload.split(',');
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(183:20) {#if localEssayData.upload != '' }",
		ctx
	});

	return block;
}

// (192:32) {#if !isReview}
function create_if_block_2(ctx) {
	let span;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			span.textContent = "abort";
			attr_dev(span, "class", "abort svelte-f0bx9o");
			add_location(span, file, 192, 36, 7726);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);

			if (!mounted) {
				dispose = listen_dev(span, "click", /*handleClick*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(192:32) {#if !isReview}",
		ctx
	});

	return block;
}

// (184:24) {#each localEssayData.upload.split(',') as uploaded, index}
function create_each_block(ctx) {
	let li;
	let span0;
	let a;
	let i;
	let a_href_value;
	let t0;
	let span1;
	let t1_value = /*uploaded*/ ctx[22] + "";
	let t1;
	let t2;
	let t3;
	let if_block = !/*isReview*/ ctx[0] && create_if_block_2(ctx);

	const block = {
		c: function create() {
			li = element("li");
			span0 = element("span");
			a = element("a");
			i = element("i");
			t0 = space();
			span1 = element("span");
			t1 = text(t1_value);
			t2 = space();
			if (if_block) if_block.c();
			t3 = space();
			attr_dev(i, "class", "icomoon-file-download");
			add_location(i, file, 187, 40, 7445);
			attr_dev(a, "target", "_blanks");
			attr_dev(a, "href", a_href_value = /*localEssayData*/ ctx[3].path + /*uploaded*/ ctx[22]);
			attr_dev(a, "title", "Download File");
			attr_dev(a, "class", "essay_dwl_file svelte-f0bx9o");
			add_location(a, file, 186, 36, 7300);
			attr_dev(span0, "class", "download");
			add_location(span0, file, 185, 32, 7239);
			attr_dev(span1, "class", "filename");
			add_location(span1, file, 190, 32, 7599);
			attr_dev(li, "class", "working");
			add_location(li, file, 184, 28, 7185);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, span0);
			append_dev(span0, a);
			append_dev(a, i);
			append_dev(li, t0);
			append_dev(li, span1);
			append_dev(span1, t1);
			append_dev(li, t2);
			if (if_block) if_block.m(li, null);
			append_dev(li, t3);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*localEssayData*/ 8 && a_href_value !== (a_href_value = /*localEssayData*/ ctx[3].path + /*uploaded*/ ctx[22])) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*localEssayData*/ 8 && t1_value !== (t1_value = /*uploaded*/ ctx[22] + "")) set_data_dev(t1, t1_value);

			if (!/*isReview*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(li, t3);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(184:24) {#each localEssayData.upload.split(',') as uploaded, index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let p;
	let t;
	let div;
	let current;
	let if_block = /*localEssayData*/ ctx[3] && create_if_block(ctx);

	const block = {
		c: function create() {
			main = element("main");
			p = element("p");
			t = space();
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(p, "id", "demo");
			add_location(p, file, 150, 4, 5205);
			add_location(div, file, 151, 4, 5229);
			add_location(main, file, 149, 0, 5193);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, p);
			append_dev(main, t);
			append_dev(main, div);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*localEssayData*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*localEssayData*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function updateAttrToLower(data) {

	if (data.SMANS) {
		data.smans = data.SMANS;
		delete data.SMANS;
	}

	return data;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('EssayPreview', slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let { editorState } = $$props;
	let ucEssay;
	let files;

	let state = {
		userans: '',
		appPath: "",
		essayStr: '',
		userAns: '',
		site_url: ""
	};

	let essay_class = "working_file";
	let eid = "essayPreviewContainer";
	let localEssayData = {};
	let uAns = "";
	let essayEditor;

	const headingArray = [
		{
			"font": "fontSize 6",
			"text": "Heading 1"
		},
		{
			"font": "fontSize 5",
			"text": "Heading 2"
		},
		{
			"font": "fontSize 4",
			"text": "Heading 3"
		},
		{
			"font": "fontSize 3",
			"text": "Heading 4"
		},
		{
			"font": "fontSize 2",
			"text": "Heading 5"
		},
		{
			"font": "fontSize 1",
			"text": "Heading 6"
		}
	];

	onMount(() => {
		editorState && AH.set(editorState.content_type + "_refresh", setEssayContent.bind(this));
		loadXML(xml, uxml);

		// Intialize editor plugin
		initEdit();

		addTabIndex();
	});

	function addTabIndex() {
		var se_menu = AH.selectAll('.se-menu-list');

		se_menu.forEach(function (curr, index) {
			let se_menu_list = curr.getElementsByTagName('li');

			for (var i = 0; i < se_menu_list.length; ++i) {
				AH.select(se_menu_list[i]).setAttribute('tabindex', 0);
			}
		});
	}

	function initEdit() {
		essayEditor = sunEditor.create('essay_edit', {
			height: '300px',
			value: uAns,
			width: 'auto',
			toolbarContainer: "#essayPreviewToolbar",
			placeholder: "Write text here.",
			resizingBar: false,
			showPathLabel: false,
			plugins,
			defaultStyle: "padding-left: 10px",
			buttonList: [
				['formatBlock'],
				['bold', 'italic', 'underline'],
				['link'],
				['list', 'outdent', 'indent', 'align'],
				['removeFormat']
			]
		});

		let elemId = '#' + eid;
		$$invalidate(1, ucEssay = new EssayNewReact(elemId, essayEditor));
	} //ucEssay.essay_ready();

	function setEssayContent() {
		console.log("set Content");
		essayEditor.setContents(uAns);
	}

	// it is called when state updated
	beforeUpdate(() => {
		if (xml != state.xml) {
			state.xml = xml;
			console.log("Updating from Preview");
			loadXML(xml, uxml);
		}
	});

	// its for loading the xml.
	function loadXML(essayXML, uxml) {
		let essayUser = uxml ? XMLToJSON(uxml) : "";
		essayXML = XMLToJSON(essayXML);

		// userxml_is_empty = updateAttrToLower(userxml_is_empty);
		// if(userxml_is_empty) {
		//     if(!userxml_is_empty.smans) {
		//         uaxml = "";
		//     }
		// }
		// Parsing XMLs
		try {
			let essay = essayXML.smxml.default
			? essayXML.smxml.default
			: essayXML.smxml;

			uAns = essayUser && essayUser.smans.userans.charCodeAt(0) != 10
			? essayUser.smans.userans
			: essay.__cdata !== undefined ? essay.__cdata : '';

			//self.userAnsXML = $('#special_module_user_xml').val();
			$$invalidate(3, localEssayData = {
				userans: uAns,
				filetypeexts: essay._filetypeexts,
				limit: essay._limit,
				type: essay._type == "5" ? "0" : essay._type,
				upload: essayUser ? essayUser.smans.upload : "",
				path: essayUser ? essayUser.smans.path : ""
			});
		} catch(error) {
			console.log({
				error,
				func: 'loadXml',
				file: 'EssayPreview.svelte'
			});
		}
	}

	// calls on click of abort
	function handleClick(e) {
		ucEssay.remove_file(e.currentTarget, '#' + eid);
	}

	// calls when review mode is on
	function setReview() {
		$$invalidate(0, isReview = true);
		essayEditor.disabled(); // Disable editing for module
		ucEssay.modeOn("on");
	}

	// calls when review mode is off after on
	function unsetReview(type) {
		$$invalidate(0, isReview = false);
		essayEditor.enabled(); // Enable editing for module

		if (type != 0) {
			AH.select('#upload', 'show');
			AH.select('#upload', 'removeClass', 'h');
		}

		ucEssay.modeOn('');
	}

	const writable_props = ['xml', 'uxml', 'isReview', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<EssayPreview> was created with unknown prop '${key}'`);
	});

	function input_change_handler() {
		files = this.files;
		$$invalidate(2, files);
	}

	const change_handler = event => ucEssay.getUploads(files, event);

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(8, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(9, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(10, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		beforeUpdate,
		onMount,
		AH,
		XMLToJSON,
		onUserAnsChange,
		ItemHelper,
		sunEditor,
		plugins,
		EssayNewReact,
		xml,
		uxml,
		isReview,
		editorState,
		ucEssay,
		files,
		state,
		essay_class,
		eid,
		localEssayData,
		uAns,
		essayEditor,
		headingArray,
		addTabIndex,
		initEdit,
		setEssayContent,
		loadXML,
		updateAttrToLower,
		handleClick,
		setReview,
		unsetReview
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(8, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(9, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(10, editorState = $$props.editorState);
		if ('ucEssay' in $$props) $$invalidate(1, ucEssay = $$props.ucEssay);
		if ('files' in $$props) $$invalidate(2, files = $$props.files);
		if ('state' in $$props) state = $$props.state;
		if ('essay_class' in $$props) essay_class = $$props.essay_class;
		if ('eid' in $$props) $$invalidate(4, eid = $$props.eid);
		if ('localEssayData' in $$props) $$invalidate(3, localEssayData = $$props.localEssayData);
		if ('uAns' in $$props) uAns = $$props.uAns;
		if ('essayEditor' in $$props) essayEditor = $$props.essayEditor;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isReview*/ 1) {
			 essay_class = isReview ? "working_file h" : "working_file";
		}
	};

	return [
		isReview,
		ucEssay,
		files,
		localEssayData,
		eid,
		handleClick,
		setReview,
		unsetReview,
		xml,
		uxml,
		editorState,
		input_change_handler,
		change_handler
	];
}

class EssayPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 8,
				uxml: 9,
				isReview: 0,
				editorState: 10
			},
			add_css
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EssayPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[8] === undefined && !('xml' in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[9] === undefined && !('uxml' in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[10] === undefined && !('editorState' in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<EssayPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<EssayPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<EssayPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<EssayPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<EssayPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<EssayPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<EssayPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<EssayPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default EssayPreview;
//# sourceMappingURL=EssayPreview-358d0eb7.js.map
