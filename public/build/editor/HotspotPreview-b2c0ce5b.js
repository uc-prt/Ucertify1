
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { L as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, J as append_styles, v as validate_slots, o as onMount, X as XMLToJSON, A as AH, a2 as onUserAnsChange, w as writable, e as element, f as space, j as attr_dev, k as add_location, n as insert_dev, p as append_dev, r as group_outros, a as transition_out, u as check_outros, t as transition_in, F as prop_dev, x as detach_dev, l as set_style, B as noop, c as create_component, m as mount_component, b as destroy_component, z as empty, h as text, U as src_url_equal, a5 as toggle_class, q as listen_dev, a6 as HtmlTag } from './main-7e107910.js';
import { I as ItemHelper } from './ItemHelper-34cfc2e3.js';
import { s as styleInject } from './style-inject.es-1c867377.js';

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
                    let _this  = event, getVal = '';
                    if (_this.classList.contains('selected')) {	
                        _this.setAttribute('data-userans', 0);
                        _this.classList.remove('selected');
                    } else {
                        _this.setAttribute('data-userans',1);
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
        let selector = JS.select(hid).children;
        for (let i = 0; i < selector.length; i++) {
            this.userAnsXML = this.checkChildAnswer(hid, selector[i], this.userAnsXML);
        }
        // JS.select(hid).children.forEach((_elm)=>{
        //     this.userAnsXML = this.checkChildAnswer(hid, _elm, this.userAnsXML);
        // });
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
        return {uXml: this.userAnsXML, ans: this.result};
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
                    // let data = JSON.parse(pElem.children);
                    
                    // let data = Object.values(pElem.children);
                    // console.log(data); 
                    JS.find(pElem,'p','all').forEach((_elm)=> {
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
        let selector = JS.select(hid).children;
        if (selector) {
            for (let i = 0; i < selector.length; i++) {
                this.showchilddragans(hid, selector[i], ansType, review);
            }
        }
        // JS.select(hid).children?.forEach?.((_elm)=> {
        //     this.showchilddragans(hid, _elm, ansType, review);
        // });
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
                            if (JS.select(hid+" p span").length) {
                                JS.select(hid+" p span").remove();
                            }
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
            this.drawstr = this.drawstr.substring(this.drawstr.indexOf('{'), this.drawstr.lastIndexOf('}')+1);
            this.drawstr = this.drawstr.slice(0, -1);
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
        let selector = JS.selectAll(hid+' p');
        for (var i=0; i < selector.length; i++ ) {
            let _elm = selector[i];
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
        }
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
        JS.find(this.elemId, '.hotArea0.hotArea', {action: 'css', actionData: {display: 'none'} });
        JS.find(this.elemId, '.hotSpotImg', {action: 'css', actionData: {pointerEvents: 'auto'} });
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
		        document.addEventListener('mouseup', this.clickUp.bind(this), true);
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

/* clsSMHotspot\libs\util.svelte generated by Svelte v3.40.2 */

function checkmodule(targetData, pointer_size) {
	let yourScore = 0;
	let ansDivHeight = targetData.ans_top + targetData.ans_h;
	let ansDivWidth = targetData.ans_left + targetData.ans_w;

	if (targetData.top + pointer_size + 4 > targetData.ans_top && targetData.top + parseInt(pointer_size / 2) < ansDivHeight && targetData.left + pointer_size > targetData.ans_left && targetData.left + parseInt(pointer_size / 2) < ansDivWidth) {
		yourScore = 1;
	}

	return yourScore;
}

function createUserAnsXML(targetTop, targetLeft) {
	return '<SMANS type="4"><div targetTop="' + parseInt(targetTop) + '" targetLeft="' + parseInt(targetLeft) + '" /></SMANS>';
}

function movetarget(e, ans_h, ans_w, ans_left, ans_top) {
	// let tObj = document.getElementById('target')[0];
	// let hObj = document.getElementById('hotArea')[0];
	let pointer_size = 13;

	let scoreFlag;
	let targetData;

	//debugger;
	targetData = {
		x: e && e.layerX,
		y: e && e.layerY,
		top: 0,
		left: 0,
		uXml: "",
		ans: false,
		ans_h,
		ans_w,
		ans_left,
		ans_top
	};

	if (e && e.which != 13) {
		if (e.layerX && e.layerY) {
			targetData.top = e.layerY - pointer_size;
			targetData.left = e.layerX - pointer_size;
		} else {
			targetData.top = e.offsetY - pointer_size;
			targetData.left = e.offsetX - pointer_size;
		}
	} else {
		targetData.top = 20 - pointer_size;
		targetData.left = 20 - pointer_size;
	}

	// checking answer
	scoreFlag = checkmodule(targetData, pointer_size);

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

var css_248z = "#hptmain .drag-resize{position:absolute;left:90px;top:50px;border:none;z-index:8;text-align:center;font-size:0;line-height:20px;background-color:rgba(244,255,71,.6)!important;box-shadow:0 0 1px #000 inset;cursor:move}.tools{position:absolute;right:5px;z-index:101}.tools .labs-btn{padding:2px 5px}.drag-resize .tools{top:-28px;right:-3px}.elemActive{background:rgba(244,255,71,.6)!important;opacity:1!important}#option-toolbar{margin-bottom:0}.controls{list-style:none;margin:0;padding:0}.controls li{display:inline;padding:11px;float:left;font-size:13px}.controls li:hover,.selected-option{cursor:pointer;background-color:#ccc!important}#hotspot{width:700px;padding:4px;border-top-right-radius:10px;border-top-left-radius:10px;text-align:left;background-color:#ccc}.hotspotTxt{background:#fff;word-wrap:break-word;padding:1em;min-height:180px;text-align:left;overflow-y:scroll;border:1px solid #ccc;font-family:\"open sans\",Helvetica,Arial,\"Times New Roman\",sans-serif;font-size:14px}.hotspotTxt p{float:left;margin-bottom:3px}.textClick{border:1px solid transparent;padding:2px 0;margin-right:2px;cursor:pointer;border-radius:2px;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none}.selecttext.selected,.textClick.selected,.textClick.selected:hover{background-color:#ff9;border:1px solid #8a7300;border-radius:2px}.textClick:hover{background-color:#fcfcd3;border-color:#8a7300}.show_correct{background-color:#e7f4e1!important;border-color:#62ae41!important}.show_incorrect{border-color:#da1919!important;background-color:#fbdddd!important}.selecttext{border:1px solid transparent;padding:3px 0;margin-right:2px;position:relative;margin-left:-1px;margin-right:-1px;border-radius:2px}.drawSurface{cursor:crosshair}.h{display:none}.textClick.selected:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #000;outline:0}.red{color:red}#hptmain0 tr td{border:0!important}";
styleInject(css_248z);

/* clsSMHotspot\HotspotPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1, console: console_1 } = globals;
const file = "clsSMHotspot\\HotspotPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-1mvfo84", "main.svelte-1mvfo84{text-align:center !important;padding:1em;max-width:240px;margin:0 auto;font-size:26px}.targetImg.svelte-1mvfo84{display:none;position:absolute;z-index:10;width:24px;height:24px;border-radius:50%;background:#fff;color:#1c3ad4}.showBlock.svelte-1mvfo84{display:block}@media(min-width: 640px){main.svelte-1mvfo84{max-width:none}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFByZXZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQWlyQkMsSUFBSSxlQUFDLENBQUMsQUFDTCxVQUFVLENBQUUsTUFBTSxDQUFDLFVBQVUsQ0FDN0IsT0FBTyxDQUFFLEdBQUcsQ0FDWixTQUFTLENBQUUsS0FBSyxDQUNoQixNQUFNLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FDZCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsVUFBVSxlQUFDLENBQUMsQUFDWCxPQUFPLENBQUcsSUFBSSxDQUNkLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxFQUFFLENBQ1gsS0FBSyxDQUFFLElBQUksQ0FDWCxPQUFPLElBQUksQ0FDWCxhQUFhLENBQUUsR0FBRyxDQUNsQixVQUFVLENBQUUsSUFBSSxDQUNoQixLQUFLLENBQUUsT0FBTyxBQUNmLENBQUMsQUFFRCxVQUFVLGVBQUMsQ0FBQyxBQUNYLE9BQU8sQ0FBRyxLQUFLLEFBQ2hCLENBQUMsQUFFRCxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFDLEFBQzFCLElBQUksZUFBQyxDQUFDLEFBQ0wsU0FBUyxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUNGLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiSG90c3BvdFByZXZpZXcuc3ZlbHRlIl19 */");
}

// (580:2) {:else}
function create_else_block_1(ctx) {
	let div;
	let button0;
	let t;
	let button1;

	const block = {
		c: function create() {
			div = element("div");
			button0 = element("button");
			t = space();
			button1 = element("button");
			attr_dev(button0, "tabindex", "0");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "h h-imp svelte_items_test");
			attr_dev(button0, "id", "set-review");
			add_location(button0, file, 581, 4, 19804);
			attr_dev(button1, "tabindex", "0");
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "h h-imp svelte_items_test");
			attr_dev(button1, "id", "unset-review");
			add_location(button1, file, 582, 4, 19904);
			attr_dev(div, "class", "h h-imp");
			attr_dev(div, "id", "review_buttons");
			add_location(div, file, 580, 3, 19757);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(div, t);
			append_dev(div, button1);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(580:2) {:else}",
		ctx
	});

	return block;
}

// (572:2) {#if moduleArr[item_type] == "1" || moduleArr[item_type] == "2"}
function create_if_block_3(ctx) {
	let itemhelper;
	let current;

	itemhelper = new ItemHelper({
			props: {
				handleReviewClick: /*handleReview*/ ctx[25],
				customReviewMode: /*customIsReview*/ ctx[1],
				reviewMode: /*isReview*/ ctx[0]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[22]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[23]);

	const block = {
		c: function create() {
			create_component(itemhelper.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(itemhelper, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const itemhelper_changes = {};
			if (dirty[0] & /*customIsReview*/ 2) itemhelper_changes.customReviewMode = /*customIsReview*/ ctx[1];
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
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
			destroy_component(itemhelper, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(572:2) {#if moduleArr[item_type] == \\\"1\\\" || moduleArr[item_type] == \\\"2\\\"}",
		ctx
	});

	return block;
}

// (674:3) {:else}
function create_else_block(ctx) {
	let html_tag;
	let raw_value = /*loadModule*/ ctx[24](/*moduleArr*/ ctx[20][/*item_type*/ ctx[16]]) + "";
	let html_anchor;

	const block = {
		c: function create() {
			html_tag = new HtmlTag();
			html_anchor = empty();
			html_tag.a = html_anchor;
		},
		m: function mount(target, anchor) {
			html_tag.m(raw_value, target, anchor);
			insert_dev(target, html_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*item_type*/ 65536 && raw_value !== (raw_value = /*loadModule*/ ctx[24](/*moduleArr*/ ctx[20][/*item_type*/ ctx[16]]) + "")) html_tag.p(raw_value);
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
		source: "(674:3) {:else}",
		ctx
	});

	return block;
}

// (636:41) 
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
	let if_block = /*scrollEnabled*/ ctx[18] && create_if_block_2(ctx);

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
			add_location(span0, file, 649, 7, 22104);
			attr_dev(span1, "class", "position-relative bottom1");
			add_location(span1, file, 650, 7, 22196);
			attr_dev(div0, "id", "reset");
			set_style(div0, "height", "27px");
			set_style(div0, "width", "90px");
			set_style(div0, "top", "2px");
			attr_dev(div0, "class", "reset btn btn-outline-primary position-relative btn-sm mt-sm2 mr-sm2 float-end");
			add_location(div0, file, 645, 6, 21922);
			set_style(div1, "height", "34px");

			set_style(div1, "width", window.inNative
			? window.innerWidth
			: /*state*/ ctx[4].imgwidth);

			set_style(div1, "background", "#d9e7fd");
			set_style(div1, "border-top", "2px solid #96bbf6");
			add_location(div1, file, 637, 5, 21713);
			attr_dev(div2, "id", "hptmain0");
			attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[2]);
			attr_dev(div2, "dd", div2_dd_value = /*state*/ ctx[4].imgwidth);
			set_style(div2, "width", /*state*/ ctx[4].imgwidth || '250px');
			set_style(div2, "height", /*state*/ ctx[4].imgheight || '600px');
			set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[19] + /*img_url*/ ctx[15]) + "')");
			set_style(div2, "background-repeat", "no-repeat");
			set_style(div2, "position", "relative");
			set_style(div2, "border", /*itemBorder*/ ctx[5] + "px solid " + /*itemBorderColor*/ ctx[6]);
			add_location(div2, file, 653, 5, 22282);
			attr_dev(center, "key", "imageHeight_3");
			add_location(center, file, 636, 4, 21678);
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
			if (dirty[0] & /*state*/ 16) {
				set_style(div1, "width", window.inNative
				? window.innerWidth
				: /*state*/ ctx[4].imgwidth);
			}

			if (dirty[0] & /*totalCorrectAns*/ 4) {
				attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[2]);
			}

			if (dirty[0] & /*state*/ 16 && div2_dd_value !== (div2_dd_value = /*state*/ ctx[4].imgwidth)) {
				attr_dev(div2, "dd", div2_dd_value);
			}

			if (dirty[0] & /*state*/ 16) {
				set_style(div2, "width", /*state*/ ctx[4].imgwidth || '250px');
			}

			if (dirty[0] & /*state*/ 16) {
				set_style(div2, "height", /*state*/ ctx[4].imgheight || '600px');
			}

			if (dirty[0] & /*img_url*/ 32768) {
				set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[19] + /*img_url*/ ctx[15]) + "')");
			}

			if (dirty[0] & /*itemBorder, itemBorderColor*/ 96) {
				set_style(div2, "border", /*itemBorder*/ ctx[5] + "px solid " + /*itemBorderColor*/ ctx[6]);
			}

			if (/*scrollEnabled*/ ctx[18]) {
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
		source: "(636:41) ",
		ctx
	});

	return block;
}

// (588:3) {#if moduleArr[item_type] == "4"}
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
	let t2;
	let span;
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
			set_style(img, "width", /*state*/ ctx[4].imgwidth);
			set_style(img, "height", /*state*/ ctx[4].imgheight);
			attr_dev(img, "class", "hotSpotImg");
			if (!src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[19] + /*img_url*/ ctx[15])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", /*alt*/ ctx[3]);
			add_location(img, file, 606, 10, 20750);
			attr_dev(div0, "id", "hotArea");
			attr_dev(div0, "class", "hotArea hotArea hotAreaPreview");
			set_style(div0, "display", /*targetView*/ ctx[12]);
			set_style(div0, "left", /*itemAreaLeft*/ ctx[11] + "px");
			set_style(div0, "top", /*itemAreaTop*/ ctx[8] + "px");
			set_style(div0, "height", /*itemAreaHeight*/ ctx[9]);
			set_style(div0, "width", /*itemAreaWidth*/ ctx[10]);
			add_location(div0, file, 615, 10, 21045);
			attr_dev(span, "id", "target");
			attr_dev(span, "class", "target targetImg icomoon-plus-circle-2 svelte-1mvfo84");
			set_style(span, "left", /*ans_x*/ ctx[13] + "px");
			set_style(span, "top", /*ans_y*/ ctx[14] + "px");
			toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[7]);
			add_location(span, file, 622, 10, 21321);
			attr_dev(div1, "id", "SM0");
			attr_dev(div1, "class", "SM position-relative m-0 p-0");

			attr_dev(div1, "style", div1_style_value = `
											position: relative;
											margin: 0px;
											padding: 0px;
											width: 100%;
											height: 100%;
											border: ${/*itemBorder*/ ctx[5]
			? /*itemBorder*/ ctx[5] + 'px solid'
			: ''};
											border-color: ${/*itemBorderColor*/ ctx[6]};
										`);

			add_location(div1, file, 593, 9, 20367);
			attr_dev(div2, "id", "SM0");
			attr_dev(div2, "class", "relative");
			add_location(div2, file, 592, 8, 20325);
			attr_dev(td, "class", "border");
			add_location(td, file, 591, 7, 20296);
			add_location(tr, file, 590, 6, 20283);
			add_location(tbody, file, 589, 5, 20268);
			attr_dev(table, "id", "hptmain0");
			attr_dev(table, "class", "smbase smhotspot border-0 h-auto w-auto uc-table no_overflow_wrapper");
			add_location(table, file, 588, 4, 20163);
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
				dispose = listen_dev(img, "click", /*checkAnswer*/ ctx[21], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 16) {
				set_style(img, "width", /*state*/ ctx[4].imgwidth);
			}

			if (dirty[0] & /*state*/ 16) {
				set_style(img, "height", /*state*/ ctx[4].imgheight);
			}

			if (dirty[0] & /*img_url*/ 32768 && !src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[19] + /*img_url*/ ctx[15])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*alt*/ 8) {
				attr_dev(img, "alt", /*alt*/ ctx[3]);
			}

			if (dirty[0] & /*targetView*/ 4096) {
				set_style(div0, "display", /*targetView*/ ctx[12]);
			}

			if (dirty[0] & /*itemAreaLeft*/ 2048) {
				set_style(div0, "left", /*itemAreaLeft*/ ctx[11] + "px");
			}

			if (dirty[0] & /*itemAreaTop*/ 256) {
				set_style(div0, "top", /*itemAreaTop*/ ctx[8] + "px");
			}

			if (dirty[0] & /*itemAreaHeight*/ 512) {
				set_style(div0, "height", /*itemAreaHeight*/ ctx[9]);
			}

			if (dirty[0] & /*itemAreaWidth*/ 1024) {
				set_style(div0, "width", /*itemAreaWidth*/ ctx[10]);
			}

			if (dirty[0] & /*ans_x*/ 8192) {
				set_style(span, "left", /*ans_x*/ ctx[13] + "px");
			}

			if (dirty[0] & /*ans_y*/ 16384) {
				set_style(span, "top", /*ans_y*/ ctx[14] + "px");
			}

			if (dirty[0] & /*isUxmlTarget*/ 128) {
				toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[7]);
			}

			if (dirty[0] & /*itemBorder, itemBorderColor*/ 96 && div1_style_value !== (div1_style_value = `
											position: relative;
											margin: 0px;
											padding: 0px;
											width: 100%;
											height: 100%;
											border: ${/*itemBorder*/ ctx[5]
			? /*itemBorder*/ ctx[5] + 'px solid'
			: ''};
											border-color: ${/*itemBorderColor*/ ctx[6]};
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
		source: "(588:3) {#if moduleArr[item_type] == \\\"4\\\"}",
		ctx
	});

	return block;
}

// (667:5) {#if scrollEnabled}
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
			add_location(div, file, 667, 6, 22719);
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
		source: "(667:5) {#if scrollEnabled}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let center;
	let current_block_type_index;
	let if_block0;
	let t0;
	let div;
	let t1;
	let input;
	let current;
	const if_block_creators = [create_if_block_3, create_else_block_1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*moduleArr*/ ctx[20][/*item_type*/ ctx[16]] == "1" || /*moduleArr*/ ctx[20][/*item_type*/ ctx[16]] == "2") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*moduleArr*/ ctx[20][/*item_type*/ ctx[16]] == "4") return create_if_block;
		if (/*moduleArr*/ ctx[20][/*item_type*/ ctx[16]] == "3") return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block1 = current_block_type(ctx);

	const block = {
		c: function create() {
			main = element("main");
			center = element("center");
			if_block0.c();
			t0 = space();
			div = element("div");
			if_block1.c();
			t1 = space();
			input = element("input");
			attr_dev(div, "id", "previewArea");
			attr_dev(div, "class", "relative");
			add_location(div, file, 585, 2, 20026);
			add_location(center, file, 570, 1, 19469);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "special_module_parse");
			attr_dev(input, "name", "special_module_parse");
			attr_dev(input, "userans", "");
			input.value = /*userCorrect*/ ctx[17];
			add_location(input, file, 678, 1, 22979);
			attr_dev(main, "class", "pt-0 svelte-1mvfo84");
			add_location(main, file, 569, 0, 19447);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, center);
			if_blocks[current_block_type_index].m(center, null);
			append_dev(center, t0);
			append_dev(center, div);
			if_block1.m(div, null);
			append_dev(main, t1);
			append_dev(main, input);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block0 = if_blocks[current_block_type_index];

				if (!if_block0) {
					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block0.c();
				} else {
					if_block0.p(ctx, dirty);
				}

				transition_in(if_block0, 1);
				if_block0.m(center, t0);
			}

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div, null);
				}
			}

			if (!current || dirty[0] & /*userCorrect*/ 131072) {
				prop_dev(input, "value", /*userCorrect*/ ctx[17]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if_blocks[current_block_type_index].d();
			if_block1.d();
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
	validate_slots('HotspotPreview', slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { ansStatus } = $$props;
	let { isReview } = $$props;
	let { showAns } = $$props;
	let { editorState } = $$props;
	let customIsReview = isReview;
	const HotJS = new hotspotScript();
	let parseXml = "";
	let answerStatus;
	let ansDisable = 0;
	let bgImgPath = '//s3.amazonaws.com/jigyaasa_content_static/';
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
	let itemAreaTop = '';
	let itemAreaHeight = '';
	let itemAreaWidth = '';
	let itemAreaLeft = '';
	let targetView = "none";
	let ans_x = 0;
	let ans_y = 0;
	let ans_h = 0;
	let ans_w = 0;
	let type = "";
	let img_url = "";
	let item_type = "";
	let xmlHeight = 0;
	let xmlWidth = 0;
	let xmlBorderColor = '';
	let xmlBorderWidth = '0';
	let userCorrect = "";
	let correctans = "";
	let totalCorrectAns;
	let scrollEnabled = false;
	let linecolor = "black";
	let drawstr = "";
	let count = 0;
	let xaxis = [];
	let yaxis = [];
	let divHeight = 0;
	let divWidth = 0;
	var typeName = 'textclick';
	var correctAnsStr = '';
	var correctHtml = '';

	const unsubscribe = items => {
		$$invalidate(4, state = items);
	};

	onMount(() => {
		parseXml = XMLToJSON(xml);
		xmlBorderWidth = parseXml['smxml']['hotBorder'];
		xmlBorderColor = parseXml['smxml']['hotBorderColor'];
		xmlParser();
		preRender();
		HotJS.readyThis('hptmain0', isReview);

		if (isReview) {
			HotJS.modeOnHot(1);
		} else {
			HotJS.modeOnHot();
		}

		AH.listen('#previewArea', 'keydown', '#im0', function (_this, e) {
			var image_elem = AH.select('#im0').getBoundingClientRect();
			var ans_size = 24;

			switch (e.which) {
				case 37:
					$$invalidate(13, ans_x = parseInt(ans_x) - 2);
					if (ans_x < 1) {
						$$invalidate(13, ans_x = 1);
					}
					break;
				case 38:
					$$invalidate(14, ans_y = parseInt(ans_y) - 2);
					if (ans_y < 1) {
						$$invalidate(14, ans_y = 1);
					}
					break;
				case 39:
					$$invalidate(13, ans_x = parseInt(ans_x) + 2);
					if (ans_x + ans_size > image_elem.width) {
						$$invalidate(13, ans_x = image_elem.width - ans_size);
					}
					break;
				case 40:
					$$invalidate(14, ans_y = parseInt(ans_y) + 2);
					if (ans_y + ans_size > image_elem.height) {
						$$invalidate(14, ans_y = image_elem.height - ans_size);
					}
					break;
				case 13:
					//Press Enter key Set Answer
					checkAnswer();
					break;
			}

			console.log('ans_x', ans_x);
			console.log('ans_y', ans_y);
		});

		AH.listen('#previewArea', 'click', '.textClick', function () {
			checkAnswer();
		});

		AH.listen('#previewArea', 'click', '[type="textselect"]', function () {
			checkAnswer();
		});

		AH.listen("#review_buttons", 'click', "#set-review", function () {
			setReview();
		});

		AH.listen("#review_buttons", "click", "#unset-review", function () {
			unsetReview();
		});
	});

	function xmlParser() {
		$$invalidate(16, item_type = parseXml['smxml']['div']['_type']);
		xmlHeight = parseXml['smxml']['_height'];
		xmlWidth = parseXml['smxml']['_width'];

		if (item_type == undefined || item_type == "") {
			$$invalidate(16, item_type = parseXml['smxml']['_name'].toLowerCase());
		}

		typeName = item_type;
		$$invalidate(15, img_url = parseXml['smxml']['_bgimg']);

		switch (moduleArr[item_type]) {
			case "1":
				//getting the width and height
				divHeight = parseXml.smxml._height + 'px';
				divWidth = parseXml.smxml._width + 'px';
				// for parsing the xmlpreviewArea
				parseTextClick(parseXml.smxml.div.__cdata);
				AH.select(AH.parent('#textID0'), 'show', 'block');
				AH.selectAll('#drawPreview,table[id="hptmain2"]', 'hide');
				break;
			case "2":
				// in case of text select module
				if (!isNaN(parseXml.smxml._height)) {
					parseXml.smxml._height = parseXml.smxml._height + 'px';
				}
				divHeight = parseXml.smxml._height;
				divWidth = parseXml.smxml._width + 'px';
				// for parsing the xml
				parseTextSelect(parseXml.smxml.div.__cdata);
				AH.select(AH.parent('#textID0'), 'show', 'block');
				AH.selectAll('#drawPreview,table[id="hptmain2"]', 'hide');
				break;
			case "3":
				{
					// In case of image highlight 
					//bgImg = parseXml.smxml._bgimg;
					//var image = document.getElementById('hiddenImage');
					let image = new Image();

					image.addEventListener(
						'load',
						function (event) {
							$$invalidate(
								4,
								state.imgheight = parseXml.smxml._height > this.height
								? parseXml.smxml._height + 'px'
								: this.height + 'px',
								state
							);

							$$invalidate(
								4,
								state.imgwidth = parseXml.smxml._width > this.width
								? parseXml.smxml._width + 'px'
								: this.width + 'px',
								state
							);

							$$invalidate(5, itemBorder = parseXml.smxml.div._border);
							$$invalidate(6, itemBorderColor = parseXml.smxml.div._bordercolor);

							AH.find('#hptdraw0', 'canvas', {
								action: 'attr',
								actionData: {
									height: state.imgheight,
									width: state.imgwidth
								}
							});

							AH.empty('#textID0');
							unsetReview();
						},
						false
					);

					image.setAttribute('src', bgImgPath + parseXml.smxml._bgimg);
				}
				//imgUrl = "url('https:" + bgImgPath + parseXml.smxml._bgimg + "')";
				//this.flagUpdate = false;
				break;
			case "4":
				{
					// in case of hotspot (spot an image)
					// setting backgroundImage , alt, width, height, left , top ,border, bordercolor on the basis of xml
					$$invalidate(15, img_url = parseXml.smxml._bgimg); // used for set the background image of the Draw highlighted module

					$$invalidate(3, alt = parseXml.smxml._alt);
					$$invalidate(14, ans_y = parseFloat(parseXml['smxml']['div']['_top']));
					$$invalidate(13, ans_x = parseFloat(parseXml['smxml']['div']['_left']) + 13);
					ans_h = parseFloat(parseXml['smxml']['div']['_height']);
					ans_w = parseFloat(parseXml['smxml']['div']['_width']);
					$$invalidate(3, alt = parseXml['smxml']['div']['_alt']);
					type = parseXml['smxml']['div']['type'];
					$$invalidate(5, itemBorder = parseXml.smxml.div._border);
					$$invalidate(6, itemBorderColor = parseXml.smxml.div._bordercolor);
					$$invalidate(10, itemAreaWidth = parseXml.smxml.div._width + 'px');
					$$invalidate(9, itemAreaHeight = parseXml.smxml.div._height + 'px');
					$$invalidate(11, itemAreaLeft = parseInt(parseXml.smxml.div._left) + 4);
					$$invalidate(8, itemAreaTop = parseInt(parseXml.smxml.div._top) + 2);
					let image = new Image();

					image.onload = function () {
						let bgImgHeight = this.height + 'px';
						let bgImgWidth = this.width + 'px';

						$$invalidate(
							4,
							state.imgheight = parseXml.smxml.div._imgheight
							? parseXml.smxml.div._imgheight + 'px'
							: "auto !important",
							state
						);

						$$invalidate(
							4,
							state.imgwidth = parseXml.smxml.div._imgwidth
							? parseXml.smxml.div._imgwidth + 'px'
							: "auto !important",
							state
						);

						AH.select('#hptmain0', 'css', { height: bgImgHeight, width: bgImgWidth });
					};

					image.src = bgImgPath + parseXml.smxml._bgimg;
				}
				break;
		}
	}

	function preRender() {
		if (isReview) {
			$$invalidate(12, targetView = "block");
		}

		var image = new Image();

		image.onload = function () {
			if (moduleArr[item_type] == "3") {
				$$invalidate(
					4,
					state.imgheight = parseXml.smxml._height > this.height
					? parseXml.smxml._height + 'px'
					: this.height + 'px',
					state
				);

				$$invalidate(
					4,
					state.imgwidth = parseXml.smxml._width > this.width
					? parseXml.smxml._width + 'px'
					: this.width + 'px',
					state
				);
			} else {
				$$invalidate(
					4,
					state.imgheight = parseXml.smxml.div._imgheight
					? parseXml.smxml.div._imgheight + 'px'
					: "auto !important",
					state
				);

				$$invalidate(
					4,
					state.imgwidth = parseXml.smxml.div._imgwidth
					? parseXml.smxml.div._imgwidth + 'px'
					: "auto !important",
					state
				);
			}
		};

		if (img_url) image.src = bgImgPath + img_url;

		if (uxml) {
			$$invalidate(17, userCorrect = uxml);
			let parseUxml = XMLToJSON(uxml);

			if (parseUxml.SMANS && parseUxml.SMANS.div) {
				$$invalidate(7, isUxmlTarget = true);
				$$invalidate(13, ans_x = parseUxml.SMANS.div._targetLeft);
				$$invalidate(14, ans_y = parseUxml.SMANS.div._targetTop);
			}
		}
	}

	function checkAnswer(event) {
		let result = {};

		if (typeName == 'textclick' || typeName == 'textselect') {
			result = HotJS.check_Ans('#previewArea #hptmain0');
			$$invalidate(31, answerStatus = result.ans);
		} else {
			result = movetarget(event, ans_h, ans_w, parseInt(itemAreaLeft), parseInt(itemAreaTop));
			$$invalidate(7, isUxmlTarget = true);
			$$invalidate(13, ans_x = result.left);
			$$invalidate(14, ans_y = result.top);
			$$invalidate(26, ansStatus = result.ans);
			$$invalidate(31, answerStatus = ansStatus);
			if (editorState) showAns(ansStatus ? "Correct" : "Incorrect");
		}

		onUserAnsChange(result);
	}

	// used in native for toggle
	function toggleSelectArea() {
		$$invalidate(18, scrollEnabled = scrollEnabled ? false : true);
	}

	// when remediation mode is on
	function setReview() {
		$$invalidate(0, isReview = true);
		$$invalidate(12, targetView = "block");

		//isDotCreate = false;
		// if the module is imagehighlight then it draw the correct answer on the module using the function drawOnCanvas
		if (moduleArr[item_type] == "3") {
			let el = AH.find('#previewArea', 'canvas');
			let pts = el.getAttribute('correctans');
			if (pts != '') pts = JSON.parse(pts);
			HotJS.drawOnCanvas(el, pts, 'green');
		}

		// called the function unbind lab which basically show the draggable element in preview area if found which is found in case of spot an image
		HotJS.modeOnHot(1);

		// check the answer wether the answer is correct or not
		//checkAnswer();
		AH.select("#hptmain0", 'css', { pointerEvents: "none" });
	}

	// when remediation mode is off
	function unsetReview() {
		$$invalidate(0, isReview = false);
		$$invalidate(12, targetView = "none");

		// if the module is imagehighlight then it hide the correct answer ans show user ans on the module using the function drawOnCanvas
		if (moduleArr[item_type] == "3") {
			AH.find('#previewArea', 'canvas', { action: 'remove' });

			//imageDraw('#previewArea', 0);
			var timer = setTimeout(
				function () {
					imageDraw('#previewArea', 0);
					let el = AH.find('#previewArea', 'canvas');

					// getting the value of the user ans
					let getAns = AH.select('#special_module_parse').value,
						// getting the user answer coordinates
						cans = getAns.substring(getAns.indexOf('{'), getAns.lastIndexOf('}') + 1);

					// parsing it into the JSON element
					if (cans != '') cans = JSON.parse(cans);

					// passed the points in the canvas
					HotJS.drawOnCanvas(el, cans, linecolor);

					clearTimeout(timer);
				},
				500
			);
		}

		// called the function bind lab which basically hide the draggable element in preview area if found which is found in case of spot an image
		HotJS.modeOnHot();

		AH.select("#hptmain0", 'css', { pointerEvents: "auto" });
	}

	// for image draw
	function imageDraw(hid, review) {
		let imgObj = AH.find(hid, '#hptmain0');
		hid = imgObj;

		// let imgWidth  = imgObj.clientWidth;
		// let imgHeight = imgObj.clientHeight;
		let surface = new DooScribPlugin({
				target: imgObj,
				width: +state.imgwidth.replace('px', ''),
				height: +state.imgheight.replace('px', ''),
				correctans,
				cssClass: 'drawSurface',
				penSize: 4,
				type: 'imagehighlight',
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
			AH.listen('#previewArea', 'click', '#reset', () => {
				surface.clearSurface();
				drawstr = '';
				count = 0;
				$$invalidate(17, userCorrect = "");
				AH.selectAll(AH.select(hid).children, 'attr', { userans: '' });
				$$invalidate(31, answerStatus = false);
			});
		}

		window.surface = surface;
	}

	// calls in key up / onrelase of mouse
	function onReleaseFunc(e, hid, review) {
		let userAnswers = '';
		let inNativeIsCorrect = false;

		// check for the review mode is on or off
		if (!review) {
			// if review mode is off
			drawstr = '';

			// getting the  value of the point 
			var coor = document.querySelector('#special_module_parse').value;

			coor = coor.substring(coor.indexOf('{'), coor.lastIndexOf('}') + 1);

			// getting the coordinates using the getCoordinate function
			if (coor != '') {
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
			AH.select("#special_module_user_xml").value = drawstr;

			$$invalidate(17, userCorrect = drawstr);
			xaxis = [];
			yaxis = [];

			// for getting the correctans
			let pts = AH.find(hid, 'canvas').getAttribute('correctans');

			// for getting the user ans
			let cans = AH.find(hid, 'canvas').getAttribute('userans');

			// parsing both the json if they are not empty
			if (cans != '') cans = JSON.parse(cans);

			if (pts != '') pts = JSON.parse(pts);

			// comparing them with the function , it will return 1 if the answer is correct
			let flag = HotJS.compareDrawing(cans, pts, hid);

			let message = "Incorrect";

			// for setting the answer correct if flag > 0
			if (flag > 0) {
				inNativeIsCorrect = true;
				message = "Correct";
				$$invalidate(4, state.answerType3 = true, state);
				if (editorState) showAns("Correct");
			} else {
				inNativeIsCorrect = false;
				message = "Incorrect";
				$$invalidate(4, state.answerType3 = false, state);
			}

			if (editorState) showAns(message);
			userAnswers = AH.select('#special_module_user_xml').value;
			flag = flag > 0 ? true : false;
			$$invalidate(31, answerStatus = flag);
			var result = { 'ans': flag, 'uXml': userAnswers };
			onUserAnsChange(result);

			// @uc-abk: When user drawed canvas within the correct area : flag will 1
			flag > 0
			? AH.select("#answer").checked = true
			: AH.select("#answer").checked = false;

			if (window.inNative) window.postMessage(JSON.stringify({ inNativeIsCorrect, userAnswers }), "*");
		}
	}

	function parseTextClick(cdata) {
		var cdataStr = '';

		// get the correct answer in correctans
		var correctans = cdata.match(/%{(.*?)}%/gm);

		if (correctans) {
			$$invalidate(2, totalCorrectAns = correctans.length);

			for (var i = 0; i < correctans.length; i++) {
				// replacing the space with <uc:space> and then replacing the correctans with it
				correctAnsStr = correctans[i].replace(/\s+/gm, '<uc:space>');

				cdata = cdata.replace(correctans[i], correctAnsStr);
			}
		}

		correctAnsStr = '';
		cdata = cdata.split(' ');

		for (var i = 0; i < cdata.length; i++) {
			//if the data is correct answer
			if (cdata[i].match(/%{|%}/gm)) {
				// for setting the data-correctans 1 if that value is correct
				cdata[i] = cdata[i].replace(/<uc:space>/gm, ' ').replace(/%{|}%/gm, '');

				cdataStr += '<p class="textClick" data-index="' + i + '" data-userans="0" data-correctans="1">' + cdata[i] + '</p>';
				correctAnsStr += cdata[i] + '|';
			} else {
				// for setting the data-correctans 0 if that value is correct
				cdataStr += '<p class="textClick" data-index="' + i + '" data-userans="0" data-correctans="0">' + cdata[i] + '</p>';
			}
		}

		correctAnsStr = correctAnsStr.replace(/\|$/gm, '');

		// showing the text in the preview area 	
		AH.select(' #previewArea  #textID0').innerHTML = cdataStr;
	}

	function parseTextSelect(cdata) {
		correctAnsStr = '';

		// store the correct answer in correct ans 
		var correctans = cdata.match(/%{(.*?)}%/gm);

		// if exists
		if (correctans) {
			// storing it the correct ans in correctAnsStr seperted by | 
			for (var index_no = 0; index_no < correctans.length; index_no += 1) {
				correctAnsStr += correctans[index_no].replace(/%{|}%/gm, '') + '|';
			}

			// replace the symbol with the span
			correctHtml = cdata.replace(/%{/gm, '<span class="selecttext selected">').replace(/}%/gm, '<span>');

			$$invalidate(2, totalCorrectAns = correctans.length);

			// removing last pipe symbol in the correctAnsStr
			correctAnsStr = correctAnsStr.replace(/\|$/gm, '');
		}

		// removing the symbol from the cdata
		var showdata = cdata.replace(/%{|}%/gm, '');

		var timer = setTimeout(
			(function () {
				// show the text in the html
				AH.select(' #previewArea  #textID0').innerHTML = showdata;

				clearTimeout(timer);
			}).bind(self),
			100
		);
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
							data_userans = _uxml.smans.div['_data-userAns'];
							data_userhtml = _uxml.smans.div['_data-userHtml'];
						}
					}

					// return the div
					return `
						<div is id="hptmain0" totalCorrectAns=${totalCorrectAns}>
							<div 
								id="textID0" 
								type="${typeName}" 
								data-correcthtml="${correctHtml}" 
								data-correctans="${correctAnsStr}"
								data-userans="${data_userans}" 
								data-userhtml="${data_userhtml}" 
								class="drag-resize hotspotTxt" 
								style="max-width:${divWidth}; height:${divHeight}; line-height: 1.4; font-size:17px!important;"
							>
							</div>
						</div>
					`;
				}
			default:
				return "<div>Incorrect question type</div>";
		}
	}

	//To handle review toggle
	function handleReview(mode, event) {
		if (mode == 'c') {
			HotJS.showansdrag('#hptmain0', 'c', 1);
		} else {
			HotJS.showansdrag('#hptmain0', 'u', 1);
		}
	}

	const writable_props = ['xml', 'uxml', 'ansStatus', 'isReview', 'showAns', 'editorState'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<HotspotPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(27, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(28, uxml = $$props.uxml);
		if ('ansStatus' in $$props) $$invalidate(26, ansStatus = $$props.ansStatus);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('showAns' in $$props) $$invalidate(29, showAns = $$props.showAns);
		if ('editorState' in $$props) $$invalidate(30, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		onMount,
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
		customIsReview,
		HotJS,
		parseXml,
		answerStatus,
		ansDisable,
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
		targetView,
		ans_x,
		ans_y,
		ans_h,
		ans_w,
		type,
		img_url,
		item_type,
		xmlHeight,
		xmlWidth,
		xmlBorderColor,
		xmlBorderWidth,
		userCorrect,
		correctans,
		totalCorrectAns,
		scrollEnabled,
		linecolor,
		drawstr,
		count,
		xaxis,
		yaxis,
		divHeight,
		divWidth,
		typeName,
		correctAnsStr,
		correctHtml,
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
		parseTextClick,
		parseTextSelect,
		loadModule,
		handleReview
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(27, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(28, uxml = $$props.uxml);
		if ('ansStatus' in $$props) $$invalidate(26, ansStatus = $$props.ansStatus);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('showAns' in $$props) $$invalidate(29, showAns = $$props.showAns);
		if ('editorState' in $$props) $$invalidate(30, editorState = $$props.editorState);
		if ('customIsReview' in $$props) $$invalidate(1, customIsReview = $$props.customIsReview);
		if ('parseXml' in $$props) parseXml = $$props.parseXml;
		if ('answerStatus' in $$props) $$invalidate(31, answerStatus = $$props.answerStatus);
		if ('ansDisable' in $$props) $$invalidate(32, ansDisable = $$props.ansDisable);
		if ('bgImgPath' in $$props) $$invalidate(19, bgImgPath = $$props.bgImgPath);
		if ('alt' in $$props) $$invalidate(3, alt = $$props.alt);
		if ('moduleArr' in $$props) $$invalidate(20, moduleArr = $$props.moduleArr);
		if ('state' in $$props) $$invalidate(4, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
		if ('itemBorder' in $$props) $$invalidate(5, itemBorder = $$props.itemBorder);
		if ('itemBorderColor' in $$props) $$invalidate(6, itemBorderColor = $$props.itemBorderColor);
		if ('isUxmlTarget' in $$props) $$invalidate(7, isUxmlTarget = $$props.isUxmlTarget);
		if ('itemAreaTop' in $$props) $$invalidate(8, itemAreaTop = $$props.itemAreaTop);
		if ('itemAreaHeight' in $$props) $$invalidate(9, itemAreaHeight = $$props.itemAreaHeight);
		if ('itemAreaWidth' in $$props) $$invalidate(10, itemAreaWidth = $$props.itemAreaWidth);
		if ('itemAreaLeft' in $$props) $$invalidate(11, itemAreaLeft = $$props.itemAreaLeft);
		if ('targetView' in $$props) $$invalidate(12, targetView = $$props.targetView);
		if ('ans_x' in $$props) $$invalidate(13, ans_x = $$props.ans_x);
		if ('ans_y' in $$props) $$invalidate(14, ans_y = $$props.ans_y);
		if ('ans_h' in $$props) ans_h = $$props.ans_h;
		if ('ans_w' in $$props) ans_w = $$props.ans_w;
		if ('type' in $$props) type = $$props.type;
		if ('img_url' in $$props) $$invalidate(15, img_url = $$props.img_url);
		if ('item_type' in $$props) $$invalidate(16, item_type = $$props.item_type);
		if ('xmlHeight' in $$props) xmlHeight = $$props.xmlHeight;
		if ('xmlWidth' in $$props) xmlWidth = $$props.xmlWidth;
		if ('xmlBorderColor' in $$props) xmlBorderColor = $$props.xmlBorderColor;
		if ('xmlBorderWidth' in $$props) xmlBorderWidth = $$props.xmlBorderWidth;
		if ('userCorrect' in $$props) $$invalidate(17, userCorrect = $$props.userCorrect);
		if ('correctans' in $$props) $$invalidate(33, correctans = $$props.correctans);
		if ('totalCorrectAns' in $$props) $$invalidate(2, totalCorrectAns = $$props.totalCorrectAns);
		if ('scrollEnabled' in $$props) $$invalidate(18, scrollEnabled = $$props.scrollEnabled);
		if ('linecolor' in $$props) linecolor = $$props.linecolor;
		if ('drawstr' in $$props) drawstr = $$props.drawstr;
		if ('count' in $$props) count = $$props.count;
		if ('xaxis' in $$props) xaxis = $$props.xaxis;
		if ('yaxis' in $$props) yaxis = $$props.yaxis;
		if ('divHeight' in $$props) divHeight = $$props.divHeight;
		if ('divWidth' in $$props) divWidth = $$props.divWidth;
		if ('typeName' in $$props) typeName = $$props.typeName;
		if ('correctAnsStr' in $$props) correctAnsStr = $$props.correctAnsStr;
		if ('correctHtml' in $$props) correctHtml = $$props.correctHtml;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview, customIsReview, editorState, showAns*/ 1610612739 | $$self.$$.dirty[1] & /*ansDisable, answerStatus*/ 3) {
			 {
				if (isReview != customIsReview) {
					if (isReview) {
						//targetView = "block";
						setReview();

						if (editorState && ansDisable == 0) {
							showAns(answerStatus ? "Correct" : "Incorrect");
							$$invalidate(32, ansDisable = 1);
						}
					} else {
						//targetView = "none";
						$$invalidate(32, ansDisable = 0);

						unsetReview();
					}

					$$invalidate(1, customIsReview = isReview);
				}
			}
		}

		if ($$self.$$.dirty[0] & /*xml, totalCorrectAns*/ 134217732 | $$self.$$.dirty[1] & /*correctans*/ 4) {
			 if (xml) {
				// Here replacing the not standard cdata into the valid cdata format
				let myXml = xml.replace("<!--[CDATA[", "<![CDATA[").replace("]]-->", "]]>");

				// checking xml for if cdata is found or not 
				if (myXml.match(/<\!\[CDATA\[{|<\!--\[CDATA\[{/gm)) {
					// saving value b/w the {, } symbol
					$$invalidate(33, correctans = myXml.toString().match(/{(.*)}/gmi));

					$$invalidate(2, totalCorrectAns = correctans.toString().match(/},"\d+"/gm));
					$$invalidate(2, totalCorrectAns = totalCorrectAns ? totalCorrectAns.pop() : null);

					$$invalidate(2, totalCorrectAns = totalCorrectAns
					? totalCorrectAns.replace(/"|}|,/gm, "")
					: 1);

					myXml = myXml.replace(correctans, "");
					$$invalidate(33, correctans = correctans[0]);
				}

				parseXml = XMLToJSON(xml);
				xmlParser();
				preRender();
			}
		}
	};

	return [
		isReview,
		customIsReview,
		totalCorrectAns,
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
		scrollEnabled,
		bgImgPath,
		moduleArr,
		checkAnswer,
		setReview,
		unsetReview,
		loadModule,
		handleReview,
		ansStatus,
		xml,
		uxml,
		showAns,
		editorState,
		answerStatus,
		ansDisable,
		correctans
	];
}

class HotspotPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 27,
				uxml: 28,
				ansStatus: 26,
				isReview: 0,
				showAns: 29,
				editorState: 30
			},
			add_css,
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

		if (/*xml*/ ctx[27] === undefined && !('xml' in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[28] === undefined && !('uxml' in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'uxml'");
		}

		if (/*ansStatus*/ ctx[26] === undefined && !('ansStatus' in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'ansStatus'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'isReview'");
		}

		if (/*showAns*/ ctx[29] === undefined && !('showAns' in props)) {
			console_1.warn("<HotspotPreview> was created without expected prop 'showAns'");
		}

		if (/*editorState*/ ctx[30] === undefined && !('editorState' in props)) {
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
//# sourceMappingURL=HotspotPreview-b2c0ce5b.js.map
