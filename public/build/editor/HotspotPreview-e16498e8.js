
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, o as onMount, X as XMLToJSON, A as AH, _ as onUserAnsChange, L as beforeUpdate, w as writable, c as create_component, f as space, j as attr_dev, k as add_location, n as insert_dev, m as mount_component, G as prop_dev, t as transition_in, a as transition_out, x as detach_dev, b as destroy_component, l as set_style, z as empty, h as text, a1 as toggle_class, q as listen_dev, a2 as HtmlTag } from './main-722d4b3e.js';
import { I as ItemHelper } from './ItemHelper-d9f59022.js';

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
        return {uXml: this.userAnsXML, status: this.result};
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

/* clsSMHotspot\libs\util.svelte generated by Svelte v3.29.0 */

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

/* clsSMHotspot\HotspotPreview.svelte generated by Svelte v3.29.0 */

const { Object: Object_1, console: console_1, document: document_1 } = globals;
const file = "clsSMHotspot\\HotspotPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-1m52s8g-style";
	style.textContent = "main.svelte-1m52s8g{text-align:center !important;padding:1em;max-width:240px;margin:0 auto;font-size:26px}.targetImg.svelte-1m52s8g{display:none;position:absolute;z-index:10;width:26px;height:26px;border-radius:50%;background:#fff;color:#1c3ad4}.showBlock.svelte-1m52s8g{display:block}@media(min-width: 640px){main.svelte-1m52s8g{max-width:none}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFByZXZpZXcuc3ZlbHRlIiwic291cmNlcyI6WyJIb3RzcG90UHJldmlldy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuXHRpbXBvcnQgeyBvbk1vdW50LCBiZWZvcmVVcGRhdGUgfSBmcm9tICdzdmVsdGUnO1xyXG5cdGltcG9ydCBob3RzcG90U2NyaXB0IGZyb20gJy4vaG90c3BvdFNjcmlwdC5qcyc7XHJcblx0aW1wb3J0IERvb1NjcmliUGx1Z2luIGZyb20gJy4vaG90c3BvdERyYXdpbmdTY3JpcHQuanMnO1xyXG5cdGltcG9ydCB7IFhNTFRvSlNPTiwgb25Vc2VyQW5zQ2hhbmdlLCBBSCB9IGZyb20gJy4uL2hlbHBlci9IZWxwZXJBSS5zdmVsdGUnO1xyXG5cdGltcG9ydCBJdGVtSGVscGVyIGZyb20gJy4uL2hlbHBlci9JdGVtSGVscGVyLnN2ZWx0ZSc7XHJcblx0aW1wb3J0IHttb3ZldGFyZ2V0fSBmcm9tICcuL2xpYnMvdXRpbC5zdmVsdGUnO1xyXG5cdGltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcclxuXHRleHBvcnQgbGV0IHhtbDtcclxuXHRleHBvcnQgbGV0IHV4bWw7XHJcblx0ZXhwb3J0IGxldCBhbnNTdGF0dXM7XHJcblx0ZXhwb3J0IGxldCBpc1JldmlldztcclxuXHRleHBvcnQgbGV0IHNob3dBbnM7XHJcblx0ZXhwb3J0IGxldCBlZGl0b3JTdGF0ZTtcclxuXHJcblx0Y29uc3QgSG90SlMgPSBuZXcgaG90c3BvdFNjcmlwdCgpO1xyXG5cdGxldCBwYXJzZVhtbCA9IFwiXCI7XHJcblx0bGV0IGJnSW1nUGF0aCA9ICcvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvJztcclxuXHRsZXQgYWx0ID0gXCJcIjtcclxuXHRsZXQgbW9kdWxlQXJyID0ge1xyXG5cdFx0dGV4dGNsaWNrOiBcIjFcIixcclxuXHRcdHRleHRzZWxlY3Q6IFwiMlwiLFxyXG5cdFx0aW1hZ2VoaWdobGlnaHQ6IFwiM1wiLFxyXG5cdFx0aG90c3BvdDogXCI0XCIsXHJcblx0fTtcclxuXHRsZXQgc3RhdGUgPSB7fTtcclxuXHRsZXQgaGRkID0gd3JpdGFibGUoe1xyXG5cdFx0aW1nd2lkdGg6IFwiYXV0b1wiLFxyXG5cdFx0aW1naGVpZ2h0OiBcImF1dG9cIixcclxuXHR9KVxyXG5cdGxldCBpdGVtQm9yZGVyID0gMDtcclxuXHRsZXQgaXRlbUJvcmRlckNvbG9yID0gXCJncmF5XCI7XHJcblx0bGV0IGlzVXhtbFRhcmdldCA9IGZhbHNlO1xyXG5cdGxldCBpdGVtQXJlYVRvcCA9ICcnO1xyXG5cdGxldCBpdGVtQXJlYUhlaWdodCA9ICcnO1xyXG5cdGxldCBpdGVtQXJlYVdpZHRoID0gJyc7XHJcblx0bGV0IGl0ZW1BcmVhTGVmdCA9ICcnO1xyXG5cdGxldCB0YXJnZXRMZWZ0IFx0XHQ9IDEwMDtcclxuXHRsZXQgdGFyZ2V0VG9wIFx0XHQ9IDEwMDtcclxuXHRsZXQgdGFyZ2V0VmlldyAgICAgID0gXCJub25lXCI7XHJcblx0bGV0IGFuc194IFx0XHRcdD0gMDtcclxuXHRsZXQgYW5zX3kgXHRcdFx0PSAwO1xyXG5cdGxldCBhbnNfaCBcdFx0XHQ9IDA7XHJcblx0bGV0IGFuc193IFx0XHRcdD0gMDtcclxuXHRsZXQgdHlwZVx0XHRcdD0gXCJcIjtcclxuXHRsZXQgaW1nX3VybCBcdFx0PSBcIlwiO1xyXG5cdGxldCBtYW51YWxfZ3JhZGUgXHQ9IDA7XHJcblx0bGV0IG9uRXJyb3JcdFx0XHQ9IG51bGw7IFxyXG5cdGxldCBpdGVtX3R5cGUgICAgICAgPSBcIlwiO1xyXG5cdGxldCB4bWxIZWlnaHQgICAgICAgPSAwO1xyXG5cdGxldCB4bWxXaWR0aCAgICAgICAgPSAwO1xyXG5cdGxldCB1c2VyQ29ycmVjdCAgICAgPSBcIlwiO1xyXG5cdGxldCBjb3JyZWN0YW5zXHRcdD0gXCJcIjtcclxuXHRsZXQgdG90YWxDb3JyZWN0QW5zO1xyXG5cdGxldCBzY3JvbGxFbmFibGVkICAgPSBmYWxzZTtcclxuXHRsZXQgbGluZWNvbG9yID0gXCJibGFja1wiO1xyXG5cdGxldCBkcmF3c3RyXHQ9IFwiXCI7XHJcblx0bGV0IGNvdW50ID0gMDtcclxuXHRsZXQgeGF4aXMgPSBbXTtcclxuXHRsZXQgeWF4aXMgPSBbXTtcclxuXHRsZXQgZGl2SGVpZ2h0ID0gMDtcclxuXHRsZXQgZGl2V2lkdGggPSAwO1xyXG5cdHZhciB0eXBlTmFtZSA9ICd0ZXh0Y2xpY2snO1xyXG5cdHZhciBjb3JyZWN0QW5zU3RyID0gJyc7XHJcblx0dmFyIGNvcnJlY3RIdG1sID0gJyc7XHJcblx0Y29uc3QgdW5zdWJzY3JpYmUgPSAoKGl0ZW1zKT0+e1xyXG5cdFx0c3RhdGUgPSBpdGVtcztcclxuXHR9KVxyXG5cclxuXHQkOiB7XHJcblx0XHRpZiAoaXNSZXZpZXcpIHtcclxuXHRcdFx0Ly90YXJnZXRWaWV3ID0gXCJibG9ja1wiO1xyXG5cdFx0XHRzZXRSZXZpZXcoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vdGFyZ2V0VmlldyA9IFwibm9uZVwiO1xyXG5cdFx0XHR1bnNldFJldmlldygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JDpcdGlmICh4bWwpIHtcclxuXHRcdC8vIEhlcmUgcmVwbGFjaW5nIHRoZSBub3Qgc3RhbmRhcmQgY2RhdGEgaW50byB0aGUgdmFsaWQgY2RhdGEgZm9ybWF0XHJcblx0XHRsZXQgbXlYbWwgPSB4bWwucmVwbGFjZShcIjwhLS1bQ0RBVEFbXCIsIFwiPCFbQ0RBVEFbXCIpLnJlcGxhY2UoXCJdXS0tPlwiLCBcIl1dPlwiKTtcclxuXHRcdFx0XHJcblx0XHQvLyBjaGVja2luZyB4bWwgZm9yIGlmIGNkYXRhIGlzIGZvdW5kIG9yIG5vdCBcclxuXHRcdGlmIChteVhtbC5tYXRjaCgvPFxcIVxcW0NEQVRBXFxbe3w8XFwhLS1cXFtDREFUQVxcW3svZ20pKSB7XHJcblx0XHRcdC8vIHNhdmluZyB2YWx1ZSBiL3cgdGhlIHssIH0gc3ltYm9sXHJcblx0XHRcdGNvcnJlY3RhbnMgPSAgbXlYbWwudG9TdHJpbmcoKS5tYXRjaCgveyguKil9L2dtaSk7XHJcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9IGNvcnJlY3RhbnMudG9TdHJpbmcoKS5tYXRjaCgvfSxcIlxcZCtcIi9nbSk7XHJcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9ICh0b3RhbENvcnJlY3RBbnMpID8gdG90YWxDb3JyZWN0QW5zLnBvcCgpIDogbnVsbDtcclxuXHRcdFx0dG90YWxDb3JyZWN0QW5zID0gKHRvdGFsQ29ycmVjdEFucykgPyB0b3RhbENvcnJlY3RBbnMucmVwbGFjZSgvXCJ8fXwsL2dtLFwiXCIpIDogMTtcclxuXHRcdFx0bXlYbWwgPSBteVhtbC5yZXBsYWNlKGNvcnJlY3RhbnMsIFwiXCIpO1xyXG5cdFx0XHRjb3JyZWN0YW5zID0gY29ycmVjdGFuc1swXTtcclxuXHRcdH1cclxuXHRcdHBhcnNlWG1sID0gWE1MVG9KU09OKHhtbCk7XHJcblx0XHR4bWxQYXJzZXIoKTtcclxuXHRcdHByZVJlbmRlcigpO1xyXG5cdH1cclxuXHJcblx0b25Nb3VudChhc3luYyAoKSA9PiB7XHJcblx0XHRwYXJzZVhtbCA9IFhNTFRvSlNPTih4bWwpO1xyXG5cdFx0eG1sUGFyc2VyKCk7XHJcblx0XHRwcmVSZW5kZXIoKTtcclxuXHRcdEhvdEpTLnJlYWR5VGhpcygnaHB0bWFpbjAnLCBpc1Jldmlldyk7XHJcblx0XHRpZiAoaXNSZXZpZXcpIHtcclxuXHRcdFx0SG90SlMubW9kZU9uSG90KDEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SG90SlMubW9kZU9uSG90KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0QUgubGlzdGVuKCcjcHJldmlld0FyZWEnLCAnY2xpY2snLCAnLnRleHRDbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjaGVja0Fuc3dlcigpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdEFILmxpc3RlbignI3ByZXZpZXdBcmVhJywgJ2NsaWNrJywgJ1t0eXBlPVwidGV4dHNlbGVjdFwiXScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjaGVja0Fuc3dlcigpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIHhtbFBhcnNlcigpIHtcclxuXHRcdGl0ZW1fdHlwZSA9IHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsnX3R5cGUnXTtcclxuXHRcdHhtbEhlaWdodCA9IHBhcnNlWG1sWydzbXhtbCddWydfaGVpZ2h0J107XHJcblx0XHR4bWxXaWR0aCA9IHBhcnNlWG1sWydzbXhtbCddWydfd2lkdGgnXTtcclxuXHRcdGlmIChpdGVtX3R5cGUgPT0gdW5kZWZpbmVkIHx8IGl0ZW1fdHlwZSA9PSBcIlwiKSB7XHJcblx0XHRcdGl0ZW1fdHlwZSA9IHBhcnNlWG1sWydzbXhtbCddWydfbmFtZSddLnRvTG93ZXJDYXNlKCk7XHJcblx0XHR9XHJcblx0XHR0eXBlTmFtZSA9IGl0ZW1fdHlwZTtcclxuXHRcdGltZ191cmwgPSBwYXJzZVhtbFsnc214bWwnXVsnX2JnaW1nJ107XHJcblx0XHRzd2l0Y2ggKG1vZHVsZUFycltpdGVtX3R5cGVdKSB7XHJcblx0XHRcdC8vIGluIGNhc2Ugb2YgdGV4dCBjbGljayBcclxuXHRcdFx0Y2FzZSBcIjFcIjogXHJcblx0XHRcdFx0XHQvL2dldHRpbmcgdGhlIHdpZHRoIGFuZCBoZWlnaHRcclxuXHRcdFx0XHRcdGRpdkhlaWdodCA9IHBhcnNlWG1sLnNteG1sLl9oZWlnaHQrJ3B4JztcclxuXHRcdFx0XHRcdGRpdldpZHRoID0gcGFyc2VYbWwuc214bWwuX3dpZHRoKydweCc7XHJcblx0XHRcdFx0XHQvLyBmb3IgcGFyc2luZyB0aGUgeG1sXHJcblx0XHRcdFx0XHRwYXJzZVRleHRDbGljayhwYXJzZVhtbC5zbXhtbC5kaXYuX19jZGF0YSk7XHJcblx0XHRcdFx0XHRBSC5zZWxlY3QoQUgucGFyZW50KCcjdGV4dElEMCcpLCAnc2hvdycsICdibG9jaycpO1xyXG5cdFx0XHRcdFx0QUguc2VsZWN0QWxsKCcjZHJhd1ByZXZpZXcsdGFibGVbaWQ9XCJocHRtYWluMlwiXScsICdoaWRlJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcIjJcIjogXHJcblx0XHRcdFx0XHQvLyBpbiBjYXNlIG9mIHRleHQgc2VsZWN0IG1vZHVsZVxyXG5cdFx0XHRcdFx0aWYgKCFpc05hTihwYXJzZVhtbC5zbXhtbC5faGVpZ2h0KSkge1xyXG5cdFx0XHRcdFx0XHRwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID0gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnO1x0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkaXZIZWlnaHQgPSBwYXJzZVhtbC5zbXhtbC5faGVpZ2h0O1xyXG5cdFx0XHRcdFx0ZGl2V2lkdGggPSBwYXJzZVhtbC5zbXhtbC5fd2lkdGgrJ3B4JztcclxuXHRcdFx0XHRcdC8vIGZvciBwYXJzaW5nIHRoZSB4bWxcclxuXHRcdFx0XHRcdHBhcnNlVGV4dFNlbGVjdChwYXJzZVhtbC5zbXhtbC5kaXYuX19jZGF0YSk7XHJcblx0XHRcdFx0XHRBSC5zZWxlY3QoQUgucGFyZW50KCcjdGV4dElEMCcpLCAnc2hvdycsICdibG9jaycpO1xyXG5cdFx0XHRcdFx0QUguc2VsZWN0QWxsKCcjZHJhd1ByZXZpZXcsdGFibGVbaWQ9XCJocHRtYWluMlwiXScsICdoaWRlJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcIjNcIjoge1xyXG5cdFx0XHRcdFx0Ly8gSW4gY2FzZSBvZiBpbWFnZSBoaWdobGlnaHQgXHJcblx0XHRcdFx0XHQvL2JnSW1nID0gcGFyc2VYbWwuc214bWwuX2JnaW1nO1xyXG5cdFx0XHRcdFx0Ly92YXIgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlkZGVuSW1hZ2UnKTtcclxuXHRcdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRcdFx0aW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRcdHN0YXRlLmltZ2hlaWdodCA9IChwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID4gdGhpcy5oZWlnaHQpID8gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnIDogdGhpcy5oZWlnaHQrJ3B4JztcclxuXHRcdFx0XHRcdFx0c3RhdGUuaW1nd2lkdGggPSAocGFyc2VYbWwuc214bWwuX3dpZHRoID4gdGhpcy53aWR0aCkgPyBwYXJzZVhtbC5zbXhtbC5fd2lkdGggKyAncHgnIDogdGhpcy53aWR0aCArICdweCc7XHJcblx0XHRcdFx0XHRcdEFILmZpbmQoJyNocHRkcmF3MCcsICdjYW52YXMnLCB7YWN0aW9uOiAnYXR0cicsIGFjdGlvbkRhdGE6IHtoZWlnaHQ6ICBzdGF0ZS5pbWdoZWlnaHQsIHdpZHRoOiBzdGF0ZS5pbWd3aWR0aH0gfSk7XHJcblx0XHRcdFx0XHRcdEFILmVtcHR5KCcjdGV4dElEMCcpO1xyXG5cdFx0XHRcdFx0XHR1bnNldFJldmlldygpO1xyXG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0aW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBiZ0ltZ1BhdGggKyBwYXJzZVhtbC5zbXhtbC5fYmdpbWcpO1xyXG5cdFx0XHRcdFx0Ly8gdXNlZCBmb3Igc2V0IHRoZSBiYWNrZ3JvdW5kIGltYWdlIG9mIHRoZSBEcmF3IGhpZ2hsaWdodGVkIG1vZHVsZVxyXG5cdFx0XHRcdFx0Ly9pbWdVcmwgPSBcInVybCgnaHR0cHM6XCIgKyBiZ0ltZ1BhdGggKyBwYXJzZVhtbC5zbXhtbC5fYmdpbWcgKyBcIicpXCI7XHJcblx0XHRcdFx0XHQvL3RoaXMuZmxhZ1VwZGF0ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcIjRcIjoge1xyXG5cdFx0XHRcdFx0Ly8gaW4gY2FzZSBvZiBob3RzcG90IChzcG90IGFuIGltYWdlKVxyXG5cdFx0XHRcdFx0Ly8gc2V0dGluZyBiYWNrZ3JvdW5kSW1hZ2UgLCBhbHQsIHdpZHRoLCBoZWlnaHQsIGxlZnQgLCB0b3AgLGJvcmRlciwgYm9yZGVyY29sb3Igb24gdGhlIGJhc2lzIG9mIHhtbFxyXG5cdFx0XHRcdFx0aW1nX3VybCA9IHBhcnNlWG1sLnNteG1sLl9iZ2ltZztcclxuXHRcdFx0XHRcdGFsdCA9IHBhcnNlWG1sLnNteG1sLl9hbHQ7XHJcblx0XHRcdFx0XHRhbnNfeSA9IHBhcnNlRmxvYXQocGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfdG9wJ10pO1xyXG5cdFx0XHRcdFx0YW5zX3ggPSBwYXJzZUZsb2F0KHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsnX2xlZnQnXSkrMTM7XHJcblx0XHRcdFx0XHRhbnNfaCA9IHBhcnNlRmxvYXQocGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfaGVpZ2h0J10pO1xyXG5cdFx0XHRcdFx0YW5zX3cgPSBwYXJzZUZsb2F0KHBhcnNlWG1sWydzbXhtbCddWydkaXYnXVsnX3dpZHRoJ10pO1xyXG5cdFx0XHRcdFx0YWx0ID0gcGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWydfYWx0J107XHJcblx0XHRcdFx0XHR0eXBlID0gcGFyc2VYbWxbJ3NteG1sJ11bJ2RpdiddWyd0eXBlJ107XHJcblx0XHRcdFx0XHRpdGVtQm9yZGVyICA9IHBhcnNlWG1sLnNteG1sLmRpdi5fYm9yZGVyO1xyXG5cdFx0XHRcdFx0aXRlbUJvcmRlckNvbG9yICA9IHBhcnNlWG1sLnNteG1sLmRpdi5fYm9yZGVyY29sb3I7XHJcblx0XHRcdFx0XHRpdGVtQXJlYVdpZHRoID0gcGFyc2VYbWwuc214bWwuZGl2Ll93aWR0aCsncHgnO1xyXG5cdFx0XHRcdFx0aXRlbUFyZWFIZWlnaHQgPSBwYXJzZVhtbC5zbXhtbC5kaXYuX2hlaWdodCsncHgnO1xyXG5cdFx0XHRcdFx0aXRlbUFyZWFMZWZ0ID0gcGFyc2VYbWwuc214bWwuZGl2Ll9sZWZ0KydweCc7XHJcblx0XHRcdFx0XHRpdGVtQXJlYVRvcCA9IHBhcnNlWG1sLnNteG1sLmRpdi5fdG9wKydweCc7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRcdFx0aW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGxldCBiZ0ltZ0hlaWdodCA9IHRoaXMuaGVpZ2h0KydweCc7XHJcblx0XHRcdFx0XHRcdGxldCBiZ0ltZ1dpZHRoID0gIHRoaXMud2lkdGgrJ3B4JztcclxuXHRcdFx0XHRcdFx0c3RhdGUuaW1naGVpZ2h0ID0gIChwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ2hlaWdodCkgID8gcGFyc2VYbWwuc214bWwuZGl2Ll9pbWdoZWlnaHQrJ3B4JyA6IFwiYXV0byAhaW1wb3J0YW50XCI7XHJcblx0XHRcdFx0XHRcdHN0YXRlLmltZ3dpZHRoID0gKHBhcnNlWG1sLnNteG1sLmRpdi5faW1nd2lkdGgpID8gcGFyc2VYbWwuc214bWwuZGl2Ll9pbWd3aWR0aCsncHgnIDogIFwiYXV0byAhaW1wb3J0YW50XCI7XHJcblx0XHRcdFx0XHRcdEFILnNlbGVjdCgnI2hwdG1haW4wJywgJ2NzcycsIHtoZWlnaHQ6IGJnSW1nSGVpZ2h0LCB3aWR0aDogYmdJbWdXaWR0aH0pO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGltYWdlLnNyYyA9IGJnSW1nUGF0aCArIHBhcnNlWG1sLnNteG1sLl9iZ2ltZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7IFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwcmVSZW5kZXIoKSB7XHJcblx0XHRpZiAoaXNSZXZpZXcpIHtcclxuXHRcdFx0dGFyZ2V0VmlldyA9IFwiYmxvY2tcIjtcclxuXHRcdH1cclxuXHRcdHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0aW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjNcIikge1xyXG5cdFx0XHRcdHN0YXRlLmltZ2hlaWdodCA9IChwYXJzZVhtbC5zbXhtbC5faGVpZ2h0ID4gdGhpcy5oZWlnaHQpID8gcGFyc2VYbWwuc214bWwuX2hlaWdodCsncHgnIDogdGhpcy5oZWlnaHQrJ3B4JztcclxuXHRcdFx0XHRzdGF0ZS5pbWd3aWR0aCA9IChwYXJzZVhtbC5zbXhtbC5fd2lkdGggPiB0aGlzLndpZHRoKSA/IHBhcnNlWG1sLnNteG1sLl93aWR0aCArICdweCcgOiB0aGlzLndpZHRoICsgJ3B4JztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzdGF0ZS5pbWdoZWlnaHQgPSAgKHBhcnNlWG1sLnNteG1sLmRpdi5faW1naGVpZ2h0KSAgPyBwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ2hlaWdodCsncHgnIDogXCJhdXRvICFpbXBvcnRhbnRcIjtcclxuXHRcdFx0XHRzdGF0ZS5pbWd3aWR0aCA9IChwYXJzZVhtbC5zbXhtbC5kaXYuX2ltZ3dpZHRoKSA/IHBhcnNlWG1sLnNteG1sLmRpdi5faW1nd2lkdGgrJ3B4JyA6ICBcImF1dG8gIWltcG9ydGFudFwiO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0aW1hZ2Uuc3JjID0gYmdJbWdQYXRoICsgaW1nX3VybDtcclxuXHRcdGlmICh1eG1sKSB7XHJcblx0XHRcdHVzZXJDb3JyZWN0ID0gdXhtbDtcclxuXHRcdFx0bGV0IHBhcnNlVXhtbCA9IFhNTFRvSlNPTih1eG1sKTtcclxuXHRcdFx0aWYgKHBhcnNlVXhtbC5TTUFOUyAmJiBwYXJzZVV4bWwuU01BTlMuZGl2KSB7XHJcblx0XHRcdFx0aXNVeG1sVGFyZ2V0ID0gdHJ1ZTtcclxuXHRcdFx0XHRhbnNfeCA9IHBhcnNlVXhtbC5TTUFOUy5kaXYuX3RhcmdldExlZnQ7XHJcblx0XHRcdFx0YW5zX3kgPSBwYXJzZVV4bWwuU01BTlMuZGl2Ll90YXJnZXRUb3A7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNoZWNrQW5zd2VyIChldmVudCkge1xyXG5cdFx0bGV0IHJlc3VsdCA9IHt9OyBcclxuXHRcdGlmICh0eXBlTmFtZSA9PSAndGV4dGNsaWNrJyB8fCB0eXBlTmFtZSA9PSAndGV4dHNlbGVjdCcpIHtcclxuXHRcdFx0cmVzdWx0ID0gSG90SlMuY2hlY2tfQW5zKCcjcHJldmlld0FyZWEgI2hwdG1haW4wJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXN1bHQgPSBtb3ZldGFyZ2V0KGV2ZW50LCBhbnNfaCwgYW5zX3csIHBhcnNlSW50KGl0ZW1BcmVhTGVmdCksIHBhcnNlSW50KGl0ZW1BcmVhVG9wKSk7XHJcblx0XHRcdGlzVXhtbFRhcmdldCA9IHRydWU7XHJcblx0XHRcdGFuc194ID0gcmVzdWx0LmxlZnQ7XHJcblx0XHRcdGFuc195ID0gcmVzdWx0LnRvcDtcclxuXHRcdFx0YW5zU3RhdHVzID0gcmVzdWx0LmFucztcclxuXHRcdFx0aWYgKGVkaXRvclN0YXRlKSBzaG93QW5zKGFuc1N0YXR1cyA/IFwiQ29ycmVjdFwiIDogXCJJbmNvcnJlY3RcIik7XHJcblx0XHR9XHJcblx0XHRvblVzZXJBbnNDaGFuZ2UocmVzdWx0KTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gb25Nb2RhbFRvdWNoKGV2ZW50KSB7XHJcblx0XHRjb25zb2xlLmxvZyhldmVudCk7XHJcblx0fVxyXG5cclxuXHQvLyB1c2VkIGluIG5hdGl2ZSBmb3IgdG9nZ2xlXHJcblx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0QXJlYSgpIHtcclxuXHRcdHNjcm9sbEVuYWJsZWQgPSBzY3JvbGxFbmFibGVkID8gZmFsc2UgOiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Ly8gd2hlbiByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXHJcblx0ZnVuY3Rpb24gc2V0UmV2aWV3KCkge1xyXG5cdFx0dGFyZ2V0VmlldyA9IFwiYmxvY2tcIjtcclxuXHRcdC8vaXNEb3RDcmVhdGUgPSBmYWxzZTtcclxuXHRcdC8vIGlmIHRoZSBtb2R1bGUgaXMgaW1hZ2VoaWdobGlnaHQgdGhlbiBpdCBkcmF3IHRoZSBjb3JyZWN0IGFuc3dlciBvbiB0aGUgbW9kdWxlIHVzaW5nIHRoZSBmdW5jdGlvbiBkcmF3T25DYW52YXNcclxuXHRcdGlmIChtb2R1bGVBcnJbaXRlbV90eXBlXSA9PSBcIjNcIikge1xyXG5cdFx0XHRsZXQgZWwgPSBBSC5maW5kKCcjcHJldmlld0FyZWEnLCAnY2FudmFzJyk7XHJcblx0XHRcdGxldCBwdHMgPSBlbC5nZXRBdHRyaWJ1dGUoJ2NvcnJlY3RhbnMnKTsgXHJcblx0XHRcdGlmICggcHRzIT0nJykgcHRzID0gSlNPTi5wYXJzZShwdHMpO1xyXG5cdFx0XHRIb3RKUy5kcmF3T25DYW52YXMoZWwsIHB0cywgJ2dyZWVuJyk7XHJcblx0XHR9XHJcblx0XHQvLyBjYWxsZWQgdGhlIGZ1bmN0aW9uIHVuYmluZCBsYWIgd2hpY2ggYmFzaWNhbGx5IHNob3cgdGhlIGRyYWdnYWJsZSBlbGVtZW50IGluIHByZXZpZXcgYXJlYSBpZiBmb3VuZCB3aGljaCBpcyBmb3VuZCBpbiBjYXNlIG9mIHNwb3QgYW4gaW1hZ2VcclxuXHRcdEhvdEpTLm1vZGVPbkhvdCgxKTtcclxuXHRcdC8vIGNoZWNrIHRoZSBhbnN3ZXIgd2V0aGVyIHRoZSBhbnN3ZXIgaXMgY29ycmVjdCBvciBub3RcclxuXHRcdC8vY2hlY2tBbnN3ZXIoKTtcclxuXHRcdEFILnNlbGVjdChcIiNocHRtYWluMFwiLCAnY3NzJywge3BvaW50ZXJFdmVudHM6IFwibm9uZVwifSk7XHJcblx0fVxyXG5cclxuXHQvLyB3aGVuIHJlbWVkaWF0aW9uIG1vZGUgaXMgb2ZmXHJcblx0ZnVuY3Rpb24gdW5zZXRSZXZpZXcoKSB7XHJcblx0XHR0YXJnZXRWaWV3ID0gXCJub25lXCI7XHJcblx0XHQvLyBpZiB0aGUgbW9kdWxlIGlzIGltYWdlaGlnaGxpZ2h0IHRoZW4gaXQgaGlkZSB0aGUgY29ycmVjdCBhbnN3ZXIgYW5zIHNob3cgdXNlciBhbnMgb24gdGhlIG1vZHVsZSB1c2luZyB0aGUgZnVuY3Rpb24gZHJhd09uQ2FudmFzXHJcblx0XHRpZiAobW9kdWxlQXJyW2l0ZW1fdHlwZV0gPT0gXCIzXCIpIHtcclxuXHRcdFx0QUguZmluZCgnI3ByZXZpZXdBcmVhJywgJ2NhbnZhcycsIHthY3Rpb246ICdyZW1vdmUnfSk7XHJcblx0XHRcdGltYWdlRHJhdygnI3ByZXZpZXdBcmVhJywgMCk7XHJcblx0XHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bGV0IGVsID0gQUguZmluZCgnI3ByZXZpZXdBcmVhJywgJ2NhbnZhcycpO1xyXG5cdFx0XHRcdC8vIGdldHRpbmcgdGhlIHZhbHVlIG9mIHRoZSB1c2VyIGFuc1xyXG5cdFx0XHRcdGxldCBnZXRBbnMgPSBBSC5zZWxlY3QoJyNzcGVjaWFsX21vZHVsZV9wYXJzZScpLnZhbHVlLFxyXG5cdFx0XHRcdC8vIGdldHRpbmcgdGhlIHVzZXIgYW5zd2VyIGNvb3JkaW5hdGVzXHJcblx0XHRcdFx0Y2FucyAgID0gZ2V0QW5zLnN1YnN0cmluZyhnZXRBbnMuaW5kZXhPZigneycpLGdldEFucy5sYXN0SW5kZXhPZignfScpKzEpO1xyXG5cclxuXHRcdFx0XHQvLyBwYXJzaW5nIGl0IGludG8gdGhlIEpTT04gZWxlbWVudFxyXG5cdFx0XHRcdGlmICggY2FucyE9JycpIGNhbnMgPSBKU09OLnBhcnNlKGNhbnMpO1xyXG5cdFx0XHRcdC8vIHBhc3NlZCB0aGUgcG9pbnRzIGluIHRoZSBjYW52YXNcclxuXHRcdFx0XHRIb3RKUy5kcmF3T25DYW52YXMoZWwsIGNhbnMsIGxpbmVjb2xvcik7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHRcdFx0fSw1MDApO1xyXG5cdFx0fVxyXG5cdFx0Ly8gY2FsbGVkIHRoZSBmdW5jdGlvbiBiaW5kIGxhYiB3aGljaCBiYXNpY2FsbHkgaGlkZSB0aGUgZHJhZ2dhYmxlIGVsZW1lbnQgaW4gcHJldmlldyBhcmVhIGlmIGZvdW5kIHdoaWNoIGlzIGZvdW5kIGluIGNhc2Ugb2Ygc3BvdCBhbiBpbWFnZVxyXG5cdFx0SG90SlMubW9kZU9uSG90KCk7XHJcblx0XHRBSC5zZWxlY3QoXCIjaHB0bWFpbjBcIiwgJ2NzcycsIHtwb2ludGVyRXZlbnRzOiBcImF1dG9cIn0pO1xyXG5cdH1cclxuXHJcblx0Ly8gZm9yIGltYWdlIGRyYXdcclxuXHRmdW5jdGlvbiBpbWFnZURyYXcoaGlkLHJldmlldykge1xyXG5cdFx0bGV0IGltZ09iaiA9ICBBSC5maW5kKGhpZCwgJyNocHRtYWluMCcpO1xyXG5cdFx0aGlkID0gaW1nT2JqO1xyXG5cdFx0Ly8gbGV0IGltZ1dpZHRoICA9IGltZ09iai5jbGllbnRXaWR0aDtcclxuXHRcdC8vIGxldCBpbWdIZWlnaHQgPSBpbWdPYmouY2xpZW50SGVpZ2h0O1xyXG5cdFx0bGV0IHN1cmZhY2UgPSBuZXcgRG9vU2NyaWJQbHVnaW4oe1xyXG4gICAgICAgICAgICB0YXJnZXQ6IGltZ09iaixcclxuICAgICAgICAgICAgd2lkdGg6ICsoIHN0YXRlLmltZ3dpZHRoLnJlcGxhY2UoJ3B4JywgJycpICksXHJcbiAgICAgICAgICAgIGhlaWdodDogKyggc3RhdGUuaW1naGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpICksXHJcbiAgICAgICAgICAgIGNvcnJlY3RhbnM6IGNvcnJlY3RhbnMsXHJcbiAgICAgICAgICAgIGNzc0NsYXNzOiAnZHJhd1N1cmZhY2UnLFxyXG4gICAgICAgICAgICBwZW5TaXplOiA0LFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2VoaWdobGlnaHQnLFxyXG4gICAgICAgICAgICBlZGl0YWJsZTogKCFyZXZpZXcpID8gdHJ1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIG9uTW92ZTogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7IH0sXHJcbiAgICAgICAgICAgIG9uUGFpbnQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzdG9yZWluZyB0aGUgWCBhbmQgWSB2YWx1ZXNcclxuICAgICAgICAgICAgICAgIHhheGlzLnB1c2goZS5YKTtcclxuICAgICAgICAgICAgICAgIHlheGlzLnB1c2goZS5ZKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25SZWxlYXNlOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdG9uUmVsZWFzZUZ1bmMoZSwgaGlkLCByZXZpZXcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0XHRsaW5lY29sb3IgPSBTdHJpbmcoeG1sLm1hdGNoKC9saW5lY29sb3I9XFxcIihbXlxcXCJdKylcXFwiL2dtKSk7XHJcblx0XHRsaW5lY29sb3IgPSBsaW5lY29sb3Iuc3Vic3RyaW5nKFwiMTFcIiwgKGxpbmVjb2xvci5sZW5ndGggLSAxKSk7XHJcblx0XHQvL3ZhciByZXMgPSBBSC5zaWJsaW5ncyhoaWQpLmZpbmQoKF9lbG0pPT4gX2VsbS5tYXRjaGVzKCdkaXYnKSApLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRcdGlmICghcmV2aWV3KSB7XHJcblx0XHRcdEFILmxpc3RlbignI3ByZXZpZXdBcmVhJywgJ2NsaWNrJywgJyNyZXNldCcsICgpPT4ge1xyXG5cdFx0XHRcdHN1cmZhY2UuY2xlYXJTdXJmYWNlKCk7XHJcblx0XHRcdFx0ZHJhd3N0ciA9ICcnOyBjb3VudCA9IDA7XHJcblx0XHRcdFx0dXNlckNvcnJlY3QgPSAgXCJcIjtcclxuXHRcdFx0XHRBSC5zZWxlY3RBbGwoQUguc2VsZWN0KGhpZCkuY2hpbGRyZW4sICdhdHRyJywge3VzZXJhbnM6ICcnfSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0d2luZG93LnN1cmZhY2UgPSBzdXJmYWNlO1xyXG5cdH1cclxuXHJcblx0Ly8gY2FsbHMgaW4ga2V5IHVwIC8gb25yZWxhc2Ugb2YgbW91c2VcclxuXHRmdW5jdGlvbiBvblJlbGVhc2VGdW5jKGUsIGhpZCwgcmV2aWV3KXtcclxuXHRcdGxldCB1c2VyQW5zd2VycyA9ICcnO1xyXG5cdFx0bGV0IGluTmF0aXZlSXNDb3JyZWN0ID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gY2hlY2sgZm9yIHRoZSByZXZpZXcgbW9kZSBpcyBvbiBvciBvZmZcclxuXHRcdGlmICghcmV2aWV3KSB7XHQvLyBpZiByZXZpZXcgbW9kZSBpcyBvZmZcclxuXHRcdFx0ZHJhd3N0ciA9ICcnO1xyXG5cdFx0XHQvLyBnZXR0aW5nIHRoZSAgdmFsdWUgb2YgdGhlIHBvaW50IFxyXG5cdFx0XHR2YXIgY29vciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcGVjaWFsX21vZHVsZV9wYXJzZScpLnZhbHVlO1xyXG5cdFx0XHRjb29yID0gY29vci5zdWJzdHJpbmcoY29vci5pbmRleE9mKCd7JyksY29vci5sYXN0SW5kZXhPZignfScpKzEpO1xyXG5cclxuXHRcdFx0Ly8gZ2V0dGluZyB0aGUgY29vcmRpbmF0ZXMgdXNpbmcgdGhlIGdldENvb3JkaW5hdGUgZnVuY3Rpb25cclxuXHRcdFx0aWYgKGNvb3IhPScnKSB7XHRcclxuXHRcdFx0XHRjb29yID0gXHRPYmplY3Qua2V5cyhKU09OLnBhcnNlKGNvb3IpKS5sZW5ndGg7XHJcblx0XHRcdFx0ZHJhd3N0ciA9IEhvdEpTLmdldENvb3JkaW5hdGUoaGlkLCB4YXhpcywgeWF4aXMsIGNvb3IpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRyYXdzdHIgPSBIb3RKUy5nZXRDb29yZGluYXRlKGhpZCwgeGF4aXMsIHlheGlzLCBjb3VudCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZm9yIGdldHRpbmcgd2luZG93IGhlaWdodCBpbiBjYXNlIG9mIG5hdGl2ZVxyXG5cdFx0XHRpZiAod2luZG93LmluTmF0aXZlKSB7XHJcblx0XHRcdFx0d2luZG93LmdldEhlaWdodCAmJiB3aW5kb3cuZ2V0SGVpZ2h0KCk7XHJcblx0XHRcdH1cdFxyXG5cclxuXHRcdFx0Ly8gZm9yIGF1dG9ncmFkaW5nXHJcblx0XHRcdHdpbmRvdy5JU1NQRUNJQUxNT0RVTEVVU0VSWE1MQ0hBTkdFID0gMTtcclxuXHRcdFx0Ly8gcHV1dGluZyB0aGUgdmFsdWUgaW4gdGhlIHRleHRhcmVhIGZvciBzYXZpbmcgdGhlIHVzZXIgYW5zXHJcblx0XHRcdEFILnNlbGVjdChcIiNzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiLCAndmFsJywgZHJhd3N0cik7XHJcblx0XHRcdHVzZXJDb3JyZWN0ID0gZHJhd3N0cjtcclxuXHRcdFx0eGF4aXM9W107IHlheGlzPVtdO1xyXG5cdFx0XHQvLyBmb3IgZ2V0dGluZyB0aGUgY29ycmVjdGFuc1xyXG5cdFx0XHRsZXQgcHRzICA9IEFILmZpbmQoaGlkLCAnY2FudmFzJykuZ2V0QXR0cmlidXRlKCdjb3JyZWN0YW5zJyk7XHJcblx0XHRcdC8vIGZvciBnZXR0aW5nIHRoZSB1c2VyIGFuc1xyXG5cdFx0XHRsZXQgY2FucyA9IEFILmZpbmQoaGlkLCAnY2FudmFzJykuZ2V0QXR0cmlidXRlKCd1c2VyYW5zJyk7XHJcblxyXG5cdFx0XHQvLyBwYXJzaW5nIGJvdGggdGhlIGpzb24gaWYgdGhleSBhcmUgbm90IGVtcHR5XHJcblx0XHRcdGlmICggY2FucyE9JycpIGNhbnMgPSBKU09OLnBhcnNlKGNhbnMpO1xyXG5cdFx0XHRpZiAoIHB0cyE9JycpIHB0cyA9IEpTT04ucGFyc2UocHRzKTtcclxuXHJcblx0XHRcdC8vIGNvbXBhcmluZyB0aGVtIHdpdGggdGhlIGZ1bmN0aW9uICwgaXQgd2lsbCByZXR1cm4gMSBpZiB0aGUgYW5zd2VyIGlzIGNvcnJlY3RcclxuXHRcdFx0bGV0IGZsYWcgPSBIb3RKUy5jb21wYXJlRHJhd2luZyhjYW5zLHB0cyxoaWQpO1xyXG5cdFx0XHRsZXQgbWVzc2FnZSA9IFwiSW5jb3JyZWN0XCI7XHJcblx0XHRcdC8vIGZvciBzZXR0aW5nIHRoZSBhbnN3ZXIgY29ycmVjdCBpZiBmbGFnID4gMFxyXG5cdFx0XHRpZiAoZmxhZyA+IDApIHtcclxuXHRcdFx0XHRpbk5hdGl2ZUlzQ29ycmVjdCA9IHRydWU7XHJcblx0XHRcdFx0bWVzc2FnZSA9IFwiQ29ycmVjdFwiO1xyXG5cdFx0XHRcdHN0YXRlLmFuc3dlclR5cGUzID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoZWRpdG9yU3RhdGUpIHNob3dBbnMoXCJDb3JyZWN0XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGluTmF0aXZlSXNDb3JyZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0bWVzc2FnZSA9IFwiSW5jb3JyZWN0XCI7XHJcblx0XHRcdFx0c3RhdGUuYW5zd2VyVHlwZTMgPSBmYWxzZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZWRpdG9yU3RhdGUpIHNob3dBbnMobWVzc2FnZSk7XHJcblx0XHRcdHVzZXJBbnN3ZXJzID0gQUguc2VsZWN0KCcjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWwnKS52YWx1ZTtcclxuXHRcdFx0Ly8gQHVjLWFiazogV2hlbiB1c2VyIGRyYXdlZCBjYW52YXMgd2l0aGluIHRoZSBjb3JyZWN0IGFyZWEgOiBmbGFnIHdpbGwgMVxyXG5cdFx0XHQoZmxhZyA+IDApID8gKEFILnNlbGVjdChcIiNhbnN3ZXJcIikuY2hlY2tlZCA9ICB0cnVlKSA6IChBSC5zZWxlY3QoXCIjYW5zd2VyXCIpLmNoZWNrZWQgPSBmYWxzZSk7XHJcblx0XHRcdGlmICh3aW5kb3cuaW5OYXRpdmUpIHdpbmRvdy5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7IGluTmF0aXZlSXNDb3JyZWN0LCB1c2VyQW5zd2VycyB9KSwgXCIqXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBwYXJzZVRleHRDbGljayhjZGF0YSkge1xyXG5cdFx0dmFyIGNkYXRhU3RyID0gJyc7XHJcblx0XHQvLyBnZXQgdGhlIGNvcnJlY3QgYW5zd2VyIGluIGNvcnJlY3RhbnNcclxuXHRcdHZhciBjb3JyZWN0YW5zID0gY2RhdGEubWF0Y2goLyV7KC4qPyl9JS9nbSk7XHJcblx0XHRpZiAoY29ycmVjdGFucykge1xyXG5cdFx0XHR0b3RhbENvcnJlY3RBbnMgPSBjb3JyZWN0YW5zLmxlbmd0aDtcclxuXHRcdFx0Zm9yKHZhciBpPTA7aTxjb3JyZWN0YW5zLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHQvLyByZXBsYWNpbmcgdGhlIHNwYWNlIHdpdGggPHVjOnNwYWNlPiBhbmQgdGhlbiByZXBsYWNpbmcgdGhlIGNvcnJlY3RhbnMgd2l0aCBpdFxyXG5cdFx0XHRcdGNvcnJlY3RBbnNTdHIgPSBjb3JyZWN0YW5zW2ldLnJlcGxhY2UoL1xccysvZ20sJzx1YzpzcGFjZT4nKTtcclxuXHRcdFx0XHRjZGF0YSA9IGNkYXRhLnJlcGxhY2UoY29ycmVjdGFuc1tpXSxjb3JyZWN0QW5zU3RyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29ycmVjdEFuc1N0ciA9ICcnO1xyXG5cdFx0Y2RhdGEgPSBjZGF0YS5zcGxpdCgnICcpO1xyXG5cdFx0Zm9yKHZhciBpPTA7aTxjZGF0YS5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdC8vaWYgdGhlIGRhdGEgaXMgY29ycmVjdCBhbnN3ZXJcclxuXHRcdFx0aWYgKGNkYXRhW2ldLm1hdGNoKC8le3wlfS9nbSkpIHtcclxuXHRcdFx0XHQvLyBmb3Igc2V0dGluZyB0aGUgZGF0YS1jb3JyZWN0YW5zIDEgaWYgdGhhdCB2YWx1ZSBpcyBjb3JyZWN0XHJcblx0XHRcdFx0Y2RhdGFbaV0gPSBjZGF0YVtpXS5yZXBsYWNlKC88dWM6c3BhY2U+L2dtLCcgJykucmVwbGFjZSgvJXt8fSUvZ20sJycpOyBcclxuXHRcdFx0XHRjZGF0YVN0ciArPSAnPHAgY2xhc3M9XCJ0ZXh0Q2xpY2tcIiBkYXRhLWluZGV4PVwiJytpKydcIiBkYXRhLXVzZXJhbnM9XCIwXCIgZGF0YS1jb3JyZWN0YW5zPVwiMVwiPicrY2RhdGFbaV0rJzwvcD4nO1xyXG5cdFx0XHRcdGNvcnJlY3RBbnNTdHIgKz0gY2RhdGFbaV0rJ3wnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIGZvciBzZXR0aW5nIHRoZSBkYXRhLWNvcnJlY3RhbnMgMCBpZiB0aGF0IHZhbHVlIGlzIGNvcnJlY3RcclxuXHRcdFx0XHRjZGF0YVN0ciArPSAnPHAgY2xhc3M9XCJ0ZXh0Q2xpY2tcIiBkYXRhLWluZGV4PVwiJytpKydcIiBkYXRhLXVzZXJhbnM9XCIwXCIgZGF0YS1jb3JyZWN0YW5zPVwiMFwiPicrY2RhdGFbaV0rJzwvcD4nO1xyXG5cdFx0XHR9IFxyXG5cdFx0fVxyXG5cdFx0Y29ycmVjdEFuc1N0ciA9IGNvcnJlY3RBbnNTdHIucmVwbGFjZSgvXFx8JC9nbSwnJyk7XHJcblx0XHQgLy8gc2hvd2luZyB0aGUgdGV4dCBpbiB0aGUgcHJldmlldyBhcmVhIFx0XHJcblx0XHRBSC5zZWxlY3QoJyAjcHJldmlld0FyZWEgICN0ZXh0SUQwJykuaW5uZXJIVE1MID0gIGNkYXRhU3RyO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBwYXJzZVRleHRTZWxlY3QoY2RhdGEpIHtcclxuXHRcdGNvcnJlY3RBbnNTdHIgPSAnJztcclxuXHRcdC8vIHN0b3JlIHRoZSBjb3JyZWN0IGFuc3dlciBpbiBjb3JyZWN0IGFucyBcclxuXHRcdHZhciBjb3JyZWN0YW5zID0gY2RhdGEubWF0Y2goLyV7KC4qPyl9JS9nbSk7XHJcblx0XHQvLyBpZiBleGlzdHNcclxuXHRcdGlmIChjb3JyZWN0YW5zKSB7XHJcblx0XHRcdC8vIHN0b3JpbmcgaXQgdGhlIGNvcnJlY3QgYW5zIGluIGNvcnJlY3RBbnNTdHIgc2VwZXJ0ZWQgYnkgfCBcclxuXHRcdFx0Zm9yICh2YXIgaW5kZXhfbm8gPSAwOyBpbmRleF9ubyA8Y29ycmVjdGFucy5sZW5ndGg7IGluZGV4X25vICs9IDEpIHtcclxuXHRcdFx0XHRjb3JyZWN0QW5zU3RyICs9IGNvcnJlY3RhbnNbaW5kZXhfbm9dLnJlcGxhY2UoLyV7fH0lL2dtLCAnJykgKyAnfCc7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gcmVwbGFjZSB0aGUgc3ltYm9sIHdpdGggdGhlIHNwYW5cclxuXHRcdFx0Y29ycmVjdEh0bWwgPSBjZGF0YS5yZXBsYWNlKC8ley9nbSwgJzxzcGFuIGNsYXNzPVwic2VsZWN0dGV4dCBzZWxlY3RlZFwiPicpLnJlcGxhY2UoL30lL2dtLCAnPHNwYW4+Jyk7XHJcblx0XHRcdHRvdGFsQ29ycmVjdEFucyA9IGNvcnJlY3RhbnMubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly8gcmVtb3ZpbmcgbGFzdCBwaXBlIHN5bWJvbCBpbiB0aGUgY29ycmVjdEFuc1N0clxyXG5cdFx0XHRjb3JyZWN0QW5zU3RyID0gY29ycmVjdEFuc1N0ci5yZXBsYWNlKC9cXHwkL2dtLCAnJyk7XHJcblx0XHR9XHJcblx0XHQvLyByZW1vdmluZyB0aGUgc3ltYm9sIGZyb20gdGhlIGNkYXRhXHJcblx0XHR2YXIgc2hvd2RhdGEgPSBjZGF0YS5yZXBsYWNlKC8le3x9JS9nbSwgJycpO1xyXG5cdFx0dmFyIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcdFx0XHRcclxuXHRcdFx0Ly8gc2hvdyB0aGUgdGV4dCBpbiB0aGUgaHRtbFxyXG5cdFx0XHRBSC5zZWxlY3QoJyAjcHJldmlld0FyZWEgICN0ZXh0SUQwJykuaW5uZXJIVE1MID0gIHNob3dkYXRhO1xyXG5cdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cdFx0fS5iaW5kKHNlbGYpLCAxMDApO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbG9hZE1vZHVsZShfdHlwZSkge1xyXG5cdFx0c3dpdGNoKF90eXBlKSB7XHJcblx0XHRcdC8vIGlmIHRoZSB0eXBlIGlzIHRleHQgY2xpY2sgb3IgdGV4dCBzZWxlY3RcclxuXHRcdFx0Y2FzZSBcIjFcIjpcclxuXHRcdFx0Y2FzZSBcIjJcIjoge1xyXG5cdFx0XHRcdFx0bGV0IGRhdGFfdXNlcmFucyA9IFwiXCI7XHJcblx0XHRcdFx0XHRsZXQgZGF0YV91c2VyaHRtbCA9IFwiXCI7XHJcblx0XHRcdFx0XHRpZiAodXhtbCkge1xyXG5cdFx0XHRcdFx0XHRsZXQgX3V4bWwgPSBYTUxUb0pTT04odXhtbCk7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy50ZXN0ID0gdXhtbDtcclxuXHRcdFx0XHRcdFx0Ly8gZXh0cmFjdCB0aGUgdXNlcmFucyBhbmQgdXNlcmh0bWxcclxuXHRcdFx0XHRcdFx0aWYgKF91eG1sPy5zbWFucz8uZGl2KSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YV91c2VyYW5zID0gX3V4bWwuc21hbnMuZGl2WydfZGF0YS11c2VyQW5zJ107XHJcblx0XHRcdFx0XHRcdFx0ZGF0YV91c2VyaHRtbCA9IF91eG1sLnNtYW5zLmRpdlsnX2RhdGEtdXNlckh0bWwnXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gcmV0dXJuIHRoZSBkaXZcclxuXHRcdFx0XHRcdHJldHVybiAoYFxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlzIGlkPVwiaHB0bWFpbjBcIiB0b3RhbENvcnJlY3RBbnM9JHt0b3RhbENvcnJlY3RBbnN9PlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgXHJcblx0XHRcdFx0XHRcdFx0XHRpZD1cInRleHRJRDBcIiBcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU9XCIke3R5cGVOYW1lfVwiIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS1jb3JyZWN0aHRtbD1cIiR7Y29ycmVjdEh0bWx9XCIgXHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvcnJlY3RhbnM9XCIke2NvcnJlY3RBbnNTdHJ9XCJcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtdXNlcmFucz1cIiR7ZGF0YV91c2VyYW5zfVwiIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS11c2VyaHRtbD1cIiR7ZGF0YV91c2VyaHRtbH1cIiBcclxuXHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwiZHJhZy1yZXNpemUgaG90c3BvdFR4dFwiIFxyXG5cdFx0XHRcdFx0XHRcdFx0c3R5bGU9XCJtYXgtd2lkdGg6JHtkaXZXaWR0aH07IGhlaWdodDoke2RpdkhlaWdodH07IGxpbmUtaGVpZ2h0OiAxLjQ7XCJcclxuXHRcdFx0XHRcdFx0XHQ+XHJcblx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0YCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRkZWZhdWx0IDogcmV0dXJuKFwiPGRpdj5JbmNvcnJlY3QgcXVlc3Rpb24gdHlwZTwvZGl2PlwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbjwvc2NyaXB0PlxyXG48bWFpbj5cclxuXHQ8Y2VudGVyPlxyXG5cdFx0PEl0ZW1IZWxwZXIgXHJcblx0XHRcdG9uOnNldFJldmlldyA9IHtzZXRSZXZpZXd9XHJcblx0XHRcdG9uOnVuc2V0UmV2aWV3ID0ge3Vuc2V0UmV2aWV3fVxyXG5cdFx0Lz5cclxuXHRcdDxkaXYgaWQ9XCJwcmV2aWV3QXJlYVwiIGNsYXNzPVwicmVsYXRpdmVcIj5cclxuXHRcdFx0PCEtLSBpZiB0aGUgdHlwZSBpcyB0ZXh0IGNsaWNrIG9yIHRleHQgc2VsZWN0IC0tPlxyXG5cdFx0XHR7I2lmIG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiNFwifVxyXG5cdFx0XHRcdDx0YWJsZSBpZD1cImhwdG1haW4wXCIgY2xhc3M9J3NtYmFzZSBzbWhvdHNwb3QgYm9yZGVyLTAgaC1hdXRvIHctYXV0byc+XHJcblx0XHRcdFx0XHQ8dGJvZHk+XHJcblx0XHRcdFx0XHRcdDx0cj5cclxuXHRcdFx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJib3JkZXJcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJTTTBcIiBjbGFzcz1cInJlbGF0aXZlXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ9J1NNMCcgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJTTSBwb3NpdGlvbi1yZWxhdGl2ZSBtLTAgcC0wXCIgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU9XCJ7YFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWFyZ2luOiAwcHg7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAwcHg7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogJHsoaXRlbUJvcmRlcikgPyBpdGVtQm9yZGVyICsgJ3B4IHNvbGlkJyA6ICcnfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAke2l0ZW1Cb3JkZXJDb2xvcn07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YH1cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkPVwiaW0wXCIgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJpbmRleD1cIjBcIiBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0eWxlPVwibWF4LXdpZHRoOm5vbmU7IHdpZHRoOiB7c3RhdGUuaW1nd2lkdGh9OyBoZWlnaHQ6IHtzdGF0ZS5pbWdoZWlnaHR9O1wiIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJob3RTcG90SW1nXCIgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzcmM9e2JnSW1nUGF0aCtpbWdfdXJsfSBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFsdD17YWx0fSBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uOmNsaWNrPXtjaGVja0Fuc3dlcn1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZD0naG90QXJlYScgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImhvdEFyZWEgaG90QXJlYSBob3RBcmVhUHJldmlld1wiIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU9XCJ7YFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiAke3RhcmdldFZpZXd9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZWZ0OiR7aXRlbUFyZWFMZWZ0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG9wOiR7aXRlbUFyZWFUb3B9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6JHtpdGVtQXJlYUhlaWdodH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHdpZHRoOiR7aXRlbUFyZWFXaWR0aH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRgfVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Jm5ic3A7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkPSd0YXJnZXQnIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJ0YXJnZXQgdGFyZ2V0SW1nIGljb21vb24tcGx1cy1jaXJjbGUtMlwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzczpzaG93QmxvY2s9XCJ7aXNVeG1sVGFyZ2V0fVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHlsZSA9IFwie2BcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGVmdDoke2Fuc194fXB4O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0b3A6JHthbnNfeX1weDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGB9XCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDwvdGQ+XHJcblx0XHRcdFx0XHRcdDwvdHI+XHJcblx0XHRcdFx0XHQ8L3Rib2R5PlxyXG5cdFx0XHRcdDwvdGFibGU+XHRcclxuXHRcdFx0ezplbHNlIGlmIG1vZHVsZUFycltpdGVtX3R5cGVdID09IFwiM1wifVxyXG5cdFx0XHRcdDxjZW50ZXIga2V5PVwiaW1hZ2VIZWlnaHRfM1wiPlxyXG5cdFx0XHRcdFx0PGRpdiBcclxuXHRcdFx0XHRcdFx0c3R5bGU9XCJcclxuXHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDMycHg7IFxyXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiB7d2luZG93LmluTmF0aXZlID8gd2luZG93LmlubmVyV2lkdGggOiBzdGF0ZS5pbWd3aWR0aH07IFxyXG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6ICNkOWU3ZmQ7IFxyXG5cdFx0XHRcdFx0XHRcdGJvcmRlci10b3A6IDJweCBzb2xpZCAjOTZiYmY2O1xyXG5cdFx0XHRcdFx0XHRcIlxyXG5cdFx0XHRcdFx0PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IFxyXG5cdFx0XHRcdFx0XHRcdGlkPVwicmVzZXRcIiBcclxuXHRcdFx0XHRcdFx0XHRzdHlsZT1cImhlaWdodDogMjdweDsgd2lkdGg6IDkwcHg7XCJcclxuXHRcdFx0XHRcdFx0XHRjbGFzcz1cInJlc2V0IGJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJ0bi1zbSBtdC1zbTIgbXItc20yIGZsb2F0LWVuZFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiaWNvbW9vbi1uZXctMjRweC1yZXNldC0xIHMzXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogdGV4dC10b3BcIj48L3NwYW4+IFxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicG9zaXRpb24tcmVsYXRpdmUgYm90dG9tMVwiPlJlc2V0PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBcclxuXHRcdFx0XHRcdFx0aWQ9XCJocHRtYWluMFwiXHJcblx0XHRcdFx0XHRcdHRvdGFsQ29ycmVjdEFucz17dG90YWxDb3JyZWN0QW5zfVxyXG5cdFx0XHRcdFx0XHRkZD17c3RhdGUuaW1nd2lkdGh9XHJcblx0XHRcdFx0XHRcdHN0eWxlPVwiXHJcblx0XHRcdFx0XHRcdFx0d2lkdGg6IHtzdGF0ZS5pbWd3aWR0aCB8fCAnMjUwcHgnfTsgXHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiB7c3RhdGUuaW1naGVpZ2h0IHx8ICc2MDBweCd9OyBcclxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ3tiZ0ltZ1BhdGgraW1nX3VybH0nKTsgXHJcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDsgXHJcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlOyBcclxuXHRcdFx0XHRcdFx0XHRib3JkZXI6IDJweCBzb2xpZCAjZDllN2ZkO1xyXG5cdFx0XHRcdFx0XHRcIlxyXG5cdFx0XHRcdFx0PjwvZGl2PlxyXG5cdFx0XHRcdFx0eyNpZiBzY3JvbGxFbmFibGVkfVxyXG5cdFx0XHRcdFx0XHQ8ZGl2IFxyXG5cdFx0XHRcdFx0XHRcdGNsYXNzPVwicG9zaXRpb24tZml4ZWQgaW5kZXgwXCIgXHJcblx0XHRcdFx0XHRcdFx0c3R5bGU9XCJyaWdodDogMDsgdG9wOiAwOyBsZWZ0OiAwOyBib3R0b206IDA7IGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC40KVwiXHJcblx0XHRcdFx0XHRcdD48L2Rpdj5cclxuXHRcdFx0XHRcdHsvaWZ9XHJcblx0XHRcdFx0PC9jZW50ZXI+XHJcblx0XHRcdHs6ZWxzZX1cclxuXHRcdFx0XHR7QGh0bWwgbG9hZE1vZHVsZShtb2R1bGVBcnJbaXRlbV90eXBlXSl9XHJcblx0XHRcdHsvaWZ9XHJcblx0XHQ8L2Rpdj5cclxuXHQ8L2NlbnRlcj5cclxuXHQ8aW5wdXQgXHJcblx0XHR0eXBlPVwiaGlkZGVuXCIgXHJcblx0XHRpZD1cInNwZWNpYWxfbW9kdWxlX3BhcnNlXCIgXHJcblx0XHRuYW1lPVwic3BlY2lhbF9tb2R1bGVfcGFyc2VcIiBcclxuXHRcdHVzZXJhbnM9XCJcIiBcclxuXHRcdHZhbHVlPXt1c2VyQ29ycmVjdH0gXHJcblx0Lz5cclxuXHQ8dGV4dGFyZWEgY2xhc3M9XCJoXCIgaWQ9XCJzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiPjwvdGV4dGFyZWE+XHJcbjwvbWFpbj5cclxuXHJcbjxzdHlsZT5cclxuXHRtYWluIHtcclxuXHRcdHRleHQtYWxpZ246IGNlbnRlciAhaW1wb3J0YW50O1xyXG5cdFx0cGFkZGluZzogMWVtO1xyXG5cdFx0bWF4LXdpZHRoOiAyNDBweDtcclxuXHRcdG1hcmdpbjogMCBhdXRvO1xyXG5cdFx0Zm9udC1zaXplOiAyNnB4O1xyXG5cdH1cclxuXHQudGFyZ2V0SW1nIHtcclxuXHRcdGRpc3BsYXkgOiBub25lO1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0ei1pbmRleDogMTA7XHJcblx0XHR3aWR0aDogMjZweDtcclxuXHRcdGhlaWdodDoyNnB4O1xyXG5cdFx0Ym9yZGVyLXJhZGl1czogNTAlO1xyXG5cdFx0YmFja2dyb3VuZDogI2ZmZjtcclxuXHRcdGNvbG9yOiAjMWMzYWQ0O1xyXG5cdH1cdFxyXG5cdFxyXG5cdC5zaG93QmxvY2sge1xyXG5cdFx0ZGlzcGxheSA6IGJsb2NrO1xyXG5cdH1cclxuXHJcblx0QG1lZGlhIChtaW4td2lkdGg6IDY0MHB4KSB7XHJcblx0XHRtYWluIHtcclxuXHRcdFx0bWF4LXdpZHRoOiBub25lO1xyXG5cdFx0fVxyXG5cdH1cclxuPC9zdHlsZT5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWltQkMsSUFBSSxlQUFDLENBQUMsQUFDTCxVQUFVLENBQUUsTUFBTSxDQUFDLFVBQVUsQ0FDN0IsT0FBTyxDQUFFLEdBQUcsQ0FDWixTQUFTLENBQUUsS0FBSyxDQUNoQixNQUFNLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FDZCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsVUFBVSxlQUFDLENBQUMsQUFDWCxPQUFPLENBQUcsSUFBSSxDQUNkLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxFQUFFLENBQ1gsS0FBSyxDQUFFLElBQUksQ0FDWCxPQUFPLElBQUksQ0FDWCxhQUFhLENBQUUsR0FBRyxDQUNsQixVQUFVLENBQUUsSUFBSSxDQUNoQixLQUFLLENBQUUsT0FBTyxBQUNmLENBQUMsQUFFRCxVQUFVLGVBQUMsQ0FBQyxBQUNYLE9BQU8sQ0FBRyxLQUFLLEFBQ2hCLENBQUMsQUFFRCxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFDLEFBQzFCLElBQUksZUFBQyxDQUFDLEFBQ0wsU0FBUyxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUNGLENBQUMifQ== */";
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
			add_location(span0, file, 569, 7, 19508);
			attr_dev(span1, "class", "position-relative bottom1");
			add_location(span1, file, 570, 7, 19600);
			attr_dev(div0, "id", "reset");
			set_style(div0, "height", "27px");
			set_style(div0, "width", "90px");
			attr_dev(div0, "class", "reset btn btn-outline-primary btn-sm mt-sm2 mr-sm2 float-end");
			add_location(div0, file, 565, 6, 19353);
			set_style(div1, "height", "32px");

			set_style(div1, "width", window.inNative
			? window.innerWidth
			: /*state*/ ctx[1].imgwidth);

			set_style(div1, "background", "#d9e7fd");
			set_style(div1, "border-top", "2px solid #96bbf6");
			add_location(div1, file, 557, 5, 19144);
			attr_dev(div2, "id", "hptmain0");
			attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[15]);
			attr_dev(div2, "dd", div2_dd_value = /*state*/ ctx[1].imgwidth);
			set_style(div2, "width", /*state*/ ctx[1].imgwidth || "250px");
			set_style(div2, "height", /*state*/ ctx[1].imgheight || "600px");
			set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[17] + /*img_url*/ ctx[12]) + "')");
			set_style(div2, "background-repeat", "no-repeat");
			set_style(div2, "position", "relative");
			set_style(div2, "border", "2px solid #d9e7fd");
			add_location(div2, file, 573, 5, 19686);
			attr_dev(center, "key", "imageHeight_3");
			add_location(center, file, 556, 4, 19109);
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
			add_location(img, file, 517, 10, 18046);
			attr_dev(div0, "id", "hotArea");
			attr_dev(div0, "class", "hotArea hotArea hotAreaPreview");

			attr_dev(div0, "style", div0_style_value = `
												display: ${/*targetView*/ ctx[9]};
												left:${/*itemAreaLeft*/ ctx[8]};
												top:${/*itemAreaTop*/ ctx[5]};
												height:${/*itemAreaHeight*/ ctx[6]};
												width:${/*itemAreaWidth*/ ctx[7]};
											`);

			add_location(div0, file, 526, 10, 18341);
			attr_dev(span, "id", "target");
			attr_dev(span, "class", "target targetImg icomoon-plus-circle-2 svelte-1m52s8g");

			attr_dev(span, "style", span_style_value = `
												left:${/*ans_x*/ ctx[10]}px;
												top:${/*ans_y*/ ctx[11]}px;
											`);

			toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[4]);
			add_location(span, file, 539, 10, 18705);
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

			add_location(div1, file, 504, 9, 17664);
			attr_dev(div2, "id", "SM0");
			attr_dev(div2, "class", "relative");
			add_location(div2, file, 503, 8, 17622);
			attr_dev(td, "class", "border");
			add_location(td, file, 502, 7, 17593);
			add_location(tr, file, 501, 6, 17580);
			add_location(tbody, file, 500, 5, 17565);
			attr_dev(table, "id", "hptmain0");
			attr_dev(table, "class", "smbase smhotspot border-0 h-auto w-auto");
			add_location(table, file, 499, 4, 17489);
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
			add_location(div, file, 587, 6, 20102);
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
	let t2;
	let textarea;
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
			t2 = space();
			textarea = element("textarea");
			attr_dev(div, "id", "previewArea");
			attr_dev(div, "class", "relative");
			add_location(div, file, 496, 2, 17352);
			add_location(center, file, 491, 1, 17252);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "special_module_parse");
			attr_dev(input, "name", "special_module_parse");
			attr_dev(input, "userans", "");
			input.value = /*userCorrect*/ ctx[14];
			add_location(input, file, 598, 1, 20363);
			attr_dev(textarea, "class", "h");
			attr_dev(textarea, "id", "special_module_user_xml");
			add_location(textarea, file, 605, 1, 20497);
			attr_dev(main, "class", "svelte-1m52s8g");
			add_location(main, file, 490, 0, 17243);
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
			append_dev(main, t2);
			append_dev(main, textarea);
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
//# sourceMappingURL=HotspotPreview-e16498e8.js.map
