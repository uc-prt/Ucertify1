
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, a9 as l, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, e as element, h as text, k as add_location, n as insert_dev, p as append_dev, F as set_data_dev, x as detach_dev, f as space, j as attr_dev, l as set_style, B as noop, L as beforeUpdate, A as AH, o as onMount, ab as afterUpdate, X as XMLToJSON, w as writable, q as listen_dev, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component } from './main-f5ccf37f.js';

/**
 *  File Name   : mathAuthString.js
 *  Author      : Ayush Srivastava
 *  Function    : Graph
 *  Version     : 1.0
 *  Packege     : clsSMGRAPH (Authoring)
 *  Last update : 02 Mar 2021
 *  Dependency  : JUI
 */
const JS = new JUI();

let isPointDraw = true;
let GRAPH_AUTH = {};

GRAPH_AUTH.isValid = true;
GRAPH_AUTH.stopUpdate = false;
GRAPH_AUTH.visible_class = '';

/*
 * used for the data storage of graph authoring
 */
GRAPH_AUTH.storage = {
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

/*
 * used for initialising the graph
 */
GRAPH_AUTH.initGraph = function () {
    let attrs;
    if ((JS.select('#special_module_xml').value).indexOf("smxml") > -1) {
        // called for update the xml tag's attributes and values
        if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '') {
            GRAPH_AUTH.bind_data(JS.parseHtml(JS.select('#special_module_xml').value));
        }

        let mthmain_type = JS.selectAll('#mthmain [type]');
        for (let index = 0; index < mthmain_type.length; index++) {
            attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#' + mthmain_type[index].id , 'attributes')); 
            GRAPH_AUTH.plotgraph(attrs.id, attrs.type, attrs.xaxis, attrs.yaxis, attrs.xtickdistance, attrs.ytickdistance, attrs.equation);
            if (typeof attrs.anskey != "undefined" && attrs.anskey != '') {
                for (let sub_index in JXG.boards) {
                    if ( JXG.boards[sub_index].container.includes('Preview') == false) {
                        let cur_value = JXG.boards[sub_index];
                        let ans = attrs.anskey.split('|'), is_point = 1;
                        for (let ans_index = 0; ans_index < ans.length; ans_index++) {
                            let cur_ans = ans[ans_index];
                            let key = cur_ans.split(',');
                            if (JS.select('#' + attrs.id).classList.contains('circle')) {
                                GRAPH_AUTH.drawCircle(attrs.id, cur_value, cur_ans);
                            } else if (JS.select('#' + attrs.id).classList.contains('association')) {
                                let point = cur_value.create('glider', [key[0], key[1], cur_value.axis], {
                                    name: "",
                                    snapSizeX: (attrs.xtickdistance / 10),
                                    snapSizeY: 0.4
                                });
                                GRAPH_AUTH.updateAndDraw(attrs.id, point);
                            } else if (JS.select('#' + attrs.id).classList.contains('plot')) {
                                if (cur_ans.indexOf(',') == -1) {
                                    let point = cur_value.create('point', [cur_ans, is_point], {
                                        name: ""
                                    });
                                    GRAPH_AUTH.updateAndDraw(attrs.id, point);
                                } else {
                                    let point = cur_value.create('point', [parseInt(key[0]), is_point], {
                                        name: ""
                                    });
                                    point.Xjc = parseInt(key[1]);
                                    GRAPH_AUTH.updateAndDraw(attrs.id, point, key[2]);
                                }

                                is_point++;
                            } else {
                                let point = cur_value.create('point', [parseInt(key[0]), parseInt(key[1])], {
                                    name: ""
                                });
                                if ( JS.select('#' + attrs.id).classList.contains('polygon')) {
                                    GRAPH_AUTH.updateAndDraw(attrs.id, point, ans);
                                } else {
                                    GRAPH_AUTH.updateAndDraw(attrs.id, point);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


/*
 * used for the resetting the data in the modal box
 */
GRAPH_AUTH.resetData = function (element) {
    JS.find('#authoring-modal', '.graphitem .h', {
        action : 'css',
        actionData: {
            display: 'none'
        }
    });

    if (element.value == 'sine' || element.value == 'cosine') {
        JS.select('#xaxis').value = '720';
        JS.select('#yaxis').value = '3';
        JS.select('#graph-width').value = '700';
        JS.select('#graph-height').value = '450';
        JS.select('#xtickdistance').value = '90';
        JS.select('#ytickdistance').value = '1';
        JS.select('#ytickdistance').readOnly = false;
        JS.select('#yaxis').readOnly = false;

        JS.find('#authoring-modal', '.graphitem .eq' , {
            action : 'css',
            actionData: {
                display: 'block'
            }
        });

        JS.find('#authoring-modal', '[id = "' + element.value + '"]' , {
            action : 'css',
            actionData: {
                display: 'block'
            }
        });
    } else if (element.value == 'association' || element.value == 'plot') {
        JS.select('#graph-height').value = '300';
        JS.select('#graph-width').value = '450';
        JS.select('#xaxis').value = '3';
        JS.select('#yaxis').value = '3';
        JS.select('#yaxis').readOnly = true;
        JS.select('#xtickdistance').value = '1';
        JS.select('#ytickdistance').value = '1';
        JS.select('#ytickdistance').readOnly = true;
        if (element.value == 'plot') {
            JS.select('#graph-width').value = '450';
            JS.select('#graph-height').value = '250';
        }
    } else {
        JS.select('#xaxis').value = '10';
        JS.select('#yaxis').value = '10';
        JS.select('#yaxis').readOnly = false;
        JS.select('#graph-height').value = '450';
        JS.select('#graph-width').value = '450';
        JS.select('#xtickdistance').value = '1';
        JS.select('#ytickdistance').value = '1';
        JS.select('#ytickdistance').readOnly = false;

        if (element.value == 'polygon') {
            JS.select('#polygon_type').value = '0';
        }
        let equation_container = ['line', 'sine', 'cosine', 'parabola', 'circle'];
        if (equation_container.indexOf(element.value) > -1) {
            JS.find('#authoring-modal', '#' + element.value, {
                action: 'css',
                actionData: {
                    display: 'block',
                }
            });
        }
    }
    JS.find('#authoring-modal', '[id = "' + element.value + '"]', {
        action: 'css',
        actionData: {
            display: 'block',
        }
    });

    JS.find('#authoring-modal', '#graph-equation', {
        action: 'value',
        actionData: ''
    });

    GRAPH_AUTH.resetModal();
};

/*
 * used to add the data in xml with
 */
GRAPH_AUTH.bind_data = function (xml) {
    // defines the type of graph
    let elem = '[type="' + xml.getAttribute('type') + '"]', attrs = [];

    if (xml.nodeName == "SMXML") {
        elem = "#mthmain";
    }
    
    // assign the data of available attributes and their value in attrs array in form of object
    for (let index = 0; index < xml.attributes.length; index++) {
        attrs[index] = {
            "name": xml.attributes[index].name,
            "value": xml.attributes[index].value
        };
    }

    if (typeof elem != "undefined") {
        // assign the value of attrs array in the xml tag's attributes according to their type attribute
        GRAPH_AUTH.storage.store('#'+ JS.select(elem).id, "attributes", attrs);
    }

    // checks if perticular xml tag have any other tag then also assign it's attributes and values and so on
    if (xml.children.length > 0) {
        for (let index = 0; index < xml.children.length; index++) {
            GRAPH_AUTH.bind_data(xml.children[index]);
        }
    }
};


/*
 * used to check for data entered in input field of modalbox and according to that calls GRAPH_AUTH.updateElem function for change the graph view after updating the value of xml
 */
GRAPH_AUTH.elemModal = function (type, current_element, key) {
    GRAPH_AUTH.resetModal();
    JS.selectAll('#authoring-modal .modal-body>.h', 'addClass', 'h');
    JS.listen('body', 'click', '.addElement', function () {
        /* for checking that perticular field is valid with their value otherwise it will not allow to close the dialog after click on add button and also shows message with approximately in red color */
        let auth_input = JS.selectAll('#authoring-modal .'+ GRAPH_AUTH.visible_class + ' input');
        for (let index = 0; index < auth_input.length; index++) {
            let cur_element = auth_input[index];
            if (cur_element.value == '' && (cur_element.classList.contains('num') || cur_element.classList.contains('integer'))) {
                GRAPH_AUTH.isValid = false;
                JS.selectAll('.error', 'remove');
                JS.setCss(cur_element, {
                    border: "1px solid red",
                    background: "#FFCECE"
                });
                JS.insert(cur_element.parentElement, '<span class="error text-danger">Please fill out this field</span>', 'beforeend');
            }

            if ((cur_element.getAttribute('id') == 'graph-width' || cur_element.getAttribute('id') == 'graph-height') && (parseInt(cur_element.value) < 200)) {
                GRAPH_AUTH.isValid = false;
                JS.selectAll('.error', 'remove');
                JS.setCss(cur_element, {
                    border: "1px solid red",
                    background: "#FFCECE"
                });
                JS.insert(cur_element.parentElement, '<span class="error text-danger">Value must be greater than or equal to 200.</span>', 'beforeend');
                cur_element.focus();
            }

            if ((cur_element.getAttribute('id') == 'xaxis' || cur_element.getAttribute('id') == 'yaxis') && (parseInt(cur_element.value) < 2)) {
                GRAPH_AUTH.isValid = false;
                JS.selectAll('.error', 'remove');
                JS.setCss(cur_element, {
                    border: "1px solid red",
                    background: "#FFCECE"
                });
                JS.insert(cur_element.parentElement, '<span class="error text-danger">Value must be greater than or equal to 2.</span>', 'beforeend');
                cur_element.focus();
            }

            if ((cur_element.getAttribute('id') == 'xtickdistance' || cur_element.getAttribute('id') == 'ytickdistance') && (parseInt(cur_element.value) < 1)) {
                GRAPH_AUTH.isValid = false;
                JS.selectAll('.error', 'remove');
                JS.setCss(cur_element, {
                    border: "1px solid red",
                    background: "#FFCECE"
                });
                JS.insert(cur_element.parentElement, '<span class="error text-danger">Value must be greater than or equal to 1.</span>', 'beforeend');
                cur_element.focus();
            }
        }
        if (GRAPH_AUTH.isValid == true) {
            // hides the math modal box 
            JS.getBS('#authoring-modal', 'Modal').hide();
            // change the value of element and update the xml and change the graph view
            GRAPH_AUTH.updateElem(type, key);
        }
    });

    JS.listen('body', 'click', '.resetElement', function () {
        // change the input fields value to its default value
        GRAPH_AUTH.resetData(JS.select('#authoring-modal #graph-type'));
        // change the value of element and update the xml and change the graph view
        GRAPH_AUTH.updateElem(type, key);
    });

    // shows the math modal box according to the value of type for change the view of graph
    switch (type) {
        case "plotgraph":
            // defines the title of math modal box
            JS.select('#authoring-modal .title').innerText = 'Plot Graph';
            // shows the body elements according  to type value
            JS.setCss('#authoring-modal .graphitem', {
                display: 'block'
            });
            break;
        case "numberline":
            JS.select('#authoring-modal .title').innerText = 'Number Line';
            JS.setCss('#authoring-modal .numberline', {
                display: 'block'
            });
            break;
    }
    // shows the math modal box to change the values of graph or it's type or both
    JS.getBS('#authoring-modal', 'Modal').show();
    GRAPH_AUTH.visible_class = type;

    // containes the name of the graph
    // for show the select type of graph in type dropdown in math modal box
    JS.select("#authoring-modal #graph-type").value = JS.select('[id="' + key + '"]').getAttribute('type');
    JS.selectAll('.equation_select', 'css', {
        display: 'none'
    });
    JS.find('#authoring-modal', '[id = "' + JS.select("#authoring-modal #graph-type").value + '"]', {
        action: 'css',
        actionData: {
            display: 'block',
        }
    });
    // key is the value of id of plot tag in xml
    if (key) {
        /* calls the GRAPH_AUTH.setData function to set the input fields value according to attributes value of plot tag of xml which are passed as argument in the form of object */
        GRAPH_AUTH.setData(GRAPH_AUTH.storage.store('#' + key, 'attributes'));
    }
};

// used for removing error messages
GRAPH_AUTH.resetModal = function () {
    JS.selectAll('.err-msg', 'addClass', 'd-none');
    JS.selectAll('input, .equation', 'removeAttr', 'style');
    JS.selectAll('.error', 'remove');
};

// sets the input elements value according to the value of plot tags attributes
GRAPH_AUTH.setData = function (attributes) {
    for (let index = 0; index < attributes.length; index += 1) {
        // select the input field according to attributes at perticular index
        let element = JS.select('#authoring-modal .' + GRAPH_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]');
        // sets the value of input fields 
        element.value = attributes[index]['value'];
    }
    // sets the value blank of element with id graph-anskey
    JS.select('#authoring-modal #graph-anskey').value = '';
    // sets the value blank of element with id reflection
    JS.select('#authoring-modal #reflection').value = '';
};

// used for getting the serialize data
GRAPH_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                };
            }
        } else if (element[index].name && !element[index].disabled) {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
};

/*
 * used to change the value of required data of graph as height, width, x-axis value, y-axis value etc and change the view of graph according to these changes
 */
GRAPH_AUTH.updateElem = function(type, key) {
    /* creates an array object of attribute as key and value as their value of select, textarea and input elements and their values and assign to attributes variable */
    let attributes_list = JS.find(JS.select('#authoring-modal .' + GRAPH_AUTH.visible_class), 'select, textarea, input', 'all');
    let attributes = GRAPH_AUTH.serialize(attributes_list);
    let wd, hd, hgt, xa, ya, xtk, ytk, defans, graphtype, attr = [], where = 'mthmain';

    /* sets the wd as width, hd as height, graphtype, xa as x-axis, ya as y-axis, xtk as x-axis interval ytk as y-axis interval variables values according to the name of key with their value */
    for (let index = 0; index < attributes.length; index++) {
        let cur_elem = attributes[index];
        if (cur_elem.name == "width") wd = cur_elem.value;
        if (cur_elem.name == "height") hd = cur_elem.value;
        if (cur_elem.name == "type") graphtype = cur_elem.value;
        if (cur_elem.name == "xaxis") xa = cur_elem.value;
        if (cur_elem.name == "yaxis") ya = cur_elem.value;
        if (cur_elem.name == "xtickdistance") xtk = cur_elem.value;
        if (cur_elem.name == "ytickdistance") ytk = cur_elem.value;
        if (cur_elem.name == "equation") defans = cur_elem.value;
        attr[cur_elem.name] = cur_elem.name;
    }

    if (type == "plotgraph" && key) {
        // select the element having id 'ID0' on Authoring area to plot the graph
        where = '[id="' + key + '"]';
        // assign the value to hgt variable after checking the condition
        hgt = (graphtype != 'plot') ? hd - 40 : hd - 75;
        // sets width, heigth, x-interval, y-interval, id, data-equation class, data-xaxis, data-yaxis etc attributes of plot area
        GRAPH_AUTH.storage.store('#' + key, 'attributes', attributes);
        JS.setAttr(where, {
            type: graphtype,
            class: graphtype,
            xaxis: xa,
            yaxis: ya,
            xtickdistance: xtk,
            ytickdistance: ytk
        });
        // sets the attributes to authoring plot container and also select the element inside this container that id starts with keyword 'ID' and sets its width and height;
        GRAPH_AUTH.storage.store('#mthmain', 'attributes', attributes);

        JS.setCss('#mthmain', {
            width: wd + 'px',
            height: hd + 'px'
        });

        JS.selectAll('#mthmain [id^="ID"]', 'css', {
            width: wd + 'px',
            height: hgt + 'px'
        });
        // plot the graph
        GRAPH_AUTH.plotgraph(key, graphtype, xa, ya, xtk, ytk, defans);
    }
    // calls for update the xml
    GRAPH_AUTH.updateXML(where, attributes);
};

/*
 * used to change the value of xml which is responsible for changing the view of graph
 */
GRAPH_AUTH.updateXML = function(where, attributes) {
    if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '' && !GRAPH_AUTH.stopUpdate) {
        let xmlDom = JS.parseHtml(JS.select('#special_module_xml').value);
        let insert;
        if (where == "mthmain") {
            insert = xmlDom;
        } else {
            insert = JS.find(xmlDom, where);
        }

        if (insert.nodeName) {
            for (let index_no = 0; index_no < attributes.length; index_no += 1) {
                insert.setAttribute(attributes[index_no].name, attributes[index_no].value);
            }
        }
        /* assign the changed xml after formating to input element has type hidden on graph.js file having id 'special_module_xml' and then getChildXml takes this value and update the props of the component */
        JS.select("#special_module_xml").value = GRAPH_AUTH.formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom));
    }
};

/*
 * used to draw the graph according to the value of xml
 */
GRAPH_AUTH.plotgraph = function(mid, type, xright, ytop, xticks, yticks, defans) {
    JXG.Options.point.snapToGrid = true;
    JXG.Options.point.snapSizeX = xticks;
    JXG.Options.point.snapSizeY = yticks;
    JXG.Options.point.showInfobox = true;
    let xleft = -xright, ybottom = -ytop;

    for (let index in JXG.boards) {
        if ( JXG.boards[index].container.includes('Preview') == false) {
            /* Delete a board and all its contents from the element where it is drawn. here passed agruments is the id of html where graph has drawn */
            JXG.JSXGraph.freeBoard(JXG.boards[index]);
        }
    }

    JS.selectAll('.footer_toolbox, .sliderbar', 'css', {
        display: 'none'
    });
    JS.select('#deleteElm').classList.remove('h');

    let board, axis, polygon;
    if (JS.select('#' + mid).classList.contains('association')) {
        /* Now it is not in used as it is discarded by Pete sir */
        board = JXG.JSXGraph.initBoard(mid, {
            boundingbox: [xleft, 3.4, xright, -5.4], //[-0.2, 3.4, 3.2, -5.4]
            axis: false,
            grid: false,
            zoom: {
                factorX: 1.25,
                factorY: 1.25,
                wheel: true,
                needshift: true,
                eps: 0.1
            },
            showCopyright: false,
            shownavigation: false
        });

        axis = board.create('line', [
            [0, 0.4],
            [1, 0.4]
        ], {
            firstArrow: true,
            lastArrow: true,
            strokecolor: '#3E3E3E',
            fillcolor: '#3E3E3E',
            fixed: true
        });
        board.axis = axis;
        board.create('ticks', [axis, xticks], {
            minorTicks: 9,
            majorHeight: 15,
            minorHeight: 5,
            drawLabels: true,
            label: {
                offset: [2, -10]
            },
            drawZero: true
        });

        polygon = board.create('polygon', [
            [-(xright + xticks), -2.4],
            [-(xright + xticks), -5.4],
            [(xright + xticks), -5.4],
            [(xright + xticks), -2.4]
        ], {
            fillcolor: "#ccc",
            highlightfillcolor: "#ccc",
            withLines: false
        });
    } else if (JS.select('#' + mid).classList.contains('plot')) {
        /* Initialise a new board. First parameter denotes id of the element in which the board is painted. Second parameter denotes an object that sets some of the board properties. Most of these properties can be set via JXG.Options. */
        board = JXG.JSXGraph.initBoard(mid, {
            boundingbox: [xleft, ytop, xright, -1], //[-0.2, 3.4, 3.2, -5.4]
            axis: false,
            grid: false,
            zoom: {
                factorX: 1.25,
                factorY: 1.25,
                wheel: true,
                needshift: true,
                eps: 0.1
            },
            showCopyright: false,
            shownavigation: false
        });
        axis = board.create('line', [
            [0, 0],
            [1, 0]
        ], {
            firstArrow: true,
            lastArrow: true,
            strokecolor: '#3E3E3E',
            fillcolor: '#3E3E3E',
            fixed: true
        });
        board.create('ticks', [axis, xticks], {
            minorTicks: 0,
            majorHeight: 15,
            minorHeight: 5,
            drawLabels: true,
            label: {
                offset: [-6, -16]
            },
            drawZero: true
        });
        board.xmax = xright;
        JS.selectAll('.footer_toolbox', 'css', {
            display: 'block'
        });
        JS.select('#deleteElm').classList.add('h');
    } else {
        board = JXG.JSXGraph.initBoard(mid, {
            boundingbox: [xleft, ytop, xright, ybottom],
            axis: false,
            grid: false,
            zoom: {
                factorX: 1.25,
                factorY: 1.25,
                wheel: true,
                needshift: true,
                eps: 0.1
            },
            showCopyright: false,
            shownavigation: false
        });
        let xaxis = board.create('axis', [
            [-Math.abs(xticks / 2), 0],
            [Math.abs(xticks / 2), 0]
        ]);
        xaxis.removeAllTicks();
        board.create('ticks', [xaxis, xticks], {
            strokeColor: '#ccc',
            majorHeight: -1, // Need this because the JXG.Options one doesn't apply
            drawLabels: true, // Needed, and only works for equidistant ticks
            label: {
                offset: [2, -10]
            },
            minorTicks: 3, // The NUMBER of small ticks between each Major tick
            drawZero: true
        });
        let yaxis = board.create('axis', [
            [0, -Math.abs(yticks / 2)],
            [0, Math.abs(yticks / 2)]
        ]);
        yaxis.removeAllTicks();
        board.create('ticks', [yaxis, yticks], {
            strokeColor: '#ccc',
            majorHeight: -1, // Need this because the JXG.Options one doesn't apply
            drawLabels: true, // Only works for equidistant ticks
            label: {
                offset: [4, -6]
            },
            minorTicks: 3, // The NUMBER of small ticks between each Major tick
            drawZero: false
        });
    }

    board.prevPoint = null;
    board.points = [];
    board.xtick = xticks;
    board.ytick = yticks;
    board.xaxis = xright;
    board.yaxis = ytop;
    let pointy = 1,
    getMouseCoordsAuth = function (e) {
        let cPos = board.getCoordsTopLeftCorner(e),
            absPos = JXG.getPosition(e, 0),
            dx = absPos[0] - cPos[0],
            dy = absPos[1] - cPos[1];
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
    },
    down = function (e) {
        let canCreate = true, coords, el;
        coords = getMouseCoordsAuth(e);
        for (el in board.objects) {
            if (JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                isPointDraw = false;
                break;
            }
        }
        if (canCreate) {
            let point, type;
            if (!JS.select('#' + mid).classList.contains('association')) {
                if (!JS.select('#' + mid).classList.contains('plot')) {
                    point = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]], {
                        name: ""
                    });
                } else {
                    point = board.create('point', [coords.usrCoords[1], pointy], {
                        name: "",
                        showInfobox: false
                    });
                    point.Xjc = point.X() + Math.abs(board.xtick);
                    type = JS.select('.footer_toolbox li.btn_active').getAttribute('data-value');
                    pointy++;
                    if (pointy == ytop) board.off('down');
                }
            } else {
                point = board.create('glider', [coords.usrCoords[1], coords.usrCoords[2], board.axis], {
                    name: "",
                    snapSizeX: (xticks / 10),
                    snapSizeY: 0.4
                });
            }
            GRAPH_AUTH.updateAndDraw(mid, point, type);
            GRAPH_AUTH.updateAttrs(mid, point);
            GRAPH_AUTH.updateXML('#' + mid, GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
        }
    };
    if (JS.select('#' + mid).classList.contains('association')) {
        board.axis.off('down').on('down', down);
    } else {
        board.off('down').on('down', down);
        if (JS.select('#' + mid).classList.contains('line') || JS.select('#' + mid).classList.contains('parabola')) {
            JS.selectAll('.sliderbar', 'css', {
                display: 'block',
                width: parseInt(JS.select('#' + mid).style.width) + 2 + 'px',
            });
            if (JS.find('.sliderbar', 'label').nodeName) {
                JS.find('.sliderbar', 'label').innerHTML = defans;
            }
        }
    }
    let options = JS.find('#mthmain','.selected-option');
    if (options.nodeName) {
        options.innerHTML = type;
        options.style.textTransform = 'capitalize';
    }
};

/*
 * After changing the value in xml it is responsilbe to draw the graph according to the updated value
 */
GRAPH_AUTH.updateAndDraw  = function (mid, point, isUpdate) {
    // used for update the equation of the sine and cosine graph
    let attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
    if (JS.select('#' + mid).classList.contains('plot')) {
        point.setAttribute({
            fillcolor: '#52A8EC',
            strokecolor: '#52A8EC'
        });
        if (JS.select('[data-value="' + isUpdate + '"]').nodeName && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel') && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel').indexOf('segment') == 0) {
            point.board.prevPoint = point.board.create('point', [point.Xjc, point.Y()], {
                name: "",
                fillcolor: '#52A8EC',
                strokecolor: '#52A8EC',
                fixed: true
            });
            point.for = point.board.create('line', [point.board.prevPoint, point], {
                straightFirst: false,
                straightLast: false,
                firstArrow: false,
                lastArrow: false,
                strokeWidth: "2",
                fillcolor: '#52A8EC',
                strokecolor: '#52A8EC'
            });
            point.for.name = isUpdate;
            switch (isUpdate) {
                case "SLH":
                    point.setAttribute({
                        fillcolor: '#fff',
                        strokecolor: '#52A8EC'
                    });
                    break;
                case "SRH":
                    point.board.prevPoint.setAttribute({
                        fillcolor: '#fff',
                        strokecolor: '#52A8EC'
                    });
                    break;
                case "SBH":
                    point.setAttribute({
                        fillcolor: '#fff',
                        strokecolor: '#52A8EC'
                    });
                    point.board.prevPoint.setAttribute({
                        fillcolor: '#fff',
                        strokecolor: '#52A8EC'
                    });
                    break;
            }
        } else if (JS.select('[data-value="' + isUpdate + '"]').nodeName && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel') && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel').indexOf('ray') == 0 ) {
            switch (isUpdate) {
                case "RL":
                    point.board.prevPoint = point.board.create('point', [-Math.abs(point.board.xmax), point.Y()], {
                        visible: false
                    });
                    break;
                case "RR":
                    point.board.prevPoint = point.board.create('point', [Math.abs(point.board.xmax), point.Y()], {
                        visible: false
                    });
                    break;
                case "RRH":
                    point.setAttribute({
                        fillcolor: '#fff',
                        strokecolor: '#52A8EC'
                    });
                    point.board.prevPoint = point.board.create('point', [-Math.abs(point.board.xmax), point.Y()], {
                        visible: false
                    });
                    break;
                case "RLH":
                    point.setAttribute({
                        fillcolor: '#fff'
                    });
                    point.board.prevPoint = point.board.create('point', [Math.abs(point.board.xmax), point.Y()], {
                        visible: false
                    });
                    break;
            }
            point.for = point.board.create('line', [point.board.prevPoint, point], {
                straightFirst: true,
                straightLast: false,
                firstArrow: true,
                lastArrow: false,
                strokeWidth: "2",
                fillcolor: '#52A8EC',
                strokecolor: '#52A8EC'
            });
            point.for.name = isUpdate;
        }
        point.board.on('move', function () {
            if (point.Yjc != null) {
                point.moveTo([point.X(), point.Yjc]);
            }
        });
        point.on('over', function () {
            if (!this.visProp.fixed) {
                point.board.containerObj.style.cursor = 'e-resize';
            }
        });
        point.on('out', function () {
            if (!this.visProp.fixed) {
                point.board.containerObj.style.cursor = 'default';
            }
        });
    } else {
        point.board.points.push(point);
        if (point.board.prevPoint == null) {
            point.board.prevPoint = point;
        } else {
            if (JS.select('#' + mid).classList.contains('line')) {
                point.for = point.board.create('line', [point, point.board.prevPoint], {
                    straightFirst: true,
                    straightLast: true,
                    firstArrow: true,
                    lastArrow: true,
                    strokeWidth: 2
                });
                GRAPH_AUTH.getEquation(mid, point.board.prevPoint.X(), point.board.prevPoint.Y(), point.X(), point.Y());
            } else if (JS.select('#' + mid).classList.contains('circle')) {
                point.for = point.board.create('circle', [point.board.prevPoint, point], {
                    straightFirst: true,
                    straightLast: true,
                    firstArrow: true,
                    lastArrow: true,
                    strokeWidth: 2
                });
                point.for.center.for = point.for;
            } else if (JS.select('#' + mid).classList.contains('segment')) {
                point.for = point.board.create('line', [point, point.board.prevPoint], {
                    straightFirst: false,
                    straightLast: false,
                    firstArrow: false,
                    lastArrow: false,
                    strokeWidth: 2
                });
            } else if (JS.select('#' + mid).classList.contains('vector')) {
                point.for = point.board.create('line', [point, point.board.prevPoint], {
                    straightFirst: false,
                    straightLast: false,
                    firstArrow: true,
                    lastArrow: false,
                    strokeWidth: 2
                });
            } else if (JS.select('#' + mid).classList.contains('ray')) {
                point.for = point.board.create('line', [point, point.board.prevPoint], {
                    straightFirst: true,
                    straightLast: false,
                    firstArrow: true,
                    lastArrow: false,
                    strokeWidth: 2
                });
            } else if (JS.select('#' + mid).classList.contains('parabola')) {
                point.board.prevPoint.setAttribute({
                    fixed: true
                });
                point.setAttribute({
                    fixed: true
                });
                let fx = GRAPH_AUTH.getEquation(mid, point.board.prevPoint.X(), point.board.prevPoint.Y(), point.X(), point.Y());
                let f = point.board.jc.snippet(fx, true, 'x', true);
                point.for = point.board.create('functiongraph', [f]);
                point.for.point1 = point.board.prevPoint;
                point.for.point2 = point;
            } else if (JS.select('#' + mid).classList.contains('polygon')) {
                if (typeof isUpdate == "undefined") {
                    point.for = point.board.create('polygon', [point.board.prevPoint, point]);
                    point.board.prevPoint = point;
                } else {
                    if (isUpdate.length == point.board.points.length) {
                        point.for = point.board.create('polygon', point.board.points, {
                            boadres: {
                                strokecolor: "darkgray",
                                strokewidth: 2
                            }
                        });
                        point.for.parents.for = point.for;
                        point.board.prevPoint = null;
                        point.board.points = [];
                    }
                }
            } else if (JS.select('#' + mid).classList.contains('sine')) {
                //point.for = point.board.create('functiongraph', [function(x) {return Math.sin(x);}]);
                let i = point.board.prevPoint,
                    s = point;
                point.for = point.board.create('curve', [function (e) {
                    return e;
                }, function (e) {
                    let t = i.coords.usrCoords,
                        n = s.coords.usrCoords,
                        r = t[1],
                        o = t[2],
                        u = n[1],
                        a = n[2],
                        f = a - o,
                        l = 1 / (4 * (u - r)),
                        constant;
                    constant = Math.round((o - (f * Math.sin((Math.PI * r) / 180))));
                    if (constant.toString().indexOf('-') > -1) {
                        attrs.equation = "y=" + f + '*sin(x)' + constant;
                    } else {
                        attrs.equation = "y=" + f + '*sin(x)+' + constant;
                    }
                    GRAPH_AUTH.storage.store('#' + mid, 'attributes',  GRAPH_AUTH.setInIndex(attrs));
                    return f * Math.sin(2 * Math.PI * l * (e - r)) + o;
                }]);
                point.for.point1 = point.board.prevPoint;
                point.for.point2 = point;
            } else if (JS.select('#' + mid).classList.contains('cosine')) {
                let i = point.board.prevPoint,
                    s = point;
                point.for = point.board.create('curve', [function (e) {
                    return e;
                }, function (e) {
                    let t = i.coords.usrCoords,
                        n = s.coords.usrCoords,
                        r = t[1],
                        o = t[2],
                        u = n[1],
                        a = n[2],
                        f = (a - o),
                        l = 1 / (4 * (r - u)),
                        constant1;
                    constant1 = Math.round((o - (f * Math.cos((Math.PI * r) / 180))));
                    if (constant1.toString().indexOf('-') > -1) {
                        attrs.equation = "y=" + f + '*cos(x)' + constant1;
                    } else {
                        attrs.equation = "y=" + f + '*cos(x)+' + constant1;
                    }
                    GRAPH_AUTH.storage.store('#' + mid, 'attributes',  GRAPH_AUTH.setInIndex(attrs));
                    return f * Math.cos(2 * Math.PI * l * (e - u)) + o;
                }]);
                point.for.point1 = point.board.prevPoint;
                point.for.point2 = point;
            }
            if (!JS.select('#' + mid).classList.contains('polygon')) {
                point.board.prevPoint = null;
            }
        }
    }
    point.on('down', function () {
        if (JS.select('#' + mid).classList.contains('plot')) {
            this.Yjc = this.Y();
            if (typeof this.for == "undefined") this.startPosition = this.X() + ',' + this.name;
            else this.startPosition = this.for.point2.X() + ',' + this.for.point1.X() + ',' + this.for.name;
        } else if (JS.select('#' + mid).classList.contains('association')) {
            this.startPosition = this.X().toFixed(1) + "," + this.Y().toFixed(1) + ',' + this.X().toFixed(1);
        } else {
            this.startPosition = this.X() + "," + this.Y();
            if (JS.select('#' + mid).classList.contains('polygon') && point.board.points.length > 0) {
                if (this.X() + "," + this.Y() == point.board.points[0].X() + "," + point.board.points[0].Y()) //point.board.hasPoint(this.X(), this.Y())
                {
                    point.for = point.board.create('polygon', point.board.points, {
                        boadres: {
                            strokecolor: "darkgray",
                            strokewidth: 2
                        }
                    });
                    point.for.parents.for = point.for;
                    point.board.prevPoint = null;
                    point.board.points = [];
                }
            }
        }
        if (typeof this.for != "undefined" && this.for.elType == "circle") {
            this.startPosition = Math.round(this.for.Radius());
        }
    });
    point.on('up', function () {
        if (! JS.select('#deleteElm').children[0].classList.contains('active')) {
            if (isPointDraw) {
                // update the attributes of plot canvas container
                GRAPH_AUTH.updateAttrs(mid, this, true);
                // update the xml according to update the attributes
                GRAPH_AUTH.updateXML('#' + mid, GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
            }
        } else {
            /* removes the plotted point when mouse up on it and according to this also removes graph if the children of the element having id deleteElm has active class */
            if (JS.select('#' + mid).classList.contains('point')) {
                //removes the point from board on which mouse up
                point.board.removeObject(this);
                // co-ordinate of point on which mouse up
                this.position = this.startPosition;
            } else if (JS.select('#' + mid).classList.contains('association')) {
                /* discarded by Pete sir */
                point.board.removeObject(this);
                this.position = this.startPosition;
            } else if (JS.select('#' + mid).classList.contains('circle')) {
                //removes the reference of the circle
                point.board.removeObject(this);
                // removes the center of the circle
                point.board.removeObject(this.for.center);
                /* removes second point which lies on circumference of the circle for decide the radius of circle */
                point.board.removeObject(this.for.point2);
                /* contains center and radius of the circle which is deleted */
                this.position = this.for.center.X() + "," + this.for.center.Y() + "/" + Math.round(this.for.Radius());
            } else if (JS.select('#' + mid).classList.contains('polygon') && typeof this.for != "undefined") {
                let vertices = [];
                if (typeof this.for.parents.for != "undefined") {
                    for (let i = 0; i < point.for.vertices.length; i++) {
                        // removes the vertics of the polygon with specified index
                        point.board.removeObject(this.for.parents.for.vertices[i]);
                        // push the co-ordinates of the vertics at specified index in vertices array
                        vertices.push(this.for.parents.for.vertices[i].X() + ',' + this.for.parents.for.vertices[i].Y());
                    }
                    // removes the polygon reference
                    point.board.removeObject(this.for.parents.for);
                    // removes last index value from vertices array
                    vertices.pop(vertices[vertices.length - 1]);
                    // assign the values of vertices array after joining it by '|' into 'this.position'
                    this.position = vertices.join('|');
                } else {
                    JS && JS.showmsg(l.last_point, 3000);
                    return false;
                }
            } else {
                if (typeof this.for != "undefined") {
                    // removes the point reference from plot board
                    point.board.removeObject(this.for);
                    // removes the first point from plot board
                    point.board.removeObject(this.for.point1);
                    // removes the second point from plot board
                    point.board.removeObject(this.for.point2);
                    // sets the position key value for manage the anskey
                    this.position = this.for.point1.X() + ',' + this.for.point1.Y() + '|' + this.for.point2.X() + ',' + this.for.point2.Y();
                } else {
                    if (JS.select('#' + mid).classList.contains('parabola')) {
                        JS && JS.showmsg(l.curve_start_point, 3000);
                    }
                }
            }

            /* for warning in parabola when clicked other than last point of the curve to delete it */
            if (JS.select('#' + mid).classList.contains('parabola')) {
                if (typeof this.for != "undefined") {
                    // changes the attributes value of plot canvas container
                    GRAPH_AUTH.updateDeleteAttrsAuth(mid, this.position);
                    // updates the xml
                    GRAPH_AUTH.updateXML('#' + mid, GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
                    // removes the active class from delete button
                    JS.select('#deleteElm').children[0].classList.remove('active');
                } else {
                    console.warn({
                        msg: l.warning_this_for
                    });
                }
            } else {
                // changes the attributes value of plot canvas container
                GRAPH_AUTH.updateDeleteAttrsAuth(mid, this.position);
                // updates the xml
                GRAPH_AUTH.updateXML('#' + mid, GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
            }

        }
    });
    point.on('over', function () {
        /* if delete button on preview container has active classs then on hover it, it shows the text 'Delete',hides the box which contains the co-ordinate of that point on which mouseover and sets its stroke and fill color to 'black' */
        if (!this.visProp.fixed && JS.select('#deleteElm').children[0].classList.contains('active')) {
            if (JS.select('#' + mid).classList.contains('point')) {
                this.setAttribute({
                    name: 'Delete',
                    showInfobox: false,
                    fillcolor: '#000',
                    strokecolor: '#000'
                });
            } else if (JS.select('#' + mid).classList.contains('circle') && typeof this.for != "undefined") {
                this.for.center.setAttribute({
                    name: 'Delete',
                    showInfobox: false,
                    fillcolor: '#000',
                    strokecolor: '#000'
                });
                this.for.point2.setAttribute({
                    name: 'Delete',
                    showInfobox: false,
                    fillcolor: '#000',
                    strokecolor: '#000'
                });
            } else if (JS.select('#' + mid).classList.contains('polygon') && typeof this.for != "undefined") {
                if (typeof this.for.parents.for != "undefined") {
                    this.setAttribute({
                        name: 'Delete',
                        showInfobox: false,
                        fillcolor: '#000',
                        strokecolor: '#000'
                    });
                }
            } else if (JS.select('#' + mid).classList.contains('sine') || JS.select('#' + mid).classList.contains('cosine')) {
                if (typeof this.for != "undefined") this.for.point2.setAttribute({
                    name: 'Delete',
                    showInfobox: false,
                    fillcolor: '#000',
                    strokecolor: '#000'
                });
            } else if (JS.select('#' + mid).classList.contains('association')) {
                this.setAttribute({
                    name: 'Delete',
                    showInfobox: false,
                    fillcolor: '#000',
                    strokecolor: '#000'
                });
            } else {
                if (typeof this.for != "undefined") this.for.point1.setAttribute({
                    name: 'Delete',
                    showInfobox: false,
                    fillcolor: '#000',
                    strokecolor: '#000'
                });
            }
        }
    });
    point.on('out', function () {
        /* if delete button on preview container has active classs then mouseout on it, it sets the text blank, allow to show the box which contains the co-ordinate of that point on which mouseout and sets its stroke and fill color to 'red' */
        if (!this.visProp.fixed && JS.select('#deleteElm').children[0].classList.contains('active')) {
            if (JS.select('#' + mid).classList.contains('point')) {
                this.setAttribute({
                    name: '',
                    showInfobox: true,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
            } else if (JS.select('#' + mid).classList.contains('circle') && typeof this.for != "undefined") {
                this.for.center.setAttribute({
                    name: '',
                    showInfobox: true,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
                this.for.point2.setAttribute({
                    name: '',
                    showInfobox: true,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
            } else if (JS.select('#' + mid).classList.contains('polygon') && typeof this.for != "undefined") {
                if (typeof this.for.parents.for != "undefined") this.setAttribute({
                    name: '',
                    showInfobox: true,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
            } else if (JS.select('#' + mid).classList.contains('sine') || JS.select('#' + mid).classList.contains('cosine')) {
                if (typeof this.for != "undefined") this.for.point2.setAttribute({
                    name: '',
                    showInfobox: false,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
            } else if (JS.select('#' + mid).classList.contains('association')) {
                this.setAttribute({
                    name: '',
                    showInfobox: true,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
            } else {
                if (typeof this.for != "undefined") this.for.point1.setAttribute({
                    name: '',
                    showInfobox: true,
                    fillcolor: '#ff0000',
                    strokecolor: '#ff0000'
                });
            }
        }
    });
};


/*
 * used to update the plot canvas container's attributes after removing the point
 */
GRAPH_AUTH.updateDeleteAttrsAuth  = function (mid, point) {
    // object having keys with the name of attributes and values as their values
    let attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
    let ans = attrs.anskey.split('|'), val = [];
    switch (JS.select('#' + mid).getAttribute('type')) {
        case "point":
        case "circle":
            for (let index = 0; index < ans.length; index++) {
                if (ans[index] != point) {
                    val.push(ans[index]);
                }
            }
            break;
        case "line":
        case "segment":
        case "ray":
        case "vector":
        case "sine":
        case "cosine":
        case "association":
            if (point != null) {
                let sub_point = point.split('|');
                val = ans.filter( function(element) { return !this.has(element) }, new Set(sub_point) );
            }
            break;
    }
    // sets the anskey of the attrs object
    attrs.anskey = val.join('|');
    // sets the reflection of the attrs object blank and equation 'y=x + 1'
    attrs.reflection = '';
    attrs.equation = '';
    // sets the attributes of the plot canvas container
    GRAPH_AUTH.storage.store('#' + mid, 'attributes', GRAPH_AUTH.setInIndex(attrs));
};

/*
 * used to update the attributes value 
 */
GRAPH_AUTH.updateAttrs  = function (mid, point, isUpdate) {
    /* object having keys as attributes name and values as attributes values of plot canvas container */
    let attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#' + mid, 'attributes'));
    // set the anskey blank if it is undefined
    if (typeof attrs.anskey == "undefined") {
        attrs.anskey = "";
    }
    if (typeof point.for != "undefined" && point.for.elType == "circle") {
        // used to set the center co-ordintes of the circle
        let center = point.for.center,
            cp = center.X() + "," + center.Y();
        if (typeof point.startPosition != "undefined") cp += '/' + point.startPosition;
        // updates the anskey value
        attrs.anskey = attrs.anskey.replace(cp, center.X() + "," + center.Y() + "/" + Math.round(point.for.Radius()));
        if (point.for.Radius()) {
            attrs.equation = "(x-" + center.X() + ")^2+(y-" + center.Y() + ")^2=" + Math.round(point.for.Radius()) + "^2";
            attrs.equation = attrs.equation.replace(/--/gm, '+');
        }
    } else if (isUpdate) {
        if (attrs.reflection == undefined || attrs.reflection == '') {
            /* replaces the position of the point on graph board from attrs.reflection to blank on which mouseup when delete button is not active */
            attrs.reflection = attrs.reflection.replace(point.startPosition, '');
            /* creates array of x an y position of the point on which mouseup when delete button is not active */
            point.startPosition = point.startPosition.split(',');
            if (attrs.polygon_type == '1') {
                /* replaces the x co-ordinate and y co-ordinate with multiply by -1 separated with comma of the point on which mouse up to blank from anskey of attrs object */
                attrs.anskey = attrs.anskey.replace(point.startPosition[0] + ',' + point.startPosition[1] * -1, '');
            } else if (attrs.polygon_type == '2') {
                /* replaces the y co-ordinate and x co-ordinate with multiply by -1 separated with comma of the point on which mouse up to blank from anskey of attrs object */
                attrs.anskey = attrs.anskey.replace(point.startPosition[0] * -1 + ',' + point.startPosition[1], '');
            } else if (attrs.polygon_type == '3') {
                /* replaces the x and y co-ordinate with multiply by -1 separated with comma of the point on which mouse up to blank from anskey of attrs object */
                attrs.anskey = attrs.anskey.replace(point.startPosition[0] * -1 + ',' + point.startPosition[1] * -1, '');
            }
        }

    }
    if (typeof point.for == "undefined" || point.for.elType != "circle") {
        if (attrs.type != "polygon") {
            // returns an array for which callback function returns true
            attrs.anskey = attrs.anskey.split('|').filter((el) => {return el});
            if (JS.select('#' + mid).classList.contains('association')) {
                /* discarded by Pete sir */
                attrs.anskey.push(point.X().toFixed(1) + ',' + point.Y().toFixed(1) + ',' + point.X().toFixed(1));
            } else if (JS.select('#' + mid).classList.contains('plot')) {
                if (typeof point.for == "undefined") {
                    // push the co-ordinates of point into attrs.anskey array when it is plotted on plot board
                    attrs.anskey.push(point.X() + ',' + point.name);
                } else {
                    // push the co-ordinates of point into attrs.anskey array when it is plotted on plot board
                    attrs.anskey.push(point.for.point2.X() + ',' + point.for.point1.X() + ',' + point.for.name);
                }
            } else {
                // push the co-ordinates of point into attrs.anskey array when it is plotted on plot board
                attrs.anskey.push(point.X() + ',' + point.Y());
            }
            // converted attrs.anskey array into string
            attrs.anskey = attrs.anskey.join('|');
            if (JS.select('#' + mid).classList.contains('line') || JS.select('#' + mid).classList.contains('parabola')) {
                let prev = null;
                let ans_keys = attrs.anskey.split('|');
                for (let index = 0; index < ans_keys.length; index++) {
                    let key = ans_keys[index].split(',');
                    if (prev == null) {
                        prev = key;
                    } else {
                        attrs.equation = GRAPH_AUTH.getEquation(mid, prev[0], prev[1], key[0], key[1]);
                    }
                }
            }
        } else {
            if (attrs.polygon_type != '0') {
                // returns an array for which callback function returns true
                attrs.reflection = attrs.reflection.split('|').filter((el) => {return el});
                // push the x, y co-ordinates of plotted point into attrs.reflection array
                attrs.reflection.push(point.X() + ',' + point.Y());
                // converts attrs.reflection array into string
                attrs.reflection = attrs.reflection.join('|');
                if (point.board.points.length == 0) {
                    /* split the attrs.reflection string from '|' and again join it with '|'. why it is used i do not know but it should not be there */
                    attrs.reflection = attrs.reflection.split('|').join('|');
                }
            }
            // returns an array for which callback function returns true
            attrs.anskey = attrs.anskey.split('|').filter((el) => {return el});
            if (attrs.polygon_type == '0') {
                /* pushes the x and y co-ordinate separated with comma of the plotted point into attrs.anskey array */
                attrs.anskey.push(point.X() + ',' + point.Y());
            } else if (attrs.polygon_type == '1') {
                /* pushes the x co-ordinate  and y co-ordinate with multiply by -1 separated with comma of the plotted point into attrs.anskey array */
                attrs.anskey.push(point.X() + ',' + (point.Y() * (-1)));
            } else if (attrs.polygon_type == '2') {
                /* pushes the y co-ordinate  and x co-ordinate with multiply by -1 separated with comma of the plotted point into attrs.anskey array */
                attrs.anskey.push((point.X() * (-1)) + ',' + point.Y());
            } else if (attrs.polygon_type == '3') {
                /* pushes the x and y co-ordinate with multiply by -1 separated with comma of the plotted point into attrs.anskey array */
                attrs.anskey.push((point.X() * (-1)) + ',' + (point.Y() * (-1)));
            }
            attrs.anskey = attrs.anskey.join('|');
            if (point.board.points.length == 0) {
                /* split the attrs.anskey string from '|' and again join it with '|'. why it is used i do not know but it should not be there */
                attrs.anskey = attrs.anskey.split('|').join('|');
            }
        }
    }
    // sets equation to the label tag inside element has class sliderbar
    if (JS.find('.sliderbar','label').nodeName) {
        JS.find('.sliderbar','label').innerHTML = attrs.equation;
    }
    // sets the attributes of plot canvas container
    GRAPH_AUTH.storage.store('#' + mid, 'attributes',  GRAPH_AUTH.setInIndex(attrs));
};

/*
 * used to return an object of attributes with keys as name of attributes and values as their values
 */
GRAPH_AUTH.setInAssoc  = function (attrs) {
    let ret = {};
    if (attrs) {
        for (let index = 0; index < attrs.length; index++) {
            ret[attrs[index].name] = attrs[index].value;
        }
    }
    return ret;
};


/*
 * return an object having names as attributes name and values as their values
 */
GRAPH_AUTH.setInIndex  = function (attrs) {
    let ret = [];
    if (attrs) {
        for (let index in attrs) {
            ret.push({
                "name": index,
                "value": attrs[index]
            });
        }
    }
    return ret;
};

/*
 * used to generate the equation of parabola or line
 */
GRAPH_AUTH.getEquation  = function (mid, prevX, prevY, pointX, pointY) {
    let equation, a, attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#' + mid, 'attributes')),
        eq = attrs.equation.split("="), eqn;
    switch (JS.select('#' + mid).getAttribute('type')) {
        case "parabola": {
                if (eq[0].indexOf('y^2') == -1) {
                    // it will applied when region bounded on x-axis
                    a = Math.round(eval((pointY - prevY) / (Math.pow((pointX - prevX), 2))) * 10) / 10;
                    // equation of the parabola
                    equation = "y=a*(x-h)^2+k";
                    // puts the value of a, h, k in equation of parabola and changes the operators according to math operators theory as (- * - = +) and (+ * - = -)
                    eqn = equation.replace('a', a).replace('h', prevX).replace('k', prevY).replace('--', '+').replace('+-', '-');
                }
                break;
            }
        case "line": {
            // defines the line equation
            equation = "(y-y1)=m*(x-x1)";
            // tangent found by using formula m = (y2 - y1)/(x2 - x1)
            let m = Math.round(eval((pointY - prevY) / (pointX - prevX)) * 10) / 10;
            // puts the value of x1, y1, m in equation
            eqn = equation.replace('m', m).replace('y1', prevY).replace('x1', prevX);
            /* applied operator according to math operators as in math (- * - = +), (+ * + = +), (- * + = -) and (+ * - = -) */
            eqn = eqn.replace(/\-\-/g, '+').replace(/\+\+/g, '+').replace(/\-\+/g, '-').replace(/\+\-/g, '-');
            break;
        }
    }
    return eqn;
};

/*
 * used to draw the circle
 */
GRAPH_AUTH.drawCircle  = function (mid, brd, val) {
    let key = val.split('/'), point;
    for (let index = 0; index < key.length; index ++) {
        let ans_point = key[0].split(',');
        if (key[index].indexOf(',') != -1) {
            point = brd.create('point', [parseInt(ans_point[0]), parseInt(ans_point[1])], {
                name: ""
            });
            // prevPoint = point;
        } else {
            let next = (parseInt(ans_point[0]) - parseInt(key[1]));
            point = brd.create('point', [parseInt(next), parseInt(ans_point[1])], {
                name: ""
            });
        }
        GRAPH_AUTH.updateAndDraw(mid, point);
    }
};

/*
 * used to format the xml and according to this can be seen an updated graph view.
 */
GRAPH_AUTH.formatXml = function (xml) {
    /* pattern of finding data where closing, opening angular bracket found together and optionally backslash meets but i think pattern is wrong */
    let reg = /(>)(<)(\/*)/g;
    /* pattern to match all spaces and then any characters and then one or more numbers of spaces and character back slash and n meets together */
    let wsexp = / *(.*) +\n/g;
    /* pattern for matching any data between open and closing angular bracket and one or more number of back slash and n character where meets together */
    let contexp = /(<.+>)(.+\n)/g;
    // replaces back slash and t characters where both meets together to blank
    xml = xml.replace(/\t/g, "");
    // replaces the matching pattern from xml to given data
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    let formatted = '';
    let lines = xml.split('\n');
    let indent = 0;
    let lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    let transitions = {
        'single->single': 0,
        'single->closing': -1,
        'single->opening': 0,
        'single->other': 0,
        'closing->single': 0,
        'closing->closing': -1,
        'closing->opening': 0,
        'closing->other': 0,
        'opening->single': 1,
        'opening->closing': 0,
        'opening->opening': 1,
        'opening->other': 1,
        'other->single': 0,
        'other->closing': -1,
        'other->opening': 0,
        'other->other': 0
    };
    for (let i = 0; i < lines.length; i++) {
        let ln = lines[i];
        if (ln != '') {
            let single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
            let closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
            let opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
            let type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            let fromTo = lastType + '->' + type;
            lastType = type;
            let padding = '';
            indent += transitions[fromTo];
            for (let j = 0; j < indent; j++) {
                padding += '\t';
            }
            if (fromTo == 'opening->closing') {
                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
            } else {
                // if opening and closing tab not found then adds tab then charaters and line break character
                formatted += padding + ln + '\n';
            }
        }
    }
    // returns formatted xml
    return formatted;
};

/* clsSMGraph\lib\MathModal.svelte generated by Svelte v3.40.2 */

const file = "clsSMGraph\\lib\\MathModal.svelte";

// (50:40) {#if is_association}
function create_if_block(ctx) {
	let option;
	let t_value = /*l*/ ctx[0].association + "";
	let t;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.disabled = "disabled";
			option.__value = "association";
			option.value = option.__value;
			add_location(option, file, 50, 44, 3523);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*l*/ 1 && t_value !== (t_value = /*l*/ ctx[0].association + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(50:40) {#if is_association}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div69;
	let div68;
	let div67;
	let div66;
	let div0;
	let h4;
	let t0_value = /*l*/ ctx[0].plot_graph + "";
	let t0;
	let t1;
	let button0;
	let t3;
	let div64;
	let div44;
	let div43;
	let div4;
	let div3;
	let label0;
	let div1;
	let t4_value = /*l*/ ctx[0].width_label + "";
	let t4;
	let div2;
	let t5;
	let input0;
	let input0_placeholder_value;
	let t6;
	let div8;
	let div7;
	let label1;
	let div5;
	let t7_value = /*l*/ ctx[0].height_label + "";
	let t7;
	let div6;
	let t8;
	let input1;
	let input1_placeholder_value;
	let t9;
	let div12;
	let div11;
	let label2;
	let div9;
	let t10_value = /*l*/ ctx[0].type + "";
	let t10;
	let div10;
	let t11;
	let select0;
	let option0;
	let t12_value = /*l*/ ctx[0].point_graph + "";
	let t12;
	let option1;
	let t13_value = /*l*/ ctx[0].line_graph + "";
	let t13;
	let option2;
	let t14_value = /*l*/ ctx[0].circle_graph + "";
	let t14;
	let option3;
	let t15_value = /*l*/ ctx[0].ray_graph + "";
	let t15;
	let option4;
	let t16_value = /*l*/ ctx[0].segment_graph + "";
	let t16;
	let option5;
	let t17_value = /*l*/ ctx[0].vector_graph + "";
	let t17;
	let option6;
	let t18_value = /*l*/ ctx[0].parabola_graph + "";
	let t18;
	let option7;
	let t19_value = /*l*/ ctx[0].sine_graph + "";
	let t19;
	let option8;
	let t20_value = /*l*/ ctx[0].cos_graph + "";
	let t20;
	let option9;
	let t21_value = /*l*/ ctx[0].polygon_graph + "";
	let t21;
	let t22;
	let input2;
	let input2_placeholder_value;
	let t23;
	let div16;
	let div15;
	let label3;
	let div13;
	let t24_value = /*l*/ ctx[0].xaxis_label + "";
	let t24;
	let div14;
	let t25;
	let input3;
	let input3_placeholder_value;
	let t26;
	let div20;
	let div19;
	let label4;
	let div17;
	let t27_value = /*l*/ ctx[0].yaxis_label + "";
	let t27;
	let div18;
	let t28;
	let input4;
	let input4_placeholder_value;
	let t29;
	let input5;
	let input5_placeholder_value;
	let t30;
	let div24;
	let div23;
	let label5;
	let div21;
	let t31_value = /*l*/ ctx[0].xaxis_interval + "";
	let t31;
	let div22;
	let t32;
	let input6;
	let input6_placeholder_value;
	let t33;
	let div28;
	let div27;
	let label6;
	let div25;
	let t34_value = /*l*/ ctx[0].yaxis_interval + "";
	let t34;
	let div26;
	let t35;
	let input7;
	let input7_placeholder_value;
	let t36;
	let div32;
	let div31;
	let label7;
	let t37_value = /*l*/ ctx[0].inequality_num + "";
	let t37;
	let t38;
	let div30;
	let div29;
	let input8;
	let t39;
	let select1;
	let option10;
	let option11;
	let option12;
	let option13;
	let option14;
	let t45;
	let input9;
	let t46;
	let select2;
	let option15;
	let option16;
	let option17;
	let option18;
	let option19;
	let t52;
	let input10;
	let t53;
	let span;
	let t55;
	let label8;
	let i;
	let t56;
	let div33;
	let label9;
	let t57_value = /*l*/ ctx[0].equation_type + "";
	let t57;
	let t58;
	let select3;
	let option20;
	let t59_value = /*l*/ ctx[0].standard_form + "";
	let t59;
	let t60;
	let div34;
	let label10;
	let t61_value = /*l*/ ctx[0].equation_type + "";
	let t61;
	let t62;
	let select4;
	let option21;
	let t63_value = /*l*/ ctx[0].circle_form + "";
	let t63;
	let t64;
	let div35;
	let label11;
	let t65_value = /*l*/ ctx[0].equation_type + "";
	let t65;
	let t66;
	let select5;
	let option22;
	let t67_value = /*l*/ ctx[0].parabola_form + "";
	let t67;
	let t68;
	let div36;
	let label12;
	let t69_value = /*l*/ ctx[0].equation_type + "";
	let t69;
	let t70;
	let select6;
	let option23;
	let t71_value = /*l*/ ctx[0].sin_form + "";
	let t71;
	let t72;
	let div37;
	let label13;
	let t73_value = /*l*/ ctx[0].equation_type + "";
	let t73;
	let t74;
	let select7;
	let option24;
	let t75_value = /*l*/ ctx[0].cos_form + "";
	let t75;
	let t76;
	let div38;
	let label14;
	let t77_value = /*l*/ ctx[0].polygon_type + "";
	let t77;
	let t78;
	let select8;
	let option25;
	let t79_value = /*l*/ ctx[0].matchlist_normal + "";
	let t79;
	let option26;
	let t80_value = /*l*/ ctx[0].only_x + "";
	let t80;
	let option27;
	let t81_value = /*l*/ ctx[0].only_y + "";
	let t81;
	let option28;
	let t82_value = /*l*/ ctx[0].both_xy + "";
	let t82;
	let t83;
	let input11;
	let input11_placeholder_value;
	let t84;
	let div42;
	let label15;
	let div39;
	let t85_value = /*l*/ ctx[0].equation + "";
	let t85;
	let div40;
	let t86;
	let input12;
	let input12_placeholder_value;
	let t87;
	let div41;
	let t88_value = /*l*/ ctx[0].fill_warning + "";
	let t88;
	let t89;
	let div62;
	let div61;
	let div48;
	let div47;
	let label16;
	let div45;
	let t90_value = /*l*/ ctx[0].width_label1 + "";
	let t90;
	let div46;
	let t91;
	let input13;
	let input13_placeholder_value;
	let t92;
	let div52;
	let div51;
	let label17;
	let div49;
	let t93_value = /*l*/ ctx[0].height_label1 + "";
	let t93;
	let div50;
	let t94;
	let input14;
	let input14_placeholder_value;
	let t95;
	let div56;
	let div55;
	let label18;
	let div53;
	let t96_value = /*l*/ ctx[0].type + "";
	let t96;
	let div54;
	let t97;
	let select9;
	let option29;
	let t98_value = /*l*/ ctx[0].number_line_association + "";
	let t98;
	let option30;
	let t99_value = /*l*/ ctx[0].numberline_plot + "";
	let t99;
	let t100;
	let div60;
	let div59;
	let label19;
	let div57;
	let t101_value = /*l*/ ctx[0].axis_label + "";
	let t101;
	let div58;
	let t102;
	let input15;
	let input15_placeholder_value;
	let t103;
	let div63;
	let textarea;
	let t104;
	let div65;
	let button1;
	let t105_value = /*l*/ ctx[0].reset + "";
	let t105;
	let t106;
	let button2;
	let t107_value = /*l*/ ctx[0].ok_btn + "";
	let t107;
	let t108;
	let button3;
	let t109_value = /*l*/ ctx[0].cancel + "";
	let t109;
	let if_block = /*is_association*/ ctx[1] && create_if_block(ctx);

	const block = {
		c: function create() {
			div69 = element("div");
			div68 = element("div");
			div67 = element("div");
			div66 = element("div");
			div0 = element("div");
			h4 = element("h4");
			t0 = text(t0_value);
			t1 = space();
			button0 = element("button");
			button0.textContent = "×";
			t3 = space();
			div64 = element("div");
			div44 = element("div");
			div43 = element("div");
			div4 = element("div");
			div3 = element("div");
			label0 = element("label");
			div1 = element("div");
			t4 = text(t4_value);
			div2 = element("div");
			t5 = space();
			input0 = element("input");
			t6 = space();
			div8 = element("div");
			div7 = element("div");
			label1 = element("label");
			div5 = element("div");
			t7 = text(t7_value);
			div6 = element("div");
			t8 = space();
			input1 = element("input");
			t9 = space();
			div12 = element("div");
			div11 = element("div");
			label2 = element("label");
			div9 = element("div");
			t10 = text(t10_value);
			div10 = element("div");
			t11 = space();
			select0 = element("select");
			option0 = element("option");
			t12 = text(t12_value);
			option1 = element("option");
			t13 = text(t13_value);
			option2 = element("option");
			t14 = text(t14_value);
			option3 = element("option");
			t15 = text(t15_value);
			option4 = element("option");
			t16 = text(t16_value);
			option5 = element("option");
			t17 = text(t17_value);
			option6 = element("option");
			t18 = text(t18_value);
			option7 = element("option");
			t19 = text(t19_value);
			option8 = element("option");
			t20 = text(t20_value);
			option9 = element("option");
			t21 = text(t21_value);
			if (if_block) if_block.c();
			t22 = space();
			input2 = element("input");
			t23 = space();
			div16 = element("div");
			div15 = element("div");
			label3 = element("label");
			div13 = element("div");
			t24 = text(t24_value);
			div14 = element("div");
			t25 = space();
			input3 = element("input");
			t26 = space();
			div20 = element("div");
			div19 = element("div");
			label4 = element("label");
			div17 = element("div");
			t27 = text(t27_value);
			div18 = element("div");
			t28 = space();
			input4 = element("input");
			t29 = space();
			input5 = element("input");
			t30 = space();
			div24 = element("div");
			div23 = element("div");
			label5 = element("label");
			div21 = element("div");
			t31 = text(t31_value);
			div22 = element("div");
			t32 = space();
			input6 = element("input");
			t33 = space();
			div28 = element("div");
			div27 = element("div");
			label6 = element("label");
			div25 = element("div");
			t34 = text(t34_value);
			div26 = element("div");
			t35 = space();
			input7 = element("input");
			t36 = space();
			div32 = element("div");
			div31 = element("div");
			label7 = element("label");
			t37 = text(t37_value);
			t38 = space();
			div30 = element("div");
			div29 = element("div");
			input8 = element("input");
			t39 = space();
			select1 = element("select");
			option10 = element("option");
			option10.textContent = "=";
			option11 = element("option");
			option11.textContent = "<";
			option12 = element("option");
			option12.textContent = ">";
			option13 = element("option");
			option13.textContent = "≤";
			option14 = element("option");
			option14.textContent = "≥";
			t45 = space();
			input9 = element("input");
			t46 = space();
			select2 = element("select");
			option15 = element("option");
			option15.textContent = "=";
			option16 = element("option");
			option16.textContent = "<";
			option17 = element("option");
			option17.textContent = ">";
			option18 = element("option");
			option18.textContent = "≤";
			option19 = element("option");
			option19.textContent = "≥";
			t52 = space();
			input10 = element("input");
			t53 = space();
			span = element("span");
			span.textContent = "×";
			t55 = space();
			label8 = element("label");
			i = element("i");
			t56 = space();
			div33 = element("div");
			label9 = element("label");
			t57 = text(t57_value);
			t58 = space();
			select3 = element("select");
			option20 = element("option");
			t59 = text(t59_value);
			t60 = space();
			div34 = element("div");
			label10 = element("label");
			t61 = text(t61_value);
			t62 = space();
			select4 = element("select");
			option21 = element("option");
			t63 = text(t63_value);
			t64 = space();
			div35 = element("div");
			label11 = element("label");
			t65 = text(t65_value);
			t66 = space();
			select5 = element("select");
			option22 = element("option");
			t67 = text(t67_value);
			t68 = space();
			div36 = element("div");
			label12 = element("label");
			t69 = text(t69_value);
			t70 = space();
			select6 = element("select");
			option23 = element("option");
			t71 = text(t71_value);
			t72 = space();
			div37 = element("div");
			label13 = element("label");
			t73 = text(t73_value);
			t74 = space();
			select7 = element("select");
			option24 = element("option");
			t75 = text(t75_value);
			t76 = space();
			div38 = element("div");
			label14 = element("label");
			t77 = text(t77_value);
			t78 = space();
			select8 = element("select");
			option25 = element("option");
			t79 = text(t79_value);
			option26 = element("option");
			t80 = text(t80_value);
			option27 = element("option");
			t81 = text(t81_value);
			option28 = element("option");
			t82 = text(t82_value);
			t83 = space();
			input11 = element("input");
			t84 = space();
			div42 = element("div");
			label15 = element("label");
			div39 = element("div");
			t85 = text(t85_value);
			div40 = element("div");
			t86 = space();
			input12 = element("input");
			t87 = space();
			div41 = element("div");
			t88 = text(t88_value);
			t89 = space();
			div62 = element("div");
			div61 = element("div");
			div48 = element("div");
			div47 = element("div");
			label16 = element("label");
			div45 = element("div");
			t90 = text(t90_value);
			div46 = element("div");
			t91 = space();
			input13 = element("input");
			t92 = space();
			div52 = element("div");
			div51 = element("div");
			label17 = element("label");
			div49 = element("div");
			t93 = text(t93_value);
			div50 = element("div");
			t94 = space();
			input14 = element("input");
			t95 = space();
			div56 = element("div");
			div55 = element("div");
			label18 = element("label");
			div53 = element("div");
			t96 = text(t96_value);
			div54 = element("div");
			t97 = space();
			select9 = element("select");
			option29 = element("option");
			t98 = text(t98_value);
			option30 = element("option");
			t99 = text(t99_value);
			t100 = space();
			div60 = element("div");
			div59 = element("div");
			label19 = element("label");
			div57 = element("div");
			t101 = text(t101_value);
			div58 = element("div");
			t102 = space();
			input15 = element("input");
			t103 = space();
			div63 = element("div");
			textarea = element("textarea");
			t104 = space();
			div65 = element("div");
			button1 = element("button");
			t105 = text(t105_value);
			t106 = space();
			button2 = element("button");
			t107 = text(t107_value);
			t108 = space();
			button3 = element("button");
			t109 = text(t109_value);
			attr_dev(h4, "class", "modal-title");
			add_location(h4, file, 17, 20, 549);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "close");
			attr_dev(button0, "data-bs-dismiss", "modal");
			add_location(button0, file, 18, 20, 614);
			attr_dev(div0, "class", "modal-header");
			add_location(div0, file, 16, 16, 501);
			attr_dev(div1, "class", "mendatory_label float-left");
			add_location(div1, file, 25, 121, 1120);
			attr_dev(div2, "class", "mendatory_field");
			add_location(div2, file, 25, 182, 1181);
			attr_dev(label0, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label0, "for", "graph-width");
			add_location(label0, file, 25, 36, 1035);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "integer validate form-control");
			attr_dev(input0, "id", "graph-width");
			attr_dev(input0, "name", "width");
			attr_dev(input0, "placeholder", input0_placeholder_value = /*l*/ ctx[0].graph_width);
			attr_dev(input0, "defaultvalue", "500");
			add_location(input0, file, 26, 36, 1262);
			attr_dev(div3, "class", "form-group text-left");
			add_location(div3, file, 24, 32, 963);
			attr_dev(div4, "class", "col-sm-3 px-1");
			add_location(div4, file, 23, 28, 902);
			attr_dev(div5, "class", "mendatory_label float-left");
			add_location(div5, file, 31, 122, 1723);
			attr_dev(div6, "class", "mendatory_field");
			add_location(div6, file, 31, 184, 1785);
			attr_dev(label1, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label1, "for", "graph-height");
			add_location(label1, file, 31, 36, 1637);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "integer validate form-control");
			attr_dev(input1, "id", "graph-height");
			attr_dev(input1, "name", "height");
			attr_dev(input1, "placeholder", input1_placeholder_value = /*l*/ ctx[0].graph_height);
			attr_dev(input1, "defaultvalue", "500");
			add_location(input1, file, 32, 36, 1866);
			attr_dev(div7, "class", "form-group text-left");
			add_location(div7, file, 30, 32, 1565);
			attr_dev(div8, "class", "col-sm-3 px-1");
			add_location(div8, file, 29, 28, 1504);
			attr_dev(div9, "class", "mendatory_label float-left");
			add_location(div9, file, 37, 120, 2328);
			attr_dev(div10, "class", "mendatory_field");
			add_location(div10, file, 37, 174, 2382);
			attr_dev(label2, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label2, "for", "graph-type");
			add_location(label2, file, 37, 36, 2244);
			option0.__value = "point";
			option0.value = option0.__value;
			add_location(option0, file, 39, 40, 2568);
			option1.__value = "line";
			option1.value = option1.__value;
			add_location(option1, file, 40, 40, 2656);
			option2.__value = "circle";
			option2.value = option2.__value;
			add_location(option2, file, 41, 40, 2742);
			option3.__value = "ray";
			option3.value = option3.__value;
			add_location(option3, file, 42, 40, 2832);
			option4.__value = "segment";
			option4.value = option4.__value;
			add_location(option4, file, 43, 40, 2916);
			option5.__value = "vector";
			option5.value = option5.__value;
			add_location(option5, file, 44, 40, 3008);
			option6.__value = "parabola";
			option6.value = option6.__value;
			add_location(option6, file, 45, 40, 3098);
			option7.__value = "sine";
			option7.value = option7.__value;
			add_location(option7, file, 46, 40, 3192);
			option8.__value = "cosine";
			option8.value = option8.__value;
			add_location(option8, file, 47, 40, 3278);
			option9.__value = "polygon";
			option9.value = option9.__value;
			add_location(option9, file, 48, 40, 3365);
			attr_dev(select0, "class", "form-select select");
			attr_dev(select0, "id", "graph-type");
			attr_dev(select0, "name", "type");
			add_location(select0, file, 38, 36, 2463);
			attr_dev(div11, "class", "form-group text-left");
			add_location(div11, file, 36, 32, 2172);
			attr_dev(div12, "class", "col-sm-6 px-1");
			add_location(div12, file, 35, 28, 2111);
			attr_dev(input2, "type", "hidden");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "id", "graph-id");
			attr_dev(input2, "name", "id");
			attr_dev(input2, "placeholder", input2_placeholder_value = /*l*/ ctx[0].title);
			input2.value = "ID0";
			add_location(input2, file, 55, 28, 3795);
			attr_dev(div13, "class", "mendatory_label float-left");
			add_location(div13, file, 58, 115, 4138);
			attr_dev(div14, "class", "mendatory_field");
			add_location(div14, file, 58, 176, 4199);
			attr_dev(label3, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label3, "for", "xaxis");
			add_location(label3, file, 58, 36, 4059);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "class", "form-control validate integer");
			attr_dev(input3, "id", "xaxis");
			attr_dev(input3, "name", "xaxis");
			attr_dev(input3, "placeholder", input3_placeholder_value = /*l*/ ctx[0].xaxis_value);
			attr_dev(input3, "min", "2");
			attr_dev(input3, "defaultvalue", "10");
			add_location(input3, file, 59, 36, 4280);
			attr_dev(div15, "class", "form-group text-left");
			add_location(div15, file, 57, 32, 3987);
			attr_dev(div16, "class", "col-sm-3 px-1");
			add_location(div16, file, 56, 28, 3926);
			attr_dev(div17, "class", "mendatory_label float-left");
			add_location(div17, file, 64, 115, 4735);
			attr_dev(div18, "class", "mendatory_field");
			add_location(div18, file, 64, 176, 4796);
			attr_dev(label4, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label4, "for", "yaxis");
			add_location(label4, file, 64, 36, 4656);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control validate integer");
			attr_dev(input4, "id", "yaxis");
			attr_dev(input4, "name", "yaxis");
			attr_dev(input4, "placeholder", input4_placeholder_value = /*l*/ ctx[0].yaxis_value);
			attr_dev(input4, "min", "2");
			attr_dev(input4, "defaultvalue", "10");
			add_location(input4, file, 65, 36, 4877);
			attr_dev(div19, "class", "form-group text-left");
			add_location(div19, file, 63, 32, 4584);
			attr_dev(div20, "class", "col-sm-3 px-1");
			add_location(div20, file, 62, 28, 4523);
			attr_dev(input5, "type", "hidden");
			attr_dev(input5, "id", "graph-anskey");
			attr_dev(input5, "name", "anskey");
			attr_dev(input5, "placeholder", input5_placeholder_value = /*l*/ ctx[0].anskey);
			add_location(input5, file, 68, 28, 5120);
			attr_dev(div21, "class", "mendatory_label float-left");
			add_location(div21, file, 71, 123, 5448);
			attr_dev(div22, "class", "mendatory_field");
			add_location(div22, file, 71, 187, 5512);
			attr_dev(label5, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label5, "for", "xtickdistance");
			add_location(label5, file, 71, 36, 5361);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "class", "form-control validate integer");
			attr_dev(input6, "id", "xtickdistance");
			attr_dev(input6, "name", "xtickdistance");
			attr_dev(input6, "placeholder", input6_placeholder_value = /*l*/ ctx[0].xaxis_interval);
			attr_dev(input6, "min", "1");
			attr_dev(input6, "defaultvalue", "1");
			add_location(input6, file, 72, 36, 5593);
			attr_dev(div23, "class", "form-group text-left");
			add_location(div23, file, 70, 32, 5289);
			attr_dev(div24, "class", "col-sm-3 px-1");
			add_location(div24, file, 69, 28, 5228);
			attr_dev(div25, "class", "mendatory_label float-left");
			add_location(div25, file, 77, 123, 6074);
			attr_dev(div26, "class", "mendatory_field");
			add_location(div26, file, 77, 187, 6138);
			attr_dev(label6, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label6, "for", "ytickdistance");
			add_location(label6, file, 77, 36, 5987);
			attr_dev(input7, "type", "text");
			attr_dev(input7, "class", "form-control validate integer");
			attr_dev(input7, "id", "ytickdistance");
			attr_dev(input7, "name", "ytickdistance");
			attr_dev(input7, "placeholder", input7_placeholder_value = /*l*/ ctx[0].yaxis_interval);
			attr_dev(input7, "min", "1");
			attr_dev(input7, "defaultvalue", "1");
			add_location(input7, file, 78, 36, 6219);
			attr_dev(div27, "class", "form-group text-left");
			add_location(div27, file, 76, 32, 5915);
			attr_dev(div28, "class", "col-sm-3 px-1");
			add_location(div28, file, 75, 28, 5854);
			attr_dev(label7, "class", "control-label font-weight-normal mb-0");
			add_location(label7, file, 84, 36, 6776);
			attr_dev(input8, "type", "text");
			attr_dev(input8, "class", "text-center");
			attr_dev(input8, "defaultvalue", "");
			set_style(input8, "width", "40px");
			set_style(input8, "height", "25px");
			add_location(input8, file, 87, 44, 7036);
			option10.__value = "0";
			option10.value = option10.__value;
			add_location(option10, file, 89, 48, 7272);
			option11.__value = "1";
			option11.value = option11.__value;
			add_location(option11, file, 90, 48, 7357);
			option12.__value = "2";
			option12.value = option12.__value;
			add_location(option12, file, 91, 48, 7438);
			option13.__value = "3";
			option13.value = option13.__value;
			add_location(option13, file, 92, 48, 7519);
			option14.__value = "4";
			option14.value = option14.__value;
			add_location(option14, file, 93, 48, 7600);
			attr_dev(select1, "class", "form-select");
			set_style(select1, "height", "25px");
			add_location(select1, file, 88, 44, 7173);
			attr_dev(input9, "type", "text");
			attr_dev(input9, "defaultvalue", "x");
			attr_dev(input9, "class", "text-center");
			set_style(input9, "width", "40px");
			set_style(input9, "height", "25px");
			input9.readOnly = "readonly";
			add_location(input9, file, 95, 44, 7732);
			option15.__value = "0";
			option15.value = option15.__value;
			add_location(option15, file, 97, 48, 7990);
			option16.__value = "1";
			option16.value = option16.__value;
			add_location(option16, file, 98, 48, 8075);
			option17.__value = "2";
			option17.value = option17.__value;
			add_location(option17, file, 99, 48, 8156);
			option18.__value = "3";
			option18.value = option18.__value;
			add_location(option18, file, 100, 48, 8237);
			option19.__value = "4";
			option19.value = option19.__value;
			add_location(option19, file, 101, 48, 8318);
			attr_dev(select2, "class", "form-select");
			set_style(select2, "height", "25px");
			add_location(select2, file, 96, 44, 7891);
			attr_dev(input10, "type", "text");
			attr_dev(input10, "defaultvalue", "");
			attr_dev(input10, "class", "text-center");
			set_style(input10, "width", "40px");
			set_style(input10, "height", "25px");
			add_location(input10, file, 103, 44, 8450);
			attr_dev(span, "class", "remove-eq h position-absolute right5");
			add_location(span, file, 104, 44, 8588);
			attr_dev(div29, "class", "position-relative p-1");
			add_location(div29, file, 86, 40, 6955);
			attr_dev(div30, "class", "plotEq");
			add_location(div30, file, 85, 36, 6893);
			attr_dev(i, "class", "icomoon-plus");
			add_location(i, file, 108, 139, 8980);
			attr_dev(label8, "id", "add-equation");
			attr_dev(label8, "class", "add-equation btn btn-primary btn-xs pull-right mr-sm");
			attr_dev(label8, "title", "Add item");
			add_location(label8, file, 108, 36, 8877);
			attr_dev(div31, "class", "numberlinePlot form-group text-left h");
			attr_dev(div31, "id", "numberlinePlot");
			set_style(div31, "border", "1px solid #ccc");
			add_location(div31, file, 82, 32, 6542);
			attr_dev(div32, "class", "col-sm-12 px-1");
			add_location(div32, file, 81, 28, 6480);
			attr_dev(label9, "class", "control-label font-weight-normal mb-0");
			attr_dev(label9, "for", "line-eq");
			add_location(label9, file, 112, 32, 9232);
			option20.__value = "y=m*x+c";
			option20.value = option20.__value;
			add_location(option20, file, 114, 36, 9472);
			attr_dev(select3, "class", "form-select");
			attr_dev(select3, "id", "line-eq");
			attr_dev(select3, "name", "line-eq");
			select3.disabled = "disabled";
			add_location(select3, file, 113, 32, 9358);
			attr_dev(div33, "class", "form-group equation_select col-sm-6 px-1 text-left h");
			attr_dev(div33, "id", "line");
			add_location(div33, file, 111, 28, 9122);
			attr_dev(label10, "class", "control-label font-weight-normal mb-0");
			attr_dev(label10, "for", "circle-eq");
			add_location(label10, file, 118, 32, 9743);
			option21.__value = "(x-x1)^2 + (y-y1)^2 = r^2";
			option21.value = option21.__value;
			add_location(option21, file, 120, 36, 9989);
			attr_dev(select4, "class", "form-select");
			attr_dev(select4, "id", "circle-eq");
			attr_dev(select4, "name", "circle-eq");
			select4.disabled = "disabled";
			add_location(select4, file, 119, 32, 9871);
			attr_dev(div34, "class", "form-group equation_select col-sm-7 px-1 text-left h");
			attr_dev(div34, "id", "circle");
			add_location(div34, file, 117, 28, 9631);
			attr_dev(label11, "class", "control-label font-weight-normal mb-0");
			attr_dev(label11, "for", "parabola-eq");
			add_location(label11, file, 124, 32, 10278);
			option22.__value = "y=a*(x-h)^2+k";
			option22.value = option22.__value;
			add_location(option22, file, 126, 36, 10530);
			attr_dev(select5, "class", "form-select");
			attr_dev(select5, "id", "parabola-eq");
			attr_dev(select5, "name", "parabola-eq");
			select5.disabled = "disabled";
			add_location(select5, file, 125, 32, 10408);
			attr_dev(div35, "class", "form-group equation_select col-sm-6 px-1 text-left h");
			attr_dev(div35, "id", "parabola");
			add_location(div35, file, 123, 28, 10164);
			attr_dev(label12, "class", "control-label font-weight-normal mb-0");
			attr_dev(label12, "for", "sine-eq");
			add_location(label12, file, 130, 32, 10805);
			option23.__value = "y=A*sin(B*x+C)+D";
			option23.value = option23.__value;
			add_location(option23, file, 132, 36, 11045);
			attr_dev(select6, "class", "form-select");
			attr_dev(select6, "id", "sine-eq");
			attr_dev(select6, "name", "sine-eq");
			select6.disabled = "disabled";
			add_location(select6, file, 131, 32, 10931);
			attr_dev(div36, "class", "form-group equation_select col-sm-6 px-1 text-left h");
			attr_dev(div36, "id", "sine");
			add_location(div36, file, 129, 28, 10695);
			attr_dev(label13, "class", "control-label font-weight-normal mb-0");
			attr_dev(label13, "for", "cosine-eq");
			add_location(label13, file, 136, 32, 11320);
			option24.__value = "y=A*cos(B*x+C)+D";
			option24.value = option24.__value;
			add_location(option24, file, 138, 36, 11566);
			attr_dev(select7, "class", "form-select");
			attr_dev(select7, "id", "cosine-eq");
			attr_dev(select7, "name", "cosine-eq");
			select7.disabled = "disabled";
			add_location(select7, file, 137, 32, 11448);
			attr_dev(div37, "class", "form-group equation_select col-sm-6 px-1 text-left h");
			attr_dev(div37, "id", "cosine");
			add_location(div37, file, 135, 28, 11208);
			attr_dev(label14, "class", "control-label font-weight-normal mb-0");
			attr_dev(label14, "for", "polygon_type");
			add_location(label14, file, 142, 32, 11842);
			option25.__value = "0";
			option25.value = option25.__value;
			add_location(option25, file, 144, 36, 12076);
			option26.__value = "1";
			option26.value = option26.__value;
			add_location(option26, file, 145, 36, 12161);
			option27.__value = "2";
			option27.value = option27.__value;
			add_location(option27, file, 146, 36, 12236);
			option28.__value = "3";
			option28.value = option28.__value;
			add_location(option28, file, 147, 36, 12311);
			attr_dev(select8, "class", "form-select");
			attr_dev(select8, "id", "polygon_type");
			attr_dev(select8, "name", "polygon_type");
			add_location(select8, file, 143, 32, 11972);
			attr_dev(input11, "type", "hidden");
			attr_dev(input11, "id", "reflection");
			attr_dev(input11, "name", "reflection");
			attr_dev(input11, "placeholder", input11_placeholder_value = /*l*/ ctx[0].reflection);
			add_location(input11, file, 149, 32, 12426);
			attr_dev(div38, "class", "form-group equation_select col-sm-6 px-1 text-left h");
			attr_dev(div38, "id", "polygon");
			add_location(div38, file, 141, 28, 11729);
			attr_dev(div39, "class", "mendatory_label float-left");
			add_location(div39, file, 152, 120, 12758);
			attr_dev(div40, "class", "mendatory_field");
			add_location(div40, file, 152, 178, 12816);
			attr_dev(label15, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label15, "for", "graph-equation");
			add_location(label15, file, 152, 32, 12670);
			attr_dev(input12, "type", "text");
			attr_dev(input12, "class", "equation form-control");
			attr_dev(input12, "id", "graph-equation");
			attr_dev(input12, "name", "equation");
			attr_dev(input12, "placeholder", input12_placeholder_value = /*l*/ ctx[0].equation);
			add_location(input12, file, 153, 32, 12893);
			attr_dev(div41, "class", "text-danger err-msg d-none");
			add_location(div41, file, 154, 32, 13039);
			attr_dev(div42, "class", "form-group col-sm-6 px-1 text-left h eq d-none");
			add_location(div42, file, 151, 28, 12576);
			attr_dev(div43, "class", "row mx-0");
			add_location(div43, file, 22, 24, 850);
			attr_dev(div44, "class", "graphitem plotgraph h");
			add_location(div44, file, 21, 20, 789);
			attr_dev(div45, "class", "mendatory_label float-left");
			add_location(div45, file, 162, 126, 13546);
			attr_dev(div46, "class", "mendatory_field");
			add_location(div46, file, 162, 188, 13608);
			attr_dev(label16, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label16, "for", "numberline-width");
			add_location(label16, file, 162, 36, 13456);
			attr_dev(input13, "type", "text");
			attr_dev(input13, "class", "integer form-control");
			attr_dev(input13, "id", "numberline-width");
			attr_dev(input13, "name", "width");
			attr_dev(input13, "placeholder", input13_placeholder_value = /*l*/ ctx[0].graph_width);
			attr_dev(input13, "defaultvalue", "420");
			add_location(input13, file, 163, 36, 13689);
			attr_dev(div47, "class", "form-group text-left");
			add_location(div47, file, 161, 32, 13384);
			attr_dev(div48, "class", "col-sm-6 px-1");
			add_location(div48, file, 160, 28, 13323);
			attr_dev(div49, "class", "mendatory_label float-left");
			add_location(div49, file, 168, 127, 14151);
			attr_dev(div50, "class", "mendatory_field");
			add_location(div50, file, 168, 190, 14214);
			attr_dev(label17, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label17, "for", "numberline-height");
			add_location(label17, file, 168, 36, 14060);
			attr_dev(input14, "type", "text");
			attr_dev(input14, "class", "integer form-control");
			attr_dev(input14, "id", "numberline-height");
			attr_dev(input14, "name", "height");
			attr_dev(input14, "placeholder", input14_placeholder_value = /*l*/ ctx[0].graph_height);
			attr_dev(input14, "defaultvalue", "250");
			add_location(input14, file, 169, 36, 14295);
			attr_dev(div51, "class", "form-group text-left");
			add_location(div51, file, 167, 32, 13988);
			attr_dev(div52, "class", "col-sm-6 px-1");
			add_location(div52, file, 166, 28, 13927);
			attr_dev(div53, "class", "mendatory_label float-left");
			add_location(div53, file, 174, 125, 14758);
			attr_dev(div54, "class", "mendatory_field");
			add_location(div54, file, 174, 179, 14812);
			attr_dev(label18, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label18, "for", "numberline-type");
			add_location(label18, file, 174, 36, 14669);
			option29.__value = "numberline association";
			option29.value = option29.__value;
			add_location(option29, file, 176, 40, 15003);
			option30.__value = "numberline plot";
			option30.value = option30.__value;
			add_location(option30, file, 177, 40, 15120);
			attr_dev(select9, "class", "form-select select");
			attr_dev(select9, "id", "numberline-type");
			attr_dev(select9, "name", "type");
			add_location(select9, file, 175, 36, 14893);
			attr_dev(div55, "class", "form-group text-left");
			add_location(div55, file, 173, 32, 14597);
			attr_dev(div56, "class", "col-sm-6 px-1");
			add_location(div56, file, 172, 28, 14536);
			attr_dev(div57, "class", "mendatory_label float-left");
			add_location(div57, file, 183, 114, 15544);
			attr_dev(div58, "class", "mendatory_field");
			add_location(div58, file, 183, 174, 15604);
			attr_dev(label19, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label19, "for", "axis");
			add_location(label19, file, 183, 36, 15466);
			attr_dev(input15, "type", "text");
			attr_dev(input15, "class", "form-control");
			attr_dev(input15, "id", "axis");
			attr_dev(input15, "name", "axis");
			attr_dev(input15, "placeholder", input15_placeholder_value = /*l*/ ctx[0].axis_label);
			attr_dev(input15, "defaultvalue", "5");
			add_location(input15, file, 184, 36, 15685);
			attr_dev(div59, "class", "form-group text-left");
			add_location(div59, file, 182, 32, 15394);
			attr_dev(div60, "class", "col-sm-6 px-1");
			add_location(div60, file, 181, 28, 15333);
			attr_dev(div61, "class", "row mx-0");
			add_location(div61, file, 159, 24, 13271);
			attr_dev(div62, "class", "numberline h");
			add_location(div62, file, 158, 20, 13219);
			attr_dev(textarea, "id", "code");
			attr_dev(textarea, "class", "w-100");
			attr_dev(textarea, "name", "jscript");
			set_style(textarea, "height", "300px");
			add_location(textarea, file, 190, 24, 16006);
			attr_dev(div63, "class", "jscript h p-1");
			add_location(div63, file, 189, 20, 15953);
			attr_dev(div64, "class", "modal-body overflow-y");
			add_location(div64, file, 20, 16, 732);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-secondary resetElement");
			add_location(button1, file, 194, 20, 16206);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-secondary addElement");
			add_location(button2, file, 195, 20, 16307);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "btn btn-light");
			attr_dev(button3, "data-bs-dismiss", "modal");
			add_location(button3, file, 196, 20, 16407);
			attr_dev(div65, "class", "modal-footer");
			add_location(div65, file, 193, 16, 16158);
			attr_dev(div66, "class", "modal-content");
			add_location(div66, file, 15, 12, 456);
			attr_dev(div67, "class", "modal-dialog modal-dialog-centered");
			add_location(div67, file, 14, 8, 394);
			attr_dev(div68, "id", "authoring-modal");
			attr_dev(div68, "class", "modal fade");
			attr_dev(div68, "tabindex", "-1");
			add_location(div68, file, 13, 4, 325);
			add_location(div69, file, 12, 0, 314);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div69, anchor);
			append_dev(div69, div68);
			append_dev(div68, div67);
			append_dev(div67, div66);
			append_dev(div66, div0);
			append_dev(div0, h4);
			append_dev(h4, t0);
			append_dev(div0, t1);
			append_dev(div0, button0);
			append_dev(div66, t3);
			append_dev(div66, div64);
			append_dev(div64, div44);
			append_dev(div44, div43);
			append_dev(div43, div4);
			append_dev(div4, div3);
			append_dev(div3, label0);
			append_dev(label0, div1);
			append_dev(div1, t4);
			append_dev(label0, div2);
			append_dev(div3, t5);
			append_dev(div3, input0);
			append_dev(div43, t6);
			append_dev(div43, div8);
			append_dev(div8, div7);
			append_dev(div7, label1);
			append_dev(label1, div5);
			append_dev(div5, t7);
			append_dev(label1, div6);
			append_dev(div7, t8);
			append_dev(div7, input1);
			append_dev(div43, t9);
			append_dev(div43, div12);
			append_dev(div12, div11);
			append_dev(div11, label2);
			append_dev(label2, div9);
			append_dev(div9, t10);
			append_dev(label2, div10);
			append_dev(div11, t11);
			append_dev(div11, select0);
			append_dev(select0, option0);
			append_dev(option0, t12);
			append_dev(select0, option1);
			append_dev(option1, t13);
			append_dev(select0, option2);
			append_dev(option2, t14);
			append_dev(select0, option3);
			append_dev(option3, t15);
			append_dev(select0, option4);
			append_dev(option4, t16);
			append_dev(select0, option5);
			append_dev(option5, t17);
			append_dev(select0, option6);
			append_dev(option6, t18);
			append_dev(select0, option7);
			append_dev(option7, t19);
			append_dev(select0, option8);
			append_dev(option8, t20);
			append_dev(select0, option9);
			append_dev(option9, t21);
			if (if_block) if_block.m(select0, null);
			append_dev(div43, t22);
			append_dev(div43, input2);
			append_dev(div43, t23);
			append_dev(div43, div16);
			append_dev(div16, div15);
			append_dev(div15, label3);
			append_dev(label3, div13);
			append_dev(div13, t24);
			append_dev(label3, div14);
			append_dev(div15, t25);
			append_dev(div15, input3);
			append_dev(div43, t26);
			append_dev(div43, div20);
			append_dev(div20, div19);
			append_dev(div19, label4);
			append_dev(label4, div17);
			append_dev(div17, t27);
			append_dev(label4, div18);
			append_dev(div19, t28);
			append_dev(div19, input4);
			append_dev(div43, t29);
			append_dev(div43, input5);
			append_dev(div43, t30);
			append_dev(div43, div24);
			append_dev(div24, div23);
			append_dev(div23, label5);
			append_dev(label5, div21);
			append_dev(div21, t31);
			append_dev(label5, div22);
			append_dev(div23, t32);
			append_dev(div23, input6);
			append_dev(div43, t33);
			append_dev(div43, div28);
			append_dev(div28, div27);
			append_dev(div27, label6);
			append_dev(label6, div25);
			append_dev(div25, t34);
			append_dev(label6, div26);
			append_dev(div27, t35);
			append_dev(div27, input7);
			append_dev(div43, t36);
			append_dev(div43, div32);
			append_dev(div32, div31);
			append_dev(div31, label7);
			append_dev(label7, t37);
			append_dev(div31, t38);
			append_dev(div31, div30);
			append_dev(div30, div29);
			append_dev(div29, input8);
			append_dev(div29, t39);
			append_dev(div29, select1);
			append_dev(select1, option10);
			append_dev(select1, option11);
			append_dev(select1, option12);
			append_dev(select1, option13);
			append_dev(select1, option14);
			append_dev(div29, t45);
			append_dev(div29, input9);
			append_dev(div29, t46);
			append_dev(div29, select2);
			append_dev(select2, option15);
			append_dev(select2, option16);
			append_dev(select2, option17);
			append_dev(select2, option18);
			append_dev(select2, option19);
			append_dev(div29, t52);
			append_dev(div29, input10);
			append_dev(div29, t53);
			append_dev(div29, span);
			append_dev(div31, t55);
			append_dev(div31, label8);
			append_dev(label8, i);
			append_dev(div43, t56);
			append_dev(div43, div33);
			append_dev(div33, label9);
			append_dev(label9, t57);
			append_dev(div33, t58);
			append_dev(div33, select3);
			append_dev(select3, option20);
			append_dev(option20, t59);
			append_dev(div43, t60);
			append_dev(div43, div34);
			append_dev(div34, label10);
			append_dev(label10, t61);
			append_dev(div34, t62);
			append_dev(div34, select4);
			append_dev(select4, option21);
			append_dev(option21, t63);
			append_dev(div43, t64);
			append_dev(div43, div35);
			append_dev(div35, label11);
			append_dev(label11, t65);
			append_dev(div35, t66);
			append_dev(div35, select5);
			append_dev(select5, option22);
			append_dev(option22, t67);
			append_dev(div43, t68);
			append_dev(div43, div36);
			append_dev(div36, label12);
			append_dev(label12, t69);
			append_dev(div36, t70);
			append_dev(div36, select6);
			append_dev(select6, option23);
			append_dev(option23, t71);
			append_dev(div43, t72);
			append_dev(div43, div37);
			append_dev(div37, label13);
			append_dev(label13, t73);
			append_dev(div37, t74);
			append_dev(div37, select7);
			append_dev(select7, option24);
			append_dev(option24, t75);
			append_dev(div43, t76);
			append_dev(div43, div38);
			append_dev(div38, label14);
			append_dev(label14, t77);
			append_dev(div38, t78);
			append_dev(div38, select8);
			append_dev(select8, option25);
			append_dev(option25, t79);
			append_dev(select8, option26);
			append_dev(option26, t80);
			append_dev(select8, option27);
			append_dev(option27, t81);
			append_dev(select8, option28);
			append_dev(option28, t82);
			append_dev(div38, t83);
			append_dev(div38, input11);
			append_dev(div43, t84);
			append_dev(div43, div42);
			append_dev(div42, label15);
			append_dev(label15, div39);
			append_dev(div39, t85);
			append_dev(label15, div40);
			append_dev(div42, t86);
			append_dev(div42, input12);
			append_dev(div42, t87);
			append_dev(div42, div41);
			append_dev(div41, t88);
			append_dev(div64, t89);
			append_dev(div64, div62);
			append_dev(div62, div61);
			append_dev(div61, div48);
			append_dev(div48, div47);
			append_dev(div47, label16);
			append_dev(label16, div45);
			append_dev(div45, t90);
			append_dev(label16, div46);
			append_dev(div47, t91);
			append_dev(div47, input13);
			append_dev(div61, t92);
			append_dev(div61, div52);
			append_dev(div52, div51);
			append_dev(div51, label17);
			append_dev(label17, div49);
			append_dev(div49, t93);
			append_dev(label17, div50);
			append_dev(div51, t94);
			append_dev(div51, input14);
			append_dev(div61, t95);
			append_dev(div61, div56);
			append_dev(div56, div55);
			append_dev(div55, label18);
			append_dev(label18, div53);
			append_dev(div53, t96);
			append_dev(label18, div54);
			append_dev(div55, t97);
			append_dev(div55, select9);
			append_dev(select9, option29);
			append_dev(option29, t98);
			append_dev(select9, option30);
			append_dev(option30, t99);
			append_dev(div61, t100);
			append_dev(div61, div60);
			append_dev(div60, div59);
			append_dev(div59, label19);
			append_dev(label19, div57);
			append_dev(div57, t101);
			append_dev(label19, div58);
			append_dev(div59, t102);
			append_dev(div59, input15);
			append_dev(div64, t103);
			append_dev(div64, div63);
			append_dev(div63, textarea);
			append_dev(div66, t104);
			append_dev(div66, div65);
			append_dev(div65, button1);
			append_dev(button1, t105);
			append_dev(div65, t106);
			append_dev(div65, button2);
			append_dev(button2, t107);
			append_dev(div65, t108);
			append_dev(div65, button3);
			append_dev(button3, t109);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*l*/ 1 && t0_value !== (t0_value = /*l*/ ctx[0].plot_graph + "")) set_data_dev(t0, t0_value);
			if (dirty & /*l*/ 1 && t4_value !== (t4_value = /*l*/ ctx[0].width_label + "")) set_data_dev(t4, t4_value);

			if (dirty & /*l*/ 1 && input0_placeholder_value !== (input0_placeholder_value = /*l*/ ctx[0].graph_width)) {
				attr_dev(input0, "placeholder", input0_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t7_value !== (t7_value = /*l*/ ctx[0].height_label + "")) set_data_dev(t7, t7_value);

			if (dirty & /*l*/ 1 && input1_placeholder_value !== (input1_placeholder_value = /*l*/ ctx[0].graph_height)) {
				attr_dev(input1, "placeholder", input1_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t10_value !== (t10_value = /*l*/ ctx[0].type + "")) set_data_dev(t10, t10_value);
			if (dirty & /*l*/ 1 && t12_value !== (t12_value = /*l*/ ctx[0].point_graph + "")) set_data_dev(t12, t12_value);
			if (dirty & /*l*/ 1 && t13_value !== (t13_value = /*l*/ ctx[0].line_graph + "")) set_data_dev(t13, t13_value);
			if (dirty & /*l*/ 1 && t14_value !== (t14_value = /*l*/ ctx[0].circle_graph + "")) set_data_dev(t14, t14_value);
			if (dirty & /*l*/ 1 && t15_value !== (t15_value = /*l*/ ctx[0].ray_graph + "")) set_data_dev(t15, t15_value);
			if (dirty & /*l*/ 1 && t16_value !== (t16_value = /*l*/ ctx[0].segment_graph + "")) set_data_dev(t16, t16_value);
			if (dirty & /*l*/ 1 && t17_value !== (t17_value = /*l*/ ctx[0].vector_graph + "")) set_data_dev(t17, t17_value);
			if (dirty & /*l*/ 1 && t18_value !== (t18_value = /*l*/ ctx[0].parabola_graph + "")) set_data_dev(t18, t18_value);
			if (dirty & /*l*/ 1 && t19_value !== (t19_value = /*l*/ ctx[0].sine_graph + "")) set_data_dev(t19, t19_value);
			if (dirty & /*l*/ 1 && t20_value !== (t20_value = /*l*/ ctx[0].cos_graph + "")) set_data_dev(t20, t20_value);
			if (dirty & /*l*/ 1 && t21_value !== (t21_value = /*l*/ ctx[0].polygon_graph + "")) set_data_dev(t21, t21_value);

			if (/*is_association*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(select0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*l*/ 1 && input2_placeholder_value !== (input2_placeholder_value = /*l*/ ctx[0].title)) {
				attr_dev(input2, "placeholder", input2_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t24_value !== (t24_value = /*l*/ ctx[0].xaxis_label + "")) set_data_dev(t24, t24_value);

			if (dirty & /*l*/ 1 && input3_placeholder_value !== (input3_placeholder_value = /*l*/ ctx[0].xaxis_value)) {
				attr_dev(input3, "placeholder", input3_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t27_value !== (t27_value = /*l*/ ctx[0].yaxis_label + "")) set_data_dev(t27, t27_value);

			if (dirty & /*l*/ 1 && input4_placeholder_value !== (input4_placeholder_value = /*l*/ ctx[0].yaxis_value)) {
				attr_dev(input4, "placeholder", input4_placeholder_value);
			}

			if (dirty & /*l*/ 1 && input5_placeholder_value !== (input5_placeholder_value = /*l*/ ctx[0].anskey)) {
				attr_dev(input5, "placeholder", input5_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t31_value !== (t31_value = /*l*/ ctx[0].xaxis_interval + "")) set_data_dev(t31, t31_value);

			if (dirty & /*l*/ 1 && input6_placeholder_value !== (input6_placeholder_value = /*l*/ ctx[0].xaxis_interval)) {
				attr_dev(input6, "placeholder", input6_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t34_value !== (t34_value = /*l*/ ctx[0].yaxis_interval + "")) set_data_dev(t34, t34_value);

			if (dirty & /*l*/ 1 && input7_placeholder_value !== (input7_placeholder_value = /*l*/ ctx[0].yaxis_interval)) {
				attr_dev(input7, "placeholder", input7_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t37_value !== (t37_value = /*l*/ ctx[0].inequality_num + "")) set_data_dev(t37, t37_value);
			if (dirty & /*l*/ 1 && t57_value !== (t57_value = /*l*/ ctx[0].equation_type + "")) set_data_dev(t57, t57_value);
			if (dirty & /*l*/ 1 && t59_value !== (t59_value = /*l*/ ctx[0].standard_form + "")) set_data_dev(t59, t59_value);
			if (dirty & /*l*/ 1 && t61_value !== (t61_value = /*l*/ ctx[0].equation_type + "")) set_data_dev(t61, t61_value);
			if (dirty & /*l*/ 1 && t63_value !== (t63_value = /*l*/ ctx[0].circle_form + "")) set_data_dev(t63, t63_value);
			if (dirty & /*l*/ 1 && t65_value !== (t65_value = /*l*/ ctx[0].equation_type + "")) set_data_dev(t65, t65_value);
			if (dirty & /*l*/ 1 && t67_value !== (t67_value = /*l*/ ctx[0].parabola_form + "")) set_data_dev(t67, t67_value);
			if (dirty & /*l*/ 1 && t69_value !== (t69_value = /*l*/ ctx[0].equation_type + "")) set_data_dev(t69, t69_value);
			if (dirty & /*l*/ 1 && t71_value !== (t71_value = /*l*/ ctx[0].sin_form + "")) set_data_dev(t71, t71_value);
			if (dirty & /*l*/ 1 && t73_value !== (t73_value = /*l*/ ctx[0].equation_type + "")) set_data_dev(t73, t73_value);
			if (dirty & /*l*/ 1 && t75_value !== (t75_value = /*l*/ ctx[0].cos_form + "")) set_data_dev(t75, t75_value);
			if (dirty & /*l*/ 1 && t77_value !== (t77_value = /*l*/ ctx[0].polygon_type + "")) set_data_dev(t77, t77_value);
			if (dirty & /*l*/ 1 && t79_value !== (t79_value = /*l*/ ctx[0].matchlist_normal + "")) set_data_dev(t79, t79_value);
			if (dirty & /*l*/ 1 && t80_value !== (t80_value = /*l*/ ctx[0].only_x + "")) set_data_dev(t80, t80_value);
			if (dirty & /*l*/ 1 && t81_value !== (t81_value = /*l*/ ctx[0].only_y + "")) set_data_dev(t81, t81_value);
			if (dirty & /*l*/ 1 && t82_value !== (t82_value = /*l*/ ctx[0].both_xy + "")) set_data_dev(t82, t82_value);

			if (dirty & /*l*/ 1 && input11_placeholder_value !== (input11_placeholder_value = /*l*/ ctx[0].reflection)) {
				attr_dev(input11, "placeholder", input11_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t85_value !== (t85_value = /*l*/ ctx[0].equation + "")) set_data_dev(t85, t85_value);

			if (dirty & /*l*/ 1 && input12_placeholder_value !== (input12_placeholder_value = /*l*/ ctx[0].equation)) {
				attr_dev(input12, "placeholder", input12_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t88_value !== (t88_value = /*l*/ ctx[0].fill_warning + "")) set_data_dev(t88, t88_value);
			if (dirty & /*l*/ 1 && t90_value !== (t90_value = /*l*/ ctx[0].width_label1 + "")) set_data_dev(t90, t90_value);

			if (dirty & /*l*/ 1 && input13_placeholder_value !== (input13_placeholder_value = /*l*/ ctx[0].graph_width)) {
				attr_dev(input13, "placeholder", input13_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t93_value !== (t93_value = /*l*/ ctx[0].height_label1 + "")) set_data_dev(t93, t93_value);

			if (dirty & /*l*/ 1 && input14_placeholder_value !== (input14_placeholder_value = /*l*/ ctx[0].graph_height)) {
				attr_dev(input14, "placeholder", input14_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t96_value !== (t96_value = /*l*/ ctx[0].type + "")) set_data_dev(t96, t96_value);
			if (dirty & /*l*/ 1 && t98_value !== (t98_value = /*l*/ ctx[0].number_line_association + "")) set_data_dev(t98, t98_value);
			if (dirty & /*l*/ 1 && t99_value !== (t99_value = /*l*/ ctx[0].numberline_plot + "")) set_data_dev(t99, t99_value);
			if (dirty & /*l*/ 1 && t101_value !== (t101_value = /*l*/ ctx[0].axis_label + "")) set_data_dev(t101, t101_value);

			if (dirty & /*l*/ 1 && input15_placeholder_value !== (input15_placeholder_value = /*l*/ ctx[0].axis_label)) {
				attr_dev(input15, "placeholder", input15_placeholder_value);
			}

			if (dirty & /*l*/ 1 && t105_value !== (t105_value = /*l*/ ctx[0].reset + "")) set_data_dev(t105, t105_value);
			if (dirty & /*l*/ 1 && t107_value !== (t107_value = /*l*/ ctx[0].ok_btn + "")) set_data_dev(t107, t107_value);
			if (dirty & /*l*/ 1 && t109_value !== (t109_value = /*l*/ ctx[0].cancel + "")) set_data_dev(t109, t109_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div69);
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
	validate_slots('MathModal', slots, []);
	let { l } = $$props;
	let { is_association } = $$props;
	const writable_props = ['l', 'is_association'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MathModal> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('l' in $$props) $$invalidate(0, l = $$props.l);
		if ('is_association' in $$props) $$invalidate(1, is_association = $$props.is_association);
	};

	$$self.$capture_state = () => ({ l, is_association });

	$$self.$inject_state = $$props => {
		if ('l' in $$props) $$invalidate(0, l = $$props.l);
		if ('is_association' in $$props) $$invalidate(1, is_association = $$props.is_association);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [l, is_association];
}

class MathModal extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { l: 0, is_association: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MathModal",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*l*/ ctx[0] === undefined && !('l' in props)) {
			console.warn("<MathModal> was created without expected prop 'l'");
		}

		if (/*is_association*/ ctx[1] === undefined && !('is_association' in props)) {
			console.warn("<MathModal> was created without expected prop 'is_association'");
		}
	}

	get l() {
		throw new Error("<MathModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set l(value) {
		throw new Error("<MathModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get is_association() {
		throw new Error("<MathModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set is_association(value) {
		throw new Error("<MathModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMGraph\Graph.svelte generated by Svelte v3.40.2 */
const file$1 = "clsSMGraph\\Graph.svelte";

// (247:8) {#if (editorState.is_algo && editorState.variable_button)}
function create_if_block$1(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = `${l.solve}`;
			attr_dev(button, "class", "btn btn-light float-left m-sm");
			attr_dev(button, "type", "button");
			add_location(button, file$1, 247, 12, 10413);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*solveAuthoring*/ ctx[3], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(247:8) {#if (editorState.is_algo && editorState.variable_button)}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div7;
	let center;
	let t0;
	let div6;
	let div4;
	let ul0;
	let li0;
	let t1_value = /*QXML*/ ctx[2]._type + "";
	let t1;
	let t2;
	let div1;
	let div0;
	let i0;
	let i0_title_value;
	let t3;
	let div3;
	let div2;
	let i1;
	let i1_title_value;
	let t4;
	let div5;
	let div5_id_value;
	let div5_type_value;
	let div5_class_value;
	let div5_data_xtickdistance_value;
	let div5_data_ytickdistance_value;
	let div5_data_xaxis_value;
	let div5_data_yaxis_value;
	let div5_data_snapsize_value;
	let div5_data_equation_value;
	let t5;
	let ul1;
	let li1;
	let t6;
	let li2;
	let t7;
	let li3;
	let t8;
	let li4;
	let t9;
	let li5;
	let t10;
	let li6;
	let t11;
	let li7;
	let t12;
	let li8;
	let t13;
	let li9;
	let t14;
	let mathmodal;
	let t15;
	let input;
	let current;
	let mounted;
	let dispose;
	let if_block = /*editorState*/ ctx[0].is_algo && /*editorState*/ ctx[0].variable_button && create_if_block$1(ctx);

	mathmodal = new MathModal({
			props: {
				l,
				is_association: /*QXML*/ ctx[2]._type == 'association' ? 1 : 0
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div7 = element("div");
			center = element("center");
			if (if_block) if_block.c();
			t0 = space();
			div6 = element("div");
			div4 = element("div");
			ul0 = element("ul");
			li0 = element("li");
			t1 = text(t1_value);
			t2 = space();
			div1 = element("div");
			div0 = element("div");
			i0 = element("i");
			t3 = space();
			div3 = element("div");
			div2 = element("div");
			i1 = element("i");
			t4 = space();
			div5 = element("div");
			t5 = space();
			ul1 = element("ul");
			li1 = element("li");
			t6 = space();
			li2 = element("li");
			t7 = space();
			li3 = element("li");
			t8 = space();
			li4 = element("li");
			t9 = space();
			li5 = element("li");
			t10 = space();
			li6 = element("li");
			t11 = space();
			li7 = element("li");
			t12 = space();
			li8 = element("li");
			t13 = space();
			li9 = element("li");
			t14 = space();
			create_component(mathmodal.$$.fragment);
			t15 = space();
			input = element("input");
			li0.value = "plotgraph";
			attr_dev(li0, "class", "selected-option text-uppercase");
			add_location(li0, file$1, 260, 20, 10900);
			attr_dev(ul0, "class", "controls");
			add_location(ul0, file$1, 259, 16, 10857);
			attr_dev(i0, "data-bs-toggle", "tooltip");
			attr_dev(i0, "title", i0_title_value = l.delete);
			attr_dev(i0, "class", "icomoon-new-24px-delete-1");
			add_location(i0, file$1, 267, 24, 11250);
			attr_dev(div0, "class", "btn btn-light p-1");
			attr_dev(div0, "tabindex", "0");
			add_location(div0, file$1, 263, 20, 11108);
			attr_dev(div1, "class", "btn-group delete-tools zindex0 pe-0 h");
			attr_dev(div1, "id", "deleteElm");
			add_location(div1, file$1, 262, 16, 11019);
			attr_dev(i1, "title", i1_title_value = l.edit_graph);
			attr_dev(i1, "data-bs-toggle", "tooltip");
			attr_dev(i1, "class", "icomoon-24px-edit-1");
			add_location(i1, file$1, 276, 24, 11760);
			attr_dev(div2, "class", "btn btn-light p-1");
			attr_dev(div2, "tabindex", "0");
			add_location(div2, file$1, 271, 20, 11506);
			attr_dev(div3, "class", "btn-group edit-tools zindex0 ps-0");
			attr_dev(div3, "data-t", "plotgraph");
			attr_dev(div3, "id", "plotgraph");
			add_location(div3, file$1, 270, 16, 11403);
			attr_dev(div4, "id", "option-toolbar");
			attr_dev(div4, "class", "text-dark");
			add_location(div4, file$1, 258, 12, 10796);
			attr_dev(div5, "id", div5_id_value = /*QXML*/ ctx[2]._id);
			attr_dev(div5, "type", div5_type_value = /*QXML*/ ctx[2]._type);
			attr_dev(div5, "class", div5_class_value = "drag-resize dropable " + /*QXML*/ ctx[2]._type);
			attr_dev(div5, "data-xtickdistance", div5_data_xtickdistance_value = /*QXML*/ ctx[2]._xtickdistance);
			attr_dev(div5, "data-ytickdistance", div5_data_ytickdistance_value = /*QXML*/ ctx[2]._ytickdistance);
			attr_dev(div5, "data-xaxis", div5_data_xaxis_value = /*QXML*/ ctx[2]._xaxis);
			attr_dev(div5, "data-yaxis", div5_data_yaxis_value = /*QXML*/ ctx[2]._yaxis);
			attr_dev(div5, "data-snapsize", div5_data_snapsize_value = /*QXML*/ ctx[2]._snapsize);
			attr_dev(div5, "data-equation", div5_data_equation_value = /*QXML*/ ctx[2]._equation);
			set_style(div5, "height", /*QXML*/ ctx[2]._height - 40 + "px");
			set_style(div5, "width", /*QXML*/ ctx[2]._width + "px");
			set_style(div5, "border", "1px solid #ccc");
			add_location(div5, file$1, 280, 12, 11927);
			attr_dev(li1, "class", "btn_active btn-point");
			attr_dev(li1, "rel", "point");
			attr_dev(li1, "data-value", "P");
			add_location(li1, file$1, 297, 16, 12625);
			attr_dev(li2, "rel", "segment");
			attr_dev(li2, "class", "btn-segment");
			attr_dev(li2, "data-value", "S");
			add_location(li2, file$1, 298, 16, 12708);
			attr_dev(li3, "rel", "segment_left_point_hollow");
			attr_dev(li3, "class", "btn-SLH");
			attr_dev(li3, "data-value", "SLH");
			add_location(li3, file$1, 299, 16, 12784);
			attr_dev(li4, "rel", "segment_right_point_hollow");
			attr_dev(li4, "class", "btn-SRH");
			attr_dev(li4, "data-value", "SRH");
			add_location(li4, file$1, 300, 16, 12876);
			attr_dev(li5, "rel", "segment_both_point_hollow");
			attr_dev(li5, "class", "btn-SBH");
			attr_dev(li5, "data-value", "SBH");
			add_location(li5, file$1, 301, 16, 12969);
			attr_dev(li6, "rel", "ray_left_direction");
			attr_dev(li6, "class", "btn-RL");
			attr_dev(li6, "data-value", "RL");
			add_location(li6, file$1, 302, 16, 13061);
			attr_dev(li7, "rel", "ray_right_direction");
			attr_dev(li7, "class", "btn-RR");
			attr_dev(li7, "data-value", "RR");
			add_location(li7, file$1, 303, 16, 13144);
			attr_dev(li8, "rel", "ray_left_direction_right_hollow");
			attr_dev(li8, "class", "btn-RRH");
			attr_dev(li8, "data-value", "RRH");
			add_location(li8, file$1, 304, 16, 13228);
			attr_dev(li9, "rel", "ray_right_direction_left_hollow");
			attr_dev(li9, "class", "btn-RLH");
			attr_dev(li9, "data-value", "RLH");
			add_location(li9, file$1, 305, 16, 13326);
			attr_dev(ul1, "class", "footer_toolbox h");
			add_location(ul1, file$1, 296, 12, 12578);
			attr_dev(div6, "id", "mthmain");
			set_style(div6, "height", /*QXML*/ ctx[2]._height + "px");
			set_style(div6, "width", /*QXML*/ ctx[2]._width + "px");
			set_style(div6, "clear", "both");
			attr_dev(div6, "class", "position-relative bg-white");
			add_location(div6, file$1, 249, 8, 10543);
			add_location(center, file$1, 244, 4, 10321);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "special_module_xml");
			add_location(input, file$1, 310, 4, 13545);
			add_location(div7, file$1, 243, 0, 10310);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div7, anchor);
			append_dev(div7, center);
			if (if_block) if_block.m(center, null);
			append_dev(center, t0);
			append_dev(center, div6);
			append_dev(div6, div4);
			append_dev(div4, ul0);
			append_dev(ul0, li0);
			append_dev(li0, t1);
			append_dev(div4, t2);
			append_dev(div4, div1);
			append_dev(div1, div0);
			append_dev(div0, i0);
			append_dev(div4, t3);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, i1);
			append_dev(div6, t4);
			append_dev(div6, div5);
			append_dev(div6, t5);
			append_dev(div6, ul1);
			append_dev(ul1, li1);
			append_dev(ul1, t6);
			append_dev(ul1, li2);
			append_dev(ul1, t7);
			append_dev(ul1, li3);
			append_dev(ul1, t8);
			append_dev(ul1, li4);
			append_dev(ul1, t9);
			append_dev(ul1, li5);
			append_dev(ul1, t10);
			append_dev(ul1, li6);
			append_dev(ul1, t11);
			append_dev(ul1, li7);
			append_dev(ul1, t12);
			append_dev(ul1, li8);
			append_dev(ul1, t13);
			append_dev(ul1, li9);
			append_dev(center, t14);
			mount_component(mathmodal, center, null);
			append_dev(div7, t15);
			append_dev(div7, input);
			current = true;

			if (!mounted) {
				dispose = listen_dev(div2, "click", /*click_handler*/ ctx[7], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*editorState*/ ctx[0].is_algo && /*editorState*/ ctx[0].variable_button) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(center, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if ((!current || dirty & /*QXML*/ 4) && t1_value !== (t1_value = /*QXML*/ ctx[2]._type + "")) set_data_dev(t1, t1_value);

			if (!current || dirty & /*QXML*/ 4 && div5_id_value !== (div5_id_value = /*QXML*/ ctx[2]._id)) {
				attr_dev(div5, "id", div5_id_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_type_value !== (div5_type_value = /*QXML*/ ctx[2]._type)) {
				attr_dev(div5, "type", div5_type_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_class_value !== (div5_class_value = "drag-resize dropable " + /*QXML*/ ctx[2]._type)) {
				attr_dev(div5, "class", div5_class_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_data_xtickdistance_value !== (div5_data_xtickdistance_value = /*QXML*/ ctx[2]._xtickdistance)) {
				attr_dev(div5, "data-xtickdistance", div5_data_xtickdistance_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_data_ytickdistance_value !== (div5_data_ytickdistance_value = /*QXML*/ ctx[2]._ytickdistance)) {
				attr_dev(div5, "data-ytickdistance", div5_data_ytickdistance_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_data_xaxis_value !== (div5_data_xaxis_value = /*QXML*/ ctx[2]._xaxis)) {
				attr_dev(div5, "data-xaxis", div5_data_xaxis_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_data_yaxis_value !== (div5_data_yaxis_value = /*QXML*/ ctx[2]._yaxis)) {
				attr_dev(div5, "data-yaxis", div5_data_yaxis_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_data_snapsize_value !== (div5_data_snapsize_value = /*QXML*/ ctx[2]._snapsize)) {
				attr_dev(div5, "data-snapsize", div5_data_snapsize_value);
			}

			if (!current || dirty & /*QXML*/ 4 && div5_data_equation_value !== (div5_data_equation_value = /*QXML*/ ctx[2]._equation)) {
				attr_dev(div5, "data-equation", div5_data_equation_value);
			}

			if (!current || dirty & /*QXML*/ 4) {
				set_style(div5, "height", /*QXML*/ ctx[2]._height - 40 + "px");
			}

			if (!current || dirty & /*QXML*/ 4) {
				set_style(div5, "width", /*QXML*/ ctx[2]._width + "px");
			}

			if (!current || dirty & /*QXML*/ 4) {
				set_style(div6, "height", /*QXML*/ ctx[2]._height + "px");
			}

			if (!current || dirty & /*QXML*/ 4) {
				set_style(div6, "width", /*QXML*/ ctx[2]._width + "px");
			}

			const mathmodal_changes = {};
			if (dirty & /*QXML*/ 4) mathmodal_changes.is_association = /*QXML*/ ctx[2]._type == 'association' ? 1 : 0;
			mathmodal.$set(mathmodal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(mathmodal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(mathmodal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div7);
			if (if_block) if_block.d();
			destroy_component(mathmodal);
			mounted = false;
			dispose();
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

function isNumeric(num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
}

// call whenever there is change in the graph type select box
function changeValue(current) {
	let fixed = current.value.replace(/[^0-9]/g, "");

	if (current.value !== fixed) {
		current.value = fixed;
	}
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Graph', slots, []);
	let { xml } = $$props;
	let { editorState } = $$props;
	let { getChildXml } = $$props;
	let state = {};
	let QXML = '';
	let is_resource_added = false;
	let auth_store = writable({ xml: "" });

	const unsubscribe = auth_store.subscribe(value => {
		$$invalidate(6, state = value);
	});

	// functions responsible for loading the module on the basis of xml
	beforeUpdate(async () => {
		AH.selectAll('#mthmain [tabindex="0"].active', 'removeClass', 'active');

		if (state.xml != xml && !editorState.stopAuthoringUpdate) {
			AH.select('#special_module_xml').value = xml;
			loadModule(xml);
		}
	});

	// function responsible for binding the events
	onMount(async () => {
		AH.listen('body', 'keyup', '.equation', function () {
			if (AH.select('input[id$="equation"]').nodeName && AH.select('input[id$="equation"]').value == '') {
				AH.selectAll('.err-msg', 'removeClass', 'd-none');
				AH.selectAll('.equation', 'css', { border: '1px solid red' });
			} else {
				AH.selectAll('.err-msg', 'addClass', 'd-none');
				AH.selectAll('.equation', 'css', { border: '1px solid #CED4DA' });
			}
		});

		AH.listen('body', 'change', '#graph-type', function () {
			GRAPH_AUTH.resetModal();
		});

		AH.listen('body', 'mousemove', '#mthmain, .addElement, .resetElement', function () {
			updateXml();
		});

		AH.listen('body', 'mouseup', '#mthmain, .addElement, .resetElement', function () {
			updateXml();
		});

		AH.listen('body', 'click', '#mthmain, .addElement, .resetElement', function () {
			updateXml();
		});

		AH.listen('body', 'click', '#xmlDone', function () {
			$$invalidate(0, editorState.variable_button = false, editorState);

			if (!(!editorState.variable_button && editorState.stopAuthoringUpdate)) {
				GRAPH_AUTH.initGraph();
			}
		});

		AH.listen('body', 'keypress', '#mthmain [tabindex="0"]', function (current, event) {
			if ((event.keyCode == 13 || event.which == 13) && (event.target.id != 'delete_btn' && event.target.id != 'updateRow')) {
				current.click();
			}
		});

		AH.listen('body', 'hidden.bs.modal', '#authoring-modal', function () {
			$$invalidate(1, GRAPH_AUTH.visible_class = '', GRAPH_AUTH);
		});

		AH.listen('body', 'change', 'input.integer', function (current) {
			changeValue(current);
		});

		AH.listen('body', 'keyup', 'input.integer', function (current) {
			changeValue(current);
		});

		AH.listen('body', 'input', 'input.integer', function (current) {
			changeValue(current);
		});

		AH.listen('body', 'click', '#deleteElm', function (current) {
			let cur_elem = current.children[0];
			let attrs = GRAPH_AUTH.setInAssoc(GRAPH_AUTH.storage.store('#ID0', 'attributes'));
			cur_elem.classList.toggle('active');

			if (AH.select('#' + attrs.id).classList.contains('point') || AH.select('#' + attrs.id).classList.contains('circle') || AH.select('#' + attrs.id).classList.contains('association')) {
				if (cur_elem.classList.contains('active')) {
					AH.alert(l.delete_msg);
					cur_elem.style.color = 'black';
				}
			} else if (cur_elem.classList.contains('active')) {
				cur_elem.style.color = 'black';
				AH.alert(l.last_delete_msg);
			}
		});

		AH.listen('body', 'keypress', '#authoring-modal input', function (current, event) {
			if (event.which == 13) {
				return false;
			}
		});

		AH.listen('body', 'keyup', '#authoring-modal .validate', function (current, event) {
			event.preventDefault();
			event.stopPropagation();

			if (event.keyCode == 13) {
				AH.select('#authoring-modal .addElement').click();
			}

			$$invalidate(1, GRAPH_AUTH.isValid = false, GRAPH_AUTH);
			AH.selectAll('.error', 'remove');

			AH.setCss(current, {
				border: '1px solid red',
				background: "#FFCECE"
			});

			if (current.value == '') {
				AH.insert(current.parentElement, '<span class="error text-danger">' + l.fill_field + '</span>', 'beforeend');
			} else if (current.classList.contains('num') && current.value <= 0) {
				AH.insert(current.parentElement, '<span class="error text-danger">' + l.value_gt_zero + '</span>', 'beforeend');
			} else if (!isNumeric(current.value) && current.classList.contains('num')) {
				AH.insert(current.parentElement, '<span class="error text-danger">' + l.enter_number + '</span>', 'beforeend');
			} else {
				$$invalidate(1, GRAPH_AUTH.isValid = true, GRAPH_AUTH);

				AH.setCss(current, {
					border: '1px solid #ced4da',
					background: "none"
				});
			}
		});

		AH.listen('body', 'change', '#authoring-modal .select', function (current) {
			GRAPH_AUTH.resetData(current);
		});

		AH.listen('body', 'click', '.add-equation', function () {
			AH.insert('.numberlinePlot', AH.select('.plotEq').innerHTML, 'beforeend');

			AH.find('.numberlinePlot', '.remove-eq', {
				action: 'css',
				actionData: { display: 'block' }
			});
		});

		AH.listen('body', 'click', '.remove-eq', function (current) {
			current.parentElement.remove();
		});

		AH.listen('body', 'click', '.footer_toolbox li', function (current) {
			current.classList.add('btn_active');
			AH.selectAll(AH.siblings(current), 'removeClass', 'btn_active');
		});
	});

	// for updating the xml into the state
	afterUpdate(async () => {
		if (!is_resource_added) {
			if (typeof JXG != 'undefined') {
				GRAPH_AUTH.initGraph();
			} else {
				AH.addScript('', itemUrl + 'clsSMGraph/lib/jsxgraph.min.js', {
					callback() {
						GRAPH_AUTH.initGraph();
					}
				});
			}

			is_resource_added = true;
		}

		if (state.xml != xml && AH.select('#special_module_xml').value && typeof JXG != 'undefined' && !editorState.stopAuthoringUpdate) {
			auth_store.update(item => {
				item.xml = xml;
				return item;
			});
		}
	});

	// function responsible for updating the xml
	function updateXml() {
		if (editorState.stopAuthoringUpdate) {
			return false;
		}

		let xml = AH.select('#special_module_xml').value;

		if (state.xml != xml) {
			// updates the props of the component
			getChildXml(xml);
		}
	}

	// funcion responsible for loading the module
	function loadModule(loadXml) {
		// assign the json value to variable loadXml after converting xml into json
		loadXml = XMLToJSON(loadXml);

		// sets the value of variable QXML and re-render the component
		parseXMLAuthoring(loadXml);
	}

	// function responsible for parsing the xml
	function parseXMLAuthoring(MYXML) {
		$$invalidate(2, QXML = MYXML.smxml.plot);

		if (QXML._type == 'association') {
			AH.alert(l.deprecated);
		}
	}

	// function responsible for solving the algorithm and after that stops the update until algorithm is remove
	function solveAuthoring() {
		AH.activate(2);
		let tempXml = state.xml;
		let data = {};
		data['special_module_xml'] = tempXml;

		data['algo_qxml'] = AH.select("#algo_qxml").nodeName
		? AH.select("#algo_qxml").value
		: '';

		AH.ajax({
			url: baseUrl + 'editor/index.php',
			data: {
				ajax: "1",
				action: 'parse_algo',
				content_text: JSON.stringify(data)
			},
			type: 'POST',
			onEnd() {
				AH.activate(0);
			}
		}).then(function (response) {
			let res = JSON.parse(response);
			AH.select('#special_module_xml').value = res.special_module_xml;
			loadModule(res.special_module_xml);
			GRAPH_AUTH.initGraph();
			$$invalidate(0, editorState.stopPreviewUpdate = true, editorState);
			$$invalidate(0, editorState.stopAuthoringUpdate = true, editorState);
			$$invalidate(1, GRAPH_AUTH.stopUpdate = true, GRAPH_AUTH);
		});
	}

	const writable_props = ['xml', 'editorState', 'getChildXml'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Graph> was created with unknown prop '${key}'`);
	});

	const click_handler = event => GRAPH_AUTH.elemModal('plotgraph', event.currentTarget, QXML._id);

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(4, xml = $$props.xml);
		if ('editorState' in $$props) $$invalidate(0, editorState = $$props.editorState);
		if ('getChildXml' in $$props) $$invalidate(5, getChildXml = $$props.getChildXml);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		beforeUpdate,
		onMount,
		writable,
		XMLToJSON,
		AH,
		GRAPH_AUTH,
		l,
		MathModal,
		xml,
		editorState,
		getChildXml,
		state,
		QXML,
		is_resource_added,
		auth_store,
		unsubscribe,
		isNumeric,
		changeValue,
		updateXml,
		loadModule,
		parseXMLAuthoring,
		solveAuthoring
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(4, xml = $$props.xml);
		if ('editorState' in $$props) $$invalidate(0, editorState = $$props.editorState);
		if ('getChildXml' in $$props) $$invalidate(5, getChildXml = $$props.getChildXml);
		if ('state' in $$props) $$invalidate(6, state = $$props.state);
		if ('QXML' in $$props) $$invalidate(2, QXML = $$props.QXML);
		if ('is_resource_added' in $$props) is_resource_added = $$props.is_resource_added;
		if ('auth_store' in $$props) auth_store = $$props.auth_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*editorState, state, GRAPH_AUTH*/ 67) {
			// reset the lab after removing the algorithm
			 if (!editorState.variable_button && editorState.stopAuthoringUpdate) {
				$$invalidate(0, editorState.stopAuthoringUpdate = false, editorState);
				$$invalidate(0, editorState.stopPreviewUpdate = false, editorState);
				$$invalidate(1, GRAPH_AUTH.stopUpdate = false, GRAPH_AUTH);

				if (AH.select('#special_module_xml').nodeName) {
					AH.select('#special_module_xml').value = state.xml ? state.xml : '';
					GRAPH_AUTH.initGraph();
				}
			}
		}
	};

	return [
		editorState,
		GRAPH_AUTH,
		QXML,
		solveAuthoring,
		xml,
		getChildXml,
		state,
		click_handler
	];
}

class Graph extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { xml: 4, editorState: 0, getChildXml: 5 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Graph",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[4] === undefined && !('xml' in props)) {
			console.warn("<Graph> was created without expected prop 'xml'");
		}

		if (/*editorState*/ ctx[0] === undefined && !('editorState' in props)) {
			console.warn("<Graph> was created without expected prop 'editorState'");
		}

		if (/*getChildXml*/ ctx[5] === undefined && !('getChildXml' in props)) {
			console.warn("<Graph> was created without expected prop 'getChildXml'");
		}
	}

	get xml() {
		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Graph;
//# sourceMappingURL=Graph-575cd235.js.map
