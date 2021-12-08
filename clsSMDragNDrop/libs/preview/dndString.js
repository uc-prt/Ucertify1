/**
 *  File Name   : dndString.js
 *  Author      : Ayush Srivastava
 *  Function    : DND
 *  Version     : 1.0
 *  Packege     : Drag and Drop (prev)
 *  Last update : 19 Jan 2021
 *  Dependency  : Draggable, Sweetalert, Hotkeys-js
 */
import Draggable from '../plugins/Draggable';
import swal from 'sweetalert';
import hotkeys from 'hotkeys-js';
let jsSwal = swal;

// declaring gloabl variable for use
let elemId = "#dndmainPreview";
let result = true;
let stepsPreview = null;
let dragstore = {};
let user_points = 0;
const DND = {}
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
            delete this.state[obj]
        }
    },
    state: {}
}

// for setting the browser version
DND.browser = {};
DND.browser.msie = false;
DND.browser.version = 0
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
}

// modifying string prototype
String.prototype.sqlparser = function(type) {
    return DND.sqlparser(this.toString(), type);
}

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
                let dnd_find_element = AI.find(dnd_element, '#base')
                AI.selectAll(dnd_find_element, 'checked', true)
            } else {
                AI.select("#step_" + tabname, 'checked', true)
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
}

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
        console.warn(error)
    }
}

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
        !!document.getElementsByClassName('spinner')[0] && document.getElementsByClassName('spinner')[0].remove()
    }
}

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
                clone_element.id = element.id + "_" + (AI.find(element, '.tmpTarget', 'all').length + 1)
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
                    DND.storage.store(current_id, 'tgElem', next_elem_store)
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
            AI.insert('body', '<img src="' + bgimage + '" style="display:none"/>', 'beforeend')
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
    }

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
        // changes for php
        if(AI.select(copied) != undefined) { 
            AI.find(target, 'p').innerText = AI.select(copied).innerText.trim();
        } else {
            AI.find(target, 'p').innerText = copied.innerText.trim();
        }
       

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
        input.type = 'checkbox'
        input.id = 'prevent_dialog'
        //AI.select('#prevent_dialog').parentElement.classList.add('check');
        input.classList.add('mr-1');
        input.onchange = function() {
            DND.prevent_dialog = this.checked;
            if (this.checked) {
                jsSwal.close();
            }

        }
        let label = document.createElement('label');
        label.setAttribute('for', 'prevent_dialog')
        label.innerText = "Don't show me message again!"

        content.append(img)
        div.append(input)
        div.append(label);
        content.append(div)
        // Added the close button (X) at the top right side in sweetalert modal.
        jsSwal = function() {
            swal(arguments[0]);
            if (arguments[0].showCloseButton) {
                let closeButton = document.createElement('button');
                closeButton.className = 'swal2-close close';
                closeButton.onclick = function() { swal.close(); };
                closeButton.textContent = '×';
                closeButton.classList.add('position-relative');
                closeButton.style.bottom = '220px';
                closeButton.style.right = '10px';
                let modal = document.querySelector('.swal-modal');
                AI.select('.swal-text').style.marginTop='23px'
                AI.select('.swal-text').style.marginBottom='10px';
                AI.select('.swal-text').style.float = 'left';
                modal.appendChild(closeButton);
            }
        }

        jsSwal({
            text: "How to Drop?",
            content: content,
            //timer: 10000,
            buttons: false,
            showCloseButton: true
        });

    }

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
                        })
                    } else {
                        AI.select('.detail .detail_data').innerText = element.getAttribute('data-detail');
                        AI.setCss(AI.select('.detail .detail_data'), {
                            "top": event.pageY + "px",
                            "left": event.pageX + "px",
                            'display': 'block',
                        })
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
            console.warn(error)
        }
    });
}

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
}

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
}

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
}

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
            count = 0
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
                                clonenode.id = hotspot_this.id + "_" + (AI.find(hotspot_this, '.tmpTarget', 'all').length + 1)

                                AI.setCss(clonenode, {
                                    position: 'absolute',
                                    top: top + "px",
                                    left: left + "px",
                                    display: 'block'
                                });

                                // need to check here
                                DND.storage.store(clonenode.id, 'tgElem', hotspot_this.id)
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
            })
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
                })
                copied_id = copy_drag.id;
                copy_drag.classList.add('copiedclr');
            } else {
                AH.showmsg('You cannot drag this');
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
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 4, 0)
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
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), -4, 0)
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
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 0, -4)
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
                            let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 0, 4)
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
        }
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
                last_element.children[0].blur()
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

}


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
}

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
}

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
                        })
                    }
                }

                cur_element.style.height = (height + top) + 'px';
                AI.setCss(cur_element, {
                    height: (height + top) + 'px',
                    overflow: 'hidden',
                });

                AI.setCss(drag_element.parentElement, {
                    overflow: 'hidden',
                })
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
}

// for getting the offset
DND.offset = function(element) {
    let rect = element.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
}
// for getting the position
DND.position = function(element) {
    return {
        left: element.offsetLeft,
        top: element.offsetTop
    }
}

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
}

// function responsible for showing the dnd ans by traversing each element passing for DND.showansdrag
DND.showchildansdrag = function(dndid, pElem, ansType, review) {
    let is_correct = -2;
    let dnd_element = AI.select(dndid);
    if (pElem.classList.contains('hotspot') || pElem.classList.contains('hotspot_test')) {
        let selected = AI.find(pElem, '.tmpTarget:not([showtarget])', 'all')
        if (selected.length > 0) {
            selected.forEach((elm) => elm.remove());
        }
        let hs_item = AI.find(pElem, '.hs_item', 'all');
        if (ansType == 'c') {
            let targetimg = {
                height: (AI.find(dnd_element, '.targetImg').offsetHeight) ? AI.find(dnd_element, '.targetImg').offsetHeight : 32,
                width: (AI.find(dnd_element, '.targetImg').offsetWidth) ? AI.find(dnd_element, '.targetImg').offsetWidth : 32,
            }
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
                let already_filled_ans = []
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
                                    }
                                }
                            }
                        }
                    });

                    if (tgElem != '') {
                        cur_element.setAttribute("data-correctans", "1");
                        is_correct = true;
                    }else{
                        is_correct = false;
                        break;
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
                            selector = AI.selectAll('.dropable[data-anskey="' + pElem.getAttribute("data-anskey") + '"]')[index]
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
                })
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
                DND.setStep(pElem.getAttribute('id'))
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
                        element.value = element.getAttribute("data-correctans")
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
}

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
    let correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:18px;height:18px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span></span>'
    return correct_incorrect_mark;
}

// function for marking choice matrix answers
DND.markUserAnswerChoiceMatrix = function(is_correct, anstest) {
    let correct_incorrect_mark = '', droped_value_indicator_html = '';
    if (is_correct == 1 && anstest == true) {
        if (window.inNative) {
            droped_value_indicator_html = '<span class="icomoon-checkmark-circles" style="color:green;">';
        } else {
            droped_value_indicator_html = '<span class="icomoon-checkmark-circle" style="color:green;">';
        }

        correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:15px;height:15px;right:-9px;top:-10px;background:white;border-radius:15px 12px 12px;font-size:17px;"> ' + droped_value_indicator_html + '</span></span>'
    } else if (is_correct != 1 && anstest == true) {
        if (window.inNative) {
            droped_value_indicator_html = '<span class="icomoon-cancel-circles" style="color:red;">';
        } else {
            droped_value_indicator_html = '<span class="icomoon-cancel-circle style="color:red;">';
        }

        correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:15px;height:15px;right:-9px;top:-10px;background:white;border-radius:15px 12px 12px;font-size:17px;"> ' + droped_value_indicator_html + '</span></span>'
    }
    return correct_incorrect_mark;
}
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
}

// function for changing the user and ans points
DND.calculatePoint = function(answer_points, user_points) {
    //changes for php
    AI.selectAll('#answer_points', 'value', answer_points);
    AI.selectAll('#user_points', 'value', user_points);
}

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
}

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
}

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
}

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
}

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
}

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

}

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
}

// function for textbox alingment setting
DND.textBoxAlignment = function(element) {
    element.style.textAlign = (!isNaN(element.value)) ? 'center' : 'left';
}

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
}


// function calling on the window load
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", function() {
        let dnd_textbox = AI.selectAll('.dnd_textbox');
        for (let index = 0; index < dnd_textbox.length; index++) {
            DND.textBoxAlignment(dnd_textbox[index]);
        }
        AI.listen('body', 'change', '.dnd_textbox', function(_this) {
            DND.textBoxAlignment(_this);
        })
    });
}


export default DND;
