import JUI from '../javscript_helper/JUI.js';
const JS = new JUI();
export default class hotspotScript {
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
            }
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
            window.postMessage(JSON.stringify(sendDataToNative), '*')
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
                        JS.find(hidNode, '.correct_incorrect_icon', {action: 'remove'})
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
                    default:
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
        if (typeof(modeType) == "undefined") {
            //modeType = isReview;
        }
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