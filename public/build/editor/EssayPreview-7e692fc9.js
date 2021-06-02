
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, A as AH, L as beforeUpdate, X as XMLToJSON, E as is_function, c as create_component, f as space, h as text, j as attr_dev, k as add_location, l as set_style, $ as null_to_empty, m as mount_component, n as insert_dev, q as listen_dev, F as set_data_dev, t as transition_in, a as transition_out, b as destroy_component, x as detach_dev, H as run_all, C as validate_each_argument, z as empty, K as destroy_each, r as group_outros, u as check_outros, B as noop } from './main-0211720b.js';
import { I as ItemHelper } from './ItemHelper-179e801c.js';
import { s as sunEditor, p as plugins } from './index-505408c6.js';

const essayUploadUrl = window.baseUrl+'reactUpload.php/'; // UCINFO.ITEM_THEME_URL+"controller/v2/" + 'Upload.php/';
let editor;
class EssayNewReact extends JUI {
    constructor(eid, essayEditor) {
        super();
        //this.labBinded = true;
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
                //console.log("Essay Editor on changed", contents);
                this.updateXML(eid, 200, contents);
            };
            essayEditor.onKeyDown = (e, core)=> {
                //console.log("Essay Editor on key down", e.target.innerHTML);
                if (e.keyCode == 86 || e.keyCode == 67) {
                    this.updateXML(eid, 200, e.target.innerHTM);
                }
            };

            // setTimeout(()=> {
            //     this.listenAll(eidNode.querySelectorAll('a, button, input'), "click keyup keydown", ()=> {
            //         this.updateXML(eid);
            //     });

            // }, 300);

            //this.updateXML(eid);

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
        setTimeout(()=> {
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
            this.select('#special_module_user_xml').value = userAnsXML;
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
	style.textContent = ".hero-unit.svelte-hdiuou.svelte-hdiuou{border:1px solid #ccc;width:84%;padding:18px!important;font-size:15px!important;margin-bottom:30px;font-weight:200;line-height:30px;color:inherit;background-color:#eeeeee;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px}.essay_upload_status.svelte-hdiuou.svelte-hdiuou{margin-top:10px}.abort.svelte-hdiuou.svelte-hdiuou{padding-left:15px;cursor:pointer}.essay-btn.svelte-hdiuou.svelte-hdiuou,#essayfile-button.svelte-hdiuou.svelte-hdiuou,#editfiles.svelte-hdiuou.svelte-hdiuou{display:inline-block;padding:4px 8px;font-size:12px;line-height:20px;text-align:center;vertical-align:middle;cursor:pointer;color:#333333;text-shadow:0 1px 1px rgba(255, 255, 255, 0.75);background-color:#f5f5f5;background-image:-moz-linear-gradient(top, #ffffff, #e6e6e6);background-image:-webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));background-image:-webkit-linear-gradient(top, #ffffff, #e6e6e6);background-image:-o-linear-gradient(top, #ffffff, #e6e6e6);background-image:linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0);border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);border:1px solid #cccccc;border-bottom-color:#b3b3b3;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);-moz-box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05)}#upload.svelte-hdiuou.svelte-hdiuou{font-family:'PT Sans Narrow', sans-serif;background-color:#E0E0E0;background-image:-webkit-linear-gradient(top, #E0E0E0, #E0E0E0);background-image:-moz-linear-gradient(top, #E0E0E0, #E0E0E0);background-image:linear-gradient(top, #E0E0E0, #E0E0E0);width:100%;padding:30px 30px 0;border-radius:3px;border-collapse:separate;border:1px solid rgb(204, 204, 204);margin-top:2px}#drop.svelte-hdiuou.svelte-hdiuou{background-color:#EEEEEE;padding:25px 30px;margin-bottom:30px;border:20px solid rgba(0, 0, 0, 0);border-radius:3px;text-align:center;font-size:16px;font-weight:bold;color:#7f858a;border:1px solid #CCCCCC}#drop.svelte-hdiuou a.svelte-hdiuou{padding:12px 5%;color:#2B2E31;font-size:14px;border-radius:2px;cursor:pointer;display:inline-block;margin-top:12px;margin-bottom:12px;line-height:1;text-decoration:none;position:relative;top:30px}#drop.svelte-hdiuou input.svelte-hdiuou{display:none}.essay-btn.svelte-hdiuou.svelte-hdiuou{margin-bottom:15px}.essay-container.svelte-hdiuou.svelte-hdiuou{width:89%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXNzYXlQcmV2aWV3LnN2ZWx0ZSIsInNvdXJjZXMiOlsiRXNzYXlQcmV2aWV3LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICAgIGltcG9ydCB7IGJlZm9yZVVwZGF0ZSwgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgICBpbXBvcnQge0FILCBYTUxUb0pTT059IGZyb20gJy4uL2hlbHBlci9IZWxwZXJBSS5zdmVsdGUnO1xuICAgIGltcG9ydCBJdGVtSGVscGVyIGZyb20gJy4uL2hlbHBlci9JdGVtSGVscGVyLnN2ZWx0ZSc7XG4gICAgaW1wb3J0IHN1bkVkaXRvciBmcm9tICdzdW5lZGl0b3InO1xuICAgIGltcG9ydCBwbHVnaW5zIGZyb20gJ3N1bkVkaXRvci9zcmMvcGx1Z2lucyc7XG4gICAgaW1wb3J0IEVzc2F5TmV3UmVhY3QgZnJvbSAnLi9lYWFzeV9uZXdfcmVhY3QuanMnO1xuXG4gICAgZXhwb3J0IGxldCB4bWw7XG4gICAgZXhwb3J0IGxldCB1YXhtbDtcbiAgICBleHBvcnQgbGV0IGlzUmV2aWV3O1xuICAgIGV4cG9ydCBsZXQgZWRpdG9yU3RhdGU7XG4gICAgbGV0IHVjRXNzYXk7XG4gICAgbGV0IGZpbGVzO1xuICAgIGxldCBzdGF0ZSA9IHtcbiAgICAgICAgdXNlcmFuczogJycsXG4gICAgICAgIGFwcFBhdGg6IFwiXCIsXG4gICAgICAgIGVzc2F5U3RyOiAnJyxcbiAgICAgICAgdXNlckFuczogJycsXG4gICAgICAgIHNpdGVfdXJsOiBcIlwiXG4gICAgfTtcbiAgICBsZXQgZXNzYXlfY2xhc3MgPSBcIndvcmtpbmdfZmlsZVwiO1xuICAgIGxldCBlaWQgPSBcImVzc2F5UHJldmlld0NvbnRhaW5lclwiO1xuICAgIGxldCBsb2NhbEVzc2F5RGF0YSA9IHt9O1xuICAgIGxldCB1QW5zID1cIlwiO1xuICAgIGxldCBlc3NheUVkaXRvcjtcbiAgICBjb25zdCBoZWFkaW5nQXJyYXkgPSBbe1wiZm9udFwiOiBcImZvbnRTaXplIDZcIixcInRleHRcIjogXCJIZWFkaW5nIDFcIn0sIHtcImZvbnRcIjogXCJmb250U2l6ZSA1XCIsXCJ0ZXh0XCI6IFwiSGVhZGluZyAyXCJ9LCB7XCJmb250XCI6IFwiZm9udFNpemUgNFwiLFwidGV4dFwiOiBcIkhlYWRpbmcgM1wifSx7XCJmb250XCI6IFwiZm9udFNpemUgM1wiLFwidGV4dFwiOiBcIkhlYWRpbmcgNFwifSx7XCJmb250XCI6IFwiZm9udFNpemUgMlwiLFwidGV4dFwiOiBcIkhlYWRpbmcgNVwifSx7XCJmb250XCI6IFwiZm9udFNpemUgMVwiLFwidGV4dFwiOiBcIkhlYWRpbmcgNlwifV07XG5cbiAgICAkOiBlc3NheV9jbGFzcyA9IGlzUmV2aWV3ID8gXCJ3b3JraW5nX2ZpbGUgaFwiIDogXCJ3b3JraW5nX2ZpbGVcIjtcblxuICAgIG9uTW91bnQoKCk9PiB7XG4gICAgICAgIGVkaXRvclN0YXRlICYmIEFILnNldChlZGl0b3JTdGF0ZS5jb250ZW50X3R5cGUrXCJfcmVmcmVzaFwiLCBzZXRFc3NheUNvbnRlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIGxvYWRYTUwoeG1sLCB1YXhtbCk7XG4gICAgICAgIC8vIEludGlhbGl6ZSBlZGl0b3IgcGx1Z2luXG4gICAgICAgIGluaXRFZGl0KCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBpbml0RWRpdCgpIHtcbiAgICAgICAgZXNzYXlFZGl0b3IgPSBzdW5FZGl0b3IuY3JlYXRlKCdlc3NheV9lZGl0JywgeyBcbiAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgICAgIHZhbHVlOiB1QW5zLFxuICAgICAgICAgICAgd2lkdGg6ICdhdXRvJyxcbiAgICAgICAgICAgIHRvb2xiYXJDb250YWluZXI6XCIjZXNzYXlQcmV2aWV3VG9vbGJhclwiLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiV3JpdGUgdGV4dCBoZXJlLlwiLFxuICAgICAgICAgICAgcmVzaXppbmdCYXI6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd1BhdGhMYWJlbDogZmFsc2UsICAgICBcbiAgICAgICAgICAgIHBsdWdpbnM6cGx1Z2lucyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZTogXCJwYWRkaW5nLWxlZnQ6IDEwcHhcIixcbiAgICAgICAgICAgIGJ1dHRvbkxpc3Q6IFtcbiAgICAgICAgICAgICAgICBbJ2Zvcm1hdEJsb2NrJ10sXG4gICAgICAgICAgICAgICAgWydib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnXSxcbiAgICAgICAgICAgICAgICBbJ2xpc3QnLCAnb3V0ZGVudCcsICdpbmRlbnQnLCAnYWxpZ24nXSxcbiAgICAgICAgICAgICAgICBbJ3JlbW92ZUZvcm1hdCddLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBlbGVtSWQgPSAnIycgKyBlaWQ7XG4gICAgICAgIHVjRXNzYXkgPSBuZXcgRXNzYXlOZXdSZWFjdChlbGVtSWQsIGVzc2F5RWRpdG9yKTtcbiAgICAgICAgLy91Y0Vzc2F5LmVzc2F5X3JlYWR5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0RXNzYXlDb250ZW50KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNldCBDb250ZW50XCIpXG4gICAgICAgIGVzc2F5RWRpdG9yLnNldENvbnRlbnRzKHVBbnMpO1xuICAgIH1cbiAgICAgICAgXG4gICAgLy8gaXQgaXMgY2FsbGVkIHdoZW4gc3RhdGUgdXBkYXRlZFxuICAgIGJlZm9yZVVwZGF0ZSgoKT0+IHtcbiAgICAgICAgaWYgKHhtbCAhPSBzdGF0ZS54bWwpIHtcbiAgICAgICAgICAgIHN0YXRlLnhtbCA9IHhtbCA7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nIGZyb20gUHJldmlld1wiKTtcbiAgICAgICAgICAgIGxvYWRYTUwoeG1sLCB1YXhtbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAvLyBpdHMgZm9yIGxvYWRpbmcgdGhlIHhtbC5cbiAgICBmdW5jdGlvbiBsb2FkWE1MKGVzc2F5WE1MLCB1YXhtbCkge1xuICAgICAgICBsZXQgZXNzYXlVc2VyID0gKHVheG1sKSA/IFhNTFRvSlNPTih1YXhtbCkgOiBcIlwiO1xuICAgICAgICBlc3NheVhNTCA9IFhNTFRvSlNPTihlc3NheVhNTCk7XG4gICAgICAgLy8gdXNlcnhtbF9pc19lbXB0eSA9IHVwZGF0ZUF0dHJUb0xvd2VyKHVzZXJ4bWxfaXNfZW1wdHkpO1xuICAgICAgICAvLyBpZih1c2VyeG1sX2lzX2VtcHR5KSB7XG4gICAgICAgIC8vICAgICBpZighdXNlcnhtbF9pc19lbXB0eS5zbWFucykge1xuICAgICAgICAvLyAgICAgICAgIHVheG1sID0gXCJcIjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBQYXJzaW5nIFhNTHNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBlc3NheSA9IGVzc2F5WE1MLnNteG1sLmRlZmF1bHQgPyBlc3NheVhNTC5zbXhtbC5kZWZhdWx0IDogZXNzYXlYTUwuc214bWw7XG4gICAgICAgICAgICB1QW5zID0gZXNzYXlVc2VyICYmIChlc3NheVVzZXIuc21hbnMudXNlcmFucykuY2hhckNvZGVBdCgwKSE9MTAgPyBlc3NheVVzZXIuc21hbnMudXNlcmFucyA6IChlc3NheS5fX2NkYXRhICE9PSB1bmRlZmluZWQgPyBlc3NheS5fX2NkYXRhIDogJycpO1xuICAgICAgICAgICAgLy9zZWxmLnVzZXJBbnNYTUwgPSAkKCcjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWwnKS52YWwoKTtcbiAgICAgICAgICAgIGxvY2FsRXNzYXlEYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXJhbnM6IHVBbnMsXG4gICAgICAgICAgICAgICAgZmlsZXR5cGVleHRzOiBlc3NheS5fZmlsZXR5cGVleHRzLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBlc3NheS5fbGltaXQsXG4gICAgICAgICAgICAgICAgdHlwZTogZXNzYXkuX3R5cGUgPT0gXCI1XCIgPyBcIjBcIiA6IGVzc2F5Ll90eXBlLFxuICAgICAgICAgICAgICAgIHVwbG9hZDogZXNzYXlVc2VyID8gZXNzYXlVc2VyLnNtYW5zLnVwbG9hZCA6IFwiXCIsXG4gICAgICAgICAgICAgICAgcGF0aDogZXNzYXlVc2VyID8gZXNzYXlVc2VyLnNtYW5zLnBhdGggOiBcIlwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coe2Vycm9yLCBmdW5jOidsb2FkWG1sJywgZmlsZTonRXNzYXlQcmV2aWV3LnN2ZWx0ZSd9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBpdHMgdXBkYXRlIGF0dHJpYnV0ZXMgb2YgdXNlciBhbnN3ZXIgeG1sIHRvIGxvd2VyY2FzZS5cbiAgICBmdW5jdGlvbiB1cGRhdGVBdHRyVG9Mb3dlcihkYXRhKSB7XG4gICAgICAgIGxldCBpc0xvd2VyID0gZmFsc2U7XG4gICAgICAgIGlmKGRhdGEuU01BTlMpIHtcbiAgICAgICAgICAgIGRhdGEuc21hbnMgPSBkYXRhLlNNQU5TO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGEuU01BTlM7XG4gICAgICAgICAgICBpc0xvd2VyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgXG4gICAgLy8gY2FsbHMgb24gY2xpY2sgb2YgYWJvcnRcbiAgICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XG4gICAgICAgIHVjRXNzYXkucmVtb3ZlX2ZpbGUoZS5jdXJyZW50VGFyZ2V0LCAnIycgKyBlaWQpO1xuICAgIH1cblxuICAgIC8vIGNhbGxzIHdoZW4gcmV2aWV3IG1vZGUgaXMgb25cbiAgICBmdW5jdGlvbiBzZXRSZXZpZXcoKSB7XG4gICAgICAgIGlzUmV2aWV3ID0gdHJ1ZTtcbiAgICAgICAgZXNzYXlFZGl0b3IuZGlzYWJsZWQoKTsgLy8gRGlzYWJsZSBlZGl0aW5nIGZvciBtb2R1bGVcbiAgICAgICAgdWNFc3NheS5tb2RlT24oXCJvblwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gY2FsbHMgd2hlbiByZXZpZXcgbW9kZSBpcyBvZmYgYWZ0ZXIgb25cbiAgICBmdW5jdGlvbiB1bnNldFJldmlldyh0eXBlKSB7XG4gICAgICAgIGlzUmV2aWV3ID0gZmFsc2U7XG4gICAgICAgIGVzc2F5RWRpdG9yLmVuYWJsZWQoKTsgLy8gRW5hYmxlIGVkaXRpbmcgZm9yIG1vZHVsZVxuICAgICAgICBpZiAodHlwZSAhPSAwKSB7XG4gICAgICAgICAgICBBSC5zZWxlY3QoJyN1cGxvYWQnLCAnc2hvdycpO1xuICAgICAgICAgICAgQUguc2VsZWN0KCcjdXBsb2FkJywgJ3JlbW92ZUNsYXNzJywgJ2gnKTtcbiAgICAgICAgfVxuICAgICAgICB1Y0Vzc2F5Lm1vZGVPbignJyk7XG4gICAgfVxuPC9zY3JpcHQ+XG48c3ZlbHRlOmhlYWQ+XG4gICAgPGxpbmsgaHJlZj1cInt3aW5kb3cuYmFzZVVybFRoZW1lIHx8IHdpbmRvdy5iYXNlVGhlbWVVUkx9cGUtaXRlbXMvc3ZlbHRlL2hlbHBlci9zdW5FZGl0b3Ivc3JjL2Fzc2V0cy9jc3Mvc3VuZWRpdG9yLmNzc1wiIHJlbD1cInN0eWxlc2hlZXRcIiAvPlxuPC9zdmVsdGU6aGVhZD5cbjxtYWluPlxuICAgIDxwIGlkID1cImRlbW9cIj48L3A+XG4gICAgPGRpdj5cbiAgICAgICAgeyNpZiBsb2NhbEVzc2F5RGF0YSB9XG4gICAgICAgICAgICA8SXRlbUhlbHBlciBcbiAgICAgICAgICAgICAgICBvbjpzZXRSZXZpZXcgPSB7c2V0UmV2aWV3fVxuICAgICAgICAgICAgICAgIG9uOnVuc2V0UmV2aWV3ID0ge3Vuc2V0UmV2aWV3LmJpbmQodGhpcywgbG9jYWxFc3NheURhdGEudHlwZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICBpZD17ZWlkfSBcbiAgICAgICAgICAgICAgICBkYXRhLWZpbGV0eXBlZXh0cz17bG9jYWxFc3NheURhdGEuZmlsZXR5cGVleHRzfSBcbiAgICAgICAgICAgICAgICBkYXRhLWxpbWl0PXtsb2NhbEVzc2F5RGF0YS5saW1pdH0gXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJlc3NheS1jb250YWluZXIgbS1hdXRvIGhlcm8tdW5pdFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImVzc2F5UHJldmlld1Rvb2xiYXJcIiBjbGFzcz1cInN1bi1lZGl0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJlc3NheV9lZGl0XCIgY2xhc3M9XCJ0ZXh0LWxlZnQgZWRpdG9yIHN1bi1lZGl0b3ItZWRpdGFibGVcIiA+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidXBsb2FkXCIgY2xhc3M9e3dpbmRvdy5pc1JldmlldyA9PSB0cnVlIHx8IGlzUmV2aWV3ID09IHRydWUgfHwgbG9jYWxFc3NheURhdGEudHlwZSA9PSBcIjBcIiA/IFwiaFwiIDogXCJcIn0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkcm9wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBEcmFnICYgRHJvcCBGaWxlcyBIZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIiBzdHlsZT1cImZvbnQtc2l6ZTogMTJweDtmb250LXdlaWdodDogbm9ybWFsO3Bvc2l0aW9uOnJlbGF0aXZlO3RvcDo0NXB4OyB3b3JkLXdyYXA6YnJlYWstd29yZFwiPllvdSBjYW4gdXBsb2FkIHVwdG8ge2xvY2FsRXNzYXlEYXRhLmxpbWl0fSB7bG9jYWxFc3NheURhdGEuZmlsZXR5cGVleHRzfSBmaWxlcy48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjdXBsXCIgY2xhc3M9XCJlc3NheS1idG4gYnRuIGJ0bi1saWdodCBkYXJrZ3JleV9ib3JkZXJcIj5Ccm93c2U8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwidXBsXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDpmaWxlcyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjpjaGFuZ2U9eyhldmVudCk9PiB1Y0Vzc2F5LmdldFVwbG9hZHMoZmlsZXMsIGV2ZW50KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInVwbFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlPVwibXVsdGlwbGVcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIm9wYWNpdHk6MC41XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz17bG9jYWxFc3NheURhdGEudHlwZSA9PSBcIjBcIiA/IFwiZXNzYXlfdXBsb2FkX3N0YXR1cyB0ZXh0LWxlZnQgaFwiIDogXCJlc3NheV91cGxvYWRfc3RhdHVzIHRleHQtbGVmdCB3b3JraW5nX2ZpbGVcIiB9IHN0eWxlPVwibGlzdC1zdHlsZS10eXBlOiBub25lO1wiPlxuICAgICAgICAgICAgICAgICAgICB7I2lmIGxvY2FsRXNzYXlEYXRhLnVwbG9hZCAhPSAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIHsjZWFjaCBsb2NhbEVzc2F5RGF0YS51cGxvYWQuc3BsaXQoJywnKSBhcyB1cGxvYWRlZCwgaW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwid29ya2luZ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRvd25sb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSB0YXJnZXQ9XCJfYmxhbmtzXCIgaHJlZj17bG9jYWxFc3NheURhdGEucGF0aCArIHVwbG9hZGVkfSB0aXRsZT0nRG93bmxvYWQgRmlsZScgY2xhc3M9XCJlc3NheV9kd2xfZmlsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbW9vbi1maWxlLWRvd25sb2FkXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmlsZW5hbWVcIj57dXBsb2FkZWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmICFpc1Jldmlld31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYWJvcnRcIiBvbjpjbGljaz17aGFuZGxlQ2xpY2t9PmFib3J0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvaWZ9XG4gICAgPC9kaXY+XG48L21haW4+XG48c3R5bGU+XG4gICAgLmhlcm8tdW5pdCB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gICAgICAgIHdpZHRoOiA4NCU7XG4gICAgICAgIHBhZGRpbmc6IDE4cHghaW1wb3J0YW50O1xuICAgICAgICBmb250LXNpemU6IDE1cHghaW1wb3J0YW50O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xuICAgICAgICBmb250LXdlaWdodDogMjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMzBweDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZWVlZWU7XG4gICAgICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgICAtbW96LWJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgIH1cbiAgICAuZXNzYXlfdXBsb2FkX3N0YXR1cyB7XG4gICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgfVxuICAgIC5hYm9ydCB7XG4gICAgICAgIHBhZGRpbmctbGVmdDogMTVweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgICAuZXNzYXktYnRuLCAjZXNzYXlmaWxlLWJ1dHRvbiwgI2VkaXRmaWxlcywgLmVzc2F5LWJ0bi1hZGQge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBjb2xvcjogIzMzMzMzMztcbiAgICAgICAgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNmZmZmZmYsICNlNmU2ZTYpO1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgMCAwLCAwIDEwMCUsIGZyb20oI2ZmZmZmZiksIHRvKCNlNmU2ZTYpKTtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjZmZmZmZmLCAjZTZlNmU2KTtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgI2ZmZmZmZiwgI2U2ZTZlNik7XG4gICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICNmZmZmZmYsICNlNmU2ZTYpO1xuICAgICAgICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0LXg7XG4gICAgICAgIGZpbHRlcjogcHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LmdyYWRpZW50KHN0YXJ0Q29sb3JzdHI9JyNmZmZmZmZmZicsIGVuZENvbG9yc3RyPScjZmZlNmU2ZTYnLCBHcmFkaWVudFR5cGU9MCk7XG4gICAgICAgIGJvcmRlci1jb2xvcjogI2U2ZTZlNiAjZTZlNmU2ICNiZmJmYmY7XG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpIHJnYmEoMCwgMCwgMCwgMC4xKSByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuICAgICAgICBmaWx0ZXI6IHByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5ncmFkaWVudChlbmFibGVkID0gZmFsc2UpO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjY2NjO1xuICAgICAgICBib3JkZXItYm90dG9tLWNvbG9yOiAjYjNiM2IzO1xuICAgICAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgLW1vei1ib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsLjIpLCAwIDFweCAycHggcmdiYSgwLDAsMCwuMDUpO1xuICAgICAgICAtbW96LWJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwuMiksIDAgMXB4IDJweCByZ2JhKDAsMCwwLC4wNSk7XG4gICAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwuMiksIDAgMXB4IDJweCByZ2JhKDAsMCwwLC4wNSk7XG4gICAgfVxuICAgICN1cGxvYWQge1xuICAgICAgICBmb250LWZhbWlseTogJ1BUIFNhbnMgTmFycm93Jywgc2Fucy1zZXJpZjtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI0UwRTBFMDtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjRTBFMEUwLCAjRTBFMEUwKTtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogLW1vei1saW5lYXItZ3JhZGllbnQodG9wLCAjRTBFMEUwLCAjRTBFMEUwKTtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvcCwgI0UwRTBFMCwgI0UwRTBFMCk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAvKiBwYWRkaW5nOiAzMHB4OyAqL1xuICAgICAgICBwYWRkaW5nOiAzMHB4IDMwcHggMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA0LCAyMDQsIDIwNCk7XG4gICAgICAgIG1hcmdpbi10b3A6IDJweDtcbiAgICB9XG4gICAgI2Ryb3Age1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRUVFRUVFO1xuICAgICAgICBwYWRkaW5nOiAyNXB4IDMwcHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XG4gICAgICAgIGJvcmRlcjogMjBweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDApO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgY29sb3I6ICM3Zjg1OGE7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNDQ0NDQ0M7XG4gICAgfVxuICAgIC8qIC5jYW5fdXBsb2FkIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogMTAwO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHRvcDogNDVweDtcbiAgICAgICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcbiAgICB9ICovXG4gICAgI2Ryb3AgYSB7XG4gICAgICAgIC8qIGJhY2tncm91bmQtY29sb3I6ICMwMDdhOTY7ICovXG4gICAgICAgIHBhZGRpbmc6IDEycHggNSU7XG4gICAgICAgIGNvbG9yOiAjMkIyRTMxO1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIG1hcmdpbi10b3A6IDEycHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgdG9wOiAzMHB4O1xuICAgIH1cbiAgICAjZHJvcCBpbnB1dCB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICAgIC5kcm9wZG93bi1pdGVtIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgY2xlYXI6IGJvdGg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgIGNvbG9yOiAjMjEyNTI5O1xuICAgICAgICB0ZXh0LWFsaWduOiBpbmhlcml0O1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgYm9yZGVyOiAwO1xuICAgIH1cbiAgICAuZXNzYXktYnRuIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTVweDtcbiAgICB9XG4gICAgLmVzc2F5LWNvbnRhaW5lciB7XG4gICAgICAgIHdpZHRoOiA4OSU7XG4gICAgfVxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbU1JLFVBQVUsNEJBQUMsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDdEIsS0FBSyxDQUFFLEdBQUcsQ0FDVixPQUFPLENBQUUsSUFBSSxVQUFVLENBQ3ZCLFNBQVMsQ0FBRSxJQUFJLFVBQVUsQ0FDekIsYUFBYSxDQUFFLElBQUksQ0FDbkIsV0FBVyxDQUFFLEdBQUcsQ0FDaEIsV0FBVyxDQUFFLElBQUksQ0FDakIsS0FBSyxDQUFFLE9BQU8sQ0FDZCxnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLHFCQUFxQixDQUFFLEdBQUcsQ0FDMUIsa0JBQWtCLENBQUUsR0FBRyxDQUN2QixhQUFhLENBQUUsR0FBRyxBQUN0QixDQUFDLEFBQ0Qsb0JBQW9CLDRCQUFDLENBQUMsQUFDbEIsVUFBVSxDQUFFLElBQUksQUFDcEIsQ0FBQyxBQUNELE1BQU0sNEJBQUMsQ0FBQyxBQUNKLFlBQVksQ0FBRSxJQUFJLENBQ2xCLE1BQU0sQ0FBRSxPQUFPLEFBQ25CLENBQUMsQUFDRCxzQ0FBVSxDQUFFLDZDQUFpQixDQUFFLFVBQVUsNEJBQWlCLENBQUMsQUFDdkQsT0FBTyxDQUFFLFlBQVksQ0FDckIsT0FBTyxDQUFFLEdBQUcsQ0FBQyxHQUFHLENBQ2hCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLElB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 */";
	append_dev(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	child_ctx[23] = i;
	return child_ctx;
}

// (144:8) {#if localEssayData }
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
			add_location(div0, file, 154, 16, 5239);
			attr_dev(textarea, "id", "essay_edit");
			attr_dev(textarea, "class", "text-left editor sun-editor-editable");
			add_location(textarea, file, 155, 16, 5311);
			attr_dev(div1, "class", "text-center");
			set_style(div1, "font-size", "12px");
			set_style(div1, "font-weight", "normal");
			set_style(div1, "position", "relative");
			set_style(div1, "top", "45px");
			set_style(div1, "word-wrap", "break-word");
			add_location(div1, file, 159, 24, 5629);
			attr_dev(a, "href", "#upl");
			attr_dev(a, "class", "essay-btn btn btn-light darkgrey_border svelte-hdiuou");
			add_location(a, file, 160, 24, 5857);
			attr_dev(input, "type", "file");
			attr_dev(input, "name", "upl");
			attr_dev(input, "id", "upl");
			input.multiple = "multiple";
			set_style(input, "opacity", "0.5");
			attr_dev(input, "class", "svelte-hdiuou");
			add_location(input, file, 161, 24, 5955);
			attr_dev(div2, "id", "drop");
			attr_dev(div2, "class", "svelte-hdiuou");
			add_location(div2, file, 157, 20, 5542);
			attr_dev(div3, "id", "upload");

			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(window.isReview == true || /*isReview*/ ctx[0] == true || /*localEssayData*/ ctx[3].type == "0"
			? "h"
			: "") + " svelte-hdiuou"));

			add_location(div3, file, 156, 16, 5411);

			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(/*localEssayData*/ ctx[3].type == "0"
			? "essay_upload_status text-left h"
			: "essay_upload_status text-left working_file") + " svelte-hdiuou"));

			set_style(ul, "list-style-type", "none");
			add_location(ul, file, 172, 16, 6395);
			attr_dev(div4, "id", /*eid*/ ctx[4]);
			attr_dev(div4, "data-filetypeexts", div4_data_filetypeexts_value = /*localEssayData*/ ctx[3].filetypeexts);
			attr_dev(div4, "data-limit", div4_data_limit_value = /*localEssayData*/ ctx[3].limit);
			attr_dev(div4, "class", "essay-container m-auto hero-unit svelte-hdiuou");
			add_location(div4, file, 148, 12, 5004);
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
		source: "(144:8) {#if localEssayData }",
		ctx
	});

	return block;
}

// (174:20) {#if localEssayData.upload != ''}
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
		source: "(174:20) {#if localEssayData.upload != ''}",
		ctx
	});

	return block;
}

// (183:32) {#if !isReview}
function create_if_block_2(ctx) {
	let span;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			span.textContent = "abort";
			attr_dev(span, "class", "abort svelte-hdiuou");
			add_location(span, file, 183, 36, 7249);
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
		source: "(183:32) {#if !isReview}",
		ctx
	});

	return block;
}

// (175:24) {#each localEssayData.upload.split(',') as uploaded, index}
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
			add_location(i, file, 178, 40, 6973);
			attr_dev(a, "target", "_blanks");
			attr_dev(a, "href", a_href_value = /*localEssayData*/ ctx[3].path + /*uploaded*/ ctx[21]);
			attr_dev(a, "title", "Download File");
			attr_dev(a, "class", "essay_dwl_file svelte-hdiuou");
			add_location(a, file, 177, 36, 6829);
			attr_dev(span0, "class", "download");
			add_location(span0, file, 176, 32, 6769);
			attr_dev(span1, "class", "filename");
			add_location(span1, file, 181, 32, 7124);
			attr_dev(li, "class", "working");
			add_location(li, file, 175, 28, 6716);
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
		source: "(175:24) {#each localEssayData.upload.split(',') as uploaded, index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let link;
	let link_href_value;
	let t0;
	let main;
	let p;
	let t1;
	let div;
	let current;
	let if_block = /*localEssayData*/ ctx[3] && create_if_block(ctx);

	const block = {
		c: function create() {
			link = element("link");
			t0 = space();
			main = element("main");
			p = element("p");
			t1 = space();
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(link, "href", link_href_value = "" + ((window.baseUrlTheme || window.baseThemeURL) + "pe-items/svelte/helper/sunEditor/src/assets/css/suneditor.css"));
			attr_dev(link, "rel", "stylesheet");
			add_location(link, file, 138, 4, 4606);
			attr_dev(p, "id", "demo");
			add_location(p, file, 141, 4, 4771);
			add_location(div, file, 142, 4, 4794);
			add_location(main, file, 140, 0, 4760);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			append_dev(document.head, link);
			insert_dev(target, t0, anchor);
			insert_dev(target, main, anchor);
			append_dev(main, p);
			append_dev(main, t1);
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
			detach_dev(link);
			if (detaching) detach_dev(t0);
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
	let { uaxml } = $$props;
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
		loadXML(xml, uaxml);

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
			loadXML(xml, uaxml);
		}
	});

	// its for loading the xml.
	function loadXML(essayXML, uaxml) {
		let essayUser = uaxml ? XMLToJSON(uaxml) : "";
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

	const writable_props = ["xml", "uaxml", "isReview", "editorState"];

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
		if ("uaxml" in $$props) $$invalidate(9, uaxml = $$props.uaxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("editorState" in $$props) $$invalidate(10, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		beforeUpdate,
		onMount,
		AH,
		XMLToJSON,
		ItemHelper,
		sunEditor,
		plugins,
		EssayNewReact,
		xml,
		uaxml,
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
		if ("uaxml" in $$props) $$invalidate(9, uaxml = $$props.uaxml);
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
		uaxml,
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
			uaxml: 9,
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

		if (/*uaxml*/ ctx[9] === undefined && !("uaxml" in props)) {
			console_1.warn("<EssayPreview> was created without expected prop 'uaxml'");
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

	get uaxml() {
		throw new Error("<EssayPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uaxml(value) {
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
//# sourceMappingURL=EssayPreview-7e692fc9.js.map
