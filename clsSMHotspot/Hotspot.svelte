<script>
/**
 *  File Name   : Hotspot.js
 *  Description : Container for all Hotspot Authoring Module
 *	Author      : Pradeep Yadav
    *  Version     : 1.0
    *  Package     : svelte_items/svelte
    *  Last updated : 01 JAN 2021
    */

    import { Button, Dialog, Checkbox, Snackbar } from 'svelte-mui/src';
    import {AH, JSONToXML, XMLToJSON} from '../helper/HelperAI.svelte';
    import {Draggable} from '../src/libs/javscript_helper/JUI.js';
    import DooScribPlugin from './HotspotDrawingScript.js';
    import HotspotAuthScript from './Hotspot_authoringScript.js';
    import l from '../src/libs/editorLib/language';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    export let xml;
    export let getChildXml;

    const authScript = new HotspotAuthScript();
    // variable declaration
    let count = 0;
    let drawstr = ''; 
    let bgImgHeight = ''; 
    let bgImgWidth = ''; 
    let bgImgPath = '//s3.amazonaws.com/jigyaasa_content_static/'; 
    let hotAreaTop = ''; 
    let hotAreaHeight = ''; 
    let hotAreaWidth = ''; 
    let hotAreaLeft = '';
    let cmTime = {};
    let defaultXml = [], moduleArr = [], imgWidth = '', imgHeight = '', correct = '';
    defaultXml[1] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textclick" top="10" left="20" width="30" height="50"><!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--></div></smxml>';
    defaultXml[2] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textselect" top="10" left="20" width="30" height="50"><!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--></div></smxml>';
    defaultXml[3] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="imagehighlight" top="10" left="20" width="30" height="50"><!--[CDATA[]]--></div></smxml>';
    defaultXml[4] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="hotspot" top="172" left="220" width="112" height="80"><!--[CDATA[]]--></div></smxml>';

    // for module type indentification
    moduleArr["1"] = "textclick";
    moduleArr["2"] = "textselect";
    moduleArr["3"] = "imagehighlight";
    moduleArr["4"] = "hotspot";
    moduleArr["textclick"] = "1";
    moduleArr["textselect"] = "2";
    moduleArr["imagehighlight"] = "3";
    moduleArr["hotspot"] = "4";
    let message = '';
    let state = {};
    let hdd =  writable({
            xml: '',
            openImg: false,
            openDrag: false,
            bgImg: '',
            snackback: false,
            valueMultiple: '1',
            cdata: '',
            bgImgWidth: "600px",
            bgImgHeight: "360px",
            alt: "",
            imgheight: "",
            imgwidth: "",
            hotBorder: "",
            hotBorderColor: "",
            lineColor: "",
            image_url: ""
        });
    const unsubscribe = hdd.subscribe((items)=> {
        state = items;
    });
    // this will added the file in the script before rendering  
    onMount(()=> {
        AH.createLink(window.itemUrl + "clsSMHotspot/css/hotspot.min.css", {preload: true});
        didMount();
    })

    // call just after rendering
    function didMount() {
        state.xml =  xml;
        // here it converts the xml to json using the function XMLToJSON
        let newXml = XMLToJSON(xml);
        if (newXml) {
            // checking for the type if in xml there is any type given or not if not then assign it hotspot type
            newXml.smxml.div._type = (newXml.smxml.div._type) ? newXml.smxml.div._type : 'hotspot';

            state.valueMultiple = moduleArr[newXml.smxml.div._type];

            // parsing the xml according to the type
            switch (moduleArr[newXml.smxml.div._type]) {
                case "1": 
                case "2": parseXmlForText(newXml); break;
                case "3": parseXmlForDraw(newXml); break;
                case "4": { parseXML(newXml); bindKey(); } break;
            }
        }
        // tinyMCE Plugin
        tinyMCE.PluginManager.add('res', function (editor) {
            editor.addMenuItem('resp', {
                text: "Add Token",
                id: "addToken",
                onclick: function () {
                    addToken();
                },
                context: 'insert',
                prependToContext: true
            });
        });
        initEditor();
        AH.listen(document, 'mousedown', '.draggable', setData);
        cmTime = {};
        AH.listen(document, 'touchstart', '.tinymce-editor-response', ()=> {
            cmTime.s = new Date().getTime();
        })
        AH.listen(document, 'touchend', '.tinymce-editor-response', ()=> {
            cmTime.e = new Date().getTime() - cmTime.s;
            if (cmTime.e / 1000 > 1) {
                addToken();
                cmTime = {};
            }
        });

        // binding the event for the image upload dialog
        AH.listen(document, "click", "#upload_media", ()=> {
            //AH.getBS("#modal-media-upload", 'Modal').show();
            window.setImage("backgroundImage");
        });

        AH.bind(document, 'click', ()=> {
            state.image_url = bgImgPath + '' + AH.select('#backgroundImage').value;
        });
    }

    // for warning purpose
    function handleWarning() {
        let height_value = AH.select('#dragHeight').value;
        let height_integer_value = parseInt(height_value);
        let width_value = AH.select('#dragWidth').value;
        let width_integer_value = parseInt(width_value);
        let top_value = AH.select('#dragTop').value;
        let top_integer_value = parseInt(top_value);
        let left_value = AH.select('#dragLeft').value;
        let left_integer_value = parseInt(left_value);
        let bgHeight_data = parseInt(bgImgHeight);
        let bgWidth_data = parseInt(bgImgWidth);
        if (isNaN(Number(height_value))) {
            AH.showmsg('Only numeric value accepted.');
            AH.select('#dragHeight').focus();
            return false;
        } else {
            if (isNaN(height_integer_value)) {
                AH.showmsg('Only numeric value accepted.');
                AH.select('#dragHeight').focus();
                return false;
            } else {
                if ((height_integer_value > parseInt((bgHeight_data / 2))) || (height_integer_value < 32)) {
                    AH.showmsg('Height must be greater than or equal to 32 and less than or equal to ' + parseInt((bgHeight_data / 2)));
                    AH.select('#dragHeight').focus();
                    return false;
                }
            }
        }

        if (isNaN(Number(width_value))) {
            AH.showmsg('Only numeric value accepted.');
            AH.select('#dragWidth').focus();
            return false;
        } else {
            if (isNaN(width_integer_value)) {
                AH.showmsg('Only numeric value accepted.');
                AH.select('#dragWidth').focus();
                return false;
            } else {
                if ((width_integer_value > parseInt((bgWidth_data / 2))) || (width_integer_value < 32)) {
                    AH.showmsg('Width must be greater than or equal to 32 and less than or equal to ' + parseInt((bgWidth_data / 2)));
                    AH.select('#dragWidth').focus();
                    return false;
                }
            }
        }

        if (isNaN(Number(top_value))) {
            AH.showmsg('Only numeric value accepted.');
            AH.select('#dragTop').focus();
            return false;
        } else {
            if (isNaN(top_integer_value)) {
                AH.showmsg('Only numeric value accepted.');
                AH.select('#dragTop').focus();
                return false;
            } else {
                if ((top_integer_value > (bgHeight_data - height_integer_value)) || (top_integer_value < 0)) {
                    AH.showmsg('Top value must be greater than or equal to 0 and less than or equal to ' + (bgHeight_data - height_integer_value));
                    AH.select('#dragTop').focus();
                    return false;
                }
            }
        }

        if (isNaN(Number(left_value))) {
            AH.showmsg('Only numeric value accepted.');
            AH.select('#dragLeft').focus();
            return false;
        } else {
            if (isNaN(left_integer_value)) {
                AH.showmsg('Only numeric value accepted.');
                AH.select('#dragLeft').focus();
                return false;
            } else {
                if ((left_integer_value > (bgWidth_data - width_integer_value)) || (left_integer_value < 0)) {
                    AH.showmsg('Left value must be greater than or equal to 0 and less than or equal to ' + (bgWidth_data - width_integer_value));
                    AH.select('#dragLeft').focus();
                    return false;
                }
            }
        }
        return true;
    }

    // 	it is called in case of text and token highlight to add token
    function addToken() {
        // getting the selected text in content variable
        let content = tinyMCE.activeEditor.selection.getContent({ format: 'raw' });

        // Replacing the content to add style on it
        content = content.replace(content, '<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">' + content + '</span>');

        // sett the content
        tinyMCE.activeEditor.selection.setContent(content);

        // update the cdata 
        setData();
    }

    // this function init the tinymce editor
    function initEditor() {
        tinymce.init({
            selector: '.tinymce-editor-response',
            inline: true,
            theme: 'modern',
            min_width: 100,
            resize: true,
            menubar: false,
            toolbar: false,
            elementpath: false,
            statusbar: false,
            force_br_newlines: true,
            remove_trailing_brs: true,
            forced_root_block: false,
            paste_as_text: true,
            //extended_valid_elements : 'input[onChange|id|name|class|style|correctAns|userAns],div[class|style],span[id|contentEditable|class|style]',
            extended_valid_elements: 'span[onClick|contentEditable]',
            valid_elements: "*[*]",
            extended_valid_elements: 'uc:syntax,uc:ref',
            custom_elements: 'uc:syntax,~uc:ref',
            plugins: ["res contextmenu paste"],
            //toolbar1: "response",
            contextmenu: "link resp"
        });
    }

    // for parsing the xml
    function parseXML(QXML) {
        state.hotBorder = QXML.smxml.div._border;
        state.hotBorderColor = QXML.smxml.div._bordercolor
        state.bgImg = QXML.smxml._bgimg;
        
        bgImgHeight = QXML.smxml._height + 'px'; // Image Height
        state.alt = QXML.smxml._alt;
        bgImgWidth = QXML.smxml._width + 'px'; // Image Width
        hotAreaWidth = QXML.smxml.div._width + 'px'; // draggable area width
        hotAreaHeight = QXML.smxml.div._height + 'px'; // draggable area height
        hotAreaLeft = QXML.smxml.div._left + 'px'; // draggable area left
        hotAreaTop = QXML.smxml.div._top + 'px'; // draggable area top
        let image = new Image();
        image.src = bgImgPath + QXML.smxml._bgimg;
        image.onload = function () {
            bgImgHeight = this.height + 'px';
            bgImgWidth = this.width + 'px';
            imgHeight = (QXML.smxml.div._imgheight) ? QXML.smxml.div._imgheight + 'px' : "auto !important";
            imgWidth = (QXML.smxml.div._imgwidth) ? QXML.smxml.div._imgwidth + 'px' : "auto !important";
            state.imgwidth = imgWidth;
            state.imgheight = imgHeight;
            AH.select('#hptmain', 'css', { 'height': bgImgHeight, 'width': bgImgWidth });
        };
        AH.select('#hptmain', 'toggleClass', 'd-none');
        AH.selectAll('.drawImage,#text0', 'hide');
        AH.find(document, 'canvas', {action: 'remove'});
        documentReady();
    }
    // for parsing the xml in case of Draw highlight
    function parseXmlForDraw(QXML) {
        state.bgImg = QXML.smxml._bgimg;
        let image = new Image();
        image.onload = function () {
            bgImgHeight = (QXML.smxml._height > this.height) ? QXML.smxml._height + 'px' : this.height + 'px';
            bgImgWidth = (QXML.smxml._width > this.width) ? QXML.smxml._width + 'px' : this.width + 'px';
            //AH.find('#hptdraw', 'canvas', {action: 'attr', actionData: {height: bgImgHeight, width: bgImgWidth}});
            AH.find('#previewSection', '.reset').click();
            AH.find('#mainContent', '#hptdraw canvas', {action: 'attr', actionData: {height: bgImgHeight, width: bgImgWidth, correctans: QXML.smxml.div.__cdata} });
            // for updating the xml in case of image highlight
            update_XMLValue();
        };
        image.src = bgImgPath + QXML.smxml._bgimg;
        state.bgImg = QXML.smxml._bgimg;
        AH.selectAll('.drawImage', 'toggleClass', 'd-none');
        AH.selectAll('#text0,#hptmain', 'hide');
        documentReady();
    }

    // parse xml function for text & token highlight module(textselect, textclick)
    function parseXmlForText(QXML) {
        state.cdata = QXML.smxml.div.__cdata;
        bgImgHeight = QXML.smxml._height + 'px';
        bgImgWidth = QXML.smxml._width + 'px';
        AH.select('#text0', 'show');
        AH.selectAll('.drawImage,#hptmain', 'hide');
        AH.find(document, 'canvas').remove();

        // for changing the {% , %} , symbols with span
        getData(QXML.smxml.div.__cdata);
    }

    // for binding the data
    function bind_data(xml) {
        let elem = xml.getAttribute('id'), attrs = [];
        if (xml.nodeName == "SMXML") {
            elem = xml.children[0].getAttribute('type') == 'imagehighlight' ? "hptdraw" : "hptmain";
        }
        Array.prototype.forEach.call(xml.attributes, (v,i)=> {
            attrs[i] = { "name": v.name, "value": v.value };
        })
        
        if (xml.children.length == 0 && xml.textContent.trim() != "") {
            attrs[attrs.length] = { "name": "value", "value": xml.textContent.trim() }
        }
        if (typeof elem != "undefined") {
            AH.select('#' + elem).dataset["attributes"] = JSON.stringify(attrs);

        }
        if (xml.children.length > 0) {
            Array.prototype.forEach.call(xml.children, (child)=> {
                bind_data(child);
            })
        }
    }

    // Create The x,y coordinate and decide draggable and also set the user answer
    function documentReady() {
        let xaxis = [], yaxis = [];
        bind_data(AH.parseHtml(state.xml));
        // calling the draggable event on draggable element (which is used for setting answer) 
        // in case of spot an image module
        let dnd = new Draggable({
            onDragEnd: (e, ui)=> {
                state.xml = authScript.updateElem('div', e, ui.getAttribute('id'), ui, state.xml);
                getChildXml(state.xml);
            }
        })
        // for showing focus on the draggable element
        AH.listen('#hptmain', 'click', '.drag-resize', function (_this) {
            AH.selectAll('#hptmain .elemActive', 'removeClass', 'elemActive');
            AH.select(_this, 'addClass', 'elemActive').focus();
        });

        // for showing/hiding edit icon of draggable element in case of spot an image
        AH.bind('#hptmain .drag-resize', 'mouseenter', (event)=> {
            let _this = event.target;
            AH.find(_this, '.tools', {action: 'show', actionData: 'block'});
        })
        AH.bind('#hptmain .drag-resize', 'mouseleave', (event)=> {
            let _this = event.target;
            AH.find(_this, '.tools', {action: 'hide'});
        });

        // taking image height and width
        imgWidth = AH.find('#mainContent', '#hptdraw').clientWidth;
        imgHeight = AH.find('#mainContent', '#hptdraw').clientHeight;

        // calling dooScribPlugin 
        let surface = new DooScribPlugin({
            target: AH.find('#mainContent', '#hptdraw'),
            width: imgWidth,
            height: imgHeight,
            correctans: correct,
            cssClass: 'drawSurface',
            penSize: 4,
            type: 'imagehighlight',
            editable: true,
            onMove: function () { },
            onClick: function () { },
            onPaint: function (e) {
                // storeing the X and Y values
                xaxis.push(e.X);
                yaxis.push(e.Y);
            },
            onRelease: function (e) {
                AH.select('#special_module_user_xml').value = '';
                let coor = AH.find('#mainContent', '#hptdraw canvas').getAttribute('correctans');
                if (coor != '') {
                    coor = Object.keys(JSON.parse(coor)).length;
                    getCoordinate(xaxis, yaxis, coor);
                } else {
                    getCoordinate(xaxis, yaxis, count);
                }
                xaxis = []; yaxis = [];
            }
        });
        let surfaceColor = surface.lineColor(window.color);
        AH.siblings(AH.find('#mainContent', '#hptdraw')).find((elm)=> {
            let res = AH.find(elm, 'div').getAttribute('id');
            AH.bind('#' + res, 'click', function (event) {
                surface.clearSurface();
                drawstr = '{}';
                count = 0;
                AH.find('#mainContent', '#hptdraw canvas', {action: 'attr', actionData: {correctans: drawstr} });
                update_XMLValue();
            });
            return res;
        });
        

        let currentXMl = AH.parseHtml(xml);
        // if the type is imagehighlisght then draw ib the canvas by getting values from the xml
        if ((currentXMl.children)[0].getAttribute('type') == 'imagehighlight') {
            var ans = state.xml;
            ans = ans.substring(ans.indexOf('{'), ans.lastIndexOf('}') + 1);
            if (ans != '') {
                ans = JSON.parse(ans);
            }
            setTimeout(function () {
                // for drawing the path on the canvas by looping through the ans
                authScript.drawOnCanvasAuth(AH.find('#mainContent', '#hptdraw canvas').getAttribute('id'), ans, surfaceColor);
            }, 2000);
        }
        window.surface = surface;
    }

    // get the coordinates of xaxis, and yaxis
    function getCoordinate(xaxis, yaxis, count) {
        if (count == 0) {
            drawstr = "{\"" + (++count) + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
        } else {
            drawstr = AH.find('#mainContent', '#hptdraw canvas').getAttribute('correctans');
            drawstr = drawstr.slice(0, -1);
            drawstr += ",\"" + (++count) + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
        }
        AH.find('#mainContent', '#hptdraw canvas', {action: 'attr', actionData: {correctans: drawstr}});
        update_XMLValue();
    }

    // it sets the data of variables, states according to the uploaded image and updates the xml
    function handleUpdatedData(change) {
        // for checking which type of dialog is
        if (change == 'img') {
            // goes in this block if it is the image dialog
            // setting state and storing the value
            state.bgImg = AH.select('#backgroundImage').value;
            state.alt = AH.select('#imgAlt').value;
            state.imgheight = AH.select('#imgHeight').value;
            state.imgwidth = AH.select('#imgWidth').value;
            state.hotBorder = AH.select('#hotBorder').value;
            state.hotBorderColor = AH.select('#hotBorderColor').value;
            globalThis.sda = AH.selectAll("#backgroundImage, #imgAlt, #imgHeight, #imgWidth, #hotBorder, #hotBorderColor");

            // here we are updating the value of alt,bgimg,imgheight,imgwidth in the xml state
            state.xml = state.xml.replace(/alt="(.*?)"/gmi, `alt="${state.alt.replace(/"/g, '&quot;')}"`);
            state.xml = state.xml.replace(/bgimg="(.*?)"/gmi, `bgimg="${state.bgImg}"`);
            state.xml = state.xml.replace(/imgheight="(.*?)"/gmi, `imgheight="${state.imgheight}"`);
            state.xml = state.xml.replace(/imgwidth="(.*?)"/gmi, `imgwidth="${state.imgwidth}"`);
            let jj = XMLToJSON(state.xml);

            // setting value of borderm bordercolor, linecolor
            jj.smxml.div._border = state.hotBorder;
            jj.smxml.div._bordercolor = state.hotBorderColor;
            jj.smxml.div._linecolor = window.color;
            let image = new Image();
            image.onload = function () {
                bgImgHeight = this.height + 'px';
                bgImgWidth = this.width + 'px';
                AH.select('#hptmain', 'css', { height: bgImgHeight, width: bgImgWidth });
                // used to update the height and width value when height and width goes over the maximum allowed value or below minimum allowed value
                if (jj.smxml.div._type == 'imagehighlight') {
                    jj.smxml._width = this.width;
                    jj.smxml._height = this.height;
                    AH.find('#hptdraw', 'canvas', {action: 'attr', actionData: {height: this.height, width: this.width} });
                    AH.selectAll('#previewSection .reset, #authoringLoadComponent .reset').forEach((_this)=> {
                        _this.click();
                    });
                }
                state.xml = JSONToXML(jj);
                // for storing and updating the xml
                getChildXml(state.xml);
            };
            image.src = bgImgPath + state.bgImg;
            state.openImg = false;
        } else {
            var isValidationOk = handleWarning();
            // goes here if it is draggable elment dialog
            if (isValidationOk) {
                var smxml = XMLToJSON(state.xml);
                hotAreaHeight = smxml.smxml.div._height = parseInt(AH.select('#dragHeight').value);
                hotAreaWidth = smxml.smxml.div._width = parseInt(AH.select('#dragWidth').value);
                hotAreaTop = smxml.smxml.div._top = parseInt(AH.select('#dragTop').value);
                hotAreaLeft = smxml.smxml.div._left = parseInt(AH.select('#dragLeft').value);
                state.openDrag = false;
                hotAreaHeight += 'px';
                hotAreaWidth += 'px';
                hotAreaTop += 'px';
                hotAreaLeft += 'px';
                
                // for storing and updating the xml
                getChildXml(JSONToXML(smxml));
                // setting the current xml on the current xml state
                state.xml = JSONToXML(smxml);
            }
        }
    }
    // checks for image when hotspot type is 'imagehighlight' as it passes the min and max allowed condition of height and width
    function handleSubmit(change) {
        let json_data = XMLToJSON(state.xml), argument_data = change, isWidthValid = true, isHeightValid = true, handlemodal = false;
        if (json_data.smxml.div._type == 'imagehighlight') {
            let image = new Image();
            image.onload = function () {
                // this block handle with default image height and width when uploaded image failed the condition
                if (handlemodal) {
                    bgImgHeight = json_data.smxml._height + 'px';
                    bgImgWidth = json_data.smxml._width + 'px';
                } else {
                    // used for set the height and width for checking purpose that it passes the min and max condition of height and width
                    bgImgHeight = this.height + 'px';
                    bgImgWidth = this.width + 'px';
                }
                // handle with width
                if (this.width >= 100 && this.width <= 1000) {
                    isWidthValid = true;
                    // handle with height if width is ok
                    if (this.height >= 80 && this.height <= 550) {
                        isHeightValid = true;
                    } else {
                        AH.alert(l.height_warning);
                        isHeightValid = false;
                    }
                } else {
                    AH.alert(l.width_warning);
                    isWidthValid = false;
                }
                
                // enters in this block if height and width passes the defined min and max condition
                if (isHeightValid && isWidthValid) {
                    // handle in case when uploading image failed and then default image sets
                    if (handlemodal) {
                        state.openImg = true;
                    } else {
                        // goes for other process if height and width passes the defined condition
                        handleUpdatedData(argument_data);
                    }
                } else {
                    console.log("Default Image set");
                    // in case when height and width does not passes the defined min and max condition
                    state.openImg = true;
                    image.src = bgImgPath + json_data.smxml._bgimg;
                    AH.selectAll('#backgroundImage').value = json_data.smxml._bgimg;
                    handlemodal = true;
                }
            };
            image.src = bgImgPath + AH.select('#backgroundImage').value;
        } else {
            handleUpdatedData(argument_data);
        }
    }

    // for closing the open dialog
    function handleClose() {
        //setState({openDrag: false});
        state.openDrag = false;
        state.openImg = false;
    }

    // when image edit button is clicked
    function changeImg() {
        // calling the function in timeout to show value after the dialog will open
        // restoring the value of the background image when the dialog will open again
        AH.select('#backgroundImage').value = state.bgImg;
        state.image_url = bgImgPath + '' + state.bgImg;
        AH.select(AH.select('#backgroundImage').previousElementSibling,'css', { transform: "scale(0.75) translate(0px, -28px)", color: "rgb(0, 188, 212)" });
        if (state.hotBorder) {
            // restoring the value of the image border when the dialog will open again
            AH.select('#hotBorder').value = state.hotBorder;
            AH.select(AH.select('#hotBorder').previousElementSibling, 'css', { transform: "scale(0.75) translate(0px, -28px)", color: "rgb(0, 188, 212)" });
        }
        if (state.hotBorderColor) {
            // restoring the value of the image border color when the dialog will open again
            AH.select('#hotBorderColor').value = state.hotBorderColor;
            AH.select(AH.select('#hotBorderColor').previousElementSibling, 'css', { transform: "scale(0.75) translate(0px, -28px)", color: "rgb(0, 188, 212)" });
        }

        // change the state of the openImg true as currently the dialog is open
        state.openImg = true;
    }

    // when draggable edit button is clicked
    function changeDrag() {
        state.openDrag = true;
        // calling the function in timeout to show value after the dialog will open
        var timer = setTimeout(function () {
            // setting the value of top,left,width,height in case of draggable element icon is clicked
            AH.select('#dragHeight').value = parseInt(AH.select('#ID0').style.height);
            AH.select('#dragWidth').value = parseInt(AH.select('#ID0').style.width);
            AH.select('#dragTop').value = parseInt(AH.select('#ID0').style.top);
            AH.select('#dragLeft').value = parseInt(AH.select('#ID0').style.left);
            clearTimeout(timer);
        }, 300);
        // change the state of the image to true as the dialog is opened 
    }

    // @pradeep sir Please verify this function is not calling
    function handleChangeMultiple(event, value) {
        if (value == 1 || value == 2) {
            initEditor();
        }
        var newXml = XMLToJSON(defaultXml[value])
        parseXmlForText(newXml);
        switch (value) {
            case "1": parseXmlForText(newXml); break;
            case "2": parseXmlForText(newXml); break;
            case "3": parseXmlForDraw(newXml); break;
            case "4": parseXML(newXml); break;
        }
        state.valueMultiple = value;
        state.xml = defaultXml[value];
        getChildXml(state.xml);
    }

    // calls in case of text and token highlight and change the style of correct answer
    function getData(xml) {
        // replacing the correct answer with span to give it styling
        xml = xml.replace(/%{/gm, '<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">').replace(/}%/gm, '</span>');
        AH.find('#mainContent', '.tinymce-editor-response').innerHTML = xml;
    }

    // update the xml
    function update_XMLValue() {
        // get the dom of the xml
        var xmlDom = AH.parseHtml(state.xml);
        // get the type
        var typ = xmlDom.querySelector('div')?.getAttribute('type');
        // check if the type is imagehighlight then update the cdata
        if (typ == 'imagehighlight') xmlDom.querySelector('div').innerHTML = '<![CDATA[' + AH.find('#mainContent', '#hptdraw canvas').getAttribute('correctans') + ']]>';

        var getCdata = state.xml;
        if (getCdata) {
            // replacing the current state xml with the new one
            var getCdataClean = state.xml.replace(getCdata, formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom)));
            state.xml = getCdataClean.toString();
            getChildXml(state.xml);
        }
    }

    // in case of text & token highlight update the cdata
    function setData() {
        var arr = [];
        var selectedText = '';
        // for getting the content
        var data = tinyMCE.activeEditor.getContent({ format: 'raw' });
        // Here finding the element span having data-type="select" and storing it in arr
        arr = data.match(/<span data-type="select"(.*?)>(.*?)<\/span>/gi);

        // if arr is not blank, then changing the text between the span by encolsing it in the symbol {%, %} in the data
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                selectedText = arr[i].replace(/<span data-type="select"(.*?)>|<\/span>/gm, '');
                data = data.replace(arr[i], '%{' + selectedText + '}%');
            }
        }
        // Finding the text betwenn the <!--[CDATA , ]-->
        var getCdata = state.xml.match(/<!--\[CDATA\[(.*?)\]\]-->/gm);

        // if match found
        if (getCdata) {
            var getCdataClean = getCdata.toString().replace("<!--[CDATA[", '').replace("]]-->", '');
            //adding the data in cdata and replacing it with current xml cdata
            getCdataClean = state.xml.replace(getCdata, '<!--[CDATA[' + data + ']]-->');

            // updating the state 
            state.xml = getCdataClean.toString();
            
            // updaing and storing the xml
            getChildXml(getCdataClean.toString());
        }
    }

    //For binding key event in case of spot an image
    function bindKey() {
        AH.bind(document, 'keydown', (e)=> {
            // in case of ctrl key and shift key is stored 
            /**
             * 37 : left arrow key
             * 38 : up arrow key
             * 39 : right arrow key
             * 40 : down arrow key
             * 27 : esc key
            */
            if (e.ctrlKey && e.shiftKey) {
                switch ((e.keyCode).toString()) {
                    case "37":
                        setPS(-10, 0, 0, 0);
                        break;
                    case "38":
                        setPS(0, -10, 0, 0);
                        break;
                    case "39":
                        setPS(10, 0, 0, 0);
                        break;
                    case "40":
                        setPS(0, 10, 0, 0);
                        break;
                }
            } else if (e.shiftKey) {
                // in case of shiftKey
                switch ((e.keyCode).toString()) {
                    case "37":
                        setPS(-1, 0, 0, 0);
                        break;
                    case "38":
                        setPS(0, -1, 0, 0);
                        break;
                    case "39":
                        setPS(1, 0, 0, 0);
                        break;
                    case "40":
                        setPS(0, 1, 0, 0);
                        break;
                }
            } else if (e.ctrlKey) {
                // in case of ctrl key
                switch ((e.keyCode).toString()) {
                    // arrow keys
                    case "37":
                        setPS(0, 0, 0, -10);
                        break;
                    case "38":
                        setPS(0, 0, -10, 0);
                        break;
                    case "39":
                        setPS(0, 0, 0, 10);
                        break;
                    case "40":
                        setPS(0, 0, 10, 0);
                        break;
                }
            } else {
                switch ((e.keyCode).toString()) {
                    case "27":
                        // esc key
                        AH.selectAll('.dragable-container .ui-draggable', 'removeClass', 'elemActive');
                        break;
                    case "38":
                        // up arrow
                        e.preventDefault();
                        setPS(0, 0, -1, 0);
                        break;
                    case "40":
                        // down arrow
                        e.preventDefault();
                        setPS(0, 0, 1, 0);
                        break;
                }
            }
        });
    }

    // for changing linecolor 
    function changeLine(elem) {
        // setting the target value color in linecolor state
        state.lineColor = elem.target.value;
        // setting it in window
        window.color = state.lineColor;
    }

    // for setting position or size of the draggable element in spot an image module
    function setPS (w, h, t, l, del) {
        console.log("setps");
        let ac = AH.select('#ID0');
        if (ac) {
            let acRect = ac.getBoundingClientRect();
            let key = ac.getAttribute('id');
            let xmlDom = AH.parseHtml(state.xml);
            let insert = xmlDom.querySelector('[id="' + key + '"]');
            if (typeof (del) !== "undefined" && del) {
                if (confirm('Do you want to delete it?')) {
                    ac.remove();
                    insert.remove();
                }
            } else if (ac.offsetWidth > 0 && ac.offsetHeight > 0) { // is visible
                w = ac.clientWidth + w;
                h = ac.clientHeight + h;
                t = acRect.top + t;
                l = acRect.left + l;
                AH.select(ac, 'css', { width: w + "px", height: h + "px", top: t + "px", left: l + "px" });
                let attributes = AH.select('[id="' + key + '"]').dataset['attributes'];
                JSON.stringify(attributes).forEach((value, index)=> {
                    switch (value.name) {
                        case "width":
                            value.value = parseInt(ac.clientWidth);
                            insert.setAttribute('width', value.value);
                            break;
                        case "height":
                            value.value = parseInt(ac.clientHeight);
                            insert.setAttribute('height', value.value);
                            break;
                        case "top":
                            value.value = parseInt(acRect.top);
                            insert.setAttribute('top', value.value);
                            break;
                        case "left":
                            value.value = parseInt(acRect.left);
                            insert.setAttribute('left', value.value);
                            break;
                    }
                });
                AH.select('[id="' + key + '"]').dataset['attributes'] = attributes;
            }

            // for updating the xml
            AH.select('#special_module_xml').value = xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom[0]);
            state.xml = xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom[0]);
            getChildXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom[0]));
        }
    }

    let m_posX;
    let m_posY;
    $:m_posX;
    $:m_posY;
    let resize_elW;
    let resize_elH;
    let resize_elWH;
    function resizeX(e){
        let parent = resize_elW.parentNode;
        let dx = m_posX - e.x;
        m_posX = e.x;
        parent.style.width = (parseInt(getComputedStyle(parent, '').width) - dx) + "px";
    }
    function resizeY(e){
        let parent = resize_elH.parentNode;
        let dy = m_posY - e.y;
        m_posY = e.y;
        parent.style.height = (parseInt(getComputedStyle(parent, '').height) - dy) + "px";
    }
    function resizeXY(e){
        let parent = resize_elH.parentNode;
        let dx = m_posX - e.x;
        let dy = m_posY - e.y;
        m_posX = e.x;
        m_posY = e.y;
        parent.style.width = (parseInt(getComputedStyle(parent, '').width) - dx) + "px";
        parent.style.height = (parseInt(getComputedStyle(parent, '').height) - dy) + "px";
    }

    function resizeHandleW(e){
        m_posX = e.x;
        document.removeEventListener("mousemove", resizeY, false);
        document.addEventListener("mousemove", resizeX, false);
        document.addEventListener("mouseup", function(){
            document.removeEventListener("mousemove", resizeX, false);
            document.removeEventListener("mousemove", resizeY, false);
            document.removeEventListener("mousemove", resizeXY, false);
        }, false);
    }
    function resizeHandleH(e){
        m_posY = e.y;
        document.removeEventListener("mousemove", resizeX, false);
        document.addEventListener("mousemove", resizeY, false);
        document.addEventListener("mouseup", function(){
            document.removeEventListener("mousemove", resizeX, false);
            document.removeEventListener("mousemove", resizeY, false);
        }, false);
    }
    function resizeHandleWH(e){
        m_posX = e.x;
        m_posY = e.y;
        document.removeEventListener("mousemove", resizeX, false);
        document.removeEventListener("mousemove", resizeY, false);
        document.addEventListener("mousemove", resizeXY, false);
        document.addEventListener("mouseup", function(){
            document.removeEventListener("mousemove", resizeX, false);
            document.removeEventListener("mousemove", resizeY, false);
            document.removeEventListener("mousemove", resizeXY, false);
        }, false);
    }
</script>
<div>
    <center class="mt" id="mainContent">
        <div
            class="tinymce-editor-response"
            id="text0"
            type={moduleArr[0]}
            style="
                width: {bgImgWidth}, 
                height: {bgImgHeight}, 
                border: 1px solid #ccc; 
                outline: none; 
                padding: 10px; 
                textAlign: left; 
                display: none; 
                overflowY: scroll
            "
            on:keyup={setData}
            contentEditable="true"
        >
        </div>
        <div class="drawImage d-none">
            <div 
                style = "
                width: {bgImgWidth}; 
                height: 32px;
                background: #d9e7fd;
                border-top: 2px solid #96bbf6
            "
            >
                <div 
                    id="resetAuth" 
                    class="reset btn btn-outline-primary btn-sm height27 mt-sm2 mr-sm2 float-right"
                    style="width: 90px;"
                >
                    <span class="icomoon-new-24px-reset-1 s3" style="vertical-align: text-top"></span> 
                    <span class="position-relative bottom1">{l.reset}</span>
                </div>
            </div>
            <div 
                id="hptdraw" 
                style="
                    width: {bgImgWidth}; 
                    height: {bgImgHeight}; 
                    background-image: url('{bgImgPath + state.bgImg}'); 
                    background-repeat: no-repeat; 
                    position: relative; 
                    border: 1px solid #e0e0e0;
                "
            >
                <div class="btn-group tools">
                    <button 
                        name="change_image"
                        type="button" 
                        on:click={changeImg.bind(this, 'img')} 
                        class="btn btn-light px-1 pt-sm1 pb-sm1 mt"
                    >
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                </div>
            </div>
        </div>
        <div 
            id="hptmain" 
            path={bgImgPath} 
            class="d-none"
            style="position: relative; width: {bgImgWidth};"
        >
            <div class="btn-group tools">
                <button 
                    type="button" 
                    on:click={changeImg.bind(this, 'img')} 
                    class="btn btn-light px-1 pt-sm1 pb-sm1 mt"
                >
                    <i class="icomoon-24px-edit-1"></i>
                </button>
            </div>
            <img 
                id="im" 
                class="hotSpotImg border" 
                src={bgImgPath + state.bgImg} 
                style="
                    height: {state.imgheight};
                    width: {state.imgwidth}; 
                    border: {state.hotBorder};
                    border-color: {state.hotBorderColor};
                " 
                alt={state.alt} 
            />
            <div 
                draggable={true}
                class="drag-resize position-absolute" 
                id="ID0" 
                style="left: {hotAreaLeft}; top: {hotAreaTop}; height: {hotAreaHeight}; width: {hotAreaWidth};"
            >
                <div class="btn-group tools h">
                    <button 
                        type="button" 
                        on:click={changeDrag.bind(this, 'drag')} 
                        class="btn btn-light px-1 pt-sm1 pb-sm1"
                    >
                        <i class="icomoon-24px-edit-1"></i>
                    </button>
                </div>
                <div id="resizeX" bind:this={resize_elW} on:mousedown|preventDefault|stopPropagation={resizeHandleW}></div>
                <div id="resizeY" bind:this={resize_elH} on:mousedown|preventDefault|stopPropagation={resizeHandleH}></div>
                <div id="resizeXY" bind:this={resize_elWH} on:mousedown|preventDefault|stopPropagation={resizeHandleWH}></div>
            </div>
        </div>
        <textarea 
            class="d-none" 
            id="special_module_xml" 
            name="special_module_xml" 
            value={state.xml}
        ></textarea>
    </center>
    <Dialog class="remove_right_margin" width="600" bind:visible={state.openImg} style="background: #fff; border-radius: 5px;">
        <h4 class="mt-1 font21 mb-4">
            <div class="d-flex justify-content-between">
                <div>Image</div>
            </div>
        </h4>
        <div style="overflow-y: auto; padding-right: 20px;">
            <div class="d-flex">
                <input
                    type="text"
                    id="backgroundImage"
                    disabled="true"
                    value={state.bgImg}
                    margin="normal"
                    style="pointer-events: none; width: 76%;"
                    class="form-control mr-2"
                />
                <button
                    id="upload_media"
                    type="button"
                    value="Upload Media"
                    margin="normal"
                    class="btn btn-outline-primary position-relative"
                >Upload image</button>
            </div>
            <div class="mx-auto width8 p-2 border mt-2">
                <img src={state.image_url} alt="background" class="img img-responsive span7" />
            </div>
            <span>
                <label for="imgAlt" class={(state.valueMultiple == 4) ? "my-1 text-dark" : "hidden"}>Image Alt</label>
            </span>
            <input
                type="text"
                id="imgAlt"
                placeholder="Alt text"
                class={(state.valueMultiple == 4) ? " form-control mt-0" : "hidden form-control mt-0"}
                bind:value={state.alt}
                margin="normal"
                style="width: -webkit-fill-available;"
            />
            <div class="d-flex">
                <div class={(state.valueMultiple == 4) ? "d-inline-block pr-2 mt-2 w-sm" : "hidden"}>
                    <span>
                        <label for="hotBorder" class="my-1 text-dark">Border width</label>
                    </span>
                    <select id="hotBorder" class="form-select" bind:value={state.hotBorder}>
                        <option value="0">None</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div class={(state.valueMultiple == 4) ? "d-inline-block mt-2 w-sm" : "hidden"}>
                    <span>
                        <label for="hotBorderColor" class="my-1 text-dark">Border color</label>
                    </span>
                    <select id="hotBorderColor" class="form-select" bind:value={state.hotBorderColor}>
                        <option value="white">None</option>
                        <option value="black">Black</option>
                        <option value="grey">Grey</option>
                    </select>
                </div>
            </div>
            <br />
            <div class={(state.valueMultiple == 3) ? "" : "hidden"}>
                <span>
                    <label for="setLineColor" class="mt-2 text-dark">Draw line color</label>
                </span>
                <select id="setLineColor" class="form-select" bind:value={state.lineColor} on:blur={changeLine.bind(this)} >
                    <option>Please Select</option>
                    <option value="red">Red</option>
                    <option value="black">Black</option>
                    <option value="blue">Blue</option>
                </select>
            </div>
        </div>
        <div slot="footer" class="svelteFooter" >
            <Button
                on:click={handleClose}
                unelevated={true}
                outlined={true}
                class="text-capitalize"
                color="#ccc"
            > {l.cancel} 
            </Button>
            <Button
                on:click={handleSubmit.bind(this, 'img')}
                class="bg-primary text-white"
                style="text-transform: none"
                key={l.submit}
            > {l.submit}
            </Button>
        </div>
    </Dialog>
    <Dialog class="remove_right_margin" width="600" bind:visible={state.openDrag} style="background: #fff; border-radius: 5px;">
        <h4 class="mt-1 font21 mb-4">
            <div class="d-flex justify-content-between">
                <div>Hotspot</div>
            </div>
        </h4>
        <div style="overflow-y: auto; padding-right: 20px;">
            <div class="row">
                <div class="col-6 pr-1">
                    <span>
                        <label for="dragHeight" class="my-1 text-dark">Height</label>
                    </span>
                    <input
                        type="number"
                        id="dragHeight"
                        placeholder="Height"
                        defaultValue=" "
                        class="form-control"
                    />
                </div>
                <div class="col-6 pl-1">
                    <span>
                        <label for="dragWidth" class="my-1 text-dark">Width</label>
                    </span>
                    <input
                        type="number"
                        id="dragWidth"
                        placeholder="Width"
                        defaultValue=" "
                        class="form-control"
                    />
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-6 pr-1">
                    <span>
                        <label for="dragTop" class="my-1 text-dark">Top</label>
                    </span>
                    <input
                        type="number"
                        id="dragTop"
                        placeholder="Top"
                        defaultValue=" "
                        class="form-control"
                    />
                </div>
                <div class="col-6 pl-1">
                    <span>
                        <label for="dragLeft" class="my-1 text-dark">Left</label>
                    </span>
                    <input
                        type="number"
                        id="dragLeft"
                        placeholder="Left"
                        defaultValue=" "
                        class="form-control"
                    />
                </div>
            </div>    
        </div>
        <div slot="footer" class="svelteFooter">
            <Button
                on:click={handleClose}
                unelevated={true}
                outlined={true}
                class="text-capitalize"
                color="#ccc"
            > {l.cancel} 
            </Button>
            <Button
                on:click={handleSubmit.bind(this, 'drag')}
                class="bg-primary text-white"
                style="text-transform: none"
                key={l.done}
            >
                {l.done}
            </Button>
        </div>
    </Dialog>
    <Snackbar bind:visible={state.snackback} bg="#f44336" bottom={true} timeout={10} style="position:fixed; bottom:50px">
        {message}
        <span slot="action">
            <Button color="#ff0" on:click={() => (state.snackback = false)}>Close</Button>
        </span>
    </Snackbar>
</div>

<style>
    #resizeX {
        position: absolute;
        right: 0;
        width: 3px;
        opacity: 0;
        height: 100%;
        cursor: w-resize;
    }
    #resizeY {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 3px;
        opacity: 0;
        cursor: s-resize;
    }
    #resizeXY {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 3px;
        height: 3px;
        opacity: 0;
        cursor: se-resize;
    }
    </style>