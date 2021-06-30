
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, A as AH, L as beforeUpdate, X as XMLToJSON, _ as onUserAnsChange, E as is_function, c as create_component, f as space, h as text, j as attr_dev, k as add_location, l as set_style, $ as null_to_empty, m as mount_component, n as insert_dev, q as listen_dev, F as set_data_dev, t as transition_in, a as transition_out, b as destroy_component, x as detach_dev, H as run_all, C as validate_each_argument, z as empty, K as destroy_each, r as group_outros, u as check_outros, B as noop } from './main-59da555a.js';
import { I as ItemHelper } from './ItemHelper-d61166b5.js';
import { s as sunEditor, p as plugins } from './index-d6ddb623.js';

const essayUploadUrl = window.baseUrl+'reactUpload.php/';
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

/* clsSMEssay/EssayPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1 } = globals;
const file = "clsSMEssay/EssayPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-hdiuou-style";
	style.textContent = ".hero-unit.svelte-hdiuou.svelte-hdiuou{border:1px solid #ccc;width:84%;padding:18px!important;font-size:15px!important;margin-bottom:30px;font-weight:200;line-height:30px;color:inherit;background-color:#eeeeee;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px}.essay_upload_status.svelte-hdiuou.svelte-hdiuou{margin-top:10px}.abort.svelte-hdiuou.svelte-hdiuou{padding-left:15px;cursor:pointer}.essay-btn.svelte-hdiuou.svelte-hdiuou,#essayfile-button.svelte-hdiuou.svelte-hdiuou,#editfiles.svelte-hdiuou.svelte-hdiuou{display:inline-block;padding:4px 8px;font-size:12px;line-height:20px;text-align:center;vertical-align:middle;cursor:pointer;color:#333333;text-shadow:0 1px 1px rgba(255, 255, 255, 0.75);background-color:#f5f5f5;background-image:-moz-linear-gradient(top, #ffffff, #e6e6e6);background-image:-webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));background-image:-webkit-linear-gradient(top, #ffffff, #e6e6e6);background-image:-o-linear-gradient(top, #ffffff, #e6e6e6);background-image:linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0);border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);border:1px solid #cccccc;border-bottom-color:#b3b3b3;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);-moz-box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05)}#upload.svelte-hdiuou.svelte-hdiuou{font-family:'PT Sans Narrow', sans-serif;background-color:#E0E0E0;background-image:-webkit-linear-gradient(top, #E0E0E0, #E0E0E0);background-image:-moz-linear-gradient(top, #E0E0E0, #E0E0E0);background-image:linear-gradient(top, #E0E0E0, #E0E0E0);width:100%;padding:30px 30px 0;border-radius:3px;border-collapse:separate;border:1px solid rgb(204, 204, 204);margin-top:2px}#drop.svelte-hdiuou.svelte-hdiuou{background-color:#EEEEEE;padding:25px 30px;margin-bottom:30px;border:20px solid rgba(0, 0, 0, 0);border-radius:3px;text-align:center;font-size:16px;font-weight:bold;color:#7f858a;border:1px solid #CCCCCC}#drop.svelte-hdiuou a.svelte-hdiuou{padding:12px 5%;color:#2B2E31;font-size:14px;border-radius:2px;cursor:pointer;display:inline-block;margin-top:12px;margin-bottom:12px;line-height:1;text-decoration:none;position:relative;top:30px}#drop.svelte-hdiuou input.svelte-hdiuou{display:none}.essay-btn.svelte-hdiuou.svelte-hdiuou{margin-bottom:15px}.essay-container.svelte-hdiuou.svelte-hdiuou{width:89%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXNzYXlQcmV2aWV3LnN2ZWx0ZSIsInNvdXJjZXMiOlsiRXNzYXlQcmV2aWV3LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICAgIGltcG9ydCB7IGJlZm9yZVVwZGF0ZSwgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgICBpbXBvcnQge0FILCBYTUxUb0pTT04sIG9uVXNlckFuc0NoYW5nZX0gZnJvbSAnLi4vaGVscGVyL0hlbHBlckFJLnN2ZWx0ZSc7XG4gICAgaW1wb3J0IEl0ZW1IZWxwZXIgZnJvbSAnLi4vaGVscGVyL0l0ZW1IZWxwZXIuc3ZlbHRlJztcbiAgICBpbXBvcnQgc3VuRWRpdG9yIGZyb20gJ3N1bmVkaXRvcic7XG4gICAgaW1wb3J0IHBsdWdpbnMgZnJvbSAnc3VuRWRpdG9yL3NyYy9wbHVnaW5zJztcbiAgICBpbXBvcnQgRXNzYXlOZXdSZWFjdCBmcm9tICcuL2VhYXN5X25ld19yZWFjdC5qcyc7XG4gICAgaW1wb3J0ICcuLi9oZWxwZXIvc3VuRWRpdG9yL3NyYy9hc3NldHMvY3NzL3N1bmVkaXRvci5jc3MnO1xuXG4gICAgZXhwb3J0IGxldCB4bWw7XG4gICAgZXhwb3J0IGxldCB1eG1sO1xuICAgIGV4cG9ydCBsZXQgaXNSZXZpZXc7XG4gICAgZXhwb3J0IGxldCBlZGl0b3JTdGF0ZTtcbiAgICBsZXQgdWNFc3NheTtcbiAgICBsZXQgZmlsZXM7XG4gICAgbGV0IHN0YXRlID0ge1xuICAgICAgICB1c2VyYW5zOiAnJyxcbiAgICAgICAgYXBwUGF0aDogXCJcIixcbiAgICAgICAgZXNzYXlTdHI6ICcnLFxuICAgICAgICB1c2VyQW5zOiAnJyxcbiAgICAgICAgc2l0ZV91cmw6IFwiXCJcbiAgICB9O1xuICAgIGxldCBlc3NheV9jbGFzcyA9IFwid29ya2luZ19maWxlXCI7XG4gICAgbGV0IGVpZCA9IFwiZXNzYXlQcmV2aWV3Q29udGFpbmVyXCI7XG4gICAgbGV0IGxvY2FsRXNzYXlEYXRhID0ge307XG4gICAgbGV0IHVBbnMgPVwiXCI7XG4gICAgbGV0IGVzc2F5RWRpdG9yO1xuICAgIGNvbnN0IGhlYWRpbmdBcnJheSA9IFt7XCJmb250XCI6IFwiZm9udFNpemUgNlwiLFwidGV4dFwiOiBcIkhlYWRpbmcgMVwifSwge1wiZm9udFwiOiBcImZvbnRTaXplIDVcIixcInRleHRcIjogXCJIZWFkaW5nIDJcIn0sIHtcImZvbnRcIjogXCJmb250U2l6ZSA0XCIsXCJ0ZXh0XCI6IFwiSGVhZGluZyAzXCJ9LHtcImZvbnRcIjogXCJmb250U2l6ZSAzXCIsXCJ0ZXh0XCI6IFwiSGVhZGluZyA0XCJ9LHtcImZvbnRcIjogXCJmb250U2l6ZSAyXCIsXCJ0ZXh0XCI6IFwiSGVhZGluZyA1XCJ9LHtcImZvbnRcIjogXCJmb250U2l6ZSAxXCIsXCJ0ZXh0XCI6IFwiSGVhZGluZyA2XCJ9XTtcblxuICAgICQ6IGVzc2F5X2NsYXNzID0gaXNSZXZpZXcgPyBcIndvcmtpbmdfZmlsZSBoXCIgOiBcIndvcmtpbmdfZmlsZVwiO1xuXG4gICAgb25Nb3VudCgoKT0+IHtcbiAgICAgICAgZWRpdG9yU3RhdGUgJiYgQUguc2V0KGVkaXRvclN0YXRlLmNvbnRlbnRfdHlwZStcIl9yZWZyZXNoXCIsIHNldEVzc2F5Q29udGVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgbG9hZFhNTCh4bWwsIHV4bWwpO1xuICAgICAgICAvLyBJbnRpYWxpemUgZWRpdG9yIHBsdWdpblxuICAgICAgICBpbml0RWRpdCgpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaW5pdEVkaXQoKSB7XG4gICAgICAgIGVzc2F5RWRpdG9yID0gc3VuRWRpdG9yLmNyZWF0ZSgnZXNzYXlfZWRpdCcsIHsgXG4gICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXG4gICAgICAgICAgICB2YWx1ZTogdUFucyxcbiAgICAgICAgICAgIHdpZHRoOiAnYXV0bycsXG4gICAgICAgICAgICB0b29sYmFyQ29udGFpbmVyOlwiI2Vzc2F5UHJldmlld1Rvb2xiYXJcIixcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIldyaXRlIHRleHQgaGVyZS5cIixcbiAgICAgICAgICAgIHJlc2l6aW5nQmFyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dQYXRoTGFiZWw6IGZhbHNlLCAgICAgXG4gICAgICAgICAgICBwbHVnaW5zOnBsdWdpbnMsXG4gICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IFwicGFkZGluZy1sZWZ0OiAxMHB4XCIsXG4gICAgICAgICAgICBidXR0b25MaXN0OiBbXG4gICAgICAgICAgICAgICAgWydmb3JtYXRCbG9jayddLFxuICAgICAgICAgICAgICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJ10sXG4gICAgICAgICAgICAgICAgWydsaW5rJ10sXG4gICAgICAgICAgICAgICAgWydsaXN0JywgJ291dGRlbnQnLCAnaW5kZW50JywgJ2FsaWduJ10sXG4gICAgICAgICAgICAgICAgWydyZW1vdmVGb3JtYXQnXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZWxlbUlkID0gJyMnICsgZWlkO1xuICAgICAgICB1Y0Vzc2F5ID0gbmV3IEVzc2F5TmV3UmVhY3QoZWxlbUlkLCBlc3NheUVkaXRvcik7XG4gICAgICAgIC8vdWNFc3NheS5lc3NheV9yZWFkeSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldEVzc2F5Q29udGVudCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZXQgQ29udGVudFwiKVxuICAgICAgICBlc3NheUVkaXRvci5zZXRDb250ZW50cyh1QW5zKTtcbiAgICB9XG4gICAgICAgIFxuICAgIC8vIGl0IGlzIGNhbGxlZCB3aGVuIHN0YXRlIHVwZGF0ZWRcbiAgICBiZWZvcmVVcGRhdGUoKCk9PiB7XG4gICAgICAgIGlmICh4bWwgIT0gc3RhdGUueG1sKSB7XG4gICAgICAgICAgICBzdGF0ZS54bWwgPSB4bWwgO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGluZyBmcm9tIFByZXZpZXdcIik7XG4gICAgICAgICAgICBsb2FkWE1MKHhtbCwgdXhtbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAvLyBpdHMgZm9yIGxvYWRpbmcgdGhlIHhtbC5cbiAgICBmdW5jdGlvbiBsb2FkWE1MKGVzc2F5WE1MLCB1eG1sKSB7XG4gICAgICAgIGxldCBlc3NheVVzZXIgPSAodXhtbCkgPyBYTUxUb0pTT04odXhtbCkgOiBcIlwiO1xuICAgICAgICBlc3NheVhNTCA9IFhNTFRvSlNPTihlc3NheVhNTCk7XG4gICAgICAgLy8gdXNlcnhtbF9pc19lbXB0eSA9IHVwZGF0ZUF0dHJUb0xvd2VyKHVzZXJ4bWxfaXNfZW1wdHkpO1xuICAgICAgICAvLyBpZih1c2VyeG1sX2lzX2VtcHR5KSB7XG4gICAgICAgIC8vICAgICBpZighdXNlcnhtbF9pc19lbXB0eS5zbWFucykge1xuICAgICAgICAvLyAgICAgICAgIHVheG1sID0gXCJcIjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBQYXJzaW5nIFhNTHNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBlc3NheSA9IGVzc2F5WE1MLnNteG1sLmRlZmF1bHQgPyBlc3NheVhNTC5zbXhtbC5kZWZhdWx0IDogZXNzYXlYTUwuc214bWw7XG4gICAgICAgICAgICB1QW5zID0gZXNzYXlVc2VyICYmIChlc3NheVVzZXIuc21hbnMudXNlcmFucykuY2hhckNvZGVBdCgwKSE9MTAgPyBlc3NheVVzZXIuc21hbnMudXNlcmFucyA6IChlc3NheS5fX2NkYXRhICE9PSB1bmRlZmluZWQgPyBlc3NheS5fX2NkYXRhIDogJycpO1xuICAgICAgICAgICAgLy9zZWxmLnVzZXJBbnNYTUwgPSAkKCcjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWwnKS52YWwoKTtcbiAgICAgICAgICAgIGxvY2FsRXNzYXlEYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXJhbnM6IHVBbnMsXG4gICAgICAgICAgICAgICAgZmlsZXR5cGVleHRzOiBlc3NheS5fZmlsZXR5cGVleHRzLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBlc3NheS5fbGltaXQsXG4gICAgICAgICAgICAgICAgdHlwZTogZXNzYXkuX3R5cGUgPT0gXCI1XCIgPyBcIjBcIiA6IGVzc2F5Ll90eXBlLFxuICAgICAgICAgICAgICAgIHVwbG9hZDogZXNzYXlVc2VyID8gZXNzYXlVc2VyLnNtYW5zLnVwbG9hZCA6IFwiXCIsXG4gICAgICAgICAgICAgICAgcGF0aDogZXNzYXlVc2VyID8gZXNzYXlVc2VyLnNtYW5zLnBhdGggOiBcIlwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coe2Vycm9yLCBmdW5jOidsb2FkWG1sJywgZmlsZTonRXNzYXlQcmV2aWV3LnN2ZWx0ZSd9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBpdHMgdXBkYXRlIGF0dHJpYnV0ZXMgb2YgdXNlciBhbnN3ZXIgeG1sIHRvIGxvd2VyY2FzZS5cbiAgICBmdW5jdGlvbiB1cGRhdGVBdHRyVG9Mb3dlcihkYXRhKSB7XG4gICAgICAgIGxldCBpc0xvd2VyID0gZmFsc2U7XG4gICAgICAgIGlmKGRhdGEuU01BTlMpIHtcbiAgICAgICAgICAgIGRhdGEuc21hbnMgPSBkYXRhLlNNQU5TO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGEuU01BTlM7XG4gICAgICAgICAgICBpc0xvd2VyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgXG4gICAgLy8gY2FsbHMgb24gY2xpY2sgb2YgYWJvcnRcbiAgICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XG4gICAgICAgIHVjRXNzYXkucmVtb3ZlX2ZpbGUoZS5jdXJyZW50VGFyZ2V0LCAnIycgKyBlaWQpO1xuICAgIH1cblxuICAgIC8vIGNhbGxzIHdoZW4gcmV2aWV3IG1vZGUgaXMgb25cbiAgICBmdW5jdGlvbiBzZXRSZXZpZXcoKSB7XG4gICAgICAgIGlzUmV2aWV3ID0gdHJ1ZTtcbiAgICAgICAgZXNzYXlFZGl0b3IuZGlzYWJsZWQoKTsgLy8gRGlzYWJsZSBlZGl0aW5nIGZvciBtb2R1bGVcbiAgICAgICAgdWNFc3NheS5tb2RlT24oXCJvblwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gY2FsbHMgd2hlbiByZXZpZXcgbW9kZSBpcyBvZmYgYWZ0ZXIgb25cbiAgICBmdW5jdGlvbiB1bnNldFJldmlldyh0eXBlKSB7XG4gICAgICAgIGlzUmV2aWV3ID0gZmFsc2U7XG4gICAgICAgIGVzc2F5RWRpdG9yLmVuYWJsZWQoKTsgLy8gRW5hYmxlIGVkaXRpbmcgZm9yIG1vZHVsZVxuICAgICAgICBpZiAodHlwZSAhPSAwKSB7XG4gICAgICAgICAgICBBSC5zZWxlY3QoJyN1cGxvYWQnLCAnc2hvdycpO1xuICAgICAgICAgICAgQUguc2VsZWN0KCcjdXBsb2FkJywgJ3JlbW92ZUNsYXNzJywgJ2gnKTtcbiAgICAgICAgfVxuICAgICAgICB1Y0Vzc2F5Lm1vZGVPbignJyk7XG4gICAgfVxuPC9zY3JpcHQ+XG48bWFpbj5cbiAgICA8cCBpZCA9XCJkZW1vXCI+PC9wPlxuICAgIDxkaXY+XG4gICAgICAgIHsjaWYgbG9jYWxFc3NheURhdGEgfVxuICAgICAgICAgICAgPEl0ZW1IZWxwZXIgXG4gICAgICAgICAgICAgICAgb246c2V0UmV2aWV3ID0ge3NldFJldmlld31cbiAgICAgICAgICAgICAgICBvbjp1bnNldFJldmlldyA9IHt1bnNldFJldmlldy5iaW5kKHRoaXMsIGxvY2FsRXNzYXlEYXRhLnR5cGUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICAgICAgaWQ9e2VpZH0gXG4gICAgICAgICAgICAgICAgZGF0YS1maWxldHlwZWV4dHM9e2xvY2FsRXNzYXlEYXRhLmZpbGV0eXBlZXh0c30gXG4gICAgICAgICAgICAgICAgZGF0YS1saW1pdD17bG9jYWxFc3NheURhdGEubGltaXR9IFxuICAgICAgICAgICAgICAgIGNsYXNzPVwiZXNzYXktY29udGFpbmVyIG0tYXV0byBoZXJvLXVuaXRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJlc3NheVByZXZpZXdUb29sYmFyXCIgY2xhc3M9XCJzdW4tZWRpdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiZXNzYXlfZWRpdFwiIGNsYXNzPVwidGV4dC1sZWZ0IGVkaXRvciBzdW4tZWRpdG9yLWVkaXRhYmxlXCIgPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInVwbG9hZFwiIGNsYXNzPXt3aW5kb3cuaXNSZXZpZXcgPT0gdHJ1ZSB8fCBpc1JldmlldyA9PSB0cnVlIHx8IGxvY2FsRXNzYXlEYXRhLnR5cGUgPT0gXCIwXCIgPyBcImhcIiA6IFwiXCJ9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZHJvcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgRHJhZyAmIERyb3AgRmlsZXMgSGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCIgc3R5bGU9XCJmb250LXNpemU6IDEycHg7Zm9udC13ZWlnaHQ6IG5vcm1hbDtwb3NpdGlvbjpyZWxhdGl2ZTt0b3A6NDVweDsgd29yZC13cmFwOmJyZWFrLXdvcmRcIj5Zb3UgY2FuIHVwbG9hZCB1cHRvIHtsb2NhbEVzc2F5RGF0YS5saW1pdH0ge2xvY2FsRXNzYXlEYXRhLmZpbGV0eXBlZXh0c30gZmlsZXMuPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3VwbFwiIGNsYXNzPVwiZXNzYXktYnRuIGJ0biBidG4tbGlnaHQgZGFya2dyZXlfYm9yZGVyXCI+QnJvd3NlPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cInVwbFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6ZmlsZXMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246Y2hhbmdlPXsoZXZlbnQpPT4gdWNFc3NheS5nZXRVcGxvYWRzKGZpbGVzLCBldmVudCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ1cGxcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZT1cIm11bHRpcGxlXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJvcGFjaXR5OjAuNVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9e2xvY2FsRXNzYXlEYXRhLnR5cGUgPT0gXCIwXCIgPyBcImVzc2F5X3VwbG9hZF9zdGF0dXMgdGV4dC1sZWZ0IGhcIiA6IFwiZXNzYXlfdXBsb2FkX3N0YXR1cyB0ZXh0LWxlZnQgd29ya2luZ19maWxlXCIgfSBzdHlsZT1cImxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcIj5cbiAgICAgICAgICAgICAgICAgICAgeyNpZiBsb2NhbEVzc2F5RGF0YS51cGxvYWQgIT0gJycgfVxuICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIGxvY2FsRXNzYXlEYXRhLnVwbG9hZC5zcGxpdCgnLCcpIGFzIHVwbG9hZGVkLCBpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJ3b3JraW5nXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZG93bmxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIHRhcmdldD1cIl9ibGFua3NcIiBocmVmPXtsb2NhbEVzc2F5RGF0YS5wYXRoICsgdXBsb2FkZWR9IHRpdGxlPSdEb3dubG9hZCBGaWxlJyBjbGFzcz1cImVzc2F5X2R3bF9maWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29tb29uLWZpbGUtZG93bmxvYWRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmaWxlbmFtZVwiPnt1cGxvYWRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgIWlzUmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhYm9ydFwiIG9uOmNsaWNrPXtoYW5kbGVDbGlja30+YWJvcnQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICAgICAgICAgICAgey9pZn1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey9pZn1cbiAgICA8L2Rpdj5cbjwvbWFpbj5cbjxzdHlsZT5cbiAgICAuaGVyby11bml0IHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICAgICAgd2lkdGg6IDg0JTtcbiAgICAgICAgcGFkZGluZzogMThweCFpbXBvcnRhbnQ7XG4gICAgICAgIGZvbnQtc2l6ZTogMTVweCFpbXBvcnRhbnQ7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiAyMDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAzMHB4O1xuICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2VlZWVlZTtcbiAgICAgICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgIC1tb3otYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgfVxuICAgIC5lc3NheV91cGxvYWRfc3RhdHVzIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB9XG4gICAgLmFib3J0IHtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiAxNXB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuICAgIC5lc3NheS1idG4sICNlc3NheWZpbGUtYnV0dG9uLCAjZWRpdGZpbGVzLCAuZXNzYXktYnRuLWFkZCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGNvbG9yOiAjMzMzMzMzO1xuICAgICAgICB0ZXh0LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43NSk7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwgI2ZmZmZmZiwgI2U2ZTZlNik7XG4gICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCAwIDAsIDAgMTAwJSwgZnJvbSgjZmZmZmZmKSwgdG8oI2U2ZTZlNikpO1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICNmZmZmZmYsICNlNmU2ZTYpO1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCAjZmZmZmZmLCAjZTZlNmU2KTtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgI2ZmZmZmZiwgI2U2ZTZlNik7XG4gICAgICAgIGJhY2tncm91bmQtcmVwZWF0OiByZXBlYXQteDtcbiAgICAgICAgZmlsdGVyOiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuZ3JhZGllbnQoc3RhcnRDb2xvcnN0cj0nI2ZmZmZmZmZmJywgZW5kQ29sb3JzdHI9JyNmZmU2ZTZlNicsIEdyYWRpZW50VHlwZT0wKTtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjZTZlNmU2ICNlNmU2ZTYgI2JmYmZiZjtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSkgcmdiYSgwLCAwLCAwLCAwLjEpIHJnYmEoMCwgMCwgMCwgMC4yNSk7XG4gICAgICAgIGZpbHRlcjogcHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LmdyYWRpZW50KGVuYWJsZWQgPSBmYWxzZSk7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2NjY2M7XG4gICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICNiM2IzYjM7XG4gICAgICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAtbW96LWJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwuMiksIDAgMXB4IDJweCByZ2JhKDAsMCwwLC4wNSk7XG4gICAgICAgIC1tb3otYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LC4yKSwgMCAxcHggMnB4IHJnYmEoMCwwLDAsLjA1KTtcbiAgICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LC4yKSwgMCAxcHggMnB4IHJnYmEoMCwwLDAsLjA1KTtcbiAgICB9XG4gICAgI3VwbG9hZCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiAnUFQgU2FucyBOYXJyb3cnLCBzYW5zLXNlcmlmO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRTBFMEUwO1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICNFMEUwRTAsICNFMEUwRTApO1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNFMEUwRTAsICNFMEUwRTApO1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG9wLCAjRTBFMEUwLCAjRTBFMEUwKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIC8qIHBhZGRpbmc6IDMwcHg7ICovXG4gICAgICAgIHBhZGRpbmc6IDMwcHggMzBweCAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICAgIGJvcmRlci1jb2xsYXBzZTogc2VwYXJhdGU7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyMDQsIDIwNCwgMjA0KTtcbiAgICAgICAgbWFyZ2luLXRvcDogMnB4O1xuICAgIH1cbiAgICAjZHJvcCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNFRUVFRUU7XG4gICAgICAgIHBhZGRpbmc6IDI1cHggMzBweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcbiAgICAgICAgYm9yZGVyOiAyMHB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMCk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICBjb2xvcjogIzdmODU4YTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI0NDQ0NDQztcbiAgICB9XG4gICAgLyogLmNhbl91cGxvYWQge1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiAxMDA7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgdG9wOiA0NXB4O1xuICAgICAgICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xuICAgIH0gKi9cbiAgICAjZHJvcCBhIHtcbiAgICAgICAgLyogYmFja2dyb3VuZC1jb2xvcjogIzAwN2E5NjsgKi9cbiAgICAgICAgcGFkZGluZzogMTJweCA1JTtcbiAgICAgICAgY29sb3I6ICMyQjJFMzE7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgbWFyZ2luLXRvcDogMTJweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICB0b3A6IDMwcHg7XG4gICAgfVxuICAgICNkcm9wIGlucHV0IHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgLmRyb3Bkb3duLWl0ZW0ge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgICAgICBjbGVhcjogYm90aDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgY29sb3I6ICMyMTI1Mjk7XG4gICAgICAgIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBib3JkZXI6IDA7XG4gICAgfVxuICAgIC5lc3NheS1idG4ge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuICAgIH1cbiAgICAuZXNzYXktY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDg5JTtcbiAgICB9XG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrTUksVUFBVSw0QkFBQyxDQUFDLEFBQ1IsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUN0QixLQUFLLENBQUUsR0FBRyxDQUNWLE9BQU8sQ0FBRSxJQUFJLFVBQVUsQ0FDdkIsU0FBUyxDQUFFLElBQUksVUFBVSxDQUN6QixhQUFhLENBQUUsSUFBSSxDQUNuQixXQUFXLENBQUUsR0FBRyxDQUNoQixXQUFXLENBQUUsSUFBSSxDQUNqQixLQUFLLENBQUUsT0FBTyxDQUNkLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIscUJBQXFCLENBQUUsR0FBRyxDQUMxQixrQkFBa0IsQ0FBRSxHQUFHLENBQ3ZCLGFBQWEsQ0FBRSxHQUFHLEFBQ3RCLENBQUMsQUFDRCxvQkFBb0IsNEJBQUMsQ0FBQyxBQUNsQixVQUFVLENBQUUsSUFBSSxBQUNwQixDQUFDLEFBQ0QsTUFBTSw0QkFBQyxDQUFDLEFBQ0osWUFBWSxDQUFFLElBQUksQ0FDbEIsTUFBTSxDQUFFLE9BQU8sQUFDbkIsQ0FBQyxBQUNELHNDQUFVLENBQUUsNkNBQWlCLENBQUUsVUFBVSw0QkFBaUIsQ0FBQyxBQUN2RCxPQUFPLENBQUUsWUFBWSxDQUNyQixPQUFPLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FDaEIsU0FBUyxDQUFFLElBQUksQ0FDZixXQUFXLENBQUUsSUFBSSxDQUNqQixVQUFVLENBQUUsTUFBTSxDQUNsQixjQUFjLENBQUUsTUFBTSxDQUN0QixNQUFNLENBQUUsT0FBTyxDQUNmLEtBQUss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 */";
	append_dev(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	child_ctx[23] = i;
	return child_ctx;
}

// (143:8) {#if localEssayData }
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

	let if_block = /*localEssayData*/ ctx[3].upload != "" && create_if_block_1(ctx);

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
			t3 = text("Drag & Drop Files Here\n                        ");
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
			add_location(div0, file, 153, 16, 5167);
			attr_dev(textarea, "id", "essay_edit");
			attr_dev(textarea, "class", "text-left editor sun-editor-editable");
			add_location(textarea, file, 154, 16, 5239);
			attr_dev(div1, "class", "text-center");
			set_style(div1, "font-size", "12px");
			set_style(div1, "font-weight", "normal");
			set_style(div1, "position", "relative");
			set_style(div1, "top", "45px");
			set_style(div1, "word-wrap", "break-word");
			add_location(div1, file, 158, 24, 5557);
			attr_dev(a, "href", "#upl");
			attr_dev(a, "class", "essay-btn btn btn-light darkgrey_border svelte-hdiuou");
			add_location(a, file, 159, 24, 5785);
			attr_dev(input, "type", "file");
			attr_dev(input, "name", "upl");
			attr_dev(input, "id", "upl");
			input.multiple = "multiple";
			set_style(input, "opacity", "0.5");
			attr_dev(input, "class", "svelte-hdiuou");
			add_location(input, file, 160, 24, 5883);
			attr_dev(div2, "id", "drop");
			attr_dev(div2, "class", "svelte-hdiuou");
			add_location(div2, file, 156, 20, 5470);
			attr_dev(div3, "id", "upload");

			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(window.isReview == true || /*isReview*/ ctx[0] == true || /*localEssayData*/ ctx[3].type == "0"
			? "h"
			: "") + " svelte-hdiuou"));

			add_location(div3, file, 155, 16, 5339);

			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(/*localEssayData*/ ctx[3].type == "0"
			? "essay_upload_status text-left h"
			: "essay_upload_status text-left working_file") + " svelte-hdiuou"));

			set_style(ul, "list-style-type", "none");
			add_location(ul, file, 171, 16, 6323);
			attr_dev(div4, "id", /*eid*/ ctx[4]);
			attr_dev(div4, "data-filetypeexts", div4_data_filetypeexts_value = /*localEssayData*/ ctx[3].filetypeexts);
			attr_dev(div4, "data-limit", div4_data_limit_value = /*localEssayData*/ ctx[3].limit);
			attr_dev(div4, "class", "essay-container m-auto hero-unit svelte-hdiuou");
			add_location(div4, file, 147, 12, 4932);
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
			: "") + " svelte-hdiuou"))) {
				attr_dev(div3, "class", div3_class_value);
			}

			if (/*localEssayData*/ ctx[3].upload != "") {
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
			: "essay_upload_status text-left working_file") + " svelte-hdiuou"))) {
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
		source: "(143:8) {#if localEssayData }",
		ctx
	});

	return block;
}

// (173:20) {#if localEssayData.upload != '' }
function create_if_block_1(ctx) {
	let each_1_anchor;
	let each_value = /*localEssayData*/ ctx[3].upload.split(",");
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
				each_value = /*localEssayData*/ ctx[3].upload.split(",");
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
		source: "(173:20) {#if localEssayData.upload != '' }",
		ctx
	});

	return block;
}

// (182:32) {#if !isReview}
function create_if_block_2(ctx) {
	let span;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			span.textContent = "abort";
			attr_dev(span, "class", "abort svelte-hdiuou");
			add_location(span, file, 182, 36, 7178);
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
		source: "(182:32) {#if !isReview}",
		ctx
	});

	return block;
}

// (174:24) {#each localEssayData.upload.split(',') as uploaded, index}
function create_each_block(ctx) {
	let li;
	let span0;
	let a;
	let i;
	let a_href_value;
	let t0;
	let span1;
	let t1_value = /*uploaded*/ ctx[21] + "";
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
			add_location(i, file, 177, 40, 6902);
			attr_dev(a, "target", "_blanks");
			attr_dev(a, "href", a_href_value = /*localEssayData*/ ctx[3].path + /*uploaded*/ ctx[21]);
			attr_dev(a, "title", "Download File");
			attr_dev(a, "class", "essay_dwl_file svelte-hdiuou");
			add_location(a, file, 176, 36, 6758);
			attr_dev(span0, "class", "download");
			add_location(span0, file, 175, 32, 6698);
			attr_dev(span1, "class", "filename");
			add_location(span1, file, 180, 32, 7053);
			attr_dev(li, "class", "working");
			add_location(li, file, 174, 28, 6645);
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
			if (dirty & /*localEssayData*/ 8 && a_href_value !== (a_href_value = /*localEssayData*/ ctx[3].path + /*uploaded*/ ctx[21])) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*localEssayData*/ 8 && t1_value !== (t1_value = /*uploaded*/ ctx[21] + "")) set_data_dev(t1, t1_value);

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
		source: "(174:24) {#each localEssayData.upload.split(',') as uploaded, index}",
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
			add_location(p, file, 140, 4, 4699);
			add_location(div, file, 141, 4, 4722);
			add_location(main, file, 139, 0, 4688);
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
	validate_slots("EssayPreview", slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let { editorState } = $$props;
	let ucEssay;
	let files;

	let state = {
		userans: "",
		appPath: "",
		essayStr: "",
		userAns: "",
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
	});

	function initEdit() {
		essayEditor = sunEditor.create("essay_edit", {
			height: "300px",
			value: uAns,
			width: "auto",
			toolbarContainer: "#essayPreviewToolbar",
			placeholder: "Write text here.",
			resizingBar: false,
			showPathLabel: false,
			plugins,
			fontSize: 10,
			defaultStyle: "padding-left: 10px",
			buttonList: [
				["formatBlock"],
				["bold", "italic", "underline"],
				["link"],
				["list", "outdent", "indent", "align"],
				["removeFormat"]
			]
		});

		let elemId = "#" + eid;
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
			: essay.__cdata !== undefined ? essay.__cdata : "";

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
				func: "loadXml",
				file: "EssayPreview.svelte"
			});
		}
	}

	// calls on click of abort
	function handleClick(e) {
		ucEssay.remove_file(e.currentTarget, "#" + eid);
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
			AH.select("#upload", "show");
			AH.select("#upload", "removeClass", "h");
		}

		ucEssay.modeOn("");
	}

	const writable_props = ["xml", "uxml", "isReview", "editorState"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<EssayPreview> was created with unknown prop '${key}'`);
	});

	function input_change_handler() {
		files = this.files;
		$$invalidate(2, files);
	}

	const change_handler = event => ucEssay.getUploads(files, event);

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(8, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(9, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("editorState" in $$props) $$invalidate(10, editorState = $$props.editorState);
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
		initEdit,
		setEssayContent,
		loadXML,
		updateAttrToLower,
		handleClick,
		setReview,
		unsetReview
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(8, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(9, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("editorState" in $$props) $$invalidate(10, editorState = $$props.editorState);
		if ("ucEssay" in $$props) $$invalidate(1, ucEssay = $$props.ucEssay);
		if ("files" in $$props) $$invalidate(2, files = $$props.files);
		if ("state" in $$props) state = $$props.state;
		if ("essay_class" in $$props) essay_class = $$props.essay_class;
		if ("eid" in $$props) $$invalidate(4, eid = $$props.eid);
		if ("localEssayData" in $$props) $$invalidate(3, localEssayData = $$props.localEssayData);
		if ("uAns" in $$props) uAns = $$props.uAns;
		if ("essayEditor" in $$props) essayEditor = $$props.essayEditor;
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
		if (!document.getElementById("svelte-hdiuou-style")) add_css();

		init(this, options, instance, create_fragment, safe_not_equal, {
			xml: 8,
			uxml: 9,
			isReview: 0,
			editorState: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EssayPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[8] === undefined && !("xml" in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[9] === undefined && !("uxml" in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[10] === undefined && !("editorState" in props)) {
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
//# sourceMappingURL=EssayPreview-9e214d00.js.map
