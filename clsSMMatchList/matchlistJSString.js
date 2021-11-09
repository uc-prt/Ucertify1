import hotkeys from 'hotkeys-js';
import JUI,{Draggable} from "../src/libs/javscript_helper/JUI.js";

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
    })
}



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
    })
    ucMlidXMLDom.innerHTML = "<![CDATA[\n" + AH.select("#matchList").value + "\n]]>";
    AH.select("#special_module_xml", 'value', formatXml(ucMlid.xmlDom.xml ? ucMlid.xmlDom.xml : (new XMLSerializer()).serializeToString(ucMlid.xmlDom[0])) );
}



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
        setTimeout(function() { ucMlid.checkAns(mlid) }, 200);
    })
}


// jQuery(document).on('click','.donotshowdialog', function() {
//     var action = (jQuery(this).prop('checked') == true) ? 'store' : 'remove';
//     ucMlid.storeDoNotShow(user_guid, action);
// });

AH.listen('body','click','.donotshowdialo',(_this) => {
    ucMlid.storeDoNotShow(user_guid, (_this.checked == true) ? 'store' : 'remove');
}) //will change

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
} // No Need to fix
ucMlid.chkDoNotShow = function(user_guid) {
    const localdata = JSON.parse(localStorage.getItem('dontshowdialog'));
    if (localdata != null && user_guid in localdata) {
        return true;
    }
    return false;
} // No need to fix

ucMlid.showUserAns = function(mlid) {
    let top1 = 0;
    match_lines = []
    if(AH.select(mlid).nodeName != undefined)
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
        
        
    })
    //jQuery(mlid).find(draggable_ele).draggable(ucMlid.dragOptionMatchlist);

}

ucMlid.bindKeyup = function(mlid) {
    mlid = mlid || ucMlid.ajax_eId;
    //var top1 = 0; //@eslint issues fixed
    //jQuery(".row-fluid").find(".selmatch").removeClass("selmatch");

    AH.find(".row-fluid", ".selmatch", {action: 'removeClass', actionData: 'selmatch'});
    
    //hotkeys.unbind('down,up,left,right,alt+down,enter,delete,esc','matchlist');

    let count = 0;
    //var count_prev = 0; @eslint issues solved
    let copied_id = "";
    let is_multimatch;
    //var ks_activated = false; @eslint issues solved
    //const is_multimatch = jQuery(mlid).attr("multimatch");
    //console.log('checking condition : ',AH.select(mlid).getAttribute("multimatch"));
    if(AH.select(mlid).nodeName != undefined)
    is_multimatch = AH.select(mlid).getAttribute("multimatch");
   
      // Replaced

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
    }) // @eslint issues solved

    document.querySelector(mlid) && document.querySelector(mlid).addEventListener("keydown", ()=> {
        if (typeof hotkeys == "function") {
            hotkeys.setScope('matchlist');
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
        if (count == (a - 1)) { count = 0 } else { count++; }
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
        })
        AH.find(mlid,".list4",'all').forEach((_this)=> {
            _this.classList.remove("copiedclr");
        })
        copied_id = copy_drag[0].id;
        //copy_drag.className = "copiedclr";
        AH.select(copy_drag[0],'addClass','copiedclr');
    }

    ucMlid.cleanTitle = function(){
        AH.find(ucMlid.ajax_eId, '.list1', 'all').forEach((_this) => {
            _this.removeAttribute("aria-label");
        })
    } 

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
    } // No Need to fix

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
            })

            //AH.insert( _ui_drag,_ui_drag_cloned,'afterend');

            let clr = "black";
            //if (jQuery('#main-page').length > 0 && jQuery('#main-page').attr('mode') == "bla") clr = "white";
            if (AH.selectAll('#main-page').length > 0 && AH.selectAll('#main-page').getAttribute("mode") == "bla") clr = "white"
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
            if (_ui_drag.classList.contains("ui-droppable")) {
               // _ui_drag.removeClass("dropped").text("Place Here").attr("data-userans", "").draggable("destroy"); // Need to fixed it.
            }
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
        var _removethis = AH.find(mlid,".ks:focus")
        if(_removethis.classList.contains('ui-draggable') && _removethis.getAttribute("data-userans") != "") {    
            var rem_element = _removethis.getAttribute("id") + "_" + _removethis.getAttribute("data-userans").split(",")[0]
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
        })
        _removethis.removeAttribute("style")
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

    if (typeof hotkeys == "function") {
        hotkeys.unbind('down,up,left,right,alt+down,enter,delete,esc', 'matchlist');
        hotkeys("down,up,left,right,alt+down,enter,delete,esc", 'matchlist', function(event, handler) {
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
        hotkeys.setScope('matchlist');
    } 
}

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
} // No Need to fix



ucMlid.showAns = function(mlid) {
    if(AH.select(mlid).nodeName != undefined)
    ucMlid.multimatch = AH.select(mlid).getAttribute("multimatch");
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
        
        if (ucMlid.f == 1) AH.insert(mlid,str,'afterbegin')
    } else {
        ucMlid.showMultimatchAnswer(mlid, 1);
    }
}

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
}
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
} // No need to change



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
        _this.innerHTML = "Place here"
        AH.select(_this,'css',{backgroundColor:'#fff'});
    })
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
            if (is_not_review == 1) {
               // _this.draggable(jQuery.extend(dragOption_multi, { revert: false })) nned to fix it.
            }
        }
    });

}




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
}



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
}


ucMlid.showAllAns = function(mlid) {
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
                        setTimeout(function() {
                            matchedTitle = ucMlid.getTitle(AH.select('#' + userAns[i]), matchedTitle, i, true, _this.textContent);
                        },200)
                        
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
            })
        }
        const droped_value_indicator_html = ((isCorrect == 1) ? '<span class="icomoon-checkmark-circle" style="color:green;">' : '<span class="icomoon-cancel-circle" style="color:red;">');
        _this.setAttribute('mrel', _this.getAttribute('id'));
        _this.setAttribute('as', isCorrect);
        AH.insert(_this,'<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span>','beforeend');
    });
}




ucMlid.resetMatch = function(){
    AH.remove("#lines")
    AH.remove(".correct_incorrect_icon");
    let str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
    str += '<marker id="trngle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#83C883"/></marker>';
    return str;
}




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
}



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
}

/*ajax based code*/
ucMlid.showAll = function() { //@eslint issues solved
    ucMlid.showAllAns(ucMlid.ajax_eId);
}

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
            if (typeof hotkeys == "function") {
                hotkeys.unbind('down,up,left,right,alt+down,enter,delete,esc', 'matchlist');
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
        }, 50)
    }
} 


ucMlid.unBindLab = function() {
    ucMlid.labBinded = false;
    //jQuery(ucMlid.ajax_eId).find('#lines, .matchlist-delete').remove();
    AH.find(ucMlid.ajax_eId,'#lines, .matchlist-delete',{
        action: 'remove'
    })
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
}




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
}



ucMlid.bindLab = function() {
    
    ucMlid.labBinded = true;
    //jQuery(ucMlid.ajax_eId).find('#lines,.correct,.lines,.correct_incorrect_icon').remove();
    // AH.find(ucMlid.ajax_eId,'#lines,.correct,.lines,.correct_incorrect_icon',{
    //     action:'remove'
    // })
    AH.remove(ucMlid.ajax_eId+' #lines,.correct,.lines,.correct_incorrect_icon');
    // let ucMlidAjax = AH.select(ucMlid.ajax_eId);
    // AH.find(ucMlidAjax,'#lines,.correct,.lines,.correct_incorrect_icon').remove; // Replaced
}
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
}

//module.exports = ucMlid;

export default ucMlid;