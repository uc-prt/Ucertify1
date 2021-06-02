/**
 *  File Name   : mathAuthString.js
 *  Author      : Ayush Srivastava
 *  Function    : Graph
 *  Version     : 1.0
 *  Packege     : clsSMGRAPH (Authoring)
 *  Last update : 02 Mar 2021
 *  Dependency  : JUI
 */
// importing JUI
import JUI from 'javscript_helper';
import l from '../../../lib/Lang';
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
            delete this.state[obj]
        }
    },
    state: {}
}

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
}


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
        JS.select('#yaxis').readOnly = true
        JS.select('#xtickdistance').value = '1';
        JS.select('#ytickdistance').value = '1';
        JS.select('#ytickdistance').readOnly = true
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
            })
        }
    }
    JS.find('#authoring-modal', '[id = "' + element.value + '"]', {
        action: 'css',
        actionData: {
            display: 'block',
        }
    })

    JS.find('#authoring-modal', '#graph-equation', {
        action: 'value',
        actionData: ''
    });

    GRAPH_AUTH.resetModal();
}

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
        }
    }

    if (typeof elem != "undefined") {
        // assign the value of attrs array in the xml tag's attributes according to their type attribute
        GRAPH_AUTH.storage.store('#'+ JS.select(elem).id, "attributes", attrs)
    }

    // checks if perticular xml tag have any other tag then also assign it's attributes and values and so on
    if (xml.children.length > 0) {
        for (let index = 0; index < xml.children.length; index++) {
            GRAPH_AUTH.bind_data(xml.children[index]);
        }
    }
}


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
                })
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
    JS.select("#authoring-modal #graph-type").value = JS.select('[id="' + key + '"]').getAttribute('type')
    JS.selectAll('.equation_select', 'css', {
        display: 'none'
    })
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
}

// used for removing error messages
GRAPH_AUTH.resetModal = function () {
    JS.selectAll('.err-msg', 'addClass', 'd-none');
    JS.selectAll('input, .equation', 'removeAttr', 'style');
    JS.selectAll('.error', 'remove');
}

// sets the input elements value according to the value of plot tags attributes
GRAPH_AUTH.setData = function (attributes) {
    for (let index = 0; index < attributes.length; index += 1) {
        // select the input field according to attributes at perticular index
        let element = JS.select('#authoring-modal .' + GRAPH_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]')
        // sets the value of input fields 
        element.value = attributes[index]['value'];
    }
    // sets the value blank of element with id graph-anskey
    JS.select('#authoring-modal #graph-anskey').value = '';
    // sets the value blank of element with id reflection
    JS.select('#authoring-modal #reflection').value = '';
}

// used for getting the serialize data
GRAPH_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                }
            }
        } else if (element[index].name && !element[index].disabled) {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
}

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
        })
        // sets the attributes to authoring plot container and also select the element inside this container that id starts with keyword 'ID' and sets its width and height;
        GRAPH_AUTH.storage.store('#mthmain', 'attributes', attributes);

        JS.setCss('#mthmain', {
            width: wd + 'px',
            height: hd + 'px'
        })

        JS.selectAll('#mthmain [id^="ID"]', 'css', {
            width: wd + 'px',
            height: hgt + 'px'
        })
        // plot the graph
        GRAPH_AUTH.plotgraph(key, graphtype, xa, ya, xtk, ytk, defans);
    }
    // calls for update the xml
    GRAPH_AUTH.updateXML(where, attributes);
}

/*
 * used to change the value of xml which is responsible for changing the view of graph
 */
GRAPH_AUTH.updateXML = function(where, attributes) {
    if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '' && !GRAPH_AUTH.stopUpdate) {
        let xmlDom = JS.parseHtml(JS.select('#special_module_xml').value)
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
}

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
}

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
}


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
}

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
    GRAPH_AUTH.storage.store('#' + mid, 'attributes',  GRAPH_AUTH.setInIndex(attrs))
}

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
}


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
}

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
}

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
}

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
export default GRAPH_AUTH;