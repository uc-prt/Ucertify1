
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a7 as swal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, a8 as afterUpdate, X as XMLToJSON, g as globals, C as validate_each_argument, z as empty, n as insert_dev, K as destroy_each, x as detach_dev, e as element, f as space, j as attr_dev, k as add_location, l as set_style, p as append_dev, B as noop, a4 as HtmlTag, h as text, F as set_data_dev, G as prop_dev, A as AH, Y as src_url_equal, q as listen_dev, t as transition_in, r as group_outros, a as transition_out, u as check_outros, c as create_component, m as mount_component, b as destroy_component, H as run_all, M as append_styles, o as onMount, a0 as onUserAnsChange, L as beforeUpdate, w as writable, a6 as l } from './main-372b8c3b.js';
import { I as ItemHelper } from './ItemHelper-dfb80fe5.js';
import { s as styleInject } from './style-inject.es-1c867377.js';
import { D as Draggable } from './Draggable-eea764a0.js';
import { h as hotkeys } from './hotkeys.esm-701e2924.js';

/**
 *  File Name   : dndString.js
 *  Author      : Ayush Srivastava
 *  Function    : DND
 *  Version     : 1.0
 *  Packege     : Drag and Drop (prev)
 *  Last update : 19 Jan 2021
 *  Dependency  : Draggable, Sweetalert, Hotkeys-js
 */
let jsSwal = swal;

// declaring gloabl variable for use
let elemId = "#dndmainPreview";
let result = true;
let stepsPreview = null;
let dragstore = {};
let user_points = 0;
const DND = {};
let is_all_correct = true;

// for storing to prevent dialog
DND.prevent_dialog = false;
//window.DND = DND;
// for storing the storage data
DND.storage = {
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
    remove: function(obj) {
        if (this.state[obj]) {
            delete this.state[obj];
        }
    },
    state: {}
};

// for setting the browser version
DND.browser = {};
DND.browser.msie = false;
DND.browser.version = 0;
if (typeof navigator !== 'undefined' && navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
    DND.browser.msie = true;
    DND.browser.version = RegExp.$1;
}


// function responsible for parsing the sql queries
DND.sqlparser = function(sql, type) {
    if (typeof(type) !== "boolean") {
        type = false;
    }
    let ret = [];
    if (type) {
        ret['optional'] = [], ret['mustbeone'] = [];
        let matches = sql.match(/{.*?}/g);
        if (matches != null) {
            for (let i = 0; i < matches.length; i++) {
                sql = sql.replace(matches[i], "");
                opt = matches[i].trim();
                let opt = opt.substr(1, (opt.length - 2));
                if (opt.indexOf('|') != -1) {
                    opt = opt.split('|');
                    ret['mustbeone'].push(opt);
                } else {
                    ret['optional'].push(opt);
                }
            }
        }
    }
    ret['sql'] = sql.toLowerCase().replace(/([?~!@#$%^&*()_+\-=\[\]{};':",\./\<>%])/g, ' $1 ').replace(/[;]/g, ' ').trim().replace(/(,|`|\n)/g, " ").replace(/\s{2,}/g, " ").split(' ');
    return ret;
};

// modifying string prototype
String.prototype.sqlparser = function(type) {
    return DND.sqlparser(this.toString(), type);
};

// function responsible for setting/changing the steps
DND.setStep = function(tabname) {
    tabname = tabname.match(/dnd/g) || (tabname == "base") ? tabname : "dnd" + tabname;
    if (tabname && tabname.trim() != '') {
        let dndid;
        let tabname_element = document.querySelector('#' + tabname);
        let tabname_closest = (tabname_element) ? tabname_element.closest('[id^="dndmainPreview"]') : false;
        if (tabname_closest) {
            dndid = '#' + tabname_closest.getAttribute('id');
        }
        if (dndid) {
            let element = document.querySelector(elemId);
            if (element) {
                let new_element = AI.find(element, "[type='step']", 'all');
                for (let index = 0; index < new_element.length; index++) {
                    AI.setCss(new_element[index], {
                        display: "none",
                    });
                }
            }
            let dnd_element = AI.select(dndid);

            if (tabname == "base") {
                let dnd_find_element = AI.find(dnd_element, '#base');
                AI.selectAll(dnd_find_element, 'checked', true);
            } else {
                AI.select("#step_" + tabname, 'checked', true);
                let element_list = AI.find(dnd_element, "#" + tabname);
                AI.setCss(element_list.parentElement, {
                    display: 'block',
                });
                AI.setCss(element_list, {
                    display: 'block',
                });
            }
        }
    }
};

// making this global as it is used outside the code
if (typeof window !== 'undefined') {
    window.setStep = DND.setStep;
}

// function for wrapping the element into other element
DND.wrapInner = function(parent, wrapper, attribute, attributevalue) {
    try {
        if (typeof wrapper === "string") {
            wrapper = document.createElement(wrapper);
        }
        parent.appendChild(wrapper).setAttribute(attribute, attributevalue);
        while (parent.firstChild !== wrapper) {
            wrapper.appendChild(parent.firstChild);
        }
    } catch (error) {
        console.warn(error);
    }
};

// function for activator in preview side
DND.activate = function(type = 0) {
    if (type != 0 && document.querySelectorAll('.spinner').length == 0) {
        let spinner = document.createElement("div");
        spinner.className = "spinner";
        let loading = document.createElement("div");
        loading.className = "loading";
        spinner.appendChild(loading);
        if (document.body != null) {
            document.body.appendChild(spinner);
        }
    } else {
        !!document.getElementsByClassName('spinner')[0] && document.getElementsByClassName('spinner')[0].remove();
    }
};

// function responsible for binding all the events to the elments
DND.readyThis = function(dndid) {
    let dndid_element = AI.select(dndid);
    let elements_list = AI.find(dndid, '[zoom="1"]', 'all');
    if (elements_list.length > 0) {
        elements_list.forEach(function(value) {
            DND.wrapInner(value, 'div', 'class', 'zoom_wrap');
            DND.wrapInner(value, 'div', 'class', 'zoom_container');

            let div = document.createElement("div");
            div.class = 'c_zoom';
            let input = document.createElement("input");
            input.type = 'range';
            input.id = 'c_zoom';
            input.min = "1";
            input.max = "7";
            div.append(input);
            value.appendChild(div);
            value.insertBefore(div, value.firstChild);
        });
    }

    // nee to check I think we have to use listen all
    AI.listen('body', 'change', '.c_zoom', function(element) {
        let zoom_element = AI.find(element.parentElement.parentElement, '.zoom_wrap');
        if (zoom_element) {
            switch (element.value) {
                case "1": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom2");
                    break;
                }
                case "2": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom2");
                    break;
                }
                case "3": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom3");
                    break;
                }
                case "4": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom4");
                    break;
                }
                case "5": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom5");
                    break;
                }
                case "6": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom6");
                    break;
                }
                case "7": {
                    zoom_element.setAttribute("class", "zoom_wrap zoom7");
                    break;
                }
            }
        }
    });

    AI.listen('body', 'click', '.hotspot_test', function(element, event) {
        if (element.classList.contains('lab_disable')) {
            return;
        }
        let targetimg_element = AI.find(dndid_element, '.targetImg');
        if (!event.target.classList.contains('tmpTarget') && AI.find(element, '.hs_item', 'all').length > AI.find(element, '.tmpTarget', 'all').length) {
            let top = Math.round(event.pageY - DND.offset(element).top - ((targetimg_element) ? (targetimg_element.offsetHeight ? targetimg_element.offsetHeight : 32) : 0) / 2) - window.pageYOffset;
            let left = Math.round(event.pageX - DND.offset(element).left - ((targetimg_element) ? (targetimg_element.offsetHeight ? targetimg_element.offsetHeight : 32) : 0) / 2) - window.pageXOffset;
            if (event.target.getAttribute('id') != "c_zoom") {
                if (event.target.classList.contains('hs_item')) {
                    event.target.setAttribute("data-correctans", "1");
                }

                let clone_element = AI.clone(targetimg_element);
                clone_element.classList.remove('targetImg');
                clone_element.classList.add('tmpTarget');
                clone_element.id = element.id + "_" + (AI.find(element, '.tmpTarget', 'all').length + 1);
                AI.setCss(clone_element, {
                    position: 'absolute',
                    top: top + 'px',
                    left: left + 'px',
                    display: 'block',
                });
                DND.storage.store(clone_element.id, 'tgElem', event.target.id);
                AI.insertAfter(clone_element, AI.find(element, '.hs_item', 'all')[AI.find(element, '.hs_item', 'all').length - 1]);
            }
        } else if (event.target.classList.contains('tmpTarget')) {
            let last_id = event.target.id.split('_')[1];
            let tgElem = DND.storage.store(event.target.id, 'tgElem');
            event.target.remove();

            if (last_id) {
                for (let index = (last_id - 1); index < AI.find(element, '.tmpTarget', 'all').length; index++) {
                    let current_id = element.id + "_" + (index + 1);
                    let next_elem_id = element.id + "_" + (index + 2);
                    let next_elem_store = DND.storage.store(next_elem_id, 'tgElem');
                    DND.storage.store(current_id, 'tgElem', next_elem_store);
                    DND.storage.remove(next_elem_id);
                    AI.select('#' + next_elem_id).id = current_id;
                }
            }

            if (typeof(tgElem) !== "undefined") {
                let rmTg = true;
                let tmp_target = AI.find(dndid_element, '.tmpTarget', 'all');

                for (let index = 0; index < tmp_target.length; index++) {
                    if (DND.storage.store(tmp_target[index].id, 'tgElem') == tgElem) {
                        rmTg = false;
                        break;
                    }
                }
                if (rmTg) {
                    AI.select('#dndmainPreview #' + tgElem).setAttribute("data-correctans", "0");
                }
            }
        }

        let hustr = "";
        let hId = 1;

        let tmp_target = AI.find(dndid_element, '.tmpTarget', 'all');

        for (let index = 0; index < tmp_target.length; index++) {
            hustr += '"' + hId + '":[' + tmp_target[index].offsetTop + ',' + tmp_target[index].offsetLeft + ',' + tmp_target[index].offsetWidth + ',' + tmp_target[index].offsetHeight + '],';
            hId++;
        }
        element.setAttribute("data-userans", "{" + hustr.substr(0, hustr.length - 1) + "}");
        DND.checkAns(dndid);
    });

    let drop_image = AI.find(dndid_element, '[data-dragimage]', 'all');

    for (let index = 0; index < drop_image.length; index++) {
        if (drop_image[index].getAttribute('data-dragimage') != 'undefined' && drop_image[index].getAttribute('data-dragimage') != '') {
            let bgimage = drop_image[index].getAttribute("data-path") + drop_image[index].getAttribute("data-dragimage");
            AI.insert('body', '<img src="' + bgimage + '" style="display:none"/>', 'beforeend');
        }
    }

    let droppable = AI.selectAll('.dropable');
    for (let index = 0; index < droppable.length; index++) {
        let target = droppable[index].id;
        let source = droppable[index].dataset.droped;
        if (target && source) {
            dragstore[target] = [AI.select('#' + source), AI.select('#' + target)];
        }
    }

    let draggable = new Draggable('#dndmainPreview', '[draging]', '[droping]', dragstore);
    let distance = 80, step = 5;
    draggable.onDrag = function(event) {
        if (event.clientY <= distance) {
            window.scrollTo(0, window.scrollY - step);
        } else if (event.clientY >= (window.innerHeight + 20)) {
            window.scrollTo(0, window.scrollY + step);
        }
        if (AI.selectAll('#external_lab').length == 1) {
            AI.select('#external_lab').scrollTo(event.clientX, event.clientY);
        }
        if (AI.selectAll('#user_answer').length == 1) {
            AI.select('#user_answer').scrollTo(event.clientX, event.clientY);
        }
    };

    draggable.onDragStart = function(event, element) {
        let target = element;
        let img, bgimage;
        if (element.classList.contains('dropable') && target.getAttribute('data-droped') && target.getAttribute('data-droped').trim() != '') {
            target = AI.find(dndid, '#' + target.getAttribute('data-droped'));
        }

        if (typeof(target.getAttribute('data-dragimage')) != 'undefined' && target.getAttribute('data-dragimage') != '') {
            bgimage = "url(" + target.getAttribute("data-path") + target.getAttribute("data-dragimage") + ")";
        } else {
            bgimage = target.style.backgroundImage;
        }
        if (bgimage == "none" || bgimage == "") {
            img = {
                "width": target.offsetWidth,
                "height": target.offsetHeight,
            };
        } else {
            img = new Image();
            img.src = bgimage.substr(4, (bgimage.length - 5));
        }

        let copied_node = element.cloneNode(true);
        copied_node.removeAttribute('droping');
        copied_node.style.position = 'absolute';
        copied_node.style.zIndex = 0;
        copied_node.backgroundImage = bgimage;
        copied_node.style.width = img.width + "px";
        copied_node.style.height = img.height + "px";
        return copied_node;
    };

    draggable.onDrop = function(source, target) {
        let copied = source.cloneNode(true);
        target.style.backgroundColor = copied.getAttribute('data-bgcolor');
        target.setAttribute('draging', 2);
        target.setAttribute('droping', 2);

        // for disabling the dragable
        if (source.getAttribute("data-multi_drag") == "0") {
            source.classList.add('uc_drag_disable');
            source.style.setProperty("cursor", "no-drop", "important");
            source.style.setProperty("opacity", "0.5", "important");
        }

        target.classList.remove('drop-hover');
        target.style.opacity = '1';

        let drop_id = source.getAttribute('data-droped') ? source.getAttribute('data-droped') : source.getAttribute('id');
        let bgimage = '';
        if (source.getAttribute('data-dropimage') && source.getAttribute('data-dropimage') != '') {
            bgimage = "url(" + source.getAttribute('data-path') + source.getAttribute('data-dropimage') + ")";
        } else {
            bgimage = source.style.backgroundImage;
        }

        if (DND.browser.msie && drop_id && AI.find(AI.select(dndid), '#' + drop_id).innerText.trim() == "") {
            source.style.backgroundColor = "transparent";
        }

        target.setAttribute('data-userans', drop_id);
        target.setAttribute('data-droped', drop_id);
        target.setAttribute('data-path', source.getAttribute('data-path'));
        target.setAttribute('data-dropimage', source.getAttribute('data-dropimage'));
        target.setAttribute('data-dragimage', source.getAttribute('data-dragimage'));

        AI.setCss(target, {
            backgroundColor: source.style.backgroundColor,
            backgroundImage: bgimage
        });
        AI.find(target, 'p').innerText = AI.find(copied, 'p').innerText.trim();

        setTimeout(function() {
            DND.checkAns(dndid);
        }, 500);

    };

    draggable.isRevert = function() {
        if (DND.prevent_dialog) {
            return false;
        }
        AI.showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 3000);
        let img = document.createElement('img');
        img.src = '//s3.amazonaws.com/jigyaasa_content_static/how-to-drop-final_000BeI.gif';
        img.alt = 'How to Drop?';
        let div = document.createElement('div');
        let content = document.createElement('div');
        let input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'prevent_dialog';
        input.classList.add('mr-1');
        input.onchange = function() {
            DND.prevent_dialog = this.checked;
            if (this.checked) {
                jsSwal.close();
            }

        };
        let label = document.createElement('label');
        label.setAttribute('for', 'prevent_dialog');
        label.innerText = "Don't show me message again!";

        content.append(img);
        div.append(input);
        div.append(label);
        content.append(div);
        jsSwal({
            text: "How to Drop?",
            content: content,
            timer: 10000,
            buttons: false,
        });

    };

    draggable.onRemove = function(source, target) {
        source.removeAttribute('draging');
        source.setAttribute('droping', 1);

        // for disabling the dragable
        if (target) {
            target.classList.remove('uc_drag_disable');
            target.style.cursor = '';
            target.style.opacity = '';
        }

        source.classList.remove('drop-hover');
        source.style.opacity = '1';

        source.setAttribute('data-userans', '');
        source.setAttribute('data-droped', '');
        source.style.backgroundColor = source.getAttribute('data-bgcolor');
        source.style.backgroundImage = source.getAttribute('data-bgimage');
        AI.find(source, 'p').innerText = source.getAttribute('data-caption');
        setTimeout(function() {
            DND.checkAns(dndid);
        }, 500);
    };

    draggable.onOver = function(element) {
        try {
            let hoverImg = "";
            if (element.getAttribute("hoverimage")) {
                hoverImg = element.getAttribute("data-path") + element.getAttribute("hoverimage");
            }
            if (element.style.backgroundImage.match(/undefined/) || element.style.backgroundImage.match(/none/)) {
                element.style.backgroundImage = "url(" + hoverImg + ")";
            }
        } catch (e) {
            console.warn(e);
        }
    };

    draggable.onOut = function(element) {
        try {
            let hoverImg = "none";
            if (element.getAttribute("hoverimage")) {
                hoverImg = element.getAttribute("hoverimage");
            }
            if (element.style.backgroundImage.search(hoverImg) != -1) {
                element.style.backgroundImage = "";
            }
        } catch (e) {
            console.warn(e);
        }
    };

    AI.listen('body', 'dblclick', dndid + ' [detail]', function(element, event) {
        try {
            if (element.closest(dndid)) {
                if (element.getAttribute('data-detail').length == 5) {
                    DND.activate(1);
                    AI.ajax({
                        url: baseUrl + 'index.php',
                        data: {
                            "lab_detail": element.getAttribute('data-detail'),
                            "ajax": "1"
                        },
                        longUrl: true
                    }).then(function(response) {
                        DND.activate(0);
                        if (AI.selectAll('.detail-modal').length < 1) {
                            AI.insert('#main-page', '<div id="modal-from-detail" class="detail-modal modal fade" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content no-padding"><span class="close-icon" data-dismiss="modal" aria-hidden="true"></span><div class="detail_data">' + response + '</div></div></div></div>', 'beforeend');
                        } else {
                            AI.select('.detail-modal .detail_data').innerHTML = response;
                        }
                        AI.getBS('#modal-from-detail', 'Modal').show();
                    });
                } else if (element.getAttribute('data-detail') != '') {
                    if (AI.select('.detail').length < 1) {
                        AI.insert('body', '<div class="detail"><span class="close_detail">&times;</span><div class="detail_data">' + element.getAttribute('data-detail') + '</div></div>', 'beforeend');
                        AI.setCss(AI.select('.detail'), {
                            "top": event.pageY + "px",
                            "left": event.pageX + "px",
                            'display': 'block',
                        });
                    } else {
                        AI.select('.detail .detail_data').innerText = element.getAttribute('data-detail');
                        AI.setCss(AI.select('.detail .detail_data'), {
                            "top": event.pageY + "px",
                            "left": event.pageX + "px",
                            'display': 'block',
                        });
                    }
                }
            }
        } catch (error) {
            console.warn(error);
        }
    });

    AI.listen('body', 'click', '.close_detail', function() {
        AI.select('.detail').nodeName && AI.select('.detail').remove();
    });

    let index = 1;

    AI.listen('body', 'click', dndid + ' [image]', function(element) {
        try {
            let toggleImg = element.getAttribute('image').split(',');
            element.style.backgroundImage = "url(" + element.getAttribute('data-path') + toggleImg[index] + ")";
            index++;
            if (toggleImg.length == index) index = 0;
        } catch (error) {
            console.warn(error);
        }
    });
};

// for changing the draggable state
DND.draggable = function(element, enable) {
    if (enable) {
        element.classList.remove('uc_drag_disable');
        element.style.cursor = '';
        element.style.opacity = 1;
    } else {
        element.classList.add('uc_drag_disable');
        element.style.setProperty("cursor", "no-drop", "important");
        element.style.setProperty("opacity", "0.7", "important");
    }
};

// function for moving the focus to the next or previous elements
DND.tabMove = function(element, type = 1) {
    if (element.id) {
        let ks_element = AI.selectAll('.ks');
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
};

// fucntion for checking the containment of hotspot area, it runs in case of keyboard
DND.checkContainment = function(element, extra_top = 0, extra_left = 0) {
    let top = parseInt(element.style.top.replace("px", "")) + extra_top;
    let left = parseInt(element.style.left.replace("px", "")) + extra_left;
    let width = parseInt(element.parentElement.style.width.replace("px", ""));
    let height = parseInt(element.parentElement.style.height.replace("px", ""));

    if (left > (width - element.offsetWidth)) {
        left = width - element.offsetWidth;
    } else if (left < 0) {
        left = 0;
    }

    if (top > (height - element.offsetHeight)) {
        top = height - element.offsetHeight;
    } else if (top < 0) {
        top = 0;
    }
    return {
        top: top,
        left: left
    };
};

// function reponisble for binding the key up events (keyboard related events)
DND.bindKeyUp = function(dndid) {
    let dndid_elements = AI.find(dndid, "[id^=dndID]", 'all');
    for (let index = 0; index < dndid_elements.length; index++) {
        if (dndid_elements[index].getAttribute('type') != 'tab' && !(dndid_elements[index].classList.contains("dndlabel"))) {
            dndid_elements[index].classList.add('ks');
        }
    }

    let count = 0;
    let copied_id = "";
    let ee = {
        clientX: 16,
        clientY: 16
    };

    AI.find(dndid, ".selmatch", {
        action: 'removeClass',
        actionData: 'selmatch'
    });

    let elements = AI.selectAll('.ks');


    function sortBy(prop, prop2) {
        return function(a, b) {
            let filter_a = parseInt(a.style[prop]);
            let filter_b = parseInt(b.style[prop]);
            if (filter_a == filter_b) {
                let filter_c = parseInt(a.style[prop2]);
                let filter_d = parseInt(b.style[prop2]);
                return filter_c < filter_d ? -1 : (filter_c > filter_d ? 1 : 0);
            }
            return filter_a < filter_b ? -1 : (filter_a > filter_b ? 1 : 0);
        }
    }

    function sortDom(filter, second_filter) {
        //Transform our nodeList into array and apply sort function
        return [].map.call(elements, function(elm) {
            return elm;
        }).sort(sortBy(filter, second_filter))
    }
    
    //Sort by top style property
    let byTop = sortDom('top', "left");

    for (let index = 0; index < byTop.length; index++) {
        let id = byTop[index].getAttribute('id');
        let parent = byTop[index].parentElement;
        if (id) {
            AI.find(dndid, "#" + id, {
                action: 'remove'
            });
        }
        if (parent) {
            parent.append(byTop[index]);
        }
    }

    // function for focusing first element
    function focusFirst() {
        let ks_element = AI.selectAll('.ks');
        if (ks_element.length > 0) {
            let elem = AI.select('.ks');
            let first_child = elem.children[0];
            if (first_child && (first_child.classList.contains("dnd_textbox") || first_child.classList.contains("dndcheckbox") || first_child.classList.contains("dnd_select"))) {
                first_child.focus();
            } else if (AI.find(elem, ".customRad", 'all').length != 0) {
                AI.find(elem, ".customRad").focus();
            } else {
                elem.focus();
            }
        }
    }

    // function for focusing last element
    function focusLast() {
        let ks_element = AI.selectAll('.ks');
        if (ks_element.length > 0) {
            let elem = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];
            let last_child = elem.children[0];
            if (last_child && (last_child.classList.contains("dnd_textbox") || last_child.classList.contains("dndcheckbox") || last_child.classList.contains("dnd_select"))) {
                last_child.focus();
            } else if (AI.find(elem, ".customRad", 'all').length != 0) {
                AI.find(elem, ".customRad").focus();
            } else {
                elem.focus();
            }
        }
    }

    // function for checking the focus
    function checkFocus(list, img = 0) {
        let is_focus = false;
        let elements = AI.find(dndid, "." + list, 'all');
        let focus_el = (img) ? AI.select('.tmpTarget:focus') : AI.select('.ks:focus');
        if (focus_el.nodeName) {
            let focus_id = focus_el.getAttribute('id');
            for (let index = 0; index < elements.length; index++) {
                if (focus_id == elements[index].getAttribute('id')) {
                    is_focus = true;
                    break;
                }
            }
        }
        return is_focus;
    }

    // function for removing the draggable using keyboard
    function removeDraggable(event) {
        let removethis = event.target;
        let dropedNode = removethis.getAttribute('data-droped');
        if (removethis.classList.contains('dropable') && dropedNode != "") {
            AI.setCss(removethis, {
                backgroundColor: removethis.getAttribute('data-bgcolor'),
                backgroundImage: removethis.getAttribute('data-bgimage'),
            });

            removethis.setAttribute('data-droped', "");
            removethis.setAttribute('data-userans', "");
            removethis.setAttribute('droping', "1");
            removethis.removeAttribute('draging');

            if (AI.select('#' + dropedNode).getAttribute('data-multi_drag') == '0') {
                DND.draggable(AI.select('#' + dropedNode), 1);
            }

            if (dragstore && dragstore[removethis.id]) {
                delete dragstore[removethis.id];
            }

            AI.find(removethis, 'p').innerText = removethis.getAttribute('data-caption');
        }
        let check_ans_timer = setTimeout(function() {
            DND.checkAns(dndid);
            clearTimeout(check_ans_timer);
        }, 100);
    }

    // function for navigating down
    function navigateDown() {
        AI.find(dndid, ".selmatch", {
            action: 'removeClass',
            actionData: 'selmatch'
        });
        let ks_element = AI.selectAll(".ks");
        let ks_length = ks_element.length;

        let ks_fill = ks_element[count];

        if (ks_fill) {
            if (ks_fill.children[0] && (ks_fill.children[0].classList.contains("dnd_textbox") || ks_fill.children[0].classList.contains("dndcheckbox") || ks_fill.children[0].classList.contains("dnd_select"))) {
                ks_fill.children[0].focus();
            } else if (AI.find(ks_fill, '.customRad', 'all').length != 0) {
                AI.find(ks_fill, '.customRad').focus();
            } else {
                ks_fill.focus();
            }
        }


        if (count == (ks_length - 1)) {
            count = 0;
        } else {
            count++;
        }
    }


    // function for enabling the hotspot using keyboard
    function hotSpotKeyboard() {
        let ks = AI.selectAll('.ks');
        for (let index = 0; index < ks.length; index++) {
            if (ks[index].classList.contains('hotspot_test')) {
                let hotspot_this = ks[index];
                let child = hotspot_this.children;
                for (let sub_index = 0; sub_index < child.length; sub_index++) {
                    if (child[sub_index].classList.contains("drag-resize") && (AI.find(hotspot_this, '.hs_item', 'all').length > AI.find(hotspot_this, '.tmpTarget', 'all').length)) {
                        let top = Math.round(ee.clientY - (AI.find(dndid, '.targetImg').offsetHeight / 2));
                        let left = Math.round(ee.clientX - (AI.find(dndid, '.targetImg').offsetWidth / 2));
                        if (hotspot_this.getAttribute('id') != 'c_zoom') {
                            if (AI.find(dndid, '.targetImg')) {
                                let clonenode = AI.find(dndid, '.targetImg').cloneNode(true);
                                clonenode.classList.remove('targetImg');
                                clonenode.classList.add('tmpTarget');
                                clonenode.id = hotspot_this.id + "_" + (AI.find(hotspot_this, '.tmpTarget', 'all').length + 1);

                                AI.setCss(clonenode, {
                                    position: 'absolute',
                                    top: top + "px",
                                    left: left + "px",
                                    display: 'block'
                                });

                                // need to check here
                                DND.storage.store(clonenode.id, 'tgElem', hotspot_this.id);
                                AI.insertAfter(clonenode, AI.find(hotspot_this, '.hs_item', 'all')[AI.find(hotspot_this, '.hs_item', 'all').length - 1]);
                            }
                        }
                        let tmp_target = AI.find(dndid, '.tmpTarget', 'all');

                        let hustr = "";
                        let hId = 1;
                        for (let tmp_index = 0; tmp_index < tmp_target.length; tmp_index++) {
                            hustr += '"' + hId + '":[' + tmp_target[tmp_index].offsetTop + ',' + tmp_target[tmp_index].offsetLeft + ',' + tmp_target[tmp_index].offsetWidth + ',' + tmp_target[tmp_index].offsetHeight + '],';
                            hId++;
                        }
                        hotspot_this.setAttribute("data-userans", "{" + hustr.substr(0, hustr.length - 1) + "}");
                        DND.checkAns(dndid);
                        ee.clientX += 35;
                    }
                }
                DND.setHotspotans(hotspot_this);
            }
        }
    }

    // function for moving the hotspot image
    function moveTargetImg(top, left) {
        let hotspot_test = AI.select(".hotspot_test");

        if (hotspot_test.getAttribute('id') != "c_zoom") {
            AI.setCss(AI.find(dndid, '.tmpTarget:focus'), {
                position: "absolute",
                top: top + "px",
                left: left + "px"
            });
        }

        let tmp_target = AI.find(dndid, '.tmpTarget', 'all');
        let hustr = "";
        let hId = 1;
        for (let tmp_index = 0; tmp_index < tmp_target.length; tmp_index++) {
            hustr += '"' + hId + '":[' + tmp_target[tmp_index].offsetTop + ',' + tmp_target[tmp_index].offsetLeft + ',' + tmp_target[tmp_index].offsetWidth + ',' + tmp_target[tmp_index].offsetHeight + '],';
            hId++;
        }
        hotspot_test.setAttribute("data-userans", "{" + hustr.substr(0, hustr.length - 1) + "}");
        DND.setHotspotans(hotspot_test);
        DND.checkAns(dndid);
    }

    // function for activating keyboard activity
    function activateKs() {
        hotSpotKeyboard();
        count = 0;
        navigateDown();
    }

    // function responsible for copy Draggable using keyboard
    function copyDraggable() {
        let copy_drag = AI.select(".ks:focus");
        if (copy_drag) {
            if (copy_drag.classList.contains('ui-draggable') && !copy_drag.classList.contains('uc_drag_disable')) {
                AI.find(dndid, '.dragable', {
                    action: 'removeClass',
                    actionData: 'copiedclr'
                });
                copied_id = copy_drag.id;
                copy_drag.classList.add('copiedclr');
            } else {
                AI.showmsg('You cannot drag this');
            }
        }
    }

    // function responsible for pasteDraggable using keyboard
    function pasteDraggable() {
        let dropthis = AI.select(".ks:focus");
        if (dropthis && copied_id != "" && dropthis.classList.contains('ui-droppable')) {
            let ui_drag = AI.find(dndid, "#" + copied_id);
            ui_drag.classList.remove('copiedclr');
            let bgimage = '';
            let drop_id = ui_drag.getAttribute('data-droped') ? ui_drag.getAttribute('data-droped') : ui_drag.getAttribute('id');
            if (ui_drag.getAttribute('data-dropimage') && ui_drag.getAttribute('data-dropimage') != '') {
                bgimage = "url(" + ui_drag.getAttribute('data-path') + ui_drag.getAttribute('data-dropimage') + ")";
            } else {
                bgimage = ui_drag.style.backgroundImage;
            }

            if (dropthis.getAttribute('data-droped') && dropthis.getAttribute('data-droped').trim() != '') {
                DND.draggable(AI.find(dndid, '#' + dropthis.getAttribute("data-droped")), 1);
            }

            if (DND.browser.msie && AI.find(dndid, '#' + drop_id) && AI.find(dndid, '#' + drop_id).innerText.trim() == '') {
                ui_drag.style.backgroundColor = 'transparent';
            }

            AI.setAttr(dropthis, {
                'userans': drop_id,
                'data-droped': drop_id,
                'data-userans': drop_id,
                'data-path': ui_drag.getAttribute('path'),
                'data-dropimage': ui_drag.getAttribute('dropimage'),
                'data-dragimage': ui_drag.getAttribute('dragimage'),
                'draging': '2',
                'droping': '2'
            });

            dragstore[dropthis.id] = [ui_drag, dropthis];

            AI.find(dropthis, 'p').innerText = ui_drag.innerText.trim();

            AI.setCss(dropthis, {
                backgroundColor: ui_drag.style.backgroundColor,
                backgroundImage: bgimage
            });

            if (AI.find(dndid, "#" + drop_id).getAttribute('data-multi_drag') == "0") {
                if (!(ui_drag.classList.contains('dropable'))) {
                    DND.draggable(ui_drag, 0);
                } else {
                    DND.draggable(AI.find(dndid, '#' + drop_id), 0);
                }
            }
            DND.checkAns(dndid);
            copied_id = "";
        }
    }

    // function for the key events
    if (typeof(hotkeys) == 'function') {
        hotkeys.unbind('alt+down,down,up,left,right,enter,delete', 'dragndrop');
        hotkeys("alt+down,down,up,left,right,enter,delete", 'dragndrop', function(event, handler) {
            switch (handler.key) {
                case 'alt+down':
                    activateKs();
                    break;
                case 'down':
                    if (AI.select("#sm_controller").offsetHeight == 0) {
                        if (checkFocus("tmpTarget", 1)) {
                            event.preventDefault();
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 4, 0);
                            moveTargetImg(position.top, position.left);
                        } else if (checkFocus('dragable') || checkFocus('dropable')) {
                            let focus_element = AI.select('.ks:focus');
                            let ks_last_element = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];

                            if (focus_element && ((focus_element.id == ks_last_element.id) || (ks_last_element.children[0] && (ks_last_element.children[0].id == focus_element.id)) || (AI.find(ks_last_element, '.customRad') && (AI.find(ks_last_element, '.customRad').id == focus_element.id)))) {
                                focusFirst();
                            } else {
                                DND.tabMove(focus_element, 1);
                            }
                            event.preventDefault();
                        }
                    }
                    break;
                case 'up':
                    if (AI.select("#sm_controller").offsetHeight == 0) {
                        if (checkFocus("tmpTarget", 1)) {
                            event.preventDefault();
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), -4, 0);
                            moveTargetImg(position.top, position.left);
                        } else if (checkFocus('dragable') || checkFocus('dropable')) {
                            let focus_element = AI.select('.ks:focus');
                            let ks_element = AI.selectAll('.ks')[0];

                            if (focus_element && ((focus_element.id == ks_element.id) || (ks_element.children[0] && (ks_element.children[0].id == focus_element.id)) || (AI.find(ks_element, '.customRad') && (AI.find(ks_element, '.customRad').id == focus_element.id)))) {
                                focusLast();
                            } else {
                                DND.tabMove(focus_element, 0);
                            }
                            event.preventDefault();
                        }
                    }
                    break;
                case 'left':
                    if (AI.select("#sm_controller").offsetHeight == 0) {
                        if (checkFocus("tmpTarget", 1)) {
                            event.preventDefault();
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 0, -4);
                            moveTargetImg(position.top, position.left);
                        } else if (checkFocus('dragable') || checkFocus('dropable')) {
                            let focus_element = AI.select('.ks:focus');
                            let ks_element = AI.selectAll('.ks')[0];

                            if (focus_element && ((focus_element.id == ks_element.id) || (ks_element.children[0] && (ks_element.children[0].id == focus_element.id)) || (AI.find(ks_element, '.customRad') && (AI.find(ks_element, '.customRad').id == focus_element.id)))) {
                                focusLast();
                            } else {
                                DND.tabMove(focus_element, 0);
                            }
                        }
                    }
                    break;
                case 'right':
                    if (AI.select("#sm_controller").offsetHeight == 0) {
                        if (checkFocus("tmpTarget", 1)) {
                            event.preventDefault();
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 0, 4);
                            moveTargetImg(position.top, position.left);
                        } else if (checkFocus('dragable') || checkFocus('dropable')) {
                            let focus_element = AI.select('.ks:focus');
                            let ks_last_element = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];

                            if (focus_element && ((focus_element.id == ks_last_element.id) || (ks_last_element.children[0] && (ks_last_element.children[0].id == focus_element.id)) || (AI.find(ks_last_element, '.customRad') && (AI.find(ks_last_element, '.customRad').id == focus_element.id)))) {
                                focusFirst();
                            } else {
                                DND.tabMove(focus_element, 1);
                            }
                        }
                    }
                    break;
                case 'enter':
                    if (AI.select("#sm_controller").offsetHeight == 0) {
                        if (checkFocus("dragable")) {
                            copyDraggable();
                        } else if (checkFocus("dropable")) {
                            pasteDraggable();
                        }
                    }
                    break;
                case 'delete':
                    if (AI.select("#sm_controller").offsetHeight == 0) {
                        if (checkFocus("dropable")) {
                            removeDraggable(event);
                        }
                    }
                    break;
            }
        });
        hotkeys.setScope('dragndrop');
        hotkeys.filter = function() {
            return true;
        };
    }

    /* events for keyboard binding */
    AI.listen('body', 'keyup', '.ks', function(current, event) {
        if (event.keyCode == 13 && !current.classList.contains('lab_disable')) {
            current.focus();
            if (current.classList.contains('dragable')) {
                copyDraggable();
            } else if (current.classList.contains('dropable')) {
                pasteDraggable();
            }
        }
    });

    AI.listen('body', 'keydown', '#dndmainPreview', function(current, event) {
        let last_element = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];
        let first_element = AI.select('.ks');
        if (AI.select('.ks:focus').nodeName) {
            if (((AI.select('.ks:focus').getAttribute('id') == last_element.getAttribute('id')) || (last_element.children[0] && AI.find(last_element.children[0], '.customRad') && (AI.select('.ks:focus').getAttribute('id') == AI.find(last_element.children[0], '.customRad').getAttribute('id')))) && (event.which || event.keyCode) == 9 && (event.shiftKey == false)) {
                event.preventDefault();
                focusFirst();
            }

            if (((AI.select('.ks:focus').getAttribute('id') == first_element.getAttribute('id')) || (first_element.children[0] && AI.find(first_element.children[0], '.customRad') && (AI.select('.ks:focus').getAttribute('id') == AI.find(first_element.children[0], '.customRad')))) && event.shiftKey == true && (event.which || event.keyCode) == 9) {
                event.preventDefault();
                focusLast();
            }
        }

        if (event.which == 27) {
            AI.find(dndid, '.copiedclr', {
                action: 'removeClass',
                actionData: 'copiedclr'
            });
            count = 0;
            copied_id = "";

            if (last_element.children[0] && (last_element.children[0].classList.contains("dnd_textbox") || last_element.children[0].classList.contains("dndcheckbox") || last_element.children[0].classList.contains("dnd_select"))) {
                last_element.children[0].focus();
                last_element.children[0].blur();
            } else if (AI.find(last_element, ".customRad", 'all').length != 0) {
                AI.find(last_element, ".customRad").focus();
                AI.find(last_element, ".customRad").blur();
            } else {
                last_element.focus();
                last_element.blur();
            }
        }
    });

    AI.listenAll('body', 'click', function() {
        if (!checkFocus("dragable") && !checkFocus("dropable")) {
            AI.find(dndid, '.copiedclr', {
                action: 'removeClass',
                actionData: 'copiedclr'
            });
            copied_id = "";
        }
    });

    AI.listen('body', 'keypress', '#dndmainPreview input', function(current, event) {
        if (event.which == 13) {
            event.preventDefault();
            return false;
        }
    });
    /* end of events for keyboard binding */

};


// function responsible for calculating the area
DND.calcArea = function(coords) {
    let i = 0,
        maxX = 0,
        minX = Infinity,
        maxY = 0,
        minY = Infinity;

    while (i < coords.length) {
        let x = parseInt(coords[i++], 10),
            y = parseInt(coords[i++], 10);

        if (x < minX) minX = x;
        else if (x > maxX) maxX = x;

        if (y < minY) minY = y;
        else if (y > maxY) maxY = y;
    }
    return {
        top: minY,
        left: minX,
        width: (maxX - minX),
        height: (maxY - minY)
    }
};

// function for responsible the correct data
DND.getCorrect = function(pElem) {
    let is_correct = -1;
    let cans = pElem.getAttribute('data-anskey');
    let uans = pElem.getAttribute('data-userans');

    if ((cans == uans) || (uans != "" && cans.split(",").includes(uans))) {
        is_correct = 1;
    }
    if (cans == "" && uans == "") {
        is_correct = -2;
    }
    return is_correct;
};

// function reponsible for showing the drag & drop module answers
DND.showansdrag = function(dndid, ansType, review) {

    let element = AI.select(dndid);
    let tab_pane_div = AI.find(dndid, '.tab-pane', 'all');
    if (DND.browser.msie && tab_pane_div.length > 0) {
        for (let index = 0; index < tab_pane_div.length; index++) {
            let cur_element = tab_pane_div[index];

            if (cur_element.offsetHeight <= 0 && AI.selectAll(dndid + '>.tab-content,' + dndid + '>img').length < 1) {
                let top = 0,
                    height = 0;
                let drag_resize = AI.find(cur_element, '.drag-resize', 'all');
                for (let drag_index = 0; drag_index < drag_resize.length; drag_index++) {
                    let drag_element = drag_resize[index];
                    if (drag_element.offsetHeight > height) {
                        height = drag_element.offsetHeight;
                    }
                    if (DND.offset(drag_element).top > top) {
                        height = DND.offset(drag_element).top;
                    }


                    if (drag_element.classList.contains('dragable') > -1 && drag_element.style.backgroundColor == "transparent" && drag_element.style.backgroundImage == "none" && drag_element.innerText.trim() == "") {
                        AI.setCss(drag_element, {
                            backgroundColor: 'white',
                            opacity: '0',
                            filter: 'alpha(opacity=0)'
                        });
                    }
                }

                cur_element.style.height = (height + top) + 'px';
                AI.setCss(cur_element, {
                    height: (height + top) + 'px',
                    overflow: 'hidden',
                });

                AI.setCss(drag_element.parentElement, {
                    overflow: 'hidden',
                });
            }
        }
    }

    if (typeof review === "undefined") review = 0;

    let dnd_test = AI.find(element, '.dndTest', 'all');
    for (let test_index = 0; test_index < dnd_test.length; test_index++) {
        DND.showchildansdrag(dndid, dnd_test[test_index], ansType, review);
    }

    let dropables = document.querySelectorAll(".dropable.ui-droppable");
    for (let i = 0; i < dropables.length; i++) {
        let droppedElem = dropables[i];
        if (droppedElem.getAttribute("data-droped") || ansType == "c") {
            droppedElem.innerHTML = (droppedElem.innerHTML).replace("Drop Here", "").replace("Place Here", "");
        }
    }
};

// for getting the offset
DND.offset = function(element) {
    let rect = element.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
};
// for getting the position
DND.position = function(element) {
    return {
        left: element.offsetLeft,
        top: element.offsetTop
    }
};

// for setting the hotspot ans in case of keyboard
DND.setHotspotans = function(element) {
    let userans = element.getAttribute('data-userans');
    if (userans) {
        userans = JSON.parse(userans);
        let hs_item = AI.find(element, '.hs_item', 'all');
        for (let index = 0; index < hs_item.length; index++) {
            let cur_element = hs_item[index];
            let position = DND.position(cur_element);
            position.width = cur_element.offsetWidth;
            position.height = cur_element.offsetHeight;
            for (let sub_index = 0; sub_index < Object.keys(userans).length; sub_index++) {
                let user_ans_index = Object.keys(userans)[sub_index];
                if (position.top <= (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) && (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) <= (position.top + position.height)) {
                    if (position.left <= (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) && (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) <= (position.left + position.width)) {
                        cur_element.setAttribute("data-correctans", "1");
                        break;
                    }
                } else {
                    cur_element.setAttribute("data-correctans", "0");
                }
            }
        }

    }
};

// function responsible for showing the dnd ans by traversing each element passing for DND.showansdrag
DND.showchildansdrag = function(dndid, pElem, ansType, review) {
    let is_correct = -2;
    let dnd_element = AI.select(dndid);
    if (pElem.classList.contains('hotspot') || pElem.classList.contains('hotspot_test')) {
        let selected = AI.find(pElem, '.tmpTarget:not([showtarget])', 'all');
        if (selected.length > 0) {
            selected.forEach((elm) => elm.remove());
        }
        let hs_item = AI.find(pElem, '.hs_item', 'all');
        if (ansType == 'c') {
            let targetimg = {
                height: (AI.find(dnd_element, '.targetImg').offsetHeight) ? AI.find(dnd_element, '.targetImg').offsetHeight : 32,
                width: (AI.find(dnd_element, '.targetImg').offsetWidth) ? AI.find(dnd_element, '.targetImg').offsetWidth : 32,
            };
            for (let index = 0; index < hs_item.length; index++) {
                let hcpos = DND.position(hs_item[index]);
                let top = hcpos.top + hs_item[index].offsetHeight / 2 - targetimg.height / 2;
                let left = hcpos.left + hs_item[index].offsetWidth / 2 - targetimg.width / 2;
                if (hs_item[index].nodeName.toLowerCase() == 'area') {
                    let height = DND.calcArea(hs_item[index].getAttribute('coords').split(','));
                    top = height.top + height.height / 2 - targetimg.height / 2;
                    left = height.left + height.width / 2 - targetimg.width / 2;
                }
                let clone_element = AI.clone(AI.find(dnd_element, '.targetImg'));
                clone_element.classList.remove('targetImg');
                clone_element.classList.add('tmpTarget');
                clone_element.id = pElem.id + "_" + (index + 1);
                AI.setCss(clone_element, {
                    position: 'absolute',
                    top: top + 'px',
                    left: left + 'px',
                    display: 'block'
                });
                pElem.append(clone_element);
            }
        } else if (ansType == 'u') {
            let ans_attr = pElem.getAttribute('data-userans');
            let userans = null;
            if (ans_attr) {
                userans = JSON.parse(ans_attr);
            }
            if (userans != null && Object.keys(userans).length > 0) {
                let already_filled_ans = [];
                let matched_ans = [];
                for (let index = 0; index < hs_item.length; index++) {
                    let cur_element = hs_item[index];
                    let position = DND.position(cur_element);
                    let tgElem = "";
                    Object.keys(userans).forEach(function(user_ans_index) {
                        if (typeof(tgElem) == 'string' && !already_filled_ans.includes(user_ans_index)) {
                            position.width = cur_element.offsetWidth;
                            position.height = cur_element.offsetHeight;
                            if (cur_element.nodeName.toLowerCase() == "area") {
                                position = DND.calcArea(cur_element.getAttribute('coords').split(','));
                            }
                            if (position.top <= (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) && (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) <= (position.top + position.height)) {
                                if (position.left <= (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) && (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) <= (position.left + position.width)) {
                                    tgElem = cur_element;
                                    already_filled_ans.push(user_ans_index);
                                    matched_ans[user_ans_index] = {
                                        tgElem: tgElem.id,
                                        userans: userans[user_ans_index],
                                    };
                                }
                            }
                        }
                    });

                    if (tgElem != '') {
                        cur_element.setAttribute("data-correctans", "1");
                        is_correct = true;
                    }
                }

                Object.keys(matched_ans).forEach(function(index) {
                    let clone_element = AI.clone(AI.find(dnd_element, '.targetImg'));
                    clone_element.classList.remove('targetImg');
                    clone_element.classList.add('tmpTarget');
                    clone_element.id = pElem.id + "_" + index;
                    AI.setCss(clone_element, {
                        position: 'absolute',
                        top: matched_ans[index]['userans'][0] + 'px',
                        left: matched_ans[index]['userans'][1] + 'px',
                        display: 'block',
                    });
                    DND.storage.store(clone_element.id, 'tgElem', matched_ans[index]['tgElem']);
                    pElem.append(clone_element);
                });

                Object.keys(userans).forEach(function(index) {
                    if (!already_filled_ans.includes(index)) {
                        let clone_element = AI.clone(AI.find(dnd_element, '.targetImg'));
                        clone_element.classList.remove('targetImg');
                        clone_element.classList.add('tmpTarget');
                        clone_element.id = pElem.id + "_" + index;
                        AI.setCss(clone_element, {
                            position: 'absolute',
                            top: userans[index][0] + 'px',
                            left: userans[index][1] + 'px',
                            display: 'block',
                        });
                        DND.storage.store(clone_element.id, 'tgElem', pElem.id);
                        pElem.append(clone_element);
                    }
                });
            }
        }
    }

    if (pElem.classList.contains('dropable')) {
        let user_pointsBgDropUrl = "none";
        if (pElem.getAttribute('data-bgimage')) {
            user_pointsBgDropUrl = "url(" + (pElem.getAttribute('data-path') + pElem.getAttribute('data-bgimage')) + ")";
        }

        AI.setCss(pElem, {
            backgroundColor: pElem.getAttribute("data-bgcolor"),
            backgroundImage: user_pointsBgDropUrl
        });

        AI.find(pElem, 'p').innerHTML = pElem.getAttribute('data-caption');
        if (ansType == 'c') {
            let anskey = pElem.getAttribute('data-anskey').split(',');
            if (anskey.length) {
                anskey.forEach(function(value, index) {
                    if (value.trim() != "") {
                        let anskey_element = AI.find(dnd_element, '#' + value);

                        let selector;
                        if (anskey.length > 1) {
                            selector = AI.selectAll('.dropable[data-anskey="' + pElem.getAttribute("data-anskey") + '"]')[index];
                        } else {
                            selector = pElem;
                        }

                        if (anskey_element) {
                            AI.setCss(selector, {
                                backgroundColor: anskey_element.getAttribute("data-bgcolor"),
                                backgroundImage: (anskey_element.getAttribute('data-dropimage') || anskey_element.getAttribute('data-bgimage')) ? "url(" + (anskey_element.getAttribute('data-path') + (anskey_element.getAttribute('data-dropimage') ? anskey_element.getAttribute('data-dropimage') : anskey_element.getAttribute('data-bgimage'))) + ")" : 'none'
                            });

                            AI.find(selector, 'p').innerHTML = anskey_element.getAttribute('data-caption');
                        }
                    }
                });
            }
        } else if (ansType == 'u') {
            if (pElem.getAttribute('data-userans').trim() != '') {
                try {
                    let user_ans = AI.find(dnd_element, '#' + pElem.getAttribute('data-userans'));
                    if (user_ans) {
                        AI.setCss(pElem, {
                            backgroundColor: user_ans.getAttribute("data-bgcolor"),
                            backgroundImage: (user_ans.getAttribute('data-dropimage') ||  user_ans.getAttribute('data-bgimage')) ? "url(" + (user_ans.getAttribute('data-path') + (user_ans.getAttribute('data-dropimage') ? user_ans.getAttribute('data-dropimage') : user_ans.getAttribute('data-bgimage'))) + ")" : ''
                        });

                        AI.find(pElem, 'p').innerHTML = user_ans.getAttribute('data-caption');
                        pElem.setAttribute('droping', 2);
                        pElem.setAttribute('draging', 2);
                        if (user_ans.getAttribute("data-multi_drag") == "0") {
                            user_ans.classList.add('uc_drag_disable');
                            user_ans.style.setProperty("cursor", "no-drop", "important");
                            user_ans.style.setProperty("opacity", "0.5", "important");
                        }
                    } else {
                        pElem.setAttribute('droping', 1);
                        pElem.removeAttribute('draging');
                    }
                } catch (error) {
                    console.warn('User ans xml destroyed', pElem.getAttribute('data-userans'));
                }
            }
            if (typeof(pElem.getAttribute("name")) !== "undefined" && pElem.getAttribute("name") != "") {
                let ansKey = pElem.getAttribute('data-anskey').split(',');
                let userans = [];

                let droppable_element = AI.find(dnd_element, '.dropable[name="' + pElem.getAttribute("name") + '"]', 'all');

                for (let index = 0; index < droppable_element.length; index++) {
                    if (typeof(droppable_element[index].getAttribute('data-userans')) != 'undefined' && droppable_element[index].getAttribute('data-userans') != '' || AI.find(droppable_element[index], '.correct_incorrect_icon', 'all').length > 0) {
                        userans.push(droppable_element[index].getAttribute('data-userans'));
                    }
                }

                if (typeof(pElem.getAttribute('data-userans')) != 'undefined' && pElem.getAttribute('data-userans') != '') {
                    is_correct = DND.getCorrect(pElem);
                } else if ((ansKey.length - userans.length) > 0) {
                    is_correct = -1;
                }
            } else {
                is_correct = DND.getCorrect(pElem);
            }
        }
    }

    if (pElem.getAttribute('type') == 'step') {
        if (typeof(pElem.getAttribute('data-udisplay')) != 'undefined') {
            if ((stepsPreview == null) || pElem.getAttribute('id').match(stepsPreview + '_0')) {
                stepsPreview = pElem.getAttribute('id');
            }

            let step_display = true;

            if (ansType == 'c') {
                step_display = (pElem.getAttribute('data-cdisplay')) ? true : false;
            } else if (ansType == 'u') {
                step_display = (pElem.getAttribute('data-udisplay')) ? true : false;
            }

            if (step_display) {
                DND.setStep(pElem.getAttribute('id'));
            } else {
                DND.setStep(stepsPreview);
            }
        }
    }

    if (pElem.nodeName == 'SPAN') {
        if (pElem.classList.contains('menu')) {
            if (pElem.getAttribute('data-correctans') > 0) {
                is_correct = -1;
                if (pElem.getAttribute('data-userans') > 0) {
                    pElem.setAttribute('clicked', '1');
                    is_correct = 1;
                }
            }
        } else {
            AI.setAttr(pElem, {
                sel: '0',
                class: 'off'
            });

            if (ansType == 'c' && Nmuber(pElem.getAttribute('data-correctans')) > 0) {
                AI.setAttr(pElem, {
                    sel: '1',
                    class: 'on'
                });
            }

            if (ansType == 'u') {
                is_correct = -1;
                if (Number(pElem.getAttribute('data-userans')) > 0) {
                    AI.setAttr(pElem, {
                        sel: '1',
                        class: 'on'
                    });
                }

                if (review == 1) {
                    if (Number(pElem.getAttribute('data-userans')) > 0 && Number(pElem.getAttribute('data-correctans')) > 0) {
                        is_correct = 1;
                    } else {
                        if (Number(pElem.getAttribute('data-userans')) < 1 && Number(pElem.getAttribute('data-correctans')) > 0) {
                            pElem.classList.remove('off');
                            pElem.classList.add('off');
                        }
                        if (Number(pElem.getAttribute('data-correctans')) < 1 && Number(pElem.getAttribute('data-defaultans')) < 1 && Number(pElem.getAttribute('data-userans')) < 1) {
                            is_correct = -2;
                        }
                    }
                }
            }
        }
    }

    if (AI.find(pElem, '[class*="dnd_"],.dndradio,.dndcheckbox,.dropable,.hotspot,.hotspot_test,[type="step"],[type="tab"]', 'all').length > 0) {
        let childrens = pElem.children;
        if (childrens.length > 0) {
            for (let index = 0; index < childrens.length; index++) {
                let element = childrens[index];
                if (typeof(pElem.getAttribute("type")) !== "undefined" && ["step", "tab"].includes(pElem.getAttribute("type"))) {
                    DND.showchildansdrag(dndid, element, ansType, review);
                }
                if (element.getAttribute("data-correctans") == null) element.setAttribute("data-correctans", "");
                if (element.getAttribute("data-userans") == null) element.setAttribute("data-userans", "");
                if (element.getAttribute("data-defaultans") == null) element.setAttribute("data-defaultans", "");

                // SELECT ANS SHOWING IS STARTED FROM HERE //
                if (element.nodeName == 'SELECT') {
                    is_correct = -1;
                    let total_correct = AI.find(element, "[data-correctans='1']", 'all').length;
                    let compare_index = 0;
                    let options = AI.find(element, 'option', 'all');
                    let default_value = '0';
                    element.value = '';

                    for (let sub_index = 0; sub_index < options.length; sub_index++) {
                        if (ansType == 'c') {
                            if (Number(options[sub_index].getAttribute('data-correctans')) > 0) {
                                options[sub_index].parentElement.value = options[sub_index].value;
                            }
                        } else if (ansType == 'u') {
                            if (Number(options[sub_index].getAttribute('data-userans')) > 0) {
                                options[sub_index].parentElement.value = options[sub_index].value;
                            }
                            if (options[sub_index].selected && Number(options[sub_index].getAttribute('data-correctans')) == 1) {
                                compare_index++;
                            }

                            if (Number(options[sub_index].getAttribute('data-defaultans')) > 0) {
                                default_value = options[sub_index].value;
                            }
                        }
                    }
                    if (total_correct == compare_index) {
                        is_correct = 1;
                    }

                    if (element.value.trim() == '' && AI.find(element, 'option')) {
                        element.value = default_value;
                    }
                }
                if (element.nodeName == "INPUT") {
                    is_correct = -1;
                    if (element.getAttribute('data-correctans') == "") {
                        element.getAttribute('data-correctans', "0");
                    }
                    if (element.getAttribute("type") == "radio" || element.getAttribute("type") == "checkbox") {
                        element.checked = false;
                        if (ansType == 'c') {
                            if (Number(element.getAttribute("data-correctans")) > 0) {
                                element.checked = true;
                            }
                        } else if (ansType == 'u') {
                            if (Number(element.getAttribute("data-userans")) > 0) {
                                element.checked = true;
                            }
                            if (Number(element.getAttribute('data-userans')) == Number(element.getAttribute('data-correctans'))) {
                                is_correct = 1;
                            }
                        }
                    }
                    if (element.getAttribute("type") == "text" || element.getAttribute("type") == "password") {

                        // I don't think this is needed here , NEED TO REVEIW
                        if (typeof(element.type) == "undefined") {
                            element.type = 'text';
                        }
                        if (ansType == 'c') {
                            element.value = element.getAttribute("data-correctans");
                        } else if (ansType == 'u') {
                            element.value = element.getAttribute("data-userans");
                            is_correct = DND.testText(element);
                        }
                    }
                } else if (element.nodeName == "TEXTAREA") {
                    is_correct = -1;
                    if (ansType == 'c') {
                        element.value = element.getAttribute("data-correctans");
                    } else if (ansType == 'u') {
                        element.value = element.getAttribute("data-userans");
                        is_correct = DND.testText(element);
                    }
                }
            }
        }
    }

    let anstest = false;
    if (AI.find(pElem, '.choicematrixradio', 'all').length) {
        anstest = AI.find(pElem, '.choicematrixradio').checked;
    } else if (AI.find(pElem, '.custRad', 'all').length) {
        anstest = AI.find(pElem, '.custRad').checked;
    }

    if (ansType == 'u' && review == 1) {
        if (is_correct != -2) {
            let correct_incorrect_mark = '';
            if (AI.find(pElem, '.custRad', 'all').length || AI.find(pElem, '.choicematrixradio', 'all').length) {
                if (AI.find(pElem, '.choicematrixradio')) {
                    AI.find(pElem, '.choicematrixradio').disabled = true;
                }
                if (AI.find(pElem, '.custRad')) {
                    AI.find(pElem, '.custRad').disabled = true;
                }
                correct_incorrect_mark = DND.markUserAnswerChoiceMatrix(is_correct, anstest);
            } else {
                correct_incorrect_mark = DND.markUserAnswer(is_correct);
            }
            pElem.setAttribute('as', is_correct);
            pElem.insertAdjacentHTML('beforeend', correct_incorrect_mark);
        }
    } else if (ansType == 'u' && review == 0) {
        if (AI.find(pElem, '.custRad', 'all').length || AI.find(pElem, '.choicematrixradio', 'all').length) {
            if (AI.find(pElem, '.choicematrixradio')) {
                AI.find(pElem, '.choicematrixradio').disabled = false;
            }
            if (AI.find(pElem, '.custRad')) {
                AI.find(pElem, '.custRad').disabled = false;
            }
        }
        AI.remove('.correct_incorrect_icon');
    } else {
        AI.remove('.correct_incorrect_icon');
    }
};

// function for marking correct incorrect
DND.markUserAnswer = function(is_correct) {
    let droped_value_indicator_html = '';
    if (is_correct == 1) {
        if (window.inNative) {
            droped_value_indicator_html = '<span class="icomoon-checkmark-circles" style="color:green;">';
        } else {
            droped_value_indicator_html = '<span class="icomoon-checkmark-circle" style="color:green;">';
        }
    } else {
        if (window.inNative) {
            droped_value_indicator_html = '<span class="icomoon-cancel-circles" style="color:red;">';
        } else {
            droped_value_indicator_html = '<span class="icomoon-cancel-circle" style="color:red;">';
        }
    }
    let correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:18px;height:18px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span></span>';
    return correct_incorrect_mark;
};

// function for marking choice matrix answers
DND.markUserAnswerChoiceMatrix = function(is_correct, anstest) {
    let correct_incorrect_mark = '', droped_value_indicator_html = '';
    if (is_correct == 1 && anstest == true) {
        if (window.inNative) {
            droped_value_indicator_html = '<span class="icomoon-checkmark-circles" style="color:green;">';
        } else {
            droped_value_indicator_html = '<span class="icomoon-checkmark-circle" style="color:green;">';
        }

        correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:15px;height:20px;right:-9px;top:-42px;background:white;border-radius:15px 12px 12px;font-size:17px;"> ' + droped_value_indicator_html + '</span></span>';
    } else if (is_correct != 1 && anstest == true) {
        if (window.inNative) {
            droped_value_indicator_html = '<span class="icomoon-cancel-circles" style="color:red;">';
        } else {
            droped_value_indicator_html = '<span class="icomoon-cancel-circle style="color:red;">';
        }

        correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:15px;height:15px;right:-9px;top:-42px;background:white;border-radius:15px 12px 12px;font-size:17px;"> ' + droped_value_indicator_html + '</span></span>';
    }
    return correct_incorrect_mark;
};
// function for cheking module answers
DND.checkAns = function(dndid) {
    let userAnsXML = "<smans type='15'>\n";
    result = true;
    user_points = 0;
    is_all_correct = true;
    let dnd_element = AI.select(dndid);
    let dnd_test = AI.find(dnd_element, '.dndTest', 'all');

    for (let index = 0; index < dnd_test.length; index++) {
        userAnsXML = DND.checkChildAnswer(dndid, dnd_test[index], userAnsXML);
    }
    userAnsXML += "</smans>";

    result = is_all_correct;
    if (window.inNative) {
        if (typeof window.getHeight == "function") {
            window.getHeight();
        }
    }
    DND.calculatePoint(dnd_element.getAttribute('totalcorrectans'), user_points);

    if (window.inNative) {
        window.postMessage(JSON.stringify({
            userAnswers: userAnsXML,
            inNativeIsCorrect: result
        }), '*');
    }
    return {uXml: userAnsXML, ans: result};
};

// function for changing the user and ans points
DND.calculatePoint = function(answer_points, user_points) {
    AI.select('#answer_points', 'value', answer_points);
    AI.select('#user_points', 'value', user_points);
};

// function for cheking module by traversing the child
DND.checkChildAnswer = function(dndid, pElem, userAnsXML) {
    let dnd_element = AI.select(dndid);

    if (pElem.classList.contains('hotspot_test')) {
        let hs_item = AI.find(pElem, '.hs_item', 'all');
        let result_array = [];
        for (let index = 0; index < hs_item.length; index++) {
            if (hs_item[index].getAttribute('data-correctans') == '0') {
                result_array.push(0);
            } else {
                result_array.push(1);
                user_points++;
            }
        }
        result = !(result_array.includes(0));
        userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute('data-userans') + "'></div>\n";
    } else if (pElem.classList.contains('dropable')) {
        let ansKey = pElem.getAttribute('data-anskey').split(',');

        if (pElem.getAttribute("name") == '' && !ansKey.includes(pElem.getAttribute("data-userans"))) {
            result = false;
        } else if (typeof(pElem.getAttribute("name")) !== "undefined" && pElem.getAttribute("name") != "") {
            let userans = [];
            let dnd_element_dropable = AI.find(dnd_element, '.dropable[name="' + pElem.getAttribute("name") + '"]', 'all');
            for (let index = 0; index < dnd_element_dropable.length; index++) {
                if (typeof(dnd_element_dropable[index].getAttribute('data-userans')) != "undefined" && dnd_element_dropable[index].getAttribute('data-userans') != "") {
                    userans.push(dnd_element_dropable[index].getAttribute('data-userans'));
                }
            }
            if (DND.compareArray(ansKey, userans) != 0) {
                result = false;
            } else {
                user_points++;
            }
        } else {
            user_points++;
        }
        userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute('data-userans') + "'></div>\n";
    } else if (pElem.classList.contains('menulist') && !pElem.classList.contains("menu")) {
        if (pElem.getAttribute('data-correctans') != pElem.getAttribute('sel')) {
            result = false;
        } else {
            user_points++;
        }
        userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute("sel") + "'></div>\n";
    } else if (pElem.classList.contains("record")) {
        if (pElem.getAttribute("clicked") == null || pElem.getAttribute("clicked") == '') {
            pElem.setAttribute("clicked", "0");
        }
        if (Number(pElem.getAttribute('clicked')) != 1) {
            result = false;
        } else {
            user_points++;
        }
        userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute("clicked") + "'></div>\n";
    } else if (AI.find(pElem, '[class*="dnd_"],.dndradio,.dndcheckbox,.dropable,.record,.hotspot_test,[type="step"],[type="tab"]', 'all').length > 0) {
        let disabledstring = "";
        let childrens = pElem.children;
        for (let index = 0; index < childrens.length; index++) {
            let current_element = childrens[index];
            if (typeof(pElem.getAttribute('type')) != 'undefined' && ['step', 'tab'].includes(pElem.getAttribute('type'))) {
                userAnsXML = DND.checkChildAnswer(dndid, current_element, userAnsXML);
            }
            if (current_element.getAttribute("data-correctans") == null) current_element.setAttribute("data-correctans", "");
            if (current_element.getAttribute("data-userans") == null) current_element.setAttribute("data-userans", "");
            if (current_element.getAttribute("data-defaultans") == null) current_element.setAttribute("data-defaultans", "");
            if (current_element.disabled) disabledstring = " udisabled='1'";

            if (current_element.nodeName == "SELECT") {
                let uAnsSel = "";
                let compare_index = 0;
                let totalcorrect = AI.find(current_element, "[data-correctans='1']", 'all').length;
                let options = AI.find(current_element, 'option', 'all');
                for (let sub_index = 0; sub_index < options.length; sub_index++) {
                    if (options[sub_index].selected) {
                        compare_index++;
                        if (Number(options[sub_index].getAttribute("data-correctans")) != 1) {
                            result = false;
                        } else {
                            user_points++;
                        }
                        uAnsSel = uAnsSel + (sub_index + 1) + ",";
                    }
                }
                if (compare_index != totalcorrect) result = false;
                userAnsXML += '<div id="' + current_element.parentElement.getAttribute("id") + '" userAns="' + uAnsSel + '" ' + disabledstring + '></div>\n';
            } else if (current_element.nodeName == 'INPUT') {
                if (current_element.getAttribute('type') == 'radio' || current_element.getAttribute('type') == 'checkbox') {
                    if ((Number(current_element.getAttribute("data-correctans")) == 1 && !current_element.checked) || ((Number(current_element.getAttribute("data-correctans")) != 1 && current_element.checked))) {
                        result = false;
                    } else {
                        user_points++;
                    }

                    if (current_element.checked) {
                        userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='1' " + disabledstring + "></div>\n";
                    } else {
                        userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='0' " + disabledstring + "></div>\n";
                    }
                } else if (current_element.getAttribute('type') == 'text' || current_element.getAttribute('type') == 'password') {
                    let correctansarray = [];
                    let givenanswer;
                    if (Number(current_element.getAttribute("data-ismultipleanswer")) == 1) {
                        correctansarray = current_element.getAttribute("data-correctans").split(",");
                    }
                    correctansarray.push(current_element.getAttribute("data-correctans"));

                    if (Number(current_element.getAttribute('data-nocase')) == 1) {
                        correctansarray = correctansarray.map(function(values) {
                            return values.toLowerCase();
                        });
                        givenanswer = current_element.value.toLowerCase();
                    } else {
                        givenanswer = current_element.value;
                    }

                    if (correctansarray.indexOf(givenanswer) < 0) {
                        result = false;
                    } else {
                        user_points++;
                    }
                    userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='" + current_element.value + "' " + disabledstring + "></div>\n";
                }
            } else if (current_element.nodeName == 'BUTTON') {
                if (typeof(current_element.getAttribute("data-userans")) !== "undefined") {
                    userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='" + current_element.getAttribute("data-userans") + "' " + disabledstring + "></div>\n";
                }
            } else if (current_element.nodeName == 'TEXTAREA') {
                let parser = ((current_element.getAttribute('data-parser')) ? current_element.getAttribute('data-parser').trim() : "");
                if (parser != '') {
                    let correct_val = current_element.getAttribute("data-correctans").sqlparser(true);
                    let text_val = current_element.value.replace(/"/g, "'");
                    text_val = text_val.sqlparser();
                    if (DND.compareArray(correct_val['sql'], text_val['sql']) == 0) {
                        if (correct_val['mustbeone'].length > 0) {
                            for (let sub_index = 0; sub_index < correct_val['mustbeone'].length; sub_index++) {
                                if (DND.compareArray(correct_val['mustbeone'][sub_index], text_val['sql']).length >= correct_val['mustbeone'][sub_index].length) {
                                    result = false;
                                }
                            }
                        }
                    } else {
                        result = false;
                    }
                } else {
                    let correctansarray = [];
                    let givenanswer;
                    if (Number(current_element.getAttribute("data-ismultipleanswer")) == 1) {
                        correctansarray = current_element.getAttribute("data-correctans").split(",");
                    }
                    correctansarray.push(current_element.getAttribute("data-correctans"));
                    if (Number(current_element.getAttribute('data-nocase')) == 1) {
                        correctansarray = correctansarray.map(function(values) {
                            return values.toLowerCase();
                        });
                        givenanswer = current_element.value.toLowerCase();
                    } else {
                        givenanswer = current_element.value;
                    }
                    if (correctansarray.indexOf(givenanswer) < 0) {
                        result = false;
                    } else {
                        user_points++;
                    }
                }
                userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='" + current_element.value + "' " + disabledstring + "></div>\n";
            }
        }
    }

    if (result == false) {
        is_all_correct = false;
    }
    return userAnsXML;
};

// function for areaToggle
DND.areaToggle = function(obj) {
    if (obj.classList.contains('off')) {
        AI.setAttr(AI.select(obj), {
            "sel": "1",
            "class": "on"
        });
    } else {
        AI.setAttr(AI.select(obj), {
            "sel": "0",
            "class": "off"
        });
    }
};

// function for checking the sql text
DND.testText = function(element) {
    let is_correct = -1,
        parser = ((element.getAttribute('data-parser')) ? element.getAttribute('data-parser').trim() : ""),
        correct_val = element.getAttribute("data-correctans"),
        text_val = element.value.replace(/"/g, "'").trim();
    let correctansarray = [];
    let givenanswer;
    if (parser != "") {
        correct_val = correct_val.sqlparser(true);
        text_val = text_val.sqlparser();
        if (DND.compareArray(correct_val['sql'], text_val['sql']) == 0) {
            is_correct = 1;
        }
    } else {
        if (Number(element.getAttribute("data-ismultipleanswer")) == 1) {
            correctansarray = element.getAttribute("data-correctans").split(",");
        }
        correctansarray.push(element.getAttribute("data-correctans"));

        if (Number(element.getAttribute('data-nocase')) == 1) {
            correctansarray = correctansarray.map(function(v) {
                return v.toLowerCase();
            });
            givenanswer = element.value.toLowerCase();
        } else {
            givenanswer = element.value;
        }
        if (correctansarray.indexOf(givenanswer) > -1) {
            is_correct = 1;
        }
    }
    return is_correct;
};

// function for comparing the array and return if the parent one is not in child one
DND.compareArray = function(tree, branch) {
    let matchedBranch = [];
    for (let i = 0; i < tree.length; i++) {
        for (let j = 0; j < branch.length; j++) {
            if (branch[j] == tree[i]) {
                matchedBranch.push(branch[j]);
                continue;
            }
        }
    }
    let result = (tree.length - matchedBranch.length);
    return result < 0 ? 0 : result;
};

// function call whenever the the review mode is changes
DND.modeOn = function(modeType) {
    AI.selectAll('.test', 'addClass', 'h');
    AI.selectAll('.review', 'addClass', 'h');

    if (modeType) {
        AI.selectAll('.review', 'removeClass', 'h');

        if (typeof(hotkeys) == 'function') {
            hotkeys.unbind('alt+down,down,up,left,right,enter,delete', 'dragndrop');
        }

        DND.unBindLab();
        DND.showansdrag(elemId, 'u', 1);
        AI.setCss('#sm_controller', {
            display: 'block',
        });
        AI.selectAll('#sm_controller button', 'removeClass', 'active');
        AI.addClass('#sm_controller .your-ans', 'active');
    } else {
        AI.selectAll('.test', 'removeClass', 'h');
        DND.bindKeyUp(elemId);
        AI.setCss('#sm_controller', {
            display: 'none',
        });
        DND.bindLab();
        DND.showansdrag(elemId, 'u');
    }
};

// function for unbinding the events
DND.unBindLab = function() {
    let element = AI.select(elemId);
    let select_elements = AI.find(element, 'select,input,textarea', 'all');

    for (let index = 0; index < select_elements.length; index++) {
        if (select_elements[index].nodeName == 'INPUT') {
            let input_type = select_elements[index].getAttribute('type');
            if (input_type == 'text' || input_type == 'password') {
                select_elements[index].setAttribute('data-userans', select_elements[index].value);
            } else if (input_type == 'radio' || input_type == 'checkbox') {
                select_elements[index].setAttribute('data-userans', (select_elements[index].checked) ? 1 : 0);
            }
        } else if (select_elements[index].nodeName == 'SELECT') {
            let options = AI.find(select_elements[index], 'option', 'all');
            for (let opt_index = 0; opt_index < options.length; opt_index++) {
                options[opt_index].setAttribute('data-userans', (options[opt_index].selected) ? 1 : 0);
            }
        } else if (select_elements[index].nodeName == 'TEXTAREA') {
            select_elements[index].setAttribute('data-userans', select_elements[index].value);
        }
        select_elements[index].style.pointerEvents = 'none';
    }
    AI.find(elemId, '.dragable, .dropable, .hotspot_test, .tmpTarget, .record,  [data-droped*=dndID]', {
        action: 'addClass',
        actionData: 'lab_disable'
    });

    AI.find(element, '.hs_item', {
        action: 'addClass',
        actionData: 'ajax_hs_item'
    });

};

// function for binding the events
DND.bindLab = function() {
    let element = AI.select(elemId);
    let select_items = AI.find(element, 'select,input,textarea', 'all');

    AI.find(element, '.hs_item', {
        action: 'removeClass',
        actionData: 'ajax_hs_item'
    });

    AI.find(elemId, '.dragable, .dropable, .hotspot_test, .tmpTarget, .record,  [data-droped*=dndID]', {
        action: 'removeClass',
        actionData: 'lab_disable'
    });

    if (select_items) {
        for (let index = 0; index < select_items.length; index++) {
            select_items[index].style.pointerEvents = 'all';
        }
    }

    DND.readyThis(elemId);
};

// function for textbox alingment setting
DND.textBoxAlignment = function(element) {
    element.style.textAlign = (!isNaN(element.value)) ? 'center' : 'left';
};

// funciton for cleartext
DND.clearText = function(id) {
    try {
        let element = AI.select(elemId);
        let find_element = AI.find(element, '.dnd' + id, 'all');

        if (find_element) {
            for (let index = 0; index < find_element.length; index++) {
                find_element[index].value = '';
            }
        }
    } catch (err) {
        console.warn("ID does not exist for clearing text ", err);
    }
};


// function calling on the window load
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", function() {
        let dnd_textbox = AI.selectAll('.dnd_textbox');
        for (let index = 0; index < dnd_textbox.length; index++) {
            DND.textBoxAlignment(dnd_textbox[index]);
        }
        AI.listen('body', 'change', '.dnd_textbox', function(_this) {
            DND.textBoxAlignment(_this);
        });
    });
}

/* clsSMDragNDrop\libs\preview\TextboxPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1 } = globals;
const file = "clsSMDragNDrop\\libs\\preview\\TextboxPreview.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (85:4) {#if textbox_data && textbox_data.length > 0}
function create_if_block(ctx) {
	let each_1_anchor;
	let each_value = /*textbox_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*textbox_data*/ 1) {
				each_value = /*textbox_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(85:4) {#if textbox_data && textbox_data.length > 0}",
		ctx
	});

	return block;
}

// (86:8) {#each textbox_data as data, index}
function create_each_block(ctx) {
	let div;
	let input;
	let input_type_value;
	let input_class_value;
	let input_data_correctans_value;
	let input_data_userans_value;
	let input_data_defaultans_value;
	let input_placeholder_value;
	let input_data_nocase_value;
	let input_data_ismultipleanswer_value;
	let t;
	let div_key_value;
	let div_id_value;

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			t = space();
			attr_dev(input, "type", input_type_value = /*data*/ ctx[5]._type);
			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5]._id + " dnd_textbox " + /*data*/ ctx[5]._custom_class);
			attr_dev(input, "name", "");

			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5]._correctans
			? /*data*/ ctx[5]._correctans
			: '');

			attr_dev(input, "data-userans", input_data_userans_value = /*data*/ ctx[5]._userans ? /*data*/ ctx[5]._userans : "");
			attr_dev(input, "data-udisplay", "");
			attr_dev(input, "data-udisabled", "");

			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5]._defaultans
			? /*data*/ ctx[5]._defaultans
			: "");

			attr_dev(input, "placeholder", input_placeholder_value = /*data*/ ctx[5]._placeholder
			? /*data*/ ctx[5]._placeholder
			: "");

			attr_dev(input, "data-nocase", input_data_nocase_value = /*data*/ ctx[5]._nocase ? /*data*/ ctx[5]._nocase : "");

			attr_dev(input, "data-ismultipleanswer", input_data_ismultipleanswer_value = /*data*/ ctx[5]._ismultipleanswer
			? /*data*/ ctx[5]._ismultipleanswer
			: "");

			add_location(input, file, 98, 20, 3708);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5]._id);
			attr_dev(div, "class", "drag-resize dndTest");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[5]._top + "px");
			set_style(div, "left", /*data*/ ctx[5]._left + "px");
			set_style(div, "height", /*data*/ ctx[5]._height + "px");
			set_style(div, "width", /*data*/ ctx[5]._width + "px");
			add_location(div, file, 86, 16, 3246);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*textbox_data*/ 1 && input_type_value !== (input_type_value = /*data*/ ctx[5]._type)) {
				attr_dev(input, "type", input_type_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5]._id + " dnd_textbox " + /*data*/ ctx[5]._custom_class)) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5]._correctans
			? /*data*/ ctx[5]._correctans
			: '')) {
				attr_dev(input, "data-correctans", input_data_correctans_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_data_userans_value !== (input_data_userans_value = /*data*/ ctx[5]._userans ? /*data*/ ctx[5]._userans : "")) {
				attr_dev(input, "data-userans", input_data_userans_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5]._defaultans
			? /*data*/ ctx[5]._defaultans
			: "")) {
				attr_dev(input, "data-defaultans", input_data_defaultans_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_placeholder_value !== (input_placeholder_value = /*data*/ ctx[5]._placeholder
			? /*data*/ ctx[5]._placeholder
			: "")) {
				attr_dev(input, "placeholder", input_placeholder_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_data_nocase_value !== (input_data_nocase_value = /*data*/ ctx[5]._nocase ? /*data*/ ctx[5]._nocase : "")) {
				attr_dev(input, "data-nocase", input_data_nocase_value);
			}

			if (dirty & /*textbox_data*/ 1 && input_data_ismultipleanswer_value !== (input_data_ismultipleanswer_value = /*data*/ ctx[5]._ismultipleanswer
			? /*data*/ ctx[5]._ismultipleanswer
			: "")) {
				attr_dev(input, "data-ismultipleanswer", input_data_ismultipleanswer_value);
			}

			if (dirty & /*textbox_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*textbox_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[5]._top + "px");
			}

			if (dirty & /*textbox_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[5]._left + "px");
			}

			if (dirty & /*textbox_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[5]._height + "px");
			}

			if (dirty & /*textbox_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[5]._width + "px");
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
		source: "(86:8) {#each textbox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div;
	let if_block = /*textbox_data*/ ctx[0] && /*textbox_data*/ ctx[0].length > 0 && create_if_block(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file, 83, 0, 3127);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*textbox_data*/ ctx[0] && /*textbox_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
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

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TextboxPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let { uxml = '' } = $$props;
	let textbox_data = [];
	let textbox = modules;

	afterUpdate(() => {
		if (textbox_data.length > 0 && containerID != '') {
			textbox.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID', 'uxml'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextboxPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		XMLToJSON,
		afterUpdate,
		modules,
		containerID,
		uxml,
		textbox_data,
		textbox
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('textbox_data' in $$props) $$invalidate(0, textbox_data = $$props.textbox_data);
		if ('textbox' in $$props) $$invalidate(4, textbox = $$props.textbox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, textbox, uxml, textbox_data*/ 27) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, textbox = []);
					$$invalidate(4, textbox[0] = modules, textbox);
				} else {
					$$invalidate(4, textbox = modules);
				}

				$$invalidate(0, textbox_data = []);

				textbox.map(function (data) {
					if (uxml != '') {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					$$invalidate(0, textbox_data = [...textbox_data, data]);
				});
			} else {
				$$invalidate(0, textbox_data = []);
			}
		}
	};

	return [textbox_data, modules, containerID, uxml, textbox];
}

class TextboxPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TextboxPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<TextboxPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<TextboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<TextboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<TextboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<TextboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<TextboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<TextboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\DragPreview.svelte generated by Svelte v3.40.2 */

const file$1 = "clsSMDragNDrop\\libs\\preview\\DragPreview.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (83:4) {#if drag_value && drag_value.length > 0}
function create_if_block$1(ctx) {
	let each_1_anchor;
	let each_value = /*drag_value*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drag_value, window*/ 1) {
				each_value = /*drag_value*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(83:4) {#if drag_value && drag_value.length > 0}",
		ctx
	});

	return block;
}

// (112:19) {#if data.value}
function create_if_block_1(ctx) {
	let html_tag;
	let raw_value = /*data*/ ctx[4].value + "";
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
			if (dirty & /*drag_value*/ 1 && raw_value !== (raw_value = /*data*/ ctx[4].value + "")) html_tag.p(raw_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(html_anchor);
			if (detaching) html_tag.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(112:19) {#if data.value}",
		ctx
	});

	return block;
}

// (84:8) {#each drag_value as data, index}
function create_each_block$1(ctx) {
	let div;
	let p;
	let t;
	let div_key_value;
	let div_id_value;
	let div_data_caption_value;
	let div_data_bgcolor_value;
	let div_data_multi_drag_value;
	let div_data_dragimage_value;
	let div_data_dropimage_value;
	let div_data_bgimage_value;
	let div_data_path_value;
	let if_block = /*data*/ ctx[4].value && create_if_block_1(ctx);

	const block = {
		c: function create() {
			div = element("div");
			p = element("p");
			if (if_block) if_block.c();
			t = space();
			add_location(p, file$1, 111, 16, 3618);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[4].id);
			attr_dev(div, "draging", "1");
			attr_dev(div, "name", "");
			attr_dev(div, "class", "drag-resize dragable ui-draggable dndTest");
			attr_dev(div, "data-caption", div_data_caption_value = /*data*/ ctx[4].caption);
			attr_dev(div, "data-bgcolor", div_data_bgcolor_value = /*data*/ ctx[4].bgcolor);
			attr_dev(div, "data-multi_drag", div_data_multi_drag_value = /*data*/ ctx[4].multi_drag);
			attr_dev(div, "data-dragimage", div_data_dragimage_value = /*data*/ ctx[4].dragimage);
			attr_dev(div, "data-dropimage", div_data_dropimage_value = /*data*/ ctx[4].dropimage);
			attr_dev(div, "data-bgimage", div_data_bgimage_value = /*data*/ ctx[4].bgimage);
			attr_dev(div, "data-detail", "");
			attr_dev(div, "tabindex", "0");

			attr_dev(div, "data-path", div_data_path_value = window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/");

			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[4].top);
			set_style(div, "left", /*data*/ ctx[4].left);
			set_style(div, "height", /*data*/ ctx[4].height);
			set_style(div, "width", /*data*/ ctx[4].width);
			set_style(div, "border", /*data*/ ctx[4].border);
			set_style(div, "background-color", /*data*/ ctx[4].backgroundColor);
			set_style(div, "background-image", /*data*/ ctx[4].backgroundImage);
			attr_dev(div, "aria-disabled", "false");
			add_location(div, file$1, 84, 12, 2441);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, p);
			if (if_block) if_block.m(p, null);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[4].value) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(p, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*drag_value*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[4].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*drag_value*/ 1 && div_data_caption_value !== (div_data_caption_value = /*data*/ ctx[4].caption)) {
				attr_dev(div, "data-caption", div_data_caption_value);
			}

			if (dirty & /*drag_value*/ 1 && div_data_bgcolor_value !== (div_data_bgcolor_value = /*data*/ ctx[4].bgcolor)) {
				attr_dev(div, "data-bgcolor", div_data_bgcolor_value);
			}

			if (dirty & /*drag_value*/ 1 && div_data_multi_drag_value !== (div_data_multi_drag_value = /*data*/ ctx[4].multi_drag)) {
				attr_dev(div, "data-multi_drag", div_data_multi_drag_value);
			}

			if (dirty & /*drag_value*/ 1 && div_data_dragimage_value !== (div_data_dragimage_value = /*data*/ ctx[4].dragimage)) {
				attr_dev(div, "data-dragimage", div_data_dragimage_value);
			}

			if (dirty & /*drag_value*/ 1 && div_data_dropimage_value !== (div_data_dropimage_value = /*data*/ ctx[4].dropimage)) {
				attr_dev(div, "data-dropimage", div_data_dropimage_value);
			}

			if (dirty & /*drag_value*/ 1 && div_data_bgimage_value !== (div_data_bgimage_value = /*data*/ ctx[4].bgimage)) {
				attr_dev(div, "data-bgimage", div_data_bgimage_value);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "top", /*data*/ ctx[4].top);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "left", /*data*/ ctx[4].left);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "height", /*data*/ ctx[4].height);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "width", /*data*/ ctx[4].width);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "border", /*data*/ ctx[4].border);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "background-color", /*data*/ ctx[4].backgroundColor);
			}

			if (dirty & /*drag_value*/ 1) {
				set_style(div, "background-image", /*data*/ ctx[4].backgroundImage);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(84:8) {#each drag_value as data, index}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div;
	let if_block = /*drag_value*/ ctx[0] && /*drag_value*/ ctx[0].length > 0 && create_if_block$1(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$1, 81, 0, 2332);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*drag_value*/ ctx[0] && /*drag_value*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function validColor(_bgcolor, _invisible) {
	if (_invisible == "1") {
		return "";
	} else if (_bgcolor) {
		return _bgcolor;
	} else {
		return "#CCFFCC";
	}
}

function validBorderColor(_bordercolor) {
	if (_bordercolor) {
		return "1px solid " + _bordercolor;
	} else {
		return "";
	}
}

function bgImage(img) {
	if (img) {
		let str = img.split(',')[0];

		return (window.inNative
		? "https://s3.amazonaws.com/jigyaasa_content_static/"
		: "https://s3.amazonaws.com/jigyaasa_content_static/") + str;
	} else {
		return "";
	}
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DragPreview', slots, []);
	let { modules } = $$props;
	let drag = modules;
	let drag_value = [];

	// for initializing the drag
	function init() {
		if (Array.isArray(modules) == false) {
			drag = [];
			drag[0] = modules;
		} else {
			drag = modules;
		}

		$$invalidate(0, drag_value = []);

		drag.map(function (data) {
			$$invalidate(0, drag_value = [
				...drag_value,
				{
					id: "dnd" + data._id,
					caption: data._value,
					bgcolor: validColor(data._bgcolor, data._invisible),
					multi_drag: data._multi_drag,
					dragimage: data._image ? data._image.split(',')[1] : "",
					dropimage: data._image ? data._image.split(',')[2] : "",
					bgimage: data._image ? data._image.split(',')[0] : "",
					top: data._top + "px",
					left: data._left + "px",
					height: data._height + "px",
					width: data._width + "px",
					border: validBorderColor(data._border_color),
					backgroundColor: validColor(data._bgcolor, data._invisible),
					backgroundImage: data._image
					? "url('" + bgImage(data._image) + "')"
					: "none",
					value: data._value
				}
			]);
		});
	}

	const writable_props = ['modules'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DragPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
	};

	$$self.$capture_state = () => ({
		modules,
		drag,
		drag_value,
		init,
		validColor,
		validBorderColor,
		bgImage
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('drag' in $$props) drag = $$props.drag;
		if ('drag_value' in $$props) $$invalidate(0, drag_value = $$props.drag_value);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 2) {
			 if (modules) {
				init();
			} else {
				$$invalidate(0, drag_value = []);
			}
		}
	};

	return [drag_value, modules];
}

class DragPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { modules: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DragPreview",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<DragPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<DragPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<DragPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\DropPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$1 } = globals;
const file$2 = "clsSMDragNDrop\\libs\\preview\\DropPreview.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (135:4) {#if drop_data && drop_data.length > 0}
function create_if_block$2(ctx) {
	let each_1_anchor;
	let each_value = /*drop_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drop_data, window*/ 1) {
				each_value = /*drop_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(135:4) {#if drop_data && drop_data.length > 0}",
		ctx
	});

	return block;
}

// (136:8) {#each drop_data as data, index}
function create_each_block$2(ctx) {
	let div;
	let p;
	let t;
	let div_key_value;
	let div_id_value;
	let div_data_anskey_value;
	let div_data_caption_value;
	let div_data_userans_value;
	let div_data_droped_value;
	let div_data_bgcolor_value;
	let div_data_path_value;
	let div_droping_value;

	const block = {
		c: function create() {
			div = element("div");
			p = element("p");
			t = space();
			add_location(p, file$2, 161, 16, 5781);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[5].id);
			attr_dev(div, "name", "");
			attr_dev(div, "tabindex", "0");
			attr_dev(div, "data-anskey", div_data_anskey_value = /*data*/ ctx[5].anskey);
			attr_dev(div, "data-caption", div_data_caption_value = /*data*/ ctx[5].caption);
			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[5].userans);
			attr_dev(div, "data-droped", div_data_droped_value = /*data*/ ctx[5].droped);
			attr_dev(div, "data-bgcolor", div_data_bgcolor_value = /*data*/ ctx[5].bgcolor);

			attr_dev(div, "data-path", div_data_path_value = window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/");

			attr_dev(div, "data-dragimage", "");
			attr_dev(div, "data-dropimage", "");
			attr_dev(div, "data-bgimage", "");
			attr_dev(div, "class", "drag-resize dropable ui-droppable dndTest");
			attr_dev(div, "droping", div_droping_value = /*data*/ ctx[5].userans ? '2' : '1');
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[5].top);
			set_style(div, "left", /*data*/ ctx[5].left);
			set_style(div, "height", /*data*/ ctx[5].height);
			set_style(div, "width", /*data*/ ctx[5].width);
			set_style(div, "border", /*data*/ ctx[5].border);
			add_location(div, file$2, 136, 12, 4737);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, p);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drop_data*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[5].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*drop_data*/ 1 && div_data_anskey_value !== (div_data_anskey_value = /*data*/ ctx[5].anskey)) {
				attr_dev(div, "data-anskey", div_data_anskey_value);
			}

			if (dirty & /*drop_data*/ 1 && div_data_caption_value !== (div_data_caption_value = /*data*/ ctx[5].caption)) {
				attr_dev(div, "data-caption", div_data_caption_value);
			}

			if (dirty & /*drop_data*/ 1 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[5].userans)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}

			if (dirty & /*drop_data*/ 1 && div_data_droped_value !== (div_data_droped_value = /*data*/ ctx[5].droped)) {
				attr_dev(div, "data-droped", div_data_droped_value);
			}

			if (dirty & /*drop_data*/ 1 && div_data_bgcolor_value !== (div_data_bgcolor_value = /*data*/ ctx[5].bgcolor)) {
				attr_dev(div, "data-bgcolor", div_data_bgcolor_value);
			}

			if (dirty & /*drop_data*/ 1 && div_droping_value !== (div_droping_value = /*data*/ ctx[5].userans ? '2' : '1')) {
				attr_dev(div, "droping", div_droping_value);
			}

			if (dirty & /*drop_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[5].top);
			}

			if (dirty & /*drop_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[5].left);
			}

			if (dirty & /*drop_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[5].height);
			}

			if (dirty & /*drop_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[5].width);
			}

			if (dirty & /*drop_data*/ 1) {
				set_style(div, "border", /*data*/ ctx[5].border);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(136:8) {#each drop_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div;
	let if_block = /*drop_data*/ ctx[0] && /*drop_data*/ ctx[0].length > 0 && create_if_block$2(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$2, 133, 0, 4631);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*drop_data*/ ctx[0] && /*drop_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function validColor$1(_bgcolor, _invisible) {
	if (_invisible == "1") {
		return "";
	} else if (_bgcolor) {
		return _bgcolor;
	} else {
		return "#FFFFCC";
	}
}

function validBorderColor$1(_bordercolor) {
	if (_bordercolor) {
		return "1px solid " + _bordercolor;
	} else {
		return "";
	}
}

function setUserAns(uans, defaultans) {
	if (uans) {
		return uans;
	} else if (defaultans) {
		return defaultans;
	} else {
		return "";
	}
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DropPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let { uxml = '' } = $$props;
	let dropPreview = modules;
	let drop_data = [];

	afterUpdate(() => {
		if (dropPreview && drop_data.length > 0 && containerID != '') {
			dropPreview.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll("#dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll("#dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID', 'uxml'];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DropPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		XMLToJSON,
		afterUpdate,
		modules,
		containerID,
		uxml,
		dropPreview,
		drop_data,
		validColor: validColor$1,
		validBorderColor: validBorderColor$1,
		setUserAns
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('dropPreview' in $$props) $$invalidate(4, dropPreview = $$props.dropPreview);
		if ('drop_data' in $$props) $$invalidate(0, drop_data = $$props.drop_data);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, dropPreview, uxml, drop_data*/ 27) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, dropPreview = []);
					$$invalidate(4, dropPreview[0] = modules, dropPreview);
				} else {
					$$invalidate(4, dropPreview = modules);
				}

				$$invalidate(0, drop_data = []);

				dropPreview.map(function (data) {
					let ansKey = "";

					if (data._anskey) {
						let allAnsKey = data._anskey.split(",");

						allAnsKey.forEach(function (value) {
							ansKey += "dnd" + value + ",";
						});

						ansKey = ansKey.slice(0, -1);
					}

					if (uxml != '') {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					$$invalidate(0, drop_data = [
						...drop_data,
						{
							id: "dnd" + data._id,
							anskey: data._anskey ? ansKey : "",
							caption: data._value,
							userans: setUserAns(data._userans, data._defaultans),
							droped: setUserAns(data._userans, data._defaultans),
							bgcolor: validColor$1(data._bgcolor, data._invisible),
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							border: validBorderColor$1(data._border)
						}
					]);
				});
			} else {
				$$invalidate(4, dropPreview = []);
				$$invalidate(0, drop_data = []);
			}
		}
	};

	return [drop_data, modules, containerID, uxml, dropPreview];
}

class DropPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DropPreview",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<DropPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<DropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<DropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<DropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<DropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<DropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<DropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\SelectPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$2 } = globals;
const file$3 = "clsSMDragNDrop\\libs\\preview\\SelectPreview.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (131:4) {#if select_data && select_data.length > 0}
function create_if_block$3(ctx) {
	let each_1_anchor;
	let each_value = /*select_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 1) {
				each_value = /*select_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(131:4) {#if select_data && select_data.length > 0}",
		ctx
	});

	return block;
}

// (164:20) {:else}
function create_else_block_1(ctx) {
	let option;

	const block = {
		c: function create() {
			option = element("option");
			option.textContent = "Please Select";
			option.__value = "Please Select";
			option.value = option.__value;
			add_location(option, file$3, 164, 24, 6733);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(164:20) {:else}",
		ctx
	});

	return block;
}

// (156:20) {#if data.select.length}
function create_if_block_1$1(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[6].select;
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 1) {
				each_value_1 = /*data*/ ctx[6].select;
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(156:20) {#if data.select.length}",
		ctx
	});

	return block;
}

// (160:28) {:else}
function create_else_block(ctx) {
	let option;
	let t_value = /*option*/ ctx[9].text + "";
	let t;
	let option_key_value;
	let option_data_correctans_value;
	let option_data_defaultans_value;
	let option_data_userans_value;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			attr_dev(option, "key", option_key_value = /*option*/ ctx[9].key);
			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[9].correctans);
			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[9].defaultans);
			attr_dev(option, "data-userans", option_data_userans_value = /*option*/ ctx[9].userans);
			option.__value = option_value_value = /*option*/ ctx[9].key + 1;
			option.value = option.__value;
			add_location(option, file$3, 160, 32, 6438);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 1 && t_value !== (t_value = /*option*/ ctx[9].text + "")) set_data_dev(t, t_value);

			if (dirty & /*select_data*/ 1 && option_key_value !== (option_key_value = /*option*/ ctx[9].key)) {
				attr_dev(option, "key", option_key_value);
			}

			if (dirty & /*select_data*/ 1 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[9].correctans)) {
				attr_dev(option, "data-correctans", option_data_correctans_value);
			}

			if (dirty & /*select_data*/ 1 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[9].defaultans)) {
				attr_dev(option, "data-defaultans", option_data_defaultans_value);
			}

			if (dirty & /*select_data*/ 1 && option_data_userans_value !== (option_data_userans_value = /*option*/ ctx[9].userans)) {
				attr_dev(option, "data-userans", option_data_userans_value);
			}

			if (dirty & /*select_data*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[9].key + 1)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(160:28) {:else}",
		ctx
	});

	return block;
}

// (158:28) {#if option.selected == 1}
function create_if_block_2(ctx) {
	let option;
	let t_value = /*option*/ ctx[9].text + "";
	let t;
	let option_key_value;
	let option_data_correctans_value;
	let option_data_defaultans_value;
	let option_data_userans_value;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.selected = "selected";
			attr_dev(option, "key", option_key_value = /*option*/ ctx[9].key);
			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[9].correctans);
			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[9].defaultans);
			attr_dev(option, "data-userans", option_data_userans_value = /*option*/ ctx[9].userans);
			option.__value = option_value_value = /*option*/ ctx[9].key + 1;
			option.value = option.__value;
			add_location(option, file$3, 158, 32, 6175);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 1 && t_value !== (t_value = /*option*/ ctx[9].text + "")) set_data_dev(t, t_value);

			if (dirty & /*select_data*/ 1 && option_key_value !== (option_key_value = /*option*/ ctx[9].key)) {
				attr_dev(option, "key", option_key_value);
			}

			if (dirty & /*select_data*/ 1 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[9].correctans)) {
				attr_dev(option, "data-correctans", option_data_correctans_value);
			}

			if (dirty & /*select_data*/ 1 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[9].defaultans)) {
				attr_dev(option, "data-defaultans", option_data_defaultans_value);
			}

			if (dirty & /*select_data*/ 1 && option_data_userans_value !== (option_data_userans_value = /*option*/ ctx[9].userans)) {
				attr_dev(option, "data-userans", option_data_userans_value);
			}

			if (dirty & /*select_data*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[9].key + 1)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(158:28) {#if option.selected == 1}",
		ctx
	});

	return block;
}

// (157:24) {#each data.select as option}
function create_each_block_1(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*option*/ ctx[9].selected == 1) return create_if_block_2;
		return create_else_block;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d: function destroy(detaching) {
			if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(157:24) {#each data.select as option}",
		ctx
	});

	return block;
}

// (132:8) {#each select_data as data, index}
function create_each_block$3(ctx) {
	let div;
	let select_1;
	let select_1_class_value;
	let select_1_data_userans_value;
	let t;
	let div_key_value;
	let div_id_value;

	function select_block_type(ctx, dirty) {
		if (/*data*/ ctx[6].select.length) return create_if_block_1$1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			select_1 = element("select");
			if_block.c();
			t = space();
			attr_dev(select_1, "class", select_1_class_value = /*data*/ ctx[6].id + " dnd_select align_baseline_middle");
			attr_dev(select_1, "name", "");
			attr_dev(select_1, "size", "0");
			attr_dev(select_1, "data-userans", select_1_data_userans_value = /*data*/ ctx[6].userans);
			attr_dev(select_1, "data-udisplay", "");
			attr_dev(select_1, "data-udisabled", "");
			attr_dev(select_1, "data-correctans", "");
			attr_dev(select_1, "data-defaultans", "");
			add_location(select_1, file$3, 145, 16, 5615);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[8]);
			attr_dev(div, "as", "-1");
			attr_dev(div, "id", div_id_value = /*data*/ ctx[6].id);
			attr_dev(div, "class", "drag-resize dndTest");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[6].top);
			set_style(div, "left", /*data*/ ctx[6].left);
			set_style(div, "height", /*data*/ ctx[6].height);
			set_style(div, "width", /*data*/ ctx[6].width);
			add_location(div, file$3, 132, 12, 5199);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, select_1);
			if_block.m(select_1, null);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(select_1, null);
				}
			}

			if (dirty & /*select_data*/ 1 && select_1_class_value !== (select_1_class_value = /*data*/ ctx[6].id + " dnd_select align_baseline_middle")) {
				attr_dev(select_1, "class", select_1_class_value);
			}

			if (dirty & /*select_data*/ 1 && select_1_data_userans_value !== (select_1_data_userans_value = /*data*/ ctx[6].userans)) {
				attr_dev(select_1, "data-userans", select_1_data_userans_value);
			}

			if (dirty & /*select_data*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[6].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*select_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[6].top);
			}

			if (dirty & /*select_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[6].left);
			}

			if (dirty & /*select_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[6].height);
			}

			if (dirty & /*select_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[6].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(132:8) {#each select_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let div;
	let if_block = /*select_data*/ ctx[0] && /*select_data*/ ctx[0].length > 0 && create_if_block$3(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$3, 129, 0, 5087);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*select_data*/ ctx[0] && /*select_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('SelectPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let { uxml = '' } = $$props;
	let user_ans = 0;
	let select_data = [];
	let select = modules;

	afterUpdate(() => {
		if (select_data.length > 0 && containerID != '') {
			select.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID', 'uxml'];

	Object_1$2.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		XMLToJSON,
		modules,
		containerID,
		uxml,
		user_ans,
		select_data,
		select
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('user_ans' in $$props) $$invalidate(4, user_ans = $$props.user_ans);
		if ('select_data' in $$props) $$invalidate(0, select_data = $$props.select_data);
		if ('select' in $$props) $$invalidate(5, select = $$props.select);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, select, uxml, user_ans, select_data*/ 59) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, select = []);
					$$invalidate(5, select[0] = modules, select);
				} else {
					$$invalidate(5, select = modules);
				}

				$$invalidate(0, select_data = []);

				select.map(function (data) {
					if (uxml != '') {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					let option = [];

					if (data.__text) {
						data.__text.split("\n").map(function (option_data, index) {
							if (data._userans == index + 1 + ",") {
								$$invalidate(4, user_ans = 1);
							} else {
								$$invalidate(4, user_ans = 0);
							}

							if (option_data.trim().charAt(0) == "+") {
								option.push({
									key: index,
									correctans: 0,
									defaultans: 1,
									userans: user_ans ? user_ans : '',
									text: option_data.trim().slice(1),
									selected: 1
								});
							} else if (option_data.trim().charAt(0) == "*") {
								option.push({
									key: index,
									correctans: 1,
									defaultans: 0,
									userans: user_ans ? user_ans : '',
									text: option_data.trim().slice(1)
								});
							} else {
								option.push({
									key: index,
									correctans: 0,
									defaultans: 0,
									userans: user_ans ? user_ans : '',
									text: option_data.trim()
								});
							}
						});
					}

					$$invalidate(0, select_data = [
						...select_data,
						{
							id: "dnd" + data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							userans: data._userans ? data._userans : "",
							select: option
						}
					]);
				});
			} else {
				$$invalidate(0, select_data = []);
			}
		}
	};

	return [select_data, modules, containerID, uxml, user_ans, select];
}

class SelectPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SelectPreview",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<SelectPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<SelectPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<SelectPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<SelectPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<SelectPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<SelectPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<SelectPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\RadioPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$3 } = globals;
const file$4 = "clsSMDragNDrop\\libs\\preview\\RadioPreview.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (98:4) {#if radio_data && radio_data.length > 0}
function create_if_block$4(ctx) {
	let each_1_anchor;
	let each_value = /*radio_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*radio_data, window*/ 1) {
				each_value = /*radio_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(98:4) {#if radio_data && radio_data.length > 0}",
		ctx
	});

	return block;
}

// (129:16) {:else}
function create_else_block$1(ctx) {
	let input;
	let input_id_value;
	let input_class_value;
	let input_data_title_value;
	let input_data_correctans_value;
	let input_data_defaultans_value;
	let input_data_userans_value;
	let input_data_checktype_value;
	let input_name_value;

	const block = {
		c: function create() {
			input = element("input");
			attr_dev(input, "type", "radio");
			attr_dev(input, "id", input_id_value = "rad" + /*data*/ ctx[5].id);
			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio");
			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[5].id);
			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
			attr_dev(input, "data-userans", input_data_userans_value = /*data*/ ctx[5].userans);
			attr_dev(input, "data-udisplay", "");
			attr_dev(input, "data-udisabled", "");
			attr_dev(input, "data-checktype", input_data_checktype_value = /*data*/ ctx[5].checktype);
			attr_dev(input, "name", input_name_value = /*data*/ ctx[5].name);
			input.value = "0";
			add_location(input, file$4, 129, 20, 4939);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*radio_data*/ 1 && input_id_value !== (input_id_value = "rad" + /*data*/ ctx[5].id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*radio_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[5].id)) {
				attr_dev(input, "data-title", input_data_title_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
				attr_dev(input, "data-correctans", input_data_correctans_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
				attr_dev(input, "data-defaultans", input_data_defaultans_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_userans_value !== (input_data_userans_value = /*data*/ ctx[5].userans)) {
				attr_dev(input, "data-userans", input_data_userans_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_checktype_value !== (input_data_checktype_value = /*data*/ ctx[5].checktype)) {
				attr_dev(input, "data-checktype", input_data_checktype_value);
			}

			if (dirty & /*radio_data*/ 1 && input_name_value !== (input_name_value = /*data*/ ctx[5].name)) {
				attr_dev(input, "name", input_name_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(129:16) {:else}",
		ctx
	});

	return block;
}

// (113:16) {#if data.defaultans == "1" && data.userans == ''}
function create_if_block_1$2(ctx) {
	let input;
	let input_id_value;
	let input_class_value;
	let input_data_title_value;
	let input_data_correctans_value;
	let input_data_defaultans_value;
	let input_data_userans_value;
	let input_data_checktype_value;
	let input_name_value;

	const block = {
		c: function create() {
			input = element("input");
			attr_dev(input, "type", "radio");
			attr_dev(input, "id", input_id_value = "rad" + /*data*/ ctx[5].id);
			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio");
			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[5].id);
			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
			attr_dev(input, "data-userans", input_data_userans_value = 1);
			input.checked = "checked";
			attr_dev(input, "data-udisplay", "");
			attr_dev(input, "data-udisabled", "");
			attr_dev(input, "data-checktype", input_data_checktype_value = /*data*/ ctx[5].checktype);
			attr_dev(input, "name", input_name_value = /*data*/ ctx[5].name);
			input.value = "1";
			add_location(input, file$4, 113, 20, 4236);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*radio_data*/ 1 && input_id_value !== (input_id_value = "rad" + /*data*/ ctx[5].id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*radio_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[5].id)) {
				attr_dev(input, "data-title", input_data_title_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
				attr_dev(input, "data-correctans", input_data_correctans_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
				attr_dev(input, "data-defaultans", input_data_defaultans_value);
			}

			if (dirty & /*radio_data*/ 1 && input_data_checktype_value !== (input_data_checktype_value = /*data*/ ctx[5].checktype)) {
				attr_dev(input, "data-checktype", input_data_checktype_value);
			}

			if (dirty & /*radio_data*/ 1 && input_name_value !== (input_name_value = /*data*/ ctx[5].name)) {
				attr_dev(input, "name", input_name_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(113:16) {#if data.defaultans == \\\"1\\\" && data.userans == ''}",
		ctx
	});

	return block;
}

// (99:8) {#each radio_data as data, index}
function create_each_block$4(ctx) {
	let div;
	let t0;
	let label;
	let label_for_value;
	let label_class_value;
	let t1;
	let div_key_value;
	let div_id_value;

	function select_block_type(ctx, dirty) {
		if (/*data*/ ctx[5].defaultans == "1" && /*data*/ ctx[5].userans == '') return create_if_block_1$2;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			t0 = space();
			label = element("label");
			t1 = space();
			attr_dev(label, "for", label_for_value = "rad" + /*data*/ ctx[5].id);

			attr_dev(label, "class", label_class_value = (/*data*/ ctx[5].checktype == "true"
			? "tureitemColor"
			: "falseitemColor") + " customRad radio_sim " + (window.inNative ? "native" : ""));

			attr_dev(label, "data-correctans", "");
			attr_dev(label, "data-userans", "");
			attr_dev(label, "data-defaultans", "");
			add_location(label, file$4, 144, 16, 5604);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
			attr_dev(div, "as", "-1");
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5].id);
			attr_dev(div, "class", "only-dragable dndTest");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[5].top);
			set_style(div, "left", /*data*/ ctx[5].left);
			set_style(div, "height", /*data*/ ctx[5].height);
			set_style(div, "width", /*data*/ ctx[5].width);
			add_location(div, file$4, 99, 12, 3738);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block.m(div, null);
			append_dev(div, t0);
			append_dev(div, label);
			append_dev(div, t1);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, t0);
				}
			}

			if (dirty & /*radio_data*/ 1 && label_for_value !== (label_for_value = "rad" + /*data*/ ctx[5].id)) {
				attr_dev(label, "for", label_for_value);
			}

			if (dirty & /*radio_data*/ 1 && label_class_value !== (label_class_value = (/*data*/ ctx[5].checktype == "true"
			? "tureitemColor"
			: "falseitemColor") + " customRad radio_sim " + (window.inNative ? "native" : ""))) {
				attr_dev(label, "class", label_class_value);
			}

			if (dirty & /*radio_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*radio_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[5].top);
			}

			if (dirty & /*radio_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[5].left);
			}

			if (dirty & /*radio_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[5].height);
			}

			if (dirty & /*radio_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[5].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(99:8) {#each radio_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let div;
	let if_block = /*radio_data*/ ctx[0] && /*radio_data*/ ctx[0].length > 0 && create_if_block$4(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$4, 96, 0, 3629);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*radio_data*/ ctx[0] && /*radio_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('RadioPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let { uxml = '' } = $$props;
	let radio_data = [];
	let radio = modules;

	afterUpdate(() => {
		if (radio_data.length > 0 && containerID != '') {
			radio.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID', 'uxml'];

	Object_1$3.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RadioPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		XMLToJSON,
		modules,
		containerID,
		uxml,
		radio_data,
		radio
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('radio_data' in $$props) $$invalidate(0, radio_data = $$props.radio_data);
		if ('radio' in $$props) $$invalidate(4, radio = $$props.radio);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, radio, uxml, radio_data*/ 27) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, radio = []);
					$$invalidate(4, radio[0] = modules, radio);
				} else {
					$$invalidate(4, radio = modules);
				}

				$$invalidate(0, radio_data = []);

				radio.map(function (data) {
					if (uxml != '') {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					$$invalidate(0, radio_data = [
						...radio_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							userans: data._userans ? data._userans : "",
							correctans: data._correctans,
							defaultans: data._defaultans,
							checktype: data._checktype,
							name: data._name
						}
					]);
				});
			} else {
				$$invalidate(0, radio_data = []);
			}
		}
	};

	return [radio_data, modules, containerID, uxml, radio];
}

class RadioPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "RadioPreview",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<RadioPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<RadioPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<RadioPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<RadioPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<RadioPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<RadioPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<RadioPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\MultilineboxPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$4 } = globals;
const file$5 = "clsSMDragNDrop\\libs\\preview\\MultilineboxPreview.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (117:4) {#if multilinebox_data && multilinebox_data.length > 0}
function create_if_block$5(ctx) {
	let each_1_anchor;
	let each_value = /*multilinebox_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*multilinebox_data*/ 1) {
				each_value = /*multilinebox_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(117:4) {#if multilinebox_data && multilinebox_data.length > 0}",
		ctx
	});

	return block;
}

// (118:8) {#each multilinebox_data as data, index}
function create_each_block$5(ctx) {
	let div;
	let textarea;
	let textarea_class_value;
	let textarea_data_title_value;
	let textarea_data_correctans_value;
	let textarea_data_defaultans_value;
	let textarea_data_parser_value;
	let textarea_placeholder_value;
	let textarea_data_nocase_value;
	let textarea_data_userans_value;
	let t;
	let div_key_value;
	let div_id_value;

	const block = {
		c: function create() {
			div = element("div");
			textarea = element("textarea");
			t = space();
			attr_dev(textarea, "class", textarea_class_value = /*data*/ ctx[5].classes);
			attr_dev(textarea, "data-title", textarea_data_title_value = /*data*/ ctx[5].id);
			attr_dev(textarea, "data-correctans", textarea_data_correctans_value = /*data*/ ctx[5].correctans);

			attr_dev(textarea, "data-defaultans", textarea_data_defaultans_value = /*data*/ ctx[5].defaultans
			? /*data*/ ctx[5].defaultans.__cdata
			: "");

			attr_dev(textarea, "data-parser", textarea_data_parser_value = /*data*/ ctx[5].parser);
			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*data*/ ctx[5].placeholder);
			attr_dev(textarea, "data-nocase", textarea_data_nocase_value = /*data*/ ctx[5].nocase);
			attr_dev(textarea, "data-userans", textarea_data_userans_value = /*data*/ ctx[5].userans);
			add_location(textarea, file$5, 130, 16, 5046);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5].id);
			attr_dev(div, "class", "drag-resize dndTest");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[5].top);
			set_style(div, "left", /*data*/ ctx[5].left);
			set_style(div, "height", /*data*/ ctx[5].height);
			set_style(div, "width", /*data*/ ctx[5].width);
			add_location(div, file$5, 118, 16, 4634);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, textarea);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*multilinebox_data*/ 1 && textarea_class_value !== (textarea_class_value = /*data*/ ctx[5].classes)) {
				attr_dev(textarea, "class", textarea_class_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_data_title_value !== (textarea_data_title_value = /*data*/ ctx[5].id)) {
				attr_dev(textarea, "data-title", textarea_data_title_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_data_correctans_value !== (textarea_data_correctans_value = /*data*/ ctx[5].correctans)) {
				attr_dev(textarea, "data-correctans", textarea_data_correctans_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_data_defaultans_value !== (textarea_data_defaultans_value = /*data*/ ctx[5].defaultans
			? /*data*/ ctx[5].defaultans.__cdata
			: "")) {
				attr_dev(textarea, "data-defaultans", textarea_data_defaultans_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_data_parser_value !== (textarea_data_parser_value = /*data*/ ctx[5].parser)) {
				attr_dev(textarea, "data-parser", textarea_data_parser_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_placeholder_value !== (textarea_placeholder_value = /*data*/ ctx[5].placeholder)) {
				attr_dev(textarea, "placeholder", textarea_placeholder_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_data_nocase_value !== (textarea_data_nocase_value = /*data*/ ctx[5].nocase)) {
				attr_dev(textarea, "data-nocase", textarea_data_nocase_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && textarea_data_userans_value !== (textarea_data_userans_value = /*data*/ ctx[5].userans)) {
				attr_dev(textarea, "data-userans", textarea_data_userans_value);
			}

			if (dirty & /*multilinebox_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*multilinebox_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[5].top);
			}

			if (dirty & /*multilinebox_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[5].left);
			}

			if (dirty & /*multilinebox_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[5].height);
			}

			if (dirty & /*multilinebox_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[5].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(118:8) {#each multilinebox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let div;
	let if_block = /*multilinebox_data*/ ctx[0] && /*multilinebox_data*/ ctx[0].length > 0 && create_if_block$5(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$5, 115, 0, 4500);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*multilinebox_data*/ ctx[0] && /*multilinebox_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function setCorrect(crt) {
	if (crt.__cdata) {
		return crt.__cdata;
	} else if (typeof crt == 'object' && crt[0]) {
		return crt[0].__cdata ? crt[0].__cdata : crt[0];
	} else if (typeof crt == "string" && crt.length > 1) {
		return crt;
	} else {
		return "";
	}
}

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MultilineboxPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let { uxml = '' } = $$props;
	let multilinebox_data = [];
	let multilinebox_preview = modules;

	// was created in js unused function for now but keeping it fot future reference
	// function changeStep(data) {
	// 	let id = data.match(/('.*?')/gm);
	// 	id = id[0].replace(/'|"/gm,'');
	// 	setStep(id);
	// }
	afterUpdate(() => {
		if (multilinebox_data.length > 0 && containerID != '') {
			multilinebox_preview.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID', 'uxml'];

	Object_1$4.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MultilineboxPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		XMLToJSON,
		modules,
		containerID,
		uxml,
		multilinebox_data,
		multilinebox_preview,
		setCorrect
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('multilinebox_data' in $$props) $$invalidate(0, multilinebox_data = $$props.multilinebox_data);
		if ('multilinebox_preview' in $$props) $$invalidate(4, multilinebox_preview = $$props.multilinebox_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, multilinebox_preview, uxml, multilinebox_data*/ 27) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, multilinebox_preview = []);
					$$invalidate(4, multilinebox_preview[0] = modules, multilinebox_preview);
				} else {
					$$invalidate(4, multilinebox_preview = modules);
				}

				$$invalidate(0, multilinebox_data = []);

				multilinebox_preview.map(function (data) {
					if (uxml != '') {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					$$invalidate(0, multilinebox_data = [
						...multilinebox_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							correctans: data.correctans ? setCorrect(data.correctans) : "",
							defaultans: data.defaultans ? data.defaultans.__cdata : "",
							parser: data._parser ? data._parser : "",
							placeholder: data._placeholder ? data._placeholder : "",
							nocase: data._nocase,
							userans: data._userans ? data._userans : '',
							classes: "dnd" + data._id + " dnd_textarea " + data._custom_class
						}
					]);
				});
			} else {
				$$invalidate(0, multilinebox_data = []);
			}
		}
	};

	return [multilinebox_data, modules, containerID, uxml, multilinebox_preview];
}

class MultilineboxPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$5, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MultilineboxPreview",
			options,
			id: create_fragment$5.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<MultilineboxPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<MultilineboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<MultilineboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<MultilineboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<MultilineboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<MultilineboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<MultilineboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\CheckboxPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$5 } = globals;
const file$6 = "clsSMDragNDrop\\libs\\preview\\CheckboxPreview.svelte";

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (97:4) {#if checkbox_data.length > 0}
function create_if_block$6(ctx) {
	let each_1_anchor;
	let each_value = /*checkbox_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*checkbox_data*/ 1) {
				each_value = /*checkbox_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(97:4) {#if checkbox_data.length > 0}",
		ctx
	});

	return block;
}

// (124:16) {:else}
function create_else_block$2(ctx) {
	let input;
	let input_class_value;
	let input_data_correctans_value;
	let input_data_defaultans_value;
	let input_data_userans_value;

	const block = {
		c: function create() {
			input = element("input");
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox");
			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
			attr_dev(input, "data-userans", input_data_userans_value = /*data*/ ctx[5].userans);
			attr_dev(input, "data-udisplay", "");
			attr_dev(input, "data-udisabled", "");
			attr_dev(input, "name", "");
			input.value = "";
			add_location(input, file$6, 124, 20, 4773);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*checkbox_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*checkbox_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
				attr_dev(input, "data-correctans", input_data_correctans_value);
			}

			if (dirty & /*checkbox_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
				attr_dev(input, "data-defaultans", input_data_defaultans_value);
			}

			if (dirty & /*checkbox_data*/ 1 && input_data_userans_value !== (input_data_userans_value = /*data*/ ctx[5].userans)) {
				attr_dev(input, "data-userans", input_data_userans_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(124:16) {:else}",
		ctx
	});

	return block;
}

// (111:16) {#if data.defaultans == "1" && data.userans == ''}
function create_if_block_1$3(ctx) {
	let input;
	let input_class_value;
	let input_data_correctans_value;
	let input_data_defaultans_value;
	let input_checked_value;

	const block = {
		c: function create() {
			input = element("input");
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox");
			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
			attr_dev(input, "data-userans", "1");
			attr_dev(input, "data-udisplay", "");
			attr_dev(input, "data-udisabled", "");
			attr_dev(input, "name", "");
			input.value = "";
			input.checked = input_checked_value = true;
			add_location(input, file$6, 111, 20, 4233);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*checkbox_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*checkbox_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
				attr_dev(input, "data-correctans", input_data_correctans_value);
			}

			if (dirty & /*checkbox_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
				attr_dev(input, "data-defaultans", input_data_defaultans_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(111:16) {#if data.defaultans == \\\"1\\\" && data.userans == ''}",
		ctx
	});

	return block;
}

// (98:8) {#each checkbox_data as data, index}
function create_each_block$6(ctx) {
	let div;
	let t;
	let div_key_value;
	let div_id_value;

	function select_block_type(ctx, dirty) {
		if (/*data*/ ctx[5].defaultans == "1" && /*data*/ ctx[5].userans == '') return create_if_block_1$3;
		return create_else_block$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			t = space();
			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5].id);
			attr_dev(div, "class", "only-dragable dndTest");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[5].top);
			set_style(div, "left", /*data*/ ctx[5].left);
			set_style(div, "height", /*data*/ ctx[5].height);
			set_style(div, "width", /*data*/ ctx[5].width);
			add_location(div, file$6, 98, 12, 3762);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block.m(div, null);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, t);
				}
			}

			if (dirty & /*checkbox_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*checkbox_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[5].top);
			}

			if (dirty & /*checkbox_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[5].left);
			}

			if (dirty & /*checkbox_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[5].height);
			}

			if (dirty & /*checkbox_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[5].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(98:8) {#each checkbox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let div;
	let if_block = /*checkbox_data*/ ctx[0].length > 0 && create_if_block$6(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$6, 95, 0, 3661);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*checkbox_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('CheckboxPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let { uxml = '' } = $$props;
	let checkbox_data = [];
	let checkbox = modules;

	afterUpdate(() => {
		if (checkbox_data && checkbox_data.length > 0 && containerID != '') {
			checkbox.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID', 'uxml'];

	Object_1$5.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckboxPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
	};

	$$self.$capture_state = () => ({
		XMLToJSON,
		afterUpdate,
		modules,
		containerID,
		uxml,
		checkbox_data,
		checkbox
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('checkbox_data' in $$props) $$invalidate(0, checkbox_data = $$props.checkbox_data);
		if ('checkbox' in $$props) $$invalidate(4, checkbox = $$props.checkbox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, checkbox, uxml, checkbox_data*/ 27) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, checkbox = []);
					$$invalidate(4, checkbox[0] = modules, checkbox);
				} else {
					$$invalidate(4, checkbox = modules);
				}

				$$invalidate(0, checkbox_data = []);

				checkbox.map(function (data) {
					if (uxml != '') {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					$$invalidate(0, checkbox_data = [
						...checkbox_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id,
							userans: data._userans ? data._userans : "",
							correctans: data._correctans ? data._correctans : "",
							defaultans: data._defaultans ? data._defaultans : ""
						}
					]);
				});
			} else {
				$$invalidate(0, checkbox_data = []);
			}
		}
	};

	return [checkbox_data, modules, containerID, uxml, checkbox];
}

class CheckboxPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CheckboxPreview",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<CheckboxPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<CheckboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<CheckboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<CheckboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<CheckboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<CheckboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<CheckboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\TabheadPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$6, console: console_1 } = globals;
const file$7 = "clsSMDragNDrop\\libs\\preview\\TabheadPreview.svelte";

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (111:4) {#if tabhead_data && tabhead_data.length > 0}
function create_if_block$7(ctx) {
	let each_1_anchor;
	let each_value = /*tabhead_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tabhead_data*/ 1) {
				each_value = /*tabhead_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(111:4) {#if tabhead_data && tabhead_data.length > 0}",
		ctx
	});

	return block;
}

// (112:8) {#each tabhead_data as data, index}
function create_each_block$7(ctx) {
	let div;
	let div_key_value;
	let div_id_value;
	let div_class_value;
	let div_style_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[4].id);
			attr_dev(div, "data-type", "tabhead");
			attr_dev(div, "class", div_class_value = /*data*/ ctx[4].classes);
			attr_dev(div, "style", div_style_value = /*data*/ ctx[4].styles);
			attr_dev(div, "name", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "data-udisplay", "");
			attr_dev(div, "data-udisabled", "");
			add_location(div, file$7, 112, 12, 3906);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tabhead_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[4].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*tabhead_data*/ 1 && div_class_value !== (div_class_value = /*data*/ ctx[4].classes)) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*tabhead_data*/ 1 && div_style_value !== (div_style_value = /*data*/ ctx[4].styles)) {
				attr_dev(div, "style", div_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$7.name,
		type: "each",
		source: "(112:8) {#each tabhead_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let div;
	let if_block = /*tabhead_data*/ ctx[0] && /*tabhead_data*/ ctx[0].length > 0 && create_if_block$7(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$7, 109, 0, 3791);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*tabhead_data*/ ctx[0] && /*tabhead_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$7(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function changeStyletoString(data) {
	let style = '';

	for (let key in data) {
		style += key.replace(/_/g, '-') + ":" + data[key] + ";";
	}

	return style;
}

// function for adding inline style from the object
function addInlineStyle(stylesheet) {
	if (typeof stylesheet != "undefined") {
		let style = {};
		let inlineStyle = stylesheet.split(";");

		inlineStyle.map(function (value) {
			try {
				let new_property = value.split(":");
				style[new_property[0]] = new_property[1];
			} catch(err) {
				console.warn(err);
			}
		});

		return style;
	}
}

function instance$7($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TabheadPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let tabhead_data = [];
	let tabhead = modules;

	afterUpdate(() => {
		if (tabhead_data.length > 0 && containerID != '') {
			tabhead.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll("#dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll("#dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID'];

	Object_1$6.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<TabheadPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		modules,
		containerID,
		tabhead_data,
		tabhead,
		changeStyletoString,
		addInlineStyle
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('tabhead_data' in $$props) $$invalidate(0, tabhead_data = $$props.tabhead_data);
		if ('tabhead' in $$props) $$invalidate(3, tabhead = $$props.tabhead);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, tabhead, tabhead_data*/ 11) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, tabhead = []);
					$$invalidate(3, tabhead[0] = modules, tabhead);
				} else {
					$$invalidate(3, tabhead = modules);
				}

				$$invalidate(0, tabhead_data = []);

				tabhead.map(function (data) {
					let styling = changeStyletoString(Object.assign(
						{
							position: 'absolute',
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px"
						},
						addInlineStyle(data._style)
					));

					$$invalidate(0, tabhead_data = [
						...tabhead_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							styles: styling,
							id: data._id,
							classes: "drag-resize dndtabhead dndTest " + data._class
						}
					]);
				});
			} else {
				$$invalidate(0, tabhead_data = []);
			}
		}
	};

	return [tabhead_data, modules, containerID, tabhead];
}

class TabheadPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { modules: 1, containerID: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TabheadPreview",
			options,
			id: create_fragment$7.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console_1.warn("<TabheadPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<TabheadPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<TabheadPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<TabheadPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<TabheadPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\LabelPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$7, console: console_1$1 } = globals;
const file$8 = "clsSMDragNDrop\\libs\\preview\\LabelPreview.svelte";

function get_each_context$8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (123:4) {#if label_preview_data && label_preview_data.length}
function create_if_block$8(ctx) {
	let each_1_anchor;
	let each_value = /*label_preview_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label_preview_data*/ 1) {
				each_value = /*label_preview_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$8(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(123:4) {#if label_preview_data && label_preview_data.length}",
		ctx
	});

	return block;
}

// (124:8) {#each label_preview_data as data, index}
function create_each_block$8(ctx) {
	let div;
	let p;
	let t0_value = /*data*/ ctx[4].parahtml + "";
	let t0;
	let p_style_value;
	let t1;
	let div_key_value;
	let div_id_value;
	let div_class_value;
	let div_style_value;

	const block = {
		c: function create() {
			div = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(p, "style", p_style_value = /*data*/ ctx[4].paraStyle);
			add_location(p, file$8, 132, 16, 4871);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[4].id);
			attr_dev(div, "class", div_class_value = /*data*/ ctx[4].classes);
			attr_dev(div, "tabindex", "1");
			attr_dev(div, "style", div_style_value = /*data*/ ctx[4].style);
			add_location(div, file$8, 125, 12, 4665);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, p);
			append_dev(p, t0);
			append_dev(div, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label_preview_data*/ 1 && t0_value !== (t0_value = /*data*/ ctx[4].parahtml + "")) set_data_dev(t0, t0_value);

			if (dirty & /*label_preview_data*/ 1 && p_style_value !== (p_style_value = /*data*/ ctx[4].paraStyle)) {
				attr_dev(p, "style", p_style_value);
			}

			if (dirty & /*label_preview_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[4].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*label_preview_data*/ 1 && div_class_value !== (div_class_value = /*data*/ ctx[4].classes)) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*label_preview_data*/ 1 && div_style_value !== (div_style_value = /*data*/ ctx[4].style)) {
				attr_dev(div, "style", div_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$8.name,
		type: "each",
		source: "(124:8) {#each label_preview_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let div;
	let if_block = /*label_preview_data*/ ctx[0] && /*label_preview_data*/ ctx[0].length && create_if_block$8(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$8, 121, 0, 4477);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*label_preview_data*/ ctx[0] && /*label_preview_data*/ ctx[0].length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$8(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function changeStyletoString$1(data) {
	let style = '';

	for (let key in data) {
		style += key.replace(/_/g, '-') + ":" + data[key] + ";";
	}

	return style;
}

// for adding inline paragraph style
function addParaStyle(data) {
	if (typeof data._label_class != "undefined") {
		return addInlineStyle$1(data._style);
	}
}

// function for setting inner html
function setInnerHtml(htmlEnt) {
	return htmlEnt
	? htmlEnt.replace(/&#(\d+);/g, function (match, dec) {
			return String.fromCharCode(dec);
		})
	: "";
}

// function for adding inline style from the object
function addInlineStyle$1(stylesheet) {
	if (typeof stylesheet != "undefined") {
		let style = {};
		let inlineStyle = stylesheet.split(",");

		inlineStyle.map(function (value) {
			try {
				let new_property = value.split(":");
				style[new_property[0]] = new_property[1];
			} catch(err) {
				console.warn(err);
			}
		});

		return style;
	}
}

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LabelPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let label_preview_data = [];
	let labelPreview = modules;

	afterUpdate(() => {
		if (label_preview_data.length > 0 && containerID != '') {
			labelPreview.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll("#dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll("#dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID'];

	Object_1$7.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<LabelPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		AH,
		modules,
		containerID,
		label_preview_data,
		labelPreview,
		changeStyletoString: changeStyletoString$1,
		addParaStyle,
		setInnerHtml,
		addInlineStyle: addInlineStyle$1
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('label_preview_data' in $$props) $$invalidate(0, label_preview_data = $$props.label_preview_data);
		if ('labelPreview' in $$props) $$invalidate(3, labelPreview = $$props.labelPreview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, labelPreview, label_preview_data*/ 11) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, labelPreview = []);
					$$invalidate(3, labelPreview[0] = modules, labelPreview);
				} else {
					$$invalidate(3, labelPreview = modules);
				}

				$$invalidate(0, label_preview_data = []);

				labelPreview.map(function (data) {
					let styling = changeStyletoString$1(Object.assign(
						{
							position: 'absolute',
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							border: data._border_size + "px solid " + data._border_color,
							background_color: data._background_color
						},
						addInlineStyle$1(data._style)
					));

					let para_styling = changeStyletoString$1(addParaStyle(data));

					$$invalidate(0, label_preview_data = [
						...label_preview_data,
						{
							id: data._id,
							style: styling,
							classes: "dndlabel dndTest " + (data._label_class ? data._label_class : ""),
							paraStyle: para_styling,
							parahtml: setInnerHtml(data._richtext
							? data.__cdata
							: AH.ignoreEnity(data._title))
						}
					]);
				});
			} else {
				$$invalidate(0, label_preview_data = []);
			}
		}
	};

	return [label_preview_data, modules, containerID, labelPreview];
}

class LabelPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$8, safe_not_equal, { modules: 1, containerID: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LabelPreview",
			options,
			id: create_fragment$8.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console_1$1.warn("<LabelPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<LabelPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<LabelPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<LabelPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<LabelPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\HotspotPreview.svelte generated by Svelte v3.40.2 */
const file$9 = "clsSMDragNDrop\\libs\\preview\\HotspotPreview.svelte";

function get_each_context$9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	child_ctx[9] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	child_ctx[12] = i;
	return child_ctx;
}

// (99:8) {#if hotspot_data && hotspot_data.length > 0}
function create_if_block$9(ctx) {
	let each_1_anchor;
	let each_value = /*hotspot_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data, window, Date*/ 1) {
				each_value = /*hotspot_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$9(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$9(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(99:8) {#if hotspot_data && hotspot_data.length > 0}",
		ctx
	});

	return block;
}

// (116:20) {#if data.bgimg}
function create_if_block_2$1(ctx) {
	let div;
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			div = element("div");
			img = element("img");
			set_style(img, "display", "none");
			attr_dev(img, "alt", "hotspot");

			if (!src_url_equal(img.src, img_src_value = (window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[7].bgimg + "?" + Date.now())) attr_dev(img, "src", img_src_value);

			add_location(img, file$9, 117, 28, 4018);
			add_location(div, file$9, 116, 24, 3983);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, img);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data*/ 1 && !src_url_equal(img.src, img_src_value = (window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[7].bgimg + "?" + Date.now())) {
				attr_dev(img, "src", img_src_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(116:20) {#if data.bgimg}",
		ctx
	});

	return block;
}

// (122:20) {#if data.child.length > 0}
function create_if_block_1$4(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[7].child;
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data*/ 1) {
				each_value_1 = /*data*/ ctx[7].child;
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(122:20) {#if data.child.length > 0}",
		ctx
	});

	return block;
}

// (123:24) {#each data.child as child_data, child_index}
function create_each_block_1$1(ctx) {
	let div;
	let div_key_value;
	let div_id_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "key", div_key_value = /*child_index*/ ctx[12]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[7].id + "_" + (/*child_index*/ ctx[12] + 1));
			attr_dev(div, "data-correctans", "0");
			attr_dev(div, "class", "drag-resize hs_item ui-droppable");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*child_data*/ ctx[10].top);
			set_style(div, "left", /*child_data*/ ctx[10].left);
			set_style(div, "height", /*child_data*/ ctx[10].height);
			set_style(div, "width", /*child_data*/ ctx[10].width);
			add_location(div, file$9, 123, 28, 4440);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[7].id + "_" + (/*child_index*/ ctx[12] + 1))) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "top", /*child_data*/ ctx[10].top);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "left", /*child_data*/ ctx[10].left);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "height", /*child_data*/ ctx[10].height);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "width", /*child_data*/ ctx[10].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(123:24) {#each data.child as child_data, child_index}",
		ctx
	});

	return block;
}

// (100:12) {#each hotspot_data as data, index}
function create_each_block$9(ctx) {
	let div;
	let t0;
	let t1;
	let div_key_value;
	let div_id_value;
	let div_data_userans_value;
	let if_block0 = /*data*/ ctx[7].bgimg && create_if_block_2$1(ctx);
	let if_block1 = /*data*/ ctx[7].child.length > 0 && create_if_block_1$4(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			attr_dev(div, "key", div_key_value = /*index*/ ctx[9]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[7].id);
			attr_dev(div, "class", "drag-resize hotspot_test dndTest");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[7].top);
			set_style(div, "left", /*data*/ ctx[7].left);
			set_style(div, "height", /*data*/ ctx[7].height);
			set_style(div, "width", /*data*/ ctx[7].width);
			set_style(div, "border", /*data*/ ctx[7].border);
			set_style(div, "background-image", /*data*/ ctx[7].backgroundImage + "\r\n                    ");
			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[7].userans);
			add_location(div, file$9, 100, 16, 3318);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block0) if_block0.m(div, null);
			append_dev(div, t0);
			if (if_block1) if_block1.m(div, null);
			append_dev(div, t1);
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[7].bgimg) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$1(ctx);
					if_block0.c();
					if_block0.m(div, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*data*/ ctx[7].child.length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$4(ctx);
					if_block1.c();
					if_block1.m(div, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*hotspot_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[7].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[7].top);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[7].left);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[7].height);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[7].width);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "border", /*data*/ ctx[7].border);
			}

			if (dirty & /*hotspot_data*/ 1) {
				set_style(div, "background-image", /*data*/ ctx[7].backgroundImage + "\r\n                    ");
			}

			if (dirty & /*hotspot_data*/ 1 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[7].userans)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$9.name,
		type: "each",
		source: "(100:12) {#each hotspot_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let div1;
	let div0;
	let div0_style_value;
	let if_block = /*hotspot_data*/ ctx[0] && /*hotspot_data*/ ctx[0].length > 0 && create_if_block$9(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			if (if_block) if_block.c();
			attr_dev(div0, "class", "hotspotContainer");
			attr_dev(div0, "style", div0_style_value = 'height:' + /*div_height*/ ctx[1]);
			add_location(div0, file$9, 97, 4, 3132);
			add_location(div1, file$9, 96, 0, 3121);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			if (if_block) if_block.m(div0, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*hotspot_data*/ ctx[0] && /*hotspot_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$9(ctx);
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*div_height*/ 2 && div0_style_value !== (div0_style_value = 'height:' + /*div_height*/ ctx[1])) {
				attr_dev(div0, "style", div0_style_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function bgImage$1(img) {
	if (img) {
		return (window.inNative
		? "https://s3.amazonaws.com/jigyaasa_content_static/"
		: "https://s3.amazonaws.com/jigyaasa_content_static/") + img;
	} else {
		return "";
	}
}

function instance$9($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('HotspotPreview', slots, []);
	let { modules } = $$props;
	let { uxml } = $$props;
	let { module_type } = $$props;
	let hotspot_data = [];
	let hotspot = modules;
	let module_height = 0;
	let div_height = 'auto';
	const writable_props = ['modules', 'uxml', 'module_type'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HotspotPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(2, modules = $$props.modules);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('module_type' in $$props) $$invalidate(4, module_type = $$props.module_type);
	};

	$$self.$capture_state = () => ({
		XMLToJSON,
		modules,
		uxml,
		module_type,
		hotspot_data,
		hotspot,
		module_height,
		div_height,
		bgImage: bgImage$1
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(2, modules = $$props.modules);
		if ('uxml' in $$props) $$invalidate(3, uxml = $$props.uxml);
		if ('module_type' in $$props) $$invalidate(4, module_type = $$props.module_type);
		if ('hotspot_data' in $$props) $$invalidate(0, hotspot_data = $$props.hotspot_data);
		if ('hotspot' in $$props) $$invalidate(5, hotspot = $$props.hotspot);
		if ('module_height' in $$props) $$invalidate(6, module_height = $$props.module_height);
		if ('div_height' in $$props) $$invalidate(1, div_height = $$props.div_height);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, module_type, hotspot, module_height, uxml, hotspot_data*/ 125) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, hotspot = []);
					$$invalidate(5, hotspot[0] = modules, hotspot);
				} else {
					$$invalidate(5, hotspot = modules);
				}

				$$invalidate(0, hotspot_data = []);

				if (module_type == '15') {
					try {
						hotspot.map(data => {
							$$invalidate(6, module_height = data._height);

							if (module_height < data._height) {
								$$invalidate(6, module_height = data._height);
							}
						});
					} catch(e) {
						$$invalidate(6, module_height = 350);
					}
				}

				$$invalidate(1, div_height = module_height == 0 ? 'auto' : module_height + 100 + 'px');

				hotspot.map(function (data, index) {
					let inner_component = [];
					let innerText = JSON.parse(data.__text ? data.__text : data.__cdata);

					for (let key in innerText) {
						inner_component.push({
							top: innerText[key][0] + "px",
							left: innerText[key][1] + "px",
							width: innerText[key][2] + "px",
							height: innerText[key][3] + "px"
						});
					}

					if (uxml) {
						let uaXML = XMLToJSON(uxml);

						if (uaXML && uaXML.smans) {
							if (uaXML.smans.div) {
								let uans = uaXML.smans.div;

								if (Array.isArray(uans) == false) {
									uans = [];
									uans[0] = uaXML.smans.div;
								}

								for (let j in uans) {
									if (uans[j]._id == "dnd" + data._id) {
										data._userans = uans[j]._userAns;
									}
								}
							}
						}
					}

					$$invalidate(0, hotspot_data = [
						...hotspot_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							backgroundImage: "url('" + bgImage$1(data._bgimg) + "')",
							userans: data._userans ? data._userans : '',
							bgimg: data._bgimg,
							child: inner_component
						}
					]);
				});
			} else {
				$$invalidate(0, hotspot_data = []);
			}
		}
	};

	return [hotspot_data, div_height, modules, uxml, module_type, hotspot, module_height];
}

class HotspotPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$9, create_fragment$9, safe_not_equal, { modules: 2, uxml: 3, module_type: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "HotspotPreview",
			options,
			id: create_fragment$9.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[2] === undefined && !('modules' in props)) {
			console.warn("<HotspotPreview> was created without expected prop 'modules'");
		}

		if (/*uxml*/ ctx[3] === undefined && !('uxml' in props)) {
			console.warn("<HotspotPreview> was created without expected prop 'uxml'");
		}

		if (/*module_type*/ ctx[4] === undefined && !('module_type' in props)) {
			console.warn("<HotspotPreview> was created without expected prop 'module_type'");
		}
	}

	get modules() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get module_type() {
		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set module_type(value) {
		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\MenulistPreview.svelte generated by Svelte v3.40.2 */

const file$a = "clsSMDragNDrop\\libs\\preview\\MenulistPreview.svelte";

function get_each_context$a(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[10] = i;
	return child_ctx;
}

function get_each_context_1$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (129:4) {#if menulist_data && menulist_data.length > 0}
function create_if_block$a(ctx) {
	let each_1_anchor;
	let each_value = /*menulist_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*menulist_data, window*/ 1) {
				each_value = /*menulist_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$a(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$a(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(129:4) {#if menulist_data && menulist_data.length > 0}",
		ctx
	});

	return block;
}

// (145:16) {#if data.menulist_item.length > 0}
function create_if_block_1$5(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[8].menulist_item;
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*menulist_data, window*/ 1) {
				each_value_1 = /*data*/ ctx[8].menulist_item;
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$5.name,
		type: "if",
		source: "(145:16) {#if data.menulist_item.length > 0}",
		ctx
	});

	return block;
}

// (146:20) {#each data.menulist_item as menu_data, subindex}
function create_each_block_1$2(ctx) {
	let span;
	let span_key_value;
	let span_id_value;
	let span_class_value;
	let span_data_correctans_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[4](/*menu_data*/ ctx[11]);
	}

	const block = {
		c: function create() {
			span = element("span");
			attr_dev(span, "key", span_key_value = "menu_" + /*subindex*/ ctx[13]);
			attr_dev(span, "id", span_id_value = /*menu_data*/ ctx[11].id);
			attr_dev(span, "class", span_class_value = /*menu_data*/ ctx[11].classes);
			attr_dev(span, "data-correctans", span_data_correctans_value = /*menu_data*/ ctx[11].correctans);
			attr_dev(span, "data-defaultans", "");
			attr_dev(span, "data-userans", "");
			set_style(span, "position", "absolute");
			set_style(span, "top", /*menu_data*/ ctx[11].top);
			set_style(span, "left", /*menu_data*/ ctx[11].left);
			set_style(span, "height", /*menu_data*/ ctx[11].height);
			set_style(span, "width", /*menu_data*/ ctx[11].width);
			add_location(span, file$a, 146, 24, 4967);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);

			if (!mounted) {
				dispose = listen_dev(span, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*menulist_data*/ 1 && span_id_value !== (span_id_value = /*menu_data*/ ctx[11].id)) {
				attr_dev(span, "id", span_id_value);
			}

			if (dirty & /*menulist_data*/ 1 && span_class_value !== (span_class_value = /*menu_data*/ ctx[11].classes)) {
				attr_dev(span, "class", span_class_value);
			}

			if (dirty & /*menulist_data*/ 1 && span_data_correctans_value !== (span_data_correctans_value = /*menu_data*/ ctx[11].correctans)) {
				attr_dev(span, "data-correctans", span_data_correctans_value);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(span, "top", /*menu_data*/ ctx[11].top);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(span, "left", /*menu_data*/ ctx[11].left);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(span, "height", /*menu_data*/ ctx[11].height);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(span, "width", /*menu_data*/ ctx[11].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$2.name,
		type: "each",
		source: "(146:20) {#each data.menulist_item as menu_data, subindex}",
		ctx
	});

	return block;
}

// (130:8) {#each menulist_data as data, index}
function create_each_block$a(ctx) {
	let div;
	let t;
	let div_key_value;
	let if_block = /*data*/ ctx[8].menulist_item.length > 0 && create_if_block_1$5(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t = space();
			attr_dev(div, "key", div_key_value = /*index*/ ctx[10]);
			attr_dev(div, "class", "drag-resize");
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[8].top);
			set_style(div, "left", /*data*/ ctx[8].left);
			set_style(div, "height", /*data*/ ctx[8].height);
			set_style(div, "width", /*data*/ ctx[8].width);
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "data-defaultans", "");
			add_location(div, file$a, 130, 12, 4382);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[8].menulist_item.length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$5(ctx);
					if_block.c();
					if_block.m(div, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*menulist_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$a.name,
		type: "each",
		source: "(130:8) {#each menulist_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let div;
	let if_block = /*menulist_data*/ ctx[0] && /*menulist_data*/ ctx[0].length > 0 && create_if_block$a(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$a, 127, 0, 4264);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*menulist_data*/ ctx[0] && /*menulist_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$a(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getTop(rowCount, row, list) {
	let top = (parseFloat(list._height) / parseFloat(row) - 0) * (parseFloat(rowCount) - 1) + (parseFloat(rowCount) - 1) * 0 + 0 / 2;
	return top;
}

function getLeft(colCount, col, list) {
	let left = (parseFloat(list._width) / parseFloat(col) - 0) * (parseFloat(colCount) - 1) + (parseFloat(colCount) - 1) * 0 + 0 / 2;
	return left;
}

function getHeight(row, list) {
	let height = parseFloat(list._height) / parseFloat(row) - 0;
	return height;
}

function getWidth(col, list) {
	let width = parseFloat(list._width) / parseFloat(col) - 0;
	return width;
}

function instance$a($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MenulistPreview', slots, []);
	let { modules } = $$props;
	let menulist_data = [];
	let menulist_preview = modules;
	let menuEvent = [];
	let correctSelect = "";

	function getClick(text) {
		let data = text.split("|");

		for (let i = 0; i < data.length; i++) {
			let clck = data[i].match(/\(.*?\)/gi);

			if (clck) {
				$$invalidate(3, menuEvent[i] = clck[0].replace('(', '').replace(')', '').replace(/"/g, '').replace(/'/g, ''), menuEvent);
			} else {
				$$invalidate(3, menuEvent[i] = "", menuEvent);
			}
		}
	}

	// @ayush : I don't find the function used for now will look it later on it
	function getCorrect(r, c, row, col, data) {
		correctSelect = "," + (data._correctans
		? data._correctans.replace(" ", "")
		: "") + ",";

		let cans = "menu off dndTest menulist";

		if (row > 1 && col <= 1) {
			let srch1 = "," + r + ",";

			if (correctSelect.indexOf(srch1) !== false) {
				cans = "menu off menulist dndTest record";
			}
		} else if (row <= 1 && col > 1) {
			let srch2 = "," + c + ",";

			if (correctSelect.indexOf(srch2) !== false) {
				cans = "menu off menulist dndTest record";
			}
		} else if (row > 1 && col > 1) {
			let srch3 = r + "x" + c + ",";

			if (correctSelect.indexOf(srch3) !== false) {
				cans = "menu off menulist dndTest record";
			}
		} else {
			let srch4 = "," + r + ",";

			if (correctSelect.indexOf(srch4) !== false) {
				cans = "menu off menulist dndTest record";
			}
		}

		return cans;
	}

	const writable_props = ['modules'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenulistPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = menu_data => window.setStep(menu_data.click_event);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
	};

	$$self.$capture_state = () => ({
		modules,
		menulist_data,
		menulist_preview,
		menuEvent,
		correctSelect,
		getTop,
		getLeft,
		getHeight,
		getWidth,
		getClick,
		getCorrect
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('menulist_data' in $$props) $$invalidate(0, menulist_data = $$props.menulist_data);
		if ('menulist_preview' in $$props) $$invalidate(2, menulist_preview = $$props.menulist_preview);
		if ('menuEvent' in $$props) $$invalidate(3, menuEvent = $$props.menuEvent);
		if ('correctSelect' in $$props) correctSelect = $$props.correctSelect;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, menulist_preview, menuEvent, menulist_data*/ 15) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(2, menulist_preview = []);
					$$invalidate(2, menulist_preview[0] = modules, menulist_preview);
				} else {
					$$invalidate(2, menulist_preview = modules);
				}

				$$invalidate(0, menulist_data = []);

				menulist_preview.map(function (data) {
					let row, col, matrix;
					let count = 0;
					let menulist_item = [];
					$$invalidate(3, menuEvent = []);

					if (data.__text) {
						getClick(data.__text);
					}

					matrix = data._matrix ? data._matrix.split("x") : [];
					row = matrix[0];
					col = matrix[1];

					for (let row_loop = 1; row_loop <= row; row_loop++) {
						for (let col_loop = 1; col_loop <= col; col_loop++) {
							menulist_item.push({
								id: data._id + "_" + row_loop + "_" + col_loop,
								classes: data._correctans && menuEvent[count]
								? "menu off menulist dndTest record"
								: "menu off menulist dndTest",
								correctans: menuEvent[count] ? "1" : "0",
								top: getTop(row_loop, row, data) + 'px',
								left: getLeft(col_loop, col, data) + 'px',
								height: getHeight(row, data) + 'px',
								width: getWidth(col, data) + 'px',
								click_event: menuEvent[count] ? menuEvent[count] : ""
							});

							count++;
						}
					}

					$$invalidate(0, menulist_data = [
						...menulist_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							menulist_item
						}
					]);
				});
			} else {
				$$invalidate(0, menulist_data = []);
			}
		}
	};

	return [menulist_data, modules, menulist_preview, menuEvent, click_handler];
}

class MenulistPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$a, safe_not_equal, { modules: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MenulistPreview",
			options,
			id: create_fragment$a.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<MenulistPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<MenulistPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<MenulistPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\ButtonPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$8 } = globals;
const file$b = "clsSMDragNDrop\\libs\\preview\\ButtonPreview.svelte";

function get_each_context$b(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (76:4) {#if button_preview_data && button_preview_data.length > 0}
function create_if_block$b(ctx) {
	let each_1_anchor;
	let each_value = /*button_preview_data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*button_preview_data*/ 1) {
				each_value = /*button_preview_data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$b(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$b(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$b.name,
		type: "if",
		source: "(76:4) {#if button_preview_data && button_preview_data.length > 0}",
		ctx
	});

	return block;
}

// (77:8) {#each button_preview_data as data, index}
function create_each_block$b(ctx) {
	let div;
	let button;
	let t0_value = (/*data*/ ctx[4].value ? /*data*/ ctx[4].value : '') + "";
	let t0;
	let button_class_value;
	let button_value_value;
	let t1;
	let div_key_value;
	let div_id_value;
	let div_class_value;

	const block = {
		c: function create() {
			div = element("div");
			button = element("button");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(button, "type", "button");
			attr_dev(button, "class", button_class_value = "dnd" + /*data*/ ctx[4].id + " dnd_button");
			attr_dev(button, "name", "");
			attr_dev(button, "tabindex", "-1");
			button.value = button_value_value = /*data*/ ctx[4].value ? /*data*/ ctx[4].value : '';
			attr_dev(button, "data-correctans", "");
			attr_dev(button, "data-defaultans", "");
			attr_dev(button, "data-userans", "");
			add_location(button, file$b, 93, 16, 3458);
			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[4].id);
			attr_dev(div, "class", div_class_value = /*data*/ ctx[4].classes);
			set_style(div, "position", "absolute");
			set_style(div, "top", /*data*/ ctx[4].top);
			set_style(div, "left", /*data*/ ctx[4].left);
			set_style(div, "height", /*data*/ ctx[4].height);
			set_style(div, "width", /*data*/ ctx[4].width);
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-defaultans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "tabindex", "0");
			add_location(div, file$b, 77, 12, 2934);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button);
			append_dev(button, t0);
			append_dev(div, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*button_preview_data*/ 1 && t0_value !== (t0_value = (/*data*/ ctx[4].value ? /*data*/ ctx[4].value : '') + "")) set_data_dev(t0, t0_value);

			if (dirty & /*button_preview_data*/ 1 && button_class_value !== (button_class_value = "dnd" + /*data*/ ctx[4].id + " dnd_button")) {
				attr_dev(button, "class", button_class_value);
			}

			if (dirty & /*button_preview_data*/ 1 && button_value_value !== (button_value_value = /*data*/ ctx[4].value ? /*data*/ ctx[4].value : '')) {
				prop_dev(button, "value", button_value_value);
			}

			if (dirty & /*button_preview_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[4].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*button_preview_data*/ 1 && div_class_value !== (div_class_value = /*data*/ ctx[4].classes)) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*button_preview_data*/ 1) {
				set_style(div, "top", /*data*/ ctx[4].top);
			}

			if (dirty & /*button_preview_data*/ 1) {
				set_style(div, "left", /*data*/ ctx[4].left);
			}

			if (dirty & /*button_preview_data*/ 1) {
				set_style(div, "height", /*data*/ ctx[4].height);
			}

			if (dirty & /*button_preview_data*/ 1) {
				set_style(div, "width", /*data*/ ctx[4].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$b.name,
		type: "each",
		source: "(77:8) {#each button_preview_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let div;
	let if_block = /*button_preview_data*/ ctx[0] && /*button_preview_data*/ ctx[0].length > 0 && create_if_block$b(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$b, 74, 0, 2798);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*button_preview_data*/ ctx[0] && /*button_preview_data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$b(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ButtonPreview', slots, []);
	let { modules } = $$props;
	let { containerID = '' } = $$props;
	let button_preview_data = [];
	let button_preview = modules;

	afterUpdate(() => {
		if (button_preview_data.length > 0 && containerID != '') {
			button_preview.map(function (data) {
				let eventArr = [
					"onclick",
					"ondblclick",
					"oncontextmenu",
					"ondragstart",
					"ondrag",
					"ondragend",
					"ondrop",
					"onmouseover",
					"onmouseup",
					"onmousedown",
					"onchange",
					"onfocus",
					"onblur",
					"onkeyup",
					"onkeypress",
					"onkeydown"
				];

				let container = document.querySelector('#' + containerID);

				eventArr.forEach(function (value, index) {
					if (!!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.removeAttribute(eventArr[index]);
							});
						}
					}
				});

				Object.keys(data).forEach(function (key) {
					let evt = key.replace("_", "").trim();

					if (eventArr.includes(evt) && !!container) {
						let new_container = container.querySelectorAll(".dnd" + data._id);

						if (!!new_container) {
							new_container.forEach(function (element) {
								element.setAttribute(evt, data[key]);
							});
						}
					}
				});
			});
		}
	});

	const writable_props = ['modules', 'containerID'];

	Object_1$8.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		modules,
		containerID,
		button_preview_data,
		button_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(1, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(2, containerID = $$props.containerID);
		if ('button_preview_data' in $$props) $$invalidate(0, button_preview_data = $$props.button_preview_data);
		if ('button_preview' in $$props) $$invalidate(3, button_preview = $$props.button_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, button_preview, button_preview_data*/ 11) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, button_preview = []);
					$$invalidate(3, button_preview[0] = modules, button_preview);
				} else {
					$$invalidate(3, button_preview = modules);
				}

				$$invalidate(0, button_preview_data = []);

				button_preview.map(function (data) {
					$$invalidate(0, button_preview_data = [
						...button_preview_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id,
							classes: "drag-resize dndTest " + data._class,
							value: data._value
						}
					]);
				});
			} else {
				$$invalidate(0, button_preview_data = []);
			}
		}
	};

	return [button_preview_data, modules, containerID, button_preview];
}

class ButtonPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$b, create_fragment$b, safe_not_equal, { modules: 1, containerID: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ButtonPreview",
			options,
			id: create_fragment$b.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[1] === undefined && !('modules' in props)) {
			console.warn("<ButtonPreview> was created without expected prop 'modules'");
		}
	}

	get modules() {
		throw new Error("<ButtonPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<ButtonPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<ButtonPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<ButtonPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\TabPillsPreview.svelte generated by Svelte v3.40.2 */
const file$c = "clsSMDragNDrop\\libs\\preview\\TabPillsPreview.svelte";

function get_each_context$c(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

function get_each_context_1$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (38:4) {#if tab_pills_preview && tab_pills_preview.length > 0}
function create_if_block$c(ctx) {
	let ul;
	let t;
	let div;
	let current;
	let each_value_1 = /*tab_pills_preview*/ ctx[2];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
	}

	let each_value = /*tab_pills_preview*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "class", "nav nav-pills margin-bottom dndTest");
			attr_dev(ul, "data-correctans", "");
			attr_dev(ul, "data-userans", "");
			attr_dev(ul, "data-defaultans", "");
			attr_dev(ul, "role", "tablist");
			add_location(ul, file$c, 38, 8, 1272);
			attr_dev(div, "class", "tab-content dndTest");
			attr_dev(div, "type", "tab");
			set_style(div, "position", "relative");
			add_location(div, file$c, 45, 8, 1766);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			insert_dev(target, t, anchor);
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 4) {
				each_value_1 = /*tab_pills_preview*/ ctx[2];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$3(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*tab_pills_preview, uxml, window, checkImages*/ 7) {
				each_value = /*tab_pills_preview*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$c(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$c(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(38:4) {#if tab_pills_preview && tab_pills_preview.length > 0}",
		ctx
	});

	return block;
}

// (40:12) {#each tab_pills_preview as data, index}
function create_each_block_1$3(ctx) {
	let li;
	let a;
	let t0_value = /*data*/ ctx[5]._value + "";
	let t0;
	let a_class_value;
	let a_href_value;
	let a_data_bs_target_value;
	let t1;
	let li_key_value;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(a, "class", a_class_value = "nav-link" + (/*data*/ ctx[5]._display == "1" ? " active" : ""));
			attr_dev(a, "href", a_href_value = "#dnd" + /*data*/ ctx[5]._id);
			attr_dev(a, "data-bs-toggle", "pill");
			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#dnd" + /*data*/ ctx[5]._id);
			add_location(a, file$c, 41, 20, 1536);
			attr_dev(li, "key", li_key_value = "tab_pills_list_" + /*index*/ ctx[7]);
			attr_dev(li, "class", "nav-item");
			add_location(li, file$c, 40, 16, 1461);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(li, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 4 && t0_value !== (t0_value = /*data*/ ctx[5]._value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*tab_pills_preview*/ 4 && a_class_value !== (a_class_value = "nav-link" + (/*data*/ ctx[5]._display == "1" ? " active" : ""))) {
				attr_dev(a, "class", a_class_value);
			}

			if (dirty & /*tab_pills_preview*/ 4 && a_href_value !== (a_href_value = "#dnd" + /*data*/ ctx[5]._id)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*tab_pills_preview*/ 4 && a_data_bs_target_value !== (a_data_bs_target_value = "#dnd" + /*data*/ ctx[5]._id)) {
				attr_dev(a, "data-bs-target", a_data_bs_target_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$3.name,
		type: "each",
		source: "(40:12) {#each tab_pills_preview as data, index}",
		ctx
	});

	return block;
}

// (58:20) {#if data._bgimg}
function create_if_block_1$6(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");

			if (!src_url_equal(img.src, img_src_value = (window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[5]._bgimg)) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[5]._alt);
			add_location(img, file$c, 58, 24, 2365);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[4], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 4 && !src_url_equal(img.src, img_src_value = (window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[5]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*tab_pills_preview*/ 4 && img_alt_value !== (img_alt_value = /*data*/ ctx[5]._alt)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$6.name,
		type: "if",
		source: "(58:20) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (47:12) {#each tab_pills_preview as data, index}
function create_each_block$c(ctx) {
	let div;
	let t0;
	let dragpreview;
	let t1;
	let droppreview;
	let t2;
	let radiopreview;
	let t3;
	let selectpreview;
	let t4;
	let textboxpreview;
	let t5;
	let checkboxpreview;
	let t6;
	let tabheadpreview;
	let t7;
	let hotspotpreview;
	let t8;
	let menulistpreview;
	let t9;
	let div_key_value;
	let div_id_value;
	let div_class_value;
	let current;
	let if_block = /*data*/ ctx[5]._bgimg && create_if_block_1$6(ctx);

	dragpreview = new DragPreview({
			props: {
				modules: /*data*/ ctx[5].drag ? /*data*/ ctx[5].drag : []
			},
			$$inline: true
		});

	droppreview = new DropPreview({
			props: {
				modules: /*data*/ ctx[5].drop ? /*data*/ ctx[5].drop : [],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	radiopreview = new RadioPreview({
			props: {
				modules: /*data*/ ctx[5].radio ? /*data*/ ctx[5].radio : [],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	selectpreview = new SelectPreview({
			props: {
				modules: /*data*/ ctx[5].select ? /*data*/ ctx[5].select : [],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	textboxpreview = new TextboxPreview({
			props: {
				modules: /*data*/ ctx[5].textbox ? /*data*/ ctx[5].textbox : [],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	checkboxpreview = new CheckboxPreview({
			props: {
				modules: /*data*/ ctx[5].checkbox ? /*data*/ ctx[5].checkbox : [],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	tabheadpreview = new TabheadPreview({
			props: {
				modules: /*data*/ ctx[5].tabhead ? /*data*/ ctx[5].tabhead : []
			},
			$$inline: true
		});

	hotspotpreview = new HotspotPreview({
			props: {
				modules: /*data*/ ctx[5].hotspot ? /*data*/ ctx[5].hotspot : [],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	menulistpreview = new MenulistPreview({
			props: {
				modules: /*data*/ ctx[5].menulist ? /*data*/ ctx[5].menulist : []
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(dragpreview.$$.fragment);
			t1 = space();
			create_component(droppreview.$$.fragment);
			t2 = space();
			create_component(radiopreview.$$.fragment);
			t3 = space();
			create_component(selectpreview.$$.fragment);
			t4 = space();
			create_component(textboxpreview.$$.fragment);
			t5 = space();
			create_component(checkboxpreview.$$.fragment);
			t6 = space();
			create_component(tabheadpreview.$$.fragment);
			t7 = space();
			create_component(hotspotpreview.$$.fragment);
			t8 = space();
			create_component(menulistpreview.$$.fragment);
			t9 = space();
			attr_dev(div, "key", div_key_value = "tab_pills_preview_" + /*index*/ ctx[7]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5]._id);
			attr_dev(div, "type", "tab");
			attr_dev(div, "role", "tabpanel");
			attr_dev(div, "class", div_class_value = "tab-pane " + (/*data*/ ctx[5]._display == "1" ? "active" : ""));
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "data-defaultans", "");
			add_location(div, file$c, 47, 16, 1908);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(dragpreview, div, null);
			append_dev(div, t1);
			mount_component(droppreview, div, null);
			append_dev(div, t2);
			mount_component(radiopreview, div, null);
			append_dev(div, t3);
			mount_component(selectpreview, div, null);
			append_dev(div, t4);
			mount_component(textboxpreview, div, null);
			append_dev(div, t5);
			mount_component(checkboxpreview, div, null);
			append_dev(div, t6);
			mount_component(tabheadpreview, div, null);
			append_dev(div, t7);
			mount_component(hotspotpreview, div, null);
			append_dev(div, t8);
			mount_component(menulistpreview, div, null);
			append_dev(div, t9);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[5]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$6(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const dragpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) dragpreview_changes.modules = /*data*/ ctx[5].drag ? /*data*/ ctx[5].drag : [];
			dragpreview.$set(dragpreview_changes);
			const droppreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) droppreview_changes.modules = /*data*/ ctx[5].drop ? /*data*/ ctx[5].drop : [];
			if (dirty & /*uxml*/ 1) droppreview_changes.uxml = /*uxml*/ ctx[0];
			droppreview.$set(droppreview_changes);
			const radiopreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) radiopreview_changes.modules = /*data*/ ctx[5].radio ? /*data*/ ctx[5].radio : [];
			if (dirty & /*uxml*/ 1) radiopreview_changes.uxml = /*uxml*/ ctx[0];
			radiopreview.$set(radiopreview_changes);
			const selectpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) selectpreview_changes.modules = /*data*/ ctx[5].select ? /*data*/ ctx[5].select : [];
			if (dirty & /*uxml*/ 1) selectpreview_changes.uxml = /*uxml*/ ctx[0];
			selectpreview.$set(selectpreview_changes);
			const textboxpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) textboxpreview_changes.modules = /*data*/ ctx[5].textbox ? /*data*/ ctx[5].textbox : [];
			if (dirty & /*uxml*/ 1) textboxpreview_changes.uxml = /*uxml*/ ctx[0];
			textboxpreview.$set(textboxpreview_changes);
			const checkboxpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) checkboxpreview_changes.modules = /*data*/ ctx[5].checkbox ? /*data*/ ctx[5].checkbox : [];
			if (dirty & /*uxml*/ 1) checkboxpreview_changes.uxml = /*uxml*/ ctx[0];
			checkboxpreview.$set(checkboxpreview_changes);
			const tabheadpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) tabheadpreview_changes.modules = /*data*/ ctx[5].tabhead ? /*data*/ ctx[5].tabhead : [];
			tabheadpreview.$set(tabheadpreview_changes);
			const hotspotpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) hotspotpreview_changes.modules = /*data*/ ctx[5].hotspot ? /*data*/ ctx[5].hotspot : [];
			if (dirty & /*uxml*/ 1) hotspotpreview_changes.uxml = /*uxml*/ ctx[0];
			hotspotpreview.$set(hotspotpreview_changes);
			const menulistpreview_changes = {};
			if (dirty & /*tab_pills_preview*/ 4) menulistpreview_changes.modules = /*data*/ ctx[5].menulist ? /*data*/ ctx[5].menulist : [];
			menulistpreview.$set(menulistpreview_changes);

			if (!current || dirty & /*tab_pills_preview*/ 4 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (!current || dirty & /*tab_pills_preview*/ 4 && div_class_value !== (div_class_value = "tab-pane " + (/*data*/ ctx[5]._display == "1" ? "active" : ""))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dragpreview.$$.fragment, local);
			transition_in(droppreview.$$.fragment, local);
			transition_in(radiopreview.$$.fragment, local);
			transition_in(selectpreview.$$.fragment, local);
			transition_in(textboxpreview.$$.fragment, local);
			transition_in(checkboxpreview.$$.fragment, local);
			transition_in(tabheadpreview.$$.fragment, local);
			transition_in(hotspotpreview.$$.fragment, local);
			transition_in(menulistpreview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dragpreview.$$.fragment, local);
			transition_out(droppreview.$$.fragment, local);
			transition_out(radiopreview.$$.fragment, local);
			transition_out(selectpreview.$$.fragment, local);
			transition_out(textboxpreview.$$.fragment, local);
			transition_out(checkboxpreview.$$.fragment, local);
			transition_out(tabheadpreview.$$.fragment, local);
			transition_out(hotspotpreview.$$.fragment, local);
			transition_out(menulistpreview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(dragpreview);
			destroy_component(droppreview);
			destroy_component(radiopreview);
			destroy_component(selectpreview);
			destroy_component(textboxpreview);
			destroy_component(checkboxpreview);
			destroy_component(tabheadpreview);
			destroy_component(hotspotpreview);
			destroy_component(menulistpreview);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$c.name,
		type: "each",
		source: "(47:12) {#each tab_pills_preview as data, index}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let div;
	let current;
	let if_block = /*tab_pills_preview*/ ctx[2] && /*tab_pills_preview*/ ctx[2].length > 0 && create_if_block$c(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$c, 36, 0, 1196);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*tab_pills_preview*/ ctx[2] && /*tab_pills_preview*/ ctx[2].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*tab_pills_preview*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$c(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TabPillsPreview', slots, []);
	let { modules } = $$props;
	let { uxml = '' } = $$props;
	let { checkImages } = $$props;
	let tab_pills_preview = modules;
	const writable_props = ['modules', 'uxml', 'checkImages'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPillsPreview> was created with unknown prop '${key}'`);
	});

	const load_handler = () => {
		checkImages(2);
	};

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(3, modules = $$props.modules);
		if ('uxml' in $$props) $$invalidate(0, uxml = $$props.uxml);
		if ('checkImages' in $$props) $$invalidate(1, checkImages = $$props.checkImages);
	};

	$$self.$capture_state = () => ({
		DragPreview,
		DropPreview,
		RadioPreview,
		SelectPreview,
		TextboxPreview,
		CheckboxPreview,
		TabheadPreview,
		HotspotPreview,
		MenulistPreview,
		modules,
		uxml,
		checkImages,
		tab_pills_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(3, modules = $$props.modules);
		if ('uxml' in $$props) $$invalidate(0, uxml = $$props.uxml);
		if ('checkImages' in $$props) $$invalidate(1, checkImages = $$props.checkImages);
		if ('tab_pills_preview' in $$props) $$invalidate(2, tab_pills_preview = $$props.tab_pills_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 8) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(2, tab_pills_preview = []);
					$$invalidate(2, tab_pills_preview[0] = modules, tab_pills_preview);
				} else {
					$$invalidate(2, tab_pills_preview = modules);
				}
			} else {
				$$invalidate(2, tab_pills_preview = []);
			}
		}
	};

	return [uxml, checkImages, tab_pills_preview, modules, load_handler];
}

class TabPillsPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$c, create_fragment$c, safe_not_equal, { modules: 3, uxml: 0, checkImages: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TabPillsPreview",
			options,
			id: create_fragment$c.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[3] === undefined && !('modules' in props)) {
			console.warn("<TabPillsPreview> was created without expected prop 'modules'");
		}

		if (/*checkImages*/ ctx[1] === undefined && !('checkImages' in props)) {
			console.warn("<TabPillsPreview> was created without expected prop 'checkImages'");
		}
	}

	get modules() {
		throw new Error("<TabPillsPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<TabPillsPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<TabPillsPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<TabPillsPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImages() {
		throw new Error("<TabPillsPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImages(value) {
		throw new Error("<TabPillsPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\TabPreview.svelte generated by Svelte v3.40.2 */
const file$d = "clsSMDragNDrop\\libs\\preview\\TabPreview.svelte";

function get_each_context$d(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

function get_each_context_1$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

// (40:4) {#if tab_preview && tab_preview.length > 0}
function create_if_block$d(ctx) {
	let ul;
	let t;
	let div;
	let current;
	let each_value_1 = /*tab_preview*/ ctx[3];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
	}

	let each_value = /*tab_preview*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "class", "nav nav-tabs margin-bottom dndTest mt-3");
			attr_dev(ul, "data-correctans", "");
			attr_dev(ul, "data-userans", "");
			attr_dev(ul, "data-defaultans", "");
			add_location(ul, file$d, 40, 8, 1311);
			attr_dev(div, "class", "tab-content dndTest");
			attr_dev(div, "type", "tab");
			set_style(div, "position", "relative");
			add_location(div, file$d, 47, 8, 1784);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			insert_dev(target, t, anchor);
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview*/ 8) {
				each_value_1 = /*tab_preview*/ ctx[3];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$4(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*tab_preview, checkImages, uxml, containerID, window*/ 15) {
				each_value = /*tab_preview*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$d(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$d(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$d.name,
		type: "if",
		source: "(40:4) {#if tab_preview && tab_preview.length > 0}",
		ctx
	});

	return block;
}

// (42:12) {#each tab_preview as data, index}
function create_each_block_1$4(ctx) {
	let li;
	let a;
	let t0_value = /*data*/ ctx[6]._value + "";
	let t0;
	let a_href_value;
	let a_data_bs_target_value;
	let a_class_value;
	let t1;
	let li_key_value;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(a, "href", a_href_value = "#dnd" + /*data*/ ctx[6]._id);
			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#dnd" + /*data*/ ctx[6]._id);
			attr_dev(a, "data-bs-toggle", "tab");

			attr_dev(a, "class", a_class_value = /*data*/ ctx[6]._display == "1"
			? " active nav-link"
			: " nav-link");

			add_location(a, file$d, 43, 20, 1552);
			attr_dev(li, "key", li_key_value = "tab_list_" + /*index*/ ctx[8]);
			attr_dev(li, "class", "nav-item");
			add_location(li, file$d, 42, 16, 1483);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(li, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview*/ 8 && t0_value !== (t0_value = /*data*/ ctx[6]._value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*tab_preview*/ 8 && a_href_value !== (a_href_value = "#dnd" + /*data*/ ctx[6]._id)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*tab_preview*/ 8 && a_data_bs_target_value !== (a_data_bs_target_value = "#dnd" + /*data*/ ctx[6]._id)) {
				attr_dev(a, "data-bs-target", a_data_bs_target_value);
			}

			if (dirty & /*tab_preview*/ 8 && a_class_value !== (a_class_value = /*data*/ ctx[6]._display == "1"
			? " active nav-link"
			: " nav-link")) {
				attr_dev(a, "class", a_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$4.name,
		type: "each",
		source: "(42:12) {#each tab_preview as data, index}",
		ctx
	});

	return block;
}

// (60:20) {#if data._bgimg}
function create_if_block_1$7(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");

			if (!src_url_equal(img.src, img_src_value = (window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[6]._bgimg)) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[6]._alt);
			add_location(img, file$d, 60, 24, 2371);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview*/ 8 && !src_url_equal(img.src, img_src_value = (window.inNative
			? "https://s3.amazonaws.com/jigyaasa_content_static/"
			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[6]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*tab_preview*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[6]._alt)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$7.name,
		type: "if",
		source: "(60:20) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (49:12) {#each tab_preview as data, index}
function create_each_block$d(ctx) {
	let div;
	let t0;
	let dragpreview;
	let t1;
	let droppreview;
	let t2;
	let radiopreview;
	let t3;
	let selectpreview;
	let t4;
	let textboxpreview;
	let t5;
	let checkboxpreview;
	let t6;
	let tabheadpreview;
	let t7;
	let hotspotpreview;
	let t8;
	let menulistpreview;
	let t9;
	let tabpillspreview;
	let t10;
	let div_key_value;
	let div_id_value;
	let div_class_value;
	let current;
	let if_block = /*data*/ ctx[6]._bgimg && create_if_block_1$7(ctx);

	dragpreview = new DragPreview({
			props: {
				modules: /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	droppreview = new DropPreview({
			props: {
				modules: /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	radiopreview = new RadioPreview({
			props: {
				modules: /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	selectpreview = new SelectPreview({
			props: {
				modules: /*data*/ ctx[6].select ? /*data*/ ctx[6].select : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	textboxpreview = new TextboxPreview({
			props: {
				modules: /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	checkboxpreview = new CheckboxPreview({
			props: {
				modules: /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	tabheadpreview = new TabheadPreview({
			props: {
				modules: /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	hotspotpreview = new HotspotPreview({
			props: {
				modules: /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	menulistpreview = new MenulistPreview({
			props: {
				modules: /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	tabpillspreview = new TabPillsPreview({
			props: {
				modules: /*data*/ ctx[6].tab ? /*data*/ ctx[6].tab : [],
				checkImages: /*checkImages*/ ctx[2],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(dragpreview.$$.fragment);
			t1 = space();
			create_component(droppreview.$$.fragment);
			t2 = space();
			create_component(radiopreview.$$.fragment);
			t3 = space();
			create_component(selectpreview.$$.fragment);
			t4 = space();
			create_component(textboxpreview.$$.fragment);
			t5 = space();
			create_component(checkboxpreview.$$.fragment);
			t6 = space();
			create_component(tabheadpreview.$$.fragment);
			t7 = space();
			create_component(hotspotpreview.$$.fragment);
			t8 = space();
			create_component(menulistpreview.$$.fragment);
			t9 = space();
			create_component(tabpillspreview.$$.fragment);
			t10 = space();
			attr_dev(div, "key", div_key_value = "tab_preview_" + /*index*/ ctx[8]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[6]._id);
			attr_dev(div, "role", "tabpanel");
			attr_dev(div, "type", "tab");
			attr_dev(div, "class", div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""));
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "data-defaultans", "");
			add_location(div, file$d, 49, 16, 1920);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(dragpreview, div, null);
			append_dev(div, t1);
			mount_component(droppreview, div, null);
			append_dev(div, t2);
			mount_component(radiopreview, div, null);
			append_dev(div, t3);
			mount_component(selectpreview, div, null);
			append_dev(div, t4);
			mount_component(textboxpreview, div, null);
			append_dev(div, t5);
			mount_component(checkboxpreview, div, null);
			append_dev(div, t6);
			mount_component(tabheadpreview, div, null);
			append_dev(div, t7);
			mount_component(hotspotpreview, div, null);
			append_dev(div, t8);
			mount_component(menulistpreview, div, null);
			append_dev(div, t9);
			mount_component(tabpillspreview, div, null);
			append_dev(div, t10);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[6]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$7(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const dragpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) dragpreview_changes.modules = /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : [];
			if (dirty & /*containerID*/ 1) dragpreview_changes.containerID = /*containerID*/ ctx[0];
			dragpreview.$set(dragpreview_changes);
			const droppreview_changes = {};
			if (dirty & /*tab_preview*/ 8) droppreview_changes.modules = /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : [];
			if (dirty & /*containerID*/ 1) droppreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) droppreview_changes.uxml = /*uxml*/ ctx[1];
			droppreview.$set(droppreview_changes);
			const radiopreview_changes = {};
			if (dirty & /*tab_preview*/ 8) radiopreview_changes.modules = /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : [];
			if (dirty & /*containerID*/ 1) radiopreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) radiopreview_changes.uxml = /*uxml*/ ctx[1];
			radiopreview.$set(radiopreview_changes);
			const selectpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) selectpreview_changes.modules = /*data*/ ctx[6].select ? /*data*/ ctx[6].select : [];
			if (dirty & /*containerID*/ 1) selectpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) selectpreview_changes.uxml = /*uxml*/ ctx[1];
			selectpreview.$set(selectpreview_changes);
			const textboxpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) textboxpreview_changes.modules = /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : [];
			if (dirty & /*containerID*/ 1) textboxpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) textboxpreview_changes.uxml = /*uxml*/ ctx[1];
			textboxpreview.$set(textboxpreview_changes);
			const checkboxpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) checkboxpreview_changes.modules = /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : [];
			if (dirty & /*containerID*/ 1) checkboxpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) checkboxpreview_changes.uxml = /*uxml*/ ctx[1];
			checkboxpreview.$set(checkboxpreview_changes);
			const tabheadpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) tabheadpreview_changes.modules = /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : [];
			if (dirty & /*containerID*/ 1) tabheadpreview_changes.containerID = /*containerID*/ ctx[0];
			tabheadpreview.$set(tabheadpreview_changes);
			const hotspotpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) hotspotpreview_changes.modules = /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : [];
			if (dirty & /*containerID*/ 1) hotspotpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) hotspotpreview_changes.uxml = /*uxml*/ ctx[1];
			hotspotpreview.$set(hotspotpreview_changes);
			const menulistpreview_changes = {};
			if (dirty & /*tab_preview*/ 8) menulistpreview_changes.modules = /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : [];
			if (dirty & /*containerID*/ 1) menulistpreview_changes.containerID = /*containerID*/ ctx[0];
			menulistpreview.$set(menulistpreview_changes);
			const tabpillspreview_changes = {};
			if (dirty & /*tab_preview*/ 8) tabpillspreview_changes.modules = /*data*/ ctx[6].tab ? /*data*/ ctx[6].tab : [];
			if (dirty & /*checkImages*/ 4) tabpillspreview_changes.checkImages = /*checkImages*/ ctx[2];
			if (dirty & /*uxml*/ 2) tabpillspreview_changes.uxml = /*uxml*/ ctx[1];
			tabpillspreview.$set(tabpillspreview_changes);

			if (!current || dirty & /*tab_preview*/ 8 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[6]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (!current || dirty & /*tab_preview*/ 8 && div_class_value !== (div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dragpreview.$$.fragment, local);
			transition_in(droppreview.$$.fragment, local);
			transition_in(radiopreview.$$.fragment, local);
			transition_in(selectpreview.$$.fragment, local);
			transition_in(textboxpreview.$$.fragment, local);
			transition_in(checkboxpreview.$$.fragment, local);
			transition_in(tabheadpreview.$$.fragment, local);
			transition_in(hotspotpreview.$$.fragment, local);
			transition_in(menulistpreview.$$.fragment, local);
			transition_in(tabpillspreview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dragpreview.$$.fragment, local);
			transition_out(droppreview.$$.fragment, local);
			transition_out(radiopreview.$$.fragment, local);
			transition_out(selectpreview.$$.fragment, local);
			transition_out(textboxpreview.$$.fragment, local);
			transition_out(checkboxpreview.$$.fragment, local);
			transition_out(tabheadpreview.$$.fragment, local);
			transition_out(hotspotpreview.$$.fragment, local);
			transition_out(menulistpreview.$$.fragment, local);
			transition_out(tabpillspreview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(dragpreview);
			destroy_component(droppreview);
			destroy_component(radiopreview);
			destroy_component(selectpreview);
			destroy_component(textboxpreview);
			destroy_component(checkboxpreview);
			destroy_component(tabheadpreview);
			destroy_component(hotspotpreview);
			destroy_component(menulistpreview);
			destroy_component(tabpillspreview);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$d.name,
		type: "each",
		source: "(49:12) {#each tab_preview as data, index}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let div;
	let current;
	let if_block = /*tab_preview*/ ctx[3] && /*tab_preview*/ ctx[3].length > 0 && create_if_block$d(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$d, 38, 0, 1247);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*tab_preview*/ ctx[3] && /*tab_preview*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*tab_preview*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$d(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TabPreview', slots, []);
	let { modules } = $$props;
	let { containerID } = $$props;
	let { uxml = '' } = $$props;
	let { checkImages } = $$props;
	let tab_preview = modules;
	const writable_props = ['modules', 'containerID', 'uxml', 'checkImages'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPreview> was created with unknown prop '${key}'`);
	});

	const load_handler = () => {
		checkImages(2);
	};

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(0, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(1, uxml = $$props.uxml);
		if ('checkImages' in $$props) $$invalidate(2, checkImages = $$props.checkImages);
	};

	$$self.$capture_state = () => ({
		DragPreview,
		DropPreview,
		RadioPreview,
		SelectPreview,
		TextboxPreview,
		CheckboxPreview,
		TabheadPreview,
		HotspotPreview,
		MenulistPreview,
		TabPillsPreview,
		modules,
		containerID,
		uxml,
		checkImages,
		tab_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(0, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(1, uxml = $$props.uxml);
		if ('checkImages' in $$props) $$invalidate(2, checkImages = $$props.checkImages);
		if ('tab_preview' in $$props) $$invalidate(3, tab_preview = $$props.tab_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 16) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, tab_preview = []);
					$$invalidate(3, tab_preview[0] = modules, tab_preview);
				} else {
					$$invalidate(3, tab_preview = modules);
				}
			} else {
				$$invalidate(3, tab_preview = []);
			}
		}
	};

	return [containerID, uxml, checkImages, tab_preview, modules, load_handler];
}

class TabPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
			modules: 4,
			containerID: 0,
			uxml: 1,
			checkImages: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TabPreview",
			options,
			id: create_fragment$d.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<TabPreview> was created without expected prop 'modules'");
		}

		if (/*containerID*/ ctx[0] === undefined && !('containerID' in props)) {
			console.warn("<TabPreview> was created without expected prop 'containerID'");
		}

		if (/*checkImages*/ ctx[2] === undefined && !('checkImages' in props)) {
			console.warn("<TabPreview> was created without expected prop 'checkImages'");
		}
	}

	get modules() {
		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImages() {
		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImages(value) {
		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\preview\StepPreview.svelte generated by Svelte v3.40.2 */
const file$e = "clsSMDragNDrop\\libs\\preview\\StepPreview.svelte";

function get_each_context$e(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	child_ctx[9] = i;
	return child_ctx;
}

// (42:4) {#if step && step.length > 0}
function create_if_block$e(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*step*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*step, containerID, checkImages, uxml, window*/ 15) {
				each_value = /*step*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$e(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$e(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(42:4) {#if step && step.length > 0}",
		ctx
	});

	return block;
}

// (54:16) {#if data._bgimg}
function create_if_block_1$8(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	function error_handler(...args) {
		return /*error_handler*/ ctx[6](/*data*/ ctx[7], ...args);
	}

	const block = {
		c: function create() {
			img = element("img");

			if (!src_url_equal(img.src, img_src_value = window.inNative
			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*data*/ ctx[7]._bgimg
			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[7]._bgimg)) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[7]._alt);
			add_location(img, file$e, 54, 5, 1819);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(img, "load", /*load_handler*/ ctx[5], false, false, false),
					listen_dev(img, "error", error_handler, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*step*/ 8 && !src_url_equal(img.src, img_src_value = window.inNative
			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*data*/ ctx[7]._bgimg
			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[7]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*step*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[7]._alt)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$8.name,
		type: "if",
		source: "(54:16) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (43:8) {#each step as data, index}
function create_each_block$e(ctx) {
	let div;
	let t0;
	let dragpreview;
	let t1;
	let droppreview;
	let t2;
	let radiopreview;
	let t3;
	let selectpreview;
	let t4;
	let textboxpreview;
	let t5;
	let checkboxpreview;
	let t6;
	let tabheadpreview;
	let t7;
	let hotspotpreview;
	let t8;
	let menulistpreview;
	let t9;
	let multilineboxpreview;
	let t10;
	let tabpreview;
	let t11;
	let buttonpreview;
	let t12;
	let labelpreview;
	let t13;
	let div_key_value;
	let div_id_value;
	let current;
	let if_block = /*data*/ ctx[7]._bgimg && create_if_block_1$8(ctx);

	dragpreview = new DragPreview({
			props: {
				modules: /*data*/ ctx[7].drag ? /*data*/ ctx[7].drag : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	droppreview = new DropPreview({
			props: {
				modules: /*data*/ ctx[7].drop ? /*data*/ ctx[7].drop : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	radiopreview = new RadioPreview({
			props: {
				modules: /*data*/ ctx[7].radio ? /*data*/ ctx[7].radio : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	selectpreview = new SelectPreview({
			props: {
				modules: /*data*/ ctx[7].select ? /*data*/ ctx[7].select : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	textboxpreview = new TextboxPreview({
			props: {
				modules: /*data*/ ctx[7].textbox ? /*data*/ ctx[7].textbox : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	checkboxpreview = new CheckboxPreview({
			props: {
				modules: /*data*/ ctx[7].checkbox ? /*data*/ ctx[7].checkbox : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	tabheadpreview = new TabheadPreview({
			props: {
				modules: /*data*/ ctx[7].tabhead ? /*data*/ ctx[7].tabhead : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	hotspotpreview = new HotspotPreview({
			props: {
				modules: /*data*/ ctx[7].hotspot ? /*data*/ ctx[7].hotspot : [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	menulistpreview = new MenulistPreview({
			props: {
				modules: /*data*/ ctx[7].menulist ? /*data*/ ctx[7].menulist : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	multilineboxpreview = new MultilineboxPreview({
			props: {
				modules: /*data*/ ctx[7].multilinebox
				? /*data*/ ctx[7].multilinebox
				: [],
				containerID: /*containerID*/ ctx[0],
				uxml: /*uxml*/ ctx[1]
			},
			$$inline: true
		});

	tabpreview = new TabPreview({
			props: {
				checkImages: /*checkImages*/ ctx[2],
				modules: /*data*/ ctx[7].tab ? /*data*/ ctx[7].tab : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	buttonpreview = new ButtonPreview({
			props: {
				modules: /*data*/ ctx[7].button ? /*data*/ ctx[7].button : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	labelpreview = new LabelPreview({
			props: {
				modules: /*data*/ ctx[7].label ? /*data*/ ctx[7].label : [],
				containerID: /*containerID*/ ctx[0]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(dragpreview.$$.fragment);
			t1 = space();
			create_component(droppreview.$$.fragment);
			t2 = space();
			create_component(radiopreview.$$.fragment);
			t3 = space();
			create_component(selectpreview.$$.fragment);
			t4 = space();
			create_component(textboxpreview.$$.fragment);
			t5 = space();
			create_component(checkboxpreview.$$.fragment);
			t6 = space();
			create_component(tabheadpreview.$$.fragment);
			t7 = space();
			create_component(hotspotpreview.$$.fragment);
			t8 = space();
			create_component(menulistpreview.$$.fragment);
			t9 = space();
			create_component(multilineboxpreview.$$.fragment);
			t10 = space();
			create_component(tabpreview.$$.fragment);
			t11 = space();
			create_component(buttonpreview.$$.fragment);
			t12 = space();
			create_component(labelpreview.$$.fragment);
			t13 = space();
			attr_dev(div, "key", div_key_value = /*index*/ ctx[9]);
			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[7]._id);
			attr_dev(div, "type", "step");
			attr_dev(div, "class", "step dndTest");
			set_style(div, "position", "relative");
			attr_dev(div, "data-ddisplay", "");
			attr_dev(div, "data-udisplay", "");
			attr_dev(div, "data-cdisplay", "");
			add_location(div, file$e, 43, 12, 1477);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(dragpreview, div, null);
			append_dev(div, t1);
			mount_component(droppreview, div, null);
			append_dev(div, t2);
			mount_component(radiopreview, div, null);
			append_dev(div, t3);
			mount_component(selectpreview, div, null);
			append_dev(div, t4);
			mount_component(textboxpreview, div, null);
			append_dev(div, t5);
			mount_component(checkboxpreview, div, null);
			append_dev(div, t6);
			mount_component(tabheadpreview, div, null);
			append_dev(div, t7);
			mount_component(hotspotpreview, div, null);
			append_dev(div, t8);
			mount_component(menulistpreview, div, null);
			append_dev(div, t9);
			mount_component(multilineboxpreview, div, null);
			append_dev(div, t10);
			mount_component(tabpreview, div, null);
			append_dev(div, t11);
			mount_component(buttonpreview, div, null);
			append_dev(div, t12);
			mount_component(labelpreview, div, null);
			append_dev(div, t13);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[7]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$8(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const dragpreview_changes = {};
			if (dirty & /*step*/ 8) dragpreview_changes.modules = /*data*/ ctx[7].drag ? /*data*/ ctx[7].drag : [];
			if (dirty & /*containerID*/ 1) dragpreview_changes.containerID = /*containerID*/ ctx[0];
			dragpreview.$set(dragpreview_changes);
			const droppreview_changes = {};
			if (dirty & /*step*/ 8) droppreview_changes.modules = /*data*/ ctx[7].drop ? /*data*/ ctx[7].drop : [];
			if (dirty & /*containerID*/ 1) droppreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) droppreview_changes.uxml = /*uxml*/ ctx[1];
			droppreview.$set(droppreview_changes);
			const radiopreview_changes = {};
			if (dirty & /*step*/ 8) radiopreview_changes.modules = /*data*/ ctx[7].radio ? /*data*/ ctx[7].radio : [];
			if (dirty & /*containerID*/ 1) radiopreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) radiopreview_changes.uxml = /*uxml*/ ctx[1];
			radiopreview.$set(radiopreview_changes);
			const selectpreview_changes = {};
			if (dirty & /*step*/ 8) selectpreview_changes.modules = /*data*/ ctx[7].select ? /*data*/ ctx[7].select : [];
			if (dirty & /*containerID*/ 1) selectpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) selectpreview_changes.uxml = /*uxml*/ ctx[1];
			selectpreview.$set(selectpreview_changes);
			const textboxpreview_changes = {};
			if (dirty & /*step*/ 8) textboxpreview_changes.modules = /*data*/ ctx[7].textbox ? /*data*/ ctx[7].textbox : [];
			if (dirty & /*containerID*/ 1) textboxpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) textboxpreview_changes.uxml = /*uxml*/ ctx[1];
			textboxpreview.$set(textboxpreview_changes);
			const checkboxpreview_changes = {};
			if (dirty & /*step*/ 8) checkboxpreview_changes.modules = /*data*/ ctx[7].checkbox ? /*data*/ ctx[7].checkbox : [];
			if (dirty & /*containerID*/ 1) checkboxpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) checkboxpreview_changes.uxml = /*uxml*/ ctx[1];
			checkboxpreview.$set(checkboxpreview_changes);
			const tabheadpreview_changes = {};
			if (dirty & /*step*/ 8) tabheadpreview_changes.modules = /*data*/ ctx[7].tabhead ? /*data*/ ctx[7].tabhead : [];
			if (dirty & /*containerID*/ 1) tabheadpreview_changes.containerID = /*containerID*/ ctx[0];
			tabheadpreview.$set(tabheadpreview_changes);
			const hotspotpreview_changes = {};
			if (dirty & /*step*/ 8) hotspotpreview_changes.modules = /*data*/ ctx[7].hotspot ? /*data*/ ctx[7].hotspot : [];
			if (dirty & /*containerID*/ 1) hotspotpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) hotspotpreview_changes.uxml = /*uxml*/ ctx[1];
			hotspotpreview.$set(hotspotpreview_changes);
			const menulistpreview_changes = {};
			if (dirty & /*step*/ 8) menulistpreview_changes.modules = /*data*/ ctx[7].menulist ? /*data*/ ctx[7].menulist : [];
			if (dirty & /*containerID*/ 1) menulistpreview_changes.containerID = /*containerID*/ ctx[0];
			menulistpreview.$set(menulistpreview_changes);
			const multilineboxpreview_changes = {};

			if (dirty & /*step*/ 8) multilineboxpreview_changes.modules = /*data*/ ctx[7].multilinebox
			? /*data*/ ctx[7].multilinebox
			: [];

			if (dirty & /*containerID*/ 1) multilineboxpreview_changes.containerID = /*containerID*/ ctx[0];
			if (dirty & /*uxml*/ 2) multilineboxpreview_changes.uxml = /*uxml*/ ctx[1];
			multilineboxpreview.$set(multilineboxpreview_changes);
			const tabpreview_changes = {};
			if (dirty & /*checkImages*/ 4) tabpreview_changes.checkImages = /*checkImages*/ ctx[2];
			if (dirty & /*step*/ 8) tabpreview_changes.modules = /*data*/ ctx[7].tab ? /*data*/ ctx[7].tab : [];
			if (dirty & /*containerID*/ 1) tabpreview_changes.containerID = /*containerID*/ ctx[0];
			tabpreview.$set(tabpreview_changes);
			const buttonpreview_changes = {};
			if (dirty & /*step*/ 8) buttonpreview_changes.modules = /*data*/ ctx[7].button ? /*data*/ ctx[7].button : [];
			if (dirty & /*containerID*/ 1) buttonpreview_changes.containerID = /*containerID*/ ctx[0];
			buttonpreview.$set(buttonpreview_changes);
			const labelpreview_changes = {};
			if (dirty & /*step*/ 8) labelpreview_changes.modules = /*data*/ ctx[7].label ? /*data*/ ctx[7].label : [];
			if (dirty & /*containerID*/ 1) labelpreview_changes.containerID = /*containerID*/ ctx[0];
			labelpreview.$set(labelpreview_changes);

			if (!current || dirty & /*step*/ 8 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[7]._id)) {
				attr_dev(div, "id", div_id_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dragpreview.$$.fragment, local);
			transition_in(droppreview.$$.fragment, local);
			transition_in(radiopreview.$$.fragment, local);
			transition_in(selectpreview.$$.fragment, local);
			transition_in(textboxpreview.$$.fragment, local);
			transition_in(checkboxpreview.$$.fragment, local);
			transition_in(tabheadpreview.$$.fragment, local);
			transition_in(hotspotpreview.$$.fragment, local);
			transition_in(menulistpreview.$$.fragment, local);
			transition_in(multilineboxpreview.$$.fragment, local);
			transition_in(tabpreview.$$.fragment, local);
			transition_in(buttonpreview.$$.fragment, local);
			transition_in(labelpreview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dragpreview.$$.fragment, local);
			transition_out(droppreview.$$.fragment, local);
			transition_out(radiopreview.$$.fragment, local);
			transition_out(selectpreview.$$.fragment, local);
			transition_out(textboxpreview.$$.fragment, local);
			transition_out(checkboxpreview.$$.fragment, local);
			transition_out(tabheadpreview.$$.fragment, local);
			transition_out(hotspotpreview.$$.fragment, local);
			transition_out(menulistpreview.$$.fragment, local);
			transition_out(multilineboxpreview.$$.fragment, local);
			transition_out(tabpreview.$$.fragment, local);
			transition_out(buttonpreview.$$.fragment, local);
			transition_out(labelpreview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(dragpreview);
			destroy_component(droppreview);
			destroy_component(radiopreview);
			destroy_component(selectpreview);
			destroy_component(textboxpreview);
			destroy_component(checkboxpreview);
			destroy_component(tabheadpreview);
			destroy_component(hotspotpreview);
			destroy_component(menulistpreview);
			destroy_component(multilineboxpreview);
			destroy_component(tabpreview);
			destroy_component(buttonpreview);
			destroy_component(labelpreview);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$e.name,
		type: "each",
		source: "(43:8) {#each step as data, index}",
		ctx
	});

	return block;
}

function create_fragment$e(ctx) {
	let div;
	let current;
	let if_block = /*step*/ ctx[3] && /*step*/ ctx[3].length > 0 && create_if_block$e(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$e, 40, 0, 1386);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*step*/ ctx[3] && /*step*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*step*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$e(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('StepPreview', slots, []);
	let { modules } = $$props;
	let { containerID } = $$props;
	let { uxml = '' } = $$props;
	let { checkImages } = $$props;
	let step = modules;
	const writable_props = ['modules', 'containerID', 'uxml', 'checkImages'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepPreview> was created with unknown prop '${key}'`);
	});

	const load_handler = () => {
		checkImages(2);
	};

	const error_handler = (data, e) => {
		e.target.onerror = null;
		e.target.src = "https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg;
	};

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(0, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(1, uxml = $$props.uxml);
		if ('checkImages' in $$props) $$invalidate(2, checkImages = $$props.checkImages);
	};

	$$self.$capture_state = () => ({
		DragPreview,
		DropPreview,
		RadioPreview,
		SelectPreview,
		TextboxPreview,
		CheckboxPreview,
		TabheadPreview,
		HotspotPreview,
		MenulistPreview,
		MultilineboxPreview,
		TabPreview,
		ButtonPreview,
		LabelPreview,
		modules,
		containerID,
		uxml,
		checkImages,
		step
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('containerID' in $$props) $$invalidate(0, containerID = $$props.containerID);
		if ('uxml' in $$props) $$invalidate(1, uxml = $$props.uxml);
		if ('checkImages' in $$props) $$invalidate(2, checkImages = $$props.checkImages);
		if ('step' in $$props) $$invalidate(3, step = $$props.step);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 16) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, step = []);
					$$invalidate(3, step[0] = modules, step);
				} else {
					$$invalidate(3, step = modules);
				}
			} else {
				$$invalidate(3, step = []);
			}
		}
	};

	return [containerID, uxml, checkImages, step, modules, load_handler, error_handler];
}

class StepPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
			modules: 4,
			containerID: 0,
			uxml: 1,
			checkImages: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "StepPreview",
			options,
			id: create_fragment$e.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<StepPreview> was created without expected prop 'modules'");
		}

		if (/*containerID*/ ctx[0] === undefined && !('containerID' in props)) {
			console.warn("<StepPreview> was created without expected prop 'containerID'");
		}

		if (/*checkImages*/ ctx[2] === undefined && !('checkImages' in props)) {
			console.warn("<StepPreview> was created without expected prop 'checkImages'");
		}
	}

	get modules() {
		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerID() {
		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerID(value) {
		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImages() {
		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImages(value) {
		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var css_248z = "@-webkit-keyframes rotate{to{-webkit-transform:rotate(360deg)}}[id^=dndmain]{position:relative;margin:0;padding:0;min-height:30px;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;border-radius:2px;font-family:Arial,\"Helvetica Neue\",Helvetica,sans-serif;font-size:14px;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[id^=dndmain]:after,[id^=dndmain]:before{display:table;line-height:0;content:\"\"}[id^=dndmain] .nav-pills{margin-top:10px}[id^=dndmain]:after{clear:both}[id^=dndmain] :after,[id^=dndmain] :before,[id^=dndmain] :not(.ttsimg_container):not(.tts_img){-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#steps{text-align:center;border:1px solid #999;background-color:#ddd;width:100%;margin-bottom:5px}[id^=dndmain]>img{max-width:none;width:auto!important;height:auto!important}[id^=dndmain] .drag-resize,[id^=dndmain] .only-dragable{position:absolute;left:90px;top:50px;text-align:center;line-height:20px;background-size:100% 100%;padding:0}.dragable,.dropable{padding:2px;display:inline-table}.dndlabel p,.dragable p,.dropable p{display:table-cell;vertical-align:middle;text-align:center}[id^=dndmain] .dragable{cursor:move}[id^=dndmain] .clone{z-index:0!important;border:0!important}[class*=dnd_]{height:99%!important;width:96%!important;resize:none;font-size:12px;color:#000}.dndarea.cursor_move,.dndtabhead.cursor_move,.hotspot_auth,.hotspot_auth .hs_item{opacity:1;background-color:rgba(250,250,250,.6);box-shadow:0 0 1px #000 inset}.cursor_move:hover{background-color:rgba(240,240,240,.6);box-shadow:0 0 1px #000 inset;cursor:move}.cursor_move:hover .elem{display:none}.elemActive{background-color:rgba(173,216,230,.6)!important;opacity:1!important}.detail{position:absolute;display:block;z-index:1001;max-width:150px;border:1px solid #b2b2b2;border-radius:3px;padding:5px;background-color:#c3c3c3;top:0;left:0;color:#fff}.detail .close_detail{position:absolute;cursor:pointer;top:-10px;right:-10px;font-size:25px;font-weight:bolder;background-color:rgba(0,0,0,.6);border:4px double;border-radius:15px;height:22px;width:22px;text-align:center}.dndlabel{font-size:18px;color:#000;text-align:center;background-size:100% 100%;display:inline-table;line-height:20px}.hotspot .hs_item{border:2px solid red}.dndcheckbox,.dndradio{width:14px!important;height:14px!important;margin-bottom:5px!important}.dnd_select{margin:0!important;padding:0!important}.dnd_img,.dnd_select{overflow:hidden}.dnd_textarea,.dnd_textbox{margin:0!important;padding:0!important}.dnd_textbox{overflow:hidden}.dnd_textarea{border:1px solid gray!important;-webkit-border-radius:3px!important;-moz-border-radius:3px!important;border-radius:3px!important}.dnd_button{-webkit-border-radius:2px!important;-moz-border-radius:2px!important;-ms-border-radius:2px!important;border-radius:2px!important;outline:0;background:#f5f5f5;background:-moz-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#f5f5f5),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:-o-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:-ms-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:linear-gradient(to bottom,#f5f5f5 0,#ddd 100%);border:1px solid #a4a4a4;padding:0!important;overflow:hidden}.dnd_button:hover{background:#ddd;background:-moz-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#ddd),color-stop(72%,#f5f5f5));background:-webkit-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:-o-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:-ms-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:linear-gradient(to bottom,#ddd 0,#f5f5f5 72%)}.dnd_button:disabled,.dnd_button:disabled:hover{background:#efefef;color:#816d95;border:1px solid #d9d9d9;cursor:not-allowed}[id^=dndmain] .off,[id^=dndmain] .on{z-index:1000;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;border-radius:2px}.dndtabhead,[id^=dndmain] .off{background:0 0;background:#000;opacity:0;cursor:pointer}[id^=dndmain] .off:hover{background-color:rgba(173,222,252,.3);border:1px solid #addefc;opacity:1!important}[id^=dndmain] .on{background-color:rgba(113,183,250,.6);border:1px solid #71b7fa}.zoom1{-webkit-transform:scale(.25);-moz-transform:scale(.25);-o-transform:scale(.25);transform:scale(.25)}.zoom1,.zoom2,.zoom3,.zoom4,.zoom5,.zoom6,.zoom7{-webkit-transform-origin:top left;-moz-transform-origin:top left;-o-transform-origin:top left;transform-origin:top left}.zoom2{-webkit-transform:scale(.5);-moz-transform:scale(.5);-o-transform:scale(.5);transform:scale(.5)}.zoom3{-webkit-transform:scale(.75);-moz-transform:scale(.75);-o-transform:scale(.75);transform:scale(.75)}.zoom4{-webkit-transform:scale(1);-moz-transform:scale(1);-o-transform:scale(1);transform:scale(1)}.zoom5{-webkit-transform:scale(2);-moz-transform:scale(2);-o-transform:scale(2);transform:scale(2)}.zoom6{-webkit-transform:scale(3);-moz-transform:scale(3);-o-transform:scale(3);transform:scale(3)}.zoom7{-webkit-transform:scale(4);-moz-transform:scale(4);-o-transform:scale(4);transform:scale(4)}.c_zoom,.c_zoom input{width:70px}.c_zoom{position:absolute;top:0;right:0;z-index:1001}.zoom_container{position:relative;overflow:auto;height:100%;width:100%}.record{cursor:pointer}.tools{position:absolute;right:1px;top:2px;z-index:25}.tools .labs-btn{padding:2px 5px}.cursor_move .tools{top:-28px;right:0}.events{height:200px;overflow-x:hidden;border:1px solid #a9a9a9;-ms-border-bottom-left-radius:10px;-ms-border-top-left-radius:10px;-moz-border-bottom-left-radius:10px;-moz-border-top-left-radius:10px;border-bottom-left-radius:10px;border-top-left-radius:10px}.event-input input{position:relative;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;z-index:1;width:90%}.event-input select{position:relative;top:-34px;z-index:0;width:265px}.drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px #ff0 inset;outline:1px solid #00f}.custRad{display:none}.customRad{width:20px;height:20px;display:block;line-height:22px;text-align:center;color:#000;font-size:40pt;cursor:pointer;position:relative}.custRad:checked+.customRad:before{opacity:1}.customRad:before{position:absolute;top:1px;left:1px;height:18px;width:18px;content:'';opacity:0}.dndCenter .dnd_textbox{text-align:center}.falseitemColor:before,.tureitemColor:before{content:'\\2713';color:#fff;font-size:15px;line-height:18px}.tureitemColor:before{background:green}.falseitemColor:before{background:red}.tureitemColor{background:#aeeca7}.falseitemColor{background:#e28e96}.tureitemColor:hover{background:#6fcf64}.falseitemColor:hover{background:#f44a37}input.dnd_textbox::-webkit-input-placeholder{text-align:center}input.dnd_textbox:-moz-placeholder{text-align:center}input.dnd_textbox::-moz-placeholder{text-align:center}input.dnd_textbox:-ms-input-placeholder{text-align:center}.selmatch{border:solid 2px red!important;border-radius:2px!important}.copiedclr{background-color:#ccc!important}.bla [id^=dndmain] .dragable:focus,.bla [id^=dndmain] .dropable:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #fff;outline:0}.dndtabhead:focus,.menu:focus{outline:-webkit-focus-ring-color auto 5px;opacity:1;background:0 0}.heading_arial,.heading_calibri,.heading_cambria,.heading_georgia,.heading_roman,.heading_verdana{text-align:center;font-size:21px;font-weight:700}.content_arial,.content_calibri,.content_cambria,.content_georgia,.content_roman,.content_verdana{text-align:left;font-size:16px;line-height:1.2!important}.content_arial p,.content_calibri p,.content_cambria p,.content_georgia p,.content_roman p,.content_verdana p{text-align:left}.content_arial,.heading_arial{font-family:Arial}.content_georgia,.heading_georgia{font-family:Georgia}.content_cambria,.heading_cambria{font-family:Cambria}.content_calibri,.heading_calibri{font-family:Calibri}.content_verdana,.heading_verdana{font-family:Verdana}.content_roman,.heading_roman{font-family:\"Times New Roman\"}.ui-radio.ui-state-disabled{opacity:1}.sql_terminal{background-color:#000;border:0!important;color:silver;box-shadow:none;font-family:Courier;font-size:13px;font-weight:800;outline:0}[id^=dndmain]>.img-bordered{margin-top:1px}.container_div{position:relative;display:block}.baseradio{vertical-align:middle;margin-bottom:3px!important;margin:0 2px}.icomoon-cancel-circles,.icomoon-checkmark-circles{display:inline-block;position:relative;background-size:100%!important}.icomoon-checkmark-circles{height:16px!important;width:17px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAVCAYAAABc6S4mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEVSURBVEhL1ZWvDoJQFId/mozMN9DNYLdAlCbN6qNoMOBD8ALwBBqpBHwCC9WEBIOzIAcPyB+vXlCD38bYvYzv2zgMOnECfkiXzz/je4Ernyt8J3ANYFtD6I6HC29lfB5I5RoWYQD3MIdRiXwWyOVH3jjWIu0DNXnGANPRGD1ePQ8IBpYjlKswjR2WE4XXtcAFnqNjaNkIRJEGcqIQILmB+cFFEC6gPYs0lBMceMjzcVUjLeQEB3oYj6bJeMrkkXM7OVH6FkX7DWbbFTxev+a9nCgNWZkssTPM5NZ3yMmJylskE5GXE7UAIY40k6fQDEScfDNW14iRHmps+ie+Is/LAHGPtJMTUn+0KIyg9Bs8lgL//ssEblMER6y4OqEyAAAAAElFTkSuQmCC) no-repeat 80%}.icomoon-cancel-circles{height:14px!important;width:18px;right:2px!important;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEoSURBVEhLtZXBbQIxEEUHlANIW0BaSAfLMS2QErjSQJQjlEALySEpAZEjJeQYSiBSrpHMt/ZbDOvx2Jc8abT2zPC/zI61kwDkH5nymfOxFtl8clPjB71P+M2Je0U8Qcb7Kh5riOcDkyXO6Fmw/z6Et2/mB3IDLV410eIpbk2Q0XyF0OtmFZmJJc7od+zBls8rv8cGE098Cw22AWQMXJPXZvEIsgU8EysM8QgqDq0mBfEIqhVqJo54pHzREt2DyOOCG4NY67i2oFEBZ1p0OJcR1RKN4ikKJqhYeHO+LL8TwwTZMQ2XqOkyDiCjab+hrSajKZqJzLnU9FuR/cvttHSYnv0RNe41cyVCI8XoFJU5z07i/0UJmtTEE8nEeMn+J/MPcTcsq5i9IheZ7IOr0kv1ugAAAABJRU5ErkJggg==) no-repeat}.dnd_select{width:100%!important}.native.falseitemColor:before,.native.tureitemColor:before{content:'\\\\25CF'!important}.native.customRad:before{top:0!important}.native.radio_sim{border-radius:50%!important;left:2.5px;position:relative}#errmsg.show{display:block!important}.loading{height:0;width:0;padding:15px;border:6px solid #ccc;border-right-color:#888;border-radius:22px;-webkit-animation:rotate 1s infinite linear;position:absolute;left:50%;top:50%}.spinner{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.26);z-index:99}.tabTools{position:relative!important;top:-68px!important}.p-sm{padding:3px}.context{position:absolute;top:0;left:0;min-width:180px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#000;background:#f5f5f5;font-size:9pt;border:1px solid #333;box-shadow:4px 4px 3px -1px rgba(0,0,0,.5);padding:3px 0;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1061}.context .item{padding:4px 19px;cursor:default;color:inherit;text-align:left}.context .item:hover{background:#e3e3e3!important}.context .item:hover .hotkey{color:#000!important}.context .disabled,.context .disabled:hover .hotkey{color:#878b90!important}.context .disabled:hover{background:inherit!important}.context .separator{margin:4px 0;height:0;padding:0;border-top:1px solid #b3b3b3}.hotkey{color:#878b90;float:right}.resizer{width:15px;height:15px;position:absolute;right:0;bottom:0;cursor:se-resize}.img-bordered{border:4px solid #fff;outline:1px solid #ddd;box-shadow:2px 3px 5px #939393;-webkit-box-shadow:2px 3px 5px #939393;-moz-box-shadow:2px 3px 5px #939393;-ms-box-shadow:2px 3px 5px #939393}";
styleInject(css_248z);

/* clsSMDragNDrop\DragNDropPreview.svelte generated by Svelte v3.40.2 */

const { Object: Object_1$9, console: console_1$2 } = globals;
const file$f = "clsSMDragNDrop\\DragNDropPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-1n3xdnr", "#dndsteps.svelte-1n3xdnr{text-align:center;border:1px solid #999999;background-color:#DDDDDD;width:100%}#sm_controller{margin-top:20px;display:none}.correct_incorrect_icon{z-index:9 !important}input.dnd_textbox{text-align:center;border-radius:4px;background-color:#fff;border:1px solid #ccc;border-radius:4px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhZ05Ecm9wUHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBd2RDLFNBQVMsZUFBQyxDQUFDLEFBQ1YsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUN6QixnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLEtBQUssQ0FBRSxJQUFJLEFBQ1osQ0FBQyxBQUNPLGNBQWMsQUFBRSxDQUFDLEFBQ2xCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLE9BQU8sQ0FBRSxJQUFJLEFBQ2pCLENBQUMsQUFDSSx1QkFBdUIsQUFBRSxDQUFDLEFBQ2pDLE9BQU8sQ0FBRSxDQUFDLENBQUMsVUFBVSxBQUN0QixDQUFDLEFBQ08saUJBQWlCLEFBQUUsQ0FBQyxBQUMzQixVQUFVLENBQUUsTUFBTSxDQUNsQixhQUFhLENBQUUsR0FBRyxDQUNsQixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDdEIsYUFBYSxDQUFFLEdBQUcsQUFDbkIsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJEcmFnTkRyb3BQcmV2aWV3LnN2ZWx0ZSJdfQ== */");
}

function get_each_context$f(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[34] = list[i];
	child_ctx[36] = i;
	return child_ctx;
}

// (401:2) {#if step && step.length}
function create_if_block_3(ctx) {
	let each_1_anchor;
	let each_value = /*step*/ ctx[5];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*step*/ 32) {
				each_value = /*step*/ ctx[5];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$f(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$f(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(401:2) {#if step && step.length}",
		ctx
	});

	return block;
}

// (402:3) {#each step as data, index}
function create_each_block$f(ctx) {
	let span;
	let input;
	let input_id_value;
	let t0;
	let t1_value = "dnd" + /*data*/ ctx[34]._id + "";
	let t1;
	let t2;
	let span_key_value;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[21](/*data*/ ctx[34]);
	}

	const block = {
		c: function create() {
			span = element("span");
			input = element("input");
			t0 = space();
			t1 = text(t1_value);
			t2 = space();
			attr_dev(input, "id", input_id_value = "step_dnd" + /*data*/ ctx[34]._id);
			attr_dev(input, "type", "radio");
			attr_dev(input, "defaultvalue", "1");
			attr_dev(input, "name", "rbs");
			attr_dev(input, "class", "baseradio dndradio svelte-1n3xdnr");
			add_location(input, file$f, 403, 5, 11833);
			attr_dev(span, "key", span_key_value = /*index*/ ctx[36]);
			add_location(span, file$f, 402, 4, 11808);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, input);
			append_dev(span, t0);
			append_dev(span, t1);
			append_dev(span, t2);

			if (!mounted) {
				dispose = listen_dev(input, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*step*/ 32 && input_id_value !== (input_id_value = "step_dnd" + /*data*/ ctx[34]._id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty[0] & /*step*/ 32 && t1_value !== (t1_value = "dnd" + /*data*/ ctx[34]._id + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$f.name,
		type: "each",
		source: "(402:3) {#each step as data, index}",
		ctx
	});

	return block;
}

// (443:3) {:else}
function create_else_block$3(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "id", "pre_sample_image");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/bg_000PLn.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = l.sample_img);
			add_location(img, file$f, 443, 16, 13113);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*changeLoadState*/ ctx[15], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(443:3) {:else}",
		ctx
	});

	return block;
}

// (441:3) {#if bgImg}
function create_if_block_2$2(ctx) {
	let img;
	let img_height_value;
	let img_width_value;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "height", img_height_value = /*imgHeight*/ ctx[3] + "px");
			attr_dev(img, "width", img_width_value = /*imgWidth*/ ctx[4] + "px");

			if (!src_url_equal(img.src, img_src_value = window.inNative
			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*bgImg*/ ctx[2].replace(/\//g, '__')
			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[2])) attr_dev(img, "src", img_src_value);

			attr_dev(img, "class", /*borderclass*/ ctx[8]);
			attr_dev(img, "alt", img_alt_value = /*alt*/ ctx[6] ? /*alt*/ ctx[6] : l.sample_img);
			add_location(img, file$f, 441, 4, 12671);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(img, "error", /*error_handler*/ ctx[22], false, false, false),
					listen_dev(img, "load", /*load_handler*/ ctx[23], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*imgHeight*/ 8 && img_height_value !== (img_height_value = /*imgHeight*/ ctx[3] + "px")) {
				attr_dev(img, "height", img_height_value);
			}

			if (dirty[0] & /*imgWidth*/ 16 && img_width_value !== (img_width_value = /*imgWidth*/ ctx[4] + "px")) {
				attr_dev(img, "width", img_width_value);
			}

			if (dirty[0] & /*bgImg*/ 4 && !src_url_equal(img.src, img_src_value = window.inNative
			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*bgImg*/ ctx[2].replace(/\//g, '__')
			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[2])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*borderclass*/ 256) {
				attr_dev(img, "class", /*borderclass*/ ctx[8]);
			}

			if (dirty[0] & /*alt*/ 64 && img_alt_value !== (img_alt_value = /*alt*/ ctx[6] ? /*alt*/ ctx[6] : l.sample_img)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(441:3) {#if bgImg}",
		ctx
	});

	return block;
}

// (447:3) {#if state.data && image_loaded}
function create_if_block$f(ctx) {
	let dragpreview0;
	let t0;
	let dragpreview1;
	let t1;
	let droppreview0;
	let t2;
	let droppreview1;
	let t3;
	let selectpreview;
	let t4;
	let textboxpreview;
	let t5;
	let radiopreview;
	let t6;
	let multilineboxpreview;
	let t7;
	let checkboxpreview;
	let t8;
	let tabheadpreview;
	let t9;
	let labelpreview;
	let t10;
	let hotspotpreview;
	let t11;
	let menulistpreview;
	let t12;
	let buttonpreview;
	let t13;
	let steppreview;
	let t14;
	let tabpreview;
	let t15;
	let if_block_anchor;
	let current;

	dragpreview0 = new DragPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].drag,
				containerID: /*container_id*/ ctx[11]
			},
			$$inline: true
		});

	dragpreview1 = new DragPreview({
			props: {
				modules: /*state*/ ctx[10].data[1],
				containerID: /*container_id*/ ctx[11]
			},
			$$inline: true
		});

	droppreview0 = new DropPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].drop,
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	droppreview1 = new DropPreview({
			props: {
				modules: /*state*/ ctx[10].data[2],
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	selectpreview = new SelectPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].select,
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	textboxpreview = new TextboxPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].textbox,
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	radiopreview = new RadioPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].radio,
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	multilineboxpreview = new MultilineboxPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].multilinebox,
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	checkboxpreview = new CheckboxPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].checkbox,
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	tabheadpreview = new TabheadPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].tabhead,
				containerID: /*container_id*/ ctx[11]
			},
			$$inline: true
		});

	labelpreview = new LabelPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].label,
				containerID: /*container_id*/ ctx[11]
			},
			$$inline: true
		});

	hotspotpreview = new HotspotPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].hotspot,
				module_type: /*moduleType*/ ctx[9],
				containerID: /*container_id*/ ctx[11],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	menulistpreview = new MenulistPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].menulist,
				containerID: /*container_id*/ ctx[11]
			},
			$$inline: true
		});

	buttonpreview = new ButtonPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].button,
				containerID: /*container_id*/ ctx[11]
			},
			$$inline: true
		});

	steppreview = new StepPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].step,
				containerID: /*container_id*/ ctx[11],
				checkImages: /*checkImages*/ ctx[12],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	tabpreview = new TabPreview({
			props: {
				modules: /*state*/ ctx[10].data[0].tab,
				containerID: /*container_id*/ ctx[11],
				checkImages: /*checkImages*/ ctx[12],
				uxml: /*uxml*/ ctx[0]
			},
			$$inline: true
		});

	let if_block = /*state*/ ctx[10].data[0].hotspot && create_if_block_1$9(ctx);

	const block = {
		c: function create() {
			create_component(dragpreview0.$$.fragment);
			t0 = space();
			create_component(dragpreview1.$$.fragment);
			t1 = space();
			create_component(droppreview0.$$.fragment);
			t2 = space();
			create_component(droppreview1.$$.fragment);
			t3 = space();
			create_component(selectpreview.$$.fragment);
			t4 = space();
			create_component(textboxpreview.$$.fragment);
			t5 = space();
			create_component(radiopreview.$$.fragment);
			t6 = space();
			create_component(multilineboxpreview.$$.fragment);
			t7 = space();
			create_component(checkboxpreview.$$.fragment);
			t8 = space();
			create_component(tabheadpreview.$$.fragment);
			t9 = space();
			create_component(labelpreview.$$.fragment);
			t10 = space();
			create_component(hotspotpreview.$$.fragment);
			t11 = space();
			create_component(menulistpreview.$$.fragment);
			t12 = space();
			create_component(buttonpreview.$$.fragment);
			t13 = space();
			create_component(steppreview.$$.fragment);
			t14 = space();
			create_component(tabpreview.$$.fragment);
			t15 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			mount_component(dragpreview0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(dragpreview1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(droppreview0, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(droppreview1, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(selectpreview, target, anchor);
			insert_dev(target, t4, anchor);
			mount_component(textboxpreview, target, anchor);
			insert_dev(target, t5, anchor);
			mount_component(radiopreview, target, anchor);
			insert_dev(target, t6, anchor);
			mount_component(multilineboxpreview, target, anchor);
			insert_dev(target, t7, anchor);
			mount_component(checkboxpreview, target, anchor);
			insert_dev(target, t8, anchor);
			mount_component(tabheadpreview, target, anchor);
			insert_dev(target, t9, anchor);
			mount_component(labelpreview, target, anchor);
			insert_dev(target, t10, anchor);
			mount_component(hotspotpreview, target, anchor);
			insert_dev(target, t11, anchor);
			mount_component(menulistpreview, target, anchor);
			insert_dev(target, t12, anchor);
			mount_component(buttonpreview, target, anchor);
			insert_dev(target, t13, anchor);
			mount_component(steppreview, target, anchor);
			insert_dev(target, t14, anchor);
			mount_component(tabpreview, target, anchor);
			insert_dev(target, t15, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const dragpreview0_changes = {};
			if (dirty[0] & /*state*/ 1024) dragpreview0_changes.modules = /*state*/ ctx[10].data[0].drag;
			dragpreview0.$set(dragpreview0_changes);
			const dragpreview1_changes = {};
			if (dirty[0] & /*state*/ 1024) dragpreview1_changes.modules = /*state*/ ctx[10].data[1];
			dragpreview1.$set(dragpreview1_changes);
			const droppreview0_changes = {};
			if (dirty[0] & /*state*/ 1024) droppreview0_changes.modules = /*state*/ ctx[10].data[0].drop;
			if (dirty[0] & /*uxml*/ 1) droppreview0_changes.uxml = /*uxml*/ ctx[0];
			droppreview0.$set(droppreview0_changes);
			const droppreview1_changes = {};
			if (dirty[0] & /*state*/ 1024) droppreview1_changes.modules = /*state*/ ctx[10].data[2];
			if (dirty[0] & /*uxml*/ 1) droppreview1_changes.uxml = /*uxml*/ ctx[0];
			droppreview1.$set(droppreview1_changes);
			const selectpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) selectpreview_changes.modules = /*state*/ ctx[10].data[0].select;
			if (dirty[0] & /*uxml*/ 1) selectpreview_changes.uxml = /*uxml*/ ctx[0];
			selectpreview.$set(selectpreview_changes);
			const textboxpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) textboxpreview_changes.modules = /*state*/ ctx[10].data[0].textbox;
			if (dirty[0] & /*uxml*/ 1) textboxpreview_changes.uxml = /*uxml*/ ctx[0];
			textboxpreview.$set(textboxpreview_changes);
			const radiopreview_changes = {};
			if (dirty[0] & /*state*/ 1024) radiopreview_changes.modules = /*state*/ ctx[10].data[0].radio;
			if (dirty[0] & /*uxml*/ 1) radiopreview_changes.uxml = /*uxml*/ ctx[0];
			radiopreview.$set(radiopreview_changes);
			const multilineboxpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) multilineboxpreview_changes.modules = /*state*/ ctx[10].data[0].multilinebox;
			if (dirty[0] & /*uxml*/ 1) multilineboxpreview_changes.uxml = /*uxml*/ ctx[0];
			multilineboxpreview.$set(multilineboxpreview_changes);
			const checkboxpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) checkboxpreview_changes.modules = /*state*/ ctx[10].data[0].checkbox;
			if (dirty[0] & /*uxml*/ 1) checkboxpreview_changes.uxml = /*uxml*/ ctx[0];
			checkboxpreview.$set(checkboxpreview_changes);
			const tabheadpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) tabheadpreview_changes.modules = /*state*/ ctx[10].data[0].tabhead;
			tabheadpreview.$set(tabheadpreview_changes);
			const labelpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) labelpreview_changes.modules = /*state*/ ctx[10].data[0].label;
			labelpreview.$set(labelpreview_changes);
			const hotspotpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) hotspotpreview_changes.modules = /*state*/ ctx[10].data[0].hotspot;
			if (dirty[0] & /*moduleType*/ 512) hotspotpreview_changes.module_type = /*moduleType*/ ctx[9];
			if (dirty[0] & /*uxml*/ 1) hotspotpreview_changes.uxml = /*uxml*/ ctx[0];
			hotspotpreview.$set(hotspotpreview_changes);
			const menulistpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) menulistpreview_changes.modules = /*state*/ ctx[10].data[0].menulist;
			menulistpreview.$set(menulistpreview_changes);
			const buttonpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) buttonpreview_changes.modules = /*state*/ ctx[10].data[0].button;
			buttonpreview.$set(buttonpreview_changes);
			const steppreview_changes = {};
			if (dirty[0] & /*state*/ 1024) steppreview_changes.modules = /*state*/ ctx[10].data[0].step;
			if (dirty[0] & /*uxml*/ 1) steppreview_changes.uxml = /*uxml*/ ctx[0];
			steppreview.$set(steppreview_changes);
			const tabpreview_changes = {};
			if (dirty[0] & /*state*/ 1024) tabpreview_changes.modules = /*state*/ ctx[10].data[0].tab;
			if (dirty[0] & /*uxml*/ 1) tabpreview_changes.uxml = /*uxml*/ ctx[0];
			tabpreview.$set(tabpreview_changes);

			if (/*state*/ ctx[10].data[0].hotspot) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$9(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dragpreview0.$$.fragment, local);
			transition_in(dragpreview1.$$.fragment, local);
			transition_in(droppreview0.$$.fragment, local);
			transition_in(droppreview1.$$.fragment, local);
			transition_in(selectpreview.$$.fragment, local);
			transition_in(textboxpreview.$$.fragment, local);
			transition_in(radiopreview.$$.fragment, local);
			transition_in(multilineboxpreview.$$.fragment, local);
			transition_in(checkboxpreview.$$.fragment, local);
			transition_in(tabheadpreview.$$.fragment, local);
			transition_in(labelpreview.$$.fragment, local);
			transition_in(hotspotpreview.$$.fragment, local);
			transition_in(menulistpreview.$$.fragment, local);
			transition_in(buttonpreview.$$.fragment, local);
			transition_in(steppreview.$$.fragment, local);
			transition_in(tabpreview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dragpreview0.$$.fragment, local);
			transition_out(dragpreview1.$$.fragment, local);
			transition_out(droppreview0.$$.fragment, local);
			transition_out(droppreview1.$$.fragment, local);
			transition_out(selectpreview.$$.fragment, local);
			transition_out(textboxpreview.$$.fragment, local);
			transition_out(radiopreview.$$.fragment, local);
			transition_out(multilineboxpreview.$$.fragment, local);
			transition_out(checkboxpreview.$$.fragment, local);
			transition_out(tabheadpreview.$$.fragment, local);
			transition_out(labelpreview.$$.fragment, local);
			transition_out(hotspotpreview.$$.fragment, local);
			transition_out(menulistpreview.$$.fragment, local);
			transition_out(buttonpreview.$$.fragment, local);
			transition_out(steppreview.$$.fragment, local);
			transition_out(tabpreview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dragpreview0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(dragpreview1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(droppreview0, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(droppreview1, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(selectpreview, detaching);
			if (detaching) detach_dev(t4);
			destroy_component(textboxpreview, detaching);
			if (detaching) detach_dev(t5);
			destroy_component(radiopreview, detaching);
			if (detaching) detach_dev(t6);
			destroy_component(multilineboxpreview, detaching);
			if (detaching) detach_dev(t7);
			destroy_component(checkboxpreview, detaching);
			if (detaching) detach_dev(t8);
			destroy_component(tabheadpreview, detaching);
			if (detaching) detach_dev(t9);
			destroy_component(labelpreview, detaching);
			if (detaching) detach_dev(t10);
			destroy_component(hotspotpreview, detaching);
			if (detaching) detach_dev(t11);
			destroy_component(menulistpreview, detaching);
			if (detaching) detach_dev(t12);
			destroy_component(buttonpreview, detaching);
			if (detaching) detach_dev(t13);
			destroy_component(steppreview, detaching);
			if (detaching) detach_dev(t14);
			destroy_component(tabpreview, detaching);
			if (detaching) detach_dev(t15);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$f.name,
		type: "if",
		source: "(447:3) {#if state.data && image_loaded}",
		ctx
	});

	return block;
}

// (464:4) {#if state.data[0].hotspot}
function create_if_block_1$9(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "class", "targetImg");
			attr_dev(img, "tabindex", "0");
			attr_dev(img, "alt", "target_img");
			if (!src_url_equal(img.src, img_src_value = window.itemFolder + "images/target.png")) attr_dev(img, "src", img_src_value);
			set_style(img, "display", "none");
			add_location(img, file$f, 464, 5, 14804);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$9.name,
		type: "if",
		source: "(464:4) {#if state.data[0].hotspot}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let div3;
	let itemhelper;
	let t0;
	let div0;
	let input;
	let t1;
	let t2_value = l.base_steps + "";
	let t2;
	let t3;
	let t4;
	let center;
	let div1;
	let button0;
	let t6;
	let button1;
	let t8;
	let div2;
	let t9;
	let current;
	let mounted;
	let dispose;
	itemhelper = new ItemHelper({ $$inline: true });
	itemhelper.$on("setReview", /*setReview*/ ctx[13]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[14]);
	let if_block0 = /*step*/ ctx[5] && /*step*/ ctx[5].length && create_if_block_3(ctx);

	function select_block_type(ctx, dirty) {
		if (/*bgImg*/ ctx[2]) return create_if_block_2$2;
		return create_else_block$3;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = /*state*/ ctx[10].data && /*image_loaded*/ ctx[1] && create_if_block$f(ctx);

	const block = {
		c: function create() {
			div3 = element("div");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div0 = element("div");
			input = element("input");
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			if (if_block0) if_block0.c();
			t4 = space();
			center = element("center");
			div1 = element("div");
			button0 = element("button");
			button0.textContent = `${l.correct_answer}`;
			t6 = space();
			button1 = element("button");
			button1.textContent = `${l.your_answer}`;
			t8 = space();
			div2 = element("div");
			if_block1.c();
			t9 = space();
			if (if_block2) if_block2.c();
			attr_dev(input, "id", "base");
			attr_dev(input, "type", "radio");
			attr_dev(input, "defaultvalue", "1");
			attr_dev(input, "defaultchecked", "");
			attr_dev(input, "name", "rbs");
			attr_dev(input, "class", "baseradio dndradio");
			add_location(input, file$f, 398, 2, 11583);
			attr_dev(div0, "id", "dndsteps");
			attr_dev(div0, "class", "h svelte-1n3xdnr");
			add_location(div0, file$f, 397, 1, 11549);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light correct-ans");
			attr_dev(button0, "id", "reviewCorrectAns");
			add_location(button0, file$f, 419, 3, 12201);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn active your-ans btn-light");
			attr_dev(button1, "id", "reviewUserAns");
			set_style(button1, "margin-left", "-4px");
			add_location(button1, file$f, 424, 3, 12335);
			attr_dev(div1, "class", "btn-group mb-xl clearfix review h mb-3");
			attr_dev(div1, "id", "sm_controller");
			add_location(div1, file$f, 418, 2, 12125);
			attr_dev(div2, "id", /*container_id*/ ctx[11]);
			attr_dev(div2, "zoom", "");
			attr_dev(div2, "totalcorrectans", /*totalcorrectans*/ ctx[7]);
			attr_dev(div2, "class", "container_div svelte-1n3xdnr");
			add_location(div2, file$f, 434, 2, 12540);
			add_location(center, file$f, 417, 1, 12113);
			add_location(div3, file$f, 391, 0, 11454);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			mount_component(itemhelper, div3, null);
			append_dev(div3, t0);
			append_dev(div3, div0);
			append_dev(div0, input);
			append_dev(div0, t1);
			append_dev(div0, t2);
			append_dev(div0, t3);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div3, t4);
			append_dev(div3, center);
			append_dev(center, div1);
			append_dev(div1, button0);
			append_dev(div1, t6);
			append_dev(div1, button1);
			append_dev(center, t8);
			append_dev(center, div2);
			if_block1.m(div2, null);
			append_dev(div2, t9);
			if (if_block2) if_block2.m(div2, null);
			current = true;

			if (!mounted) {
				dispose = listen_dev(input, "click", /*click_handler*/ ctx[20], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*step*/ ctx[5] && /*step*/ ctx[5].length) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div2, t9);
				}
			}

			if (/*state*/ ctx[10].data && /*image_loaded*/ ctx[1]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty[0] & /*state, image_loaded*/ 1026) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$f(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*totalcorrectans*/ 128) {
				attr_dev(div2, "totalcorrectans", /*totalcorrectans*/ ctx[7]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_component(itemhelper);
			if (if_block0) if_block0.d();
			if_block1.d();
			if (if_block2) if_block2.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function setTotalCorrectAns(qXml) {
	var item = qXml ? qXml.smxml : null;
	var count = 0;

	// if there is xml
	if (item) {
		// iterating throgh the xml and store the elements in item 
		for (let i in item) {
			if (Array.isArray(item[i]) == false) {
				let arr = [];
				arr.push(item[i]);
				item[i] = arr;
			}
		}

		/** Counting the total length of the element **/
		if (item['drop']) {
			count = count + item['drop'].length;
		}

		if (item['select']) {
			count = count + item['select'].length;
		}

		if (item['textbox']) {
			count = count + item['textbox'].length;
		}

		if (item['checkbox']) {
			count = count + item['checkbox'].length;
		}

		if (item['radio']) {
			item['radio'].map(function (data) {
				if (parseInt(data._correctans) == 1) {
					count = count + 1;
				}
			});
		}

		if (item['hotspot']) {
			item['hotspot'].map(function (data) {
				let innerText = JSON.parse(data.__text ? data.__text : data.__cdata);
				count = count + Object.keys(innerText).length;
			});
		}

		if (item['jscript']) {
			try {
				eval.call(window, item['jscript'][0]);
			} catch(e) {
				console.warn(e);
			}
		}

		return count;
	}
}

// convert object to lower case
function objToLower(obj) {
	let newX = {};

	for (let index in obj) {
		newX[index.toLowerCase()] = obj[index];
	}

	return newX;
}

// return the data of the nested module according to the xml
function loadNestedModule(qXml) {
	var smxml = qXml ? qXml.smxml : null;
	var customDrag = [], customDrop = [];

	if (smxml) {
		if (smxml.div) {
			smxml.div.map(function (data, i) {
				data = objToLower(data);

				if (data._anskey == "" || data._anskey == undefined) {
					/*added this condition because key was diffrent with id*/
					if (data._key.indexOf("key") <= -1) {
						data._id = "ID" + data._key;
						data._key = "key" + data._key;
					}

					/********/
					customDrag.push(data);
				} else {
					let id = data._id.split("ID");

					/*added this condition because key was diffrent with id*/
					if (data._key.indexOf("key") <= -1) {
						data._id = "ID" + data._key;
						data._key = "key" + data._key;
						data._anskey = "ID" + data._anskey;
					} else {
						let key = data._key.split("key"); /********/

						if (id[1] == key[1]) {
							let k = data._anskey.split("key");
							let k2 = k[1];
							if (k2) data._anskey = "ID" + k2;
						} else if (parseInt(id[1]) != parseInt(key[1])) {
							if (data._anskey.indexOf("ID") <= -1) {
								data._anskey = "ID" + key[1];
							}
						}
					}

					customDrop.push(data);
				}
			});
		}

		return [smxml, customDrag, customDrop];
	}
}

function instance$f($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DragNDropPreview', slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let { showAns } = $$props;
	let { editorState } = $$props;

	// initializing the variable
	let QXML = "";

	let image_loaded = 0;
	let bgImg = "";
	let imgHeight = "";
	let imgWidth = "";
	let step = [];
	let alt = "";
	let totalcorrectans = 0;
	let borderclass = "";
	let borderclassname = 'img-bordered';
	let container_id = 'dndmainPreview';
	let moduleType = 1;
	let state = {};

	// writable for preview
	let preview_store = writable({
		xml: '',
		check: "checked",
		totalcorrectans: "",
		review: false,
		data: []
	});

	// subscribing to the store
	const unsubscribe = preview_store.subscribe(value => {
		$$invalidate(10, state = value);
	});

	// this is called for the first time use for binding the events
	onMount(async function () {
		if (window.inNative) {
			if (typeof window.getHeight == "function") {
				window.getHeight && window.getHeight();
			}
		}

		if (xml) {
			AH.setCss(document.getElementById('dndsteps'), { display: 'none' });
		}

		AH.listen(document, 'click', '.record', function (current_element) {
			if (!current_element.classList.contains('lab_disable')) current_element.setAttribute("clicked", 1);
		});

		AH.listen('body', 'click', '#reviewUserAns', function () {
			// for your ans
			AH.selectAll('#sm_controller button', 'removeClass', 'active');

			AH.addClass('#sm_controller .your-ans', 'active');
			yourAnswer();
		});

		AH.listen('body', 'click', '#reviewCorrectAns', function () {
			// for correct ans
			AH.selectAll('#sm_controller button', 'removeClass', 'active');

			AH.addClass('#sm_controller .correct-ans', 'active');
			correctAnswer();
		});

		AH.listen(document, 'click', '#' + container_id, function () {
			displayAns();
		});

		AH.listen(document, 'keyup', '#' + container_id, function () {
			displayAns();
		});

		AH.listen(document, 'change', '#' + container_id, function () {
			displayAns();
		});

		AH.listen(document, 'mouseup', '#' + container_id, function () {
			displayAns();
		});

		// prevent to open context menu
		AH.bind('body', 'contextmenu', function (event) {
			event.preventDefault();
		});
	});

	// call everytime when updating will happen
	afterUpdate(async () => {
		// if there is change in xml
		if (state.xml != xml) {
			loadModule(xml);
		}

		// run only in case of editor no need to run it in case of preview
		// if (state.review != isReview && editorState ) { // Its creating issue in student area
		if (state.review != isReview) {
			preview_store.update(item => {
				item.review = isReview;
				return item;
			});

			if (isReview) {
				displayAns();
				DND.modeOn(1);
				DND.showansdrag("#" + container_id, 'u', 1);
				AH.selectAll('#sm_controller button', 'removeClass', 'active');
				AH.addClass('#sm_controller .your-ans', 'active');
			} else {
				DND.modeOn(0);
			}
		}
	});

	// for checking the answer and creating the user ans
	function displayAns() {
		let result = DND.checkAns("#" + container_id);
		if (typeof is_sm != "undefined") AH.showmsg(result.ans ? "Correct" : "Incorrect", 3000);

		if (editorState) {
			showAns(result.ans ? "Correct" : "Incorrect");
		}

		onUserAnsChange(result);
	}

	// call whenever there is change in xml and changes the module accordingly
	function loadModule(loadXml) {
		let newXml = XMLToJSON(loadXml);
		parseXMLPreview(newXml);
		$$invalidate(7, totalcorrectans = setTotalCorrectAns(newXml));

		preview_store.update(item => {
			item.xml = loadXml;
			item.totalcorrectans = totalcorrectans;
			item.data = loadNestedModule(newXml);
			return item;
		});

		checkImages();
		refreshModule();
	}

	// whenever the module will refresh means there is change in xml it will called 
	function refreshModule() {
		let dnd_timeout = setTimeout(
			function () {
				DND.readyThis("#" + container_id);
				DND.showansdrag("#" + container_id, 'u');

				if (isReview) {
					// if review mode is on
					displayAns(); // display the answe

					DND.modeOn(1); // for showing correct answer and your answer tab
					DND.showansdrag("#" + container_id, 'u', 1);
					AH.selectAll('#sm_controller button', 'removeClass', 'active');
					AH.addClass('#sm_controller .your-ans', 'active');
				} else {
					try {
						DND.modeOn(0);

						if (typeof showAns == 'undefined') {
							displayAns();
						}
					} catch(err) {
						console.warn({ err });
					}
				}

				clearTimeout(dnd_timeout);
			},
			500
		);
	}

	// parse the xml for preview
	function parseXMLPreview(MYXML) {
		try {
			// getting he required data
			QXML = MYXML;

			$$invalidate(2, bgImg = MYXML.smxml._bgimg);
			$$invalidate(9, moduleType = MYXML.smxml._type || 1);
			$$invalidate(6, alt = MYXML.smxml._alt ? MYXML.smxml._alt : "");
			$$invalidate(3, imgHeight = MYXML.smxml._height);
			$$invalidate(4, imgWidth = MYXML.smxml._width);
			$$invalidate(8, borderclass = MYXML.smxml._borderrequired == 1 ? borderclassname : '');
			$$invalidate(5, step = MYXML.smxml.step);

			if (Array.isArray(step) == false && step) {
				$$invalidate(5, step = []);
				$$invalidate(5, step[0] = QXML.smxml.step, step);
			}
		} catch(error) {
			console.warn({
				error,
				fun: 'parseXMLPreview',
				file: 'DragNDropPreview.svelte'
			});
		}
	}

	// setting the container height and width on the basis of image height and width
	function checkImages(is_image_load) {
		let container = document.querySelectorAll("#" + container_id + " img");

		if (container.length > 0) {
			container.forEach(function (value) {
				if (value.complete) {
					let originalHeight = value.clientHeight > value.naturalHeight
					? value.clientHeight
					: value.naturalHeight;

					let originalWidth = value.clientWidth > value.naturalWidth
					? value.clientWidth
					: value.naturalWidth;

					if (Number(originalWidth) != 0 || Number(originalHeight) != 0 || typeof from_myproject != "undefined" && from_myproject == 1) {
						AH.setCss("#" + container_id, {
							height: (imgHeight && imgHeight >= originalHeight
							? imgHeight
							: originalHeight) + "px",
							width: (imgWidth && imgWidth >= originalWidth
							? imgWidth
							: originalWidth) + "px"
						});
					}
				}
			});
		}

		if (is_image_load == 1 || is_image_load == 2) {
			$$invalidate(1, image_loaded = 1);

			if (window.inNative) {
				window.postMessage(`height___${AH.select("#" + container_id + ">img").naturalHeight}`);
			}

			refreshModule();
		}
	}

	// for the correct answer
	function correctAnswer() {
		DND.showansdrag('#' + container_id, 'c', 1);
	}

	// for showing the user ans
	function yourAnswer() {
		DND.showansdrag('#' + container_id, 'u', 1);
	}

	// call on the setreview function
	function setReview() {
		displayAns();
		$$invalidate(16, isReview = true);
		DND.modeOn(1);
	}

	// unset review function
	function unsetReview() {
		$$invalidate(16, isReview = false);
		DND.modeOn(0);
	}

	// for changing the load stte
	function changeLoadState() {
		AH.select('#pre_sample_image').remove();
		$$invalidate(1, image_loaded = 1);
	}

	const writable_props = ['xml', 'uxml', 'isReview', 'showAns', 'editorState'];

	Object_1$9.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<DragNDropPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => DND.setStep('base');
	const click_handler_1 = data => DND.setStep("dnd" + data._id);

	const error_handler = e => {
		e.target.onerror = null;
		e.target.src = "https://s3.amazonaws.com/jigyaasa_content_static/" + bgImg;
	};

	const load_handler = () => {
		checkImages(1);
	};

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(17, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(0, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(16, isReview = $$props.isReview);
		if ('showAns' in $$props) $$invalidate(18, showAns = $$props.showAns);
		if ('editorState' in $$props) $$invalidate(19, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		onMount,
		beforeUpdate,
		afterUpdate,
		ItemHelper,
		AH,
		onUserAnsChange,
		XMLToJSON,
		writable,
		DND,
		TextboxPreview,
		DragPreview,
		DropPreview,
		SelectPreview,
		RadioPreview,
		MultilineboxPreview,
		CheckboxPreview,
		TabheadPreview,
		LabelPreview,
		HotspotPreview,
		MenulistPreview,
		ButtonPreview,
		StepPreview,
		TabPreview,
		l,
		xml,
		uxml,
		isReview,
		showAns,
		editorState,
		QXML,
		image_loaded,
		bgImg,
		imgHeight,
		imgWidth,
		step,
		alt,
		totalcorrectans,
		borderclass,
		borderclassname,
		container_id,
		moduleType,
		state,
		preview_store,
		unsubscribe,
		displayAns,
		loadModule,
		refreshModule,
		parseXMLPreview,
		checkImages,
		setTotalCorrectAns,
		objToLower,
		loadNestedModule,
		correctAnswer,
		yourAnswer,
		setReview,
		unsetReview,
		changeLoadState
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(17, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(0, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(16, isReview = $$props.isReview);
		if ('showAns' in $$props) $$invalidate(18, showAns = $$props.showAns);
		if ('editorState' in $$props) $$invalidate(19, editorState = $$props.editorState);
		if ('QXML' in $$props) QXML = $$props.QXML;
		if ('image_loaded' in $$props) $$invalidate(1, image_loaded = $$props.image_loaded);
		if ('bgImg' in $$props) $$invalidate(2, bgImg = $$props.bgImg);
		if ('imgHeight' in $$props) $$invalidate(3, imgHeight = $$props.imgHeight);
		if ('imgWidth' in $$props) $$invalidate(4, imgWidth = $$props.imgWidth);
		if ('step' in $$props) $$invalidate(5, step = $$props.step);
		if ('alt' in $$props) $$invalidate(6, alt = $$props.alt);
		if ('totalcorrectans' in $$props) $$invalidate(7, totalcorrectans = $$props.totalcorrectans);
		if ('borderclass' in $$props) $$invalidate(8, borderclass = $$props.borderclass);
		if ('borderclassname' in $$props) borderclassname = $$props.borderclassname;
		if ('container_id' in $$props) $$invalidate(11, container_id = $$props.container_id);
		if ('moduleType' in $$props) $$invalidate(9, moduleType = $$props.moduleType);
		if ('state' in $$props) $$invalidate(10, state = $$props.state);
		if ('preview_store' in $$props) preview_store = $$props.preview_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		uxml,
		image_loaded,
		bgImg,
		imgHeight,
		imgWidth,
		step,
		alt,
		totalcorrectans,
		borderclass,
		moduleType,
		state,
		container_id,
		checkImages,
		setReview,
		unsetReview,
		changeLoadState,
		isReview,
		xml,
		showAns,
		editorState,
		click_handler,
		click_handler_1,
		error_handler,
		load_handler
	];
}

class DragNDropPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$f,
			create_fragment$f,
			safe_not_equal,
			{
				xml: 17,
				uxml: 0,
				isReview: 16,
				showAns: 18,
				editorState: 19
			},
			add_css,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DragNDropPreview",
			options,
			id: create_fragment$f.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[17] === undefined && !('xml' in props)) {
			console_1$2.warn("<DragNDropPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[0] === undefined && !('uxml' in props)) {
			console_1$2.warn("<DragNDropPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[16] === undefined && !('isReview' in props)) {
			console_1$2.warn("<DragNDropPreview> was created without expected prop 'isReview'");
		}

		if (/*showAns*/ ctx[18] === undefined && !('showAns' in props)) {
			console_1$2.warn("<DragNDropPreview> was created without expected prop 'showAns'");
		}

		if (/*editorState*/ ctx[19] === undefined && !('editorState' in props)) {
			console_1$2.warn("<DragNDropPreview> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default DragNDropPreview;
//# sourceMappingURL=DragNDropPreview-12ac37d1.js.map
