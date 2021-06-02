
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, X as XMLToJSON, A as AH, L as beforeUpdate, _ as onUserAnsChange, w as writable, c as create_component, f as space, j as attr_dev, k as add_location, n as insert_dev, m as mount_component, G as prop_dev, t as transition_in, a as transition_out, x as detach_dev, b as destroy_component, l as set_style, z as empty, h as text, a1 as toggle_class, q as listen_dev, a2 as HtmlTag } from './main-0211720b.js';
import { I as ItemHelper } from './ItemHelper-179e801c.js';

const JS = new JUI();
class hotspotScript {
    constructor() {
        this.userAnsXML="<SMANS></SMANS>";
        this.xaxis=[];
        this.yaxis=[];
        this.count=0;
        this.drawstr = ""; 
        this.elemId = '#hptmain0';
        this.labBinded = true;
        this.result = false;
        this.temp = 0;
    }
    // for initiallization the module
    readyThis(hid, review, type, correctans) {
        hid = '#'+hid;
        if (!review) {
            this.labBinded = true;
            const textClickListen = function(event){
                if (this.labBinded) {
                    let _this  = event.target, getVal = '';
                    if (_this.classList.contains('selected')) {	
                        _this.getAttribute('data-userans', 0);
                        _this.classList.remove('selected');
                    } else {
                        _this.getAttribute('data-userans',1);
                        _this.classList.add('selected');
                    }
                    JS.find(hid, '[type] .textClick.selected', 'all').forEach(function(v,i) {
                        if (i==0)
                            getVal = v.textContent;
                        else
                            getVal = getVal + '|' + v.textContent;
                    });
                    JS.find(hid, '[type]', {action: 'attr', actionData: {"data-userans": getVal} });
                }
            }; 
            const textSeelctListen = function(e) {
                if (this.labBinded) {
                    let getVal='';
                    if (e.target?.nodeName == "SPAN") {
                        JS.select(e.target, 'removeClass',['selecttext', 'selected']);
                        this.removespan(e.target,hid,0);
                    } else {
                        this.highlightText(hid);				
                    }
                    JS.find(hid, '[type] .selecttext.selected', 'all').forEach(function(v,i) {
                        if (i == 0) getVal = v.textContent;
                        else getVal = getVal + '|' + v.textContent;
                    });
                    let found = JS.find(hid, '[type]');
                    JS.select(found, 'attr', {"data-userhtml": found.innerHTML, "data-userans": getVal});
                } 
            };
            JS.listen(hid, 'touchstart', '.textClick', textClickListen.bind(this));
            JS.listen(hid, 'touchend', '.textClick', textClickListen.bind(this));
            JS.listen(hid, 'click', '.textClick', textClickListen.bind(this));
            JS.listen(hid, 'touchstart', '[type="textselect"]', textSeelctListen.bind(this));	
            JS.listen(hid, 'touchend', '[type="textselect"]', textSeelctListen.bind(this));
            JS.listen(hid, 'click', '[type="textselect"]', textSeelctListen.bind(this));
        }

    }

    // for checking answer in case of textclick and textselect and also create the user ans on the basis of it and return true if answer is correct
    check_Ans(hid) {
        let userAnswers = "";
        let inNativeIsCorrect = false;
        let sendDataToNative = {
            inNativeIsCorrect: inNativeIsCorrect,
            userAnswers: userAnswers,
        }; 
        this.userAnsXML = "<smans type='4'>\\n";
        this.result = true;
        this.temp = 0;
        JS.select(hid).children.forEacheach((_elm)=>{
            this.userAnsXML = this.checkChildAnswer(hid, _elm, this.userAnsXML);
        });
        this.userAnsXML += "</smans>";
        window.ISSPECIALMODULEUSERXMLCHANGE = 1;
       // JS.select("#special_module_user_xml").value = (userAnsXML);
        sendDataToNative.userAnswers = JS.select("#special_module_user_xml").value;
        if(typeof calculatePoint != "undefined")
        {
            calculatePoint(JS.select(hid).getAttribute('totalcorrectans'), temp);
        }
        if (window.inNative) {
            window.getHeight?.();
            sendDataToNative.inNativeIsCorrect = this.result;
            window.postMessage(JSON.stringify(sendDataToNative), '*');
        }
        return {uxml: userAnsXML, status: result};
    }

    // checking child answer and return useransxml
    checkChildAnswer(hid, pElem, userAnsXML) {
        let _this = pElem.getAttribute('type');
        switch(_this) {
            case "textclick"  :
            case "textselect" : {
                var ansKey  = pElem.getAttribute('data-correctans').split('|').sort().join('|');
                var userKey = pElem.getAttribute('data-userans').split('|').sort();
                userKey 	= userKey.filter(function(e){ return e });
                userKey     = userKey.join('|');
                if (ansKey != userKey) {
                    this.result = false;
                }
                if (typeof calculatePoint != "undefined") {
                    pElem.children.forEach((_elm)=> {
                        if (_elm.classList.contains('selected') && _elm.getAttribute("data-userans") == _elm.getAttribute("data-correctans")) {
                            this.temp++;
                        }
                    });
                }
                if (_this =='textselect') {
                    this.userAnsXML += `<div id="${pElem.getAttribute('id')}" data-userHtml="${escape(pElem.getAttribute('data-userhtml'))}" data-userAns="${escape(pElem.getAttribute('data-userans'))}"></div>\\n`;
                } else {
                    this.userAnsXML += `<div id="${pElem.getAttribute('id')}" data-userAns="${escape(pElem.getAttribute('data-userans'))}"></div>\\n`;
                }
                break;
            }
        }
        return this.userAnsXML;
    }

    // for showing the answer
    showansdrag(hid, ansType, review) {
        if (typeof review === "undefined") review = 0;
        JS.select(hid).children?.forEach?.((_elm)=> {
            this.showchilddragans(hid, _elm, ansType, review);
        });
    }

    // for showing the answer of child element
    showchilddragans(hid, pElem, ansType, review) {
        let hidNode = JS.select(pElem);
        let typ = hidNode.getAttribute('type');
        switch (typ) {
            case "textclick": {
                if (ansType == 'c') {	
                    if (JS.find(hidNode, '.show_correct,.show_incorrect', 'all').length > 0) {
                        JS.find(hidNode, '.show_correct,.show_incorrect', {action: 'removeClass', actionData: ['show_correct', 'show_incorrect'] });
                        JS.find(hidNode, '.correct_incorrect_icon', {action: 'remove'});
                        JS.find(hidNode, '.correct_incorrect_icon', {action: 'removeAttr', actionData: 'style'});
                    }
                    let ansKey = pElem.getAttribute('data-correctans').split('|');
                    var type   = pElem.getAttribute('type');
                    ansKey.forEach((value)=> {			
                        this.selectText(hid, value, ansType, 'selected');
                    });
                } else if (ansType == 'u') {	
                    let type = pElem.getAttribute('type');
                    try {
                        var userans = decodeURIComponent(pElem.getAttribute('data-userans'));
                    } catch(err) {
                        var userans = decodeURIComponent(unescape(pElem.getAttribute('data-userans')));
                    }
                    userans = userans.split('|');
                    userans = userans.filter(function(e){return e});
                    
                    if ((typeof review != "undefined" && review == 1)) {
                        JS.find(hid, '.selected', {action: 'removeClass', actionData: 'selected'});
                        var ansKey  = pElem.getAttribute('data-correctans').split('|');
                        userans.forEach((value)=> {
                            let classname='show_incorrect';
                            if (JS.findInArray(value, ansKey)) {
                                classname = 'show_correct';					
                                this.selectText(hid, value, ansType, classname);				
                            } else {
                                this.selectText(hid, value, ansType, classname);
                            }
                        });
                    } else {
                        userans.forEach((value)=> {			
                            this.selectText(hid,value,'c','selected');
                            JS.select (hid+" p span").remove();
                            JS.select(".textClick", 'removeClass',['show_incorrect', 'show_correct']);
                        });		
                    }
                }
            }
            break;
            case "textselect"  : {
                if (ansType == 'c') {
                    if (JS.find(hidNode, '.show_correct,.show_incorrect').length > 0) {
                        JS.find(hidNode, '.show_correct,.show_incorrect', {action: 'removeClass', actionData: ['show_correct', 'show_incorrect']});
                        JS.find(hidNode, '.correct_incorrect_icon', {action: 'removeAttr', actionData: 'style'});
                    }
                    var ansKey = pElem.getAttribute('data-correctans').split('|');
                    var type = pElem.getAttribute('type');
                    JS.select(pElem, 'html', pElem.getAttribute('data-correcthtml').replace(/<span>/g,"</span>") );
                } else if (ansType == 'u') {	
                    var type = pElem.getAttribute('type');
                    try {
                        var userans = decodeURIComponent(pElem.getAttribute('data-userans'));
                    } catch(err) {
                        var userans = decodeURIComponent(unescape(pElem.getAttribute('data-userans')));
                    }
                    userans = userans.split('|');
                    userans = userans.filter(function(e){return e});
                    if (pElem.getAttribute('data-userhtml') != "" || pElem.getAttribute('data-userhtml') == "undefined") {
                        var _htmlContent = pElem.getAttribute('data-userhtml');
                        try {
                            _htmlContent = decodeURIComponent(_htmlContent );
                            var decodedHtmlContent = decodeURIComponent(_htmlContent );
                        } catch(err) {
                            console.log(err); 
                        } 
                        JS.select(pElem, 'html', decodedHtmlContent);

                    }
                    if ((typeof review != "undefined" && review == 1)) {
                        let text_indicator_html = '<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;vertical-align:super;">';
                        let text_indicator_html1 = '<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold red" style="vertical-align: super;">';
                        JS.insert(pElem.querySelector('span[userans="1"]span[correctans="1"]'), '<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:17px;background:white;border-radius:12px;font-size: 18px;"> '  + text_indicator_html + '</span></span>', 'beforeend');
                        JS.insert(pElem.querySelector('span[userans="1"]span[correctans="0"]'), '<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:17px;background:white;border-radius:12px;font-size: 18px;"> '  + text_indicator_html1 + '</span></span>', 'beforeend');	
                    }
                }
                break;
            }
            case "imagehighlight": {
                let el = JS.find(hid, 'canvas');
                let getAns = JS.select('#special_module_parse').value;
                let cans = getAns.substring(getAns.indexOf('{'),getAns.lastIndexOf('}')+1);
                if ( cans != '') cans = JSON.parse(cans); 
                this.drawOnCanvas(el, cans, window.color);
                if (ansType == 'c') { 
                    let pts = el.getAttribute('correctans');
                    if ( pts != '') pts = JSON.parse(pts);
                    this.drawOnCanvas(el, pts, 'green');
                }
                break;
            } 
        } 
    }

    calculateArea(hid, xaxis, yaxis) {
        let hotareaTop    = Math.min.apply(Math, yaxis),
            hotareaLeft   = Math.min.apply(Math, xaxis),
            hotareaWidth  = Math.max.apply(Math, xaxis) - Math.min.apply(Math, xaxis),
            hotareaHeight = Math.max.apply(Math, yaxis) - Math.min.apply(Math, yaxis);
        return {
            top: hotareaTop,
            left: hotareaLeft,
            width: hotareaWidth,
            height: hotareaHeight
        }
    }

    // function is responsible for getting the value and create the user ans on the basis of it in case of imagehighlight
    getCoordinate(hid, xaxis, yaxis, count){
        if (count == 0){
            this.drawstr = "{\"" + (++count) + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
        } else {
            this.drawstr = JS.select('#special_module_parse').value;
            this.drawstr = drawstr.substring(drawstr.indexOf('{'),drawstr.lastIndexOf('}')+1);
            this.drawstr = drawstr.slice(0, -1);
            //for adding the next draw point
           this.drawstr += ",\"" + (++count) + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
        }
        JS.selectAll(JS.select(hid).children, 'attr', {'userans': this.drawstr });
        // for user ans
        this.createUserAnsXMLDraw(this.drawstr);
        return this.userAnsXML;
    }

    update_HTMLValue(){
        let xmlDom 		= JS.parseHtml(JS.select("#special_module_xml").value);
        let bgimg = "", path = "";
        if( xmlDom) {
            for (let _attr of xmlDom.attributes) {
                switch(na_attr.nameme){
                    case "bgimg":
                        bgimg = _attr.value;
                        break;
                    case "path":
                        path  = _attr.value;
                        break;
                }
            }
        }
        let element = JS.children(xmlDom, 'div');
        let top1 	= element.getAttribute("top");
        let left 	= element.getAttribute("left");
        let width 	= element.getAttribute("width");
        let height 	= element.getAttribute("height");
        JS.select('#area', 'css', {height: height, top: top1, width: width, left: left});
        if (bgimg && path) JS.select('#im', 'attr', {src: path + "/" + bgimg});
    }

    // runs in cas of spot an image and create the user ans xml
    movetarget(tObj, hObj, e) {
        let scoreFlag;
        //let targettop,targetleft;
        tObj.style.display = '';
        if ((!window.event) && (e.layerX)) {
            tObj.style.top = e.layerY - (tObj.height /2) + "px";
            tObj.style.left = e.layerX - (tObj.width /2) + "px" ;
        } else {
            tObj.style.top = e.offsetY - (tObj.height /2) + "px" ;
            tObj.style.left = e.offsetX - (tObj.width /2) + "px" ;
        }
        // checking answer
        scoreFlag = this.checkmodule(tObj, hObj);

        // creating user ans xml
        this.createUserAnsXML(tObj.style.top, tObj.style.left);
        let obj = document.getElementById("special_module_user_xml");
        obj.value = this.userAnsXML;
        obj = document.getElementById("answer");
        if (scoreFlag>0) {
            obj.checked=true;
        } else {
            obj.checked=false;
        }
        if (typeof calculatePoint != "undefined") {
            this.temp = (scoreFlag == 1) ? true : false;
            calculatePoint(1, scoreFlag);
        }
    }

    // user ans xml in case of imagehighlight
    createUserAnsXMLDraw(userAns) {
        this.userAnsXML = '<SMANS type="4"><div userans="'+userAns+'"></div></SMANS>';
    }

    createUserAnsXML(targetTop,targetLeft) {
        this.userAnsXML = '<SMANS type="4"><div targetTop="'+parseInt(targetTop)+'" targetLeft="'+parseInt(targetLeft)+'" /></SMANS>';
    }

    // functions runs in case of the spot an image  module it check the user point is in between the correct answer or not and return 1 if userans is correct
    checkmodule(tObj,hObj) {
        let yourScore=0;
        if (((parseInt(tObj.style.top) + (tObj.height /2) ) >= (parseInt(hObj.style.top))) && ((parseInt(tObj.style.top)  + (tObj.height /2) ) <= (parseInt(hObj.style.top) + parseInt(hObj.style.height)))) {
            if (((parseInt(tObj.style.left) + (tObj.width /2)) >= (parseInt(hObj.style.left))) && ((parseInt(tObj.style.left) + (tObj.width /2) ) <= (parseInt(hObj.style.left) + parseInt(hObj.style.width)))) {
                yourScore=1;
            }
        }
        return yourScore;
    }

    // for drawing n the canvas on the basis of the coordinates
    drawOnCanvas(el,cord,color) {   // checking for if elemnt is exist or not 
        if (el) {
            // getting the element reference
            let c = (el.toString().indexOf('d') != 0) ? document.getElementById(el.getAttribute('id')) : document.getElementById(el);
            // initilaising the getContext Method if c is not null
            let ctx = (c != null) ? c.getContext("2d") : '';

            // getting length of the keys available in the object
            let len = Object.keys(cord).length;

            // drawing on the canvas
            if (cord!='' && ctx!='') {
                //let cal = [];
                for (let i = 1; i <= len ; i++) {
                    for (let j = 0; j <= cord[i]['x'].length; j++) {
                        ctx.beginPath();              
                        ctx.lineWidth   = "4";
                        ctx.strokeStyle = color;
                        ctx.moveTo(cord[i]['x'][j], cord[i]['y'][j]);
                        ctx.lineTo(cord[i]['x'][j+1], cord[i]['y'][j+1]);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    // for comparing answer in case of draw highlight
    compareDrawing(uans,cans,hid) {
        let scoreFlag=0;
        let uval  = this.getAreaVal(uans),
            cval  = this.getAreaVal(cans),
            cflag = 0, temp  = 0,
            clen  = Object.keys(cval).length,
            ulen  = Object.keys(uval).length;
        for (let i = 1; i <= clen; i++) {
           // msg = 'INCorrect Drawn';
            for(let j = 1; j <= ulen; j++) {
                if(uval[j]['height'] <= cval[i]['height'] && uval[j]['width'] <= cval[i]['width'] ) {
                    if(uval[j]['top'] >= cval[i]['top'] && (cval[i]['left'] + cval[i]['width']) - (uval[j]['left'] + uval[j]['width']) >=0) {
                        if(uval[j]['left'] >= cval[i]['left'] && (cval[i]['top'] + cval[i]['height']) - (uval[j]['top'] + uval[j]['height']) >=0) {
                            cflag++;
                            break;
                        }
                    }
                }
            }
            if (typeof calculatePoint != "undefined") {
                if (i == cflag) temp++;
                calculatePoint(JS.select(hid).getAttribute('totalcorrectans'), temp);
            }
        }
        if (clen == cflag && clen==ulen) {
            //msg ='Correct Drawn';
            scoreFlag =1;	
        } 
        return scoreFlag;
    }

    // for getting area val
    getAreaVal(coordinate) {
        let len = Object.keys(coordinate).length;
        if (coordinate!='') {
            let cordval = [];
            for (let i = 1; i <= len ; i++) {
                cordval[i]= this.calculateArea('',coordinate[i]['x'],coordinate[i]['y']);
            }
            return cordval;
        }
    }

    // for the selection of text
    selectText(hid, value, ansType, classname) {
        JS.selectAll(hid+' p').forEach((_elm)=> {
            if (_elm.textContent.trim() == value) {
                _elm.classList.add(classname);
                if(ansType=='u') {
                    let text_indicator_html;
                    if (classname=='show_correct'){
                        text_indicator_html = '<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;vertical-align:7px">';					
                    } else {
                        text_indicator_html = '<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold red" style="vertical-align:7px">';					
                    }
                    JS.insert(_elm, '<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:16px;background:white;border-radius:12px;font-size: 18px;"> '  + text_indicator_html + '</span></span>');
                }
            }		
        });
    }

    // for highlighting the text
    highlightText(hid) {
        if (this.getSelected().getRangeAt(0).endOffset != 0) {
            this.snapSelectionToWord();
            let selectionRange = this.getSelected().getRangeAt(0),
                start = selectionRange.startOffset,
                ans   = JS.find(hid, '[type]').getAttribute('data-correctans').split('|');
                var selection = selectionRange.toString();
                selection = selection.trim();
            if (selection) {
                let cans   = JS.findInArray(selection,ans) ? 1 : 0 ;
                this.pasteHtmlAtCaret("<span class='selecttext selected' correctans="+cans+" userans='1'>"+selection+"</span> ");   
            }
        }
    }

    // for getting selection text
    snapSelectionToWord() {
        let sel;
        // Check for existence of window.getSelection() and that it has a
        // modify() method. IE 9 has both selection APIs but no modify() method.
        if (window.getSelection && (sel == window.getSelection()).modify) {
            sel = window.getSelection();
            if (sel != '' && !sel.isCollapsed) {
                // Detect if selection is backwards
                var range = document.createRange();
                range.setStart(sel.anchorNode, sel.anchorOffset);
                range.setEnd(sel.focusNode, sel.focusOffset);
                var backwards = range.collapsed;
                range.detach();

                // modify() works on the focus of the selection
                var endNode = sel.focusNode, endOffset = sel.focusOffset;
                sel.collapse(sel.anchorNode, sel.anchorOffset);
                if (backwards) {
                    if(JS.findInArray(sel.anchorNode.textContent.charAt(sel.anchorOffset-1),[",",".","!","?",";",")","}"])) { 
                        sel.modify("move", "backward", "character");
                        sel.modify("move", "forward", "word");
                    }
                    sel.extend(endNode, endOffset);
                    sel.modify("extend", "forward", "character");
                    sel.modify("extend", "backward", "word");
                } else {
                    sel.modify("move", "forward", "character");
                    sel.modify("move", "backward", "word");
                    sel.extend(endNode, endOffset);
                    if(JS.findInArray(sel.anchorNode.textContent.charAt(endOffset-1),[",",".","!","?",";",")","}"])) { 
                        sel.modify("extend", "backward", "character");
                        sel.modify("extend", "forward", "word");
                    }
                } 
            }
        } else if ( (sel == document.selection) && sel.type != "Control") {
            let textRange = sel.createRange();
            if (textRange.text) {
                textRange.expand("word");
                // Move the end back to not include the word's trailing space(s), if neccessary
                while (/\s$/.test(textRange.text)) {
                    textRange.moveEnd("character", -1);
                }
                textRange.select();
            } 
        }
    }

    // for pasting the html at caret position
    pasteHtmlAtCaret(html) {
        let sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } 
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

    // for getting seletion
    getSelected() {
        if (window.getSelection) {
            return window.getSelection();
        } else if(document.getSelection) {
            return document.getSelection();
        } else {
            var selection = document.selection && document.selection.createRange();
            if (selection.text) { return selection.text; }
            return false;
        }
    }

    // for removing span element
    removespan(span, hid, review) {
        let span_contents = span.innerHTML;
        let regex = new RegExp('<\\/?span[^>]*>', 'g');
        span_contents = span_contents.replace(regex, "");
        span.parentNode.replaceChild(document.createTextNode(span_contents), span);
        if (!review) JS.find(hid, '[type]', {action: 'html', actionData: JS.find(hid, '[type]').innerHTML });
    }

    /* ajax based code */
    modeOnHot(modeType) {
        JS.selectAll('.test, .review', 'addClass', 'h');
        if (modeType) {
            JS.selectAll('.review', 'removeClass', 'h');
            this.unBindLab();
            this.showansdrag(this.elemId, 'u', 1);
        } else {
            JS.selectAll('.test', 'removeClass', 'h');
            JS.selectAll('.review', 'addClass', 'h');
            this.bindLab();
            this.showansdrag(this.elemId, 'u', 0);
        }
    }

    // for unbinding lab
    unBindLab() {
        this.labBinded = false;
        JS.find(this.elemId, '.hotArea0.hotArea', {action: 'css', actionData: {display: 'block'} });
        JS.find(this.elemId, '.hotSpotImg', {action: 'css', actionData: {pointerEvents: 'none'} });
    }

    // for binding the lab
    bindLab() {
        this.labBinded = true;
        JS.find(this.elemId, '.hotArea0.hotArea', 'css', {display: 'none'});
        JS.find(this.elemId, '.hotSpotImg', 'css', {pointerEvents: 'auto'});
    }

    /* ajax based code */
}

function Point(a, b) {
    if (true === isNaN(Number(a))) {
        this.x = 0;
    } else {
        this.x = a;
    }
    if (true === isNaN(Number(b))) {
        this.y = 0;
    } else {
        this.y = b;
    }
    return {
        "X": this.x,
        "Y": this.y
    };
}
const JS$1 = new JUI();
class DooScribPlugin {
	constructor(options) {
		this.prevPoint = undefined;
		this.defaultOptions = {
			target: "",
			penSize:1,
			width: options.width,
			height: options.height,
			cssClass: '',
			onClick: (e)=> {},
			onMove: (e)=> {},
			onPaint: (e)=> {},
			onRelease: (e)=> {}
		};
		this.penWidth = 2;
		this.drawing = false;
		this.cap = 'round';
		this.ID = 'dooScribCanvas' + Math.floor((Math.random()*100) + 1);
		this.drawingSurface = "";
		if (options) this.Settings = {...this.defaultOptions, ...options};
		console.log(this.Settings);
		if (true === isNaN(this.Settings.height)) {
			this.Settings.height = 100;
		}
		if (true === isNaN(this.Settings.width)){
			this.Settings.width = 100;
		}

		this.init();
	}

	init() {
		let _this = this.Settings.target;
		if (_this) {
			if (_this.getAttribute('id') == "hptmain0")  JS$1.empty(_this);
			JS$1.insert(_this, `<canvas id='${this.ID}' tabindex='0' class='relative ${this.Settings.cssClass}' type='${this.Settings.type}' correctans='${this.Settings.correctans}' userans=''  height='${this.Settings.height}' width='${this.Settings.width}'></canvas>`, 'beforeend');
		    this.penSize(this.Settings.penSize);
		    this.drawingSurface = document.getElementById(this.ID).getContext('2d');
		    this.drawingSurface.lineWidth = this.penSize();
		    this.drawingSurface.lineCap = this.cap;
		    if (false === this.hasTouch()) {
		        document.getElementById(this.ID).addEventListener('mousedown', this.clickDown.bind(this), true);
		        document.getElementById(this.ID).addEventListener('mousemove', this.moved.bind(this), true);
		        document.getElementById(this.ID).addEventListener('mouseup', this.clickUp.bind(this), true);
		    }
		    else {
		        document.getElementById(this.ID).addEventListener('touchstart', this.clickDown.bind(this), true);
		        document.getElementById(this.ID).addEventListener('touchmove', this.moved.bind(this), true);
		        document.getElementById(this.ID).addEventListener('touchend', this.clickUp.bind(this), true);
		    }
		} else {
			console.error("Target not defined");
		}
	}

	normalizeTouch(e) {
		if (true === this.hasTouch()) {
			let st = window.scrollY;
			if (['touchstart', 'touchmove'].indexOf(e.type) > -1) {
				e.clientX = e.targetTouches[0].pageX;
				e.clientY = e.targetTouches[0].pageY - st;
			}
			if (['touchend'].indexOf(e.type) > -1) {
				e.clientX = e.changedTouches[0].pageX;
				e.clientY = e.changedTouches[0].pageY - st;
			   }
		}
		return e;
	}

	clickDown(e) {
		if (true === this.isDrawing()) {
			return;
		}
		if (!e) {
			e = window.event;
		}
		if (true === this.hasTouch()) {
			e.preventDefault();
			e = this.normalizeTouch(e);
		}
		let offset = JS$1.offset(this.Settings.target);
		let st = window.scrollY;
		let pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
		this.prevPoint = pt;
		this.drawing = true;
		this.Settings.onClick(pt);
		return false;
	}
	
	moved(e) {
		if (!e) {
			e = window.event;
		}
		if (true === this.hasTouch()) {
			e.preventDefault();
			e = this.normalizeTouch(e);
		}
		var offset = JS$1.offset(this.Settings.target);
		var st = window.scrollY;
		var pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
		if (true === this.isDrawing()) {
			this.drawLine(this.prevPoint.X, this.prevPoint.Y, pt.X, pt.Y);
			this.prevPoint = pt;
			this.Settings.onPaint(pt);
		}
		else {
			this.Settings.onMove(pt);
		}
		return false;
	}
	
	clickUp(e) {
		if (false === this.isDrawing()) {
			return;
		}
		if (true === this.hasTouch()) {
			e.preventDefault();
			e = this.normalizeTouch(e);
		}
		let offset = JS$1.offset(this.Settings.target);
		let st = window.scrollY;
		let pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
		this.Settings.onRelease(pt);		    
		this.drawing = false;

		return false;			
	}

	hasTouch() {
		return 'ontouchstart' in window;
	}

	penSize (e) {
		if (undefined !== e){
			if (false === isNaN(Number(e))) {
				this.penWidth = e;
			}
		}
		return this.penWidth;
	}

	isDrawing () {
		if (this.Settings.editable)
			return this.drawing;
	}

	lineCap(e) {
		if (undefined !== e) {
			switch(e){
				case 'butt':
				case 'round':
				case 'square':
					this.cap = e;
					break; 
			}
		}
		return this.cap;
	}

	//window.color = "#000000";
	lineColor(e) {
		if(undefined !== e) {
			let a = JS$1.parseHtml("<div id='stub' style='backgroundColor:white'></div>");
			a.style.backgroundColor = e;
			let b = a.style.backgroundColor;
			if ((undefined !== b) && ('' !== b)) {
				window.color = e;
			}
		}
		return window.color;
	}

	context() {
		return this.drawingSurface;
	}

	clearSurface() {
		let width = JS$1.find(document, 'canvas').getAttribute('width').replace('px','');
		let height = JS$1.find(document, 'canvas').getAttribute('height').replace('px','');
		this.drawingSurface.clearRect(0, 0,width,height);
	}
	
	drawLine(fromX, fromY, toX, toY) {
		if ((undefined !== fromX) && (undefined !== fromY) && (undefined !== toX) && (undefined !== toY)) {
			if((false === isNaN(Number(fromX))) && (false === isNaN(Number(fromY))) && (false === isNaN(Number(toX))) && (false === isNaN(Number(toY)))) {
				this.drawingSurface.lineCap = this.cap;	    
				this.drawingSurface.strokeStyle = window.color;		
				this.drawingSurface.lineWidth = this.penWidth;
				this.drawingSurface.beginPath();				    
				this.drawingSurface.moveTo(fromX, fromY);					
				this.drawingSurface.lineTo(toX, toY);
				this.drawingSurface.stroke();
			}
		}
	}
}

/* clsSMHotspot/libs/util.svelte generated by Svelte v3.29.0 */

function checkmodule(targetData) {
	let yourScore = 0;
	let ansDivHeight = targetData.ans_top + targetData.ans_h;
	let ansDivWidth = targetData.ans_left + targetData.ans_w;

	if (targetData.top > targetData.ans_top && targetData.top < ansDivHeight && targetData.left > targetData.ans_left && targetData.left < ansDivWidth) {
		yourScore = 1;
	}

	return yourScore;
}

function createUserAnsXML(targetTop, targetLeft) {
	return "<SMANS type=\"4\"><div targetTop=\"" + parseInt(targetTop) + "\" targetLeft=\"" + parseInt(targetLeft) + "\" /></SMANS>";
}

function movetarget(e, ans_h, ans_w, ans_left, ans_top) {
	// let tObj = document.getElementById('target')[0];
	// let hObj = document.getElementById('hotArea')[0];
	let scoreFlag;

	let targetData = {
		x: e.layerX,
		y: e.layerY,
		top: 0,
		left: 0,
		uXml: "",
		ans: false,
		ans_h,
		ans_w,
		ans_left,
		ans_top
	};

	if (e.layerX && e.layerY) {
		targetData.top = e.layerY - 13;
		targetData.left = e.layerX - 13;
	} else {
		targetData.top = e.offsetY - 13;
		targetData.left = e.offsetX - 13;
	}

	// checking answer
	scoreFlag = checkmodule(targetData);

	// creating user ans xml
	targetData.uXml = createUserAnsXML(targetData.top, targetData.left);

	if (typeof calculatePoint != "undefined") {
		temp = scoreFlag == 1 ? 1 : 0;
		calculatePoint(1, temp);
	}

	if (scoreFlag > 0) {
		targetData.ans = true;
	} else {
		targetData.ans = false;
	}

	return targetData;
}

/* clsSMHotspot/HotspotPreview.svelte generated by Svelte v3.29.0 */

const { Object: Object_1, console: console_1, document: document_1 } = globals;
const file = "clsSMHotspot/HotspotPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-1x7u5s5-style";
	style.textContent = "main.svelte-1x7u5s5{text-align:center !important;padding:1em;max-width:240px;margin:0 auto;font-size:26px}.targetImg.svelte-1x7u5s5{display:none;position:absolute;z-index:10;width:26px;height:26px;border-radius:50%;background:#fff;color:#1c3ad4}.showBlock.svelte-1x7u5s5{display:block}@media(min-width: 640px){main.svelte-1x7u5s5{max-width:none}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFByZXZpZXcuc3ZlbHRlIiwic291cmNlcyI6WyJIb3RzcG90UHJldmlldy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cblx0aW1wb3J0IHsgb25Nb3VudCwgYmVmb3JlVXBkYXRlIH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IGhvdHNwb3RTY3JpcHQgZnJvbSAnLi9ob3RzcG90U2NyaXB0LmpzJztcblx0aW1wb3J0IERvb1NjcmliUGx1Z2luIGZyb20gJy4vaG90c3BvdERyYXdpbmdTY3JpcHQuanMnO1xuXHRpbXBvcnQgeyBYTUxUb0pTT04sIG9uVXNlckFuc0NoYW5nZSwgQUggfSBmcm9tICcuLi9oZWxwZXIvSGVscGVyQUkuc3ZlbHRlJztcblx0aW1wb3J0IEl0ZW1IZWxwZXIgZnJvbSAnLi4vaGVscGVyL0l0ZW1IZWxwZXIuc3ZlbHRlJztcblx0aW1wb3J0IHttb3ZldGFyZ2V0fSBmcm9tICcuL2xpYnMvdXRpbC5zdmVsdGUnO1xuXHRpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cdGV4cG9ydCBsZXQgeG1sO1xuXHRleHBvcnQgbGV0IHV4bWw7XG5cdGV4cG9ydCBsZXQgYW5zU3RhdHVzO1xuXHRleHBvcnQgbGV0IGlzUmV2aWV3O1xuXHRleHBvcnQgbGV0IHNob3dBbnM7XG5cdGV4cG9ydCBsZXQgZWRpdG9yU3RhdGU7XG5cblx0Y29uc3QgSG90SlMgPSBuZXcgaG90c3BvdFNjcmlwdCgpO1xuXHRsZXQgcGFyc2VYbWwgPSBcIlwiO1xuXHRsZXQgYmdJbWdQYXRoID0gJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nO1xuXHRsZXQgYWx0ID0gXCJcIjtcblx0bGV0IG1vZHVsZUFyciA9IHtcblx0XHR0ZXh0Y2xpY2s6IFwiMVwiLFxuXHRcdHRleHRzZWxlY3Q6IFwiMlwiLFxuXHRcdGltYWdlaGlnaGxpZ2h0OiBcIjNcIixcblx0XHRob3RzcG90OiBcIjRcIixcblx0fTtcblx0bGV0IHN0YXRlID0ge307XG5cdGxldCBoZGQgPSB3cml0YWJsZSh7XG5cdFx0aW1nd2lkdGg6IFwiYXV0b1wiLFxuXHRcdGltZ2hlaWdodDogXCJhdXRvXCIsXG5cdH0pXG5cdGxldCBpdGVtQm9yZGVyID0gMDtcblx0bGV0IGl0ZW1Cb3JkZXJDb2xvciA9IFwiZ3JheVwiO1xuXHRsZXQgaXNVeG1sVGFyZ2V0ID0gZmFsc2U7XG5cdGxldCBpdGVtQXJlYVRvcCA9ICcnO1xuXHRsZXQgaXRlbUFyZWFIZWlnaHQgPSAnJztcblx0bGV0IGl0ZW1BcmVhV2lkdGggPSAnJztcblx0bGV0IGl0ZW1BcmVhTGVmdCA9ICcnO1xuXHRsZXQgdGFyZ2V0TGVmdCBcdFx0PSAxMDA7XG5cdGxldCB0YXJnZXRUb3AgXHRcdD0gMTAwO1xuXHRsZXQgdGFyZ2V0VmlldyAgICAgID0gXCJub25lXCI7XG5cdGxldCBhbnNfeCBcdFx0XHQ9IDA7XG5cdGxldCBhbnNfeSBcdFx0XHQ9IDA7XG5cdGxldCBhbnNfaCBcdFx0XHQ9IDA7XG5cdGxldCBhbnNfdyBcdFx0XHQ9IDA7XG5cdGxldCB0eXBlXHRcdFx0PSBcIlwiO1xuXHRsZXQgaW1nX3VybCBcdFx0PSBcIlwiO1xuXHRsZXQgbWFudWFsX2dyYWRlIFx0PSAwO1xuXHRsZXQgb25FcnJvclx0XHRcdD0gbnVsbDsgXG5cdGxldCBpdGVtX3R5cGUgICAgICAgPSBcIlwiO1xuXHRsZXQgeG1sSGVpZ2h0ICAgICAgID0gMDtcblx0bGV0IHhtbFdpZHRoICAgICAgICA9IDA7XG5cdGxldCB1c2VyQ29ycmVjdCAgICAgPSBcIlwiO1xuXHRsZXQgY29ycmVjdGFuc1x0XHQ9IFwiXCI7XG5cdGxldCB0b3RhbENvcnJlY3RBbnM7XG5cdGxldCBzY3JvbGxFbmFibGVkICAgPSBmYWxzZTtcblx0bGV0IGxpbmVjb2xvciA9IFwiYmxhY2tcIjtcblx0bGV0IGRyYXdzdHJcdD0gXCJcIjtcblx0bGV0IGNvdW50ID0gMDtcblx0bGV0IHhheGlzID0gW107XG5cdGxldCB5YXhpcyA9IFtdO1xuXG5cdGNvbnN0IHVuc3Vic2NyaWJlID0gKChpdGVtcyk9Pntcblx0XHRzdGF0ZSA9IGl0ZW1zO1xuXHR9KVxuXG5cdCQ6IHtcblx0XHRpZiAoaXNSZXZpZXcpIHtcblx0XHRcdC8vdGFyZ2V0VmlldyA9IFwiYmxvY2tcIjtcblx0XHRcdHNldFJldmlldygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL3RhcmdldFZpZXcgPSBcIm5vbmVcIjtcblx0XHRcdHVuc2V0UmV2aWV3KCk7XG5cdFx0fVxuXHR9XG5cblx0JDpcdGlmICh4bWwpIHtcblx0XHQvLyBIZXJlIHJlcGxhY2luZyB0aGUgbm90IHN0YW5kYXJkIGNkYXRhIGludG8gdGhlIHZhbGlkIGNkYXRhIGZvcm1hdFxuXHRcdGxldCBteVhtbCA9IHhtbC5yZXBsYWNlKFwiPCEtLVtDREFUQVtcIiwgXCI8IVtDREFUQVtcIikucmVwbGFjZShcIl1dLS0+XCIsIFwiXV0+XCIpO1xuXHRcdFx0XG5cdFx0Ly8gY2hlY2tpbmcgeG1sIGZvciBpZiBjZGF0YSBpcyBmb3VuZCBvciBub3QgXG5cdFx0aWYgKG15WG1sLm1hdGNoKC88XFwhXFxbQ0RBVEFcXFt7fDxcXCEtLVxcW0NEQVRBXFxbey9nbSkpIHtcblx0XHRcdC8vIHNhdmluZyB2YWx1ZSBiL3cgdGhlIHssIH0gc3ltYm9sXG5cdFx0XHRjb3JyZWN0YW5zID0gIG15WG1sLnRvU3RyaW5nKCkubWF0Y2goL3soLiopfS9nbWkpO1xuXHRcdFx0dG90YWxDb3JyZWN0QW5zID0gY29ycmVjdGFucy50b1N0cmluZygpLm1hdGNoKC99LFwiXFxkK1wiL2dtKTtcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9ICh0b3RhbENvcnJlY3RBbnMpID8gdG90YWxDb3JyZWN0QW5zLnBvcCgpIDogbnVsbDtcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9ICh0b3RhbENvcnJlY3RBbnMpID8gdG90YWxDb3JyZWN0QW5zLnJlcGxhY2UoL1wifH18LC9nbSxcIlwiKSA6IDE7XG5cdFx0XHRteVhtbCA9IG15WG1sLnJlcGxhY2UoY29ycmVjdGFucywgXCJcIik7XG5cdFx0XHRjb3JyZWN0YW5zID0gY29ycmVjdGFuc1swXTtcblx0XHR9XG5cdFx0cGFyc2VYbWwgPSBYTUxUb0pTT04oeG1sKTtcblx0XHR4bWxQYXJzZXIoKTtcblx0XHRwcmVSZW5kZXIoKTtcblx0fVxuXG5cdG9uTW91bnQoYXN5bmMgKCkgPT4ge1xuXHRcdHBhcnNlWG1sID0gWE1MVG9KU09OKHhtbCk7XG5cdFx0eG1sUGFyc2VyKCk7XG5cdFx0cHJlUmVuZGVyKCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHhtbFBhcnNlcigpIHtcblx0XHRpdGVtX3R5cGUgPSBwYXJzZVhtbFsnc214bWwnXVsnZGl2J11bJ190eXBlJ107XG5cdFx0eG1sSGVpZ2h0ID0gcGFyc2VYbWxbJ3NteG1sJ11bJ19oZWlnaHQnXTtcblx0XHR4bWxXaWR0aCA9IHBhcnNlWG1sWydzbXhtbCddWydfd2lkdGgnXTtcblx0XHRpZiAoaXRlbV90eXBlID09IHVuZGVmaW5lZCB8fCBpdGVtX3R5cGUgPT0gXCJcIikge1xuXHRcdFx0aXRlbV90eXBlID0gcGFyc2VYbWxbJ3NteG1sJ11bJ19uYW1lJ10udG9Mb3dlckNhc2UoKTtcblx0XHR9XG5cdFx0aW1nX3VybCA9IHBhcnNlWG1sWydzbXhtbCddWydfYmdpbWcnXTtcblxuXHRcdHN3aXRjaCAobW9kdWxlQXJyW2l0ZW1fdHlwZV0pIHtcblx0XHRcdC8vIGluIGNhc2Ugb2YgdGV4dCBjbGljayBcblx0XHRcdGNhc2UgXCIxXCI6IFxuXHRcdFx0XHRcdC8vZ2V0dGluZyB0aGUgd2lkdGggYW5kIGhlaWdodFxuXHRcdFx0XHRcdGRpdkhlaWdodCA9IHBhcnNlWG1sLnNteG1sLl9oZWlnaHQrJ3B4Jztcblx0XHRcdFx0XHRkaXZXaWR0aCA9IHBhcnNlWG1sLnNteG1sLl93aWR0aCsncHgnO1xuXHRcdFx0XHRcdC8vIGZvciBwYXJzaW5nIHRoZSB4bWxcblx0XHRcdFx0XHQvL3BhcnNlVGV4dENsaWNrKHBhcnNlWG1sLnNteG1sLmRpdi5fX2NkYXRhKTtcblx0XHRcdFx0XHRBSC5zZWxlY3QoQUgucGFyZW50KCcjdGV4dElEMCcpLCAnc2hvdycsICdibG9jaycpO1xuXHRcdFx0XHRcdEFILnNlbGVjdEFsbCgnI2RyYXdQcmV2aWV3LHRhYmxlW2lkPVwiaHB0bWFpbjJcIl0nLCAnaGlkZScpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjJcIjogXG5cdFx0XHRcdFx0Ly8gaW4gY2FzZSBvZiB0ZXh0IHNlbGVjdCBtb2R1bGVcblx0XHRcdFx0XHRpZiAoIWlzTmFOKHBhcnNlWG1sLnNteG1sLl9oZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHRwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID0gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnO1x0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRpdkhlaWdodCA9IHBhcnNlWG1sLnNteG1sLl9oZWlnaHQ7XG5cdFx0XHRcdFx0ZGl2V2lkdGggPSBwYXJzZVhtbC5zbXhtbC5fd2lkdGgrJ3B4Jztcblx0XHRcdFx0XHQvLyBmb3IgcGFyc2luZyB0aGUgeG1sXG5cdFx0XHRcdFx0Ly9wYXJzZVRleHRTZWxlY3QocGFyc2VYbWwuc214bWwuZGl2Ll9fY2RhdGEpO1xuXHRcdFx0XHRcdEFILnNlbGVjdChBSC5wYXJlbnQoJyN0ZXh0SUQwJyksICdzaG93JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdFx0QUguc2VsZWN0QWxsKCcjZHJhd1ByZXZpZXcsdGFibGVbaWQ9XCJocHRtYWluMlwiXScsICdoaWRlJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiM1wiOiB7XG5cdFx0XHRcdFx0Ly8gSW4gY2FzZSBvZiBpbWFnZSBoaWdobGlnaHQgXG5cdFx0XHRcdFx0Ly9iZ0ltZyA9IHBhcnNlWG1sLnNteG1sLl9iZ2ltZztcblx0XHRcdFx0XHQvL3ZhciBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaWRkZW5JbWFnZScpO1xuXHRcdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRcdGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdFx0c3RhdGUuaW1naGVpZ2h0ID0gKHBhcnNlWG1sLnNteG1sLl9oZWlnaHQgPiB0aGlzLmhlaWdodCkgPyBwYXJzZVhtbC5zbXhtbC5faGVpZ2h0KydweCcgOiB0aGlzLmhlaWdodCsncHgnO1xuXHRcdFx0XHRcdFx0c3RhdGUuaW1nd2lkdGggPSAocGFyc2VYbWwuc214bWwuX3dpZHRoID4gdGhpcy53aWR0aCkgPyBwYXJzZVhtbC5zbXhtbC5fd2lkdGggKyAncHgnIDogdGhpcy53aWR0aCArICdweCc7XG5cdFx0XHRcdFx0XHRBSC5maW5kKCcjaHB0ZHJhdzAnLCAnY2FudmFzJywge2FjdGlvbjogJ2F0dHInLCBhY3Rpb25EYXRhOiB7aGVpZ2h0OiAgc3RhdGUuaW1naGVpZ2h0LCB3aWR0aDogc3RhdGUuaW1nd2lkdGh9IH0pO1xuXHRcdFx0XHRcdFx0QUguZW1wdHkoJyN0ZXh0SUQwJyk7XG5cdFx0XHRcdFx0XHR1bnNldFJldmlldygpO1xuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdFx0XHRpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGJnSW1nUGF0aCArIHBhcnNlWG1sLnNteG1sLl9iZ2ltZyk7XG5cdFx0XHRcdFx0Ly8gdXNlZCBmb3Igc2V0IHRoZSBiYWNrZ3JvdW5kIGltYWdlIG9mIHRoZSBEcmF3IGhpZ2hsaWdodGVkIG1vZHVsZVxuXHRcdFx0XHRcdC8vaW1nVXJsID0gXCJ1cmwoJ2h0dHBzOlwiICsgYmdJbWdQYXRoICsgcGFyc2VYbWwuc214bWwuX2JnaW1nICsgXCInKVwiO1xuXHRcdFx0XHRcdC8vdGhpcy5mbGFnVXBkYXRlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiNFwiOiB7XG5cdFx0XHRcdFx0Ly8gaW4gY2FzZSBvZiBob3RzcG90IChzcG90IGFuIGltYWdlKVxuXHRcdFx0XHRcdC8vIHNldHRpbmcgYmFja2dyb3VuZEltYWdlICwgYWx0LCB3aWR0aCwgaGVpZ2h0LCBsZWZ0ICwgdG9wICxib3JkZXIsIGJvcmRlcmNvbG9yIG9uIHRoZSBiYXNpcyBvZiB4bWxcblx0XHRcdFx0XHRpbWdfdXJsID0gcGFyc2VYbWwuc214bWwuX2JnaW1nO1xuXHRcdFx0XHRcdGFsdCA9IHBhcnNlWG1sLnNteG1sLl9hbHQ7XG5cdFx0XHRcdFx0YW5zX3kgPSBwYXJzZUZsb2F0KHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsnX3RvcCddKTtcblx0XHRcdFx0XHRhbnNfeCA9IHBhcnNlRmxvYXQocGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfbGVmdCddKSsxMztcblx0XHRcdFx0XHRhbnNfaCA9IHBhcnNlRmxvYXQocGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfaGVpZ2h0J10pO1xuXHRcdFx0XHRcdGFuc193ID0gcGFyc2VGbG9hdChwYXJzZVhtbFsnc214bWwnXVsnZGl2J11bJ193aWR0aCddKTtcblx0XHRcdFx0XHRhbHQgPSBwYXJzZVhtbFsnc214bWwnXVsnZGl2J11bJ19hbHQnXTtcblx0XHRcdFx0XHR0eXBlID0gcGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWyd0eXBlJ107XG5cdFx0XHRcdFx0aXRlbUJvcmRlciAgPSBwYXJzZVhtbC5zbXhtbC5kaXYuX2JvcmRlcjtcblx0XHRcdFx0XHRpdGVtQm9yZGVyQ29sb3IgID0gcGFyc2VYbWwuc214bWwuZGl2Ll9ib3JkZXJjb2xvcjtcblx0XHRcdFx0XHRpdGVtQXJlYVdpZHRoID0gcGFyc2VYbWwuc214bWwuZGl2Ll93aWR0aCsncHgnO1xuXHRcdFx0XHRcdGl0ZW1BcmVhSGVpZ2h0ID0gcGFyc2VYbWwuc214bWwuZGl2Ll9oZWlnaHQrJ3B4Jztcblx0XHRcdFx0XHRpdGVtQXJlYUxlZnQgPSBwYXJzZVhtbC5zbXhtbC5kaXYuX2xlZnQrJ3B4Jztcblx0XHRcdFx0XHRpdGVtQXJlYVRvcCA9IHBhcnNlWG1sLnNteG1sLmRpdi5fdG9wKydweCc7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0bGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0XHRcdFx0aW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRsZXQgYmdJbWdIZWlnaHQgPSB0aGlzLmhlaWdodCsncHgnO1xuXHRcdFx0XHRcdFx0bGV0IGJnSW1nV2lkdGggPSAgdGhpcy53aWR0aCsncHgnO1xuXHRcdFx0XHRcdFx0c3RhdGUuaW1naGVpZ2h0ID0gIChwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ2hlaWdodCkgID8gcGFyc2VYbWwuc214bWwuZGl2Ll9pbWdoZWlnaHQrJ3B4JyA6IFwiYXV0byAhaW1wb3J0YW50XCI7XG5cdFx0XHRcdFx0XHRzdGF0ZS5pbWd3aWR0aCA9IChwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ3dpZHRoKSA/IHBhcnNlWG1sLnNteG1sLmRpdi5faW1nd2lkdGgrJ3B4JyA6ICBcImF1dG8gIWltcG9ydGFudFwiO1xuXHRcdFx0XHRcdFx0QUguc2VsZWN0KCcjaHB0bWFpbjAnLCAnY3NzJywge2hlaWdodDogYmdJbWdIZWlnaHQsIHdpZHRoOiBiZ0ltZ1dpZHRofSk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpbWFnZS5zcmMgPSBiZ0ltZ1BhdGggKyBwYXJzZVhtbC5zbXhtbC5fYmdpbWc7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7IFxuXHRcdH1cblx0XHRcblx0fVxuXG5cdGZ1bmN0aW9uIHByZVJlbmRlcigpIHtcblx0XHRpZiAoaXNSZXZpZXcpIHtcblx0XHRcdHRhcmdldFZpZXcgPSBcImJsb2NrXCI7XG5cdFx0fVxuXHRcdHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiM1wiKSB7XG5cdFx0XHRcdHN0YXRlLmltZ2hlaWdodCA9IChwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID4gdGhpcy5oZWlnaHQpID8gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnIDogdGhpcy5oZWlnaHQrJ3B4Jztcblx0XHRcdFx0c3RhdGUuaW1nd2lkdGggPSAocGFyc2VYbWwuc214bWwuX3dpZHRoID4gdGhpcy53aWR0aCkgPyBwYXJzZVhtbC5zbXhtbC5fd2lkdGggKyAncHgnIDogdGhpcy53aWR0aCArICdweCc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdGF0ZS5pbWdoZWlnaHQgPSAgKHBhcnNlWG1sLnNteG1sLmRpdi5faW1naGVpZ2h0KSAgPyBwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ2hlaWdodCsncHgnIDogXCJhdXRvICFpbXBvcnRhbnRcIjtcblx0XHRcdFx0c3RhdGUuaW1nd2lkdGggPSAocGFyc2VYbWwuc214bWwuZGl2Ll9pbWd3aWR0aCkgPyBwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ3dpZHRoKydweCcgOiAgXCJhdXRvICFpbXBvcnRhbnRcIjtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGltYWdlLnNyYyA9IGJnSW1nUGF0aCArIGltZ191cmw7XG5cdFx0aWYgKHV4bWwpIHtcblx0XHRcdHVzZXJDb3JyZWN0ID0gdXhtbDtcblx0XHRcdGxldCBwYXJzZVV4bWwgPSBYTUxUb0pTT04odXhtbCk7XG5cdFx0XHRpZiAocGFyc2VVeG1sLlNNQU5TICYmIHBhcnNlVXhtbC5TTUFOUy5kaXYpIHtcblx0XHRcdFx0aXNVeG1sVGFyZ2V0ID0gdHJ1ZTtcblx0XHRcdFx0YW5zX3ggPSBwYXJzZVV4bWwuU01BTlMuZGl2Ll90YXJnZXRMZWZ0O1xuXHRcdFx0XHRhbnNfeSA9IHBhcnNlVXhtbC5TTUFOUy5kaXYuX3RhcmdldFRvcDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja0Fuc3dlciAoZXZlbnQpIHtcblx0XHRsZXQgcmVzdWx0ID0gbW92ZXRhcmdldChldmVudCwgYW5zX2gsIGFuc193LCBwYXJzZUludChpdGVtQXJlYUxlZnQpLCBwYXJzZUludChpdGVtQXJlYVRvcCkpO1xuXHRcdGlzVXhtbFRhcmdldCA9IHRydWU7XG5cdFx0YW5zX3ggPSByZXN1bHQubGVmdDtcblx0XHRhbnNfeSA9IHJlc3VsdC50b3A7XG5cdFx0YW5zU3RhdHVzID0gcmVzdWx0LmFucztcblx0XHRpZiAoZWRpdG9yU3RhdGUpIHNob3dBbnMoYW5zU3RhdHVzID8gXCJDb3JyZWN0XCIgOiBcIkluY29ycmVjdFwiKTtcblx0XHRvblVzZXJBbnNDaGFuZ2UocmVzdWx0KTtcblx0fVxuW11cblx0ZnVuY3Rpb24gb25Nb2RhbFRvdWNoKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coZXZlbnQpO1xuXHR9XG5cblx0Ly8gdXNlZCBpbiBuYXRpdmUgZm9yIHRvZ2dsZVxuXHRmdW5jdGlvbiB0b2dnbGVTZWxlY3RBcmVhKCkge1xuXHRcdHNjcm9sbEVuYWJsZWQgPSBzY3JvbGxFbmFibGVkID8gZmFsc2UgOiB0cnVlO1xuXHR9XG5cblx0Ly8gd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXG5cdGZ1bmN0aW9uIHNldFJldmlldygpIHtcblx0XHR0YXJnZXRWaWV3ID0gXCJibG9ja1wiO1xuXHRcdC8vaXNEb3RDcmVhdGUgPSBmYWxzZTtcblx0XHQvLyBpZiB0aGUgbW9kdWxlIGlzIGltYWdlaGlnaGxpZ2h0IHRoZW4gaXQgZHJhdyB0aGUgY29ycmVjdCBhbnN3ZXIgb24gdGhlIG1vZHVsZSB1c2luZyB0aGUgZnVuY3Rpb24gZHJhd09uQ2FudmFzXG5cdFx0aWYgKG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiM1wiKSB7XG5cdFx0XHRsZXQgZWwgPSBBSC5maW5kKCcjcHJldmlld0FyZWEnLCAnY2FudmFzJyk7XG5cdFx0XHRsZXQgcHRzID0gZWwuZ2V0QXR0cmlidXRlKCdjb3JyZWN0YW5zJyk7IFxuXHRcdFx0aWYgKCBwdHMhPScnKSBwdHMgPSBKU09OLnBhcnNlKHB0cyk7XG5cdFx0XHRIb3RKUy5kcmF3T25DYW52YXMoZWwsIHB0cywgJ2dyZWVuJyk7XG5cdFx0fVxuXHRcdC8vIGNhbGxlZCB0aGUgZnVuY3Rpb24gdW5iaW5kIGxhYiB3aGljaCBiYXNpY2FsbHkgc2hvdyB0aGUgZHJhZ2dhYmxlIGVsZW1lbnQgaW4gcHJldmlldyBhcmVhIGlmIGZvdW5kIHdoaWNoIGlzIGZvdW5kIGluIGNhc2Ugb2Ygc3BvdCBhbiBpbWFnZVxuXHRcdEhvdEpTLm1vZGVPbkhvdCgxKTtcblx0XHQvLyBjaGVjayB0aGUgYW5zd2VyIHdldGhlciB0aGUgYW5zd2VyIGlzIGNvcnJlY3Qgb3Igbm90XG5cdFx0Ly9jaGVja0Fuc3dlcigpO1xuXHRcdEFILnNlbGVjdChcIiNocHRtYWluMFwiLCAnY3NzJywge3BvaW50ZXJFdmVudHM6IFwibm9uZVwifSk7XG5cdH1cblxuXHQvLyB3aGVuIHJlbWVkaWF0aW9uIG1vZGUgaXMgb2ZmXG5cdGZ1bmN0aW9uIHVuc2V0UmV2aWV3KCkge1xuXHRcdHRhcmdldFZpZXcgPSBcIm5vbmVcIjtcblx0XHQvLyBpZiB0aGUgbW9kdWxlIGlzIGltYWdlaGlnaGxpZ2h0IHRoZW4gaXQgaGlkZSB0aGUgY29ycmVjdCBhbnN3ZXIgYW5zIHNob3cgdXNlciBhbnMgb24gdGhlIG1vZHVsZSB1c2luZyB0aGUgZnVuY3Rpb24gZHJhd09uQ2FudmFzXG5cdFx0aWYgKG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiM1wiKSB7XG5cdFx0XHRBSC5maW5kKCcjcHJldmlld0FyZWEnLCAnY2FudmFzJywge2FjdGlvbjogJ3JlbW92ZSd9KTtcblx0XHRcdGltYWdlRHJhdygnI3ByZXZpZXdBcmVhJywgMCk7XG5cdFx0XHR2YXIgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZXQgZWwgPSBBSC5maW5kKCcjcHJldmlld0FyZWEnLCAnY2FudmFzJyk7XG5cdFx0XHRcdC8vIGdldHRpbmcgdGhlIHZhbHVlIG9mIHRoZSB1c2VyIGFuc1xuXHRcdFx0XHRsZXQgZ2V0QW5zID0gQUguc2VsZWN0KCcjc3BlY2lhbF9tb2R1bGVfcGFyc2UnKS52YWx1ZSxcblx0XHRcdFx0Ly8gZ2V0dGluZyB0aGUgdXNlciBhbnN3ZXIgY29vcmRpbmF0ZXNcblx0XHRcdFx0Y2FucyAgID0gZ2V0QW5zLnN1YnN0cmluZyhnZXRBbnMuaW5kZXhPZigneycpLGdldEFucy5sYXN0SW5kZXhPZignfScpKzEpO1xuXG5cdFx0XHRcdC8vIHBhcnNpbmcgaXQgaW50byB0aGUgSlNPTiBlbGVtZW50XG5cdFx0XHRcdGlmICggY2FucyE9JycpIGNhbnMgPSBKU09OLnBhcnNlKGNhbnMpO1xuXHRcdFx0XHQvLyBwYXNzZWQgdGhlIHBvaW50cyBpbiB0aGUgY2FudmFzXG5cdFx0XHRcdEhvdEpTLmRyYXdPbkNhbnZhcyhlbCwgY2FucywgbGluZWNvbG9yKTtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdH0sNTAwKTtcblx0XHR9XG5cdFx0Ly8gY2FsbGVkIHRoZSBmdW5jdGlvbiBiaW5kIGxhYiB3aGljaCBiYXNpY2FsbHkgaGlkZSB0aGUgZHJhZ2dhYmxlIGVsZW1lbnQgaW4gcHJldmlldyBhcmVhIGlmIGZvdW5kIHdoaWNoIGlzIGZvdW5kIGluIGNhc2Ugb2Ygc3BvdCBhbiBpbWFnZVxuXHRcdEhvdEpTLm1vZGVPbkhvdCgpO1xuXHRcdEFILnNlbGVjdChcIiNocHRtYWluMFwiLCAnY3NzJywge3BvaW50ZXJFdmVudHM6IFwiYXV0b1wifSk7XG5cdH1cblxuXHQvLyBmb3IgaW1hZ2UgZHJhd1xuXHRmdW5jdGlvbiBpbWFnZURyYXcoaGlkLHJldmlldykge1xuXHRcdGxldCBpbWdPYmogPSAgQUguZmluZChoaWQsICcjaHB0bWFpbjAnKTtcblx0XHRoaWQgPSBpbWdPYmo7XG5cdFx0Ly8gbGV0IGltZ1dpZHRoICA9IGltZ09iai5jbGllbnRXaWR0aDtcblx0XHQvLyBsZXQgaW1nSGVpZ2h0ID0gaW1nT2JqLmNsaWVudEhlaWdodDtcblx0XHRsZXQgc3VyZmFjZSA9IG5ldyBEb29TY3JpYlBsdWdpbih7XG4gICAgICAgICAgICB0YXJnZXQ6IGltZ09iaixcbiAgICAgICAgICAgIHdpZHRoOiArKCBzdGF0ZS5pbWd3aWR0aC5yZXBsYWNlKCdweCcsICcnKSApLFxuICAgICAgICAgICAgaGVpZ2h0OiArKCBzdGF0ZS5pbWdoZWlnaHQucmVwbGFjZSgncHgnLCAnJykgKSxcbiAgICAgICAgICAgIGNvcnJlY3RhbnM6IGNvcnJlY3RhbnMsXG4gICAgICAgICAgICBjc3NDbGFzczogJ2RyYXdTdXJmYWNlJyxcbiAgICAgICAgICAgIHBlblNpemU6IDQsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2VoaWdobGlnaHQnLFxuICAgICAgICAgICAgZWRpdGFibGU6ICghcmV2aWV3KSA/IHRydWU6IGZhbHNlLFxuICAgICAgICAgICAgb25Nb3ZlOiBmdW5jdGlvbiAoKSB7IH0sXG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7IH0sXG4gICAgICAgICAgICBvblBhaW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIC8vIHN0b3JlaW5nIHRoZSBYIGFuZCBZIHZhbHVlc1xuICAgICAgICAgICAgICAgIHhheGlzLnB1c2goZS5YKTtcbiAgICAgICAgICAgICAgICB5YXhpcy5wdXNoKGUuWSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25SZWxlYXNlOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRvblJlbGVhc2VGdW5jKGUsIGhpZCwgcmV2aWV3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cdFx0bGluZWNvbG9yID0gU3RyaW5nKHhtbC5tYXRjaCgvbGluZWNvbG9yPVxcXCIoW15cXFwiXSspXFxcIi9nbSkpO1xuXHRcdGxpbmVjb2xvciA9IGxpbmVjb2xvci5zdWJzdHJpbmcoXCIxMVwiLCAobGluZWNvbG9yLmxlbmd0aCAtIDEpKTtcblx0XHQvL3ZhciByZXMgPSBBSC5zaWJsaW5ncyhoaWQpLmZpbmQoKF9lbG0pPT4gX2VsbS5tYXRjaGVzKCdkaXYnKSApLmdldEF0dHJpYnV0ZSgnaWQnKTtcblx0XHRpZiAoIXJldmlldykge1xuXHRcdFx0QUgubGlzdGVuKCcjcHJldmlld0FyZWEnLCAnY2xpY2snLCAnI3Jlc2V0JywgKCk9PiB7XG5cdFx0XHRcdHN1cmZhY2UuY2xlYXJTdXJmYWNlKCk7XG5cdFx0XHRcdGRyYXdzdHIgPSAnJzsgY291bnQgPSAwO1xuXHRcdFx0XHR1c2VyQ29ycmVjdCA9ICBcIlwiO1xuXHRcdFx0XHRBSC5zZWxlY3RBbGwoQUguc2VsZWN0KGhpZCkuY2hpbGRyZW4sICdhdHRyJywge3VzZXJhbnM6ICcnfSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0d2luZG93LnN1cmZhY2UgPSBzdXJmYWNlO1xuXHR9XG5cblx0Ly8gY2FsbHMgaW4ga2V5IHVwIC8gb25yZWxhc2Ugb2YgbW91c2Vcblx0ZnVuY3Rpb24gb25SZWxlYXNlRnVuYyhlLCBoaWQsIHJldmlldyl7XG5cdFx0bGV0IHVzZXJBbnN3ZXJzID0gJyc7XG5cdFx0bGV0IGluTmF0aXZlSXNDb3JyZWN0ID0gZmFsc2U7XG5cblx0XHQvLyBjaGVjayBmb3IgdGhlIHJldmlldyBtb2RlIGlzIG9uIG9yIG9mZlxuXHRcdGlmICghcmV2aWV3KSB7XHQvLyBpZiByZXZpZXcgbW9kZSBpcyBvZmZcblx0XHRcdGRyYXdzdHIgPSAnJztcblx0XHRcdC8vIGdldHRpbmcgdGhlICB2YWx1ZSBvZiB0aGUgcG9pbnQgXG5cdFx0XHR2YXIgY29vciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcGVjaWFsX21vZHVsZV9wYXJzZScpLnZhbHVlO1xuXHRcdFx0Y29vciA9IGNvb3Iuc3Vic3RyaW5nKGNvb3IuaW5kZXhPZigneycpLGNvb3IubGFzdEluZGV4T2YoJ30nKSsxKTtcblxuXHRcdFx0Ly8gZ2V0dGluZyB0aGUgY29vcmRpbmF0ZXMgdXNpbmcgdGhlIGdldENvb3JkaW5hdGUgZnVuY3Rpb25cblx0XHRcdGlmIChjb29yIT0nJykge1x0XG5cdFx0XHRcdGNvb3IgPSBcdE9iamVjdC5rZXlzKEpTT04ucGFyc2UoY29vcikpLmxlbmd0aDtcblx0XHRcdFx0ZHJhd3N0ciA9IEhvdEpTLmdldENvb3JkaW5hdGUoaGlkLCB4YXhpcywgeWF4aXMsIGNvb3IpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZHJhd3N0ciA9IEhvdEpTLmdldENvb3JkaW5hdGUoaGlkLCB4YXhpcywgeWF4aXMsIGNvdW50KTtcblx0XHRcdH1cblx0XHRcdC8vIGZvciBnZXR0aW5nIHdpbmRvdyBoZWlnaHQgaW4gY2FzZSBvZiBuYXRpdmVcblx0XHRcdGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcblx0XHRcdFx0d2luZG93LmdldEhlaWdodCAmJiB3aW5kb3cuZ2V0SGVpZ2h0KCk7XG5cdFx0XHR9XHRcblxuXHRcdFx0Ly8gZm9yIGF1dG9ncmFkaW5nXG5cdFx0XHR3aW5kb3cuSVNTUEVDSUFMTU9EVUxFVVNFUlhNTENIQU5HRSA9IDE7XG5cdFx0XHQvLyBwdXV0aW5nIHRoZSB2YWx1ZSBpbiB0aGUgdGV4dGFyZWEgZm9yIHNhdmluZyB0aGUgdXNlciBhbnNcblx0XHRcdEFILnNlbGVjdChcIiNzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiLCAndmFsJywgZHJhd3N0cik7XG5cdFx0XHR1c2VyQ29ycmVjdCA9IGRyYXdzdHI7XG5cdFx0XHR4YXhpcz1bXTsgeWF4aXM9W107XG5cdFx0XHQvLyBmb3IgZ2V0dGluZyB0aGUgY29ycmVjdGFuc1xuXHRcdFx0bGV0IHB0cyAgPSBBSC5maW5kKGhpZCwgJ2NhbnZhcycpLmdldEF0dHJpYnV0ZSgnY29ycmVjdGFucycpO1xuXHRcdFx0Ly8gZm9yIGdldHRpbmcgdGhlIHVzZXIgYW5zXG5cdFx0XHRsZXQgY2FucyA9IEFILmZpbmQoaGlkLCAnY2FudmFzJykuZ2V0QXR0cmlidXRlKCd1c2VyYW5zJyk7XG5cblx0XHRcdC8vIHBhcnNpbmcgYm90aCB0aGUganNvbiBpZiB0aGV5IGFyZSBub3QgZW1wdHlcblx0XHRcdGlmICggY2FucyE9JycpIGNhbnMgPSBKU09OLnBhcnNlKGNhbnMpO1xuXHRcdFx0aWYgKCBwdHMhPScnKSBwdHMgPSBKU09OLnBhcnNlKHB0cyk7XG5cblx0XHRcdC8vIGNvbXBhcmluZyB0aGVtIHdpdGggdGhlIGZ1bmN0aW9uICwgaXQgd2lsbCByZXR1cm4gMSBpZiB0aGUgYW5zd2VyIGlzIGNvcnJlY3Rcblx0XHRcdGxldCBmbGFnID0gSG90SlMuY29tcGFyZURyYXdpbmcoY2FucyxwdHMsaGlkKTtcblx0XHRcdGxldCBtZXNzYWdlID0gXCJJbmNvcnJlY3RcIjtcblx0XHRcdC8vIGZvciBzZXR0aW5nIHRoZSBhbnN3ZXIgY29ycmVjdCBpZiBmbGFnID4gMFxuXHRcdFx0aWYgKGZsYWcgPiAwKSB7XG5cdFx0XHRcdGluTmF0aXZlSXNDb3JyZWN0ID0gdHJ1ZTtcblx0XHRcdFx0bWVzc2FnZSA9IFwiQ29ycmVjdFwiO1xuXHRcdFx0XHRzdGF0ZS5hbnN3ZXJUeXBlMyA9IHRydWU7XG5cdFx0XHRcdGlmIChlZGl0b3JTdGF0ZSkgc2hvd0FucyhcIkNvcnJlY3RcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbk5hdGl2ZUlzQ29ycmVjdCA9IGZhbHNlO1xuXHRcdFx0XHRtZXNzYWdlID0gXCJJbmNvcnJlY3RcIjtcblx0XHRcdFx0c3RhdGUuYW5zd2VyVHlwZTMgPSBmYWxzZTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRpZiAoZWRpdG9yU3RhdGUpIHNob3dBbnMobWVzc2FnZSk7XG5cdFx0XHR1c2VyQW5zd2VycyA9IEFILnNlbGVjdCgnI3NwZWNpYWxfbW9kdWxlX3VzZXJfeG1sJykudmFsdWU7XG5cdFx0XHQvLyBAdWMtYWJrOiBXaGVuIHVzZXIgZHJhd2VkIGNhbnZhcyB3aXRoaW4gdGhlIGNvcnJlY3QgYXJlYSA6IGZsYWcgd2lsbCAxXG5cdFx0XHQoZmxhZyA+IDApID8gKEFILnNlbGVjdChcIiNhbnN3ZXJcIikuY2hlY2tlZCA9ICB0cnVlKSA6IChBSC5zZWxlY3QoXCIjYW5zd2VyXCIpLmNoZWNrZWQgPSBmYWxzZSk7XG5cdFx0XHRpZiAod2luZG93LmluTmF0aXZlKSB3aW5kb3cucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBpbk5hdGl2ZUlzQ29ycmVjdCwgdXNlckFuc3dlcnMgfSksIFwiKlwiKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBsb2FkTW9kdWxlKF90eXBlKSB7XG5cdFx0c3dpdGNoKF90eXBlKSB7XG5cdFx0XHQvLyBpZiB0aGUgdHlwZSBpcyB0ZXh0IGNsaWNrIG9yIHRleHQgc2VsZWN0XG5cdFx0XHRjYXNlIFwiMVwiOlxuXHRcdFx0Y2FzZSBcIjJcIjoge1xuXHRcdFx0XHRcdGxldCBkYXRhX3VzZXJhbnMgPSBcIlwiO1xuXHRcdFx0XHRcdGxldCBkYXRhX3VzZXJodG1sID0gXCJcIjtcblx0XHRcdFx0XHRpZiAodXhtbCkge1xuXHRcdFx0XHRcdFx0bGV0IF91eG1sID0gWE1MVG9KU09OKHV4bWwpO1xuXHRcdFx0XHRcdFx0d2luZG93LnRlc3QgPSB1eG1sO1xuXHRcdFx0XHRcdFx0Ly8gZXh0cmFjdCB0aGUgdXNlcmFucyBhbmQgdXNlcmh0bWxcblx0XHRcdFx0XHRcdGlmIChfdXhtbD8uc21hbnM/LmRpdikge1xuXHRcdFx0XHRcdFx0XHRkYXRhX3VzZXJhbnMgPSBfdXhtbC5zbWFucy5kaXZbJ19kYXRhLXVzZXJBbnMnXTtcblx0XHRcdFx0XHRcdFx0ZGF0YV91c2VyaHRtbCA9IF91eG1sLnNtYW5zLmRpdlsnX2RhdGEtdXNlckh0bWwnXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gcmV0dXJuIHRoZSBkaXZcblx0XHRcdFx0XHRyZXR1cm4gKGBcblx0XHRcdFx0XHRcdDxkaXYgaXMgaWQ9XCJocHRtYWluMFwiIHRvdGFsQ29ycmVjdEFucz0ke3RvdGFsQ29ycmVjdEFuc30+XG5cdFx0XHRcdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0XHRcdFx0aWQ9XCJ0ZXh0SUQwXCIgXG5cdFx0XHRcdFx0XHRcdFx0dHlwZT1cIiR7dHlwZU5hbWV9XCIgXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS1jb3JyZWN0aHRtbD1cIiR7Y29ycmVjdEh0bWx9XCIgXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS1jb3JyZWN0YW5zPVwiJHtjb3JyZWN0QW5zU3RyfSBcIlxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtdXNlcmFucz1cIiR7ZGF0YV91c2VyYW5zfVwiIFxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtdXNlcmh0bWw9XCIke2RhdGFfdXNlcmh0bWx9XCIgXG5cdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJkcmFnLXJlc2l6ZSBob3RzcG90VHh0XCIgXG5cdFx0XHRcdFx0XHRcdFx0c3R5bGU9XCJtYXgtd2lkdGg6JHtkaXZXaWR0aH07IGhlaWdodDoke2RpdkhlaWdodH07IGxpbmUtaGVpZ2h0OiAxLjQ7XCJcblx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdGApO1xuXHRcdFx0XHR9XG5cdFx0XHRkZWZhdWx0IDogcmV0dXJuKFwiPGRpdj5JbmNvcnJlY3QgcXVlc3Rpb24gdHlwZTwvZGl2PlwiKTtcblx0XHR9XG5cdH1cblx0XG48L3NjcmlwdD5cblxuPG1haW4+XG5cdDxJdGVtSGVscGVyIFxuXHRcdG9uOnNldFJldmlldyA9IHtzZXRSZXZpZXd9XG5cdFx0b246dW5zZXRSZXZpZXcgPSB7dW5zZXRSZXZpZXd9XG5cdC8+XG5cdDxkaXYgaWQ9XCJwcmV2aWV3QXJlYVwiIGNsYXNzPVwicmVsYXRpdmVcIj5cblx0XHQ8IS0tIGlmIHRoZSB0eXBlIGlzIHRleHQgY2xpY2sgb3IgdGV4dCBzZWxlY3QgLS0+XG5cdFx0eyNpZiBtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjRcIn1cblx0XHRcdDx0YWJsZSBpZD1cImhwdG1haW4wXCIgY2xhc3M9J3NtYmFzZSBzbWhvdHNwb3QgYm9yZGVyLTAgaC1hdXRvIHctYXV0byc+XG5cdFx0XHRcdDx0Ym9keT5cblx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJib3JkZXJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cIlNNMFwiIGNsYXNzPVwicmVsYXRpdmVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcdFx0XHRcdFx0aWQ9J1NNMCcgXG5cdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cIlNNIHBvc2l0aW9uLXJlbGF0aXZlIG0tMCBwLTBcIiBcblx0XHRcdFx0XHRcdFx0XHRcdHN0eWxlPVwie2Bcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IDBweDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cGFkZGluZzogMHB4O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXI6ICR7KGl0ZW1Cb3JkZXIpID8gaXRlbUJvcmRlciArICdweCBzb2xpZCcgOiAnJ307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAke2l0ZW1Cb3JkZXJDb2xvcn07XG5cdFx0XHRcdFx0XHRcdFx0XHRgfVwiXG5cdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGltZyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ9XCJpbTBcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFiaW5kZXg9XCIwXCIgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0eWxlPVwibWF4LXdpZHRoOm5vbmU7IHdpZHRoOiB7c3RhdGUuaW1nd2lkdGh9OyBoZWlnaHQ6IHtzdGF0ZS5pbWdoZWlnaHR9O1wiIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImhvdFNwb3RJbWdcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3JjPXtiZ0ltZ1BhdGgraW1nX3VybH0gXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFsdD17YWx0fSBcblx0XHRcdFx0XHRcdFx0XHRcdFx0b246Y2xpY2s9e2NoZWNrQW5zd2VyfVxuXHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkPSdob3RBcmVhJyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJob3RBcmVhIGhvdEFyZWEgaG90QXJlYVByZXZpZXdcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU9XCJ7YFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6ICR7dGFyZ2V0Vmlld307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGVmdDoke2l0ZW1BcmVhTGVmdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG9wOiR7aXRlbUFyZWFUb3B9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlaWdodDoke2l0ZW1BcmVhSGVpZ2h0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR3aWR0aDoke2l0ZW1BcmVhV2lkdGh9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRgfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCZuYnNwO1xuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZD0ndGFyZ2V0JyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJ0YXJnZXQgdGFyZ2V0SW1nIGljb21vb24tcGx1cy1jaXJjbGUtMlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzOnNob3dCbG9jaz1cIntpc1V4bWxUYXJnZXR9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3R5bGUgPSBcIntgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGVmdDoke2Fuc194fXB4O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRvcDoke2Fuc195fXB4O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRgfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC90ZD5cblx0XHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHQ8L3Rib2R5PlxuXHRcdFx0PC90YWJsZT5cdFxuXHRcdHs6ZWxzZSBpZiBtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjNcIn1cblx0XHRcdDxjZW50ZXIga2V5PVwiaW1hZ2VIZWlnaHRfM1wiPlxuXHRcdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcdHN0eWxlPVwiXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDMycHg7IFxuXHRcdFx0XHRcdFx0d2lkdGg6IHt3aW5kb3cuaW5OYXRpdmUgPyB3aW5kb3cuaW5uZXJXaWR0aCA6IHN0YXRlLmltZ3dpZHRofTsgXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiAjZDllN2ZkOyBcblx0XHRcdFx0XHRcdGJvcmRlci10b3A6IDJweCBzb2xpZCAjOTZiYmY2O1xuXHRcdFx0XHRcdFwiXG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcdFx0aWQ9XCJyZXNldFwiIFxuXHRcdFx0XHRcdFx0c3R5bGU9XCJoZWlnaHQ6IDI3cHg7IHdpZHRoOiA5MHB4O1wiXG5cdFx0XHRcdFx0XHRjbGFzcz1cInJlc2V0IGJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJ0bi1zbSBtdC1zbTIgbXItc20yIGZsb2F0LWVuZFwiPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJpY29tb29uLW5ldy0yNHB4LXJlc2V0LTEgczNcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiB0ZXh0LXRvcFwiPjwvc3Bhbj4gXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInBvc2l0aW9uLXJlbGF0aXZlIGJvdHRvbTFcIj5SZXNldDwvc3Bhbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0aWQ9XCJocHRtYWluMFwiXG5cdFx0XHRcdFx0dG90YWxDb3JyZWN0QW5zPXt0b3RhbENvcnJlY3RBbnN9XG5cdFx0XHRcdFx0ZGQ9e3N0YXRlLmltZ3dpZHRofVxuXHRcdFx0XHRcdHN0eWxlPVwiXG5cdFx0XHRcdFx0XHR3aWR0aDoge3N0YXRlLmltZ3dpZHRoIHx8ICcyNTBweCd9OyBcblx0XHRcdFx0XHRcdGhlaWdodDoge3N0YXRlLmltZ2hlaWdodCB8fCAnNjAwcHgnfTsgXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ3tiZ0ltZ1BhdGgraW1nX3VybH0nKTsgXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTsgXG5cdFx0XHRcdFx0XHRib3JkZXI6IDJweCBzb2xpZCAjZDllN2ZkO1xuXHRcdFx0XHRcdFwiXG5cdFx0XHRcdD48L2Rpdj5cblx0XHRcdFx0eyNpZiBzY3JvbGxFbmFibGVkfVxuXHRcdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0XHRjbGFzcz1cInBvc2l0aW9uLWZpeGVkIGluZGV4MFwiIFxuXHRcdFx0XHRcdFx0c3R5bGU9XCJyaWdodDogMDsgdG9wOiAwOyBsZWZ0OiAwOyBib3R0b206IDA7IGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC40KVwiXG5cdFx0XHRcdFx0PjwvZGl2PlxuXHRcdFx0XHR7L2lmfVxuXHRcdFx0PC9jZW50ZXI+XG5cdFx0ezplbHNlfVxuXHRcdFx0e0BodG1sIGxvYWRNb2R1bGUobW9kdWxlQXJyW2l0ZW1fdHlwZV0pfVxuXHRcdHsvaWZ9XG5cdDwvZGl2PlxuXHQ8aW5wdXQgXG5cdFx0dHlwZT1cImhpZGRlblwiIFxuXHRcdGlkPVwic3BlY2lhbF9tb2R1bGVfcGFyc2VcIiBcblx0XHRuYW1lPVwic3BlY2lhbF9tb2R1bGVfcGFyc2VcIiBcblx0XHR1c2VyYW5zPVwiXCIgXG5cdFx0dmFsdWU9e3VzZXJDb3JyZWN0fSBcblx0Lz5cbjwvbWFpbj5cblxuPHN0eWxlPlxuXHRtYWluIHtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXIgIWltcG9ydGFudDtcblx0XHRwYWRkaW5nOiAxZW07XG5cdFx0bWF4LXdpZHRoOiAyNDBweDtcblx0XHRtYXJnaW46IDAgYXV0bztcblx0XHRmb250LXNpemU6IDI2cHg7XG5cdH1cblxuXHQudGFyZ2V0SW1nIHtcblx0XHRkaXNwbGF5IDogbm9uZTtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0ei1pbmRleDogMTA7XG5cdFx0d2lkdGg6IDI2cHg7XG5cdFx0aGVpZ2h0OjI2cHg7XG5cdFx0Ym9yZGVyLXJhZGl1czogNTAlO1xuXHRcdGJhY2tncm91bmQ6ICNmZmY7XG5cdFx0Y29sb3I6ICMxYzNhZDQ7XG5cdH1cdFxuXG5cdC5zaG93QmxvY2sge1xuXHRcdGRpc3BsYXkgOiBibG9jaztcblx0fVxuXG5cdEBtZWRpYSAobWluLXdpZHRoOiA2NDBweCkge1xuXHRcdG1haW4ge1xuXHRcdFx0bWF4LXdpZHRoOiBub25lO1xuXHRcdH1cblx0fVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFpaEJDLElBQUksZUFBQyxDQUFDLEFBQ0wsVUFBVSxDQUFFLE1BQU0sQ0FBQyxVQUFVLENBQzdCLE9BQU8sQ0FBRSxHQUFHLENBQ1osU0FBUyxDQUFFLEtBQUssQ0FDaEIsTUFBTSxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2QsU0FBUyxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUVELFVBQVUsZUFBQyxDQUFDLEFBQ1gsT0FBTyxDQUFHLElBQUksQ0FDZCxRQUFRLENBQUUsUUFBUSxDQUNsQixPQUFPLENBQUUsRUFBRSxDQUNYLEtBQUssQ0FBRSxJQUFJLENBQ1gsT0FBTyxJQUFJLENBQ1gsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsVUFBVSxDQUFFLElBQUksQ0FDaEIsS0FBSyxDQUFFLE9BQU8sQUFDZixDQUFDLEFBRUQsVUFBVSxlQUFDLENBQUMsQUFDWCxPQUFPLENBQUcsS0FBSyxBQUNoQixDQUFDLEFBRUQsTUFBTSxBQUFDLFlBQVksS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUMxQixJQUFJLGVBQUMsQ0FBQyxBQUNMLFNBQVMsQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRixDQUFDIn0= */";
	append_dev(document_1.head, style);
}

// (516:2) {:else}
function create_else_block(ctx) {
	let html_tag;
	let raw_value = /*loadModule*/ ctx[22](/*moduleArr*/ ctx[18][/*item_type*/ ctx[13]]) + "";
	let html_anchor;

	const block = {
		c: function create() {
			html_anchor = empty();
			html_tag = new HtmlTag(html_anchor);
		},
		m: function mount(target, anchor) {
			html_tag.m(raw_value, target, anchor);
			insert_dev(target, html_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*item_type*/ 8192 && raw_value !== (raw_value = /*loadModule*/ ctx[22](/*moduleArr*/ ctx[18][/*item_type*/ ctx[13]]) + "")) html_tag.p(raw_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(html_anchor);
			if (detaching) html_tag.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(516:2) {:else}",
		ctx
	});

	return block;
}

// (478:40) 
function create_if_block_1(ctx) {
	let center;
	let div1;
	let div0;
	let span0;
	let t0;
	let span1;
	let t2;
	let div2;
	let div2_dd_value;
	let t3;
	let if_block = /*scrollEnabled*/ ctx[16] && create_if_block_2(ctx);

	const block = {
		c: function create() {
			center = element("center");
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = space();
			span1 = element("span");
			span1.textContent = "Reset";
			t2 = space();
			div2 = element("div");
			t3 = space();
			if (if_block) if_block.c();
			attr_dev(span0, "class", "icomoon-new-24px-reset-1 s3");
			set_style(span0, "vertical-align", "text-top");
			add_location(span0, file, 491, 6, 16020);
			attr_dev(span1, "class", "position-relative bottom1");
			add_location(span1, file, 492, 6, 16110);
			attr_dev(div0, "id", "reset");
			set_style(div0, "height", "27px");
			set_style(div0, "width", "90px");
			attr_dev(div0, "class", "reset btn btn-outline-primary btn-sm mt-sm2 mr-sm2 float-end");
			add_location(div0, file, 487, 5, 15873);
			set_style(div1, "height", "32px");

			set_style(div1, "width", window.inNative
			? window.innerWidth
			: /*state*/ ctx[1].imgwidth);

			set_style(div1, "background", "#d9e7fd");
			set_style(div1, "border-top", "2px solid #96bbf6");
			add_location(div1, file, 479, 4, 15680);
			attr_dev(div2, "id", "hptmain0");
			attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[15]);
			attr_dev(div2, "dd", div2_dd_value = /*state*/ ctx[1].imgwidth);
			set_style(div2, "width", /*state*/ ctx[1].imgwidth || "250px");
			set_style(div2, "height", /*state*/ ctx[1].imgheight || "600px");
			set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[17] + /*img_url*/ ctx[12]) + "')");
			set_style(div2, "background-repeat", "no-repeat");
			set_style(div2, "position", "relative");
			set_style(div2, "border", "2px solid #d9e7fd");
			add_location(div2, file, 495, 4, 16190);
			attr_dev(center, "key", "imageHeight_3");
			add_location(center, file, 478, 3, 15647);
		},
		m: function mount(target, anchor) {
			insert_dev(target, center, anchor);
			append_dev(center, div1);
			append_dev(div1, div0);
			append_dev(div0, span0);
			append_dev(div0, t0);
			append_dev(div0, span1);
			append_dev(center, t2);
			append_dev(center, div2);
			append_dev(center, t3);
			if (if_block) if_block.m(center, null);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 2) {
				set_style(div1, "width", window.inNative
				? window.innerWidth
				: /*state*/ ctx[1].imgwidth);
			}

			if (dirty[0] & /*totalCorrectAns*/ 32768) {
				attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[15]);
			}

			if (dirty[0] & /*state*/ 2 && div2_dd_value !== (div2_dd_value = /*state*/ ctx[1].imgwidth)) {
				attr_dev(div2, "dd", div2_dd_value);
			}

			if (dirty[0] & /*state*/ 2) {
				set_style(div2, "width", /*state*/ ctx[1].imgwidth || "250px");
			}

			if (dirty[0] & /*state*/ 2) {
				set_style(div2, "height", /*state*/ ctx[1].imgheight || "600px");
			}

			if (dirty[0] & /*img_url*/ 4096) {
				set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[17] + /*img_url*/ ctx[12]) + "')");
			}

			if (/*scrollEnabled*/ ctx[16]) {
				if (if_block) ; else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(center, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(center);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(478:40) ",
		ctx
	});

	return block;
}

// (421:2) {#if moduleArr[item_type] == "4"}
function create_if_block(ctx) {
	let table;
	let tbody;
	let tr;
	let td;
	let div2;
	let div1;
	let img;
	let img_src_value;
	let t0;
	let div0;
	let t1;
	let div0_style_value;
	let t2;
	let span;
	let span_style_value;
	let div1_style_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			table = element("table");
			tbody = element("tbody");
			tr = element("tr");
			td = element("td");
			div2 = element("div");
			div1 = element("div");
			img = element("img");
			t0 = space();
			div0 = element("div");
			t1 = text(" ");
			t2 = space();
			span = element("span");
			attr_dev(img, "id", "im0");
			attr_dev(img, "tabindex", "0");
			set_style(img, "max-width", "none");
			set_style(img, "width", /*state*/ ctx[1].imgwidth);
			set_style(img, "height", /*state*/ ctx[1].imgheight);
			attr_dev(img, "class", "hotSpotImg");
			if (img.src !== (img_src_value = /*bgImgPath*/ ctx[17] + /*img_url*/ ctx[12])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", /*alt*/ ctx[0]);
			add_location(img, file, 439, 9, 14662);
			attr_dev(div0, "id", "hotArea");
			attr_dev(div0, "class", "hotArea hotArea hotAreaPreview");

			attr_dev(div0, "style", div0_style_value = `
											display: ${/*targetView*/ ctx[9]};
											left:${/*itemAreaLeft*/ ctx[8]};
											top:${/*itemAreaTop*/ ctx[5]};
											height:${/*itemAreaHeight*/ ctx[6]};
											width:${/*itemAreaWidth*/ ctx[7]};
										`);

			add_location(div0, file, 448, 9, 14939);
			attr_dev(span, "id", "target");
			attr_dev(span, "class", "target targetImg icomoon-plus-circle-2 svelte-1x7u5s5");

			attr_dev(span, "style", span_style_value = `
											left:${/*ans_x*/ ctx[10]}px;
											top:${/*ans_y*/ ctx[11]}px;
										`);

			toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[4]);
			add_location(span, file, 461, 9, 15277);
			attr_dev(div1, "id", "SM0");
			attr_dev(div1, "class", "SM position-relative m-0 p-0");

			attr_dev(div1, "style", div1_style_value = `
										position: relative;
										margin: 0px;
										padding: 0px;
										width: 100%;
										height: 100%;
										border: ${/*itemBorder*/ ctx[2]
			? /*itemBorder*/ ctx[2] + "px solid"
			: ""};
										borderColor: ${/*itemBorderColor*/ ctx[3]};
									`);

			add_location(div1, file, 426, 8, 14306);
			attr_dev(div2, "id", "SM0");
			attr_dev(div2, "class", "relative");
			add_location(div2, file, 425, 7, 14266);
			attr_dev(td, "class", "border");
			add_location(td, file, 424, 6, 14239);
			add_location(tr, file, 423, 5, 14228);
			add_location(tbody, file, 422, 4, 14215);
			attr_dev(table, "id", "hptmain0");
			attr_dev(table, "class", "smbase smhotspot border-0 h-auto w-auto");
			add_location(table, file, 421, 3, 14141);
		},
		m: function mount(target, anchor) {
			insert_dev(target, table, anchor);
			append_dev(table, tbody);
			append_dev(tbody, tr);
			append_dev(tr, td);
			append_dev(td, div2);
			append_dev(div2, div1);
			append_dev(div1, img);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, t1);
			append_dev(div1, t2);
			append_dev(div1, span);

			if (!mounted) {
				dispose = listen_dev(img, "click", /*checkAnswer*/ ctx[19], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 2) {
				set_style(img, "width", /*state*/ ctx[1].imgwidth);
			}

			if (dirty[0] & /*state*/ 2) {
				set_style(img, "height", /*state*/ ctx[1].imgheight);
			}

			if (dirty[0] & /*img_url*/ 4096 && img.src !== (img_src_value = /*bgImgPath*/ ctx[17] + /*img_url*/ ctx[12])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*alt*/ 1) {
				attr_dev(img, "alt", /*alt*/ ctx[0]);
			}

			if (dirty[0] & /*targetView, itemAreaLeft, itemAreaTop, itemAreaHeight, itemAreaWidth*/ 992 && div0_style_value !== (div0_style_value = `
											display: ${/*targetView*/ ctx[9]};
											left:${/*itemAreaLeft*/ ctx[8]};
											top:${/*itemAreaTop*/ ctx[5]};
											height:${/*itemAreaHeight*/ ctx[6]};
											width:${/*itemAreaWidth*/ ctx[7]};
										`)) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (dirty[0] & /*ans_x, ans_y*/ 3072 && span_style_value !== (span_style_value = `
											left:${/*ans_x*/ ctx[10]}px;
											top:${/*ans_y*/ ctx[11]}px;
										`)) {
				attr_dev(span, "style", span_style_value);
			}

			if (dirty[0] & /*isUxmlTarget*/ 16) {
				toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[4]);
			}

			if (dirty[0] & /*itemBorder, itemBorderColor*/ 12 && div1_style_value !== (div1_style_value = `
										position: relative;
										margin: 0px;
										padding: 0px;
										width: 100%;
										height: 100%;
										border: ${/*itemBorder*/ ctx[2]
			? /*itemBorder*/ ctx[2] + "px solid"
			: ""};
										borderColor: ${/*itemBorderColor*/ ctx[3]};
									`)) {
				attr_dev(div1, "style", div1_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(table);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(421:2) {#if moduleArr[item_type] == \\\"4\\\"}",
		ctx
	});

	return block;
}

// (509:4) {#if scrollEnabled}
function create_if_block_2(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "position-fixed index0");
			set_style(div, "right", "0");
			set_style(div, "top", "0");
			set_style(div, "left", "0");
			set_style(div, "bottom", "0");
			set_style(div, "background", "rgba(0,0,0,0.4)");
			add_location(div, file, 509, 5, 16578);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(509:4) {#if scrollEnabled}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let itemhelper;
	let t0;
	let div;
	let t1;
	let input;
	let current;
	itemhelper = new ItemHelper({ $$inline: true });
	itemhelper.$on("setReview", /*setReview*/ ctx[20]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[21]);

	function select_block_type(ctx, dirty) {
		if (/*moduleArr*/ ctx[18][/*item_type*/ ctx[13]] == "4") return create_if_block;
		if (/*moduleArr*/ ctx[18][/*item_type*/ ctx[13]] == "3") return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			main = element("main");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div = element("div");
			if_block.c();
			t1 = space();
			input = element("input");
			attr_dev(div, "id", "previewArea");
			attr_dev(div, "class", "relative");
			add_location(div, file, 418, 1, 14010);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "special_module_parse");
			attr_dev(input, "name", "special_module_parse");
			attr_dev(input, "userans", "");
			input.value = /*userCorrect*/ ctx[14];
			add_location(input, file, 519, 1, 16808);
			attr_dev(main, "class", "svelte-1x7u5s5");
			add_location(main, file, 413, 0, 13922);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			mount_component(itemhelper, main, null);
			append_dev(main, t0);
			append_dev(main, div);
			if_block.m(div, null);
			append_dev(main, t1);
			append_dev(main, input);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}

			if (!current || dirty[0] & /*userCorrect*/ 16384) {
				prop_dev(input, "value", /*userCorrect*/ ctx[14]);
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
			if_block.d();
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

function onModalTouch(event) {
	console.log(event);
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("HotspotPreview", slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { ansStatus } = $$props;
	let { isReview } = $$props;
	let { showAns } = $$props;
	let { editorState } = $$props;
	const HotJS = new hotspotScript();
	let parseXml = "";
	let bgImgPath = "//s3.amazonaws.com/jigyaasa_content_static/";
	let alt = "";

	let moduleArr = {
		textclick: "1",
		textselect: "2",
		imagehighlight: "3",
		hotspot: "4"
	};

	let state = {};
	let hdd = writable({ imgwidth: "auto", imgheight: "auto" });
	let itemBorder = 0;
	let itemBorderColor = "gray";
	let isUxmlTarget = false;
	let itemAreaTop = "";
	let itemAreaHeight = "";
	let itemAreaWidth = "";
	let itemAreaLeft = "";
	let targetLeft = 100;
	let targetTop = 100;
	let targetView = "none";
	let ans_x = 0;
	let ans_y = 0;
	let ans_h = 0;
	let ans_w = 0;
	let type = "";
	let img_url = "";
	let manual_grade = 0;
	let onError = null;
	let item_type = "";
	let xmlHeight = 0;
	let xmlWidth = 0;
	let userCorrect = "";
	let correctans = "";
	let totalCorrectAns;
	let scrollEnabled = false;
	let linecolor = "black";
	let drawstr = "";
	let count = 0;
	let xaxis = [];
	let yaxis = [];

	const unsubscribe = items => {
		$$invalidate(1, state = items);
	};

	onMount(async () => {
		parseXml = XMLToJSON(xml);
		xmlParser();
		preRender();
	});

	function xmlParser() {
		$$invalidate(13, item_type = parseXml["smxml"]["div"]["_type"]);
		xmlHeight = parseXml["smxml"]["_height"];
		xmlWidth = parseXml["smxml"]["_width"];

		if (item_type == undefined || item_type == "") {
			$$invalidate(13, item_type = parseXml["smxml"]["_name"].toLowerCase());
		}

		$$invalidate(12, img_url = parseXml["smxml"]["_bgimg"]);

		switch (moduleArr[item_type]) {
			case "1":
				//getting the width and height
				divHeight = parseXml.smxml._height + "px";
				divWidth = parseXml.smxml._width + "px";
				// for parsing the xml
				//parseTextClick(parseXml.smxml.div.__cdata);
				AH.select(AH.parent("#textID0"), "show", "block");
				AH.selectAll("#drawPreview,table[id=\"hptmain2\"]", "hide");
				break;
			case "2":
				// in case of text select module
				if (!isNaN(parseXml.smxml._height)) {
					parseXml.smxml._height = parseXml.smxml._height + "px";
				}
				divHeight = parseXml.smxml._height;
				divWidth = parseXml.smxml._width + "px";
				// for parsing the xml
				//parseTextSelect(parseXml.smxml.div.__cdata);
				AH.select(AH.parent("#textID0"), "show", "block");
				AH.selectAll("#drawPreview,table[id=\"hptmain2\"]", "hide");
				break;
			case "3":
				{
					// In case of image highlight 
					//bgImg = parseXml.smxml._bgimg;
					//var image = document.getElementById('hiddenImage');
					let image = new Image();

					image.addEventListener(
						"load",
						function (event) {
							$$invalidate(
								1,
								state.imgheight = parseXml.smxml._height > this.height
								? parseXml.smxml._height + "px"
								: this.height + "px",
								state
							);

							$$invalidate(
								1,
								state.imgwidth = parseXml.smxml._width > this.width
								? parseXml.smxml._width + "px"
								: this.width + "px",
								state
							);

							AH.find("#hptdraw0", "canvas", {
								action: "attr",
								actionData: {
									height: state.imgheight,
									width: state.imgwidth
								}
							});

							AH.empty("#textID0");
							unsetReview();
						},
						false
					);

					image.setAttribute("src", bgImgPath + parseXml.smxml._bgimg);
				}
				//imgUrl = "url('https:" + bgImgPath + parseXml.smxml._bgimg + "')";
				//this.flagUpdate = false;
				break;
			case "4":
				{
					// in case of hotspot (spot an image)
					// setting backgroundImage , alt, width, height, left , top ,border, bordercolor on the basis of xml
					$$invalidate(12, img_url = parseXml.smxml._bgimg); // used for set the background image of the Draw highlighted module

					$$invalidate(0, alt = parseXml.smxml._alt);
					$$invalidate(11, ans_y = parseFloat(parseXml["smxml"]["div"]["_top"]));
					$$invalidate(10, ans_x = parseFloat(parseXml["smxml"]["div"]["_left"]) + 13);
					ans_h = parseFloat(parseXml["smxml"]["div"]["_height"]);
					ans_w = parseFloat(parseXml["smxml"]["div"]["_width"]);
					$$invalidate(0, alt = parseXml["smxml"]["div"]["_alt"]);
					type = parseXml["smxml"]["div"]["type"];
					$$invalidate(2, itemBorder = parseXml.smxml.div._border);
					$$invalidate(3, itemBorderColor = parseXml.smxml.div._bordercolor);
					$$invalidate(7, itemAreaWidth = parseXml.smxml.div._width + "px");
					$$invalidate(6, itemAreaHeight = parseXml.smxml.div._height + "px");
					$$invalidate(8, itemAreaLeft = parseXml.smxml.div._left + "px");
					$$invalidate(5, itemAreaTop = parseXml.smxml.div._top + "px");
					let image = new Image();

					image.onload = function () {
						let bgImgHeight = this.height + "px";
						let bgImgWidth = this.width + "px";

						$$invalidate(
							1,
							state.imgheight = parseXml.smxml.div._imgheight
							? parseXml.smxml.div._imgheight + "px"
							: "auto !important",
							state
						);

						$$invalidate(
							1,
							state.imgwidth = parseXml.smxml.div._imgwidth
							? parseXml.smxml.div._imgwidth + "px"
							: "auto !important",
							state
						);

						AH.select("#hptmain0", "css", { height: bgImgHeight, width: bgImgWidth });
					};

					image.src = bgImgPath + parseXml.smxml._bgimg;
				}
				break;
		}
	}

	function preRender() {
		if (isReview) {
			$$invalidate(9, targetView = "block");
		}

		var image = new Image();

		image.onload = function () {
			if (moduleArr[item_type] == "3") {
				$$invalidate(
					1,
					state.imgheight = parseXml.smxml._height > this.height
					? parseXml.smxml._height + "px"
					: this.height + "px",
					state
				);

				$$invalidate(
					1,
					state.imgwidth = parseXml.smxml._width > this.width
					? parseXml.smxml._width + "px"
					: this.width + "px",
					state
				);
			} else {
				$$invalidate(
					1,
					state.imgheight = parseXml.smxml.div._imgheight
					? parseXml.smxml.div._imgheight + "px"
					: "auto !important",
					state
				);

				$$invalidate(
					1,
					state.imgwidth = parseXml.smxml.div._imgwidth
					? parseXml.smxml.div._imgwidth + "px"
					: "auto !important",
					state
				);
			}
		};

		image.src = bgImgPath + img_url;

		if (uxml) {
			$$invalidate(14, userCorrect = uxml);
			let parseUxml = XMLToJSON(uxml);

			if (parseUxml.SMANS && parseUxml.SMANS.div) {
				$$invalidate(4, isUxmlTarget = true);
				$$invalidate(10, ans_x = parseUxml.SMANS.div._targetLeft);
				$$invalidate(11, ans_y = parseUxml.SMANS.div._targetTop);
			}
		}
	}

	function checkAnswer(event) {
		let result = movetarget(event, ans_h, ans_w, parseInt(itemAreaLeft), parseInt(itemAreaTop));
		$$invalidate(4, isUxmlTarget = true);
		$$invalidate(10, ans_x = result.left);
		$$invalidate(11, ans_y = result.top);
		$$invalidate(23, ansStatus = result.ans);
		if (editorState) showAns(ansStatus ? "Correct" : "Incorrect");
		onUserAnsChange(result);
	}

	// used in native for toggle
	function toggleSelectArea() {
		$$invalidate(16, scrollEnabled = scrollEnabled ? false : true);
	}

	// when remediation mode is on
	function setReview() {
		$$invalidate(9, targetView = "block");

		//isDotCreate = false;
		// if the module is imagehighlight then it draw the correct answer on the module using the function drawOnCanvas
		if (moduleArr[item_type] == "3") {
			let el = AH.find("#previewArea", "canvas");
			let pts = el.getAttribute("correctans");
			if (pts != "") pts = JSON.parse(pts);
			HotJS.drawOnCanvas(el, pts, "green");
		}

		// called the function unbind lab which basically show the draggable element in preview area if found which is found in case of spot an image
		HotJS.modeOnHot(1);

		// check the answer wether the answer is correct or not
		//checkAnswer();
		AH.select("#hptmain0", "css", { pointerEvents: "none" });
	}

	// when remediation mode is off
	function unsetReview() {
		$$invalidate(9, targetView = "none");

		// if the module is imagehighlight then it hide the correct answer ans show user ans on the module using the function drawOnCanvas
		if (moduleArr[item_type] == "3") {
			AH.find("#previewArea", "canvas", { action: "remove" });
			imageDraw("#previewArea", 0);

			var timer = setTimeout(
				function () {
					let el = AH.find("#previewArea", "canvas");

					// getting the value of the user ans
					let getAns = AH.select("#special_module_parse").value,
						// getting the user answer coordinates
						cans = getAns.substring(getAns.indexOf("{"), getAns.lastIndexOf("}") + 1);

					// parsing it into the JSON element
					if (cans != "") cans = JSON.parse(cans);

					// passed the points in the canvas
					HotJS.drawOnCanvas(el, cans, linecolor);

					clearTimeout(timer);
				},
				500
			);
		}

		// called the function bind lab which basically hide the draggable element in preview area if found which is found in case of spot an image
		HotJS.modeOnHot();

		AH.select("#hptmain0", "css", { pointerEvents: "auto" });
	}

	// for image draw
	function imageDraw(hid, review) {
		let imgObj = AH.find(hid, "#hptmain0");
		hid = imgObj;

		// let imgWidth  = imgObj.clientWidth;
		// let imgHeight = imgObj.clientHeight;
		let surface = new DooScribPlugin({
				target: imgObj,
				width: +state.imgwidth.replace("px", ""),
				height: +state.imgheight.replace("px", ""),
				correctans,
				cssClass: "drawSurface",
				penSize: 4,
				type: "imagehighlight",
				editable: !review ? true : false,
				onMove() {
					
				},
				onClick() {
					
				},
				onPaint(e) {
					// storeing the X and Y values
					xaxis.push(e.X);

					yaxis.push(e.Y);
				},
				onRelease(e) {
					onReleaseFunc(e, hid, review);
				}
			});

		linecolor = String(xml.match(/linecolor=\"([^\"]+)\"/gm));
		linecolor = linecolor.substring("11", linecolor.length - 1);

		//var res = AH.siblings(hid).find((_elm)=> _elm.matches('div') ).getAttribute('id');
		if (!review) {
			AH.listen("#previewArea", "click", "#reset", () => {
				surface.clearSurface();
				drawstr = "";
				count = 0;
				$$invalidate(14, userCorrect = "");
				AH.selectAll(AH.select(hid).children, "attr", { userans: "" });
			});
		}

		window.surface = surface;
	}

	// calls in key up / onrelase of mouse
	function onReleaseFunc(e, hid, review) {
		let userAnswers = "";
		let inNativeIsCorrect = false;

		// check for the review mode is on or off
		if (!review) {
			// if review mode is off
			drawstr = "";

			// getting the  value of the point 
			var coor = document.querySelector("#special_module_parse").value;

			coor = coor.substring(coor.indexOf("{"), coor.lastIndexOf("}") + 1);

			// getting the coordinates using the getCoordinate function
			if (coor != "") {
				coor = Object.keys(JSON.parse(coor)).length;
				drawstr = HotJS.getCoordinate(hid, xaxis, yaxis, coor);
			} else {
				drawstr = HotJS.getCoordinate(hid, xaxis, yaxis, count);
			}

			// for getting window height in case of native
			if (window.inNative) {
				window.getHeight && window.getHeight();
			}

			// for autograding
			window.ISSPECIALMODULEUSERXMLCHANGE = 1;

			// puuting the value in the textarea for saving the user ans
			AH.select("#special_module_user_xml", "val", drawstr);

			$$invalidate(14, userCorrect = drawstr);
			xaxis = [];
			yaxis = [];

			// for getting the correctans
			let pts = AH.find(hid, "canvas").getAttribute("correctans");

			// for getting the user ans
			let cans = AH.find(hid, "canvas").getAttribute("userans");

			// parsing both the json if they are not empty
			if (cans != "") cans = JSON.parse(cans);

			if (pts != "") pts = JSON.parse(pts);

			// comparing them with the function , it will return 1 if the answer is correct
			let flag = HotJS.compareDrawing(cans, pts, hid);

			let message = "Incorrect";

			// for setting the answer correct if flag > 0
			if (flag > 0) {
				inNativeIsCorrect = true;
				message = "Correct";
				$$invalidate(1, state.answerType3 = true, state);
				if (editorState) showAns("Correct");
			} else {
				inNativeIsCorrect = false;
				message = "Incorrect";
				$$invalidate(1, state.answerType3 = false, state);
			}

			if (editorState) showAns(message);
			userAnswers = AH.select("#special_module_user_xml").value;

			// @uc-abk: When user drawed canvas within the correct area : flag will 1
			flag > 0
			? AH.select("#answer").checked = true
			: AH.select("#answer").checked = false;

			if (window.inNative) window.postMessage(JSON.stringify({ inNativeIsCorrect, userAnswers }), "*");
		}
	}

	function loadModule(_type) {
		switch (_type) {
			case "1":
			case "2":
				{
					let data_userans = "";
					let data_userhtml = "";

					if (uxml) {
						let _uxml = XMLToJSON(uxml);
						window.test = uxml;

						// extract the userans and userhtml
						if (_uxml?.smans?.div) {
							data_userans = _uxml.smans.div["_data-userAns"];
							data_userhtml = _uxml.smans.div["_data-userHtml"];
						}
					}

					// return the div
					return `
						<div is id="hptmain0" totalCorrectAns=${totalCorrectAns}>
							<div 
								id="textID0" 
								type="${typeName}" 
								data-correcthtml="${correctHtml}" 
								data-correctans="${correctAnsStr} "
								data-userans="${data_userans}" 
								data-userhtml="${data_userhtml}" 
								class="drag-resize hotspotTxt" 
								style="max-width:${divWidth}; height:${divHeight}; line-height: 1.4;"
							>
							</div>
						</div>
					`;
				}
			default:
				return "<div>Incorrect question type</div>";
		}
	}

	const writable_props = ["xml", "uxml", "ansStatus", "isReview", "showAns", "editorState"];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<HotspotPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(24, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(25, uxml = $$props.uxml);
		if ("ansStatus" in $$props) $$invalidate(23, ansStatus = $$props.ansStatus);
		if ("isReview" in $$props) $$invalidate(26, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(27, showAns = $$props.showAns);
		if ("editorState" in $$props) $$invalidate(28, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		onMount,
		beforeUpdate,
		hotspotScript,
		DooScribPlugin,
		XMLToJSON,
		onUserAnsChange,
		AH,
		ItemHelper,
		movetarget,
		writable,
		xml,
		uxml,
		ansStatus,
		isReview,
		showAns,
		editorState,
		HotJS,
		parseXml,
		bgImgPath,
		alt,
		moduleArr,
		state,
		hdd,
		itemBorder,
		itemBorderColor,
		isUxmlTarget,
		itemAreaTop,
		itemAreaHeight,
		itemAreaWidth,
		itemAreaLeft,
		targetLeft,
		targetTop,
		targetView,
		ans_x,
		ans_y,
		ans_h,
		ans_w,
		type,
		img_url,
		manual_grade,
		onError,
		item_type,
		xmlHeight,
		xmlWidth,
		userCorrect,
		correctans,
		totalCorrectAns,
		scrollEnabled,
		linecolor,
		drawstr,
		count,
		xaxis,
		yaxis,
		unsubscribe,
		xmlParser,
		preRender,
		checkAnswer,
		onModalTouch,
		toggleSelectArea,
		setReview,
		unsetReview,
		imageDraw,
		onReleaseFunc,
		loadModule
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(24, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(25, uxml = $$props.uxml);
		if ("ansStatus" in $$props) $$invalidate(23, ansStatus = $$props.ansStatus);
		if ("isReview" in $$props) $$invalidate(26, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(27, showAns = $$props.showAns);
		if ("editorState" in $$props) $$invalidate(28, editorState = $$props.editorState);
		if ("parseXml" in $$props) parseXml = $$props.parseXml;
		if ("bgImgPath" in $$props) $$invalidate(17, bgImgPath = $$props.bgImgPath);
		if ("alt" in $$props) $$invalidate(0, alt = $$props.alt);
		if ("moduleArr" in $$props) $$invalidate(18, moduleArr = $$props.moduleArr);
		if ("state" in $$props) $$invalidate(1, state = $$props.state);
		if ("hdd" in $$props) hdd = $$props.hdd;
		if ("itemBorder" in $$props) $$invalidate(2, itemBorder = $$props.itemBorder);
		if ("itemBorderColor" in $$props) $$invalidate(3, itemBorderColor = $$props.itemBorderColor);
		if ("isUxmlTarget" in $$props) $$invalidate(4, isUxmlTarget = $$props.isUxmlTarget);
		if ("itemAreaTop" in $$props) $$invalidate(5, itemAreaTop = $$props.itemAreaTop);
		if ("itemAreaHeight" in $$props) $$invalidate(6, itemAreaHeight = $$props.itemAreaHeight);
		if ("itemAreaWidth" in $$props) $$invalidate(7, itemAreaWidth = $$props.itemAreaWidth);
		if ("itemAreaLeft" in $$props) $$invalidate(8, itemAreaLeft = $$props.itemAreaLeft);
		if ("targetLeft" in $$props) targetLeft = $$props.targetLeft;
		if ("targetTop" in $$props) targetTop = $$props.targetTop;
		if ("targetView" in $$props) $$invalidate(9, targetView = $$props.targetView);
		if ("ans_x" in $$props) $$invalidate(10, ans_x = $$props.ans_x);
		if ("ans_y" in $$props) $$invalidate(11, ans_y = $$props.ans_y);
		if ("ans_h" in $$props) ans_h = $$props.ans_h;
		if ("ans_w" in $$props) ans_w = $$props.ans_w;
		if ("type" in $$props) type = $$props.type;
		if ("img_url" in $$props) $$invalidate(12, img_url = $$props.img_url);
		if ("manual_grade" in $$props) manual_grade = $$props.manual_grade;
		if ("onError" in $$props) onError = $$props.onError;
		if ("item_type" in $$props) $$invalidate(13, item_type = $$props.item_type);
		if ("xmlHeight" in $$props) xmlHeight = $$props.xmlHeight;
		if ("xmlWidth" in $$props) xmlWidth = $$props.xmlWidth;
		if ("userCorrect" in $$props) $$invalidate(14, userCorrect = $$props.userCorrect);
		if ("correctans" in $$props) $$invalidate(35, correctans = $$props.correctans);
		if ("totalCorrectAns" in $$props) $$invalidate(15, totalCorrectAns = $$props.totalCorrectAns);
		if ("scrollEnabled" in $$props) $$invalidate(16, scrollEnabled = $$props.scrollEnabled);
		if ("linecolor" in $$props) linecolor = $$props.linecolor;
		if ("drawstr" in $$props) drawstr = $$props.drawstr;
		if ("count" in $$props) count = $$props.count;
		if ("xaxis" in $$props) xaxis = $$props.xaxis;
		if ("yaxis" in $$props) yaxis = $$props.yaxis;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview*/ 67108864) {
			 {
				if (isReview) {
					//targetView = "block";
					setReview();
				} else {
					//targetView = "none";
					unsetReview();
				}
			}
		}

		if ($$self.$$.dirty[0] & /*xml, totalCorrectAns*/ 16809984 | $$self.$$.dirty[1] & /*correctans*/ 16) {
			 if (xml) {
				// Here replacing the not standard cdata into the valid cdata format
				let myXml = xml.replace("<!--[CDATA[", "<![CDATA[").replace("]]-->", "]]>");

				// checking xml for if cdata is found or not 
				if (myXml.match(/<\!\[CDATA\[{|<\!--\[CDATA\[{/gm)) {
					// saving value b/w the {, } symbol
					$$invalidate(35, correctans = myXml.toString().match(/{(.*)}/gmi));

					$$invalidate(15, totalCorrectAns = correctans.toString().match(/},"\d+"/gm));
					$$invalidate(15, totalCorrectAns = totalCorrectAns ? totalCorrectAns.pop() : null);

					$$invalidate(15, totalCorrectAns = totalCorrectAns
					? totalCorrectAns.replace(/"|}|,/gm, "")
					: 1);

					myXml = myXml.replace(correctans, "");
					$$invalidate(35, correctans = correctans[0]);
				}

				parseXml = XMLToJSON(xml);
				xmlParser();
				preRender();
			}
		}
	};

	return [
		alt,
		state,
		itemBorder,
		itemBorderColor,
		isUxmlTarget,
		itemAreaTop,
		itemAreaHeight,
		itemAreaWidth,
		itemAreaLeft,
		targetView,
		ans_x,
		ans_y,
		img_url,
		item_type,
		userCorrect,
		totalCorrectAns,
		scrollEnabled,
		bgImgPath,
		moduleArr,
		checkAnswer,
		setReview,
		unsetReview,
		loadModule,
		ansStatus,
		xml,
		uxml,
		isReview,
		showAns,
		editorState
	];
}

class HotspotPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-1x7u5s5-style")) add_css();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 24,
				uxml: 25,
				ansStatus: 23,
				isReview: 26,
				showAns: 27,
				editorState: 28
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "HotspotPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[24] === undefined && !("xml" in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[25] === undefined && !("uxml" in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'uxml'");
		}

		if (/*ansStatus*/ ctx[23] === undefined && !("ansStatus" in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'ansStatus'");
		}

		if (/*isReview*/ ctx[26] === undefined && !("isReview" in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'isReview'");
		}

		if (/*showAns*/ ctx[27] === undefined && !("showAns" in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'showAns'");
		}

		if (/*editorState*/ ctx[28] === undefined && !("editorState" in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ansStatus() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ansStatus(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default HotspotPreview;
//# sourceMappingURL=HotspotPreview-d63c6f1a.js.map
