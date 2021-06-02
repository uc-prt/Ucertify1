/**
 *  File Name   : dndAuthString.js
 *  Author      : Ayush Srivastava
 *  Function    : DND_AUTH
 *  Version     : 1.0
 *  Packege     : Drag and Drop (auth)
 *  Last update : 19 Jan 2021
 *  Dependency  : AI , Contextmenu, Codemirror
 */
import ContextMenu from '../plugins/context';
import CodeMirror from '../plugins/javascript_syntax';
import swal from 'sweetalert';
import l from '../../../src/libs/Lang';

const DND_AUTH = {};

DND_AUTH.isDNDExtended = 0;
DND_AUTH.error_message = '';
// variable for detecting the visible authoring modal
DND_AUTH.visible_class = '';

/*
 * Used for storing the data of the dnd auth
 * in obj we always pass id of the node in which we have to save the data
 * DND_AUTH.storage.store() return all the store data 
 */
DND_AUTH.storage = {
    store: function(obj, key, val) {
        if (!obj) {
            return this.state;
        } else if (!key) {
            if (!(obj in this.state)) {
                return {};
            }
            return this.state[obj];
        } else if (arguments.length < 3) {
            if (!(obj in this.state)) {
                return undefined;
            }
            return this.state[obj][key];
        } else {
            if (!(obj in this.state)) {
                this.state[obj] = {};
            }
            this.state[obj][key] = val;
        }
    },
    state: {}
}

// Used for the contextmenu showing on the right click
DND_AUTH.contextMenuOption = function() {
    let dropdown = (DND_AUTH.isDNDExtended) ? [{
            text: l.draggable,
            onclick: () => {
                DND_AUTH.elemModal("drag");
            }
        },
        {
            text: l.placeholder,
            onclick: () => {
                DND_AUTH.elemModal("drop")
            }
        },
        null,
        {
            text: l.input,
            hotkey: '❯',
            subitems: [{
                    text: l.input_box,
                    onclick: () => {
                        DND_AUTH.elemModal("input");
                    }
                },
                {
                    text: l.checkbox_input,
                    onclick: () => {
                        DND_AUTH.elemModal("checkbox");
                    }
                },
                {
                    text: l.multiline_text_box,
                    onclick: () => {
                        DND_AUTH.elemModal("multiline");
                    }
                },
                {
                    text: l.radio_inout,
                    onclick: () => {
                        DND_AUTH.elemModal("radio");
                    }
                },
                {
                    text: l.btn_txt,
                    onclick: () => {
                        DND_AUTH.elemModal("button");
                    }
                },
            ]
        },
        null,
        {
            text: l.select,
            hotkey: '❯',
            subitems: [{
                    text: l.select_dropdown,
                    onclick: () => {
                        DND_AUTH.elemModal("dropdown");
                    }
                },
                {
                    text: l.new_menu,
                    onclick: () => {
                        DND_AUTH.elemModal("menulist");
                    }
                },
            ]
        },
        null,
        {
            text: l.clickable,
            onclick: () => {
                DND_AUTH.elemModal("tabhead")
            }
        },
        null,
        {
            text: l.new_label,
            onclick: () => {
                DND_AUTH.elemModal("label")
            }
        },
        null,
        {
            text: l.hotspot,
            onclick: () => {
                DND_AUTH.elemModal("hotspot")
            }
        },
        null,
        {
            text: l.new_tab,
            onclick: () => {
                DND_AUTH.elemModal("tab")
            }
        },
        {
            text: l.new_steps,
            onclick: () => {
                DND_AUTH.elemModal("step")
            }
        },
        {
            text: l.insert_script,
            onclick: () => {
                DND_AUTH.elemModal("jscript")
            }
        },
    ] : [{
            text: l.draggable,
            onclick: () => {
                DND_AUTH.elemModal("drag");
            }
        },
        {
            text: l.placeholder,
            onclick: () => {
                DND_AUTH.elemModal("drop")
            }
        },
        null,
        {
            text: l.input,
            hotkey: '❯',
            subitems: [{
                    text: l.input_box,
                    onclick: () => {
                        DND_AUTH.elemModal("input");
                    }
                },
                {
                    text: l.checkbox_input,
                    onclick: () => {
                        DND_AUTH.elemModal("checkbox");
                    }
                },
                {
                    text: l.multiline_text_box,
                    onclick: () => {
                        DND_AUTH.elemModal("multiline");
                    }
                },
                {
                    text: l.radio_inout,
                    onclick: () => {
                        DND_AUTH.elemModal("radio");
                    }
                },
                {
                    text: l.btn_txt,
                    onclick: () => {
                        DND_AUTH.elemModal("button");
                    }
                },
            ]
        },
        null,
        {
            text: l.select,
            onclick: () => {
                DND_AUTH.elemModal("dropdown");
            }
        },
        null,
        {
            text: l.clickable,
            onclick: () => {
                DND_AUTH.elemModal("tabhead")
            }
        },
        null,
        {
            text: l.new_label,
            onclick: () => {
                DND_AUTH.elemModal("label")
            }
        },
        null,
        {
            text: l.hotspot,
            onclick: () => {
                DND_AUTH.elemModal("hotspot")
            }
        }
    ];
    const dragndrop_contextmenu = new ContextMenu(AI.select('#dndmain'), dropdown);
    dragndrop_contextmenu.install();
}

// used for binding the data and store in the storage 
DND_AUTH.bind_data = function(xml) {
    let elem = xml.getAttribute('id'),
        attrs = [];
    if (xml.nodeName == "SMXML") {
        elem = "dndmain";
    }
    for (let index = 0; index < xml.attributes.length; index++) {
        attrs[index] = {
            "name": xml.attributes[index].name,
            "value": xml.attributes[index].value
        }
    }
    if (xml.children.length == 0 && xml.innerText.trim() != "") {
        attrs[attrs.length] = {
            "name": "value",
            "value": xml.innerText.trim()
        }
    }
    if (xml.nodeName == "MULTILINEBOX") {
        attrs[attrs.length] = {
            "name": "defaultans",
            "value": DND_AUTH.clearCdata(AI.find(xml, 'defaultans') ? AI.find(xml, 'defaultans').innerHTML : '')
        };
        attrs[attrs.length] = {
            "name": "correctans",
            "value": DND_AUTH.clearCdata(AI.find(xml, 'correctans') ? AI.find(xml, 'correctans').innerHTML : '')
        };
    }
    if (typeof elem != "undefined" && elem) {
        DND_AUTH.storage.store('#' + elem, 'attributes', attrs);
    }
    if (xml.children.length > 0) {
        for (let index = 0; index < xml.children.length; index++) {
            let nd = (xml.children[index].nodeName).toLowerCase(),
                obj = xml.children[index];
            if (nd == "jscript") {
                AI.select('#authoring-modal #code').value = obj.innerText;
                DND_AUTH.setfunc(obj.innerText);
            } else {
                DND_AUTH.bind_data(obj);
            }
        }
    }
}

// for clearing the cdata
DND_AUTH.clearCdata = function(text) {
    return (typeof text != "undefined" ? text.replace("<!--[CDATA[", "").replace("]]-->", "").trim() : "");
}

// for getting the offset
DND_AUTH.offset = function(element) {
    let rect = element.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
}

// for getting the position
DND_AUTH.position = function(element) {
    return {
        left: element.offsetLeft,
        top: element.offsetTop
    }
}

// function calls whenever the authoring modal is open and resposible for overall functionality of authoring modal
DND_AUTH.elemModal = function(type, _this, key, bgImg, state = {}) { 
    if (type != "jscript") {
        let objects = [];
        let data = AI.selectAll('#authoring-modal .h:not(.jscript)');
        let obj_index = 0;
        for (let index = 0; index < data.length; index++) {
            let subnode = AI.find(data[index], 'select,textarea,input', 'all');
            if (subnode.length > 0) {
                for (let subindex = 0; subindex < subnode.length; subindex++) {
                    objects[obj_index] = subnode[subindex];
                    obj_index++;
                }
            }
        }

        DND_AUTH.resetAttr(objects);
        AI.selectAll('#authoring-modal .events a', 'removeClass', 'active');
        AI.find('#authoring-modal', '.events a .icomoon-checkmark', {
            action: 'remove',
        })
    }
    let parent = AI.select('.parent').getAttribute("data-parent")
    let htmlparent = parent == "dndmain" ? "#dndmain" : parent;
    let pos = [];
    let labkey = key;
    let hptkey = key;
    if (typeof(key) == "undefined") {
        key = false;
        labkey = 'ID' + DND_AUTH.getID(AI.selectAll(('[id^=ID]')).length);
        if (_this && _this.length) {
            let cur_elem = AI.select(_this);
            hptkey = (cur_elem) ? cur_elem.getAttribute('id') + '_' + (AI.find(cur_elem, '.hs_item', 'all').length + 1) : '';
        }
    }
    try {
        if (AI.select('.context').getAttribute) {
            let o = DND_AUTH.offset(AI.select(htmlparent));
            pos[0] = parseInt(AI.select('.context').getAttribute('clienty')) - o.top;
            pos[1] = parseInt(AI.select('.context').getAttribute('clientx')) - o.left;
        }
    } catch (e) {
        console.warn("Top not found");
    }
    if (pos[0] < 0) {
        pos[0] = 0;
    }
    pos[0] = isNaN(pos[0]) ? 0 : Math.round(pos[0]);
    pos[1] = isNaN(pos[1]) ? 0 : Math.round(pos[1]);
    AI.selectAll('#authoring-modal .modal-body>.h', 'hide');

    AI.select('#authoring-modal .addElement', 'removeClass', 'h');
    AI.select('#authoring-modal .errorBtn', 'addClass', 'h');

    DND_AUTH.visible_class = '';
    DND_AUTH.error_message = '';
    switch (type) {
        case "drag":
            AI.select('#authoring-modal .modal-title').innerText = l.draggable + ' - ' + labkey;
            AI.selectAll('#authoring-modal .drag', 'show', 'block')
            AI.select('#authoring-modal #drag-top').value = pos[0];
            AI.select('#authoring-modal #drag-left').value = pos[1];
            AI.select('#authoring-modal #drag-id').value = labkey;
            DND_AUTH.visible_class = '.drag';
            break;
        case "drop":
            AI.select('#authoring-modal .modal-title').innerText = l.placeholder + ' - ' + labkey;
            AI.selectAll('#authoring-modal .dropitem', 'show', 'block')
            AI.select('#authoring-modal #drop-top').value = pos[0];
            AI.select('#authoring-modal #drop-left').value = pos[1];
            AI.select('#authoring-modal #drop-id').value = labkey;
            DND_AUTH.visible_class = '.dropitem';

            break;
        case "input":
            AI.select('#authoring-modal .modal-title').innerText = l.input_box + ' - ' + labkey;
            AI.selectAll('#authoring-modal .inputbox', 'show', 'block')
            AI.select('#authoring-modal #int-top').value = pos[0];
            AI.select('#authoring-modal #int-left').value = pos[1];
            AI.select('#authoring-modal #int-id').value = labkey;
            AI.select('#authoring-modal .inputbox #custom_class_input').innerHTML = DND_AUTH.customClassOptions();
            DND_AUTH.visible_class = '.inputbox';

            break;
        case "multiline":
            AI.select('#authoring-modal .modal-title').innerText = l.multiline_text_box + ' - ' + labkey;
            AI.selectAll('#authoring-modal .multiline', 'show', 'block');
            AI.select('#authoring-modal #mlt-top').value = pos[0];
            AI.select('#authoring-modal #mlt-left').value = pos[1];
            AI.select('#authoring-modal #mlt-id').value = labkey;
            AI.select('#authoring-modal .multiline #custom_class').innerHTML = DND_AUTH.customClassOptions();
            DND_AUTH.visible_class = '.multiline';

            break;
        case "checkbox":
            AI.select('#authoring-modal .modal-title').innerText = l.checkbox_input + ' - ' + labkey;
            AI.selectAll('#authoring-modal .chekbox', 'show', 'block');
            AI.select('#authoring-modal #chk-top').value = pos[0];
            AI.select('#authoring-modal #chk-left').value = pos[1];
            AI.select('#authoring-modal #chk-id').value = labkey;
            DND_AUTH.visible_class = '.chekbox';

            break;
        case "radio":
            AI.select('#authoring-modal .modal-title').innerText = l.radio_inout + ' - ' + labkey;
            AI.selectAll('#authoring-modal .rdio', 'show', 'block');
            AI.select('#authoring-modal #rd-top').value = pos[0];
            AI.select('#authoring-modal #rd-left').value = pos[1];
            AI.select('#authoring-modal #rd-id').value = labkey;
            DND_AUTH.visible_class = '.rdio';

            break;
        case "button":
            AI.select('#authoring-modal .modal-title').innerText = l.btn_txt + ' - ' + labkey;
            AI.selectAll('#authoring-modal .button', 'show', 'block');
            AI.select('#authoring-modal #btn-top').value = pos[0];
            AI.select('#authoring-modal #btn-left').value = pos[1];
            AI.select('#authoring-modal #btn-id').value = labkey;
            DND_AUTH.visible_class = '.button';

            break;
        case "dropdown":
            AI.select('#authoring-modal .modal-title').innerText = l.select_dropdown + ' - ' + labkey;
            AI.selectAll('#authoring-modal .dropdown', 'show', 'block');
            AI.select('#authoring-modal #ddn-top').value = pos[0];
            AI.select('#authoring-modal #ddn-left').value = pos[1];
            AI.select('#authoring-modal #ddn-id').value = labkey;
            DND_AUTH.visible_class = '.dropdown';
            break;
        case "listbox":
            AI.select('#authoring-modal .modal-title').innerText = l.select_list + ' - ' + labkey;
            AI.selectAll('#authoring-modal .listbox', 'show', 'block');
            AI.select('#authoring-modal #lst-top').value = pos[0];
            AI.select('#authoring-modal #lst-left').value = pos[1];
            AI.select('#authoring-modal #lst-id').value = labkey;
            DND_AUTH.visible_class = '.listbox';

            break;
        case "tabhead":
            AI.select('#authoring-modal .modal-title').innerText = l.clickable + ' - ' + labkey;
            AI.selectAll('#authoring-modal .tabhead', 'show', 'block');
            AI.select('#authoring-modal #tbd-top').value = pos[0];
            AI.select('#authoring-modal #tbd-left').value = pos[1];
            AI.select('#authoring-modal #tbd-id').value = labkey;
            DND_AUTH.visible_class = '.tabhead';

            break;
        case "img":
            AI.select('#authoring-modal .modal-title').innerText = l.image_txt + ' - ' + labkey;
            AI.selectAll('#authoring-modal .img', 'show', 'block');
            AI.select('#authoring-modal #img-top').value = pos[0];
            AI.select('#authoring-modal #img-left').value = pos[1];
            AI.select('#authoring-modal #img-id').value = labkey;
            DND_AUTH.visible_class = '.img';

            break;
        case "label":
            {
                let xml_node;
                if (AI.select('#special_module_xml').value && AI.select('#special_module_xml').value.trim() != '') {
                    xml_node = AI.parseHtml(AI.select('#special_module_xml').value);
                }
                let xmlDomVal = AI.find(xml_node, '#' + key);
                if (xmlDomVal && xmlDomVal.getAttribute && xmlDomVal.getAttribute('richtext')) {
                    setTimeout(function() {
                        AI.select('#authoring-modal #rich_label_title').checked = true;

                        let cdataText = xmlDomVal.innerHTML.trim();
                        cdataText = cdataText.substring(11, (cdataText.length - 5));

                        AI.select('#authoring-modal #lbl-title').value = cdataText;
                    }, 1000);
                } else {
                    AI.select('#authoring-modal #rich_label_title').checked = false;
                }

                AI.select('#authoring-modal .modal-title').innerText = l.label + ' - ' + labkey;
                AI.selectAll('#authoring-modal .labal', 'show', 'block');
                AI.select('#authoring-modal #lbl-top').value = pos[0];
                AI.select('#authoring-modal #lbl-left').value = pos[1];
                AI.select('#authoring-modal #lbl-id').value = labkey;
                AI.select('#authoring-modal #label_class').innerHTML = DND_AUTH.labelClassOptions();
                DND_AUTH.visible_class = '.labal';
            }

            break;
        case "area":
            AI.select('#authoring-modal .modal-title').innerText = l.area_matrix + ' - ' + labkey;
            AI.selectAll('#authoring-modal .area', 'show', 'block');
            AI.select('#authoring-modal #area-top').value = pos[0];
            AI.select('#authoring-modal #area-left').value = pos[1];
            AI.select('#authoring-modal #area-id').value = labkey;
            DND_AUTH.visible_class = '.area';

            break;
        case "menulist":
            AI.select('#authoring-modal .modal-title').innerText = l.new_menu + ' - ' + labkey;
            AI.selectAll('#authoring-modal .menulist', 'show', 'block');
            AI.select('#authoring-modal #mnl-top').value = pos[0];
            AI.select('#authoring-modal #mnl-left').value = pos[1];
            AI.select('#authoring-modal #mnl-id').value = labkey;
            DND_AUTH.visible_class = '.menulist';

            break;
        case "hotspot":
            AI.select('#authoring-modal .modal-title').innerText = l.hotspot + ' - ' + labkey;
            AI.selectAll('#authoring-modal .hotspot', 'show', 'block');
            AI.select('#authoring-modal #hpt-top').value = pos[0];
            AI.select('#authoring-modal #hpt-left').value = pos[1];
            AI.select('#authoring-modal #hpt-id').value = labkey;
            DND_AUTH.visible_class = '.hotspot';

            break;
        case "hotspot_click":
            if (!key) {
                pos = [10, 10];
            }
            AI.select('#authoring-modal .modal-title').innerText = l.hotspot + ' ' + l.clickable + ' - ' + hptkey;
            AI.selectAll('#authoring-modal .hotspot_click', 'show', 'block');
            AI.select('#authoring-modal #hpt_clk-top').value = pos[0];
            AI.select('#authoring-modal #hpt_clk-left').value = pos[1];
            AI.select('#authoring-modal #hpt_clk-id').value = hptkey;
            DND_AUTH.visible_class = '.hotspot_click';

            break;
        case "tab":
            if (AI.select('.parent').getAttribute('type') == 'tab') {
                AI.select('#authoring-modal .modal-title').innerText = l.new_pills;
            } else {
                AI.select('#authoring-modal .modal-title').innerText = l.new_tab;
            }
            AI.selectAll('#authoring-modal .tab', 'show', 'block');
            AI.select('#authoring-modal #tab-id').value = labkey;
            DND_AUTH.visible_class = '.tab';

            break;
        case "step":
            parent = AI.select('.parent').getAttribute("data-parent");
            if (AI.select('.parent').getAttribute('type') == "tab") {
                parent = 'dndmain';
            }
            if (parent != 'dndmain' && !key) {
                labkey = AI.select('#' + parent).getAttribute('id') + '_' + AI.selectAll('#dndmain>.step').length;
            }

            AI.select('#authoring-modal .modal-title').innerText = l.new_steps + ' - ' + labkey;
            AI.selectAll('#authoring-modal .step', 'show', 'block');
            AI.select('#authoring-modal #step-id').value = labkey;
            DND_AUTH.visible_class = '.step';

            break;
        case "base": {
                AI.select('#authoring-modal .modal-title').innerText = l.base;
                AI.selectAll('#authoring-modal .base', 'all');
                if (state.imgWidth) {
                    AI.select('#authoring-modal #base-width').value = state.imgWidth;
                }

                if (state.imgHeight) {
                    AI.select('#authoring-modal #base-height').value = state.imgHeight;
                }

                AI.select('#authoring-modal #base-bgimg').value = bgImg;

                let img_src = AI.select('img[src="//s3.amazonaws.com/jigyaasa_content_static/' + bgImg + '"]');
                if (img_src.getAttribute) {
                    let alt_text = img_src.getAttribute('alt');
                    if (alt_text) {
                        AI.select('#authoring-modal #base-bgimg-alt').value = alt_text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    } else {
                        AI.select('#authoring-modal #base-bgimg-alt').value = ''
                    }
                    AI.select('#authoring-modal #base-borderrequired').checked = img_src.classList.contains("img-bordered")
                }
                AI.selectAll('#authoring-modal .base', 'show', 'block');
                DND_AUTH.visible_class = '.base';
            }

            break;
        case "jscript":
            AI.select('#authoring-modal .modal-title').innerText = l.insert_script;
            AI.selectAll('#authoring-modal .jscript', 'show', 'block');

            if (AI.selectAll('#authoring-modal .CodeMirror').length == 0) {
                let jscript_timer = setTimeout(function() {
                    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                        lineNumbers: true,
                        matchBrackets: true,
                        continueComments: "Enter",
                        indentWithTabs: true
                    }, 1000);
                    clearTimeout(jscript_timer);
                }, 200);
            }
            DND_AUTH.visible_class = '.jscript';

            break;
        case "choicematrix":
            AI.select('#authoring-modal .modal-title').innerText = l.choice_matrix + ' - ' + labkey;
            AI.selectAll('#authoring-modal .choicematrix', 'show', 'block');
            AI.select('#authoring-modal #choicematrix-id').value = labkey;
            DND_AUTH.visible_class = '.choicematrix';
            break;
    }
    AI.listen('body', 'click', '.addElement', function() {
        DND_AUTH.updateElem(type, _this, key);
    });
    AI.getBS('#authoring-modal', 'Modal').show();
    if (AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' .events a').nodeName) {
        AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' .events a').click()
    }
    if (key) {
        let attributes = [];
        if (type == "base") {
            attributes = DND_AUTH.storage.store('#dndmain', 'attributes');
        } else {
            attributes = DND_AUTH.storage.store('#' + key, 'attributes');
        }

        if (typeof(attributes) == "undefined") {
            attributes = [];
        }
        AI.selectAll('#authoring-modal .tabhead .events a i', 'remove');
        for (let index = 0; index < attributes.length; index++) {
            if (attributes[index]['name'].indexOf('on') === 0 && attributes[index]['value'].trim() != "") {
                AI.insert('#authoring-modal .tabhead .events [for$="' + attributes[index]['name'] + '"]', '<i class="icomoon-checkmark pull-right"></i>', 'beforeend');
            }
            AI.select('#authoring-modal .tabhead .events a i')
            let modal_element = AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]')
            if (modal_element && modal_element.nodeName) {
                if (modal_element.getAttribute('type') == "checkbox" || modal_element.getAttribute('type') == "radio" || modal_element.getAttribute('type') == "choicematrix") {
                    modal_element.checked = false;
                    if (attributes[index]['name'] == "multi_drag") {
                        if (attributes[index]['value'] == 1) {
                            modal_element.checked = true;
                        }
                    } else if (attributes[index]['value'] == 1) {
                        modal_element.checked = true;
                    }
                } else {
                    modal_element.value = DND_AUTH.setValue( attributes[index]['value'] );
                }
            }
        }
    }

    if (type == 'dropdown') {
        let fetched_list_data = DND_AUTH.errorChecking()
        let is_error = fetched_list_data[0] || (fetched_list_data[1] == 0);
        if (is_error) {
            DND_AUTH.error_message = (is_error) ? ((fetched_list_data[0]) ? (l.one_option_correct) : l.one_option_require) : '';
            AI.select('#authoring-modal .errorBtn', 'removeClass', 'h');
            AI.select('#authoring-modal .addElement', 'addClass', 'h');
        }
    }

    let required_fields = AI.selectAll('#authoring-modal ' + DND_AUTH.visible_class + ' .validate');

    for (let index = 0; index < required_fields.length; index ++) {
        if (required_fields[index].value.trim() == '') {
            DND_AUTH.error_message = l.required_field
            AI.select('#authoring-modal .errorBtn', 'removeClass', 'h');
            AI.select('#authoring-modal .addElement', 'addClass', 'h');
            break;
        }
    }
}

// for rounding of the value
DND_AUTH.setValue = function (value) {
    if (isNaN(value) || (typeof (value) == 'string' && value.trim() == '')) {
        return value;
    } else if (value == null || value == undefined) {
        return '';
    } else {
        return Math.round(Number(value));
    }
}

// for select box option checking
DND_AUTH.errorChecking = function() {
    let is_multiple_selected = 0;
    let is_multiple_correct = 0;
    let is_multiple = 0;
    let options = document.getElementById('ddn-value').value.split('\n');
    for (let index = 0; index < options.length; index++) {
        let optionText = options[index].trim();
        if (optionText.indexOf('*') == 0) {
            is_multiple_correct++;
        }
        if (optionText.indexOf('+') == 0) {
            is_multiple_selected++;
        }
    }
    if ((is_multiple_selected > 1) || (is_multiple_correct > 1)) {
        is_multiple = 1;
    }
    return ([is_multiple, is_multiple_correct]);
}

// for deleting the element 
DND_AUTH.deleteElem = function(type, key) {
    swal({
        text: l.delete_txt,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then(function(result) {
        if (result) {
            let old_key = key;
            if (type == 'hotspot_click') {
                key = key.split('_')[0];
            }
            let xmlDom = AI.parseHtml(AI.select('#special_module_xml').value);

            if (AI.find(xmlDom, '[id=' + key + ']')) {
                if (type == 'hotspot_click') {
                    let clkstr = '{';
                    let count = 0;
                    let id = AI.select('[id="' + key + '"]');
                    let hs_item = AI.find(id, '.hs_item:not([id="' + old_key + '"])', 'all');

                    for (let index = 0; index < hs_item.length; index++) {
                        count++;
                        let position = DND_AUTH.position(hs_item[index]);
                        let width = hs_item[index].offsetWidth;
                        let height = hs_item[index].offsetHeight;
                        if (count == hs_item.length) {
                            clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + ']';
                        } else {
                            clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + '],';
                        }
                    }
                    clkstr += '}';
                    AI.find(xmlDom, '[id=' + key + ']').innerText = clkstr;
                } else {
                    AI.find(xmlDom, '[id=' + key + ']').remove();
                }
                AI.select('#special_module_xml').value = xmlDom.outerHTML;
            }
            AI.select('#update_xml').click();
        }
    });
}

// this function is used for getting the serialized data
DND_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                }
            }
        } else {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
}

// this function calls whenever the auth modal ok button is clicked or in other word when a element is updated
DND_AUTH.updateElem = function(type, _this, key, ui) {
    let obj = AI.select('#authoring-modal');
    let attributes_list = AI.find(AI.select('#authoring-modal ' + DND_AUTH.visible_class), 'select, textarea, input', 'all');
    let attributes = DND_AUTH.serialize(attributes_list);
    let k = DND_AUTH.getID(AI.selectAll('[id^=ID]').length);
    let is_update = false, bgimg = "", mainimage = "", attr = [], wd, hd, tp, lt, st, ttl, label_class, border_color, border_size, lbl_bg_color, border_required = 0, parent, htmlparent;

    if (typeof(ui) !== "undefined" && ui) {
        if (DND_AUTH.storage.store('#' + key, 'attributes')) {
            attributes = DND_AUTH.storage.store('#' + key, 'attributes');
        } else {
            let at = [];
            let temp = ["width", "height", "top", "left", "id"];
            for (let x in temp) {
                if (temp[x] == "id") {
                    at.push({
                        "name": "id",
                        "value": key
                    });
                } else {
                    at.push({
                        "name": temp[x],
                        "value": 0
                    });
                }
            }
            DND_AUTH.storage.store('#' + key, 'attributes', at);
            attributes = DND_AUTH.storage.store('#' + key, 'attributes');
        }
        for (let index = 0; index < attributes.length; index++) {
            switch (attributes[index].name) {
                case "width":
                    attributes[index].value = (ui.style.width) ? Number(ui.style.width.replace(/px/g, '')) : ui.offsetWidth;
                    break;
                case "height":
                    attributes[index].value = (ui.style.height) ? Number(ui.style.height.replace(/px/g, '')) : ui.offsetHeight
                    break;
                case "top":
                    attributes[index].value = DND_AUTH.position(ui).top;
                    break;
                case "left":
                    attributes[index].value = DND_AUTH.position(ui).left;
                    break;
            }
        }
    }

    if (type != "jscript") {
        for (let index = 0; index < attributes.length; index++) {
            if (attributes[index].name == "borderrequired") border_required = 8;
            if (attributes[index].name == "width") wd = attributes[index].value;
            if (attributes[index].name == "height") hd = attributes[index].value;
            if (attributes[index].name == "top") tp = attributes[index].value;
            if (attributes[index].name == "left") lt = attributes[index].value;
            if (attributes[index].name == "value") ttl = attributes[index].value;
            if (attributes[index].name == "title") ttl = attributes[index].value;
            if (attributes[index].name == "label_class") label_class = attributes[index].value;
            if (attributes[index].name == "border_color") border_color = attributes[index].value;
            if (attributes[index].name == "border_size") border_size = attributes[index].value;
            if (attributes[index].name == "background_color") lbl_bg_color = attributes[index].value;
            if (attributes[index].name == "style") {
                st = attributes[index].value.split(';');
                if (Array.isArray(st)) {
                    st = st.map((value) => {
                        return value.trim()
                    }).filter(function(n) {
                        return n
                    }).join(';');
                }
            }

            if (attributes[index].name == "bgimg" && attributes[index].value && (attributes[index].value).trim() != "") {
                bgimg = AI.select('#dndmain').getAttribute('path') + (attributes[index].value).trim();
            }
            if (attributes[index].name == "image") {
                mainimage = (attributes[index].value).split(',')[0];
                if (mainimage.trim() != "") mainimage = AI.select('#dndmain').getAttribute('path') + mainimage.trim();
            }
            attr[attributes[index].name] = attributes[index].name;
        }

        let check = "multi_drag,showtarget,display,invisible,nocase,ismultipleanswer,borderrequired".split(',');
        for (let index = 0; index < check.length; index++) {
            if (typeof(attr[check[index]]) == "undefined") {
                attributes.push({
                    "name": check[index],
                    "value": "0"
                });
            }
        }
    }

    if (type != "hotspot_click") {
        parent = AI.select('.parent').getAttribute("data-parent");
        htmlparent = parent == "dndmain" ? "#dndmain" : parent;
        if (type == "step") {
            htmlparent = "#dndmain";
        }
    }

    let where;
    ttl = (ttl) ? ttl : '';
    switch (type) {
        case "drag":
            if (mainimage != "") {
                mainimage = "url(" + mainimage + ")";
            }
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                try {
                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                    let element = AI.select(where);
                    AI.setCss(element, {
                        backgroundImage: mainimage,
                        width: wd + 'px',
                        height: hd + 'px',
                        top: tp + 'px',
                        left: lt + 'px',
                    });

                    AI.find(element, 'p').innerText = ttl;
                } catch (error) {
                    console.warn(error);
                }
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div id="' + key + '" title="' + key + '" class="drag-resize dragable cursor_move unupdated_node" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;border:1px solid #aaccaa;background-color:#CCFFCC;' + st + '"><p>' + ttl + '</p><div class="btn-group tools h" data-t="drag"><a href="javascript:DND_AUTH.elemModal(\'drag\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'drag\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                AI.setCss(AI.select('[id=' + key + ']'), {
                    backgroundImage: mainimage
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "drop":
            if (mainimage != "") {
                mainimage = "url(" + mainimage + ")";
            }
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                try {
                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                    let element = AI.select(where);
                    AI.setCss(element, {
                        backgroundImage: mainimage,
                        width: wd + 'px',
                        height: hd + 'px',
                        top: tp + 'px',
                        left: lt + 'px',
                    });

                    AI.find(element, 'p').innerText = ttl;
                } catch (error) {
                    console.warn(error);
                }
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div id="' + key + '" title="' + key + '" class="drag-resize dropable cursor_move unupdated_node" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;border:1px solid #000000;background-color:#FFFFCC;' + st + '"><p>' + ttl + '</p><div class="btn-group tools h" data-t="drop"><a href="javascript:DND_AUTH.elemModal(\'drop\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'drop\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                AI.setCss(AI.select('[id=' + key + ']'), {
                    backgroundImage: mainimage
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "input":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });

            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="text" class="' + key + ' dnd_textbox elem form-control min_height_0" title="' + key + '" /><div class="btn-group tools h" data-t="input"><a href="javascript:DND_AUTH.elemModal(\'input\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'input\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "multiline":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><textarea class="' + key + ' dnd_textarea elem form-control" title="' + key + '"></textarea><div class="btn-group tools h" data-t="multiline"><a href="javascript:DND_AUTH.elemModal(\'multiline\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'multiline\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "checkbox":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="checkbox" class="' + key + ' dndcheckbox elem" title="' + key + '" /><div class="btn-group tools h" data-t="checkbox"><a href="javascript:DND_AUTH.elemModal(\'checkbox\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'checkbox\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "radio":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="radio" class="' + key + ' dndradio elem" title="' + key + '" /><div class="btn-group tools h" data-t="radio"><a href="javascript:DND_AUTH.elemModal(\'radio\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'radio\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "button":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><button type="button" class="' + key + ' dnd_button elem" title="' + key + '"></button><div class="btn-group tools h" data-t="button"><a href="javascript:DND_AUTH.elemModal(\'button\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'button\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "dropdown":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><select class="' + key + ' dnd_select elem form-control" title="' + key + '"></select><div class="btn-group tools h" data-t="dropdown"><a href="javascript:DND_AUTH.elemModal(\'dropdown\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'dropdown\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "listbox":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><select class="' + key + ' dnd_select elem form-control" title="' + key + '" size="3" multiple="multiple"></select><div class="btn-group tools h" data-t="listbox"><a href="javascript:DND_AUTH.elemModal(\'listbox\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'listbox\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "tabhead":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndtabhead" title="' + key + '" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools h" data-t="tabhead"><a href="javascript:DND_AUTH.elemModal(\'tabhead\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'tabhead\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "img":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><img src="' + bgimg + '" class="' + key + ' dnd_img elem" title="' + key + '" /><div class="btn-group tools h" data-t="img"><a href="javascript:DND_AUTH.elemModal(\'img\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'img\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "label": {
                let border = border_size + 'px solid ' + border_color;
                if (key) {
                    is_update = true;
                    where = '[id="' + key + '"]';

                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                    let element = AI.select(where);
                    AI.setCss(element, {
                        width: wd + 'px',
                        height: hd + 'px',
                        top: tp + 'px',
                        left: lt + 'px',
                        border: border,
                        backgroundColor: lbl_bg_color
                    });

                    AI.find(element, 'p').innerHTML = (ttl) ? DND_AUTH.decodeEnt(ttl) : '';

                    let labelClasses = AI.find(AI.select('select#label_class'), 'option', 'all')
                    for (let index = 1; index < labelClasses.length; index++) {
                        element.classList.remove(labelClasses[index].value);
                    }
                    element.classList.add(label_class);
                } else {
                    where = parent;
                    key = "ID" + k;
                    AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndlabel ' + label_class + '" id="' + key + '" title="' + key + '" style="position:absolute;border:' + border + ';background-color: ' + lbl_bg_color + '; width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><p>' + ((ttl) ? DND_AUTH.decodeEnt(ttl) : '') + '</p><div class="btn-group tools h" data-t="label"><a href="javascript:DND_AUTH.elemModal(\'label\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'label\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                }
            }
            break;
        case "area":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndarea" id="' + key + '" title="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools h" data-t="area"><a href="javascript:DND_AUTH.elemModal(\'area\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'area\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

            }
            break;
        case "menulist":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndarea" id="' + key + '" title="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools h" data-t="menulist"><a href="javascript:DND_AUTH.elemModal(\'menulist\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'menulist\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "hotspot":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="cursor_move unupdated_node drag-resize hotspot_auth" id="' + key + '" title="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div id="' + key + '_1" class="drag-resize hs_item cursor_move unupdated_node"  style="position:absolute;width:100px;height:50px;top:50px;left:50px;"><div class="btn-group tools h" data-t="hotspot_click"><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', this, \'' + key + '_1\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot_click\', \'' + key + '_1\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div><div class="btn-group tools h" data-t="hotspot"><a href="javascript:DND_AUTH.elemModal(\'hotspot\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', \'[id=' + key + ']\');" class="btn btn-light p-sm"><i class="icomoon-plus"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

                DND_AUTH.storage.store('#' + key + '_1', 'attributes', [{
                        "name": "width",
                        "value": "100"
                    },
                    {
                        "name": "height",
                        "value": "50"
                    },
                    {
                        "name": "top",
                        "value": "50"
                    },
                    {
                        "name": "left",
                        "value": "50"
                    },
                    {
                        "name": "id",
                        "value": key + "_1"
                    }
                ]);

            }
            break;
        case "hotspot_click":
            if (key) {
                where = '[id="' + key + '"]';
                is_update = true;
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = '[id="' + AI.select(_this).getAttribute('id') + '"]';
                key = AI.select(_this).getAttribute('id') + '_' + (AI.find(_this, '.hs_item', 'all').length + 1);

                AI.insert(where, '<div id="' + key + '" class="drag-resize hs_item unupdated_node"  style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools" data-t="hotspot_click"><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot_click\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "tab":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                AI.select('[for=' + key + '] a').innerText = AI.find(obj, '#tab-title').value;
                AI.select('[id="' + key + '"]' + '>img').setAttribute("src", bgimg);
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            } else {
                where = parent;
                key = "ID" + k;

                let tbstr = '<li class="unupdated_node" for="' + key + '"><a href="#' + key + '" data-toggle="tab">' + AI.find('#authoring-modal', '#tab-title').value + '</a></li>';
                let cnstr = '<div id="' + key + '" class="tab-pane unupdated_node"><div class="btn-group tools" data-t="tab"><a href="javascript:DND_AUTH.elemModal(\'tab\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div><ul class="nav nav-pills margin-bottom"></ul><div class="tab-content" type="tab" style="position: relative;"></div></div></div>';

                let cls = 'nav-tabs';
                if (AI.select('.parent').getAttribute('type') == "tab") {
                    cls = 'nav-pills';
                }
                let htmlparent_dom = AI.select(htmlparent);
                if (AI.find(htmlparent_dom, ".nav", 'all').length <= 0) {
                    tbstr = '<ul class="nav ' + cls + ' mb-xl">' + tbstr + '</ul>';
                    cnstr = '<div class="tab-content">' + cnstr + '</div>';
                    AI.insert(htmlparent, tbstr + "\n" + cnstr, 'beforeend');
                } else {

                    AI.insert(AI.find(htmlparent_dom, '.' + cls), tbstr, 'beforeend');

                    if (AI.find(htmlparent_dom, '.tab-content .tab-pane', 'all').length == 0) {
                        AI.insert(AI.find(htmlparent_dom, '.tab-content'), cnstr, 'beforeend');
                    } else {
                        let tabpane = AI.find(htmlparent_dom, '.tab-content .tab-pane').parentElement;
                        AI.insert(tabpane, cnstr, 'beforeend');
                    }
                }
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

                if (attributes[3].value == "1") {
                    AI.find(htmlparent_dom, '.' + cls + ' li', {
                        action: 'removeClass',
                        actionData: 'active'
                    });
                    AI.find(htmlparent_dom, '.' + cls + ' li[for=' + key + ']', {
                        action: 'addClass',
                        actionData: 'active'
                    });
                    AI.find(htmlparent_dom, '.tab-content .tab-pane', {
                        action: 'removeClass',
                        actionData: 'active'
                    });
                    AI.find(htmlparent_dom, '[id=' + key + ']', {
                        action: 'addClass',
                        actionData: 'active'
                    });
                }
            }
            break;
        case "step":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';

                AI.select('[id="' + key + '"]' + '>img').setAttribute('src', bgimg);

                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            } else {
                where = parent;
                key = "ID" + k;
                let steps = '#steps';
                if (parent != 'dndmain' && AI.select('.parent').getAttribute('type') != "tab") {
                    key = AI.select(parent).getAttribute('id') + '_' + AI.selectAll(parent + ' >.step').length;
                    steps = '[for=' + AI.select(parent).getAttribute('id') + ']';
                }

                AI.insert(steps, '<label for="' + key + '" class="checkbox inline no-margin no-padding unupdated_node"><input type="radio" id="step_' + key + '" name="rbsAuth" class="dndradio" onclick="javascript:DND_AUTH.setStepAuth(\'' + key + '\');"/> ' + key + '</label>', 'beforeend');

                AI.insert(htmlparent + " div:nth-child(2) div:nth-last-child(2)", '<div id="' + key + '" type="step" class="h step unupdated_node" style="position:relative;"><div class="btn-group tools" data-t="step"><a href="javascript:DND_AUTH.elemModal(\'step\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'step\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div>' + ((bgimg != "") ? '<img src="' + bgimg + '" />' : '') + '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div><ul class="nav nav-tabs margin-bottom"></ul><div class="tab-content" type="tab" style="position: relative;"></div></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

            }
            break;
        case "base":
            if (key) {
                is_update = true;
                where = "dndmain";
                let dom = AI.select('#special_module_xml').value ? AI.parseHtml(AI.select('#special_module_xml').value) : null;
                if (dom && dom.getAttribute && dom.getAttribute('type') && dom.getAttribute('width') && dom.getAttribute('height')) {
                    let module_type = dom ? Number(dom.getAttribute('type')) : 1;
                    let container = document.querySelector("#dndmain img");
                    let originalHeight = ((module_type == 1) ? DND_AUTH.getImageData('h', container) : container.naturalHeight) + border_required;
                    let originalWidth = ((module_type == 1) ? DND_AUTH.getImageData('w', container) : container.naturalWidth) + border_required;

                    wd = (wd < originalWidth) ? originalWidth : wd;
                    hd = (hd < originalHeight) ? originalHeight : hd;
                    let counting = 0;
                    for (let index = 0; index < attributes.length; index++) {
                        switch (attributes[index].name) {
                            case "width":
                                attributes[index].value = wd;
                                counting++;
                                break;
                            case "height":
                                attributes[index].value = hd;
                                counting++;
                                break;
                        }
                        if (counting == 2) {
                            break;
                        }
                    }
                }

                AI.setCss(AI.select('#' + where), {
                    width: wd + 'px',
                    height: hd + 'px',
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "jscript":
            is_update = true;
            where = "jscript";
            DND_AUTH.setfunc(editor.getValue());
            break;
        case "choicematrix":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="radio" class="' + key + ' dndradio elem" title="' + key + '" /><div class="btn-group tools h" data-t="choicematrix"><a href="javascript:DND_AUTH.elemModal(\'choicematrix\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'choicematrix\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
    }

    if (type == "base" || type == "step" || type == "tab") {
        let bgholder = AI.select(htmlparent);
        if (type == "step") {
            bgholder = AI.find(htmlparent, '[id="' + key + '"]');
        }
        if (bgimg != "") {
            if (type == "tab") {
                if (AI.find(bgholder, '[id="' + key + '"] > img', 'all').length > 0) {
                    AI.find(bgholder, '[id="' + key + '"] > img').setAttribute("src", bgimg);
                } else {
                    AI.insert(AI.find(bgholder, '[id="' + key + '"]'), '<img src="' + bgimg + '"/>', 'afterbegin');
                }
            } else {
                if (AI.selectAll('#' + bgholder.getAttribute('id') + '>img').length > 0) {
                    AI.select('#' + bgholder.getAttribute('id') + '>img').setAttribute("src", bgimg);
                } else {
                    AI.insert(bgholder, '<img src="' + bgimg + '"/>', 'afterbegin');
                }
            }
        } else {
            if (AI.selectAll('#' + bgholder.getAttribute('id') + '>img').length > 0) {
                AI.select('#' + bgholder.getAttribute('id') + '>img').remove();
            }
        }
    }
    DND_AUTH.updateXML(type, where, attributes, is_update);
}

// for getting the image height and width
DND_AUTH.getImageData = function(type, element) {
    if (type == 'h') {
        return element.clientHeight > element.naturalHeight ? element.clientHeight : element.naturalHeight;
    } else {
        return element.clientWidth > element.naturalWidth ? element.clientWidth : element.naturalWidth
    }
}

// this function is responsible for updating the xml
DND_AUTH.updateXML = function(type, where, attributes, is_update) {
    let xmlDom = AI.parseHtml(AI.select('#special_module_xml').value);
    let change = true;
    let attr = '',
        val = '',
        tag, insert, hpt;
    if (where == "dndmain") {
        insert = xmlDom;
    } else {
        insert = AI.find(xmlDom, where);
    }
    switch (type) {
        case "input":
            tag = "textbox";
            break;
        case "multiline":
            tag = "multilinebox";
            break;
        case "dropdown":
        case "listbox":
            tag = "select";
            break;
        case "hotspot":
            type = "hotspot_click";
            tag = "hotspot";
            hpt = '[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]';
            break;
        case "hotspot_click":
            change = false;
            if (AI.select('[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]').nodeName && AI.select('[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]').parentElement.getAttribute('id')) {
                hpt = '[id="' + AI.select('[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]').parentElement.getAttribute('id') + '"]';
            } else {
                hpt = '';
            }
            break;
        case "jscript":
            if (AI.find(xmlDom, 'jscript', 'all').length < 1) {
                AI.insert(xmlDom, "<jscript>\n" + editor.getValue() + "\n</jscript>" , 'beforeend')
            } else {
                AI.find(xmlDom, 'jscript').innerHTML = "\n" + editor.getValue() + "\n";
            }
            change = false;
            break;
        case "choicematrix":
            tag = "choicematrix";
            break;
        default:
            tag = type;
    }

    let options_list = ["multi_drag", "showtarget", "display", "invisible", "nocase", "ismultipleanswer", "multiple", "borderrequired"];
    if (change) {
        if (is_update && insert) {
            for (let i = 0; i < attributes.length; i++) {
                if (options_list.includes(attributes[i].name) && attributes[i].value == 0) {
                    if (type == "drag" && attributes[i].name == "multi_drag") {
                        attributes[i].value = "0";
                    } else {
                        attributes[i].value = "";
                    }
                }

                if (attributes[i].value !== "") {
                    if (type == "multiline" && attributes[i].name == "correctans") {
                        let correctans = AI.find(insert, 'correctans', 'all');
                        // have changed the logic previously it was adding multiple correct ans , need to check new logic
                        if (correctans.length > 0) {
                            for (let sub_index = 0; sub_index < correctans.length; sub_index++) {
                                correctans[sub_index].remove();
                            }
                        }
                        AI.insert(insert, '<correctans><![CDATA[' + attributes[i].value + ']]></correctans>', 'beforeend');
                    } else if (type == "multiline" && attributes[i].name == "defaultans") {
                        let defaultans = AI.find(insert, 'defaultans', 'all');
                        // have changed the logic previously it was adding multiple correct ans , need to check new logic
                        if (defaultans.length > 0) {
                            for (let sub_index = 0; sub_index < defaultans.length; sub_index++) {
                                defaultans[sub_index].remove();
                            }
                        }
                        AI.insert(insert, '<defaultans><![CDATA[' + attributes[i].value + ']]></defaultans>', 'beforeend');
                    } else if ((tag == "select" || tag == "menulist") && attributes[i].name == "value") {
                        insert.innerHTML = attributes[i].value;
                    } else if (attributes[i].name == "style") {
                        if (attributes[i].value) {
                            let split_data = attributes[i].value.split(';');
                            if (Array.isArray(split_data)) {
                                split_data = split_data.map((value) => {
                                    return value.trim()
                                }).filter(function(n) {
                                    return n
                                }).join(';');
                            }
                            insert.setAttribute(attributes[i].name, split_data);
                        }
                    } else if (type == "label" && attributes[i].name == "title") {
                        if (attributes[i + 1].name == "richtext") {
                            val += '<![CDATA[' + attributes[i].value + ']]>';
                            insert.removeAttribute(attributes[i].name);
                            insert.innerHTML = val;
                        } else {
                            insert.setAttribute(attributes[i].name, attributes[i].value);
                            insert.innerHTML = '';
                            insert.removeAttribute("richtext");
                        }
                    } else {
                        insert.setAttribute(attributes[i].name, attributes[i].value);
                    }
                } else {
                    if (type == "multiline" && attributes[i].name == "correctans") {
                        let correctans = AI.find(insert, 'correctans', 'all');
                        // have changed the logic previously it was adding multiple correct ans , need to check new logic
                        if (correctans.length > 0) {
                            for (let sub_index = 0; sub_index < correctans.length; sub_index++) {
                                correctans[sub_index].remove();
                            }
                        }
                        AI.insert(insert, '<correctans><![CDATA[' + attributes[i].value + ']]></correctans>', 'beforeend');
                    } else {
                        insert.removeAttribute(attributes[i].name);
                    }
                }
            }
        } else {
            for (let i = 0; i < attributes.length; i++) {
                if (options_list.includes(attributes[i].name) && attributes[i].value == 0) {
                    if (type == "drag" && attributes[i].name == "multi_drag") {
                        attributes[i].value = "0";
                    } else {
                        attributes[i].value = "";
                    }
                }
                if (attributes[i].value != "") {
                    if (type == "multiline" && attributes[i].name == "correctans") {
                        val += '<correctans><![CDATA[' + attributes[i].value + ']]></correctans>';
                    } else if (type == "multiline" && attributes[i].name == "defaultans") {
                        val += '<defaultans><![CDATA[' + attributes[i].value + ']]></defaultans>';
                    } else if ((tag == "select" || tag == "menulist") && attributes[i].name == "value") {
                        val += attributes[i].value;
                    } else if (attributes[i].name == "style") {
                        let split_data = '';
                        if (attributes[i].value) {
                            split_data = attributes[i].value.split(';');
                            if (Array.isArray(split_data)) {
                                split_data = split_data.map((value) => {
                                    return value.trim()
                                }).filter(function(n) {
                                    return n
                                }).join(';');
                            }
                        }
                        attr += attributes[i].name + '="' + split_data + '" ';
                    } else if (type == "label" && attributes[i].name == "title") {
                        if (attributes[i + 1].name == "richtext") {
                            val += '<![CDATA[' + attributes[i].value + ']]>';
                        } else {
                            attributes[i].value = attributes[i].value.replace(/["']/g, "&quot;");
                            attr += attributes[i].name + '="' + attributes[i].value + '" ';
                        }
                    } else {
                        attr += attributes[i].name + '="' + attributes[i].value + '" ';
                    }
                } else if (type == "multiline" && attributes[i].name == "correctans") {
                    val += '<correctans><![CDATA[]]></correctans>';
                }
            }
            AI.insert(insert, '<' + tag + ' ' + attr + '>' + val + '</' + tag + '>', 'beforeend');
        }
    }
    if (type == "hotspot_click" && hpt != '') {
        let clkstr = '{';
        let count = 0;
        let id = AI.select(hpt);
        let hs_item = AI.find(id, '.hs_item', 'all');

        for (let index = 0; index < hs_item.length; index++) {
            count++;
            let position = DND_AUTH.position(hs_item[index]);
            let width = hs_item[index].offsetWidth;
            let height = hs_item[index].offsetHeight;
            if (count == hs_item.length) {
                clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + ']';
            } else {
                clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + '],';
            }
        }
        clkstr += '}';
        if (AI.find(xmlDom, hpt)) {
            AI.find(xmlDom, hpt).innerText = clkstr;
        }


        if (is_update && insert) {
            for (let i = 0; i < attributes.length; i++) {
                if (options_list.includes(attributes[i].name) && attributes[i].value == 0) {
                    attributes[i].value = "";
                }
                if (attributes[i].name == "value") attributes[i].value = "";
                (attributes[i].value !== "") ? insert.setAttribute(attributes[i].name, attributes[i].value): insert.removeAttribute(attributes[i].name);
            }
        }
    }
    AI.select('#special_module_xml').value = xmlDom.outerHTML;
    AI.select('#update_xml').click();
}

// for getting the value of a particular key in an object
DND_AUTH.getObjectValue = function(key, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == key) {
            return arr[i].value;
        }
    }
}

// function responsible for setting the step
DND_AUTH.setStepAuth = function(tabname) {
    let steps = AI.selectAll("#dndmain [type='step']");
    for (let index = 0; index < steps.length; index++) {
        AI.setCss(steps[index], {
            display: 'none'
        })
    }
    if (tabname == "baseAuth") {
        AI.select("#baseAuth").checked = true;
    } else {
        AI.select("#step_" + tabname).checked = true;
        if (tabname.trim() != '') {
            let tab = AI.select("#" + tabname);
            AI.setCss(tab, {
                display: 'block'
            })
            AI.setCss(tab.parentElement, {
                display: 'block'
            })
        }
    }
}

// for getting the ID
DND_AUTH.getID = function(count) {
    if (AI.selectAll('[id="ID' + count + '"]').length < 1) {
        return count;
    }
    count = DND_AUTH.getID(count + 1);
    return count;
}

// for getting first letter as capital
DND_AUTH.capitalize = function(s) {
    return s.toLowerCase().replace(/\b./g, function(a) {
        return a.toUpperCase();
    });
}

// for setting the functions in select which was added in the jscript
// this function is not in used for now but keeping it for the refrence 
DND_AUTH.setfunc = function(functions) {
    let matches = functions.match(/function .+\(/g);
    let eventopt = '<option value="" selected="selected"></option>';
    for (let i = 0; i < matches.length; i++) {
        let func = matches[i].replace("function ", "").replace("(", "").trim();
        eventopt += '<option value="' + func + '">' + DND_AUTH.capitalize(func) + '</option>';
    }
    AI.select('#authoring-modal .event-input select').innerHTML = eventopt;
}

// function used for reseting the attribute of elements in authoring modal
DND_AUTH.resetAttr = function(obj) {
    for (let i = 0; i < obj.length; i++) {
        let field_type = obj[i].type.toLowerCase();
        let attrs = DND_AUTH.setInAssoc(obj[i].attributes, true);
        switch (field_type) {
            case "text":
            case "password":
            case "textarea":
            case "hidden":
                if (typeof attrs['value'] != "undefined") {
                    obj[i].value = attrs['value'].value;
                } else if (typeof attrs['defaultvalue'] != "undefined") {
                    obj[i].value = attrs['defaultvalue'].value;
                } else {
                    obj[i].value = "";
                }
                break;
            case "radio":
            case "choicematrix":
            case "checkbox":
                if (obj[i].id == "base-borderrequired") return;
                if (typeof attrs['checked'] != "undefined") {
                    obj[i].checked = true;
                } else if (obj[i].checked) {
                    obj[i].checked = false;
                }
                break;
            case "select-one":
            case "select-multi":
                {
                    let options = obj[i].options, si = 0;
                    if (options.length > 0) {
                        for (let j = 0; j < options.length; j++) {
                            if (options[j].defaultSelected) {
                                si = j;
                                break;
                            }
                        }
                    }
                    obj[i].selectedIndex = si;
                }
                break;
            default:
                break;
        }
    }
}

// for setting the associated array
DND_AUTH.setInAssoc = function(attrs, all) {
    let ret = {};
    for (let index = 0; index < attrs.length; index++) {
        if (typeof all != "undefined" && all === true) {
            ret[attrs[index].name] = attrs[index];
        } else {
            ret[attrs[index].name] = attrs[index].value;
        }
    }
    return ret;
}

// this create label class option for the select box
DND_AUTH.labelClassOptions = function() {
    let option = [{
            text: l.select_style,
            value: 'null',
            prop: 'disabled selected'
        },
        {
            text: l.heading_arial,
            value: 'heading_arial',
            prop: ''
        },
        {
            text: l.heading_georgia,
            value: 'heading_georgia',
            prop: ''
        },
        {
            text: l.heading_cambria,
            value: 'heading_cambria',
            prop: ''
        },
        {
            text: l.heading_calibri,
            value: 'heading_calibri',
            prop: ''
        },
        {
            text: l.heading_verdana,
            value: 'heading_verdana',
            prop: ''
        },
        {
            text: l.heading_roman,
            value: 'heading_roman',
            prop: ''
        },

        {
            text: l.content_arial,
            value: 'content_arial',
            prop: ''
        },
        {
            text: l.content_georgia,
            value: 'content_georgia',
            prop: ''
        },
        {
            text: l.content_cambria,
            value: 'content_cambria',
            prop: ''
        },
        {
            text: l.content_calibri,
            value: 'content_calibri',
            prop: ''
        },
        {
            text: l.content_verdana,
            value: 'content_verdana',
            prop: ''
        },
        {
            text: l.content_roman,
            value: 'content_roman',
            prop: ''
        }

    ];
    let html = '';
    for (let i = 0; i < option.length; i++) {
        html += "<option value=" + option[i].value + " " + option[i].prop + ">" + option[i].text + "</option>";
    }
    return html;
}

// this create custom class options
DND_AUTH.customClassOptions = function() {
    let option = [{
            text: l.select_class,
            value: '',
            prop: ''
        },
        {
            text: l.sql_terminal,
            value: 'sql_terminal',
            prop: ''
        },
    ];
    let html = '';
    for (let i = 0; i < option.length; i++) {
        html += "<option value=" + option[i].value + " " + option[i].prop + ">" + option[i].text + "</option>";
    }
    return html;
}

// for decoding the entity
DND_AUTH.decodeEnt = function(htmlEnt) {
    return htmlEnt.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

export default DND_AUTH;