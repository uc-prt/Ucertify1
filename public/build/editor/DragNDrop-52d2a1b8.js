
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a7 as l, a8 as swal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, C as validate_each_argument, e as element, j as attr_dev, k as add_location, n as insert_dev, x as detach_dev, K as destroy_each, h as text, f as space, l as set_style, p as append_dev, q as listen_dev, F as set_data_dev, H as run_all, z as empty, B as noop, G as prop_dev, Y as src_url_equal, t as transition_in, r as group_outros, a as transition_out, u as check_outros, c as create_component, m as mount_component, b as destroy_component, o as onMount, M as append_styles, g as globals, L as beforeUpdate, A as AH, X as XMLToJSON, w as writable } from './main-c6523fb8.js';
import './style-inject.es-1c867377.js';
import { D as Draggable } from './Draggable-eea764a0.js';
import { R as Resizable } from './Resizable-87a71a4a.js';
import './codemirror.min-41ad232c.js';

class ContextMenu {
    constructor(container, items) {
        this.container = container;
        this.dom = null;
        this.shown = false;
        this.root = true;
        this.parent = null;
        this.submenus = [];
        this.items = items;

        this._onclick = e => {
            if (this.dom && e.target != this.dom && 
                e.target.parentElement != this.dom && 
                !e.target.classList.contains('item') && 
                !e.target.parentElement.classList.contains('item')) {
                this.hideAll();
            }
        };

        this._oncontextmenu = e => {
            e.preventDefault();
			if (e.target != this.dom && 
                e.target.parentElement != this.dom && 
                !e.target.classList.contains('item') && 
                !e.target.parentElement.classList.contains('item')) {
				this.hideAll();
				this.show(e.pageX, e.pageY);
                this.dom.setAttribute('clientx', Math.round(e.clientX));
                this.dom.setAttribute('clienty', Math.round(e.clientY));
            }
        };

        this._oncontextmenu_keydown = e => {
            if (e.keyCode != 93) return;
            e.preventDefault();

            this.hideAll();
            this.show(e.clientX, e.clientY);
        };

        this._onblur = e => {
            this.hideAll();
        };
    }

    checkPosition(position, node) {
        let boundry = document.querySelector(self.container).getBoundingClientRect();
        let x = e.pageX;
        let y = e.pageY;
        let dimension = {
            width : node.offsetWidth / 2,
            height: node.offsetHeight / 2,
        };
        if (position.x < dimension.width) {
            x = dimension.width;
        } else if (position.x > (boundry.width -  dimension.width) ) {
            x = (boundry.width -  dimension.width);
        } 

        if (position.y < dimension.height) {
            y = dimension.height;
        } else if (position.y > (boundry.height -  dimension.height)) {
            y = (boundry.height -  dimension.height);
        }

        return [x, y];
    }

    getMenuDom() {
        const menu = document.createElement('div');
        menu.classList.add('context');

        for (const item of this.items) {
            menu.appendChild(this.itemToDomEl(item));
        }

        return menu;
    }

    itemToDomEl(data) {
        const item = document.createElement('div');

        if (data === null) {
            item.classList = 'separator';
            return item;
        }

        if (data.hasOwnProperty('color') && /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.color.toString())) {
            item.style.cssText = `color: ${data.color}`;
        }

        item.classList.add('item');

        const label = document.createElement('span');
        label.classList = 'label';
        label.innerText = data.hasOwnProperty('text') ? data['text'].toString() : '';
        item.appendChild(label);

        if (data.hasOwnProperty('disabled') && data['disabled']) {
            item.classList.add('disabled');
        } else {
            item.classList.add('enabled');
        }

        const hotkey = document.createElement('span');
        hotkey.classList = 'hotkey';
        hotkey.innerText = data.hasOwnProperty('hotkey') ? data['hotkey'].toString() : '';
        item.appendChild(hotkey);

        if (data.hasOwnProperty('subitems') && Array.isArray(data['subitems']) && data['subitems'].length > 0) {
            const menu = new ContextMenu(this.container, data['subitems']);
            menu.root = false;
            menu.parent = this;

            const openSubItems = e => {
                if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                    return;

                this.hideSubMenus();

                const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                const y = this.dom.offsetTop + item.offsetTop;

                if (!menu.shown) {
                    menu.show(x, y);
                } else {
                    menu.hide();
                }
            };

            this.submenus.push(menu);

            item.classList.add('has-subitems');
            item.addEventListener('click', openSubItems);
            item.addEventListener('mousemove', openSubItems);
        } else if (data.hasOwnProperty('submenu') && data['submenu'] instanceof ContextMenu) {
            const menu = data['submenu'];
            menu.root = false;
            menu.parent = this;

            const openSubItems = e => {
                if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                    return;

                this.hideSubMenus();

                const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                const y = this.dom.offsetTop + item.offsetTop;

                if (!menu.shown) {
                    menu.show(x, y);
                } else {
                    menu.hide();
                }
            };

            this.submenus.push(menu);

            item.classList.add('has-subitems');
            item.addEventListener('click', openSubItems);
            item.addEventListener('mousemove', openSubItems);
        } else {
            item.addEventListener('click', e => { 
                this.hideSubMenus();

                if (item.classList.contains('disabled'))
                    return;

                if (data.hasOwnProperty('onclick') && typeof data['onclick'] === 'function') {
                    const event = {
                        handled: false,
                        item: item,
                        label: label,
                        hotkey: hotkey,
                        items: this.items,
                        data: data
                    };
        
                    data['onclick'](event);
        
                    if (!event.handled) {
                        this.hide();
                    }
                } else {
                    this.hide();
                }
            });

            item.addEventListener('mousemove', e => {
                this.hideSubMenus();
            });
        }

        return item;
    }

    hideAll() {
        if (this.root && !this.parent) {
            if (this.shown) {
                this.hideSubMenus();

                this.shown = false;
                document.body.removeChild(this.dom);

                if (this.parent && this.parent.shown) {
                    this.parent.hide();
                }
            }

            return;
        }

        this.parent.hide();
    }

    hide() {
        if (this.dom && this.shown) {
            this.shown = false;
            this.hideSubMenus();
            document.body.removeChild(this.dom);

            if (this.parent && this.parent.shown) {
                this.parent.hide();
            }
        }
    }

    hideSubMenus() {
        for (const menu of this.submenus) {
            if (menu.shown) {
                menu.shown = false;
                document.body.removeChild(menu.dom);
            }
            menu.hideSubMenus();
        }
    }

    show(x, y) {
        this.dom = this.getMenuDom();
        
        this.dom.style.left = `${x}px`;
        this.dom.style.top = `${y}px`;

        this.shown = true;
        document.body.appendChild(this.dom);
    }

    install() {
        this.container.addEventListener('contextmenu', this._oncontextmenu);
        this.container.addEventListener('keydown', this._oncontextmenu_keydown);
        this.container.addEventListener('click', this._onclick);
        window.addEventListener('blur', this._onblur);
    }

    uninstall() {
        this.dom = null;
        this.container.removeEventListener('contextmenu', this._oncontextmenu);
        this.container.removeEventListener('keydown', this._oncontextmenu_keydown);
        this.container.removeEventListener('click', this._onclick);
        window.removeEventListener('blur', this._onblur);
    }
}

// CodeMirror version 3.20
//
// CodeMirror is the only global var we claim
window.CodeMirror = (function() {
  
    // BROWSER SNIFFING
  
    // Crude, but necessary to handle a number of hard-to-feature-detect
    // bugs and behavior differences.
    var gecko = /gecko\/\d/i.test(navigator.userAgent);
    // IE11 currently doesn't count as 'ie', since it has almost none of
    // the same bugs as earlier versions. Use ie_gt10 to handle
    // incompatibilities in that version.
    var ie = /MSIE \d/.test(navigator.userAgent);
    var ie_lt8 = ie && (document.documentMode == null || document.documentMode < 8);
    var ie_lt9 = ie && (document.documentMode == null || document.documentMode < 9);
    var ie_gt10 = /Trident\/([7-9]|\d{2,})\./.test(navigator.userAgent);
    var webkit = /WebKit\//.test(navigator.userAgent);
    var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);
    var chrome = /Chrome\//.test(navigator.userAgent);
    var opera = /Opera\//.test(navigator.userAgent);
    var safari = /Apple Computer/.test(navigator.vendor);
    var khtml = /KHTML\//.test(navigator.userAgent);
    var mac_geLion = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent);
    var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);
    var phantom = /PhantomJS/.test(navigator.userAgent);
  
    var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
    // This is woefully incomplete. Suggestions for alternative methods welcome.
    var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
    var mac = ios || /Mac/.test(navigator.platform);
    var windows = /win/i.test(navigator.platform);
  
    var opera_version = opera && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
    if (opera_version) opera_version = Number(opera_version[1]);
    if (opera_version && opera_version >= 15) { opera = false; webkit = true; }
    // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
    var flipCtrlCmd = mac && (qtwebkit || opera && (opera_version == null || opera_version < 12.11));
    var captureMiddleClick = gecko || (ie && !ie_lt9);
  
    // Optimize some code when these features are not used
    var sawReadOnlySpans = false, sawCollapsedSpans = false;
  
    // CONSTRUCTOR
  
    function CodeMirror(place, options) {
      if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);
  
      this.options = options = options || {};
      // Determine effective options based on given values and defaults.
      for (var opt in defaults) if (!options.hasOwnProperty(opt) && defaults.hasOwnProperty(opt))
        options[opt] = defaults[opt];
      setGuttersForLineNumbers(options);
  
      var docStart = typeof options.value == "string" ? 0 : options.value.first;
      var display = this.display = makeDisplay(place, docStart);
      display.wrapper.CodeMirror = this;
      updateGutters(this);
      if (options.autofocus && !mobile) focusInput(this);
  
      this.state = {keyMaps: [],
                    overlays: [],
                    modeGen: 0,
                    overwrite: false, focused: false,
                    suppressEdits: false, pasteIncoming: false,
                    draggingText: false,
                    highlight: new Delayed()};
  
      themeChanged(this);
      if (options.lineWrapping)
        this.display.wrapper.className += " CodeMirror-wrap";
  
      var doc = options.value;
      if (typeof doc == "string") doc = new Doc(options.value, options.mode);
      operation(this, attachDoc)(this, doc);
  
      // Override magic textarea content restore that IE sometimes does
      // on our hidden textarea on reload
      if (ie) setTimeout(bind(resetInput, this, true), 20);
  
      registerEventHandlers(this);
      // IE throws unspecified error in certain cases, when
      // trying to access activeElement before onload
      var hasFocus; try { hasFocus = (document.activeElement == display.input); } catch(e) { }
      if (hasFocus || (options.autofocus && !mobile)) setTimeout(bind(onFocus, this), 20);
      else onBlur(this);
  
      operation(this, function() {
        for (var opt in optionHandlers)
          if (optionHandlers.propertyIsEnumerable(opt))
            optionHandlers[opt](this, options[opt], Init);
        for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
      })();
    }
  
    // DISPLAY CONSTRUCTOR
  
    function makeDisplay(place, docStart) {
      var d = {};
  
      var input = d.input = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;");
      if (webkit) input.style.width = "1000px";
      else input.setAttribute("wrap", "off");
      // if border: 0; -- iOS fails to open keyboard (issue #1287)
      if (ios) input.style.border = "1px solid black";
      input.setAttribute("autocorrect", "off"); input.setAttribute("autocapitalize", "off"); input.setAttribute("spellcheck", "false");
  
      // Wraps and hides input textarea
      d.inputDiv = elt("div", [input], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
      // The actual fake scrollbars.
      d.scrollbarH = elt("div", [elt("div", null, null, "height: 1px")], "CodeMirror-hscrollbar");
      d.scrollbarV = elt("div", [elt("div", null, null, "width: 1px")], "CodeMirror-vscrollbar");
      d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
      d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
      // DIVs containing the selection and the actual code
      d.lineDiv = elt("div", null, "CodeMirror-code");
      d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
      // Blinky cursor, and element used to ensure cursor fits at the end of a line
      d.cursor = elt("div", "\u00a0", "CodeMirror-cursor");
      // Secondary cursor, shown when on a 'jump' in bi-directional text
      d.otherCursor = elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor");
      // Used to measure text size
      d.measure = elt("div", null, "CodeMirror-measure");
      // Wraps everything that needs to exist inside the vertically-padded coordinate system
      d.lineSpace = elt("div", [d.measure, d.selectionDiv, d.lineDiv, d.cursor, d.otherCursor],
                           null, "position: relative; outline: none");
      // Moved around its parent to cover visible view
      d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
      // Set to the height of the text, causes scrolling
      d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
      // D is needed because behavior of elts with overflow: auto and padding is inconsistent across browsers
      d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerCutOff + "px; width: 1px;");
      // Will contain the gutters, if any
      d.gutters = elt("div", null, "CodeMirror-gutters");
      d.lineGutter = null;
      // Provides scrolling
      d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
      d.scroller.setAttribute("tabIndex", "-1");
      // The element in which the editor lives.
      d.wrapper = elt("div", [d.inputDiv, d.scrollbarH, d.scrollbarV,
                              d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");
      // Work around IE7 z-index bug
      if (ie_lt8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
      if (place.appendChild) place.appendChild(d.wrapper); else place(d.wrapper);
  
      // Needed to hide big blue blinking cursor on Mobile Safari
      if (ios) input.style.width = "0px";
      if (!webkit) d.scroller.draggable = true;
      // Needed to handle Tab key in KHTML
      if (khtml) { d.inputDiv.style.height = "1px"; d.inputDiv.style.position = "absolute"; }
      // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
      else if (ie_lt8) d.scrollbarH.style.minWidth = d.scrollbarV.style.minWidth = "18px";
  
      // Current visible range (may be bigger than the view window).
      d.viewOffset = d.lastSizeC = 0;
      d.showingFrom = d.showingTo = docStart;
  
      // Used to only resize the line number gutter when necessary (when
      // the amount of lines crosses a boundary that makes its width change)
      d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
      // See readInput and resetInput
      d.prevInput = "";
      // Set to true when a non-horizontal-scrolling widget is added. As
      // an optimization, widget aligning is skipped when d is false.
      d.alignWidgets = false;
      // Flag that indicates whether we currently expect input to appear
      // (after some event like 'keypress' or 'input') and are polling
      // intensively.
      d.pollingFast = false;
      // Self-resetting timeout for the poller
      d.poll = new Delayed();
  
      d.cachedCharWidth = d.cachedTextHeight = null;
      d.measureLineCache = [];
      d.measureLineCachePos = 0;
  
      // Tracks when resetInput has punted to just putting a short
      // string instead of the (large) selection.
      d.inaccurateSelection = false;
  
      // Tracks the maximum line length so that the horizontal scrollbar
      // can be kept static when scrolling.
      d.maxLine = null;
      d.maxLineLength = 0;
      d.maxLineChanged = false;
  
      // Used for measuring wheel scrolling granularity
      d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
  
      return d;
    }
  
    // STATE UPDATES
  
    // Used to get the editor into a consistent state again when options change.
  
    function loadMode(cm) {
      cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
      cm.doc.iter(function(line) {
        if (line.stateAfter) line.stateAfter = null;
        if (line.styles) line.styles = null;
      });
      cm.doc.frontier = cm.doc.first;
      startWorker(cm, 100);
      cm.state.modeGen++;
      if (cm.curOp) regChange(cm);
    }
  
    function wrappingChanged(cm) {
      if (cm.options.lineWrapping) {
        cm.display.wrapper.className += " CodeMirror-wrap";
        cm.display.sizer.style.minWidth = "";
      } else {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-wrap", "");
        computeMaxLength(cm);
      }
      estimateLineHeights(cm);
      regChange(cm);
      clearCaches(cm);
      setTimeout(function(){updateScrollbars(cm);}, 100);
    }
  
    function estimateHeight(cm) {
      var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
      var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
      return function(line) {
        if (lineIsHidden(cm.doc, line))
          return 0;
        else if (wrapping)
          return (Math.ceil(line.text.length / perLine) || 1) * th;
        else
          return th;
      };
    }
  
    function estimateLineHeights(cm) {
      var doc = cm.doc, est = estimateHeight(cm);
      doc.iter(function(line) {
        var estHeight = est(line);
        if (estHeight != line.height) updateLineHeight(line, estHeight);
      });
    }
  
    function keyMapChanged(cm) {
      var map = keyMap[cm.options.keyMap], style = map.style;
      cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") +
        (style ? " cm-keymap-" + style : "");
      cm.state.disableInput = map.disableInput;
    }
  
    function themeChanged(cm) {
      cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
        cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
      clearCaches(cm);
    }
  
    function guttersChanged(cm) {
      updateGutters(cm);
      regChange(cm);
      setTimeout(function(){alignHorizontally(cm);}, 20);
    }
  
    function updateGutters(cm) {
      var gutters = cm.display.gutters, specs = cm.options.gutters;
      removeChildren(gutters);
      for (var i = 0; i < specs.length; ++i) {
        var gutterClass = specs[i];
        var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
        if (gutterClass == "CodeMirror-linenumbers") {
          cm.display.lineGutter = gElt;
          gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
        }
      }
      gutters.style.display = i ? "" : "none";
    }
  
    function lineLength(doc, line) {
      if (line.height == 0) return 0;
      var len = line.text.length, merged, cur = line;
      while (merged = collapsedSpanAtStart(cur)) {
        var found = merged.find();
        cur = getLine(doc, found.from.line);
        len += found.from.ch - found.to.ch;
      }
      cur = line;
      while (merged = collapsedSpanAtEnd(cur)) {
        var found = merged.find();
        len -= cur.text.length - found.from.ch;
        cur = getLine(doc, found.to.line);
        len += cur.text.length - found.to.ch;
      }
      return len;
    }
  
    function computeMaxLength(cm) {
      var d = cm.display, doc = cm.doc;
      d.maxLine = getLine(doc, doc.first);
      d.maxLineLength = lineLength(doc, d.maxLine);
      d.maxLineChanged = true;
      doc.iter(function(line) {
        var len = lineLength(doc, line);
        if (len > d.maxLineLength) {
          d.maxLineLength = len;
          d.maxLine = line;
        }
      });
    }
  
    // Make sure the gutters options contains the element
    // "CodeMirror-linenumbers" when the lineNumbers option is true.
    function setGuttersForLineNumbers(options) {
      var found = indexOf(options.gutters, "CodeMirror-linenumbers");
      if (found == -1 && options.lineNumbers) {
        options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
      } else if (found > -1 && !options.lineNumbers) {
        options.gutters = options.gutters.slice(0);
        options.gutters.splice(found, 1);
      }
    }
  
    // SCROLLBARS
  
    // Re-synchronize the fake scrollbars with the actual size of the
    // content. Optionally force a scrollTop.
    function updateScrollbars(cm) {
      var d = cm.display, docHeight = cm.doc.height;
      var totalHeight = docHeight + paddingVert(d);
      d.sizer.style.minHeight = d.heightForcer.style.top = totalHeight + "px";
      d.gutters.style.height = Math.max(totalHeight, d.scroller.clientHeight - scrollerCutOff) + "px";
      var scrollHeight = Math.max(totalHeight, d.scroller.scrollHeight);
      var needsH = d.scroller.scrollWidth > (d.scroller.clientWidth + 1);
      var needsV = scrollHeight > (d.scroller.clientHeight + 1);
      if (needsV) {
        d.scrollbarV.style.display = "block";
        d.scrollbarV.style.bottom = needsH ? scrollbarWidth(d.measure) + "px" : "0";
        d.scrollbarV.firstChild.style.height =
          (scrollHeight - d.scroller.clientHeight + d.scrollbarV.clientHeight) + "px";
      } else {
        d.scrollbarV.style.display = "";
        d.scrollbarV.firstChild.style.height = "0";
      }
      if (needsH) {
        d.scrollbarH.style.display = "block";
        d.scrollbarH.style.right = needsV ? scrollbarWidth(d.measure) + "px" : "0";
        d.scrollbarH.firstChild.style.width =
          (d.scroller.scrollWidth - d.scroller.clientWidth + d.scrollbarH.clientWidth) + "px";
      } else {
        d.scrollbarH.style.display = "";
        d.scrollbarH.firstChild.style.width = "0";
      }
      if (needsH && needsV) {
        d.scrollbarFiller.style.display = "block";
        d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = scrollbarWidth(d.measure) + "px";
      } else d.scrollbarFiller.style.display = "";
      if (needsH && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
        d.gutterFiller.style.display = "block";
        d.gutterFiller.style.height = scrollbarWidth(d.measure) + "px";
        d.gutterFiller.style.width = d.gutters.offsetWidth + "px";
      } else d.gutterFiller.style.display = "";
  
      if (mac_geLion && scrollbarWidth(d.measure) === 0) {
        d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = mac_geMountainLion ? "18px" : "12px";
        d.scrollbarV.style.pointerEvents = d.scrollbarH.style.pointerEvents = "none";
      }
    }
  
    function visibleLines(display, doc, viewPort) {
      var top = display.scroller.scrollTop, height = display.wrapper.clientHeight;
      if (typeof viewPort == "number") top = viewPort;
      else if (viewPort) {top = viewPort.top; height = viewPort.bottom - viewPort.top;}
      top = Math.floor(top - paddingTop(display));
      var bottom = Math.ceil(top + height);
      return {from: lineAtHeight(doc, top), to: lineAtHeight(doc, bottom)};
    }
  
    // LINE NUMBERS
  
    function alignHorizontally(cm) {
      var display = cm.display;
      if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
      var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
      var gutterW = display.gutters.offsetWidth, l = comp + "px";
      for (var n = display.lineDiv.firstChild; n; n = n.nextSibling) if (n.alignable) {
        for (var i = 0, a = n.alignable; i < a.length; ++i) a[i].style.left = l;
      }
      if (cm.options.fixedGutter)
        display.gutters.style.left = (comp + gutterW) + "px";
    }
  
    function maybeUpdateLineNumberWidth(cm) {
      if (!cm.options.lineNumbers) return false;
      var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
      if (last.length != display.lineNumChars) {
        var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                   "CodeMirror-linenumber CodeMirror-gutter-elt"));
        var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
        display.lineGutter.style.width = "";
        display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding);
        display.lineNumWidth = display.lineNumInnerWidth + padding;
        display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
        display.lineGutter.style.width = display.lineNumWidth + "px";
        return true;
      }
      return false;
    }
  
    function lineNumberFor(options, i) {
      return String(options.lineNumberFormatter(i + options.firstLineNumber));
    }
    function compensateForHScroll(display) {
      return getRect(display.scroller).left - getRect(display.sizer).left;
    }
  
    // DISPLAY DRAWING
  
    function updateDisplay(cm, changes, viewPort, forced) {
      var oldFrom = cm.display.showingFrom, oldTo = cm.display.showingTo, updated;
      var visible = visibleLines(cm.display, cm.doc, viewPort);
      for (var first = true;; first = false) {
        var oldWidth = cm.display.scroller.clientWidth;
        if (!updateDisplayInner(cm, changes, visible, forced)) break;
        updated = true;
        changes = [];
        updateSelection(cm);
        updateScrollbars(cm);
        if (first && cm.options.lineWrapping && oldWidth != cm.display.scroller.clientWidth) {
          forced = true;
          continue;
        }
        forced = false;
  
        // Clip forced viewport to actual scrollable area
        if (viewPort)
          viewPort = Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight,
                              typeof viewPort == "number" ? viewPort : viewPort.top);
        visible = visibleLines(cm.display, cm.doc, viewPort);
        if (visible.from >= cm.display.showingFrom && visible.to <= cm.display.showingTo)
          break;
      }
  
      if (updated) {
        signalLater(cm, "update", cm);
        if (cm.display.showingFrom != oldFrom || cm.display.showingTo != oldTo)
          signalLater(cm, "viewportChange", cm, cm.display.showingFrom, cm.display.showingTo);
      }
      return updated;
    }
  
    // Uses a set of changes plus the current scroll position to
    // determine which DOM updates have to be made, and makes the
    // updates.
    function updateDisplayInner(cm, changes, visible, forced) {
      var display = cm.display, doc = cm.doc;
      if (!display.wrapper.clientWidth) {
        display.showingFrom = display.showingTo = doc.first;
        display.viewOffset = 0;
        return;
      }
  
      // Bail out if the visible area is already rendered and nothing changed.
      if (!forced && changes.length == 0 &&
          visible.from > display.showingFrom && visible.to < display.showingTo)
        return;
  
      if (maybeUpdateLineNumberWidth(cm))
        changes = [{from: doc.first, to: doc.first + doc.size}];
      var gutterW = display.sizer.style.marginLeft = display.gutters.offsetWidth + "px";
      display.scrollbarH.style.left = cm.options.fixedGutter ? gutterW : "0";
  
      // Used to determine which lines need their line numbers updated
      var positionsChangedFrom = Infinity;
      if (cm.options.lineNumbers)
        for (var i = 0; i < changes.length; ++i)
          if (changes[i].diff && changes[i].from < positionsChangedFrom) { positionsChangedFrom = changes[i].from; }
  
      var end = doc.first + doc.size;
      var from = Math.max(visible.from - cm.options.viewportMargin, doc.first);
      var to = Math.min(end, visible.to + cm.options.viewportMargin);
      if (display.showingFrom < from && from - display.showingFrom < 20) from = Math.max(doc.first, display.showingFrom);
      if (display.showingTo > to && display.showingTo - to < 20) to = Math.min(end, display.showingTo);
      if (sawCollapsedSpans) {
        from = lineNo(visualLine(doc, getLine(doc, from)));
        while (to < end && lineIsHidden(doc, getLine(doc, to))) ++to;
      }
  
      // Create a range of theoretically intact lines, and punch holes
      // in that using the change info.
      var intact = [{from: Math.max(display.showingFrom, doc.first),
                     to: Math.min(display.showingTo, end)}];
      if (intact[0].from >= intact[0].to) intact = [];
      else intact = computeIntact(intact, changes);
      // When merged lines are present, we might have to reduce the
      // intact ranges because changes in continued fragments of the
      // intact lines do require the lines to be redrawn.
      if (sawCollapsedSpans)
        for (var i = 0; i < intact.length; ++i) {
          var range = intact[i], merged;
          while (merged = collapsedSpanAtEnd(getLine(doc, range.to - 1))) {
            var newTo = merged.find().from.line;
            if (newTo > range.from) range.to = newTo;
            else { intact.splice(i--, 1); break; }
          }
        }
  
      // Clip off the parts that won't be visible
      var intactLines = 0;
      for (var i = 0; i < intact.length; ++i) {
        var range = intact[i];
        if (range.from < from) range.from = from;
        if (range.to > to) range.to = to;
        if (range.from >= range.to) intact.splice(i--, 1);
        else intactLines += range.to - range.from;
      }
      if (!forced && intactLines == to - from && from == display.showingFrom && to == display.showingTo) {
        updateViewOffset(cm);
        return;
      }
      intact.sort(function(a, b) {return a.from - b.from;});
  
      // Avoid crashing on IE's "unspecified error" when in iframes
      try {
        var focused = document.activeElement;
      } catch(e) {}
      if (intactLines < (to - from) * .7) display.lineDiv.style.display = "none";
      patchDisplay(cm, from, to, intact, positionsChangedFrom);
      display.lineDiv.style.display = "";
      if (focused && document.activeElement != focused && focused.offsetHeight) focused.focus();
  
      var different = from != display.showingFrom || to != display.showingTo ||
        display.lastSizeC != display.wrapper.clientHeight;
      // This is just a bogus formula that detects when the editor is
      // resized or the font size changes.
      if (different) {
        display.lastSizeC = display.wrapper.clientHeight;
        startWorker(cm, 400);
      }
      display.showingFrom = from; display.showingTo = to;
  
      updateHeightsInViewport(cm);
      updateViewOffset(cm);
  
      return true;
    }
  
    function updateHeightsInViewport(cm) {
      var display = cm.display;
      var prevBottom = display.lineDiv.offsetTop;
      for (var node = display.lineDiv.firstChild, height; node; node = node.nextSibling) if (node.lineObj) {
        if (ie_lt8) {
          var bot = node.offsetTop + node.offsetHeight;
          height = bot - prevBottom;
          prevBottom = bot;
        } else {
          var box = getRect(node);
          height = box.bottom - box.top;
        }
        var diff = node.lineObj.height - height;
        if (height < 2) height = textHeight(display);
        if (diff > .001 || diff < -.001) {
          updateLineHeight(node.lineObj, height);
          var widgets = node.lineObj.widgets;
          if (widgets) for (var i = 0; i < widgets.length; ++i)
            widgets[i].height = widgets[i].node.offsetHeight;
        }
      }
    }
  
    function updateViewOffset(cm) {
      var off = cm.display.viewOffset = heightAtLine(cm, getLine(cm.doc, cm.display.showingFrom));
      // Position the mover div to align with the current virtual scroll position
      cm.display.mover.style.top = off + "px";
    }
  
    function computeIntact(intact, changes) {
      for (var i = 0, l = changes.length || 0; i < l; ++i) {
        var change = changes[i], intact2 = [], diff = change.diff || 0;
        for (var j = 0, l2 = intact.length; j < l2; ++j) {
          var range = intact[j];
          if (change.to <= range.from && change.diff) {
            intact2.push({from: range.from + diff, to: range.to + diff});
          } else if (change.to <= range.from || change.from >= range.to) {
            intact2.push(range);
          } else {
            if (change.from > range.from)
              intact2.push({from: range.from, to: change.from});
            if (change.to < range.to)
              intact2.push({from: change.to + diff, to: range.to + diff});
          }
        }
        intact = intact2;
      }
      return intact;
    }
  
    function getDimensions(cm) {
      var d = cm.display, left = {}, width = {};
      for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
        left[cm.options.gutters[i]] = n.offsetLeft;
        width[cm.options.gutters[i]] = n.offsetWidth;
      }
      return {fixedPos: compensateForHScroll(d),
              gutterTotalWidth: d.gutters.offsetWidth,
              gutterLeft: left,
              gutterWidth: width,
              wrapperWidth: d.wrapper.clientWidth};
    }
  
    function patchDisplay(cm, from, to, intact, updateNumbersFrom) {
      var dims = getDimensions(cm);
      var display = cm.display, lineNumbers = cm.options.lineNumbers;
      if (!intact.length && (!webkit || !cm.display.currentWheelTarget))
        removeChildren(display.lineDiv);
      var container = display.lineDiv, cur = container.firstChild;
  
      function rm(node) {
        var next = node.nextSibling;
        if (webkit && mac && cm.display.currentWheelTarget == node) {
          node.style.display = "none";
          node.lineObj = null;
        } else {
          node.parentNode.removeChild(node);
        }
        return next;
      }
  
      var nextIntact = intact.shift(), lineN = from;
      cm.doc.iter(from, to, function(line) {
        if (nextIntact && nextIntact.to == lineN) nextIntact = intact.shift();
        if (lineIsHidden(cm.doc, line)) {
          if (line.height != 0) updateLineHeight(line, 0);
          if (line.widgets && cur && cur.previousSibling) for (var i = 0; i < line.widgets.length; ++i) {
            var w = line.widgets[i];
            if (w.showIfHidden) {
              var prev = cur.previousSibling;
              if (/pre/i.test(prev.nodeName)) {
                var wrap = elt("div", null, null, "position: relative");
                prev.parentNode.replaceChild(wrap, prev);
                wrap.appendChild(prev);
                prev = wrap;
              }
              var wnode = prev.appendChild(elt("div", [w.node], "CodeMirror-linewidget"));
              if (!w.handleMouseEvents) wnode.ignoreEvents = true;
              positionLineWidget(w, wnode, prev, dims);
            }
          }
        } else if (nextIntact && nextIntact.from <= lineN && nextIntact.to > lineN) {
          // This line is intact. Skip to the actual node. Update its
          // line number if needed.
          while (cur.lineObj != line) cur = rm(cur);
          if (lineNumbers && updateNumbersFrom <= lineN && cur.lineNumber)
            setTextContent(cur.lineNumber, lineNumberFor(cm.options, lineN));
          cur = cur.nextSibling;
        } else {
          // For lines with widgets, make an attempt to find and reuse
          // the existing element, so that widgets aren't needlessly
          // removed and re-inserted into the dom
          if (line.widgets) for (var j = 0, search = cur, reuse; search && j < 20; ++j, search = search.nextSibling)
            if (search.lineObj == line && /div/i.test(search.nodeName)) { reuse = search; break; }
          // This line needs to be generated.
          var lineNode = buildLineElement(cm, line, lineN, dims, reuse);
          if (lineNode != reuse) {
            container.insertBefore(lineNode, cur);
          } else {
            while (cur != reuse) cur = rm(cur);
            cur = cur.nextSibling;
          }
  
          lineNode.lineObj = line;
        }
        ++lineN;
      });
      while (cur) cur = rm(cur);
    }
  
    function buildLineElement(cm, line, lineNo, dims, reuse) {
      var built = buildLineContent(cm, line), lineElement = built.pre;
      var markers = line.gutterMarkers, display = cm.display, wrap;
  
      var bgClass = built.bgClass ? built.bgClass + " " + (line.bgClass || "") : line.bgClass;
      if (!cm.options.lineNumbers && !markers && !bgClass && !line.wrapClass && !line.widgets)
        return lineElement;
  
      // Lines with gutter elements, widgets or a background class need
      // to be wrapped again, and have the extra elements added to the
      // wrapper div
  
      if (reuse) {
        reuse.alignable = null;
        var isOk = true, widgetsSeen = 0, insertBefore = null;
        for (var n = reuse.firstChild, next; n; n = next) {
          next = n.nextSibling;
          if (!/\bCodeMirror-linewidget\b/.test(n.className)) {
            reuse.removeChild(n);
          } else {
            for (var i = 0; i < line.widgets.length; ++i) {
              var widget = line.widgets[i];
              if (widget.node == n.firstChild) {
                if (!widget.above && !insertBefore) insertBefore = n;
                positionLineWidget(widget, n, reuse, dims);
                ++widgetsSeen;
                break;
              }
            }
            if (i == line.widgets.length) { isOk = false; break; }
          }
        }
        reuse.insertBefore(lineElement, insertBefore);
        if (isOk && widgetsSeen == line.widgets.length) {
          wrap = reuse;
          reuse.className = line.wrapClass || "";
        }
      }
      if (!wrap) {
        wrap = elt("div", null, line.wrapClass, "position: relative");
        wrap.appendChild(lineElement);
      }
      // Kludge to make sure the styled element lies behind the selection (by z-index)
      if (bgClass)
        wrap.insertBefore(elt("div", null, bgClass + " CodeMirror-linebackground"), wrap.firstChild);
      if (cm.options.lineNumbers || markers) {
        var gutterWrap = wrap.insertBefore(elt("div", null, null, "position: absolute; left: " +
                                               (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"),
                                           wrap.firstChild);
        if (cm.options.fixedGutter) (wrap.alignable || (wrap.alignable = [])).push(gutterWrap);
        if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
          wrap.lineNumber = gutterWrap.appendChild(
            elt("div", lineNumberFor(cm.options, lineNo),
                "CodeMirror-linenumber CodeMirror-gutter-elt",
                "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
                + display.lineNumInnerWidth + "px"));
        if (markers)
          for (var k = 0; k < cm.options.gutters.length; ++k) {
            var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
            if (found)
              gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
                                         dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
          }
      }
      if (ie_lt8) wrap.style.zIndex = 2;
      if (line.widgets && wrap != reuse) for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
        var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
        if (!widget.handleMouseEvents) node.ignoreEvents = true;
        positionLineWidget(widget, node, wrap, dims);
        if (widget.above)
          wrap.insertBefore(node, cm.options.lineNumbers && line.height != 0 ? gutterWrap : lineElement);
        else
          wrap.appendChild(node);
        signalLater(widget, "redraw");
      }
      return wrap;
    }
  
    function positionLineWidget(widget, node, wrap, dims) {
      if (widget.noHScroll) {
        (wrap.alignable || (wrap.alignable = [])).push(node);
        var width = dims.wrapperWidth;
        node.style.left = dims.fixedPos + "px";
        if (!widget.coverGutter) {
          width -= dims.gutterTotalWidth;
          node.style.paddingLeft = dims.gutterTotalWidth + "px";
        }
        node.style.width = width + "px";
      }
      if (widget.coverGutter) {
        node.style.zIndex = 5;
        node.style.position = "relative";
        if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
      }
    }
  
    // SELECTION / CURSOR
  
    function updateSelection(cm) {
      var display = cm.display;
      var collapsed = posEq(cm.doc.sel.from, cm.doc.sel.to);
      if (collapsed || cm.options.showCursorWhenSelecting)
        updateSelectionCursor(cm);
      else
        display.cursor.style.display = display.otherCursor.style.display = "none";
      if (!collapsed)
        updateSelectionRange(cm);
      else
        display.selectionDiv.style.display = "none";
  
      // Move the hidden textarea near the cursor to prevent scrolling artifacts
      if (cm.options.moveInputWithCursor) {
        var headPos = cursorCoords(cm, cm.doc.sel.head, "div");
        var wrapOff = getRect(display.wrapper), lineOff = getRect(display.lineDiv);
        display.inputDiv.style.top = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                                          headPos.top + lineOff.top - wrapOff.top)) + "px";
        display.inputDiv.style.left = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                                           headPos.left + lineOff.left - wrapOff.left)) + "px";
      }
    }
  
    // No selection, plain cursor
    function updateSelectionCursor(cm) {
      var display = cm.display, pos = cursorCoords(cm, cm.doc.sel.head, "div");
      display.cursor.style.left = pos.left + "px";
      display.cursor.style.top = pos.top + "px";
      display.cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
      display.cursor.style.display = "";
  
      if (pos.other) {
        display.otherCursor.style.display = "";
        display.otherCursor.style.left = pos.other.left + "px";
        display.otherCursor.style.top = pos.other.top + "px";
        display.otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
      } else { display.otherCursor.style.display = "none"; }
    }
  
    // Highlight selection
    function updateSelectionRange(cm) {
      var display = cm.display, doc = cm.doc, sel = cm.doc.sel;
      var fragment = document.createDocumentFragment();
      var clientWidth = display.lineSpace.offsetWidth, pl = paddingLeft(cm.display);
  
      function add(left, top, width, bottom) {
        if (top < 0) top = 0;
        fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
                                 "px; top: " + top + "px; width: " + (width == null ? clientWidth - left : width) +
                                 "px; height: " + (bottom - top) + "px"));
      }
  
      function drawForLine(line, fromArg, toArg) {
        var lineObj = getLine(doc, line);
        var lineLen = lineObj.text.length;
        var start, end;
        function coords(ch, bias) {
          return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
        }
  
        iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
          var leftPos = coords(from, "left"), rightPos, left, right;
          if (from == to) {
            rightPos = leftPos;
            left = right = leftPos.left;
          } else {
            rightPos = coords(to - 1, "right");
            if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
            left = leftPos.left;
            right = rightPos.right;
          }
          if (fromArg == null && from == 0) left = pl;
          if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
            add(left, leftPos.top, null, leftPos.bottom);
            left = pl;
            if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
          }
          if (toArg == null && to == lineLen) right = clientWidth;
          if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
            start = leftPos;
          if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
            end = rightPos;
          if (left < pl + 1) left = pl;
          add(left, rightPos.top, right - left, rightPos.bottom);
        });
        return {start: start, end: end};
      }
  
      if (sel.from.line == sel.to.line) {
        drawForLine(sel.from.line, sel.from.ch, sel.to.ch);
      } else {
        var fromLine = getLine(doc, sel.from.line), toLine = getLine(doc, sel.to.line);
        var singleVLine = visualLine(doc, fromLine) == visualLine(doc, toLine);
        var leftEnd = drawForLine(sel.from.line, sel.from.ch, singleVLine ? fromLine.text.length : null).end;
        var rightStart = drawForLine(sel.to.line, singleVLine ? 0 : null, sel.to.ch).start;
        if (singleVLine) {
          if (leftEnd.top < rightStart.top - 2) {
            add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
            add(pl, rightStart.top, rightStart.left, rightStart.bottom);
          } else {
            add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
          }
        }
        if (leftEnd.bottom < rightStart.top)
          add(pl, leftEnd.bottom, null, rightStart.top);
      }
  
      removeChildrenAndAdd(display.selectionDiv, fragment);
      display.selectionDiv.style.display = "";
    }
  
    // Cursor-blinking
    function restartBlink(cm) {
      if (!cm.state.focused) return;
      var display = cm.display;
      clearInterval(display.blinker);
      var on = true;
      display.cursor.style.visibility = display.otherCursor.style.visibility = "";
      if (cm.options.cursorBlinkRate > 0)
        display.blinker = setInterval(function() {
          display.cursor.style.visibility = display.otherCursor.style.visibility = (on = !on) ? "" : "hidden";
        }, cm.options.cursorBlinkRate);
    }
  
    // HIGHLIGHT WORKER
  
    function startWorker(cm, time) {
      if (cm.doc.mode.startState && cm.doc.frontier < cm.display.showingTo)
        cm.state.highlight.set(time, bind(highlightWorker, cm));
    }
  
    function highlightWorker(cm) {
      var doc = cm.doc;
      if (doc.frontier < doc.first) doc.frontier = doc.first;
      if (doc.frontier >= cm.display.showingTo) return;
      var end = +new Date + cm.options.workTime;
      var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
      var changed = [], prevChange;
      doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.showingTo + 500), function(line) {
        if (doc.frontier >= cm.display.showingFrom) { // Visible
          var oldStyles = line.styles;
          line.styles = highlightLine(cm, line, state, true);
          var ischange = !oldStyles || oldStyles.length != line.styles.length;
          for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
          if (ischange) {
            if (prevChange && prevChange.end == doc.frontier) prevChange.end++;
            else changed.push(prevChange = {start: doc.frontier, end: doc.frontier + 1});
          }
          line.stateAfter = copyState(doc.mode, state);
        } else {
          processLine(cm, line.text, state);
          line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
        }
        ++doc.frontier;
        if (+new Date > end) {
          startWorker(cm, cm.options.workDelay);
          return true;
        }
      });
      if (changed.length)
        operation(cm, function() {
          for (var i = 0; i < changed.length; ++i)
            regChange(this, changed[i].start, changed[i].end);
        })();
    }
  
    // Finds the line to start with when starting a parse. Tries to
    // find a line with a stateAfter, so that it can start with a
    // valid state. If that fails, it returns the line with the
    // smallest indentation, which tends to need the least context to
    // parse correctly.
    function findStartLine(cm, n, precise) {
      var minindent, minline, doc = cm.doc;
      var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
      for (var search = n; search > lim; --search) {
        if (search <= doc.first) return doc.first;
        var line = getLine(doc, search - 1);
        if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
        var indented = countColumn(line.text, null, cm.options.tabSize);
        if (minline == null || minindent > indented) {
          minline = search - 1;
          minindent = indented;
        }
      }
      return minline;
    }
  
    function getStateBefore(cm, n, precise) {
      var doc = cm.doc, display = cm.display;
      if (!doc.mode.startState) return true;
      var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
      if (!state) state = startState(doc.mode);
      else state = copyState(doc.mode, state);
      doc.iter(pos, n, function(line) {
        processLine(cm, line.text, state);
        var save = pos == n - 1 || pos % 5 == 0 || pos >= display.showingFrom && pos < display.showingTo;
        line.stateAfter = save ? copyState(doc.mode, state) : null;
        ++pos;
      });
      if (precise) doc.frontier = pos;
      return state;
    }
  
    // POSITION MEASUREMENT
  
    function paddingTop(display) {return display.lineSpace.offsetTop;}
    function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
    function paddingLeft(display) {
      var e = removeChildrenAndAdd(display.measure, elt("pre", null, null, "text-align: left")).appendChild(elt("span", "x"));
      return e.offsetLeft;
    }
  
    function measureChar(cm, line, ch, data, bias) {
      var dir = -1;
      data = data || measureLine(cm, line);
      if (data.crude) {
        var left = data.left + ch * data.width;
        return {left: left, right: left + data.width, top: data.top, bottom: data.bottom};
      }
  
      for (var pos = ch;; pos += dir) {
        var r = data[pos];
        if (r) break;
        if (dir < 0 && pos == 0) dir = 1;
      }
      bias = pos > ch ? "left" : pos < ch ? "right" : bias;
      if (bias == "left" && r.leftSide) r = r.leftSide;
      else if (bias == "right" && r.rightSide) r = r.rightSide;
      return {left: pos < ch ? r.right : r.left,
              right: pos > ch ? r.left : r.right,
              top: r.top,
              bottom: r.bottom};
    }
  
    function findCachedMeasurement(cm, line) {
      var cache = cm.display.measureLineCache;
      for (var i = 0; i < cache.length; ++i) {
        var memo = cache[i];
        if (memo.text == line.text && memo.markedSpans == line.markedSpans &&
            cm.display.scroller.clientWidth == memo.width &&
            memo.classes == line.textClass + "|" + line.wrapClass)
          return memo;
      }
    }
  
    function clearCachedMeasurement(cm, line) {
      var exists = findCachedMeasurement(cm, line);
      if (exists) exists.text = exists.measure = exists.markedSpans = null;
    }
  
    function measureLine(cm, line) {
      // First look in the cache
      var cached = findCachedMeasurement(cm, line);
      if (cached) return cached.measure;
  
      // Failing that, recompute and store result in cache
      var measure = measureLineInner(cm, line);
      var cache = cm.display.measureLineCache;
      var memo = {text: line.text, width: cm.display.scroller.clientWidth,
                  markedSpans: line.markedSpans, measure: measure,
                  classes: line.textClass + "|" + line.wrapClass};
      if (cache.length == 16) cache[++cm.display.measureLineCachePos % 16] = memo;
      else cache.push(memo);
      return measure;
    }
  
    function measureLineInner(cm, line) {
      if (!cm.options.lineWrapping && line.text.length >= cm.options.crudeMeasuringFrom)
        return crudelyMeasureLine(cm, line);
  
      var display = cm.display, measure = emptyArray(line.text.length);
      var pre = buildLineContent(cm, line, measure, true).pre;
  
      // IE does not cache element positions of inline elements between
      // calls to getBoundingClientRect. This makes the loop below,
      // which gathers the positions of all the characters on the line,
      // do an amount of layout work quadratic to the number of
      // characters. When line wrapping is off, we try to improve things
      // by first subdividing the line into a bunch of inline blocks, so
      // that IE can reuse most of the layout information from caches
      // for those blocks. This does interfere with line wrapping, so it
      // doesn't work when wrapping is on, but in that case the
      // situation is slightly better, since IE does cache line-wrapping
      // information and only recomputes per-line.
      if (ie && !ie_lt8 && !cm.options.lineWrapping && pre.childNodes.length > 100) {
        var fragment = document.createDocumentFragment();
        var chunk = 10, n = pre.childNodes.length;
        for (var i = 0, chunks = Math.ceil(n / chunk); i < chunks; ++i) {
          var wrap = elt("div", null, null, "display: inline-block");
          for (var j = 0; j < chunk && n; ++j) {
            wrap.appendChild(pre.firstChild);
            --n;
          }
          fragment.appendChild(wrap);
        }
        pre.appendChild(fragment);
      }
  
      removeChildrenAndAdd(display.measure, pre);
  
      var outer = getRect(display.lineDiv);
      var vranges = [], data = emptyArray(line.text.length), maxBot = pre.offsetHeight;
      // Work around an IE7/8 bug where it will sometimes have randomly
      // replaced our pre with a clone at this point.
      if (ie_lt9 && display.measure.first != pre)
        removeChildrenAndAdd(display.measure, pre);
  
      function measureRect(rect) {
        var top = rect.top - outer.top, bot = rect.bottom - outer.top;
        if (bot > maxBot) bot = maxBot;
        if (top < 0) top = 0;
        for (var i = vranges.length - 2; i >= 0; i -= 2) {
          var rtop = vranges[i], rbot = vranges[i+1];
          if (rtop > bot || rbot < top) continue;
          if (rtop <= top && rbot >= bot ||
              top <= rtop && bot >= rbot ||
              Math.min(bot, rbot) - Math.max(top, rtop) >= (bot - top) >> 1) {
            vranges[i] = Math.min(top, rtop);
            vranges[i+1] = Math.max(bot, rbot);
            break;
          }
        }
        if (i < 0) { i = vranges.length; vranges.push(top, bot); }
        return {left: rect.left - outer.left,
                right: rect.right - outer.left,
                top: i, bottom: null};
      }
      function finishRect(rect) {
        rect.bottom = vranges[rect.top+1];
        rect.top = vranges[rect.top];
      }
  
      for (var i = 0, cur; i < measure.length; ++i) if (cur = measure[i]) {
        var node = cur, rect = null;
        // A widget might wrap, needs special care
        if (/\bCodeMirror-widget\b/.test(cur.className) && cur.getClientRects) {
          if (cur.firstChild.nodeType == 1) node = cur.firstChild;
          var rects = node.getClientRects();
          if (rects.length > 1) {
            rect = data[i] = measureRect(rects[0]);
            rect.rightSide = measureRect(rects[rects.length - 1]);
          }
        }
        if (!rect) rect = data[i] = measureRect(getRect(node));
        if (cur.measureRight) rect.right = getRect(cur.measureRight).left;
        if (cur.leftSide) rect.leftSide = measureRect(getRect(cur.leftSide));
      }
      removeChildren(cm.display.measure);
      for (var i = 0, cur; i < data.length; ++i) if (cur = data[i]) {
        finishRect(cur);
        if (cur.leftSide) finishRect(cur.leftSide);
        if (cur.rightSide) finishRect(cur.rightSide);
      }
      return data;
    }
  
    function crudelyMeasureLine(cm, line) {
      var copy = new Line(line.text.slice(0, 100), null);
      if (line.textClass) copy.textClass = line.textClass;
      var measure = measureLineInner(cm, copy);
      var left = measureChar(cm, copy, 0, measure, "left");
      var right = measureChar(cm, copy, 99, measure, "right");
      return {crude: true, top: left.top, left: left.left, bottom: left.bottom, width: (right.right - left.left) / 100};
    }
  
    function measureLineWidth(cm, line) {
      var hasBadSpan = false;
      if (line.markedSpans) for (var i = 0; i < line.markedSpans; ++i) {
        var sp = line.markedSpans[i];
        if (sp.collapsed && (sp.to == null || sp.to == line.text.length)) hasBadSpan = true;
      }
      var cached = !hasBadSpan && findCachedMeasurement(cm, line);
      if (cached || line.text.length >= cm.options.crudeMeasuringFrom)
        return measureChar(cm, line, line.text.length, cached && cached.measure, "right").right;
  
      var pre = buildLineContent(cm, line, null, true).pre;
      var end = pre.appendChild(zeroWidthElement(cm.display.measure));
      removeChildrenAndAdd(cm.display.measure, pre);
      return getRect(end).right - getRect(cm.display.lineDiv).left;
    }
  
    function clearCaches(cm) {
      cm.display.measureLineCache.length = cm.display.measureLineCachePos = 0;
      cm.display.cachedCharWidth = cm.display.cachedTextHeight = null;
      if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
      cm.display.lineNumChars = null;
    }
  
    function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
    function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }
  
    // Context is one of "line", "div" (display.lineDiv), "local"/null (editor), or "page"
    function intoCoordSystem(cm, lineObj, rect, context) {
      if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
        var size = widgetHeight(lineObj.widgets[i]);
        rect.top += size; rect.bottom += size;
      }
      if (context == "line") return rect;
      if (!context) context = "local";
      var yOff = heightAtLine(cm, lineObj);
      if (context == "local") yOff += paddingTop(cm.display);
      else yOff -= cm.display.viewOffset;
      if (context == "page" || context == "window") {
        var lOff = getRect(cm.display.lineSpace);
        yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
        var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
        rect.left += xOff; rect.right += xOff;
      }
      rect.top += yOff; rect.bottom += yOff;
      return rect;
    }
  
    // Context may be "window", "page", "div", or "local"/null
    // Result is in "div" coords
    function fromCoordSystem(cm, coords, context) {
      if (context == "div") return coords;
      var left = coords.left, top = coords.top;
      // First move into "page" coordinate system
      if (context == "page") {
        left -= pageScrollX();
        top -= pageScrollY();
      } else if (context == "local" || !context) {
        var localBox = getRect(cm.display.sizer);
        left += localBox.left;
        top += localBox.top;
      }
  
      var lineSpaceBox = getRect(cm.display.lineSpace);
      return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
    }
  
    function charCoords(cm, pos, context, lineObj, bias) {
      if (!lineObj) lineObj = getLine(cm.doc, pos.line);
      return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, null, bias), context);
    }
  
    function cursorCoords(cm, pos, context, lineObj, measurement) {
      lineObj = lineObj || getLine(cm.doc, pos.line);
      if (!measurement) measurement = measureLine(cm, lineObj);
      function get(ch, right) {
        var m = measureChar(cm, lineObj, ch, measurement, right ? "right" : "left");
        if (right) m.left = m.right; else m.right = m.left;
        return intoCoordSystem(cm, lineObj, m, context);
      }
      function getBidi(ch, partPos) {
        var part = order[partPos], right = part.level % 2;
        if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
          part = order[--partPos];
          ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
          right = true;
        } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
          part = order[++partPos];
          ch = bidiLeft(part) - part.level % 2;
          right = false;
        }
        if (right && ch == part.to && ch > part.from) return get(ch - 1);
        return get(ch, right);
      }
      var order = getOrder(lineObj), ch = pos.ch;
      if (!order) return get(ch);
      var partPos = getBidiPartAt(order, ch);
      var val = getBidi(ch, partPos);
      if (bidiOther != null) val.other = getBidi(ch, bidiOther);
      return val;
    }
  
    function PosWithInfo(line, ch, outside, xRel) {
      var pos = new Pos(line, ch);
      pos.xRel = xRel;
      if (outside) pos.outside = true;
      return pos;
    }
  
    // Coords must be lineSpace-local
    function coordsChar(cm, x, y) {
      var doc = cm.doc;
      y += cm.display.viewOffset;
      if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
      var lineNo = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
      if (lineNo > last)
        return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
      if (x < 0) x = 0;
  
      for (;;) {
        var lineObj = getLine(doc, lineNo);
        var found = coordsCharInner(cm, lineObj, lineNo, x, y);
        var merged = collapsedSpanAtEnd(lineObj);
        var mergedPos = merged && merged.find();
        if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
          lineNo = mergedPos.to.line;
        else
          return found;
      }
    }
  
    function coordsCharInner(cm, lineObj, lineNo, x, y) {
      var innerOff = y - heightAtLine(cm, lineObj);
      var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
      var measurement = measureLine(cm, lineObj);
  
      function getX(ch) {
        var sp = cursorCoords(cm, Pos(lineNo, ch), "line",
                              lineObj, measurement);
        wrongLine = true;
        if (innerOff > sp.bottom) return sp.left - adjust;
        else if (innerOff < sp.top) return sp.left + adjust;
        else wrongLine = false;
        return sp.left;
      }
  
      var bidi = getOrder(lineObj), dist = lineObj.text.length;
      var from = lineLeft(lineObj), to = lineRight(lineObj);
      var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;
  
      if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
      // Do a binary search between these bounds.
      for (;;) {
        if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
          var ch = x < fromX || x - fromX <= toX - x ? from : to;
          var xDiff = x - (ch == from ? fromX : toX);
          while (isExtendingChar.test(lineObj.text.charAt(ch))) ++ch;
          var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
                                xDiff < 0 ? -1 : xDiff ? 1 : 0);
          return pos;
        }
        var step = Math.ceil(dist / 2), middle = from + step;
        if (bidi) {
          middle = from;
          for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
        }
        var middleX = getX(middle);
        if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
        else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
      }
    }
  
    var measureText;
    function textHeight(display) {
      if (display.cachedTextHeight != null) return display.cachedTextHeight;
      if (measureText == null) {
        measureText = elt("pre");
        // Measure a bunch of lines, for browsers that compute
        // fractional heights.
        for (var i = 0; i < 49; ++i) {
          measureText.appendChild(document.createTextNode("x"));
          measureText.appendChild(elt("br"));
        }
        measureText.appendChild(document.createTextNode("x"));
      }
      removeChildrenAndAdd(display.measure, measureText);
      var height = measureText.offsetHeight / 50;
      if (height > 3) display.cachedTextHeight = height;
      removeChildren(display.measure);
      return height || 1;
    }
  
    function charWidth(display) {
      if (display.cachedCharWidth != null) return display.cachedCharWidth;
      var anchor = elt("span", "x");
      var pre = elt("pre", [anchor]);
      removeChildrenAndAdd(display.measure, pre);
      var width = anchor.offsetWidth;
      if (width > 2) display.cachedCharWidth = width;
      return width || 10;
    }
  
    // OPERATIONS
  
    // Operations are used to wrap changes in such a way that each
    // change won't have to update the cursor and display (which would
    // be awkward, slow, and error-prone), but instead updates are
    // batched and then all combined and executed at once.
  
    var nextOpId = 0;
    function startOperation(cm) {
      cm.curOp = {
        // An array of ranges of lines that have to be updated. See
        // updateDisplay.
        changes: [],
        forceUpdate: false,
        updateInput: null,
        userSelChange: null,
        textChanged: null,
        selectionChanged: false,
        cursorActivity: false,
        updateMaxLine: false,
        updateScrollPos: false,
        id: ++nextOpId
      };
      if (!delayedCallbackDepth++) delayedCallbacks = [];
    }
  
    function endOperation(cm) {
      var op = cm.curOp, doc = cm.doc, display = cm.display;
      cm.curOp = null;
  
      if (op.updateMaxLine) computeMaxLength(cm);
      if (display.maxLineChanged && !cm.options.lineWrapping && display.maxLine) {
        var width = measureLineWidth(cm, display.maxLine);
        display.sizer.style.minWidth = Math.max(0, width + 3 + scrollerCutOff) + "px";
        display.maxLineChanged = false;
        var maxScrollLeft = Math.max(0, display.sizer.offsetLeft + display.sizer.offsetWidth - display.scroller.clientWidth);
        if (maxScrollLeft < doc.scrollLeft && !op.updateScrollPos)
          setScrollLeft(cm, Math.min(display.scroller.scrollLeft, maxScrollLeft), true);
      }
      var newScrollPos, updated;
      if (op.updateScrollPos) {
        newScrollPos = op.updateScrollPos;
      } else if (op.selectionChanged && display.scroller.clientHeight) { // don't rescroll if not visible
        var coords = cursorCoords(cm, doc.sel.head);
        newScrollPos = calculateScrollPos(cm, coords.left, coords.top, coords.left, coords.bottom);
      }
      if (op.changes.length || op.forceUpdate || newScrollPos && newScrollPos.scrollTop != null) {
        updated = updateDisplay(cm, op.changes, newScrollPos && newScrollPos.scrollTop, op.forceUpdate);
        if (cm.display.scroller.offsetHeight) cm.doc.scrollTop = cm.display.scroller.scrollTop;
      }
      if (!updated && op.selectionChanged) updateSelection(cm);
      if (op.updateScrollPos) {
        var top = Math.max(0, Math.min(display.scroller.scrollHeight - display.scroller.clientHeight, newScrollPos.scrollTop));
        var left = Math.max(0, Math.min(display.scroller.scrollWidth - display.scroller.clientWidth, newScrollPos.scrollLeft));
        display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = top;
        display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = left;
        alignHorizontally(cm);
        if (op.scrollToPos)
          scrollPosIntoView(cm, clipPos(cm.doc, op.scrollToPos.from),
                            clipPos(cm.doc, op.scrollToPos.to), op.scrollToPos.margin);
      } else if (newScrollPos) {
        scrollCursorIntoView(cm);
      }
      if (op.selectionChanged) restartBlink(cm);
  
      if (cm.state.focused && op.updateInput)
        resetInput(cm, op.userSelChange);
  
      var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
      if (hidden) for (var i = 0; i < hidden.length; ++i)
        if (!hidden[i].lines.length) signal(hidden[i], "hide");
      if (unhidden) for (var i = 0; i < unhidden.length; ++i)
        if (unhidden[i].lines.length) signal(unhidden[i], "unhide");
  
      var delayed;
      if (!--delayedCallbackDepth) {
        delayed = delayedCallbacks;
        delayedCallbacks = null;
      }
      if (op.textChanged)
        signal(cm, "change", cm, op.textChanged);
      if (op.cursorActivity) signal(cm, "cursorActivity", cm);
      if (delayed) for (var i = 0; i < delayed.length; ++i) delayed[i]();
    }
  
    // Wraps a function in an operation. Returns the wrapped function.
    function operation(cm1, f) {
      return function() {
        var cm = cm1 || this, withOp = !cm.curOp;
        if (withOp) startOperation(cm);
        try { var result = f.apply(cm, arguments); }
        finally { if (withOp) endOperation(cm); }
        return result;
      };
    }
    function docOperation(f) {
      return function() {
        var withOp = this.cm && !this.cm.curOp, result;
        if (withOp) startOperation(this.cm);
        try { result = f.apply(this, arguments); }
        finally { if (withOp) endOperation(this.cm); }
        return result;
      };
    }
    function runInOp(cm, f) {
      var withOp = !cm.curOp, result;
      if (withOp) startOperation(cm);
      try { result = f(); }
      finally { if (withOp) endOperation(cm); }
      return result;
    }
  
    function regChange(cm, from, to, lendiff) {
      if (from == null) from = cm.doc.first;
      if (to == null) to = cm.doc.first + cm.doc.size;
      cm.curOp.changes.push({from: from, to: to, diff: lendiff});
    }
  
    // INPUT HANDLING
  
    function slowPoll(cm) {
      if (cm.display.pollingFast) return;
      cm.display.poll.set(cm.options.pollInterval, function() {
        readInput(cm);
        if (cm.state.focused) slowPoll(cm);
      });
    }
  
    function fastPoll(cm) {
      var missed = false;
      cm.display.pollingFast = true;
      function p() {
        var changed = readInput(cm);
        if (!changed && !missed) {missed = true; cm.display.poll.set(60, p);}
        else {cm.display.pollingFast = false; slowPoll(cm);}
      }
      cm.display.poll.set(20, p);
    }
  
    // prevInput is a hack to work with IME. If we reset the textarea
    // on every change, that breaks IME. So we look for changes
    // compared to the previous content instead. (Modern browsers have
    // events that indicate IME taking place, but these are not widely
    // supported or compatible enough yet to rely on.)
    function readInput(cm) {
      var input = cm.display.input, prevInput = cm.display.prevInput, doc = cm.doc, sel = doc.sel;
      if (!cm.state.focused || hasSelection(input) || isReadOnly(cm) || cm.state.disableInput) return false;
      if (cm.state.pasteIncoming && cm.state.fakedLastChar) {
        input.value = input.value.substring(0, input.value.length - 1);
        cm.state.fakedLastChar = false;
      }
      var text = input.value;
      if (text == prevInput && posEq(sel.from, sel.to)) return false;
      if (ie && !ie_lt9 && cm.display.inputHasSelection === text) {
        resetInput(cm, true);
        return false;
      }
  
      var withOp = !cm.curOp;
      if (withOp) startOperation(cm);
      sel.shift = false;
      var same = 0, l = Math.min(prevInput.length, text.length);
      while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;
      var from = sel.from, to = sel.to;
      if (same < prevInput.length)
        from = Pos(from.line, from.ch - (prevInput.length - same));
      else if (cm.state.overwrite && posEq(from, to) && !cm.state.pasteIncoming)
        to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + (text.length - same)));
  
      var updateInput = cm.curOp.updateInput;
      var changeEvent = {from: from, to: to, text: splitLines(text.slice(same)),
                         origin: cm.state.pasteIncoming ? "paste" : "+input"};
      makeChange(cm.doc, changeEvent, "end");
      cm.curOp.updateInput = updateInput;
      signalLater(cm, "inputRead", cm, changeEvent);
  
      if (text.length > 1000 || text.indexOf("\n") > -1) input.value = cm.display.prevInput = "";
      else cm.display.prevInput = text;
      if (withOp) endOperation(cm);
      cm.state.pasteIncoming = false;
      return true;
    }
  
    function resetInput(cm, user) {
      var minimal, selected, doc = cm.doc;
      if (!posEq(doc.sel.from, doc.sel.to)) {
        cm.display.prevInput = "";
        minimal = hasCopyEvent &&
          (doc.sel.to.line - doc.sel.from.line > 100 || (selected = cm.getSelection()).length > 1000);
        var content = minimal ? "-" : selected || cm.getSelection();
        cm.display.input.value = content;
        if (cm.state.focused) selectInput(cm.display.input);
        if (ie && !ie_lt9) cm.display.inputHasSelection = content;
      } else if (user) {
        cm.display.prevInput = cm.display.input.value = "";
        if (ie && !ie_lt9) cm.display.inputHasSelection = null;
      }
      cm.display.inaccurateSelection = minimal;
    }
  
    function focusInput(cm) {
      if (cm.options.readOnly != "nocursor" && (!mobile || document.activeElement != cm.display.input))
        cm.display.input.focus();
    }
  
    function isReadOnly(cm) {
      return cm.options.readOnly || cm.doc.cantEdit;
    }
  
    // EVENT HANDLERS
  
    function registerEventHandlers(cm) {
      var d = cm.display;
      on(d.scroller, "mousedown", operation(cm, onMouseDown));
      if (ie)
        on(d.scroller, "dblclick", operation(cm, function(e) {
          if (signalDOMEvent(cm, e)) return;
          var pos = posFromMouse(cm, e);
          if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
          e_preventDefault(e);
          var word = findWordAt(getLine(cm.doc, pos.line).text, pos);
          extendSelection(cm.doc, word.from, word.to);
        }));
      else
        on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
      on(d.lineSpace, "selectstart", function(e) {
        if (!eventInWidget(d, e)) e_preventDefault(e);
      });
      // Gecko browsers fire contextmenu *after* opening the menu, at
      // which point we can't mess with it anymore. Context menu is
      // handled in onMouseDown for Gecko.
      if (!captureMiddleClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});
  
      on(d.scroller, "scroll", function() {
        if (d.scroller.clientHeight) {
          setScrollTop(cm, d.scroller.scrollTop);
          setScrollLeft(cm, d.scroller.scrollLeft, true);
          signal(cm, "scroll", cm);
        }
      });
      on(d.scrollbarV, "scroll", function() {
        if (d.scroller.clientHeight) setScrollTop(cm, d.scrollbarV.scrollTop);
      });
      on(d.scrollbarH, "scroll", function() {
        if (d.scroller.clientHeight) setScrollLeft(cm, d.scrollbarH.scrollLeft);
      });
  
      on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
      on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});
  
      function reFocus() { if (cm.state.focused) setTimeout(bind(focusInput, cm), 0); }
      on(d.scrollbarH, "mousedown", reFocus);
      on(d.scrollbarV, "mousedown", reFocus);
      // Prevent wrapper from ever scrolling
      on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });
  
      var resizeTimer;
      function onResize() {
        if (resizeTimer == null) resizeTimer = setTimeout(function() {
          resizeTimer = null;
          // Might be a text scaling operation, clear size caches.
          d.cachedCharWidth = d.cachedTextHeight = knownScrollbarWidth = null;
          clearCaches(cm);
          runInOp(cm, bind(regChange, cm));
        }, 100);
      }
      on(window, "resize", onResize);
      // Above handler holds on to the editor and its data structures.
      // Here we poll to unregister it when the editor is no longer in
      // the document, so that it can be garbage-collected.
      function unregister() {
        for (var p = d.wrapper.parentNode; p && p != document.body; p = p.parentNode) {}
        if (p) setTimeout(unregister, 5000);
        else off(window, "resize", onResize);
      }
      setTimeout(unregister, 5000);
  
      on(d.input, "keyup", operation(cm, function(e) {
        if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
        if (e.keyCode == 16) cm.doc.sel.shift = false;
      }));
      on(d.input, "input", function() {
        if (ie && !ie_lt9 && cm.display.inputHasSelection) cm.display.inputHasSelection = null;
        fastPoll(cm);
      });
      on(d.input, "keydown", operation(cm, onKeyDown));
      on(d.input, "keypress", operation(cm, onKeyPress));
      on(d.input, "focus", bind(onFocus, cm));
      on(d.input, "blur", bind(onBlur, cm));
  
      function drag_(e) {
        if (signalDOMEvent(cm, e) || cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))) return;
        e_stop(e);
      }
      if (cm.options.dragDrop) {
        on(d.scroller, "dragstart", function(e){onDragStart(cm, e);});
        on(d.scroller, "dragenter", drag_);
        on(d.scroller, "dragover", drag_);
        on(d.scroller, "drop", operation(cm, onDrop));
      }
      on(d.scroller, "paste", function(e) {
        if (eventInWidget(d, e)) return;
        focusInput(cm);
        fastPoll(cm);
      });
      on(d.input, "paste", function() {
        // Workaround for webkit bug https://bugs.webkit.org/show_bug.cgi?id=90206
        // Add a char to the end of textarea before paste occur so that
        // selection doesn't span to the end of textarea.
        if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
          var start = d.input.selectionStart, end = d.input.selectionEnd;
          d.input.value += "$";
          d.input.selectionStart = start;
          d.input.selectionEnd = end;
          cm.state.fakedLastChar = true;
        }
        cm.state.pasteIncoming = true;
        fastPoll(cm);
      });
  
      function prepareCopy() {
        if (d.inaccurateSelection) {
          d.prevInput = "";
          d.inaccurateSelection = false;
          d.input.value = cm.getSelection();
          selectInput(d.input);
        }
      }
      on(d.input, "cut", prepareCopy);
      on(d.input, "copy", prepareCopy);
  
      // Needed to handle Tab key in KHTML
      if (khtml) on(d.sizer, "mouseup", function() {
          if (document.activeElement == d.input) d.input.blur();
          focusInput(cm);
      });
    }
  
    function eventInWidget(display, e) {
      for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
        if (!n || n.ignoreEvents || n.parentNode == display.sizer && n != display.mover) return true;
      }
    }
  
    function posFromMouse(cm, e, liberal) {
      var display = cm.display;
      if (!liberal) {
        var target = e_target(e);
        if (target == display.scrollbarH || target == display.scrollbarH.firstChild ||
            target == display.scrollbarV || target == display.scrollbarV.firstChild ||
            target == display.scrollbarFiller || target == display.gutterFiller) return null;
      }
      var x, y, space = getRect(display.lineSpace);
      // Fails unpredictably on IE[67] when mouse is dragged around quickly.
      try { x = e.clientX; y = e.clientY; } catch (e) { return null; }
      return coordsChar(cm, x - space.left, y - space.top);
    }
  
    var lastClick, lastDoubleClick;
    function onMouseDown(e) {
      if (signalDOMEvent(this, e)) return;
      var cm = this, display = cm.display, doc = cm.doc, sel = doc.sel;
      sel.shift = e.shiftKey;
  
      if (eventInWidget(display, e)) {
        if (!webkit) {
          display.scroller.draggable = false;
          setTimeout(function(){display.scroller.draggable = true;}, 100);
        }
        return;
      }
      if (clickInGutter(cm, e)) return;
      var start = posFromMouse(cm, e);
  
      switch (e_button(e)) {
      case 3:
        if (captureMiddleClick) onContextMenu.call(cm, cm, e);
        return;
      case 2:
        if (webkit) cm.state.lastMiddleDown = +new Date;
        if (start) extendSelection(cm.doc, start);
        setTimeout(bind(focusInput, cm), 20);
        e_preventDefault(e);
        return;
      }
      // For button 1, if it was clicked inside the editor
      // (posFromMouse returning non-null), we have to adjust the
      // selection.
      if (!start) {if (e_target(e) == display.scroller) e_preventDefault(e); return;}
  
      if (!cm.state.focused) onFocus(cm);
  
      var now = +new Date, type = "single";
      if (lastDoubleClick && lastDoubleClick.time > now - 400 && posEq(lastDoubleClick.pos, start)) {
        type = "triple";
        e_preventDefault(e);
        setTimeout(bind(focusInput, cm), 20);
        selectLine(cm, start.line);
      } else if (lastClick && lastClick.time > now - 400 && posEq(lastClick.pos, start)) {
        type = "double";
        lastDoubleClick = {time: now, pos: start};
        e_preventDefault(e);
        var word = findWordAt(getLine(doc, start.line).text, start);
        extendSelection(cm.doc, word.from, word.to);
      } else { lastClick = {time: now, pos: start}; }
  
      var last = start;
      if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) && !posEq(sel.from, sel.to) &&
          !posLess(start, sel.from) && !posLess(sel.to, start) && type == "single") {
        var dragEnd = operation(cm, function(e2) {
          if (webkit) display.scroller.draggable = false;
          cm.state.draggingText = false;
          off(document, "mouseup", dragEnd);
          off(display.scroller, "drop", dragEnd);
          if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
            e_preventDefault(e2);
            extendSelection(cm.doc, start);
            focusInput(cm);
          }
        });
        // Let the drag handler handle this.
        if (webkit) display.scroller.draggable = true;
        cm.state.draggingText = dragEnd;
        // IE's approach to draggable
        if (display.scroller.dragDrop) display.scroller.dragDrop();
        on(document, "mouseup", dragEnd);
        on(display.scroller, "drop", dragEnd);
        return;
      }
      e_preventDefault(e);
      if (type == "single") extendSelection(cm.doc, clipPos(doc, start));
  
      var startstart = sel.from, startend = sel.to, lastPos = start;
  
      function doSelect(cur) {
        if (posEq(lastPos, cur)) return;
        lastPos = cur;
  
        if (type == "single") {
          extendSelection(cm.doc, clipPos(doc, start), cur);
          return;
        }
  
        startstart = clipPos(doc, startstart);
        startend = clipPos(doc, startend);
        if (type == "double") {
          var word = findWordAt(getLine(doc, cur.line).text, cur);
          if (posLess(cur, startstart)) extendSelection(cm.doc, word.from, startend);
          else extendSelection(cm.doc, startstart, word.to);
        } else if (type == "triple") {
          if (posLess(cur, startstart)) extendSelection(cm.doc, startend, clipPos(doc, Pos(cur.line, 0)));
          else extendSelection(cm.doc, startstart, clipPos(doc, Pos(cur.line + 1, 0)));
        }
      }
  
      var editorSize = getRect(display.wrapper);
      // Used to ensure timeout re-tries don't fire when another extend
      // happened in the meantime (clearTimeout isn't reliable -- at
      // least on Chrome, the timeouts still happen even when cleared,
      // if the clear happens after their scheduled firing time).
      var counter = 0;
  
      function extend(e) {
        var curCount = ++counter;
        var cur = posFromMouse(cm, e, true);
        if (!cur) return;
        if (!posEq(cur, last)) {
          if (!cm.state.focused) onFocus(cm);
          last = cur;
          doSelect(cur);
          var visible = visibleLines(display, doc);
          if (cur.line >= visible.to || cur.line < visible.from)
            setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
        } else {
          var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
          if (outside) setTimeout(operation(cm, function() {
            if (counter != curCount) return;
            display.scroller.scrollTop += outside;
            extend(e);
          }), 50);
        }
      }
  
      function done(e) {
        counter = Infinity;
        e_preventDefault(e);
        focusInput(cm);
        off(document, "mousemove", move);
        off(document, "mouseup", up);
      }
  
      var move = operation(cm, function(e) {
        if (!ie && !e_button(e)) done(e);
        else extend(e);
      });
      var up = operation(cm, done);
      on(document, "mousemove", move);
      on(document, "mouseup", up);
    }
  
    function gutterEvent(cm, e, type, prevent, signalfn) {
      try { var mX = e.clientX, mY = e.clientY; }
      catch(e) { return false; }
      if (mX >= Math.floor(getRect(cm.display.gutters).right)) return false;
      if (prevent) e_preventDefault(e);
  
      var display = cm.display;
      var lineBox = getRect(display.lineDiv);
  
      if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
      mY -= lineBox.top - display.viewOffset;
  
      for (var i = 0; i < cm.options.gutters.length; ++i) {
        var g = display.gutters.childNodes[i];
        if (g && getRect(g).right >= mX) {
          var line = lineAtHeight(cm.doc, mY);
          var gutter = cm.options.gutters[i];
          signalfn(cm, type, cm, line, gutter, e);
          return e_defaultPrevented(e);
        }
      }
    }
  
    function contextMenuInGutter(cm, e) {
      if (!hasHandler(cm, "gutterContextMenu")) return false;
      return gutterEvent(cm, e, "gutterContextMenu", false, signal);
    }
  
    function clickInGutter(cm, e) {
      return gutterEvent(cm, e, "gutterClick", true, signalLater);
    }
  
    // Kludge to work around strange IE behavior where it'll sometimes
    // re-fire a series of drag-related events right after the drop (#1551)
    var lastDrop = 0;
  
    function onDrop(e) {
      var cm = this;
      if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e) || (cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))))
        return;
      e_preventDefault(e);
      if (ie) lastDrop = +new Date;
      var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
      if (!pos || isReadOnly(cm)) return;
      if (files && files.length && window.FileReader && window.File) {
        var n = files.length, text = Array(n), read = 0;
        var loadFile = function(file, i) {
          var reader = new FileReader;
          reader.onload = function() {
            text[i] = reader.result;
            if (++read == n) {
              pos = clipPos(cm.doc, pos);
              makeChange(cm.doc, {from: pos, to: pos, text: splitLines(text.join("\n")), origin: "paste"}, "around");
            }
          };
          reader.readAsText(file);
        };
        for (var i = 0; i < n; ++i) loadFile(files[i], i);
      } else {
        // Don't do a replace if the drop happened inside of the selected text.
        if (cm.state.draggingText && !(posLess(pos, cm.doc.sel.from) || posLess(cm.doc.sel.to, pos))) {
          cm.state.draggingText(e);
          // Ensure the editor is re-focused
          setTimeout(bind(focusInput, cm), 20);
          return;
        }
        try {
          var text = e.dataTransfer.getData("Text");
          if (text) {
            var curFrom = cm.doc.sel.from, curTo = cm.doc.sel.to;
            setSelection(cm.doc, pos, pos);
            if (cm.state.draggingText) replaceRange(cm.doc, "", curFrom, curTo, "paste");
            cm.replaceSelection(text, null, "paste");
            focusInput(cm);
          }
        }
        catch(e){}
      }
    }
  
    function onDragStart(cm, e) {
      if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
      if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;
  
      var txt = cm.getSelection();
      e.dataTransfer.setData("Text", txt);
  
      // Use dummy image instead of default browsers image.
      // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
      if (e.dataTransfer.setDragImage && !safari) {
        var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
        img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        if (opera) {
          img.width = img.height = 1;
          cm.display.wrapper.appendChild(img);
          // Force a relayout, or Opera won't use our image for some obscure reason
          img._top = img.offsetTop;
        }
        e.dataTransfer.setDragImage(img, 0, 0);
        if (opera) img.parentNode.removeChild(img);
      }
    }
  
    function setScrollTop(cm, val) {
      if (Math.abs(cm.doc.scrollTop - val) < 2) return;
      cm.doc.scrollTop = val;
      if (!gecko) updateDisplay(cm, [], val);
      if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
      if (cm.display.scrollbarV.scrollTop != val) cm.display.scrollbarV.scrollTop = val;
      if (gecko) updateDisplay(cm, []);
      startWorker(cm, 100);
    }
    function setScrollLeft(cm, val, isScroller) {
      if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
      val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
      cm.doc.scrollLeft = val;
      alignHorizontally(cm);
      if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
      if (cm.display.scrollbarH.scrollLeft != val) cm.display.scrollbarH.scrollLeft = val;
    }
  
    // Since the delta values reported on mouse wheel events are
    // unstandardized between browsers and even browser versions, and
    // generally horribly unpredictable, this code starts by measuring
    // the scroll effect that the first few mouse wheel events have,
    // and, from that, detects the way it can convert deltas to pixel
    // offsets afterwards.
    //
    // The reason we want to know the amount a wheel event will scroll
    // is that it gives us a chance to update the display before the
    // actual scrolling happens, reducing flickering.
  
    var wheelSamples = 0, wheelPixelsPerUnit = null;
    // Fill in a browser-detected starting value on browsers where we
    // know one. These don't have to be accurate -- the result of them
    // being wrong would just be a slight flicker on the first wheel
    // scroll (if it is large enough).
    if (ie) wheelPixelsPerUnit = -.53;
    else if (gecko) wheelPixelsPerUnit = 15;
    else if (chrome) wheelPixelsPerUnit = -.7;
    else if (safari) wheelPixelsPerUnit = -1/3;
  
    function onScrollWheel(cm, e) {
      var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
      if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
      if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
      else if (dy == null) dy = e.wheelDelta;
  
      var display = cm.display, scroll = display.scroller;
      // Quit if there's nothing to scroll here
      if (!(dx && scroll.scrollWidth > scroll.clientWidth ||
            dy && scroll.scrollHeight > scroll.clientHeight)) return;
  
      // Webkit browsers on OS X abort momentum scrolls when the target
      // of the scroll event is removed from the scrollable element.
      // This hack (see related code in patchDisplay) makes sure the
      // element is kept around.
      if (dy && mac && webkit) {
        for (var cur = e.target; cur != scroll; cur = cur.parentNode) {
          if (cur.lineObj) {
            cm.display.currentWheelTarget = cur;
            break;
          }
        }
      }
  
      // On some browsers, horizontal scrolling will cause redraws to
      // happen before the gutter has been realigned, causing it to
      // wriggle around in a most unseemly way. When we have an
      // estimated pixels/delta value, we just handle horizontal
      // scrolling entirely here. It'll be slightly off from native, but
      // better than glitching out.
      if (dx && !gecko && !opera && wheelPixelsPerUnit != null) {
        if (dy)
          setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
        setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
        e_preventDefault(e);
        display.wheelStartX = null; // Abort measurement, if in progress
        return;
      }
  
      if (dy && wheelPixelsPerUnit != null) {
        var pixels = dy * wheelPixelsPerUnit;
        var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
        if (pixels < 0) top = Math.max(0, top + pixels - 50);
        else bot = Math.min(cm.doc.height, bot + pixels + 50);
        updateDisplay(cm, [], {top: top, bottom: bot});
      }
  
      if (wheelSamples < 20) {
        if (display.wheelStartX == null) {
          display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
          display.wheelDX = dx; display.wheelDY = dy;
          setTimeout(function() {
            if (display.wheelStartX == null) return;
            var movedX = scroll.scrollLeft - display.wheelStartX;
            var movedY = scroll.scrollTop - display.wheelStartY;
            var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
              (movedX && display.wheelDX && movedX / display.wheelDX);
            display.wheelStartX = display.wheelStartY = null;
            if (!sample) return;
            wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
            ++wheelSamples;
          }, 200);
        } else {
          display.wheelDX += dx; display.wheelDY += dy;
        }
      }
    }
  
    function doHandleBinding(cm, bound, dropShift) {
      if (typeof bound == "string") {
        bound = commands[bound];
        if (!bound) return false;
      }
      // Ensure previous input has been read, so that the handler sees a
      // consistent view of the document
      if (cm.display.pollingFast && readInput(cm)) cm.display.pollingFast = false;
      var doc = cm.doc, prevShift = doc.sel.shift, done = false;
      try {
        if (isReadOnly(cm)) cm.state.suppressEdits = true;
        if (dropShift) doc.sel.shift = false;
        done = bound(cm) != Pass;
      } finally {
        doc.sel.shift = prevShift;
        cm.state.suppressEdits = false;
      }
      return done;
    }
  
    function allKeyMaps(cm) {
      var maps = cm.state.keyMaps.slice(0);
      if (cm.options.extraKeys) maps.push(cm.options.extraKeys);
      maps.push(cm.options.keyMap);
      return maps;
    }
  
    var maybeTransition;
    function handleKeyBinding(cm, e) {
      // Handle auto keymap transitions
      var startMap = getKeyMap(cm.options.keyMap), next = startMap.auto;
      clearTimeout(maybeTransition);
      if (next && !isModifierKey(e)) maybeTransition = setTimeout(function() {
        if (getKeyMap(cm.options.keyMap) == startMap) {
          cm.options.keyMap = (next.call ? next.call(null, cm) : next);
          keyMapChanged(cm);
        }
      }, 50);
  
      var name = keyName(e, true), handled = false;
      if (!name) return false;
      var keymaps = allKeyMaps(cm);
  
      if (e.shiftKey) {
        // First try to resolve full name (including 'Shift-'). Failing
        // that, see if there is a cursor-motion command (starting with
        // 'go') bound to the keyname without 'Shift-'.
        handled = lookupKey("Shift-" + name, keymaps, function(b) {return doHandleBinding(cm, b, true);})
               || lookupKey(name, keymaps, function(b) {
                    if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
                      return doHandleBinding(cm, b);
                  });
      } else {
        handled = lookupKey(name, keymaps, function(b) { return doHandleBinding(cm, b); });
      }
  
      if (handled) {
        e_preventDefault(e);
        restartBlink(cm);
        if (ie_lt9) { e.oldKeyCode = e.keyCode; e.keyCode = 0; }
        signalLater(cm, "keyHandled", cm, name, e);
      }
      return handled;
    }
  
    function handleCharBinding(cm, e, ch) {
      var handled = lookupKey("'" + ch + "'", allKeyMaps(cm),
                              function(b) { return doHandleBinding(cm, b, true); });
      if (handled) {
        e_preventDefault(e);
        restartBlink(cm);
        signalLater(cm, "keyHandled", cm, "'" + ch + "'", e);
      }
      return handled;
    }
  
    var lastStoppedKey = null;
    function onKeyDown(e) {
      var cm = this;
      if (!cm.state.focused) onFocus(cm);
      if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
      if (ie && e.keyCode == 27) e.returnValue = false;
      var code = e.keyCode;
      // IE does strange things with escape.
      cm.doc.sel.shift = code == 16 || e.shiftKey;
      // First give onKeyEvent option a chance to handle this.
      var handled = handleKeyBinding(cm, e);
      if (opera) {
        lastStoppedKey = handled ? code : null;
        // Opera has no cut event... we try to at least catch the key combo
        if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
          cm.replaceSelection("");
      }
    }
  
    function onKeyPress(e) {
      var cm = this;
      if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
      var keyCode = e.keyCode, charCode = e.charCode;
      if (opera && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
      if (((opera && (!e.which || e.which < 10)) || khtml) && handleKeyBinding(cm, e)) return;
      var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
      if (this.options.electricChars && this.doc.mode.electricChars &&
          this.options.smartIndent && !isReadOnly(this) &&
          this.doc.mode.electricChars.indexOf(ch) > -1)
        setTimeout(operation(cm, function() {indentLine(cm, cm.doc.sel.to.line, "smart");}), 75);
      if (handleCharBinding(cm, e, ch)) return;
      if (ie && !ie_lt9) cm.display.inputHasSelection = null;
      fastPoll(cm);
    }
  
    function onFocus(cm) {
      if (cm.options.readOnly == "nocursor") return;
      if (!cm.state.focused) {
        signal(cm, "focus", cm);
        cm.state.focused = true;
        if (cm.display.wrapper.className.search(/\bCodeMirror-focused\b/) == -1)
          cm.display.wrapper.className += " CodeMirror-focused";
        if (!cm.curOp) {
          resetInput(cm, true);
          if (webkit) setTimeout(bind(resetInput, cm, true), 0); // Issue #1730
        }
      }
      slowPoll(cm);
      restartBlink(cm);
    }
    function onBlur(cm) {
      if (cm.state.focused) {
        signal(cm, "blur", cm);
        cm.state.focused = false;
        cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-focused", "");
      }
      clearInterval(cm.display.blinker);
      setTimeout(function() {if (!cm.state.focused) cm.doc.sel.shift = false;}, 150);
    }
  
    var detectingSelectAll;
    function onContextMenu(cm, e) {
      if (signalDOMEvent(cm, e, "contextmenu")) return;
      var display = cm.display, sel = cm.doc.sel;
      if (eventInWidget(display, e) || contextMenuInGutter(cm, e)) return;
  
      var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
      if (!pos || opera) return; // Opera is difficult.
  
      // Reset the current text selection only if the click is done outside of the selection
      // and 'resetSelectionOnContextMenu' option is true.
      var reset = cm.options.resetSelectionOnContextMenu;
      if (reset && (posEq(sel.from, sel.to) || posLess(pos, sel.from) || !posLess(pos, sel.to)))
        operation(cm, setSelection)(cm.doc, pos, pos);
  
      var oldCSS = display.input.style.cssText;
      display.inputDiv.style.position = "absolute";
      display.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
        "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: white; outline: none;" +
        "border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);";
      focusInput(cm);
      resetInput(cm, true);
      // Adds "Select all" to context menu in FF
      if (posEq(sel.from, sel.to)) display.input.value = display.prevInput = " ";
  
      function prepareSelectAllHack() {
        if (display.input.selectionStart != null) {
          var extval = display.input.value = "\u200b" + (posEq(sel.from, sel.to) ? "" : display.input.value);
          display.prevInput = "\u200b";
          display.input.selectionStart = 1; display.input.selectionEnd = extval.length;
        }
      }
      function rehide() {
        display.inputDiv.style.position = "relative";
        display.input.style.cssText = oldCSS;
        if (ie_lt9) display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos;
        slowPoll(cm);
  
        // Try to detect the user choosing select-all
        if (display.input.selectionStart != null) {
          if (!ie || ie_lt9) prepareSelectAllHack();
          clearTimeout(detectingSelectAll);
          var i = 0, poll = function(){
            if (display.prevInput == " " && display.input.selectionStart == 0)
              operation(cm, commands.selectAll)(cm);
            else if (i++ < 10) detectingSelectAll = setTimeout(poll, 500);
            else resetInput(cm);
          };
          detectingSelectAll = setTimeout(poll, 200);
        }
      }
  
      if (ie && !ie_lt9) prepareSelectAllHack();
      if (captureMiddleClick) {
        e_stop(e);
        var mouseup = function() {
          off(window, "mouseup", mouseup);
          setTimeout(rehide, 20);
        };
        on(window, "mouseup", mouseup);
      } else {
        setTimeout(rehide, 50);
      }
    }
  
    // UPDATING
  
    var changeEnd = CodeMirror.changeEnd = function(change) {
      if (!change.text) return change.to;
      return Pos(change.from.line + change.text.length - 1,
                 lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
    };
  
    // Make sure a position will be valid after the given change.
    function clipPostChange(doc, change, pos) {
      if (!posLess(change.from, pos)) return clipPos(doc, pos);
      var diff = (change.text.length - 1) - (change.to.line - change.from.line);
      if (pos.line > change.to.line + diff) {
        var preLine = pos.line - diff, lastLine = doc.first + doc.size - 1;
        if (preLine > lastLine) return Pos(lastLine, getLine(doc, lastLine).text.length);
        return clipToLen(pos, getLine(doc, preLine).text.length);
      }
      if (pos.line == change.to.line + diff)
        return clipToLen(pos, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0) +
                         getLine(doc, change.to.line).text.length - change.to.ch);
      var inside = pos.line - change.from.line;
      return clipToLen(pos, change.text[inside].length + (inside ? 0 : change.from.ch));
    }
  
    // Hint can be null|"end"|"start"|"around"|{anchor,head}
    function computeSelAfterChange(doc, change, hint) {
      if (hint && typeof hint == "object") // Assumed to be {anchor, head} object
        return {anchor: clipPostChange(doc, change, hint.anchor),
                head: clipPostChange(doc, change, hint.head)};
  
      if (hint == "start") return {anchor: change.from, head: change.from};
  
      var end = changeEnd(change);
      if (hint == "around") return {anchor: change.from, head: end};
      if (hint == "end") return {anchor: end, head: end};
  
      // hint is null, leave the selection alone as much as possible
      var adjustPos = function(pos) {
        if (posLess(pos, change.from)) return pos;
        if (!posLess(change.to, pos)) return end;
  
        var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        if (pos.line == change.to.line) ch += end.ch - change.to.ch;
        return Pos(line, ch);
      };
      return {anchor: adjustPos(doc.sel.anchor), head: adjustPos(doc.sel.head)};
    }
  
    function filterChange(doc, change, update) {
      var obj = {
        canceled: false,
        from: change.from,
        to: change.to,
        text: change.text,
        origin: change.origin,
        cancel: function() { this.canceled = true; }
      };
      if (update) obj.update = function(from, to, text, origin) {
        if (from) this.from = clipPos(doc, from);
        if (to) this.to = clipPos(doc, to);
        if (text) this.text = text;
        if (origin !== undefined) this.origin = origin;
      };
      signal(doc, "beforeChange", doc, obj);
      if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);
  
      if (obj.canceled) return null;
      return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
    }
  
    // Replace the range from from to to by the strings in replacement.
    // change is a {from, to, text [, origin]} object
    function makeChange(doc, change, selUpdate, ignoreReadOnly) {
      if (doc.cm) {
        if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, selUpdate, ignoreReadOnly);
        if (doc.cm.state.suppressEdits) return;
      }
  
      if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
        change = filterChange(doc, change, true);
        if (!change) return;
      }
  
      // Possibly split or suppress the update based on the presence
      // of read-only spans in its range.
      var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
      if (split) {
        for (var i = split.length - 1; i >= 1; --i)
          makeChangeNoReadonly(doc, {from: split[i].from, to: split[i].to, text: [""]});
        if (split.length)
          makeChangeNoReadonly(doc, {from: split[0].from, to: split[0].to, text: change.text}, selUpdate);
      } else {
        makeChangeNoReadonly(doc, change, selUpdate);
      }
    }
  
    function makeChangeNoReadonly(doc, change, selUpdate) {
      if (change.text.length == 1 && change.text[0] == "" && posEq(change.from, change.to)) return;
      var selAfter = computeSelAfterChange(doc, change, selUpdate);
      addToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
  
      makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
      var rebased = [];
  
      linkedDocs(doc, function(doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
      });
    }
  
    function makeChangeFromHistory(doc, type) {
      if (doc.cm && doc.cm.state.suppressEdits) return;
  
      var hist = doc.history;
      var event = (type == "undo" ? hist.done : hist.undone).pop();
      if (!event) return;
  
      var anti = {changes: [], anchorBefore: event.anchorAfter, headBefore: event.headAfter,
                  anchorAfter: event.anchorBefore, headAfter: event.headBefore,
                  generation: hist.generation};
      (type == "undo" ? hist.undone : hist.done).push(anti);
      hist.generation = event.generation || ++hist.maxGeneration;
  
      var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");
  
      for (var i = event.changes.length - 1; i >= 0; --i) {
        var change = event.changes[i];
        change.origin = type;
        if (filter && !filterChange(doc, change, false)) {
          (type == "undo" ? hist.done : hist.undone).length = 0;
          return;
        }
  
        anti.changes.push(historyChangeFromChange(doc, change));
  
        var after = i ? computeSelAfterChange(doc, change, null)
                      : {anchor: event.anchorBefore, head: event.headBefore};
        makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
        var rebased = [];
  
        linkedDocs(doc, function(doc, sharedHist) {
          if (!sharedHist && indexOf(rebased, doc.history) == -1) {
            rebaseHist(doc.history, change);
            rebased.push(doc.history);
          }
          makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
        });
      }
    }
  
    function shiftDoc(doc, distance) {
      function shiftPos(pos) {return Pos(pos.line + distance, pos.ch);}
      doc.first += distance;
      if (doc.cm) regChange(doc.cm, doc.first, doc.first, distance);
      doc.sel.head = shiftPos(doc.sel.head); doc.sel.anchor = shiftPos(doc.sel.anchor);
      doc.sel.from = shiftPos(doc.sel.from); doc.sel.to = shiftPos(doc.sel.to);
    }
  
    function makeChangeSingleDoc(doc, change, selAfter, spans) {
      if (doc.cm && !doc.cm.curOp)
        return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
  
      if (change.to.line < doc.first) {
        shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
        return;
      }
      if (change.from.line > doc.lastLine()) return;
  
      // Clip the change to the size of this doc
      if (change.from.line < doc.first) {
        var shift = change.text.length - 1 - (doc.first - change.from.line);
        shiftDoc(doc, shift);
        change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
                  text: [lst(change.text)], origin: change.origin};
      }
      var last = doc.lastLine();
      if (change.to.line > last) {
        change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
                  text: [change.text[0]], origin: change.origin};
      }
  
      change.removed = getBetween(doc, change.from, change.to);
  
      if (!selAfter) selAfter = computeSelAfterChange(doc, change, null);
      if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans, selAfter);
      else updateDoc(doc, change, spans, selAfter);
    }
  
    function makeChangeSingleDocInEditor(cm, change, spans, selAfter) {
      var doc = cm.doc, display = cm.display, from = change.from, to = change.to;
  
      var recomputeMaxLength = false, checkWidthStart = from.line;
      if (!cm.options.lineWrapping) {
        checkWidthStart = lineNo(visualLine(doc, getLine(doc, from.line)));
        doc.iter(checkWidthStart, to.line + 1, function(line) {
          if (line == display.maxLine) {
            recomputeMaxLength = true;
            return true;
          }
        });
      }
  
      if (!posLess(doc.sel.head, change.from) && !posLess(change.to, doc.sel.head))
        cm.curOp.cursorActivity = true;
  
      updateDoc(doc, change, spans, selAfter, estimateHeight(cm));
  
      if (!cm.options.lineWrapping) {
        doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
          var len = lineLength(doc, line);
          if (len > display.maxLineLength) {
            display.maxLine = line;
            display.maxLineLength = len;
            display.maxLineChanged = true;
            recomputeMaxLength = false;
          }
        });
        if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
      }
  
      // Adjust frontier, schedule worker
      doc.frontier = Math.min(doc.frontier, from.line);
      startWorker(cm, 400);
  
      var lendiff = change.text.length - (to.line - from.line) - 1;
      // Remember that these lines changed, for updating the display
      regChange(cm, from.line, to.line + 1, lendiff);
  
      if (hasHandler(cm, "change")) {
        var changeObj = {from: from, to: to,
                         text: change.text,
                         removed: change.removed,
                         origin: change.origin};
        if (cm.curOp.textChanged) {
          for (var cur = cm.curOp.textChanged; cur.next; cur = cur.next) {}
          cur.next = changeObj;
        } else cm.curOp.textChanged = changeObj;
      }
    }
  
    function replaceRange(doc, code, from, to, origin) {
      if (!to) to = from;
      if (posLess(to, from)) { var tmp = to; to = from; from = tmp; }
      if (typeof code == "string") code = splitLines(code);
      makeChange(doc, {from: from, to: to, text: code, origin: origin}, null);
    }
  
    // POSITION OBJECT
  
    function Pos(line, ch) {
      if (!(this instanceof Pos)) return new Pos(line, ch);
      this.line = line; this.ch = ch;
    }
    CodeMirror.Pos = Pos;
  
    function posEq(a, b) {return a.line == b.line && a.ch == b.ch;}
    function posLess(a, b) {return a.line < b.line || (a.line == b.line && a.ch < b.ch);}
    function copyPos(x) {return Pos(x.line, x.ch);}
  
    // SELECTION
  
    function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
    function clipPos(doc, pos) {
      if (pos.line < doc.first) return Pos(doc.first, 0);
      var last = doc.first + doc.size - 1;
      if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
      return clipToLen(pos, getLine(doc, pos.line).text.length);
    }
    function clipToLen(pos, linelen) {
      var ch = pos.ch;
      if (ch == null || ch > linelen) return Pos(pos.line, linelen);
      else if (ch < 0) return Pos(pos.line, 0);
      else return pos;
    }
    function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}
  
    // If shift is held, this will move the selection anchor. Otherwise,
    // it'll set the whole selection.
    function extendSelection(doc, pos, other, bias) {
      if (doc.sel.shift || doc.sel.extend) {
        var anchor = doc.sel.anchor;
        if (other) {
          var posBefore = posLess(pos, anchor);
          if (posBefore != posLess(other, anchor)) {
            anchor = pos;
            pos = other;
          } else if (posBefore != posLess(pos, other)) {
            pos = other;
          }
        }
        setSelection(doc, anchor, pos, bias);
      } else {
        setSelection(doc, pos, other || pos, bias);
      }
      if (doc.cm) doc.cm.curOp.userSelChange = true;
    }
  
    function filterSelectionChange(doc, anchor, head) {
      var obj = {anchor: anchor, head: head};
      signal(doc, "beforeSelectionChange", doc, obj);
      if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
      obj.anchor = clipPos(doc, obj.anchor); obj.head = clipPos(doc, obj.head);
      return obj;
    }
  
    // Update the selection. Last two args are only used by
    // updateDoc, since they have to be expressed in the line
    // numbers before the update.
    function setSelection(doc, anchor, head, bias, checkAtomic) {
      if (!checkAtomic && hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) {
        var filtered = filterSelectionChange(doc, anchor, head);
        head = filtered.head;
        anchor = filtered.anchor;
      }
  
      var sel = doc.sel;
      sel.goalColumn = null;
      if (bias == null) bias = posLess(head, sel.head) ? -1 : 1;
      // Skip over atomic spans.
      if (checkAtomic || !posEq(anchor, sel.anchor))
        anchor = skipAtomic(doc, anchor, bias, checkAtomic != "push");
      if (checkAtomic || !posEq(head, sel.head))
        head = skipAtomic(doc, head, bias, checkAtomic != "push");
  
      if (posEq(sel.anchor, anchor) && posEq(sel.head, head)) return;
  
      sel.anchor = anchor; sel.head = head;
      var inv = posLess(head, anchor);
      sel.from = inv ? head : anchor;
      sel.to = inv ? anchor : head;
  
      if (doc.cm)
        doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged =
          doc.cm.curOp.cursorActivity = true;
  
      signalLater(doc, "cursorActivity", doc);
    }
  
    function reCheckSelection(cm) {
      setSelection(cm.doc, cm.doc.sel.from, cm.doc.sel.to, null, "push");
    }
  
    function skipAtomic(doc, pos, bias, mayClear) {
      var flipped = false, curPos = pos;
      var dir = bias || 1;
      doc.cantEdit = false;
      search: for (;;) {
        var line = getLine(doc, curPos.line);
        if (line.markedSpans) {
          for (var i = 0; i < line.markedSpans.length; ++i) {
            var sp = line.markedSpans[i], m = sp.marker;
            if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&
                (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
              if (mayClear) {
                signal(m, "beforeCursorEnter");
                if (m.explicitlyCleared) {
                  if (!line.markedSpans) break;
                  else {--i; continue;}
                }
              }
              if (!m.atomic) continue;
              var newPos = m.find()[dir < 0 ? "from" : "to"];
              if (posEq(newPos, curPos)) {
                newPos.ch += dir;
                if (newPos.ch < 0) {
                  if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));
                  else newPos = null;
                } else if (newPos.ch > line.text.length) {
                  if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);
                  else newPos = null;
                }
                if (!newPos) {
                  if (flipped) {
                    // Driven in a corner -- no valid cursor position found at all
                    // -- try again *with* clearing, if we didn't already
                    if (!mayClear) return skipAtomic(doc, pos, bias, true);
                    // Otherwise, turn off editing until further notice, and return the start of the doc
                    doc.cantEdit = true;
                    return Pos(doc.first, 0);
                  }
                  flipped = true; newPos = pos; dir = -dir;
                }
              }
              curPos = newPos;
              continue search;
            }
          }
        }
        return curPos;
      }
    }
  
    // SCROLLING
  
    function scrollCursorIntoView(cm) {
      var coords = scrollPosIntoView(cm, cm.doc.sel.head, null, cm.options.cursorScrollMargin);
      if (!cm.state.focused) return;
      var display = cm.display, box = getRect(display.sizer), doScroll = null;
      if (coords.top + box.top < 0) doScroll = true;
      else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
      if (doScroll != null && !phantom) {
        var hidden = display.cursor.style.display == "none";
        if (hidden) {
          display.cursor.style.display = "";
          display.cursor.style.left = coords.left + "px";
          display.cursor.style.top = (coords.top - display.viewOffset) + "px";
        }
        display.cursor.scrollIntoView(doScroll);
        if (hidden) display.cursor.style.display = "none";
      }
    }
  
    function scrollPosIntoView(cm, pos, end, margin) {
      if (margin == null) margin = 0;
      for (;;) {
        var changed = false, coords = cursorCoords(cm, pos);
        var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
        var scrollPos = calculateScrollPos(cm, Math.min(coords.left, endCoords.left),
                                           Math.min(coords.top, endCoords.top) - margin,
                                           Math.max(coords.left, endCoords.left),
                                           Math.max(coords.bottom, endCoords.bottom) + margin);
        var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
        if (scrollPos.scrollTop != null) {
          setScrollTop(cm, scrollPos.scrollTop);
          if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
        }
        if (scrollPos.scrollLeft != null) {
          setScrollLeft(cm, scrollPos.scrollLeft);
          if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
        }
        if (!changed) return coords;
      }
    }
  
    function scrollIntoView(cm, x1, y1, x2, y2) {
      var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
      if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
      if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
    }
  
    function calculateScrollPos(cm, x1, y1, x2, y2) {
      var display = cm.display, snapMargin = textHeight(cm.display);
      if (y1 < 0) y1 = 0;
      var screen = display.scroller.clientHeight - scrollerCutOff, screentop = display.scroller.scrollTop, result = {};
      var docBottom = cm.doc.height + paddingVert(display);
      var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
      if (y1 < screentop) {
        result.scrollTop = atTop ? 0 : y1;
      } else if (y2 > screentop + screen) {
        var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
        if (newTop != screentop) result.scrollTop = newTop;
      }
  
      var screenw = display.scroller.clientWidth - scrollerCutOff, screenleft = display.scroller.scrollLeft;
      x1 += display.gutters.offsetWidth; x2 += display.gutters.offsetWidth;
      var gutterw = display.gutters.offsetWidth;
      var atLeft = x1 < gutterw + 10;
      if (x1 < screenleft + gutterw || atLeft) {
        if (atLeft) x1 = 0;
        result.scrollLeft = Math.max(0, x1 - 10 - gutterw);
      } else if (x2 > screenw + screenleft - 3) {
        result.scrollLeft = x2 + 10 - screenw;
      }
      return result;
    }
  
    function updateScrollPos(cm, left, top) {
      cm.curOp.updateScrollPos = {scrollLeft: left == null ? cm.doc.scrollLeft : left,
                                  scrollTop: top == null ? cm.doc.scrollTop : top};
    }
  
    function addToScrollPos(cm, left, top) {
      var pos = cm.curOp.updateScrollPos || (cm.curOp.updateScrollPos = {scrollLeft: cm.doc.scrollLeft, scrollTop: cm.doc.scrollTop});
      var scroll = cm.display.scroller;
      pos.scrollTop = Math.max(0, Math.min(scroll.scrollHeight - scroll.clientHeight, pos.scrollTop + top));
      pos.scrollLeft = Math.max(0, Math.min(scroll.scrollWidth - scroll.clientWidth, pos.scrollLeft + left));
    }
  
    // API UTILITIES
  
    function indentLine(cm, n, how, aggressive) {
      var doc = cm.doc;
      if (how == null) how = "add";
      if (how == "smart") {
        if (!cm.doc.mode.indent) how = "prev";
        else var state = getStateBefore(cm, n);
      }
  
      var tabSize = cm.options.tabSize;
      var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
      var curSpaceString = line.text.match(/^\s*/)[0], indentation;
      if (how == "smart") {
        indentation = cm.doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
        if (indentation == Pass) {
          if (!aggressive) return;
          how = "prev";
        }
      }
      if (how == "prev") {
        if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
        else indentation = 0;
      } else if (how == "add") {
        indentation = curSpace + cm.options.indentUnit;
      } else if (how == "subtract") {
        indentation = curSpace - cm.options.indentUnit;
      } else if (typeof how == "number") {
        indentation = curSpace + how;
      }
      indentation = Math.max(0, indentation);
  
      var indentString = "", pos = 0;
      if (cm.options.indentWithTabs)
        for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
      if (pos < indentation) indentString += spaceStr(indentation - pos);
  
      if (indentString != curSpaceString)
        replaceRange(cm.doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
      else if (doc.sel.head.line == n && doc.sel.head.ch < curSpaceString.length)
        setSelection(doc, Pos(n, curSpaceString.length), Pos(n, curSpaceString.length), 1);
      line.stateAfter = null;
    }
  
    function changeLine(cm, handle, op) {
      var no = handle, line = handle, doc = cm.doc;
      if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
      else no = lineNo(handle);
      if (no == null) return null;
      if (op(line, no)) regChange(cm, no, no + 1);
      else return null;
      return line;
    }
  
    function findPosH(doc, pos, dir, unit, visually) {
      var line = pos.line, ch = pos.ch, origDir = dir;
      var lineObj = getLine(doc, line);
      var possible = true;
      function findNextLine() {
        var l = line + dir;
        if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
        line = l;
        return lineObj = getLine(doc, l);
      }
      function moveOnce(boundToLine) {
        var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
        if (next == null) {
          if (!boundToLine && findNextLine()) {
            if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
            else ch = dir < 0 ? lineObj.text.length : 0;
          } else return (possible = false);
        } else ch = next;
        return true;
      }
  
      if (unit == "char") moveOnce();
      else if (unit == "column") moveOnce(true);
      else if (unit == "word" || unit == "group") {
        var sawType = null, group = unit == "group";
        for (var first = true;; first = false) {
          if (dir < 0 && !moveOnce(!first)) break;
          var cur = lineObj.text.charAt(ch) || "\n";
          var type = isWordChar(cur) ? "w"
            : !group ? null
            : /\s/.test(cur) ? null
            : "p";
          if (sawType && sawType != type) {
            if (dir < 0) {dir = 1; moveOnce();}
            break;
          }
          if (type) sawType = type;
          if (dir > 0 && !moveOnce(!first)) break;
        }
      }
      var result = skipAtomic(doc, Pos(line, ch), origDir, true);
      if (!possible) result.hitSide = true;
      return result;
    }
  
    function findPosV(cm, pos, dir, unit) {
      var doc = cm.doc, x = pos.left, y;
      if (unit == "page") {
        var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
        y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
      } else if (unit == "line") {
        y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
      }
      for (;;) {
        var target = coordsChar(cm, x, y);
        if (!target.outside) break;
        if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
        y += dir * 5;
      }
      return target;
    }
  
    function findWordAt(line, pos) {
      var start = pos.ch, end = pos.ch;
      if (line) {
        if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
        var startChar = line.charAt(start);
        var check = isWordChar(startChar) ? isWordChar
          : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
          : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
        while (start > 0 && check(line.charAt(start - 1))) --start;
        while (end < line.length && check(line.charAt(end))) ++end;
      }
      return {from: Pos(pos.line, start), to: Pos(pos.line, end)};
    }
  
    function selectLine(cm, line) {
      extendSelection(cm.doc, Pos(line, 0), clipPos(cm.doc, Pos(line + 1, 0)));
    }
  
    // PROTOTYPE
  
    // The publicly visible API. Note that operation(null, f) means
    // 'wrap f in an operation, performed on its `this` parameter'
  
    CodeMirror.prototype = {
      constructor: CodeMirror,
      focus: function(){window.focus(); focusInput(this); fastPoll(this);},
  
      setOption: function(option, value) {
        var options = this.options, old = options[option];
        if (options[option] == value && option != "mode") return;
        options[option] = value;
        if (optionHandlers.hasOwnProperty(option))
          operation(this, optionHandlers[option])(this, value, old);
      },
  
      getOption: function(option) {return this.options[option];},
      getDoc: function() {return this.doc;},
  
      addKeyMap: function(map, bottom) {
        this.state.keyMaps[bottom ? "push" : "unshift"](map);
      },
      removeKeyMap: function(map) {
        var maps = this.state.keyMaps;
        for (var i = 0; i < maps.length; ++i)
          if (maps[i] == map || (typeof maps[i] != "string" && maps[i].name == map)) {
            maps.splice(i, 1);
            return true;
          }
      },
  
      addOverlay: operation(null, function(spec, options) {
        var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
        if (mode.startState) throw new Error("Overlays may not be stateful.");
        this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
        this.state.modeGen++;
        regChange(this);
      }),
      removeOverlay: operation(null, function(spec) {
        var overlays = this.state.overlays;
        for (var i = 0; i < overlays.length; ++i) {
          var cur = overlays[i].modeSpec;
          if (cur == spec || typeof spec == "string" && cur.name == spec) {
            overlays.splice(i, 1);
            this.state.modeGen++;
            regChange(this);
            return;
          }
        }
      }),
  
      indentLine: operation(null, function(n, dir, aggressive) {
        if (typeof dir != "string" && typeof dir != "number") {
          if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
          else dir = dir ? "add" : "subtract";
        }
        if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
      }),
      indentSelection: operation(null, function(how) {
        var sel = this.doc.sel;
        if (posEq(sel.from, sel.to)) return indentLine(this, sel.from.line, how);
        var e = sel.to.line - (sel.to.ch ? 0 : 1);
        for (var i = sel.from.line; i <= e; ++i) indentLine(this, i, how);
      }),
  
      // Fetch the parser token for a given character. Useful for hacks
      // that want to inspect the mode state (say, for completion).
      getTokenAt: function(pos, precise) {
        var doc = this.doc;
        pos = clipPos(doc, pos);
        var state = getStateBefore(this, pos.line, precise), mode = this.doc.mode;
        var line = getLine(doc, pos.line);
        var stream = new StringStream(line.text, this.options.tabSize);
        while (stream.pos < pos.ch && !stream.eol()) {
          stream.start = stream.pos;
          var style = mode.token(stream, state);
        }
        return {start: stream.start,
                end: stream.pos,
                string: stream.current(),
                className: style || null, // Deprecated, use 'type' instead
                type: style || null,
                state: state};
      },
  
      getTokenTypeAt: function(pos) {
        pos = clipPos(this.doc, pos);
        var styles = getLineStyles(this, getLine(this.doc, pos.line));
        var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
        if (ch == 0) return styles[2];
        for (;;) {
          var mid = (before + after) >> 1;
          if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
          else if (styles[mid * 2 + 1] < ch) before = mid + 1;
          else return styles[mid * 2 + 2];
        }
      },
  
      getModeAt: function(pos) {
        var mode = this.doc.mode;
        if (!mode.innerMode) return mode;
        return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
      },
  
      getHelper: function(pos, type) {
        if (!helpers.hasOwnProperty(type)) return;
        var help = helpers[type], mode = this.getModeAt(pos);
        return mode[type] && help[mode[type]] ||
          mode.helperType && help[mode.helperType] ||
          help[mode.name];
      },
  
      getStateAfter: function(line, precise) {
        var doc = this.doc;
        line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
        return getStateBefore(this, line + 1, precise);
      },
  
      cursorCoords: function(start, mode) {
        var pos, sel = this.doc.sel;
        if (start == null) pos = sel.head;
        else if (typeof start == "object") pos = clipPos(this.doc, start);
        else pos = start ? sel.from : sel.to;
        return cursorCoords(this, pos, mode || "page");
      },
  
      charCoords: function(pos, mode) {
        return charCoords(this, clipPos(this.doc, pos), mode || "page");
      },
  
      coordsChar: function(coords, mode) {
        coords = fromCoordSystem(this, coords, mode || "page");
        return coordsChar(this, coords.left, coords.top);
      },
  
      lineAtHeight: function(height, mode) {
        height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
        return lineAtHeight(this.doc, height + this.display.viewOffset);
      },
      heightAtLine: function(line, mode) {
        var end = false, last = this.doc.first + this.doc.size - 1;
        if (line < this.doc.first) line = this.doc.first;
        else if (line > last) { line = last; end = true; }
        var lineObj = getLine(this.doc, line);
        return intoCoordSystem(this, getLine(this.doc, line), {top: 0, left: 0}, mode || "page").top +
          (end ? lineObj.height : 0);
      },
  
      defaultTextHeight: function() { return textHeight(this.display); },
      defaultCharWidth: function() { return charWidth(this.display); },
  
      setGutterMarker: operation(null, function(line, gutterID, value) {
        return changeLine(this, line, function(line) {
          var markers = line.gutterMarkers || (line.gutterMarkers = {});
          markers[gutterID] = value;
          if (!value && isEmpty(markers)) line.gutterMarkers = null;
          return true;
        });
      }),
  
      clearGutter: operation(null, function(gutterID) {
        var cm = this, doc = cm.doc, i = doc.first;
        doc.iter(function(line) {
          if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
            line.gutterMarkers[gutterID] = null;
            regChange(cm, i, i + 1);
            if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
          }
          ++i;
        });
      }),
  
      addLineClass: operation(null, function(handle, where, cls) {
        return changeLine(this, handle, function(line) {
          var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
          if (!line[prop]) line[prop] = cls;
          else if (new RegExp("(?:^|\\s)" + cls + "(?:$|\\s)").test(line[prop])) return false;
          else line[prop] += " " + cls;
          return true;
        });
      }),
  
      removeLineClass: operation(null, function(handle, where, cls) {
        return changeLine(this, handle, function(line) {
          var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
          var cur = line[prop];
          if (!cur) return false;
          else if (cls == null) line[prop] = null;
          else {
            var found = cur.match(new RegExp("(?:^|\\s+)" + cls + "(?:$|\\s+)"));
            if (!found) return false;
            var end = found.index + found[0].length;
            line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
          }
          return true;
        });
      }),
  
      addLineWidget: operation(null, function(handle, node, options) {
        return addLineWidget(this, handle, node, options);
      }),
  
      removeLineWidget: function(widget) { widget.clear(); },
  
      lineInfo: function(line) {
        if (typeof line == "number") {
          if (!isLine(this.doc, line)) return null;
          var n = line;
          line = getLine(this.doc, line);
          if (!line) return null;
        } else {
          var n = lineNo(line);
          if (n == null) return null;
        }
        return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
                textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
                widgets: line.widgets};
      },
  
      getViewport: function() { return {from: this.display.showingFrom, to: this.display.showingTo};},
  
      addWidget: function(pos, node, scroll, vert, horiz) {
        var display = this.display;
        pos = cursorCoords(this, clipPos(this.doc, pos));
        var top = pos.bottom, left = pos.left;
        node.style.position = "absolute";
        display.sizer.appendChild(node);
        if (vert == "over") {
          top = pos.top;
        } else if (vert == "above" || vert == "near") {
          var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
          hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
          // Default to positioning above (if specified and possible); otherwise default to positioning below
          if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
            top = pos.top - node.offsetHeight;
          else if (pos.bottom + node.offsetHeight <= vspace)
            top = pos.bottom;
          if (left + node.offsetWidth > hspace)
            left = hspace - node.offsetWidth;
        }
        node.style.top = top + "px";
        node.style.left = node.style.right = "";
        if (horiz == "right") {
          left = display.sizer.clientWidth - node.offsetWidth;
          node.style.right = "0px";
        } else {
          if (horiz == "left") left = 0;
          else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
          node.style.left = left + "px";
        }
        if (scroll)
          scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
      },
  
      triggerOnKeyDown: operation(null, onKeyDown),
  
      execCommand: function(cmd) {return commands[cmd](this);},
  
      findPosH: function(from, amount, unit, visually) {
        var dir = 1;
        if (amount < 0) { dir = -1; amount = -amount; }
        for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
          cur = findPosH(this.doc, cur, dir, unit, visually);
          if (cur.hitSide) break;
        }
        return cur;
      },
  
      moveH: operation(null, function(dir, unit) {
        var sel = this.doc.sel, pos;
        if (sel.shift || sel.extend || posEq(sel.from, sel.to))
          pos = findPosH(this.doc, sel.head, dir, unit, this.options.rtlMoveVisually);
        else
          pos = dir < 0 ? sel.from : sel.to;
        extendSelection(this.doc, pos, pos, dir);
      }),
  
      deleteH: operation(null, function(dir, unit) {
        var sel = this.doc.sel;
        if (!posEq(sel.from, sel.to)) replaceRange(this.doc, "", sel.from, sel.to, "+delete");
        else replaceRange(this.doc, "", sel.from, findPosH(this.doc, sel.head, dir, unit, false), "+delete");
        this.curOp.userSelChange = true;
      }),
  
      findPosV: function(from, amount, unit, goalColumn) {
        var dir = 1, x = goalColumn;
        if (amount < 0) { dir = -1; amount = -amount; }
        for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
          var coords = cursorCoords(this, cur, "div");
          if (x == null) x = coords.left;
          else coords.left = x;
          cur = findPosV(this, coords, dir, unit);
          if (cur.hitSide) break;
        }
        return cur;
      },
  
      moveV: operation(null, function(dir, unit) {
        var sel = this.doc.sel;
        var pos = cursorCoords(this, sel.head, "div");
        if (sel.goalColumn != null) pos.left = sel.goalColumn;
        var target = findPosV(this, pos, dir, unit);
  
        if (unit == "page") addToScrollPos(this, 0, charCoords(this, target, "div").top - pos.top);
        extendSelection(this.doc, target, target, dir);
        sel.goalColumn = pos.left;
      }),
  
      toggleOverwrite: function(value) {
        if (value != null && value == this.state.overwrite) return;
        if (this.state.overwrite = !this.state.overwrite)
          this.display.cursor.className += " CodeMirror-overwrite";
        else
          this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", "");
      },
      hasFocus: function() { return this.state.focused; },
  
      scrollTo: operation(null, function(x, y) {
        updateScrollPos(this, x, y);
      }),
      getScrollInfo: function() {
        var scroller = this.display.scroller, co = scrollerCutOff;
        return {left: scroller.scrollLeft, top: scroller.scrollTop,
                height: scroller.scrollHeight - co, width: scroller.scrollWidth - co,
                clientHeight: scroller.clientHeight - co, clientWidth: scroller.clientWidth - co};
      },
  
      scrollIntoView: operation(null, function(range, margin) {
        if (range == null) range = {from: this.doc.sel.head, to: null};
        else if (typeof range == "number") range = {from: Pos(range, 0), to: null};
        else if (range.from == null) range = {from: range, to: null};
        if (!range.to) range.to = range.from;
        if (!margin) margin = 0;
  
        var coords = range;
        if (range.from.line != null) {
          this.curOp.scrollToPos = {from: range.from, to: range.to, margin: margin};
          coords = {from: cursorCoords(this, range.from),
                    to: cursorCoords(this, range.to)};
        }
        var sPos = calculateScrollPos(this, Math.min(coords.from.left, coords.to.left),
                                      Math.min(coords.from.top, coords.to.top) - margin,
                                      Math.max(coords.from.right, coords.to.right),
                                      Math.max(coords.from.bottom, coords.to.bottom) + margin);
        updateScrollPos(this, sPos.scrollLeft, sPos.scrollTop);
      }),
  
      setSize: operation(null, function(width, height) {
        function interpret(val) {
          return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
        }
        if (width != null) this.display.wrapper.style.width = interpret(width);
        if (height != null) this.display.wrapper.style.height = interpret(height);
        if (this.options.lineWrapping)
          this.display.measureLineCache.length = this.display.measureLineCachePos = 0;
        this.curOp.forceUpdate = true;
      }),
  
      operation: function(f){return runInOp(this, f);},
  
      refresh: operation(null, function() {
        var badHeight = this.display.cachedTextHeight == null;
        clearCaches(this);
        updateScrollPos(this, this.doc.scrollLeft, this.doc.scrollTop);
        regChange(this);
        if (badHeight) estimateLineHeights(this);
      }),
  
      swapDoc: operation(null, function(doc) {
        var old = this.doc;
        old.cm = null;
        attachDoc(this, doc);
        clearCaches(this);
        resetInput(this, true);
        updateScrollPos(this, doc.scrollLeft, doc.scrollTop);
        signalLater(this, "swapDoc", this, old);
        return old;
      }),
  
      getInputField: function(){return this.display.input;},
      getWrapperElement: function(){return this.display.wrapper;},
      getScrollerElement: function(){return this.display.scroller;},
      getGutterElement: function(){return this.display.gutters;}
    };
    eventMixin(CodeMirror);
  
    // OPTION DEFAULTS
  
    var optionHandlers = CodeMirror.optionHandlers = {};
  
    // The default configuration options.
    var defaults = CodeMirror.defaults = {};
  
    function option(name, deflt, handle, notOnInit) {
      CodeMirror.defaults[name] = deflt;
      if (handle) optionHandlers[name] =
        notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
    }
  
    var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};
  
    // These two are, on init, called from the constructor because they
    // have to be initialized before the editor can start at all.
    option("value", "", function(cm, val) {
      cm.setValue(val);
    }, true);
    option("mode", null, function(cm, val) {
      cm.doc.modeOption = val;
      loadMode(cm);
    }, true);
  
    option("indentUnit", 2, loadMode, true);
    option("indentWithTabs", false);
    option("smartIndent", true);
    option("tabSize", 4, function(cm) {
      loadMode(cm);
      clearCaches(cm);
      regChange(cm);
    }, true);
    option("specialChars", /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/g, function(cm, val) {
      cm.options.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
      cm.refresh();
    }, true);
    option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {cm.refresh();}, true);
    option("electricChars", true);
    option("rtlMoveVisually", !windows);
    option("wholeLineUpdateBefore", true);
  
    option("theme", "default", function(cm) {
      themeChanged(cm);
      guttersChanged(cm);
    }, true);
    option("keyMap", "default", keyMapChanged);
    option("extraKeys", null);
  
    option("onKeyEvent", null);
    option("onDragEvent", null);
  
    option("lineWrapping", false, wrappingChanged, true);
    option("gutters", [], function(cm) {
      setGuttersForLineNumbers(cm.options);
      guttersChanged(cm);
    }, true);
    option("fixedGutter", true, function(cm, val) {
      cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
      cm.refresh();
    }, true);
    option("coverGutterNextToScrollbar", false, updateScrollbars, true);
    option("lineNumbers", false, function(cm) {
      setGuttersForLineNumbers(cm.options);
      guttersChanged(cm);
    }, true);
    option("firstLineNumber", 1, guttersChanged, true);
    option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
    option("showCursorWhenSelecting", false, updateSelection, true);
  
    option("resetSelectionOnContextMenu", true);
  
    option("readOnly", false, function(cm, val) {
      if (val == "nocursor") {
        onBlur(cm);
        cm.display.input.blur();
        cm.display.disabled = true;
      } else {
        cm.display.disabled = false;
        if (!val) resetInput(cm, true);
      }
    });
    option("dragDrop", true);
  
    option("cursorBlinkRate", 530);
    option("cursorScrollMargin", 0);
    option("cursorHeight", 1);
    option("workTime", 100);
    option("workDelay", 100);
    option("flattenSpans", true);
    option("pollInterval", 100);
    option("undoDepth", 40, function(cm, val){cm.doc.history.undoDepth = val;});
    option("historyEventDelay", 500);
    option("viewportMargin", 10, function(cm){cm.refresh();}, true);
    option("maxHighlightLength", 10000, function(cm){loadMode(cm); cm.refresh();}, true);
    option("crudeMeasuringFrom", 10000);
    option("moveInputWithCursor", true, function(cm, val) {
      if (!val) cm.display.inputDiv.style.top = cm.display.inputDiv.style.left = 0;
    });
  
    option("tabindex", null, function(cm, val) {
      cm.display.input.tabIndex = val || "";
    });
    option("autofocus", null);
  
    // MODE DEFINITION AND QUERYING
  
    // Known modes, by name and by MIME
    var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};
  
    CodeMirror.defineMode = function(name, mode) {
      if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
      if (arguments.length > 2) {
        mode.dependencies = [];
        for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i]);
      }
      modes[name] = mode;
    };
  
    CodeMirror.defineMIME = function(mime, spec) {
      mimeModes[mime] = spec;
    };
  
    CodeMirror.resolveMode = function(spec) {
      if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
        spec = mimeModes[spec];
      } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
        var found = mimeModes[spec.name];
        spec = createObj(found, spec);
        spec.name = found.name;
      } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
        return CodeMirror.resolveMode("application/xml");
      }
      if (typeof spec == "string") return {name: spec};
      else return spec || {name: "null"};
    };
  
    CodeMirror.getMode = function(options, spec) {
      var spec = CodeMirror.resolveMode(spec);
      var mfactory = modes[spec.name];
      if (!mfactory) return CodeMirror.getMode(options, "text/plain");
      var modeObj = mfactory(options, spec);
      if (modeExtensions.hasOwnProperty(spec.name)) {
        var exts = modeExtensions[spec.name];
        for (var prop in exts) {
          if (!exts.hasOwnProperty(prop)) continue;
          if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
          modeObj[prop] = exts[prop];
        }
      }
      modeObj.name = spec.name;
  
      return modeObj;
    };
  
    CodeMirror.defineMode("null", function() {
      return {token: function(stream) {stream.skipToEnd();}};
    });
    CodeMirror.defineMIME("text/plain", "null");
  
    var modeExtensions = CodeMirror.modeExtensions = {};
    CodeMirror.extendMode = function(mode, properties) {
      var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
      copyObj(properties, exts);
    };
  
    // EXTENSIONS
  
    CodeMirror.defineExtension = function(name, func) {
      CodeMirror.prototype[name] = func;
    };
    CodeMirror.defineDocExtension = function(name, func) {
      Doc.prototype[name] = func;
    };
    CodeMirror.defineOption = option;
  
    var initHooks = [];
    CodeMirror.defineInitHook = function(f) {initHooks.push(f);};
  
    var helpers = CodeMirror.helpers = {};
    CodeMirror.registerHelper = function(type, name, value) {
      if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {};
      helpers[type][name] = value;
    };
  
    // UTILITIES
  
    CodeMirror.isWordChar = isWordChar;
  
    // MODE STATE HANDLING
  
    // Utility functions for working with state. Exported because modes
    // sometimes need to do this.
    function copyState(mode, state) {
      if (state === true) return state;
      if (mode.copyState) return mode.copyState(state);
      var nstate = {};
      for (var n in state) {
        var val = state[n];
        if (val instanceof Array) val = val.concat([]);
        nstate[n] = val;
      }
      return nstate;
    }
    CodeMirror.copyState = copyState;
  
    function startState(mode, a1, a2) {
      return mode.startState ? mode.startState(a1, a2) : true;
    }
    CodeMirror.startState = startState;
  
    CodeMirror.innerMode = function(mode, state) {
      while (mode.innerMode) {
        var info = mode.innerMode(state);
        if (!info || info.mode == mode) break;
        state = info.state;
        mode = info.mode;
      }
      return info || {mode: mode, state: state};
    };
  
    // STANDARD COMMANDS
  
    var commands = CodeMirror.commands = {
      selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()));},
      killLine: function(cm) {
        var from = cm.getCursor(true), to = cm.getCursor(false), sel = !posEq(from, to);
        if (!sel && cm.getLine(from.line).length == from.ch)
          cm.replaceRange("", from, Pos(from.line + 1, 0), "+delete");
        else cm.replaceRange("", from, sel ? to : Pos(from.line), "+delete");
      },
      deleteLine: function(cm) {
        var l = cm.getCursor().line;
        cm.replaceRange("", Pos(l, 0), Pos(l), "+delete");
      },
      delLineLeft: function(cm) {
        var cur = cm.getCursor();
        cm.replaceRange("", Pos(cur.line, 0), cur, "+delete");
      },
      undo: function(cm) {cm.undo();},
      redo: function(cm) {cm.redo();},
      goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
      goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
      goLineStart: function(cm) {
        cm.extendSelection(lineStart(cm, cm.getCursor().line));
      },
      goLineStartSmart: function(cm) {
        var cur = cm.getCursor(), start = lineStart(cm, cur.line);
        var line = cm.getLineHandle(start.line);
        var order = getOrder(line);
        if (!order || order[0].level == 0) {
          var firstNonWS = Math.max(0, line.text.search(/\S/));
          var inWS = cur.line == start.line && cur.ch <= firstNonWS && cur.ch;
          cm.extendSelection(Pos(start.line, inWS ? 0 : firstNonWS));
        } else cm.extendSelection(start);
      },
      goLineEnd: function(cm) {
        cm.extendSelection(lineEnd(cm, cm.getCursor().line));
      },
      goLineRight: function(cm) {
        var top = cm.charCoords(cm.getCursor(), "div").top + 5;
        cm.extendSelection(cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div"));
      },
      goLineLeft: function(cm) {
        var top = cm.charCoords(cm.getCursor(), "div").top + 5;
        cm.extendSelection(cm.coordsChar({left: 0, top: top}, "div"));
      },
      goLineUp: function(cm) {cm.moveV(-1, "line");},
      goLineDown: function(cm) {cm.moveV(1, "line");},
      goPageUp: function(cm) {cm.moveV(-1, "page");},
      goPageDown: function(cm) {cm.moveV(1, "page");},
      goCharLeft: function(cm) {cm.moveH(-1, "char");},
      goCharRight: function(cm) {cm.moveH(1, "char");},
      goColumnLeft: function(cm) {cm.moveH(-1, "column");},
      goColumnRight: function(cm) {cm.moveH(1, "column");},
      goWordLeft: function(cm) {cm.moveH(-1, "word");},
      goGroupRight: function(cm) {cm.moveH(1, "group");},
      goGroupLeft: function(cm) {cm.moveH(-1, "group");},
      goWordRight: function(cm) {cm.moveH(1, "word");},
      delCharBefore: function(cm) {cm.deleteH(-1, "char");},
      delCharAfter: function(cm) {cm.deleteH(1, "char");},
      delWordBefore: function(cm) {cm.deleteH(-1, "word");},
      delWordAfter: function(cm) {cm.deleteH(1, "word");},
      delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
      delGroupAfter: function(cm) {cm.deleteH(1, "group");},
      indentAuto: function(cm) {cm.indentSelection("smart");},
      indentMore: function(cm) {cm.indentSelection("add");},
      indentLess: function(cm) {cm.indentSelection("subtract");},
      insertTab: function(cm) {cm.replaceSelection("\t", "end", "+input");},
      defaultTab: function(cm) {
        if (cm.somethingSelected()) cm.indentSelection("add");
        else cm.replaceSelection("\t", "end", "+input");
      },
      transposeChars: function(cm) {
        var cur = cm.getCursor(), line = cm.getLine(cur.line);
        if (cur.ch > 0 && cur.ch < line.length - 1)
          cm.replaceRange(line.charAt(cur.ch) + line.charAt(cur.ch - 1),
                          Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1));
      },
      newlineAndIndent: function(cm) {
        operation(cm, function() {
          cm.replaceSelection("\n", "end", "+input");
          cm.indentLine(cm.getCursor().line, null, true);
        })();
      },
      toggleOverwrite: function(cm) {cm.toggleOverwrite();}
    };
  
    // STANDARD KEYMAPS
  
    var keyMap = CodeMirror.keyMap = {};
    keyMap.basic = {
      "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
      "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
      "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
      "Tab": "defaultTab", "Shift-Tab": "indentAuto",
      "Enter": "newlineAndIndent", "Insert": "toggleOverwrite"
    };
    // Note that the save and find-related commands aren't defined by
    // default. Unknown commands are simply ignored.
    keyMap.pcDefault = {
      "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
      "Ctrl-Home": "goDocStart", "Alt-Up": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Down": "goDocEnd",
      "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
      "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
      "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
      "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
      fallthrough: "basic"
    };
    keyMap.macDefault = {
      "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
      "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
      "Alt-Right": "goGroupRight", "Cmd-Left": "goLineStart", "Cmd-Right": "goLineEnd", "Alt-Backspace": "delGroupBefore",
      "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
      "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
      "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delLineLeft",
      fallthrough: ["basic", "emacsy"]
    };
    keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
    keyMap.emacsy = {
      "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
      "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
      "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
      "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
    };
  
    // KEYMAP DISPATCH
  
    function getKeyMap(val) {
      if (typeof val == "string") return keyMap[val];
      else return val;
    }
  
    function lookupKey(name, maps, handle) {
      function lookup(map) {
        map = getKeyMap(map);
        var found = map[name];
        if (found === false) return "stop";
        if (found != null && handle(found)) return true;
        if (map.nofallthrough) return "stop";
  
        var fallthrough = map.fallthrough;
        if (fallthrough == null) return false;
        if (Object.prototype.toString.call(fallthrough) != "[object Array]")
          return lookup(fallthrough);
        for (var i = 0, e = fallthrough.length; i < e; ++i) {
          var done = lookup(fallthrough[i]);
          if (done) return done;
        }
        return false;
      }
  
      for (var i = 0; i < maps.length; ++i) {
        var done = lookup(maps[i]);
        if (done) return done != "stop";
      }
    }
    function isModifierKey(event) {
      var name = keyNames[event.keyCode];
      return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
    }
    function keyName(event, noShift) {
      if (opera && event.keyCode == 34 && event["char"]) return false;
      var name = keyNames[event.keyCode];
      if (name == null || event.altGraphKey) return false;
      if (event.altKey) name = "Alt-" + name;
      if (flipCtrlCmd ? event.metaKey : event.ctrlKey) name = "Ctrl-" + name;
      if (flipCtrlCmd ? event.ctrlKey : event.metaKey) name = "Cmd-" + name;
      if (!noShift && event.shiftKey) name = "Shift-" + name;
      return name;
    }
    CodeMirror.lookupKey = lookupKey;
    CodeMirror.isModifierKey = isModifierKey;
    CodeMirror.keyName = keyName;
  
    // FROMTEXTAREA
  
    CodeMirror.fromTextArea = function(textarea, options) {
      if (!options) options = {};
      options.value = textarea.value;
      if (!options.tabindex && textarea.tabindex)
        options.tabindex = textarea.tabindex;
      if (!options.placeholder && textarea.placeholder)
        options.placeholder = textarea.placeholder;
      // Set autofocus to true if this textarea is focused, or if it has
      // autofocus and no other element is focused.
      if (options.autofocus == null) {
        var hasFocus = document.body;
        // doc.activeElement occasionally throws on IE
        try { hasFocus = document.activeElement; } catch(e) {}
        options.autofocus = hasFocus == textarea ||
          textarea.getAttribute("autofocus") != null && hasFocus == document.body;
      }
  
      function save() {textarea.value = cm.getValue();}
      if (textarea.form) {
        on(textarea.form, "submit", save);
        // Deplorable hack to make the submit method do the right thing.
        if (!options.leaveSubmitMethodAlone) {
          var form = textarea.form, realSubmit = form.submit;
          try {
            var wrappedSubmit = form.submit = function() {
              save();
              form.submit = realSubmit;
              form.submit();
              form.submit = wrappedSubmit;
            };
          } catch(e) {}
        }
      }
  
      textarea.style.display = "none";
      var cm = CodeMirror(function(node) {
        textarea.parentNode.insertBefore(node, textarea.nextSibling);
      }, options);
      cm.save = save;
      cm.getTextArea = function() { return textarea; };
      cm.toTextArea = function() {
        save();
        textarea.parentNode.removeChild(cm.getWrapperElement());
        textarea.style.display = "";
        if (textarea.form) {
          off(textarea.form, "submit", save);
          if (typeof textarea.form.submit == "function")
            textarea.form.submit = realSubmit;
        }
      };
      return cm;
    };
  
    // STRING STREAM
  
    // Fed to the mode parsers, provides helper functions to make
    // parsers more succinct.
  
    // The character stream used by a mode's parser.
    function StringStream(string, tabSize) {
      this.pos = this.start = 0;
      this.string = string;
      this.tabSize = tabSize || 8;
      this.lastColumnPos = this.lastColumnValue = 0;
    }
  
    StringStream.prototype = {
      eol: function() {return this.pos >= this.string.length;},
      sol: function() {return this.pos == 0;},
      peek: function() {return this.string.charAt(this.pos) || undefined;},
      next: function() {
        if (this.pos < this.string.length)
          return this.string.charAt(this.pos++);
      },
      eat: function(match) {
        var ch = this.string.charAt(this.pos);
        if (typeof match == "string") var ok = ch == match;
        else var ok = ch && (match.test ? match.test(ch) : match(ch));
        if (ok) {++this.pos; return ch;}
      },
      eatWhile: function(match) {
        var start = this.pos;
        while (this.eat(match)){}
        return this.pos > start;
      },
      eatSpace: function() {
        var start = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
        return this.pos > start;
      },
      skipToEnd: function() {this.pos = this.string.length;},
      skipTo: function(ch) {
        var found = this.string.indexOf(ch, this.pos);
        if (found > -1) {this.pos = found; return true;}
      },
      backUp: function(n) {this.pos -= n;},
      column: function() {
        if (this.lastColumnPos < this.start) {
          this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
          this.lastColumnPos = this.start;
        }
        return this.lastColumnValue;
      },
      indentation: function() {return countColumn(this.string, null, this.tabSize);},
      match: function(pattern, consume, caseInsensitive) {
        if (typeof pattern == "string") {
          var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
          var substr = this.string.substr(this.pos, pattern.length);
          if (cased(substr) == cased(pattern)) {
            if (consume !== false) this.pos += pattern.length;
            return true;
          }
        } else {
          var match = this.string.slice(this.pos).match(pattern);
          if (match && match.index > 0) return null;
          if (match && consume !== false) this.pos += match[0].length;
          return match;
        }
      },
      current: function(){return this.string.slice(this.start, this.pos);}
    };
    CodeMirror.StringStream = StringStream;
  
    // TEXTMARKERS
  
    function TextMarker(doc, type) {
      this.lines = [];
      this.type = type;
      this.doc = doc;
    }
    CodeMirror.TextMarker = TextMarker;
    eventMixin(TextMarker);
  
    TextMarker.prototype.clear = function() {
      if (this.explicitlyCleared) return;
      var cm = this.doc.cm, withOp = cm && !cm.curOp;
      if (withOp) startOperation(cm);
      if (hasHandler(this, "clear")) {
        var found = this.find();
        if (found) signalLater(this, "clear", found.from, found.to);
      }
      var min = null, max = null;
      for (var i = 0; i < this.lines.length; ++i) {
        var line = this.lines[i];
        var span = getMarkedSpanFor(line.markedSpans, this);
        if (span.to != null) max = lineNo(line);
        line.markedSpans = removeMarkedSpan(line.markedSpans, span);
        if (span.from != null)
          min = lineNo(line);
        else if (this.collapsed && !lineIsHidden(this.doc, line) && cm)
          updateLineHeight(line, textHeight(cm.display));
      }
      if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
        var visual = visualLine(cm.doc, this.lines[i]), len = lineLength(cm.doc, visual);
        if (len > cm.display.maxLineLength) {
          cm.display.maxLine = visual;
          cm.display.maxLineLength = len;
          cm.display.maxLineChanged = true;
        }
      }
  
      if (min != null && cm) regChange(cm, min, max + 1);
      this.lines.length = 0;
      this.explicitlyCleared = true;
      if (this.atomic && this.doc.cantEdit) {
        this.doc.cantEdit = false;
        if (cm) reCheckSelection(cm);
      }
      if (withOp) endOperation(cm);
    };
  
    TextMarker.prototype.find = function() {
      var from, to;
      for (var i = 0; i < this.lines.length; ++i) {
        var line = this.lines[i];
        var span = getMarkedSpanFor(line.markedSpans, this);
        if (span.from != null || span.to != null) {
          var found = lineNo(line);
          if (span.from != null) from = Pos(found, span.from);
          if (span.to != null) to = Pos(found, span.to);
        }
      }
      if (this.type == "bookmark") return from;
      return from && {from: from, to: to};
    };
  
    TextMarker.prototype.changed = function() {
      var pos = this.find(), cm = this.doc.cm;
      if (!pos || !cm) return;
      if (this.type != "bookmark") pos = pos.from;
      var line = getLine(this.doc, pos.line);
      clearCachedMeasurement(cm, line);
      if (pos.line >= cm.display.showingFrom && pos.line < cm.display.showingTo) {
        for (var node = cm.display.lineDiv.firstChild; node; node = node.nextSibling) if (node.lineObj == line) {
          if (node.offsetHeight != line.height) updateLineHeight(line, node.offsetHeight);
          break;
        }
        runInOp(cm, function() {
          cm.curOp.selectionChanged = cm.curOp.forceUpdate = cm.curOp.updateMaxLine = true;
        });
      }
    };
  
    TextMarker.prototype.attachLine = function(line) {
      if (!this.lines.length && this.doc.cm) {
        var op = this.doc.cm.curOp;
        if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
          (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
      }
      this.lines.push(line);
    };
    TextMarker.prototype.detachLine = function(line) {
      this.lines.splice(indexOf(this.lines, line), 1);
      if (!this.lines.length && this.doc.cm) {
        var op = this.doc.cm.curOp;
        (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
      }
    };
  
    function markText(doc, from, to, options, type) {
      if (options && options.shared) return markTextShared(doc, from, to, options, type);
      if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);
  
      var marker = new TextMarker(doc, type);
      if (posLess(to, from) || posEq(from, to) && type == "range" &&
          !(options.inclusiveLeft && options.inclusiveRight))
        return marker;
      if (options) copyObj(options, marker);
      if (marker.replacedWith) {
        marker.collapsed = true;
        marker.replacedWith = elt("span", [marker.replacedWith], "CodeMirror-widget");
        if (!options.handleMouseEvents) marker.replacedWith.ignoreEvents = true;
      }
      if (marker.collapsed) sawCollapsedSpans = true;
  
      if (marker.addToHistory)
        addToHistory(doc, {from: from, to: to, origin: "markText"},
                     {head: doc.sel.head, anchor: doc.sel.anchor}, NaN);
  
      var curLine = from.line, size = 0, collapsedAtStart, collapsedAtEnd, cm = doc.cm, updateMaxLine;
      doc.iter(curLine, to.line + 1, function(line) {
        if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(doc, line) == cm.display.maxLine)
          updateMaxLine = true;
        var span = {from: null, to: null, marker: marker};
        size += line.text.length;
        if (curLine == from.line) {span.from = from.ch; size -= from.ch;}
        if (curLine == to.line) {span.to = to.ch; size -= line.text.length - to.ch;}
        if (marker.collapsed) {
          if (curLine == to.line) collapsedAtEnd = collapsedSpanAt(line, to.ch);
          if (curLine == from.line) collapsedAtStart = collapsedSpanAt(line, from.ch);
          else updateLineHeight(line, 0);
        }
        addMarkedSpan(line, span);
        ++curLine;
      });
      if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
        if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
      });
  
      if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });
  
      if (marker.readOnly) {
        sawReadOnlySpans = true;
        if (doc.history.done.length || doc.history.undone.length)
          doc.clearHistory();
      }
      if (marker.collapsed) {
        if (collapsedAtStart != collapsedAtEnd)
          throw new Error("Inserting collapsed marker overlapping an existing one");
        marker.size = size;
        marker.atomic = true;
      }
      if (cm) {
        if (updateMaxLine) cm.curOp.updateMaxLine = true;
        if (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.collapsed)
          regChange(cm, from.line, to.line + 1);
        if (marker.atomic) reCheckSelection(cm);
      }
      return marker;
    }
  
    // SHARED TEXTMARKERS
  
    function SharedTextMarker(markers, primary) {
      this.markers = markers;
      this.primary = primary;
      for (var i = 0, me = this; i < markers.length; ++i) {
        markers[i].parent = this;
        on(markers[i], "clear", function(){me.clear();});
      }
    }
    CodeMirror.SharedTextMarker = SharedTextMarker;
    eventMixin(SharedTextMarker);
  
    SharedTextMarker.prototype.clear = function() {
      if (this.explicitlyCleared) return;
      this.explicitlyCleared = true;
      for (var i = 0; i < this.markers.length; ++i)
        this.markers[i].clear();
      signalLater(this, "clear");
    };
    SharedTextMarker.prototype.find = function() {
      return this.primary.find();
    };
  
    function markTextShared(doc, from, to, options, type) {
      options = copyObj(options);
      options.shared = false;
      var markers = [markText(doc, from, to, options, type)], primary = markers[0];
      var widget = options.replacedWith;
      linkedDocs(doc, function(doc) {
        if (widget) options.replacedWith = widget.cloneNode(true);
        markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
        for (var i = 0; i < doc.linked.length; ++i)
          if (doc.linked[i].isParent) return;
        primary = lst(markers);
      });
      return new SharedTextMarker(markers, primary);
    }
  
    // TEXTMARKER SPANS
  
    function getMarkedSpanFor(spans, marker) {
      if (spans) for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if (span.marker == marker) return span;
      }
    }
    function removeMarkedSpan(spans, span) {
      for (var r, i = 0; i < spans.length; ++i)
        if (spans[i] != span) (r || (r = [])).push(spans[i]);
      return r;
    }
    function addMarkedSpan(line, span) {
      line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
      span.marker.attachLine(line);
    }
  
    function markedSpansBefore(old, startCh, isInsert) {
      if (old) for (var i = 0, nw; i < old.length; ++i) {
        var span = old[i], marker = span.marker;
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
        if (startsBefore ||
            (marker.inclusiveLeft && marker.inclusiveRight || marker.type == "bookmark") &&
            span.from == startCh && (!isInsert || !span.marker.insertLeft)) {
          var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
          (nw || (nw = [])).push({from: span.from,
                                  to: endsAfter ? null : span.to,
                                  marker: marker});
        }
      }
      return nw;
    }
  
    function markedSpansAfter(old, endCh, isInsert) {
      if (old) for (var i = 0, nw; i < old.length; ++i) {
        var span = old[i], marker = span.marker;
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
        if (endsAfter || marker.type == "bookmark" && span.from == endCh && (!isInsert || span.marker.insertLeft)) {
          var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
          (nw || (nw = [])).push({from: startsBefore ? null : span.from - endCh,
                                  to: span.to == null ? null : span.to - endCh,
                                  marker: marker});
        }
      }
      return nw;
    }
  
    function stretchSpansOverChange(doc, change) {
      var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
      var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
      if (!oldFirst && !oldLast) return null;
  
      var startCh = change.from.ch, endCh = change.to.ch, isInsert = posEq(change.from, change.to);
      // Get the spans that 'stick out' on both sides
      var first = markedSpansBefore(oldFirst, startCh, isInsert);
      var last = markedSpansAfter(oldLast, endCh, isInsert);
  
      // Next, merge those two ends
      var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
      if (first) {
        // Fix up .to properties of first
        for (var i = 0; i < first.length; ++i) {
          var span = first[i];
          if (span.to == null) {
            var found = getMarkedSpanFor(last, span.marker);
            if (!found) span.to = startCh;
            else if (sameLine) span.to = found.to == null ? null : found.to + offset;
          }
        }
      }
      if (last) {
        // Fix up .from in last (or move them into first in case of sameLine)
        for (var i = 0; i < last.length; ++i) {
          var span = last[i];
          if (span.to != null) span.to += offset;
          if (span.from == null) {
            var found = getMarkedSpanFor(first, span.marker);
            if (!found) {
              span.from = offset;
              if (sameLine) (first || (first = [])).push(span);
            }
          } else {
            span.from += offset;
            if (sameLine) (first || (first = [])).push(span);
          }
        }
      }
      if (sameLine && first) {
        // Make sure we didn't create any zero-length spans
        for (var i = 0; i < first.length; ++i)
          if (first[i].from != null && first[i].from == first[i].to && first[i].marker.type != "bookmark")
            first.splice(i--, 1);
        if (!first.length) first = null;
      }
  
      var newMarkers = [first];
      if (!sameLine) {
        // Fill gap with whole-line-spans
        var gap = change.text.length - 2, gapMarkers;
        if (gap > 0 && first)
          for (var i = 0; i < first.length; ++i)
            if (first[i].to == null)
              (gapMarkers || (gapMarkers = [])).push({from: null, to: null, marker: first[i].marker});
        for (var i = 0; i < gap; ++i)
          newMarkers.push(gapMarkers);
        newMarkers.push(last);
      }
      return newMarkers;
    }
  
    function mergeOldSpans(doc, change) {
      var old = getOldSpans(doc, change);
      var stretched = stretchSpansOverChange(doc, change);
      if (!old) return stretched;
      if (!stretched) return old;
  
      for (var i = 0; i < old.length; ++i) {
        var oldCur = old[i], stretchCur = stretched[i];
        if (oldCur && stretchCur) {
          spans: for (var j = 0; j < stretchCur.length; ++j) {
            var span = stretchCur[j];
            for (var k = 0; k < oldCur.length; ++k)
              if (oldCur[k].marker == span.marker) continue spans;
            oldCur.push(span);
          }
        } else if (stretchCur) {
          old[i] = stretchCur;
        }
      }
      return old;
    }
  
    function removeReadOnlyRanges(doc, from, to) {
      var markers = null;
      doc.iter(from.line, to.line + 1, function(line) {
        if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
          var mark = line.markedSpans[i].marker;
          if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
            (markers || (markers = [])).push(mark);
        }
      });
      if (!markers) return null;
      var parts = [{from: from, to: to}];
      for (var i = 0; i < markers.length; ++i) {
        var mk = markers[i], m = mk.find();
        for (var j = 0; j < parts.length; ++j) {
          var p = parts[j];
          if (posLess(p.to, m.from) || posLess(m.to, p.from)) continue;
          var newParts = [j, 1];
          if (posLess(p.from, m.from) || !mk.inclusiveLeft && posEq(p.from, m.from))
            newParts.push({from: p.from, to: m.from});
          if (posLess(m.to, p.to) || !mk.inclusiveRight && posEq(p.to, m.to))
            newParts.push({from: m.to, to: p.to});
          parts.splice.apply(parts, newParts);
          j += newParts.length - 1;
        }
      }
      return parts;
    }
  
    function collapsedSpanAt(line, ch) {
      var sps = sawCollapsedSpans && line.markedSpans, found;
      if (sps) for (var sp, i = 0; i < sps.length; ++i) {
        sp = sps[i];
        if (!sp.marker.collapsed) continue;
        if ((sp.from == null || sp.from < ch) &&
            (sp.to == null || sp.to > ch) &&
            (!found || found.width < sp.marker.width))
          found = sp.marker;
      }
      return found;
    }
    function collapsedSpanAtStart(line) { return collapsedSpanAt(line, -1); }
    function collapsedSpanAtEnd(line) { return collapsedSpanAt(line, line.text.length + 1); }
  
    function visualLine(doc, line) {
      var merged;
      while (merged = collapsedSpanAtStart(line))
        line = getLine(doc, merged.find().from.line);
      return line;
    }
  
    function lineIsHidden(doc, line) {
      var sps = sawCollapsedSpans && line.markedSpans;
      if (sps) for (var sp, i = 0; i < sps.length; ++i) {
        sp = sps[i];
        if (!sp.marker.collapsed) continue;
        if (sp.from == null) return true;
        if (sp.marker.replacedWith) continue;
        if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
          return true;
      }
    }
    function lineIsHiddenInner(doc, line, span) {
      if (span.to == null) {
        var end = span.marker.find().to, endLine = getLine(doc, end.line);
        return lineIsHiddenInner(doc, endLine, getMarkedSpanFor(endLine.markedSpans, span.marker));
      }
      if (span.marker.inclusiveRight && span.to == line.text.length)
        return true;
      for (var sp, i = 0; i < line.markedSpans.length; ++i) {
        sp = line.markedSpans[i];
        if (sp.marker.collapsed && !sp.marker.replacedWith && sp.from == span.to &&
            (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
            lineIsHiddenInner(doc, line, sp)) return true;
      }
    }
  
    function detachMarkedSpans(line) {
      var spans = line.markedSpans;
      if (!spans) return;
      for (var i = 0; i < spans.length; ++i)
        spans[i].marker.detachLine(line);
      line.markedSpans = null;
    }
  
    function attachMarkedSpans(line, spans) {
      if (!spans) return;
      for (var i = 0; i < spans.length; ++i)
        spans[i].marker.attachLine(line);
      line.markedSpans = spans;
    }
  
    // LINE WIDGETS
  
    var LineWidget = CodeMirror.LineWidget = function(cm, node, options) {
      if (options) for (var opt in options) if (options.hasOwnProperty(opt))
        this[opt] = options[opt];
      this.cm = cm;
      this.node = node;
    };
    eventMixin(LineWidget);
    function widgetOperation(f) {
      return function() {
        var withOp = !this.cm.curOp;
        if (withOp) startOperation(this.cm);
        try {var result = f.apply(this, arguments);}
        finally {if (withOp) endOperation(this.cm);}
        return result;
      };
    }
    LineWidget.prototype.clear = widgetOperation(function() {
      var ws = this.line.widgets, no = lineNo(this.line);
      if (no == null || !ws) return;
      for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
      if (!ws.length) this.line.widgets = null;
      var aboveVisible = heightAtLine(this.cm, this.line) < this.cm.doc.scrollTop;
      updateLineHeight(this.line, Math.max(0, this.line.height - widgetHeight(this)));
      if (aboveVisible) addToScrollPos(this.cm, 0, -this.height);
      regChange(this.cm, no, no + 1);
    });
    LineWidget.prototype.changed = widgetOperation(function() {
      var oldH = this.height;
      this.height = null;
      var diff = widgetHeight(this) - oldH;
      if (!diff) return;
      updateLineHeight(this.line, this.line.height + diff);
      var no = lineNo(this.line);
      regChange(this.cm, no, no + 1);
    });
  
    function widgetHeight(widget) {
      if (widget.height != null) return widget.height;
      if (!widget.node.parentNode || widget.node.parentNode.nodeType != 1)
        removeChildrenAndAdd(widget.cm.display.measure, elt("div", [widget.node], null, "position: relative"));
      return widget.height = widget.node.offsetHeight;
    }
  
    function addLineWidget(cm, handle, node, options) {
      var widget = new LineWidget(cm, node, options);
      if (widget.noHScroll) cm.display.alignWidgets = true;
      changeLine(cm, handle, function(line) {
        var widgets = line.widgets || (line.widgets = []);
        if (widget.insertAt == null) widgets.push(widget);
        else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
        widget.line = line;
        if (!lineIsHidden(cm.doc, line) || widget.showIfHidden) {
          var aboveVisible = heightAtLine(cm, line) < cm.doc.scrollTop;
          updateLineHeight(line, line.height + widgetHeight(widget));
          if (aboveVisible) addToScrollPos(cm, 0, widget.height);
        }
        return true;
      });
      return widget;
    }
  
    // LINE DATA STRUCTURE
  
    // Line objects. These hold state related to a line, including
    // highlighting info (the styles array).
    var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
      this.text = text;
      attachMarkedSpans(this, markedSpans);
      this.height = estimateHeight ? estimateHeight(this) : 1;
    };
    eventMixin(Line);
    Line.prototype.lineNo = function() { return lineNo(this); };
  
    function updateLine(line, text, markedSpans, estimateHeight) {
      line.text = text;
      if (line.stateAfter) line.stateAfter = null;
      if (line.styles) line.styles = null;
      if (line.order != null) line.order = null;
      detachMarkedSpans(line);
      attachMarkedSpans(line, markedSpans);
      var estHeight = estimateHeight ? estimateHeight(line) : 1;
      if (estHeight != line.height) updateLineHeight(line, estHeight);
    }
  
    function cleanUpLine(line) {
      line.parent = null;
      detachMarkedSpans(line);
    }
  
    // Run the given mode's parser over a line, update the styles
    // array, which contains alternating fragments of text and CSS
    // classes.
    function runMode(cm, text, mode, state, f, forceToEnd) {
      var flattenSpans = mode.flattenSpans;
      if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
      var curStart = 0, curStyle = null;
      var stream = new StringStream(text, cm.options.tabSize), style;
      if (text == "" && mode.blankLine) mode.blankLine(state);
      while (!stream.eol()) {
        if (stream.pos > cm.options.maxHighlightLength) {
          flattenSpans = false;
          if (forceToEnd) processLine(cm, text, state, stream.pos);
          stream.pos = text.length;
          style = null;
        } else {
          style = mode.token(stream, state);
        }
        if (!flattenSpans || curStyle != style) {
          if (curStart < stream.start) f(stream.start, curStyle);
          curStart = stream.start; curStyle = style;
        }
        stream.start = stream.pos;
      }
      while (curStart < stream.pos) {
        // Webkit seems to refuse to render text nodes longer than 57444 characters
        var pos = Math.min(stream.pos, curStart + 50000);
        f(pos, curStyle);
        curStart = pos;
      }
    }
  
    function highlightLine(cm, line, state, forceToEnd) {
      // A styles array always starts with a number identifying the
      // mode/overlays that it is based on (for easy invalidation).
      var st = [cm.state.modeGen];
      // Compute the base array of styles
      runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
        st.push(end, style);
      }, forceToEnd);
  
      // Run overlays, adjust style array.
      for (var o = 0; o < cm.state.overlays.length; ++o) {
        var overlay = cm.state.overlays[o], i = 1, at = 0;
        runMode(cm, line.text, overlay.mode, true, function(end, style) {
          var start = i;
          // Ensure there's a token end at the current position, and that i points at it
          while (at < end) {
            var i_end = st[i];
            if (i_end > end)
              st.splice(i, 1, end, st[i+1], i_end);
            i += 2;
            at = Math.min(end, i_end);
          }
          if (!style) return;
          if (overlay.opaque) {
            st.splice(start, i - start, end, style);
            i = start + 2;
          } else {
            for (; start < i; start += 2) {
              var cur = st[start+1];
              st[start+1] = cur ? cur + " " + style : style;
            }
          }
        });
      }
  
      return st;
    }
  
    function getLineStyles(cm, line) {
      if (!line.styles || line.styles[0] != cm.state.modeGen)
        line.styles = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));
      return line.styles;
    }
  
    // Lightweight form of highlight -- proceed over this line and
    // update state, but don't save a style array.
    function processLine(cm, text, state, startAt) {
      var mode = cm.doc.mode;
      var stream = new StringStream(text, cm.options.tabSize);
      stream.start = stream.pos = startAt || 0;
      if (text == "" && mode.blankLine) mode.blankLine(state);
      while (!stream.eol() && stream.pos <= cm.options.maxHighlightLength) {
        mode.token(stream, state);
        stream.start = stream.pos;
      }
    }
  
    var styleToClassCache = {};
    function interpretTokenStyle(style, builder) {
      if (!style) return null;
      for (;;) {
        var lineClass = style.match(/(?:^|\s)line-(background-)?(\S+)/);
        if (!lineClass) break;
        style = style.slice(0, lineClass.index) + style.slice(lineClass.index + lineClass[0].length);
        var prop = lineClass[1] ? "bgClass" : "textClass";
        if (builder[prop] == null)
          builder[prop] = lineClass[2];
        else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(builder[prop]))
          builder[prop] += " " + lineClass[2];
      }
      return styleToClassCache[style] ||
        (styleToClassCache[style] = "cm-" + style.replace(/ +/g, " cm-"));
    }
  
    function buildLineContent(cm, realLine, measure, copyWidgets) {
      var merged, line = realLine, empty = true;
      while (merged = collapsedSpanAtStart(line))
        line = getLine(cm.doc, merged.find().from.line);
  
      var builder = {pre: elt("pre"), col: 0, pos: 0,
                     measure: null, measuredSomething: false, cm: cm,
                     copyWidgets: copyWidgets};
  
      do {
        if (line.text) empty = false;
        builder.measure = line == realLine && measure;
        builder.pos = 0;
        builder.addToken = builder.measure ? buildTokenMeasure : buildToken;
        if ((ie || webkit) && cm.getOption("lineWrapping"))
          builder.addToken = buildTokenSplitSpaces(builder.addToken);
        var next = insertLineContent(line, builder, getLineStyles(cm, line));
        if (measure && line == realLine && !builder.measuredSomething) {
          measure[0] = builder.pre.appendChild(zeroWidthElement(cm.display.measure));
          builder.measuredSomething = true;
        }
        if (next) line = getLine(cm.doc, next.to.line);
      } while (next);
  
      if (measure && !builder.measuredSomething && !measure[0])
        measure[0] = builder.pre.appendChild(empty ? elt("span", "\u00a0") : zeroWidthElement(cm.display.measure));
      if (!builder.pre.firstChild && !lineIsHidden(cm.doc, realLine))
        builder.pre.appendChild(document.createTextNode("\u00a0"));
  
      var order;
      // Work around problem with the reported dimensions of single-char
      // direction spans on IE (issue #1129). See also the comment in
      // cursorCoords.
      if (measure && (ie || ie_gt10) && (order = getOrder(line))) {
        var l = order.length - 1;
        if (order[l].from == order[l].to) --l;
        var last = order[l], prev = order[l - 1];
        if (last.from + 1 == last.to && prev && last.level < prev.level) {
          var span = measure[builder.pos - 1];
          if (span) span.parentNode.insertBefore(span.measureRight = zeroWidthElement(cm.display.measure),
                                                 span.nextSibling);
        }
      }
  
      var textClass = builder.textClass ? builder.textClass + " " + (realLine.textClass || "") : realLine.textClass;
      if (textClass) builder.pre.className = textClass;
  
      signal(cm, "renderLine", cm, realLine, builder.pre);
      return builder;
    }
  
    function defaultSpecialCharPlaceholder(ch) {
      var token = elt("span", "\u2022", "cm-invalidchar");
      token.title = "\\u" + ch.charCodeAt(0).toString(16);
      return token;
    }
  
    function buildToken(builder, text, style, startStyle, endStyle, title) {
      if (!text) return;
      var special = builder.cm.options.specialChars;
      if (!special.test(text)) {
        builder.col += text.length;
        var content = document.createTextNode(text);
      } else {
        var content = document.createDocumentFragment(), pos = 0;
        while (true) {
          special.lastIndex = pos;
          var m = special.exec(text);
          var skipped = m ? m.index - pos : text.length - pos;
          if (skipped) {
            content.appendChild(document.createTextNode(text.slice(pos, pos + skipped)));
            builder.col += skipped;
          }
          if (!m) break;
          pos += skipped + 1;
          if (m[0] == "\t") {
            var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
            content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
            builder.col += tabWidth;
          } else {
            var token = builder.cm.options.specialCharPlaceholder(m[0]);
            content.appendChild(token);
            builder.col += 1;
          }
        }
      }
      if (style || startStyle || endStyle || builder.measure) {
        var fullStyle = style || "";
        if (startStyle) fullStyle += startStyle;
        if (endStyle) fullStyle += endStyle;
        var token = elt("span", [content], fullStyle);
        if (title) token.title = title;
        return builder.pre.appendChild(token);
      }
      builder.pre.appendChild(content);
    }
  
    function buildTokenMeasure(builder, text, style, startStyle, endStyle) {
      var wrapping = builder.cm.options.lineWrapping;
      for (var i = 0; i < text.length; ++i) {
        var ch = text.charAt(i), start = i == 0;
        if (ch >= "\ud800" && ch < "\udbff" && i < text.length - 1) {
          ch = text.slice(i, i + 2);
          ++i;
        } else if (i && wrapping && spanAffectsWrapping(text, i)) {
          builder.pre.appendChild(elt("wbr"));
        }
        var old = builder.measure[builder.pos];
        var span = builder.measure[builder.pos] =
          buildToken(builder, ch, style,
                     start && startStyle, i == text.length - 1 && endStyle);
        if (old) span.leftSide = old.leftSide || old;
        // In IE single-space nodes wrap differently than spaces
        // embedded in larger text nodes, except when set to
        // white-space: normal (issue #1268).
        if (ie && wrapping && ch == " " && i && !/\s/.test(text.charAt(i - 1)) &&
            i < text.length - 1 && !/\s/.test(text.charAt(i + 1)))
          span.style.whiteSpace = "normal";
        builder.pos += ch.length;
      }
      if (text.length) builder.measuredSomething = true;
    }
  
    function buildTokenSplitSpaces(inner) {
      function split(old) {
        var out = " ";
        for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : "\u00a0";
        out += " ";
        return out;
      }
      return function(builder, text, style, startStyle, endStyle, title) {
        return inner(builder, text.replace(/ {3,}/g, split), style, startStyle, endStyle, title);
      };
    }
  
    function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
      var widget = !ignoreWidget && marker.replacedWith;
      if (widget) {
        if (builder.copyWidgets) widget = widget.cloneNode(true);
        builder.pre.appendChild(widget);
        if (builder.measure) {
          if (size) {
            builder.measure[builder.pos] = widget;
          } else {
            var elt = zeroWidthElement(builder.cm.display.measure);
            if (marker.type == "bookmark" && !marker.insertLeft)
              builder.measure[builder.pos] = builder.pre.appendChild(elt);
            else if (builder.measure[builder.pos])
              return;
            else
              builder.measure[builder.pos] = builder.pre.insertBefore(elt, widget);
          }
          builder.measuredSomething = true;
        }
      }
      builder.pos += size;
    }
  
    // Outputs a number of spans to make up a line, taking highlighting
    // and marked text into account.
    function insertLineContent(line, builder, styles) {
      var spans = line.markedSpans, allText = line.text, at = 0;
      if (!spans) {
        for (var i = 1; i < styles.length; i+=2)
          builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder));
        return;
      }
  
      var len = allText.length, pos = 0, i = 1, text = "", style;
      var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
      for (;;) {
        if (nextChange == pos) { // Update current marker set
          spanStyle = spanEndStyle = spanStartStyle = title = "";
          collapsed = null; nextChange = Infinity;
          var foundBookmarks = [];
          for (var j = 0; j < spans.length; ++j) {
            var sp = spans[j], m = sp.marker;
            if (sp.from <= pos && (sp.to == null || sp.to > pos)) {
              if (sp.to != null && nextChange > sp.to) { nextChange = sp.to; spanEndStyle = ""; }
              if (m.className) spanStyle += " " + m.className;
              if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
              if (m.endStyle && sp.to == nextChange) spanEndStyle += " " + m.endStyle;
              if (m.title && !title) title = m.title;
              if (m.collapsed && (!collapsed || collapsed.marker.size < m.size))
                collapsed = sp;
            } else if (sp.from > pos && nextChange > sp.from) {
              nextChange = sp.from;
            }
            if (m.type == "bookmark" && sp.from == pos && m.replacedWith) foundBookmarks.push(m);
          }
          if (collapsed && (collapsed.from || 0) == pos) {
            buildCollapsedSpan(builder, (collapsed.to == null ? len : collapsed.to) - pos,
                               collapsed.marker, collapsed.from == null);
            if (collapsed.to == null) return collapsed.marker.find();
          }
          if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
            buildCollapsedSpan(builder, 0, foundBookmarks[j]);
        }
        if (pos >= len) break;
  
        var upto = Math.min(len, nextChange);
        while (true) {
          if (text) {
            var end = pos + text.length;
            if (!collapsed) {
              var tokenText = end > upto ? text.slice(0, upto - pos) : text;
              builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
                               spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title);
            }
            if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
            pos = end;
            spanStartStyle = "";
          }
          text = allText.slice(at, at = styles[i++]);
          style = interpretTokenStyle(styles[i++], builder);
        }
      }
    }
  
    // DOCUMENT DATA STRUCTURE
  
    function updateDoc(doc, change, markedSpans, selAfter, estimateHeight) {
      function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
      function update(line, text, spans) {
        updateLine(line, text, spans, estimateHeight);
        signalLater(line, "change", line, change);
      }
  
      var from = change.from, to = change.to, text = change.text;
      var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
      var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
  
      // First adjust the line structure
      if (from.ch == 0 && to.ch == 0 && lastText == "" &&
          (!doc.cm || doc.cm.options.wholeLineUpdateBefore)) {
        // This is a whole-line replace. Treated specially to make
        // sure line objects move the way they are supposed to.
        for (var i = 0, e = text.length - 1, added = []; i < e; ++i)
          added.push(new Line(text[i], spansFor(i), estimateHeight));
        update(lastLine, lastLine.text, lastSpans);
        if (nlines) doc.remove(from.line, nlines);
        if (added.length) doc.insert(from.line, added);
      } else if (firstLine == lastLine) {
        if (text.length == 1) {
          update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
        } else {
          for (var added = [], i = 1, e = text.length - 1; i < e; ++i)
            added.push(new Line(text[i], spansFor(i), estimateHeight));
          added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
          update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
          doc.insert(from.line + 1, added);
        }
      } else if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
        doc.remove(from.line + 1, nlines);
      } else {
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
        for (var i = 1, e = text.length - 1, added = []; i < e; ++i)
          added.push(new Line(text[i], spansFor(i), estimateHeight));
        if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
        doc.insert(from.line + 1, added);
      }
  
      signalLater(doc, "change", doc, change);
      setSelection(doc, selAfter.anchor, selAfter.head, null, true);
    }
  
    function LeafChunk(lines) {
      this.lines = lines;
      this.parent = null;
      for (var i = 0, e = lines.length, height = 0; i < e; ++i) {
        lines[i].parent = this;
        height += lines[i].height;
      }
      this.height = height;
    }
  
    LeafChunk.prototype = {
      chunkSize: function() { return this.lines.length; },
      removeInner: function(at, n) {
        for (var i = at, e = at + n; i < e; ++i) {
          var line = this.lines[i];
          this.height -= line.height;
          cleanUpLine(line);
          signalLater(line, "delete");
        }
        this.lines.splice(at, n);
      },
      collapse: function(lines) {
        lines.splice.apply(lines, [lines.length, 0].concat(this.lines));
      },
      insertInner: function(at, lines, height) {
        this.height += height;
        this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
        for (var i = 0, e = lines.length; i < e; ++i) lines[i].parent = this;
      },
      iterN: function(at, n, op) {
        for (var e = at + n; at < e; ++at)
          if (op(this.lines[at])) return true;
      }
    };
  
    function BranchChunk(children) {
      this.children = children;
      var size = 0, height = 0;
      for (var i = 0, e = children.length; i < e; ++i) {
        var ch = children[i];
        size += ch.chunkSize(); height += ch.height;
        ch.parent = this;
      }
      this.size = size;
      this.height = height;
      this.parent = null;
    }
  
    BranchChunk.prototype = {
      chunkSize: function() { return this.size; },
      removeInner: function(at, n) {
        this.size -= n;
        for (var i = 0; i < this.children.length; ++i) {
          var child = this.children[i], sz = child.chunkSize();
          if (at < sz) {
            var rm = Math.min(n, sz - at), oldHeight = child.height;
            child.removeInner(at, rm);
            this.height -= oldHeight - child.height;
            if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
            if ((n -= rm) == 0) break;
            at = 0;
          } else at -= sz;
        }
        if (this.size - n < 25) {
          var lines = [];
          this.collapse(lines);
          this.children = [new LeafChunk(lines)];
          this.children[0].parent = this;
        }
      },
      collapse: function(lines) {
        for (var i = 0, e = this.children.length; i < e; ++i) this.children[i].collapse(lines);
      },
      insertInner: function(at, lines, height) {
        this.size += lines.length;
        this.height += height;
        for (var i = 0, e = this.children.length; i < e; ++i) {
          var child = this.children[i], sz = child.chunkSize();
          if (at <= sz) {
            child.insertInner(at, lines, height);
            if (child.lines && child.lines.length > 50) {
              while (child.lines.length > 50) {
                var spilled = child.lines.splice(child.lines.length - 25, 25);
                var newleaf = new LeafChunk(spilled);
                child.height -= newleaf.height;
                this.children.splice(i + 1, 0, newleaf);
                newleaf.parent = this;
              }
              this.maybeSpill();
            }
            break;
          }
          at -= sz;
        }
      },
      maybeSpill: function() {
        if (this.children.length <= 10) return;
        var me = this;
        do {
          var spilled = me.children.splice(me.children.length - 5, 5);
          var sibling = new BranchChunk(spilled);
          if (!me.parent) { // Become the parent node
            var copy = new BranchChunk(me.children);
            copy.parent = me;
            me.children = [copy, sibling];
            me = copy;
          } else {
            me.size -= sibling.size;
            me.height -= sibling.height;
            var myIndex = indexOf(me.parent.children, me);
            me.parent.children.splice(myIndex + 1, 0, sibling);
          }
          sibling.parent = me.parent;
        } while (me.children.length > 10);
        me.parent.maybeSpill();
      },
      iterN: function(at, n, op) {
        for (var i = 0, e = this.children.length; i < e; ++i) {
          var child = this.children[i], sz = child.chunkSize();
          if (at < sz) {
            var used = Math.min(n, sz - at);
            if (child.iterN(at, used, op)) return true;
            if ((n -= used) == 0) break;
            at = 0;
          } else at -= sz;
        }
      }
    };
  
    var nextDocId = 0;
    var Doc = CodeMirror.Doc = function(text, mode, firstLine) {
      if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
      if (firstLine == null) firstLine = 0;
  
      BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
      this.first = firstLine;
      this.scrollTop = this.scrollLeft = 0;
      this.cantEdit = false;
      this.history = makeHistory();
      this.cleanGeneration = 1;
      this.frontier = firstLine;
      var start = Pos(firstLine, 0);
      this.sel = {from: start, to: start, head: start, anchor: start, shift: false, extend: false, goalColumn: null};
      this.id = ++nextDocId;
      this.modeOption = mode;
  
      if (typeof text == "string") text = splitLines(text);
      updateDoc(this, {from: start, to: start, text: text}, null, {head: start, anchor: start});
    };
  
    Doc.prototype = createObj(BranchChunk.prototype, {
      constructor: Doc,
      iter: function(from, to, op) {
        if (op) this.iterN(from - this.first, to - from, op);
        else this.iterN(this.first, this.first + this.size, from);
      },
  
      insert: function(at, lines) {
        var height = 0;
        for (var i = 0, e = lines.length; i < e; ++i) height += lines[i].height;
        this.insertInner(at - this.first, lines, height);
      },
      remove: function(at, n) { this.removeInner(at - this.first, n); },
  
      getValue: function(lineSep) {
        var lines = getLines(this, this.first, this.first + this.size);
        if (lineSep === false) return lines;
        return lines.join(lineSep || "\n");
      },
      setValue: function(code) {
        var top = Pos(this.first, 0), last = this.first + this.size - 1;
        makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
                          text: splitLines(code), origin: "setValue"},
                   {head: top, anchor: top}, true);
      },
      replaceRange: function(code, from, to, origin) {
        from = clipPos(this, from);
        to = to ? clipPos(this, to) : from;
        replaceRange(this, code, from, to, origin);
      },
      getRange: function(from, to, lineSep) {
        var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
        if (lineSep === false) return lines;
        return lines.join(lineSep || "\n");
      },
  
      getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},
      setLine: function(line, text) {
        if (isLine(this, line))
          replaceRange(this, text, Pos(line, 0), clipPos(this, Pos(line)));
      },
      removeLine: function(line) {
        if (line) replaceRange(this, "", clipPos(this, Pos(line - 1)), clipPos(this, Pos(line)));
        else replaceRange(this, "", Pos(0, 0), clipPos(this, Pos(1, 0)));
      },
  
      getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
      getLineNumber: function(line) {return lineNo(line);},
  
      getLineHandleVisualStart: function(line) {
        if (typeof line == "number") line = getLine(this, line);
        return visualLine(this, line);
      },
  
      lineCount: function() {return this.size;},
      firstLine: function() {return this.first;},
      lastLine: function() {return this.first + this.size - 1;},
  
      clipPos: function(pos) {return clipPos(this, pos);},
  
      getCursor: function(start) {
        var sel = this.sel, pos;
        if (start == null || start == "head") pos = sel.head;
        else if (start == "anchor") pos = sel.anchor;
        else if (start == "end" || start === false) pos = sel.to;
        else pos = sel.from;
        return copyPos(pos);
      },
      somethingSelected: function() {return !posEq(this.sel.head, this.sel.anchor);},
  
      setCursor: docOperation(function(line, ch, extend) {
        var pos = clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line);
        if (extend) extendSelection(this, pos);
        else setSelection(this, pos, pos);
      }),
      setSelection: docOperation(function(anchor, head, bias) {
        setSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), bias);
      }),
      extendSelection: docOperation(function(from, to, bias) {
        extendSelection(this, clipPos(this, from), to && clipPos(this, to), bias);
      }),
  
      getSelection: function(lineSep) {return this.getRange(this.sel.from, this.sel.to, lineSep);},
      replaceSelection: function(code, collapse, origin) {
        makeChange(this, {from: this.sel.from, to: this.sel.to, text: splitLines(code), origin: origin}, collapse || "around");
      },
      undo: docOperation(function() {makeChangeFromHistory(this, "undo");}),
      redo: docOperation(function() {makeChangeFromHistory(this, "redo");}),
  
      setExtending: function(val) {this.sel.extend = val;},
  
      historySize: function() {
        var hist = this.history;
        return {undo: hist.done.length, redo: hist.undone.length};
      },
      clearHistory: function() {this.history = makeHistory(this.history.maxGeneration);},
  
      markClean: function() {
        this.cleanGeneration = this.changeGeneration();
      },
      changeGeneration: function() {
        this.history.lastOp = this.history.lastOrigin = null;
        return this.history.generation;
      },
      isClean: function (gen) {
        return this.history.generation == (gen || this.cleanGeneration);
      },
  
      getHistory: function() {
        return {done: copyHistoryArray(this.history.done),
                undone: copyHistoryArray(this.history.undone)};
      },
      setHistory: function(histData) {
        var hist = this.history = makeHistory(this.history.maxGeneration);
        hist.done = histData.done.slice(0);
        hist.undone = histData.undone.slice(0);
      },
  
      markText: function(from, to, options) {
        return markText(this, clipPos(this, from), clipPos(this, to), options, "range");
      },
      setBookmark: function(pos, options) {
        var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
                        insertLeft: options && options.insertLeft};
        pos = clipPos(this, pos);
        return markText(this, pos, pos, realOpts, "bookmark");
      },
      findMarksAt: function(pos) {
        pos = clipPos(this, pos);
        var markers = [], spans = getLine(this, pos.line).markedSpans;
        if (spans) for (var i = 0; i < spans.length; ++i) {
          var span = spans[i];
          if ((span.from == null || span.from <= pos.ch) &&
              (span.to == null || span.to >= pos.ch))
            markers.push(span.marker.parent || span.marker);
        }
        return markers;
      },
      getAllMarks: function() {
        var markers = [];
        this.iter(function(line) {
          var sps = line.markedSpans;
          if (sps) for (var i = 0; i < sps.length; ++i)
            if (sps[i].from != null) markers.push(sps[i].marker);
        });
        return markers;
      },
  
      posFromIndex: function(off) {
        var ch, lineNo = this.first;
        this.iter(function(line) {
          var sz = line.text.length + 1;
          if (sz > off) { ch = off; return true; }
          off -= sz;
          ++lineNo;
        });
        return clipPos(this, Pos(lineNo, ch));
      },
      indexFromPos: function (coords) {
        coords = clipPos(this, coords);
        var index = coords.ch;
        if (coords.line < this.first || coords.ch < 0) return 0;
        this.iter(this.first, coords.line, function (line) {
          index += line.text.length + 1;
        });
        return index;
      },
  
      copy: function(copyHistory) {
        var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
        doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
        doc.sel = {from: this.sel.from, to: this.sel.to, head: this.sel.head, anchor: this.sel.anchor,
                   shift: this.sel.shift, extend: false, goalColumn: this.sel.goalColumn};
        if (copyHistory) {
          doc.history.undoDepth = this.history.undoDepth;
          doc.setHistory(this.getHistory());
        }
        return doc;
      },
  
      linkedDoc: function(options) {
        if (!options) options = {};
        var from = this.first, to = this.first + this.size;
        if (options.from != null && options.from > from) from = options.from;
        if (options.to != null && options.to < to) to = options.to;
        var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
        if (options.sharedHist) copy.history = this.history;
        (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
        copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
        return copy;
      },
      unlinkDoc: function(other) {
        if (other instanceof CodeMirror) other = other.doc;
        if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
          var link = this.linked[i];
          if (link.doc != other) continue;
          this.linked.splice(i, 1);
          other.unlinkDoc(this);
          break;
        }
        // If the histories were shared, split them again
        if (other.history == this.history) {
          var splitIds = [other.id];
          linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
          other.history = makeHistory();
          other.history.done = copyHistoryArray(this.history.done, splitIds);
          other.history.undone = copyHistoryArray(this.history.undone, splitIds);
        }
      },
      iterLinkedDocs: function(f) {linkedDocs(this, f);},
  
      getMode: function() {return this.mode;},
      getEditor: function() {return this.cm;}
    });
  
    Doc.prototype.eachLine = Doc.prototype.iter;
  
    // The Doc methods that should be available on CodeMirror instances
    var dontDelegate = "iter insert remove copy getEditor".split(" ");
    for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
      CodeMirror.prototype[prop] = (function(method) {
        return function() {return method.apply(this.doc, arguments);};
      })(Doc.prototype[prop]);
  
    eventMixin(Doc);
  
    function linkedDocs(doc, f, sharedHistOnly) {
      function propagate(doc, skip, sharedHist) {
        if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
          var rel = doc.linked[i];
          if (rel.doc == skip) continue;
          var shared = sharedHist && rel.sharedHist;
          if (sharedHistOnly && !shared) continue;
          f(rel.doc, shared);
          propagate(rel.doc, doc, shared);
        }
      }
      propagate(doc, null, true);
    }
  
    function attachDoc(cm, doc) {
      if (doc.cm) throw new Error("This document is already in use.");
      cm.doc = doc;
      doc.cm = cm;
      estimateLineHeights(cm);
      loadMode(cm);
      if (!cm.options.lineWrapping) computeMaxLength(cm);
      cm.options.mode = doc.modeOption;
      regChange(cm);
    }
  
    // LINE UTILITIES
  
    function getLine(chunk, n) {
      n -= chunk.first;
      while (!chunk.lines) {
        for (var i = 0;; ++i) {
          var child = chunk.children[i], sz = child.chunkSize();
          if (n < sz) { chunk = child; break; }
          n -= sz;
        }
      }
      return chunk.lines[n];
    }
  
    function getBetween(doc, start, end) {
      var out = [], n = start.line;
      doc.iter(start.line, end.line + 1, function(line) {
        var text = line.text;
        if (n == end.line) text = text.slice(0, end.ch);
        if (n == start.line) text = text.slice(start.ch);
        out.push(text);
        ++n;
      });
      return out;
    }
    function getLines(doc, from, to) {
      var out = [];
      doc.iter(from, to, function(line) { out.push(line.text); });
      return out;
    }
  
    function updateLineHeight(line, height) {
      var diff = height - line.height;
      for (var n = line; n; n = n.parent) n.height += diff;
    }
  
    function lineNo(line) {
      if (line.parent == null) return null;
      var cur = line.parent, no = indexOf(cur.lines, line);
      for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
        for (var i = 0;; ++i) {
          if (chunk.children[i] == cur) break;
          no += chunk.children[i].chunkSize();
        }
      }
      return no + cur.first;
    }
  
    function lineAtHeight(chunk, h) {
      var n = chunk.first;
      outer: do {
        for (var i = 0, e = chunk.children.length; i < e; ++i) {
          var child = chunk.children[i], ch = child.height;
          if (h < ch) { chunk = child; continue outer; }
          h -= ch;
          n += child.chunkSize();
        }
        return n;
      } while (!chunk.lines);
      for (var i = 0, e = chunk.lines.length; i < e; ++i) {
        var line = chunk.lines[i], lh = line.height;
        if (h < lh) break;
        h -= lh;
      }
      return n + i;
    }
  
    function heightAtLine(cm, lineObj) {
      lineObj = visualLine(cm.doc, lineObj);
  
      var h = 0, chunk = lineObj.parent;
      for (var i = 0; i < chunk.lines.length; ++i) {
        var line = chunk.lines[i];
        if (line == lineObj) break;
        else h += line.height;
      }
      for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
        for (var i = 0; i < p.children.length; ++i) {
          var cur = p.children[i];
          if (cur == chunk) break;
          else h += cur.height;
        }
      }
      return h;
    }
  
    function getOrder(line) {
      var order = line.order;
      if (order == null) order = line.order = bidiOrdering(line.text);
      return order;
    }
  
    // HISTORY
  
    function makeHistory(startGen) {
      return {
        // Arrays of history events. Doing something adds an event to
        // done and clears undo. Undoing moves events from done to
        // undone, redoing moves them in the other direction.
        done: [], undone: [], undoDepth: Infinity,
        // Used to track when changes can be merged into a single undo
        // event
        lastTime: 0, lastOp: null, lastOrigin: null,
        // Used by the isClean() method
        generation: startGen || 1, maxGeneration: startGen || 1
      };
    }
  
    function attachLocalSpans(doc, change, from, to) {
      var existing = change["spans_" + doc.id], n = 0;
      doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
        if (line.markedSpans)
          (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
        ++n;
      });
    }
  
    function historyChangeFromChange(doc, change) {
      var from = { line: change.from.line, ch: change.from.ch };
      var histChange = {from: from, to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
      attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
      linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
      return histChange;
    }
  
    function addToHistory(doc, change, selAfter, opId) {
      var hist = doc.history;
      hist.undone.length = 0;
      var time = +new Date, cur = lst(hist.done);
  
      if (cur &&
          (hist.lastOp == opId ||
           hist.lastOrigin == change.origin && change.origin &&
           ((change.origin.charAt(0) == "+" && doc.cm && hist.lastTime > time - doc.cm.options.historyEventDelay) ||
            change.origin.charAt(0) == "*"))) {
        // Merge this change into the last event
        var last = lst(cur.changes);
        if (posEq(change.from, change.to) && posEq(change.from, last.to)) {
          // Optimized case for simple insertion -- don't want to add
          // new changesets for every character typed
          last.to = changeEnd(change);
        } else {
          // Add new sub-event
          cur.changes.push(historyChangeFromChange(doc, change));
        }
        cur.anchorAfter = selAfter.anchor; cur.headAfter = selAfter.head;
      } else {
        // Can not be merged, start a new event.
        cur = {changes: [historyChangeFromChange(doc, change)],
               generation: hist.generation,
               anchorBefore: doc.sel.anchor, headBefore: doc.sel.head,
               anchorAfter: selAfter.anchor, headAfter: selAfter.head};
        hist.done.push(cur);
        hist.generation = ++hist.maxGeneration;
        while (hist.done.length > hist.undoDepth)
          hist.done.shift();
      }
      hist.lastTime = time;
      hist.lastOp = opId;
      hist.lastOrigin = change.origin;
    }
  
    function removeClearedSpans(spans) {
      if (!spans) return null;
      for (var i = 0, out; i < spans.length; ++i) {
        if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
        else if (out) out.push(spans[i]);
      }
      return !out ? spans : out.length ? out : null;
    }
  
    function getOldSpans(doc, change) {
      var found = change["spans_" + doc.id];
      if (!found) return null;
      for (var i = 0, nw = []; i < change.text.length; ++i)
        nw.push(removeClearedSpans(found[i]));
      return nw;
    }
  
    // Used both to provide a JSON-safe object in .getHistory, and, when
    // detaching a document, to split the history in two
    function copyHistoryArray(events, newGroup) {
      for (var i = 0, copy = []; i < events.length; ++i) {
        var event = events[i], changes = event.changes, newChanges = [];
        copy.push({changes: newChanges, anchorBefore: event.anchorBefore, headBefore: event.headBefore,
                   anchorAfter: event.anchorAfter, headAfter: event.headAfter});
        for (var j = 0; j < changes.length; ++j) {
          var change = changes[j], m;
          newChanges.push({from: change.from, to: change.to, text: change.text});
          if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
            if (indexOf(newGroup, Number(m[1])) > -1) {
              lst(newChanges)[prop] = change[prop];
              delete change[prop];
            }
          }
        }
      }
      return copy;
    }
  
    // Rebasing/resetting history to deal with externally-sourced changes
  
    function rebaseHistSel(pos, from, to, diff) {
      if (to < pos.line) {
        pos.line += diff;
      } else if (from < pos.line) {
        pos.line = from;
        pos.ch = 0;
      }
    }
  
    // Tries to rebase an array of history events given a change in the
    // document. If the change touches the same lines as the event, the
    // event, and everything 'behind' it, is discarded. If the change is
    // before the event, the event's positions are updated. Uses a
    // copy-on-write scheme for the positions, to avoid having to
    // reallocate them all on every rebase, but also avoid problems with
    // shared position objects being unsafely updated.
    function rebaseHistArray(array, from, to, diff) {
      for (var i = 0; i < array.length; ++i) {
        var sub = array[i], ok = true;
        for (var j = 0; j < sub.changes.length; ++j) {
          var cur = sub.changes[j];
          if (!sub.copied) { cur.from = copyPos(cur.from); cur.to = copyPos(cur.to); }
          if (to < cur.from.line) {
            cur.from.line += diff;
            cur.to.line += diff;
          } else if (from <= cur.to.line) {
            ok = false;
            break;
          }
        }
        if (!sub.copied) {
          sub.anchorBefore = copyPos(sub.anchorBefore); sub.headBefore = copyPos(sub.headBefore);
          sub.anchorAfter = copyPos(sub.anchorAfter); sub.readAfter = copyPos(sub.headAfter);
          sub.copied = true;
        }
        if (!ok) {
          array.splice(0, i + 1);
          i = 0;
        } else {
          rebaseHistSel(sub.anchorBefore); rebaseHistSel(sub.headBefore);
          rebaseHistSel(sub.anchorAfter); rebaseHistSel(sub.headAfter);
        }
      }
    }
  
    function rebaseHist(hist, change) {
      var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
      rebaseHistArray(hist.done, from, to, diff);
      rebaseHistArray(hist.undone, from, to, diff);
    }
  
    // EVENT OPERATORS
  
    function stopMethod() {e_stop(this);}
    // Ensure an event has a stop method.
    function addStop(event) {
      if (!event.stop) event.stop = stopMethod;
      return event;
    }
  
    function e_preventDefault(e) {
      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
    }
    function e_stopPropagation(e) {
      if (e.stopPropagation) e.stopPropagation();
      else e.cancelBubble = true;
    }
    function e_defaultPrevented(e) {
      return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
    }
    function e_stop(e) {e_preventDefault(e); e_stopPropagation(e);}
    CodeMirror.e_stop = e_stop;
    CodeMirror.e_preventDefault = e_preventDefault;
    CodeMirror.e_stopPropagation = e_stopPropagation;
  
    function e_target(e) {return e.target || e.srcElement;}
    function e_button(e) {
      var b = e.which;
      if (b == null) {
        if (e.button & 1) b = 1;
        else if (e.button & 2) b = 3;
        else if (e.button & 4) b = 2;
      }
      if (mac && e.ctrlKey && b == 1) b = 3;
      return b;
    }
  
    // EVENT HANDLING
  
    function on(emitter, type, f) {
      if (emitter.addEventListener)
        emitter.addEventListener(type, f, false);
      else if (emitter.attachEvent)
        emitter.attachEvent("on" + type, f);
      else {
        var map = emitter._handlers || (emitter._handlers = {});
        var arr = map[type] || (map[type] = []);
        arr.push(f);
      }
    }
  
    function off(emitter, type, f) {
      if (emitter.removeEventListener)
        emitter.removeEventListener(type, f, false);
      else if (emitter.detachEvent)
        emitter.detachEvent("on" + type, f);
      else {
        var arr = emitter._handlers && emitter._handlers[type];
        if (!arr) return;
        for (var i = 0; i < arr.length; ++i)
          if (arr[i] == f) { arr.splice(i, 1); break; }
      }
    }
  
    function signal(emitter, type /*, values...*/) {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      var args = Array.prototype.slice.call(arguments, 2);
      for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
    }
  
    var delayedCallbacks, delayedCallbackDepth = 0;
    function signalLater(emitter, type /*, values...*/) {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      var args = Array.prototype.slice.call(arguments, 2);
      if (!delayedCallbacks) {
        ++delayedCallbackDepth;
        delayedCallbacks = [];
        setTimeout(fireDelayed, 0);
      }
      function bnd(f) {return function(){f.apply(null, args);};}      for (var i = 0; i < arr.length; ++i)
        delayedCallbacks.push(bnd(arr[i]));
    }
  
    function signalDOMEvent(cm, e, override) {
      signal(cm, override || e.type, cm, e);
      return e_defaultPrevented(e) || e.codemirrorIgnore;
    }
  
    function fireDelayed() {
      --delayedCallbackDepth;
      var delayed = delayedCallbacks;
      delayedCallbacks = null;
      for (var i = 0; i < delayed.length; ++i) delayed[i]();
    }
  
    function hasHandler(emitter, type) {
      var arr = emitter._handlers && emitter._handlers[type];
      return arr && arr.length > 0;
    }
  
    CodeMirror.on = on; CodeMirror.off = off; CodeMirror.signal = signal;
  
    function eventMixin(ctor) {
      ctor.prototype.on = function(type, f) {on(this, type, f);};
      ctor.prototype.off = function(type, f) {off(this, type, f);};
    }
  
    // MISC UTILITIES
  
    // Number of pixels added to scroller and sizer to hide scrollbar
    var scrollerCutOff = 30;
  
    // Returned or thrown by various protocols to signal 'I'm not
    // handling this'.
    var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};
  
    function Delayed() {this.id = null;}
    Delayed.prototype = {set: function(ms, f) {clearTimeout(this.id); this.id = setTimeout(f, ms);}};
  
    // Counts the column offset in a string, taking tabs into account.
    // Used mostly to find indentation.
    function countColumn(string, end, tabSize, startIndex, startValue) {
      if (end == null) {
        end = string.search(/[^\s\u00a0]/);
        if (end == -1) end = string.length;
      }
      for (var i = startIndex || 0, n = startValue || 0; i < end; ++i) {
        if (string.charAt(i) == "\t") n += tabSize - (n % tabSize);
        else ++n;
      }
      return n;
    }
    CodeMirror.countColumn = countColumn;
  
    var spaceStrs = [""];
    function spaceStr(n) {
      while (spaceStrs.length <= n)
        spaceStrs.push(lst(spaceStrs) + " ");
      return spaceStrs[n];
    }
  
    function lst(arr) { return arr[arr.length-1]; }
  
    function selectInput(node) {
      if (ios) { // Mobile Safari apparently has a bug where select() is broken.
        node.selectionStart = 0;
        node.selectionEnd = node.value.length;
      } else {
        // Suppress mysterious IE10 errors
        try { node.select(); }
        catch(_e) {}
      }
    }
  
    function indexOf(collection, elt) {
      if (collection.indexOf) return collection.indexOf(elt);
      for (var i = 0, e = collection.length; i < e; ++i)
        if (collection[i] == elt) return i;
      return -1;
    }
  
    function createObj(base, props) {
      function Obj() {}
      Obj.prototype = base;
      var inst = new Obj();
      if (props) copyObj(props, inst);
      return inst;
    }
  
    function copyObj(obj, target) {
      if (!target) target = {};
      for (var prop in obj) if (obj.hasOwnProperty(prop)) target[prop] = obj[prop];
      return target;
    }
  
    function emptyArray(size) {
      for (var a = [], i = 0; i < size; ++i) a.push(undefined);
      return a;
    }
  
    function bind(f) {
      var args = Array.prototype.slice.call(arguments, 1);
      return function(){return f.apply(null, args);};
    }
  
    var nonASCIISingleCaseWordChar = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function isWordChar(ch) {
      return /\w/.test(ch) || ch > "\x80" &&
        (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
    }
  
    function isEmpty(obj) {
      for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
      return true;
    }
  
    var isExtendingChar = /[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\u1DC0–\u1DFF\u20D0–\u20FF\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff\uFE20–\uFE2F]/;
  
    // DOM UTILITIES
  
    function elt(tag, content, className, style) {
      var e = document.createElement(tag);
      if (className) e.className = className;
      if (style) e.style.cssText = style;
      if (typeof content == "string") setTextContent(e, content);
      else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
      return e;
    }
  
    function removeChildren(e) {
      for (var count = e.childNodes.length; count > 0; --count)
        e.removeChild(e.firstChild);
      return e;
    }
  
    function removeChildrenAndAdd(parent, e) {
      return removeChildren(parent).appendChild(e);
    }
  
    function setTextContent(e, str) {
      if (ie_lt9) {
        e.innerHTML = "";
        e.appendChild(document.createTextNode(str));
      } else e.textContent = str;
    }
  
    function getRect(node) {
      return node.getBoundingClientRect();
    }
    CodeMirror.replaceGetRect = function(f) { getRect = f; };
  
    // FEATURE DETECTION
  
    // Detect drag-and-drop
    var dragAndDrop = function() {
      // There is *some* kind of drag-and-drop support in IE6-8, but I
      // couldn't get it to work yet.
      if (ie_lt9) return false;
      var div = elt('div');
      return "draggable" in div || "dragDrop" in div;
    }();
  
    // For a reason I have yet to figure out, some browsers disallow
    // word wrapping between certain characters *only* if a new inline
    // element is started between them. This makes it hard to reliably
    // measure the position of things, since that requires inserting an
    // extra span. This terribly fragile set of tests matches the
    // character combinations that suffer from this phenomenon on the
    // various browsers.
    function spanAffectsWrapping() { return false; }
    if (gecko) // Only for "$'"
      spanAffectsWrapping = function(str, i) {
        return str.charCodeAt(i - 1) == 36 && str.charCodeAt(i) == 39;
      };
    else if (safari && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent))
      spanAffectsWrapping = function(str, i) {
        return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(str.slice(i - 1, i + 1));
      };
    else if (webkit && /Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent))
      spanAffectsWrapping = function(str, i) {
        var code = str.charCodeAt(i - 1);
        return code >= 8208 && code <= 8212;
      };
    else if (webkit)
      spanAffectsWrapping = function(str, i) {
        if (i > 1 && str.charCodeAt(i - 1) == 45) {
          if (/\w/.test(str.charAt(i - 2)) && /[^\-?\.]/.test(str.charAt(i))) return true;
          if (i > 2 && /[\d\.,]/.test(str.charAt(i - 2)) && /[\d\.,]/.test(str.charAt(i))) return false;
        }
        return /[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|…[\w~`@#$%\^&*(_=+{[><]/.test(str.slice(i - 1, i + 1));
      };
  
    var knownScrollbarWidth;
    function scrollbarWidth(measure) {
      if (knownScrollbarWidth != null) return knownScrollbarWidth;
      var test = elt("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
      removeChildrenAndAdd(measure, test);
      if (test.offsetWidth)
        knownScrollbarWidth = test.offsetHeight - test.clientHeight;
      return knownScrollbarWidth || 0;
    }
  
    var zwspSupported;
    function zeroWidthElement(measure) {
      if (zwspSupported == null) {
        var test = elt("span", "\u200b");
        removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
        if (measure.firstChild.offsetHeight != 0)
          zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !ie_lt8;
      }
      if (zwspSupported) return elt("span", "\u200b");
      else return elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
    }
  
    // See if "".split is the broken IE version, if so, provide an
    // alternative way to split lines.
    var splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
      var pos = 0, result = [], l = string.length;
      while (pos <= l) {
        var nl = string.indexOf("\n", pos);
        if (nl == -1) nl = string.length;
        var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
        var rt = line.indexOf("\r");
        if (rt != -1) {
          result.push(line.slice(0, rt));
          pos += rt + 1;
        } else {
          result.push(line);
          pos = nl + 1;
        }
      }
      return result;
    } : function(string){return string.split(/\r\n?|\n/);};
    CodeMirror.splitLines = splitLines;
  
    var hasSelection = window.getSelection ? function(te) {
      try { return te.selectionStart != te.selectionEnd; }
      catch(e) { return false; }
    } : function(te) {
      try {var range = te.ownerDocument.selection.createRange();}
      catch(e) {}
      if (!range || range.parentElement() != te) return false;
      return range.compareEndPoints("StartToEnd", range) != 0;
    };
  
    var hasCopyEvent = (function() {
      var e = elt("div");
      if ("oncopy" in e) return true;
      e.setAttribute("oncopy", "return;");
      return typeof e.oncopy == 'function';
    })();
  
    // KEY NAMING
  
    var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
                    19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
                    36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
                    46: "Delete", 59: ";", 91: "Mod", 92: "Mod", 93: "Mod", 109: "-", 107: "=", 127: "Delete",
                    186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
                    221: "]", 222: "'", 63276: "PageUp", 63277: "PageDown", 63275: "End", 63273: "Home",
                    63234: "Left", 63232: "Up", 63235: "Right", 63233: "Down", 63302: "Insert", 63272: "Delete"};
    CodeMirror.keyNames = keyNames;
    (function() {
      // Number keys
      for (var i = 0; i < 10; i++) keyNames[i + 48] = String(i);
      // Alphabetic keys
      for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
      // Function keys
      for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
    })();
  
    // BIDI HELPERS
  
    function iterateBidiSections(order, from, to, f) {
      if (!order) return f(from, to, "ltr");
      var found = false;
      for (var i = 0; i < order.length; ++i) {
        var part = order[i];
        if (part.from < to && part.to > from || from == to && part.to == from) {
          f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
          found = true;
        }
      }
      if (!found) f(from, to, "ltr");
    }
  
    function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
    function bidiRight(part) { return part.level % 2 ? part.from : part.to; }
  
    function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
    function lineRight(line) {
      var order = getOrder(line);
      if (!order) return line.text.length;
      return bidiRight(lst(order));
    }
  
    function lineStart(cm, lineN) {
      var line = getLine(cm.doc, lineN);
      var visual = visualLine(cm.doc, line);
      if (visual != line) lineN = lineNo(visual);
      var order = getOrder(visual);
      var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
      return Pos(lineN, ch);
    }
    function lineEnd(cm, lineN) {
      var merged, line;
      while (merged = collapsedSpanAtEnd(line = getLine(cm.doc, lineN)))
        lineN = merged.find().to.line;
      var order = getOrder(line);
      var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
      return Pos(lineN, ch);
    }
  
    function compareBidiLevel(order, a, b) {
      var linedir = order[0].level;
      if (a == linedir) return true;
      if (b == linedir) return false;
      return a < b;
    }
    var bidiOther;
    function getBidiPartAt(order, pos) {
      for (var i = 0, found; i < order.length; ++i) {
        var cur = order[i];
        if (cur.from < pos && cur.to > pos) { bidiOther = null; return i; }
        if (cur.from == pos || cur.to == pos) {
          if (found == null) {
            found = i;
          } else if (compareBidiLevel(order, cur.level, order[found].level)) {
            bidiOther = found;
            return i;
          } else {
            bidiOther = i;
            return found;
          }
        }
      }
      bidiOther = null;
      return found;
    }
  
    function moveInLine(line, pos, dir, byUnit) {
      if (!byUnit) return pos + dir;
      do pos += dir;
      while (pos > 0 && isExtendingChar.test(line.text.charAt(pos)));
      return pos;
    }
  
    // This is somewhat involved. It is needed in order to move
    // 'visually' through bi-directional text -- i.e., pressing left
    // should make the cursor go left, even when in RTL text. The
    // tricky part is the 'jumps', where RTL and LTR text touch each
    // other. This often requires the cursor offset to move more than
    // one unit, in order to visually move one unit.
    function moveVisually(line, start, dir, byUnit) {
      var bidi = getOrder(line);
      if (!bidi) return moveLogically(line, start, dir, byUnit);
      var pos = getBidiPartAt(bidi, start), part = bidi[pos];
      var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);
  
      for (;;) {
        if (target > part.from && target < part.to) return target;
        if (target == part.from || target == part.to) {
          if (getBidiPartAt(bidi, target) == pos) return target;
          part = bidi[pos += dir];
          return (dir > 0) == part.level % 2 ? part.to : part.from;
        } else {
          part = bidi[pos += dir];
          if (!part) return null;
          if ((dir > 0) == part.level % 2)
            target = moveInLine(line, part.to, -1, byUnit);
          else
            target = moveInLine(line, part.from, 1, byUnit);
        }
      }
    }
  
    function moveLogically(line, start, dir, byUnit) {
      var target = start + dir;
      if (byUnit) while (target > 0 && isExtendingChar.test(line.text.charAt(target))) target += dir;
      return target < 0 || target > line.text.length ? null : target;
    }
  
    // Bidirectional ordering algorithm
    // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
    // that this (partially) implements.
  
    // One-char codes used for character types:
    // L (L):   Left-to-Right
    // R (R):   Right-to-Left
    // r (AL):  Right-to-Left Arabic
    // 1 (EN):  European Number
    // + (ES):  European Number Separator
    // % (ET):  European Number Terminator
    // n (AN):  Arabic Number
    // , (CS):  Common Number Separator
    // m (NSM): Non-Spacing Mark
    // b (BN):  Boundary Neutral
    // s (B):   Paragraph Separator
    // t (S):   Segment Separator
    // w (WS):  Whitespace
    // N (ON):  Other Neutrals
  
    // Returns null if characters are ordered as they appear
    // (left-to-right), or an array of sections ({from, to, level}
    // objects) in the order in which they occur visually.
    var bidiOrdering = (function() {
      // Character types for codepoints 0 to 0xff
      var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL";
      // Character types for codepoints 0x600 to 0x6ff
      var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr";
      function charType(code) {
        if (code <= 0xff) return lowTypes.charAt(code);
        else if (0x590 <= code && code <= 0x5f4) return "R";
        else if (0x600 <= code && code <= 0x6ff) return arabicTypes.charAt(code - 0x600);
        else if (0x700 <= code && code <= 0x8ac) return "r";
        else return "L";
      }
  
      var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
      var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
      // Browsers seem to always treat the boundaries of block elements as being L.
      var outerType = "L";
  
      return function(str) {
        if (!bidiRE.test(str)) return false;
        var len = str.length, types = [];
        for (var i = 0, type; i < len; ++i)
          types.push(type = charType(str.charCodeAt(i)));
  
        // W1. Examine each non-spacing mark (NSM) in the level run, and
        // change the type of the NSM to the type of the previous
        // character. If the NSM is at the start of the level run, it will
        // get the type of sor.
        for (var i = 0, prev = outerType; i < len; ++i) {
          var type = types[i];
          if (type == "m") types[i] = prev;
          else prev = type;
        }
  
        // W2. Search backwards from each instance of a European number
        // until the first strong type (R, L, AL, or sor) is found. If an
        // AL is found, change the type of the European number to Arabic
        // number.
        // W3. Change all ALs to R.
        for (var i = 0, cur = outerType; i < len; ++i) {
          var type = types[i];
          if (type == "1" && cur == "r") types[i] = "n";
          else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
        }
  
        // W4. A single European separator between two European numbers
        // changes to a European number. A single common separator between
        // two numbers of the same type changes to that type.
        for (var i = 1, prev = types[0]; i < len - 1; ++i) {
          var type = types[i];
          if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
          else if (type == "," && prev == types[i+1] &&
                   (prev == "1" || prev == "n")) types[i] = prev;
          prev = type;
        }
  
        // W5. A sequence of European terminators adjacent to European
        // numbers changes to all European numbers.
        // W6. Otherwise, separators and terminators change to Other
        // Neutral.
        for (var i = 0; i < len; ++i) {
          var type = types[i];
          if (type == ",") types[i] = "N";
          else if (type == "%") {
            for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
            var replace = (i && types[i-1] == "!") || (end < len - 1 && types[end] == "1") ? "1" : "N";
            for (var j = i; j < end; ++j) types[j] = replace;
            i = end - 1;
          }
        }
  
        // W7. Search backwards from each instance of a European number
        // until the first strong type (R, L, or sor) is found. If an L is
        // found, then change the type of the European number to L.
        for (var i = 0, cur = outerType; i < len; ++i) {
          var type = types[i];
          if (cur == "L" && type == "1") types[i] = "L";
          else if (isStrong.test(type)) cur = type;
        }
  
        // N1. A sequence of neutrals takes the direction of the
        // surrounding strong text if the text on both sides has the same
        // direction. European and Arabic numbers act as if they were R in
        // terms of their influence on neutrals. Start-of-level-run (sor)
        // and end-of-level-run (eor) are used at level run boundaries.
        // N2. Any remaining neutrals take the embedding direction.
        for (var i = 0; i < len; ++i) {
          if (isNeutral.test(types[i])) {
            for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
            var before = (i ? types[i-1] : outerType) == "L";
            var after = (end < len - 1 ? types[end] : outerType) == "L";
            var replace = before || after ? "L" : "R";
            for (var j = i; j < end; ++j) types[j] = replace;
            i = end - 1;
          }
        }
  
        // Here we depart from the documented algorithm, in order to avoid
        // building up an actual levels array. Since there are only three
        // levels (0, 1, 2) in an implementation that doesn't take
        // explicit embedding into account, we can build up the order on
        // the fly, without following the level-based algorithm.
        var order = [], m;
        for (var i = 0; i < len;) {
          if (countsAsLeft.test(types[i])) {
            var start = i;
            for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
            order.push({from: start, to: i, level: 0});
          } else {
            var pos = i, at = order.length;
            for (++i; i < len && types[i] != "L"; ++i) {}
            for (var j = pos; j < i;) {
              if (countsAsNum.test(types[j])) {
                if (pos < j) order.splice(at, 0, {from: pos, to: j, level: 1});
                var nstart = j;
                for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
                order.splice(at, 0, {from: nstart, to: j, level: 2});
                pos = j;
              } else ++j;
            }
            if (pos < i) order.splice(at, 0, {from: pos, to: i, level: 1});
          }
        }
        if (order[0].level == 1 && (m = str.match(/^\s+/))) {
          order[0].from = m[0].length;
          order.unshift({from: 0, to: m[0].length, level: 0});
        }
        if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
          lst(order).to -= m[0].length;
          order.push({from: len - m[0].length, to: len, level: 0});
        }
        if (order[0].level != lst(order).level)
          order.push({from: len, to: len, level: order[0].level});
  
        return order;
      };
    })();
  
    // THE END
  
    CodeMirror.version = "3.20.0";
  
    return CodeMirror;
  })();
  
  var CodeMirror$1 = CodeMirror;

// TODO actually recognize syntax of TypeScript constructs

CodeMirror$1.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonMode = parserConfig.json;
  var isTS = parserConfig.typescript;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "module": kw("module"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("interface"),
        "extends": kw("extends"),
        "constructor": kw("constructor"),

        // scope modifiers
        "public": kw("public"),
        "private": kw("private"),
        "protected": kw("protected"),
        "static": kw("static"),

        // types
        "string": type, "number": type, "bool": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;

  function nextUntilUnescaped(stream, end) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (next == end && !escaped)
        return false;
      escaped = !escaped && next == "\\";
    }
    return escaped;
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>");
    } else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (state.lastType == "operator" || state.lastType == "keyword c" ||
               state.lastType == "sof" || /^[\[{}\(,;:]$/.test(state.lastType)) {
        nextUntilUnescaped(stream, "/");
        stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla
        return ret("regexp", "string-2");
      } else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", null, stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", null, stream.current());
    } else {
      stream.eatWhile(/[\w\$_]/);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      if (!nextUntilUnescaped(stream, quote))
        state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) break;
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (/[$\w]/.test(ch)) {
        sawSomething = true;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    if (state.context) {
      cx.marked = "def";
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    return function(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(arguments.callee);
    };
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, poplex, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "module") return cont(pushlex("form"), pushcontext, afterModule, popcontext, poplex);
    if (type == "class") return cont(pushlex("form"), className, objlit, poplex);
    if (type == "export") return cont(pushlex("form"), afterExport, poplex);
    if (type == "import") return cont(pushlex("form"), afterImport, poplex);
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, commasep(pattern, ")"), expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), expressionNoComma, maybeArrayComprehension, poplex, maybeop);
    if (type == "{") return cont(commasep(objprop, "}"), maybeop);
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (value == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { cx.cc.push(me); return quasi(value); }
    if (type == ";") return;
    if (type == "(") return cont(commasep(expressionNoComma, ")", "call"), me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function quasi(value) {
    if (!value) debugger;
    if (value.slice(value.length - 2) != "${") return cont();
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont();
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    if (type == "{") return pass(statement);
    return pass(expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    if (type == "{") return pass(statement);
    return pass(expressionNoComma);
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
    } else if (type == "number" || type == "string") {
      cx.marked = type + " property";
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    }
    if (atomicTypes.hasOwnProperty(type)) return cont(afterprop);
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, info) {
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      if (info === false) return pass(what, proceed);
      return pass(pushlex(end, info), what, proceed, poplex);
    };
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (isTS && type == ":") return cont(typedef);
  }
  function typedef(type) {
    if (type == "variable"){cx.marked = "variable-3"; return cont();}
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "variable") { register(value); return cont(); }
    if (type == "[") return cont(commasep(pattern, "]"));
    if (type == "{") return cont(commasep(proppattern, "}"));
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    return cont(expect(":"), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form"), statement, poplex);
  }
  function forspec(type) {
    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"));
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybeinof);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, commasep(funarg, ")"), statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(_type, value) {
    if (value == "extends") return cont(expression);
  }
  function objlit(type) {
    if (type == "{") return cont(commasep(objprop, "}"));
  }
  function afterModule(type, value) {
    if (type == "string") return cont(statement);
    if (type == "variable") { register(value); return cont(maybeFrom); }
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return cont(commasep(importSpec, "}"));
    if (type == "variable") register(value);
    return cont();
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function maybeArrayComprehension(type) {
    if (type == "for") return pass(comprehension);
    if (type == ",") return cont(commasep(expressionNoComma, "]", false));
    return pass(commasep(expressionNoComma, "]", false));
  }
  function comprehension(type) {
    if (type == "for") return cont(forspec, comprehension);
    if (type == "if") return cont(expression, comprehension);
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: 0
      };
      if (parserConfig.globalVars) state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror$1.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricChars: ":{}",
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",

    helperType: jsonMode ? "json" : "javascript",
    jsonMode: jsonMode
  };
});

CodeMirror$1.defineMIME("text/javascript", "javascript");
CodeMirror$1.defineMIME("text/ecmascript", "javascript");
CodeMirror$1.defineMIME("application/javascript", "javascript");
CodeMirror$1.defineMIME("application/ecmascript", "javascript");
CodeMirror$1.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror$1.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror$1.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror$1.defineMIME("application/typescript", { name: "javascript", typescript: true });

/**
 *  File Name   : dndAuthString.js
 *  Author      : Ayush Srivastava
 *  Function    : DND_AUTH
 *  Version     : 1.0
 *  Packege     : Drag and Drop (auth)
 *  Last update : 19 Jan 2021
 *  Dependency  : AI , Contextmenu, Codemirror
 */

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
};

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
                DND_AUTH.elemModal("drop");
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
                DND_AUTH.elemModal("tabhead");
            }
        },
        null,
        {
            text: l.new_label,
            onclick: () => {
                DND_AUTH.elemModal("label");
            }
        },
        null,
        {
            text: l.hotspot,
            onclick: () => {
                DND_AUTH.elemModal("hotspot");
            }
        },
        null,
        {
            text: l.new_tab,
            onclick: () => {
                DND_AUTH.elemModal("tab");
            }
        },
        {
            text: l.new_steps,
            onclick: () => {
                DND_AUTH.elemModal("step");
            }
        },
        {
            text: l.insert_script,
            onclick: () => {
                DND_AUTH.elemModal("jscript");
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
                DND_AUTH.elemModal("drop");
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
                DND_AUTH.elemModal("tabhead");
            }
        },
        null,
        {
            text: l.new_label,
            onclick: () => {
                DND_AUTH.elemModal("label");
            }
        },
        null,
        {
            text: l.hotspot,
            onclick: () => {
                DND_AUTH.elemModal("hotspot");
            }
        }
    ];
    const dragndrop_contextmenu = new ContextMenu(AI.select('#dndmain'), dropdown);
    dragndrop_contextmenu.install();
};

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
        };
    }
    if (xml.children.length == 0 && xml.innerText.trim() != "") {
        attrs[attrs.length] = {
            "name": "value",
            "value": xml.innerText.trim()
        };
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
};

// for clearing the cdata
DND_AUTH.clearCdata = function(text) {
    return (typeof text != "undefined" ? text.replace("<!--[CDATA[", "").replace("]]-->", "").trim() : "");
};

// for getting the offset
DND_AUTH.offset = function(element) {
    let rect = element.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
};

// for getting the position
DND_AUTH.position = function(element) {
    return {
        left: element.offsetLeft,
        top: element.offsetTop
    }
};

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
        });
    }
    let parent = AI.select('.parent').getAttribute("data-parent");
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
            AI.selectAll('#authoring-modal .drag', 'show', 'block');
            AI.select('#authoring-modal #drag-top').value = pos[0];
            AI.select('#authoring-modal #drag-left').value = pos[1];
            AI.select('#authoring-modal #drag-id').value = labkey;
            DND_AUTH.visible_class = '.drag';
            break;
        case "drop":
            AI.select('#authoring-modal .modal-title').innerText = l.placeholder + ' - ' + labkey;
            AI.selectAll('#authoring-modal .dropitem', 'show', 'block');
            AI.select('#authoring-modal #drop-top').value = pos[0];
            AI.select('#authoring-modal #drop-left').value = pos[1];
            AI.select('#authoring-modal #drop-id').value = labkey;
            DND_AUTH.visible_class = '.dropitem';

            break;
        case "input":
            AI.select('#authoring-modal .modal-title').innerText = l.input_box + ' - ' + labkey;
            AI.selectAll('#authoring-modal .inputbox', 'show', 'block');
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
                        AI.select('#authoring-modal #base-bgimg-alt').value = '';
                    }
                    AI.select('#authoring-modal #base-borderrequired').checked = img_src.classList.contains("img-bordered");
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
                    editor = CodeMirror$1.fromTextArea(document.getElementById("code"), {
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
        AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' .events a').click();
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
            AI.select('#authoring-modal .tabhead .events a i');
            let modal_element = AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]');
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
        let fetched_list_data = DND_AUTH.errorChecking();
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
            DND_AUTH.error_message = l.required_field;
            AI.select('#authoring-modal .errorBtn', 'removeClass', 'h');
            AI.select('#authoring-modal .addElement', 'addClass', 'h');
            break;
        }
    }
};

// for rounding of the value
DND_AUTH.setValue = function (value) {
    if (isNaN(value) || (typeof (value) == 'string' && value.trim() == '')) {
        return value;
    } else if (value == null || value == undefined) {
        return '';
    } else {
        return Math.round(Number(value));
    }
};

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
};

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
};

// this function is used for getting the serialized data
DND_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                };
            }
        } else {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
};

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
                    attributes[index].value = (ui.style.height) ? Number(ui.style.height.replace(/px/g, '')) : ui.offsetHeight;
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

                    let labelClasses = AI.find(AI.select('select#label_class'), 'option', 'all');
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
};

// for getting the image height and width
DND_AUTH.getImageData = function(type, element) {
    if (type == 'h') {
        return element.clientHeight > element.naturalHeight ? element.clientHeight : element.naturalHeight;
    } else {
        return element.clientWidth > element.naturalWidth ? element.clientWidth : element.naturalWidth
    }
};

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
                AI.insert(xmlDom, "<jscript>\n" + editor.getValue() + "\n</jscript>" , 'beforeend');
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
};

// for getting the value of a particular key in an object
DND_AUTH.getObjectValue = function(key, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == key) {
            return arr[i].value;
        }
    }
};

// function responsible for setting the step
DND_AUTH.setStepAuth = function(tabname) {
    let steps = AI.selectAll("#dndmain [type='step']");
    for (let index = 0; index < steps.length; index++) {
        AI.setCss(steps[index], {
            display: 'none'
        });
    }
    if (tabname == "baseAuth") {
        AI.select("#baseAuth").checked = true;
    } else {
        AI.select("#step_" + tabname).checked = true;
        if (tabname.trim() != '') {
            let tab = AI.select("#" + tabname);
            AI.setCss(tab, {
                display: 'block'
            });
            AI.setCss(tab.parentElement, {
                display: 'block'
            });
        }
    }
};

// for getting the ID
DND_AUTH.getID = function(count) {
    if (AI.selectAll('[id="ID' + count + '"]').length < 1) {
        return count;
    }
    count = DND_AUTH.getID(count + 1);
    return count;
};

// for getting first letter as capital
DND_AUTH.capitalize = function(s) {
    return s.toLowerCase().replace(/\b./g, function(a) {
        return a.toUpperCase();
    });
};

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
};

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
        }
    }
};

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
};

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
};

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
};

// for decoding the entity
DND_AUTH.decodeEnt = function(htmlEnt) {
    return htmlEnt.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};

/* clsSMDragNDrop\libs\authoring\Drag.svelte generated by Svelte v3.40.2 */

const file = "clsSMDragNDrop\\libs\\authoring\\Drag.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (81:0) {#if drag_value && drag_value.length > 0}
function create_if_block(ctx) {
	let div;
	let div_key_value;
	let each_value = /*drag_value*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "drag_" + /*index*/ ctx[2] + /*drag_value*/ ctx[3].length);
			add_location(div, file, 81, 4, 2162);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drag_value, deleteElem, elemModal*/ 11) {
				each_value = /*drag_value*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, drag_value*/ 12 && div_key_value !== (div_key_value = "drag_" + /*index*/ ctx[2] + /*drag_value*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(81:0) {#if drag_value && drag_value.length > 0}",
		ctx
	});

	return block;
}

// (83:8) {#each drag_value as data, index}
function create_each_block(ctx) {
	let div2;
	let p;
	let t0_value = (/*data*/ ctx[8].text ? /*data*/ ctx[8].text : '') + "";
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let div2_data_title_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			add_location(p, file, 101, 16, 2976);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file, 107, 24, 3303);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file, 106, 20, 3159);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file, 110, 24, 3510);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file, 109, 20, 3391);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "drag");
			add_location(div0, file, 102, 16, 3029);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file, 113, 16, 3624);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "data-title", div2_data_title_value = /*data*/ ctx[8].title);
			attr_dev(div2, "class", "drag-resize cursor_move dragable ui-draggable ui-resizable");
			attr_dev(div2, "tabindex", "0");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			set_style(div2, "border", /*data*/ ctx[8].border);
			set_style(div2, "background-color", /*data*/ ctx[8].backgroundColor);
			set_style(div2, "background-image", /*data*/ ctx[8].backgroundImage);
			attr_dev(div2, "aria-disabled", "false");
			add_location(div2, file, 83, 12, 2266);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*drag_value*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].text ? /*data*/ ctx[8].text : '') + "")) set_data_dev(t0, t0_value);

			if (dirty & /*drag_value*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*drag_value*/ 8 && div2_data_title_value !== (div2_data_title_value = /*data*/ ctx[8].title)) {
				attr_dev(div2, "data-title", div2_data_title_value);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "border", /*data*/ ctx[8].border);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "background-color", /*data*/ ctx[8].backgroundColor);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "background-image", /*data*/ ctx[8].backgroundImage);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(83:8) {#each drag_value as data, index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;
	let if_block = /*drag_value*/ ctx[3] && /*drag_value*/ ctx[3].length > 0 && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*drag_value*/ ctx[3] && /*drag_value*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function validColor(_bgcolor, _invisible) {
	if (_invisible == "1") {
		return "";
	} else if (_bgcolor) {
		return _bgcolor;
	} else {
		return "#CCFFCC";
	}
}

// function used for getting the valid border color
function validBorderColor(_bordercolor) {
	if (_bordercolor) {
		return "1px solid " + _bordercolor;
	} else {
		return "";
	}
}

// function used for getting the background image
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

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Drag', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let drag = modules;
	let drag_value = [];
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Drag> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("drag", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("drag", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		drag,
		drag_value,
		validColor,
		validBorderColor,
		bgImage
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('drag' in $$props) $$invalidate(5, drag = $$props.drag);
		if ('drag_value' in $$props) $$invalidate(3, drag_value = $$props.drag_value);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, drag, drag_value*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, drag = []);
					$$invalidate(5, drag[0] = modules, drag);
				} else {
					$$invalidate(5, drag = modules);
				}

				$$invalidate(3, drag_value = []);

				drag.map(function (data) {
					$$invalidate(3, drag_value = [
						...drag_value,
						{
							id: data._id,
							title: data.title,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							border: validBorderColor(data._border_color),
							backgroundColor: validColor(data._bgcolor, data._invisible),
							backgroundImage: data._image
							? "url('" + bgImage(data._image) + "')"
							: "none",
							text: data._value
						}
					]);
				});
			} else {
				$$invalidate(3, drag_value = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		drag_value,
		modules,
		drag,
		click_handler,
		click_handler_1
	];
}

class Drag extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Drag",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Drag> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Drag> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Drag> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Drop.svelte generated by Svelte v3.40.2 */

const file$1 = "clsSMDragNDrop\\libs\\authoring\\Drop.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (66:0) {#if drop_data && drop_data.length > 0}
function create_if_block$1(ctx) {
	let div;
	let div_key_value;
	let each_value = /*drop_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "drop_" + /*index*/ ctx[2] + /*drop_data*/ ctx[3].length);
			add_location(div, file$1, 66, 4, 1760);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drop_data, deleteElem, elemModal*/ 11) {
				each_value = /*drop_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, drop_data*/ 12 && div_key_value !== (div_key_value = "drop_" + /*index*/ ctx[2] + /*drop_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(66:0) {#if drop_data && drop_data.length > 0}",
		ctx
	});

	return block;
}

// (68:8) {#each drop_data as data, index}
function create_each_block$1(ctx) {
	let div2;
	let p;
	let t0_value = (/*data*/ ctx[8].caption ? /*data*/ ctx[8].caption : '') + "";
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let div2_data_title_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			add_location(p, file$1, 84, 16, 2462);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$1, 90, 24, 2795);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$1, 89, 20, 2651);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$1, 93, 24, 3018);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "id", "editButton");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$1, 92, 20, 2883);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "drop");
			add_location(div0, file$1, 85, 16, 2521);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$1, 96, 16, 3132);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "data-title", div2_data_title_value = /*data*/ ctx[8].title);
			attr_dev(div2, "tabindex", "0");
			attr_dev(div2, "class", "drag-resize cursor_move dropable ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			set_style(div2, "border", /*data*/ ctx[8].border);
			set_style(div2, "background-color", /*data*/ ctx[8].bgcolor);
			add_location(div2, file$1, 68, 12, 1862);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*drop_data*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].caption ? /*data*/ ctx[8].caption : '') + "")) set_data_dev(t0, t0_value);

			if (dirty & /*drop_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*drop_data*/ 8 && div2_data_title_value !== (div2_data_title_value = /*data*/ ctx[8].title)) {
				attr_dev(div2, "data-title", div2_data_title_value);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "border", /*data*/ ctx[8].border);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "background-color", /*data*/ ctx[8].bgcolor);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(68:8) {#each drop_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let if_block_anchor;
	let if_block = /*drop_data*/ ctx[3] && /*drop_data*/ ctx[3].length > 0 && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*drop_data*/ ctx[3] && /*drop_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function validColor$1(_bgcolor, _invisible) {
	if (_invisible == "1") {
		return "";
	} else if (_bgcolor) {
		return _bgcolor;
	} else {
		return "#FFFFCC";
	}
}

// function used for getting the valid border color
function validBorderColor$1(_bordercolor) {
	if (_bordercolor) {
		return "1px solid " + _bordercolor;
	} else {
		return "";
	}
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Drop', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let drop_auth = modules;
	let drop_data = [];
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Drop> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("drop", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("drop", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		drop_auth,
		drop_data,
		validColor: validColor$1,
		validBorderColor: validBorderColor$1
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('drop_auth' in $$props) $$invalidate(5, drop_auth = $$props.drop_auth);
		if ('drop_data' in $$props) $$invalidate(3, drop_data = $$props.drop_data);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, drop_auth, drop_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, drop_auth = []);
					$$invalidate(5, drop_auth[0] = modules, drop_auth);
				} else {
					$$invalidate(5, drop_auth = modules);
				}

				$$invalidate(3, drop_data = []);

				drop_auth.map(function (data) {
					$$invalidate(3, drop_data = [
						...drop_data,
						{
							id: data._id,
							caption: data._value,
							title: data.title,
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
				$$invalidate(3, drop_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		drop_data,
		modules,
		drop_auth,
		click_handler,
		click_handler_1
	];
}

class Drop extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Drop",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Drop> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Drop> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Drop> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Radio.svelte generated by Svelte v3.40.2 */

const file$2 = "clsSMDragNDrop\\libs\\authoring\\Radio.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (43:0) {#if radio_data && radio_data.length > 0}
function create_if_block$2(ctx) {
	let div;
	let div_key_value;
	let each_value = /*radio_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "radio_" + /*index*/ ctx[2] + /*radio_data*/ ctx[3].length);
			add_location(div, file$2, 43, 4, 1140);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*radio_data, deleteElem, elemModal*/ 11) {
				each_value = /*radio_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, radio_data*/ 12 && div_key_value !== (div_key_value = "radio_" + /*index*/ ctx[2] + /*radio_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(43:0) {#if radio_data && radio_data.length > 0}",
		ctx
	});

	return block;
}

// (45:8) {#each radio_data as data, index}
function create_each_block$2(ctx) {
	let div2;
	let input;
	let input_data_id_value;
	let input_id_value;
	let input_class_value;
	let input_data_title_value;
	let input_name_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(input, "type", "radio");
			attr_dev(input, "data-id", input_data_id_value = /*data*/ ctx[8].id);
			attr_dev(input, "id", input_id_value = /*data*/ ctx[8].id);
			attr_dev(input, "class", input_class_value = /*data*/ ctx[8].id + " elem dndradio");
			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[8].id);
			attr_dev(input, "name", input_name_value = /*data*/ ctx[8].name);
			input.value = "0";
			add_location(input, file$2, 57, 16, 1680);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$2, 71, 24, 2277);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$2, 70, 20, 2132);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$2, 74, 24, 2485);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$2, 73, 20, 2365);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "radio");
			add_location(div0, file$2, 66, 16, 2002);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$2, 77, 16, 2599);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "only-dragable drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$2, 45, 12, 1245);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, input);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*radio_data*/ 8 && input_data_id_value !== (input_data_id_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "data-id", input_data_id_value);
			}

			if (dirty & /*radio_data*/ 8 && input_id_value !== (input_id_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*radio_data*/ 8 && input_class_value !== (input_class_value = /*data*/ ctx[8].id + " elem dndradio")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*radio_data*/ 8 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "data-title", input_data_title_value);
			}

			if (dirty & /*radio_data*/ 8 && input_name_value !== (input_name_value = /*data*/ ctx[8].name)) {
				attr_dev(input, "name", input_name_value);
			}

			if (dirty & /*radio_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(45:8) {#each radio_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let if_block_anchor;
	let if_block = /*radio_data*/ ctx[3] && /*radio_data*/ ctx[3].length > 0 && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*radio_data*/ ctx[3] && /*radio_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Radio', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let radio_data = [];
	let radio = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Radio> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("radio", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("radio", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		radio_data,
		radio
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('radio_data' in $$props) $$invalidate(3, radio_data = $$props.radio_data);
		if ('radio' in $$props) $$invalidate(5, radio = $$props.radio);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, radio, radio_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, radio = []);
					$$invalidate(5, radio[0] = modules, radio);
				} else {
					$$invalidate(5, radio = modules);
				}

				$$invalidate(3, radio_data = []);

				radio.map(function (data) {
					$$invalidate(3, radio_data = [
						...radio_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							name: data._name
						}
					]);
				});
			} else {
				$$invalidate(3, radio_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		radio_data,
		modules,
		radio,
		click_handler,
		click_handler_1
	];
}

class Radio extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Radio",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Radio> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Radio> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Radio> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Select.svelte generated by Svelte v3.40.2 */

const file$3 = "clsSMDragNDrop\\libs\\authoring\\Select.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	return child_ctx;
}

// (73:0) {#if select_data && select_data.length > 0}
function create_if_block$3(ctx) {
	let div;
	let div_key_value;
	let each_value = /*select_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "select_" + /*index*/ ctx[2] + /*select_data*/ ctx[3].length);
			add_location(div, file$3, 73, 4, 2332);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data, deleteElem, elemModal*/ 11) {
				each_value = /*select_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, select_data*/ 12 && div_key_value !== (div_key_value = "select_" + /*index*/ ctx[2] + /*select_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(73:0) {#if select_data && select_data.length > 0}",
		ctx
	});

	return block;
}

// (100:20) {:else}
function create_else_block_1(ctx) {
	let option;

	const block = {
		c: function create() {
			option = element("option");
			option.textContent = "Please Select";
			option.__value = "Please Select";
			option.value = option.__value;
			add_location(option, file$3, 100, 24, 3723);
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
		source: "(100:20) {:else}",
		ctx
	});

	return block;
}

// (92:20) {#if data.select.length}
function create_if_block_1(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[8].select;
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
			if (dirty & /*select_data*/ 8) {
				each_value_1 = /*data*/ ctx[8].select;
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
		id: create_if_block_1.name,
		type: "if",
		source: "(92:20) {#if data.select.length}",
		ctx
	});

	return block;
}

// (96:28) {:else}
function create_else_block(ctx) {
	let option;
	let t_value = /*option*/ ctx[10].text + "";
	let t;
	let option_key_value;
	let option_data_correctans_value;
	let option_data_defaultans_value;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			attr_dev(option, "key", option_key_value = /*option*/ ctx[10].key);
			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[10].correctans);
			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[10].defaultans);
			attr_dev(option, "data-userans", "");
			option.__value = option_value_value = /*option*/ ctx[10].key + 1;
			option.value = option.__value;
			add_location(option, file$3, 96, 32, 3442);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 8 && t_value !== (t_value = /*option*/ ctx[10].text + "")) set_data_dev(t, t_value);

			if (dirty & /*select_data*/ 8 && option_key_value !== (option_key_value = /*option*/ ctx[10].key)) {
				attr_dev(option, "key", option_key_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[10].correctans)) {
				attr_dev(option, "data-correctans", option_data_correctans_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[10].defaultans)) {
				attr_dev(option, "data-defaultans", option_data_defaultans_value);
			}

			if (dirty & /*select_data*/ 8 && option_value_value !== (option_value_value = /*option*/ ctx[10].key + 1)) {
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
		source: "(96:28) {:else}",
		ctx
	});

	return block;
}

// (94:28) {#if option.selected == 1}
function create_if_block_2(ctx) {
	let option;
	let t_value = /*option*/ ctx[10].text + "";
	let t;
	let option_key_value;
	let option_data_correctans_value;
	let option_data_defaultans_value;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.selected = "selected";
			attr_dev(option, "key", option_key_value = /*option*/ ctx[10].key);
			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[10].correctans);
			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[10].defaultans);
			attr_dev(option, "data-userans", "");
			option.__value = option_value_value = /*option*/ ctx[10].key + 1;
			option.value = option.__value;
			add_location(option, file$3, 94, 32, 3193);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 8 && t_value !== (t_value = /*option*/ ctx[10].text + "")) set_data_dev(t, t_value);

			if (dirty & /*select_data*/ 8 && option_key_value !== (option_key_value = /*option*/ ctx[10].key)) {
				attr_dev(option, "key", option_key_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[10].correctans)) {
				attr_dev(option, "data-correctans", option_data_correctans_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[10].defaultans)) {
				attr_dev(option, "data-defaultans", option_data_defaultans_value);
			}

			if (dirty & /*select_data*/ 8 && option_value_value !== (option_value_value = /*option*/ ctx[10].key + 1)) {
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
		source: "(94:28) {#if option.selected == 1}",
		ctx
	});

	return block;
}

// (93:24) {#each data.select as option}
function create_each_block_1(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*option*/ ctx[10].selected == 1) return create_if_block_2;
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
		source: "(93:24) {#each data.select as option}",
		ctx
	});

	return block;
}

// (75:8) {#each select_data as data, index}
function create_each_block$3(ctx) {
	let div2;
	let select_1;
	let select_1_class_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*data*/ ctx[8].select.length) return create_if_block_1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			select_1 = element("select");
			if_block.c();
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(select_1, "class", select_1_class_value = /*data*/ ctx[8].id + " elem dnd_select min_height_0");
			select_1.disabled = "disabled";
			add_location(select_1, file$3, 87, 16, 2861);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$3, 108, 24, 4106);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$3, 107, 20, 3958);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$3, 111, 24, 4317);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$3, 110, 20, 4194);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "dropdown");
			add_location(div0, file$3, 103, 16, 3825);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$3, 114, 16, 4431);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$3, 75, 12, 2440);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, select_1);
			if_block.m(select_1, null);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

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

			if (dirty & /*select_data*/ 8 && select_1_class_value !== (select_1_class_value = /*data*/ ctx[8].id + " elem dnd_select min_height_0")) {
				attr_dev(select_1, "class", select_1_class_value);
			}

			if (dirty & /*select_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(75:8) {#each select_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let if_block_anchor;
	let if_block = /*select_data*/ ctx[3] && /*select_data*/ ctx[3].length > 0 && create_if_block$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*select_data*/ ctx[3] && /*select_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots('Select', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let select_data = [];
	let select = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("dropdown", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("dropdown", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		select_data,
		select
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('select_data' in $$props) $$invalidate(3, select_data = $$props.select_data);
		if ('select' in $$props) $$invalidate(5, select = $$props.select);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, select, select_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, select = []);
					$$invalidate(5, select[0] = modules, select);
				} else {
					$$invalidate(5, select = modules);
				}

				$$invalidate(3, select_data = []);

				select.map(function (data) {
					let option = [];

					if (data.__text) {
						data.__text.split("\n").map(function (option_data, index) {
							if (option_data.trim().charAt(0) == "+") {
								option.push({
									key: index,
									correctans: 0,
									defaultans: 1,
									text: option_data.trim().slice(1),
									selected: 1
								});
							} else if (option_data.trim().charAt(0) == "*") {
								option.push({
									key: index,
									correctans: 1,
									defaultans: 0,
									text: option_data.trim().slice(1)
								});
							} else {
								option.push({
									key: index,
									correctans: 0,
									defaultans: 0,
									text: option_data.trim()
								});
							}
						});
					}

					$$invalidate(3, select_data = [
						...select_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							select: option
						}
					]);
				});
			} else {
				$$invalidate(3, select_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		select_data,
		modules,
		select,
		click_handler,
		click_handler_1
	];
}

class Select extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Select",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Select> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Select> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Select> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Textbox.svelte generated by Svelte v3.40.2 */

const file$4 = "clsSMDragNDrop\\libs\\authoring\\Textbox.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (36:0) {#if textbox_data && textbox_data.length > 0}
function create_if_block$4(ctx) {
	let div;
	let div_key_value;
	let each_value = /*textbox_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "textbox_" + /*index*/ ctx[2] + /*textbox_data*/ ctx[3].length);
			add_location(div, file$4, 36, 4, 860);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*textbox_data, deleteElem, elemModal*/ 11) {
				each_value = /*textbox_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, textbox_data*/ 12 && div_key_value !== (div_key_value = "textbox_" + /*index*/ ctx[2] + /*textbox_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(36:0) {#if textbox_data && textbox_data.length > 0}",
		ctx
	});

	return block;
}

// (38:8) {#each textbox_data as data, index}
function create_each_block$4(ctx) {
	let div2;
	let input;
	let input_type_value;
	let input_id_value;
	let input_class_value;
	let input_value_value;
	let input_placeholder_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(input, "type", input_type_value = /*data*/ ctx[8]._type);
			attr_dev(input, "id", input_id_value = /*data*/ ctx[8]._id);
			attr_dev(input, "class", input_class_value = /*data*/ ctx[8]._id + " elem dnd_textbox form-control min_height_0");
			attr_dev(input, "name", "");

			input.value = input_value_value = /*data*/ ctx[8]._defaultans
			? /*data*/ ctx[8]._defaultans
			: '';

			attr_dev(input, "placeholder", input_placeholder_value = /*data*/ ctx[8]._placeholder
			? /*data*/ ctx[8]._placeholder
			: "");

			add_location(input, file$4, 50, 16, 1407);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$4, 63, 24, 2075);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$4, 62, 20, 1929);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$4, 66, 24, 2284);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$4, 65, 20, 2163);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "input");
			add_location(div0, file$4, 58, 16, 1799);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$4, 69, 16, 2398);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8]._id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8]._top + "px");
			set_style(div2, "left", /*data*/ ctx[8]._left + "px");
			set_style(div2, "height", /*data*/ ctx[8]._height + "px");
			set_style(div2, "width", /*data*/ ctx[8]._width + "px");
			add_location(div2, file$4, 38, 12, 971);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, input);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*textbox_data*/ 8 && input_type_value !== (input_type_value = /*data*/ ctx[8]._type)) {
				attr_dev(input, "type", input_type_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_id_value !== (input_id_value = /*data*/ ctx[8]._id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_class_value !== (input_class_value = /*data*/ ctx[8]._id + " elem dnd_textbox form-control min_height_0")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_value_value !== (input_value_value = /*data*/ ctx[8]._defaultans
			? /*data*/ ctx[8]._defaultans
			: '') && input.value !== input_value_value) {
				prop_dev(input, "value", input_value_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_placeholder_value !== (input_placeholder_value = /*data*/ ctx[8]._placeholder
			? /*data*/ ctx[8]._placeholder
			: "")) {
				attr_dev(input, "placeholder", input_placeholder_value);
			}

			if (dirty & /*textbox_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8]._id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8]._top + "px");
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8]._left + "px");
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8]._height + "px");
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8]._width + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(38:8) {#each textbox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let if_block_anchor;
	let if_block = /*textbox_data*/ ctx[3] && /*textbox_data*/ ctx[3].length > 0 && create_if_block$4(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*textbox_data*/ ctx[3] && /*textbox_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots('Textbox', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let textbox_data = [];
	let textbox = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Textbox> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("input", event.currentTarget, data._id);
	const click_handler_1 = data => deleteElem("input", data._id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		textbox_data,
		textbox
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('textbox_data' in $$props) $$invalidate(3, textbox_data = $$props.textbox_data);
		if ('textbox' in $$props) $$invalidate(5, textbox = $$props.textbox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, textbox, textbox_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, textbox = []);
					$$invalidate(5, textbox[0] = modules, textbox);
				} else {
					$$invalidate(5, textbox = modules);
				}

				$$invalidate(3, textbox_data = []);

				textbox.map(function (data) {
					$$invalidate(3, textbox_data = [...textbox_data, data]);
				});
			} else {
				$$invalidate(3, textbox_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		textbox_data,
		modules,
		textbox,
		click_handler,
		click_handler_1
	];
}

class Textbox extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Textbox",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Textbox> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Textbox> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Textbox> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Multilinebox.svelte generated by Svelte v3.40.2 */

const file$5 = "clsSMDragNDrop\\libs\\authoring\\Multilinebox.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (40:0) {#if multilinebox_data && multilinebox_data.length > 0}
function create_if_block$5(ctx) {
	let div;
	let div_key_value;
	let each_value = /*multilinebox_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "multilinebox_" + /*index*/ ctx[2] + /*multilinebox_data*/ ctx[3].length);
			add_location(div, file$5, 40, 1, 1198);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*multilinebox_data, deleteElem, elemModal*/ 11) {
				each_value = /*multilinebox_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, multilinebox_data*/ 12 && div_key_value !== (div_key_value = "multilinebox_" + /*index*/ ctx[2] + /*multilinebox_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(40:0) {#if multilinebox_data && multilinebox_data.length > 0}",
		ctx
	});

	return block;
}

// (42:8) {#each multilinebox_data as data, index}
function create_each_block$5(ctx) {
	let div2;
	let textarea;
	let textarea_class_value;
	let textarea_data_title_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			textarea = element("textarea");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(textarea, "class", textarea_class_value = /*data*/ ctx[8].id + " elem dnd_textarea form-control min_height_0");
			attr_dev(textarea, "data-title", textarea_data_title_value = /*data*/ ctx[8].id);
			add_location(textarea, file$5, 54, 16, 1760);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$5, 63, 24, 2228);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$5, 62, 20, 2079);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$5, 66, 24, 2440);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$5, 65, 20, 2316);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "multiline");
			add_location(div0, file$5, 58, 16, 1945);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$5, 69, 16, 2554);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$5, 42, 12, 1324);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, textarea);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*multilinebox_data*/ 8 && textarea_class_value !== (textarea_class_value = /*data*/ ctx[8].id + " elem dnd_textarea form-control min_height_0")) {
				attr_dev(textarea, "class", textarea_class_value);
			}

			if (dirty & /*multilinebox_data*/ 8 && textarea_data_title_value !== (textarea_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(textarea, "data-title", textarea_data_title_value);
			}

			if (dirty & /*multilinebox_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(42:8) {#each multilinebox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let if_block = /*multilinebox_data*/ ctx[3] && /*multilinebox_data*/ ctx[3].length > 0 && create_if_block$5(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*multilinebox_data*/ ctx[3] && /*multilinebox_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Multilinebox', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let multilinebox_data = [];
	let multilinebox_preview = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Multilinebox> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("multiline", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("multiline", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		multilinebox_data,
		multilinebox_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('multilinebox_data' in $$props) $$invalidate(3, multilinebox_data = $$props.multilinebox_data);
		if ('multilinebox_preview' in $$props) $$invalidate(5, multilinebox_preview = $$props.multilinebox_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, multilinebox_preview, multilinebox_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, multilinebox_preview = []);
					$$invalidate(5, multilinebox_preview[0] = modules, multilinebox_preview);
				} else {
					$$invalidate(5, multilinebox_preview = modules);
				}

				$$invalidate(3, multilinebox_data = []);

				multilinebox_preview.map(function (data) {
					$$invalidate(3, multilinebox_data = [
						...multilinebox_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px"
						}
					]);
				});
			} else {
				$$invalidate(3, multilinebox_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		multilinebox_data,
		modules,
		multilinebox_preview,
		click_handler,
		click_handler_1
	];
}

class Multilinebox extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Multilinebox",
			options,
			id: create_fragment$5.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Multilinebox> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Multilinebox> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Multilinebox> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Checkbox.svelte generated by Svelte v3.40.2 */

const file$6 = "clsSMDragNDrop\\libs\\authoring\\Checkbox.svelte";

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (42:0) {#if checkbox_data.length > 0}
function create_if_block$6(ctx) {
	let div;
	let div_key_value;
	let each_value = /*checkbox_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "checkbox_" + /*index*/ ctx[2] + /*checkbox_data*/ ctx[3].length);
			add_location(div, file$6, 42, 4, 1132);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*checkbox_data, deleteElem, elemModal*/ 11) {
				each_value = /*checkbox_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, checkbox_data*/ 12 && div_key_value !== (div_key_value = "checkbox_" + /*index*/ ctx[2] + /*checkbox_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(42:0) {#if checkbox_data.length > 0}",
		ctx
	});

	return block;
}

// (44:8) {#each checkbox_data as data, index}
function create_each_block$6(ctx) {
	let div2;
	let input;
	let input_class_value;
	let input_data_title_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", input_class_value = /*data*/ ctx[8].id + " elem dndcheckbox");
			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[8].id);
			add_location(input, file$6, 56, 16, 1666);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$6, 66, 24, 2131);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$6, 65, 20, 1983);
			attr_dev(i1, "class", "icomoon-24px-delete-1");
			add_location(i1, file$6, 69, 24, 2342);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$6, 68, 20, 2219);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "checkbox");
			add_location(div0, file$6, 61, 16, 1850);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$6, 72, 16, 2452);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$6, 44, 12, 1246);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, input);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*checkbox_data*/ 8 && input_class_value !== (input_class_value = /*data*/ ctx[8].id + " elem dndcheckbox")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*checkbox_data*/ 8 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "data-title", input_data_title_value);
			}

			if (dirty & /*checkbox_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(44:8) {#each checkbox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let if_block_anchor;
	let if_block = /*checkbox_data*/ ctx[3].length > 0 && create_if_block$6(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*checkbox_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots('Checkbox', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let checkbox_data = [];
	let checkbox = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Checkbox> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("checkbox", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("checkbox", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		checkbox_data,
		checkbox
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkbox_data' in $$props) $$invalidate(3, checkbox_data = $$props.checkbox_data);
		if ('checkbox' in $$props) $$invalidate(5, checkbox = $$props.checkbox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, checkbox, checkbox_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, checkbox = []);
					$$invalidate(5, checkbox[0] = modules, checkbox);
				} else {
					$$invalidate(5, checkbox = modules);
				}

				$$invalidate(3, checkbox_data = []);

				checkbox.map(function (data) {
					$$invalidate(3, checkbox_data = [
						...checkbox_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id
						}
					]);
				});
			} else {
				$$invalidate(3, checkbox_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		checkbox_data,
		modules,
		checkbox,
		click_handler,
		click_handler_1
	];
}

class Checkbox extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Checkbox",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Checkbox> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Checkbox> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Checkbox> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Button.svelte generated by Svelte v3.40.2 */

const file$7 = "clsSMDragNDrop\\libs\\authoring\\Button.svelte";

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (45:0) {#if button_preview_data && button_preview_data.length > 0}
function create_if_block$7(ctx) {
	let div;
	let div_key_value;
	let each_value = /*button_preview_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "button_" + /*index*/ ctx[2] + /*button_preview_data*/ ctx[3].length);
			add_location(div, file$7, 45, 4, 1265);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*button_preview_data, deleteElem, elemModal*/ 11) {
				each_value = /*button_preview_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, button_preview_data*/ 12 && div_key_value !== (div_key_value = "button_" + /*index*/ ctx[2] + /*button_preview_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(45:0) {#if button_preview_data && button_preview_data.length > 0}",
		ctx
	});

	return block;
}

// (47:8) {#each button_preview_data as data, index}
function create_each_block$7(ctx) {
	let div2;
	let button0;
	let t0_value = (/*data*/ ctx[8].value ? /*data*/ ctx[8].value : '') + "";
	let t0;
	let button0_class_value;
	let button0_data_title_value;
	let t1;
	let div0;
	let button1;
	let i0;
	let t2;
	let button2;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			button0 = element("button");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button1 = element("button");
			i0 = element("i");
			t2 = space();
			button2 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", button0_class_value = /*data*/ ctx[8].id + " elem dnd_button");
			attr_dev(button0, "data-title", button0_data_title_value = /*data*/ ctx[8].id);
			add_location(button0, file$7, 59, 16, 1809);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$7, 71, 24, 2346);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$7, 70, 20, 2200);
			attr_dev(i1, "class", "icomoon-24px-delete-1");
			add_location(i1, file$7, 74, 24, 2555);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light p-sm");
			add_location(button2, file$7, 73, 20, 2434);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "button");
			add_location(div0, file$7, 66, 16, 2069);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$7, 77, 16, 2665);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$7, 47, 12, 1389);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, button0);
			append_dev(button0, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button1);
			append_dev(button1, i0);
			append_dev(div0, t2);
			append_dev(div0, button2);
			append_dev(button2, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button1, "click", click_handler, false, false, false),
					listen_dev(button2, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*button_preview_data*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].value ? /*data*/ ctx[8].value : '') + "")) set_data_dev(t0, t0_value);

			if (dirty & /*button_preview_data*/ 8 && button0_class_value !== (button0_class_value = /*data*/ ctx[8].id + " elem dnd_button")) {
				attr_dev(button0, "class", button0_class_value);
			}

			if (dirty & /*button_preview_data*/ 8 && button0_data_title_value !== (button0_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(button0, "data-title", button0_data_title_value);
			}

			if (dirty & /*button_preview_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$7.name,
		type: "each",
		source: "(47:8) {#each button_preview_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let if_block_anchor;
	let if_block = /*button_preview_data*/ ctx[3] && /*button_preview_data*/ ctx[3].length > 0 && create_if_block$7(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*button_preview_data*/ ctx[3] && /*button_preview_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$7(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance$7($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Button', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let button_preview_data = [];
	let button_preview = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("button", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("button", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		button_preview_data,
		button_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('button_preview_data' in $$props) $$invalidate(3, button_preview_data = $$props.button_preview_data);
		if ('button_preview' in $$props) $$invalidate(5, button_preview = $$props.button_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, button_preview, button_preview_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, button_preview = []);
					$$invalidate(5, button_preview[0] = modules, button_preview);
				} else {
					$$invalidate(5, button_preview = modules);
				}

				$$invalidate(3, button_preview_data = []);

				button_preview.map(function (data) {
					$$invalidate(3, button_preview_data = [
						...button_preview_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id,
							value: data._value
						}
					]);
				});
			} else {
				$$invalidate(3, button_preview_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		button_preview_data,
		modules,
		button_preview,
		click_handler,
		click_handler_1
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$7.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Button> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Button> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Button> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Tabhead.svelte generated by Svelte v3.40.2 */

const file$8 = "clsSMDragNDrop\\libs\\authoring\\Tabhead.svelte";

function get_each_context$8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (44:0) {#if tabhead_data && tabhead_data.length > 0}
function create_if_block$8(ctx) {
	let div;
	let div_key_value;
	let each_value = /*tabhead_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "tabhead_" + /*index*/ ctx[2] + /*tabhead_data*/ ctx[3].length);
			add_location(div, file$8, 44, 4, 1225);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tabhead_data, deleteElem, elemModal*/ 11) {
				each_value = /*tabhead_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$8(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, tabhead_data*/ 12 && div_key_value !== (div_key_value = "tabhead_" + /*index*/ ctx[2] + /*tabhead_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(44:0) {#if tabhead_data && tabhead_data.length > 0}",
		ctx
	});

	return block;
}

// (46:8) {#each tabhead_data as data, index}
function create_each_block$8(ctx) {
	let div1;
	let div0;
	let button0;
	let i0;
	let t0;
	let button1;
	let i1;
	let t1;
	let div1_key_value;
	let div1_id_value;
	let div1_data_title_value;
	let div1_class_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t0 = space();
			button1 = element("button");
			i1 = element("i");
			t1 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$8, 65, 20, 2037);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$8, 64, 16, 1894);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$8, 68, 20, 2235);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$8, 67, 16, 2117);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "tabhead");
			add_location(div0, file$8, 60, 12, 1778);
			attr_dev(div1, "key", div1_key_value = /*index*/ ctx[2]);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[8].id);
			attr_dev(div1, "data-title", div1_data_title_value = /*data*/ ctx[8].id);
			attr_dev(div1, "data-type", "tabhead");
			attr_dev(div1, "class", div1_class_value = /*data*/ ctx[8].classes);
			set_style(div1, "position", "absolute");
			set_style(div1, "top", /*data*/ ctx[8].top);
			set_style(div1, "left", /*data*/ ctx[8].left);
			set_style(div1, "height", /*data*/ ctx[8].height);
			set_style(div1, "width", /*data*/ ctx[8].width);
			add_location(div1, file$8, 46, 12, 1336);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div1, t1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*tabhead_data*/ 8 && div1_id_value !== (div1_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div1, "id", div1_id_value);
			}

			if (dirty & /*tabhead_data*/ 8 && div1_data_title_value !== (div1_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(div1, "data-title", div1_data_title_value);
			}

			if (dirty & /*tabhead_data*/ 8 && div1_class_value !== (div1_class_value = /*data*/ ctx[8].classes)) {
				attr_dev(div1, "class", div1_class_value);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$8.name,
		type: "each",
		source: "(46:8) {#each tabhead_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let if_block_anchor;
	let if_block = /*tabhead_data*/ ctx[3] && /*tabhead_data*/ ctx[3].length > 0 && create_if_block$8(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*tabhead_data*/ ctx[3] && /*tabhead_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$8(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Tabhead', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let tabhead_data = [];
	let tabhead = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabhead> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("tabhead", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("tabhead", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		tabhead_data,
		tabhead
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('tabhead_data' in $$props) $$invalidate(3, tabhead_data = $$props.tabhead_data);
		if ('tabhead' in $$props) $$invalidate(5, tabhead = $$props.tabhead);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, tabhead, tabhead_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, tabhead = []);
					$$invalidate(5, tabhead[0] = modules, tabhead);
				} else {
					$$invalidate(5, tabhead = modules);
				}

				$$invalidate(3, tabhead_data = []);

				tabhead.map(function (data) {
					$$invalidate(3, tabhead_data = [
						...tabhead_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id,
							classes: "drag-resize cursor_move ui-draggable dndtabhead ui-resizable"
						}
					]);
				});
			} else {
				$$invalidate(3, tabhead_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		tabhead_data,
		modules,
		tabhead,
		click_handler,
		click_handler_1
	];
}

class Tabhead extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tabhead",
			options,
			id: create_fragment$8.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Tabhead> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Tabhead> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Tabhead> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Img.svelte generated by Svelte v3.40.2 */

const file$9 = "clsSMDragNDrop\\libs\\authoring\\Img.svelte";

function get_each_context$9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (43:0) {#if img_data && img_data.length > 0}
function create_if_block$9(ctx) {
	let div;
	let div_key_value;
	let each_value = /*img_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "img_" + /*index*/ ctx[2] + /*img_data*/ ctx[3].length);
			add_location(div, file$9, 43, 4, 1112);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*img_data, deleteElem, elemModal*/ 11) {
				each_value = /*img_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$9(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$9(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, img_data*/ 12 && div_key_value !== (div_key_value = "img_" + /*index*/ ctx[2] + /*img_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(43:0) {#if img_data && img_data.length > 0}",
		ctx
	});

	return block;
}

// (45:8) {#each img_data as data, index}
function create_each_block$9(ctx) {
	let div2;
	let img_1;
	let img_1_src_value;
	let img_1_class_value;
	let img_1_data_title_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			img_1 = element("img");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			if (!src_url_equal(img_1.src, img_1_src_value = /*data*/ ctx[8].src)) attr_dev(img_1, "src", img_1_src_value);
			attr_dev(img_1, "class", img_1_class_value = /*data*/ ctx[8]._id + " elem dnd_img");
			attr_dev(img_1, "data-title", img_1_data_title_value = /*data*/ ctx[8].id);
			attr_dev(img_1, "style", "display : inline;");
			attr_dev(img_1, "alt", "");
			add_location(img_1, file$9, 57, 16, 1620);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$9, 69, 24, 2143);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$9, 68, 20, 2000);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$9, 72, 24, 2349);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$9, 71, 20, 2231);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "img");
			add_location(div0, file$9, 64, 16, 1872);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$9, 75, 16, 2463);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$9, 45, 12, 1211);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, img_1);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*img_data*/ 8 && !src_url_equal(img_1.src, img_1_src_value = /*data*/ ctx[8].src)) {
				attr_dev(img_1, "src", img_1_src_value);
			}

			if (dirty & /*img_data*/ 8 && img_1_class_value !== (img_1_class_value = /*data*/ ctx[8]._id + " elem dnd_img")) {
				attr_dev(img_1, "class", img_1_class_value);
			}

			if (dirty & /*img_data*/ 8 && img_1_data_title_value !== (img_1_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(img_1, "data-title", img_1_data_title_value);
			}

			if (dirty & /*img_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$9.name,
		type: "each",
		source: "(45:8) {#each img_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let if_block_anchor;
	let if_block = /*img_data*/ ctx[3] && /*img_data*/ ctx[3].length > 0 && create_if_block$9(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*img_data*/ ctx[3] && /*img_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$9(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance$9($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Img', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let img_data = [];
	let img = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Img> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("img", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("img", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		img_data,
		img
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('img_data' in $$props) $$invalidate(3, img_data = $$props.img_data);
		if ('img' in $$props) $$invalidate(5, img = $$props.img);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, img, img_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, img = []);
					$$invalidate(5, img[0] = modules, img);
				} else {
					$$invalidate(5, img = modules);
				}

				$$invalidate(3, img_data = []);

				img.map(function (data) {
					$$invalidate(3, img_data = [
						...img_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							src: data._bgimg
						}
					]);
				});
			} else {
				$$invalidate(3, img_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		img_data,
		modules,
		img,
		click_handler,
		click_handler_1
	];
}

class Img extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Img",
			options,
			id: create_fragment$9.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Img> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Img> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Img> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Label.svelte generated by Svelte v3.40.2 */

const file$a = "clsSMDragNDrop\\libs\\authoring\\Label.svelte";

function get_each_context$a(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (66:0) {#if label_preview_data && label_preview_data.length}
function create_if_block$a(ctx) {
	let div;
	let div_key_value;
	let each_value = /*label_preview_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "label_" + /*index*/ ctx[2] + /*label_preview_data*/ ctx[3].length);
			add_location(div, file$a, 66, 4, 2183);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label_preview_data, deleteElem, elemModal*/ 11) {
				each_value = /*label_preview_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$a(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$a(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, label_preview_data*/ 12 && div_key_value !== (div_key_value = "label_" + /*index*/ ctx[2] + /*label_preview_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(66:0) {#if label_preview_data && label_preview_data.length}",
		ctx
	});

	return block;
}

// (69:8) {#each label_preview_data as data, index}
function create_each_block$a(ctx) {
	let div2;
	let p;
	let t0_value = (/*data*/ ctx[8].parahtml ? /*data*/ ctx[8].parahtml : '') + "";
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let div2_class_value;
	let div2_style_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			add_location(p, file$a, 77, 16, 2566);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$a, 83, 24, 2902);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$a, 82, 20, 2757);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$a, 86, 24, 3110);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$a, 85, 20, 2990);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "label");
			add_location(div0, file$a, 78, 16, 2627);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$a, 89, 16, 3224);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", div2_class_value = /*data*/ ctx[8].classes);
			attr_dev(div2, "tabindex", "1");
			attr_dev(div2, "style", div2_style_value = /*data*/ ctx[8].style);
			add_location(div2, file$a, 70, 12, 2366);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*label_preview_data*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].parahtml ? /*data*/ ctx[8].parahtml : '') + "")) set_data_dev(t0, t0_value);

			if (dirty & /*label_preview_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*label_preview_data*/ 8 && div2_class_value !== (div2_class_value = /*data*/ ctx[8].classes)) {
				attr_dev(div2, "class", div2_class_value);
			}

			if (dirty & /*label_preview_data*/ 8 && div2_style_value !== (div2_style_value = /*data*/ ctx[8].style)) {
				attr_dev(div2, "style", div2_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$a.name,
		type: "each",
		source: "(69:8) {#each label_preview_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let if_block_anchor;
	let if_block = /*label_preview_data*/ ctx[3] && /*label_preview_data*/ ctx[3].length && create_if_block$a(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*label_preview_data*/ ctx[3] && /*label_preview_data*/ ctx[3].length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$a(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function changeStyletoString(data) {
	let style = '';

	for (let key in data) {
		style += key.replace(/_/g, '-') + ":" + data[key] + ";";
	}

	return style;
}

// function for setting the inner html
function setInnerHtml(htmlEnt) {
	return htmlEnt
	? htmlEnt.replace(/&#(\d+);/g, function (match, dec) {
			return String.fromCharCode(dec);
		})
	: "";
}

function instance$a($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Label', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let label_preview_data = [];
	let labelPreview = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Label> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("label", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("label", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		label_preview_data,
		labelPreview,
		changeStyletoString,
		setInnerHtml
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('label_preview_data' in $$props) $$invalidate(3, label_preview_data = $$props.label_preview_data);
		if ('labelPreview' in $$props) $$invalidate(5, labelPreview = $$props.labelPreview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, labelPreview, label_preview_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, labelPreview = []);
					$$invalidate(5, labelPreview[0] = modules, labelPreview);
				} else {
					$$invalidate(5, labelPreview = modules);
				}

				$$invalidate(3, label_preview_data = []);

				labelPreview.map(function (data) {
					let styling = changeStyletoString({
						position: 'absolute',
						top: data._top + "px",
						left: data._left + "px",
						height: data._height + "px",
						width: data._width + "px",
						border: data._border_size + "px solid " + data._border_color,
						background_color: data._background_color
					});

					$$invalidate(3, label_preview_data = [
						...label_preview_data,
						{
							id: data._id,
							style: styling,
							classes: "drag-resize cursor_move dndlabel ui-draggable ui-resizable " + (data._label_class ? data._label_class : ""),
							parahtml: data._richtext
							? setInnerHtml(data.__cdata)
							: data._title
						}
					]);
				});
			} else {
				$$invalidate(3, label_preview_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		label_preview_data,
		modules,
		labelPreview,
		click_handler,
		click_handler_1
	];
}

class Label extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Label",
			options,
			id: create_fragment$a.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Label> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Label> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Label> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Hotspot.svelte generated by Svelte v3.40.2 */

const file$b = "clsSMDragNDrop\\libs\\authoring\\Hotspot.svelte";

function get_each_context$b(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[15] = i;
	return child_ctx;
}

// (64:0) {#if hotspot_data && hotspot_data.length > 0}
function create_if_block$b(ctx) {
	let div;
	let div_key_value;
	let each_value = /*hotspot_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "hotspot_" + /*index*/ ctx[2] + /*hotspot_data*/ ctx[3].length);
			add_location(div, file$b, 64, 4, 1974);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data, elemModal, deleteElem*/ 11) {
				each_value = /*hotspot_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$b(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$b(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, hotspot_data*/ 12 && div_key_value !== (div_key_value = "hotspot_" + /*index*/ ctx[2] + /*hotspot_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$b.name,
		type: "if",
		source: "(64:0) {#if hotspot_data && hotspot_data.length > 0}",
		ctx
	});

	return block;
}

// (81:16) {#if data.bgimg}
function create_if_block_2$1(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			set_style(img, "display", "none");
			attr_dev(img, "alt", "hotspot");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[11].bgimg)) attr_dev(img, "src", img_src_value);
			add_location(img, file$b, 81, 20, 2663);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data*/ 8 && !src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[11].bgimg)) {
				attr_dev(img, "src", img_src_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(81:16) {#if data.bgimg}",
		ctx
	});

	return block;
}

// (84:16) {#if data.child.length > 0}
function create_if_block_1$1(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[11].child;
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
			if (dirty & /*hotspot_data, deleteElem, elemModal*/ 11) {
				each_value_1 = /*data*/ ctx[11].child;
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
		id: create_if_block_1$1.name,
		type: "if",
		source: "(84:16) {#if data.child.length > 0}",
		ctx
	});

	return block;
}

// (85:20) {#each data.child as child_data, child_index}
function create_each_block_1$1(ctx) {
	let div2;
	let div0;
	let button0;
	let i0;
	let t0;
	let button1;
	let i1;
	let t1;
	let div1;
	let t2;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[11], /*child_index*/ ctx[15], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[11], /*child_index*/ ctx[15]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t0 = space();
			button1 = element("button");
			i1 = element("i");
			t1 = space();
			div1 = element("div");
			t2 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$b, 103, 36, 3997);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$b, 102, 32, 3806);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$b, 106, 36, 4275);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$b, 105, 32, 4109);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "hotspot_click");
			add_location(div0, file$b, 98, 28, 3620);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$b, 109, 28, 4425);
			attr_dev(div2, "key", div2_key_value = /*child_index*/ ctx[15]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[11].id + "_" + (/*child_index*/ ctx[15] + 1));
			attr_dev(div2, "data-correctans", "0");
			attr_dev(div2, "class", "drag-resize hs_item ui-draggable cursor_move ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*child_data*/ ctx[13].top);
			set_style(div2, "left", /*child_data*/ ctx[13].left);
			set_style(div2, "height", /*child_data*/ ctx[13].height);
			set_style(div2, "width", /*child_data*/ ctx[13].width);
			add_location(div2, file$b, 85, 24, 2941);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div2, t2);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*hotspot_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[11].id + "_" + (/*child_index*/ ctx[15] + 1))) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "top", /*child_data*/ ctx[13].top);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "left", /*child_data*/ ctx[13].left);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "height", /*child_data*/ ctx[13].height);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "width", /*child_data*/ ctx[13].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(85:20) {#each data.child as child_data, child_index}",
		ctx
	});

	return block;
}

// (66:8) {#each hotspot_data as data, index}
function create_each_block$b(ctx) {
	let div2;
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let button2;
	let i2;
	let t4;
	let div1;
	let t5;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;
	let if_block0 = /*data*/ ctx[11].bgimg && create_if_block_2$1(ctx);
	let if_block1 = /*data*/ ctx[11].child.length > 0 && create_if_block_1$1(ctx);

	function click_handler_2(...args) {
		return /*click_handler_2*/ ctx[8](/*data*/ ctx[11], ...args);
	}

	function click_handler_3() {
		return /*click_handler_3*/ ctx[9](/*data*/ ctx[11]);
	}

	function click_handler_4() {
		return /*click_handler_4*/ ctx[10](/*data*/ ctx[11]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			button2 = element("button");
			i2 = element("i");
			t4 = space();
			div1 = element("div");
			t5 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$b, 119, 24, 4850);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$b, 118, 20, 4703);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$b, 122, 24, 5060);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$b, 121, 20, 4938);
			attr_dev(i2, "class", "icomoon-plus");
			add_location(i2, file$b, 125, 24, 5296);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light p-sm");
			add_location(button2, file$b, 124, 20, 5154);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "hotspot");
			add_location(div0, file$b, 114, 16, 4571);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$b, 128, 16, 5397);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[11].id);
			attr_dev(div2, "class", "drag-resize cursor_move hotspot_auth ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[11].top);
			set_style(div2, "left", /*data*/ ctx[11].left);
			set_style(div2, "height", /*data*/ ctx[11].height);
			set_style(div2, "width", /*data*/ ctx[11].width);
			set_style(div2, "border", /*data*/ ctx[11].border);
			set_style(div2, "background-image", /*data*/ ctx[11].backgroundImage + "\r\n                ");
			add_location(div2, file$b, 66, 12, 2085);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			if (if_block0) if_block0.m(div2, null);
			append_dev(div2, t0);
			if (if_block1) if_block1.m(div2, null);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div0, t3);
			append_dev(div0, button2);
			append_dev(button2, i2);
			append_dev(div2, t4);
			append_dev(div2, div1);
			append_dev(div2, t5);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler_2, false, false, false),
					listen_dev(button1, "click", click_handler_3, false, false, false),
					listen_dev(button2, "click", click_handler_4, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*data*/ ctx[11].bgimg) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$1(ctx);
					if_block0.c();
					if_block0.m(div2, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*data*/ ctx[11].child.length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$1(ctx);
					if_block1.c();
					if_block1.m(div2, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*hotspot_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[11].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[11].top);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[11].left);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[11].height);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[11].width);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "border", /*data*/ ctx[11].border);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "background-image", /*data*/ ctx[11].backgroundImage + "\r\n                ");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$b.name,
		type: "each",
		source: "(66:8) {#each hotspot_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let if_block_anchor;
	let if_block = /*hotspot_data*/ ctx[3] && /*hotspot_data*/ ctx[3].length > 0 && create_if_block$b(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*hotspot_data*/ ctx[3] && /*hotspot_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$b(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function bgImage$1(img) {
	if (img) {
		return (window.inNative
		? "https://s3.amazonaws.com/jigyaasa_content_static/"
		: "https://s3.amazonaws.com/jigyaasa_content_static/") + img;
	} else {
		return "";
	}
}

function instance$b($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Hotspot', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let hotspot_data = [];
	let hotspot = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hotspot> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, child_index, event) => elemModal("hotspot_click", event.currentTarget, data.id + "_" + (child_index + 1));
	const click_handler_1 = (data, child_index) => deleteElem("hotspot_click", data.id + "_" + (child_index + 1));
	const click_handler_2 = (data, event) => elemModal("hotspot", event.currentTarget, data.id);
	const click_handler_3 = data => deleteElem("hotspot", data.id);
	const click_handler_4 = data => elemModal("hotspot_click", '[id=' + data.id + ']');

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		hotspot_data,
		hotspot,
		bgImage: bgImage$1
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('hotspot_data' in $$props) $$invalidate(3, hotspot_data = $$props.hotspot_data);
		if ('hotspot' in $$props) $$invalidate(5, hotspot = $$props.hotspot);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, hotspot, hotspot_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, hotspot = []);
					$$invalidate(5, hotspot[0] = modules, hotspot);
				} else {
					$$invalidate(5, hotspot = modules);
				}

				$$invalidate(3, hotspot_data = []);

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

					$$invalidate(3, hotspot_data = [
						...hotspot_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							backgroundImage: "url('" + bgImage$1(data._bgimg) + "')",
							bgimg: data._bgimg,
							child: inner_component
						}
					]);
				});
			} else {
				$$invalidate(3, hotspot_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		hotspot_data,
		modules,
		hotspot,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4
	];
}

class Hotspot extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Hotspot",
			options,
			id: create_fragment$b.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Hotspot> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Hotspot> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Hotspot> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Menulist.svelte generated by Svelte v3.40.2 */

const file$c = "clsSMDragNDrop\\libs\\authoring\\Menulist.svelte";

function get_each_context$c(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (43:0) {#if menulist_data && menulist_data.length > 0}
function create_if_block$c(ctx) {
	let div;
	let div_key_value;
	let each_value = /*menulist_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "menulist_" + /*index*/ ctx[2] + /*menulist_data*/ ctx[3].length);
			add_location(div, file$c, 43, 4, 1175);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*menulist_data, deleteElem, elemModal*/ 11) {
				each_value = /*menulist_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$c(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$c(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, menulist_data*/ 12 && div_key_value !== (div_key_value = "menulist_" + /*index*/ ctx[2] + /*menulist_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(43:0) {#if menulist_data && menulist_data.length > 0}",
		ctx
	});

	return block;
}

// (45:8) {#each menulist_data as data, index}
function create_each_block$c(ctx) {
	let div2;
	let div0;
	let button0;
	let i0;
	let t0;
	let button1;
	let i1;
	let t1;
	let div1;
	let t2;
	let div2_key_value;
	let div2_id_value;
	let div2_data_title_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[8]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t0 = space();
			button1 = element("button");
			i1 = element("i");
			t1 = space();
			div1 = element("div");
			t2 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$c, 63, 24, 2032);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$c, 62, 20, 1884);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$c, 66, 24, 2243);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$c, 65, 20, 2120);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "menulist");
			add_location(div0, file$c, 58, 16, 1751);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$c, 69, 16, 2357);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "data-title", div2_data_title_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable dndarea ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$c, 45, 12, 1289);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div2, t2);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*menulist_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*menulist_data*/ 8 && div2_data_title_value !== (div2_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "data-title", div2_data_title_value);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$c.name,
		type: "each",
		source: "(45:8) {#each menulist_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let if_block_anchor;
	let if_block = /*menulist_data*/ ctx[3] && /*menulist_data*/ ctx[3].length > 0 && create_if_block$c(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*menulist_data*/ ctx[3] && /*menulist_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$c(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots('Menulist', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let menulist_data = [];
	let menulist_preview = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menulist> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("menulist", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("menulist", data.id);

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		menulist_data,
		menulist_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(2, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('menulist_data' in $$props) $$invalidate(3, menulist_data = $$props.menulist_data);
		if ('menulist_preview' in $$props) $$invalidate(5, menulist_preview = $$props.menulist_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, menulist_preview, menulist_data*/ 56) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(5, menulist_preview = []);
					$$invalidate(5, menulist_preview[0] = modules, menulist_preview);
				} else {
					$$invalidate(5, menulist_preview = modules);
				}

				$$invalidate(3, menulist_data = []);

				menulist_preview.map(function (data) {
					$$invalidate(3, menulist_data = [
						...menulist_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id
						}
					]);
				});
			} else {
				$$invalidate(3, menulist_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		menulist_data,
		modules,
		menulist_preview,
		click_handler,
		click_handler_1
	];
}

class Menulist extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Menulist",
			options,
			id: create_fragment$c.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Menulist> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Menulist> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Menulist> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Tabpills.svelte generated by Svelte v3.40.2 */
const file$d = "clsSMDragNDrop\\libs\\authoring\\Tabpills.svelte";

function get_each_context$d(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

function get_each_context_1$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

// (42:4) {#if tab_pills_preview && tab_pills_preview.length > 0}
function create_if_block$d(ctx) {
	let ul;
	let t;
	let div;
	let current;
	let each_value_1 = /*tab_pills_preview*/ ctx[3];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
	}

	let each_value = /*tab_pills_preview*/ ctx[3];
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

			attr_dev(ul, "class", "nav nav-pills margin-bottom mt-3 px-2");
			attr_dev(ul, "role", "tablist");
			add_location(ul, file$d, 42, 8, 1341);
			attr_dev(div, "class", "tab-content");
			attr_dev(div, "type", "tab");
			set_style(div, "position", "relative");
			add_location(div, file$d, 49, 8, 1792);
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
			if (dirty & /*tab_pills_preview*/ 8) {
				each_value_1 = /*tab_pills_preview*/ ctx[3];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*tab_pills_preview, elemModal, deleteElem, checkImageStatus*/ 15) {
				each_value = /*tab_pills_preview*/ ctx[3];
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
		source: "(42:4) {#if tab_pills_preview && tab_pills_preview.length > 0}",
		ctx
	});

	return block;
}

// (44:12) {#each tab_pills_preview as data, index}
function create_each_block_1$2(ctx) {
	let li;
	let a;
	let t0_value = /*data*/ ctx[6]._value + "";
	let t0;
	let a_data_bs_target_value;
	let a_class_value;
	let a_href_value;
	let t1;
	let li_for_value;
	let li_key_value;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(a, "data-bs-toggle", "pill");
			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#" + /*data*/ ctx[6]._id);
			attr_dev(a, "class", a_class_value = "nav-link" + (/*data*/ ctx[6]._display == "1" ? " active" : ""));
			attr_dev(a, "href", a_href_value = "#" + /*data*/ ctx[6]._id);
			add_location(a, file$d, 45, 20, 1568);
			attr_dev(li, "for", li_for_value = /*data*/ ctx[6]._id);
			attr_dev(li, "key", li_key_value = "tab_pills_list_" + /*index*/ ctx[8]);
			attr_dev(li, "class", "nav-item");
			add_location(li, file$d, 44, 16, 1478);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(li, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 8 && t0_value !== (t0_value = /*data*/ ctx[6]._value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*tab_pills_preview*/ 8 && a_data_bs_target_value !== (a_data_bs_target_value = "#" + /*data*/ ctx[6]._id)) {
				attr_dev(a, "data-bs-target", a_data_bs_target_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && a_class_value !== (a_class_value = "nav-link" + (/*data*/ ctx[6]._display == "1" ? " active" : ""))) {
				attr_dev(a, "class", a_class_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && a_href_value !== (a_href_value = "#" + /*data*/ ctx[6]._id)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && li_for_value !== (li_for_value = /*data*/ ctx[6]._id)) {
				attr_dev(li, "for", li_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$2.name,
		type: "each",
		source: "(44:12) {#each tab_pills_preview as data, index}",
		ctx
	});

	return block;
}

// (58:20) {#if data._bgimg}
function create_if_block_1$2(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[6]._bgimg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[6]._alt);
			add_location(img, file$d, 58, 24, 2225);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 8 && !src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[6]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[6]._alt)) {
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
		id: create_if_block_1$2.name,
		type: "if",
		source: "(58:20) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (51:12) {#each tab_pills_preview as data, index}
function create_each_block$d(ctx) {
	let div;
	let t0;
	let drag;
	let t1;
	let drop;
	let t2;
	let radio;
	let t3;
	let select;
	let t4;
	let textbox;
	let t5;
	let multilinebox;
	let t6;
	let checkbox;
	let t7;
	let button;
	let t8;
	let tabhead;
	let t9;
	let img;
	let t10;
	let label;
	let t11;
	let hotspot;
	let t12;
	let menulist;
	let t13;
	let div_key_value;
	let div_id_value;
	let div_class_value;
	let current;
	let if_block = /*data*/ ctx[6]._bgimg && create_if_block_1$2(ctx);

	drag = new Drag({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	drop = new Drop({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].select ? /*data*/ ctx[6].select : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].multilinebox
				? /*data*/ ctx[6].multilinebox
				: "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	button = new Button({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].button ? /*data*/ ctx[6].button : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].img ? /*data*/ ctx[6].img : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].label ? /*data*/ ctx[6].label : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(drag.$$.fragment);
			t1 = space();
			create_component(drop.$$.fragment);
			t2 = space();
			create_component(radio.$$.fragment);
			t3 = space();
			create_component(select.$$.fragment);
			t4 = space();
			create_component(textbox.$$.fragment);
			t5 = space();
			create_component(multilinebox.$$.fragment);
			t6 = space();
			create_component(checkbox.$$.fragment);
			t7 = space();
			create_component(button.$$.fragment);
			t8 = space();
			create_component(tabhead.$$.fragment);
			t9 = space();
			create_component(img.$$.fragment);
			t10 = space();
			create_component(label.$$.fragment);
			t11 = space();
			create_component(hotspot.$$.fragment);
			t12 = space();
			create_component(menulist.$$.fragment);
			t13 = space();
			attr_dev(div, "key", div_key_value = "tab_pills_preview_" + /*index*/ ctx[8]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[6]._id);
			attr_dev(div, "role", "tabpanel");
			attr_dev(div, "class", div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""));
			add_location(div, file$d, 51, 16, 1926);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(drag, div, null);
			append_dev(div, t1);
			mount_component(drop, div, null);
			append_dev(div, t2);
			mount_component(radio, div, null);
			append_dev(div, t3);
			mount_component(select, div, null);
			append_dev(div, t4);
			mount_component(textbox, div, null);
			append_dev(div, t5);
			mount_component(multilinebox, div, null);
			append_dev(div, t6);
			mount_component(checkbox, div, null);
			append_dev(div, t7);
			mount_component(button, div, null);
			append_dev(div, t8);
			mount_component(tabhead, div, null);
			append_dev(div, t9);
			mount_component(img, div, null);
			append_dev(div, t10);
			mount_component(label, div, null);
			append_dev(div, t11);
			mount_component(hotspot, div, null);
			append_dev(div, t12);
			mount_component(menulist, div, null);
			append_dev(div, t13);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[6]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$2(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const drag_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) drag_changes.modules = /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : "";
			if (dirty & /*elemModal*/ 2) drag_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drag_changes.deleteElem = /*deleteElem*/ ctx[0];
			drag.$set(drag_changes);
			const drop_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) drop_changes.modules = /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : "";
			if (dirty & /*elemModal*/ 2) drop_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drop_changes.deleteElem = /*deleteElem*/ ctx[0];
			drop.$set(drop_changes);
			const radio_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) radio_changes.modules = /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : "";
			if (dirty & /*elemModal*/ 2) radio_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) radio_changes.deleteElem = /*deleteElem*/ ctx[0];
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) select_changes.modules = /*data*/ ctx[6].select ? /*data*/ ctx[6].select : "";
			if (dirty & /*elemModal*/ 2) select_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) select_changes.deleteElem = /*deleteElem*/ ctx[0];
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) textbox_changes.modules = /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : "";
			if (dirty & /*elemModal*/ 2) textbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) textbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};

			if (dirty & /*tab_pills_preview*/ 8) multilinebox_changes.modules = /*data*/ ctx[6].multilinebox
			? /*data*/ ctx[6].multilinebox
			: "";

			if (dirty & /*elemModal*/ 2) multilinebox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) multilinebox_changes.deleteElem = /*deleteElem*/ ctx[0];
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) checkbox_changes.modules = /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : "";
			if (dirty & /*elemModal*/ 2) checkbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) checkbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			checkbox.$set(checkbox_changes);
			const button_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) button_changes.modules = /*data*/ ctx[6].button ? /*data*/ ctx[6].button : "";
			if (dirty & /*elemModal*/ 2) button_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) button_changes.deleteElem = /*deleteElem*/ ctx[0];
			button.$set(button_changes);
			const tabhead_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) tabhead_changes.modules = /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : "";
			if (dirty & /*elemModal*/ 2) tabhead_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabhead_changes.deleteElem = /*deleteElem*/ ctx[0];
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) img_changes.modules = /*data*/ ctx[6].img ? /*data*/ ctx[6].img : "";
			if (dirty & /*elemModal*/ 2) img_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) img_changes.deleteElem = /*deleteElem*/ ctx[0];
			img.$set(img_changes);
			const label_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) label_changes.modules = /*data*/ ctx[6].label ? /*data*/ ctx[6].label : "";
			if (dirty & /*elemModal*/ 2) label_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) label_changes.deleteElem = /*deleteElem*/ ctx[0];
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) hotspot_changes.modules = /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : "";
			if (dirty & /*elemModal*/ 2) hotspot_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) hotspot_changes.deleteElem = /*deleteElem*/ ctx[0];
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) menulist_changes.modules = /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : "";
			if (dirty & /*elemModal*/ 2) menulist_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) menulist_changes.deleteElem = /*deleteElem*/ ctx[0];
			menulist.$set(menulist_changes);

			if (!current || dirty & /*tab_pills_preview*/ 8 && div_id_value !== (div_id_value = /*data*/ ctx[6]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (!current || dirty & /*tab_pills_preview*/ 8 && div_class_value !== (div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag.$$.fragment, local);
			transition_in(drop.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag.$$.fragment, local);
			transition_out(drop.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(drag);
			destroy_component(drop);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$d.name,
		type: "each",
		source: "(51:12) {#each tab_pills_preview as data, index}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let div;
	let current;
	let if_block = /*tab_pills_preview*/ ctx[3] && /*tab_pills_preview*/ ctx[3].length > 0 && create_if_block$d(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$d, 40, 0, 1265);
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
			if (/*tab_pills_preview*/ ctx[3] && /*tab_pills_preview*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*tab_pills_preview*/ 8) {
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
	validate_slots('Tabpills', slots, []);
	let { modules } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let { checkImageStatus } = $$props;
	let tab_pills_preview = modules;
	const writable_props = ['modules', 'deleteElem', 'elemModal', 'checkImageStatus'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabpills> was created with unknown prop '${key}'`);
	});

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkImageStatus' in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
	};

	$$self.$capture_state = () => ({
		Button,
		Checkbox,
		Drag,
		Drop,
		Hotspot,
		Img,
		Label,
		Menulist,
		Multilinebox,
		Radio,
		Select,
		Tabhead,
		Textbox,
		modules,
		deleteElem,
		elemModal,
		checkImageStatus,
		tab_pills_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(4, modules = $$props.modules);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkImageStatus' in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
		if ('tab_pills_preview' in $$props) $$invalidate(3, tab_pills_preview = $$props.tab_pills_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 16) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, tab_pills_preview = []);
					$$invalidate(3, tab_pills_preview[0] = modules, tab_pills_preview);
				} else {
					$$invalidate(3, tab_pills_preview = modules);
				}
			} else {
				$$invalidate(3, tab_pills_preview = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		checkImageStatus,
		tab_pills_preview,
		modules,
		load_handler
	];
}

class Tabpills extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
			modules: 4,
			deleteElem: 0,
			elemModal: 1,
			checkImageStatus: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tabpills",
			options,
			id: create_fragment$d.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !('modules' in props)) {
			console.warn("<Tabpills> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Tabpills> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Tabpills> was created without expected prop 'elemModal'");
		}

		if (/*checkImageStatus*/ ctx[2] === undefined && !('checkImageStatus' in props)) {
			console.warn("<Tabpills> was created without expected prop 'checkImageStatus'");
		}
	}

	get modules() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImageStatus() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImageStatus(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Tab.svelte generated by Svelte v3.40.2 */
const file$e = "clsSMDragNDrop\\libs\\authoring\\Tab.svelte";

function get_each_context$e(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

function get_each_context_1$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

// (44:0) {#if tab_preview && tab_preview.length > 0}
function create_if_block$e(ctx) {
	let div1;
	let ul;
	let t;
	let div0;
	let div1_key_value;
	let current;
	let each_value_1 = /*tab_preview*/ ctx[4];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
	}

	let each_value = /*tab_preview*/ ctx[4];
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
			div1 = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "class", "nav nav-tabs margin-bottom mt-3 px-2");
			add_location(ul, file$e, 45, 8, 1444);
			attr_dev(div0, "class", "tab-content");
			attr_dev(div0, "type", "tab");
			set_style(div0, "position", "relative");
			add_location(div0, file$e, 63, 8, 2522);
			attr_dev(div1, "key", div1_key_value = "tab_" + /*index*/ ctx[3] + /*tab_preview*/ ctx[4].length);
			add_location(div1, file$e, 44, 4, 1387);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, ul);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			append_dev(div1, t);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview, deleteElem, elemModal*/ 19) {
				each_value_1 = /*tab_preview*/ ctx[4];
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

			if (dirty & /*tab_preview, elemModal, deleteElem, checkImageStatus*/ 23) {
				each_value = /*tab_preview*/ ctx[4];
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
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*index, tab_preview*/ 24 && div1_key_value !== (div1_key_value = "tab_" + /*index*/ ctx[3] + /*tab_preview*/ ctx[4].length)) {
				attr_dev(div1, "key", div1_key_value);
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
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(44:0) {#if tab_preview && tab_preview.length > 0}",
		ctx
	});

	return block;
}

// (47:12) {#each tab_preview as data, index}
function create_each_block_1$3(ctx) {
	let li;
	let a;
	let t0_value = /*data*/ ctx[9]._value + "";
	let t0;
	let a_href_value;
	let a_data_bs_target_value;
	let a_class_value;
	let t1;
	let div;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let li_for_value;
	let li_key_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[9], ...args);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[9]);
	}

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			div = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			attr_dev(a, "href", a_href_value = "#" + /*data*/ ctx[9]._id);
			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#" + /*data*/ ctx[9]._id);
			attr_dev(a, "data-bs-toggle", "tab");

			attr_dev(a, "class", a_class_value = /*data*/ ctx[9]._display == "1"
			? " active nav-link"
			: " nav-link");

			add_location(a, file$e, 48, 20, 1650);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$e, 54, 28, 2130);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$e, 53, 24, 1982);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$e, 57, 28, 2349);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$e, 56, 24, 2226);
			attr_dev(div, "class", "btn-group tools tabTools h");
			attr_dev(div, "data-t", "label");
			add_location(div, file$e, 49, 20, 1827);
			attr_dev(li, "for", li_for_value = /*data*/ ctx[9]._id);
			attr_dev(li, "key", li_key_value = "tab_list_" + /*index*/ ctx[3]);
			attr_dev(li, "class", "tbhead nav-item");
			add_location(li, file$e, 47, 16, 1559);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(li, t1);
			append_dev(li, div);
			append_dev(div, button0);
			append_dev(button0, i0);
			append_dev(div, t2);
			append_dev(div, button1);
			append_dev(button1, i1);
			append_dev(li, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*tab_preview*/ 16 && t0_value !== (t0_value = /*data*/ ctx[9]._value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*tab_preview*/ 16 && a_href_value !== (a_href_value = "#" + /*data*/ ctx[9]._id)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*tab_preview*/ 16 && a_data_bs_target_value !== (a_data_bs_target_value = "#" + /*data*/ ctx[9]._id)) {
				attr_dev(a, "data-bs-target", a_data_bs_target_value);
			}

			if (dirty & /*tab_preview*/ 16 && a_class_value !== (a_class_value = /*data*/ ctx[9]._display == "1"
			? " active nav-link"
			: " nav-link")) {
				attr_dev(a, "class", a_class_value);
			}

			if (dirty & /*tab_preview*/ 16 && li_for_value !== (li_for_value = /*data*/ ctx[9]._id)) {
				attr_dev(li, "for", li_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$3.name,
		type: "each",
		source: "(47:12) {#each tab_preview as data, index}",
		ctx
	});

	return block;
}

// (71:20) {#if data._bgimg}
function create_if_block_1$3(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[9]._bgimg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[9]._alt);
			add_location(img, file$e, 71, 24, 2889);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview*/ 16 && !src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[9]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*tab_preview*/ 16 && img_alt_value !== (img_alt_value = /*data*/ ctx[9]._alt)) {
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
		id: create_if_block_1$3.name,
		type: "if",
		source: "(71:20) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (65:12) {#each tab_preview as data, index}
function create_each_block$e(ctx) {
	let div;
	let t0;
	let drag;
	let t1;
	let drop;
	let t2;
	let radio;
	let t3;
	let select;
	let t4;
	let textbox;
	let t5;
	let multilinebox;
	let t6;
	let checkbox;
	let t7;
	let button;
	let t8;
	let tabhead;
	let t9;
	let img;
	let t10;
	let label;
	let t11;
	let hotspot;
	let t12;
	let menulist;
	let t13;
	let tabpills;
	let t14;
	let div_id_value;
	let div_class_value;
	let current;
	let if_block = /*data*/ ctx[9]._bgimg && create_if_block_1$3(ctx);

	drag = new Drag({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].drag ? /*data*/ ctx[9].drag : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	drop = new Drop({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].drop ? /*data*/ ctx[9].drop : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].radio ? /*data*/ ctx[9].radio : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].select ? /*data*/ ctx[9].select : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].textbox ? /*data*/ ctx[9].textbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].multilinebox
				? /*data*/ ctx[9].multilinebox
				: "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].checkbox ? /*data*/ ctx[9].checkbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	button = new Button({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].button ? /*data*/ ctx[9].button : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].tabhead ? /*data*/ ctx[9].tabhead : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].img ? /*data*/ ctx[9].img : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].label ? /*data*/ ctx[9].label : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].hotspot ? /*data*/ ctx[9].hotspot : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].menulist ? /*data*/ ctx[9].menulist : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabpills = new Tabpills({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].tab ? /*data*/ ctx[9].tab : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0],
				checkImageStatus: /*checkImageStatus*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(drag.$$.fragment);
			t1 = space();
			create_component(drop.$$.fragment);
			t2 = space();
			create_component(radio.$$.fragment);
			t3 = space();
			create_component(select.$$.fragment);
			t4 = space();
			create_component(textbox.$$.fragment);
			t5 = space();
			create_component(multilinebox.$$.fragment);
			t6 = space();
			create_component(checkbox.$$.fragment);
			t7 = space();
			create_component(button.$$.fragment);
			t8 = space();
			create_component(tabhead.$$.fragment);
			t9 = space();
			create_component(img.$$.fragment);
			t10 = space();
			create_component(label.$$.fragment);
			t11 = space();
			create_component(hotspot.$$.fragment);
			t12 = space();
			create_component(menulist.$$.fragment);
			t13 = space();
			create_component(tabpills.$$.fragment);
			t14 = space();
			attr_dev(div, "id", div_id_value = /*data*/ ctx[9]._id);
			attr_dev(div, "class", div_class_value = "tab-pane" + (/*data*/ ctx[9]._display == "1" ? " active" : ""));
			attr_dev(div, "role", "tabpanel");
			add_location(div, file$e, 65, 16, 2650);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(drag, div, null);
			append_dev(div, t1);
			mount_component(drop, div, null);
			append_dev(div, t2);
			mount_component(radio, div, null);
			append_dev(div, t3);
			mount_component(select, div, null);
			append_dev(div, t4);
			mount_component(textbox, div, null);
			append_dev(div, t5);
			mount_component(multilinebox, div, null);
			append_dev(div, t6);
			mount_component(checkbox, div, null);
			append_dev(div, t7);
			mount_component(button, div, null);
			append_dev(div, t8);
			mount_component(tabhead, div, null);
			append_dev(div, t9);
			mount_component(img, div, null);
			append_dev(div, t10);
			mount_component(label, div, null);
			append_dev(div, t11);
			mount_component(hotspot, div, null);
			append_dev(div, t12);
			mount_component(menulist, div, null);
			append_dev(div, t13);
			mount_component(tabpills, div, null);
			append_dev(div, t14);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[9]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$3(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const drag_changes = {};
			if (dirty & /*tab_preview*/ 16) drag_changes.modules = /*data*/ ctx[9].drag ? /*data*/ ctx[9].drag : "";
			if (dirty & /*elemModal*/ 2) drag_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drag_changes.deleteElem = /*deleteElem*/ ctx[0];
			drag.$set(drag_changes);
			const drop_changes = {};
			if (dirty & /*tab_preview*/ 16) drop_changes.modules = /*data*/ ctx[9].drop ? /*data*/ ctx[9].drop : "";
			if (dirty & /*elemModal*/ 2) drop_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drop_changes.deleteElem = /*deleteElem*/ ctx[0];
			drop.$set(drop_changes);
			const radio_changes = {};
			if (dirty & /*tab_preview*/ 16) radio_changes.modules = /*data*/ ctx[9].radio ? /*data*/ ctx[9].radio : "";
			if (dirty & /*elemModal*/ 2) radio_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) radio_changes.deleteElem = /*deleteElem*/ ctx[0];
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty & /*tab_preview*/ 16) select_changes.modules = /*data*/ ctx[9].select ? /*data*/ ctx[9].select : "";
			if (dirty & /*elemModal*/ 2) select_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) select_changes.deleteElem = /*deleteElem*/ ctx[0];
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty & /*tab_preview*/ 16) textbox_changes.modules = /*data*/ ctx[9].textbox ? /*data*/ ctx[9].textbox : "";
			if (dirty & /*elemModal*/ 2) textbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) textbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};

			if (dirty & /*tab_preview*/ 16) multilinebox_changes.modules = /*data*/ ctx[9].multilinebox
			? /*data*/ ctx[9].multilinebox
			: "";

			if (dirty & /*elemModal*/ 2) multilinebox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) multilinebox_changes.deleteElem = /*deleteElem*/ ctx[0];
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty & /*tab_preview*/ 16) checkbox_changes.modules = /*data*/ ctx[9].checkbox ? /*data*/ ctx[9].checkbox : "";
			if (dirty & /*elemModal*/ 2) checkbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) checkbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			checkbox.$set(checkbox_changes);
			const button_changes = {};
			if (dirty & /*tab_preview*/ 16) button_changes.modules = /*data*/ ctx[9].button ? /*data*/ ctx[9].button : "";
			if (dirty & /*elemModal*/ 2) button_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) button_changes.deleteElem = /*deleteElem*/ ctx[0];
			button.$set(button_changes);
			const tabhead_changes = {};
			if (dirty & /*tab_preview*/ 16) tabhead_changes.modules = /*data*/ ctx[9].tabhead ? /*data*/ ctx[9].tabhead : "";
			if (dirty & /*elemModal*/ 2) tabhead_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabhead_changes.deleteElem = /*deleteElem*/ ctx[0];
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty & /*tab_preview*/ 16) img_changes.modules = /*data*/ ctx[9].img ? /*data*/ ctx[9].img : "";
			if (dirty & /*elemModal*/ 2) img_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) img_changes.deleteElem = /*deleteElem*/ ctx[0];
			img.$set(img_changes);
			const label_changes = {};
			if (dirty & /*tab_preview*/ 16) label_changes.modules = /*data*/ ctx[9].label ? /*data*/ ctx[9].label : "";
			if (dirty & /*elemModal*/ 2) label_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) label_changes.deleteElem = /*deleteElem*/ ctx[0];
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty & /*tab_preview*/ 16) hotspot_changes.modules = /*data*/ ctx[9].hotspot ? /*data*/ ctx[9].hotspot : "";
			if (dirty & /*elemModal*/ 2) hotspot_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) hotspot_changes.deleteElem = /*deleteElem*/ ctx[0];
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty & /*tab_preview*/ 16) menulist_changes.modules = /*data*/ ctx[9].menulist ? /*data*/ ctx[9].menulist : "";
			if (dirty & /*elemModal*/ 2) menulist_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) menulist_changes.deleteElem = /*deleteElem*/ ctx[0];
			menulist.$set(menulist_changes);
			const tabpills_changes = {};
			if (dirty & /*tab_preview*/ 16) tabpills_changes.modules = /*data*/ ctx[9].tab ? /*data*/ ctx[9].tab : "";
			if (dirty & /*elemModal*/ 2) tabpills_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabpills_changes.deleteElem = /*deleteElem*/ ctx[0];
			if (dirty & /*checkImageStatus*/ 4) tabpills_changes.checkImageStatus = /*checkImageStatus*/ ctx[2];
			tabpills.$set(tabpills_changes);

			if (!current || dirty & /*tab_preview*/ 16 && div_id_value !== (div_id_value = /*data*/ ctx[9]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (!current || dirty & /*tab_preview*/ 16 && div_class_value !== (div_class_value = "tab-pane" + (/*data*/ ctx[9]._display == "1" ? " active" : ""))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag.$$.fragment, local);
			transition_in(drop.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			transition_in(tabpills.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag.$$.fragment, local);
			transition_out(drop.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			transition_out(tabpills.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(drag);
			destroy_component(drop);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
			destroy_component(tabpills);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$e.name,
		type: "each",
		source: "(65:12) {#each tab_preview as data, index}",
		ctx
	});

	return block;
}

function create_fragment$e(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*tab_preview*/ ctx[4] && /*tab_preview*/ ctx[4].length > 0 && create_if_block$e(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*tab_preview*/ ctx[4] && /*tab_preview*/ ctx[4].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*tab_preview*/ 16) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$e(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots('Tab', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let { checkImageStatus } = $$props;
	var tab_preview = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal', 'checkImageStatus'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("tab", event.currentTarget, data._id);
	const click_handler_1 = data => deleteElem("tab", data._id);

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(5, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(3, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkImageStatus' in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
	};

	$$self.$capture_state = () => ({
		Button,
		Checkbox,
		Drag,
		Drop,
		Hotspot,
		Img,
		Label,
		Menulist,
		Multilinebox,
		Radio,
		Select,
		Tabhead,
		Textbox,
		onMount,
		Tabpills,
		modules,
		index,
		deleteElem,
		elemModal,
		checkImageStatus,
		tab_preview
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(5, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(3, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkImageStatus' in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
		if ('tab_preview' in $$props) $$invalidate(4, tab_preview = $$props.tab_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 32) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, tab_preview = []);
					$$invalidate(4, tab_preview[0] = modules, tab_preview);
				} else {
					$$invalidate(4, tab_preview = modules);
				}
			} else {
				$$invalidate(4, tab_preview = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		checkImageStatus,
		index,
		tab_preview,
		modules,
		click_handler,
		click_handler_1,
		load_handler
	];
}

class Tab extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
			modules: 5,
			index: 3,
			deleteElem: 0,
			elemModal: 1,
			checkImageStatus: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tab",
			options,
			id: create_fragment$e.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[5] === undefined && !('modules' in props)) {
			console.warn("<Tab> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Tab> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Tab> was created without expected prop 'elemModal'");
		}

		if (/*checkImageStatus*/ ctx[2] === undefined && !('checkImageStatus' in props)) {
			console.warn("<Tab> was created without expected prop 'checkImageStatus'");
		}
	}

	get modules() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImageStatus() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImageStatus(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Step.svelte generated by Svelte v3.40.2 */
const file$f = "clsSMDragNDrop\\libs\\authoring\\Step.svelte";

function get_each_context$f(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

// (45:0) {#if step && step.length > 0}
function create_if_block$f(ctx) {
	let div;
	let div_key_value;
	let current;
	let each_value = /*step*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "step_" + /*index*/ ctx[3] + /*step*/ ctx[4].length);
			add_location(div, file$f, 45, 4, 1307);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*step, elemModal, deleteElem, checkImageStatus*/ 23) {
				each_value = /*step*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$f(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$f(child_ctx);
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

			if (!current || dirty & /*index, step*/ 24 && div_key_value !== (div_key_value = "step_" + /*index*/ ctx[3] + /*step*/ ctx[4].length)) {
				attr_dev(div, "key", div_key_value);
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
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$f.name,
		type: "if",
		source: "(45:0) {#if step && step.length > 0}",
		ctx
	});

	return block;
}

// (57:16) {#if data._bgimg}
function create_if_block_1$4(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[8]._bgimg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[8]._alt);
			add_location(img, file$f, 57, 5, 1889);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[7], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*step*/ 16 && !src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[8]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*step*/ 16 && img_alt_value !== (img_alt_value = /*data*/ ctx[8]._alt)) {
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
		id: create_if_block_1$4.name,
		type: "if",
		source: "(57:16) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (47:8) {#each step as data, index}
function create_each_block$f(ctx) {
	let div1;
	let div0;
	let button0;
	let i;
	let t0;
	let t1;
	let drag;
	let t2;
	let drop;
	let t3;
	let radio;
	let t4;
	let select;
	let t5;
	let textbox;
	let t6;
	let multilinebox;
	let t7;
	let checkbox;
	let t8;
	let button1;
	let t9;
	let tabhead;
	let t10;
	let img;
	let t11;
	let label;
	let t12;
	let hotspot;
	let t13;
	let menulist;
	let t14;
	let tab;
	let t15;
	let div1_key_value;
	let div1_id_value;
	let current;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	let if_block = /*data*/ ctx[8]._bgimg && create_if_block_1$4(ctx);

	drag = new Drag({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].drag ? /*data*/ ctx[8].drag : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	drop = new Drop({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].drop ? /*data*/ ctx[8].drop : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].radio ? /*data*/ ctx[8].radio : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].select ? /*data*/ ctx[8].select : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].textbox ? /*data*/ ctx[8].textbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].multilinebox
				? /*data*/ ctx[8].multilinebox
				: "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].checkbox ? /*data*/ ctx[8].checkbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	button1 = new Button({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].button ? /*data*/ ctx[8].button : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].tabhead ? /*data*/ ctx[8].tabhead : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].img ? /*data*/ ctx[8].img : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].label ? /*data*/ ctx[8].label : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].hotspot ? /*data*/ ctx[8].hotspot : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].menulist ? /*data*/ ctx[8].menulist : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tab = new Tab({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].tab ? /*data*/ ctx[8].tab : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0],
				checkImageStatus: /*checkImageStatus*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			i = element("i");
			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			create_component(drag.$$.fragment);
			t2 = space();
			create_component(drop.$$.fragment);
			t3 = space();
			create_component(radio.$$.fragment);
			t4 = space();
			create_component(select.$$.fragment);
			t5 = space();
			create_component(textbox.$$.fragment);
			t6 = space();
			create_component(multilinebox.$$.fragment);
			t7 = space();
			create_component(checkbox.$$.fragment);
			t8 = space();
			create_component(button1.$$.fragment);
			t9 = space();
			create_component(tabhead.$$.fragment);
			t10 = space();
			create_component(img.$$.fragment);
			t11 = space();
			create_component(label.$$.fragment);
			t12 = space();
			create_component(hotspot.$$.fragment);
			t13 = space();
			create_component(menulist.$$.fragment);
			t14 = space();
			create_component(tab.$$.fragment);
			t15 = space();
			attr_dev(i, "class", "icomoon-24px-edit-1");
			add_location(i, file$f, 54, 196, 1779);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$f, 54, 76, 1659);
			attr_dev(div0, "class", "btn-group tools");
			attr_dev(div0, "data-type", "step");
			attr_dev(div0, "data-t", "step");
			add_location(div0, file$f, 54, 16, 1599);
			attr_dev(div1, "key", div1_key_value = /*index*/ ctx[3]);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[8]._id);
			attr_dev(div1, "type", "step");
			attr_dev(div1, "class", "step");
			set_style(div1, "position", "relative");
			add_location(div1, file$f, 47, 12, 1399);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, button0);
			append_dev(button0, i);
			append_dev(div1, t0);
			if (if_block) if_block.m(div1, null);
			append_dev(div1, t1);
			mount_component(drag, div1, null);
			append_dev(div1, t2);
			mount_component(drop, div1, null);
			append_dev(div1, t3);
			mount_component(radio, div1, null);
			append_dev(div1, t4);
			mount_component(select, div1, null);
			append_dev(div1, t5);
			mount_component(textbox, div1, null);
			append_dev(div1, t6);
			mount_component(multilinebox, div1, null);
			append_dev(div1, t7);
			mount_component(checkbox, div1, null);
			append_dev(div1, t8);
			mount_component(button1, div1, null);
			append_dev(div1, t9);
			mount_component(tabhead, div1, null);
			append_dev(div1, t10);
			mount_component(img, div1, null);
			append_dev(div1, t11);
			mount_component(label, div1, null);
			append_dev(div1, t12);
			mount_component(hotspot, div1, null);
			append_dev(div1, t13);
			mount_component(menulist, div1, null);
			append_dev(div1, t14);
			mount_component(tab, div1, null);
			append_dev(div1, t15);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button0, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*data*/ ctx[8]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$4(ctx);
					if_block.c();
					if_block.m(div1, t1);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const drag_changes = {};
			if (dirty & /*step*/ 16) drag_changes.modules = /*data*/ ctx[8].drag ? /*data*/ ctx[8].drag : "";
			if (dirty & /*elemModal*/ 2) drag_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drag_changes.deleteElem = /*deleteElem*/ ctx[0];
			drag.$set(drag_changes);
			const drop_changes = {};
			if (dirty & /*step*/ 16) drop_changes.modules = /*data*/ ctx[8].drop ? /*data*/ ctx[8].drop : "";
			if (dirty & /*elemModal*/ 2) drop_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drop_changes.deleteElem = /*deleteElem*/ ctx[0];
			drop.$set(drop_changes);
			const radio_changes = {};
			if (dirty & /*step*/ 16) radio_changes.modules = /*data*/ ctx[8].radio ? /*data*/ ctx[8].radio : "";
			if (dirty & /*elemModal*/ 2) radio_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) radio_changes.deleteElem = /*deleteElem*/ ctx[0];
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty & /*step*/ 16) select_changes.modules = /*data*/ ctx[8].select ? /*data*/ ctx[8].select : "";
			if (dirty & /*elemModal*/ 2) select_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) select_changes.deleteElem = /*deleteElem*/ ctx[0];
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty & /*step*/ 16) textbox_changes.modules = /*data*/ ctx[8].textbox ? /*data*/ ctx[8].textbox : "";
			if (dirty & /*elemModal*/ 2) textbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) textbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};

			if (dirty & /*step*/ 16) multilinebox_changes.modules = /*data*/ ctx[8].multilinebox
			? /*data*/ ctx[8].multilinebox
			: "";

			if (dirty & /*elemModal*/ 2) multilinebox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) multilinebox_changes.deleteElem = /*deleteElem*/ ctx[0];
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty & /*step*/ 16) checkbox_changes.modules = /*data*/ ctx[8].checkbox ? /*data*/ ctx[8].checkbox : "";
			if (dirty & /*elemModal*/ 2) checkbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) checkbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			checkbox.$set(checkbox_changes);
			const button1_changes = {};
			if (dirty & /*step*/ 16) button1_changes.modules = /*data*/ ctx[8].button ? /*data*/ ctx[8].button : "";
			if (dirty & /*elemModal*/ 2) button1_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) button1_changes.deleteElem = /*deleteElem*/ ctx[0];
			button1.$set(button1_changes);
			const tabhead_changes = {};
			if (dirty & /*step*/ 16) tabhead_changes.modules = /*data*/ ctx[8].tabhead ? /*data*/ ctx[8].tabhead : "";
			if (dirty & /*elemModal*/ 2) tabhead_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabhead_changes.deleteElem = /*deleteElem*/ ctx[0];
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty & /*step*/ 16) img_changes.modules = /*data*/ ctx[8].img ? /*data*/ ctx[8].img : "";
			if (dirty & /*elemModal*/ 2) img_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) img_changes.deleteElem = /*deleteElem*/ ctx[0];
			img.$set(img_changes);
			const label_changes = {};
			if (dirty & /*step*/ 16) label_changes.modules = /*data*/ ctx[8].label ? /*data*/ ctx[8].label : "";
			if (dirty & /*elemModal*/ 2) label_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) label_changes.deleteElem = /*deleteElem*/ ctx[0];
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty & /*step*/ 16) hotspot_changes.modules = /*data*/ ctx[8].hotspot ? /*data*/ ctx[8].hotspot : "";
			if (dirty & /*elemModal*/ 2) hotspot_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) hotspot_changes.deleteElem = /*deleteElem*/ ctx[0];
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty & /*step*/ 16) menulist_changes.modules = /*data*/ ctx[8].menulist ? /*data*/ ctx[8].menulist : "";
			if (dirty & /*elemModal*/ 2) menulist_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) menulist_changes.deleteElem = /*deleteElem*/ ctx[0];
			menulist.$set(menulist_changes);
			const tab_changes = {};
			if (dirty & /*step*/ 16) tab_changes.modules = /*data*/ ctx[8].tab ? /*data*/ ctx[8].tab : "";
			if (dirty & /*elemModal*/ 2) tab_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tab_changes.deleteElem = /*deleteElem*/ ctx[0];
			if (dirty & /*checkImageStatus*/ 4) tab_changes.checkImageStatus = /*checkImageStatus*/ ctx[2];
			tab.$set(tab_changes);

			if (!current || dirty & /*step*/ 16 && div1_id_value !== (div1_id_value = /*data*/ ctx[8]._id)) {
				attr_dev(div1, "id", div1_id_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag.$$.fragment, local);
			transition_in(drop.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			transition_in(tab.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag.$$.fragment, local);
			transition_out(drop.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			transition_out(tab.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
			destroy_component(drag);
			destroy_component(drop);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button1);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
			destroy_component(tab);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$f.name,
		type: "each",
		source: "(47:8) {#each step as data, index}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*step*/ ctx[4] && /*step*/ ctx[4].length > 0 && create_if_block$f(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*step*/ ctx[4] && /*step*/ ctx[4].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*step*/ 16) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$f(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance$f($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Step', slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let { checkImageStatus } = $$props;
	let step = modules;
	const writable_props = ['modules', 'index', 'deleteElem', 'elemModal', 'checkImageStatus'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Step> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal('step', event.currentTarget, data._id);

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ('modules' in $$props) $$invalidate(5, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(3, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkImageStatus' in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
	};

	$$self.$capture_state = () => ({
		Button,
		Checkbox,
		Drag,
		Drop,
		Hotspot,
		Img,
		Label,
		Menulist,
		Multilinebox,
		Radio,
		Select,
		Tab,
		Tabhead,
		Textbox,
		modules,
		index,
		deleteElem,
		elemModal,
		checkImageStatus,
		step
	});

	$$self.$inject_state = $$props => {
		if ('modules' in $$props) $$invalidate(5, modules = $$props.modules);
		if ('index' in $$props) $$invalidate(3, index = $$props.index);
		if ('deleteElem' in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ('elemModal' in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ('checkImageStatus' in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
		if ('step' in $$props) $$invalidate(4, step = $$props.step);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 32) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, step = []);
					$$invalidate(4, step[0] = modules, step);
				} else {
					$$invalidate(4, step = modules);
				}
			} else {
				$$invalidate(4, step = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		checkImageStatus,
		index,
		step,
		modules,
		click_handler,
		load_handler
	];
}

class Step extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
			modules: 5,
			index: 3,
			deleteElem: 0,
			elemModal: 1,
			checkImageStatus: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Step",
			options,
			id: create_fragment$f.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[5] === undefined && !('modules' in props)) {
			console.warn("<Step> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !('deleteElem' in props)) {
			console.warn("<Step> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !('elemModal' in props)) {
			console.warn("<Step> was created without expected prop 'elemModal'");
		}

		if (/*checkImageStatus*/ ctx[2] === undefined && !('checkImageStatus' in props)) {
			console.warn("<Step> was created without expected prop 'checkImageStatus'");
		}
	}

	get modules() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImageStatus() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImageStatus(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\ModalEvent.svelte generated by Svelte v3.40.2 */
const file$g = "clsSMDragNDrop\\libs\\authoring\\ModalEvent.svelte";

function create_fragment$g(ctx) {
	let div4;
	let div1;
	let div0;
	let a0;
	let t1;
	let a1;
	let t3;
	let a2;
	let t5;
	let a3;
	let t7;
	let a4;
	let t9;
	let a5;
	let t11;
	let a6;
	let t13;
	let a7;
	let t15;
	let a8;
	let t17;
	let a9;
	let t19;
	let a10;
	let t21;
	let a11;
	let t23;
	let a12;
	let t25;
	let a13;
	let t27;
	let a14;
	let t29;
	let a15;
	let t31;
	let div2;
	let t32;
	let div3;
	let input0;
	let input0_placeholder_value;
	let t33;
	let input1;
	let input1_placeholder_value;
	let t34;
	let input2;
	let input2_placeholder_value;
	let t35;
	let input3;
	let input3_placeholder_value;
	let t36;
	let input4;
	let input4_placeholder_value;
	let t37;
	let input5;
	let input5_placeholder_value;
	let t38;
	let input6;
	let input6_placeholder_value;
	let t39;
	let input7;
	let input7_placeholder_value;
	let t40;
	let input8;
	let input8_placeholder_value;
	let t41;
	let input9;
	let input9_placeholder_value;
	let t42;
	let input10;
	let input10_placeholder_value;
	let t43;
	let input11;
	let input11_placeholder_value;
	let t44;
	let input12;
	let input12_placeholder_value;
	let t45;
	let input13;
	let input13_placeholder_value;
	let t46;
	let input14;
	let input14_placeholder_value;
	let t47;
	let input15;
	let input15_placeholder_value;

	const block = {
		c: function create() {
			div4 = element("div");
			div1 = element("div");
			div0 = element("div");
			a0 = element("a");
			a0.textContent = `${l.on_click}`;
			t1 = space();
			a1 = element("a");
			a1.textContent = `${l.on_dbl_click}`;
			t3 = space();
			a2 = element("a");
			a2.textContent = `${l.on_context}`;
			t5 = space();
			a3 = element("a");
			a3.textContent = `${l.on_drag_start}`;
			t7 = space();
			a4 = element("a");
			a4.textContent = `${l.on_drag}`;
			t9 = space();
			a5 = element("a");
			a5.textContent = `${l.on_drag_end}`;
			t11 = space();
			a6 = element("a");
			a6.textContent = `${l.on_drop}`;
			t13 = space();
			a7 = element("a");
			a7.textContent = `${l.on_mouse_over}`;
			t15 = space();
			a8 = element("a");
			a8.textContent = `${l.on_mouse_up}`;
			t17 = space();
			a9 = element("a");
			a9.textContent = `${l.on_mouse_down}`;
			t19 = space();
			a10 = element("a");
			a10.textContent = `${l.on_change}`;
			t21 = space();
			a11 = element("a");
			a11.textContent = `${l.on_focus}`;
			t23 = space();
			a12 = element("a");
			a12.textContent = `${l.on_blur}`;
			t25 = space();
			a13 = element("a");
			a13.textContent = `${l.on_key_up}`;
			t27 = space();
			a14 = element("a");
			a14.textContent = `${l.on_key_press}`;
			t29 = space();
			a15 = element("a");
			a15.textContent = `${l.on_key_down}`;
			t31 = space();
			div2 = element("div");
			t32 = space();
			div3 = element("div");
			input0 = element("input");
			t33 = space();
			input1 = element("input");
			t34 = space();
			input2 = element("input");
			t35 = space();
			input3 = element("input");
			t36 = space();
			input4 = element("input");
			t37 = space();
			input5 = element("input");
			t38 = space();
			input6 = element("input");
			t39 = space();
			input7 = element("input");
			t40 = space();
			input8 = element("input");
			t41 = space();
			input9 = element("input");
			t42 = space();
			input10 = element("input");
			t43 = space();
			input11 = element("input");
			t44 = space();
			input12 = element("input");
			t45 = space();
			input13 = element("input");
			t46 = space();
			input14 = element("input");
			t47 = space();
			input15 = element("input");
			attr_dev(a0, "for", "onclick");
			attr_dev(a0, "class", "list-group-item active");
			attr_dev(a0, "href", "javascript:;");
			add_location(a0, file$g, 14, 12, 424);
			attr_dev(a1, "for", "ondblclick");
			attr_dev(a1, "class", "list-group-item");
			attr_dev(a1, "href", "javascript:;");
			add_location(a1, file$g, 15, 12, 522);
			attr_dev(a2, "for", "oncontextmenu");
			attr_dev(a2, "class", "list-group-item");
			attr_dev(a2, "href", "javascript:;");
			add_location(a2, file$g, 16, 12, 620);
			attr_dev(a3, "for", "ondragstart");
			attr_dev(a3, "class", "list-group-item");
			attr_dev(a3, "href", "javascript:;");
			add_location(a3, file$g, 17, 12, 719);
			attr_dev(a4, "for", "ondrag");
			attr_dev(a4, "class", "list-group-item");
			attr_dev(a4, "href", "javascript:;");
			add_location(a4, file$g, 18, 12, 819);
			attr_dev(a5, "for", "ondragend");
			attr_dev(a5, "class", "list-group-item");
			attr_dev(a5, "href", "javascript:;");
			add_location(a5, file$g, 19, 12, 908);
			attr_dev(a6, "for", "ondrop");
			attr_dev(a6, "class", "list-group-item");
			attr_dev(a6, "href", "javascript:;");
			add_location(a6, file$g, 20, 12, 1004);
			attr_dev(a7, "for", "onmouseover");
			attr_dev(a7, "class", "list-group-item");
			attr_dev(a7, "href", "javascript:;");
			add_location(a7, file$g, 21, 12, 1093);
			attr_dev(a8, "for", "onmouseup");
			attr_dev(a8, "class", "list-group-item");
			attr_dev(a8, "href", "javascript:;");
			add_location(a8, file$g, 22, 12, 1193);
			attr_dev(a9, "for", "onmousedown");
			attr_dev(a9, "class", "list-group-item");
			attr_dev(a9, "href", "javascript:;");
			add_location(a9, file$g, 23, 12, 1289);
			attr_dev(a10, "for", "onchange");
			attr_dev(a10, "class", "list-group-item");
			attr_dev(a10, "href", "javascript:;");
			add_location(a10, file$g, 24, 12, 1389);
			attr_dev(a11, "for", "onfocus");
			attr_dev(a11, "class", "list-group-item");
			attr_dev(a11, "href", "javascript:;");
			add_location(a11, file$g, 25, 12, 1482);
			attr_dev(a12, "for", "onblur");
			attr_dev(a12, "class", "list-group-item");
			attr_dev(a12, "href", "javascript:;");
			add_location(a12, file$g, 26, 12, 1573);
			attr_dev(a13, "for", "onkeyup");
			attr_dev(a13, "class", "list-group-item");
			attr_dev(a13, "href", "javascript:;");
			add_location(a13, file$g, 27, 12, 1662);
			attr_dev(a14, "for", "onkeypress");
			attr_dev(a14, "class", "list-group-item");
			attr_dev(a14, "href", "javascript:;");
			add_location(a14, file$g, 28, 12, 1754);
			attr_dev(a15, "for", "onkeydown");
			attr_dev(a15, "class", "list-group-item");
			attr_dev(a15, "href", "javascript:;");
			add_location(a15, file$g, 29, 12, 1852);
			attr_dev(div0, "class", "list-group");
			add_location(div0, file$g, 13, 8, 386);
			attr_dev(div1, "class", "row-fluid events");
			set_style(div1, "height", "221px");
			add_location(div1, file$g, 12, 4, 323);
			attr_dev(div2, "class", "clearboth mb-3");
			add_location(div2, file$g, 32, 4, 1968);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "onclick");
			attr_dev(input0, "class", "form-control form-control-md show w-100 border rounded");
			attr_dev(input0, "name", "onclick");
			attr_dev(input0, "placeholder", input0_placeholder_value = l.func_for + l.on_click);
			add_location(input0, file$g, 34, 8, 2065);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "id", "ondblclick");
			attr_dev(input1, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input1, "name", "ondblclick");
			attr_dev(input1, "placeholder", input1_placeholder_value = l.func_for + l.on_dbl_click);
			add_location(input1, file$g, 35, 8, 2226);
			attr_dev(input2, "type", "text");
			attr_dev(input2, "id", "oncontextmenu");
			attr_dev(input2, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input2, "name", "oncontextmenu");
			attr_dev(input2, "placeholder", input2_placeholder_value = l.func_for + l.on_context);
			add_location(input2, file$g, 36, 8, 2394);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "id", "ondragstart");
			attr_dev(input3, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input3, "name", "ondragstart");
			attr_dev(input3, "placeholder", input3_placeholder_value = l.func_for + l.on_drag_start);
			add_location(input3, file$g, 37, 8, 2566);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "id", "ondrag");
			attr_dev(input4, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input4, "name", "ondrag");
			attr_dev(input4, "placeholder", input4_placeholder_value = l.func_for + l.on_drag);
			add_location(input4, file$g, 38, 8, 2737);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "id", "ondragend");
			attr_dev(input5, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input5, "name", "ondragend");
			attr_dev(input5, "placeholder", input5_placeholder_value = l.func_for + l.on_drag_end);
			add_location(input5, file$g, 39, 8, 2892);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "id", "ondrop");
			attr_dev(input6, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input6, "name", "ondrop");
			attr_dev(input6, "placeholder", input6_placeholder_value = l.func_for + l.on_drop);
			add_location(input6, file$g, 40, 8, 3057);
			attr_dev(input7, "type", "text");
			attr_dev(input7, "id", "onmouseover");
			attr_dev(input7, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input7, "name", "onmouseover");
			attr_dev(input7, "placeholder", input7_placeholder_value = l.func_for + l.on_mouse_over);
			add_location(input7, file$g, 41, 8, 3212);
			attr_dev(input8, "type", "text");
			attr_dev(input8, "id", "onmouseup");
			attr_dev(input8, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input8, "name", "onmouseup");
			attr_dev(input8, "placeholder", input8_placeholder_value = l.func_for + l.on_mouse_up);
			add_location(input8, file$g, 42, 8, 3383);
			attr_dev(input9, "type", "text");
			attr_dev(input9, "id", "onmousedown");
			attr_dev(input9, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input9, "name", "onmousedown");
			attr_dev(input9, "placeholder", input9_placeholder_value = l.func_for + l.on_mouse_down);
			add_location(input9, file$g, 43, 8, 3548);
			attr_dev(input10, "type", "text");
			attr_dev(input10, "id", "onchange");
			attr_dev(input10, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input10, "name", "onchange");
			attr_dev(input10, "placeholder", input10_placeholder_value = l.func_for + l.on_change);
			add_location(input10, file$g, 44, 8, 3719);
			attr_dev(input11, "type", "text");
			attr_dev(input11, "id", "onfocus");
			attr_dev(input11, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input11, "name", "onfocus");
			attr_dev(input11, "placeholder", input11_placeholder_value = l.func_for + l.on_focus);
			add_location(input11, file$g, 45, 8, 3880);
			attr_dev(input12, "type", "text");
			attr_dev(input12, "id", "onblur");
			attr_dev(input12, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input12, "name", "onblur");
			attr_dev(input12, "placeholder", input12_placeholder_value = l.func_for + l.on_blur);
			add_location(input12, file$g, 46, 8, 4038);
			attr_dev(input13, "type", "text");
			attr_dev(input13, "id", "onkeyup");
			attr_dev(input13, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input13, "name", "onkeyup");
			attr_dev(input13, "placeholder", input13_placeholder_value = l.func_for + l.on_key_up);
			add_location(input13, file$g, 47, 8, 4193);
			attr_dev(input14, "type", "text");
			attr_dev(input14, "id", "onkeypress");
			attr_dev(input14, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input14, "name", "onkeypress");
			attr_dev(input14, "placeholder", input14_placeholder_value = l.func_for + l.on_key_press);
			add_location(input14, file$g, 48, 8, 4352);
			attr_dev(input15, "type", "text");
			attr_dev(input15, "id", "onkeydown");
			attr_dev(input15, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input15, "name", "onkeydown");
			attr_dev(input15, "placeholder", input15_placeholder_value = l.func_for + l.on_key_down);
			add_location(input15, file$g, 49, 8, 4520);
			attr_dev(div3, "class", "row-fluid margin-top1 event-input");
			add_location(div3, file$g, 33, 4, 2008);
			add_location(div4, file$g, 11, 0, 312);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, div1);
			append_dev(div1, div0);
			append_dev(div0, a0);
			append_dev(div0, t1);
			append_dev(div0, a1);
			append_dev(div0, t3);
			append_dev(div0, a2);
			append_dev(div0, t5);
			append_dev(div0, a3);
			append_dev(div0, t7);
			append_dev(div0, a4);
			append_dev(div0, t9);
			append_dev(div0, a5);
			append_dev(div0, t11);
			append_dev(div0, a6);
			append_dev(div0, t13);
			append_dev(div0, a7);
			append_dev(div0, t15);
			append_dev(div0, a8);
			append_dev(div0, t17);
			append_dev(div0, a9);
			append_dev(div0, t19);
			append_dev(div0, a10);
			append_dev(div0, t21);
			append_dev(div0, a11);
			append_dev(div0, t23);
			append_dev(div0, a12);
			append_dev(div0, t25);
			append_dev(div0, a13);
			append_dev(div0, t27);
			append_dev(div0, a14);
			append_dev(div0, t29);
			append_dev(div0, a15);
			append_dev(div4, t31);
			append_dev(div4, div2);
			append_dev(div4, t32);
			append_dev(div4, div3);
			append_dev(div3, input0);
			append_dev(div3, t33);
			append_dev(div3, input1);
			append_dev(div3, t34);
			append_dev(div3, input2);
			append_dev(div3, t35);
			append_dev(div3, input3);
			append_dev(div3, t36);
			append_dev(div3, input4);
			append_dev(div3, t37);
			append_dev(div3, input5);
			append_dev(div3, t38);
			append_dev(div3, input6);
			append_dev(div3, t39);
			append_dev(div3, input7);
			append_dev(div3, t40);
			append_dev(div3, input8);
			append_dev(div3, t41);
			append_dev(div3, input9);
			append_dev(div3, t42);
			append_dev(div3, input10);
			append_dev(div3, t43);
			append_dev(div3, input11);
			append_dev(div3, t44);
			append_dev(div3, input12);
			append_dev(div3, t45);
			append_dev(div3, input13);
			append_dev(div3, t46);
			append_dev(div3, input14);
			append_dev(div3, t47);
			append_dev(div3, input15);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ModalEvent', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalEvent> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ l });
	return [];
}

class ModalEvent extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ModalEvent",
			options,
			id: create_fragment$g.name
		});
	}
}

/* clsSMDragNDrop\libs\authoring\DndModalBox.svelte generated by Svelte v3.40.2 */
const file$h = "clsSMDragNDrop\\libs\\authoring\\DndModalBox.svelte";

function add_css(target) {
	append_styles(target, "svelte-16t69t", ".modal_height.svelte-16t69t{max-height:417px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG5kTW9kYWxCb3guc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXV3Q0ksYUFBYSxjQUFDLENBQUMsQUFDWCxVQUFVLENBQUUsS0FBSyxBQUNyQixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkRuZE1vZGFsQm94LnN2ZWx0ZSJdfQ== */");
}

// (727:24) {#if isDNDExtended == 1}
function create_if_block$g(ctx) {
	let div2;
	let div0;
	let label;
	let t1;
	let textarea;
	let textarea_placeholder_value;
	let t2;
	let div1;
	let modalevent;
	let current;
	modalevent = new ModalEvent({ $$inline: true });

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			label = element("label");
			label.textContent = `${l.css_style}`;
			t1 = space();
			textarea = element("textarea");
			t2 = space();
			div1 = element("div");
			create_component(modalevent.$$.fragment);
			attr_dev(label, "class", "control-label font-weight-normal mb-0");
			attr_dev(label, "for", "tbd-style");
			add_location(label, file$h, 729, 36, 55873);
			attr_dev(textarea, "id", "tbd-style");
			attr_dev(textarea, "class", "form-control form-control-md height_34");
			attr_dev(textarea, "name", "style");
			attr_dev(textarea, "placeholder", textarea_placeholder_value = l.css_style_of_tabhead);
			add_location(textarea, file$h, 730, 36, 56001);
			attr_dev(div0, "class", "form-group");
			add_location(div0, file$h, 728, 32, 55811);
			attr_dev(div1, "class", "ev");
			attr_dev(div1, "type", "tbd");
			add_location(div1, file$h, 732, 32, 56210);
			attr_dev(div2, "class", "col-sm-6 pr-1 pl-2");
			add_location(div2, file$h, 727, 28, 55745);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, label);
			append_dev(div0, t1);
			append_dev(div0, textarea);
			append_dev(div2, t2);
			append_dev(div2, div1);
			mount_component(modalevent, div1, null);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(modalevent.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modalevent.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(modalevent);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$g.name,
		type: "if",
		source: "(727:24) {#if isDNDExtended == 1}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let div438;
	let div437;
	let div436;
	let div0;
	let h4;
	let t1;
	let button0;
	let t3;
	let div434;
	let div30;
	let div29;
	let div22;
	let div21;
	let div2;
	let div1;
	let label0;
	let t5;
	let input0;
	let input0_placeholder_value;
	let t6;
	let div4;
	let div3;
	let label1;
	let t8;
	let input1;
	let input1_placeholder_value;
	let t9;
	let div6;
	let div5;
	let label2;
	let t11;
	let input2;
	let input2_placeholder_value;
	let t12;
	let div8;
	let div7;
	let label3;
	let t14;
	let input3;
	let input3_placeholder_value;
	let t15;
	let div10;
	let div9;
	let label4;
	let t17;
	let input4;
	let input4_placeholder_value;
	let t18;
	let div12;
	let div11;
	let label5;
	let t20;
	let select0;
	let option0;
	let option1;
	let option2;
	let t24;
	let div14;
	let div13;
	let label6;
	let t26;
	let input5;
	let input5_placeholder_value;
	let t27;
	let div16;
	let div15;
	let label7;
	let t29;
	let input6;
	let input6_placeholder_value;
	let t30;
	let button1;
	let t32;
	let div18;
	let div17;
	let input7;
	let t33;
	let label8;
	let t35;
	let div20;
	let div19;
	let input8;
	let t36;
	let label9;
	let t38;
	let div28;
	let div27;
	let div24;
	let div23;
	let label10;
	let t40;
	let textarea0;
	let textarea0_placeholder_value;
	let t41;
	let div26;
	let div25;
	let label11;
	let t43;
	let input9;
	let input9_placeholder_value;
	let t44;
	let input10;
	let t45;
	let div60;
	let div59;
	let div55;
	let div35;
	let div32;
	let div31;
	let label12;
	let t47;
	let input11;
	let input11_placeholder_value;
	let t48;
	let div34;
	let div33;
	let label13;
	let t50;
	let input12;
	let input12_placeholder_value;
	let t51;
	let div40;
	let div37;
	let div36;
	let label14;
	let t53;
	let input13;
	let input13_placeholder_value;
	let t54;
	let div39;
	let div38;
	let label15;
	let t56;
	let input14;
	let input14_placeholder_value;
	let t57;
	let div45;
	let div42;
	let div41;
	let label16;
	let t59;
	let input15;
	let input15_placeholder_value;
	let t60;
	let div44;
	let div43;
	let label17;
	let t62;
	let select1;
	let option3;
	let option4;
	let option5;
	let t66;
	let div54;
	let div47;
	let div46;
	let label18;
	let t68;
	let input16;
	let input16_placeholder_value;
	let t69;
	let div49;
	let div48;
	let label19;
	let t71;
	let input17;
	let input17_placeholder_value;
	let t72;
	let div51;
	let div50;
	let label20;
	let t74;
	let input18;
	let input18_placeholder_value;
	let t75;
	let div53;
	let div52;
	let input19;
	let t76;
	let label21;
	let t78;
	let input20;
	let t79;
	let div58;
	let div56;
	let label22;
	let t81;
	let textarea1;
	let textarea1_placeholder_value;
	let t82;
	let div57;
	let modalevent0;
	let t83;
	let div92;
	let div91;
	let div86;
	let div65;
	let div62;
	let div61;
	let label23;
	let t85;
	let input21;
	let input21_placeholder_value;
	let t86;
	let div64;
	let div63;
	let label24;
	let t88;
	let input22;
	let input22_placeholder_value;
	let t89;
	let div70;
	let div67;
	let div66;
	let label25;
	let t91;
	let input23;
	let input23_placeholder_value;
	let t92;
	let div69;
	let div68;
	let label26;
	let t94;
	let input24;
	let input24_placeholder_value;
	let t95;
	let div85;
	let div72;
	let div71;
	let label27;
	let t97;
	let input25;
	let input25_placeholder_value;
	let t98;
	let div74;
	let div73;
	let label28;
	let t100;
	let input26;
	let input26_placeholder_value;
	let t101;
	let div76;
	let div75;
	let label29;
	let t103;
	let input27;
	let input27_placeholder_value;
	let t104;
	let div78;
	let div77;
	let label30;
	let t106;
	let select2;
	let option6;
	let option7;
	let t109;
	let div80;
	let div79;
	let label31;
	let t111;
	let select3;
	let option8;
	let option9;
	let t114;
	let div82;
	let div81;
	let input28;
	let t115;
	let label32;
	let t117;
	let div84;
	let div83;
	let input29;
	let t118;
	let label33;
	let t120;
	let input30;
	let t121;
	let div90;
	let div87;
	let label34;
	let t123;
	let textarea2;
	let textarea2_placeholder_value;
	let t124;
	let div88;
	let label35;
	let t126;
	let select4;
	let t127;
	let div89;
	let modalevent1;
	let t128;
	let div120;
	let div119;
	let div114;
	let div97;
	let div94;
	let div93;
	let label36;
	let t130;
	let input31;
	let input31_placeholder_value;
	let t131;
	let div96;
	let div95;
	let label37;
	let t133;
	let input32;
	let input32_placeholder_value;
	let t134;
	let div102;
	let div99;
	let div98;
	let label38;
	let t136;
	let input33;
	let input33_placeholder_value;
	let t137;
	let div101;
	let div100;
	let label39;
	let t139;
	let input34;
	let input34_placeholder_value;
	let t140;
	let div113;
	let div104;
	let div103;
	let label40;
	let t142;
	let textarea3;
	let textarea3_placeholder_value;
	let t143;
	let div106;
	let div105;
	let label41;
	let t145;
	let textarea4;
	let textarea4_placeholder_value;
	let t146;
	let div108;
	let div107;
	let label42;
	let t148;
	let input35;
	let input35_placeholder_value;
	let t149;
	let div110;
	let div109;
	let label43;
	let t151;
	let select5;
	let option10;
	let option11;
	let t154;
	let div112;
	let div111;
	let input36;
	let t155;
	let label44;
	let t157;
	let input37;
	let t158;
	let div118;
	let div115;
	let label45;
	let t160;
	let textarea5;
	let t161;
	let div116;
	let label46;
	let t163;
	let select6;
	let t164;
	let div117;
	let modalevent2;
	let t165;
	let div141;
	let div140;
	let div136;
	let div125;
	let div122;
	let div121;
	let label47;
	let t167;
	let input38;
	let t168;
	let div124;
	let div123;
	let label48;
	let t170;
	let input39;
	let input39_placeholder_value;
	let t171;
	let div130;
	let div127;
	let div126;
	let label49;
	let t173;
	let input40;
	let input40_placeholder_value;
	let t174;
	let div129;
	let div128;
	let label50;
	let t176;
	let input41;
	let input41_placeholder_value;
	let t177;
	let div135;
	let div132;
	let div131;
	let label51;
	let t179;
	let input42;
	let input42_placeholder_value;
	let t180;
	let div134;
	let div133;
	let label52;
	let t182;
	let input43;
	let input43_placeholder_value;
	let t183;
	let input44;
	let t184;
	let div139;
	let div137;
	let label53;
	let t186;
	let textarea6;
	let textarea6_placeholder_value;
	let t187;
	let div138;
	let modalevent3;
	let t188;
	let div166;
	let div165;
	let div161;
	let div146;
	let div143;
	let div142;
	let label54;
	let t190;
	let input45;
	let input45_placeholder_value;
	let t191;
	let div145;
	let div144;
	let label55;
	let t193;
	let input46;
	let input46_placeholder_value;
	let t194;
	let div151;
	let div148;
	let div147;
	let label56;
	let t196;
	let input47;
	let input47_placeholder_value;
	let t197;
	let div150;
	let div149;
	let label57;
	let t199;
	let input48;
	let input48_placeholder_value;
	let t200;
	let div160;
	let div153;
	let div152;
	let label58;
	let t202;
	let input49;
	let t203;
	let div155;
	let div154;
	let label59;
	let t205;
	let input50;
	let input50_placeholder_value;
	let t206;
	let div157;
	let div156;
	let label60;
	let t208;
	let input51;
	let input51_placeholder_value;
	let t209;
	let div159;
	let div158;
	let label61;
	let t211;
	let input52;
	let input52_placeholder_value;
	let t212;
	let input53;
	let t213;
	let div164;
	let div162;
	let label62;
	let t215;
	let textarea7;
	let textarea7_placeholder_value;
	let t216;
	let div163;
	let modalevent4;
	let t217;
	let div187;
	let div186;
	let div182;
	let div171;
	let div168;
	let div167;
	let label63;
	let t219;
	let input54;
	let input54_placeholder_value;
	let t220;
	let div170;
	let div169;
	let label64;
	let t222;
	let input55;
	let input55_placeholder_value;
	let t223;
	let div176;
	let div173;
	let div172;
	let label65;
	let t225;
	let input56;
	let input56_placeholder_value;
	let t226;
	let div175;
	let div174;
	let label66;
	let t228;
	let input57;
	let input57_placeholder_value;
	let t229;
	let div181;
	let div178;
	let div177;
	let label67;
	let t231;
	let input58;
	let input58_placeholder_value;
	let t232;
	let div180;
	let div179;
	let label68;
	let t234;
	let input59;
	let input59_placeholder_value;
	let t235;
	let input60;
	let t236;
	let div185;
	let div183;
	let label69;
	let t238;
	let textarea8;
	let textarea8_placeholder_value;
	let t239;
	let div184;
	let modalevent5;
	let t240;
	let div206;
	let div205;
	let div201;
	let div192;
	let div189;
	let div188;
	let label70;
	let t242;
	let input61;
	let input61_placeholder_value;
	let t243;
	let div191;
	let div190;
	let label71;
	let t245;
	let input62;
	let input62_placeholder_value;
	let t246;
	let div197;
	let div194;
	let div193;
	let label72;
	let t248;
	let input63;
	let input63_placeholder_value;
	let t249;
	let div196;
	let div195;
	let label73;
	let t251;
	let input64;
	let input64_placeholder_value;
	let t252;
	let div200;
	let div199;
	let div198;
	let label74;
	let t254;
	let textarea9;
	let textarea9_placeholder_value;
	let t255;
	let input65;
	let t256;
	let div204;
	let div202;
	let label75;
	let t258;
	let textarea10;
	let textarea10_placeholder_value;
	let t259;
	let div203;
	let modalevent6;
	let t260;
	let div227;
	let div226;
	let div222;
	let div211;
	let div208;
	let div207;
	let label76;
	let t262;
	let input66;
	let input66_placeholder_value;
	let t263;
	let div210;
	let div209;
	let label77;
	let t265;
	let input67;
	let input67_placeholder_value;
	let t266;
	let div216;
	let div213;
	let div212;
	let label78;
	let t268;
	let input68;
	let input68_placeholder_value;
	let t269;
	let div215;
	let div214;
	let label79;
	let t271;
	let input69;
	let input69_placeholder_value;
	let t272;
	let div221;
	let div218;
	let div217;
	let label80;
	let t274;
	let textarea11;
	let textarea11_placeholder_value;
	let t275;
	let div220;
	let div219;
	let input70;
	let t276;
	let label81;
	let t278;
	let input71;
	let t279;
	let input72;
	let t280;
	let div225;
	let div223;
	let label82;
	let t282;
	let textarea12;
	let textarea12_placeholder_value;
	let t283;
	let div224;
	let modalevent7;
	let t284;
	let div245;
	let div244;
	let div243;
	let div232;
	let div229;
	let div228;
	let label83;
	let t286;
	let input73;
	let input73_placeholder_value;
	let t287;
	let div231;
	let div230;
	let label84;
	let t289;
	let input74;
	let input74_placeholder_value;
	let t290;
	let div237;
	let div234;
	let div233;
	let label85;
	let t292;
	let input75;
	let input75_placeholder_value;
	let t293;
	let div236;
	let div235;
	let label86;
	let t295;
	let input76;
	let input76_placeholder_value;
	let t296;
	let div242;
	let div239;
	let div238;
	let label87;
	let t298;
	let input77;
	let input77_placeholder_value;
	let t299;
	let div241;
	let div240;
	let label88;
	let t301;
	let input78;
	let input78_placeholder_value;
	let t302;
	let input79;
	let div243_class_value;
	let t303;
	let t304;
	let div266;
	let div265;
	let div261;
	let div250;
	let div247;
	let div246;
	let label89;
	let t306;
	let input80;
	let input80_placeholder_value;
	let t307;
	let div249;
	let div248;
	let label90;
	let t309;
	let input81;
	let input81_placeholder_value;
	let t310;
	let div255;
	let div252;
	let div251;
	let label91;
	let t312;
	let input82;
	let input82_placeholder_value;
	let t313;
	let div254;
	let div253;
	let label92;
	let t315;
	let input83;
	let input83_placeholder_value;
	let t316;
	let div260;
	let div257;
	let div256;
	let label93;
	let t318;
	let input84;
	let input84_placeholder_value;
	let t319;
	let div259;
	let div258;
	let label94;
	let t321;
	let input85;
	let input85_placeholder_value;
	let t322;
	let input86;
	let t323;
	let div264;
	let div262;
	let label95;
	let t325;
	let textarea13;
	let textarea13_placeholder_value;
	let t326;
	let div263;
	let modalevent8;
	let t327;
	let div294;
	let div293;
	let div288;
	let div287;
	let div268;
	let div267;
	let label96;
	let t329;
	let input87;
	let input87_placeholder_value;
	let t330;
	let div270;
	let div269;
	let label97;
	let t332;
	let input88;
	let input88_placeholder_value;
	let t333;
	let div272;
	let div271;
	let label98;
	let t335;
	let input89;
	let input89_placeholder_value;
	let t336;
	let div274;
	let div273;
	let label99;
	let t338;
	let input90;
	let input90_placeholder_value;
	let t339;
	let div276;
	let div275;
	let label100;
	let t341;
	let input91;
	let input91_placeholder_value;
	let t342;
	let div278;
	let div277;
	let label101;
	let t344;
	let select7;
	let option12;
	let option13;
	let option14;
	let option15;
	let option16;
	let option17;
	let t351;
	let div280;
	let div279;
	let label102;
	let t353;
	let select8;
	let option18;
	let option19;
	let option20;
	let option21;
	let option22;
	let t359;
	let div282;
	let div281;
	let label103;
	let t361;
	let select9;
	let option23;
	let option24;
	let option25;
	let option26;
	let t366;
	let input92;
	let t367;
	let div284;
	let div283;
	let label104;
	let t369;
	let select10;
	let t370;
	let div286;
	let div285;
	let input93;
	let t371;
	let label105;
	let t373;
	let div292;
	let div291;
	let div290;
	let div289;
	let modalevent9;
	let t374;
	let div315;
	let div314;
	let div312;
	let div303;
	let div296;
	let div295;
	let label106;
	let t376;
	let input94;
	let input94_placeholder_value;
	let t377;
	let div298;
	let div297;
	let label107;
	let t379;
	let input95;
	let input95_placeholder_value;
	let t380;
	let div300;
	let div299;
	let label108;
	let t382;
	let input96;
	let input96_placeholder_value;
	let t383;
	let div302;
	let div301;
	let label109;
	let t385;
	let input97;
	let input97_placeholder_value;
	let t386;
	let div308;
	let div305;
	let div304;
	let label110;
	let t388;
	let input98;
	let input98_placeholder_value;
	let t389;
	let div307;
	let div306;
	let label111;
	let t391;
	let input99;
	let input99_placeholder_value;
	let t392;
	let div311;
	let div310;
	let div309;
	let label112;
	let t394;
	let input100;
	let input100_placeholder_value;
	let t395;
	let input101;
	let t396;
	let div313;
	let t397;
	let div336;
	let div335;
	let div333;
	let div324;
	let div317;
	let div316;
	let label113;
	let t399;
	let input102;
	let input102_placeholder_value;
	let t400;
	let div319;
	let div318;
	let label114;
	let t402;
	let input103;
	let input103_placeholder_value;
	let t403;
	let div321;
	let div320;
	let label115;
	let t405;
	let input104;
	let input104_placeholder_value;
	let t406;
	let div323;
	let div322;
	let label116;
	let t408;
	let input105;
	let input105_placeholder_value;
	let t409;
	let div329;
	let div326;
	let div325;
	let label117;
	let t411;
	let input106;
	let input106_placeholder_value;
	let t412;
	let div328;
	let div327;
	let label118;
	let t414;
	let input107;
	let input107_placeholder_value;
	let t415;
	let div332;
	let div331;
	let div330;
	let label119;
	let t417;
	let input108;
	let input108_placeholder_value;
	let t418;
	let input109;
	let t419;
	let div334;
	let t420;
	let div358;
	let div357;
	let div356;
	let div345;
	let div338;
	let div337;
	let label120;
	let t422;
	let input110;
	let input110_placeholder_value;
	let t423;
	let div340;
	let div339;
	let label121;
	let t425;
	let input111;
	let input111_placeholder_value;
	let t426;
	let div342;
	let div341;
	let label122;
	let t428;
	let input112;
	let input112_placeholder_value;
	let t429;
	let div344;
	let div343;
	let label123;
	let t431;
	let input113;
	let input113_placeholder_value;
	let t432;
	let div350;
	let div347;
	let div346;
	let label124;
	let t434;
	let input114;
	let input114_placeholder_value;
	let t435;
	let div349;
	let div348;
	let label125;
	let t437;
	let input115;
	let input115_placeholder_value;
	let t438;
	let div355;
	let div352;
	let div351;
	let label126;
	let t440;
	let input116;
	let input116_placeholder_value;
	let t441;
	let div354;
	let div353;
	let input117;
	let t442;
	let label127;
	let t444;
	let input118;
	let t445;
	let div370;
	let div369;
	let div368;
	let div367;
	let div360;
	let div359;
	let label128;
	let t447;
	let input119;
	let input119_placeholder_value;
	let t448;
	let div362;
	let div361;
	let label129;
	let t450;
	let input120;
	let input120_placeholder_value;
	let t451;
	let div364;
	let div363;
	let label130;
	let t453;
	let input121;
	let input121_placeholder_value;
	let t454;
	let div366;
	let div365;
	let label131;
	let t456;
	let input122;
	let input122_placeholder_value;
	let t457;
	let input123;
	let t458;
	let div383;
	let div382;
	let div381;
	let div375;
	let div372;
	let div371;
	let label132;
	let t460;
	let input124;
	let input124_placeholder_value;
	let t461;
	let div374;
	let div373;
	let label133;
	let t463;
	let input125;
	let input125_placeholder_value;
	let t464;
	let div380;
	let div377;
	let div376;
	let label134;
	let t466;
	let input126;
	let input126_placeholder_value;
	let t467;
	let button2;
	let t469;
	let div379;
	let div378;
	let input127;
	let t470;
	let label135;
	let t472;
	let input128;
	let t473;
	let div394;
	let div393;
	let div392;
	let div388;
	let div385;
	let div384;
	let label136;
	let t475;
	let input129;
	let input129_placeholder_value;
	let t476;
	let button3;
	let t478;
	let div387;
	let div386;
	let label137;
	let t480;
	let input130;
	let t481;
	let div391;
	let div390;
	let div389;
	let input131;
	let t482;
	let label138;
	let t484;
	let input132;
	let t485;
	let div409;
	let div408;
	let div407;
	let div401;
	let div396;
	let div395;
	let label139;
	let t487;
	let input133;
	let input133_placeholder_value;
	let t488;
	let div398;
	let div397;
	let label140;
	let t490;
	let input134;
	let input134_placeholder_value;
	let t491;
	let div400;
	let div399;
	let label141;
	let t493;
	let input135;
	let input135_placeholder_value;
	let t494;
	let div406;
	let div403;
	let div402;
	let label142;
	let t496;
	let input136;
	let input136_placeholder_value;
	let t497;
	let div405;
	let button4;
	let t499;
	let div404;
	let input137;
	let input137_checked_value;
	let t500;
	let label143;
	let t502;
	let div410;
	let textarea14;
	let textarea14_style_value;
	let t503;
	let div433;
	let div432;
	let div428;
	let div415;
	let div412;
	let div411;
	let label144;
	let t505;
	let input138;
	let input138_placeholder_value;
	let t506;
	let div414;
	let div413;
	let label145;
	let t508;
	let input139;
	let input139_placeholder_value;
	let t509;
	let div420;
	let div417;
	let div416;
	let label146;
	let t511;
	let input140;
	let input140_placeholder_value;
	let t512;
	let div419;
	let div418;
	let label147;
	let t514;
	let input141;
	let input141_placeholder_value;
	let t515;
	let div427;
	let div422;
	let div421;
	let label148;
	let t517;
	let input142;
	let input142_placeholder_value;
	let t518;
	let div424;
	let div423;
	let label149;
	let t520;
	let input143;
	let input143_placeholder_value;
	let t521;
	let div426;
	let div425;
	let label150;
	let t523;
	let input144;
	let input144_placeholder_value;
	let t524;
	let input145;
	let t525;
	let div431;
	let div429;
	let label151;
	let t527;
	let textarea15;
	let textarea15_placeholder_value;
	let t528;
	let div430;
	let modalevent10;
	let t529;
	let div435;
	let button5;
	let t531;
	let button6;
	let t533;
	let button7;
	let current;
	modalevent0 = new ModalEvent({ $$inline: true });
	modalevent1 = new ModalEvent({ $$inline: true });
	modalevent2 = new ModalEvent({ $$inline: true });
	modalevent3 = new ModalEvent({ $$inline: true });
	modalevent4 = new ModalEvent({ $$inline: true });
	modalevent5 = new ModalEvent({ $$inline: true });
	modalevent6 = new ModalEvent({ $$inline: true });
	modalevent7 = new ModalEvent({ $$inline: true });
	let if_block = /*isDNDExtended*/ ctx[0] == 1 && create_if_block$g(ctx);
	modalevent8 = new ModalEvent({ $$inline: true });
	modalevent9 = new ModalEvent({ $$inline: true });
	modalevent10 = new ModalEvent({ $$inline: true });

	const block = {
		c: function create() {
			div438 = element("div");
			div437 = element("div");
			div436 = element("div");
			div0 = element("div");
			h4 = element("h4");
			h4.textContent = `${l.draggable}`;
			t1 = space();
			button0 = element("button");
			button0.textContent = "×";
			t3 = space();
			div434 = element("div");
			div30 = element("div");
			div29 = element("div");
			div22 = element("div");
			div21 = element("div");
			div2 = element("div");
			div1 = element("div");
			label0 = element("label");
			label0.textContent = `${l.width_label1}`;
			t5 = space();
			input0 = element("input");
			t6 = space();
			div4 = element("div");
			div3 = element("div");
			label1 = element("label");
			label1.textContent = `${l.height_label1}`;
			t8 = space();
			input1 = element("input");
			t9 = space();
			div6 = element("div");
			div5 = element("div");
			label2 = element("label");
			label2.textContent = `${l.top}`;
			t11 = space();
			input2 = element("input");
			t12 = space();
			div8 = element("div");
			div7 = element("div");
			label3 = element("label");
			label3.textContent = `${l.left}`;
			t14 = space();
			input3 = element("input");
			t15 = space();
			div10 = element("div");
			div9 = element("div");
			label4 = element("label");
			label4.textContent = `${l.title}`;
			t17 = space();
			input4 = element("input");
			t18 = space();
			div12 = element("div");
			div11 = element("div");
			label5 = element("label");
			label5.textContent = `${l.border_color}`;
			t20 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = `${l.none}`;
			option1 = element("option");
			option1.textContent = `${l.black}`;
			option2 = element("option");
			option2.textContent = `${l.gray}`;
			t24 = space();
			div14 = element("div");
			div13 = element("div");
			label6 = element("label");
			label6.textContent = `${l.grp_name}`;
			t26 = space();
			input5 = element("input");
			t27 = space();
			div16 = element("div");
			div15 = element("div");
			label7 = element("label");
			label7.textContent = `${l.background_image}`;
			t29 = space();
			input6 = element("input");
			t30 = space();
			button1 = element("button");
			button1.textContent = `${l.upload_media_text}`;
			t32 = space();
			div18 = element("div");
			div17 = element("div");
			input7 = element("input");
			t33 = space();
			label8 = element("label");
			label8.textContent = `${l.multiple_drag}`;
			t35 = space();
			div20 = element("div");
			div19 = element("div");
			input8 = element("input");
			t36 = space();
			label9 = element("label");
			label9.textContent = `${l.invisible}`;
			t38 = space();
			div28 = element("div");
			div27 = element("div");
			div24 = element("div");
			div23 = element("div");
			label10 = element("label");
			label10.textContent = `${l.css_style}`;
			t40 = space();
			textarea0 = element("textarea");
			t41 = space();
			div26 = element("div");
			div25 = element("div");
			label11 = element("label");
			label11.textContent = `${l.detail}`;
			t43 = space();
			input9 = element("input");
			t44 = space();
			input10 = element("input");
			t45 = space();
			div60 = element("div");
			div59 = element("div");
			div55 = element("div");
			div35 = element("div");
			div32 = element("div");
			div31 = element("div");
			label12 = element("label");
			label12.textContent = `${l.width_label1}`;
			t47 = space();
			input11 = element("input");
			t48 = space();
			div34 = element("div");
			div33 = element("div");
			label13 = element("label");
			label13.textContent = `${l.height_label1}`;
			t50 = space();
			input12 = element("input");
			t51 = space();
			div40 = element("div");
			div37 = element("div");
			div36 = element("div");
			label14 = element("label");
			label14.textContent = `${l.top}`;
			t53 = space();
			input13 = element("input");
			t54 = space();
			div39 = element("div");
			div38 = element("div");
			label15 = element("label");
			label15.textContent = `${l.left}`;
			t56 = space();
			input14 = element("input");
			t57 = space();
			div45 = element("div");
			div42 = element("div");
			div41 = element("div");
			label16 = element("label");
			label16.textContent = `${l.title}`;
			t59 = space();
			input15 = element("input");
			t60 = space();
			div44 = element("div");
			div43 = element("div");
			label17 = element("label");
			label17.textContent = `${l.border_color}`;
			t62 = space();
			select1 = element("select");
			option3 = element("option");
			option3.textContent = `${l.none}`;
			option4 = element("option");
			option4.textContent = `${l.black}`;
			option5 = element("option");
			option5.textContent = `${l.gray}`;
			t66 = space();
			div54 = element("div");
			div47 = element("div");
			div46 = element("div");
			label18 = element("label");
			label18.textContent = `${l.grp_name}`;
			t68 = space();
			input16 = element("input");
			t69 = space();
			div49 = element("div");
			div48 = element("div");
			label19 = element("label");
			label19.textContent = `${l.correct_answer}`;
			t71 = space();
			input17 = element("input");
			t72 = space();
			div51 = element("div");
			div50 = element("div");
			label20 = element("label");
			label20.textContent = `${l.default_answer}`;
			t74 = space();
			input18 = element("input");
			t75 = space();
			div53 = element("div");
			div52 = element("div");
			input19 = element("input");
			t76 = space();
			label21 = element("label");
			label21.textContent = `${l.invisible}`;
			t78 = space();
			input20 = element("input");
			t79 = space();
			div58 = element("div");
			div56 = element("div");
			label22 = element("label");
			label22.textContent = `${l.css_style}`;
			t81 = space();
			textarea1 = element("textarea");
			t82 = space();
			div57 = element("div");
			create_component(modalevent0.$$.fragment);
			t83 = space();
			div92 = element("div");
			div91 = element("div");
			div86 = element("div");
			div65 = element("div");
			div62 = element("div");
			div61 = element("div");
			label23 = element("label");
			label23.textContent = `${l.width_label1}`;
			t85 = space();
			input21 = element("input");
			t86 = space();
			div64 = element("div");
			div63 = element("div");
			label24 = element("label");
			label24.textContent = `${l.height_label1}`;
			t88 = space();
			input22 = element("input");
			t89 = space();
			div70 = element("div");
			div67 = element("div");
			div66 = element("div");
			label25 = element("label");
			label25.textContent = `${l.top}`;
			t91 = space();
			input23 = element("input");
			t92 = space();
			div69 = element("div");
			div68 = element("div");
			label26 = element("label");
			label26.textContent = `${l.left}`;
			t94 = space();
			input24 = element("input");
			t95 = space();
			div85 = element("div");
			div72 = element("div");
			div71 = element("div");
			label27 = element("label");
			label27.textContent = `${l.correct_answer}`;
			t97 = space();
			input25 = element("input");
			t98 = space();
			div74 = element("div");
			div73 = element("div");
			label28 = element("label");
			label28.textContent = `${l.default_answer}`;
			t100 = space();
			input26 = element("input");
			t101 = space();
			div76 = element("div");
			div75 = element("div");
			label29 = element("label");
			label29.textContent = `${l.placeholder}`;
			t103 = space();
			input27 = element("input");
			t104 = space();
			div78 = element("div");
			div77 = element("div");
			label30 = element("label");
			label30.textContent = `${l.type}`;
			t106 = space();
			select2 = element("select");
			option6 = element("option");
			option6.textContent = `${l.text_box}`;
			option7 = element("option");
			option7.textContent = `${l.password}`;
			t109 = space();
			div80 = element("div");
			div79 = element("div");
			label31 = element("label");
			label31.textContent = `${l.parser}`;
			t111 = space();
			select3 = element("select");
			option8 = element("option");
			option8.textContent = `${l.parser_of_txt}`;
			option9 = element("option");
			option9.textContent = `${l.sql}`;
			t114 = space();
			div82 = element("div");
			div81 = element("div");
			input28 = element("input");
			t115 = space();
			label32 = element("label");
			label32.textContent = `${l.case_insensitive}`;
			t117 = space();
			div84 = element("div");
			div83 = element("div");
			input29 = element("input");
			t118 = space();
			label33 = element("label");
			label33.textContent = "Multiple Correct Answers";
			t120 = space();
			input30 = element("input");
			t121 = space();
			div90 = element("div");
			div87 = element("div");
			label34 = element("label");
			label34.textContent = `${l.css_style}`;
			t123 = space();
			textarea2 = element("textarea");
			t124 = space();
			div88 = element("div");
			label35 = element("label");
			label35.textContent = `${l.font_style}`;
			t126 = space();
			select4 = element("select");
			t127 = space();
			div89 = element("div");
			create_component(modalevent1.$$.fragment);
			t128 = space();
			div120 = element("div");
			div119 = element("div");
			div114 = element("div");
			div97 = element("div");
			div94 = element("div");
			div93 = element("div");
			label36 = element("label");
			label36.textContent = `${l.width_label1}`;
			t130 = space();
			input31 = element("input");
			t131 = space();
			div96 = element("div");
			div95 = element("div");
			label37 = element("label");
			label37.textContent = `${l.height_label1}`;
			t133 = space();
			input32 = element("input");
			t134 = space();
			div102 = element("div");
			div99 = element("div");
			div98 = element("div");
			label38 = element("label");
			label38.textContent = `${l.top}`;
			t136 = space();
			input33 = element("input");
			t137 = space();
			div101 = element("div");
			div100 = element("div");
			label39 = element("label");
			label39.textContent = `${l.left}`;
			t139 = space();
			input34 = element("input");
			t140 = space();
			div113 = element("div");
			div104 = element("div");
			div103 = element("div");
			label40 = element("label");
			label40.textContent = `${l.correct_answer}`;
			t142 = space();
			textarea3 = element("textarea");
			t143 = space();
			div106 = element("div");
			div105 = element("div");
			label41 = element("label");
			label41.textContent = `${l.default_answer}`;
			t145 = space();
			textarea4 = element("textarea");
			t146 = space();
			div108 = element("div");
			div107 = element("div");
			label42 = element("label");
			label42.textContent = `${l.placeholder}`;
			t148 = space();
			input35 = element("input");
			t149 = space();
			div110 = element("div");
			div109 = element("div");
			label43 = element("label");
			label43.textContent = `${l.parser}`;
			t151 = space();
			select5 = element("select");
			option10 = element("option");
			option10.textContent = `${l.parser_of_multiline}`;
			option11 = element("option");
			option11.textContent = `${l.sql}`;
			t154 = space();
			div112 = element("div");
			div111 = element("div");
			input36 = element("input");
			t155 = space();
			label44 = element("label");
			label44.textContent = `${l.case_insensitive}`;
			t157 = space();
			input37 = element("input");
			t158 = space();
			div118 = element("div");
			div115 = element("div");
			label45 = element("label");
			label45.textContent = `${l.css_style}`;
			t160 = space();
			textarea5 = element("textarea");
			t161 = space();
			div116 = element("div");
			label46 = element("label");
			label46.textContent = `${l.css_class}`;
			t163 = space();
			select6 = element("select");
			t164 = space();
			div117 = element("div");
			create_component(modalevent2.$$.fragment);
			t165 = space();
			div141 = element("div");
			div140 = element("div");
			div136 = element("div");
			div125 = element("div");
			div122 = element("div");
			div121 = element("div");
			label47 = element("label");
			label47.textContent = `${l.width_label1}`;
			t167 = space();
			input38 = element("input");
			t168 = space();
			div124 = element("div");
			div123 = element("div");
			label48 = element("label");
			label48.textContent = `${l.height_label1}`;
			t170 = space();
			input39 = element("input");
			t171 = space();
			div130 = element("div");
			div127 = element("div");
			div126 = element("div");
			label49 = element("label");
			label49.textContent = `${l.top}`;
			t173 = space();
			input40 = element("input");
			t174 = space();
			div129 = element("div");
			div128 = element("div");
			label50 = element("label");
			label50.textContent = `${l.left}`;
			t176 = space();
			input41 = element("input");
			t177 = space();
			div135 = element("div");
			div132 = element("div");
			div131 = element("div");
			label51 = element("label");
			label51.textContent = `${l.correct_answer}`;
			t179 = space();
			input42 = element("input");
			t180 = space();
			div134 = element("div");
			div133 = element("div");
			label52 = element("label");
			label52.textContent = `${l.default_answer}`;
			t182 = space();
			input43 = element("input");
			t183 = space();
			input44 = element("input");
			t184 = space();
			div139 = element("div");
			div137 = element("div");
			label53 = element("label");
			label53.textContent = `${l.css_style}`;
			t186 = space();
			textarea6 = element("textarea");
			t187 = space();
			div138 = element("div");
			create_component(modalevent3.$$.fragment);
			t188 = space();
			div166 = element("div");
			div165 = element("div");
			div161 = element("div");
			div146 = element("div");
			div143 = element("div");
			div142 = element("div");
			label54 = element("label");
			label54.textContent = `${l.width_label1}`;
			t190 = space();
			input45 = element("input");
			t191 = space();
			div145 = element("div");
			div144 = element("div");
			label55 = element("label");
			label55.textContent = `${l.height_label1}`;
			t193 = space();
			input46 = element("input");
			t194 = space();
			div151 = element("div");
			div148 = element("div");
			div147 = element("div");
			label56 = element("label");
			label56.textContent = `${l.top}`;
			t196 = space();
			input47 = element("input");
			t197 = space();
			div150 = element("div");
			div149 = element("div");
			label57 = element("label");
			label57.textContent = `${l.left}`;
			t199 = space();
			input48 = element("input");
			t200 = space();
			div160 = element("div");
			div153 = element("div");
			div152 = element("div");
			label58 = element("label");
			label58.textContent = `${l.name_text}`;
			t202 = space();
			input49 = element("input");
			t203 = space();
			div155 = element("div");
			div154 = element("div");
			label59 = element("label");
			label59.textContent = `${l.correct_answer}`;
			t205 = space();
			input50 = element("input");
			t206 = space();
			div157 = element("div");
			div156 = element("div");
			label60 = element("label");
			label60.textContent = `${l.default_answer}`;
			t208 = space();
			input51 = element("input");
			t209 = space();
			div159 = element("div");
			div158 = element("div");
			label61 = element("label");
			label61.textContent = `${l.chk_type}`;
			t211 = space();
			input52 = element("input");
			t212 = space();
			input53 = element("input");
			t213 = space();
			div164 = element("div");
			div162 = element("div");
			label62 = element("label");
			label62.textContent = `${l.css_style}`;
			t215 = space();
			textarea7 = element("textarea");
			t216 = space();
			div163 = element("div");
			create_component(modalevent4.$$.fragment);
			t217 = space();
			div187 = element("div");
			div186 = element("div");
			div182 = element("div");
			div171 = element("div");
			div168 = element("div");
			div167 = element("div");
			label63 = element("label");
			label63.textContent = `${l.width_label1}`;
			t219 = space();
			input54 = element("input");
			t220 = space();
			div170 = element("div");
			div169 = element("div");
			label64 = element("label");
			label64.textContent = `${l.height_label1}`;
			t222 = space();
			input55 = element("input");
			t223 = space();
			div176 = element("div");
			div173 = element("div");
			div172 = element("div");
			label65 = element("label");
			label65.textContent = `${l.top}`;
			t225 = space();
			input56 = element("input");
			t226 = space();
			div175 = element("div");
			div174 = element("div");
			label66 = element("label");
			label66.textContent = `${l.left}`;
			t228 = space();
			input57 = element("input");
			t229 = space();
			div181 = element("div");
			div178 = element("div");
			div177 = element("div");
			label67 = element("label");
			label67.textContent = "Value";
			t231 = space();
			input58 = element("input");
			t232 = space();
			div180 = element("div");
			div179 = element("div");
			label68 = element("label");
			label68.textContent = `${l.class}`;
			t234 = space();
			input59 = element("input");
			t235 = space();
			input60 = element("input");
			t236 = space();
			div185 = element("div");
			div183 = element("div");
			label69 = element("label");
			label69.textContent = `${l.css_style}`;
			t238 = space();
			textarea8 = element("textarea");
			t239 = space();
			div184 = element("div");
			create_component(modalevent5.$$.fragment);
			t240 = space();
			div206 = element("div");
			div205 = element("div");
			div201 = element("div");
			div192 = element("div");
			div189 = element("div");
			div188 = element("div");
			label70 = element("label");
			label70.textContent = `${l.width_label1}`;
			t242 = space();
			input61 = element("input");
			t243 = space();
			div191 = element("div");
			div190 = element("div");
			label71 = element("label");
			label71.textContent = `${l.height_label1}`;
			t245 = space();
			input62 = element("input");
			t246 = space();
			div197 = element("div");
			div194 = element("div");
			div193 = element("div");
			label72 = element("label");
			label72.textContent = `${l.top}`;
			t248 = space();
			input63 = element("input");
			t249 = space();
			div196 = element("div");
			div195 = element("div");
			label73 = element("label");
			label73.textContent = `${l.left}`;
			t251 = space();
			input64 = element("input");
			t252 = space();
			div200 = element("div");
			div199 = element("div");
			div198 = element("div");
			label74 = element("label");
			label74.textContent = `${l.options}`;
			t254 = space();
			textarea9 = element("textarea");
			t255 = space();
			input65 = element("input");
			t256 = space();
			div204 = element("div");
			div202 = element("div");
			label75 = element("label");
			label75.textContent = `${l.css_style}`;
			t258 = space();
			textarea10 = element("textarea");
			t259 = space();
			div203 = element("div");
			create_component(modalevent6.$$.fragment);
			t260 = space();
			div227 = element("div");
			div226 = element("div");
			div222 = element("div");
			div211 = element("div");
			div208 = element("div");
			div207 = element("div");
			label76 = element("label");
			label76.textContent = `${l.width_label1}`;
			t262 = space();
			input66 = element("input");
			t263 = space();
			div210 = element("div");
			div209 = element("div");
			label77 = element("label");
			label77.textContent = `${l.height_label1}`;
			t265 = space();
			input67 = element("input");
			t266 = space();
			div216 = element("div");
			div213 = element("div");
			div212 = element("div");
			label78 = element("label");
			label78.textContent = `${l.top}`;
			t268 = space();
			input68 = element("input");
			t269 = space();
			div215 = element("div");
			div214 = element("div");
			label79 = element("label");
			label79.textContent = `${l.left}`;
			t271 = space();
			input69 = element("input");
			t272 = space();
			div221 = element("div");
			div218 = element("div");
			div217 = element("div");
			label80 = element("label");
			label80.textContent = `${l.options}`;
			t274 = space();
			textarea11 = element("textarea");
			t275 = space();
			div220 = element("div");
			div219 = element("div");
			input70 = element("input");
			t276 = space();
			label81 = element("label");
			label81.textContent = `${l.select_multiple}`;
			t278 = space();
			input71 = element("input");
			t279 = space();
			input72 = element("input");
			t280 = space();
			div225 = element("div");
			div223 = element("div");
			label82 = element("label");
			label82.textContent = `${l.css_style}`;
			t282 = space();
			textarea12 = element("textarea");
			t283 = space();
			div224 = element("div");
			create_component(modalevent7.$$.fragment);
			t284 = space();
			div245 = element("div");
			div244 = element("div");
			div243 = element("div");
			div232 = element("div");
			div229 = element("div");
			div228 = element("div");
			label83 = element("label");
			label83.textContent = `${l.width_label1}`;
			t286 = space();
			input73 = element("input");
			t287 = space();
			div231 = element("div");
			div230 = element("div");
			label84 = element("label");
			label84.textContent = `${l.height_label1}`;
			t289 = space();
			input74 = element("input");
			t290 = space();
			div237 = element("div");
			div234 = element("div");
			div233 = element("div");
			label85 = element("label");
			label85.textContent = `${l.top}`;
			t292 = space();
			input75 = element("input");
			t293 = space();
			div236 = element("div");
			div235 = element("div");
			label86 = element("label");
			label86.textContent = `${l.left}`;
			t295 = space();
			input76 = element("input");
			t296 = space();
			div242 = element("div");
			div239 = element("div");
			div238 = element("div");
			label87 = element("label");
			label87.textContent = `${l.title}`;
			t298 = space();
			input77 = element("input");
			t299 = space();
			div241 = element("div");
			div240 = element("div");
			label88 = element("label");
			label88.textContent = `${l.class}`;
			t301 = space();
			input78 = element("input");
			t302 = space();
			input79 = element("input");
			t303 = space();
			if (if_block) if_block.c();
			t304 = space();
			div266 = element("div");
			div265 = element("div");
			div261 = element("div");
			div250 = element("div");
			div247 = element("div");
			div246 = element("div");
			label89 = element("label");
			label89.textContent = `${l.width_label1}`;
			t306 = space();
			input80 = element("input");
			t307 = space();
			div249 = element("div");
			div248 = element("div");
			label90 = element("label");
			label90.textContent = `${l.height_label1}`;
			t309 = space();
			input81 = element("input");
			t310 = space();
			div255 = element("div");
			div252 = element("div");
			div251 = element("div");
			label91 = element("label");
			label91.textContent = `${l.top}`;
			t312 = space();
			input82 = element("input");
			t313 = space();
			div254 = element("div");
			div253 = element("div");
			label92 = element("label");
			label92.textContent = `${l.left}`;
			t315 = space();
			input83 = element("input");
			t316 = space();
			div260 = element("div");
			div257 = element("div");
			div256 = element("div");
			label93 = element("label");
			label93.textContent = `${l.title}`;
			t318 = space();
			input84 = element("input");
			t319 = space();
			div259 = element("div");
			div258 = element("div");
			label94 = element("label");
			label94.textContent = `${l.background_image}`;
			t321 = space();
			input85 = element("input");
			t322 = space();
			input86 = element("input");
			t323 = space();
			div264 = element("div");
			div262 = element("div");
			label95 = element("label");
			label95.textContent = `${l.css_style}`;
			t325 = space();
			textarea13 = element("textarea");
			t326 = space();
			div263 = element("div");
			create_component(modalevent8.$$.fragment);
			t327 = space();
			div294 = element("div");
			div293 = element("div");
			div288 = element("div");
			div287 = element("div");
			div268 = element("div");
			div267 = element("div");
			label96 = element("label");
			label96.textContent = `${l.width_label1}`;
			t329 = space();
			input87 = element("input");
			t330 = space();
			div270 = element("div");
			div269 = element("div");
			label97 = element("label");
			label97.textContent = `${l.height_label1}`;
			t332 = space();
			input88 = element("input");
			t333 = space();
			div272 = element("div");
			div271 = element("div");
			label98 = element("label");
			label98.textContent = `${l.top}`;
			t335 = space();
			input89 = element("input");
			t336 = space();
			div274 = element("div");
			div273 = element("div");
			label99 = element("label");
			label99.textContent = `${l.left}`;
			t338 = space();
			input90 = element("input");
			t339 = space();
			div276 = element("div");
			div275 = element("div");
			label100 = element("label");
			label100.textContent = `${l.title}`;
			t341 = space();
			input91 = element("input");
			t342 = space();
			div278 = element("div");
			div277 = element("div");
			label101 = element("label");
			label101.textContent = `${l.border_size}`;
			t344 = space();
			select7 = element("select");
			option12 = element("option");
			option12.textContent = `${l.none}`;
			option13 = element("option");
			option13.textContent = "1";
			option14 = element("option");
			option14.textContent = "2";
			option15 = element("option");
			option15.textContent = "3";
			option16 = element("option");
			option16.textContent = "4";
			option17 = element("option");
			option17.textContent = "5";
			t351 = space();
			div280 = element("div");
			div279 = element("div");
			label102 = element("label");
			label102.textContent = "Border Color";
			t353 = space();
			select8 = element("select");
			option18 = element("option");
			option18.textContent = `${l.none}`;
			option19 = element("option");
			option19.textContent = `${l.black}`;
			option20 = element("option");
			option20.textContent = `${l.blue}`;
			option21 = element("option");
			option21.textContent = `${l.green}`;
			option22 = element("option");
			option22.textContent = `${l.red}`;
			t359 = space();
			div282 = element("div");
			div281 = element("div");
			label103 = element("label");
			label103.textContent = `${l.bg_color}`;
			t361 = space();
			select9 = element("select");
			option23 = element("option");
			option23.textContent = `${l.none}`;
			option24 = element("option");
			option24.textContent = `${l.primary_color}`;
			option25 = element("option");
			option25.textContent = `${l.warning_color}`;
			option26 = element("option");
			option26.textContent = `${l.danger_color}`;
			t366 = space();
			input92 = element("input");
			t367 = space();
			div284 = element("div");
			div283 = element("div");
			label104 = element("label");
			label104.textContent = `${l.font_style}`;
			t369 = space();
			select10 = element("select");
			t370 = space();
			div286 = element("div");
			div285 = element("div");
			input93 = element("input");
			t371 = space();
			label105 = element("label");
			label105.textContent = `${l.rich_text}`;
			t373 = space();
			div292 = element("div");
			div291 = element("div");
			div290 = element("div");
			div289 = element("div");
			create_component(modalevent9.$$.fragment);
			t374 = space();
			div315 = element("div");
			div314 = element("div");
			div312 = element("div");
			div303 = element("div");
			div296 = element("div");
			div295 = element("div");
			label106 = element("label");
			label106.textContent = `${l.width_label1}`;
			t376 = space();
			input94 = element("input");
			t377 = space();
			div298 = element("div");
			div297 = element("div");
			label107 = element("label");
			label107.textContent = `${l.height_label1}`;
			t379 = space();
			input95 = element("input");
			t380 = space();
			div300 = element("div");
			div299 = element("div");
			label108 = element("label");
			label108.textContent = `${l.top}`;
			t382 = space();
			input96 = element("input");
			t383 = space();
			div302 = element("div");
			div301 = element("div");
			label109 = element("label");
			label109.textContent = `${l.left}`;
			t385 = space();
			input97 = element("input");
			t386 = space();
			div308 = element("div");
			div305 = element("div");
			div304 = element("div");
			label110 = element("label");
			label110.textContent = `${l.matrix}`;
			t388 = space();
			input98 = element("input");
			t389 = space();
			div307 = element("div");
			div306 = element("div");
			label111 = element("label");
			label111.textContent = `${l.correct_answer}`;
			t391 = space();
			input99 = element("input");
			t392 = space();
			div311 = element("div");
			div310 = element("div");
			div309 = element("div");
			label112 = element("label");
			label112.textContent = `${l.default_answer}`;
			t394 = space();
			input100 = element("input");
			t395 = space();
			input101 = element("input");
			t396 = space();
			div313 = element("div");
			t397 = space();
			div336 = element("div");
			div335 = element("div");
			div333 = element("div");
			div324 = element("div");
			div317 = element("div");
			div316 = element("div");
			label113 = element("label");
			label113.textContent = `${l.width_label1}`;
			t399 = space();
			input102 = element("input");
			t400 = space();
			div319 = element("div");
			div318 = element("div");
			label114 = element("label");
			label114.textContent = `${l.height_label1}`;
			t402 = space();
			input103 = element("input");
			t403 = space();
			div321 = element("div");
			div320 = element("div");
			label115 = element("label");
			label115.textContent = `${l.top}`;
			t405 = space();
			input104 = element("input");
			t406 = space();
			div323 = element("div");
			div322 = element("div");
			label116 = element("label");
			label116.textContent = `${l.left}`;
			t408 = space();
			input105 = element("input");
			t409 = space();
			div329 = element("div");
			div326 = element("div");
			div325 = element("div");
			label117 = element("label");
			label117.textContent = `${l.matrix}`;
			t411 = space();
			input106 = element("input");
			t412 = space();
			div328 = element("div");
			div327 = element("div");
			label118 = element("label");
			label118.textContent = `${l.correct_answer}`;
			t414 = space();
			input107 = element("input");
			t415 = space();
			div332 = element("div");
			div331 = element("div");
			div330 = element("div");
			label119 = element("label");
			label119.textContent = `${l.event_value}`;
			t417 = space();
			input108 = element("input");
			t418 = space();
			input109 = element("input");
			t419 = space();
			div334 = element("div");
			t420 = space();
			div358 = element("div");
			div357 = element("div");
			div356 = element("div");
			div345 = element("div");
			div338 = element("div");
			div337 = element("div");
			label120 = element("label");
			label120.textContent = `${l.width_label1}`;
			t422 = space();
			input110 = element("input");
			t423 = space();
			div340 = element("div");
			div339 = element("div");
			label121 = element("label");
			label121.textContent = `${l.height_label1}`;
			t425 = space();
			input111 = element("input");
			t426 = space();
			div342 = element("div");
			div341 = element("div");
			label122 = element("label");
			label122.textContent = `${l.top}`;
			t428 = space();
			input112 = element("input");
			t429 = space();
			div344 = element("div");
			div343 = element("div");
			label123 = element("label");
			label123.textContent = `${l.left}`;
			t431 = space();
			input113 = element("input");
			t432 = space();
			div350 = element("div");
			div347 = element("div");
			div346 = element("div");
			label124 = element("label");
			label124.textContent = `${l.title}`;
			t434 = space();
			input114 = element("input");
			t435 = space();
			div349 = element("div");
			div348 = element("div");
			label125 = element("label");
			label125.textContent = `${l.name_text}`;
			t437 = space();
			input115 = element("input");
			t438 = space();
			div355 = element("div");
			div352 = element("div");
			div351 = element("div");
			label126 = element("label");
			label126.textContent = `${l.target_img}`;
			t440 = space();
			input116 = element("input");
			t441 = space();
			div354 = element("div");
			div353 = element("div");
			input117 = element("input");
			t442 = space();
			label127 = element("label");
			label127.textContent = `${l.hide_target}`;
			t444 = space();
			input118 = element("input");
			t445 = space();
			div370 = element("div");
			div369 = element("div");
			div368 = element("div");
			div367 = element("div");
			div360 = element("div");
			div359 = element("div");
			label128 = element("label");
			label128.textContent = `${l.width_label1}`;
			t447 = space();
			input119 = element("input");
			t448 = space();
			div362 = element("div");
			div361 = element("div");
			label129 = element("label");
			label129.textContent = `${l.height_label1}`;
			t450 = space();
			input120 = element("input");
			t451 = space();
			div364 = element("div");
			div363 = element("div");
			label130 = element("label");
			label130.textContent = `${l.top}`;
			t453 = space();
			input121 = element("input");
			t454 = space();
			div366 = element("div");
			div365 = element("div");
			label131 = element("label");
			label131.textContent = `${l.left}`;
			t456 = space();
			input122 = element("input");
			t457 = space();
			input123 = element("input");
			t458 = space();
			div383 = element("div");
			div382 = element("div");
			div381 = element("div");
			div375 = element("div");
			div372 = element("div");
			div371 = element("div");
			label132 = element("label");
			label132.textContent = `${l.title}`;
			t460 = space();
			input124 = element("input");
			t461 = space();
			div374 = element("div");
			div373 = element("div");
			label133 = element("label");
			label133.textContent = `${l.alt_text}`;
			t463 = space();
			input125 = element("input");
			t464 = space();
			div380 = element("div");
			div377 = element("div");
			div376 = element("div");
			label134 = element("label");
			label134.textContent = `${l.background_image}`;
			t466 = space();
			input126 = element("input");
			t467 = space();
			button2 = element("button");
			button2.textContent = `${l.upload_media_text}`;
			t469 = space();
			div379 = element("div");
			div378 = element("div");
			input127 = element("input");
			t470 = space();
			label135 = element("label");
			label135.textContent = `${l.display}`;
			t472 = space();
			input128 = element("input");
			t473 = space();
			div394 = element("div");
			div393 = element("div");
			div392 = element("div");
			div388 = element("div");
			div385 = element("div");
			div384 = element("div");
			label136 = element("label");
			label136.textContent = `${l.background_image}`;
			t475 = space();
			input129 = element("input");
			t476 = space();
			button3 = element("button");
			button3.textContent = `${l.upload_media_text}`;
			t478 = space();
			div387 = element("div");
			div386 = element("div");
			label137 = element("label");
			label137.textContent = `${l.img_alt}`;
			t480 = space();
			input130 = element("input");
			t481 = space();
			div391 = element("div");
			div390 = element("div");
			div389 = element("div");
			input131 = element("input");
			t482 = space();
			label138 = element("label");
			label138.textContent = `${l.display}`;
			t484 = space();
			input132 = element("input");
			t485 = space();
			div409 = element("div");
			div408 = element("div");
			div407 = element("div");
			div401 = element("div");
			div396 = element("div");
			div395 = element("div");
			label139 = element("label");
			label139.textContent = `${l.width_label1}`;
			t487 = space();
			input133 = element("input");
			t488 = space();
			div398 = element("div");
			div397 = element("div");
			label140 = element("label");
			label140.textContent = `${l.height_label1}`;
			t490 = space();
			input134 = element("input");
			t491 = space();
			div400 = element("div");
			div399 = element("div");
			label141 = element("label");
			label141.textContent = `${l.bg_alt_text}`;
			t493 = space();
			input135 = element("input");
			t494 = space();
			div406 = element("div");
			div403 = element("div");
			div402 = element("div");
			label142 = element("label");
			label142.textContent = `${l.background_image}`;
			t496 = space();
			input136 = element("input");
			t497 = space();
			div405 = element("div");
			button4 = element("button");
			button4.textContent = `${l.upload_media_text}`;
			t499 = space();
			div404 = element("div");
			input137 = element("input");
			t500 = space();
			label143 = element("label");
			label143.textContent = `${l.add_border}`;
			t502 = space();
			div410 = element("div");
			textarea14 = element("textarea");
			t503 = space();
			div433 = element("div");
			div432 = element("div");
			div428 = element("div");
			div415 = element("div");
			div412 = element("div");
			div411 = element("div");
			label144 = element("label");
			label144.textContent = `${l.width_label1}`;
			t505 = space();
			input138 = element("input");
			t506 = space();
			div414 = element("div");
			div413 = element("div");
			label145 = element("label");
			label145.textContent = `${l.height_label1}`;
			t508 = space();
			input139 = element("input");
			t509 = space();
			div420 = element("div");
			div417 = element("div");
			div416 = element("div");
			label146 = element("label");
			label146.textContent = `${l.top}`;
			t511 = space();
			input140 = element("input");
			t512 = space();
			div419 = element("div");
			div418 = element("div");
			label147 = element("label");
			label147.textContent = `${l.left}`;
			t514 = space();
			input141 = element("input");
			t515 = space();
			div427 = element("div");
			div422 = element("div");
			div421 = element("div");
			label148 = element("label");
			label148.textContent = `${l.name_text}`;
			t517 = space();
			input142 = element("input");
			t518 = space();
			div424 = element("div");
			div423 = element("div");
			label149 = element("label");
			label149.textContent = `${l.correct_answer}`;
			t520 = space();
			input143 = element("input");
			t521 = space();
			div426 = element("div");
			div425 = element("div");
			label150 = element("label");
			label150.textContent = `${l.default_answer}`;
			t523 = space();
			input144 = element("input");
			t524 = space();
			input145 = element("input");
			t525 = space();
			div431 = element("div");
			div429 = element("div");
			label151 = element("label");
			label151.textContent = `${l.css_style}`;
			t527 = space();
			textarea15 = element("textarea");
			t528 = space();
			div430 = element("div");
			create_component(modalevent10.$$.fragment);
			t529 = space();
			div435 = element("div");
			button5 = element("button");
			button5.textContent = `${l.cancel}`;
			t531 = space();
			button6 = element("button");
			button6.textContent = `${l.ok_btn}`;
			t533 = space();
			button7 = element("button");
			button7.textContent = `${l.ok_btn}`;
			attr_dev(h4, "class", "modal-title");
			add_location(h4, file$h, 18, 16, 633);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "close");
			attr_dev(button0, "data-bs-dismiss", "modal");
			add_location(button0, file$h, 19, 16, 693);
			attr_dev(div0, "class", "modal-header");
			add_location(div0, file$h, 17, 12, 589);
			attr_dev(label0, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label0, "for", "drag-width");
			add_location(label0, file$h, 28, 40, 1183);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control form-control-md validate number_validate");
			attr_dev(input0, "id", "drag-width");
			attr_dev(input0, "name", "width");
			attr_dev(input0, "placeholder", input0_placeholder_value = l.width_of_draggable);
			attr_dev(input0, "defaultvalue", "100");
			add_location(input0, file$h, 29, 40, 1335);
			attr_dev(div1, "class", "form-group");
			add_location(div1, file$h, 27, 36, 1117);
			attr_dev(div2, "class", "col-sm-3 px-1");
			add_location(div2, file$h, 26, 32, 1052);
			attr_dev(label1, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label1, "for", "drag-height");
			add_location(label1, file$h, 34, 40, 1751);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "form-control form-control-md validate number_validate");
			attr_dev(input1, "id", "drag-height");
			attr_dev(input1, "name", "height");
			attr_dev(input1, "placeholder", input1_placeholder_value = l.height_of_drggable);
			attr_dev(input1, "defaultvalue", "30");
			add_location(input1, file$h, 35, 40, 1905);
			attr_dev(div3, "class", "form-group");
			add_location(div3, file$h, 33, 36, 1685);
			attr_dev(div4, "class", "col-sm-3 px-1");
			add_location(div4, file$h, 32, 32, 1620);
			attr_dev(label2, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label2, "for", "drag-top");
			add_location(label2, file$h, 40, 40, 2322);
			attr_dev(input2, "type", "text");
			attr_dev(input2, "class", "form-control form-control-md validate number_validate");
			attr_dev(input2, "id", "drag-top");
			attr_dev(input2, "name", "top");
			attr_dev(input2, "placeholder", input2_placeholder_value = l.top_of_draggable);
			add_location(input2, file$h, 41, 40, 2463);
			attr_dev(div5, "class", "form-group");
			add_location(div5, file$h, 39, 36, 2256);
			attr_dev(div6, "class", "col-sm-6 px-1");
			add_location(div6, file$h, 38, 32, 2191);
			attr_dev(label3, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label3, "for", "drag-left");
			add_location(label3, file$h, 46, 40, 2854);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "class", "form-control form-control-md validate number_validate");
			attr_dev(input3, "id", "drag-left");
			attr_dev(input3, "name", "left");
			attr_dev(input3, "placeholder", input3_placeholder_value = l.left_of_drggable);
			add_location(input3, file$h, 47, 40, 2997);
			attr_dev(div7, "class", "form-group");
			add_location(div7, file$h, 45, 36, 2788);
			attr_dev(div8, "class", "col-sm-6 px-1");
			add_location(div8, file$h, 44, 32, 2723);
			attr_dev(label4, "class", "control-label font-weight-normal mb-0");
			attr_dev(label4, "for", "drag-value");
			add_location(label4, file$h, 52, 40, 3390);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control form-control-md");
			attr_dev(input4, "id", "drag-value");
			attr_dev(input4, "name", "value");
			attr_dev(input4, "placeholder", input4_placeholder_value = l.title_of_drggable);
			add_location(input4, file$h, 53, 40, 3519);
			attr_dev(div9, "class", "form-group");
			add_location(div9, file$h, 51, 36, 3324);
			attr_dev(div10, "class", "col-sm-6 px-1");
			add_location(div10, file$h, 50, 32, 3259);
			attr_dev(label5, "class", "control-label font-weight-normal mb-0");
			attr_dev(label5, "for", "drag-border_color");
			add_location(label5, file$h, 58, 40, 3892);
			option0.__value = "";
			option0.value = option0.__value;
			add_location(option0, file$h, 60, 44, 4169);
			option1.__value = "black";
			option1.value = option1.__value;
			add_location(option1, file$h, 61, 44, 4249);
			option2.__value = "gray";
			option2.value = option2.__value;
			add_location(option2, file$h, 62, 44, 4335);
			attr_dev(select0, "class", "form-control form-control-md");
			attr_dev(select0, "id", "drag-border_color");
			attr_dev(select0, "name", "border_color");
			add_location(select0, file$h, 59, 40, 4035);
			attr_dev(div11, "class", "form-group");
			add_location(div11, file$h, 57, 36, 3826);
			attr_dev(div12, "class", "col-sm-6 px-1");
			add_location(div12, file$h, 56, 32, 3761);
			attr_dev(label6, "class", "control-label font-weight-normal mb-0");
			attr_dev(label6, "for", "drag-name");
			add_location(label6, file$h, 68, 40, 4673);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "form-control form-control-md");
			attr_dev(input5, "id", "drag-name");
			attr_dev(input5, "name", "name");
			attr_dev(input5, "placeholder", input5_placeholder_value = l.name_of_draggable);
			add_location(input5, file$h, 69, 40, 4804);
			attr_dev(div13, "class", "form-group");
			add_location(div13, file$h, 67, 36, 4607);
			attr_dev(div14, "class", "col-sm-6 px-1");
			add_location(div14, file$h, 66, 32, 4542);
			attr_dev(label7, "class", "control-label font-weight-normal mb-0");
			attr_dev(label7, "for", "drag-image");
			add_location(label7, file$h, 74, 40, 5174);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "class", "form-control form-control-md");
			attr_dev(input6, "id", "drag-image");
			attr_dev(input6, "name", "image");
			attr_dev(input6, "placeholder", input6_placeholder_value = l.bg_of_draggble);
			add_location(input6, file$h, 75, 40, 5314);
			attr_dev(div15, "class", "form-group");
			add_location(div15, file$h, 73, 36, 5108);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "id", "drag_upload_media");
			attr_dev(button1, "class", "btn btn-outline-primary float-start");
			add_location(button1, file$h, 77, 36, 5516);
			attr_dev(div16, "class", "col-sm-6 px-1");
			add_location(div16, file$h, 72, 32, 5043);
			attr_dev(input7, "type", "checkbox");
			attr_dev(input7, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input7, "id", "drag-multi_drag");
			attr_dev(input7, "name", "multi_drag");
			attr_dev(input7, "defaultvalue", "1");
			add_location(input7, file$h, 81, 40, 5885);
			attr_dev(label8, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label8, "for", "drag-multi_drag");
			add_location(label8, file$h, 82, 40, 6055);
			attr_dev(div17, "class", "form-group form-check form-check-inline");
			add_location(div17, file$h, 80, 36, 5790);
			attr_dev(div18, "class", "col-sm-6 px-1 pt-sm-4 mt-sm-1");
			add_location(div18, file$h, 79, 32, 5709);
			attr_dev(input8, "type", "checkbox");
			attr_dev(input8, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input8, "id", "ch-invisible");
			attr_dev(input8, "name", "invisible");
			attr_dev(input8, "defaultvalue", "1");
			add_location(input8, file$h, 87, 40, 6455);
			attr_dev(label9, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label9, "for", "ch-invisible");
			add_location(label9, file$h, 88, 40, 6622);
			attr_dev(div19, "class", "form-group form-check pt-3 form-check-inline");
			add_location(div19, file$h, 86, 36, 6355);
			attr_dev(div20, "class", "col-sm-6 px-1");
			add_location(div20, file$h, 85, 32, 6290);
			attr_dev(div21, "class", "row");
			add_location(div21, file$h, 25, 28, 1001);
			attr_dev(div22, "class", "col-sm-12");
			add_location(div22, file$h, 24, 24, 948);
			attr_dev(label10, "class", "control-label font-weight-normal mb-0");
			attr_dev(label10, "for", "txt-style");
			add_location(label10, file$h, 97, 40, 7152);
			attr_dev(textarea0, "id", "txt-style");
			attr_dev(textarea0, "class", "form-control form-control-md height_34 height_34");
			attr_dev(textarea0, "name", "style");
			attr_dev(textarea0, "placeholder", textarea0_placeholder_value = l.css_style_of_txt);
			add_location(textarea0, file$h, 98, 40, 7284);
			attr_dev(div23, "class", "form-group");
			add_location(div23, file$h, 96, 36, 7086);
			attr_dev(div24, "class", "col-sm-6 px-1");
			add_location(div24, file$h, 95, 32, 7021);
			attr_dev(label11, "class", "control-label font-weight-normal mb-0");
			attr_dev(label11, "for", "drag-detail");
			add_location(label11, file$h, 103, 40, 7674);
			attr_dev(input9, "type", "text");
			attr_dev(input9, "class", "form-control form-control-md");
			attr_dev(input9, "id", "drag-detail");
			attr_dev(input9, "name", "detail");
			attr_dev(input9, "placeholder", input9_placeholder_value = l.detail_of_drag);
			add_location(input9, file$h, 104, 40, 7805);
			attr_dev(div25, "class", "form-group");
			add_location(div25, file$h, 102, 36, 7608);
			attr_dev(div26, "class", "col-sm-6 px-1");
			add_location(div26, file$h, 101, 32, 7543);
			attr_dev(div27, "class", "row");
			add_location(div27, file$h, 94, 28, 6970);
			attr_dev(div28, "class", "col-sm-12 d-none");
			add_location(div28, file$h, 93, 24, 6910);
			attr_dev(div29, "class", "row mx-0");
			add_location(div29, file$h, 23, 20, 900);
			attr_dev(input10, "type", "hidden");
			attr_dev(input10, "id", "drag-id");
			attr_dev(input10, "name", "id");
			add_location(input10, file$h, 110, 20, 8129);
			attr_dev(div30, "class", "drag h");
			add_location(div30, file$h, 22, 16, 858);
			attr_dev(label12, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label12, "for", "drop-width");
			add_location(label12, file$h, 118, 40, 8546);
			attr_dev(input11, "type", "text");
			attr_dev(input11, "class", "form-control form-control-md validate number_validate");
			attr_dev(input11, "id", "drop-width");
			attr_dev(input11, "name", "width");
			attr_dev(input11, "placeholder", input11_placeholder_value = l.width_of_placeholder);
			attr_dev(input11, "defaultvalue", "100");
			add_location(input11, file$h, 119, 40, 8698);
			attr_dev(div31, "class", "form-group");
			add_location(div31, file$h, 117, 36, 8480);
			attr_dev(div32, "class", "col-sm-6 px-1");
			add_location(div32, file$h, 116, 32, 8415);
			attr_dev(label13, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label13, "for", "drop-height");
			add_location(label13, file$h, 124, 40, 9116);
			attr_dev(input12, "type", "text");
			attr_dev(input12, "class", "form-control form-control-md validate number_validate");
			attr_dev(input12, "id", "drop-height");
			attr_dev(input12, "name", "height");
			attr_dev(input12, "placeholder", input12_placeholder_value = l.height_of_placeholder);
			attr_dev(input12, "defaultvalue", "30");
			add_location(input12, file$h, 125, 40, 9270);
			attr_dev(div33, "class", "form-group");
			add_location(div33, file$h, 123, 36, 9050);
			attr_dev(div34, "class", "col-sm-6 px-1");
			add_location(div34, file$h, 122, 32, 8985);
			attr_dev(div35, "class", "row");
			add_location(div35, file$h, 115, 28, 8364);
			attr_dev(label14, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label14, "for", "drop-top");
			add_location(label14, file$h, 132, 40, 9773);
			attr_dev(input13, "type", "text");
			attr_dev(input13, "class", "form-control form-control-md validate number_validate");
			attr_dev(input13, "id", "drop-top");
			attr_dev(input13, "name", "top");
			attr_dev(input13, "placeholder", input13_placeholder_value = l.top_of_ph);
			add_location(input13, file$h, 133, 40, 9914);
			attr_dev(div36, "class", "form-group");
			add_location(div36, file$h, 131, 36, 9707);
			attr_dev(div37, "class", "col-sm-6 px-1");
			add_location(div37, file$h, 130, 32, 9642);
			attr_dev(label15, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label15, "for", "drop-left");
			add_location(label15, file$h, 138, 40, 10298);
			attr_dev(input14, "type", "text");
			attr_dev(input14, "class", "form-control form-control-md validate number_validate");
			attr_dev(input14, "id", "drop-left");
			attr_dev(input14, "name", "left");
			attr_dev(input14, "placeholder", input14_placeholder_value = l.left_of_ph);
			add_location(input14, file$h, 139, 40, 10441);
			attr_dev(div38, "class", "form-group");
			add_location(div38, file$h, 137, 36, 10232);
			attr_dev(div39, "class", "col-sm-6 px-1");
			add_location(div39, file$h, 136, 32, 10167);
			attr_dev(div40, "class", "row");
			add_location(div40, file$h, 129, 28, 9591);
			attr_dev(label16, "class", "control-label font-weight-normal mb-0");
			attr_dev(label16, "for", "drop-value");
			add_location(label16, file$h, 146, 40, 10911);
			attr_dev(input15, "type", "text");
			attr_dev(input15, "class", "form-control form-control-md");
			attr_dev(input15, "id", "drop-value");
			attr_dev(input15, "name", "value");
			attr_dev(input15, "placeholder", input15_placeholder_value = l.tilte_of_ph);
			add_location(input15, file$h, 147, 40, 11040);
			attr_dev(div41, "class", "form-group");
			add_location(div41, file$h, 145, 36, 10845);
			attr_dev(div42, "class", "col-sm-6 px-1");
			add_location(div42, file$h, 144, 32, 10780);
			attr_dev(label17, "class", "control-label font-weight-normal mb-0");
			attr_dev(label17, "for", "drop-border");
			add_location(label17, file$h, 152, 40, 11406);
			option3.__value = "";
			option3.value = option3.__value;
			add_location(option3, file$h, 154, 44, 11665);
			option4.__value = "black";
			option4.value = option4.__value;
			add_location(option4, file$h, 155, 44, 11745);
			option5.__value = "gray";
			option5.value = option5.__value;
			add_location(option5, file$h, 156, 44, 11831);
			attr_dev(select1, "class", "form-control form-control-md");
			attr_dev(select1, "id", "drop-border");
			attr_dev(select1, "name", "border");
			add_location(select1, file$h, 153, 40, 11543);
			attr_dev(div43, "class", "form-group");
			add_location(div43, file$h, 151, 36, 11340);
			attr_dev(div44, "class", "col-sm-6 px-1");
			add_location(div44, file$h, 150, 32, 11275);
			attr_dev(div45, "class", "row");
			add_location(div45, file$h, 143, 28, 10729);
			attr_dev(label18, "class", "control-label font-weight-normal mb-0");
			attr_dev(label18, "for", "drop-name");
			add_location(label18, file$h, 164, 40, 12252);
			attr_dev(input16, "type", "text");
			attr_dev(input16, "class", "form-control form-control-md");
			attr_dev(input16, "id", "drop-name");
			attr_dev(input16, "name", "name");
			attr_dev(input16, "placeholder", input16_placeholder_value = l.name_of_ph);
			add_location(input16, file$h, 165, 40, 12383);
			attr_dev(div46, "class", "form-group");
			add_location(div46, file$h, 163, 36, 12186);
			attr_dev(div47, "class", "col-sm-6 px-1");
			add_location(div47, file$h, 162, 32, 12121);
			attr_dev(label19, "class", "control-label font-weight-normal mb-0");
			attr_dev(label19, "for", "drop-anskey");
			add_location(label19, file$h, 170, 40, 12746);
			attr_dev(input17, "type", "text");
			attr_dev(input17, "class", "form-control form-control-md");
			attr_dev(input17, "id", "drop-anskey");
			attr_dev(input17, "name", "anskey");
			attr_dev(input17, "placeholder", input17_placeholder_value = l.correct_answer_of_ph);
			add_location(input17, file$h, 171, 40, 12885);
			attr_dev(div48, "class", "form-group");
			add_location(div48, file$h, 169, 36, 12680);
			attr_dev(div49, "class", "col-sm-6 px-1");
			add_location(div49, file$h, 168, 32, 12615);
			attr_dev(label20, "class", "control-label font-weight-normal mb-0");
			attr_dev(label20, "for", "drop-defaultans");
			add_location(label20, file$h, 176, 40, 13270);
			attr_dev(input18, "type", "text");
			attr_dev(input18, "class", "form-control form-control-md");
			attr_dev(input18, "id", "drop-defaultans");
			attr_dev(input18, "name", "defaultans");
			attr_dev(input18, "placeholder", input18_placeholder_value = l.default_answer_of_ph);
			add_location(input18, file$h, 177, 40, 13413);
			attr_dev(div50, "class", "form-group");
			add_location(div50, file$h, 175, 36, 13204);
			attr_dev(div51, "class", "col-sm-12 px-1 d-none");
			add_location(div51, file$h, 174, 32, 13131);
			attr_dev(input19, "type", "checkbox");
			attr_dev(input19, "class", "checkbox d-inline mr-2");
			attr_dev(input19, "id", "drop-invisible");
			attr_dev(input19, "name", "invisible");
			attr_dev(input19, "defaultvalue", "1");
			add_location(input19, file$h, 182, 40, 13799);
			attr_dev(label21, "class", "control-label font-weight-normal mb-0 position-relative bottom1");
			attr_dev(label21, "for", "drop-invisible");
			add_location(label21, file$h, 183, 40, 13951);
			attr_dev(div52, "class", "form-group");
			add_location(div52, file$h, 181, 36, 13733);
			attr_dev(div53, "class", "col-sm-12 px-1");
			add_location(div53, file$h, 180, 32, 13667);
			attr_dev(input20, "type", "hidden");
			attr_dev(input20, "id", "drop-id");
			attr_dev(input20, "name", "id");
			add_location(input20, file$h, 186, 32, 14190);
			attr_dev(div54, "class", "row");
			add_location(div54, file$h, 161, 28, 12070);
			attr_dev(div55, "class", "col-sm-12");
			add_location(div55, file$h, 114, 24, 8311);
			attr_dev(label22, "class", "control-label font-weight-normal mb-0");
			attr_dev(label22, "for", "drop-style");
			add_location(label22, file$h, 191, 32, 14457);
			attr_dev(textarea1, "id", "drop-style");
			attr_dev(textarea1, "class", "form-control form-control-md height_34");
			attr_dev(textarea1, "name", "style");
			attr_dev(textarea1, "placeholder", textarea1_placeholder_value = l.css_style_of_ph);
			add_location(textarea1, file$h, 192, 32, 14582);
			attr_dev(div56, "class", "form-group");
			add_location(div56, file$h, 190, 28, 14399);
			attr_dev(div57, "class", "ev");
			attr_dev(div57, "type", "drop");
			add_location(div57, file$h, 194, 28, 14779);
			attr_dev(div58, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div58, file$h, 189, 24, 14330);
			attr_dev(div59, "class", "row mx-0");
			add_location(div59, file$h, 113, 20, 8263);
			attr_dev(div60, "class", "dropitem h");
			add_location(div60, file$h, 112, 16, 8217);
			attr_dev(label23, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label23, "for", "int-width");
			add_location(label23, file$h, 206, 40, 15321);
			attr_dev(input21, "type", "text");
			attr_dev(input21, "class", "form-control form-control-md validate number_validate");
			attr_dev(input21, "id", "int-width");
			attr_dev(input21, "name", "width");
			attr_dev(input21, "placeholder", input21_placeholder_value = l.width_of_input);
			attr_dev(input21, "defaultvalue", "100");
			add_location(input21, file$h, 207, 40, 15472);
			attr_dev(div61, "class", "form-group");
			add_location(div61, file$h, 205, 36, 15255);
			attr_dev(div62, "class", "col-sm-6 px-1");
			add_location(div62, file$h, 204, 32, 15190);
			attr_dev(label24, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label24, "for", "int-height");
			add_location(label24, file$h, 212, 40, 15883);
			attr_dev(input22, "type", "text");
			attr_dev(input22, "class", "form-control form-control-md validate number_validate");
			attr_dev(input22, "id", "int-height");
			attr_dev(input22, "name", "height");
			attr_dev(input22, "placeholder", input22_placeholder_value = l.height_of_input);
			attr_dev(input22, "defaultvalue", "30");
			add_location(input22, file$h, 213, 40, 16036);
			attr_dev(div63, "class", "form-group");
			add_location(div63, file$h, 211, 36, 15817);
			attr_dev(div64, "class", "col-sm-6 px-1");
			add_location(div64, file$h, 210, 32, 15752);
			attr_dev(div65, "class", "row");
			add_location(div65, file$h, 203, 28, 15139);
			attr_dev(label25, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label25, "for", "int-top");
			add_location(label25, file$h, 220, 40, 16532);
			attr_dev(input23, "type", "text");
			attr_dev(input23, "class", "form-control form-control-md validate number_validate");
			attr_dev(input23, "id", "int-top");
			attr_dev(input23, "name", "top");
			attr_dev(input23, "placeholder", input23_placeholder_value = l.top_of_input);
			add_location(input23, file$h, 221, 40, 16672);
			attr_dev(div66, "class", "form-group");
			add_location(div66, file$h, 219, 36, 16466);
			attr_dev(div67, "class", "col-sm-6 px-1");
			add_location(div67, file$h, 218, 32, 16401);
			attr_dev(label26, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label26, "for", "int-left");
			add_location(label26, file$h, 226, 40, 17058);
			attr_dev(input24, "type", "text");
			attr_dev(input24, "class", "form-control form-control-md validate number_validate");
			attr_dev(input24, "id", "int-left");
			attr_dev(input24, "name", "left");
			attr_dev(input24, "placeholder", input24_placeholder_value = l.left_of_input);
			add_location(input24, file$h, 227, 40, 17200);
			attr_dev(div68, "class", "form-group");
			add_location(div68, file$h, 225, 36, 16992);
			attr_dev(div69, "class", "col-sm-6 px-1");
			add_location(div69, file$h, 224, 32, 16927);
			attr_dev(div70, "class", "row");
			add_location(div70, file$h, 217, 28, 16350);
			attr_dev(label27, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label27, "for", "int-correctans");
			add_location(label27, file$h, 234, 40, 17673);
			attr_dev(input25, "type", "text");
			attr_dev(input25, "class", "form-control form-control-md validate");
			attr_dev(input25, "id", "int-correctans");
			attr_dev(input25, "name", "correctans");
			attr_dev(input25, "placeholder", input25_placeholder_value = l.correct_answer_of_input);
			add_location(input25, file$h, 235, 40, 17831);
			attr_dev(div71, "class", "form-group");
			add_location(div71, file$h, 233, 36, 17607);
			attr_dev(div72, "class", "col-sm-12 px-1");
			add_location(div72, file$h, 232, 32, 17541);
			attr_dev(label28, "class", "control-label font-weight-normal mb-0");
			attr_dev(label28, "for", "int-defaultans");
			add_location(label28, file$h, 240, 40, 18235);
			attr_dev(input26, "type", "text");
			attr_dev(input26, "class", "form-control form-control-md");
			attr_dev(input26, "id", "int-defaultans");
			attr_dev(input26, "name", "defaultans");
			attr_dev(input26, "placeholder", input26_placeholder_value = l.default_ans_of_input);
			add_location(input26, file$h, 241, 40, 18377);
			attr_dev(div73, "class", "form-group");
			add_location(div73, file$h, 239, 36, 18169);
			attr_dev(div74, "class", "col-sm-12 px-1 d-none");
			add_location(div74, file$h, 238, 32, 18096);
			attr_dev(label29, "class", "control-label font-weight-normal mb-0");
			attr_dev(label29, "for", "int-placeholder");
			add_location(label29, file$h, 246, 40, 18762);
			attr_dev(input27, "type", "text");
			attr_dev(input27, "class", "form-control form-control-md");
			attr_dev(input27, "id", "int-placeholder");
			attr_dev(input27, "name", "placeholder");
			attr_dev(input27, "placeholder", input27_placeholder_value = l.placeholder_of_ib);
			add_location(input27, file$h, 247, 40, 18902);
			attr_dev(div75, "class", "form-group");
			add_location(div75, file$h, 245, 36, 18696);
			attr_dev(div76, "class", "col-sm-12 px-1");
			add_location(div76, file$h, 244, 32, 18630);
			attr_dev(label30, "class", "control-label font-weight-normal mb-0");
			attr_dev(label30, "for", "int-type");
			add_location(label30, file$h, 252, 40, 19285);
			option6.__value = "text";
			option6.value = option6.__value;
			option6.selected = "selected";
			add_location(option6, file$h, 254, 44, 19528);
			option7.__value = "password";
			option7.value = option7.__value;
			add_location(option7, file$h, 255, 44, 19636);
			attr_dev(select2, "class", "form-control form-control-md");
			attr_dev(select2, "id", "int-type");
			attr_dev(select2, "name", "type");
			add_location(select2, file$h, 253, 40, 19411);
			attr_dev(div77, "class", "form-group");
			add_location(div77, file$h, 251, 36, 19219);
			attr_dev(div78, "class", "col-sm-6 px-1");
			add_location(div78, file$h, 250, 32, 19154);
			attr_dev(label31, "class", "control-label font-weight-normal mb-0");
			attr_dev(label31, "for", "int-parser");
			add_location(label31, file$h, 261, 40, 19982);
			option8.__value = "";
			option8.value = option8.__value;
			add_location(option8, file$h, 263, 44, 20233);
			option9.__value = "sql";
			option9.value = option9.__value;
			add_location(option9, file$h, 264, 44, 20322);
			attr_dev(select3, "class", "form-control form-control-md");
			attr_dev(select3, "id", "int-parser");
			attr_dev(select3, "name", "parser");
			add_location(select3, file$h, 262, 40, 20112);
			attr_dev(div79, "class", "form-group");
			add_location(div79, file$h, 260, 36, 19916);
			attr_dev(div80, "class", "col-sm-6 px-1");
			add_location(div80, file$h, 259, 32, 19851);
			attr_dev(input28, "type", "checkbox");
			attr_dev(input28, "class", "checkbox form-check-input");
			attr_dev(input28, "id", "int-nocase");
			attr_dev(input28, "name", "nocase");
			attr_dev(input28, "defaultvalue", "1");
			add_location(input28, file$h, 270, 40, 20687);
			attr_dev(label32, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label32, "for", "int-nocase");
			add_location(label32, file$h, 271, 40, 20835);
			attr_dev(div81, "class", "form-group form-check form-check-inline");
			add_location(div81, file$h, 269, 36, 20592);
			attr_dev(div82, "class", "col-sm-6 px-1");
			add_location(div82, file$h, 268, 32, 20527);
			attr_dev(input29, "type", "checkbox");
			attr_dev(input29, "class", "checkbox form-check-input");
			attr_dev(input29, "id", "int-ismultipleanswer");
			attr_dev(input29, "name", "ismultipleanswer");
			attr_dev(input29, "defaultvalue", "1");
			add_location(input29, file$h, 276, 40, 21228);
			attr_dev(label33, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label33, "for", "int-ismultipleanswer");
			add_location(label33, file$h, 277, 40, 21396);
			attr_dev(div83, "class", "form-group form-check form-check-inline");
			add_location(div83, file$h, 275, 36, 21133);
			attr_dev(div84, "class", "col-sm-6 px-1");
			add_location(div84, file$h, 274, 32, 21068);
			attr_dev(input30, "type", "hidden");
			attr_dev(input30, "id", "int-id");
			attr_dev(input30, "name", "id");
			add_location(input30, file$h, 280, 32, 21643);
			attr_dev(div85, "class", "row");
			add_location(div85, file$h, 231, 28, 17490);
			attr_dev(div86, "class", "col-sm-12");
			add_location(div86, file$h, 202, 24, 15086);
			attr_dev(label34, "class", "control-label font-weight-normal mb-0");
			attr_dev(label34, "for", "int-style");
			add_location(label34, file$h, 285, 32, 21909);
			attr_dev(textarea2, "id", "int-style");
			attr_dev(textarea2, "class", "form-control form-control-md height_34");
			attr_dev(textarea2, "name", "style");
			attr_dev(textarea2, "placeholder", textarea2_placeholder_value = l.css_of_input);
			add_location(textarea2, file$h, 286, 32, 22033);
			attr_dev(div87, "class", "form-group");
			add_location(div87, file$h, 284, 28, 21851);
			attr_dev(label35, "class", "control-label font-weight-normal mb-0");
			attr_dev(label35, "for", "custom_class_input");
			add_location(label35, file$h, 289, 32, 22284);
			attr_dev(select4, "class", "form-control form-control-md");
			attr_dev(select4, "id", "custom_class_input");
			attr_dev(select4, "name", "custom_class");
			add_location(select4, file$h, 290, 32, 22418);
			attr_dev(div88, "class", "form-group");
			add_location(div88, file$h, 288, 28, 22226);
			attr_dev(div89, "class", "ev");
			attr_dev(div89, "type", "int");
			add_location(div89, file$h, 292, 28, 22582);
			attr_dev(div90, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div90, file$h, 283, 24, 21782);
			attr_dev(div91, "class", "row mx-0");
			add_location(div91, file$h, 201, 20, 15038);
			attr_dev(div92, "class", "inputbox h");
			add_location(div92, file$h, 200, 16, 14992);
			attr_dev(label36, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label36, "for", "mlt-width");
			add_location(label36, file$h, 304, 40, 23124);
			attr_dev(input31, "type", "text");
			attr_dev(input31, "class", "form-control form-control-md validate number_validate");
			attr_dev(input31, "id", "mlt-width");
			attr_dev(input31, "name", "width");
			attr_dev(input31, "placeholder", input31_placeholder_value = l.width_of_multiline);
			attr_dev(input31, "defaultvalue", "100");
			add_location(input31, file$h, 305, 40, 23275);
			attr_dev(div93, "class", "form-group");
			add_location(div93, file$h, 303, 36, 23058);
			attr_dev(div94, "class", "col-sm-6 px-1");
			add_location(div94, file$h, 302, 32, 22993);
			attr_dev(label37, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label37, "for", "mlt-height");
			add_location(label37, file$h, 310, 40, 23690);
			attr_dev(input32, "type", "text");
			attr_dev(input32, "class", "form-control form-control-md validate number_validate");
			attr_dev(input32, "id", "mlt-height");
			attr_dev(input32, "name", "height");
			attr_dev(input32, "placeholder", input32_placeholder_value = l.height_of_multiline);
			attr_dev(input32, "defaultvalue", "30");
			add_location(input32, file$h, 311, 40, 23843);
			attr_dev(div95, "class", "form-group");
			add_location(div95, file$h, 309, 36, 23624);
			attr_dev(div96, "class", "col-sm-6 px-1");
			add_location(div96, file$h, 308, 32, 23559);
			attr_dev(div97, "class", "row");
			add_location(div97, file$h, 301, 28, 22942);
			attr_dev(label38, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label38, "for", "mlt-top");
			add_location(label38, file$h, 318, 40, 24343);
			attr_dev(input33, "type", "text");
			attr_dev(input33, "class", "form-control form-control-md validate number_validate");
			attr_dev(input33, "id", "mlt-top");
			attr_dev(input33, "name", "top");
			attr_dev(input33, "placeholder", input33_placeholder_value = l.top_of_multiline);
			add_location(input33, file$h, 319, 40, 24483);
			attr_dev(div98, "class", "form-group");
			add_location(div98, file$h, 317, 36, 24277);
			attr_dev(div99, "class", "col-sm-6 px-1");
			add_location(div99, file$h, 316, 32, 24212);
			attr_dev(label39, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label39, "for", "mlt-left");
			add_location(label39, file$h, 324, 40, 24873);
			attr_dev(input34, "type", "text");
			attr_dev(input34, "class", "form-control form-control-md validate number_validate");
			attr_dev(input34, "id", "mlt-left");
			attr_dev(input34, "name", "left");
			attr_dev(input34, "placeholder", input34_placeholder_value = l.left_of_multiline);
			add_location(input34, file$h, 325, 40, 25015);
			attr_dev(div100, "class", "form-group");
			add_location(div100, file$h, 323, 36, 24807);
			attr_dev(div101, "class", "col-sm-6 px-1");
			add_location(div101, file$h, 322, 32, 24742);
			attr_dev(div102, "class", "row");
			add_location(div102, file$h, 315, 28, 24161);
			attr_dev(label40, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label40, "for", "mlt-correctans");
			add_location(label40, file$h, 332, 40, 25492);
			attr_dev(textarea3, "type", "text");
			attr_dev(textarea3, "class", "form-control form-control-md validate");
			attr_dev(textarea3, "id", "mlt-correctans");
			attr_dev(textarea3, "name", "correctans");
			attr_dev(textarea3, "placeholder", textarea3_placeholder_value = l.crct_ans_multiline);
			add_location(textarea3, file$h, 333, 40, 25650);
			attr_dev(div103, "class", "form-group");
			add_location(div103, file$h, 331, 36, 25426);
			attr_dev(div104, "class", "col-sm-12 px-1");
			add_location(div104, file$h, 330, 32, 25360);
			attr_dev(label41, "class", "control-label font-weight-normal mb-0");
			attr_dev(label41, "for", "mlt-defaultans");
			add_location(label41, file$h, 338, 40, 26061);
			attr_dev(textarea4, "type", "text");
			attr_dev(textarea4, "class", "form-control form-control-md");
			attr_dev(textarea4, "id", "mlt-defaultans");
			attr_dev(textarea4, "name", "defaultans");
			attr_dev(textarea4, "placeholder", textarea4_placeholder_value = l.def_ans_multiline);
			add_location(textarea4, file$h, 339, 40, 26203);
			attr_dev(div105, "class", "form-group");
			add_location(div105, file$h, 337, 36, 25995);
			attr_dev(div106, "class", "col-sm-12 px-1 d-none");
			add_location(div106, file$h, 336, 32, 25922);
			attr_dev(label42, "class", "control-label font-weight-normal mb-0");
			attr_dev(label42, "for", "mlt-placeholder");
			add_location(label42, file$h, 344, 40, 26597);
			attr_dev(input35, "type", "text");
			attr_dev(input35, "class", "form-control form-control-md");
			attr_dev(input35, "id", "mlt-placeholder");
			attr_dev(input35, "name", "placeholder");
			attr_dev(input35, "placeholder", input35_placeholder_value = l.placeholder_multiline);
			add_location(input35, file$h, 345, 40, 26737);
			attr_dev(div107, "class", "form-group");
			add_location(div107, file$h, 343, 36, 26531);
			attr_dev(div108, "class", "col-sm-12 px-1");
			add_location(div108, file$h, 342, 32, 26465);
			attr_dev(label43, "class", "control-label font-weight-normal mb-0");
			attr_dev(label43, "for", "mlt-parser");
			add_location(label43, file$h, 350, 40, 27125);
			option10.__value = "";
			option10.value = option10.__value;
			add_location(option10, file$h, 352, 44, 27376);
			option11.__value = "sql";
			option11.value = option11.__value;
			add_location(option11, file$h, 353, 44, 27471);
			attr_dev(select5, "class", "form-control form-control-md");
			attr_dev(select5, "id", "mlt-parser");
			attr_dev(select5, "name", "parser");
			add_location(select5, file$h, 351, 40, 27255);
			attr_dev(div109, "class", "form-group");
			add_location(div109, file$h, 349, 36, 27059);
			attr_dev(div110, "class", "col-sm-12 px-1");
			add_location(div110, file$h, 348, 32, 26993);
			attr_dev(input36, "type", "checkbox");
			attr_dev(input36, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input36, "id", "mlt-nocase");
			attr_dev(input36, "name", "nocase");
			attr_dev(input36, "defaultvalue", "1");
			add_location(input36, file$h, 359, 40, 27837);
			attr_dev(label44, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label44, "for", "mlt-nocase");
			add_location(label44, file$h, 360, 40, 27999);
			attr_dev(div111, "class", "form-group form-check form-check-inline");
			add_location(div111, file$h, 358, 36, 27742);
			attr_dev(div112, "class", "col-sm-12 px-1");
			add_location(div112, file$h, 357, 32, 27676);
			attr_dev(input37, "type", "hidden");
			attr_dev(input37, "id", "mlt-id");
			attr_dev(input37, "name", "id");
			add_location(input37, file$h, 363, 32, 28232);
			attr_dev(div113, "class", "row");
			add_location(div113, file$h, 329, 28, 25309);
			attr_dev(div114, "class", "col-sm-12");
			add_location(div114, file$h, 300, 24, 22889);
			attr_dev(label45, "class", "control-label font-weight-normal mb-0");
			attr_dev(label45, "for", "mlt-style");
			add_location(label45, file$h, 368, 32, 28498);
			attr_dev(textarea5, "id", "mlt-style");
			attr_dev(textarea5, "class", "form-control form-control-md height_34");
			attr_dev(textarea5, "name", "style");
			attr_dev(textarea5, "placeholder", "CSS style of Multiline");
			add_location(textarea5, file$h, 369, 32, 28622);
			attr_dev(div115, "class", "form-group");
			add_location(div115, file$h, 367, 28, 28440);
			attr_dev(label46, "class", "control-label font-weight-normal mb-0");
			attr_dev(label46, "for", "custom_class");
			add_location(label46, file$h, 372, 32, 28879);
			attr_dev(select6, "class", "form-control form-control-md");
			attr_dev(select6, "id", "custom_class");
			attr_dev(select6, "name", "custom_class");
			add_location(select6, file$h, 373, 32, 29006);
			attr_dev(div116, "class", "form-group");
			add_location(div116, file$h, 371, 28, 28821);
			attr_dev(div117, "class", "ev");
			attr_dev(div117, "type", "mlt");
			add_location(div117, file$h, 375, 28, 29164);
			attr_dev(div118, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div118, file$h, 366, 24, 28371);
			attr_dev(div119, "class", "row mx-0");
			add_location(div119, file$h, 299, 20, 22841);
			attr_dev(div120, "class", "multiline h");
			add_location(div120, file$h, 298, 16, 22794);
			attr_dev(label47, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label47, "for", "chk-width");
			add_location(label47, file$h, 387, 40, 29704);
			attr_dev(input38, "type", "text");
			attr_dev(input38, "class", "form-control form-control-md validate number_validate");
			attr_dev(input38, "id", "chk-width");
			attr_dev(input38, "name", "width");
			attr_dev(input38, "placeholder", "Width of Checkbox");
			attr_dev(input38, "defaultvalue", "20");
			add_location(input38, file$h, 388, 40, 29855);
			attr_dev(div121, "class", "form-group");
			add_location(div121, file$h, 386, 36, 29638);
			attr_dev(div122, "class", "col-sm-6 px-1");
			add_location(div122, file$h, 385, 32, 29573);
			attr_dev(label48, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label48, "for", "chk-height");
			add_location(label48, file$h, 393, 40, 30264);
			attr_dev(input39, "type", "text");
			attr_dev(input39, "class", "form-control form-control-md validate number_validate");
			attr_dev(input39, "id", "chk-height");
			attr_dev(input39, "name", "height");
			attr_dev(input39, "placeholder", input39_placeholder_value = l.height_of_checkbox);
			attr_dev(input39, "defaultvalue", "20");
			add_location(input39, file$h, 394, 40, 30417);
			attr_dev(div123, "class", "form-group");
			add_location(div123, file$h, 392, 36, 30198);
			attr_dev(div124, "class", "col-sm-6 px-1");
			add_location(div124, file$h, 391, 32, 30133);
			attr_dev(div125, "class", "row");
			add_location(div125, file$h, 384, 28, 29522);
			attr_dev(label49, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label49, "for", "chk-top");
			add_location(label49, file$h, 401, 40, 30916);
			attr_dev(input40, "type", "text");
			attr_dev(input40, "class", "form-control form-control-md validate number_validate");
			attr_dev(input40, "id", "chk-top");
			attr_dev(input40, "name", "top");
			attr_dev(input40, "placeholder", input40_placeholder_value = l.top_of_checkbox);
			add_location(input40, file$h, 402, 40, 31056);
			attr_dev(div126, "class", "form-group");
			add_location(div126, file$h, 400, 36, 30850);
			attr_dev(div127, "class", "col-sm-6 px-1");
			add_location(div127, file$h, 399, 32, 30785);
			attr_dev(label50, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label50, "for", "chk-left");
			add_location(label50, file$h, 407, 40, 31445);
			attr_dev(input41, "type", "text");
			attr_dev(input41, "class", "form-control form-control-md validate number_validate");
			attr_dev(input41, "id", "chk-left");
			attr_dev(input41, "name", "left");
			attr_dev(input41, "placeholder", input41_placeholder_value = l.left_of_checkbox);
			add_location(input41, file$h, 408, 40, 31587);
			attr_dev(div128, "class", "form-group");
			add_location(div128, file$h, 406, 36, 31379);
			attr_dev(div129, "class", "col-sm-6 px-1");
			add_location(div129, file$h, 405, 32, 31314);
			attr_dev(div130, "class", "row");
			add_location(div130, file$h, 398, 28, 30734);
			attr_dev(label51, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label51, "for", "chk-correctans");
			add_location(label51, file$h, 415, 40, 32063);
			attr_dev(input42, "type", "text");
			attr_dev(input42, "class", "form-control form-control-md validate");
			attr_dev(input42, "id", "chk-correctans");
			attr_dev(input42, "name", "correctans");
			attr_dev(input42, "placeholder", input42_placeholder_value = l.crct_of_chk);
			add_location(input42, file$h, 416, 40, 32221);
			attr_dev(div131, "class", "form-group");
			add_location(div131, file$h, 414, 36, 31997);
			attr_dev(div132, "class", "col-sm-12 px-1");
			add_location(div132, file$h, 413, 32, 31931);
			attr_dev(label52, "class", "control-label font-weight-normal mb-0");
			attr_dev(label52, "for", "chk-defaultans");
			add_location(label52, file$h, 421, 40, 32606);
			attr_dev(input43, "type", "text");
			attr_dev(input43, "class", "form-control form-control-md");
			attr_dev(input43, "id", "chk-defaultans");
			attr_dev(input43, "name", "defaultans");
			attr_dev(input43, "placeholder", input43_placeholder_value = l.def_of_chk);
			add_location(input43, file$h, 422, 40, 32748);
			attr_dev(div133, "class", "form-group");
			add_location(div133, file$h, 420, 36, 32540);
			attr_dev(div134, "class", "col-sm-12 px-1");
			add_location(div134, file$h, 419, 32, 32474);
			attr_dev(input44, "type", "hidden");
			attr_dev(input44, "id", "chk-id");
			attr_dev(input44, "name", "id");
			add_location(input44, file$h, 425, 32, 32991);
			attr_dev(div135, "class", "row");
			add_location(div135, file$h, 412, 28, 31880);
			attr_dev(div136, "class", "col-sm-12");
			add_location(div136, file$h, 383, 24, 29469);
			attr_dev(label53, "class", "control-label font-weight-normal mb-0");
			attr_dev(label53, "for", "chk-style");
			add_location(label53, file$h, 430, 32, 33257);
			attr_dev(textarea6, "id", "chk-style");
			attr_dev(textarea6, "class", "form-control form-control-md height_34");
			attr_dev(textarea6, "name", "style");
			attr_dev(textarea6, "placeholder", textarea6_placeholder_value = l.css_of_chk);
			add_location(textarea6, file$h, 431, 32, 33381);
			attr_dev(div137, "class", "form-group");
			add_location(div137, file$h, 429, 28, 33199);
			attr_dev(div138, "class", "ev");
			attr_dev(div138, "type", "chk");
			add_location(div138, file$h, 433, 28, 33572);
			attr_dev(div139, "class", "col-sm-6 pr-1 pl-2 d-none");
			add_location(div139, file$h, 428, 24, 33130);
			attr_dev(div140, "class", "row mx-0");
			add_location(div140, file$h, 382, 20, 29421);
			attr_dev(div141, "class", "chekbox h");
			add_location(div141, file$h, 381, 16, 29376);
			attr_dev(label54, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label54, "for", "rd-width");
			add_location(label54, file$h, 445, 40, 34109);
			attr_dev(input45, "type", "text");
			attr_dev(input45, "class", "form-control form-control-md validate number_validate");
			attr_dev(input45, "id", "rd-width");
			attr_dev(input45, "name", "width");
			attr_dev(input45, "placeholder", input45_placeholder_value = l.width_of_radio);
			attr_dev(input45, "defaultvalue", "20");
			add_location(input45, file$h, 446, 40, 34259);
			attr_dev(div142, "class", "form-group");
			add_location(div142, file$h, 444, 36, 34043);
			attr_dev(div143, "class", "col-sm-6 px-1");
			add_location(div143, file$h, 443, 32, 33978);
			attr_dev(label55, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label55, "for", "rd-height");
			add_location(label55, file$h, 451, 40, 34668);
			attr_dev(input46, "type", "text");
			attr_dev(input46, "class", "form-control form-control-md validate number_validate");
			attr_dev(input46, "id", "rd-height");
			attr_dev(input46, "name", "height");
			attr_dev(input46, "placeholder", input46_placeholder_value = l.height_of_radio);
			attr_dev(input46, "defaultvalue", "20");
			add_location(input46, file$h, 452, 40, 34820);
			attr_dev(div144, "class", "form-group");
			add_location(div144, file$h, 450, 36, 34602);
			attr_dev(div145, "class", "col-sm-6 px-1");
			add_location(div145, file$h, 449, 32, 34537);
			attr_dev(div146, "class", "row");
			add_location(div146, file$h, 442, 28, 33927);
			attr_dev(label56, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label56, "for", "rd-top");
			add_location(label56, file$h, 459, 40, 35315);
			attr_dev(input47, "type", "text");
			attr_dev(input47, "class", "form-control form-control-md validate number_validate");
			attr_dev(input47, "id", "rd-top");
			attr_dev(input47, "name", "top");
			attr_dev(input47, "placeholder", input47_placeholder_value = l.top_of_radio);
			add_location(input47, file$h, 460, 40, 35454);
			attr_dev(div147, "class", "form-group");
			add_location(div147, file$h, 458, 36, 35249);
			attr_dev(div148, "class", "col-sm-6 px-1");
			add_location(div148, file$h, 457, 32, 35184);
			attr_dev(label57, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label57, "for", "rd-left");
			add_location(label57, file$h, 465, 40, 35839);
			attr_dev(input48, "type", "text");
			attr_dev(input48, "class", "form-control form-control-md validate number_validate");
			attr_dev(input48, "id", "rd-left");
			attr_dev(input48, "name", "left");
			attr_dev(input48, "placeholder", input48_placeholder_value = l.left_of_radio);
			add_location(input48, file$h, 466, 40, 35980);
			attr_dev(div149, "class", "form-group");
			add_location(div149, file$h, 464, 36, 35773);
			attr_dev(div150, "class", "col-sm-6 px-1");
			add_location(div150, file$h, 463, 32, 35708);
			attr_dev(div151, "class", "row");
			add_location(div151, file$h, 456, 28, 35133);
			attr_dev(label58, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label58, "for", "rd-name");
			add_location(label58, file$h, 473, 40, 36452);
			attr_dev(input49, "type", "text");
			attr_dev(input49, "class", "form-control form-control-md validate");
			attr_dev(input49, "id", "rd-name");
			attr_dev(input49, "name", "name");
			attr_dev(input49, "placeholder", "Name of Radio");
			add_location(input49, file$h, 474, 40, 36598);
			attr_dev(div152, "class", "form-group");
			add_location(div152, file$h, 472, 36, 36386);
			attr_dev(div153, "class", "col-sm-12 px-1");
			add_location(div153, file$h, 471, 32, 36320);
			attr_dev(label59, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label59, "for", "rd-correctans");
			add_location(label59, file$h, 479, 40, 36968);
			attr_dev(input50, "type", "text");
			attr_dev(input50, "class", "form-control form-control-md validate");
			attr_dev(input50, "id", "rd-correctans");
			attr_dev(input50, "name", "correctans");
			attr_dev(input50, "placeholder", input50_placeholder_value = l.crct_of_radio);
			add_location(input50, file$h, 480, 40, 37125);
			attr_dev(div154, "class", "form-group");
			add_location(div154, file$h, 478, 36, 36902);
			attr_dev(div155, "class", "col-sm-12 px-1");
			add_location(div155, file$h, 477, 32, 36836);
			attr_dev(label60, "class", "control-label font-weight-normal mb-0");
			attr_dev(label60, "for", "rd-defaultans");
			add_location(label60, file$h, 485, 40, 37511);
			attr_dev(input51, "type", "text");
			attr_dev(input51, "class", "form-control form-control-md");
			attr_dev(input51, "id", "rd-defaultans");
			attr_dev(input51, "name", "defaultans");
			attr_dev(input51, "placeholder", input51_placeholder_value = l.def_of_radio);
			add_location(input51, file$h, 486, 40, 37652);
			attr_dev(div156, "class", "form-group");
			add_location(div156, file$h, 484, 36, 37445);
			attr_dev(div157, "class", "col-sm-12 px-1");
			add_location(div157, file$h, 483, 32, 37379);
			attr_dev(label61, "class", "control-label font-weight-normal mb-0");
			attr_dev(label61, "for", "rd-checktype");
			add_location(label61, file$h, 491, 40, 38028);
			attr_dev(input52, "type", "text");
			attr_dev(input52, "class", "form-control form-control-md");
			attr_dev(input52, "id", "rd-checktype");
			attr_dev(input52, "name", "checktype");
			attr_dev(input52, "placeholder", input52_placeholder_value = l.chktype_of_radio);
			add_location(input52, file$h, 492, 40, 38162);
			attr_dev(div158, "class", "form-group");
			add_location(div158, file$h, 490, 36, 37962);
			attr_dev(div159, "class", "col-sm-12 px-1");
			add_location(div159, file$h, 489, 32, 37896);
			attr_dev(input53, "type", "hidden");
			attr_dev(input53, "id", "rd-id");
			attr_dev(input53, "name", "id");
			add_location(input53, file$h, 495, 32, 38408);
			attr_dev(div160, "class", "row");
			add_location(div160, file$h, 470, 28, 36269);
			attr_dev(div161, "class", "col-sm-12");
			add_location(div161, file$h, 441, 24, 33874);
			attr_dev(label62, "class", "control-label font-weight-normal mb-0");
			attr_dev(label62, "for", "rd-style");
			add_location(label62, file$h, 500, 32, 38673);
			attr_dev(textarea7, "id", "rd-style");
			attr_dev(textarea7, "class", "form-control form-control-md height_34");
			attr_dev(textarea7, "name", "style");
			attr_dev(textarea7, "placeholder", textarea7_placeholder_value = l.css_style_radio);
			add_location(textarea7, file$h, 501, 32, 38796);
			attr_dev(div162, "class", "form-group");
			add_location(div162, file$h, 499, 28, 38615);
			attr_dev(div163, "class", "ev");
			attr_dev(div163, "type", "rd");
			add_location(div163, file$h, 503, 28, 38991);
			attr_dev(div164, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div164, file$h, 498, 24, 38546);
			attr_dev(div165, "class", "row mx-0");
			add_location(div165, file$h, 440, 20, 33826);
			attr_dev(div166, "class", "rdio h");
			add_location(div166, file$h, 439, 16, 33784);
			attr_dev(label63, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label63, "for", "btn-width");
			add_location(label63, file$h, 515, 40, 39529);
			attr_dev(input54, "type", "text");
			attr_dev(input54, "class", "form-control form-control-md validate number_validate");
			attr_dev(input54, "id", "btn-width");
			attr_dev(input54, "name", "width");
			attr_dev(input54, "placeholder", input54_placeholder_value = l.width_of_button);
			attr_dev(input54, "defaultvalue", "100");
			add_location(input54, file$h, 516, 40, 39680);
			attr_dev(div167, "class", "form-group");
			add_location(div167, file$h, 514, 36, 39463);
			attr_dev(div168, "class", "col-sm-6 px-1");
			add_location(div168, file$h, 513, 32, 39398);
			attr_dev(label64, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label64, "for", "btn-height");
			add_location(label64, file$h, 521, 40, 40092);
			attr_dev(input55, "type", "text");
			attr_dev(input55, "class", "form-control form-control-md validate number_validate");
			attr_dev(input55, "id", "btn-height");
			attr_dev(input55, "name", "height");
			attr_dev(input55, "placeholder", input55_placeholder_value = l.height_of_button);
			attr_dev(input55, "defaultvalue", "30");
			add_location(input55, file$h, 522, 40, 40245);
			attr_dev(div169, "class", "form-group");
			add_location(div169, file$h, 520, 36, 40026);
			attr_dev(div170, "class", "col-sm-6 px-1");
			add_location(div170, file$h, 519, 32, 39961);
			attr_dev(div171, "class", "row");
			add_location(div171, file$h, 512, 28, 39347);
			attr_dev(label65, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label65, "for", "btn-top");
			add_location(label65, file$h, 529, 40, 40742);
			attr_dev(input56, "type", "text");
			attr_dev(input56, "class", "form-control form-control-md validate number_validate");
			attr_dev(input56, "id", "btn-top");
			attr_dev(input56, "name", "top");
			attr_dev(input56, "placeholder", input56_placeholder_value = l.top_of_button);
			add_location(input56, file$h, 530, 40, 40882);
			attr_dev(div172, "class", "form-group");
			add_location(div172, file$h, 528, 36, 40676);
			attr_dev(div173, "class", "col-sm-6 px-1");
			add_location(div173, file$h, 527, 32, 40611);
			attr_dev(label66, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label66, "for", "btn-left");
			add_location(label66, file$h, 535, 40, 41269);
			attr_dev(input57, "type", "text");
			attr_dev(input57, "class", "form-control form-control-md validate number_validate");
			attr_dev(input57, "id", "btn-left");
			attr_dev(input57, "name", "left");
			attr_dev(input57, "placeholder", input57_placeholder_value = l.left_of_button);
			add_location(input57, file$h, 536, 40, 41411);
			attr_dev(div174, "class", "form-group");
			add_location(div174, file$h, 534, 36, 41203);
			attr_dev(div175, "class", "col-sm-6 px-1");
			add_location(div175, file$h, 533, 32, 41138);
			attr_dev(div176, "class", "row");
			add_location(div176, file$h, 526, 28, 40560);
			attr_dev(label67, "class", "control-label font-weight-normal mb-0");
			attr_dev(label67, "for", "btn-value");
			add_location(label67, file$h, 543, 40, 41885);
			attr_dev(input58, "type", "text");
			attr_dev(input58, "class", "form-control form-control-md");
			attr_dev(input58, "id", "btn-value");
			attr_dev(input58, "name", "value");
			attr_dev(input58, "placeholder", input58_placeholder_value = l.value_of_button);
			add_location(input58, file$h, 544, 40, 42009);
			attr_dev(div177, "class", "form-group");
			add_location(div177, file$h, 542, 36, 41819);
			attr_dev(div178, "class", "col-sm-12 px-1");
			add_location(div178, file$h, 541, 32, 41753);
			attr_dev(label68, "class", "control-label font-weight-normal mb-0");
			attr_dev(label68, "for", "btn-class");
			add_location(label68, file$h, 549, 40, 42379);
			attr_dev(input59, "type", "text");
			attr_dev(input59, "class", "form-control form-control-md");
			attr_dev(input59, "id", "btn-class");
			attr_dev(input59, "name", "class");
			attr_dev(input59, "placeholder", input59_placeholder_value = l.class_of_button);
			add_location(input59, file$h, 550, 40, 42507);
			attr_dev(div179, "class", "form-group");
			add_location(div179, file$h, 548, 36, 42313);
			attr_dev(input60, "type", "hidden");
			attr_dev(input60, "id", "btn-id");
			attr_dev(input60, "name", "id");
			add_location(input60, file$h, 552, 36, 42709);
			attr_dev(div180, "class", "col-sm-12 px-1");
			add_location(div180, file$h, 547, 32, 42247);
			attr_dev(div181, "class", "row");
			add_location(div181, file$h, 540, 28, 41702);
			attr_dev(div182, "class", "col-sm-12");
			add_location(div182, file$h, 511, 24, 39294);
			attr_dev(label69, "class", "control-label font-weight-normal mb-0");
			attr_dev(label69, "for", "btn-style");
			add_location(label69, file$h, 558, 32, 43015);
			attr_dev(textarea8, "id", "btn-style");
			attr_dev(textarea8, "class", "form-control form-control-md height_34");
			attr_dev(textarea8, "name", "style");
			attr_dev(textarea8, "placeholder", textarea8_placeholder_value = l.css_style_btn);
			add_location(textarea8, file$h, 559, 32, 43139);
			attr_dev(div183, "class", "form-group");
			add_location(div183, file$h, 557, 28, 42957);
			attr_dev(div184, "class", "ev");
			attr_dev(div184, "type", "btn");
			add_location(div184, file$h, 561, 28, 43333);
			attr_dev(div185, "class", "col-sm-6 pr-1 pl-2 d-none");
			add_location(div185, file$h, 556, 24, 42888);
			attr_dev(div186, "class", "row mx-0");
			add_location(div186, file$h, 510, 20, 39246);
			attr_dev(div187, "class", "button h");
			add_location(div187, file$h, 509, 16, 39202);
			attr_dev(label70, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label70, "for", "ddn-width");
			add_location(label70, file$h, 573, 40, 43874);
			attr_dev(input61, "type", "text");
			attr_dev(input61, "class", "form-control form-control-md validate number_validate");
			attr_dev(input61, "id", "ddn-width");
			attr_dev(input61, "name", "width");
			attr_dev(input61, "placeholder", input61_placeholder_value = l.width_of_dropdown);
			attr_dev(input61, "defaultvalue", "100");
			add_location(input61, file$h, 574, 40, 44025);
			attr_dev(div188, "class", "form-group");
			add_location(div188, file$h, 572, 36, 43808);
			attr_dev(div189, "class", "col-sm-6 px-1");
			add_location(div189, file$h, 571, 32, 43743);
			attr_dev(label71, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label71, "for", "ddn-height");
			add_location(label71, file$h, 579, 40, 44439);
			attr_dev(input62, "type", "text");
			attr_dev(input62, "class", "form-control form-control-md validate number_validate");
			attr_dev(input62, "id", "ddn-height");
			attr_dev(input62, "name", "height");
			attr_dev(input62, "placeholder", input62_placeholder_value = l.height_of_dropdown);
			attr_dev(input62, "defaultvalue", "30");
			add_location(input62, file$h, 580, 40, 44592);
			attr_dev(div190, "class", "form-group");
			add_location(div190, file$h, 578, 36, 44373);
			attr_dev(div191, "class", "col-sm-6 px-1");
			add_location(div191, file$h, 577, 32, 44308);
			attr_dev(div192, "class", "row");
			add_location(div192, file$h, 570, 28, 43692);
			attr_dev(label72, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label72, "for", "ddn-top");
			add_location(label72, file$h, 587, 40, 45091);
			attr_dev(input63, "type", "text");
			attr_dev(input63, "class", "form-control form-control-md validate number_validate");
			attr_dev(input63, "id", "ddn-top");
			attr_dev(input63, "name", "top");
			attr_dev(input63, "placeholder", input63_placeholder_value = l.top_of_dropdown);
			add_location(input63, file$h, 588, 40, 45231);
			attr_dev(div193, "class", "form-group");
			add_location(div193, file$h, 586, 36, 45025);
			attr_dev(div194, "class", "col-sm-6 px-1");
			add_location(div194, file$h, 585, 32, 44960);
			attr_dev(label73, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label73, "for", "ddn-left");
			add_location(label73, file$h, 593, 40, 45620);
			attr_dev(input64, "type", "text");
			attr_dev(input64, "class", "form-control form-control-md validate number_validate");
			attr_dev(input64, "id", "ddn-left");
			attr_dev(input64, "name", "left");
			attr_dev(input64, "placeholder", input64_placeholder_value = l.left_of_dropdown);
			add_location(input64, file$h, 594, 40, 45762);
			attr_dev(div195, "class", "form-group");
			add_location(div195, file$h, 592, 36, 45554);
			attr_dev(div196, "class", "col-sm-6 px-1");
			add_location(div196, file$h, 591, 32, 45489);
			attr_dev(div197, "class", "row");
			add_location(div197, file$h, 584, 28, 44909);
			attr_dev(label74, "class", "control-label font-weight-normal mb-0");
			attr_dev(label74, "for", "ddn-value");
			add_location(label74, file$h, 601, 40, 46238);
			attr_dev(textarea9, "class", "form-control form-control-md");
			attr_dev(textarea9, "id", "ddn-value");
			attr_dev(textarea9, "name", "value");
			attr_dev(textarea9, "placeholder", textarea9_placeholder_value = l.option_of_dropdown);
			add_location(textarea9, file$h, 602, 40, 46368);
			attr_dev(div198, "class", "form-group");
			add_location(div198, file$h, 600, 36, 46172);
			attr_dev(input65, "type", "hidden");
			attr_dev(input65, "id", "ddn-id");
			attr_dev(input65, "name", "id");
			add_location(input65, file$h, 604, 36, 46573);
			attr_dev(div199, "class", "col-sm-12 px-1");
			add_location(div199, file$h, 599, 32, 46106);
			attr_dev(div200, "class", "row");
			add_location(div200, file$h, 598, 28, 46055);
			attr_dev(div201, "class", "col-sm-12");
			add_location(div201, file$h, 569, 24, 43639);
			attr_dev(label75, "class", "control-label font-weight-normal mb-0");
			attr_dev(label75, "for", "ddn-style");
			add_location(label75, file$h, 610, 32, 46879);
			attr_dev(textarea10, "id", "ddn-style");
			attr_dev(textarea10, "class", "form-control form-control-md height_34");
			attr_dev(textarea10, "name", "style");
			attr_dev(textarea10, "placeholder", textarea10_placeholder_value = l.css_style_of_drpdwn);
			add_location(textarea10, file$h, 611, 32, 47003);
			attr_dev(div202, "class", "form-group");
			add_location(div202, file$h, 609, 28, 46821);
			attr_dev(div203, "class", "ev");
			attr_dev(div203, "type", "ddn");
			add_location(div203, file$h, 613, 28, 47203);
			attr_dev(div204, "class", "col-sm-6 pr-1 pl-2 d-none");
			add_location(div204, file$h, 608, 24, 46752);
			attr_dev(div205, "class", "row mx-0");
			add_location(div205, file$h, 568, 20, 43591);
			attr_dev(div206, "class", "dropdown h");
			add_location(div206, file$h, 567, 16, 43545);
			attr_dev(label76, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label76, "for", "lst-width");
			add_location(label76, file$h, 625, 40, 47742);
			attr_dev(input66, "type", "text");
			attr_dev(input66, "class", "form-control form-control-md validate number_validate");
			attr_dev(input66, "id", "lst-width");
			attr_dev(input66, "name", "width");
			attr_dev(input66, "placeholder", input66_placeholder_value = l.width_of_listbox);
			attr_dev(input66, "defaultvalue", "100");
			add_location(input66, file$h, 626, 40, 47893);
			attr_dev(div207, "class", "form-group");
			add_location(div207, file$h, 624, 36, 47676);
			attr_dev(div208, "class", "col-sm-6 px-1");
			add_location(div208, file$h, 623, 32, 47611);
			attr_dev(label77, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label77, "for", "lst-height");
			add_location(label77, file$h, 631, 40, 48306);
			attr_dev(input67, "type", "text");
			attr_dev(input67, "class", "form-control form-control-md validate number_validate");
			attr_dev(input67, "id", "lst-height");
			attr_dev(input67, "name", "height");
			attr_dev(input67, "placeholder", input67_placeholder_value = l.height_of_listbox);
			attr_dev(input67, "defaultvalue", "30");
			add_location(input67, file$h, 632, 40, 48459);
			attr_dev(div209, "class", "form-group");
			add_location(div209, file$h, 630, 36, 48240);
			attr_dev(div210, "class", "col-sm-6 px-1");
			add_location(div210, file$h, 629, 32, 48175);
			attr_dev(div211, "class", "row");
			add_location(div211, file$h, 622, 28, 47560);
			attr_dev(label78, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label78, "for", "lst-top");
			add_location(label78, file$h, 639, 40, 48957);
			attr_dev(input68, "type", "text");
			attr_dev(input68, "class", "form-control form-control-md validate number_validate");
			attr_dev(input68, "id", "lst-top");
			attr_dev(input68, "name", "top");
			attr_dev(input68, "placeholder", input68_placeholder_value = l.top_of_listbox);
			add_location(input68, file$h, 640, 40, 49097);
			attr_dev(div212, "class", "form-group");
			add_location(div212, file$h, 638, 36, 48891);
			attr_dev(div213, "class", "col-sm-6 px-1");
			add_location(div213, file$h, 637, 32, 48826);
			attr_dev(label79, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label79, "for", "lst-left");
			add_location(label79, file$h, 645, 40, 49485);
			attr_dev(input69, "type", "text");
			attr_dev(input69, "class", "form-control form-control-md validate number_validate");
			attr_dev(input69, "id", "lst-left");
			attr_dev(input69, "name", "left");
			attr_dev(input69, "placeholder", input69_placeholder_value = l.left_of_listbox);
			add_location(input69, file$h, 646, 40, 49627);
			attr_dev(div214, "class", "form-group");
			add_location(div214, file$h, 644, 36, 49419);
			attr_dev(div215, "class", "col-sm-6 px-1");
			add_location(div215, file$h, 643, 32, 49354);
			attr_dev(div216, "class", "row");
			add_location(div216, file$h, 636, 28, 48775);
			attr_dev(label80, "class", "control-label font-weight-normal mb-0");
			attr_dev(label80, "for", "lst-value");
			add_location(label80, file$h, 653, 40, 50102);
			attr_dev(textarea11, "class", "form-control form-control-md");
			attr_dev(textarea11, "id", "lst-value");
			attr_dev(textarea11, "name", "value");
			attr_dev(textarea11, "placeholder", textarea11_placeholder_value = l.option_of_listbox);
			add_location(textarea11, file$h, 654, 40, 50232);
			attr_dev(div217, "class", "form-group");
			add_location(div217, file$h, 652, 36, 50036);
			attr_dev(div218, "class", "col-sm-12 px-1");
			add_location(div218, file$h, 651, 32, 49970);
			attr_dev(input70, "type", "checkbox");
			attr_dev(input70, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input70, "id", "lst-multiple");
			attr_dev(input70, "name", "multiple");
			attr_dev(input70, "defaultvalue", "1");
			add_location(input70, file$h, 659, 40, 50633);
			attr_dev(label81, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label81, "for", "lst-multiple");
			add_location(label81, file$h, 660, 40, 50798);
			attr_dev(div219, "class", "form-group form-check form-check-inline");
			add_location(div219, file$h, 658, 36, 50538);
			attr_dev(div220, "class", "col-sm-12 px-1");
			add_location(div220, file$h, 657, 32, 50472);
			attr_dev(input71, "type", "hidden");
			attr_dev(input71, "id", "lst-size");
			attr_dev(input71, "name", "size");
			attr_dev(input71, "defaultvalue", "3");
			add_location(input71, file$h, 663, 32, 51032);
			attr_dev(input72, "type", "hidden");
			attr_dev(input72, "id", "lst-id");
			attr_dev(input72, "name", "id");
			add_location(input72, file$h, 664, 32, 51132);
			attr_dev(div221, "class", "row");
			add_location(div221, file$h, 650, 28, 49919);
			attr_dev(div222, "class", "col-sm-6");
			add_location(div222, file$h, 621, 24, 47508);
			attr_dev(label82, "class", "control-label font-weight-normal mb-0");
			attr_dev(label82, "for", "lst-style");
			add_location(label82, file$h, 669, 32, 51391);
			attr_dev(textarea12, "id", "lst-style");
			attr_dev(textarea12, "class", "form-control form-control-md height_34");
			attr_dev(textarea12, "name", "style");
			attr_dev(textarea12, "placeholder", textarea12_placeholder_value = l.css_style_of_listbox);
			add_location(textarea12, file$h, 670, 32, 51515);
			attr_dev(div223, "class", "form-group");
			add_location(div223, file$h, 668, 28, 51333);
			attr_dev(div224, "class", "ev");
			attr_dev(div224, "type", "lst");
			add_location(div224, file$h, 672, 28, 51716);
			attr_dev(div225, "class", "col-sm-6 pr-1 pl-2");
			add_location(div225, file$h, 667, 24, 51271);
			attr_dev(div226, "class", "row mx-0");
			add_location(div226, file$h, 620, 20, 47460);
			attr_dev(div227, "class", "listbox h");
			add_location(div227, file$h, 619, 16, 47415);
			attr_dev(label83, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label83, "for", "tbd-width");
			add_location(label83, file$h, 685, 40, 52322);
			attr_dev(input73, "type", "text");
			attr_dev(input73, "class", "form-control form-control-md validate number_validate");
			attr_dev(input73, "id", "tbd-width");
			attr_dev(input73, "name", "width");
			attr_dev(input73, "placeholder", input73_placeholder_value = l.width_of_tabhead);
			attr_dev(input73, "defaultvalue", "100");
			add_location(input73, file$h, 686, 40, 52473);
			attr_dev(div228, "class", "form-group");
			add_location(div228, file$h, 684, 36, 52256);
			attr_dev(div229, "class", "col-sm-6 px-1");
			add_location(div229, file$h, 683, 32, 52191);
			attr_dev(label84, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label84, "for", "tbd-height");
			add_location(label84, file$h, 691, 40, 52886);
			attr_dev(input74, "type", "text");
			attr_dev(input74, "class", "form-control form-control-md validate number_validate");
			attr_dev(input74, "id", "tbd-height");
			attr_dev(input74, "name", "height");
			attr_dev(input74, "placeholder", input74_placeholder_value = l.height_of_tabhead);
			attr_dev(input74, "defaultvalue", "30");
			add_location(input74, file$h, 692, 40, 53039);
			attr_dev(div230, "class", "form-group");
			add_location(div230, file$h, 690, 36, 52820);
			attr_dev(div231, "class", "col-sm-6 px-1");
			add_location(div231, file$h, 689, 32, 52755);
			attr_dev(div232, "class", "row");
			add_location(div232, file$h, 682, 28, 52140);
			attr_dev(label85, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label85, "for", "tbd-top");
			add_location(label85, file$h, 699, 40, 53537);
			attr_dev(input75, "type", "text");
			attr_dev(input75, "class", "form-control form-control-md validate number_validate");
			attr_dev(input75, "id", "tbd-top");
			attr_dev(input75, "name", "top");
			attr_dev(input75, "placeholder", input75_placeholder_value = l.top_of_tabhead);
			add_location(input75, file$h, 700, 40, 53677);
			attr_dev(div233, "class", "form-group");
			add_location(div233, file$h, 698, 36, 53471);
			attr_dev(div234, "class", "col-sm-6 px-1");
			add_location(div234, file$h, 697, 32, 53406);
			attr_dev(label86, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label86, "for", "tbd-left");
			add_location(label86, file$h, 705, 40, 54065);
			attr_dev(input76, "type", "text");
			attr_dev(input76, "class", "form-control form-control-md validate number_validate");
			attr_dev(input76, "id", "tbd-left");
			attr_dev(input76, "name", "left");
			attr_dev(input76, "placeholder", input76_placeholder_value = l.left_of_tabhead);
			add_location(input76, file$h, 706, 40, 54207);
			attr_dev(div235, "class", "form-group");
			add_location(div235, file$h, 704, 36, 53999);
			attr_dev(div236, "class", "col-sm-6 px-1");
			add_location(div236, file$h, 703, 32, 53934);
			attr_dev(div237, "class", "row");
			add_location(div237, file$h, 696, 28, 53355);
			attr_dev(label87, "class", "control-label font-weight-normal mb-0");
			attr_dev(label87, "for", "tbd-title");
			add_location(label87, file$h, 713, 40, 54682);
			attr_dev(input77, "type", "text");
			attr_dev(input77, "class", "form-control form-control-md");
			attr_dev(input77, "id", "tbd-title");
			attr_dev(input77, "name", "title");
			attr_dev(input77, "placeholder", input77_placeholder_value = l.title_of_tabhead);
			add_location(input77, file$h, 714, 40, 54810);
			attr_dev(div238, "class", "form-group");
			add_location(div238, file$h, 712, 36, 54616);
			attr_dev(div239, "class", "col-sm-12 px-1");
			add_location(div239, file$h, 711, 32, 54550);
			attr_dev(label88, "class", "control-label font-weight-normal mb-0");
			attr_dev(label88, "for", "tbd-class");
			add_location(label88, file$h, 719, 40, 55181);
			attr_dev(input78, "type", "text");
			attr_dev(input78, "class", "form-control form-control-md");
			attr_dev(input78, "id", "tbd-class");
			attr_dev(input78, "name", "class");
			attr_dev(input78, "placeholder", input78_placeholder_value = l.class_of_tabhead);
			add_location(input78, file$h, 720, 40, 55309);
			attr_dev(div240, "class", "form-group");
			add_location(div240, file$h, 718, 36, 55115);
			attr_dev(input79, "type", "hidden");
			attr_dev(input79, "id", "tbd-id");
			attr_dev(input79, "name", "id");
			add_location(input79, file$h, 722, 36, 55512);
			attr_dev(div241, "class", "col-sm-12 px-1");
			add_location(div241, file$h, 717, 32, 55049);
			attr_dev(div242, "class", "row");
			add_location(div242, file$h, 710, 28, 54499);
			attr_dev(div243, "class", div243_class_value = /*isDNDExtended*/ ctx[0] == 1 ? "col-sm-6" : "col-sm-12");
			add_location(div243, file$h, 681, 24, 52047);
			attr_dev(div244, "class", "row mx-0");
			add_location(div244, file$h, 679, 20, 51973);
			attr_dev(div245, "class", "tabhead h");
			add_location(div245, file$h, 678, 16, 51928);
			attr_dev(label89, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label89, "for", "img-width");
			add_location(label89, file$h, 745, 40, 56788);
			attr_dev(input80, "type", "text");
			attr_dev(input80, "class", "form-control form-control-md validate number_validate");
			attr_dev(input80, "id", "img-width");
			attr_dev(input80, "name", "width");
			attr_dev(input80, "placeholder", input80_placeholder_value = l.width_of_image);
			attr_dev(input80, "defaultvalue", "100");
			add_location(input80, file$h, 746, 40, 56939);
			attr_dev(div246, "class", "form-group");
			add_location(div246, file$h, 744, 36, 56722);
			attr_dev(div247, "class", "col-sm-6 px-1");
			add_location(div247, file$h, 743, 32, 56657);
			attr_dev(label90, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label90, "for", "img-height");
			add_location(label90, file$h, 751, 40, 57350);
			attr_dev(input81, "type", "text");
			attr_dev(input81, "class", "form-control form-control-md validate number_validate");
			attr_dev(input81, "id", "img-height");
			attr_dev(input81, "name", "height");
			attr_dev(input81, "placeholder", input81_placeholder_value = l.height_of_image);
			attr_dev(input81, "defaultvalue", "30");
			add_location(input81, file$h, 752, 40, 57503);
			attr_dev(div248, "class", "form-group");
			add_location(div248, file$h, 750, 36, 57284);
			attr_dev(div249, "class", "col-sm-6 px-1");
			add_location(div249, file$h, 749, 32, 57219);
			attr_dev(div250, "class", "row");
			add_location(div250, file$h, 742, 28, 56606);
			attr_dev(label91, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label91, "for", "img-top");
			add_location(label91, file$h, 759, 40, 57999);
			attr_dev(input82, "type", "text");
			attr_dev(input82, "class", "form-control form-control-md validate number_validate");
			attr_dev(input82, "id", "img-top");
			attr_dev(input82, "name", "top");
			attr_dev(input82, "placeholder", input82_placeholder_value = l.top_of_image);
			add_location(input82, file$h, 760, 40, 58139);
			attr_dev(div251, "class", "form-group");
			add_location(div251, file$h, 758, 36, 57933);
			attr_dev(div252, "class", "col-sm-6 px-1");
			add_location(div252, file$h, 757, 32, 57868);
			attr_dev(label92, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label92, "for", "img-left");
			add_location(label92, file$h, 765, 40, 58525);
			attr_dev(input83, "type", "text");
			attr_dev(input83, "class", "form-control form-control-md validate number_validate");
			attr_dev(input83, "id", "img-left");
			attr_dev(input83, "name", "left");
			attr_dev(input83, "placeholder", input83_placeholder_value = l.left_of_image);
			add_location(input83, file$h, 766, 40, 58667);
			attr_dev(div253, "class", "form-group");
			add_location(div253, file$h, 764, 36, 58459);
			attr_dev(div254, "class", "col-sm-6 px-1");
			add_location(div254, file$h, 763, 32, 58394);
			attr_dev(div255, "class", "row");
			add_location(div255, file$h, 756, 28, 57817);
			attr_dev(label93, "class", "control-label font-weight-normal mb-0");
			attr_dev(label93, "for", "img-title");
			add_location(label93, file$h, 773, 40, 59140);
			attr_dev(input84, "type", "text");
			attr_dev(input84, "class", "form-control form-control-md");
			attr_dev(input84, "id", "img-title");
			attr_dev(input84, "name", "title");
			attr_dev(input84, "placeholder", input84_placeholder_value = l.title_of_image);
			add_location(input84, file$h, 774, 40, 59268);
			attr_dev(div256, "class", "form-group");
			add_location(div256, file$h, 772, 36, 59074);
			attr_dev(div257, "class", "col-sm-12 px-1");
			add_location(div257, file$h, 771, 32, 59008);
			attr_dev(label94, "class", "control-label font-weight-normal mb-0");
			attr_dev(label94, "for", "img-bgimg");
			add_location(label94, file$h, 779, 40, 59637);
			attr_dev(input85, "type", "text");
			attr_dev(input85, "class", "form-control form-control-md");
			attr_dev(input85, "id", "img-bgimg");
			attr_dev(input85, "name", "bgimg");
			attr_dev(input85, "placeholder", input85_placeholder_value = l.bg_of_img);
			add_location(input85, file$h, 780, 40, 59776);
			attr_dev(input86, "type", "hidden");
			attr_dev(input86, "id", "img-id");
			attr_dev(input86, "name", "id");
			add_location(input86, file$h, 781, 40, 59932);
			attr_dev(div258, "class", "form-group");
			add_location(div258, file$h, 778, 36, 59571);
			attr_dev(div259, "class", "col-sm-12 px-1");
			add_location(div259, file$h, 777, 32, 59505);
			attr_dev(div260, "class", "row");
			add_location(div260, file$h, 770, 28, 58957);
			attr_dev(div261, "class", "col-sm-6");
			add_location(div261, file$h, 741, 24, 56554);
			attr_dev(label95, "class", "control-label font-weight-normal mb-0");
			attr_dev(label95, "for", "img-style");
			add_location(label95, file$h, 788, 32, 60275);
			attr_dev(textarea13, "id", "img-style");
			attr_dev(textarea13, "class", "form-control form-control-md height_34");
			attr_dev(textarea13, "name", "style");
			attr_dev(textarea13, "placeholder", textarea13_placeholder_value = l.css_style_of_image);
			add_location(textarea13, file$h, 789, 32, 60399);
			attr_dev(div262, "class", "form-group");
			add_location(div262, file$h, 787, 28, 60217);
			attr_dev(div263, "class", "ev");
			attr_dev(div263, "type", "img");
			add_location(div263, file$h, 791, 28, 60598);
			attr_dev(div264, "class", "col-sm-6 pr-1 pl-2");
			add_location(div264, file$h, 786, 24, 60155);
			attr_dev(div265, "class", "row mx-0");
			add_location(div265, file$h, 740, 20, 56506);
			attr_dev(div266, "class", "img h");
			add_location(div266, file$h, 739, 16, 56465);
			attr_dev(label96, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label96, "for", "lbl-width");
			add_location(label96, file$h, 803, 40, 61136);
			attr_dev(input87, "type", "text");
			attr_dev(input87, "class", "form-control form-control-md validate number_validate");
			attr_dev(input87, "id", "lbl-width");
			attr_dev(input87, "name", "width");
			attr_dev(input87, "placeholder", input87_placeholder_value = l.width_of_label);
			attr_dev(input87, "defaultvalue", "100");
			add_location(input87, file$h, 804, 40, 61287);
			attr_dev(div267, "class", "form-group");
			add_location(div267, file$h, 802, 36, 61070);
			attr_dev(div268, "class", "col-sm-6 px-1");
			add_location(div268, file$h, 801, 32, 61005);
			attr_dev(label97, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label97, "for", "lbl-height");
			add_location(label97, file$h, 809, 40, 61698);
			attr_dev(input88, "type", "text");
			attr_dev(input88, "class", "form-control form-control-md validate number_validate");
			attr_dev(input88, "id", "lbl-height");
			attr_dev(input88, "name", "height");
			attr_dev(input88, "placeholder", input88_placeholder_value = l.height_of_label);
			attr_dev(input88, "defaultvalue", "30");
			add_location(input88, file$h, 810, 40, 61851);
			attr_dev(div269, "class", "form-group");
			add_location(div269, file$h, 808, 36, 61632);
			attr_dev(div270, "class", "col-sm-6 px-1");
			add_location(div270, file$h, 807, 32, 61567);
			attr_dev(label98, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label98, "for", "lbl-top");
			add_location(label98, file$h, 815, 40, 62264);
			attr_dev(input89, "type", "text");
			attr_dev(input89, "class", "form-control form-control-md validate number_validate");
			attr_dev(input89, "id", "lbl-top");
			attr_dev(input89, "name", "top");
			attr_dev(input89, "placeholder", input89_placeholder_value = l.top_of_label);
			add_location(input89, file$h, 816, 40, 62404);
			attr_dev(div271, "class", "form-group");
			add_location(div271, file$h, 814, 36, 62198);
			attr_dev(div272, "class", "col-sm-6 px-1");
			add_location(div272, file$h, 813, 32, 62133);
			attr_dev(label99, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label99, "for", "lbl-left");
			add_location(label99, file$h, 821, 40, 62790);
			attr_dev(input90, "type", "text");
			attr_dev(input90, "class", "form-control form-control-md validate number_validate");
			attr_dev(input90, "id", "lbl-left");
			attr_dev(input90, "name", "left");
			attr_dev(input90, "placeholder", input90_placeholder_value = l.left_of_label);
			add_location(input90, file$h, 822, 40, 62932);
			attr_dev(div273, "class", "form-group");
			add_location(div273, file$h, 820, 36, 62724);
			attr_dev(div274, "class", "col-sm-6 px-1");
			add_location(div274, file$h, 819, 32, 62659);
			attr_dev(label100, "class", "control-label font-weight-normal mb-0");
			attr_dev(label100, "for", "lbl-title");
			add_location(label100, file$h, 827, 40, 63322);
			attr_dev(input91, "type", "text");
			attr_dev(input91, "class", "form-control form-control-md");
			attr_dev(input91, "id", "lbl-title");
			attr_dev(input91, "name", "title");
			attr_dev(input91, "placeholder", input91_placeholder_value = l.title_of_label);
			add_location(input91, file$h, 828, 40, 63450);
			attr_dev(div275, "class", "form-group");
			add_location(div275, file$h, 826, 36, 63256);
			attr_dev(div276, "class", "col-sm-12 px-1");
			add_location(div276, file$h, 825, 32, 63190);
			attr_dev(label101, "class", "control-label font-weight-normal mb-0");
			attr_dev(label101, "for", "lbl_border_size");
			add_location(label101, file$h, 833, 40, 63818);
			option12.__value = "0";
			option12.value = option12.__value;
			add_location(option12, file$h, 835, 44, 64099);
			option13.__value = "1";
			option13.value = option13.__value;
			add_location(option13, file$h, 836, 44, 64180);
			option14.__value = "2";
			option14.value = option14.__value;
			add_location(option14, file$h, 837, 44, 64254);
			option15.__value = "3";
			option15.value = option15.__value;
			add_location(option15, file$h, 838, 44, 64328);
			option16.__value = "4";
			option16.value = option16.__value;
			add_location(option16, file$h, 839, 44, 64402);
			option17.__value = "5";
			option17.value = option17.__value;
			add_location(option17, file$h, 840, 44, 64476);
			attr_dev(select7, "id", "lbl_border_size");
			attr_dev(select7, "class", "form-control form-control-md height_34");
			attr_dev(select7, "name", "border_size");
			add_location(select7, file$h, 834, 40, 63958);
			attr_dev(div277, "class", "form-group");
			add_location(div277, file$h, 832, 36, 63752);
			attr_dev(div278, "class", "col-sm-4 px-1");
			add_location(div278, file$h, 831, 32, 63687);
			attr_dev(label102, "class", "control-label font-weight-normal mb-0");
			attr_dev(label102, "for", "lbl_border_color");
			add_location(label102, file$h, 846, 40, 64804);
			option18.__value = "white";
			option18.value = option18.__value;
			add_location(option18, file$h, 848, 44, 65085);
			option19.__value = "black";
			option19.value = option19.__value;
			add_location(option19, file$h, 849, 44, 65170);
			option20.__value = "blue";
			option20.value = option20.__value;
			add_location(option20, file$h, 850, 44, 65256);
			option21.__value = "green";
			option21.value = option21.__value;
			add_location(option21, file$h, 851, 44, 65340);
			option22.__value = "red";
			option22.value = option22.__value;
			add_location(option22, file$h, 852, 44, 65426);
			attr_dev(select8, "id", "lbl_border_color");
			attr_dev(select8, "class", "form-control form-control-md height_34");
			attr_dev(select8, "name", "border_color");
			add_location(select8, file$h, 847, 40, 64942);
			attr_dev(div279, "class", "form-group");
			add_location(div279, file$h, 845, 36, 64738);
			attr_dev(div280, "class", "col-sm-4 px-1");
			add_location(div280, file$h, 844, 32, 64673);
			attr_dev(label103, "class", "control-label font-weight-normal mb-0");
			attr_dev(label103, "for", "lbl_background_color");
			add_location(label103, file$h, 858, 40, 65762);
			option23.__value = "";
			option23.value = option23.__value;
			add_location(option23, file$h, 860, 44, 66055);
			option24.__value = "#c5d0fa";
			option24.value = option24.__value;
			add_location(option24, file$h, 861, 44, 66135);
			option25.__value = "#ffa354";
			option25.value = option25.__value;
			add_location(option25, file$h, 862, 44, 66231);
			option26.__value = "#f5785d";
			option26.value = option26.__value;
			add_location(option26, file$h, 863, 44, 66327);
			attr_dev(select9, "id", "lbl_background_color");
			attr_dev(select9, "class", "form-control form-control-md height_34");
			attr_dev(select9, "name", "background_color");
			add_location(select9, file$h, 859, 40, 65904);
			attr_dev(input92, "type", "hidden");
			attr_dev(input92, "id", "lbl-id");
			attr_dev(input92, "name", "id");
			add_location(input92, file$h, 865, 40, 66469);
			attr_dev(div281, "class", "form-group");
			add_location(div281, file$h, 857, 36, 65696);
			attr_dev(div282, "class", "col-sm-4 px-1");
			add_location(div282, file$h, 856, 32, 65631);
			attr_dev(label104, "class", "font-weight-normal mb-0");
			attr_dev(label104, "for", "label_class");
			add_location(label104, file$h, 870, 40, 66764);
			attr_dev(select10, "class", "form-control form-control-md");
			attr_dev(select10, "id", "label_class");
			attr_dev(select10, "name", "label_class");
			add_location(select10, file$h, 871, 40, 66885);
			attr_dev(div283, "class", "form-group");
			add_location(div283, file$h, 869, 36, 66698);
			attr_dev(div284, "class", "col-sm-12 px-1");
			add_location(div284, file$h, 868, 32, 66632);
			attr_dev(input93, "type", "checkbox");
			attr_dev(input93, "class", "form-check-input");
			attr_dev(input93, "name", "richtext");
			attr_dev(input93, "id", "rich_label_title");
			add_location(input93, file$h, 877, 40, 67297);
			attr_dev(label105, "class", "font-weight-normal mb-0 form-check-label");
			attr_dev(label105, "for", "rich_label_title");
			add_location(label105, file$h, 878, 40, 67427);
			attr_dev(div285, "class", "form-check form-check-inline");
			add_location(div285, file$h, 876, 36, 67213);
			attr_dev(div286, "class", "col-sm-12 px-1 pb-2 d-none");
			add_location(div286, file$h, 875, 32, 67135);
			attr_dev(div287, "class", "row");
			add_location(div287, file$h, 800, 28, 60954);
			attr_dev(div288, "class", "col-sm-12");
			add_location(div288, file$h, 799, 24, 60901);
			attr_dev(div289, "class", "ev");
			attr_dev(div289, "type", "lbl");
			add_location(div289, file$h, 886, 36, 67881);
			attr_dev(div290, "class", "col-sm-12 px-1");
			add_location(div290, file$h, 885, 32, 67815);
			attr_dev(div291, "class", "row");
			add_location(div291, file$h, 884, 28, 67764);
			attr_dev(div292, "class", "col-sm-6 d-none");
			add_location(div292, file$h, 883, 24, 67705);
			attr_dev(div293, "class", "row mx-0");
			add_location(div293, file$h, 798, 20, 60853);
			attr_dev(div294, "class", "labal h");
			add_location(div294, file$h, 797, 16, 60810);
			attr_dev(label106, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label106, "for", "area-width");
			add_location(label106, file$h, 900, 40, 68510);
			attr_dev(input94, "type", "text");
			attr_dev(input94, "class", "form-control form-control-md validate number_validate");
			attr_dev(input94, "id", "area-width");
			attr_dev(input94, "name", "width");
			attr_dev(input94, "placeholder", input94_placeholder_value = l.width_of_area);
			attr_dev(input94, "defaultvalue", "100");
			add_location(input94, file$h, 901, 40, 68662);
			attr_dev(div295, "class", "form-group");
			add_location(div295, file$h, 899, 36, 68444);
			attr_dev(div296, "class", "col-sm-3 px-1");
			add_location(div296, file$h, 898, 32, 68379);
			attr_dev(label107, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label107, "for", "area-height");
			add_location(label107, file$h, 906, 40, 69073);
			attr_dev(input95, "type", "text");
			attr_dev(input95, "class", "form-control form-control-md validate number_validate");
			attr_dev(input95, "id", "area-height");
			attr_dev(input95, "name", "height");
			attr_dev(input95, "placeholder", input95_placeholder_value = l.height_of_area);
			attr_dev(input95, "defaultvalue", "30");
			add_location(input95, file$h, 907, 40, 69227);
			attr_dev(div297, "class", "form-group");
			add_location(div297, file$h, 905, 36, 69007);
			attr_dev(div298, "class", "col-sm-3 px-1");
			add_location(div298, file$h, 904, 32, 68942);
			attr_dev(label108, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label108, "for", "area-top");
			add_location(label108, file$h, 912, 40, 69640);
			attr_dev(input96, "type", "text");
			attr_dev(input96, "class", "form-control form-control-md validate number_validate");
			attr_dev(input96, "id", "area-top");
			attr_dev(input96, "name", "top");
			attr_dev(input96, "placeholder", input96_placeholder_value = l.top_of_area);
			add_location(input96, file$h, 913, 40, 69781);
			attr_dev(div299, "class", "form-group");
			add_location(div299, file$h, 911, 36, 69574);
			attr_dev(div300, "class", "col-sm-3 px-1");
			add_location(div300, file$h, 910, 32, 69509);
			attr_dev(label109, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label109, "for", "area-left");
			add_location(label109, file$h, 918, 40, 70167);
			attr_dev(input97, "type", "text");
			attr_dev(input97, "class", "form-control form-control-md validate number_validate");
			attr_dev(input97, "id", "area-left");
			attr_dev(input97, "name", "left");
			attr_dev(input97, "placeholder", input97_placeholder_value = l.left_of_area);
			add_location(input97, file$h, 919, 40, 70310);
			attr_dev(div301, "class", "form-group");
			add_location(div301, file$h, 917, 36, 70101);
			attr_dev(div302, "class", "col-sm-3 px-1");
			add_location(div302, file$h, 916, 32, 70036);
			attr_dev(div303, "class", "row");
			add_location(div303, file$h, 897, 28, 68328);
			attr_dev(label110, "class", "control-label font-weight-normal mb-0");
			attr_dev(label110, "for", "area-matrix");
			add_location(label110, file$h, 926, 40, 70782);
			attr_dev(input98, "type", "text");
			attr_dev(input98, "class", "form-control form-control-md");
			attr_dev(input98, "id", "area-matrix");
			attr_dev(input98, "name", "matrix");
			attr_dev(input98, "placeholder", input98_placeholder_value = l.matrix_of_area);
			add_location(input98, file$h, 927, 40, 70913);
			attr_dev(div304, "class", "form-group");
			add_location(div304, file$h, 925, 36, 70716);
			attr_dev(div305, "class", "col-sm-6 px-1");
			add_location(div305, file$h, 924, 32, 70651);
			attr_dev(label111, "class", "control-label font-weight-normal mb-0");
			attr_dev(label111, "for", "area-correctans");
			add_location(label111, file$h, 932, 40, 71284);
			attr_dev(input99, "type", "text");
			attr_dev(input99, "class", "form-control form-control-md");
			attr_dev(input99, "id", "area-correctans");
			attr_dev(input99, "name", "correctans");
			attr_dev(input99, "placeholder", input99_placeholder_value = l.crt_of_area);
			add_location(input99, file$h, 933, 40, 71427);
			attr_dev(div306, "class", "form-group");
			add_location(div306, file$h, 931, 36, 71218);
			attr_dev(div307, "class", "col-sm-6 px-1");
			add_location(div307, file$h, 930, 32, 71153);
			attr_dev(div308, "class", "row");
			add_location(div308, file$h, 923, 28, 70600);
			attr_dev(label112, "class", "control-label font-weight-normal mb-0");
			attr_dev(label112, "for", "area-defaultans");
			add_location(label112, file$h, 940, 40, 71886);
			attr_dev(input100, "type", "text");
			attr_dev(input100, "class", "form-control form-control-md");
			attr_dev(input100, "id", "area-defaultans");
			attr_dev(input100, "name", "defaultans");
			attr_dev(input100, "placeholder", input100_placeholder_value = l.def_of_area);
			add_location(input100, file$h, 941, 40, 72029);
			attr_dev(div309, "class", "form-group");
			add_location(div309, file$h, 939, 36, 71820);
			attr_dev(div310, "class", "col-sm-6 px-1");
			add_location(div310, file$h, 938, 32, 71755);
			attr_dev(div311, "class", "row");
			add_location(div311, file$h, 937, 28, 71704);
			attr_dev(input101, "type", "hidden");
			attr_dev(input101, "id", "area-id");
			attr_dev(input101, "name", "id");
			add_location(input101, file$h, 945, 28, 72306);
			attr_dev(div312, "class", "col-sm-12");
			add_location(div312, file$h, 896, 24, 68275);
			attr_dev(div313, "class", "col-sm-6");
			add_location(div313, file$h, 947, 24, 72410);
			attr_dev(div314, "class", "row mx-0");
			add_location(div314, file$h, 895, 20, 68227);
			attr_dev(div315, "class", "area h");
			add_location(div315, file$h, 894, 16, 68185);
			attr_dev(label113, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label113, "for", "mnl-width");
			add_location(label113, file$h, 957, 40, 72863);
			attr_dev(input102, "type", "text");
			attr_dev(input102, "class", "form-control form-control-md validate number_validate");
			attr_dev(input102, "id", "mnl-width");
			attr_dev(input102, "name", "width");
			attr_dev(input102, "placeholder", input102_placeholder_value = l.width_of_menulist);
			attr_dev(input102, "defaultvalue", "100");
			add_location(input102, file$h, 958, 40, 73014);
			attr_dev(div316, "class", "form-group");
			add_location(div316, file$h, 956, 36, 72797);
			attr_dev(div317, "class", "col-sm-3 px-1");
			add_location(div317, file$h, 955, 32, 72732);
			attr_dev(label114, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label114, "for", "mnl-height");
			add_location(label114, file$h, 963, 40, 73428);
			attr_dev(input103, "type", "text");
			attr_dev(input103, "class", "form-control form-control-md validate number_validate");
			attr_dev(input103, "id", "mnl-height");
			attr_dev(input103, "name", "height");
			attr_dev(input103, "placeholder", input103_placeholder_value = l.height_of_menulist);
			attr_dev(input103, "defaultvalue", "30");
			add_location(input103, file$h, 964, 40, 73581);
			attr_dev(div318, "class", "form-group");
			add_location(div318, file$h, 962, 36, 73362);
			attr_dev(div319, "class", "col-sm-3 px-1");
			add_location(div319, file$h, 961, 32, 73297);
			attr_dev(label115, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label115, "for", "mnl-top");
			add_location(label115, file$h, 969, 40, 73997);
			attr_dev(input104, "type", "text");
			attr_dev(input104, "class", "form-control form-control-md validate number_validate");
			attr_dev(input104, "id", "mnl-top");
			attr_dev(input104, "name", "top");
			attr_dev(input104, "placeholder", input104_placeholder_value = l.top_of_menulist);
			add_location(input104, file$h, 970, 40, 74137);
			attr_dev(div320, "class", "form-group");
			add_location(div320, file$h, 968, 36, 73931);
			attr_dev(div321, "class", "col-sm-3 px-1");
			add_location(div321, file$h, 967, 32, 73866);
			attr_dev(label116, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label116, "for", "mnl-left");
			add_location(label116, file$h, 975, 40, 74526);
			attr_dev(input105, "type", "text");
			attr_dev(input105, "class", "form-control form-control-md validate number_validate");
			attr_dev(input105, "id", "mnl-left");
			attr_dev(input105, "name", "left");
			attr_dev(input105, "placeholder", input105_placeholder_value = l.left_of_menulist);
			add_location(input105, file$h, 976, 40, 74668);
			attr_dev(div322, "class", "form-group");
			add_location(div322, file$h, 974, 36, 74460);
			attr_dev(div323, "class", "col-sm-3 px-1");
			add_location(div323, file$h, 973, 32, 74395);
			attr_dev(div324, "class", "row");
			add_location(div324, file$h, 954, 28, 72681);
			attr_dev(label117, "class", "control-label font-weight-normal mb-0");
			attr_dev(label117, "for", "mnl-matrix");
			add_location(label117, file$h, 983, 40, 75143);
			attr_dev(input106, "type", "text");
			attr_dev(input106, "class", "form-control form-control-md");
			attr_dev(input106, "id", "mnl-matrix");
			attr_dev(input106, "name", "matrix");
			attr_dev(input106, "placeholder", input106_placeholder_value = l.matrix_of_menulist);
			add_location(input106, file$h, 984, 40, 75273);
			attr_dev(div325, "class", "form-group");
			add_location(div325, file$h, 982, 36, 75077);
			attr_dev(div326, "class", "col-sm-6 px-1");
			add_location(div326, file$h, 981, 32, 75012);
			attr_dev(label118, "class", "control-label font-weight-normal mb-0");
			attr_dev(label118, "for", "mnl-correctans");
			add_location(label118, file$h, 989, 40, 75647);
			attr_dev(input107, "type", "text");
			attr_dev(input107, "class", "form-control form-control-md");
			attr_dev(input107, "id", "mnl-correctans");
			attr_dev(input107, "name", "correctans");
			attr_dev(input107, "placeholder", input107_placeholder_value = l.crt_of_menulist);
			add_location(input107, file$h, 990, 40, 75789);
			attr_dev(div327, "class", "form-group");
			add_location(div327, file$h, 988, 36, 75581);
			attr_dev(div328, "class", "col-sm-6 px-1");
			add_location(div328, file$h, 987, 32, 75516);
			attr_dev(div329, "class", "row");
			add_location(div329, file$h, 980, 28, 74961);
			attr_dev(label119, "class", "control-label font-weight-normal mb-0");
			attr_dev(label119, "for", "mnl-value");
			add_location(label119, file$h, 997, 40, 76251);
			attr_dev(input108, "type", "text");
			attr_dev(input108, "class", "form-control form-control-md");
			attr_dev(input108, "id", "mnl-value");
			attr_dev(input108, "name", "value");
			attr_dev(input108, "placeholder", input108_placeholder_value = l.event_val_menulist);
			add_location(input108, file$h, 998, 40, 76385);
			attr_dev(div330, "class", "form-group");
			add_location(div330, file$h, 996, 36, 76185);
			attr_dev(div331, "class", "col-sm-6 px-1");
			add_location(div331, file$h, 995, 32, 76120);
			attr_dev(div332, "class", "row");
			add_location(div332, file$h, 994, 28, 76069);
			attr_dev(input109, "type", "hidden");
			attr_dev(input109, "id", "mnl-id");
			attr_dev(input109, "name", "id");
			add_location(input109, file$h, 1002, 28, 76658);
			attr_dev(div333, "class", "col-sm-12");
			add_location(div333, file$h, 953, 24, 72628);
			attr_dev(div334, "class", "col-sm-6");
			add_location(div334, file$h, 1004, 24, 76761);
			attr_dev(div335, "class", "row mx-0");
			add_location(div335, file$h, 952, 20, 72580);
			attr_dev(div336, "class", "menulist h");
			add_location(div336, file$h, 951, 16, 72534);
			attr_dev(label120, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label120, "for", "hpt-width");
			add_location(label120, file$h, 1014, 40, 77213);
			attr_dev(input110, "type", "text");
			attr_dev(input110, "class", "form-control form-control-md validate number_validate");
			attr_dev(input110, "id", "hpt-width");
			attr_dev(input110, "name", "width");
			attr_dev(input110, "placeholder", input110_placeholder_value = l.width_of_hotspot);
			attr_dev(input110, "defaultvalue", "200");
			add_location(input110, file$h, 1015, 40, 77364);
			attr_dev(div337, "class", "form-group");
			add_location(div337, file$h, 1013, 36, 77147);
			attr_dev(div338, "class", "col-sm-3 px-1");
			add_location(div338, file$h, 1012, 32, 77082);
			attr_dev(label121, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label121, "for", "hpt-height");
			add_location(label121, file$h, 1020, 40, 77777);
			attr_dev(input111, "type", "text");
			attr_dev(input111, "class", "form-control form-control-md validate number_validate");
			attr_dev(input111, "id", "hpt-height");
			attr_dev(input111, "name", "height");
			attr_dev(input111, "placeholder", input111_placeholder_value = l.height_of_hotspot);
			attr_dev(input111, "defaultvalue", "200");
			add_location(input111, file$h, 1021, 40, 77930);
			attr_dev(div339, "class", "form-group");
			add_location(div339, file$h, 1019, 36, 77711);
			attr_dev(div340, "class", "col-sm-3 px-1");
			add_location(div340, file$h, 1018, 32, 77646);
			attr_dev(label122, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label122, "for", "hpt-top");
			add_location(label122, file$h, 1026, 40, 78346);
			attr_dev(input112, "type", "text");
			attr_dev(input112, "class", "form-control form-control-md validate number_validate");
			attr_dev(input112, "id", "hpt-top");
			attr_dev(input112, "name", "top");
			attr_dev(input112, "placeholder", input112_placeholder_value = l.top_of_hotspot);
			add_location(input112, file$h, 1027, 40, 78486);
			attr_dev(div341, "class", "form-group");
			add_location(div341, file$h, 1025, 36, 78280);
			attr_dev(div342, "class", "col-sm-3 px-1");
			add_location(div342, file$h, 1024, 32, 78215);
			attr_dev(label123, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label123, "for", "hpt-left");
			add_location(label123, file$h, 1032, 40, 78874);
			attr_dev(input113, "type", "text");
			attr_dev(input113, "class", "form-control form-control-md validate number_validate");
			attr_dev(input113, "id", "hpt-left");
			attr_dev(input113, "name", "left");
			attr_dev(input113, "placeholder", input113_placeholder_value = l.left_of_hotspot);
			add_location(input113, file$h, 1033, 40, 79016);
			attr_dev(div343, "class", "form-group");
			add_location(div343, file$h, 1031, 36, 78808);
			attr_dev(div344, "class", "col-sm-3 px-1");
			add_location(div344, file$h, 1030, 32, 78743);
			attr_dev(div345, "class", "row");
			add_location(div345, file$h, 1011, 28, 77031);
			attr_dev(label124, "class", "control-label font-weight-normal mb-0");
			attr_dev(label124, "for", "hpt-title");
			add_location(label124, file$h, 1040, 40, 79490);
			attr_dev(input114, "type", "text");
			attr_dev(input114, "class", "form-control form-control-md");
			attr_dev(input114, "id", "hpt-title");
			attr_dev(input114, "name", "title");
			attr_dev(input114, "placeholder", input114_placeholder_value = l.title_of_hotspot);
			add_location(input114, file$h, 1041, 40, 79618);
			attr_dev(div346, "class", "form-group");
			add_location(div346, file$h, 1039, 36, 79424);
			attr_dev(div347, "class", "col-sm-6 px-1");
			add_location(div347, file$h, 1038, 32, 79359);
			attr_dev(label125, "class", "control-label font-weight-normal mb-0");
			attr_dev(label125, "for", "hpt-name");
			add_location(label125, file$h, 1046, 40, 79988);
			attr_dev(input115, "type", "text");
			attr_dev(input115, "class", "form-control form-control-md");
			attr_dev(input115, "id", "hpt-name");
			attr_dev(input115, "name", "name");
			attr_dev(input115, "placeholder", input115_placeholder_value = l.name_of_hotspot);
			add_location(input115, file$h, 1047, 40, 80119);
			attr_dev(div348, "class", "form-group");
			add_location(div348, file$h, 1045, 36, 79922);
			attr_dev(div349, "class", "col-sm-6 px-1");
			add_location(div349, file$h, 1044, 32, 79857);
			attr_dev(div350, "class", "row");
			add_location(div350, file$h, 1037, 28, 79308);
			attr_dev(label126, "class", "control-label font-weight-normal mb-0");
			attr_dev(label126, "for", "hpt-targetimg");
			add_location(label126, file$h, 1054, 40, 80571);
			attr_dev(input116, "type", "text");
			attr_dev(input116, "class", "form-control form-control-md");
			attr_dev(input116, "id", "hpt-targetimg");
			attr_dev(input116, "name", "targetimg");
			attr_dev(input116, "placeholder", input116_placeholder_value = l.target_img_hpt);
			add_location(input116, file$h, 1055, 40, 80708);
			attr_dev(div351, "class", "form-group");
			add_location(div351, file$h, 1053, 36, 80505);
			attr_dev(div352, "class", "col-sm-6 px-1");
			add_location(div352, file$h, 1052, 32, 80440);
			attr_dev(input117, "type", "checkbox");
			attr_dev(input117, "class", "checkbox inline margin-bottom form-check-input");
			attr_dev(input117, "id", "hpt-showtarget");
			attr_dev(input117, "name", "showtarget");
			attr_dev(input117, "defaultvalue", "1");
			add_location(input117, file$h, 1060, 40, 81123);
			attr_dev(label127, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label127, "for", "hpt-showtarget");
			add_location(label127, file$h, 1061, 40, 81299);
			attr_dev(div353, "class", "form-group mt-4 pt-sm form-check form-check-inline");
			add_location(div353, file$h, 1059, 36, 81017);
			attr_dev(div354, "class", "col-sm-6 px-1");
			add_location(div354, file$h, 1058, 32, 80952);
			attr_dev(div355, "class", "row h");
			add_location(div355, file$h, 1051, 28, 80387);
			attr_dev(input118, "type", "hidden");
			attr_dev(input118, "id", "hpt-id");
			attr_dev(input118, "name", "id");
			add_location(input118, file$h, 1065, 28, 81563);
			attr_dev(div356, "class", "col-sm-12");
			add_location(div356, file$h, 1010, 24, 76978);
			attr_dev(div357, "class", "row mx-0");
			add_location(div357, file$h, 1009, 20, 76930);
			attr_dev(div358, "class", "hotspot h");
			add_location(div358, file$h, 1008, 16, 76885);
			attr_dev(label128, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label128, "for", "hpt_clk-width");
			add_location(label128, file$h, 1075, 40, 82044);
			attr_dev(input119, "type", "text");
			attr_dev(input119, "class", "form-control form-control-md validate number_validate");
			attr_dev(input119, "id", "hpt_clk-width");
			attr_dev(input119, "name", "width");
			attr_dev(input119, "placeholder", input119_placeholder_value = l.width_of_click);
			attr_dev(input119, "defaultvalue", "100");
			add_location(input119, file$h, 1076, 40, 82199);
			attr_dev(div359, "class", "form-group");
			add_location(div359, file$h, 1074, 36, 81978);
			attr_dev(div360, "class", "col-sm-3 px-1");
			add_location(div360, file$h, 1073, 32, 81913);
			attr_dev(label129, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label129, "for", "hpt_clk-height");
			add_location(label129, file$h, 1081, 40, 82614);
			attr_dev(input120, "type", "text");
			attr_dev(input120, "class", "form-control form-control-md validate number_validate");
			attr_dev(input120, "id", "hpt_clk-height");
			attr_dev(input120, "name", "height");
			attr_dev(input120, "placeholder", input120_placeholder_value = l.height_of_click);
			attr_dev(input120, "defaultvalue", "30");
			add_location(input120, file$h, 1082, 40, 82771);
			attr_dev(div361, "class", "form-group");
			add_location(div361, file$h, 1080, 36, 82548);
			attr_dev(div362, "class", "col-sm-3 px-1");
			add_location(div362, file$h, 1079, 32, 82483);
			attr_dev(label130, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label130, "for", "hpt_clk-top");
			add_location(label130, file$h, 1087, 40, 83188);
			attr_dev(input121, "type", "text");
			attr_dev(input121, "class", "form-control form-control-md validate number_validate");
			attr_dev(input121, "id", "hpt_clk-top");
			attr_dev(input121, "name", "top");
			attr_dev(input121, "placeholder", input121_placeholder_value = l.top_of_click);
			add_location(input121, file$h, 1088, 40, 83332);
			attr_dev(div363, "class", "form-group");
			add_location(div363, file$h, 1086, 36, 83122);
			attr_dev(div364, "class", "col-sm-3 px-1");
			add_location(div364, file$h, 1085, 32, 83057);
			attr_dev(label131, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label131, "for", "hpt_clk-left");
			add_location(label131, file$h, 1093, 40, 83722);
			attr_dev(input122, "type", "text");
			attr_dev(input122, "class", "form-control form-control-md validate number_validate");
			attr_dev(input122, "id", "hpt_clk-left");
			attr_dev(input122, "name", "left");
			attr_dev(input122, "placeholder", input122_placeholder_value = l.left_of_click);
			add_location(input122, file$h, 1094, 40, 83868);
			attr_dev(div365, "class", "form-group");
			add_location(div365, file$h, 1092, 36, 83656);
			attr_dev(div366, "class", "col-sm-3 px-1");
			add_location(div366, file$h, 1091, 32, 83591);
			attr_dev(div367, "class", "row");
			add_location(div367, file$h, 1072, 28, 81862);
			attr_dev(input123, "type", "hidden");
			attr_dev(input123, "id", "hpt_clk-id");
			attr_dev(input123, "name", "id");
			add_location(input123, file$h, 1098, 28, 84162);
			attr_dev(div368, "class", "col-sm-12");
			add_location(div368, file$h, 1071, 24, 81809);
			attr_dev(div369, "class", "row mx-0");
			add_location(div369, file$h, 1070, 20, 81761);
			attr_dev(div370, "class", "hotspot_click h");
			add_location(div370, file$h, 1069, 16, 81710);
			attr_dev(label132, "class", "control-label font-weight-normal mb-0");
			attr_dev(label132, "for", "tab-title");
			add_location(label132, file$h, 1108, 40, 84637);
			attr_dev(input124, "type", "text");
			attr_dev(input124, "class", "form-control form-control-md");
			attr_dev(input124, "id", "tab-title");
			attr_dev(input124, "name", "value");
			attr_dev(input124, "placeholder", input124_placeholder_value = l.title_of_tab);
			attr_dev(input124, "defaultvalue", "New");
			add_location(input124, file$h, 1109, 40, 84765);
			attr_dev(div371, "class", "form-group");
			add_location(div371, file$h, 1107, 36, 84571);
			attr_dev(div372, "class", "col-sm-6 px-1");
			add_location(div372, file$h, 1106, 32, 84506);
			attr_dev(label133, "class", "control-label font-weight-normal mb-0");
			attr_dev(label133, "for", "tab-alt");
			add_location(label133, file$h, 1114, 40, 85149);
			attr_dev(input125, "type", "text");
			attr_dev(input125, "class", "form-control form-control-md");
			attr_dev(input125, "id", "tab-alt");
			attr_dev(input125, "name", "alt");
			attr_dev(input125, "placeholder", input125_placeholder_value = l.alt_of_image);
			add_location(input125, file$h, 1115, 40, 85278);
			attr_dev(div373, "class", "form-group");
			add_location(div373, file$h, 1113, 36, 85083);
			attr_dev(div374, "class", "col-sm-6 px-1");
			add_location(div374, file$h, 1112, 32, 85018);
			attr_dev(div375, "class", "row");
			add_location(div375, file$h, 1105, 28, 84455);
			attr_dev(label134, "class", "control-label font-weight-normal mb-0");
			attr_dev(label134, "for", "tab-bgimg");
			add_location(label134, file$h, 1122, 40, 85723);
			attr_dev(input126, "type", "text");
			attr_dev(input126, "class", "form-control form-control-md");
			attr_dev(input126, "id", "tab-bgimg");
			attr_dev(input126, "name", "bgimg");
			attr_dev(input126, "placeholder", input126_placeholder_value = l.bg_of_tab);
			add_location(input126, file$h, 1123, 40, 85862);
			attr_dev(div376, "class", "form-group");
			add_location(div376, file$h, 1121, 36, 85657);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "id", "tab_upload_media");
			attr_dev(button2, "target", "tab-bgimg");
			attr_dev(button2, "class", "btn btn-outline-primary float-start");
			add_location(button2, file$h, 1125, 36, 86058);
			attr_dev(div377, "class", "col-sm-6 px-1");
			add_location(div377, file$h, 1120, 32, 85592);
			attr_dev(input127, "type", "checkbox");
			attr_dev(input127, "class", "checkbox inline form-check-input margin-bottom");
			attr_dev(input127, "id", "tab-display");
			attr_dev(input127, "name", "display");
			attr_dev(input127, "defaultvalue", "1");
			add_location(input127, file$h, 1129, 40, 86440);
			attr_dev(label135, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label135, "for", "tab-display");
			add_location(label135, file$h, 1130, 40, 86611);
			attr_dev(div378, "class", "form-group form-check form-check-inline");
			add_location(div378, file$h, 1128, 36, 86345);
			attr_dev(input128, "type", "hidden");
			attr_dev(input128, "id", "tab-id");
			attr_dev(input128, "name", "id");
			add_location(input128, file$h, 1132, 36, 86801);
			attr_dev(div379, "class", "col-sm-6 px-1 mt-4 pt-sm");
			add_location(div379, file$h, 1127, 32, 86269);
			attr_dev(div380, "class", "row");
			add_location(div380, file$h, 1119, 28, 85541);
			attr_dev(div381, "class", "col-sm-12");
			add_location(div381, file$h, 1104, 24, 84402);
			attr_dev(div382, "class", "row mx-0");
			add_location(div382, file$h, 1103, 20, 84354);
			attr_dev(div383, "class", "tab h");
			add_location(div383, file$h, 1102, 16, 84313);
			attr_dev(label136, "class", "control-label font-weight-normal mb-0");
			attr_dev(label136, "for", "step-bgimg");
			add_location(label136, file$h, 1144, 40, 87349);
			attr_dev(input129, "type", "text");
			attr_dev(input129, "class", "form-control form-control-md");
			attr_dev(input129, "id", "step-bgimg");
			attr_dev(input129, "name", "bgimg");
			attr_dev(input129, "placeholder", input129_placeholder_value = l.bg_of_step);
			add_location(input129, file$h, 1145, 40, 87489);
			attr_dev(div384, "class", "form-group");
			add_location(div384, file$h, 1143, 36, 87283);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "id", "step_upload_media");
			attr_dev(button3, "target", "step-bgimg");
			attr_dev(button3, "class", "btn btn-outline-primary float-start");
			add_location(button3, file$h, 1147, 36, 87687);
			attr_dev(div385, "class", "col-sm-6 px-1");
			add_location(div385, file$h, 1142, 32, 87218);
			attr_dev(label137, "class", "control-label font-weight-normal mb-0");
			attr_dev(label137, "for", "step-alt");
			add_location(label137, file$h, 1151, 40, 88031);
			attr_dev(input130, "type", "text");
			attr_dev(input130, "class", "form-control form-control-md");
			attr_dev(input130, "id", "step-alt");
			attr_dev(input130, "name", "alt");
			add_location(input130, file$h, 1152, 40, 88160);
			attr_dev(div386, "class", "form-group");
			add_location(div386, file$h, 1150, 36, 87965);
			attr_dev(div387, "class", "col-sm-6 px-1");
			add_location(div387, file$h, 1149, 32, 87900);
			attr_dev(div388, "class", "row");
			add_location(div388, file$h, 1141, 28, 87167);
			attr_dev(input131, "type", "checkbox");
			attr_dev(input131, "class", "checkbox inline margin-bottom form-check-input");
			attr_dev(input131, "id", "step-display");
			attr_dev(input131, "name", "display");
			attr_dev(input131, "defaultvalue", "1");
			add_location(input131, file$h, 1159, 40, 88604);
			attr_dev(label138, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label138, "for", "step-display");
			add_location(label138, file$h, 1160, 40, 88776);
			attr_dev(div389, "class", "form-group form-check form-check-inline");
			add_location(div389, file$h, 1158, 36, 88509);
			attr_dev(div390, "class", "col-sm-6 px-1");
			add_location(div390, file$h, 1157, 32, 88444);
			attr_dev(div391, "class", "row");
			add_location(div391, file$h, 1156, 28, 88393);
			attr_dev(input132, "type", "hidden");
			attr_dev(input132, "id", "step-id");
			attr_dev(input132, "name", "id");
			add_location(input132, file$h, 1164, 28, 89034);
			attr_dev(div392, "class", "col-sm-12");
			add_location(div392, file$h, 1140, 24, 87114);
			attr_dev(div393, "class", "row mx-0");
			add_location(div393, file$h, 1139, 20, 87066);
			attr_dev(div394, "class", "step h");
			add_location(div394, file$h, 1138, 16, 87024);
			attr_dev(label139, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label139, "for", "base-width");
			add_location(label139, file$h, 1174, 40, 89507);
			attr_dev(input133, "type", "text");
			attr_dev(input133, "class", "form-control form-control-md validate number_validate");
			attr_dev(input133, "id", "base-width");
			attr_dev(input133, "name", "width");
			attr_dev(input133, "placeholder", input133_placeholder_value = l.width_of_base);
			add_location(input133, file$h, 1175, 40, 89659);
			attr_dev(div395, "class", "form-group");
			add_location(div395, file$h, 1173, 36, 89441);
			attr_dev(div396, "class", "col-sm-4 px-1");
			add_location(div396, file$h, 1172, 32, 89376);
			attr_dev(label140, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label140, "for", "base-height");
			add_location(label140, file$h, 1180, 40, 90051);
			attr_dev(input134, "type", "text");
			attr_dev(input134, "class", "form-control form-control-md validate number_validate");
			attr_dev(input134, "id", "base-height");
			attr_dev(input134, "name", "height");
			attr_dev(input134, "placeholder", input134_placeholder_value = l.height_of_base);
			add_location(input134, file$h, 1181, 40, 90205);
			attr_dev(div397, "class", "form-group");
			add_location(div397, file$h, 1179, 36, 89985);
			attr_dev(div398, "class", "col-sm-4 px-1");
			add_location(div398, file$h, 1178, 32, 89920);
			attr_dev(label141, "class", "control-label font-weight-normal mb-0");
			attr_dev(label141, "for", "base-bgimg-alt");
			add_location(label141, file$h, 1186, 40, 90600);
			attr_dev(input135, "type", "text");
			attr_dev(input135, "class", "form-control form-control-md");
			attr_dev(input135, "id", "base-bgimg-alt");
			attr_dev(input135, "name", "alt");
			attr_dev(input135, "placeholder", input135_placeholder_value = l.alt_text_base);
			add_location(input135, file$h, 1187, 40, 90739);
			attr_dev(div399, "class", "form-group");
			add_location(div399, file$h, 1185, 36, 90534);
			attr_dev(div400, "class", "col-sm-4 px-1");
			add_location(div400, file$h, 1184, 32, 90469);
			attr_dev(div401, "class", "row");
			add_location(div401, file$h, 1171, 28, 89325);
			attr_dev(label142, "class", "control-label font-weight-normal mb-0");
			attr_dev(label142, "for", "base-bgimg");
			add_location(label142, file$h, 1194, 40, 91192);
			input136.readOnly = "readonly";
			attr_dev(input136, "type", "text");
			attr_dev(input136, "class", "form-control form-control-md");
			attr_dev(input136, "id", "base-bgimg");
			attr_dev(input136, "name", "bgimg");
			attr_dev(input136, "placeholder", input136_placeholder_value = l.bg_of_base);
			add_location(input136, file$h, 1195, 40, 91332);
			attr_dev(div402, "class", "form-group");
			add_location(div402, file$h, 1193, 36, 91126);
			attr_dev(div403, "class", "col-sm-6 px-1");
			add_location(div403, file$h, 1192, 32, 91061);
			attr_dev(button4, "type", "button");
			attr_dev(button4, "id", "upload_media");
			attr_dev(button4, "class", "btn btn-outline-primary float-start");
			add_location(button4, file$h, 1199, 36, 91661);
			attr_dev(input137, "type", "checkbox");
			attr_dev(input137, "class", "checkbox inline margin-bottom ml-3 position-relative top2");
			attr_dev(input137, "id", "base-borderrequired");
			attr_dev(input137, "name", "borderrequired");
			attr_dev(input137, "defaultvalue", "1");
			input137.checked = input137_checked_value = /*imgBorder*/ ctx[1] == 1 ? "checked" : '';
			add_location(input137, file$h, 1201, 40, 91896);
			attr_dev(label143, "class", "control-label ml-1 font-weight-normal mb-0 position-relative top1");
			attr_dev(label143, "for", "base-borderrequired");
			add_location(label143, file$h, 1202, 40, 92134);
			attr_dev(div404, "class", "form-group float-start mt-2");
			add_location(div404, file$h, 1200, 36, 91813);
			attr_dev(div405, "class", "col-sm-6 mt-3 pt-1 px-1");
			add_location(div405, file$h, 1198, 32, 91586);
			attr_dev(div406, "class", "row");
			add_location(div406, file$h, 1191, 28, 91010);
			attr_dev(div407, "class", "col-sm-12");
			add_location(div407, file$h, 1170, 24, 89272);
			attr_dev(div408, "class", "row mx-0");
			add_location(div408, file$h, 1169, 20, 89224);
			attr_dev(div409, "class", "base h");
			add_location(div409, file$h, 1168, 16, 89182);
			attr_dev(textarea14, "id", "code");
			attr_dev(textarea14, "name", "jscript");
			attr_dev(textarea14, "style", textarea14_style_value = { width: "100%", height: "300px" });
			add_location(textarea14, file$h, 1210, 24, 92534);
			attr_dev(div410, "class", "jscript h");
			add_location(div410, file$h, 1209, 16, 92485);
			attr_dev(label144, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label144, "for", "choicematrix-width");
			add_location(label144, file$h, 1218, 40, 92992);
			attr_dev(input138, "type", "text");
			attr_dev(input138, "class", "form-control form-control-md validate number_validate");
			attr_dev(input138, "id", "choicematrix-width");
			attr_dev(input138, "name", "width");
			attr_dev(input138, "placeholder", input138_placeholder_value = l.width_of_cm);
			attr_dev(input138, "defaultvalue", "20");
			add_location(input138, file$h, 1219, 40, 93152);
			attr_dev(div411, "class", "form-group");
			add_location(div411, file$h, 1217, 36, 92926);
			attr_dev(div412, "class", "col-sm-6 px-1");
			add_location(div412, file$h, 1216, 32, 92861);
			attr_dev(label145, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label145, "for", "choicematrix-height");
			add_location(label145, file$h, 1224, 40, 93568);
			attr_dev(input139, "type", "text");
			attr_dev(input139, "class", "form-control form-control-md validate number_validate");
			attr_dev(input139, "id", "choicematrix-height");
			attr_dev(input139, "name", "height");
			attr_dev(input139, "placeholder", input139_placeholder_value = l.height_of_cm);
			attr_dev(input139, "defaultvalue", "20");
			add_location(input139, file$h, 1225, 40, 93730);
			attr_dev(div413, "class", "form-group");
			add_location(div413, file$h, 1223, 36, 93502);
			attr_dev(div414, "class", "col-sm-6 px-1");
			add_location(div414, file$h, 1222, 32, 93437);
			attr_dev(div415, "class", "row");
			add_location(div415, file$h, 1215, 28, 92810);
			attr_dev(label146, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label146, "for", "choicematrix-top");
			add_location(label146, file$h, 1232, 40, 94232);
			attr_dev(input140, "type", "text");
			attr_dev(input140, "class", "form-control form-control-md validate number_validate");
			attr_dev(input140, "id", "choicematrix-top");
			attr_dev(input140, "name", "top");
			attr_dev(input140, "placeholder", input140_placeholder_value = l.top_of_cm);
			add_location(input140, file$h, 1233, 40, 94381);
			attr_dev(div416, "class", "form-group");
			add_location(div416, file$h, 1231, 36, 94166);
			attr_dev(div417, "class", "col-sm-6 px-1");
			add_location(div417, file$h, 1230, 32, 94101);
			attr_dev(label147, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label147, "for", "choicematrix-left");
			add_location(label147, file$h, 1238, 40, 94773);
			attr_dev(input141, "type", "text");
			attr_dev(input141, "class", "form-control form-control-md validate number_validate");
			attr_dev(input141, "id", "choicematrix-left");
			attr_dev(input141, "name", "left");
			attr_dev(input141, "placeholder", input141_placeholder_value = l.left_of_cm);
			add_location(input141, file$h, 1239, 40, 94924);
			attr_dev(div418, "class", "form-group");
			add_location(div418, file$h, 1237, 36, 94707);
			attr_dev(div419, "class", "col-sm-6 px-1");
			add_location(div419, file$h, 1236, 32, 94642);
			attr_dev(div420, "class", "row");
			add_location(div420, file$h, 1229, 28, 94050);
			attr_dev(label148, "class", "control-label font-weight-normal mb-0");
			attr_dev(label148, "for", "choicematrix-name");
			add_location(label148, file$h, 1246, 40, 95403);
			attr_dev(input142, "type", "text");
			attr_dev(input142, "class", "form-control form-control-md");
			attr_dev(input142, "id", "choicematrix-name");
			attr_dev(input142, "name", "name");
			attr_dev(input142, "placeholder", input142_placeholder_value = l.name_of_cm);
			add_location(input142, file$h, 1247, 40, 95543);
			attr_dev(div421, "class", "form-group");
			add_location(div421, file$h, 1245, 36, 95337);
			attr_dev(div422, "class", "col-sm-12 px-1");
			add_location(div422, file$h, 1244, 32, 95271);
			attr_dev(label149, "class", "control-label font-weight-normal mb-0");
			attr_dev(label149, "for", "choicematrix-correctans");
			add_location(label149, file$h, 1252, 40, 95915);
			attr_dev(input143, "type", "text");
			attr_dev(input143, "class", "form-control form-control-md");
			attr_dev(input143, "id", "choicematrix-correctans");
			attr_dev(input143, "name", "correctans");
			attr_dev(input143, "placeholder", input143_placeholder_value = l.crt_of_cm);
			add_location(input143, file$h, 1253, 40, 96066);
			attr_dev(div423, "class", "form-group");
			add_location(div423, file$h, 1251, 36, 95849);
			attr_dev(div424, "class", "col-sm-12 px-1");
			add_location(div424, file$h, 1250, 32, 95783);
			attr_dev(label150, "class", "control-label font-weight-normal mb-0");
			attr_dev(label150, "for", "choicematrix-defaultans");
			add_location(label150, file$h, 1258, 40, 96449);
			attr_dev(input144, "type", "text");
			attr_dev(input144, "class", "form-control form-control-md");
			attr_dev(input144, "id", "choicematrix-defaultans");
			attr_dev(input144, "name", "defaultans");
			attr_dev(input144, "placeholder", input144_placeholder_value = l.def_of_cm);
			add_location(input144, file$h, 1259, 40, 96600);
			attr_dev(div425, "class", "form-group");
			add_location(div425, file$h, 1257, 36, 96383);
			attr_dev(div426, "class", "col-sm-12 px-1");
			add_location(div426, file$h, 1256, 32, 96317);
			attr_dev(input145, "type", "hidden");
			attr_dev(input145, "id", "choicematrix-id");
			attr_dev(input145, "name", "id");
			add_location(input145, file$h, 1262, 32, 96851);
			attr_dev(div427, "class", "row");
			add_location(div427, file$h, 1243, 28, 95220);
			attr_dev(div428, "class", "col-sm-6");
			add_location(div428, file$h, 1214, 24, 92758);
			attr_dev(label151, "class", "control-label font-weight-normal mb-0");
			attr_dev(label151, "for", "choicematrix-style");
			add_location(label151, file$h, 1267, 32, 97119);
			attr_dev(textarea15, "id", "choicematrix-style");
			attr_dev(textarea15, "class", "form-control form-control-md height_34");
			attr_dev(textarea15, "name", "style");
			attr_dev(textarea15, "placeholder", textarea15_placeholder_value = l.css_of_cm);
			add_location(textarea15, file$h, 1268, 32, 97252);
			attr_dev(div429, "class", "form-group");
			add_location(div429, file$h, 1266, 28, 97061);
			attr_dev(div430, "class", "ev");
			attr_dev(div430, "type", "rd");
			add_location(div430, file$h, 1270, 28, 97451);
			attr_dev(div431, "class", "col-sm-6 pl-2 pr-1");
			add_location(div431, file$h, 1265, 24, 96999);
			attr_dev(div432, "class", "row mx-0");
			add_location(div432, file$h, 1213, 20, 92710);
			attr_dev(div433, "class", "choicematrix h");
			add_location(div433, file$h, 1212, 16, 92660);
			attr_dev(div434, "class", "modal-body modal_height svelte-16t69t");
			add_location(div434, file$h, 21, 12, 803);
			attr_dev(button5, "type", "button");
			attr_dev(button5, "class", "btn btn-light");
			attr_dev(button5, "data-bs-dismiss", "modal");
			add_location(button5, file$h, 1278, 16, 97722);
			attr_dev(button6, "type", "button");
			attr_dev(button6, "class", "btn btn-primary addElement");
			attr_dev(button6, "data-bs-dismiss", "modal");
			add_location(button6, file$h, 1279, 16, 97827);
			attr_dev(button7, "type", "button");
			attr_dev(button7, "class", "btn btn-primary errorBtn h");
			add_location(button7, file$h, 1280, 16, 97945);
			attr_dev(div435, "class", "modal-footer");
			add_location(div435, file$h, 1277, 12, 97678);
			attr_dev(div436, "class", "modal-content");
			add_location(div436, file$h, 16, 8, 548);
			attr_dev(div437, "class", "modal-dialog modal-dialog-centered");
			add_location(div437, file$h, 15, 4, 490);
			attr_dev(div438, "id", "authoring-modal");
			attr_dev(div438, "class", "modal fade");
			attr_dev(div438, "tabindex", "-1");
			add_location(div438, file$h, 14, 0, 425);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div438, anchor);
			append_dev(div438, div437);
			append_dev(div437, div436);
			append_dev(div436, div0);
			append_dev(div0, h4);
			append_dev(div0, t1);
			append_dev(div0, button0);
			append_dev(div436, t3);
			append_dev(div436, div434);
			append_dev(div434, div30);
			append_dev(div30, div29);
			append_dev(div29, div22);
			append_dev(div22, div21);
			append_dev(div21, div2);
			append_dev(div2, div1);
			append_dev(div1, label0);
			append_dev(div1, t5);
			append_dev(div1, input0);
			append_dev(div21, t6);
			append_dev(div21, div4);
			append_dev(div4, div3);
			append_dev(div3, label1);
			append_dev(div3, t8);
			append_dev(div3, input1);
			append_dev(div21, t9);
			append_dev(div21, div6);
			append_dev(div6, div5);
			append_dev(div5, label2);
			append_dev(div5, t11);
			append_dev(div5, input2);
			append_dev(div21, t12);
			append_dev(div21, div8);
			append_dev(div8, div7);
			append_dev(div7, label3);
			append_dev(div7, t14);
			append_dev(div7, input3);
			append_dev(div21, t15);
			append_dev(div21, div10);
			append_dev(div10, div9);
			append_dev(div9, label4);
			append_dev(div9, t17);
			append_dev(div9, input4);
			append_dev(div21, t18);
			append_dev(div21, div12);
			append_dev(div12, div11);
			append_dev(div11, label5);
			append_dev(div11, t20);
			append_dev(div11, select0);
			append_dev(select0, option0);
			append_dev(select0, option1);
			append_dev(select0, option2);
			append_dev(div21, t24);
			append_dev(div21, div14);
			append_dev(div14, div13);
			append_dev(div13, label6);
			append_dev(div13, t26);
			append_dev(div13, input5);
			append_dev(div21, t27);
			append_dev(div21, div16);
			append_dev(div16, div15);
			append_dev(div15, label7);
			append_dev(div15, t29);
			append_dev(div15, input6);
			append_dev(div16, t30);
			append_dev(div16, button1);
			append_dev(div21, t32);
			append_dev(div21, div18);
			append_dev(div18, div17);
			append_dev(div17, input7);
			append_dev(div17, t33);
			append_dev(div17, label8);
			append_dev(div21, t35);
			append_dev(div21, div20);
			append_dev(div20, div19);
			append_dev(div19, input8);
			append_dev(div19, t36);
			append_dev(div19, label9);
			append_dev(div29, t38);
			append_dev(div29, div28);
			append_dev(div28, div27);
			append_dev(div27, div24);
			append_dev(div24, div23);
			append_dev(div23, label10);
			append_dev(div23, t40);
			append_dev(div23, textarea0);
			append_dev(div27, t41);
			append_dev(div27, div26);
			append_dev(div26, div25);
			append_dev(div25, label11);
			append_dev(div25, t43);
			append_dev(div25, input9);
			append_dev(div30, t44);
			append_dev(div30, input10);
			append_dev(div434, t45);
			append_dev(div434, div60);
			append_dev(div60, div59);
			append_dev(div59, div55);
			append_dev(div55, div35);
			append_dev(div35, div32);
			append_dev(div32, div31);
			append_dev(div31, label12);
			append_dev(div31, t47);
			append_dev(div31, input11);
			append_dev(div35, t48);
			append_dev(div35, div34);
			append_dev(div34, div33);
			append_dev(div33, label13);
			append_dev(div33, t50);
			append_dev(div33, input12);
			append_dev(div55, t51);
			append_dev(div55, div40);
			append_dev(div40, div37);
			append_dev(div37, div36);
			append_dev(div36, label14);
			append_dev(div36, t53);
			append_dev(div36, input13);
			append_dev(div40, t54);
			append_dev(div40, div39);
			append_dev(div39, div38);
			append_dev(div38, label15);
			append_dev(div38, t56);
			append_dev(div38, input14);
			append_dev(div55, t57);
			append_dev(div55, div45);
			append_dev(div45, div42);
			append_dev(div42, div41);
			append_dev(div41, label16);
			append_dev(div41, t59);
			append_dev(div41, input15);
			append_dev(div45, t60);
			append_dev(div45, div44);
			append_dev(div44, div43);
			append_dev(div43, label17);
			append_dev(div43, t62);
			append_dev(div43, select1);
			append_dev(select1, option3);
			append_dev(select1, option4);
			append_dev(select1, option5);
			append_dev(div55, t66);
			append_dev(div55, div54);
			append_dev(div54, div47);
			append_dev(div47, div46);
			append_dev(div46, label18);
			append_dev(div46, t68);
			append_dev(div46, input16);
			append_dev(div54, t69);
			append_dev(div54, div49);
			append_dev(div49, div48);
			append_dev(div48, label19);
			append_dev(div48, t71);
			append_dev(div48, input17);
			append_dev(div54, t72);
			append_dev(div54, div51);
			append_dev(div51, div50);
			append_dev(div50, label20);
			append_dev(div50, t74);
			append_dev(div50, input18);
			append_dev(div54, t75);
			append_dev(div54, div53);
			append_dev(div53, div52);
			append_dev(div52, input19);
			append_dev(div52, t76);
			append_dev(div52, label21);
			append_dev(div54, t78);
			append_dev(div54, input20);
			append_dev(div59, t79);
			append_dev(div59, div58);
			append_dev(div58, div56);
			append_dev(div56, label22);
			append_dev(div56, t81);
			append_dev(div56, textarea1);
			append_dev(div58, t82);
			append_dev(div58, div57);
			mount_component(modalevent0, div57, null);
			append_dev(div434, t83);
			append_dev(div434, div92);
			append_dev(div92, div91);
			append_dev(div91, div86);
			append_dev(div86, div65);
			append_dev(div65, div62);
			append_dev(div62, div61);
			append_dev(div61, label23);
			append_dev(div61, t85);
			append_dev(div61, input21);
			append_dev(div65, t86);
			append_dev(div65, div64);
			append_dev(div64, div63);
			append_dev(div63, label24);
			append_dev(div63, t88);
			append_dev(div63, input22);
			append_dev(div86, t89);
			append_dev(div86, div70);
			append_dev(div70, div67);
			append_dev(div67, div66);
			append_dev(div66, label25);
			append_dev(div66, t91);
			append_dev(div66, input23);
			append_dev(div70, t92);
			append_dev(div70, div69);
			append_dev(div69, div68);
			append_dev(div68, label26);
			append_dev(div68, t94);
			append_dev(div68, input24);
			append_dev(div86, t95);
			append_dev(div86, div85);
			append_dev(div85, div72);
			append_dev(div72, div71);
			append_dev(div71, label27);
			append_dev(div71, t97);
			append_dev(div71, input25);
			append_dev(div85, t98);
			append_dev(div85, div74);
			append_dev(div74, div73);
			append_dev(div73, label28);
			append_dev(div73, t100);
			append_dev(div73, input26);
			append_dev(div85, t101);
			append_dev(div85, div76);
			append_dev(div76, div75);
			append_dev(div75, label29);
			append_dev(div75, t103);
			append_dev(div75, input27);
			append_dev(div85, t104);
			append_dev(div85, div78);
			append_dev(div78, div77);
			append_dev(div77, label30);
			append_dev(div77, t106);
			append_dev(div77, select2);
			append_dev(select2, option6);
			append_dev(select2, option7);
			append_dev(div85, t109);
			append_dev(div85, div80);
			append_dev(div80, div79);
			append_dev(div79, label31);
			append_dev(div79, t111);
			append_dev(div79, select3);
			append_dev(select3, option8);
			append_dev(select3, option9);
			append_dev(div85, t114);
			append_dev(div85, div82);
			append_dev(div82, div81);
			append_dev(div81, input28);
			append_dev(div81, t115);
			append_dev(div81, label32);
			append_dev(div85, t117);
			append_dev(div85, div84);
			append_dev(div84, div83);
			append_dev(div83, input29);
			append_dev(div83, t118);
			append_dev(div83, label33);
			append_dev(div85, t120);
			append_dev(div85, input30);
			append_dev(div91, t121);
			append_dev(div91, div90);
			append_dev(div90, div87);
			append_dev(div87, label34);
			append_dev(div87, t123);
			append_dev(div87, textarea2);
			append_dev(div90, t124);
			append_dev(div90, div88);
			append_dev(div88, label35);
			append_dev(div88, t126);
			append_dev(div88, select4);
			append_dev(div90, t127);
			append_dev(div90, div89);
			mount_component(modalevent1, div89, null);
			append_dev(div434, t128);
			append_dev(div434, div120);
			append_dev(div120, div119);
			append_dev(div119, div114);
			append_dev(div114, div97);
			append_dev(div97, div94);
			append_dev(div94, div93);
			append_dev(div93, label36);
			append_dev(div93, t130);
			append_dev(div93, input31);
			append_dev(div97, t131);
			append_dev(div97, div96);
			append_dev(div96, div95);
			append_dev(div95, label37);
			append_dev(div95, t133);
			append_dev(div95, input32);
			append_dev(div114, t134);
			append_dev(div114, div102);
			append_dev(div102, div99);
			append_dev(div99, div98);
			append_dev(div98, label38);
			append_dev(div98, t136);
			append_dev(div98, input33);
			append_dev(div102, t137);
			append_dev(div102, div101);
			append_dev(div101, div100);
			append_dev(div100, label39);
			append_dev(div100, t139);
			append_dev(div100, input34);
			append_dev(div114, t140);
			append_dev(div114, div113);
			append_dev(div113, div104);
			append_dev(div104, div103);
			append_dev(div103, label40);
			append_dev(div103, t142);
			append_dev(div103, textarea3);
			append_dev(div113, t143);
			append_dev(div113, div106);
			append_dev(div106, div105);
			append_dev(div105, label41);
			append_dev(div105, t145);
			append_dev(div105, textarea4);
			append_dev(div113, t146);
			append_dev(div113, div108);
			append_dev(div108, div107);
			append_dev(div107, label42);
			append_dev(div107, t148);
			append_dev(div107, input35);
			append_dev(div113, t149);
			append_dev(div113, div110);
			append_dev(div110, div109);
			append_dev(div109, label43);
			append_dev(div109, t151);
			append_dev(div109, select5);
			append_dev(select5, option10);
			append_dev(select5, option11);
			append_dev(div113, t154);
			append_dev(div113, div112);
			append_dev(div112, div111);
			append_dev(div111, input36);
			append_dev(div111, t155);
			append_dev(div111, label44);
			append_dev(div113, t157);
			append_dev(div113, input37);
			append_dev(div119, t158);
			append_dev(div119, div118);
			append_dev(div118, div115);
			append_dev(div115, label45);
			append_dev(div115, t160);
			append_dev(div115, textarea5);
			append_dev(div118, t161);
			append_dev(div118, div116);
			append_dev(div116, label46);
			append_dev(div116, t163);
			append_dev(div116, select6);
			append_dev(div118, t164);
			append_dev(div118, div117);
			mount_component(modalevent2, div117, null);
			append_dev(div434, t165);
			append_dev(div434, div141);
			append_dev(div141, div140);
			append_dev(div140, div136);
			append_dev(div136, div125);
			append_dev(div125, div122);
			append_dev(div122, div121);
			append_dev(div121, label47);
			append_dev(div121, t167);
			append_dev(div121, input38);
			append_dev(div125, t168);
			append_dev(div125, div124);
			append_dev(div124, div123);
			append_dev(div123, label48);
			append_dev(div123, t170);
			append_dev(div123, input39);
			append_dev(div136, t171);
			append_dev(div136, div130);
			append_dev(div130, div127);
			append_dev(div127, div126);
			append_dev(div126, label49);
			append_dev(div126, t173);
			append_dev(div126, input40);
			append_dev(div130, t174);
			append_dev(div130, div129);
			append_dev(div129, div128);
			append_dev(div128, label50);
			append_dev(div128, t176);
			append_dev(div128, input41);
			append_dev(div136, t177);
			append_dev(div136, div135);
			append_dev(div135, div132);
			append_dev(div132, div131);
			append_dev(div131, label51);
			append_dev(div131, t179);
			append_dev(div131, input42);
			append_dev(div135, t180);
			append_dev(div135, div134);
			append_dev(div134, div133);
			append_dev(div133, label52);
			append_dev(div133, t182);
			append_dev(div133, input43);
			append_dev(div135, t183);
			append_dev(div135, input44);
			append_dev(div140, t184);
			append_dev(div140, div139);
			append_dev(div139, div137);
			append_dev(div137, label53);
			append_dev(div137, t186);
			append_dev(div137, textarea6);
			append_dev(div139, t187);
			append_dev(div139, div138);
			mount_component(modalevent3, div138, null);
			append_dev(div434, t188);
			append_dev(div434, div166);
			append_dev(div166, div165);
			append_dev(div165, div161);
			append_dev(div161, div146);
			append_dev(div146, div143);
			append_dev(div143, div142);
			append_dev(div142, label54);
			append_dev(div142, t190);
			append_dev(div142, input45);
			append_dev(div146, t191);
			append_dev(div146, div145);
			append_dev(div145, div144);
			append_dev(div144, label55);
			append_dev(div144, t193);
			append_dev(div144, input46);
			append_dev(div161, t194);
			append_dev(div161, div151);
			append_dev(div151, div148);
			append_dev(div148, div147);
			append_dev(div147, label56);
			append_dev(div147, t196);
			append_dev(div147, input47);
			append_dev(div151, t197);
			append_dev(div151, div150);
			append_dev(div150, div149);
			append_dev(div149, label57);
			append_dev(div149, t199);
			append_dev(div149, input48);
			append_dev(div161, t200);
			append_dev(div161, div160);
			append_dev(div160, div153);
			append_dev(div153, div152);
			append_dev(div152, label58);
			append_dev(div152, t202);
			append_dev(div152, input49);
			append_dev(div160, t203);
			append_dev(div160, div155);
			append_dev(div155, div154);
			append_dev(div154, label59);
			append_dev(div154, t205);
			append_dev(div154, input50);
			append_dev(div160, t206);
			append_dev(div160, div157);
			append_dev(div157, div156);
			append_dev(div156, label60);
			append_dev(div156, t208);
			append_dev(div156, input51);
			append_dev(div160, t209);
			append_dev(div160, div159);
			append_dev(div159, div158);
			append_dev(div158, label61);
			append_dev(div158, t211);
			append_dev(div158, input52);
			append_dev(div160, t212);
			append_dev(div160, input53);
			append_dev(div165, t213);
			append_dev(div165, div164);
			append_dev(div164, div162);
			append_dev(div162, label62);
			append_dev(div162, t215);
			append_dev(div162, textarea7);
			append_dev(div164, t216);
			append_dev(div164, div163);
			mount_component(modalevent4, div163, null);
			append_dev(div434, t217);
			append_dev(div434, div187);
			append_dev(div187, div186);
			append_dev(div186, div182);
			append_dev(div182, div171);
			append_dev(div171, div168);
			append_dev(div168, div167);
			append_dev(div167, label63);
			append_dev(div167, t219);
			append_dev(div167, input54);
			append_dev(div171, t220);
			append_dev(div171, div170);
			append_dev(div170, div169);
			append_dev(div169, label64);
			append_dev(div169, t222);
			append_dev(div169, input55);
			append_dev(div182, t223);
			append_dev(div182, div176);
			append_dev(div176, div173);
			append_dev(div173, div172);
			append_dev(div172, label65);
			append_dev(div172, t225);
			append_dev(div172, input56);
			append_dev(div176, t226);
			append_dev(div176, div175);
			append_dev(div175, div174);
			append_dev(div174, label66);
			append_dev(div174, t228);
			append_dev(div174, input57);
			append_dev(div182, t229);
			append_dev(div182, div181);
			append_dev(div181, div178);
			append_dev(div178, div177);
			append_dev(div177, label67);
			append_dev(div177, t231);
			append_dev(div177, input58);
			append_dev(div181, t232);
			append_dev(div181, div180);
			append_dev(div180, div179);
			append_dev(div179, label68);
			append_dev(div179, t234);
			append_dev(div179, input59);
			append_dev(div180, t235);
			append_dev(div180, input60);
			append_dev(div186, t236);
			append_dev(div186, div185);
			append_dev(div185, div183);
			append_dev(div183, label69);
			append_dev(div183, t238);
			append_dev(div183, textarea8);
			append_dev(div185, t239);
			append_dev(div185, div184);
			mount_component(modalevent5, div184, null);
			append_dev(div434, t240);
			append_dev(div434, div206);
			append_dev(div206, div205);
			append_dev(div205, div201);
			append_dev(div201, div192);
			append_dev(div192, div189);
			append_dev(div189, div188);
			append_dev(div188, label70);
			append_dev(div188, t242);
			append_dev(div188, input61);
			append_dev(div192, t243);
			append_dev(div192, div191);
			append_dev(div191, div190);
			append_dev(div190, label71);
			append_dev(div190, t245);
			append_dev(div190, input62);
			append_dev(div201, t246);
			append_dev(div201, div197);
			append_dev(div197, div194);
			append_dev(div194, div193);
			append_dev(div193, label72);
			append_dev(div193, t248);
			append_dev(div193, input63);
			append_dev(div197, t249);
			append_dev(div197, div196);
			append_dev(div196, div195);
			append_dev(div195, label73);
			append_dev(div195, t251);
			append_dev(div195, input64);
			append_dev(div201, t252);
			append_dev(div201, div200);
			append_dev(div200, div199);
			append_dev(div199, div198);
			append_dev(div198, label74);
			append_dev(div198, t254);
			append_dev(div198, textarea9);
			append_dev(div199, t255);
			append_dev(div199, input65);
			append_dev(div205, t256);
			append_dev(div205, div204);
			append_dev(div204, div202);
			append_dev(div202, label75);
			append_dev(div202, t258);
			append_dev(div202, textarea10);
			append_dev(div204, t259);
			append_dev(div204, div203);
			mount_component(modalevent6, div203, null);
			append_dev(div434, t260);
			append_dev(div434, div227);
			append_dev(div227, div226);
			append_dev(div226, div222);
			append_dev(div222, div211);
			append_dev(div211, div208);
			append_dev(div208, div207);
			append_dev(div207, label76);
			append_dev(div207, t262);
			append_dev(div207, input66);
			append_dev(div211, t263);
			append_dev(div211, div210);
			append_dev(div210, div209);
			append_dev(div209, label77);
			append_dev(div209, t265);
			append_dev(div209, input67);
			append_dev(div222, t266);
			append_dev(div222, div216);
			append_dev(div216, div213);
			append_dev(div213, div212);
			append_dev(div212, label78);
			append_dev(div212, t268);
			append_dev(div212, input68);
			append_dev(div216, t269);
			append_dev(div216, div215);
			append_dev(div215, div214);
			append_dev(div214, label79);
			append_dev(div214, t271);
			append_dev(div214, input69);
			append_dev(div222, t272);
			append_dev(div222, div221);
			append_dev(div221, div218);
			append_dev(div218, div217);
			append_dev(div217, label80);
			append_dev(div217, t274);
			append_dev(div217, textarea11);
			append_dev(div221, t275);
			append_dev(div221, div220);
			append_dev(div220, div219);
			append_dev(div219, input70);
			append_dev(div219, t276);
			append_dev(div219, label81);
			append_dev(div221, t278);
			append_dev(div221, input71);
			append_dev(div221, t279);
			append_dev(div221, input72);
			append_dev(div226, t280);
			append_dev(div226, div225);
			append_dev(div225, div223);
			append_dev(div223, label82);
			append_dev(div223, t282);
			append_dev(div223, textarea12);
			append_dev(div225, t283);
			append_dev(div225, div224);
			mount_component(modalevent7, div224, null);
			append_dev(div434, t284);
			append_dev(div434, div245);
			append_dev(div245, div244);
			append_dev(div244, div243);
			append_dev(div243, div232);
			append_dev(div232, div229);
			append_dev(div229, div228);
			append_dev(div228, label83);
			append_dev(div228, t286);
			append_dev(div228, input73);
			append_dev(div232, t287);
			append_dev(div232, div231);
			append_dev(div231, div230);
			append_dev(div230, label84);
			append_dev(div230, t289);
			append_dev(div230, input74);
			append_dev(div243, t290);
			append_dev(div243, div237);
			append_dev(div237, div234);
			append_dev(div234, div233);
			append_dev(div233, label85);
			append_dev(div233, t292);
			append_dev(div233, input75);
			append_dev(div237, t293);
			append_dev(div237, div236);
			append_dev(div236, div235);
			append_dev(div235, label86);
			append_dev(div235, t295);
			append_dev(div235, input76);
			append_dev(div243, t296);
			append_dev(div243, div242);
			append_dev(div242, div239);
			append_dev(div239, div238);
			append_dev(div238, label87);
			append_dev(div238, t298);
			append_dev(div238, input77);
			append_dev(div242, t299);
			append_dev(div242, div241);
			append_dev(div241, div240);
			append_dev(div240, label88);
			append_dev(div240, t301);
			append_dev(div240, input78);
			append_dev(div241, t302);
			append_dev(div241, input79);
			append_dev(div244, t303);
			if (if_block) if_block.m(div244, null);
			append_dev(div434, t304);
			append_dev(div434, div266);
			append_dev(div266, div265);
			append_dev(div265, div261);
			append_dev(div261, div250);
			append_dev(div250, div247);
			append_dev(div247, div246);
			append_dev(div246, label89);
			append_dev(div246, t306);
			append_dev(div246, input80);
			append_dev(div250, t307);
			append_dev(div250, div249);
			append_dev(div249, div248);
			append_dev(div248, label90);
			append_dev(div248, t309);
			append_dev(div248, input81);
			append_dev(div261, t310);
			append_dev(div261, div255);
			append_dev(div255, div252);
			append_dev(div252, div251);
			append_dev(div251, label91);
			append_dev(div251, t312);
			append_dev(div251, input82);
			append_dev(div255, t313);
			append_dev(div255, div254);
			append_dev(div254, div253);
			append_dev(div253, label92);
			append_dev(div253, t315);
			append_dev(div253, input83);
			append_dev(div261, t316);
			append_dev(div261, div260);
			append_dev(div260, div257);
			append_dev(div257, div256);
			append_dev(div256, label93);
			append_dev(div256, t318);
			append_dev(div256, input84);
			append_dev(div260, t319);
			append_dev(div260, div259);
			append_dev(div259, div258);
			append_dev(div258, label94);
			append_dev(div258, t321);
			append_dev(div258, input85);
			append_dev(div258, t322);
			append_dev(div258, input86);
			append_dev(div265, t323);
			append_dev(div265, div264);
			append_dev(div264, div262);
			append_dev(div262, label95);
			append_dev(div262, t325);
			append_dev(div262, textarea13);
			append_dev(div264, t326);
			append_dev(div264, div263);
			mount_component(modalevent8, div263, null);
			append_dev(div434, t327);
			append_dev(div434, div294);
			append_dev(div294, div293);
			append_dev(div293, div288);
			append_dev(div288, div287);
			append_dev(div287, div268);
			append_dev(div268, div267);
			append_dev(div267, label96);
			append_dev(div267, t329);
			append_dev(div267, input87);
			append_dev(div287, t330);
			append_dev(div287, div270);
			append_dev(div270, div269);
			append_dev(div269, label97);
			append_dev(div269, t332);
			append_dev(div269, input88);
			append_dev(div287, t333);
			append_dev(div287, div272);
			append_dev(div272, div271);
			append_dev(div271, label98);
			append_dev(div271, t335);
			append_dev(div271, input89);
			append_dev(div287, t336);
			append_dev(div287, div274);
			append_dev(div274, div273);
			append_dev(div273, label99);
			append_dev(div273, t338);
			append_dev(div273, input90);
			append_dev(div287, t339);
			append_dev(div287, div276);
			append_dev(div276, div275);
			append_dev(div275, label100);
			append_dev(div275, t341);
			append_dev(div275, input91);
			append_dev(div287, t342);
			append_dev(div287, div278);
			append_dev(div278, div277);
			append_dev(div277, label101);
			append_dev(div277, t344);
			append_dev(div277, select7);
			append_dev(select7, option12);
			append_dev(select7, option13);
			append_dev(select7, option14);
			append_dev(select7, option15);
			append_dev(select7, option16);
			append_dev(select7, option17);
			append_dev(div287, t351);
			append_dev(div287, div280);
			append_dev(div280, div279);
			append_dev(div279, label102);
			append_dev(div279, t353);
			append_dev(div279, select8);
			append_dev(select8, option18);
			append_dev(select8, option19);
			append_dev(select8, option20);
			append_dev(select8, option21);
			append_dev(select8, option22);
			append_dev(div287, t359);
			append_dev(div287, div282);
			append_dev(div282, div281);
			append_dev(div281, label103);
			append_dev(div281, t361);
			append_dev(div281, select9);
			append_dev(select9, option23);
			append_dev(select9, option24);
			append_dev(select9, option25);
			append_dev(select9, option26);
			append_dev(div281, t366);
			append_dev(div281, input92);
			append_dev(div287, t367);
			append_dev(div287, div284);
			append_dev(div284, div283);
			append_dev(div283, label104);
			append_dev(div283, t369);
			append_dev(div283, select10);
			append_dev(div287, t370);
			append_dev(div287, div286);
			append_dev(div286, div285);
			append_dev(div285, input93);
			append_dev(div285, t371);
			append_dev(div285, label105);
			append_dev(div293, t373);
			append_dev(div293, div292);
			append_dev(div292, div291);
			append_dev(div291, div290);
			append_dev(div290, div289);
			mount_component(modalevent9, div289, null);
			append_dev(div434, t374);
			append_dev(div434, div315);
			append_dev(div315, div314);
			append_dev(div314, div312);
			append_dev(div312, div303);
			append_dev(div303, div296);
			append_dev(div296, div295);
			append_dev(div295, label106);
			append_dev(div295, t376);
			append_dev(div295, input94);
			append_dev(div303, t377);
			append_dev(div303, div298);
			append_dev(div298, div297);
			append_dev(div297, label107);
			append_dev(div297, t379);
			append_dev(div297, input95);
			append_dev(div303, t380);
			append_dev(div303, div300);
			append_dev(div300, div299);
			append_dev(div299, label108);
			append_dev(div299, t382);
			append_dev(div299, input96);
			append_dev(div303, t383);
			append_dev(div303, div302);
			append_dev(div302, div301);
			append_dev(div301, label109);
			append_dev(div301, t385);
			append_dev(div301, input97);
			append_dev(div312, t386);
			append_dev(div312, div308);
			append_dev(div308, div305);
			append_dev(div305, div304);
			append_dev(div304, label110);
			append_dev(div304, t388);
			append_dev(div304, input98);
			append_dev(div308, t389);
			append_dev(div308, div307);
			append_dev(div307, div306);
			append_dev(div306, label111);
			append_dev(div306, t391);
			append_dev(div306, input99);
			append_dev(div312, t392);
			append_dev(div312, div311);
			append_dev(div311, div310);
			append_dev(div310, div309);
			append_dev(div309, label112);
			append_dev(div309, t394);
			append_dev(div309, input100);
			append_dev(div312, t395);
			append_dev(div312, input101);
			append_dev(div314, t396);
			append_dev(div314, div313);
			append_dev(div434, t397);
			append_dev(div434, div336);
			append_dev(div336, div335);
			append_dev(div335, div333);
			append_dev(div333, div324);
			append_dev(div324, div317);
			append_dev(div317, div316);
			append_dev(div316, label113);
			append_dev(div316, t399);
			append_dev(div316, input102);
			append_dev(div324, t400);
			append_dev(div324, div319);
			append_dev(div319, div318);
			append_dev(div318, label114);
			append_dev(div318, t402);
			append_dev(div318, input103);
			append_dev(div324, t403);
			append_dev(div324, div321);
			append_dev(div321, div320);
			append_dev(div320, label115);
			append_dev(div320, t405);
			append_dev(div320, input104);
			append_dev(div324, t406);
			append_dev(div324, div323);
			append_dev(div323, div322);
			append_dev(div322, label116);
			append_dev(div322, t408);
			append_dev(div322, input105);
			append_dev(div333, t409);
			append_dev(div333, div329);
			append_dev(div329, div326);
			append_dev(div326, div325);
			append_dev(div325, label117);
			append_dev(div325, t411);
			append_dev(div325, input106);
			append_dev(div329, t412);
			append_dev(div329, div328);
			append_dev(div328, div327);
			append_dev(div327, label118);
			append_dev(div327, t414);
			append_dev(div327, input107);
			append_dev(div333, t415);
			append_dev(div333, div332);
			append_dev(div332, div331);
			append_dev(div331, div330);
			append_dev(div330, label119);
			append_dev(div330, t417);
			append_dev(div330, input108);
			append_dev(div333, t418);
			append_dev(div333, input109);
			append_dev(div335, t419);
			append_dev(div335, div334);
			append_dev(div434, t420);
			append_dev(div434, div358);
			append_dev(div358, div357);
			append_dev(div357, div356);
			append_dev(div356, div345);
			append_dev(div345, div338);
			append_dev(div338, div337);
			append_dev(div337, label120);
			append_dev(div337, t422);
			append_dev(div337, input110);
			append_dev(div345, t423);
			append_dev(div345, div340);
			append_dev(div340, div339);
			append_dev(div339, label121);
			append_dev(div339, t425);
			append_dev(div339, input111);
			append_dev(div345, t426);
			append_dev(div345, div342);
			append_dev(div342, div341);
			append_dev(div341, label122);
			append_dev(div341, t428);
			append_dev(div341, input112);
			append_dev(div345, t429);
			append_dev(div345, div344);
			append_dev(div344, div343);
			append_dev(div343, label123);
			append_dev(div343, t431);
			append_dev(div343, input113);
			append_dev(div356, t432);
			append_dev(div356, div350);
			append_dev(div350, div347);
			append_dev(div347, div346);
			append_dev(div346, label124);
			append_dev(div346, t434);
			append_dev(div346, input114);
			append_dev(div350, t435);
			append_dev(div350, div349);
			append_dev(div349, div348);
			append_dev(div348, label125);
			append_dev(div348, t437);
			append_dev(div348, input115);
			append_dev(div356, t438);
			append_dev(div356, div355);
			append_dev(div355, div352);
			append_dev(div352, div351);
			append_dev(div351, label126);
			append_dev(div351, t440);
			append_dev(div351, input116);
			append_dev(div355, t441);
			append_dev(div355, div354);
			append_dev(div354, div353);
			append_dev(div353, input117);
			append_dev(div353, t442);
			append_dev(div353, label127);
			append_dev(div356, t444);
			append_dev(div356, input118);
			append_dev(div434, t445);
			append_dev(div434, div370);
			append_dev(div370, div369);
			append_dev(div369, div368);
			append_dev(div368, div367);
			append_dev(div367, div360);
			append_dev(div360, div359);
			append_dev(div359, label128);
			append_dev(div359, t447);
			append_dev(div359, input119);
			append_dev(div367, t448);
			append_dev(div367, div362);
			append_dev(div362, div361);
			append_dev(div361, label129);
			append_dev(div361, t450);
			append_dev(div361, input120);
			append_dev(div367, t451);
			append_dev(div367, div364);
			append_dev(div364, div363);
			append_dev(div363, label130);
			append_dev(div363, t453);
			append_dev(div363, input121);
			append_dev(div367, t454);
			append_dev(div367, div366);
			append_dev(div366, div365);
			append_dev(div365, label131);
			append_dev(div365, t456);
			append_dev(div365, input122);
			append_dev(div368, t457);
			append_dev(div368, input123);
			append_dev(div434, t458);
			append_dev(div434, div383);
			append_dev(div383, div382);
			append_dev(div382, div381);
			append_dev(div381, div375);
			append_dev(div375, div372);
			append_dev(div372, div371);
			append_dev(div371, label132);
			append_dev(div371, t460);
			append_dev(div371, input124);
			append_dev(div375, t461);
			append_dev(div375, div374);
			append_dev(div374, div373);
			append_dev(div373, label133);
			append_dev(div373, t463);
			append_dev(div373, input125);
			append_dev(div381, t464);
			append_dev(div381, div380);
			append_dev(div380, div377);
			append_dev(div377, div376);
			append_dev(div376, label134);
			append_dev(div376, t466);
			append_dev(div376, input126);
			append_dev(div377, t467);
			append_dev(div377, button2);
			append_dev(div380, t469);
			append_dev(div380, div379);
			append_dev(div379, div378);
			append_dev(div378, input127);
			append_dev(div378, t470);
			append_dev(div378, label135);
			append_dev(div379, t472);
			append_dev(div379, input128);
			append_dev(div434, t473);
			append_dev(div434, div394);
			append_dev(div394, div393);
			append_dev(div393, div392);
			append_dev(div392, div388);
			append_dev(div388, div385);
			append_dev(div385, div384);
			append_dev(div384, label136);
			append_dev(div384, t475);
			append_dev(div384, input129);
			append_dev(div385, t476);
			append_dev(div385, button3);
			append_dev(div388, t478);
			append_dev(div388, div387);
			append_dev(div387, div386);
			append_dev(div386, label137);
			append_dev(div386, t480);
			append_dev(div386, input130);
			append_dev(div392, t481);
			append_dev(div392, div391);
			append_dev(div391, div390);
			append_dev(div390, div389);
			append_dev(div389, input131);
			append_dev(div389, t482);
			append_dev(div389, label138);
			append_dev(div392, t484);
			append_dev(div392, input132);
			append_dev(div434, t485);
			append_dev(div434, div409);
			append_dev(div409, div408);
			append_dev(div408, div407);
			append_dev(div407, div401);
			append_dev(div401, div396);
			append_dev(div396, div395);
			append_dev(div395, label139);
			append_dev(div395, t487);
			append_dev(div395, input133);
			append_dev(div401, t488);
			append_dev(div401, div398);
			append_dev(div398, div397);
			append_dev(div397, label140);
			append_dev(div397, t490);
			append_dev(div397, input134);
			append_dev(div401, t491);
			append_dev(div401, div400);
			append_dev(div400, div399);
			append_dev(div399, label141);
			append_dev(div399, t493);
			append_dev(div399, input135);
			append_dev(div407, t494);
			append_dev(div407, div406);
			append_dev(div406, div403);
			append_dev(div403, div402);
			append_dev(div402, label142);
			append_dev(div402, t496);
			append_dev(div402, input136);
			append_dev(div406, t497);
			append_dev(div406, div405);
			append_dev(div405, button4);
			append_dev(div405, t499);
			append_dev(div405, div404);
			append_dev(div404, input137);
			append_dev(div404, t500);
			append_dev(div404, label143);
			append_dev(div434, t502);
			append_dev(div434, div410);
			append_dev(div410, textarea14);
			append_dev(div434, t503);
			append_dev(div434, div433);
			append_dev(div433, div432);
			append_dev(div432, div428);
			append_dev(div428, div415);
			append_dev(div415, div412);
			append_dev(div412, div411);
			append_dev(div411, label144);
			append_dev(div411, t505);
			append_dev(div411, input138);
			append_dev(div415, t506);
			append_dev(div415, div414);
			append_dev(div414, div413);
			append_dev(div413, label145);
			append_dev(div413, t508);
			append_dev(div413, input139);
			append_dev(div428, t509);
			append_dev(div428, div420);
			append_dev(div420, div417);
			append_dev(div417, div416);
			append_dev(div416, label146);
			append_dev(div416, t511);
			append_dev(div416, input140);
			append_dev(div420, t512);
			append_dev(div420, div419);
			append_dev(div419, div418);
			append_dev(div418, label147);
			append_dev(div418, t514);
			append_dev(div418, input141);
			append_dev(div428, t515);
			append_dev(div428, div427);
			append_dev(div427, div422);
			append_dev(div422, div421);
			append_dev(div421, label148);
			append_dev(div421, t517);
			append_dev(div421, input142);
			append_dev(div427, t518);
			append_dev(div427, div424);
			append_dev(div424, div423);
			append_dev(div423, label149);
			append_dev(div423, t520);
			append_dev(div423, input143);
			append_dev(div427, t521);
			append_dev(div427, div426);
			append_dev(div426, div425);
			append_dev(div425, label150);
			append_dev(div425, t523);
			append_dev(div425, input144);
			append_dev(div427, t524);
			append_dev(div427, input145);
			append_dev(div432, t525);
			append_dev(div432, div431);
			append_dev(div431, div429);
			append_dev(div429, label151);
			append_dev(div429, t527);
			append_dev(div429, textarea15);
			append_dev(div431, t528);
			append_dev(div431, div430);
			mount_component(modalevent10, div430, null);
			append_dev(div436, t529);
			append_dev(div436, div435);
			append_dev(div435, button5);
			append_dev(div435, t531);
			append_dev(div435, button6);
			append_dev(div435, t533);
			append_dev(div435, button7);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*isDNDExtended*/ 1 && div243_class_value !== (div243_class_value = /*isDNDExtended*/ ctx[0] == 1 ? "col-sm-6" : "col-sm-12")) {
				attr_dev(div243, "class", div243_class_value);
			}

			if (/*isDNDExtended*/ ctx[0] == 1) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*isDNDExtended*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$g(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div244, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty & /*imgBorder*/ 2 && input137_checked_value !== (input137_checked_value = /*imgBorder*/ ctx[1] == 1 ? "checked" : '')) {
				prop_dev(input137, "checked", input137_checked_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modalevent0.$$.fragment, local);
			transition_in(modalevent1.$$.fragment, local);
			transition_in(modalevent2.$$.fragment, local);
			transition_in(modalevent3.$$.fragment, local);
			transition_in(modalevent4.$$.fragment, local);
			transition_in(modalevent5.$$.fragment, local);
			transition_in(modalevent6.$$.fragment, local);
			transition_in(modalevent7.$$.fragment, local);
			transition_in(if_block);
			transition_in(modalevent8.$$.fragment, local);
			transition_in(modalevent9.$$.fragment, local);
			transition_in(modalevent10.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modalevent0.$$.fragment, local);
			transition_out(modalevent1.$$.fragment, local);
			transition_out(modalevent2.$$.fragment, local);
			transition_out(modalevent3.$$.fragment, local);
			transition_out(modalevent4.$$.fragment, local);
			transition_out(modalevent5.$$.fragment, local);
			transition_out(modalevent6.$$.fragment, local);
			transition_out(modalevent7.$$.fragment, local);
			transition_out(if_block);
			transition_out(modalevent8.$$.fragment, local);
			transition_out(modalevent9.$$.fragment, local);
			transition_out(modalevent10.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div438);
			destroy_component(modalevent0);
			destroy_component(modalevent1);
			destroy_component(modalevent2);
			destroy_component(modalevent3);
			destroy_component(modalevent4);
			destroy_component(modalevent5);
			destroy_component(modalevent6);
			destroy_component(modalevent7);
			if (if_block) if_block.d();
			destroy_component(modalevent8);
			destroy_component(modalevent9);
			destroy_component(modalevent10);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DndModalBox', slots, []);
	let { isDNDExtended = 0 } = $$props;
	let { imgBorder } = $$props;
	const writable_props = ['isDNDExtended', 'imgBorder'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DndModalBox> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('isDNDExtended' in $$props) $$invalidate(0, isDNDExtended = $$props.isDNDExtended);
		if ('imgBorder' in $$props) $$invalidate(1, imgBorder = $$props.imgBorder);
	};

	$$self.$capture_state = () => ({ ModalEvent, l, isDNDExtended, imgBorder });

	$$self.$inject_state = $$props => {
		if ('isDNDExtended' in $$props) $$invalidate(0, isDNDExtended = $$props.isDNDExtended);
		if ('imgBorder' in $$props) $$invalidate(1, imgBorder = $$props.imgBorder);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [isDNDExtended, imgBorder];
}

class DndModalBox extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$h, create_fragment$h, safe_not_equal, { isDNDExtended: 0, imgBorder: 1 }, add_css);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DndModalBox",
			options,
			id: create_fragment$h.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*imgBorder*/ ctx[1] === undefined && !('imgBorder' in props)) {
			console.warn("<DndModalBox> was created without expected prop 'imgBorder'");
		}
	}

	get isDNDExtended() {
		throw new Error("<DndModalBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isDNDExtended(value) {
		throw new Error("<DndModalBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get imgBorder() {
		throw new Error("<DndModalBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set imgBorder(value) {
		throw new Error("<DndModalBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\DragNDrop.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file$i = "clsSMDragNDrop\\DragNDrop.svelte";

function get_each_context$g(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[39] = list[i];
	return child_ctx;
}

// (733:2) {#if step && step.length}
function create_if_block_2$2(ctx) {
	let each_1_anchor;
	let each_value = /*step*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
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
			if (dirty[0] & /*step, state, DND_AUTH, changeStep*/ 1073) {
				each_value = /*step*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$g(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$g(child_ctx);
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
		id: create_if_block_2$2.name,
		type: "if",
		source: "(733:2) {#if step && step.length}",
		ctx
	});

	return block;
}

// (735:16) {#if (data._display == "1" || data._ddisplay == '1') && state.store.updated == false}
function create_if_block_3(ctx) {
	let t_value = /*changeStep*/ ctx[10](/*data*/ ctx[39]._id) + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*step*/ 16 && t_value !== (t_value = /*changeStep*/ ctx[10](/*data*/ ctx[39]._id) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(735:16) {#if (data._display == \\\"1\\\" || data._ddisplay == '1') && state.store.updated == false}",
		ctx
	});

	return block;
}

// (734:3) {#each step as data}
function create_each_block$g(ctx) {
	let t0;
	let span;
	let input;
	let input_id_value;
	let input_defaultchecked_value;
	let t1;
	let t2_value = /*data*/ ctx[39]._id + "";
	let t2;
	let t3;
	let span_for_value;
	let span_key_value;
	let mounted;
	let dispose;
	let if_block = (/*data*/ ctx[39]._display == "1" || /*data*/ ctx[39]._ddisplay == '1') && /*state*/ ctx[5].store.updated == false && create_if_block_3(ctx);

	function click_handler_1() {
		return /*click_handler_1*/ ctx[16](/*data*/ ctx[39]);
	}

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			t0 = space();
			span = element("span");
			input = element("input");
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr_dev(input, "id", input_id_value = "step_" + /*data*/ ctx[39]._id);
			attr_dev(input, "type", "radio");
			attr_dev(input, "defaultvalue", "1");
			attr_dev(input, "name", "rbsAuth");
			attr_dev(input, "class", "baseradio dndradio");

			attr_dev(input, "defaultchecked", input_defaultchecked_value = (/*data*/ ctx[39]._display == "1" || /*data*/ ctx[39]._ddisplay == '1') && /*state*/ ctx[5].store.updated == false
			? true
			: false);

			add_location(input, file$i, 738, 5, 31029);
			attr_dev(span, "for", span_for_value = /*data*/ ctx[39]._id);
			attr_dev(span, "key", span_key_value = /*data*/ ctx[39]._id);
			add_location(span, file$i, 737, 4, 30986);
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, span, anchor);
			append_dev(span, input);
			append_dev(span, t1);
			append_dev(span, t2);
			append_dev(span, t3);

			if (!mounted) {
				dispose = listen_dev(input, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if ((/*data*/ ctx[39]._display == "1" || /*data*/ ctx[39]._ddisplay == '1') && /*state*/ ctx[5].store.updated == false) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_3(ctx);
					if_block.c();
					if_block.m(t0.parentNode, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*step*/ 16 && input_id_value !== (input_id_value = "step_" + /*data*/ ctx[39]._id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty[0] & /*step, state*/ 48 && input_defaultchecked_value !== (input_defaultchecked_value = (/*data*/ ctx[39]._display == "1" || /*data*/ ctx[39]._ddisplay == '1') && /*state*/ ctx[5].store.updated == false
			? true
			: false)) {
				attr_dev(input, "defaultchecked", input_defaultchecked_value);
			}

			if (dirty[0] & /*step*/ 16 && t2_value !== (t2_value = /*data*/ ctx[39]._id + "")) set_data_dev(t2, t2_value);

			if (dirty[0] & /*step*/ 16 && span_for_value !== (span_for_value = /*data*/ ctx[39]._id)) {
				attr_dev(span, "for", span_for_value);
			}

			if (dirty[0] & /*step*/ 16 && span_key_value !== (span_key_value = /*data*/ ctx[39]._id)) {
				attr_dev(span, "key", span_key_value);
			}
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(span);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$g.name,
		type: "each",
		source: "(734:3) {#each step as data}",
		ctx
	});

	return block;
}

// (766:12) {:else}
function create_else_block$1(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "id", "sample_image");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/bg_000PLn.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = l.sample_img);
			add_location(img, file$i, 766, 16, 32366);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*changeLoadState*/ ctx[12], false, false, false);
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
		id: create_else_block$1.name,
		type: "else",
		source: "(766:12) {:else}",
		ctx
	});

	return block;
}

// (764:12) {#if bgImg}
function create_if_block_1$5(ctx) {
	let img;
	let img_height_value;
	let img_width_value;
	let img_src_value;
	let img_class_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "height", img_height_value = /*imgHeight*/ ctx[2] + "px");
			attr_dev(img, "width", img_width_value = /*imgWidth*/ ctx[3] + "px");
			if (!src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[1])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", img_class_value = /*state*/ ctx[5].store.borderclass);

			attr_dev(img, "alt", img_alt_value = /*state*/ ctx[5].store.alt
			? /*state*/ ctx[5].store.alt
			: l.sample_img);

			add_location(img, file$i, 764, 16, 32063);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(img, "error", /*checkError*/ ctx[9], false, false, false),
					listen_dev(img, "load", /*load_handler*/ ctx[18], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*imgHeight*/ 4 && img_height_value !== (img_height_value = /*imgHeight*/ ctx[2] + "px")) {
				attr_dev(img, "height", img_height_value);
			}

			if (dirty[0] & /*imgWidth*/ 8 && img_width_value !== (img_width_value = /*imgWidth*/ ctx[3] + "px")) {
				attr_dev(img, "width", img_width_value);
			}

			if (dirty[0] & /*bgImg*/ 2 && !src_url_equal(img.src, img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[1])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*state*/ 32 && img_class_value !== (img_class_value = /*state*/ ctx[5].store.borderclass)) {
				attr_dev(img, "class", img_class_value);
			}

			if (dirty[0] & /*state*/ 32 && img_alt_value !== (img_alt_value = /*state*/ ctx[5].store.alt
			? /*state*/ ctx[5].store.alt
			: l.sample_img)) {
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
		id: create_if_block_1$5.name,
		type: "if",
		source: "(764:12) {#if bgImg}",
		ctx
	});

	return block;
}

// (769:12) {#if state.data && image_loaded}
function create_if_block$h(ctx) {
	let div;
	let drag0;
	let t0;
	let drag1;
	let t1;
	let drop0;
	let t2;
	let drop1;
	let t3;
	let radio;
	let t4;
	let select;
	let t5;
	let textbox;
	let t6;
	let multilinebox;
	let t7;
	let checkbox;
	let t8;
	let button;
	let t9;
	let tabhead;
	let t10;
	let img;
	let t11;
	let label;
	let t12;
	let hotspot;
	let t13;
	let menulist;
	let t14;
	let step_1;
	let t15;
	let tab;
	let current;

	drag0 = new Drag({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].drag,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	drag1 = new Drag({
			props: {
				index: 1,
				modules: /*state*/ ctx[5].data[1],
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	drop0 = new Drop({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].drop,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	drop1 = new Drop({
			props: {
				index: 1,
				modules: /*state*/ ctx[5].data[2],
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].radio,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].select,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].textbox,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].multilinebox,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].checkbox,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	button = new Button({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].button,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].tabhead,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].img,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].label,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].hotspot,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].menulist,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	step_1 = new Step({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].step,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem,
				checkImageStatus: /*checkImageStatus*/ ctx[8]
			},
			$$inline: true
		});

	tab = new Tab({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].tab,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem,
				checkImageStatus: /*checkImageStatus*/ ctx[8]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(drag0.$$.fragment);
			t0 = space();
			create_component(drag1.$$.fragment);
			t1 = space();
			create_component(drop0.$$.fragment);
			t2 = space();
			create_component(drop1.$$.fragment);
			t3 = space();
			create_component(radio.$$.fragment);
			t4 = space();
			create_component(select.$$.fragment);
			t5 = space();
			create_component(textbox.$$.fragment);
			t6 = space();
			create_component(multilinebox.$$.fragment);
			t7 = space();
			create_component(checkbox.$$.fragment);
			t8 = space();
			create_component(button.$$.fragment);
			t9 = space();
			create_component(tabhead.$$.fragment);
			t10 = space();
			create_component(img.$$.fragment);
			t11 = space();
			create_component(label.$$.fragment);
			t12 = space();
			create_component(hotspot.$$.fragment);
			t13 = space();
			create_component(menulist.$$.fragment);
			t14 = space();
			create_component(step_1.$$.fragment);
			t15 = space();
			create_component(tab.$$.fragment);
			add_location(div, file$i, 769, 16, 32590);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(drag0, div, null);
			append_dev(div, t0);
			mount_component(drag1, div, null);
			append_dev(div, t1);
			mount_component(drop0, div, null);
			append_dev(div, t2);
			mount_component(drop1, div, null);
			append_dev(div, t3);
			mount_component(radio, div, null);
			append_dev(div, t4);
			mount_component(select, div, null);
			append_dev(div, t5);
			mount_component(textbox, div, null);
			append_dev(div, t6);
			mount_component(multilinebox, div, null);
			append_dev(div, t7);
			mount_component(checkbox, div, null);
			append_dev(div, t8);
			mount_component(button, div, null);
			append_dev(div, t9);
			mount_component(tabhead, div, null);
			append_dev(div, t10);
			mount_component(img, div, null);
			append_dev(div, t11);
			mount_component(label, div, null);
			append_dev(div, t12);
			mount_component(hotspot, div, null);
			append_dev(div, t13);
			mount_component(menulist, div, null);
			append_dev(div, t14);
			mount_component(step_1, div, null);
			append_dev(div, t15);
			mount_component(tab, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const drag0_changes = {};
			if (dirty[0] & /*state*/ 32) drag0_changes.modules = /*state*/ ctx[5].data[0].drag;
			if (dirty[0] & /*DND_AUTH*/ 1) drag0_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drag0_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drag0.$set(drag0_changes);
			const drag1_changes = {};
			if (dirty[0] & /*state*/ 32) drag1_changes.modules = /*state*/ ctx[5].data[1];
			if (dirty[0] & /*DND_AUTH*/ 1) drag1_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drag1_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drag1.$set(drag1_changes);
			const drop0_changes = {};
			if (dirty[0] & /*state*/ 32) drop0_changes.modules = /*state*/ ctx[5].data[0].drop;
			if (dirty[0] & /*DND_AUTH*/ 1) drop0_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drop0_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drop0.$set(drop0_changes);
			const drop1_changes = {};
			if (dirty[0] & /*state*/ 32) drop1_changes.modules = /*state*/ ctx[5].data[2];
			if (dirty[0] & /*DND_AUTH*/ 1) drop1_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drop1_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drop1.$set(drop1_changes);
			const radio_changes = {};
			if (dirty[0] & /*state*/ 32) radio_changes.modules = /*state*/ ctx[5].data[0].radio;
			if (dirty[0] & /*DND_AUTH*/ 1) radio_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) radio_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty[0] & /*state*/ 32) select_changes.modules = /*state*/ ctx[5].data[0].select;
			if (dirty[0] & /*DND_AUTH*/ 1) select_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) select_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty[0] & /*state*/ 32) textbox_changes.modules = /*state*/ ctx[5].data[0].textbox;
			if (dirty[0] & /*DND_AUTH*/ 1) textbox_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) textbox_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};
			if (dirty[0] & /*state*/ 32) multilinebox_changes.modules = /*state*/ ctx[5].data[0].multilinebox;
			if (dirty[0] & /*DND_AUTH*/ 1) multilinebox_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) multilinebox_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty[0] & /*state*/ 32) checkbox_changes.modules = /*state*/ ctx[5].data[0].checkbox;
			if (dirty[0] & /*DND_AUTH*/ 1) checkbox_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) checkbox_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			checkbox.$set(checkbox_changes);
			const button_changes = {};
			if (dirty[0] & /*state*/ 32) button_changes.modules = /*state*/ ctx[5].data[0].button;
			if (dirty[0] & /*DND_AUTH*/ 1) button_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) button_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			button.$set(button_changes);
			const tabhead_changes = {};
			if (dirty[0] & /*state*/ 32) tabhead_changes.modules = /*state*/ ctx[5].data[0].tabhead;
			if (dirty[0] & /*DND_AUTH*/ 1) tabhead_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) tabhead_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty[0] & /*state*/ 32) img_changes.modules = /*state*/ ctx[5].data[0].img;
			if (dirty[0] & /*DND_AUTH*/ 1) img_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) img_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			img.$set(img_changes);
			const label_changes = {};
			if (dirty[0] & /*state*/ 32) label_changes.modules = /*state*/ ctx[5].data[0].label;
			if (dirty[0] & /*DND_AUTH*/ 1) label_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) label_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty[0] & /*state*/ 32) hotspot_changes.modules = /*state*/ ctx[5].data[0].hotspot;
			if (dirty[0] & /*DND_AUTH*/ 1) hotspot_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) hotspot_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty[0] & /*state*/ 32) menulist_changes.modules = /*state*/ ctx[5].data[0].menulist;
			if (dirty[0] & /*DND_AUTH*/ 1) menulist_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) menulist_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			menulist.$set(menulist_changes);
			const step_1_changes = {};
			if (dirty[0] & /*state*/ 32) step_1_changes.modules = /*state*/ ctx[5].data[0].step;
			if (dirty[0] & /*DND_AUTH*/ 1) step_1_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) step_1_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			step_1.$set(step_1_changes);
			const tab_changes = {};
			if (dirty[0] & /*state*/ 32) tab_changes.modules = /*state*/ ctx[5].data[0].tab;
			if (dirty[0] & /*DND_AUTH*/ 1) tab_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) tab_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			tab.$set(tab_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag0.$$.fragment, local);
			transition_in(drag1.$$.fragment, local);
			transition_in(drop0.$$.fragment, local);
			transition_in(drop1.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			transition_in(step_1.$$.fragment, local);
			transition_in(tab.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag0.$$.fragment, local);
			transition_out(drag1.$$.fragment, local);
			transition_out(drop0.$$.fragment, local);
			transition_out(drop1.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			transition_out(step_1.$$.fragment, local);
			transition_out(tab.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(drag0);
			destroy_component(drag1);
			destroy_component(drop0);
			destroy_component(drop1);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
			destroy_component(step_1);
			destroy_component(tab);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$h.name,
		type: "if",
		source: "(769:12) {#if state.data && image_loaded}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let div5;
	let div0;
	let input0;
	let t0;
	let t1_value = l.base_steps + "";
	let t1;
	let t2;
	let t3;
	let center0;
	let div2;
	let div1;
	let button0;
	let i;
	let button0_title_value;
	let t4;
	let t5;
	let t6;
	let input1;
	let t7;
	let button1;
	let t8;
	let center1;
	let div3;
	let t9;
	let div4;
	let t10;
	let dndmodalbox;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*step*/ ctx[4] && /*step*/ ctx[4].length && create_if_block_2$2(ctx);

	function select_block_type(ctx, dirty) {
		if (/*bgImg*/ ctx[1]) return create_if_block_1$5;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = /*state*/ ctx[5].data && /*image_loaded*/ ctx[6] && create_if_block$h(ctx);

	dndmodalbox = new DndModalBox({
			props: {
				isDNDExtended: /*DND_AUTH*/ ctx[0].isDNDExtended,
				imgBorder: /*imgBorder*/ ctx[7]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div5 = element("div");
			div0 = element("div");
			input0 = element("input");
			t0 = space();
			t1 = text(t1_value);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			center0 = element("center");
			div2 = element("div");
			div1 = element("div");
			button0 = element("button");
			i = element("i");
			t4 = space();
			if_block1.c();
			t5 = space();
			if (if_block2) if_block2.c();
			t6 = space();
			input1 = element("input");
			t7 = space();
			button1 = element("button");
			t8 = space();
			center1 = element("center");
			div3 = element("div");
			t9 = space();
			div4 = element("div");
			t10 = space();
			create_component(dndmodalbox.$$.fragment);
			attr_dev(input0, "id", "baseAuth");
			attr_dev(input0, "type", "radio");
			attr_dev(input0, "defaultvalue", "1");
			attr_dev(input0, "defaultchecked", "");
			attr_dev(input0, "name", "rbsAuth");
			attr_dev(input0, "class", "baseradio dndradio");
			add_location(input0, file$i, 730, 2, 30577);
			attr_dev(div0, "id", "steps");
			attr_dev(div0, "class", "h");
			add_location(div0, file$i, 729, 4, 30546);
			attr_dev(i, "class", "icomoon-24px-edit-1");
			add_location(i, file$i, 761, 232, 31956);
			attr_dev(button0, "title", button0_title_value = l.edit_base);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light px-1 pt-sm1 pb-sm1 image-dialog");
			add_location(button0, file$i, 761, 16, 31740);
			attr_dev(div1, "class", "btn-group tools mr-1");
			attr_dev(div1, "data-t", "base");
			add_location(div1, file$i, 760, 12, 31674);
			attr_dev(div2, "id", "dndmain");
			attr_dev(div2, "path", "https://s3.amazonaws.com/jigyaasa_content_static/");
			attr_dev(div2, "class", "ui-resizable");
			set_style(div2, "height", "400px");
			set_style(div2, "width", "100%");
			add_location(div2, file$i, 754, 8, 31466);
			add_location(center0, file$i, 753, 4, 31448);
			attr_dev(input1, "type", "hidden");
			attr_dev(input1, "id", "special_module_xml");
			attr_dev(input1, "name", "special_module_xml");
			add_location(input1, file$i, 791, 4, 35015);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "h");
			attr_dev(button1, "id", "update_xml");
			attr_dev(button1, "name", "update_xml");
			add_location(button1, file$i, 792, 4, 35094);
			attr_dev(div3, "class", "smnotes");
			add_location(div3, file$i, 794, 8, 35193);
			add_location(center1, file$i, 793, 4, 35175);
			attr_dev(div4, "class", "parent h");
			attr_dev(div4, "data-parent", "dndmain");
			add_location(div4, file$i, 796, 4, 35241);
			attr_dev(div5, "class", "input_border dragable-container overflow-visible p");
			add_location(div5, file$i, 728, 0, 30476);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, div0);
			append_dev(div0, input0);
			append_dev(div0, t0);
			append_dev(div0, t1);
			append_dev(div0, t2);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div5, t3);
			append_dev(div5, center0);
			append_dev(center0, div2);
			append_dev(div2, div1);
			append_dev(div1, button0);
			append_dev(button0, i);
			append_dev(div2, t4);
			if_block1.m(div2, null);
			append_dev(div2, t5);
			if (if_block2) if_block2.m(div2, null);
			append_dev(div5, t6);
			append_dev(div5, input1);
			append_dev(div5, t7);
			append_dev(div5, button1);
			append_dev(div5, t8);
			append_dev(div5, center1);
			append_dev(center1, div3);
			append_dev(div5, t9);
			append_dev(div5, div4);
			append_dev(div5, t10);
			mount_component(dndmodalbox, div5, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[11], false, false, false),
					listen_dev(input0, "click", /*click_handler*/ ctx[15], false, false, false),
					listen_dev(button0, "click", /*click_handler_2*/ ctx[17], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*step*/ ctx[4] && /*step*/ ctx[4].length) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$2(ctx);
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
					if_block1.m(div2, t5);
				}
			}

			if (/*state*/ ctx[5].data && /*image_loaded*/ ctx[6]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty[0] & /*state, image_loaded*/ 96) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$h(ctx);
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

			const dndmodalbox_changes = {};
			if (dirty[0] & /*DND_AUTH*/ 1) dndmodalbox_changes.isDNDExtended = /*DND_AUTH*/ ctx[0].isDNDExtended;
			if (dirty[0] & /*imgBorder*/ 128) dndmodalbox_changes.imgBorder = /*imgBorder*/ ctx[7];
			dndmodalbox.$set(dndmodalbox_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block2);
			transition_in(dndmodalbox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block2);
			transition_out(dndmodalbox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			if (if_block0) if_block0.d();
			if_block1.d();
			if (if_block2) if_block2.d();
			destroy_component(dndmodalbox);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function objToLower(obj) {
	let newX = {};

	for (let index in obj) {
		newX[index.toLowerCase()] = obj[index];
	}

	return newX;
}

function instance$i($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DragNDrop', slots, []);
	let { xml } = $$props;
	let { getChildXml } = $$props;

	// creating the varibles
	let QXML = "", bgImg = "", imgHeight = "", imgWidth = "";

	let step = [];
	let isOldXml = false;
	let xmlErrDialog = false;
	let container_id = 'dndmain';
	let borderclassname = 'img-bordered';
	let IS_EVENT_CALLED = 1;
	let minimum_resize = 25;
	let module_type = 1;
	let state = {};
	let image_loaded = 0;
	let imgBorder = '';

	// creating store
	let auth_store = writable({
		xml: "",
		bgImage: "",
		imgHeight: "",
		imgWidth: "",
		alt: "",
		borderclass: "",
		updated: false,
		resize: false
	});

	// subscribing to the store
	const unsubscribe = auth_store.subscribe(value => {
		$$invalidate(5, state.store = value, state);
	});

	// responsible for rerendering the module based on the changed xml
	beforeUpdate(async () => {
		if (state.store.xml != xml) {
			loadModule(xml);

			if (isOldXml && !xmlErrDialog) {
				xmlErrDialog = true;

				swal({
					content: AH.parseHtml('<div>' + l.old_xml + '</div>'),
					icon: "warning",
					dangerMode: true
				});
			}
		}
	});

	// call once and bind all the events
	onMount(async () => {
		loadModule(xml);
		bindEvents();
	});

	// function for checking the dnd extended module
	function checkDndExtended() {
		let xml = AH.select("#special_module_xml").value;
		let isDNDExtended = 0;
		let oldxml = ['</step>', '</tab>', '</jscript>', '</menulist>'];

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
		AH.listen('body', 'mouseup', '#dndmain', function () {
			if (!state.store.resize) {
				updateXML();
			}
		});

		AH.listen('body', 'click', '#update_xml', function () {
			updateXML();
		});

		AH.listen('body', 'mouseover', '#dndmain .cursor_move', function (element) {
			AH.select('#' + element.getAttribute('id') + '>.tools').classList.remove('h');
		});

		AH.listen('body', 'mouseout', '#dndmain .cursor_move', function (element) {
			AH.select('#' + element.getAttribute('id') + '>.tools').classList.add('h');
		});

		AH.listen('body', 'click', '#dndmain .cursor_move', function (element) {
			AH.selectAll('#dndmain .elemActive', 'removeClass', 'elemActive');
			element.classList.add('elemActive');
			element.focus();
		});

		AH.listen('body', 'dblclick', '#dndmain .cursor_move', function () {
			if (AH.selectAll('#dndmain > textarea').length > 0) {
				AH.selectAll('.cursor_move > textarea', 'show');
			}
		});

		AH.listen('body', 'hidden.bs.modal', '#authoring-modal', function () {
			$$invalidate(0, DND_AUTH.visible_class = '', DND_AUTH);
			$$invalidate(0, DND_AUTH.error_message = '', DND_AUTH);
		});

		AH.listen('body', 'click', '#authoring-modal .events a', function (element) {
			if (DND_AUTH.visible_class != '') {
				AH.selectAll('.events a', 'removeClass', 'active');
				element.classList.add('active');
				AH.selectAll(DND_AUTH.visible_class + ' .event-input input', 'removeClass', 'show');
				AH.selectAll(DND_AUTH.visible_class + ' .event-input input', 'addClass', 'h');
				AH.selectAll('#' + element.getAttribute('for'), 'removeClass', 'h');
				AH.selectAll('#' + element.getAttribute('for'), 'addClass', 'show');

				// don't why this is written this code
				let val = AH.select('#' + element.getAttribute('for')).value;

				let split_data = val.split(/\(.*?\;/g);

				if (Array.isArray(split_data)) {
					split_data = split_data.map(value => {
						return value.trim();
					}).filter(function (n) {
						return n;
					});

					AH.select('.event-input select').value = '';
				}
			}
		});

		AH.listen('body', 'change', '#authoring-modal .event-input input.show', function (element) {
			if (DND_AUTH.visible_class != '' && element.closest(DND_AUTH.visible_class)) {
				let cur_element = AH.select('[for="' + element.getAttribute('id') + '"]');

				if (cur_element && cur_element.nodeName) {
					AH.find(cur_element, '.icomoon-checkmark', { action: 'remove' });

					if (element.value != '') {
						AH.insert('[for="' + element.getAttribute('id') + '"]', '<i class="icomoon-checkmark float-end"></i>', 'beforeend');
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

			let cur_element = AH.select('[for="' + input.getAttribute('id') + '"]');

			if (cur_element && cur_element.nodeName) {
				AH.find(cur_element, '.icomoon-checkmark', { action: 'remove' });

				if (input.value != '') {
					AH.insert('[for="' + input.getAttribute('id') + '"]', '<i class="icomoon-checkmark float-end"></i>', 'beforeend');
				}
			}
		});

		AH.listen(document, 'click', '.addElement, #updateDnd', function () {
			let borderclass = AH.select('#authoring-modal #base-borderrequired').checked
			? borderclassname
			: '';

			auth_store.update(item => {
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

		AH.listen('body', 'change', '#authoring-modal input', function (current) {
			current.value = DND_AUTH.setValue(current.value);
		});

		AH.listen('body', 'input', '#authoring-modal .validate', function (current) {
			toggleBtn(current);
		});

		AH.listen('body', 'input', '#authoring-modal .number_validate', function (current) {
			let fixed = current.value.replace(/[^0-9]/g, "");

			if (current.value !== fixed) {
				current.value = fixed;
			}

			toggleBtn(current);
		});

		AH.listen('body', 'keyup', '#authoring-modal .dropdown #ddn-value', function (current) {
			let fetched_list_data = DND_AUTH.errorChecking();
			let is_error = fetched_list_data[0] || fetched_list_data[1] == 0;

			$$invalidate(
				0,
				DND_AUTH.error_message = is_error
				? fetched_list_data[0]
					? l.one_option_correct
					: l.one_option_require
				: '',
				DND_AUTH
			);

			if (is_error) {
				AH.select('#authoring-modal .errorBtn', 'removeClass', 'h');
				AH.select('#authoring-modal .addElement', 'addClass', 'h');
			} else {
				AH.select('#authoring-modal .addElement', 'removeClass', 'h');
				AH.select('#authoring-modal .errorBtn', 'addClass', 'h');
			}
		});

		AH.listen('body', 'click', '.errorBtn', function (element) {
			swal({
				text: DND_AUTH.error_message,
				icon: "error",
				dangerMode: true
			});
		});

		AH.listen('body', 'keyup', '#authoring-modal input', function (el, e) {
			e.preventDefault();
			e.stopPropagation();

			if (e.keyCode == 13) {
				document.querySelector('#authoring-modal .addElement').click();
			}
		});

		AH.listen('body', 'click', '.dragable-container #steps input', function (element) {
			let date_parent = element.getAttribute('id') == 'baseAuth'
			? "dndmain"
			: '[id="' + element.parentElement.getAttribute('for') + '"]';

			AH.select('.parent').setAttribute('data-parent', date_parent);
			AH.select('.parent').removeAttribute('type');
		});

		AH.listen('body', 'click', '.dragable-container #dndmain .nav > li', function (element) {
			AH.select('.parent').setAttribute('data-parent', '[id="' + element.getAttribute('for') + '"]');
			AH.select('.parent').setAttribute('type', 'tab');
		});

		AH.listen('body', 'click', '#dndmain .nav textarea', function (element) {
			AH.setCss(element, { width: element.value.length * 8 + 'px' });
		});

		AH.listen('body', 'click', '#upload_media, #drag_upload_media, #tab_upload_media, #step_upload_media', function () {
			AH.getBS('#modal-media-upload', 'Modal').show();
		});
	}

	function toggleBtn(current) {
		if (current.value.trim() != '') {
			AH.select('#authoring-modal .addElement', 'removeClass', 'h');
			AH.select('#authoring-modal .errorBtn', 'addClass', 'h');
		} else {
			$$invalidate(0, DND_AUTH.error_message = l.required_field, DND_AUTH);
			AH.select('#authoring-modal .errorBtn', 'removeClass', 'h');
			AH.select('#authoring-modal .addElement', 'addClass', 'h');
		}
	}

	// function responsible for loading the module whenever the xml changes
	function loadModule(loadXml) {
		// convert xml 
		let newXml = XMLToJSON(loadXml);

		if (!newXml) {
			console.warn({
				Error: "XMl fromat not correct",
				xml: loadXml
			});

			// return if xml format is not correct or there is any issue
			return false;
		}

		auth_store.update(item => {
			item.xml = loadXml;
			return item;
		});

		QXML = newXml;

		if (state.store.xml != '') {
			let node = AH.parseHtml(state.store.xml);

			if (node.getAttribute('alt')) {
				let alt_attr = node.getAttribute('alt').replace("<", "&lt;").replace(">", "&gt;");
				node.setAttribute("alt", alt_attr.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
			}
		}

		AH.select('#special_module_xml').value = loadXml;
		initialize();
		checkImageStatus();
		parseXMLAuthoring(newXml);
		$$invalidate(5, state.data = loadNestedModule(QXML.smxml), state);
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
			$$invalidate(0, DND_AUTH.isDNDExtended = checkDndExtended(), DND_AUTH);

			DND_AUTH.contextMenuOption();
			enableDragResize();
			IS_EVENT_CALLED = 0;
		}

		if (AH.selectAll('#dndmain .nav textarea').length > 0) {
			let nav_textarea = AH.selectAll('#dndmain .nav textarea');

			for (let index = 0; index < nav_textarea.length; index++) {
				AH.setCss(nav_textarea[index], {
					width: nav_textarea[index].value.length * 8 + 'px'
				});
			}
		}

		if (AH.selectAll('[id^="ID"]').length > 0) {
			let hotspot_ids = AH.selectAll('[id^="ID"]');

			for (let index = 0; index < hotspot_ids.length; index++) {
				if (hotspot_ids[index].classList.contains('hotspot_auth')) {
					let hostspot_children = hotspot_ids[index].children;

					for (let sub_index = 0; sub_index < hostspot_children.length; sub_index++) {
						if (hostspot_children[sub_index].classList.contains('hs_item') && AH.find(hostspot_children[sub_index], '.tools', 'all').length == 0) {
							AH.insert(hostspot_children[sub_index], '<div class="btn-group tools" data-t="hotspot_click"><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', this, \'' + hostspot_children[sub_index].getAttribute('id') + '\');" class="btn btn-light px-1 pt-sm1 pb-sm1"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot_click\', \'' + hostspot_children[sub_index].getAttribute('id') + '\');" class="btn btn-light px-1 pt-sm1 pb-sm1"><i class="icomoon-new-24px-delete-1"></i></a></div>', 'beforeend');
						}
					}
				}
			}
		}

		if (document.querySelectorAll('#dndmain, #dndmain .drag-resize, #dndmain .only-dragable').length > 0) {
			if (AH.selectAll('#dndmain img:not([draggable])').length > 0) {
				AH.selectAll('#dndmain img:not([draggable])').forEach(element => {
					element.setAttribute('draggable', false);
				});
			}

			[].forEach.call(document.querySelectorAll('#dndmain, #dndmain .drag-resize, #dndmain .only-dragable'), el => {
				if (el.querySelector('.resizer') == null || el.id == 'dndmain' && document.querySelector('#dndmain > .resizer') == null) {
					let resizer = document.createElement('div');
					resizer.className = 'resizer icomoon-resize';
					el.appendChild(resizer);
				}
			});
		}

		try {
			if (AH.selectAll('#dndmain .nav .active').length > 0) {
				let steps = AH.selectAll('#dndmain .nav .active');
				let visible_node = [];

				steps.forEach(element => {
					if (element.getBoundingClientRect().top > 0) {
						visible_node.push(element);
					}
				});

				if (visible_node.length > 0) {
					visible_node.forEach(element => {
						AH.select('.parent').setAttribute('data-parent', '[id="' + element.getAttribute('for') + '"]');
						AH.select('.parent').setAttribute('type', 'tab');
					});
				}
			} else if (AH.selectAll('#dndmain [type="step"]').length > 0) {
				let steps = AH.selectAll('#dndmain [type="step"]');
				let visible_node = [];

				steps.forEach(element => {
					if (element.getBoundingClientRect().top > 0) {
						visible_node.push(element);
					}
				});

				if (visible_node.length > 0) {
					visible_node.forEach(element => {
						AH.select('.parent').setAttribute('data-parent', '[id="' + element.getAttribute('id') + '"]');
					});
				}
			}
		} catch(error) {
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
		};

		draggable.onDragStop = function (event, position, ui) {
			if (AH.find(ui, '.tools')) {
				let type = ui.classList.contains('hs_item')
				? "hotspot_click"
				: AH.select('#' + ui.id + '> .tools').getAttribute('data-t');

				DND_AUTH.updateElem(type, ui, ui.getAttribute('id'), ui);
				updateXML();

				if (AH.selectAll('#dndmain .tab-content').length) {
					AH.selectAll('#dndmain .tab-content').forEach(function (element) {
						element.id = '';
					});
				}
			}
		};

		let resizable = new Resizable('#dndmain', '#dndmain, #dndmain .drag-resize, #dndmain .only-dragable');

		resizable.onStart = function () {
			auth_store.update(item => {
				item.resize = true;
				return item;
			});
		};

		resizable.setLimit = function (x, y) {
			if (x <= minimum_resize) {
				x = minimum_resize;
			}

			if (y <= minimum_resize) {
				y = minimum_resize;
			}

			return { x, y };
		};

		resizable.onStop = function (e, ui) {
			let pr = AH.select('.parent').getAttribute("data-parent");

			if (ui.id == "dndmain") {
				AH.select('.parent').setAttribute("data-parent", "dndmain");
			}

			let type = ui.classList.contains('hs_item')
			? "hotspot_click"
			: AH.findChild(ui, '.tools').getAttribute('data-t');

			DND_AUTH.updateElem(type, ui, ui.getAttribute('id'), ui);
			AH.select('.parent').setAttribute("data-parent", pr);
			updateXML();

			let update_timer = setTimeout(
				function () {
					auth_store.update(item => {
						item.resize = false;
						return item;
					});

					clearTimeout(update_timer);
				},
				100
			);
		};
	}

	// function for parsing the xml 
	function parseXMLAuthoring(MYXML) {
		// taking the data from the xml and setting state accordingly
		$$invalidate(1, bgImg = MYXML.smxml._bgimg);

		module_type = MYXML.smxml._type || 1;
		$$invalidate(2, imgHeight = MYXML.smxml._height);
		$$invalidate(3, imgWidth = MYXML.smxml._width);
		$$invalidate(7, imgBorder = MYXML.smxml._borderrequired == undefined ? 0 : 1);

		auth_store.update(item => {
			item.bgImage = bgImg;
			item.imgHeight = imgHeight;
			item.imgWidth = imgWidth;
			item.alt = MYXML.smxml._alt;

			if (MYXML.smxml._borderrequired == 1) {
				item.borderclass = borderclassname;
			}

			return item;
		});

		$$invalidate(4, step = MYXML.smxml.step);

		if (Array.isArray(step) == false && step) {
			$$invalidate(4, step = []);
			$$invalidate(4, step[0] = MYXML.smxml.step, step);
		}
	}

	// function returns the nested module data
	function loadNestedModule(xml) {
		let customDrag = [], customDrop = [];

		if (xml) {
			if (xml.div) {
				isOldXml = true;

				xml.div.map(function (data, index) {
					data = objToLower(data);

					if (data._anskey == "" || data._anskey == undefined) {
						customDrag.push(data);
					} else {
						let id = data._id.split("ID");
						let key = data._key.split("key");

						if (id[1] == key[1]) {
							data._anskey = "ID" + id[1];
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
					let originalHeight = (module_type == 1
					? DND_AUTH.getImageData('h', cur_element)
					: cur_element.naturalHeight) + (state.store.borderclass ? 8 : 0);

					let originalWidth = (module_type == 1
					? DND_AUTH.getImageData('w', cur_element)
					: cur_element.naturalWidth) + (state.store.borderclass ? 8 : 0);

					if (Number(originalWidth) != 0 || Number(originalHeight) != 0 || typeof from_myproject != "undefined" && from_myproject == 1) {
						AH.setCss("#" + container_id, {
							height: (imgHeight && Number(imgHeight) >= Number(originalHeight)
							? imgHeight
							: originalHeight) + "px",
							width: (imgWidth && Number(imgWidth) >= Number(originalWidth)
							? imgWidth
							: originalWidth) + "px"
						});
					}
				}
			});
		}

		if (is_image_load == 1) {
			$$invalidate(6, image_loaded = 1);
		}
	}

	// function for changing the error
	function checkError() {
		auth_store.update(item => {
			item.xml = loadXml;
			return item;
		});
	}

	// function for changing the step
	function changeStep(id) {
		let timer = setTimeout(
			function () {
				DND_AUTH.setStepAuth(id);
				clearTimeout(timer);
			},
			100
		);
	}

	// function responsible for updating the xml using getchildxml
	function updateXML(isDeepUpdate) {
		let q_xml = document.querySelector('#special_module_xml').value;

		// convert single and double quote
		q_xml = q_xml.replace(/\’|\′/g, "&apos;").replace(/\″|\“|\”/g, "&quote;");

		if (state.store.xml != AH.select('#special_module_xml').value) {
			// update the xml
			isDeepUpdate
			? getChildXml(q_xml, "deepUpdate")
			: getChildXml(q_xml);
		}

		auth_store.update(item => {
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
			let xmlDom = AH.parseHtml(AH.select('#special_module_xml').value);
			let insert = AH.find(xmlDom, '[id="' + key + '"]');

			if (typeof isDelete !== "undefined" && isDelete && key != undefined) {
				DND_AUTH.deleteElem(AH.findChild(elementActive, '.tools').getAttribute('data-t'), key);
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

				let attributes = DND_AUTH.storage.store('#' + key, 'attributes');

				if (Array.isArray(attributes)) {
					for (let index = 0; index < attributes.length; index++) {
						switch (attributes[index].name) {
							case "width":
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

				DND_AUTH.storage.store('#' + key, 'attributes', attributes);

				AH.select('#special_module_xml').value = xmlDom.xml
				? xmlDom.xml
				: new XMLSerializer().serializeToString(xmlDom);

				updateXML();
			}
		}
	}

	// calls in case of keydown event on the document and set the position of elements accoridngly
	function handleKeyDown(event) {
		if (AH.select('#dndmain').offsetHeight != 0 && event.keyCode) {
			if (event.ctrlKey && event.shiftKey) {
				event.preventDefault();

				switch (event.keyCode.toString()) {
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
				switch (event.keyCode.toString()) {
					case "37":
						event.preventDefault();
						setPS(0, 0, 0, -1);
						break;
					case "38":
						event.preventDefault();
						setPS(0, 0, -1, 0);
						break;
					case "39":
						event.preventDefault();
						setPS(0, 0, 0, 1);
						break;
					case "40":
						event.preventDefault();
						setPS(0, 0, 1, 0);
						break;
				} // taken from else part
				// taken from else part
				// taken from else part
				// taken from else part
			} else {
				switch (event.keyCode.toString()) {
					case "27":
						AH.removeClass('.dragable-container .ui-draggable').removeClass('elemActive');
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
		$$invalidate(6, image_loaded = 1);
	}

	const writable_props = ['xml', 'getChildXml'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<DragNDrop> was created with unknown prop '${key}'`);
	});

	const click_handler = () => DND_AUTH.setStepAuth('baseAuth');
	const click_handler_1 = data => DND_AUTH.setStepAuth(data._id);

	const click_handler_2 = event => {
		DND_AUTH.elemModal('base', event.currentTarget, 'dndmain', state.store.bgImage, state.store);
	};

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(13, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(14, getChildXml = $$props.getChildXml);
	};

	$$self.$capture_state = () => ({
		onMount,
		beforeUpdate,
		XMLToJSON,
		AH,
		writable,
		DND_AUTH,
		Drag,
		Drop,
		Radio,
		Select,
		Textbox,
		Multilinebox,
		Checkbox,
		Button,
		Tabhead,
		Img,
		Label,
		Hotspot,
		Menulist,
		Step,
		Tab,
		DndModalBox,
		swal,
		Draggable,
		Resizable,
		l,
		xml,
		getChildXml,
		QXML,
		bgImg,
		imgHeight,
		imgWidth,
		step,
		isOldXml,
		xmlErrDialog,
		container_id,
		borderclassname,
		IS_EVENT_CALLED,
		minimum_resize,
		module_type,
		state,
		image_loaded,
		imgBorder,
		auth_store,
		unsubscribe,
		checkDndExtended,
		bindEvents,
		toggleBtn,
		loadModule,
		initialize,
		enableDragResize,
		parseXMLAuthoring,
		objToLower,
		loadNestedModule,
		checkImageStatus,
		checkError,
		changeStep,
		updateXML,
		setPS,
		handleKeyDown,
		changeLoadState
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(13, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(14, getChildXml = $$props.getChildXml);
		if ('QXML' in $$props) QXML = $$props.QXML;
		if ('bgImg' in $$props) $$invalidate(1, bgImg = $$props.bgImg);
		if ('imgHeight' in $$props) $$invalidate(2, imgHeight = $$props.imgHeight);
		if ('imgWidth' in $$props) $$invalidate(3, imgWidth = $$props.imgWidth);
		if ('step' in $$props) $$invalidate(4, step = $$props.step);
		if ('isOldXml' in $$props) isOldXml = $$props.isOldXml;
		if ('xmlErrDialog' in $$props) xmlErrDialog = $$props.xmlErrDialog;
		if ('container_id' in $$props) container_id = $$props.container_id;
		if ('borderclassname' in $$props) borderclassname = $$props.borderclassname;
		if ('IS_EVENT_CALLED' in $$props) IS_EVENT_CALLED = $$props.IS_EVENT_CALLED;
		if ('minimum_resize' in $$props) minimum_resize = $$props.minimum_resize;
		if ('module_type' in $$props) module_type = $$props.module_type;
		if ('state' in $$props) $$invalidate(5, state = $$props.state);
		if ('image_loaded' in $$props) $$invalidate(6, image_loaded = $$props.image_loaded);
		if ('imgBorder' in $$props) $$invalidate(7, imgBorder = $$props.imgBorder);
		if ('auth_store' in $$props) auth_store = $$props.auth_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		DND_AUTH,
		bgImg,
		imgHeight,
		imgWidth,
		step,
		state,
		image_loaded,
		imgBorder,
		checkImageStatus,
		checkError,
		changeStep,
		handleKeyDown,
		changeLoadState,
		xml,
		getChildXml,
		click_handler,
		click_handler_1,
		click_handler_2,
		load_handler
	];
}

class DragNDrop extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$i, create_fragment$i, safe_not_equal, { xml: 13, getChildXml: 14 }, null, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DragNDrop",
			options,
			id: create_fragment$i.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[13] === undefined && !('xml' in props)) {
			console_1.warn("<DragNDrop> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[14] === undefined && !('getChildXml' in props)) {
			console_1.warn("<DragNDrop> was created without expected prop 'getChildXml'");
		}
	}

	get xml() {
		throw new Error("<DragNDrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<DragNDrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<DragNDrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<DragNDrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default DragNDrop;
//# sourceMappingURL=DragNDrop-52d2a1b8.js.map
