
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { ae as createCommonjsModule, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, C as validate_each_argument, v as validate_slots, o as onMount, ab as afterUpdate, X as XMLToJSON, y as l, A as AH, a3 as onUserAnsChange, z as empty, n as insert_dev, K as destroy_each, x as detach_dev, e as element, f as space, j as attr_dev, l as set_style, k as add_location, p as append_dev, q as listen_dev, c as create_component, h as text, m as mount_component, F as set_data_dev, t as transition_in, a as transition_out, b as destroy_component, Y as src_url_equal } from './main-f5ccf37f.js';
import { I as ItemHelper } from './ItemHelper-64932280.js';
import { s as styleInject } from './style-inject.es-1c867377.js';

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */

var Sortable = createCommonjsModule(function (module) {
(function sortableModule(factory) {

	{
		module.exports = factory();
	}
})(function sortableFactory() {

	if (typeof window === "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		};
	}

	var dragEl,
		parentEl,
		ghostEl,
		rootEl,
		nextEl,
		lastDownEl,
		lastSwapEl,

		cloneEl,
		multiDragClones = [],
		cloneHidden,

		scrollEl,
		scrollParentEl,
		scrollCustomFn,

		oldIndex,
		newIndex,

		activeGroup,
		putSortable,

		autoScrolls = [],
		scrolling = false,

		awaitingDragStarted = false,
		ignoreNextClick = false,
		sortables = [],

		pointerElemChangedInterval,
		lastPointerElemX,
		lastPointerElemY,

		multiDragElements = [],
		lastMultiDragSelect, // for selection with modifier key down (SHIFT)
		multiDragSortable,

		tapEvt,
		touchEvt,

		moved,

		lastTarget,
		lastDirection,
		pastFirstInvertThresh = false,
		isCircumstantialInvert = false,

		targetMoveDistance,

		forRepaintDummy,
		realDragElRect, // dragEl rect after current animation

		/** @const */
		R_SPACE = /\s+/g,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,
		setTimeout = win.setTimeout,

		$ = win.jQuery || win.Zepto,
		Polymer = win.Polymer,

		captureMode = {
			capture: false,
			passive: false
		},

		IE11OrLess = !!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i),
		Edge = !!navigator.userAgent.match(/Edge/i),
		// FireFox = !!navigator.userAgent.match(/firefox/i),

		CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',

		// This will not pass for IE9, because IE9 DnD only works on anchors
		supportDraggable = ('draggable' in document.createElement('div')),

		supportCssPointerEvents = (function() {
			// false when <= IE11
			if (IE11OrLess) {
				return false;
			}
			var el = document.createElement('x');
			el.style.cssText = 'pointer-events:auto';
			return el.style.pointerEvents === 'auto';
		})(),

		_silent = false,

		abs = Math.abs,
		min = Math.min,

		savedInputChecked = [],

		_detectDirection = function(el, options) {
			var elCSS = _css(el),
				elWidth = parseInt(elCSS.width),
				child1 = _getChild(el, 0, options),
				child2 = _getChild(el, 1, options),
				firstChildCSS = child1 && _css(child1),
				secondChildCSS = child2 && _css(child2),
				firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + _getRect(child1).width,
				secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + _getRect(child2).width;
			if (elCSS.display === 'flex') {
				return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse'
				? 'vertical' : 'horizontal';
			}
			if (child1 && firstChildCSS.float !== 'none') {
				var touchingSideChild2 = firstChildCSS.float === 'left' ? 'left' : 'right';

				return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ?
					'vertical' : 'horizontal';
			}
			return (child1 &&
				(
					firstChildCSS.display === 'block' ||
					firstChildCSS.display === 'flex' ||
					firstChildCSS.display === 'table' ||
					firstChildCSS.display === 'grid' ||
					firstChildWidth >= elWidth &&
					elCSS[CSSFloatProperty] === 'none' ||
					child2 &&
					elCSS[CSSFloatProperty] === 'none' &&
					firstChildWidth + secondChildWidth > elWidth
				) ?
				'vertical' : 'horizontal'
			);
		},

		/**
		 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
		 * @param  {Number} x      X position
		 * @param  {Number} y      Y position
		 * @return {HTMLElement}   Element of the first found nearest Sortable
		 */
		_detectNearestEmptySortable = function(x, y) {
			for (var i = 0; i < sortables.length; i++) {
				if (sortables[i].children.length) continue;

				var rect = _getRect(sortables[i]),
					threshold = sortables[i][expando].options.emptyInsertThreshold,
					insideHorizontally = x >= (rect.left - threshold) && x <= (rect.right + threshold),
					insideVertically = y >= (rect.top - threshold) && y <= (rect.bottom + threshold);

				if (insideHorizontally && insideVertically) {
					return sortables[i];
				}
			}
		},

		_getParentAutoScrollElement = function(el, includeSelf) {
			// skip to window
			if (!el || !el.getBoundingClientRect) return _getWindowScrollingElement();

			var elem = el;
			var gotSelf = false;
			do {
				// we don't need to get elem css if it isn't even overflowing in the first place (performance)
				if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
					var elemCSS = _css(elem);
					if (
						elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') ||
						elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')
					) {
						if (!elem || !elem.getBoundingClientRect || elem === document.body) return _getWindowScrollingElement();

						if (gotSelf || includeSelf) return elem;
						gotSelf = true;
					}
				}
			/* jshint boss:true */
			} while (elem = elem.parentNode);

			return _getWindowScrollingElement();
		},

		_getWindowScrollingElement = function() {
			if (IE11OrLess) {
				return document.documentElement;
			} else {
				return document.scrollingElement;
			}
		},

		_getScrollPosition = function(el) {
			return [ el.scrollLeft, el.scrollTop ];
		},

		_scrollBy = function(el, x, y) {
			el.scrollLeft += x;
			el.scrollTop += y;
		},

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl, /**Boolean*/isFallback) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (options.scroll) {
				var _this = rootEl ? rootEl[expando] : window,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winScroller = _getWindowScrollingElement(),

					scrollThisInstance = false;

				// Detect scrollEl
				if (scrollParentEl !== rootEl) {
					_clearAutoScrolls();

					scrollEl = options.scroll;
					scrollCustomFn = options.scrollFn;

					if (scrollEl === true) {
						scrollEl = _getParentAutoScrollElement(rootEl, true);
						scrollParentEl = scrollEl;
					}
				}


				var layersOut = 0;
				var currentParent = scrollEl;
				do {
					var	el = currentParent,
						rect = _getRect(el),

						top = rect.top,
						bottom = rect.bottom,
						left = rect.left,
						right = rect.right,

						width = rect.width,
						height = rect.height,

						scrollWidth,
						scrollHeight,

						css,

						vx,
						vy,

						canScrollX,
						canScrollY,

						scrollPosX,
						scrollPosY;


					scrollWidth = el.scrollWidth;
					scrollHeight = el.scrollHeight;

					css = _css(el);

					scrollPosX = el.scrollLeft;
					scrollPosY = el.scrollTop;

					if (el === winScroller) {
						canScrollX = width < scrollWidth && (css.overflowX === 'auto' || css.overflowX === 'scroll' || css.overflowX === 'visible');
						canScrollY = height < scrollHeight && (css.overflowY === 'auto' || css.overflowY === 'scroll' || css.overflowY === 'visible');
					} else {
						canScrollX = width < scrollWidth && (css.overflowX === 'auto' || css.overflowX === 'scroll');
						canScrollY = height < scrollHeight && (css.overflowY === 'auto' || css.overflowY === 'scroll');
					}

					vx = canScrollX && (abs(right - x) <= sens && (scrollPosX + width) < scrollWidth) - (abs(left - x) <= sens && !!scrollPosX);

					vy = canScrollY && (abs(bottom - y) <= sens && (scrollPosY + height) < scrollHeight) - (abs(top - y) <= sens && !!scrollPosY);


					if (!autoScrolls[layersOut]) {
						for (var i = 0; i <= layersOut; i++) {
							if (!autoScrolls[i]) {
								autoScrolls[i] = {};
							}
						}
					}

					if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
						autoScrolls[layersOut].el = el;
						autoScrolls[layersOut].vx = vx;
						autoScrolls[layersOut].vy = vy;

						clearInterval(autoScrolls[layersOut].pid);

						if (el && (vx != 0 || vy != 0)) {
							scrollThisInstance = true;
							/* jshint loopfunc:true */
							autoScrolls[layersOut].pid = setInterval((function () {
								// emulate drag over during autoscroll (fallback), emulating native DnD behaviour
								if (isFallback && this.layer === 0) {
									Sortable.active._emulateDragOver(true);
								}
								var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
								var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

								if ('function' === typeof(scrollCustomFn)) {
									if (scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt, touchEvt, autoScrolls[this.layer].el) !== 'continue') {
										return;
									}
								}

								_scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
							}).bind({layer: layersOut}), 24);
						}
					}
					layersOut++;
				} while (options.bubbleScroll && currentParent !== winScroller && (currentParent = _getParentAutoScrollElement(currentParent, false)));
				scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
			}
		}, 30),

		_clearAutoScrolls = function () {
			autoScrolls.forEach(function(autoScroll) {
				clearInterval(autoScroll.pid);
			});
			autoScrolls = [];
		},

		_prepareGroup = function (options) {
			function toFn(value, pull) {
				return function(to, from, dragEl, evt) {
					var sameGroup = to.options.group.name &&
									from.options.group.name &&
									to.options.group.name === from.options.group.name;

					if (value == null && (pull || sameGroup)) {
						// Default pull value
						// Default pull and put value if same group
						return true;
					} else if (value == null || value === false) {
						return false;
					} else if (pull && value === 'clone') {
						return value;
					} else if (typeof value === 'function') {
						return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
					} else {
						var otherGroup = (pull ? to : from).options.group.name;

						return (value === true ||
						(typeof value === 'string' && value === otherGroup) ||
						(value.join && value.indexOf(otherGroup) > -1));
					}
				};
			}

			var group = {};
			var originalGroup = options.group;

			if (!originalGroup || typeof originalGroup != 'object') {
				originalGroup = {name: originalGroup};
			}

			group.name = originalGroup.name;
			group.checkPull = toFn(originalGroup.pull, true);
			group.checkPut = toFn(originalGroup.put);
			group.revertClone = originalGroup.revertClone;

			options.group = group;
		},

		_isTrueParentSortable = function(el, target) {
			var trueParent = target;
			while (!trueParent[expando]) {
				trueParent = trueParent.parentNode;
			}

			return el === trueParent;
		},

		_artificalBubble = function(sortable, originalEvt, method) {
			// Artificial IE bubbling
			var nextParent = sortable.parentNode;
			while (nextParent && !nextParent[expando]) {
				nextParent = nextParent.parentNode;
			}

			if (nextParent) {
				nextParent[expando][method](_extend(originalEvt, {
					artificialBubble: true
				}));
			}
		},

		_hideGhostForTarget = function() {
			if (!supportCssPointerEvents && ghostEl) {
				_css(ghostEl, 'display', 'none');
			}
		},

		_unhideGhostForTarget = function() {
			if (!supportCssPointerEvents && ghostEl) {
				_css(ghostEl, 'display', '');
			}
		};


	// #1184 fix - Prevent click event on fallback if dragged but item not changed position
	document.addEventListener('click', function(evt) {
		if (ignoreNextClick) {
			evt.preventDefault();
			evt.stopPropagation && evt.stopPropagation();
			evt.stopImmediatePropagation && evt.stopImmediatePropagation();
			ignoreNextClick = false;
			return false;
		}
	}, true);

	var nearestEmptyInsertDetectEvent = function(evt) {
		evt = evt.touches ? evt.touches[0] : evt;
		if (dragEl) {
			var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

			if (nearest) {
				nearest[expando]._onDragOver({
					clientX: evt.clientX,
					clientY: evt.clientY,
					target: nearest,
					rootEl: nearest
				});
			}
		}
	};
	// We do not want this to be triggered if completed (bubbling canceled), so only define it here
	_on(document, 'dragover', nearestEmptyInsertDetectEvent);
	_on(document, 'mousemove', nearestEmptyInsertDetectEvent);
	_on(document, 'touchmove', nearestEmptyInsertDetectEvent);


	var _checkOutsideTargetEl = function(evt) {
		if (dragEl) {
			dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
		}
	};


	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);


		// Export instance
		el[expando] = this;

		// Default options
		var defaults = {
			group: null,
			sort: true,
			disabled: false,
			store: null,
			swap: false,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			bubbleScroll: true,
			draggable: /[uo]l/i.test(el.nodeName) ? '>li' : '>*',
			swapThreshold: 1, // percentage; 0 <= x <= 1
			invertSwap: false, // invert always
			invertedSwapThreshold: null, // will be set to same as swapThreshold if default
			removeCloneOnHide: true,
			direction: function() {
				return _detectDirection(el, this.options);
			},
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			swapClass: "sortable-swap-highlight",
			selectedClass: 'sortable-selected', // for multi-drag
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 0,
			easing: null,
			setData: function (dataTransfer, dragEl) {
				var data = '';
				if (multiDragElements.length) {
					for (var i = 0; i < multiDragElements.length; i++) {
						data += (!i ? '' : ', ') + multiDragElements[i].textContent;
					}
				} else {
					data = dragEl.textContent;
				}
				dataTransfer.setData('Text', data);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			touchStartThreshold: parseInt(window.devicePixelRatio, 10) || 1,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: {x: 0, y: 0},
			supportPointer: Sortable.supportPointer !== false && (
				('PointerEvent' in window) ||
				window.navigator && ('msPointerEnabled' in window.navigator) // microsoft
			),
			emptyInsertThreshold: 5,
			multiDrag: false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		if (options.supportPointer) {
			_on(el, 'pointerdown', this._onTapStart);

			_on(document, 'pointerup', this._deselectMultiDrag);
		} else {
			_on(document, 'mouseup', this._deselectMultiDrag);
			_on(document, 'touchend', this._deselectMultiDrag);

			_on(el, 'mousedown', this._onTapStart);
			_on(el, 'touchstart', this._onTapStart);
		}

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		sortables.push(this.el);

		// Restore sorting
		options.store && options.store.get && this.sort(options.store.get(this) || []);
	}

	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,

		_isOutsideThisEl: function(target) {
			if (!this.el.contains(target) && target !== this.el) {
				lastTarget = null;
			}
		},

		_getDirection: function(evt, target) {
			return (typeof this.options.direction === 'function') ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
		},

		_onTapStart: function (/** Event|TouchEvent */evt) {
			if (!evt.cancelable) return;
			var _this = this,
				el = this.el,
				options = this.options,
				preventOnFilter = options.preventOnFilter,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = evt.target.shadowRoot && ((evt.path && evt.path[0]) || (evt.composedPath && evt.composedPath()[0])) || target,
				filter = options.filter,
				startIndex;

			_saveInputCheckedState(el);

			// IE: Calls events in capture mode if event element is nested. This ensures only correct element's _onTapStart goes through.
			// This process is also done in _onDragOver
			if (IE11OrLess && !evt.artificialBubble && !_isTrueParentSortable(el, target)) {
				return;
			}

			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
			if (dragEl) {
				return;
			}

			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
				return; // only left button and enabled
			}

			// cancel dnd if original target is content editable
			if (originalTarget.isContentEditable) {
				return;
			}

			target = _closest(target, options.draggable, el, false);

			if (!target) {
				if (IE11OrLess) {
					_artificalBubble(el, evt, '_onTapStart');
				}
				return;
			}

			if (lastDownEl === target) {
				// Ignoring duplicate `down`
				return;
			}

			// Get the index of the dragged element within its parent
			startIndex = _index(target);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, originalTarget, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, el, startIndex);
					preventOnFilter && evt.cancelable && evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el, false);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, el, startIndex);
						return true;
					}
				});

				if (filter) {
					preventOnFilter && evt.cancelable && evt.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !_closest(originalTarget, options.handle, el, false)) {
				return;
			}

			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target, startIndex);
		},


		_handleAutoScroll: function(evt, fallback) {
			if (!dragEl || !this.options.scroll) return;
			var x = evt.clientX,
				y = evt.clientY,

				elem = document.elementFromPoint(x, y),
				_this = this;

			// IE does not seem to have native autoscroll,
			// Edge's autoscroll seems too conditional,
			// Firefox and Chrome are good
			if (fallback || Edge || IE11OrLess) {
				_autoScroll(evt, _this.options, elem, fallback);

				// Listener for pointer element change
				var ogElemScroller = _getParentAutoScrollElement(elem, true);
				if (
					scrolling &&
					(
						!pointerElemChangedInterval ||
						x !== lastPointerElemX ||
						y !== lastPointerElemY
					)
				) {

					pointerElemChangedInterval && clearInterval(pointerElemChangedInterval);
					// Detect for pointer elem change, emulating native DnD behaviour
					pointerElemChangedInterval = setInterval(function() {
						if (!dragEl) return;
						// could also check if scroll direction on newElem changes due to parent autoscrolling
						var newElem = _getParentAutoScrollElement(document.elementFromPoint(x, y), true);
						if (newElem !== ogElemScroller) {
							ogElemScroller = newElem;
							_clearAutoScrolls();
							_autoScroll(evt, _this.options, ogElemScroller, fallback);
						}
					}, 10);
					lastPointerElemX = x;
					lastPointerElemY = y;
				}

			} else {
				// if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
				if (!_this.options.bubbleScroll || _getParentAutoScrollElement(elem, true) === _getWindowScrollingElement()) {
					_clearAutoScrolls();
					return;
				}
				_autoScroll(evt, _this.options, _getParentAutoScrollElement(elem, false), false);
			}
		},

		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
			var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

			if (target && !dragEl && (target.parentNode === el)) {
				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;

				tapEvt = {
					target: dragEl,
					clientX: (touch || evt).clientX,
					clientY: (touch || evt).clientY
				};

				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;

				dragEl.style['will-change'] = 'all';
				// undo animation if needed
				dragEl.style.transition = '';
				dragEl.style.transform = '';

				dragStartFn = function () {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = _this.nativeDraggable;

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(evt, touch);

					// Drag start event
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, rootEl, oldIndex);

					// Chosen item
					_toggleClass(dragEl, options.chosenClass, true);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				if (options.supportPointer) {
					_on(ownerDocument, 'pointerup', _this._onDrop);
				} else {
					_on(ownerDocument, 'mouseup', _this._onDrop);
					_on(ownerDocument, 'touchend', _this._onDrop);
					_on(ownerDocument, 'touchcancel', _this._onDrop);
				}

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
					_on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
					options.supportPointer && _on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}
			}
		},

		_delayedDragTouchMoveHandler: function (/** TouchEvent|PointerEvent **/e) {
			var touch = e.touches ? e.touches[0] : e;
			if (min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY))
					>= this.options.touchStartThreshold
			) {
				this._disableDelayedDrag();
			}
		},

		_disableDelayedDrag: function () {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
			_off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
			_off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
		},

		_triggerDragStart: function (/** Event */evt, /** Touch */touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);

			if (!this.nativeDraggable || touch) {
				if (this.options.supportPointer) {
					_on(document, 'pointermove', this._onTouchMove);
				} else if (touch) {
					_on(document, 'touchmove', this._onTouchMove);
				} else {
					_on(document, 'mousemove', this._onTouchMove);
				}
			} else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					// Timeout neccessary for IE9
					_nextTick(function () {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {
			}
		},

		_dragStarted: function (fallback) {
			awaitingDragStarted = false;
			if (rootEl && dragEl) {
				if (this.nativeDraggable) {
					_on(document, 'dragover', this._handleAutoScroll);
					_on(document, 'dragover', _checkOutsideTargetEl);
				}
				var options = this.options;

				// Apply effect
				!fallback && _toggleClass(dragEl, options.dragClass, false);
				_toggleClass(dragEl, options.ghostClass, true);

				// In case dragging an animated element
				_css(dragEl, 'transform', '');

				Sortable.active = this;

				fallback && this._appendGhost();

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},

		_emulateDragOver: function (bypassLastTouchCheck) {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY && !bypassLastTouchCheck) {
					return;
				}
				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				_hideGhostForTarget();

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
				var parent = target;

				while (target && target.shadowRoot) {
					target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
					parent = target;
				}

				dragEl.parentNode[expando]._isOutsideThisEl(target);

				if (parent) {
					do {
						if (parent[expando]) {
							var inserted;

							inserted = parent[expando]._onDragOver({
								clientX: touchEvt.clientX,
								clientY: touchEvt.clientY,
								target: target,
								rootEl: parent
							});

							if (inserted && !this.options.dragoverBubble) {
								break;
							}
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				_unhideGhostForTarget();
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				var	options = this.options,
					fallbackTolerance = options.fallbackTolerance,
					fallbackOffset = options.fallbackOffset,
					touch = evt.touches ? evt.touches[0] : evt,
					matrix = ghostEl && _matrix(ghostEl),
					scaleX = ghostEl && matrix && matrix.a,
					scaleY = ghostEl && matrix && matrix.d,
					dx = ((touch.clientX - tapEvt.clientX) + fallbackOffset.x) / (scaleX ? scaleX : 1),
					dy = ((touch.clientY - tapEvt.clientY) + fallbackOffset.y) / (scaleY ? scaleY : 1),
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';


				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active && !awaitingDragStarted) {
					if (fallbackTolerance &&
						min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
					) {
						return;
					}
					this._onDragStart(evt, true);
				}

				this._handleAutoScroll(touch, true);


				touchEvt = touch;


				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.cancelable && evt.preventDefault();
			}
		},

		_appendGhost: function () {
			if (!ghostEl) {
				var rect = _getRect(dragEl, this.options.fallbackOnBody ? document.body : rootEl, true),
					css = _css(dragEl),
					options = this.options;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);

				_css(ghostEl, 'box-sizing', 'border-box');
				_css(ghostEl, 'margin', 0);
				_css(ghostEl, 'top', rect.top);
				_css(ghostEl, 'left', rect.left);
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);
			}
		},

		_onDragStart: function (/**Event*/evt, /**boolean*/fallback) {
			var _this = this;
			var dataTransfer = evt.dataTransfer;
			var options = _this.options;

			lastSwapEl = dragEl;

			if (!~multiDragElements.indexOf(dragEl) && multiDragSortable) {
				multiDragSortable[expando]._deselectMultiDrag();
			}

			for (var i in multiDragElements) {
				multiDragElements[i].sortableIndex = _index(multiDragElements[i]);
			}

			// Sort multi-drag elements
			multiDragElements = multiDragElements.sort(function(a, b) {
				return a.sortableIndex - b.sortableIndex;
			});



			// Setup clone(s)
			if (multiDragElements.length) {
				for (var i = 0; i < multiDragElements.length; i++) {
					multiDragClones.push(_clone(multiDragElements[i]));

					multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;

					multiDragClones[i].draggable = false;
					multiDragClones[i].style['will-change'] = '';

					_toggleClass(multiDragClones[i], _this.options.selectedClass, false);
					multiDragElements[i] === dragEl && _toggleClass(multiDragClones[i], _this.options.chosenClass, false);
				}
			} else {
				cloneEl = _clone(dragEl);

				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';

				_toggleClass(cloneEl, _this.options.chosenClass, false);
			}

			this._hideClone();


			// #1143: IFrame support workaround
			_this._cloneId = _nextTick(function() {
				// Remove all auxiliary multidrag items from el, if sorting enabled
				// (needs to be next tick, but before clone insert)
				if (_this.options.sort) {
					_removeMultiDragElements();
				}

				if (!_this.options.removeCloneOnHide) {
					if (options.multiDrag) {
						_insertMultiDrag(true);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
				_dispatchEvent(_this, rootEl, 'clone', dragEl);
			});


			!fallback && _toggleClass(dragEl, options.dragClass, true);

			// Set proper drop events
			if (fallback) {
				ignoreNextClick = true;
				_this._loopId = setInterval(_this._emulateDragOver, 50);
			} else {
				// Undo what was set in _prepareDragStart before drag started
				_off(document, 'mouseup', _this._onDrop);
				_off(document, 'touchend', _this._onDrop);
				_off(document, 'touchcancel', _this._onDrop);

				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(_this, dataTransfer, dragEl);
				}

				_on(document, 'drop', _this);

				// #1276 fix:
				_css(dragEl, 'transform', 'translateZ(0)');
			}

			awaitingDragStarted = true;

			_this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback));
			_on(document, 'selectstart', _this);

			moved = true;
		},


		// Returns true - if no further action is needed (either inserted or another condition)
		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target = evt.target,
				dragRect,
				targetRect,
				revert,
				options = this.options,
				group = options.group,
				activeSortable = Sortable.active,
				isOwner = (activeGroup === group),
				canSort = options.sort,
				_this = this;

			if (_silent) return;

			// IE event order fix
			if (IE11OrLess && !evt.rootEl && !evt.artificialBubble && !_isTrueParentSortable(el, target)) {
				return;
			}

			// Return invocation when dragEl is inserted
			function completed() {
				if (isOwner) {
					activeSortable._hideClone();
				} else {
					_removeMultiDragElements();
					activeSortable._showClone(_this);
				}

				if (activeSortable) {
					// Set ghost class to new sortable's ghost class
					_toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
					_toggleClass(dragEl, options.ghostClass, true);
				}

				if (putSortable !== _this && _this !== Sortable.active) {
					putSortable = _this;
				} else if (_this === Sortable.active) {
					putSortable = null;
				}


				// Null lastTarget if it is not inside a previously swapped element
				if ((target === dragEl && !dragEl.animated) || (target === el && !target.animated)) {
					lastTarget = null;
				}
				// no bubbling and not fallback
				if (!options.dragoverBubble && !evt.rootEl && target !== document) {
					_this._handleAutoScroll(evt);
					dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
				}

				!options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();

				return true;
			}

			// Call when dragEl has been inserted
			function changed() {
				_dispatchEvent(_this, rootEl, 'change', target, el, rootEl, oldIndex, _index(lastSwapEl || dragEl), evt);
			}


			if (evt.preventDefault !== void 0) {
				evt.cancelable && evt.preventDefault();
			}


			target = _closest(target, options.draggable, el, true);

			// target is dragEl or target is animated
			if (!!_closest(evt.target, null, dragEl, true) || target.animated) {
				return true; // not completed() because dragEl not inserted
			}

			if (target !== dragEl) {
				ignoreNextClick = false;
			}

			if (activeSortable && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
					: (
						putSortable === this ||
						(
							(this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
							group.checkPut(this, activeSortable, dragEl, evt)
						)
					)
				)
			) {
				var axis = this._getDirection(evt, target);

				dragRect = _getRect(dragEl);

				if (options.swap) {
					if (target && target !== el) {
						var prevSwapEl = lastSwapEl;
						if (_onMove(rootEl, el, dragEl, dragRect, target, _getRect(target), evt, false) !== false) {
							_toggleClass(target, options.swapClass, true);
							lastSwapEl = target;
						} else {
							lastSwapEl = null;
						}

						if (prevSwapEl && prevSwapEl !== lastSwapEl) {
							_toggleClass(prevSwapEl, options.swapClass, false);
						}
					}
					changed();

					return completed();
				}

				if (revert) {
					parentEl = rootEl; // actualization
					this._hideClone();

					if (multiDragElements.length) {
						_insertMultiDrag();
					} else {
						if (nextEl) {
							rootEl.insertBefore(dragEl, nextEl);
						} else {
							rootEl.appendChild(dragEl);
						}
					}

					return completed();
				}

				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					_ghostIsLast(evt, axis, el) && !dragEl.animated
				) {
					//assign target only if condition is true
					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
						target = _lastChild(el);
					}

					if (target) {
						targetRect = _getRect(target);
					}

					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
						el.appendChild(dragEl);
						parentEl = el; // actualization
						realDragElRect = null;

						changed();
						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
						return completed();
					}
				}
				else if (target && target !== dragEl && target.parentNode === el) {
					var direction = 0,
						targetBeforeFirstSwap,
						differentLevel = dragEl.parentNode !== el,
						side1 = axis === 'vertical' ? 'top' : 'left',
						scrolledPastTop = _isScrolledPast(target, side1) || _isScrolledPast(dragEl, side1),
						scrollBefore = scrolledPastTop && (scrolledPastTop ? _getScrollPosition(scrolledPastTop)[1] : void 0);



					if (lastTarget !== target) {
						targetBeforeFirstSwap = _getRect(target)[side1];
						pastFirstInvertThresh = false;
						isCircumstantialInvert = options.invertSwap || differentLevel;
					}

					direction = _getSwapDirection(
						evt, target, axis,
						options.swapThreshold,
						options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold,
						isCircumstantialInvert,
						lastTarget === target
					);

					if (direction === 0) return completed();

					realDragElRect = null;
					lastTarget = target;

					lastDirection = direction;

					targetRect = _getRect(target);

					var nextSibling = target.nextElementSibling,
						after = false;

					after = direction === 1;

					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}

						_silent = true;
						setTimeout(_unsilent, 30);

						if (after && !nextSibling) {
							el.appendChild(dragEl);
						} else {
							target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
						}

						// Undo chrome's scroll adjustment (has no effect on other browsers)
						if (scrolledPastTop) {
							_scrollBy(scrolledPastTop, 0, scrollBefore - _getScrollPosition(scrolledPastTop)[1]);
						}

						parentEl = dragEl.parentNode; // actualization

						// must be done before animation
						if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
							targetMoveDistance = abs(targetBeforeFirstSwap - _getRect(target)[side1]);
						}
						changed();

						!differentLevel && this._animate(targetRect, target);
						this._animate(dragRect, dragEl);

						return completed();
					}
				}

				if (el.contains(dragEl)) {
					return completed();
				}
			}

			if (IE11OrLess && !evt.rootEl) {
				_artificalBubble(el, evt, '_onDragOver');
			}

			return false;
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = _getRect(target);

				if (target === dragEl) {
					realDragElRect = currentRect;
				}

				if (prevRect.nodeType === 1) {
					prevRect = _getRect(prevRect);
				}

				// Check if actually moving position
				if ((prevRect.left + prevRect.width / 2) !== (currentRect.left + currentRect.width / 2)
					|| (prevRect.top + prevRect.height / 2) !== (currentRect.top + currentRect.height / 2)
				) {
					var matrix = _matrix(this.el),
						scaleX = matrix && matrix.a,
						scaleY = matrix && matrix.d;

					_css(target, 'transition', 'none');
					_css(target, 'transform', 'translate3d('
						+ (prevRect.left - currentRect.left) / (scaleX ? scaleX : 1) + 'px,'
						+ (prevRect.top - currentRect.top) / (scaleY ? scaleY : 1) + 'px,0)'
					);

					forRepaintDummy = target.offsetWidth; // repaint
					_css(target, 'transition', 'transform ' + ms + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
					_css(target, 'transform', 'translate3d(0,0,0)');
				}

				(typeof target.animated === 'number') && clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(document, 'selectstart', this);
		},

		_deselectMultiDrag: function(evt) {
			// Only deselect if selection is in this sortable
			if (multiDragSortable !== this.el) return;

			// Only deselect if target is not item in this sortable
			if (evt && _closest(evt.target, this.options.draggable, this.el, false)) return;

			for (var i = 0; i < multiDragElements.length; i++) {
				_toggleClass(multiDragElements[i], this.options.selectedClass, false);
			}
			multiDragElements = [];
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options,
				i, n;

			awaitingDragStarted = false;
			scrolling = false;
			isCircumstantialInvert = false;
			pastFirstInvertThresh = false;

			clearInterval(this._loopId);

			clearInterval(pointerElemChangedInterval);
			_clearAutoScrolls();
			_cancelThrottle();

			clearTimeout(this._dragStartTimer);

			_cancelNextTick(this._cloneId);
			_cancelNextTick(this._dragStartId);

			// Unbind events
			_off(document, 'mousemove', this._onTouchMove);


			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
				_off(document, 'dragover', this._handleAutoScroll);
			}

			this._offUpEvents();

			lastSwapEl && _toggleClass(lastSwapEl, options.swapClass, false);
			if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
				if (dragEl !== lastSwapEl) {
					var dragRect = _getRect(dragEl),
						lastRect = _getRect(lastSwapEl);

					_swapNodes(dragEl, lastSwapEl);

					this._animate(dragRect, dragEl);
					this._animate(lastRect, lastSwapEl);
				}
			}

			// Multi-drag selection
			if (!moved && options.multiDrag) {
				_toggleClass(dragEl, options.selectedClass, !~multiDragElements.indexOf(dragEl));

				if (!~multiDragElements.indexOf(dragEl)) {
					multiDragElements.push(dragEl);
					dragEl.sortableIndex = _index(dragEl);

					// Modifier activated, select from last to dragEl
					if (evt.shiftKey && lastMultiDragSelect && this.el.contains(lastMultiDragSelect)) {
						var lastIndex = _index(lastMultiDragSelect),
							currentIndex = _index(dragEl);

						if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
							var children = parentEl.children;


							if (currentIndex > lastIndex) {
								i = lastIndex + 1;
								n = currentIndex;
							} else {
								i = currentIndex + 1;
								n = lastIndex;
							}

							for (; i < n; i++) {
								if (~multiDragElements.indexOf(children[i])) continue;
								children[i].sortableIndex = _index(children[i]);
								_toggleClass(children[i], options.selectedClass, true);
								multiDragElements.push(children[i]);
							}
						}
					}

					lastMultiDragSelect = dragEl;
					multiDragSortable = parentEl;
				} else {
					multiDragElements.splice(multiDragElements.indexOf(dragEl), 1);
					lastMultiDragSelect = null;
				}
			}

			// Multi-drag drop
			if (moved && options.multiDrag && multiDragElements.length) {
				// Do not "unfold" after around dragEl if sorting disabled (either reverted or never left it's sort:false root)
				if (parentEl[expando].options.sort) {
					var firstMultiDragElementIndex = _index(dragEl),
						firstMultiDragRect = _getRect(dragEl);

					// insert first multi drag at dragEl's position
					parentEl.insertBefore(multiDragElements[0], dragEl);
					multiDragElements[0] !== dragEl && parentEl.removeChild(dragEl);


					for (i = 1; i < multiDragElements.length; i++) {
						if (multiDragElements[i - 1].nextSibling) {
							parentEl.insertBefore(multiDragElements[i], multiDragElements[i - 1].nextSibling);
						} else {
							parentEl.appendChild(multiDragElements[i]);
						}

						this._animate(firstMultiDragRect, multiDragElements[i]);
					}
				}

				multiDragSortable = parentEl;
			}

			if (evt) {
				if (moved) {
					evt.cancelable && evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

				if (rootEl === parentEl || (putSortable && putSortable.lastPutMode !== 'clone')) {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';

					// Remove classes
					// ghostClass is added in dragStarted
					if (moved && !awaitingDragStarted) {
						_toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
					}
					_toggleClass(dragEl, this.options.chosenClass, false);

					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, parentEl, rootEl, oldIndex, null, evt);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl);

						if (newIndex >= 0) {
							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
							_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
						}

						putSortable && putSortable.save();
					}
					else {
						// Get the index of the dragged element within its parent
						newIndex = _index(dragEl);

						if (dragEl.nextSibling !== nextEl) {
							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
								_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
							}
						}
					}

					if (Sortable.active) {
						/* jshint eqnull:true */
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}

						if (options.swap && lastSwapEl)
						{
							_dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex, evt, { swapItem: lastSwapEl });
						}
						else
						{
							_dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
						}

						// Save sorting
						this.save();
					}
				}

			}
			this._nulling();
		},

		_nulling: function() {
			rootEl =
			dragEl =
			parentEl =
			ghostEl =
			nextEl =
			cloneEl =
			lastDownEl =
			lastSwapEl =

			scrollEl =
			scrollParentEl =
			autoScrolls.length =

			pointerElemChangedInterval =
			lastPointerElemX =
			lastPointerElemY =

			tapEvt =
			touchEvt =

			moved =
			newIndex =
			oldIndex =

			lastTarget =
			lastDirection =

			forRepaintDummy =
			realDragElRect =

			putSortable =
			activeGroup =
			Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});

			savedInputChecked.length =
			multiDragClones.length = 0;
		},

		handleEvent: function (/**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragenter':
				case 'dragover':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el, false)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl, false)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el, false);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}
			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			this._onDrop();

			sortables.splice(sortables.indexOf(this.el), 1);

			this.el = el = null;
		},

		_hideClone: function() {
			if (!cloneHidden) {
				for (var i = 0; i < (multiDragClones.length || 1); i++) {
					var clone = multiDragClones[i];
					if (!clone) {
						clone = cloneEl;
					}

					_css(clone, 'display', 'none');
					if (this.options.removeCloneOnHide && clone.parentNode) {
						clone.parentNode.removeChild(clone);
					}
				}
				cloneHidden = true;
			}
		},

		_showClone: function(putSortable) {
			if (putSortable.lastPutMode !== 'clone') {
				this._hideClone();
				return;
			}


			if (cloneHidden) {
				if (multiDragClones.length) {
					_insertMultiDrag(true);
					for (var i = 0; i < multiDragClones.length; i++) {
						_css(multiDragClones[i], 'display', '');
					}
				} else {
					// show clone at dragEl or original position
					if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, dragEl);
					} else if (nextEl) {
						rootEl.insertBefore(cloneEl, nextEl);
					} else {
						rootEl.appendChild(cloneEl);
					}

					if (this.options.group.revertClone) {
						this._animate(dragEl, cloneEl);
					}

					_css(cloneEl, 'display', '');
				}
				cloneHidden = false;
			}
		}
	};

	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx, includeCTX) {
		if (el) {
			ctx = ctx || document;

			do {
				if (
					selector != null &&
					(
						selector[0] === '>' && el.parentNode === ctx && _matches(el, selector.substring(1)) ||
						_matches(el, selector)
					) ||
					includeCTX && el === ctx
				) {
					return el;
				}

				if (el === ctx) break;
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}


	function _getParentOrHost(el) {
		return (el.host && el !== document && el.host.nodeType)
			? el.host
			: el.parentNode;
	}


	function _globalDragOver(/**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.cancelable && evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}


	function _toggleClass(el, name, state) {
		if (el && name) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style) && prop.indexOf('webkit') === -1) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}

	function _matrix(el) {
		var appliedTransforms = '';
		do {
			var transform = _css(el, 'transform');

			if (transform && transform !== 'none') {
				appliedTransforms = transform + ' ' + appliedTransforms;
			}
			/* jshint boss:true */
		} while (el = el.parentNode);

		if (window.DOMMatrix) {
			return new DOMMatrix(appliedTransforms);
		} else if (window.WebKitCSSMatrix) {
			return new WebKitCSSMatrix(appliedTransforms);
		} else if (window.CSSMatrix) {
			return new CSSMatrix(appliedTransforms);
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}



	function _dispatchEvent(sortable, rootEl, name, targetEl, toEl, fromEl, startIndex, newIndex, originalEvt, eventOptions) {
		sortable = (sortable || rootEl[expando]);
		var evt,
			options = sortable.options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
		// Support for new CustomEvent feature
		if (window.CustomEvent && !IE11OrLess && !Edge) {
			evt = new CustomEvent(name, {
				bubbles: true,
				cancelable: true
			});
		} else {
			evt = document.createEvent('Event');
			evt.initEvent(name, true, true);
		}

		evt.to = toEl || rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.items = multiDragElements || [];
		evt.clone = cloneEl;
		evt.clones = multiDragClones || [];

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		evt.originalEvent = originalEvt;

		if (eventOptions) {
			for (var option in eventOptions) {
				evt[option] = eventOptions[option];
			}
		}

		if (rootEl) {
			rootEl.dispatchEvent(evt);
		}

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}


	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;
		// Support for new CustomEvent feature
		if (window.CustomEvent && !IE11OrLess && !Edge) {
			evt = new CustomEvent('move', {
				bubbles: true,
				cancelable: true
			});
		} else {
			evt = document.createEvent('Event');
			evt.initEvent('move', true, true);
		}

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || _getRect(toEl);
		evt.willInsertAfter = willInsertAfter;

		evt.originalEvent = originalEvt;

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}

	function _disableDraggable(el) {
		el.draggable = false;
	}

	function _unsilent() {
		_silent = false;
	}

	/**
	 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
	 * and non-draggable elements
	 * @param  {HTMLElement} el       The parent element
	 * @param  {Number} childNum      The index of the child
	 * @param  {Object} options       Parent Sortable's options
	 * @return {HTMLElement}          The child at index childNum, or null if not found
	 */
	function _getChild(el, childNum, options) {
		var currentChild = 0,
			i = 0,
			children = el.children;

		while (i < children.length) {
			if (
				children[i].style.display !== 'none' &&
				children[i] !== ghostEl &&
				children[i] !== dragEl &&
				_closest(children[i], options.draggable, el, false)
			) {
				if (currentChild === childNum) {
					return children[i];
				}
				currentChild++;
			}

			i++;
		}
		return null;
	}

	/**
	 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
	 * @param  {HTMLElement} el       Parent element
	 * @return {HTMLElement}          The last child, ignoring ghostEl
	 */
	function _lastChild(el) {
		var last = el.lastElementChild;

		while (last === ghostEl || last.style.display === 'none') {
			last = last.previousElementSibling;

			if (!last) break;
		}

		return last || null;
	}

	function _ghostIsLast(evt, axis, el) {
		var elRect = _getRect(_lastChild(el)),
			mouseOnAxis = axis === 'vertical' ? evt.clientY : evt.clientX,
			mouseOnOppAxis = axis === 'vertical' ? evt.clientX : evt.clientY,
			targetS2 = axis === 'vertical' ? elRect.bottom : elRect.right,
			targetS1Opp = axis === 'vertical' ? elRect.left : elRect.top,
			targetS2Opp = axis === 'vertical' ? elRect.right : elRect.bottom,
			spacer = 10;

		return (
			axis === 'vertical' ?
				(mouseOnOppAxis > targetS2Opp + spacer || mouseOnOppAxis <= targetS2Opp && mouseOnAxis > targetS2 && mouseOnOppAxis >= targetS1Opp) :
				(mouseOnAxis > targetS2 && mouseOnOppAxis > targetS1Opp || mouseOnAxis <= targetS2 && mouseOnOppAxis > targetS2Opp + spacer)
		);
	}

	function _getSwapDirection(evt, target, axis, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
		var targetRect = _getRect(target),
			mouseOnAxis = axis === 'vertical' ? evt.clientY : evt.clientX,
			targetLength = axis === 'vertical' ? targetRect.height : targetRect.width,
			targetS1 = axis === 'vertical' ? targetRect.top : targetRect.left,
			targetS2 = axis === 'vertical' ? targetRect.bottom : targetRect.right,
			dragRect = _getRect(dragEl),
			invert = false;


		if (!invertSwap) {
			// Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
			if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) { // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
				// check if past first invert threshold on side opposite of lastDirection
				if (!pastFirstInvertThresh &&
					(lastDirection === 1 ?
						(
							mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2
						) :
						(
							mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2
						)
					)
				)
				{
					// past first invert threshold, do not restrict inverted threshold to dragEl shadow
					pastFirstInvertThresh = true;
				}

				if (!pastFirstInvertThresh) {
					var dragS1 = axis === 'vertical' ? dragRect.top : dragRect.left,
						dragS2 = axis === 'vertical' ? dragRect.bottom : dragRect.right;
					// dragEl shadow (target move distance shadow)
					if (
						lastDirection === 1 ?
						(
							mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
						) :
						(
							mouseOnAxis > targetS2 - targetMoveDistance
						)
					)
					{
						return lastDirection * -1;
					}
				} else {
					invert = true;
				}
			} else {
				// Regular
				if (
					mouseOnAxis > targetS1 + (targetLength * (1 - swapThreshold) / 2) &&
					mouseOnAxis < targetS2 - (targetLength * (1 - swapThreshold) / 2)
				) {
					return _getInsertDirection(target);
					// return ((mouseOnAxis > targetS1 + targetLength / 2) ? -1 : 1);
				}
			}
		}

		invert = invert || invertSwap;

		if (invert) {
			// Invert of regular
			if (
				mouseOnAxis < targetS1 + (targetLength * invertedSwapThreshold / 2) ||
				mouseOnAxis > targetS2 - (targetLength * invertedSwapThreshold / 2)
			)
			{
				return ((mouseOnAxis > targetS1 + targetLength / 2) ? 1 : -1);
			}
		}

		return 0;
	}

	/**
	 * Gets the direction dragEl must be swapped relative to target in order to make it
	 * seem that dragEl has been "inserted" into that element's position
	 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
	 * @param  {Object} options           options of the parent sortable
	 * @return {Number}                   Direction dragEl must be swapped
	 */
	function _getInsertDirection(target, options) {
		var dragElIndex = _index(dragEl),
			targetIndex = _index(target);

		if (dragElIndex < targetIndex) {
			return 1;
		} else {
			return -1;
		}
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @return {number}
	 */
	function _index(el) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && el !== cloneEl) {
				index++;
			}
		}

		return index;
	}

	function _matches(/**HTMLElement*/el, /**String*/selector) {
		if (el) {
			try {
				if (el.matches) {
					return el.matches(selector);
				} else if (el.msMatchesSelector) {
					return el.msMatchesSelector(selector);
				} else if (el.webkitMatchesSelector) {
					return el.webkitMatchesSelector(selector);
				}
			} catch(_) {
				return false;
			}
		}

		return false;
	}

	var _throttleTimeout;
	function _throttle(callback, ms) {
		return function () {
			if (!_throttleTimeout) {
				var args = arguments,
					_this = this;

				_throttleTimeout = setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					_throttleTimeout = void 0;
				}, ms);
			}
		};
	}

	function _cancelThrottle() {
		clearTimeout(_throttleTimeout);
		_throttleTimeout = void 0;
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		if (Polymer && Polymer.dom) {
			return Polymer.dom(el).cloneNode(true);
		}
		else if ($) {
			return $(el).clone(true)[0];
		}
		else {
			return el.cloneNode(true);
		}
	}

	function _saveInputCheckedState(root) {
		savedInputChecked.length = 0;

		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	function _nextTick(fn) {
		return setTimeout(fn, 0);
	}

	function _cancelNextTick(id) {
		return clearTimeout(id);
	}

	function _swapNodes(n1, n2) {

		var p1 = n1.parentNode;
		var p2 = n2.parentNode;
		var i1, i2;

		if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

		i1 = _index(n1);
		i2 = _index(n2);

		if (p1.isEqualNode(p2) && i1 < i2) {
			i2++;
		}
		p1.insertBefore(n2, p1.children[i1]);
		p2.insertBefore(n1, p2.children[i2]);
	}


	/**
	 * Returns the "bounding client rect" of given element
	 * @param  {HTMLElement} el                The element whose boundingClientRect is wanted
	 * @param  {[HTMLElement]} container       the parent the element will be placed in
	 * @param  {[Boolean]} adjustForTransform  Whether the rect should compensate for parent's transform
	 * @return {Object}                        The boundingClientRect of el
	 */
	function _getRect(el, container, adjustForTransform) {
		if (!el.getBoundingClientRect && el !== win) return;

		var elRect,
			top,
			left,
			bottom,
			right,
			height,
			width;

		if (el !== win && el !== _getWindowScrollingElement()) {
			elRect = el.getBoundingClientRect();
			top = elRect.top;
			left = elRect.left;
			bottom = elRect.bottom;
			right = elRect.right;
			height = elRect.height;
			width = elRect.width;
		} else {
			top = 0;
			left = 0;
			bottom = window.innerHeight;
			right = window.innerWidth;
			height = window.innerHeight;
			width = window.innerWidth;
		}

		if (adjustForTransform && el !== win) {
			// Adjust for translate()
			container = container || el.parentNode;

			// solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
			// Not needed on <= IE11
			if (!IE11OrLess) {
				do {
					if (container && container.getBoundingClientRect && _css(container, 'transform') !== 'none') {
						var containerRect = container.getBoundingClientRect();

						// Set relative to edges of padding box of container
						top -= containerRect.top + parseInt(_css(container, 'border-top-width'));
						left -= containerRect.left + parseInt(_css(container, 'border-left-width'));
						bottom = top + elRect.height;
						right = left + elRect.width;

						break;
					}
					/* jshint boss:true */
				} while (container = container.parentNode);
			}

			// Adjust for scale()
			var matrix = _matrix(el),
				scaleX = matrix && matrix.a,
				scaleY = matrix && matrix.d;

			if (matrix) {
				top /= scaleY;
				left /= scaleX;

				width /= scaleX;
				height /= scaleY;

				bottom = top + height;
				right = left + width;
			}
		}

		return {
			top: top,
			left: left,
			bottom: bottom,
			right: right,
			width: width,
			height: height
		};
	}


	/**
	 * Checks if a side of an element is scrolled past a side of it's parents
	 * @param  {HTMLElement}  el       The element who's side being scrolled out of view is in question
	 * @param  {String}       side     Side of the element in question ('top', 'left', 'right', 'bottom')
	 * @return {HTMLElement}           The parent scroll element that the el's side is scrolled past, or null if there is no such element
	 */
	function _isScrolledPast(el, side) {
		var parent = _getParentAutoScrollElement(el, true),
			elSide = _getRect(el)[side];

		/* jshint boss:true */
		while (parent) {
			var parentSide = _getRect(parent)[side],
				visible;

			if (side === 'top' || side === 'left') {
				visible = elSide >= parentSide;
			} else {
				visible = elSide <= parentSide;
			}

			if (!visible) return parent;

			if (parent === _getWindowScrollingElement()) break;

			parent = _getParentAutoScrollElement(parent, false);
		}

		return false;
	}

	function _insertMultiDrag(clones) {
		var multiDrags = clones ? multiDragClones : multiDragElements;
		for (var i = 0; i < multiDrags.length; i++) {
			var target = rootEl.children[multiDrags[i].sortableIndex];
			if (target) {
				rootEl.insertBefore(multiDrags[i], target);
			} else {
				rootEl.appendChild(multiDrags[i]);
			}
		}
	}

	function _removeMultiDragElements() {
		for (var i = 0; i < multiDragElements.length; i++) {
			if (multiDragElements[i] === dragEl) continue;
			multiDragElements[i].parentNode && multiDragElements[i].parentNode.removeChild(multiDragElements[i]);
		}
	}

	// Fixed #973:
	_on(document, 'touchmove', function(evt) {
		if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
			evt.preventDefault();
		}
	});


	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el, false);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index,
		nextTick: _nextTick,
		cancelNextTick: _cancelNextTick,
		detectDirection: _detectDirection,
		getChild: _getChild
	};


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};


	// Export
	Sortable.version = '1.8.3';
	return Sortable;
});
});

var css_248z = ".userans_status{top:0;right:0}.matchlist_item{height:90px;float:left;border:1px solid #dee2e6}.choose_bottom{background-color:#d9e7fd}#choose{width:668px;max-width:668px}.choose_header{background:#d9e7fd;border-top:2px solid #96bbf6;padding:7px 7px 7px 20px}.choose_body{border-left:10px solid #d9e7fd;border-right:10px solid #d9e7fd}.isreviewbgcolor{background:#edf2fc}[tabindex=\"0\"]:focus{box-shadow:0 0 0 .09rem #89ace4!important;outline:0}.sortable-ghost{box-shadow:0 0 0 .09rem #6e99df!important}.width10{width:90%}.light-cyan-bg{background-color:#d4e4ff;color:#333}.width80{width:80px}.width200{width:200px}.add_cat_btn{transform:rotate(270deg)}.width109{width:109px}.width94{width:94px}.top1{top:1px}";
styleInject(css_248z);

/* clsSMChoose\ChooseMultiGridPreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMChoose\\ChooseMultiGridPreview.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i];
	child_ctx[28] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i];
	child_ctx[28] = i;
	return child_ctx;
}

// (451:20) {#if showcorrectanswer == false}
function create_if_block_5(ctx) {
	let each_1_anchor;
	let each_value_1 = /*preview_data*/ ctx[1].correctxmlarray;
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
			if (dirty & /*preview_data, box_width*/ 34) {
				each_value_1 = /*preview_data*/ ctx[1].correctxmlarray;
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
		id: create_if_block_5.name,
		type: "if",
		source: "(451:20) {#if showcorrectanswer == false}",
		ctx
	});

	return block;
}

// (481:32) {:else}
function create_else_block_4(ctx) {
	let t_value = /*value*/ ctx[26].value + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && t_value !== (t_value = /*value*/ ctx[26].value + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_4.name,
		type: "else",
		source: "(481:32) {:else}",
		ctx
	});

	return block;
}

// (474:71) 
function create_if_block_8(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;

	const block = {
		c: function create() {
			img = element("img");
			set_style(img, "height", "70px");
			set_style(img, "width", "100%");
			set_style(img, "object-fit", "contain");
			attr_dev(img, "class", "px-2");
			if (!src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split("##")[0].slice(1))) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null);

			add_location(img, file, 474, 36, 20209);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && !src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split("##")[0].slice(1))) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*preview_data*/ 2 && img_alt_value !== (img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_8.name,
		type: "if",
		source: "(474:71) ",
		ctx
	});

	return block;
}

// (463:32) {#if value.value.charAt(0) == "!"}
function create_if_block_6(ctx) {
	let show_if;
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (show_if == null || dirty & /*preview_data*/ 2) show_if = !!(/*value*/ ctx[26].value.charAt(1) == "*");
		if (show_if) return create_if_block_7;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_1(ctx, -1);
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
			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
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
		id: create_if_block_6.name,
		type: "if",
		source: "(463:32) {#if value.value.charAt(0) == \\\"!\\\"}",
		ctx
	});

	return block;
}

// (471:36) {:else}
function create_else_block_3(ctx) {
	let t_value = /*value*/ ctx[26].value.slice(1) + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && t_value !== (t_value = /*value*/ ctx[26].value.slice(1) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_3.name,
		type: "else",
		source: "(471:36) {:else}",
		ctx
	});

	return block;
}

// (464:36) {#if value.value.charAt(1) == "*"}
function create_if_block_7(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;

	const block = {
		c: function create() {
			img = element("img");
			set_style(img, "height", "70px");
			set_style(img, "width", "100%");
			set_style(img, "object-fit", "contain");
			attr_dev(img, "class", "px-2");
			if (!src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split('!')[1].split("##")[0].slice(1))) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null);

			add_location(img, file, 464, 40, 19478);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && !src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split('!')[1].split("##")[0].slice(1))) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*preview_data*/ 2 && img_alt_value !== (img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_7.name,
		type: "if",
		source: "(464:36) {#if value.value.charAt(1) == \\\"*\\\"}",
		ctx
	});

	return block;
}

// (452:24) {#each preview_data.correctxmlarray as value, i}
function create_each_block_1(ctx) {
	let li;
	let show_if;
	let show_if_1;
	let t;
	let li_tabindex_value;
	let li_id_value;
	let li_name_value;
	let li_key_value;
	let li_data_optid_value;
	let li_data_ischecked_value;
	let li_class_value;

	function select_block_type(ctx, dirty) {
		if (show_if == null || dirty & /*preview_data*/ 2) show_if = !!(/*value*/ ctx[26].value.charAt(0) == "!");
		if (show_if) return create_if_block_6;
		if (show_if_1 == null || dirty & /*preview_data*/ 2) show_if_1 = !!(/*value*/ ctx[26].value.charAt(0) == "*");
		if (show_if_1) return create_if_block_8;
		return create_else_block_4;
	}

	let current_block_type = select_block_type(ctx, -1);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			li = element("li");
			if_block.c();
			t = space();
			attr_dev(li, "tabindex", li_tabindex_value = /*value*/ ctx[26].ischecked == true ? '-1' : '0');
			attr_dev(li, "id", li_id_value = 'p' + /*i*/ ctx[28]);
			attr_dev(li, "name", li_name_value = /*i*/ ctx[28]);
			attr_dev(li, "key", li_key_value = 'p' + /*i*/ ctx[28]);
			attr_dev(li, "data-optid", li_data_optid_value = /*i*/ ctx[28]);
			attr_dev(li, "data-ischecked", li_data_ischecked_value = /*value*/ ctx[26].ischecked);

			attr_dev(li, "class", li_class_value = "matchlist_item pe-none " + (/*value*/ ctx[26].ischecked == true
			? 'bg-primary text-white'
			: '') + " align-items-center justify-content-center d-flex position-relative ui-draggable m-0");

			set_style(li, "width", /*box_width*/ ctx[5]);
			set_style(li, "overflow", "auto");
			add_location(li, file, 452, 28, 18656);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			if_block.m(li, null);
			append_dev(li, t);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(li, t);
				}
			}

			if (dirty & /*preview_data*/ 2 && li_tabindex_value !== (li_tabindex_value = /*value*/ ctx[26].ischecked == true ? '-1' : '0')) {
				attr_dev(li, "tabindex", li_tabindex_value);
			}

			if (dirty & /*preview_data*/ 2 && li_data_ischecked_value !== (li_data_ischecked_value = /*value*/ ctx[26].ischecked)) {
				attr_dev(li, "data-ischecked", li_data_ischecked_value);
			}

			if (dirty & /*preview_data*/ 2 && li_class_value !== (li_class_value = "matchlist_item pe-none " + (/*value*/ ctx[26].ischecked == true
			? 'bg-primary text-white'
			: '') + " align-items-center justify-content-center d-flex position-relative ui-draggable m-0")) {
				attr_dev(li, "class", li_class_value);
			}

			if (dirty & /*box_width*/ 32) {
				set_style(li, "width", /*box_width*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(452:24) {#each preview_data.correctxmlarray as value, i}",
		ctx
	});

	return block;
}

// (499:28) {#if targetView == 'block' && showcorrectanswer == true && value.ischecked == false}
function create_if_block_3(ctx) {
	let if_block_anchor;

	function select_block_type_2(ctx, dirty) {
		if (/*value*/ ctx[26].iscorrect == true) return create_if_block_4;
		return create_else_block_2;
	}

	let current_block_type = select_block_type_2(ctx);
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
			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
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
		id: create_if_block_3.name,
		type: "if",
		source: "(499:28) {#if targetView == 'block' && showcorrectanswer == true && value.ischecked == false}",
		ctx
	});

	return block;
}

// (504:32) {:else}
function create_else_block_2(ctx) {
	let span;

	const block = {
		c: function create() {
			span = element("span");
			attr_dev(span, "class", "icomoon-new-24px-cancel-circle-1 s4 text-danger position-absolute userans_status");
			add_location(span, file, 504, 36, 22178);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_2.name,
		type: "else",
		source: "(504:32) {:else}",
		ctx
	});

	return block;
}

// (500:32) {#if value.iscorrect == true}
function create_if_block_4(ctx) {
	let span;

	const block = {
		c: function create() {
			span = element("span");
			attr_dev(span, "class", "icomoon-new-24px-checkmark-circle-1 s4 text-success position-absolute userans_status");
			add_location(span, file, 500, 36, 21920);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(500:32) {#if value.iscorrect == true}",
		ctx
	});

	return block;
}

// (530:28) {:else}
function create_else_block_1(ctx) {
	let t_value = /*value*/ ctx[26].value + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && t_value !== (t_value = /*value*/ ctx[26].value + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(530:28) {:else}",
		ctx
	});

	return block;
}

// (522:67) 
function create_if_block_2(ctx) {
	let img;
	let img_img_val_value;
	let img_src_value;
	let img_alt_value;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "img_val", img_img_val_value = /*value*/ ctx[26].value);
			set_style(img, "height", "70px");
			set_style(img, "width", "100%");
			set_style(img, "object-fit", "contain");
			attr_dev(img, "class", "px-2");
			if (!src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split("##")[0].slice(1))) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null);

			add_location(img, file, 522, 32, 23351);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && img_img_val_value !== (img_img_val_value = /*value*/ ctx[26].value)) {
				attr_dev(img, "img_val", img_img_val_value);
			}

			if (dirty & /*preview_data*/ 2 && !src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split("##")[0].slice(1))) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*preview_data*/ 2 && img_alt_value !== (img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(522:67) ",
		ctx
	});

	return block;
}

// (510:28) {#if value.value.charAt(0) == "!"}
function create_if_block(ctx) {
	let show_if;
	let if_block_anchor;

	function select_block_type_4(ctx, dirty) {
		if (show_if == null || dirty & /*preview_data*/ 2) show_if = !!(/*value*/ ctx[26].value.charAt(1) == "*");
		if (show_if) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type_4(ctx, -1);
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
			if (current_block_type === (current_block_type = select_block_type_4(ctx, dirty)) && if_block) {
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
		id: create_if_block.name,
		type: "if",
		source: "(510:28) {#if value.value.charAt(0) == \\\"!\\\"}",
		ctx
	});

	return block;
}

// (519:32) {:else}
function create_else_block(ctx) {
	let t_value = /*value*/ ctx[26].value.slice(1) + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && t_value !== (t_value = /*value*/ ctx[26].value.slice(1) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(519:32) {:else}",
		ctx
	});

	return block;
}

// (511:32) {#if value.value.charAt(1) == "*"}
function create_if_block_1(ctx) {
	let img;
	let img_img_val_value;
	let img_src_value;
	let img_alt_value;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "img_val", img_img_val_value = /*value*/ ctx[26].value);
			set_style(img, "height", "70px");
			set_style(img, "width", "100%");
			set_style(img, "object-fit", "contain");
			attr_dev(img, "class", "px-2");
			if (!src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split('!')[1].split("##")[0].slice(1))) attr_dev(img, "src", img_src_value);

			attr_dev(img, "alt", img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null);

			add_location(img, file, 511, 36, 22597);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*preview_data*/ 2 && img_img_val_value !== (img_img_val_value = /*value*/ ctx[26].value)) {
				attr_dev(img, "img_val", img_img_val_value);
			}

			if (dirty & /*preview_data*/ 2 && !src_url_equal(img.src, img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[26].value.split('!')[1].split("##")[0].slice(1))) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*preview_data*/ 2 && img_alt_value !== (img_alt_value = /*value*/ ctx[26].value.split("##")[1]
			? /*value*/ ctx[26].value.split("##")[1]
			: null)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(511:32) {#if value.value.charAt(1) == \\\"*\\\"}",
		ctx
	});

	return block;
}

// (487:20) {#each preview_data.localCData as value, i}
function create_each_block(ctx) {
	let li;
	let t0;
	let show_if;
	let show_if_1;
	let t1;
	let li_tabindex_value;
	let li_id_value;
	let li_name_value;
	let li_key_value;
	let li_data_optid_value;
	let li_data_ischecked_value;
	let li_class_value;
	let mounted;
	let dispose;
	let if_block0 = /*targetView*/ ctx[3] == 'block' && /*showcorrectanswer*/ ctx[4] == true && /*value*/ ctx[26].ischecked == false && create_if_block_3(ctx);

	function select_block_type_3(ctx, dirty) {
		if (show_if == null || dirty & /*preview_data*/ 2) show_if = !!(/*value*/ ctx[26].value.charAt(0) == "!");
		if (show_if) return create_if_block;
		if (show_if_1 == null || dirty & /*preview_data*/ 2) show_if_1 = !!(/*value*/ ctx[26].value.charAt(0) == "*");
		if (show_if_1) return create_if_block_2;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_3(ctx, -1);
	let if_block1 = current_block_type(ctx);

	const block = {
		c: function create() {
			li = element("li");
			if (if_block0) if_block0.c();
			t0 = space();
			if_block1.c();
			t1 = space();
			attr_dev(li, "tabindex", li_tabindex_value = /*value*/ ctx[26].ischecked == true ? '-1' : '0');
			attr_dev(li, "id", li_id_value = 'p' + /*i*/ ctx[28]);
			attr_dev(li, "name", li_name_value = /*i*/ ctx[28]);
			attr_dev(li, "key", li_key_value = 'p' + /*i*/ ctx[28]);
			attr_dev(li, "data-optid", li_data_optid_value = /*i*/ ctx[28]);
			attr_dev(li, "data-ischecked", li_data_ischecked_value = /*value*/ ctx[26].ischecked);

			attr_dev(li, "class", li_class_value = "matchlist_item " + (/*showcorrectanswer*/ ctx[4] == false
			? 'd-none'
			: 'd-flex') + " " + (/*isReview*/ ctx[0] ? 'isreviewbgcolor pe-none' : '') + " " + (/*value*/ ctx[26].ischecked == true
			? 'bg-primary text-white pe-none'
			: '') + " align-items-center justify-content-center position-relative ui-draggable m-0");

			set_style(li, "width", /*box_width*/ ctx[5]);
			set_style(li, "overflow", "auto");
			add_location(li, file, 487, 24, 20960);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			if (if_block0) if_block0.m(li, null);
			append_dev(li, t0);
			if_block1.m(li, null);
			append_dev(li, t1);

			if (!mounted) {
				dispose = listen_dev(li, "keydown", /*hotkeysAda*/ ctx[9], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*targetView*/ ctx[3] == 'block' && /*showcorrectanswer*/ ctx[4] == true && /*value*/ ctx[26].ischecked == false) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(li, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_3(ctx, dirty)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(li, t1);
				}
			}

			if (dirty & /*preview_data*/ 2 && li_tabindex_value !== (li_tabindex_value = /*value*/ ctx[26].ischecked == true ? '-1' : '0')) {
				attr_dev(li, "tabindex", li_tabindex_value);
			}

			if (dirty & /*preview_data*/ 2 && li_data_ischecked_value !== (li_data_ischecked_value = /*value*/ ctx[26].ischecked)) {
				attr_dev(li, "data-ischecked", li_data_ischecked_value);
			}

			if (dirty & /*showcorrectanswer, isReview, preview_data*/ 19 && li_class_value !== (li_class_value = "matchlist_item " + (/*showcorrectanswer*/ ctx[4] == false
			? 'd-none'
			: 'd-flex') + " " + (/*isReview*/ ctx[0] ? 'isreviewbgcolor pe-none' : '') + " " + (/*value*/ ctx[26].ischecked == true
			? 'bg-primary text-white pe-none'
			: '') + " align-items-center justify-content-center position-relative ui-draggable m-0")) {
				attr_dev(li, "class", li_class_value);
			}

			if (dirty & /*box_width*/ 32) {
				set_style(li, "width", /*box_width*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (if_block0) if_block0.d();
			if_block1.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(487:20) {#each preview_data.localCData as value, i}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div4;
	let itemhelper;
	let t0;
	let div3;
	let div0;
	let t1_value = /*state*/ ctx[2].headingCorrect + "";
	let t1;
	let t2;
	let div1;
	let ul;
	let t3;
	let ul_data_row_value;
	let ul_data_col_value;
	let t4;
	let div2;
	let current;

	itemhelper = new ItemHelper({
			props: {
				reviewMode: /*isReview*/ ctx[0],
				handleReviewClick: /*handleReviewMode*/ ctx[8]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[6]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[7]);
	let if_block = /*showcorrectanswer*/ ctx[4] == false && create_if_block_5(ctx);
	let each_value = /*preview_data*/ ctx[1].localCData;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div3 = element("div");
			div0 = element("div");
			t1 = text(t1_value);
			t2 = space();
			div1 = element("div");
			ul = element("ul");
			if (if_block) if_block.c();
			t3 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			div2 = element("div");
			div2.textContent = `${l.drag_drop_set_seq_msg}`;
			attr_dev(div0, "class", "choose_header font17 text-left rounded-top m-0");
			add_location(div0, file, 440, 12, 18093);
			attr_dev(ul, "id", "sortable");
			attr_dev(ul, "data-row", ul_data_row_value = /*preview_data*/ ctx[1].maxRow);
			attr_dev(ul, "data-col", ul_data_col_value = /*preview_data*/ ctx[1].maxCol);
			attr_dev(ul, "class", "p-2 d-inline-block w-100 m-0");
			add_location(ul, file, 444, 16, 18279);
			attr_dev(div1, "class", "choose_body bg-white");
			add_location(div1, file, 443, 12, 18227);
			attr_dev(div2, "class", "choose_bottom font12 m-0 text-left font-weight-bold text-danger p-2 rounded-bottom");
			attr_dev(div2, "id", "instruction");
			add_location(div2, file, 536, 12, 24060);
			attr_dev(div3, "id", "choose");
			attr_dev(div3, "class", "text-center mx-auto");
			add_location(div3, file, 439, 8, 18034);
			attr_dev(div4, "id", "chid");
			add_location(div4, file, 432, 4, 17811);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			mount_component(itemhelper, div4, null);
			append_dev(div4, t0);
			append_dev(div4, div3);
			append_dev(div3, div0);
			append_dev(div0, t1);
			append_dev(div3, t2);
			append_dev(div3, div1);
			append_dev(div1, ul);
			if (if_block) if_block.m(ul, null);
			append_dev(ul, t3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			append_dev(div3, t4);
			append_dev(div3, div2);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const itemhelper_changes = {};
			if (dirty & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if ((!current || dirty & /*state*/ 4) && t1_value !== (t1_value = /*state*/ ctx[2].headingCorrect + "")) set_data_dev(t1, t1_value);

			if (/*showcorrectanswer*/ ctx[4] == false) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_5(ctx);
					if_block.c();
					if_block.m(ul, t3);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*preview_data, showcorrectanswer, isReview, box_width, hotkeysAda, targetView*/ 571) {
				each_value = /*preview_data*/ ctx[1].localCData;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*preview_data*/ 2 && ul_data_row_value !== (ul_data_row_value = /*preview_data*/ ctx[1].maxRow)) {
				attr_dev(ul, "data-row", ul_data_row_value);
			}

			if (!current || dirty & /*preview_data*/ 2 && ul_data_col_value !== (ul_data_col_value = /*preview_data*/ ctx[1].maxCol)) {
				attr_dev(ul, "data-col", ul_data_col_value);
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
			if (detaching) detach_dev(div4);
			destroy_component(itemhelper);
			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
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

function makeshuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ChooseMultiGridPreview', slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { showAns } = $$props;
	let { isReview } = $$props;
	let { editorState } = $$props;
	let targetView = "none";
	let showcorrectanswer, box_width, corr_ans_count;

	let preview_data = {
		layout: [],
		maxRow: 0,
		maxCol: 0,
		localCData: [],
		layoutchanged: [],
		original_xml_copy: '',
		countrow: 0,
		countcol: 0,
		totalheading: 0,
		correctxmlarray: [],
		user_ans_xml: [],
		isShuffeled: false,
		imagepath: "//s3.amazonaws.com/jigyaasa_content_static/",
		result: 'correct'
	};

	let state = {
		snackback: false,
		xml: "",
		headingCorrect: "",
		static: false,
		isdragging: false,
		colstobeshown: 3,
		isanyheading: false,
		showlabelofshuffle: 'block'
	};

	onMount(() => {
		loadModule(xml);

		try {
			if (uxml == '<smans type="6"></smans>') {
				$$invalidate(11, uxml = '');
			}
		} catch(error) {
			console.warn({ error });
		}

		if (window.inNative) {
			window.getHeight && window.getHeight();
		}
	});

	afterUpdate(() => {
		let el = AH.select("#sortable");

		// for sorting
		let sortable = new Sortable(el,
		{
				animation: 150,
				swap: true,
				swapClass: 'bg-light',
				onUpdate() {
					$$invalidate(1, preview_data.user_ans_xml = [], preview_data);
					$$invalidate(1, preview_data.userAns = '', preview_data);

					AH.selectAll('#sortable li').forEach((value, i) => {
						value.id = 'p' + i;
						value.setAttribute('data-optid', i);
						value.setAttribute('name', i);

						$$invalidate(
							1,
							preview_data.user_ans_xml = [
								...preview_data.user_ans_xml,
								{
									id: i,
									value: AH.select("#" + value.getAttribute('id')).innerText != ''
									? AH.select("#" + value.getAttribute('id')).innerText
									: AH.find("#" + value.getAttribute('id'), 'img').getAttribute('img_val')
								}
							],
							preview_data
						);
					});

					//storeCorrectXYValue(preview_data.correctxmlarray);
					$$invalidate(1, preview_data.correctxmlarray = storeIndexValue(preview_data.correctxmlarray), preview_data);

					AH.selectAll('#sortable li').forEach((value, i) => {
						$$invalidate(
							1,
							preview_data.userAns += (i != 0
							? ('\n').concat(preview_data.correctxmlarray[i].ischecked ? '!' : '')
							: preview_data.correctxmlarray[i].ischecked ? '!' : '') + (AH.select("#" + value.getAttribute('id')).innerText != ''
							? AH.select("#" + value.getAttribute('id')).innerText
							: AH.find("#" + value.getAttribute('id'), 'img').getAttribute('img_val')),
							preview_data
						);
					});

					console.log(preview_data.userAns, 'kijk');
					updateOnSorting();
				}
			});

		AH.selectAll('.matchlist_item').forEach(val => {
			if (val.style.width != box_width) {
				val.style.width = box_width;
			}
		});
	});

	function updateOnSorting() {
		// resets the localCData
		preview_data.localCData.forEach(val => {
			val.iscorrect = '';
			corr_ans_count = 0;
		});

		// updates value of iscorrect in the localCData
		preview_data.localCData.forEach((val, i) => {
			if (val.ischecked == true) {
				val.iscorrect = true;
			}

			preview_data.localCData.forEach(valu => {
				if (preview_data.correctxmlarray[i].value == preview_data.user_ans_xml[i].value && valu.value == preview_data.correctxmlarray[i].value) {
					valu.iscorrect = true;
				}
			});
		});

		preview_data.localCData.forEach(val => {
			if (val.iscorrect != true) {
				val.iscorrect = false;
				corr_ans_count++;
			}
		});

		displayAns();
	}

	// updates the value of sliders elements and load the module
	function loadModule(loadXml) {
		loadXml = XMLToJSON(loadXml);
		$$invalidate(2, state.headingCorrect = loadXml.smxml.list._headingCorrect, state);
		$$invalidate(1, preview_data.maxRow = parseInt(loadXml.smxml.list._row), preview_data);
		$$invalidate(1, preview_data.maxCol = parseInt(loadXml.smxml.list._col), preview_data);
		console.log(loadXml, 'hhh');
		parseXMLPreview(loadXml);
	}

	// parses the xml and updates the values of sliders elements
	function parseXMLPreview(MYXML) {
		let cdata = MYXML.smxml.list.__cdata.split("\n");

		for (let i in cdata) {
			if (cdata[i].trim() != "") {
				if (cdata[i].trim().charAt(0) == "!") {
					$$invalidate(2, state.isanyheading = true, state);
				}
			}
		}

		$$invalidate(1, preview_data.localCData = [], preview_data);
		$$invalidate(1, preview_data.correctxmlarray = [], preview_data);
		$$invalidate(1, preview_data.totalheading = MYXML.smxml.list._col, preview_data);
		$$invalidate(1, preview_data.countcol = MYXML.smxml.list._col, preview_data);
		$$invalidate(1, preview_data.countrow = MYXML.smxml.list._row, preview_data);

		for (let i in cdata) {
			if (cdata[i].trim() != "") {
				$$invalidate(2, state.colstobeshown = parseInt(preview_data.countcol), state);
				datatopush(cdata[i].trim(), i);
			} else {
				let istobepushed = false;

				for (let j = i; j < cdata.length; j++) {
					if (cdata[j].trim() == "" && j != cdata.length - 1) {
						istobepushed = false;
					} else {
						istobepushed = true;
						break;
					}
				}

				if (istobepushed == true) {
					datatopush(cdata[i].trim(), i);
				}
			}
		}

		storeCorrectXYValue(preview_data.correctxmlarray);
		storeCorrectXYValue(preview_data.localCData);
		if (!uxml) shuffle();

		for (let i = 0; i < preview_data.localCData.length; i++) {
			if (preview_data.localCData[i].value.charAt(0) != "!") {
				$$invalidate(1, preview_data.localCData[i].ischecked = false, preview_data);
			} else {
				$$invalidate(1, preview_data.localCData[i].ischecked = true, preview_data);
			}
		}

		$$invalidate(1, preview_data.user_ans_xml = [], preview_data);
		$$invalidate(1, preview_data.userAns = '', preview_data);

		preview_data.localCData.forEach((val, i) => {
			preview_data.user_ans_xml.push({ id: i, value: val.value });
			$$invalidate(1, preview_data.userAns += (i != 0 ? '\n' : '').concat(val.value), preview_data);
		});
	}

	// add values in the array
	function datatopush(value, index) {
		preview_data.localCData.push({
			value: value.trim(),
			colval: "",
			rowval: "",
			mainseq: "",
			x: 0,
			y: 0,
			id: index
		});

		preview_data.correctxmlarray.push({
			value: value.trim(),
			colval: "",
			rowval: "",
			mainseq: "",
			x: "",
			y: "",
			id: index
		});
	}

	//store correct XY value
	function storeCorrectXYValue(layout) {
		let temporary = 0, counter = 0;

		for (let i = 0; i < layout.length; i++) {
			if (temporary == preview_data.countcol) {
				temporary = 0;
				counter = counter + 3;
			}

			layout[i].x = temporary;
			layout[i].y = counter;
			temporary++;
		}
	}

	//for shuffleing
	function shuffle() {
		$$invalidate(1, preview_data.isShuffeled = true, preview_data);
		$$invalidate(1, preview_data.localCData = shuffleArray(preview_data.localCData), preview_data);
		storeCorrectXYValue(preview_data.localCData);
		$$invalidate(2, state.showlabelofshuffle = 'none', state);
	}

	//shuffling
	function shuffleArray(array) {
		let arraytoshuffle = [];

		if (state.isanyheading == true) {
			for (let i = 0; i < array.length; i++) {
				if (array[i].value.charAt(0) != "!") {
					arraytoshuffle.push(array[i]);
				}
			}

			arraytoshuffle = makeshuffle(arraytoshuffle);
			let j = 0;

			for (let i = 0; i < array.length; i++) {
				if (array[i].value.charAt(0) != "!") {
					array[i] = arraytoshuffle[j];
					j++;
				}
			}
		} else {
			array = makeshuffle(array);
		}

		array = storeIndexValue(array);
		return array;
	}

	//to store value of index
	function storeIndexValue(array) {
		let k = 1, j = 1, count = 1;

		for (let i = 0; i < array.length; i++) {
			array[i].colval = j;
			$$invalidate(1, preview_data.correctxmlarray[i].colval = j, preview_data);
			array[i].rowval = k;
			$$invalidate(1, preview_data.correctxmlarray[i].rowval = k, preview_data);
			array[i].mainseq = k + "-" + j;
			$$invalidate(1, preview_data.correctxmlarray[i].mainseq = k + "-" + j, preview_data);
			j++;

			if (array[i].value.charAt(0) != "!") {
				$$invalidate(1, preview_data.correctxmlarray[i].ischecked = false, preview_data);
			} else {
				$$invalidate(1, preview_data.correctxmlarray[i].ischecked = true, preview_data);
			}

			if (count == preview_data.totalheading) {
				j = 1;
				k++;
				count = 0;
			}

			count++;
		}

		return array;
	}

	// checks and show the answer, shows correct answer and your answer button and not allow the user to perform the task
	function setReview() {
		$$invalidate(3, targetView = "block");
		$$invalidate(2, state.snackback = true, state);
		$$invalidate(2, state.static = true, state);
		$$invalidate(4, showcorrectanswer = true);
		displayAns();
	}

	// allow the user to perform the task and hides correct answer and your answer button
	function unsetReview() {
		$$invalidate(3, targetView = "none");
		$$invalidate(2, state.snackback = false, state);
		$$invalidate(2, state.static = false, state);
	}

	function handleReviewMode(mode) {
		if (mode == 'c') {
			$$invalidate(4, showcorrectanswer = false);
		} else if (mode == 'u') {
			$$invalidate(4, showcorrectanswer = true);
		}
	}

	function checkAns() {
		// used for switch on next question in prepengine if current question is attempted
		ISSPECIALMODULEUSERXMLCHANGE = 1;

		let result;

		if (corr_ans_count > 0) {
			result = 'Incorrect';
		} else {
			result = 'Correct';
		}

		return result;
	}

	// display the correct or incorrect according to the answer matched
	function displayAns() {
		// contains correct or incorrect according to the return value of checkAns method
		let ans = checkAns();

		if (editorState) {
			// shows the answer correct or incorrect according to the value of variable 'ans'
			showAns(ans);
		} else {
			console.log('lllll', preview_data.userAns);
			let userXml = '<smxml type="6" name="ChooseAndReorder"><list groupcheck="false" whichfixed="" headingCorrect="' + state.headingCorrect + '" row="' + preview_data.countrow + '" col="' + preview_data.countcol + '"><!--[CDATA[' + preview_data.userAns + ']]--></list></smxml>';
			console.log('gg', userXml);
			onUserAnsChange({ uXml: userXml, ans });
		}
	}

	//for keyboard navigation
	function hotkeysAda(event) {
		if (event.which === 13) {
			let _id = event.target.id;

			if (this.classList.contains('copied')) {
				AH.selectAll('#' + _id, 'removeClass', 'copied');
			} else {
				if (AH.selectAll("#chid .copied").length < 1) {
					AH.selectAll('#' + _id, 'addClass', 'copied');
					$$invalidate(2, state.copied = AH.select("#chid .copied"), state);
				}

				exchangeValue(state.copied, AH.select('#' + _id));
			}
		}
	}

	// function to update shuffing in case of keyboard navigation
	function exchangeValue(selected_opt, removeclass) {
		if (removeclass != undefined) {
			if (selected_opt.getAttribute("id") != removeclass.getAttribute("id")) {
				AH.selectAll('.copied', 'removeClass', 'copied');

				//preview_data.user_ans_xml = [];
				$$invalidate(1, preview_data.userAns = '', preview_data);

				let idofselectedopt = selected_opt.getAttribute("data-optid"),
					idofremoveddiv = removeclass.getAttribute("data-optid");

				$$invalidate(
					1,
					[
						preview_data.user_ans_xml[idofselectedopt].value,
						preview_data.user_ans_xml[idofremoveddiv].value
					] = [
						preview_data.user_ans_xml[idofremoveddiv].value,
						preview_data.user_ans_xml[idofselectedopt].value
					],
					preview_data
				);

				let aHolder = document.createElement("div");
				let bHolder = document.createElement("div");
				AH.select('#sortable').replaceChild(aHolder, AH.select(selected_opt));
				AH.select('#sortable').replaceChild(bHolder, AH.select(removeclass));
				AH.select('#sortable').replaceChild(AH.select(removeclass), aHolder);
				AH.select('#sortable').replaceChild(AH.select(selected_opt), bHolder);
				$$invalidate(1, preview_data.correctxmlarray = storeIndexValue(preview_data.correctxmlarray), preview_data);
				console.log('hrllo', preview_data.correctxmlarray);

				AH.selectAll('#sortable li').forEach((value, i) => {
					$$invalidate(
						1,
						preview_data.userAns += (i != 0
						? ('\n').concat(preview_data.correctxmlarray[i].ischecked ? '!' : '')
						: preview_data.correctxmlarray[i].ischecked ? '!' : '') + (AH.select("#" + value.getAttribute('id')).innerText != ''
						? AH.select("#" + value.getAttribute('id')).innerText
						: AH.find("#" + value.getAttribute('id'), 'img').getAttribute('img_val')),
						preview_data
					);
				});

				if (window.inNative) {
					window.getHeight && window.getHeight();
				}
			}
		}

		updateOnSorting();
	}

	const writable_props = ['xml', 'uxml', 'showAns', 'isReview', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ChooseMultiGridPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(10, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(11, uxml = $$props.uxml);
		if ('showAns' in $$props) $$invalidate(12, showAns = $$props.showAns);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(13, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		onMount,
		afterUpdate,
		l,
		ItemHelper,
		Sortable,
		XMLToJSON,
		AH,
		onUserAnsChange,
		xml,
		uxml,
		showAns,
		isReview,
		editorState,
		targetView,
		showcorrectanswer,
		box_width,
		corr_ans_count,
		preview_data,
		state,
		updateOnSorting,
		loadModule,
		parseXMLPreview,
		datatopush,
		storeCorrectXYValue,
		makeshuffle,
		shuffle,
		shuffleArray,
		storeIndexValue,
		setReview,
		unsetReview,
		handleReviewMode,
		checkAns,
		displayAns,
		hotkeysAda,
		exchangeValue
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(10, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(11, uxml = $$props.uxml);
		if ('showAns' in $$props) $$invalidate(12, showAns = $$props.showAns);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(13, editorState = $$props.editorState);
		if ('targetView' in $$props) $$invalidate(3, targetView = $$props.targetView);
		if ('showcorrectanswer' in $$props) $$invalidate(4, showcorrectanswer = $$props.showcorrectanswer);
		if ('box_width' in $$props) $$invalidate(5, box_width = $$props.box_width);
		if ('corr_ans_count' in $$props) corr_ans_count = $$props.corr_ans_count;
		if ('preview_data' in $$props) $$invalidate(1, preview_data = $$props.preview_data);
		if ('state' in $$props) $$invalidate(2, state = $$props.state);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isReview*/ 1) {
			 {
				if (isReview) {
					$$invalidate(3, targetView = "block");
					setReview();
				} else {
					$$invalidate(3, targetView = "none");
				}
			}
		}

		if ($$self.$$.dirty & /*xml, state, preview_data, uxml*/ 3078) {
			 {
				if (xml != state.xml) {
					$$invalidate(1, preview_data.isShuffeled = false, preview_data);
					$$invalidate(2, state.showlabelofshuffle = 'block', state);

					if (preview_data.user_ans_xml.length > 0) {
						$$invalidate(1, preview_data.user_ans_xml.length = 0, preview_data);
					}

					$$invalidate(2, state.isanyheading = false, state);

					if (uxml) {
						let tempxml = XMLToJSON(xml);
						$$invalidate(1, preview_data.user_ans_xml = uxml, preview_data);
						$$invalidate(10, xml = preview_data.user_ans_xml);
						console.log(uxml, 'j');
					}

					// update the value of state 'xml'
					$$invalidate(2, state.xml = xml, state);

					// updates the value of sliders elements and load the module
					loadModule(xml);

					$$invalidate(5, box_width = (632 / preview_data.countcol).toFixed(2) + 'px');
				}
			}
		}
	};

	return [
		isReview,
		preview_data,
		state,
		targetView,
		showcorrectanswer,
		box_width,
		setReview,
		unsetReview,
		handleReviewMode,
		hotkeysAda,
		xml,
		uxml,
		showAns,
		editorState
	];
}

class ChooseMultiGridPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			xml: 10,
			uxml: 11,
			showAns: 12,
			isReview: 0,
			editorState: 13
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChooseMultiGridPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[10] === undefined && !('xml' in props)) {
			console_1.warn("<ChooseMultiGridPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[11] === undefined && !('uxml' in props)) {
			console_1.warn("<ChooseMultiGridPreview> was created without expected prop 'uxml'");
		}

		if (/*showAns*/ ctx[12] === undefined && !('showAns' in props)) {
			console_1.warn("<ChooseMultiGridPreview> was created without expected prop 'showAns'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<ChooseMultiGridPreview> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[13] === undefined && !('editorState' in props)) {
			console_1.warn("<ChooseMultiGridPreview> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ChooseMultiGridPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ChooseMultiGridPreview;
//# sourceMappingURL=ChooseMultiGridPreview-2c11a8c8.js.map
