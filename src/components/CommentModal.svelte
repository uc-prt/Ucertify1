<script>
    import { onMount } from 'svelte';
    import {AH} from  '../../helper/HelperAI.svelte';
    export let funcname;
    export let user_guid;
    export let user;
    export let questionGuid;
    export let l;
    let commentCguid = false;
    let CREATEAPP_PATH = baseUrl + "educator/project/";
    let userName = user.first_name + " " + user.last_name;
   // var userName = "<{$user_fname}> <{$user_lname}>";
   // var funcname = "<{$data.func}>";
    let anno_type_new = (funcname == 'view_full_asset') ? "4" : "3";
    let course_code;
    onMount(()=> {
        init();
    })
    function convertTextIntoLinks() {
        var comment  = document.getElementsByClassName('comment_text');
        if (comment.length > 0) {
            for(var i = 0; i <= comment.length; i++) {
                if (comment[i] != undefined) {
                    let text = comment[i].innerHTML;
                    if (text.indexOf('http') > -1 && text.indexOf('href') == -1) {
                        var exp   = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                        var text1 = text.replace(exp, '<a target="_blank" href="$1">$1</a>');
                        var exp2  =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
                        comment[i].innerHTML = text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
                    }
                }
            }
        }
    };
    function anotateData(base, data){
        if(base && data?.ranges.length){
            data.ranges.forEach((range, cnt) => {
                if(range.start){
                    const pathS = range.start.split('/');
                    let pathE = range.end.split('/');
                    let currentElement = base;
                    let currentElementIndex = -1;
                    while(pathS.length){

                        let curr = '';
                        while (!curr){
                            curr = pathS.shift();
                            if(curr == pathE[0]){
                                pathE.shift();
                            }
                        }            
                        curr = curr.split('[');

                        const requiredTagName = curr[0].toUpperCase();
                        let index = parseInt(curr[1].slice(0,curr[1].length-1));
                        
                        let currentChildNodes = currentElement.childNodes;
                        for(let ind in currentChildNodes){
                            if(currentChildNodes[ind].tagName == requiredTagName){
                                index -= 1;
                                if(index == 0){
                                    currentElement = currentChildNodes[ind];
                                    currentElementIndex = ind;
                                    break;
                                }
                            }
                        }
                    }
                    
                    currentElement = currentElement.parentElement;
                    let startIndex = parseInt(currentElementIndex);
                    while(pathE.length){
                        let curr = '';
                        while (!curr){
                            curr = pathE.shift();
                        }
                        curr = curr.split('[');

                        const requiredTagName = curr[0].toUpperCase();
                        let index = parseInt(curr[1].slice(0,curr[1].length-1));
                        
                        let currentChildNodes = currentElement.childNodes;
                        for(let ind in currentChildNodes){
                            if(currentChildNodes[ind].tagName == requiredTagName){
                                index -= 1;
                            }
                            if(index == 0){
                                currentElement = currentChildNodes[ind];
                                currentElementIndex = ind;
                                startIndex = 0;
                                break;
                            }
                            if(ind >= startIndex){
                                const spanTag = document.createElement('span');
                                spanTag.classList.add('annotator-hl', 'color0', 'annotator-share',  `${data.base}_${data.id}`);
                                spanTag.innerHTML = currentChildNodes[ind].outerHTML || currentChildNodes[ind].textContent;
                                currentElement.replaceChild(spanTag, currentChildNodes[ind]);
                            }
                        }

                    }
                }
                setTimeout(() => {
                    const findAnnotate = document.getElementsByClassName(`${data.base}_${data.id}`);
                    let contentElement;
                    let lastElement;
                    Array.prototype.forEach.call(findAnnotate, ele => {
                        if(ele.classList.contains('comment_container_head')){
                            contentElement = ele;
                        }
                        else{
                            lastElement = ele;
                        }
                    });
                    if(lastElement && contentElement){
                        lastElement.insertAdjacentElement('afterend', contentElement.firstElementChild);
                    }
                }, 500);
            });
        }
    }

    function loadComments(type) {
        const comment_tab_list = AH.selectAll('.comment_tab');
        Array.prototype.forEach.call(comment_tab_list, function (curr) {
            curr.classList.remove('active');
        });
        AH.select('[data-comment_type="'+ type + '"]').classList.add('active');
        anno_type_new = type;
        let CurrGuid = AH.get('current_guid');
        if (AH && CurrGuid) {
            AH.set('comments_type', type);
            AH.activate(2);
            AH.ajax({
                url : `${CREATEAPP_PATH}?func=get_comments&content_guid=${CurrGuid}&user_guid=${user_guid}&add_ui=1&annotation_type=${type}`,
                withUrl: true,
            }).then(async (res)=> {
                AH.activate(0);
                AH.select('#comment_modal_body').innerHTML = res;
                const collapseContent = AH.selectAll('#comment_modal_body .collapse_content');
                if (collapseContent.length > 0) {
					collapseContent.forEach((ele) => {
						if (ele.textContent.trim() == '') {
							ele.remove();
						}
					});
				}
                
                if (type == 1) {
                    AH.select('#comment_modal_body', 'addClass', 'pb-2');
                    AH.select('#comment_modal_body', 'removeClass', ['pb-5', 'mb-2']);
				} else {
                    AH.select('#comment_modal_body', 'addClass', ['pb-5', 'mb-2']);
                    AH.select('#comment_modal_body', 'removeClass', 'pb-2');
				}
                
				convertTextIntoLinks();
                const commentText = AH.selectAll('.comment_text');
				if (commentText.length > 0) {
					commentText.forEach(commentEle => commentEle.innerHTML = commentEle.innerHTML.replace(/(?:<br>\s*){2,}/g, '<br><br>'))
				}

				if (type == 1) {
					let response = await AH.ajax({
                        url:baseUrl+ `store.php?action=read&read_only=1&is_context=1&base=${CurrGuid}`
                    });
                    response = JSON.parse(response || "[]");
                    response.forEach(eleData => {
                        const base = AH.select(`[annotation_id="${eleData.base}"]`);
                        anotateData(base, eleData);
                    });
                }
            }).finally(() => {
                AH.activate(0);
                AH.initDropdown();
            });
        }
    }
    
    export function init() {
        /*comment events*/
        AH.listen(document.body,'click', '.open_comment', function(_this) {
            var guid = _this.closest('section').getAttribute('guid');
            if (typeof guid != 'undefined') {
                AH.activate(1);
                AH.ajax({
                    url : baseUrl + `educator/project/?func=get_comments&content_guid=${guid}&user_guid=${user_guid}`,
                    withUrl: true,
                }).then((res)=> {
                    AH.activate(0);
                    AH.select('#comment_modal_body').innerHTML = res;
                    AH.initDropdown();
                    //$("[rel=tooltip]").tooltip();
                    AH.getBS('#comment_modal', 'Modal').show();
                });
            }
        });
        /*reply buttons*/
        AH.listen(document.body, 'click', '.reply_textbox', (_this)=> {
            var props = [
                {class : 'btn btn-info btn-sm',          text : 'Reply',  type : 'reply'},
                {class : 'btn btn-light btn-sm ml-2', text : 'Cancel', type : 'reply_cancel'}
            ];
            if (AH.find(_this.parentElement, '.comment_btns', 'all').length < 1) {
                _this.parentElement.append(createButtons(props));
            }
        });
        AH.listen(document.body, 'click', '.comment_btns [btntype=reply]', function(_this) {
            replyOnComment(_this);
        });
        AH.listen(document.body, 'click', '.comment_btns [btntype=reply_cancel]', function(_this) {
            _this.parentElement.remove();
        });
        /*reply buttons end*/
    
        /*comment edit*/
        AH.listen(document.body, 'click', '.comment_edit', function(_this) {
            AH.find('.comment_footer', '.reply_textbox').value = '';
            if (AH.select('.comment_btns').hasOwnProperty('remove')) {
                AH.select('.comment_btns').remove();
            }
            AH.find(_this.closest('.comment_container'), '.reply_textbox').classList.add('h');
            let props = [
                {class : 'btn btn-info btn-sm',          text : 'Save',  type : 'edit'},
                {class : 'btn btn-light btn-sm ml-md', text : 'Cancel', type : 'edit_cancel'}
            ];
            if (AH.find(_this.closest('.comment_container'), '.comment_btns', 'all').length < 1) {
                AH.find(_this.closest('.comment_container'), '.comment_footer').append(createButtons(props));
                AH.find(_this.closest('.comment_container'), '.comment_footer').classList.add('comment_foo');
            }
            let commentText = AH.find(_this.closest('.comment_container'), '.comment_text');
            window.commentTextData = commentText.innerText;
            commentText.setAttribute('contentEditable', true);
            commentText.focus();
            AH.addClass(commentText, ['comment_text_editing', 'darkgrey_border', 'pt-xs', 'pb-xs', 'pl-xs', 'pr-xs']);
        });
        AH.listen(document.body, 'click', '.comment_container', function(_this) {
            if (typeof AH != "undefined" && AH.get('current_guid')) {
                let find_id = AH.get('current_guid') + "_" + _this.getAttribute('id');
                try {
                    document.getElementById(find_id).scrollIntoView({ block: 'end',  behavior: 'smooth' });
                } catch(e) {
                    // when scrollIntoView not found.
                }
            }
        }); 
        /*comment delete*/
        AH.listen(document.body, 'click', '.comment_delete', function(_this) {
            deleteComment(_this);
        });
        AH.listen(document.body, 'click', '.comment_btns [btntype=edit],.comment_btns [btntype=edit_cancel]', function(_this) {
            editComment(_this);
        });
        AH.bind('#comment_modal', 'hide.bs.modal', function(event) {
            AH.find('#comment_modal', '.modal-body').innerHTML = '';
        });
        AH.listen(document.body, 'click', '.comment_btns [btntype=comment],.comment_btns [btntype=comment_cancel]', function(_this) {
            newComment(_this);
        });
        AH.listen(document.body, 'click', '.resolve_btn', function(_this) {
            resolveComment(_this);
        });
        AH.listen(document.body, 'click', '.add_new_comment, .techcheck_comment', function(_this) {
            addComment(_this.getAttribute('techcheck'));
        });
        AH.listen(document.body,'click', '.comment_resolved_btn', function(_this) {
            let cmtResolvNode = AH.find(_this, '.comment_resolved_ic');
            if (cmtResolvNode.classList.contains('icomoon-arrow-down')) {
                cmtResolvNode.classList.remove('icomoon-arrow-down');
                cmtResolvNode.classList.add('icomoon-arrow-right-1');
            } else {
                cmtResolvNode.classList.remove('icomoon-arrow-right-1');
                cmtResolvNode.classList.add('icomoon-arrow-down');
            }
            var resolvedComment = _this.getAttribute('id');
            AH.selectAll('.comment_container_head[data-resolve="'+resolvedComment+'"]', 'toggleClass','h');
        });
    
        AH.listen(document, "click", ".delete_comment_block", function(_this) {
            AH.parent(_this, ".comment_container").remove();
        });
    }
    
    function createButtons(props) {
        let buttons = document.createElement('div');
        buttons.setAttribute('class','comment_btns mt-1');
        for(let i = 0 ; i < props.length; i++) {
            let btn = document.createElement('button');
            AH.setAttr(btn, {
                class   : props[i].class,
                text    : props[i].text,
                btnType : props[i].type
            });
            AH.select(btn, 'text', props[i].text);
            buttons.append(btn);
        }
        return buttons;
    };
    function replyOnComment(t) {
        let btnType     = t.getAttribute('btntype');
        let reply       = AH.find(t.closest('.comment_footer'), '.reply_textbox').value;
        if (reply == "") {
            AH.showmsg(`${l.please_enter_reply_comment}`);
            return false;
        }
        let contentGuid = t.closest('.comment_container_head').getAttribute('content-guid');
        let creatorGuid = t.closest('.comment_container_head').getAttribute('creator-guid');
        let userGuidR   = user_guid;
        let anno_id		= t.closest('.comment_container').getAttribute('anno_id');
        let id 			= t.closest('.comment_container').getAttribute('id');
        AH.find(t.closest('.comment_footer'), '.reply_textbox', {action: 'value', actionData: ''});
        t.closest('.comment_btns').remove();
        if (btnType == 'reply') {
            var _data = {
                user_guid_r: userGuidR,
                content_guid: contentGuid,
                creator_guid: creatorGuid,
                text: reply,
                annotation_type: anno_type_new,
                parent_anno_id: anno_id,
            }
            AH.activate(1,'.comment_modal_body');
            AH.ajax({
                url    : `${CREATEAPP_PATH}?func=save_reply`,
                data   : _data,
            }).then((data)=> {
                if (data != "") {
                    addUI(contentGuid);
                    var noOfComment = AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers').innerHTML; 
                    if (noOfComment) {
                        noOfComment = noOfComment.trim();
                        if (isNaN(noOfComment) || noOfComment == "") {
                            noOfComment = 1;
                        } else {
                            noOfComment = parseInt(noOfComment) + 1;
                        }    
                        AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers', {action: 'html', actionData: noOfComment});
                    }
                } else {
                    AH.activate(0,'.comment_modal_body');
                    AH.showmsg('Reply cannot be saved');
                }
            });
        }
    };
    function editComment(t) {
        var btnType        = t.getAttribute('btntype');
        var comment        = AH.find(t.closest('.comment_container'), '.comment_text').innerHTML;
        var creatorGuid    = t.closest('.comment_container_head').getAttribute('creator-guid');
        var contentGuid    = t.closest('.comment_container_head').getAttribute('content-guid');
        var userGuidR      = user_guid;
        var timestamp       = t.closest('.comment_container').getAttribute('time-span');
        var id             = t.closest('.comment_container').getAttribute('id');
        var anno_id        = t.closest('.comment_container').getAttribute('anno_id');
        AH.find(t.closest('.comment_container'), '.comment_text').setAttribute('contentEditable', false);
        AH.find(t.closest('.comment_container'), '.comment_text').classList.remove(['darkgrey_border', 'pt-xs', 'pb-xs', 'pl-xs', 'pr-xs']);
        if (!AH.find(t.closest('.comment_footer'), '.reply_textbox')?.classList.contains('disable_reply')) {
            AH.find(t.closest('.comment_footer'), '.reply_textbox').value = '';
            AH.find(t.closest('.comment_footer'), '.reply_textbox').classList.remove('h');
        }
        if (!AH.find(t.closest('.comment_container'), '.comment_footer').classList.contains('last_thread')) {
            AH.find(t.closest('.comment_container'), '.comment_footer').classList.remove('comment_foo');
        }
        t.closest('.comment_btns').remove();
        if (btnType == 'edit') {
            comment = comment.replace(new RegExp('<div>', 'g'), '\n');
            comment = comment.replace(new RegExp('<br>', 'g'), '\n');
            comment = comment.replace(new RegExp('</div>', 'g'), '');
            let _data = {
                user_guid_r:  user_guid,
                content_guid: contentGuid,
                creator_guid: creatorGuid,
                text:         comment,
                timestamp:     timestamp,
                id:           id,
                anno_id:      anno_id,
                tags: (typeof AH != "undefined" && AH.get('comments_type')) ? AH.get('comments_type') : -2,
            };
            AH.ajax({
                url    : `${CREATEAPP_PATH}?func=edit_comment`,
                data   : _data,
            }).then((data)=> {
                if (data != "") {
                    AH.showmsg("Comment updated successfully.");
                } else {
                    AH.showmsg("Error in updating comment, Please try again.");
                }
            });
        }
    };
    function deleteComment(t) {
        let deleteAll = (t.getAttribute('delete') == "all") ? true: false;
        let userGuidR   = t.closest('.comment_container').getAttribute('user-guid');
        let creatorGuid = t.closest('.comment_container_head').getAttribute('creator-guid');
        let contentGuid = t.closest('.comment_container_head').getAttribute('content-guid');
        let timestamp    = t.closest('.comment_container').getAttribute('time-span');
        let id 			= t.closest('.comment_container').getAttribute('id');
        let annotation_id 			= t.closest('.comment_container').getAttribute('anno_id');
        let _data = {
            user_guid_r:  userGuidR,
            base: contentGuid,
            creator_guid: creatorGuid,
            timestamp: timestamp,
            id: id,
            annotation_id,
            tags: (typeof AH != "undefined" && AH.get('comments_type')) ? AH.get('comments_type') : -2,
        };
        if (deleteAll) {
            _data = {
             delete_all: "1",
             base: contentGuid,
             creator_guid: creatorGuid,
            };
        }
        AH.activate(2);
        AH.ajax({
            url : baseUrl + "store.php?action=destroy",
            method : "POST",
            data  : _data,
        }).then((res)=> {
            if (res == true || res.length > 5) {
                addUI(contentGuid);
                var comment_numbers = AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers').innerHTML;      
                if (comment_numbers) {
                    comment_numbers = comment_numbers.trim();
                    if (isNaN(comment_numbers) || comment_numbers == "") {
                        comment_numbers = 1;
                    } else {
                        if (comment_numbers == "0") {
                            comment_numbers = 0;
                        } else {
                            comment_numbers = parseInt(comment_numbers)-1;
                        }
                    }           	
                    AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers', {action: 'html', actionData: comment_numbers});
                    AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers', {action: 'css', actionData: {display: 'block'}});
                }
                AH.showmsg("Comment deleted successfully.");
            } else {
                AH.showmsg("Error in deleting comment, Please try again.");
            }
            AH.activate(0);
        });
    };
    function resolveComment(t) {
        var userGuidR   = user_guid;
        var creatorGuid = t.closest('.comment_container_head').getAttribute('creator-guid');
        var contentGuid = t.closest('.comment_container_head').getAttribute('content-guid');
        var anno_id		= t.closest('.comment_container').getAttribute('anno_id');
        var id 			= t.closest('.comment_container').getAttribute('id');
        var _data = {
            user_guid_r: userGuidR,
            content_guid: contentGuid,
            creator_guid: creatorGuid,
            anno_id: anno_id,
            id: id,
        }
        AH.activate(1,'.comment_modal_body');
        AH.ajax({
            url    : `${CREATEAPP_PATH}?func=resolve_comment`,
            data   : _data,
        }).then((data)=> {
            if (data != "") {
                addUI(contentGuid);
                AH.showmsg("Comment resolved successfully.");
            } else {
                AH.showmsg("Error in resolving comment,Please try again.");
                AH.activate(0, '.comment_modal_body');
            }
        });
    };
    function newComment(t) {
        var btnType = t.getAttribute('btntype');
        var techcheck = t.getAttribute('techcheck');
        if (btnType == 'comment') {
            var comment = t.closest('.comment_container').querySelector('.comment_text').querySelector('textarea').value;
            comment = comment.trim();
            if (comment == "") {
                AH.showmsg(LANG.fill_com);
                return false;
            }
            var contentGuid = t.closest('.comment_container').getAttribute('content-guid');
            let _data = {
                user_guid_r:  user.user_guid,
                content_guid: contentGuid,
                text:comment,
                annotation_type: anno_type_new,
                tags: (techcheck == 1) ? -5 : -2, 
            };
            AH.activate(2);
            AH.ajax({
                url    : `${CREATEAPP_PATH}?func=new_comment`,
                data   : _data,
            }).then((data)=> {
                if(data != "") {
                    addUI(contentGuid);
                    let comment_numbers = AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers').innerHTML; 
                    if (comment_numbers) {
                        comment_numbers = comment_numbers.trim();
                        if (isNaN(comment_numbers) || comment_numbers == "") {
                            comment_numbers = 1;
                            AH.find(`[comment_guid='${contentGuid}']`, '.icomoon-new-24px-add-comment-1', {action: 'remove', actionData: 'icomoon-new-24px-add-comment-1'});
                            AH.find(`[comment_guid='${contentGuid}']`, '.icomoon-new-24px-add-comment-1', {action: 'add', actionData: 'icomoon-24px-comment-2'});
                        } else {
                            comment_numbers = parseInt(comment_numbers)+1;
                        }       	
                        AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers', {action: 'html', actionData: comment_numbers });
                        AH.find(`[comment_guid='${contentGuid}']`, '.comment_numbers', {action: 'css', actionData: {display: "block" } });
                    }
                    AH.getBS('#comment_modal', 'Modal').hide?.();
                    AH.showmsg("Comment added successfully.");
                } else {
                    AH.showmsg("Error in adding comment, Please try again.");
                }
                AH.activate(0);
            });
        } else {
            //$('.comment_container').remove();
            AH.parent(t, '.comment_container').remove();
            AH.getBS('#comment_modal', 'Modal').hide?.();
        }
    };
    function addComment(techcheck) {
        var new_block_count = 1;
        document.querySelectorAll('#comment_modal  #comment_modal_body .comment_container').forEach((elm, i)=> {
            if (elm.querySelector(".comment_text > textarea").value == "") {
                new_block_count += 1;
            }
        });
        if (new_block_count > 1) {
            AH.showmsg(LANG.please_fill_comment_before_adding_new_comment_block);
            return false;
        }
        let user_nm_char = userName.trim();
        userName = (user_nm_char.length == '0') ? `${user.first_name} ${user.last_name}` : userName;
        commentCguid = (commentCguid) ? commentCguid : questionGuid;
        var commentHtml = `<div 
                            class="comment_container card_shadow_2 d-inline-block relative bg-white w-100 pl-3 pr-3 pb-3 pt-1 mt-3" content-guid="${commentCguid}"
                        >
                            <div class="comment_header clearfix">
                                <div class="comment_user line_height3 float-left d-inline-block">
                                    <span class="icomoon-bubble-user s3"></span>
                                </div>
                                <div class="comment_name d-inline-block ml-1 font-weight-normal float-left font14">
                                    <p rel="tooltip">${userName}<br/></p>
                                </div>
                            </div>
                            <div class="comment_text mb font12 min_height40 overflow-y">
                                <textarea class="w-100 rounded" placeholder="Comment..."></textarea>
                            </div>
                            <div class="comment_footer comment_foo m-t-n-sm m-l-n-sm m-r-n-sm m-b-n-sm p-md">
                                <div class="comment_btns mt-1">
                                    <button class="btn btn-light btn-sm float-right delete_comment_block ml-1">${l.delete}</button>
                                    <button class="btn btn-light btn-sm float-right ml-md" btntype="comment_cancel">${l.cancel}</button>
                                    <button class="btn btn-primary mr-1 text-white btn-sm float-right" btntype="comment" techcheck = "${techcheck}">Comment</button>
                                </div>
                            </div>
                        </div>`;
        AH.insert('#comment_modal_body', commentHtml, 'beforeend');
        new_block_count = new_block_count + 1;
        try {
            let objDiv = document.querySelector('#comment_modal_body');
            objDiv.scrollTop = objDiv.scrollHeight;
        } catch(err) {
            console.warn(err);
        }
    }
    function addUI(contentGuid) {
        if (funcname != "view_full_asset") {
            AH.ajax({
                url : `${CREATEAPP_PATH}?func=get_comments&content_guid=${contentGuid}&user_guid=${user_guid}&add_ui=1&annotation_type=${anno_type_new}`,
                withUrl: true,
            }).then((res)=> {
                AH.activate(0);
                AH.select('#comment_modal_body').innerHTML = res;
                AH.initDropdown();
            });
        } else {
            AH.ajax({
                url : `${CREATEAPP_PATH}?func=get_comments&content_guid=${contentGuid}&user_guid=${user_guid}`,
                withUrl: true,
                type : "GET",
            }).then((res)=> {
                AH.activate(0);
                AH.select('#comment_modal_body').innerHTML = res;
                AH.initDropdown();
            });
        }
    };
</script>
<style>
	:global(.comment_tab.active) {
        text-decoration: none;
        border: 1px solid #ccc;
        border-bottom: 1px solid #e9ecef;
        border-radius: 3px;
	}
    :global(.mr) {
        margin-right: 8px;  
    }

    :global(a) {
        color: #b0281a;
        text-decoration: none!important;
    }

    :global(a:hover) {
        color: #0d5bdd;
        text-decoration: none!important;
    }
</style>
<button 
    type="button" 
    id="editor_comment_modal_btn" 
    class="btn btn-primary h" 
    data-bs-toggle="modal" 
    data-bs-target="#editor_comment_modal" 
    style="position:fixed;top:48%;right:-28px;transform: rotate(-90deg);z-index:1200;"
>
    Comment
</button>
<div class="modal right fade" id="editor_comment_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2">
    <div class="modal-dialog" role="document">
        <div class="editor_comment_box modal-content" id="editor_comment_box">
            <div class="editor_comment_header">
                <ul class="nav nav-tabs commentTabs" style="margin-left: 15px; padding: 10px 0;">
                    <li><a data-bs-toggle="tab" href="#comment_load" class="active comment_tab" data-comment_type="3" on:click="{loadComments.bind(this, 3)}" style="padding: 12px 15px;">Comments</a></li>
                    <li><a data-bs-toggle="tab" href="#techcheck_load" class="comment_tab" data-comment_type="4" on:click="{loadComments.bind(this, 4)}" style="padding: 12px 15px;">Techcheck</a></li>
                    <li><a data-toggle="tab" href="#context_load" class="comment_tab font14" data-comment_type="1" on:click="{loadComments.bind(this, 1)}" style="padding: 12px 15px;">Context</a></li>
                </ul>
                <div class="tab-content comment_modal_button">
                    <div id="comment_load" class="tab-pane fade in active">
                        <button title="Add New Comment" class="btn add_new_comment float-right mr-sm" techcheck="0" style="position: relative;left: 3px;">
                            <span class="icomoon-new-24px-add-comment-1 s3"></span>
                            Add New
                        </button>
                    </div>
                    <div id="techcheck_load" class="tab-pane fade">
                        <button title="Add New Techcheck" class="btn techcheck_comment float-right" techcheck="1">
                            <span class="icomoon-new-24px-add-comment-1 s3"></span>
                            Add New
                        </button>
                    </div>
                </div>
            </div>
            <div class="max_height_initial modal-body" id="comment_modal_body"></div>
        </div>
    </div>
</div>
<!-- Modal Code -->
<!---
<div class="modal" data-cy="assign_modal" id="assign_comment_modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{LANG.assign} {LANG.comments}</h5>
                <button type="button" class="close px-2 ml-2 assign_comment_cancel" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body max_height_470 overflow-y" id="assign_comment_contents">
                <div class="form-group row mx-0">
                    <label for="assign_to" class="col-md-2 col-2 col-sm-2 control-label col-form-label font-weight-normal mb-0 pr-0">{LANG.member}</label>
                    <div class="col-md-10 col-10 col-sm-10">
                        <select name="assign_to" id="assign_to" class="form-control form-control-md select2">
                            <option></option>
                            <option selected="selected" value="">{LANG.select_one}</option>
                            {#if typeof course.course_data.config.project.user_permission == "Array"}
                                {#each course.course_data.config.project.user_permission as value, guid}
                                    <option value="{guid}" email="{value.email}">{value.name}</option>
                                {/each}
                            {/if}
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" data-cy="cancel" class="btn btn-light assign_comment_cancel" data-bs-dismiss="modal">{LANG.cancel}</button>
                <button type="button" data-cy="save_comment" class="btn btn-primary assign_comment_btn">{LANG.save}</button>
            </div>
        </div>
    </div>
</div>
-->