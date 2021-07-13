
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, T as Draggable, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, O as Dialog, P as binding_callbacks, Q as bind, v as validate_slots, o as onMount, A as AH$1, L as beforeUpdate, X as XMLToJSON, a7 as Lang, _ as onUserAnsChange, U as Button, j as attr_dev, l as set_style, k as add_location, n as insert_dev, q as listen_dev, B as noop, x as detach_dev, f as space, c as create_component, h as text, m as mount_component, F as set_data_dev, W as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, C as validate_each_argument, K as destroy_each, a2 as HtmlTag } from './main-cd84c3ce.js';
import { I as ItemHelper } from './ItemHelper-3579fbff.js';
import { s as styleInject } from './style-inject.es-1c867377.js';
import { h as hotkeys$1 } from './hotkeys.esm-701e2924.js';

const AH = new JUI();
const ucMlid = {};
ucMlid.sinfo = true;
ucMlid.multimatch = 0;
ucMlid.ajax_eId = "#matchmain";
ucMlid.is_valid_drop = false;
let match_lines = [];
let dragable;


ucMlid.removeUserAns = function() {
    AH.find("#matchmain","#lines, .matchlist-delete",{ action:'remove'});
    AH.selectAll("#matchmain div[data-userans]").forEach((_this)=> {
        _this.setAttribute("data-userans", "");
    });
};



ucMlid.update_XMLValue = function() {
    ucMlid.xmlDom = AH.select("#special_module_xml").value;
    ucMlid.multimatch = AH.select("#matchType").value;
    if(AH.select("#multimatch").checked) {
        ucMlid.multimatch = 1;
    }
    
    let ucMlidXMLDom = AH.findChild(ucMlid.xmlDom, 'matchlist');
    AH.setAttr(ucMlidXMLDom, {
        "listheading1": AH.select("#list1").value,
        "listheading2": AH.select("#list2").value,
        "multimatch": ucMlid.multimatch
    });
    ucMlidXMLDom.innerHTML = "<![CDATA[\n" + AH.select("#matchList").value + "\n]]>";
    AH.select("#special_module_xml", 'value', formatXml(ucMlid.xmlDom.xml ? ucMlid.xmlDom.xml : (new XMLSerializer()).serializeToString(ucMlid.xmlDom[0])) );
};



ucMlid.remove_lines = function(mlid) {
    AH.select(mlid+' #remMatchLine','remove');
    AH.listen('body', 'click','.matchlist-delete', (element)=> {
        let rem = {
            path : element.getAttribute('d'),
            base : element.getAttribute('base').split('_'),
        };
        rem.userans = AH.find("#matchmain", `[id="${rem.base[0]}"]`).getAttribute('data-userans').split(',');
        if (rem.userans.includes(rem.base[1]) != false) { 
            rem.userans.splice(rem.userans.indexOf(rem.base[1]), 1); 
        }
        rem.userans = rem.userans.join(',');
        if (rem.userans.substr(0, 1) == ',') { 
            rem.userans = rem.userans.substr(1, rem.userans.length); 
        }
        AH.select(`[id="${rem.base[0]}"]`, 'attr', {"data-userans" : rem.userans});
        rem.path = (rem.path.substr(1, rem.path.length)).split('C');
        rem.l1 = rem.path[0].trim().replace(/ /g, ',').split(',');
        rem.l2 = rem.path[1].trim().replace(/ /g, ',').split(',');
        rem.index = parseInt(rem.l1[rem.l1.length - 1]) + "_" + (parseInt(rem.l1[rem.l1.length - 2]) - 20) + "," + parseInt(rem.l2[rem.l2.length - 1]) + "_" + (parseInt(rem.l2[rem.l2.length - 2]) + 10) + "," + element.getAttribute('base');
        match_lines.splice(match_lines.indexOf(rem.index), 1);
        AH.remove(`[base='${element.getAttribute('base')}']`);
        ucMlid.checkAns(match_lines);
        setTimeout(function() { ucMlid.checkAns(mlid); }, 200);
    });
};


// jQuery(document).on('click','.donotshowdialog', function() {
//     var action = (jQuery(this).prop('checked') == true) ? 'store' : 'remove';
//     ucMlid.storeDoNotShow(user_guid, action);
// });

AH.listen(document,'click','.donotshowdialo',(_this) => {
    ucMlid.storeDoNotShow(user_guid, (_this.checked == true) ? 'store' : 'remove');
}); //will change

ucMlid.storeDoNotShow = function(user_guid, action) {
    let localdata = JSON.parse(localStorage.getItem('dontshowdialog'));
    if (action == 'store') {
        if (localdata == null) {
            localdata = {};        //@Fixed eslint issues 
        }
        localdata[user_guid] = 1;  
        localStorage.setItem('dontshowdialog', JSON.stringify(localdata));       
    } else if (action == 'remove') {
        if (localdata != null) {
            delete localdata[user_guid]; 
            localStorage.setItem('dontshowdialog', JSON.stringify(localdata));  
        }       
    }    
}; // No Need to fix
ucMlid.chkDoNotShow = function(user_guid) {
    const localdata = JSON.parse(localStorage.getItem('dontshowdialog'));
    if (localdata != null && user_guid in localdata) {
        return true;
    }
    return false;
}; // No need to fix

ucMlid.showUserAns = function(mlid) {
    let top1 = 0;
    match_lines = [];
    ucMlid.multimatch = AH.select(mlid).getAttribute("multimatch"); // Replaced
    //const draggable_ele = ucMlid.multimatch == 2 ? ".list4" : ".list1";
    ucMlid.showAns(mlid);
    ucMlid.dragOptionMatchlist = {
        zIndex: 100,
        cursorAt: { top: -10, left: -10 },
        cursor: "default",
        // revert(is_valid_drop) {
        //     if (!is_valid_drop) {
        //         if (ucMlid.sinfo) {
        //             ucMlid.sinfo = false;
        //             setTimeout(function() {
        //                 ucMlid.sinfo = true;
        //             }, 60 * 1000);
        //             if (!UCINFO.isIphone) {
        //                 if (typeof(showmsg) == 'function') showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 3);
        //                 if(ucMlid.chkDoNotShow(user_guid) != true) {
        //                     if (typeof(bindDialog) == 'function') bindDialog({ click: this, wd: 450, ht: 236, data: '<div title="How to drop?"><img src="' + jQuery(mlid).attr('path') + 'match_drop_000BOG.gif" /><br/><span><label><input type="checkbox" style="top:2px;" class="relative donotshowdialog"> Do not show this dialog again</label></span></div>' });
        //                 }
        //             }
        //         }
        //         return true;
        //     }
        // },
        // start() {
        //     const _this = jQuery(this);
        //     console.log(_this);
        //     top = parseInt(_this.position().top + _this.height() / 2) + "_" + parseInt(_this.position().left + _this.width());
        //     _this.after(_this.clone().addClass("clone").css({
        //         "position": "absolute",
        //         "top": _this.position().top,
        //         "left": _this.position().left,
        //         "width": _this.width() + 20,
        //         "height": _this.height() + 15
        //     }));
        //    // console.log(top)
        // },
        // stop() {
        //     const _this = jQuery(this);
        //     _this.removeAttr('style').css("position", "relative");
        //     jQuery('.clone').remove();
        //     if (_this.hasClass("ui-droppable")) {
        //         _this.removeClass("dropped").text("Place Here").attr("data-userans", "").draggable("destroy");
        //     }
        // }
    };
    window.mlid = mlid;

    function drop1(event,ui) {
        //console.log('drop1', ui);
        ucMlid.is_valid_drop = true;
        let _this = event.target;
        let list;
        let clr = "black";
        if(AH.select('#main-page').length > 0 && AH.select('#main-page').getAttribute('mode') == "bla" ) clr = "white";
        _this.style.position = "relative";
        
        list = top1 + "," + parseInt(_this.offsetTop + _this.clientHeight / 2) + "_" + parseInt(_this.offsetLeft) + "," + ui.getAttribute('id') + "_" + _this.getAttribute('id'); // need to discuss
        if (match_lines.includes(list) == false) { 
            match_lines.push(list); 
        }
        let userans = ui.getAttribute?.("data-userans") ? ui.getAttribute("data-userans").split(',') : [];
        if (userans.includes(_this.getAttribute("id")) == false) { 
            userans.push(_this.getAttribute("id")); 
        }
        userans = userans.join(',');
        if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
        ui.setAttribute("data-userans", userans);
        
        //jQuery(mlid).find("#lines").remove();
        // AH.find(mlid,"#lines",{
        //     action:'remove'
        // })
        let circle;
        //let str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" stroke-width = "2" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
        let str = '<svg id="lines">';
        var base;
        match_lines.forEach(function(value,index) {
            index = value.split(",");
            value = index[1].split("_");
            base = index[2];
            index = index[0].split("_");
            circle = '<div class="matchlist-delete center-block" d="M'  + (parseInt(index[1]) ) + ',' + index[0] + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '" base="' + base + '" style="left:' + (parseInt(index[1]) ) + 'px;top:' + (parseInt(index[0]) - 9) + 'px">&times</div>';
            str += '<path fill="none" d="M' + (parseInt(index[1]) + 20) + ',' + (parseInt(index[0]) - 4) + 'C' + (parseInt(index[1]) + 88) + ' ,' + (parseInt(index[0]) - 4) + ',' + (parseInt(index[1]) + 88) + ',' + (parseInt(value[0]) - 4) + ',' + (parseInt(value[1]) - 10) + ',' + (parseInt(value[0]) - 3) + '"  base="' + base + '" stroke-width = "2" stroke="' + clr + '"></path>';
            str += '<g transform="translate(' + (parseInt(value[1]) - 11) + ',' + (parseInt(value[0]) - 9) + ') rotate(0) scale(4) translate(0,0) scale(.3)" base="' + base + '"><g fill="' + clr + '" stroke="none" ><path d="M 0 0 L 10 5 L 0 10 z" /></g></g>';
        });
        str += '</svg>';
        AH.insert(mlid, circle, 'afterbegin');
        AH.insert(mlid, str, 'afterbegin');
        ucMlid.remove_lines(mlid);
        
    }

    function drop2(event1,ui1) {
        ucMlid.is_valid_drop = true;
        const _this = event1.target;
        _this.style.position = "relative";
        var drop_id = ui1.getAttribute('data-droped') ? ui1.getAttriburte('data-droped') : ui1.getAttribute('id');

        // _this.attr('data-droped', drop_id);
            _this.setAttribute('data-droped', drop_id);

        
        //	_this.html(jQuery(ui.draggable).html()).attr('data-userans', drop_id);
        _this.innerHTML = ui1.innerHTML;
        _this.setAttribute('data-userans', drop_id);
        // _this.css({ "background-color": jQuery(ui.draggable).css("background-color") });
        let ui_style = window.getComputedStyle(ui1);
        _this.style.backgroundColor = ui_style.getPropertyValue('background-color');
        // _this.draggable(jQuery.extend(ucMlid.dragOptionMatchlist, { revert: false }))
        // 	.attr({
        // 		'path': jQuery(ui.draggable).attr('path'),
        // 		'dropimage': jQuery(ui.draggable).attr('dropimage'),
        // 		'dragimage': jQuery(ui.draggable).attr('dragimage')
        // 	});

        var userans = [];
        userans = ui1.getAttribute("data-userans").split(',');
        if (userans.includes(_this.getAttribute("id")) == false) { userans.push(drop_id); }

        userans = userans.join(',');
        if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
        ui1.setAttribute("data-userans", userans);
        ucMlid.checkAns(mlid);
    }

    dragable = new Draggable({
        onDragStart: ((event)=>{
            ucMlid.is_valid_drop = false;
            let _this = event.target;
            top1 = parseInt(_this.offsetTop + _this.clientHeight / 2) + "_" + parseInt(_this.offsetLeft + _this.offsetWidth);
            //AH.clone(_this);
            
        }),
        onDrop: ((event,ui)=> {
            if (document.querySelectorAll(".list2").length > 0) {
                drop1(event,ui);

            } else if (document.querySelectorAll(".list3").length > 0) {
                drop2(event,ui);
            }
        }),
        isValidDrag:((event)=>{
            console.log('isValidDrag'+event);
        }),

        // onDragEnd:((event)=>{
           
        // })
        
        
    });
    //jQuery(mlid).find(draggable_ele).draggable(ucMlid.dragOptionMatchlist);

};

ucMlid.bindKeyup = function(mlid) {
    mlid = mlid || ucMlid.ajax_eId;
    //var top1 = 0; //@eslint issues fixed
    //jQuery(".row-fluid").find(".selmatch").removeClass("selmatch");

    AH.find(".row-fluid", ".selmatch", {action: 'removeClass', actionData: 'selmatch'});
    
    //hotkeys.unbind('down,up,left,right,alt+down,enter,delete,esc','matchlist');

    let count = 0;
    //var count_prev = 0; @eslint issues solved
    let copied_id = "";
    //var ks_activated = false; @eslint issues solved
    //const is_multimatch = jQuery(mlid).attr("multimatch");
     const is_multimatch = AH.select(mlid).getAttribute("multimatch"); // Replaced

    if (is_multimatch != "2") {
        activateClass("list1");
        activateClass("list2");
    } else {
        activateClass("list3");
        activateClass("list4");
    }

    document.addEventListener("click", ()=> {
        if (!checkFocus("list1") && !checkFocus("list2") && !checkFocus("list3") && !checkFocus("list4")) {
            loseFocus();
        }
    }); // @eslint issues solved

    document.querySelector(mlid).addEventListener("keydown", ()=> {
        if (typeof hotkeys$1 == "function") {
            hotkeys$1.setScope('matchlist');
        }
    }); // Replaced @eslint issues solved

    function loseFocus() {
        AH.find(mlid, ".copiedclr", 'all').forEach((_elm)=> {
            _elm.classList.remove("copiedclr");
        });
        copied_id = "";
        count = 0;
        //count_prev = 0; @eslint issues solved
        //ks_activated = false; @eslint issues solved
    } // Replaced

    

    function activateClass(cls) {
        AH.find(mlid, "." + cls, 'all').forEach((_elm)=> {
            _elm.classList.add("ks");
        });
    } // Replaced

    

    function navigateDown() {
        const a = AH.selectAll("#matchmain .ks").length;
        //count_prev = ((count == 0) ? (a - 1) : (count - 1)); @eslint issues solved
        const ks_fill = AH.find(mlidVar,".ks:nth(" + count + ")");
        //var prev_ks = AH.find(mlidVar,".ks:nth(" + (count - 1) + ")"); @eslint issues solved
        ks_fill.focus();
        if (count == (a - 1)) { count = 0; } else { count++; }
    }

    // function navigateUp() {
    //     const b = jQuery(mlid).find(".ks").length;
    //     count = ((count_prev == (b - 1)) ? 0 : (count_prev + 1));
    //     const ks_fill_left = jQuery(mlid).find(".ks:nth(" + count_prev + ")");
    //     ks_fill_left.focus();
    //     if (count_prev == 0) { count_prev = (b - 1) } else { count_prev--; }
    // }

    // function navidateUp() { 
       
    //     const b = AH.selectAll(mlid +" .ks").length;
    //     count = ((count_prev == (b - 1)) ? 0 : (count_prev + 1));
    //     const ks_fill_left = AH.selectAll(mlid," .ks:nth(" + count_prev + ")");
    //     ks_fill_left.focus();
    //     if (count_prev == 0) { count_prev = (b - 1) } else { count_prev--; }
    // } @eslint issues solved

    // function copyDraggable() {
    //     var copy_drag = jQuery(mlid).find(".ks:focus");
    //     jQuery(mlid).find(".list1").each(function() {
    //         jQuery(this).removeClass("copiedclr");
    //     });
    //     jQuery(mlid).find(".list4").each(function() {
    //         jQuery(this).removeClass("copiedclr");
    //     });
    //     copied_id = copy_drag[0].id;
    //     copy_drag.addClass('copiedclr');
    // } //  Replaced

    function copyDraggable() {
        let copy_drag = AH.selectAll(mlid+" .ks:focus");
        AH.find(mlid,".list1",'all').forEach((_this)=> {
            _this.classList.remove("copiedclr");
        });
        AH.find(mlid,".list4",'all').forEach((_this)=> {
            _this.classList.remove("copiedclr");
        });
        copied_id = copy_drag[0].id;
        //copy_drag.className = "copiedclr";
        AH.select(copy_drag[0],'addClass','copiedclr');
    }

    ucMlid.cleanTitle = function(){
        AH.find(ucMlid.ajax_eId, '.list1', 'all').forEach((_this) => {
            _this.removeAttribute("aria-label");
        });
    }; 

    ucMlid.getTitle = function(target, title, index, isCheck, preFix) {
        if (target) {
            if (index == 0) title += preFix ? (preFix + " and Attached to ") : ("Attached to ");
            if (index > 0) title += ' and ';
            if (isCheck) {
                title += target.textContent;
                title += ((target.getAttribute('as') == '1') ? ' is marked as correct' : ' is marked as incorrect');
            } else {
                title += target.textContent;
            }
        }
        return title
    }; // No Need to fix

    function pasteDraggable() {
        
        //var _dropthis = jQuery(mlid).find(".ks:focus");
        let _dropthis = AH.find(mlid,".ks:focus");
        if (copied_id != "" /*&& _dropthis.hasClass('ui-droppable')*/ ) {
            //var _ui_drag = jQuery(mlid).find("#" + copied_id + "");
            let _ui_drag = AH.find(mlid, '[id="'+copied_id+'"]');
            let top = 0;
            //top = parseInt(_ui_drag.position().top + _ui_drag.height() / 2) + "_" + parseInt(_ui_drag.position().left + _ui_drag.width());
            top = parseInt(_ui_drag.offsetTop + _ui_drag.clientHeight / 2) + "_" + parseInt(_ui_drag.offsetLeft + _ui_drag.offsetWidth);
        /*    _ui_drag.after(_ui_drag.clone().addClass("clone").css({ "position": "absolute", "top": _ui_drag.position().top, "left": _ui_drag.position().left, "width": _ui_drag.width() + 20, "height": _ui_drag.height() + 15 })); // Need to fixed it */

            let _ui_drag_cloned = AH.clone(_ui_drag);
            _ui_drag_cloned.classList.add("clone");

            AH.setCss(_ui_drag_cloned,{
                "position": "absolute",
                "top": _ui_drag.offsetTop,
                "left": _ui_drag.offsetLeft,
                "width": _ui_drag.offsetWidth + 20,
                "height": _ui_drag.clientHeight + 15
            });

            //AH.insert( _ui_drag,_ui_drag_cloned,'afterend');

            let clr = "black";
            //if (jQuery('#main-page').length > 0 && jQuery('#main-page').attr('mode') == "bla") clr = "white";
            if (AH.selectAll('#main-page').length > 0 && AH.selectAll('#main-page').getAttribute("mode") == "bla") clr = "white";
            //jQuery(_dropthis).css("position", "relative");
            _dropthis.style.position = "relative";
            // var list = top + "," + parseInt(jQuery(_dropthis).position().top + jQuery(_dropthis).height() / 2) + "_" + parseInt(jQuery(_dropthis).position().left) + "," + _ui_drag.attr('id') + "_" + jQuery(_dropthis).attr('id');
           
            let list = top + "," + parseInt(_dropthis.offsetTop + _dropthis.clientHeight / 2) + "_" + parseInt(_dropthis.offsetLeft) + "," + _ui_drag.getAttribute('id') + "_" + _dropthis.getAttribute('id');

            //if (jQuery.inArray(list, match_lines) == -1)
            if (match_lines.includes(list) == false) 
                match_lines.push(list);

            let userans = [];
            userans = _ui_drag.getAttribute("data-userans").split(',');
            //if (jQuery.inArray(jQuery(_dropthis).attr("id"), userans) == -1)
            if (userans.includes(_dropthis.getAttribute("id")) == false)
                userans.push(_dropthis.getAttribute("id"));

            userans = userans.join(',');
            if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
            
            _ui_drag.setAttribute("data-userans", userans);

            // get attached label
            if (userans.length > 0){
                let tempUdata = userans.split(',');
                let attachedText = "";
                tempUdata.map((id,index)=> {
                    attachedText = ucMlid.getTitle(AH.select("#"+id), attachedText, index);
                });
                _ui_drag.setAttribute("aria-label",attachedText);
            }
            //-------------------------------

            //jQuery(mlid).find("#lines").remove();
            //AH.find(mlid,"#lines", {action:'remove'}); // Fixed the line css issues
            let circle;
            //var str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" stroke-width = "2" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>'; @eslint issues solved
            let str = '<svg id="lines">';
            let base;
           // jQuery.each(match_lines, function(index, value) {
            match_lines.forEach((value, index)=> {
                index = value.split(",");
                value = index[1].split("_");
                base = index[2];
                index = index[0].split("_");
                circle = '<div class="matchlist-delete center-block" d="M' + (parseInt(index[1]) + 20) + ',' + index[0] + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '" base="' + base + '" style="left:' + (parseInt(index[1]) ) + 'px;top:' + (parseInt(index[0]) - 9) + 'px">&times</div>';
                str += '<path fill="none" d="M' + (parseInt(index[1]) + 20) + ',' + (parseInt(index[0]) - 5) + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '"  base="' + base + '" stroke-width = "2" stroke="' + clr + '"></path>';
                str += '<path fill="none" d="M' + (parseInt(index[1])+20) + ',' + (parseInt(index[0]) - 5) + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '" marker-end="url(#triangle)" class="line" base="'+base+'" stroke-width = "50"></path>';
                str += '<g transform="translate(' + (parseInt(value[1]) - 11) + ',' + (parseInt(value[0]) - 6) + ') rotate(0) scale(4) translate(0,0) scale(.3)" base="' + base + '"><g fill="' + clr + '" stroke="none" ><path d="M 0 0 L 10 5 L 0 10 z" /></g></g>';
            });
            str += '</svg>';
            //jQuery(mlid).prepend(circle);
            AH.insert(mlid, circle, "afterbegin");
            
            //jQuery(mlid).prepend(str);
            AH.insert(mlid, str, "afterbegin");
            ucMlid.remove_lines(mlid);

            //_ui_drag.removeAttr('style').css("position", "relative");
            _ui_drag.removeAttribute('style');
            _ui_drag.style.position = "relative";
            //jQuery('.clone').remove();
            AH.remove(".clone");
            //if (_ui_drag.hasClass("ui-droppable")) {
            if (_ui_drag.classList.contains("ui-droppable")) ;
            ucMlid.checkAns(mlid);
            //_ui_drag.removeClass('copiedclr');
            _ui_drag.classList.remove('copiedclr');
            copied_id = "";
        }
    }    

    function pasteDraggableList3() {
      
        var _dropthis = AH.find(mlid,".ks:focus");
        if (copied_id != "") {
            //var _ui_drag = AH.find(mlid,"#" + '[id="'+copied_id+'"]' + "");
            var _ui_drag = AH.select(mlid+' #'+copied_id);
            _ui_drag.classList.remove('copiedclr');
            _dropthis.style.position="relative";
            var drop_id = _ui_drag.getAttribute('data-droped') ? _ui_drag.getAttribute('data-droped') : _ui_drag.getAttribute('id');
            _dropthis.setAttribute('data-droped', drop_id);
            _dropthis.innerHTML = _ui_drag.innerHTML;
            _dropthis.setAttribute('data-userans', drop_id);
            let ui_drag_style = window.getComputedStyle(_ui_drag);
			_dropthis.style.backgroundColor = ui_drag_style.getPropertyValue('background-color');

            // _dropthis.draggable(jQuery.extend(ucMlid.dragOptionMatchlist, { revert: false }))
            //     .attr({ 'path': jQuery(_ui_drag).attr('path'), 'dropimage': jQuery(_ui_drag).attr('dropimage'), 'dragimage': jQuery(_ui_drag).attr('dragimage') });

            var userans = [];
            userans =  _ui_drag.getAttribute("data-userans").split(',');
            if(userans.includes(_dropthis.getAttribute("id")) == false)
                userans.push(drop_id);
            userans = userans.join(',');
            if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
            _ui_drag.setAttribute("data-userans", userans);
            ucMlid.checkAns(mlid);
            _ui_drag.classList.remove('copiedclr');
            copied_id = "";
        }
    }

    function removeDraggable() {
        var _removethis = AH.find(mlid,".ks:focus");
        if(_removethis.classList.contains('ui-draggable') && _removethis.getAttribute("data-userans") != "") {    
            var rem_element = _removethis.getAttribute("id") + "_" + _removethis.getAttribute("data-userans").split(",")[0];
            var element = "";
            AH.find(mlid,".matchlist-delete","all").forEach((_this)=>{
                if (_this.getAttribute("base") == rem_element) {    
                    element = _this;
                    return false; // Need to fix foreach never return false;
                }
            });
            // alert(element);
            var path = document.querySelector(element).getAttribute('d');
            var base = document.querySelector(element).getAttribute('base').split('_');
            var userans = AH.find(mlid,'[id="'+rem.base[0]+'"]').getAttribute('data-userans').split(',');
            if(userans.includes(base[1])  != false)
                userans.splice(userans.indexOf(base[1]), 1);
            userans = userans.join(',');
            if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
            document.querySelector('#' + base[0]).setAttribute("data-userans", userans);
            // removing title when answer removed
            document.querySelector('#' + base[0]).setAttribute('aria-label','');
            //-------------------------------------
            path = (path.substr(1, path.length)).split('C');
            var l1 = path[0].trim().replace(/ /g, ',').split(',');
            var l2 = path[1].trim().replace(/ /g, ',').split(',');
            var index = parseInt(l1[l1.length - 1]) + "_" + (parseInt(l1[l1.length - 2]) - 20) + "," + parseInt(l2[l2.length - 1]) + "_" + 
            (parseInt(l2[l2.length - 2]) + 10) + "," + AH.select(element).getAttribute('base');
            //const main_id = "#" + AH.select(mlid).getAttribute("id"); @eslint issues fixed
            match_lines.splice(match_lines.indexOf(index), 1);
            var base_el = document.querySelector(element).getAttribute('base');
            AH.remove("[base='" + base_el + "']");
            ucMlid.checkAns(mlid);
        }
    }

    function removeDraggableList3() {
        let top = 0;
        var _removethis = AH.find(mlid,".ks:focus");
        top = parseInt(_removethis.offsetTop + _removethis.clientHeight / 2) + "_" + parseInt(_removethis.offsetLeft + _removethis.offsetWidth);
        //AH.clone(_removethis);
        //_removethis.classList.add("clone");
        AH.setCss(_removethis,{
            "position": "absolute",
            "top":  _removethis.offsetTop,
            "left": _removethis.offsetLeft,
            "width": _removethis.offsetWidth + 20,
            "height": _removethis.clientHeight + 15
        });
        _removethis.removeAttribute("style");
        _removethis.style.position = "relative";
        //AH.remove(".clone");
        if(_removethis.classList.contains("ui-droppable")) {
            _removethis.classList.remove("dropped");
            _removethis.innerHTML = "Place Here";
            _removethis.setAttribute("data-userans", "");
        }
    }

    function activateKs() {
        //count = 0; @eslint issues solved
        //count_prev = 0; @eslint issues solved
        //ks_activated = true; @eslint issues solved
        navigateDown();
    } // No Need to fix

    function checkFocus(list) {
        var is_focus = false;
        let elements = AH.find(mlid, "." + list, 'all');
        let focus_ele = AH.select(":focus");

        if(focus_ele.nodeName) {
            let focus_id = focus_ele.getAttribute('id');
            for (let index = 0; index < elements.length; index++) {
                if (focus_id == elements[index].getAttribute('id')) {
                    is_focus = true;
                    break;
                }
            }
        }
        // jQuery(mlid).find("." + list).each(function() {
        //     if (jQuery(this).is(":focus")) {
        //         is_focus = true;
        //         return false;
        //     }
        // });
        return is_focus;
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

    if (typeof hotkeys$1 == "function") {
        hotkeys$1.unbind('down,up,left,right,alt+down,enter,delete,esc', 'matchlist');
        hotkeys$1("down,up,left,right,alt+down,enter,delete,esc", 'matchlist', function(event, handler) {
            switch (handler.key) {
                case 'down':
                case 'right':
                    if (checkFocus("ks")) {
                        let focus_ele = AH.select(".ks:focus");
                        let ks_last = AH.selectAll(".ks")[AH.selectAll(".ks").length-1];
                        if(focus_ele.id == ks_last.id) {
                            AH.selectAll(".ks")[0].focus();
                        } else {
                            tabMove(focus_ele,1);
                        }
                        event.preventDefault();
                    }
                    break;
                case 'up':
                case 'left':
                    if (checkFocus("ks")) {
                        let focus_ele = AH.select('.ks:focus');
                        let ks_element = AH.selectAll('.ks')[0];
                        if (focus_ele.id == ks_element.id) {
                            AH.selectAll(".ks")[AH.selectAll(".ks").length].focus();
                        } else {
                            tabMove(focus_element, 0);
                        }
                        event.preventDefault();
                    }
                    break;
                case 'alt+down':
                    activateKs();
                    break;
                case 'enter':
                    event.preventDefault();
                    if (checkFocus("list3")) {
                        pasteDraggableList3();
                    }
                    else if (checkFocus("list2")) {
                        pasteDraggable();
                    } else if (checkFocus("list1") || checkFocus("list4")) {
                        copyDraggable();
                    }
                    break;
                case 'delete':
                    event.preventDefault();
                    if (checkFocus("list3")) {
                        removeDraggableList3();
                    } else  if (checkFocus("list1")) {
                        removeDraggable();
                    } 
                case 'esc':
                    if (checkFocus("ks")) {
                        event.preventDefault();
                        loseFocus();
                        //jQuery('.ks').last().focus();
                        focusLast();
                        //jQuery('.ks').last().blur();
                        AH.selectAll(".ks")[AH.selectAll(".ks").length -1].blur();
                    }
                    break;
            }
        });
        hotkeys$1.setScope('matchlist');
    } 
};

ucMlid.pollFunc = function(fn, timeout, interval) {
    var startTime = (new Date()).getTime();
    interval = interval || 1000;
    canPoll = true;

    (function p() {
        canPoll = ((new Date).getTime() - startTime) <= timeout;
        if (!fn() && canPoll) { // ensures the function exucutes
            setTimeout(p, interval);
        }
    })();
}; // No Need to fix



ucMlid.showAns = function(mlid) {
    ucMlid.multimatch = document.querySelector(mlid).getAttribute("multimatch");
    //var answer_ele = ".list1"; @eslint issues solved
    if (ucMlid.multimatch < 2) {
        var str = '<svg id="lines">';
        ucMlid.f = 0;
        AH.selectAll(mlid +' .list1').forEach((_this)=> {
            
            if (_this.getAttribute("data-userans") != '') {
                ucMlid.f = 1;
                const top1 = parseInt(_this.offsetTop + _this.clientHeight / 2);
                const right = parseInt(_this.offsetLeft + _this.offsetWidth);
                const index = top + "_" + right;
                str += '<marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
            
                const userAns = _this.getAttribute("data-userans").split(',');
                for (let i = 0; i < userAns.length; i++) {
                    if (userAns[i] != '') {
                        const top2 = parseInt(AH.find(mlid ,'#' + userAns[i]).offsetTop + AH.find(mlid,'#' + userAns[i]).clientHeight / 2);
                        const left = parseInt(AH.find(mlid,'#' + userAns[i]).offsetLeft);
                        const userans = top2 + "_" + left;
                        const circle = '<div class="matchlist-delete center-block" d="M' + (parseInt(right) + 20) + ',' + top1 + 'C' + (parseInt(right) + 88) + ',' + top1 + ',' + (parseInt(right) + 88) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" base="' + _this.getAttribute('id') + '_' + AH.find(mlid,'#' + userAns[i]).getAttribute('id') + '" style="left:' + (parseInt(right) ) + 'px;top:' + (top1  - 9)+ 'px">&times</div>';
                        str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (top1 - 5) + 'C' + (parseInt(right) + 88) + ',' + (parseInt(top1) - 4) + ',' + (parseInt(right) + 88) + ',' + (parseInt(top2) - 4) + ',' + (parseInt(left) - 10) + ',' + (parseInt(top2) - 4) + '" marker-end="url(#triangle)" class="line" base="' + _this.getAttribute('id') + '_' + document.querySelector(mlid +' #' + userAns[i]).getAttribute('id') + '"></path>';
                        const list = index + "," + userans + "," + _this.getAttribute('id') + "_" + AH.select(mlid +' #' + userAns[i]).getAttribute('id');
                        if (list.includes(match_lines) == -1) match_lines.push(list);
                        //jQuery(mlid).prepend(circle);
                        AH.insert(mlid,circle,'afterbegin');
                    }
                }
            }
        });
        str += '</svg>';
        
        if (ucMlid.f == 1) AH.insert(mlid,str,'afterbegin');
    } else {
        ucMlid.showMultimatchAnswer(mlid, 1);
    }
};

ucMlid.checkAns = function(mlid) {
    let rest = {};
    let result = true,
        smans = '',
        list1seq = '',
        list2seq = '',
        temp = 0,
        originalseq1 = '',
        originalseq2 = '';
    let answer_ele = ".list1",
        answer_placeholder = ".list2";
    if (ucMlid.multimatch == 2) {
        answer_ele = ".list3";
        answer_placeholder = ".list4";
    }

    if (mlid == "#matchmain") {
        AH.selectAll(mlid+" "+answer_ele).forEach((_this)=> {
            //var correctAns = jQuery(this).attr('data-correctans').split(',').sort().join(',');
            let correctAns = _this.getAttribute('data-correctans').split(',').sort().join(',');
            //var userAns = jQuery(this).attr('data-userans').split(',').sort().join(',');
            let userAns = _this.getAttribute('data-userans').split(',').sort().join(",");
            if (correctAns.substr(0, 1) == ',') correctAns = correctAns.substr(1, correctAns.length);
            if (userAns.substr(0, 1) == ',') userAns = userAns.substr(1, userAns.length);

            if (correctAns != userAns) result = false;
            else temp++;

            list1seq += _this.getAttribute('id') + ",";
            if (typeof calculatePoint != "undefined") {
                calculatePoint(AH.select("#matchmain").getAttribute("totalcorrectans"), temp);
            }
            originalseq1 += _this.getAttribute('data-originalseq') + ",";
        });
        list1seq = list1seq.split(',');
        let uniqueArray = list1seq.filter((item, i, self) => {
            return self.lastIndexOf(item) == i;
        });
        list1seq = uniqueArray.join(',');
        list1seq = list1seq.substr(0, list1seq.length - 1);
        originalseq1 = originalseq1.substr(0, originalseq1.length - 1);
        //jQuery(mlid).find(answer_placeholder).each(function() {
        AH.find(mlid, answer_placeholder, 'all').forEach((_this)=> {
            var ans = '';
            //jQuery(mlid).find(answer_ele + '[data-userans*="' + _this.attr('id') + '"]').each(function() {
            AH.find(mlid, answer_ele + `[data-userans*="${_this.getAttribute('id')}"]`, 'all').forEach((_this2)=> {
                if (_this2.getAttribute('data-userans') != "") ans += _this2.getAttribute('id') + "|";
            });
            ans = ans.substr(0, ans.length - 1);
            if (ans != "") smans += _this.getAttribute('id') + "[" + ans + "],";
            list2seq += _this.getAttribute('id') + ",";
            originalseq2 += _this.getAttribute('data-originalseq') + ",";
        });
        list2seq = list2seq.substr(0, list2seq.length - 1);
        originalseq2 = originalseq2.substr(0, originalseq2.length - 1);
        smans = smans.substr(0, smans.length - 1);
        const userAnsXML = "<smans type='14'>\n\t<matchlist list1seq='" + list1seq + "' list2seq='" + list2seq + "' userans='" + smans + "' originalseq1='" + originalseq1 + "' originalseq2='" + originalseq2 + "'></matchlist>\n</smans>";
        //window.ISSPECIALMODULEUSERXMLCHANGE = 1; ## Fixed in HelperAI.svelte
        //jQuery("#special_module_user_xml").val(userAnsXML);
    
        //AH.select("#special_module_user_xml").value = userAnsXML; ## Fixed in HelperAI.svelte

        rest.u = userAnsXML;
        rest.ans = result;

        //alert(userAnsXML);

        if (result) {
            //AH.select("#answer").checked = true; ## Fixed in HelperAI.svelte
            if (typeof(is_sm) != "undefined") AH.showmsg("Correct");
            return(rest);
        } else {
            //AH.select("#answer").checked = false; ## Fixed in HelperAI.svelte
            if (typeof(is_sm) != "undefined") AH.showmsg("Incorrect");
            return(rest);
        }
       
    }
};
/**/
ucMlid.insertAtCaret = function(element, text) {
    if (document.selection) {
        element.focus();
        let sel = document.selection.createRange();
        sel.text = text;
    } else if (element.selectionStart || element.selectionStart === 0) {
        let startPos = element.selectionStart;
        let endPos = element.selectionEnd;
        let scrollTop = element.scrollTop;
        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
        element.selectionStart = startPos + text.length;
        element.selectionEnd = startPos + text.length;
        element.scrollTop = scrollTop;
    } else {
        element.value += text;
        
    }
    element.focus();
}; // No need to change



ucMlid.showMultimatchAnswer = function(mlid, is_not_review) {
   // var top1 = 0; @eslint issues solved
    // const dragOption_multi = {
    //     zIndex: 100,
    //     cursorAt: { top: -10, left: -10 },
    //     cursor: "default",
    //     start() {
    //         const _this = jQuery(this);
    //         const _top_position = _this.offsetTop;
    //         const _left_position = _this.offsetLeft;
    //         const _ht = _this.clientHeight;
    //         const _wt = _this.offsetWidth;
    //         top1 = parseInt(_top_position + _ht / 2) + "_" + parseInt(_left_position + _wt);
    //         AH.clone(".clone");
    //         AH.setCss(_this,{
    //             "position": "absolute",
    //             "top": _top_position,
    //             "left": _left_position,
    //             "width": _wt + 20,
    //             "height": _ht + 15
    //         })
    //         // _this.after(_this.clone().addClass("clone").css({
    //         //     "position": "absolute",
    //         //     "top": _top_position,
    //         //     "left": _left_position,
    //         //     "width": _wt + 20,
    //         //     "height": _ht + 15
    //         // }));
    //     },
    //     stop() {
    //         const _this = jQuery(this);
    //         _this.removeAttr('style').css("position", "relative");
    //         //jQuery('.clone').remove();
    //         AH.remove(".clone");
    //         AH.removeClass(_this,'dropzone'); // dropped convert into dropzone

    //         _this.innerText = "Place Here"
    //         _this.setAttribute("data-userans", "");


    //         // _this.removeClass("dropped")
    //         //     .text("Place Here")
    //         //     .attr("data-userans", "")
    //         //     .draggable("destroy");
    //     }
    // };

    //jQuery(mlid).find(".list3").removeClass("dropped").text("Place here"); //@Deepika: we needs to clear shown answers first

    AH.find(mlid, ' .list3', 'all').forEach((_this)=> {
        AH.select(_this,'removeClass','dropped');
        _this.innerHTML = "Place here";
    });
    // let mlidlist3 = AH.selectAll(mlid+' .list3','removeClass','dropped');
    // // //AH.removeClass(mlidlist3,'dropped');
    //  mlidlist3.innerText = "Place here";

    //jQuery(mlid).find('.list3').each(function() {
    AH.find(mlid, '.list3', 'all').forEach((_this)=> {
        // const _this = jQuery(this);
        if (_this.getAttribute("data-userans").length > 0) {
            const userAns = _this.getAttribute("data-userans").split(',');
            for (let i = 0; i < userAns.length; i++) {
                if (userAns[i] != '') {
                    const str = AH.find(mlid,'#' + userAns[i]).innerHTML;
                    _this.innerHTML = str;
                    _this.classList.add('dropped'); //dropped class convert into dropzone
                }
            }
        }
    });

};




ucMlid.checkAnswerStatus = function(isCorrect, ele, _idn) {
    let _id = _idn || ""; //@eslint issues solved
    
    let correctAns = ele.getAttribute('data-correctans').split(',').sort().join(',');// will Change
    let userAns    =   ele.getAttribute('data-userans').split(',').sort().join(','); //Will Replaced
    if (correctAns.substr(0, 1) == ',') correctAns = correctAns.substr(1, correctAns.length);
    if (userAns.substr(0, 1) == ',') userAns = userAns.substr(1, userAns.length);
    if (_id != "") {
        const _c = correctAns.split(',');
        const _u = userAns.split(',');
        if (!(_c.includes(_id) == false) && (_u.includes(_id) == false)) isCorrect = -1; // We have to change
    } else {
        if (correctAns != userAns) isCorrect = -1;
    }
    return isCorrect;
};



ucMlid.showAllCorrectAns = function(mlid) {
    AH.selectAll(mlid+' .list3').forEach((_this) => {
        const correctAns = _this.getAttribute("data-correctans").split(',');
        for (let i = 0; i < correctAns.length; i++) {
            if (correctAns[i] != '') {
                const str = AH.find(mlid,'#' + correctAns[i]).innerHTML;
                _this.innerHTML = str;
                AH.select(_this,'addClass','dropped');
            }
        }
    });
};


ucMlid.showAllAns = function(mlid) {
    console.table('showAns');
    AH.remove("#lines");
    AH.remove('.correct_incorrect_icon');
    
    ucMlid.multimatch = document.querySelector(mlid).getAttribute("multimatch");
    if (ucMlid.multimatch < 2) {
        var str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
        str += '<marker id="trngle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#83C883"/></marker>';

        
        AH.find(mlid ,".list1","all").forEach((_this)=>{
            const top1 = _this.offsetTop + _this.clientHeight  / 2;
            var right = _this.offsetLeft  + _this.offsetWidth;
            var correctAns = _this.getAttribute("data-correctans").split(',');
            for (let i = 0; i < correctAns.length; i++) {
                if (correctAns[i] != '') {
                    const top2 = AH.find(mlid,'#' + correctAns[i]).offsetTop + AH.find(mlid,'#' + correctAns[i]).clientHeight / 2 - 5;
                    const left = AH.find(mlid,'#' + correctAns[i]).offsetLeft;
                    str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) - 5) + 'C' + (parseInt(right) + 83) + ',' + (parseInt(top1) - 5) + ',' + (parseInt(right) + 83) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#trngle)" class="correct"></path>';
                }
            }
            if(_this.getAttribute("data-userans").length > 0) {
                const userAns = _this.getAttribute("data-userans").split(',');
                var matchedTitle = "";
                for (let i = 0; i < userAns.length; i++) {
                    if (userAns[i] != '') {
                        const top2 = AH.find(mlid,'#' + userAns[i]).offsetTop + AH.find(mlid,'#' + userAns[i]).clientHeight / 2 + 5;
                        const left = AH.find(mlid,'#' + userAns[i]).offsetLeft;
                        str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) + 5) + 'C' + (parseInt(right) + 93) + ',' + (parseInt(top1) + 5) + ',' + (parseInt(right) + 93) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#triangle)" class="line"></path>';
                        //---- adding ans feedback in title ----
                        matchedTitle = ucMlid.getTitle(AH.select('#' + userAns[i]), matchedTitle, i, true, _this.textContent);
                    }
                }
                _this.setAttribute('aria-label',matchedTitle);
            }
        });
        str += '</svg>';
        //jQuery(mlid).prepend(str);
        AH.insert(mlid,str,'afterbegin');
        var answer_ele = ".list2";
    } else {
        ucMlid.showMultimatchAnswer(mlid);
        answer_ele = ".list3";
    }
    
    //jQuery(mlid).find(answer_ele).each(function() {
    AH.selectAll(mlid +" "+ answer_ele).forEach((_this)=>{
        const self_id = _this.getAttribute('id');
        var isCorrect = 1;
        if (ucMlid.multimatch == 2) {
            isCorrect = ucMlid.checkAnswerStatus(isCorrect, _this);
        } else {
            AH.selectAll(mlid + ' .list1[data-correctans*="' + _this.getAttribute('id') + '"]').forEach((_this)=>{
                isCorrect = ucMlid.checkAnswerStatus(isCorrect, _this, self_id);
            });
        }
        const droped_value_indicator_html = ((isCorrect == 1) ? '<span class="icomoon-checkmark-circle" style="color:green;">' : '<span class="icomoon-cancel-circle" style="color:red;">');
        _this.setAttribute('mrel', _this.getAttribute('id'));
        _this.setAttribute('as', isCorrect);
        AH.insert(_this,'<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span>','beforeend');
    });
};




ucMlid.resetMatch = function(){
    AH.remove("#lines");
    AH.remove(".correct_incorrect_icon");
    let str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
    str += '<marker id="trngle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#83C883"/></marker>';
    return str;
};




ucMlid.showCorrect = function(mlid) {
    let str = ucMlid.resetMatch();
    ucMlid.cleanTitle();
    AH.selectAll(mlid +' .list1').forEach((_this)=> {
        //const self = jQuery(this);
        const top1 = _this.offsetTop + _this.clientHeight / 2;
        let right =  _this.offsetLeft + _this.offsetWidth;

        let correctAns = _this.getAttribute("data-correctans").split(',');
        let matchedTitle = "";
        for (let i = 0; i < correctAns.length; i++) {
            if (correctAns[i] != '') {
                const top2 = AH.find(mlid,'#' + correctAns[i]).offsetTop + AH.find(mlid,'#' + correctAns[i]).clientHeight / 2 - 5;
                const left = AH.find(mlid,'#' + correctAns[i]).offsetLeft;
                str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) - 5) + 'C' + (parseInt(right) + 83) + ',' + (parseInt(top1) - 5) + ',' + (parseInt(right) + 83) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#trngle)" class="correct"></path>';
                matchedTitle = ucMlid.getTitle(AH.select('#' + correctAns[i]), matchedTitle, i, _this.textContent);
            }
        }
        //self.attr("aria-label",matchedTitle);
        _this.setAttribute("aria-label",matchedTitle);
    });
    str += '</svg>';
    //jQuery(mlid).prepend(str);
    AH.insert(mlid,str,"afterbegin");
};



ucMlid.showYour = function(mlid) {
    
    ucMlid.cleanTitle();
    let str = ucMlid.resetMatch();
    
    AH.find(mlid,'.list1',"all").forEach((_this) =>{
        //const self = jQuery(this);
        const top1 = _this.offsetTop + _this.clientHeight / 2;
        let right =  _this.offsetLeft + _this.offsetWidth;

        if (_this.getAttribute("data-userans").length > 0) {
            const userAns = _this.getAttribute("data-userans").split(',');
            let matchedTitle = "";
            for (let i = 0; i < userAns.length; i++) {
                if (userAns[i] != '') {
                    const top2 = AH.find(mlid,'#' + userAns[i]).offsetTop + AH.find(mlid,'#' + userAns[i]).clientHeight / 2 + 5;
                    //const left = jQuery(mlid).find('#' + userAns[i]).position().left;
                    const left = AH.find(mlid,'#' + userAns[i]).offsetLeft;
                    str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) + 5) + 'C' + (parseInt(right) + 93) + ',' + (parseInt(top1) + 5) + ',' + (parseInt(right) + 93) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#triangle)" class="line"></path>';
                    //---- adding ans feedback in title ----
                    matchedTitle = ucMlid.getTitle(AH.select('#' + userAns[i]), matchedTitle, i, true, _this.textContent);
                }
            }
            //self.attr('aria-label',matchedTitle);
            _this.setAttribute('aria-label',matchedTitle);
        }
    });
    str += '</svg>';
    //jQuery(mlid).prepend(str);
    AH.insert(mlid,str,"afterbegin");
    let answer_ele = ".list2";
    AH.find(mlid,answer_ele,"all").forEach((_this)=> {
        //const self = jQuery(this);
        const self_id = _this.getAttribute('id');

        let isCorrect = 1;
        AH.find(mlid,'.list1[data-correctans*="' + _this.getAttribute('id') + '"]','all').forEach((_this)=> {
            isCorrect = ucMlid.checkAnswerStatus(isCorrect, _this, self_id);
        });

        const droped_value_indicator_html = ((isCorrect == 1) ? '<span class="icomoon-checkmark-circle" style="color:green;">' : '<span class="icomoon-cancel-circle" style="color:red;">');
        _this.setAttribute('mrel', _this.getAttribute('id'));
        _this.setAttribute('as', isCorrect);
        //self.append('<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span></span>');
        AH.insert(_this,'<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span>',"afterbegin");
    });
};

/*ajax based code*/
ucMlid.showAll = function() { //@eslint issues solved
    ucMlid.showAllAns(ucMlid.ajax_eId);
};

ucMlid.labBinded = true;


ucMlid.modeOn = function(modeType) {
    //jQuery('.test').addClass('h');
    AH.selectAll('.test','addClass','h');
    //jQuery(ucMlid.ajax_eId).find('.review_2, .review_default').addClass('h');
   
    AH.find(ucMlid.ajax_eId,'.review_2, .review_default',{
        action:'addClass',
        actionData:'h'
    });
    if (modeType) {
        //jQuery('.review').removeClass('h');
        AH.selectAll('.review','removeClass','h');
        setTimeout(function() {
            if (typeof hotkeys$1 == "function") {
                hotkeys$1.unbind('down,up,left,right,alt+down,enter,delete,esc', 'matchlist');
            }
            //jQuery(ucMlid.ajax_eId).find(".selmatch").removeClass("selmatch");
            AH.selectAll(ucMlid.ajax_eId+"  .selmatch",'removeClass','selmatch');
            ucMlid.unBindLab();
            ucMlid.showAllAns(ucMlid.ajax_eId);
            // jQuery(ucMlid.ajax_eId).find('#sm_controller button').each(function() {
            //     if (jQuery(this).hasClass('your-ans btn-primary')) { ucMlid.showAllAns(ucMlid.ajax_eId); } else if (jQuery(this).hasClass('correct-ans btn-primary')) { ucMlid.showAllCorrectAns(ucMlid.ajax_eId); }
            // });
            AH.selectAll(ucMlid.ajax_eId+' #sm_controller button').forEach((_this) => {
                if (_this.classList.contains('your-ans btn-primary')) { 
                    ucMlid.showAllAns(ucMlid.ajax_eId); 
                } else if (_this.classList.contains('correct-ans btn-primary')) { 
                    ucMlid.showAllCorrectAns(ucMlid.ajax_eId); 
                }
            });
            // jQuery(ucMlid.ajax_eId).find('#sm_controller_default button').each(function() {
            //     if (jQuery(this).hasClass('your-ans btn-primary')) { ucMlid.showYour(ucMlid.ajax_eId); } else if (jQuery(this).hasClass('correct-ans btn-primary')) { ucMlid.showCorrect(ucMlid.ajax_eId); } else if (jQuery(this).hasClass('both-ans btn-primary')) { ucMlid.showAll(ucMlid.ajax_eId); }
            // });

            AH.find(ucMlid.ajax_eId,'#sm_controller_default button','all').forEach((_this)=> {
                if (_this.classList.contains('your-ans btn-primary')) { ucMlid.showYour(ucMlid.ajax_eId); } else if (_this.classList.contains('correct-ans btn-primary')) { ucMlid.showCorrect(ucMlid.ajax_eId); } else if (_this.classList.contains('both-ans btn-primary')) { ucMlid.showAll(ucMlid.ajax_eId); }
            });
        }, 50);
    } else {
        //jQuery('.review').addClass('h');
        AH.selectAll('.review','addClass','h');
        //jQuery('.test').removeClass('h');
        AH.selectAll('.test','removeClass','h');
        setTimeout(function() {
            ucMlid.bindLab();
            ucMlid.bindKeyup(ucMlid.ajax_eId);
            ucMlid.showUserAns(ucMlid.ajax_eId);
            ucMlid.remove_lines(ucMlid.ajax_eId);
            ucMlid.cleanTitle();
        }, 50);
    }
}; 


ucMlid.unBindLab = function() {
    ucMlid.labBinded = false;
    //jQuery(ucMlid.ajax_eId).find('#lines, .matchlist-delete').remove();
    AH.find(ucMlid.ajax_eId,'#lines, .matchlist-delete',{
        action: 'remove'
    });
    //const draggable_ele = ucMlid.multimatch == 2 ? ".list4" : ".list1"; @eslint issues solved
    //jQuery(ucMlid.ajax_eId).find(draggable_ele).draggable('destroy');
    // AH.find(ucMlid.ajax_eId,'.list3, .list2','all').forEach((_this)=> {
    //     if (_this.classList.contains('ui-draggable')) {
    //     // _this.draggable('destroy'); // dicuss with sir
    //     }
    // }); @eslint issues solved
    //jQuery(ucMlid.ajax_eId).find('#sm_controller button, #sm_controller_default button').unbind('click'); need to fix
    

    // jQuery(ucMlid.ajax_eId).find('#sm_controller button, #sm_controller_default button').keyup(function(e) { 
    //     if(e.keyCode == 13) {
    //         ucMlid.modifyClass(this, 'keyup') ;
    //     }   
    // }).click(function(){            
    //     ucMlid.modifyClass(this) ;
    // });  /// Need to fix it.
};




ucMlid.modifyClass = function(self, type) { //  Not catched when call
    //jQuery(ucMlid.ajax_eId).find("#sm_controller button, #sm_controller_default button");
    AH.find(ucMlid.ajax_eId,"#sm_controller button, #sm_controller_default button","all"); // Will Replaced
    if(type){
        //jQuery(self).addClass('btn-primary').removeClass('btn-light');  
            self.classList.add('btn-primary');
            self.classList.remove('btn-light');
         //Will Replaced
        //jQuery(self).siblings().removeClass("btn-primary").addClass('btn-light'); // Need to fix it
        
    } else {
        //jQuery(self).addClass('btn-primary').removeClass('btn-light'); 
            self.classList.add('btn-primary');
            self.classList.remove('btn-light');
        
       // jQuery(self).siblings().removeClass("btn-primary").addClass('btn-light'); // Need to fix it
    }  
};



ucMlid.bindLab = function() {
    
    ucMlid.labBinded = true;
    //jQuery(ucMlid.ajax_eId).find('#lines,.correct,.lines,.correct_incorrect_icon').remove();
    AH.find(ucMlid.ajax_eId,'#lines,.correct,.lines,.correct_incorrect_icon',{
        action:'remove'
    });
    // let ucMlidAjax = AH.select(ucMlid.ajax_eId);
    // AH.find(ucMlidAjax,'#lines,.correct,.lines,.correct_incorrect_icon').remove; // Replaced
};
/*ajax based code*/



ucMlid.editor_validtion = function(editing_type) {
    if (editing_type == 1 || editing_type == 2 || editing_type == 3) {
        const $list1 = document.getElementById("#list1").value;
        const $list2 = document.getElementById("#list2").value;
        const $matchList = document.getElementById("#matchList").value;
        if ($list1 == "" || $list2 == "" || $matchList == "") {
            AH.showmsg("Please Fill The Heading of Lists and Question", 1);
            return false;
        }
        return true;
    }
};

var css_248z = "[id^=matchmain]{width:700px;min-height:10px;font-size:12px;position:relative;font-family:Arial,\"Helvetica Neue\",Helvetica,sans-serif;font-size:14px}[id^=matchmain] .row-fluid{width:100%}[id^=matchmain] .row-fluid:after,[id^=matchmain] .row-fluid:before{display:table;line-height:0;content:\"\"}[id^=matchmain] .row-fluid:after{clear:both}[id^=matchmain] .row-fluid [class*=span]{display:block;float:left;width:100%;min-height:30px;margin-left:2.127659574468085%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}[id^=matchmain] .row-fluid [class*=span]:first-child{margin-left:0}[id^=matchmain] .row-fluid .span4{width:36.914893617021278%}[id^=matchmain] .row-fluid .span3{width:21.914893617021278%!important;}[id^=matchmain] .heading{font-size:17px!important;font-weight:400;margin-bottom:20px;line-height:30px}[id^=matchmain] .arrow{min-height:44px;padding:7px 10px;background:url(../../images/arrow_matchtype.png) no-repeat 100% 50%;margin-left:-10.5%;margin-right:-10%}[id^=matchmain] .list4{display:inline-table;width:214px;margin-right:1.3%;cursor:move}[id^=matchmain] .list1,[id^=matchmain] .list2,[id^=matchmain] .list4{padding:7px 10px;margin-bottom:5px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;font-size:12px;line-height:20px;min-height:40px;word-wrap:break-word}[id^=matchmain] .list3{padding:7px 10px;text-align:center;margin-bottom:5px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;font-size:12px;min-height:40px;word-wrap:break-word;line-height:25px}[id^=matchmain] .list1{border:1px solid #000;background-color:#cfc;cursor:move;line-height:22px}[id^=matchmain] .list2,[id^=matchmain] .list4{border:1px solid #000;background-color:#ffc;position:relative}[id^=matchmain] .list3{border:1px solid #000;background-color:#fff;position:relative}[id^=matchmain] .clone{z-index:0!important;background-color:#fffcc1!important;border:none!important}[id^=matchmain] .drop-hover{border:1px dashed #000;box-shadow:0 0 0 1px #000 inset}[id^=matchmain] #lines{width:100%;height:100%;position:absolute;top:7px;left:0}[id^=matchmain] .line{stroke:#000;stroke-width:2px;z-index:11}[id^=matchmain] .serial{float:left;padding-right:1px}[id^=matchmain] .correct{stroke:#5bb75b;stroke-width:2px;z-index:0}[id^=matchmain] .list1 img,[id^=matchmain] .list2 img,[id^=matchmain] .list3 img,[id^=matchmain] .list4 img{max-width:100px;max-height:100px}.match_options{background:#e4eeff;margin-top:3%;margin-bottom:1%;padding:15px 10px 10px 20px;box-shadow:0 0 2px 1px gray;height:auto}.dropped{background-color:#ffc!important;cursor:move}.matchlist-delete{cursor:pointer;height:20px;width:20px;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;background-color:#000;color:#fff;font-weight:700;font-size:20px;line-height:20px;position:absolute;z-index:16}.list1,.list2,.list3,.list4{color:#000!important}.selmatch{border:solid 2px red!important;border-radius:2px!important}.remoutline{outline:solid 3px red!important}.copiedclr{background-color:#ccc!important}.bla [id^=matchmain] .list1:focus,.bla [id^=matchmain] .list2:focus,.bla [id^=matchmain] .list3:focus,.bla [id^=matchmain] .list4:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #fff;outline:0}.textdel>span{top:0}\r\n\r\n.context {\r\n    position: absolute;\r\n    top: 0px;\r\n    left: 0px;\r\n    min-width: 180px;\r\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\r\n    color: #000;\r\n    background: #f5f5f5;\r\n    font-size: 9pt;\r\n    border: 1px solid #333333;\r\n    box-shadow: 4px 4px 3px -1px rgba(0, 0, 0, 0.5);\r\n    padding: 3px 0px;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    z-index: 1061;\r\n}\r\n\r\n.context .item {\r\n    padding: 4px 19px;\r\n    cursor: default;\r\n    color: inherit;\r\n    text-align: left\r\n}\r\n\r\n.context .item:hover {\r\n    background: #e3e3e3 !important;\r\n}\r\n\r\n.context .item:hover .hotkey {\r\n    color: #000 !important;\r\n}\r\n\r\n.context .disabled {\r\n    color: #878B90 !important;\r\n}\r\n\r\n.context .disabled:hover {\r\n    background: inherit !important;\r\n}\r\n\r\n.context .disabled:hover .hotkey {\r\n    color: #878B90 !important;\r\n}\r\n\r\n.context .separator {\r\n    margin: 4px 0px;\r\n    height: 0;\r\n    padding: 0;\r\n    border-top: 1px solid #b3b3b3;\r\n}\r\n\r\n.hotkey {\r\n    color: #878B90;\r\n    float: right;\r\n}";
styleInject(css_248z);

/* clsSMMatchList\MatchListPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMMatchList\\MatchListPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-bi3u6x-style";
	style.textContent = ".u-sr-only.svelte-bi3u6x{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:500px){.shuffle.svelte-bi3u6x{text-align:center}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0Y2hMaXN0UHJldmlldy5zdmVsdGUiLCJzb3VyY2VzIjpbIk1hdGNoTGlzdFByZXZpZXcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG48IS0tIFxyXG4qICBGaWxlIE5hbWUgICA6IE1hdGNoTGlzdFByZXZpZXcuc3ZlbHRlXHJcbiogIERlc2NyaXB0aW9uIDogRHJhZyB0aGUgb3B0aW9uXHJcbiogIEF1dGhvciAgICAgIDogU3VuZGFyYW0gVHJpcGF0aGlcclxuKiAgVmVyc2lvbiAgICAgOiAxLjBcclxuKiAgUGFja2FnZSAgICAgOiBzdmVsdGVfaXRlbXNcclxuKiAgTGFzdCB1cGRhdGUgOiAgMDQtanVuZS0yMSBcclxuLS0+XHJcbjxzY3JpcHQ+XHJcblxyXG5cdFxyXG5cdGltcG9ydCB1Y01saWQgZnJvbSAnLi9tYXRjaGxpc3RKU1N0cmluZyc7XHJcblx0aW1wb3J0IHtEcmFnZ2FibGV9IGZyb20gXCIuLi9zcmMvbGlicy9qYXZzY3JpcHRfaGVscGVyL0pVSS5qc1wiO1xyXG5cdC8vaW1wb3J0IHNtVmFsIGZyb20gJy4uL2xpYi9WYWxpZGF0ZUl0ZW1zJztcclxuXHRpbXBvcnQgbCBmcm9tICcuLi9zcmMvbGlicy9MYW5nJztcdFxyXG5cdGltcG9ydCB7IGJlZm9yZVVwZGF0ZSwgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSc7XHJcblx0aW1wb3J0IEl0ZW1IZWxwZXIgZnJvbSAnLi4vaGVscGVyL0l0ZW1IZWxwZXIuc3ZlbHRlJztcclxuXHRpbXBvcnQge0FILFhNTFRvSlNPTixvblVzZXJBbnNDaGFuZ2V9IGZyb20gXCIuLi9oZWxwZXIvSGVscGVyQUkuc3ZlbHRlXCI7XHJcblx0aW1wb3J0ICcuL2Nzcy9tYXRjaExpc3QubWluLmNzcyc7XHJcblx0aW1wb3J0IHsgQnV0dG9uLCBEaWFsb2cgfSBmcm9tICdzdmVsdGUtbXVpL3NyYyc7XHJcblx0XHJcblx0ZXhwb3J0IGxldCBzaG93QW5zO1xyXG5cdGV4cG9ydCBsZXQgY21lZDtcclxuXHRleHBvcnQgbGV0IHhtbDtcclxuXHRleHBvcnQgbGV0IGlzUmV2aWV3O1xyXG5cdGV4cG9ydCBsZXQgdXhtbDtcclxuXHRleHBvcnQgbGV0IGVkaXRvclN0YXRlO1xyXG5cclxuXHRsZXQgbGlzdGhlYWRpbmcxID0gXCJcIjtcclxuXHRsZXQgbGlzdGhlYWRpbmcyID0gXCJcIjtcclxuXHRsZXQgbXVsdGltYXRjaCA9IFwiXCI7XHRcclxuXHRsZXQgbGlzdDEgPSBbXTtcclxuXHRsZXQgbGlzdDIgPSBbXTtcclxuXHRsZXQgY2RhdGEgPSBcIlwiO1xyXG5cdGxldCBpc1NodWZmZWxlZCA9IGZhbHNlO1xyXG5cdGxldCB0b3RhbENvcnJlY3RBbnMgPSAwO1xyXG5cdGxldCBhbHBoYWJldCA9IFtcIkFcIixcIkJcIixcIkNcIixcIkRcIixcIkVcIixcIkZcIixcIkdcIixcIkhcIixcIklcIixcIkpcIixcIktcIixcIkxcIixcIk1cIixcIk5cIixcIk9cIixcIlBcIixcIlFcIixcIlJcIixcIlNcIixcIlRcIixcIlVcIixcIlZcIixcIldcIixcIlhcIixcIllcIixcIlpcIl07XHJcblx0bGV0IGlzX2FsZ28gPSBmYWxzZTtcclxuXHRsZXQgbWF4X25vZGUgPSAwO1xyXG5cdGxldCBpc19yZW1lZGlhdGlvbiA9IGZhbHNlO1xyXG5cdGxldCBtYXRjaF9saW5lcyA9IFtdO1xyXG5cdGxldCBlcnJvckNhdGNoRmxhZyA9IDE7XHJcblx0bGV0IG9yaWdpbmFsc2VxMSA9IFwiXCI7XHJcblx0bGV0IG9yaWdpbmFsc2VxMiA9IFwiXCI7XHJcblx0dWNNbGlkLnNpbmZvID0gdHJ1ZTtcclxuXHQvLyBsZXQgc2V0TGlzdDFIdG1sO1xyXG5cdC8vIGxldCBzZXRMaXN0Mkh0bWw7XHJcblx0bGV0IGJ0bmZsYWcgPSAxO1xyXG5cdGxldCBsaXN0ZW5DYWxsID0gMDtcclxuXHRsZXQgY29udGFpbmVySUQgPSAoY21lZCkgPyBcIm1hdGNobWFpblwiICsgY21lZCA6IFwibWF0Y2htYWluXCI7XHJcblx0bGV0IGRyYWdhYmxlO1xyXG5cdHZhciB0b3AxID0gMDtcclxuXHJcblx0bGV0IHN0YXRlID0ge1xyXG5cdFx0eG1sOiAnJyxcclxuXHRcdHJlbWVkU3RhdHVzOicnLFxyXG5cdFx0ZHJvcERpYWxvZzonJyxcclxuXHRcdGlzUmV2aWV3OiBmYWxzZSxcclxuXHR9XHJcblxyXG5cdCQ6IHtcclxuXHRpZiAoaXNSZXZpZXcgPT0gdHJ1ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygncmV2aWV3IG1vZGUnKTtcclxuXHRcdFx0Ly8gZm9yIGRpc3BsYXlpbmcgdGhlIGFuc1xyXG5cdFx0XHRkaXNwbGF5QW5zKCk7XHJcblx0XHRcdEFILnNlbGVjdChcIiNzaHVmZmxlQXJlYVwiLCBcImhpZGVcIiApO1xyXG5cdFx0XHR1Y01saWQubW9kZU9uKFwib25cIik7XHJcblx0XHRcdC8vIGlmIG1vZGUgaXMgbm9ybWFsIG9yIHN3YXAgbGlzdFxyXG5cdFx0XHRpZiAobXVsdGltYXRjaCA9PSAxIHx8IG11bHRpbWF0Y2ggPT0gMCkge1xyXG5cdFx0XHRcdEFILnNlbGVjdChcIi5ib3RoLWFuc1wiKS5jbGljaygpO1xyXG5cdFx0XHRcdC8vQUguZmluZChcIiNcIitjb250YWluZXJJRCAsIFwiI3NtX2NvbnRyb2xsZXJcIiwge2FjdGlvbjogXCJhZGRDbGFzc1wiLCBhY3Rpb25EYXRhOiBcImhcIn0pO1xyXG5cdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCArXCIgI3NtX2NvbnRyb2xsZXJcIiwnYWRkQ2xhc3MnLCdoJyk7XHJcblx0XHRcdFx0Ly9BSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELCBcIiNzbV9jb250cm9sbGVyX2RlZmF1bHRcIiwge2FjdGlvbjogJ3JlbW92ZUNsYXNzJywgYWN0aW9uRGF0YTogJ2gnfSk7XHJcblx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEICsnICNzbV9jb250cm9sbGVyX2RlZmF1bHQnLCdyZW1vdmVDbGFzcycsJ2gnKVxyXG5cdFx0XHRcdC8vQUguZmluZChcIiNcIitjb250YWluZXJJRCwgXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsIFwiY3NzXCIsIHtkaXNwbGF5OidpbmxpbmUtYmxvY2snfSk7XHJcblx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEKyBcIiAjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsXCJjc3NcIix7ZGlzcGxheTpcImlubGluZS1ibG9ja1wifSlcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBpZiBtb2RlIGlzIGRyYWcgJiBkcm9wXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIpLmFkZENsYXNzKFwiaFwiKTtcclxuXHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgXCIrXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsXCJhZGRDbGFzc1wiLFwiaFwiKTtcclxuXHJcblx0XHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoXCIjc21fY29udHJvbGxlclwiKS5yZW1vdmVDbGFzcyhcImhcIik7XHJcblx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEICsgXCIgXCIgKyBcIiNzbV9jb250cm9sbGVyXCIsXCJyZW1vdmVDbGFzc1wiLFwiaFwiKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwieW91ci1hbnNcIilbMF0uY2xpY2soKTtcclxuXHRcdFx0XHR9LDUwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGlmIHJlbWRpYXRpb24gbW9kZSBpcyBvZmZcclxuXHRcdFx0aXNSZXZpZXcgPSBmYWxzZTtcclxuXHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG5cdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgXCIrXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsXCJjc3NcIix7ZGlzcGxheTonbm9uZSd9KTtcclxuXHRcdFx0XHJcblx0XHRcdGlmKGlzU2h1ZmZlbGVkID09IHRydWUpIHtcclxuXHRcdFx0XHRBSC5zZWxlY3QoXCIjc2h1ZmZsZUFyZWFcIixcImNzc1wiLHtkaXNwbGF5Oidub25lJ30pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEFILnNlbGVjdChcIiNzaHVmZmxlQXJlYVwiLFwiY3NzXCIse2Rpc3BsYXk6XCJibG9ja1wifSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gc2V0IHRoZSB1c2VyIGFucyBpbiB0aGUgbW9kdWxlIFxyXG5cdFx0XHR1Y01saWQubW9kZU9uKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIGZvciBkaXNwbGF5aW5nIHRoZSBhbnN3ZXJcclxuXHRmdW5jdGlvbiBkaXNwbGF5QW5zKCkge1xyXG5cdFx0bGV0IGFucyA9IHVjTWxpZC5jaGVja0FucyhcIiNcIitjb250YWluZXJJRCk7XHJcblxyXG5cdFx0b25Vc2VyQW5zQ2hhbmdlKHt1WG1sOmFucy51LGFuczphbnMuYW5zfSk7XHJcblxyXG5cdFx0aWYoZWRpdG9yU3RhdGUpIHtcclxuXHRcdFx0c2hvd0FucyhhbnMuYW5zKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxvYWRMaWJzKCkge1xyXG4gICAgICAgIGxldCBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIHByZWxvYWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHR5cGU6ICdzdHlsZXNoZWV0JyxcclxuICAgICAgICAgICAgYXM6ICdzdHlsZSdcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9BSC5jcmVhdGVMaW5rKHdpbmRvdy5pdGVtRm9sZGVyICsgJ2Nsc1NNTWF0Y2hMaXN0L2Nzcy9tYXRjaExpc3QubWluLmNzcycsIGNvbmZpZyk7XHJcblx0XHRBSC5jcmVhdGVMaW5rKFwiaHR0cHM6Ly91bnBrZy5jb20vbW9uby1pY29uc0AxLjAuNS9pY29uZm9udC9pY29ucy5jc3NcIiwgY29uZmlnKTtcclxuICAgIH1cclxuXHRcclxuXHRvbk1vdW50KCgpPT4ge1xyXG5cdFx0bG9hZExpYnMoKTtcclxuXHRcdFxyXG5cdFx0ZHJhZ2FibGUgPSBuZXcgRHJhZ2dhYmxlKHtcclxuXHRcdFx0b25EcmFnRW50ZXI6ICgoZXZlbnQpPT57XHRcclxuXHRcdFx0XHRBSC5zZWxlY3QoZXZlbnQudGFyZ2V0LCdhZGRDbGFzcycsJ2Ryb3AtaG92ZXInKTtcclxuXHRcdFx0fSksXHJcblx0XHRcdG9uRHJhZ0xlYXZlOigoZXZlbnQpPT57XHJcblx0XHRcdFx0QUguc2VsZWN0KGV2ZW50LnRhcmdldCwncmVtb3ZlQ2xhc3MnLCdkcm9wLWhvdmVyJyk7XHJcblx0XHRcdH0pLFxyXG5cdFx0XHRvbkRyYWdFbmQ6KGV2ZW50KT0+e1xyXG5cdFx0XHRcdGRpc3BsYXlBbnMoKTtcclxuXHJcblx0XHRcdFx0QUguc2VsZWN0QWxsKCcubGlzdDInKS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsX3RoaXMpe1xyXG5cdFx0XHRcdFx0QUguc2VsZWN0KGRhdGEsJ3JlbW92ZUNsYXNzJywnZHJvcC1ob3ZlcicpO1xyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdEFILnNlbGVjdEFsbCgnLmxpc3QzJykuZm9yRWFjaChmdW5jdGlvbihkYXRhLF90aGlzKXtcclxuXHRcdFx0XHRcdEFILnNlbGVjdChkYXRhLCdyZW1vdmVDbGFzcycsJ2Ryb3AtaG92ZXInKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdFxyXG5cclxuXHRcdFx0XHRjb25zb2xlLmxvZygnb25EcmFnRW5kJyk7XHJcblx0XHRcdFx0aWYgKCF1Y01saWQuaXNfdmFsaWRfZHJvcCkge1xyXG5cdFx0XHRcdFx0aWYgKHVjTWxpZC5zaW5mbykge1xyXG5cdFx0XHRcdFx0XHR1Y01saWQuc2luZm8gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHR1Y01saWQuc2luZm8gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9LCA2MCAqIDEwMDApO1xyXG5cdFx0XHRcdFx0XHQvLyBpZiAoIVVDSU5GTy5pc0lwaG9uZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YoQUguYWxlcnQpID09ICdmdW5jdGlvbicpIFxyXG5cdFx0XHRcdFx0XHRcdFx0QUguc2hvd21zZygnV2hpbGUgZHJvcHBpbmcgYSBjb21wb25lbnQsIGtlZXAgeW91ciBtb3VzZSBwb2ludGVyIG9uIHRoZSBkcm9wIGFyZWEuIERyb3AgYXJlYSBtdXN0IGJlIGNvbXBhdGlibGUgd2l0aCB0aGUgY29tcG9uZW50IHlvdSBhcmUgZHJvcHBpbmcuJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnY2hlY2tpbmcgYm94Jyk7XHJcblx0XHRcdFx0XHRcdFx0aWYodWNNbGlkLmNoa0RvTm90U2hvdyh1c2VyX2d1aWQpICE9IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHN0YXRlLmRyb3BEaWFsb2cgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gaWYgKHR5cGVvZihiaW5kRGlhbG9nKSA9PSAnZnVuY3Rpb24nKSBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gYmluZERpYWxvZyh7IGNsaWNrOiB0aGlzLCB3ZDogNDUwLCBodDogMjM2LCBkYXRhOiAnPGRpdiB0aXRsZT1cIkhvdyB0byBkcm9wP1wiPjxpbWcgc3JjPVwiJyArIGpRdWVyeShtbGlkKS5hdHRyKCdwYXRoJykgKyAnbWF0Y2hfZHJvcF8wMDBCT0cuZ2lmXCIgLz48YnIvPjxzcGFuPjxsYWJlbD48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9XCJ0b3A6MnB4O1wiIGNsYXNzPVwicmVsYXRpdmUgZG9ub3RzaG93ZGlhbG9nXCI+IERvIG5vdCBzaG93IHRoaXMgZGlhbG9nIGFnYWluPC9sYWJlbD48L3NwYW4+PC9kaXY+JyB9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gcmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG4gICAgICAgIFx0fVxyXG5cdFx0fSlcclxuXHRcdFxyXG5cdFx0Ly8gQUgubGlzdGVuKGRvY3VtZW50LCdtb3VzZXVwJywnLnNodWZmbGVMaXN0MScsZnVuY3Rpb24oKXtcclxuXHRcdC8vIFx0Y29uc29sZS5sb2coJ3NodWZmbGVMaXN0MScpO1xyXG5cdFx0Ly8gXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdFx0ZGlzcGxheUFucygpO1xyXG5cdFx0Ly8gXHR9LDIwMClcclxuXHRcdC8vIH0pIC8vIFJlcGxhY2VkXHJcblxyXG5cdFx0Ly8gQUgubGlzdGVuKGRvY3VtZW50LCdtb3VzZXVwJywnLnNodWZmbGVMaXN0MicsZnVuY3Rpb24oKXtcclxuXHRcdC8vIFx0Y29uc29sZS5sb2coJ3NodWZmbGVMaXN0MicpO1xyXG5cdFx0Ly8gXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdFx0ZGlzcGxheUFucygpO1xyXG5cdFx0Ly8gXHR9LDIwMClcclxuXHRcdC8vIH0pXHJcblxyXG5cdFx0QUkubGlzdGVuKCcjbWF0Y2htYWluICcsJ2NsaWNrJywnLm1hdGNobGlzdC1kZWxldGUnLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZGlzcGxheUFucygpXHJcblx0XHRcdH0sMjAwKSAgICBcclxuXHRcdH0pXHJcblxyXG5cclxuXHRcdEFILmxpc3Rlbihkb2N1bWVudCwnY2xpY2snLCcjc2V0LXJldmlldycsZnVuY3Rpb24oKXtcclxuXHRcdFx0c2V0UmV2aWV3KCk7XHJcblx0XHR9KSBcclxuXHRcdFxyXG5cclxuXHRcdC8vIGJpbmRpbmcgdXAgdGhlIHVuc2V0cmV2aWV3IGZ1bmN0aW9uIFxyXG5cdFx0Ly8galF1ZXJ5KFwiI3Vuc2V0LXJldmlld1wiKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdHVuc2V0UmV2aWV3KCk7XHJcblx0XHQvLyB9KTsvLyBXaWxsIFJlcGxhY2VkXHJcblxyXG5cdFx0QUgubGlzdGVuKGRvY3VtZW50LCdjbGljaycsJyN1bnNldC1yZXZpZXcnLGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR1bnNldFJldmlldygpO1xyXG5cdFx0fSkgXHJcblxyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuXHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQrXCIgaW1nXCIpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGxldCBpbWdDb250YWluZXJJZCA9IEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiBpbWdcIik7XHJcblx0XHRcdEFILmxpc3Rlbihkb2N1bWVudCwnbG9hZCcsaW1nQ29udGFpbmVySWQsICgpPT4ge1xyXG5cdFx0XHRcdC8vIGlmIHJldmlldyBtb2RlIGlzIG9uXHJcblx0XHRcdFx0aWYgKGlzUmV2aWV3KSB7XHJcblx0XHRcdFx0XHQvLyBpZiBtdWx0aW1hdGNoIGlzIG5vcm1hbCBvciBzd2FwIGxpc3RcclxuXHRcdFx0XHRcdGlmIChtdWx0aW1hdGNoID09IDEgfHwgbXVsdGltYXRjaCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiICNzbV9jb250cm9sbGVyXCIsJ2FkZENsYXNzJywnaCcpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiAjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsXCJyZW1vdmVDbGFzc1wiLFwiaFwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLCdhZGRDbGFzcycsJ2gnKTtcclxuXHRcdFx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiICNzbV9jb250cm9sbGVyXCIsJ3JlbW92ZUNsYXNzJywnaCcpO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHVuc2V0UmV2aWV3KCk7XHJcblx0XHRcdFx0XHRzZXRSZXZpZXcoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2V0UmV2aWV3KCk7XHJcblx0XHRcdFx0XHR1bnNldFJldmlldygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LmJpbmQodGhpcyksNTAwKTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0bGlzdGVuKCk7XHJcblx0XHR9LDE1MDApO1xyXG5cdH0pXHJcblxyXG5cdC8vIGZ1bmN0aW9uIGZvciBiaW5kaW5nIGtleXVwIHVzaW5nIGhvdGtleXMgZnVuY3Rpb24gd2hpY2ggaXMgZGVmaW5lZCBpbiBwcmVwZW5naW5lLWZvb3Rlci5qc1xyXG5cdGZ1bmN0aW9uIGxpc3Rlbigpe1xyXG5cdFx0aWYobGlzdGVuQ2FsbCA+IDMpIHJldHVybiBmYWxzZTtcclxuXHRcdGlmKHR5cGVvZiBob3RrZXlzID09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImhvdGtleSBmdW5jdGlvbiBpcyBcIix0eXBlb2YgaG90a2V5cyA9PSBcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0dWNNbGlkLmJpbmRLZXl1cCgpO1xyXG5cdFx0XHR9LDEwMDApO1xyXG5cdFx0fSBlbHNle1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkhvdGtleSB0cnkgPSBcIixsaXN0ZW5DYWxsKTtcclxuXHRcdFx0bGlzdGVuQ2FsbCsrO1xyXG5cdFx0XHRsaXN0ZW4oKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGZ1bmN0aW9uIGNhbGxzIHdoZW4gcmVtZWRpYXRpb24gbW9kZSBpcyBvbiBpdCBiYXNpY2FsbHkgZGlzcGxheSB0aGUgYW5zXHJcblx0ZnVuY3Rpb24gc2V0UmV2aWV3KCkge1xyXG5cdFx0aXNSZXZpZXcgPSB0cnVlO1xyXG5cdFx0aXNfcmVtZWRpYXRpb24gPSB0cnVlO1xyXG5cdFx0Ly8gY2hlY2sgdGhlIGFuc3dlclxyXG5cdFx0ZGlzcGxheUFucygpO1xyXG5cdFx0Ly9qUXVlcnkoXCIjc2h1ZmZsZUFyZWFcIikuaGlkZSgpO1xyXG5cdFx0aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NodWZmbGVBcmUnKSE9bnVsbClcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaHVmZmxlQXJlJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyAvL1dJbGwgUmVwbGFjZWRcclxuXHRcdC8vIGZvciBzaG93aW5nIHRoZSBhbnN3ZXJcclxuXHRcdHVjTWxpZC5tb2RlT24oXCJvblwiKTtcclxuXHRcdC8vIGlmIG1vZGUgaXMgbm9ybWFsIG1vZGUgb3Igc3dhcCBsaXN0XHJcblx0XHRpZihtdWx0aW1hdGNoID09IDEgfHwgbXVsdGltYXRjaCA9PSAwKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRBSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELFwiI3NtX2NvbnRyb2xsZXJcIikuY2xhc3NMaXN0LmFkZChcImhcIik7XHJcblx0XHRcdFxyXG5cdFx0XHRBSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELFwiI3NtX2NvbnRyb2xsZXJcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0XHRcclxuXHRcdFx0QUguZmluZChcIiNcIitjb250YWluZXJJRCxcIiNzbV9jb250cm9sbGVyX2RlZmF1bHRcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8valF1ZXJ5KFwiI1wiK2NvbnRhaW5lcklEKS5maW5kKCcjc21fY29udHJvbGxlcl9kZWZhdWx0IC5ib3RoLWFucycpLmNsaWNrKCk7XHJcblx0XHRcdFx0QUguZmluZChcIiNcIitjb250YWluZXJJRCwnI3NtX2NvbnRyb2xsZXJfZGVmYXVsdCAuYm90aC1hbnMnKS5jbGljaygpO1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XHRcdFx0XHRcclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaWYgZHJhZyAmIGRyb3BcclxuXHRcdFx0XHJcblx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiBcIitcIiNzbV9jb250cm9sbGVyX2RlZmF1bHRcIikuY2xhc3NMaXN0LmFkZChcImhcIik7XHJcblx0XHRcdFxyXG5cdFx0XHRBSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELFwiI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHRcdFxyXG5cdFx0XHRBSC5zZWxlY3RBbGwoXCIjXCIrY29udGFpbmVySUQrXCIgXCIrXCIjc21fY29udHJvbGxlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcclxuXHRcdFx0Ly9jb250YWluZXJJZC5xdWVyeVNlbGVjdG9yKCcjc3NtX2NvbnRyb2xsZXInKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcclxuXHJcblx0XHRcdHZhciB0aW1lcl9uZXh0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQvL2pRdWVyeShcIiNcIitjb250YWluZXJJRCkuZmluZCgnI3NtX2NvbnRyb2xsZXJfZGVmYXVsdCAueW91ci1hbnMnKS5jbGljaygpO1xyXG5cdFx0XHRcdEFJLmZpbmQoXCIjXCIrY29udGFpbmVySUQsJyNzbV9jb250cm9sbGVyX2RlZmF1bHQgLnlvdXItYW5zJykuY2xpY2soKTtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXJfbmV4dCk7XHRcdFx0XHRcclxuXHRcdFx0fSwgMjAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGZ1bmN0aW9uIGNhbGxzIHdoZW4gcmVtZWRpYXRpb24gbW9kZSBpcyBvZmYgYWZ0ZXIgb24uXHJcblx0ZnVuY3Rpb24gdW5zZXRSZXZpZXcoKSB7XHJcblx0XHRpc1JldmlldyA9IGZhbHNlO1xyXG5cdFx0Ly9qUXVlcnkoJy5yZXZpZXdfMiwgLnJldmlld19kZWZhdWx0JykuYWRkQ2xhc3MoJ2gnKTtcclxuXHRcdEFILmFkZENsYXNzKCcucmV2aWV3XzIsIC5yZXZpZXdfZGVmYXVsdCcsJ2gnKTtcclxuXHJcblx0XHQvL2pRdWVyeSgnLnJldmlld18yLCAucmV2aWV3X2RlZmF1bHQnKS5oaWRlKCk7XHJcblx0XHRsZXQgcmVtb3ZlY2xhc3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmV2aWV3XzIsIC5yZXZpZXdfZGVmYXVsdCcpO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHJlbW92ZWNsYXNzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHJlbW92ZWNsYXNzW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdH1cclxuXHRcdC8vIHJldmlld19kZWZhdWx0Mi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHRpc19yZW1lZGlhdGlvbiA9IGZhbHNlO1xyXG5cdFx0Ly8gaWYgc2h1ZmZsZWRcclxuXHRcdGlmKGlzU2h1ZmZlbGVkID09IHRydWUpIHtcclxuXHRcdFx0QUguc2VsZWN0KCcjc2h1ZmZsZUFyZWEnLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0QUguc2VsZWN0KCcjc2h1ZmZsZUFyZWEnLCdjc3MnLHtkaXNwbGF5OidibG9jayd9KTtcclxuXHRcdH1cclxuXHRcdC8vIHNldCB0aGUgdXNlciBhbnMgaW4gdGhlIG1vZHVsZSBcclxuXHRcdHVjTWxpZC5tb2RlT24oKTtcclxuXHR9XHJcblxyXG5cdGJlZm9yZVVwZGF0ZSgoKT0+e1xyXG5cdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSBjaGFuZ2UgaW4gdGhlIG5ldyB4bWxcclxuXHRcdGlmKHN0YXRlLnhtbCAhPSB4bWwpIHtcclxuXHRcdFx0c3RhdGUueG1sID0geG1sO1xyXG5cdFx0XHRpZihjbWVkKSB7IFxyXG5cdFx0XHRcdGNvbnRhaW5lcklEID0gXCJtYXRjaG1haW5cIitjbWVkOyBcclxuXHRcdFx0XHR1Y01saWQuYWpheF9lSWQgPSBcIiNtYXRjaG1haW5cIitjbWVkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlzU2h1ZmZlbGVkID0gZmFsc2U7XHJcblx0XHRcdEFILnNlbGVjdCgnI3NodWZmbGVBcmVhJywnY3NzJyx7ZGlzcGxheTonYmxvY2snfSk7XHJcblx0XHRcdC8vIGNvbnZlcnQgdGhlIHhtbCBpbnRvIHRoZSBqc29uXHJcblx0XHRcdHZhciBuZXdYbWwgPSBYTUxUb0pTT04oeG1sKTtcclxuXHRcdFx0Ly8gcGFyc2UgdGhlIHhtbCBmb3IgdGhlIHByZXZpZXcgbW9kZVxyXG5cdFx0XHRwYXJzZVhNTFByZXZpZXcobmV3WG1sKTtcclxuXHRcdFx0Ly9mb3JjZVVwZGF0ZSgpOyAgT25seSByZWFjdCB1c2VzXHJcblx0XHRcdHJ1bk1vZHVsZSgpO1xyXG5cdFx0XHQvKkZvciBTaHVmZmxpbmcgKi9cclxuXHRcdFx0LyppZighd2luZG93LlFYTUwpIHtcclxuXHRcdFx0XHR2YXIgZXJyICA9IHNtVmFsLnZhbGlkYXRlKHRoaXMucHJvcHMuY29udGVudF90eXBlLCB0aGlzLnByb3BzLnN1YnR5cGUgLCB0aGlzLnByb3BzLmNvbnRlbnRfaWNvbik7XHJcblx0XHRcdFx0dGhpcy5wcm9wcy5zbVZhbGlkYXRlKGVycik7XHJcblx0XHRcdH0qL1x0XHRcdFxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdC8vIGNhbGxzIHdoZW5ldmVyIHhtbCBpcyB1cGRhdGVkIGFuZCB1cGRhdGUgdGhlIG1vZHVsZSBhY2NvcmRpbmdseVxyXG5cdGZ1bmN0aW9uIHJ1bk1vZHVsZSgpe1xyXG5cdFx0dHJ5e1xyXG5cdFx0XHRzaG93TW9kdWxlKCk7XHJcblx0XHR9Y2F0Y2goZSkge1xyXG5cdFx0XHRpZihlcnJvckNhdGNoRmxhZzw9MTAwKSB7XHJcblx0XHRcdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHJ1bk1vZHVsZSgpO1xyXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHRcdFx0XHR9LDUwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInJ1bk1vZHVsZTE0OkVycm9yXCIpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVycm9yQ2F0Y2hGbGFnKys7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBpdCBiYXNpY2FsbHkgcGFyc2UgdGhlIHVzZXIgYW5zd2VyIGFuZCBjYWxscyBvbmx5IG9uZSB0aW1lIGluIHRlc3QgYXJlYSBcclxuXHRmdW5jdGlvbiBwYXJzZVVzZXJBbnN3ZXIoKSB7XHJcblx0XHRsZXQgbWF0Y2hVYSA9IFhNTFRvSlNPTih1eG1sKTtcclxuXHRcdGlmKHV4bWwgJiYgbWF0Y2hVYS5zbWFucyAmJiBtYXRjaFVhLnNtYW5zLm1hdGNobGlzdCAmJiBtYXRjaFVhLnNtYW5zLm1hdGNobGlzdC5fdXNlcmFucykge1xyXG5cdFx0XHRsZXQgbWF0Y2hVYSA9IFhNTFRvSlNPTih1eG1sKTtcclxuXHRcdFx0bGV0IGxpc3RzZXExID0gbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX2xpc3Qxc2VxLnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0bGV0IGxpc3RzZXEyID0gbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX2xpc3Qyc2VxLnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0b3JpZ2luYWxzZXExID0gKChtYXRjaFVhLnNtYW5zLm1hdGNobGlzdC5fb3JpZ2luYWxzZXExKT8gbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX29yaWdpbmFsc2VxMS5zcGxpdChcIixcIikgOiBcIlwiICk7XHJcblx0XHRcdG9yaWdpbmFsc2VxMiA9ICgobWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX29yaWdpbmFsc2VxMik/IG1hdGNoVWEuc21hbnMubWF0Y2hsaXN0Ll9vcmlnaW5hbHNlcTIuc3BsaXQoXCIsXCIpIDogXCJcIiApO1xyXG5cdFx0XHQvKiBQcmVzZXJ2ZSBMaXN0IFNlcXVlbmNlMSovXHJcblx0XHRcdGxldCBuZXdBcnIgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiBsaXN0c2VxMSkge1xyXG5cdFx0XHRcdGZvciAoIGxldCBqIGluIGxpc3QxICkgIHtcclxuXHRcdFx0XHRcdFx0aWYgKGxpc3QxW2pdWydpZCddID09IGkpIHtcclxuXHRcdFx0XHRcdFx0bmV3QXJyLnB1c2gobGlzdDFbal0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRsaXN0MSA9IG5ld0FycjtcclxuXHRcdFx0LyoqKioqL1xyXG5cdFx0XHQvKiBQcmVzZXJ2ZSBMaXN0IFNlcXVlbmNlMiovXHJcblx0XHRcdGxldCBuZXdBcnIyID0gW107XHJcblx0XHRcdGZvciAobGV0IGkgb2YgbGlzdHNlcTIpIHtcclxuXHRcdFx0XHRmb3IgKCBsZXQgaiBpbiBsaXN0MiApICB7XHJcblx0XHRcdFx0XHRcdGlmIChsaXN0MltqXVsnaWQnXSA9PSBpKSB7XHJcblx0XHRcdFx0XHRcdG5ld0FycjIucHVzaChsaXN0MltqXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxpc3QyID0gbmV3QXJyMjtcclxuXHRcdFx0LyoqKioqL1x0XHJcblxyXG5cdFx0XHRpZihtYXRjaFVhLnNtYW5zLm1hdGNobGlzdC5fdXNlcmFucykge1xyXG5cdFx0XHRcdGNvbnN0IHVzZXJBbnMgPSBtYXRjaFVhLnNtYW5zLm1hdGNobGlzdC5fdXNlcmFucy5zcGxpdChcIixcIik7XHJcblx0XHRcdFx0Zm9yKGxldCBrIGluIHVzZXJBbnMpIHtcclxuXHRcdFx0XHRcdGZvcihsZXQgbSBpbiBsaXN0MSkge1xyXG5cdFx0XHRcdFx0XHRsZXQgdWFucyA9IHVzZXJBbnNba10uc3BsaXQoL1xcW3xcXF0vZylbMV07XHJcblx0XHRcdFx0XHRcdHVhbnMgPSB1YW5zLnNwbGl0KFwifFwiKTtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBuIGluIHVhbnMpIHtcclxuXHRcdFx0XHRcdFx0XHRpZihsaXN0MVttXVsnaWQnXSA9PSB1YW5zW25dKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsaXN0MVttXVsndXNlcmFucyddICs9IHVzZXJBbnNba10uc3BsaXQoL1xcW3xcXF0vZylbMF0rXCIsXCI7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHNlbGYuZm9yY2VVcGRhdGUoKTsgaXQgd29ya3Mgb25seSBpbiByZWFjdFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gc2h1ZmZsZSBsaXN0IDFcclxuXHRcdFx0c2h1ZmZsZUFycmF5KGxpc3QxKTtcclxuXHRcdFx0Ly8gc2h1ZmZsZSBsaXN0IDJcclxuXHRcdFx0c2h1ZmZsZUFycmF5KGxpc3QyKTtcclxuXHRcdFx0Ly8gcmVtb3ZlIHRoZSB1c2VyIGFuc1xyXG5cdFx0XHR1Y01saWQucmVtb3ZlVXNlckFucygpO1xyXG5cdFx0XHQvL2ZvcmNlVXBkYXRlKCk7XHJcblx0XHR9XHJcblx0XHR1Y01saWQuc2hvd1VzZXJBbnMoXCIjXCIrY29udGFpbmVySUQpO1xyXG5cdFx0dWNNbGlkLnJlbW92ZV9saW5lcyhcIiNcIitjb250YWluZXJJRCk7XHJcblx0XHQvLyBzZXQgdGhlIHVzZXIgYW5zIGluIHRoZSBtb2R1bGUgXHJcblx0XHR1Y01saWQubW9kZU9uKCk7XHJcblx0fVxyXG5cclxuXHQvLyBpdCBpcyBjYWxsZWQgd2hlbmV2ZXIgeG1sIGlzIHVwZGF0ZWQgXHJcblx0ZnVuY3Rpb24gc2hvd01vZHVsZSgpIHtcclxuXHRcdC8vIGZvciBjaGVja2luZyB1c2VyIGFuc1xyXG5cdFx0aWYoIXV4bWwpIHtcclxuXHRcdFx0Ly8gcmVtb3ZlIHRoZSB1c2VyIGFucyBpZiB0aGVyZSBpcyBubyB1c2VyIGFuc1xyXG5cdFx0XHR1Y01saWQucmVtb3ZlVXNlckFucygpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gYWRkaW5nIGRyYWdnYWJsZSBhbmQgZHJvcCBldmVudHNcclxuXHRcdHVjTWxpZC5zaG93VXNlckFucyhcIiNcIitjb250YWluZXJJRCk7XHJcblx0XHR1Y01saWQucmVtb3ZlX2xpbmVzKFwiI1wiK2NvbnRhaW5lcklEKTtcclxuXHRcdHVjTWxpZC5tb2RlT24oKTtcclxuXHRcdGlmKCFlZGl0b3JTdGF0ZSkge1xyXG5cdFx0XHQvLyBpZiBpdCBpcyBvcGVuIGluIHRlc3QgYXJlYSBwYXJzZSB0aGUgdXNlciBhbnN3ZXJcclxuXHRcdFx0Y29uc29sZS5sb2coJ3BhcnNlVXNlckFuc3dlcicpO1xyXG5cdFx0XHRwYXJzZVVzZXJBbnN3ZXIoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIHJldmlld01vZGVcclxuXHRcdGlmKGlzUmV2aWV3KSB7XHJcblx0XHRcdC8valF1ZXJ5KFwiI1wiK2NvbnRhaW5lcklEKS5maW5kKCcjc21fY29udHJvbGxlcl9kZWZhdWx0IC5ib3RoLWFucycpLmNsaWNrKCk7XHJcblx0XHRcdEFILmZpbmQoXCIjXCIrY29udGFpbmVySUQsJyNzbV9jb250cm9sbGVyX2RlZmF1bHQgLmJvdGgtYW5zJykuY2xpY2soKTtcclxuXHRcdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlzX3JlbWVkaWF0aW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRkaXNwbGF5QW5zKCk7XHJcblx0XHRcdFx0QUguc2VsZWN0KFwiI3NodWZmbGVBcmVhXCIsJ2Nzcycse2Rpc3BsYXk6J25vbmUnfSk7XHJcblx0XHRcdFx0dWNNbGlkLm1vZGVPbihcIm9uXCIpO1xyXG5cdFx0XHRcdGlmKG11bHRpbWF0Y2ggPT0gMSB8fCBtdWx0aW1hdGNoID09IDApIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiICNzbV9jb250cm9sbGVyXCIsJ2FkZENsYXNzJywnaCcpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiAjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsXCJyZW1vdmVDbGFzc1wiLFwiaFwiKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCArIFwiICNzbV9jb250cm9sbGVyX2RlZmF1bHRcIiwnYWRkQ2xhc3MnLCdoJyk7XHJcblx0XHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgI3NtX2NvbnRyb2xsZXJcIixcInJlbW92ZUNsYXNzXCIsXCJoXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cdFx0XHR9LDEwMCk7XHJcblx0XHRcdFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly9qUXVlcnkoJy5yZXZpZXdfMiwgLnJldmlld19kZWZhdWx0JykuYWRkQ2xhc3MoJ2gnKTtcclxuXHRcdFx0bGV0IHJldmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucmV2aWV3XzIsIC5yZXZpZXdfZGVmYXVsdFwiKTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IHJldmlldy5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHRyZXZpZXdbaV0uY2xhc3NMaXN0LmFkZChcImhcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGl0IGlzIGNhbGxlZCB3aGVuZXZlciB4bWwgaXMgdXBkYXRlZCAgYW5kIHBhcnNlIHRoZSB4bWwgZm9yIHByZXZpZXdcclxuXHRmdW5jdGlvbiBwYXJzZVhNTFByZXZpZXcoUVhNTCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0bGlzdDEgPSBbXTtcclxuXHRcdFx0bGlzdDIgPSBbXTtcclxuXHJcblx0XHRcdC8vIGZldGNoaW5nIHZhbHVlIGZyb20gdGhlIHhtbFxyXG5cdFx0XHRsaXN0aGVhZGluZzEgPSBRWE1MLnNteG1sLm1hdGNobGlzdC5fbGlzdGhlYWRpbmcxO1xyXG5cdFx0XHRsaXN0aGVhZGluZzIgPSBRWE1MLnNteG1sLm1hdGNobGlzdC5fbGlzdGhlYWRpbmcyO1xyXG5cdFx0XHRtdWx0aW1hdGNoID0gUVhNTC5zbXhtbC5tYXRjaGxpc3QuX211bHRpbWF0Y2g7XHJcblx0XHRcdGNkYXRhID0gUVhNTC5zbXhtbC5tYXRjaGxpc3QuX19jZGF0YTtcclxuXHRcdFx0Ly8gaWYgaXNfYWxnbyBpcyBpbiB4bWwsIGlmIGlzX2FsZ28gaXMgZXF1YWwgdG8gdHJ1ZSB0aGVuIHNldCBpdHMgdmFsdWUgdHJ1ZSBvdGhlcndpc2Ugc2V0IHRoZSB2YWx1ciB0byBmYWxzZVxyXG5cdFx0XHRpZiAoUVhNTC5zbXhtbC5tYXRjaGxpc3QuX2lzX2FsZ28pIHtcclxuXHRcdFx0XHRpc19hbGdvID0gKFFYTUwuc214bWwubWF0Y2hsaXN0Ll9pc19hbGdvID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpc19hbGdvID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY2hlY2tpbmcgZm9yIHRoZSBtYXhfbm9kZSAobWF4IG5vIG9mIG5vZGUpXHJcblx0XHRcdGlmIChRWE1MLnNteG1sLm1hdGNobGlzdC5fbWF4X25vZGUpIHtcclxuXHRcdFx0XHR2YXIgbnVtID0gTnVtYmVyKFFYTUwuc214bWwubWF0Y2hsaXN0Ll9tYXhfbm9kZSk7XHJcblx0XHRcdFx0bWF4X25vZGUgPSAoIG51bSA+IDAgPyBudW0gOiAwICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWF4X25vZGUgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBzcGxpdHRpbmcgdGhlIGNkYXRhIHdpdGggdGhlIG5ldyBsaW5lXHJcblx0XHRcdGNkYXRhID0gY2RhdGEuc3BsaXQoXCJcXG5cIik7XHJcblx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdHZhciBjb3VudExpc3QxID0xO1xyXG5cdFx0XHR2YXIgbXVsdGlwbGVWYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHR2YXIgbXVsdGlwbGVWYWx1ZUxpc3QyID0gZmFsc2U7XHJcblx0XHRcdHZhciB0ZW1wQW5zID0gXCJcIjtcclxuXHJcblx0XHRcdC8vIHRyYXZlcnNpbmcgdGhyb3VnaCB0aGUgY2RhdGFcclxuXHRcdFx0XHJcblx0XHRcdFx0Y2RhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhLGkpIHtcclxuXHRcdFx0XHRpZihjZGF0YVtpXS50cmltKCkgIT0gXCJcIikge1xyXG5cdFx0XHRcdFx0dG90YWxDb3JyZWN0QW5zICsrO1xyXG5cdFx0XHRcdFx0dmFyIGNvcnJlY3RBbnMgPSBcIlwiO1xyXG5cdFx0XHRcdFx0Ly8gZmluZGluZyB0aGUgdGV4dCB3aGljaCBzdGFydCB3aXRoIFsgYW5kIGVuZCB3aXRoIF1cclxuXHRcdFx0XHRcdGlmKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBzdG9yaW5nIHRoZSB2YWx1ZSBpbiBhbnMgdGhlbiByZW1vdmluZyB0aGUgYnJhY2tldHMgYW5kIHNwbGl0aW5nIGl0IHdpdGggfCBzeW1ib2xcclxuXHRcdFx0XHRcdFx0dmFyIGFucyA9IChjZGF0YVtpXS5tYXRjaCgvXFxbKC4qPylcXF0vZylbMF0pO1xyXG5cdFx0XHRcdFx0XHRhbnMgPSBhbnMucmVwbGFjZShcIltcIixcIlwiKS5yZXBsYWNlKFwiXVwiLFwiXCIpO1xyXG5cdFx0XHRcdFx0XHRhbnMgPSBhbnMuc3BsaXQoXCJ8XCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gdHJhdmVyc2luZyB0aHJvdWdoIGxpc3QgMiBcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bGlzdDIuZm9yRWFjaChmdW5jdGlvbihkYXRhLGwpe1xyXG5cdFx0XHRcdFx0XHRpZihsaXN0MltsXS52YWx1ZSA9PSBjZGF0YVtpXS5yZXBsYWNlKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKSxcIlwiKS50cmltKCkpIHtcclxuXHRcdFx0XHRcdFx0XHR0ZW1wQW5zID0gbGlzdDJbbF0uaWQ7XHJcblx0XHRcdFx0XHRcdFx0bXVsdGlwbGVWYWx1ZUxpc3QyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZihtdWx0aXBsZVZhbHVlTGlzdDIgIT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRsaXN0Mi5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRpZDphbHBoYWJldFtjb3VudF0sXHJcblx0XHRcdFx0XHRcdFx0Y29ycmVjdGFuczpcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBjZGF0YVtpXS5yZXBsYWNlKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKSxcIlwiKS50cmltKClcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGNvcnJlY3RBbnMgPSBsaXN0Mltjb3VudF0uaWQ7XHJcblx0XHRcdFx0XHR9ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNvcnJlY3RBbnMgPSB0ZW1wQW5zO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gdHJhdmVyc2luZyB0aHJvdWdoIGxpc3Qgb25lXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0bGlzdDEuZm9yRWFjaChmdW5jdGlvbihkYXRhMSxrKXtcclxuXHRcdFx0XHRcdFx0aWYobGlzdDFba10udmFsdWUgPT0gYW5zKSB7IC8vIHZhbHVlIHdpbGwgbmV2ZXIgdHJ1ZSBhcyBoZXJlIHN0cmluZyBpcyBjb21wYXJpbmcgd2l0aCBhcnJheVxyXG5cdFx0XHRcdFx0XHRcdG11bHRpcGxlVmFsdWUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGlmKG11bHRpcGxlVmFsdWVMaXN0MiAhPSB0cnVlKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdGxpc3QxW2tdLmNvcnJlY3RhbnMgPSBsaXN0MVtrXS5jb3JyZWN0YW5zK1wiLFwiK2xpc3QyW2NvdW50XS5pZDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0bGlzdDFba10uY29ycmVjdGFucyA9IGxpc3QxW2tdLmNvcnJlY3RhbnMrXCIsXCIrdGVtcEFucztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYobXVsdGlwbGVWYWx1ZSAhPXRydWUpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGFucy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsaSl7XHJcblx0XHRcdFx0XHRcdFx0bGlzdDEucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRpZDpjb3VudExpc3QxLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y29ycmVjdGFuczpjb3JyZWN0QW5zLFxyXG5cdFx0XHRcdFx0XHRcdFx0dXNlcmFuczpcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGFuc1tpXVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGNvdW50TGlzdDErKztcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRtdWx0aXBsZVZhbHVlID0gZmFsc2U7XHJcblx0XHRcdFx0XHQoKG11bHRpcGxlVmFsdWVMaXN0MiA9PSBmYWxzZSk/Y291bnQrKzpcIlwiKTtcclxuXHRcdFx0XHRcdG11bHRpcGxlVmFsdWVMaXN0MiA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBmb3IgdGhlIG1heCBub2RlXHJcblx0XHRcdGlmIChtYXhfbm9kZSA+IDAgJiYgbWF4X25vZGUgPD0gbGlzdDEubGVuZ3RoKSB7XHJcblx0XHRcdFx0Ly8gIHNodWZmbGluZyB0aGUgbGlzdFxyXG5cdFx0XHRcdGxpc3QxID0gc2h1ZmZsZUFycmF5KGxpc3QxKTtcclxuXHRcdFx0XHR2YXIgdGVtcGFyciA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF4X25vZGU7IGkrKykge1xyXG5cdFx0XHRcdFx0dGVtcGFyci5wdXNoKGxpc3QxW2ldKTtcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0MSA9IHRlbXBhcnI7XHJcblx0XHRcdFx0dGVtcGFyciA9IFtdO1xyXG5cdFx0XHRcdHRlbXBhcnIubGVuZ3RoID0gMDtcclxuXHRcdFx0XHR2YXIgZiA9IDA7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0MS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIGNvcnJlY3RhcnIgPSBsaXN0MVtpXS5jb3JyZWN0YW5zLnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgY29ycmVjdGFyci5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGxpc3QyLmxlbmd0aDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdFx0ZiA9IDA7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGNvcnJlY3RhcnJbal0gPT0gbGlzdDJba10uaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh0ZW1wYXJyLmxlbmd0aCA8PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRlbXBhcnIucHVzaChsaXN0MltrXSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBsID0gMDsgbCA8IHRlbXBhcnIubGVuZ3RoOyBsKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoY29ycmVjdGFycltqXSA9PSB0ZW1wYXJyW2xdLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmID0gMTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZiAhPSAxKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGVtcGFyci5wdXNoKGxpc3QyW2tdKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QyID0gdGVtcGFycjtcclxuXHRcdFx0fVxyXG5cdCAgICB9IGNhdGNoKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHtlcnJvcixmdW46J1BhcnNlWE1MUHJldmlldycsZmlsZTonTWF0Y2hsaXN0UHJldmlldy5qcyd9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIHNodWZmbGUgdGhlIGFycmF5XHJcblx0ZnVuY3Rpb24gc2h1ZmZsZUFycmF5KGFycmF5KSB7XHJcblx0ICAgIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcblx0ICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG5cdCAgICAgICAgbGV0IHRlbXAgPSBhcnJheVtpXTtcclxuXHQgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XHJcblx0ICAgICAgICBhcnJheVtqXSA9IHRlbXA7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIGFycmF5O1xyXG5cdH1cclxuXHJcblx0Ly8gc2h1ZmZsZSB0aGUgb3B0aW9uXHJcblx0ZnVuY3Rpb24gc2h1ZmZsZUl0ZW1zKCkge1xyXG5cdFx0Y29uc29sZS5sb2coXCJTaHVmZmxlZFwiKTtcclxuXHRcdGlzU2h1ZmZlbGVkID0gdHJ1ZTtcclxuXHRcdHVjTWxpZC5yZW1vdmVVc2VyQW5zKCk7XHJcblx0XHR1Y01saWQuc2hvd1VzZXJBbnMoXCIjXCIrY29udGFpbmVySUQpO1xyXG5cdFx0dWNNbGlkLnJlbW92ZV9saW5lcyhcIiNcIitjb250YWluZXJJRCk7XHJcblx0XHR1Y01saWQubW9kZU9uKCk7XHJcblx0XHRsaXN0MSA9IHNodWZmbGVBcnJheShsaXN0MSk7XHJcblx0XHRsaXN0MiA9IHNodWZmbGVBcnJheShsaXN0Mik7XHJcblx0XHRBSC5zZWxlY3QoJyNzaHVmZmxlQXJlYScsJ2Nzcycse2Rpc3BsYXk6J25vbmUnfSk7XHJcblx0fVxyXG5cclxuXHQvLyBpdCByZW1vdmVzIHRoZSBkcGxpY2F0ZSBlbGVtZW50IGluIGEgYXJyYXlcclxuXHRmdW5jdGlvbiByZW1vdmVfZHVwbGljYXRlc19lczYoYXJyKSB7XHJcblx0XHRhcnIgPSBhcnIuZmlsdGVyIChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkgeyBcclxuXHRcdFx0cmV0dXJuIGFycmF5LmluZGV4T2YgKHZhbHVlKSA9PSBpbmRleDtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblxyXG5cdGxldCBzZXRMaXN0MTtcclxuXHRsZXQgc2V0TGlzdDI7XHJcblxyXG5cdC8vIGZ1bmN0aW9uIHJhbmRvbUNob2ljZSAoYXJyKSB7XHJcblx0Ly8gXHRjb25zb2xlLmxvZyhcImFyciBhcnJcIik7XHJcblx0Ly8gXHRsZXQgcmFuZEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCk7XHJcblx0Ly8gXHRpdGVtLm9yaWdpbmFsc2VxID0gcmFuZEluZGV4OyAvLyBjaGFuZ2VcclxuXHQvLyBcdHJldHVybiBhcnJbcmFuZEluZGV4XTtcclxuXHQvLyB9XHJcblxyXG5cdGZ1bmN0aW9uIHNldExpc3QxSHRtbChpdGVtLGNvdW50KSB7IFxyXG5cdFx0ZnVuY3Rpb24gcmFuZG9tQ2hvaWNlIChhcnIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJhcnIgYXJyXCIpO1xyXG5cdFx0XHRsZXQgcmFuZEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCk7XHJcblx0XHRcdGl0ZW0ub3JpZ2luYWxzZXEgPSByYW5kSW5kZXg7IC8vIGNoYW5nZVxyXG5cdFx0XHRyZXR1cm4gYXJyW3JhbmRJbmRleF07XHJcblx0XHR9XHRcclxuXHRcdGlmIChpc19hbGdvID09IHRydWUgJiYgaXNfcmVtZWRpYXRpb24gIT0gdHJ1ZSkge1xyXG5cdFx0XHRpZihvcmlnaW5hbHNlcTEpIHtcclxuXHRcdFx0XHR2YXIgc2VxID0gb3JpZ2luYWxzZXExW2ldO1xyXG5cdFx0XHRcdGl0ZW0ub3JpZ2luYWxzZXEgPSBzZXE7IC8vIGNoYW5nZVxyXG5cdFx0XHRcdGl0ZW0udmFsdWUgPSBpdGVtLnZhbHVlLnNwbGl0KFwiJSVcIilbc2VxXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpdGVtLnZhbHVlID0gcmFuZG9tQ2hvaWNlKGl0ZW0udmFsdWUuc3BsaXQoXCIlJVwiKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGxldCBpbWdfc3JjID0gaXRlbS52YWx1ZS5zdWJzdHIoMSkuc3BsaXQoXCIjI1wiKVswXS5zcGxpdCgnJSUnKVswXTsgLy8gRm9yIGFsdCBpbXBsZW1lbnRhdGluZyB3aXRoICMjXHJcblx0XHRsZXQgaW1nX2FsdCA9IChpdGVtLnZhbHVlLnN1YnN0cigxKS5zcGxpdChcIiMjXCIpWzFdKSA/IGl0ZW0udmFsdWUuc3Vic3RyKDEpLnNwbGl0KFwiIyNcIilbMV0gOiBcIlwiO1xyXG5cdFx0c2V0TGlzdDEgPSBgPHNwYW4gY2xhc3M9XCJzZXJpYWxcIj4keyhjb3VudCsxKX0uPC9zcGFuPmArKChpdGVtLnZhbHVlLmNoYXJBdCgwKSA9PSBcIipcIikgPyBgPGltZyBjbGFzcz1cInBlLW5vbmVcIiBzcmM9XCIvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvJHtpbWdfc3JjfVwiIGFsdD1cIiR7aW1nX2FsdH1cIiAvPmAgOiAoaXNfYWxnbyA9PSB0cnVlID8gaXRlbS52YWx1ZSA6IGl0ZW0udmFsdWUpKTtcclxuXHRcdHJldHVybiBzZXRMaXN0MTtcclxuXHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldExpc3QySHRtbChpdGVtLGNvdW50KSB7XHJcblx0XHRmdW5jdGlvbiByYW5kb21DaG9pY2UgKGFycikge1xyXG5cdFx0XHR2YXIgcmFuZEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCk7XHJcblx0XHRcdC8vZGF0YS5vcmlnaW5hbHNlcSA9IHJhbmRJbmRleDtcclxuXHRcdFx0aXRlbS5vcmlnaW5hbHNlcSA9IHJhbmRJbmRleDtcclxuXHRcdFx0cmV0dXJuIGFycltyYW5kSW5kZXhdO1xyXG5cdFx0fSBcclxuXHRcdGlmIChpc19hbGdvID09IHRydWUgJiYgaXNfcmVtZWRpYXRpb24gIT0gdHJ1ZSkge1xyXG5cdFx0XHRpZihvcmlnaW5hbHNlcTIpIHtcclxuXHRcdFx0XHR2YXIgc2VxID0gb3JpZ2luYWxzZXEyW2ldO1xyXG5cdFx0XHRcdGRhdGEub3JpZ2luYWxzZXEgPSBzZXE7XHJcblx0XHRcdFx0aXRlbS52YWx1ZSA9IGl0ZW0udmFsdWUuc3BsaXQoXCIlJVwiKVtzZXFdO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGl0ZW0udmFsdWUgPSByYW5kb21DaG9pY2UoaXRlbS52YWx1ZS5zcGxpdChcIiUlXCIpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IGltZ19zcmMgPSBpdGVtLnZhbHVlLnN1YnN0cigxKS5zcGxpdChcIiMjXCIpWzBdLnNwbGl0KCclJScpWzBdOyAvLyBGb3IgYWx0IGltcGxlbWVudGF0aW5nIHdpdGggIyNcclxuXHRcdGxldCBpbWdfYWx0ID0gKGl0ZW0udmFsdWUuc3Vic3RyKDEpLnNwbGl0KFwiIyNcIilbMV0pID8gaXRlbS52YWx1ZS5zdWJzdHIoMSkuc3BsaXQoXCIjI1wiKVsxXSA6IFwiXCI7XHJcblx0XHRzZXRMaXN0MiA9IGA8c3BhbiBjbGFzcz1cInNlcmlhbFwiPiR7Y291bnR9Ljwvc3Bhbj5gKygoaXRlbS52YWx1ZS5jaGFyQXQoMCkgPT0gXCIqXCIpID8gYDxpbWcgY2xhc3M9XCJwZS1ub25lXCIgc3JjPVwiLy9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljLyR7aW1nX3NyY31cIiBhbHQ9XCIke2ltZ19hbHR9XCIgLz5gIDogKGlzX2FsZ28gPT0gdHJ1ZSA/IGl0ZW0udmFsdWUgOiBpdGVtLnZhbHVlKSlcclxuXHRcdHJldHVybiBzZXRMaXN0MjtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZVJldmlldyhtb2RlKSB7XHJcblx0XHRpZiAobW9kZSA9PSAnYycpIHtcclxuXHRcdFx0dWNNbGlkLnNob3dBbGxDb3JyZWN0QW5zKCcjJytjb250YWluZXJJRCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR1Y01saWQuc2hvd0FsbEFucygnIycrY29udGFpbmVySUQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0QUgubGlzdGVuKGRvY3VtZW50LCdjbGljaycsJy5jbHInLChfdGhpcyk9PntcclxuXHRcdEFILnNlbGVjdEFsbCgnLmNscicsJ3JlbW92ZUNsYXNzJywnYnRuLXByaW1hcnknKTtcclxuXHRcdEFILnNlbGVjdEFsbCgnLmNscicsJ2FkZENsYXNzJywnYnRuLWxpZ2h0Jyk7XHJcblx0XHRBSC5zZWxlY3QoX3RoaXMsJ3JlbW92ZUNsYXNzJywnYnRuLWxpZ2h0Jyk7XHJcblx0XHRBSC5zZWxlY3QoX3RoaXMsJ2FkZENsYXNzJywnYnRuLXByaW1hcnknKTtcclxuXHR9KVxyXG5cclxuXHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjxtYWluPlxyXG4gICAgPGRpdiBpZD1cInByZXZpZXdTZWN0aW9uXCIgY2xhc3M9XCJweC0yXCI+XHJcblx0XHQ8Y2VudGVyPlxyXG5cdFx0XHR7I2lmIGVkaXRvclN0YXRlfVxyXG5cdFx0XHRcdDxkaXYgXHJcblx0XHRcdFx0XHRpZD1cInNodWZmbGVBcmVhXCIgXHJcblx0XHRcdFx0XHRjbGFzcz1cInNodWZmbGUgdGV4dC1jZW50ZXJcIiBcclxuXHRcdFx0XHRcdG9uOmNsaWNrPXtzaHVmZmxlSXRlbXN9IFxyXG5cdFx0XHRcdFx0c3R5bGU9J2ZvbnQtc2l6ZToxN3B4O2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6bm9uZTtjb2xvcjojYWFhOydcclxuXHRcdFx0XHQ+XHJcblx0XHRcdFx0XHR7bC5zaHVmZmxlfVxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHR7L2lmfVxyXG5cdFx0XHQ8ZGl2IFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlkPXtjb250YWluZXJJRH0gXHJcblx0XHRcdFx0cGF0aD1cIi8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy9cIiBcclxuXHRcdFx0XHRtdWx0aW1hdGNoPXttdWx0aW1hdGNofSBcclxuXHRcdFx0XHR0b3RhbGNvcnJlY3RhbnM9e3RvdGFsQ29ycmVjdEFuc31cclxuXHRcdFx0XHRzdHlsZT0nZm9udC1mYW1pbHk6Um9ib3RvLCBzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxZW07J1xyXG5cdFx0XHQ+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bi1ncm91cCBjbGVhcmZpeCByZXZpZXdfMiBoXCIgaWQ9XCJzbV9jb250cm9sbGVyXCI+XHJcblx0XHRcdFx0XHQ8SXRlbUhlbHBlciBcclxuXHRcdFx0XHRcdFx0b246c2V0UmV2aWV3ID0ge3NldFJldmlld30gXHJcblx0XHRcdFx0XHRcdG9uOnVuc2V0UmV2aWV3ID0ge3Vuc2V0UmV2aWV3fSBcclxuXHRcdFx0XHRcdFx0aGFuZGxlUmV2aWV3Q2xpY2s9e2hhbmRsZVJldmlld31cclxuXHRcdFx0XHRcdFx0cmV2aWV3TW9kZT17aXNSZXZpZXd9IFxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPXtidG5mbGFnID09IDAgPyBcImhcIjpcIlwifT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgY2xlYXJmaXggcmV2aWV3X2RlZmF1bHQgaFwiIGlkPVwic21fY29udHJvbGxlcl9kZWZhdWx0XCI+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PXswfSBjbGFzcz1cImJ0biBidG4tbGlnaHQgY29ycmVjdC1hbnMgY2xyXCIgb246Y2xpY2s9eygpID0+IHVjTWxpZC5zaG93Q29ycmVjdCgnIycrY29udGFpbmVySUQpfSBvbjprZXl1cD17KGUpID0+IHtpZiAoZS5rZXlDb2RlID09IDEzKSB1Y01saWQuc2hvd0NvcnJlY3QoJyMnK2NvbnRhaW5lcklEKX19PkNvcnJlY3QgQW5zd2VyPC9idXR0b24+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PXswfSBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBib3RoLWFucyBjbHJcIiBvbjpjbGljaz17KCkgPT4gdWNNbGlkLnNob3dBbGwoJyMnK2NvbnRhaW5lcklEKX0gb246a2V5dXA9eyhlKSA9PiB7aWYgKGUua2V5Q29kZSA9PSAxMykgdWNNbGlkLnNob3dBbGwoJyMnK2NvbnRhaW5lcklEKX19PkNvbXBhcmU8L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgdGFiaW5kZXg9ezB9IGNsYXNzPVwiYnRuIGJ0bi1saWdodCB5b3VyLWFuc3dlciBjbHJcIiBvbjpjbGljaz17KCkgPT4gdWNNbGlkLnNob3dZb3VyKCcjJytjb250YWluZXJJRCl9IG9uOmtleXVwPXsoZSkgPT4ge2lmIChlLmtleUNvZGUgPT0gMTMpIHVjTWxpZC5zaG93WW91cignIycrY29udGFpbmVySUQpfX0+WW91ciBBbnN3ZXI8L2J1dHRvbj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3ctZmx1aWRcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuNFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGluZ1wiPntsaXN0aGVhZGluZzF9PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuM1wiPjwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNwYW40XCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkaW5nXCI+e2xpc3RoZWFkaW5nMn08L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHsjaWYgKG11bHRpbWF0Y2ggPT0gMCB8fCBtdWx0aW1hdGNoID09IDEpfVxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3ctZmx1aWRcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuNCBzaHVmZmxlTGlzdDFcIiBkcmFnYWJsZT1cIjFcIj5cclxuXHRcdFx0XHRcdFx0eyNlYWNoIGxpc3QxIGFzIGRhdGEsaX1cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXZcclxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5PXtpfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJsaXN0MSB1aS1kcmFnZ2FibGVcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvcnJlY3RhbnM9e2RhdGEuY29ycmVjdGFuc31cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS11c2VyYW5zPXtkYXRhLnVzZXJhbnN9XHJcblx0XHRcdFx0XHRcdFx0XHRcdHN0eWxlPXsncG9zaXRpb246cmVsYXRpdmU7J31cclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFiaW5kZXg9ezB9XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRyYWdnYWJsZSA9IFwidHJ1ZVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtb3JpZ2luYWxzZXE9eyhkYXRhLm9yaWdpbmFsc2VxKT9kYXRhLm9yaWdpbmFsc2VxOlwiMFwifVxyXG5cdFx0XHRcdFx0XHRcdFx0PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHR7QGh0bWwgc2V0TGlzdDFIdG1sKGRhdGEsaSl9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0ey9lYWNofVxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic3BhbjNcIj48L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuNCBzaHVmZmxlTGlzdDJcIj5cclxuXHRcdFx0XHRcdHsjZWFjaCBsaXN0MiBhcyBkYXRhLGl9XHJcblx0XHRcdFx0XHRcdDxkaXYgXHJcblx0XHRcdFx0XHRcdFx0a2V5PXtpfVxyXG5cdFx0XHRcdFx0XHRcdGlkPXtkYXRhLmlkfSBcclxuXHRcdFx0XHRcdFx0XHRjbGFzcz1cImxpc3QyIHVpLWRyb3BwYWJsZVwiIFxyXG5cdFx0XHRcdFx0XHRcdGRhdGEtY29ycmVjdGFucz1cIlwiIFxyXG5cdFx0XHRcdFx0XHRcdGRhdGEtdXNlcmFucz1cIlwiXHJcblx0XHRcdFx0XHRcdFx0ZHJvcHpvbmUgPSBcIjFcIlxyXG5cdFx0XHRcdFx0XHRcdHN0eWxlPXsncG9zaXRpb246cmVsYXRpdmU7J31cclxuXHRcdFx0XHRcdFx0XHR0YWJpbmRleD17MH1cclxuXHRcdFx0XHRcdFx0XHRkYXRhLW9yaWdpbmFsc2VxPXsoZGF0YS5vcmlnaW5hbHNlcSk/ZGF0YS5vcmlnaW5hbHNlcTpcIjBcIn1cclxuXHRcdFx0XHRcdFx0PlxyXG5cdFx0XHRcdFx0XHRcdHtAaHRtbCBzZXRMaXN0Mkh0bWwoZGF0YSxhbHBoYWJldFtpXSl9XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0ey9lYWNofVxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0ezplbHNlfVxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdy1mbHVpZCBzaHVmZmxlTGlzdDFcIj5cclxuXHRcdFx0XHRcdFx0eyNlYWNoIGxpc3QxIGFzIGRhdGEsaX1cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGtleT17aX0gY2xhc3M9XCJyb3ctZmx1aWRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwic3BhbjRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImxpc3QxXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD17MH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvcnJlY3RhbnM9e2RhdGEuY29ycmVjdGFuc31cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLXVzZXJhbnM9e2RhdGEudXNlcmFuc31cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLW9yaWdpbmFsc2VxPXsoZGF0YS5vcmlnaW5hbHNlcSk/ZGF0YS5vcmlnaW5hbHNlcTpcIjBcIn1cclxuXHRcdFx0XHRcdFx0XHRcdFx0PntAaHRtbCBzZXRMaXN0MUh0bWwoZGF0YSxpKX08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwic3BhbjNcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBpZD17ZGF0YS5pZH0gY2xhc3M9XCJhcnJvd1wiPjwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJzcGFuNFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ9e2RhdGEuaWR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJsaXN0MyB1aS1kcm9wcGFibGVcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtZHJvcGVkPVwiXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvcnJlY3RhbnM9e2RhdGEuY29ycmVjdGFuc31cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLXVzZXJhbnM9e2RhdGEudXNlcmFuc31cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtcmVsPXtkYXRhLmlkfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRyb3B6b25lID0gXCIxXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkcmFnZ2FibGUgPSBcInRydWVcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmluZGV4PXswfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFyaWEtbGFiZWw9e2BEcm9wZWRgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtb3JpZ2luYWxzZXE9eyhkYXRhLm9yaWdpbmFsc2VxKT9kYXRhLm9yaWdpbmFsc2VxOlwiMFwifVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0UGxhY2UgSGVyZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0ey9lYWNofVxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93LWZsdWlkIG1hdGNoX29wdGlvbnMgc2h1ZmZsZUxpc3QyXCI+XHJcblx0XHRcdFx0XHRcdFx0eyNlYWNoIGxpc3QyIGFzIGRhdGEsaX1cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXZcclxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5PXtpfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJsaXN0NCB1aS1kcmFnZ2FibGVcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvcnJlY3RhbnM9XCJcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkcmFnYWJsZSA9IFwiMVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRyYWdnYWJsZSA9IFwidHJ1ZVwiXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLXVzZXJhbnM9XCJcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD17MH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS1vcmlnaW5hbHNlcT17KGRhdGEub3JpZ2luYWxzZXEpP2RhdGEub3JpZ2luYWxzZXE6XCIwXCJ9XHJcblx0XHRcdFx0XHRcdFx0XHQ+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHtAaHRtbCBzZXRMaXN0Mkh0bWwoZGF0YSxhbHBoYWJldFtpXSl9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHR7L2VhY2h9XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0ey9pZn1cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2NlbnRlcj5cclxuXHQ8L2Rpdj5cclxuXHQ8RGlhbG9nIFxyXG5cdFx0YmluZDp2aXNpYmxlPXtzdGF0ZS5kcm9wRGlhbG9nfSBcclxuXHRcdHN0eWxlPXsnd2lkdGg6NDUwcHg7aGVpZ2h0OjI1NHB4Oyd9IFxyXG5cdD5cclxuXHRcdFx0PGRpdiBzdHlsZT1cImZvbnQtd2VpZ2h0OmJvbGQ7XCIgY2xhc3M9XCJjbGVhcmZpeFwiPlxyXG5cdFx0XHRcdDxkaXYgdGl0bGU9XCJIb3cgdG8gZHJvcD9cIiBjbGFzcz1cImZsb2F0LXN0YXJ0XCI+SG93IHRvIGRyb3A/PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImZsb2F0LWVuZFwiPlxyXG5cdFx0XHRcdFx0PEJ1dHRvbiBzdHlsZT17J3Bvc2l0aW9uOnJlbGF0aXZlO2xlZnQ6MjFweDtib3R0b206NnB4Oyd9IG9uOmNsaWNrPXsoKT0+e3N0YXRlLmRyb3BEaWFsb2cgPSBmYWxzZX19PlxyXG5cdFx0XHRcdFx0XHQ8aSBjbGFzcz1cIm1pIG1pLWNsb3NlXCI+PHNwYW4gY2xhc3M9XCJ1LXNyLW9ubHlcIj5jbG9zZTwvc3Bhbj48L2k+XHJcblx0XHRcdFx0XHQ8L0J1dHRvbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQ8aW1nIFxyXG5cdFx0XHRcdFx0XHRhbHQ9XCJnaWYgZmlsZVwiIFxyXG5cdFx0XHRcdFx0XHRzcmM9e0FILnNlbGVjdChcIiNtYXRjaG1haW5cIikuZ2V0QXR0cmlidXRlKCdwYXRoJykgKyBcIm1hdGNoX2Ryb3BfMDAwQk9HLmdpZlwifSBcclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHQ8YnIvPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJtdC0yXCI+XHJcblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT1cInRvcDoycHg7XCIgY2xhc3M9XCJyZWxhdGl2ZSBkb25vdHNob3dkaWFsb2dcIiBpZD1cImRyb3BJZFwiIC8+XHJcblx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJkcm9wSWRcIj5EbyBub3Qgc2hvdyB0aGlzIGRpYWxvZyBhZ2FpbjwvbGFiZWw+XHJcblx0XHRcdFx0XHQ8L3NwYW4+XHJcblxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcclxuXHQ8L0RpYWxvZz4gXHJcbjwvbWFpbj5cclxuXHJcbjxzdHlsZT5cclxuXHQudS1zci1vbmx5IHtcclxuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdGxlZnQ6IC0xMDAwMHB4O1xyXG5cdFx0dG9wOiBhdXRvO1xyXG5cdFx0d2lkdGg6MXB4O1xyXG5cdFx0aGVpZ2h0OjFweDtcclxuXHRcdG92ZXJmbG93OmhpZGRlbjtcclxuXHR9XHJcblx0QG1lZGlhKG1heC13aWR0aDo1MDBweCkge1xyXG5cdFx0LnNodWZmbGUge1xyXG5cdFx0XHR0ZXh0LWFsaWduOmNlbnRlcjtcclxuXHRcdH1cclxuXHR9XHJcbjwvc3R5bGU+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE4M0JDLFVBQVUsY0FBQyxDQUFDLEFBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsSUFBSSxDQUFFLFFBQVEsQ0FDZCxHQUFHLENBQUUsSUFBSSxDQUNULE1BQU0sR0FBRyxDQUNULE9BQU8sR0FBRyxDQUNWLFNBQVMsTUFBTSxBQUNoQixDQUFDLEFBQ0QsTUFBTSxXQUFXLEtBQUssQ0FBQyxBQUFDLENBQUMsQUFDeEIsUUFBUSxjQUFDLENBQUMsQUFDVCxXQUFXLE1BQU0sQUFDbEIsQ0FBQyxBQUNGLENBQUMifQ== */";
	append_dev(document_1.head, style);
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

// (720:3) {#if editorState}
function create_if_block_1(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = `${Lang.shuffle}`;
			attr_dev(div, "id", "shuffleArea");
			attr_dev(div, "class", "shuffle text-center svelte-bi3u6x");
			set_style(div, "font-size", "17px");
			set_style(div, "cursor", "pointer");
			set_style(div, "display", "none");
			set_style(div, "color", "#aaa");
			add_location(div, file, 720, 4, 22043);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = listen_dev(div, "click", /*shuffleItems*/ ctx[15], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(720:3) {#if editorState}",
		ctx
	});

	return block;
}

// (802:4) {:else}
function create_else_block(ctx) {
	let div1;
	let t;
	let div0;
	let each_value_3 = /*list1*/ ctx[6];
	validate_each_argument(each_value_3);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let each_value_2 = /*list2*/ ctx[7];
	validate_each_argument(each_value_2);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "row-fluid match_options shuffleList2");
			add_location(div0, file, 838, 6, 26014);
			attr_dev(div1, "class", "row-fluid shuffleList1");
			add_location(div1, file, 802, 5, 24931);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div1, null);
			}

			append_dev(div1, t);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1, setList1Html*/ 65600) {
				each_value_3 = /*list1*/ ctx[6];
				validate_each_argument(each_value_3);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_3(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div1, t);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_3.length;
			}

			if (dirty[0] & /*list2, setList2Html, alphabet*/ 133248) {
				each_value_2 = /*list2*/ ctx[7];
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(802:4) {:else}",
		ctx
	});

	return block;
}

// (763:4) {#if (multimatch == 0 || multimatch == 1)}
function create_if_block(ctx) {
	let div3;
	let div0;
	let t0;
	let div1;
	let t1;
	let div2;
	let each_value_1 = /*list1*/ ctx[6];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*list2*/ ctx[7];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div3 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			div1 = element("div");
			t1 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "span4 shuffleList1");
			attr_dev(div0, "dragable", "1");
			add_location(div0, file, 764, 5, 23901);
			attr_dev(div1, "class", "span3");
			add_location(div1, file, 782, 5, 24421);
			attr_dev(div2, "class", "span4 shuffleList2");
			add_location(div2, file, 783, 5, 24453);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 763, 4, 23871);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			append_dev(div3, t0);
			append_dev(div3, div1);
			append_dev(div3, t1);
			append_dev(div3, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div2, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1, setList1Html*/ 65600) {
				each_value_1 = /*list1*/ ctx[6];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div0, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty[0] & /*list2, setList2Html, alphabet*/ 133248) {
				each_value = /*list2*/ ctx[7];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(763:4) {#if (multimatch == 0 || multimatch == 1)}",
		ctx
	});

	return block;
}

// (804:6) {#each list1 as data,i}
function create_each_block_3(ctx) {
	let div3;
	let span0;
	let div0;
	let raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "";
	let div0_id_value;
	let div0_tabindex_value;
	let div0_data_correctans_value;
	let div0_data_userans_value;
	let div0_data_originalseq_value;
	let t0;
	let span1;
	let div1;
	let div1_id_value;
	let t1;
	let span2;
	let div2;
	let t2;
	let div2_id_value;
	let div2_data_correctans_value;
	let div2_data_userans_value;
	let div2_mrel_value;
	let div2_tabindex_value;
	let div2_aria_label_value;
	let div2_data_originalseq_value;
	let div3_key_value;

	const block = {
		c: function create() {
			div3 = element("div");
			span0 = element("span");
			div0 = element("div");
			t0 = space();
			span1 = element("span");
			div1 = element("div");
			t1 = space();
			span2 = element("span");
			div2 = element("div");
			t2 = text("Place Here");
			attr_dev(div0, "id", div0_id_value = /*data*/ ctx[52].id);
			attr_dev(div0, "class", "list1");
			attr_dev(div0, "tabindex", div0_tabindex_value = 0);
			attr_dev(div0, "data-correctans", div0_data_correctans_value = /*data*/ ctx[52].correctans);
			attr_dev(div0, "data-userans", div0_data_userans_value = /*data*/ ctx[52].userans);

			attr_dev(div0, "data-originalseq", div0_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div0, file, 806, 9, 25079);
			attr_dev(span0, "class", "span4");
			add_location(span0, file, 805, 8, 25048);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[52].id);
			attr_dev(div1, "class", "arrow");
			add_location(div1, file, 817, 9, 25427);
			attr_dev(span1, "class", "span3");
			add_location(span1, file, 816, 8, 25396);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[52].id);
			attr_dev(div2, "class", "list3 ui-droppable");
			attr_dev(div2, "data-droped", "");
			attr_dev(div2, "data-correctans", div2_data_correctans_value = /*data*/ ctx[52].correctans);
			attr_dev(div2, "data-userans", div2_data_userans_value = /*data*/ ctx[52].userans);
			attr_dev(div2, "mrel", div2_mrel_value = /*data*/ ctx[52].id);
			attr_dev(div2, "dropzone", "1");
			attr_dev(div2, "draggable", "true");
			attr_dev(div2, "tabindex", div2_tabindex_value = 0);
			attr_dev(div2, "aria-label", div2_aria_label_value = `Droped`);

			attr_dev(div2, "data-originalseq", div2_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div2, file, 820, 9, 25523);
			attr_dev(span2, "class", "span4");
			add_location(span2, file, 819, 8, 25492);
			attr_dev(div3, "key", div3_key_value = /*i*/ ctx[54]);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 804, 7, 25007);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, span0);
			append_dev(span0, div0);
			div0.innerHTML = raw_value;
			append_dev(div3, t0);
			append_dev(div3, span1);
			append_dev(span1, div1);
			append_dev(div3, t1);
			append_dev(div3, span2);
			append_dev(span2, div2);
			append_dev(div2, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1*/ 64 && raw_value !== (raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "")) div0.innerHTML = raw_value;
			if (dirty[0] & /*list1*/ 64 && div0_id_value !== (div0_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div0, "id", div0_id_value);
			}

			if (dirty[0] & /*list1*/ 64 && div0_data_correctans_value !== (div0_data_correctans_value = /*data*/ ctx[52].correctans)) {
				attr_dev(div0, "data-correctans", div0_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 64 && div0_data_userans_value !== (div0_data_userans_value = /*data*/ ctx[52].userans)) {
				attr_dev(div0, "data-userans", div0_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 64 && div0_data_originalseq_value !== (div0_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div0, "data-originalseq", div0_data_originalseq_value);
			}

			if (dirty[0] & /*list1*/ 64 && div1_id_value !== (div1_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div1, "id", div1_id_value);
			}

			if (dirty[0] & /*list1*/ 64 && div2_id_value !== (div2_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty[0] & /*list1*/ 64 && div2_data_correctans_value !== (div2_data_correctans_value = /*data*/ ctx[52].correctans)) {
				attr_dev(div2, "data-correctans", div2_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 64 && div2_data_userans_value !== (div2_data_userans_value = /*data*/ ctx[52].userans)) {
				attr_dev(div2, "data-userans", div2_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 64 && div2_mrel_value !== (div2_mrel_value = /*data*/ ctx[52].id)) {
				attr_dev(div2, "mrel", div2_mrel_value);
			}

			if (dirty[0] & /*list1*/ 64 && div2_data_originalseq_value !== (div2_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div2, "data-originalseq", div2_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_3.name,
		type: "each",
		source: "(804:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (840:7) {#each list2 as data,i}
function create_each_block_2(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			t = space();
			html_tag = new HtmlTag(t);
			attr_dev(div, "key", div_key_value = /*i*/ ctx[54]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[52].id);
			attr_dev(div, "class", "list4 ui-draggable");
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "dragable", "1");
			attr_dev(div, "draggable", "true");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "tabindex", div_tabindex_value = 0);

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div, file, 840, 8, 26106);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list2*/ 128 && raw_value !== (raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list2*/ 128 && div_id_value !== (div_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list2*/ 128 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div, "data-originalseq", div_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(840:7) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (766:6) {#each list1 as data,i}
function create_each_block_1(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_data_correctans_value;
	let div_data_userans_value;
	let div_style_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			t = space();
			html_tag = new HtmlTag(t);
			attr_dev(div, "key", div_key_value = /*i*/ ctx[54]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[52].id);
			attr_dev(div, "class", "list1 ui-draggable");
			attr_dev(div, "data-correctans", div_data_correctans_value = /*data*/ ctx[52].correctans);
			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[52].userans);
			attr_dev(div, "style", div_style_value = "position:relative;");
			attr_dev(div, "tabindex", div_tabindex_value = 0);
			attr_dev(div, "draggable", "true");

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div, file, 766, 8, 23987);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1*/ 64 && raw_value !== (raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list1*/ 64 && div_id_value !== (div_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list1*/ 64 && div_data_correctans_value !== (div_data_correctans_value = /*data*/ ctx[52].correctans)) {
				attr_dev(div, "data-correctans", div_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 64 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[52].userans)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 64 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div, "data-originalseq", div_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(766:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (785:5) {#each list2 as data,i}
function create_each_block(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_style_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			t = space();
			html_tag = new HtmlTag(t);
			attr_dev(div, "key", div_key_value = /*i*/ ctx[54]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[52].id);
			attr_dev(div, "class", "list2 ui-droppable");
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "dropzone", "1");
			attr_dev(div, "style", div_style_value = "position:relative;");
			attr_dev(div, "tabindex", div_tabindex_value = 0);

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div, file, 785, 6, 24523);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list2*/ 128 && raw_value !== (raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list2*/ 128 && div_id_value !== (div_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list2*/ 128 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div, "data-originalseq", div_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(785:5) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (869:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>
function create_default_slot_1(ctx) {
	let i_1;
	let span;

	const block = {
		c: function create() {
			i_1 = element("i");
			span = element("span");
			span.textContent = "close";
			attr_dev(span, "class", "u-sr-only svelte-bi3u6x");
			add_location(span, file, 869, 29, 26935);
			attr_dev(i_1, "class", "mi mi-close");
			add_location(i_1, file, 869, 6, 26912);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i_1, anchor);
			append_dev(i_1, span);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i_1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(869:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>",
		ctx
	});

	return block;
}

// (862:1) <Dialog     bind:visible={state.dropDialog}     style={'width:450px;height:254px;'}    >
function create_default_slot(ctx) {
	let div2;
	let div0;
	let t1;
	let div1;
	let button;
	let t2;
	let div4;
	let div3;
	let img;
	let img_src_value;
	let t3;
	let br;
	let t4;
	let span;
	let input;
	let t5;
	let label;
	let current;

	button = new Button({
			props: {
				style: "position:relative;left:21px;bottom:6px;",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler_3*/ ctx[29]);

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "How to drop?";
			t1 = space();
			div1 = element("div");
			create_component(button.$$.fragment);
			t2 = space();
			div4 = element("div");
			div3 = element("div");
			img = element("img");
			t3 = space();
			br = element("br");
			t4 = space();
			span = element("span");
			input = element("input");
			t5 = space();
			label = element("label");
			label.textContent = "Do not show this dialog again";
			attr_dev(div0, "title", "How to drop?");
			attr_dev(div0, "class", "float-start");
			add_location(div0, file, 866, 4, 26704);
			attr_dev(div1, "class", "float-end");
			add_location(div1, file, 867, 4, 26774);
			set_style(div2, "font-weight", "bold");
			attr_dev(div2, "class", "clearfix");
			add_location(div2, file, 865, 3, 26650);
			attr_dev(img, "alt", "gif file");
			if (img.src !== (img_src_value = AH$1.select("#matchmain").getAttribute("path") + "match_drop_000BOG.gif")) attr_dev(img, "src", img_src_value);
			add_location(img, file, 876, 5, 27061);
			add_location(br, file, 880, 5, 27190);
			attr_dev(input, "type", "checkbox");
			set_style(input, "top", "2px");
			attr_dev(input, "class", "relative donotshowdialog");
			attr_dev(input, "id", "dropId");
			add_location(input, file, 882, 6, 27229);
			attr_dev(label, "for", "dropId");
			add_location(label, file, 883, 6, 27324);
			attr_dev(span, "class", "mt-2");
			add_location(span, file, 881, 5, 27202);
			attr_dev(div3, "class", "row");
			add_location(div3, file, 874, 4, 27030);
			add_location(div4, file, 873, 3, 27019);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			mount_component(button, div1, null);
			insert_dev(target, t2, anchor);
			insert_dev(target, div4, anchor);
			append_dev(div4, div3);
			append_dev(div3, img);
			append_dev(div3, t3);
			append_dev(div3, br);
			append_dev(div3, t4);
			append_dev(div3, span);
			append_dev(span, input);
			append_dev(span, t5);
			append_dev(span, label);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty[1] & /*$$scope*/ 134217728) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(button);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(862:1) <Dialog     bind:visible={state.dropDialog}     style={'width:450px;height:254px;'}    >",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let div10;
	let center;
	let t0;
	let div9;
	let div0;
	let itemhelper;
	let t1;
	let div2;
	let div1;
	let button0;
	let button0_tabindex_value;
	let t3;
	let button1;
	let button1_tabindex_value;
	let t5;
	let button2;
	let button2_tabindex_value;
	let div2_class_value;
	let t7;
	let div8;
	let div4;
	let div3;
	let t8;
	let t9;
	let div5;
	let t10;
	let div7;
	let div6;
	let t11;
	let t12;
	let t13;
	let dialog;
	let updating_visible;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*editorState*/ ctx[1] && create_if_block_1(ctx);

	itemhelper = new ItemHelper({
			props: {
				handleReviewClick: /*handleReview*/ ctx[18],
				reviewMode: /*isReview*/ ctx[0]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[13]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[14]);

	function select_block_type(ctx, dirty) {
		if (/*multimatch*/ ctx[5] == 0 || /*multimatch*/ ctx[5] == 1) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	function dialog_visible_binding(value) {
		/*dialog_visible_binding*/ ctx[30].call(null, value);
	}

	let dialog_props = {
		style: "width:450px;height:254px;",
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*state*/ ctx[10].dropDialog !== void 0) {
		dialog_props.visible = /*state*/ ctx[10].dropDialog;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));

	const block = {
		c: function create() {
			main = element("main");
			div10 = element("div");
			center = element("center");
			if (if_block0) if_block0.c();
			t0 = space();
			div9 = element("div");
			div0 = element("div");
			create_component(itemhelper.$$.fragment);
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			button0 = element("button");
			button0.textContent = "Correct Answer";
			t3 = space();
			button1 = element("button");
			button1.textContent = "Compare";
			t5 = space();
			button2 = element("button");
			button2.textContent = "Your Answer";
			t7 = space();
			div8 = element("div");
			div4 = element("div");
			div3 = element("div");
			t8 = text(/*listheading1*/ ctx[3]);
			t9 = space();
			div5 = element("div");
			t10 = space();
			div7 = element("div");
			div6 = element("div");
			t11 = text(/*listheading2*/ ctx[4]);
			t12 = space();
			if_block1.c();
			t13 = space();
			create_component(dialog.$$.fragment);
			attr_dev(div0, "class", "btn-group clearfix review_2 h");
			attr_dev(div0, "id", "sm_controller");
			add_location(div0, file, 737, 4, 22490);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "tabindex", button0_tabindex_value = 0);
			attr_dev(button0, "class", "btn btn-light correct-ans clr");
			add_location(button0, file, 747, 6, 22868);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "tabindex", button1_tabindex_value = 0);
			attr_dev(button1, "class", "btn btn-primary both-ans clr");
			add_location(button1, file, 748, 6, 23102);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "tabindex", button2_tabindex_value = 0);
			attr_dev(button2, "class", "btn btn-light your-answer clr");
			add_location(button2, file, 749, 6, 23320);
			attr_dev(div1, "class", "btn-group clearfix review_default h");
			attr_dev(div1, "id", "sm_controller_default");
			add_location(div1, file, 746, 5, 22784);
			attr_dev(div2, "class", div2_class_value = /*btnflag*/ ctx[12] == 0 ? "h" : "");
			add_location(div2, file, 745, 4, 22742);
			attr_dev(div3, "class", "heading");
			add_location(div3, file, 754, 6, 23625);
			attr_dev(div4, "class", "span4");
			add_location(div4, file, 753, 5, 23598);
			attr_dev(div5, "class", "span3");
			add_location(div5, file, 756, 5, 23686);
			attr_dev(div6, "class", "heading");
			add_location(div6, file, 758, 6, 23745);
			attr_dev(div7, "class", "span4");
			add_location(div7, file, 757, 5, 23718);
			attr_dev(div8, "class", "row-fluid");
			add_location(div8, file, 752, 4, 23568);
			attr_dev(div9, "id", /*containerID*/ ctx[9]);
			attr_dev(div9, "path", "//s3.amazonaws.com/jigyaasa_content_static/");
			attr_dev(div9, "multimatch", /*multimatch*/ ctx[5]);
			attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[8]);
			set_style(div9, "font-family", "Roboto, sans-serif");
			set_style(div9, "font-size", "1em");
			add_location(div9, file, 729, 3, 22259);
			add_location(center, file, 718, 2, 22007);
			attr_dev(div10, "id", "previewSection");
			attr_dev(div10, "class", "px-2");
			add_location(div10, file, 717, 4, 21965);
			add_location(main, file, 716, 0, 21953);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div10);
			append_dev(div10, center);
			if (if_block0) if_block0.m(center, null);
			append_dev(center, t0);
			append_dev(center, div9);
			append_dev(div9, div0);
			mount_component(itemhelper, div0, null);
			append_dev(div9, t1);
			append_dev(div9, div2);
			append_dev(div2, div1);
			append_dev(div1, button0);
			append_dev(div1, t3);
			append_dev(div1, button1);
			append_dev(div1, t5);
			append_dev(div1, button2);
			append_dev(div9, t7);
			append_dev(div9, div8);
			append_dev(div8, div4);
			append_dev(div4, div3);
			append_dev(div3, t8);
			append_dev(div8, t9);
			append_dev(div8, div5);
			append_dev(div8, t10);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, t11);
			append_dev(div9, t12);
			if_block1.m(div9, null);
			append_dev(main, t13);
			mount_component(dialog, main, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[23], false, false, false),
					listen_dev(button0, "keyup", /*keyup_handler*/ ctx[24], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[25], false, false, false),
					listen_dev(button1, "keyup", /*keyup_handler_1*/ ctx[26], false, false, false),
					listen_dev(button2, "click", /*click_handler_2*/ ctx[27], false, false, false),
					listen_dev(button2, "keyup", /*keyup_handler_2*/ ctx[28], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*editorState*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(center, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if (!current || dirty[0] & /*listheading1*/ 8) set_data_dev(t8, /*listheading1*/ ctx[3]);
			if (!current || dirty[0] & /*listheading2*/ 16) set_data_dev(t11, /*listheading2*/ ctx[4]);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div9, null);
				}
			}

			if (!current || dirty[0] & /*containerID*/ 512) {
				attr_dev(div9, "id", /*containerID*/ ctx[9]);
			}

			if (!current || dirty[0] & /*multimatch*/ 32) {
				attr_dev(div9, "multimatch", /*multimatch*/ ctx[5]);
			}

			if (!current || dirty[0] & /*totalCorrectAns*/ 256) {
				attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[8]);
			}

			const dialog_changes = {};

			if (dirty[0] & /*state*/ 1024 | dirty[1] & /*$$scope*/ 134217728) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty[0] & /*state*/ 1024) {
				updating_visible = true;
				dialog_changes.visible = /*state*/ ctx[10].dropDialog;
				add_flush_callback(() => updating_visible = false);
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block0) if_block0.d();
			destroy_component(itemhelper);
			if_block1.d();
			destroy_component(dialog);
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

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

// it removes the dplicate element in a array
function remove_duplicates_es6(arr) {
	arr = arr.filter(function (value, index, array) {
		return array.indexOf(value) == index;
	});

	return arr;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("MatchListPreview", slots, []);
	let { showAns } = $$props;
	let { cmed } = $$props;
	let { xml } = $$props;
	let { isReview } = $$props;
	let { uxml } = $$props;
	let { editorState } = $$props;
	let listheading1 = "";
	let listheading2 = "";
	let multimatch = "";
	let list1 = [];
	let list2 = [];
	let cdata = "";
	let isShuffeled = false;
	let totalCorrectAns = 0;

	let alphabet = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z"
	];

	let is_algo = false;
	let max_node = 0;
	let is_remediation = false;
	let match_lines = [];
	let errorCatchFlag = 1;
	let originalseq1 = "";
	let originalseq2 = "";
	ucMlid.sinfo = true;

	// let setList1Html;
	// let setList2Html;
	let btnflag = 1;

	let listenCall = 0;
	let containerID = cmed ? "matchmain" + cmed : "matchmain";
	let dragable;
	var top1 = 0;

	let state = {
		xml: "",
		remedStatus: "",
		dropDialog: "",
		isReview: false
	};

	// for displaying the answer
	function displayAns() {
		let ans = ucMlid.checkAns("#" + containerID);
		onUserAnsChange({ uXml: ans.u, ans: ans.ans });

		if (editorState) {
			showAns(ans.ans);
		}
	}

	function loadLibs() {
		let config = {
			preload: true,
			type: "stylesheet",
			as: "style"
		};

		//AH.createLink(window.itemFolder + 'clsSMMatchList/css/matchList.min.css', config);
		AH$1.createLink("https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css", config);
	}

	onMount(() => {
		loadLibs();

		dragable = new Draggable({
				onDragEnter: event => {
					AH$1.select(event.target, "addClass", "drop-hover");
				},
				onDragLeave: event => {
					AH$1.select(event.target, "removeClass", "drop-hover");
				},
				onDragEnd: event => {
					displayAns();

					AH$1.selectAll(".list2").forEach(function (data, _this) {
						AH$1.select(data, "removeClass", "drop-hover");
					});

					AH$1.selectAll(".list3").forEach(function (data, _this) {
						AH$1.select(data, "removeClass", "drop-hover");
					});

					console.log("onDragEnd");

					if (!ucMlid.is_valid_drop) {
						if (ucMlid.sinfo) {
							$$invalidate(2, ucMlid.sinfo = false, ucMlid);

							setTimeout(
								function () {
									$$invalidate(2, ucMlid.sinfo = true, ucMlid);
								},
								60 * 1000
							);

							// if (!UCINFO.isIphone) {
							if (typeof AH$1.alert == "function") AH$1.showmsg("While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.");

							console.log("checking box");

							if (ucMlid.chkDoNotShow(user_guid) != true) {
								$$invalidate(10, state.dropDialog = true, state);
							} // if (typeof(bindDialog) == 'function') 
							// bindDialog({ click: this, wd: 450, ht: 236, data: '<div title="How to drop?"><img src="' + jQuery(mlid).attr('path') + 'match_drop_000BOG.gif" /><br/><span><label><input type="checkbox" style="top:2px;" class="relative donotshowdialog"> Do not show this dialog again</label></span></div>' });
						} //}
					} // return true;
				}
			});

		// AH.listen(document,'mouseup','.shuffleList1',function(){
		// 	console.log('shuffleList1');
		// 	setTimeout(function(){
		// 		displayAns();
		// 	},200)
		// }) // Replaced
		// AH.listen(document,'mouseup','.shuffleList2',function(){
		// 	console.log('shuffleList2');
		// 	setTimeout(function(){
		// 		displayAns();
		// 	},200)
		// })
		AI.listen("#matchmain ", "click", ".matchlist-delete", function (e) {
			setTimeout(
				function () {
					displayAns();
				},
				200
			);
		});

		AH$1.listen(document, "click", "#set-review", function () {
			setReview();
		});

		// binding up the unsetreview function 
		// jQuery("#unset-review").on('click',function(){
		// 	unsetReview();
		// });// Will Replaced
		AH$1.listen(document, "click", "#unset-review", function () {
			unsetReview();
		});

		setTimeout(
			(function () {
				//jQuery("#"+containerID+" img").on('load', function() {
				let imgContainerId = AH$1.select("#" + containerID + " img");

				AH$1.listen(document, "load", imgContainerId, () => {
					// if review mode is on
					if (isReview) {
						// if multimatch is normal or swap list
						if (multimatch == 1 || multimatch == 0) {
							AH$1.select("#" + containerID + " #sm_controller", "addClass", "h");
							AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
						} else {
							AH$1.select("#" + containerID + " #sm_controller_default", "addClass", "h");
							AH$1.select("#" + containerID + " #sm_controller", "removeClass", "h");
						}

						unsetReview();
						setReview();
					} else {
						setReview();
						unsetReview();
					}
				});
			}).bind(this),
			500
		);

		setTimeout(
			function () {
				listen();
			},
			1500
		);
	});

	// function for binding keyup using hotkeys function which is defined in prepengine-footer.js
	function listen() {
		if (listenCall > 3) return false;

		if (typeof hotkeys == "function") {
			setTimeout(
				function () {
					console.log("hotkey function is ", typeof hotkeys == "function");
					ucMlid.bindKeyup();
				},
				1000
			);
		} else {
			console.log("Hotkey try = ", listenCall);
			listenCall++;
			listen();
		}
	}

	// function calls when remediation mode is on it basically display the ans
	function setReview() {
		$$invalidate(0, isReview = true);
		is_remediation = true;

		// check the answer
		displayAns();

		//jQuery("#shuffleArea").hide();
		if (document.querySelector("#shuffleAre") != null) document.querySelector("#shuffleAre").style.display = "none"; //WIll Replaced

		// for showing the answer
		ucMlid.modeOn("on");

		// if mode is normal mode or swap list
		if (multimatch == 1 || multimatch == 0) {
			AH$1.find("#" + containerID, "#sm_controller").classList.add("h");
			AH$1.find("#" + containerID, "#sm_controller").style.display = "none";
			AH$1.find("#" + containerID, "#sm_controller_default").style.display = "inline-block";

			var timer = setTimeout(
				function () {
					//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
					AH$1.find("#" + containerID, "#sm_controller_default .both-ans").click();

					clearTimeout(timer);
				},
				50
			);
		} else {
			// if drag & drop
			AH$1.select("#" + containerID + " " + "#sm_controller_default").classList.add("h");

			AH$1.find("#" + containerID, "#sm_controller_default").style.display = "none";
			AH$1.selectAll("#" + containerID + " " + "#sm_controller").style.display = "inline-block";

			//containerId.querySelector('#ssm_controller').style.display = "inline-block";
			var timer_next = setTimeout(
				function () {
					//jQuery("#"+containerID).find('#sm_controller_default .your-ans').click();
					AI.find("#" + containerID, "#sm_controller_default .your-ans").click();

					clearTimeout(timer_next);
				},
				200
			);
		}
	}

	// function calls when remediation mode is off after on.
	function unsetReview() {
		$$invalidate(0, isReview = false);

		//jQuery('.review_2, .review_default').addClass('h');
		AH$1.addClass(".review_2, .review_default", "h");

		//jQuery('.review_2, .review_default').hide();
		let removeclass = document.querySelectorAll(".review_2, .review_default");

		for (let i = 0; i < removeclass.length; i++) {
			removeclass[i].style.display = "none";
		}

		// review_default2.style.display = "none";
		is_remediation = false;

		// if shuffled
		if (isShuffeled == true) {
			AH$1.select("#shuffleArea", "css", { display: "none" });
		} else {
			AH$1.select("#shuffleArea", "css", { display: "block" });
		}

		// set the user ans in the module 
		ucMlid.modeOn();
	}

	beforeUpdate(() => {
		// checking for the change in the new xml
		if (state.xml != xml) {
			$$invalidate(10, state.xml = xml, state);

			if (cmed) {
				$$invalidate(9, containerID = "matchmain" + cmed);
				$$invalidate(2, ucMlid.ajax_eId = "#matchmain" + cmed, ucMlid);
			}

			$$invalidate(32, isShuffeled = false);
			AH$1.select("#shuffleArea", "css", { display: "block" });

			// convert the xml into the json
			var newXml = XMLToJSON(xml);

			// parse the xml for the preview mode
			parseXMLPreview(newXml);

			//forceUpdate();  Only react uses
			runModule();
		} /*For Shuffling */ /*if(!window.QXML) {
	var err  = smVal.validate(this.props.content_type, this.props.subtype , this.props.content_icon);
	this.props.smValidate(err);
}*/
	});

	// calls whenever xml is updated and update the module accordingly
	function runModule() {
		try {
			showModule();
		} catch(e) {
			if (errorCatchFlag <= 100) {
				var timer = setTimeout(
					function () {
						runModule();
						clearTimeout(timer);
					},
					50
				);
			} else {
				console.log("runModule14:Error");
				console.log(e);
			}

			errorCatchFlag++;
		}
	}

	// it basically parse the user answer and calls only one time in test area 
	function parseUserAnswer() {
		let matchUa = XMLToJSON(uxml);

		if (uxml && matchUa.smans && matchUa.smans.matchlist && matchUa.smans.matchlist._userans) {
			let matchUa = XMLToJSON(uxml);
			let listseq1 = matchUa.smans.matchlist._list1seq.split(",");
			let listseq2 = matchUa.smans.matchlist._list2seq.split(",");

			originalseq1 = matchUa.smans.matchlist._originalseq1
			? matchUa.smans.matchlist._originalseq1.split(",")
			: "";

			originalseq2 = matchUa.smans.matchlist._originalseq2
			? matchUa.smans.matchlist._originalseq2.split(",")
			: "";

			/* Preserve List Sequence1*/
			let newArr = [];

			for (let i of listseq1) {
				for (let j in list1) {
					if (list1[j]["id"] == i) {
						newArr.push(list1[j]);
					}
				}
			}

			$$invalidate(6, list1 = newArr);

			/*****/
			/* Preserve List Sequence2*/
			let newArr2 = [];

			for (let i of listseq2) {
				for (let j in list2) {
					if (list2[j]["id"] == i) {
						newArr2.push(list2[j]);
					}
				}
			}

			$$invalidate(7, list2 = newArr2);

			/*****/
			if (matchUa.smans.matchlist._userans) {
				const userAns = matchUa.smans.matchlist._userans.split(",");

				for (let k in userAns) {
					for (let m in list1) {
						let uans = userAns[k].split(/\[|\]/g)[1];
						uans = uans.split("|");

						for (let n in uans) {
							if (list1[m]["id"] == uans[n]) {
								$$invalidate(6, list1[m]["userans"] += userAns[k].split(/\[|\]/g)[0] + ",", list1);
							}
						}
					}
				}
			}
		} else {
			// shuffle list 1
			shuffleArray(list1); // self.forceUpdate(); it works only in react

			// shuffle list 2
			shuffleArray(list2);

			// remove the user ans
			ucMlid.removeUserAns();
		} //forceUpdate();

		ucMlid.showUserAns("#" + containerID);
		ucMlid.remove_lines("#" + containerID);

		// set the user ans in the module 
		ucMlid.modeOn();
	}

	// it is called whenever xml is updated 
	function showModule() {
		// for checking user ans
		if (!uxml) {
			// remove the user ans if there is no user ans
			ucMlid.removeUserAns();
		}

		// adding draggable and drop events
		ucMlid.showUserAns("#" + containerID);

		ucMlid.remove_lines("#" + containerID);
		ucMlid.modeOn();

		if (!editorState) {
			// if it is open in test area parse the user answer
			console.log("parseUserAnswer");

			parseUserAnswer();
		}

		// checking for the reviewMode
		if (isReview) {
			//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
			AH$1.find("#" + containerID, "#sm_controller_default .both-ans").click();

			var timer = setTimeout(
				function () {
					is_remediation = true;
					displayAns();
					AH$1.select("#shuffleArea", "css", { display: "none" });
					ucMlid.modeOn("on");

					if (multimatch == 1 || multimatch == 0) {
						AH$1.select("#" + containerID + " #sm_controller", "addClass", "h");
						AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
					} else {
						AH$1.select("#" + containerID + " #sm_controller_default", "addClass", "h");
						AH$1.select("#" + containerID + " #sm_controller", "removeClass", "h");
					}

					clearTimeout(timer);
				},
				100
			);
		} else {
			//jQuery('.review_2, .review_default').addClass('h');
			let review = document.querySelectorAll(".review_2, .review_default");

			for (let i = 0; i < review.length; i++) {
				review[i].classList.add("h");
			}
		}
	}

	// it is called whenever xml is updated  and parse the xml for preview
	function parseXMLPreview(QXML) {
		try {
			$$invalidate(6, list1 = []);
			$$invalidate(7, list2 = []);

			// fetching value from the xml
			$$invalidate(3, listheading1 = QXML.smxml.matchlist._listheading1);

			$$invalidate(4, listheading2 = QXML.smxml.matchlist._listheading2);
			$$invalidate(5, multimatch = QXML.smxml.matchlist._multimatch);
			cdata = QXML.smxml.matchlist.__cdata;

			// if is_algo is in xml, if is_algo is equal to true then set its value true otherwise set the valur to false
			if (QXML.smxml.matchlist._is_algo) {
				is_algo = QXML.smxml.matchlist._is_algo == "true" ? true : false;
			} else {
				is_algo = false;
			}

			// checking for the max_node (max no of node)
			if (QXML.smxml.matchlist._max_node) {
				var num = Number(QXML.smxml.matchlist._max_node);
				max_node = num > 0 ? num : 0;
			} else {
				max_node = 0;
			}

			// splitting the cdata with the new line
			cdata = cdata.split("\n");

			var count = 0;
			var countList1 = 1;
			var multipleValue = false;
			var multipleValueList2 = false;
			var tempAns = "";

			// traversing through the cdata
			cdata.forEach(function (data, i) {
				if (cdata[i].trim() != "") {
					$$invalidate(8, totalCorrectAns++, totalCorrectAns);
					var correctAns = "";

					// finding the text which start with [ and end with ]
					if (cdata[i].match(/\[(.*?)\]/g)) {
						// storing the value in ans then removing the brackets and spliting it with | symbol
						var ans = cdata[i].match(/\[(.*?)\]/g)[0];

						ans = ans.replace("[", "").replace("]", "");
						ans = ans.split("|");
					}

					// traversing through list 2 
					list2.forEach(function (data, l) {
						if (list2[l].value == cdata[i].replace(cdata[i].match(/\[(.*?)\]/g), "").trim()) {
							tempAns = list2[l].id;
							multipleValueList2 = true;
						}
					});

					if (multipleValueList2 != true) {
						list2.push({
							id: alphabet[count],
							correctans: "",
							value: cdata[i].replace(cdata[i].match(/\[(.*?)\]/g), "").trim()
						});

						correctAns = list2[count].id;
					} else {
						correctAns = tempAns;
					}

					// traversing through list one
					list1.forEach(function (data1, k) {
						if (list1[k].value == ans) {
							// value will never true as here string is comparing with array
							multipleValue = true;

							if (multipleValueList2 != true) {
								$$invalidate(6, list1[k].correctans = list1[k].correctans + "," + list2[count].id, list1);
							} else {
								$$invalidate(6, list1[k].correctans = list1[k].correctans + "," + tempAns, list1);
							}
						}
					});

					if (multipleValue != true) {
						ans.forEach(function (data, i) {
							list1.push({
								id: countList1,
								correctans: correctAns,
								userans: "",
								value: ans[i]
							});

							countList1++;
						});
					}

					multipleValue = false;
					multipleValueList2 == false ? count++ : "";
					multipleValueList2 = false;
				}
			});

			// for the max node
			if (max_node > 0 && max_node <= list1.length) {
				//  shuffling the list
				$$invalidate(6, list1 = shuffleArray(list1));

				var temparr = [];

				for (var i = 0; i < max_node; i++) {
					temparr.push(list1[i]);
				}

				$$invalidate(6, list1 = temparr);
				temparr = [];
				temparr.length = 0;
				var f = 0;

				for (var i = 0; i < list1.length; i++) {
					var correctarr = list1[i].correctans.split(",");

					for (var j = 0; j < correctarr.length; j++) {
						for (var k = 0; k < list2.length; k++) {
							f = 0;

							if (correctarr[j] == list2[k].id) {
								if (temparr.length <= 0) {
									temparr.push(list2[k]);
								} else {
									for (var l = 0; l < temparr.length; l++) {
										if (correctarr[j] == temparr[l].id) {
											f = 1;
											break;
										}
									}

									if (f != 1) {
										temparr.push(list2[k]);
									}
								}
							}
						}
					}
				}

				$$invalidate(7, list2 = temparr);
			}
		} catch(error) {
			console.log({
				error,
				fun: "ParseXMLPreview",
				file: "MatchlistPreview.js"
			});
		}
	}

	// shuffle the option
	function shuffleItems() {
		console.log("Shuffled");
		$$invalidate(32, isShuffeled = true);
		ucMlid.removeUserAns();
		ucMlid.showUserAns("#" + containerID);
		ucMlid.remove_lines("#" + containerID);
		ucMlid.modeOn();
		$$invalidate(6, list1 = shuffleArray(list1));
		$$invalidate(7, list2 = shuffleArray(list2));
		AH$1.select("#shuffleArea", "css", { display: "none" });
	}

	let setList1;
	let setList2;

	// function randomChoice (arr) {
	// 	console.log("arr arr");
	// 	let randIndex = Math.floor(Math.random() * arr.length);
	// 	item.originalseq = randIndex; // change
	// 	return arr[randIndex];
	// }
	function setList1Html(item, count) {
		function randomChoice(arr) {
			console.log("arr arr");
			let randIndex = Math.floor(Math.random() * arr.length);
			item.originalseq = randIndex; // change
			return arr[randIndex];
		}

		if (is_algo == true && is_remediation != true) {
			if (originalseq1) {
				var seq = originalseq1[i];
				item.originalseq = seq; // change
				item.value = item.value.split("%%")[seq];
			} else {
				item.value = randomChoice(item.value.split("%%"));
			}
		}

		let img_src = item.value.substr(1).split("##")[0].split("%%")[0]; // For alt implementating with ##

		let img_alt = item.value.substr(1).split("##")[1]
		? item.value.substr(1).split("##")[1]
		: "";

		setList1 = `<span class="serial">${count + 1}.</span>` + (item.value.charAt(0) == "*"
		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
		: is_algo == true ? item.value : item.value);

		return setList1;
	}

	function setList2Html(item, count) {
		function randomChoice(arr) {
			var randIndex = Math.floor(Math.random() * arr.length);

			//data.originalseq = randIndex;
			item.originalseq = randIndex;

			return arr[randIndex];
		}

		if (is_algo == true && is_remediation != true) {
			if (originalseq2) {
				var seq = originalseq2[i];
				data.originalseq = seq;
				item.value = item.value.split("%%")[seq];
			} else {
				item.value = randomChoice(item.value.split("%%"));
			}
		}

		let img_src = item.value.substr(1).split("##")[0].split("%%")[0]; // For alt implementating with ##

		let img_alt = item.value.substr(1).split("##")[1]
		? item.value.substr(1).split("##")[1]
		: "";

		setList2 = `<span class="serial">${count}.</span>` + (item.value.charAt(0) == "*"
		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
		: is_algo == true ? item.value : item.value);

		return setList2;
	}

	function handleReview(mode) {
		if (mode == "c") {
			ucMlid.showAllCorrectAns("#" + containerID);
		} else {
			ucMlid.showAllAns("#" + containerID);
		}
	}

	AH$1.listen(document, "click", ".clr", _this => {
		AH$1.selectAll(".clr", "removeClass", "btn-primary");
		AH$1.selectAll(".clr", "addClass", "btn-light");
		AH$1.select(_this, "removeClass", "btn-light");
		AH$1.select(_this, "addClass", "btn-primary");
	});

	const writable_props = ["showAns", "cmed", "xml", "isReview", "uxml", "editorState"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<MatchListPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => ucMlid.showCorrect("#" + containerID);

	const keyup_handler = e => {
		if (e.keyCode == 13) ucMlid.showCorrect("#" + containerID);
	};

	const click_handler_1 = () => ucMlid.showAll("#" + containerID);

	const keyup_handler_1 = e => {
		if (e.keyCode == 13) ucMlid.showAll("#" + containerID);
	};

	const click_handler_2 = () => ucMlid.showYour("#" + containerID);

	const keyup_handler_2 = e => {
		if (e.keyCode == 13) ucMlid.showYour("#" + containerID);
	};

	const click_handler_3 = () => {
		$$invalidate(10, state.dropDialog = false, state);
	};

	function dialog_visible_binding(value) {
		state.dropDialog = value;
		$$invalidate(10, state);
	}

	$$self.$$set = $$props => {
		if ("showAns" in $$props) $$invalidate(19, showAns = $$props.showAns);
		if ("cmed" in $$props) $$invalidate(20, cmed = $$props.cmed);
		if ("xml" in $$props) $$invalidate(21, xml = $$props.xml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("uxml" in $$props) $$invalidate(22, uxml = $$props.uxml);
		if ("editorState" in $$props) $$invalidate(1, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		ucMlid,
		Draggable,
		l: Lang,
		beforeUpdate,
		onMount,
		ItemHelper,
		AH: AH$1,
		XMLToJSON,
		onUserAnsChange,
		Button,
		Dialog,
		showAns,
		cmed,
		xml,
		isReview,
		uxml,
		editorState,
		listheading1,
		listheading2,
		multimatch,
		list1,
		list2,
		cdata,
		isShuffeled,
		totalCorrectAns,
		alphabet,
		is_algo,
		max_node,
		is_remediation,
		match_lines,
		errorCatchFlag,
		originalseq1,
		originalseq2,
		btnflag,
		listenCall,
		containerID,
		dragable,
		top1,
		state,
		displayAns,
		loadLibs,
		listen,
		setReview,
		unsetReview,
		runModule,
		parseUserAnswer,
		showModule,
		parseXMLPreview,
		shuffleArray,
		shuffleItems,
		remove_duplicates_es6,
		setList1,
		setList2,
		setList1Html,
		setList2Html,
		handleReview
	});

	$$self.$inject_state = $$props => {
		if ("showAns" in $$props) $$invalidate(19, showAns = $$props.showAns);
		if ("cmed" in $$props) $$invalidate(20, cmed = $$props.cmed);
		if ("xml" in $$props) $$invalidate(21, xml = $$props.xml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("uxml" in $$props) $$invalidate(22, uxml = $$props.uxml);
		if ("editorState" in $$props) $$invalidate(1, editorState = $$props.editorState);
		if ("listheading1" in $$props) $$invalidate(3, listheading1 = $$props.listheading1);
		if ("listheading2" in $$props) $$invalidate(4, listheading2 = $$props.listheading2);
		if ("multimatch" in $$props) $$invalidate(5, multimatch = $$props.multimatch);
		if ("list1" in $$props) $$invalidate(6, list1 = $$props.list1);
		if ("list2" in $$props) $$invalidate(7, list2 = $$props.list2);
		if ("cdata" in $$props) cdata = $$props.cdata;
		if ("isShuffeled" in $$props) $$invalidate(32, isShuffeled = $$props.isShuffeled);
		if ("totalCorrectAns" in $$props) $$invalidate(8, totalCorrectAns = $$props.totalCorrectAns);
		if ("alphabet" in $$props) $$invalidate(11, alphabet = $$props.alphabet);
		if ("is_algo" in $$props) is_algo = $$props.is_algo;
		if ("max_node" in $$props) max_node = $$props.max_node;
		if ("is_remediation" in $$props) is_remediation = $$props.is_remediation;
		if ("match_lines" in $$props) match_lines = $$props.match_lines;
		if ("errorCatchFlag" in $$props) errorCatchFlag = $$props.errorCatchFlag;
		if ("originalseq1" in $$props) originalseq1 = $$props.originalseq1;
		if ("originalseq2" in $$props) originalseq2 = $$props.originalseq2;
		if ("btnflag" in $$props) $$invalidate(12, btnflag = $$props.btnflag);
		if ("listenCall" in $$props) listenCall = $$props.listenCall;
		if ("containerID" in $$props) $$invalidate(9, containerID = $$props.containerID);
		if ("dragable" in $$props) dragable = $$props.dragable;
		if ("top1" in $$props) top1 = $$props.top1;
		if ("state" in $$props) $$invalidate(10, state = $$props.state);
		if ("setList1" in $$props) setList1 = $$props.setList1;
		if ("setList2" in $$props) setList2 = $$props.setList2;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview, ucMlid, multimatch, containerID*/ 549 | $$self.$$.dirty[1] & /*isShuffeled*/ 2) {
			 {
				if (isReview == true) {
					console.log("review mode");

					// for displaying the ans
					displayAns();

					AH$1.select("#shuffleArea", "hide");
					ucMlid.modeOn("on");

					// if mode is normal or swap list
					if (multimatch == 1 || multimatch == 0) {
						AH$1.select(".both-ans").click();

						//AH.find("#"+containerID , "#sm_controller", {action: "addClass", actionData: "h"});
						AH$1.select("#" + containerID + " #sm_controller", "addClass", "h");

						//AH.find("#"+containerID, "#sm_controller_default", {action: 'removeClass', actionData: 'h'});
						AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");

						//AH.find("#"+containerID, "#sm_controller_default", "css", {display:'inline-block'});
						AH$1.select("#" + containerID + " #sm_controller_default", "css", { display: "inline-block" });
					} else {
						// if mode is drag & drop
						//jQuery("#"+containerID).find("#sm_controller_default").addClass("h");
						AH$1.select("#" + containerID + " " + "#sm_controller_default", "addClass", "h");

						//jQuery("#"+containerID).find("#sm_controller").removeClass("h");
						AH$1.select("#" + containerID + " " + "#sm_controller", "removeClass", "h");

						setTimeout(
							function () {
								document.getElementsByClassName("your-ans")[0].click();
							},
							500
						);
					}
				} else {
					// if remdiation mode is off
					$$invalidate(0, isReview = false);

					//jQuery("#"+containerID).find("#sm_controller_default").css("display", "none");
					AH$1.select("#" + containerID + " " + "#sm_controller_default", "css", { display: "none" });

					if (isShuffeled == true) {
						AH$1.select("#shuffleArea", "css", { display: "none" });
					} else {
						AH$1.select("#shuffleArea", "css", { display: "block" });
					}

					// set the user ans in the module 
					ucMlid.modeOn();
				}
			}
		}
	};

	return [
		isReview,
		editorState,
		ucMlid,
		listheading1,
		listheading2,
		multimatch,
		list1,
		list2,
		totalCorrectAns,
		containerID,
		state,
		alphabet,
		btnflag,
		setReview,
		unsetReview,
		shuffleItems,
		setList1Html,
		setList2Html,
		handleReview,
		showAns,
		cmed,
		xml,
		uxml,
		click_handler,
		keyup_handler,
		click_handler_1,
		keyup_handler_1,
		click_handler_2,
		keyup_handler_2,
		click_handler_3,
		dialog_visible_binding
	];
}

class MatchListPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-bi3u6x-style")) add_css();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				showAns: 19,
				cmed: 20,
				xml: 21,
				isReview: 0,
				uxml: 22,
				editorState: 1
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MatchListPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*showAns*/ ctx[19] === undefined && !("showAns" in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'showAns'");
		}

		if (/*cmed*/ ctx[20] === undefined && !("cmed" in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'cmed'");
		}

		if (/*xml*/ ctx[21] === undefined && !("xml" in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'xml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'isReview'");
		}

		if (/*uxml*/ ctx[22] === undefined && !("uxml" in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'uxml'");
		}

		if (/*editorState*/ ctx[1] === undefined && !("editorState" in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'editorState'");
		}
	}

	get showAns() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get cmed() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set cmed(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default MatchListPreview;
//# sourceMappingURL=MatchListPreview-6f2537c6.js.map
