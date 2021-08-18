<script>
    import { onMount } from "svelte";
    import { AH } from "../../helper/HelperAI.svelte";

    // for the configurations
    export let default_media_configuration = {
            file_type: 'image/*', // required parameter, for file type by default it will be image/*
            file_ext: 'png,gif,jpg,jpeg,svg', // required parameter, for file extension by default it will be png,gif,jpg,jpeg,svg
            max_file_allowed: 4, // no of files allowed at a time for uploading, by default its value is 4 if there is no limit for the no of files uploading set its value to "no-limit"
            file_size: 3, // file size in MB
            set_name: false, // Set directly files name to the textbox, by default it will be false
            select_multiple_media: false, // if it is true multiple media can be selected, by default it will be false it will only work in when autoload="true" & is_author: "0"
            append_in: 'body', // in which element, tag or class the data will append if not given then its default value will be body and will append in body
            auto_load: true, // for auto loading of script by default it will be true
            review_media_dialog: true, // for review media dialog visibility by default it will be true
            is_author: 0, // 0 when only uploading fucntionality needed that is no gallery needed.
        };
    let is_react = 1;
    let upload_field_id = "";
    const MEDIA_URL = '//s3.amazonaws.com/jigyaasa_content_static/';
    let thumbnail_data = [];
    let uploaded_file = '';
    let uploaded_file_mceu = '';
    let manual_item_id = '#authoring-modal #base-bgimg, #MatchlistImg, #backgroundImage, #img, #drag-image';
    const media_array = {
        'pdf': 'pdf_000nsM.png',
        'mp3': 'mp3_000nsm.png',
        'xlsx': 'excel_sheet_000nsl.png',
        'xls': 'excel_sheet_000nsl.png',
        'ppt': 'ptt_image_000nsL.jpg',
        'pptx': 'ptt_image_000nsL.jpg',
        'zip': 'zip-file-format-489644_000nsn.png',
        'other': 'doc_icon_000nsN.png',
    };

    let html = '';
    let files;
    let mediaData = {};
    let media_variable = {
        first_time_msg: 1,
        video_count: 0,
        ajax_count: 0,
        upload_ajax_count: 0,
        upload_success_ajax_count: 0,
    }
    let media_information_modal;
    let media_upload_modal;

    onMount(()=> {
        init();
        if (window.AI) {
            window.AI.editorModal = setImage;
            window.setImage = setImage;
        }
    })

    // $("body").off('click','.embed').on("click", ".embed", function() {
	// 		debugger
	// 		$("#embed_code").val('<img src="'+ $(this).attr("data-image")+'"/>').select();
	// 	});

    AH.listen("body",'click','.embed',function(_this){
        console.log(_this);
        AH.select('#embed_code').value = _this.getAttribute('data-image');
    })

    // for setting the default configuration
    function setConfiguration() {
        // set the configuration in local variable 
        if (window.default_media_configuration != undefined) {
            default_media_configuration = window.default_media_configuration;
        }

        // if autoload is not given then set the value of auto load to true by default
        if (default_media_configuration.auto_load == undefined) {
            default_media_configuration.auto_load = true;
        }

        // if review_media_dialog is not given then set its value to true by default
        if (default_media_configuration.review_media_dialog == undefined) {
            default_media_configuration.review_media_dialog = true;
        }

        // if max_file_allowed is not given then 4 will be set by default
        if (default_media_configuration.max_file_allowed == undefined) {
            default_media_configuration.max_file_allowed = 4;
        }

        // set is_author value 0 if it is not given
        if (default_media_configuration.is_author == undefined) {
            default_media_configuration.is_author = 0;
        }

        // by default append in the body
        if (default_media_configuration.append_in == undefined) {
            default_media_configuration.append_in = 'body';
        }

        // if file size is not given the 3MB will set by default
        if (default_media_configuration.file_size == undefined) {
            default_media_configuration.file_size = 3;
        }

        // by default set_name will set to false if not given
        if (default_media_configuration.set_name == undefined) {
            default_media_configuration.set_name = false;
        }

        // by default select_multiple_media will set to false if not given
        if (default_media_configuration.select_multiple_media == undefined) {
            default_media_configuration.select_multiple_media = false;
        }

        // if file_type or file_ext is not given then by default this value will be set
        if (default_media_configuration.file_ext == undefined || default_media_configuration.file_type == undefined) {
            default_media_configuration.file_type = 'image/*';
            default_media_configuration.file_ext = 'png,gif,jpg,jpeg,svg';
        }

    }

    // for initiation the media plugin
    function init() {
        setConfiguration();
        mediaData.start_date = new Date('%d-%b-%y');
        mediaData.end_date = new Date('%d-%b-%y');
        if (default_media_configuration.auto_load) {
            if (default_media_configuration.is_editor) {
                // call in smeditor
                //window.mediaHtml =  this.getHtml;
            } else {
                //getHtml(1);
            }
        } else {
            refresh();
        }
        
        //Get modal Refrences.
        media_upload_modal = AH.getBS("#modal-media-upload", 'Modal');
        media_information_modal = AH.getBS("#media_information", 'Modal', {
            backdrop: 'static',
            keyboard: false
        });
        AH.addTagViewCss();
        AH.listen(document,'click', '.gridViewImg', (_this, event)=> {
            showGallary(_this);
            return false;
        })
    }

    // function getHtml(isLoader) {
    //     AH.ajax({
    //         url: baseUrl + "media_modal_box/index.php",
    //         data: default_media_configuration,
    //         onStart: function() {
    //             isLoader && activate(2);
    //         },
    //     }).then((data)=> {
    //         html = data;
    //         refresh();
    //         isLoader && activate(0);
    //     });
    // }

    // responsible for adding the scripts into head
    function mergingScript(url) {
        let imported = document.createElement('script');
        imported.src = baseUrlTheme + url;
        AH.insert('.modal_plugin', imported, 'afterend');
    }

    // add the media plugin and neccesary script into the dom
    function refresh() {
        AH.select('.modal_plugin').remove?.();
        //AH.insert(default_media_configuration.append_in, '<div class="modal_plugin">' + html + '</div>', 'afterend');
        getLibraryFiles();
        bindUpEvents();
        console.log("Media Initiallize");
    }

    // set the imagae name if called by media.setImage same as window.AI.editorModal
    export function setImage(action, file) {
        if (action != 0) {
            media_upload_modal.show?.();
            upload_field_id = action;
        } else if (document.getElementById(upload_field_id)) {
            document.getElementById(upload_field_id).value = file;
            AH.trigger(document.getElementById(upload_field_id), 'change');
        } else {
            try {
                window.frames['authoringFrame'].document.getElementById(upload_field_id).value = file;
                AH.trigger(window.frames['authoringFrame'].document.getElementById(upload_field_id), 'change');
            } catch (error) {
                console.log(error);
            }
        }
    }

    /** Some common drag & drop events used for the media plugin */
    function bindUpEvents() {
        let obj = document.getElementById("dragandrophandler");
        
        AH.listen(document, 'dragenter', '#dragandrophandler', function(_this, e) {
            e.stopPropagation();
            e.preventDefault();
            _this.style.border =  '2px doted #92AAB0';
        });
        AH.listen(document, 'dragover', '#dragandrophandler', function(_this, e) {
            e.stopPropagation();
            e.preventDefault();
        });
        AH.listen(document, 'drop', '#dragandrophandler', function(_this, event) {
            _this.style.border = '2px dotted #0B85A1';
            event.preventDefault();
            thumbnail_data = [];
            let dragged_files = event.originalEvent.dataTransfer.files;
            window.files = dragged_files;
            if (validateConfig(dragged_files)) {
                if (default_media_configuration.review_media_dialog) {
                    handleFileSelect(event);
                    var media_timeout = setTimeout(function() {
                        fetchFileData(dragged_files);
                        clearTimeout(media_timeout);
                    }, 100);
                } else {
                    uploadFiles(dragged_files);
                }
            }
        });
        AH.listen(document, 'dragenter', '.upload_containter', function(_this, e) {
            e.stopPropagation();
            e.preventDefault();
        });
        AH.listen(document, 'dragover', '.upload_containter', function(_this, e) {
            e.stopPropagation();
            e.preventDefault();
            obj.css('border', '2px dotted #0B85A1');
        });
        AH.listen(document, 'drop', '.upload_containter', function(_this, e) {
            e.stopPropagation();
            e.preventDefault();
        });
        AH.listen(document).on('click', '#blueimp-gallery .description', function(_this, e) {
            if (e.target.id == 'description') {
                if (AH.select('.description-table').visible) {
                    AH.select('.description-table').classList.add('h')
                } else {
                    AH.select('.description-table').classList.remove('h');
                }
            }
        });
        AH.listen(document, 'click', '.media_info_cancel', function(_this) {
            thumbnail_data = [];
            media_information_modal.hide();
        });
        AH.listen(document, 'change', '#fileUploadSelector', function(_this, event) {
            var choosed_file = event.target.files;
            window.files = choosed_file;
            if (validateConfig(choosed_file)) {
                if (default_media_configuration.review_media_dialog) {
                    showmsg('Processing Media', "", 1);
                    handleFileSelect(event);
                    var media_timeout = setTimeout(function() {
                        fetchFileData(choosed_file);
                        clearTimeout(media_timeout);
                    }, 100);
                } else {
                    uploadFiles(choosed_file);
                }
            }
        });
    
        // for epub condition
        if (default_media_configuration.is_epub == 1) {
            AH.listen(document, 'click', '#fileUploadSelector', function(_this, event) {
                var accepted_type = '';
                if (AH.select('.modal-body a[data-bs-toggle="tab"].active ').getAttribute('href') == '#LO_merge') {
                    accepted_type = '.html,.xhtml,.xml,.dita';
                    default_media_configuration.file_ext = 'html,xhtml,xml,dita';
                } else {
                    accepted_type = 'image/*';
                    default_media_configuration.file_ext = 'png,gif,jpg,jpeg,svg';
                }
                AH.select("#fileUploadSelector").setAttribute('accept', accepted_type);
                default_media_configuration.file_type = accepted_type;
            });
        }
    
        AH.listen(document, 'keyup', '.fileinput-button', function(_this, event) {
            if (event.keyCode == 13) {
                AH.trigger('#fileUploadSelector','click');
            }
        });
    
        AH.listen(document, 'keyup keydown','.media_loader_activate', function(_this, event) {
            if (event.keyCode == 9) {
                event.preventDefault();
            }
        });
    
        AH.listen(document.body, 'shown.bs.modal', '#modal-media-upload', function() {
            AH.select('.fileinput-button').focus();
        });
    
        AH.listen(document.body, "hidden.bs.modal", '#modal-media-upload', function () {
            AH.trigger('#tab1', 'click');
        });
    
        AH.listen(document.body, 'click', '.upload_containter #tab2', function() {
            if (AH.selectAll('#media_list', 'empty').length > 0 || AH.findChild('#media_list', '.no_media_found')) {
                getMedia();
            }
        });
        
        AH.listen(document.body, 'click', '.upload_containter #tab1', function() {
            AH.activate(0);
        });
        
        AH.listen(document.body, 'focus', '.bootstrap-tagsinput input', function(_this) {
            _this.parentElement.classList.add('focus');
        });
        AH.listen(document.body, 'blur', '.bootstrap-tagsinput input', function(_this) {
            _this.parentElement.classList.remove('focus');
        });    
    }

    function onCancelMediaInfo() {
        AH.select("#fileUploadSelector", 'value', '');
    }

    function mediaInfoSubmit(event) {
        var is_blank = 0;
        AH.selectAll('[require="1"]').forEach(function(elem) {
            if (elem.value == '') {
                return is_blank = 1;
            }
        });
        if (is_blank == 0) {
            for (let index = 0; index < files.length; index++) {
                if (document.getElementById('image_file'+index) != null) {
                    var width = document.getElementById('image_file'+index).naturalWidth;
                    var height = document.getElementById('image_file'+index).naturalHeight;
                    AH.select('[ data-dimension="'+index+'"]').value = width +"*"+height;
                }
                
                AH.selectAll("[data-index='" + index + "']").forEach(function(element, value) {
                    var key = element.getAttribute('data-key');
                    files[index][key] = element.value;
                });
            }
            uploadFiles(files);
            thumbnail_data = [];
        } else {
            AH.showmsg?.("Please enter all the fields!");
        }
    }

    function onUploadMedia(event) {
        event.preventDefault();
        thumbnail_data = [];
        //let dragged_files = event.originalEvent.dataTransfer.files;
        window.files = files;
        if (validateConfig(files)) {
            if (default_media_configuration.review_media_dialog) {
                handleFileSelect(event);
                var media_timeout = setTimeout(function() {
                    fetchFileData(files);
                    clearTimeout(media_timeout);
                }, 100);
            } else {
                uploadFiles(files);
            }
        }
    }

    // for validation the configuration
    function validateConfig(files) {
        if (files.length == 0) {
            return 0;
        }
        let is_error = 0;
        let error_msg = '';
        if (default_media_configuration.max_file_allowed != 'no-limit' && files.length > default_media_configuration.max_file_allowed) {
            is_error = 1;
            error_msg = 'Maximum ' + default_media_configuration.max_file_allowed + ' file is allowed at a time!';
        }

        let file_size_exceed = 0;
        let file_ext = [];
        for (let index = 0; index < files.length; index++) {
            if (!file_size_exceed && (files[index].size / (1024 * 1024)).toFixed(2) > default_media_configuration.file_size) {
                file_size_exceed = 1;
            }
            let cur_ext = files[index].name.substr(files[index].name.lastIndexOf('.') + 1, files[index].name.length);
            file_ext.push(cur_ext.toLowerCase());
        }
        file_ext = file_ext.filter(uniqueData);

        if (file_size_exceed) {
            is_error = 1;
            error_msg = 'Maximum ' + 
            default_media_configuration.file_size + 'MB file is allowed!';
        }

        if (compareArray(file_ext, default_media_configuration.file_ext.toLowerCase().split(',')) != 0) {
            is_error = 1;
            error_msg = 'Only ' + default_media_configuration.file_ext.toLowerCase().split(',').join(', ').replace(/  +/g, ' ') + '  ' + ((default_media_configuration.file_ext.split(',').length > 1) ? 'extensions are' : 'extension is') + ' allowed!';
        }

        if (is_error) {
            typeof showmsg == "function" && showmsg(error_msg, "", 1);
            return 0;
        } else {
            return 1;
        }
    }

    // for adding the info into the media_information's review media dialog 
    function fetchFileData(files, data) {
        media_information_modal.show?.();
        let media_details = (files.length) ? '<form id="media_details">' : '';
        for (let index = 0; index < files.length; index++) {
            let image_name = '';
            let ext = files[index].name.substr(files[index].name.lastIndexOf('.') + 1, files[index].name.length);
            if (media_array[ext] == undefined) {
                image_name = media_array['other'];
            } else {
                image_name = media_array[ext];
            }
            media_details += `<div class="accordion" id="media_details_${index}">
            <div class="card mb-2 border-bottom rounded">
                <div class="card-header py-1">
                    <span class="my-0 this_header">
                        <button tabindex="0" title="Media Name: ${files[index].name}" class="btn font18 font-weight-bold text-dark text-decoration-none text-left w-100" type="button" data-bs-toggle="collapse" data-target="#collapse_${index}" aria-expanded="true" aria-controls="collapseOne">
                            <span>Media Name: ${files[index].name}</span>
                            <i class="float-right s4 mt-1 text-dark icomoon-new-24px-arrow-down-2"></i>
                        </button>
                    </span>
                </div>
                <div id="collapse_${index}" class="collapse ${(index == 0) ? `show`: ``}" data-parent="#media_details_${index}">
                    <div class="card-body mx-3 px-0 my-2 py-0">
                        <div class="col-md-4 m-b-lg p-lg-0 p-md-2 pull-left px-0">
                            <center>
                                ${(files[index].type.match('image')) ? `<img width="245" title="${files[index].name}" alt="${files[index].name}" id="image_file${index}" data-file="${index}" src="${thumbnail_data[index]}" /><input type="hidden"  data-index="${index}" data-key="dimension"  data-dimension="${index}"/>`: ((files[index].type.match('video'))) ? `<img width="100"  title="${files[index].name}" alt="${files[index].name}" data-file="${index}" src="${MEDIA_URL}loading_000b6Q.gif" /><input type="hidden" data-key="thumbnail" data-index="${index}" data-thumbnail="${index}"/>`: `<img width="245" src="${MEDIA_URL+image_name}"  title="${files[index].name}" alt="${files[index].name}"/>`}
                            </center>
                        </div>
                        <div class="col-md-8 px-0 m-b-lg pull-left">
                            <div class="col-md-12 px-0 pull-left pb-3">
                                <label for="alt_text${index}" class="control-label float-left pr-4"><span class="mendatory_label float-left">Short Desctiption</span></label>
                                <input type="text" require="1" title="Short Desctiption" class="col-md-12 float-left form-control height32 m-b-sm" data-key="alt"  data-index="${index}" placeholder="Short Desctiption" name="alt_text${index}" id="alt_text${index}" />
                            </div>
                            <div class="col-md-12 px-0 pull-left pb-3">
                                <label for="related_tags${index}" class="control-label float-left pr-4"><span class="mendatory_label float-left">Tags</span></label>
                                <input type="text" require="1" title="Add multiple tags by pressing Enter key" class="col-md-12 float-left form-control height32 m-b-sm" data-key="tags" data-role="tagsinput" data-index="${index}" placeholder="Add multiple tags by pressing Enter key" name="related_tags${index}" id="related_tags${index}" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        }
        media_details += (files.length) ? '</form>' : '';
        window.files = files;
        AH.select('.media_information_container').innerHTML = media_details;
        //$("input[data-role=tagsinput]").tagsinput();
        AH.setAttr('.bootstrap-tagsinput input', {'title':'Add multiple tags by pressing Space key','tabindex': 0,'size': '39'});
        AH.enableTagView({separator: " "});
    }

    // for reading the files and getting the thumbnail
    function handleFileSelect(event, files) {
        if (window.File && window.FileList && window.FileReader) {
            let selected_files = files || (event.target.files || event.originalEvent.dataTransfer.files);
            media_variable.first_time_msg = 1;
            media_variable.video_count = 0;
            media_variable.ajax_count = 0;
            for (let index = 0; index < selected_files.length; index++) {
                let file = selected_files[index];
                if (file.type.match('image')) {
                    let thumbnail_creater = new FileReader();
                    thumbnail_creater.addEventListener("load", imageLoad.bind(this, index));
                    thumbnail_creater.readAsDataURL(file);
                } else if (file.type.match('video')) {
                    let video_thumbnail_creater = new FileReader();
                    video_thumbnail_creater.onload = videoLoad.bind(this, index, file, video_thumbnail_creater);
                    video_thumbnail_creater.readAsArrayBuffer(file);
                }
            }
        } else {
            console.log("Your browser does not support File API");
        }
    }

    // save the data into the thumbnail arary
    function imageLoad(index, event) {
        thumbnail_data[index] = event.target.result;
    }

    // for extracting the thumbnail of video
    function videoLoad(index, file, video_thumbnail_creater) {
        let blob = new Blob([video_thumbnail_creater.result], {
            type: file.type
        });
        let url = URL.createObjectURL(blob);
        media_variable.video_count++;
        let video = document.createElement('video');
        var timeupdate = function() {
            if (snapImage() || AH.select('#media_information').hidden) {
                video.removeEventListener('timeupdate', timeupdate);
                video.pause();
            }
        };
        video.addEventListener('loadeddata', function() {
            if (snapImage() || AH.select('#media_information').hidden) {
                video.removeEventListener('timeupdate', timeupdate);
            }
        });
        var snapImage = function() {
            AH.select('.media_info_submit').setAttribute('disabled', true);
            let canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image = canvas.toDataURL();
            let success = image.length > 100000;
            if (success) {
                thumbnail_data[index] = image;
                AH.setAttr('[data-file="' + index + '"]', {
                    'src': image,
                    'width': '245'
                });
                AH.activate(2);
                if (media_variable.first_time_msg == 1) {
                    showmsg('Processing Video File!', "", 1);
                    media_variable.first_time_msg = 0;
                }
                AH.ajax({
                    url: baseUrl + "forms.php?func=upload_screen_shots&ajax=1&source=paste&index=0", 
                    data: {
                        type: "data",
                        image: image
                    },
                }).then((data)=> {
                        let s3Url = JSON.parse(data);
                        AH.select('[data-thumbnail ="'+ index +'"]').value = s3Url.url[0]['server'];
                        media_variable.ajax_count++;
                        if (media_variable.ajax_count < media_variable.video_count) {
                            AH.showmsg(media_variable.ajax_count + ' File is processed!', "", 1);
                        }
                        if (media_variable.video_count == media_variable.ajax_count) {
                            AH.select('.media_info_submit').disabled = false;
                            AH.showmsg('Processing of file is done!', "", 1);
                            AH.activate(0);
                        }
                        URL.revokeObjectURL(url);
                    }
                ).catch((e)=> {
                    AH.activate(0);
                    showmsg('File is not processed successfully, Please upload all the files again!');
                    media_information_modal.hide();
                });
            }
            return success;
        };
        video.addEventListener('timeupdate', timeupdate);
        video.preload = 'metadata';
        video.src = url;
        // Load video in Safari / IE11
        video.muted = true;
        video.playsInline = true;
        video.playbackRate = 4.0;
        video.play();
    }

    // for uploading the files
    function uploadFiles(_files) {
        media_variable.upload_ajax_count = _files.length;
        let config = default_media_configuration;
        AH.select('.upload_video_msg').innerHTML = '';
        Array.prototype.forEach.call(_files, (_f)=> {
            var form_data = new FormData();
            form_data.append('Filedata', _f);
            
            // add data only when the data is needed
            if (default_media_configuration.review_media_dialog) {
                form_data.append('alt', _f.alt);
                form_data.append('tags', _f.tags);
                if (_f.thumbnail != undefined) {
                    form_data.append('thumbnail', _f.thumbnail);
                } else {
                    form_data.append('thumbnail', '');
                }

                if (_f.dimension != undefined) {
                    form_data.append('dimension', _f.dimension);
                } else {
                    form_data.append('dimension', '');
                }
            }

            if (config.complete_data && config.complete_data.func == "download_resources") {
                // for educator upload
                educatorUpload(_files, form_data, key, config);
            } else if (config.complete_data && config.complete_data.func == "annotated_listing") {
                // for annotater upload                    
                createTableFromImage(form_data, _files);
            } else if (config.is_epub) {
                // in case of epub
                form_data.append('upload_type', AH.select('.modal-body a[data-bs-toggle="tab"].active').getAttribute('href'));
                form_data.append('folder', AH.select('#folder_name').value);
                epubUpload(_files, form_data, key, config);
            } else {
                // for editor and author/?func=media uploading
                form_data.append('from_editor', is_react);
                mediaUpload(_files, form_data, "key", config);
            }
        });
    }

    // for library files or dependencies
    function getLibraryFiles() {

        if (default_media_configuration.is_editor) {
            // mergingScript('svelte_items/script/media_merge.min.js'); 
            return true;
        }
        // for the file uploading 
        // mergingScript('ux/media_modal_box/js/vendor/jquery.ui.widget.js');
        // mergingScript('media_modal_box/blueimp/js/tmpl.min.js');
        // mergingScript('ux/media_modal_box/js/jquery.fileupload.js');
        // mergingScript('ux/media_modal_box/js/main.js');
        // for the gallery script
        if (default_media_configuration.image_annotation) {
            mergingScript('media_modal_box/imageAnnotation.min.js');
        }

        if (!default_media_configuration.is_author) {
            mergingScript('media_modal_box/blueimp/js/blueimp-gallery.js');
            mergingScript('media_modal_box/blueimp/js/blueimp-gallery-fullscreen.js');
            mergingScript('media_modal_box/blueimp/js/blueimp-gallery-indicator.js');
            mergingScript('media_modal_box/blueimp/js/jquery.blueimp-gallery.js');
        }
    }

    // for comparing the 2 array return 0 if all the tree element will be in the branch
    function compareArray(tree, branch) {
        let matchedBranch = [];
        for (let index = 0; index < tree.length; index++) {
            for (let sub_index = 0; sub_index < branch.length; sub_index++) {
                if (branch[sub_index] == tree[index]) {
                    matchedBranch.push(branch[sub_index]);
                    continue;
                }
            }
        }
        let result = (tree.length - matchedBranch.length);
        return result < 0 ? 0 : result;
    }

    // for handling the educator upload
    function educatorUpload(files, form_data, key, config) {
        let educator_url;
        if (for_instructor == 1) {
            educator_url = baseUrl + 'lib/upload.php?func=download_resources&course_code=' + config.complete_data.course_code + '&for_instructor=1';
            if (config.complete_data.from_myproject == 1) {
                educator_url = baseUrl + 'lib/upload.php?func=download_resources&course_code=' + config.complete_data.course_code + '&for_instructor=1&from_myproject=1';
            }
        } else {
            // only this url is in use @TODO:- Discuss it with pete sir
            educator_url = baseUrl + 'lib/upload.php?func=download_resources&course_code=' + config.complete_data.course_code + '&class_code=' + config.complete_data.class_code
            if (config.complete_data.from_myproject == 1) {
                educator_url = baseUrl + 'lib/upload.php?func=download_resources&course_code=' + config.complete_data.course_code + '&class_code=' + config.complete_data.class_code + '&from_myproject=1';
            }
        }

        AH.activate(2);
        AH.ajax({
            url: educator_url, // point to server-side PHP script 
            dataType: 'text', // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
        }).then((res)=> {
            media_variable.upload_success_ajax_count++;
            if (media_variable.upload_success_ajax_count == media_variable.upload_ajax_count) {
                media_variable.upload_success_ajax_count = 0;
                media_variable.upload_ajax_count = 0;
                media_information_modal.hide();
                window.location.reload();
                AH.activate(0);
            }
        });
    }

    // for handling the normal media upload
    function mediaUpload(_files, form_data, key, config) {
        AH.activate(2);
        form_data.forEach((e)=> console.log(e));
        AH.setCss("#mceu_17", {'z-index': 'unset'});
        AH.setCss("#modal-media-upload", {'z-index': '1'});
        AH.ajax({
            url: baseUrl + 'lib/upload.php', // point to server-side PHP script 
            dataType: 'text', // what to expect back from the PHP script, if anything
            formData: true,
            contentType: false,
            processData: false,
            data: form_data,
        }).then((file, data, response)=> {
            AH.activate(0);
            media_variable.upload_success_ajax_count++;
            file = file.replace(/\s+/g, ' ').trim();
            var from_media = config.from_media;
            AH.showmsg(`${file} uploaded successfully!`);
            if (from_media != 1) {
                AH.setCss("#mceu_17", {'z-index': '1050'});
                AH.setCss("#mce-modal-block", {'z-index': '1049'});
                if (config.set_name) {
                    uploaded_file += file + ',';
                    uploaded_file_mceu += MEDIA_URL + file + ',';
                }
            }
            if (media_variable.upload_success_ajax_count == media_variable.upload_ajax_count) {
                media_variable.upload_success_ajax_count = 0;
                media_variable.upload_ajax_count = 0;
                if (from_media == 1) {
                    media_information_modal.hide();
                    window.location.reload();
                } else {
                    if (config.set_name) {
                        uploaded_file = uploaded_file.slice(uploaded_file, -1);
                        uploaded_file_mceu = uploaded_file_mceu.slice(uploaded_file_mceu, -1);
                        try {
                            if (window.parent.setImage) {
                                window.parent.setImage(0, uploaded_file);
                            } else {
                                setImage(0, uploaded_file);
                            }
                        } catch (e) {}

                        var fieldnme = AH.select('.mce-imageUploadField').value;
                        if (AH.selectAll("." + fieldnme).length && fieldnme != undefined) {
                            AH.select('.' + fieldnme + ' .mce-textbox').value = uploaded_file_mceu;
                        } else {
                            AH.selectAll( manual_item_id, 'value',  uploaded_file)
                        }
                        media_upload_modal.hide();
                        uploaded_file = '';
                        uploaded_file_mceu = '';
                    }

                    AH.remove('#media_list .main_div');
                    getMedia(0, _files.length);
                    media_information_modal.hide();
                }
                AH.activate(2);
            }
        });
    }

    // for epub uploading
    function epubUpload(files, form_data, key, config) {
        AH.activate(2);
        // AH.ajax({
        //     url: baseUrl + 'author/epub/index.php', // point to server-side PHP script 
        //     dataType: 'text', // what to expect back from the PHP script, if anything
        //     cache: false,
        //     contentType: false,
        //     processData: false,
        //     data: form_data,
        //     type: 'POST',
        //     success: function(php_script_response) {
        //         media_variable.upload_success_ajax_count++;
        //         if (media_variable.upload_success_ajax_count == media_variable.upload_ajax_count) {
        //             media_variable.upload_success_ajax_count = 0;
        //             media_variable.upload_ajax_count = 0;
        //             if ($('.modal-body a[data-bs-toggle="tab"].active').attr('href') == '#S3') {
        //                 $('#S3').prepend('<div class="alert alert_epub alert-success"><a href="#" class="close" data-bs-dismiss="alert" aria-label="close">&times;</a><strong>Images are successfully uploaded</strong><div>Your Folder Path is s3.amazonaws.com/jigyaasa_content_static/' + $("#folder_name").val() + '/</div></div>');
        //             }

        //             if ($('.modal-body a[data-bs-toggle="tab"].active').attr('href') == '#LO_merge') {
        //                 $('.download_lo').show();
        //             }
        //             media_information_modal.hide();
        //             activate(0);
        //         }
        //     }
        // });
    }


    // function for fetching unique data in the array
    function uniqueData(value, uni_index, self) {
        return self.indexOf(value) === uni_index
    }

    // function for fetching the file name
    window.imageUploadFromGallery = function(file_name, is_multiple = 0) {
        try {
            let field_name = AH.select('.mce-imageUploadField').value;
            if (field_name != undefined && AH.selectAll("." + field_name).length && is_multiple != 1) {
                AH.select('.' + field_name + ' .mce-textbox').value = (MEDIA_URL + file_name);
            } else {
                AH.selectAll( manual_item_id, 'value',  file_name);
                setTimeout(()=> {
                    if (window.parent.setImage) {
                        window.parent.setImage(0, file_name);
                    } else {
                        setImage(0, file_name);
                    }
                }, 500);
            }
            media_upload_modal.hide();
        } catch (msg) {
            console.log({
                error: msg
            })
        }
    }

    // function for copy the s3 url
    window.copyUrl = function(event_id) {
        let text = document.getElementById(event_id).value;
        let input_box = document.createElement('input');
        input_box.value = text;
        document.body.appendChild(input_box);
        input_box.select();
        document.execCommand("copy");
        document.body.removeChild(input_box);
    }

    // for geting the media list
    function getMedia(is_refresh, recent_files = 0) {
        if (is_refresh) {
            recent_files = AH.selectAll('.new_media').length;
        }
        let url = baseUrl + "media_modal_box/index.php?func=getMedia&find=" + AH.select('#find').value + "&start_date=" + AH.select('#start_date').value + "&end_date=" + AH.select('#end_date').value + "&recent_files=" + recent_files;
        AH.activate(2);
        AH.ajax({
            url: url,
            cache: false,
            data: default_media_configuration,
        }).then((data)=> {
            AH.select('#media_list').innerHTML = (data);
            (is_refresh) ? AH.showmsg('Media List Refresh!', 1): '';
            AH.activate(0);
        });
    }

    /** Used in case of select_multiple_media : true */
    function selectMedias() {
        //$('.checkbox_container').removeClass('d-none');
    }

    function enableOptions() {
        // var is_checkbox_checked = 0;
        // $('.file_select').each(function() {
        //     if (($(this).prop('checked'))) {
        //         return is_checkbox_checked = 1;
        //     }
        // });

        // if (is_checkbox_checked) {
        //     $('.useSelectedMedia').removeClass('disable_license pointer_event_none').removeAttr('tabindex style');
        //     $('.useSelectedMedia').parent().addClass('dropdown-item pointer');
        //     $('.use_media').hide();
        // } else {
        //     $('.useSelectedMedia').addClass('disable_license pointer_event_none').attr({
        //         'tabindex': '-1',
        //         'style': 'margin: 0 0 6px 11px',
        //     });
        //     $('.useSelectedMedia').parent().removeClass('dropdown-item pointer');
        //     $('.use_media').show();
        // }
    }

    function useSelectedMedia() {
        // var file_name = '';
        // $('.file_select:checked').each(function() {
        //     file_name += $(this).val() + ',';
        //     $(this).prop('checked', false);
        // });
        // file_name = file_name.slice(file_name, -1);
        // $('.checkbox_container').addClass('d-none');
        // enableOptions();
        // imageUploadFromGallery(file_name, 1);
    }

    function navigateGallary(seq) {
        let currentImg = AH.select(".showSlide");
        AH.select(currentImg, 'removeClass', 'showSlide');
        if (seq == 1) {
            AH.select(currentImg.nextElementSibling, 'addClass', 'showSlide');
        } else {
            AH.select(currentImg.previousElementSibling, 'addClass', 'showSlide');
        }
    }

    function showGallary(_curr) {
        let allImage = AH.selectAll('.gridViewImg');
        let slideHtml = '';
        allImage.forEach((_img, index)=> {
            let mGuid = _img.parentElement.getAttribute('media_guid');
            let isSame = _img.isSameNode(_curr);
            slideHtml += `
                <div seq="${index}" class="lightBoxSlides ${isSame ? 'showSlide' : ''}" mGuid="${mGuid}">
                    <div class="numbertext">
                        ${_img.id} 
                    </div>
                    ${_img.outerHTML}
                </div>
            `;
        });
        AH.getBS("#lightBoxModal", 'Modal').show();
        AH.select("#lighBoxSlider").innerHTML = slideHtml;
        return false;
    }  

</script>

<div class="modal_plugin">
    <div class="modal fade upload_containter" id="modal-media-upload" style="z-index: 99999 !important;">
        <div class="modal-dialog modal-dialog-centered modal-lg overflow-hide">
            <div class="modal-content">
                <div class="modal-header">
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a href="#upload_tab" id="tab1" data-bs-toggle="tab" tabindex="0" title="Upload" class="active nav-link">Upload</a>
                        </li>
                        <li class="nav-item">
                            <a href="#gallery_tab" id="tab2" on:click="{getMedia}" data-bs-toggle="tab" tabindex="0" title="Gallery" class="nav-link">Gallery</a>
                        </li>
                    </ul>
                    <button type="button" class="close" data-bs-dismiss="modal"><span aria-hidden="true">×</span></button>
                </div>
                <div class="modal-body pt-0 overflow-auto" style="max-height:426px;">
                    <div class="flash_disabled alert alert-danger mt-2 h"></div>
                    <div class="form-inline mt-3">
                        <div class="tab-content tab_widther">
                            <div class="tab-pane active" id="upload_tab">
                                <div class="drag_media text-center clearfix">
                                    <i class="icomoon-cloud-upload s15"></i>
                                    <div id="dragandrophandler">Drag files here</div>
                                    <p class="orpara">Or</p>
                                    <!-- Required files to upload -->
                                    <link onload="this.rel='stylesheet'" rel="preload" as="style" href="{window.themeUrl}ux/media_modal_box/css/jquery.fileupload-ui.css" crossorigin="anonymous">
                                    <link onload="this.rel='stylesheet'" rel="preload" as="style" href="{window.themeUrl}media_modal_box/blueimp/css/blueimp-gallery.min.css" crossorigin="anonymous"/>
                                    <noscript><link onload="this.rel='stylesheet'" rel="preload" as="style" href="{window.themeUrl}ux/media_modal_box/css/jquery.fileupload-noscript.css" crossorigin="anonymous"></noscript>

                                    <form id="fileupload" action="" method="POST" enctype="multipart/form-data">
                                        <noscript><input type="hidden" name="redirect" value=""></noscript>
                                        <div class="fileupload-buttonbar pt-md sticky-top index2">
                                            <div class="p-0" id='fileSelector'>
                                                <span class="btn btn-primary fileinput-button" tabindex="0">
                                                    <span title="Upload files" data-bs-toggle='tooltip' data-title='Browse file'>
                                                        <i class="fa fa-plus mr-1" aria-hidden="true"></i>
                                                        <span class="pull-right">Upload files</span>
                                                        {#if default_media_configuration.max_file_allowed != "1"}
                                                            <input 
                                                                type="file" 
                                                                bind:files 
                                                                on:change={onUploadMedia} 
                                                                tabindex="-1" 
                                                                name="files[]" 
                                                                accept="{default_media_configuration.file_type}" 
                                                                multiple 
                                                                id="fileUploadSelector" 
                                                                data-id='fileUploadInput' 
                                                                class="fileUploadInput"
                                                            >
                                                        {:else}
                                                            <input 
                                                                type="file" 
                                                                bind:files 
                                                                on:change={onUploadMedia} 
                                                                tabindex="-1" 
                                                                name="files[]" 
                                                                accept="{default_media_configuration.file_type}" 
                                                                id="fileUploadSelector" 
                                                                data-id='fileUploadInput' 
                                                                class="fileUploadInput"
                                                            >
                                                        {/if}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                    <!-- End -->
                                </div>
                                <div class="upload_status"></div>
                            </div>
                            <div class="tab-pane" id="gallery_tab"  style="min-height:200px;">
                                <div class="row">
                                    <div class="form-group pr-1">
                                        <input 
                                            type="text" 
                                            tabindex="0" 
                                            name="find" 
                                            id="find" 
                                            class="form-control form-control-md"  
                                            title="Search media Name or Tags" 
                                            placeholder="Search Name or Tags"
                                        />
                                    </div>
                                    <div class="form-group pr-2 mr-1">
                                        <label for="start_date" class="fs-6">Between</label>
                                    </div>
                                    <div class="form-group pr-2 mr-1 pl-0">
                                        <input 
                                            type="date" 
                                            tabindex="0" 
                                            autocomplete="off" 
                                            name="start_date" 
                                            id="start_date" 
                                            datepicker="1" 
                                            placeholder="From Date"  
                                            title="Search media from uploaded date" 
                                            class="form-control-md form-control col-12" 
                                            value="{new Date()}" 
                                            dt="u"
                                        />
                                    </div>
                                    <div class="form-group pr-2 pl-1">
                                        <input 
                                            type="date" 
                                            tabindex="0" 
                                            autocomplete="off" 
                                            name="end_date" 
                                            id="end_date" 
                                            datepicker="1" 
                                            placeholder="To Date" 
                                            title="Search media till this date" 
                                            class="form-control-md form-control col-12" 
                                            value="{new Date()}" 
                                            dt="u"
                                        />
                                    </div>
                                    <div class="form-group pr-2">
                                        <button 
                                            type="button" 
                                            tabindex="0" 
                                            class="btn btn-light btn-md" 
                                            title="Search" 
                                            on:click="{getMedia}"
                                        >
                                            <span class="icomoon-search-3"></span>
                                        </button>
                                    </div>
                                    <div class="form-group pr-2">
                                        <button 
                                            type="button" 
                                            tabindex="0" 
                                            class="btn btn-light btn-md" 
                                            title="Refresh" 
                                            on:click="{getMedia.bind(this, 1)}"
                                        >
                                            <span class="icomoon-24px-reset"></span>
                                        </button>
                                    </div>
                                    {#if default_media_configuration.select_multiple_media == "true"}
                                        <div class="form-group pr-2 mt-2">
                                            <button tabindex="0" type="button" class="px-0 btn btn-light transparent_threedot my-1 move_renew_dropdown gridview_open_btn position-relative" data-bs-toggle="dropdown">
                                                <span class="icomoon-menu-2 setting_icon s3"></span>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li class="dropdown-item pointer use_media">
                                                    <a href="#" on:click="{selectMedias}" class="dropdown-item rounded-0 text-left text-dark border-0" data-bs-toggle="tooltip">
                                                        <i class=" icomoon-images-2 mr-2" aria-hidden="true"></i>Select Media
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" tabindex="-1" style="margin: 0 0 6px 11px;" on:click="{useSelectedMedia}" class="border-0 dropdown-item useSelectedMedia disable_license pointer_event_none rounded-0 text-dark text-left" data-bs-toggle="tooltip">
                                                        <i class="icomoon-image mr-2" aria-hidden="true"></i>Use selected media
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    {/if}
                                </div>
                                <div id="media_list" class="mt-4" style="height:100%;overflow:auto;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button 
                        type="button" 
                        tabindex="0" 
                        class="btn btn-light mr-3" 
                        name="cancel" 
                        id="cancel" 
                        data-bs-dismiss="modal" 
                        aria-hidden="true" 
                        value="Cancel"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>			
    </div>
    <div class="modal" id="media_information" tabindex="-1" style="z-index: 99999 !important;">
        <div class="modal-dialog modal-dialog-centered modal-lg overflow-hide">
            <div class="modal-content min_height_500 shadow border border-dark">
                <div class="modal-header">
                    <h4 class="modal-title">Review Media</h4>
                    <button 
                        type="button" 
                        class="close" 
                        data-bs-dismiss="modal"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>	
                <div class="modal-body">	
                    <div class="media_information_container">
                    </div>
                </div>	
                <div class="modal-footer">
                    <button 
                        class="btn btn-light btn-md media_info_cancel" 
                        title="Cancel" 
                        data-bs-dismiss="modal" 
                        tabindex="0" 
                        type="button" 
                        aria-hidden="true"
                        on:click={onCancelMediaInfo}
                    >
                        Cancel
                    </button>
                    <button 
                        class="btn btn-primary btn-md media_info_submit" 
                        on:click={mediaInfoSubmit} 
                        title="Upload Details" 
                        tabindex="0" 
                        type="button" 
                        aria-hidden="true"
                    >
                        Upload Details
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="details_div" tabindex="-1" style="z-index: 99999 !important;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow border">
                <div class="modal-header">
                    <h4 class="modal-title">Copy Embed Code</h4>
                    <button 
                        type="button" 
                        class="close embed_modal" 
                        data-bs-dismiss="#details_div" 
                        aria-hidden="true"
                    >
                        &times;
                    </button>
                </div>	
                <div class="modal-body">	
                    <div class="input-group">
                        <input 
                            type="text" 
                            name="embed_code" 
                            title="Embed Link" 
                            id="embed_code" 
                            class="form-control form-control-md pr-2 pointer" 
                            readonly="readonly" 
                            on:click="{(e)=> e.target.select()}" 
                        />
                        <span class="input-group-append tooltip_change section_copied" data-clipboard-target="#embed_code">
                            <button class="btn btn-light to_be_copied" type="button" title="Click to copy">
                                <span class="icomoon-copy-2" title="Copy to clipboard"></span>
                            </button>
                        </span>
                    </div>
                </div>	
                <div class="modal-footer">
                    <button 
                        class="btn btn-light btn-md embed_modal" 
                        data-bs-dismiss="modal" 
                        title="Cancel" 
                        type="button" 
                        aria-hidden="true"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- The Gallery as lightbox dialog, should be a document body child element -->
<div 
    class="modal fade" 
    id="lightBoxModal" 
    tabindex="-1" 
    aria-labelledby="Gallary" 
    aria-hidden="true" 
    style="z-index:99999 !important;"
>
    <div class="modal-dialog" id="lightBoxDialog" style="height: {window.innerHeight}px;">
        <div class="modal-content" style="height: {window.innerHeight}px;">
            <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body fs-5" id="lightBoxBody">
                <div id="lighBoxSlider"> </div>
                <!-- Next/previous controls -->
                <a 
                    href="#lightBoxControls"
                    class="lightBoxControls prev text-center" 
                    style="left:5%;padding: 2px 2px 0 0;" 
                    on:click="{navigateGallary.bind(this, -1)}"
                >
                    &#10094;
                </a>
                <a 
                    href="#lightBoxControls" 
                    class="lightBoxControls next text-center" 
                    style="right:5%;padding: 2px 0 0 2px;" 
                    on:click="{navigateGallary.bind(this, 1)}"
                >
                    &#10095;
                </a>
            </div>
            <div class="modal-footer">
                
            </div>
        </div>
    </div>
</div>

<style>
    :global(.lightBoxControls) {
        position: fixed;
        top: 50%;
        height: 50px;
        width: 50px;
        color: #fff !important;
        background: #343a40;
        cursor: pointer;
        font-size: 30px;
        border-radius: 50%;
    }
    :global(#lightBoxDialog) {
        width: 100vw;
        max-width: none;
        height: 100%;
        margin: 0;
    }
    :global(#modal_plugin .modal) {
        z-index: 299203 !important;
    }
    :global(.lightBoxSlides) {
        display: none;
        margin: auto;
        width: 90%;
    }
    :global(.showSlide) {
        display:block;
    }
</style>