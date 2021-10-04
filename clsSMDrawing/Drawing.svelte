<!--
 *  File Name   : Drawing.svelte
 *  Description : Responsible for Authoring Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : clsSMDrawing (Authoring)
 *  Last update : 09-April-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, onMount } from "svelte";
	import { writable } from "svelte/store";
	import { XMLToJSON, JSONToXML , AH } from '../helper/HelperAI.svelte';
    import swal from 'sweetalert';
    import l from '../src/libs/editorLib/language.js';
    import Draggable from "../clsSMDragNDrop/libs/plugins/Draggable";
    import Resizable from "../clsSMDragNDrop/libs/plugins/Resizable";
    import DrawingModal from "./DrawingModal.svelte";
    import { Button, Dialog} from 'svelte-mui/src';
    export let xml;
    // export let editorState;
    export let getChildXml;
    let bgImgPath = 'https://s3.amazonaws.com/jigyaasa_content_static/';
    let xmlns = "http://www.w3.org/2000/svg";
    // denotes that drawing is not sketching
    let isDrawing = false;
    // used to creates an element with the specified namespace URI and qualified name
    let scribble;
    // denotes mouse co-ordinates
    let auth_mouseX, auth_mouseY;
    // container of drawing sketched by the help of drawing tools
    let drawing_paths;
    // scribble drawing tool is enable
    let authoringMode = 'scribble';
    // strike color of drawing
    let authColor = '#00BCD4';
    // stroke width of the drawing
    let authThickness = 5;
    // contains object that have key type, index, mode, order and d
    let scribblePath = [];
    // contains sequence of the drawing
    let scribbleCount = 0;
    // contains current mouse x position
    let checkCurrentPositionX;
    // contains current mouse y position
    let checkCurrentPositionY;
    // denoes no of undo done
    let undoCount = 0;
    // contains undo data
    let undo_list = [];
    // contains redo data
    let redo_list = [];
    // used to check validateInput
    let isValid = true;
    // for compass variable
    // denotes x co-ordinate of the center
    let cx;
    // denotes y co-ordinate of the center
    let cy;
    // denotes x co-ordinate of the center of middle circle lies on rotationbar
    let midCircle_cx;
    // denotes x co-ordinate of the center of middle circle lies on rotationbar
    let midCircle_cy;
    // denotes center of x co-ordinate of small middle circle lies on rotationbar
    let midSmallCircle_cx;
    // denotes x co-ordinate of the center of small middle circle lies on rotationbar
    let midSmallCircle_cy;
    // denotes center of x co-ordinate of last circle lies on rotationbar
    let lastCircle_cx;
    // denotes x co-ordinate of the center of last circle lies on rotationbar
    let lastCircle_cy;
    // denotes center of x co-ordinate of rotation indicator
    let lastSmallCircle_cx;
    // denotes x co-ordinate of the center of rotation indicator
    let lastSmallCircle_cy;
    // radius of the compass
    let compassRadius;
    // denotes that compass is not moved
    let isCompassMove = false;
    // sets the default angle of compass
    let compassAngle = 90;
    // denotes that compass radius not increased
    let isRadiusIncrease = 0;
    // denotes initial points co-ordinate
    let initialPoint = { x: null, y: null };
    // denotes final points co-ordinate
    let finalPoint = { x: null, y: null };
    // denotes that is radius rotated
    let isRadiusRotate = 0;
    // used for answer recording
    let defaultXML = '';
    // defines that not any point added using 'Add Point' button
    let selectionPoint = 0;
    // used for store the point added by clicking on 'Add Point' button
    let selectionArray = [];
    // used to contain the x, y and radius of Point added by clicking on 'Add Point' button
    let cdata = '';
    // used to enables the drawing tools that can be used to draw the drawing
    let selectedToolsArray = ["_scribble", "_line", "_compass"];
    // used for access the focus points using keyboard
    let isAccessibleMarking = 1;
    // contains the focusPoints
    let accessibilityPoints = [];
    // array contains x and y co-ordinate of added focus point
    let tempAccessPoints = [];
    // number of focus point exist
    let focusPointCount = 1;
    let auth_store = writable({
        // contains the xml
        xml: '',
        // used to open the configuration dialog box
        bgImg: 'useraccount_000ANv.png',
        snackback: false,
        // contains points used for correct answer
        cDATA: '',
        // contains focus points that can be access via keyboard 
        focusDATA: '',
        imgWidth: "600",
        alt: "Triangle image",
        // message for snackbar
        message: '',
        // contains drawing tools
        selectedTools: selectedToolsArray,
        // for stroke color of drawing
        lineColor: '#00BCD4',
        // for mark point color
        markPointColor: '#00FF00'
	});

    let state = {};
    const unsubscribe = auth_store.subscribe(value => {
		state = value;
	});
    afterUpdate(async()=> {
		if (state.xml != xml) {
            // for changing the data when XML is changed manually 
            parseXMLForGettingData();
            state.xml = xml;
        }
    })
    // call after html render and added the necessary events
    onMount(async() => {
        drawing_paths = AH.select('.drawing_paths');

        AH.setAttr('.centerImg #svgImg', {
            'src': bgImgPath + '' + state.bgImg, 
            'alt': state.alt, 
            'width': state.imgWidth,
        });

        AH.setAttr('.auth_drawing_toolbar', {
            'style': 'width:' + (Number(state.imgWidth) + 2) + 'px'
        });
        
        AH.setAttr('.authCenterImg', {
            'style': 'width:' + (Number(state.imgWidth) + 2) + 'px'
        });

        updateCompassCalculation(160, 118, 100, 90);


        AH.listen('body', 'mousedown', '#authoringSvg .mid_circle', function () {
            if (authoringMode == "compass") {
                // checks if radius of the circle increased
                isRadiusIncrease = 1;
            }
        });

        AH.listen('body', 'mousedown', '#authoringSvg .midSmallCircle', function () {
            if (authoringMode == "compass") {
                // checks if radius of the circle increased
                isRadiusRotate = 1;
            }
        });

        AH.listen('body', 'mousedown', '#authoringSvg .drawing_compass_center', function (current, event) {
            if (authoringMode == "compass") {
                // used to set the x and y co-ordinate of the mouse position
                setMouseCoordinates(event);
                // contains the value of center x
                cx = auth_mouseX;
                // contains the value of center y
                cy = auth_mouseY;
                // contains the value of compass route radius
                compassRadius = AH.select('.drawing-compass-route').getAttribute('r');
                // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                updateCompassCalculation(cx, cy, compassRadius, compassAngle);
                // rotate the small middle circle at defined angle from its center position
                AH.selectAll('#authoringSvg .midSmallCircle', 'attr', {"transform" : "rotate(" + compassAngle + "," + AH.select('#authoringSvg .midSmallCircle').getAttribute('cx') + "," + AH.select('#authoringSvg .midSmallCircle').getAttribute('cy') + ")"});
                // rotate the middle circle at defined angle from its center position
                AH.selectAll('#authoringSvg .mid_circle', 'attr' , {"transform" : "rotate(" + compassAngle + "," + AH.select('#authoringSvg .mid_circle').getAttribute('cx') + "," + AH.select('#authoringSvg .mid_circle').getAttribute('cy') + ")"});
                // rotate the rotation indicator circle at defined angle from its center position
                AH.selectAll('#authoringSvg .lastCircleMid', 'attr', {"transform" : "rotate(" + compassAngle + "," + AH.select('#authoringSvg .lastCircleMid').getAttribute('cx') + "," + AH.select('#authoringSvg .lastCircleMid').getAttribute('cy') + ")"});
                // defines that compass moved
                isCompassMove = true;
            }
        });

        AH.listen('body', 'mousemove', '#authoringSvg .lastCircle', function (current) {
            // adds the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
            current.classList.add("lastCircle_hover");
            // shows the rotational indicator
            AH.selectAll('#authoringSvg .lastCircleMid', 'attr' , {'opacity': 1});
        });
        
        AH.listen('body', 'mouseout', '#authoringSvg .lastCircle', function (current) {
            // removes the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
            current.classList.remove("lastCircle_hover");
            // hides the rotational indicator
            AH.selectAll('#authoringSvg .lastCircleMid', 'attr' , {'opacity': 0});
        });

        AH.listen('body', 'mousedown', '#authoringSvg .lastCircle', function (current) {
            if (authoringMode == "compass") {
                // used check that drawing 
                isDrawing = true;
                // checks if compass rotaionbar rotated
                isRadiusRotate = 1;
                // change the cursor style to grabbing for the circle that lies on the compass route
                AH.selectAll('#authoringSvg .lastCircle', 'css', {'cursor':'grabbing'});
                // Creates an element with the value of variable xmlns namespace URI and path name.
                scribble = document.createElementNS(xmlns, 'path');
                // sets the stroke width and color of the drawing drawn by scribble drawing tool
                setAuthColor(authColor, authThickness, authoringMode);
                // adds a new attribute 'data-type' (with a namespace null)
                scribble.setAttributeNS(null, 'data-type', authoringMode + '_' + scribbleCount);
                // adds a new attribute 'data-order' (with a namespace null)
                scribble.setAttributeNS(null, 'data-order', scribbleCount);
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', 'M' + lastCircle_cx + ' ' + lastCircle_cy);
                // contains the center x of last circle on rotationbar
                checkCurrentPositionX = lastCircle_cx;
                // contains the center y of last circle on rotationbar
                checkCurrentPositionY = lastCircle_cy;
                // pushes the object containing keys mode, order, type, index and d 
                scribblePath.push({
                    mode: 'add',
                    order: scribbleCount,
                    type: authoringMode + '_' + scribbleCount,
                    index: scribbleCount,
                    d: 'M' + lastCircle_cx + ' ' + lastCircle_cy
                });
            }
        });

        AH.listen('body', 'mousedown', '#authoringSvg', function (current, event) {
            // used to set the UI of the buttons and sketch or remove the drawing and adds focus point to access via keyboard
            authoringMousedownDraw(event);
        });

        // only for authoring area for adding answer points 
        AH.listen('body', 'click', '#authoring_point', function (current) {
            // parses the point that can be access via keyboard on preview side
            parseXMLForAccessPoint();
            // removes the class active from element have class 'authoring_btn' or id 'focus_point'
            AH.selectAll('.authoring_btn, #focus_point', 'removeClass', 'active');
            // adds the class active to 'Add Point' button
            current.classList.add('active');
            // assign the value 'authoring_point' to variable 'authoringMode'
            authoringMode = 'authoring_point';
            // removes the class 'eraserHover' from the elements have tag name path inside the element have id authoringSvg
            AH.selectAll('#authoringSvg path', 'removeClass','eraserHover');
            // sets the cursor style to 'unset'
            AH.selectAll('#authoringSvg', 'css', {'cursor': 'unset'});
            // hides the compass element
            AH.selectAll('.drawing_compass_svg', 'addClass', 'h');
            if (AH.select('#authoring_point').innerText == "Add Point") {
                // increases the value of variable 'selectedPoint to detect that how many points are added using 'Add Point' button
                selectionPoint++;
                // push the object taking the initial point of x and y co-ordinate and radius of the circle into arraay 'selectionArray' that is added using 'Add Point' button
                selectionArray.push({ Center_X: 90, Center_Y: 68, radius: 33 });
                // draw the point after click on 'Add Point' button
                AH.insert('#centerImg', '<div class="resize" data-point="' + selectionPoint + '"><div class="resizer icomoon-resize"></div></div>', 'beforeend');
                // updates the marking points xml after to resize or drag the points
                setPointDataInXML();
            }
            if (!(AH.select('.resize').nodeName && AH.select('.resize').offsetHeight) || selectionPoint == 0) {
                // shows the points created using 'Add Point' button
                AH.selectAll('.resize', 'removeClass', 'h');
                // hides the compass element
                AH.selectAll('.drawing_compass_svg', 'addClass', 'h');
                // Adds the text 'Add Point' of the button having text 'Show Point'
                AH.select('#authoring_point').innerText = 'Add Point';
            }
            AH.select('#add_point_msg').classList.remove('h');
        });

        // Mouse Move Event
        AH.listen('body', 'mousemove', '#authoringSvg', function (current, event) {
            // used to set the x and y co-ordinate of the mouse position
            setMouseCoordinates(event);
            switch (authoringMode) {
                case 'line':
                    if (isDrawing) {
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', scribblePath[scribbleCount].d + ' L' + auth_mouseX + ' ' + auth_mouseY);
                        // prepend the element scribble into the container have class drawing_paths
                        drawing_paths.prepend(scribble);
                    }
                    break;
                case 'scribble':
                    if (isDrawing) {
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', scribblePath[scribbleCount].d + ' L' + auth_mouseX + ' ' + auth_mouseY);
                        // adds the x an y mouse position with prefix 'L' into the value of key 'd' of array 'scribblePath' with index no containing into variable scribbleCount
                        scribblePath[scribbleCount].d = scribblePath[scribbleCount].d + ' L' + auth_mouseX + ' ' + auth_mouseY;
                        // prepend the element scribble into the container have class drawing_paths
                        drawing_paths.prepend(scribble);
                    }
                    break;
                case 'compass':
                    if (isCompassMove) {
                        // defines the center of the x co-ordinate
                        cx = auth_mouseX;
                        // contains the center of the x co-ordinate
                        cy = auth_mouseY;
                        // radius of the compass or width of the rotationbar of the compass
                        compassRadius = AH.select('.drawing-compass-route').getAttribute('r');
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updateCompassCalculation(cx, cy, compassRadius, compassAngle);
                    }
                    if (isRadiusIncrease) {
                        // calculates the angle using initial and final point and find the radius of the compass
                        checkRadiusPointsAndAngle();
                        // rounds the angle to make it integer value
                        compassAngle = Math.round(compassAngle);
                        // calculates the radius of the compass
                        compassRadius = 2 * Math.sqrt(Math.pow(auth_mouseX - initialPoint.x, 2) + Math.pow(auth_mouseY - initialPoint.y, 2))
                        if (compassRadius < 80) {
                            compassRadius = 80;
                        }
                        if (compassRadius > 360) {
                            compassRadius = 360;
                        }
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updateCompassCalculation(initialPoint.x, initialPoint.y, compassRadius, compassAngle);
                    }
                    if (isRadiusRotate) {
                        // used to set the x and y co-ordinate of the mouse position
                        setMouseCoordinates(event);
                        // calculates the angle using initial and final point and find the radius of the compass
                        checkRadiusPointsAndAngle();
                        // calculates the angle of the compass
                        compassAngle = Math.atan2(auth_mouseY - initialPoint.y, auth_mouseX - initialPoint.x) * 180 / Math.PI;
                        if (compassAngle < 0) {
                            compassAngle = 360 + compassAngle;
                        }
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updateCompassCalculation(initialPoint.x, initialPoint.y, compassRadius, compassAngle);
                    }
                    if (isDrawing) {
                        if (! (AH.select('#authoringSvg .last_big_circle').classList.contains('lastCircle_hover') )) {
                            authoringMouseLeave(event)
                        } else {
                            // adds a new attribute 'd' (with a namespace null)
                            scribble.setAttributeNS(null, 'd', scribblePath[scribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);
                            // adds the values of center of x and y of last circle on rotationbar with prefix 'L' into the value of key 'd' of array 'scribblePath' with index no containing into variable scribbleCount
                            scribblePath[scribbleCount].d = scribblePath[scribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;
                            // prepend the element scribble into the container have class drawing_paths
                            drawing_paths.prepend(scribble);
                        }
                    }
                    // rotates the small middle circle at given angle from it's center position
                    AH.selectAll('#authoringSvg .midSmallCircle', 'attr' , {"transform" : "rotate(" + compassAngle + "," + AH.select('#authoringSvg .midSmallCircle').getAttribute('cx') + "," + AH.select('#authoringSvg .midSmallCircle').getAttribute('cy') + ")"});
                    // rotates the middle circle at given angle from it's center position
                    AH.selectAll('#authoringSvg .mid_circle', 'attr', {"transform": "rotate(" + compassAngle + "," + AH.select('#authoringSvg .mid_circle').getAttribute('cx') + "," + AH.select('#authoringSvg .mid_circle').getAttribute('cy') + ")"});
                    // rotates the last circle at given angle from it's center position
                    AH.selectAll('#authoringSvg .lastCircleMid','attr', {"transform": "rotate(" + compassAngle + "," + AH.select('#authoringSvg .lastCircleMid').getAttribute('cx') + "," + AH.select('#authoringSvg .lastCircleMid').getAttribute('cy') + ")"});
                    break;
            }
        });

        // Mouse Up Event
        AH.listen('body', 'mouseup', '#authoringSvg', function (current, event) {
            authoringMouseLeave(event)
        });

        AH.bind('#authoringSvg', 'mouseleave', function (event) {
            authoringMouseLeave(event)
        })

        AH.listen('body', 'click', '#authoring_clearScreen', function (current) {
            // makes drawing container empty in which drawing is done by using drawing tools
            AH.select('.drawing_paths').innerHTML = '';
            // sets the value of variable 'undoCount' to  0
            undoCount = 0;
            // sets the value of variable 'scribbleCount' to  0
            scribbleCount = 0;
            // makes array 'scribblePath' empty 
            scribblePath = [];
            // disabled the undo, redo, cross (x) buttons
            AH.select('#authoring_undo').disabled = true;
            AH.select('#authoring_redo').disabled = true;
            AH.select('#authoring_clearScreen').disabled = true;
        });

        AH.listen('body', 'click', '.auth_toolbar', function (current) {
            // hides the points added by clicking on 'Add Point' button
            AH.selectAll('.resize', 'addClass', 'h');
            // parses the point that can be access via keyboard on preview side
            parseXMLForAccessPoint();
            // sets the style of the cursor to crosshair (+)
            AH.selectAction('#authoringSvg', 'css', {'cursor': 'crosshair'});
            // contains the value of attribute 'data-title' on which currently clicked
            authoringMode = current.getAttribute('data-title');

            AH.selectAll('.authoring_btn,#authoring_point,#focus_point' ,'removeClass' ,'active');
            current.classList.add('active');

            if (authoringMode == 'eraser') {
                // adds the class 'eraserHover' to the element 'path' inside drawing container in which drawing is done by using drawing tools
                AH.selectAll('.drawing_paths path', 'addClass', 'eraserHover');
            } else {
                // removes the class 'eraserHover' to the element 'path' inside drawing container in which drawing is done by using drawing tools
                AH.selectAll('.drawing_paths path', 'removeClass', 'eraserHover');

            }

            if (authoringMode == 'compass') {
                // shows the compass tool
                AH.selectAll('.drawing_compass_svg', 'removeClass', 'h');
            } else {
                // hides the compass element
                AH.selectAll('.drawing_compass_svg', 'addClass','h');
            }

            if (selectionPoint != 0) {
                // sets the text 'Show Point' of the element having id 'authoring_point' if the value of variable 'selectionPoint' is not equals to 0
                AH.select('#authoring_point').innerText = 'Show Point';
                AH.select('#add_point_msg').classList.add('h');
            }
        });

        AH.listen('body', 'mouseover', '.drawing_paths path', function (current) {
            if (authoringMode == 'eraser') {
                // removes the class currentSvg from the element 'path' inside the element have class 'drawing_paths'
                AH.selectAll('.drawing_paths path', 'removeClass' , 'currentSvg');
                // adds the class 'currentSvg' to the element 'path' inside the element have class 'drawing_paths' on which mouseover
                current.classList.add('currentSvg');
            }
        });

        AH.listen('body', 'mouseout', '.drawing_paths path', function (current) {
            if (authoringMode == 'eraser') {
                // removes the class 'currentSvg' to the element 'path' inside the element have class 'drawing_paths' on which mouseout
                current.classList.remove('currentSvg');
            }
        });

        AH.listen('body', 'click', '#authoring_undo', function (current) {
            if (undoCount == 1) {
                // disabled the undo button
                current.disabled = true;
                // enabled the redo button
                AH.select('#authoring_redo').disabled = false;
            } else {
                // enabled the redo button
                AH.select('#authoring_redo').disabled = false;
            }

            if (scribblePath[scribblePath.length - 1].mode == 'add') {
                // removes the element which 'data-order' attributes value is equals to the value of array length scribblePath reducing by 1
                AH.select('#authoringSvg [data-order="' + (scribblePath.length - 1) + '"]', 'remove');
            } else if (scribblePath[scribblePath.length - 1].mode == 'remove') {
                // Creates an element with the specified namespace URI and qualified name.
                scribble = document.createElementNS(xmlns, 'path');
                // sets the stroke width and color of the drawing drawn by scribble drawing tool
                setAuthColor(authColor, authThickness);
                // adds a new attribute 'data-type' (with a namespace null)
                scribble.setAttributeNS(null, 'data-type', scribblePath[scribblePath.length - 1].type);
                // adds a new attribute 'data-order' (with a namespace null)
                scribble.setAttributeNS(null, 'data-order', (scribblePath[scribblePath.length - 1].order));
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', scribblePath[scribblePath.length - 1].d);
                if (authoringMode == 'eraser') {
                    // adds a new attribute 'class' (with a namespace null)
                    scribble.setAttributeNS(null, 'class', 'eraserHover');
                }
                // prepend the element scribble into the container have class drawing_paths
                drawing_paths.prepend(scribble);
            }
            // pushes the last data of array scribblePath into array undo_list
            undo_list.push(scribblePath.pop());
            // reduces the value of variable 'scribbleCount' by 1
            scribbleCount--;
            // reduces the value of variable 'undoCount' by 1
            undoCount--;
            if (AH.selectAll('.drawing_paths path').length == 0) {
                // disabled the cross (x) button if no drawing sketched by using drawing tools
                AH.select('#authoring_clearScreen').disabled = true;
            } else {
                // enables the cross (x) button if drawing has been sketched by using drawing tools
                AH.select('#authoring_clearScreen').disabled = false;
            }
            if (scribblePath.length == 0) {
                // disabled the undo button if length of the array 'scribblePath' is 0 
                current.disabled = true;
            }
        });

        AH.listen('body', 'click', '#authoring_redo', function (current) {
            // increases the value of the variable 'scribbleCount' by 1
            scribbleCount++;
            if (undo_list.length > 0) {
                // pushes the last data of the array undo_list into array redo_list
                redo_list.push(undo_list.pop());
            }
            if (redo_list[redo_list.length - 1].mode == 'add') {
                // Creates an element with the specified namespace URI and qualified name.
                scribble = document.createElementNS(xmlns, 'path');
                // sets the stroke width and color of the drawing drawn by scribble drawing tool
                setAuthColor(authColor, authThickness);
                // adds a new attribute 'data-type' (with a namespace null)
                scribble.setAttributeNS(null, 'data-type', redo_list[redo_list.length - 1].type);
                // adds a new attribute 'data-order' (with a namespace null)
                scribble.setAttributeNS(null, 'data-order', (redo_list[redo_list.length - 1].order));
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', redo_list[redo_list.length - 1].d);
                if (authoringMode == 'eraser') {
                    // adds a new attribute 'class' (with a namespace null)
                    scribble.setAttributeNS(null, 'class', 'eraserHover');
                }
                // prepend the element scribble into the container have class drawing_paths
                drawing_paths.prepend(scribble);
            } else if (redo_list[redo_list.length - 1].mode == 'remove') {
                // removes the element which 'data-order' attributes value is equals to the value of order key of last data in array redo_list
                AH.select('#authoringSvg [data-order="' + (redo_list[redo_list.length - 1].order) + '"]', 'remove');
            }
            // increases the value of variable 'undoCount' by 1
            undoCount++;
            // pushes the last value of the array redo_list into array scribblePath
            scribblePath.push(redo_list.pop());
            if (AH.selectAll('.drawing_paths path').length == 0) {
                // disabled the cross (x) button if no drawing is sketched by using drawing tools
                AH.select('#authoring_clearScreen').disabled = true;
            } else {
                // enables the cross (x) button if any drawing is sketched by using drawing tools
                AH.select('#authoring_clearScreen').disabled = false;
            }
            if (undo_list.length == 0) {
                // disabled the redo button if no data exist in array undo_list
                current.disabled = true;
                // enables the undo button if no data exist in array undo_list
                AH.select('#authoring_undo').disabled = false;
            } else {
                // enables the undo button if data exist in array undo_list
                AH.select('#authoring_undo').disabled = false;
            }
        });

        AH.listen('body', 'click', '#reset_btn', function () {
            // swal({
            //     text: l.reset_module,
            //     icon: "warning",
            //     buttons: ["cancel","ok"],
            // }).then((value) => {
            //     if (value) {
            //         // reset all the activity and makes it in initial condition as it looks like just after load
            //         resetModule();
            //     }
            // });
            state.openDeleteDialog = true;
        });

        AH.listen('body', 'click', '#focus_point', function () {
            // hides the compass element
            AH.selectAll('.drawing_compass_svg', 'addClass', 'h');
            AH.selectAll('#authoringSvg path', 'removeClass', 'eraserHover');
            // sets the cursor style as crosshair (+)
            AH.select('#authoringSvg', 'css', {'cursor': 'crosshair'});
            // hides the circle shape element created using 'Add Point' button
            AH.selectAll('.resize', 'addClass', 'h');
            if (selectionPoint != 0) {
                // if any point created using 'Add point' button then after click on 'Add Focus Point' or 'Finish Marking' button text of 'Add Point' button changes to 'Show Point'
                AH.select('#authoring_point').innerText = 'Show Point';
                AH.select('#add_point_msg').classList.add('h');
            }
            if (isAccessibleMarking) {
                // removes the class active from the drawing tools, delete and 'Add Point' buttons
                AH.selectAll('.authoring_btn,#authoring_point', 'removeClass', 'active');

                // adds the class active to the button have id 'focus_point' and change the text as 'Finish Marking'
                AH.select('#focus_point').innerText = "Finish Marking";
                AH.select('#focus_point', 'addClass', 'active');
                // sets the value of variable 'isAccessibleMarking' to 0 
                isAccessibleMarking = 0;
                // sets the value of variable 'authoringMode' to 'markAccessibilityPoint'
                authoringMode = 'markAccessibilityPoint';
            } else {
                // parses the point that can be access via keyboard on preview side
                parseXMLForAccessPoint();
            }
        });

        AI.listen('body', 'contextmenu', '.resize', function (current, event) {
            event.preventDefault();
            swal({
                text: l.delete_points,
                icon: "warning",
                buttons: true,
            }).then((value) => {
                if (value) {
                    let btnIndex = current.getAttribute("data-point");
                    // makes the x co-ordinate of the point null
                    selectionArray[btnIndex - 1].Center_X = null;
                    // makes the y co-ordinate of the point null
                    selectionArray[btnIndex - 1].Center_Y = null;
                    // makes the radius of the point null
                    selectionArray[btnIndex - 1].radius = null;
                    // removes the point
                    current.remove();
                    // this function will set the point value in xml 
                    setPointDataInXML();
                }
            });
        });

        AI.listen('body', 'keyup', '.authoring-modal input', function (current, event) {
            event.stopPropagation();
            AH.selectAll('.error', 'remove');
            validateInput(current);
        });

        AI.listen('body', 'change', '.authoring-modal input', function (current, event) {
            event.stopPropagation();
            AH.selectAll('.error', 'remove');
            validateInput(current);
        });

        AI.listen('body', 'click', '.drawing_modal_submit', function (current, event) {
            if (isValid && AH.selectAll('.showError').length == 0) {
                selectedToolsArray = [];
                let checkboxes = AH.selectAll('.checkbox-inline:checked');
                for (let index = 0; index < checkboxes.length; index++) {
                    /* pushes the drawing tools value that can be used to draw the drawing into the array of drawing tools by checking the checkbox of tools group in configaration modal box */
                    selectedToolsArray.push(checkboxes[index].value);
                }

                auth_store.update((item) => {
                    item.bgImg = AH.select('#backgroundImage').value;
                    // sets the alt message for background image
                    item.alt = AH.select('#imgAlt').value.trim();
                    // sets the width of background image
                    item.imgWidth = AH.select('#imgWidth').value;
                    // sets the stroke color of drawing shape
                    item.lineColor = AH.select('#lineColor').value;
                    // sets the point color of drawing shape on Preview area
                    item.markPointColor = AH.select('#markPointColor').value;
                    // sets which type of drawing tools can be used to draw the drawing such as scribble, line or compass
                    item.selectedTools = selectedToolsArray;
                    return item;
                });

                resetModule();
                parseXMLForSettingData(xml);
                AH.getBS('#drawing-modal', 'Modal').hide();
            } else {
                swal({
                    text: "Please solve all the errors!",
                    icon: "warning",
                })
            }
        
        });

        AH.listen('body', 'click', '#upload_media', function () {
            AH.getBS('#modal-media-upload','Modal').show();
        });

        enableDragResize();
    })

    // function for checking the numeric value
    function isNumeric (num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    }

    // function for validation of the modal's input
    function validateInput(current) {
        // sets the value of isValid variable to true
        isValid = true;
        if (current.value.trim() == '') {
            isValid = false;
            AH.insert(current.parentElement, '<span class="error text-danger">' + l.fill_warning + '</span>', 'beforeend');
        } else if (current.classList.contains('num') && Number(current.value) < 600) {
            isValid = false;
            // shows warning message if width of image is less than 600
            AH.insert(current.parentElement, '<span class="error text-danger">' + l.val_gt_limit + '</span>', 'beforeend');
        } else if (! isNumeric(current.value) && current.classList.contains('num')) {
            // sets the value of isValid variable to false
            isValid = false;
            // shows warning message if width of image takes any non number data but it cannot be seen as field has not allowed to take non numeric data
            AH.insert(current.parentElement, '<span class="error text-danger">' + l.enter_number + '</span>', 'beforeend');
        } else if ((AH.selectAll('.checkbox-inline:checked').length == 0) && current.classList.contains('checkbox-inline')) {
            // sets the value of isValid variable to false
            isValid = false;
            // shows warning message if no any drawing tools selected
            AH.insert(current.closest('.toolsCheckbox').parentElement, '<span class="error text-danger">' + l.select_one_tool + '</span>', 'beforeend');
        }

        if (isValid) {
            if (current.classList.contains('checkbox-inline')) {
                // in case when current element which value changed has class 'checkbox-inline' and value of variable 'isValid' is true then removes class 'showError to the element have id backgroundImage
                AH.select('#backgroundImage').classList.remove('showError');
            } else {
                // in case when current element which value changed has not class 'checkbox-inline' and value of variable 'isValid' is true then removes class 'showError from current element and removes border and background color
                current.classList.remove('showError');
                AH.setCss(current, {
                    "border": "", 
                    "background": ""
                })
            }
        } else {
            if (current.classList.contains('checkbox-inline')) {
                // in case when current element which value changed has class 'checkbox-inline' and value of variable 'isValid' is false then adds class 'showError to the element have id backgroundImage
                AH.select('#backgroundImage').classList.add('showError');
            } else {
                current.classList.add('showError');
                // in case when current element which value changed has not class 'checkbox-inline' and value of variable 'isValid' is false then adds 'showError' class and sets border color to red and background color to #FFCECE
                AH.setCss(current, {
                    "border": "1px solid red", 
                    "background": "#FFCECE"
                })
            }
        }
    }

    // function for enabling resize and dragging
    function enableDragResize() {
        let draggable = new Draggable({
            containment: '#authoringSvg',
            classes: ".resize",
            ignore: ['.tools', '.resizer']
        });
        draggable.onDragStop = function (event, position, ui) {
            let pointIndex = ui.getAttribute("data-point");
            // sets the height value to it's width value
            AH.setCss(ui, {
                height: ui.offsetWidth + "px",
                width: ui.offsetWidth + "px",
            });
            // contains the radius of the point
            let h = ui.offsetHeight / 2;
            // contains x co-ordinate of the point
            let CenterX = position.left + h;
            // contains y co-ordinate of the point
            let CenterY = position.top + h;
            // assign the value of the x co-ordinate of the point at index 'pointIndex-1' in array selectionArray
            selectionArray[pointIndex - 1].Center_X = CenterX;
            // assign the value of the y co-ordinate of the point at index 'pointIndex-1' in array selectionArray
            selectionArray[pointIndex - 1].Center_Y = CenterY;
            // assign the value of radius of the point at index 'pointIndex-1' in array selectionArray
            selectionArray[pointIndex - 1].radius = h;
            // this function will set the point value in xml 
            setPointDataInXML();
        }

        let resizable = new Resizable('#authoringSvg', '.resize');
        resizable.onStop =  function(e, ui) {
            let pointIndex = ui.getAttribute("data-point");
            // sets the height of the selector element equal to width of that element
            let resolution = (Number(ui.offsetWidth) > 66) ? 66 : ui.offsetWidth
            AH.setCss(ui, {
                height: resolution + "px",
                width: resolution + "px",
            });
            // contains radius of the point
            let h = ui.offsetHeight / 2;
            // contains co-ordinate of center x
            let CenterX = ui.offsetLeft + h;
            // contains co-ordinate of center y
            let CenterY = ui.offsetTop + h;
            // sets the co-ordinate of center x of the point contained at index 'pointIndex -1' in array selectionArray
            selectionArray[pointIndex - 1].Center_X = CenterX;
            // sets the co-ordinate of center y of the point contained at index 'pointIndex -1' in array selectionArray
            selectionArray[pointIndex - 1].Center_Y = CenterY;
            // sets the radius of the point contained at index 'pointIndex -1' in array selectionArray
            selectionArray[pointIndex - 1].radius = h;
            // this function will set the point value in xml 
            setPointDataInXML();
        }
    }

    // function called on the mouse leave on the authoring svg
    function authoringMouseLeave(event) {
        switch (authoringMode) {
            case 'line':
            case 'scribble':
                if (isDrawing) {
                    // used to set the x and y co-ordinate of the mouse position
                    setMouseCoordinates(event);
                    if (checkCurrentPositionX == auth_mouseX && checkCurrentPositionY == auth_mouseY) {
                        // removes the last value from array scribblePath
                        scribblePath.pop();
                    } else {
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', scribblePath[scribbleCount].d + ' L' + auth_mouseX + ' ' + auth_mouseY);
                        // adds the x an y mouse position with prefix 'L' into the value of key 'd' of array 'scribblePath' with index no containing into variable scribbleCount
                        scribblePath[scribbleCount].d = scribblePath[scribbleCount].d + ' L' + auth_mouseX + ' ' + auth_mouseY;
                        // prepend the element scribble into the container have class drawing_paths
                        drawing_paths.prepend(scribble);
                        // increases the value variable 'scribbleCount' by 1
                        scribbleCount++;
                        // increases the value variable 'undoCount' by 1
                        undoCount++;
                        // makes array undo_list blank
                        undo_list = [];
                        // enables undo and cross (x) buttons
                        AH.select('#authoring_undo').disabled = false;
                        AH.select('#authoring_clearScreen').disabled = false;
                        AH.select('#authoring_redo').disabled = true;
                    }
                }
                isDrawing = false;
                break;
            case 'compass':
                isRadiusIncrease = 0;
                isRadiusRotate = 0;
                if (isCompassMove) {
                    // used to set the x and y co-ordinate of the mouse position
                    setMouseCoordinates(event)
                    // contains x co-ordinate of the mouse
                    cx = auth_mouseX;
                    // contains y co-ordinate of the mouse
                    cy = auth_mouseY;
                    // contains radius of the compass
                    compassRadius = AH.select('.drawing-compass-route').getAttribute('r');
                    // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                    updateCompassCalculation(cx, cy, compassRadius, compassAngle);
                    // defines the value of the variable 'isCompassMove' to false to indicate that compass is not moved
                    isCompassMove = false;
                }
                if (isDrawing) {
                    if (checkCurrentPositionX == lastCircle_cx && checkCurrentPositionY == lastCircle_cy) {
                        // removes the last element from the array 'scribblePath'
                        scribblePath.pop();
                    } else {
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', scribblePath[scribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);
                        // adds the values of center of x and y of last circle on rotationbar with prefix 'L' into the value of key 'd' of array 'scribblePath' with index no containing into variable scribbleCount
                        scribblePath[scribbleCount].d = scribblePath[scribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;
                        // prepend the element scribble into the container have class drawing_paths
                        drawing_paths.prepend(scribble);
                        // increases the value of the variable 'scribbleCount' by 1
                        scribbleCount++;
                        // increases the value of the variable 'undoCount' by 1
                        undoCount++;
                        // makes blank array undo_list 
                        undo_list = [];
                        // enables undo and cross (x) button
                        AH.select('#authoring_undo').disabled = false;
                        AH.select('#authoring_clearScreen').disabled = false;
                        AH.select('#authoring_redo').disabled = true;
                    }
                    // assign the value 'false' of the variable 'isDrawing' to indicate that drawing is not sketching
                    isDrawing = false
                }
                // defines the style of the cursor when it goes to last circle of the rotationbar
                AH.selectAll('#authoringSvg .lastCircle', 'css', {'cursor': 'grab'});
                break;
        }
    }

    // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    function updateCompassCalculation(cx, cy, compassRadius, compassAngle) {
        // sets the center of x of middle circle lies on compass rotationbar
        midCircle_cx = cx + (compassRadius / 2) * Math.cos(compassAngle * (Math.PI / 180));
        // sets the center of y of middle circle lies on compass rotationbar
        midCircle_cy = cy + (compassRadius / 2) * Math.sin(compassAngle * (Math.PI / 180));
        // sets the center of x of small middle circle lies on compass rotationbar
        midSmallCircle_cx = cx + ((3 * compassRadius) / 4) * Math.cos(compassAngle * (Math.PI / 180));
        // sets the center of y of small middle circle lies on compass rotationbar
        midSmallCircle_cy = cy + ((3 * compassRadius) / 4) * Math.sin(compassAngle * (Math.PI / 180));
        // sets the center of x of last circle lies on compass rotationbar
        lastCircle_cx = cx + (compassRadius) * Math.cos(compassAngle * (Math.PI / 180));
        // sets the center of y of last circle lies on compass rotationbar
        lastCircle_cy = cy + (compassRadius) * Math.sin(compassAngle * (Math.PI / 180));
        // sets the center of x of rotaion indicator shows after last circle of compass rotaionbar
        lastSmallCircle_cx = cx + ((5 * compassRadius) / 4) * Math.cos(compassAngle * (Math.PI / 180));
        // sets the center of y of rotaion indicator shows after last circle of compass rotaionbar
        lastSmallCircle_cy = cy + ((5 * compassRadius) / 4) * Math.sin(compassAngle * (Math.PI / 180));
        // used to set the center co-ordinate of the compass and of its route
        AH.selectAll('.drawing-compass-route, .drawing_compass_center', 'attr', { 'cx': cx, 'cy': cy });
        // sets the radius of the compass route
        AH.select('.drawing-compass-route').setAttribute('r', compassRadius);
        // sets the compass rotation bar's position
        AH.setAttr('#authoringSvg .compass_rotationBar', { 'x1': cx, 'y1': cy, 'x2': lastCircle_cx, 'y2': lastCircle_cy });
        // sets the position of rotaion indicator
        AH.setAttr('#authoringSvg .lastCircleMid', { 'cx': lastSmallCircle_cx, 'cy': lastSmallCircle_cy });
        // sets the center position of the last circle that lies on the compass route
        AH.selectAll('#authoringSvg .lastCircle', 'attr', { 'cx': lastCircle_cx, 'cy': lastCircle_cy });
        // sets the center position of the middle small circle that lies between last and middle circle on the compass rotaionbar
        AH.setAttr('#authoringSvg .midSmallCircle', { 'cx': midSmallCircle_cx, 'cy': midSmallCircle_cy });
        // sets the center position of the middle circle that lies on the compass rotaionbar    
        AH.setAttr('#authoringSvg .mid_circle', { 'cx': midCircle_cx, 'cy': midCircle_cy });
    }

    // for updating the cdata in the xml
    function setPointDataInXML() {
        cdata = '';
        for (let index = 0; index < selectionArray.length; index++) {
            // For avoiding the null value if found
            if (selectionArray[index].Center_X == null && selectionArray[index].Center_Y == null && selectionArray[index].radius == null) {
                // contains an array returned value from array selectionArray which is not null
                selectionArray = selectionArray.filter(function (element) {
                    return element.Center_X != null;
                });
                continue;
            }
            // adds the value of center co-ordinate x and y and radius of the point at perticular index in the form of object and each point is separated with symbol '!'
            cdata += '{"x":"' + selectionArray[index].Center_X + '","y":"' + selectionArray[index].Center_Y + '","r":"' + selectionArray[index].radius + '"}!';
        }
        let resize = AH.selectAll('.resize');
        if (resize.length > 0) {
            for (let index = 0; index < selectionArray.length; index++) {
                AH.setAttr(resize[index], {
                    "data-point": (index + 1)
                });
            }
        } else {
            AH.select('#add_point_msg').classList.add('h');
            selectionPoint = 0;
            // removes the first character from string in state array selectedTools at index 0
            authoringMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
            // sets the cursor style to crosshair (+)
            AH.setCss('#authoringSvg', {'cursor': 'crosshair'});
            if (authoringMode == 'compass') {
                // shows the compass tool
                AH.selectAll('.drawing_compass_svg', 'removeClass', 'h');
            } else {
                // hides the compass element
                AH.selectAll('.drawing_compass_svg', 'addClass', 'h');
            }
            AH.selectAll('.authoring_btn,#authoring_point,#focus_point' ,'removeClass' ,'active');
            AH.selectAll('[data-title="' + authoringMode + '"]' ,'addClass' ,'active');
        }
        // removes the last character that is '!' from variable 'cdata'
        cdata = cdata.substr(0, cdata.length - 1);
        // updates the cdata value that exist inside div element of the xml according to the value of points that were added or removed
        parseXMLForPoint(cdata);
    }

    // updates the cdata value that exist inside div element of the xml according to the value of points that were added or removed
    function parseXMLForPoint(cdata) {
        // converts the xml value into json and assign it into variable 'defaultXML'
        defaultXML = XMLToJSON(xml);
        // assign the value of argument 'cdata' to sub key 'cdata' of key 'div' of object 'defaultXML'
        defaultXML.smxml.div.__cdata = cdata;
        // converts json of xml into xml again
        defaultXML = JSONToXML(defaultXML);
        // changes the format of cdata
        defaultXML = defaultXML.replace(/<!\[CDATA\[/g, '<!--[CDATA[');
        // changes the format of cdata
        defaultXML = defaultXML.replace(/\]\]>/g, ']]-->');
        // update the xml
        getChildXml(defaultXML);
        // assign the value of changed xml into state xml
        state.xml = defaultXML;
    }

    // calculates the angle using initial and final point and find the radius of the compass
    function checkRadiusPointsAndAngle() {
        // denotes the initial x co-ordinate
        initialPoint.x = Number(AH.select('.compass_rotationBar').getAttribute('x1'));
        // denotes the initial y co-ordinate
        initialPoint.y = Number(AH.select('.compass_rotationBar').getAttribute('y1'));
        // denotes the final x co-ordinate
        finalPoint.x = Number(AH.select('.compass_rotationBar').getAttribute('x2'));
        // denotes the final y co-ordinate
        finalPoint.y = Number(AH.select('.compass_rotationBar').getAttribute('y2'));
        // denotes the radius of the compass
        compassRadius = Number(AH.select('.drawing-compass-route').getAttribute('r'));
        // calculates the angle using initial and final point co-ordinate
        compassAngle = Math.atan2(finalPoint.y - initialPoint.y, finalPoint.x - initialPoint.x) * 180 / Math.PI;
    }

    // parses the point that can be access via keyboard on preview side
    function parseXMLForAccessPoint() {
        if (tempAccessPoints.length > 0) {
            // push the value of tempAccessPoints into array 'accessibilityPoints'
            accessibilityPoints.push(tempAccessPoints);
        }
        // contains json data of xml 
        defaultXML = XMLToJSON(xml);
        var focusPointData = '';
        // used to create the array object 'focusPointData' containing the x and y co-ordinates value of points draw on drawing board using 'Add Focus Point' button
        for (let points = 0; points < accessibilityPoints.length; points++) {
            focusPointData += '{"' + points + '":[';
            for (let subPoints = 0; subPoints < accessibilityPoints[points].length; subPoints++) {
                focusPointData += '{"x":"' + accessibilityPoints[points][subPoints].x + '","y":"' + accessibilityPoints[points][subPoints].y + '"}!';
            }
            focusPointData = focusPointData.substr(0, focusPointData.length - 1) + ']}!';
        }
        // removes the last character from variable 'focusPointData'
        focusPointData = focusPointData.substr(0, focusPointData.length - 1);
        // updates the cdata value with the value of variable 'focusPointData'
        defaultXML.smxml.backgroundPoint.__cdata = focusPointData;
        // converts json of xml into xml
        defaultXML = JSONToXML(defaultXML);
        // updates the format of CDATA
        defaultXML = defaultXML.replace(/<!\[CDATA\[/g, '<!--[CDATA[')
        // updates the format of CDATA
        defaultXML = defaultXML.replace(/\]\]>/g, ']]-->');
        // update the xml
        getChildXml(defaultXML);
        // updates the state 'xml'
        state.xml = defaultXML;
        // changed the text of element have id 'focus_point' to 'Add Focus Point' and removes the class active
        AH.select('#focus_point').innerText = "Add Focus Point";
        AH.select('#focus_point').classList.remove('active');
        // assign the string to the variable 'authoringMode' after removing the first character from the string at index 0 of state array 'selectedTools'
        authoringMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
        // change the cursor style as crosshair (+)
        AH.setCss('#authoringSvg', {cursor: 'crosshair'});
        // adds the active class to scribber drawing tools
        AH.select('#authoring' + state.selectedTools[0]).classList.add('active');
        if (authoringMode == 'compass') {
            // shows the compass tool
            AH.selectAll('.drawing_compass_svg', 'removeClass' , 'h');
        } else {
            // hides the compass element
            AH.selectAll('.drawing_compass_svg', 'addClass' , 'h');
        }
        isAccessibleMarking = 1;
        // joins the focus points craeted by using 'Add focus Point' button otherwise return as it was before
        joinFocusPoint(tempAccessPoints);
    }

    // joins the focus points craeted by using 'Add focus Point' button otherwise return as it was before
    function joinFocusPoint(markArray) {
        if (markArray.length == 0) {
            return;
        }
        // Creates an element with the specified namespace URI and qualified name
        scribble = document.createElementNS(xmlns, 'path');
        // contains the string showing the start point
        let pointStartValues = 'M ' + markArray[0].x + ' ' + markArray[0].y;
        // contains the string showing the end point
        let pointEndValues = '';
        for (let index = 1; index < markArray.length; index++) {
            // adds the value of x anf y from array 'markArray' defined at specific index to variable 'pointEndValues'
            pointEndValues += ' L ' + markArray[index].x + ' ' + markArray[index].y;
        }
        // adds a new attribute (with a namespace)
        scribble.setAttributeNS(null, 'd', pointStartValues + '' + pointEndValues);
        // sets the stroke width and color of the drawing drawn by scribble drawing tool
        setAuthColor('rgb(128, 128, 128)', authThickness);
        // add as very first element inside the 'g' tag of 'svg' used for sketch the drawing
        AH.select('.backgroundFocusPath').prepend(scribble);
        // blanks the value of array 'tempAccessPoints'
        tempAccessPoints = [];
    }

    // used to set the x and y co-ordinate of the mouse position
    function setMouseCoordinates(event) {
        // contains the size of element having id 'authoringSvg' and its position relative to the viewport
        let boundary = document.getElementById('authoringSvg').getBoundingClientRect();
        // sets the x position of the mouse co-ordinate
        auth_mouseX = event.clientX - boundary.left;
        // sets the y position of the mouse co-ordinate
        auth_mouseY = event.clientY - boundary.top;
    }

    // sets the stroke width and color of the drawing drawn by scribble drawing tool
    function setAuthColor(authColor, authThickness) {
        // sets the stroke color of the scribble drawing
        scribble.style.stroke = authColor;
        // sets the stroke width of the scribble drawing
        scribble.style.strokeWidth = authThickness;
        scribble.style.fill = 'none';
    }

    // reset all the activity and makes it in initial condition as it looks like just after load
    function resetModule() {
        // updates the text of element having id 'authoring_point' 
        AH.select('#authoring_point').innerText = 'Add Point';
        AH.select('#add_point_msg').classList.add('h');
        // removes circular shape that is added by clicking on 'Add Point' button
        AH.selectAll('.resize', 'remove');
        // removes the activity done using drawing tools
        AH.select('.drawing_paths').innerHTML = '';
        // disabled the undo, redo and delete button
        AH.select('#authoring_redo').disabled = true;
        AH.select('#authoring_undo').disabled = true;
        AH.select('#authoring_clearScreen').disabled = true;
        // sets the cursor style to crosshair (+)
        AH.setCss('#authoringSvg', {'cursor': 'crosshair'});
        // assign the string after removing the first character from the string at index 0 of the state array selectedTools
        authoringMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
        // this function set the default data
        setDefaultData();
        // removes the active class from the element have class 'authoring_btn' or have id 'authoring_point' or have id 'focus_point'
        AH.selectAll('.authoring_btn,#authoring_point,#focus_point', 'removeClass', 'active');
        // parses the point that can be access via keyboard on preview side
        parseXMLForAccessPoint();
        // blanks the value of cdata exist inside div element of the xml showing that no points added
        // parseXMLForPoint('');
        setTimeout(()=>{parseXMLForPoint('')},1000);
        // clear the undo count
        undoCount = 0;
        // clear the added point
        selectionPoint = 0;
        // clear the scribbleCount
        scribbleCount = 0;
        // clear the paths of scribble
        scribblePath = [];
        // clear the all added points
        selectionArray = [];
        state.openDeleteDialog = false;
    }

    // this function set the default data
    function setDefaultData() {
        // hides drawing tools
        AH.selectAll('.geometryTool', 'addClass', 'h');
        for (let toolsIndex = 0; toolsIndex < state.selectedTools.length; toolsIndex++) {
            // shows the tools that is enabled from configuration dialog box
            AH.selectAll('#authoring' + state.selectedTools[toolsIndex], 'removeClass', 'h');
        }
        // removes all the points created after clicking on 'Add Focus Point' button 
        AH.selectAll('.backgroundFocusPoint circle,.backgroundFocusPath path', 'remove');
        // assign the value of stroke color into variable 'authColor' choosen from configuration dialog box
        authColor = state.lineColor;
        // sets the width of drawing board and container of buttons
        AH.selectAll('.authCenterImg,.auth_drawing_toolbar', 'attr', {'style': 'width:' + (Number(state.imgWidth) + 2) + 'px'});
        // sets the attributes 'src', 'alt', 'width' of the background image
        AH.setAttr('.centerImg #svgImg', { 'src': bgImgPath + '' + state.bgImg, 'alt': state.alt, 'width': state.imgWidth });
        //  hides the compass element
        AH.selectAll('.drawing_compass_svg', 'addClass', 'h');
        // removes all points points created using 'Add Focus Point' button
        accessibilityPoints = [];
        // removes values from array 'tempAccessPoints'
        tempAccessPoints = [];
    }

    // for changing the data when XML is changed manually 
    function parseXMLForGettingData() {
        // contains json data of the xml
        defaultXML = XMLToJSON(xml);
        auth_store.update((item) => {
            // sets the value of state bgImg to the value of key bgimg of json defaultXML
            item.bgImg = defaultXML.smxml._bgimg;
            // sets the value of state alt to the value of key imgAlt of json defaultXML
            item.alt = defaultXML.smxml._imgAlt;
            // sets the value of state imgWidth to the value of key width of json defaultXML
            item.imgWidth = defaultXML.smxml._width;
            // sets the value of state selectedTools to the value of key 'selectedDrawingType' after joining it with commam of json defaultXML
            item.selectedTools = defaultXML.smxml.div._selectedDrawingType.split(',');
            // sets the value of state cDATA to the value of subkey cdata of key div of json defaultXML
            item.cDATA = defaultXML.smxml.div.__cdata;
            // sets the value of state focusDATA to the value of subkey cdata of key backgroundPoint of json defaultXML
            item.focusDATA = defaultXML.smxml.backgroundPoint.__cdata;
            // sets the value of state markPointColor to the value of key markPointColor of json defaultXML
            item.markPointColor = defaultXML.smxml._markPointColor;
            // sets the value of state lineColor to the value of key color of json defaultXML
            item.lineColor = defaultXML.smxml._color;
            return item;
        })
        
        // to handle the errors
        try {
            AH.select('#authoring_point').innerText = 'Add Point';
            // this function set the default data
            setDefaultData();
            // sets the added point value to 0
            selectionPoint = 0;
            // removes all the sketch draw by drawing tools
            AH.select('.drawing_paths').innerHTML = '';
            // disabled the button undo, redo and clear 
            AH.select('#authoring_redo').disabled = true;
            AH.select('#authoring_undo').disabled = true;
            AH.select('#authoring_clearScreen').disabled = true;
            // clears the value of variable undoCount
            undoCount = 0;
            // clears the value of variable scribbleCount
            scribbleCount = 0;
            // assign the value 1 to the variable focusPointCount
            focusPointCount = 1;
            // clears the value of array variable scribblePath
            scribblePath = [];
            // assign the value of state cDATA to the variable updatedCDATA
            let updatedCDATA = state.cDATA;
            // replaces the character '!' to ',' and wraps the value into square bracket
            updatedCDATA = '[' + updatedCDATA.replace(/!/g, ',') + ']';
            // parses the string data of variable updatedCDATA into javascript object
            updatedCDATA = JSON.parse(updatedCDATA);
            // removes the point added by clicking on 'Add Point' button
            AH.selectAll('.resize', 'remove');
            // defines the length of the array selectionArray
            let selectionArrayLength = selectionArray.length;
            if (updatedCDATA.length > selectionArrayLength) {
                for (let index = 0; index < (updatedCDATA.length - selectionArrayLength); index++) {
                    // pushes the point into array selectionArray added by clicking on 'Add Point' button with center of x at 90, center of y at 68 and with radius 33
                    selectionArray.push({ Center_X: 90, Center_Y: 68, radius: 33 });
                }
            } else {
                for (let index = updatedCDATA.length; index < selectionArrayLength; index++) {
                    // popes the point from array selectionArray
                    selectionArray.pop();
                }
            }
            for (let index = 0; index < updatedCDATA.length; index++) {
                // increases the value of selectedPoint to indicate that how many points have been added
                selectionPoint++;
                // sets the center of x of the point added at last position of the array selectionArray
                selectionArray[selectionPoint - 1].Center_X = updatedCDATA[index].x;
                // sets the center of y of the point added at last position of the array selectionArray
                selectionArray[selectionPoint - 1].Center_Y = updatedCDATA[index].y;
                // sets the radius of the point added at last position of the array selectionArray
                selectionArray[selectionPoint - 1].radius = updatedCDATA[index].r;
                // adds the point to the drawing board at defined position
                AH.insert('#centerImg', '<div class="resize" data-point="' + (selectionPoint) + '" style="z-index: 10; left: ' + (updatedCDATA[index].x - updatedCDATA[index].r) + 'px; top: ' + (updatedCDATA[index].y - updatedCDATA[index].r) + 'px;width: ' + (2 * updatedCDATA[index].r) + 'px; height: ' + (2 * updatedCDATA[index].r) + 'px;"><div class="resizer icomoon-resize"></div></div>', 'beforeend');
                // updates the marking points xml after to resize or drag the points
                setPointDataInXML();
            }
            // contains the value of state focusDATA
            let updatedFocusCDATA = state.focusDATA;
            // contains the value of variable 'updatedFocusCDATA' after replacing character '!' to ',' and wrapping inside square bracket
            updatedFocusCDATA = '[' + updatedFocusCDATA.replace(/!/g, ',') + ']';
            // contains javascript object after parsing the string assigned into variable 'updatedFocusCDATA'
            updatedFocusCDATA = JSON.parse(updatedFocusCDATA);
            // removes the focus points and lines that joins the focus points
            AH.selectAll('.backgroundFocusPoint circle,.backgroundFocusPath path', 
            'remove');
            // makes array 'accessibilityPoints' to empty
            accessibilityPoints = [];
            for (let index = 0; index < updatedFocusCDATA.length; index++) {
                // pushes the object containing array of focus points lies in array updatedFocusCDATA at given index into array accessibilityPoints
                accessibilityPoints.push(updatedFocusCDATA[index][index]);
            }
            for (let index = 0; index < updatedFocusCDATA.length; index++) {
                for (let subPoints = 0; subPoints < updatedFocusCDATA[index][index].length; subPoints++) {
                    // updates the value of key x of multi dimention array object 'accessibilityPoints' where row and column values are value of variable 'index' and 'subPoints' with the value of key x of multi dimention array object updatedFocusCDATA where row and column values are the value of variables 'index' and 'subPoints'
                    accessibilityPoints[index][subPoints].x = updatedFocusCDATA[index][index][subPoints].x;
                    // updates the value of key y of multi dimention array object 'accessibilityPoints' where row and column values are value of variable 'index' and 'subPoints' with the value of key y of multi dimention array object updatedFocusCDATA where row and column values are the value of variables 'index' and 'subPoints'
                    accessibilityPoints[index][subPoints].y = updatedFocusCDATA[index][index][subPoints].y;
                    // Creates an element with the specified namespace URI and qualified name.
                    scribble = document.createElementNS(xmlns, 'circle');
                    // sets the stroke width and color of the drawing drawn by scribble drawing tool
                    setAuthColor('#808080', authThickness);
                    // adds a new attribute 'id' (with a namespace null)
                    scribble.setAttributeNS(null, 'id', 'focusPoint' + focusPointCount);
                    // adds a new attribute 'cx' (with a namespace null)
                    scribble.setAttributeNS(null, 'cx', accessibilityPoints[index][subPoints].x);
                    // adds a new attribute 'cy' (with a namespace null)
                    scribble.setAttributeNS(null, 'cy', accessibilityPoints[index][subPoints].y);
                    // adds a new attribute 'r' (with a namespace null)
                    scribble.setAttributeNS(null, 'r', '2px');
                    // place the scribble element before very first element inside the element have class 'backgroundFocusPoint'
                    AH.select('.backgroundFocusPoint').prepend(scribble);
                    // increases the value of variable 'focusPointCount' by 1
                    focusPointCount++;
                }
                // joins the focus points craeted by using 'Add focus Point' button
                joinFocusPoint(accessibilityPoints[index]);
            }

            if (selectionPoint == 0) {
                AH.select('#add_point_msg').classList.add('h');
            } else {
                AH.select('#add_point_msg').classList.remove('h');
            }

            if (AH.selectAll('.resize').length > 0) {
                // sets the value of variable 'authoringMode' to 'authoring_point'
                authoringMode = 'authoring_point';
                // sets the cursor style value as auto
                AH.setCss('#authoringSvg', {'cursor': 'auto'});
            } else {
                // removes the first character from string in state array selectedTools at index 0
                authoringMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
                // sets the cursor style to crosshair (+)
                AH.setCss('#authoringSvg', {'cursor': 'crosshair'});
                if (authoringMode == 'compass') {
                    // shows the compass tool
                    AH.selectAll('.drawing_compass_svg', 'removeClass', 'h');
                } else {
                    // hides the compass element
                    AH.selectAll('.drawing_compass_svg', 'addClass', 'h');
                }
            }

            AH.selectAll('.authoring_btn,#authoring_point,#focus_point' ,'removeClass' ,'active');
            AH.selectAll('[data-title="' + authoringMode + '"]' ,'addClass' ,'active');
        } catch (e) {
            console.warn({ e, func: 'parseXMLForGettingData'});
        }
    }

    // used to update the xml value according to the updation made in configuration modal box
    function parseXMLForSettingData(XML) {
        // contains json of xml data
        defaultXML = XMLToJSON(XML);
        // stores the value of background image into json of xml having key bgimg
        defaultXML.smxml._bgimg = state.bgImg;
        // stores the value of alt message of background image into json of xml having key imgAlt
        defaultXML.smxml._imgAlt = state.alt;
        // stores the value of the width of background image into json of xml having key width
        defaultXML.smxml._width = state.imgWidth;
        // stores the value of stroke color of drawing into json of xml having key color
        defaultXML.smxml._color = state.lineColor;
        // stores the value of point color of drawing into json of xml having key markPointColor
        defaultXML.smxml._markPointColor = state.markPointColor;
        // store the values of drawing tools after joining it using comma that can be used to draw the drawing into json of xml having key selectedDrawingType
        defaultXML.smxml.div._selectedDrawingType = selectedToolsArray.join(',');
        // blanks the value of key CDATA inside the key div of json xml to clean the drawing board 
        defaultXML.smxml.div.__cdata = '';
        // blanks the value of key CDATA inside the key backgroundPoint of json xml to clean the drawing board 
        defaultXML.smxml.backgroundPoint.__cdata = '';
        // converts json of the xml into xml
        defaultXML = JSONToXML(defaultXML);
        // changed the format of CDATA
        defaultXML = defaultXML.replace('<![CDATA[]]>', '<!--[CDATA[]]-->');
        // updates the xml
        getChildXml(defaultXML);
        // sets the value of state 'xml'
        state.xml = defaultXML;
    }

    // used to set the UI of the buttons and sketch or remove the drawing and adds focus point to access via keyboard
    function authoringMousedownDraw(event) {
        switch (authoringMode) {
            case 'line':
            case 'scribble':
                isDrawing = true;
                // used to set the x and y co-ordinate of the mouse position
                setMouseCoordinates(event);
                // Creates an element with the specified namespace URI and qualified name.
                scribble = document.createElementNS(xmlns, 'path');
                // sets the stroke width and color of the drawing drawn by scribble drawing tool
                setAuthColor(authColor, authThickness);
                // adds a new attribute 'data-type' (with a namespace null)
                scribble.setAttributeNS(null, 'data-type', authoringMode + '_' + scribbleCount);
                // adds a new attribute 'data-order' (with a namespace null)
                scribble.setAttributeNS(null, 'data-order', scribbleCount);
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', 'M' + auth_mouseX + ' ' + auth_mouseY);
                // contains the x position of the mouse co-ordinate
                checkCurrentPositionX = auth_mouseX;
                // contains the x position of the mouse co-ordinate
                checkCurrentPositionY = auth_mouseY;
                // pushes the object containing keys mode, order, type, index and d 
                scribblePath.push({
                    mode: 'add',
                    order: scribbleCount,
                    type: authoringMode + '_' + scribbleCount,
                    index: scribbleCount,
                    d: 'M' + auth_mouseX + ' ' + auth_mouseY
                });
                break;
            case 'eraser':
                if (AH.select('.currentSvg').nodeName && AH.select('.currentSvg').getAttribute("data-order") != undefined) {
                    // makes empty undo_list array
                    undo_list = [];
                    // defines variable 'tempArrayContainer'
                    let tempArrayContainer = '';
                    // contains the Index of the value at index returned by the 'data-order' attribute of the element has class 'currentSvg' in scribblePath array 
                    let currentIndex = scribblePath.indexOf(scribblePath[AH.select('.currentSvg').getAttribute("data-order")]);
                    // copies all enumerable own properties from objects defined into scribblePath array at given index to a target object
                    tempArrayContainer = Object.assign({}, scribblePath[currentIndex]);
                    // defines the value of key 'mode' to remove of tempArrayContainer object
                    tempArrayContainer.mode = "remove";
                    // pushes the object 'tempArrayContainer' into scribblePath array
                    scribblePath.push(tempArrayContainer);
                    // increases the value of variable 'scribbleCount' by 1
                    scribbleCount++;
                    // increases the value of variable 'undoCount' by 1
                    undoCount++;
                    // disabled the redo button
                    AH.select('#authoring_redo').disabled = true;
                    // removes the element have class 'currentSvg'
                    AH.selectAll('.currentSvg', 'remove');
                    if (AH.selectAll('.drawing_paths path').length == 0) {
                        // disabled the cross (x) button
                        AH.select('#authoring_clearScreen').disabled = true;
                    }
                }
                break;
            case 'markAccessibilityPoint':
                if (!isAccessibleMarking) {
                    // used to set the x and y co-ordinate of the mouse position
                    setMouseCoordinates(event);
                    // Creates an element with the specified namespace URI and qualified name.
                    scribble = document.createElementNS(xmlns, 'circle');
                    // sets the stroke width and color of the drawing drawn by scribble drawing tool
                    setAuthColor('#808080', authThickness);
                    // adds a new attribute 'id' (with a namespace null)
                    scribble.setAttributeNS(null, 'id', 'focusPoint' + focusPointCount);
                    // adds a new attribute 'cx' (with a namespace null)
                    scribble.setAttributeNS(null, 'cx', auth_mouseX);
                    // adds a new attribute 'cy' (with a namespace null)
                    scribble.setAttributeNS(null, 'cy', auth_mouseY);
                    // adds a new attribute 'r' (with a namespace null)
                    scribble.setAttributeNS(null, 'r', '2px');
                    // pushes the mouse x and y position into array 'tempAccessPoints' into json format
                    tempAccessPoints.push({
                        x: auth_mouseX,
                        y: auth_mouseY
                    });
                    // increases the value of the variable 'focusPointCount' by 1
                    focusPointCount++;
                    // prepend the element scribble into the element have class 'backgroundFocusPoint'
                    AH.select('.backgroundFocusPoint').prepend(scribble);
                }
                break;
        }
    }

    // function for opening the drawing modal and changing the modal values
    function openModal() {
        AH.getBS('#drawing-modal', 'Modal').show();
        AH.select('#backgroundImage').value = state.bgImg;
        if (state.lineColor != '') {
            // used to show the by default selected particular color from drawing color dropdown
            AH.select('#lineColor option[value="' + state.lineColor + '"]').selected = true;
        }
        if (state.markPointColor != '') {
            // used to show the by default selected particular color from point color dropdown
            AH.select('#markPointColor option[value="' + state.markPointColor + '"]').selected = true;
        }
        if (state.selectedTools.length > 0) {
            // uncheck the all drawing tools checkbox
            AH.selectAll('.toolCheckbox', 'checked', false)
            for (var toolsIndex = 0; toolsIndex < state.selectedTools.length; toolsIndex++) {
                // check that drawing tool checkbox which value exist in state array 'selectedTools'
                AH.select('[value="' + state.selectedTools[toolsIndex] + '"]').checked = true;
            }
        }
        AH.select('#imgWidth').value = state.imgWidth;
        AH.select('#imgAlt').value = state.alt;

        let inputs = AH.selectAll('.authoring-modal input');
        AH.selectAll('.error', 'remove');
        for (let index = 0; index < inputs.length; index++) {
            validateInput(inputs[index]);
        }
    }
</script>

<main>
    <div class="drawing_module_container">
        <center>
            <div class="mt-2 mb-2">
                <div class="btn-toolbar auth_drawing_toolbar" role="toolbar" aria-label={l.drawing_tools}>
                    <div tabindex="0" class="btn-group mr-2" role="group" aria-label={l.draw_tools}>
                        <button type="button" tabindex="0" data-title="scribble" title={l.scribble} name="authoring_scribble" id="authoring_scribble" class="btn btn-light auth_toolbar geometryTool tooltip_btn authoring_btn active"><i class="icomoon-pencil"></i></button>
                        <button type="button" tabindex="0" data-title="line" title={l.line} name="authoring_line" id="authoring_line" class="btn btn-light auth_toolbar geometryTool tooltip_btn authoring_btn">/</button>
                        <button type="button" tabindex="0" data-title="compass" title={l.compass} name="compass" id="authoring_compass" class="btn btn-light auth_toolbar geometryTool tooltip_btn authoring_btn"><i class="icomoon-compass1"></i></button>
                    </div>
                    <div tabindex="0" class="btn-group mr-2" role="group" aria-label={l.removing_tools}>
                        <button type="button" tabindex="0" data-title="eraser" title={l.delete_tool} name="eraser" id="authoring_eraser" class="btn btn-light auth_toolbar authoring_btn tooltip_btn"><i class="icomoon-delete-sm"></i></button>
                        <button type="button" title={l.clear_screen} tabindex="0"  name="clearScreen" id="authoring_clearScreen" disabled="disabled" class="btn btn-light tooltip_btn"><i class="icomoon-close-2"></i></button>
                        <button type="button" tabindex="0" title={l.redo} name="redo" id="authoring_redo" disabled="disabled" class="btn btn-light tooltip_btn"><i class="icomoon-redo-2"></i></button>
                        <button type="button" tabindex="0" title={l.undo} name="undo" id="authoring_undo" disabled="disabled" class="btn btn-light tooltip_btn"><i class="icomoon-undo-2"></i></button>
                    </div>
                    <div class="btn-group mr-2" role="group" aria-label={l.answer_point}>
                        <button type="button" tabindex="0" data-title="authoring_point" title={l.add_show_point} name="authoring_point" id="authoring_point" class="btn btn-light tooltip_btn">{l.add_point}</button>
                    </div>
                    <div class="btn-group mr-2" role="group" aria-label={l.access_mode}>
                        <button type="button" tabindex="0" title={l.add_finish_point} name="focus_point" id="focus_point" class="btn btn-light tooltip_btn">{l.add_focus_pnt}</button>
                    </div>
                    <div class="btn-group mr-2" role="group" aria-label={l.def_mode}>
                        <button type="button" tabindex="0" title={l.reset} name="default_button" id="reset_btn" class="btn btn-light tooltip_btn"><i class="icomoon-new-24px-reset-1"></i></button>
                    </div>
                </div>
                <div id="add_point_msg" class="text-danger my-1">{l.delete_point_msg}</div>
            </div>
            <div>
                <div id="centerImg" class="centerImg authCenterImg my-auto relative ml-0">
                    <div class="btn-group position-absolute setting_btn">
                        <button type="button" tabindex="0" title="Configuration" on:click={openModal} class="btn tooltip_btn btn-light p-1" >
                            <i class="icomoon-24px-settings-1"></i>
                        </button>
                    </div>
                    <img class="border" src={bgImgPath + state.bgImg} id="svgImg" alt={state.alt}/>
                    <svg width="100%" height="100%" id="authoringSvg" tabindex="0" aria-labelledby="authoringSvgTitle">
                        <title id="authoringSvgTitle">{state.alt}</title>
                        <g class="backgroundFocusPath"></g>
                        <g class="drawing_paths"></g>
                        <g class="backgroundFocusPoint"></g>
                        <svg class="drawing_compass_svg h" focusable="false">
                            <svg class="drawing-compass-wrapper">
                                <g>
                                    <circle class="drawing-compass-route compass_route" cx="267.984375" cy="173" r="80"></circle>
                                    <g>
                                        <line class="compass_rotationBar compass_radius" x1="267.984375" y1="173" x2="267.984375" y2="253"></line>
                                    </g>
                                    <g>
                                        <circle class="drawing_compass_center compass_center" cx="267.984375" cy="173" r="17" focusable="true" fill="url(#drawingCenter)"></circle>
                                        <defs>
                                            <pattern id="drawingCenter" width="20" height="20">
                                                <svg x="0px" y="0px" viewBox="1 -3 21 35" width="33" height="41">
                                                    <path fill="#808080" class="st0" d="M3.22,15.1L1,12l2.22-3.1C3.22,10.97,3.22,13.03,3.22,15.1z" />
                                                    <path fill="#808080" class="st0" d="M8.9,3.22L12,1l3.1,2.22C13.03,3.22,10.97,3.22,8.9,3.22z" />
                                                    <path fill="#808080" class="st0" d="M15.1,20.78L12,23l-3.1-2.22C10.97,20.78,13.03,20.78,15.1,20.78z" />
                                                    <path fill="#808080" class="st0" d="M20.78,8.9L23,12l-2.22,3.1C20.78,13.03,20.78,10.97,20.78,8.9z" />
                                                    <circle cx="12" cy="12" r="2" fill="#333333" />
                                                </svg>
                                            </pattern>
                                        </defs>
                                    </g>
                                    <g>
                                        <circle class="compass_radius_icon mid_circle" cx="267.984375" cy="213" r="17" fill="url(#drawingRadius)" transform="rotate(90,160,168)" focusable="true"></circle>
                                        <defs>
                                            <pattern id="drawingRadius" width="20" height="20">
                                                <svg x="0px" y="0px" viewBox="1 -5 21 34" width="33" height="33">
                                                    <g>
                                                        <g>
                                                            <rect x="8.53" y="1.11" width="1.5" height="21.79" />
                                                        </g>
                                                        <g>
                                                            <rect x="13.97" y="1.11" width="1.5" height="21.79" />
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g>
                                                            <path d="M5.87,16.87L1,12l4.87-4.87C5.87,10.38,5.87,13.62,5.87,16.87z" />
                                                        </g>
                                                        <g>
                                                            <path d="M18.13,16.87L23,12l-4.87-4.87C18.13,10.38,18.13,13.62,18.13,16.87z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </pattern>
                                        </defs>
                                    </g>
                                    <g>
                                        <circle class="compass_rotation midSmallCircle" cx="267.984375" cy="233" r="8" fill="url(#midSmallCircle_icon)" focusable="true" transform="rotate(90,160,193)"></circle>
                                        <defs>
                                            <pattern id="midSmallCircle_icon" width="20" height="20">
                                                <svg width="16px" height="16px" viewBox="0 0 14 14" version="1.1">
                                                    <path fill="#000" opacity="0.8" d="M7,14 C3.13400675,14 0,10.8659932 0,7 C0,3.13400675 3.13400675,0 7, 0 C10.8659932,0 14,3.13400675 14,7 C14,10.8659932 10.8659932,14 7, 14 Z M4.66666667,8.16666667 L7,11.6666667 L9.33333333,8.16666667 L4.66666667,8.16666667 Z M4.66666667,5.83333333 L9.33333333,5.83333333 L7,2.33333333 L4.66666667,5.83333333 Z"></path>
                                                </svg>
                                            </pattern>
                                        </defs>
                                    </g>
                                    <g >
                                        <circle class="drawing-compass-pointer lastCircle" cx="267.984375" cy="253" r="3" fill={state.lineColor} ></circle>
                                        <circle class="drawing-compass-pointer-border lastCircle last_big_circle" cx="267.984375" cy="253" r="17" focusable="true"></circle>
                                    </g>
                                    <g>
                                        <circle class="lastCircleMid" fill="url(#lastCircleMid_icon)" cx="267.984375" cy="293" r="12" opacity="0"></circle>
                                        <defs>
                                            <pattern id="lastCircleMid_icon" width="20" height="20">
                                                <svg width="24" height="23" viewBox="0 0 11 27" version="1.1" enableBackground="new 0 0 8 24">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.5">
                                                        <g transform="translate(-516.000000, -445.000000)" fill="#333333" fillRule="nonzero">
                                                            <g transform="translate(207.000000, 318.000000)">
                                                                <g transform="translate(313.742737, 140.576561) rotate(-2.000000) translate(-313.742737, -140.576561) translate(308.242737, 127.076561)">
                                                                    <path d="M3.76491276,22.4309727 C5.88207272,19.902578 7.10843487, 16.447736 7.10843487,12.7446281 C7.10843487,9.90533039 6.38974128, 7.20188959 5.07542401,4.93464319 L1.71316547,5.67221801 L4.9100909, 0.48305188 L10.1719173,3.81663137 L7.11351005,4.48755064 C8.4088902, 6.93966677 9.10843487,9.78181395 9.10843487,12.7446281 C9.10843487, 16.6677555 7.87827881,20.3638018 5.71250857,23.1972812 L8.63385425, 24.3467251 L2.93165771,26.8255625 L0.595287046,21.1838396 L3.76491276, 22.4309727 Z" class=""></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </pattern>
                                        </defs>
                                    </g>
                                </g>
                            </svg>
                        </svg>
                    </svg>
                </div>
            </div>
        </center>
        <DrawingModal l={l} />
    </div>
    <Dialog
		bind:visible={state.openDeleteDialog}
		style={'width:500px;background-color:#FFF;'}
	>
		<div>
			<div class="row">
				<span class="col-md-12" style={'margin-top:40px;margin-bottom:40px;text-align:center;'}>{l.del_confirmation}</span>
			</div>
		</div>
		<div slot="footer" class="svelteFooter" style={'width:100%;text-align:center;'}>	
			<input type="button" variant="contained" on:click={() => {state.openDeleteDialog = false}} class="btn btn-light colorgray" value="Cancel" />
            <Button variant="contained" on:click={resetModule}
				class="bg-primary text-white"> Yes </Button>
		</div>
    </Dialog>
</main>