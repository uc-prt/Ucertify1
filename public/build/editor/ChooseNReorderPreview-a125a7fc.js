
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, C as validate_each_argument, v as validate_slots, o as onMount, A as AH$1, ad as afterUpdate, X as XMLToJSON, w as writable, a5 as onUserAnsChange, e as element, j as attr_dev, k as add_location, n as insert_dev, x as detach_dev, c as create_component, f as space, h as text, p as append_dev, m as mount_component, q as listen_dev, F as set_data_dev, t as transition_in, a as transition_out, b as destroy_component, K as destroy_each, H as run_all } from './main-70055d29.js';
import { I as ItemHelper } from './ItemHelper-2be6ff70.js';
import './style-inject.es-1c867377.js';
import { h as hotkeys } from './hotkeys.esm-701e2924.js';
import { S as Sortable } from './sortable.esm-84a6ed26.js';
import './choose.min-28dd96e2.js';

/**
 *  File Name   : chooseAuthString.js
 *  Description : Functions for all Choose and reorder AnswerChecking Module
 *	Author      : Sundaram Tripathi
 *  Version     : 1.0
 *  Package     : pe-gold
 *  Last update : 31 Jan 2021
 */



const AH = new JUI();
var ucChoose = {};
ucChoose.ajax_eId = "#choose";
ucChoose.userAnsXML = '';
//ucChoose.a ='';
ucChoose.errorCatchFlag = 1;
//var textarea_flag = false;
let ua, us, cs, ca;


AH.listen('body', 'keyup', '.sm_input_text', function() {
    if (document.querySelector(".sm_input_text").value == "" && document.querySelector(".add-option")) {
        document.querySelector(".add-option").disabled = true;
    } else {
        if (document.querySelector(".add-option"))
            document.querySelector(".add-option").disabled = false;
    }
});


ucChoose.update_XMLValue = function() {
    var list = [];
    // jQuery(".choose_item_container textarea").each(function(index, val) {
    //     const _this = jQuery(this);
    //     if (_this.val().length > 0) {
    //         const new_val = _this.val().replace(/\r?\n/g, '||');
    //         if (_this.prev('input').is(':checked'))
    //             list.push('*' + new_val);
    //         else
    //             list.push(new_val);
    //     }
    // }); 

    AH.selectAll('.choose_item_container textarea').forEach((_this)=>{
        if(_this.value.length > 0) {
            const new_val = _this.value.replace(/\r?\n/g, '||');
            if(AH.prevElm(_this,'input') && AH.prevElm(_this,'input').checked) {
                list.push('*' + new_val);
            } else {
                list.push(new_val);
            }
        }
    });



    // var xmlDom = jQuery(jQuery("#special_module_xml").val());
    // xmlDom.find('list').attr("headingCorrect",jQuery("#headingCorrect").val());
    // xmlDom.find('list').attr("allowSort",jQuery("#").attr("value"));
    // xmlDom.find('list').attr("isSentence",jQuery("#isSentence").attr("value"));
    // xmlDom.find('list').attr("isParagraph",jQuery("#isParagraph").attr("value"));
    // xmlDom.find('list').html("<!--[CDATA["+list.join('\n')+"]]-->");
    // jQuery("#special_module_xml").val(formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom[0]),true));

    if (document.querySelector("#special_module_xml")) {
        var xmlDom = document.querySelector("#special_module_xml").value;
        AH.find(xmlDom, 'list').setAttribute("headingCorrect", document.querySelector("#headingCorrect").value);
        AH.find(xmlDom, 'list').setAttribute("allowSort", document.querySelector("#allowSort").getAttribute("value"));
        AH.find(xmlDom, 'list').setAttribute("isSentence", document.querySelector("#isSentence").getAttribute("value"));
        AH.find(xmlDom, 'list').setAttribute("isParagraph", document.querySelector("#isParagraph").getAttribute("value"));
        AH.find(xmlDom, 'list').innerHTML = "<!--[CDATA[" + list.join('\n') + "]]-->";
        document.querySelector("#special_module_xml").value = formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom[0]), true);

    }

};

ucChoose.showAns = function(chid, elem, ansType) {
    //jQuery('#show_ans_group .btn').removeClass("btn-primary active");
    //jQuery(elem).addClass("btn-primary");
    if (ansType == "c") {
        ucChoose.review(chid, 1);
        ucChoose.sortList(chid, "correct_seq");
    } else if (ansType == "u") {
        ucChoose.review(chid, 0);
        ucChoose.sortList(chid, "user_seq");
    }
};


ucChoose.sortList = function(chid, sorting_attr) {
    var eel = AH.selectAll(chid + ' ' + '#sortable > li');
    var list = Array.from(eel);
    list.sort(function(a, b) {
        var seq1 = parseInt(a.getAttribute(sorting_attr));
        if (seq1 === 0) seq1 = Number.MAX_VALUE;
        var seq2 = parseInt(b.getAttribute(sorting_attr));
        if (seq2 === 0) seq2 = Number.MAX_VALUE;
        return (seq1 - seq2);
    });
    AH.selectAll(chid + " #sortable > li").forEach((_emt) => {
        _emt.remove();
    });
    list.forEach((_this) => {
        AH.find(chid, '#sortable').append(_this);
    });
};



ucChoose.togseq = function(chid) {
    var cs = AH.find(chid, "#sortable").getAttribute("checkSeq");
    AH.find(chid, '#sortable').setAttribute("checkSeq", ((cs == "1") ? "0" : "1"));
    AH.find(chid, '#instruction').innerHTML = ((cs == "1") ? "" : "Sequence Important");
};




ucChoose.review = function(chid, correctans) {
    var cs = document.querySelector(chid)?.querySelector('#sortable')?.getAttribute("checkSeq");
    var cans = ((correctans == 1) ? "is_correct" : "user_answer");
    var seq = ((correctans == 1) ? "correct_seq" : "user_seq");
    if (AH.select(chid).getAttribute?.('type') == "normal") {
        AH.find(chid, '#sortable li', 'all').forEach((_this) => {
            if (cs == "1") {
                if (_this.getAttribute(cans) == 1) {
                    var cseq = _this.getAttribute(seq);
                } else {
                    cseq = 0;
                }
                if (cseq > 0) {
                    AH.find(_this, '.prefix').innerHTML = cseq;
                } else {
                    AH.find(_this, '.prefix').innerHTML = "";
                }
                
                AH.find(_this, '.prefix', {
                    action: 'removeClass',
                    actionData: 'tick'
                });
            } else {
                if (_this.getAttribute(cans) == 1) {
                    AH.find(_this, '.prefix', {
                        action: 'addClass',
                        actionData: 'tick'
                    });
                } else {
                    AH.find(_this, '.prefix', {
                        action: 'removeClass',
                        actionData: 'tick'
                    });
                
                }
            }

            if (_this.getAttribute("user_answer") == 1 && correctans == 0) {
                _this.classList.add("choose_sel");
            } else if (_this.getAttribute("is_correct") == 1 && correctans == 1) {
                _this.classList.add("choose_sel");
            } else {
                _this.classList.remove("choose_sel");
            }
        });
    } else if (AH.select(chid).getAttribute?.('type') == "sentence" || AH.select(chid).getAttribute?.('type') == "paragraph") {
        ucChoose.setActiveClass(chid, correctans);
    }
    //if(correctans == 1)sortList(chid, "correct_seq");
};






ucChoose.CheckResultchoose = function(chid) {
    let result = {};
    var yourScore = true;
    var temp = 0;
    let temp_sort = AH.find(chid, '#sortable');
    var cs = Array.isArray(temp_sort) ? '' : temp_sort.getAttribute("checkSeq");
    //var i = 1;
    var ansxml = "";
    AH.find(chid, '#sortable li', 'all').forEach((_this) => {

        var us = _this.getAttribute("user_seq");
        var ua = _this.getAttribute("user_answer");
        if (cs == "1") {
            if (us != _this.getAttribute("correct_seq")) {
                yourScore = false;
            }

            if (typeof calculatePoint !== "undefined") {
                if (_this.getAttribute("correct_seq") > 0) {
                    if (us == _this.getAttribute("correct_seq")) temp++;
                    //temp = calculate_point(chid,us,jQuery(this).attr("correct_seq"),jQuery(chid).find('#sortable').attr("totalCorrectAns"),temp);
                }
            }
        } else {
            if (ua != _this.getAttribute("is_correct")) {
                yourScore = false;
            }
            if (typeof calculatePoint !== "undefined") {
                if (_this.getAttribute("is_correct") > 0) {
                    if (ua == _this.getAttribute("is_correct")) temp++;
                    //temp = calculate_point(chid,ua,jQuery(this).attr("is_correct"),jQuery(chid).find('#sortable').attr("totalCorrectAns"),temp);
                }
            }
        }
        ansxml += _this.getAttribute("optID") + "|" + us + "|" + ua + ",";
    });

    if (typeof calculatePoint != "undefined") {
        calculatePoint(AH.find(chid, '#sortable').getAttribute("totalCorrectAns"), temp);
    }

    ucChoose.userAnsXML = '<SMANS type="6"><list useranswer="' + ansxml + '" /></SMANS>';
    //ISSPECIALMODULEUSERXMLCHANGE = 1;
    
    
    //AH.select("#special_module_user_xml").value = ucChoose.userAnsXML;
    result.u =  ucChoose.userAnsXML;
    result.b = yourScore;
    
    
    //AH.select("#answer").checked = yourScore;
    if (yourScore == true) {
        //console.trace();
        return (result);
    } else {
        //console.trace();
        return (result);
    }
    
};
//touch handler
ucChoose.touchHandler = function(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
        type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0 /*left*/ , null);
    first.target.dispatchEvent(simulatedEvent);
};

ucChoose.init = function(chid) {
    // /*in IE8 addEventListener is not working So Prem Check when IE8 then do nothing*/
    // if (jQuery.browser !== undefined) {
    // 	if (jQuery.browser.msie  && parseInt(jQuery.browser.version, 10) === 8) {
    // 	//do nothing
    // 	} else {
    //     	document.addEventListener("touchstart", ucChoose.touchHandler, true);
    //     	document.addEventListener("touchmove", ucChoose.touchHandler, true);
    //     	document.addEventListener("touchend", ucChoose.touchHandler, true);
    //     	document.addEventListener("touchcancel", ucChoose.touchHandler, true);
    // 	}
    // } else {
    document.addEventListener("touchstart", ucChoose.touchHandler, true);
    document.addEventListener("touchmove", ucChoose.touchHandler, true);
    document.addEventListener("touchend", ucChoose.touchHandler, true);
    document.addEventListener("touchcancel", ucChoose.touchHandler, true);
    // }

    // jQuery(chid).bind('touchstart', function(e) { e.preventDefault()});
    // jQuery(chid).bind('touchmove', function(e) { e.preventDefault()});
    AH.bind(chid, 'touchstart', function(e) {
        e.preventDefault();
    });
    AH.bind(chid, 'touchmove', function(e) {
        e.preventDefault();
    });

};

ucChoose.shouldselect = false;
//var count = 1;//

// ucChoose.readyThis = function(chid) {
// 	if(isTouchable || isiPad) {
// 		setTimeout(function() {
// 			jQuery(chid).find('#sortable').removeAttr('onmouseup');

// 			jQuery('body').find(chid).on('click','#sortable',function() {
// 				var e = window.event;
// 				ucChoose.ow = e.srcElement? e.srcElement : e.target;
// 				ucChoose.t = setTimeout(function(){ucChoose.setUserAns(chid,ucChoose.ow,ucChoose.shouldselect)},100);
// 			});
// 			if(jQuery("#sortable").attr("checkseq") != "0") {
// 				jQuery(chid).find("#sortable").sortable({
// 					stop: function(e,ui){
// 						ucChoose.ow = e.srcElement? e.srcElement : e.target;
// 						ucChoose.t = setTimeout(function(){
// 							ucChoose.setUserAns(chid,ucChoose.ow,ucChoose.shouldselect)},100);
// 					}
// 				});
// 			}
// 		},200);
// 	}
// }

ucChoose.readyThis = function(chid) {
    if (typeof(isTouchable) != undefined || isiPad) {
        setTimeout(function() {
            //jQuery(chid).find('#sortable').removeAttr('onmouseup');
            AH.find(chid, '#sortable').removeAttribute('onmouseup');
            AH.listen(AH.find('body', chid), 'click', '#sortable', function() {
                var e = window.event;
                ucChoose.ow = e.srcElement ? e.srcElement : e.target;
                ucChoose.t = setTimeout(function() {
                    ucChoose.setUserAns(chid, ucChoose.ow, ucChoose.shouldselect);
                }, 100);
            });
            if (document.querySelector("#sortable").getAttribute("checkseq") != "0") {
                new Sortable(AH.find(chid, '#sortable'), {
                    onEnd: function(evt) {
                        ucChoose.ow = evt.srcElement ? evt.srcElement : evt.target; 
                        ucChoose.t = setTimeout(function() {
                            ucChoose.setUserAns(chid, ucChoose.ow, ucChoose.shouldselect);
                        }, 100);
                    }
                });
            }
        }, 200);
    }
};

ucChoose.bindKeyup = function(chid) {
    var count = 0;

    hotkeys.unbind('down,up,enter,alt+down,delete,left,right,tab,shift+tab,esc', 'choose' + chid);


    AH.find(chid, '#sortable li', 'all').forEach((_this) => {
        _this.classList.add("ks");
    });



    AH.bind(document, 'click', function() {
        if (!checkFocus())
            AH.find(chid, "#sortable .copied", {
                action: 'removeClass',
                actionData: 'copied'
            });
    });

    AH.listen(document, 'keydown', chid, function() {
        hotkeys.setScope('choose' + chid);
    });


    function navigateDown() {
        var selected_opt = AH.find(chid, "#sortable .copied");
        var a = AH.find(chid, '.ks').length;
        if (selected_opt.classList.contains("copied")) {
            if (count == 0) {
                selected_opt.insertBefore(AH.find(chid, ".ks:nth(0)"));
            } else {
                selected_opt.insertAfter(AH.find(chid, ".ks:nth(" + count + ")"));
            }
        }
        //count_prev = ((count == 0) ? (a - 1) : (count - 1));
        var ks_fill = AH.find(chid, ".ks:nth(" + count + ")");
        //var prev_ks = AH.find(chid, ".ks:nth(" + (count - 1) + ")");
        ks_fill.focus();
        if (count == (a - 1)) {
            count = 0;
        } else {
            count++;
        }
    }




    function tabMove(element, type = 1) {
        if (element.id) {
            let ks_element = AH.selectAll('.ks');
            let focus_index = -1;
            for (let index = 0; index < ks_element.length; index++) {
                if (element.id == ks_element[index].id) {
                    if (type) {
                        if (index == (ks_element.length - 1)) {
                            focus_index = 0;
                        } else {
                            focus_index = index + 1;
                        }
                    } else {
                        if (index == 0) {
                            focus_index = ks_element.length - 1;
                        } else {
                            focus_index = index - 1;
                        }
                    }
                    break;
                }
            }

            if (focus_index != -1) {
                ks_element[focus_index].focus();
            }
        }
    }  




    function activateKs() {
        count = 0;
        //count_prev = 0;
        //ks_activated = true;
        navigateDown();
    }

    
    function checkFocus() { // Fixed @eslint issue
        var is_focus = false;
        let elements = AH.selectAll("#sortable li");
        let focus_ele = AH.select(":focus");

        if (focus_ele.nodeName) {
            let focus_id = focus_ele.getAttribute('id');
            for (let index = 0; index < elements.length; index++) {
                if (focus_id == elements[index].getAttribute('id')) {
                    is_focus = true;
                    break;
                }
            }
        }

        return is_focus;
    }

    
    hotkeys('down, up, enter, alt+down, delete, left, right, tab, shift+tab, esc', 'choose' + chid, function(event, handler) {
        switch (handler.key) {
            case 'up' :
            case 'left':
                if (checkFocus()) {
                    
                    var selected_opt = AH.find(chid,"#sortable .copied");
                    
                    var b = AH.find(chid,'.ks').length;
                    let focus_element = AH.select('.ks:focus');
                    let ks_element = AH.selectAll('.ks')[0];
                    
                    if (focus_element.id == ks_element.id) {
                        if (selected_opt && selected_opt.classList.contains("copied")) {
                            selected_opt.insertAfter(AH.find(chid,".ks:nth("+(b-1)+")"));
                            selected_opt.focus();
                        } else {
                            
                            AH.selectAll(".ks")[AH.selectAll(".ks").length-1].focus();
                        }
                    } else {
                        if (selected_opt &&  selected_opt.classList.contains("copied")) {
                            selected_opt.insertBefore(AH.find(chid,"#sortable .copied").previousElementSibling);
                            selected_opt.focus();
                        } else {
                            tabMove(focus_element,0);
                        }
                    }
                    event.preventDefault();
                }
            break;
            case 'down' :
            case 'right':
                if (checkFocus())  {
                    console.log('check');
                    
                    var selected_opt = AH.find(chid,'#sortable .copied');
                    
                    var a = AH.selectAll(chid+' .ks').length;
                    
                    let focus_element = AH.select('.ks:focus');
                    let ks_last_element = AH.selectAll('.ks')[AH.selectAll('.ks').length - 1];
                    if(focus_element.id == ks_last_element.id) {
                        if (selected_opt && selected_opt.classList.contains("copied")) {
                            selected_opt.insertBefore(AH.find(chid,".ks:nth(0)"));
                            selected_opt.focus();
                        } else {
                            
                            AH.selectAll('.ks')[0].focus();
                        }
                    } else {
                        
                            if (selected_opt && selected_opt.classList.contains("copied")) {
                                
                                var clone = AH.find(chid,'#sortable .copied').nextSibling.cloneNode(true);
                                selected_opt.insertAfter(clone,AH.find(chid,'#sortable .copied').nextSibling);
                                
                                selected_opt.focus();
                            } else {
                                tabMove(focus_element,1);
                            }
                        
                    }
                    event.preventDefault();
                }
            break;
            case 'enter':
                if (checkFocus()) {
                    event.preventDefault();
                    
                    if (AH.find(chid, "#sortable").getAttribute("checkseq") == "0") {
                        
                        ucChoose.ow = AH.find(chid, '#sortable li:focus', 'all')[0];
                        
                        ucChoose.t = setTimeout(function() {
                            ucChoose.setUserAns(chid, ucChoose.ow, true);
                        }, 100);
                        
                    } else if (AH.find(chid, "#sortable").getAttribute("checkseq") == "1") {
                        
                        if (AH.find(chid, '#sortable li:focus').classList.contains("copied")) {
                            
                            ucChoose.ow = AH.find(chid, '#sortable li:focus', 'all')[0];
                            
                            ucChoose.t = setTimeout(function() {
                                
                                ucChoose.setUserAns(chid, ucChoose.ow, ((AH.find(chid, "#sortable li:focus").classList.contains("choose_sel")) ? false : true));
                            }, 100);
                            
                            AH.find(chid, '#sortable li:focus', {
                                action: 'removeClass',
                                actionData: 'copied'
                            });
                        } else {
                            
                            ucChoose.ow = AH.find(chid, '#sortable li:focus', 'all')[0];
                            
                            ucChoose.t = setTimeout(function() {
                                
                                ucChoose.setUserAns(chid, ucChoose.ow, ((AH.find(chid, "#sortable li:focus").classList.contains("choose_sel")) ? false : true));
                            }, 100);
                            
                            AH.find(chid, '#sortable li:focus', {
                                action: 'addClass',
                                actionData: 'copied'
                            });
                            //copied_id = jQuery(chid).find("#sortable li:focus").attr('optid')
                            //copied_id = AH.find(chid, '#sortable li:focus').getAttribute('optid');
                        }
                    }

                }
                break;
            case 'alt+down':
                activateKs();
                break;
            case 'delete':
                if (checkFocus()) {
                    
                    ucChoose.ow = AH.find(chid, '#sortable li:focus', 'all')[0];
                    
                    ucChoose.t = setTimeout(function() {
                        ucChoose.setUserAns(chid, ucChoose.ow, true);
                    }, 100);
                }
                break;
            case 'tab':
                if (checkFocus()) {
                    AH.find(chid, '#sortable .copied', {
                        action: 'removeClass',
                        actionData: 'copied'
                    });
                }
                let focus_ele = AH.selectAll(".ks:focus");
                let ks_last = AH.selectAll(".ks")[AH.selectAll(".ks").length - 1];
                
                if (focus_ele.id == ks_last.id) {
                    event.preventDefault();
                    
                    AH.selectAll(".ks")[0].focus();
                }
                break;
            case 'shift+tab':
                if (checkFocus()) {
                    
                    AH.find(chid, '#sortable .copied', {
                        action: 'removeClass',
                        actionData: 'copied'
                    });
                }
                focus_ele = AH.selectAll(".ks:focus");
                ks_last = AH.selectAll(".ks")[AH.selectAll(".ks").length - 1];
                if (focus_ele.id == ks_last.id) {
                    event.preventDefault();
                    //jQuery('.ks').last().focus();
                    AH.selectAll(".ks")[AH.selectAll(".ks").length].focus();
                }
                break;
            case 'esc':
                if (checkFocus()) {
                    event.preventDefault();
                    
                    AH.find(chid, '#sortable .copied', {
                        action: 'removeClass',
                        actionData: 'copied'
                    });
                    AH.selectAll(".ks")[AH.selectAll(".ks").length - 1].focus();
                    AH.selectAll(".ks")[AH.selectAll(".ks").length - 1].blur();
                }
                break;
        }
    });
    hotkeys.setScope('choose' + chid);
};

ucChoose.cmd = function(obj, e) {
    ucChoose.shouldselect = true;
    //var onwhich = e.srcElement ? e.srcElement : e.target;
};


ucChoose.cmm = function(obj, e) {
    if (!e) {
        e = window.event;
    }
    var onwhich = e.srcElement ? e.srcElement : e.target;
    if (onwhich.classList.contains("prefix")) {
        onwhich = onwhich.parentElement;
    }
    if (onwhich) { // its fix not null
        
        var ua = onwhich.getAttribute("user_answer");
        ucChoose.shouldselect = false;
        if (ua == "0") {
            ucChoose.shouldselect = true;
        }
    }
};


ucChoose.cmu = function(chid, e, from_sortable = false) {
    if (from_sortable) {
        ucChoose.ow = e;
    } else {
        if (!e) {
            e = window.event;
        }
        ucChoose.ow = e.srcElement ? e.srcElement : e.target;
    }
    if ((ucChoose.ow).classList.contains("prefix")) {
        ucChoose.ow = (ucChoose.ow).parentElement;
    }
    ucChoose.t = setTimeout(function() {
        ucChoose.setUserAns(chid, ucChoose.ow, ucChoose.shouldselect);
    }, 100);
    //ucChoose.t=setTimeout("ucChoose.setUserAns('"+chid+"',ucChoose.ow,"+ucChoose.shouldselect+")",100);
};




ucChoose.setUserAns = function(chid, ow, select) {
    if (ow.tagName == "IMG") {
        
        ua = AH.parent(ow, 'li').getAttribute("user_answer");
        
        us = AH.parent(ow, 'li').getAttribute("user_seq");
        
        cs = AH.find(chid, '#sortable').getAttribute("checkSeq");
    } else {
        
        ua = ow.getAttribute("user_answer");
        
        us = ow.getAttribute("user_seq");
        
        cs = AH.find(chid, "#sortable").getAttribute("checkSeq");
    }

    if (ow.tagName == "UL") {
        ucChoose.shouldselect = false;
        return;
    }

    if (select) {
        if (ua == "1") {
            if (ow.tagName == "IMG") {
                
                let owLi = AH.parent(ow, 'li');
                AH.setAttr(owLi, {
                    "user_answer": 0
                });
                
                owLi.classList.remove("choose_sel");
                if (cs != "1") {
                    
                    AH.find(owLi, '.prefix', 'all').classList.remove("tick");
                }
            } else {
                
                AH.setAttr(ow, {
                    "user_answer": 0
                });
                
                ow.classList.remove('choose_sel');
                if (cs != "1") {
                    
                    AH.find(ow, '.prefix', {
                        action: 'removeClass',
                        actionData: 'tick'
                    });
                }
            }
        } else {
            if (ow.tagName == "IMG") {
                
                AH.find(document.querySelector(ow).parentElement, 'li', 'all').setAttribute("user_answer", 1);
                
                AH.select(ow.parentElement).classList.add("choose_sel");

                if (cs != "1") {
                    
                    let owli = AH.parent(ow, 'li');
                    AH.find(owli, '.prefix').classList.add("tick");
                }
            } else {
                
                AH.setAttr(ow, {
                    "user_answer": 1
                });
                
                ow.classList.add('choose_sel');
                if (cs != "1") {
                    
                    AH.find(ow, '.prefix', {
                        action: 'addClass',
                        actionData: 'tick'
                    });
                }
            }
        }
    }


    if (cs == "1") {
        var count = 1;
        AH.find(chid, '#sortable li', 'all').forEach((data) => {
            if (data.getAttribute("user_answer") == 1) {
                AH.find(data, '.prefix').innerHTML = count;
                AH.setAttr(data, {
                    "user_seq": count
                });
                count++;
            } else {
                AH.find(data, '.prefix').innerHTML = "";
                AH.setAttr(data, {
                    "user_seq": 0
                });
            }
        });
    }



    ucChoose.CheckResultchoose(chid);
    ucChoose.shouldselect = false;
};





ucChoose.removeItem = function() { // fixed @eslint issue
    AH.remove(e1.parentElement.parentElement);
    let choose_item = document.querySelectorAll('.choose_item_container').innerHTML;
    if (choose_item.trim().length <= 200) {
        document.querySelector(".message_content").style.display = 'block';
    } else {
        document.querySelector(".message_content").style.display = 'none';
    }
};



ucChoose.addItem = function() {
    
    document.querySelector('.message_content').style.display = "none";
    AH.insert('.choose_item_container', '<div class="clearfix mt choose_options"><div class="col-md-12 mt-head"><input class="choose_compls" type="checkbox"><textarea></textarea><span class="remove-item icomoon-24px-delete-1"></span></div></div>', 'afterbegin');
};


ucChoose.setDragSequence = function(chid, el, ty) {
    var count = 1;
    AH.find(chid, '#sortable li', 'all').forEach((_this) => {
        AH.setAttr(_this, {
            "user_seq": count
        });
        count++;
    });

    if (ty == 0) {
        AH.find(chid, '#sortable li', 'all').forEach((_this) => {
            _this.classList.remove('choose_sel');
        });
    }
    ucChoose.CheckResultSentenceChoose(chid);
};


ucChoose.CheckResultSentenceChoose = function(chid) {
    var yourScore = true;
    let res = {};
    cs = AH.find("#choose", "#sortable").getAttribute("checkSeq");
    //var i = 1
    var ansxml = "";
    AH.find(chid, '#sortable li', 'all').forEach((data) => {
        us = data.getAttribute("user_seq");
        ca = data.getAttribute("correct_seq");
        ua = data.getAttribute("user_answer");
        if (us != ca && data.getAttribute("correct_seq") != 0) {
            yourScore = false;
            //console.log('1');
        }
        ansxml += data.getAttribute("optID") + "|" + us + "|" + ua + ",";
    });
    ucChoose.userAnsXML = '<SMANS type="6"><list useranswer="' + ansxml + '" /></SMANS>';
    ISSPECIALMODULEUSERXMLCHANGE = 1;
    if (document.querySelector("#special_module_user_xml"))
        document.querySelector("#special_module_user_xml").value = ucChoose.userAnsXML;
    if (document.querySelector("#answer"))
        AH.setAttr("#answer", {
            "checked": yourScore
        });

        res.u = ucChoose.userAnsXML;
        res.ans = yourScore;

    if (yourScore == true) {
        return (res);
    } else {
        return (res);
    }
};

ucChoose.dragSenParItem = function(chid) {
    

    new Sortable(AH.find(chid, "#sortable"), {
        // Element dragging started
        onStart: function(evt) {
            console.log('start =>' + evt);
        // this.copyHelper = ui.clone().insertAfter(ui);
    // 	    jQuery(this).data('copied', false);
    // 	   	return ui.clone().css({'background':'#DCDCDC','max-height':'100px','max-width':'400px','opacity':'0.5','overflow':'hidden','min-height':'35px'});
        

        },
        onEnd: function(evt) {

            console.log('end =>' + evt);
            //var copied = jQuery(this).data('copied');
            // 	    if(!copied) {
            // 			console.log(this.copyHelper);
            // 	        this.copyHelper.remove();
            // 	    }			    
            // 	    this.copyHelper = null;
            ucChoose.setDragSequence(chid, evt.item);
            
        }
    }); // Need to fixed it

    
    ucChoose.CheckResultchoose(chid);
};


ucChoose.setActiveClass = function(chid, correctans) {
    var cs = AH.find(chid, '#sortable').getAttribute("checkSeq");
    AH.find(chid, '#sortable li', 'all').forEach((_this) => {
        // if (correctans == 0 && _this.getAttribute('correct_seq') == _this.getAttribute('user_seq') && _this.getAttribute('correct_seq') != 0) {
        //     _this.classList.add("choose_sel");
        // } else if (correctans == 1 && _this.getAttribute('is_correct') != 0) {
        //     //_this.classList.add("choose_sel");
        //     AH.select(_this, 'addClass', 'choose_sel');
        // } else {
        //     //_this.classList.remove("choose_sel");
        //     AH.select(_this, 'removeClass', 'choose_sel');
        // }

        // if (cs == "1") {
        //     if (_this.getAttribute(cans) == 1) {
        //         var cseq = _this.getAttribute(seq);
        //     } else {
        //         cseq = 0;
        //     }

        //     if (cseq > 0) {
        //         //_this.find('.prefix').html(cseq);
        //         AH.find(_this, '.prefix').innerHTML = cseq;
        //     } else {
        //         //_this.find('.prefix').html("");
        //         AH.find(_this, '.prefix').innerHTML = "";
        //     }
        //     //_this.find('.prefix').removeClass("tick");
        //     AH.find(_this, '.prefix', {
        //         action: 'removeClass',
        //         actionData: 'tick'
        //     })
        //     // AH.select(_this,'removeClass','tick');
        // } else {
        //     if (_this.getAttribute(cans) == 1) {
        //         //_this.find('.prefix').addClass("tick");
        //         AH.find(_this, '.prefix', {
        //             action: 'addClass',
        //             actionData: 'tick'
        //         })
        //         //_this.classList.add('tick');
        //     } else {
        //         //_this.find('.prefix').removeClass("tick");
        //         AH.find(_this, '.prefix', {
        //             action: 'removeClass',
        //             actionData: 'tick'
        //         })
        //         //AH.select(_this,'removeClass','tick');
        //         // _this.classList.remove('tick');
        //     }
        // }

        if (_this.getAttribute("user_answer") == 1 && correctans == 0) {
            
            _this.classList.add("choose_sel");
        } else if (_this.getAttribute("is_correct") == 1 && correctans == 1) {
            _this.classList.add("choose_sel");
        } else {
            
            _this.classList.remove("choose_sel");
        }




    });
};


ucChoose.removeActive = function(chid) {
    AH.find(chid, '#sortable li', 'all').forEach((_this) => {
        _this.classList.remove("choose_sel");
    });
};

/*ajax based code*/

ucChoose.labBinded = true;
ucChoose.sortable = false;



ucChoose.modeOn = function(modeType) {
    AH.selectAll('.test', 'addClass', 'h');
    AH.selectAll('.review', 'addClass', 'h');
    if (modeType) {
        AH.selectAll('.review', 'removeClass', 'h');
        ucChoose.unBindLab();
        if (typeof hotkeys != "undefined") hotkeys.unbind('down,up,enter,alt+down,delete,left,right,tab,shift+tab,esc', 'choose' + ucChoose.ajax_eId);
        AH.find(ucChoose.ajax_eId, '.copied', 'all').forEach((_el) => {
            _el.classList.remove("copied");
        });
        if (document.querySelector('#show_ans_group button') != null) {
            document.querySelector('#show_ans_group button').forEach((_this) => {
                if (_this.classList.contains("correct-ans btn-primary")) {
                    ucChoose.showAns(ucChoose.ajax_eId, _this, 'c');
                } else if (_this.classList.contains("your-ans btn-primary")) {
                    ucChoose.showAns(ucChoose.ajax_eId, _this, 'u');
                }
            });
        }
    } else {
        AH.selectAll('.test', 'removeClass', 'h');
        setTimeout(function() {
            ucChoose.callBindKey();
        }, 100);
        ucChoose.review(ucChoose.ajax_eId, 0);
        ucChoose.bindLab();
    }
};

ucChoose.callBindKey = function() {
    if (typeof hotkeys != "undefined") {
        ucChoose.bindKeyup(ucChoose.ajax_eId);
    } else {
        if (ucChoose.errorCatchFlag <= 50) {
            setTimeout(function() {
                ucChoose.callBindKey();
            }, 100);
        } else {
            console.log("hotkeys not found");
        }
        ucChoose.errorCatchFlag++;
    }
};



ucChoose.unBindLab = function() {
    ucChoose.labBinded = false;
    if (document.querySelector(ucChoose.ajax_eId).getAttribute('type') == "normal") {
        AH.find(ucChoose.ajax_eId, '#sortable').removeAttribute('onmouseup onmousemove onmousedown');
    }
    if (AH.find(ucChoose.ajax_eId, '#sortable').classList.contains('ui-sortable')) {
        ucChoose.sortable = true;
        //jQuery(ucChoose.ajax_eId).find("#sortable").sortable('destroy');	// comment
    }
};



ucChoose.bindLab = function() {
    ucChoose.labBinded = true;
     //setTimeout(function() {
         //if (document.querySelector(ucChoose.ajax_eId).getAttribute('type') == "normal") {
            /*jQuery(ajax_eId).find("#sortable").attr({
                "onmouseup":"ucChoose.cmu('"+ajax_eId+"',event);",
                "onmousemove":"ucChoose.cmm('"+ajax_eId+"',event);",
                "onmousedown":"ucChoose.cmd('"+ajax_eId+"',event);"
            });*/

        

            AH.bind(document.querySelector("#sortable"), 'mouseup', function(e) {
                ucChoose.cmu(ucChoose.ajax_eId, e);
            });


            AH.bind(document.querySelector("#sortable"), 'mousemove', function(e) {
                ucChoose.cmm(ucChoose.ajax_eId, e);
            });


            AH.bind(document.querySelector("#sortable"), 'mousedown', function(e) {
                ucChoose.cmd(ucChoose.ajax_eId, e);
                
            });

        //}
    //}, 200);

    if (!Array.isArray(AH.find(ucChoose.ajax_eId, "#sortable"))) {
        // commented
        new Sortable(AH.find(ucChoose.ajax_eId, "#sortable"), {
            animation: 150,
            onEnd: function (/**Event*/evt) {
                
                ucChoose.cmu(ucChoose.ajax_eId, evt.item, true);
                AH.select(ucChoose.ajax_eId).click();
                

                
                
            },
            
        });
        // jQuery(ucChoose.ajax_eId).find("#sortable").disableSelection(); // It's not using
    }

    if (document.querySelector(ucChoose.ajax_eId)?.getAttribute?.('type') == "sentence" || document.querySelector(ucChoose.ajax_eId)?.getAttribute?.('type') == "paragraph") {
        ucChoose.dragSenParItem(ucChoose.ajax_eId);
    }
};

/* clsSMChoose\ChooseNReorderPreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMChoose\\ChooseNReorderPreview.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i];
	child_ctx[28] = i;
	return child_ctx;
}

// (441:20) {#each localCData as data,i}
function create_each_block(ctx) {
	let li;
	let raw_value = /*setInnerHtml*/ ctx[9](/*data*/ ctx[26]) + "";
	let li_key_value;
	let li_class_value;
	let li_is_correct_value;
	let li_optid_value;
	let li_correct_seq_value;
	let li_user_answer_value;
	let li_u_value;
	let li_user_seq_value;
	let li_id_value;

	const block = {
		c: function create() {
			li = element("li");
			attr_dev(li, "key", li_key_value = /*i*/ ctx[28]);

			attr_dev(li, "class", li_class_value = /*state*/ ctx[3].isSentence == "1"
			? "sentence_li"
			: /*state*/ ctx[3].isParagraph == "1"
				? "paragraph_li"
				: '');

			attr_dev(li, "is_correct", li_is_correct_value = /*data*/ ctx[26].isCorrect);
			attr_dev(li, "optid", li_optid_value = /*data*/ ctx[26].optid);
			attr_dev(li, "correct_seq", li_correct_seq_value = /*data*/ ctx[26].seq);
			attr_dev(li, "user_answer", li_user_answer_value = /*data*/ ctx[26].user_answer);
			attr_dev(li, "u", li_u_value = /*data*/ ctx[26].user_answer);

			attr_dev(li, "user_seq", li_user_seq_value = /*data*/ ctx[26].user_seq
			? /*data*/ ctx[26].user_seq
			: /*i*/ ctx[28]);

			attr_dev(li, "id", li_id_value = 'id' + /*i*/ ctx[28]);
			attr_dev(li, "tabindex", "0");
			add_location(li, file, 442, 28, 12258);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			li.innerHTML = raw_value;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*localCData*/ 4 && raw_value !== (raw_value = /*setInnerHtml*/ ctx[9](/*data*/ ctx[26]) + "")) li.innerHTML = raw_value;
			if (dirty & /*state*/ 8 && li_class_value !== (li_class_value = /*state*/ ctx[3].isSentence == "1"
			? "sentence_li"
			: /*state*/ ctx[3].isParagraph == "1"
				? "paragraph_li"
				: '')) {
				attr_dev(li, "class", li_class_value);
			}

			if (dirty & /*localCData*/ 4 && li_is_correct_value !== (li_is_correct_value = /*data*/ ctx[26].isCorrect)) {
				attr_dev(li, "is_correct", li_is_correct_value);
			}

			if (dirty & /*localCData*/ 4 && li_optid_value !== (li_optid_value = /*data*/ ctx[26].optid)) {
				attr_dev(li, "optid", li_optid_value);
			}

			if (dirty & /*localCData*/ 4 && li_correct_seq_value !== (li_correct_seq_value = /*data*/ ctx[26].seq)) {
				attr_dev(li, "correct_seq", li_correct_seq_value);
			}

			if (dirty & /*localCData*/ 4 && li_user_answer_value !== (li_user_answer_value = /*data*/ ctx[26].user_answer)) {
				attr_dev(li, "user_answer", li_user_answer_value);
			}

			if (dirty & /*localCData*/ 4 && li_u_value !== (li_u_value = /*data*/ ctx[26].user_answer)) {
				attr_dev(li, "u", li_u_value);
			}

			if (dirty & /*localCData*/ 4 && li_user_seq_value !== (li_user_seq_value = /*data*/ ctx[26].user_seq
			? /*data*/ ctx[26].user_seq
			: /*i*/ ctx[28])) {
				attr_dev(li, "user_seq", li_user_seq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(441:20) {#each localCData as data,i}",
		ctx
	});

	return block;
}

// (462:5) {:else}
function create_else_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Sequencing of the selected item is not required. Click to select items.");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(462:5) {:else}",
		ctx
	});

	return block;
}

// (460:5) {#if state.allowSort == 1 || state.isSentence == 1 || state.isParagraph == 1}
function create_if_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Click to select. Drag and Drop to set sequence.");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(460:5) {#if state.allowSort == 1 || state.isSentence == 1 || state.isParagraph == 1}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let div3;
	let center0;
	let itemhelper;
	let t0;
	let center1;
	let div2;
	let div0;
	let t1_value = /*state*/ ctx[3].headingCorrect + "";
	let t1;
	let t2;
	let ul;
	let ul_totalcorrectans_value;
	let ul_checkseq_value;
	let ul_style_value;
	let t3;
	let div1;
	let div2_type_value;
	let current;
	let mounted;
	let dispose;

	itemhelper = new ItemHelper({
			props: {
				handleReviewClick: /*handleReviewMode*/ ctx[10],
				reviewMode: /*isReview*/ ctx[0]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[4]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[5]);
	let each_value = /*localCData*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	function select_block_type(ctx, dirty) {
		if (/*state*/ ctx[3].allowSort == 1 || /*state*/ ctx[3].isSentence == 1 || /*state*/ ctx[3].isParagraph == 1) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			main = element("main");
			div3 = element("div");
			center0 = element("center");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			center1 = element("center");
			div2 = element("div");
			div0 = element("div");
			t1 = text(t1_value);
			t2 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t3 = space();
			div1 = element("div");
			if_block.c();
			add_location(center0, file, 415, 8, 11194);
			attr_dev(div0, "class", "choose_header font17 pl-4");
			add_location(div0, file, 428, 16, 11571);
			attr_dev(ul, "id", "sortable");
			attr_dev(ul, "totalcorrectans", ul_totalcorrectans_value = /*state*/ ctx[3].totalcorrectans);
			attr_dev(ul, "checkseq", ul_checkseq_value = /*state*/ ctx[3].allowSort);
			attr_dev(ul, "class", "ui-sortable w-auto mt-0 p-2");
			attr_dev(ul, "style", ul_style_value = 'border-left:10px solid #d9e7fd;border-right: 10px solid #d9e7fd');
			add_location(ul, file, 429, 16, 11656);
			attr_dev(div1, "class", "choose_bottom pl-4");
			attr_dev(div1, "id", "instruction");
			add_location(div1, file, 458, 16, 13068);
			attr_dev(div2, "id", /*containerID*/ ctx[1]);

			attr_dev(div2, "type", div2_type_value = /*state*/ ctx[3].isSentence == "1"
			? "sentence"
			: /*state*/ ctx[3].isParagraph == "1"
				? "paragraph"
				: 'normal');

			attr_dev(div2, "class", "bg-white");
			add_location(div2, file, 427, 12, 11424);
			add_location(center1, file, 426, 8, 11402);
			add_location(div3, file, 414, 4, 11179);
			add_location(main, file, 413, 0, 11167);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div3);
			append_dev(div3, center0);
			mount_component(itemhelper, center0, null);
			append_dev(div3, t0);
			append_dev(div3, center1);
			append_dev(center1, div2);
			append_dev(div2, div0);
			append_dev(div0, t1);
			append_dev(div2, t2);
			append_dev(div2, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			append_dev(div2, t3);
			append_dev(div2, div1);
			if_block.m(div1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(ul, "mouseup", /*cmu*/ ctx[6].bind(this), false, false, false),
					listen_dev(ul, "mousemove", /*cmm*/ ctx[7].bind(this), false, false, false),
					listen_dev(ul, "mousedown", /*cmd*/ ctx[8].bind(this), false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const itemhelper_changes = {};
			if (dirty & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if ((!current || dirty & /*state*/ 8) && t1_value !== (t1_value = /*state*/ ctx[3].headingCorrect + "")) set_data_dev(t1, t1_value);

			if (dirty & /*state, localCData, setInnerHtml*/ 524) {
				each_value = /*localCData*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*state*/ 8 && ul_totalcorrectans_value !== (ul_totalcorrectans_value = /*state*/ ctx[3].totalcorrectans)) {
				attr_dev(ul, "totalcorrectans", ul_totalcorrectans_value);
			}

			if (!current || dirty & /*state*/ 8 && ul_checkseq_value !== (ul_checkseq_value = /*state*/ ctx[3].allowSort)) {
				attr_dev(ul, "checkseq", ul_checkseq_value);
			}

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (!current || dirty & /*containerID*/ 2) {
				attr_dev(div2, "id", /*containerID*/ ctx[1]);
			}

			if (!current || dirty & /*state*/ 8 && div2_type_value !== (div2_type_value = /*state*/ ctx[3].isSentence == "1"
			? "sentence"
			: /*state*/ ctx[3].isParagraph == "1"
				? "paragraph"
				: 'normal')) {
				attr_dev(div2, "type", div2_type_value);
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
			if (detaching) detach_dev(main);
			destroy_component(itemhelper);
			destroy_each(each_blocks, detaching);
			if_block.d();
			mounted = false;
			run_all(dispose);
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
	let xml = data;

	// convert headingCorrect attribute to headingcorrect
	if (xml.smxml.list._headingCorrect) {
		xml.smxml.list._headingcorrect = xml.smxml.list._headingCorrect;
		delete xml.smxml.list._headingCorrect;
	}

	// convert allowSort attribute to allowsort
	if (xml.smxml.list._allowSort) {
		xml.smxml.list._allowsort = xml.smxml.list._allowSort;
		delete xml.smxml.list._allowSort;
	}

	// convert isParagraph attribute to isparagraph
	if (xml.smxml.list._isParagraph) {
		xml.smxml.list._isparagraph = xml.smxml.list._isParagraph;
		delete xml.smxml.list._isParagraph;
	}

	// convert isSentence attribute to issentence
	if (xml.smxml.list._isSentence) {
		xml.smxml.list._issentence = xml.smxml.list._isSentence;
		delete xml.smxml.list._isSentence;
	}

	return xml;
}

// returns the shuffled array
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ChooseNReorderPreview', slots, []);
	let { cmed } = $$props;
	let { showAns } = $$props;
	let { xml } = $$props;
	let { stopPreviewUpdate } = $$props;
	let { editorState } = $$props;
	let { isReview } = $$props;
	let { uxml } = $$props;

	//alert("fisrt",ucChoose.result);
	let containerID = cmed ? "choose" + cmed : "choose";

	ucChoose.ajax_eId = cmed ? "#choose" + cmed : "#choose";
	var localCData = [];
	let state = {};

	let stateData = writable({
		xml: "",
		headingCorrect: "",
		allowSort: "",
		isSentence: "",
		isParagraph: "",
		chooseClass: "",
		totalcorrectans: "",
		stateXMLToJSON: ""
	});

	//let onError = "";
	let unsubscribe = stateData.subscribe(items => {
		$$invalidate(3, state = items);
	});

	// for displaying the answer
	function displayAns() {
		var ans = "";

		// create smans and return correct if answer is correct
		if (state.isSentence == "1" || state.isParagraph == "1") {
			ans = ucChoose.CheckResultchoose("#" + containerID);
		} else {
			ans = ucChoose.CheckResultchoose("#" + containerID);
		}

		onUserAnsChange({ uXml: ans.u, ans: ans.b });

		// show the answer wether the answer is correct or not
		if (editorState) {
			showAns(ans.b ? "Correct" : "Incorrect");
		}
	}

	// this function executes just after render
	onMount(() => {
		getHeight();

		// binding up the events
		AH$1.listen(document, 'click', "#" + containerID, function () {
			setTimeout(
				function () {
					displayAns();
				},
				100
			);
		});

		AH$1.listen(document, 'click', '#show_ans_group button', _this => {
			AH$1.removeClass('#show_ans_group button', 'active');
			AH$1.addClass(_this, 'active');
		});
	}); // new Sortable(AI.find(document,"#sortable"), {
	// 	onEnd: function(evt) {
	// 		console.log('checking ans');
	// 	}

	// })
	// if it is review mode then show the ans
	// if (window.isReviewMode) { done by feedback
	// this function returns the height of editorRender class	
	function getHeight() {
		AH$1.bind(document, 'click', function () {
			if (document.querySelector(".editorRender")) {
				let heights = document.querySelector(".editorRender").clientHeight;
				return heights;
			}
		});
	}

	// calls when review mode is on
	function setReview() {
		console.log('checking');
		disableMouse("none");
		ucChoose.modeOn("on");
		$$invalidate(0, isReview = true);
		ucChoose.review("#" + containerID, 0);
		AH$1.removeClass('#show_ans_group button', 'active');
		AH$1.removeClass('#show_ans_group .your-ans', 'active');
		displayAns();
	}

	// calls jsut after review mode is off from the setReview
	function unsetReview() {
		disableMouse("auto");
		$$invalidate(0, isReview = false);
		ucChoose.modeOn();
		ucChoose.review("#" + containerID, 0);
	}

	// this function added the pointerEvents property in all li of element having id sortable
	function disableMouse(event) {
		//alert('check');
		AH$1.selectAll("#sortable li").forEach(_this => {
			_this.style.pointerEvents = event;
		});
	}

	// this function calls whenever there is change in state or props
	afterUpdate(() => {
		// for the change in xml 
		if (xml != state.xml) {
			if (stopPreviewUpdate == true) return false;

			if (cmed) {
				$$invalidate(1, containerID = "choose" + cmed);
				ucChoose.ajax_eId = "#choose" + cmed;
			}

			$$invalidate(3, state.xml = xml, state);

			// convert xml to json using XMLToJSON func
			$$invalidate(3, state.stateXMLToJSON = XMLToJSON(xml), state);

			// load the module on the basis of the basis of updated xml
			loadModule(state.stateXMLToJSON);

			var timer = setTimeout(
				function () {
					// if there isno user ans found then remove tha nas
					if (!uxml) {
						removeUserAns();
					}

					ucChoose.removeActive("#" + containerID);

					//ucChoose.readyThis("#"+containerID);
					ucChoose.review("#" + containerID, 0);

					ucChoose.init("#" + containerID);
					ucChoose.CheckResultchoose("#" + containerID);
					let sortable = new Sortable(AH$1.find("#" + containerID, "#sortable"), { animation: 150 });

					if (state.allowSort != "1" || state.isSentence == "1" || state.isParagraph == "1") {
						new Sortable(AH$1.find("#" + containerID, "#sortable"),
						{
								onEnd(evt) {
									var itemEl = evt.item;
									evt.to;
									evt.from;
									evt.oldIndex;
									evt.newIndex;
									evt.oldDraggableIndex;
									evt.newDraggableIndex;
									evt.clone;
									evt.pullMode;
								}
							});
					}

					if (state.isSentence == "1" || state.isParagraph == "1") {
						ucChoose.dragSenParItem("#" + containerID);
					} //ucChoose.removeActive("#"+containerID);

					clearTimeout(timer);
				},
				200
			);
		}
	});

	// function loads the module from the xml
	function loadModule(loadXml) {
		// parsing the xml for the preview
		parseXMLPreview(loadXml);

		// checking for user ans (uaXML)
		if (uxml) {
			//let uaXML = uxml;
			let uaXML = XMLToJSON(uxml);

			// if in uxml smans and list is found
			if (uaXML && uaXML.SMANS && uaXML.SMANS && uaXML.SMANS.list) {
				// split the user answer with ,
				let userans = uaXML.SMANS.list._useranswer.split(",");

				let newCData = [];

				// iterating through the userans and store the information in localCData
				for (let i in userans) {
					if (userans[i]) {
						let singleuxml = userans[i].split("|");

						for (let j in localCData) {
							if (localCData[j]['optid'] == singleuxml[0]) {
								$$invalidate(2, localCData[j]['user_answer'] = singleuxml[2], localCData);
								$$invalidate(2, localCData[j]['user_seq'] = singleuxml[1], localCData);
								newCData.push(localCData[j]);
							}
						}
					}
				}

				$$invalidate(2, localCData = newCData);
			}
		}
	}

	// this function parse the xml for preview
	function parseXMLPreview(MYXML) {
		try {
			$$invalidate(2, localCData = []);

			//forceUpdate();
			let cdata = MYXML.smxml.list.__cdata.split("\n");

			let corrSeqCount = 1;
			let countCorrectAns = 0;
			let optid = 0;

			// iterating through the cdata
			cdata.forEach(function (data, i) {
				if (cdata[i].trim() != "") {
					// if found * at first pos then means correctans
					if (cdata[i].trim().charAt(0) == "*") {
						countCorrectAns++;
					}

					// storing the value in localCData
					localCData.push({
						value: cdata[i].trim(),
						isCorrect: cdata[i].trim().charAt(0) == "*" ? "1" : "0",
						seq: cdata[i].trim().charAt(0) == "*" ? corrSeqCount : "0",
						user_answer: "0",
						optid
					});

					cdata[i].trim().charAt(0) == "*" ? corrSeqCount++ : "";
					optid++;
				}
			});

			// shuffling the array
			shuffleArray(localCData);

			// updating all the xml attributes to the lower case
			MYXML = updateAttrToLower(MYXML);

			// setting state 
			$$invalidate(3, state.headingCorrect = MYXML.smxml.list._headingcorrect, state);

			$$invalidate(
				3,
				state.allowSort = MYXML.smxml.list._allowsort
				? MYXML.smxml.list._allowsort
				: "0",
				state
			);

			$$invalidate(
				3,
				state.isSentence = MYXML.smxml.list._issentence
				? MYXML.smxml.list._issentence
				: "0",
				state
			);

			$$invalidate(
				3,
				state.isParagraph = MYXML.smxml.list._isparagraph
				? MYXML.smxml.list._isparagraph
				: "0",
				state
			);

			$$invalidate(3, state.totalcorrectans = countCorrectAns, state);

			//this.forceUpdate();
			var timer = setTimeout(
				(function () {
					//adding user_seq to each li
					AH$1.find("#sortable", ".sentence_li", "all").forEach(function (data, i) {
						data.setAttribute("user_seq", i + 1);
					});

					//forceUpdate();
					clearTimeout(timer);
				}).bind(this),
				200
			);
		} catch(error) {
			this.onError = error;

			console.warn({
				'error': error.message,
				'function name': 'parseXMLPreview',
				'File name': 'ChooseNReorderPreview.js'
			});
		}
	}

	function cmu(e) {
		if (state.isSentence != "1" && state.isParagraph != "1") {
			ucChoose.cmu("#" + containerID, e);
		}
	}

	function cmm(_this, e) {
		if (state.isSentence != "1" && state.isParagraph != "1") {
			ucChoose.cmm(_this, e);
		}
	}

	function cmd(_this, e) {
		if (state.isSentence != "1" && state.isParagraph != "1") {
			ucChoose.cmd(_this, e);
			ISSPECIALMODULEUSERXMLCHANGE = 1;
		}
	}

	// for removing the userans
	function removeUserAns() {
		AH$1.selectAll("#sortable li").forEach(_this => {
			_this.setAttribute("user_answer", "0");
			_this.setAttribute("style", "");
		});

		AH$1.selectAll("#sortable li .prefix").forEach(_this => {
			_this.innerHTML = "";
		});
	}

	// Return the html and css
	function setInnerHtml(item) {
		let htmlContent = '<div class="prefix pl-2 mr-2"' + (state.isSentence == "1" ? "nw" : "") + '"></div>' + (state.isParagraph == "1"
		? '<div class="pg_handle">&equiv;</div>'
		: "") + (item.value.charAt(0) == "*"
		? item.value.slice(1)
		: item.value);

		return htmlContent;
	}

	function handleReviewMode(mode, e) {
		//alert(mode);
		if (mode == 'c') {
			ucChoose.showAns('#' + containerID, e.currentTarget, 'c');
		} else {
			ucChoose.showAns('#' + containerID, e.currentTarget, 'u');
		}
	}

	const writable_props = [
		'cmed',
		'showAns',
		'xml',
		'stopPreviewUpdate',
		'editorState',
		'isReview',
		'uxml'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ChooseNReorderPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('cmed' in $$props) $$invalidate(11, cmed = $$props.cmed);
		if ('showAns' in $$props) $$invalidate(12, showAns = $$props.showAns);
		if ('xml' in $$props) $$invalidate(13, xml = $$props.xml);
		if ('stopPreviewUpdate' in $$props) $$invalidate(14, stopPreviewUpdate = $$props.stopPreviewUpdate);
		if ('editorState' in $$props) $$invalidate(15, editorState = $$props.editorState);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(16, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		onMount,
		ucChoose,
		writable,
		ItemHelper,
		AH: AH$1,
		XMLToJSON,
		onUserAnsChange,
		Sortable,
		cmed,
		showAns,
		xml,
		stopPreviewUpdate,
		editorState,
		isReview,
		uxml,
		containerID,
		localCData,
		state,
		stateData,
		unsubscribe,
		displayAns,
		getHeight,
		setReview,
		unsetReview,
		disableMouse,
		loadModule,
		parseXMLPreview,
		updateAttrToLower,
		cmu,
		cmm,
		cmd,
		shuffleArray,
		removeUserAns,
		setInnerHtml,
		handleReviewMode
	});

	$$self.$inject_state = $$props => {
		if ('cmed' in $$props) $$invalidate(11, cmed = $$props.cmed);
		if ('showAns' in $$props) $$invalidate(12, showAns = $$props.showAns);
		if ('xml' in $$props) $$invalidate(13, xml = $$props.xml);
		if ('stopPreviewUpdate' in $$props) $$invalidate(14, stopPreviewUpdate = $$props.stopPreviewUpdate);
		if ('editorState' in $$props) $$invalidate(15, editorState = $$props.editorState);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(16, uxml = $$props.uxml);
		if ('containerID' in $$props) $$invalidate(1, containerID = $$props.containerID);
		if ('localCData' in $$props) $$invalidate(2, localCData = $$props.localCData);
		if ('state' in $$props) $$invalidate(3, state = $$props.state);
		if ('stateData' in $$props) stateData = $$props.stateData;
		if ('unsubscribe' in $$props) unsubscribe = $$props.unsubscribe;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isReview*/ 1) {
			 {
				setTimeout(
					function () {
						if (isReview) {
							setReview();
						} else {
							unsetReview();
						}
					},
					200
				);
			}
		}
	};

	return [
		isReview,
		containerID,
		localCData,
		state,
		setReview,
		unsetReview,
		cmu,
		cmm,
		cmd,
		setInnerHtml,
		handleReviewMode,
		cmed,
		showAns,
		xml,
		stopPreviewUpdate,
		editorState,
		uxml
	];
}

class ChooseNReorderPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			cmed: 11,
			showAns: 12,
			xml: 13,
			stopPreviewUpdate: 14,
			editorState: 15,
			isReview: 0,
			uxml: 16
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChooseNReorderPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*cmed*/ ctx[11] === undefined && !('cmed' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'cmed'");
		}

		if (/*showAns*/ ctx[12] === undefined && !('showAns' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'showAns'");
		}

		if (/*xml*/ ctx[13] === undefined && !('xml' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'xml'");
		}

		if (/*stopPreviewUpdate*/ ctx[14] === undefined && !('stopPreviewUpdate' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'stopPreviewUpdate'");
		}

		if (/*editorState*/ ctx[15] === undefined && !('editorState' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'editorState'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'isReview'");
		}

		if (/*uxml*/ ctx[16] === undefined && !('uxml' in props)) {
			console_1.warn("<ChooseNReorderPreview> was created without expected prop 'uxml'");
		}
	}

	get cmed() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set cmed(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get stopPreviewUpdate() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stopPreviewUpdate(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<ChooseNReorderPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<ChooseNReorderPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ChooseNReorderPreview;
//# sourceMappingURL=ChooseNReorderPreview-a125a7fc.js.map
