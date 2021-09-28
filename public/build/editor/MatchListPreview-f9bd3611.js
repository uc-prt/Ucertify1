
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, U as Draggable, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, M as append_styles, P as Dialog, Q as binding_callbacks, R as bind, v as validate_slots, o as onMount, A as AH$1, L as beforeUpdate, X as XMLToJSON, y as l, a3 as onUserAnsChange, V as Button, e as element, j as attr_dev, l as set_style, k as add_location, n as insert_dev, q as listen_dev, B as noop, x as detach_dev, f as space, c as create_component, h as text, p as append_dev, m as mount_component, F as set_data_dev, Z as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, C as validate_each_argument, K as destroy_each, a7 as HtmlTag, Y as src_url_equal } from './main-afb5bf14.js';
import { I as ItemHelper } from './ItemHelper-5a774397.js';
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

AH.listen('body','click','.donotshowdialo',(_this) => {
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
            str += '<path fill="none" d="M' + (parseInt(index[1])) + ',' + (parseInt(index[0]) - 5) + 'C' + (parseInt(index[1]) + 88) + ' ,' + (parseInt(index[0]) - 4) + ',' + (parseInt(index[1]) + 88) + ',' + (parseInt(value[0]) - 4) + ',' + (parseInt(value[1]) - 10) + ',' + (parseInt(value[0]) - 5) + '"  base="' + base + '" stroke-width = "2" stroke="' + clr + '"></path>';
            str += '<g transform="translate(' + (parseInt(value[1]) - 11) + ',' + (parseInt(value[0]) - 11) + ') rotate(0) scale(4) translate(0,0) scale(.3)" base="' + base + '"><g fill="' + clr + '" stroke="none" ><path d="M 0 0 L 10 5 L 0 10 z" /></g></g>';
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
        AH.select(_this,'css',{backgroundColor:'#fff'});
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
    // AH.find(ucMlid.ajax_eId,'#lines,.correct,.lines,.correct_incorrect_icon',{
    //     action:'remove'
    // })
    AH.remove(ucMlid.ajax_eId+' #lines,.correct,.lines,.correct_incorrect_icon');
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

/* clsSMMatchList\MatchListPreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMMatchList\\MatchListPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-bi3u6x", ".u-sr-only.svelte-bi3u6x{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:500px){.shuffle.svelte-bi3u6x{text-align:center}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0Y2hMaXN0UHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBcTRCQyxVQUFVLGNBQUMsQ0FBQyxBQUNYLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLElBQUksQ0FBRSxRQUFRLENBQ2QsR0FBRyxDQUFFLElBQUksQ0FDVCxNQUFNLEdBQUcsQ0FDVCxPQUFPLEdBQUcsQ0FDVixTQUFTLE1BQU0sQUFDaEIsQ0FBQyxBQUNELE1BQU0sV0FBVyxLQUFLLENBQUMsQUFBQyxDQUFDLEFBQ3hCLFFBQVEsY0FBQyxDQUFDLEFBQ1QsV0FBVyxNQUFNLEFBQ2xCLENBQUMsQUFDRixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIk1hdGNoTGlzdFByZXZpZXcuc3ZlbHRlIl19 */");
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[53] = list[i];
	child_ctx[55] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[53] = list[i];
	child_ctx[55] = i;
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[53] = list[i];
	child_ctx[55] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[53] = list[i];
	child_ctx[55] = i;
	return child_ctx;
}

// (728:3) {#if editorState}
function create_if_block_1(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = `${l.shuffle}`;
			attr_dev(div, "id", "shuffleArea");
			attr_dev(div, "class", "shuffle text-center svelte-bi3u6x");
			set_style(div, "font-size", "17px");
			set_style(div, "cursor", "pointer");
			set_style(div, "display", "none");
			set_style(div, "color", "#aaa");
			add_location(div, file, 728, 4, 22150);
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
		source: "(728:3) {#if editorState}",
		ctx
	});

	return block;
}

// (810:4) {:else}
function create_else_block(ctx) {
	let div1;
	let t;
	let div0;
	let each_value_3 = /*list1*/ ctx[7];
	validate_each_argument(each_value_3);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let each_value_2 = /*list2*/ ctx[8];
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
			add_location(div0, file, 846, 6, 26121);
			attr_dev(div1, "class", "row-fluid shuffleList1");
			add_location(div1, file, 810, 5, 25038);
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
			if (dirty[0] & /*list1, setList1Html*/ 65664) {
				each_value_3 = /*list1*/ ctx[7];
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

			if (dirty[0] & /*list2, setList2Html, alphabet*/ 133376) {
				each_value_2 = /*list2*/ ctx[8];
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
		source: "(810:4) {:else}",
		ctx
	});

	return block;
}

// (771:4) {#if (multimatch == 0 || multimatch == 1)}
function create_if_block(ctx) {
	let div3;
	let div0;
	let t0;
	let div1;
	let t1;
	let div2;
	let each_value_1 = /*list1*/ ctx[7];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*list2*/ ctx[8];
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
			add_location(div0, file, 772, 5, 24008);
			attr_dev(div1, "class", "span3");
			add_location(div1, file, 790, 5, 24528);
			attr_dev(div2, "class", "span4 shuffleList2");
			add_location(div2, file, 791, 5, 24560);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 771, 4, 23978);
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
			if (dirty[0] & /*list1, setList1Html*/ 65664) {
				each_value_1 = /*list1*/ ctx[7];
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

			if (dirty[0] & /*list2, setList2Html, alphabet*/ 133376) {
				each_value = /*list2*/ ctx[8];
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
		source: "(771:4) {#if (multimatch == 0 || multimatch == 1)}",
		ctx
	});

	return block;
}

// (812:6) {#each list1 as data,i}
function create_each_block_3(ctx) {
	let div3;
	let span0;
	let div0;
	let raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[53], /*i*/ ctx[55]) + "";
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
			attr_dev(div0, "id", div0_id_value = /*data*/ ctx[53].id);
			attr_dev(div0, "class", "list1");
			attr_dev(div0, "tabindex", div0_tabindex_value = 0);
			attr_dev(div0, "data-correctans", div0_data_correctans_value = /*data*/ ctx[53].correctans);
			attr_dev(div0, "data-userans", div0_data_userans_value = /*data*/ ctx[53].userans);

			attr_dev(div0, "data-originalseq", div0_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
			: "0");

			add_location(div0, file, 814, 9, 25186);
			attr_dev(span0, "class", "span4");
			add_location(span0, file, 813, 8, 25155);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[53].id);
			attr_dev(div1, "class", "arrow");
			add_location(div1, file, 825, 9, 25534);
			attr_dev(span1, "class", "span3");
			add_location(span1, file, 824, 8, 25503);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[53].id);
			attr_dev(div2, "class", "list3 ui-droppable");
			attr_dev(div2, "data-droped", "");
			attr_dev(div2, "data-correctans", div2_data_correctans_value = /*data*/ ctx[53].correctans);
			attr_dev(div2, "data-userans", div2_data_userans_value = /*data*/ ctx[53].userans);
			attr_dev(div2, "mrel", div2_mrel_value = /*data*/ ctx[53].id);
			attr_dev(div2, "dropzone", "1");
			attr_dev(div2, "draggable", "true");
			attr_dev(div2, "tabindex", div2_tabindex_value = 0);
			attr_dev(div2, "aria-label", div2_aria_label_value = `Droped`);

			attr_dev(div2, "data-originalseq", div2_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
			: "0");

			add_location(div2, file, 828, 9, 25630);
			attr_dev(span2, "class", "span4");
			add_location(span2, file, 827, 8, 25599);
			attr_dev(div3, "key", div3_key_value = /*i*/ ctx[55]);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 812, 7, 25114);
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
			if (dirty[0] & /*list1*/ 128 && raw_value !== (raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[53], /*i*/ ctx[55]) + "")) div0.innerHTML = raw_value;
			if (dirty[0] & /*list1*/ 128 && div0_id_value !== (div0_id_value = /*data*/ ctx[53].id)) {
				attr_dev(div0, "id", div0_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div0_data_correctans_value !== (div0_data_correctans_value = /*data*/ ctx[53].correctans)) {
				attr_dev(div0, "data-correctans", div0_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div0_data_userans_value !== (div0_data_userans_value = /*data*/ ctx[53].userans)) {
				attr_dev(div0, "data-userans", div0_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div0_data_originalseq_value !== (div0_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
			: "0")) {
				attr_dev(div0, "data-originalseq", div0_data_originalseq_value);
			}

			if (dirty[0] & /*list1*/ 128 && div1_id_value !== (div1_id_value = /*data*/ ctx[53].id)) {
				attr_dev(div1, "id", div1_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_id_value !== (div2_id_value = /*data*/ ctx[53].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_data_correctans_value !== (div2_data_correctans_value = /*data*/ ctx[53].correctans)) {
				attr_dev(div2, "data-correctans", div2_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_data_userans_value !== (div2_data_userans_value = /*data*/ ctx[53].userans)) {
				attr_dev(div2, "data-userans", div2_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_mrel_value !== (div2_mrel_value = /*data*/ ctx[53].id)) {
				attr_dev(div2, "mrel", div2_mrel_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_data_originalseq_value !== (div2_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
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
		source: "(812:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (848:7) {#each list2 as data,i}
function create_each_block_2(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[53], /*alphabet*/ ctx[11][/*i*/ ctx[55]]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			html_tag = new HtmlTag();
			t = space();
			html_tag.a = t;
			attr_dev(div, "key", div_key_value = /*i*/ ctx[55]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[53].id);
			attr_dev(div, "class", "list4 ui-draggable");
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "dragable", "1");
			attr_dev(div, "draggable", "true");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "tabindex", div_tabindex_value = 0);

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
			: "0");

			add_location(div, file, 848, 8, 26213);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list2*/ 256 && raw_value !== (raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[53], /*alphabet*/ ctx[11][/*i*/ ctx[55]]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list2*/ 256 && div_id_value !== (div_id_value = /*data*/ ctx[53].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list2*/ 256 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
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
		source: "(848:7) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (774:6) {#each list1 as data,i}
function create_each_block_1(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[53], /*i*/ ctx[55]) + "";
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
			html_tag = new HtmlTag();
			t = space();
			html_tag.a = t;
			attr_dev(div, "key", div_key_value = /*i*/ ctx[55]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[53].id);
			attr_dev(div, "class", "list1 ui-draggable");
			attr_dev(div, "data-correctans", div_data_correctans_value = /*data*/ ctx[53].correctans);
			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[53].userans);
			attr_dev(div, "style", div_style_value = 'position:relative;');
			attr_dev(div, "tabindex", div_tabindex_value = 0);
			attr_dev(div, "draggable", "true");

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
			: "0");

			add_location(div, file, 774, 8, 24094);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1*/ 128 && raw_value !== (raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[53], /*i*/ ctx[55]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list1*/ 128 && div_id_value !== (div_id_value = /*data*/ ctx[53].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div_data_correctans_value !== (div_data_correctans_value = /*data*/ ctx[53].correctans)) {
				attr_dev(div, "data-correctans", div_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[53].userans)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
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
		source: "(774:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (793:5) {#each list2 as data,i}
function create_each_block(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[53], /*alphabet*/ ctx[11][/*i*/ ctx[55]]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_style_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			html_tag = new HtmlTag();
			t = space();
			html_tag.a = t;
			attr_dev(div, "key", div_key_value = /*i*/ ctx[55]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[53].id);
			attr_dev(div, "class", "list2 ui-droppable");
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "dropzone", "1");
			attr_dev(div, "style", div_style_value = 'position:relative;');
			attr_dev(div, "tabindex", div_tabindex_value = 0);

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
			: "0");

			add_location(div, file, 793, 6, 24630);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list2*/ 256 && raw_value !== (raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[53], /*alphabet*/ ctx[11][/*i*/ ctx[55]]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list2*/ 256 && div_id_value !== (div_id_value = /*data*/ ctx[53].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list2*/ 256 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[53].originalseq
			? /*data*/ ctx[53].originalseq
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
		source: "(793:5) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (879:4) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>
function create_default_slot_1(ctx) {
	let i_1;
	let span;

	const block = {
		c: function create() {
			i_1 = element("i");
			span = element("span");
			span.textContent = "close";
			attr_dev(span, "class", "u-sr-only svelte-bi3u6x");
			add_location(span, file, 879, 28, 27081);
			attr_dev(i_1, "class", "mi mi-close");
			add_location(i_1, file, 879, 5, 27058);
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
		source: "(879:4) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>",
		ctx
	});

	return block;
}

// (870:1) <Dialog     bind:visible={state.dropDialog}     width="450px"    height="271px"    style="background: #fff; border-radius: 5px;"   >
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
				style: 'position:relative;left:21px;bottom:6px;',
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler_3*/ ctx[31]);

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
			add_location(div0, file, 876, 3, 26853);
			attr_dev(div1, "class", "float-end");
			add_location(div1, file, 877, 3, 26922);
			set_style(div2, "font-weight", "bold");
			attr_dev(div2, "class", "clearfix");
			add_location(div2, file, 875, 2, 26800);
			attr_dev(img, "alt", "gif file");
			if (!src_url_equal(img.src, img_src_value = AH$1.select("#matchmain").getAttribute('path') + "match_drop_000BOG.gif")) attr_dev(img, "src", img_src_value);
			add_location(img, file, 885, 4, 27194);
			add_location(br, file, 889, 4, 27319);
			attr_dev(input, "type", "checkbox");
			set_style(input, "top", "2px");
			attr_dev(input, "class", "relative donotshowdialog");
			attr_dev(input, "id", "dropId");
			add_location(input, file, 891, 5, 27356);
			attr_dev(label, "for", "dropId");
			add_location(label, file, 892, 5, 27450);
			attr_dev(span, "class", "mt-2");
			add_location(span, file, 890, 4, 27330);
			attr_dev(div3, "class", "row");
			add_location(div3, file, 884, 3, 27171);
			add_location(div4, file, 883, 2, 27161);
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

			if (dirty[1] & /*$$scope*/ 268435456) {
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
		source: "(870:1) <Dialog     bind:visible={state.dropDialog}     width=\\\"450px\\\"    height=\\\"271px\\\"    style=\\\"background: #fff; border-radius: 5px;\\\"   >",
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
		if (/*multimatch*/ ctx[3] == 0 || /*multimatch*/ ctx[3] == 1) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	function dialog_visible_binding(value) {
		/*dialog_visible_binding*/ ctx[32](value);
	}

	let dialog_props = {
		width: "450px",
		height: "271px",
		style: "background: #fff; border-radius: 5px;",
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*state*/ ctx[10].dropDialog !== void 0) {
		dialog_props.visible = /*state*/ ctx[10].dropDialog;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, 'visible', dialog_visible_binding));

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
			t8 = text(/*listheading1*/ ctx[5]);
			t9 = space();
			div5 = element("div");
			t10 = space();
			div7 = element("div");
			div6 = element("div");
			t11 = text(/*listheading2*/ ctx[6]);
			t12 = space();
			if_block1.c();
			t13 = space();
			create_component(dialog.$$.fragment);
			attr_dev(div0, "class", "btn-group clearfix review_2 h");
			attr_dev(div0, "id", "sm_controller");
			add_location(div0, file, 745, 4, 22597);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "tabindex", button0_tabindex_value = 0);
			attr_dev(button0, "class", "btn btn-light correct-ans clr");
			add_location(button0, file, 755, 6, 22975);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "tabindex", button1_tabindex_value = 0);
			attr_dev(button1, "class", "btn btn-primary both-ans clr");
			add_location(button1, file, 756, 6, 23209);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "tabindex", button2_tabindex_value = 0);
			attr_dev(button2, "class", "btn btn-light your-answer clr");
			add_location(button2, file, 757, 6, 23427);
			attr_dev(div1, "class", "btn-group clearfix review_default h");
			attr_dev(div1, "id", "sm_controller_default");
			add_location(div1, file, 754, 5, 22891);
			attr_dev(div2, "class", div2_class_value = /*btnflag*/ ctx[12] == 0 ? "h" : "");
			add_location(div2, file, 753, 4, 22849);
			attr_dev(div3, "class", "heading");
			add_location(div3, file, 762, 6, 23732);
			attr_dev(div4, "class", "span4");
			add_location(div4, file, 761, 5, 23705);
			attr_dev(div5, "class", "span3");
			add_location(div5, file, 764, 5, 23793);
			attr_dev(div6, "class", "heading");
			add_location(div6, file, 766, 6, 23852);
			attr_dev(div7, "class", "span4");
			add_location(div7, file, 765, 5, 23825);
			attr_dev(div8, "class", "row-fluid");
			add_location(div8, file, 760, 4, 23675);
			attr_dev(div9, "id", /*containerID*/ ctx[4]);
			attr_dev(div9, "path", "//s3.amazonaws.com/jigyaasa_content_static/");
			attr_dev(div9, "multimatch", /*multimatch*/ ctx[3]);
			attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[9]);
			set_style(div9, "font-family", "Roboto, sans-serif");
			set_style(div9, "font-size", "1em");
			add_location(div9, file, 737, 3, 22366);
			add_location(center, file, 726, 2, 22114);
			attr_dev(div10, "id", "previewSection");
			attr_dev(div10, "class", "px-2");
			add_location(div10, file, 725, 4, 22072);
			add_location(main, file, 724, 0, 22060);
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
					listen_dev(button0, "click", /*click_handler*/ ctx[25], false, false, false),
					listen_dev(button0, "keyup", /*keyup_handler*/ ctx[26], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[27], false, false, false),
					listen_dev(button1, "keyup", /*keyup_handler_1*/ ctx[28], false, false, false),
					listen_dev(button2, "click", /*click_handler_2*/ ctx[29], false, false, false),
					listen_dev(button2, "keyup", /*keyup_handler_2*/ ctx[30], false, false, false)
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
			if (!current || dirty[0] & /*listheading1*/ 32) set_data_dev(t8, /*listheading1*/ ctx[5]);
			if (!current || dirty[0] & /*listheading2*/ 64) set_data_dev(t11, /*listheading2*/ ctx[6]);

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

			if (!current || dirty[0] & /*containerID*/ 16) {
				attr_dev(div9, "id", /*containerID*/ ctx[4]);
			}

			if (!current || dirty[0] & /*multimatch*/ 8) {
				attr_dev(div9, "multimatch", /*multimatch*/ ctx[3]);
			}

			if (!current || dirty[0] & /*totalCorrectAns*/ 512) {
				attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[9]);
			}

			const dialog_changes = {};

			if (dirty[0] & /*state*/ 1024 | dirty[1] & /*$$scope*/ 268435456) {
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
	validate_slots('MatchListPreview', slots, []);
	let { user_guid } = $$props;
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

	//let ucMlid = {};
	let state = {
		xml: '',
		remedStatus: '',
		dropDialog: '',
		isReview: false
	};

	// for displaying the answer
	function displayAns() {
		let ans = ucMlid.checkAns("#" + containerID);
		onUserAnsChange({ uXml: ans.u, ans: ans.ans });

		if (editorState) {
			showAns(ans.ans ? 'Correct' : 'Incorrect');
		}
	}

	function loadLibs() {
		let config = {
			preload: true,
			type: 'stylesheet',
			as: 'style'
		};

		AH$1.createLink("https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css", config);
	} //AH.createLink(itemUrl+'css/matchList.min.css');
	//AH.createLink(baseThemeURL + 'svelte_items/clsSMMatchList/css/matchList.min.css', config);

	onMount(async () => {
		// ucMlid = await import ('./matchlistJSString');
		loadLibs();

		dragable = new Draggable({
				onDragEnter: event => {
					AH$1.select(event.target, 'addClass', 'drop-hover');
				},
				onDragLeave: event => {
					AH$1.select(event.target, 'removeClass', 'drop-hover');
				},
				onDragEnd: event => {
					displayAns();

					AH$1.selectAll('.list2').forEach(function (data, _this) {
						AH$1.select(data, 'removeClass', 'drop-hover');
					});

					AH$1.selectAll('.list3').forEach(function (data, _this) {
						AH$1.select(data, 'removeClass', 'drop-hover');
					});

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
							if (typeof AH$1.alert == 'function') AH$1.alert('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.');

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
		AH$1.listen('#matchmain ', 'click', '.matchlist-delete', function (e) {
			setTimeout(
				function () {
					displayAns();
				},
				200
			);
		});

		AH$1.listen(document, 'click', '#set-review', function () {
			setReview();
		});

		// binding up the unsetreview function 
		// jQuery("#unset-review").on('click',function(){
		// 	unsetReview();
		// });// Will Replaced
		AH$1.listen(document, 'click', '#unset-review', function () {
			unsetReview();
		});

		setTimeout(
			(function () {
				//jQuery("#"+containerID+" img").on('load', function() {
				let imgContainerId = AH$1.select("#" + containerID + " img");

				AH$1.listen(document, 'load', imgContainerId, () => {
					// if review mode is on
					if (isReview) {
						// if multimatch is normal or swap list
						if (multimatch == 1 || multimatch == 0) {
							AH$1.select("#" + containerID + " #sm_controller", 'addClass', 'h');
							AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
						} else {
							AH$1.select("#" + containerID + " #sm_controller_default", 'addClass', 'h');
							AH$1.select("#" + containerID + " #sm_controller", 'removeClass', 'h');
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
		if (document.querySelector('#shuffleAre') != null) document.querySelector('#shuffleAre').style.display = "none"; //WIll Replaced

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
					AH$1.find("#" + containerID, '#sm_controller_default .both-ans').click();

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
					AH$1.find("#" + containerID, '#sm_controller_default .your-ans').click();

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
		AH$1.addClass('.review_2, .review_default', 'h');

		//jQuery('.review_2, .review_default').hide();
		let removeclass = document.querySelectorAll('.review_2, .review_default');

		for (let i = 0; i < removeclass.length; i++) {
			removeclass[i].style.display = "none";
		}

		// review_default2.style.display = "none";
		is_remediation = false;

		// if shuffled
		if (isShuffeled == true) {
			AH$1.select('#shuffleArea', 'css', { display: 'none' });
		} else {
			AH$1.select('#shuffleArea', 'css', { display: 'block' });
		}

		// set the user ans in the module 
		ucMlid.modeOn();
	}

	beforeUpdate(() => {
		// checking for the change in the new xml
		if (state.xml != xml) {
			$$invalidate(10, state.xml = xml, state);

			if (cmed) {
				$$invalidate(4, containerID = "matchmain" + cmed);
				$$invalidate(2, ucMlid.ajax_eId = "#matchmain" + cmed, ucMlid);
			}

			$$invalidate(24, isShuffeled = false);
			AH$1.select('#shuffleArea', 'css', { display: 'block' });

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
					if (list1[j]['id'] == i) {
						newArr.push(list1[j]);
					}
				}
			}

			$$invalidate(7, list1 = newArr);

			/*****/
			/* Preserve List Sequence2*/
			let newArr2 = [];

			for (let i of listseq2) {
				for (let j in list2) {
					if (list2[j]['id'] == i) {
						newArr2.push(list2[j]);
					}
				}
			}

			$$invalidate(8, list2 = newArr2);

			/*****/
			if (matchUa.smans.matchlist._userans) {
				const userAns = matchUa.smans.matchlist._userans.split(",");

				for (let k in userAns) {
					for (let m in list1) {
						let uans = userAns[k].split(/\[|\]/g)[1];
						uans = uans.split("|");

						for (let n in uans) {
							if (list1[m]['id'] == uans[n]) {
								$$invalidate(7, list1[m]['userans'] += userAns[k].split(/\[|\]/g)[0] + ",", list1);
							}
						}
					}
				}
			}
		} else {
			// shuffle list 1
			$$invalidate(7, list1 = shuffleArray(list1)); // self.forceUpdate(); it works only in react

			// shuffle list 2
			$$invalidate(8, list2 = shuffleArray(list2));

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
			//console.log('parseUserAnswer');
			parseUserAnswer();
		}

		// checking for the reviewMode
		if (isReview) {
			//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
			AH$1.find("#" + containerID, '#sm_controller_default .both-ans').click();

			var timer = setTimeout(
				function () {
					is_remediation = true;
					displayAns();
					AH$1.select("#shuffleArea", 'css', { display: 'none' });
					ucMlid.modeOn("on");

					if (multimatch == 1 || multimatch == 0) {
						AH$1.select("#" + containerID + " #sm_controller", 'addClass', 'h');
						AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
					} else {
						AH$1.select("#" + containerID + " #sm_controller_default", 'addClass', 'h');
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
			$$invalidate(7, list1 = []);
			$$invalidate(8, list2 = []);

			// fetching value from the xml
			$$invalidate(5, listheading1 = QXML.smxml.matchlist._listheading1);

			$$invalidate(6, listheading2 = QXML.smxml.matchlist._listheading2);
			$$invalidate(3, multimatch = QXML.smxml.matchlist._multimatch);
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
					$$invalidate(9, totalCorrectAns++, totalCorrectAns);
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
								$$invalidate(7, list1[k].correctans = list1[k].correctans + "," + list2[count].id, list1);
							} else {
								$$invalidate(7, list1[k].correctans = list1[k].correctans + "," + tempAns, list1);
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
				$$invalidate(7, list1 = shuffleArray(list1));

				var temparr = [];

				for (var i = 0; i < max_node; i++) {
					temparr.push(list1[i]);
				}

				$$invalidate(7, list1 = temparr);
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

				$$invalidate(8, list2 = temparr);
			}
		} catch(error) {
			console.log({
				error,
				fun: 'ParseXMLPreview',
				file: 'MatchlistPreview.svelte'
			});
		}
	}

	// shuffle the option
	function shuffleItems() {
		$$invalidate(24, isShuffeled = true);
		ucMlid.removeUserAns();
		ucMlid.showUserAns("#" + containerID);
		ucMlid.remove_lines("#" + containerID);
		ucMlid.modeOn();
		$$invalidate(7, list1 = shuffleArray(list1));
		$$invalidate(8, list2 = shuffleArray(list2));
		AH$1.select('#shuffleArea', 'css', { display: 'none' });
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

		let img_src = item.value.substr(1).split("##")[0].split('%%')[0]; // For alt implementating with ##

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

		let img_src = item.value.substr(1).split("##")[0].split('%%')[0]; // For alt implementating with ##

		let img_alt = item.value.substr(1).split("##")[1]
		? item.value.substr(1).split("##")[1]
		: "";

		setList2 = `<span class="serial">${count}.</span>` + (item.value.charAt(0) == "*"
		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
		: is_algo == true ? item.value : item.value);

		return setList2;
	}

	function handleReview(mode) {
		if (mode == 'c') {
			ucMlid.showAllCorrectAns('#' + containerID);
		} else {
			ucMlid.showAllAns('#' + containerID);
		}
	}

	AH$1.listen('body', 'click', '.clr', _this => {
		AH$1.selectAll('.clr', 'removeClass', 'btn-primary');
		AH$1.selectAll('.clr', 'addClass', 'btn-light');
		AH$1.select(_this, 'removeClass', 'btn-light');
		AH$1.select(_this, 'addClass', 'btn-primary');
	});

	const writable_props = ['user_guid', 'showAns', 'cmed', 'xml', 'isReview', 'uxml', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MatchListPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => ucMlid.showCorrect('#' + containerID);

	const keyup_handler = e => {
		if (e.keyCode == 13) ucMlid.showCorrect('#' + containerID);
	};

	const click_handler_1 = () => ucMlid.showAll('#' + containerID);

	const keyup_handler_1 = e => {
		if (e.keyCode == 13) ucMlid.showAll('#' + containerID);
	};

	const click_handler_2 = () => ucMlid.showYour('#' + containerID);

	const keyup_handler_2 = e => {
		if (e.keyCode == 13) ucMlid.showYour('#' + containerID);
	};

	const click_handler_3 = () => {
		$$invalidate(10, state.dropDialog = false, state);
	};

	function dialog_visible_binding(value) {
		if ($$self.$$.not_equal(state.dropDialog, value)) {
			state.dropDialog = value;
			$$invalidate(10, state);
		}
	}

	$$self.$$set = $$props => {
		if ('user_guid' in $$props) $$invalidate(19, user_guid = $$props.user_guid);
		if ('showAns' in $$props) $$invalidate(20, showAns = $$props.showAns);
		if ('cmed' in $$props) $$invalidate(21, cmed = $$props.cmed);
		if ('xml' in $$props) $$invalidate(22, xml = $$props.xml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(23, uxml = $$props.uxml);
		if ('editorState' in $$props) $$invalidate(1, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		Draggable,
		l,
		beforeUpdate,
		onMount,
		ItemHelper,
		ucMlid,
		AH: AH$1,
		XMLToJSON,
		onUserAnsChange,
		Button,
		Dialog,
		user_guid,
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
		if ('user_guid' in $$props) $$invalidate(19, user_guid = $$props.user_guid);
		if ('showAns' in $$props) $$invalidate(20, showAns = $$props.showAns);
		if ('cmed' in $$props) $$invalidate(21, cmed = $$props.cmed);
		if ('xml' in $$props) $$invalidate(22, xml = $$props.xml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(23, uxml = $$props.uxml);
		if ('editorState' in $$props) $$invalidate(1, editorState = $$props.editorState);
		if ('listheading1' in $$props) $$invalidate(5, listheading1 = $$props.listheading1);
		if ('listheading2' in $$props) $$invalidate(6, listheading2 = $$props.listheading2);
		if ('multimatch' in $$props) $$invalidate(3, multimatch = $$props.multimatch);
		if ('list1' in $$props) $$invalidate(7, list1 = $$props.list1);
		if ('list2' in $$props) $$invalidate(8, list2 = $$props.list2);
		if ('cdata' in $$props) cdata = $$props.cdata;
		if ('isShuffeled' in $$props) $$invalidate(24, isShuffeled = $$props.isShuffeled);
		if ('totalCorrectAns' in $$props) $$invalidate(9, totalCorrectAns = $$props.totalCorrectAns);
		if ('alphabet' in $$props) $$invalidate(11, alphabet = $$props.alphabet);
		if ('is_algo' in $$props) is_algo = $$props.is_algo;
		if ('max_node' in $$props) max_node = $$props.max_node;
		if ('is_remediation' in $$props) is_remediation = $$props.is_remediation;
		if ('match_lines' in $$props) match_lines = $$props.match_lines;
		if ('errorCatchFlag' in $$props) errorCatchFlag = $$props.errorCatchFlag;
		if ('originalseq1' in $$props) originalseq1 = $$props.originalseq1;
		if ('originalseq2' in $$props) originalseq2 = $$props.originalseq2;
		if ('btnflag' in $$props) $$invalidate(12, btnflag = $$props.btnflag);
		if ('listenCall' in $$props) listenCall = $$props.listenCall;
		if ('containerID' in $$props) $$invalidate(4, containerID = $$props.containerID);
		if ('dragable' in $$props) dragable = $$props.dragable;
		if ('top1' in $$props) top1 = $$props.top1;
		if ('state' in $$props) $$invalidate(10, state = $$props.state);
		if ('setList1' in $$props) setList1 = $$props.setList1;
		if ('setList2' in $$props) setList2 = $$props.setList2;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview, ucMlid, multimatch, containerID, isShuffeled*/ 16777245) {
			 {
				if (isReview == true) {
					// for displaying the ans
					displayAns();

					AH$1.select("#shuffleArea", "hide");
					ucMlid.modeOn("on");

					// if mode is normal or swap list
					if (multimatch == 1 || multimatch == 0) {
						AH$1.select(".both-ans").click();

						//AH.find("#"+containerID , "#sm_controller", {action: "addClass", actionData: "h"});
						AH$1.select("#" + containerID + " #sm_controller", 'addClass', 'h');

						//AH.find("#"+containerID, "#sm_controller_default", {action: 'removeClass', actionData: 'h'});
						AH$1.select("#" + containerID + ' #sm_controller_default', 'removeClass', 'h');

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
					AH$1.select("#" + containerID + " " + "#sm_controller_default", "css", { display: 'none' });

					if (isShuffeled == true) {
						AH$1.select("#shuffleArea", "css", { display: 'none' });
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
		multimatch,
		containerID,
		listheading1,
		listheading2,
		list1,
		list2,
		totalCorrectAns,
		state,
		alphabet,
		btnflag,
		setReview,
		unsetReview,
		shuffleItems,
		setList1Html,
		setList2Html,
		handleReview,
		user_guid,
		showAns,
		cmed,
		xml,
		uxml,
		isShuffeled,
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

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				user_guid: 19,
				showAns: 20,
				cmed: 21,
				xml: 22,
				isReview: 0,
				uxml: 23,
				editorState: 1
			},
			add_css,
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

		if (/*user_guid*/ ctx[19] === undefined && !('user_guid' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'user_guid'");
		}

		if (/*showAns*/ ctx[20] === undefined && !('showAns' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'showAns'");
		}

		if (/*cmed*/ ctx[21] === undefined && !('cmed' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'cmed'");
		}

		if (/*xml*/ ctx[22] === undefined && !('xml' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'xml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'isReview'");
		}

		if (/*uxml*/ ctx[23] === undefined && !('uxml' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'uxml'");
		}

		if (/*editorState*/ ctx[1] === undefined && !('editorState' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'editorState'");
		}
	}

	get user_guid() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set user_guid(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
//# sourceMappingURL=MatchListPreview-f9bd3611.js.map
