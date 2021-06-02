<!--
 *  File Name   : DrawingPreview.svelte
 *  Description : Responsible for Preview Side functionality
 *  Author      : Ayush Srivastava
 *  Package     : clsSMDrawing (Preview)
 *  Last update : 09-April-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import { afterUpdate, onMount } from "svelte";
	import { AH , XMLToJSON} from '../helper/HelperAI.svelte';
    import l from '../src/libs/Lang';
    import swal from 'sweetalert';
	import { writable } from "svelte/store";
    // exporting the variables
    export let xml;
	export let uxml;
	export let isReview;
	export let showAns;
	export let editorState;

    let bgImgPath = 'https://s3.amazonaws.com/jigyaasa_content_static/';
    let xmlns = "http://www.w3.org/2000/svg";
    // denotes that drawing is not sketching
    let isDrawingPreview = false;
    // allow to draw the drawing using compass
    let isDrawCompassPreview = true;
    // indicates that starting position should be store when perform using keyboard and compass
    let isStoreStart = false;
    // indicates that drawing is not started
    let isDrawStop = 0;
    // shows that is drawing started by keyboard
    let startDrawingByKey = 0;
    // used to creates an element with the specified namespace URI and qualified name
    let scribble;
    // denotes mouse co-ordinates
    let preview_mouseX, preview_mouseY;
    // scribble drawing tool is enable
    let previewMode = 'scribble';
    // strike color of drawing
    let previewColor = '#00BCD4';
    // stroke width of the drawing
    let previewThickness = 5;
    // contains object that have key type, index, mode, order and d
    let previewScribblePath = [];
    // shows number of drawing sketched with the help of drawing tools
    let previewScribbleCount = 0;
    // contains current mouse x position
    let checkCurrentPositionX;
    // contains current mouse y position
    let checkCurrentPositionY;
    // denoes no of undo done
    let previewUndoCount = 0;
    // contains undo data
    let previewUndoList = [];
    // contains redo data
    let previewRedoList = [];
    // contains the focusPoints
    let accessibilityPointsPreview = [];
    // number of focus point exist
    let focusPointCountPreview = 1;
    // used for not focus on perticular point
    let lockFocus = 0;
    // denotes that scribble drawing is not sketching
    let isScribble = 0;
    // for compass variable
    // denotes x co-ordinate of the center
    let cx;
    // denotes y co-ordinate of the center
    let cy;
    // denotes x co-ordinate of the center of middle circle lies on rotationbar
    let midCircle_cx;
    // denotes y co-ordinate of the center of middle circle lies on rotationbar
    let midCircle_cy;
    // denotes x co-ordinate of the center of small middle circle lies on rotationbar
    let midSmallCircle_cx;
    // denotes y co-ordinate of the center of small middle circle lies on rotationbar
    let midSmallCircle_cy;
    // denotes x co-ordinate of the center of last circle lies on rotationbar
    let lastCircle_cx;
    // denotes y co-ordinate of the center of last circle lies on rotationbar
    let lastCircle_cy;
    // denotes x co-ordinate of the center of rotation indicator that can be seen after last circle on rotationbar
    let lastSmallCircle_cx;
    // denotes y co-ordinate of the center of rotation indicator that can be seen after last circle on rotationbar
    let lastSmallCircle_cy;
    // defines the compass radius
    let previewCompassRadius = 100;
    // denotes that compass is not moved
    let isPreviewCompassMove = false;
    // sets the default angle of compass
    let previewCompassAngle = 90;
    // denotes that compass radius not increased
    let isPreviewRadiusIncrease = 0;
    // denotes initial points co-ordinate
    let initialPoint = { x: null, y: null };
    // denotes final points co-ordinate
    let finalPoint = { x: null, y: null };
    // denotes no angle displaced
    let compassAngleDisplacement = { start: null, end: null };
    // denotes that is radius rotated
    let isPreviewRadiusRotate = 0;
    // y co-ordinate of the marked point
    let cursorTop = 50;
    // x co-ordinate of the marked point
    let cursorLeft = 50;
    // used for answer recording
    let defaultXML = '';
    let cdata = '';
    // denotes that answer is incorrect
    let isAnswerCorrect = false;
    // for marking
    let isMarking = 1;
    // contains the co-ordinates of marked point
    let markPoints = [];
    // denotes array of drawing tools
    let selectedToolsArray = ["_scribble", "_line", "_compass"];
    // for user answer
    let userAnsPath = [];
    // initial layout of user answer xml
    let userAnsXML = '<smans type="41"></smans>';
    // contains the x and y co-ordinate of the points marked by user
    let userMarkingPoint = [];
    // contains drawing sketched by user by the help of drawing tools
    let userDrawPath = [];
    // denotes that answer is incorrect
    let userAnsCorrect = false;
    // contains the co-ordinates of marked point
    let markPointsData = [];
    // for browsers
    let is_mac = false;

    let prev_store = writable({
        // contains status of the answer
        correctAnswer: false,
            // contains the xml of the props
        xml: '',
        // not used any where
        openImg: false,
        // not used any where
        openDrag: false,
        // denotes background image
        bgImg: 'useraccount_000ANv.png',
        // not used any where 
        cdata: '',
        // contains cdata value of backgroundPoint of smxml 
        focusDATA: '',
        // not used any where 
        userXML: '',
        // stroke color of the drawing sketch by the help of drawing tools
        lineColor: '#00BCD4',
        // contains drawing tools array
        selectedTools: selectedToolsArray,
        // denotes remediation mode is off
        remediationMode: 'off',
        // width of the background image
        imgWidth: "600",
        // alt message of background image
        alt: "Triangle image",
        // sets color of the mark points
        markPointColor: '#00ff00',
	});
    
    // subscribing the store in the state variable
    let state = {};
    const unsubscribe = prev_store.subscribe(value => {
		state = value;
	});

    // for adding all the necessary events and the css files
    onMount(async() => {
        let config = {
            preload: true,
            type: 'stylesheet',
            as: 'style'
        }
        AH.createLink(themeUrl + 'pe-items/svelte/clsSMDrawing/css/drawing.css', config);
        // checked for mac device
        is_mac = (navigator.userAgent.indexOf("Mac") != -1)
        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
        updatePreviewCompassCalculation(160, 118, 100, 90);

                
        AH.listen('body', 'click', '#set-review', function () {
            setReview()
        });

        AH.listen('body', 'click', '#unset-review', function () {
            unsetReview()
        });

        AH.listen('body', 'click', '#preview_reset_btn', function () {
            swal({
                text: l.reset_module,
                icon: "warning",
                buttons: true,
            }).then((value) => {
                if (value) {
                    // reset all the activity and makes it in initial condition as it looks like just after load
                    parseXMLForGettingData();
                    reinitializeFoucsEvent();
                }
            });
        });

        /** Start of key events **/
        // to stop scrolling of page by space and arrow keys
        AH.bind('body', 'keydown', function (event) {
            if (!editorState && (event.keyCode == 32 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)) {
                return false;
            }
        });

        AH.listen('body', 'keyup', '.previewKeySvg .previewDrawingPaths path', function (current, event) {
            if (event.keyCode == 46 || (event.keyCode == 8 && is_mac)) {
                // removes drawing on which keyup event triggered and update the user answer xml
                eraser(current, previewScribblePath);
            }
        });

        AH.listen('body', 'keyup', '.previewKeySvg', function (current, event) {
            if (event.keyCode == 90 && event.ctrlKey && ! AH.select('#preview_undo').disabled) {
                if (startDrawingByKey && isDrawStop) {
                    // stop the drawing and store the drawing sketched by the user and sets the user answer xml
                    stopDraw();
                }
                // click the undo button
                AH.select('#preview_undo').click();
            }
            if (event.keyCode == 89 && event.ctrlKey && ! AH.select('#preview_redo').disabled) {
                if (startDrawingByKey && isDrawStop) {
                    // stop the drawing and store the drawing sketched by the user and sets the user answer xml
                    stopDraw();
                }
                // click the redo button
                AH.select('#preview_redo').click();
            }
            if (event.keyCode == 88 && event.ctrlKey) {
                // click the clear screen (x) button
                AH.select('#preview_clearScreen').click();
            }
            if ((event.keyCode == 13 || event.keyCode == 32) && previewMode != 'compass' && previewMode != 'eraser') {
                // hides the icon (+) used to sketch the drawing using keyboard
                AH.select('#moveDrawIcon', 'removeClass', 'h');
                // sets the cursor style to auto
                AH.select('.previewKeySvg', 'css', {'cursor': 'auto'});
            }
            if (event.shiftKey && (event.keyCode == 13 || event.keyCode == 32) && AH.select('#moveDrawIcon').offsetHeight != 0) {
                if (previewMode == 'markPoints') {
                    // Creates an element with the specified namespace URI and qualified name.
                    scribble = document.createElementNS(xmlns, 'circle');
                    // sets the stroke color and width
                    setPreviewColor(state.markPointColor, previewThickness);
                    // adds a new attribute 'class' (with a namespace null)
                    scribble.setAttributeNS(null, 'class', 'answer_mark');
                    // adds a new attribute 'cx' (with a namespace null)
                    scribble.setAttributeNS(null, 'cx', cursorLeft);
                    // adds a new attribute 'cy' (with a namespace null)
                    scribble.setAttributeNS(null, 'cy', cursorTop);
                    // adds a new attribute 'r' (with a namespace null)
                    scribble.setAttributeNS(null, 'r', '2px');
                    // pushes the x and y co-ordinate of the mouse into markPoints array
                    markPoints.push({
                        x: cursorLeft,
                        y: cursorTop
                    });
                    // prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
                    AH.select('.previewMarkingPaths').prepend(scribble);
                    // checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
                    parseXMLForAnswer(false);
                    // updates user answer xml
                    createUXML();
                } else {
                    if (isDrawStop) {
                        // stop the drawing and store the drawing sketched by the user and sets the user answer xml
                        stopDraw();
                    } else {
                        startDrawingByKey = 1;
                        // removes the all mark points and sets the value of the variable 'isMArking' to 1
                        clearMarking();
                        // Creates an element with the value of variable xmlns namespace URI and 'path' name
                        scribble = document.createElementNS(xmlns, 'path');
                        // sets the stroke color and width
                        setPreviewColor(previewColor, previewThickness);
                        // adds a new attribute 'data-type' (with a namespace null)
                        scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);
                        // adds a new attribute 'data-order' (with a namespace null)
                        scribble.setAttributeNS(null, 'data-order', previewScribbleCount);
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', 'M' + cursorLeft + ' ' + cursorTop);
                        // adds a new attribute 'tabindex' (with a namespace null)
                        scribble.setAttributeNS(null, 'tabindex', '0');
                        // contains the cursor left position
                        checkCurrentPositionX = cursorLeft;
                        // contains the cursor top position
                        checkCurrentPositionY = cursorTop;
                        // pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
                        previewScribblePath.push({
                            // define that perticular sequence element will be removed or added on drawing board
                            mode: 'add',
                            // defines what is the sequence of perticular drawing on drawing board means when it is drawn then how many drawing already done and it starts with 0
                            order: previewScribbleCount,
                            // defines which drawing tool is used for sketch the drawing with its sequence on drawing board combind with underscore (_)
                            type: previewMode + '_' + previewScribbleCount,
                            // not used as its requirement completed by order key
                            index: previewScribbleCount,
                            // specify the position from where drawing will start
                            d: 'M' + cursorLeft + ' ' + cursorTop
                        });
                        // indicates that drawing is sketched
                        isDrawStop = 1;
                    }
                }
            }
        });

        AH.listen('body', 'keydown', '.previewKeySvg', function (current, event) {
            if (AH.select('#moveDrawIcon').offsetHeight) {
                // contains width of the background image
                let imageWidth = AH.select('#svgImgPreview').clientWidth;
                // contains width of the background image 
                let imageHeight = AH.select('#svgImgPreview').clientHeight;
                if (event.shiftKey && (event.keyCode == 38 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 40) && !lockFocus) {
                    switch (event.keyCode) {
                        case 38:
                            // decreases the value of variable cursorTop by 1 after down the up arrow key
                            cursorTop--;
                            break;
                        case 40:
                            // increases the value of variable cursorTop by 1 after down the down arrow key
                            cursorTop++;
                            break;
                        case 39:
                            // increases the value of variable cursorLeft by 1 after down the right arrow key
                            cursorLeft++;
                            break;
                        case 37:
                            // decreases the value of variable cursorLeft by 1 after down the left arrow key
                            cursorLeft--;
                            break;
                    }
                    if (cursorTop < 0 || cursorLeft > imageWidth || cursorLeft < 0 || cursorTop > imageHeight) {
                        return;
                    }
                    // sets the top and left position of the icon (+) used for sketch the drawing
                    AH.select('#moveDrawIcon', 'css', {
                        "top": cursorTop + 'px',
                        "left": cursorLeft + 'px'
                    });
                    if (startDrawingByKey) {
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop);
                        if (previewMode != 'line') {
                            // adds value of variables cursorLeft and cursorTop separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                            previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop;
                        }
                        // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                        AH.select('.previewDrawingPaths').prepend(scribble);
                        // sets the value of the variable isDrawStop by 1 to indicate that sketching of the drawing is stopped
                        isDrawStop = 1;
                    }
                }
                if (event.shiftKey && event.keyCode == 76) {
                    if (!lockFocus) {
                        // fixed the mark point from where drawing will be start when performed via keyboard
                        lockFocus = 1;
                        startDrawingByKey = 1;
                        // removes the all mark points and sets the value of the variable 'isMArking' to 1
                        clearMarking();
                        // contains the x co-ordinate of the mark point circle after converting it into number from string
                        cursorLeft = Number(AH.select('.currentFocusPoint').getAttribute('cx'));
                        // contains the y co-ordinate of the mark point circle after converting it into number from string
                        cursorTop = Number(AH.select('.currentFocusPoint').getAttribute('cy'));
                        // Creates an element with the value of variable xmlns namespace URI and 'path' name
                        scribble = document.createElementNS(xmlns, 'path');
                        // sets the stroke color and width
                        setPreviewColor(previewColor, previewThickness);
                        // adds a new attribute 'data-type' (with a namespace null)
                        scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);
                        // adds a new attribute 'data-order' (with a namespace null)
                        scribble.setAttributeNS(null, 'data-order', previewScribbleCount);
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', 'M' + cursorLeft + ' ' + cursorTop);
                        // adds a new attribute 'tabindex' (with a namespace null)
                        scribble.setAttributeNS(null, 'tabindex', '0');
                        // assign the value of current x position
                        checkCurrentPositionX = cursorLeft;
                        // assign the value of current y position
                        checkCurrentPositionY = cursorTop;
                        // pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
                        previewScribblePath.push({
                            mode: 'add',
                            order: previewScribbleCount,
                            type: previewMode + '_' + previewScribbleCount,
                            index: previewScribbleCount,
                            d: 'M' + cursorLeft + ' ' + cursorTop
                        });
                    } else {
                        // unlock the focus point
                        lockFocus = 0;
                        // stop the drawing and store the drawing sketched by the user and sets the user answer xml
                        stopDraw();
                    }
                }
                if (event.keyCode == 9 && lockFocus && (previewMode == 'line' || previewMode == 'scribble')) {
                    let drawLine = setTimeout(function () {
                        if (!AH.select('.currentFocusPoint').nodeName) {
                            return;
                        }
                        // contains the x co-ordinate of the mark point circle after converting it into number from string
                        cursorLeft = Number(AH.select('.currentFocusPoint').getAttribute('cx'));
                        // contains the y co-ordinate of the mark point circle after converting it into number from string
                        cursorTop = Number(AH.select('.currentFocusPoint').getAttribute('cy'));
                        if (isNaN(cursorLeft) && isNaN(cursorTop)) {
                            return;
                        }
                        if (previewMode == 'scribble' || previewMode == 'line') {
                            // indicates that scribble drawing is sketching
                            isScribble = 1;
                        }
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop);
                        // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                        AH.select('.previewDrawingPaths').prepend(scribble);
                        clearTimeout(drawLine);
                    }, 10)
                }
                if (event.keyCode == 68 && lockFocus && isScribble) {
                    let draw_scribble = setTimeout(function () {
                        if (isNaN(cursorLeft) && isNaN(cursorTop)) {
                            return;
                        }
                        // adds value of variables cursorLeft and cursorTop separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                        previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop;
                        // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                        AH.select('.previewDrawingPaths').prepend(scribble);
                        clearTimeout(draw_scribble);
                        // indicates that scribble drawing is not sketching
                        isScribble = 0;
                    }, 10)
                }

            }
        });
        
        AH.listen('body', 'keydown', '.previewKeySvg .drawingCompassCenter', function (current, event) {
            // change the center position of the compass element
            compassKeyEvent('move', event);
        });

        AH.listen('body', 'keydown', '.previewKeySvg .mid_circle', function (current, event) {
            // change the radius of the compass element
            compassKeyEvent('radius', event);
        });

        AH.listen('body', 'keydown', '.previewKeySvg .midSmallCircle', function (current, event) {
            // change the angle of the compass element when focus is on small middle circle
            compassKeyEvent('rotate', event);
        });

        AH.listen('body', 'keydown', '.previewKeySvg .lastCircle', function (current, event) {
            // change the angle of the compass element when focus is on last circle
            compassKeyEvent('draw', event);
        });
        
        AH.listen('body', 'keydown', '.focusPoints', function (current, event) {
            if (event.shiftKey && event.keyCode == 13) {
                return false;
            }
            if ((event.keyCode == 13 || event.keyCode == 32) && previewMode != 'markPoints' && previewMode != 'eraser') {
                // contains the x co-ordinate of the mark point circle after converting it into number from string
                cursorLeft = Number(AH.select('.currentFocusPoint').getAttribute('cx'));
                // contains the y co-ordinate of the mark point circle after converting it into number from string
                cursorTop = Number(AH.select('.currentFocusPoint').getAttribute('cy'));
                if (previewMode != 'compass') {
                    // sets the position of the icon (+) used to sketch the drawing by the help of keyboard
                    AH.select('#moveDrawIcon', 'css', {
                        "top": cursorTop + 'px',
                        "left": cursorLeft + 'px'
                    });
                } else {
                    // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                    updatePreviewCompassCalculation(cursorLeft, cursorTop, previewCompassRadius, previewCompassAngle);
                }
            }
        });

        AH.listen('body', 'keyup', '.previewKeySvg .lastCircle', function (current, event) {
            if (!isDrawCompassPreview && isStoreStart && event.keyCode == 16) {
                // stores the drawing sketched by user using keyboard and sets the user answer xml
                storeCompassPathByKey();
            }
        });

        /** End of key events **/
        
        AH.bind('.previewKeySvg .lastCircle', 'blur', function() {
            if (!isDrawCompassPreview && isStoreStart) {
                // stores the drawing sketched by user using keyboard and sets the user answer xml
                storeCompassPathByKey();
            }
        });

        AH.listen('body', 'mousedown', '#previewSvg .midSmallCircle', function () {
            if (previewMode == "compass") {
                // indicates that radius rotated
                isPreviewRadiusRotate = 1;
                // updates the value of compass radius and angle
                checkPreviewRadiusAndAngle();
                // contains the value of start angle
                compassAngleDisplacement.start = previewCompassAngle;
            }
        });

        AH.listen('body', 'mousedown', '#previewSvg .drawingCompassCenter', function () {
            if (previewMode == "compass") {
                // sets the x and y co-ordinate of the mouse position
                setPreviewMouseCoordinates(event)
                // contains x co-ordinate of the mouse
                cx = preview_mouseX;
                // contains y co-ordinate of the mouse
                cy = preview_mouseY;
                // contains radius of the compass
                previewCompassRadius = AH.select('.drawingCompassRoute').getAttribute('r');
                // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle);
                // indicates that compass is moved
                isPreviewCompassMove = true;
            }
        });

        AH.listen('body', 'mousedown', '#previewSvg .mid_circle', function () {
            if (previewMode == "compass") {
                // allows to change the value of radius of the compass
                isPreviewRadiusIncrease = 1;
            }
        });

        AH.listen('body', 'mousedown', '#previewSvg .lastCircle', function (current, event) {
            compassLastcircleEvent(event);
        });

        AH.listen('body', 'keydown', '#previewSvg .lastCircle', function (current, event) {
            compassLastcircleEvent(event);
        });

        // Mouse down event
        AH.listen('body', 'mousedown', '#previewSvg', function (current, event) {
            // sets the cursor style as crosshair (+)
            AH.select('#previewSvg', 'css' , {'cursor': 'crosshair'});
            // hides the icon used to sketch the drawing by the help of keyboard
            AH.select('#moveDrawIcon', 'addClass' , 'h');
            if (startDrawingByKey && isDrawStop || lockFocus) {
                // stop the drawing and store the drawing sketched by the user and sets the user answer xml
                stopDraw();
            }
            switch (previewMode) {
                case 'line':
                case 'scribble':
                    // removes the all mark points and sets the value of the variable 'isMArking' to 1
                    clearMarking();
                    // denotes that drawing is on going
                    isDrawingPreview = true;
                    // sets the x and y co-ordinate of the mouse position
                    setPreviewMouseCoordinates(event);
                    // Creates an element with the value of variable xmlns namespace URI and 'path' name
                    scribble = document.createElementNS(xmlns, 'path');
                    // sets the stroke color and width
                    setPreviewColor(previewColor, previewThickness);
                    // adds a new attribute 'data-type' (with a namespace null)
                    scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);
                    // adds a new attribute 'data-order' (with a namespace null)
                    scribble.setAttributeNS(null, 'data-order', previewScribbleCount);
                    // adds a new attribute 'd' (with a namespace null)
                    scribble.setAttributeNS(null, 'd', 'M' + preview_mouseX + ' ' + preview_mouseY);
                    // adds a new attribute 'tabindex' (with a namespace null)
                    scribble.setAttributeNS(null, 'tabindex', '0');
                    // contains the x co-ordinate of the mouse
                    checkCurrentPositionX = preview_mouseX;
                    // contains the y co-ordinate of the mouse
                    checkCurrentPositionY = preview_mouseY;
                    // pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
                    previewScribblePath.push({
                        mode: 'add',
                        order: previewScribbleCount,
                        type: previewMode + '_' + previewScribbleCount,
                        index: previewScribbleCount,
                        d: 'M' + preview_mouseX + ' ' + preview_mouseY
                    });
                    break;
                case 'eraser':
                    // removes drawing on which keyup event triggered and update the user answer xml
                    eraser('.currentSvg', previewScribblePath);
                    break;
                case 'markPoints':
                    if (!isMarking) {
                        // sets the x and y co-ordinate of the mouse position
                        setPreviewMouseCoordinates(event);
                        // Creates an element with the specified namespace URI and qualified name.
                        scribble = document.createElementNS(xmlns, 'circle');
                        // sets the stroke color and width
                        setPreviewColor(state.markPointColor, previewThickness);
                        // adds a new attribute 'class' (with a namespace null)
                        scribble.setAttributeNS(null, 'class', 'answer_mark');
                        // adds a new attribute 'cx' (with a namespace null)
                        scribble.setAttributeNS(null, 'cx', preview_mouseX);
                        // adds a new attribute 'cy' (with a namespace null)
                        scribble.setAttributeNS(null, 'cy', preview_mouseY);
                        // adds a new attribute 'r' (with a namespace null)
                        scribble.setAttributeNS(null, 'r', '2px');
                        // pushes the x and y co-ordinate of mouse into markPoints array
                        markPoints.push({
                            x: preview_mouseX,
                            y: preview_mouseY
                        });
                        // prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
                        AH.select('.previewMarkingPaths').prepend(scribble);
                        // checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
                        parseXMLForAnswer(false);
                        // updates user answer xml
                        createUXML();
                    }
                    break;
            }
        });

        // Mouse Move event
        AH.listen('body', 'mousemove', '#previewSvg', function (current, event) {
            switch (previewMode) {
                case 'line':
                    if (isDrawingPreview) {
                        // sets the x and y co-ordinate of the mouse position
                        setPreviewMouseCoordinates(event);
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY);
                        if (!(checkCurrentPositionX == preview_mouseX && checkCurrentPositionY == preview_mouseY)) {
                            // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                            AH.select('.previewDrawingPaths').prepend(scribble);
                        }
                    }
                    break;
                case 'scribble':
                    if (isDrawingPreview) {
                        // sets the x and y co-ordinate of the mouse position
                        setPreviewMouseCoordinates(event);
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY);
                        // adds value of variables preview_mouseX and preview_mouseY separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                        previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY;
                        if (!((previewScribblePath[previewScribbleCount].d.split('L').length - 1) < 3)) {
                            // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                            AH.select('.previewDrawingPaths').prepend(scribble);
                        }
                    }
                    break;
                case 'compass':
                    // sets the x and y co-ordinate of the mouse position
                    setPreviewMouseCoordinates(event)
                    if (isPreviewCompassMove) {
                        // contains the x co-ordinate of the mouse 
                        cx = preview_mouseX;
                        // contains the y co-ordinate of the mouse 
                        cy = preview_mouseY;
                        // contains radius of the compass
                        previewCompassRadius = AH.select('.drawingCompassRoute').getAttribute('r');
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle);
                    }
                    if (isPreviewRadiusIncrease) {
                        // updates the value of compass radius and angle
                        checkPreviewRadiusAndAngle();
                        // calculates the radius by the help of start and end points co-ordinate of the rotation bar
                        previewCompassRadius = 2 * Math.sqrt(Math.pow(preview_mouseX - initialPoint.x, 2) + Math.pow(preview_mouseY - initialPoint.y, 2))
                        if (previewCompassRadius < 80) {
                            // sets the value 80 of the variable previewCompassRadius
                            previewCompassRadius = 80;
                        }
                        if (previewCompassRadius > 360) {
                            // sets the value 360 of the variable previewCompassRadius
                            previewCompassRadius = 360;
                        }
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updatePreviewCompassCalculation(initialPoint.x, initialPoint.y, previewCompassRadius, previewCompassAngle);
                    }

                    if (isPreviewRadiusRotate) {
                        // updates the value of compass radius and angle
                        checkPreviewRadiusAndAngle();
                        // calculates the angle by the help of start and end points co-ordinate of the rotation bar
                        previewCompassAngle = Math.atan2(preview_mouseY - initialPoint.y, preview_mouseX - initialPoint.x) * 180 / Math.PI;
                        if (previewCompassAngle < 0) {
                            // adds 360 into the value of the variable previewCompassAngle
                            previewCompassAngle = 360 + previewCompassAngle;
                        }
                        // contains the value of end angle
                        compassAngleDisplacement.end = previewCompassAngle;
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updatePreviewCompassCalculation(initialPoint.x, initialPoint.y, previewCompassRadius, previewCompassAngle);
                    }
                    if (isDrawingPreview) {
                        if (!(AH.select('#previewSvg .lastCircle').classList.contains('lastCircle_hover') || AH.select('#previewSvg .lastbigcircle').classList.contains('lastCircle_hover'))) {
                            // trigger the event mouseleave on the element have id previewSvg
                            previewMouseLeave(event);
                        } else {
                            // adds a new attribute 'd' (with a namespace null)
                            scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);
                            // adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                            previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;
                            if (!((previewScribblePath[previewScribbleCount].d.split('L').length - 1) < 4)) {
                                // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                                AH.select('.previewDrawingPaths').prepend(scribble);
                            }
                        }
                    }
                    break;
            }
        });

        // Mouse Up Event
        AH.listen('body', 'mouseup', '#previewSvg', function (current, event) {
            previewMouseLeave(event);
        });

        // Mouse leave Event
        AH.bind('#previewSvg', 'mouseleave', function (event) {
            previewMouseLeave(event);
        });

        // For toolbar
        AH.listen('body', 'click', '.preview_toolbar', function (current, event) {
            toolbarAction(current, event);
        });

        AH.listen('body', 'keyup', '.preview_toolbar', function (current, event) {
            toolbarAction(current, event);
        });

        
        AH.listen('body', 'mouseover', '.previewDrawingPaths path', function (current) {
            if (previewMode == 'eraser') {
                // removes the class currentSvg from the element 'path' inside the element have class 'previewDrawingPaths'
                AH.selectAll('.previewDrawingPaths path', 'removeClass' , 'currentSvg');
                // adds the class 'currentSvg' to the element 'path' inside the element have class 'previewDrawingPaths' on which mouseover
                current.classList.add('currentSvg');
            }
        });

        AH.listen('body', 'mouseout', '.previewDrawingPaths path', function (current) {
            if (previewMode == 'eraser') {
                // removes the class 'currentSvg' to the element 'path' inside the element have class 'previewDrawingPaths' on which mouseout
                current.classList.remove('currentSvg');
            }
        });

        // last circle events
        AH.listen('body', 'mousemove', '#previewSvg .lastCircle', function (current) {
            // adds the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
            current.classList.add("lastCircle_hover");
            // shows the rotational indicator
            AH.selectAll('#previewSvg .lastCircleMid', 'attr' , {'opacity': 1});
        });
        
        AH.listen('body', 'mouseout', '#previewSvg .lastCircle', function (current) {
            // removes the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
            current.classList.remove("lastCircle_hover");
            // hides the rotational indicator
            AH.selectAll('#previewSvg .lastCircleMid', 'attr' , {'opacity': 0});
        });

        AH.listenAll('#previewSvg .lastCircle', 'focus', function (current) {
            // adds the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
            current.target.classList.add("lastCircle_hover");
            // shows the rotational indicator
            AH.selectAll('#previewSvg .lastCircleMid', 'attr' , {'opacity': 1});
        });
        
        AH.listenAll('#previewSvg .lastCircle', 'blur',function (current) {
            // removes the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
            current.target.classList.remove("lastCircle_hover");
            // hides the rotational indicator
            AH.selectAll('#previewSvg .lastCircleMid', 'attr' , {'opacity': 0});
        });

        // for changing the active buttons
        AH.listen('body', 'click', '.preview_btn', function (current) {
            // removes the class active from drawing tools, delete and  'Mark Points' buttons
            AH.selectAll('.preview_btn, #mark_points', 'removeClass', 'active');
            // adds the class active which is clicked
            current.classList.add('active');
        });

        // for clearing the screen
        AH.listen('body', 'click', '#preview_clearScreen', function () {
            // makes drawing container empty in which drawing is done by using drawing tools
            AH.selectAll('.previewDrawingPaths path', 'remove');
            // sets the value of variable 'previewUndoCount' to  0
            previewUndoCount = 0;
            // sets the value of variable 'previewScribbleCount' to  0
            previewScribbleCount = 0;
            // makes array 'previewScribblePath' empty to denote that no drawing is sketched
            previewScribblePath = [];
            // contains copy of array previewScribblePath
            let tempArrayContainer = arrayCopy(previewScribblePath);
            // stores the drawing sketched by user and sets the user answer xml
            storeUserPaths(tempArrayContainer);
            // disabled the undo, redo, cross (x) buttons
            AH.select('#preview_undo').disabled = true;
            AH.select('#preview_redo').disabled = true;
            AH.select('#preview_clearScreen').disabled = true;
        });

        // for undo
        AH.listen('body', 'click', '#preview_undo', function (current) {
            if (previewUndoCount == 1) {
                // disabled the undo button
                current.disabled = true;
            }
            // enabled the redo button
            AH.select('#preview_redo').disabled = false;
            if (previewScribblePath[previewScribblePath.length - 1].mode == 'add') {
                // removes the element that have data-order attribute and value of this attribute is equals to subtacting 1 from the value of length of the array previewScribblePath, means removes the last drawing sketched by the help of drawing tools
                AH.selectAll('#previewSvg [data-order="' + (previewScribblePath.length - 1) + '"]', 'remove');
            } else if (previewScribblePath[previewScribblePath.length - 1].mode == 'remove') {
                // Creates an element with the value of variable xmlns namespace URI and 'path' name
                scribble = document.createElementNS(xmlns, 'path');
                // sets the stroke color and width
                setPreviewColor(previewColor, previewThickness);
                // adds a new attribute 'data-type' (with a namespace null)
                scribble.setAttributeNS(null, 'data-type', previewScribblePath[previewScribblePath.length - 1].type);
                // adds a new attribute 'data-order' (with a namespace null)
                scribble.setAttributeNS(null, 'data-order', (previewScribblePath[previewScribblePath.length - 1].order));
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribblePath.length - 1].d);
                // adds a new attribute 'tabindex' (with a namespace null)
                scribble.setAttributeNS(null, 'tabindex', '0');
                if (previewMode == 'eraser') {
                    // adds a new attribute 'class' (with a namespace null)
                    scribble.setAttributeNS(null, 'class', 'eraserHover');
                }
                // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                AH.select('.previewDrawingPaths').prepend(scribble);
            }
            // pushes the last data of array previewScribblePath into array previewUndoList
            previewUndoList.push(previewScribblePath.pop());
            // contains copy of array previewScribblePath
            let tempArrayContainer = arrayCopy(previewScribblePath);
            // stores the drawing sketched by user and sets the user answer xml
            storeUserPaths(tempArrayContainer);
            // decreases the value of the variable previewScribbleCount by 1
            previewScribbleCount--;
            // decreases the value of the variable previewUndoCount by 1
            previewUndoCount--;
            
            AH.select('#preview_clearScreen').disabled = (AH.selectAll('.previewDrawingPaths path').length == 0);
            if (previewScribblePath.length == 0) {
                // disabled the undo button
                current.disabled = true;
            }
        });

        // for redo
        AH.listen('body', 'click', '#preview_redo', function (current) {
            // increases the value of the variable previewScribbleCount by 1
            previewScribbleCount++;
            if (previewUndoList.length > 0) {
                // pushes the last data of array previewUndoList into array previewRedoList
                previewRedoList.push(previewUndoList.pop());
            }
            if (previewRedoList[previewRedoList.length - 1].mode == 'add') {
                // Creates an element with the value of variable xmlns namespace URI and 'path' name
                scribble = document.createElementNS(xmlns, 'path');
                // sets the stroke color and width
                setPreviewColor(previewColor, previewThickness);
                // adds a new attribute 'data-type' (with a namespace null)
                scribble.setAttributeNS(null, 'data-type', previewRedoList[previewRedoList.length - 1].type);
                // adds a new attribute 'data-order' (with a namespace null)
                scribble.setAttributeNS(null, 'data-order', (previewRedoList[previewRedoList.length - 1].order));
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', previewRedoList[previewRedoList.length - 1].d);
                // adds a new attribute 'tabindex' (with a namespace null)
                scribble.setAttributeNS(null, 'tabindex', '0');
                if (previewMode == 'eraser') {
                    // adds a new attribute 'class' (with a namespace null)
                    scribble.setAttributeNS(null, 'class', 'eraserHover');
                }
                // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                AH.select('.previewDrawingPaths').prepend(scribble);
            } else if (previewRedoList[previewRedoList.length - 1].mode == 'remove') {
                // removes the element that have data-order attribute and value of this attribute is equals to the value of order key of the last index value of array previewRedoList, means removes the last drawing stored in array previewRedoList
                AH.selectAll('#previewSvg [data-order="' + (previewRedoList[previewRedoList.length - 1].order) + '"]', 'remove');
            }
            // increases the value of the variable previewUndoCount by 1
            previewUndoCount++;
            // pushes the last data of array previewRedoList into array previewScribblePath
            previewScribblePath.push(previewRedoList.pop());
            // contains copy of array previewScribblePath
            let tempArrayContainer = arrayCopy(previewScribblePath);
            // stores the drawing sketched by user and sets the user answer xml
            storeUserPaths(tempArrayContainer);
            
            AH.select('#preview_clearScreen').disabled = (AH.selectAll('.previewDrawingPaths path').length == 0);
            if (previewUndoList.length == 0) {
                // disabled the redo button
                current.disabled = true;
            }

            // enabled the undo button
            AH.select('#preview_undo').disabled = false;
        });

        AH.listen('body', 'click', '#mark_points', function (current, event) {
            markPointEvent(event);
        });

        AH.listen('body', 'keyup', '#mark_points', function (current, event) {
            markPointEvent(event);
        });

    });

    // call the function after update in the store/state
    afterUpdate(async()=>{
        // for changing the xml and loading the module according to the xml
        if (state.xml != xml) {
            parseXMLForGettingData();
            state.xml = xml;
            reinitializeFoucsEvent();
            checkUserAns();
        }
        // for calling the setreview and unsetreview function on change of review mode
        if (state.review != isReview && editorState) {
            prev_store.update( (item) => {
                item.review = isReview;
                return item;
            });
            if (isReview) {
                setReview();
            } else {
                unsetReview();
            }
        }
    });

    // function responsible for the compass lastcircle keyevent
    function compassLastcircleEvent(event) {
        if (isScribble) {
            stopDraw();
        }
        if (event.shiftKey) {
            if (!isDrawCompassPreview) return;
            // sets the value  false of the variable isDrawCompassPreview
            isDrawCompassPreview = false;
            // sets the value true of the variable isStoreStart to store the starting position
            isStoreStart = true;
            // adds class lastCircle_hover to the last circle on the rotation bar
            AH.selectAll('#previewSvg .lastCircle', 'addClass', 'lastCircle_hover');
        }
        if ((previewMode == "compass" && event.type == "mousedown") || (event.shiftKey)) {
            // removes the all mark points and sets the value of the variable 'isMArking' to 1
            clearMarking();
            // sets the cursor style to grabbing when mouse reached inside last circle on the rotation bar
            AH.selectAll('#previewSvg .lastCircle','css', {'cursor': 'grabbing'});
            if (isDrawCompassPreview || event.type == "mousedown") {
                // indicates that drawing is sketching
                isDrawingPreview = true;
                // indicates that radius is rotating
                isPreviewRadiusRotate = 1;
            }
            // updates the value of compass radius and angle
            checkPreviewRadiusAndAngle();
            // contains the value of start angle
            compassAngleDisplacement.start = previewCompassAngle;
            // Creates an element with the value of variable xmlns namespace URI and 'path' name
            scribble = document.createElementNS(xmlns, 'path');
            // sets the stroke color and width
            setPreviewColor(previewColor, previewThickness);
            // adds a new attribute 'data-type' (with a namespace null)
            scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);
            // adds a new attribute 'data-order' (with a namespace null)
            scribble.setAttributeNS(null, 'data-order', previewScribbleCount);
            // adds a new attribute 'd' (with a namespace null)
            scribble.setAttributeNS(null, 'd', 'M' + lastCircle_cx + ' ' + lastCircle_cy);
            // adds a new attribute 'tabindex' (with a namespace null)
            scribble.setAttributeNS(null, 'tabindex', '0');
            // contains current x position
            checkCurrentPositionX = lastCircle_cx;
            // contains current y position
            checkCurrentPositionY = lastCircle_cy;
            // pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
            previewScribblePath.push({
                mode: 'add',
                order: previewScribbleCount,
                type: previewMode + '_' + previewScribbleCount,
                index: previewScribbleCount,
                d: 'M' + lastCircle_cx + ' ' + lastCircle_cy
            });
        }
    }

    // for adding the focus and blur event
    function reinitializeFoucsEvent() {
        AH.listenAll('.focusPoints', 'focus', function (event) {
            // removes the class currentFocusPoint from the elements have class focusPoints
            AH.selectAll('.focusPoints', 'removeClass', 'currentFocusPoint');
            // adds the class currentFocusPoint to the element which got the focus and have class focusPoints 
            event.target.classList.add('currentFocusPoint');
        });
        AH.listenAll('.focusPoints', 'blur', function () {
            // removes the class currentFocusPoint from the elements have class focusPoints
            AH.selectAll('.focusPoints', 'removeClass', 'currentFocusPoint');
        });
    }

    // for adding the mark point from the key event
    function markPointEvent(event) {
        if (event.screenX == undefined) {
                return;
        }
        if (startDrawingByKey && isDrawStop) {
            // stop the drawing and store the drawing sketched by the user and sets the user answer xml
            stopDraw();
        }
        if ((event.keyCode == 13 || event.keyCode == 32 || event.screenX === 0)) {
            // stops the events from being bubbled
            event.preventDefault();
            // joins the marked points by the help of line that starts with first mark point and ends at last masked point by moving in sequencial order
            markFinalPoints();
            if (isMarking) {
                // hides plus icon (+) that is used for sketch the graph via keyboard
                AH.select('#moveDrawIcon', 'addClass', 'h');
                // sets the cursor style to crosshair (+)
                AH.select('#previewSvg', 'css', {'cursor': 'crosshair'});
            } else {
                // shows plus icon (+) that is used for sketch the graph via keyboard
                AH.select('#moveDrawIcon', 'removeClass', 'h');

                // sets the cursor style to auto
                AH.select('#previewSvg', 'css', {'cursor': 'auto'});

            }
        } else if (event.type == 'click' && event.screenX !== 0) {
            // joins the marked points by the help of line that starts with first mark point and ends at last masked point by moving in sequencial order
            markFinalPoints();
        }
    }

    // this function calls whenever there is click on toolbar buttons
    function toolbarAction(current, event) {
        if (isScribble) {
            stopDraw();
        }
        if (event.type == 'click' || (event.keyCode == 13 || event.keyCode == 32)) {
            // assign the value of the data-title attribute of the drawing tool buttons or of delete button on which is clicked or on which keyuped
            previewMode = current.getAttribute('data-title');
            // sets the style of the cursor to crosshair (+)
            AH.select('#previewSvg', 'css', {'cursor': 'crosshair'});
            // hides the icon (+) that is used for sketch the drawing by the help of keyboard
            AH.select('#moveDrawIcon', 'addClass', 'h');
            // sets the value 0 of variable startDrawingByKey to indicate that drawing is not started by the keyboard
            startDrawingByKey = 0;
            // sets the value of the variable isDrawStop by 0 to indicate that sketching of the drawing either not started or in progress
            isDrawStop = 0;
            if (previewMode == 'eraser') {
                // adds the class eraserHover to the element path that contains the drawing sketched by the help of drawing tools
                AH.selectAll('.previewDrawingPaths path', 'addClass', 'eraserHover');
            } else {
                // removes the class eraserHover to the element path that contains the drawing sketched by the help of drawing tools
                AH.selectAll('.previewDrawingPaths path', 'removeClass', 'eraserHover');
            }
            // hides the compass element
            AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
            if (previewMode == 'compass') {
                // shows the compass tool
                AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
            }
            // removes the all mark points and sets the value of the variable 'isMArking' to 1
            clearMarking();
        }
        if ((event.keyCode == 13 || event.keyCode == 32) && previewMode != 'eraser' && previewMode != 'compass') {
            // hides the icon (+), which is used to sketch the drawing using keyboard
            AH.select('#moveDrawIcon', 'removeClass', 'h');
            // sets the cursor style auto
            AH.select('#previewSvg', 'css', {'cursor': 'auto'});
        }
        if (startDrawingByKey && isDrawStop) {
            // stop the drawing and store the drawing sketched by the user and sets the user answer xml
            stopDraw();
        }
    }

    // this function calls when we are leaving the drawable area or on mouseup
    function previewMouseLeave(event) {
        switch (previewMode) {
                case 'line':
                case 'scribble':
                    if (isDrawingPreview) {
                        // sets the x and y co-ordinate of the mouse position
                        setPreviewMouseCoordinates(event);
                        if (lockFocus && ((checkCurrentPositionX == preview_mouseX && checkCurrentPositionY == preview_mouseY && previewMode == 'line') || (previewMode == 'scribble' && ((previewScribblePath[previewScribbleCount].d.split('L').length - 1) < 3)))) {
                            // removes the last element from the array previewScribblePath
                            previewScribblePath.pop();
                        }
                        if ((checkCurrentPositionX == preview_mouseX && checkCurrentPositionY == preview_mouseY && previewMode == 'line') || (previewMode == 'scribble' && ((previewScribblePath[previewScribbleCount].d.split('L').length - 1) < 3))) {
                            // removes the last element from the array previewScribblePath
                            previewScribblePath.pop();
                        } else {
                            // adds a new attribute 'd' (with a namespace null)
                            scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY);
                            // adds value of variables preview_mouseX and preview_mouseY separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                            previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY;
                            // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                            AH.select('.previewDrawingPaths').prepend(scribble);
                            // increases the value of the variable previewScribbleCount by 1 
                            previewScribbleCount++;
                            // increases the value of the variable previewUndoCount by 1 
                            previewUndoCount++;
                            // makes array previewUndoList blank
                            previewUndoList = [];
                            // enabled clear screen and undo button
                            AH.select('#preview_clearScreen').disabled = false;
                            AH.select('#preview_undo').disabled = false;
                            // disabled redo button
                            AH.select('#preview_redo').disabled = true;
                        }
                    }
                    // sets the value false of the variable isDrawingPreview 
                    isDrawingPreview = false;
                    break;
                case 'compass':
                    // indicates that radius is not increased
                    isPreviewRadiusIncrease = 0;
                    // indicates that radius is not rotated
                    isPreviewRadiusRotate = 0;
                    if (isPreviewCompassMove) {
                        // sets the x and y co-ordinate of the mouse position
                        setPreviewMouseCoordinates(event)
                        // contains the x co-ordinate of the mouse position
                        cx = preview_mouseX;
                        // contains the y co-ordinate of the mouse position
                        cy = preview_mouseY;
                        // contains radius of the compass
                        previewCompassRadius = AH.select('.drawingCompassRoute').getAttribute('r');
                        // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                        updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle);
                        // indicates that compass is not moved
                        isPreviewCompassMove = false;
                    }
                    if (isDrawingPreview) {
                        if ((previewScribblePath[previewScribbleCount].d.split('L').length - 1) < 4) {
                            // removes the last element from the array previewScribblePath
                            previewScribblePath.pop();
                        } else {
                            // adds a new attribute 'd' (with a namespace null)
                            scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);
                            // adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                            previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;
                            // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                            AH.select('.previewDrawingPaths').prepend(scribble);
                            // increases the value of the variable previewScribbleCount by 1
                            previewScribbleCount++;
                            // increases the value of the variable previewUndoCount by 1
                            previewUndoCount++;
                            // makes array previewUndoList blank
                            previewUndoList = [];
                            // enabled clear screen (x) and undo button
                            AH.select('#preview_clearScreen').disabled = false;
                            AH.select('#preview_undo').disabled = false;
                            // disabled the redo button
                            AH.select('#preview_redo').disabled = true;
                        }
                        // sets value false of variable isDrawingPreview
                        isDrawingPreview = false
                    }
                    // sets the cursor style to grab when it lies on last circle on the rotation bar
                    AH.selectAll('#previewSvg .lastCircle', 'css' , {'cursor': 'grab'});
                    break;
            }
            // contains copy of array previewScribblePath
            let tempArrayContainer = arrayCopy(previewScribblePath);
            // stores the drawing sketched by user and sets the user answer xml
            storeUserPaths(tempArrayContainer);
    }

    // checks the answer and shows the status of the answer
    function setReview() {
        isReview = true;
        if (startDrawingByKey && isDrawStop || lockFocus) {
            // stop the drawing and store the drawing sketched by the user and sets the user answer xml
            stopDraw();
        }
        if (!isDrawCompassPreview && isStoreStart) {
            // stores the drawing sketched by user using keyboard and sets the user answer xml
            storeCompassPathByKey();
        }
        // checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
        parseXMLForAnswer(true);
        // contains the value of state array selectedTools at index 0 after removing the first character 
        previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
        // removes the class active from drawing tools, delete, and 'Mark Points' or 'Finish Marking' buttons
        AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');
        // adds the class active to the drawing tool button which exist at index 0 in state array selectedTools
        AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');
        if (previewMode == 'compass') {
            // shows the compass tool
            AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
        } else {
            // hides the compass tool
            AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
        }

        state.remediationMode = 'on'
        
        AH.selectAll('.previewBtnGrp', 'addClass', 'h');
        // sets the value 'none' of the variable previewMode
        previewMode = 'none';
        // not allowed user to perform the task
        AH.selectAll('.preview_drawing_container', 'css', {pointerEvents: "none"});
        // removes the class previewKeySvg from the svg element have id previewSvg
        AH.select('#previewSvg', 'removeClass', 'previewKeySvg');

        // removes the marked points and also the path that is sketched by the help of mark points
        AH.selectAll('.previewMarkingPaths .answer_mark', 'remove');
        // updates user answer xml
        createUXML();
        // draw the marked points and the lines connecting to these points
        addMarkPointOnLoad(JSON.parse(markPointsData));
        // sets the tabindex and aria-label to the elements have class 'answer_mark' and tag name is path
        AH.selectAll('path.answer_mark','attr',{
            'tabindex': '0',
            'aria-labelledby': 'answerLine'
        })
        if (state.correctAnswer) {
            // append the title element inside the element previewMarkingPaths with correct message
            AH.insert('.previewMarkingPaths','<title id="answerLine">' + l.ans_correct + '</title>', 'beforeend');
            // sets the stroke color of the mark points to #0F9D58
            AH.selectAll('.answer_mark', 'css', {'stroke': '#0F9D58'});
        } else {
            // append the title element inside the element previewMarkingPaths with incorrect message
            AH.insert('.previewMarkingPaths','<title id="answerLine">' + l.ans_incorrect + '</title>', 'beforeend');
            // sets the stroke color of the mark points to red
            AH.selectAll('.answer_mark', 'css', {'stroke': '#FF0000'});
            // sets the stroke color of the answer point to #0F9D58
            AH.selectAll('.answer_circle', 'css', {'stroke': '#0F9D58'});
        }
    }

    // allowed user to perform the task and changes the stroke color of mark points 
    function unsetReview() {
        isReview = false;
        // allowed user to perform the task
        AH.selectAll('.preview_drawing_container','css', {pointerEvents : ""});
        // shows all buttons
        AH.selectAll('.previewBtnGrp', 'removeClass', 'h')
        // adds the class previewKeySvg to the svg element have id previewSvg
        AH.select('#previewSvg','addClass', 'previewKeySvg');
        // contains the value of state array selectedTools at index 0 after removing the first character
        previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
        // it's also used below in this function so it can be removed
        AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');
        // it's also used below in this function so it can be removed
        AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');
        if (previewMode == 'compass') {
            // shows compass tool
            AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
            // sets the style of the cursor to crosshair (+)
            AH.select('#previewSvg', 'css', {'cursor': 'crosshair'});
            // hides the icon (+) which is used to sketch the drawing using keyboard
            AH.select('#moveDrawIcon', 'addClass', 'h');
        } else {
            // hides compass tool
            AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
        }
        // removes the class active from drawing tools, delete, and 'Mark Points' or 'Finish Marking' buttons
        AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');
        // adds the class active to the drawing tool button which exist at index 0 in state array selectedTools
        AH.selectAll('#preview' + state.selectedTools[0], 'addClass', 'active');
        // removes the correct answer circle that can be seen on remediation mode in green stroke color
        AH.selectAll('.correct_answer_container .answer_mark', 'remove');
        // enables the element have id mark_points and updates its text as 'Mark Points'
        AH.select('#mark_points').innerText = 'Mark Points';
        AH.select('#mark_points').disabled = false;
        // sets the value of the variable 'isMarking' to 1
        isMarking = 1;
        state.remediationMode = 'off';
        // removes the title element inside the element have class previewMarkingPaths
        AH.selectAll('.previewMarkingPaths title', 'remove');
        // sets the value state markPointColor into the value of attribute stroke of the element have class answer_mark and removes attribute tabindex
        AH.selectAll('.answer_mark', 'css', {'stroke' : state.markPointColor});
        AH.selectAll('.answer_mark','removeAttr','tabindex');
    }

    // parses the xml and updates the values of variables and states and width, src, alt of the background image, shows the enabled drawing tools and sets the mark point position and draw the lines using mark points
    function parseXMLForGettingData() {
        try {
            // contains json data of the xml
            defaultXML = XMLToJSON(xml);
            if (defaultXML.smxml._markPointColor == undefined) {
                // sets the value of the key markPointColor to #00ff00 of json defaultXML
                defaultXML.smxml._markPointColor = '#00ff00';
            }
            if (defaultXML.smxml._color == undefined) {
                // sets the value of the key color to rgb(0, 188, 212) of json defaultXML
                defaultXML.smxml._color = 'rgb(0, 188, 212)';
            }

            prev_store.update((item) => {
                // sets the value of state bgImg to the value of key bgimg of json defaultXML
                item.bgImg = defaultXML.smxml._bgimg;
                // sets the value of state alt to the value of key imgAlt of json defaultXML
                item.alt = defaultXML.smxml._imgAlt;
                // sets the value of state imgWidth to the value of key width of json defaultXML
                item.imgWidth = defaultXML.smxml._width;
                // sets the value of state lineColor to the value of key color of json defaultXML
                item.lineColor = defaultXML.smxml._color;
                // sets the value of state focusDATA to the value of subkey cdata of key backgroundPoint of json defaultXML
                item.focusDATA = defaultXML.smxml.backgroundPoint.__cdata;
                // sets the value of state markPointColor to the value of key markPointColor of json defaultXML
                item.markPointColor = defaultXML.smxml._markPointColor;
                // sets the value of state selectedTools to the value of key 'selectedDrawingType' after joining it with commam of json defaultXML
                item.selectedTools = defaultXML.smxml.div._selectedDrawingType.split(',');
                return item;
            })
                
            // makes array 'accessibilityPoints' to empty
            accessibilityPointsPreview = [];
            // assign the value 1 to the variable focusPointCountPreview
            focusPointCountPreview = 1;
            // assign the value of state focusDATA into variable updatedFocusCDATA
            let updatedFocusCDATA = state.focusDATA;
            // replaces the character '!' to ',' and wraps the value into square bracket
            updatedFocusCDATA = '[' + updatedFocusCDATA.replace(/!/g, ',') + ']';
            // contains javascript object 
            updatedFocusCDATA = JSON.parse(updatedFocusCDATA);
            // removes the element circle, path and title from element have class 'backgroundFocusPathPreview' and 'backgroundFocusPointPreview'
            AH.selectAll('.backgroundFocusPointPreview circle,.backgroundFocusPathPreview path, .backgroundFocusPointPreview title', 'remove');
            for (let index = 0; index < updatedFocusCDATA.length; index++) {
                // pushes data of multi dimesion array updatedFocusCDATA specified at perticular row and column where value of row and column is equals to the value of variable 'index' into array previewScribblePath
                accessibilityPointsPreview.push(updatedFocusCDATA[index][index]);
            }
            for (let index = 0; index < updatedFocusCDATA.length; index++) {
                for (let subPoints = 0; subPoints < updatedFocusCDATA[index][index].length; subPoints++) {
                    // updates the value of key x of multi dimention array object 'accessibilityPointsPreview' where row and column values are value of variable 'index' and 'subPoints' with the value of key x of multi dimention array updatedFocusCDATA object where row and column values are the value of variables 'index' and 'subPoints'
                    accessibilityPointsPreview[index][subPoints].x = updatedFocusCDATA[index][index][subPoints].x;
                    // updates the value of key y of multi dimention array object 'accessibilityPointsPreview' where row and column values are value of variable 'index' and 'subPoints' with the value of key y of multi dimention array object updatedFocusCDATA where row and column values are the value of variables 'index' and 'subPoints'
                    accessibilityPointsPreview[index][subPoints].y = updatedFocusCDATA[index][index][subPoints].y;
                    // Creates an element with the specified namespace URI and qualified name.
                    scribble = document.createElementNS(xmlns, 'circle');
                    // sets the stroke color and width
                    setPreviewColor('#808080', previewThickness);
                    // adds a new attribute 'aria-labelledby' (with a namespace null)
                    scribble.setAttributeNS(null, 'aria-labelledby', 'focusPoint_' + focusPointCountPreview + '_title focusPoint_' + focusPointCountPreview + '_desc');
                    // adds a new attribute 'tabindex' (with a namespace null)
                    scribble.setAttributeNS(null, 'tabindex', '0');
                    // adds a new attribute 'class' (with a namespace null)
                    scribble.setAttributeNS(null, 'class', 'focusPoints');
                    // adds a new attribute 'data-focusOrder' (with a namespace null)
                    scribble.setAttributeNS(null, 'data-focusOrder', focusPointCountPreview);
                    // adds a new attribute 'cx' (with a namespace null)
                    scribble.setAttributeNS(null, 'cx', accessibilityPointsPreview[index][subPoints].x);
                    // adds a new attribute 'cy' (with a namespace null)
                    scribble.setAttributeNS(null, 'cy', accessibilityPointsPreview[index][subPoints].y);
                    // adds a new attribute 'r' (with a namespace null)
                    scribble.setAttributeNS(null, 'r', '2px');
                    // place the scribble element before very first element inside the element have class 'backgroundFocusPointPreview'
                    AH.select('.backgroundFocusPointPreview').append(scribble);
                    // adds title and description of focus point for screen reader
                    AH.insert('.backgroundFocusPointPreview', '<title id="focusPoint_' + focusPointCountPreview + '_title">You are on the ' + focusPointCountPreview + ' Point </title><desc id="focusPoint_' + focusPointCountPreview + '_desc">Press shift + tab to move towards the previous point or tab to move towards the next points</desc>', 'beforeend');
                    // increases the value of variable 'focusPointCountPreview' by 1
                    focusPointCountPreview++;
                }
                // join the marked points and sets the color and width of the stroke 
                joinMarkedPoint(accessibilityPointsPreview[index], 1);
            }
            // contains the stroke color
            previewColor = state.lineColor;
            // makes array previewScribblePath blank for remove the drawing sketched by the help of drawing tools
            previewScribblePath = [];
            // sets the value true of the variable isDrawCompassPreview
            isDrawCompassPreview = true;
            // sets the value false of the variable isStoreStart
            isStoreStart = false;
            // sets the value 0 of the variable isDrawStop
            isDrawStop = 0;
            // shows that drawing is not start via keyboard
            startDrawingByKey = 0;
            // shows number of drawing sketched with the help of drawing tools
            previewScribbleCount = 0;
            // counts the number of undo can be done
            previewUndoCount = 0;
            // makes array previewUndoList blank to remove the all undo done
            previewUndoList = [];
            // makes array previewRedoList blank to remove the all redo done
            previewRedoList = [];
            // sets the value of the variable 'isMarking' to 1
            isMarking = 1;
            // makes array markPoints blank to remove the mark point
            markPoints = [];
            // removes the first character from the string exist in state array selectedTools at index 0
            previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
            if (editorState) {
                // removes drawing sketched by the help of drawing tools and marked points and also lines that is drawn automatically using mark points
                AH.selectAll('.previewMarkingPaths .answer_mark,.previewDrawingPaths path', 'remove');
            }
            if (previewMode == 'compass') {
                // shows the compass tool
                AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
                // sets the cursor style to crosshair (+)
                AH.select('#previewSvg','css', {'cursor': 'crosshair'});
                // hides icon (+) used for sketch the drawing using keyboard
                AH.select('#moveDrawIcon','addClass','h');
            } else {
                // hides the compass element
                AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
            }
            // enabled the button have id mark_points and update its text to 'Mark Points' 
            AH.select('#mark_points').disabled = false;
            AH.select('#mark_points').innerText = "Mark Points";

            // disabled the undo, redo and clear screen (x) buttons
            AH.select('#preview_undo').disabled = true;
            AH.select('#preview_redo').disabled = true;
            AH.select('#preview_clearScreen').disabled = true;
            // removes the drawing tool buttons
            AH.selectAll('.geometryToolPreview', 'addClass', 'h');
            for (let toolsIndex = 0; toolsIndex < state.selectedTools.length; toolsIndex++) {
                // shows the drawing tools buttons that exist in state array selectedTools
                AH.select('#preview' + state.selectedTools[toolsIndex], 'removeClass', 'h')
            }
            // removes the class active from drawing tools, delete and 'Mark Points' buttons
            AH.selectAll('.preview_btn,#mark_points','removeClass', 'active');
            // adds the class active to scribble drawing tool button
            AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');
            // sets the width of the background image container
            AH.selectAll('.preview_drawing_toolbar, .centerImgPreview','attr', {'style' :'width:' + (Number(state.imgWidth) + 2) + 'px'});
            // sets the width, src and alt message of the background image
            AH.select('.centerImg #svgImgPreview', 'attr', {
                'src': bgImgPath + '' + state.bgImg,
                'alt': state.alt,
                'width': state.imgWidth,
            });

            AH.enableBsAll('.tooltip_btn', 'Tooltip', {
                container:'body'
            });
        } catch (error) {
            console.warn({
                error,
                func: 'parseXMLForGettingData @271'
            });
        }
    }

    // joins the marked points by the help of line that starts with first mark point and ends at last masked point by moving in sequencial order
    function markFinalPoints() {
        // hides the compass container
        AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
        // removes the class 'eraserHover' from the element 'path' inside the element have id 'previewSvg'
        AH.selectAll('#previewSvg path', 'removeClass' , 'eraserHover');
        if (isMarking) {
            // removes the class active from the drawing tools and delete buttons
            AH.selectAll('.preview_btn','removeClass','active');
            // sets the text of the button 'Mark Points' to 'Finish MArking' and adds class active to it
            AH.select('#mark_points').innerText = "Finish Marking";
            AH.select('#mark_points', 'addClass', 'active');
            // sets the value of the variable 'isMarking' to 0
            isMarking = 0;
            // removes the mark points and lines
            AH.selectAll('.previewMarkingPaths .answer_mark', 'remove');
            // makes array userMarkingPoint to empty
            userMarkingPoint = [];
            // makes array markPoints to empty
            markPoints = [];
            if (!editorState) {
                // removes the correct answer circle that can be seen on remediation mode in green stroke color
                AH.selectAll('.correct_answer_container .answer_mark', 'remove');
            }
            // sets value of variable 'previewMode' to 'markPoints'
            previewMode = 'markPoints';
        } else {
            // stes the test of the button 'Finish Marking' to 'Mark Points' and adds class active to it
            AH.select('#mark_points').innerText = "Mark Points";
            AH.select('#mark_points', 'removeClass', 'active');
            if (markPoints.length >= 1) {
                // join the marked points and sets the color and width of the stroke 
                joinMarkedPoint(markPoints);
                if (state.remediationMode == 'on') {
                    // checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
                    parseXMLForAnswer();
                }
            }
            // contains the value of index 0 of state array selectedTools after removing the first character
            previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
            // hides the icon (+) used to sketch the drawing by the help of keyboard
            AH.select('#moveDrawIcon', 'addClass', 'h');
            // styles the cursor to crosshair (+)
            AH.select('#previewSvg', 'css', {'cursor': 'crosshair'});
            // adds the active class to the drawing tool exist at index 0 in state array selectedTools
            AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');
            if (previewMode == 'compass') {
                // shows the compass tool
                AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
            } else {
                // hides the compass tool
                AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
            }
            // sets the value of the variable 'isMarking' to 1
            isMarking = 1;
        }
    }

    // draw the marked points and the lines connecting to these points
    function addMarkPointOnLoad(array) {
        for (let index = 0; index < array.length; index++) {
            // Creates an element with the specified namespace URI and qualified name.
            scribble = document.createElementNS(xmlns, 'circle');
            // sets the stroke color and width
            setPreviewColor(state.markPointColor, previewThickness);
            // adds a new attribute 'class' (with a namespace null)
            scribble.setAttributeNS(null, 'class', 'answer_mark');
            // adds a new attribute 'cx' (with a namespace null)
            scribble.setAttributeNS(null, 'cx', array[index].x);
            // adds a new attribute 'cy' (with a namespace null)
            scribble.setAttributeNS(null, 'cy', array[index].y);
            // adds a new attribute 'r' (with a namespace null)
            scribble.setAttributeNS(null, 'r', '2px');
            // prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
            AH.select('.previewMarkingPaths').prepend(scribble);
        }
        // join the marked points and sets the color and width of the stroke 
        joinMarkedPoint(array);
    }

    // used to load the module according to the data of smxml and smans xml
    function loadModule(uaXML, drawMark) {
        // contains the json data of user answer xml
        uaXML = XMLToJSON(uaXML);
        // contains the x and y co-ordinate of the points marked by user
        userMarkingPoint = JSON.parse(uaXML.smans.markpoints);
        if (uaXML.smans.userDrawPath == undefined) {
            // sets the value of userDataPath to blank that indicates that no drawing is sketched
            uaXML.smans.userDrawPath = '';
        }
        // contains drawing data sketched by the help of drawing tools in the form of javascript object 
        userDrawPath = JSON.parse(uaXML.smans.userDrawPath);
        // defines the value true or false of the variable userAnsCorrect according to the value of ansCorrect of user answer xml
        userAnsCorrect = uaXML.smans.ansCorrect.toLowerCase() == 'true' ? true : false;
        // contains json data of xml props
        defaultXML = XMLToJSON(xml);
        // contains cdata of drawing of smxml that have to be performed by the help of drawing tools for correct answer
        cdata = defaultXML.smxml.div.__cdata;
        // replace the character '!' with ',' from cdata and wrap it in square bracket
        cdata = '[' + cdata.replace(/!/g, ',') + ']';
        // converts cdata string into javascript object
        cdata = JSON.parse(cdata);
        // draw the marked points and the lines connecting to these points
        addMarkPointOnLoad(userMarkingPoint);
        // creates the drawing sketched by user
        createUserPath();
        // checks the answer is correct or incorrect
        checkCorrectAnswer(userMarkingPoint, drawMark);
        // sets the status of the answer ( correct or incorrect message with showing the UI that indicates correct or incorrect)
        setStatusOfAns(userAnsCorrect, userMarkingPoint, drawMark);
    }

    // this function is used for copying the array and modifying them
    function arrayCopy(array) {
        // creates a temporary array
        let tempArray = [];
        for (let index = 0; index < array.length; index++) {
            // pushes default initialized object into array tempArray
            tempArray.push({
                mode: "mode",
                order: 2,
                type: "scribble_0",
                index: 0,
                d: "path"
            });
            // update the value of mode key of array tempArray at index specified in variable 'index' with the value of mode key of array passed in argument at index specified in variable 'index'
            tempArray[index].mode = array[index].mode;
            // update the value of order key of array tempArray at index specified in variable 'index' with the value of order key of array passed in argument at index specified in variable 'index'
            tempArray[index].order = array[index].order;
            // update the value of type key of array tempArray at index specified in variable 'index' with the value of type key of array passed in argument at index specified in variable 'index'
            tempArray[index].type = array[index].type;
            // update the value of index key of array tempArray at index specified in variable 'index' with the value of index key of array passed in argument at index specified in variable 'index'
            tempArray[index].index = array[index].index;
            // update the value of d key of array tempArray at index specified in variable 'index' with the value of d key of array passed in argument at index specified in variable 'index'
            tempArray[index].d = array[index].d;
        }
        // retuns array after copied data from array passed in arguments
        return tempArray;
    }

    // removes drawing on which keyup event triggered and update the user answer xml
    function eraser(curClass, curArray) {
        if (AH.select(curClass).getAttribute("data-order") != undefined) {
            // makes array previewUndoList blank
            previewUndoList = [];
            // a temporary variable used of 
            let tempArrayContainer = '';
            // find the index of the drawing on which keyup event fired exist in array curArray
            let currentIndex = curArray.indexOf(curArray[AH.select(curClass).getAttribute("data-order")]);
            // contains current element from array curArray after converting it into string and wraping in square bracket
            let convertJSONtoArray = '[' + JSON.stringify(curArray[currentIndex]) + ']';
            // contains copy of array convertJSONtoArray
            tempArrayContainer = arrayCopy(JSON.parse(convertJSONtoArray));
            // adds the value remove of mode key exist at index 0 in array tempArrayContainer
            tempArrayContainer[0].mode = "remove";
            // pushes the data of array 'tempArrayContainer' exist on index 0 into array curArray
            curArray.push(tempArrayContainer[0]);
            // contains copy of array curArray
            let eraserArrayContainer = arrayCopy(curArray);
            // stores the drawing sketched by user and sets the user answer xml
            storeUserPaths(eraserArrayContainer);
            // increases the value of the variable previewScribbleCount by 1
            previewScribbleCount++;
            // increases the value of the variable previewUndoCount by 1
            previewUndoCount++;
            // removes the current drawing on which keyup event fired
            AH.select(curClass, 'remove');
            // disabled the redo button
            AH.select('#preview_redo').disabled = true;
            // enables undo button
            AH.select('#preview_undo').disabled = false;
            if (AH.selectAll('.previewDrawingPaths path').length == 0) {
                // disabled the clear screen button (x)
                AH.select('#preview_clearScreen').disabled = true;
            }
        }
    }

    // stores the drawing sketched by user and sets the user answer xml
    function storeUserPaths(drawPathArray) {
        // makes array userAnsPath blank
        userAnsPath = [];
        // creates the variable subindex and assign the value 0
        let subindex = 0;
        for (let index = 0; index < drawPathArray.length; index++) {
            subindex = index + 1;
            while (subindex < drawPathArray.length) {
                if (drawPathArray[index].type == drawPathArray[subindex].type) {
                    if (drawPathArray[index].mode == "add" && drawPathArray[subindex].mode == "remove") {
                        // sets the value null of mode key of array drawPathArray have index defined in variable 'index'
                        drawPathArray[index].mode = null;
                        // sets the value null of mode key of array drawPathArray have index defined in variable 'subindex'
                        drawPathArray[subindex].mode = null;
                    }
                }
                // increases the value of the variable subindex by 1
                subindex++;
            }
        }
        for (let index = 0; index < drawPathArray.length; index++) {
            // Return an array of all the values in the drawPathArray array whose value of mode key is not null
            drawPathArray = drawPathArray.filter(function (element) {
                return element.mode != null;
            });
        }
        // pushes data of array drawPathArray into array userAnsPath
        userAnsPath.push(drawPathArray);
        // updates user answer xml
        createUXML();
    }

    // creates user answer xml
    function createUXML() {
        // makes array markPointsData empty
        markPointsData = [];
        if (markPoints.length == 0) {
            // contains the x and y co-ordinate of the points marked by user
            markPointsData = JSON.stringify(userMarkingPoint)
        } else {
            // contains the x and y co-ordinate of the points marked by user
            markPointsData = JSON.stringify(markPoints);
        }
        // contains proforma of user answer xml with points marked by user, drawing sketched by user and state of answer  
        userAnsXML = '<smans type="41"><markpoints>' + markPointsData + '</markpoints><userDrawPath>' + JSON.stringify(userAnsPath[0]) + '</userDrawPath><ansCorrect>' + isAnswerCorrect + '</ansCorrect></smans>';
        // defined that user answer xml changed
        window.ISSPECIALMODULEUSERXMLCHANGE = 1;
        // sets the user answer xml
        AH.select("#special_module_user_xml").value = userAnsXML;

    }

    // creates the drawing sketched by user
    function createUserPath() {
        if (userDrawPath.length) {
            // enables the cross and undo buttons 
            AH.select('#preview_undo').disabled = false;
            AH.select('#preview_undo').disabled = false;

        }
        for (let index = 0; index < userDrawPath.length; index++) {
            // sets the type key value of the object exist at index defined in variable 'index' of array userDrawPath by adding the value of variable 'index' in its previous value
            userDrawPath[index].type = userDrawPath[index].type.substr(0, userDrawPath[index].type.indexOf('_')) + '_' + index;
            // sets the order key value of the object exist at index defined in variable 'index' of array userDrawPath by adding the value of variable 'index'
            userDrawPath[index].order = index;
            // Creates an element with the value of variable xmlns namespace URI and 'path' name
            scribble = document.createElementNS(xmlns, 'path');
            // sets the stroke color and width
            setPreviewColor(previewColor, previewThickness);
            // adds a new attribute 'data-type' (with a namespace null)
            scribble.setAttributeNS(null, 'data-type', userDrawPath[index].type);
            // adds a new attribute 'data-order' (with a namespace null)
            scribble.setAttributeNS(null, 'data-order', userDrawPath[index].order);
            // adds a new attribute 'd' (with a namespace null)
            scribble.setAttributeNS(null, 'd', userDrawPath[index].d);
            // adds a new attribute 'tabindex' (with a namespace null)
            scribble.setAttributeNS(null, 'tabindex', '0');
            // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
            AH.select('.previewDrawingPaths').prepend(scribble);
        }
        // sets the value of the variable 'previewScribbleCount' to  the value of length of the array 'userDrawPath'
        previewScribbleCount = userDrawPath.length;
        // contains copy of array userDrawPath
        previewScribblePath = arrayCopy(userDrawPath);
    }

    // join the marked points and sets the color and width of the stroke 
    function joinMarkedPoint(markArray, focusPoint) {
        if (markArray.length == 0) {
            return;
        }
        // Creates an element with the value of variable xmlns namespace URI and 'path' name
        scribble = document.createElementNS(xmlns, 'path');
        // sets the starting position of the drawing
        let pointStartValues = 'M ' + markArray[0].x + ' ' + markArray[0].y;
        // variable for end point
        let pointEndValues = '';
        for (let index = 1; index < markArray.length; index++) {
            // adds the value of x and y into previous value of the variable pointEndValues from the array 'markArray' at index defined in variable 'index'
            pointEndValues += ' L ' + markArray[index].x + ' ' + markArray[index].y;
        }
        // adds a new attribute 'd' (with a namespace null)
        scribble.setAttributeNS(null, 'd', pointStartValues + '' + pointEndValues);
        if (focusPoint) {
            // sets the stroke color and width
            setPreviewColor('rgb(128, 128, 128)', previewThickness);
            // prepend the element assigned into variable 'scribble' in background focus container element
            AH.select('.backgroundFocusPathPreview').prepend(scribble);
        } else {
            // sets the stroke color and width
            setPreviewColor(state.markPointColor, previewThickness);
            // adds a new attribute 'class' (with a namespace null)
            scribble.setAttributeNS(null, 'class', 'answer_mark');
            // prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
            AH.select('.previewMarkingPaths').prepend(scribble);
        }
    }

    // checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
    function parseXMLForAnswer(drawMark) {
        // contains the json data of the xml of props
        defaultXML = XMLToJSON(state.xml);
        // contains the value of cdata inside div of smxml
        cdata = defaultXML.smxml.div.__cdata;
        // replaces the character '!' with ',' and wraps in square bracket of the value of cdata variable
        cdata = '[' + cdata.replace(/!/g, ',') + ']';
        // parses the cdata string value into javascript object
        cdata = JSON.parse(cdata);
        // creates an array markPointsAnsData
        let markPointsAnsData = [];
        // assign the value of array markPoints into array markPointsAnsData
        markPointsAnsData = markPoints;
        if (!editorState) {
            if (uxml) {
                if (markPoints.length == 0) {
                    // contains the x and y co-ordinate of the points marked by user
                    markPointsAnsData = userMarkingPoint;
                }
            }
        }
        // checks the answer is correct or incorrect
        checkCorrectAnswer(markPointsAnsData, drawMark);
        // sets the status of the answer ( correct or incorrect message with showing the UI that indicates correct or incorrect)
        setStatusOfAns(isAnswerCorrect, markPointsAnsData, drawMark);
        if (drawMark) {
            // enables the element have id mark_points and updates its text as 'Mark Points'
            AH.select('#mark_points').innerText = 'Mark Points';
            AH.select('#mark_points').disabled = false;
            // sets the value of the variable 'isMarking' to 1
            isMarking = 1;
        }
    }

    // stores the drawing sketched by user using keyboard and sets the user answer xml
    function storeCompassPathByKey() {
        // removes the class lastCircle_hover from the last circle that exist on rotation bar of the compass
        AH.selectAll('#previewSvg .lastCircle', 'removeClass', 'lastCircle_hover');
        // sets the style of the cursor to grab when cursor lies inside last circle
        AH.selectAll('#previewSvg .lastCircle', 'css', {'cursor': 'grab'});
        // sets the value true of variable isDrawCompassPreview
        isDrawCompassPreview = true;
        if (previewScribblePath[previewScribbleCount].d.indexOf('L') == -1) {
            // removes the last element from the array previewScribblePath
            previewScribblePath.pop();
        } else {
            // adds a new attribute 'd' (with a namespace null)
            scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);
            // adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
            previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;
            // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools 
            AH.select('.previewDrawingPaths').prepend(scribble);
            // increases the value of variable previewScribbleCount by 1
            previewScribbleCount++;
            // increases the value of variable previewUndoCount by 1
            previewUndoCount++;
            // makes array previewUndoList blank 
            previewUndoList = [];
            // enables the cross (x) and undo button
            AH.select('#preview_undo').disabled = false;
            AH.select('#preview_clearScreen').disabled = false;

            // disabled the redo button
            AH.select('#preview_redo').disabled = true;
        }
        // contains copy of array previewScribblePath
        let tempArrayContainer = arrayCopy(previewScribblePath);
        // stores the drawing sketched by user and sets the user answer xml
        storeUserPaths(tempArrayContainer);
    }

    // removes the all mark points and sets the value of the variable 'isMArking' to 1
    function clearMarking() {
        // removes the mark points and lines 
        AH.selectAll('.previewMarkingPaths .answer_mark', 'remove');
        if (!editorState) {
            // removes the correct answer circle that can be seen on remediation mode in green stroke color
            AH.selectAll('.correct_answer_container .answer_mark', 'remove');
        }
        // makes array markPoints empty
        markPoints = [];
        // sets the text 'Mark Points' of the element having id 'mark_points' and enabled that element
        AH.select('#mark_points').innerText = 'Mark Points';
        AH.select('#mark_points').disabled = false;
        // sets the value of variable isMArking to 1 that indicates that mark can be draw
        isMarking = 1;
    }

    // checks the answer is correct or incorrect
    function checkCorrectAnswer(markArray, drawMark) {
        // creates correctAnswer array
        let correctAnswer = [];
        if (drawMark) {
            for (let index = 0; index < cdata.length; index++) {
                // Creates an element with the specified namespace URI and qualified name.
                scribble = document.createElementNS(xmlns, 'circle');
                // sets the stroke color and width
                setPreviewColor('#0F9D58', '2');
                // adds a new attribute 'class' (with a namespace null)
                scribble.setAttributeNS(null, 'class', 'answer_mark answer_circle');
                // adds a new attribute 'cx' (with a namespace null)
                scribble.setAttributeNS(null, 'cx', cdata[index].x);
                // adds a new attribute 'cy' (with a namespace null)
                scribble.setAttributeNS(null, 'cy', cdata[index].y);
                // adds a new attribute 'r' (with a namespace null)
                scribble.setAttributeNS(null, 'r', cdata[index].r);
                // prepend the created element with the value of variable 'xmlns' namespace URI and circle name in element have class 'correct_answer_container'
                AH.select('.correct_answer_container').prepend(scribble);
            }
        }
        if (cdata.length == 0 || markArray.length == 0) {
            // sets the value of variable 'isAnswerCorrect' to false
            isAnswerCorrect = false;
            return;
        }
        // sets the value of the variable 'lineCount' according to the length of the array markArray
        let lineCount = (markArray.length == 1) ? markArray.length : markArray.length - 1;
        for (let cdataIndex = 0; cdataIndex < cdata.length; cdataIndex++) {
            for (let index = 0; index < lineCount; index++) {
                if ((lineCount == 1 && markArray.length == 1) && checkIntersection(markArray[index].x, markArray[index].y, 0, 0, cdata[cdataIndex].x, cdata[cdataIndex].y, cdata[cdataIndex].r)) {
                    // push data 'Match' into array correctAnswer
                    correctAnswer.push("Match");
                    break;
                }
                if ((lineCount >= 1 && markArray.length > 1) && checkIntersection(markArray[index].x, markArray[index].y, markArray[index + 1].x, markArray[index + 1].y, cdata[cdataIndex].x, cdata[cdataIndex].y, cdata[cdataIndex].r)) {
                    // push data 'Match' into array correctAnswer
                    correctAnswer.push("Match");
                    break;
                }
            }
        }
        if (correctAnswer.length == cdata.length) {
            // sets the value of variable 'isAnswerCorrect' to true
            isAnswerCorrect = true;
        } else {
            // sets the value of variable 'isAnswerCorrect' to false
            isAnswerCorrect = false;
        }
        // makes correctAnswer array empty
        correctAnswer = [];
    }

    // sets the status of the answer ( correct or incorrect message with showing the UI that indicates correct or incorrect)
    function setStatusOfAns(isAnswerCorrect, markArray, drawMark) {
        if (isAnswerCorrect) {
            // stes the value of the state correctAnswer to true
            state.correctAnswer = true;
            if (drawMark) {
                if (cdata.length && markArray.length) {
                    // join the marked points and sets the color and width of the stroke 
                    joinMarkedPoint(markArray);
                }
                // sets the stroke color of element have class 'answer_mark' to #0F9D58
                AH.selectAll('.answer_mark', 'css', {'stroke': '#0F9D58'});
            
                // sets the value of the message variable to correct
                if (editorState) {
                    // shows correct
                    showAns(l.correct);
                }
            }
        } else {
            state.correctAnswer = false;

            if (drawMark) {
                if (cdata.length && markArray.length) {
                    // join the marked points and sets the color and width of the stroke 
                    joinMarkedPoint(markArray);
                }
                // sets the stroke color of the mark points and lines that are draw using mark points to #ff0000
                AH.selectAll('.answer_mark', 'css', {'stroke': '#ff0000'});
                AH.selectAll('.answer_circle', 'css', {'stroke': '#0F9D58'});
                
                if (editorState) {
                    // shows answer incorrect
                    showAns(l.incorrect);
                }
            }
        }
        // check or uncheck the element have id 'answer' according to the value of variable isAnswerCorrect
        AH.select("#answer").checked = state.correctAnswer;
    }

    // Center of the circle (cx, cy)
    // Radius of circle: r
    // First Point (ax,ay) and second Point (bx,by)
    function checkIntersection(ax, ay, bx, by, cx, cy, r) {
        ax -= cx;
        ay -= cy;
        bx -= cx;
        by -= cy;
        let a = (bx - ax) * (bx - ax) + (by - ay) * (by - ay)
        let b = 2 * (ax * (bx - ax) + ay * (by - ay));
        let c = ax * ax + ay * ay - r * r;
        // Applying Shri Dharacharya method by comparing the quadratic values a, b, c
        let disc = b * b - 4 * a * c;
        if (disc <= 0) {
            return false;
        }
        let t1 = (-b + Math.sqrt(disc)) / (2 * a);
        let t2 = (-b - Math.sqrt(disc)) / (2 * a);
        if ((0 < t1 && t1 < 1) || (0 < t2 && t2 < 1)) {
            return true;
        }
        return false;
    }

    // updates the value of compass radius and angle
    function checkPreviewRadiusAndAngle() {
        // contains the value of initial x co-ordinate of compass rotation bar 
        initialPoint.x = Number(AH.select('.compassRotationBar').getAttribute('x1'));
        // contains the value of initial y co-ordinate of compass rotation bar
        initialPoint.y = Number(AH.select('.compassRotationBar').getAttribute('y1'));
        // contains the value of final x co-ordinate of compass rotation bar
        finalPoint.x = Number(AH.select('.compassRotationBar').getAttribute('x2'));
        // contains the value of final y co-ordinate of compass rotation bar
        finalPoint.y = Number(AH.select('.compassRotationBar').getAttribute('y2'));
        // // contains the length of compass rotation bar
        previewCompassRadius = Number(AH.select('.drawingCompassRoute').getAttribute('r'));
        // contains the value of compass angle using the co-ordinates of the initial and final points
        previewCompassAngle = Math.atan2(finalPoint.y - initialPoint.y, finalPoint.x - initialPoint.x) * 180 / Math.PI;
    }

    // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    function updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle) {
        // sets the center of x of middle circle lies on compass rotationbar
        midCircle_cx = cx + (previewCompassRadius / 2) * Math.cos(previewCompassAngle * (Math.PI / 180));
        // sets the center of y of middle circle lies on compass rotationbar
        midCircle_cy = cy + (previewCompassRadius / 2) * Math.sin(previewCompassAngle * (Math.PI / 180));
        // sets the center of x of small middle circle lies on compass rotationbar
        midSmallCircle_cx = cx + ((3 * previewCompassRadius) / 4) * Math.cos(previewCompassAngle * (Math.PI / 180));
        // sets the center of y of small middle circle lies on compass rotationbar
        midSmallCircle_cy = cy + ((3 * previewCompassRadius) / 4) * Math.sin(previewCompassAngle * (Math.PI / 180));
        // sets the center of x of last circle lies on compass rotationbar
        lastCircle_cx = cx + (previewCompassRadius) * Math.cos(previewCompassAngle * (Math.PI / 180));
        // sets the center of y of last circle lies on compass rotationbar
        lastCircle_cy = cy + (previewCompassRadius) * Math.sin(previewCompassAngle * (Math.PI / 180));
        // sets the center of x of rotation icon that can be seen just in front of the last circle to indication that move the rotationbar in these directions to draw the circular curve
        lastSmallCircle_cx = cx + ((5 * previewCompassRadius) / 4) * Math.cos(previewCompassAngle * (Math.PI / 180));
        // sets the center of x of rotation icon that can be seen just in front of the last circle to indication that move the rotationbar in these directions to draw the circular curve
        lastSmallCircle_cy = cy + ((5 * previewCompassRadius) / 4) * Math.sin(previewCompassAngle * (Math.PI / 180));
        // sets the center co-ordinate of the compass and of its route
        AH.selectAll('.drawingCompassRoute,.drawingCompassCenter', 'attr', {
            'cx': cx,
            'cy': cy
        });
        // sets the radius of the compass or length of the rotationbar
        AH.selectAll('.drawingCompassRoute', 'attr', {'r': previewCompassRadius});
        // sets the co-ordinates of start and end points of the compass rotation bar
        AH.selectAll('.compassRotationBar', 'attr', {
            'x1': cx,
            'y1': cy,
            'x2': lastCircle_cx,
            'y2': lastCircle_cy
        });
        // sets the values of the center of the rotation indicator and rotate it in 3D dimention for defined variables value that can be seen after hover on the last circle lies on rotation bar
        AH.selectAll('#previewSvg .lastCircleMid', 'attr', {
            'cx': lastSmallCircle_cx,
            'cy': lastSmallCircle_cy,
            "transform": "rotate(" + previewCompassAngle + "," + lastSmallCircle_cx + "," + lastSmallCircle_cy + ")"
        });
        // sets the center of the last circle lies on rotation bar
        AH.selectAll('#previewSvg .lastCircle', 'attr', {
            'cx': lastCircle_cx,
            'cy': lastCircle_cy
        });
        // sets the values of the center of small middle circle and rotate it in 3D dimention for defined variables value
        AH.selectAll('#previewSvg .midSmallCircle', 'attr', {
            'cx': midSmallCircle_cx,
            'cy': midSmallCircle_cy,
            "transform": "rotate(" + previewCompassAngle + "," + midSmallCircle_cx + "," + midSmallCircle_cy + ")"
        });
        // sets the values of the center of middle circle and rotate it in 3D dimention for defined variables value
        AH.selectAll('#previewSvg .mid_circle', 'attr', {
            'cx': midCircle_cx,
            'cy': midCircle_cy,
            "transform": "rotate(" + previewCompassAngle + "," + midCircle_cx + "," + midCircle_cy + ")"
        });
        // assign the value of variable previewCompassAngle into variable curAngle
        let curAngle = previewCompassAngle;
        if (curAngle < 0) {
            // adds 360 degree value in it's previous value of variable curAngle
            curAngle = 360 + curAngle;
        }
        // sets the message about angle for screen reader
        AH.select('#compassRotationTitle').innerText = "Compass Angle, Your Current Angle is " + curAngle.toFixed(0) + " degree";
        // sets the message about radius for screen reader
        AH.select('#compassRadiusTitle').innerText = "Compass Radius, Your Current Radius is " + (previewCompassRadius * 0.02649).toFixed(1) + "cm";
    }

    // sets the x and y co-ordinate of the mouse position
    function setPreviewMouseCoordinates(event) {
        // contains the size of element having id 'authoringSvg' and its position relative to the viewport
        let boundary = document.getElementById('previewSvg').getBoundingClientRect();
        // sets the x position of the mouse co-ordinate
        preview_mouseX = event.clientX - boundary.left;
        // sets the y position of the mouse co-ordinate
        preview_mouseY = event.clientY - boundary.top;
    }

    // sets the stroke color and width
    function setPreviewColor(previewColor, previewThickness) {
        // sets the stroke color of the drawing
        scribble.style.stroke = previewColor;
        // sets the stroke width of the drawing
        scribble.style.strokeWidth = previewThickness;
        scribble.style.fill = 'none';
    }

    // changes the value of radius, angle, and center of the compass when it is performed via keyboard
    function compassKeyEvent(mode, event) {
        if ( ! AH.select('.drawingCompassSvg').classList.contains('h') && previewMode == "compass") {
            // contains width of the background image
            let imageWidth = AH.select('#svgImgPreview').clientWidth;
            // contains width of the background image 
            let imageHeight = AH.select('#svgImgPreview').clientHeight;
            // updates the value of compass radius and angle
            checkPreviewRadiusAndAngle();
            if (event.shiftKey && (event.keyCode == 38 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 40)) {
                if (mode == 'radius') {
                    switch (event.keyCode) {
                        case 38:
                            // increases the radius value by 1 after down the key shift and up arrow
                            previewCompassRadius++;
                            break;
                        case 37:
                            // decreases the radius value by 1 after down the key shift and left arrow
                            previewCompassRadius--;
                            break;
                        case 39:
                            // increases the radius value by 1 after down the key shift and right arrow
                            previewCompassRadius++;
                            break;
                        case 40:
                            // decreases the radius value by 1 after down the key shift and down arrow
                            previewCompassRadius--;
                            break;
                    }
                }
                if (mode == 'move') {
                    switch (event.keyCode) {
                        case 38:
                            // decreases the value of y co-ordinate of compass center by 1 after down the key shift and up arrow
                            initialPoint.y--;
                            break;
                        case 37:
                            // decreases the value of x co-ordinate of compass center by 1 after down the key shift and left arrow
                            initialPoint.x--;
                            break;
                        case 39:
                            // increases the value of x co-ordinate of compass center by 1 after down the key shift and right arrow
                            initialPoint.x++;
                            break;
                        case 40:
                            // increases the value of y co-ordinate of compass center by 1 after down the key shift and down arrow
                            initialPoint.y++;
                            break;
                    }
                }
                if ((mode == 'rotate' || mode == 'draw')) {
                    switch (event.keyCode) {
                        case 38:
                            // increases the value of compass angle by 1 after down the key shift and up arrow
                            previewCompassAngle++;
                            break;
                        case 39:
                            // decreases the value of compass angle by 1 after down the key shift and right arrow
                            previewCompassAngle--;
                            break;
                        case 37:
                            // increases the value of compass angle by 1 after down the key shift and left arrow
                            previewCompassAngle++;
                            break;
                        case 40:
                            // decreases the value of compass angle by 1 after down the key shift and down arrow
                            previewCompassAngle--;
                            break;
                    }
                }
                if (mode == 'draw') {
                    if (AH.select('#previewSvg .lastCircle').classList.contains('lastCircle_hover') || AH.select('#previewSvg .lastbigcircle').classList.contains('lastCircle_hover')) {
                        // adds a new attribute 'd' (with a namespace null)
                        scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);
                        // adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                        previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;
                        // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                        AH.select('.previewDrawingPaths').prepend(scribble);
                    }
                }
                if (initialPoint.x < 10 || previewCompassRadius < 80 || previewCompassRadius > 360 || initialPoint.x > imageWidth || initialPoint.y < 10 || initialPoint.y > imageHeight) {
                    return;
                }
                // updates the position of rotationbar and change the center position of the circles that lies on rotationbar
                updatePreviewCompassCalculation(initialPoint.x, initialPoint.y, previewCompassRadius, previewCompassAngle);
            }
        }
    }

    // stop the drawing and store the drawing sketched by the user and sets the user answer xml 
    function stopDraw() {
        if ((checkCurrentPositionX == cursorLeft && checkCurrentPositionY == cursorTop && previewMode == 'line') || (previewMode == 'scribble' && previewScribblePath[previewScribbleCount].d.indexOf('L') == -1)) {
            // removes the last element from the array previewScribblePath
            previewScribblePath.pop();
        } else {
            if (!(isNaN(cursorLeft) && isNaN(cursorTop))) {
                // adds a new attribute 'd' (with a namespace null)
                scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop);
                // adds value of variables cursorLeft and cursorTop separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
                previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop;
                // prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
                AH.select('.previewDrawingPaths').prepend(scribble);
            }
            // increases the value of the variable previewScribbleCount by 1
            previewScribbleCount++;
            // increases the value of the variable previewUndoCount by 1
            previewUndoCount++;
            // makes array previewUndoList blank
            previewUndoList = [];
            // enables undo and cross (x) buttons
            AH.select('#preview_undo').disabled = false;
            AH.select('#preview_clearScreen').disabled = false;

            // disabled redo button
            AH.select('#preview_redo').disabled = true;
        }
        // indicates that scribble drawing is not sketching
        isScribble = 0;
        // sets the value of variable startDrawingByKey to 0
        startDrawingByKey = 0;
        // sets the value of variable isDrawStop to 0
        isDrawStop = 0;
        // sets the value of variable lockFocus to 0
        lockFocus = 0;
        // contains copy of array previewScribblePath
        let tempArrayContainer = arrayCopy(previewScribblePath);
        // stores the drawing sketched by user and sets the user answer xml
        storeUserPaths(tempArrayContainer);
    }

    // function for opening the shortcut modal
    function openShortcut() {
        AH.getBS('#drawing_shortcut_modal', 'Modal').show();
    }

    // function for checking the user ans and loading the module on the basis of it
    function checkUserAns() {
        if (typeof (editorState) == 'undefined') {
            // removes the reset button
            AH.selectAll('.reset_group', 'remove');
            if (uxml) {
                if (uxml.search('<smans type="41">') == -1 || uxml.search('<smans type="41"></smans>') == 0 || uxml.search('undefined') != -1) {
                    // blanks the user answer xml
                    AH.select("#special_module_user_xml").value = "";
                } else {
                    if (isReview) {
                        AH.selectAll('.previewBtnGrp', 'addClass', 'h');
                        // sets the value 'none' of the variable previewMode
                        previewMode = 'none';
                        // not allowed user to perform the task
                        AH.selectAll('.preview_drawing_container', 'css', {pointerEvents: "none"});
                        // removes the class previewKeySvg from the svg element have id previewSvg
                        AH.select('#previewSvg', 'removeClass', 'previewKeySvg');
                    } else {
                        // allowed user to perform the task
                        AH.selectAll('.preview_drawing_container','css', {pointerEvents : ""});
                        // shows all buttons
                        AH.selectAll('.previewBtnGrp', 'removeClass', 'h')
                        // adds the class previewKeySvg to the svg element have id previewSvg
                        AH.select('#previewSvg','addClass', 'previewKeySvg');
                        // contains the value of state array selectedTools at index 0 after removing the first character
                        previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));
                        // it's also used below in this function so it can be removed
                        AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');
                        // it's also used below in this function so it can be removed
                        AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');
                    }
                    loadModule(AH.select("#special_module_user_xml").value, isReview);
                }
            }
        }
    }

</script>

<main id="drawingPreviewMain">
    <div id="drawing_shortcut_modal" class="modal fade" tabIndex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{l.shortcuts}</h4>
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body overflow-y">
                    <!-- svelte-ignore a11y-unknown-role -->
                    <table role="shortcut" class="shortcutTable m-0 p-2 border-0 common-shortcut-table table-striped font15">
                        <tbody tabindex="0" role="shortcut">
                            <tr tabindex="0" role="shortcut"><td class="py-1 font-weight-bold w-50 pr-0">{l.keys}</td><td class="py-1"><div class="d-flex"><span class="pl-3 font-weight-bold">{l.des_txt}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut"><td class="py-1 font-weight-bold w-50 pr-0">{l.ctrl_z}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.undo}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.ctrl_x}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.cut}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.ctrl_y}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.redo}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.enter}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.enable_tool}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.shift_enter}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.start_stop_tool}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.shift_arrow}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.compass_tools}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.locking}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.locking_txt}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.draw_key}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.draw_txt}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.tab}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.focus_next}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.shift_tab}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.focus_prev}</span></div></td></tr>
                            <tr tabindex="0" role="shortcut" ><td class="py-1 font-weight-bold w-50 pr-0">{l.esc}</td><td class="py-1"><div class="d-flex"><span class="pl-3">{l.exit_txt}</span></div></td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.close}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="drawing_module_container">
        <button type="button" class="h h-imp" id="set-review"></button>
        <button type="button" class="h h-imp" id="unset-review"></button>
        <center class="preview_drawing_container">
            <div class="mt-2 mb-3 previewBtnGrp">
                <div class="btn-toolbar preview_drawing_toolbar" role="toolbar" aria-label={l.drawing_tools}>
                    <div class="btn-group mr-2" role="group" tabIndex="0" aria-label={l.draw_tools}>
                        <button type="button" data-title="scribble" tabIndex="0" aria-label={l.scribble_tool} title={l.scribble} name="preview_scribble" id="preview_scribble" class="geometryToolPreview tooltip_btn btn btn-light preview_toolbar preview_btn"><i class="icomoon-pencil"></i></button>
                        <button type="button" data-title="line" tabIndex="0" aria-label={l.line_tool} title={l.line} name="preview_line" id="preview_line" class="geometryToolPreview btn btn-light tooltip_btn preview_toolbar preview_btn">/</button>
                        <button type="button" data-title="compass" tabIndex="0" aria-label={l.compass_tool} title={l.compass} name="preview_compass" id="preview_compass" class="geometryToolPreview tooltip_btn btn btn-light preview_toolbar preview_btn"><i class="icomoon-compass1"></i></button>
                    </div>
                    <div class="btn-group mr-2" role="group" tabIndex="0" aria-label={l.removing_tools}>
                        <button type="button" data-title="eraser" tabIndex="0" aria-label={l.delete_tool} title={l.delete_tool} name="eraser" id="preview_eraser" class="btn btn-light tooltip_btn preview_toolbar preview_btn"><i class="icomoon-delete-sm"></i></button>
                        <button type="button"  title={l.clear_screen} tabIndex="0" aria-label={l.clear_screen} name="clearScreen" id="preview_clearScreen" disabled="disabled" class="btn btn-light tooltip_btn"><i class="icomoon-close-2"></i></button>
                        <button type="button" title={l.redo} name="redo" tabIndex="0" aria-label={l.redo} id="preview_redo" disabled="disabled" class="btn btn-light tooltip_btn"><i class="icomoon-redo-2"></i></button>
                        <button type="button" title={l.undo} name="undo" tabIndex="0" aria-label={l.undo} id="preview_undo" disabled="disabled" class="btn btn-light tooltip_btn"><i class="icomoon-undo-2"></i></button>
                    </div>
                    <div class="btn-group mr-2 marking_group" role="group" aria-label={l.marking_tools}>
                        <button type="button" title={l.mark_finish_point} name="mark_points" tabIndex="0" aria-label={l.mark_ans_point} id="mark_points" class="btn tooltip_btn btn-light">{l.mark_pnt}</button>
                    </div>
                    <div class="btn-group mr-2 reset_group" role="group" aria-label={l.reset}>
                        <button type="button" title={l.reset} name="preview_reset_btn" tabIndex="0" aria-label={l.reset_btn} id="preview_reset_btn" class="btn tooltip_btn btn-light"><i class="icomoon-new-24px-reset-1"></i></button>
                    </div>
                    <div class="btn-group mr-2" role="group" aria-label={l.shortcuts}>
                        <button type="button" title={l.shortcuts} name="shortcut_modal_btn" aria-label={l.shortcuts} tabIndex="0" id="shortcut_modal_btn" class="tooltip_btn btn btn-primary" on:click={openShortcut}>{l.shortcuts}</button>
                    </div>
                </div>
            </div>
            <div>
                <div id="centerImg" class="centerImg centerImgPreview my-auto relative ml-0">
                    <img class="border" alt="" src={bgImgPath + state.bgImg} id="svgImgPreview" />
                    <div>
                        <span class="icomoon-plus s2 move_icon position-absolute h" id="moveDrawIcon"></span>
                    </div>
                    <svg width="100%" height="100%" id="previewSvg" class="previewKeySvg" tabIndex="0" aria-labelledby="previewSvgTitle">
                        <title id="previewSvgTitle">{state.alt}</title>
                        <g class="backgroundFocusPathPreview"></g>
                        <g class="previewDrawingPaths"></g>
                        <g class="correct_answer_container"></g>
                        <g class="backgroundFocusPointPreview"></g>
                        <g class="previewMarkingPaths"></g>
                        <svg class="drawingCompassSvg h" focusable="false">
                            <svg>
                                <g>
                                    <circle class="drawingCompassRoute compass_route" cx="267.984375" cy="173" r="80"></circle>
                                    <g>
                                        <line class="compassRotationBar compass_radius" x1="267.984375" y1="173" x2="267.984375" y2="253"></line>
                                    </g>
                                    <g >
                                        <circle tabIndex="0" class="drawingCompassCenter compass_center" cx="267.984375" cy="173" r="17" aria-labelledby="compassCenterTitle compassCenterDesc" focusable="true" fill="url(#previewDrawingCenter)"></circle>
                                        <title id="compassCenterTitle">{l.compass_center}</title>
                                        <desc id="compassCenterDesc">{l.shift_arrow_use}</desc>
                                        <defs>
                                            <pattern id="previewDrawingCenter" width="20" height="20">
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
                                        <circle class="compass_radius_icon mid_circle" cx="267.984375" cy="213" r="17" fill="url(#previewDrawingRadius)" transform="rotate(90,160,168)" aria-labelledby="compassRadiusTitle compassRadiusDesc" tabIndex="0" focusable="true"></circle>
                                        <title id="compassRadiusTitle">{l.compass_radius + (previewCompassRadius * 0.02649).toFixed(2)}</title>
                                        <desc id="compassRadiusDesc">{l.shift_arrow_radius}</desc>
                                        <defs>
                                            <pattern id="previewDrawingRadius" width="20" height="20">
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
                                        <circle class="compass_rotation midSmallCircle" cx="267.984375" cy="233" r="8" fill="url(#previewMidSmallCircle_icon)" area-label="Compass Angle Use Shift and arrow keys to increase or decrease the radius" aria-labelledby="compassRotationTitle compassRotationDesc" tabIndex="0" focusable="true" transform="rotate(90,160,193)"></circle>
                                        <title id="compassRotationTitle">{l.compass_angle + previewCompassAngle + l.degree}</title>
                                        <desc id="compassRotationDesc">{l.shift_arrow_angle}</desc>
                                        <defs>
                                            <pattern id="previewMidSmallCircle_icon" width="20" height="20">
                                                <svg width="16px" height="16px" viewBox="0 0 14 14" version="1.1">
                                                    <path fill="#000" opacity="0.8" d="M7,14 C3.13400675,14 0,10.8659932 0,7 C0,3.13400675 3.13400675,0 7, 0 C10.8659932,0 14,3.13400675 14,7 C14,10.8659932 10.8659932,14 7, 14 Z M4.66666667,8.16666667 L7,11.6666667 L9.33333333,8.16666667 L4.66666667,8.16666667 Z M4.66666667,5.83333333 L9.33333333,5.83333333 L7,2.33333333 L4.66666667,5.83333333 Z"></path>
                                                </svg>
                                            </pattern>
                                        </defs>
                                    </g>
                                    <g>
                                        <circle class="drawing-compass-pointer lastCircle" cx="267.984375" cy="253" r="3" fill={state.lineColor}></circle>
                                        <circle class="drawing-compass-pointer-border lastCircle lastbigcircle" aria-labelledby="compassAngleTitle compassAngleDesc" cx="267.984375" cy="253" r="17" tabIndex="0" focusable="true"></circle>
                                        <title id="compassAngleTitle">{l.compass_draw}</title>
                                        <desc id="compassAngleDesc">{l.shift_arrow_draw}</desc>
                                    </g>
                                    <g>
                                        <circle class="lastCircleMid" fill="url(#previewLastCircleMid_icon)" transform="rotate(90,160,243)" cx="267.984375" cy="293" r="12" opacity="0"></circle>
                                        <defs>
                                            <pattern id="previewLastCircleMid_icon" width="20" height="20">
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
    </div>
</main>