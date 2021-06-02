
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*!
     * jQuery JavaScript Library v3.5.1
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2020-05-04T22:49Z
     */

    var jquery = createCommonjsModule(function (module) {
    ( function( global, factory ) {

    	{

    		// For CommonJS and CommonJS-like environments where a proper `window`
    		// is present, execute the factory and get jQuery.
    		// For environments that do not have a `window` with a `document`
    		// (such as Node.js), expose a factory as module.exports.
    		// This accentuates the need for the creation of a real `window`.
    		// e.g. var jQuery = require("jquery")(window);
    		// See ticket #14549 for more info.
    		module.exports = global.document ?
    			factory( global, true ) :
    			function( w ) {
    				if ( !w.document ) {
    					throw new Error( "jQuery requires a window with a document" );
    				}
    				return factory( w );
    			};
    	}

    // Pass this if window is not defined yet
    } )( typeof window !== "undefined" ? window : commonjsGlobal, function( window, noGlobal ) {

    var arr = [];

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var flat = arr.flat ? function( array ) {
    	return arr.flat.call( array );
    } : function( array ) {
    	return arr.concat.apply( [], array );
    };


    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;

    var ObjectFunctionString = fnToString.call( Object );

    var support = {};

    var isFunction = function isFunction( obj ) {

          // Support: Chrome <=57, Firefox <=52
          // In some browsers, typeof returns "function" for HTML <object> elements
          // (i.e., `typeof document.createElement( "object" ) === "function"`).
          // We don't want to classify *any* DOM node as a function.
          return typeof obj === "function" && typeof obj.nodeType !== "number";
      };


    var isWindow = function isWindow( obj ) {
    		return obj != null && obj === obj.window;
    	};


    var document = window.document;



    	var preservedScriptAttributes = {
    		type: true,
    		src: true,
    		nonce: true,
    		noModule: true
    	};

    	function DOMEval( code, node, doc ) {
    		doc = doc || document;

    		var i, val,
    			script = doc.createElement( "script" );

    		script.text = code;
    		if ( node ) {
    			for ( i in preservedScriptAttributes ) {

    				// Support: Firefox 64+, Edge 18+
    				// Some browsers don't support the "nonce" property on scripts.
    				// On the other hand, just using `getAttribute` is not enough as
    				// the `nonce` attribute is reset to an empty string whenever it
    				// becomes browsing-context connected.
    				// See https://github.com/whatwg/html/issues/2369
    				// See https://html.spec.whatwg.org/#nonce-attributes
    				// The `node.getAttribute` check was added for the sake of
    				// `jQuery.globalEval` so that it can fake a nonce-containing node
    				// via an object.
    				val = node[ i ] || node.getAttribute && node.getAttribute( i );
    				if ( val ) {
    					script.setAttribute( i, val );
    				}
    			}
    		}
    		doc.head.appendChild( script ).parentNode.removeChild( script );
    	}


    function toType( obj ) {
    	if ( obj == null ) {
    		return obj + "";
    	}

    	// Support: Android <=2.3 only (functionish RegExp)
    	return typeof obj === "object" || typeof obj === "function" ?
    		class2type[ toString.call( obj ) ] || "object" :
    		typeof obj;
    }
    /* global Symbol */
    // Defining this global in .eslintrc.json would create a danger of using the global
    // unguarded in another place, it seems safer to define global only for this module



    var
    	version = "3.5.1",

    	// Define a local copy of jQuery
    	jQuery = function( selector, context ) {

    		// The jQuery object is actually just the init constructor 'enhanced'
    		// Need init if jQuery is called (just allow error to be thrown if not included)
    		return new jQuery.fn.init( selector, context );
    	};

    jQuery.fn = jQuery.prototype = {

    	// The current version of jQuery being used
    	jquery: version,

    	constructor: jQuery,

    	// The default length of a jQuery object is 0
    	length: 0,

    	toArray: function() {
    		return slice.call( this );
    	},

    	// Get the Nth element in the matched element set OR
    	// Get the whole matched element set as a clean array
    	get: function( num ) {

    		// Return all the elements in a clean array
    		if ( num == null ) {
    			return slice.call( this );
    		}

    		// Return just the one element from the set
    		return num < 0 ? this[ num + this.length ] : this[ num ];
    	},

    	// Take an array of elements and push it onto the stack
    	// (returning the new matched element set)
    	pushStack: function( elems ) {

    		// Build a new jQuery matched element set
    		var ret = jQuery.merge( this.constructor(), elems );

    		// Add the old object onto the stack (as a reference)
    		ret.prevObject = this;

    		// Return the newly-formed element set
    		return ret;
    	},

    	// Execute a callback for every element in the matched set.
    	each: function( callback ) {
    		return jQuery.each( this, callback );
    	},

    	map: function( callback ) {
    		return this.pushStack( jQuery.map( this, function( elem, i ) {
    			return callback.call( elem, i, elem );
    		} ) );
    	},

    	slice: function() {
    		return this.pushStack( slice.apply( this, arguments ) );
    	},

    	first: function() {
    		return this.eq( 0 );
    	},

    	last: function() {
    		return this.eq( -1 );
    	},

    	even: function() {
    		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    			return ( i + 1 ) % 2;
    		} ) );
    	},

    	odd: function() {
    		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    			return i % 2;
    		} ) );
    	},

    	eq: function( i ) {
    		var len = this.length,
    			j = +i + ( i < 0 ? len : 0 );
    		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
    	},

    	end: function() {
    		return this.prevObject || this.constructor();
    	},

    	// For internal use only.
    	// Behaves like an Array's method, not like a jQuery method.
    	push: push,
    	sort: arr.sort,
    	splice: arr.splice
    };

    jQuery.extend = jQuery.fn.extend = function() {
    	var options, name, src, copy, copyIsArray, clone,
    		target = arguments[ 0 ] || {},
    		i = 1,
    		length = arguments.length,
    		deep = false;

    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;

    		// Skip the boolean and the target
    		target = arguments[ i ] || {};
    		i++;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !isFunction( target ) ) {
    		target = {};
    	}

    	// Extend jQuery itself if only one argument is passed
    	if ( i === length ) {
    		target = this;
    		i--;
    	}

    	for ( ; i < length; i++ ) {

    		// Only deal with non-null/undefined values
    		if ( ( options = arguments[ i ] ) != null ) {

    			// Extend the base object
    			for ( name in options ) {
    				copy = options[ name ];

    				// Prevent Object.prototype pollution
    				// Prevent never-ending loop
    				if ( name === "__proto__" || target === copy ) {
    					continue;
    				}

    				// Recurse if we're merging plain objects or arrays
    				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
    					( copyIsArray = Array.isArray( copy ) ) ) ) {
    					src = target[ name ];

    					// Ensure proper type for the source value
    					if ( copyIsArray && !Array.isArray( src ) ) {
    						clone = [];
    					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
    						clone = {};
    					} else {
    						clone = src;
    					}
    					copyIsArray = false;

    					// Never move original objects, clone them
    					target[ name ] = jQuery.extend( deep, clone, copy );

    				// Don't bring in undefined values
    				} else if ( copy !== undefined ) {
    					target[ name ] = copy;
    				}
    			}
    		}
    	}

    	// Return the modified object
    	return target;
    };

    jQuery.extend( {

    	// Unique for each copy of jQuery on the page
    	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

    	// Assume jQuery is ready without the ready module
    	isReady: true,

    	error: function( msg ) {
    		throw new Error( msg );
    	},

    	noop: function() {},

    	isPlainObject: function( obj ) {
    		var proto, Ctor;

    		// Detect obvious negatives
    		// Use toString instead of jQuery.type to catch host objects
    		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    			return false;
    		}

    		proto = getProto( obj );

    		// Objects with no prototype (e.g., `Object.create( null )`) are plain
    		if ( !proto ) {
    			return true;
    		}

    		// Objects with prototype are plain iff they were constructed by a global Object function
    		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
    	},

    	isEmptyObject: function( obj ) {
    		var name;

    		for ( name in obj ) {
    			return false;
    		}
    		return true;
    	},

    	// Evaluates a script in a provided context; falls back to the global one
    	// if not specified.
    	globalEval: function( code, options, doc ) {
    		DOMEval( code, { nonce: options && options.nonce }, doc );
    	},

    	each: function( obj, callback ) {
    		var length, i = 0;

    		if ( isArrayLike( obj ) ) {
    			length = obj.length;
    			for ( ; i < length; i++ ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		} else {
    			for ( i in obj ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		}

    		return obj;
    	},

    	// results is for internal usage only
    	makeArray: function( arr, results ) {
    		var ret = results || [];

    		if ( arr != null ) {
    			if ( isArrayLike( Object( arr ) ) ) {
    				jQuery.merge( ret,
    					typeof arr === "string" ?
    					[ arr ] : arr
    				);
    			} else {
    				push.call( ret, arr );
    			}
    		}

    		return ret;
    	},

    	inArray: function( elem, arr, i ) {
    		return arr == null ? -1 : indexOf.call( arr, elem, i );
    	},

    	// Support: Android <=4.0 only, PhantomJS 1 only
    	// push.apply(_, arraylike) throws on ancient WebKit
    	merge: function( first, second ) {
    		var len = +second.length,
    			j = 0,
    			i = first.length;

    		for ( ; j < len; j++ ) {
    			first[ i++ ] = second[ j ];
    		}

    		first.length = i;

    		return first;
    	},

    	grep: function( elems, callback, invert ) {
    		var callbackInverse,
    			matches = [],
    			i = 0,
    			length = elems.length,
    			callbackExpect = !invert;

    		// Go through the array, only saving the items
    		// that pass the validator function
    		for ( ; i < length; i++ ) {
    			callbackInverse = !callback( elems[ i ], i );
    			if ( callbackInverse !== callbackExpect ) {
    				matches.push( elems[ i ] );
    			}
    		}

    		return matches;
    	},

    	// arg is for internal usage only
    	map: function( elems, callback, arg ) {
    		var length, value,
    			i = 0,
    			ret = [];

    		// Go through the array, translating each of the items to their new values
    		if ( isArrayLike( elems ) ) {
    			length = elems.length;
    			for ( ; i < length; i++ ) {
    				value = callback( elems[ i ], i, arg );

    				if ( value != null ) {
    					ret.push( value );
    				}
    			}

    		// Go through every key on the object,
    		} else {
    			for ( i in elems ) {
    				value = callback( elems[ i ], i, arg );

    				if ( value != null ) {
    					ret.push( value );
    				}
    			}
    		}

    		// Flatten any nested arrays
    		return flat( ret );
    	},

    	// A global GUID counter for objects
    	guid: 1,

    	// jQuery.support is not used in Core but other projects attach their
    	// properties to it so it needs to exist.
    	support: support
    } );

    if ( typeof Symbol === "function" ) {
    	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
    }

    // Populate the class2type map
    jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
    function( _i, name ) {
    	class2type[ "[object " + name + "]" ] = name.toLowerCase();
    } );

    function isArrayLike( obj ) {

    	// Support: real iOS 8.2 only (not reproducible in simulator)
    	// `in` check used to prevent JIT error (gh-2145)
    	// hasOwn isn't used here due to false negatives
    	// regarding Nodelist length in IE
    	var length = !!obj && "length" in obj && obj.length,
    		type = toType( obj );

    	if ( isFunction( obj ) || isWindow( obj ) ) {
    		return false;
    	}

    	return type === "array" || length === 0 ||
    		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }
    var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.3.5
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://js.foundation/
     *
     * Date: 2020-03-14
     */
    ( function( window ) {
    var i,
    	support,
    	Expr,
    	getText,
    	isXML,
    	tokenize,
    	compile,
    	select,
    	outermostContext,
    	sortInput,
    	hasDuplicate,

    	// Local document vars
    	setDocument,
    	document,
    	docElem,
    	documentIsHTML,
    	rbuggyQSA,
    	rbuggyMatches,
    	matches,
    	contains,

    	// Instance-specific data
    	expando = "sizzle" + 1 * new Date(),
    	preferredDoc = window.document,
    	dirruns = 0,
    	done = 0,
    	classCache = createCache(),
    	tokenCache = createCache(),
    	compilerCache = createCache(),
    	nonnativeSelectorCache = createCache(),
    	sortOrder = function( a, b ) {
    		if ( a === b ) {
    			hasDuplicate = true;
    		}
    		return 0;
    	},

    	// Instance methods
    	hasOwn = ( {} ).hasOwnProperty,
    	arr = [],
    	pop = arr.pop,
    	pushNative = arr.push,
    	push = arr.push,
    	slice = arr.slice,

    	// Use a stripped-down indexOf as it's faster than native
    	// https://jsperf.com/thor-indexof-vs-for/5
    	indexOf = function( list, elem ) {
    		var i = 0,
    			len = list.length;
    		for ( ; i < len; i++ ) {
    			if ( list[ i ] === elem ) {
    				return i;
    			}
    		}
    		return -1;
    	},

    	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
    		"ismap|loop|multiple|open|readonly|required|scoped",

    	// Regular expressions

    	// http://www.w3.org/TR/css3-selectors/#whitespace
    	whitespace = "[\\x20\\t\\r\\n\\f]",

    	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
    		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

    	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

    		// Operator (capture 2)
    		"*([*^$|!~]?=)" + whitespace +

    		// "Attribute values must be CSS identifiers [capture 5]
    		// or strings [capture 3 or capture 4]"
    		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
    		whitespace + "*\\]",

    	pseudos = ":(" + identifier + ")(?:\\((" +

    		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    		// 1. quoted (capture 3; capture 4 or capture 5)
    		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

    		// 2. simple (capture 6)
    		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

    		// 3. anything else (capture 2)
    		".*" +
    		")\\)|)",

    	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    	rwhitespace = new RegExp( whitespace + "+", "g" ),
    	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
    		whitespace + "+$", "g" ),

    	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
    		"*" ),
    	rdescend = new RegExp( whitespace + "|>" ),

    	rpseudo = new RegExp( pseudos ),
    	ridentifier = new RegExp( "^" + identifier + "$" ),

    	matchExpr = {
    		"ID": new RegExp( "^#(" + identifier + ")" ),
    		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
    		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
    		"ATTR": new RegExp( "^" + attributes ),
    		"PSEUDO": new RegExp( "^" + pseudos ),
    		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
    			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
    			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

    		// For use in libraries implementing .is()
    		// We use this for POS matching in `select`
    		"needsContext": new RegExp( "^" + whitespace +
    			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
    			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    	},

    	rhtml = /HTML$/i,
    	rinputs = /^(?:input|select|textarea|button)$/i,
    	rheader = /^h\d$/i,

    	rnative = /^[^{]+\{\s*\[native \w/,

    	// Easily-parseable/retrievable ID or TAG or CLASS selectors
    	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    	rsibling = /[+~]/,

    	// CSS escapes
    	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
    	funescape = function( escape, nonHex ) {
    		var high = "0x" + escape.slice( 1 ) - 0x10000;

    		return nonHex ?

    			// Strip the backslash prefix from a non-hex escape sequence
    			nonHex :

    			// Replace a hexadecimal escape sequence with the encoded Unicode code point
    			// Support: IE <=11+
    			// For values outside the Basic Multilingual Plane (BMP), manually construct a
    			// surrogate pair
    			high < 0 ?
    				String.fromCharCode( high + 0x10000 ) :
    				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    	},

    	// CSS string/identifier serialization
    	// https://drafts.csswg.org/cssom/#common-serializing-idioms
    	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
    	fcssescape = function( ch, asCodePoint ) {
    		if ( asCodePoint ) {

    			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
    			if ( ch === "\0" ) {
    				return "\uFFFD";
    			}

    			// Control characters and (dependent upon position) numbers get escaped as code points
    			return ch.slice( 0, -1 ) + "\\" +
    				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
    		}

    		// Other potentially-special ASCII characters get backslash-escaped
    		return "\\" + ch;
    	},

    	// Used for iframes
    	// See setDocument()
    	// Removing the function wrapper causes a "Permission Denied"
    	// error in IE
    	unloadHandler = function() {
    		setDocument();
    	},

    	inDisabledFieldset = addCombinator(
    		function( elem ) {
    			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
    		},
    		{ dir: "parentNode", next: "legend" }
    	);

    // Optimize for push.apply( _, NodeList )
    try {
    	push.apply(
    		( arr = slice.call( preferredDoc.childNodes ) ),
    		preferredDoc.childNodes
    	);

    	// Support: Android<4.0
    	// Detect silently failing push.apply
    	// eslint-disable-next-line no-unused-expressions
    	arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
    	push = { apply: arr.length ?

    		// Leverage slice if possible
    		function( target, els ) {
    			pushNative.apply( target, slice.call( els ) );
    		} :

    		// Support: IE<9
    		// Otherwise append directly
    		function( target, els ) {
    			var j = target.length,
    				i = 0;

    			// Can't trust NodeList.length
    			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
    			target.length = j - 1;
    		}
    	};
    }

    function Sizzle( selector, context, results, seed ) {
    	var m, i, elem, nid, match, groups, newSelector,
    		newContext = context && context.ownerDocument,

    		// nodeType defaults to 9, since context defaults to document
    		nodeType = context ? context.nodeType : 9;

    	results = results || [];

    	// Return early from calls with invalid selector or context
    	if ( typeof selector !== "string" || !selector ||
    		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

    		return results;
    	}

    	// Try to shortcut find operations (as opposed to filters) in HTML documents
    	if ( !seed ) {
    		setDocument( context );
    		context = context || document;

    		if ( documentIsHTML ) {

    			// If the selector is sufficiently simple, try using a "get*By*" DOM method
    			// (excepting DocumentFragment context, where the methods don't exist)
    			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

    				// ID selector
    				if ( ( m = match[ 1 ] ) ) {

    					// Document context
    					if ( nodeType === 9 ) {
    						if ( ( elem = context.getElementById( m ) ) ) {

    							// Support: IE, Opera, Webkit
    							// TODO: identify versions
    							// getElementById can match elements by name instead of ID
    							if ( elem.id === m ) {
    								results.push( elem );
    								return results;
    							}
    						} else {
    							return results;
    						}

    					// Element context
    					} else {

    						// Support: IE, Opera, Webkit
    						// TODO: identify versions
    						// getElementById can match elements by name instead of ID
    						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
    							contains( context, elem ) &&
    							elem.id === m ) {

    							results.push( elem );
    							return results;
    						}
    					}

    				// Type selector
    				} else if ( match[ 2 ] ) {
    					push.apply( results, context.getElementsByTagName( selector ) );
    					return results;

    				// Class selector
    				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
    					context.getElementsByClassName ) {

    					push.apply( results, context.getElementsByClassName( m ) );
    					return results;
    				}
    			}

    			// Take advantage of querySelectorAll
    			if ( support.qsa &&
    				!nonnativeSelectorCache[ selector + " " ] &&
    				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

    				// Support: IE 8 only
    				// Exclude object elements
    				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

    				newSelector = selector;
    				newContext = context;

    				// qSA considers elements outside a scoping root when evaluating child or
    				// descendant combinators, which is not what we want.
    				// In such cases, we work around the behavior by prefixing every selector in the
    				// list with an ID selector referencing the scope context.
    				// The technique has to be used as well when a leading combinator is used
    				// as such selectors are not recognized by querySelectorAll.
    				// Thanks to Andrew Dupont for this technique.
    				if ( nodeType === 1 &&
    					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

    					// Expand context for sibling selectors
    					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
    						context;

    					// We can use :scope instead of the ID hack if the browser
    					// supports it & if we're not changing the context.
    					if ( newContext !== context || !support.scope ) {

    						// Capture the context ID, setting it first if necessary
    						if ( ( nid = context.getAttribute( "id" ) ) ) {
    							nid = nid.replace( rcssescape, fcssescape );
    						} else {
    							context.setAttribute( "id", ( nid = expando ) );
    						}
    					}

    					// Prefix every selector in the list
    					groups = tokenize( selector );
    					i = groups.length;
    					while ( i-- ) {
    						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
    							toSelector( groups[ i ] );
    					}
    					newSelector = groups.join( "," );
    				}

    				try {
    					push.apply( results,
    						newContext.querySelectorAll( newSelector )
    					);
    					return results;
    				} catch ( qsaError ) {
    					nonnativeSelectorCache( selector, true );
    				} finally {
    					if ( nid === expando ) {
    						context.removeAttribute( "id" );
    					}
    				}
    			}
    		}
    	}

    	// All others
    	return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }

    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
    	var keys = [];

    	function cache( key, value ) {

    		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    		if ( keys.push( key + " " ) > Expr.cacheLength ) {

    			// Only keep the most recent entries
    			delete cache[ keys.shift() ];
    		}
    		return ( cache[ key + " " ] = value );
    	}
    	return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
    	fn[ expando ] = true;
    	return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created element and returns a boolean result
     */
    function assert( fn ) {
    	var el = document.createElement( "fieldset" );

    	try {
    		return !!fn( el );
    	} catch ( e ) {
    		return false;
    	} finally {

    		// Remove from its parent by default
    		if ( el.parentNode ) {
    			el.parentNode.removeChild( el );
    		}

    		// release memory in IE
    		el = null;
    	}
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
    	var arr = attrs.split( "|" ),
    		i = arr.length;

    	while ( i-- ) {
    		Expr.attrHandle[ arr[ i ] ] = handler;
    	}
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
    	var cur = b && a,
    		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
    			a.sourceIndex - b.sourceIndex;

    	// Use IE sourceIndex if available on both nodes
    	if ( diff ) {
    		return diff;
    	}

    	// Check if b follows a
    	if ( cur ) {
    		while ( ( cur = cur.nextSibling ) ) {
    			if ( cur === b ) {
    				return -1;
    			}
    		}
    	}

    	return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return name === "input" && elem.type === type;
    	};
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return ( name === "input" || name === "button" ) && elem.type === type;
    	};
    }

    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param {Boolean} disabled true for :disabled; false for :enabled
     */
    function createDisabledPseudo( disabled ) {

    	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
    	return function( elem ) {

    		// Only certain elements can match :enabled or :disabled
    		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
    		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
    		if ( "form" in elem ) {

    			// Check for inherited disabledness on relevant non-disabled elements:
    			// * listed form-associated elements in a disabled fieldset
    			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
    			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
    			// * option elements in a disabled optgroup
    			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
    			// All such elements have a "form" property.
    			if ( elem.parentNode && elem.disabled === false ) {

    				// Option elements defer to a parent optgroup if present
    				if ( "label" in elem ) {
    					if ( "label" in elem.parentNode ) {
    						return elem.parentNode.disabled === disabled;
    					} else {
    						return elem.disabled === disabled;
    					}
    				}

    				// Support: IE 6 - 11
    				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
    				return elem.isDisabled === disabled ||

    					// Where there is no isDisabled, check manually
    					/* jshint -W018 */
    					elem.isDisabled !== !disabled &&
    					inDisabledFieldset( elem ) === disabled;
    			}

    			return elem.disabled === disabled;

    		// Try to winnow out elements that can't be disabled before trusting the disabled property.
    		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
    		// even exist on them, let alone have a boolean value.
    		} else if ( "label" in elem ) {
    			return elem.disabled === disabled;
    		}

    		// Remaining elements are neither :enabled nor :disabled
    		return false;
    	};
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
    	return markFunction( function( argument ) {
    		argument = +argument;
    		return markFunction( function( seed, matches ) {
    			var j,
    				matchIndexes = fn( [], seed.length, argument ),
    				i = matchIndexes.length;

    			// Match elements found at the specified indexes
    			while ( i-- ) {
    				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
    					seed[ j ] = !( matches[ j ] = seed[ j ] );
    				}
    			}
    		} );
    	} );
    }

    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext( context ) {
    	return context && typeof context.getElementsByTagName !== "undefined" && context;
    }

    // Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function( elem ) {
    	var namespace = elem.namespaceURI,
    		docElem = ( elem.ownerDocument || elem ).documentElement;

    	// Support: IE <=8
    	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
    	// https://bugs.jquery.com/ticket/4833
    	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
    	var hasCompare, subWindow,
    		doc = node ? node.ownerDocument || node : preferredDoc;

    	// Return early if doc is invalid or already selected
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
    		return document;
    	}

    	// Update global variables
    	document = doc;
    	docElem = document.documentElement;
    	documentIsHTML = !isXML( document );

    	// Support: IE 9 - 11+, Edge 12 - 18+
    	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( preferredDoc != document &&
    		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

    		// Support: IE 11, Edge
    		if ( subWindow.addEventListener ) {
    			subWindow.addEventListener( "unload", unloadHandler, false );

    		// Support: IE 9 - 10 only
    		} else if ( subWindow.attachEvent ) {
    			subWindow.attachEvent( "onunload", unloadHandler );
    		}
    	}

    	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
    	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
    	// IE/Edge & older browsers don't support the :scope pseudo-class.
    	// Support: Safari 6.0 only
    	// Safari 6.0 supports :scope but it's an alias of :root there.
    	support.scope = assert( function( el ) {
    		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
    		return typeof el.querySelectorAll !== "undefined" &&
    			!el.querySelectorAll( ":scope fieldset div" ).length;
    	} );

    	/* Attributes
    	---------------------------------------------------------------------- */

    	// Support: IE<8
    	// Verify that getAttribute really returns attributes and not properties
    	// (excepting IE8 booleans)
    	support.attributes = assert( function( el ) {
    		el.className = "i";
    		return !el.getAttribute( "className" );
    	} );

    	/* getElement(s)By*
    	---------------------------------------------------------------------- */

    	// Check if getElementsByTagName("*") returns only elements
    	support.getElementsByTagName = assert( function( el ) {
    		el.appendChild( document.createComment( "" ) );
    		return !el.getElementsByTagName( "*" ).length;
    	} );

    	// Support: IE<9
    	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

    	// Support: IE<10
    	// Check if getElementById returns elements by name
    	// The broken getElementById methods don't pick up programmatically-set names,
    	// so use a roundabout getElementsByName test
    	support.getById = assert( function( el ) {
    		docElem.appendChild( el ).id = expando;
    		return !document.getElementsByName || !document.getElementsByName( expando ).length;
    	} );

    	// ID filter and find
    	if ( support.getById ) {
    		Expr.filter[ "ID" ] = function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				return elem.getAttribute( "id" ) === attrId;
    			};
    		};
    		Expr.find[ "ID" ] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var elem = context.getElementById( id );
    				return elem ? [ elem ] : [];
    			}
    		};
    	} else {
    		Expr.filter[ "ID" ] =  function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				var node = typeof elem.getAttributeNode !== "undefined" &&
    					elem.getAttributeNode( "id" );
    				return node && node.value === attrId;
    			};
    		};

    		// Support: IE 6 - 7 only
    		// getElementById is not reliable as a find shortcut
    		Expr.find[ "ID" ] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var node, i, elems,
    					elem = context.getElementById( id );

    				if ( elem ) {

    					// Verify the id attribute
    					node = elem.getAttributeNode( "id" );
    					if ( node && node.value === id ) {
    						return [ elem ];
    					}

    					// Fall back on getElementsByName
    					elems = context.getElementsByName( id );
    					i = 0;
    					while ( ( elem = elems[ i++ ] ) ) {
    						node = elem.getAttributeNode( "id" );
    						if ( node && node.value === id ) {
    							return [ elem ];
    						}
    					}
    				}

    				return [];
    			}
    		};
    	}

    	// Tag
    	Expr.find[ "TAG" ] = support.getElementsByTagName ?
    		function( tag, context ) {
    			if ( typeof context.getElementsByTagName !== "undefined" ) {
    				return context.getElementsByTagName( tag );

    			// DocumentFragment nodes don't have gEBTN
    			} else if ( support.qsa ) {
    				return context.querySelectorAll( tag );
    			}
    		} :

    		function( tag, context ) {
    			var elem,
    				tmp = [],
    				i = 0,

    				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
    				results = context.getElementsByTagName( tag );

    			// Filter out possible comments
    			if ( tag === "*" ) {
    				while ( ( elem = results[ i++ ] ) ) {
    					if ( elem.nodeType === 1 ) {
    						tmp.push( elem );
    					}
    				}

    				return tmp;
    			}
    			return results;
    		};

    	// Class
    	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
    		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
    			return context.getElementsByClassName( className );
    		}
    	};

    	/* QSA/matchesSelector
    	---------------------------------------------------------------------- */

    	// QSA and matchesSelector support

    	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    	rbuggyMatches = [];

    	// qSa(:focus) reports false when true (Chrome 21)
    	// We allow this because of a bug in IE8/9 that throws an error
    	// whenever `document.activeElement` is accessed on an iframe
    	// So, we allow :focus to pass through QSA all the time to avoid the IE error
    	// See https://bugs.jquery.com/ticket/13378
    	rbuggyQSA = [];

    	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

    		// Build QSA regex
    		// Regex strategy adopted from Diego Perini
    		assert( function( el ) {

    			var input;

    			// Select is set to empty string on purpose
    			// This is to test IE's treatment of not explicitly
    			// setting a boolean content attribute,
    			// since its presence should be enough
    			// https://bugs.jquery.com/ticket/12359
    			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
    				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
    				"<option selected=''></option></select>";

    			// Support: IE8, Opera 11-12.16
    			// Nothing should be selected when empty strings follow ^= or $= or *=
    			// The test attribute must be unknown in Opera but "safe" for WinRT
    			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
    			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
    				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
    			}

    			// Support: IE8
    			// Boolean attributes and "value" are not treated correctly
    			if ( !el.querySelectorAll( "[selected]" ).length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
    			}

    			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
    			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
    				rbuggyQSA.push( "~=" );
    			}

    			// Support: IE 11+, Edge 15 - 18+
    			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
    			// Adding a temporary attribute to the document before the selection works
    			// around the issue.
    			// Interestingly, IE 10 & older don't seem to have the issue.
    			input = document.createElement( "input" );
    			input.setAttribute( "name", "" );
    			el.appendChild( input );
    			if ( !el.querySelectorAll( "[name='']" ).length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
    					whitespace + "*(?:''|\"\")" );
    			}

    			// Webkit/Opera - :checked should return selected option elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			// IE8 throws error here and will not see later tests
    			if ( !el.querySelectorAll( ":checked" ).length ) {
    				rbuggyQSA.push( ":checked" );
    			}

    			// Support: Safari 8+, iOS 8+
    			// https://bugs.webkit.org/show_bug.cgi?id=136851
    			// In-page `selector#id sibling-combinator selector` fails
    			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
    				rbuggyQSA.push( ".#.+[+~]" );
    			}

    			// Support: Firefox <=3.6 - 5 only
    			// Old Firefox doesn't throw on a badly-escaped identifier.
    			el.querySelectorAll( "\\\f" );
    			rbuggyQSA.push( "[\\r\\n\\f]" );
    		} );

    		assert( function( el ) {
    			el.innerHTML = "<a href='' disabled='disabled'></a>" +
    				"<select disabled='disabled'><option/></select>";

    			// Support: Windows 8 Native Apps
    			// The type and name attributes are restricted during .innerHTML assignment
    			var input = document.createElement( "input" );
    			input.setAttribute( "type", "hidden" );
    			el.appendChild( input ).setAttribute( "name", "D" );

    			// Support: IE8
    			// Enforce case-sensitivity of name attribute
    			if ( el.querySelectorAll( "[name=d]" ).length ) {
    				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
    			}

    			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
    			// IE8 throws error here and will not see later tests
    			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}

    			// Support: IE9-11+
    			// IE's :disabled selector does not pick up the children of disabled fieldsets
    			docElem.appendChild( el ).disabled = true;
    			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}

    			// Support: Opera 10 - 11 only
    			// Opera 10-11 does not throw on post-comma invalid pseudos
    			el.querySelectorAll( "*,:x" );
    			rbuggyQSA.push( ",.*:" );
    		} );
    	}

    	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
    		docElem.webkitMatchesSelector ||
    		docElem.mozMatchesSelector ||
    		docElem.oMatchesSelector ||
    		docElem.msMatchesSelector ) ) ) ) {

    		assert( function( el ) {

    			// Check to see if it's possible to do matchesSelector
    			// on a disconnected node (IE 9)
    			support.disconnectedMatch = matches.call( el, "*" );

    			// This should fail with an exception
    			// Gecko does not error, returns false instead
    			matches.call( el, "[s!='']:x" );
    			rbuggyMatches.push( "!=", pseudos );
    		} );
    	}

    	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
    	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

    	/* Contains
    	---------------------------------------------------------------------- */
    	hasCompare = rnative.test( docElem.compareDocumentPosition );

    	// Element contains another
    	// Purposefully self-exclusive
    	// As in, an element does not contain itself
    	contains = hasCompare || rnative.test( docElem.contains ) ?
    		function( a, b ) {
    			var adown = a.nodeType === 9 ? a.documentElement : a,
    				bup = b && b.parentNode;
    			return a === bup || !!( bup && bup.nodeType === 1 && (
    				adown.contains ?
    					adown.contains( bup ) :
    					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
    			) );
    		} :
    		function( a, b ) {
    			if ( b ) {
    				while ( ( b = b.parentNode ) ) {
    					if ( b === a ) {
    						return true;
    					}
    				}
    			}
    			return false;
    		};

    	/* Sorting
    	---------------------------------------------------------------------- */

    	// Document order sorting
    	sortOrder = hasCompare ?
    	function( a, b ) {

    		// Flag for duplicate removal
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}

    		// Sort on method existence if only one input has compareDocumentPosition
    		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    		if ( compare ) {
    			return compare;
    		}

    		// Calculate position if both inputs belong to the same document
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
    			a.compareDocumentPosition( b ) :

    			// Otherwise we know they are disconnected
    			1;

    		// Disconnected nodes
    		if ( compare & 1 ||
    			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

    			// Choose the first element that is related to our preferred document
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			if ( a == document || a.ownerDocument == preferredDoc &&
    				contains( preferredDoc, a ) ) {
    				return -1;
    			}

    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			if ( b == document || b.ownerDocument == preferredDoc &&
    				contains( preferredDoc, b ) ) {
    				return 1;
    			}

    			// Maintain original order
    			return sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;
    		}

    		return compare & 4 ? -1 : 1;
    	} :
    	function( a, b ) {

    		// Exit early if the nodes are identical
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}

    		var cur,
    			i = 0,
    			aup = a.parentNode,
    			bup = b.parentNode,
    			ap = [ a ],
    			bp = [ b ];

    		// Parentless nodes are either documents or disconnected
    		if ( !aup || !bup ) {

    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			/* eslint-disable eqeqeq */
    			return a == document ? -1 :
    				b == document ? 1 :
    				/* eslint-enable eqeqeq */
    				aup ? -1 :
    				bup ? 1 :
    				sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;

    		// If the nodes are siblings, we can do a quick check
    		} else if ( aup === bup ) {
    			return siblingCheck( a, b );
    		}

    		// Otherwise we need full lists of their ancestors for comparison
    		cur = a;
    		while ( ( cur = cur.parentNode ) ) {
    			ap.unshift( cur );
    		}
    		cur = b;
    		while ( ( cur = cur.parentNode ) ) {
    			bp.unshift( cur );
    		}

    		// Walk down the tree looking for a discrepancy
    		while ( ap[ i ] === bp[ i ] ) {
    			i++;
    		}

    		return i ?

    			// Do a sibling check if the nodes have a common ancestor
    			siblingCheck( ap[ i ], bp[ i ] ) :

    			// Otherwise nodes in our document sort first
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			/* eslint-disable eqeqeq */
    			ap[ i ] == preferredDoc ? -1 :
    			bp[ i ] == preferredDoc ? 1 :
    			/* eslint-enable eqeqeq */
    			0;
    	};

    	return document;
    };

    Sizzle.matches = function( expr, elements ) {
    	return Sizzle( expr, null, null, elements );
    };

    Sizzle.matchesSelector = function( elem, expr ) {
    	setDocument( elem );

    	if ( support.matchesSelector && documentIsHTML &&
    		!nonnativeSelectorCache[ expr + " " ] &&
    		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
    		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

    		try {
    			var ret = matches.call( elem, expr );

    			// IE 9's matchesSelector returns false on disconnected nodes
    			if ( ret || support.disconnectedMatch ||

    				// As well, disconnected nodes are said to be in a document
    				// fragment in IE 9
    				elem.document && elem.document.nodeType !== 11 ) {
    				return ret;
    			}
    		} catch ( e ) {
    			nonnativeSelectorCache( expr, true );
    		}
    	}

    	return Sizzle( expr, document, null, [ elem ] ).length > 0;
    };

    Sizzle.contains = function( context, elem ) {

    	// Set document vars if needed
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( ( context.ownerDocument || context ) != document ) {
    		setDocument( context );
    	}
    	return contains( context, elem );
    };

    Sizzle.attr = function( elem, name ) {

    	// Set document vars if needed
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( ( elem.ownerDocument || elem ) != document ) {
    		setDocument( elem );
    	}

    	var fn = Expr.attrHandle[ name.toLowerCase() ],

    		// Don't get fooled by Object.prototype properties (jQuery #13807)
    		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
    			fn( elem, name, !documentIsHTML ) :
    			undefined;

    	return val !== undefined ?
    		val :
    		support.attributes || !documentIsHTML ?
    			elem.getAttribute( name ) :
    			( val = elem.getAttributeNode( name ) ) && val.specified ?
    				val.value :
    				null;
    };

    Sizzle.escape = function( sel ) {
    	return ( sel + "" ).replace( rcssescape, fcssescape );
    };

    Sizzle.error = function( msg ) {
    	throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
    	var elem,
    		duplicates = [],
    		j = 0,
    		i = 0;

    	// Unless we *know* we can detect duplicates, assume their presence
    	hasDuplicate = !support.detectDuplicates;
    	sortInput = !support.sortStable && results.slice( 0 );
    	results.sort( sortOrder );

    	if ( hasDuplicate ) {
    		while ( ( elem = results[ i++ ] ) ) {
    			if ( elem === results[ i ] ) {
    				j = duplicates.push( i );
    			}
    		}
    		while ( j-- ) {
    			results.splice( duplicates[ j ], 1 );
    		}
    	}

    	// Clear input after sorting to release objects
    	// See https://github.com/jquery/sizzle/pull/225
    	sortInput = null;

    	return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
    	var node,
    		ret = "",
    		i = 0,
    		nodeType = elem.nodeType;

    	if ( !nodeType ) {

    		// If no nodeType, this is expected to be an array
    		while ( ( node = elem[ i++ ] ) ) {

    			// Do not traverse comment nodes
    			ret += getText( node );
    		}
    	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

    		// Use textContent for elements
    		// innerText usage removed for consistency of new lines (jQuery #11153)
    		if ( typeof elem.textContent === "string" ) {
    			return elem.textContent;
    		} else {

    			// Traverse its children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				ret += getText( elem );
    			}
    		}
    	} else if ( nodeType === 3 || nodeType === 4 ) {
    		return elem.nodeValue;
    	}

    	// Do not include comment or processing instruction nodes

    	return ret;
    };

    Expr = Sizzle.selectors = {

    	// Can be adjusted by the user
    	cacheLength: 50,

    	createPseudo: markFunction,

    	match: matchExpr,

    	attrHandle: {},

    	find: {},

    	relative: {
    		">": { dir: "parentNode", first: true },
    		" ": { dir: "parentNode" },
    		"+": { dir: "previousSibling", first: true },
    		"~": { dir: "previousSibling" }
    	},

    	preFilter: {
    		"ATTR": function( match ) {
    			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

    			// Move the given value to match[3] whether quoted or unquoted
    			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
    				match[ 5 ] || "" ).replace( runescape, funescape );

    			if ( match[ 2 ] === "~=" ) {
    				match[ 3 ] = " " + match[ 3 ] + " ";
    			}

    			return match.slice( 0, 4 );
    		},

    		"CHILD": function( match ) {

    			/* matches from matchExpr["CHILD"]
    				1 type (only|nth|...)
    				2 what (child|of-type)
    				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    				4 xn-component of xn+y argument ([+-]?\d*n|)
    				5 sign of xn-component
    				6 x of xn-component
    				7 sign of y-component
    				8 y of y-component
    			*/
    			match[ 1 ] = match[ 1 ].toLowerCase();

    			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

    				// nth-* requires argument
    				if ( !match[ 3 ] ) {
    					Sizzle.error( match[ 0 ] );
    				}

    				// numeric x and y parameters for Expr.filter.CHILD
    				// remember that false/true cast respectively to 0/1
    				match[ 4 ] = +( match[ 4 ] ?
    					match[ 5 ] + ( match[ 6 ] || 1 ) :
    					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
    				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

    				// other types prohibit arguments
    			} else if ( match[ 3 ] ) {
    				Sizzle.error( match[ 0 ] );
    			}

    			return match;
    		},

    		"PSEUDO": function( match ) {
    			var excess,
    				unquoted = !match[ 6 ] && match[ 2 ];

    			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
    				return null;
    			}

    			// Accept quoted arguments as-is
    			if ( match[ 3 ] ) {
    				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

    			// Strip excess characters from unquoted arguments
    			} else if ( unquoted && rpseudo.test( unquoted ) &&

    				// Get excess from tokenize (recursively)
    				( excess = tokenize( unquoted, true ) ) &&

    				// advance to the next closing parenthesis
    				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

    				// excess is a negative index
    				match[ 0 ] = match[ 0 ].slice( 0, excess );
    				match[ 2 ] = unquoted.slice( 0, excess );
    			}

    			// Return only captures needed by the pseudo filter method (type and argument)
    			return match.slice( 0, 3 );
    		}
    	},

    	filter: {

    		"TAG": function( nodeNameSelector ) {
    			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
    			return nodeNameSelector === "*" ?
    				function() {
    					return true;
    				} :
    				function( elem ) {
    					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
    				};
    		},

    		"CLASS": function( className ) {
    			var pattern = classCache[ className + " " ];

    			return pattern ||
    				( pattern = new RegExp( "(^|" + whitespace +
    					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
    						className, function( elem ) {
    							return pattern.test(
    								typeof elem.className === "string" && elem.className ||
    								typeof elem.getAttribute !== "undefined" &&
    									elem.getAttribute( "class" ) ||
    								""
    							);
    				} );
    		},

    		"ATTR": function( name, operator, check ) {
    			return function( elem ) {
    				var result = Sizzle.attr( elem, name );

    				if ( result == null ) {
    					return operator === "!=";
    				}
    				if ( !operator ) {
    					return true;
    				}

    				result += "";

    				/* eslint-disable max-len */

    				return operator === "=" ? result === check :
    					operator === "!=" ? result !== check :
    					operator === "^=" ? check && result.indexOf( check ) === 0 :
    					operator === "*=" ? check && result.indexOf( check ) > -1 :
    					operator === "$=" ? check && result.slice( -check.length ) === check :
    					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
    					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
    					false;
    				/* eslint-enable max-len */

    			};
    		},

    		"CHILD": function( type, what, _argument, first, last ) {
    			var simple = type.slice( 0, 3 ) !== "nth",
    				forward = type.slice( -4 ) !== "last",
    				ofType = what === "of-type";

    			return first === 1 && last === 0 ?

    				// Shortcut for :nth-*(n)
    				function( elem ) {
    					return !!elem.parentNode;
    				} :

    				function( elem, _context, xml ) {
    					var cache, uniqueCache, outerCache, node, nodeIndex, start,
    						dir = simple !== forward ? "nextSibling" : "previousSibling",
    						parent = elem.parentNode,
    						name = ofType && elem.nodeName.toLowerCase(),
    						useCache = !xml && !ofType,
    						diff = false;

    					if ( parent ) {

    						// :(first|last|only)-(child|of-type)
    						if ( simple ) {
    							while ( dir ) {
    								node = elem;
    								while ( ( node = node[ dir ] ) ) {
    									if ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) {

    										return false;
    									}
    								}

    								// Reverse direction for :only-* (if we haven't yet done so)
    								start = dir = type === "only" && !start && "nextSibling";
    							}
    							return true;
    						}

    						start = [ forward ? parent.firstChild : parent.lastChild ];

    						// non-xml :nth-child(...) stores cache data on `parent`
    						if ( forward && useCache ) {

    							// Seek `elem` from a previously-cached index

    							// ...in a gzip-friendly way
    							node = parent;
    							outerCache = node[ expando ] || ( node[ expando ] = {} );

    							// Support: IE <9 only
    							// Defend against cloned attroperties (jQuery gh-1709)
    							uniqueCache = outerCache[ node.uniqueID ] ||
    								( outerCache[ node.uniqueID ] = {} );

    							cache = uniqueCache[ type ] || [];
    							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    							diff = nodeIndex && cache[ 2 ];
    							node = nodeIndex && parent.childNodes[ nodeIndex ];

    							while ( ( node = ++nodeIndex && node && node[ dir ] ||

    								// Fallback to seeking `elem` from the start
    								( diff = nodeIndex = 0 ) || start.pop() ) ) {

    								// When found, cache indexes on `parent` and break
    								if ( node.nodeType === 1 && ++diff && node === elem ) {
    									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
    									break;
    								}
    							}

    						} else {

    							// Use previously-cached element index if available
    							if ( useCache ) {

    								// ...in a gzip-friendly way
    								node = elem;
    								outerCache = node[ expando ] || ( node[ expando ] = {} );

    								// Support: IE <9 only
    								// Defend against cloned attroperties (jQuery gh-1709)
    								uniqueCache = outerCache[ node.uniqueID ] ||
    									( outerCache[ node.uniqueID ] = {} );

    								cache = uniqueCache[ type ] || [];
    								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    								diff = nodeIndex;
    							}

    							// xml :nth-child(...)
    							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
    							if ( diff === false ) {

    								// Use the same loop as above to seek `elem` from the start
    								while ( ( node = ++nodeIndex && node && node[ dir ] ||
    									( diff = nodeIndex = 0 ) || start.pop() ) ) {

    									if ( ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) &&
    										++diff ) {

    										// Cache the index of each encountered element
    										if ( useCache ) {
    											outerCache = node[ expando ] ||
    												( node[ expando ] = {} );

    											// Support: IE <9 only
    											// Defend against cloned attroperties (jQuery gh-1709)
    											uniqueCache = outerCache[ node.uniqueID ] ||
    												( outerCache[ node.uniqueID ] = {} );

    											uniqueCache[ type ] = [ dirruns, diff ];
    										}

    										if ( node === elem ) {
    											break;
    										}
    									}
    								}
    							}
    						}

    						// Incorporate the offset, then check against cycle size
    						diff -= last;
    						return diff === first || ( diff % first === 0 && diff / first >= 0 );
    					}
    				};
    		},

    		"PSEUDO": function( pseudo, argument ) {

    			// pseudo-class names are case-insensitive
    			// http://www.w3.org/TR/selectors/#pseudo-classes
    			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
    			// Remember that setFilters inherits from pseudos
    			var args,
    				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
    					Sizzle.error( "unsupported pseudo: " + pseudo );

    			// The user may use createPseudo to indicate that
    			// arguments are needed to create the filter function
    			// just as Sizzle does
    			if ( fn[ expando ] ) {
    				return fn( argument );
    			}

    			// But maintain support for old signatures
    			if ( fn.length > 1 ) {
    				args = [ pseudo, pseudo, "", argument ];
    				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
    					markFunction( function( seed, matches ) {
    						var idx,
    							matched = fn( seed, argument ),
    							i = matched.length;
    						while ( i-- ) {
    							idx = indexOf( seed, matched[ i ] );
    							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
    						}
    					} ) :
    					function( elem ) {
    						return fn( elem, 0, args );
    					};
    			}

    			return fn;
    		}
    	},

    	pseudos: {

    		// Potentially complex pseudos
    		"not": markFunction( function( selector ) {

    			// Trim the selector passed to compile
    			// to avoid treating leading and trailing
    			// spaces as combinators
    			var input = [],
    				results = [],
    				matcher = compile( selector.replace( rtrim, "$1" ) );

    			return matcher[ expando ] ?
    				markFunction( function( seed, matches, _context, xml ) {
    					var elem,
    						unmatched = matcher( seed, null, xml, [] ),
    						i = seed.length;

    					// Match elements unmatched by `matcher`
    					while ( i-- ) {
    						if ( ( elem = unmatched[ i ] ) ) {
    							seed[ i ] = !( matches[ i ] = elem );
    						}
    					}
    				} ) :
    				function( elem, _context, xml ) {
    					input[ 0 ] = elem;
    					matcher( input, null, xml, results );

    					// Don't keep the element (issue #299)
    					input[ 0 ] = null;
    					return !results.pop();
    				};
    		} ),

    		"has": markFunction( function( selector ) {
    			return function( elem ) {
    				return Sizzle( selector, elem ).length > 0;
    			};
    		} ),

    		"contains": markFunction( function( text ) {
    			text = text.replace( runescape, funescape );
    			return function( elem ) {
    				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
    			};
    		} ),

    		// "Whether an element is represented by a :lang() selector
    		// is based solely on the element's language value
    		// being equal to the identifier C,
    		// or beginning with the identifier C immediately followed by "-".
    		// The matching of C against the element's language value is performed case-insensitively.
    		// The identifier C does not have to be a valid language name."
    		// http://www.w3.org/TR/selectors/#lang-pseudo
    		"lang": markFunction( function( lang ) {

    			// lang value must be a valid identifier
    			if ( !ridentifier.test( lang || "" ) ) {
    				Sizzle.error( "unsupported lang: " + lang );
    			}
    			lang = lang.replace( runescape, funescape ).toLowerCase();
    			return function( elem ) {
    				var elemLang;
    				do {
    					if ( ( elemLang = documentIsHTML ?
    						elem.lang :
    						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

    						elemLang = elemLang.toLowerCase();
    						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
    					}
    				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
    				return false;
    			};
    		} ),

    		// Miscellaneous
    		"target": function( elem ) {
    			var hash = window.location && window.location.hash;
    			return hash && hash.slice( 1 ) === elem.id;
    		},

    		"root": function( elem ) {
    			return elem === docElem;
    		},

    		"focus": function( elem ) {
    			return elem === document.activeElement &&
    				( !document.hasFocus || document.hasFocus() ) &&
    				!!( elem.type || elem.href || ~elem.tabIndex );
    		},

    		// Boolean properties
    		"enabled": createDisabledPseudo( false ),
    		"disabled": createDisabledPseudo( true ),

    		"checked": function( elem ) {

    			// In CSS3, :checked should return both checked and selected elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			var nodeName = elem.nodeName.toLowerCase();
    			return ( nodeName === "input" && !!elem.checked ) ||
    				( nodeName === "option" && !!elem.selected );
    		},

    		"selected": function( elem ) {

    			// Accessing this property makes selected-by-default
    			// options in Safari work properly
    			if ( elem.parentNode ) {
    				// eslint-disable-next-line no-unused-expressions
    				elem.parentNode.selectedIndex;
    			}

    			return elem.selected === true;
    		},

    		// Contents
    		"empty": function( elem ) {

    			// http://www.w3.org/TR/selectors/#empty-pseudo
    			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
    			//   but not by others (comment: 8; processing instruction: 7; etc.)
    			// nodeType < 6 works because attributes (2) do not appear as children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				if ( elem.nodeType < 6 ) {
    					return false;
    				}
    			}
    			return true;
    		},

    		"parent": function( elem ) {
    			return !Expr.pseudos[ "empty" ]( elem );
    		},

    		// Element/input types
    		"header": function( elem ) {
    			return rheader.test( elem.nodeName );
    		},

    		"input": function( elem ) {
    			return rinputs.test( elem.nodeName );
    		},

    		"button": function( elem ) {
    			var name = elem.nodeName.toLowerCase();
    			return name === "input" && elem.type === "button" || name === "button";
    		},

    		"text": function( elem ) {
    			var attr;
    			return elem.nodeName.toLowerCase() === "input" &&
    				elem.type === "text" &&

    				// Support: IE<8
    				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
    				( ( attr = elem.getAttribute( "type" ) ) == null ||
    					attr.toLowerCase() === "text" );
    		},

    		// Position-in-collection
    		"first": createPositionalPseudo( function() {
    			return [ 0 ];
    		} ),

    		"last": createPositionalPseudo( function( _matchIndexes, length ) {
    			return [ length - 1 ];
    		} ),

    		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
    			return [ argument < 0 ? argument + length : argument ];
    		} ),

    		"even": createPositionalPseudo( function( matchIndexes, length ) {
    			var i = 0;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"odd": createPositionalPseudo( function( matchIndexes, length ) {
    			var i = 1;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    			var i = argument < 0 ?
    				argument + length :
    				argument > length ?
    					length :
    					argument;
    			for ( ; --i >= 0; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    			var i = argument < 0 ? argument + length : argument;
    			for ( ; ++i < length; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} )
    	}
    };

    Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    	Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
    	Expr.pseudos[ i ] = createButtonPseudo( i );
    }

    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
    	var matched, match, tokens, type,
    		soFar, groups, preFilters,
    		cached = tokenCache[ selector + " " ];

    	if ( cached ) {
    		return parseOnly ? 0 : cached.slice( 0 );
    	}

    	soFar = selector;
    	groups = [];
    	preFilters = Expr.preFilter;

    	while ( soFar ) {

    		// Comma and first run
    		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
    			if ( match ) {

    				// Don't consume trailing commas as valid
    				soFar = soFar.slice( match[ 0 ].length ) || soFar;
    			}
    			groups.push( ( tokens = [] ) );
    		}

    		matched = false;

    		// Combinators
    		if ( ( match = rcombinators.exec( soFar ) ) ) {
    			matched = match.shift();
    			tokens.push( {
    				value: matched,

    				// Cast descendant combinators to space
    				type: match[ 0 ].replace( rtrim, " " )
    			} );
    			soFar = soFar.slice( matched.length );
    		}

    		// Filters
    		for ( type in Expr.filter ) {
    			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
    				( match = preFilters[ type ]( match ) ) ) ) {
    				matched = match.shift();
    				tokens.push( {
    					value: matched,
    					type: type,
    					matches: match
    				} );
    				soFar = soFar.slice( matched.length );
    			}
    		}

    		if ( !matched ) {
    			break;
    		}
    	}

    	// Return the length of the invalid excess
    	// if we're just parsing
    	// Otherwise, throw an error or return tokens
    	return parseOnly ?
    		soFar.length :
    		soFar ?
    			Sizzle.error( selector ) :

    			// Cache the tokens
    			tokenCache( selector, groups ).slice( 0 );
    };

    function toSelector( tokens ) {
    	var i = 0,
    		len = tokens.length,
    		selector = "";
    	for ( ; i < len; i++ ) {
    		selector += tokens[ i ].value;
    	}
    	return selector;
    }

    function addCombinator( matcher, combinator, base ) {
    	var dir = combinator.dir,
    		skip = combinator.next,
    		key = skip || dir,
    		checkNonElements = base && key === "parentNode",
    		doneName = done++;

    	return combinator.first ?

    		// Check against closest ancestor/preceding element
    		function( elem, context, xml ) {
    			while ( ( elem = elem[ dir ] ) ) {
    				if ( elem.nodeType === 1 || checkNonElements ) {
    					return matcher( elem, context, xml );
    				}
    			}
    			return false;
    		} :

    		// Check against all ancestor/preceding elements
    		function( elem, context, xml ) {
    			var oldCache, uniqueCache, outerCache,
    				newCache = [ dirruns, doneName ];

    			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
    			if ( xml ) {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						if ( matcher( elem, context, xml ) ) {
    							return true;
    						}
    					}
    				}
    			} else {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

    						// Support: IE <9 only
    						// Defend against cloned attroperties (jQuery gh-1709)
    						uniqueCache = outerCache[ elem.uniqueID ] ||
    							( outerCache[ elem.uniqueID ] = {} );

    						if ( skip && skip === elem.nodeName.toLowerCase() ) {
    							elem = elem[ dir ] || elem;
    						} else if ( ( oldCache = uniqueCache[ key ] ) &&
    							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

    							// Assign to newCache so results back-propagate to previous elements
    							return ( newCache[ 2 ] = oldCache[ 2 ] );
    						} else {

    							// Reuse newcache so results back-propagate to previous elements
    							uniqueCache[ key ] = newCache;

    							// A match means we're done; a fail means we have to keep checking
    							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
    								return true;
    							}
    						}
    					}
    				}
    			}
    			return false;
    		};
    }

    function elementMatcher( matchers ) {
    	return matchers.length > 1 ?
    		function( elem, context, xml ) {
    			var i = matchers.length;
    			while ( i-- ) {
    				if ( !matchers[ i ]( elem, context, xml ) ) {
    					return false;
    				}
    			}
    			return true;
    		} :
    		matchers[ 0 ];
    }

    function multipleContexts( selector, contexts, results ) {
    	var i = 0,
    		len = contexts.length;
    	for ( ; i < len; i++ ) {
    		Sizzle( selector, contexts[ i ], results );
    	}
    	return results;
    }

    function condense( unmatched, map, filter, context, xml ) {
    	var elem,
    		newUnmatched = [],
    		i = 0,
    		len = unmatched.length,
    		mapped = map != null;

    	for ( ; i < len; i++ ) {
    		if ( ( elem = unmatched[ i ] ) ) {
    			if ( !filter || filter( elem, context, xml ) ) {
    				newUnmatched.push( elem );
    				if ( mapped ) {
    					map.push( i );
    				}
    			}
    		}
    	}

    	return newUnmatched;
    }

    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    	if ( postFilter && !postFilter[ expando ] ) {
    		postFilter = setMatcher( postFilter );
    	}
    	if ( postFinder && !postFinder[ expando ] ) {
    		postFinder = setMatcher( postFinder, postSelector );
    	}
    	return markFunction( function( seed, results, context, xml ) {
    		var temp, i, elem,
    			preMap = [],
    			postMap = [],
    			preexisting = results.length,

    			// Get initial elements from seed or context
    			elems = seed || multipleContexts(
    				selector || "*",
    				context.nodeType ? [ context ] : context,
    				[]
    			),

    			// Prefilter to get matcher input, preserving a map for seed-results synchronization
    			matcherIn = preFilter && ( seed || !selector ) ?
    				condense( elems, preMap, preFilter, context, xml ) :
    				elems,

    			matcherOut = matcher ?

    				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
    				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

    					// ...intermediate processing is necessary
    					[] :

    					// ...otherwise use results directly
    					results :
    				matcherIn;

    		// Find primary matches
    		if ( matcher ) {
    			matcher( matcherIn, matcherOut, context, xml );
    		}

    		// Apply postFilter
    		if ( postFilter ) {
    			temp = condense( matcherOut, postMap );
    			postFilter( temp, [], context, xml );

    			// Un-match failing elements by moving them back to matcherIn
    			i = temp.length;
    			while ( i-- ) {
    				if ( ( elem = temp[ i ] ) ) {
    					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
    				}
    			}
    		}

    		if ( seed ) {
    			if ( postFinder || preFilter ) {
    				if ( postFinder ) {

    					// Get the final matcherOut by condensing this intermediate into postFinder contexts
    					temp = [];
    					i = matcherOut.length;
    					while ( i-- ) {
    						if ( ( elem = matcherOut[ i ] ) ) {

    							// Restore matcherIn since elem is not yet a final match
    							temp.push( ( matcherIn[ i ] = elem ) );
    						}
    					}
    					postFinder( null, ( matcherOut = [] ), temp, xml );
    				}

    				// Move matched elements from seed to results to keep them synchronized
    				i = matcherOut.length;
    				while ( i-- ) {
    					if ( ( elem = matcherOut[ i ] ) &&
    						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

    						seed[ temp ] = !( results[ temp ] = elem );
    					}
    				}
    			}

    		// Add elements to results, through postFinder if defined
    		} else {
    			matcherOut = condense(
    				matcherOut === results ?
    					matcherOut.splice( preexisting, matcherOut.length ) :
    					matcherOut
    			);
    			if ( postFinder ) {
    				postFinder( null, results, matcherOut, xml );
    			} else {
    				push.apply( results, matcherOut );
    			}
    		}
    	} );
    }

    function matcherFromTokens( tokens ) {
    	var checkContext, matcher, j,
    		len = tokens.length,
    		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
    		implicitRelative = leadingRelative || Expr.relative[ " " ],
    		i = leadingRelative ? 1 : 0,

    		// The foundational matcher ensures that elements are reachable from top-level context(s)
    		matchContext = addCombinator( function( elem ) {
    			return elem === checkContext;
    		}, implicitRelative, true ),
    		matchAnyContext = addCombinator( function( elem ) {
    			return indexOf( checkContext, elem ) > -1;
    		}, implicitRelative, true ),
    		matchers = [ function( elem, context, xml ) {
    			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
    				( checkContext = context ).nodeType ?
    					matchContext( elem, context, xml ) :
    					matchAnyContext( elem, context, xml ) );

    			// Avoid hanging onto element (issue #299)
    			checkContext = null;
    			return ret;
    		} ];

    	for ( ; i < len; i++ ) {
    		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
    			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
    		} else {
    			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

    			// Return special upon seeing a positional matcher
    			if ( matcher[ expando ] ) {

    				// Find the next relative operator (if any) for proper handling
    				j = ++i;
    				for ( ; j < len; j++ ) {
    					if ( Expr.relative[ tokens[ j ].type ] ) {
    						break;
    					}
    				}
    				return setMatcher(
    					i > 1 && elementMatcher( matchers ),
    					i > 1 && toSelector(

    					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
    					tokens
    						.slice( 0, i - 1 )
    						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
    					).replace( rtrim, "$1" ),
    					matcher,
    					i < j && matcherFromTokens( tokens.slice( i, j ) ),
    					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
    					j < len && toSelector( tokens )
    				);
    			}
    			matchers.push( matcher );
    		}
    	}

    	return elementMatcher( matchers );
    }

    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    	var bySet = setMatchers.length > 0,
    		byElement = elementMatchers.length > 0,
    		superMatcher = function( seed, context, xml, results, outermost ) {
    			var elem, j, matcher,
    				matchedCount = 0,
    				i = "0",
    				unmatched = seed && [],
    				setMatched = [],
    				contextBackup = outermostContext,

    				// We must always have either seed elements or outermost context
    				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

    				// Use integer dirruns iff this is the outermost matcher
    				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
    				len = elems.length;

    			if ( outermost ) {

    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				// eslint-disable-next-line eqeqeq
    				outermostContext = context == document || context || outermost;
    			}

    			// Add elements passing elementMatchers directly to results
    			// Support: IE<9, Safari
    			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
    			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
    				if ( byElement && elem ) {
    					j = 0;

    					// Support: IE 11+, Edge 17 - 18+
    					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    					// two documents; shallow comparisons work.
    					// eslint-disable-next-line eqeqeq
    					if ( !context && elem.ownerDocument != document ) {
    						setDocument( elem );
    						xml = !documentIsHTML;
    					}
    					while ( ( matcher = elementMatchers[ j++ ] ) ) {
    						if ( matcher( elem, context || document, xml ) ) {
    							results.push( elem );
    							break;
    						}
    					}
    					if ( outermost ) {
    						dirruns = dirrunsUnique;
    					}
    				}

    				// Track unmatched elements for set filters
    				if ( bySet ) {

    					// They will have gone through all possible matchers
    					if ( ( elem = !matcher && elem ) ) {
    						matchedCount--;
    					}

    					// Lengthen the array for every element, matched or not
    					if ( seed ) {
    						unmatched.push( elem );
    					}
    				}
    			}

    			// `i` is now the count of elements visited above, and adding it to `matchedCount`
    			// makes the latter nonnegative.
    			matchedCount += i;

    			// Apply set filters to unmatched elements
    			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
    			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
    			// no element matchers and no seed.
    			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
    			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
    			// numerically zero.
    			if ( bySet && i !== matchedCount ) {
    				j = 0;
    				while ( ( matcher = setMatchers[ j++ ] ) ) {
    					matcher( unmatched, setMatched, context, xml );
    				}

    				if ( seed ) {

    					// Reintegrate element matches to eliminate the need for sorting
    					if ( matchedCount > 0 ) {
    						while ( i-- ) {
    							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
    								setMatched[ i ] = pop.call( results );
    							}
    						}
    					}

    					// Discard index placeholder values to get only actual matches
    					setMatched = condense( setMatched );
    				}

    				// Add matches to results
    				push.apply( results, setMatched );

    				// Seedless set matches succeeding multiple successful matchers stipulate sorting
    				if ( outermost && !seed && setMatched.length > 0 &&
    					( matchedCount + setMatchers.length ) > 1 ) {

    					Sizzle.uniqueSort( results );
    				}
    			}

    			// Override manipulation of globals by nested matchers
    			if ( outermost ) {
    				dirruns = dirrunsUnique;
    				outermostContext = contextBackup;
    			}

    			return unmatched;
    		};

    	return bySet ?
    		markFunction( superMatcher ) :
    		superMatcher;
    }

    compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    	var i,
    		setMatchers = [],
    		elementMatchers = [],
    		cached = compilerCache[ selector + " " ];

    	if ( !cached ) {

    		// Generate a function of recursive functions that can be used to check each element
    		if ( !match ) {
    			match = tokenize( selector );
    		}
    		i = match.length;
    		while ( i-- ) {
    			cached = matcherFromTokens( match[ i ] );
    			if ( cached[ expando ] ) {
    				setMatchers.push( cached );
    			} else {
    				elementMatchers.push( cached );
    			}
    		}

    		// Cache the compiled function
    		cached = compilerCache(
    			selector,
    			matcherFromGroupMatchers( elementMatchers, setMatchers )
    		);

    		// Save selector and tokenization
    		cached.selector = selector;
    	}
    	return cached;
    };

    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function( selector, context, results, seed ) {
    	var i, tokens, token, type, find,
    		compiled = typeof selector === "function" && selector,
    		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

    	results = results || [];

    	// Try to minimize operations if there is only one selector in the list and no seed
    	// (the latter of which guarantees us context)
    	if ( match.length === 1 ) {

    		// Reduce context if the leading compound selector is an ID
    		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
    		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
    			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

    			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
    				.replace( runescape, funescape ), context ) || [] )[ 0 ];
    			if ( !context ) {
    				return results;

    			// Precompiled matchers will still verify ancestry, so step up a level
    			} else if ( compiled ) {
    				context = context.parentNode;
    			}

    			selector = selector.slice( tokens.shift().value.length );
    		}

    		// Fetch a seed set for right-to-left matching
    		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
    		while ( i-- ) {
    			token = tokens[ i ];

    			// Abort if we hit a combinator
    			if ( Expr.relative[ ( type = token.type ) ] ) {
    				break;
    			}
    			if ( ( find = Expr.find[ type ] ) ) {

    				// Search, expanding context for leading sibling combinators
    				if ( ( seed = find(
    					token.matches[ 0 ].replace( runescape, funescape ),
    					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
    						context
    				) ) ) {

    					// If seed is empty or no tokens remain, we can return early
    					tokens.splice( i, 1 );
    					selector = seed.length && toSelector( tokens );
    					if ( !selector ) {
    						push.apply( results, seed );
    						return results;
    					}

    					break;
    				}
    			}
    		}
    	}

    	// Compile and execute a filtering function if one is not provided
    	// Provide `match` to avoid retokenization if we modified the selector above
    	( compiled || compile( selector, match ) )(
    		seed,
    		context,
    		!documentIsHTML,
    		results,
    		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
    	);
    	return results;
    };

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

    // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;

    // Initialize against the default document
    setDocument();

    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert( function( el ) {

    	// Should return 1, but returns 4 (following)
    	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
    } );

    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert( function( el ) {
    	el.innerHTML = "<a href='#'></a>";
    	return el.firstChild.getAttribute( "href" ) === "#";
    } ) ) {
    	addHandle( "type|href|height|width", function( elem, name, isXML ) {
    		if ( !isXML ) {
    			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
    		}
    	} );
    }

    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert( function( el ) {
    	el.innerHTML = "<input/>";
    	el.firstChild.setAttribute( "value", "" );
    	return el.firstChild.getAttribute( "value" ) === "";
    } ) ) {
    	addHandle( "value", function( elem, _name, isXML ) {
    		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
    			return elem.defaultValue;
    		}
    	} );
    }

    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert( function( el ) {
    	return el.getAttribute( "disabled" ) == null;
    } ) ) {
    	addHandle( booleans, function( elem, name, isXML ) {
    		var val;
    		if ( !isXML ) {
    			return elem[ name ] === true ? name.toLowerCase() :
    				( val = elem.getAttributeNode( name ) ) && val.specified ?
    					val.value :
    					null;
    		}
    	} );
    }

    return Sizzle;

    } )( window );



    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;

    // Deprecated
    jQuery.expr[ ":" ] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    jQuery.escapeSelector = Sizzle.escape;




    var dir = function( elem, dir, until ) {
    	var matched = [],
    		truncate = until !== undefined;

    	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
    		if ( elem.nodeType === 1 ) {
    			if ( truncate && jQuery( elem ).is( until ) ) {
    				break;
    			}
    			matched.push( elem );
    		}
    	}
    	return matched;
    };


    var siblings = function( n, elem ) {
    	var matched = [];

    	for ( ; n; n = n.nextSibling ) {
    		if ( n.nodeType === 1 && n !== elem ) {
    			matched.push( n );
    		}
    	}

    	return matched;
    };


    var rneedsContext = jQuery.expr.match.needsContext;



    function nodeName( elem, name ) {

      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

    }var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



    // Implement the identical functionality for filter and not
    function winnow( elements, qualifier, not ) {
    	if ( isFunction( qualifier ) ) {
    		return jQuery.grep( elements, function( elem, i ) {
    			return !!qualifier.call( elem, i, elem ) !== not;
    		} );
    	}

    	// Single element
    	if ( qualifier.nodeType ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( elem === qualifier ) !== not;
    		} );
    	}

    	// Arraylike of elements (jQuery, arguments, Array)
    	if ( typeof qualifier !== "string" ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    		} );
    	}

    	// Filtered directly for both simple and complex selectors
    	return jQuery.filter( qualifier, elements, not );
    }

    jQuery.filter = function( expr, elems, not ) {
    	var elem = elems[ 0 ];

    	if ( not ) {
    		expr = ":not(" + expr + ")";
    	}

    	if ( elems.length === 1 && elem.nodeType === 1 ) {
    		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
    	}

    	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
    		return elem.nodeType === 1;
    	} ) );
    };

    jQuery.fn.extend( {
    	find: function( selector ) {
    		var i, ret,
    			len = this.length,
    			self = this;

    		if ( typeof selector !== "string" ) {
    			return this.pushStack( jQuery( selector ).filter( function() {
    				for ( i = 0; i < len; i++ ) {
    					if ( jQuery.contains( self[ i ], this ) ) {
    						return true;
    					}
    				}
    			} ) );
    		}

    		ret = this.pushStack( [] );

    		for ( i = 0; i < len; i++ ) {
    			jQuery.find( selector, self[ i ], ret );
    		}

    		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
    	},
    	filter: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], false ) );
    	},
    	not: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], true ) );
    	},
    	is: function( selector ) {
    		return !!winnow(
    			this,

    			// If this is a positional/relative selector, check membership in the returned set
    			// so $("p:first").is("p:last") won't return true for a doc with two "p".
    			typeof selector === "string" && rneedsContext.test( selector ) ?
    				jQuery( selector ) :
    				selector || [],
    			false
    		).length;
    	}
    } );


    // Initialize a jQuery object


    // A central reference to the root jQuery(document)
    var rootjQuery,

    	// A simple way to check for HTML strings
    	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    	// Strict HTML recognition (#11290: must start with <)
    	// Shortcut simple #id case for speed
    	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

    	init = jQuery.fn.init = function( selector, context, root ) {
    		var match, elem;

    		// HANDLE: $(""), $(null), $(undefined), $(false)
    		if ( !selector ) {
    			return this;
    		}

    		// Method init() accepts an alternate rootjQuery
    		// so migrate can support jQuery.sub (gh-2101)
    		root = root || rootjQuery;

    		// Handle HTML strings
    		if ( typeof selector === "string" ) {
    			if ( selector[ 0 ] === "<" &&
    				selector[ selector.length - 1 ] === ">" &&
    				selector.length >= 3 ) {

    				// Assume that strings that start and end with <> are HTML and skip the regex check
    				match = [ null, selector, null ];

    			} else {
    				match = rquickExpr.exec( selector );
    			}

    			// Match html or make sure no context is specified for #id
    			if ( match && ( match[ 1 ] || !context ) ) {

    				// HANDLE: $(html) -> $(array)
    				if ( match[ 1 ] ) {
    					context = context instanceof jQuery ? context[ 0 ] : context;

    					// Option to run scripts is true for back-compat
    					// Intentionally let the error be thrown if parseHTML is not present
    					jQuery.merge( this, jQuery.parseHTML(
    						match[ 1 ],
    						context && context.nodeType ? context.ownerDocument || context : document,
    						true
    					) );

    					// HANDLE: $(html, props)
    					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
    						for ( match in context ) {

    							// Properties of context are called as methods if possible
    							if ( isFunction( this[ match ] ) ) {
    								this[ match ]( context[ match ] );

    							// ...and otherwise set as attributes
    							} else {
    								this.attr( match, context[ match ] );
    							}
    						}
    					}

    					return this;

    				// HANDLE: $(#id)
    				} else {
    					elem = document.getElementById( match[ 2 ] );

    					if ( elem ) {

    						// Inject the element directly into the jQuery object
    						this[ 0 ] = elem;
    						this.length = 1;
    					}
    					return this;
    				}

    			// HANDLE: $(expr, $(...))
    			} else if ( !context || context.jquery ) {
    				return ( context || root ).find( selector );

    			// HANDLE: $(expr, context)
    			// (which is just equivalent to: $(context).find(expr)
    			} else {
    				return this.constructor( context ).find( selector );
    			}

    		// HANDLE: $(DOMElement)
    		} else if ( selector.nodeType ) {
    			this[ 0 ] = selector;
    			this.length = 1;
    			return this;

    		// HANDLE: $(function)
    		// Shortcut for document ready
    		} else if ( isFunction( selector ) ) {
    			return root.ready !== undefined ?
    				root.ready( selector ) :

    				// Execute immediately if ready is not present
    				selector( jQuery );
    		}

    		return jQuery.makeArray( selector, this );
    	};

    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;

    // Initialize central reference
    rootjQuery = jQuery( document );


    var rparentsprev = /^(?:parents|prev(?:Until|All))/,

    	// Methods guaranteed to produce a unique set when starting from a unique set
    	guaranteedUnique = {
    		children: true,
    		contents: true,
    		next: true,
    		prev: true
    	};

    jQuery.fn.extend( {
    	has: function( target ) {
    		var targets = jQuery( target, this ),
    			l = targets.length;

    		return this.filter( function() {
    			var i = 0;
    			for ( ; i < l; i++ ) {
    				if ( jQuery.contains( this, targets[ i ] ) ) {
    					return true;
    				}
    			}
    		} );
    	},

    	closest: function( selectors, context ) {
    		var cur,
    			i = 0,
    			l = this.length,
    			matched = [],
    			targets = typeof selectors !== "string" && jQuery( selectors );

    		// Positional selectors never match, since there's no _selection_ context
    		if ( !rneedsContext.test( selectors ) ) {
    			for ( ; i < l; i++ ) {
    				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

    					// Always skip document fragments
    					if ( cur.nodeType < 11 && ( targets ?
    						targets.index( cur ) > -1 :

    						// Don't pass non-elements to Sizzle
    						cur.nodeType === 1 &&
    							jQuery.find.matchesSelector( cur, selectors ) ) ) {

    						matched.push( cur );
    						break;
    					}
    				}
    			}
    		}

    		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
    	},

    	// Determine the position of an element within the set
    	index: function( elem ) {

    		// No argument, return index in parent
    		if ( !elem ) {
    			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
    		}

    		// Index in selector
    		if ( typeof elem === "string" ) {
    			return indexOf.call( jQuery( elem ), this[ 0 ] );
    		}

    		// Locate the position of the desired element
    		return indexOf.call( this,

    			// If it receives a jQuery object, the first element is used
    			elem.jquery ? elem[ 0 ] : elem
    		);
    	},

    	add: function( selector, context ) {
    		return this.pushStack(
    			jQuery.uniqueSort(
    				jQuery.merge( this.get(), jQuery( selector, context ) )
    			)
    		);
    	},

    	addBack: function( selector ) {
    		return this.add( selector == null ?
    			this.prevObject : this.prevObject.filter( selector )
    		);
    	}
    } );

    function sibling( cur, dir ) {
    	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
    	return cur;
    }

    jQuery.each( {
    	parent: function( elem ) {
    		var parent = elem.parentNode;
    		return parent && parent.nodeType !== 11 ? parent : null;
    	},
    	parents: function( elem ) {
    		return dir( elem, "parentNode" );
    	},
    	parentsUntil: function( elem, _i, until ) {
    		return dir( elem, "parentNode", until );
    	},
    	next: function( elem ) {
    		return sibling( elem, "nextSibling" );
    	},
    	prev: function( elem ) {
    		return sibling( elem, "previousSibling" );
    	},
    	nextAll: function( elem ) {
    		return dir( elem, "nextSibling" );
    	},
    	prevAll: function( elem ) {
    		return dir( elem, "previousSibling" );
    	},
    	nextUntil: function( elem, _i, until ) {
    		return dir( elem, "nextSibling", until );
    	},
    	prevUntil: function( elem, _i, until ) {
    		return dir( elem, "previousSibling", until );
    	},
    	siblings: function( elem ) {
    		return siblings( ( elem.parentNode || {} ).firstChild, elem );
    	},
    	children: function( elem ) {
    		return siblings( elem.firstChild );
    	},
    	contents: function( elem ) {
    		if ( elem.contentDocument != null &&

    			// Support: IE 11+
    			// <object> elements with no `data` attribute has an object
    			// `contentDocument` with a `null` prototype.
    			getProto( elem.contentDocument ) ) {

    			return elem.contentDocument;
    		}

    		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
    		// Treat the template element as a regular one in browsers that
    		// don't support it.
    		if ( nodeName( elem, "template" ) ) {
    			elem = elem.content || elem;
    		}

    		return jQuery.merge( [], elem.childNodes );
    	}
    }, function( name, fn ) {
    	jQuery.fn[ name ] = function( until, selector ) {
    		var matched = jQuery.map( this, fn, until );

    		if ( name.slice( -5 ) !== "Until" ) {
    			selector = until;
    		}

    		if ( selector && typeof selector === "string" ) {
    			matched = jQuery.filter( selector, matched );
    		}

    		if ( this.length > 1 ) {

    			// Remove duplicates
    			if ( !guaranteedUnique[ name ] ) {
    				jQuery.uniqueSort( matched );
    			}

    			// Reverse order for parents* and prev-derivatives
    			if ( rparentsprev.test( name ) ) {
    				matched.reverse();
    			}
    		}

    		return this.pushStack( matched );
    	};
    } );
    var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



    // Convert String-formatted options into Object-formatted ones
    function createOptions( options ) {
    	var object = {};
    	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
    		object[ flag ] = true;
    	} );
    	return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {

    	// Convert options from String-formatted to Object-formatted if needed
    	// (we check in cache first)
    	options = typeof options === "string" ?
    		createOptions( options ) :
    		jQuery.extend( {}, options );

    	var // Flag to know if list is currently firing
    		firing,

    		// Last fire value for non-forgettable lists
    		memory,

    		// Flag to know if list was already fired
    		fired,

    		// Flag to prevent firing
    		locked,

    		// Actual callback list
    		list = [],

    		// Queue of execution data for repeatable lists
    		queue = [],

    		// Index of currently firing callback (modified by add/remove as needed)
    		firingIndex = -1,

    		// Fire callbacks
    		fire = function() {

    			// Enforce single-firing
    			locked = locked || options.once;

    			// Execute callbacks for all pending executions,
    			// respecting firingIndex overrides and runtime changes
    			fired = firing = true;
    			for ( ; queue.length; firingIndex = -1 ) {
    				memory = queue.shift();
    				while ( ++firingIndex < list.length ) {

    					// Run callback and check for early termination
    					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
    						options.stopOnFalse ) {

    						// Jump to end and forget the data so .add doesn't re-fire
    						firingIndex = list.length;
    						memory = false;
    					}
    				}
    			}

    			// Forget the data if we're done with it
    			if ( !options.memory ) {
    				memory = false;
    			}

    			firing = false;

    			// Clean up if we're done firing for good
    			if ( locked ) {

    				// Keep an empty list if we have data for future add calls
    				if ( memory ) {
    					list = [];

    				// Otherwise, this object is spent
    				} else {
    					list = "";
    				}
    			}
    		},

    		// Actual Callbacks object
    		self = {

    			// Add a callback or a collection of callbacks to the list
    			add: function() {
    				if ( list ) {

    					// If we have memory from a past run, we should fire after adding
    					if ( memory && !firing ) {
    						firingIndex = list.length - 1;
    						queue.push( memory );
    					}

    					( function add( args ) {
    						jQuery.each( args, function( _, arg ) {
    							if ( isFunction( arg ) ) {
    								if ( !options.unique || !self.has( arg ) ) {
    									list.push( arg );
    								}
    							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

    								// Inspect recursively
    								add( arg );
    							}
    						} );
    					} )( arguments );

    					if ( memory && !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},

    			// Remove a callback from the list
    			remove: function() {
    				jQuery.each( arguments, function( _, arg ) {
    					var index;
    					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
    						list.splice( index, 1 );

    						// Handle firing indexes
    						if ( index <= firingIndex ) {
    							firingIndex--;
    						}
    					}
    				} );
    				return this;
    			},

    			// Check if a given callback is in the list.
    			// If no argument is given, return whether or not list has callbacks attached.
    			has: function( fn ) {
    				return fn ?
    					jQuery.inArray( fn, list ) > -1 :
    					list.length > 0;
    			},

    			// Remove all callbacks from the list
    			empty: function() {
    				if ( list ) {
    					list = [];
    				}
    				return this;
    			},

    			// Disable .fire and .add
    			// Abort any current/pending executions
    			// Clear all callbacks and values
    			disable: function() {
    				locked = queue = [];
    				list = memory = "";
    				return this;
    			},
    			disabled: function() {
    				return !list;
    			},

    			// Disable .fire
    			// Also disable .add unless we have memory (since it would have no effect)
    			// Abort any pending executions
    			lock: function() {
    				locked = queue = [];
    				if ( !memory && !firing ) {
    					list = memory = "";
    				}
    				return this;
    			},
    			locked: function() {
    				return !!locked;
    			},

    			// Call all callbacks with the given context and arguments
    			fireWith: function( context, args ) {
    				if ( !locked ) {
    					args = args || [];
    					args = [ context, args.slice ? args.slice() : args ];
    					queue.push( args );
    					if ( !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},

    			// Call all the callbacks with the given arguments
    			fire: function() {
    				self.fireWith( this, arguments );
    				return this;
    			},

    			// To know if the callbacks have already been called at least once
    			fired: function() {
    				return !!fired;
    			}
    		};

    	return self;
    };


    function Identity( v ) {
    	return v;
    }
    function Thrower( ex ) {
    	throw ex;
    }

    function adoptValue( value, resolve, reject, noValue ) {
    	var method;

    	try {

    		// Check for promise aspect first to privilege synchronous behavior
    		if ( value && isFunction( ( method = value.promise ) ) ) {
    			method.call( value ).done( resolve ).fail( reject );

    		// Other thenables
    		} else if ( value && isFunction( ( method = value.then ) ) ) {
    			method.call( value, resolve, reject );

    		// Other non-thenables
    		} else {

    			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
    			// * false: [ value ].slice( 0 ) => resolve( value )
    			// * true: [ value ].slice( 1 ) => resolve()
    			resolve.apply( undefined, [ value ].slice( noValue ) );
    		}

    	// For Promises/A+, convert exceptions into rejections
    	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
    	// Deferred#then to conditionally suppress rejection.
    	} catch ( value ) {

    		// Support: Android 4.0 only
    		// Strict mode functions invoked without .call/.apply get global-object context
    		reject.apply( undefined, [ value ] );
    	}
    }

    jQuery.extend( {

    	Deferred: function( func ) {
    		var tuples = [

    				// action, add listener, callbacks,
    				// ... .then handlers, argument index, [final state]
    				[ "notify", "progress", jQuery.Callbacks( "memory" ),
    					jQuery.Callbacks( "memory" ), 2 ],
    				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
    					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
    				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
    					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
    			],
    			state = "pending",
    			promise = {
    				state: function() {
    					return state;
    				},
    				always: function() {
    					deferred.done( arguments ).fail( arguments );
    					return this;
    				},
    				"catch": function( fn ) {
    					return promise.then( null, fn );
    				},

    				// Keep pipe for back-compat
    				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
    					var fns = arguments;

    					return jQuery.Deferred( function( newDefer ) {
    						jQuery.each( tuples, function( _i, tuple ) {

    							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
    							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

    							// deferred.progress(function() { bind to newDefer or newDefer.notify })
    							// deferred.done(function() { bind to newDefer or newDefer.resolve })
    							// deferred.fail(function() { bind to newDefer or newDefer.reject })
    							deferred[ tuple[ 1 ] ]( function() {
    								var returned = fn && fn.apply( this, arguments );
    								if ( returned && isFunction( returned.promise ) ) {
    									returned.promise()
    										.progress( newDefer.notify )
    										.done( newDefer.resolve )
    										.fail( newDefer.reject );
    								} else {
    									newDefer[ tuple[ 0 ] + "With" ](
    										this,
    										fn ? [ returned ] : arguments
    									);
    								}
    							} );
    						} );
    						fns = null;
    					} ).promise();
    				},
    				then: function( onFulfilled, onRejected, onProgress ) {
    					var maxDepth = 0;
    					function resolve( depth, deferred, handler, special ) {
    						return function() {
    							var that = this,
    								args = arguments,
    								mightThrow = function() {
    									var returned, then;

    									// Support: Promises/A+ section 2.3.3.3.3
    									// https://promisesaplus.com/#point-59
    									// Ignore double-resolution attempts
    									if ( depth < maxDepth ) {
    										return;
    									}

    									returned = handler.apply( that, args );

    									// Support: Promises/A+ section 2.3.1
    									// https://promisesaplus.com/#point-48
    									if ( returned === deferred.promise() ) {
    										throw new TypeError( "Thenable self-resolution" );
    									}

    									// Support: Promises/A+ sections 2.3.3.1, 3.5
    									// https://promisesaplus.com/#point-54
    									// https://promisesaplus.com/#point-75
    									// Retrieve `then` only once
    									then = returned &&

    										// Support: Promises/A+ section 2.3.4
    										// https://promisesaplus.com/#point-64
    										// Only check objects and functions for thenability
    										( typeof returned === "object" ||
    											typeof returned === "function" ) &&
    										returned.then;

    									// Handle a returned thenable
    									if ( isFunction( then ) ) {

    										// Special processors (notify) just wait for resolution
    										if ( special ) {
    											then.call(
    												returned,
    												resolve( maxDepth, deferred, Identity, special ),
    												resolve( maxDepth, deferred, Thrower, special )
    											);

    										// Normal processors (resolve) also hook into progress
    										} else {

    											// ...and disregard older resolution values
    											maxDepth++;

    											then.call(
    												returned,
    												resolve( maxDepth, deferred, Identity, special ),
    												resolve( maxDepth, deferred, Thrower, special ),
    												resolve( maxDepth, deferred, Identity,
    													deferred.notifyWith )
    											);
    										}

    									// Handle all other returned values
    									} else {

    										// Only substitute handlers pass on context
    										// and multiple values (non-spec behavior)
    										if ( handler !== Identity ) {
    											that = undefined;
    											args = [ returned ];
    										}

    										// Process the value(s)
    										// Default process is resolve
    										( special || deferred.resolveWith )( that, args );
    									}
    								},

    								// Only normal processors (resolve) catch and reject exceptions
    								process = special ?
    									mightThrow :
    									function() {
    										try {
    											mightThrow();
    										} catch ( e ) {

    											if ( jQuery.Deferred.exceptionHook ) {
    												jQuery.Deferred.exceptionHook( e,
    													process.stackTrace );
    											}

    											// Support: Promises/A+ section 2.3.3.3.4.1
    											// https://promisesaplus.com/#point-61
    											// Ignore post-resolution exceptions
    											if ( depth + 1 >= maxDepth ) {

    												// Only substitute handlers pass on context
    												// and multiple values (non-spec behavior)
    												if ( handler !== Thrower ) {
    													that = undefined;
    													args = [ e ];
    												}

    												deferred.rejectWith( that, args );
    											}
    										}
    									};

    							// Support: Promises/A+ section 2.3.3.3.1
    							// https://promisesaplus.com/#point-57
    							// Re-resolve promises immediately to dodge false rejection from
    							// subsequent errors
    							if ( depth ) {
    								process();
    							} else {

    								// Call an optional hook to record the stack, in case of exception
    								// since it's otherwise lost when execution goes async
    								if ( jQuery.Deferred.getStackHook ) {
    									process.stackTrace = jQuery.Deferred.getStackHook();
    								}
    								window.setTimeout( process );
    							}
    						};
    					}

    					return jQuery.Deferred( function( newDefer ) {

    						// progress_handlers.add( ... )
    						tuples[ 0 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onProgress ) ?
    									onProgress :
    									Identity,
    								newDefer.notifyWith
    							)
    						);

    						// fulfilled_handlers.add( ... )
    						tuples[ 1 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onFulfilled ) ?
    									onFulfilled :
    									Identity
    							)
    						);

    						// rejected_handlers.add( ... )
    						tuples[ 2 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onRejected ) ?
    									onRejected :
    									Thrower
    							)
    						);
    					} ).promise();
    				},

    				// Get a promise for this deferred
    				// If obj is provided, the promise aspect is added to the object
    				promise: function( obj ) {
    					return obj != null ? jQuery.extend( obj, promise ) : promise;
    				}
    			},
    			deferred = {};

    		// Add list-specific methods
    		jQuery.each( tuples, function( i, tuple ) {
    			var list = tuple[ 2 ],
    				stateString = tuple[ 5 ];

    			// promise.progress = list.add
    			// promise.done = list.add
    			// promise.fail = list.add
    			promise[ tuple[ 1 ] ] = list.add;

    			// Handle state
    			if ( stateString ) {
    				list.add(
    					function() {

    						// state = "resolved" (i.e., fulfilled)
    						// state = "rejected"
    						state = stateString;
    					},

    					// rejected_callbacks.disable
    					// fulfilled_callbacks.disable
    					tuples[ 3 - i ][ 2 ].disable,

    					// rejected_handlers.disable
    					// fulfilled_handlers.disable
    					tuples[ 3 - i ][ 3 ].disable,

    					// progress_callbacks.lock
    					tuples[ 0 ][ 2 ].lock,

    					// progress_handlers.lock
    					tuples[ 0 ][ 3 ].lock
    				);
    			}

    			// progress_handlers.fire
    			// fulfilled_handlers.fire
    			// rejected_handlers.fire
    			list.add( tuple[ 3 ].fire );

    			// deferred.notify = function() { deferred.notifyWith(...) }
    			// deferred.resolve = function() { deferred.resolveWith(...) }
    			// deferred.reject = function() { deferred.rejectWith(...) }
    			deferred[ tuple[ 0 ] ] = function() {
    				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
    				return this;
    			};

    			// deferred.notifyWith = list.fireWith
    			// deferred.resolveWith = list.fireWith
    			// deferred.rejectWith = list.fireWith
    			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
    		} );

    		// Make the deferred a promise
    		promise.promise( deferred );

    		// Call given func if any
    		if ( func ) {
    			func.call( deferred, deferred );
    		}

    		// All done!
    		return deferred;
    	},

    	// Deferred helper
    	when: function( singleValue ) {
    		var

    			// count of uncompleted subordinates
    			remaining = arguments.length,

    			// count of unprocessed arguments
    			i = remaining,

    			// subordinate fulfillment data
    			resolveContexts = Array( i ),
    			resolveValues = slice.call( arguments ),

    			// the master Deferred
    			master = jQuery.Deferred(),

    			// subordinate callback factory
    			updateFunc = function( i ) {
    				return function( value ) {
    					resolveContexts[ i ] = this;
    					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
    					if ( !( --remaining ) ) {
    						master.resolveWith( resolveContexts, resolveValues );
    					}
    				};
    			};

    		// Single- and empty arguments are adopted like Promise.resolve
    		if ( remaining <= 1 ) {
    			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
    				!remaining );

    			// Use .then() to unwrap secondary thenables (cf. gh-3000)
    			if ( master.state() === "pending" ||
    				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

    				return master.then();
    			}
    		}

    		// Multiple arguments are aggregated like Promise.all array elements
    		while ( i-- ) {
    			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
    		}

    		return master.promise();
    	}
    } );


    // These usually indicate a programmer mistake during development,
    // warn about them ASAP rather than swallowing them by default.
    var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

    jQuery.Deferred.exceptionHook = function( error, stack ) {

    	// Support: IE 8 - 9 only
    	// Console exists when dev tools are open, which can happen at any time
    	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
    		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
    	}
    };




    jQuery.readyException = function( error ) {
    	window.setTimeout( function() {
    		throw error;
    	} );
    };




    // The deferred used on DOM ready
    var readyList = jQuery.Deferred();

    jQuery.fn.ready = function( fn ) {

    	readyList
    		.then( fn )

    		// Wrap jQuery.readyException in a function so that the lookup
    		// happens at the time of error handling instead of callback
    		// registration.
    		.catch( function( error ) {
    			jQuery.readyException( error );
    		} );

    	return this;
    };

    jQuery.extend( {

    	// Is the DOM ready to be used? Set to true once it occurs.
    	isReady: false,

    	// A counter to track how many items to wait for before
    	// the ready event fires. See #6781
    	readyWait: 1,

    	// Handle when the DOM is ready
    	ready: function( wait ) {

    		// Abort if there are pending holds or we're already ready
    		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
    			return;
    		}

    		// Remember that the DOM is ready
    		jQuery.isReady = true;

    		// If a normal DOM Ready event fired, decrement, and wait if need be
    		if ( wait !== true && --jQuery.readyWait > 0 ) {
    			return;
    		}

    		// If there are functions bound, to execute
    		readyList.resolveWith( document, [ jQuery ] );
    	}
    } );

    jQuery.ready.then = readyList.then;

    // The ready event handler and self cleanup method
    function completed() {
    	document.removeEventListener( "DOMContentLoaded", completed );
    	window.removeEventListener( "load", completed );
    	jQuery.ready();
    }

    // Catch cases where $(document).ready() is called
    // after the browser event has already occurred.
    // Support: IE <=9 - 10 only
    // Older IE sometimes signals "interactive" too soon
    if ( document.readyState === "complete" ||
    	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

    	// Handle it asynchronously to allow scripts the opportunity to delay ready
    	window.setTimeout( jQuery.ready );

    } else {

    	// Use the handy event callback
    	document.addEventListener( "DOMContentLoaded", completed );

    	// A fallback to window.onload, that will always work
    	window.addEventListener( "load", completed );
    }




    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    	var i = 0,
    		len = elems.length,
    		bulk = key == null;

    	// Sets many values
    	if ( toType( key ) === "object" ) {
    		chainable = true;
    		for ( i in key ) {
    			access( elems, fn, i, key[ i ], true, emptyGet, raw );
    		}

    	// Sets one value
    	} else if ( value !== undefined ) {
    		chainable = true;

    		if ( !isFunction( value ) ) {
    			raw = true;
    		}

    		if ( bulk ) {

    			// Bulk operations run against the entire set
    			if ( raw ) {
    				fn.call( elems, value );
    				fn = null;

    			// ...except when executing function values
    			} else {
    				bulk = fn;
    				fn = function( elem, _key, value ) {
    					return bulk.call( jQuery( elem ), value );
    				};
    			}
    		}

    		if ( fn ) {
    			for ( ; i < len; i++ ) {
    				fn(
    					elems[ i ], key, raw ?
    					value :
    					value.call( elems[ i ], i, fn( elems[ i ], key ) )
    				);
    			}
    		}
    	}

    	if ( chainable ) {
    		return elems;
    	}

    	// Gets
    	if ( bulk ) {
    		return fn.call( elems );
    	}

    	return len ? fn( elems[ 0 ], key ) : emptyGet;
    };


    // Matches dashed string for camelizing
    var rmsPrefix = /^-ms-/,
    	rdashAlpha = /-([a-z])/g;

    // Used by camelCase as callback to replace()
    function fcamelCase( _all, letter ) {
    	return letter.toUpperCase();
    }

    // Convert dashed to camelCase; used by the css and data modules
    // Support: IE <=9 - 11, Edge 12 - 15
    // Microsoft forgot to hump their vendor prefix (#9572)
    function camelCase( string ) {
    	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    }
    var acceptData = function( owner ) {

    	// Accepts only:
    	//  - Node
    	//    - Node.ELEMENT_NODE
    	//    - Node.DOCUMENT_NODE
    	//  - Object
    	//    - Any
    	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
    };




    function Data() {
    	this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {

    	cache: function( owner ) {

    		// Check if the owner object already has a cache
    		var value = owner[ this.expando ];

    		// If not, create one
    		if ( !value ) {
    			value = {};

    			// We can accept data for non-element nodes in modern browsers,
    			// but we should not, see #8335.
    			// Always return an empty object.
    			if ( acceptData( owner ) ) {

    				// If it is a node unlikely to be stringify-ed or looped over
    				// use plain assignment
    				if ( owner.nodeType ) {
    					owner[ this.expando ] = value;

    				// Otherwise secure it in a non-enumerable property
    				// configurable must be true to allow the property to be
    				// deleted when data is removed
    				} else {
    					Object.defineProperty( owner, this.expando, {
    						value: value,
    						configurable: true
    					} );
    				}
    			}
    		}

    		return value;
    	},
    	set: function( owner, data, value ) {
    		var prop,
    			cache = this.cache( owner );

    		// Handle: [ owner, key, value ] args
    		// Always use camelCase key (gh-2257)
    		if ( typeof data === "string" ) {
    			cache[ camelCase( data ) ] = value;

    		// Handle: [ owner, { properties } ] args
    		} else {

    			// Copy the properties one-by-one to the cache object
    			for ( prop in data ) {
    				cache[ camelCase( prop ) ] = data[ prop ];
    			}
    		}
    		return cache;
    	},
    	get: function( owner, key ) {
    		return key === undefined ?
    			this.cache( owner ) :

    			// Always use camelCase key (gh-2257)
    			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    	},
    	access: function( owner, key, value ) {

    		// In cases where either:
    		//
    		//   1. No key was specified
    		//   2. A string key was specified, but no value provided
    		//
    		// Take the "read" path and allow the get method to determine
    		// which value to return, respectively either:
    		//
    		//   1. The entire cache object
    		//   2. The data stored at the key
    		//
    		if ( key === undefined ||
    				( ( key && typeof key === "string" ) && value === undefined ) ) {

    			return this.get( owner, key );
    		}

    		// When the key is not a string, or both a key and value
    		// are specified, set or extend (existing objects) with either:
    		//
    		//   1. An object of properties
    		//   2. A key and value
    		//
    		this.set( owner, key, value );

    		// Since the "set" path can have two possible entry points
    		// return the expected data based on which path was taken[*]
    		return value !== undefined ? value : key;
    	},
    	remove: function( owner, key ) {
    		var i,
    			cache = owner[ this.expando ];

    		if ( cache === undefined ) {
    			return;
    		}

    		if ( key !== undefined ) {

    			// Support array or space separated string of keys
    			if ( Array.isArray( key ) ) {

    				// If key is an array of keys...
    				// We always set camelCase keys, so remove that.
    				key = key.map( camelCase );
    			} else {
    				key = camelCase( key );

    				// If a key with the spaces exists, use it.
    				// Otherwise, create an array by matching non-whitespace
    				key = key in cache ?
    					[ key ] :
    					( key.match( rnothtmlwhite ) || [] );
    			}

    			i = key.length;

    			while ( i-- ) {
    				delete cache[ key[ i ] ];
    			}
    		}

    		// Remove the expando if there's no more data
    		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

    			// Support: Chrome <=35 - 45
    			// Webkit & Blink performance suffers when deleting properties
    			// from DOM nodes, so set to undefined instead
    			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
    			if ( owner.nodeType ) {
    				owner[ this.expando ] = undefined;
    			} else {
    				delete owner[ this.expando ];
    			}
    		}
    	},
    	hasData: function( owner ) {
    		var cache = owner[ this.expando ];
    		return cache !== undefined && !jQuery.isEmptyObject( cache );
    	}
    };
    var dataPriv = new Data();

    var dataUser = new Data();



    //	Implementation Summary
    //
    //	1. Enforce API surface and semantic compatibility with 1.9.x branch
    //	2. Improve the module's maintainability by reducing the storage
    //		paths to a single mechanism.
    //	3. Use the same single mechanism to support "private" and "user" data.
    //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    //	5. Avoid exposing implementation details on user objects (eg. expando properties)
    //	6. Provide a clear path for implementation upgrade to WeakMap in 2014

    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    	rmultiDash = /[A-Z]/g;

    function getData( data ) {
    	if ( data === "true" ) {
    		return true;
    	}

    	if ( data === "false" ) {
    		return false;
    	}

    	if ( data === "null" ) {
    		return null;
    	}

    	// Only convert to a number if it doesn't change the string
    	if ( data === +data + "" ) {
    		return +data;
    	}

    	if ( rbrace.test( data ) ) {
    		return JSON.parse( data );
    	}

    	return data;
    }

    function dataAttr( elem, key, data ) {
    	var name;

    	// If nothing was found internally, try to fetch any
    	// data from the HTML5 data-* attribute
    	if ( data === undefined && elem.nodeType === 1 ) {
    		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
    		data = elem.getAttribute( name );

    		if ( typeof data === "string" ) {
    			try {
    				data = getData( data );
    			} catch ( e ) {}

    			// Make sure we set the data so it isn't changed later
    			dataUser.set( elem, key, data );
    		} else {
    			data = undefined;
    		}
    	}
    	return data;
    }

    jQuery.extend( {
    	hasData: function( elem ) {
    		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
    	},

    	data: function( elem, name, data ) {
    		return dataUser.access( elem, name, data );
    	},

    	removeData: function( elem, name ) {
    		dataUser.remove( elem, name );
    	},

    	// TODO: Now that all calls to _data and _removeData have been replaced
    	// with direct calls to dataPriv methods, these can be deprecated.
    	_data: function( elem, name, data ) {
    		return dataPriv.access( elem, name, data );
    	},

    	_removeData: function( elem, name ) {
    		dataPriv.remove( elem, name );
    	}
    } );

    jQuery.fn.extend( {
    	data: function( key, value ) {
    		var i, name, data,
    			elem = this[ 0 ],
    			attrs = elem && elem.attributes;

    		// Gets all values
    		if ( key === undefined ) {
    			if ( this.length ) {
    				data = dataUser.get( elem );

    				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
    					i = attrs.length;
    					while ( i-- ) {

    						// Support: IE 11 only
    						// The attrs elements can be null (#14894)
    						if ( attrs[ i ] ) {
    							name = attrs[ i ].name;
    							if ( name.indexOf( "data-" ) === 0 ) {
    								name = camelCase( name.slice( 5 ) );
    								dataAttr( elem, name, data[ name ] );
    							}
    						}
    					}
    					dataPriv.set( elem, "hasDataAttrs", true );
    				}
    			}

    			return data;
    		}

    		// Sets multiple values
    		if ( typeof key === "object" ) {
    			return this.each( function() {
    				dataUser.set( this, key );
    			} );
    		}

    		return access( this, function( value ) {
    			var data;

    			// The calling jQuery object (element matches) is not empty
    			// (and therefore has an element appears at this[ 0 ]) and the
    			// `value` parameter was not undefined. An empty jQuery object
    			// will result in `undefined` for elem = this[ 0 ] which will
    			// throw an exception if an attempt to read a data cache is made.
    			if ( elem && value === undefined ) {

    				// Attempt to get data from the cache
    				// The key will always be camelCased in Data
    				data = dataUser.get( elem, key );
    				if ( data !== undefined ) {
    					return data;
    				}

    				// Attempt to "discover" the data in
    				// HTML5 custom data-* attrs
    				data = dataAttr( elem, key );
    				if ( data !== undefined ) {
    					return data;
    				}

    				// We tried really hard, but the data doesn't exist.
    				return;
    			}

    			// Set the data...
    			this.each( function() {

    				// We always store the camelCased key
    				dataUser.set( this, key, value );
    			} );
    		}, null, value, arguments.length > 1, null, true );
    	},

    	removeData: function( key ) {
    		return this.each( function() {
    			dataUser.remove( this, key );
    		} );
    	}
    } );


    jQuery.extend( {
    	queue: function( elem, type, data ) {
    		var queue;

    		if ( elem ) {
    			type = ( type || "fx" ) + "queue";
    			queue = dataPriv.get( elem, type );

    			// Speed up dequeue by getting out quickly if this is just a lookup
    			if ( data ) {
    				if ( !queue || Array.isArray( data ) ) {
    					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
    				} else {
    					queue.push( data );
    				}
    			}
    			return queue || [];
    		}
    	},

    	dequeue: function( elem, type ) {
    		type = type || "fx";

    		var queue = jQuery.queue( elem, type ),
    			startLength = queue.length,
    			fn = queue.shift(),
    			hooks = jQuery._queueHooks( elem, type ),
    			next = function() {
    				jQuery.dequeue( elem, type );
    			};

    		// If the fx queue is dequeued, always remove the progress sentinel
    		if ( fn === "inprogress" ) {
    			fn = queue.shift();
    			startLength--;
    		}

    		if ( fn ) {

    			// Add a progress sentinel to prevent the fx queue from being
    			// automatically dequeued
    			if ( type === "fx" ) {
    				queue.unshift( "inprogress" );
    			}

    			// Clear up the last queue stop function
    			delete hooks.stop;
    			fn.call( elem, next, hooks );
    		}

    		if ( !startLength && hooks ) {
    			hooks.empty.fire();
    		}
    	},

    	// Not public - generate a queueHooks object, or return the current one
    	_queueHooks: function( elem, type ) {
    		var key = type + "queueHooks";
    		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
    			empty: jQuery.Callbacks( "once memory" ).add( function() {
    				dataPriv.remove( elem, [ type + "queue", key ] );
    			} )
    		} );
    	}
    } );

    jQuery.fn.extend( {
    	queue: function( type, data ) {
    		var setter = 2;

    		if ( typeof type !== "string" ) {
    			data = type;
    			type = "fx";
    			setter--;
    		}

    		if ( arguments.length < setter ) {
    			return jQuery.queue( this[ 0 ], type );
    		}

    		return data === undefined ?
    			this :
    			this.each( function() {
    				var queue = jQuery.queue( this, type, data );

    				// Ensure a hooks for this queue
    				jQuery._queueHooks( this, type );

    				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
    					jQuery.dequeue( this, type );
    				}
    			} );
    	},
    	dequeue: function( type ) {
    		return this.each( function() {
    			jQuery.dequeue( this, type );
    		} );
    	},
    	clearQueue: function( type ) {
    		return this.queue( type || "fx", [] );
    	},

    	// Get a promise resolved when queues of a certain type
    	// are emptied (fx is the type by default)
    	promise: function( type, obj ) {
    		var tmp,
    			count = 1,
    			defer = jQuery.Deferred(),
    			elements = this,
    			i = this.length,
    			resolve = function() {
    				if ( !( --count ) ) {
    					defer.resolveWith( elements, [ elements ] );
    				}
    			};

    		if ( typeof type !== "string" ) {
    			obj = type;
    			type = undefined;
    		}
    		type = type || "fx";

    		while ( i-- ) {
    			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
    			if ( tmp && tmp.empty ) {
    				count++;
    				tmp.empty.add( resolve );
    			}
    		}
    		resolve();
    		return defer.promise( obj );
    	}
    } );
    var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

    var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


    var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

    var documentElement = document.documentElement;



    	var isAttached = function( elem ) {
    			return jQuery.contains( elem.ownerDocument, elem );
    		},
    		composed = { composed: true };

    	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
    	// Check attachment across shadow DOM boundaries when possible (gh-3504)
    	// Support: iOS 10.0-10.2 only
    	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
    	// leading to errors. We need to check for `getRootNode`.
    	if ( documentElement.getRootNode ) {
    		isAttached = function( elem ) {
    			return jQuery.contains( elem.ownerDocument, elem ) ||
    				elem.getRootNode( composed ) === elem.ownerDocument;
    		};
    	}
    var isHiddenWithinTree = function( elem, el ) {

    		// isHiddenWithinTree might be called from jQuery#filter function;
    		// in that case, element will be second argument
    		elem = el || elem;

    		// Inline style trumps all
    		return elem.style.display === "none" ||
    			elem.style.display === "" &&

    			// Otherwise, check computed style
    			// Support: Firefox <=43 - 45
    			// Disconnected elements can have computed display: none, so first confirm that elem is
    			// in the document.
    			isAttached( elem ) &&

    			jQuery.css( elem, "display" ) === "none";
    	};



    function adjustCSS( elem, prop, valueParts, tween ) {
    	var adjusted, scale,
    		maxIterations = 20,
    		currentValue = tween ?
    			function() {
    				return tween.cur();
    			} :
    			function() {
    				return jQuery.css( elem, prop, "" );
    			},
    		initial = currentValue(),
    		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

    		// Starting value computation is required for potential unit mismatches
    		initialInUnit = elem.nodeType &&
    			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
    			rcssNum.exec( jQuery.css( elem, prop ) );

    	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

    		// Support: Firefox <=54
    		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
    		initial = initial / 2;

    		// Trust units reported by jQuery.css
    		unit = unit || initialInUnit[ 3 ];

    		// Iteratively approximate from a nonzero starting point
    		initialInUnit = +initial || 1;

    		while ( maxIterations-- ) {

    			// Evaluate and update our best guess (doubling guesses that zero out).
    			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
    			jQuery.style( elem, prop, initialInUnit + unit );
    			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
    				maxIterations = 0;
    			}
    			initialInUnit = initialInUnit / scale;

    		}

    		initialInUnit = initialInUnit * 2;
    		jQuery.style( elem, prop, initialInUnit + unit );

    		// Make sure we update the tween properties later on
    		valueParts = valueParts || [];
    	}

    	if ( valueParts ) {
    		initialInUnit = +initialInUnit || +initial || 0;

    		// Apply relative offset (+=/-=) if specified
    		adjusted = valueParts[ 1 ] ?
    			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
    			+valueParts[ 2 ];
    		if ( tween ) {
    			tween.unit = unit;
    			tween.start = initialInUnit;
    			tween.end = adjusted;
    		}
    	}
    	return adjusted;
    }


    var defaultDisplayMap = {};

    function getDefaultDisplay( elem ) {
    	var temp,
    		doc = elem.ownerDocument,
    		nodeName = elem.nodeName,
    		display = defaultDisplayMap[ nodeName ];

    	if ( display ) {
    		return display;
    	}

    	temp = doc.body.appendChild( doc.createElement( nodeName ) );
    	display = jQuery.css( temp, "display" );

    	temp.parentNode.removeChild( temp );

    	if ( display === "none" ) {
    		display = "block";
    	}
    	defaultDisplayMap[ nodeName ] = display;

    	return display;
    }

    function showHide( elements, show ) {
    	var display, elem,
    		values = [],
    		index = 0,
    		length = elements.length;

    	// Determine new display value for elements that need to change
    	for ( ; index < length; index++ ) {
    		elem = elements[ index ];
    		if ( !elem.style ) {
    			continue;
    		}

    		display = elem.style.display;
    		if ( show ) {

    			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
    			// check is required in this first loop unless we have a nonempty display value (either
    			// inline or about-to-be-restored)
    			if ( display === "none" ) {
    				values[ index ] = dataPriv.get( elem, "display" ) || null;
    				if ( !values[ index ] ) {
    					elem.style.display = "";
    				}
    			}
    			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
    				values[ index ] = getDefaultDisplay( elem );
    			}
    		} else {
    			if ( display !== "none" ) {
    				values[ index ] = "none";

    				// Remember what we're overwriting
    				dataPriv.set( elem, "display", display );
    			}
    		}
    	}

    	// Set the display of the elements in a second loop to avoid constant reflow
    	for ( index = 0; index < length; index++ ) {
    		if ( values[ index ] != null ) {
    			elements[ index ].style.display = values[ index ];
    		}
    	}

    	return elements;
    }

    jQuery.fn.extend( {
    	show: function() {
    		return showHide( this, true );
    	},
    	hide: function() {
    		return showHide( this );
    	},
    	toggle: function( state ) {
    		if ( typeof state === "boolean" ) {
    			return state ? this.show() : this.hide();
    		}

    		return this.each( function() {
    			if ( isHiddenWithinTree( this ) ) {
    				jQuery( this ).show();
    			} else {
    				jQuery( this ).hide();
    			}
    		} );
    	}
    } );
    var rcheckableType = ( /^(?:checkbox|radio)$/i );

    var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

    var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



    ( function() {
    	var fragment = document.createDocumentFragment(),
    		div = fragment.appendChild( document.createElement( "div" ) ),
    		input = document.createElement( "input" );

    	// Support: Android 4.0 - 4.3 only
    	// Check state lost if the name is set (#11217)
    	// Support: Windows Web Apps (WWA)
    	// `name` and `type` must use .setAttribute for WWA (#14901)
    	input.setAttribute( "type", "radio" );
    	input.setAttribute( "checked", "checked" );
    	input.setAttribute( "name", "t" );

    	div.appendChild( input );

    	// Support: Android <=4.1 only
    	// Older WebKit doesn't clone checked state correctly in fragments
    	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

    	// Support: IE <=11 only
    	// Make sure textarea (and checkbox) defaultValue is properly cloned
    	div.innerHTML = "<textarea>x</textarea>";
    	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

    	// Support: IE <=9 only
    	// IE <=9 replaces <option> tags with their contents when inserted outside of
    	// the select element.
    	div.innerHTML = "<option></option>";
    	support.option = !!div.lastChild;
    } )();


    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {

    	// XHTML parsers do not magically insert elements in the
    	// same way that tag soup parsers do. So we cannot shorten
    	// this by omitting <tbody> or other required elements.
    	thead: [ 1, "<table>", "</table>" ],
    	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
    	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    	_default: [ 0, "", "" ]
    };

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // Support: IE <=9 only
    if ( !support.option ) {
    	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
    }


    function getAll( context, tag ) {

    	// Support: IE <=9 - 11 only
    	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
    	var ret;

    	if ( typeof context.getElementsByTagName !== "undefined" ) {
    		ret = context.getElementsByTagName( tag || "*" );

    	} else if ( typeof context.querySelectorAll !== "undefined" ) {
    		ret = context.querySelectorAll( tag || "*" );

    	} else {
    		ret = [];
    	}

    	if ( tag === undefined || tag && nodeName( context, tag ) ) {
    		return jQuery.merge( [ context ], ret );
    	}

    	return ret;
    }


    // Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
    	var i = 0,
    		l = elems.length;

    	for ( ; i < l; i++ ) {
    		dataPriv.set(
    			elems[ i ],
    			"globalEval",
    			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
    		);
    	}
    }


    var rhtml = /<|&#?\w+;/;

    function buildFragment( elems, context, scripts, selection, ignored ) {
    	var elem, tmp, tag, wrap, attached, j,
    		fragment = context.createDocumentFragment(),
    		nodes = [],
    		i = 0,
    		l = elems.length;

    	for ( ; i < l; i++ ) {
    		elem = elems[ i ];

    		if ( elem || elem === 0 ) {

    			// Add nodes directly
    			if ( toType( elem ) === "object" ) {

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

    			// Convert non-html into a text node
    			} else if ( !rhtml.test( elem ) ) {
    				nodes.push( context.createTextNode( elem ) );

    			// Convert html into DOM nodes
    			} else {
    				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

    				// Deserialize a standard representation
    				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
    				wrap = wrapMap[ tag ] || wrapMap._default;
    				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

    				// Descend through wrappers to the right content
    				j = wrap[ 0 ];
    				while ( j-- ) {
    					tmp = tmp.lastChild;
    				}

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, tmp.childNodes );

    				// Remember the top-level container
    				tmp = fragment.firstChild;

    				// Ensure the created nodes are orphaned (#12392)
    				tmp.textContent = "";
    			}
    		}
    	}

    	// Remove wrapper from fragment
    	fragment.textContent = "";

    	i = 0;
    	while ( ( elem = nodes[ i++ ] ) ) {

    		// Skip elements already in the context collection (trac-4087)
    		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
    			if ( ignored ) {
    				ignored.push( elem );
    			}
    			continue;
    		}

    		attached = isAttached( elem );

    		// Append to fragment
    		tmp = getAll( fragment.appendChild( elem ), "script" );

    		// Preserve script evaluation history
    		if ( attached ) {
    			setGlobalEval( tmp );
    		}

    		// Capture executables
    		if ( scripts ) {
    			j = 0;
    			while ( ( elem = tmp[ j++ ] ) ) {
    				if ( rscriptType.test( elem.type || "" ) ) {
    					scripts.push( elem );
    				}
    			}
    		}
    	}

    	return fragment;
    }


    var
    	rkeyEvent = /^key/,
    	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    function returnTrue() {
    	return true;
    }

    function returnFalse() {
    	return false;
    }

    // Support: IE <=9 - 11+
    // focus() and blur() are asynchronous, except when they are no-op.
    // So expect focus to be synchronous when the element is already active,
    // and blur to be synchronous when the element is not already active.
    // (focus and blur are always synchronous in other supported browsers,
    // this just defines when we can count on it).
    function expectSync( elem, type ) {
    	return ( elem === safeActiveElement() ) === ( type === "focus" );
    }

    // Support: IE <=9 only
    // Accessing document.activeElement can throw unexpectedly
    // https://bugs.jquery.com/ticket/13393
    function safeActiveElement() {
    	try {
    		return document.activeElement;
    	} catch ( err ) { }
    }

    function on( elem, types, selector, data, fn, one ) {
    	var origFn, type;

    	// Types can be a map of types/handlers
    	if ( typeof types === "object" ) {

    		// ( types-Object, selector, data )
    		if ( typeof selector !== "string" ) {

    			// ( types-Object, data )
    			data = data || selector;
    			selector = undefined;
    		}
    		for ( type in types ) {
    			on( elem, type, selector, data, types[ type ], one );
    		}
    		return elem;
    	}

    	if ( data == null && fn == null ) {

    		// ( types, fn )
    		fn = selector;
    		data = selector = undefined;
    	} else if ( fn == null ) {
    		if ( typeof selector === "string" ) {

    			// ( types, selector, fn )
    			fn = data;
    			data = undefined;
    		} else {

    			// ( types, data, fn )
    			fn = data;
    			data = selector;
    			selector = undefined;
    		}
    	}
    	if ( fn === false ) {
    		fn = returnFalse;
    	} else if ( !fn ) {
    		return elem;
    	}

    	if ( one === 1 ) {
    		origFn = fn;
    		fn = function( event ) {

    			// Can use an empty set, since event contains the info
    			jQuery().off( event );
    			return origFn.apply( this, arguments );
    		};

    		// Use same guid so caller can remove using origFn
    		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    	}
    	return elem.each( function() {
    		jQuery.event.add( this, types, fn, data, selector );
    	} );
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

    	global: {},

    	add: function( elem, types, handler, data, selector ) {

    		var handleObjIn, eventHandle, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.get( elem );

    		// Only attach events to objects that accept data
    		if ( !acceptData( elem ) ) {
    			return;
    		}

    		// Caller can pass in an object of custom data in lieu of the handler
    		if ( handler.handler ) {
    			handleObjIn = handler;
    			handler = handleObjIn.handler;
    			selector = handleObjIn.selector;
    		}

    		// Ensure that invalid selectors throw exceptions at attach time
    		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
    		if ( selector ) {
    			jQuery.find.matchesSelector( documentElement, selector );
    		}

    		// Make sure that the handler has a unique ID, used to find/remove it later
    		if ( !handler.guid ) {
    			handler.guid = jQuery.guid++;
    		}

    		// Init the element's event structure and main handler, if this is the first
    		if ( !( events = elemData.events ) ) {
    			events = elemData.events = Object.create( null );
    		}
    		if ( !( eventHandle = elemData.handle ) ) {
    			eventHandle = elemData.handle = function( e ) {

    				// Discard the second event of a jQuery.event.trigger() and
    				// when an event is called after a page has unloaded
    				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
    					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    			};
    		}

    		// Handle multiple events separated by a space
    		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    			// There *must* be a type, no attaching namespace-only handlers
    			if ( !type ) {
    				continue;
    			}

    			// If event changes its type, use the special event handlers for the changed type
    			special = jQuery.event.special[ type ] || {};

    			// If selector defined, determine special event api type, otherwise given type
    			type = ( selector ? special.delegateType : special.bindType ) || type;

    			// Update special based on newly reset type
    			special = jQuery.event.special[ type ] || {};

    			// handleObj is passed to all event handlers
    			handleObj = jQuery.extend( {
    				type: type,
    				origType: origType,
    				data: data,
    				handler: handler,
    				guid: handler.guid,
    				selector: selector,
    				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
    				namespace: namespaces.join( "." )
    			}, handleObjIn );

    			// Init the event handler queue if we're the first
    			if ( !( handlers = events[ type ] ) ) {
    				handlers = events[ type ] = [];
    				handlers.delegateCount = 0;

    				// Only use addEventListener if the special events handler returns false
    				if ( !special.setup ||
    					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

    					if ( elem.addEventListener ) {
    						elem.addEventListener( type, eventHandle );
    					}
    				}
    			}

    			if ( special.add ) {
    				special.add.call( elem, handleObj );

    				if ( !handleObj.handler.guid ) {
    					handleObj.handler.guid = handler.guid;
    				}
    			}

    			// Add to the element's handler list, delegates in front
    			if ( selector ) {
    				handlers.splice( handlers.delegateCount++, 0, handleObj );
    			} else {
    				handlers.push( handleObj );
    			}

    			// Keep track of which events have ever been used, for event optimization
    			jQuery.event.global[ type ] = true;
    		}

    	},

    	// Detach an event or set of events from an element
    	remove: function( elem, types, handler, selector, mappedTypes ) {

    		var j, origCount, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

    		if ( !elemData || !( events = elemData.events ) ) {
    			return;
    		}

    		// Once for each type.namespace in types; type may be omitted
    		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    			// Unbind all events (on this namespace, if provided) for the element
    			if ( !type ) {
    				for ( type in events ) {
    					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
    				}
    				continue;
    			}

    			special = jQuery.event.special[ type ] || {};
    			type = ( selector ? special.delegateType : special.bindType ) || type;
    			handlers = events[ type ] || [];
    			tmp = tmp[ 2 ] &&
    				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

    			// Remove matching events
    			origCount = j = handlers.length;
    			while ( j-- ) {
    				handleObj = handlers[ j ];

    				if ( ( mappedTypes || origType === handleObj.origType ) &&
    					( !handler || handler.guid === handleObj.guid ) &&
    					( !tmp || tmp.test( handleObj.namespace ) ) &&
    					( !selector || selector === handleObj.selector ||
    						selector === "**" && handleObj.selector ) ) {
    					handlers.splice( j, 1 );

    					if ( handleObj.selector ) {
    						handlers.delegateCount--;
    					}
    					if ( special.remove ) {
    						special.remove.call( elem, handleObj );
    					}
    				}
    			}

    			// Remove generic event handler if we removed something and no more handlers exist
    			// (avoids potential for endless recursion during removal of special event handlers)
    			if ( origCount && !handlers.length ) {
    				if ( !special.teardown ||
    					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

    					jQuery.removeEvent( elem, type, elemData.handle );
    				}

    				delete events[ type ];
    			}
    		}

    		// Remove data and the expando if it's no longer used
    		if ( jQuery.isEmptyObject( events ) ) {
    			dataPriv.remove( elem, "handle events" );
    		}
    	},

    	dispatch: function( nativeEvent ) {

    		var i, j, ret, matched, handleObj, handlerQueue,
    			args = new Array( arguments.length ),

    			// Make a writable jQuery.Event from the native event object
    			event = jQuery.event.fix( nativeEvent ),

    			handlers = (
    					dataPriv.get( this, "events" ) || Object.create( null )
    				)[ event.type ] || [],
    			special = jQuery.event.special[ event.type ] || {};

    		// Use the fix-ed jQuery.Event rather than the (read-only) native event
    		args[ 0 ] = event;

    		for ( i = 1; i < arguments.length; i++ ) {
    			args[ i ] = arguments[ i ];
    		}

    		event.delegateTarget = this;

    		// Call the preDispatch hook for the mapped type, and let it bail if desired
    		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
    			return;
    		}

    		// Determine handlers
    		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

    		// Run delegates first; they may want to stop propagation beneath us
    		i = 0;
    		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
    			event.currentTarget = matched.elem;

    			j = 0;
    			while ( ( handleObj = matched.handlers[ j++ ] ) &&
    				!event.isImmediatePropagationStopped() ) {

    				// If the event is namespaced, then each handler is only invoked if it is
    				// specially universal or its namespaces are a superset of the event's.
    				if ( !event.rnamespace || handleObj.namespace === false ||
    					event.rnamespace.test( handleObj.namespace ) ) {

    					event.handleObj = handleObj;
    					event.data = handleObj.data;

    					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
    						handleObj.handler ).apply( matched.elem, args );

    					if ( ret !== undefined ) {
    						if ( ( event.result = ret ) === false ) {
    							event.preventDefault();
    							event.stopPropagation();
    						}
    					}
    				}
    			}
    		}

    		// Call the postDispatch hook for the mapped type
    		if ( special.postDispatch ) {
    			special.postDispatch.call( this, event );
    		}

    		return event.result;
    	},

    	handlers: function( event, handlers ) {
    		var i, handleObj, sel, matchedHandlers, matchedSelectors,
    			handlerQueue = [],
    			delegateCount = handlers.delegateCount,
    			cur = event.target;

    		// Find delegate handlers
    		if ( delegateCount &&

    			// Support: IE <=9
    			// Black-hole SVG <use> instance trees (trac-13180)
    			cur.nodeType &&

    			// Support: Firefox <=42
    			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    			// Support: IE 11 only
    			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    			!( event.type === "click" && event.button >= 1 ) ) {

    			for ( ; cur !== this; cur = cur.parentNode || this ) {

    				// Don't check non-elements (#13208)
    				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
    				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
    					matchedHandlers = [];
    					matchedSelectors = {};
    					for ( i = 0; i < delegateCount; i++ ) {
    						handleObj = handlers[ i ];

    						// Don't conflict with Object.prototype properties (#13203)
    						sel = handleObj.selector + " ";

    						if ( matchedSelectors[ sel ] === undefined ) {
    							matchedSelectors[ sel ] = handleObj.needsContext ?
    								jQuery( sel, this ).index( cur ) > -1 :
    								jQuery.find( sel, this, null, [ cur ] ).length;
    						}
    						if ( matchedSelectors[ sel ] ) {
    							matchedHandlers.push( handleObj );
    						}
    					}
    					if ( matchedHandlers.length ) {
    						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
    					}
    				}
    			}
    		}

    		// Add the remaining (directly-bound) handlers
    		cur = this;
    		if ( delegateCount < handlers.length ) {
    			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
    		}

    		return handlerQueue;
    	},

    	addProp: function( name, hook ) {
    		Object.defineProperty( jQuery.Event.prototype, name, {
    			enumerable: true,
    			configurable: true,

    			get: isFunction( hook ) ?
    				function() {
    					if ( this.originalEvent ) {
    							return hook( this.originalEvent );
    					}
    				} :
    				function() {
    					if ( this.originalEvent ) {
    							return this.originalEvent[ name ];
    					}
    				},

    			set: function( value ) {
    				Object.defineProperty( this, name, {
    					enumerable: true,
    					configurable: true,
    					writable: true,
    					value: value
    				} );
    			}
    		} );
    	},

    	fix: function( originalEvent ) {
    		return originalEvent[ jQuery.expando ] ?
    			originalEvent :
    			new jQuery.Event( originalEvent );
    	},

    	special: {
    		load: {

    			// Prevent triggered image.load events from bubbling to window.load
    			noBubble: true
    		},
    		click: {

    			// Utilize native event to ensure correct state for checkable inputs
    			setup: function( data ) {

    				// For mutual compressibility with _default, replace `this` access with a local var.
    				// `|| data` is dead code meant only to preserve the variable through minification.
    				var el = this || data;

    				// Claim the first handler
    				if ( rcheckableType.test( el.type ) &&
    					el.click && nodeName( el, "input" ) ) {

    					// dataPriv.set( el, "click", ... )
    					leverageNative( el, "click", returnTrue );
    				}

    				// Return false to allow normal processing in the caller
    				return false;
    			},
    			trigger: function( data ) {

    				// For mutual compressibility with _default, replace `this` access with a local var.
    				// `|| data` is dead code meant only to preserve the variable through minification.
    				var el = this || data;

    				// Force setup before triggering a click
    				if ( rcheckableType.test( el.type ) &&
    					el.click && nodeName( el, "input" ) ) {

    					leverageNative( el, "click" );
    				}

    				// Return non-false to allow normal event-path propagation
    				return true;
    			},

    			// For cross-browser consistency, suppress native .click() on links
    			// Also prevent it if we're currently inside a leveraged native-event stack
    			_default: function( event ) {
    				var target = event.target;
    				return rcheckableType.test( target.type ) &&
    					target.click && nodeName( target, "input" ) &&
    					dataPriv.get( target, "click" ) ||
    					nodeName( target, "a" );
    			}
    		},

    		beforeunload: {
    			postDispatch: function( event ) {

    				// Support: Firefox 20+
    				// Firefox doesn't alert if the returnValue field is not set.
    				if ( event.result !== undefined && event.originalEvent ) {
    					event.originalEvent.returnValue = event.result;
    				}
    			}
    		}
    	}
    };

    // Ensure the presence of an event listener that handles manually-triggered
    // synthetic events by interrupting progress until reinvoked in response to
    // *native* events that it fires directly, ensuring that state changes have
    // already occurred before other listeners are invoked.
    function leverageNative( el, type, expectSync ) {

    	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
    	if ( !expectSync ) {
    		if ( dataPriv.get( el, type ) === undefined ) {
    			jQuery.event.add( el, type, returnTrue );
    		}
    		return;
    	}

    	// Register the controller as a special universal handler for all event namespaces
    	dataPriv.set( el, type, false );
    	jQuery.event.add( el, type, {
    		namespace: false,
    		handler: function( event ) {
    			var notAsync, result,
    				saved = dataPriv.get( this, type );

    			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

    				// Interrupt processing of the outer synthetic .trigger()ed event
    				// Saved data should be false in such cases, but might be a leftover capture object
    				// from an async native handler (gh-4350)
    				if ( !saved.length ) {

    					// Store arguments for use when handling the inner native event
    					// There will always be at least one argument (an event object), so this array
    					// will not be confused with a leftover capture object.
    					saved = slice.call( arguments );
    					dataPriv.set( this, type, saved );

    					// Trigger the native event and capture its result
    					// Support: IE <=9 - 11+
    					// focus() and blur() are asynchronous
    					notAsync = expectSync( this, type );
    					this[ type ]();
    					result = dataPriv.get( this, type );
    					if ( saved !== result || notAsync ) {
    						dataPriv.set( this, type, false );
    					} else {
    						result = {};
    					}
    					if ( saved !== result ) {

    						// Cancel the outer synthetic event
    						event.stopImmediatePropagation();
    						event.preventDefault();
    						return result.value;
    					}

    				// If this is an inner synthetic event for an event with a bubbling surrogate
    				// (focus or blur), assume that the surrogate already propagated from triggering the
    				// native event and prevent that from happening again here.
    				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
    				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
    				// less bad than duplication.
    				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
    					event.stopPropagation();
    				}

    			// If this is a native event triggered above, everything is now in order
    			// Fire an inner synthetic event with the original arguments
    			} else if ( saved.length ) {

    				// ...and capture the result
    				dataPriv.set( this, type, {
    					value: jQuery.event.trigger(

    						// Support: IE <=9 - 11+
    						// Extend with the prototype to reset the above stopImmediatePropagation()
    						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
    						saved.slice( 1 ),
    						this
    					)
    				} );

    				// Abort handling of the native event
    				event.stopImmediatePropagation();
    			}
    		}
    	} );
    }

    jQuery.removeEvent = function( elem, type, handle ) {

    	// This "if" is needed for plain objects
    	if ( elem.removeEventListener ) {
    		elem.removeEventListener( type, handle );
    	}
    };

    jQuery.Event = function( src, props ) {

    	// Allow instantiation without the 'new' keyword
    	if ( !( this instanceof jQuery.Event ) ) {
    		return new jQuery.Event( src, props );
    	}

    	// Event object
    	if ( src && src.type ) {
    		this.originalEvent = src;
    		this.type = src.type;

    		// Events bubbling up the document may have been marked as prevented
    		// by a handler lower down the tree; reflect the correct value.
    		this.isDefaultPrevented = src.defaultPrevented ||
    				src.defaultPrevented === undefined &&

    				// Support: Android <=2.3 only
    				src.returnValue === false ?
    			returnTrue :
    			returnFalse;

    		// Create target properties
    		// Support: Safari <=6 - 7 only
    		// Target should not be a text node (#504, #13143)
    		this.target = ( src.target && src.target.nodeType === 3 ) ?
    			src.target.parentNode :
    			src.target;

    		this.currentTarget = src.currentTarget;
    		this.relatedTarget = src.relatedTarget;

    	// Event type
    	} else {
    		this.type = src;
    	}

    	// Put explicitly provided properties onto the event object
    	if ( props ) {
    		jQuery.extend( this, props );
    	}

    	// Create a timestamp if incoming event doesn't have one
    	this.timeStamp = src && src.timeStamp || Date.now();

    	// Mark it as fixed
    	this[ jQuery.expando ] = true;
    };

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
    	constructor: jQuery.Event,
    	isDefaultPrevented: returnFalse,
    	isPropagationStopped: returnFalse,
    	isImmediatePropagationStopped: returnFalse,
    	isSimulated: false,

    	preventDefault: function() {
    		var e = this.originalEvent;

    		this.isDefaultPrevented = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.preventDefault();
    		}
    	},
    	stopPropagation: function() {
    		var e = this.originalEvent;

    		this.isPropagationStopped = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.stopPropagation();
    		}
    	},
    	stopImmediatePropagation: function() {
    		var e = this.originalEvent;

    		this.isImmediatePropagationStopped = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.stopImmediatePropagation();
    		}

    		this.stopPropagation();
    	}
    };

    // Includes all common event props including KeyEvent and MouseEvent specific props
    jQuery.each( {
    	altKey: true,
    	bubbles: true,
    	cancelable: true,
    	changedTouches: true,
    	ctrlKey: true,
    	detail: true,
    	eventPhase: true,
    	metaKey: true,
    	pageX: true,
    	pageY: true,
    	shiftKey: true,
    	view: true,
    	"char": true,
    	code: true,
    	charCode: true,
    	key: true,
    	keyCode: true,
    	button: true,
    	buttons: true,
    	clientX: true,
    	clientY: true,
    	offsetX: true,
    	offsetY: true,
    	pointerId: true,
    	pointerType: true,
    	screenX: true,
    	screenY: true,
    	targetTouches: true,
    	toElement: true,
    	touches: true,

    	which: function( event ) {
    		var button = event.button;

    		// Add which for key events
    		if ( event.which == null && rkeyEvent.test( event.type ) ) {
    			return event.charCode != null ? event.charCode : event.keyCode;
    		}

    		// Add which for click: 1 === left; 2 === middle; 3 === right
    		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
    			if ( button & 1 ) {
    				return 1;
    			}

    			if ( button & 2 ) {
    				return 3;
    			}

    			if ( button & 4 ) {
    				return 2;
    			}

    			return 0;
    		}

    		return event.which;
    	}
    }, jQuery.event.addProp );

    jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
    	jQuery.event.special[ type ] = {

    		// Utilize native event if possible so blur/focus sequence is correct
    		setup: function() {

    			// Claim the first handler
    			// dataPriv.set( this, "focus", ... )
    			// dataPriv.set( this, "blur", ... )
    			leverageNative( this, type, expectSync );

    			// Return false to allow normal processing in the caller
    			return false;
    		},
    		trigger: function() {

    			// Force setup before trigger
    			leverageNative( this, type );

    			// Return non-false to allow normal event-path propagation
    			return true;
    		},

    		delegateType: delegateType
    	};
    } );

    // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each( {
    	mouseenter: "mouseover",
    	mouseleave: "mouseout",
    	pointerenter: "pointerover",
    	pointerleave: "pointerout"
    }, function( orig, fix ) {
    	jQuery.event.special[ orig ] = {
    		delegateType: fix,
    		bindType: fix,

    		handle: function( event ) {
    			var ret,
    				target = this,
    				related = event.relatedTarget,
    				handleObj = event.handleObj;

    			// For mouseenter/leave call the handler if related is outside the target.
    			// NB: No relatedTarget if the mouse left/entered the browser window
    			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
    				event.type = handleObj.origType;
    				ret = handleObj.handler.apply( this, arguments );
    				event.type = fix;
    			}
    			return ret;
    		}
    	};
    } );

    jQuery.fn.extend( {

    	on: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn );
    	},
    	one: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn, 1 );
    	},
    	off: function( types, selector, fn ) {
    		var handleObj, type;
    		if ( types && types.preventDefault && types.handleObj ) {

    			// ( event )  dispatched jQuery.Event
    			handleObj = types.handleObj;
    			jQuery( types.delegateTarget ).off(
    				handleObj.namespace ?
    					handleObj.origType + "." + handleObj.namespace :
    					handleObj.origType,
    				handleObj.selector,
    				handleObj.handler
    			);
    			return this;
    		}
    		if ( typeof types === "object" ) {

    			// ( types-object [, selector] )
    			for ( type in types ) {
    				this.off( type, selector, types[ type ] );
    			}
    			return this;
    		}
    		if ( selector === false || typeof selector === "function" ) {

    			// ( types [, fn] )
    			fn = selector;
    			selector = undefined;
    		}
    		if ( fn === false ) {
    			fn = returnFalse;
    		}
    		return this.each( function() {
    			jQuery.event.remove( this, types, fn, selector );
    		} );
    	}
    } );


    var

    	// Support: IE <=10 - 11, Edge 12 - 13 only
    	// In IE/Edge using regex groups here causes severe slowdowns.
    	// See https://connect.microsoft.com/IE/feedback/details/1736512/
    	rnoInnerhtml = /<script|<style|<link/i,

    	// checked="checked" or checked
    	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    // Prefer a tbody over its parent table for containing new rows
    function manipulationTarget( elem, content ) {
    	if ( nodeName( elem, "table" ) &&
    		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

    		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
    	}

    	return elem;
    }

    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
    	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
    	return elem;
    }
    function restoreScript( elem ) {
    	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
    		elem.type = elem.type.slice( 5 );
    	} else {
    		elem.removeAttribute( "type" );
    	}

    	return elem;
    }

    function cloneCopyEvent( src, dest ) {
    	var i, l, type, pdataOld, udataOld, udataCur, events;

    	if ( dest.nodeType !== 1 ) {
    		return;
    	}

    	// 1. Copy private data: events, handlers, etc.
    	if ( dataPriv.hasData( src ) ) {
    		pdataOld = dataPriv.get( src );
    		events = pdataOld.events;

    		if ( events ) {
    			dataPriv.remove( dest, "handle events" );

    			for ( type in events ) {
    				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
    					jQuery.event.add( dest, type, events[ type ][ i ] );
    				}
    			}
    		}
    	}

    	// 2. Copy user data
    	if ( dataUser.hasData( src ) ) {
    		udataOld = dataUser.access( src );
    		udataCur = jQuery.extend( {}, udataOld );

    		dataUser.set( dest, udataCur );
    	}
    }

    // Fix IE bugs, see support tests
    function fixInput( src, dest ) {
    	var nodeName = dest.nodeName.toLowerCase();

    	// Fails to persist the checked state of a cloned checkbox or radio button.
    	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    		dest.checked = src.checked;

    	// Fails to return the selected option to the default selected state when cloning options
    	} else if ( nodeName === "input" || nodeName === "textarea" ) {
    		dest.defaultValue = src.defaultValue;
    	}
    }

    function domManip( collection, args, callback, ignored ) {

    	// Flatten any nested arrays
    	args = flat( args );

    	var fragment, first, scripts, hasScripts, node, doc,
    		i = 0,
    		l = collection.length,
    		iNoClone = l - 1,
    		value = args[ 0 ],
    		valueIsFunction = isFunction( value );

    	// We can't cloneNode fragments that contain checked, in WebKit
    	if ( valueIsFunction ||
    			( l > 1 && typeof value === "string" &&
    				!support.checkClone && rchecked.test( value ) ) ) {
    		return collection.each( function( index ) {
    			var self = collection.eq( index );
    			if ( valueIsFunction ) {
    				args[ 0 ] = value.call( this, index, self.html() );
    			}
    			domManip( self, args, callback, ignored );
    		} );
    	}

    	if ( l ) {
    		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
    		first = fragment.firstChild;

    		if ( fragment.childNodes.length === 1 ) {
    			fragment = first;
    		}

    		// Require either new content or an interest in ignored elements to invoke the callback
    		if ( first || ignored ) {
    			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
    			hasScripts = scripts.length;

    			// Use the original fragment for the last item
    			// instead of the first because it can end up
    			// being emptied incorrectly in certain situations (#8070).
    			for ( ; i < l; i++ ) {
    				node = fragment;

    				if ( i !== iNoClone ) {
    					node = jQuery.clone( node, true, true );

    					// Keep references to cloned scripts for later restoration
    					if ( hasScripts ) {

    						// Support: Android <=4.0 only, PhantomJS 1 only
    						// push.apply(_, arraylike) throws on ancient WebKit
    						jQuery.merge( scripts, getAll( node, "script" ) );
    					}
    				}

    				callback.call( collection[ i ], node, i );
    			}

    			if ( hasScripts ) {
    				doc = scripts[ scripts.length - 1 ].ownerDocument;

    				// Reenable scripts
    				jQuery.map( scripts, restoreScript );

    				// Evaluate executable scripts on first document insertion
    				for ( i = 0; i < hasScripts; i++ ) {
    					node = scripts[ i ];
    					if ( rscriptType.test( node.type || "" ) &&
    						!dataPriv.access( node, "globalEval" ) &&
    						jQuery.contains( doc, node ) ) {

    						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

    							// Optional AJAX dependency, but won't run scripts if not present
    							if ( jQuery._evalUrl && !node.noModule ) {
    								jQuery._evalUrl( node.src, {
    									nonce: node.nonce || node.getAttribute( "nonce" )
    								}, doc );
    							}
    						} else {
    							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
    						}
    					}
    				}
    			}
    		}
    	}

    	return collection;
    }

    function remove( elem, selector, keepData ) {
    	var node,
    		nodes = selector ? jQuery.filter( selector, elem ) : elem,
    		i = 0;

    	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
    		if ( !keepData && node.nodeType === 1 ) {
    			jQuery.cleanData( getAll( node ) );
    		}

    		if ( node.parentNode ) {
    			if ( keepData && isAttached( node ) ) {
    				setGlobalEval( getAll( node, "script" ) );
    			}
    			node.parentNode.removeChild( node );
    		}
    	}

    	return elem;
    }

    jQuery.extend( {
    	htmlPrefilter: function( html ) {
    		return html;
    	},

    	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    		var i, l, srcElements, destElements,
    			clone = elem.cloneNode( true ),
    			inPage = isAttached( elem );

    		// Fix IE cloning issues
    		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
    				!jQuery.isXMLDoc( elem ) ) {

    			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
    			destElements = getAll( clone );
    			srcElements = getAll( elem );

    			for ( i = 0, l = srcElements.length; i < l; i++ ) {
    				fixInput( srcElements[ i ], destElements[ i ] );
    			}
    		}

    		// Copy the events from the original to the clone
    		if ( dataAndEvents ) {
    			if ( deepDataAndEvents ) {
    				srcElements = srcElements || getAll( elem );
    				destElements = destElements || getAll( clone );

    				for ( i = 0, l = srcElements.length; i < l; i++ ) {
    					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
    				}
    			} else {
    				cloneCopyEvent( elem, clone );
    			}
    		}

    		// Preserve script evaluation history
    		destElements = getAll( clone, "script" );
    		if ( destElements.length > 0 ) {
    			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    		}

    		// Return the cloned set
    		return clone;
    	},

    	cleanData: function( elems ) {
    		var data, elem, type,
    			special = jQuery.event.special,
    			i = 0;

    		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
    			if ( acceptData( elem ) ) {
    				if ( ( data = elem[ dataPriv.expando ] ) ) {
    					if ( data.events ) {
    						for ( type in data.events ) {
    							if ( special[ type ] ) {
    								jQuery.event.remove( elem, type );

    							// This is a shortcut to avoid jQuery.event.remove's overhead
    							} else {
    								jQuery.removeEvent( elem, type, data.handle );
    							}
    						}
    					}

    					// Support: Chrome <=35 - 45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataPriv.expando ] = undefined;
    				}
    				if ( elem[ dataUser.expando ] ) {

    					// Support: Chrome <=35 - 45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataUser.expando ] = undefined;
    				}
    			}
    		}
    	}
    } );

    jQuery.fn.extend( {
    	detach: function( selector ) {
    		return remove( this, selector, true );
    	},

    	remove: function( selector ) {
    		return remove( this, selector );
    	},

    	text: function( value ) {
    		return access( this, function( value ) {
    			return value === undefined ?
    				jQuery.text( this ) :
    				this.empty().each( function() {
    					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    						this.textContent = value;
    					}
    				} );
    		}, null, value, arguments.length );
    	},

    	append: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.appendChild( elem );
    			}
    		} );
    	},

    	prepend: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.insertBefore( elem, target.firstChild );
    			}
    		} );
    	},

    	before: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this );
    			}
    		} );
    	},

    	after: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this.nextSibling );
    			}
    		} );
    	},

    	empty: function() {
    		var elem,
    			i = 0;

    		for ( ; ( elem = this[ i ] ) != null; i++ ) {
    			if ( elem.nodeType === 1 ) {

    				// Prevent memory leaks
    				jQuery.cleanData( getAll( elem, false ) );

    				// Remove any remaining nodes
    				elem.textContent = "";
    			}
    		}

    		return this;
    	},

    	clone: function( dataAndEvents, deepDataAndEvents ) {
    		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    		return this.map( function() {
    			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    		} );
    	},

    	html: function( value ) {
    		return access( this, function( value ) {
    			var elem = this[ 0 ] || {},
    				i = 0,
    				l = this.length;

    			if ( value === undefined && elem.nodeType === 1 ) {
    				return elem.innerHTML;
    			}

    			// See if we can take a shortcut and just use innerHTML
    			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
    				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

    				value = jQuery.htmlPrefilter( value );

    				try {
    					for ( ; i < l; i++ ) {
    						elem = this[ i ] || {};

    						// Remove element nodes and prevent memory leaks
    						if ( elem.nodeType === 1 ) {
    							jQuery.cleanData( getAll( elem, false ) );
    							elem.innerHTML = value;
    						}
    					}

    					elem = 0;

    				// If using innerHTML throws an exception, use the fallback method
    				} catch ( e ) {}
    			}

    			if ( elem ) {
    				this.empty().append( value );
    			}
    		}, null, value, arguments.length );
    	},

    	replaceWith: function() {
    		var ignored = [];

    		// Make the changes, replacing each non-ignored context element with the new content
    		return domManip( this, arguments, function( elem ) {
    			var parent = this.parentNode;

    			if ( jQuery.inArray( this, ignored ) < 0 ) {
    				jQuery.cleanData( getAll( this ) );
    				if ( parent ) {
    					parent.replaceChild( elem, this );
    				}
    			}

    		// Force callback invocation
    		}, ignored );
    	}
    } );

    jQuery.each( {
    	appendTo: "append",
    	prependTo: "prepend",
    	insertBefore: "before",
    	insertAfter: "after",
    	replaceAll: "replaceWith"
    }, function( name, original ) {
    	jQuery.fn[ name ] = function( selector ) {
    		var elems,
    			ret = [],
    			insert = jQuery( selector ),
    			last = insert.length - 1,
    			i = 0;

    		for ( ; i <= last; i++ ) {
    			elems = i === last ? this : this.clone( true );
    			jQuery( insert[ i ] )[ original ]( elems );

    			// Support: Android <=4.0 only, PhantomJS 1 only
    			// .get() because push.apply(_, arraylike) throws on ancient WebKit
    			push.apply( ret, elems.get() );
    		}

    		return this.pushStack( ret );
    	};
    } );
    var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

    var getStyles = function( elem ) {

    		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    		// IE throws on elements created in popups
    		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    		var view = elem.ownerDocument.defaultView;

    		if ( !view || !view.opener ) {
    			view = window;
    		}

    		return view.getComputedStyle( elem );
    	};

    var swap = function( elem, options, callback ) {
    	var ret, name,
    		old = {};

    	// Remember the old values, and insert the new ones
    	for ( name in options ) {
    		old[ name ] = elem.style[ name ];
    		elem.style[ name ] = options[ name ];
    	}

    	ret = callback.call( elem );

    	// Revert the old values
    	for ( name in options ) {
    		elem.style[ name ] = old[ name ];
    	}

    	return ret;
    };


    var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



    ( function() {

    	// Executing both pixelPosition & boxSizingReliable tests require only one layout
    	// so they're executed at the same time to save the second computation.
    	function computeStyleTests() {

    		// This is a singleton, we need to execute it only once
    		if ( !div ) {
    			return;
    		}

    		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
    			"margin-top:1px;padding:0;border:0";
    		div.style.cssText =
    			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
    			"margin:auto;border:1px;padding:1px;" +
    			"width:60%;top:1%";
    		documentElement.appendChild( container ).appendChild( div );

    		var divStyle = window.getComputedStyle( div );
    		pixelPositionVal = divStyle.top !== "1%";

    		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
    		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

    		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
    		// Some styles come back with percentage values, even though they shouldn't
    		div.style.right = "60%";
    		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

    		// Support: IE 9 - 11 only
    		// Detect misreporting of content dimensions for box-sizing:border-box elements
    		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

    		// Support: IE 9 only
    		// Detect overflow:scroll screwiness (gh-3699)
    		// Support: Chrome <=64
    		// Don't get tricked when zoom affects offsetWidth (gh-4029)
    		div.style.position = "absolute";
    		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

    		documentElement.removeChild( container );

    		// Nullify the div so it wouldn't be stored in the memory and
    		// it will also be a sign that checks already performed
    		div = null;
    	}

    	function roundPixelMeasures( measure ) {
    		return Math.round( parseFloat( measure ) );
    	}

    	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
    		reliableTrDimensionsVal, reliableMarginLeftVal,
    		container = document.createElement( "div" ),
    		div = document.createElement( "div" );

    	// Finish early in limited (non-browser) environments
    	if ( !div.style ) {
    		return;
    	}

    	// Support: IE <=9 - 11 only
    	// Style of cloned element affects source element cloned (#8908)
    	div.style.backgroundClip = "content-box";
    	div.cloneNode( true ).style.backgroundClip = "";
    	support.clearCloneStyle = div.style.backgroundClip === "content-box";

    	jQuery.extend( support, {
    		boxSizingReliable: function() {
    			computeStyleTests();
    			return boxSizingReliableVal;
    		},
    		pixelBoxStyles: function() {
    			computeStyleTests();
    			return pixelBoxStylesVal;
    		},
    		pixelPosition: function() {
    			computeStyleTests();
    			return pixelPositionVal;
    		},
    		reliableMarginLeft: function() {
    			computeStyleTests();
    			return reliableMarginLeftVal;
    		},
    		scrollboxSize: function() {
    			computeStyleTests();
    			return scrollboxSizeVal;
    		},

    		// Support: IE 9 - 11+, Edge 15 - 18+
    		// IE/Edge misreport `getComputedStyle` of table rows with width/height
    		// set in CSS while `offset*` properties report correct values.
    		// Behavior in IE 9 is more subtle than in newer versions & it passes
    		// some versions of this test; make sure not to make it pass there!
    		reliableTrDimensions: function() {
    			var table, tr, trChild, trStyle;
    			if ( reliableTrDimensionsVal == null ) {
    				table = document.createElement( "table" );
    				tr = document.createElement( "tr" );
    				trChild = document.createElement( "div" );

    				table.style.cssText = "position:absolute;left:-11111px";
    				tr.style.height = "1px";
    				trChild.style.height = "9px";

    				documentElement
    					.appendChild( table )
    					.appendChild( tr )
    					.appendChild( trChild );

    				trStyle = window.getComputedStyle( tr );
    				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

    				documentElement.removeChild( table );
    			}
    			return reliableTrDimensionsVal;
    		}
    	} );
    } )();


    function curCSS( elem, name, computed ) {
    	var width, minWidth, maxWidth, ret,

    		// Support: Firefox 51+
    		// Retrieving style before computed somehow
    		// fixes an issue with getting wrong values
    		// on detached elements
    		style = elem.style;

    	computed = computed || getStyles( elem );

    	// getPropertyValue is needed for:
    	//   .css('filter') (IE 9 only, #12537)
    	//   .css('--customProperty) (#3144)
    	if ( computed ) {
    		ret = computed.getPropertyValue( name ) || computed[ name ];

    		if ( ret === "" && !isAttached( elem ) ) {
    			ret = jQuery.style( elem, name );
    		}

    		// A tribute to the "awesome hack by Dean Edwards"
    		// Android Browser returns percentage for some values,
    		// but width seems to be reliably pixels.
    		// This is against the CSSOM draft spec:
    		// https://drafts.csswg.org/cssom/#resolved-values
    		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

    			// Remember the original values
    			width = style.width;
    			minWidth = style.minWidth;
    			maxWidth = style.maxWidth;

    			// Put in the new values to get a computed value out
    			style.minWidth = style.maxWidth = style.width = ret;
    			ret = computed.width;

    			// Revert the changed values
    			style.width = width;
    			style.minWidth = minWidth;
    			style.maxWidth = maxWidth;
    		}
    	}

    	return ret !== undefined ?

    		// Support: IE <=9 - 11 only
    		// IE returns zIndex value as an integer.
    		ret + "" :
    		ret;
    }


    function addGetHookIf( conditionFn, hookFn ) {

    	// Define the hook, we'll check on the first run if it's really needed.
    	return {
    		get: function() {
    			if ( conditionFn() ) {

    				// Hook not needed (or it's not possible to use it due
    				// to missing dependency), remove it.
    				delete this.get;
    				return;
    			}

    			// Hook needed; redefine it so that the support test is not executed again.
    			return ( this.get = hookFn ).apply( this, arguments );
    		}
    	};
    }


    var cssPrefixes = [ "Webkit", "Moz", "ms" ],
    	emptyStyle = document.createElement( "div" ).style,
    	vendorProps = {};

    // Return a vendor-prefixed property or undefined
    function vendorPropName( name ) {

    	// Check for vendor prefixed names
    	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
    		i = cssPrefixes.length;

    	while ( i-- ) {
    		name = cssPrefixes[ i ] + capName;
    		if ( name in emptyStyle ) {
    			return name;
    		}
    	}
    }

    // Return a potentially-mapped jQuery.cssProps or vendor prefixed property
    function finalPropName( name ) {
    	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

    	if ( final ) {
    		return final;
    	}
    	if ( name in emptyStyle ) {
    		return name;
    	}
    	return vendorProps[ name ] = vendorPropName( name ) || name;
    }


    var

    	// Swappable if display is none or starts with table
    	// except "table", "table-cell", or "table-caption"
    	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    	rcustomProp = /^--/,
    	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    	cssNormalTransform = {
    		letterSpacing: "0",
    		fontWeight: "400"
    	};

    function setPositiveNumber( _elem, value, subtract ) {

    	// Any relative (+/-) values have already been
    	// normalized at this point
    	var matches = rcssNum.exec( value );
    	return matches ?

    		// Guard against undefined "subtract", e.g., when used as in cssHooks
    		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
    		value;
    }

    function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
    	var i = dimension === "width" ? 1 : 0,
    		extra = 0,
    		delta = 0;

    	// Adjustment may not be necessary
    	if ( box === ( isBorderBox ? "border" : "content" ) ) {
    		return 0;
    	}

    	for ( ; i < 4; i += 2 ) {

    		// Both box models exclude margin
    		if ( box === "margin" ) {
    			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
    		}

    		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
    		if ( !isBorderBox ) {

    			// Add padding
    			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

    			// For "border" or "margin", add border
    			if ( box !== "padding" ) {
    				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

    			// But still keep track of it otherwise
    			} else {
    				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}

    		// If we get here with a border-box (content + padding + border), we're seeking "content" or
    		// "padding" or "margin"
    		} else {

    			// For "content", subtract padding
    			if ( box === "content" ) {
    				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    			}

    			// For "content" or "padding", subtract border
    			if ( box !== "margin" ) {
    				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}
    		}
    	}

    	// Account for positive content-box scroll gutter when requested by providing computedVal
    	if ( !isBorderBox && computedVal >= 0 ) {

    		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
    		// Assuming integer scroll gutter, subtract the rest and round down
    		delta += Math.max( 0, Math.ceil(
    			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    			computedVal -
    			delta -
    			extra -
    			0.5

    		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
    		// Use an explicit zero to avoid NaN (gh-3964)
    		) ) || 0;
    	}

    	return delta;
    }

    function getWidthOrHeight( elem, dimension, extra ) {

    	// Start with computed style
    	var styles = getStyles( elem ),

    		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
    		// Fake content-box until we know it's needed to know the true value.
    		boxSizingNeeded = !support.boxSizingReliable() || extra,
    		isBorderBox = boxSizingNeeded &&
    			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    		valueIsBorderBox = isBorderBox,

    		val = curCSS( elem, dimension, styles ),
    		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

    	// Support: Firefox <=54
    	// Return a confounding non-pixel value or feign ignorance, as appropriate.
    	if ( rnumnonpx.test( val ) ) {
    		if ( !extra ) {
    			return val;
    		}
    		val = "auto";
    	}


    	// Support: IE 9 - 11 only
    	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
    	// In those cases, the computed value can be trusted to be border-box.
    	if ( ( !support.boxSizingReliable() && isBorderBox ||

    		// Support: IE 10 - 11+, Edge 15 - 18+
    		// IE/Edge misreport `getComputedStyle` of table rows with width/height
    		// set in CSS while `offset*` properties report correct values.
    		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
    		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

    		// Fall back to offsetWidth/offsetHeight when value is "auto"
    		// This happens for inline elements with no explicit setting (gh-3571)
    		val === "auto" ||

    		// Support: Android <=4.1 - 4.3 only
    		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
    		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

    		// Make sure the element is visible & connected
    		elem.getClientRects().length ) {

    		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
    		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
    		// retrieved value as a content box dimension.
    		valueIsBorderBox = offsetProp in elem;
    		if ( valueIsBorderBox ) {
    			val = elem[ offsetProp ];
    		}
    	}

    	// Normalize "" and auto
    	val = parseFloat( val ) || 0;

    	// Adjust for the element's box model
    	return ( val +
    		boxModelAdjustment(
    			elem,
    			dimension,
    			extra || ( isBorderBox ? "border" : "content" ),
    			valueIsBorderBox,
    			styles,

    			// Provide the current computed size to request scroll gutter calculation (gh-3589)
    			val
    		)
    	) + "px";
    }

    jQuery.extend( {

    	// Add in style property hooks for overriding the default
    	// behavior of getting and setting a style property
    	cssHooks: {
    		opacity: {
    			get: function( elem, computed ) {
    				if ( computed ) {

    					// We should always get a number back from opacity
    					var ret = curCSS( elem, "opacity" );
    					return ret === "" ? "1" : ret;
    				}
    			}
    		}
    	},

    	// Don't automatically add "px" to these possibly-unitless properties
    	cssNumber: {
    		"animationIterationCount": true,
    		"columnCount": true,
    		"fillOpacity": true,
    		"flexGrow": true,
    		"flexShrink": true,
    		"fontWeight": true,
    		"gridArea": true,
    		"gridColumn": true,
    		"gridColumnEnd": true,
    		"gridColumnStart": true,
    		"gridRow": true,
    		"gridRowEnd": true,
    		"gridRowStart": true,
    		"lineHeight": true,
    		"opacity": true,
    		"order": true,
    		"orphans": true,
    		"widows": true,
    		"zIndex": true,
    		"zoom": true
    	},

    	// Add in properties whose names you wish to fix before
    	// setting or getting the value
    	cssProps: {},

    	// Get and set the style property on a DOM Node
    	style: function( elem, name, value, extra ) {

    		// Don't set styles on text and comment nodes
    		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
    			return;
    		}

    		// Make sure that we're working with the right name
    		var ret, type, hooks,
    			origName = camelCase( name ),
    			isCustomProp = rcustomProp.test( name ),
    			style = elem.style;

    		// Make sure that we're working with the right name. We don't
    		// want to query the value if it is a CSS custom property
    		// since they are user-defined.
    		if ( !isCustomProp ) {
    			name = finalPropName( origName );
    		}

    		// Gets hook for the prefixed version, then unprefixed version
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    		// Check if we're setting a value
    		if ( value !== undefined ) {
    			type = typeof value;

    			// Convert "+=" or "-=" to relative numbers (#7345)
    			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
    				value = adjustCSS( elem, name, ret );

    				// Fixes bug #9237
    				type = "number";
    			}

    			// Make sure that null and NaN values aren't set (#7116)
    			if ( value == null || value !== value ) {
    				return;
    			}

    			// If a number was passed in, add the unit (except for certain CSS properties)
    			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
    			// "px" to a few hardcoded values.
    			if ( type === "number" && !isCustomProp ) {
    				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
    			}

    			// background-* props affect original clone's values
    			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
    				style[ name ] = "inherit";
    			}

    			// If a hook was provided, use that value, otherwise just set the specified value
    			if ( !hooks || !( "set" in hooks ) ||
    				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

    				if ( isCustomProp ) {
    					style.setProperty( name, value );
    				} else {
    					style[ name ] = value;
    				}
    			}

    		} else {

    			// If a hook was provided get the non-computed value from there
    			if ( hooks && "get" in hooks &&
    				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

    				return ret;
    			}

    			// Otherwise just get the value from the style object
    			return style[ name ];
    		}
    	},

    	css: function( elem, name, extra, styles ) {
    		var val, num, hooks,
    			origName = camelCase( name ),
    			isCustomProp = rcustomProp.test( name );

    		// Make sure that we're working with the right name. We don't
    		// want to modify the value if it is a CSS custom property
    		// since they are user-defined.
    		if ( !isCustomProp ) {
    			name = finalPropName( origName );
    		}

    		// Try prefixed name followed by the unprefixed name
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    		// If a hook was provided get the computed value from there
    		if ( hooks && "get" in hooks ) {
    			val = hooks.get( elem, true, extra );
    		}

    		// Otherwise, if a way to get the computed value exists, use that
    		if ( val === undefined ) {
    			val = curCSS( elem, name, styles );
    		}

    		// Convert "normal" to computed value
    		if ( val === "normal" && name in cssNormalTransform ) {
    			val = cssNormalTransform[ name ];
    		}

    		// Make numeric if forced or a qualifier was provided and val looks numeric
    		if ( extra === "" || extra ) {
    			num = parseFloat( val );
    			return extra === true || isFinite( num ) ? num || 0 : val;
    		}

    		return val;
    	}
    } );

    jQuery.each( [ "height", "width" ], function( _i, dimension ) {
    	jQuery.cssHooks[ dimension ] = {
    		get: function( elem, computed, extra ) {
    			if ( computed ) {

    				// Certain elements can have dimension info if we invisibly show them
    				// but it must have a current display style that would benefit
    				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

    					// Support: Safari 8+
    					// Table columns in Safari have non-zero offsetWidth & zero
    					// getBoundingClientRect().width unless display is changed.
    					// Support: IE <=11 only
    					// Running getBoundingClientRect on a disconnected node
    					// in IE throws an error.
    					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
    						swap( elem, cssShow, function() {
    							return getWidthOrHeight( elem, dimension, extra );
    						} ) :
    						getWidthOrHeight( elem, dimension, extra );
    			}
    		},

    		set: function( elem, value, extra ) {
    			var matches,
    				styles = getStyles( elem ),

    				// Only read styles.position if the test has a chance to fail
    				// to avoid forcing a reflow.
    				scrollboxSizeBuggy = !support.scrollboxSize() &&
    					styles.position === "absolute",

    				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
    				boxSizingNeeded = scrollboxSizeBuggy || extra,
    				isBorderBox = boxSizingNeeded &&
    					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    				subtract = extra ?
    					boxModelAdjustment(
    						elem,
    						dimension,
    						extra,
    						isBorderBox,
    						styles
    					) :
    					0;

    			// Account for unreliable border-box dimensions by comparing offset* to computed and
    			// faking a content-box to get border and padding (gh-3699)
    			if ( isBorderBox && scrollboxSizeBuggy ) {
    				subtract -= Math.ceil(
    					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    					parseFloat( styles[ dimension ] ) -
    					boxModelAdjustment( elem, dimension, "border", false, styles ) -
    					0.5
    				);
    			}

    			// Convert to pixels if value adjustment is needed
    			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
    				( matches[ 3 ] || "px" ) !== "px" ) {

    				elem.style[ dimension ] = value;
    				value = jQuery.css( elem, dimension );
    			}

    			return setPositiveNumber( elem, value, subtract );
    		}
    	};
    } );

    jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
    	function( elem, computed ) {
    		if ( computed ) {
    			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
    				elem.getBoundingClientRect().left -
    					swap( elem, { marginLeft: 0 }, function() {
    						return elem.getBoundingClientRect().left;
    					} )
    				) + "px";
    		}
    	}
    );

    // These hooks are used by animate to expand properties
    jQuery.each( {
    	margin: "",
    	padding: "",
    	border: "Width"
    }, function( prefix, suffix ) {
    	jQuery.cssHooks[ prefix + suffix ] = {
    		expand: function( value ) {
    			var i = 0,
    				expanded = {},

    				// Assumes a single number if not a string
    				parts = typeof value === "string" ? value.split( " " ) : [ value ];

    			for ( ; i < 4; i++ ) {
    				expanded[ prefix + cssExpand[ i ] + suffix ] =
    					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
    			}

    			return expanded;
    		}
    	};

    	if ( prefix !== "margin" ) {
    		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    	}
    } );

    jQuery.fn.extend( {
    	css: function( name, value ) {
    		return access( this, function( elem, name, value ) {
    			var styles, len,
    				map = {},
    				i = 0;

    			if ( Array.isArray( name ) ) {
    				styles = getStyles( elem );
    				len = name.length;

    				for ( ; i < len; i++ ) {
    					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
    				}

    				return map;
    			}

    			return value !== undefined ?
    				jQuery.style( elem, name, value ) :
    				jQuery.css( elem, name );
    		}, name, value, arguments.length > 1 );
    	}
    } );


    function Tween( elem, options, prop, end, easing ) {
    	return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
    	constructor: Tween,
    	init: function( elem, options, prop, end, easing, unit ) {
    		this.elem = elem;
    		this.prop = prop;
    		this.easing = easing || jQuery.easing._default;
    		this.options = options;
    		this.start = this.now = this.cur();
    		this.end = end;
    		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    	},
    	cur: function() {
    		var hooks = Tween.propHooks[ this.prop ];

    		return hooks && hooks.get ?
    			hooks.get( this ) :
    			Tween.propHooks._default.get( this );
    	},
    	run: function( percent ) {
    		var eased,
    			hooks = Tween.propHooks[ this.prop ];

    		if ( this.options.duration ) {
    			this.pos = eased = jQuery.easing[ this.easing ](
    				percent, this.options.duration * percent, 0, 1, this.options.duration
    			);
    		} else {
    			this.pos = eased = percent;
    		}
    		this.now = ( this.end - this.start ) * eased + this.start;

    		if ( this.options.step ) {
    			this.options.step.call( this.elem, this.now, this );
    		}

    		if ( hooks && hooks.set ) {
    			hooks.set( this );
    		} else {
    			Tween.propHooks._default.set( this );
    		}
    		return this;
    	}
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
    	_default: {
    		get: function( tween ) {
    			var result;

    			// Use a property on the element directly when it is not a DOM element,
    			// or when there is no matching style property that exists.
    			if ( tween.elem.nodeType !== 1 ||
    				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
    				return tween.elem[ tween.prop ];
    			}

    			// Passing an empty string as a 3rd parameter to .css will automatically
    			// attempt a parseFloat and fallback to a string if the parse fails.
    			// Simple values such as "10px" are parsed to Float;
    			// complex values such as "rotate(1rad)" are returned as-is.
    			result = jQuery.css( tween.elem, tween.prop, "" );

    			// Empty strings, null, undefined and "auto" are converted to 0.
    			return !result || result === "auto" ? 0 : result;
    		},
    		set: function( tween ) {

    			// Use step hook for back compat.
    			// Use cssHook if its there.
    			// Use .style if available and use plain properties where available.
    			if ( jQuery.fx.step[ tween.prop ] ) {
    				jQuery.fx.step[ tween.prop ]( tween );
    			} else if ( tween.elem.nodeType === 1 && (
    					jQuery.cssHooks[ tween.prop ] ||
    					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
    				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
    			} else {
    				tween.elem[ tween.prop ] = tween.now;
    			}
    		}
    	}
    };

    // Support: IE <=9 only
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    	set: function( tween ) {
    		if ( tween.elem.nodeType && tween.elem.parentNode ) {
    			tween.elem[ tween.prop ] = tween.now;
    		}
    	}
    };

    jQuery.easing = {
    	linear: function( p ) {
    		return p;
    	},
    	swing: function( p ) {
    		return 0.5 - Math.cos( p * Math.PI ) / 2;
    	},
    	_default: "swing"
    };

    jQuery.fx = Tween.prototype.init;

    // Back compat <1.8 extension point
    jQuery.fx.step = {};




    var
    	fxNow, inProgress,
    	rfxtypes = /^(?:toggle|show|hide)$/,
    	rrun = /queueHooks$/;

    function schedule() {
    	if ( inProgress ) {
    		if ( document.hidden === false && window.requestAnimationFrame ) {
    			window.requestAnimationFrame( schedule );
    		} else {
    			window.setTimeout( schedule, jQuery.fx.interval );
    		}

    		jQuery.fx.tick();
    	}
    }

    // Animations created synchronously will run synchronously
    function createFxNow() {
    	window.setTimeout( function() {
    		fxNow = undefined;
    	} );
    	return ( fxNow = Date.now() );
    }

    // Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
    	var which,
    		i = 0,
    		attrs = { height: type };

    	// If we include width, step value is 1 to do all cssExpand values,
    	// otherwise step value is 2 to skip over Left and Right
    	includeWidth = includeWidth ? 1 : 0;
    	for ( ; i < 4; i += 2 - includeWidth ) {
    		which = cssExpand[ i ];
    		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    	}

    	if ( includeWidth ) {
    		attrs.opacity = attrs.width = type;
    	}

    	return attrs;
    }

    function createTween( value, prop, animation ) {
    	var tween,
    		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
    		index = 0,
    		length = collection.length;
    	for ( ; index < length; index++ ) {
    		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

    			// We're done with this property
    			return tween;
    		}
    	}
    }

    function defaultPrefilter( elem, props, opts ) {
    	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
    		isBox = "width" in props || "height" in props,
    		anim = this,
    		orig = {},
    		style = elem.style,
    		hidden = elem.nodeType && isHiddenWithinTree( elem ),
    		dataShow = dataPriv.get( elem, "fxshow" );

    	// Queue-skipping animations hijack the fx hooks
    	if ( !opts.queue ) {
    		hooks = jQuery._queueHooks( elem, "fx" );
    		if ( hooks.unqueued == null ) {
    			hooks.unqueued = 0;
    			oldfire = hooks.empty.fire;
    			hooks.empty.fire = function() {
    				if ( !hooks.unqueued ) {
    					oldfire();
    				}
    			};
    		}
    		hooks.unqueued++;

    		anim.always( function() {

    			// Ensure the complete handler is called before this completes
    			anim.always( function() {
    				hooks.unqueued--;
    				if ( !jQuery.queue( elem, "fx" ).length ) {
    					hooks.empty.fire();
    				}
    			} );
    		} );
    	}

    	// Detect show/hide animations
    	for ( prop in props ) {
    		value = props[ prop ];
    		if ( rfxtypes.test( value ) ) {
    			delete props[ prop ];
    			toggle = toggle || value === "toggle";
    			if ( value === ( hidden ? "hide" : "show" ) ) {

    				// Pretend to be hidden if this is a "show" and
    				// there is still data from a stopped show/hide
    				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
    					hidden = true;

    				// Ignore all other no-op show/hide data
    				} else {
    					continue;
    				}
    			}
    			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
    		}
    	}

    	// Bail out if this is a no-op like .hide().hide()
    	propTween = !jQuery.isEmptyObject( props );
    	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
    		return;
    	}

    	// Restrict "overflow" and "display" styles during box animations
    	if ( isBox && elem.nodeType === 1 ) {

    		// Support: IE <=9 - 11, Edge 12 - 15
    		// Record all 3 overflow attributes because IE does not infer the shorthand
    		// from identically-valued overflowX and overflowY and Edge just mirrors
    		// the overflowX value there.
    		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    		// Identify a display type, preferring old show/hide data over the CSS cascade
    		restoreDisplay = dataShow && dataShow.display;
    		if ( restoreDisplay == null ) {
    			restoreDisplay = dataPriv.get( elem, "display" );
    		}
    		display = jQuery.css( elem, "display" );
    		if ( display === "none" ) {
    			if ( restoreDisplay ) {
    				display = restoreDisplay;
    			} else {

    				// Get nonempty value(s) by temporarily forcing visibility
    				showHide( [ elem ], true );
    				restoreDisplay = elem.style.display || restoreDisplay;
    				display = jQuery.css( elem, "display" );
    				showHide( [ elem ] );
    			}
    		}

    		// Animate inline elements as inline-block
    		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
    			if ( jQuery.css( elem, "float" ) === "none" ) {

    				// Restore the original display value at the end of pure show/hide animations
    				if ( !propTween ) {
    					anim.done( function() {
    						style.display = restoreDisplay;
    					} );
    					if ( restoreDisplay == null ) {
    						display = style.display;
    						restoreDisplay = display === "none" ? "" : display;
    					}
    				}
    				style.display = "inline-block";
    			}
    		}
    	}

    	if ( opts.overflow ) {
    		style.overflow = "hidden";
    		anim.always( function() {
    			style.overflow = opts.overflow[ 0 ];
    			style.overflowX = opts.overflow[ 1 ];
    			style.overflowY = opts.overflow[ 2 ];
    		} );
    	}

    	// Implement show/hide animations
    	propTween = false;
    	for ( prop in orig ) {

    		// General show/hide setup for this element animation
    		if ( !propTween ) {
    			if ( dataShow ) {
    				if ( "hidden" in dataShow ) {
    					hidden = dataShow.hidden;
    				}
    			} else {
    				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
    			}

    			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
    			if ( toggle ) {
    				dataShow.hidden = !hidden;
    			}

    			// Show elements before animating them
    			if ( hidden ) {
    				showHide( [ elem ], true );
    			}

    			/* eslint-disable no-loop-func */

    			anim.done( function() {

    			/* eslint-enable no-loop-func */

    				// The final step of a "hide" animation is actually hiding the element
    				if ( !hidden ) {
    					showHide( [ elem ] );
    				}
    				dataPriv.remove( elem, "fxshow" );
    				for ( prop in orig ) {
    					jQuery.style( elem, prop, orig[ prop ] );
    				}
    			} );
    		}

    		// Per-property setup
    		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
    		if ( !( prop in dataShow ) ) {
    			dataShow[ prop ] = propTween.start;
    			if ( hidden ) {
    				propTween.end = propTween.start;
    				propTween.start = 0;
    			}
    		}
    	}
    }

    function propFilter( props, specialEasing ) {
    	var index, name, easing, value, hooks;

    	// camelCase, specialEasing and expand cssHook pass
    	for ( index in props ) {
    		name = camelCase( index );
    		easing = specialEasing[ name ];
    		value = props[ index ];
    		if ( Array.isArray( value ) ) {
    			easing = value[ 1 ];
    			value = props[ index ] = value[ 0 ];
    		}

    		if ( index !== name ) {
    			props[ name ] = value;
    			delete props[ index ];
    		}

    		hooks = jQuery.cssHooks[ name ];
    		if ( hooks && "expand" in hooks ) {
    			value = hooks.expand( value );
    			delete props[ name ];

    			// Not quite $.extend, this won't overwrite existing keys.
    			// Reusing 'index' because we have the correct "name"
    			for ( index in value ) {
    				if ( !( index in props ) ) {
    					props[ index ] = value[ index ];
    					specialEasing[ index ] = easing;
    				}
    			}
    		} else {
    			specialEasing[ name ] = easing;
    		}
    	}
    }

    function Animation( elem, properties, options ) {
    	var result,
    		stopped,
    		index = 0,
    		length = Animation.prefilters.length,
    		deferred = jQuery.Deferred().always( function() {

    			// Don't match elem in the :animated selector
    			delete tick.elem;
    		} ),
    		tick = function() {
    			if ( stopped ) {
    				return false;
    			}
    			var currentTime = fxNow || createFxNow(),
    				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

    				// Support: Android 2.3 only
    				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
    				temp = remaining / animation.duration || 0,
    				percent = 1 - temp,
    				index = 0,
    				length = animation.tweens.length;

    			for ( ; index < length; index++ ) {
    				animation.tweens[ index ].run( percent );
    			}

    			deferred.notifyWith( elem, [ animation, percent, remaining ] );

    			// If there's more to do, yield
    			if ( percent < 1 && length ) {
    				return remaining;
    			}

    			// If this was an empty animation, synthesize a final progress notification
    			if ( !length ) {
    				deferred.notifyWith( elem, [ animation, 1, 0 ] );
    			}

    			// Resolve the animation and report its conclusion
    			deferred.resolveWith( elem, [ animation ] );
    			return false;
    		},
    		animation = deferred.promise( {
    			elem: elem,
    			props: jQuery.extend( {}, properties ),
    			opts: jQuery.extend( true, {
    				specialEasing: {},
    				easing: jQuery.easing._default
    			}, options ),
    			originalProperties: properties,
    			originalOptions: options,
    			startTime: fxNow || createFxNow(),
    			duration: options.duration,
    			tweens: [],
    			createTween: function( prop, end ) {
    				var tween = jQuery.Tween( elem, animation.opts, prop, end,
    						animation.opts.specialEasing[ prop ] || animation.opts.easing );
    				animation.tweens.push( tween );
    				return tween;
    			},
    			stop: function( gotoEnd ) {
    				var index = 0,

    					// If we are going to the end, we want to run all the tweens
    					// otherwise we skip this part
    					length = gotoEnd ? animation.tweens.length : 0;
    				if ( stopped ) {
    					return this;
    				}
    				stopped = true;
    				for ( ; index < length; index++ ) {
    					animation.tweens[ index ].run( 1 );
    				}

    				// Resolve when we played the last frame; otherwise, reject
    				if ( gotoEnd ) {
    					deferred.notifyWith( elem, [ animation, 1, 0 ] );
    					deferred.resolveWith( elem, [ animation, gotoEnd ] );
    				} else {
    					deferred.rejectWith( elem, [ animation, gotoEnd ] );
    				}
    				return this;
    			}
    		} ),
    		props = animation.props;

    	propFilter( props, animation.opts.specialEasing );

    	for ( ; index < length; index++ ) {
    		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
    		if ( result ) {
    			if ( isFunction( result.stop ) ) {
    				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
    					result.stop.bind( result );
    			}
    			return result;
    		}
    	}

    	jQuery.map( props, createTween, animation );

    	if ( isFunction( animation.opts.start ) ) {
    		animation.opts.start.call( elem, animation );
    	}

    	// Attach callbacks from options
    	animation
    		.progress( animation.opts.progress )
    		.done( animation.opts.done, animation.opts.complete )
    		.fail( animation.opts.fail )
    		.always( animation.opts.always );

    	jQuery.fx.timer(
    		jQuery.extend( tick, {
    			elem: elem,
    			anim: animation,
    			queue: animation.opts.queue
    		} )
    	);

    	return animation;
    }

    jQuery.Animation = jQuery.extend( Animation, {

    	tweeners: {
    		"*": [ function( prop, value ) {
    			var tween = this.createTween( prop, value );
    			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
    			return tween;
    		} ]
    	},

    	tweener: function( props, callback ) {
    		if ( isFunction( props ) ) {
    			callback = props;
    			props = [ "*" ];
    		} else {
    			props = props.match( rnothtmlwhite );
    		}

    		var prop,
    			index = 0,
    			length = props.length;

    		for ( ; index < length; index++ ) {
    			prop = props[ index ];
    			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
    			Animation.tweeners[ prop ].unshift( callback );
    		}
    	},

    	prefilters: [ defaultPrefilter ],

    	prefilter: function( callback, prepend ) {
    		if ( prepend ) {
    			Animation.prefilters.unshift( callback );
    		} else {
    			Animation.prefilters.push( callback );
    		}
    	}
    } );

    jQuery.speed = function( speed, easing, fn ) {
    	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    		complete: fn || !fn && easing ||
    			isFunction( speed ) && speed,
    		duration: speed,
    		easing: fn && easing || easing && !isFunction( easing ) && easing
    	};

    	// Go to the end state if fx are off
    	if ( jQuery.fx.off ) {
    		opt.duration = 0;

    	} else {
    		if ( typeof opt.duration !== "number" ) {
    			if ( opt.duration in jQuery.fx.speeds ) {
    				opt.duration = jQuery.fx.speeds[ opt.duration ];

    			} else {
    				opt.duration = jQuery.fx.speeds._default;
    			}
    		}
    	}

    	// Normalize opt.queue - true/undefined/null -> "fx"
    	if ( opt.queue == null || opt.queue === true ) {
    		opt.queue = "fx";
    	}

    	// Queueing
    	opt.old = opt.complete;

    	opt.complete = function() {
    		if ( isFunction( opt.old ) ) {
    			opt.old.call( this );
    		}

    		if ( opt.queue ) {
    			jQuery.dequeue( this, opt.queue );
    		}
    	};

    	return opt;
    };

    jQuery.fn.extend( {
    	fadeTo: function( speed, to, easing, callback ) {

    		// Show any hidden elements after setting opacity to 0
    		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

    			// Animate to the value specified
    			.end().animate( { opacity: to }, speed, easing, callback );
    	},
    	animate: function( prop, speed, easing, callback ) {
    		var empty = jQuery.isEmptyObject( prop ),
    			optall = jQuery.speed( speed, easing, callback ),
    			doAnimation = function() {

    				// Operate on a copy of prop so per-property easing won't be lost
    				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

    				// Empty animations, or finishing resolves immediately
    				if ( empty || dataPriv.get( this, "finish" ) ) {
    					anim.stop( true );
    				}
    			};
    			doAnimation.finish = doAnimation;

    		return empty || optall.queue === false ?
    			this.each( doAnimation ) :
    			this.queue( optall.queue, doAnimation );
    	},
    	stop: function( type, clearQueue, gotoEnd ) {
    		var stopQueue = function( hooks ) {
    			var stop = hooks.stop;
    			delete hooks.stop;
    			stop( gotoEnd );
    		};

    		if ( typeof type !== "string" ) {
    			gotoEnd = clearQueue;
    			clearQueue = type;
    			type = undefined;
    		}
    		if ( clearQueue ) {
    			this.queue( type || "fx", [] );
    		}

    		return this.each( function() {
    			var dequeue = true,
    				index = type != null && type + "queueHooks",
    				timers = jQuery.timers,
    				data = dataPriv.get( this );

    			if ( index ) {
    				if ( data[ index ] && data[ index ].stop ) {
    					stopQueue( data[ index ] );
    				}
    			} else {
    				for ( index in data ) {
    					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
    						stopQueue( data[ index ] );
    					}
    				}
    			}

    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this &&
    					( type == null || timers[ index ].queue === type ) ) {

    					timers[ index ].anim.stop( gotoEnd );
    					dequeue = false;
    					timers.splice( index, 1 );
    				}
    			}

    			// Start the next in the queue if the last step wasn't forced.
    			// Timers currently will call their complete callbacks, which
    			// will dequeue but only if they were gotoEnd.
    			if ( dequeue || !gotoEnd ) {
    				jQuery.dequeue( this, type );
    			}
    		} );
    	},
    	finish: function( type ) {
    		if ( type !== false ) {
    			type = type || "fx";
    		}
    		return this.each( function() {
    			var index,
    				data = dataPriv.get( this ),
    				queue = data[ type + "queue" ],
    				hooks = data[ type + "queueHooks" ],
    				timers = jQuery.timers,
    				length = queue ? queue.length : 0;

    			// Enable finishing flag on private data
    			data.finish = true;

    			// Empty the queue first
    			jQuery.queue( this, type, [] );

    			if ( hooks && hooks.stop ) {
    				hooks.stop.call( this, true );
    			}

    			// Look for any active animations, and finish them
    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
    					timers[ index ].anim.stop( true );
    					timers.splice( index, 1 );
    				}
    			}

    			// Look for any animations in the old queue and finish them
    			for ( index = 0; index < length; index++ ) {
    				if ( queue[ index ] && queue[ index ].finish ) {
    					queue[ index ].finish.call( this );
    				}
    			}

    			// Turn off finishing flag
    			delete data.finish;
    		} );
    	}
    } );

    jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
    	var cssFn = jQuery.fn[ name ];
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return speed == null || typeof speed === "boolean" ?
    			cssFn.apply( this, arguments ) :
    			this.animate( genFx( name, true ), speed, easing, callback );
    	};
    } );

    // Generate shortcuts for custom animations
    jQuery.each( {
    	slideDown: genFx( "show" ),
    	slideUp: genFx( "hide" ),
    	slideToggle: genFx( "toggle" ),
    	fadeIn: { opacity: "show" },
    	fadeOut: { opacity: "hide" },
    	fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return this.animate( props, speed, easing, callback );
    	};
    } );

    jQuery.timers = [];
    jQuery.fx.tick = function() {
    	var timer,
    		i = 0,
    		timers = jQuery.timers;

    	fxNow = Date.now();

    	for ( ; i < timers.length; i++ ) {
    		timer = timers[ i ];

    		// Run the timer and safely remove it when done (allowing for external removal)
    		if ( !timer() && timers[ i ] === timer ) {
    			timers.splice( i--, 1 );
    		}
    	}

    	if ( !timers.length ) {
    		jQuery.fx.stop();
    	}
    	fxNow = undefined;
    };

    jQuery.fx.timer = function( timer ) {
    	jQuery.timers.push( timer );
    	jQuery.fx.start();
    };

    jQuery.fx.interval = 13;
    jQuery.fx.start = function() {
    	if ( inProgress ) {
    		return;
    	}

    	inProgress = true;
    	schedule();
    };

    jQuery.fx.stop = function() {
    	inProgress = null;
    };

    jQuery.fx.speeds = {
    	slow: 600,
    	fast: 200,

    	// Default speed
    	_default: 400
    };


    // Based off of the plugin by Clint Helfers, with permission.
    // https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function( time, type ) {
    	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    	type = type || "fx";

    	return this.queue( type, function( next, hooks ) {
    		var timeout = window.setTimeout( next, time );
    		hooks.stop = function() {
    			window.clearTimeout( timeout );
    		};
    	} );
    };


    ( function() {
    	var input = document.createElement( "input" ),
    		select = document.createElement( "select" ),
    		opt = select.appendChild( document.createElement( "option" ) );

    	input.type = "checkbox";

    	// Support: Android <=4.3 only
    	// Default value for a checkbox should be "on"
    	support.checkOn = input.value !== "";

    	// Support: IE <=11 only
    	// Must access selectedIndex to make default options select
    	support.optSelected = opt.selected;

    	// Support: IE <=11 only
    	// An input loses its value after becoming a radio
    	input = document.createElement( "input" );
    	input.value = "t";
    	input.type = "radio";
    	support.radioValue = input.value === "t";
    } )();


    var boolHook,
    	attrHandle = jQuery.expr.attrHandle;

    jQuery.fn.extend( {
    	attr: function( name, value ) {
    		return access( this, jQuery.attr, name, value, arguments.length > 1 );
    	},

    	removeAttr: function( name ) {
    		return this.each( function() {
    			jQuery.removeAttr( this, name );
    		} );
    	}
    } );

    jQuery.extend( {
    	attr: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;

    		// Don't get/set attributes on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}

    		// Fallback to prop when attributes are not supported
    		if ( typeof elem.getAttribute === "undefined" ) {
    			return jQuery.prop( elem, name, value );
    		}

    		// Attribute hooks are determined by the lowercase version
    		// Grab necessary hook if one is defined
    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
    			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
    				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
    		}

    		if ( value !== undefined ) {
    			if ( value === null ) {
    				jQuery.removeAttr( elem, name );
    				return;
    			}

    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}

    			elem.setAttribute( name, value + "" );
    			return value;
    		}

    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}

    		ret = jQuery.find.attr( elem, name );

    		// Non-existent attributes return null, we normalize to undefined
    		return ret == null ? undefined : ret;
    	},

    	attrHooks: {
    		type: {
    			set: function( elem, value ) {
    				if ( !support.radioValue && value === "radio" &&
    					nodeName( elem, "input" ) ) {
    					var val = elem.value;
    					elem.setAttribute( "type", value );
    					if ( val ) {
    						elem.value = val;
    					}
    					return value;
    				}
    			}
    		}
    	},

    	removeAttr: function( elem, value ) {
    		var name,
    			i = 0,

    			// Attribute names can contain non-HTML whitespace characters
    			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
    			attrNames = value && value.match( rnothtmlwhite );

    		if ( attrNames && elem.nodeType === 1 ) {
    			while ( ( name = attrNames[ i++ ] ) ) {
    				elem.removeAttribute( name );
    			}
    		}
    	}
    } );

    // Hooks for boolean attributes
    boolHook = {
    	set: function( elem, value, name ) {
    		if ( value === false ) {

    			// Remove boolean attributes when set to false
    			jQuery.removeAttr( elem, name );
    		} else {
    			elem.setAttribute( name, name );
    		}
    		return name;
    	}
    };

    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
    	var getter = attrHandle[ name ] || jQuery.find.attr;

    	attrHandle[ name ] = function( elem, name, isXML ) {
    		var ret, handle,
    			lowercaseName = name.toLowerCase();

    		if ( !isXML ) {

    			// Avoid an infinite loop by temporarily removing this function from the getter
    			handle = attrHandle[ lowercaseName ];
    			attrHandle[ lowercaseName ] = ret;
    			ret = getter( elem, name, isXML ) != null ?
    				lowercaseName :
    				null;
    			attrHandle[ lowercaseName ] = handle;
    		}
    		return ret;
    	};
    } );




    var rfocusable = /^(?:input|select|textarea|button)$/i,
    	rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend( {
    	prop: function( name, value ) {
    		return access( this, jQuery.prop, name, value, arguments.length > 1 );
    	},

    	removeProp: function( name ) {
    		return this.each( function() {
    			delete this[ jQuery.propFix[ name ] || name ];
    		} );
    	}
    } );

    jQuery.extend( {
    	prop: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;

    		// Don't get/set properties on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}

    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

    			// Fix name and attach hooks
    			name = jQuery.propFix[ name ] || name;
    			hooks = jQuery.propHooks[ name ];
    		}

    		if ( value !== undefined ) {
    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}

    			return ( elem[ name ] = value );
    		}

    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}

    		return elem[ name ];
    	},

    	propHooks: {
    		tabIndex: {
    			get: function( elem ) {

    				// Support: IE <=9 - 11 only
    				// elem.tabIndex doesn't always return the
    				// correct value when it hasn't been explicitly set
    				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
    				// Use proper attribute retrieval(#12072)
    				var tabindex = jQuery.find.attr( elem, "tabindex" );

    				if ( tabindex ) {
    					return parseInt( tabindex, 10 );
    				}

    				if (
    					rfocusable.test( elem.nodeName ) ||
    					rclickable.test( elem.nodeName ) &&
    					elem.href
    				) {
    					return 0;
    				}

    				return -1;
    			}
    		}
    	},

    	propFix: {
    		"for": "htmlFor",
    		"class": "className"
    	}
    } );

    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // when in an optgroup
    // eslint rule "no-unused-expressions" is disabled for this code
    // since it considers such accessions noop
    if ( !support.optSelected ) {
    	jQuery.propHooks.selected = {
    		get: function( elem ) {

    			/* eslint no-unused-expressions: "off" */

    			var parent = elem.parentNode;
    			if ( parent && parent.parentNode ) {
    				parent.parentNode.selectedIndex;
    			}
    			return null;
    		},
    		set: function( elem ) {

    			/* eslint no-unused-expressions: "off" */

    			var parent = elem.parentNode;
    			if ( parent ) {
    				parent.selectedIndex;

    				if ( parent.parentNode ) {
    					parent.parentNode.selectedIndex;
    				}
    			}
    		}
    	};
    }

    jQuery.each( [
    	"tabIndex",
    	"readOnly",
    	"maxLength",
    	"cellSpacing",
    	"cellPadding",
    	"rowSpan",
    	"colSpan",
    	"useMap",
    	"frameBorder",
    	"contentEditable"
    ], function() {
    	jQuery.propFix[ this.toLowerCase() ] = this;
    } );




    	// Strip and collapse whitespace according to HTML spec
    	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
    	function stripAndCollapse( value ) {
    		var tokens = value.match( rnothtmlwhite ) || [];
    		return tokens.join( " " );
    	}


    function getClass( elem ) {
    	return elem.getAttribute && elem.getAttribute( "class" ) || "";
    }

    function classesToArray( value ) {
    	if ( Array.isArray( value ) ) {
    		return value;
    	}
    	if ( typeof value === "string" ) {
    		return value.match( rnothtmlwhite ) || [];
    	}
    	return [];
    }

    jQuery.fn.extend( {
    	addClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;

    		if ( isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}

    		classes = classesToArray( value );

    		if ( classes.length ) {
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );
    				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {
    						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
    							cur += clazz + " ";
    						}
    					}

    					// Only assign if different to avoid unneeded rendering.
    					finalValue = stripAndCollapse( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}

    		return this;
    	},

    	removeClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;

    		if ( isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}

    		if ( !arguments.length ) {
    			return this.attr( "class", "" );
    		}

    		classes = classesToArray( value );

    		if ( classes.length ) {
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );

    				// This expression is here for better compressibility (see addClass)
    				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {

    						// Remove *all* instances
    						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
    							cur = cur.replace( " " + clazz + " ", " " );
    						}
    					}

    					// Only assign if different to avoid unneeded rendering.
    					finalValue = stripAndCollapse( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}

    		return this;
    	},

    	toggleClass: function( value, stateVal ) {
    		var type = typeof value,
    			isValidValue = type === "string" || Array.isArray( value );

    		if ( typeof stateVal === "boolean" && isValidValue ) {
    			return stateVal ? this.addClass( value ) : this.removeClass( value );
    		}

    		if ( isFunction( value ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).toggleClass(
    					value.call( this, i, getClass( this ), stateVal ),
    					stateVal
    				);
    			} );
    		}

    		return this.each( function() {
    			var className, i, self, classNames;

    			if ( isValidValue ) {

    				// Toggle individual class names
    				i = 0;
    				self = jQuery( this );
    				classNames = classesToArray( value );

    				while ( ( className = classNames[ i++ ] ) ) {

    					// Check each className given, space separated list
    					if ( self.hasClass( className ) ) {
    						self.removeClass( className );
    					} else {
    						self.addClass( className );
    					}
    				}

    			// Toggle whole class name
    			} else if ( value === undefined || type === "boolean" ) {
    				className = getClass( this );
    				if ( className ) {

    					// Store className if set
    					dataPriv.set( this, "__className__", className );
    				}

    				// If the element has a class name or if we're passed `false`,
    				// then remove the whole classname (if there was one, the above saved it).
    				// Otherwise bring back whatever was previously saved (if anything),
    				// falling back to the empty string if nothing was stored.
    				if ( this.setAttribute ) {
    					this.setAttribute( "class",
    						className || value === false ?
    						"" :
    						dataPriv.get( this, "__className__" ) || ""
    					);
    				}
    			}
    		} );
    	},

    	hasClass: function( selector ) {
    		var className, elem,
    			i = 0;

    		className = " " + selector + " ";
    		while ( ( elem = this[ i++ ] ) ) {
    			if ( elem.nodeType === 1 &&
    				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
    					return true;
    			}
    		}

    		return false;
    	}
    } );




    var rreturn = /\r/g;

    jQuery.fn.extend( {
    	val: function( value ) {
    		var hooks, ret, valueIsFunction,
    			elem = this[ 0 ];

    		if ( !arguments.length ) {
    			if ( elem ) {
    				hooks = jQuery.valHooks[ elem.type ] ||
    					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

    				if ( hooks &&
    					"get" in hooks &&
    					( ret = hooks.get( elem, "value" ) ) !== undefined
    				) {
    					return ret;
    				}

    				ret = elem.value;

    				// Handle most common string cases
    				if ( typeof ret === "string" ) {
    					return ret.replace( rreturn, "" );
    				}

    				// Handle cases where value is null/undef or number
    				return ret == null ? "" : ret;
    			}

    			return;
    		}

    		valueIsFunction = isFunction( value );

    		return this.each( function( i ) {
    			var val;

    			if ( this.nodeType !== 1 ) {
    				return;
    			}

    			if ( valueIsFunction ) {
    				val = value.call( this, i, jQuery( this ).val() );
    			} else {
    				val = value;
    			}

    			// Treat null/undefined as ""; convert numbers to string
    			if ( val == null ) {
    				val = "";

    			} else if ( typeof val === "number" ) {
    				val += "";

    			} else if ( Array.isArray( val ) ) {
    				val = jQuery.map( val, function( value ) {
    					return value == null ? "" : value + "";
    				} );
    			}

    			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

    			// If set returns undefined, fall back to normal setting
    			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
    				this.value = val;
    			}
    		} );
    	}
    } );

    jQuery.extend( {
    	valHooks: {
    		option: {
    			get: function( elem ) {

    				var val = jQuery.find.attr( elem, "value" );
    				return val != null ?
    					val :

    					// Support: IE <=10 - 11 only
    					// option.text throws exceptions (#14686, #14858)
    					// Strip and collapse whitespace
    					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
    					stripAndCollapse( jQuery.text( elem ) );
    			}
    		},
    		select: {
    			get: function( elem ) {
    				var value, option, i,
    					options = elem.options,
    					index = elem.selectedIndex,
    					one = elem.type === "select-one",
    					values = one ? null : [],
    					max = one ? index + 1 : options.length;

    				if ( index < 0 ) {
    					i = max;

    				} else {
    					i = one ? index : 0;
    				}

    				// Loop through all the selected options
    				for ( ; i < max; i++ ) {
    					option = options[ i ];

    					// Support: IE <=9 only
    					// IE8-9 doesn't update selected after form reset (#2551)
    					if ( ( option.selected || i === index ) &&

    							// Don't return options that are disabled or in a disabled optgroup
    							!option.disabled &&
    							( !option.parentNode.disabled ||
    								!nodeName( option.parentNode, "optgroup" ) ) ) {

    						// Get the specific value for the option
    						value = jQuery( option ).val();

    						// We don't need an array for one selects
    						if ( one ) {
    							return value;
    						}

    						// Multi-Selects return an array
    						values.push( value );
    					}
    				}

    				return values;
    			},

    			set: function( elem, value ) {
    				var optionSet, option,
    					options = elem.options,
    					values = jQuery.makeArray( value ),
    					i = options.length;

    				while ( i-- ) {
    					option = options[ i ];

    					/* eslint-disable no-cond-assign */

    					if ( option.selected =
    						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
    					) {
    						optionSet = true;
    					}

    					/* eslint-enable no-cond-assign */
    				}

    				// Force browsers to behave consistently when non-matching value is set
    				if ( !optionSet ) {
    					elem.selectedIndex = -1;
    				}
    				return values;
    			}
    		}
    	}
    } );

    // Radios and checkboxes getter/setter
    jQuery.each( [ "radio", "checkbox" ], function() {
    	jQuery.valHooks[ this ] = {
    		set: function( elem, value ) {
    			if ( Array.isArray( value ) ) {
    				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
    			}
    		}
    	};
    	if ( !support.checkOn ) {
    		jQuery.valHooks[ this ].get = function( elem ) {
    			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
    		};
    	}
    } );




    // Return jQuery for attributes-only inclusion


    support.focusin = "onfocusin" in window;


    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    	stopPropagationCallback = function( e ) {
    		e.stopPropagation();
    	};

    jQuery.extend( jQuery.event, {

    	trigger: function( event, data, elem, onlyHandlers ) {

    		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
    			eventPath = [ elem || document ],
    			type = hasOwn.call( event, "type" ) ? event.type : event,
    			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

    		cur = lastElement = tmp = elem = elem || document;

    		// Don't do events on text and comment nodes
    		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
    			return;
    		}

    		// focus/blur morphs to focusin/out; ensure we're not firing them right now
    		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
    			return;
    		}

    		if ( type.indexOf( "." ) > -1 ) {

    			// Namespaced trigger; create a regexp to match event type in handle()
    			namespaces = type.split( "." );
    			type = namespaces.shift();
    			namespaces.sort();
    		}
    		ontype = type.indexOf( ":" ) < 0 && "on" + type;

    		// Caller can pass in a jQuery.Event object, Object, or just an event type string
    		event = event[ jQuery.expando ] ?
    			event :
    			new jQuery.Event( type, typeof event === "object" && event );

    		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
    		event.isTrigger = onlyHandlers ? 2 : 3;
    		event.namespace = namespaces.join( "." );
    		event.rnamespace = event.namespace ?
    			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
    			null;

    		// Clean up the event in case it is being reused
    		event.result = undefined;
    		if ( !event.target ) {
    			event.target = elem;
    		}

    		// Clone any incoming data and prepend the event, creating the handler arg list
    		data = data == null ?
    			[ event ] :
    			jQuery.makeArray( data, [ event ] );

    		// Allow special events to draw outside the lines
    		special = jQuery.event.special[ type ] || {};
    		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
    			return;
    		}

    		// Determine event propagation path in advance, per W3C events spec (#9951)
    		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

    			bubbleType = special.delegateType || type;
    			if ( !rfocusMorph.test( bubbleType + type ) ) {
    				cur = cur.parentNode;
    			}
    			for ( ; cur; cur = cur.parentNode ) {
    				eventPath.push( cur );
    				tmp = cur;
    			}

    			// Only add window if we got to document (e.g., not plain obj or detached DOM)
    			if ( tmp === ( elem.ownerDocument || document ) ) {
    				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
    			}
    		}

    		// Fire handlers on the event path
    		i = 0;
    		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
    			lastElement = cur;
    			event.type = i > 1 ?
    				bubbleType :
    				special.bindType || type;

    			// jQuery handler
    			handle = (
    					dataPriv.get( cur, "events" ) || Object.create( null )
    				)[ event.type ] &&
    				dataPriv.get( cur, "handle" );
    			if ( handle ) {
    				handle.apply( cur, data );
    			}

    			// Native handler
    			handle = ontype && cur[ ontype ];
    			if ( handle && handle.apply && acceptData( cur ) ) {
    				event.result = handle.apply( cur, data );
    				if ( event.result === false ) {
    					event.preventDefault();
    				}
    			}
    		}
    		event.type = type;

    		// If nobody prevented the default action, do it now
    		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

    			if ( ( !special._default ||
    				special._default.apply( eventPath.pop(), data ) === false ) &&
    				acceptData( elem ) ) {

    				// Call a native DOM method on the target with the same name as the event.
    				// Don't do default actions on window, that's where global variables be (#6170)
    				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

    					// Don't re-trigger an onFOO event when we call its FOO() method
    					tmp = elem[ ontype ];

    					if ( tmp ) {
    						elem[ ontype ] = null;
    					}

    					// Prevent re-triggering of the same event, since we already bubbled it above
    					jQuery.event.triggered = type;

    					if ( event.isPropagationStopped() ) {
    						lastElement.addEventListener( type, stopPropagationCallback );
    					}

    					elem[ type ]();

    					if ( event.isPropagationStopped() ) {
    						lastElement.removeEventListener( type, stopPropagationCallback );
    					}

    					jQuery.event.triggered = undefined;

    					if ( tmp ) {
    						elem[ ontype ] = tmp;
    					}
    				}
    			}
    		}

    		return event.result;
    	},

    	// Piggyback on a donor event to simulate a different one
    	// Used only for `focus(in | out)` events
    	simulate: function( type, elem, event ) {
    		var e = jQuery.extend(
    			new jQuery.Event(),
    			event,
    			{
    				type: type,
    				isSimulated: true
    			}
    		);

    		jQuery.event.trigger( e, null, elem );
    	}

    } );

    jQuery.fn.extend( {

    	trigger: function( type, data ) {
    		return this.each( function() {
    			jQuery.event.trigger( type, data, this );
    		} );
    	},
    	triggerHandler: function( type, data ) {
    		var elem = this[ 0 ];
    		if ( elem ) {
    			return jQuery.event.trigger( type, data, elem, true );
    		}
    	}
    } );


    // Support: Firefox <=44
    // Firefox doesn't have focus(in | out) events
    // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    //
    // Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
    // focus(in | out) events fire after focus & blur events,
    // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    // Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
    if ( !support.focusin ) {
    	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    		// Attach a single capturing handler on the document while someone wants focusin/focusout
    		var handler = function( event ) {
    			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
    		};

    		jQuery.event.special[ fix ] = {
    			setup: function() {

    				// Handle: regular nodes (via `this.ownerDocument`), window
    				// (via `this.document`) & document (via `this`).
    				var doc = this.ownerDocument || this.document || this,
    					attaches = dataPriv.access( doc, fix );

    				if ( !attaches ) {
    					doc.addEventListener( orig, handler, true );
    				}
    				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
    			},
    			teardown: function() {
    				var doc = this.ownerDocument || this.document || this,
    					attaches = dataPriv.access( doc, fix ) - 1;

    				if ( !attaches ) {
    					doc.removeEventListener( orig, handler, true );
    					dataPriv.remove( doc, fix );

    				} else {
    					dataPriv.access( doc, fix, attaches );
    				}
    			}
    		};
    	} );
    }
    var location = window.location;

    var nonce = { guid: Date.now() };

    var rquery = ( /\?/ );



    // Cross-browser xml parsing
    jQuery.parseXML = function( data ) {
    	var xml;
    	if ( !data || typeof data !== "string" ) {
    		return null;
    	}

    	// Support: IE 9 - 11 only
    	// IE throws on parseFromString with invalid input.
    	try {
    		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    	} catch ( e ) {
    		xml = undefined;
    	}

    	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
    		jQuery.error( "Invalid XML: " + data );
    	}
    	return xml;
    };


    var
    	rbracket = /\[\]$/,
    	rCRLF = /\r?\n/g,
    	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    	rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams( prefix, obj, traditional, add ) {
    	var name;

    	if ( Array.isArray( obj ) ) {

    		// Serialize array item.
    		jQuery.each( obj, function( i, v ) {
    			if ( traditional || rbracket.test( prefix ) ) {

    				// Treat each array item as a scalar.
    				add( prefix, v );

    			} else {

    				// Item is non-scalar (array or object), encode its numeric index.
    				buildParams(
    					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
    					v,
    					traditional,
    					add
    				);
    			}
    		} );

    	} else if ( !traditional && toType( obj ) === "object" ) {

    		// Serialize object item.
    		for ( name in obj ) {
    			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    		}

    	} else {

    		// Serialize scalar item.
    		add( prefix, obj );
    	}
    }

    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function( a, traditional ) {
    	var prefix,
    		s = [],
    		add = function( key, valueOrFunction ) {

    			// If value is a function, invoke it and use its return value
    			var value = isFunction( valueOrFunction ) ?
    				valueOrFunction() :
    				valueOrFunction;

    			s[ s.length ] = encodeURIComponent( key ) + "=" +
    				encodeURIComponent( value == null ? "" : value );
    		};

    	if ( a == null ) {
    		return "";
    	}

    	// If an array was passed in, assume that it is an array of form elements.
    	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

    		// Serialize the form elements
    		jQuery.each( a, function() {
    			add( this.name, this.value );
    		} );

    	} else {

    		// If traditional, encode the "old" way (the way 1.3.2 or older
    		// did it), otherwise encode params recursively.
    		for ( prefix in a ) {
    			buildParams( prefix, a[ prefix ], traditional, add );
    		}
    	}

    	// Return the resulting serialization
    	return s.join( "&" );
    };

    jQuery.fn.extend( {
    	serialize: function() {
    		return jQuery.param( this.serializeArray() );
    	},
    	serializeArray: function() {
    		return this.map( function() {

    			// Can add propHook for "elements" to filter or add form elements
    			var elements = jQuery.prop( this, "elements" );
    			return elements ? jQuery.makeArray( elements ) : this;
    		} )
    		.filter( function() {
    			var type = this.type;

    			// Use .is( ":disabled" ) so that fieldset[disabled] works
    			return this.name && !jQuery( this ).is( ":disabled" ) &&
    				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
    				( this.checked || !rcheckableType.test( type ) );
    		} )
    		.map( function( _i, elem ) {
    			var val = jQuery( this ).val();

    			if ( val == null ) {
    				return null;
    			}

    			if ( Array.isArray( val ) ) {
    				return jQuery.map( val, function( val ) {
    					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    				} );
    			}

    			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    		} ).get();
    	}
    } );


    var
    	r20 = /%20/g,
    	rhash = /#.*$/,
    	rantiCache = /([?&])_=[^&]*/,
    	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

    	// #7653, #8125, #8152: local protocol detection
    	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    	rnoContent = /^(?:GET|HEAD)$/,
    	rprotocol = /^\/\//,

    	/* Prefilters
    	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    	 * 2) These are called:
    	 *    - BEFORE asking for a transport
    	 *    - AFTER param serialization (s.data is a string if s.processData is true)
    	 * 3) key is the dataType
    	 * 4) the catchall symbol "*" can be used
    	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    	 */
    	prefilters = {},

    	/* Transports bindings
    	 * 1) key is the dataType
    	 * 2) the catchall symbol "*" can be used
    	 * 3) selection will start with transport dataType and THEN go to "*" if needed
    	 */
    	transports = {},

    	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    	allTypes = "*/".concat( "*" ),

    	// Anchor tag for parsing the document origin
    	originAnchor = document.createElement( "a" );
    	originAnchor.href = location.href;

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

    	// dataTypeExpression is optional and defaults to "*"
    	return function( dataTypeExpression, func ) {

    		if ( typeof dataTypeExpression !== "string" ) {
    			func = dataTypeExpression;
    			dataTypeExpression = "*";
    		}

    		var dataType,
    			i = 0,
    			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

    		if ( isFunction( func ) ) {

    			// For each dataType in the dataTypeExpression
    			while ( ( dataType = dataTypes[ i++ ] ) ) {

    				// Prepend if requested
    				if ( dataType[ 0 ] === "+" ) {
    					dataType = dataType.slice( 1 ) || "*";
    					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

    				// Otherwise append
    				} else {
    					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
    				}
    			}
    		}
    	};
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    	var inspected = {},
    		seekingTransport = ( structure === transports );

    	function inspect( dataType ) {
    		var selected;
    		inspected[ dataType ] = true;
    		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
    			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
    			if ( typeof dataTypeOrTransport === "string" &&
    				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

    				options.dataTypes.unshift( dataTypeOrTransport );
    				inspect( dataTypeOrTransport );
    				return false;
    			} else if ( seekingTransport ) {
    				return !( selected = dataTypeOrTransport );
    			}
    		} );
    		return selected;
    	}

    	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend( target, src ) {
    	var key, deep,
    		flatOptions = jQuery.ajaxSettings.flatOptions || {};

    	for ( key in src ) {
    		if ( src[ key ] !== undefined ) {
    			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    		}
    	}
    	if ( deep ) {
    		jQuery.extend( true, target, deep );
    	}

    	return target;
    }

    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {

    	var ct, type, finalDataType, firstDataType,
    		contents = s.contents,
    		dataTypes = s.dataTypes;

    	// Remove auto dataType and get content-type in the process
    	while ( dataTypes[ 0 ] === "*" ) {
    		dataTypes.shift();
    		if ( ct === undefined ) {
    			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
    		}
    	}

    	// Check if we're dealing with a known content-type
    	if ( ct ) {
    		for ( type in contents ) {
    			if ( contents[ type ] && contents[ type ].test( ct ) ) {
    				dataTypes.unshift( type );
    				break;
    			}
    		}
    	}

    	// Check to see if we have a response for the expected dataType
    	if ( dataTypes[ 0 ] in responses ) {
    		finalDataType = dataTypes[ 0 ];
    	} else {

    		// Try convertible dataTypes
    		for ( type in responses ) {
    			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
    				finalDataType = type;
    				break;
    			}
    			if ( !firstDataType ) {
    				firstDataType = type;
    			}
    		}

    		// Or just use first one
    		finalDataType = finalDataType || firstDataType;
    	}

    	// If we found a dataType
    	// We add the dataType to the list if needed
    	// and return the corresponding response
    	if ( finalDataType ) {
    		if ( finalDataType !== dataTypes[ 0 ] ) {
    			dataTypes.unshift( finalDataType );
    		}
    		return responses[ finalDataType ];
    	}
    }

    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert( s, response, jqXHR, isSuccess ) {
    	var conv2, current, conv, tmp, prev,
    		converters = {},

    		// Work with a copy of dataTypes in case we need to modify it for conversion
    		dataTypes = s.dataTypes.slice();

    	// Create converters map with lowercased keys
    	if ( dataTypes[ 1 ] ) {
    		for ( conv in s.converters ) {
    			converters[ conv.toLowerCase() ] = s.converters[ conv ];
    		}
    	}

    	current = dataTypes.shift();

    	// Convert to each sequential dataType
    	while ( current ) {

    		if ( s.responseFields[ current ] ) {
    			jqXHR[ s.responseFields[ current ] ] = response;
    		}

    		// Apply the dataFilter if provided
    		if ( !prev && isSuccess && s.dataFilter ) {
    			response = s.dataFilter( response, s.dataType );
    		}

    		prev = current;
    		current = dataTypes.shift();

    		if ( current ) {

    			// There's only work to do if current dataType is non-auto
    			if ( current === "*" ) {

    				current = prev;

    			// Convert response if prev dataType is non-auto and differs from current
    			} else if ( prev !== "*" && prev !== current ) {

    				// Seek a direct converter
    				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

    				// If none found, seek a pair
    				if ( !conv ) {
    					for ( conv2 in converters ) {

    						// If conv2 outputs current
    						tmp = conv2.split( " " );
    						if ( tmp[ 1 ] === current ) {

    							// If prev can be converted to accepted input
    							conv = converters[ prev + " " + tmp[ 0 ] ] ||
    								converters[ "* " + tmp[ 0 ] ];
    							if ( conv ) {

    								// Condense equivalence converters
    								if ( conv === true ) {
    									conv = converters[ conv2 ];

    								// Otherwise, insert the intermediate dataType
    								} else if ( converters[ conv2 ] !== true ) {
    									current = tmp[ 0 ];
    									dataTypes.unshift( tmp[ 1 ] );
    								}
    								break;
    							}
    						}
    					}
    				}

    				// Apply converter (if not an equivalence)
    				if ( conv !== true ) {

    					// Unless errors are allowed to bubble, catch and return them
    					if ( conv && s.throws ) {
    						response = conv( response );
    					} else {
    						try {
    							response = conv( response );
    						} catch ( e ) {
    							return {
    								state: "parsererror",
    								error: conv ? e : "No conversion from " + prev + " to " + current
    							};
    						}
    					}
    				}
    			}
    		}
    	}

    	return { state: "success", data: response };
    }

    jQuery.extend( {

    	// Counter for holding the number of active queries
    	active: 0,

    	// Last-Modified header cache for next request
    	lastModified: {},
    	etag: {},

    	ajaxSettings: {
    		url: location.href,
    		type: "GET",
    		isLocal: rlocalProtocol.test( location.protocol ),
    		global: true,
    		processData: true,
    		async: true,
    		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

    		/*
    		timeout: 0,
    		data: null,
    		dataType: null,
    		username: null,
    		password: null,
    		cache: null,
    		throws: false,
    		traditional: false,
    		headers: {},
    		*/

    		accepts: {
    			"*": allTypes,
    			text: "text/plain",
    			html: "text/html",
    			xml: "application/xml, text/xml",
    			json: "application/json, text/javascript"
    		},

    		contents: {
    			xml: /\bxml\b/,
    			html: /\bhtml/,
    			json: /\bjson\b/
    		},

    		responseFields: {
    			xml: "responseXML",
    			text: "responseText",
    			json: "responseJSON"
    		},

    		// Data converters
    		// Keys separate source (or catchall "*") and destination types with a single space
    		converters: {

    			// Convert anything to text
    			"* text": String,

    			// Text to html (true = no transformation)
    			"text html": true,

    			// Evaluate text as a json expression
    			"text json": JSON.parse,

    			// Parse text as xml
    			"text xml": jQuery.parseXML
    		},

    		// For options that shouldn't be deep extended:
    		// you can add your own custom options here if
    		// and when you create one that shouldn't be
    		// deep extended (see ajaxExtend)
    		flatOptions: {
    			url: true,
    			context: true
    		}
    	},

    	// Creates a full fledged settings object into target
    	// with both ajaxSettings and settings fields.
    	// If target is omitted, writes into ajaxSettings.
    	ajaxSetup: function( target, settings ) {
    		return settings ?

    			// Building a settings object
    			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

    			// Extending ajaxSettings
    			ajaxExtend( jQuery.ajaxSettings, target );
    	},

    	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    	ajaxTransport: addToPrefiltersOrTransports( transports ),

    	// Main method
    	ajax: function( url, options ) {

    		// If url is an object, simulate pre-1.5 signature
    		if ( typeof url === "object" ) {
    			options = url;
    			url = undefined;
    		}

    		// Force options to be an object
    		options = options || {};

    		var transport,

    			// URL without anti-cache param
    			cacheURL,

    			// Response headers
    			responseHeadersString,
    			responseHeaders,

    			// timeout handle
    			timeoutTimer,

    			// Url cleanup var
    			urlAnchor,

    			// Request state (becomes false upon send and true upon completion)
    			completed,

    			// To know if global events are to be dispatched
    			fireGlobals,

    			// Loop variable
    			i,

    			// uncached part of the url
    			uncached,

    			// Create the final options object
    			s = jQuery.ajaxSetup( {}, options ),

    			// Callbacks context
    			callbackContext = s.context || s,

    			// Context for global events is callbackContext if it is a DOM node or jQuery collection
    			globalEventContext = s.context &&
    				( callbackContext.nodeType || callbackContext.jquery ) ?
    					jQuery( callbackContext ) :
    					jQuery.event,

    			// Deferreds
    			deferred = jQuery.Deferred(),
    			completeDeferred = jQuery.Callbacks( "once memory" ),

    			// Status-dependent callbacks
    			statusCode = s.statusCode || {},

    			// Headers (they are sent all at once)
    			requestHeaders = {},
    			requestHeadersNames = {},

    			// Default abort message
    			strAbort = "canceled",

    			// Fake xhr
    			jqXHR = {
    				readyState: 0,

    				// Builds headers hashtable if needed
    				getResponseHeader: function( key ) {
    					var match;
    					if ( completed ) {
    						if ( !responseHeaders ) {
    							responseHeaders = {};
    							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
    								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
    									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
    										.concat( match[ 2 ] );
    							}
    						}
    						match = responseHeaders[ key.toLowerCase() + " " ];
    					}
    					return match == null ? null : match.join( ", " );
    				},

    				// Raw string
    				getAllResponseHeaders: function() {
    					return completed ? responseHeadersString : null;
    				},

    				// Caches the header
    				setRequestHeader: function( name, value ) {
    					if ( completed == null ) {
    						name = requestHeadersNames[ name.toLowerCase() ] =
    							requestHeadersNames[ name.toLowerCase() ] || name;
    						requestHeaders[ name ] = value;
    					}
    					return this;
    				},

    				// Overrides response content-type header
    				overrideMimeType: function( type ) {
    					if ( completed == null ) {
    						s.mimeType = type;
    					}
    					return this;
    				},

    				// Status-dependent callbacks
    				statusCode: function( map ) {
    					var code;
    					if ( map ) {
    						if ( completed ) {

    							// Execute the appropriate callbacks
    							jqXHR.always( map[ jqXHR.status ] );
    						} else {

    							// Lazy-add the new callbacks in a way that preserves old ones
    							for ( code in map ) {
    								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
    							}
    						}
    					}
    					return this;
    				},

    				// Cancel the request
    				abort: function( statusText ) {
    					var finalText = statusText || strAbort;
    					if ( transport ) {
    						transport.abort( finalText );
    					}
    					done( 0, finalText );
    					return this;
    				}
    			};

    		// Attach deferreds
    		deferred.promise( jqXHR );

    		// Add protocol if not provided (prefilters might expect it)
    		// Handle falsy url in the settings object (#10093: consistency with old signature)
    		// We also use the url parameter if available
    		s.url = ( ( url || s.url || location.href ) + "" )
    			.replace( rprotocol, location.protocol + "//" );

    		// Alias method option to type as per ticket #12004
    		s.type = options.method || options.type || s.method || s.type;

    		// Extract dataTypes list
    		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

    		// A cross-domain request is in order when the origin doesn't match the current origin.
    		if ( s.crossDomain == null ) {
    			urlAnchor = document.createElement( "a" );

    			// Support: IE <=8 - 11, Edge 12 - 15
    			// IE throws exception on accessing the href property if url is malformed,
    			// e.g. http://example.com:80x/
    			try {
    				urlAnchor.href = s.url;

    				// Support: IE <=8 - 11 only
    				// Anchor's host property isn't correctly set when s.url is relative
    				urlAnchor.href = urlAnchor.href;
    				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
    					urlAnchor.protocol + "//" + urlAnchor.host;
    			} catch ( e ) {

    				// If there is an error parsing the URL, assume it is crossDomain,
    				// it can be rejected by the transport if it is invalid
    				s.crossDomain = true;
    			}
    		}

    		// Convert data if not already a string
    		if ( s.data && s.processData && typeof s.data !== "string" ) {
    			s.data = jQuery.param( s.data, s.traditional );
    		}

    		// Apply prefilters
    		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    		// If request was aborted inside a prefilter, stop there
    		if ( completed ) {
    			return jqXHR;
    		}

    		// We can fire global events as of now if asked to
    		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
    		fireGlobals = jQuery.event && s.global;

    		// Watch for a new set of requests
    		if ( fireGlobals && jQuery.active++ === 0 ) {
    			jQuery.event.trigger( "ajaxStart" );
    		}

    		// Uppercase the type
    		s.type = s.type.toUpperCase();

    		// Determine if request has content
    		s.hasContent = !rnoContent.test( s.type );

    		// Save the URL in case we're toying with the If-Modified-Since
    		// and/or If-None-Match header later on
    		// Remove hash to simplify url manipulation
    		cacheURL = s.url.replace( rhash, "" );

    		// More options handling for requests with no content
    		if ( !s.hasContent ) {

    			// Remember the hash so we can put it back
    			uncached = s.url.slice( cacheURL.length );

    			// If data is available and should be processed, append data to url
    			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
    				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

    				// #9682: remove data so that it's not used in an eventual retry
    				delete s.data;
    			}

    			// Add or update anti-cache param if needed
    			if ( s.cache === false ) {
    				cacheURL = cacheURL.replace( rantiCache, "$1" );
    				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
    					uncached;
    			}

    			// Put hash and anti-cache on the URL that will be requested (gh-1732)
    			s.url = cacheURL + uncached;

    		// Change '%20' to '+' if this is encoded form body content (gh-2658)
    		} else if ( s.data && s.processData &&
    			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
    			s.data = s.data.replace( r20, "+" );
    		}

    		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    		if ( s.ifModified ) {
    			if ( jQuery.lastModified[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
    			}
    			if ( jQuery.etag[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
    			}
    		}

    		// Set the correct header, if data is being sent
    		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
    			jqXHR.setRequestHeader( "Content-Type", s.contentType );
    		}

    		// Set the Accepts header for the server, depending on the dataType
    		jqXHR.setRequestHeader(
    			"Accept",
    			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
    				s.accepts[ s.dataTypes[ 0 ] ] +
    					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
    				s.accepts[ "*" ]
    		);

    		// Check for headers option
    		for ( i in s.headers ) {
    			jqXHR.setRequestHeader( i, s.headers[ i ] );
    		}

    		// Allow custom headers/mimetypes and early abort
    		if ( s.beforeSend &&
    			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

    			// Abort if not done already and return
    			return jqXHR.abort();
    		}

    		// Aborting is no longer a cancellation
    		strAbort = "abort";

    		// Install callbacks on deferreds
    		completeDeferred.add( s.complete );
    		jqXHR.done( s.success );
    		jqXHR.fail( s.error );

    		// Get transport
    		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    		// If no transport, we auto-abort
    		if ( !transport ) {
    			done( -1, "No Transport" );
    		} else {
    			jqXHR.readyState = 1;

    			// Send global event
    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
    			}

    			// If request was aborted inside ajaxSend, stop there
    			if ( completed ) {
    				return jqXHR;
    			}

    			// Timeout
    			if ( s.async && s.timeout > 0 ) {
    				timeoutTimer = window.setTimeout( function() {
    					jqXHR.abort( "timeout" );
    				}, s.timeout );
    			}

    			try {
    				completed = false;
    				transport.send( requestHeaders, done );
    			} catch ( e ) {

    				// Rethrow post-completion exceptions
    				if ( completed ) {
    					throw e;
    				}

    				// Propagate others as results
    				done( -1, e );
    			}
    		}

    		// Callback for when everything is done
    		function done( status, nativeStatusText, responses, headers ) {
    			var isSuccess, success, error, response, modified,
    				statusText = nativeStatusText;

    			// Ignore repeat invocations
    			if ( completed ) {
    				return;
    			}

    			completed = true;

    			// Clear timeout if it exists
    			if ( timeoutTimer ) {
    				window.clearTimeout( timeoutTimer );
    			}

    			// Dereference transport for early garbage collection
    			// (no matter how long the jqXHR object will be used)
    			transport = undefined;

    			// Cache response headers
    			responseHeadersString = headers || "";

    			// Set readyState
    			jqXHR.readyState = status > 0 ? 4 : 0;

    			// Determine if successful
    			isSuccess = status >= 200 && status < 300 || status === 304;

    			// Get response data
    			if ( responses ) {
    				response = ajaxHandleResponses( s, jqXHR, responses );
    			}

    			// Use a noop converter for missing script
    			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
    				s.converters[ "text script" ] = function() {};
    			}

    			// Convert no matter what (that way responseXXX fields are always set)
    			response = ajaxConvert( s, response, jqXHR, isSuccess );

    			// If successful, handle type chaining
    			if ( isSuccess ) {

    				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    				if ( s.ifModified ) {
    					modified = jqXHR.getResponseHeader( "Last-Modified" );
    					if ( modified ) {
    						jQuery.lastModified[ cacheURL ] = modified;
    					}
    					modified = jqXHR.getResponseHeader( "etag" );
    					if ( modified ) {
    						jQuery.etag[ cacheURL ] = modified;
    					}
    				}

    				// if no content
    				if ( status === 204 || s.type === "HEAD" ) {
    					statusText = "nocontent";

    				// if not modified
    				} else if ( status === 304 ) {
    					statusText = "notmodified";

    				// If we have data, let's convert it
    				} else {
    					statusText = response.state;
    					success = response.data;
    					error = response.error;
    					isSuccess = !error;
    				}
    			} else {

    				// Extract error from statusText and normalize for non-aborts
    				error = statusText;
    				if ( status || !statusText ) {
    					statusText = "error";
    					if ( status < 0 ) {
    						status = 0;
    					}
    				}
    			}

    			// Set data for the fake xhr object
    			jqXHR.status = status;
    			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

    			// Success/Error
    			if ( isSuccess ) {
    				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
    			} else {
    				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
    			}

    			// Status-dependent callbacks
    			jqXHR.statusCode( statusCode );
    			statusCode = undefined;

    			if ( fireGlobals ) {
    				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
    					[ jqXHR, s, isSuccess ? success : error ] );
    			}

    			// Complete
    			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

    				// Handle the global AJAX counter
    				if ( !( --jQuery.active ) ) {
    					jQuery.event.trigger( "ajaxStop" );
    				}
    			}
    		}

    		return jqXHR;
    	},

    	getJSON: function( url, data, callback ) {
    		return jQuery.get( url, data, callback, "json" );
    	},

    	getScript: function( url, callback ) {
    		return jQuery.get( url, undefined, callback, "script" );
    	}
    } );

    jQuery.each( [ "get", "post" ], function( _i, method ) {
    	jQuery[ method ] = function( url, data, callback, type ) {

    		// Shift arguments if data argument was omitted
    		if ( isFunction( data ) ) {
    			type = type || callback;
    			callback = data;
    			data = undefined;
    		}

    		// The url can be an options object (which then must have .url)
    		return jQuery.ajax( jQuery.extend( {
    			url: url,
    			type: method,
    			dataType: type,
    			data: data,
    			success: callback
    		}, jQuery.isPlainObject( url ) && url ) );
    	};
    } );

    jQuery.ajaxPrefilter( function( s ) {
    	var i;
    	for ( i in s.headers ) {
    		if ( i.toLowerCase() === "content-type" ) {
    			s.contentType = s.headers[ i ] || "";
    		}
    	}
    } );


    jQuery._evalUrl = function( url, options, doc ) {
    	return jQuery.ajax( {
    		url: url,

    		// Make this explicit, since user can override this through ajaxSetup (#11264)
    		type: "GET",
    		dataType: "script",
    		cache: true,
    		async: false,
    		global: false,

    		// Only evaluate the response if it is successful (gh-4126)
    		// dataFilter is not invoked for failure responses, so using it instead
    		// of the default converter is kludgy but it works.
    		converters: {
    			"text script": function() {}
    		},
    		dataFilter: function( response ) {
    			jQuery.globalEval( response, options, doc );
    		}
    	} );
    };


    jQuery.fn.extend( {
    	wrapAll: function( html ) {
    		var wrap;

    		if ( this[ 0 ] ) {
    			if ( isFunction( html ) ) {
    				html = html.call( this[ 0 ] );
    			}

    			// The elements to wrap the target around
    			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

    			if ( this[ 0 ].parentNode ) {
    				wrap.insertBefore( this[ 0 ] );
    			}

    			wrap.map( function() {
    				var elem = this;

    				while ( elem.firstElementChild ) {
    					elem = elem.firstElementChild;
    				}

    				return elem;
    			} ).append( this );
    		}

    		return this;
    	},

    	wrapInner: function( html ) {
    		if ( isFunction( html ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).wrapInner( html.call( this, i ) );
    			} );
    		}

    		return this.each( function() {
    			var self = jQuery( this ),
    				contents = self.contents();

    			if ( contents.length ) {
    				contents.wrapAll( html );

    			} else {
    				self.append( html );
    			}
    		} );
    	},

    	wrap: function( html ) {
    		var htmlIsFunction = isFunction( html );

    		return this.each( function( i ) {
    			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
    		} );
    	},

    	unwrap: function( selector ) {
    		this.parent( selector ).not( "body" ).each( function() {
    			jQuery( this ).replaceWith( this.childNodes );
    		} );
    		return this;
    	}
    } );


    jQuery.expr.pseudos.hidden = function( elem ) {
    	return !jQuery.expr.pseudos.visible( elem );
    };
    jQuery.expr.pseudos.visible = function( elem ) {
    	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    };




    jQuery.ajaxSettings.xhr = function() {
    	try {
    		return new window.XMLHttpRequest();
    	} catch ( e ) {}
    };

    var xhrSuccessStatus = {

    		// File protocol always yields status code 0, assume 200
    		0: 200,

    		// Support: IE <=9 only
    		// #1450: sometimes IE returns 1223 when it should be 204
    		1223: 204
    	},
    	xhrSupported = jQuery.ajaxSettings.xhr();

    support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport( function( options ) {
    	var callback, errorCallback;

    	// Cross domain only allowed if supported through XMLHttpRequest
    	if ( support.cors || xhrSupported && !options.crossDomain ) {
    		return {
    			send: function( headers, complete ) {
    				var i,
    					xhr = options.xhr();

    				xhr.open(
    					options.type,
    					options.url,
    					options.async,
    					options.username,
    					options.password
    				);

    				// Apply custom fields if provided
    				if ( options.xhrFields ) {
    					for ( i in options.xhrFields ) {
    						xhr[ i ] = options.xhrFields[ i ];
    					}
    				}

    				// Override mime type if needed
    				if ( options.mimeType && xhr.overrideMimeType ) {
    					xhr.overrideMimeType( options.mimeType );
    				}

    				// X-Requested-With header
    				// For cross-domain requests, seeing as conditions for a preflight are
    				// akin to a jigsaw puzzle, we simply never set it to be sure.
    				// (it can always be set on a per-request basis or even using ajaxSetup)
    				// For same-domain requests, won't change header if already provided.
    				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
    					headers[ "X-Requested-With" ] = "XMLHttpRequest";
    				}

    				// Set headers
    				for ( i in headers ) {
    					xhr.setRequestHeader( i, headers[ i ] );
    				}

    				// Callback
    				callback = function( type ) {
    					return function() {
    						if ( callback ) {
    							callback = errorCallback = xhr.onload =
    								xhr.onerror = xhr.onabort = xhr.ontimeout =
    									xhr.onreadystatechange = null;

    							if ( type === "abort" ) {
    								xhr.abort();
    							} else if ( type === "error" ) {

    								// Support: IE <=9 only
    								// On a manual native abort, IE9 throws
    								// errors on any property access that is not readyState
    								if ( typeof xhr.status !== "number" ) {
    									complete( 0, "error" );
    								} else {
    									complete(

    										// File: protocol always yields status 0; see #8605, #14207
    										xhr.status,
    										xhr.statusText
    									);
    								}
    							} else {
    								complete(
    									xhrSuccessStatus[ xhr.status ] || xhr.status,
    									xhr.statusText,

    									// Support: IE <=9 only
    									// IE9 has no XHR2 but throws on binary (trac-11426)
    									// For XHR2 non-text, let the caller handle it (gh-2498)
    									( xhr.responseType || "text" ) !== "text"  ||
    									typeof xhr.responseText !== "string" ?
    										{ binary: xhr.response } :
    										{ text: xhr.responseText },
    									xhr.getAllResponseHeaders()
    								);
    							}
    						}
    					};
    				};

    				// Listen to events
    				xhr.onload = callback();
    				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

    				// Support: IE 9 only
    				// Use onreadystatechange to replace onabort
    				// to handle uncaught aborts
    				if ( xhr.onabort !== undefined ) {
    					xhr.onabort = errorCallback;
    				} else {
    					xhr.onreadystatechange = function() {

    						// Check readyState before timeout as it changes
    						if ( xhr.readyState === 4 ) {

    							// Allow onerror to be called first,
    							// but that will not handle a native abort
    							// Also, save errorCallback to a variable
    							// as xhr.onerror cannot be accessed
    							window.setTimeout( function() {
    								if ( callback ) {
    									errorCallback();
    								}
    							} );
    						}
    					};
    				}

    				// Create the abort callback
    				callback = callback( "abort" );

    				try {

    					// Do send the request (this may raise an exception)
    					xhr.send( options.hasContent && options.data || null );
    				} catch ( e ) {

    					// #14683: Only rethrow if this hasn't been notified as an error yet
    					if ( callback ) {
    						throw e;
    					}
    				}
    			},

    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );




    // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
    jQuery.ajaxPrefilter( function( s ) {
    	if ( s.crossDomain ) {
    		s.contents.script = false;
    	}
    } );

    // Install script dataType
    jQuery.ajaxSetup( {
    	accepts: {
    		script: "text/javascript, application/javascript, " +
    			"application/ecmascript, application/x-ecmascript"
    	},
    	contents: {
    		script: /\b(?:java|ecma)script\b/
    	},
    	converters: {
    		"text script": function( text ) {
    			jQuery.globalEval( text );
    			return text;
    		}
    	}
    } );

    // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter( "script", function( s ) {
    	if ( s.cache === undefined ) {
    		s.cache = false;
    	}
    	if ( s.crossDomain ) {
    		s.type = "GET";
    	}
    } );

    // Bind script tag hack transport
    jQuery.ajaxTransport( "script", function( s ) {

    	// This transport only deals with cross domain or forced-by-attrs requests
    	if ( s.crossDomain || s.scriptAttrs ) {
    		var script, callback;
    		return {
    			send: function( _, complete ) {
    				script = jQuery( "<script>" )
    					.attr( s.scriptAttrs || {} )
    					.prop( { charset: s.scriptCharset, src: s.url } )
    					.on( "load error", callback = function( evt ) {
    						script.remove();
    						callback = null;
    						if ( evt ) {
    							complete( evt.type === "error" ? 404 : 200, evt.type );
    						}
    					} );

    				// Use native DOM manipulation to avoid our domManip AJAX trickery
    				document.head.appendChild( script[ 0 ] );
    			},
    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );




    var oldCallbacks = [],
    	rjsonp = /(=)\?(?=&|$)|\?\?/;

    // Default jsonp settings
    jQuery.ajaxSetup( {
    	jsonp: "callback",
    	jsonpCallback: function() {
    		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
    		this[ callback ] = true;
    		return callback;
    	}
    } );

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    	var callbackName, overwritten, responseContainer,
    		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
    			"url" :
    			typeof s.data === "string" &&
    				( s.contentType || "" )
    					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
    				rjsonp.test( s.data ) && "data"
    		);

    	// Handle iff the expected data type is "jsonp" or we have a parameter to set
    	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

    		// Get callback name, remembering preexisting value associated with it
    		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
    			s.jsonpCallback() :
    			s.jsonpCallback;

    		// Insert callback into url or form data
    		if ( jsonProp ) {
    			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    		} else if ( s.jsonp !== false ) {
    			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    		}

    		// Use data converter to retrieve json after script execution
    		s.converters[ "script json" ] = function() {
    			if ( !responseContainer ) {
    				jQuery.error( callbackName + " was not called" );
    			}
    			return responseContainer[ 0 ];
    		};

    		// Force json dataType
    		s.dataTypes[ 0 ] = "json";

    		// Install callback
    		overwritten = window[ callbackName ];
    		window[ callbackName ] = function() {
    			responseContainer = arguments;
    		};

    		// Clean-up function (fires after converters)
    		jqXHR.always( function() {

    			// If previous value didn't exist - remove it
    			if ( overwritten === undefined ) {
    				jQuery( window ).removeProp( callbackName );

    			// Otherwise restore preexisting value
    			} else {
    				window[ callbackName ] = overwritten;
    			}

    			// Save back as free
    			if ( s[ callbackName ] ) {

    				// Make sure that re-using the options doesn't screw things around
    				s.jsonpCallback = originalSettings.jsonpCallback;

    				// Save the callback name for future use
    				oldCallbacks.push( callbackName );
    			}

    			// Call if it was a function and we have a response
    			if ( responseContainer && isFunction( overwritten ) ) {
    				overwritten( responseContainer[ 0 ] );
    			}

    			responseContainer = overwritten = undefined;
    		} );

    		// Delegate to script
    		return "script";
    	}
    } );




    // Support: Safari 8 only
    // In Safari 8 documents created via document.implementation.createHTMLDocument
    // collapse sibling forms: the second one becomes a child of the first one.
    // Because of that, this security measure has to be disabled in Safari 8.
    // https://bugs.webkit.org/show_bug.cgi?id=137337
    support.createHTMLDocument = ( function() {
    	var body = document.implementation.createHTMLDocument( "" ).body;
    	body.innerHTML = "<form></form><form></form>";
    	return body.childNodes.length === 2;
    } )();


    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function( data, context, keepScripts ) {
    	if ( typeof data !== "string" ) {
    		return [];
    	}
    	if ( typeof context === "boolean" ) {
    		keepScripts = context;
    		context = false;
    	}

    	var base, parsed, scripts;

    	if ( !context ) {

    		// Stop scripts or inline event handlers from being executed immediately
    		// by using document.implementation
    		if ( support.createHTMLDocument ) {
    			context = document.implementation.createHTMLDocument( "" );

    			// Set the base href for the created document
    			// so any parsed elements with URLs
    			// are based on the document's URL (gh-2965)
    			base = context.createElement( "base" );
    			base.href = document.location.href;
    			context.head.appendChild( base );
    		} else {
    			context = document;
    		}
    	}

    	parsed = rsingleTag.exec( data );
    	scripts = !keepScripts && [];

    	// Single tag
    	if ( parsed ) {
    		return [ context.createElement( parsed[ 1 ] ) ];
    	}

    	parsed = buildFragment( [ data ], context, scripts );

    	if ( scripts && scripts.length ) {
    		jQuery( scripts ).remove();
    	}

    	return jQuery.merge( [], parsed.childNodes );
    };


    /**
     * Load a url into a page
     */
    jQuery.fn.load = function( url, params, callback ) {
    	var selector, type, response,
    		self = this,
    		off = url.indexOf( " " );

    	if ( off > -1 ) {
    		selector = stripAndCollapse( url.slice( off ) );
    		url = url.slice( 0, off );
    	}

    	// If it's a function
    	if ( isFunction( params ) ) {

    		// We assume that it's the callback
    		callback = params;
    		params = undefined;

    	// Otherwise, build a param string
    	} else if ( params && typeof params === "object" ) {
    		type = "POST";
    	}

    	// If we have elements to modify, make the request
    	if ( self.length > 0 ) {
    		jQuery.ajax( {
    			url: url,

    			// If "type" variable is undefined, then "GET" method will be used.
    			// Make value of this field explicit since
    			// user can override it through ajaxSetup method
    			type: type || "GET",
    			dataType: "html",
    			data: params
    		} ).done( function( responseText ) {

    			// Save response for use in complete callback
    			response = arguments;

    			self.html( selector ?

    				// If a selector was specified, locate the right elements in a dummy div
    				// Exclude scripts to avoid IE 'Permission Denied' errors
    				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

    				// Otherwise use the full result
    				responseText );

    		// If the request succeeds, this function gets "data", "status", "jqXHR"
    		// but they are ignored because response was set above.
    		// If it fails, this function gets "jqXHR", "status", "error"
    		} ).always( callback && function( jqXHR, status ) {
    			self.each( function() {
    				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
    			} );
    		} );
    	}

    	return this;
    };




    jQuery.expr.pseudos.animated = function( elem ) {
    	return jQuery.grep( jQuery.timers, function( fn ) {
    		return elem === fn.elem;
    	} ).length;
    };




    jQuery.offset = {
    	setOffset: function( elem, options, i ) {
    		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
    			position = jQuery.css( elem, "position" ),
    			curElem = jQuery( elem ),
    			props = {};

    		// Set position first, in-case top/left are set even on static elem
    		if ( position === "static" ) {
    			elem.style.position = "relative";
    		}

    		curOffset = curElem.offset();
    		curCSSTop = jQuery.css( elem, "top" );
    		curCSSLeft = jQuery.css( elem, "left" );
    		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
    			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

    		// Need to be able to calculate position if either
    		// top or left is auto and position is either absolute or fixed
    		if ( calculatePosition ) {
    			curPosition = curElem.position();
    			curTop = curPosition.top;
    			curLeft = curPosition.left;

    		} else {
    			curTop = parseFloat( curCSSTop ) || 0;
    			curLeft = parseFloat( curCSSLeft ) || 0;
    		}

    		if ( isFunction( options ) ) {

    			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
    			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
    		}

    		if ( options.top != null ) {
    			props.top = ( options.top - curOffset.top ) + curTop;
    		}
    		if ( options.left != null ) {
    			props.left = ( options.left - curOffset.left ) + curLeft;
    		}

    		if ( "using" in options ) {
    			options.using.call( elem, props );

    		} else {
    			if ( typeof props.top === "number" ) {
    				props.top += "px";
    			}
    			if ( typeof props.left === "number" ) {
    				props.left += "px";
    			}
    			curElem.css( props );
    		}
    	}
    };

    jQuery.fn.extend( {

    	// offset() relates an element's border box to the document origin
    	offset: function( options ) {

    		// Preserve chaining for setter
    		if ( arguments.length ) {
    			return options === undefined ?
    				this :
    				this.each( function( i ) {
    					jQuery.offset.setOffset( this, options, i );
    				} );
    		}

    		var rect, win,
    			elem = this[ 0 ];

    		if ( !elem ) {
    			return;
    		}

    		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    		// Support: IE <=11 only
    		// Running getBoundingClientRect on a
    		// disconnected node in IE throws an error
    		if ( !elem.getClientRects().length ) {
    			return { top: 0, left: 0 };
    		}

    		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
    		rect = elem.getBoundingClientRect();
    		win = elem.ownerDocument.defaultView;
    		return {
    			top: rect.top + win.pageYOffset,
    			left: rect.left + win.pageXOffset
    		};
    	},

    	// position() relates an element's margin box to its offset parent's padding box
    	// This corresponds to the behavior of CSS absolute positioning
    	position: function() {
    		if ( !this[ 0 ] ) {
    			return;
    		}

    		var offsetParent, offset, doc,
    			elem = this[ 0 ],
    			parentOffset = { top: 0, left: 0 };

    		// position:fixed elements are offset from the viewport, which itself always has zero offset
    		if ( jQuery.css( elem, "position" ) === "fixed" ) {

    			// Assume position:fixed implies availability of getBoundingClientRect
    			offset = elem.getBoundingClientRect();

    		} else {
    			offset = this.offset();

    			// Account for the *real* offset parent, which can be the document or its root element
    			// when a statically positioned element is identified
    			doc = elem.ownerDocument;
    			offsetParent = elem.offsetParent || doc.documentElement;
    			while ( offsetParent &&
    				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
    				jQuery.css( offsetParent, "position" ) === "static" ) {

    				offsetParent = offsetParent.parentNode;
    			}
    			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

    				// Incorporate borders into its offset, since they are outside its content origin
    				parentOffset = jQuery( offsetParent ).offset();
    				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
    				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
    			}
    		}

    		// Subtract parent offsets and element margins
    		return {
    			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
    			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    		};
    	},

    	// This method will return documentElement in the following cases:
    	// 1) For the element inside the iframe without offsetParent, this method will return
    	//    documentElement of the parent window
    	// 2) For the hidden or detached element
    	// 3) For body or html element, i.e. in case of the html node - it will return itself
    	//
    	// but those exceptions were never presented as a real life use-cases
    	// and might be considered as more preferable results.
    	//
    	// This logic, however, is not guaranteed and can change at any point in the future
    	offsetParent: function() {
    		return this.map( function() {
    			var offsetParent = this.offsetParent;

    			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
    				offsetParent = offsetParent.offsetParent;
    			}

    			return offsetParent || documentElement;
    		} );
    	}
    } );

    // Create scrollLeft and scrollTop methods
    jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
    	var top = "pageYOffset" === prop;

    	jQuery.fn[ method ] = function( val ) {
    		return access( this, function( elem, method, val ) {

    			// Coalesce documents and windows
    			var win;
    			if ( isWindow( elem ) ) {
    				win = elem;
    			} else if ( elem.nodeType === 9 ) {
    				win = elem.defaultView;
    			}

    			if ( val === undefined ) {
    				return win ? win[ prop ] : elem[ method ];
    			}

    			if ( win ) {
    				win.scrollTo(
    					!top ? val : win.pageXOffset,
    					top ? val : win.pageYOffset
    				);

    			} else {
    				elem[ method ] = val;
    			}
    		}, method, val, arguments.length );
    	};
    } );

    // Support: Safari <=7 - 9.1, Chrome <=37 - 49
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each( [ "top", "left" ], function( _i, prop ) {
    	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
    		function( elem, computed ) {
    			if ( computed ) {
    				computed = curCSS( elem, prop );

    				// If curCSS returns percentage, fallback to offset
    				return rnumnonpx.test( computed ) ?
    					jQuery( elem ).position()[ prop ] + "px" :
    					computed;
    			}
    		}
    	);
    } );


    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
    		function( defaultExtra, funcName ) {

    		// Margin is only for outerHeight, outerWidth
    		jQuery.fn[ funcName ] = function( margin, value ) {
    			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
    				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

    			return access( this, function( elem, type, value ) {
    				var doc;

    				if ( isWindow( elem ) ) {

    					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
    					return funcName.indexOf( "outer" ) === 0 ?
    						elem[ "inner" + name ] :
    						elem.document.documentElement[ "client" + name ];
    				}

    				// Get document width or height
    				if ( elem.nodeType === 9 ) {
    					doc = elem.documentElement;

    					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
    					// whichever is greatest
    					return Math.max(
    						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
    						elem.body[ "offset" + name ], doc[ "offset" + name ],
    						doc[ "client" + name ]
    					);
    				}

    				return value === undefined ?

    					// Get width or height on the element, requesting but not forcing parseFloat
    					jQuery.css( elem, type, extra ) :

    					// Set width or height on the element
    					jQuery.style( elem, type, value, extra );
    			}, type, chainable ? margin : undefined, chainable );
    		};
    	} );
    } );


    jQuery.each( [
    	"ajaxStart",
    	"ajaxStop",
    	"ajaxComplete",
    	"ajaxError",
    	"ajaxSuccess",
    	"ajaxSend"
    ], function( _i, type ) {
    	jQuery.fn[ type ] = function( fn ) {
    		return this.on( type, fn );
    	};
    } );




    jQuery.fn.extend( {

    	bind: function( types, data, fn ) {
    		return this.on( types, null, data, fn );
    	},
    	unbind: function( types, fn ) {
    		return this.off( types, null, fn );
    	},

    	delegate: function( selector, types, data, fn ) {
    		return this.on( types, selector, data, fn );
    	},
    	undelegate: function( selector, types, fn ) {

    		// ( namespace ) or ( selector, types [, fn] )
    		return arguments.length === 1 ?
    			this.off( selector, "**" ) :
    			this.off( types, selector || "**", fn );
    	},

    	hover: function( fnOver, fnOut ) {
    		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    	}
    } );

    jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
    	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
    	function( _i, name ) {

    		// Handle event binding
    		jQuery.fn[ name ] = function( data, fn ) {
    			return arguments.length > 0 ?
    				this.on( name, null, data, fn ) :
    				this.trigger( name );
    		};
    	} );




    // Support: Android <=4.0 only
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    // Bind a function to a context, optionally partially applying any
    // arguments.
    // jQuery.proxy is deprecated to promote standards (specifically Function#bind)
    // However, it is not slated for removal any time soon
    jQuery.proxy = function( fn, context ) {
    	var tmp, args, proxy;

    	if ( typeof context === "string" ) {
    		tmp = fn[ context ];
    		context = fn;
    		fn = tmp;
    	}

    	// Quick check to determine if target is callable, in the spec
    	// this throws a TypeError, but we will just return undefined.
    	if ( !isFunction( fn ) ) {
    		return undefined;
    	}

    	// Simulated bind
    	args = slice.call( arguments, 2 );
    	proxy = function() {
    		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
    	};

    	// Set the guid of unique handler to the same of original handler, so it can be removed
    	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    	return proxy;
    };

    jQuery.holdReady = function( hold ) {
    	if ( hold ) {
    		jQuery.readyWait++;
    	} else {
    		jQuery.ready( true );
    	}
    };
    jQuery.isArray = Array.isArray;
    jQuery.parseJSON = JSON.parse;
    jQuery.nodeName = nodeName;
    jQuery.isFunction = isFunction;
    jQuery.isWindow = isWindow;
    jQuery.camelCase = camelCase;
    jQuery.type = toType;

    jQuery.now = Date.now;

    jQuery.isNumeric = function( obj ) {

    	// As of jQuery 3.0, isNumeric is limited to
    	// strings and numbers (primitives or objects)
    	// that can be coerced to finite numbers (gh-2662)
    	var type = jQuery.type( obj );
    	return ( type === "number" || type === "string" ) &&

    		// parseFloat NaNs numeric-cast false positives ("")
    		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    		// subtraction forces infinities to NaN
    		!isNaN( obj - parseFloat( obj ) );
    };

    jQuery.trim = function( text ) {
    	return text == null ?
    		"" :
    		( text + "" ).replace( rtrim, "" );
    };




    var

    	// Map over jQuery in case of overwrite
    	_jQuery = window.jQuery,

    	// Map over the $ in case of overwrite
    	_$ = window.$;

    jQuery.noConflict = function( deep ) {
    	if ( window.$ === jQuery ) {
    		window.$ = _$;
    	}

    	if ( deep && window.jQuery === jQuery ) {
    		window.jQuery = _jQuery;
    	}

    	return jQuery;
    };

    // Expose jQuery and $ identifiers, even in AMD
    // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if ( typeof noGlobal === "undefined" ) {
    	window.jQuery = window.$ = jQuery;
    }




    return jQuery;
    } );
    });

    var ALGO = ALGO || {mathtype:""};

    ALGO.init = function (algostr, genereted_str) {	
    	let var_list = '';
    	try {
    		var_list = ALGO.util.generateVariables (algostr, genereted_str);
    	} catch(e) {
    		swal({
    			html: true,          
    			title: '',
    			text: "<b>"+e+"<br/><br/>Variables are not correctly defined!</b>",
    			type: "error"
    		});
    	}
    	console.log('var llist',var_list);
    	return var_list;
    };

    ALGO.util = {
    	generateVariables : function (algostr, genereted_str) {
    		const regex_mathtype = /is_advance[\s]*=([\s"'\d]*)/;
    		//if (genereted_str != "" && genereted_str != "undefined") {
    			//return JSON.parse(genereted_str);
    		//} else {
    			let fnName = "",
    				var_list = {};				
    			var xml = algostr.split("\n");
    			try {			
                    ALGO.mathtype = +xml[0].match(regex_mathtype)[1].match(/[\d]+/);
    			} catch(err) {
                    ALGO.mathtype = "";
    			}		
    			for (let i = 0; i < xml.length; i++) {			
                    let xml_id = xml[i],
    				xml_arr = xml_id.split("=");
    				fnName = xml_arr[1].substr(0, xml_arr[1].indexOf('(')).trim();	
    				switch (fnName) {
    					case "rand_int":
    					fnName = "randInt";
    					break;
    					case "rand_float":
    						fnName = "randFloat";
    						break;
    					case "uc_sqrt":
    						fnName = "ucSqrt";
    						break;
    					case "rand_obj":
    						fnName = "randObj";
    						break;
    				}	
    				if (typeof ALGO.math[fnName] != 'object') {
    					fnName = "";
    				}					
    				if (fnName != "") {	 
    					const regExp = /\(([^)]+)\)/;
    					let val_eval = [],
    					matches = regExp.exec(xml_arr[1]),
    					min,
    					max,
    					fix_decimal;
    					switch (fnName.trim()) {
    						case "randInt":
    							val_eval = matches[1].split(',');	
    							min = parseInt(val_eval[0]);
    							max = parseInt(val_eval[1]);
    							fix_decimal = parseInt(val_eval[2]);
    							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
    							break;
    						case "randFloat":
    							val_eval = matches[1].split(',');					
    							min = parseFloat(val_eval[0]);
    							max = parseFloat(val_eval[1]);								
    							fix_decimal = parseInt(val_eval[2]);
    							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
    							break;
    						case "ucSqrt":
    							val_eval = matches[1].split(',');	
    							min = parseInt(val_eval[0]);
    							max = parseInt(val_eval[1]);
    							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min, max);
    							break;
    						case "ucPow":
    							val_eval = matches[1].split(',');	
    							min = parseInt(val_eval[0]);
    							max = parseInt(val_eval[1]);
    							fix_decimal = parseInt(val_eval[2]);
    							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (min,max,fix_decimal);
    						break;						
    						default:		
    							let string = JSON.stringify(matches[1]);					
    							string = string.trim().replace(/"|\\/g,'');					
    							var_list[xml_arr[0].trim()] = ALGO.math [fnName].f (string);
    					}						 
    				}
    				if (fnName == "") {								
    					const regExp_arth = /(\*|\+|\-|\/|\^|\%|\(|\)|\,|\[|\]|\#)/g,
    						regExp_semicolon = /;|\\/g;				
    					let test = xml_arr[1].split(regExp_arth),
    						expression = "";
    					var iscartesian = false;			
    					for (let j = 0; j < test.length; j++) {
    						test[j] = test[j].trim();
    						if (test[j] != ";" && test[j] != "") {
    							test[j] = test[j].replace(regExp_semicolon,'');
    							if (test[j] == "#") {
    								test[j] = "'";								
    							} else {
    								test[j] = var_list.hasOwnProperty(test[j]) ? var_list[test[j]] : isNaN(+test[j])?test[j]:+test[j];
    							}
    							let t = test[j];
    							t = typeof t == "string" ? t.trim() : t;						
    							if (t == 'math.setCartesian') {								
    								iscartesian = true;
    							}
    							expression = expression + test[j];
    						} else {
    							continue;
    						}
    					}		
    					if (ALGO.mathtype == 2) {
    						if (iscartesian == true) {
    							var testing = eval(expression),
    								str = "";
    							for (var k=0;k<testing.length;k++) {
    								testing[k] = "("+testing[k]+") ";
    								str = str+testing[k];
    							}	
    							var_list[xml_arr[0].trim()] = str;
    						}					
    						if (!iscartesian) {
    							var_list[xml_arr[0].trim()] = eval(expression).toString();					
    						}						
    						if (var_list[xml_arr[0].trim()] == "") {
    							var_list[xml_arr[0].trim()] = "None of these";
    						}				
    					} 
    					if (ALGO.mathtype == "") {						
    						var_list[xml_arr[0].trim()] = eval(expression.trim());
    					}
    				}				
    			}	
    			return var_list;
    		//}
        }
    };
    ALGO.init.replaceVariables = function (latex_str, var_list) {
        for (let i in var_list) {
    		let temp = "<\{"+i+"\}>";
    		var re = new RegExp(temp, "g");
            latex_str = latex_str.replace(re, var_list[i]);		
        }	
        return latex_str;
    };

    ALGO.math = {
    	randObj : {
    		text:"Randomize Object",
    		description:"Find the random string or character",
    		param:"(javascript,java,C,react,php)",
    		use:"randObj(javascript,php,java,c)",
    		f : function (object) {
    			let val_eval = object.split(',');	
    			return val_eval[ALGO.math.randInt.f(0,val_eval.length-1)];
    		}
    	},
    	randInt : {
    		text:"Randomize Integer",
    		description:"Find the random integer value (min-value, max-value, no. of values after decimal)",
    		param:"minimunvalue,maximumvalue",
    		agrlength:2,
    		use:"randInt(1,4,2)",
    		f : function (min, max, fix_decimal) {	
    			return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(fix_decimal);
    		}
    	},
    	randFloat : {
    		text:"Randomize Float",
    		description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",
    		param:"minimunvalue,maximumvalue",
    		agrlength:2,
    		use:"randFloat(1,4,2)",
    		f : function  (min, max, fix_decimal) {
    			return (Math.random() * (max - min) + min).toFixed(fix_decimal);
    		}
    	},
    	ucSqrt : {
    		text:"Square root",
    		description:"Find the square root (value, no. of values after decimal)",
    		param:"minimunvalue,maximumvalue",
    		agrlength:2,
    		use:"ucSqrt(9,2)",
    		f : function  (min, max) {
    			return (Math.sqrt(min)).toFixed(max);
    		}
    	},
    	ucPow : {
    		text:"Power",
    		description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",
    		param:"minimunvalue,maximumvalue",
    		agrlength:2,
    		use:"ucPow(4,3,2)",
    		f : function  (min, max, fix_decimal) {
    			return (Math.pow(min, max)).toFixed(fix_decimal);
    		}
    	}		
    };

    var Step = ALGO;

    const l = {
        add_new_task : "Add new task",
        edit_task : "Edit task",
        you_cant_add_task_from_chapter : "You can't add task from chapter",
        status_update_success_txt : "Status has been updated successfully.",
        deleting_multiple_contents_will_also_delete_the_nested_contents: "If this item has nested sub-items, then deleting this will also delete sub-items.",
        viewer_error_msg_js: "You are participating as a viewer, You don't have permission to save.",
        add_new_part: "Add New Part",
        cut_js: "Cut",
        paste_js: "Paste",
        eng: "English",
        deleted: "Deleted",
        donot_select_multiseat: "Please do not select multi seat vouchers.",
        select_used_voucher: "Please select used voucher only.",
        edit_js: "Edit ",
        delete_js: "Delete ",
        add_existing_content: "Add Existing Content",
        duplicate_row: "Duplicate Row",
        author_lesson: "Author as Lesson",
        draft_js: "Draft",
        publish_js: "Publish",
        edit_mode: "Lesson Preview",
        import_from_epub: "Import a Lesson Below",
        select_new_content_type: "Select new content type",
        change_type_js: "Change type",
        objective_js: "Objective",
        fact_js: "Fact",
        embeded_content_js: "Embeded content",
        glossary_js: "Glossary",
        customize_saved: "Saved Successfully.",
        unable_save: "Error. Unable to save",
        add_txt : "Add",
        actions_txt : "Actions",
        bug_update : "Bug updated successfully.",
        org_url_exist : "Org Ucertify Url already exists!!",
        logo_validate : "logo must be less than 1MB.",
        logo_res : "logo size must be of maximum 300x100 pixel resolution.",
        image_validate : "Only jpeg, jpg, png, gif, bmp file types are supported.",
        country_update : "Country updated successfully.",
        country_not_updated : "Country not updated.",
        post_update : "Post updated successfully.",
        post_not_updated : "Post not updated.",
        user_deleted  : "The user has been deleted successfully! ",
        user_not_deleted  : "The user cannot be deleted.Please try after some time!",
        first_js_lang : "Js Testing",
        error_while_saving_please_try_again : "Error while saving, please try again",
        do_you_really_want_to_save : "Do you really want to Save?",
        off: "Off",
        lti_success: "Your score has been updated on your LMS.",
        lti_fail: "Score is not updated due to some technical issue.",
        select_an_option_txt : "Select an option",
        updated_please_reload : "Updated, please reload.",
        content_not_deleted_please_try_again : "Unable to delete the content. Please try again.",
        delete_content_with_child : "Item is deleted successfully with its child.",
        error_unable_to_delete : "Error. Unable to delete",
        no_changes_txt : "No changes.",
        content_has_been_added_successfully : "Content has been added successfully.",
        content_has_not_been_added_successfully : "Content has not been added successfully.",
        part_has_been_deleted_successfully : "Part has been deleted successfully.",
        content_has_been_moved_successfully : "Content has been moved successfully.",
        content_has_not_been_moved_successfully : "Content has not been moved successfully.",
        error_unable_to_move : "Error. Unable to move",
        content_level_has_been_changed_successfully : "Content level has been changed successfully.",
        content_level_has_not_been_changed_successfully : "Content level has not been changed successfully.",
        error_unable_to_changed_level : "Error. Unable to changed the level",
        taglist: "Tag List",
        formats: "Formats",
        inline: "Inline",
        bold: "Bold",
        bits: "bold",
        italic: "Italic",
        italics: "italic",
        underline: "Underline",
        underlines: "underline",
        strikethrough: "Strikethrough",
        strikethroughs: "strikethrough",
        superscript: "Superscript",
        superscripts: "superscript",
        subscript: "Subscript",
        subscripts: "subscript",
        small: "Small",
        smalls: "small",
        heading: "Heading",
        heading1: "Heading 1",
        heading2: "Heading 2",
        heading3: "Heading 3",
        heading4: "Heading 4",
        heading5: "Heading 5",
        heading6: "Heading 6",
        newspaper: "Newspaper Font",
        blocks: "Blocks",
        para: "Paragraph",
        div: "Div",
        block: "Blockquote",
        span: "Span",
        code: "Code",
        insnote: "Instructor Note",
        insans: "Instructor Answer",
        alignment: "Alignment",
        left: "Left",
        alignleft: "alignleft",
        center: "Center",
        aligncenter: "aligncenter",
        right: "Right",
        alignright: "alignright",
        justify: "Justify",
        alignjustify: "alignjustify",
        cases: "Cases",
        uppercase: "Uppercase",
        lowercase: "Lowercase",
        titlecase: "Titlecase",
        sentence_case: "Sentence Case",
        toggle_case: "Toggle Case",
        color: "Color",
        success: "Success",
        bsuccess: "b-success",
        warning: "Warning",
        bwarning: "b-warning",
        danger: "Danger",
        bdanger: "b-danger",
        white: "White",
        bwhite: "b-white",
        green: "Green",
        bgreen: "b-green",
        objref: "objref(italic)",
        borange: "b-orange",
        binfo: "b-info",
        bprimary: "b-primary",
        bgcolor: "Background color",
        lsuccess: "Label-Success",
        linfo: "Label-Info",
        lprimary: "Label-Primary",
        ldanger: "Label-Danger",
        lwarning: "Label-Warning",
        list: "List",
        withoutBullet: "Without Bullet",
        numlist: "Numbered list",
        alphlist: "Alphabetical list",
        romanlist: "Roman list",
        numalphlist: "Numeric alpha list",
        bullist: "Bullet list",
        blarlist: "Black arrow bullets",
        bluearlist: "Blue arrow bullets",
        blarbullet: "Blue arrow bullets with gray background",
        blcrcbbullet: "Blue circle bullets",
        bcbwbt: "Blue circle bullet with black text",
        redcrlist: "Red circle list",
        whcrclist: "White circle list",
        tickbull: "Tick Bullet",
        listtype1: "List type 1",
        listtype2: "List type 2",
        listtype3: "List type 3",
        listtype4: "List type 4",
        listtype5: "List type 5",
        listtype6: "List type 6",
        table: "Table",
        deftable: "Default Table",
        smplbortab: "Simple Bordered Table",
        unbortab: "Unbordered Table",
        borbacktab: "Bordered Background Table",
        hrowsbor: "Highlighted Rows Bordered",
        strptab: "Stripped Table",
        tabhovdes: "Table Hover Design",
        mulstrp: "Multiple Stripes",
        separate: "Separate",
        grycolor: "Gray color column",
        blueshade: "Blue header with shading table",
        box: "Box",
        panelblue: "Panel Box Blue",
        panelgreen: "Panel Box Green",
        panelsky: "Panel Box Sky-blue",
        panelgrad: "Panel Box gradient",
        block_with_border: "Panel Box with Border",
        blockgrey: "Block in grey background",
        symbols: "Symbols",
        ucsyntax: "UC Syntax",
        indentation: "Indentation",
        clear_formatting: "Clear Formatting",
        wrap_text: "Wrap your text in block element to indent",
        outdent: "outdent",
        removeformat: "removeformat",
        align_content_message: "Wrap your text in block element to align content",
        blue_color:"Blue",
        orange_color:"Orange",
        red_color: "Red",
        golden_brown_color: "Golden Brown",
        black_color: "Black",
        green_color: "Green",
        cyan_color:  "Cyan",
        uc_syntax_format1: "White with number",
        uc_syntax_format2: "White without number",
        uc_syntax_format3: "Black with number",
        uc_syntax_format4: "Black without number",
        line_break1: "Single line Break",
        line_break2: "Double line Break",
        quotes: "Quotes(Sayings)",
        code_block1: "Syntax",
        code_block2: "Black with number",
        code_block3: "Black without number",
        code_block4: "White with number",
        code_block5: "White without number",
        timeline: "Timeline",
        slideshow :"Slideshow",
        panel_success: "Panel Success",
        panel_info: "Panel Info",
        panel_primary: "Panel Primary",
        panel_danger: "Panel Danger",
        panel_warning: "Panel Warning",
        acc_list1: "Accordion List 1",
        acc_list2: "Accordion List 2",
        acc_list3: "Accordion List 3",
        acc_list4: "Accordion List 4",
        inlineAlign: "icomoon-inline",
        headings: "icomoon-heading",
        block_ico: "icomoon-blocks",
        alginments: "icomoon-align",
        case: "icomoon-cases",
        colors: "icomoon-color",
        background: "icomoon-background-color",
        lists: "icomoon-list",
        tables: "icomoon-table",
        boxes: "icomoon-24-px-box",
        symbol: "icomoon-symbols",
        ucsyntaxes: "icomoon-uC-syntax",
        ucfeed: "icomoon-uC-feedback",
        dummyText: "Enter Your Text Here",
        authoring : "Authoring",
        change_view : "Change View",
        render_tag : "Render Tags",
        version_control : "Revision History",
        preview : "Preview",
        remediation : "Remediation",
        back : "Back",
        save_header : "Confirmation",
        save_process : "Please, be patient. We are saving your data...",
        save_confirmation : "Do you want to save this content?",
        cancel : "Cancel",
        done : "Done",
        save_new : "Save as new",
        save : "Save",
        save_success : "Data saved successfully",
        save_success_owner : "Content is successfully saved. Get it published by the Reviewer/Owner to make it visible in the course.",
        save_error : "It seems that the course is not loaded. Please load the course before you save.",
        setting : "Settings",
        add_response : "Add Response",
        add_editable : "Add Editable",
        case_sensetive : "Case Sensitive",
        ignore_spcl_char : "Ignore Special Character",
        multi : "Multiple Correct Answer",
        fill_header : "Fill in the blanks - type",
        fill_text_title : "Fill in the blanks (with text)",
        fill_dropdown_title : "Fill in the blanks (with drop downs)",
        fill_dragdrop_title : "Fill in the blanks (with drag & drop)",
        short_text : "Short Text",
        fill_multiline_title : "Fill in the blanks (with multiline)",
        fill_math_title : "Fill in the blanks (with mathematical equations)",
        fill_text_placeholder : "Write correct answer here",
        fill_text_help1 : "1. To include multiple correct answers, type the answers and separate them with a comma (,).",
        fill_text_help2 : "2. Please do not include any space. Now, go back to the Settings and select Multiple Correct Answers from the drop-down.",
        fill_text_help3 : "Use #cm for comma (e.g., 5,000 as 5#cm000).",
        fill_math_help1 : "1. To make math equation initially, Click f(x) and then insert the equation.",
        fill_math_help2 : "2. To add user Response, place cursor before{*} and Click Add Response.",
        fill_math_help3 : "3. To edit the existing equation, Click Edit.",
        //fill_text_help3 : "Now, go back to Settings and select Multi from the drop-down.",
        fill_dropdown_placeholder : "Write Option here",
        fill_dropdown_help1 : "1. To choose correct answer, select any one radio button from the given options.",
        fill_dropdown_help2 : "2. To choose the display answer, put ‘+’ sign before it. For eg: (+value).",
        fill_dropdown_help3 : "3. To give comma (,) between the text use #cm symbol.",
        drag_single : "Allow single dragging",
        fill_dragdrop_help1 : "1. By default, all answer option is correct.",
        fill_dragdrop_help2 : "2. To make an option incorrect, uncheck the corresponding checkbox.",
        fill_dragdrop_help3 : "3. To give comma (,) between the text use #cm symbol.",
        fill_dragdrop_help4 : "4. To give Vertical bar (|) use #pipe symbol.",
        default_answer : "Default Answer",
        rows : "Rows",
        cols : "Cols",
        fill_multiline_help1 : "By default, all the options provided are correct.",
        matchlist_heading1 : "List 1 heading",
        matchlist_heading2 : "List 2 heading",
        matchlist_normal : "Normal",
        matchlist_dnd : "Drag & Drop",
        shuffle : "Click here to Shuffle",
        add_item : "Add item",
        allow_sort : "Sequence", //"Allow User to Sort",
        in_sentence : "Sentence",
        in_paragraph : "Paragraph",
        go_back : "Go Back",
        goback_header : "Confirmation",
        goback_confirmation : "Do you really want to go to item list?",
        sceneChange_confirmation: "Your changes will be lost. Do you want to save this content ? ",
        show_preview : "Preview",
        xml : "XML",
        back_authoring : "Back to Authoring",
        title : "Title",
        stem : "Stem",
        content : "Content",
        error : "Error",
        playertag : "Player Tag",
        equationeditor : "Equation Editor",
        error_occured : "Something went wrong, Please try again.",
        click_preview : "Click To Preview",
        loading_module : "Loading Module",
        something_wrong : "Something went wrong, Please try again.",
        reload : "Reload",
        search_here : "Search here...",
        all_item : "All Items",
        max_error : "More than 6 options may cause this item to not render properly on a smartphone.",
        reset : "Reset",
        resetDB : "Reset DB",
        calculate_answer : "Calculating Answer",
        add : "Add",
        remove : "Remove",
        correct_answer : "Correct Answer",
        your_answer : "Your Answer",
        correct : "Correct",
        incorrect : "Incorrect",
        select_language : "Language",
        please_wait : "Please, be patient. We are working things up for you. ",
        sequence : "Sequence",
        multi_check : "Multi Check",
        default : "Default",
        heading_correct : "Heading for correct list item",
        heading_all : "Heading for all list item",
        open_doc : "uCertify Team has open this content for editing. Your changes might be lost.",
        getting_diff : "Please, be patient. We are calculating the differences for you.",
        getting_list : "Please, be patient. We are generating the list for you.",
        restore_currect : "Restore Current Version",
        submit : "Submit",
        getting_webpage : "Please, be patient. We are generating the Webpage list for you.",
        getting_docx : "Please, be patient. We are generating the Content in Docx Formatting for you.",
        getting_help : "Please, be patient. We are generating the help for you.",
        warning : "Warning!",
        row_limit : "You have reached the minimum number of rows you can delete.",
        col_limit : "You have reached the minimum number of columns you can delete.",
        del_confirmation : "Are you sure you want to delete it?",
        wrong_value_information : "Values of the row and column should always be multiples of ",
        min_row_col_value : "Insufficient value to make a table; there should be atleast four values.",
        provide_value_suggestion : "Insufficient value to make a table; please increase or decrease the value by 1.",
        totaloption : 'Total number of values available : ',
        max_row_col_error : "More than five rows and five columns may not render properly on a smartphone.",
        create_existing_variable : "Create Existing Variable",
        create_new_variable : "Create New variable",
        update_variable : "Update Variable",
        use_existing_variable : "Use existing variable",
        help : "Help",
        create_variable : "Create Variable",
        all_function_help : "* Do not give a variable name containing space.",
        randInt_function_help : "* Default value will be 1.",
        randint_randfloat_function_help1 : "* This function is used to find a random number between two given numbers.",
        randint_randfloat_function_help2 : "* Do not provide the non-integer value in the minimum and maximum fields.",
        randint_randfloat_function_help3 : "* Minimum value should always be less than the maximum value.",
        randobj_function_help1 : "* This function is used to find a random character or string separated by "+"\",\" (comma).",
        randobj_function_help2 : "* Provide the value like Java, React, Php, and C.",
        custom_function_help1 : "* This function is used to solve any expression.",
        custom_function_help2 : "* Some of the functions take a character/word as an argument so the argument must be passed between the # (hash) symbol.",
        custom_function_help3 : "* If you want to find Intersection, then the argument must be passed like this: math.setIntersect([#a#,#b#],[#a#,#b#,#c#]).",
        custom_function_help4 : "* If you want to find Differentiation, then the argument must be passed like this: math.derivative(#var1*obj1<sup>var2</sup>-var3*obj1+var4#,#obj1#).",
        edit_token: "Highlight correct token",
        edit_template: "Enter text",
        word: "Word",
        sentance: "Sentence",
        paragraph: "Paragraph",
        clear: "Clear",
        no_of_token: "Selected",
        token_highlight: "Token Highlight",
        direction: "Direction:",
        enableline : "Enable-line",
        language: "Language",
        add_testcase: "Add Testcase",
        run: "Run",
        run_code: "Run Code",
        html_css_js: "HTML/ CSS/ JS",
        input: "Input",
        output: "Output",
        testcases: "Testcases",
        close: "Close",
        pre: "Pre",
        post: "Post",
        editor: "Editor",
        save_variable : "Save Variables",
        create_steps : "Create Steps",
        plain_text : "Plain text",
        interactive : "Interactive",
        no_validation : "No validation",
        sticky : "Sticky",
        "delete" : "Delete",
        confirm_delete_variable : "If this variable is used in steps it will be treated as text. Are you sure you want to delete it?",
        next : "Next",
        solve : "Solve",
        functions: "Functions",
        Allsymbols: "All Symbols",
        Basic: "Basic",
        xvariables: "x",
        sin: "sin",
        Misc: "Misc",
        Discrete: "Discrete",
        kg: "kg",
        lb: "lb",
        brackets: "Brackets",
        algo_xml: "Algo XML",
        val_variations: "Values variations",
        chem: "Chem",
        tools: "Tools",
        domain: "Domain",
        exam_objective: "Exam Objective",
        web_pages: "Web pages",
        docx_formatting: "Docx Formatting",
        analyze_ebook: "Analyze Ebook Item",
        inline: "Inline",
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strikethrough: "Strikethrough",
        superscript: "Superscript",
        subscript: "Subscript",
        small: "Small",
        subtype: "Tag SubType:",
        showangle: "Show Angle",
        alignment: "Alignment:",
        raw: "RAW",
        html: "HTML",
        css: "CSS",
        js: "JS",
        result: "Result",
        autograde: "Autograde",
        disable: "Disable/Hide",
        editable: "Editable",
        hidden: "Hidden",
        disabled: "Disabled",
        internalScript: "Internal Script",
        externalScript: "External Script",
        detail: "Detail",
        element_name: "Element Name",
        convert: "Convert",
        analyze_content: "Analyze Content",
        analyzing: "Analyzing",
        show_more: "Show more",
        show_less: "Show less",
        task:"Task",
        task_objective:"Task Objective",
        textsnippet:"Text Snippet",
        sectiondetail:"Section Details",
        tags:"Tags",
        item:"Item",
        itemType:"Item Type",
        type:"Type",
        comments:"Comments",
        cognitive_level:"Cognitive Level",
        refer_content:"Refer Content",
        create_equation:"Create Equation",
        help_video:"Help Video",
        diagnostic:"Diagnostic",
        keyboard_shortcut:"Keyboard Shortcut",
        delete_exist_element: "Are you sure you want to delete existing elements?",
        edit_dialog: "Edit Dialog",
        update: "Update",
        add_category: "Add Category",
        import_csv: "Import CSV",
        create_new_question: "Create New Question",
        max: "Max",
        min: "Min",
        step: "step",
        slider: "Slider",
        oops_msg: "Oops! Something went wrong please check your ParseXML Function.",
        minimum: "Minimum",
        maximum: "Maximum",
        step: "Step",
        ignore_grading: "Ignore grading",
        eval_ada1_msg: "1. Press 'CTRL+SHIFT+Enter key' to RUN the code",
        eval_ada2_msg: "2. Press 'CTRL+SHIFT+SPACE key' to goto Input/Output side",
        eval_ada_info: "ADA Information",
        annotationId: "Enter image annotation item ID here",
        annotationPlaceholder: "Enter image annotation title here",
        imageAnnotation: "An annotation player is used to add the image annotation in the middle of the e-book lessons.",
        select_lang: "Please select language",
        show_transcript: "Show transcript",
        audio_recorder: "Audio Recorder",
        starting_message: "Click on record to start recording",
        spoken_label: "What we heard",
        note_label: "Note: ",
        insensitive_message: "Matching is case insensitive.",
        recording_warning: "Recording will end automatically after 15 sec.",
        english_us: "English (United States)",
        english_in: "English (U.K.)",
        italiano: "Italian",
        suomi: "Finnish",
        svenska: "Swedish",
        confirm_label: "Confirm",
        modal_data: "It will override the previous recording. Do you want to continue?",
        no_label: "No",
        yes_label: "Yes",
        browser_support_msg: "Your browser does not support this feature. Please use latest version of chrome browser to use this feature.",
        recording_ended: "Recording ended.",
        no_data_msg: "No recorded data found.",
        matching_msg: "No matching data is found.",
        space_warning: "Do not use more than one space unnecessary.",
        separate_by_quote: "separate with &quot; , &quot",
        pre_code: "pre code",
        write_function_here: "Write your function here...",
        postcode: "post code",
        seperate_by_enter_key: "Separate input by 'enter' key",
        minus_1: "-1",
        case_insensitive: "Case Insensitive",
        partial_matching: "Partial Matching",
        partial_match: "Partial Match",
        special_char: "Special Char",
        input_seperated_comma: "Input seperated by ','",
        ignore_special_char: "Ignore Special Char",
        testcase: "TestCase",
        markPointColor: "Point Color",
        lightGreen: "Light Green",
        black: "Black",
        orange : "Orange",
        select_case_match: "Select case match",
        decimal_position: "Please Enter the decimal position between 1 to ",
        grid_one_to_ten: "Number Must be between 1 to 10",
        col_less_one : "Column Not allowed less then 1",
        type_one_to_seven: "Please type between 1 to 7",
        row_less_one: "Row Not allowed less then 1",
        type_one_to_ten: "Please type between 1 to 10",
        double_digit: "Double digit not accepted",
        less_one : "Less then 1 not accepted",
        number_from: "Number insert only 0 to ",
        another_option: "Select another option",
        layout_options: "Layout Options",
        row_count: "Row Count",
        col_count: "Column Count",
        empty_field: "Field value can not be empty",
        lock_author_cell: "To Lock author shaded cells, it should be part of correct answer",
        delete_graph: 'Click on this button to delete the graph',
        delete_chart: 'Click on this button to delete the last point of the chart',
        ada_graph_msg: 'Press any key on this button to open modalbox to set the point for draw the graph without click on the graph board',
        ada_chart_msg: 'Press any key on this button to open modalbox to set the point for draw the chart without click on the chart board',
        add_chart_msg: 'Click on this button to add the point on the chart',
        edit_graph: 'Click on this button to open modalbox for change the graph view',
        edit_chart: 'Click on this button to open modalbox for change the chart view',
        validate_dialog: 'You have to put the image name',
        ada_message: "use control plus alt plus 1 to open the dialog for perform the task",
        token_message: "Please use ##pt for dot (.) and #cm for comma (,).",
        button_text: 'Shown on the button at the bottom of the intro screen.',
        level_text: 'Level',
        insert_note: 'Insert Note',
        load_more: 'Load More',
        placeholder_text: 'Enter the name of button',
        name_text: 'Name',
        note_placeholder: 'Insert text here',
        level_placeholder: 'Enter the label message',
        knowledge_check: 'This player tag is used to add questions in the middle of the ebook lessons.',
        enter_title: 'Enter the title',
        multi_item_id: 'Enter the comma-separated item id(s)',
        item_id: 'Item ID',
        graded: 'Graded Item(s)',
        coding: 'This player tag is used to test the web module’s XML and display its preview simultaneously in the ebook lessons.',
        simulation: 'This player tag is used to create menu-based questions in Word or Excel, in which only the tabs are working.',
        terminal: 'This player tag is used to add the Linux, DOS, or Java module questions in the middle of the ebook lessons.',
        lablink: 'This player tag is used to add live labs in the mid of ebook lessons which can then be clicked and opened in a new tab.',
        insight: 'This player tag is used to add the 3D chat questions in the middle of the ebook lessons.',
        playground: 'Coding Lab',
        simulation_txt: 'Simulation',
        terminal_txt: 'Terminal',
        livelab: 'Live Lab',
        lab3d: '3D Lab',
        java_txt: 'Java',
        linux_txt: 'Linux',
        dos_txt: 'DOS',
        default_val: 'Enter the default value. Example: dialog_name=options',
        enter_xml: 'Enter the XML',
        simulator_name: 'Simulator Name',
        simulator_place: 'Enter the simulator name. Example: msoffice-msword-2013',
        enter_item: 'Enter the item id',
        embed: 'Embed',
        new_tab: 'New Tab',
        overlay: 'Overlay',
        btn_name: 'Button Name',
        enter_btn_name: 'Enter the button name',
        correct_val: 'Enter the correct value. Example: dialog=fileoptionsdvanced',
        learn_mode: 'Learn Mode',
        audio_des: 'This player tag is used to add audios in the ebook lessons.',
        video_des: 'This player tag is used to add videos in the ebook lessons.',
        audio_txt: 'Audio',
        video_txt: 'Video',
        url_txt: 'URL',
        media_url: 'Enter the media url',
        transcript_id: 'Transcript ID',
        enter_id: 'Enter the transcript id',
        preview_img: 'Image Preview',
        preview_url: 'Enter the image preview url',
        security_info: 'This is required security configuration',
        security_txt: 'Security',
        security_place: "Enter the security data in json format {'token': '45674', 'wID': '89765'}",
        security_title: "Put the security data in json for example {'token': '45674', 'wID': '89765'}.",
        multiple_video: 'Multiple Videos',
        multiple_info: 'All media on this page will be grouped together in a single carousel.',
        add_interval: 'Add Interval',
        interval_txt: 'Interval',
        in_sec: '(In seconds)',
        action_txt: 'Action',
        caption_txt: 'Caption',
        one_num: '1',
        download_info: 'This player tag is used to attach pdf files, word documents, excel files, powerpoint presentations, or any kind of attachment in the ebook lessons.',
        pdf_info: 'This player tag is used to add the pdf files in the ebook lessons.',
        exhibit_info: 'This player tag is used to add an image or a table in a modal box in quizzes or questions.',
        weblink_info: 'This player tag is used to add the “Click to read” link, having an image in its background, in the middle of the ebook lessons, which redirects a user to the new link or web page.',
        download_txt: 'Download',
        exhibit_txt: 'Exhibit',
        pdf_txt: 'PDF',
        weblink_txt: 'Web Link',
        image_txt: 'Image',
        text: 'Text',
        select_img: 'Select an image',
        ms_access: 'MS Access',
        ms_excel: 'MS Excel',
        ms_word: 'MS Word',
        sas_txt: 'SAS',
        zip_txt: 'Zip',
        show_caption: 'Show Button Caption',
        img_show: 'When image will be shown',
        hide_caption: 'Hide Button Caption',
        img_hide: 'When image will be hide',
        btn_txt: 'Button',
        link_txt: 'Link',
        enter_url: 'Enter the url',
        enter_img_url: 'Enter the image url',
        enter_icon_url: 'Enter the image icon url',
        insert_img: 'Insert Image',
        img_alt: 'Image Alt',
        img_desc: "Enter the image's description in brief",
        img_height: 'Enter the image height. Example: 500px',
        frame_height: 'Enter the frame height. Example: 500px',
        frame_ht: 'Frame Height',
        imgage_ht: 'Image Height',
        img_width: 'Image Width',
        enter_img_width: 'Enter the image width. Example: 500px',
        enter_txt: 'Enter the text',
        border_txt: 'Bordered',
        player3d_des: 'A 3D Player tag is used to add images with their descriptions in a 3D structure in the middle of the e-book lessons.',
        snt_des: 'A UC Snt tag is used to add a statement notifying students that more than one option is correct for the given quiz or question.',
        snt_41: 'Each correct answer represents a complete solution. Choose all that apply.',
        snt_40: 'Each correct answer represents a part of the solution. Choose all that apply.',
        snt_39: 'Each correct answer represents a complete solution. Choose three.',
        snt_38: 'Each correct answer represents a part of the solution. Choose three.',
        snt_37: 'Each correct answer represents a complete solution. Choose two.',
        snt_36: 'Each correct answer represents a part of the solution. Choose two.',
        des_txt: 'Description',
        seq_des: 'A UC Seq tag is used to refer the correct and incorrect options in the single/multiple choice questions.',
        enter_seq_title: 'Enter the sequence letter',
        seq_lable: 'Sequence Letter: use a, b, c, d etc. as per the option',
        can_not_del: 'You can not Delete Default Node',
        unable_to_get: 'Unable to get data due to some error.',
        multi_err: 'Multiple item ids are not allowed.',
        invalid_id: 'Invalid Item id.',
        know_check_txt: 'Knowledge Check',
        lab_txt: 'Lab',
        media_txt: 'Media',
        obj3d_txt: '3D Object',
        instruction_txt: 'Instruction',
        opt_ref: 'Option Reference',
        edit_txt: 'Edit',
        list_content: 'List Contents',
        create_new_txt: 'Create New',
        search_item_txt: 'Search Item ID or text',
        no_record: 'No Record Found.',
        scorm_txt: 'Scorm',
        scorm_id: 'Scorm ID',
        scorm_place: 'Enter the scorm transcript id',
        mobile_url: 'Mobile URL',
        mobile_url_place: 'Enter the scorm URL for mobile devices',
        scorm_url: 'Enter the scorm URL',
        width_warning: 'The image width must be in between 100px to 1000px',
        height_warning: 'The image height must be in between 80px to 550px',
        valid_link: 'Please add a valid video link or Check the format for adding the transcript!',
        required_field: 'Please enter all the required fields!',
        vtt_unvalid: 'VTT format is Not valid!',
        vtt_added: 'Transcript ID is added!',
        load_course : 'Please load a course first!',
        asset_not_empty: 'URL can\'t be empty!',
        vtt_exists: 'Transcript is present for this video. ID added!',
        no_title: 'Do not show video title',
        normal_mode: 'Light Mode',
        dark_mode: 'Dark Mode',
        figure_caption_text: 'Figure caption',
        edit_marker_text: 'Edit Marker',
        markers_text: 'Markers',
        upload_media_text: 'Upload Media',
        image_url: 'Image Url',
        image_alt_type: 'Image Alt Text',
        are_you_sure_you_want_to_delete_marker: 'Are you sure you want to delete the marker?',
        add_image_text: 'Add image',
        upload_text: 'Upload',
        file_extension_text: 'File Extensions',
        number_of_files: 'Number of files',
        you_can_upload: '#You can upload upto 10 files only.',
        date_correct_answer_field_placeholder: 'Define The Date For Correct Answer',
        correct_answer_field_placeholder: 'Define The Value For Correct Answer',
        duration: 'Duration',
        vtt: 'VTT',
        enter_vtt: 'Enter VTT Here',
        add_vtt: 'ADD',
        add_transcript_msg: 'Add Transcript',
        edit_transcript_msg: 'Edit Transcript',
        edit_msg: 'Edit',
        parent_guid_found: 'You cannot make changes in a child item. Do you want to open the parent item for making changes?',
        del_row: 'Delete',
        update_child: 'Update Child Items',
        show_child: 'Show Child Item',
        show_all: 'Show all child items',
        generate_item: 'Generate Items',
        plz_sel: 'Please Select',
        csv_file: 'Import .csv file',
        show_all_label: 'Open',
        save_war_msg: 'The current item should be saved first before generating child items',
        generate_items: 'Generate child items',
        already_generated: 'Child items already generated',
        child_not_generated: 'Child items not generated yet',
        new_not_allowed: 'New .csv file cannot be added now, item already created',
        add_option: 'Add Option',
        add_child: 'Add row(s)',
        child_not_selected: 'Child items not selected yet',
        child_update: 'Changes have been made to the parent item. Do you want to update the child items?',
        deletion_not_allowed: 'Child items are created. Deletion is not allowed now',
        update_item: 'Update Item(s)',
        new_row_tooltip: 'New row(s) added. Update child items',
        interval_err: "Video interval can not be more than video duration",
        image_prev_msg: "Image preview cannot be added as video has intervals.",
        video_url_err: "Please add a valid video url",
        delete_warning: 'Do you really want to delete this form block?',
        add_elm: 'Add Elements',
        set_seq: 'Set Sequence',
        pass_elem: 'Password',
        num_elem: 'Number',
        time_elem: 'Time',
        textarea_elem: 'Long Message',
        text_elem: 'Short Message',
        file_elem: 'Upload Image',
        linear_elem: 'Linear Scale',
        select_elem: 'Drop Down',
        chk_elem: 'Checkbox',
        rad_elem: 'Radio',
        date_elem: 'Date',
        add_point: 'Add point',
        set_ans: 'Set Answer',
        ok_btn: 'OK',
        snap_to: 'SnapTo',
        yinterval_val: 'Y (enter multiple values)',
        xinterval_val: 'X (enter multiple values)',
        set_color: 'Set Color',
        primary_color: 'Primary',
        warning_color: 'Warning',
        danger_color: 'Danger',
        default_representation: 'Default representation of chart.',
        xaxis_title: 'X-axis Title',
        yaxis_title: 'Y-axis Title',
        chart_title: 'Chart Title',
        column_label: 'Column',
        line_label: 'Line',
        histogram_label: 'Histogram',
        height_label: 'Height [px]',
        width_label: 'Width [px]',
        chart_label: 'Chart',
        plot_graph: 'Plot Graph',
        xaxis_label: 'X-axis',
        yaxis_label: 'Y-axis',
        xaxis_interval: 'X-axis interval',
        yaxis_interval: 'Y-axis interval',
        width_label1: 'Width',
        height_label1: 'Height',
        axis_label: 'Axis',
        number_line_association: 'Numberline Association',
        numberline_plot: 'Numberline Plot',
        fill_warning: 'Please fill out this field',
        equation: 'Equation',
        both_xy: 'Both X & Y',
        only_x: 'X',
        only_y: 'Y',
        inequality_num: 'Inequality Number Line Equation:',
        equation_type: 'Equation Type',
        standard_form: 'Standard Form : y=m*x+c',
        circle_form: 'Standard Form : (x-x1)^2 + (y-y1)^2 = r^2',
        parabola_form: 'Vertex Form : y=a*(x-h)^2+k',
        sin_form: 'Standard Form : y=a*sin(b*x+c)+d',
        cos_form: 'Standard Form : y=a*cos(b*x+c)+d',
        polygon_type: 'Polygon Type',
        point_graph: 'Point Graph',
        line_graph: 'Line Graph',
        circle_graph: 'Circle Graph',
        ray_graph: 'Ray Graph',
        segment_graph: 'Segment Graph',
        vector_graph: 'Vector Graph',
        parabola_graph: 'Parabola Graph',
        sine_graph: 'Sine Graph',
        cos_graph: 'Cosine Graph',
        polygon_graph: 'Polygon Graph',
        association: 'Association',
        current_item: 'Current Item',
        used_in_items: 'Used In Items',
        file_uploaded: 'File uploaded successfully.',
        html5_not_supported: 'Browser does not support HTML5.',
        upload_valid_csv: 'Please upload a valid .csv file.',
        exact2_column_allowed: 'Exact 2 columns should be present in the .csv file. Upload denied.',
        blank_column_notallowed: 'Blank cell(s) found in the .csv file. Upload denied.',
        min_max_validation: 'Minimum 4 rows and maximum 500 rows are allowed in the .csv file. Upload denied.',
        check_network: 'Something went wrong. Please check your network connection and click the "Generate Items" button again.',
        min4_max500_allowed: 'Minimum 4 rows and maximum 500 rows are allowed for generate the child items.',
        child_items_generated: 'Child items generated successfully.',
        check_net_and_save: 'Something went wrong. Please check your network connection and save the current item.',
        min4_rows_allowed: 'Minimum number of rows should be 4.',
        child_updated: 'Child IDs updated successfully.',
        max500_rows_allowed: 'Maximum number of rows should be 500.',
        check_net_update_ids: 'Something went wrong. Please check your network connection and update the IDs again.',
        fill_required_field: 'Please fill all the required Field! ',
        image_width_range: 'Image width must be between 400px and 600px!',
        edit_image: 'Edit Image',
        image_url: 'Image URL',
        browse: 'Browse',
        image_alt: 'Image Alt',
        image_caption: 'Image Caption',
        image_width: 'Image Width',
        marker_color: 'Marker Color',
        text_align: 'Text Align',
        bottom: 'Bottom',
        on_click: 'On Click',
        mark_symbol: 'Mark Symbol',
        number_marker:'Number Marker',
        plus_marker:'Plus Marker',
        checkmark_marker:'Checkmark Marker',
        cross_marker:'Cross Marker',
        earth_marker:'Earth Marker',
        notification_marker:'Notification Marker',
        radio_marker:'Radio Marker',
        minus_marker:'Minus Marker',
        border: 'Border',
        copy: 'Copy',
        delete_points: 'Delete Points',
        delete_no_of_points: 'To delete the numbers or symbols from the list, delete their mark points.',
        change_image: "Changing Image or Image Width will reposition the markers (Not accurate).\n\n Do you want to reposition markers or reset the data?",
        reposition: 'Reposition',
        delete_confirmation: 'Deleting point will remove its content too! Do you want to delete?',
        copid_paste: ' copied, Click to Paste!',
        point: 'Point',
        deleted_text: ' Deleted!',
        image_err: 'Make Sure all the required fields are non-empty and Image width must be between 400px and 600px!',
        image_alt_text: 'Image Alternative Text ',
        reset_data: 'Do you really want to reset data?',
        delete_row: 'Delete Row',
        delete_column: 'Delete Column',
        min_val: 'Min Value',
        max_val: 'Max Value',
        current_val: 'Current Value',
        correct_val: 'Correct Answer',
        add_slider: 'Add Slider',
        canvas_options: 'Canvas Options',
        cell_width: 'Cell Width',
        multiple_of: 'Multiple of',
        cell_height: 'Cell Height',
        author_shaded: 'Author Shaded',
        lock_shaded_cells: 'Lock shaded cells',
        set_corr_ans: 'Set correct answer(s)',
        method: 'Method',
        set_corr_loc: 'Set Correct Location',
        set_corr_count: 'Set Correct Count',
        you_were_req_to_select: 'You were required to select',
        grid_mark_ans_correct: 'grids to mark the answer correct.',
        hindi_lang: 'Hindi',
        spanish_lang: 'Spanish',
        french_lang: 'French',
        german_lang: 'German',
        japanese_lang: 'Japanese',
        korean_lang: 'Korean',
        drag_drop_set_seq_msg: 'Drag and Drop to set sequence.'
    };
    window.LANG = l;
    var language = l;

    /**
     * File: tagsView.js
     * Description: Create tag view on input box.
     * Author: Pradeep Yadav
     * className: 'tagin'
     * @param {selected elements using class or id} el 
     * @param {separator|duplicate|transform|placeholder} option 
     */
    function TagView(el, option = {}) {
        const classElement = 'tagin';
        const classWrapper = 'tagin-wrapper';
        const classTag = 'tagin-tag';
        const classRemove = 'tagin-tag-remove';
        const classInput = 'tagin-input';
        const classInputHidden = 'tagin-input-hidden';
        const defaultSeparator = ',';
        const defaultDuplicate = 'false';
        const defaultTransform = input => input;
        const defaultPlaceholder = '';
        const separator = el.dataset.separator || option.separator || defaultSeparator;
        const duplicate = el.dataset.duplicate || option.duplicate || defaultDuplicate;
        const transform = eval(el.dataset.transform) || option.transform || defaultTransform;
        const placeholder = el.dataset.placeholder || option.placeholder || defaultPlaceholder;
      
        const templateTag = value => `<span class="${classTag}">${value}<span class="${classRemove}"></span></span>`;
      
        const getValue = () => el.value;
        const getValues = () => getValue().split(separator)
      
        // Create
        ; (function () {
          const className = classWrapper + ' ' + el.className.replace(classElement, '').trim();
          const tags = getValue().trim() === '' ? '' : getValues().map(templateTag).join('');
          const template = `<div class="${className}">${tags}<input type="text" class="${classInput}" placeholder="${placeholder}"></div>`;
          el.insertAdjacentHTML('afterend', template); // insert template after element
        })();
      
        const wrapper = el.nextElementSibling;
        const input = wrapper.getElementsByClassName(classInput)[0];
        const getTags = () => [...wrapper.getElementsByClassName(classTag)].map(tag => tag.textContent);
        const getTag = () => getTags().join(separator);
      
        const updateValue = () => { el.value = getTag(); el.dispatchEvent(new Event('change')); };
      
        // Focus to input
        wrapper.addEventListener('click', () => input.focus());
      
        // Toggle focus class
        input.addEventListener('focus', () => wrapper.classList.add('focus'));
        input.addEventListener('blur', () => wrapper.classList.remove('focus'));
      
        // Remove by click
        document.addEventListener('click', e => {
          if (e.target.closest('.' + classRemove)) {
            e.target.closest('.' + classRemove).parentNode.remove();
            updateValue();
          }
        });
      
        // Remove with backspace
        input.addEventListener('keydown', e => {
          if (input.value === '' && e.keyCode === 8 && wrapper.getElementsByClassName(classTag).length) {
            wrapper.querySelector('.' + classTag + ':last-of-type').remove();
            updateValue();
          }
        });
      
        // Adding tag
        input.addEventListener('input', () => {
          addTag();
          autowidth();
        });
        input.addEventListener('blur', () => {
          addTag(true);
          autowidth();
        });
        autowidth();
      
        function autowidth() {
          const fakeEl = document.createElement('div');
          fakeEl.classList.add(classInput, classInputHidden);
          const string = input.value || input.getAttribute('placeholder') || '';
          fakeEl.innerHTML = string.replace(/ /g, '&nbsp;');
          document.body.appendChild(fakeEl);
          input.style.setProperty('width', Math.ceil(window.getComputedStyle(fakeEl).width.replace('px', '')) + 1 + 'px');
          fakeEl.remove();
        }
        function addTag(force = false) {
          const value = transform(input.value.replace(new RegExp(escapeRegex(separator), 'g'), '').trim());
          if (value === '') { input.value = ''; }
          if (input.value.includes(separator) || (force && input.value != '')) {
            if (getTags().includes(value) && duplicate === 'false') {
              alertExist(value);
            } else {
              input.insertAdjacentHTML('beforebegin', templateTag(value));
              updateValue();
            }
            input.value = '';
            input.removeAttribute('style');
          }
        }
        function alertExist(value) {
          for (const el of wrapper.getElementsByClassName(classTag)) {
            if (el.textContent === value) {
              el.style.transform = 'scale(1.09)';
              setTimeout(() => { el.removeAttribute('style'); }, 150);
            }
          }
        }
        function updateTag() {
          if (getValue() !== getTag()) {
            [...wrapper.getElementsByClassName(classTag)].map(tag => tag.remove());
            getValue().trim() !== '' && input.insertAdjacentHTML('beforebegin', getValues().map(templateTag).join(''));
          }
        }
        function escapeRegex(value) {
          return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        }
        el.addEventListener('change', () => updateTag());
    }
    var TagView_1 = TagView;

    var tagViewCss = {style: `.tagin{display:none}.tagin-wrapper{border: 1px solid #ccc;display:flex;flex-wrap:wrap;height:auto;padding:calc(.375rem - 2px) calc(.75rem - 2px);position:relative;overflow:hidden;cursor:text}.tagin-wrapper.focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.tagin.is-valid+.tagin-wrapper,.was-validated .tagin:valid+.tagin-wrapper{border-color:#28a745}.tagin.is-invalid+.tagin-wrapper,.was-validated .tagin:invalid+.tagin-wrapper{border-color:#dc3545}.tagin-tag{border-radius:.25rem;color:#fff;border:0;padding:0 4px;display:inline-flex;align-items:center;height:24px;margin:2px;font-weight:300;background-color:#6c757d;transition:transform .1s}.tagin-tag-remove{margin-left:2px;width:18px;height:18px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-tag-remove:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-input{margin-left:2px;border-color:transparent;outline:0;border-width:1px 0;padding:0 2px 0 0;height:28px;color:#495057}.tagin-input:not(.tagin-input-hidden){width:4px;min-width:4px}.tagin-input-hidden{position:absolute;top:0;left:-9999px;overflow:hidden;visibility:hidden;white-space:nowrap`};

    class API {
        constructor(options) {
            this._servers = [
                'http://localhost/pe-gold3/', 
                'https://www.ucertify.com/', 
                'https://www.jigyaasa.info/',
                'http://172.10.195.203/pe-gold3/',
            ];
            this._REMOTE_API_URL = this._servers[1] + 'pe-api/1/index.php';
            this._client = {
                email: "pradeep.yadav@ucertify.com",
                password: "786pradeep",
                isSocial: "false",
                clientId: "040MA"
            };
        }

        validateApp (checkExpired) {
            return new Promise((resolve, reject) => {
                let isExpired = checkExpired ? `&action=refresh_token&refresh_token=1` : "";
                let isSocial = this._client.isSocial ? '&social_login=1' : "";
                let url = `${this._REMOTE_API_URL}?func=cat2.authenticate&device_id=${this._client.clientId}&email=${this._client.email}&password=${this._client.password + isSocial + isExpired}`;
                let request = new XMLHttpRequest();
                request.open('POST', url, true);
                request.onreadystatechange = (event) => {
                    if (request.readyState == 4 && request.status === 200) {
                        try {
                            let responseBody = request.responseText;
                            let responseObject = responseBody.match(/<jsonstring>(.*?)<\/jsonstring>/);
                            resolve(JSON.parse(responseObject[1]));
                        } catch (err) {
                            reject(err);
                        }
                    } 
                };
                request.onerror = (requestError) => {
                    reject(requestError);
                };
                if (checkExpired) {
                    request.setRequestHeader("old-access-token", globalThis.apiAccessToken);
                }
                request.send();
            });
        }
        
        getAPIDataJ (func, where, callback = function(){}) {
            let param = "";
            let _param2 = {};
            let str = '';
            let ajax_info = where.ajax_info ||{};
            where = this._assignPartial(where, {}, 'ajax_info', true);
            // if (typeof where.redis == 'undefined') {
            // 	_param2.redis = 0;
            // }
            //----------- code for acces_token based validation --------//
            _param2.device_id = this._client.clientId;
            //----------------------------------------------------------//
        
            if (typeof (where) == 'object') {
                for (let k in where) {
                    if (typeof where[k] != 'object') {
                        param += "&" + k + "=" + where[k];
                    }	
                }
            }
            if (typeof (func) !== "undefined" && func != "") {
                for (let k in _param2) {
                    if (typeof _param2[k] != 'object') {
                        str += "&" + k + "=" + _param2[k];
                    }	
                }
                str += "&func="+func;
            }
            
            this.getAPIDataJSON(this._REMOTE_API_URL + "?" + str + "&debug=0&"+param, param, ajax_info, (apidata)=> {
                if (apidata == 'Expired'){
                    this.getAPIDataJ(func, where, callback);
                } else {
                    callback(apidata);
                }
            }, func);
        }
        
        getAPIDataJSON (url, data, ajax_info, callback = function(){}, funcName) {
            let request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.onreadystatechange = (event) => {
                if (request.readyState == 4 && request.status === 200) {
                    let responseBody = request.responseText;
                    let responseData = {};
                    try {
                        let resStr = responseBody.match(/<jsonstring>(.*?)<\/jsonstring>/);
                        if (resStr[1] != '') {
                            let responseObject = JSON.parse(resStr[1]);
                            if (responseObject.error && ['Expired', '-9'].includes(responseObject.error.error_id)) {
                                console.log("Api Error = ", responseObject.error.error_id);
                                this.validateApp (responseObject.error.error_id != -9).then((validRes) => {
                                    if (validRes.status == 'Success') {
                                        this.setAccessKey(validRes);
                                        callback("Expired");
                                    }
                                }).catch((validateError)=> {
                                    //UI.storeError('Validate Error####no1:1####' + JSON.stringify(validateError || {}), true)
                                    console.log(validateError);
                                });
                                return;
                            } else {
                                if (responseObject['response']) {
                                    responseData = responseObject['response'];
                                    console.warn("Api data J reponse <-- Received -->", responseObject);
                                } else if(responseObject['response'] == undefined && responseObject.error == undefined) {
                                    responseData = responseObject;
                                    console.warn("Api data J reponse <-- Received II-->", responseData);
                                } else {
                                    responseData = undefined;
                                    console.warn({"Response_error":responseObject.error});
                                }
                            }
                        }
                    } catch (error) {
                        console.warn("Please check your Internet connection.");
                        console.log("Api data error = ", responseBody);
                        if (data.includes('must_reply_override')) {
                            responseData = undefined;
                        } else {
                            return (0);
                        }
                    }
                    callback(responseData);
                }
            };
            if (!data.includes('no_access_token_required')) {
                request.setRequestHeader("access-token", globalThis.apiAccessToken);
            }
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Access-Control-Allow-Origin", "*");
            request.setRequestHeader("Access-Control-Allow-Headers", "*");
            request.send();
        }

        _assignPartial(iObj, oObj = {}, str, unsetOnly = false ) {
            str = str.split(',');
            if ( !unsetOnly ) {
              for ( let i in str ) {
                let index = str[i];
                if ( typeof iObj[index] != 'undefined') {
                  oObj[index] = iObj[index];
                }
              }
            }
            else {
              for ( let i in iObj ) {
                let index = str.indexOf( i ); 
                if ( index === -1) {
                  oObj[i] = iObj[i];
                }
              }
            }
            return oObj;
        }
        
        setAccessKey (api) {
            if (api.access_token && api.access_token.length > 50) {
                globalThis.apiAccessToken = api.access_token;
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem('apiAccessToken', api.access_token);
                }
            }
        }
    }
    class JStore {
        constructor(options={}) {
            this._options = options;
            this._allowed = false;
            /**
             * session : true to enable sessionStorage
             * locastorage : by default true
             * onStore : to listen store changes
             */
            this._init();
        }

        _init() {
            if (typeof(Storage) !== "undefined") {
                this._allowed = true;
                // Code for localStorage/sessionStorage.
                window.onstorage = (e)=> {
                    if (this._options.onStore) this._options.onStore(e); 
                };
            } else {
                this._allowed = false;
                console.warn("Sorry! No Web Storage support..");
            }
        }

        //When passed a number n, this method will return the name of the nth key in the storage.
        key(n) {
            if (this._allowed) {
                return this._options.session ? console.warn("Session has not key method.") : window.localStorage.key(n)
            }
        }

        //When passed a key name, will return that key's value.
        get(name) {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.getItem(name) : window.localStorage.getItem(name);
            }
        }

        //When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
        set(name, value) {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.setItem(name, value) : window.localStorage.setItem(name, value);
            }
        }

        //When passed a key name, will remove that key from the storage.
        remove(name) {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.removeItem(name) : window.localStorage.removeItem(name);
            }
        }

        //clear all stored
        clearAll() {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.clear() : window.localStorage.clear();
            }
        }
    }
    class JUI extends API{
        constructor(options) {
            super();
            this.trackInf = {};
            this.buffer = {};
            this.bsCat1 = ['Modal', 'Tooltip', 'Collapse', 'Popover', 'ScrollSpy', 'Tab', 'Alert'];
            this.extraSelectors = ['hidden', 'visible', 'selected', 'checked', 'enabled'];
            this.parseHtml = this.templateHtml.bind(this);
            this.isSSDloaded = "";
            this.loadSSD();
        }

        loadSSD() {
            if (typeof globalThis == 'object') {
                globalThis.eventTracker = globalThis.eventTracker || {};
                globalThis.JUITemp = globalThis.JUITemp || {};
            } else {
                this.isSSDloaded = setInterval(()=> {
                    if (typeof globalThis == 'object') {
                        globalThis.eventTracker = globalThis.eventTracker || {};
                        globalThis.JUITemp = globalThis.JUITemp || {};
                        clearInterval(this.isSSDloaded);
                    }
                }, 500);
            }   
        }

        validate(isExpired) {
            return new Promise((resolve, reject) => {
                this.validateApp(isExpired).then((tokenApi) => {
                    if (tokenApi.status != 'Success') {
                        reject(tokenApi);
                    } else {
                        try {
                            this.setAccessKey(tokenApi);
                            resolve(tokenApi);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }

        param2Url(params) {
            let url = [];
            for (var i in params) {
                var uri = i + '=' + params[i];
                url.push(uri);
            }
            return url.join('&');
        }

        // Provide unique in array
        unique(myArray) {
            return myArray.filter((v, i, a) => a.indexOf(v) === i);
        }

        // handle json parse
        parseJSON(obj, showErr_data) {
            let showErr = showErr_data || false;
            try {
                return JSON.parse(obj);
            } catch (e) {
                if (showErr) {
                    console.warn(e);
                }
                return {}; //Return blank object
            }
        }

        parseDom(str) {
            let parser = new DOMParser();
            let html = parser.parseFromString(str, 'text/html');
            return html;
        }

        // Add script data or url into page
        addScript(data, url, options={}) {
            let sc = document.createElement("script");
            if (url) {
                sc.src = url;
                sc.async = true;
                if (options.callback) {
                    sc.onload = function() { 
                        options.callback();
                    };
                }
            } else {
                sc.innerHTML = data;
            }
            let selector = options.target ? document.body : document.head;
            selector.append(sc);
            return sc;
        }

        // used to genrate css links
        createLink(path, options={}) {
            let link = document.createElement('link');
            let selector = options.target ? document.body : document.head;
            link.href = path;
            if  (options.preload) {
                link.rel = "preload";
                link.onload = function() {
                    this.rel= options.type || "stylesheet";
                };
                link.as = options.as || "style";
                link.crossorigin = "anonymous";
            } else {
                link.rel = "stylesheet";
            }
            selector.append(link);
            return link;
        }

        // To enable Tag view on selected inputs
        // before use this call addTagViewCss once only
        enableTagView(options) {
            let selected = document.querySelectorAll('.tagin');
            for (const el of selected) {
                options ? TagView_1(el, options) : TagView_1(el);
            }
            return selected;
        }

        // Add css for tagsview inout
        addTagViewCss() {
            this.insert(document.head, `<style>${tagViewCss.style}</style>`, 'beforeend');
        }

        //check target selector is present in base selector/dom
        hasInall(selector, target) {
            let current = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            let result = [];
            if (current) {
                current.forEach((item)=> {
                    if (item.contains(target)) {
                        result.push(item);
                    }
                });
            }
            return result;
        }

        // removeAttr of jq like
        removeDomAttr(selector, attrArray) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (current) {
                attrArray.forEach((attr)=> {
                    current.removeAttribute(attr);
                });
            }

            return current || {};
        }

        // trigger events
        trigger(selector, evName, options) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (current) {
                options ? current.dispatchEvent(new Event(evName, options)) : current.dispatchEvent(new Event(evName));
            } else {
                console.warn("Selector not found.", selector);
            }
        }

        // Find in childrent of selected node
        findChild(selector, search, action) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let list = current.children || [];
            let found = [];
            if (search && list.length > 0) {
                let index = 0;
                while (list[index]) {
                    if (list[index].matches(search)) {
                        if (action) {
                            found.push(list[index]);
                        } else {
                            found = list[index];
                            break;
                        }
                    }
                    index++;
                }
                return found;
            } else {
                return list;
            }
        }

        closest(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let elm = current ? current.parentElement : null;
            let result = [];
            if (search) {
                while (elm) {
                    if (this.find(elm, search)) {
                        result = this.find(elm, search);
                        break;
                    }
                    elm = elm.parentElement;
                }
            }
            return result;
        }

        parent(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let elm = current ? current.parentElement : null;
            if (search) {
                while(elm) {
                    if (elm.matches(search)) {
                        break;
                    }
                    elm = elm.parentElement;
                }
            }

            return elm;
        }

        // find in sibiling or return imediate
        siblings(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let result = [];
            if (current) {
                var node = current.parentNode.firstChild;

                while ( node ) {
                    if ( node !== current && node.nodeType === Node.ELEMENT_NODE ) {
                        if (search) {
                                node.matches(search) ? result.push( node ) : "";
                        } else {
                            result.push( node );
                        }
                    }
                    node = node.nextElementSibling || node.nextSibling;
                }
            } 
            return result;
        }

        // find in next element or return all
        nextAll(selector) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let nextSibling = current.nextElementSibling;
            let result = [];
            if (nextSibling) {
                while(nextSibling) {
                    nextSibling = nextSibling.nextElementSibling;
                    result.push(nextSibling);
                }
            }

            return result;
        }

        // find in next 
        nextElm(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let nextSibling = current.nextElementSibling;
            if (search) {
                while(nextSibling) {
                    if (nextSibling.matches(search)) {
                        break;
                    }
                    nextSibling = nextSibling.nextElementSibling;
                }
            }

            return nextSibling;
        }

        // find in previous element
        prevElm(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let previousSibling = current.previousElementSibling;
            if (search) {
                while(previousSibling) {
                    if (previousSibling.matches(search)) {
                        break;
                    }
                    previousSibling = previousSibling.previousElementSibling;
                }
            }

            return previousSibling;
        }

        // add dom loaded event
        onReady(func) {
            document.addEventListener('DOMContentLoaded', function(event) {
                func.call(event);
            });
        }

        // Create element from html string
        create(tagName, html) {
            let elem = document.createElement(tagName);
            if (html) {
                elem.innerHTML = html;
            }
            return elem;
            
        }

        clone(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return selected.cloneNode(true);
            }
            return null;
        }

        // Setrialize form nodes
        serialize(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return new URLSearchParams(new FormData(selected)).toString();
            }
            return null;
        }

        // Empty dom I.e $.empty()
        empty(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                while(selected.firstChild) selected.removeChild(selected.firstChild);
            }
            return selected;
        }

        // Get bootstrap5 instance accoridng to compoenent
        getBS(target, comp, options) {
            let selected = (typeof target == "object") ? target : document.querySelector(target);
            if (selected && this.bsCat1.includes(comp)) {
                let isIns = bootstrap[comp].getInstance(selected);
                if (isIns) {
                    return bootstrap[comp].getInstance(selected);
                } else {
                    let ref = new bootstrap[comp](selected, options);
                    return ref;
                }
            } else {
                return {};
            }
        }

        // Enable all mathced node's bootstrap5 compoenent
        enableBsAll(selector, comp, options) {
            if (this.bsCat1.includes(comp)) {
                let triggerList = [].slice.call(document.querySelectorAll(selector));
                let fireList = triggerList.map(function (triggerElm) {
                    if (options) {
                        return new bootstrap[comp](triggerElm, options);
                    } else {
                        return new bootstrap[comp](triggerElm)
                    }
                });
                return fireList;
            } else {
                console.error("Bootstrap can't enable for this component name");
                return [];
            }
        }

        // Hide enabled bootstrap5 compoenents
        hideBsAll(selector, comp) {
            let fireList = [].slice.call(document.querySelectorAll(selector));
            if (this.bsCat1.includes(comp)) {
                fireList.forEach(function (elm) {
                    let ref = bootstrap[comp].getInstance(elm);
                    ref?.hide?.();
                });
            } else {
                console.error("Bootstrap can't disable for this component name");
            }
        }

        // Js based ajax i.e $.ajax
        ajax(sendData) {
            let longData = "";
            if (typeof (sendData.data) == 'object') {
                if (sendData.formData) {
                    longData = sendData.data;
                } else if (sendData.withUrl) {
                    let param = "?";
                    for (let k in sendData.data) {
                        if (typeof sendData.data[k] != 'object') {
                            param += "&" + k + "=" + sendData.data[k];
                        }	
                    }
                    sendData.url += param;
                } else {
                    longData = new FormData();
                    for (let prop in sendData.data) {
                        if (typeof sendData.data[prop] == 'object' && this.isValid(sendData.data[prop])) {
                            longData = this.jsonFormEncode(longData, prop, sendData.data[prop]);
                        } else {
                            longData.append(prop, sendData.data[prop]);
                        }	
                    }
                }
            }
            return new Promise((resolve, reject)=> {
                const request = new XMLHttpRequest();
                request.open(sendData.type || 'POST', sendData.url, true);
                if (sendData.responseType) {
                    request.responseType = sendData.responseType;
                }
                request.onreadystatechange = (event) => {
                    if (request.readyState == 4 && request.status === 200) {
                        try {
                            resolve(request.responseText, event);
                        } catch (err) {
                            reject(err);
                        }
                    } 
                };
                request.onerror = (requestError) => {
                    reject(requestError);
                };
                if (sendData.onStart) request.onloadstart = sendData.onStart;
                if (sendData.onEnd) request.onloadend = sendData.onEnd;
                request.send(longData);
            });
        }

        jsonFormEncode(formData, prop, jsonArray) {
            try {
                for (let i = 0; i < jsonArray.length; i++) {
                    for (let key in jsonArray[i]) {
                      formData.append(`${prop}[${i}][${key}]`, jsonArray[i][key]);
                    }
                }
            } catch(error) {
                console.warn("Please provide valid JSON Object in ajax data.");
            }

            return formData;
        }

        // get script from url
        getJSON(url) {
            var scr = document.createElement('script');
            scr.src = url;
            document.body.appendChild(scr);
        }

        // $.offset alternative
        offset(container) {
            let rect = (typeof container == "object") ? container : document.querySelector(container);
            let offset = {rect};
            if (rect) {
                let clientRect = rect.getBoundingClientRect();
                offset = { 
                    target: rect,
                    clientRect,
                    top: clientRect.top + window.scrollY, 
                    left: clientRect.left + window.scrollX, 
                };
            }
            
            return offset;
        }

        // find in array
        findInArray(value, baseArray) {
            if (value && baseArray) {
                return baseArray.find((item)=> item == value );
            }

            return false;
        }

        // comapre two array
        inArray(baseArray, compareArray) {
            let matched = [];
            if (baseArray && compareArray) {
                baseArray.forEach((item)=> {
                    compareArray.forEach((comp)=> {
                        if (item == comp) {
                            matched.includes(comp) ? "" : matched.push(comp);
                        }
                    });
                });
            }

            return matched.length > 0 ? matched.length : -1;
        }

        // Find target node into base node and some extra selectors
        find(baseSelector, target, data ) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let typeAction = (typeof data == "object") ? "action" : data;
            if (base) {
                switch (typeAction) {
                    case 'all' : return base.querySelectorAll(target);
                    case 'child' : return base.querySelector(target).childNodes;
                    case 'hidden': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.offsetWidth == 0 && elm.offsetHeight == 0);
                    case 'visible': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.offsetWidth > 0 && elm.offsetHeight > 0);
                    case 'checked': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.checked);
                    case 'selected': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.selected);
                    case 'action': {
                        let found = base.querySelectorAll(target);
                        if (found && found.length > 0 && data.action) {
                            found.forEach((_elm)=> this.jsAction(_elm, {action: data.action, actionData: data.actionData}));
                        }
                        return found;
                    }
                    default: return base.querySelector(target);  
                }
            }
            return [];
        }

        // Select all using query selectors and perform action both
        selectAll(selector, action, actionData) {
            let selected = this.isExtraSelectors(action, actionData) ?  this.selectAction(selector, action) : (typeof selector == 'object' ? selector : document.querySelectorAll(selector));
            if (selected && selected.length > 0 && action) {
                selected.forEach((elm)=> this.jsAction(elm, {action, actionData}));
            }
            return selected;
        }

        isExtraSelectors(action, actionData) {
            if (this.extraSelectors.includes(action)) {
                return (action == "checked" && typeof actionData != 'undefined') ? false : true;
            }
            return false;
        }

        // Select and enhance selector like jquery
        select(selector, action, actionData) {
            if (this.isExtraSelectors(action, actionData)) {
                return this.selectAction(selector, action);
            } else {
                selector = (typeof selector == 'object') ? selector : document.querySelector(selector);
                if (selector) {
                    this.jsAction(selector, {action, actionData});
                }
                return  selector || {};
            }
        }

        getElm(selector, type) {
            return document.getElementById(selector) || {};
        }

        // Listen all node with events
        listenAll(target, eventName, func) {
            let selected = (typeof target == "object") ? target : document.querySelectorAll(target);
            if (selected && selected.length > 0) {
                for (let i = 0; i < selected.length; i++) {
                    selected[i].addEventListener(eventName, func, false);
                }
            }
        }

        // bind event directly on nodes
        bind(selector, eventName, handler) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                selected.addEventListener(eventName, handler);
            }
        }

        // Listen target with in base node listner
        listen(baseSelector, eventName, selector, handler) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            if (!base) return false;
            if (globalThis.eventTracker[selector]) {
                base.removeEventListener(eventName, globalThis.eventTracker[selector]);
            }
            globalThis.eventTracker[selector] = this.onListen.bind(this, selector, handler, base);
            base.addEventListener(eventName, globalThis.eventTracker[selector]);
        }

        // remove node classes
        removeClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> this.jsAction(elm, {action: 'removeClass', actionData: name}) );
            }
            return selected || {};
        }
        // add class for node
        addClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> this.jsAction(elm, {action: 'addClass', actionData: name}) );
            }
            return selected || {};
        }

        // dom visibility handle
        toggleDom(dom, action="toggleDisplay") {
            let selected =  typeof dom == "object" ? dom : document.querySelectorAll(dom);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> this.jsAction(elm, {action}));
            }
            return selected || {};
        }

        // alterntive of $.select2
        select2(selecor) {
            let found = document.querySelector(`${selecor} + span > .selection > span`);
            if (found) {
                found.click();
            }
        }

        // Set dataset on element
        setData(selector, attrs) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in attrs) {
                    selected.dataset[property] = attrs[property];
                }
            }
            return selected || {};
        }

        // manage attr using object
        setAttr(selector, attrs) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in attrs) {
                    selected.setAttribute(property, attrs[property]);
                }
            }
            return selected || {};
        }

        // add css using object
        setCss(selector, cssList) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in cssList) {
                    selected.style && (selected.style[property] = cssList[property]);
                }
            }
            return selected || {};
        }

        //alternative of $.remove
        remove(dom) {
            let selected =  document.querySelectorAll(dom);
            if (selected.length > 0) {
                selected.forEach((elm)=> elm.remove());
            }
        }

        // alternive of $.replaceWith
        replaceWith(selector, domStr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                let createdNode = this.templateHtml(domStr);
                selected.replaceWith(createdNode);
                return createdNode;
            }
            return selected;

        }

        wrap(selector, domStr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                let createdNode = this.templateHtml(domStr);
                let innerNode = this.innerChild(createdNode);
                innerNode.innerHTML = selected.outerHTML;
                selected.parentNode.replaceChild(createdNode, selected);
                return innerNode.firstChild;
            }
            return selected;
        }

        unwrap(selector) {
            let nodeToRemove = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (nodeToRemove && nodeToRemove.length > 0) {
                nodeToRemove.forEach((item)=> {
                    item.outerHTML = item.innerHTML;
                });
            }
        }

        insertAfter(newNode, existingNode) {
            newNode = (typeof newNode == "object") ? newNode : document.querySelector(newNode);
            existingNode = (typeof existingNode == "object") ? existingNode : document.querySelector(existingNode);
            if (newNode && existingNode) {
                existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
            }

            return newNode;
        }

        // Insert using html string, need to provide position also
        insert(selector, domStr, position) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                switch (position) {
                    case 'beforebegin': selected.insertAdjacentHTML('beforebegin', domStr);
                    break;
                    case 'afterbegin': selected.insertAdjacentHTML('afterbegin', domStr);
                    break;
                    case 'beforeend': selected.insertAdjacentHTML('beforeend', domStr);
                    break;
                    case 'afterend': selected.insertAdjacentHTML('afterend', domStr);
                    break;
                }
            }
            return selected || {};
        }

        // provide dom index like $.index
        domIndex(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return Array.from( selected.parentNode.children ).indexOf( selected );
            } else {
                retunr -1;
            }
        }

        // compare selector in base node
        match(baseSelector, mathStr) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let matched = [];
            if (base && base.length > 0 ) {
                base.forEach((elm)=> {
                    if (elm.matches(mathStr)) matched.push(elm);
                });
            } else {
                return base && base.matches(mathStr);
            }
            return matched;
        }

        // check selector in base node
        contains(selector, text) {
            var elements = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                return [].filter.call(elements, function(element) {
                    return RegExp(text).test(element.textContent);
                    });
            } else {
                return [];
            }
        }

        // merge two object like $.extend
        extend() {
            //This function are alternative of $.extend which merge content of objects into first one
            // To create deep copy pass true as first argument
            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;
        
            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }
        
            // Merge the object into the extended object
            var merge = function (obj) {
                for ( var prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };
        
            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }
        
            return extended;
        
        }

        // return querystring as object
        url (url) {
            url = url || (typeof window == 'object' ? window.location.href : "");
            return new URLSearchParams(url);
        }

        updateEditorUrl(data) {
            let newUrl = `?action=new&content_subtype=${data.subtype}&content_type=${data.type}&content_icon=${data.content_icon}&react_content=1`;
            window.history.replaceState(null, '', newUrl);
        }

        getUrlVars() {
            let vars = [], hash;
            let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        setApiKey(token) {
            globalThis.apiAccessToken = token;
        }

        validateAjaxData(ajaxData, subtype) {
            if (subtype == 0 || subtype == 8) {
                if (ajaxData && !this.get('is_proposed')) {
                    if (ajaxData.content_text) {
                        try {
                            ajaxData.content_text.answers.forEach((item,index)=> {
                                ajaxData.content_text.answers[index].answer =  item.answer.replace(/\n/g, "");
                            });
                        } catch(e) {
                            console.log(e);
                            let tempAjaxData = {
                                answers: [
                                    {
                                        is_correct: "0",
                                        answer: "Option A.",
                                        id: "01"
                                    },
                                    {
                                        is_correct: "0",
                                        answer: "Option B.",
                                        id: "02"
                                    },
                                    {
                                        is_correct: "0",
                                        answer: "Option C.",
                                        id: "03"
                                    },
                                    {
                                        is_correct: "0",
                                        answer: "Option D.",
                                        id: "04"
                                    },
                                ],
                                correct_ans_str: "D",
                                total_answers: 4,
                                correct_answers: 1
                            };
                            return tempAjaxData;
                        }
                        //console.log(ajaxData.content_text.answers);
                        return ajaxData.content_text;
                    }
                    return ajaxData;
                } else {
                    let tempAjaxData = {
                        answers: [
                            {
                                is_correct: "0",
                                answer: "Option A.",
                                id: "01"
                            },
                            {
                                is_correct: "0",
                                answer: "Option B.",
                                id: "02"
                            },
                            {
                                is_correct: "0",
                                answer: "Option C.",
                                id: "03"
                            },
                            {
                                is_correct: "0",
                                answer: "Option D.",
                                id: "04"
                            },
                        ],
                        correct_ans_str: "D",
                        total_answers: 4,
                        correct_answers: 1
                    };
                    return tempAjaxData;
                }
            }
            return ajaxData;
            
        }
        
        // watch if dom changes
        watchDom(target, func, options={childList: true}) {
            let observer = new MutationObserver(function (mutationRecords) {
                    //if (mutationRecords[0].addedNodes[0].nodeName === "SPAN")
                    func && func(mutationRecords);
                });
            observer.observe(target, options);
            return observer;
        }

        // revert if enity blocked by html
        ignoreEnity(html) {
            return html.replace(/&amp;/g,'&');
        }

        // cahce funciton to avoid repated outputs
        cache(func) {
            var chacheData = new Map();
            return function(input) {
                if(chacheData.has(input)) {
                    return chacheData.get(input);
                }

                var newResult = func(input);
                chacheData.set(input,newResult);

                return newResult;
            }
        }

        // store data
        set(key, value) {
            if (typeof globalThis == 'object') globalThis.JUITemp[key] = value;
        }

        // get data from store
        get(key) {
            return globalThis.JUITemp[key];
        }

        // find caller
        caller() {
            console.log("called from " + arguments.callee.caller.toString());
        }

        // show warnign messages
        showmsg(msg, time = 10000) {
            let errorAlert = document.querySelector("#showMsgAlert");
            if (this.buffer['showmsg']) clearTimeout(this.buffer['showmsg']);
            if (errorAlert) {
                errorAlert.classList.add('show');
                this.select("#showMsgBody").innerHTML = msg;
            } else {
                this.insert(document.body, this.getModalHtml(msg, 'Alert'), 'beforeend');
            }
            setTimeout(()=> {
                let alterRef= this.getBS(document.querySelector("#showMsgAlert"), 'Alert');
                alterRef.close && alterRef.close();
            }, time);
        }

        alert(msgData) {
            if (document.getElementById('showBSModal')) {
                this.getBS("#showBSModal", 'Modal').show();
                this.select("#showBSBody").innerHTML = msgData|| "No msg provided...";
            } else {
                this.insert(document.body, this.getModalHtml(msgData, 'showBSModal'), 'beforeend');
                this.getBS("#showBSModal", 'Modal').show();
            }
        }

        getModalHtml(data, type) {
            switch(type) {
                case 'Alert' : 
                    return (`
                    <div id="showMsgAlert" class="alert alert-warning alert-dismissible text-center fade show" role="alert" style="z-index:9999;min-height:50px;position:fixed;width:100%;">
                        <span id="showMsgBody">${data}</span>
                        <button type="button" class="btn-close" style="margin-top: -3px;" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `)
                case 'showBSModal':
                  return(`
                    <div class="modal fade" id="showBSModal" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" id="showBSDialog">
                            <div class="modal-content">
                                <div class="modal-body text-center fs-5 pt-4" id="showBSBody">
                                    ${data}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn bg-light m-auto text-dark" data-bs-dismiss="modal">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>`
                    );
            }

        }

        // check data validity
        isValid(data, filter = false) {
            if (data && data != undefined && data != "" && data != "undefined" && data != null) {
                return true;
            } else {
                if (filter && data != filter) return true;
                return false;
            }
        }

        // store algo
        store(target,data) {
        }

        // convert query from objects
        query(data) {
            var inf = 'item_error_log=1';
                if (typeof (data) == 'object') {
                    for (let key in data) {
                    if (typeof data[key] != 'object') {
                        inf += "&" + key + "=" + data[key];
                    }	
                }
            }
            return inf;
        }
        
        // show activator
        activate(loader) {
            document.querySelector('#activateLoaderContainer') && document.querySelector('#activateLoaderContainer').remove(); 
            if (loader > 0) {
                this.insert(document.body, `<div id="activateLoaderContainer" class="activateOverlay" style="z-index:9999999;"><center><div class="activator" style="height:100px; width: 100px;"></div></center></div>`, 'afterend');
            }
        }
        
        // listner callback
        onListen(selector, handler, base, event) {
            let target = event.target; //|| event.relatedTarget || event.toElement;
            let closest = target.closest && target.closest(selector);
            if (closest && base.contains(closest)) {
                // passes the event to the handler and sets `this`
                // in the handler as the closest parent matching the
                // selector from the target element of the event
                handler.call(this, closest, event);
            }
        }

        isFocus(target) {
            let selected = typeof target == 'object' ? target : document.querySelector(target);
            if (selected == document.activeElement) {
                return true;
            }
            return false;
        }
        
        // find inner child in dom
        innerChild(node) {
            let currentNode = (typeof node == "object") ? node : document.querySelector(node);
            let result = currentNode;
            if (currentNode && currentNode.lastChild) {
                currentNode = currentNode.lastChild;
                while ( currentNode ) {
                    result = currentNode;
                    currentNode = currentNode.lastChild;
                }
            }
            
            return result;
        }
        
        // parse html into template and reurn nodes
        templateHtml(html) {
            let t = document.createElement('template');
            t.innerHTML = html;
            return t.content.firstElementChild.cloneNode(true);
        }
        
        // action of selector
        selectAction(selector, type) {
            switch (type) {
                case 'hidden': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.offsetWidth == 0 && elm.offsetHeight == 0);
                case 'visible': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.offsetWidth > 0 && elm.offsetHeight > 0);
                case 'selected': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.selected);
                case 'checked': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.checked);
                case 'enabled': return document.querySelectorAll(selector + ':not([disabled]');
                default: return document.querySelector(selector);  
            }
        }
        
        // handle inline actions of js
        jsAction(selected, data) {
            switch(data.action) {
                case 'show': selected.style.display = data.actionData || "";
                break;
                case 'hide': selected.style.display = "none";
                break;
                case 'toggleDisplay': selected.style.display = (selected.style.display == "none") ? "block" : "none";
                break;
                case 'addClass': typeof data.actionData == "object" ? selected.classList.add(...data.actionData) : selected.classList.add(data.actionData);
                break;
                case 'removeClass': typeof data.actionData == "object" ? selected.classList.remove(...data.actionData) : selected.classList.remove(data.actionData);
                break;
                case 'toggleClass': selected.classList.toggle(data.actionData);
                break;
                case 'html' : selected.innerHTML = data.actionData;
                break;
                case 'value': selected.value = data.actionData;
                break;
                case 'text': selected.textContent = data.actionData;
                break;
                case 'checked':  selected.checked = data.actionData;
                break;
                case 'remove': selected.remove();
                break;
                case 'removeAttr': selected.removeAttribute(data.actionData);
                break;
                case 'css' : this.setCss(selected, data.actionData);
                break;
                case 'attr': this.setAttr(selected, data.actionData);
                break;
                case 'data': this.setData(selected, data.actionData);
            }
        }
    } 

    const JS = new JUI();

    /*
     Copyright 2011-2013 Abdulla Abdurakhmanov
     Original sources are available at https://code.google.com/p/x2js/

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
     */

    var xml2json = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
         {
             module.exports = factory();
         }
     }(commonjsGlobal, function () {
    	return function (config) {
    			
    		var VERSION = "1.2.0";
    		
    		config = config || {};
    		initConfigDefaults();
    		
    		function initConfigDefaults() {
    			if(config.escapeMode === undefined) {
    				config.escapeMode = true;
    			}
    			
    			config.attributePrefix = config.attributePrefix || "_";
    			config.arrayAccessForm = config.arrayAccessForm || "none";
    			config.emptyNodeForm = config.emptyNodeForm || "text";		
    			
    			if(config.enableToStringFunc === undefined) {
    				config.enableToStringFunc = true; 
    			}
    			config.arrayAccessFormPaths = config.arrayAccessFormPaths || []; 
    			if(config.skipEmptyTextNodesForObj === undefined) {
    				config.skipEmptyTextNodesForObj = true;
    			}
    			if(config.stripWhitespaces === undefined) {
    				config.stripWhitespaces = true;
    			}
    			config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
    	
    			if(config.useDoubleQuotes === undefined) {
    				config.useDoubleQuotes = false;
    			}
    			
    			config.xmlElementsFilter = config.xmlElementsFilter || [];
    			config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];
    			
    			if(config.keepCData === undefined) {
    				config.keepCData = false;
    			}
    		}
    	
    		var DOMNodeTypes = {
    			ELEMENT_NODE 	   : 1,
    			TEXT_NODE    	   : 3,
    			CDATA_SECTION_NODE : 4,
    			COMMENT_NODE	   : 8,
    			DOCUMENT_NODE 	   : 9
    		};
    		
    		function getNodeLocalName( node ) {
    			var nodeLocalName = node.localName;			
    			if(nodeLocalName == null) // Yeah, this is IE!! 
    				nodeLocalName = node.baseName;
    			if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
    				nodeLocalName = node.nodeName;
    			return nodeLocalName;
    		}
    		
    		function getNodePrefix(node) {
    			return node.prefix;
    		}
    			
    		function escapeXmlChars(str) {
    			if(typeof(str) == "string")
    				return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    			else
    				return str;
    		}
    		
    		function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
    			var idx = 0;
    			for(; idx < stdFiltersArrayForm.length; idx++) {
    				var filterPath = stdFiltersArrayForm[idx];
    				if( typeof filterPath === "string" ) {
    					if(filterPath == path)
    						break;
    				}
    				else
    				if( filterPath instanceof RegExp) {
    					if(filterPath.test(path))
    						break;
    				}				
    				else
    				if( typeof filterPath === "function") {
    					if(filterPath(obj, name, path))
    						break;
    				}
    			}
    			return idx!=stdFiltersArrayForm.length;
    		}
    		
    		function toArrayAccessForm(obj, childName, path) {
    			switch(config.arrayAccessForm) {
    				case "property":
    					if(!(obj[childName] instanceof Array))
    						obj[childName+"_asArray"] = [obj[childName]];
    					else
    						obj[childName+"_asArray"] = obj[childName];
    					break;
    				/*case "none":
    					break;*/
    			}
    			
    			if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
    				if(checkInStdFiltersArrayForm(config.arrayAccessFormPaths, obj, childName, path)) {
    					obj[childName] = [obj[childName]];
    				}			
    			}
    		}
    		
    		function fromXmlDateTime(prop) {
    			// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
    			// Improved to support full spec and optional parts
    			var bits = prop.split(/[-T:+Z]/g);
    			
    			var d = new Date(bits[0], bits[1]-1, bits[2]);			
    			var secondBits = bits[5].split("\.");
    			d.setHours(bits[3], bits[4], secondBits[0]);
    			if(secondBits.length>1)
    				d.setMilliseconds(secondBits[1]);
    	
    			// Get supplied time zone offset in minutes
    			if(bits[6] && bits[7]) {
    				var offsetMinutes = bits[6] * 60 + Number(bits[7]);
    				var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';
    	
    				// Apply the sign
    				offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);
    	
    				// Apply offset and local timezone
    				d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
    			}
    			else
    				if(prop.indexOf("Z", prop.length - 1) !== -1) {
    					d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));					
    				}
    	
    			// d is now a local time equivalent to the supplied time
    			return d;
    		}
    		
    		function checkFromXmlDateTimePaths(value, childName, fullPath) {
    			if(config.datetimeAccessFormPaths.length > 0) {
    				var path = fullPath.split("\.#")[0];
    				if(checkInStdFiltersArrayForm(config.datetimeAccessFormPaths, value, childName, path)) {
    					return fromXmlDateTime(value);
    				}
    				else
    					return value;			
    			}
    			else
    				return value;
    		}
    		
    		function checkXmlElementsFilter(obj, childType, childName, childPath) {
    			if( childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
    				return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);	
    			}
    			else
    				return true;
    		}	
    	
    		function parseDOMChildren( node, path ) {
    			if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
    				var result = new Object;
    				var nodeChildren = node.childNodes;
    				// Alternative for firstElementChild which is not supported in some environments
    				for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    					var child = nodeChildren.item(cidx);
    					if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
    						var childName = getNodeLocalName(child);
    						result[childName] = parseDOMChildren(child, childName);
    					}
    				}
    				return result;
    			}
    			else
    			if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
    				var result = new Object;
    				result.__cnt=0;
    				
    				var nodeChildren = node.childNodes;
    				
    				// Children nodes
    				for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    					var child = nodeChildren.item(cidx); // nodeChildren[cidx];
    					var childName = getNodeLocalName(child);
    					
    					if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
    						var childPath = path+"."+childName;
    						if (checkXmlElementsFilter(result,child.nodeType,childName,childPath)) {
    							result.__cnt++;
    							if(result[childName] == null) {
    								result[childName] = parseDOMChildren(child, childPath);
    								toArrayAccessForm(result, childName, childPath);					
    							}
    							else {
    								if(result[childName] != null) {
    									if( !(result[childName] instanceof Array)) {
    										result[childName] = [result[childName]];
    										toArrayAccessForm(result, childName, childPath);
    									}
    								}
    								(result[childName])[result[childName].length] = parseDOMChildren(child, childPath);
    							}
    						}
    					}								
    				}
    				
    				// Attributes
    				for(var aidx=0; aidx <node.attributes.length; aidx++) {
    					var attr = node.attributes.item(aidx); // [aidx];
    					result.__cnt++;
    					result[config.attributePrefix+attr.name]=attr.value;
    				}
    				
    				// Node namespace prefix
    				var nodePrefix = getNodePrefix(node);
    				if(nodePrefix!=null && nodePrefix!="") {
    					result.__cnt++;
    					result.__prefix=nodePrefix;
    				}
    				
    				if(result["#text"]!=null) {				
    					result.__text = result["#text"];
    					if(result.__text instanceof Array) {
    						result.__text = result.__text.join("\n");
    					}
    					//if(config.escapeMode)
    					//	result.__text = unescapeXmlChars(result.__text);
    					if(config.stripWhitespaces)
    						result.__text = result.__text.trim();
    					delete result["#text"];
    					if(config.arrayAccessForm=="property")
    						delete result["#text_asArray"];
    					result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
    				}
    				if(result["#cdata-section"]!=null) {
    					result.__cdata = result["#cdata-section"];
    					delete result["#cdata-section"];
    					if(config.arrayAccessForm=="property")
    						delete result["#cdata-section_asArray"];
    				}
    				
    				if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
    					result = '';
    				}
    				else
    				if( result.__cnt == 1 && result.__text!=null  ) {
    					result = result.__text;
    				}
    				else
    				if( result.__cnt == 1 && result.__cdata!=null && !config.keepCData  ) {
    					result = result.__cdata;
    				}			
    				else			
    				if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
    					if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
    						delete result.__text;
    					}
    				}
    				delete result.__cnt;			
    				
    				if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
    					result.toString = function() {
    						return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
    					};
    				}
    				
    				return result;
    			}
    			else
    			if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
    				return node.nodeValue;
    			}	
    		}
    		
    		function startTag(jsonObj, element, attrList, closed) {
    			var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
    			if(attrList!=null) {
    				for(var aidx = 0; aidx < attrList.length; aidx++) {
    					var attrName = attrList[aidx];
    					var attrVal = jsonObj[attrName];
    					if(config.escapeMode)
    						attrVal=escapeXmlChars(attrVal);
    					resultStr+=" "+attrName.substr(config.attributePrefix.length)+"=";
    					if(config.useDoubleQuotes)
    						resultStr+='"'+attrVal+'"';
    					else
    						resultStr+="'"+attrVal+"'";
    				}
    			}
    			if(!closed)
    				resultStr+=">";
    			else
    				resultStr+="/>";
    			return resultStr;
    		}
    		
    		function endTag(jsonObj,elementName) {
    			return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
    		}
    		
    		function endsWith(str, suffix) {
    			return str.indexOf(suffix, str.length - suffix.length) !== -1;
    		}
    		
    		function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
    			if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray"))) 
    					|| jsonObjField.toString().indexOf(config.attributePrefix)==0 
    					|| jsonObjField.toString().indexOf("__")==0
    					|| (jsonObj[jsonObjField] instanceof Function) )
    				return true;
    			else
    				return false;
    		}
    		
    		function jsonXmlElemCount ( jsonObj ) {
    			var elementsCnt = 0;
    			if(jsonObj instanceof Object ) {
    				for( var it in jsonObj  ) {
    					if(jsonXmlSpecialElem ( jsonObj, it) )
    						continue;			
    					elementsCnt++;
    				}
    			}
    			return elementsCnt;
    		}
    		
    		function checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
    			return config.jsonPropertiesFilter.length == 0
    				|| jsonObjPath==""
    				|| checkInStdFiltersArrayForm(config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);	
    		}
    		
    		function parseJSONAttributes ( jsonObj ) {
    			var attrList = [];
    			if(jsonObj instanceof Object ) {
    				for( var ait in jsonObj  ) {
    					if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
    						attrList.push(ait);
    					}
    				}
    			}
    			return attrList;
    		}
    		
    		function parseJSONTextAttrs ( jsonTxtObj ) {
    			var result ="";
    			
    			if(jsonTxtObj.__cdata!=null) {										
    				result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
    			}
    			
    			if(jsonTxtObj.__text!=null) {			
    				if(config.escapeMode)
    					result+=escapeXmlChars(jsonTxtObj.__text);
    				else
    					result+=jsonTxtObj.__text;
    			}
    			return result;
    		}
    		
    		function parseJSONTextObject ( jsonTxtObj ) {
    			var result ="";
    	
    			if( jsonTxtObj instanceof Object ) {
    				result+=parseJSONTextAttrs ( jsonTxtObj );
    			}
    			else
    				if(jsonTxtObj!=null) {
    					if(config.escapeMode)
    						result+=escapeXmlChars(jsonTxtObj);
    					else
    						result+=jsonTxtObj;
    				}
    			
    			return result;
    		}
    		
    		function getJsonPropertyPath(jsonObjPath, jsonPropName) {
    			if (jsonObjPath==="") {
    				return jsonPropName;
    			}
    			else
    				return jsonObjPath+"."+jsonPropName;
    		}
    		
    		function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList, jsonObjPath ) {
    			var result = ""; 
    			if(jsonArrRoot.length == 0) {
    				result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
    			}
    			else {
    				for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
    					result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
    					result+=parseJSONObject(jsonArrRoot[arIdx], getJsonPropertyPath(jsonObjPath,jsonArrObj));
    					result+=endTag(jsonArrRoot[arIdx],jsonArrObj);
    				}
    			}
    			return result;
    		}
    		
    		function parseJSONObject ( jsonObj, jsonObjPath ) {
    			var result = "";	
    	
    			var elementsCnt = jsonXmlElemCount ( jsonObj );
    			
    			if(elementsCnt > 0) {
    				for( var it in jsonObj ) {
    					
    					if(jsonXmlSpecialElem ( jsonObj, it) || (jsonObjPath!="" && !checkJsonObjPropertiesFilter(jsonObj, it, getJsonPropertyPath(jsonObjPath,it))) )
    						continue;			
    					
    					var subObj = jsonObj[it];						
    					
    					var attrList = parseJSONAttributes( subObj );
    					
    					if(subObj == null || subObj == undefined) {
    						result+=startTag(subObj, it, attrList, true);
    					}
    					else
    					if(subObj instanceof Object) {
    						
    						if(subObj instanceof Array) {					
    							result+=parseJSONArray( subObj, it, attrList, jsonObjPath );					
    						}
    						else if(subObj instanceof Date) {
    							result+=startTag(subObj, it, attrList, false);
    							result+=subObj.toISOString();
    							result+=endTag(subObj,it);
    						}
    						else {
    							var subObjElementsCnt = jsonXmlElemCount ( subObj );
    							if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
    								result+=startTag(subObj, it, attrList, false);
    								result+=parseJSONObject(subObj, getJsonPropertyPath(jsonObjPath,it));
    								result+=endTag(subObj,it);
    							}
    							else {
    								result+=startTag(subObj, it, attrList, true);
    							}
    						}
    					}
    					else {
    						result+=startTag(subObj, it, attrList, false);
    						result+=parseJSONTextObject(subObj);
    						result+=endTag(subObj,it);
    					}
    				}
    			}
    			result+=parseJSONTextObject(jsonObj);
    			
    			return result;
    		}
    		
    		this.parseXmlString = function(xmlDocStr) {
    			var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
    			if (xmlDocStr === undefined) {
    				return null;
    			}
    			var xmlDoc;
    			if (window.DOMParser) {
    				var parser=new window.DOMParser();			
    				var parsererrorNS = null;
    				// IE9+ now is here
    				if(!isIEParser) {
    					try {
    						parsererrorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI;
    					}
    					catch(err) {					
    						parsererrorNS = null;
    					}
    				}
    				try {
    					xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
    					if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
    						//throw new Error('Error parsing XML: '+xmlDocStr);
    						xmlDoc = null;
    					}
    				}
    				catch(err) {
    					xmlDoc = null;
    				}
    			}
    			else {
    				// IE :(
    				if(xmlDocStr.indexOf("<?")==0) {
    					xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
    				}
    				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    				xmlDoc.async="false";
    				xmlDoc.loadXML(xmlDocStr);
    			}
    			return xmlDoc;
    		};
    		
    		this.asArray = function(prop) {
    			if (prop === undefined || prop == null)
    				return [];
    			else
    			if(prop instanceof Array)
    				return prop;
    			else
    				return [prop];
    		};
    		
    		this.toXmlDateTime = function(dt) {
    			if(dt instanceof Date)
    				return dt.toISOString();
    			else
    			if(typeof(dt) === 'number' )
    				return new Date(dt).toISOString();
    			else	
    				return null;
    		};
    		
    		this.asDateTime = function(prop) {
    			if(typeof(prop) == "string") {
    				return fromXmlDateTime(prop);
    			}
    			else
    				return prop;
    		};
    	
    		this.xml2json = function (xmlDoc) {
    			return parseDOMChildren ( xmlDoc );
    		};
    		
    		this.xml_str2json = function (xmlDocStr) {
    			var xmlDoc = this.parseXmlString(xmlDocStr);
    			if(xmlDoc!=null)
    				return this.xml2json(xmlDoc);
    			else
    				return null;
    		};
    	
    		this.json2xml_str = function (jsonObj) {
    			return parseJSONObject ( jsonObj, "" );
    		};
    	
    		this.json2xml = function (jsonObj) {
    			var xmlDocStr = this.json2xml_str (jsonObj);
    			return this.parseXmlString(xmlDocStr);
    		};
    		
    		this.getVersion = function () {
    			return VERSION;
    		};	
    	}
    }));
    });

    /* helper\HelperAI.svelte generated by Svelte v3.29.0 */

    function XMLToJSON(myXml) {
    	//var myXml = xml;
    	myXml = myXml.replace(/<\!--\[CDATA\[/g, "<![CDATA[").replace(/\]\]-->/g, "]]>");

    	let x2js = new xml2json({ useDoubleQuotes: true });
    	let newXml = JSON.stringify(x2js.xml_str2json(myXml));
    	newXml = newXml.replace("SMXML", "smxml");
    	newXml = JSON.parse(newXml);
    	return newXml;
    }

    const AH = new JUI();
    const SSD = new JStore();

    /* clsSMFill\FillInTheBlanksToolbar.svelte generated by Svelte v3.29.0 */

    const { document: document_1 } = globals;

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-1qr3f7h-style";
    	style.textContent = ".toolbar_container_one.svelte-1qr3f7h{max-height:359px;max-width:641px;margin:0 auto;border:1px solid #91653E;border-width:0 1px 1px 1px;z-index:1;font-size:17px !important}.draggable_area.svelte-1qr3f7h{display:inline-flex;height:24px;width:100%;background-color:#654320}.dots_container.svelte-1qr3f7h{margin:auto;text-align:center}.dots.svelte-1qr3f7h{width:4px;height:4px;border-radius:50%;display:inline-block;background-color:#888}.toolbar_types_area.svelte-1qr3f7h{max-height:35px;display:inline-flex;width:-webkit-fill-available;width:100%;background-color:#F0F0F0}.select_area.svelte-1qr3f7h{width:162px;margin:4px 0}.option_selectbox.svelte-1qr3f7h{width:155px;padding:4px 2px;border:none;margin-left:2px;border:1px solid}.show_text_area.svelte-1qr3f7h{width:605px}.lower_part_toolbar.svelte-1qr3f7h{border:1px solid #91653E;border-width:1px 0}.orange_container.svelte-1qr3f7h{background-color:#FCFCD3}.column_four.svelte-1qr3f7h{background-color:#DDDDDD}.blue_container.svelte-1qr3f7h{background-color:#E6F2FC}.light_purpl_container.svelte-1qr3f7h{background-color:#F0F0F0}.blank_color.svelte-1qr3f7h{background-color:#D7E7DA}.blank_color.svelte-1qr3f7h:hover{outline:none}.font_changer.svelte-1qr3f7h{font-weight:bold;font-size:17px !important}.first_btn.svelte-1qr3f7h,.scnd_btn.svelte-1qr3f7h,.thrd_btn.svelte-1qr3f7h,.fourth_btn.svelte-1qr3f7h,.fifth_btn.svelte-1qr3f7h{text-align:center;width:80px;height:58px;padding:20px;border-right:1px solid #91653E}.first_btn.svelte-1qr3f7h:hover,.scnd_btn.svelte-1qr3f7h:hover,.thrd_btn.svelte-1qr3f7h:hover,.fourth_btn.svelte-1qr3f7h:hover,.fifth_btn.svelte-1qr3f7h:hover{outline:1px solid;outline-offset:-6px}.button_designs.svelte-1qr3f7h,.lower_part_toolbar.svelte-1qr3f7h{display:inline-flex}.scnd_btn.svelte-1qr3f7h,.fourth_btn.svelte-1qr3f7h{border-top:1px solid #91653E;border-bottom:1px solid #91653E}.columns_design.svelte-1qr3f7h{width:80px}.padder_btn.svelte-1qr3f7h{padding-top:2px}.remove_border.svelte-1qr3f7h{border:none}.xvariable.svelte-1qr3f7h{width:20px;margin:auto;height:19px;background:url(../../images/toolbar_images.png) -32px -487px}.yvariable.svelte-1qr3f7h{width:22px;margin:auto;height:22px;background:url(../../images/toolbar_images.png) -30px -714px}.xfraction.svelte-1qr3f7h{width:21px;margin:auto;height:49px;background:url(../../images/toolbar_images.png) -23px -922px}.modulus.svelte-1qr3f7h{width:25px;margin:auto;height:30px;background:url(../../images/toolbar_images.png) -27px -848px}.padder_less.svelte-1qr3f7h{padding-top:15px}.padder_remover.svelte-1qr3f7h{padding-top:10px}.padder_field.svelte-1qr3f7h{padding-top:12px}.sigma.svelte-1qr3f7h{width:16px;margin:auto;height:48px;background:url(../../images/toolbar_images.png) -36px -381px}.h-bar.svelte-1qr3f7h{width:17px;margin:auto;height:34px;background:url(../../images/toolbar_images.png) -32px -507px}.x-power-y.svelte-1qr3f7h{width:21px;margin:auto;height:38px;background:url(../../images/toolbar_images.png) -1px -899px}.long-division.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -79px;width:45px;height:32px;margin:auto}.square-root-two.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -183px;width:38px;height:39px;margin:auto}.x-times-fraction.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -223px;margin:auto;width:37px;height:50px}.square-root.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -274px;width:36px;height:34px;margin:auto}.brackets.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -309px;width:35px;height:34px;margin:auto}.h-power.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -344px;width:35px;height:36px;margin:auto}.curly-brackets.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -408px;width:33px;margin:auto;height:27px}.xsquare.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -461px;width:31px;height:25px;margin:auto}.integrtion.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -487px;width:30px;height:40px;margin:auto}.opp-recbrackets.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -528px;width:30px;height:27px;margin:auto}.square-brackets.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -556px;width:30px;height:34px;margin:auto}.xsubscript.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -591px;width:30px;height:31px;margin:auto}.dollar.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -623px;width:29px;height:31px;margin:auto}.h-sub.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -655px;margin:auto;width:29px;height:30px}.rec-brackets.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -686px;width:28px;height:31px;margin:auto}.xpower.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -718px;width:28px;height:30px;margin:auto}.bar-block.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -749px;width:26px;height:34px;margin:auto}.infinity.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -784px;width:26px;height:20px;margin:auto}.topbar-arrow.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -1px -805px;width:26px;height:42px;margin:auto}.h-sup.svelte-1qr3f7h{background:url(../../images/toolbar_images.png)-1px -848px;width:25px;height:26px;margin:auto}.colon.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -28px -749px;width:24px;height:31px;margin:auto}.not-lesser.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -28px -781px;width:24px;height:23px;margin:auto}.h-sup-sub.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -28px -805px;width:23px;height:36px;margin:auto}.not-greater.svelte-1qr3f7h{background:url(../../images/toolbar_images.png) -30px -686px;width:22px;margin:auto;height:27px}.rborder_remover.svelte-1qr3f7h{border-right:0}.dec_widther.svelte-1qr3f7h{width:78px}.bborder_remover.svelte-1qr3f7h{border-bottom:0}.blank_color.svelte-1qr3f7h:hover{outline:0}.bborder_adder.svelte-1qr3f7h{border-bottom:1px solid #91653E}@media(max-width: 556px){.first_btn.svelte-1qr3f7h,.scnd_btn.svelte-1qr3f7h,.thrd_btn.svelte-1qr3f7h,.fourth_btn.svelte-1qr3f7h,.fifth_btn.svelte-1qr3f7h,.columns_design.svelte-1qr3f7h{width:30px}}@media(max-width: 768px){.first_btn.svelte-1qr3f7h,.scnd_btn.svelte-1qr3f7h,.thrd_btn.svelte-1qr3f7h,.fourth_btn.svelte-1qr3f7h,.fifth_btn.svelte-1qr3f7h,.columns_design.svelte-1qr3f7h{width:50px}}@media(max-width: 992px){.first_btn.svelte-1qr3f7h,.scnd_btn.svelte-1qr3f7h,.thrd_btn.svelte-1qr3f7h,.fourth_btn.svelte-1qr3f7h,.fifth_btn.svelte-1qr3f7h,.columns_design.svelte-1qr3f7h{width:80px}}.height_modifier.svelte-1qr3f7h{max-height:290px;overflow-y:scroll}.tborder_remover.svelte-1qr3f7h{border-top:0}.close_toolbar.svelte-1qr3f7h{padding:5px;color:#888;border:none;background-color:#654320}";
    	append(document_1.head, style);
    }

    function create_fragment(ctx) {
    	let div255;
    	let div2;
    	let div1;
    	let t4;
    	let div5;
    	let div3;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let t21;
    	let div4;
    	let t22;
    	let div254;
    	let div10;
    	let div6;
    	let button1;
    	let t24;
    	let button2;
    	let t26;
    	let button3;
    	let t28;
    	let button4;
    	let t30;
    	let button5;
    	let t31;
    	let div7;
    	let button6;
    	let t33;
    	let button7;
    	let t35;
    	let button8;
    	let t37;
    	let button9;
    	let t39;
    	let button10;
    	let t40;
    	let div8;
    	let button11;
    	let t42;
    	let button12;
    	let t44;
    	let button13;
    	let t46;
    	let button14;
    	let t48;
    	let button15;
    	let t49;
    	let div9;
    	let button16;
    	let t51;
    	let button17;
    	let t53;
    	let button18;
    	let t55;
    	let button19;
    	let t57;
    	let button20;
    	let t59;
    	let div87;
    	let div45;
    	let div12;
    	let t60;
    	let button21;
    	let t62;
    	let button22;
    	let t64;
    	let button23;
    	let t66;
    	let button24;
    	let t68;
    	let button25;
    	let t70;
    	let button26;
    	let t72;
    	let div14;
    	let t73;
    	let div16;
    	let t74;
    	let div18;
    	let t75;
    	let div20;
    	let t76;
    	let button27;
    	let t78;
    	let button28;
    	let t80;
    	let div22;
    	let t81;
    	let div24;
    	let t82;
    	let button29;
    	let t84;
    	let div26;
    	let t85;
    	let div28;
    	let t86;
    	let div30;
    	let t87;
    	let button30;
    	let t89;
    	let div32;
    	let t90;
    	let div34;
    	let t91;
    	let div36;
    	let t92;
    	let div38;
    	let t93;
    	let div40;
    	let t94;
    	let button31;
    	let t96;
    	let button32;
    	let t98;
    	let button33;
    	let t100;
    	let button34;
    	let t102;
    	let button35;
    	let t104;
    	let button36;
    	let t106;
    	let button37;
    	let t108;
    	let button38;
    	let t110;
    	let div42;
    	let t111;
    	let button39;
    	let t113;
    	let div44;
    	let t114;
    	let button40;
    	let t116;
    	let button41;
    	let t118;
    	let button42;
    	let t120;
    	let div58;
    	let div47;
    	let t121;
    	let div49;
    	let t122;
    	let button43;
    	let t124;
    	let button44;
    	let t126;
    	let button45;
    	let t128;
    	let button46;
    	let t130;
    	let button47;
    	let t132;
    	let button48;
    	let t134;
    	let div51;
    	let t135;
    	let button49;
    	let t137;
    	let button50;
    	let t139;
    	let button51;
    	let t141;
    	let div53;
    	let t142;
    	let button52;
    	let t144;
    	let button53;
    	let t146;
    	let button54;
    	let t148;
    	let button55;
    	let t150;
    	let div55;
    	let t151;
    	let button56;
    	let t153;
    	let button57;
    	let t155;
    	let button58;
    	let t157;
    	let button59;
    	let t159;
    	let div57;
    	let t160;
    	let button60;
    	let t162;
    	let button61;
    	let t164;
    	let button62;
    	let t166;
    	let button63;
    	let t168;
    	let button64;
    	let t170;
    	let button65;
    	let t172;
    	let button66;
    	let t174;
    	let button67;
    	let t176;
    	let button68;
    	let t178;
    	let button69;
    	let t180;
    	let button70;
    	let t182;
    	let button71;
    	let t184;
    	let button72;
    	let t186;
    	let button73;
    	let t188;
    	let button74;
    	let t190;
    	let button75;
    	let t192;
    	let div77;
    	let div60;
    	let t193;
    	let div62;
    	let t194;
    	let button76;
    	let t196;
    	let div64;
    	let t197;
    	let div66;
    	let t198;
    	let button77;
    	let t200;
    	let button78;
    	let t202;
    	let button79;
    	let t204;
    	let button80;
    	let t206;
    	let div68;
    	let t207;
    	let button81;
    	let t209;
    	let button82;
    	let t211;
    	let button83;
    	let t213;
    	let button84;
    	let t215;
    	let div70;
    	let t216;
    	let button85;
    	let t218;
    	let button86;
    	let t220;
    	let button87;
    	let t222;
    	let button88;
    	let t224;
    	let div72;
    	let t225;
    	let button89;
    	let t228;
    	let button90;
    	let t231;
    	let button91;
    	let t234;
    	let button92;
    	let t236;
    	let button93;
    	let t238;
    	let button94;
    	let t240;
    	let button95;
    	let t243;
    	let button96;
    	let t246;
    	let button97;
    	let t249;
    	let button98;
    	let t251;
    	let button99;
    	let t253;
    	let button100;
    	let t255;
    	let button101;
    	let t257;
    	let button102;
    	let t259;
    	let div74;
    	let t260;
    	let button103;
    	let t262;
    	let div76;
    	let t263;
    	let button104;
    	let t266;
    	let button105;
    	let t268;
    	let div86;
    	let div79;
    	let t269;
    	let div81;
    	let t270;
    	let div83;
    	let t271;
    	let div85;
    	let t272;
    	let button106;
    	let t274;
    	let button107;
    	let t276;
    	let button108;
    	let t278;
    	let button109;
    	let t281;
    	let button110;
    	let t284;
    	let button111;
    	let t287;
    	let button112;
    	let t289;
    	let button113;
    	let t291;
    	let button114;
    	let t293;
    	let button115;
    	let t295;
    	let button116;
    	let t297;
    	let button117;
    	let t299;
    	let button118;
    	let t301;
    	let button119;
    	let t303;
    	let button120;
    	let t305;
    	let button121;
    	let t307;
    	let button122;
    	let t309;
    	let button123;
    	let t311;
    	let button124;
    	let t313;
    	let button125;
    	let t315;
    	let button126;
    	let t317;
    	let button127;
    	let t319;
    	let button128;
    	let t321;
    	let button129;
    	let t323;
    	let button130;
    	let t325;
    	let button131;
    	let t327;
    	let button132;
    	let t329;
    	let button133;
    	let t331;
    	let button134;
    	let t333;
    	let button135;
    	let t335;
    	let button136;
    	let t337;
    	let button137;
    	let t339;
    	let button138;
    	let t341;
    	let button139;
    	let t343;
    	let button140;
    	let t345;
    	let div118;
    	let div94;
    	let div89;
    	let t346;
    	let div91;
    	let t347;
    	let button141;
    	let t349;
    	let button142;
    	let t351;
    	let div93;
    	let t352;
    	let div99;
    	let div96;
    	let t353;
    	let div98;
    	let t354;
    	let button143;
    	let t356;
    	let button144;
    	let t358;
    	let button145;
    	let t360;
    	let div108;
    	let div101;
    	let t361;
    	let div103;
    	let t362;
    	let button146;
    	let t364;
    	let div105;
    	let t365;
    	let div107;
    	let t366;
    	let div117;
    	let div110;
    	let t367;
    	let div112;
    	let t368;
    	let div114;
    	let t369;
    	let div116;
    	let t370;
    	let button147;
    	let t371;
    	let div150;
    	let div123;
    	let div120;
    	let t372;
    	let div122;
    	let t373;
    	let button148;
    	let t375;
    	let button149;
    	let t377;
    	let button150;
    	let t378;
    	let div131;
    	let div125;
    	let t379;
    	let div127;
    	let t380;
    	let button151;
    	let t382;
    	let div129;
    	let t383;
    	let div130;
    	let t384;
    	let div139;
    	let div133;
    	let t385;
    	let div135;
    	let t386;
    	let button152;
    	let t388;
    	let div137;
    	let t389;
    	let div138;
    	let t390;
    	let div149;
    	let div141;
    	let t391;
    	let div143;
    	let t392;
    	let div145;
    	let t393;
    	let div147;
    	let t394;
    	let div148;
    	let t395;
    	let div160;
    	let div154;
    	let button153;
    	let t397;
    	let button154;
    	let t399;
    	let button155;
    	let t401;
    	let div152;
    	let t402;
    	let div153;
    	let t403;
    	let div158;
    	let button156;
    	let t405;
    	let button157;
    	let t407;
    	let button158;
    	let t409;
    	let div156;
    	let t410;
    	let div157;
    	let t411;
    	let div159;
    	let t412;
    	let div169;
    	let div163;
    	let button159;
    	let t414;
    	let button160;
    	let t416;
    	let button161;
    	let t418;
    	let button162;
    	let t420;
    	let div162;
    	let t421;
    	let div166;
    	let button163;
    	let t423;
    	let button164;
    	let t425;
    	let button165;
    	let t427;
    	let button166;
    	let t429;
    	let div165;
    	let t430;
    	let div167;
    	let button167;
    	let t432;
    	let button168;
    	let t434;
    	let button169;
    	let t436;
    	let button170;
    	let t438;
    	let button171;
    	let t440;
    	let div168;
    	let button172;
    	let t442;
    	let button173;
    	let t444;
    	let button174;
    	let t446;
    	let button175;
    	let t448;
    	let button176;
    	let t450;
    	let div182;
    	let div172;
    	let button177;
    	let t452;
    	let button178;
    	let t454;
    	let button179;
    	let t456;
    	let button180;
    	let t458;
    	let div171;
    	let t459;
    	let div175;
    	let button181;
    	let t461;
    	let button182;
    	let t463;
    	let button183;
    	let t465;
    	let button184;
    	let t467;
    	let div174;
    	let t468;
    	let div178;
    	let button185;
    	let t470;
    	let button186;
    	let t472;
    	let button187;
    	let t474;
    	let button188;
    	let t476;
    	let div177;
    	let t477;
    	let div181;
    	let button189;
    	let t479;
    	let button190;
    	let t481;
    	let button191;
    	let t482;
    	let button192;
    	let t484;
    	let div180;
    	let t485;
    	let div187;
    	let div183;
    	let button193;
    	let t487;
    	let button194;
    	let t489;
    	let button195;
    	let t491;
    	let button196;
    	let t492;
    	let button197;
    	let t493;
    	let div184;
    	let button198;
    	let t495;
    	let button199;
    	let t497;
    	let button200;
    	let t499;
    	let button201;
    	let t500;
    	let button202;
    	let t501;
    	let div185;
    	let button203;
    	let t504;
    	let button204;
    	let t507;
    	let button205;
    	let t510;
    	let button206;
    	let t511;
    	let button207;
    	let t512;
    	let div186;
    	let button208;
    	let t515;
    	let button209;
    	let t518;
    	let button210;
    	let t521;
    	let button211;
    	let t522;
    	let button212;
    	let t523;
    	let div192;
    	let div188;
    	let button213;
    	let t525;
    	let button214;
    	let t527;
    	let button215;
    	let t529;
    	let button216;
    	let t531;
    	let button217;
    	let t532;
    	let div189;
    	let button218;
    	let t534;
    	let button219;
    	let t536;
    	let button220;
    	let t538;
    	let button221;
    	let t540;
    	let button222;
    	let t541;
    	let div190;
    	let button223;
    	let t543;
    	let button224;
    	let t545;
    	let button225;
    	let t547;
    	let button226;
    	let t549;
    	let button227;
    	let t550;
    	let div191;
    	let button228;
    	let t552;
    	let button229;
    	let t554;
    	let button230;
    	let t556;
    	let button231;
    	let t557;
    	let button232;
    	let t558;
    	let div199;
    	let div193;
    	let button233;
    	let t560;
    	let button234;
    	let t562;
    	let button235;
    	let t563;
    	let button236;
    	let t564;
    	let button237;
    	let t565;
    	let div194;
    	let button238;
    	let t567;
    	let button239;
    	let t569;
    	let button240;
    	let t570;
    	let button241;
    	let t571;
    	let button242;
    	let t572;
    	let div197;
    	let button243;
    	let t574;
    	let div196;
    	let t575;
    	let button244;
    	let t576;
    	let button245;
    	let t577;
    	let button246;
    	let t578;
    	let div198;
    	let button247;
    	let t580;
    	let button248;
    	let t582;
    	let button249;
    	let t583;
    	let button250;
    	let t584;
    	let button251;
    	let t585;
    	let div204;
    	let div200;
    	let button252;
    	let t587;
    	let button253;
    	let t589;
    	let button254;
    	let t591;
    	let button255;
    	let t592;
    	let button256;
    	let t593;
    	let div201;
    	let button257;
    	let t595;
    	let button258;
    	let t597;
    	let button259;
    	let t599;
    	let button260;
    	let t600;
    	let button261;
    	let t601;
    	let div202;
    	let button262;
    	let t603;
    	let button263;
    	let t605;
    	let button264;
    	let t607;
    	let button265;
    	let t608;
    	let button266;
    	let t609;
    	let div203;
    	let button267;
    	let t611;
    	let button268;
    	let t613;
    	let button269;
    	let t615;
    	let button270;
    	let t616;
    	let button271;
    	let t617;
    	let div209;
    	let div205;
    	let button272;
    	let t619;
    	let button273;
    	let t621;
    	let button274;
    	let t623;
    	let button275;
    	let t625;
    	let button276;
    	let t626;
    	let div206;
    	let button277;
    	let t628;
    	let button278;
    	let t630;
    	let button279;
    	let t632;
    	let button280;
    	let t634;
    	let button281;
    	let t635;
    	let div207;
    	let button282;
    	let t637;
    	let button283;
    	let t639;
    	let button284;
    	let t640;
    	let button285;
    	let t641;
    	let button286;
    	let t642;
    	let div208;
    	let button287;
    	let t644;
    	let button288;
    	let t646;
    	let button289;
    	let t647;
    	let button290;
    	let t648;
    	let button291;
    	let t649;
    	let div213;
    	let div210;
    	let button292;
    	let t651;
    	let button293;
    	let t653;
    	let button294;
    	let t655;
    	let button295;
    	let t656;
    	let button296;
    	let t657;
    	let div211;
    	let button297;
    	let t659;
    	let button298;
    	let t661;
    	let button299;
    	let t663;
    	let button300;
    	let t664;
    	let button301;
    	let t665;
    	let div212;
    	let button302;
    	let t666;
    	let button303;
    	let t668;
    	let button304;
    	let t670;
    	let button305;
    	let t671;
    	let button306;
    	let t672;
    	let div223;
    	let div216;
    	let div215;
    	let t673;
    	let button307;
    	let t674;
    	let button308;
    	let t675;
    	let button309;
    	let t676;
    	let button310;
    	let t677;
    	let div219;
    	let div218;
    	let t678;
    	let button311;
    	let t679;
    	let button312;
    	let t680;
    	let button313;
    	let t681;
    	let button314;
    	let t682;
    	let div222;
    	let div221;
    	let t683;
    	let button315;
    	let t684;
    	let button316;
    	let t685;
    	let button317;
    	let t686;
    	let button318;
    	let t687;
    	let div236;
    	let div226;
    	let button319;
    	let t689;
    	let div225;
    	let t690;
    	let button320;
    	let t691;
    	let button321;
    	let t692;
    	let button322;
    	let t693;
    	let div229;
    	let button323;
    	let t695;
    	let div228;
    	let t696;
    	let button324;
    	let t697;
    	let button325;
    	let t698;
    	let button326;
    	let t699;
    	let div232;
    	let button327;
    	let t701;
    	let div231;
    	let t702;
    	let button328;
    	let t703;
    	let button329;
    	let t704;
    	let button330;
    	let t705;
    	let div235;
    	let div234;
    	let t706;
    	let button331;
    	let t708;
    	let button332;
    	let t709;
    	let button333;
    	let t710;
    	let button334;
    	let t711;
    	let div253;
    	let div241;
    	let div238;
    	let t712;
    	let button335;
    	let t714;
    	let div240;
    	let t715;
    	let button336;
    	let t716;
    	let button337;
    	let t717;
    	let div244;
    	let div243;
    	let t718;
    	let button338;
    	let t720;
    	let button339;
    	let t722;
    	let button340;
    	let t723;
    	let button341;
    	let t724;
    	let div247;
    	let div246;
    	let t725;
    	let button342;
    	let t727;
    	let button343;
    	let t729;
    	let button344;
    	let t730;
    	let button345;
    	let t731;
    	let div252;
    	let div249;
    	let t732;
    	let button346;
    	let t734;
    	let div251;
    	let t735;
    	let button347;
    	let t736;
    	let button348;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div255 = element("div");
    			div2 = element("div");
    			div1 = element("div");

    			div1.innerHTML = `<div class="dots_container svelte-1qr3f7h"><span class="dots svelte-1qr3f7h"></span> 
                <span class="dots svelte-1qr3f7h"></span> 
                <span class="dots svelte-1qr3f7h"></span> 
                <span class="dots svelte-1qr3f7h"></span></div> 
                <button type="button" class="icomoon-24px-incorrect-2 close_toolbar svelte-1qr3f7h"></button>`;

    			t4 = space();
    			div5 = element("div");
    			div3 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = `${language.Allsymbols}`;
    			option1 = element("option");
    			option1.textContent = `${language.Basic}`;
    			option2 = element("option");
    			option2.textContent = `${language.xvariables}`;
    			option3 = element("option");
    			option3.textContent = "<";
    			option4 = element("option");
    			option4.textContent = "∠";
    			option5 = element("option");
    			option5.textContent = "⋂";
    			option6 = element("option");
    			option6.textContent = `${language.sin}`;
    			option7 = element("option");
    			option7.textContent = "α";
    			option8 = element("option");
    			option8.textContent = `${language.Mis}c`;
    			option9 = element("option");
    			option9.textContent = `${language.Discrete}`;
    			option10 = element("option");
    			option10.textContent = `${language.kg}`;
    			option11 = element("option");
    			option11.textContent = `${language.lb}`;
    			option12 = element("option");
    			option12.textContent = `${language.brackets}`;
    			option13 = element("option");
    			option13.textContent = "Δ";
    			option14 = element("option");
    			option14.textContent = `${language.chem}`;
    			t21 = space();
    			div4 = element("div");
    			t22 = space();
    			div254 = element("div");
    			div10 = element("div");
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "7";
    			t24 = space();
    			button2 = element("button");
    			button2.textContent = "4";
    			t26 = space();
    			button3 = element("button");
    			button3.textContent = "1";
    			t28 = space();
    			button4 = element("button");
    			button4.textContent = "0";
    			t30 = space();
    			button5 = element("button");
    			button5.innerHTML = `<span><i class="icomoon-arrow-left"></i></span>`;
    			t31 = space();
    			div7 = element("div");
    			button6 = element("button");
    			button6.textContent = "8";
    			t33 = space();
    			button7 = element("button");
    			button7.textContent = "5";
    			t35 = space();
    			button8 = element("button");
    			button8.textContent = "2";
    			t37 = space();
    			button9 = element("button");
    			button9.textContent = ".";
    			t39 = space();
    			button10 = element("button");
    			button10.innerHTML = `<span><i class="icomoon-arrow-right-2"></i></span>`;
    			t40 = space();
    			div8 = element("div");
    			button11 = element("button");
    			button11.textContent = "9";
    			t42 = space();
    			button12 = element("button");
    			button12.textContent = "6";
    			t44 = space();
    			button13 = element("button");
    			button13.textContent = "3";
    			t46 = space();
    			button14 = element("button");
    			button14.textContent = ",";
    			t48 = space();
    			button15 = element("button");
    			button15.innerHTML = `<span><i class=" icomoon-backspace-2"></i></span>`;
    			t49 = space();
    			div9 = element("div");
    			button16 = element("button");
    			button16.textContent = "÷";
    			t51 = space();
    			button17 = element("button");
    			button17.textContent = "×";
    			t53 = space();
    			button18 = element("button");
    			button18.textContent = "-";
    			t55 = space();
    			button19 = element("button");
    			button19.textContent = "+";
    			t57 = space();
    			button20 = element("button");
    			button20.textContent = "=";
    			t59 = space();
    			div87 = element("div");
    			div45 = element("div");
    			div12 = element("div");
    			div12.innerHTML = `<div class="xvariable svelte-1qr3f7h"></div>`;
    			t60 = space();
    			button21 = element("button");
    			button21.textContent = "b";
    			t62 = space();
    			button22 = element("button");
    			button22.textContent = "abc";
    			t64 = space();
    			button23 = element("button");
    			button23.textContent = "$";
    			t66 = space();
    			button24 = element("button");
    			button24.textContent = "÷";
    			t68 = space();
    			button25 = element("button");
    			button25.textContent = "≥";
    			t70 = space();
    			button26 = element("button");
    			button26.textContent = "⊥";
    			t72 = space();
    			div14 = element("div");
    			div14.innerHTML = `<div class="not-lesser svelte-1qr3f7h"></div>`;
    			t73 = space();
    			div16 = element("div");
    			div16.innerHTML = `<div class="rec-brackets svelte-1qr3f7h"></div>`;
    			t74 = space();
    			div18 = element("div");
    			div18.innerHTML = `<div class="xvariable svelte-1qr3f7h"></div>`;
    			t75 = space();
    			div20 = element("div");
    			div20.innerHTML = `<div class="xfraction svelte-1qr3f7h"></div>`;
    			t76 = space();
    			button27 = element("button");
    			button27.textContent = "<";
    			t78 = space();
    			button28 = element("button");
    			button28.textContent = "π";
    			t80 = space();
    			div22 = element("div");
    			div22.innerHTML = `<div class="yvariable svelte-1qr3f7h"></div>`;
    			t81 = space();
    			div24 = element("div");
    			div24.innerHTML = `<div class="x-times-fraction svelte-1qr3f7h"></div>`;
    			t82 = space();
    			button29 = element("button");
    			button29.textContent = ">";
    			t84 = space();
    			div26 = element("div");
    			div26.innerHTML = `<div class="infinity svelte-1qr3f7h"></div>`;
    			t85 = space();
    			div28 = element("div");
    			div28.innerHTML = `<div class="xsquare svelte-1qr3f7h"></div>`;
    			t86 = space();
    			div30 = element("div");
    			div30.innerHTML = `<div class="xpower svelte-1qr3f7h"></div>`;
    			t87 = space();
    			button30 = element("button");
    			button30.textContent = "±";
    			t89 = space();
    			div32 = element("div");
    			div32.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t90 = space();
    			div34 = element("div");
    			div34.innerHTML = `<div class="square-root svelte-1qr3f7h"></div>`;
    			t91 = space();
    			div36 = element("div");
    			div36.innerHTML = `<div class="square-root-two svelte-1qr3f7h"></div>`;
    			t92 = space();
    			div38 = element("div");
    			div38.innerHTML = `<div class="modulus svelte-1qr3f7h"></div>`;
    			t93 = space();
    			div40 = element("div");
    			div40.innerHTML = `<div class="square-brackets svelte-1qr3f7h"></div>`;
    			t94 = space();
    			button31 = element("button");
    			button31.textContent = "a";
    			t96 = space();
    			button32 = element("button");
    			button32.textContent = "|";
    			t98 = space();
    			button33 = element("button");
    			button33.textContent = "⌈";
    			t100 = space();
    			button34 = element("button");
    			button34.textContent = "∧";
    			t102 = space();
    			button35 = element("button");
    			button35.textContent = "∀";
    			t104 = space();
    			button36 = element("button");
    			button36.textContent = "mi";
    			t106 = space();
    			button37 = element("button");
    			button37.textContent = "gal";
    			t108 = space();
    			button38 = element("button");
    			button38.textContent = "f";
    			t110 = space();
    			div42 = element("div");
    			div42.innerHTML = `<div class="integrtion svelte-1qr3f7h"></div>`;
    			t111 = space();
    			button39 = element("button");
    			button39.textContent = "Δ";
    			t113 = space();
    			div44 = element("div");
    			div44.innerHTML = `<div class="sigma svelte-1qr3f7h"></div>`;
    			t114 = space();
    			button40 = element("button");
    			button40.textContent = "⇌";
    			t116 = space();
    			button41 = element("button");
    			button41.textContent = "'";
    			t118 = space();
    			button42 = element("button");
    			button42.textContent = "µg";
    			t120 = space();
    			div58 = element("div");
    			div47 = element("div");
    			div47.innerHTML = `<div class="yvariable svelte-1qr3f7h"></div>`;
    			t121 = space();
    			div49 = element("div");
    			div49.innerHTML = `<div class="x-times-fraction svelte-1qr3f7h"></div>`;
    			t122 = space();
    			button43 = element("button");
    			button43.textContent = ">";
    			t124 = space();
    			button44 = element("button");
    			button44.textContent = "°";
    			t126 = space();
    			button45 = element("button");
    			button45.textContent = "π";
    			t128 = space();
    			button46 = element("button");
    			button46.textContent = "≠";
    			t130 = space();
    			button47 = element("button");
    			button47.textContent = "<";
    			t132 = space();
    			button48 = element("button");
    			button48.textContent = "≤";
    			t134 = space();
    			div51 = element("div");
    			div51.innerHTML = `<div class="not-greater svelte-1qr3f7h"></div>`;
    			t135 = space();
    			button49 = element("button");
    			button49.textContent = "≈";
    			t137 = space();
    			button50 = element("button");
    			button50.textContent = ">";
    			t139 = space();
    			button51 = element("button");
    			button51.textContent = "≥";
    			t141 = space();
    			div53 = element("div");
    			div53.innerHTML = `<div class="not-lesser svelte-1qr3f7h"></div>`;
    			t142 = space();
    			button52 = element("button");
    			button52.textContent = "⊥";
    			t144 = space();
    			button53 = element("button");
    			button53.textContent = "∠";
    			t146 = space();
    			button54 = element("button");
    			button54.textContent = "Δ";
    			t148 = space();
    			button55 = element("button");
    			button55.textContent = "°";
    			t150 = space();
    			div55 = element("div");
    			div55.innerHTML = `<div class="bar-block svelte-1qr3f7h"></div>`;
    			t151 = space();
    			button56 = element("button");
    			button56.textContent = "∥";
    			t153 = space();
    			button57 = element("button");
    			button57.textContent = "m∠";
    			t155 = space();
    			button58 = element("button");
    			button58.textContent = "⊙";
    			t157 = space();
    			button59 = element("button");
    			button59.textContent = "′";
    			t159 = space();
    			div57 = element("div");
    			div57.innerHTML = `<div class="topbar-arrow svelte-1qr3f7h"></div>`;
    			t160 = space();
    			button60 = element("button");
    			button60.textContent = "∦";
    			t162 = space();
    			button61 = element("button");
    			button61.textContent = "∼";
    			t164 = space();
    			button62 = element("button");
    			button62.textContent = "▱";
    			t166 = space();
    			button63 = element("button");
    			button63.textContent = "″";
    			t168 = space();
    			button64 = element("button");
    			button64.textContent = "⋯";
    			t170 = space();
    			button65 = element("button");
    			button65.textContent = "⋱";
    			t172 = space();
    			button66 = element("button");
    			button66.textContent = "≅";
    			t174 = space();
    			button67 = element("button");
    			button67.textContent = "⋮";
    			t176 = space();
    			button68 = element("button");
    			button68.textContent = "π";
    			t178 = space();
    			button69 = element("button");
    			button69.textContent = "□";
    			t180 = space();
    			button70 = element("button");
    			button70.textContent = "∝";
    			t182 = space();
    			button71 = element("button");
    			button71.textContent = "⌋";
    			t184 = space();
    			button72 = element("button");
    			button72.textContent = "≡";
    			t186 = space();
    			button73 = element("button");
    			button73.textContent = "∃";
    			t188 = space();
    			button74 = element("button");
    			button74.textContent = "mg";
    			t190 = space();
    			button75 = element("button");
    			button75.textContent = "cm";
    			t192 = space();
    			div77 = element("div");
    			div60 = element("div");
    			div60.innerHTML = `<div class="xsquare svelte-1qr3f7h"></div>`;
    			t193 = space();
    			div62 = element("div");
    			div62.innerHTML = `<div class="xpower svelte-1qr3f7h"></div>`;
    			t194 = space();
    			button76 = element("button");
    			button76.textContent = "±";
    			t196 = space();
    			div64 = element("div");
    			div64.innerHTML = `<div class="colon svelte-1qr3f7h"></div>`;
    			t197 = space();
    			div66 = element("div");
    			div66.innerHTML = `<div class="infinity svelte-1qr3f7h"></div>`;
    			t198 = space();
    			button77 = element("button");
    			button77.textContent = "⊂";
    			t200 = space();
    			button78 = element("button");
    			button78.textContent = "∊";
    			t202 = space();
    			button79 = element("button");
    			button79.textContent = "∪";
    			t204 = space();
    			button80 = element("button");
    			button80.textContent = ",";
    			t206 = space();
    			div68 = element("div");
    			div68.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t207 = space();
    			button81 = element("button");
    			button81.textContent = "⊃";
    			t209 = space();
    			button82 = element("button");
    			button82.textContent = "∉";
    			t211 = space();
    			button83 = element("button");
    			button83.textContent = "∩";
    			t213 = space();
    			button84 = element("button");
    			button84.textContent = ":";
    			t215 = space();
    			div70 = element("div");
    			div70.innerHTML = `<div class="curly-brackets svelte-1qr3f7h"></div>`;
    			t216 = space();
    			button85 = element("button");
    			button85.textContent = "⊆";
    			t218 = space();
    			button86 = element("button");
    			button86.textContent = "∍";
    			t220 = space();
    			button87 = element("button");
    			button87.textContent = "∅";
    			t222 = space();
    			button88 = element("button");
    			button88.textContent = "!";
    			t224 = space();
    			div72 = element("div");
    			div72.innerHTML = `<div class="rec-brackets svelte-1qr3f7h"></div>`;
    			t225 = space();
    			button89 = element("button");
    			button89.innerHTML = `sec<sup>-1</sup>`;
    			t228 = space();
    			button90 = element("button");
    			button90.innerHTML = `csc<sup>-1</sup>`;
    			t231 = space();
    			button91 = element("button");
    			button91.innerHTML = `cot<sup>-1</sup>`;
    			t234 = space();
    			button92 = element("button");
    			button92.textContent = "sin";
    			t236 = space();
    			button93 = element("button");
    			button93.textContent = "cos";
    			t238 = space();
    			button94 = element("button");
    			button94.textContent = "tan";
    			t240 = space();
    			button95 = element("button");
    			button95.innerHTML = `sec<sup>-1</sup>`;
    			t243 = space();
    			button96 = element("button");
    			button96.innerHTML = `csc<sup>-1</sup>`;
    			t246 = space();
    			button97 = element("button");
    			button97.innerHTML = `cot<sup>-1</sup>`;
    			t249 = space();
    			button98 = element("button");
    			button98.textContent = "b";
    			t251 = space();
    			button99 = element("button");
    			button99.textContent = ".";
    			t253 = space();
    			button100 = element("button");
    			button100.textContent = "lb";
    			t255 = space();
    			button101 = element("button");
    			button101.textContent = "ft";
    			t257 = space();
    			button102 = element("button");
    			button102.textContent = "pt";
    			t259 = space();
    			div74 = element("div");
    			div74.innerHTML = `<div class="h-sup svelte-1qr3f7h"></div>`;
    			t260 = space();
    			button103 = element("button");
    			button103.textContent = "→";
    			t262 = space();
    			div76 = element("div");
    			div76.innerHTML = `<div class="x-power-y svelte-1qr3f7h"></div>`;
    			t263 = space();
    			button104 = element("button");
    			button104.innerHTML = `g mol<sup>-1</sup>`;
    			t266 = space();
    			button105 = element("button");
    			button105.textContent = "∂";
    			t268 = space();
    			div86 = element("div");
    			div79 = element("div");
    			div79.innerHTML = `<div class="square-root svelte-1qr3f7h"></div>`;
    			t269 = space();
    			div81 = element("div");
    			div81.innerHTML = `<div class="xsubscript svelte-1qr3f7h"></div>`;
    			t270 = space();
    			div83 = element("div");
    			div83.innerHTML = `<div class="dollar svelte-1qr3f7h"></div>`;
    			t271 = space();
    			div85 = element("div");
    			div85.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t272 = space();
    			button106 = element("button");
    			button106.textContent = "sec";
    			t274 = space();
    			button107 = element("button");
    			button107.textContent = "csc";
    			t276 = space();
    			button108 = element("button");
    			button108.textContent = "cot";
    			t278 = space();
    			button109 = element("button");
    			button109.innerHTML = `sin<sup>-1</sup>`;
    			t281 = space();
    			button110 = element("button");
    			button110.innerHTML = `cos<sup>-1</sup>`;
    			t284 = space();
    			button111 = element("button");
    			button111.innerHTML = `tan<sup>-1</sup>`;
    			t287 = space();
    			button112 = element("button");
    			button112.textContent = "α";
    			t289 = space();
    			button113 = element("button");
    			button113.textContent = "θ";
    			t291 = space();
    			button114 = element("button");
    			button114.textContent = "Θ";
    			t293 = space();
    			button115 = element("button");
    			button115.textContent = "ζ";
    			t295 = space();
    			button116 = element("button");
    			button116.textContent = "γ";
    			t297 = space();
    			button117 = element("button");
    			button117.textContent = "σ";
    			t299 = space();
    			button118 = element("button");
    			button118.textContent = "Σ";
    			t301 = space();
    			button119 = element("button");
    			button119.textContent = "ε";
    			t303 = space();
    			button120 = element("button");
    			button120.textContent = "δ";
    			t305 = space();
    			button121 = element("button");
    			button121.textContent = "Δ";
    			t307 = space();
    			button122 = element("button");
    			button122.textContent = "λ";
    			t309 = space();
    			button123 = element("button");
    			button123.textContent = "β";
    			t311 = space();
    			button124 = element("button");
    			button124.textContent = "π";
    			t313 = space();
    			button125 = element("button");
    			button125.textContent = "Π";
    			t315 = space();
    			button126 = element("button");
    			button126.textContent = "∅";
    			t317 = space();
    			button127 = element("button");
    			button127.textContent = "⌊";
    			t319 = space();
    			button128 = element("button");
    			button128.textContent = "↑";
    			t321 = space();
    			button129 = element("button");
    			button129.textContent = "¬";
    			t323 = space();
    			button130 = element("button");
    			button130.textContent = "oz";
    			t325 = space();
    			button131 = element("button");
    			button131.textContent = "in";
    			t327 = space();
    			button132 = element("button");
    			button132.textContent = "fl oz";
    			t329 = space();
    			button133 = element("button");
    			button133.textContent = "g";
    			t331 = space();
    			button134 = element("button");
    			button134.textContent = "m";
    			t333 = space();
    			button135 = element("button");
    			button135.textContent = "L";
    			t335 = space();
    			button136 = element("button");
    			button136.textContent = "s";
    			t337 = space();
    			button137 = element("button");
    			button137.textContent = "kg";
    			t339 = space();
    			button138 = element("button");
    			button138.textContent = "km";
    			t341 = space();
    			button139 = element("button");
    			button139.textContent = "mL";
    			t343 = space();
    			button140 = element("button");
    			button140.textContent = "ms";
    			t345 = space();
    			div118 = element("div");
    			div94 = element("div");
    			div89 = element("div");
    			div89.innerHTML = `<div class="xvariable svelte-1qr3f7h"></div>`;
    			t346 = space();
    			div91 = element("div");
    			div91.innerHTML = `<div class="xfraction svelte-1qr3f7h"></div>`;
    			t347 = space();
    			button141 = element("button");
    			button141.textContent = "<";
    			t349 = space();
    			button142 = element("button");
    			button142.textContent = "%";
    			t351 = space();
    			div93 = element("div");
    			div93.innerHTML = `<div class="modulus svelte-1qr3f7h"></div>`;
    			t352 = space();
    			div99 = element("div");
    			div96 = element("div");
    			div96.innerHTML = `<div class="yvariable svelte-1qr3f7h"></div>`;
    			t353 = space();
    			div98 = element("div");
    			div98.innerHTML = `<div class="x-times-fraction svelte-1qr3f7h"></div>`;
    			t354 = space();
    			button143 = element("button");
    			button143.textContent = ">";
    			t356 = space();
    			button144 = element("button");
    			button144.textContent = "°";
    			t358 = space();
    			button145 = element("button");
    			button145.textContent = "π";
    			t360 = space();
    			div108 = element("div");
    			div101 = element("div");
    			div101.innerHTML = `<div class="xsquare svelte-1qr3f7h"></div>`;
    			t361 = space();
    			div103 = element("div");
    			div103.innerHTML = `<div class="xpower svelte-1qr3f7h"></div>`;
    			t362 = space();
    			button146 = element("button");
    			button146.textContent = "±";
    			t364 = space();
    			div105 = element("div");
    			div105.innerHTML = `<div class="colon svelte-1qr3f7h"></div>`;
    			t365 = space();
    			div107 = element("div");
    			div107.innerHTML = `<div class="infinity svelte-1qr3f7h"></div>`;
    			t366 = space();
    			div117 = element("div");
    			div110 = element("div");
    			div110.innerHTML = `<div class="square-root svelte-1qr3f7h"></div>`;
    			t367 = space();
    			div112 = element("div");
    			div112.innerHTML = `<div class="xsubscript svelte-1qr3f7h"></div>`;
    			t368 = space();
    			div114 = element("div");
    			div114.innerHTML = `<div class="dollar svelte-1qr3f7h"></div>`;
    			t369 = space();
    			div116 = element("div");
    			div116.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t370 = space();
    			button147 = element("button");
    			t371 = space();
    			div150 = element("div");
    			div123 = element("div");
    			div120 = element("div");
    			div120.innerHTML = `<div class="xvariable svelte-1qr3f7h"></div>`;
    			t372 = space();
    			div122 = element("div");
    			div122.innerHTML = `<div class="xfraction svelte-1qr3f7h"></div>`;
    			t373 = space();
    			button148 = element("button");
    			button148.textContent = "<";
    			t375 = space();
    			button149 = element("button");
    			button149.textContent = "π";
    			t377 = space();
    			button150 = element("button");
    			t378 = space();
    			div131 = element("div");
    			div125 = element("div");
    			div125.innerHTML = `<div class="yvariable svelte-1qr3f7h"></div>`;
    			t379 = space();
    			div127 = element("div");
    			div127.innerHTML = `<div class="x-times-fraction svelte-1qr3f7h"></div>`;
    			t380 = space();
    			button151 = element("button");
    			button151.textContent = ">";
    			t382 = space();
    			div129 = element("div");
    			div129.innerHTML = `<div class="infinity svelte-1qr3f7h"></div>`;
    			t383 = space();
    			div130 = element("div");
    			t384 = space();
    			div139 = element("div");
    			div133 = element("div");
    			div133.innerHTML = `<div class="xsquare svelte-1qr3f7h"></div>`;
    			t385 = space();
    			div135 = element("div");
    			div135.innerHTML = `<div class="xpower svelte-1qr3f7h"></div>`;
    			t386 = space();
    			button152 = element("button");
    			button152.textContent = "±";
    			t388 = space();
    			div137 = element("div");
    			div137.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t389 = space();
    			div138 = element("div");
    			t390 = space();
    			div149 = element("div");
    			div141 = element("div");
    			div141.innerHTML = `<div class="square-root svelte-1qr3f7h"></div>`;
    			t391 = space();
    			div143 = element("div");
    			div143.innerHTML = `<div class="square-root-two svelte-1qr3f7h"></div>`;
    			t392 = space();
    			div145 = element("div");
    			div145.innerHTML = `<div class="modulus svelte-1qr3f7h"></div>`;
    			t393 = space();
    			div147 = element("div");
    			div147.innerHTML = `<div class="square-brackets svelte-1qr3f7h"></div>`;
    			t394 = space();
    			div148 = element("div");
    			t395 = space();
    			div160 = element("div");
    			div154 = element("div");
    			button153 = element("button");
    			button153.textContent = "≠";
    			t397 = space();
    			button154 = element("button");
    			button154.textContent = "<";
    			t399 = space();
    			button155 = element("button");
    			button155.textContent = "≤";
    			t401 = space();
    			div152 = element("div");
    			div152.innerHTML = `<div class="not-greater svelte-1qr3f7h"></div>`;
    			t402 = space();
    			div153 = element("div");
    			t403 = space();
    			div158 = element("div");
    			button156 = element("button");
    			button156.textContent = "≈";
    			t405 = space();
    			button157 = element("button");
    			button157.textContent = ">";
    			t407 = space();
    			button158 = element("button");
    			button158.textContent = "≥";
    			t409 = space();
    			div156 = element("div");
    			div156.innerHTML = `<div class="not-lesser svelte-1qr3f7h"></div>`;
    			t410 = space();
    			div157 = element("div");
    			t411 = space();
    			div159 = element("div");
    			t412 = space();
    			div169 = element("div");
    			div163 = element("div");
    			button159 = element("button");
    			button159.textContent = "⊥";
    			t414 = space();
    			button160 = element("button");
    			button160.textContent = "∠";
    			t416 = space();
    			button161 = element("button");
    			button161.textContent = "Δ";
    			t418 = space();
    			button162 = element("button");
    			button162.textContent = "°";
    			t420 = space();
    			div162 = element("div");
    			div162.innerHTML = `<div class="bar-block svelte-1qr3f7h"></div>`;
    			t421 = space();
    			div166 = element("div");
    			button163 = element("button");
    			button163.textContent = "∥";
    			t423 = space();
    			button164 = element("button");
    			button164.textContent = "m∠";
    			t425 = space();
    			button165 = element("button");
    			button165.textContent = "⊙";
    			t427 = space();
    			button166 = element("button");
    			button166.textContent = "′";
    			t429 = space();
    			div165 = element("div");
    			div165.innerHTML = `<div class="topbar-arrow svelte-1qr3f7h"></div>`;
    			t430 = space();
    			div167 = element("div");
    			button167 = element("button");
    			button167.textContent = "∦";
    			t432 = space();
    			button168 = element("button");
    			button168.textContent = "∼";
    			t434 = space();
    			button169 = element("button");
    			button169.textContent = "▱";
    			t436 = space();
    			button170 = element("button");
    			button170.textContent = "″";
    			t438 = space();
    			button171 = element("button");
    			button171.textContent = "⋯";
    			t440 = space();
    			div168 = element("div");
    			button172 = element("button");
    			button172.textContent = "⋱";
    			t442 = space();
    			button173 = element("button");
    			button173.textContent = "≅";
    			t444 = space();
    			button174 = element("button");
    			button174.textContent = "⋮";
    			t446 = space();
    			button175 = element("button");
    			button175.textContent = "π";
    			t448 = space();
    			button176 = element("button");
    			button176.textContent = "□";
    			t450 = space();
    			div182 = element("div");
    			div172 = element("div");
    			button177 = element("button");
    			button177.textContent = "⊂";
    			t452 = space();
    			button178 = element("button");
    			button178.textContent = "∊";
    			t454 = space();
    			button179 = element("button");
    			button179.textContent = "∪";
    			t456 = space();
    			button180 = element("button");
    			button180.textContent = ",";
    			t458 = space();
    			div171 = element("div");
    			div171.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t459 = space();
    			div175 = element("div");
    			button181 = element("button");
    			button181.textContent = "⊃";
    			t461 = space();
    			button182 = element("button");
    			button182.textContent = "∉";
    			t463 = space();
    			button183 = element("button");
    			button183.textContent = "∩";
    			t465 = space();
    			button184 = element("button");
    			button184.textContent = ":";
    			t467 = space();
    			div174 = element("div");
    			div174.innerHTML = `<div class="curly-brackets svelte-1qr3f7h"></div>`;
    			t468 = space();
    			div178 = element("div");
    			button185 = element("button");
    			button185.textContent = "⊆";
    			t470 = space();
    			button186 = element("button");
    			button186.textContent = "∍";
    			t472 = space();
    			button187 = element("button");
    			button187.textContent = "∅";
    			t474 = space();
    			button188 = element("button");
    			button188.textContent = "!";
    			t476 = space();
    			div177 = element("div");
    			div177.innerHTML = `<div class="rec-brackets svelte-1qr3f7h"></div>`;
    			t477 = space();
    			div181 = element("div");
    			button189 = element("button");
    			button189.textContent = "⊇";
    			t479 = space();
    			button190 = element("button");
    			button190.textContent = "⊄";
    			t481 = space();
    			button191 = element("button");
    			t482 = space();
    			button192 = element("button");
    			button192.textContent = "\\";
    			t484 = space();
    			div180 = element("div");
    			div180.innerHTML = `<div class="opp-recbrackets svelte-1qr3f7h"></div>`;
    			t485 = space();
    			div187 = element("div");
    			div183 = element("div");
    			button193 = element("button");
    			button193.textContent = "sin";
    			t487 = space();
    			button194 = element("button");
    			button194.textContent = "cos";
    			t489 = space();
    			button195 = element("button");
    			button195.textContent = "tan";
    			t491 = space();
    			button196 = element("button");
    			t492 = space();
    			button197 = element("button");
    			t493 = space();
    			div184 = element("div");
    			button198 = element("button");
    			button198.textContent = "sec";
    			t495 = space();
    			button199 = element("button");
    			button199.textContent = "csc";
    			t497 = space();
    			button200 = element("button");
    			button200.textContent = "cot";
    			t499 = space();
    			button201 = element("button");
    			t500 = space();
    			button202 = element("button");
    			t501 = space();
    			div185 = element("div");
    			button203 = element("button");
    			button203.innerHTML = `sin<sup>-1</sup>`;
    			t504 = space();
    			button204 = element("button");
    			button204.innerHTML = `cos<sup>-1</sup>`;
    			t507 = space();
    			button205 = element("button");
    			button205.innerHTML = `tan<sup>-1</sup>`;
    			t510 = space();
    			button206 = element("button");
    			t511 = space();
    			button207 = element("button");
    			t512 = space();
    			div186 = element("div");
    			button208 = element("button");
    			button208.innerHTML = `sec<sup>-1</sup>`;
    			t515 = space();
    			button209 = element("button");
    			button209.innerHTML = `csc<sup>-1</sup>`;
    			t518 = space();
    			button210 = element("button");
    			button210.innerHTML = `cot<sup>-1</sup>`;
    			t521 = space();
    			button211 = element("button");
    			t522 = space();
    			button212 = element("button");
    			t523 = space();
    			div192 = element("div");
    			div188 = element("div");
    			button213 = element("button");
    			button213.textContent = "α";
    			t525 = space();
    			button214 = element("button");
    			button214.textContent = "θ";
    			t527 = space();
    			button215 = element("button");
    			button215.textContent = "Θ";
    			t529 = space();
    			button216 = element("button");
    			button216.textContent = "ζ";
    			t531 = space();
    			button217 = element("button");
    			t532 = space();
    			div189 = element("div");
    			button218 = element("button");
    			button218.textContent = "γ";
    			t534 = space();
    			button219 = element("button");
    			button219.textContent = "σ";
    			t536 = space();
    			button220 = element("button");
    			button220.textContent = "Σ";
    			t538 = space();
    			button221 = element("button");
    			button221.textContent = "ε";
    			t540 = space();
    			button222 = element("button");
    			t541 = space();
    			div190 = element("div");
    			button223 = element("button");
    			button223.textContent = "δ";
    			t543 = space();
    			button224 = element("button");
    			button224.textContent = "Δ";
    			t545 = space();
    			button225 = element("button");
    			button225.textContent = "λ";
    			t547 = space();
    			button226 = element("button");
    			button226.textContent = "β";
    			t549 = space();
    			button227 = element("button");
    			t550 = space();
    			div191 = element("div");
    			button228 = element("button");
    			button228.textContent = "π";
    			t552 = space();
    			button229 = element("button");
    			button229.textContent = "Π";
    			t554 = space();
    			button230 = element("button");
    			button230.textContent = "∅";
    			t556 = space();
    			button231 = element("button");
    			t557 = space();
    			button232 = element("button");
    			t558 = space();
    			div199 = element("div");
    			div193 = element("div");
    			button233 = element("button");
    			button233.textContent = "a";
    			t560 = space();
    			button234 = element("button");
    			button234.textContent = "|";
    			t562 = space();
    			button235 = element("button");
    			t563 = space();
    			button236 = element("button");
    			t564 = space();
    			button237 = element("button");
    			t565 = space();
    			div194 = element("div");
    			button238 = element("button");
    			button238.textContent = "b";
    			t567 = space();
    			button239 = element("button");
    			button239.textContent = ".";
    			t569 = space();
    			button240 = element("button");
    			t570 = space();
    			button241 = element("button");
    			t571 = space();
    			button242 = element("button");
    			t572 = space();
    			div197 = element("div");
    			button243 = element("button");
    			button243.textContent = "∝";
    			t574 = space();
    			div196 = element("div");
    			div196.innerHTML = `<div class="long-division svelte-1qr3f7h"></div>`;
    			t575 = space();
    			button244 = element("button");
    			t576 = space();
    			button245 = element("button");
    			t577 = space();
    			button246 = element("button");
    			t578 = space();
    			div198 = element("div");
    			button247 = element("button");
    			button247.textContent = "abc";
    			t580 = space();
    			button248 = element("button");
    			button248.textContent = "ℝ";
    			t582 = space();
    			button249 = element("button");
    			t583 = space();
    			button250 = element("button");
    			t584 = space();
    			button251 = element("button");
    			t585 = space();
    			div204 = element("div");
    			div200 = element("div");
    			button252 = element("button");
    			button252.textContent = "⌊";
    			t587 = space();
    			button253 = element("button");
    			button253.textContent = "↑";
    			t589 = space();
    			button254 = element("button");
    			button254.textContent = "¬";
    			t591 = space();
    			button255 = element("button");
    			t592 = space();
    			button256 = element("button");
    			t593 = space();
    			div201 = element("div");
    			button257 = element("button");
    			button257.textContent = "⌋";
    			t595 = space();
    			button258 = element("button");
    			button258.textContent = "≡";
    			t597 = space();
    			button259 = element("button");
    			button259.textContent = "∃";
    			t599 = space();
    			button260 = element("button");
    			t600 = space();
    			button261 = element("button");
    			t601 = space();
    			div202 = element("div");
    			button262 = element("button");
    			button262.textContent = "⌈";
    			t603 = space();
    			button263 = element("button");
    			button263.textContent = "∧";
    			t605 = space();
    			button264 = element("button");
    			button264.textContent = "∀";
    			t607 = space();
    			button265 = element("button");
    			t608 = space();
    			button266 = element("button");
    			t609 = space();
    			div203 = element("div");
    			button267 = element("button");
    			button267.textContent = "⌉";
    			t611 = space();
    			button268 = element("button");
    			button268.textContent = "∨";
    			t613 = space();
    			button269 = element("button");
    			button269.textContent = "⊕";
    			t615 = space();
    			button270 = element("button");
    			t616 = space();
    			button271 = element("button");
    			t617 = space();
    			div209 = element("div");
    			div205 = element("div");
    			button272 = element("button");
    			button272.textContent = "g";
    			t619 = space();
    			button273 = element("button");
    			button273.textContent = "m";
    			t621 = space();
    			button274 = element("button");
    			button274.textContent = "L";
    			t623 = space();
    			button275 = element("button");
    			button275.textContent = "s";
    			t625 = space();
    			button276 = element("button");
    			t626 = space();
    			div206 = element("div");
    			button277 = element("button");
    			button277.textContent = "kg";
    			t628 = space();
    			button278 = element("button");
    			button278.textContent = "km";
    			t630 = space();
    			button279 = element("button");
    			button279.textContent = "mL";
    			t632 = space();
    			button280 = element("button");
    			button280.textContent = "ms";
    			t634 = space();
    			button281 = element("button");
    			t635 = space();
    			div207 = element("div");
    			button282 = element("button");
    			button282.textContent = "mg";
    			t637 = space();
    			button283 = element("button");
    			button283.textContent = "cm";
    			t639 = space();
    			button284 = element("button");
    			t640 = space();
    			button285 = element("button");
    			t641 = space();
    			button286 = element("button");
    			t642 = space();
    			div208 = element("div");
    			button287 = element("button");
    			button287.textContent = "µg";
    			t644 = space();
    			button288 = element("button");
    			button288.textContent = "mm";
    			t646 = space();
    			button289 = element("button");
    			t647 = space();
    			button290 = element("button");
    			t648 = space();
    			button291 = element("button");
    			t649 = space();
    			div213 = element("div");
    			div210 = element("div");
    			button292 = element("button");
    			button292.textContent = "oz";
    			t651 = space();
    			button293 = element("button");
    			button293.textContent = "in";
    			t653 = space();
    			button294 = element("button");
    			button294.textContent = "fl oz";
    			t655 = space();
    			button295 = element("button");
    			t656 = space();
    			button296 = element("button");
    			t657 = space();
    			div211 = element("div");
    			button297 = element("button");
    			button297.textContent = "lb";
    			t659 = space();
    			button298 = element("button");
    			button298.textContent = "ft";
    			t661 = space();
    			button299 = element("button");
    			button299.textContent = "pt";
    			t663 = space();
    			button300 = element("button");
    			t664 = space();
    			button301 = element("button");
    			t665 = space();
    			div212 = element("div");
    			button302 = element("button");
    			t666 = space();
    			button303 = element("button");
    			button303.textContent = "mi";
    			t668 = space();
    			button304 = element("button");
    			button304.textContent = "gal";
    			t670 = space();
    			button305 = element("button");
    			t671 = space();
    			button306 = element("button");
    			t672 = space();
    			div223 = element("div");
    			div216 = element("div");
    			div215 = element("div");
    			div215.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t673 = space();
    			button307 = element("button");
    			t674 = space();
    			button308 = element("button");
    			t675 = space();
    			button309 = element("button");
    			t676 = space();
    			button310 = element("button");
    			t677 = space();
    			div219 = element("div");
    			div218 = element("div");
    			div218.innerHTML = `<div class="square-brackets svelte-1qr3f7h"></div>`;
    			t678 = space();
    			button311 = element("button");
    			t679 = space();
    			button312 = element("button");
    			t680 = space();
    			button313 = element("button");
    			t681 = space();
    			button314 = element("button");
    			t682 = space();
    			div222 = element("div");
    			div221 = element("div");
    			div221.innerHTML = `<div class="curly-brackets svelte-1qr3f7h"></div>`;
    			t683 = space();
    			button315 = element("button");
    			t684 = space();
    			button316 = element("button");
    			t685 = space();
    			button317 = element("button");
    			t686 = space();
    			button318 = element("button");
    			t687 = space();
    			div236 = element("div");
    			div226 = element("div");
    			button319 = element("button");
    			button319.textContent = "d";
    			t689 = space();
    			div225 = element("div");
    			div225.innerHTML = `<div class="brackets svelte-1qr3f7h"></div>`;
    			t690 = space();
    			button320 = element("button");
    			t691 = space();
    			button321 = element("button");
    			t692 = space();
    			button322 = element("button");
    			t693 = space();
    			div229 = element("div");
    			button323 = element("button");
    			button323.textContent = "f";
    			t695 = space();
    			div228 = element("div");
    			div228.innerHTML = `<div class="integrtion svelte-1qr3f7h"></div>`;
    			t696 = space();
    			button324 = element("button");
    			t697 = space();
    			button325 = element("button");
    			t698 = space();
    			button326 = element("button");
    			t699 = space();
    			div232 = element("div");
    			button327 = element("button");
    			button327.textContent = "Δ";
    			t701 = space();
    			div231 = element("div");
    			div231.innerHTML = `<div class="sigma svelte-1qr3f7h"></div>`;
    			t702 = space();
    			button328 = element("button");
    			t703 = space();
    			button329 = element("button");
    			t704 = space();
    			button330 = element("button");
    			t705 = space();
    			div235 = element("div");
    			div234 = element("div");
    			div234.innerHTML = `<div class="x-button"></div>`;
    			t706 = space();
    			button331 = element("button");
    			button331.textContent = "∂";
    			t708 = space();
    			button332 = element("button");
    			t709 = space();
    			button333 = element("button");
    			t710 = space();
    			button334 = element("button");
    			t711 = space();
    			div253 = element("div");
    			div241 = element("div");
    			div238 = element("div");
    			div238.innerHTML = `<div class="h-sup svelte-1qr3f7h"></div>`;
    			t712 = space();
    			button335 = element("button");
    			button335.textContent = "→";
    			t714 = space();
    			div240 = element("div");
    			div240.innerHTML = `<div class="x-power-y svelte-1qr3f7h"></div>`;
    			t715 = space();
    			button336 = element("button");
    			t716 = space();
    			button337 = element("button");
    			t717 = space();
    			div244 = element("div");
    			div243 = element("div");
    			div243.innerHTML = `<div class="h-sub svelte-1qr3f7h"></div>`;
    			t718 = space();
    			button338 = element("button");
    			button338.textContent = "←";
    			t720 = space();
    			button339 = element("button");
    			button339.textContent = "mol";
    			t722 = space();
    			button340 = element("button");
    			t723 = space();
    			button341 = element("button");
    			t724 = space();
    			div247 = element("div");
    			div246 = element("div");
    			div246.innerHTML = `<div class="h-sup-sub svelte-1qr3f7h"></div>`;
    			t725 = space();
    			button342 = element("button");
    			button342.textContent = "⇌";
    			t727 = space();
    			button343 = element("button");
    			button343.textContent = "'";
    			t729 = space();
    			button344 = element("button");
    			t730 = space();
    			button345 = element("button");
    			t731 = space();
    			div252 = element("div");
    			div249 = element("div");
    			div249.innerHTML = `<div class="h-power svelte-1qr3f7h"></div>`;
    			t732 = space();
    			button346 = element("button");
    			button346.textContent = "↔";
    			t734 = space();
    			div251 = element("div");
    			div251.innerHTML = `<div class="h-bar svelte-1qr3f7h"></div>`;
    			t735 = space();
    			button347 = element("button");
    			t736 = space();
    			button348 = element("button");
    			attr(div1, "class", "draggable_area svelte-1qr3f7h");
    			attr(div2, "class", "upper_part_toolbar");
    			option0.__value = "1";
    			option0.value = option0.__value;
    			option1.__value = "2";
    			option1.value = option1.__value;
    			option1.selected = "selected";
    			option2.__value = "3";
    			option2.value = option2.__value;
    			option3.__value = "4";
    			option3.value = option3.__value;
    			option4.__value = "5";
    			option4.value = option4.__value;
    			option5.__value = "6";
    			option5.value = option5.__value;
    			option6.__value = "7";
    			option6.value = option6.__value;
    			option7.__value = "8";
    			option7.value = option7.__value;
    			option8.__value = "9";
    			option8.value = option8.__value;
    			option9.__value = "10";
    			option9.value = option9.__value;
    			option10.__value = "11";
    			option10.value = option10.__value;
    			option11.__value = "12";
    			option11.value = option11.__value;
    			option12.__value = "13";
    			option12.value = option12.__value;
    			option13.__value = "14";
    			option13.value = option13.__value;
    			option14.__value = "15";
    			option14.value = option14.__value;
    			attr(select, "name", "basic_select");
    			attr(select, "id", "selectbox");
    			attr(select, "class", "option_selectbox svelte-1qr3f7h");
    			attr(div3, "class", "select_area svelte-1qr3f7h");
    			attr(div4, "class", "show_text_area svelte-1qr3f7h");
    			attr(div5, "class", "toolbar_types_area svelte-1qr3f7h");
    			attr(button1, "type", "button");
    			attr(button1, "class", "first_btn bborder_remover orange_container svelte-1qr3f7h");
    			attr(button2, "type", "button");
    			attr(button2, "class", "scnd_btn orange_container svelte-1qr3f7h");
    			attr(button3, "type", "button");
    			attr(button3, "class", "thrd_btn bborder_remover orange_container svelte-1qr3f7h");
    			attr(button4, "type", "button");
    			attr(button4, "class", "fourth_btn orange_container svelte-1qr3f7h");
    			attr(button5, "type", "button");
    			attr(button5, "class", "fifth_btn bborder_remover light_purpl_container svelte-1qr3f7h");
    			attr(div6, "class", "column_one columns_design svelte-1qr3f7h");
    			attr(button6, "type", "button");
    			attr(button6, "class", "first_btn bborder_remover orange_container svelte-1qr3f7h");
    			attr(button7, "type", "button");
    			attr(button7, "class", "scnd_btn orange_container svelte-1qr3f7h");
    			attr(button8, "type", "button");
    			attr(button8, "class", "thrd_btn bborder_remover orange_container svelte-1qr3f7h");
    			attr(button9, "type", "button");
    			attr(button9, "class", "fourth_btn orange_container svelte-1qr3f7h");
    			attr(button10, "type", "button");
    			attr(button10, "class", "fifth_btn bborder_remover light_purpl_container svelte-1qr3f7h");
    			attr(div7, "class", "column_two columns_design svelte-1qr3f7h");
    			attr(button11, "type", "button");
    			attr(button11, "class", "first_btn bborder_remover orange_container svelte-1qr3f7h");
    			attr(button12, "type", "button");
    			attr(button12, "class", "scnd_btn orange_container svelte-1qr3f7h");
    			attr(button13, "type", "button");
    			attr(button13, "class", "thrd_btn bborder_remover orange_container svelte-1qr3f7h");
    			attr(button14, "type", "button");
    			attr(button14, "class", "fourth_btn orange_container svelte-1qr3f7h");
    			attr(button15, "type", "button");
    			attr(button15, "class", "fifth_btn bborder_remover light_purpl_container svelte-1qr3f7h");
    			attr(div8, "class", "column_three columns_design svelte-1qr3f7h");
    			attr(button16, "type", "button");
    			attr(button16, "class", "first_btn bborder_remover hovr_btn svelte-1qr3f7h");
    			attr(button17, "type", "button");
    			attr(button17, "class", "scnd_btn hovr_btn svelte-1qr3f7h");
    			attr(button18, "type", "button");
    			attr(button18, "class", "thrd_btn bborder_remover hovr_btn svelte-1qr3f7h");
    			attr(button19, "type", "button");
    			attr(button19, "class", "fourth_btn hovr_btn svelte-1qr3f7h");
    			attr(button20, "type", "button");
    			attr(button20, "class", "fifth_btn bborder_remover hovr_btn svelte-1qr3f7h");
    			attr(div9, "class", "column_four columns_design svelte-1qr3f7h");
    			attr(div10, "class", "btn-group button_designs font_changer svelte-1qr3f7h");
    			attr(div12, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button21, "type", "button");
    			attr(button21, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button22, "type", "button");
    			attr(button22, "class", "thrd_btn bborder_remover dec_widther bborder_adder blue_container svelte-1qr3f7h");
    			attr(button23, "type", "button");
    			attr(button23, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button24, "type", "button");
    			attr(button24, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button25, "type", "button");
    			attr(button25, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button26, "type", "button");
    			attr(button26, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div14, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div16, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div18, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div20, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1qr3f7h");
    			attr(button27, "type", "button");
    			attr(button27, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button28, "type", "button");
    			attr(button28, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div22, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div24, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1qr3f7h");
    			attr(button29, "type", "button");
    			attr(button29, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div26, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div28, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(div30, "class", "scnd_btn dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(button30, "type", "button");
    			attr(button30, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div32, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div34, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div36, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(div38, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div40, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button31, "type", "button");
    			attr(button31, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button32, "type", "button");
    			attr(button32, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button33, "type", "button");
    			attr(button33, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button34, "type", "button");
    			attr(button34, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button35, "type", "button");
    			attr(button35, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button36, "type", "button");
    			attr(button36, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button37, "type", "button");
    			attr(button37, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button38, "type", "button");
    			attr(button38, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div42, "class", "first_btn bborder_remover dec_widther padder_remover blue_container svelte-1qr3f7h");
    			attr(button39, "type", "button");
    			attr(button39, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div44, "class", "first_btn bborder_remover dec_widther blue_container padder_btn svelte-1qr3f7h");
    			attr(button40, "type", "button");
    			attr(button40, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button41, "type", "button");
    			attr(button41, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button42, "type", "button");
    			attr(button42, "class", "scnd_btn dec_widther bborder_remover blue_container svelte-1qr3f7h");
    			attr(div45, "class", "column_five dec_widther blue_container columns_design svelte-1qr3f7h");
    			attr(div47, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div49, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1qr3f7h");
    			attr(button43, "type", "button");
    			attr(button43, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button44, "type", "button");
    			attr(button44, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button45, "type", "button");
    			attr(button45, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button46, "type", "button");
    			attr(button46, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button47, "type", "button");
    			attr(button47, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button48, "type", "button");
    			attr(button48, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div51, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button49, "type", "button");
    			attr(button49, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button50, "type", "button");
    			attr(button50, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button51, "type", "button");
    			attr(button51, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div53, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button52, "type", "button");
    			attr(button52, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button53, "type", "button");
    			attr(button53, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button54, "type", "button");
    			attr(button54, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button55, "type", "button");
    			attr(button55, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div55, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(button56, "type", "button");
    			attr(button56, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button57, "type", "button");
    			attr(button57, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button58, "type", "button");
    			attr(button58, "class", "thrd_btn bborder_remover dec_widther blue_container bborder_adder svelte-1qr3f7h");
    			attr(button59, "type", "button");
    			attr(button59, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div57, "class", "fourth_btn dec_widther padder_remover blue_container svelte-1qr3f7h");
    			attr(button60, "type", "button");
    			attr(button60, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button61, "type", "button");
    			attr(button61, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button62, "type", "button");
    			attr(button62, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button63, "type", "button");
    			attr(button63, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button64, "type", "button");
    			attr(button64, "class", "first_btn bborder_remover dec_widther padder_remover blue_container svelte-1qr3f7h");
    			attr(button65, "type", "button");
    			attr(button65, "class", "scnd_btn dec_widther blue_container blue_container padder_less svelte-1qr3f7h");
    			attr(button66, "type", "button");
    			attr(button66, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button67, "type", "button");
    			attr(button67, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button68, "type", "button");
    			attr(button68, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button69, "type", "button");
    			attr(button69, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button70, "type", "button");
    			attr(button70, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button71, "type", "button");
    			attr(button71, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button72, "type", "button");
    			attr(button72, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button73, "type", "button");
    			attr(button73, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button74, "type", "button");
    			attr(button74, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button75, "type", "button");
    			attr(button75, "class", "scnd_btn dec_widther bborder_remover blue_container svelte-1qr3f7h");
    			attr(div58, "class", "column_six dec_widther blue_container columns_design svelte-1qr3f7h");
    			attr(div60, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(div62, "class", "scnd_btn dec_widther blue_container padder_remover svelte-1qr3f7h");
    			attr(button76, "type", "button");
    			attr(button76, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div64, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(div66, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button77, "type", "button");
    			attr(button77, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button78, "type", "button");
    			attr(button78, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button79, "type", "button");
    			attr(button79, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button80, "type", "button");
    			attr(button80, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div68, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(button81, "type", "button");
    			attr(button81, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button82, "type", "button");
    			attr(button82, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button83, "type", "button");
    			attr(button83, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button84, "type", "button");
    			attr(button84, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div70, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(button85, "type", "button");
    			attr(button85, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button86, "type", "button");
    			attr(button86, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button87, "type", "button");
    			attr(button87, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button88, "type", "button");
    			attr(button88, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div72, "class", "fourth_btn dec_widther padder_less blue_container svelte-1qr3f7h");
    			attr(button89, "type", "button");
    			attr(button89, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button90, "type", "button");
    			attr(button90, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button91, "type", "button");
    			attr(button91, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button92, "type", "button");
    			attr(button92, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button93, "type", "button");
    			attr(button93, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button94, "type", "button");
    			attr(button94, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button95, "type", "button");
    			attr(button95, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button96, "type", "button");
    			attr(button96, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button97, "type", "button");
    			attr(button97, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button98, "type", "button");
    			attr(button98, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button99, "type", "button");
    			attr(button99, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button100, "type", "button");
    			attr(button100, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button101, "type", "button");
    			attr(button101, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button102, "type", "button");
    			attr(button102, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div74, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(button103, "type", "button");
    			attr(button103, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(div76, "class", "thrd_btn bborder_remover dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(button104, "type", "button");
    			attr(button104, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button105, "type", "button");
    			attr(button105, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div77, "class", "column_seven dec_widther blue_container columns_design svelte-1qr3f7h");
    			attr(div79, "class", "first_btn bborder_remover dec_widther blue_container padder_field svelte-1qr3f7h");
    			attr(div81, "class", "scnd_btn dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(div83, "class", "thrd_btn bborder_remover dec_widther blue_container padder_less svelte-1qr3f7h");
    			attr(div85, "class", "fourth_btn dec_widther blue_container padder_field svelte-1qr3f7h");
    			attr(button106, "type", "button");
    			attr(button106, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button107, "type", "button");
    			attr(button107, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button108, "type", "button");
    			attr(button108, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button109, "type", "button");
    			attr(button109, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button110, "type", "button");
    			attr(button110, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button111, "type", "button");
    			attr(button111, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button112, "type", "button");
    			attr(button112, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button113, "type", "button");
    			attr(button113, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button114, "type", "button");
    			attr(button114, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button115, "type", "button");
    			attr(button115, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button116, "type", "button");
    			attr(button116, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button117, "type", "button");
    			attr(button117, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button118, "type", "button");
    			attr(button118, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button119, "type", "button");
    			attr(button119, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button120, "type", "button");
    			attr(button120, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button121, "type", "button");
    			attr(button121, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button122, "type", "button");
    			attr(button122, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button123, "type", "button");
    			attr(button123, "class", "fourth_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button124, "type", "button");
    			attr(button124, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button125, "type", "button");
    			attr(button125, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button126, "type", "button");
    			attr(button126, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button127, "type", "button");
    			attr(button127, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button128, "type", "button");
    			attr(button128, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button129, "type", "button");
    			attr(button129, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button130, "type", "button");
    			attr(button130, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button131, "type", "button");
    			attr(button131, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button132, "type", "button");
    			attr(button132, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button133, "type", "button");
    			attr(button133, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button134, "type", "button");
    			attr(button134, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button135, "type", "button");
    			attr(button135, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button136, "type", "button");
    			attr(button136, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button137, "type", "button");
    			attr(button137, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button138, "type", "button");
    			attr(button138, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(button139, "type", "button");
    			attr(button139, "class", "scnd_btn dec_widther blue_container svelte-1qr3f7h");
    			attr(button140, "type", "button");
    			attr(button140, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qr3f7h");
    			attr(div86, "class", "column_eight dec_widther columns_design blue_container svelte-1qr3f7h");
    			attr(div87, "class", "button_designs select_changer height_modifier svelte-1qr3f7h");
    			attr(div87, "id", "select_butns_1");
    			attr(div89, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(div91, "class", "blue_container scnd_btn padder_btn svelte-1qr3f7h");
    			attr(button141, "type", "button");
    			attr(button141, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button142, "type", "button");
    			attr(button142, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div93, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div94, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(div96, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(div98, "class", "scnd_btn padder_btn blue_container svelte-1qr3f7h");
    			attr(button143, "type", "button");
    			attr(button143, "class", "thrd_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button144, "type", "button");
    			attr(button144, "class", "fourth_btn blue_container svelte-1qr3f7h");
    			attr(button145, "type", "button");
    			attr(button145, "class", "fifth_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(div99, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(div101, "class", "blue_container first_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div103, "class", "blue_container scnd_btn padder_remover svelte-1qr3f7h");
    			attr(button146, "type", "button");
    			attr(button146, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(div105, "class", "blue_container fourth_btn padder_less svelte-1qr3f7h");
    			attr(div107, "class", "blue_container fifth_btn bborder_remover svelte-1qr3f7h");
    			attr(div108, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(div110, "class", "blue_container first_btn bborder_remover blue_container padder_field svelte-1qr3f7h");
    			attr(div112, "class", "blue_container scnd_btn blue_container padder_less svelte-1qr3f7h");
    			attr(div114, "class", "blue_container thrd_btn bborder_remover blue_container padder_less svelte-1qr3f7h");
    			attr(div116, "class", "blue_container fourth_btn blue_container padder_field svelte-1qr3f7h");
    			attr(button147, "type", "button");
    			attr(button147, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div117, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div118, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div118, "id", "select_butns_2");
    			attr(div120, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(div122, "class", "blue_container scnd_btn padder_btn svelte-1qr3f7h");
    			attr(button148, "type", "button");
    			attr(button148, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button149, "type", "button");
    			attr(button149, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button150, "type", "button");
    			attr(button150, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div123, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(div125, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(div127, "class", "blue_container scnd_btn padder_btn svelte-1qr3f7h");
    			attr(button151, "type", "button");
    			attr(button151, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(div129, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div130, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div131, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(div133, "class", "blue_container first_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div135, "class", "blue_container scnd_btn padder_less svelte-1qr3f7h");
    			attr(button152, "type", "button");
    			attr(button152, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(div137, "class", "blue_container fourth_btn padder_less svelte-1qr3f7h");
    			attr(div138, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div139, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(div141, "class", "first_btn bborder_remover blue_container padder_field svelte-1qr3f7h");
    			attr(div143, "class", "scnd_btn blue_container padder_remover svelte-1qr3f7h");
    			attr(div145, "class", "thrd_btn bborder_remover blue_container padder_less svelte-1qr3f7h");
    			attr(div147, "class", "fourth_btn blue_container padder_less svelte-1qr3f7h");
    			attr(div148, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div149, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div150, "class", "btn-group button_designs select_changer svelte-1qr3f7h");
    			attr(div150, "id", "select_butns_3");
    			attr(button153, "type", "button");
    			attr(button153, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button154, "type", "button");
    			attr(button154, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button155, "type", "button");
    			attr(button155, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(div152, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div153, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div154, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button156, "type", "button");
    			attr(button156, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button157, "type", "button");
    			attr(button157, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button158, "type", "button");
    			attr(button158, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(div156, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div157, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div158, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(div159, "class", "remove_border svelte-1qr3f7h");
    			attr(div160, "class", "btn-group button_designs select_changer svelte-1qr3f7h");
    			attr(div160, "id", "select_butns_4");
    			attr(button159, "type", "button");
    			attr(button159, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button160, "type", "button");
    			attr(button160, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button161, "type", "button");
    			attr(button161, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button162, "type", "button");
    			attr(button162, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div162, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div163, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button163, "type", "button");
    			attr(button163, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button164, "type", "button");
    			attr(button164, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button165, "type", "button");
    			attr(button165, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button166, "type", "button");
    			attr(button166, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div165, "class", "blue_container fifth_btn bborder_remover padder_remover svelte-1qr3f7h");
    			attr(div166, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button167, "type", "button");
    			attr(button167, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button168, "type", "button");
    			attr(button168, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button169, "type", "button");
    			attr(button169, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button170, "type", "button");
    			attr(button170, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button171, "type", "button");
    			attr(button171, "class", "blue_container fifth_btn bborder_remover padder_remover svelte-1qr3f7h");
    			attr(div167, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button172, "type", "button");
    			attr(button172, "class", "first_btn bborder_remover blue_container padder_less svelte-1qr3f7h");
    			attr(button173, "type", "button");
    			attr(button173, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button174, "type", "button");
    			attr(button174, "class", "thrd_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button175, "type", "button");
    			attr(button175, "class", "fourth_btn blue_container svelte-1qr3f7h");
    			attr(button176, "type", "button");
    			attr(button176, "class", "fifth_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(div168, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div169, "class", "btn-group button_designs select_changer svelte-1qr3f7h");
    			attr(div169, "id", "select_butns_5");
    			attr(button177, "type", "button");
    			attr(button177, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button178, "type", "button");
    			attr(button178, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button179, "type", "button");
    			attr(button179, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button180, "type", "button");
    			attr(button180, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div171, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div172, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button181, "type", "button");
    			attr(button181, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button182, "type", "button");
    			attr(button182, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button183, "type", "button");
    			attr(button183, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button184, "type", "button");
    			attr(button184, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div174, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div175, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button185, "type", "button");
    			attr(button185, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button186, "type", "button");
    			attr(button186, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button187, "type", "button");
    			attr(button187, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button188, "type", "button");
    			attr(button188, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(div177, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(div178, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button189, "type", "button");
    			attr(button189, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button190, "type", "button");
    			attr(button190, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button191, "type", "button");
    			attr(button191, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button192, "type", "button");
    			attr(button192, "class", "fourth_btn blue_container svelte-1qr3f7h");
    			attr(div180, "class", "thrd_btn bborder_remover blue_container padder_less svelte-1qr3f7h");
    			attr(div181, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div182, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div182, "id", "select_butns_6");
    			attr(button193, "type", "button");
    			attr(button193, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button194, "type", "button");
    			attr(button194, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button195, "type", "button");
    			attr(button195, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button196, "type", "button");
    			attr(button196, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button197, "type", "button");
    			attr(button197, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div183, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button198, "type", "button");
    			attr(button198, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button199, "type", "button");
    			attr(button199, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button200, "type", "button");
    			attr(button200, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button201, "type", "button");
    			attr(button201, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button202, "type", "button");
    			attr(button202, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div184, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button203, "type", "button");
    			attr(button203, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button204, "type", "button");
    			attr(button204, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button205, "type", "button");
    			attr(button205, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button206, "type", "button");
    			attr(button206, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button207, "type", "button");
    			attr(button207, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div185, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button208, "type", "button");
    			attr(button208, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button209, "type", "button");
    			attr(button209, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button210, "type", "button");
    			attr(button210, "class", "thrd_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button211, "type", "button");
    			attr(button211, "class", "fourth_btn blue_container bborder_remover blank_color svelte-1qr3f7h");
    			attr(button212, "type", "button");
    			attr(button212, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div186, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div187, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div187, "id", "select_butns_7");
    			attr(button213, "type", "button");
    			attr(button213, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button214, "type", "button");
    			attr(button214, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button215, "type", "button");
    			attr(button215, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button216, "type", "button");
    			attr(button216, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button217, "type", "button");
    			attr(button217, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div188, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button218, "type", "button");
    			attr(button218, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button219, "type", "button");
    			attr(button219, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button220, "type", "button");
    			attr(button220, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button221, "type", "button");
    			attr(button221, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button222, "type", "button");
    			attr(button222, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div189, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button223, "type", "button");
    			attr(button223, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button224, "type", "button");
    			attr(button224, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button225, "type", "button");
    			attr(button225, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button226, "type", "button");
    			attr(button226, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button227, "type", "button");
    			attr(button227, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div190, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button228, "type", "button");
    			attr(button228, "class", "blue_container first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button229, "type", "button");
    			attr(button229, "class", "blue_container scnd_btn blue_container svelte-1qr3f7h");
    			attr(button230, "type", "button");
    			attr(button230, "class", "blue_container thrd_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button231, "type", "button");
    			attr(button231, "class", "blue_container fourth_btn blue_container bborder_remover blank_color svelte-1qr3f7h");
    			attr(button232, "type", "button");
    			attr(button232, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div191, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div192, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div192, "id", "select_butns_8");
    			attr(button233, "type", "button");
    			attr(button233, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button234, "type", "button");
    			attr(button234, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button235, "type", "button");
    			attr(button235, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button236, "type", "button");
    			attr(button236, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button237, "type", "button");
    			attr(button237, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div193, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button238, "type", "button");
    			attr(button238, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button239, "type", "button");
    			attr(button239, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button240, "type", "button");
    			attr(button240, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button241, "type", "button");
    			attr(button241, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button242, "type", "button");
    			attr(button242, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div194, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button243, "type", "button");
    			attr(button243, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(div196, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button244, "type", "button");
    			attr(button244, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button245, "type", "button");
    			attr(button245, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button246, "type", "button");
    			attr(button246, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div197, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button247, "type", "button");
    			attr(button247, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button248, "type", "button");
    			attr(button248, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button249, "type", "button");
    			attr(button249, "class", "thrd_btn bborder_remover blue_container bborder_remover blank_color svelte-1qr3f7h");
    			attr(button250, "type", "button");
    			attr(button250, "class", "fourth_btn blue_container tborder_remover bborder_remover blank_color svelte-1qr3f7h");
    			attr(button251, "type", "button");
    			attr(button251, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div198, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div199, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div199, "id", "select_butns_9");
    			attr(button252, "type", "button");
    			attr(button252, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button253, "type", "button");
    			attr(button253, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button254, "type", "button");
    			attr(button254, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button255, "type", "button");
    			attr(button255, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1qr3f7h");
    			attr(button256, "type", "button");
    			attr(button256, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div200, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button257, "type", "button");
    			attr(button257, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button258, "type", "button");
    			attr(button258, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button259, "type", "button");
    			attr(button259, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button260, "type", "button");
    			attr(button260, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1qr3f7h");
    			attr(button261, "type", "button");
    			attr(button261, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div201, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button262, "type", "button");
    			attr(button262, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button263, "type", "button");
    			attr(button263, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button264, "type", "button");
    			attr(button264, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button265, "type", "button");
    			attr(button265, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1qr3f7h");
    			attr(button266, "type", "button");
    			attr(button266, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div202, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button267, "type", "button");
    			attr(button267, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button268, "type", "button");
    			attr(button268, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button269, "type", "button");
    			attr(button269, "class", "thrd_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button270, "type", "button");
    			attr(button270, "class", "fourth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button271, "type", "button");
    			attr(button271, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div203, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div204, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div204, "id", "select_butns_10");
    			attr(button272, "type", "button");
    			attr(button272, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button273, "type", "button");
    			attr(button273, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button274, "type", "button");
    			attr(button274, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button275, "type", "button");
    			attr(button275, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button276, "type", "button");
    			attr(button276, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div205, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button277, "type", "button");
    			attr(button277, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button278, "type", "button");
    			attr(button278, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button279, "type", "button");
    			attr(button279, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button280, "type", "button");
    			attr(button280, "class", "blue_container fourth_btn svelte-1qr3f7h");
    			attr(button281, "type", "button");
    			attr(button281, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div206, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button282, "type", "button");
    			attr(button282, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button283, "type", "button");
    			attr(button283, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button284, "type", "button");
    			attr(button284, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button285, "type", "button");
    			attr(button285, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(button286, "type", "button");
    			attr(button286, "class", "fifth_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qr3f7h");
    			attr(div207, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(button287, "type", "button");
    			attr(button287, "class", "first_btn bborder_remover blue_container svelte-1qr3f7h");
    			attr(button288, "type", "button");
    			attr(button288, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button289, "type", "button");
    			attr(button289, "class", "thrd_btn bborder_remover bborder_remover blank_color svelte-1qr3f7h");
    			attr(button290, "type", "button");
    			attr(button290, "class", "fourth_btn bborder_remover tborder_remover blank_color svelte-1qr3f7h");
    			attr(button291, "type", "button");
    			attr(button291, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div208, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div209, "class", "btn-group button_designs select_changer svelte-1qr3f7h");
    			attr(div209, "id", "select_butns_11");
    			attr(button292, "type", "button");
    			attr(button292, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button293, "type", "button");
    			attr(button293, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button294, "type", "button");
    			attr(button294, "class", "blue_container thrd_btn bborder_remover  svelte-1qr3f7h");
    			attr(button295, "type", "button");
    			attr(button295, "class", "fourth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button296, "type", "button");
    			attr(button296, "class", "fifth_btn bborder_remover bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div210, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button297, "type", "button");
    			attr(button297, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button298, "type", "button");
    			attr(button298, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button299, "type", "button");
    			attr(button299, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button300, "type", "button");
    			attr(button300, "class", "fourth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button301, "type", "button");
    			attr(button301, "class", "fifth_btn bborder_remover bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div211, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button302, "type", "button");
    			attr(button302, "class", "first_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button303, "type", "button");
    			attr(button303, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button304, "type", "button");
    			attr(button304, "class", "blue_container thrd_btn bborder_remover svelte-1qr3f7h");
    			attr(button305, "type", "button");
    			attr(button305, "class", "fourth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button306, "type", "button");
    			attr(button306, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div212, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(div213, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div213, "id", "select_butns_12");
    			attr(div215, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1qr3f7h");
    			attr(button307, "type", "button");
    			attr(button307, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button308, "type", "button");
    			attr(button308, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button309, "type", "button");
    			attr(button309, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button310, "type", "button");
    			attr(button310, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div216, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(div218, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1qr3f7h");
    			attr(button311, "type", "button");
    			attr(button311, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button312, "type", "button");
    			attr(button312, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button313, "type", "button");
    			attr(button313, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button314, "type", "button");
    			attr(button314, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div219, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(div221, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1qr3f7h");
    			attr(button315, "type", "button");
    			attr(button315, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button316, "type", "button");
    			attr(button316, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button317, "type", "button");
    			attr(button317, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button318, "type", "button");
    			attr(button318, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div222, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(div223, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div223, "id", "select_butns_13");
    			attr(button319, "type", "button");
    			attr(button319, "class", "first_btn blue_container bborder_remover svelte-1qr3f7h");
    			attr(div225, "class", "scnd_btn blue_container padder_remover svelte-1qr3f7h");
    			attr(button320, "type", "button");
    			attr(button320, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(button321, "type", "button");
    			attr(button321, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(button322, "type", "button");
    			attr(button322, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div226, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(button323, "type", "button");
    			attr(button323, "class", "first_btn blue_container bborder_remover svelte-1qr3f7h");
    			attr(div228, "class", "scnd_btn blue_container padder_remover svelte-1qr3f7h");
    			attr(button324, "type", "button");
    			attr(button324, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(button325, "type", "button");
    			attr(button325, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(button326, "type", "button");
    			attr(button326, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div229, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(button327, "type", "button");
    			attr(button327, "class", "first_btn blue_container bborder_remover svelte-1qr3f7h");
    			attr(div231, "class", "scnd_btn blue_container padder_btn svelte-1qr3f7h");
    			attr(button328, "type", "button");
    			attr(button328, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(button329, "type", "button");
    			attr(button329, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(button330, "type", "button");
    			attr(button330, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qr3f7h");
    			attr(div232, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(div234, "class", "first_btn bborder_remover padder_remover blue_container svelte-1qr3f7h");
    			attr(button331, "type", "button");
    			attr(button331, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(button332, "type", "button");
    			attr(button332, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button333, "type", "button");
    			attr(button333, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button334, "type", "button");
    			attr(button334, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div235, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div236, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div236, "id", "select_butns_14");
    			attr(div238, "class", "blue_container first_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(button335, "type", "button");
    			attr(button335, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(div240, "class", "thrd_btn bborder_remover blue_container bborder_adder padder_less svelte-1qr3f7h");
    			attr(button336, "type", "button");
    			attr(button336, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button337, "type", "button");
    			attr(button337, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div241, "class", "column_five blue_container columns_design svelte-1qr3f7h");
    			attr(div243, "class", "blue_container first_btn bborder_remover svelte-1qr3f7h");
    			attr(button338, "type", "button");
    			attr(button338, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button339, "type", "button");
    			attr(button339, "class", "blue_container thrd_btn bborder_remover bborder_adder svelte-1qr3f7h");
    			attr(button340, "type", "button");
    			attr(button340, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button341, "type", "button");
    			attr(button341, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div244, "class", "column_six blue_container columns_design svelte-1qr3f7h");
    			attr(div246, "class", "blue_container first_btn bborder_remover padder_less svelte-1qr3f7h");
    			attr(button342, "type", "button");
    			attr(button342, "class", "blue_container scnd_btn svelte-1qr3f7h");
    			attr(button343, "type", "button");
    			attr(button343, "class", "thrd_btn bborder_remover blue_container bborder_adder svelte-1qr3f7h");
    			attr(button344, "type", "button");
    			attr(button344, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(button345, "type", "button");
    			attr(button345, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qr3f7h");
    			attr(div247, "class", "column_seven blue_container columns_design svelte-1qr3f7h");
    			attr(div249, "class", "first_btn bborder_remover padder_less blue_container svelte-1qr3f7h");
    			attr(button346, "type", "button");
    			attr(button346, "class", "scnd_btn blue_container svelte-1qr3f7h");
    			attr(div251, "class", "thrd_btn bborder_remover padder_less bborder_adder blue_container svelte-1qr3f7h");
    			attr(button347, "type", "button");
    			attr(button347, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(button348, "type", "button");
    			attr(button348, "class", "fifth_btn bborder_remover blank_color svelte-1qr3f7h");
    			attr(div252, "class", "column_eight columns_design svelte-1qr3f7h");
    			attr(div253, "class", "button_designs select_changer svelte-1qr3f7h");
    			attr(div253, "id", "select_butns_15");
    			attr(div254, "class", "lower_part_toolbar svelte-1qr3f7h");
    			attr(div255, "class", "toolbar_container_one svelte-1qr3f7h");
    			attr(div255, "id", "toolbar_container_one");
    		},
    		m(target, anchor) {
    			insert(target, div255, anchor);
    			append(div255, div2);
    			append(div2, div1);
    			append(div255, t4);
    			append(div255, div5);
    			append(div5, div3);
    			append(div3, select);
    			append(select, option0);
    			append(select, option1);
    			append(select, option2);
    			append(select, option3);
    			append(select, option4);
    			append(select, option5);
    			append(select, option6);
    			append(select, option7);
    			append(select, option8);
    			append(select, option9);
    			append(select, option10);
    			append(select, option11);
    			append(select, option12);
    			append(select, option13);
    			append(select, option14);
    			append(div5, t21);
    			append(div5, div4);
    			append(div255, t22);
    			append(div255, div254);
    			append(div254, div10);
    			append(div10, div6);
    			append(div6, button1);
    			append(div6, t24);
    			append(div6, button2);
    			append(div6, t26);
    			append(div6, button3);
    			append(div6, t28);
    			append(div6, button4);
    			append(div6, t30);
    			append(div6, button5);
    			append(div10, t31);
    			append(div10, div7);
    			append(div7, button6);
    			append(div7, t33);
    			append(div7, button7);
    			append(div7, t35);
    			append(div7, button8);
    			append(div7, t37);
    			append(div7, button9);
    			append(div7, t39);
    			append(div7, button10);
    			append(div10, t40);
    			append(div10, div8);
    			append(div8, button11);
    			append(div8, t42);
    			append(div8, button12);
    			append(div8, t44);
    			append(div8, button13);
    			append(div8, t46);
    			append(div8, button14);
    			append(div8, t48);
    			append(div8, button15);
    			append(div10, t49);
    			append(div10, div9);
    			append(div9, button16);
    			append(div9, t51);
    			append(div9, button17);
    			append(div9, t53);
    			append(div9, button18);
    			append(div9, t55);
    			append(div9, button19);
    			append(div9, t57);
    			append(div9, button20);
    			append(div254, t59);
    			append(div254, div87);
    			append(div87, div45);
    			append(div45, div12);
    			append(div45, t60);
    			append(div45, button21);
    			append(div45, t62);
    			append(div45, button22);
    			append(div45, t64);
    			append(div45, button23);
    			append(div45, t66);
    			append(div45, button24);
    			append(div45, t68);
    			append(div45, button25);
    			append(div45, t70);
    			append(div45, button26);
    			append(div45, t72);
    			append(div45, div14);
    			append(div45, t73);
    			append(div45, div16);
    			append(div45, t74);
    			append(div45, div18);
    			append(div45, t75);
    			append(div45, div20);
    			append(div45, t76);
    			append(div45, button27);
    			append(div45, t78);
    			append(div45, button28);
    			append(div45, t80);
    			append(div45, div22);
    			append(div45, t81);
    			append(div45, div24);
    			append(div45, t82);
    			append(div45, button29);
    			append(div45, t84);
    			append(div45, div26);
    			append(div45, t85);
    			append(div45, div28);
    			append(div45, t86);
    			append(div45, div30);
    			append(div45, t87);
    			append(div45, button30);
    			append(div45, t89);
    			append(div45, div32);
    			append(div45, t90);
    			append(div45, div34);
    			append(div45, t91);
    			append(div45, div36);
    			append(div45, t92);
    			append(div45, div38);
    			append(div45, t93);
    			append(div45, div40);
    			append(div45, t94);
    			append(div45, button31);
    			append(div45, t96);
    			append(div45, button32);
    			append(div45, t98);
    			append(div45, button33);
    			append(div45, t100);
    			append(div45, button34);
    			append(div45, t102);
    			append(div45, button35);
    			append(div45, t104);
    			append(div45, button36);
    			append(div45, t106);
    			append(div45, button37);
    			append(div45, t108);
    			append(div45, button38);
    			append(div45, t110);
    			append(div45, div42);
    			append(div45, t111);
    			append(div45, button39);
    			append(div45, t113);
    			append(div45, div44);
    			append(div45, t114);
    			append(div45, button40);
    			append(div45, t116);
    			append(div45, button41);
    			append(div45, t118);
    			append(div45, button42);
    			append(div87, t120);
    			append(div87, div58);
    			append(div58, div47);
    			append(div58, t121);
    			append(div58, div49);
    			append(div58, t122);
    			append(div58, button43);
    			append(div58, t124);
    			append(div58, button44);
    			append(div58, t126);
    			append(div58, button45);
    			append(div58, t128);
    			append(div58, button46);
    			append(div58, t130);
    			append(div58, button47);
    			append(div58, t132);
    			append(div58, button48);
    			append(div58, t134);
    			append(div58, div51);
    			append(div58, t135);
    			append(div58, button49);
    			append(div58, t137);
    			append(div58, button50);
    			append(div58, t139);
    			append(div58, button51);
    			append(div58, t141);
    			append(div58, div53);
    			append(div58, t142);
    			append(div58, button52);
    			append(div58, t144);
    			append(div58, button53);
    			append(div58, t146);
    			append(div58, button54);
    			append(div58, t148);
    			append(div58, button55);
    			append(div58, t150);
    			append(div58, div55);
    			append(div58, t151);
    			append(div58, button56);
    			append(div58, t153);
    			append(div58, button57);
    			append(div58, t155);
    			append(div58, button58);
    			append(div58, t157);
    			append(div58, button59);
    			append(div58, t159);
    			append(div58, div57);
    			append(div58, t160);
    			append(div58, button60);
    			append(div58, t162);
    			append(div58, button61);
    			append(div58, t164);
    			append(div58, button62);
    			append(div58, t166);
    			append(div58, button63);
    			append(div58, t168);
    			append(div58, button64);
    			append(div58, t170);
    			append(div58, button65);
    			append(div58, t172);
    			append(div58, button66);
    			append(div58, t174);
    			append(div58, button67);
    			append(div58, t176);
    			append(div58, button68);
    			append(div58, t178);
    			append(div58, button69);
    			append(div58, t180);
    			append(div58, button70);
    			append(div58, t182);
    			append(div58, button71);
    			append(div58, t184);
    			append(div58, button72);
    			append(div58, t186);
    			append(div58, button73);
    			append(div58, t188);
    			append(div58, button74);
    			append(div58, t190);
    			append(div58, button75);
    			append(div87, t192);
    			append(div87, div77);
    			append(div77, div60);
    			append(div77, t193);
    			append(div77, div62);
    			append(div77, t194);
    			append(div77, button76);
    			append(div77, t196);
    			append(div77, div64);
    			append(div77, t197);
    			append(div77, div66);
    			append(div77, t198);
    			append(div77, button77);
    			append(div77, t200);
    			append(div77, button78);
    			append(div77, t202);
    			append(div77, button79);
    			append(div77, t204);
    			append(div77, button80);
    			append(div77, t206);
    			append(div77, div68);
    			append(div77, t207);
    			append(div77, button81);
    			append(div77, t209);
    			append(div77, button82);
    			append(div77, t211);
    			append(div77, button83);
    			append(div77, t213);
    			append(div77, button84);
    			append(div77, t215);
    			append(div77, div70);
    			append(div77, t216);
    			append(div77, button85);
    			append(div77, t218);
    			append(div77, button86);
    			append(div77, t220);
    			append(div77, button87);
    			append(div77, t222);
    			append(div77, button88);
    			append(div77, t224);
    			append(div77, div72);
    			append(div77, t225);
    			append(div77, button89);
    			append(div77, t228);
    			append(div77, button90);
    			append(div77, t231);
    			append(div77, button91);
    			append(div77, t234);
    			append(div77, button92);
    			append(div77, t236);
    			append(div77, button93);
    			append(div77, t238);
    			append(div77, button94);
    			append(div77, t240);
    			append(div77, button95);
    			append(div77, t243);
    			append(div77, button96);
    			append(div77, t246);
    			append(div77, button97);
    			append(div77, t249);
    			append(div77, button98);
    			append(div77, t251);
    			append(div77, button99);
    			append(div77, t253);
    			append(div77, button100);
    			append(div77, t255);
    			append(div77, button101);
    			append(div77, t257);
    			append(div77, button102);
    			append(div77, t259);
    			append(div77, div74);
    			append(div77, t260);
    			append(div77, button103);
    			append(div77, t262);
    			append(div77, div76);
    			append(div77, t263);
    			append(div77, button104);
    			append(div77, t266);
    			append(div77, button105);
    			append(div87, t268);
    			append(div87, div86);
    			append(div86, div79);
    			append(div86, t269);
    			append(div86, div81);
    			append(div86, t270);
    			append(div86, div83);
    			append(div86, t271);
    			append(div86, div85);
    			append(div86, t272);
    			append(div86, button106);
    			append(div86, t274);
    			append(div86, button107);
    			append(div86, t276);
    			append(div86, button108);
    			append(div86, t278);
    			append(div86, button109);
    			append(div86, t281);
    			append(div86, button110);
    			append(div86, t284);
    			append(div86, button111);
    			append(div86, t287);
    			append(div86, button112);
    			append(div86, t289);
    			append(div86, button113);
    			append(div86, t291);
    			append(div86, button114);
    			append(div86, t293);
    			append(div86, button115);
    			append(div86, t295);
    			append(div86, button116);
    			append(div86, t297);
    			append(div86, button117);
    			append(div86, t299);
    			append(div86, button118);
    			append(div86, t301);
    			append(div86, button119);
    			append(div86, t303);
    			append(div86, button120);
    			append(div86, t305);
    			append(div86, button121);
    			append(div86, t307);
    			append(div86, button122);
    			append(div86, t309);
    			append(div86, button123);
    			append(div86, t311);
    			append(div86, button124);
    			append(div86, t313);
    			append(div86, button125);
    			append(div86, t315);
    			append(div86, button126);
    			append(div86, t317);
    			append(div86, button127);
    			append(div86, t319);
    			append(div86, button128);
    			append(div86, t321);
    			append(div86, button129);
    			append(div86, t323);
    			append(div86, button130);
    			append(div86, t325);
    			append(div86, button131);
    			append(div86, t327);
    			append(div86, button132);
    			append(div86, t329);
    			append(div86, button133);
    			append(div86, t331);
    			append(div86, button134);
    			append(div86, t333);
    			append(div86, button135);
    			append(div86, t335);
    			append(div86, button136);
    			append(div86, t337);
    			append(div86, button137);
    			append(div86, t339);
    			append(div86, button138);
    			append(div86, t341);
    			append(div86, button139);
    			append(div86, t343);
    			append(div86, button140);
    			append(div254, t345);
    			append(div254, div118);
    			append(div118, div94);
    			append(div94, div89);
    			append(div94, t346);
    			append(div94, div91);
    			append(div94, t347);
    			append(div94, button141);
    			append(div94, t349);
    			append(div94, button142);
    			append(div94, t351);
    			append(div94, div93);
    			append(div118, t352);
    			append(div118, div99);
    			append(div99, div96);
    			append(div99, t353);
    			append(div99, div98);
    			append(div99, t354);
    			append(div99, button143);
    			append(div99, t356);
    			append(div99, button144);
    			append(div99, t358);
    			append(div99, button145);
    			append(div118, t360);
    			append(div118, div108);
    			append(div108, div101);
    			append(div108, t361);
    			append(div108, div103);
    			append(div108, t362);
    			append(div108, button146);
    			append(div108, t364);
    			append(div108, div105);
    			append(div108, t365);
    			append(div108, div107);
    			append(div118, t366);
    			append(div118, div117);
    			append(div117, div110);
    			append(div117, t367);
    			append(div117, div112);
    			append(div117, t368);
    			append(div117, div114);
    			append(div117, t369);
    			append(div117, div116);
    			append(div117, t370);
    			append(div117, button147);
    			append(div254, t371);
    			append(div254, div150);
    			append(div150, div123);
    			append(div123, div120);
    			append(div123, t372);
    			append(div123, div122);
    			append(div123, t373);
    			append(div123, button148);
    			append(div123, t375);
    			append(div123, button149);
    			append(div123, t377);
    			append(div123, button150);
    			append(div150, t378);
    			append(div150, div131);
    			append(div131, div125);
    			append(div131, t379);
    			append(div131, div127);
    			append(div131, t380);
    			append(div131, button151);
    			append(div131, t382);
    			append(div131, div129);
    			append(div131, t383);
    			append(div131, div130);
    			append(div150, t384);
    			append(div150, div139);
    			append(div139, div133);
    			append(div139, t385);
    			append(div139, div135);
    			append(div139, t386);
    			append(div139, button152);
    			append(div139, t388);
    			append(div139, div137);
    			append(div139, t389);
    			append(div139, div138);
    			append(div150, t390);
    			append(div150, div149);
    			append(div149, div141);
    			append(div149, t391);
    			append(div149, div143);
    			append(div149, t392);
    			append(div149, div145);
    			append(div149, t393);
    			append(div149, div147);
    			append(div149, t394);
    			append(div149, div148);
    			append(div254, t395);
    			append(div254, div160);
    			append(div160, div154);
    			append(div154, button153);
    			append(div154, t397);
    			append(div154, button154);
    			append(div154, t399);
    			append(div154, button155);
    			append(div154, t401);
    			append(div154, div152);
    			append(div154, t402);
    			append(div154, div153);
    			append(div160, t403);
    			append(div160, div158);
    			append(div158, button156);
    			append(div158, t405);
    			append(div158, button157);
    			append(div158, t407);
    			append(div158, button158);
    			append(div158, t409);
    			append(div158, div156);
    			append(div158, t410);
    			append(div158, div157);
    			append(div160, t411);
    			append(div160, div159);
    			append(div254, t412);
    			append(div254, div169);
    			append(div169, div163);
    			append(div163, button159);
    			append(div163, t414);
    			append(div163, button160);
    			append(div163, t416);
    			append(div163, button161);
    			append(div163, t418);
    			append(div163, button162);
    			append(div163, t420);
    			append(div163, div162);
    			append(div169, t421);
    			append(div169, div166);
    			append(div166, button163);
    			append(div166, t423);
    			append(div166, button164);
    			append(div166, t425);
    			append(div166, button165);
    			append(div166, t427);
    			append(div166, button166);
    			append(div166, t429);
    			append(div166, div165);
    			append(div169, t430);
    			append(div169, div167);
    			append(div167, button167);
    			append(div167, t432);
    			append(div167, button168);
    			append(div167, t434);
    			append(div167, button169);
    			append(div167, t436);
    			append(div167, button170);
    			append(div167, t438);
    			append(div167, button171);
    			append(div169, t440);
    			append(div169, div168);
    			append(div168, button172);
    			append(div168, t442);
    			append(div168, button173);
    			append(div168, t444);
    			append(div168, button174);
    			append(div168, t446);
    			append(div168, button175);
    			append(div168, t448);
    			append(div168, button176);
    			append(div254, t450);
    			append(div254, div182);
    			append(div182, div172);
    			append(div172, button177);
    			append(div172, t452);
    			append(div172, button178);
    			append(div172, t454);
    			append(div172, button179);
    			append(div172, t456);
    			append(div172, button180);
    			append(div172, t458);
    			append(div172, div171);
    			append(div182, t459);
    			append(div182, div175);
    			append(div175, button181);
    			append(div175, t461);
    			append(div175, button182);
    			append(div175, t463);
    			append(div175, button183);
    			append(div175, t465);
    			append(div175, button184);
    			append(div175, t467);
    			append(div175, div174);
    			append(div182, t468);
    			append(div182, div178);
    			append(div178, button185);
    			append(div178, t470);
    			append(div178, button186);
    			append(div178, t472);
    			append(div178, button187);
    			append(div178, t474);
    			append(div178, button188);
    			append(div178, t476);
    			append(div178, div177);
    			append(div182, t477);
    			append(div182, div181);
    			append(div181, button189);
    			append(div181, t479);
    			append(div181, button190);
    			append(div181, t481);
    			append(div181, button191);
    			append(div181, t482);
    			append(div181, button192);
    			append(div181, t484);
    			append(div181, div180);
    			append(div254, t485);
    			append(div254, div187);
    			append(div187, div183);
    			append(div183, button193);
    			append(div183, t487);
    			append(div183, button194);
    			append(div183, t489);
    			append(div183, button195);
    			append(div183, t491);
    			append(div183, button196);
    			append(div183, t492);
    			append(div183, button197);
    			append(div187, t493);
    			append(div187, div184);
    			append(div184, button198);
    			append(div184, t495);
    			append(div184, button199);
    			append(div184, t497);
    			append(div184, button200);
    			append(div184, t499);
    			append(div184, button201);
    			append(div184, t500);
    			append(div184, button202);
    			append(div187, t501);
    			append(div187, div185);
    			append(div185, button203);
    			append(div185, t504);
    			append(div185, button204);
    			append(div185, t507);
    			append(div185, button205);
    			append(div185, t510);
    			append(div185, button206);
    			append(div185, t511);
    			append(div185, button207);
    			append(div187, t512);
    			append(div187, div186);
    			append(div186, button208);
    			append(div186, t515);
    			append(div186, button209);
    			append(div186, t518);
    			append(div186, button210);
    			append(div186, t521);
    			append(div186, button211);
    			append(div186, t522);
    			append(div186, button212);
    			append(div254, t523);
    			append(div254, div192);
    			append(div192, div188);
    			append(div188, button213);
    			append(div188, t525);
    			append(div188, button214);
    			append(div188, t527);
    			append(div188, button215);
    			append(div188, t529);
    			append(div188, button216);
    			append(div188, t531);
    			append(div188, button217);
    			append(div192, t532);
    			append(div192, div189);
    			append(div189, button218);
    			append(div189, t534);
    			append(div189, button219);
    			append(div189, t536);
    			append(div189, button220);
    			append(div189, t538);
    			append(div189, button221);
    			append(div189, t540);
    			append(div189, button222);
    			append(div192, t541);
    			append(div192, div190);
    			append(div190, button223);
    			append(div190, t543);
    			append(div190, button224);
    			append(div190, t545);
    			append(div190, button225);
    			append(div190, t547);
    			append(div190, button226);
    			append(div190, t549);
    			append(div190, button227);
    			append(div192, t550);
    			append(div192, div191);
    			append(div191, button228);
    			append(div191, t552);
    			append(div191, button229);
    			append(div191, t554);
    			append(div191, button230);
    			append(div191, t556);
    			append(div191, button231);
    			append(div191, t557);
    			append(div191, button232);
    			append(div254, t558);
    			append(div254, div199);
    			append(div199, div193);
    			append(div193, button233);
    			append(div193, t560);
    			append(div193, button234);
    			append(div193, t562);
    			append(div193, button235);
    			append(div193, t563);
    			append(div193, button236);
    			append(div193, t564);
    			append(div193, button237);
    			append(div199, t565);
    			append(div199, div194);
    			append(div194, button238);
    			append(div194, t567);
    			append(div194, button239);
    			append(div194, t569);
    			append(div194, button240);
    			append(div194, t570);
    			append(div194, button241);
    			append(div194, t571);
    			append(div194, button242);
    			append(div199, t572);
    			append(div199, div197);
    			append(div197, button243);
    			append(div197, t574);
    			append(div197, div196);
    			append(div197, t575);
    			append(div197, button244);
    			append(div197, t576);
    			append(div197, button245);
    			append(div197, t577);
    			append(div197, button246);
    			append(div199, t578);
    			append(div199, div198);
    			append(div198, button247);
    			append(div198, t580);
    			append(div198, button248);
    			append(div198, t582);
    			append(div198, button249);
    			append(div198, t583);
    			append(div198, button250);
    			append(div198, t584);
    			append(div198, button251);
    			append(div254, t585);
    			append(div254, div204);
    			append(div204, div200);
    			append(div200, button252);
    			append(div200, t587);
    			append(div200, button253);
    			append(div200, t589);
    			append(div200, button254);
    			append(div200, t591);
    			append(div200, button255);
    			append(div200, t592);
    			append(div200, button256);
    			append(div204, t593);
    			append(div204, div201);
    			append(div201, button257);
    			append(div201, t595);
    			append(div201, button258);
    			append(div201, t597);
    			append(div201, button259);
    			append(div201, t599);
    			append(div201, button260);
    			append(div201, t600);
    			append(div201, button261);
    			append(div204, t601);
    			append(div204, div202);
    			append(div202, button262);
    			append(div202, t603);
    			append(div202, button263);
    			append(div202, t605);
    			append(div202, button264);
    			append(div202, t607);
    			append(div202, button265);
    			append(div202, t608);
    			append(div202, button266);
    			append(div204, t609);
    			append(div204, div203);
    			append(div203, button267);
    			append(div203, t611);
    			append(div203, button268);
    			append(div203, t613);
    			append(div203, button269);
    			append(div203, t615);
    			append(div203, button270);
    			append(div203, t616);
    			append(div203, button271);
    			append(div254, t617);
    			append(div254, div209);
    			append(div209, div205);
    			append(div205, button272);
    			append(div205, t619);
    			append(div205, button273);
    			append(div205, t621);
    			append(div205, button274);
    			append(div205, t623);
    			append(div205, button275);
    			append(div205, t625);
    			append(div205, button276);
    			append(div209, t626);
    			append(div209, div206);
    			append(div206, button277);
    			append(div206, t628);
    			append(div206, button278);
    			append(div206, t630);
    			append(div206, button279);
    			append(div206, t632);
    			append(div206, button280);
    			append(div206, t634);
    			append(div206, button281);
    			append(div209, t635);
    			append(div209, div207);
    			append(div207, button282);
    			append(div207, t637);
    			append(div207, button283);
    			append(div207, t639);
    			append(div207, button284);
    			append(div207, t640);
    			append(div207, button285);
    			append(div207, t641);
    			append(div207, button286);
    			append(div209, t642);
    			append(div209, div208);
    			append(div208, button287);
    			append(div208, t644);
    			append(div208, button288);
    			append(div208, t646);
    			append(div208, button289);
    			append(div208, t647);
    			append(div208, button290);
    			append(div208, t648);
    			append(div208, button291);
    			append(div254, t649);
    			append(div254, div213);
    			append(div213, div210);
    			append(div210, button292);
    			append(div210, t651);
    			append(div210, button293);
    			append(div210, t653);
    			append(div210, button294);
    			append(div210, t655);
    			append(div210, button295);
    			append(div210, t656);
    			append(div210, button296);
    			append(div213, t657);
    			append(div213, div211);
    			append(div211, button297);
    			append(div211, t659);
    			append(div211, button298);
    			append(div211, t661);
    			append(div211, button299);
    			append(div211, t663);
    			append(div211, button300);
    			append(div211, t664);
    			append(div211, button301);
    			append(div213, t665);
    			append(div213, div212);
    			append(div212, button302);
    			append(div212, t666);
    			append(div212, button303);
    			append(div212, t668);
    			append(div212, button304);
    			append(div212, t670);
    			append(div212, button305);
    			append(div212, t671);
    			append(div212, button306);
    			append(div254, t672);
    			append(div254, div223);
    			append(div223, div216);
    			append(div216, div215);
    			append(div216, t673);
    			append(div216, button307);
    			append(div216, t674);
    			append(div216, button308);
    			append(div216, t675);
    			append(div216, button309);
    			append(div216, t676);
    			append(div216, button310);
    			append(div223, t677);
    			append(div223, div219);
    			append(div219, div218);
    			append(div219, t678);
    			append(div219, button311);
    			append(div219, t679);
    			append(div219, button312);
    			append(div219, t680);
    			append(div219, button313);
    			append(div219, t681);
    			append(div219, button314);
    			append(div223, t682);
    			append(div223, div222);
    			append(div222, div221);
    			append(div222, t683);
    			append(div222, button315);
    			append(div222, t684);
    			append(div222, button316);
    			append(div222, t685);
    			append(div222, button317);
    			append(div222, t686);
    			append(div222, button318);
    			append(div254, t687);
    			append(div254, div236);
    			append(div236, div226);
    			append(div226, button319);
    			append(div226, t689);
    			append(div226, div225);
    			append(div226, t690);
    			append(div226, button320);
    			append(div226, t691);
    			append(div226, button321);
    			append(div226, t692);
    			append(div226, button322);
    			append(div236, t693);
    			append(div236, div229);
    			append(div229, button323);
    			append(div229, t695);
    			append(div229, div228);
    			append(div229, t696);
    			append(div229, button324);
    			append(div229, t697);
    			append(div229, button325);
    			append(div229, t698);
    			append(div229, button326);
    			append(div236, t699);
    			append(div236, div232);
    			append(div232, button327);
    			append(div232, t701);
    			append(div232, div231);
    			append(div232, t702);
    			append(div232, button328);
    			append(div232, t703);
    			append(div232, button329);
    			append(div232, t704);
    			append(div232, button330);
    			append(div236, t705);
    			append(div236, div235);
    			append(div235, div234);
    			append(div235, t706);
    			append(div235, button331);
    			append(div235, t708);
    			append(div235, button332);
    			append(div235, t709);
    			append(div235, button333);
    			append(div235, t710);
    			append(div235, button334);
    			append(div254, t711);
    			append(div254, div253);
    			append(div253, div241);
    			append(div241, div238);
    			append(div241, t712);
    			append(div241, button335);
    			append(div241, t714);
    			append(div241, div240);
    			append(div241, t715);
    			append(div241, button336);
    			append(div241, t716);
    			append(div241, button337);
    			append(div253, t717);
    			append(div253, div244);
    			append(div244, div243);
    			append(div244, t718);
    			append(div244, button338);
    			append(div244, t720);
    			append(div244, button339);
    			append(div244, t722);
    			append(div244, button340);
    			append(div244, t723);
    			append(div244, button341);
    			append(div253, t724);
    			append(div253, div247);
    			append(div247, div246);
    			append(div247, t725);
    			append(div247, button342);
    			append(div247, t727);
    			append(div247, button343);
    			append(div247, t729);
    			append(div247, button344);
    			append(div247, t730);
    			append(div247, button345);
    			append(div253, t731);
    			append(div253, div252);
    			append(div252, div249);
    			append(div252, t732);
    			append(div252, button346);
    			append(div252, t734);
    			append(div252, div251);
    			append(div252, t735);
    			append(div252, button347);
    			append(div252, t736);
    			append(div252, button348);

    			if (!mounted) {
    				dispose = [
    					listen(div1, "click", /*closeToolbar*/ ctx[3]),
    					listen(button1, "click", /*latexInput*/ ctx[0].bind(this, 7)),
    					listen(button2, "click", /*latexInput*/ ctx[0].bind(this, 4)),
    					listen(button3, "click", /*latexInput*/ ctx[0].bind(this, 1)),
    					listen(button4, "click", /*latexInput*/ ctx[0].bind(this, 0)),
    					listen(button5, "click", /*cursorEvent*/ ctx[2].bind(this, "cursorBack")),
    					listen(button6, "click", /*latexInput*/ ctx[0].bind(this, 8)),
    					listen(button7, "click", /*latexInput*/ ctx[0].bind(this, 5)),
    					listen(button8, "click", /*latexInput*/ ctx[0].bind(this, 2)),
    					listen(button9, "click", /*input*/ ctx[1].bind(this, ".")),
    					listen(button10, "click", /*cursorEvent*/ ctx[2].bind(this, "cursorFor")),
    					listen(button11, "click", /*latexInput*/ ctx[0].bind(this, 9)),
    					listen(button12, "click", /*latexInput*/ ctx[0].bind(this, 6)),
    					listen(button13, "click", /*latexInput*/ ctx[0].bind(this, 3)),
    					listen(button14, "click", /*input*/ ctx[1].bind(this, ",")),
    					listen(button15, "click", /*cursorEvent*/ ctx[2].bind(this, "backspace")),
    					listen(button16, "click", /*input*/ ctx[1].bind(this, "\\div")),
    					listen(button17, "click", /*input*/ ctx[1].bind(this, "×")),
    					listen(button18, "click", /*input*/ ctx[1].bind(this, "-")),
    					listen(button19, "click", /*input*/ ctx[1].bind(this, "+")),
    					listen(button20, "click", /*input*/ ctx[1].bind(this, "=")),
    					listen(div12, "click", /*latexInput*/ ctx[0].bind(this, "x")),
    					listen(button21, "click", /*input*/ ctx[1].bind(this, "b")),
    					listen(button22, "click", /*latexInput*/ ctx[0].bind(this, "\\text{abc}")),
    					listen(button23, "click", /*latexInput*/ ctx[0].bind(this, "$")),
    					listen(button24, "click", /*input*/ ctx[1].bind(this, "\\div")),
    					listen(button25, "click", /*input*/ ctx[1].bind(this, "&ge;")),
    					listen(button26, "click", /*latexInput*/ ctx[0].bind(this, "\\perp")),
    					listen(div14, "click", /*latexInput*/ ctx[0].bind(this, "\\nless")),
    					listen(div16, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right)")),
    					listen(div18, "click", /*input*/ ctx[1].bind(this, "x")),
    					listen(div20, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button27, "click", /*input*/ ctx[1].bind(this, "lt")),
    					listen(button28, "click", /*input*/ ctx[1].bind(this, "pi")),
    					listen(div22, "click", /*input*/ ctx[1].bind(this, "y")),
    					listen(div24, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button29, "click", /*input*/ ctx[1].bind(this, "gt")),
    					listen(div26, "click", /*input*/ ctx[1].bind(this, "infin")),
    					listen(div28, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}")),
    					listen(div30, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}")),
    					listen(button30, "click", /*input*/ ctx[1].bind(this, "±")),
    					listen(div32, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(div34, "click", /*input*/ ctx[1].bind(this, "\\sqrt")),
    					listen(div36, "click", /*latexInput*/ ctx[0].bind(this, "\\sqrt[]{}")),
    					listen(div38, "click", /*input*/ ctx[1].bind(this, "|")),
    					listen(div40, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right]")),
    					listen(button31, "click", /*input*/ ctx[1].bind(this, "a")),
    					listen(button32, "click", /*input*/ ctx[1].bind(this, "\\vert")),
    					listen(button33, "click", /*latexInput*/ ctx[0].bind(this, "\\lceil")),
    					listen(button34, "click", /*latexInput*/ ctx[0].bind(this, "\\wedge")),
    					listen(button35, "click", /*input*/ ctx[1].bind(this, "\\forall")),
    					listen(button36, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mi}")),
    					listen(button37, "click", /*latexInput*/ ctx[0].bind(this, "\\text{gal}")),
    					listen(button38, "click", /*latexInput*/ ctx[0].bind(this, "f")),
    					listen(div42, "click", /*latexInput*/ ctx[0].bind(this, "\\int_{ }^{ }")),
    					listen(button39, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta")),
    					listen(div44, "click", /*latexInput*/ ctx[0].bind(this, "\\sum_{ }^{ }")),
    					listen(button40, "click", /*latexInput*/ ctx[0].bind(this, "\\rightleftharpoons")),
    					listen(button41, "click", /*input*/ ctx[1].bind(this, "\\prime")),
    					listen(button42, "click", /*latexInput*/ ctx[0].bind(this, "\\text{&micro;g}")),
    					listen(div47, "click", /*latexInput*/ ctx[0].bind(this, "y")),
    					listen(div49, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button43, "click", /*input*/ ctx[1].bind(this, "gt")),
    					listen(button44, "click", /*latexInput*/ ctx[0].bind(this, "\\degree")),
    					listen(button45, "click", /*input*/ ctx[1].bind(this, "pi")),
    					listen(button46, "click", /*input*/ ctx[1].bind(this, "&ne;")),
    					listen(button47, "click", /*input*/ ctx[1].bind(this, "lt")),
    					listen(button48, "click", /*input*/ ctx[1].bind(this, "&le;")),
    					listen(div51, "click", /*latexInput*/ ctx[0].bind(this, "\\ngtr")),
    					listen(button49, "click", /*input*/ ctx[1].bind(this, "&asymp;")),
    					listen(button50, "click", /*input*/ ctx[1].bind(this, "gt")),
    					listen(button51, "click", /*input*/ ctx[1].bind(this, "&ge;")),
    					listen(div53, "click", /*latexInput*/ ctx[0].bind(this, "\\nless")),
    					listen(button52, "click", /*latexInput*/ ctx[0].bind(this, "\\perp")),
    					listen(button53, "click", /*latexInput*/ ctx[0].bind(this, "\\angle")),
    					listen(button54, "click", /*latexInput*/ ctx[0].bind(this, "\\triangle")),
    					listen(button55, "click", /*latexInput*/ ctx[0].bind(this, "\\degree")),
    					listen(div55, "click", /*latexInput*/ ctx[0].bind(this, "\\overline{ }")),
    					listen(button56, "click", /*input*/ ctx[1].bind(this, "parallel")),
    					listen(button57, "click", /*latexInput*/ ctx[0].bind(this, "\\measuredangle")),
    					listen(button58, "click", /*input*/ ctx[1].bind(this, "circledot")),
    					listen(button59, "click", /*input*/ ctx[1].bind(this, "&prime;")),
    					listen(div57, "click", /*latexInput*/ ctx[0].bind(this, "\\overrightarrow{ }")),
    					listen(button60, "click", /*input*/ ctx[1].bind(this, "\\nparallel")),
    					listen(button61, "click", /*input*/ ctx[1].bind(this, "\\sim")),
    					listen(button62, "click", /*input*/ ctx[1].bind(this, "\\parallelogram")),
    					listen(button63, "click", /*input*/ ctx[1].bind(this, "&prime;")),
    					listen(button64, "click", /*latexInput*/ ctx[0].bind(this, "\\ldots")),
    					listen(button65, "click", /*latexInput*/ ctx[0].bind(this, "\\ddots")),
    					listen(button66, "click", /*input*/ ctx[1].bind(this, "\\cong")),
    					listen(button67, "click", /*latexInput*/ ctx[0].bind(this, "\\vdots")),
    					listen(button68, "click", /*input*/ ctx[1].bind(this, "&pi;")),
    					listen(button69, "click", /*input*/ ctx[1].bind(this, "\\square")),
    					listen(button70, "click", /*latexInput*/ ctx[0].bind(this, "\\propto")),
    					listen(button71, "click", /*latexInput*/ ctx[0].bind(this, "\\rfloor")),
    					listen(button72, "click", /*input*/ ctx[1].bind(this, "\\equiv")),
    					listen(button73, "click", /*input*/ ctx[1].bind(this, "\\exists")),
    					listen(button74, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mg}")),
    					listen(button75, "click", /*latexInput*/ ctx[0].bind(this, "\\text{cm}")),
    					listen(div60, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}")),
    					listen(div62, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}")),
    					listen(button76, "click", /*input*/ ctx[1].bind(this, "±")),
    					listen(div64, "click", /*input*/ ctx[1].bind(this, ":")),
    					listen(div66, "click", /*input*/ ctx[1].bind(this, "infin")),
    					listen(button77, "click", /*latexInput*/ ctx[0].bind(this, "\\subset")),
    					listen(button78, "click", /*input*/ ctx[1].bind(this, "\\in")),
    					listen(button79, "click", /*input*/ ctx[1].bind(this, "\\cup")),
    					listen(button80, "click", /*input*/ ctx[1].bind(this, ",")),
    					listen(div68, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(button81, "click", /*latexInput*/ ctx[0].bind(this, "\\supset")),
    					listen(button82, "click", /*input*/ ctx[1].bind(this, "\\notin")),
    					listen(button83, "click", /*input*/ ctx[1].bind(this, "\\cap")),
    					listen(button84, "click", /*latexInput*/ ctx[0].bind(this, ":")),
    					listen(div70, "click", /*latexInput*/ ctx[0].bind(this, "\\left\\{\\right\\}")),
    					listen(button85, "click", /*latexInput*/ ctx[0].bind(this, "\\subseteq")),
    					listen(button86, "click", /*latexInput*/ ctx[0].bind(this, "\\ni")),
    					listen(button87, "click", /*input*/ ctx[1].bind(this, "\\varnothing")),
    					listen(button88, "click", /*input*/ ctx[1].bind(this, "!")),
    					listen(div72, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right)")),
    					listen(button89, "click", /*latexInput*/ ctx[0].bind(this, "\\sec^{-1}")),
    					listen(button90, "click", /*latexInput*/ ctx[0].bind(this, "\\csc^{-1}")),
    					listen(button91, "click", /*latexInput*/ ctx[0].bind(this, "\\cot^{-1}")),
    					listen(button92, "click", /*latexInput*/ ctx[0].bind(this, "sin")),
    					listen(button93, "click", /*input*/ ctx[1].bind(this, "cos")),
    					listen(button94, "click", /*latexInput*/ ctx[0].bind(this, "\\tan")),
    					listen(button95, "click", /*latexInput*/ ctx[0].bind(this, "\\sec^{-1}")),
    					listen(button96, "click", /*latexInput*/ ctx[0].bind(this, "\\csc^{-1}")),
    					listen(button97, "click", /*latexInput*/ ctx[0].bind(this, "\\cot^{-1}")),
    					listen(button98, "click", /*input*/ ctx[1].bind(this, "b")),
    					listen(button99, "click", /*latexInput*/ ctx[0].bind(this, "\\cdot")),
    					listen(button100, "click", /*latexInput*/ ctx[0].bind(this, "\\text{lb}")),
    					listen(button101, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ft}")),
    					listen(button102, "click", /*latexInput*/ ctx[0].bind(this, "\\text{pt}")),
    					listen(div74, "click", /*latexInput*/ ctx[0].bind(this, "^{}")),
    					listen(button103, "click", /*input*/ ctx[1].bind(this, "\\rightarrow")),
    					listen(div76, "click", /*latexInput*/ ctx[0].bind(this, "\\xrightarrow[]\\{}")),
    					listen(button104, "click", /*latexInput*/ ctx[0].bind(this, "\\text{g} \\text{mol}^{-1}")),
    					listen(button105, "click", /*latexInput*/ ctx[0].bind(this, "\\partial")),
    					listen(div79, "click", /*input*/ ctx[1].bind(this, "\\sqrt")),
    					listen(div81, "click", /*latexInput*/ ctx[0].bind(this, "\\_{}")),
    					listen(div83, "click", /*latexInput*/ ctx[0].bind(this, "$")),
    					listen(div85, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(button106, "click", /*latexInput*/ ctx[0].bind(this, "sec")),
    					listen(button107, "click", /*latexInput*/ ctx[0].bind(this, "csc")),
    					listen(button108, "click", /*input*/ ctx[1].bind(this, "cot")),
    					listen(button109, "click", /*latexInput*/ ctx[0].bind(this, "\\sin^{-1}")),
    					listen(button110, "click", /*latexInput*/ ctx[0].bind(this, "\\cos^{-1}")),
    					listen(button111, "click", /*latexInput*/ ctx[0].bind(this, "\\tan^{-1}")),
    					listen(button112, "click", /*latexInput*/ ctx[0].bind(this, "\\alpha")),
    					listen(button113, "click", /*input*/ ctx[1].bind(this, "\\theta")),
    					listen(button114, "click", /*input*/ ctx[1].bind(this, "Theta")),
    					listen(button115, "click", /*input*/ ctx[1].bind(this, "\\tau")),
    					listen(button116, "click", /*latexInput*/ ctx[0].bind(this, "\\gamma")),
    					listen(button117, "click", /*input*/ ctx[1].bind(this, "\\sigma")),
    					listen(button118, "click", /*input*/ ctx[1].bind(this, "Sigma")),
    					listen(button119, "click", /*latexInput*/ ctx[0].bind(this, "\\varepsilon")),
    					listen(button120, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta")),
    					listen(button121, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta")),
    					listen(button122, "click", /*input*/ ctx[1].bind(this, "\\lambda")),
    					listen(button123, "click", /*input*/ ctx[1].bind(this, "\\beta")),
    					listen(button124, "click", /*input*/ ctx[1].bind(this, "\\pi")),
    					listen(button125, "click", /*latexInput*/ ctx[0].bind(this, "\\Pi")),
    					listen(button126, "click", /*latexInput*/ ctx[0].bind(this, "\\phi")),
    					listen(button127, "click", /*latexInput*/ ctx[0].bind(this, "\\lfloor")),
    					listen(button128, "click", /*input*/ ctx[1].bind(this, "\\uparrow")),
    					listen(button129, "click", /*input*/ ctx[1].bind(this, "\\neg")),
    					listen(button130, "click", /*latexInput*/ ctx[0].bind(this, "\\text{oz}")),
    					listen(button131, "click", /*latexInput*/ ctx[0].bind(this, "\\text{in}")),
    					listen(button132, "click", /*latexInput*/ ctx[0].bind(this, "\\text{fl oz}")),
    					listen(button133, "click", /*latexInput*/ ctx[0].bind(this, "\\text{g}")),
    					listen(button134, "click", /*latexInput*/ ctx[0].bind(this, "\\text{m}")),
    					listen(button135, "click", /*latexInput*/ ctx[0].bind(this, "\\text{L}")),
    					listen(button136, "click", /*latexInput*/ ctx[0].bind(this, "\\text{s}")),
    					listen(button137, "click", /*latexInput*/ ctx[0].bind(this, "\\text{kg}")),
    					listen(button138, "click", /*latexInput*/ ctx[0].bind(this, "\\text{km}")),
    					listen(button139, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mL}")),
    					listen(button140, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ms}")),
    					listen(div89, "click", /*latexInput*/ ctx[0].bind(this, "x")),
    					listen(div91, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button141, "click", /*input*/ ctx[1].bind(this, "lt")),
    					listen(button142, "click", /*input*/ ctx[1].bind(this, "%")),
    					listen(div93, "click", /*input*/ ctx[1].bind(this, "|")),
    					listen(div96, "click", /*latexInput*/ ctx[0].bind(this, "y")),
    					listen(div98, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button143, "click", /*input*/ ctx[1].bind(this, "gt")),
    					listen(button144, "click", /*latexInput*/ ctx[0].bind(this, "\\degree")),
    					listen(button145, "click", /*input*/ ctx[1].bind(this, "pi")),
    					listen(div101, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}")),
    					listen(div103, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}")),
    					listen(button146, "click", /*input*/ ctx[1].bind(this, "±")),
    					listen(div105, "click", /*input*/ ctx[1].bind(this, ":")),
    					listen(div107, "click", /*input*/ ctx[1].bind(this, "infin")),
    					listen(div110, "click", /*input*/ ctx[1].bind(this, "\\sqrt")),
    					listen(div112, "click", /*latexInput*/ ctx[0].bind(this, "\\_{}")),
    					listen(div114, "click", /*latexInput*/ ctx[0].bind(this, "$")),
    					listen(div116, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(div120, "click", /*input*/ ctx[1].bind(this, "x")),
    					listen(div122, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button148, "click", /*input*/ ctx[1].bind(this, "lt")),
    					listen(button149, "click", /*input*/ ctx[1].bind(this, "pi")),
    					listen(div125, "click", /*input*/ ctx[1].bind(this, "y")),
    					listen(div127, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button151, "click", /*input*/ ctx[1].bind(this, "gt")),
    					listen(div129, "click", /*input*/ ctx[1].bind(this, "infin")),
    					listen(div133, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}")),
    					listen(div135, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}")),
    					listen(button152, "click", /*input*/ ctx[1].bind(this, "±")),
    					listen(div137, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(div141, "click", /*input*/ ctx[1].bind(this, "\\sqrt")),
    					listen(div143, "click", /*latexInput*/ ctx[0].bind(this, "\\sqrt[]{}")),
    					listen(div145, "click", /*input*/ ctx[1].bind(this, "|")),
    					listen(div147, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right]")),
    					listen(button153, "click", /*input*/ ctx[1].bind(this, "&ne;")),
    					listen(button154, "click", /*input*/ ctx[1].bind(this, "lt")),
    					listen(button155, "click", /*input*/ ctx[1].bind(this, "&le;")),
    					listen(div152, "click", /*latexInput*/ ctx[0].bind(this, "\\ngtr")),
    					listen(button156, "click", /*input*/ ctx[1].bind(this, "&asymp;")),
    					listen(button157, "click", /*input*/ ctx[1].bind(this, "gt")),
    					listen(button158, "click", /*input*/ ctx[1].bind(this, "&ge;")),
    					listen(div156, "click", /*latexInput*/ ctx[0].bind(this, "\\nless")),
    					listen(button159, "click", /*latexInput*/ ctx[0].bind(this, "\\perp")),
    					listen(button160, "click", /*latexInput*/ ctx[0].bind(this, "\\angle")),
    					listen(button161, "click", /*latexInput*/ ctx[0].bind(this, "\\triangle")),
    					listen(button162, "click", /*latexInput*/ ctx[0].bind(this, "\\degree")),
    					listen(div162, "click", /*latexInput*/ ctx[0].bind(this, "\\overline{ }")),
    					listen(button163, "click", /*input*/ ctx[1].bind(this, "parallel")),
    					listen(button164, "click", /*latexInput*/ ctx[0].bind(this, "\\measuredangle")),
    					listen(button165, "click", /*input*/ ctx[1].bind(this, "circledot")),
    					listen(button166, "click", /*input*/ ctx[1].bind(this, "&prime;")),
    					listen(div165, "click", /*latexInput*/ ctx[0].bind(this, "\\overrightarrow{ }")),
    					listen(button167, "click", /*input*/ ctx[1].bind(this, "\\nparallel")),
    					listen(button168, "click", /*input*/ ctx[1].bind(this, "\\sim")),
    					listen(button169, "click", /*input*/ ctx[1].bind(this, "\\parallelogram")),
    					listen(button170, "click", /*input*/ ctx[1].bind(this, "&prime;")),
    					listen(button171, "click", /*latexInput*/ ctx[0].bind(this, "\\ldots")),
    					listen(button172, "click", /*latexInput*/ ctx[0].bind(this, "\\ddots")),
    					listen(button173, "click", /*input*/ ctx[1].bind(this, "\\cong")),
    					listen(button174, "click", /*latexInput*/ ctx[0].bind(this, "\\vdots")),
    					listen(button175, "click", /*input*/ ctx[1].bind(this, "&pi;")),
    					listen(button176, "click", /*input*/ ctx[1].bind(this, "\\square")),
    					listen(button177, "click", /*latexInput*/ ctx[0].bind(this, "\\subset")),
    					listen(button178, "click", /*input*/ ctx[1].bind(this, "\\in")),
    					listen(button179, "click", /*input*/ ctx[1].bind(this, "\\cup")),
    					listen(button180, "click", /*input*/ ctx[1].bind(this, ",")),
    					listen(div171, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(button181, "click", /*latexInput*/ ctx[0].bind(this, "\\supset")),
    					listen(button182, "click", /*input*/ ctx[1].bind(this, "\\notin")),
    					listen(button183, "click", /*input*/ ctx[1].bind(this, "\\cap")),
    					listen(button184, "click", /*latexInput*/ ctx[0].bind(this, ":")),
    					listen(div174, "click", /*latexInput*/ ctx[0].bind(this, "\\left\\{\\right\\}")),
    					listen(button185, "click", /*latexInput*/ ctx[0].bind(this, "\\subseteq")),
    					listen(button186, "click", /*latexInput*/ ctx[0].bind(this, "\\ni")),
    					listen(button187, "click", /*input*/ ctx[1].bind(this, "\\varnothing")),
    					listen(button188, "click", /*input*/ ctx[1].bind(this, "!")),
    					listen(div177, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right)")),
    					listen(button189, "click", /*input*/ ctx[1].bind(this, "\\supseteq")),
    					listen(button190, "click", /*latexInput*/ ctx[0].bind(this, "\\notsubset")),
    					listen(button192, "click", /*latexInput*/ ctx[0].bind(this, "\\backslash")),
    					listen(div180, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right]")),
    					listen(button193, "click", /*latexInput*/ ctx[0].bind(this, "sin")),
    					listen(button194, "click", /*input*/ ctx[1].bind(this, "cos")),
    					listen(button195, "click", /*latexInput*/ ctx[0].bind(this, "\\tan")),
    					listen(button198, "click", /*latexInput*/ ctx[0].bind(this, "sec")),
    					listen(button199, "click", /*latexInput*/ ctx[0].bind(this, "csc")),
    					listen(button200, "click", /*input*/ ctx[1].bind(this, "cot")),
    					listen(button203, "click", /*latexInput*/ ctx[0].bind(this, "\\sin^{-1}")),
    					listen(button204, "click", /*latexInput*/ ctx[0].bind(this, "\\cos^{-1}")),
    					listen(button205, "click", /*latexInput*/ ctx[0].bind(this, "\\tan^{-1}")),
    					listen(button208, "click", /*latexInput*/ ctx[0].bind(this, "\\sec^{-1}")),
    					listen(button209, "click", /*latexInput*/ ctx[0].bind(this, "\\csc^{-1}")),
    					listen(button210, "click", /*latexInput*/ ctx[0].bind(this, "\\cot^{-1}")),
    					listen(button213, "click", /*latexInput*/ ctx[0].bind(this, "\\alpha")),
    					listen(button214, "click", /*input*/ ctx[1].bind(this, "\\theta")),
    					listen(button215, "click", /*input*/ ctx[1].bind(this, "Theta")),
    					listen(button216, "click", /*input*/ ctx[1].bind(this, "\\tau")),
    					listen(button218, "click", /*latexInput*/ ctx[0].bind(this, "\\gamma")),
    					listen(button219, "click", /*input*/ ctx[1].bind(this, "\\sigma")),
    					listen(button220, "click", /*input*/ ctx[1].bind(this, "Sigma")),
    					listen(button221, "click", /*latexInput*/ ctx[0].bind(this, "\\varepsilon")),
    					listen(button223, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta")),
    					listen(button224, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta")),
    					listen(button225, "click", /*input*/ ctx[1].bind(this, "\\lambda")),
    					listen(button226, "click", /*input*/ ctx[1].bind(this, "\\beta")),
    					listen(button228, "click", /*input*/ ctx[1].bind(this, "\\pi")),
    					listen(button229, "click", /*latexInput*/ ctx[0].bind(this, "\\Pi")),
    					listen(button230, "click", /*latexInput*/ ctx[0].bind(this, "\\phi")),
    					listen(button233, "click", /*input*/ ctx[1].bind(this, "a")),
    					listen(button234, "click", /*input*/ ctx[1].bind(this, "\\vert")),
    					listen(button238, "click", /*input*/ ctx[1].bind(this, "b")),
    					listen(button239, "click", /*latexInput*/ ctx[0].bind(this, "\\cdot")),
    					listen(button243, "click", /*latexInput*/ ctx[0].bind(this, "\\propto")),
    					listen(div196, "click", /*latexInput*/ ctx[0].bind(this, "\\longdiv{ }")),
    					listen(button247, "click", /*latexInput*/ ctx[0].bind(this, "\\text{abc}")),
    					listen(button248, "click", /*latexInput*/ ctx[0].bind(this, "\\mathbb{R}")),
    					listen(button252, "click", /*latexInput*/ ctx[0].bind(this, "\\lfloor")),
    					listen(button253, "click", /*input*/ ctx[1].bind(this, "\\uparrow")),
    					listen(button254, "click", /*input*/ ctx[1].bind(this, "\\neg")),
    					listen(button257, "click", /*latexInput*/ ctx[0].bind(this, "\\rfloor")),
    					listen(button258, "click", /*input*/ ctx[1].bind(this, "\\equiv")),
    					listen(button259, "click", /*input*/ ctx[1].bind(this, "\\exists")),
    					listen(button262, "click", /*latexInput*/ ctx[0].bind(this, "\\lceil")),
    					listen(button263, "click", /*latexInput*/ ctx[0].bind(this, "\\wedge")),
    					listen(button264, "click", /*input*/ ctx[1].bind(this, "\\forall")),
    					listen(button267, "click", /*input*/ ctx[1].bind(this, "\\rceil")),
    					listen(button268, "click", /*latexInput*/ ctx[0].bind(this, "\\vee")),
    					listen(button269, "click", /*latexInput*/ ctx[0].bind(this, "\\oplus")),
    					listen(button272, "click", /*latexInput*/ ctx[0].bind(this, "\\text{g}")),
    					listen(button273, "click", /*latexInput*/ ctx[0].bind(this, "\\text{m}")),
    					listen(button274, "click", /*latexInput*/ ctx[0].bind(this, "\\text{L}")),
    					listen(button275, "click", /*latexInput*/ ctx[0].bind(this, "\\text{s}")),
    					listen(button277, "click", /*latexInput*/ ctx[0].bind(this, "\\text{kg}")),
    					listen(button278, "click", /*latexInput*/ ctx[0].bind(this, "\\text{km}")),
    					listen(button279, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mL}")),
    					listen(button280, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ms}")),
    					listen(button282, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mg}")),
    					listen(button283, "click", /*latexInput*/ ctx[0].bind(this, "\\text{cm}")),
    					listen(button287, "click", /*latexInput*/ ctx[0].bind(this, "\\text{&micro;g}")),
    					listen(button288, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mm}")),
    					listen(button292, "click", /*latexInput*/ ctx[0].bind(this, "\\text{oz}")),
    					listen(button293, "click", /*latexInput*/ ctx[0].bind(this, "\\text{in}")),
    					listen(button294, "click", /*latexInput*/ ctx[0].bind(this, "\\text{fl oz}")),
    					listen(button297, "click", /*latexInput*/ ctx[0].bind(this, "\\text{lb}")),
    					listen(button298, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ft}")),
    					listen(button299, "click", /*latexInput*/ ctx[0].bind(this, "\\text{pt}")),
    					listen(button303, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mi}")),
    					listen(button304, "click", /*latexInput*/ ctx[0].bind(this, "\\text{gal}")),
    					listen(div215, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(div218, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right]")),
    					listen(div221, "click", /*latexInput*/ ctx[0].bind(this, "\\left\\{\\right\\}")),
    					listen(button319, "click", /*latexInput*/ ctx[0].bind(this, "d")),
    					listen(div225, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)")),
    					listen(button323, "click", /*latexInput*/ ctx[0].bind(this, "f")),
    					listen(div228, "click", /*latexInput*/ ctx[0].bind(this, "\\int_{ }^{ }")),
    					listen(button327, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta")),
    					listen(div231, "click", /*latexInput*/ ctx[0].bind(this, "\\sum_{ }^{ }")),
    					listen(div234, "click", /*input*/ ctx[1].bind(this, "/")),
    					listen(button331, "click", /*latexInput*/ ctx[0].bind(this, "\\partial")),
    					listen(div238, "click", /*latexInput*/ ctx[0].bind(this, "^{}")),
    					listen(button335, "click", /*input*/ ctx[1].bind(this, "\\rightarrow")),
    					listen(div240, "click", /*latexInput*/ ctx[0].bind(this, "\\xrightarrow[]\\{}")),
    					listen(div243, "click", /*latexInput*/ ctx[0].bind(this, "_{}")),
    					listen(button338, "click", /*input*/ ctx[1].bind(this, "\\leftarrow")),
    					listen(button339, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mol}")),
    					listen(div246, "click", /*latexInput*/ ctx[0].bind(this, "\\_{ }^{ }")),
    					listen(button342, "click", /*latexInput*/ ctx[0].bind(this, "\\rightleftharpoons")),
    					listen(button343, "click", /*input*/ ctx[1].bind(this, "\\prime")),
    					listen(div249, "click", /*latexInput*/ ctx[0].bind(this, "\\_{ }{}\\^{ }")),
    					listen(button346, "click", /*latexInput*/ ctx[0].bind(this, "\\longleftrightarrow")),
    					listen(div251, "click", /*latexInput*/ ctx[0].bind(this, "\\overset{ }\\{ }"))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div255);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { spanId } = $$props;
    	let { divId } = $$props;
    	let { action } = $$props;
    	let { show } = $$props;
    	let state = {};
    	let hdd = writable({ spanId: 0, divId: "elem0" });

    	const unsubscribe = hdd.subscribe(items => {
    		state = items;
    	});

    	beforeUpdate(() => {
    		state.spanId = spanId;
    		state.divId = divId;
    	});

    	onMount(() => {
    		state.spanId = spanId;
    		state.divId = divId;
    	});

    	function latexInput(latexValue) {
    		let fill = action;
    		fill.innerFields[spanId].write(latexValue);
    		fill.innerFields[spanId].focus();
    		AH.trigger("#fillmain", "change");
    	}

    	function input(valueOne) {
    		let fill = action;
    		fill.innerFields[spanId].cmd(valueOne);
    		fill.innerFields[spanId].focus();
    		AH.trigger("#fillmain", "change");
    	}

    	function cursorEvent(eventTriger) {
    		// let customKeyDownEvent = $.Event('keydown');
    		let customeKeyDownEvent = new Event("keydown");

    		customKeyDownEvent.bubbles = true;
    		customKeyDownEvent.cancelable = true;

    		if (eventTriger == "cursorFor") {
    			customKeyDownEvent.which = 39;
    		} else if (eventTriger == "cursorBack") {
    			customKeyDownEvent.which = 37;
    		} else if (eventTriger == "backspace") {
    			customKeyDownEvent.which = 8;
    		}

    		AH.selectAll("#" + divId + " .mq-editable-field")[spanId].dispatchEvent(customKeyDownEvent);
    		AH.trigger("#fillmain", "change");
    	}

    	function closeToolbar() {
    		show(false);
    	}

    	$$self.$$set = $$props => {
    		if ("spanId" in $$props) $$invalidate(4, spanId = $$props.spanId);
    		if ("divId" in $$props) $$invalidate(5, divId = $$props.divId);
    		if ("action" in $$props) $$invalidate(6, action = $$props.action);
    		if ("show" in $$props) $$invalidate(7, show = $$props.show);
    	};

    	return [latexInput, input, cursorEvent, closeToolbar, spanId, divId, action, show];
    }

    class FillInTheBlanksToolbar extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1.getElementById("svelte-1qr3f7h-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { spanId: 4, divId: 5, action: 6, show: 7 });
    	}
    }

    /* helper\ItemHelper.svelte generated by Svelte v3.29.0 */

    const { document: document_1$1 } = globals;

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-ri6gyf-style";
    	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}";
    	append(document_1$1.head, style);
    }

    // (23:4) {#if reviewMode}
    function create_if_block(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Correct Answer";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Your Answer";
    			attr(button0, "type", "button");
    			attr(button0, "mode", "c");
    			attr(button0, "class", "btn btn-light correct-ans");
    			attr(button1, "type", "button");
    			attr(button1, "mode", "u");
    			attr(button1, "class", "btn btn-light your-ans active");
    			attr(div, "class", "smControlerBtn btn-group");
    			attr(div, "role", "group");
    			attr(div, "aria-label", "Answer buttons");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, button0);
    			append(div, t1);
    			append(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*handleSmClick*/ ctx[2]),
    					listen(button1, "click", /*handleSmClick*/ ctx[2])
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let center;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*reviewMode*/ ctx[0] && create_if_block(ctx);

    	return {
    		c() {
    			center = element("center");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr(button0, "type", "button");
    			attr(button0, "class", "h h-imp");
    			attr(button0, "id", "set-review");
    			attr(button1, "type", "button");
    			attr(button1, "class", "h h-imp");
    			attr(button1, "id", "unset-review");
    			attr(center, "class", "pb-2");
    		},
    		m(target, anchor) {
    			insert(target, center, anchor);
    			append(center, button0);
    			append(center, t0);
    			append(center, button1);
    			append(center, t1);
    			if (if_block) if_block.m(center, null);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*click_handler*/ ctx[4]),
    					listen(button1, "click", /*click_handler_1*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (/*reviewMode*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(center, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(center);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { reviewMode = false } = $$props;
    	let { handleReviewClick } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleSmClick(event) {
    		document.querySelectorAll(".smControlerBtn button").forEach(el => el.classList.remove("active"));
    		event.target.classList.add("active");
    		if (handleReviewClick) handleReviewClick(event.target.getAttribute("mode"), event);
    	}

    	const click_handler = () => dispatch("setReview");
    	const click_handler_1 = () => dispatch("unsetReview");

    	$$self.$$set = $$props => {
    		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ("handleReviewClick" in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	return [
    		reviewMode,
    		dispatch,
    		handleSmClick,
    		handleReviewClick,
    		click_handler,
    		click_handler_1
    	];
    }

    class ItemHelper extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1$1.getElementById("svelte-ri6gyf-style")) add_css$1();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 });
    	}
    }

    /* clsSMStepAlgo\StepAlgoPreview.svelte generated by Svelte v3.29.0 */

    const { document: document_1$2 } = globals;

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-142veau-style";
    	style.textContent = ".darkgrey_border{border:1px solid #ccc!important}.p-lg{padding:15px}.true-hover{outline:0;border:2px solid #14ca14!important}.false-hover{outline:0;border:2px solid #e45252!important}.default-hover{border-color:transparent!important;-webkit-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;-moz-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important}.blocked{display:block !important}.border_green{border:3px solid green!important}.border_red{border:3px solid red!important}.sticky{z-index:800;position:sticky;top:0\r\n\t}.corr_div{position:absolute!important;width:60px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}[id^=\"fillmain\"]{overflow:hidden;text-align:left}[id^=\"fillmain\"] pre{background:none;border:none;font-size:14px!important}[id^=\"fillmain\"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^=\"fillmain\"] .footerstr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^=\"fillmain\"] .footerstr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^=\"fillmain\"] .fill-row{padding:6px}[id^=\"fillmain\"] .fillelement, [id^=\"fillmain\"] .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}[id^=\"fillmain\"] input[type=\"text\"], [id^=\"fillmain\"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^=\"fillmain\"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^=\"fillmain\"] .drag-resize.ui-draggable{cursor:move}[id^=\"fillmain\"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^=\"fillmain\"] .fillcheck ul{width:220px}[id^=\"fillmain\"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^=\"fillmain\"] .select{font-size:15px}[id^=\"fillmain\"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}";
    	append(document_1$2.head, style);
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[68] = list[i];
    	child_ctx[70] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[68] = list[i];
    	child_ctx[70] = i;
    	return child_ctx;
    }

    // (1225:1) {#if state.blank == false}
    function create_if_block$1(ctx) {
    	let center;
    	let itemhelper;
    	let t0;
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let t1;
    	let div1;
    	let div1_class_value;
    	let div1_style_value;
    	let t2;
    	let t3;
    	let div2;
    	let button;
    	let button_style_value;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	itemhelper = new ItemHelper({
    			props: {
    				handleReviewClick: /*handleReview*/ ctx[11],
    				reviewMode: /*isReview*/ ctx[0]
    			}
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[9]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[10]);
    	let each_value_1 = /*state*/ ctx[5].itemArray;
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*answer_array*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*state*/ ctx[5].showToolbar && create_if_block_1(ctx);

    	return {
    		c() {
    			center = element("center");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = `${language.next}`;
    			attr(div0, "class", div0_class_value = /*state*/ ctx[5].main_steps ? "h-imp" : "inNativeStyle");
    			attr(div0, "style", div0_style_value = "width:" + (AH.isValid(window.inNative) ? "100%" : "700px"));
    			attr(div1, "class", div1_class_value = /*state*/ ctx[5].correct_answer ? "h-imp" : "");
    			attr(div1, "style", div1_style_value = "width:" + (AH.isValid(window.inNative) ? "100%" : "700px"));
    			attr(button, "type", "button");
    			attr(button, "style", button_style_value = "width:auto;font-size:15px;margin:15px 0;");
    			attr(button, "class", "btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3");
    			attr(div2, "class", div2_class_value = /*state*/ ctx[5].hideNext ? "h-imp" : null);
    		},
    		m(target, anchor) {
    			insert(target, center, anchor);
    			mount_component(itemhelper, center, null);
    			append(center, t0);
    			append(center, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append(center, t1);
    			append(center, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append(center, t2);
    			if (if_block) if_block.m(center, null);
    			append(center, t3);
    			append(center, div2);
    			append(div2, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);

    			if (dirty[0] & /*isSticky, state, special_module*/ 104) {
    				each_value_1 = /*state*/ ctx[5].itemArray;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (!current || dirty[0] & /*state*/ 32 && div0_class_value !== (div0_class_value = /*state*/ ctx[5].main_steps ? "h-imp" : "inNativeStyle")) {
    				attr(div0, "class", div0_class_value);
    			}

    			if (dirty[0] & /*isSticky, state, special_module, answer_array*/ 108) {
    				each_value = /*answer_array*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty[0] & /*state*/ 32 && div1_class_value !== (div1_class_value = /*state*/ ctx[5].correct_answer ? "h-imp" : "")) {
    				attr(div1, "class", div1_class_value);
    			}

    			if (/*state*/ ctx[5].showToolbar) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(center, t3);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*state*/ 32 && div2_class_value !== (div2_class_value = /*state*/ ctx[5].hideNext ? "h-imp" : null)) {
    				attr(div2, "class", div2_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(center);
    			destroy_component(itemhelper);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (1241:4) {#each state.itemArray as item, index}
    function create_each_block_1(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let raw_value = /*item*/ ctx[68].cdata + "";
    	let div0_seq_value;
    	let div1_id_value;
    	let div1_class_value;
    	let div1_key_value;
    	let div2_id_value;
    	let div2_class_value;
    	let t;
    	let div3_data_sticky_value;

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			attr(div0, "seq", div0_seq_value = "s" + /*index*/ ctx[70]);
    			attr(div1, "id", div1_id_value = "data-block_" + /*index*/ ctx[70]);

    			attr(div1, "class", div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*index*/ ctx[70] == /*state*/ ctx[5].classChange
    			? /*state*/ ctx[5].isColor ? "border_green" : "border_red"
    			: ""));

    			attr(div1, "key", div1_key_value = /*index*/ ctx[70]);
    			attr(div2, "id", div2_id_value = "s" + /*index*/ ctx[70]);

    			attr(div2, "class", div2_class_value = "bg-white " + (/*state*/ ctx[5].display == 1
    			? /*special_module*/ ctx[3].smans != undefined
    				? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]] != undefined
    					? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]].overall == 1
    						? "border_green"
    						: "border_red"
    					: ""
    				: ""
    			: ""));

    			attr(div3, "data-sticky", div3_data_sticky_value = /*isSticky*/ ctx[6](/*index*/ ctx[70]));
    			attr(div3, "class", "bt-pd bg-white mt-3");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div1);
    			append(div1, div0);
    			div0.innerHTML = raw_value;
    			append(div3, t);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 32 && raw_value !== (raw_value = /*item*/ ctx[68].cdata + "")) div0.innerHTML = raw_value;
    			if (dirty[0] & /*state*/ 32 && div1_class_value !== (div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*index*/ ctx[70] == /*state*/ ctx[5].classChange
    			? /*state*/ ctx[5].isColor ? "border_green" : "border_red"
    			: ""))) {
    				attr(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*state, special_module*/ 40 && div2_class_value !== (div2_class_value = "bg-white " + (/*state*/ ctx[5].display == 1
    			? /*special_module*/ ctx[3].smans != undefined
    				? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]] != undefined
    					? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]].overall == 1
    						? "border_green"
    						: "border_red"
    					: ""
    				: ""
    			: ""))) {
    				attr(div2, "class", div2_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    		}
    	};
    }

    // (1253:4) {#each answer_array as item,index}
    function create_each_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let raw_value = /*item*/ ctx[68].__cdata + "";
    	let div0_seq_value;
    	let div1_id_value;
    	let div1_class_value;
    	let div1_key_value;
    	let div2_id_value;
    	let div2_class_value;
    	let t;
    	let div3_data_sticky_value;

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			attr(div0, "seq", div0_seq_value = "s" + /*index*/ ctx[70]);
    			attr(div1, "id", div1_id_value = "data-block_" + /*index*/ ctx[70]);

    			attr(div1, "class", div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*index*/ ctx[70] == /*state*/ ctx[5].classChange
    			? /*state*/ ctx[5].isColor ? "border_green" : "border_red"
    			: ""));

    			attr(div1, "key", div1_key_value = /*index*/ ctx[70]);
    			attr(div2, "id", div2_id_value = "s" + /*index*/ ctx[70]);

    			attr(div2, "class", div2_class_value = "bg-white " + (/*state*/ ctx[5].display == 1
    			? /*special_module*/ ctx[3].smans != undefined
    				? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]] != undefined
    					? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]].overall == 1
    						? "border_green"
    						: "border_red"
    					: ""
    				: ""
    			: ""));

    			attr(div3, "data-sticky", div3_data_sticky_value = /*isSticky*/ ctx[6](/*index*/ ctx[70]));
    			attr(div3, "class", "bt-pd bg-white mt-3");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div1);
    			append(div1, div0);
    			div0.innerHTML = raw_value;
    			append(div3, t);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*answer_array*/ 4 && raw_value !== (raw_value = /*item*/ ctx[68].__cdata + "")) div0.innerHTML = raw_value;
    			if (dirty[0] & /*state*/ 32 && div1_class_value !== (div1_class_value = "main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav " + (/*index*/ ctx[70] == /*state*/ ctx[5].classChange
    			? /*state*/ ctx[5].isColor ? "border_green" : "border_red"
    			: ""))) {
    				attr(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*state, special_module*/ 40 && div2_class_value !== (div2_class_value = "bg-white " + (/*state*/ ctx[5].display == 1
    			? /*special_module*/ ctx[3].smans != undefined
    				? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]] != undefined
    					? /*special_module*/ ctx[3].smans["s" + /*index*/ ctx[70]].overall == 1
    						? "border_green"
    						: "border_red"
    					: ""
    				: ""
    			: ""))) {
    				attr(div2, "class", div2_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    		}
    	};
    }

    // (1265:3) {#if state.showToolbar}
    function create_if_block_1(ctx) {
    	let fillintheblankstoolbar;
    	let current;

    	fillintheblankstoolbar = new FillInTheBlanksToolbar({
    			props: {
    				spanId: /*state*/ ctx[5].spanId,
    				divId: /*state*/ ctx[5].divId,
    				action: /*fill_math*/ ctx[1][/*fillId*/ ctx[4]],
    				show: /*func*/ ctx[16]
    			}
    		});

    	return {
    		c() {
    			create_component(fillintheblankstoolbar.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(fillintheblankstoolbar, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const fillintheblankstoolbar_changes = {};
    			if (dirty[0] & /*state*/ 32) fillintheblankstoolbar_changes.spanId = /*state*/ ctx[5].spanId;
    			if (dirty[0] & /*state*/ 32) fillintheblankstoolbar_changes.divId = /*state*/ ctx[5].divId;
    			if (dirty[0] & /*fill_math, fillId*/ 18) fillintheblankstoolbar_changes.action = /*fill_math*/ ctx[1][/*fillId*/ ctx[4]];
    			fillintheblankstoolbar.$set(fillintheblankstoolbar_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(fillintheblankstoolbar.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(fillintheblankstoolbar.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(fillintheblankstoolbar, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current;
    	let if_block = /*state*/ ctx[5].blank == false && create_if_block$1(ctx);

    	return {
    		c() {
    			main = element("main");
    			if (if_block) if_block.c();
    		},
    		m(target, anchor) {
    			insert(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (/*state*/ ctx[5].blank == false) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(main);
    			if (if_block) if_block.d();
    		}
    	};
    }

    function createAns(obj, element_id, element_div, correctval) {
    	if (typeof obj[element_div] == "undefined" || typeof obj[element_div][element_id] == "undefined") {
    		if (typeof obj[element_div] == "undefined") {
    			obj[element_div] = {};
    		}

    		obj[element_div][element_id] = {};
    	}

    	obj[element_div][element_id].value = correctval;
    	return obj;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let step_xml;
    	let smans = {};
    	let usans = {};
    	let element_id, element_div = "";
    	let cdata = "";
    	let fill_math = [];
    	var answer_array = [];
    	let var_list = "";
    	let special_module = {};
    	let lists = "";
    	let oldstep = "";
    	let fillId;
    	let steps = 0;
    	let wrong_choice = 0;
    	let optionrem = 0;
    	let flagxml = false;
    	let state = {};
    	let { xml } = $$props;
    	let { stopPreviewUpdate } = $$props;
    	let { isReview } = $$props;
    	let { editorState } = $$props;
    	let { uxml } = $$props;

    	let stateData = writable({
    		blank: true,
    		hideNext: false,
    		itemArray: [],
    		classChange: -1,
    		isColor: true,
    		smController: "h",
    		display: -1,
    		showToolbar: true,
    		isMathquill: false,
    		correct_answer: true,
    		main_steps: false,
    		your_answer: []
    	});

    	const unsubscribe = stateData.subscribe(items => {
    		$$invalidate(5, state = items);
    	});

    	beforeUpdate(() => {
    		if (state.isMathquill) {
    			loadLibs();
    		}

    		if (uxml) {
    			let answer = XMLToJSON(uxml);

    			if (answer.smans) {
    				if (answer.smans.div) {
    					if (answer.smans.div._userAns) {
    						parseSteps(uxml);
    					}
    				}
    			}
    		}

    		//if (this.props.remedStatus != nextProps.remedStatus) {
    		//}
    		if (xml != state.xml) {
    			$$invalidate(5, state.xml = xml, state);
    			if (stopPreviewUpdate == true) return false;

    			if (!uxml) {
    				steps = 0;
    				$$invalidate(5, state.itemArray = [], state);
    				(usans = {});
    				$$invalidate(5, state.hideNext = false, state);
    				reset();
    			}

    			$$invalidate(5, state.blank = false, state);
    			let new_xml = XMLToJSON(state.xml);
    			loadModule(new_xml);
    		}
    	}); // if (state.review != isReview && editorState) {
    	//         stateData.update( (item) => {
    	//             item.review = isReview;
    	//             return item;

    	//         });
    	//         if (isReview) {
    	//             setReview(); 
    	//         } else {
    	//             unsetReview();
    	//         }
    	// }
    	// if (isReview) {
    	// 	var timer = setTimeout(function() {
    	// 		setReview();
    	// 		clearTimeout(timer);
    	// 	},500);	
    	// } else {
    	// 	var timer_next = setTimeout(function() {
    	// 		unsetReview();
    	// 		clearTimeout(timer_next);
    	// 	},200);
    	// }
    	function loadLibs() {
    		let config = {
    			preload: true,
    			type: "stylesheet",
    			as: "style"
    		};

    		AH.createLink(themeUrl + "prepengine/mathquill.css", config);
    	}

    	// $: {
    	// 	if(state.isMathquill) {
    	// 		alert('checking');
    	// 		loadLibs();
    	// 	}
    	// }
    	onMount(() => {
    		window.J = jquery;
    		AI.set("stepAlgo", this);

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		setTimeout(
    			function () {
    				//jQuery('.toolbar_container_one').addClass('h-imp');
    				AH.selectAll(".toolbar_container_one", "addClass", "h-imp");
    			},
    			100
    		);

    		// jQuery(document).on('click keyup change focus', '.edit_step', function(e) {
    		// 	console.log(e.type);
    		// 	let element = jQuery(this);
    		// 	if (element.hasClass('mathquill')) {
    		// 		mathquillAns(element, false);	
    		// 	} else {
    		// 		let inp_id = element.attr('id');	
    		// 		let inp_div = element.closest('div').attr('seq');
    		// 		let inp_val = element.val();
    		// 		usans = createAns(usans, inp_id, inp_div, inp_val);
    		// 		special_module.usans = usans;
    		// 		let smans_overall = smans;
    		// 		setUserAns(usans);
    		// 	}
    		// });
    		AH.listen(document, "click", ".edit_step", _element => {
    			setOutline(_element);
    		});

    		AH.listen(document, "keyup", ".edit_step", _element => {
    			setOutline(_element);
    		});

    		AH.listen(document, "change", ".edit_step", _element => {
    			setOutline(_element);
    		});

    		// document.querySelector('.edit_step').addEventListener('focus', (_element)=>{
    		// 	console.log('event lishener =>'+_element);
    		// })
    		/*jQuery(document).on("click", "span.mq-editable-field.mq-focused", function(event) {
    	console.log('checking mathquill');
    	let is_fillid = true;
    	let fillid;
    	let span_math = jQuery(this);
    	while(is_fillid) {
    		span_math = span_math.parent();
    		if (span_math.attr('id')) {
    			is_fillid = false;
    			fillid = span_math.attr('id');
    			fillId = fillid;
    		}
    	}
    	
    	let latex_array = [];
    	jQuery("#" +fillid + " span.mq-editable-field").map(function() {
    		let command_id = jQuery(this).attr('mathquill-command-id');
    		latex_array.push(command_id);
    	}).get();
    	let math_id = jQuery(this).attr('mathquill-command-id');
    	let index_id = latex_array.indexOf(math_id);
    	state.spanId = index_id;
    	state.divId = fillid;
    	
    	jQuery('.toolbar_container_one').removeClass('h-imp');
    	state.showToolbar = true;
    	
    });*/
    		AH.listen(document, "click", "span.mq-editable-field.mq-focused", _e => {
    			let span_math = _e;
    			let is_fillid = true;
    			let fillid;

    			while (is_fillid) {
    				span_math = span_math.parentElement;

    				if (span_math.getAttribute("id")) {
    					is_fillid = false;
    					fillid = span_math.getAttribute("id");
    					$$invalidate(4, fillId = fillid);
    				}
    			}

    			//let latex_array = [];
    			// jQuery("#" +fillid + " span.mq-editable-field").map(function() {
    			// 	console.log('checking map');
    			// 	let command_id = jQuery(this).attr('mathquill-command-id');
    			// 	latex_array.push(command_id);
    			// }).get();
    			let latex_array = [];

    			AH.selectAll("#" + fillid + " span.mq-editable-field").forEach(_this => {
    				let command_id = _this.getAttribute("mathquill-command-id");
    				latex_array.push(command_id);
    			}); // Need to fixed it

    			//let math_id = jQuery(this).attr('mathquill-command-id');
    			//let index_id = latex_array.indexOf(math_id);
    			let math_id = _e.getAttribute("mathquill-command-id");

    			let index_id = latex_array.indexOf(math_id);
    			$$invalidate(5, state.spanId = index_id, state);
    			$$invalidate(5, state.divId = fillid, state);
    			AH.selectAll(".toolbar_container_one", "removeClass", "h-imp");
    			$$invalidate(5, state.showToolbar = true, state);
    		});

    		// jQuery(document).on('click', '.next_step', function(e) {
    		// 	if (typeof QUIZPLAYERID != "undefined") {
    		// 		window.parent.autoResize(QUIZPLAYERID);
    		// 	}
    		// 	e.preventDefault();
    		// 	inputFilled();
    		// });
    		AH.listen(document, "click", ".next_step", function (curr, e) {
    			if (typeof QUIZPLAYERID != "undefined") {
    				window.parentElement.autoResize(QUIZPLAYERID);
    			}

    			e.preventDefault();
    			inputFilled();
    		});

    		// setTimeout(function() {
    		// 	jQuery("#set-review").on('click', function() {
    		// 		setReview();
    		// 	});
    		// 	jQuery("#unset-review").on('click', function() {
    		// 		unsetReview();
    		// 	});
    		// },1000);
    		setTimeout(
    			function () {
    				AH.listen(document, "click", "#set-review", function () {
    					setReview();
    				});

    				AH.listen(document, "click", "#unset-review", function () {
    					unsetReview();
    				});
    			},
    			1000
    		);

    		if (window.inNative) {
    			setTimeout(
    				function () {
    					window.postMessage("height___" + document.getElementsByClassName("inNativeStyle")[0].offsetHeight, "*");
    				},
    				200
    			);
    		}

    		if (window.inNative) {
    			window.checkReview = isReview => isReview ? self.setReview() : self.unsetReview();
    			AH.addScript("https://ucertify.com/themes/bootstrap4/prepengine/mathquill.js"); //This file should be downloaded and used locally.
    		} else {
    			//console.log("checking path =>"+editor.baseUrlTheme+"prepengine/mathquill.js");
    			AH.addScript("", editor.baseUrlTheme + "clsSMStepAlgo/libs/mathQuill_new.js", {
    				callback() {
    					
    				}
    			});
    		}
    	});

    	function setOutline(_element) {
    		if (_element.nodeName) {
    			if (_element.classList.contains("mathquill")) {
    				mathquillAns(_element, false);
    			} else {
    				let inp_id = _element.getAttribute("id");
    				let inp_div = _element.closest("div").getAttribute("seq");
    				let inp_val = _element.value;
    				usans = createAns(usans, inp_id, inp_div, inp_val);
    				setUserAns(usans);
    			}
    		}
    	}

    	function inputFilled() {
    		if (usans) {
    			for (let i in usans) {
    				for (let key in usans[i]) {
    					let ans_val = usans[i][key].value;

    					if (ans_val != "") {
    						let ans_arr = ans_val.match(/MathQuillMathField\{(.*?)\}/g);

    						if (ans_arr) {
    							ans_arr.map(function (obj) {
    								let math_field = obj.toString().replace(/MathQuillMathField\{|\}/g, "");

    								if (math_field == "") {
    									//jQuery("#"+key).removeClass('answer_input');
    									AH.select("#" + key, "removeClass", "answer_input");
    								} else {
    									//jQuery("#"+key).addClass('answer_input');
    									AH.select("#" + key, "addClass", "answer_input");
    								}
    							});
    						} else {
    							//jQuery("#"+key).addClass('answer_input');
    							AH.select("#" + key, "addClass", "answer_input");
    						}
    					} else {
    						//jQuery("#"+key).removeClass('answer_input');
    						AH.select("#" + key, "removeClass", "answer_input");
    					}
    				}
    			}
    		}
    	}

    	function loadModule(new_xml) {
    		flagxml = false;

    		if (new_xml.smxml.algo != "undefined" && new_xml.smxml.algo) {
    			flagxml = true;
    		}

    		if (flagxml) {
    			var_list = Step.init(new_xml.smxml.algo);
    		}

    		let xml_str = JSON.stringify(new_xml);

    		if (flagxml) {
    			if (uxml) {
    				let answer = XMLToJSON(uxml);

    				if (answer.smans) {
    					if (answer.smans.div) {
    						if (answer.smans.div._lists) {
    							var_list = lists;
    						}
    					}
    				}
    			}

    			step_xml = Step.init.replaceVariables(xml_str, var_list);
    			step_xml = JSON.parse(step_xml);
    		} else {
    			step_xml = new_xml;
    		}

    		let answer_arr_clone = step_xml.smxml.step;
    		$$invalidate(2, answer_array = answer_arr_clone.slice());

    		if (typeof Object.assign != "function") {
    			Object.assign = function (target) {

    				if (target == null) {
    					throw new TypeError("Cannot convert undefined or null to object");
    				}

    				target = Object(target);

    				for (var index = 1; index < arguments.length; index++) {
    					var source = arguments[index];

    					if (source != null) {
    						for (var key in source) {
    							if (Object.prototype.hasOwnProperty.call(source, key)) {
    								target[key] = source[key];
    							}
    						}
    					}
    				}

    				return target;
    			};
    		}

    		answer_arr_clone.map(function (item, i) {
    			$$invalidate(2, answer_array[i] = Object.assign({}, item), answer_array);
    		});

    		if (oldstep != "") {
    			steps = oldstep;

    			for (let i = 0; i <= oldstep; i++) {
    				createStep(i);
    			}
    		} else {
    			createStep();
    		}

    		if (uxml) {
    			let answer = XMLToJSON(uxml);

    			if (answer.smans) {
    				if (answer.smans.div) {
    					if (answer.smans.div._userAns) {
    						var timer = setTimeout(
    							function () {
    								parseUserAns(uxml);
    								clearTimeout(timer);
    							},
    							50
    						);
    					}
    				}
    			}
    		}
    	}

    	function parseUserAns(uans) {
    		let user_answer = XMLToJSON(uans);

    		if (user_answer.smans && user_answer.smans.div && user_answer.smans.div._userAns) {
    			user_answer = JSON.parse(user_answer.smans.div._userAns);

    			for (let i in user_answer) {
    				for (let j in user_answer[i]) {
    					let runn = i.split("");
    					let val = runn[1];
    					let box_value = user_answer[i][j].value;

    					if (AH.select("#" + j).classList.contains("mathquill")) {
    						//jQuery('#'+j).attr('userans', box_value);
    						AH.select("#" + j, "userans", box_value);

    						mathquillAns("#" + j, "math_user");
    					} else {
    						//jQuery('#'+j).val(box_value).focus().blur(); 
    						AH.select("#" + j).value = box_value;

    						setOutline(AH.select("#" + j));
    					}

    					optionrem = 0;
    					inputFilled();
    					checkAns(val);
    				}
    			}
    		} //forceUpdate();
    	}

    	function createStep(i) {
    		if (flagxml) {
    			$$invalidate(3, special_module.var_list = var_list, special_module);
    		}

    		$$invalidate(3, special_module.cuurentStep = steps, special_module);
    		optionrem = 0;
    		const item = state.itemArray;
    		parseXmlAuthoring(step_xml, i);
    		item.push({ cdata });
    		$$invalidate(5, state.itemArray = item, state);

    		if (i <= oldstep) {
    			var curr = i;
    		} else {
    			var curr = steps;
    		}

    		var timer = setTimeout(
    			function () {
    				if (step_xml.smxml.step[curr + 1] == undefined && step_xml.smxml.step[curr]._attempt == "1" || step_xml.smxml.step[curr + 1] == undefined && step_xml.smxml.step[curr]._viewonly == "1") ;

    				clearTimeout(timer);
    			},
    			500
    		);
    	}

    	function reset() {
    		//jQuery(document).find('.sticky').removeClass('sticky');
    		AH.find(document, ".sticky", {
    			action: "removeClass",
    			actionData: "sticky"
    		});

    		//jQuery('.edit_step').removeAttr('disabled');
    		AH.selectAll(".edit_step", "removeAttr", "disabled");

    		//jQuery('.edit_step').val('');
    		AH.selectAll(".edit_step").value = "";
    	}

    	function parseXmlAuthoring(MYXML, user_xml) {
    		if (user_xml <= oldstep) {
    			cdata = MYXML.smxml.step[user_xml].__cdata;
    			creatingInteractive(user_xml, cdata);
    		} else {
    			if (MYXML.smxml.step[steps] != undefined) {
    				cdata = MYXML.smxml.step[steps].__cdata;
    				creatingInteractive(user_xml, cdata);
    			}
    		}
    	}

    	function creatingInteractive(user_xml, cdata, index) {
    		let answer_key = cdata.match(/%{[\s\S]*?}%/gm);
    		let answer_type = "";

    		if (answer_key) {
    			//jQuery(answer_key).each(function(i) {
    			answer_key.forEach(function (data, i) {
    				if (index != undefined) {
    					var org_cdata = answer_array[index].__cdata;
    				}
    				let originalKey = answer_key[i];
    				answer_type = answer_key[i].match(/\|(.*?)}%$/gm);
    				answer_type = answer_type ? answer_type[0].replace(/\||}%/gm, "") : "";
    				answer_type = answer_type.trim();

    				if (answer_type == "" || answer_type == "c") {
    					if (index != undefined) {
    						createTextbox(originalKey, i, user_xml, index, org_cdata);
    					} else {
    						createTextbox(originalKey, i, user_xml);
    					}
    				} else if (answer_type == "n") {
    					if (index != undefined) {
    						createTextbox(originalKey, i, user_xml, index, org_cdata);
    					} else {
    						createTextbox(originalKey, i, user_xml);
    					}
    				} else if (answer_type == "e") {
    					$$invalidate(5, state.isMathquill = true, state);

    					if (index != undefined) {
    						createMathDiv(originalKey, i, user_xml, index, org_cdata);
    					} else {
    						createMathDiv(originalKey, i, user_xml);
    					}
    				}
    			});
    		} else {
    			return "";
    		}
    	}

    	function isSticky(index) {
    		if (step_xml.smxml.step[index] != undefined) {
    			if (step_xml.smxml.step[index]._sticky == 1) {
    				return "sticky";
    			}
    		}
    	}

    	function toggleToolbar(value) {
    		$$invalidate(5, state.showToolbar = value, state);
    	}

    	function moveNext() {
    		if (typeof QUIZPLAYERID != "undefined") {
    			var timer = setTimeout(
    				function () {
    					window.parentElement.autoResize(QUIZPLAYERID);
    					clearTimeout(timer);
    				},
    				0
    			);
    		}

    		if (step_xml.smxml.step[steps + 1] != undefined || step_xml.smxml.step[steps]._attempt == "1") {
    			if (step_xml.smxml._gonext == 1) {
    				nextbtnAnswer();
    			} else {
    				if (step_xml.smxml.step[steps]._attempt == 1) {
    					if (AH.selectAll(".edit_step").length == AH.selectAll(".answer_input").length) {
    						checkAns();
    					} else {
    						notFilled();
    					}
    				} else {
    					nextStep();
    					addSticky();
    				}
    			}

    			if (step_xml.smxml.step.length <= step_xml.smxml.step[steps]._seq && step_xml.smxml.step[steps]._attempt != 1) {
    				$$invalidate(5, state.hideNext = true, state);
    			}
    		} else {
    			$$invalidate(5, state.hideNext = true, state);
    		}
    	}

    	function nextStep() {
    		// jQuery('.edit_step').each(function() {		
    		// 	if (jQuery(this).hasClass('mathquill')) {	
    		// 		jQuery(this).prevAll('.disable_div').removeClass('h');		
    		// 	} else {		
    		// 		//jQuery(this).prop('disabled', 'disabled');
    		// 	}		
    		// 	jQuery(this).addClass('data-check');		
    		// });
    		AH.selectAll(".edit_step").forEach(_this => {
    			if (_this.classList.contains("mathquill")) {
    				if (_this.previousElementSibling.classList.contains("disable_div")) {
    					AH.select(_this.previousElementSibling, "removeClass", "h");
    				}
    			} else {
    				_this.disabled = true;
    			}

    			_this.classList.add("data-check");
    		});

    		optionrem = 0;

    		if (step_xml.smxml.step[steps + 1] == undefined && step_xml.smxml.step[steps]._attempt == "1") {
    			$$invalidate(5, state.hideNext = true, state);
    			setUserAns(usans);
    			overAll();
    			return;
    		}

    		if (steps != step_xml.smxml.step.length - 1) {
    			steps += 1;
    			createStep();
    			setUserAns(usans);
    			overAll();
    		} else {
    			console.log("All steps are attempted");
    		}
    	}

    	function setUserAns(user_ans) {
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		ISSPECIALMODULEUSERXMLCHANGE = 1;

    		var cond = flagxml
    		? "lists=" + JSON.stringify(special_module.var_list)
    		: " ";

    		//jQuery("#special_module_user_xml").val("<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>");
    		AH.select("#special_module_user_xml").value = "<smans><div " + cond + " currStep='" + steps + "' userAns='" + JSON.stringify(user_ans) + "'></div></smans>";
    	} // if(document.querySelector("#special_module_user_xml")!=null) {
    	// 	document.querySelector("#special_module_user_xml").value = "<smans><div "+ cond +" currStep='"+steps+"' userAns='"+JSON.stringify(user_ans)+"'></div></smans>";

    	// }
    	function overAll() {
    		let over = false;
    		let userAnswers = null;
    		let inNativeIsCorrect = false;

    		if (step_xml.smxml.step.length == state.itemArray.length) {
    			let check = true;

    			for (let i in smans) {
    				if (smans[i].overall != undefined) {
    					if (smans[i].overall == 1) {
    						over = true;
    					} else {
    						over = false;
    					}

    					check = check && over;
    				}

    				if (check == false) {
    					//jQuery("#answer").prop("checked", false);
    					AH.select("#answer").checked = false;

    					inNativeIsCorrect = false;
    				} else {
    					//jQuery("#answer").prop("checked", true);
    					if (document.querySelector("#answer") != null) {
    						document.querySelector("#answer").checked = true;
    						inNativeIsCorrect = true;
    					}
    				}
    			}
    		}

    		//userAnswers = jQuery('#special_module_user_xml').val();
    		if (document.querySelector("#special_module_user_xml") != null) userAnswers = document.querySelector("#special_module_user_xml").value;

    		if (window.inNative) {
    			window.postMessage("height___" + document.getElementsByClassName("inNativeStyle")[0].offsetHeight, "*");
    			window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect }), "*");
    		}
    	}

    	function addSticky() {
    		//jQuery('[data-sticky]').addClass('sticky');
    		AH.select("[data-sticky]", "addClass", "sticky");
    	}

    	function createTextbox(data, i, user_xml, index, org_cdata) {
    		let original_data = data;
    		data = data.replace(/%{|}%/g, "");
    		data = data.split("|");
    		let codetype = data[1] && data[1].trim() == "n" ? "1" : "";
    		let corr_ans = data[0].trim();
    		let csStyle = "";

    		if (corr_ans.indexOf("#style#") != -1) {
    			let customStyle = corr_ans.split("#style#");
    			corr_ans = customStyle[0];
    			csStyle = customStyle[1];
    		}

    		let txtWidth = [];
    		let anslen = corr_ans.split(",");

    		// jQuery(anslen).each(function(j){
    		// 	txtWidth[j] = ((anslen[j].length)*10+30)
    		// });
    		anslen.forEach(function (data, j) {
    			txtWidth[j] = anslen[j].length * 10 + 30;
    		});

    		if (index != undefined) {
    			textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i, index, org_cdata);
    		} else {
    			textBox(data, txtWidth, csStyle, original_data, user_xml, corr_ans, i);
    		}
    	}

    	function textBox(
    		data,
    	txtWidth,
    	csStyle,
    	original_data,
    	user_xml,
    	corr_ans,
    	i,
    	index,
    	org_cdata
    	) {
    		if (index != undefined) {
    			element_id = "s" + index + "_t" + i;
    			element_div = "s" + index;
    			let textbox = "<input type=\"text\" id=\"" + element_id + "\" class=\"fillintheblank ks nmb text-center span0 edit_st\" defaultans=\"\" haskeywords=\"\"  hasnotkeywords=\"\" keywordtype=\"\" autocomplete=\"off\" data-role=\"none\" style=\"width:" + (Math.max(...txtWidth) + 20) + "px;" + csStyle + "\" />";
    			let tag = "<span id=\"" + element_div + "\" class=\"text-center filter fillelement inline-block\"><span class=\"remed_disable fh fwidth absolute h\"></span><span id=\"text\" class=\"corr_div\">" + data[0] + "</span>" + textbox + "</span>";
    			let cd_ans = org_cdata.replace(original_data, tag);
    			$$invalidate(2, answer_array[index].__cdata = cd_ans, answer_array);
    		} else {
    			if (user_xml <= oldstep) {
    				var steps_counter = user_xml;
    			} else {
    				var steps_counter = steps;
    			}

    			element_id = "s" + steps_counter + "_t" + i;
    			element_div = "s" + steps_counter;
    			let textbox = "<input type=\"text\" id=\"" + element_id + "\" class=\"fillintheblank ks nmb text-center span0 edit_step\" defaultans=\"\" haskeywords=\"\"  hasnotkeywords=\"\" keywordtype=\"\" autocomplete=\"off\" data-role=\"none\"  style=\"width:" + (Math.max(...txtWidth) + 20) + "px;" + csStyle + "\" />";
    			let tag = "<span id=\"" + element_div + "\" class=\"text-center filter fillelement inline-block\"><span class=\"remed_disable fh fwidth absolute h\"></span><span id=\"\" class=\"corr_div h-imp\">" + data[0] + "</span>" + textbox + "</span>";
    			cdata = cdata.replace(original_data, tag);
    			smans = createAns(smans, element_id, element_div, corr_ans);
    			$$invalidate(3, special_module.smans = smans, special_module);
    		}
    	}

    	/*function notFilled() {
    	jQuery('.edit_step').each(function(i, obj) {
    		let element = jQuery(this);
    		if (!jQuery(this).hasClass('answer_input')) {
    			element.css({border: '2px solid #ff0000'});
    			var timer = setTimeout(function() {
    				element.css({border: '1px solid #ccc'});
    				clearTimeout(timer);
    			}, 500);
    		}
    		return; 
    	});
    }*/
    	function notFilled() {
    		AH.selectAll(".edit_step").forEach(_element => {
    			if (!_element.classList.contains("answer_input")) {
    				_element.style.border = "2px solid #ff0000";

    				var timer = setTimeout(
    					function () {
    						_element.style.border = "1px solid #ccc";
    						clearTimeout(timer);
    					},
    					500
    				);
    			}

    			return;
    		});
    	}

    	function checkAns(j) {
    		wrong_choice = 0;
    		optionrem += 1;

    		for (let i in smans) {
    			for (let prop in smans[i]) {
    				if (j < oldstep) {
    					var curr = j;
    				} else {
    					var curr = steps;
    				}

    				//try {
    				if (usans["s" + curr] && usans["s" + curr][prop] != undefined) {
    					if (smans["s" + curr][prop].value == usans["s" + curr][prop].value) {
    						inputHover("correct", prop);
    					} else if ((/\,/g).test(smans["s" + curr][prop].value)) {
    						let s_ans = smans["s" + curr][prop].value.split(",");
    						let u_ans = usans["s" + curr][prop].value;

    						if (s_ans.indexOf(u_ans) > -1) {
    							inputHover("correct", prop);
    						} else {
    							wrong_choice = 1;
    							inputHover("wrong", prop);
    						}
    					} else {
    						wrong_choice = 1;
    						inputHover("wrong", prop);
    					}
    				}
    			} //} catch(e) {
    			//	console.warn(e);
    		} //}

    		if (step_xml.smxml.step[steps]._mode == 1) {
    			showAnsMod(j, "s" + j);
    		} else {
    			showAns(j, "s" + j);
    		}
    	}

    	function inputHover(option, elem) {
    		if (step_xml.smxml.step[steps]._mode != 1) {
    			if (option == "correct") {
    				//jQuery('#'+elem).removeClass('false-hover');
    				AH.select("#" + elem, "removeClass", "false-hover");

    				//jQuery('#'+elem).addClass('true-hover');
    				AH.select("#" + elem, "addClass", "true-hover");
    			} else if (option == "wrong") {
    				//jQuery('#'+elem).removeClass('true-hover');
    				AH.select("#" + elem, "removeClass", "true-hover");

    				//jQuery('#'+elem).addClass('false-hover');
    				AH.select("#" + elem, "addClass", "false-hover");
    			}

    			if (optionrem > 1) {
    				//jQuery('#'+elem).prev().removeClass('h-imp');
    				AH.select(AI.select("#" + elem).previousElementSibling, "removeClass", "h-imp");
    			}

    			if (step_xml.smxml._fixed != 1) {
    				var timer = setTimeout(
    					function () {
    						//jQuery('#'+elem).prev().addClass('h-imp');
    						AH.select(AI.select("#" + elem).previousElementSibling, "addClass", "h-imp");

    						clearTimeout(timer);
    					},
    					2000
    				);
    			}
    		}

    		if (uxml) {
    			//jQuery('.edit_step').each(function(i, obj) {
    			AH.selectAll(".edit_step").forEach(function (obj, i) {
    				//if (jQuery(this).hasClass('mathquill')) {
    				if (obj.classList.contains("mathquill")) {
    					//jQuery('#'+elem).prevAll('.disable_div').removeClass('h');	
    					if (AH.select("#" + elem).previousElementSibling.classList.contains("disable_div")) {
    						AH.select(AH.select("#" + elem).previousElementSibling, "removeClass", "h");
    					}
    				} else if (obj.classList.contains("answer_input")) {
    					//jQuery(this).prop('disabled', 'disabled');
    					obj.disabled = true; //} else if(jQuery(this).hasClass('answer_input')) {
    				}

    				//jQuery(this).addClass('data-check');
    				obj.classList.add("data-check");
    			});
    		}
    	}

    	function showAns(j, outer) {
    		var overall = 0;

    		if (wrong_choice > 0) {
    			$$invalidate(5, state.classChange = state.itemArray.length - 1, state);
    			$$invalidate(5, state.isColor = false, state);
    			overall = 0;

    			if (j <= oldstep) {
    				smans[outer].overall = overall;
    			} else {
    				smans[element_div].overall = overall;
    				overAll();
    			}
    		} else {
    			$$invalidate(5, state.classChange = state.itemArray.length - 1, state);
    			$$invalidate(5, state.isColor = true, state);
    			overall = 1;

    			if (j <= oldstep) {
    				smans[outer].overall = overall;
    			} else {
    				smans[element_div].overall = overall;
    				nextStep();
    			}
    		}

    		if (optionrem > 1) {
    			nextStep();
    		}

    		if (usans[element_div] && usans[element_id] != undefined) {
    			usans[element_div].optry = optionrem;
    		}

    		var timer = setTimeout(
    			function () {
    				$$invalidate(5, state.classChange = -1, state);
    				clearTimeout(timer);
    			},
    			2500
    		);
    	}

    	function showAnsMod(j, outer) {
    		var overall = 0;

    		if (wrong_choice > 0) {
    			overall = 0;

    			if (j <= oldstep) {
    				smans[outer].overall = overall;
    			} else {
    				smans[element_div].overall = overall;
    			}
    		} else {
    			overall = 1;

    			if (j <= oldstep) {
    				smans[outer].overall = overall;
    			} else {
    				smans[element_div].overall = overall;
    			}
    		}

    		nextStep();
    	}

    	function setReview() {
    		$$invalidate(0, isReview = true);
    		overAll();
    		yourAnswer();

    		//jQuery('.fillintheblank').prop("disabled", true);
    		document.querySelectorAll(".fillintheblank").disabled = true;
    	}

    	function unsetReview() {
    		$$invalidate(0, isReview = false);
    		$$invalidate(5, state.display = -1, state);
    		$$invalidate(5, state.smController = " h", state);

    		//jQuery('.fillintheblank').removeClass('default-hover');
    		AH.selectAll(".fillintheblank", "removeClass", "default-hover");

    		//jQuery('.fillintheblank').prop("disabled", false);
    		AH.selectAll(".fillintheblank").disabled = false;

    		$$invalidate(5, state.main_steps = false, state);
    		$$invalidate(5, state.correct_answer = true, state);

    		//jQuery('.remed_disable').css('display', 'none');
    		AH.selectAll(".remed_disable", "css", { display: "none" });

    		if (step_xml.smxml.step[steps + 1] == undefined && step_xml.smxml.step[steps]._attempt == "1" || step_xml.smxml.step[steps + 1] == undefined && step_xml.smxml.step[steps]._viewonly == "1") {
    			if (AH.selectAll(".edit_step").length == AH.selectAll(".data-check").length) {
    				$$invalidate(5, state.hideNext = true, state);
    			} else {
    				$$invalidate(5, state.hideNext = false, state);
    			}
    		} else {
    			$$invalidate(5, state.hideNext = false, state);
    		}

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}
    	}

    	function correctAnswer() {
    		//handleToggle(1);
    		$$invalidate(5, state.display = -1, state);

    		//jQuery('.fillintheblank').addClass('default-hover');
    		AH.selectAll(".fillintheblank", "addClass", "default-hover");

    		showCorrect();
    		$$invalidate(5, state.main_steps = true, state);
    		$$invalidate(5, state.correct_answer = false, state);

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}
    	}

    	function showCorrect() {
    		let show_ans = step_xml.smxml.step;

    		show_ans.map(function (item, index) {
    			let cdata_ans = item.__cdata;
    			let org_cdata = cdata_ans;
    			creatingInteractive("corr_ans", org_cdata, index);
    		});
    	}

    	function yourAnswer() {
    		//handleToggle(2);
    		$$invalidate(5, state.display = 1, state);

    		$$invalidate(5, state.hideNext = true, state);
    		$$invalidate(5, state.smController = "", state);

    		//$('.fillintheblank').removeClass('default-hover');
    		AH.selectAll(".fillintheblank", "removeClass", "default-hover");

    		$$invalidate(5, state.main_steps = false, state);
    		$$invalidate(5, state.correct_answer = true, state);

    		//jQuery('.remed_disable').css('display', 'block');
    		AH.selectAll(".remed_disable", "css", { display: "block" });

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}
    	}

    	function parseSteps(steps) {
    		let user_step = XMLToJSON(steps);

    		if (flagxml) {
    			lists = JSON.parse(user_step.smans.div._lists);
    		}

    		oldstep = JSON.parse(user_step.smans.div._currStep);
    	}

    	function nextbtnAnswer() {
    		let current = `s${steps}`;

    		//let textboxes = jQuery('#'+current).find('.edit_step');
    		let textboxes = AH.find("#" + current, ".edit_step", "all");

    		textboxes.forEach(function (item, index) {
    			if (item.classList.contains("mathquill")) {
    				mathquillAns(item, false);
    			} else {
    				//let inp_id = jQuery(item).attr('id');
    				let inp_id = item.getAttribute("id");

    				//let inp_val = jQuery(item).val();
    				let inp_val = item.value;

    				usans = createAns(usans, inp_id, current, inp_val);
    			}
    		});

    		if (step_xml.smxml.step[steps]._attempt == 1) {
    			checkAns();
    		} else {
    			nextStep();
    			addSticky();
    		}
    	}

    	// AH.createLink('../clsSMFill/css/fillintheblank.css');
    	//To handle review toggle
    	function handleReview(mode, event) {
    		if (mode == "c") {
    			correctAnswer();
    		} else {
    			yourAnswer();
    		}
    	}

    	function createMathDiv(data, i, user_xml, index, org_cdata) {
    		let original_data = data;
    		data = data.replace(/%{|}%/g, "");
    		data = data.split("|");
    		data[0] = data[0].replace(/user Response/g, "\\MathQuillMathField");

    		// let split_data = addMathquill.split("##");
    		let split_data = data[0].split("##");

    		let random_key = Math.floor(Math.random() * split_data.length);
    		let random_option = split_data[random_key];
    		let userans = random_option.replace(/MathQuillMathField{(.*?)}/g, "MathQuillMathField{}");
    		let defaultans = 0;
    		let anskey = random_option;
    		let answer_element = anskey.replace(/\\MathQuillMathField/g, "");

    		if (random_option.indexOf("MathQuillMathField") > -1) {
    			anskey = random_option;
    			defaultans = 1;
    		}

    		if (index != undefined) {
    			mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element, index, org_cdata);
    		} else {
    			mathQuill(userans, data, original_data, user_xml, i, random_key, defaultans, anskey, answer_element);
    		}
    	}

    	function mathQuill(
    		userans,
    	data,
    	original_data,
    	user_xml,
    	i,
    	random_key,
    	defaultans,
    	anskey,
    	answer_element,
    	index,
    	org_cdata
    	) {
    		let corr_ans = data[0].trim();

    		if (user_xml <= oldstep) {
    			var steps_counter = user_xml;
    		} else {
    			var steps_counter = steps;
    		}

    		if (index != undefined) {
    			element_id = "s0" + index + "_t" + i;
    			element_div = "s0" + index;
    			let ans_id = "m0" + index + "_t" + i;
    			let matheq = "<span  id=\"" + element_id + "\" class=\"auto_height edit_st fillmathelement mathquill mq" + steps_counter + "\" userAnsSeq=\"" + random_key + "\" userans=\"" + userans + "\" anskey=\"" + anskey + "\" defaultans=\"" + defaultans + "\" mathtype=\"1\">" + "s" + "</span>";
    			let tag = "<span id=\"" + element_div + "\" class=\"text-center filter fillelement inline-block\"><span class=\"disable_div fh fwidth absolute h\"></span><span class=\"remed_disable fh fwidth absolute h\"></span><span  id=\"" + ans_id + "\" class=\"corr_div fillmathelement mathquill mq" + steps_counter + "\" userAnsSeq=\"" + random_key + "\" anskey=\"" + anskey + "\" defaultans=\"" + defaultans + "\" mathtype=\"1\">" + answer_element + "</span>" + matheq + "</span>";
    			let cd_ans = org_cdata.replace(original_data, tag);
    			$$invalidate(2, answer_array[index].__cdata = cd_ans, answer_array);
    		} else {
    			element_id = "s" + steps_counter + "_t" + i;
    			element_div = "s" + steps_counter;
    			let ans_id = "m" + steps_counter + "_t" + i;
    			let matheq = "<span  id=\"" + element_id + "\" class=\"auto_height edit_step fillmathelement mathquill mq" + steps_counter + "\" userAnsSeq=\"" + random_key + "\" userans=\"" + userans + "\" anskey=\"" + anskey + "\" defaultans=\"" + defaultans + "\" mathtype=\"1\">" + "s" + "</span>";
    			let tag = "<span id=\"" + element_div + "\" class=\"text-center filter fillelement inline-block\"><span class=\"disable_div fh fwidth absolute h\"></span><span class=\"remed_disable fh fwidth absolute h\"></span><span  id=\"" + ans_id + "\" class=\"corr_div h-imp fillmathelement mathquill mq" + steps_counter + "\" userAnsSeq=\"" + random_key + "\" anskey=\"" + anskey + "\" defaultans=\"" + defaultans + "\" mathtype=\"1\">" + answer_element + "</span>" + matheq + "</span>";
    			cdata = cdata.replace(original_data, tag);
    			smans = createAns(smans, element_id, element_div, corr_ans);
    			$$invalidate(3, special_module.smans = smans, special_module);
    		}

    		let time_interval = setInterval(
    			(function () {
    				if (typeof MathQuill == "function") {
    					clearInterval(time_interval);
    					let MQ = MathQuill.getInterface(2);

    					//jQuery(".mathquill.mq"+steps_counter).each(function() {
    					AH.selectAll(".mathquill.mq" + steps_counter).forEach(_this => {
    						//let math_itemid  = jQuery(this).attr('id');
    						let math_itemid = _this.getAttribute("id");

    						//let defaultans = jQuery(this).attr('defaultans');
    						let defaultans = _this.getAttribute("defaultans");

    						if (defaultans == 1) {
    							//let latex = jQuery(this).attr('userans');
    							let latex = _this.getAttribute("userans");

    							//jQuery('#'+math_itemid).text(latex);
    							AH.select("#" + math_itemid).innerText = latex;
    						} else {
    							//jQuery('#'+math_itemid).text(jQuery(this).attr('userans'));
    							AH.select("#" + math_itemid).innerText = _this.getAttribute("userans");
    						}

    						try {
    							$$invalidate(1, fill_math[math_itemid] = MQ.StaticMath(document.getElementById(math_itemid)), fill_math);
    						} catch(e) {
    							console.log(e);
    						}
    					});
    				}
    			}).bind(this),
    			100
    		);
    	}

    	function mathquillAns(element, math_user) {
    		let innerfield = [];
    		let div_outer = jQuery(element).closest("div").find("span.fillelement").attr("id");
    		let math_itemid = jQuery(element).attr("id");
    		let original_latex = jQuery(element).attr("userans").trim();
    		let userans;

    		if (math_user == "math_user") {
    			userans = original_latex;
    		} else {
    			let MQ = MathQuill.getInterface(2);
    			let math_item = MQ.StaticMath(document.getElementById(math_itemid));

    			for (let i = 0; i <= math_item.innerFields.length - 1; i++) {
    				innerfield[i] = math_item.innerFields[i].latex();
    			}

    			let new_math_field = original_latex;

    			// let mathfield = original_latex.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);
    			let mathfield = original_latex.match(/\\MathQuillMathField{(.*?)\}/g);

    			for (let i in mathfield) {
    				const create_mathfield = "\\MathQuillMathField{" + innerfield[i] + "}";

    				// const new_mathfield = mathfield[i].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g , create_mathfield);
    				const new_mathfield = mathfield[i].replace(/\\MathQuillMathField{(.*?)\}/g, create_mathfield);

    				let regex = mathfield[i];
    				new_math_field = new_math_field.replace(regex, new_mathfield);
    			}

    			original_latex = new_math_field;
    			userans = original_latex;
    		}

    		usans = createAns(usans, math_itemid, div_outer, userans);
    		setUserAns(usans);
    	}

    	const func = value => {
    		toggleToolbar(value);
    	};

    	const click_handler = () => setTimeout(
    		function () {
    			moveNext();
    		},
    		100
    	);

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(12, xml = $$props.xml);
    		if ("stopPreviewUpdate" in $$props) $$invalidate(13, stopPreviewUpdate = $$props.stopPreviewUpdate);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("editorState" in $$props) $$invalidate(14, editorState = $$props.editorState);
    		if ("uxml" in $$props) $$invalidate(15, uxml = $$props.uxml);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isReview*/ 1) {
    			 {
    				if (isReview) {
    					var timer = setTimeout(
    						function () {
    							setReview();
    							clearTimeout(timer);
    						},
    						500
    					);
    				} else {
    					var timer_next = setTimeout(
    						function () {
    							unsetReview();
    							clearTimeout(timer_next);
    						},
    						200
    					);
    				}
    			}
    		}
    	};

    	return [
    		isReview,
    		fill_math,
    		answer_array,
    		special_module,
    		fillId,
    		state,
    		isSticky,
    		toggleToolbar,
    		moveNext,
    		setReview,
    		unsetReview,
    		handleReview,
    		xml,
    		stopPreviewUpdate,
    		editorState,
    		uxml,
    		func,
    		click_handler
    	];
    }

    class StepAlgoPreview extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1$2.getElementById("svelte-142veau-style")) add_css$2();

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				xml: 12,
    				stopPreviewUpdate: 13,
    				isReview: 0,
    				editorState: 14,
    				uxml: 15
    			},
    			[-1, -1, -1]
    		);
    	}
    }

    const defXMl = '';

    const app = new StepAlgoPreview({
    	target: document.getElementById(window.moduleContainer) || document.body,
    	props: {
    		xml: window.QXML || defXMl,
    		uxml: window.uaXML,
    		ansStatus: 0,
    		isReview: window.isReviewMode || false,
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle_q37.js.map
