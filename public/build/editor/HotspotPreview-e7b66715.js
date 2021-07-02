
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, X as XMLToJSON, A as AH, _ as onUserAnsChange, L as beforeUpdate, w as writable, c as create_component, f as space, j as attr_dev, k as add_location, n as insert_dev, m as mount_component, G as prop_dev, t as transition_in, a as transition_out, x as detach_dev, b as destroy_component, l as set_style, z as empty, h as text, a1 as toggle_class, q as listen_dev, a2 as HtmlTag } from './main-9d98459d.js';
import { I as ItemHelper } from './ItemHelper-f6a7dcd6.js';

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
        return {uxml: this.userAnsXML, status: this.result};
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
	style.id = "svelte-1m52s8g-style";
	style.textContent = "main.svelte-1m52s8g{text-align:center !important;padding:1em;max-width:240px;margin:0 auto;font-size:26px}.targetImg.svelte-1m52s8g{display:none;position:absolute;z-index:10;width:26px;height:26px;border-radius:50%;background:#fff;color:#1c3ad4}.showBlock.svelte-1m52s8g{display:block}@media(min-width: 640px){main.svelte-1m52s8g{max-width:none}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFByZXZpZXcuc3ZlbHRlIiwic291cmNlcyI6WyJIb3RzcG90UHJldmlldy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cblx0aW1wb3J0IHsgb25Nb3VudCwgYmVmb3JlVXBkYXRlIH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IGhvdHNwb3RTY3JpcHQgZnJvbSAnLi9ob3RzcG90U2NyaXB0LmpzJztcblx0aW1wb3J0IERvb1NjcmliUGx1Z2luIGZyb20gJy4vaG90c3BvdERyYXdpbmdTY3JpcHQuanMnO1xuXHRpbXBvcnQgeyBYTUxUb0pTT04sIG9uVXNlckFuc0NoYW5nZSwgQUggfSBmcm9tICcuLi9oZWxwZXIvSGVscGVyQUkuc3ZlbHRlJztcblx0aW1wb3J0IEl0ZW1IZWxwZXIgZnJvbSAnLi4vaGVscGVyL0l0ZW1IZWxwZXIuc3ZlbHRlJztcblx0aW1wb3J0IHttb3ZldGFyZ2V0fSBmcm9tICcuL2xpYnMvdXRpbC5zdmVsdGUnO1xuXHRpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cdGV4cG9ydCBsZXQgeG1sO1xuXHRleHBvcnQgbGV0IHV4bWw7XG5cdGV4cG9ydCBsZXQgYW5zU3RhdHVzO1xuXHRleHBvcnQgbGV0IGlzUmV2aWV3O1xuXHRleHBvcnQgbGV0IHNob3dBbnM7XG5cdGV4cG9ydCBsZXQgZWRpdG9yU3RhdGU7XG5cblx0Y29uc3QgSG90SlMgPSBuZXcgaG90c3BvdFNjcmlwdCgpO1xuXHRsZXQgcGFyc2VYbWwgPSBcIlwiO1xuXHRsZXQgYmdJbWdQYXRoID0gJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nO1xuXHRsZXQgYWx0ID0gXCJcIjtcblx0bGV0IG1vZHVsZUFyciA9IHtcblx0XHR0ZXh0Y2xpY2s6IFwiMVwiLFxuXHRcdHRleHRzZWxlY3Q6IFwiMlwiLFxuXHRcdGltYWdlaGlnaGxpZ2h0OiBcIjNcIixcblx0XHRob3RzcG90OiBcIjRcIixcblx0fTtcblx0bGV0IHN0YXRlID0ge307XG5cdGxldCBoZGQgPSB3cml0YWJsZSh7XG5cdFx0aW1nd2lkdGg6IFwiYXV0b1wiLFxuXHRcdGltZ2hlaWdodDogXCJhdXRvXCIsXG5cdH0pXG5cdGxldCBpdGVtQm9yZGVyID0gMDtcblx0bGV0IGl0ZW1Cb3JkZXJDb2xvciA9IFwiZ3JheVwiO1xuXHRsZXQgaXNVeG1sVGFyZ2V0ID0gZmFsc2U7XG5cdGxldCBpdGVtQXJlYVRvcCA9ICcnO1xuXHRsZXQgaXRlbUFyZWFIZWlnaHQgPSAnJztcblx0bGV0IGl0ZW1BcmVhV2lkdGggPSAnJztcblx0bGV0IGl0ZW1BcmVhTGVmdCA9ICcnO1xuXHRsZXQgdGFyZ2V0TGVmdCBcdFx0PSAxMDA7XG5cdGxldCB0YXJnZXRUb3AgXHRcdD0gMTAwO1xuXHRsZXQgdGFyZ2V0VmlldyAgICAgID0gXCJub25lXCI7XG5cdGxldCBhbnNfeCBcdFx0XHQ9IDA7XG5cdGxldCBhbnNfeSBcdFx0XHQ9IDA7XG5cdGxldCBhbnNfaCBcdFx0XHQ9IDA7XG5cdGxldCBhbnNfdyBcdFx0XHQ9IDA7XG5cdGxldCB0eXBlXHRcdFx0PSBcIlwiO1xuXHRsZXQgaW1nX3VybCBcdFx0PSBcIlwiO1xuXHRsZXQgbWFudWFsX2dyYWRlIFx0PSAwO1xuXHRsZXQgb25FcnJvclx0XHRcdD0gbnVsbDsgXG5cdGxldCBpdGVtX3R5cGUgICAgICAgPSBcIlwiO1xuXHRsZXQgeG1sSGVpZ2h0ICAgICAgID0gMDtcblx0bGV0IHhtbFdpZHRoICAgICAgICA9IDA7XG5cdGxldCB1c2VyQ29ycmVjdCAgICAgPSBcIlwiO1xuXHRsZXQgY29ycmVjdGFuc1x0XHQ9IFwiXCI7XG5cdGxldCB0b3RhbENvcnJlY3RBbnM7XG5cdGxldCBzY3JvbGxFbmFibGVkICAgPSBmYWxzZTtcblx0bGV0IGxpbmVjb2xvciA9IFwiYmxhY2tcIjtcblx0bGV0IGRyYXdzdHJcdD0gXCJcIjtcblx0bGV0IGNvdW50ID0gMDtcblx0bGV0IHhheGlzID0gW107XG5cdGxldCB5YXhpcyA9IFtdO1xuXHRsZXQgZGl2SGVpZ2h0ID0gMDtcblx0bGV0IGRpdldpZHRoID0gMDtcblx0dmFyIHR5cGVOYW1lID0gJ3RleHRjbGljayc7XG5cdHZhciBjb3JyZWN0QW5zU3RyID0gJyc7XG5cdHZhciBjb3JyZWN0SHRtbCA9ICcnO1xuXHRjb25zdCB1bnN1YnNjcmliZSA9ICgoaXRlbXMpPT57XG5cdFx0c3RhdGUgPSBpdGVtcztcblx0fSlcblxuXHQkOiB7XG5cdFx0aWYgKGlzUmV2aWV3KSB7XG5cdFx0XHQvL3RhcmdldFZpZXcgPSBcImJsb2NrXCI7XG5cdFx0XHRzZXRSZXZpZXcoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly90YXJnZXRWaWV3ID0gXCJub25lXCI7XG5cdFx0XHR1bnNldFJldmlldygpO1xuXHRcdH1cblx0fVxuXG5cdCQ6XHRpZiAoeG1sKSB7XG5cdFx0Ly8gSGVyZSByZXBsYWNpbmcgdGhlIG5vdCBzdGFuZGFyZCBjZGF0YSBpbnRvIHRoZSB2YWxpZCBjZGF0YSBmb3JtYXRcblx0XHRsZXQgbXlYbWwgPSB4bWwucmVwbGFjZShcIjwhLS1bQ0RBVEFbXCIsIFwiPCFbQ0RBVEFbXCIpLnJlcGxhY2UoXCJdXS0tPlwiLCBcIl1dPlwiKTtcblx0XHRcdFxuXHRcdC8vIGNoZWNraW5nIHhtbCBmb3IgaWYgY2RhdGEgaXMgZm91bmQgb3Igbm90IFxuXHRcdGlmIChteVhtbC5tYXRjaCgvPFxcIVxcW0NEQVRBXFxbe3w8XFwhLS1cXFtDREFUQVxcW3svZ20pKSB7XG5cdFx0XHQvLyBzYXZpbmcgdmFsdWUgYi93IHRoZSB7LCB9IHN5bWJvbFxuXHRcdFx0Y29ycmVjdGFucyA9ICBteVhtbC50b1N0cmluZygpLm1hdGNoKC97KC4qKX0vZ21pKTtcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9IGNvcnJlY3RhbnMudG9TdHJpbmcoKS5tYXRjaCgvfSxcIlxcZCtcIi9nbSk7XG5cdFx0XHR0b3RhbENvcnJlY3RBbnMgPSAodG90YWxDb3JyZWN0QW5zKSA/IHRvdGFsQ29ycmVjdEFucy5wb3AoKSA6IG51bGw7XG5cdFx0XHR0b3RhbENvcnJlY3RBbnMgPSAodG90YWxDb3JyZWN0QW5zKSA/IHRvdGFsQ29ycmVjdEFucy5yZXBsYWNlKC9cInx9fCwvZ20sXCJcIikgOiAxO1xuXHRcdFx0bXlYbWwgPSBteVhtbC5yZXBsYWNlKGNvcnJlY3RhbnMsIFwiXCIpO1xuXHRcdFx0Y29ycmVjdGFucyA9IGNvcnJlY3RhbnNbMF07XG5cdFx0fVxuXHRcdHBhcnNlWG1sID0gWE1MVG9KU09OKHhtbCk7XG5cdFx0eG1sUGFyc2VyKCk7XG5cdFx0cHJlUmVuZGVyKCk7XG5cdH1cblxuXHRvbk1vdW50KGFzeW5jICgpID0+IHtcblx0XHRwYXJzZVhtbCA9IFhNTFRvSlNPTih4bWwpO1xuXHRcdHhtbFBhcnNlcigpO1xuXHRcdHByZVJlbmRlcigpO1xuXHRcdEhvdEpTLnJlYWR5VGhpcygnaHB0bWFpbjAnLCBpc1Jldmlldyk7XG5cdFx0aWYgKGlzUmV2aWV3KSB7XG5cdFx0XHRIb3RKUy5tb2RlT25Ib3QoMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdEhvdEpTLm1vZGVPbkhvdCgpO1xuXHRcdH1cblxuXHRcdEFILmxpc3RlbignI3ByZXZpZXdBcmVhJywgJ2NsaWNrJywgJy50ZXh0Q2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdGNoZWNrQW5zd2VyKCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0QUgubGlzdGVuKCcjcHJldmlld0FyZWEnLCAnY2xpY2snLCAnW3R5cGU9XCJ0ZXh0c2VsZWN0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjaGVja0Fuc3dlcigpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRmdW5jdGlvbiB4bWxQYXJzZXIoKSB7XG5cdFx0aXRlbV90eXBlID0gcGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfdHlwZSddO1xuXHRcdHhtbEhlaWdodCA9IHBhcnNlWG1sWydzbXhtbCddWydfaGVpZ2h0J107XG5cdFx0eG1sV2lkdGggPSBwYXJzZVhtbFsnc214bWwnXVsnX3dpZHRoJ107XG5cdFx0aWYgKGl0ZW1fdHlwZSA9PSB1bmRlZmluZWQgfHwgaXRlbV90eXBlID09IFwiXCIpIHtcblx0XHRcdGl0ZW1fdHlwZSA9IHBhcnNlWG1sWydzbXhtbCddWydfbmFtZSddLnRvTG93ZXJDYXNlKCk7XG5cdFx0fVxuXHRcdHR5cGVOYW1lID0gaXRlbV90eXBlO1xuXHRcdGltZ191cmwgPSBwYXJzZVhtbFsnc214bWwnXVsnX2JnaW1nJ107XG5cdFx0c3dpdGNoIChtb2R1bGVBcnJbaXRlbV90eXBlXSkge1xuXHRcdFx0Ly8gaW4gY2FzZSBvZiB0ZXh0IGNsaWNrIFxuXHRcdFx0Y2FzZSBcIjFcIjogXG5cdFx0XHRcdFx0Ly9nZXR0aW5nIHRoZSB3aWR0aCBhbmQgaGVpZ2h0XG5cdFx0XHRcdFx0ZGl2SGVpZ2h0ID0gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnO1xuXHRcdFx0XHRcdGRpdldpZHRoID0gcGFyc2VYbWwuc214bWwuX3dpZHRoKydweCc7XG5cdFx0XHRcdFx0Ly8gZm9yIHBhcnNpbmcgdGhlIHhtbFxuXHRcdFx0XHRcdHBhcnNlVGV4dENsaWNrKHBhcnNlWG1sLnNteG1sLmRpdi5fX2NkYXRhKTtcblx0XHRcdFx0XHRBSC5zZWxlY3QoQUgucGFyZW50KCcjdGV4dElEMCcpLCAnc2hvdycsICdibG9jaycpO1xuXHRcdFx0XHRcdEFILnNlbGVjdEFsbCgnI2RyYXdQcmV2aWV3LHRhYmxlW2lkPVwiaHB0bWFpbjJcIl0nLCAnaGlkZScpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjJcIjogXG5cdFx0XHRcdFx0Ly8gaW4gY2FzZSBvZiB0ZXh0IHNlbGVjdCBtb2R1bGVcblx0XHRcdFx0XHRpZiAoIWlzTmFOKHBhcnNlWG1sLnNteG1sLl9oZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHRwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID0gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnO1x0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRpdkhlaWdodCA9IHBhcnNlWG1sLnNteG1sLl9oZWlnaHQ7XG5cdFx0XHRcdFx0ZGl2V2lkdGggPSBwYXJzZVhtbC5zbXhtbC5fd2lkdGgrJ3B4Jztcblx0XHRcdFx0XHQvLyBmb3IgcGFyc2luZyB0aGUgeG1sXG5cdFx0XHRcdFx0cGFyc2VUZXh0U2VsZWN0KHBhcnNlWG1sLnNteG1sLmRpdi5fX2NkYXRhKTtcblx0XHRcdFx0XHRBSC5zZWxlY3QoQUgucGFyZW50KCcjdGV4dElEMCcpLCAnc2hvdycsICdibG9jaycpO1xuXHRcdFx0XHRcdEFILnNlbGVjdEFsbCgnI2RyYXdQcmV2aWV3LHRhYmxlW2lkPVwiaHB0bWFpbjJcIl0nLCAnaGlkZScpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjNcIjoge1xuXHRcdFx0XHRcdC8vIEluIGNhc2Ugb2YgaW1hZ2UgaGlnaGxpZ2h0IFxuXHRcdFx0XHRcdC8vYmdJbWcgPSBwYXJzZVhtbC5zbXhtbC5fYmdpbWc7XG5cdFx0XHRcdFx0Ly92YXIgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlkZGVuSW1hZ2UnKTtcblx0XHRcdFx0XHRsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0XHRpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRcdHN0YXRlLmltZ2hlaWdodCA9IChwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID4gdGhpcy5oZWlnaHQpID8gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnIDogdGhpcy5oZWlnaHQrJ3B4Jztcblx0XHRcdFx0XHRcdHN0YXRlLmltZ3dpZHRoID0gKHBhcnNlWG1sLnNteG1sLl93aWR0aCA+IHRoaXMud2lkdGgpID8gcGFyc2VYbWwuc214bWwuX3dpZHRoICsgJ3B4JyA6IHRoaXMud2lkdGggKyAncHgnO1xuXHRcdFx0XHRcdFx0QUguZmluZCgnI2hwdGRyYXcwJywgJ2NhbnZhcycsIHthY3Rpb246ICdhdHRyJywgYWN0aW9uRGF0YToge2hlaWdodDogIHN0YXRlLmltZ2hlaWdodCwgd2lkdGg6IHN0YXRlLmltZ3dpZHRofSB9KTtcblx0XHRcdFx0XHRcdEFILmVtcHR5KCcjdGV4dElEMCcpO1xuXHRcdFx0XHRcdFx0dW5zZXRSZXZpZXcoKTtcblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHRcdFx0aW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBiZ0ltZ1BhdGggKyBwYXJzZVhtbC5zbXhtbC5fYmdpbWcpO1xuXHRcdFx0XHRcdC8vIHVzZWQgZm9yIHNldCB0aGUgYmFja2dyb3VuZCBpbWFnZSBvZiB0aGUgRHJhdyBoaWdobGlnaHRlZCBtb2R1bGVcblx0XHRcdFx0XHQvL2ltZ1VybCA9IFwidXJsKCdodHRwczpcIiArIGJnSW1nUGF0aCArIHBhcnNlWG1sLnNteG1sLl9iZ2ltZyArIFwiJylcIjtcblx0XHRcdFx0XHQvL3RoaXMuZmxhZ1VwZGF0ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjRcIjoge1xuXHRcdFx0XHRcdC8vIGluIGNhc2Ugb2YgaG90c3BvdCAoc3BvdCBhbiBpbWFnZSlcblx0XHRcdFx0XHQvLyBzZXR0aW5nIGJhY2tncm91bmRJbWFnZSAsIGFsdCwgd2lkdGgsIGhlaWdodCwgbGVmdCAsIHRvcCAsYm9yZGVyLCBib3JkZXJjb2xvciBvbiB0aGUgYmFzaXMgb2YgeG1sXG5cdFx0XHRcdFx0aW1nX3VybCA9IHBhcnNlWG1sLnNteG1sLl9iZ2ltZztcblx0XHRcdFx0XHRhbHQgPSBwYXJzZVhtbC5zbXhtbC5fYWx0O1xuXHRcdFx0XHRcdGFuc195ID0gcGFyc2VGbG9hdChwYXJzZVhtbFsnc214bWwnXVsnZGl2J11bJ190b3AnXSk7XG5cdFx0XHRcdFx0YW5zX3ggPSBwYXJzZUZsb2F0KHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsnX2xlZnQnXSkrMTM7XG5cdFx0XHRcdFx0YW5zX2ggPSBwYXJzZUZsb2F0KHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsnX2hlaWdodCddKTtcblx0XHRcdFx0XHRhbnNfdyA9IHBhcnNlRmxvYXQocGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfd2lkdGgnXSk7XG5cdFx0XHRcdFx0YWx0ID0gcGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfYWx0J107XG5cdFx0XHRcdFx0dHlwZSA9IHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsndHlwZSddO1xuXHRcdFx0XHRcdGl0ZW1Cb3JkZXIgID0gcGFyc2VYbWwuc214bWwuZGl2Ll9ib3JkZXI7XG5cdFx0XHRcdFx0aXRlbUJvcmRlckNvbG9yICA9IHBhcnNlWG1sLnNteG1sLmRpdi5fYm9yZGVyY29sb3I7XG5cdFx0XHRcdFx0aXRlbUFyZWFXaWR0aCA9IHBhcnNlWG1sLnNteG1sLmRpdi5fd2lkdGgrJ3B4Jztcblx0XHRcdFx0XHRpdGVtQXJlYUhlaWdodCA9IHBhcnNlWG1sLnNteG1sLmRpdi5faGVpZ2h0KydweCc7XG5cdFx0XHRcdFx0aXRlbUFyZWFMZWZ0ID0gcGFyc2VYbWwuc214bWwuZGl2Ll9sZWZ0KydweCc7XG5cdFx0XHRcdFx0aXRlbUFyZWFUb3AgPSBwYXJzZVhtbC5zbXhtbC5kaXYuX3RvcCsncHgnO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRcdGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0bGV0IGJnSW1nSGVpZ2h0ID0gdGhpcy5oZWlnaHQrJ3B4Jztcblx0XHRcdFx0XHRcdGxldCBiZ0ltZ1dpZHRoID0gIHRoaXMud2lkdGgrJ3B4Jztcblx0XHRcdFx0XHRcdHN0YXRlLmltZ2hlaWdodCA9ICAocGFyc2VYbWwuc214bWwuZGl2Ll9pbWdoZWlnaHQpICA/IHBhcnNlWG1sLnNteG1sLmRpdi5faW1naGVpZ2h0KydweCcgOiBcImF1dG8gIWltcG9ydGFudFwiO1xuXHRcdFx0XHRcdFx0c3RhdGUuaW1nd2lkdGggPSAocGFyc2VYbWwuc214bWwuZGl2Ll9pbWd3aWR0aCkgPyBwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ3dpZHRoKydweCcgOiAgXCJhdXRvICFpbXBvcnRhbnRcIjtcblx0XHRcdFx0XHRcdEFILnNlbGVjdCgnI2hwdG1haW4wJywgJ2NzcycsIHtoZWlnaHQ6IGJnSW1nSGVpZ2h0LCB3aWR0aDogYmdJbWdXaWR0aH0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0aW1hZ2Uuc3JjID0gYmdJbWdQYXRoICsgcGFyc2VYbWwuc214bWwuX2JnaW1nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrOyBcblx0XHR9XG5cdFx0XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVSZW5kZXIoKSB7XG5cdFx0aWYgKGlzUmV2aWV3KSB7XG5cdFx0XHR0YXJnZXRWaWV3ID0gXCJibG9ja1wiO1xuXHRcdH1cblx0XHR2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjNcIikge1xuXHRcdFx0XHRzdGF0ZS5pbWdoZWlnaHQgPSAocGFyc2VYbWwuc214bWwuX2hlaWdodCA+IHRoaXMuaGVpZ2h0KSA/IHBhcnNlWG1sLnNteG1sLl9oZWlnaHQrJ3B4JyA6IHRoaXMuaGVpZ2h0KydweCc7XG5cdFx0XHRcdHN0YXRlLmltZ3dpZHRoID0gKHBhcnNlWG1sLnNteG1sLl93aWR0aCA+IHRoaXMud2lkdGgpID8gcGFyc2VYbWwuc214bWwuX3dpZHRoICsgJ3B4JyA6IHRoaXMud2lkdGggKyAncHgnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3RhdGUuaW1naGVpZ2h0ID0gIChwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ2hlaWdodCkgID8gcGFyc2VYbWwuc214bWwuZGl2Ll9pbWdoZWlnaHQrJ3B4JyA6IFwiYXV0byAhaW1wb3J0YW50XCI7XG5cdFx0XHRcdHN0YXRlLmltZ3dpZHRoID0gKHBhcnNlWG1sLnNteG1sLmRpdi5faW1nd2lkdGgpID8gcGFyc2VYbWwuc214bWwuZGl2Ll9pbWd3aWR0aCsncHgnIDogIFwiYXV0byAhaW1wb3J0YW50XCI7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbWFnZS5zcmMgPSBiZ0ltZ1BhdGggKyBpbWdfdXJsO1xuXHRcdGlmICh1eG1sKSB7XG5cdFx0XHR1c2VyQ29ycmVjdCA9IHV4bWw7XG5cdFx0XHRsZXQgcGFyc2VVeG1sID0gWE1MVG9KU09OKHV4bWwpO1xuXHRcdFx0aWYgKHBhcnNlVXhtbC5TTUFOUyAmJiBwYXJzZVV4bWwuU01BTlMuZGl2KSB7XG5cdFx0XHRcdGlzVXhtbFRhcmdldCA9IHRydWU7XG5cdFx0XHRcdGFuc194ID0gcGFyc2VVeG1sLlNNQU5TLmRpdi5fdGFyZ2V0TGVmdDtcblx0XHRcdFx0YW5zX3kgPSBwYXJzZVV4bWwuU01BTlMuZGl2Ll90YXJnZXRUb3A7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tBbnN3ZXIgKGV2ZW50KSB7XG5cdFx0bGV0IHJlc3VsdCA9IHt9OyBcblx0XHRpZiAodHlwZU5hbWUgPT0gJ3RleHRjbGljaycgfHwgdHlwZU5hbWUgPT0gJ3RleHRzZWxlY3QnKSB7XG5cdFx0XHRyZXN1bHQgPSBIb3RKUy5jaGVja19BbnMoJyNwcmV2aWV3QXJlYSAjaHB0bWFpbjAnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gbW92ZXRhcmdldChldmVudCwgYW5zX2gsIGFuc193LCBwYXJzZUludChpdGVtQXJlYUxlZnQpLCBwYXJzZUludChpdGVtQXJlYVRvcCkpO1xuXHRcdFx0aXNVeG1sVGFyZ2V0ID0gdHJ1ZTtcblx0XHRcdGFuc194ID0gcmVzdWx0LmxlZnQ7XG5cdFx0XHRhbnNfeSA9IHJlc3VsdC50b3A7XG5cdFx0XHRhbnNTdGF0dXMgPSByZXN1bHQuYW5zO1xuXHRcdFx0aWYgKGVkaXRvclN0YXRlKSBzaG93QW5zKGFuc1N0YXR1cyA/IFwiQ29ycmVjdFwiIDogXCJJbmNvcnJlY3RcIik7XG5cdFx0fVxuXHRcdG9uVXNlckFuc0NoYW5nZShyZXN1bHQpO1xuXHR9XG5cdGZ1bmN0aW9uIG9uTW9kYWxUb3VjaChldmVudCkge1xuXHRcdGNvbnNvbGUubG9nKGV2ZW50KTtcblx0fVxuXG5cdC8vIHVzZWQgaW4gbmF0aXZlIGZvciB0b2dnbGVcblx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0QXJlYSgpIHtcblx0XHRzY3JvbGxFbmFibGVkID0gc2Nyb2xsRW5hYmxlZCA/IGZhbHNlIDogdHJ1ZTtcblx0fVxuXG5cdC8vIHdoZW4gcmVtZWRpYXRpb24gbW9kZSBpcyBvblxuXHRmdW5jdGlvbiBzZXRSZXZpZXcoKSB7XG5cdFx0dGFyZ2V0VmlldyA9IFwiYmxvY2tcIjtcblx0XHQvL2lzRG90Q3JlYXRlID0gZmFsc2U7XG5cdFx0Ly8gaWYgdGhlIG1vZHVsZSBpcyBpbWFnZWhpZ2hsaWdodCB0aGVuIGl0IGRyYXcgdGhlIGNvcnJlY3QgYW5zd2VyIG9uIHRoZSBtb2R1bGUgdXNpbmcgdGhlIGZ1bmN0aW9uIGRyYXdPbkNhbnZhc1xuXHRcdGlmIChtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjNcIikge1xuXHRcdFx0bGV0IGVsID0gQUguZmluZCgnI3ByZXZpZXdBcmVhJywgJ2NhbnZhcycpO1xuXHRcdFx0bGV0IHB0cyA9IGVsLmdldEF0dHJpYnV0ZSgnY29ycmVjdGFucycpOyBcblx0XHRcdGlmICggcHRzIT0nJykgcHRzID0gSlNPTi5wYXJzZShwdHMpO1xuXHRcdFx0SG90SlMuZHJhd09uQ2FudmFzKGVsLCBwdHMsICdncmVlbicpO1xuXHRcdH1cblx0XHQvLyBjYWxsZWQgdGhlIGZ1bmN0aW9uIHVuYmluZCBsYWIgd2hpY2ggYmFzaWNhbGx5IHNob3cgdGhlIGRyYWdnYWJsZSBlbGVtZW50IGluIHByZXZpZXcgYXJlYSBpZiBmb3VuZCB3aGljaCBpcyBmb3VuZCBpbiBjYXNlIG9mIHNwb3QgYW4gaW1hZ2Vcblx0XHRIb3RKUy5tb2RlT25Ib3QoMSk7XG5cdFx0Ly8gY2hlY2sgdGhlIGFuc3dlciB3ZXRoZXIgdGhlIGFuc3dlciBpcyBjb3JyZWN0IG9yIG5vdFxuXHRcdC8vY2hlY2tBbnN3ZXIoKTtcblx0XHRBSC5zZWxlY3QoXCIjaHB0bWFpbjBcIiwgJ2NzcycsIHtwb2ludGVyRXZlbnRzOiBcIm5vbmVcIn0pO1xuXHR9XG5cblx0Ly8gd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9mZlxuXHRmdW5jdGlvbiB1bnNldFJldmlldygpIHtcblx0XHR0YXJnZXRWaWV3ID0gXCJub25lXCI7XG5cdFx0Ly8gaWYgdGhlIG1vZHVsZSBpcyBpbWFnZWhpZ2hsaWdodCB0aGVuIGl0IGhpZGUgdGhlIGNvcnJlY3QgYW5zd2VyIGFucyBzaG93IHVzZXIgYW5zIG9uIHRoZSBtb2R1bGUgdXNpbmcgdGhlIGZ1bmN0aW9uIGRyYXdPbkNhbnZhc1xuXHRcdGlmIChtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjNcIikge1xuXHRcdFx0QUguZmluZCgnI3ByZXZpZXdBcmVhJywgJ2NhbnZhcycsIHthY3Rpb246ICdyZW1vdmUnfSk7XG5cdFx0XHRpbWFnZURyYXcoJyNwcmV2aWV3QXJlYScsIDApO1xuXHRcdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IGVsID0gQUguZmluZCgnI3ByZXZpZXdBcmVhJywgJ2NhbnZhcycpO1xuXHRcdFx0XHQvLyBnZXR0aW5nIHRoZSB2YWx1ZSBvZiB0aGUgdXNlciBhbnNcblx0XHRcdFx0bGV0IGdldEFucyA9IEFILnNlbGVjdCgnI3NwZWNpYWxfbW9kdWxlX3BhcnNlJykudmFsdWUsXG5cdFx0XHRcdC8vIGdldHRpbmcgdGhlIHVzZXIgYW5zd2VyIGNvb3JkaW5hdGVzXG5cdFx0XHRcdGNhbnMgICA9IGdldEFucy5zdWJzdHJpbmcoZ2V0QW5zLmluZGV4T2YoJ3snKSxnZXRBbnMubGFzdEluZGV4T2YoJ30nKSsxKTtcblxuXHRcdFx0XHQvLyBwYXJzaW5nIGl0IGludG8gdGhlIEpTT04gZWxlbWVudFxuXHRcdFx0XHRpZiAoIGNhbnMhPScnKSBjYW5zID0gSlNPTi5wYXJzZShjYW5zKTtcblx0XHRcdFx0Ly8gcGFzc2VkIHRoZSBwb2ludHMgaW4gdGhlIGNhbnZhc1xuXHRcdFx0XHRIb3RKUy5kcmF3T25DYW52YXMoZWwsIGNhbnMsIGxpbmVjb2xvcik7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHR9LDUwMCk7XG5cdFx0fVxuXHRcdC8vIGNhbGxlZCB0aGUgZnVuY3Rpb24gYmluZCBsYWIgd2hpY2ggYmFzaWNhbGx5IGhpZGUgdGhlIGRyYWdnYWJsZSBlbGVtZW50IGluIHByZXZpZXcgYXJlYSBpZiBmb3VuZCB3aGljaCBpcyBmb3VuZCBpbiBjYXNlIG9mIHNwb3QgYW4gaW1hZ2Vcblx0XHRIb3RKUy5tb2RlT25Ib3QoKTtcblx0XHRBSC5zZWxlY3QoXCIjaHB0bWFpbjBcIiwgJ2NzcycsIHtwb2ludGVyRXZlbnRzOiBcImF1dG9cIn0pO1xuXHR9XG5cblx0Ly8gZm9yIGltYWdlIGRyYXdcblx0ZnVuY3Rpb24gaW1hZ2VEcmF3KGhpZCxyZXZpZXcpIHtcblx0XHRsZXQgaW1nT2JqID0gIEFILmZpbmQoaGlkLCAnI2hwdG1haW4wJyk7XG5cdFx0aGlkID0gaW1nT2JqO1xuXHRcdC8vIGxldCBpbWdXaWR0aCAgPSBpbWdPYmouY2xpZW50V2lkdGg7XG5cdFx0Ly8gbGV0IGltZ0hlaWdodCA9IGltZ09iai5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN1cmZhY2UgPSBuZXcgRG9vU2NyaWJQbHVnaW4oe1xuICAgICAgICAgICAgdGFyZ2V0OiBpbWdPYmosXG4gICAgICAgICAgICB3aWR0aDogKyggc3RhdGUuaW1nd2lkdGgucmVwbGFjZSgncHgnLCAnJykgKSxcbiAgICAgICAgICAgIGhlaWdodDogKyggc3RhdGUuaW1naGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpICksXG4gICAgICAgICAgICBjb3JyZWN0YW5zOiBjb3JyZWN0YW5zLFxuICAgICAgICAgICAgY3NzQ2xhc3M6ICdkcmF3U3VyZmFjZScsXG4gICAgICAgICAgICBwZW5TaXplOiA0LFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlaGlnaGxpZ2h0JyxcbiAgICAgICAgICAgIGVkaXRhYmxlOiAoIXJldmlldykgPyB0cnVlOiBmYWxzZSxcbiAgICAgICAgICAgIG9uTW92ZTogZnVuY3Rpb24gKCkgeyB9LFxuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gKCkgeyB9LFxuICAgICAgICAgICAgb25QYWludDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9yZWluZyB0aGUgWCBhbmQgWSB2YWx1ZXNcbiAgICAgICAgICAgICAgICB4YXhpcy5wdXNoKGUuWCk7XG4gICAgICAgICAgICAgICAgeWF4aXMucHVzaChlLlkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uUmVsZWFzZTogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0b25SZWxlYXNlRnVuYyhlLCBoaWQsIHJldmlldyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXHRcdGxpbmVjb2xvciA9IFN0cmluZyh4bWwubWF0Y2goL2xpbmVjb2xvcj1cXFwiKFteXFxcIl0rKVxcXCIvZ20pKTtcblx0XHRsaW5lY29sb3IgPSBsaW5lY29sb3Iuc3Vic3RyaW5nKFwiMTFcIiwgKGxpbmVjb2xvci5sZW5ndGggLSAxKSk7XG5cdFx0Ly92YXIgcmVzID0gQUguc2libGluZ3MoaGlkKS5maW5kKChfZWxtKT0+IF9lbG0ubWF0Y2hlcygnZGl2JykgKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0aWYgKCFyZXZpZXcpIHtcblx0XHRcdEFILmxpc3RlbignI3ByZXZpZXdBcmVhJywgJ2NsaWNrJywgJyNyZXNldCcsICgpPT4ge1xuXHRcdFx0XHRzdXJmYWNlLmNsZWFyU3VyZmFjZSgpO1xuXHRcdFx0XHRkcmF3c3RyID0gJyc7IGNvdW50ID0gMDtcblx0XHRcdFx0dXNlckNvcnJlY3QgPSAgXCJcIjtcblx0XHRcdFx0QUguc2VsZWN0QWxsKEFILnNlbGVjdChoaWQpLmNoaWxkcmVuLCAnYXR0cicsIHt1c2VyYW5zOiAnJ30pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHdpbmRvdy5zdXJmYWNlID0gc3VyZmFjZTtcblx0fVxuXG5cdC8vIGNhbGxzIGluIGtleSB1cCAvIG9ucmVsYXNlIG9mIG1vdXNlXG5cdGZ1bmN0aW9uIG9uUmVsZWFzZUZ1bmMoZSwgaGlkLCByZXZpZXcpe1xuXHRcdGxldCB1c2VyQW5zd2VycyA9ICcnO1xuXHRcdGxldCBpbk5hdGl2ZUlzQ29ycmVjdCA9IGZhbHNlO1xuXG5cdFx0Ly8gY2hlY2sgZm9yIHRoZSByZXZpZXcgbW9kZSBpcyBvbiBvciBvZmZcblx0XHRpZiAoIXJldmlldykge1x0Ly8gaWYgcmV2aWV3IG1vZGUgaXMgb2ZmXG5cdFx0XHRkcmF3c3RyID0gJyc7XG5cdFx0XHQvLyBnZXR0aW5nIHRoZSAgdmFsdWUgb2YgdGhlIHBvaW50IFxuXHRcdFx0dmFyIGNvb3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3BlY2lhbF9tb2R1bGVfcGFyc2UnKS52YWx1ZTtcblx0XHRcdGNvb3IgPSBjb29yLnN1YnN0cmluZyhjb29yLmluZGV4T2YoJ3snKSxjb29yLmxhc3RJbmRleE9mKCd9JykrMSk7XG5cblx0XHRcdC8vIGdldHRpbmcgdGhlIGNvb3JkaW5hdGVzIHVzaW5nIHRoZSBnZXRDb29yZGluYXRlIGZ1bmN0aW9uXG5cdFx0XHRpZiAoY29vciE9JycpIHtcdFxuXHRcdFx0XHRjb29yID0gXHRPYmplY3Qua2V5cyhKU09OLnBhcnNlKGNvb3IpKS5sZW5ndGg7XG5cdFx0XHRcdGRyYXdzdHIgPSBIb3RKUy5nZXRDb29yZGluYXRlKGhpZCwgeGF4aXMsIHlheGlzLCBjb29yKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRyYXdzdHIgPSBIb3RKUy5nZXRDb29yZGluYXRlKGhpZCwgeGF4aXMsIHlheGlzLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBmb3IgZ2V0dGluZyB3aW5kb3cgaGVpZ2h0IGluIGNhc2Ugb2YgbmF0aXZlXG5cdFx0XHRpZiAod2luZG93LmluTmF0aXZlKSB7XG5cdFx0XHRcdHdpbmRvdy5nZXRIZWlnaHQgJiYgd2luZG93LmdldEhlaWdodCgpO1xuXHRcdFx0fVx0XG5cblx0XHRcdC8vIGZvciBhdXRvZ3JhZGluZ1xuXHRcdFx0d2luZG93LklTU1BFQ0lBTE1PRFVMRVVTRVJYTUxDSEFOR0UgPSAxO1xuXHRcdFx0Ly8gcHV1dGluZyB0aGUgdmFsdWUgaW4gdGhlIHRleHRhcmVhIGZvciBzYXZpbmcgdGhlIHVzZXIgYW5zXG5cdFx0XHRBSC5zZWxlY3QoXCIjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcIiwgJ3ZhbCcsIGRyYXdzdHIpO1xuXHRcdFx0dXNlckNvcnJlY3QgPSBkcmF3c3RyO1xuXHRcdFx0eGF4aXM9W107IHlheGlzPVtdO1xuXHRcdFx0Ly8gZm9yIGdldHRpbmcgdGhlIGNvcnJlY3RhbnNcblx0XHRcdGxldCBwdHMgID0gQUguZmluZChoaWQsICdjYW52YXMnKS5nZXRBdHRyaWJ1dGUoJ2NvcnJlY3RhbnMnKTtcblx0XHRcdC8vIGZvciBnZXR0aW5nIHRoZSB1c2VyIGFuc1xuXHRcdFx0bGV0IGNhbnMgPSBBSC5maW5kKGhpZCwgJ2NhbnZhcycpLmdldEF0dHJpYnV0ZSgndXNlcmFucycpO1xuXG5cdFx0XHQvLyBwYXJzaW5nIGJvdGggdGhlIGpzb24gaWYgdGhleSBhcmUgbm90IGVtcHR5XG5cdFx0XHRpZiAoIGNhbnMhPScnKSBjYW5zID0gSlNPTi5wYXJzZShjYW5zKTtcblx0XHRcdGlmICggcHRzIT0nJykgcHRzID0gSlNPTi5wYXJzZShwdHMpO1xuXG5cdFx0XHQvLyBjb21wYXJpbmcgdGhlbSB3aXRoIHRoZSBmdW5jdGlvbiAsIGl0IHdpbGwgcmV0dXJuIDEgaWYgdGhlIGFuc3dlciBpcyBjb3JyZWN0XG5cdFx0XHRsZXQgZmxhZyA9IEhvdEpTLmNvbXBhcmVEcmF3aW5nKGNhbnMscHRzLGhpZCk7XG5cdFx0XHRsZXQgbWVzc2FnZSA9IFwiSW5jb3JyZWN0XCI7XG5cdFx0XHQvLyBmb3Igc2V0dGluZyB0aGUgYW5zd2VyIGNvcnJlY3QgaWYgZmxhZyA+IDBcblx0XHRcdGlmIChmbGFnID4gMCkge1xuXHRcdFx0XHRpbk5hdGl2ZUlzQ29ycmVjdCA9IHRydWU7XG5cdFx0XHRcdG1lc3NhZ2UgPSBcIkNvcnJlY3RcIjtcblx0XHRcdFx0c3RhdGUuYW5zd2VyVHlwZTMgPSB0cnVlO1xuXHRcdFx0XHRpZiAoZWRpdG9yU3RhdGUpIHNob3dBbnMoXCJDb3JyZWN0XCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5OYXRpdmVJc0NvcnJlY3QgPSBmYWxzZTtcblx0XHRcdFx0bWVzc2FnZSA9IFwiSW5jb3JyZWN0XCI7XG5cdFx0XHRcdHN0YXRlLmFuc3dlclR5cGUzID0gZmFsc2U7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdFx0aWYgKGVkaXRvclN0YXRlKSBzaG93QW5zKG1lc3NhZ2UpO1xuXHRcdFx0dXNlckFuc3dlcnMgPSBBSC5zZWxlY3QoJyNzcGVjaWFsX21vZHVsZV91c2VyX3htbCcpLnZhbHVlO1xuXHRcdFx0Ly8gQHVjLWFiazogV2hlbiB1c2VyIGRyYXdlZCBjYW52YXMgd2l0aGluIHRoZSBjb3JyZWN0IGFyZWEgOiBmbGFnIHdpbGwgMVxuXHRcdFx0KGZsYWcgPiAwKSA/IChBSC5zZWxlY3QoXCIjYW5zd2VyXCIpLmNoZWNrZWQgPSAgdHJ1ZSkgOiAoQUguc2VsZWN0KFwiI2Fuc3dlclwiKS5jaGVja2VkID0gZmFsc2UpO1xuXHRcdFx0aWYgKHdpbmRvdy5pbk5hdGl2ZSkgd2luZG93LnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgaW5OYXRpdmVJc0NvcnJlY3QsIHVzZXJBbnN3ZXJzIH0pLCBcIipcIik7XG5cdFx0fVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBwYXJzZVRleHRDbGljayhjZGF0YSkge1xuXHRcdHZhciBjZGF0YVN0ciA9ICcnO1xuXHRcdC8vIGdldCB0aGUgY29ycmVjdCBhbnN3ZXIgaW4gY29ycmVjdGFuc1xuXHRcdHZhciBjb3JyZWN0YW5zID0gY2RhdGEubWF0Y2goLyV7KC4qPyl9JS9nbSk7XG5cdFx0aWYgKGNvcnJlY3RhbnMpIHtcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9IGNvcnJlY3RhbnMubGVuZ3RoO1xuXHRcdFx0Zm9yKHZhciBpPTA7aTxjb3JyZWN0YW5zLmxlbmd0aDtpKyspIHtcblx0XHRcdFx0Ly8gcmVwbGFjaW5nIHRoZSBzcGFjZSB3aXRoIDx1YzpzcGFjZT4gYW5kIHRoZW4gcmVwbGFjaW5nIHRoZSBjb3JyZWN0YW5zIHdpdGggaXRcblx0XHRcdFx0Y29ycmVjdEFuc1N0ciA9IGNvcnJlY3RhbnNbaV0ucmVwbGFjZSgvXFxzKy9nbSwnPHVjOnNwYWNlPicpO1xuXHRcdFx0XHRjZGF0YSA9IGNkYXRhLnJlcGxhY2UoY29ycmVjdGFuc1tpXSxjb3JyZWN0QW5zU3RyKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29ycmVjdEFuc1N0ciA9ICcnO1xuXHRcdGNkYXRhID0gY2RhdGEuc3BsaXQoJyAnKTtcblx0XHRmb3IodmFyIGk9MDtpPGNkYXRhLmxlbmd0aDtpKyspIHtcblx0XHRcdC8vaWYgdGhlIGRhdGEgaXMgY29ycmVjdCBhbnN3ZXJcblx0XHRcdGlmIChjZGF0YVtpXS5tYXRjaCgvJXt8JX0vZ20pKSB7XG5cdFx0XHRcdC8vIGZvciBzZXR0aW5nIHRoZSBkYXRhLWNvcnJlY3RhbnMgMSBpZiB0aGF0IHZhbHVlIGlzIGNvcnJlY3Rcblx0XHRcdFx0Y2RhdGFbaV0gPSBjZGF0YVtpXS5yZXBsYWNlKC88dWM6c3BhY2U+L2dtLCcgJykucmVwbGFjZSgvJXt8fSUvZ20sJycpOyBcblx0XHRcdFx0Y2RhdGFTdHIgKz0gJzxwIGNsYXNzPVwidGV4dENsaWNrXCIgZGF0YS1pbmRleD1cIicraSsnXCIgZGF0YS11c2VyYW5zPVwiMFwiIGRhdGEtY29ycmVjdGFucz1cIjFcIj4nK2NkYXRhW2ldKyc8L3A+Jztcblx0XHRcdFx0Y29ycmVjdEFuc1N0ciArPSBjZGF0YVtpXSsnfCc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBmb3Igc2V0dGluZyB0aGUgZGF0YS1jb3JyZWN0YW5zIDAgaWYgdGhhdCB2YWx1ZSBpcyBjb3JyZWN0XG5cdFx0XHRcdGNkYXRhU3RyICs9ICc8cCBjbGFzcz1cInRleHRDbGlja1wiIGRhdGEtaW5kZXg9XCInK2krJ1wiIGRhdGEtdXNlcmFucz1cIjBcIiBkYXRhLWNvcnJlY3RhbnM9XCIwXCI+JytjZGF0YVtpXSsnPC9wPic7XG5cdFx0XHR9IFxuXHRcdH1cblx0XHRjb3JyZWN0QW5zU3RyID0gY29ycmVjdEFuc1N0ci5yZXBsYWNlKC9cXHwkL2dtLCcnKTtcblx0XHQgLy8gc2hvd2luZyB0aGUgdGV4dCBpbiB0aGUgcHJldmlldyBhcmVhIFx0XG5cdFx0QUguc2VsZWN0KCcgI3ByZXZpZXdBcmVhICAjdGV4dElEMCcpLmlubmVySFRNTCA9ICBjZGF0YVN0cjtcblx0fVxuXHRmdW5jdGlvbiBwYXJzZVRleHRTZWxlY3QoY2RhdGEpIHtcblx0XHRjb3JyZWN0QW5zU3RyID0gJyc7XG5cdFx0Ly8gc3RvcmUgdGhlIGNvcnJlY3QgYW5zd2VyIGluIGNvcnJlY3QgYW5zIFxuXHRcdHZhciBjb3JyZWN0YW5zID0gY2RhdGEubWF0Y2goLyV7KC4qPyl9JS9nbSk7XG5cdFx0Ly8gaWYgZXhpc3RzXG5cdFx0aWYgKGNvcnJlY3RhbnMpIHtcblx0XHRcdC8vIHN0b3JpbmcgaXQgdGhlIGNvcnJlY3QgYW5zIGluIGNvcnJlY3RBbnNTdHIgc2VwZXJ0ZWQgYnkgfCBcblx0XHRcdGZvciAodmFyIGluZGV4X25vID0gMDsgaW5kZXhfbm8gPGNvcnJlY3RhbnMubGVuZ3RoOyBpbmRleF9ubyArPSAxKSB7XG5cdFx0XHRcdGNvcnJlY3RBbnNTdHIgKz0gY29ycmVjdGFuc1tpbmRleF9ub10ucmVwbGFjZSgvJXt8fSUvZ20sICcnKSArICd8Jztcblx0XHRcdH1cblx0XHRcdC8vIHJlcGxhY2UgdGhlIHN5bWJvbCB3aXRoIHRoZSBzcGFuXG5cdFx0XHRjb3JyZWN0SHRtbCA9IGNkYXRhLnJlcGxhY2UoLyV7L2dtLCAnPHNwYW4gY2xhc3M9XCJzZWxlY3R0ZXh0IHNlbGVjdGVkXCI+JykucmVwbGFjZSgvfSUvZ20sICc8c3Bhbj4nKTtcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9IGNvcnJlY3RhbnMubGVuZ3RoO1xuXG5cdFx0XHQvLyByZW1vdmluZyBsYXN0IHBpcGUgc3ltYm9sIGluIHRoZSBjb3JyZWN0QW5zU3RyXG5cdFx0XHRjb3JyZWN0QW5zU3RyID0gY29ycmVjdEFuc1N0ci5yZXBsYWNlKC9cXHwkL2dtLCAnJyk7XG5cdFx0fVxuXHRcdC8vIHJlbW92aW5nIHRoZSBzeW1ib2wgZnJvbSB0aGUgY2RhdGFcblx0XHR2YXIgc2hvd2RhdGEgPSBjZGF0YS5yZXBsYWNlKC8le3x9JS9nbSwgJycpO1xuXHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHRcdFx0XG5cdFx0XHQvLyBzaG93IHRoZSB0ZXh0IGluIHRoZSBodG1sXG5cdFx0XHRBSC5zZWxlY3QoJyAjcHJldmlld0FyZWEgICN0ZXh0SUQwJykuaW5uZXJIVE1MID0gIHNob3dkYXRhO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHR9LmJpbmQoc2VsZiksIDEwMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBsb2FkTW9kdWxlKF90eXBlKSB7XG5cdFx0c3dpdGNoKF90eXBlKSB7XG5cdFx0XHQvLyBpZiB0aGUgdHlwZSBpcyB0ZXh0IGNsaWNrIG9yIHRleHQgc2VsZWN0XG5cdFx0XHRjYXNlIFwiMVwiOlxuXHRcdFx0Y2FzZSBcIjJcIjoge1xuXHRcdFx0XHRcdGxldCBkYXRhX3VzZXJhbnMgPSBcIlwiO1xuXHRcdFx0XHRcdGxldCBkYXRhX3VzZXJodG1sID0gXCJcIjtcblx0XHRcdFx0XHRpZiAodXhtbCkge1xuXHRcdFx0XHRcdFx0bGV0IF91eG1sID0gWE1MVG9KU09OKHV4bWwpO1xuXHRcdFx0XHRcdFx0d2luZG93LnRlc3QgPSB1eG1sO1xuXHRcdFx0XHRcdFx0Ly8gZXh0cmFjdCB0aGUgdXNlcmFucyBhbmQgdXNlcmh0bWxcblx0XHRcdFx0XHRcdGlmIChfdXhtbD8uc21hbnM/LmRpdikge1xuXHRcdFx0XHRcdFx0XHRkYXRhX3VzZXJhbnMgPSBfdXhtbC5zbWFucy5kaXZbJ19kYXRhLXVzZXJBbnMnXTtcblx0XHRcdFx0XHRcdFx0ZGF0YV91c2VyaHRtbCA9IF91eG1sLnNtYW5zLmRpdlsnX2RhdGEtdXNlckh0bWwnXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gcmV0dXJuIHRoZSBkaXZcblx0XHRcdFx0XHRyZXR1cm4gKGBcblx0XHRcdFx0XHRcdDxkaXYgaXMgaWQ9XCJocHRtYWluMFwiIHRvdGFsQ29ycmVjdEFucz0ke3RvdGFsQ29ycmVjdEFuc30+XG5cdFx0XHRcdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0XHRcdFx0aWQ9XCJ0ZXh0SUQwXCIgXG5cdFx0XHRcdFx0XHRcdFx0dHlwZT1cIiR7dHlwZU5hbWV9XCIgXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS1jb3JyZWN0aHRtbD1cIiR7Y29ycmVjdEh0bWx9XCIgXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS1jb3JyZWN0YW5zPVwiJHtjb3JyZWN0QW5zU3RyfVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS11c2VyYW5zPVwiJHtkYXRhX3VzZXJhbnN9XCIgXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS11c2VyaHRtbD1cIiR7ZGF0YV91c2VyaHRtbH1cIiBcblx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImRyYWctcmVzaXplIGhvdHNwb3RUeHRcIiBcblx0XHRcdFx0XHRcdFx0XHRzdHlsZT1cIm1heC13aWR0aDoke2RpdldpZHRofTsgaGVpZ2h0OiR7ZGl2SGVpZ2h0fTsgbGluZS1oZWlnaHQ6IDEuNDtcIlxuXHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0YCk7XG5cdFx0XHRcdH1cblx0XHRcdGRlZmF1bHQgOiByZXR1cm4oXCI8ZGl2PkluY29ycmVjdCBxdWVzdGlvbiB0eXBlPC9kaXY+XCIpO1xuXHRcdH1cblx0fVxuXHRcbjwvc2NyaXB0PlxuPG1haW4+XG5cdDxjZW50ZXI+XG5cdFx0PEl0ZW1IZWxwZXIgXG5cdFx0XHRvbjpzZXRSZXZpZXcgPSB7c2V0UmV2aWV3fVxuXHRcdFx0b246dW5zZXRSZXZpZXcgPSB7dW5zZXRSZXZpZXd9XG5cdFx0Lz5cblx0XHQ8ZGl2IGlkPVwicHJldmlld0FyZWFcIiBjbGFzcz1cInJlbGF0aXZlXCI+XG5cdFx0XHQ8IS0tIGlmIHRoZSB0eXBlIGlzIHRleHQgY2xpY2sgb3IgdGV4dCBzZWxlY3QgLS0+XG5cdFx0XHR7I2lmIG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiNFwifVxuXHRcdFx0XHQ8dGFibGUgaWQ9XCJocHRtYWluMFwiIGNsYXNzPSdzbWJhc2Ugc21ob3RzcG90IGJvcmRlci0wIGgtYXV0byB3LWF1dG8nPlxuXHRcdFx0XHRcdDx0Ym9keT5cblx0XHRcdFx0XHRcdDx0cj5cblx0XHRcdFx0XHRcdFx0PHRkIGNsYXNzPVwiYm9yZGVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cIlNNMFwiIGNsYXNzPVwicmVsYXRpdmVcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkPSdTTTAnIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cIlNNIHBvc2l0aW9uLXJlbGF0aXZlIG0tMCBwLTBcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU9XCJ7YFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IDBweDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogJHsoaXRlbUJvcmRlcikgPyBpdGVtQm9yZGVyICsgJ3B4IHNvbGlkJyA6ICcnfTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogJHtpdGVtQm9yZGVyQ29sb3J9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRgfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ9XCJpbTBcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD1cIjBcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHlsZT1cIm1heC13aWR0aDpub25lOyB3aWR0aDoge3N0YXRlLmltZ3dpZHRofTsgaGVpZ2h0OiB7c3RhdGUuaW1naGVpZ2h0fTtcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImhvdFNwb3RJbWdcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzcmM9e2JnSW1nUGF0aCtpbWdfdXJsfSBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbHQ9e2FsdH0gXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b246Y2xpY2s9e2NoZWNrQW5zd2VyfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkPSdob3RBcmVhJyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImhvdEFyZWEgaG90QXJlYSBob3RBcmVhUHJldmlld1wiIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0eWxlPVwie2Bcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6ICR7dGFyZ2V0Vmlld307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZWZ0OiR7aXRlbUFyZWFMZWZ0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRvcDoke2l0ZW1BcmVhVG9wfTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlaWdodDoke2l0ZW1BcmVhSGVpZ2h0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHdpZHRoOiR7aXRlbUFyZWFXaWR0aH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YH1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Jm5ic3A7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkPSd0YXJnZXQnIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwidGFyZ2V0IHRhcmdldEltZyBpY29tb29uLXBsdXMtY2lyY2xlLTJcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzOnNob3dCbG9jaz1cIntpc1V4bWxUYXJnZXR9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHlsZSA9IFwie2Bcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxlZnQ6JHthbnNfeH1weDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRvcDoke2Fuc195fXB4O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGB9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC90ZD5cblx0XHRcdFx0XHRcdDwvdHI+XG5cdFx0XHRcdFx0PC90Ym9keT5cblx0XHRcdFx0PC90YWJsZT5cdFxuXHRcdFx0ezplbHNlIGlmIG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiM1wifVxuXHRcdFx0XHQ8Y2VudGVyIGtleT1cImltYWdlSGVpZ2h0XzNcIj5cblx0XHRcdFx0XHQ8ZGl2IFxuXHRcdFx0XHRcdFx0c3R5bGU9XCJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAzMnB4OyBcblx0XHRcdFx0XHRcdFx0d2lkdGg6IHt3aW5kb3cuaW5OYXRpdmUgPyB3aW5kb3cuaW5uZXJXaWR0aCA6IHN0YXRlLmltZ3dpZHRofTsgXG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6ICNkOWU3ZmQ7IFxuXHRcdFx0XHRcdFx0XHRib3JkZXItdG9wOiAycHggc29saWQgIzk2YmJmNjtcblx0XHRcdFx0XHRcdFwiXG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0PGRpdiBcblx0XHRcdFx0XHRcdFx0aWQ9XCJyZXNldFwiIFxuXHRcdFx0XHRcdFx0XHRzdHlsZT1cImhlaWdodDogMjdweDsgd2lkdGg6IDkwcHg7XCJcblx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJyZXNldCBidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBidG4tc20gbXQtc20yIG1yLXNtMiBmbG9hdC1lbmRcIj5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJpY29tb29uLW5ldy0yNHB4LXJlc2V0LTEgczNcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiB0ZXh0LXRvcFwiPjwvc3Bhbj4gXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicG9zaXRpb24tcmVsYXRpdmUgYm90dG9tMVwiPlJlc2V0PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBcblx0XHRcdFx0XHRcdGlkPVwiaHB0bWFpbjBcIlxuXHRcdFx0XHRcdFx0dG90YWxDb3JyZWN0QW5zPXt0b3RhbENvcnJlY3RBbnN9XG5cdFx0XHRcdFx0XHRkZD17c3RhdGUuaW1nd2lkdGh9XG5cdFx0XHRcdFx0XHRzdHlsZT1cIlxuXHRcdFx0XHRcdFx0XHR3aWR0aDoge3N0YXRlLmltZ3dpZHRoIHx8ICcyNTBweCd9OyBcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiB7c3RhdGUuaW1naGVpZ2h0IHx8ICc2MDBweCd9OyBcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1pbWFnZTogdXJsKCd7YmdJbWdQYXRoK2ltZ191cmx9Jyk7IFxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlOyBcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiAycHggc29saWQgI2Q5ZTdmZDtcblx0XHRcdFx0XHRcdFwiXG5cdFx0XHRcdFx0PjwvZGl2PlxuXHRcdFx0XHRcdHsjaWYgc2Nyb2xsRW5hYmxlZH1cblx0XHRcdFx0XHRcdDxkaXYgXG5cdFx0XHRcdFx0XHRcdGNsYXNzPVwicG9zaXRpb24tZml4ZWQgaW5kZXgwXCIgXG5cdFx0XHRcdFx0XHRcdHN0eWxlPVwicmlnaHQ6IDA7IHRvcDogMDsgbGVmdDogMDsgYm90dG9tOiAwOyBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuNClcIlxuXHRcdFx0XHRcdFx0PjwvZGl2PlxuXHRcdFx0XHRcdHsvaWZ9XG5cdFx0XHRcdDwvY2VudGVyPlxuXHRcdFx0ezplbHNlfVxuXHRcdFx0XHR7QGh0bWwgbG9hZE1vZHVsZShtb2R1bGVBcnJbaXRlbV90eXBlXSl9XG5cdFx0XHR7L2lmfVxuXHRcdDwvZGl2PlxuXHQ8L2NlbnRlcj5cblx0PGlucHV0IFxuXHRcdHR5cGU9XCJoaWRkZW5cIiBcblx0XHRpZD1cInNwZWNpYWxfbW9kdWxlX3BhcnNlXCIgXG5cdFx0bmFtZT1cInNwZWNpYWxfbW9kdWxlX3BhcnNlXCIgXG5cdFx0dXNlcmFucz1cIlwiIFxuXHRcdHZhbHVlPXt1c2VyQ29ycmVjdH0gXG5cdC8+XG48L21haW4+XG5cbjxzdHlsZT5cblx0bWFpbiB7XG5cdFx0dGV4dC1hbGlnbjogY2VudGVyICFpbXBvcnRhbnQ7XG5cdFx0cGFkZGluZzogMWVtO1xuXHRcdG1heC13aWR0aDogMjQwcHg7XG5cdFx0bWFyZ2luOiAwIGF1dG87XG5cdFx0Zm9udC1zaXplOiAyNnB4O1xuXHR9XG5cdC50YXJnZXRJbWcge1xuXHRcdGRpc3BsYXkgOiBub25lO1xuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHR6LWluZGV4OiAxMDtcblx0XHR3aWR0aDogMjZweDtcblx0XHRoZWlnaHQ6MjZweDtcblx0XHRib3JkZXItcmFkaXVzOiA1MCU7XG5cdFx0YmFja2dyb3VuZDogI2ZmZjtcblx0XHRjb2xvcjogIzFjM2FkNDtcblx0fVx0XG5cdFxuXHQuc2hvd0Jsb2NrIHtcblx0XHRkaXNwbGF5IDogYmxvY2s7XG5cdH1cblxuXHRAbWVkaWEgKG1pbi13aWR0aDogNjQwcHgpIHtcblx0XHRtYWluIHtcblx0XHRcdG1heC13aWR0aDogbm9uZTtcblx0XHR9XG5cdH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ21CQyxJQUFJLGVBQUMsQ0FBQyxBQUNMLFVBQVUsQ0FBRSxNQUFNLENBQUMsVUFBVSxDQUM3QixPQUFPLENBQUUsR0FBRyxDQUNaLFNBQVMsQ0FBRSxLQUFLLENBQ2hCLE1BQU0sQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUNkLFNBQVMsQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxVQUFVLGVBQUMsQ0FBQyxBQUNYLE9BQU8sQ0FBRyxJQUFJLENBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLEVBQUUsQ0FDWCxLQUFLLENBQUUsSUFBSSxDQUNYLE9BQU8sSUFBSSxDQUNYLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLEtBQUssQ0FBRSxPQUFPLEFBQ2YsQ0FBQyxBQUVELFVBQVUsZUFBQyxDQUFDLEFBQ1gsT0FBTyxDQUFHLEtBQUssQUFDaEIsQ0FBQyxBQUVELE1BQU0sQUFBQyxZQUFZLEtBQUssQ0FBQyxBQUFDLENBQUMsQUFDMUIsSUFBSSxlQUFDLENBQUMsQUFDTCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0YsQ0FBQyJ9 */";
	append_dev(document_1.head, style);
}

// (594:3) {:else}
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
		source: "(594:3) {:else}",
		ctx
	});

	return block;
}

// (556:41) 
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
			add_location(span0, file, 569, 7, 18939);
			attr_dev(span1, "class", "position-relative bottom1");
			add_location(span1, file, 570, 7, 19030);
			attr_dev(div0, "id", "reset");
			set_style(div0, "height", "27px");
			set_style(div0, "width", "90px");
			attr_dev(div0, "class", "reset btn btn-outline-primary btn-sm mt-sm2 mr-sm2 float-end");
			add_location(div0, file, 565, 6, 18788);
			set_style(div1, "height", "32px");

			set_style(div1, "width", window.inNative
			? window.innerWidth
			: /*state*/ ctx[1].imgwidth);

			set_style(div1, "background", "#d9e7fd");
			set_style(div1, "border-top", "2px solid #96bbf6");
			add_location(div1, file, 557, 5, 18587);
			attr_dev(div2, "id", "hptmain0");
			attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[15]);
			attr_dev(div2, "dd", div2_dd_value = /*state*/ ctx[1].imgwidth);
			set_style(div2, "width", /*state*/ ctx[1].imgwidth || "250px");
			set_style(div2, "height", /*state*/ ctx[1].imgheight || "600px");
			set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[17] + /*img_url*/ ctx[12]) + "')");
			set_style(div2, "background-repeat", "no-repeat");
			set_style(div2, "position", "relative");
			set_style(div2, "border", "2px solid #d9e7fd");
			add_location(div2, file, 573, 5, 19113);
			attr_dev(center, "key", "imageHeight_3");
			add_location(center, file, 556, 4, 18553);
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
		source: "(556:41) ",
		ctx
	});

	return block;
}

// (499:3) {#if moduleArr[item_type] == "4"}
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
			add_location(img, file, 517, 10, 17529);
			attr_dev(div0, "id", "hotArea");
			attr_dev(div0, "class", "hotArea hotArea hotAreaPreview");

			attr_dev(div0, "style", div0_style_value = `
												display: ${/*targetView*/ ctx[9]};
												left:${/*itemAreaLeft*/ ctx[8]};
												top:${/*itemAreaTop*/ ctx[5]};
												height:${/*itemAreaHeight*/ ctx[6]};
												width:${/*itemAreaWidth*/ ctx[7]};
											`);

			add_location(div0, file, 526, 10, 17815);
			attr_dev(span, "id", "target");
			attr_dev(span, "class", "target targetImg icomoon-plus-circle-2 svelte-1m52s8g");

			attr_dev(span, "style", span_style_value = `
												left:${/*ans_x*/ ctx[10]}px;
												top:${/*ans_y*/ ctx[11]}px;
											`);

			toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[4]);
			add_location(span, file, 539, 10, 18166);
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

			add_location(div1, file, 504, 9, 17160);
			attr_dev(div2, "id", "SM0");
			attr_dev(div2, "class", "relative");
			add_location(div2, file, 503, 8, 17119);
			attr_dev(td, "class", "border");
			add_location(td, file, 502, 7, 17091);
			add_location(tr, file, 501, 6, 17079);
			add_location(tbody, file, 500, 5, 17065);
			attr_dev(table, "id", "hptmain0");
			attr_dev(table, "class", "smbase smhotspot border-0 h-auto w-auto");
			add_location(table, file, 499, 4, 16990);
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
		source: "(499:3) {#if moduleArr[item_type] == \\\"4\\\"}",
		ctx
	});

	return block;
}

// (587:5) {#if scrollEnabled}
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
			add_location(div, file, 587, 6, 19515);
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
		source: "(587:5) {#if scrollEnabled}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let center;
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
			center = element("center");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div = element("div");
			if_block.c();
			t1 = space();
			input = element("input");
			attr_dev(div, "id", "previewArea");
			attr_dev(div, "class", "relative");
			add_location(div, file, 496, 2, 16856);
			add_location(center, file, 491, 1, 16761);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "special_module_parse");
			attr_dev(input, "name", "special_module_parse");
			attr_dev(input, "userans", "");
			input.value = /*userCorrect*/ ctx[14];
			add_location(input, file, 598, 1, 19765);
			attr_dev(main, "class", "svelte-1m52s8g");
			add_location(main, file, 490, 0, 16753);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, center);
			mount_component(itemhelper, center, null);
			append_dev(center, t0);
			append_dev(center, div);
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
	let divHeight = 0;
	let divWidth = 0;
	var typeName = "textclick";
	var correctAnsStr = "";
	var correctHtml = "";

	const unsubscribe = items => {
		$$invalidate(1, state = items);
	};

	onMount(async () => {
		parseXml = XMLToJSON(xml);
		xmlParser();
		preRender();
		HotJS.readyThis("hptmain0", isReview);

		if (isReview) {
			HotJS.modeOnHot(1);
		} else {
			HotJS.modeOnHot();
		}

		AH.listen("#previewArea", "click", ".textClick", function () {
			checkAnswer();
		});

		AH.listen("#previewArea", "click", "[type=\"textselect\"]", function () {
			checkAnswer();
		});
	});

	function xmlParser() {
		$$invalidate(13, item_type = parseXml["smxml"]["div"]["_type"]);
		xmlHeight = parseXml["smxml"]["_height"];
		xmlWidth = parseXml["smxml"]["_width"];

		if (item_type == undefined || item_type == "") {
			$$invalidate(13, item_type = parseXml["smxml"]["_name"].toLowerCase());
		}

		typeName = item_type;
		$$invalidate(12, img_url = parseXml["smxml"]["_bgimg"]);

		switch (moduleArr[item_type]) {
			case "1":
				//getting the width and height
				divHeight = parseXml.smxml._height + "px";
				divWidth = parseXml.smxml._width + "px";
				// for parsing the xml
				parseTextClick(parseXml.smxml.div.__cdata);
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
				parseTextSelect(parseXml.smxml.div.__cdata);
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
		let result = {};

		if (typeName == "textclick" || typeName == "textselect") {
			result = HotJS.check_Ans("#previewArea #hptmain0");
		} else {
			result = movetarget(event, ans_h, ans_w, parseInt(itemAreaLeft), parseInt(itemAreaTop));
			$$invalidate(4, isUxmlTarget = true);
			$$invalidate(10, ans_x = result.left);
			$$invalidate(11, ans_y = result.top);
			$$invalidate(23, ansStatus = result.ans);
			if (editorState) showAns(ansStatus ? "Correct" : "Incorrect");
		}

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

	function parseTextClick(cdata) {
		var cdataStr = "";

		// get the correct answer in correctans
		var correctans = cdata.match(/%{(.*?)}%/gm);

		if (correctans) {
			$$invalidate(15, totalCorrectAns = correctans.length);

			for (var i = 0; i < correctans.length; i++) {
				// replacing the space with <uc:space> and then replacing the correctans with it
				correctAnsStr = correctans[i].replace(/\s+/gm, "<uc:space>");

				cdata = cdata.replace(correctans[i], correctAnsStr);
			}
		}

		correctAnsStr = "";
		cdata = cdata.split(" ");

		for (var i = 0; i < cdata.length; i++) {
			//if the data is correct answer
			if (cdata[i].match(/%{|%}/gm)) {
				// for setting the data-correctans 1 if that value is correct
				cdata[i] = cdata[i].replace(/<uc:space>/gm, " ").replace(/%{|}%/gm, "");

				cdataStr += "<p class=\"textClick\" data-index=\"" + i + "\" data-userans=\"0\" data-correctans=\"1\">" + cdata[i] + "</p>";
				correctAnsStr += cdata[i] + "|";
			} else {
				// for setting the data-correctans 0 if that value is correct
				cdataStr += "<p class=\"textClick\" data-index=\"" + i + "\" data-userans=\"0\" data-correctans=\"0\">" + cdata[i] + "</p>";
			}
		}

		correctAnsStr = correctAnsStr.replace(/\|$/gm, "");

		// showing the text in the preview area 	
		AH.select(" #previewArea  #textID0").innerHTML = cdataStr;
	}

	function parseTextSelect(cdata) {
		correctAnsStr = "";

		// store the correct answer in correct ans 
		var correctans = cdata.match(/%{(.*?)}%/gm);

		// if exists
		if (correctans) {
			// storing it the correct ans in correctAnsStr seperted by | 
			for (var index_no = 0; index_no < correctans.length; index_no += 1) {
				correctAnsStr += correctans[index_no].replace(/%{|}%/gm, "") + "|";
			}

			// replace the symbol with the span
			correctHtml = cdata.replace(/%{/gm, "<span class=\"selecttext selected\">").replace(/}%/gm, "<span>");

			$$invalidate(15, totalCorrectAns = correctans.length);

			// removing last pipe symbol in the correctAnsStr
			correctAnsStr = correctAnsStr.replace(/\|$/gm, "");
		}

		// removing the symbol from the cdata
		var showdata = cdata.replace(/%{|}%/gm, "");

		var timer = setTimeout(
			(function () {
				// show the text in the html
				AH.select(" #previewArea  #textID0").innerHTML = showdata;

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
								data-correctans="${correctAnsStr}"
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
		if ("divHeight" in $$props) divHeight = $$props.divHeight;
		if ("divWidth" in $$props) divWidth = $$props.divWidth;
		if ("typeName" in $$props) typeName = $$props.typeName;
		if ("correctAnsStr" in $$props) correctAnsStr = $$props.correctAnsStr;
		if ("correctHtml" in $$props) correctHtml = $$props.correctHtml;
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
		if (!document_1.getElementById("svelte-1m52s8g-style")) add_css();

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
//# sourceMappingURL=HotspotPreview-e7b66715.js.map
