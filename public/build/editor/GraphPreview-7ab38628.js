
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, a5 as Lang, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, C as validate_each_argument, v as validate_slots, L as beforeUpdate, A as AH, a7 as afterUpdate, o as onMount, X as XMLToJSON, w as writable, z as empty, n as insert_dev, x as detach_dev, f as space, c as create_component, h as text, j as attr_dev, k as add_location, l as set_style, m as mount_component, q as listen_dev, F as set_data_dev, t as transition_in, a as transition_out, b as destroy_component, K as destroy_each, H as run_all } from './main-ad414885.js';
import { I as ItemHelper } from './ItemHelper-c5a04a61.js';

/**
 *  File Name   : mathString.js
 *  Author      : Ayush Srivastava
 *  Function    : Graph
 *  Version     : 1.0
 *  Packege     : clsSMGRAPH (Preview)
 *  Last update : 02 Mar 2021
 *  Dependency  : JUI
 */
const JS = new JUI();

let GRAPH = {};
GRAPH.userAnsXML = "";
GRAPH.ajax_eId = "#mathmain";
let board, point, prevPoint, is_correct;

// plot the graph on the graph board with some binded events
GRAPH.readyThis = function (mid) {
    // plot the graph on the graph board
    GRAPH.plotgraphPreview(mid);
};

// initialize the preview graph board
GRAPH.initBoardPreview = function (mid, pElem) {
    JXG.Options.point.snapToGrid = true; // point lie only on grid
    JXG.Options.point.snapSizeX = JS.select(pElem).getAttribute('data-xtickdistance'); // x-axis interval
    JXG.Options.point.snapSizeY = JS.select(pElem).getAttribute('data-ytickdistance'); // y-axis interval
    JXG.Options.point.showInfobox = false;
    /* 
        xright denotes number of grid will be draw on positive x-axis from center of the grid 
        xleft is same as xright only difference is of sign. Minus (-) denotes negative axis
        ytop denotes number of grid will be draw on positive y-axis from center of the grid
        ybottom is same as ytop only difference is of sign. Minus (-) denotes negative axis
    */
    let xright = JS.select(pElem).getAttribute('data-xaxis'), xleft = -xright, ytop = JS.select(pElem).getAttribute('data-yaxis'), ybottom = -ytop;

    for (let index in JXG.boards) {
        if ( JXG.boards[index].container.includes('Preview') ) {
            if (JS.select(pElem).getAttribute('id') == JXG.boards[index].container) {
                JXG.JSXGraph.freeBoard(JXG.boards[index]);
            }
        }
    }
    // hides the footer toolbox from the graph board	

    JS.find(mid, '.footer_toolbox').style.display = 'none';
    // shows the delete button after removing the h class from delete button's container
    JS.find(mid, '.delElem').classList.remove('h-imp');
    let board, axis, xaxis, yaxis, points, polygon;
    if (JS.select(pElem).classList.contains('association')) {
        /* discarded by Pete sir */
        board = JXG.JSXGraph.initBoard(JS.select(pElem).getAttribute('id'), {
            'boundingbox': [xleft, 3.4, xright, -5.4],//[-0.2, 3.4, 3.2, -5.4]
            'axis': false,
            'grid': false,
            'zoom': { 'factorX': 1.25, 'factorY': 1.25, 'wheel': true, 'needshift': true, 'eps': 0.1 },
            'showCopyright': false,
            'shownavigation': false
        });
        axis = board.create('line', [[0, 0], [1, 0]], { 'firstArrow': true, 'lastArrow': true, 'strokecolor': '#3E3E3E', 'fillcolor': '#3E3E3E', 'fixed': true });
        board.axis = axis;
        board.texts = [];
        board.create('ticks', [axis, JS.select(pElem).getAttribute('data-xtickdistance')], {
            'minorTicks': 9,
            'majorHeight': 15,
            'minorHeight': 5,
            'drawLabels': true,
            'label': { 'offset': [2, -10] },
            'drawZero': true
        });
        JS.find(mid, '.delElem').classList.add('h-imp');

        xaxis = Math.abs(JS.select(pElem).getAttribute('data-xaxis')) + Math.abs(JS.select(pElem).getAttribute('data-xtickdistance'));
        yaxis = JS.select(pElem).getAttribute('data-yaxis');
        polygon = board.create('polygon', [[-(xaxis), -2.4], [-(xaxis), -5.4], [(xaxis), -5.4], [(xaxis), -2.4]], { 'fillcolor': "#ccc", 'highlightfillcolor': "#ccc", 'withLines': false });
    } else if (JS.select(pElem).classList.contains('plot')) {
        // Initialise a new board	
        board = JXG.JSXGraph.initBoard(JS.select(pElem).getAttribute('id'), {
            'boundingbox': [xleft, ytop, xright, -1], /* An array containing four numbers describing the left, top, right and bottom boundary of the board in user coordinates */
            'axis': false, /* If set to true, show the axis. Can also be set to an object that is given to both axes as an attribute object. */
            'grid': false, /* If set to true, shows the grid. Can also be set to an object that is given to the grid as its attribute object. */
            'zoom': { 'factorX': 1.25, 'factorY': 1.25, 'wheel': true, 'needshift': true, 'eps': 0.1 }, /* Allow the user to zoom with the mouse wheel or the two-fingers-zoom gesture. */
            'showCopyright': false, /* If it is true shows the copyright string in the top left corner. */
            'shownavigation': false /* If it is true shows the navigation buttons in the bottom right corner. */
        });
        // Creates an instance of line
        axis = board.create('line', [[0, 0], [1, 0]], { 'firstArrow': true, 'lastArrow': true, 'strokecolor': '#3E3E3E', 'fillcolor': '#3E3E3E', 'fixed': true });
        // Creates an instance of ticks, ticks are used as distance markers on a line
        board.create('ticks', [axis, JS.select(pElem).getAttribute('data-xtickdistance')], {
            'minorTicks': 0, /* The number of minor ticks between two major ticks. */
            'majorHeight': 15, /* Total height of a major tick. */
            'minorHeight': 5, /* Total height of a minor tick. */
            'drawLabels': true, /* Draw labels yes/no */
            'label': { 'offset': [-6, -16] }, /* User defined labels for special ticks. */
            'drawZero': true /* Draw the zero tick, that lies at line.point1 */
        });
        // defines maximun x-axis value 
        board.xmax = xright;
        // hides the element have class 'delElem'
        JS.find(mid, '.delElem').classList.add('h-imp');

        // shows the element have class 'footer_toolbox'
        JS.find(mid, '.footer_toolbox').style.display = 'block';
    } else {
        // Initialise a new board
        board = JXG.JSXGraph.initBoard(JS.select(pElem).getAttribute('id'), {
            'boundingbox': [xleft, ytop, xright, ybottom], /* An array containing four numbers describing the left, top, right and bottom boundary of the board in user coordinates */
            'axis': false, /* If set to true, show the axis. Can also be set to an object that is given to both axes as an attribute object. */
            'grid': false, /* If set to true, shows the grid. Can also be set to an object that is given to the grid as its attribute object. */
            'zoom': { 'factorX': 1.25, 'factorY': 1.25, 'wheel': true, 'needshift': true, 'eps': 0.1 }, /* Allow the user to zoom with the mouse wheel or the two-fingers-zoom gesture. */
            'showCopyright': false, /* If it is true shows the copyright string in the top left corner. */
            'shownavigation': false /* If it is true shows the navigation buttons in the bottom right corner. */
        });
        // Creates an instance of x-axis
        xaxis = board.create('axis', [[-(Math.abs(JS.select(pElem).getAttribute('data-xtickdistance')) / 2), 0], [(Math.abs(JS.select(pElem).getAttribute('data-xtickdistance')) / 2), 0]]);
        // removes all ticks from x-axis 
        xaxis.removeAllTicks();
        // Creates an instance of ticks, ticks are used as distance markers on a line
        board.create('ticks', [xaxis, JS.select(pElem).getAttribute('data-xtickdistance')], {
            'strokeColor': '#ccc', // color of the stroke
            'majorHeight': -1, /* Total height of a major tick */
            'drawLabels': true, /* Draw labels */
            'label': { 'offset': [2, -10] }, /* Attributes for the axis label */
            'minorTicks': 3, /* The number of minor ticks between two major ticks. */
            'drawZero': true /* Draw the zero tick, that lies at line.point1 */
        });
        // Creates an instance of y-axis
        yaxis = board.create('axis', [[0, -(Math.abs(JS.select(pElem).getAttribute('data-ytickdistance')) / 2)], [0, (Math.abs(JS.select(pElem).getAttribute('data-ytickdistance')) / 2)]]);
        // removes all ticks from y-axis
        yaxis.removeAllTicks();
        // Creates an instance of ticks, ticks are used as distance markers on a line
        board.create('ticks', [yaxis, JS.select(pElem).getAttribute('data-ytickdistance')], {
            'strokeColor': '#ccc', // color of the stroke
            'majorHeight': -1, /* Total height of a major tick */
            'drawLabels': true, /* Draw labels */
            'label': { 'offset': [4, -6] }, /* Attributes for the axis label */
            'minorTicks': 3, /* The number of minor ticks between two major ticks. */
            'drawZero': false /* If it is true then draw the zero tick, that lies at line.point1 */
        });
    }
    board.points = [];
    board.xtick = JS.select(pElem).getAttribute('data-xtickdistance'); /* defines the x-axis interval of the graph board */
    board.ytick = JS.select(pElem).getAttribute('data-ytickdistance'); /* defines the y-axis interval of the graph board */
    board.xaxis = JS.select(pElem).getAttribute('data-xaxis'); /* defines no of grid will be draw on each (positive and negative) x-axis of the graph board */
    board.yaxis = JS.select(pElem).getAttribute('data-yaxis'); /* defines no of grid will be draw on each (positive and negative) y-axis of the graph board */
    // Shows the name of the graph selected in left side of toolbar in capitalize form
    let li = JS.find(mid, 'li.selected-option', 'all');
    if (li.length) {
        li.forEach((el) => {
            el.innerHTML = JS.select(pElem).getAttribute('type');
            el.style.textTransform = 'capitalize';
        });
    }

    if (JS.select(pElem).getAttribute('type') == "polygon" && JS.select(pElem).getAttribute('data-reflection') && JS.select(pElem).getAttribute('data-reflection')) {
        points = JS.select(pElem).getAttribute('data-reflection').split('|');
        polygon = [];

        for (let index = 0; index < points.length; index++) {
            let k = points[index].split(',');
            // Creates an instance of point
            let point = board.create("point", [k[0], k[1]], { 'name': "", 'strokecolor': "darkgray", 'strokewidth': 2, 'fillcolor': "darkgray" });
            // pushes the instance of deffent-2 point into polygon array
            polygon.push(point);
        }
        // Creates an instance of polygon
        board.create('polygon', polygon, { 'withline': true, 'fillcolor': "darkgray", 'borders': { 'strokecolor': "darkgray", 'strokewidth': 2 } });
    }
    // returns reference to the created board
    return board;
};

// plot the graph on the graph board
GRAPH.plotgraphPreview = function (mid) {
    let elements = JS.find(mid, '.drag-resize', 'all');
    for (let index = 0; index < elements.length; index++) {
        let elem = elements[index].getAttribute('id');
        // assign reference of the created board
        board = GRAPH.initBoardPreview(mid, elements[index]);
        board.prevPoint = null;
        let pointy = 1;
        /* The function getMouseCoords extracts the click coordinates from the event object and returns a JXG.Coords object with the point's coordinates on the board */
        let getMouseCoords = function (e) {
            /* Calculates mouse coordinates relative to the boards container. */
            let cPos = board.getCoordsTopLeftCorner(e),
                absPos = JXG.getPosition(e, 0), /* Get the position of the mouse in screen coordinates, relative to the upper left corner of the host tag */
                dx = absPos[0] - cPos[0],
                dy = absPos[1] - cPos[1];
            return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
        },
        down = function (e) {
            let canCreate = true, coords, el;
            // instance of mouse coordinate
            coords = getMouseCoords(e);
            for (el in board.objects) {
                if (JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                    // used for check if point will be draw or not
                    canCreate = false;
                    break;
                }
            }
            // allow to create the point if it is not exist on the board with same co-ordinate value
            if (canCreate) {
                let point, type;
                if (JS.select('#' + elem).classList.contains('plot')) {
                    // Creates an instance of point
                    point = board.create('point', [coords.usrCoords[1], pointy], { 'name': "", 'showInfobox': false });
                    point.Xjc = point.X() + Math.abs(point.board.xtick);
                    type = JS.select('.footer_toolbox li.btn_active').getAttribute('data-value'); 
                    pointy++;
                    if (pointy == point.board.yaxis) {
                        board.off('down');
                    }
                } else {
                    // Creates an instance of point
                    point = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]], { 'name': "" });
                }
                // Updates and draw the graph
                GRAPH.updateAndDrawPreview(mid, elem, point, type);
                // update the attributes of graph board container
                GRAPH.updateAttrsPreview(elem, point);
            }
            // check the answer
            GRAPH.checkAns(mid);
        };
        if (JS.select('#' + elem).classList.contains('association')) {
            // It is discarded by Pete sir
            if (JS.select('#' + elem).getAttribute('data-userans') == "") {
                let anskey = JS.select('#' + elem).getAttribute('data-anskey').split('|'), p1 = -(JS.select('#' + elem).getAttribute('data-xaxis') - JS.select('#' + elem).getAttribute('data-xtickdistance')), p2 = -4.4;
                for (let subindex = 0; subindex < anskey.length; subindex++) {
                    let k = anskey[subindex].split(',');
                    let txt = GRAPH.updateNumberline(mid, elem, p1, p2, k[0]);
                    GRAPH.updateNumbelineAttr(elem, txt);
                    p1 = p1 + 1 + (Math.abs(JS.select('#' + elem).getAttribute('data-xtickdistance')) / 10);
                    GRAPH.checkAns(mid);
                }
            }
        } else {
            // create the point according to the condition if point will be draw or not
            board.off('down').on('down', down);
        }
    }
};

// It is used with association that is discarded by  Pete sir
GRAPH.updateNumberline = function (mid, elem, p1, p2, k) {
    if (board.texts.length < JS.select('#' + elem).getAttribute('data-anskey').split('|').length) {
        let text = board.create('text', [p1, p2, k], { 'cssClass': "cursor-down", 'fontSize': '20px', 'highlightCssClass': "cursor-down", 'display': 'html', 'snapSizeX': (Math.abs(JS.select('#' + elem).getAttribute('data-xtickdistance')) / 10), 'snapSizeY': 0.4, 'snapToGrid': true, 'anchorX': 'middle', 'anchorY': 'bottom' });
        board.texts.push(text);
        text.on('down', function () {
            this.startPosition = this.X().toFixed(1) + ',' + this.Y() + ',' + this.htmlStr;
        });
        text.on('up', function () {
            if (this.Y().toFixed(1) > 0.4) {
                board.removeObject(this); board.texts.pop(this);
                GRAPH.updateNumberline(mid, elem, parseFloat(this.X().toFixed(1)), 0.4, this.htmlStr);
                this.upPosition = this.X().toFixed(1) + ',' + 0.4 + ',' + this.htmlStr;
            } else if (this.Y().toFixed(1) < 0.4) {
                board.removeObject(this); board.texts.pop(this);
                GRAPH.updateNumberline(mid, elem, parseFloat(this.X().toFixed(1)), -4.4, this.htmlStr);
                this.upPosition = this.X().toFixed(1) + ',' + -4.4 + ',' + this.htmlStr;
            } else {
                this.upPosition = this.X().toFixed(1) + ',' + this.Y().toFixed(1) + ',' + this.htmlStr;
            }
            GRAPH.updateNumbelineAttr(elem, this, true);
            GRAPH.checkAns(mid);
        });
        text.on('over', function () {
            if (!this.visProp.fixed) {
                board.containerObj.style.cursor = 'move';
                this.setAttribute({ 'cssClass': "cursor-down-hover", 'highlightCssClass': "cursor-down-hover" });
            }
        });
        text.on('out', function () {
            if (!this.visProp.fixed) {
                board.containerObj.style.cursor = 'default';
                this.setAttribute({ 'cssClass': "cursor-down", 'highlightCssClass': "cursor-down" });
            }
        });
        return text;
    }
};

// It is used with association that is discarded by  Pete sir
GRAPH.updateNumbelineAttr = function (elem, txt, isUpdate) {
    let userans = JS.select('#' + elem).getAttribute('data-userans');
    if (typeof isUpdate == "undefined") {
        userans = userans.split('|').filter(function (element) { return element != '' });
        userans.push(txt.X().toFixed(1) + ',' + txt.Y() + ',' + txt.htmlStr);
        JS.select('#' + elem).setAttribute('data-userans', userans.join('|'));
    } else {
        userans = JS.select('#' + elem).getAttribute('data-userans').replace(txt.startPosition, txt.upPosition);
        JS.select('#' + elem).setAttribute('data-userans', userans);
    }
};

// used to draw the graph on the board and according to defined events and also fill the point and sroke color of line or curve
GRAPH.updateAndDrawPreview = function (mid, elem, point, isUpdate) {
    if (JS.select('#' + elem).classList.contains('plot')) {
        point.setAttribute({ 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC' });
        if (JS.select('[data-value="' + isUpdate + '"]').nodeName && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel') && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel').indexOf('segment') == 0) {
            // creates the instance of point
            point.board.prevPoint = point.board.create('point', [point.Xjc, point.Y()], { 'name': "", 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC', 'fixed': true });
            // creates the instance of line
            point.for = point.board.create('line', [point.board.prevPoint, point], { 'straightFirst': false, 'straightLast': false, 'firstArrow': false, 'lastArrow': false, 'strokeWidth': "2", 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC' });
            // assign the value of 'isUpdate' in the name for point instance	
            point.for.name = isUpdate;
            switch (isUpdate) {
                // sets the stroke and fill color of the point
                case "SLH":
                    point.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                    break;
                case "SRH":
                    point.board.prevPoint.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                    break;
                case "SBH":
                    point.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                    point.board.prevPoint.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                    break;
            }
        } else if ( JS.select('[data-value="' + isUpdate + '"]').nodeName && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel') && JS.select('[data-value="' + isUpdate + '"]').getAttribute('rel').indexOf('ray') == 0 ) {
            // creates the instance of point
            switch (isUpdate) {
                case "RL":
                    point.board.prevPoint = point.board.create('point', [-Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                    break;
                case "RR":
                    point.board.prevPoint = point.board.create('point', [Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                    break;
                case "RRH":
                    point.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                    point.board.prevPoint = point.board.create('point', [-Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                    break;
                case "RLH":
                    point.setAttribute({ 'fillcolor': '#fff' });
                    point.board.prevPoint = point.board.create('point', [Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                    break;
            }
            // creates the instance of line
            point.for = point.board.create('line', [point.board.prevPoint, point], { 'straightFirst': true, 'straightLast': false, 'firstArrow': true, 'lastArrow': false, 'strokeWidth': "2", 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC' });
            // assign the name in point reference to value of variable 'isUpdate'
            point.for.name = isUpdate;
        }
        board.on('move', function () {
            if (point.Yjc != null) {
                // sets the initial point where mouse moved on the graph board
                point.moveTo([point.X(), point.Yjc]);
            }
        });
        point.on('over', function () {
            if (!this.visProp.fixed) {
                // change the style of the cursor to 'e-resize'
                board.containerObj.style.cursor = 'e-resize';
            }
        });
        point.on('out', function () {
            if (!this.visProp.fixed) {
                // change the style of the cursor to 'default'
                board.containerObj.style.cursor = 'default';
            }
        });
    } else {
        GRAPH.sinfo = false;
        point.board.points.push(point);
        if (point.board.prevPoint == null) {
            point.board.prevPoint = point;
        } else {
            let i, s;
            if (JS.select('#' + elem).classList.contains('line')) {
                // assign the value to is_correct variable returned by 'GRAPH.getEquationPreview' method
                is_correct = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                // creates the instance of line
                point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': true, 'straightLast': true, 'firstArrow': true, 'lastArrow': true, 'strokeWidth': "2" });
                GRAPH.sinfo = (is_correct) ? true : false;
            } else if (JS.select('#' + elem).classList.contains('circle')) {
                // creates the instance of circle
                point.for = point.board.create('circle', [point.board.prevPoint, point], { 'straightFirst': true, 'straightLast': true, 'firstArrow': true, 'lastArrow': true, 'strokeWidth': "2" });
                // instance of center points of the circle
                point.for.center.for = point.for;
            } else if (JS.select('#' + elem).classList.contains('segment')) {
                // creates the instance of line
                point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': false, 'straightLast': false, 'firstArrow': false, 'lastArrow': false, 'strokeWidth': "2" });
            } else if (JS.select('#' + elem).classList.contains('vector')) {
                /*
                    * creates instance of the line.
                    * straightFirst: If true, line stretches infinitely in direction of its first point.
                    * straightLast: If true, line stretches infinitely in direction of its last point.
                    * strokeWidth: Denotes width of the line.
                    * firstArrow: Line has an arrow head at the position of its first point or the corresponding intersection with the canvas border.
                    * lastArrow: Line has an arrow head at the position of its second point or the corresponding intersection with the canvas border.
                */
                point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': false, 'straightLast': false, 'firstArrow': true, 'lastArrow': false, 'strokeWidth': "2" });
            } else if (JS.select('#' + elem).classList.contains('ray')) {
                // same as defined in above for vector class condition
                point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': true, 'straightLast': false, 'firstArrow': true, 'lastArrow': false, 'strokeWidth': "2" });
            } else if (JS.select('#' + elem).classList.contains('parabola')) {
                point.setAttribute({ 'fixed': true }); point.board.prevPoint.setAttribute({ 'fixed': true });
                let eq = JS.select('#' + elem).getAttribute('data-equation').split('=');
                // assign the parabola equation to variable fx returned by 'GRAPH.getEquationPreview' method
                let fx = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                /* 
                    * Parses a JessieCode snippet, e.g. "3+4", and wraps it into a function, if desired. 
                    * First argument is a small snippet of JessieCode. Must not be an assignment.
                    * If second argument is true, the code is wrapped in a function.
                    * Third argument is the name of the parameter(s).
                    * Fourth variable is geonext compatibility mode. 
                */
                let f = board.jc.snippet(fx, true, 'x', true);
                // provides a constructor for functiongraph, which is just a wrapper for element Curve with JXG.Curve#X() set to x
                point.for = point.board.create('functiongraph', [f]);
                GRAPH.sinfo = (fx == eq[1]) ? true : false;
                // sets the initial and final points instance
                point.for.point1 = point.board.prevPoint; point.for.point2 = point;
                point.board.prevPoint = null;
            } else if (JS.select('#' + elem).classList.contains('polygon')) {
                if (typeof isUpdate == "undefined") {
                    // creates the instance of the polygon
                    point.for = point.board.create('polygon', [point.board.prevPoint, point]);
                    // defines the initial point instance
                    point.board.prevPoint = point;
                } else {
                    if (isUpdate.length == point.board.points.length) {
                        // creates the instance of the polygon
                        point.for = point.board.create('polygon', point.board.points, { 'boadres': { 'strokecolor': "darkgray", 'strokeWidth': 2 } });
                        point.for.parents.for = point.for; point.board.prevPoint = null; point.board.points = [];
                    }
                }
            } else if (JS.select('#' + elem).classList.contains('sine')) {
                // assign the value to is_correct variable returned by 'GRAPH.getEquationPreview' method
                is_correct = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                i = point.board.prevPoint;
                s = point;
                // creates the instance of the curve
                point.for = point.board.create('curve', [function (e) {
                    return e;
                }, function (e) {
                    let t = i.coords.usrCoords, n = s.coords.usrCoords,
                        r = t[1], o = t[2], u = n[1], a = n[2], f = a - o, l = 1 / (4 * (u - r));
                    return f * Math.sin(2 * Math.PI * l * (e - r)) + o;
                }]);
                // defines the instance of initial and last point 
                point.for.point1 = point.board.prevPoint; point.for.point2 = point;
                GRAPH.sinfo = (is_correct) ? true : false;
            } else if (JS.select('#' + elem).classList.contains('cosine')) {
                // assign the value to is_correct variable returned by 'GRAPH.getEquationPreview' method
                is_correct = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                i = point.board.prevPoint;
                s = point;
                // creates the instance of the curve
                point.for = point.board.create('curve', [function (e) {
                    return e;
                }, function (e) {
                    let t = i.coords.usrCoords, n = s.coords.usrCoords,
                        r = t[1], o = t[2], u = n[1], a = n[2], f = (a - o), l = 1 / (4 * (r - u));
                    return f * Math.cos(2 * Math.PI * l * (e - u)) + o;
                }]);
                point.for.point1 = point.board.prevPoint; point.for.point2 = point;
                GRAPH.sinfo = (is_correct) ? true : false;
            }
            if (!JS.select('#' + elem).classList.contains('polygon')) {
                // assign the initial point instance to null
                point.board.prevPoint = null;
            }
        }
    }
    point.on('down', function () {
        if (JS.select('#' + elem).classList.contains('plot')) {
            // assign the value of y co-ordinate
            this.Yjc = this.Y();
            if (typeof this.for == "undefined") {
                // contains the x-axis co-ordinate and name with ',' separated, not aware of 'this.name'
                this.startPosition = this.X() + ',' + this.name;
            } else {
                // contains the x-axis co-ordinates of the points and name with ',' separated, not aware of 'this.name'
                this.startPosition = this.for.point2.X() + ',' + this.for.point1.X() + ',' + this.for.name;
            }
        } else {
            this.startPosition = this.X() + "," + this.Y();
            if (JS.select('#' + elem).classList.contains('polygon') && point.board.points.length > 0) {
                if (this.X() + "," + this.Y() == point.board.points[0].X() + "," + point.board.points[0].Y()) {
                    // creates the instance of the polygon
                    point.for = point.board.create('polygon', point.board.points, { 'boadres': { 'strokecolor': "darkgray", 'strokeWidth': 2 } });
                    point.for.parents.for = point.for;
                    // sets the initial point instance of the graph to null
                    point.board.prevPoint = null;
                    point.board.points = [];
                }
            }
        }
        if (typeof this.for != "undefined" && this.for.elType == "circle") {
            // assign the value of radius to 'this.startPosition' after mousedown on the points of the circle
            this.startPosition = Math.round(this.for.Radius());
        }
    });
    point.on('up', function () {
        let remove_active = false;
        if (!JS.select('.delElem').children[0].classList.contains('active')) {
            // update the attributes of the graph board container and draw the graph accordingly
            GRAPH.updateAttrsPreview(elem, this, true);
            // returns Correct or Incorrect after matching the answer
            GRAPH.checkAns(mid);
        } else {
            /* removes the plotted point when mouse up on it and according to this also removes graph if the children of the element having id deleteElm has active */
            if (JS.select('#' + elem).classList.contains('point')) {
                //removes the point from board on which mouse up
                board.removeObject(this);
                // it is co-ordinate of the point on which mouse up
                this.position = this.startPosition;
                remove_active = true;
            } else if (JS.select('#' + elem).classList.contains('circle')) {
                //removes the reference of the circle
                board.removeObject(this);
                // removes the center of the circle
                board.removeObject(this.for.center);
                /* removes second point which lies on circumference of the circle for decide the radius of circle */
                board.removeObject(this.for.point2);
                GRAPH.modeOn();  // @pradeep : added for delete complete.
                /* contains center and radius of the circle which is deleted */
                this.position = this.for.center.X() + "," + this.for.center.Y() + "/" + Math.round(this.for.Radius());
                remove_active = true;
            } else if (JS.select('#' + elem).classList.contains('polygon') && typeof this.for != "undefined") {
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
                    remove_active = true;
                }
            } else {
                if (typeof this.for != "undefined") {
                    // removes the point reference from graph board
                    board.removeObject(this.for);
                    // removes the first point from graph board
                    board.removeObject(this.for.point1);
                    // removes the second point from graph board
                    board.removeObject(this.for.point2);
                    // sets the position key value for manage the anskey
                    this.position = this.for.point1.X() + ',' + this.for.point1.Y() + '|' + this.for.point2.X() + ',' + this.for.point2.Y();
                    remove_active = true;
                } else {
                    if (JS.select('#' + elem).classList.contains('parabola')) {
                        JS && JS.showmsg(Lang.curve_start_point, 3000);
                    }
                }
            }

            /* for warning in parabola when clicked other than last point of the curve to delete it */
            if (JS.select('#' + elem).classList.contains('parabola')) {
                if (typeof this.for != "undefined") {
                    /* removes the value from data-userans attribute of graph board container and also removes the graph according to remove this value */
                    GRAPH.updateDeleteAttrs(elem, this.position);
                    // returns Correct or Incorrect after matching the answer
                    GRAPH.checkAns(mid);
                    // removes the active class from delete button inside Preview container
                    JS.select('.delElem').children[0].classList.remove('active');
                } else {
                    console.warn({ msg: Lang.warning_this_for });
                }
            } else {
                /* removes the value from data-userans attribute of graph board container and also removes the graph according to remove this value */
                GRAPH.updateDeleteAttrs(elem, this.position);
                // returns Correct or Incorrect after matching the answer
                GRAPH.checkAns(mid);
            }

            if (remove_active) {
                let remove_focus = setTimeout(function (){
                    JS.selectAll('#mathmain #delButton.active', 'removeClass','active');
                    clearTimeout(remove_focus);
                }, 100);
            }
        }
    });
    point.on('over', function () {
        /* if delete button on preview container has active classs then on hover it, it shows the text 'Delete',hides the box which contains the co-ordinate of that point on which mouseover and sets its stroke and fill color to 'black' */
        if (!this.visProp.fixed && JS.select('.delElem').children[0].classList.contains('active')) {
            if (JS.select('#' + elem).classList.contains('point')) {
                this.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
            } else if (JS.select('#' + elem).classList.contains('circle') && typeof this.for != "undefined") {
                this.for.center.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                this.for.point2.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
            } else if (JS.select('#' + elem).classList.contains('polygon') && typeof this.for != "undefined") {
                if (typeof this.for.parents.for != "undefined") {
                    this.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                }
            } else if (JS.select('#' + elem).classList.contains('sine') || JS.select('#' + elem).classList.contains('cosine')) {
                if (typeof this.for != "undefined") {
                    this.for.point2.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                }
            } else {
                if (typeof this.for != "undefined") {
                    this.for.point1.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                }
            }
        }
    });
    point.on('out', function () {
        /* if delete button on preview container has active classs then mouseout on it, it sets the text blank, allow to show the box which contains the co-ordinate of that point on which mouseout and sets its stroke and fill color to 'red' */
        if (!this.visProp.fixed && JS.select('.delElem').children[0].classList.contains('active')) {
            if (JS.select('#' + elem).classList.contains('point')) {
                this.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
            } else if (JS.select('#' + elem).classList.contains('circle') && typeof this.for != "undefined") {
                this.for.center.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                this.for.point2.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
            } else if (JS.select('#' + elem).classList.contains('polygon') && typeof this.for != "undefined") {
                if (typeof this.for.parents.for != "undefined") {
                    this.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                }
            } else if (JS.select('#' + elem).classList.contains('sine') || JS.select('#' + elem).classList.contains('cosine')) {
                if (typeof this.for != "undefined") {
                    this.for.point2.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                }
            } else {
                if (typeof this.for != "undefined") {
                    this.for.point1.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                }
            }
        }
    });
};

// returns the equation of parabola if type is parabola otherwise returns true or false
GRAPH.getEquationPreview = function (elem, pointx, pointy, prevx, prevy) {
    // splite the value of data-equation attribute with '='
    let eq = JS.select('#' + elem).getAttribute('data-equation').split('='), a;
    let _this = JS.select('#' + elem).getAttribute('type'), str;
    let equation = '';
    let is_correct;
    switch (_this) {
        case "parabola":
            {

                if (!eq[0].includes('x')) {
                    // find the value of 'a' after calculation
                    a = Math.round(eval((pointy - prevy) / (Math.pow((pointx - prevx), 2))) * 10) / 10;
                    // equation of parabola if region covering the y-axis
                    equation = "a*(x-h)^2+k";
                } else {
                    // equation of parabola if region covering the x-axis
                    equation = "a*(y-h)^2+k";
                    // find the value of 'a' after calculation	
                    a = eval(pointx - prevy) / (Math.pow((pointy - prevx), 2));
                }
                // equation of parabola after substituting the value of 'a', 'h', 'k' in it's general equation
                let eqn = equation.replace('a', a).replace('h', prevx).replace('k', prevy);
                // changes the sign of operator according to math formula as (- * - = +), (+ * - = -)
                //returns the equation of parabola after substituting the value of 'a', 'h', 'k' in it's general equation
                eqn = eqn.replace(/\\-\\-/g, '+').replace(/\\+\\-/g, '-');
                return eqn;
            }
        case "sine":
        case "cosine":
            {
                if (JS.select('#' + elem).classList.contains('sine')) {
                    str = eq[1].replace('sin', 'Math.sin').replace('x', '(x/180)*Math.PI'); /* converts 'sin' into 'Math.sin' and 'x' which is in degree converts it into radian */
                } else if (JS.select('#' + elem).classList.contains('cosine')) {
                    str = eq[1].replace('cos', 'Math.cos').replace('x', '(x/180)*Math.PI'); /* converts 'cos' into 'Math.cos' and 'x' which is in degree converts it into radian */
                }
                // assign the value 1 to 'a' if the value of 'eq[1].charAt(0)' represents javascript number otherwise returns the value of 'eq[1].charAt(0)' 
                a = (!(!isNaN(parseFloat(eq[1].charAt(0))) && isFinite(eq[1].charAt(0)))) ? 1 : eq[1].charAt(0);
                // assign the value of is_correct variable to true or false after calculating the given condition
                is_correct = (Math.round(eval(str.replace('x', pointx)) * 100 / 100) == pointy &&
                    Math.round(eval(str.replace('x', prevx)) * 100 / 100) == prevy &&
                    a == Math.abs(prevy)) ? true : false;
                // returns the true of false value
                return is_correct;
            }
        case "line":
            {
                // assign the value of is_correct variable to true or false after calculating the given condition
                is_correct = (Math.round(eval(eq[1].replace('x', pointx))) == Math.round(eval(eq[0].replace('y', pointy))) && Math.round(eval(eq[1].replace('x', prevx))) == Math.round(eval(eq[0].replace('y', prevy)))) ? true : false;
                //returns the variable is_correct
                return is_correct;
            }
    }
};

// updates the data-userans attribute value of graph board container after removing the point on which clicked for delete
GRAPH.updateDeleteAttrs = function (elem, point) {
    let ans = JS.select('#' + elem).getAttribute('data-userans').split('|'), val = [];
    switch (JS.select('#' + elem).getAttribute('type')) {
        case "point":
        case "circle":
            for (let index = 0; index < ans.length; index++) {
                if (ans[index] != point) {
                    val.push(ans[index]);
                }
            }
            break;
        case "segment":
        case "ray":
        case "vector":
        case "sine":
        case "cosine":
        case "line":
        case "parabola":
            if (point != null) {
                let sub_point = point.split('|');
                val = ans.filter( function(element) { return !this.has(element) }, new Set(sub_point) );
            }
            break;
    }
    /* sets the value of val array to 'data-userans' attribute of graph board container after joining it into string with '|' separator */
    JS.select('#' + elem).setAttribute('data-userans', val.join('|'));
};

// updates the 'data-userans' atrribute of the graph board container
GRAPH.updateAttrsPreview = function (elem, point, isUpdate) {
    // contains the value of 'data-userans' attribute of graph board container
    let userans = JS.select('#' + elem).getAttribute('data-userans');
    // contains the value of 'type' attribute of graph board container
    let _this = JS.select('#' + elem).getAttribute('type');
    if (typeof point.for != "undefined" && point.for.elType == "circle") {
        let center = point.for.center, cp = center.X() + "," + center.Y();
        if (typeof point.startPosition != "undefined") {
            cp += '/' + point.startPosition;
        }
        // stores the value for set it to 'data-userans' attribute of graph board container
        userans = userans.replace(cp, center.X() + "," + center.Y() + "/" + Math.round(point.for.Radius()));
        // assign the value of variable 'userans' to 'data-userans' attribute of graph board container
        JS.select('#' + elem).setAttribute('data-userans', userans);
    } else if (isUpdate) {
        if (JS.select('#' + elem).classList.contains('plot')) {
            if (typeof point.for == "undefined") {
                userans = JS.select('#' + elem).getAttribute('data-userans').replace(point.startPosition, point.X() + ',' + point.name);
            } else {
                userans = JS.select('#' + elem).getAttribute('data-userans').replace(point.startPosition, point.for.point2.X() + ',' + point.for.point1.X() + ',' + point.for.name);
            }
        } else {
            // assign the value to variable 'userans' after replacing the value of 'point.startPosition' from 'data-userans' attribute of graph board container with the value of 'point.X()' and 'point.Y()' separated by comma
            userans = JS.select('#' + elem).getAttribute('data-userans').replace(point.startPosition, point.X() + ',' + point.Y());
        }
        // assign the value of variable 'userans' to 'data-userans' attribute of graph board container
        JS.select('#' + elem).setAttribute('data-userans', userans);
        switch (_this) {
            case "line":
            case "sine":
            case "cosine":
                {
                    let is_false = 0, prev = null;
                    let user_ans = userans.split('|');
                    for (let index = 0; index < user_ans.length; index++) {
                        let key = user_ans[index].split(',');
                        if (prev == null) {
                            prev = key;
                        } else {
                            let is_correct = GRAPH.getEquationPreview(elem, key[0], key[1], prev[0], prev[1]);
                            if (is_correct == false) {
                                is_false++;
                            }
                            prev = null;
                        }
                    }
                    GRAPH.sinfo = (is_false > 0) ? false : true;
                }

        }
    }
    if (typeof point.for == "undefined" || point.for.elType != "circle") {
        userans = userans.split('|').filter((el) => {return el});
        if (JS.select('#' + elem).classList.contains('plot')) {
            if (typeof point.for == "undefined") {
                userans.push(point.X() + ',' + point.name);
            } else {
                userans.push(point.for.point2.X() + ',' + point.for.point1.X() + ',' + point.for.name);
            }
        } else {
            // push the x and y co-ordinate value in userans array sepaated with comma
            userans.push(point.X() + ',' + point.Y());
        }
        if (typeof isUpdate == "undefined") {
            // assign the value of array 'userans' to 'data-userans' attribute of graph board container after joining it with '|'
            JS.select('#' + elem).setAttribute('data-userans', userans.join('|'));
            if (JS.select('#' + elem).classList.contains('polygon')) {
                if (point.board.points.length == 0) {
                    JS.select('#' + elem).setAttribute('data-userans', GRAPH.getUnique(JS.select('#' + elem).getAttribute('data-userans').split('|')).join('|'));
                }
            }
        }
    }
};

// for getting the unique data
GRAPH.getUnique = function(array) {
    let unique = array.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
    return unique;
};

// returns Correct or Incorrect after matching the answer 
GRAPH.checkAns = function (mid) {
    let userAnswers = "";
    let inNativeIsCorrect = false;
    // used to create user answer xml
    GRAPH.userAnsXML = "<smans type='20'>\n";
    GRAPH.result = true;	// There is pass False value by Abhishek Kumar 9th april 2019
    // finds the closest grap board container inside preview container

    let elements = JS.selectAll('#mathmain > .drag-resize');
    for (let index = 0; index < elements.length; index++) {
        GRAPH.userAnsXML = GRAPH.checkChildAnswer(mid, elements[index]);
    }
    GRAPH.userAnsXML += "</smans>";
    if (window.inNative) {
        // used for mobile team
        window.getHeight();
    }
    // asssign the data of userAnsXML to element have id special_module_user_xml
    JS.select("#special_module_user_xml").value = GRAPH.userAnsXML;
    // contains the data of userAnsXML from element have id special_module_user_xml
    userAnswers = JS.select("#special_module_user_xml").value;
    let sendDataToNative = {
        userAnswers,
        inNativeIsCorrect
    };
    if (GRAPH.result) {
        // assign the value to inNativeIsCorrect key of sendDataToNative object
        sendDataToNative.inNativeIsCorrect = true;
        // safely enables cross-origin communication between Window objects
        window.postMessage(JSON.stringify(sendDataToNative), '*');
        // check the element have id answer
        JS.select("#answer").checked = true;
        if (typeof (is_sm) != "undefined") {
            JS.showmsg(Lang.correct, 3000);
        }
        return Lang.correct;
    } else {
        // assign the value to inNativeIsCorrect key of sendDataToNative object
        sendDataToNative.inNativeIsCorrect = false;
        // safely enables cross-origin communication between Window objects
        window.postMessage(JSON.stringify(sendDataToNative), '*');
        // uncheck the element have id answer
        JS.select("#answer").checked = false;
        if (typeof (is_sm) != "undefined") {
            JS.showmsg(Lang.incorrect, 3000);
        }
        return Lang.incorrect;
    }
};

// returns the user answer xml and defines the GRAPH.result value according to matching the answer that helps chackAns method to show the Correct or Incorrect on the basis of variable GRAPH.result
GRAPH.checkChildAnswer = function (mid, pElem) {
    let _this = JS.select(pElem).getAttribute('type'), ansKey, userKey, index_no;
    switch (_this) {
        case "plot":
        case "association":
        case "point":
        case "segment":
            {
                // converts the value of data-anskey attribute of graph board container into array and sorts it then again converts it into string
                ansKey = JS.select(pElem).getAttribute('data-anskey').split('|').sort().join('|');
                // converts the value of data-userans attribute of graph board container into array and sorts it then again converts it into string
                userKey = JS.select(pElem).getAttribute('data-userans').split('|').sort().join('|');
                if (ansKey != userKey) {
                    // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                    GRAPH.result = false;
                }
                break;
            }
        case "circle":
        case "vector":
        case "ray": {
            if (JS.select(pElem).getAttribute("data-anskey") != JS.select(pElem).getAttribute("data-userans")) {
                /* assign the value false to variable GRAPH.result if value of attributes data-anskey and data-userans are not same */
                GRAPH.result = false;
            }
            break;
        }
        /* these all 2 values can be assign with fist case where the answer checking done for 'plot', point, segment and association */
        case "sine":
        case "cosine": {
            // converts the value of data-anskey attribute of graph board container into array and sorts it then again converts it into string
            ansKey = JS.select(pElem).getAttribute('data-anskey').split('|').sort().join('|');
            // converts the value of data-userans attribute of graph board container into array and sorts it then again converts it into string
            userKey = JS.select(pElem).getAttribute('data-userans').split('|').sort().join('|');
            if (ansKey != userKey) {
                // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                GRAPH.result = false;
            }
            break;
        }
        case "parabola": {
            // converts the value of data-anskey attribute of graph board container into array and sorts it then again converts it into string
            ansKey = JS.select(pElem).getAttribute('data-anskey').split('|').filter(function (element) { return element != '' });
            // converts the value of data-userans attribute of graph board container into array and sorts it then again converts it into string
            userKey = JS.select(pElem).getAttribute('data-userans').split('|').filter(function (element) { return element != '' });
            if (ansKey.length == userKey.length) {
                for (index_no = 0; index_no < userKey.length; index_no += 2) {
                    let question_index_no = ansKey.indexOf(userKey[index_no]);
                    if (question_index_no > -1) {
                        // finding value of a using equation 'f(x) = a(x-h)^2 + k' by substituting the value of 'f(x)', 'h', 'k' and 'x' where 'h' is the x-axis co-ordinate of vertix, 'k' is the y-axis co-ordinate of vertix, 'f(x)' is the y-axis co-ordinate which lies on the curve of parabola other than vertix, 'x' is the x-axis co-ordinate which lies on the curve of parabola other than vertix
                        let distancefromvertix_to_foci = (ansKey[question_index_no + 1].split(',')[1] - ansKey[question_index_no].split(',')[1]) / ((ansKey[question_index_no + 1].split(',')[0] - ansKey[question_index_no].split(',')[0]) * (ansKey[question_index_no + 1].split(',')[0] - ansKey[question_index_no].split(',')[0]));
                        let distancefromvertix_to_foci_ansKey = (userKey[index_no + 1].split(',')[1] - userKey[index_no].split(',')[1]) / ((userKey[index_no + 1].split(',')[0] - userKey[index_no].split(',')[0]) * (userKey[index_no + 1].split(',')[0] - userKey[index_no].split(',')[0]));
                        if (distancefromvertix_to_foci != distancefromvertix_to_foci_ansKey) {
                            // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                            GRAPH.result = false;
                        } else {
                            GRAPH.result = true;
                        }
                    } else {
                        // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                        GRAPH.result = false;
                    }
                }
            } else {
                // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                GRAPH.result = false;
            }
            break;
        }
        case "line": {
            try {
                // converts the value of data-anskey attribute of graph board container into array
                ansKey = JS.select(pElem).getAttribute('data-anskey').split('|');
                // converts the value of data-userans attribute of graph board container into array
                userKey = JS.select(pElem).getAttribute('data-userans').split('|');
                if (userKey.length == 0 || userKey.length == 1) {
                    // assign the value false to variable GRAPH.result if value of ansKey.length or userKey.length is equals to zero means line is not draw either during question creation or during provide the answer
                    GRAPH.result = false;
                    break;
                } else {
                    index_no = 0;
                    let index_no1 = 0;
                    let count_data = 0;
                    let not_match = 0;
                    while (index_no < ansKey.length) {
                        count_data = 0;
                        while (index_no1 < userKey.length) {
                            let left1, left2, right1, right2;
                            /* left1 is the left hand side value and right1 is the right hand side value after putting the values of user answer in standard line equation '(y-y1)(x2-x1) = (y2-y1)(x-x1)', where y and x are the values of first point's x and y value of line created at the time of question creation and x1, y1, x2, y2 are the points draw by user to create the line graph  */
                            left1 = (((userKey[index_no1].split(',')[1]) - (ansKey[index_no].split(',')[1])) * ((ansKey[index_no + 1].split(',')[0]) - (ansKey[index_no].split(',')[0])));
                            right1 = (((userKey[index_no1].split(',')[0]) - (ansKey[index_no].split(',')[0])) * ((ansKey[index_no + 1].split(',')[1]) - (ansKey[index_no].split(',')[1])));
                            /* left2 is the left hand side value and right2 is the right hand side value after putting the values of user answer in standard line equation '(y-y1)(x2-x1) = (y2-y1)(x-x1)', where y and x are the values of second point's x and y value of line created at the time of question creation and x1, y1, x2, y2 are the points draw by user to create the line graph  */
                            left2 = (((userKey[index_no1 + 1].split(',')[1]) - (ansKey[index_no].split(',')[1])) * ((ansKey[index_no + 1].split(',')[0]) - (ansKey[index_no].split(',')[0])));
                            right2 = (((userKey[index_no1 + 1].split(',')[0]) - (ansKey[index_no].split(',')[0])) * ((ansKey[index_no + 1].split(',')[1]) - (ansKey[index_no].split(',')[1])));
                            if ((parseFloat(left1) == parseFloat(right1)) && (parseFloat(left2) == parseFloat(right2))) {
                                // assign the value to this variable will help to return the value of variable GRAPH.result
                                count_data += 1;
                            } else {
                                GRAPH.result = false;
                                not_match = 1;
                                break;
                            }
                            // increase the value 2 more in there previous value
                            index_no1 += 2;
                        }
                        if (not_match == 1) {
                            break;
                        }
                        // increase the value 2 more in there previous value
                        index_no += 2;
                    }
                    if (count_data == 0) {
                        // assign the value false to variable GRAPH.result if value of count_data is equals to 0, means data not matched
                        GRAPH.result = false;
                    } else {
                        // assign the value true to variable GRAPH.result if value of count_data is not equals to 0, means data matched
                        GRAPH.result = true;
                    }
                }
            } catch (e) {
                console.warn(e);
            }
            break;
        }
        case "polygon":
            {
                /* converts the value of data-anskey attribute of graph board container into array and sorts it then removes the duplicate value then again converts it into string */
                ansKey = GRAPH.getUnique(JS.select(pElem).getAttribute('data-anskey').split('|').sort()).join('|');
                /* converts the value of data-userans attribute of graph board container into array and sorts it   then removes the duplicate value then again converts it into string */
                userKey = GRAPH.getUnique(JS.select(pElem).getAttribute('data-userans').split('|').sort()).join('|');
                if (ansKey != userKey) {
                    // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                    GRAPH.result = false;
                }
                break;
            }
    }
    // assign the value into GRAPH.userAnsXML with it's pre value and creates user answer xml
    GRAPH.userAnsXML += "<div id='" + JS.select(pElem).getAttribute('id') + "' userAns='" + JS.select(pElem).getAttribute('data-userans') + "'></div>\n";
    // returns the user answer xml
    return GRAPH.userAnsXML;
};

/* used to call the method 'showchildansdrag' for every graph and passed arguments are id of preview container, id of graph board container, andType have 2 values 'c' for correct answer and 'u' for user answer, review have 2 values '0' and '1' */
GRAPH.showansdrag = function (mid, ansType, review) {
    if (typeof review === "undefined") {
        review = 0;
    }
    let elements = JS.selectAll('#mathmain > .drag-resize');

    for (let index = 0; index < elements.length; index++) {
        GRAPH.showchildansdrag(mid, elements[index], ansType, review);
    }
};

/* used for show the stroke and fill color of point and graph according to the value of 'data-userans'  attribute of graph board container and argument 'review', Also update the graph board and draw the graph */
GRAPH.showchildansdrag = function (mid, pElem, ansType, review) {
    if (review == 1) {
        // assign reference of the created board
        board = GRAPH.initBoardPreview(mid, pElem);
        // disabled the 'li' element and removes the class 'btn_active' and add the class 'btn_active_disabled' to it that exist inside the element have class 'footer_toolbox' in preview container
        let footer_li = JS.find(mid, '.footer_toolbox li', 'all');
        if (footer_li.length > 0) {
            footer_li.forEach(function(element) {
                element.disabled = true;
                element.classList.add('btn_active_disabled');
                element.classList.remove('btn_active');
            });
        }
    }
    // defines the name of graph
    let _this = JS.select(pElem).getAttribute('type');
    // defines the id of the graph board container
    let elem = JS.select(pElem).getAttribute('id'), cans;
    if (JS.select(pElem).getAttribute("data-anskey") != '') {
        // defines the array of correct answer points
        cans = JS.select(pElem).getAttribute("data-anskey").split('|');
    }
    // defines the array of user answer points
    let uans = JS.select(pElem).getAttribute("data-userans").split('|');
    let is_point, k;
    if (ansType == "c") {
        if (JS.select('#' + elem).classList.contains('association')) {
            /* it is discarded by Pete sir */
            for (let index = 0; index < cans.length; index++) {
                k = cans[index].split(',');
                let text = GRAPH.updateNumberline(mid, elem, k[0], k[1], k[2]);
                text.setAttribute({ 'cssClass': "cursor-down-active", 'highlightCssClass': "cursor-down-active", 'fixed': true });
            }
        } else if (JS.select('#' + elem).classList.contains('plot')) {
            is_point = 1;
            for (let index = 0; index < cans.length; index++) {
                let point;
                if (cans[index].indexOf(',') == -1) {
                    // creates the instance of point
                    point = board.create('point', [parseInt(cans[index]), is_point], { 'name': "", 'fixed': true });
                    // update and draw the point on the graph board and according to point also draw the graph
                    GRAPH.updateAndDrawPreview(mid, elem, point);
                } else {
                    k = cans[index].split(',');
                    // creates the instance of point
                    point = board.create('point', [parseInt(k[0]), is_point], { 'name': "", 'fixed': true });
                    point.Xjc = parseInt(k[1]);
                    // update and draw the point on the graph board and according to point also draw the graph
                    GRAPH.updateAndDrawPreview(mid, elem, point, k[2]);
                }
                is_point++;
            }
        } else {
            for (let index = 0; index < cans.length; index++) {
                // creates the array of x and y coordinates of the point
                k = cans[index].split(',');
                // creates the instance of the point
                let point = board.create('point', [parseInt(k[0]), parseInt(k[1])], { 'name': "", 'fixed': true, 'strokeColor': "#0000FF", 'fillColor': "#0000FF" });
                if (! JS.select(pElem).classList.contains('circle')) {
                    // update and draw the graph on graph board according to their type
                    GRAPH.updateAndDrawPreview(mid, elem, point, cans);
                } else {
                    // draw the circle on preview graph board
                    GRAPH.drawCirclePreview(mid, elem, cans[index]);
                }
            }
        }
        // sets the border color of preview container to #0000ff
        JS.setCss(mid, {
            border: "1px solid #0000ff"
        });
    } else if (ansType == "u") {
        let is_false = 0, is_correctln = null, is_flag = false;
        is_point = 1;
        if (!JS.select('#' + elem).classList.contains('association')) {
            for (let index = 0; index < uans.length; index++) {
                let val = uans[index];
                if (JS.select('#' + elem).classList.contains('plot')) {
                    if (JS.select(pElem).getAttribute("data-userans") != '') {
                        if (val.indexOf(',') == -1) {
                            // creates the instance of point
                            point = board.create('point', [parseInt(val), is_point], { 'name': "" });
                            // update and draw the point on the board
                            GRAPH.updateAndDrawPreview(mid, elem, point);
                        } else {
                            // array of x and y coordinates
                            k = val.split(',');
                            // creates the instance of point
                            point = board.create('point', [parseInt(k[0]), is_point], { 'name': "" });
                            // not clear what is this
                            point.Xjc = parseInt(k[1]);
                            // update and draw the point on the board
                            GRAPH.updateAndDrawPreview(mid, elem, point, k[2]);
                        }
                        is_point++;
                    }
                } else {
                    // array of x and y coordinates
                    k = val.split(',');
                    // creates the instance of point
                    point = board.create('point', [parseInt(k[0]), parseInt(k[1])], { 'name': "" });
                    if (JS.select(pElem).getAttribute("data-userans") != '') {
                        if (! JS.select(pElem).classList.contains('circle')) {
                            // update and draw the point on the board
                            GRAPH.updateAndDrawPreview(mid, elem, point, uans);
                        } else {
                            // draw the circle on the board
                            GRAPH.drawCirclePreview(mid, elem, val);
                        }
                    }
                }
                if (typeof review != "undefined" && review == 1 && JS.select(pElem).getAttribute("data-userans") != '') {
                    point.setAttribute({ 'fixed': true });
                    switch (_this) {
                        case "point":
                            {
                                if ( cans.includes(val) ) {
                                    /* if any value of uans array exist in cans array then sets the fill and stroke color of that point to #00FF00 */
                                    point.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                                } else {
                                    /* if any value of uans array does not exist in cans array then sets the fill and stroke color of that point to #FF0000 */
                                    point.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                                    // iincrease the value of is_false variable
                                    is_false++;
                                }
                                break;
                            }
                        case "circle":
                            {
                                if (typeof point.for != "undefined") {
                                    /* assign the value of is_flag variable to 'true' if the value of uans at perticular index exist in cans array otherwise false */
                                    is_flag = (cans.includes(val)) ? true : false;
                                    /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                    is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                }
                                break;
                            }
                        case "plot":
                            {
                                /* assign the value of is_flag variable to 'true' if the value of uans at perticular index exist in cans array otherwise false */
                                is_flag = (cans.includes(val)) ? true : false;
                                /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                break;
                            }
                        case "line":
                        case "parabola":
                        case "sine":
                        case "cosine":
                            {
                                if (typeof point.for == "undefined") {
                                    // defines the initial point of the graph
                                    prevPoint = point.board.prevPoint;
                                } else {
                                    /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                    is_false = GRAPH.drawelem(elem, GRAPH.result, is_false);
                                }
                                break;
                            }
                        case "segment":
                        case "vector":
                        case "ray":
                            {
                                let is_correct;
                                if (JS.select(pElem).classList.contains('segment') || JS.select(pElem).classList.contains('polygon')) {
                                    /* assign the value of is_correct variable to 'true' if the value of uans at perticular index exist in cans array otherwise false */
                                    is_correct = (cans.includes(val)) ? true : false;
                                }
                                if (JS.select(pElem).classList.contains('ray') || JS.select(pElem).classList.contains('vector')) {
                                    /* assign the value of is_correct variable to 'true' if the index of any value in uans array is same for index of that perticular value in cans array otherwise false */
                                    is_correct = (cans.indexOf(val) == uans.indexOf(val)) ? true : false;
                                }
                                if (typeof point.for == "undefined") {
                                    // reference of initial point on the board
                                    prevPoint = point.board.prevPoint;
                                    is_correctln = is_correct;
                                } else {
                                    // assign the value of is_flag variable according to the value of 'is_correctln' and 'is_correct' variables
                                    is_flag = (is_correctln && is_correct) ? true : false;
                                    /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                    is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                }
                                break;
                            }
                        case "polygon":
                            {   
                                let shallow_cans = [...cans];
                                let shallow_uans = [...uans];

                                /* assign the value of is_flag according to the value of correct answer and your answer after spliting the value of these variables with '|' and sorting it*/
                                is_flag = (shallow_cans.sort().join('|') == shallow_uans.sort().join('|')) ? true : false;
                                /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                break;
                            }

                    }
                    /* change the border color of the preview container according to correct or incorrect */
                    GRAPH.setCorrectAns(mid, is_false);
                } else if (typeof review != "undefined" && review == 1 && JS.select(pElem).getAttribute("data-userans") == '') {
                    /* shows the border color of the preview container in red color */
                    JS.setCss(mid, {
                        border: "1px solid #ff0000"
                    });
                }
            }
        } else {
            /* It is discarded by Pete sir */
            for (let index = 0; index < uans.length; index++) {
                let val = uans[index];
                k = val.split(',');
                let text = GRAPH.updateNumberline(mid, elem, parseFloat(k[0]), parseFloat(k[1]), k[2]);
                if (typeof review != "undefined" && review == 1) {
                    if (k[1] == '0.4') {
                        if (cans.includes(val)) {
                            text.setAttribute({ 'cssClass': "cursor-down-correct", 'highlightcssClass': "cursor-down-correct", 'fixed': true });
                        } else {
                            text.setAttribute({ 'cssClass': "cursor-down-incorrect", 'highlightcssClass': "cursor-down-incorrect", 'fixed': true });
                            is_false++;
                        }
                    } else {
                        text.setAttribute({ 'fixed': true });
                        is_false++;
                    }
                    GRAPH.setCorrectAns(mid, is_false);
                }
            }
        }
    }
};

// change the border color of the preview container according tho the answer matched
GRAPH.setCorrectAns = function (mid, is_false) {
    if (is_false == 0) {
        // set the border color of preview container to show that answer is correct
        JS.setCss(mid, {
            border: "1px solid #00ff00"
        });
        // check the element have id: answer
        JS.select("#answer").checked = true;
        // sets the attribute 'as' value 1 of preview container
        JS.select(mid).setAttribute('as', 1);
    } else {
        // set the border color of preview container to show that answer is incorrect
        JS.setCss(mid, {
            border: "1px solid #ff0000"
        });
        // uncheck the element have id: answer
        JS.select("#answer").checked = false;
        // sets the attribute 'as' value -1 of preview container
        JS.select(mid).setAttribute('as', -1);
    }
};

// sets the fill and stroke color of point and returns the value of variable is_flase 
GRAPH.drawelem = function (elem, is_flag, is_false) {
    if (JS.select('#' + elem).classList.contains('plot')) {
        if (is_flag == true) {
            if (typeof point.for == "undefined") {
                // sets the stroke and fill color of point to #00FF00
                point.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
            } else {
                // sets the stroke color of point to #00FF00
                point.for.setAttribute({ 'strokeColor': "#00FF00" });
                // sets the stroke and fill color of the first point to #00FF00
                point.for.point1.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                // sets the stroke and fill color of the second point to #00FF00
                point.for.point2.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
            }
        } else {
            if (typeof point.for == "undefined") {
                // sets the stroke and fill color of point to #FF0000
                point.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
            } else {
                // sets the stroke color of point to #FF0000
                point.for.setAttribute({ 'strokeColor': "#FF0000" });
                // sets the stroke and fill color of the first point to #FF0000
                point.for.point1.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                // sets the stroke and fill color of the second point to #FF0000
                point.for.point2.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
            }
            is_false++;
        }
    } else if (JS.select('#' + elem).classList.contains('polygon')) {
        let i;
        if (is_flag == true) {
            if (typeof point.for != "undefined") {
                for (i = 0; i < point.for.vertices.length; i++) {
                    // sets the stroke and fill color of the vertics to #00FF00
                    point.for.vertices[i].setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                }
            }
        } else {
            if (typeof point.for != "undefined") {
                for (i = 0; i < point.for.vertices.length; i++) {
                    // sets the stroke and fill color of the vertics to #FF0000
                    point.for.vertices[i].setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                }
                // fills the color of the polygon to #FF0000 with opacity 0.5
                point.for.setAttribute({ 'fillColor': "#FF0000", 'opacity': 0.5 });
            }
            is_false++;
        }
    } else {
        if (is_flag == true) {
            /* sets the stroke and fill color of the last point to #00FF00 if the graph board container have not class polygon or plot and value of is_flag is true */
            point.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
            /* sets the stroke and fill color of the initial point to #00FF00 if the graph board container have not class polygon or plot and value of is_flag is true */
            prevPoint.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
            /* sets the stroke color to #00FF00 if the graph board container have not class polygon or plot and value of is_flag is true */
            point.for.setAttribute({ 'strokeColor': "#00FF00" });
        } else {
            /* sets the stroke and fill color of the last point to #FF0000 if the graph board container have not class polygon or plot and value of is_flag is false */
            point.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
            /* sets the stroke and fill color of the initial point to #FF0000 if the graph board container have not class polygon or plot and value of is_flag is false */
            prevPoint.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
            /* sets the stroke color to #FF0000 if the graph board container have not class polygon or plot and value of is_flag is false */
            point.for.setAttribute({ 'strokeColor': "#FF0000" });
            is_false++;
        }

    }
    // returns the value of variable is_false
    return is_false;
};

// function for draw the circle on preview side
GRAPH.drawCirclePreview = function (mid, elem, val) {
    // split the data combined of center and radius of the circle separated by '/'
    let key = val.split('/');

    for (let index = 0; index < key.length; index++) {
        let n = key[0].split(','), point;
        if (key[index].indexOf(',') != -1) {
            // create instance of point
            point = board.create('point', [parseInt(n[0]), parseInt(n[1])], { 'name': "" });
            //assign the center point
            prevPoint = point;
        } else {
            let next = (parseInt(n[0]) - parseInt(key[1]));
            // creates the instance of point
            point = board.create('point', [parseInt(next), parseInt(n[1])], { 'name': "" });
        }
        // update and draw the graph on graph board according to the type and point on the graph board
        GRAPH.updateAndDrawPreview(mid, elem, point);
    }
};

/* ajax based code */
GRAPH.labbinded = true;

// shows the UI indicting correct or incorrect and correct answer and your answer button and not allowed to perform the task if the value of its  argument is not equals to undefined
GRAPH.modeOn = function (modeType) {
    // adds the class 'h' to the element have class 'test' or 'review'. Basically hides the correct and your answer buttons
    JS.selectAll('.test, .review', 'addClass', 'h');
    if (modeType) {
        // shows the correct and your answer buttons
        JS.selectAll('.review', 'removeClass', 'h');
        /* prevents the user to perform the task when review mode is on and changes the color of button which is currently clicked */
        GRAPH.unBindLab();
        GRAPH.showansdrag(GRAPH.ajax_eId, 'u', 1);
    } else {
        // removes the class 'h' from element have class 'test'
        JS.selectAll('.test', 'removeClass', 'h');
        // allows the user to perform the task when review mode is off
        GRAPH.bindLab();
        // shows the user answer which was performed by the user
        GRAPH.showansdrag(GRAPH.ajax_eId, 'u');
        // sets the border color of preview container
        JS.setCss(GRAPH.ajax_eId).style.border = '1px solid #CCCCCC';
    }
};


// allows the user to perform the task when review mode is off
GRAPH.bindLab = function () {
    // assign the value true to variable GRAPH.labbinded
    GRAPH.labbinded = true;
    // plot the graph on the graph board with some binded events
    GRAPH.readyThis(GRAPH.ajax_eId);
    // shows delete button when review mode is off
    JS.find(GRAPH.ajax_eId, '.delElem').removeAttribute('style');
    // shows ada button when review mode is off
    JS.find(GRAPH.ajax_eId, '#ADA_button').style.display = 'block';
};


// prevents the user to perform the task when review mode is on and changes the color of button which is currently clicked
GRAPH.unBindLab = function () {
    // assign the value false to variable GRAPH.labbinded
    GRAPH.labbinded = false;
    // hides delete button when review mode is on
    JS.find(GRAPH.ajax_eId, '.delElem').style.display = 'none';
    // hides ada button when review mode is on
    JS.find(GRAPH.ajax_eId, '#ADA_button').style.display = 'none';
};

/* clsSMGraph/GraphPreview.svelte generated by Svelte v3.29.0 */

const { document: document_1 } = globals;
const file = "clsSMGraph/GraphPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-e5vip7-style";
	style.textContent = "#graph_modal.svelte-e5vip7 .modal-body.svelte-e5vip7{max-height:350px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGhQcmV2aWV3LnN2ZWx0ZSIsInNvdXJjZXMiOlsiR3JhcGhQcmV2aWV3LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8IS0tXG4gKiAgRmlsZSBOYW1lICAgOiBHcmFwaFByZXZpZXcuc3ZlbHRlXG4gKiAgRGVzY3JpcHRpb24gOiBSZXNwb25zaWJsZSBmb3IgUHJldmlldyBTaWRlIGZ1bmN0aW9uYWxpdHlcbiAqICBBdXRob3IgICAgICA6IEF5dXNoIFNyaXZhc3RhdmFcbiAqICBQYWNrYWdlICAgICA6IGNsc1NNR1JBUEggKFByZXZpZXcpXG4gKiAgTGFzdCB1cGRhdGUgOiAwMi1NYXItMjAyMVxuICogIExhc3QgVXBkYXRlZCBCeSA6IEF5dXNoIFNyaXZhc3RhdmFcbi0tPlxuPHNjcmlwdD5cbiAgICBpbXBvcnQgeyBhZnRlclVwZGF0ZSwgYmVmb3JlVXBkYXRlLCBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJztcbiAgICBpbXBvcnQgbCBmcm9tICcuLi9zcmMvbGlicy9MYW5nJztcbiAgICBpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gXCJzdmVsdGUvc3RvcmVcIjtcbiAgICBcbiAgICBpbXBvcnQgSXRlbUhlbHBlciBmcm9tICcuLi9oZWxwZXIvSXRlbUhlbHBlci5zdmVsdGUnO1xuXHRpbXBvcnQgeyBYTUxUb0pTT04sIEFIIH0gZnJvbSAnLi4vaGVscGVyL0hlbHBlckFJLnN2ZWx0ZSc7XG4gICAgaW1wb3J0IEdSQVBIIGZyb20gJy4vbGliL21hdGhTdHJpbmcnO1xuXG4gICAgZXhwb3J0IGxldCB4bWw7XG5cdGV4cG9ydCBsZXQgdXhtbDtcblx0ZXhwb3J0IGxldCBpc1Jldmlldztcblx0ZXhwb3J0IGxldCBzaG93QW5zO1xuXHRleHBvcnQgbGV0IGVkaXRvclN0YXRlO1xuICAgIGxldCBzdGF0ZSA9IHt9O1xuICAgIGxldCBwcmV2aWV3X3N0b3JlID0gd3JpdGFibGUoe1xuXHRcdHhtbCA6IFwiXCIsXG4gICAgICAgIFFYTUw6IFwiXCIsXG4gICAgICAgIHVzZXJBbnNfZGF0YTogXCJcIixcbiAgICAgICAgbW9kdWxlVHlwZSA6IFwibm9uZVwiLFxuICAgICAgICBub09mUm93OiAxLFxuICAgICAgICByZXZpZXc6IGZhbHNlLFxuICAgICAgICBpbml0IDogZmFsc2UsXG4gICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICBtb2RhbFZpZXdMYXlvdXQ6IFtdLFxuICAgICAgICBjaGVja2VkOiB0cnVlLFxuXHR9KTtcblxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gcHJldmlld19zdG9yZS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuXHRcdHN0YXRlID0gdmFsdWU7XG5cdH0pO1xuXG4gICAgLy8gZnVuY3Rpb25zIHJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIHRoZSBtb2R1bGVcbiAgICBiZWZvcmVVcGRhdGUoYXN5bmMoKSA9PiB7XG4gICAgICAgIGlmICghc3RhdGUuaW5pdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAoSlhHKSA9PSAnb2JqZWN0JyAmJiBlZGl0b3JTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmluaXQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoZWRpdG9yU3RhdGUpID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgQUguYWRkU2NyaXB0KCcnLCB0aGVtZVVybCArICdwZS1pdGVtcy9zdmVsdGUvY2xzU01HcmFwaC9saWIvanN4Z3JhcGgubWluLmpzJywge2NhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmluaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZWRpdG9yU3RhdGUgJiYgZWRpdG9yU3RhdGUuc3RvcFByZXZpZXdVcGRhdGUpIHtcbiAgICAgICAgICAgIHhtbCA9IEFILnNlbGVjdCgnI3NwZWNpYWxfbW9kdWxlX3htbCcpLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0ZS5pbml0ICYmIHN0YXRlLnhtbCAhPSB4bWwpIHtcbiAgICAgICAgICAgIGxvYWRNb2R1bGUoeG1sKTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBmdW5jdGlvbnMgcmVzcG9uc2libGUgZm9yIGRvaW5nIHRoZSBjaGFuZ2VzIGFjY29yZGluZyB0byB0aGUgeG1sXG4gICAgYWZ0ZXJVcGRhdGUoYXN5bmMoKSA9PiB7XG4gICAgICAgIGlmIChzdGF0ZS5pbml0KSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUueG1sICE9IHhtbCkge1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3JTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXNldHRpbmcgdGhlIGFuc3dlclxuICAgICAgICAgICAgICAgICAgICByZXNldEFkYU1vZGFsKCk7XG4gICAgICAgICAgICAgICAgICAgIEFILmZpbmQoXCIjbWF0aG1haW5cIiwgJ1tpZF49SURdJykuc2V0QXR0cmlidXRlKFwiZGF0YS11c2VyYW5zXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbml0TW9kdWxlKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHJldmlld19zdG9yZS51cGRhdGUoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ueG1sID0geG1sO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChpc1JldmlldyAmJiB0eXBlb2YgKGVkaXRvclN0YXRlKSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBzZXRSZXZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5yZXZpZXcgIT0gaXNSZXZpZXcgJiYgZWRpdG9yU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2aWV3X3N0b3JlLnVwZGF0ZSggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5yZXZpZXcgPSBpc1JldmlldztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmV2aWV3KSB7XG4gICAgICAgICAgICAgICAgICAgIEdSQVBILm1vZGVPbigxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUFucygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEdSQVBILm1vZGVPbigwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0QWxsKCcjbWF0aG1haW4gI2RlbEJ1dHRvbi5hY3RpdmUnLCAncmVtb3ZlQ2xhc3MnLCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmNoZWNrZWQgJiYgdHlwZW9mKHNob3dBbnMpID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgR1JBUEguY2hlY2tBbnMoXCIjbWF0aG1haW5cIik7XG4gICAgICAgICAgICAgICAgc3RhdGUuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQUguZW5hYmxlQnNBbGwoJ1tkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIl0nLCAnVG9vbHRpcCcpXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gUmVzcG9uaWJsZSBmb3IgYmluZGluZyB0aGUgZXZlbnRzXG4gICAgb25Nb3VudChhc3luYygpPT4ge1xuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2V0SGVpZ2h0ICYmIHdpbmRvdy5nZXRIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICBBSC5zZXQoXCJxX3JlZnJlc2hcIiwgcmVmcmVzaE1vZHVsZSk7XG5cbiAgICAgICAgaWYgKCFlZGl0b3JTdGF0ZSkge1xuICAgICAgICAgICAgcmVmcmVzaE1vZHVsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgQUgubGlzdGVuKCdib2R5JywgJ2tleWRvd24nLCAnI21hdGhtYWluICNkZWxCdXR0b24nLCBmdW5jdGlvbiAoY3VycmVudCwgZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmFsdEtleSAmJiAoZXZlbnQud2hpY2ggPT0gNDkgfHwgZXZlbnQua2V5Q29kZSA9PSA0OSkpIHtcbiAgICAgICAgICAgICAgICBvcGVuTW9kYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgQUgubGlzdGVuKCdib2R5JywgJ2tleWRvd24nLCAnI21hdGhtYWluICNBREFfYnV0dG9uJywgZnVuY3Rpb24gKGN1cnJlbnQsIGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgIG9wZW5Nb2RhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBBSC5saXN0ZW4oJ2JvZHknLCAnY2xpY2snLCAnI21hdGhtYWluJywgZnVuY3Rpb24gKGN1cnJlbnQsIGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQgIT0gJ2RlbEJ1dHRvbicgJiYgZXZlbnQudGFyZ2V0LmlkICE9ICdBREFfYnV0dG9uJyAmJiBldmVudC50YXJnZXQuaWQgIT0gJ2RlbEJ1dHRvbicgJiYgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQgIT0gJ0FEQV9idXR0b24nICYmIGV2ZW50LnRhcmdldC5pZCAhPSAnb3B0aW9uLXRvb2xiYXInKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheUFucygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBBSC5saXN0ZW4oJ2JvZHknLCAnbW91c2V1cCcsICcjbWF0aG1haW4nLCBmdW5jdGlvbiAoY3VycmVudCwgZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCAhPSAnZGVsQnV0dG9uJyAmJiBldmVudC50YXJnZXQuaWQgIT0gJ0FEQV9idXR0b24nICYmIGV2ZW50LnRhcmdldC5pZCAhPSAnZGVsQnV0dG9uJyAmJiBldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCAhPSAnQURBX2J1dHRvbicgJiYgZXZlbnQudGFyZ2V0LmlkICE9ICdvcHRpb24tdG9vbGJhcicpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5QW5zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEFILmxpc3RlbignYm9keScsICdjbGljaycsICcuZGVsRWxlbScsIGZ1bmN0aW9uIChjdXJyZW50KSB7XG4gICAgICAgICAgICBsZXQgY3VyX2VsZW0gPSBjdXJyZW50LmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgY3VyX2VsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICBpZiAoIEFILnNlbGVjdCgnLnNlbGVjdGVkLW9wdGlvbicpLmlubmVySFRNTCA9PSAncG9pbnQnIHx8IEFILnNlbGVjdCgnLnNlbGVjdGVkLW9wdGlvbicpLmlubmVySFRNTCA9PSAnY2lyY2xlJyB8fCBBSC5zZWxlY3QoJy5zZWxlY3RlZC1vcHRpb24nKS5pbm5lckhUTUwgPT0gJ2Fzc29jaWF0aW9uJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyX2VsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICBzd2FsKGwuZGVsZXRlX21zZyk7XG4gICAgICAgICAgICAgICAgICAgIEFILmZpbmQoJyNtYXRobWFpbicsICcjSUQwUHJldmlldycpLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIEFILmZpbmQoJyNtYXRobWFpbicsICcjSUQwUHJldmlldycpLnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xuICAgICAgICAgICAgICAgICAgICBjdXJfZWxlbS5zdHlsZS5jb2xvciA9ICdibGFjayc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJfZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgY3VyX2VsZW0uc3R5bGUuY29sb3IgPSAnYmxhY2snO1xuICAgICAgICAgICAgICAgIHN3YWwobC5sYXN0X2RlbGV0ZV9tc2cpO1xuICAgICAgICAgICAgICAgIEFILnNldENzcyhjdXJyZW50LCB7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IFwibm9uZVwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgQUguZmluZCgnI21hdGhtYWluJywgJyNJRDBQcmV2aWV3Jykuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEFILmxpc3RlbignYm9keScsICdjbGljaycsICcjbWF0aG1haW4gLmZvb3Rlcl90b29sYm94IGxpJywgZnVuY3Rpb24gKGN1cnJlbnQpIHtcbiAgICAgICAgICAgIGN1cnJlbnQuY2xhc3NMaXN0LmFkZCgnYnRuX2FjdGl2ZScpO1xuICAgICAgICAgICAgQUguc2VsZWN0QWxsKEFILnNpYmxpbmdzKGN1cnJlbnQpLCAncmVtb3ZlQ2xhc3MnLCAnYnRuX2FjdGl2ZScpXG4gICAgICAgIH0pO1xuICAgIH0pXG5cbiAgICAvLyBmb3IgcmVmcmVzaGluZyB0aGUgbW9kdWxlXG4gICAgZnVuY3Rpb24gcmVmcmVzaE1vZHVsZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBKWEcgIT0gJ3VuZGVmaW5lZCcgJiYgQUguc2VsZWN0KCcjSUQwUHJldmlldycpLm5vZGVOYW1lICYmIEFILnNlbGVjdCgnI0lEMFByZXZpZXcnKS5vZmZzZXRIZWlnaHQpIHtcbiAgICAgICAgICAgIGluaXRNb2R1bGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIGZvciBpbmlhdGluZyBtb2R1bGUgXG4gICAgZnVuY3Rpb24gaW5pdE1vZHVsZSgpIHtcbiAgICAgICAgR1JBUEgucmVhZHlUaGlzKFwiI21hdGhtYWluXCIpO1xuICAgICAgICAvLyBjYWxsZWQgZm9yIHVwZGF0ZSB0aGUgZ3JhcGggb24gZ3JhcGggYm9hcmRcbiAgICAgICAgR1JBUEguc2hvd2Fuc2RyYWcoXCIjbWF0aG1haW5cIiwgJ3UnLCAxKTtcbiAgICAgICAgLyogYWxsb3dzIHVzZXIgdG8gcGVyZm9ybSB0aGUgdGFzayBhbmQgaGlkZXMgJ2NvcnJlY3QgYW5zd2VyJyBhbmQgJ3lvdXIgYW5zd2VyJyBidXR0b24gKi9cbiAgICAgICAgR1JBUEgubW9kZU9uKCk7XG4gICAgfVxuXG4gICAgLy8gcmVzcG9uc2libGUgZm9yIHNob3dpbmcgdGhlIGFuc3dlclxuICAgIGZ1bmN0aW9uIGRpc3BsYXlBbnMoKSB7XG4gICAgICAgIC8vIHVzZWQgZm9yIHN3aXRjaCBvbiBuZXh0IHF1ZXN0aW9uIGluIHByZXBlbmdpbmUgaWYgY3VycmVudCBxdWVzdGlvbiBpcyBhdHRlbXB0ZWRcbiAgICAgICAgSVNTUEVDSUFMTU9EVUxFVVNFUlhNTENIQU5HRSA9IDE7XG4gICAgICAgIC8vIGNvbGxlY3QgQ29ycmVjdCBvciBJbmNvcnJlY3Qgd2hpY2ggaXMgcmV0dXJuZWQgYnkgY2hlY2tBbnMgbWV0aG9kIFxuICAgICAgICBsZXQgYW5zID0gR1JBUEguY2hlY2tBbnMoXCIjbWF0aG1haW5cIik7XG4gICAgICAgIGlmIChlZGl0b3JTdGF0ZSkge1xuICAgICAgICAgICAgLy8gc2hvd3MgdGhlIGFuc3dlciBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIGl0cyBhcmd1bWVudCBwYXNzZWRcbiAgICAgICAgICAgIHNob3dBbnMoYW5zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIHJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIHRoZSBtb2R1bGVcbiAgICBmdW5jdGlvbiBsb2FkTW9kdWxlIChsb2FkWG1sKSB7XG4gICAgICAgIGxvYWRYbWwgPSBYTUxUb0pTT04obG9hZFhtbCk7XG4gICAgICAgIHBhcnNlWE1MQXV0aG9yaW5nKGxvYWRYbWwpO1xuICAgICAgICBsZXQgdWFYTUwgPSB7fTtcbiAgICAgICAgaWYgKHV4bWwpIHtcbiAgICAgICAgICAgIC8vIGNvbnZlcnRzIHRoZSB1c2VyIGFuc3dlciB4bWwgdmFsdWUgaW50byBqc29uIHdoaWNoIGlzIHN0b3JlIGluICd1eG1sJ1xuICAgICAgICAgICAgdWFYTUwgPSBYTUxUb0pTT04odXhtbCk7XG4gICAgICAgICAgICBpZiAoIHVhWE1MICYmIHVhWE1MLnNtYW5zICYmIHVhWE1MLnNtYW5zLmRpdiAmJiB1YVhNTC5zbWFucy5kaXYuX3VzZXJBbnMpIHtcbiAgICAgICAgICAgICAgICBwcmV2aWV3X3N0b3JlLnVwZGF0ZSggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS51c2VyQW5zX2RhdGEgPSB1YVhNTC5zbWFucy5kaXYuX3VzZXJBbnM7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVx0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3IgcGFyc2luZyB0aGUgeG1sXG4gICAgZnVuY3Rpb24gcGFyc2VYTUxBdXRob3JpbmcoTVlYTUwpIHtcbiAgICAgICAgcHJldmlld19zdG9yZS51cGRhdGUoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLlFYTUwgPSBNWVhNTC5zbXhtbC5wbG90O1xuICAgICAgICAgICAgaXRlbS5tb2R1bGVUeXBlID0gTVlYTUwuc214bWwucGxvdC5fdHlwZTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3Igb3BlbmluZyB0aGUgbW9kYWxcbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoKSB7XG4gICAgICAgIEFILmdldEJTKCcjZ3JhcGhfbW9kYWwnLCAnTW9kYWwnKS5zaG93KCk7XG4gICAgICAgIGxvYWRNb2RhbFZpZXcoKTtcblxuICAgICAgICBBSC5zZWxlY3RBbGwoJ1tyZXNldFZhbHVlPVwiMVwiXScsICd2YWx1ZScsICcnKTtcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiBmb3Igc2V0dGluZyB0aGUgdXhtbCBvbiBrZXkgdXBkYXRlXG4gICAgZnVuY3Rpb24gbW9kaWZ5VXhtbE9uS2V5KCkge1xuICAgICAgICBsZXQgdGVtcFJvd1ZhbCA9IFtdO1xuICAgICAgICBsZXQgcm93O1xuICAgICAgICBzd2l0Y2ggKHN0YXRlLm1vZHVsZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjaXJjbGVcIjpcbiAgICAgICAgICAgICAgICAvLyBzZWxlY3RzIGFsbCByb3dcbiAgICAgICAgICAgICAgICByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbkRpdicpO1xuICAgICAgICAgICAgICAgIC8vdmFyIHRlbXBSb3dWYWwgPSBbXTtcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdHMgYWxsIGlucHV0IGZpZWxkIGluIHBlcnRpY3VsYXIgcm93XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHtpdGVtLmlkfSAuZ2V0RmllbGRWYWxgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlcyBhcnJheSB3aXRoIGlucHV0IGZpZWxkcyB2YWx1ZSB3aGljaCBhcmUgZGVmaW5lZCBmb3IgeCBhbmQgeSBjby1vcmRpbmF0ZSBhbmQgcmFkaXVzIGFmdGVyIHNlcGFyYXRpbmcgY29tbWEgYW5kICcvJyB3aGljaCBpcyByZXF1aXJlZCB3aGVyZSBpdCBpcyBzdWl0YWJsZSBcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBDb2wgPSBbY29sWzBdLnZhbHVlICsgXCIsXCIgKyBjb2xbMV0udmFsdWUgKyBcIi9cIiArIGNvbFsyXS52YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgdmFsdWUgb2YgJ3RlbXBDb2wnIGFycmF5IGludG8gYXJyYXkgJ3RlbXBSb3dWYWwnXG4gICAgICAgICAgICAgICAgICAgIHRlbXBSb3dWYWwucHVzaCh0ZW1wQ29sKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiAnZGF0YS11c2VyYW5zJyBhdHRyaWJ1dGUgb2YgZ3JhcGggYm9hcmQgY29udGFpbmVyIGluc2lkZSBwcmV2aWV3IGNvbnRhaW5lciB3aGVyZSBpZCBzdGFydHMgd2l0aCAnSUQnIGNoYXJhY3RlciBhZnRlciBqb2luaW5nIHRoZSAndGVtcFJvd1ZhbCcgYXJyYXkgdmFsdWUgd2l0aCAnfCcgXG5cbiAgICAgICAgICAgICAgICBBSC5maW5kKFwiI21hdGhtYWluXCIsICdbaWRePUlEXScpLnNldEF0dHJpYnV0ZShcImRhdGEtdXNlcmFuc1wiLCB0ZW1wUm93VmFsLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgLy8gY2FsbHMgdW5zZXRSZXZpZXcgbWV0aG9kXG4gICAgICAgICAgICAgICAgdW5zZXRSZXZpZXcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwb2ludFwiOlxuICAgICAgICAgICAgY2FzZSBcInBvbHlnb25cIjogXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0cyB0aGUgYWxsIHJvd3MgYXZhaWxhYmxlIGluIEFEQSBtb2RhbCBib3hcbiAgICAgICAgICAgICAgICByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbkRpdicpO1xuICAgICAgICAgICAgICAgIC8vdmFyIHRlbXBSb3dWYWwgPSBbXTtcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdHMgYWxsIGlucHV0IGZpZWxkIGluIHBlcnRpY3VsYXIgcm93XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHtpdGVtLmlkfSAuZ2V0RmllbGRWYWxgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlcyBhcnJheSB3aXRoIGlucHV0IGZpZWxkcyB2YWx1ZSB3aGljaCBhcmUgZGVmaW5lZCBmb3IgeCBhbmQgeSBjby1vcmRpbmF0ZVxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcENvbCA9IFtjb2xbMF0udmFsdWUgKyBcIixcIiArIGNvbFsxXS52YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgZGF0YSBvZiAndGVtcENvbCcgaW4gYXJyYXkgJ3RlbXBSb3dWYWwnXG4gICAgICAgICAgICAgICAgICAgIHRlbXBSb3dWYWwucHVzaCh0ZW1wQ29sKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiAnZGF0YS11c2VyYW5zJyBhdHRyaWJ1dGUgb2YgZ3JhcGggYm9hcmQgY29udGFpbmVyIGluc2lkZSBwcmV2aWV3IGNvbnRhaW5lciB3aGVyZSBpZCBzdGFydHMgd2l0aCAnSUQnIGNoYXJhY3RlciBhZnRlciBqb2luaW5nIHRoZSAndGVtcFJvd1ZhbCcgYXJyYXkgdmFsdWUgd2l0aCAnfCcgXG4gICAgICAgICAgICAgICAgQUguZmluZChcIiNtYXRobWFpblwiLCAnW2lkXj1JRF0nKS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXVzZXJhbnNcIiwgdGVtcFJvd1ZhbC5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIC8vIGNhbGxzIHVuc2V0UmV2aWV3IG1ldGhvZFxuICAgICAgICAgICAgICAgIHVuc2V0UmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2luZVwiOlxuICAgICAgICAgICAgY2FzZSBcImNvc2luZVwiOlxuICAgICAgICAgICAgY2FzZSBcImxpbmVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYXlcIjpcbiAgICAgICAgICAgIGNhc2UgXCJzZWdtZW50XCI6XG4gICAgICAgICAgICBjYXNlIFwidmVjdG9yXCI6XG4gICAgICAgICAgICBjYXNlIFwicGFyYWJvbGFcIjpcbiAgICAgICAgICAgICAgICByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbkRpdicpO1xuICAgICAgICAgICAgICAgIC8vdmFyIHRlbXBSb3dWYWwgPSBbXTtcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHtpdGVtLmlkfSAuZ2V0RmllbGRWYWxgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGFycmF5IG9mIHZhbHVlIHBvaW50IHgxLCB5MSBhbmQgIHgyLCB5MiBzZXBhcmF0ZWQgd2l0aCAnfCcgZnJvbSBBREEgZGlhbG9nIGJveFxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcENvbCA9IFtjb2xbMF0udmFsdWUgKyBcIixcIiArIGNvbFsxXS52YWx1ZSArIFwifFwiICsgY29sWzJdLnZhbHVlICsgXCIsXCIgKyBjb2xbM10udmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAvLyBwdXNoZXMgdGhlIGRhdGEgaW4gJ3RlbXBSb3dWYWwnIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIHRlbXBSb3dWYWwucHVzaCh0ZW1wQ29sKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiAnZGF0YS11c2VyYW5zJyBhdHRyaWJ1dGUgb2YgZ3JhcGggYm9hcmQgY29udGFpbmVyIGluc2lkZSBwcmV2aWV3IGNvbnRhaW5lciB3aGVyZSBpZCBzdGFydHMgd2l0aCAnSUQnIGNoYXJhY3RlciBhZnRlciBqb2luaW5nIHRoZSAndGVtcFJvd1ZhbCcgYXJyYXkgdmFsdWUgd2l0aCAnfCdcbiAgICAgICAgICAgICAgICBBSC5maW5kKFwiI21hdGhtYWluXCIsICdbaWRePUlEXScpLnNldEF0dHJpYnV0ZShcImRhdGEtdXNlcmFuc1wiLCB0ZW1wUm93VmFsLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgLy8gY2FsbHMgdW5zZXRSZXZpZXcgbWV0aG9kXG4gICAgICAgICAgICAgICAgdW5zZXRSZXZpZXcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhc3NvY2lhdGlvblwiOlxuICAgICAgICAgICAgICAgIC8vIGl0IGlzIGRpc2NhcmRlZCBieSBQZXRlIHNpclxuICAgICAgICAgICAgICAgIHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYWluRGl2Jyk7XG4gICAgICAgICAgICAgICAgLy92YXIgdGVtcFJvd1ZhbCA9IFtdO1xuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke2l0ZW0uaWR9IC5nZXRGaWVsZFZhbGApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcENvbCA9IFtjb2xbMF0udmFsdWUgKyBcIixcIiArIGNvbFsxXS52YWx1ZSArIFwiLFwiICsgY29sWzJdLnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFJvd1ZhbC5wdXNoKHRlbXBDb2wpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgQUguZmluZChcIiNtYXRobWFpblwiLCAnW2lkXj1JRF0nKS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXVzZXJhbnNcIiwgdGVtcFJvd1ZhbC5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIHVuc2V0UmV2aWV3KClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5QW5zKCk7XG4gICAgICAgIEFILmdldEJTKCcjZ3JhcGhfbW9kYWwnLCAnTW9kYWwnKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgLy8gdXNlZCBmb3IgQURBIGFuZCBhZGRzIG9yIHJlbW92ZXMgdGhlIHJvdyBcbiAgICBmdW5jdGlvbiB1cGRhdGVSb3cgKHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJhZGRcIikge1xuICAgICAgICAgICAgLy8gaW5jcmVhc2VzIHRoZSByb3cgYnkgMSBpZiAnYWRkJyBidXR0b24gY2xpY2tlZFxuICAgICAgICAgICAgc3RhdGUubm9PZlJvdyA9IHN0YXRlLm5vT2ZSb3cgKyAxO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3JlbW92ZScpIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5ub09mUm93ID09IDEpIHtcbiAgICAgICAgICAgICAgICBzd2FsKFwiRGVmYXVsdCByb3cgY2FuJ3QgYmUgZGVsZXRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gIGRlY3JlYXNlcyB0aGUgcm93IGJ5IDEgaWYgJ3JlbW92ZScgYnV0dG9uIGNsaWNrZWQgYW5kIHJvdyBpcyBncmVhdGVyIHRoYW4gMVxuICAgICAgICAgICAgICAgIHN0YXRlLm5vT2ZSb3cgPSBzdGF0ZS5ub09mUm93IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsb2FkTW9kYWxWaWV3KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIGxvYWRzIHRoZSBBREEgbW9kYWwgYm94IGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2Ygc3RhdGUgJ21vZHVsZVR5cGUnXG4gICAgZnVuY3Rpb24gbG9hZE1vZGFsVmlldygpIHtcbiAgICAgICAgbGV0IG1vZGFsVmlld0xheW91dCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RhdGUubm9PZlJvdzsgaW5kZXgrKykge1xuICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSB2YWx1ZSByZXR1cm4gYnkgZ2V0Um93IG1ldGhvZCBpbiBhcnJheSAnbW9kYWxWaWV3TGF5b3V0J1xuICAgICAgICAgICAgbW9kYWxWaWV3TGF5b3V0ID0gW1xuICAgICAgICAgICAgICAgIC4uLm1vZGFsVmlld0xheW91dCwge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVUeXBlIDogc3RhdGUubW9kdWxlVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICBwcmV2aWV3X3N0b3JlLnVwZGF0ZSgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaXRlbS5tb2RhbFZpZXdMYXlvdXQgPSBtb2RhbFZpZXdMYXlvdXQ7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogc2hvd3MgY29ycmVjdCBvciBpbmNvcnJlY3QgbWVzc2FnZSBhbmQgY29ycmVjdCBhbnN3ZXIgYW5kIHlvdXIgYW5zd2VyIGJ1dHRvbiBhbmQgZG9lcyBub3QgYWxsb3cgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrICovXG4gICAgZnVuY3Rpb24gc2V0UmV2aWV3KCkge1xuICAgICAgICBBSC5zZWxlY3RBbGwoJyNtYXRobWFpbiAjZGVsQnV0dG9uLmFjdGl2ZScsICdyZW1vdmVDbGFzcycsJ2FjdGl2ZScpO1xuICAgICAgICBpc1JldmlldyA9IHRydWU7XG4gICAgICAgIC8vIGRvZXMgbm90IGFsbG93IHVzZXIgdG8gcGVyZm9ybSB0aGUgdGFzayBhbmQgc2hvd3MgY29ycmVjdCBhbnN3ZXIgYW5kIHlvdXIgYW5zd2VyIGJ1dHRvblxuICAgICAgICBHUkFQSC5tb2RlT24oXCJvblwiKTtcbiAgICAgICAgLy8gc2hvd3MgdGhlIHN0cm9rZSBhbmQgZmlsbCBjb2xvciBvZiB0aGUgcG9pbnQgYW5kIGdyYXBoXG4gICAgICAgIEdSQVBILnNob3dhbnNkcmFnKCcjbWF0aG1haW4nLCAndScsIDEpO1xuICAgICAgICAvLyBkaXNwbGF5IHRoZSBjb3JyZWN0IG9yIGluY29ycmVjdCBcbiAgICAgICAgZGlzcGxheUFucygpO1xuICAgIH1cblxuICAgIC8qIGhpZGVzIGNvcnJlY3Qgb3IgaW5jb3JyZWN0IG1lc3NhZ2UgYW5kIGNvcnJlY3QgYW5zd2VyIGFuZCB5b3VyIGFuc3dlciBidXR0b24gYW5kIGFsbG93IHVzZXIgdG8gcGVyZm9ybSB0aGUgdGFzayByZW1vdmVzIHJlZCBvciBncmVlbiBjb2xvciBvZiBib3JkZXIgb2YgcHJldmlldyBjb250YWluZXIgKi9cbiAgICBmdW5jdGlvbiB1bnNldFJldmlldygpIHtcbiAgICAgICAgQUguc2VsZWN0QWxsKCcjbWF0aG1haW4gI2RlbEJ1dHRvbi5hY3RpdmUnLCAncmVtb3ZlQ2xhc3MnLCdhY3RpdmUnKTtcbiAgICAgICAgaXNSZXZpZXcgPSBmYWxzZTtcbiAgICAgICAgLy8gYWxsb3cgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrXG4gICAgICAgIEdSQVBILm1vZGVPbigpO1xuICAgICAgICAvLyBkb2VzIG5vdCBzaG93IHRoZSBwb2ludCBhbmQgZ3JhcGggc3Ryb2tlIGFuZCBmaWxsIGNvbG9yIHRvIGluZGljYXRlIHRoYXQgYW5zd2VyIGlzIGNvcnJlY3Qgb3IgaW5jb3JyZWN0LCBzaG93cyBib3JkZXIgY29sb3Igb2YgcHJldmlldyBjb250YWluZXIgaW4gZ3JheSBjb2xvciAqL1xuICAgICAgICBHUkFQSC5zaG93YW5zZHJhZygnI21hdGhtYWluJywgJ3UnLCAwKTtcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgdGhlIHJldmlldyBtb2RlXG4gICAgZnVuY3Rpb24gaGFuZGxlUmV2aWV3TW9kZShtb2RlKSB7XG4gICAgICAgIGlmIChtb2RlID09ICdjJykge1xuICAgICAgICAgICAgR1JBUEguc2hvd2Fuc2RyYWcoJyNtYXRobWFpbicsICdjJywgMSlcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09ICd1Jykge1xuICAgICAgICAgICAgR1JBUEguc2hvd2Fuc2RyYWcoJyNtYXRobWFpbicsICd1JywgMSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIGZvciByZXNldHRpbmcgdGhlIG1vZGFsXG4gICAgZnVuY3Rpb24gcmVzZXRBZGFNb2RhbCAoKSB7XG4gICAgICAgIHN0YXRlLm5vT2ZSb3cgPSAxO1xuICAgICAgICBBSC5zZWxlY3RBbGwoJ1tpZF49ZGl2QWxsVGV4dEJveF06bm90KFtpZD1cImRpdkFsbFRleHRCb3gwXCJdKScsICdyZW1vdmUnKTtcbiAgICAgICAgQUkuc2VsZWN0QWxsKCcuZ2V0RmllbGRWYWw6bm90KDpkaXNhYmxlZCknLCAndmFsdWUnLCAnJyk7XG4gICAgfVxuPC9zY3JpcHQ+XG48ZGl2PlxuICAgIDxsaW5rIG9ubG9hZD1cInRoaXMucmVsPSdzdHlsZXNoZWV0J1wiIHJlbD1cInByZWxvYWRcIiBhcz1cInN0eWxlXCIgaHJlZj17dGhlbWVVcmwgKyBcInBlLWl0ZW1zL3N2ZWx0ZS9jbHNTTUdyYXBoL2Nzcy9NYXRoLm1pbi5jc3NcIn0vPlxuICAgIFxuICAgIDxjZW50ZXI+XG4gICAgICAgIDxJdGVtSGVscGVyIFxuICAgICAgICAgICAgb246c2V0UmV2aWV3ID0ge3NldFJldmlld31cbiAgICAgICAgICAgIG9uOnVuc2V0UmV2aWV3ID0ge3Vuc2V0UmV2aWV3fVxuICAgICAgICAgICAgcmV2aWV3TW9kZT17aXNSZXZpZXd9XG4gICAgICAgICAgICBoYW5kbGVSZXZpZXdDbGljayA9IHtoYW5kbGVSZXZpZXdNb2RlfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBpZD1cIm1hdGhtYWluXCJcbiAgICAgICAgICAgIGNsYXNzPVwidXNlckFucyBwb3NpdGlvbi1yZWxhdGl2ZSBiZy13aGl0ZVwiXG4gICAgICAgICAgICBzdHlsZSA9IFwiaGVpZ2h0OnsoTnVtYmVyKHN0YXRlLlFYTUwuX2hlaWdodCkgKyAyKX1weDt3aWR0aDp7c3RhdGUuUVhNTC5fd2lkdGh9cHg7XCJcbiAgICAgICAgPlxuICAgICAgICA8ZGl2IGlkPVwib3B0aW9uLXRvb2xiYXJcIiBjbGFzcz1cInRleHQtZGFya1wiPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwiY29udHJvbHNcIj5cbiAgICAgICAgICAgICAgICA8bGkgdmFsdWU9XCJwbG90Z3JhcGhcIiBjbGFzcz1cInNlbGVjdGVkLW9wdGlvbiB0ZXh0LXVwcGVyY2FzZSBtLTBcIj57c3RhdGUuUVhNTC5fdHlwZX08L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCIgXG4gICAgICAgICAgICAgICAgaWQ9XCJBREFfYnV0dG9uXCIgXG4gICAgICAgICAgICAgICAgY2xhc3M9IFwiQURBQnV0dG9uIGZsb2F0LXN0YXJ0IG10LTEgYnRuIHctYXV0byBoLWF1dG8gcC0xIGJ0bi1saWdodCBtbFwiIFxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2wuYWRhX2dyYXBoX21zZ30gXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgIHRpdGxlPXtsLmFkYV9ncmFwaF9tc2d9IGNsYXNzPVwiaWNvbW9vbi1rZXlib2FyZC0yIHMyXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3M9XCJidG4tZ3JvdXAgdG9vbHMgZGVsRWxlbSBoLWltcFwiIFxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saWdodCBwLTEgZm9jdXNfZGl2XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJkZWxCdXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLXBsYWNlbWVudD1cInJpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17bC5hZGFfbWVzc2FnZX0gXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT17bC5kZWxldGV9IGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiICBjbGFzcz17d2luZG93LmluTmF0aXZlID8gXCJkZWxldGVfYnV0dG9uXCI6IFwiaWNvbW9vbi1uZXctMjRweC1kZWxldGUtMVwifT48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgeyNpZiBzdGF0ZS5RWE1MLl9yZWZsZWN0aW9ufVxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGlkPXtzdGF0ZS5RWE1MLl9pZCArIFwiUHJldmlld1wifSBcbiAgICAgICAgICAgICAgICBkYXRhLXVzZXJhbnM9e3N0YXRlLnVzZXJBbnNfZGF0YX1cbiAgICAgICAgICAgICAgICBkYXRhLWFuc2tleT17c3RhdGUuUVhNTC5fYW5za2V5fVxuICAgICAgICAgICAgICAgIHR5cGU9e3N0YXRlLlFYTUwuX3R5cGV9IFxuICAgICAgICAgICAgICAgIGNsYXNzPXtcImRyYWctcmVzaXplIGRyb3BhYmxlIFwiICsgc3RhdGUuUVhNTC5fdHlwZX1cbiAgICAgICAgICAgICAgICBkYXRhLXh0aWNrZGlzdGFuY2U9e3N0YXRlLlFYTUwuX3h0aWNrZGlzdGFuY2V9XG4gICAgICAgICAgICAgICAgZGF0YS15dGlja2Rpc3RhbmNlPXtzdGF0ZS5RWE1MLl95dGlja2Rpc3RhbmNlfSBcbiAgICAgICAgICAgICAgICBkYXRhLXhheGlzPXtzdGF0ZS5RWE1MLl94YXhpc30gXG4gICAgICAgICAgICAgICAgZGF0YS15YXhpcz17c3RhdGUuUVhNTC5feWF4aXN9IFxuICAgICAgICAgICAgICAgIGRhdGEtc25hcHNpemU9e3N0YXRlLlFYTUwuX3NuYXBzaXplfSBcbiAgICAgICAgICAgICAgICBkYXRhLWVxdWF0aW9uPXtzdGF0ZS5RWE1MLl9lcXVhdGlvbn1cbiAgICAgICAgICAgICAgICBkYXRhLXJlZmxlY3Rpb24gPSB7c3RhdGUuUVhNTC5fcmVmbGVjdGlvbn1cbiAgICAgICAgICAgICAgICBzdHlsZSA9IFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDoge3N0YXRlLlFYTUwuX2hlaWdodCAtIDQwfXB4O1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDoge3N0YXRlLlFYTUwuX3dpZHRofXB4O1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBpZD17c3RhdGUuUVhNTC5faWQgKyBcIlByZXZpZXdcIn0gXG4gICAgICAgICAgICAgICAgZGF0YS11c2VyYW5zPXtzdGF0ZS51c2VyQW5zX2RhdGF9XG4gICAgICAgICAgICAgICAgZGF0YS1hbnNrZXk9e3N0YXRlLlFYTUwuX2Fuc2tleX1cbiAgICAgICAgICAgICAgICB0eXBlPXtzdGF0ZS5RWE1MLl90eXBlfSBcbiAgICAgICAgICAgICAgICBjbGFzcz17XCJkcmFnLXJlc2l6ZSBkcm9wYWJsZSBcIiArIHN0YXRlLlFYTUwuX3R5cGV9XG4gICAgICAgICAgICAgICAgZGF0YS14dGlja2Rpc3RhbmNlPXtzdGF0ZS5RWE1MLl94dGlja2Rpc3RhbmNlfVxuICAgICAgICAgICAgICAgIGRhdGEteXRpY2tkaXN0YW5jZT17c3RhdGUuUVhNTC5feXRpY2tkaXN0YW5jZX0gXG4gICAgICAgICAgICAgICAgZGF0YS14YXhpcz17c3RhdGUuUVhNTC5feGF4aXN9IFxuICAgICAgICAgICAgICAgIGRhdGEteWF4aXM9e3N0YXRlLlFYTUwuX3lheGlzfSBcbiAgICAgICAgICAgICAgICBkYXRhLXNuYXBzaXplPXtzdGF0ZS5RWE1MLl9zbmFwc2l6ZX0gXG4gICAgICAgICAgICAgICAgZGF0YS1lcXVhdGlvbj17c3RhdGUuUVhNTC5fZXF1YXRpb259XG4gICAgICAgICAgICAgICAgc3R5bGUgPSBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHtzdGF0ZS5RWE1MLl9oZWlnaHQgLSA0MH1weDtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHtzdGF0ZS5RWE1MLl93aWR0aH1weDtcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICB7L2lmfVxuICAgICAgICA8dWwgY2xhc3M9XCJmb290ZXJfdG9vbGJveCBoXCI+XG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJidG5fYWN0aXZlIGJ0bi1wb2ludFwiIHJlbD1cInBvaW50XCIgZGF0YS12YWx1ZT1cIlBcIj48L2xpPlxuICAgICAgICAgICAgPGxpIHJlbD1cInNlZ21lbnRcIiBjbGFzcz1cImJ0bi1zZWdtZW50XCIgZGF0YS12YWx1ZT1cIlNcIj48L2xpPlxuICAgICAgICAgICAgPGxpIHJlbD1cInNlZ21lbnRfbGVmdF9wb2ludF9ob2xsb3dcIiBjbGFzcz1cImJ0bi1TTEhcIiBkYXRhLXZhbHVlPVwiU0xIXCI+PC9saT5cbiAgICAgICAgICAgIDxsaSByZWw9XCJzZWdtZW50X3JpZ2h0X3BvaW50X2hvbGxvd1wiIGNsYXNzPVwiYnRuLVNSSFwiIGRhdGEtdmFsdWU9XCJTUkhcIj48L2xpPlxuICAgICAgICAgICAgPGxpIHJlbD1cInNlZ21lbnRfYm90aF9wb2ludF9ob2xsb3dcIiBjbGFzcz1cImJ0bi1TQkhcIiBkYXRhLXZhbHVlPVwiU0JIXCI+PC9saT5cbiAgICAgICAgICAgIDxsaSByZWw9XCJyYXlfbGVmdF9kaXJlY3Rpb25cIiBjbGFzcz1cImJ0bi1STFwiIGRhdGEtdmFsdWU9XCJSTFwiPjwvbGk+XG4gICAgICAgICAgICA8bGkgcmVsPVwicmF5X3JpZ2h0X2RpcmVjdGlvblwiIGNsYXNzPVwiYnRuLVJSXCIgZGF0YS12YWx1ZT1cIlJSXCI+PC9saT5cbiAgICAgICAgICAgIDxsaSByZWw9XCJyYXlfbGVmdF9kaXJlY3Rpb25fcmlnaHRfaG9sbG93XCIgY2xhc3M9XCJidG4tUlJIXCIgZGF0YS12YWx1ZT1cIlJSSFwiPjwvbGk+XG4gICAgICAgICAgICA8bGkgcmVsPVwicmF5X3JpZ2h0X2RpcmVjdGlvbl9sZWZ0X2hvbGxvd1wiIGNsYXNzPVwiYnRuLVJMSFwiIGRhdGEtdmFsdWU9XCJSTEhcIj48L2xpPlx0XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvY2VudGVyPlxuXG4gICAgPGRpdiBpZD1cImdyYXBoX21vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgdGFiSW5kZXg9XCItMVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nIG1vZGFsLWRpYWxvZy1jZW50ZXJlZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+e2wuc2V0X2Fuc308L2g1PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsb2F0LWVuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1saWdodFwiIGlkPVwidXBkYXRlUm93XCIgb246Y2xpY2s9eygpPT4ge3VwZGF0ZVJvdyhcImFkZFwiKX19PntsLmFkZF9wb2ludH08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tbGlnaHQgbWwtMVwiIGlkPVwiZGVsZXRlX2J0blwiIG9uOmNsaWNrPXsoKT0+IHt1cGRhdGVSb3coXCJyZW1vdmVcIil9fT57bC5kZWxfcm93fTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IG92ZXJmbG93LXlcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoICBzdGF0ZS5tb2RhbFZpZXdMYXlvdXQgYXMgZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIGRhdGEubW9kdWxlVHlwZSA9PSAnY2lyY2xlJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBtYWluRGl2IG10LTRcIiBrZXk9e1wiZGl2QWxsVGV4dEJveFwiICsgKGRhdGEuaW5kZXgpfSBpZD17XCJkaXZBbGxUZXh0Qm94XCIgKyAoZGF0YS5pbmRleCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1qdXN0aWZ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1sLTIgdGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bC5wb2ludHggKyAoZGF0YS5pbmRleCArIDEpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiByZXNldFZhbHVlPVwiMVwiIGNsYXNzPVwicG9pbnRfeF8xIGdldEZpZWxkVmFsIGZvcm0tY29udHJvbCBcIiBpZD1cInNldEFuc0J5S2V5XCIgcGxhY2Vob2xkZXI9e2wuaW5zZXJ0X251bWVyaWNfZGF0YX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJtbC0yIHRleHQtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2wucG9pbnR5ICsgKGRhdGEuaW5kZXggKyAxKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cInBvaW50X3lfMSBnZXRGaWVsZFZhbCBmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj17bC5pbnNlcnRfbnVtZXJpY19kYXRhfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIlJhZGl1cyBcIiArIChkYXRhLmluZGV4ICsgMSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cInBvaW50X3hfMiBnZXRGaWVsZFZhbCBmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj17bC5pbnNlcnRfbnVtZXJpY19kYXRhfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OmVsc2UgaWYgZGF0YS5tb2R1bGVUeXBlID09ICdhc3NvY2lhdGlvbicgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG1haW5EaXYgbXQtMlwiIGtleT17XCJkaXZBbGxUZXh0Qm94XCIgKyAoZGF0YS5pbmRleCl9IGlkPXtcImRpdkFsbFRleHRCb3hcIiArIChkYXRhLmluZGV4KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWp1c3RpZnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm1sLTIgdGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bC5wb2ludHggKyAoZGF0YS5pbmRleCArIDEpfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cImFzc29jaWF0aW9uX3hfcG9pbnQgZ2V0RmllbGRWYWwgZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9e2wuaW5zZXJ0X251bWVyaWNfZGF0YX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJtbC0yIHRleHQtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2wucG9pbnR5ICsgKGRhdGEuaW5kZXggKyAxKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgdmFsdWU9XCIwLjRcIiBkaXNhYmxlZD1cImRpc2FibGVkXCIgY2xhc3M9XCJwb2ludF95XzEgcGUtbm9uZSBnZXRGaWVsZFZhbCBmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj17bC5pbnNlcnRfbnVtZXJpY19kYXRhfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsLnBvaW50eDJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cImFzc29jaWF0aW9uX3BvaW50IGdldEZpZWxkVmFsIGZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPXtsLmluc2VydF9udW1lcmljX2RhdGF9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6ZWxzZSBpZiBkYXRhLm1vZHVsZVR5cGUgPT0gJ3BvaW50JyB8fCBkYXRhLm1vZHVsZVR5cGUgPT0gJ3BvbHlnb24nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG1haW5EaXYgbXQtMlwiIGtleT17XCJkaXZBbGxUZXh0Qm94XCIgKyAoZGF0YS5pbmRleCl9IGlkPXtcImRpdkFsbFRleHRCb3hcIiArIChkYXRhLmluZGV4KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsLnBvaW50eCArIChkYXRhLmluZGV4ICsgMSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnZXRGaWVsZFZhbFwiIG5hbWU9e1wicG9pbnRfXCIgKyAoZGF0YS5pbmRleCl9IGlkPXtcInhfXCIgKyAoZGF0YS5pbmRleCl9IHBsYWNlaG9sZGVyPXtsLmluc2VydF9udW1lcmljX2RhdGF9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1sLTIgdGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsLnBvaW50eSArIChkYXRhLmluZGV4ICsgMSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnZXRGaWVsZFZhbFwiIG5hbWU9e1wicG9pbnRfXCIgKyAoZGF0YS5pbmRleCl9IGlkPXtcInlfXCIgKyAoZGF0YS5pbmRleCl9IHBsYWNlaG9sZGVyPXtsLmluc2VydF9udW1lcmljX2RhdGF9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBtYWluRGl2IG10LTRcIiBrZXk9e1wiZGl2QWxsVGV4dEJveFwiICsgKGRhdGEuaW5kZXgpfSBpZD17XCJkaXZBbGxUZXh0Qm94XCIgKyAoZGF0YS5pbmRleCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bC5wb2ludHgxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIHJlc2V0VmFsdWU9XCIxXCIgY2xhc3M9XCJwb2ludF94XzEgZ2V0RmllbGRWYWwgZm9ybS1jb250cm9sXCIgaWQ9XCJzZXRBbnNCeUtleVwiIHBsYWNlaG9sZGVyPXtsLmluc2VydF9udW1lcmljX2RhdGF9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1sLTIgdGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsLnBvaW50eTF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cInBvaW50X3lfMSBnZXRGaWVsZFZhbCBmb3JtLWNvbnRyb2xcIiBpZD1cInNldEFuc0J5S2V5XCIgcGxhY2Vob2xkZXI9e2wuaW5zZXJ0X251bWVyaWNfZGF0YX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsLnBvaW50eDJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcmVzZXRWYWx1ZT1cIjFcIiBjbGFzcz1cInBvaW50X3hfMiBnZXRGaWVsZFZhbCBmb3JtLWNvbnRyb2xcIiBpZD1cInNldEFuc0J5S2V5XCIgcGxhY2Vob2xkZXI9e2wuaW5zZXJ0X251bWVyaWNfZGF0YX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwibWwtMiB0ZXh0LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2wucG9pbnR5Mn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiByZXNldFZhbHVlPVwiMVwiIGNsYXNzPVwicG9pbnRfeV8yIGdldEZpZWxkVmFsIGZvcm0tY29udHJvbFwiIGlkPVwic2V0QW5zQnlLZXlcIiBwbGFjZWhvbGRlcj17bC5pbnNlcnRfbnVtZXJpY19kYXRhfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxuICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saWdodFwiIGRhdGEtYnMtZGlzbWlzcz1cIm1vZGFsXCI+e2wuY2FuY2VsfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgb246Y2xpY2s9e21vZGlmeVV4bWxPbktleX0+e2wub2tfYnRufTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgICAjZ3JhcGhfbW9kYWwgLm1vZGFsLWJvZHkge1xuICAgICAgICBtYXgtaGVpZ2h0OiAzNTBweDtcbiAgICB9XG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3a0JJLDBCQUFZLENBQUMsV0FBVyxjQUFDLENBQUMsQUFDdEIsVUFBVSxDQUFFLEtBQUssQUFDckIsQ0FBQyJ9 */";
	append_dev(document_1.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[23] = list[i];
	return child_ctx;
}

// (443:8) {:else}
function create_else_block_1(ctx) {
	let div;
	let div_id_value;
	let div_data_userans_value;
	let div_data_anskey_value;
	let div_type_value;
	let div_class_value;
	let div_data_xtickdistance_value;
	let div_data_ytickdistance_value;
	let div_data_xaxis_value;
	let div_data_yaxis_value;
	let div_data_snapsize_value;
	let div_data_equation_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "id", div_id_value = /*state*/ ctx[1].QXML._id + "Preview");
			attr_dev(div, "data-userans", div_data_userans_value = /*state*/ ctx[1].userAns_data);
			attr_dev(div, "data-anskey", div_data_anskey_value = /*state*/ ctx[1].QXML._anskey);
			attr_dev(div, "type", div_type_value = /*state*/ ctx[1].QXML._type);
			attr_dev(div, "class", div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type);
			attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance);
			attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance);
			attr_dev(div, "data-xaxis", div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis);
			attr_dev(div, "data-yaxis", div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis);
			attr_dev(div, "data-snapsize", div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize);
			attr_dev(div, "data-equation", div_data_equation_value = /*state*/ ctx[1].QXML._equation);
			set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
			set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
			set_style(div, "border", "1px solid #ccc");
			add_location(div, file, 443, 12, 17993);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 2 && div_id_value !== (div_id_value = /*state*/ ctx[1].QXML._id + "Preview")) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*state*/ 2 && div_data_userans_value !== (div_data_userans_value = /*state*/ ctx[1].userAns_data)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}

			if (dirty & /*state*/ 2 && div_data_anskey_value !== (div_data_anskey_value = /*state*/ ctx[1].QXML._anskey)) {
				attr_dev(div, "data-anskey", div_data_anskey_value);
			}

			if (dirty & /*state*/ 2 && div_type_value !== (div_type_value = /*state*/ ctx[1].QXML._type)) {
				attr_dev(div, "type", div_type_value);
			}

			if (dirty & /*state*/ 2 && div_class_value !== (div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type)) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*state*/ 2 && div_data_xtickdistance_value !== (div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance)) {
				attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value);
			}

			if (dirty & /*state*/ 2 && div_data_ytickdistance_value !== (div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance)) {
				attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value);
			}

			if (dirty & /*state*/ 2 && div_data_xaxis_value !== (div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis)) {
				attr_dev(div, "data-xaxis", div_data_xaxis_value);
			}

			if (dirty & /*state*/ 2 && div_data_yaxis_value !== (div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis)) {
				attr_dev(div, "data-yaxis", div_data_yaxis_value);
			}

			if (dirty & /*state*/ 2 && div_data_snapsize_value !== (div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize)) {
				attr_dev(div, "data-snapsize", div_data_snapsize_value);
			}

			if (dirty & /*state*/ 2 && div_data_equation_value !== (div_data_equation_value = /*state*/ ctx[1].QXML._equation)) {
				attr_dev(div, "data-equation", div_data_equation_value);
			}

			if (dirty & /*state*/ 2) {
				set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
			}

			if (dirty & /*state*/ 2) {
				set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(443:8) {:else}",
		ctx
	});

	return block;
}

// (423:8) {#if state.QXML._reflection}
function create_if_block_3(ctx) {
	let div;
	let div_id_value;
	let div_data_userans_value;
	let div_data_anskey_value;
	let div_type_value;
	let div_class_value;
	let div_data_xtickdistance_value;
	let div_data_ytickdistance_value;
	let div_data_xaxis_value;
	let div_data_yaxis_value;
	let div_data_snapsize_value;
	let div_data_equation_value;
	let div_data_reflection_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "id", div_id_value = /*state*/ ctx[1].QXML._id + "Preview");
			attr_dev(div, "data-userans", div_data_userans_value = /*state*/ ctx[1].userAns_data);
			attr_dev(div, "data-anskey", div_data_anskey_value = /*state*/ ctx[1].QXML._anskey);
			attr_dev(div, "type", div_type_value = /*state*/ ctx[1].QXML._type);
			attr_dev(div, "class", div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type);
			attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance);
			attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance);
			attr_dev(div, "data-xaxis", div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis);
			attr_dev(div, "data-yaxis", div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis);
			attr_dev(div, "data-snapsize", div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize);
			attr_dev(div, "data-equation", div_data_equation_value = /*state*/ ctx[1].QXML._equation);
			attr_dev(div, "data-reflection", div_data_reflection_value = /*state*/ ctx[1].QXML._reflection);
			set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
			set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
			set_style(div, "border", "1px solid #ccc");
			add_location(div, file, 423, 12, 17100);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 2 && div_id_value !== (div_id_value = /*state*/ ctx[1].QXML._id + "Preview")) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty & /*state*/ 2 && div_data_userans_value !== (div_data_userans_value = /*state*/ ctx[1].userAns_data)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}

			if (dirty & /*state*/ 2 && div_data_anskey_value !== (div_data_anskey_value = /*state*/ ctx[1].QXML._anskey)) {
				attr_dev(div, "data-anskey", div_data_anskey_value);
			}

			if (dirty & /*state*/ 2 && div_type_value !== (div_type_value = /*state*/ ctx[1].QXML._type)) {
				attr_dev(div, "type", div_type_value);
			}

			if (dirty & /*state*/ 2 && div_class_value !== (div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type)) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*state*/ 2 && div_data_xtickdistance_value !== (div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance)) {
				attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value);
			}

			if (dirty & /*state*/ 2 && div_data_ytickdistance_value !== (div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance)) {
				attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value);
			}

			if (dirty & /*state*/ 2 && div_data_xaxis_value !== (div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis)) {
				attr_dev(div, "data-xaxis", div_data_xaxis_value);
			}

			if (dirty & /*state*/ 2 && div_data_yaxis_value !== (div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis)) {
				attr_dev(div, "data-yaxis", div_data_yaxis_value);
			}

			if (dirty & /*state*/ 2 && div_data_snapsize_value !== (div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize)) {
				attr_dev(div, "data-snapsize", div_data_snapsize_value);
			}

			if (dirty & /*state*/ 2 && div_data_equation_value !== (div_data_equation_value = /*state*/ ctx[1].QXML._equation)) {
				attr_dev(div, "data-equation", div_data_equation_value);
			}

			if (dirty & /*state*/ 2 && div_data_reflection_value !== (div_data_reflection_value = /*state*/ ctx[1].QXML._reflection)) {
				attr_dev(div, "data-reflection", div_data_reflection_value);
			}

			if (dirty & /*state*/ 2) {
				set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
			}

			if (dirty & /*state*/ 2) {
				set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(423:8) {#if state.QXML._reflection}",
		ctx
	});

	return block;
}

// (550:28) {:else}
function create_else_block(ctx) {
	let div1;
	let div0;
	let label0;
	let t0_value = Lang.pointx1 + "";
	let t0;
	let t1;
	let input0;
	let input0_placeholder_value;
	let t2;
	let label1;
	let t3_value = Lang.pointy1 + "";
	let t3;
	let t4;
	let input1;
	let input1_placeholder_value;
	let t5;
	let label2;
	let t6_value = Lang.pointx2 + "";
	let t6;
	let t7;
	let input2;
	let input2_placeholder_value;
	let t8;
	let label3;
	let t9_value = Lang.pointy2 + "";
	let t9;
	let t10;
	let input3;
	let input3_placeholder_value;
	let t11;
	let div1_key_value;
	let div1_id_value;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			label0 = element("label");
			t0 = text(t0_value);
			t1 = space();
			input0 = element("input");
			t2 = space();
			label1 = element("label");
			t3 = text(t3_value);
			t4 = space();
			input1 = element("input");
			t5 = space();
			label2 = element("label");
			t6 = text(t6_value);
			t7 = space();
			input2 = element("input");
			t8 = space();
			label3 = element("label");
			t9 = text(t9_value);
			t10 = space();
			input3 = element("input");
			t11 = space();
			attr_dev(input0, "type", "number");
			attr_dev(input0, "resetvalue", "1");
			attr_dev(input0, "class", "point_x_1 getFieldVal form-control");
			attr_dev(input0, "id", "setAnsByKey");
			attr_dev(input0, "placeholder", input0_placeholder_value = Lang.insert_numeric_data);
			add_location(input0, file, 554, 44, 25623);
			attr_dev(label0, "class", "text-body");
			add_location(label0, file, 552, 40, 25497);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "resetvalue", "1");
			attr_dev(input1, "class", "point_y_1 getFieldVal form-control");
			attr_dev(input1, "id", "setAnsByKey");
			attr_dev(input1, "placeholder", input1_placeholder_value = Lang.insert_numeric_data);
			add_location(input1, file, 558, 44, 25977);
			attr_dev(label1, "class", "ml-2 text-body");
			add_location(label1, file, 556, 40, 25846);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "resetvalue", "1");
			attr_dev(input2, "class", "point_x_2 getFieldVal form-control");
			attr_dev(input2, "id", "setAnsByKey");
			attr_dev(input2, "placeholder", input2_placeholder_value = Lang.insert_numeric_data);
			add_location(input2, file, 562, 44, 26326);
			attr_dev(label2, "class", "text-body");
			add_location(label2, file, 560, 40, 26200);
			attr_dev(input3, "type", "number");
			attr_dev(input3, "resetvalue", "1");
			attr_dev(input3, "class", "point_y_2 getFieldVal form-control");
			attr_dev(input3, "id", "setAnsByKey");
			attr_dev(input3, "placeholder", input3_placeholder_value = Lang.insert_numeric_data);
			add_location(input3, file, 566, 44, 26680);
			attr_dev(label3, "class", "ml-2 text-body");
			add_location(label3, file, 564, 40, 26549);
			attr_dev(div0, "class", "col-12 text-center");
			add_location(div0, file, 551, 36, 25424);
			attr_dev(div1, "class", "row mainDiv mt-4");
			attr_dev(div1, "key", div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
			attr_dev(div1, "id", div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
			add_location(div1, file, 550, 32, 25284);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, label0);
			append_dev(label0, t0);
			append_dev(label0, t1);
			append_dev(label0, input0);
			append_dev(div0, t2);
			append_dev(div0, label1);
			append_dev(label1, t3);
			append_dev(label1, t4);
			append_dev(label1, input1);
			append_dev(div0, t5);
			append_dev(div0, label2);
			append_dev(label2, t6);
			append_dev(label2, t7);
			append_dev(label2, input2);
			append_dev(div0, t8);
			append_dev(div0, label3);
			append_dev(label3, t9);
			append_dev(label3, t10);
			append_dev(label3, input3);
			append_dev(div1, t11);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 2 && div1_key_value !== (div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div1, "key", div1_key_value);
			}

			if (dirty & /*state*/ 2 && div1_id_value !== (div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div1, "id", div1_id_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(550:28) {:else}",
		ctx
	});

	return block;
}

// (537:97) 
function create_if_block_2(ctx) {
	let div1;
	let div0;
	let label0;
	let t0_value = Lang.pointx + (/*data*/ ctx[23].index + 1) + "";
	let t0;
	let t1;
	let input0;
	let input0_name_value;
	let input0_id_value;
	let input0_placeholder_value;
	let t2;
	let label1;
	let t3_value = Lang.pointy + (/*data*/ ctx[23].index + 1) + "";
	let t3;
	let t4;
	let input1;
	let input1_name_value;
	let input1_id_value;
	let input1_placeholder_value;
	let t5;
	let div1_key_value;
	let div1_id_value;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			label0 = element("label");
			t0 = text(t0_value);
			t1 = space();
			input0 = element("input");
			t2 = space();
			label1 = element("label");
			t3 = text(t3_value);
			t4 = space();
			input1 = element("input");
			t5 = space();
			attr_dev(input0, "type", "number");
			attr_dev(input0, "resetvalue", "1");
			attr_dev(input0, "class", "form-control getFieldVal");
			attr_dev(input0, "name", input0_name_value = "point_" + /*data*/ ctx[23].index);
			attr_dev(input0, "id", input0_id_value = "x_" + /*data*/ ctx[23].index);
			attr_dev(input0, "placeholder", input0_placeholder_value = Lang.insert_numeric_data);
			add_location(input0, file, 541, 44, 24521);
			attr_dev(label0, "class", "text-body");
			add_location(label0, file, 539, 40, 24377);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "resetvalue", "1");
			attr_dev(input1, "class", "form-control getFieldVal");
			attr_dev(input1, "name", input1_name_value = "point_" + /*data*/ ctx[23].index);
			attr_dev(input1, "id", input1_id_value = "y_" + /*data*/ ctx[23].index);
			attr_dev(input1, "placeholder", input1_placeholder_value = Lang.insert_numeric_data);
			add_location(input1, file, 545, 44, 24922);
			attr_dev(label1, "class", "ml-2 text-body");
			add_location(label1, file, 543, 40, 24773);
			attr_dev(div0, "class", "col-12 text-center");
			add_location(div0, file, 538, 36, 24304);
			attr_dev(div1, "class", "row mainDiv mt-2");
			attr_dev(div1, "key", div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
			attr_dev(div1, "id", div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
			add_location(div1, file, 537, 32, 24164);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, label0);
			append_dev(label0, t0);
			append_dev(label0, t1);
			append_dev(label0, input0);
			append_dev(div0, t2);
			append_dev(div0, label1);
			append_dev(label1, t3);
			append_dev(label1, t4);
			append_dev(label1, input1);
			append_dev(div1, t5);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 2 && t0_value !== (t0_value = Lang.pointx + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t0, t0_value);

			if (dirty & /*state*/ 2 && input0_name_value !== (input0_name_value = "point_" + /*data*/ ctx[23].index)) {
				attr_dev(input0, "name", input0_name_value);
			}

			if (dirty & /*state*/ 2 && input0_id_value !== (input0_id_value = "x_" + /*data*/ ctx[23].index)) {
				attr_dev(input0, "id", input0_id_value);
			}

			if (dirty & /*state*/ 2 && t3_value !== (t3_value = Lang.pointy + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t3, t3_value);

			if (dirty & /*state*/ 2 && input1_name_value !== (input1_name_value = "point_" + /*data*/ ctx[23].index)) {
				attr_dev(input1, "name", input1_name_value);
			}

			if (dirty & /*state*/ 2 && input1_id_value !== (input1_id_value = "y_" + /*data*/ ctx[23].index)) {
				attr_dev(input1, "id", input1_id_value);
			}

			if (dirty & /*state*/ 2 && div1_key_value !== (div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div1, "key", div1_key_value);
			}

			if (dirty & /*state*/ 2 && div1_id_value !== (div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div1, "id", div1_id_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(537:97) ",
		ctx
	});

	return block;
}

// (515:72) 
function create_if_block_1(ctx) {
	let div2;
	let div0;
	let span;
	let label0;
	let t0_value = Lang.pointx + (/*data*/ ctx[23].index + 1) + "";
	let t0;
	let t1;
	let input0;
	let input0_placeholder_value;
	let t2;
	let label1;
	let t3_value = Lang.pointy + (/*data*/ ctx[23].index + 1) + "";
	let t3;
	let t4;
	let input1;
	let input1_placeholder_value;
	let t5;
	let div1;
	let label2;
	let t6_value = Lang.pointx2 + "";
	let t6;
	let t7;
	let input2;
	let input2_placeholder_value;
	let t8;
	let div2_key_value;
	let div2_id_value;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			span = element("span");
			label0 = element("label");
			t0 = text(t0_value);
			t1 = space();
			input0 = element("input");
			t2 = space();
			label1 = element("label");
			t3 = text(t3_value);
			t4 = space();
			input1 = element("input");
			t5 = space();
			div1 = element("div");
			label2 = element("label");
			t6 = text(t6_value);
			t7 = space();
			input2 = element("input");
			t8 = space();
			attr_dev(input0, "type", "number");
			attr_dev(input0, "resetvalue", "1");
			attr_dev(input0, "class", "association_x_point getFieldVal form-control");
			attr_dev(input0, "placeholder", input0_placeholder_value = Lang.insert_numeric_data);
			add_location(input0, file, 521, 48, 22876);
			attr_dev(label0, "class", "ml-2 text-body");
			add_location(label0, file, 518, 44, 22670);
			attr_dev(input1, "type", "number");
			input1.value = "0.4";
			input1.disabled = "disabled";
			attr_dev(input1, "class", "point_y_1 pe-none getFieldVal form-control");
			attr_dev(input1, "placeholder", input1_placeholder_value = Lang.insert_numeric_data);
			add_location(input1, file, 525, 48, 23257);
			attr_dev(label1, "class", "ml-2 text-body");
			add_location(label1, file, 523, 44, 23100);
			attr_dev(span, "class", "text-justify");
			add_location(span, file, 517, 40, 22598);
			attr_dev(div0, "class", "col-12 text-center");
			add_location(div0, file, 516, 36, 22525);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "resetvalue", "1");
			attr_dev(input2, "class", "association_point getFieldVal form-control");
			attr_dev(input2, "placeholder", input2_placeholder_value = Lang.insert_numeric_data);
			add_location(input2, file, 532, 44, 23778);
			attr_dev(label2, "class", "text-body");
			add_location(label2, file, 530, 40, 23652);
			attr_dev(div1, "class", "col-12 text-center");
			add_location(div1, file, 529, 36, 23579);
			attr_dev(div2, "class", "row mainDiv mt-2");
			attr_dev(div2, "key", div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
			attr_dev(div2, "id", div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
			add_location(div2, file, 515, 32, 22385);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, span);
			append_dev(span, label0);
			append_dev(label0, t0);
			append_dev(label0, t1);
			append_dev(label0, input0);
			append_dev(span, t2);
			append_dev(span, label1);
			append_dev(label1, t3);
			append_dev(label1, t4);
			append_dev(label1, input1);
			append_dev(div2, t5);
			append_dev(div2, div1);
			append_dev(div1, label2);
			append_dev(label2, t6);
			append_dev(label2, t7);
			append_dev(label2, input2);
			append_dev(div2, t8);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 2 && t0_value !== (t0_value = Lang.pointx + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t0, t0_value);
			if (dirty & /*state*/ 2 && t3_value !== (t3_value = Lang.pointy + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t3, t3_value);

			if (dirty & /*state*/ 2 && div2_key_value !== (div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div2, "key", div2_key_value);
			}

			if (dirty & /*state*/ 2 && div2_id_value !== (div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div2, "id", div2_id_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(515:72) ",
		ctx
	});

	return block;
}

// (494:28) {#if data.moduleType == 'circle'}
function create_if_block(ctx) {
	let div2;
	let div0;
	let span;
	let label0;
	let t0_value = Lang.pointx + (/*data*/ ctx[23].index + 1) + "";
	let t0;
	let t1;
	let input0;
	let input0_placeholder_value;
	let t2;
	let label1;
	let t3_value = Lang.pointy + (/*data*/ ctx[23].index + 1) + "";
	let t3;
	let t4;
	let input1;
	let input1_placeholder_value;
	let t5;
	let div1;
	let label2;
	let t6_value = "Radius " + (/*data*/ ctx[23].index + 1) + "";
	let t6;
	let t7;
	let input2;
	let input2_placeholder_value;
	let t8;
	let div2_key_value;
	let div2_id_value;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			span = element("span");
			label0 = element("label");
			t0 = text(t0_value);
			t1 = space();
			input0 = element("input");
			t2 = space();
			label1 = element("label");
			t3 = text(t3_value);
			t4 = space();
			input1 = element("input");
			t5 = space();
			div1 = element("div");
			label2 = element("label");
			t6 = text(t6_value);
			t7 = space();
			input2 = element("input");
			t8 = space();
			attr_dev(input0, "type", "number");
			attr_dev(input0, "resetvalue", "1");
			attr_dev(input0, "class", "point_x_1 getFieldVal form-control ");
			attr_dev(input0, "id", "setAnsByKey");
			attr_dev(input0, "placeholder", input0_placeholder_value = Lang.insert_numeric_data);
			add_location(input0, file, 499, 48, 21128);
			attr_dev(label0, "class", "ml-2 text-body");
			add_location(label0, file, 497, 44, 20971);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "resetvalue", "1");
			attr_dev(input1, "class", "point_y_1 getFieldVal form-control");
			attr_dev(input1, "placeholder", input1_placeholder_value = Lang.insert_numeric_data);
			add_location(input1, file, 503, 48, 21517);
			attr_dev(label1, "class", "ml-2 text-body");
			add_location(label1, file, 501, 44, 21360);
			attr_dev(span, "class", "text-justify");
			add_location(span, file, 496, 40, 20899);
			attr_dev(div0, "class", "col-12 text-center");
			add_location(div0, file, 495, 36, 20826);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "resetvalue", "1");
			attr_dev(input2, "class", "point_x_2 getFieldVal form-control");
			attr_dev(input2, "placeholder", input2_placeholder_value = Lang.insert_numeric_data);
			add_location(input2, file, 510, 44, 22032);
			attr_dev(label2, "class", "text-body");
			add_location(label2, file, 508, 40, 21887);
			attr_dev(div1, "class", "col-12 text-center");
			add_location(div1, file, 507, 36, 21814);
			attr_dev(div2, "class", "row mainDiv mt-4");
			attr_dev(div2, "key", div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
			attr_dev(div2, "id", div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
			add_location(div2, file, 494, 32, 20686);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, span);
			append_dev(span, label0);
			append_dev(label0, t0);
			append_dev(label0, t1);
			append_dev(label0, input0);
			append_dev(span, t2);
			append_dev(span, label1);
			append_dev(label1, t3);
			append_dev(label1, t4);
			append_dev(label1, input1);
			append_dev(div2, t5);
			append_dev(div2, div1);
			append_dev(div1, label2);
			append_dev(label2, t6);
			append_dev(label2, t7);
			append_dev(label2, input2);
			append_dev(div2, t8);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 2 && t0_value !== (t0_value = Lang.pointx + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t0, t0_value);
			if (dirty & /*state*/ 2 && t3_value !== (t3_value = Lang.pointy + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t3, t3_value);
			if (dirty & /*state*/ 2 && t6_value !== (t6_value = "Radius " + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t6, t6_value);

			if (dirty & /*state*/ 2 && div2_key_value !== (div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div2, "key", div2_key_value);
			}

			if (dirty & /*state*/ 2 && div2_id_value !== (div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
				attr_dev(div2, "id", div2_id_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(494:28) {#if data.moduleType == 'circle'}",
		ctx
	});

	return block;
}

// (493:24) {#each  state.modalViewLayout as data}
function create_each_block(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*data*/ ctx[23].moduleType == "circle") return create_if_block;
		if (/*data*/ ctx[23].moduleType == "association") return create_if_block_1;
		if (/*data*/ ctx[23].moduleType == "point" || /*data*/ ctx[23].moduleType == "polygon") return create_if_block_2;
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
		id: create_each_block.name,
		type: "each",
		source: "(493:24) {#each  state.modalViewLayout as data}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div13;
	let link;
	let link_href_value;
	let t0;
	let center;
	let itemhelper;
	let t1;
	let div2;
	let div1;
	let ul0;
	let li0;
	let t2_value = /*state*/ ctx[1].QXML._type + "";
	let t2;
	let t3;
	let button0;
	let span0;
	let span0_title_value;
	let button0_aria_label_value;
	let t4;
	let div0;
	let button1;
	let span1;
	let span1_title_value;
	let span1_class_value;
	let button1_aria_label_value;
	let t5;
	let t6;
	let ul1;
	let li1;
	let t7;
	let li2;
	let t8;
	let li3;
	let t9;
	let li4;
	let t10;
	let li5;
	let t11;
	let li6;
	let t12;
	let li7;
	let t13;
	let li8;
	let t14;
	let li9;
	let t15;
	let div12;
	let div11;
	let div10;
	let div6;
	let h5;
	let t17;
	let div5;
	let div4;
	let div3;
	let button2;
	let t19;
	let button3;
	let t21;
	let div8;
	let div7;
	let t22;
	let div9;
	let button4;
	let t24;
	let button5;
	let current;
	let mounted;
	let dispose;

	itemhelper = new ItemHelper({
			props: {
				reviewMode: /*isReview*/ ctx[0],
				handleReviewClick: /*handleReviewMode*/ ctx[6]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[4]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[5]);

	function select_block_type(ctx, dirty) {
		if (/*state*/ ctx[1].QXML._reflection) return create_if_block_3;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);
	let each_value = /*state*/ ctx[1].modalViewLayout;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div13 = element("div");
			link = element("link");
			t0 = space();
			center = element("center");
			create_component(itemhelper.$$.fragment);
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			ul0 = element("ul");
			li0 = element("li");
			t2 = text(t2_value);
			t3 = space();
			button0 = element("button");
			span0 = element("span");
			t4 = space();
			div0 = element("div");
			button1 = element("button");
			span1 = element("span");
			t5 = space();
			if_block.c();
			t6 = space();
			ul1 = element("ul");
			li1 = element("li");
			t7 = space();
			li2 = element("li");
			t8 = space();
			li3 = element("li");
			t9 = space();
			li4 = element("li");
			t10 = space();
			li5 = element("li");
			t11 = space();
			li6 = element("li");
			t12 = space();
			li7 = element("li");
			t13 = space();
			li8 = element("li");
			t14 = space();
			li9 = element("li");
			t15 = space();
			div12 = element("div");
			div11 = element("div");
			div10 = element("div");
			div6 = element("div");
			h5 = element("h5");
			h5.textContent = `${Lang.set_ans}`;
			t17 = space();
			div5 = element("div");
			div4 = element("div");
			div3 = element("div");
			button2 = element("button");
			button2.textContent = `${Lang.add_point}`;
			t19 = space();
			button3 = element("button");
			button3.textContent = `${Lang.del_row}`;
			t21 = space();
			div8 = element("div");
			div7 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t22 = space();
			div9 = element("div");
			button4 = element("button");
			button4.textContent = `${Lang.cancel}`;
			t24 = space();
			button5 = element("button");
			button5.textContent = `${Lang.ok_btn}`;
			attr_dev(link, "onload", "this.rel='stylesheet'");
			attr_dev(link, "rel", "preload");
			attr_dev(link, "as", "style");
			attr_dev(link, "href", link_href_value = themeUrl + "pe-items/svelte/clsSMGraph/css/Math.min.css");
			add_location(link, file, 380, 4, 15348);
			li0.value = "plotgraph";
			attr_dev(li0, "class", "selected-option text-uppercase m-0");
			add_location(li0, file, 396, 16, 15994);
			attr_dev(ul0, "class", "controls");
			add_location(ul0, file, 395, 12, 15956);
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "title", span0_title_value = Lang.ada_graph_msg);
			attr_dev(span0, "class", "icomoon-keyboard-2 s2");
			add_location(span0, file, 404, 16, 16349);
			attr_dev(button0, "tabindex", "0");
			attr_dev(button0, "id", "ADA_button");
			attr_dev(button0, "class", "ADAButton float-start mt-1 btn w-auto h-auto p-1 btn-light ml");
			attr_dev(button0, "aria-label", button0_aria_label_value = Lang.ada_graph_msg);
			add_location(button0, file, 398, 12, 16113);
			attr_dev(span1, "title", span1_title_value = Lang.delete);
			attr_dev(span1, "data-bs-toggle", "tooltip");

			attr_dev(span1, "class", span1_class_value = window.inNative
			? "delete_button"
			: "icomoon-new-24px-delete-1");

			add_location(span1, file, 417, 20, 16862);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-1 focus_div");
			attr_dev(button1, "id", "delButton");
			attr_dev(button1, "data-placement", "right");
			attr_dev(button1, "tabindex", "0");
			attr_dev(button1, "aria-label", button1_aria_label_value = Lang.ada_message);
			add_location(button1, file, 409, 16, 16567);
			attr_dev(div0, "class", "btn-group tools delElem h-imp");
			add_location(div0, file, 406, 12, 16477);
			attr_dev(div1, "id", "option-toolbar");
			attr_dev(div1, "class", "text-dark");
			add_location(div1, file, 394, 8, 15900);
			attr_dev(li1, "class", "btn_active btn-point");
			attr_dev(li1, "rel", "point");
			attr_dev(li1, "data-value", "P");
			add_location(li1, file, 463, 12, 18863);
			attr_dev(li2, "rel", "segment");
			attr_dev(li2, "class", "btn-segment");
			attr_dev(li2, "data-value", "S");
			add_location(li2, file, 464, 12, 18941);
			attr_dev(li3, "rel", "segment_left_point_hollow");
			attr_dev(li3, "class", "btn-SLH");
			attr_dev(li3, "data-value", "SLH");
			add_location(li3, file, 465, 12, 19012);
			attr_dev(li4, "rel", "segment_right_point_hollow");
			attr_dev(li4, "class", "btn-SRH");
			attr_dev(li4, "data-value", "SRH");
			add_location(li4, file, 466, 12, 19099);
			attr_dev(li5, "rel", "segment_both_point_hollow");
			attr_dev(li5, "class", "btn-SBH");
			attr_dev(li5, "data-value", "SBH");
			add_location(li5, file, 467, 12, 19187);
			attr_dev(li6, "rel", "ray_left_direction");
			attr_dev(li6, "class", "btn-RL");
			attr_dev(li6, "data-value", "RL");
			add_location(li6, file, 468, 12, 19274);
			attr_dev(li7, "rel", "ray_right_direction");
			attr_dev(li7, "class", "btn-RR");
			attr_dev(li7, "data-value", "RR");
			add_location(li7, file, 469, 12, 19352);
			attr_dev(li8, "rel", "ray_left_direction_right_hollow");
			attr_dev(li8, "class", "btn-RRH");
			attr_dev(li8, "data-value", "RRH");
			add_location(li8, file, 470, 12, 19431);
			attr_dev(li9, "rel", "ray_right_direction_left_hollow");
			attr_dev(li9, "class", "btn-RLH");
			attr_dev(li9, "data-value", "RLH");
			add_location(li9, file, 471, 12, 19524);
			attr_dev(ul1, "class", "footer_toolbox h");
			add_location(ul1, file, 462, 8, 18821);
			attr_dev(div2, "id", "mathmain");
			attr_dev(div2, "class", "userAns position-relative bg-white");
			set_style(div2, "height", Number(/*state*/ ctx[1].QXML._height) + 2 + "px");
			set_style(div2, "width", /*state*/ ctx[1].QXML._width + "px");
			add_location(div2, file, 389, 8, 15701);
			add_location(center, file, 382, 4, 15485);
			attr_dev(h5, "class", "modal-title");
			add_location(h5, file, 480, 20, 19870);
			attr_dev(button2, "class", "btn btn-light");
			attr_dev(button2, "id", "updateRow");
			add_location(button2, file, 484, 32, 20078);
			attr_dev(button3, "class", "btn btn-light ml-1");
			attr_dev(button3, "id", "delete_btn");
			add_location(button3, file, 485, 32, 20213);
			attr_dev(div3, "class", "float-end");
			add_location(div3, file, 483, 28, 20022);
			attr_dev(div4, "class", "col-12");
			add_location(div4, file, 482, 24, 19973);
			attr_dev(div5, "class", "row");
			add_location(div5, file, 481, 20, 19931);
			attr_dev(div6, "class", "modal-header");
			add_location(div6, file, 479, 16, 19823);
			attr_dev(div7, "class", "row");
			add_location(div7, file, 491, 20, 20511);
			attr_dev(div8, "class", "modal-body overflow-y svelte-e5vip7");
			add_location(div8, file, 490, 16, 20455);
			attr_dev(button4, "type", "button");
			attr_dev(button4, "class", "btn btn-light");
			attr_dev(button4, "data-bs-dismiss", "modal");
			add_location(button4, file, 575, 20, 27124);
			attr_dev(button5, "type", "button");
			attr_dev(button5, "class", "btn btn-secondary");
			add_location(button5, file, 576, 20, 27232);
			attr_dev(div9, "class", "modal-footer");
			add_location(div9, file, 574, 16, 27077);
			attr_dev(div10, "class", "modal-content");
			add_location(div10, file, 478, 12, 19779);
			attr_dev(div11, "class", "modal-dialog modal-dialog-centered");
			add_location(div11, file, 477, 8, 19718);
			attr_dev(div12, "id", "graph_modal");
			attr_dev(div12, "class", "modal fade svelte-e5vip7");
			attr_dev(div12, "tabindex", "-1");
			add_location(div12, file, 476, 4, 19654);
			add_location(div13, file, 379, 0, 15338);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, link);
			append_dev(div13, t0);
			append_dev(div13, center);
			mount_component(itemhelper, center, null);
			append_dev(center, t1);
			append_dev(center, div2);
			append_dev(div2, div1);
			append_dev(div1, ul0);
			append_dev(ul0, li0);
			append_dev(li0, t2);
			append_dev(div1, t3);
			append_dev(div1, button0);
			append_dev(button0, span0);
			append_dev(div1, t4);
			append_dev(div1, div0);
			append_dev(div0, button1);
			append_dev(button1, span1);
			append_dev(div2, t5);
			if_block.m(div2, null);
			append_dev(div2, t6);
			append_dev(div2, ul1);
			append_dev(ul1, li1);
			append_dev(ul1, t7);
			append_dev(ul1, li2);
			append_dev(ul1, t8);
			append_dev(ul1, li3);
			append_dev(ul1, t9);
			append_dev(ul1, li4);
			append_dev(ul1, t10);
			append_dev(ul1, li5);
			append_dev(ul1, t11);
			append_dev(ul1, li6);
			append_dev(ul1, t12);
			append_dev(ul1, li7);
			append_dev(ul1, t13);
			append_dev(ul1, li8);
			append_dev(ul1, t14);
			append_dev(ul1, li9);
			append_dev(div13, t15);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div10);
			append_dev(div10, div6);
			append_dev(div6, h5);
			append_dev(div6, t17);
			append_dev(div6, div5);
			append_dev(div5, div4);
			append_dev(div4, div3);
			append_dev(div3, button2);
			append_dev(div3, t19);
			append_dev(div3, button3);
			append_dev(div10, t21);
			append_dev(div10, div8);
			append_dev(div8, div7);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div7, null);
			}

			append_dev(div10, t22);
			append_dev(div10, div9);
			append_dev(div9, button4);
			append_dev(div9, t24);
			append_dev(div9, button5);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button2, "click", /*click_handler*/ ctx[11], false, false, false),
					listen_dev(button3, "click", /*click_handler_1*/ ctx[12], false, false, false),
					listen_dev(button5, "click", /*modifyUxmlOnKey*/ ctx[2], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const itemhelper_changes = {};
			if (dirty & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if ((!current || dirty & /*state*/ 2) && t2_value !== (t2_value = /*state*/ ctx[1].QXML._type + "")) set_data_dev(t2, t2_value);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div2, t6);
				}
			}

			if (!current || dirty & /*state*/ 2) {
				set_style(div2, "height", Number(/*state*/ ctx[1].QXML._height) + 2 + "px");
			}

			if (!current || dirty & /*state*/ 2) {
				set_style(div2, "width", /*state*/ ctx[1].QXML._width + "px");
			}

			if (dirty & /*state, l*/ 2) {
				each_value = /*state*/ ctx[1].modalViewLayout;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div7, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
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
			if (detaching) detach_dev(div13);
			destroy_component(itemhelper);
			if_block.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
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
	validate_slots("GraphPreview", slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let { showAns } = $$props;
	let { editorState } = $$props;
	let state = {};

	let preview_store = writable({
		xml: "",
		QXML: "",
		userAns_data: "",
		moduleType: "none",
		noOfRow: 1,
		review: false,
		init: false,
		open: false,
		modalViewLayout: [],
		checked: true
	});

	const unsubscribe = preview_store.subscribe(value => {
		$$invalidate(1, state = value);
	});

	// functions responsible for loading the module
	beforeUpdate(async () => {
		if (!state.init) {
			if (typeof JXG == "object" && editorState) {
				$$invalidate(1, state.init = true, state);
			} else if (typeof editorState == "undefined") {
				AH.addScript("", themeUrl + "pe-items/svelte/clsSMGraph/lib/jsxgraph.min.js", {
					callback() {
						$$invalidate(1, state.init = true, state);
					}
				});
			}
		}

		if (editorState && editorState.stopPreviewUpdate) {
			$$invalidate(7, xml = AH.select("#special_module_xml").value);
		}

		if (state.init && state.xml != xml) {
			loadModule(xml);
		}
	});

	// functions responsible for doing the changes according to the xml
	afterUpdate(async () => {
		if (state.init) {
			if (state.xml != xml) {
				if (editorState) {
					// resetting the answer
					resetAdaModal();

					AH.find("#mathmain", "[id^=ID]").setAttribute("data-userans", "");
				}

				initModule();

				preview_store.update(item => {
					item.xml = xml;
					return item;
				});

				if (isReview && typeof editorState == "undefined") {
					setReview();
				}
			}

			if (state.review != isReview && editorState) {
				preview_store.update(item => {
					item.review = isReview;
					return item;
				});

				if (isReview) {
					GRAPH.modeOn(1);
					displayAns();
				} else {
					GRAPH.modeOn(0);
				}

				AH.selectAll("#mathmain #delButton.active", "removeClass", "active");
			}

			if (state.checked && typeof showAns == "undefined") {
				GRAPH.checkAns("#mathmain");
				$$invalidate(1, state.checked = false, state);
			}

			AH.enableBsAll("[data-bs-toggle=\"tooltip\"]", "Tooltip");
		}
	});

	// Responible for binding the events
	onMount(async () => {
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		AH.set("q_refresh", refreshModule);

		if (!editorState) {
			refreshModule();
		}

		AH.listen("body", "keydown", "#mathmain #delButton", function (current, event) {
			if (event.ctrlKey && event.altKey && (event.which == 49 || event.keyCode == 49)) {
				openModal();
			}
		});

		AH.listen("body", "keydown", "#mathmain #ADA_button", function (current, event) {
			if (event.keyCode == 13) {
				openModal();
			}
		});

		AH.listen("body", "click", "#mathmain", function (current, event) {
			if (event.target.parentNode.id != "delButton" && event.target.id != "ADA_button" && event.target.id != "delButton" && event.target.parentNode.id != "ADA_button" && event.target.id != "option-toolbar") {
				displayAns();
			}
		});

		AH.listen("body", "mouseup", "#mathmain", function (current, event) {
			if (event.target.parentNode.id != "delButton" && event.target.id != "ADA_button" && event.target.id != "delButton" && event.target.parentNode.id != "ADA_button" && event.target.id != "option-toolbar") {
				displayAns();
			}
		});

		AH.listen("body", "click", ".delElem", function (current) {
			let cur_elem = current.children[0];
			cur_elem.classList.toggle("active");

			if (AH.select(".selected-option").innerHTML == "point" || AH.select(".selected-option").innerHTML == "circle" || AH.select(".selected-option").innerHTML == "association") {
				if (cur_elem.classList.contains("active")) {
					swal(Lang.delete_msg);
					AH.find("#mathmain", "#ID0Preview").style.cursor = "pointer";
				} else {
					AH.find("#mathmain", "#ID0Preview").style.cursor = "default";
					cur_elem.style.color = "black";
				}
			} else if (cur_elem.classList.contains("active")) {
				cur_elem.style.color = "black";
				swal(Lang.last_delete_msg);

				AH.setCss(current, {
					backgroundColor: "transparent",
					boxShadow: "none"
				});

				AH.find("#mathmain", "#ID0Preview").style.cursor = "default";
			}
		});

		AH.listen("body", "click", "#mathmain .footer_toolbox li", function (current) {
			current.classList.add("btn_active");
			AH.selectAll(AH.siblings(current), "removeClass", "btn_active");
		});
	});

	// for refreshing the module
	function refreshModule() {
		if (typeof JXG != "undefined" && AH.select("#ID0Preview").nodeName && AH.select("#ID0Preview").offsetHeight) {
			initModule();
		}
	}

	// function for iniating module 
	function initModule() {
		GRAPH.readyThis("#mathmain");

		// called for update the graph on graph board
		GRAPH.showansdrag("#mathmain", "u", 1);

		/* allows user to perform the task and hides 'correct answer' and 'your answer' button */
		GRAPH.modeOn();
	}

	// responsible for showing the answer
	function displayAns() {
		// used for switch on next question in prepengine if current question is attempted
		ISSPECIALMODULEUSERXMLCHANGE = 1;

		// collect Correct or Incorrect which is returned by checkAns method 
		let ans = GRAPH.checkAns("#mathmain");

		if (editorState) {
			// shows the answer according to the value of its argument passed
			showAns(ans);
		}
	}

	// function responsible for loading the module
	function loadModule(loadXml) {
		loadXml = XMLToJSON(loadXml);
		parseXMLAuthoring(loadXml);
		let uaXML = {};

		if (uxml) {
			// converts the user answer xml value into json which is store in 'uxml'
			uaXML = XMLToJSON(uxml);

			if (uaXML && uaXML.smans && uaXML.smans.div && uaXML.smans.div._userAns) {
				preview_store.update(item => {
					item.userAns_data = uaXML.smans.div._userAns;
					return item;
				});
			}
		}
	}

	// function responsible for parsing the xml
	function parseXMLAuthoring(MYXML) {
		preview_store.update(item => {
			item.QXML = MYXML.smxml.plot;
			item.moduleType = MYXML.smxml.plot._type;
			return item;
		});
	}

	// function responsible for opening the modal
	function openModal() {
		AH.getBS("#graph_modal", "Modal").show();
		loadModalView();
		AH.selectAll("[resetValue=\"1\"]", "value", "");
	}

	// function for setting the uxml on key update
	function modifyUxmlOnKey() {
		let tempRowVal = [];
		let row;

		switch (state.moduleType) {
			case "circle":
				// selects all row
				row = document.querySelectorAll(".mainDiv");
				//var tempRowVal = [];
				row.forEach(function (item) {
					// selects all input field in perticular row
					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

					// creates array with input fields value which are defined for x and y co-ordinate and radius after separating comma and '/' which is required where it is suitable 
					let tempCol = [col[0].value + "," + col[1].value + "/" + col[2].value];

					// pushes the value of 'tempCol' array into array 'tempRowVal'
					tempRowVal.push(tempCol);
				});
				// updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|' 
				AH.find("#mathmain", "[id^=ID]").setAttribute("data-userans", tempRowVal.join("|"));
				// calls unsetReview method
				unsetReview();
				break;
			case "point":
			case "polygon":
				// selects the all rows available in ADA modal box
				row = document.querySelectorAll(".mainDiv");
				//var tempRowVal = [];
				row.forEach(function (item) {
					// selects all input field in perticular row
					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

					// creates array with input fields value which are defined for x and y co-ordinate
					let tempCol = [col[0].value + "," + col[1].value];

					// pushes the data of 'tempCol' in array 'tempRowVal'
					tempRowVal.push(tempCol);
				});
				// updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|' 
				AH.find("#mathmain", "[id^=ID]").setAttribute("data-userans", tempRowVal.join("|"));
				// calls unsetReview method
				unsetReview();
				break;
			case "sine":
			case "cosine":
			case "line":
			case "ray":
			case "segment":
			case "vector":
			case "parabola":
				row = document.querySelectorAll(".mainDiv");
				//var tempRowVal = [];
				row.forEach(function (item) {
					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

					// contains the array of value point x1, y1 and  x2, y2 separated with '|' from ADA dialog box
					let tempCol = [
						col[0].value + "," + col[1].value + "|" + col[2].value + "," + col[3].value
					];

					// pushes the data in 'tempRowVal' array
					tempRowVal.push(tempCol);
				});
				// updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|'
				AH.find("#mathmain", "[id^=ID]").setAttribute("data-userans", tempRowVal.join("|"));
				// calls unsetReview method
				unsetReview();
				break;
			case "association":
				// it is discarded by Pete sir
				row = document.querySelectorAll(".mainDiv");
				//var tempRowVal = [];
				row.forEach(function (item) {
					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
					let tempCol = [col[0].value + "," + col[1].value + "," + col[2].value];
					tempRowVal.push(tempCol);
				});
				AH.find("#mathmain", "[id^=ID]").setAttribute("data-userans", tempRowVal.join("|"));
				unsetReview();
				break;
		}

		displayAns();
		AH.getBS("#graph_modal", "Modal").hide();
	}

	// used for ADA and adds or removes the row 
	function updateRow(type) {
		if (type == "add") {
			// increases the row by 1 if 'add' button clicked
			$$invalidate(1, state.noOfRow = state.noOfRow + 1, state);
		} else if (type == "remove") {
			if (state.noOfRow == 1) {
				swal("Default row can't be deleted");
			} else {
				//  decreases the row by 1 if 'remove' button clicked and row is greater than 1
				$$invalidate(1, state.noOfRow = state.noOfRow - 1, state);
			}
		}

		loadModalView();
	}

	// loads the ADA modal box according to the value of state 'moduleType'
	function loadModalView() {
		let modalViewLayout = [];

		for (let index = 0; index < state.noOfRow; index++) {
			// pushes the value return by getRow method in array 'modalViewLayout'
			modalViewLayout = [...modalViewLayout, { moduleType: state.moduleType, index }];
		}

		preview_store.update(item => {
			item.modalViewLayout = modalViewLayout;
			return item;
		});
	}

	/* shows correct or incorrect message and correct answer and your answer button and does not allow user to perform the task */
	function setReview() {
		AH.selectAll("#mathmain #delButton.active", "removeClass", "active");
		$$invalidate(0, isReview = true);

		// does not allow user to perform the task and shows correct answer and your answer button
		GRAPH.modeOn("on");

		// shows the stroke and fill color of the point and graph
		GRAPH.showansdrag("#mathmain", "u", 1);

		// display the correct or incorrect 
		displayAns();
	}

	/* hides correct or incorrect message and correct answer and your answer button and allow user to perform the task removes red or green color of border of preview container */
	function unsetReview() {
		AH.selectAll("#mathmain #delButton.active", "removeClass", "active");
		$$invalidate(0, isReview = false);

		// allow user to perform the task
		GRAPH.modeOn();

		// does not show the point and graph stroke and fill color to indicate that answer is correct or incorrect, shows border color of preview container in gray color */
		GRAPH.showansdrag("#mathmain", "u", 0);
	}

	// function for handling the review mode
	function handleReviewMode(mode) {
		if (mode == "c") {
			GRAPH.showansdrag("#mathmain", "c", 1);
		} else if (mode == "u") {
			GRAPH.showansdrag("#mathmain", "u", 1);
		}
	}

	// function for resetting the modal
	function resetAdaModal() {
		$$invalidate(1, state.noOfRow = 1, state);
		AH.selectAll("[id^=divAllTextBox]:not([id=\"divAllTextBox0\"])", "remove");
		AI.selectAll(".getFieldVal:not(:disabled)", "value", "");
	}

	const writable_props = ["xml", "uxml", "isReview", "showAns", "editorState"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GraphPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		updateRow("add");
	};

	const click_handler_1 = () => {
		updateRow("remove");
	};

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(7, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(8, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(9, showAns = $$props.showAns);
		if ("editorState" in $$props) $$invalidate(10, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		beforeUpdate,
		onMount,
		l: Lang,
		writable,
		ItemHelper,
		XMLToJSON,
		AH,
		GRAPH,
		xml,
		uxml,
		isReview,
		showAns,
		editorState,
		state,
		preview_store,
		unsubscribe,
		refreshModule,
		initModule,
		displayAns,
		loadModule,
		parseXMLAuthoring,
		openModal,
		modifyUxmlOnKey,
		updateRow,
		loadModalView,
		setReview,
		unsetReview,
		handleReviewMode,
		resetAdaModal
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(7, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(8, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(9, showAns = $$props.showAns);
		if ("editorState" in $$props) $$invalidate(10, editorState = $$props.editorState);
		if ("state" in $$props) $$invalidate(1, state = $$props.state);
		if ("preview_store" in $$props) preview_store = $$props.preview_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		isReview,
		state,
		modifyUxmlOnKey,
		updateRow,
		setReview,
		unsetReview,
		handleReviewMode,
		xml,
		uxml,
		showAns,
		editorState,
		click_handler,
		click_handler_1
	];
}

class GraphPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-e5vip7-style")) add_css();

		init(this, options, instance, create_fragment, safe_not_equal, {
			xml: 7,
			uxml: 8,
			isReview: 0,
			showAns: 9,
			editorState: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "GraphPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[7] === undefined && !("xml" in props)) {
			console.warn("<GraphPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[8] === undefined && !("uxml" in props)) {
			console.warn("<GraphPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
			console.warn("<GraphPreview> was created without expected prop 'isReview'");
		}

		if (/*showAns*/ ctx[9] === undefined && !("showAns" in props)) {
			console.warn("<GraphPreview> was created without expected prop 'showAns'");
		}

		if (/*editorState*/ ctx[10] === undefined && !("editorState" in props)) {
			console.warn("<GraphPreview> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default GraphPreview;
//# sourceMappingURL=GraphPreview-7ab38628.js.map
