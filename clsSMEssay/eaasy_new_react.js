

const essayUploadUrl = window.baseUrl+'reactUpload.php/';
import JUI from '../src/libs/javscript_helper/JUI.js';
let editor;
export default class EssayNewReact extends JUI {
    constructor(eid, essayEditor) {
        super();
        this.timer = {};
        this.eid = eid;
        this.essay_ready(eid, essayEditor);
    }

    // getting the essay module ready
    essay_ready(eid, essayEditor) {
        let filePath;
        let eidNode = document.querySelector(eid);
        editor = essayEditor;
        setTimeout(()=> {
            this.bind('#drop a', 'click', (event)=> {
                this.find(event.target.parentNode, 'input').click();
            });

            // it initialize the knob plugin listen for clicks on the cancel icon. 
            
            //SUNEDITOR.create(this.find(eid, '#essay_edit'), { toolbarSelector: '[data-role=editor2-toolbar]' });
            this.selectAll('[data-role=magic-overlay]').forEach(function(_this) {
                var overlay = _this,
                    target = _this.dataset['target'];
                // overlay.offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
            });

            essayEditor.onChange = (contents, core)=> {
                this.updateXML(eid, 200, contents);
            }
            essayEditor.onKeyDown = (e, core)=> {
                if (e.keyCode == 86 || e.keyCode == 67) {
                    this.updateXML(eid, 200, e.target.innerHTM);
                }
            }

            let ua = window.navigator.userAgent;
            let ms_old_ie = ua.indexOf('MSIE ');
            let ms_new_ie = ua.indexOf('Trident/');
            this.listen(eidNode, 'click', 'a.essay_dwl_file', (_this)=> {
                if ((ms_old_ie > -1) || (ms_new_ie > -1)) {
                    var path = _this.getAttribute('href');
                    _this.removeAttribute('href');
                    window.open(path);
                    setTimeout(()=> { this.select('a.essay_dwl_file').setAttribute('href', path) }, 500);
                }
                setTimeout(()=> { this.select('#center').remove(); }, 500);
            });
        }, 500);
    }

    // for getting path of the s3
    getPath() {
        let path = ""
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
        console.log(uploadURL)
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
