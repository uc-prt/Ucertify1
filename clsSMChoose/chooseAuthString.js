/**
 *  File Name   : chooseAuthString.js
 *  Description : Functions for all Choose and reorder AnswerChecking Module
 *	Author      : Sundaram Tripathi
 *  Version     : 1.0
 *  Package     : pe-gold
 *  Last update : 31 Jan 2021
 */
import JUI from '../src/libs/javscript_helper/JUI';
import hotkeys from 'hotkeys-js';
import Sortable from 'sortablejs';



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
})


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
    })



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

}

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
}


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
    })
    list.forEach((_this) => {
        AH.find(chid, '#sortable').append(_this);
    })
}



ucChoose.togseq = function(chid) {
    var cs = AH.find(chid, "#sortable").getAttribute("checkSeq");
    AH.find(chid, '#sortable').setAttribute("checkSeq", ((cs == "1") ? "0" : "1"));
    AH.find(chid, '#instruction').innerHTML = ((cs == "1") ? "" : "Sequence Important");
}




ucChoose.review = function(chid, correctans) {
    var cs = document.querySelector(chid)?.querySelector('#sortable')?.getAttribute("checkSeq")
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
                })
            } else {
                if (_this.getAttribute(cans) == 1) {
                    AH.find(_this, '.prefix', {
                        action: 'addClass',
                        actionData: 'tick'
                    })
                } else {
                    AH.find(_this, '.prefix', {
                        action: 'removeClass',
                        actionData: 'tick'
                    })
                
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
}






ucChoose.CheckResultchoose = function(chid) {
    let result = {}
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
    
}
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
}

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
        e.preventDefault()
    })
    AH.bind(chid, 'touchmove', function(e) {
        e.preventDefault()
    })

}

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
                    ucChoose.setUserAns(chid, ucChoose.ow, ucChoose.shouldselect)
                }, 100);
            })
            if (document.querySelector("#sortable").getAttribute("checkseq") != "0") {
                new Sortable(AH.find(chid, '#sortable'), {
                    onEnd: function(evt) {
                        ucChoose.ow = evt.srcElement ? evt.srcElement : evt.target; 
                        ucChoose.t = setTimeout(function() {
                            ucChoose.setUserAns(chid, ucChoose.ow, ucChoose.shouldselect)
                        }, 100);
                    }
                });
            }
        }, 200);
    }
}

ucChoose.bindKeyup = function(chid) {
    var count = 0;

    hotkeys.unbind('down,up,enter,alt+down,delete,left,right,tab,shift+tab,esc', 'choose' + chid);


    AH.find(chid, '#sortable li', 'all').forEach((_this) => {
        _this.classList.add("ks")
    })



    AH.bind(document, 'click', function() {
        if (!checkFocus())
            AH.find(chid, "#sortable .copied", {
                action: 'removeClass',
                actionData: 'copied'
            });
    })

    AH.listen(document, 'keydown', chid, function() {
        hotkeys.setScope('choose' + chid);
    })


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
            count = 0
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
                            tabMove(focus_element,0)
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
                                selected_opt.insertAfter(clone,AH.find(chid,'#sortable .copied').nextSibling)
                                
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
                            ucChoose.setUserAns(chid, ucChoose.ow, true)
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
                            })
                        } else {
                            
                            ucChoose.ow = AH.find(chid, '#sortable li:focus', 'all')[0];
                            
                            ucChoose.t = setTimeout(function() {
                                
                                ucChoose.setUserAns(chid, ucChoose.ow, ((AH.find(chid, "#sortable li:focus").classList.contains("choose_sel")) ? false : true));
                            }, 100);
                            
                            AH.find(chid, '#sortable li:focus', {
                                action: 'addClass',
                                actionData: 'copied'
                            })
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
                        ucChoose.setUserAns(chid, ucChoose.ow, true)
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
                    })
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
                    })
                    AH.selectAll(".ks")[AH.selectAll(".ks").length - 1].focus();
                    AH.selectAll(".ks")[AH.selectAll(".ks").length - 1].blur();
                }
                break;
        }
    });
    hotkeys.setScope('choose' + chid);
}

ucChoose.cmd = function(obj, e) {
    ucChoose.shouldselect = true;
    if (!e) {
        e = window.event
    }
    //var onwhich = e.srcElement ? e.srcElement : e.target;
}


ucChoose.cmm = function(obj, e) {
    if (!e) {
        e = window.event
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
}


ucChoose.cmu = function(chid, e, from_sortable = false) {
    if (from_sortable) {
        ucChoose.ow = e;
    } else {
        if (!e) {
            e = window.event
        }
        ucChoose.ow = e.srcElement ? e.srcElement : e.target;
    }
    if ((ucChoose.ow).classList.contains("prefix")) {
        ucChoose.ow = (ucChoose.ow).parentElement;
    }
    ucChoose.t = setTimeout(function() {
        ucChoose.setUserAns(chid, ucChoose.ow, ucChoose.shouldselect)
    }, 100)
    //ucChoose.t=setTimeout("ucChoose.setUserAns('"+chid+"',ucChoose.ow,"+ucChoose.shouldselect+")",100);
}




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
                })
                
                ow.classList.remove('choose_sel');
                if (cs != "1") {
                    
                    AH.find(ow, '.prefix', {
                        action: 'removeClass',
                        actionData: 'tick'
                    })
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
                })
                
                ow.classList.add('choose_sel');
                if (cs != "1") {
                    
                    AH.find(ow, '.prefix', {
                        action: 'addClass',
                        actionData: 'tick'
                    })
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
                })
            }
        });
    }



    ucChoose.CheckResultchoose(chid);
    ucChoose.shouldselect = false;
}





ucChoose.removeItem = function() { // fixed @eslint issue
    AH.remove(e1.parentElement.parentElement);
    let choose_item = document.querySelectorAll('.choose_item_container').innerHTML;
    if (choose_item.trim().length <= 200) {
        document.querySelector(".message_content").style.display = 'block';
    } else {
        document.querySelector(".message_content").style.display = 'none';
    }
}



ucChoose.addItem = function() {
    
    document.querySelector('.message_content').style.display = "none";
    AH.insert('.choose_item_container', '<div class="clearfix mt choose_options"><div class="col-md-12 mt-head"><input class="choose_compls" type="checkbox"><textarea></textarea><span class="remove-item icomoon-24px-delete-1"></span></div></div>', 'afterbegin');
}


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
}


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

        res.u = ucChoose.userAnsXML
        res.ans = yourScore;

    if (yourScore == true) {
        return (res);
    } else {
        return (res);
    }
}

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
    }) // Need to fixed it

    
    ucChoose.CheckResultchoose(chid);
}


ucChoose.setActiveClass = function(chid, correctans) {
    var cs = AH.find(chid, '#sortable').getAttribute("checkSeq")
    var cans = ((correctans == 1) ? "is_correct" : "user_answer");
    var seq = ((correctans == 1) ? "correct_seq" : "user_seq");
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
}


ucChoose.removeActive = function(chid) {
    AH.find(chid, '#sortable li', 'all').forEach((_this) => {
        _this.classList.remove("choose_sel");
    });
}

/*ajax based code*/

ucChoose.labBinded = true;
ucChoose.sortable = false;



ucChoose.modeOn = function(modeType) {

    if (typeof modeType == 'undefined') {
        //
    }
    AH.selectAll('.test', 'addClass', 'h');
    AH.selectAll('.review', 'addClass', 'h');
    if (modeType) {
        AH.selectAll('.review', 'removeClass', 'h');
        ucChoose.unBindLab();
        if (typeof hotkeys != "undefined") hotkeys.unbind('down,up,enter,alt+down,delete,left,right,tab,shift+tab,esc', 'choose' + ucChoose.ajax_eId);
        AH.find(ucChoose.ajax_eId, '.copied', 'all').forEach((_el) => {
            _el.classList.remove("copied");
        })
        if (document.querySelector('#show_ans_group button') != null) {
            document.querySelector('#show_ans_group button').forEach((_this) => {
                if (_this.classList.contains("correct-ans btn-primary")) {
                    ucChoose.showAns(ucChoose.ajax_eId, _this, 'c');
                } else if (_this.classList.contains("your-ans btn-primary")) {
                    ucChoose.showAns(ucChoose.ajax_eId, _this, 'u');
                }
            })
        }
    } else {
        AH.selectAll('.test', 'removeClass', 'h');
        setTimeout(function() {
            ucChoose.callBindKey();
        }, 100);
        ucChoose.review(ucChoose.ajax_eId, 0);
        ucChoose.bindLab();
    }
}

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
}



ucChoose.unBindLab = function() {
    ucChoose.labBinded = false;
    if (document.querySelector(ucChoose.ajax_eId).getAttribute('type') == "normal") {
        AH.find(ucChoose.ajax_eId, '#sortable').removeAttribute('onmouseup onmousemove onmousedown');
    }
    if (AH.find(ucChoose.ajax_eId, '#sortable').classList.contains('ui-sortable')) {
        ucChoose.sortable = true;
        //jQuery(ucChoose.ajax_eId).find("#sortable").sortable('destroy');	// comment
    }
}



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
            })


            AH.bind(document.querySelector("#sortable"), 'mousemove', function(e) {
                ucChoose.cmm(ucChoose.ajax_eId, e);
            })


            AH.bind(document.querySelector("#sortable"), 'mousedown', function(e) {
                ucChoose.cmd(ucChoose.ajax_eId, e);
                
            })

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
}
/*ajax based code*/
export default ucChoose; 