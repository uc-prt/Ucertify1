<script>
    /**
	 *  File Name   : PeGlossaryContentLink.svelte
	 *  Description : To show the span link
	 *	Author      : Prabhat Kumar
	 *  Version     : 1.0
	 *  Package     : svelte_items
	 *  Created     : 17 Sep 2021
	*/
    import { onMount } from "svelte";
    import { AH } from "../../helper/HelperAI.svelte";
    onMount(()=> {
        var requestedGuid = "";
        var isInPreview = false;
        AH.listen('body', 'click', 'span.link', function(_this) {
            if (_this.parentElement.classList.contains("tinymce-editor") || _this.closest(".tinymce-editor")) {  //@Remove click from editor Authoring
				return false;
			}
			if (_this.getAttribute("guid").indexOf("new") != -1) {
				AH.showmsg("Please save the content before preview", 4, 1);
				return false;
			}
            var guid = (typeof _this.getAttribute("guid") != "undefined") ? _this.getAttribute("guid") : "";
            var style = (typeof _this.getAttribute("embed") != "undefined") ? _this.getAttribute("embed") : "";	
            var url = "";
            if(guid != "") {
                isInPreview = guid.startsWith('new-');
                url += `${baseUrl}preview.php?content_guid=${guid}&change_links_target=1`;
            }
            if(url != "") {
                switch(style.toLowerCase()) {
                    case "new":
                        window.open(url+"&action=new", "_blank");
                        break;
                    case "inline":
                        if (AH.nextElm(_this).classList.contains('span-inline')) {
                            AH.slideToggle(AH.nextElm(_this));
                            if (AH.select(_this).hasAttribute('toggle_link')) {
                                var txt = AH.select(_this)?.getAttribute('toggle_link');
                                AH.select(_this).setAttribute('toggle_link', AH.select(_this).textContent);
                                AH.select(_this).textContent = txt;
                            }
                        } else {
                            if ( requestedGuid != guid ) {
                                requestedGuid = guid;
                                AH.activate(1);
                                var no_space = '';
                                if (AH.select(".prettyprint.linenums").length > 0) {	
                                    AH.select('.prettyprint.linenums', 'addClass', ['handel_prettyprint']);
                                    AH.select('.prettyprint.linenums', 'removeClass', ['linenums']);
                                } else {
                                    no_space = 'white_space_imp py-2';
                                }
                                AH.ajax({
                                    type: "POST",
                                    url: url,
                                }).then((data)=> {
                                    requestedGuid = "";
                                    if(data) {
                                        data = data.replace(/sec_button/g,"");
                                    }
                                    AH.insert(_this, '<div linkedGuid= "'+guid+'"class="span-inline span-inline well bg-lighter-blue blue_border mt-2 py-0 mt-2 py-0 '+ no_space +'" style="display:none;"><span class="close mt-2 font28 pointer">&times;</span><div class="d-flex section_'+guid+'">'+data+'</div></div>', 'afterend');
                                    AH.addClass(AH.find('.section_' + guid, '#preview-content-in-span'), 'overflow');
                                    if ( no_space != '' ) {
                                        AH.addClass(AH.find('.section_' + guid, '#preview-content-in-span'), 'pt-3');
                                    }

                                    if (typeof ajaxContentUpdate != 'undefined') {
                                        let data = AH.nextAll(_this);
                                        AH.findAll(data,'.uc-figure',{action:'addClass',actionData:'spanlink_container'})
                                        ajaxContentUpdate({ imgAltText: 1, container: ['.spanlink_container'] });
                                    }
                                    AH.slideDown(AH.nextElm(_this), '500');
                                    AH.activate(0);
                                });
                            }
                        }
                        break;
                    case "factlink":
                            var _tId = "factbodydiv"+guid;
                            _tId = document.getElementById(_tId) ? guid : _tId;
                            if (AH.select('#'+_tId).closest('.base').style.display != 'block') {
                                _srcGuid = AH.select('#'+_tId).closest('.base').getAttribute('g');
                                AH.toggleDom(`[g = "${_srcGuid}"]`, 'show');
                                _tGuid = _this.closest('.base').getAttribute('g');
                                AH.toggleDom('[g = "'+_tGuid+'"]', 'hide');
                            }
                            var scrollHeight = getScrollTop() > 115 ? 50 : 95;
                            var _px = AH.offset('#'+_tId).top - 50;
                            scrollnow(_px);
                        break;
                    default:
                        var cl = function(obj) {
                            obj.parentElement.classList.add('fact-dialog');
                            obj.parentElement.querySelector('.f-title').remove();
                            if(obj.clientHeight < 89) {
                                var p = obj.querySelector('>p');
                                p.style.marginTop = (80 - p.clientHeight)/2;
                            }
                            obj.parentElement.querySelector('.ui-dialog-titlebar').classList.add('title-sep');
                            AH.insert(obj.parentElement.querySelector('.ui-dialog-titlebar'), '<span class="float-left modal_side_options"><span id="backward_link" class="icomoon-arrow-left s2 spanlink_nav disabled link link_shift"></span><span id="forward_link" class="icomoon-arrow-right-2 s2 spanlink_nav disabled link"></span><span>', 'afterend');
                            obj.dialog("option", "position", "center");
                            imgLoaded(obj).then(function() {
                                var foundImg = obj.parentElement.querySelectorAll('img');
                                //@pradeep: if image is greater than this number then will resized the object.: Yes
                                if (foundImg.length == 1 && foundImg.get(0).naturalWidth > 100 && foundImg.get(0).naturalHeight > 100) {
                                    var overflow_css = 'hidden' ; 
                                    var dwidth = foundImg.get(0).naturalWidth;
                                    var dheight = foundImg.get(0).naturalHeight;
                                    var cheight1 = obj.clientHeight;
                                    var cwidth = obj.clientWidth;
                                    var cheight = cheight1 + AH.siblings(obj, ".ui-dialog-titlebar")[0].clientHeight + dheight;
                                    var get_window_height = window.innerHeight-(AH.find(document.body, "header").clientHeight + AH.find(document.body, "footer").clientHeight);
                                    if (cheight > get_window_height) {
                                        overflow_css = "auto";
                                    }
                                    dwidth = (dwidth > obj.parentElement.clientWidth) ? dwidth + 120 : obj.parentElement.clientWidth;
                                    if(dwidth+160 > cwidth){ // we are adding 160 beacuse left and right adding 80 px so we are calculating the width
                                        dwidth = "auto";
                                    }
                                    AH.setCss(obj.parentElement, {
                                        width:dwidth,
                                        height:dheight+100,
                                        'max-height':window.innerHeight, 
                                        'max-width': window.innerWidth, 
                                        overflow:overflow_css
                                    });
                                    var obj_maxHeight = (obj.parentElement.outerHeight - AH.find(obj.parentElement, 'ui-dialog-titlebar').outerHeight) - 15;
                                    obj_maxHeight = ((dheight+50) > obj_maxHeight) ? obj_maxHeight : "";
                                    AH.setCss(AH.find(obj.parentElement, '.factlink-content'), {
                                        'height': (obj.parentElement.clientHeight - AH.find(obj.parentElement, '.ui-dialog-titlebar').clientHeight - 35),
                                        'max-height': obj_maxHeight
                                    });
                                    var top_calc = (window.innerHeight - AH.select('.fact-dialog').clientHeight)/2;
                                    var left_calc = (window.innerWidth - AH.select('.fact-dialog').clientWidth)/2;
                                    setTimeout(function() {
                                        obj.dialog("option", "position", "center");
                                    }, 5)
                                    if(AH.select(".external-module-body", "visible").length > 0){
                                        AH.setCss(obj.parentElement, {'top': top_calc,'left': left_calc});
                                    }
                                } else {
                                    obj.dialog("option", "position", "center");
                                }
                            });
                        };
                        var wd = _this.getAttribute('width');					
                        var ht = _this.getAttribute('height');
                    
                        if (_this.classList.contains("auto_resize")) wd = 'auto';
                        if ( ht === undefined ) ht = 'auto';
                        
                        if (isInPreview) {
                            var __inline = AH.nextElm('[name="'+guid+'"]', '.content_type_f');
                            var inline_data  = __inline.querySelector('.collapse_content').innerHTML;
                            var inline_title = '<div class="f-title">' + __inline.querySelector('.f').innerHTML + '</div>';
                            inline_data = '<div>'+inline_title+'<div>'+inline_data+'</div></div>';
                            bindDialog({click:_this, wd:(typeof(wd)!="undefined"?wd:450), ht:ht, trep:".f-title b", data:inline_data, rz:1, dgtype: "factlink",diologGuid:guid}, cl);
                        } 
                        else {
                            if ( typeof jQuery.ui != 'undefined' ) {
                                bindAjaxDialog({url:url, click:_this, wd:(typeof(wd)!="undefined"?wd:450), ht:ht, trep:".f-title b", rz:1, dgtype: "factlink",diologGuid:guid}, cl);
                            } else {
                                window.parent.bindAjaxDialog({url:url, click:_this, wd:(typeof(wd)!="undefined"?wd:450), ht:ht, trep:".f-title b", rz:1, dgtype: "factlink",diologGuid:guid}, cl);
                            }
                        }
                }
            }
        });
        AH.listen(document.body, "click", '.span-inline .close', function(_this) {
            AH.slideUp(_this.parentElement, 500);
        });
        AH.listen(document.body, 'click', '.weblink-fullscreen, .exhibit-fullscreen', function (_this) {
            var object = _this.parentElement.parentElement;
            if(_this.querySelector('span').classList.contains('fa-expand')) {
                weblink_width  = object.clientWidth;
                weblink_height = object.clientHeight;
                weblink_top    = object.position().top;
                weblink_left   = object.position().left;
                _this.setAttribute("title", "Revert");
                AH.find(_this, '.fa-expand').classList.remove("fa-expand");
                AH.find(_this, '.fa-expand').classList.add("fa-compress");
                AH.setCss(object, {top:'0',left:'0', width: window.innerWidth, height: window.innerHeight});
                AH.setCss(AH.select('.weblink-fullscreen,.exhibit-fullscreen').parentElement.nextElementSibling, {width: (window.innerWidth-16), height: (window.innerHeight-47)});
                AH.setCss(AH.select(".exhibit-fullscreen").parentElement.nextElementSibling, {'max-width':'1412px','max-height': '695px'});
                AH.select(".exhibit-fullscreen").parentElement.parentElement.style.overflow = hidden;
            } else {
                _this.setAttribute("title", "Full Screen");
                _this.querySelector('.fa-compress').classList.remove("fa-compress")
                _this.querySelector('.fa-compress').classList.add("fa-expand");
                AH.setCss(AH.select('.weblink-fullscreen').parentElement.nextElementSibling, {width: weblink_width-16, height: weblink_height-47});
                AH.setCss(AH.select(".exhibit-fullscreen").parentElement.nextElementSibling, {'max-width':'740px','max-height': '420px','width':'auto'});
                window.scrollnow(weblink_top);
                if(_this.classList.contains('exhibit-fullscreen')){
                    AH.setCss(object, {'top':weblink_top,'left':weblink_left, width: weblink_width, height: weblink_height});
                } else {
                    AH.setCss(object, {'top':weblink_top + 44,'left':weblink_left, width: weblink_width, height: weblink_height});
                }
            }
        });
    })
</script>