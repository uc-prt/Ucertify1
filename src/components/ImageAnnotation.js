/** 
 *  File-name  : ImageAnnotation.js
 *  Created at : 20/02/2021
 *  @author    : Pradeep Yadav <pradeepdv45@gmail.com>
 *  @version   : 2.0
 *  @package   : svelte
 *  @detail    : All image annotation function
 *  Last updated by : Pradeep Yadav <pradeep.yadav@ucertify.com>
 *  Last updated : 11/05/2021
 */

/**
 * this the function for image annotation which contain all the functions and functionality 
 * this min file is called by including the media.js file and passing image_annotation value to 1
 * in the default configuration. 
 */
import JUI, {Draggable} from 'javscript_helper/JUI.js';
import swal from 'sweetalert';
import l from '../libs/editorLib/language';
const JS = new JUI();
export default class ImageAnnotation {
    constructor(options) {
        this.MEDIA_URL = '//s3.amazonaws.com/jigyaasa_content_static/';
        this.marker_icon = ['', 'icomoon-plus', 'icomoon-checkmark-3', 'icomoon-close', 'icomoon-earth', 'icomoon-notification', 'icomoon-radio-checked2', 'icomoon-minus'];
        this.marker_name = ['Number Marker', 'Plus Marker', 'Checkmark Marker', 'Cross Marker', 'Earth Marker', 'Notification Marker', 'Radio Marker', 'Minus Marker']

        this.annotate = {
            selector: '#authoringDiv .an_svg',
            auth_parent_selector: '#authoringDiv .an_p',
            mark_delete_selector: '#authoringDiv .an_num_p',
            description_selector: 'div[img-anno-desc="d"]',
        }
        this.modal_modal_open = 0;
        this.modalDetails = this.getModalDetails();
        this.init();
    }
    // check the current state variable
    currentState () {
        if (window.annotate != undefined) {
            this.annotate = window.annotate;
        }
        let state = {
            selector: this.annotate.selector,
            auth_parent_selector: this.annotate.auth_parent_selector,
            mark_delete_selector: this.annotate.mark_delete_selector,
            description_selector: this.annotate.description_selector,
            uc_annotation_container: '.an_c',
            uc_preview_container: '#preview div[sub_type="image-annotation"][h_over="1"] .an_c',
            uc_previewnum_container: '#preview div[sub_type="image-annotation"][h_over="1"] .an_num_p',
            uc_annotate_resize: 'an_num_p',
            uc_annotate_marker: '.an_num_p',
            desc_pre_block: 'an_d',
            annotate_number: 'an_num',
            list_container: 'an_li',
            setting: 'an_s', // if changing then change in modalDetails too
            parent_selector: '.an_p',
            figcaption: '.an_f',
            radius: 14,
            circle_color: '#e84848',
            cur_parent: '',
        }
        return state;
    }

    // initialte the image annotation library
    init () {
        console.log('Image Annotate plugin added!');
        this.state = this.currentState();
        this.bindUpEvent();
    }

    // contains the modal html which is appended in body once the library is initialized
    getModalDetails() {
        return({
            image_details: {
                'html': `<div class="modal" id="annotate_image_details">
                    <div class="modal-dialog modal-dialog-centered modal-xl overflow-hide">
                        <div class="modal-content min_height_500 shadow border border-dark">
                            <div class="modal-header">
                                <h4 class="modal-title">${l.edit_image}</h4>
                                <button type="button" class="close" data-bs-dismiss="modal" title="${l.close}" aria-label="${l.close}"><span aria-hidden="true">×</span></button>
                            </div>
                            <div class="modal-body">
                                <div class="annotate_information_container">
                                    <div class="clearfix">
                                        <div class="col-12 float-left">
                                            <div class="form-group pl-0 row anootate_error_msg text-b-red h"><div class="col-12 msg"></div></div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_source_image" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0"><span class="mendatory_label float-left">Source</span></label>
                                                <div class="col-9 col-md-6 col-sm-10 pr-2">
                                                    <input type="text" name="annotate_source_image" id="annotate_source_image" annotate_field="1" class="form-control form-control-sm" title="${l.image_url}" placeholder="${l.image_url}" value="" disabled="disabled">
                                                </div>
                                                <div class="col-3 col-sm-2 pl-0 col-md-3">
                                                    <button type="button" name="annotate_upload_image" id="annotate_upload_image" title="${l.browse}" class="btn btn-primary btn-sm col-12">${l.browse}</button>
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_image_alt" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0"><span class="mendatory_label float-left">${l.image_alt}</span></label>
                                                <div class="col-md-9">
                                                    <textarea name="annotate_image_alt" id="annotate_image_alt" annotate_field="1" class="form-control form-control-sm relative index1 min_height_38 max_height_200" title="${l.image_alt}" placeholder="${l.image_alt}" rows="1"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_image_caption" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0"><span class="mendatory_label float-left">${l.image_caption}</span></label>
                                                <div class="col-md-9">
                                                    <textarea name="annotate_image_caption" id="annotate_image_caption" annotate_field="1" class="form-control form-control-sm relative index1 min_height_38 max_height_200" title="${l.image_caption}" placeholder="${l.image_caption}" rows="1"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_image_width" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0"><span class="mendatory_label float-left">${l.image_width}</span></label>
                                                <div class="col-md-9">
                                                    <input type="number" min="400" max="600" step="20" annotate_field="1" name="annotate_image_width" id="annotate_image_width" class="num form-control form-control-sm" title="${l.image_width}" placeholder="${l.image_width}" value="">
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_image_color" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0">${l.marker_color}</label>
                                                <div class="col-md-9">
                                                    <select name="annotate_image_color" title="${l.marker_color}" id="annotate_image_color" class="form-control form-control-sm">
                                                        <option value="0">${l.red_color}</option>
                                                        <option value="1">${l.blue_color}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_image_align" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0">${l.text_align}</label>
                                                <div class="col-md-9">
                                                    <select name="annotate_image_align" title="${l.text_align}" id="annotate_image_align" class="form-control form-control-sm">
                                                        <option value="0">${l.right}</option>
                                                        <option value="1">${l.bottom}</option>
                                                        <option value="2">${l.on_click}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row">
                                                <label for="annotate_symbol" class="col-md-3 control-label col-form-label form-control-label text-left font-weight-normal mb-0">${l.mark_symbol}</label>
                                                <div class="col-md-9">
                                                    <select name="annotate_symbol" id="annotate_symbol" title="${l.mark_symbol}" class="form-control form-control-sm">
                                                        <option value="0">${l.number_marker}</option>
                                                        <option value="1">${l.plus_marker}</option>
                                                        <option value="2">${l.checkmark_marker}</option>
                                                        <option value="3">${l.cross_marker}</option>
                                                        <option value="4">${l.earth_marker}</option>
                                                        <option value="5">${l.notification_marker}</option>
                                                        <option value="6">${l.radio_marker}</option>
                                                        <option value="7">${l.minus_marker}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group pl-0 row mb-0">
                                                <div class="col-6 pr-0">
                                                    <input type="checkbox" name="annotate_border" id="annotate_border" title="${l.border}" class="checkbox-inline margin-top-2">
                                                    <label for="annotate_border" class="col-form-label control-label font-weight-normal form-control-label mb-0 ml-1 text-left">${l.border}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-light btn-md annotate_image_cancel" data-bs-dismiss="modal" title="${l.cancel}" aria-label="${l.cancel}" tabindex="0" type="button">${l.cancel}</button>
                                <button class="btn btn-light btn-md annotate_image_reset" title="${l.reset}" aria-label="${l.reset}" tabindex="0" type="button">${l.reset}</button>
                                <button class="btn btn-primary btn-md annotate_image_submit" title="${l.submit}" aria-label="${l.submit}" tabindex="0" type="button">${l.submit}</button>
                            </div>
                        </div>
                    </div>
                </div>`
            },
            node_html: `<div class="btn-group position-absolute annotate_mark_tools h" style="top: -26px;z-index: 117;left: 24px;width: 48px;float: right;"><button type="button" class="btn btn-light p-sm float-left deletePoints" title="${l.delete_points}"><i class="icomoon-delete-sm"></i></button><button type="button" class="btn btn-light copyPoints float-left p-sm" title="${l.copy}"><i class="icomoon-copy"></i></button></div>`,
            node_setting: `<div class='an_s h' style='z-index:9;'><div><button class="btn btn-light p-0 pointer rounded-0 annotation_edit" title="${l.setting}" style="width: 22px;"><i class="icomoon-24px-settings-1"></i></button></div></div>`,
        });
    }

    // for setting the mouse current coordinates
    setMouseCoordinates (event, current_selector) {
        // contains the size of element having id 'authoringSvg' and its position relative to the viewport
        let boundary = current_selector.getBoundingClientRect();
        // sets the x position of the mouse co-ordinate
        let x_pos = event.clientX - boundary.left;
        // sets the y position of the mouse co-ordinate
        let y_pos = event.clientY - boundary.top;

        return {
            x: x_pos,
            y: y_pos
        };
    }

    // for creatinng the mark points
    createNode (number, position, type, icon) {
        var html = `<div class="${this.state.uc_annotate_resize}" style="left: ${position.x - this.state.radius}px; top: ${position.y - this.state.radius}px;">${(type == 0) ? `<span num="${number}" class="${this.state.annotate_number}">${number}</span>`: `<span d-m="${type}" class="${this.state.annotate_number} ${icon} s_m"></span>`}</div>`;
        return html;
    }

    // for allowing the draggable for the mark points
    allowDraggable (object) {
        if (this.dnd ) return false;
        let dragConfig = {
            // Z-index for the helper while being dragged.
            zIndex: 1,
            // Constrains dragging to within the bounds of the specified element or region
            containment: 'parent',
            // the element will snap to all other draggable elements
            snap: true,
            // The distance in pixels from the snap element edges at which snapping should occur
            snapTolerance: 5,
            // Triggered while the mouse is moved during the dragging, immediately before the current move happens
            onDrag: (e, ui)=> {
                // for custom containment
                let image_element = JS.find(JS.parent(e.target), 'img');
                let extra_height = (image_element.classList.contains('img-bordered')) ? 8 : 0;
                if (ui.position.top >= (Number(image_element.clientHeight + extra_height) - 2 * this.state.radius)) {
                    ui.position.top = (Number(image_element.clientHeight + extra_height) - 2 * this.state.radius)
                }
                if (ui.position.left >= (Number(image_element.clientWidth + extra_height) - 2 * this.state.radius)) {
                    ui.position.left = (Number(image_element.clientWidth + extra_height) - 2 * this.state.radius)
                }
                JS.find(JS.parent(this.state.uc_annotation_container), '.' + this.state.list_container, {action: 'attr', actionData: {x: ui.style.top}});
            },
        };
        this.dnd = new Draggable(dragConfig);
    }

    // for restoring the points i.e., it make sure the mark no is in proper order
    restorePoints (annotate_element, annotate_number, desc_selector, from_delete = 0) {
        let length = 0;
        if (annotate_number.length != 0) {
            let total_markers = []
            annotate_number.forEach((_this)=> {
                if (!_this.classList.contains('s_m')) {
                    total_markers.push(_this.textContent);
                }
            });

            if (total_markers.length != 0) {
                total_markers = total_markers.reduce((acc, curr)=> {
                    if (typeof acc[curr] == 'undefined') {
                        acc[curr] = 1;
                    } else {
                        acc[curr] += 1;
                    }
                    return acc;
                }, {})
                let total_marker_keys = Number(Object.keys(total_markers)[Object.keys(total_markers).length - 1]);
                for (let index = 1; index < total_marker_keys; index++) {
                    if (JS.find(annotate_element, '[num="' + index + '"]', 'all').length == 0) {
                        JS.find(annotate_element, '[num="' + (index + 1) + '"]', {action: 'text', actionData: index});
                        JS.find(annotate_element, '[num="' + (index + 1) + '"]', {action: 'attr', actionData: {num: index}});
                    }
                    if (JS.find(desc_selector, '[num="' + index + '"]', 'all').length == 0) {
                        JS.find(desc_selector, '[num="' + (index + 1) + '"]', {action: 'text', actionData: index});
                        JS.find(desc_selector, '[num="' + (index + 1) + '"]', {action: 'attr', actionData: {num: index}});
                    }
                }
                length = total_marker_keys - from_delete;
            }
        }
        annotate_element.setAttribute('d-n', length);
    }

    // for repositioning the points when width or image changed
    reallocatePoints (current_object, data) {
        let extra_padding = JS.find(current_object, 'img').classList.contains('img-bordered') ? 8 : 0;
        let cur_width = JS.find(current_object, 'img').clientWidth + extra_padding;
        let cur_height = JS.find(current_object, 'img').clientHeight + extra_padding;
        let annotate_markers = JS.find(current_object, '.an_num_p', 'all');
        let percentage_width = ((cur_width - Number(data.width)) / cur_width) * 100;
        let percentage_height = ((cur_height - Number(data.height)) / cur_height) * 100;
        annotate_markers.forEach((_this)=> {
            let left = parseInt(_this.style.left);
            let top = parseInt(_this.style.top);
            left += (percentage_width / 100) * left;
            top += (percentage_height / 100) * top;
            JS.select(_this, 'css', {
                top: `${top}px`,
                left: `${left}px`
            });
        });
    }

    // bindup the events which is neccessary for imageAnnotation to work
    bindUpEvent () {
        let current_object;
        // appending the modal in body
        JS.insert('body', this.modalDetails.image_details.html, 'beforeend');
        
        JS.listen("body", 'shown.bs.modal', '#annotate_image_details', ()=> {
            JS.selectAll('.anootate_error_msg', 'addClass', 'h');
            JS.selectAll('[annotate_field="1"]', 'removeClass', 'border-danger');
            var focus_timer = setTimeout(()=> {
                JS.select('#annotate_upload_image').focus();
                clearTimeout(focus_timer);
            } ,100);
        });
        // for event on the main selector
        JS.listen('body', 'click', this.state.selector, (_this, event)=> {
            this.state.curdata = this.getData(JS.parent(_this));
            let position = this.setMouseCoordinates(event, _this);
            let number, marker_index, from_copied = 1;

            // in case of copy
            if (_this.closest(this.state.auth_parent_selector).dataset['c'] == 1) {
                number = _this.closest(this.state.auth_parent_selector).dataset['n'];
                from_copied = 0;
                marker_index = _this.closest(this.state.auth_parent_selector).dataset['m'];
                JS.setData(_this.closest(this.state.auth_parent_selector), {
                    'c': 0,
                    'n': '',
                    'm': '',
                });
            } else {
                if (this.state.curdata.marker == "0") {
                    number = Number(_this.closest(this.state.uc_annotation_container).getAttribute('d-n')) + 1;
                    _this.closest(this.state.uc_annotation_container).setAttribute('d-n', number);
                }
                marker_index = Number(this.state.curdata.marker);
            }

            /** This code is for adding list by default  - worked in case of right view**/
            let selector = JS.find(_this.closest(this.state.uc_annotation_container).parentElement, this.state.description_selector);
            if (JS.find(selector, '.' + this.state.desc_pre_block, 'all').length == 0) {
                JS.select(_this.closest(this.state.uc_annotation_container).parentElement, 'removeClass', 'd-flex');
                if (this.state.curdata.view == "0") {
                    _this.closest(this.state.uc_annotation_container).setAttribute('hv', 1);
                    selector.innerHTML = (`<div class="pre-block ${this.state.desc_pre_block} ${this.state.curdata.color == "1" ? 'bl' : 'rl'}" style='overflow:scroll;height:auto;min-height:${JS.find(_this.parentElement, 'img').clientHeight + (JS.find(_this.parentElement, 'img').classList.contains('img-bordered') ? 8 : 0)}px;margin-bottom:${_this.parentElement.outerHeight(true) - (JS.find(_this.parentElement, 'img').clientHeight + (JS.find(_this.parentElement, 'img').classList.contains('img-bordered') ? 8 : 0))}px'><div class="${this.state.list_container}"><div class="an_divp" d-m="${marker_index}">${marker_index == 0 ? `<div class="an_div" num="${number}">${number}</div>` : `<div class="an_div ${this.marker_icon[marker_index]}"></div>`}<div a_c='1'><b>Heading</b>: Sample Text</div></div></div></div>`);
                } else {
                    selector.innerHTML = (`<br><div class="pre-block ${this.state.desc_pre_block} ${this.state.curdata.color == "1" ? 'bl' : 'rl'}"><div class="${this.state.list_container}"><div class="an_divp" d-m="${marker_index}">${marker_index == 0 ? `<div class="an_div" num="${number}">${number}</div>` : `<div class="an_div ${this.marker_icon[marker_index]}"></div>`}<div a_c='1'><b>Heading</b>: Sample Text</div></div></div></div>`);
                }
            } else {
                if ((marker_index == 0 && from_copied == 1) || (marker_index != 0 && JS.find(selector, '.an_div.' + this.marker_icon[marker_index], 'all').length == 0)) {
                    JS.insert(JS.find(selector, '.' + this.state.list_container, 'all')[0], `<div class="an_divp" d-m="${marker_index}">${marker_index == 0 ? `<div class="an_div" num="${number}">${number}</div>` : `<div class="an_div ${marker_icon[marker_index]}"></div>`}<div a_c='1'><b>Heading</b>: Sample Text</div></div>`, 'beforeend');
                }
            }

            /** End of code : adding list by default**/
            JS.insert(_this.parentElement, this.createNode(number, position, marker_index, this.marker_icon[marker_index]), 'beforeend');
            JS.find(JS.parent(this.state.uc_annotation_container), '.' + this.state.list_container, 'all', {action: 'attr', actionData: {x:  Math.floor(Math.random() * 1000) } });
            this.setHover(_this.parentElement);
        });

        // To show preview click
        JS.listen('body', 'click', this.state.uc_previewnum_container , (_this)=> {
            window.tp = _this.parentElement;
            if (JS.find(_this.parentElement, _this.getAttribute('data-id'))?.classList.contains('imageannotation_display_block')) {
                JS.find(_this.parentElement, _this.getAttribute('data-id'), {action: 'removeClass', actionData: 'imageannotation_display_block'})
                JS.select(_this, 'removeClass', 'focus');
            } else {
                JS.find(_this.parentElement, '.imageannotation_popup_div', {action: 'removeClass', actionData: 'imageannotation_display_block'});
                JS.find(_this.parentElement, this.state.uc_annotate_marker, {action: 'removeClass', actionData: 'focus'});
                JS.find(_this.parentElement, _this.getAttribute('data-id'), {actiond: 'addClass', actionData: 'imageannotation_display_block'});
                JS.select(_this, 'addClass', 'focus');
            }
        });

        // mouseover event on the mark points
        JS.listen('body', 'mouseover', this.state.mark_delete_selector, (_this)=> {
           //this.allowDraggable(_this);
        });

        JS.listen('body', 'keyup', this.state.description_selector, (_this, event)=> {
            this.state.curdata = this.getData(JS.find(_this.parentElement, this.state.parent_selector));
            this.setHover(JS.find(_this.parentElement, this.state.parent_selector), event.keyCode);
            this.listSetup(_this, Number(JS.find(_this.parentElement, this.state.uc_annotation_container).getAttribute('d-n')), event.keyCode);
        });

        window.onscroll = ()=> {
            if (JS.selectAll('.annotate_mark_tools').length > 0 && this.state.cur_parent == '') {
                JS.selectAll('.annotate_mark_tools', 'remove');
            }
            if (JS.selectAll('.' + this.state.setting).length > 0) {
                JS.selectAll('.' + this.state.setting, 'remove');
            }
        };
        // used to fill the data in annotate information dialog and open it
        JS.listen('body', 'click', '.annotation_edit', (_this)=> {
            current_object = _this.closest(this.state.auth_parent_selector);
            this.state.curdata = this.getData(_this.closest(this.state.auth_parent_selector));
            this.state.curdata.height = JS.find(current_object, 'img').clientHeight + (JS.find(current_object, 'img').classList.contains('img-bordered') ? 8 : 0);
            let currrent_figure = JS.find(current_object, '.uc-figure');
            JS.select('#annotate_source_image', 'value', JS.findChild(currrent_figure, 'img').getAttribute('src').split(this.MEDIA_URL)[1]);
            JS.select('#annotate_image_alt', 'value', JS.findChild(currrent_figure, 'img').getAttribute('alt'));
            JS.select('#annotate_image_caption', 'value', JS.findChild(currrent_figure, 'figcaption').textContent);
            JS.select('#annotate_image_width', 'value', this.state.curdata.width);
            JS.select('#annotate_image_color', 'value', this.state.curdata.color);
            JS.select('#annotate_border').checked = ((JS.findChild(currrent_figure, 'img').classList.contains('img-bordered')) ? true : false);
            JS.select('#annotate_image_align', 'value', this.state.curdata.view)
            JS.select('#annotate_symbol', 'value', this.state.curdata.marker);
            JS.getBS('#annotate_image_details', 'Modal').show();
        });

        // calls in case of verification
        JS.listen('body', 'keyup', '[annotate_field="1"]', (_elm)=> {
            JS.selectAll('[annotate_field="1"]').forEach((_this)=> {
                if (_this.value.trim() == '' || (_this.classList.contains('num') && !(!isNaN(_this.value) && (Number(_this.value) >= 400 && Number(_this.value) <= 600)))) {
                    _this.classList.add('border-danger');
                    JS.selectAll('.anootate_error_msg', 'removeClass', 'h');
                    JS.selectAll('.anootate_error_msg .msg', 'text', l.image_err);
                } else {
                    _this.classList.remove('border-danger');
                    JS.selectAll('.anootate_error_msg', 'addClass', 'h');
                }
            });
        });

        // calls when annotate information submit btn is clicked
        JS.listen('body', 'click', '.annotate_image_submit', (_elm)=> {
            let is_error = 0;
            let msg = '';
            JS.selectAll('[annotate_field="1"]').forEach((_this)=> {
                if (_this.classList.contains('num') && !(!isNaN(_this.value) && (Number(_this.value) >= 400 && Number(_this.value) <= 600))) {
                    is_error = 1;
                    msg += l.image_width_range;
                    JS.select(_this, 'addClass', 'border-danger');
                } else if (_this.value.trim() == '') {
                    is_error = 1;
                    msg = l.fill_required_field;
                    _this.classList.add('border-danger');
                }
            });
            if (is_error == 0) {
                JS.selectAll('.anootate_error_msg', 'addClass', 'h');
                JS.selectAll('[annotate_field="1"]', 'removeClass', 'border-danger');
                let desc_selector = JS.find(current_object.closest(this.state.uc_annotation_container).parentElement, this.state.description_selector);
                JS.find(current_object, this.state.figcaption, {action: 'text', actionData: JS.select('#annotate_image_caption').value});
                let _backImg = JS.find(current_object, 'img');
                _backImg.onload = ()=> {
                    let extra_height = (JS.select('#annotate_border').checked) ? 8 : 0;
                    JS.find(current_object, 'svg', {action: 'attr', actionData: {height: _backImg.clientHeight + extra_height} });
                    if (Number(this.state.curdata.width) != JS.select('#annotate_image_width').value || (this.state.curdata.img != JS.select('#annotate_source_image').value)) {
                        swal({
                            title: l.change_image,
                            type: "warning",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            confirmButtonText: l.reposition,
                            cancelButtonText: l.reset
                        }).then((result)=> {
                            if (result) {
                                this.reallocatePoints(current_object, this.state.curdata);
                            } else {
                                JS.find(current_object, '.' + this.state.uc_annotate_resize, {action: 'remove'});
                                current_object.closest(this.state.uc_annotation_container).setAttribute('d-n', '0');
                                JS.select(current_object.closest(this.state.uc_annotation_container), 'css', {width: JS.select('#annotate_image_width').value + 'px;'});
                                desc_selector.innerHTML = '';
                                if (JS.select('#annotate_image_align').value == "0") {
                                    current_object.closest(this.state.uc_annotation_container).removeAttribute('hv');
                                }
                            }
                            JS.getBS('#annotate_image_details', 'Modal').hide();
                            //swal.close();
                        });
                    } else {
                        JS.getBS('#annotate_image_details', 'Modal').hide();
                    }
                }
                _backImg.onerror = ()=> {
                    JS.getBS('#annotate_image_details', 'Modal').hide();
                }
                JS.select(_backImg, 'attr', {
                    "src": this.MEDIA_URL + JS.select('#annotate_source_image').value,
                    "data-mce-src": this.MEDIA_URL + JS.select('#annotate_source_image').value,
                    "alt": JS.select('#annotate_image_alt').value,
                    "width": JS.select('#annotate_image_width').value,
                    "class": JS.select('#annotate_border').checked ? "img-bordered" : '',
                });
                JS.select(current_object, 'attr', {
                    "d-i": JS.select('#annotate_source_image').value,
                    "d-w": JS.select('#annotate_image_width').value,
                    "d-c": JS.select('#annotate_image_color').value,
                    "d-v": JS.select('#annotate_image_align').value,
                    "d-m": JS.select('#annotate_symbol').value,
                });
                current_object.closest('[sub_type="image-annotation"]').removeAttribute('h_over');
                switch (Number(JS.select('#annotate_image_align').value)) {
                    case 0:
                        JS.select(JS.parent(current_object),'css', {width: JS.select('#annotate_image_width').value + "px"});
                        current_object.closest(this.state.uc_annotation_container).setAttribute('hv', 1);
                        let height = JS.find(current_object, 'img').clientHeight + (JS.find(current_object.parentElement, 'img').classList.contains('img-bordered') ? 8 : 0);
                        JS.find(current_object.closest(this.state.uc_annotation_container).parentElement, '.' + this.state.desc_pre_block, {action: 'css', actionData: {
                            overflow: 'scroll',
                            minHeight: height + 'px',
                            height: 'auto',
                            marginBottom: (current_object.clientHeight - height) + 'px'
                        } })[0].removeAttribute('data-mce-style');
                        JS.find(desc_selector, 'br', 'all')[0]?.remove();
                        if (desc_selector.innerHTML == '') {
                            current_object.closest(this.state.uc_annotation_container).removeAttribute('hv');
                        }
                        break;
                    case 1:
                    case 2:
                        JS.select(current_object.closest(this.state.uc_annotation_container), 'removeAttr', 'hv');
                        JS.select(current_object.parentElement, 'css', {width: JS.select('#annotate_image_width').value + "px"});
                        JS.find(current_object.closest(this.state.uc_annotation_container).parentElement, '.' + this.state.desc_pre_block, {action: 'removeAttr', actionData: 'style data-mce-style'});
                        if (JS.find(desc_selector, 'br', 'all')[0]?.length == 0) {
                            desc_selector.prepend('<br>');
                        }
                        if (JS.select('#annotate_image_align').value == "2") {
                            this.setHover(current_object);
                        }
                        current_object.closest('[sub_type="image-annotation"]').setAttribute('h_over', 1);
                        break;
                }

                JS.find(current_object.closest(this.state.uc_annotation_container).parentElement, '.' + this.state.desc_pre_block, {action: JS.select('#annotate_image_color').value == "1" ? 'addClass' : 'removeClass', actionData: 'bl'});
            } else {
                JS.selectAll('.anootate_error_msg', 'removeClass', 'h');
                JS.selectAll('.anootate_error_msg .msg', 'text', l.image_err);
                JS.showmsg(msg);
            }
            JS.find(current_object.closest(this.state.uc_annotation_container).parentElement, '.' + this.state.list_container, {action: 'attr', actionData: {x: Math.floor(Math.random() * 1000)} });
            JS.trigger(current_object.closest(this.state.uc_annotation_container), 'click');
        });

        // for initializing the media uplaod
        JS.listen('body', 'click', '#annotate_upload_image', ()=> {
            if (typeof(media) != undefined) {
                this.modal_modal_open = 1;
                //JS.getBS('#annotate_image_details', 'Modal').hide();
                setImage('annotate_source_image');
            }
        });

        // called on closing the media modal and if previosly annotation information is visible then to show it again
        JS.listen("body", "hidden.bs.modal", '#modal-media-upload', ()=> {
            console.log("modal hide");
            if (this.modal_modal_open == 1) {
                this.modal_modal_open = 0;
                JS.getBS('#annotate_image_details', 'Modal').show();
                var focus_timer = setTimeout(()=> {
                    JS.select('#annotate_upload_image').focus();
                    clearTimeout(focus_timer);
                } ,100);
            } else {
                JS.activate(0);
            }
        });

        // for the copy of markers
        JS.listen('body', 'click', '.copyPoints', (_this)=> {
            let current_number = _this.closest(this.state.mark_delete_selector).querySelector('.' + this.state.annotate_number);
            let current_marker = 0;
            if (current_number.textContent == '') {
                current_marker = Number(current_number.getAttribute('d-m'));
            }
            JS.setData(_this.closest(this.state.auth_parent_selector), {
                'c': 1,
                'n': current_number.textContent,
                'm': current_marker,
            });
            swal({
                title: ((current_marker != 0) ? this.marker_name[current_marker] : l.point + " " + current_number.textContent) + l.copid_paste,
                type: "success",
            });
        });

        JS.listen('body', 'click', '.annotate_image_reset', (_this)=> {
            swal({
                title: l.reset_data,
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: l.yes_label,
                cancelButtonText: l.no_label
            }).then((result)=> {
                if (result) {
                    JS.select('#annotate_image_alt', 'value', l.image_alt_text);
                    JS.select('#annotate_image_caption','value', l.image_caption);
                    JS.select('#annotate_image_color','value', 0);
                    JS.select('#annotate_border').checked = true;
                    JS.select('#annotate_image_align','value', 1);
                    JS.select('#annotate_symbol','value', 0);
                    JS.select('[annotate_field="1"]', 'value', "world_000OVa.png");
                }
                //swal.close();
            });
        });

        // call when delete btn is pressed
        JS.listen('body', 'click', '.deletePoints', (_this)=> {
            this.state.cur_parent = _this.closest(this.state.mark_delete_selector);
            let cur_number = JS.find(this.state.cur_parent, '.' + this.state.annotate_number);
            let cur_element = '',
                cur_mode = 0;
            if (cur_number.textContent == '') {
                cur_element = 'span[d-m="' + cur_number.getAttribute('d-m') + '"]';
                cur_mode = cur_number.getAttribute('d-m');
            } else {
                cur_element = 'span[num="' + cur_number.textContent + '"]';
            }
            // Need to change it as we don't have link all the content
            if (JS.find(_this.closest(this.state.uc_annotation_container), cur_element, 'all').length > 1) {
                this.deletePoints(0, cur_number, cur_mode);
            } else {
                swal({
                    title: l.delete_confirmation,
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: l.yes_label,
                    cancelButtonText: l.no_label
                }).then((result)=> {
                    if (result) {
                        this.deletePoints(1, cur_number, cur_mode);
                    }
                });
            }
        });
    }

    //Bind multievents
    bindMulti() {
        /*
         * Mouse over and mouse leave event on the parent selector for showing and hiding the setting btn
         */
        JS.listenAll(this.state.auth_parent_selector, 'mouseenter', (event)=> {
            let _this = event.target;
            console.log(_this);
            JS.find(_this.closest(this.state.uc_annotation_container).parentElement, this.state.description_selector).focus();
            JS.selectAll('div[sub_type="image-annotation"] .an_c, #authoringDiv div[sub_type="image-annotation"] .an_c *', 'removeAttr', 'data-mce-style');
            this.state.curdata = this.getData(_this);
            if (_this.querySelectorAll('.' + this.state.setting).length == 0) {
                JS.insert(_this, this.modalDetails.node_setting, 'beforeend');
            }
            if (_this.querySelectorAll('svg').length == 0) {
                JS.insert(_this, `<svg class="an_svg h" width="100%" height="${JS.find(_this, 'img').clientHeight + (JS.find(_this.parentElement, 'img').classList.contains('img-bordered') ? 8 : 0)}"></svg>`, 'beforeend');
            }
            this.restorePoints(_this.closest(this.state.uc_annotation_container), JS.find(_this, '.' + this.state.annotate_number, 'all'), JS.find(_this.closest(this.state.uc_annotation_container).parentElement, this.state.description_selector));
            this.listSetup(JS.find(_this.closest(this.state.uc_annotation_container).parentElement, this.state.description_selector), Number(_this.closest(this.state.uc_annotation_container).getAttribute('d-n')));
        });

        JS.listenAll(this.state.auth_parent_selector, 'mouseleave', (event)=> {
            let _this = event.target;
            JS.trigger(_this, 'click');
            JS.find(_this, `.annotate_mark_tools,.${this.state.setting}`, {action: 'remove'});
        });

        JS.listenAll(this.state.mark_delete_selector, 'mouseenter', (event)=> {
            let _this = event.target;
            // used to shows the delete icon when mouseenter inside added point area
            if (JS.find(_this, '.annotate_mark_tools', 'all').length == 0) {
                JS.insert(_this, this.modalDetails.node_html, 'beforeend');
            }
            JS.find(_this, '.annotate_mark_tools', {action: 'show', actionData: 'inline-flex'});
            _this.style.zIndex = '11';
        })
        JS.listenAll(this.state.mark_delete_selector,'mouseleave', (event)=> {
            let _this = event.target;
            // used to hides the delete icon when mouseenter inside added point area
            //_this.find('>.annotate_mark_tools').fadeOut('fast');
            JS.find(_this, '.annotate_mark_tools', {action: 'hide'});
            _this.style.zIndex = '10';
        });
    }

    // call in case of onclick functionality
    setHover (current_object, key) {
        let key_list = [37, 38, 39, 40];
        if (!JS.findInArray(key, key_list)) {
            return;
        }
        let markers = JS.find(current_object, '.an_num_p', 'all');
        let desc_selector = JS.find(JS.parent(current_object.parentElement), this.state.description_selector);
        let hover_array = [];
        markers.forEach((_this, index)=> {
            let is_number = (JS.find(_this, '.an_num').getAttribute('num') == undefined) ? 0 : 1;
            let html = '';
            if (is_number) {
                html = JS.find(JS.find(desc_selector, '[num="' + JS.find(_this, '.an_num').getAttribute('num') + '"]').parentElement, '[a_c="1"]').innerHTML;
            } else {
                html = JS.find(JS.find(desc_selector, '[d-m="' + JS.find(_this, '.an_num').getAttribute('d-m') + '"]'), '[a_c="1"]').innerHTML;
            }
            let doc = new DOMParser().parseFromString(html, 'text/html')
            hover_array[index] = {};
            if (doc.querySelector('b') != null) {
                let heading = doc.querySelector('b').textContent;
                hover_array[index]['content'] = html.replace(`<b>${heading}</b>`, '').replace(/:/, '').trim();
                hover_array[index]['heading'] = heading.replace(/:/, '').trim();
            } else {
                hover_array[index]['heading'] = '';
                hover_array[index]['content'] = html.trim();
            }
        });
        if (JS.find(current_object, '[json]', 'all').length == 0) {
            JS.insert(current_object, '<div json class="h-imp"></div>', 'beforeend');
        }
        JS.find(current_object, '[json]', {action: 'attr', actionData: {'json':  JSON.stringify(hover_array) }});
    }

    // responsible for the list setup
    listSetup (object, min_list, key) {
        let key_list = [37, 38, 39, 40];
        let symbol = {};
        let cur_symbol = {};
        let to_be_made = [];
        let error_type = 0;
        if (JS.find(object.parentElement, '.' + this.state.annotate_number, 'all').length == 0 || !JS.findInArray(key, key_list)) {
            return;
        }
        let desc_selector = JS.find(object, '.' + this.state.list_container);
        if (desc_selector.length != 0 && JS.findChild(desc_selector, '.an_divp').length != 0) {
            let current_value = -1;
            JS.find(object, '.an_divp', 'all').forEach((_this)=> {
                if (JS.findChild(_this, 'div', 'all').length < 2) {
                    _this.remove();
                } else if (JS.find(_this, '.an_div[num]', 'all').length > 0) {
                    current_value++;
                    JS.find(_this, '[a_c="1"]').textContent == '' ? JS.find(_this, '[a_c="1"]', {action: 'text', actionData: ' '}) : null;
                    JS.find(_this, '.an_div[num]', {action: 'attr', actionData: {num: current_value + 1} }).textContent = current_value + 1;
                } else {
                    JS.find(_this, '[a_c="1"]').textContent == '' ? JS.find(_this, '[a_c="1"]', {action: 'text', actionData: ' '}) : null;
                }
            });
        } else {
            if (desc_selector.length == 0 && object.find('.' + this.state.desc_pre_block).length == 0) {
                JS.select(object.parentElement, 'removeClass', 'd-flex');
                if (this.state.curdata.view == "0") {
                    object.innerHTML = (`<div class="pre-block ${this.state.desc_pre_block} ${this.state.curdata.color == "1" ? 'bl' : 'rl'}" style='overflow:scroll;height:auto;min-height:${object.parent().find('img').height() + (object.parent().find('img').hasClass('img-bordered') ? 8 : 0)}px;margin-bottom:${object.parent().find(this.state.uc_annotation_container).outerHeight(true) - (object.parent().find('img').height() + (object.parent().find('img').hasClass('img-bordered') ? 8 : 0))}px;'><div class="${this.state.list_container}"></div></div>`)
                } else {
                    object.innerHTML = (`<br><div class="pre-block ${this.state.desc_pre_block} ${this.state.curdata.color == "1" ? 'bl' : 'rl'}"><div class="${this.state.list_container}"></div></div>`);
                }
            }
        }

        let numList = JS.find(JS.find(object, '.'+this.state.list_container), '[num]', 'all');
        if (numList.length < min_list) {
            error_type = 1;
            let lengthCounter = numList.length;
            let diff = min_list - numList.length;
            for (let index = 0; index < diff; index++) {
                JS.insert(JS.find(object, '.' + this.state.list_container), `<div class="an_divp" d-m="0"><div class="an_div" num="${numList.length + 1}">${numList.length + 1}</div><div a_c='1'><b>Heading</b>: Sample Text</div></div>`, 'beforeend');
                lengthCounter++;
            }
        }

        JS.find(JS.find(object.parentElement, this.state.uc_annotation_container), '.s_m[d-m]', 'all').forEach((_this)=> {
            symbol[_this.getAttribute('d-m')] = (symbol[_this.getAttribute('d-m')] == undefined) ? 1 : Number(symbol[_this.getAttribute('d-m')]) + 1;
        });

        JS.find(object, '[d-m]:not([d-m="0"])', 'all').forEach((_this)=> {
            cur_symbol[_this.getAttribute('d-m')] = (cur_symbol[_this.getAttribute('d-m')] == undefined) ? 1 : Number(cur_symbol[_this.getAttribute('d-m')]) + 1;
        });

        if (Object.keys(symbol).length != 0) {
            Object.keys(symbol).forEach((index)=> {
                if (symbol[index] > 0 && cur_symbol[index] != 1) {
                    to_be_made.push(this.marker_icon[index])
                }
            });

            if (to_be_made.length > 0) {
                error_type = 1;
                for (let symbol_index = 0; symbol_index < to_be_made.length; symbol_index++) {
                    JS.insert(JS.find(object, '.' + this.state.list_container, 'all')[0], `<div class="an_divp" d-m="${this.marker_icon.indexOf(to_be_made[symbol_index])}"><div class="an_div ${to_be_made[symbol_index]}"></div><div a_c='1'><b>Heading</b>: Sample Text</div></div>`, 'beforeend');
                }
            }
        }

        if (error_type > 0) {
            swal({
                title: l.delete_no_of_points,
                type: 'error',
            });
        }
    }

    // for deleting the points
    deletePoints (is_multiple, cur_number, cur_mode) {
        JS.find(this.state.cur_parent, '.' + this.state.annotate_number, {action: 'hide'});
        var desc_selector = JS.find(this.state.cur_parent.closest(this.state.uc_annotation_container).parentElement, this.state.description_selector);
        (is_multiple) ? this.restorelist(cur_number, desc_selector): null;
        var annotation_element = this.state.cur_parent.closest(this.state.uc_annotation_container);
        var annotation_number = JS.find(this.state.cur_parent.closest(this.state.auth_parent_selector), '.' + this.state.annotate_number,'visible');
        this.state.cur_parent.remove(); 
        this.restorePoints(annotation_element, annotation_number, desc_selector, is_multiple);
        this.state.cur_parent = '';
        JS.selectAll('.annotate_mark_tools', 'remove');
        JS.find(JS.select(this.state.uc_annotation_container).parentElement, '.' + this.state.list_container, {action: 'attr', actionData: {x: Math.floor(Math.random() * 1000)}});
        swal({
            title: ((cur_mode == 0) ? l.point + " " + cur_number.textContent : this.marker_name[cur_mode]) + l.deleted_text,
            type: "success",
        });
    }

    // call in case of restoring the list
    restorelist (number_element, desc_element) {
        if (JS.find(desc_element, '[d-m]', 'all').length > 1) {
            if (number_element.getAttribute('d-m') == undefined) {
                JS.find(desc_element, '[num="' + number_element.textContent + '"]').parentElement.remove();
            } else {
                JS.find(desc_element, '[d-m="' + number_element.getAttribute('d-m') + '"]').remove();
            }
        } else {
            desc_element.innerHTML = ('');
            if (this.state.curdata.view == "0") {
                JS.find(desc_element.parentElement, this.state.uc_annotation_container).removeAttribute('hv');
            }
        }
    }

    // for getting the current data
    getData (object) {
        return {
            width: object.getAttribute('d-w'),
            img: object.getAttribute('d-i'),
            color: object.getAttribute('d-c'),
            view: object.getAttribute('d-v'),
            marker: object.getAttribute('d-m')
        };
    }
}

// check if uc_image_annotate is available in window or not
// if (typeof(window.uc_image_annotate) == "undefined") {
//     var uc_image_annotate = new imageAnnotate();
//     window.uc_image_annotate = uc_image_annotate;
//     uc_image_annotate.init();
// } else {
//     console.log('Image Annotate already added!');
// }