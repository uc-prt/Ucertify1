
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, T as Draggable, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, O as Dialog, P as binding_callbacks, Q as bind, v as validate_slots, o as onMount, A as AH$1, L as beforeUpdate, X as XMLToJSON, a5 as Lang, _ as onUserAnsChange, U as Button, j as attr_dev, l as set_style, k as add_location, n as insert_dev, q as listen_dev, B as noop, x as detach_dev, f as space, c as create_component, h as text, m as mount_component, F as set_data_dev, W as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, C as validate_each_argument, K as destroy_each, a2 as HtmlTag } from './main-f818ac0f.js';
import { I as ItemHelper } from './ItemHelper-4702ce1b.js';
import { h as hotkeys$1 } from './hotkeys.esm-a0ffe003.js';

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

/* clsSMMatchList/MatchListPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMMatchList/MatchListPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-bi3u6x-style";
	style.textContent = ".u-sr-only.svelte-bi3u6x{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:500px){.shuffle.svelte-bi3u6x{text-align:center}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0Y2hMaXN0UHJldmlldy5zdmVsdGUiLCJzb3VyY2VzIjpbIk1hdGNoTGlzdFByZXZpZXcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIlxuPCEtLSBcbiogIEZpbGUgTmFtZSAgIDogTWF0Y2hMaXN0UHJldmlldy5zdmVsdGVcbiogIERlc2NyaXB0aW9uIDogRHJhZyB0aGUgb3B0aW9uXG4qICBBdXRob3IgICAgICA6IFN1bmRhcmFtIFRyaXBhdGhpXG4qICBWZXJzaW9uICAgICA6IDEuMFxuKiAgUGFja2FnZSAgICAgOiBwZS1pdGVtc1xuKiAgTGFzdCB1cGRhdGUgOiAgLS0+XG48c2NyaXB0PlxuXG5cdFxuXHRpbXBvcnQgdWNNbGlkIGZyb20gJy4vbWF0Y2hsaXN0SlNTdHJpbmcnO1xuXHRpbXBvcnQge0RyYWdnYWJsZX0gZnJvbSBcImphdnNjcmlwdF9oZWxwZXIvSlVJLmpzXCI7XG5cdC8vaW1wb3J0IHNtVmFsIGZyb20gJy4uL2xpYi9WYWxpZGF0ZUl0ZW1zJztcblx0aW1wb3J0IGwgZnJvbSAnLi4vc3JjL2xpYnMvTGFuZyc7XHRcblx0aW1wb3J0IHsgYmVmb3JlVXBkYXRlLCBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IEl0ZW1IZWxwZXIgZnJvbSAnLi4vaGVscGVyL0l0ZW1IZWxwZXIuc3ZlbHRlJztcblx0aW1wb3J0IHtBSCxYTUxUb0pTT04sb25Vc2VyQW5zQ2hhbmdlfSBmcm9tIFwiLi4vaGVscGVyL0hlbHBlckFJLnN2ZWx0ZVwiO1xuXHRpbXBvcnQgJy4vY3NzL21hdGNoTGlzdC5taW4uY3NzJztcblx0aW1wb3J0IHsgQnV0dG9uLCBEaWFsb2cgfSBmcm9tICdzdmVsdGUtbXVpL3NyYyc7XG5cdFxuXHRleHBvcnQgbGV0IHNob3dBbnM7XG5cdGV4cG9ydCBsZXQgY21lZDtcblx0ZXhwb3J0IGxldCB4bWw7XG5cdGV4cG9ydCBsZXQgaXNSZXZpZXc7XG5cdGV4cG9ydCBsZXQgdXhtbDtcblx0ZXhwb3J0IGxldCBlZGl0b3JTdGF0ZTtcblxuXHRsZXQgbGlzdGhlYWRpbmcxID0gXCJcIjtcblx0bGV0IGxpc3RoZWFkaW5nMiA9IFwiXCI7XG5cdGxldCBtdWx0aW1hdGNoID0gXCJcIjtcdFxuXHRsZXQgbGlzdDEgPSBbXTtcblx0bGV0IGxpc3QyID0gW107XG5cdGxldCBjZGF0YSA9IFwiXCI7XG5cdGxldCBpc1NodWZmZWxlZCA9IGZhbHNlO1xuXHRsZXQgdG90YWxDb3JyZWN0QW5zID0gMDtcblx0bGV0IGFscGhhYmV0ID0gW1wiQVwiLFwiQlwiLFwiQ1wiLFwiRFwiLFwiRVwiLFwiRlwiLFwiR1wiLFwiSFwiLFwiSVwiLFwiSlwiLFwiS1wiLFwiTFwiLFwiTVwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiUVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiXTtcblx0bGV0IGlzX2FsZ28gPSBmYWxzZTtcblx0bGV0IG1heF9ub2RlID0gMDtcblx0bGV0IGlzX3JlbWVkaWF0aW9uID0gZmFsc2U7XG5cdGxldCBtYXRjaF9saW5lcyA9IFtdO1xuXHRsZXQgZXJyb3JDYXRjaEZsYWcgPSAxO1xuXHRsZXQgb3JpZ2luYWxzZXExID0gXCJcIjtcblx0bGV0IG9yaWdpbmFsc2VxMiA9IFwiXCI7XG5cdHVjTWxpZC5zaW5mbyA9IHRydWU7XG5cdC8vIGxldCBzZXRMaXN0MUh0bWw7XG5cdC8vIGxldCBzZXRMaXN0Mkh0bWw7XG5cdGxldCBidG5mbGFnID0gMTtcblx0bGV0IGxpc3RlbkNhbGwgPSAwO1xuXHRsZXQgY29udGFpbmVySUQgPSAoY21lZCkgPyBcIm1hdGNobWFpblwiICsgY21lZCA6IFwibWF0Y2htYWluXCI7XG5cdGxldCBkcmFnYWJsZTtcblx0dmFyIHRvcDEgPSAwO1xuXG5cdGxldCBzdGF0ZSA9IHtcblx0XHR4bWw6ICcnLFxuXHRcdHJlbWVkU3RhdHVzOicnLFxuXHRcdGRyb3BEaWFsb2c6JycsXG5cdFx0aXNSZXZpZXc6IGZhbHNlLFxuXHR9XG5cblx0JDoge1xuXHRpZiAoaXNSZXZpZXcgPT0gdHJ1ZSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3JldmlldyBtb2RlJyk7XG5cdFx0XHQvLyBmb3IgZGlzcGxheWluZyB0aGUgYW5zXG5cdFx0XHRkaXNwbGF5QW5zKCk7XG5cdFx0XHRBSC5zZWxlY3QoXCIjc2h1ZmZsZUFyZWFcIiwgXCJoaWRlXCIgKTtcblx0XHRcdHVjTWxpZC5tb2RlT24oXCJvblwiKTtcblx0XHRcdC8vIGlmIG1vZGUgaXMgbm9ybWFsIG9yIHN3YXAgbGlzdFxuXHRcdFx0aWYgKG11bHRpbWF0Y2ggPT0gMSB8fCBtdWx0aW1hdGNoID09IDApIHtcblx0XHRcdFx0QUguc2VsZWN0KFwiLmJvdGgtYW5zXCIpLmNsaWNrKCk7XG5cdFx0XHRcdC8vQUguZmluZChcIiNcIitjb250YWluZXJJRCAsIFwiI3NtX2NvbnRyb2xsZXJcIiwge2FjdGlvbjogXCJhZGRDbGFzc1wiLCBhY3Rpb25EYXRhOiBcImhcIn0pO1xuXHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQgK1wiICNzbV9jb250cm9sbGVyXCIsJ2FkZENsYXNzJywnaCcpO1xuXHRcdFx0XHQvL0FILmZpbmQoXCIjXCIrY29udGFpbmVySUQsIFwiI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLCB7YWN0aW9uOiAncmVtb3ZlQ2xhc3MnLCBhY3Rpb25EYXRhOiAnaCd9KTtcblx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEICsnICNzbV9jb250cm9sbGVyX2RlZmF1bHQnLCdyZW1vdmVDbGFzcycsJ2gnKVxuXHRcdFx0XHQvL0FILmZpbmQoXCIjXCIrY29udGFpbmVySUQsIFwiI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLCBcImNzc1wiLCB7ZGlzcGxheTonaW5saW5lLWJsb2NrJ30pO1xuXHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrIFwiICNzbV9jb250cm9sbGVyX2RlZmF1bHRcIixcImNzc1wiLHtkaXNwbGF5OlwiaW5saW5lLWJsb2NrXCJ9KVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaWYgbW9kZSBpcyBkcmFnICYgZHJvcFxuXHRcdFx0XHRcblx0XHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIpLmFkZENsYXNzKFwiaFwiKTtcblx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiIFwiK1wiI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLFwiYWRkQ2xhc3NcIixcImhcIik7XG5cblx0XHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoXCIjc21fY29udHJvbGxlclwiKS5yZW1vdmVDbGFzcyhcImhcIik7XG5cdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCArIFwiIFwiICsgXCIjc21fY29udHJvbGxlclwiLFwicmVtb3ZlQ2xhc3NcIixcImhcIik7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwieW91ci1hbnNcIilbMF0uY2xpY2soKTtcblx0XHRcdFx0fSw1MDApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpZiByZW1kaWF0aW9uIG1vZGUgaXMgb2ZmXG5cdFx0XHRpc1JldmlldyA9IGZhbHNlO1xuXHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiIFwiK1wiI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLFwiY3NzXCIse2Rpc3BsYXk6J25vbmUnfSk7XG5cdFx0XHRcblx0XHRcdGlmKGlzU2h1ZmZlbGVkID09IHRydWUpIHtcblx0XHRcdFx0QUguc2VsZWN0KFwiI3NodWZmbGVBcmVhXCIsXCJjc3NcIix7ZGlzcGxheTonbm9uZSd9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdEFILnNlbGVjdChcIiNzaHVmZmxlQXJlYVwiLFwiY3NzXCIse2Rpc3BsYXk6XCJibG9ja1wifSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBzZXQgdGhlIHVzZXIgYW5zIGluIHRoZSBtb2R1bGUgXG5cdFx0XHR1Y01saWQubW9kZU9uKCk7XG5cdFx0fVxuXHR9XG5cdC8vIGZvciBkaXNwbGF5aW5nIHRoZSBhbnN3ZXJcblx0ZnVuY3Rpb24gZGlzcGxheUFucygpIHtcblx0XHRsZXQgYW5zID0gdWNNbGlkLmNoZWNrQW5zKFwiI1wiK2NvbnRhaW5lcklEKTtcblxuXHRcdG9uVXNlckFuc0NoYW5nZSh7dVhtbDphbnMudSxhbnM6YW5zLmFuc30pO1xuXG5cdFx0aWYoZWRpdG9yU3RhdGUpIHtcblx0XHRcdHNob3dBbnMoYW5zLmFucyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbG9hZExpYnMoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxuICAgICAgICAgICAgdHlwZTogJ3N0eWxlc2hlZXQnLFxuICAgICAgICAgICAgYXM6ICdzdHlsZSdcbiAgICAgICAgfVxuICAgICAgICAvL0FILmNyZWF0ZUxpbmsod2luZG93Lml0ZW1Gb2xkZXIgKyAnY2xzU01NYXRjaExpc3QvY3NzL21hdGNoTGlzdC5taW4uY3NzJywgY29uZmlnKTtcblx0XHRBSC5jcmVhdGVMaW5rKFwiaHR0cHM6Ly91bnBrZy5jb20vbW9uby1pY29uc0AxLjAuNS9pY29uZm9udC9pY29ucy5jc3NcIiwgY29uZmlnKTtcbiAgICB9XG5cdFxuXHRvbk1vdW50KCgpPT4ge1xuXHRcdGxvYWRMaWJzKCk7XG5cdFx0XG5cdFx0ZHJhZ2FibGUgPSBuZXcgRHJhZ2dhYmxlKHtcblx0XHRcdG9uRHJhZ0VuZDooZXZlbnQpPT57XG5cdFx0XHRcdGRpc3BsYXlBbnMoKTtcblxuXHRcdFx0Y29uc29sZS5sb2coJ29uRHJhZ0VuZCcpO1xuICAgICAgICAgICAgaWYgKCF1Y01saWQuaXNfdmFsaWRfZHJvcCkge1xuICAgICAgICAgICAgICAgIGlmICh1Y01saWQuc2luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgdWNNbGlkLnNpbmZvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1Y01saWQuc2luZm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LCA2MCAqIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIVVDSU5GTy5pc0lwaG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZihBSC5hbGVydCkgPT0gJ2Z1bmN0aW9uJykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQUguc2hvd21zZygnV2hpbGUgZHJvcHBpbmcgYSBjb21wb25lbnQsIGtlZXAgeW91ciBtb3VzZSBwb2ludGVyIG9uIHRoZSBkcm9wIGFyZWEuIERyb3AgYXJlYSBtdXN0IGJlIGNvbXBhdGlibGUgd2l0aCB0aGUgY29tcG9uZW50IHlvdSBhcmUgZHJvcHBpbmcuJyk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdjaGVja2luZyBib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVjTWxpZC5jaGtEb05vdFNob3codXNlcl9ndWlkKSAhPSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdHN0YXRlLmRyb3BEaWFsb2cgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICh0eXBlb2YoYmluZERpYWxvZykgPT0gJ2Z1bmN0aW9uJykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJpbmREaWFsb2coeyBjbGljazogdGhpcywgd2Q6IDQ1MCwgaHQ6IDIzNiwgZGF0YTogJzxkaXYgdGl0bGU9XCJIb3cgdG8gZHJvcD9cIj48aW1nIHNyYz1cIicgKyBqUXVlcnkobWxpZCkuYXR0cigncGF0aCcpICsgJ21hdGNoX2Ryb3BfMDAwQk9HLmdpZlwiIC8+PGJyLz48c3Bhbj48bGFiZWw+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHN0eWxlPVwidG9wOjJweDtcIiBjbGFzcz1cInJlbGF0aXZlIGRvbm90c2hvd2RpYWxvZ1wiPiBEbyBub3Qgc2hvdyB0aGlzIGRpYWxvZyBhZ2FpbjwvbGFiZWw+PC9zcGFuPjwvZGl2PicgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXHR9XG5cdFx0fSlcblx0XHRcblx0XHQvLyBBSC5saXN0ZW4oZG9jdW1lbnQsJ21vdXNldXAnLCcuc2h1ZmZsZUxpc3QxJyxmdW5jdGlvbigpe1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ3NodWZmbGVMaXN0MScpO1xuXHRcdC8vIFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdC8vIFx0XHRkaXNwbGF5QW5zKCk7XG5cdFx0Ly8gXHR9LDIwMClcblx0XHQvLyB9KSAvLyBSZXBsYWNlZFxuXG5cdFx0Ly8gQUgubGlzdGVuKGRvY3VtZW50LCdtb3VzZXVwJywnLnNodWZmbGVMaXN0MicsZnVuY3Rpb24oKXtcblx0XHQvLyBcdGNvbnNvbGUubG9nKCdzaHVmZmxlTGlzdDInKTtcblx0XHQvLyBcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHQvLyBcdFx0ZGlzcGxheUFucygpO1xuXHRcdC8vIFx0fSwyMDApXG5cdFx0Ly8gfSlcblxuXG5cdFx0QUgubGlzdGVuKGRvY3VtZW50LCdjbGljaycsJyNzZXQtcmV2aWV3JyxmdW5jdGlvbigpe1xuXHRcdFx0c2V0UmV2aWV3KCk7XG5cdFx0fSkgXG5cdFx0XG5cblx0XHQvLyBiaW5kaW5nIHVwIHRoZSB1bnNldHJldmlldyBmdW5jdGlvbiBcblx0XHQvLyBqUXVlcnkoXCIjdW5zZXQtcmV2aWV3XCIpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcblx0XHQvLyBcdHVuc2V0UmV2aWV3KCk7XG5cdFx0Ly8gfSk7Ly8gV2lsbCBSZXBsYWNlZFxuXG5cdFx0QUgubGlzdGVuKGRvY3VtZW50LCdjbGljaycsJyN1bnNldC1yZXZpZXcnLGZ1bmN0aW9uKCkge1xuXHRcdFx0dW5zZXRSZXZpZXcoKTtcblx0XHR9KSBcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXG5cdFx0XHQvL2pRdWVyeShcIiNcIitjb250YWluZXJJRCtcIiBpbWdcIikub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdGxldCBpbWdDb250YWluZXJJZCA9IEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiBpbWdcIik7XG5cdFx0XHRBSC5saXN0ZW4oZG9jdW1lbnQsJ2xvYWQnLGltZ0NvbnRhaW5lcklkLCAoKT0+IHtcblx0XHRcdFx0Ly8gaWYgcmV2aWV3IG1vZGUgaXMgb25cblx0XHRcdFx0aWYgKGlzUmV2aWV3KSB7XG5cdFx0XHRcdFx0Ly8gaWYgbXVsdGltYXRjaCBpcyBub3JtYWwgb3Igc3dhcCBsaXN0XG5cdFx0XHRcdFx0aWYgKG11bHRpbWF0Y2ggPT0gMSB8fCBtdWx0aW1hdGNoID09IDApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgI3NtX2NvbnRyb2xsZXJcIiwnYWRkQ2xhc3MnLCdoJyk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiICNzbV9jb250cm9sbGVyX2RlZmF1bHRcIixcInJlbW92ZUNsYXNzXCIsXCJoXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiAjc21fY29udHJvbGxlcl9kZWZhdWx0XCIsJ2FkZENsYXNzJywnaCcpO1xuXHRcdFx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiICNzbV9jb250cm9sbGVyXCIsJ3JlbW92ZUNsYXNzJywnaCcpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVuc2V0UmV2aWV3KCk7XG5cdFx0XHRcdFx0c2V0UmV2aWV3KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2V0UmV2aWV3KCk7XG5cdFx0XHRcdFx0dW5zZXRSZXZpZXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpLDUwMCk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0bGlzdGVuKCk7XG5cdFx0fSwxNTAwKTtcblx0fSlcblxuXHQvLyBmdW5jdGlvbiBmb3IgYmluZGluZyBrZXl1cCB1c2luZyBob3RrZXlzIGZ1bmN0aW9uIHdoaWNoIGlzIGRlZmluZWQgaW4gcHJlcGVuZ2luZS1mb290ZXIuanNcblx0ZnVuY3Rpb24gbGlzdGVuKCl7XG5cdFx0aWYobGlzdGVuQ2FsbCA+IDMpIHJldHVybiBmYWxzZTtcblx0XHRpZih0eXBlb2YgaG90a2V5cyA9PSBcImZ1bmN0aW9uXCIpe1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcImhvdGtleSBmdW5jdGlvbiBpcyBcIix0eXBlb2YgaG90a2V5cyA9PSBcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdHVjTWxpZC5iaW5kS2V5dXAoKTtcblx0XHRcdH0sMTAwMCk7XG5cdFx0fSBlbHNle1xuXHRcdFx0Y29uc29sZS5sb2coXCJIb3RrZXkgdHJ5ID0gXCIsbGlzdGVuQ2FsbCk7XG5cdFx0XHRsaXN0ZW5DYWxsKys7XG5cdFx0XHRsaXN0ZW4oKTtcblx0XHR9XG5cdH1cblxuXHQvLyBmdW5jdGlvbiBjYWxscyB3aGVuIHJlbWVkaWF0aW9uIG1vZGUgaXMgb24gaXQgYmFzaWNhbGx5IGRpc3BsYXkgdGhlIGFuc1xuXHRmdW5jdGlvbiBzZXRSZXZpZXcoKSB7XG5cdFx0aXNSZXZpZXcgPSB0cnVlO1xuXHRcdGlzX3JlbWVkaWF0aW9uID0gdHJ1ZTtcblx0XHQvLyBjaGVjayB0aGUgYW5zd2VyXG5cdFx0ZGlzcGxheUFucygpO1xuXHRcdC8valF1ZXJ5KFwiI3NodWZmbGVBcmVhXCIpLmhpZGUoKTtcblx0XHRpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2h1ZmZsZUFyZScpIT1udWxsKVxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaHVmZmxlQXJlJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyAvL1dJbGwgUmVwbGFjZWRcblx0XHQvLyBmb3Igc2hvd2luZyB0aGUgYW5zd2VyXG5cdFx0dWNNbGlkLm1vZGVPbihcIm9uXCIpO1xuXHRcdC8vIGlmIG1vZGUgaXMgbm9ybWFsIG1vZGUgb3Igc3dhcCBsaXN0XG5cdFx0aWYobXVsdGltYXRjaCA9PSAxIHx8IG11bHRpbWF0Y2ggPT0gMCkge1xuXHRcdFx0XG5cdFx0XHRBSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELFwiI3NtX2NvbnRyb2xsZXJcIikuY2xhc3NMaXN0LmFkZChcImhcIik7XG5cdFx0XHRcblx0XHRcdEFILmZpbmQoXCIjXCIrY29udGFpbmVySUQsXCIjc21fY29udHJvbGxlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcblx0XHRcdEFILmZpbmQoXCIjXCIrY29udGFpbmVySUQsXCIjc21fY29udHJvbGxlcl9kZWZhdWx0XCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuXHRcdFx0XG5cdFx0XHR2YXIgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL2pRdWVyeShcIiNcIitjb250YWluZXJJRCkuZmluZCgnI3NtX2NvbnRyb2xsZXJfZGVmYXVsdCAuYm90aC1hbnMnKS5jbGljaygpO1xuXHRcdFx0XHRBSC5maW5kKFwiI1wiK2NvbnRhaW5lcklELCcjc21fY29udHJvbGxlcl9kZWZhdWx0IC5ib3RoLWFucycpLmNsaWNrKCk7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XHRcdFx0XHRcblx0XHRcdH0sIDUwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gaWYgZHJhZyAmIGRyb3Bcblx0XHRcdFxuXHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEK1wiIFwiK1wiI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiKS5jbGFzc0xpc3QuYWRkKFwiaFwiKTtcblx0XHRcdFxuXHRcdFx0QUguZmluZChcIiNcIitjb250YWluZXJJRCxcIiNzbV9jb250cm9sbGVyX2RlZmF1bHRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XG5cdFx0XHRBSC5zZWxlY3RBbGwoXCIjXCIrY29udGFpbmVySUQrXCIgXCIrXCIjc21fY29udHJvbGxlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcblx0XHRcdC8vY29udGFpbmVySWQucXVlcnlTZWxlY3RvcignI3NzbV9jb250cm9sbGVyJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG5cblx0XHRcdHZhciB0aW1lcl9uZXh0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly9qUXVlcnkoXCIjXCIrY29udGFpbmVySUQpLmZpbmQoJyNzbV9jb250cm9sbGVyX2RlZmF1bHQgLnlvdXItYW5zJykuY2xpY2soKTtcblx0XHRcdFx0QUkuZmluZChcIiNcIitjb250YWluZXJJRCwnI3NtX2NvbnRyb2xsZXJfZGVmYXVsdCAueW91ci1hbnMnKS5jbGljaygpO1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXJfbmV4dCk7XHRcdFx0XHRcblx0XHRcdH0sIDIwMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gZnVuY3Rpb24gY2FsbHMgd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9mZiBhZnRlciBvbi5cblx0ZnVuY3Rpb24gdW5zZXRSZXZpZXcoKSB7XG5cdFx0aXNSZXZpZXcgPSBmYWxzZTtcblx0XHQvL2pRdWVyeSgnLnJldmlld18yLCAucmV2aWV3X2RlZmF1bHQnKS5hZGRDbGFzcygnaCcpO1xuXHRcdEFILmFkZENsYXNzKCcucmV2aWV3XzIsIC5yZXZpZXdfZGVmYXVsdCcsJ2gnKTtcblxuXHRcdC8valF1ZXJ5KCcucmV2aWV3XzIsIC5yZXZpZXdfZGVmYXVsdCcpLmhpZGUoKTtcblx0XHRsZXQgcmVtb3ZlY2xhc3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmV2aWV3XzIsIC5yZXZpZXdfZGVmYXVsdCcpO1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCByZW1vdmVjbGFzcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cmVtb3ZlY2xhc3NbaV0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdH1cblx0XHQvLyByZXZpZXdfZGVmYXVsdDIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdGlzX3JlbWVkaWF0aW9uID0gZmFsc2U7XG5cdFx0Ly8gaWYgc2h1ZmZsZWRcblx0XHRpZihpc1NodWZmZWxlZCA9PSB0cnVlKSB7XG5cdFx0XHRBSC5zZWxlY3QoJyNzaHVmZmxlQXJlYScsJ2Nzcycse2Rpc3BsYXk6J25vbmUnfSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdEFILnNlbGVjdCgnI3NodWZmbGVBcmVhJywnY3NzJyx7ZGlzcGxheTonYmxvY2snfSk7XG5cdFx0fVxuXHRcdC8vIHNldCB0aGUgdXNlciBhbnMgaW4gdGhlIG1vZHVsZSBcblx0XHR1Y01saWQubW9kZU9uKCk7XG5cdH1cblxuXHRiZWZvcmVVcGRhdGUoKCk9Pntcblx0XHQvLyBjaGVja2luZyBmb3IgdGhlIGNoYW5nZSBpbiB0aGUgbmV3IHhtbFxuXHRcdGlmKHN0YXRlLnhtbCAhPSB4bWwpIHtcblx0XHRcdHN0YXRlLnhtbCA9IHhtbDtcblx0XHRcdGlmKGNtZWQpIHsgXG5cdFx0XHRcdGNvbnRhaW5lcklEID0gXCJtYXRjaG1haW5cIitjbWVkOyBcblx0XHRcdFx0dWNNbGlkLmFqYXhfZUlkID0gXCIjbWF0Y2htYWluXCIrY21lZDtcblx0XHRcdH1cblx0XHRcdGlzU2h1ZmZlbGVkID0gZmFsc2U7XG5cdFx0XHRBSC5zZWxlY3QoJyNzaHVmZmxlQXJlYScsJ2Nzcycse2Rpc3BsYXk6J2Jsb2NrJ30pO1xuXHRcdFx0Ly8gY29udmVydCB0aGUgeG1sIGludG8gdGhlIGpzb25cblx0XHRcdHZhciBuZXdYbWwgPSBYTUxUb0pTT04oeG1sKTtcblx0XHRcdC8vIHBhcnNlIHRoZSB4bWwgZm9yIHRoZSBwcmV2aWV3IG1vZGVcblx0XHRcdHBhcnNlWE1MUHJldmlldyhuZXdYbWwpO1xuXHRcdFx0Ly9mb3JjZVVwZGF0ZSgpOyAgT25seSByZWFjdCB1c2VzXG5cdFx0XHRydW5Nb2R1bGUoKTtcblx0XHRcdC8qRm9yIFNodWZmbGluZyAqL1xuXHRcdFx0LyppZighd2luZG93LlFYTUwpIHtcblx0XHRcdFx0dmFyIGVyciAgPSBzbVZhbC52YWxpZGF0ZSh0aGlzLnByb3BzLmNvbnRlbnRfdHlwZSwgdGhpcy5wcm9wcy5zdWJ0eXBlICwgdGhpcy5wcm9wcy5jb250ZW50X2ljb24pO1xuXHRcdFx0XHR0aGlzLnByb3BzLnNtVmFsaWRhdGUoZXJyKTtcblx0XHRcdH0qL1x0XHRcdFxuXHRcdH1cblx0fSlcblxuXHQvLyBjYWxscyB3aGVuZXZlciB4bWwgaXMgdXBkYXRlZCBhbmQgdXBkYXRlIHRoZSBtb2R1bGUgYWNjb3JkaW5nbHlcblx0ZnVuY3Rpb24gcnVuTW9kdWxlKCl7XG5cdFx0dHJ5e1xuXHRcdFx0c2hvd01vZHVsZSgpO1xuXHRcdH1jYXRjaChlKSB7XG5cdFx0XHRpZihlcnJvckNhdGNoRmxhZzw9MTAwKSB7XG5cdFx0XHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cnVuTW9kdWxlKCk7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0fSw1MCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcInJ1bk1vZHVsZTE0OkVycm9yXCIpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdH1cblx0XHRcdGVycm9yQ2F0Y2hGbGFnKys7XG5cdFx0fVxuXHR9XG5cblx0Ly8gaXQgYmFzaWNhbGx5IHBhcnNlIHRoZSB1c2VyIGFuc3dlciBhbmQgY2FsbHMgb25seSBvbmUgdGltZSBpbiB0ZXN0IGFyZWEgXG5cdGZ1bmN0aW9uIHBhcnNlVXNlckFuc3dlcigpIHtcblx0XHRsZXQgbWF0Y2hVYSA9IFhNTFRvSlNPTih1eG1sKTtcblx0XHRpZih1eG1sICYmIG1hdGNoVWEuc21hbnMgJiYgbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QgJiYgbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX3VzZXJhbnMpIHtcblx0XHRcdGxldCBtYXRjaFVhID0gWE1MVG9KU09OKHV4bWwpO1xuXHRcdFx0bGV0IGxpc3RzZXExID0gbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX2xpc3Qxc2VxLnNwbGl0KFwiLFwiKTtcblx0XHRcdGxldCBsaXN0c2VxMiA9IG1hdGNoVWEuc21hbnMubWF0Y2hsaXN0Ll9saXN0MnNlcS5zcGxpdChcIixcIik7XG5cdFx0XHRvcmlnaW5hbHNlcTEgPSAoKG1hdGNoVWEuc21hbnMubWF0Y2hsaXN0Ll9vcmlnaW5hbHNlcTEpPyBtYXRjaFVhLnNtYW5zLm1hdGNobGlzdC5fb3JpZ2luYWxzZXExLnNwbGl0KFwiLFwiKSA6IFwiXCIgKTtcblx0XHRcdG9yaWdpbmFsc2VxMiA9ICgobWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX29yaWdpbmFsc2VxMik/IG1hdGNoVWEuc21hbnMubWF0Y2hsaXN0Ll9vcmlnaW5hbHNlcTIuc3BsaXQoXCIsXCIpIDogXCJcIiApO1xuXHRcdFx0LyogUHJlc2VydmUgTGlzdCBTZXF1ZW5jZTEqL1xuXHRcdFx0bGV0IG5ld0FyciA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSBvZiBsaXN0c2VxMSkge1xuXHRcdFx0XHRmb3IgKCBsZXQgaiBpbiBsaXN0MSApICB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdDFbal1bJ2lkJ10gPT0gaSkge1xuXHRcdFx0XHRcdFx0bmV3QXJyLnB1c2gobGlzdDFbal0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bGlzdDEgPSBuZXdBcnI7XG5cdFx0XHQvKioqKiovXG5cdFx0XHQvKiBQcmVzZXJ2ZSBMaXN0IFNlcXVlbmNlMiovXG5cdFx0XHRsZXQgbmV3QXJyMiA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSBvZiBsaXN0c2VxMikge1xuXHRcdFx0XHRmb3IgKCBsZXQgaiBpbiBsaXN0MiApICB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdDJbal1bJ2lkJ10gPT0gaSkge1xuXHRcdFx0XHRcdFx0bmV3QXJyMi5wdXNoKGxpc3QyW2pdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpc3QyID0gbmV3QXJyMjtcblx0XHRcdC8qKioqKi9cdFxuXG5cdFx0XHRpZihtYXRjaFVhLnNtYW5zLm1hdGNobGlzdC5fdXNlcmFucykge1xuXHRcdFx0XHRjb25zdCB1c2VyQW5zID0gbWF0Y2hVYS5zbWFucy5tYXRjaGxpc3QuX3VzZXJhbnMuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRmb3IobGV0IGsgaW4gdXNlckFucykge1xuXHRcdFx0XHRcdGZvcihsZXQgbSBpbiBsaXN0MSkge1xuXHRcdFx0XHRcdFx0bGV0IHVhbnMgPSB1c2VyQW5zW2tdLnNwbGl0KC9cXFt8XFxdL2cpWzFdO1xuXHRcdFx0XHRcdFx0dWFucyA9IHVhbnMuc3BsaXQoXCJ8XCIpO1xuXHRcdFx0XHRcdFx0Zm9yKGxldCBuIGluIHVhbnMpIHtcblx0XHRcdFx0XHRcdFx0aWYobGlzdDFbbV1bJ2lkJ10gPT0gdWFuc1tuXSkge1xuXHRcdFx0XHRcdFx0XHRcdGxpc3QxW21dWyd1c2VyYW5zJ10gKz0gdXNlckFuc1trXS5zcGxpdCgvXFxbfFxcXS9nKVswXStcIixcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gc2VsZi5mb3JjZVVwZGF0ZSgpOyBpdCB3b3JrcyBvbmx5IGluIHJlYWN0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHNodWZmbGUgbGlzdCAxXG5cdFx0XHRzaHVmZmxlQXJyYXkobGlzdDEpO1xuXHRcdFx0Ly8gc2h1ZmZsZSBsaXN0IDJcblx0XHRcdHNodWZmbGVBcnJheShsaXN0Mik7XG5cdFx0XHQvLyByZW1vdmUgdGhlIHVzZXIgYW5zXG5cdFx0XHR1Y01saWQucmVtb3ZlVXNlckFucygpO1xuXHRcdFx0Ly9mb3JjZVVwZGF0ZSgpO1xuXHRcdH1cblx0XHR1Y01saWQuc2hvd1VzZXJBbnMoXCIjXCIrY29udGFpbmVySUQpO1xuXHRcdHVjTWxpZC5yZW1vdmVfbGluZXMoXCIjXCIrY29udGFpbmVySUQpO1xuXHRcdC8vIHNldCB0aGUgdXNlciBhbnMgaW4gdGhlIG1vZHVsZSBcblx0XHR1Y01saWQubW9kZU9uKCk7XG5cdH1cblxuXHQvLyBpdCBpcyBjYWxsZWQgd2hlbmV2ZXIgeG1sIGlzIHVwZGF0ZWQgXG5cdGZ1bmN0aW9uIHNob3dNb2R1bGUoKSB7XG5cdFx0Ly8gZm9yIGNoZWNraW5nIHVzZXIgYW5zXG5cdFx0aWYoIXV4bWwpIHtcblx0XHRcdC8vIHJlbW92ZSB0aGUgdXNlciBhbnMgaWYgdGhlcmUgaXMgbm8gdXNlciBhbnNcblx0XHRcdHVjTWxpZC5yZW1vdmVVc2VyQW5zKCk7XG5cdFx0fVxuXHRcdC8vIGFkZGluZyBkcmFnZ2FibGUgYW5kIGRyb3AgZXZlbnRzXG5cdFx0dWNNbGlkLnNob3dVc2VyQW5zKFwiI1wiK2NvbnRhaW5lcklEKTtcblx0XHR1Y01saWQucmVtb3ZlX2xpbmVzKFwiI1wiK2NvbnRhaW5lcklEKTtcblx0XHR1Y01saWQubW9kZU9uKCk7XG5cdFx0aWYoIWVkaXRvclN0YXRlKSB7XG5cdFx0XHQvLyBpZiBpdCBpcyBvcGVuIGluIHRlc3QgYXJlYSBwYXJzZSB0aGUgdXNlciBhbnN3ZXJcblx0XHRcdGNvbnNvbGUubG9nKCdwYXJzZVVzZXJBbnN3ZXInKTtcblx0XHRcdHBhcnNlVXNlckFuc3dlcigpO1xuXHRcdH1cblxuXHRcdC8vIGNoZWNraW5nIGZvciB0aGUgcmV2aWV3TW9kZVxuXHRcdGlmKGlzUmV2aWV3KSB7XG5cdFx0XHQvL2pRdWVyeShcIiNcIitjb250YWluZXJJRCkuZmluZCgnI3NtX2NvbnRyb2xsZXJfZGVmYXVsdCAuYm90aC1hbnMnKS5jbGljaygpO1xuXHRcdFx0QUguZmluZChcIiNcIitjb250YWluZXJJRCwnI3NtX2NvbnRyb2xsZXJfZGVmYXVsdCAuYm90aC1hbnMnKS5jbGljaygpO1xuXHRcdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRpc19yZW1lZGlhdGlvbiA9IHRydWU7XG5cdFx0XHRcdGRpc3BsYXlBbnMoKTtcblx0XHRcdFx0QUguc2VsZWN0KFwiI3NodWZmbGVBcmVhXCIsJ2Nzcycse2Rpc3BsYXk6J25vbmUnfSk7XG5cdFx0XHRcdHVjTWxpZC5tb2RlT24oXCJvblwiKTtcblx0XHRcdFx0aWYobXVsdGltYXRjaCA9PSAxIHx8IG11bHRpbWF0Y2ggPT0gMCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdEFILnNlbGVjdChcIiNcIitjb250YWluZXJJRCtcIiAjc21fY29udHJvbGxlclwiLCdhZGRDbGFzcycsJ2gnKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLFwicmVtb3ZlQ2xhc3NcIixcImhcIik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0QUguc2VsZWN0KFwiI1wiK2NvbnRhaW5lcklEICsgXCIgI3NtX2NvbnRyb2xsZXJfZGVmYXVsdFwiLCdhZGRDbGFzcycsJ2gnKTtcblx0XHRcdFx0XHRBSC5zZWxlY3QoXCIjXCIrY29udGFpbmVySUQrXCIgI3NtX2NvbnRyb2xsZXJcIixcInJlbW92ZUNsYXNzXCIsXCJoXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHR9LDEwMCk7XG5cdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9qUXVlcnkoJy5yZXZpZXdfMiwgLnJldmlld19kZWZhdWx0JykuYWRkQ2xhc3MoJ2gnKTtcblx0XHRcdGxldCByZXZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJldmlld18yLCAucmV2aWV3X2RlZmF1bHRcIik7XG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgcmV2aWV3Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRyZXZpZXdbaV0uY2xhc3NMaXN0LmFkZChcImhcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gaXQgaXMgY2FsbGVkIHdoZW5ldmVyIHhtbCBpcyB1cGRhdGVkICBhbmQgcGFyc2UgdGhlIHhtbCBmb3IgcHJldmlld1xuXHRmdW5jdGlvbiBwYXJzZVhNTFByZXZpZXcoUVhNTCkge1xuXHRcdHRyeSB7XG5cdFx0XHRsaXN0MSA9IFtdO1xuXHRcdFx0bGlzdDIgPSBbXTtcblxuXHRcdFx0Ly8gZmV0Y2hpbmcgdmFsdWUgZnJvbSB0aGUgeG1sXG5cdFx0XHRsaXN0aGVhZGluZzEgPSBRWE1MLnNteG1sLm1hdGNobGlzdC5fbGlzdGhlYWRpbmcxO1xuXHRcdFx0bGlzdGhlYWRpbmcyID0gUVhNTC5zbXhtbC5tYXRjaGxpc3QuX2xpc3RoZWFkaW5nMjtcblx0XHRcdG11bHRpbWF0Y2ggPSBRWE1MLnNteG1sLm1hdGNobGlzdC5fbXVsdGltYXRjaDtcblx0XHRcdGNkYXRhID0gUVhNTC5zbXhtbC5tYXRjaGxpc3QuX19jZGF0YTtcblx0XHRcdC8vIGlmIGlzX2FsZ28gaXMgaW4geG1sLCBpZiBpc19hbGdvIGlzIGVxdWFsIHRvIHRydWUgdGhlbiBzZXQgaXRzIHZhbHVlIHRydWUgb3RoZXJ3aXNlIHNldCB0aGUgdmFsdXIgdG8gZmFsc2Vcblx0XHRcdGlmIChRWE1MLnNteG1sLm1hdGNobGlzdC5faXNfYWxnbykge1xuXHRcdFx0XHRpc19hbGdvID0gKFFYTUwuc214bWwubWF0Y2hsaXN0Ll9pc19hbGdvID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlzX2FsZ28gPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8vIGNoZWNraW5nIGZvciB0aGUgbWF4X25vZGUgKG1heCBubyBvZiBub2RlKVxuXHRcdFx0aWYgKFFYTUwuc214bWwubWF0Y2hsaXN0Ll9tYXhfbm9kZSkge1xuXHRcdFx0XHR2YXIgbnVtID0gTnVtYmVyKFFYTUwuc214bWwubWF0Y2hsaXN0Ll9tYXhfbm9kZSk7XG5cdFx0XHRcdG1heF9ub2RlID0gKCBudW0gPiAwID8gbnVtIDogMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWF4X25vZGUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBzcGxpdHRpbmcgdGhlIGNkYXRhIHdpdGggdGhlIG5ldyBsaW5lXG5cdFx0XHRjZGF0YSA9IGNkYXRhLnNwbGl0KFwiXFxuXCIpO1xuXHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdHZhciBjb3VudExpc3QxID0xO1xuXHRcdFx0dmFyIG11bHRpcGxlVmFsdWUgPSBmYWxzZTtcblx0XHRcdHZhciBtdWx0aXBsZVZhbHVlTGlzdDIgPSBmYWxzZTtcblx0XHRcdHZhciB0ZW1wQW5zID0gXCJcIjtcblxuXHRcdFx0Ly8gdHJhdmVyc2luZyB0aHJvdWdoIHRoZSBjZGF0YVxuXHRcdFx0XG5cdFx0XHRcdGNkYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YSxpKSB7XG5cdFx0XHRcdGlmKGNkYXRhW2ldLnRyaW0oKSAhPSBcIlwiKSB7XG5cdFx0XHRcdFx0dG90YWxDb3JyZWN0QW5zICsrO1xuXHRcdFx0XHRcdHZhciBjb3JyZWN0QW5zID0gXCJcIjtcblx0XHRcdFx0XHQvLyBmaW5kaW5nIHRoZSB0ZXh0IHdoaWNoIHN0YXJ0IHdpdGggWyBhbmQgZW5kIHdpdGggXVxuXHRcdFx0XHRcdGlmKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKSkge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmluZyB0aGUgdmFsdWUgaW4gYW5zIHRoZW4gcmVtb3ZpbmcgdGhlIGJyYWNrZXRzIGFuZCBzcGxpdGluZyBpdCB3aXRoIHwgc3ltYm9sXG5cdFx0XHRcdFx0XHR2YXIgYW5zID0gKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKVswXSk7XG5cdFx0XHRcdFx0XHRhbnMgPSBhbnMucmVwbGFjZShcIltcIixcIlwiKS5yZXBsYWNlKFwiXVwiLFwiXCIpO1xuXHRcdFx0XHRcdFx0YW5zID0gYW5zLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gdHJhdmVyc2luZyB0aHJvdWdoIGxpc3QgMiBcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRsaXN0Mi5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsbCl7XG5cdFx0XHRcdFx0XHRpZihsaXN0MltsXS52YWx1ZSA9PSBjZGF0YVtpXS5yZXBsYWNlKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKSxcIlwiKS50cmltKCkpIHtcblx0XHRcdFx0XHRcdFx0dGVtcEFucyA9IGxpc3QyW2xdLmlkO1xuXHRcdFx0XHRcdFx0XHRtdWx0aXBsZVZhbHVlTGlzdDIgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlmKG11bHRpcGxlVmFsdWVMaXN0MiAhPSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRsaXN0Mi5wdXNoKHtcblx0XHRcdFx0XHRcdFx0aWQ6YWxwaGFiZXRbY291bnRdLFxuXHRcdFx0XHRcdFx0XHRjb3JyZWN0YW5zOlwiXCIsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBjZGF0YVtpXS5yZXBsYWNlKGNkYXRhW2ldLm1hdGNoKC9cXFsoLio/KVxcXS9nKSxcIlwiKS50cmltKClcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y29ycmVjdEFucyA9IGxpc3QyW2NvdW50XS5pZDtcblx0XHRcdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdFx0XHRjb3JyZWN0QW5zID0gdGVtcEFucztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gdHJhdmVyc2luZyB0aHJvdWdoIGxpc3Qgb25lXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsaXN0MS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGExLGspe1xuXHRcdFx0XHRcdFx0aWYobGlzdDFba10udmFsdWUgPT0gYW5zKSB7IC8vIHZhbHVlIHdpbGwgbmV2ZXIgdHJ1ZSBhcyBoZXJlIHN0cmluZyBpcyBjb21wYXJpbmcgd2l0aCBhcnJheVxuXHRcdFx0XHRcdFx0XHRtdWx0aXBsZVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0aWYobXVsdGlwbGVWYWx1ZUxpc3QyICE9IHRydWUpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRsaXN0MVtrXS5jb3JyZWN0YW5zID0gbGlzdDFba10uY29ycmVjdGFucytcIixcIitsaXN0Mltjb3VudF0uaWQ7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bGlzdDFba10uY29ycmVjdGFucyA9IGxpc3QxW2tdLmNvcnJlY3RhbnMrXCIsXCIrdGVtcEFucztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlmKG11bHRpcGxlVmFsdWUgIT10cnVlKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGFucy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsaSl7XG5cdFx0XHRcdFx0XHRcdGxpc3QxLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdGlkOmNvdW50TGlzdDEsXG5cdFx0XHRcdFx0XHRcdFx0Y29ycmVjdGFuczpjb3JyZWN0QW5zLFxuXHRcdFx0XHRcdFx0XHRcdHVzZXJhbnM6XCJcIixcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogYW5zW2ldXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRjb3VudExpc3QxKys7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bXVsdGlwbGVWYWx1ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdCgobXVsdGlwbGVWYWx1ZUxpc3QyID09IGZhbHNlKT9jb3VudCsrOlwiXCIpO1xuXHRcdFx0XHRcdG11bHRpcGxlVmFsdWVMaXN0MiA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZm9yIHRoZSBtYXggbm9kZVxuXHRcdFx0aWYgKG1heF9ub2RlID4gMCAmJiBtYXhfbm9kZSA8PSBsaXN0MS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gIHNodWZmbGluZyB0aGUgbGlzdFxuXHRcdFx0XHRsaXN0MSA9IHNodWZmbGVBcnJheShsaXN0MSk7XG5cdFx0XHRcdHZhciB0ZW1wYXJyID0gW107XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF4X25vZGU7IGkrKykge1xuXHRcdFx0XHRcdHRlbXBhcnIucHVzaChsaXN0MVtpXSk7XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0MSA9IHRlbXBhcnI7XG5cdFx0XHRcdHRlbXBhcnIgPSBbXTtcblx0XHRcdFx0dGVtcGFyci5sZW5ndGggPSAwO1xuXHRcdFx0XHR2YXIgZiA9IDA7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdDEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgY29ycmVjdGFyciA9IGxpc3QxW2ldLmNvcnJlY3RhbnMuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgY29ycmVjdGFyci5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBsaXN0Mi5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRmID0gMDtcblx0XHRcdFx0XHRcdFx0aWYgKGNvcnJlY3RhcnJbal0gPT0gbGlzdDJba10uaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodGVtcGFyci5sZW5ndGggPD0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGVtcGFyci5wdXNoKGxpc3QyW2tdKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgbCA9IDA7IGwgPCB0ZW1wYXJyLmxlbmd0aDsgbCsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChjb3JyZWN0YXJyW2pdID09IHRlbXBhcnJbbF0uaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGYgIT0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ZW1wYXJyLnB1c2gobGlzdDJba10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QyID0gdGVtcGFycjtcblx0XHRcdH1cblx0ICAgIH0gY2F0Y2goZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUubG9nKHtlcnJvcixmdW46J1BhcnNlWE1MUHJldmlldycsZmlsZTonTWF0Y2hsaXN0UHJldmlldy5qcyd9KTtcblx0XHR9XG5cdH1cblxuXHQvLyBzaHVmZmxlIHRoZSBhcnJheVxuXHRmdW5jdGlvbiBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcblx0ICAgIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG5cdCAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblx0ICAgICAgICBsZXQgdGVtcCA9IGFycmF5W2ldO1xuXHQgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XG5cdCAgICAgICAgYXJyYXlbal0gPSB0ZW1wO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGFycmF5O1xuXHR9XG5cblx0Ly8gc2h1ZmZsZSB0aGUgb3B0aW9uXG5cdGZ1bmN0aW9uIHNodWZmbGVJdGVtcygpIHtcblx0XHRjb25zb2xlLmxvZyhcIlNodWZmbGVkXCIpO1xuXHRcdGlzU2h1ZmZlbGVkID0gdHJ1ZTtcblx0XHR1Y01saWQucmVtb3ZlVXNlckFucygpO1xuXHRcdHVjTWxpZC5zaG93VXNlckFucyhcIiNcIitjb250YWluZXJJRCk7XG5cdFx0dWNNbGlkLnJlbW92ZV9saW5lcyhcIiNcIitjb250YWluZXJJRCk7XG5cdFx0dWNNbGlkLm1vZGVPbigpO1xuXHRcdGxpc3QxID0gc2h1ZmZsZUFycmF5KGxpc3QxKTtcblx0XHRsaXN0MiA9IHNodWZmbGVBcnJheShsaXN0Mik7XG5cdFx0QUguc2VsZWN0KCcjc2h1ZmZsZUFyZWEnLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xuXHR9XG5cblx0Ly8gaXQgcmVtb3ZlcyB0aGUgZHBsaWNhdGUgZWxlbWVudCBpbiBhIGFycmF5XG5cdGZ1bmN0aW9uIHJlbW92ZV9kdXBsaWNhdGVzX2VzNihhcnIpIHtcblx0XHRhcnIgPSBhcnIuZmlsdGVyIChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkgeyBcblx0XHRcdHJldHVybiBhcnJheS5pbmRleE9mICh2YWx1ZSkgPT0gaW5kZXg7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGFycjtcblx0fVxuXG5cdGxldCBzZXRMaXN0MTtcblx0bGV0IHNldExpc3QyO1xuXG5cdC8vIGZ1bmN0aW9uIHJhbmRvbUNob2ljZSAoYXJyKSB7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJhcnIgYXJyXCIpO1xuXHQvLyBcdGxldCByYW5kSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKTtcblx0Ly8gXHRpdGVtLm9yaWdpbmFsc2VxID0gcmFuZEluZGV4OyAvLyBjaGFuZ2Vcblx0Ly8gXHRyZXR1cm4gYXJyW3JhbmRJbmRleF07XG5cdC8vIH1cblxuXHRmdW5jdGlvbiBzZXRMaXN0MUh0bWwoaXRlbSxjb3VudCkgeyBcblx0XHRmdW5jdGlvbiByYW5kb21DaG9pY2UgKGFycikge1xuXHRcdFx0Y29uc29sZS5sb2coXCJhcnIgYXJyXCIpO1xuXHRcdFx0bGV0IHJhbmRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpO1xuXHRcdFx0aXRlbS5vcmlnaW5hbHNlcSA9IHJhbmRJbmRleDsgLy8gY2hhbmdlXG5cdFx0XHRyZXR1cm4gYXJyW3JhbmRJbmRleF07XG5cdFx0fVx0XG5cdFx0aWYgKGlzX2FsZ28gPT0gdHJ1ZSAmJiBpc19yZW1lZGlhdGlvbiAhPSB0cnVlKSB7XG5cdFx0XHRpZihvcmlnaW5hbHNlcTEpIHtcblx0XHRcdFx0dmFyIHNlcSA9IG9yaWdpbmFsc2VxMVtpXTtcblx0XHRcdFx0aXRlbS5vcmlnaW5hbHNlcSA9IHNlcTsgLy8gY2hhbmdlXG5cdFx0XHRcdGl0ZW0udmFsdWUgPSBpdGVtLnZhbHVlLnNwbGl0KFwiJSVcIilbc2VxXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGl0ZW0udmFsdWUgPSByYW5kb21DaG9pY2UoaXRlbS52YWx1ZS5zcGxpdChcIiUlXCIpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IGltZ19zcmMgPSBpdGVtLnZhbHVlLnN1YnN0cigxKS5zcGxpdChcIiMjXCIpWzBdLnNwbGl0KCclJScpWzBdOyAvLyBGb3IgYWx0IGltcGxlbWVudGF0aW5nIHdpdGggIyNcblx0XHRsZXQgaW1nX2FsdCA9IChpdGVtLnZhbHVlLnN1YnN0cigxKS5zcGxpdChcIiMjXCIpWzFdKSA/IGl0ZW0udmFsdWUuc3Vic3RyKDEpLnNwbGl0KFwiIyNcIilbMV0gOiBcIlwiO1xuXHRcdHNldExpc3QxID0gYDxzcGFuIGNsYXNzPVwic2VyaWFsXCI+JHsoY291bnQrMSl9Ljwvc3Bhbj5gKygoaXRlbS52YWx1ZS5jaGFyQXQoMCkgPT0gXCIqXCIpID8gYDxpbWcgY2xhc3M9XCJwZS1ub25lXCIgc3JjPVwiLy9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljLyR7aW1nX3NyY31cIiBhbHQ9XCIke2ltZ19hbHR9XCIgLz5gIDogKGlzX2FsZ28gPT0gdHJ1ZSA/IGl0ZW0udmFsdWUgOiBpdGVtLnZhbHVlKSk7XG5cdFx0cmV0dXJuIHNldExpc3QxO1xuXG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNldExpc3QySHRtbChpdGVtLGNvdW50KSB7XG5cdFx0ZnVuY3Rpb24gcmFuZG9tQ2hvaWNlIChhcnIpIHtcblx0XHRcdHZhciByYW5kSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKTtcblx0XHRcdC8vZGF0YS5vcmlnaW5hbHNlcSA9IHJhbmRJbmRleDtcblx0XHRcdGl0ZW0ub3JpZ2luYWxzZXEgPSByYW5kSW5kZXg7XG5cdFx0XHRyZXR1cm4gYXJyW3JhbmRJbmRleF07XG5cdFx0fSBcblx0XHRpZiAoaXNfYWxnbyA9PSB0cnVlICYmIGlzX3JlbWVkaWF0aW9uICE9IHRydWUpIHtcblx0XHRcdGlmKG9yaWdpbmFsc2VxMikge1xuXHRcdFx0XHR2YXIgc2VxID0gb3JpZ2luYWxzZXEyW2ldO1xuXHRcdFx0XHRkYXRhLm9yaWdpbmFsc2VxID0gc2VxO1xuXHRcdFx0XHRpdGVtLnZhbHVlID0gaXRlbS52YWx1ZS5zcGxpdChcIiUlXCIpW3NlcV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpdGVtLnZhbHVlID0gcmFuZG9tQ2hvaWNlKGl0ZW0udmFsdWUuc3BsaXQoXCIlJVwiKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBpbWdfc3JjID0gaXRlbS52YWx1ZS5zdWJzdHIoMSkuc3BsaXQoXCIjI1wiKVswXS5zcGxpdCgnJSUnKVswXTsgLy8gRm9yIGFsdCBpbXBsZW1lbnRhdGluZyB3aXRoICMjXG5cdFx0bGV0IGltZ19hbHQgPSAoaXRlbS52YWx1ZS5zdWJzdHIoMSkuc3BsaXQoXCIjI1wiKVsxXSkgPyBpdGVtLnZhbHVlLnN1YnN0cigxKS5zcGxpdChcIiMjXCIpWzFdIDogXCJcIjtcblx0XHRzZXRMaXN0MiA9IGA8c3BhbiBjbGFzcz1cInNlcmlhbFwiPiR7Y291bnR9Ljwvc3Bhbj5gKygoaXRlbS52YWx1ZS5jaGFyQXQoMCkgPT0gXCIqXCIpID8gYDxpbWcgY2xhc3M9XCJwZS1ub25lXCIgc3JjPVwiLy9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljLyR7aW1nX3NyY31cIiBhbHQ9XCIke2ltZ19hbHR9XCIgLz5gIDogKGlzX2FsZ28gPT0gdHJ1ZSA/IGl0ZW0udmFsdWUgOiBpdGVtLnZhbHVlKSlcblx0XHRyZXR1cm4gc2V0TGlzdDI7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVSZXZpZXcobW9kZSkge1xuXHRcdGlmIChtb2RlID09ICdjJykge1xuXHRcdFx0dWNNbGlkLnNob3dBbGxDb3JyZWN0QW5zKCcjJytjb250YWluZXJJRCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVjTWxpZC5zaG93QWxsQW5zKCcjJytjb250YWluZXJJRCk7XG5cdFx0fVxuXHR9XG5cblx0QUgubGlzdGVuKGRvY3VtZW50LCdjbGljaycsJy5jbHInLChfdGhpcyk9Pntcblx0XHRBSC5zZWxlY3RBbGwoJy5jbHInLCdyZW1vdmVDbGFzcycsJ2J0bi1wcmltYXJ5Jyk7XG5cdFx0QUguc2VsZWN0QWxsKCcuY2xyJywnYWRkQ2xhc3MnLCdidG4tbGlnaHQnKTtcblx0XHRBSC5zZWxlY3QoX3RoaXMsJ3JlbW92ZUNsYXNzJywnYnRuLWxpZ2h0Jyk7XG5cdFx0QUguc2VsZWN0KF90aGlzLCdhZGRDbGFzcycsJ2J0bi1wcmltYXJ5Jyk7XG5cdH0pXG5cblxuXG48L3NjcmlwdD5cblxuPG1haW4+XG4gICAgPGRpdiBpZD1cInByZXZpZXdTZWN0aW9uXCIgY2xhc3M9XCJweC0yXCI+XG5cdFx0PGNlbnRlcj5cblx0XHRcdHsjaWYgZWRpdG9yU3RhdGV9XG5cdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0aWQ9XCJzaHVmZmxlQXJlYVwiIFxuXHRcdFx0XHRcdGNsYXNzPVwic2h1ZmZsZSB0ZXh0LWNlbnRlclwiIFxuXHRcdFx0XHRcdG9uOmNsaWNrPXtzaHVmZmxlSXRlbXN9IFxuXHRcdFx0XHRcdHN0eWxlPSdmb250LXNpemU6MTdweDtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5Om5vbmU7Y29sb3I6I2FhYTsnXG5cdFx0XHRcdD5cblx0XHRcdFx0XHR7bC5zaHVmZmxlfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdHsvaWZ9XG5cdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcblx0XHRcdFx0aWQ9e2NvbnRhaW5lcklEfSBcblx0XHRcdFx0cGF0aD1cIi8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy9cIiBcblx0XHRcdFx0bXVsdGltYXRjaD17bXVsdGltYXRjaH0gXG5cdFx0XHRcdHRvdGFsY29ycmVjdGFucz17dG90YWxDb3JyZWN0QW5zfVxuXHRcdFx0XHRzdHlsZT0nZm9udC1mYW1pbHk6Um9ib3RvLCBzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxZW07J1xuXHRcdFx0PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGNsZWFyZml4IHJldmlld18yIGhcIiBpZD1cInNtX2NvbnRyb2xsZXJcIj5cblx0XHRcdFx0XHQ8SXRlbUhlbHBlciBcblx0XHRcdFx0XHRcdG9uOnNldFJldmlldyA9IHtzZXRSZXZpZXd9IFxuXHRcdFx0XHRcdFx0b246dW5zZXRSZXZpZXcgPSB7dW5zZXRSZXZpZXd9IFxuXHRcdFx0XHRcdFx0aGFuZGxlUmV2aWV3Q2xpY2s9e2hhbmRsZVJldmlld31cblx0XHRcdFx0XHRcdHJldmlld01vZGU9e2lzUmV2aWV3fSBcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz17YnRuZmxhZyA9PSAwID8gXCJoXCI6XCJcIn0+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bi1ncm91cCBjbGVhcmZpeCByZXZpZXdfZGVmYXVsdCBoXCIgaWQ9XCJzbV9jb250cm9sbGVyX2RlZmF1bHRcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PXswfSBjbGFzcz1cImJ0biBidG4tbGlnaHQgY29ycmVjdC1hbnMgY2xyXCIgb246Y2xpY2s9eygpID0+IHVjTWxpZC5zaG93Q29ycmVjdCgnIycrY29udGFpbmVySUQpfSBvbjprZXl1cD17KGUpID0+IHtpZiAoZS5rZXlDb2RlID09IDEzKSB1Y01saWQuc2hvd0NvcnJlY3QoJyMnK2NvbnRhaW5lcklEKX19PkNvcnJlY3QgQW5zd2VyPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB0YWJpbmRleD17MH0gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYm90aC1hbnMgY2xyXCIgb246Y2xpY2s9eygpID0+IHVjTWxpZC5zaG93QWxsKCcjJytjb250YWluZXJJRCl9IG9uOmtleXVwPXsoZSkgPT4ge2lmIChlLmtleUNvZGUgPT0gMTMpIHVjTWxpZC5zaG93QWxsKCcjJytjb250YWluZXJJRCl9fT5Db21wYXJlPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB0YWJpbmRleD17MH0gY2xhc3M9XCJidG4gYnRuLWxpZ2h0IHlvdXItYW5zd2VyIGNsclwiIG9uOmNsaWNrPXsoKSA9PiB1Y01saWQuc2hvd1lvdXIoJyMnK2NvbnRhaW5lcklEKX0gb246a2V5dXA9eyhlKSA9PiB7aWYgKGUua2V5Q29kZSA9PSAxMykgdWNNbGlkLnNob3dZb3VyKCcjJytjb250YWluZXJJRCl9fT5Zb3VyIEFuc3dlcjwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdy1mbHVpZFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuNFwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRpbmdcIj57bGlzdGhlYWRpbmcxfTwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuM1wiPjwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuNFwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRpbmdcIj57bGlzdGhlYWRpbmcyfTwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XG5cdFx0XHRcdHsjaWYgKG11bHRpbWF0Y2ggPT0gMCB8fCBtdWx0aW1hdGNoID09IDEpfVxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93LWZsdWlkXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNwYW40IHNodWZmbGVMaXN0MVwiIGRyYWdhYmxlPVwiMVwiPlxuXHRcdFx0XHRcdFx0eyNlYWNoIGxpc3QxIGFzIGRhdGEsaX1cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0XHRcdFx0XHRrZXk9e2l9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH1cblx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwibGlzdDEgdWktZHJhZ2dhYmxlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtY29ycmVjdGFucz17ZGF0YS5jb3JyZWN0YW5zfVxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS11c2VyYW5zPXtkYXRhLnVzZXJhbnN9XG5cdFx0XHRcdFx0XHRcdFx0XHRzdHlsZT17J3Bvc2l0aW9uOnJlbGF0aXZlOyd9XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD17MH1cblx0XHRcdFx0XHRcdFx0XHRcdGRyYWdnYWJsZSA9IFwidHJ1ZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLW9yaWdpbmFsc2VxPXsoZGF0YS5vcmlnaW5hbHNlcSk/ZGF0YS5vcmlnaW5hbHNlcTpcIjBcIn1cblx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHR7QGh0bWwgc2V0TGlzdDFIdG1sKGRhdGEsaSl9XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0ey9lYWNofVxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuM1wiPjwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzcGFuNCBzaHVmZmxlTGlzdDJcIj5cblx0XHRcdFx0XHR7I2VhY2ggbGlzdDIgYXMgZGF0YSxpfVxuXHRcdFx0XHRcdFx0PGRpdiBcblx0XHRcdFx0XHRcdFx0a2V5PXtpfVxuXHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH0gXG5cdFx0XHRcdFx0XHRcdGNsYXNzPVwibGlzdDIgdWktZHJvcHBhYmxlXCIgXG5cdFx0XHRcdFx0XHRcdGRhdGEtY29ycmVjdGFucz1cIlwiIFxuXHRcdFx0XHRcdFx0XHRkYXRhLXVzZXJhbnM9XCJcIlxuXHRcdFx0XHRcdFx0XHRkcm9wem9uZSA9IFwiMVwiXG5cdFx0XHRcdFx0XHRcdHN0eWxlPXsncG9zaXRpb246cmVsYXRpdmU7J31cblx0XHRcdFx0XHRcdFx0dGFiaW5kZXg9ezB9XG5cdFx0XHRcdFx0XHRcdGRhdGEtb3JpZ2luYWxzZXE9eyhkYXRhLm9yaWdpbmFsc2VxKT9kYXRhLm9yaWdpbmFsc2VxOlwiMFwifVxuXHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHR7QGh0bWwgc2V0TGlzdDJIdG1sKGRhdGEsYWxwaGFiZXRbaV0pfVxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0ey9lYWNofVxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0ezplbHNlfVxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3ctZmx1aWQgc2h1ZmZsZUxpc3QxXCI+XG5cdFx0XHRcdFx0XHR7I2VhY2ggbGlzdDEgYXMgZGF0YSxpfVxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGtleT17aX0gY2xhc3M9XCJyb3ctZmx1aWRcIj5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInNwYW40XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJsaXN0MVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmluZGV4PXswfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvcnJlY3RhbnM9e2RhdGEuY29ycmVjdGFuc31cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS11c2VyYW5zPXtkYXRhLnVzZXJhbnN9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLW9yaWdpbmFsc2VxPXsoZGF0YS5vcmlnaW5hbHNlcSk/ZGF0YS5vcmlnaW5hbHNlcTpcIjBcIn1cblx0XHRcdFx0XHRcdFx0XHRcdD57QGh0bWwgc2V0TGlzdDFIdG1sKGRhdGEsaSl9PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwic3BhbjNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgaWQ9e2RhdGEuaWR9IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJzcGFuNFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZD17ZGF0YS5pZH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJsaXN0MyB1aS1kcm9wcGFibGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLWRyb3BlZD1cIlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtY29ycmVjdGFucz17ZGF0YS5jb3JyZWN0YW5zfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLXVzZXJhbnM9e2RhdGEudXNlcmFuc31cblx0XHRcdFx0XHRcdFx0XHRcdFx0bXJlbD17ZGF0YS5pZH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHJvcHpvbmUgPSBcIjFcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkcmFnZ2FibGUgPSBcInRydWVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD17MH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0YXJpYS1sYWJlbD17YERyb3BlZGB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtb3JpZ2luYWxzZXE9eyhkYXRhLm9yaWdpbmFsc2VxKT9kYXRhLm9yaWdpbmFsc2VxOlwiMFwifVxuXHRcdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRQbGFjZSBIZXJlXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0ey9lYWNofVxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdy1mbHVpZCBtYXRjaF9vcHRpb25zIHNodWZmbGVMaXN0MlwiPlxuXHRcdFx0XHRcdFx0XHR7I2VhY2ggbGlzdDIgYXMgZGF0YSxpfVxuXHRcdFx0XHRcdFx0XHRcdDxkaXZcblx0XHRcdFx0XHRcdFx0XHRcdGtleT17aX1cblx0XHRcdFx0XHRcdFx0XHRcdGlkPXtkYXRhLmlkfVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJsaXN0NCB1aS1kcmFnZ2FibGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS1jb3JyZWN0YW5zPVwiXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRyYWdhYmxlID0gXCIxXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRyYWdnYWJsZSA9IFwidHJ1ZVwiXG5cblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtdXNlcmFucz1cIlwiXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD17MH1cblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtb3JpZ2luYWxzZXE9eyhkYXRhLm9yaWdpbmFsc2VxKT9kYXRhLm9yaWdpbmFsc2VxOlwiMFwifVxuXHRcdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHRcdHtAaHRtbCBzZXRMaXN0Mkh0bWwoZGF0YSxhbHBoYWJldFtpXSl9XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdHsvZWFjaH1cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHR7L2lmfVxuXHRcdFx0PC9kaXY+XG5cdFx0PC9jZW50ZXI+XG5cdDwvZGl2PlxuXHQ8RGlhbG9nIFxuXHRcdGJpbmQ6dmlzaWJsZT17c3RhdGUuZHJvcERpYWxvZ30gXG5cdFx0c3R5bGU9eyd3aWR0aDo0NTBweDtoZWlnaHQ6MjU0cHg7J30gXG5cdD5cblx0XHRcdDxkaXYgc3R5bGU9XCJmb250LXdlaWdodDpib2xkO1wiIGNsYXNzPVwiY2xlYXJmaXhcIj5cblx0XHRcdFx0PGRpdiB0aXRsZT1cIkhvdyB0byBkcm9wP1wiIGNsYXNzPVwiZmxvYXQtc3RhcnRcIj5Ib3cgdG8gZHJvcD88L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImZsb2F0LWVuZFwiPlxuXHRcdFx0XHRcdDxCdXR0b24gc3R5bGU9eydwb3NpdGlvbjpyZWxhdGl2ZTtsZWZ0OjIxcHg7Ym90dG9tOjZweDsnfSBvbjpjbGljaz17KCk9PntzdGF0ZS5kcm9wRGlhbG9nID0gZmFsc2V9fT5cblx0XHRcdFx0XHRcdDxpIGNsYXNzPVwibWkgbWktY2xvc2VcIj48c3BhbiBjbGFzcz1cInUtc3Itb25seVwiPmNsb3NlPC9zcGFuPjwvaT5cblx0XHRcdFx0XHQ8L0J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3dcIj5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8aW1nIFxuXHRcdFx0XHRcdFx0YWx0PVwiZ2lmIGZpbGVcIiBcblx0XHRcdFx0XHRcdHNyYz17QUguc2VsZWN0KFwiI21hdGNobWFpblwiKS5nZXRBdHRyaWJ1dGUoJ3BhdGgnKSArIFwibWF0Y2hfZHJvcF8wMDBCT0cuZ2lmXCJ9IFxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PGJyLz5cblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm10LTJcIj5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT1cInRvcDoycHg7XCIgY2xhc3M9XCJyZWxhdGl2ZSBkb25vdHNob3dkaWFsb2dcIiBpZD1cImRyb3BJZFwiIC8+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwiZHJvcElkXCI+RG8gbm90IHNob3cgdGhpcyBkaWFsb2cgYWdhaW48L2xhYmVsPlxuXHRcdFx0XHRcdDwvc3Bhbj5cblxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdDwvRGlhbG9nPiBcbjwvbWFpbj5cblxuPHN0eWxlPlxuXHQudS1zci1vbmx5IHtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0bGVmdDogLTEwMDAwcHg7XG5cdFx0dG9wOiBhdXRvO1xuXHRcdHdpZHRoOjFweDtcblx0XHRoZWlnaHQ6MXB4O1xuXHRcdG92ZXJmbG93OmhpZGRlbjtcblx0fVxuXHRAbWVkaWEobWF4LXdpZHRoOjUwMHB4KSB7XG5cdFx0LnNodWZmbGUge1xuXHRcdFx0dGV4dC1hbGlnbjpjZW50ZXI7XG5cdFx0fVxuXHR9XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXcyQkMsVUFBVSxjQUFDLENBQUMsQUFDWCxRQUFRLENBQUUsUUFBUSxDQUNsQixJQUFJLENBQUUsUUFBUSxDQUNkLEdBQUcsQ0FBRSxJQUFJLENBQ1QsTUFBTSxHQUFHLENBQ1QsT0FBTyxHQUFHLENBQ1YsU0FBUyxNQUFNLEFBQ2hCLENBQUMsQUFDRCxNQUFNLFdBQVcsS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUN4QixRQUFRLGNBQUMsQ0FBQyxBQUNULFdBQVcsTUFBTSxBQUNsQixDQUFDLEFBQ0YsQ0FBQyJ9 */";
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

// (698:3) {#if editorState}
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
			add_location(div, file, 698, 4, 21000);
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
		source: "(698:3) {#if editorState}",
		ctx
	});

	return block;
}

// (780:4) {:else}
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
			add_location(div0, file, 816, 6, 24853);
			attr_dev(div1, "class", "row-fluid shuffleList1");
			add_location(div1, file, 780, 5, 23806);
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
		source: "(780:4) {:else}",
		ctx
	});

	return block;
}

// (741:4) {#if (multimatch == 0 || multimatch == 1)}
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
			add_location(div0, file, 742, 5, 22814);
			attr_dev(div1, "class", "span3");
			add_location(div1, file, 760, 5, 23316);
			attr_dev(div2, "class", "span4 shuffleList2");
			add_location(div2, file, 761, 5, 23347);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 741, 4, 22785);
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
		source: "(741:4) {#if (multimatch == 0 || multimatch == 1)}",
		ctx
	});

	return block;
}

// (782:6) {#each list1 as data,i}
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

			add_location(div0, file, 784, 9, 23950);
			attr_dev(span0, "class", "span4");
			add_location(span0, file, 783, 8, 23920);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[52].id);
			attr_dev(div1, "class", "arrow");
			add_location(div1, file, 795, 9, 24287);
			attr_dev(span1, "class", "span3");
			add_location(span1, file, 794, 8, 24257);
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

			add_location(div2, file, 798, 9, 24380);
			attr_dev(span2, "class", "span4");
			add_location(span2, file, 797, 8, 24350);
			attr_dev(div3, "key", div3_key_value = /*i*/ ctx[54]);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 782, 7, 23880);
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
		source: "(782:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (818:7) {#each list2 as data,i}
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

			add_location(div, file, 818, 8, 24943);
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
		source: "(818:7) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (744:6) {#each list1 as data,i}
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

			add_location(div, file, 744, 8, 22898);
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
		source: "(744:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (763:5) {#each list2 as data,i}
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

			add_location(div, file, 763, 6, 23415);
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
		source: "(763:5) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (847:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>
function create_default_slot_1(ctx) {
	let i_1;
	let span;

	const block = {
		c: function create() {
			i_1 = element("i");
			span = element("span");
			span.textContent = "close";
			attr_dev(span, "class", "u-sr-only svelte-bi3u6x");
			add_location(span, file, 847, 29, 25743);
			attr_dev(i_1, "class", "mi mi-close");
			add_location(i_1, file, 847, 6, 25720);
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
		source: "(847:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>",
		ctx
	});

	return block;
}

// (840:1) <Dialog    bind:visible={state.dropDialog}    style={'width:450px;height:254px;'}   >
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
			add_location(div0, file, 844, 4, 25515);
			attr_dev(div1, "class", "float-end");
			add_location(div1, file, 845, 4, 25584);
			set_style(div2, "font-weight", "bold");
			attr_dev(div2, "class", "clearfix");
			add_location(div2, file, 843, 3, 25462);
			attr_dev(img, "alt", "gif file");
			if (img.src !== (img_src_value = AH$1.select("#matchmain").getAttribute("path") + "match_drop_000BOG.gif")) attr_dev(img, "src", img_src_value);
			add_location(img, file, 854, 5, 25862);
			add_location(br, file, 858, 5, 25987);
			attr_dev(input, "type", "checkbox");
			set_style(input, "top", "2px");
			attr_dev(input, "class", "relative donotshowdialog");
			attr_dev(input, "id", "dropId");
			add_location(input, file, 860, 6, 26024);
			attr_dev(label, "for", "dropId");
			add_location(label, file, 861, 6, 26118);
			attr_dev(span, "class", "mt-2");
			add_location(span, file, 859, 5, 25998);
			attr_dev(div3, "class", "row");
			add_location(div3, file, 852, 4, 25833);
			add_location(div4, file, 851, 3, 25823);
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
		source: "(840:1) <Dialog    bind:visible={state.dropDialog}    style={'width:450px;height:254px;'}   >",
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
			add_location(div0, file, 715, 4, 21430);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "tabindex", button0_tabindex_value = 0);
			attr_dev(button0, "class", "btn btn-light correct-ans clr");
			add_location(button0, file, 725, 6, 21798);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "tabindex", button1_tabindex_value = 0);
			attr_dev(button1, "class", "btn btn-primary both-ans clr");
			add_location(button1, file, 726, 6, 22031);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "tabindex", button2_tabindex_value = 0);
			attr_dev(button2, "class", "btn btn-light your-answer clr");
			add_location(button2, file, 727, 6, 22248);
			attr_dev(div1, "class", "btn-group clearfix review_default h");
			attr_dev(div1, "id", "sm_controller_default");
			add_location(div1, file, 724, 5, 21715);
			attr_dev(div2, "class", div2_class_value = /*btnflag*/ ctx[12] == 0 ? "h" : "");
			add_location(div2, file, 723, 4, 21674);
			attr_dev(div3, "class", "heading");
			add_location(div3, file, 732, 6, 22548);
			attr_dev(div4, "class", "span4");
			add_location(div4, file, 731, 5, 22522);
			attr_dev(div5, "class", "span3");
			add_location(div5, file, 734, 5, 22607);
			attr_dev(div6, "class", "heading");
			add_location(div6, file, 736, 6, 22664);
			attr_dev(div7, "class", "span4");
			add_location(div7, file, 735, 5, 22638);
			attr_dev(div8, "class", "row-fluid");
			add_location(div8, file, 730, 4, 22493);
			attr_dev(div9, "id", /*containerID*/ ctx[9]);
			attr_dev(div9, "path", "//s3.amazonaws.com/jigyaasa_content_static/");
			attr_dev(div9, "multimatch", /*multimatch*/ ctx[5]);
			attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[8]);
			set_style(div9, "font-family", "Roboto, sans-serif");
			set_style(div9, "font-size", "1em");
			add_location(div9, file, 707, 3, 21207);
			add_location(center, file, 696, 2, 20966);
			attr_dev(div10, "id", "previewSection");
			attr_dev(div10, "class", "px-2");
			add_location(div10, file, 695, 4, 20925);
			add_location(main, file, 694, 0, 20914);
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
				onDragEnd: event => {
					displayAns();
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
//# sourceMappingURL=MatchListPreview-249c3019.js.map
