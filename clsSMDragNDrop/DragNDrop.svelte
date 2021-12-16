<!--
 *  File Name   : DragNDrop.svelte
 *  Description : Responsible for Authoring Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (Authoring)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    // importing required components
	import { onMount, beforeUpdate } from 'svelte';
	import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
	import { writable } from "svelte/store";
    import DND_AUTH from './libs/authoring/dndAuthString';
    import Drag from './libs/authoring/Drag.svelte';
    import Drop from './libs/authoring/Drop.svelte';
    import Radio from './libs/authoring/Radio.svelte';
    import Select from './libs/authoring/Select.svelte';
    import Textbox from './libs/authoring/Textbox.svelte';
    import Multilinebox from './libs/authoring/Multilinebox.svelte';
    import Checkbox from './libs/authoring/Checkbox.svelte';
    import Button from './libs/authoring/Button.svelte';
    import Tabhead from './libs/authoring/Tabhead.svelte';
    import Img from './libs/authoring/Img.svelte';
    import Label from './libs/authoring/Label.svelte';
    import Hotspot from './libs/authoring/Hotspot.svelte';
    import Menulist from './libs/authoring/Menulist.svelte';
    import Step from './libs/authoring/Step.svelte';
    import Tab from './libs/authoring/Tab.svelte';
    import DndModalBox from './libs/authoring/DndModalBox.svelte';
    import swal from 'sweetalert';
    import Draggable from './libs/plugins/Draggable';
    import Resizable from './libs/plugins/Resizable';
    import l from '../src/libs/editorLib/language.js';

    import '../src/libs/codemirror.min.css';
    export let xml;
    export let getChildXml;


    // creating the varibles
    let QXML = "", bgImg = "", imgHeight = "", imgWidth = "";
    let step = [];
    let isOldXml = false;
    let xmlErrDialog = false;
    let container_id = 'dndmain'
    let borderclassname = 'img-bordered';
    let IS_EVENT_CALLED = 1;
    let minimum_resize = 25;
    let module_type = 1;
    let state = {};
    let image_loaded = 0;
    let imgBorder = '';
    // creating store
    let auth_store = writable({
		xml : "",
        bgImage : "",
        imgHeight : "",
        imgWidth : "",
        alt : "",
        borderclass : "",
        updated: false,
        resize: false,
	});

    // subscribing to the store
    const unsubscribe = auth_store.subscribe(value => {
		state.store = value;
	});

    
    // responsible for rerendering the module based on the changed xml
    beforeUpdate(async() => {
		if (state.store.xml != xml) {
			loadModule(xml);
            if (isOldXml && !xmlErrDialog) {
                xmlErrDialog = true;
                swal({
                    content: AH.parseHtml('<div>' + l.old_xml +'</div>'),
                    icon: "warning",
                    dangerMode: true,
                })
            }
		}
	});

    // call once and bind all the events
    onMount(async() => {
        loadModule(xml);
        bindEvents();
    });

    // function for checking the dnd extended module
    function checkDndExtended() {
        let xml = AH.select("#special_module_xml").value;
        let isDNDExtended = 0;
        let oldxml = ['</step>', '</tab>', '</jscript>', '</menulist>', '</tabhead>'];
        if (xml) {
            for (let index = 0; index < oldxml.length; index++) {
                if (xml.includes(oldxml[index])) {
                    isDNDExtended = 1;
                    break;
                }
            }
        }
        return isDNDExtended;
    }

    // function responsible for binding the events
    function bindEvents() {
        AH.listen('body','mouseup', '#dndmain', function () {
            if (!state.store.resize) {
                updateXML();
            }
            loadModule(xml);
        });

        AH.listen('body','click', '#update_xml', function () {
            updateXML();
        });

        AH.listen('body', 'mouseover', '#dndmain .cursor_move',function(element) {
            AH.select('#' + element.getAttribute('id') + '>.tools').classList.remove('h');
        });

        AH.listen('body', 'mouseout', '#dndmain .cursor_move',function(element) {
            AH.select('#' + element.getAttribute('id') + '>.tools').classList.add('h');
        });

        AH.listen('body', 'click', '#dndmain .cursor_move',function(element) {
            AH.selectAll('#dndmain .elemActive', 'removeClass', 'elemActive');
            element.classList.add('elemActive');
            element.focus();
        });

        AH.listen('body', 'dblclick', '#dndmain .cursor_move', function() {
            if (AH.selectAll('#dndmain > textarea').length > 0) {
                AH.selectAll('.cursor_move > textarea', 'show');
            }
        });

        AH.listen('body', 'hidden.bs.modal', '#authoring-modal', function () {
            DND_AUTH.visible_class = '';
            DND_AUTH.error_message = '';
        });

        AH.listen('body', 'click', '#authoring-modal .events a', function (element) {
            if (DND_AUTH.visible_class != '') {
                AH.selectAll('.events a', 'removeClass', 'active');
                element.classList.add('active');
                AH.selectAll(DND_AUTH.visible_class + ' .event-input input', 'removeClass', 'show');
                AH.selectAll(DND_AUTH.visible_class + ' .event-input input', 'addClass', 'h');
                AH.selectAll('#'+ element.getAttribute('for'), 'removeClass', 'h');
                AH.selectAll('#'+ element.getAttribute('for'), 'addClass', 'show');

                // don't why this is written this code
                let val = AH.select('#'+ element.getAttribute('for')).value;
                let split_data = val.split(/\(.*?\;/g);
                if (Array.isArray(split_data)) {
                    split_data = split_data.map((value) => { return value.trim()}).filter(function(n){return n});
                    AH.select('.event-input select').value = ''
                }
            }
        });

        AH.listen('body', 'change', '#authoring-modal .event-input input.show', function (element) {
            if ( DND_AUTH.visible_class != '' && element.closest(DND_AUTH.visible_class) ) {
                let cur_element = AH.select('[for="'+ element.getAttribute('id') +'"]');
                if (cur_element && cur_element.nodeName) {
                    AH.find(cur_element, '.icomoon-checkmark', {
                        action: 'remove'
                    })
                    if (element.value != '') {
                        AH.insert('[for="'+ element.getAttribute('id') +'"]', '<i class="icomoon-checkmark float-end"></i>', 'beforeend');
                    }
                }
            }
        });

        // not in use right now need to check with pradeep sir
        AH.listen('body', 'change', '#authoring-modal .event-input select', function (element) {
            let val = element.value;
            let input = AH.select('#authoring-modal ' + DND_AUTH.visible_class + ' .event-input input.show');
            if (input.value.indexOf(val) == -1) {
                input.value = input.value + val + '();';
            }
            let cur_element = AH.select('[for="'+ input.getAttribute('id') +'"]');
            if (cur_element && cur_element.nodeName) {
                AH.find(cur_element, '.icomoon-checkmark', {
                    action: 'remove'
                })
                if (input.value != '') {
                    AH.insert('[for="'+ input.getAttribute('id') +'"]', '<i class="icomoon-checkmark float-end"></i>', 'beforeend');
                }
            }
        });

        AH.listen(document, 'click', '.addElement, #updateDnd', function() {
            
            let borderclass = (AH.select('#authoring-modal #base-borderrequired').checked) ? borderclassname : '';
            auth_store.update( (item) => {
                item.bgImage = AH.select('#authoring-modal #base-bgimg').value;
                item.alt = AH.select('#authoring-modal #base-bgimg-alt').value;
                item.borderclass = borderclass;
                return item;
            });

            if (QXML.smxml.hotspot) {
                updateXML("deepUpdate");
            } else {
                updateXML();
            }
        });

        AH.listen('body', 'change', '#authoring-modal input', function(current) {
            current.value = DND_AUTH.setValue(current.value);
        });

        AH.listen('body', 'input', '#authoring-modal .validate', function(current) {
            toggleBtn(current);
        });

        AH.listen('body', 'input', '#authoring-modal .number_validate', function(current) {
            let fixed = current.value.replace(/[^0-9]/g, "");
            if (current.value !== fixed) {
                current.value = fixed;
            }

            toggleBtn(current);
        });

        AH.listen('body', 'keyup', '#authoring-modal .dropdown #ddn-value', function(current) {
            let fetched_list_data = DND_AUTH.errorChecking()
            let is_error = fetched_list_data[0] || (fetched_list_data[1] == 0);
            DND_AUTH.error_message = (is_error) ? ((fetched_list_data[0]) ? (l.one_option_correct) : l.one_option_require) : '';
            if (is_error) {
                AH.select('#authoring-modal .errorBtn', 'removeClass', 'h');
                AH.select('#authoring-modal .addElement', 'addClass', 'h')
            } else {
                AH.select('#authoring-modal .addElement', 'removeClass', 'h');
                AH.select('#authoring-modal .errorBtn', 'addClass', 'h')
            }
        });

        AH.listen('body', 'click', '.errorBtn', function (element) {
            swal({
                text: DND_AUTH.error_message,
                icon: "error",
                dangerMode: true,
            });
        });

        AH.listen('body', 'keyup', '#authoring-modal input', function(el, e) {
            e.preventDefault();
            e.stopPropagation();
            if(e.keyCode == 13) {
                document.querySelector('#authoring-modal .addElement').click()
            }
        });
        
        AH.listen('body', 'click', '.dragable-container #steps input', function (element) {
            let date_parent = (element.getAttribute('id') == 'baseAuth') ? "dndmain" : '[id="' + element.parentElement.getAttribute('for') + '"]';
            AH.select('.parent').setAttribute('data-parent', date_parent);
            AH.select('.parent').removeAttribute('type');
        });

        AH.listen('body', 'click', '.dragable-container #dndmain .nav > li', function (element) {
            AH.select('.parent').setAttribute('data-parent', '[id="' + element.getAttribute('for') + '"]');
            AH.select('.parent').setAttribute('type', 'tab');
        });

        AH.listen('body', 'click', '#dndmain .nav textarea', function (element) {
            AH.setCss(element, {
                width : (element.value.length * 8 ) + 'px',
            })
        });

        AH.listen('body', 'click', '#upload_media, #drag_upload_media, #tab_upload_media, #step_upload_media', function () {
            AH.getBS('#modal-media-upload','Modal').show();
        });
    }

    function toggleBtn(current) {
        if (current.value.trim() != '') {
            AH.select('#authoring-modal .addElement', 'removeClass', 'h');
            AH.select('#authoring-modal .errorBtn', 'addClass', 'h')
        } else {
            DND_AUTH.error_message = l.required_field;
            AH.select('#authoring-modal .errorBtn', 'removeClass', 'h');
            AH.select('#authoring-modal .addElement', 'addClass', 'h')
        }
    }

    // function responsible for loading the module whenever the xml changes
    function loadModule(loadXml) {
		// convert xml 
		let newXml = XMLToJSON(loadXml);
		if (!newXml) {
			// return if xml format is not correct or there is any issue
			return false;
		}

        auth_store.update( (item) => {
            item.xml = loadXml
            return item;
        });

		QXML = newXml;
        if (state.store.xml != '') {
            let node = AH.parseHtml(state.store.xml);
            if (node.getAttribute('alt')) {
                let alt_attr = node.getAttribute('alt').replace("<","&lt;").replace(">","&gt;");
                node.setAttribute("alt", alt_attr.replace(/</g,"&lt;").replace(/>/g,"&gt;"));
            }
        }
        
        AH.select('#special_module_xml').value = loadXml;
        initialize();
        checkImageStatus(); 
        parseXMLAuthoring(newXml);
		state.data = loadNestedModule(QXML.smxml);
        AH.selectAll('.unupdated_node', 'remove');
	}

    // function for initializing and changing the dom whenever xml changes
    function initialize() {
        if (AH.select('#special_module_xml').value && AH.select('#special_module_xml').value.trim() != '') {
            DND_AUTH.bind_data(AH.parseHtml(AH.select('#special_module_xml').value));
        }
        
        let dndmain = AH.select('#dndmain');

        if (dndmain.nodeName && IS_EVENT_CALLED) {
            let events = AH.selectAll('#authoring-modal .ev');
            if (events.length) {
                for (let index = 0; index < events.length; index++) {
                    let cur_element = events[index];
                    let sub_element = AH.find(cur_element, 'input', 'all');
                    for (let sub_index = 0; sub_index < sub_element.length; sub_index++) {
                        let id = cur_element.getAttribute('type') + '-' + sub_element[sub_index].getAttribute('id');
                        if (AH.find(cur_element, '[for="' + sub_element[sub_index].getAttribute('id') + '"]')) {
                            AH.find(cur_element, '[for="' + sub_element[sub_index].getAttribute('id') + '"]').setAttribute("for", id);
                        }
                        sub_element[sub_index].setAttribute("id", id);
                    }
                }
            }

            // creating contextmenu
            DND_AUTH.isDNDExtended = checkDndExtended();
            DND_AUTH.contextMenuOption();
            enableDragResize();
            IS_EVENT_CALLED = 0;
        }

        if (AH.selectAll('#dndmain .nav textarea').length > 0) {
            let nav_textarea = AH.selectAll('#dndmain .nav textarea'); 
            for (let index = 0; index < nav_textarea.length; index++) {
                AH.setCss(nav_textarea[index], {
                    width : (nav_textarea[index].value.length * 8 ) + 'px',
                })
            }
        }

        if (AH.selectAll('[id^="ID"]').length > 0) {
            let hotspot_ids = AH.selectAll('[id^="ID"]');
            for (let index = 0; index < hotspot_ids.length; index++) {
                if (hotspot_ids[index].classList.contains('hotspot_auth')) {
                    let hostspot_children = hotspot_ids[index].children;
                    for (let sub_index = 0; sub_index < hostspot_children.length; sub_index++) {
                        if (hostspot_children[sub_index].classList.contains('hs_item') && AH.find(hostspot_children[sub_index], '.tools', 'all').length == 0) {
                            AH.insert(hostspot_children[sub_index], '<div class="btn-group tools" data-t="hotspot_click"><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', this, \''+ hostspot_children[sub_index].getAttribute('id')+'\');" class="btn btn-light px-1 pt-sm1 pb-sm1"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot_click\', \''+ hostspot_children[sub_index].getAttribute('id') +'\');" class="btn btn-light px-1 pt-sm1 pb-sm1"><i class="icomoon-new-24px-delete-1"></i></a></div>', 'beforeend');
                        }
                    }
                }
            }
        }

        if ( document.querySelectorAll('#dndmain .drag-resize, #dndmain .only-dragable').length > 0) {
            if ( AH.selectAll('#dndmain img:not([draggable])').length > 0) {
                AH.selectAll('#dndmain img:not([draggable])').forEach((element) => {
                    element.setAttribute('draggable', false);
                })
            }
        }

        try {
            if (AH.selectAll('#dndmain .nav .active').length > 0) {
                let steps = AH.selectAll('#dndmain .nav .active');
                let visible_node = [];
                steps.forEach((element) => {
                    if (element.getBoundingClientRect().top > 0) {
                        visible_node.push(element);
                    }
                })

                if (visible_node.length > 0) {
                    visible_node.forEach((element) => {
                        AH.select('.parent').setAttribute('data-parent', '[id="' + element.getAttribute('for') +'"]')
                        AH.select('.parent').setAttribute('type', 'tab')
                    });
                }
            } else if (AH.selectAll('#dndmain [type="step"]').length > 0) {
                let steps = AH.selectAll('#dndmain [type="step"]');
                let visible_node = [];
                steps.forEach((element) => {
                    if (element.getBoundingClientRect().top > 0) {
                        visible_node.push(element);
                    }
                })

                if (visible_node.length > 0) {
                    visible_node.forEach((element) => {
                        AH.select('.parent').setAttribute('data-parent', '[id="' + element.getAttribute('id') +'"]')
                    });
                }
            }
        } catch (error) {
            console.warn(error);
        }
        
    }

    // funciton for enabling drag and resize
    function enableDragResize() {
        let draggable = new Draggable({
            containment: '#dndmain',
            classes: "#dndmain .drag-resize, #dndmain .only-dragable",
            ignore: ['.tools', '.resizer']
        });

        draggable.changeContainment = function (element) {
            if (element.classList.contains('hs_item')) {
                return '#' + element.getAttribute('id').split('_')[0];
            } else if (element.closest('#dndmain .tab-content')) {
                element.closest('#dndmain .tab-content').id = 'tabContent' + element.id;
                return '#tabContent' + element.id;
            } else {
                return '#dndmain';
            }
        }

        draggable.onDragStop = function (event, position, ui) {
            if (AH.find(ui, '.tools')) {
                let type = (ui.classList.contains('hs_item')) ? "hotspot_click" : AH.select('#' + ui.id + '> .tools').getAttribute('data-t');
                DND_AUTH.updateElem(type, ui, ui.getAttribute('id'), ui);
                updateXML();
                if (AH.selectAll('#dndmain .tab-content').length) {
                    AH.selectAll('#dndmain .tab-content').forEach(function(element) {
                        element.id = '';
                    });
                }
            }
        }

        let resizable = new Resizable('#dndmain, #dndmain .drag-resize, #dndmain .only-dragable');

        resizable.onStart = function() {
            auth_store.update( (item) => {
                item.resize = true;
                return item;
            });
        }

        resizable.setLimit = function (x, y) {
            if (x <= minimum_resize) {
                x = minimum_resize;
            }

            if (y <= minimum_resize) {
                y = minimum_resize;
            }

            return {x:x, y:y};
        }
        resizable.onStop =  callOnResizeStop;
    }

    // function for parsing the xml 
    function parseXMLAuthoring(MYXML) {
		// taking the data from the xml and setting state accordingly
		bgImg = MYXML.smxml._bgimg;
		module_type = MYXML.smxml._type || 1;
		imgHeight = MYXML.smxml._height;
		imgWidth = MYXML.smxml._width;
        imgBorder = (MYXML.smxml._borderrequired == undefined) ? 0 : 1;
        
        auth_store.update( (item) => {
            item.bgImage = bgImg
            item.imgHeight = imgHeight;
            item.imgWidth = imgWidth;
            item.alt = MYXML.smxml._alt;
            if (MYXML.smxml._borderrequired == 1) {
                item.borderclass = borderclassname;
            }
            return item;
        });
		step = MYXML.smxml.step;

		if (Array.isArray(step) == false && step) {
			step = [];
			step[0] = MYXML.smxml.step;
		}
		
	}

    // function for changing the object to lowecase
    function objToLower(obj) {
		let newX = {};
		for ( let index in obj ) {
			newX[index.toLowerCase()] = obj[index];
		}
		return newX;
	}

    // function returns the nested module data
    function loadNestedModule(xml) {
		let customDrag = [], customDrop = [];
		if (xml) {
			if (xml.div) {
				isOldXml = true;
				xml.div.map(function (data, index){
					data = objToLower(data);
					if (data._anskey == "" || data._anskey == undefined) {
						customDrag.push(data);
					} else {
						let id = data._id.split("ID");
						let key = data._key.split("key");
						if(id[1] == key[1]) {
							data._anskey = "ID"+id[1];
						}
						customDrop.push(data);
					}
				});
			}
		}
        return [xml, customDrag, customDrop];
	}

	// setting the container height and width on the basis of image height and width
    function checkImageStatus(is_image_load) {
		let container = document.querySelectorAll("#" + container_id + " img");
		if (container.length > 0) {
			container.forEach(function (cur_element) {
				if (cur_element.complete) {
					let originalHeight = ((module_type == 1) ? DND_AUTH.getImageData('h', cur_element) : cur_element.naturalHeight) + (state.store.borderclass ? 8 : 0);
					let originalWidth = ((module_type == 1) ? DND_AUTH.getImageData('w', cur_element) : cur_element.naturalWidth) + (state.store.borderclass ? 8 : 0);
					if (Number(originalWidth) != 0 || Number(originalHeight) != 0 || (typeof from_myproject != "undefined" && from_myproject ==  1)) {
						AH.setCss("#" + container_id, {
							height: ((imgHeight && Number(imgHeight) >= Number(originalHeight)) ? imgHeight : originalHeight) + "px",
							width: ((imgWidth && Number(imgWidth) >= Number(originalWidth)) ? imgWidth : originalWidth) + "px"
						})
					}
				}
			})
		}
		if (is_image_load == 1) {
			image_loaded = 1;
		}
	}

    // function for changing the error
    function checkError() {
        auth_store.update( (item) => {
            item.xml = loadXml
            return item;
        });
    }

    // function for changing the step
    function changeStep(id) {
        let timer = setTimeout(function(){ 
            DND_AUTH.setStepAuth(id);
            clearTimeout(timer); 
        }, 100);
    }

    // function responsible for updating the xml using getchildxml
    function updateXML(isDeepUpdate) {
        let q_xml = document.querySelector('#special_module_xml').value;
        // convert single and double quote
        q_xml = q_xml.replace(/\’|\′/g,"&apos;").replace(/\″|\“|\”/g,"&quote;");
        
        if (state.store.xml != AH.select('#special_module_xml').value) {
            // update the xml
            isDeepUpdate ? getChildXml(q_xml, "deepUpdate") : getChildXml(q_xml);
        }
        auth_store.update( (item) => {
            item.updated = true;
            return item;
        });
	}

    // function for setting the position on the basis of key events
    function setPS(curWidth, curHeight, curTop, curLeft, isDelete) {
        let element = AH.selectAll('.elemActive');
        if (element.length > 0) {
            let elementActive = element[0];
            let key = elementActive.getAttribute('id');
            let xmlDom = AH.parseHtml(AH.select('#special_module_xml').value)
            let insert = AH.find(xmlDom, '[id="' + key + '"]');
            if (typeof(isDelete) !== "undefined" && isDelete && key != undefined) {
                DND_AUTH.deleteElem(AH.findChild(elementActive, '.tools').getAttribute('data-t'), key)
            } else if (elementActive.offsetHeight != 0 && elementActive.offsetWidth != 0) {
                curWidth = elementActive.offsetWidth + curWidth;
                curHeight = elementActive.offsetHeight + curHeight;
                curTop = elementActive.offsetTop + curTop;
                curLeft = elementActive.offsetLeft + curLeft;
                AH.setCss(elementActive, {
                    width: curWidth + "px",
                    height: curHeight + "px",
                    top: curTop + "px",
                    left: curLeft + "px"
                });
                let attributes = DND_AUTH.storage.store('#' + key , 'attributes');
                if (Array.isArray(attributes)) {
                    for (let index = 0; index < attributes.length; index++) {
                        switch (attributes[index].name) {
                            case "width" :
                                attributes[index].value = parseInt(elementActive.offsetWidth);
                                insert.setAttribute('width', attributes[index].value);
                                break;
                            case "height":
                                attributes[index].value = parseInt(elementActive.offsetHeight);
                                insert.setAttribute('height', attributes[index].value);
                                break;
                            case "top":
                                attributes[index].value = parseInt(elementActive.offsetTop);
                                insert.setAttribute('top', attributes[index].value);
                                break;
                            case "left":
                                attributes[index].value = parseInt(elementActive.offsetLeft);
                                insert.setAttribute('left', attributes[index].value);
                                break;
                        }
                    }
                }
                DND_AUTH.storage.store('#' + key , 'attributes', attributes);
                AH.select('#special_module_xml').value = (xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom));
                updateXML();
            }
            
        }
    }

    // calls in case of keydown event on the document and set the position of elements accoridngly
    function handleKeyDown (event) {
        if (AH.select('#dndmain').offsetHeight != 0 && event.keyCode) {
            if (event.ctrlKey && event.shiftKey) {
                event.preventDefault();
                switch ((event.keyCode).toString()) {
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
            } else if (event.ctrlKey) {
                switch ((event.keyCode).toString()) {
                    case "37":
                        event.preventDefault();
                        setPS(0, 0, 0, -1); // taken from else part
                        break;
                    case "38":
                        event.preventDefault();
                        setPS(0, 0, -1, 0); // taken from else part
                        break;
                    case "39":
                        event.preventDefault();
                        setPS(0, 0, 0, 1); // taken from else part
                        break;
                    case "40":
                        event.preventDefault();
                        setPS(0, 0, 1, 0); // taken from else part
                        break;
                }
            } else {
                switch ((event.keyCode).toString()) {
                    case "27":
                        AH.removeClass('.dragable-container .ui-draggable', 'elemActive');
                        break;
                    case "46":
                        setPS(0, 0, 0, 0, true);
                        break;
                }
            }
        }
    }

    // for changing the laod state
    function changeLoadState() {
        AH.select('#sample_image').remove();
        image_loaded = 1;
    }

    function callOnResizeStop (e, ui, updateResize = true) {
        if(updateResize){
            let pr = AH.select('.parent').getAttribute("data-parent");
            if (ui.id == "dndmain") {
                AH.select('.parent').setAttribute("data-parent", "dndmain");
            }
            let type = (ui.classList.contains('hs_item')) ? "hotspot_click"  :  AH.findChild(ui, '.tools').getAttribute('data-t');
            DND_AUTH.updateElem(type, ui, ui.getAttribute('id'), ui);
            AH.select('.parent').setAttribute("data-parent", pr);
            updateXML();
            let update_timer = setTimeout(function() {
                auth_store.update( (item) => {
                    item.resize = false;
                    return item;
                });
                clearTimeout(update_timer);
            }, 100);
        }
    }

    // for handling the resize property of the base
    let baseWidth;
    let isresizerClicked = false;
    $:baseWidth;
    let baseHeight;
    $:baseHeight;
    $:state.store.imgHeight = baseHeight;
    $:state.store.imgWidth = baseWidth;
    let m_posX;
    let m_posY;
    $:m_posX;
    $:m_posY;
    let dndMain;
    function resizeX(e){
        let dx = m_posX - e.x;
        m_posX = e.x;
        dndMain.style.width = (parseInt(getComputedStyle(dndMain, '').width) - dx) + "px";
    }
    function resizeY(e){
        let dy = m_posY - e.y;
        m_posY = e.y;
        dndMain.style.height = (parseInt(getComputedStyle(dndMain, '').height) - dy) + "px";
    }
    function resizeXY(e){
        let dx = m_posX - e.x;
        let dy = m_posY - e.y;
        m_posX = e.x;
        m_posY = e.y;
        dndMain.style.width = (parseInt(getComputedStyle(dndMain, '').width) - dx) + "px";
        dndMain.style.height = (parseInt(getComputedStyle(dndMain, '').height) - dy) + "px";
    }
    function resizeHandleW(e){
        m_posX = e.x;
        isresizerClicked = true;
        document.removeEventListener("mousemove", resizeY, false);
        document.addEventListener("mousemove", resizeX, false);
        document.addEventListener("mouseup", function(e){
                document.removeEventListener("mousemove", resizeX, false);
                document.removeEventListener("mousemove", resizeY, false);
                document.removeEventListener("mousemove", resizeXY, false);
                callOnResizeStop(e, dndMain, isresizerClicked);
                isresizerClicked = false;
        }, false);
    }
    function resizeHandleH(e){
        m_posY = e.y;
        isresizerClicked = true;
        document.removeEventListener("mousemove", resizeX, false);
        document.addEventListener("mousemove", resizeY, false);
        document.addEventListener("mouseup", function(e){
            document.removeEventListener("mousemove", resizeX, false);
            document.removeEventListener("mousemove", resizeY, false);
            callOnResizeStop(e, dndMain, isresizerClicked);
            isresizerClicked = false;
        }, false);
    }
    function resizeHandleWH(e){
        m_posX = e.x;
        m_posY = e.y;
        isresizerClicked = true;
        document.removeEventListener("mousemove", resizeX, false);
        document.removeEventListener("mousemove", resizeY, false);
        document.addEventListener("mousemove", resizeXY, false);
        document.addEventListener("mouseup", function(e){
            document.removeEventListener("mousemove", resizeX, false);
            document.removeEventListener("mousemove", resizeY, false);
            document.removeEventListener("mousemove", resizeXY, false);
            callOnResizeStop(e, dndMain, isresizerClicked);
            isresizerClicked = false;
        }, false);
    }
</script>

<div class="input_border dragable-container overflow-auto p">
    <div id="steps" class="h" >
		<input id="baseAuth" type="radio" on:click={() => DND_AUTH.setStepAuth('baseAuth')} defaultValue="1" defaultChecked name="rbsAuth" class="baseradio dndradio" /> 
		{l.base_steps}
		{#if step && step.length}
			{#each step as data}
                {#if (data._display == "1" || data._ddisplay == '1') && state.store.updated == false}
                    {changeStep(data._id)}
                {/if}
				<span for={data._id} key={data._id}>
					<input 
						id={"step_" + data._id} 
						type="radio" 
						on:click={() => DND_AUTH.setStepAuth(data._id)} 
						defaultValue="1" 
						name="rbsAuth" 
						class="baseradio dndradio" 
                        defaultChecked = {((data._display == "1" || data._ddisplay == '1') && state.store.updated == false) ? true : false} 
					/>
					{data._id}
				</span>
			{/each}
		{/if}	
	</div>

    <center>
        <!-- https://s3.amazonaws.com/jigyaasa_content_static/ -->
        <div 
            id="dndmain" 
            path="https://s3.amazonaws.com/jigyaasa_content_static/"
            style='height: 400px;width:100%;'
            bind:this={dndMain}
            bind:clientWidth={baseWidth}
            bind:clientHeight={baseHeight}
        >
            <div class="btn-group tools mr-1" data-t="base">
                <button title="{l.edit_base}" type="button" on:click={(event) => { DND_AUTH.elemModal('base', event.currentTarget, 'dndmain', state.store.bgImage, state.store)}} class="btn btn-light px-1 pt-sm1 pb-sm1 image-dialog"><i class="icomoon-24px-edit-1"></i></button>
            </div>
            {#if bgImg}
                <img height={imgHeight+"px"} width={imgWidth+"px"} src={"https://s3.amazonaws.com/jigyaasa_content_static/"+bgImg} class={state.store.borderclass} alt={state.store.alt ? state.store.alt : l.sample_img} on:error="{checkError}" on:load={()=> {checkImageStatus(1)}}/>
            {:else}
                <img id="sample_image" src="https://s3.amazonaws.com/jigyaasa_content_static/bg_000PLn.png" alt="{l.sample_img}" on:load={changeLoadState}/>
            {/if}
            {#if state.data && image_loaded} 
                <div>
                    <Drag index={0} modules={state.data[0].drag} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem}/>
                    <Drag index={1} modules={state.data[1]} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Drop index={0} modules={state.data[0].drop} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
					<Drop index={1} modules={state.data[2]} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
					<Radio index={0} modules={state.data[0].radio} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Select index={0} modules={state.data[0].select} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Textbox index={0} modules={state.data[0].textbox} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Multilinebox index={0} modules={state.data[0].multilinebox} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Checkbox index={0} modules={state.data[0].checkbox} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
					<Button index={0} modules={state.data[0].button} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
					<Tabhead index={0} modules={state.data[0].tabhead} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
					<Img index={0} modules={state.data[0].img} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Label index={0} modules={state.data[0].label} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Hotspot index={0} modules={state.data[0].hotspot} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Menulist index={0} modules={state.data[0].menulist} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} />
                    <Step index={0}  modules={state.data[0].step} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} {checkImageStatus} />
                    <Tab index={0} modules={state.data[0].tab} elemModal = {DND_AUTH.elemModal} deleteElem = {DND_AUTH.deleteElem} {checkImageStatus} />
                </div>
            {/if}

            <div id="resizeX" 
                on:mousedown|preventDefault|stopPropagation={resizeHandleW}></div>
            <div id="resizeY" 
                on:mousedown|preventDefault|stopPropagation={resizeHandleH}></div>
            <div id="resizeXY" 
                class="icomoon-resize" 
                on:mousedown|preventDefault|stopPropagation={resizeHandleWH}></div>
        </div>
    </center>
    <input type='hidden' id='special_module_xml' name='special_module_xml' />
    <button type='button' class='h' id='update_xml' name='update_xml'></button>
    <center>
        <div class="smnotes"></div>
    </center>
    <div class="parent h" data-parent="dndmain"></div>
    
    <DndModalBox isDNDExtended={DND_AUTH.isDNDExtended} imgBorder={imgBorder} />
</div>

<svelte:window on:keydown={handleKeyDown} />

<style>
    #resizeX {
        position: absolute;
        top: 0;
        right: 0;
        width: 3px;
        opacity: 1;
        height: 100%;
        cursor: w-resize;
    }
    #resizeY {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 3px;
        opacity: 1;
        cursor: s-resize;
    }
    #resizeXY {
        position: absolute;
        bottom: 0;
        right: 0;
        opacity: 1;
        cursor: se-resize;

    }
    #resizeXY::before{
        content: '\e354'
    }
    </style>
