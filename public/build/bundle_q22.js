
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
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

    // Thanks to @AlexxNB

    function getEventsAction(component) {
    	return (node) => {
    		const events = Object.keys(component.$$.callbacks);
    		const listeners = [];

    		events.forEach((event) => listeners.push(listen(node, event, (e) => bubble(component, e))));

    		return {
    			destroy: () => {
    				listeners.forEach((listener) => listener());
    			},
    		};
    	};
    }

    function islegacy() {
    	if (typeof window === 'undefined') return false;
    	return !(window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)'));
    }

    function normalize(color) {
    	if (color.charAt(0) === 'r') {
    		color = rgb2hex(color);
    	} else if (color.toLowerCase() === 'transparent') {
    		color = '#00000000';
    	}

    	return color;
    }

    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    function luminance(color = '#ffffff') {
    	let RsRGB, GsRGB, BsRGB, R, G, B;

    	if (color.length === 0) {
    		color = '#ffffff';
    	}

    	color = normalize(color);

    	// Validate hex color
    	color = String(color).replace(/[^0-9a-f]/gi, '');
    	const valid = new RegExp(/^(?:[0-9a-f]{3}){1,2}$/i).test(color);

    	if (valid) {
    		if (color.length < 6) {
    			color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    		}
    	} else {
    		throw new Error('Invalid HEX color!');
    	}

    	// Convert color to RGB
    	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    	const rgb = {
    		r: parseInt(result[1], 16),
    		g: parseInt(result[2], 16),
    		b: parseInt(result[3], 16),
    	};

    	RsRGB = rgb.r / 255;
    	GsRGB = rgb.g / 255;
    	BsRGB = rgb.b / 255;

    	R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    	G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    	B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }

    function rgb2hex(rgb) {
    	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    	return rgb && rgb.length === 4
    		? '#' +
    				('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    				('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    				('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
    		: '';
    }

    /* node_modules\svelte-mui\src\Ripple.svelte generated by Svelte v3.29.0 */

    const { document: document_1 } = globals;

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-po4fcb-style";
    	style.textContent = ".ripple.svelte-po4fcb{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;border-radius:inherit;color:inherit;pointer-events:none;z-index:0;contain:strict}.ripple.svelte-po4fcb .animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;opacity:0;pointer-events:none;overflow:hidden;will-change:transform, opacity}.ripple.svelte-po4fcb .animation--enter{transition:none}.ripple.svelte-po4fcb .animation--in{transition:opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n\t\t\topacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)}.ripple.svelte-po4fcb .animation--out{transition:opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)}";
    	append(document_1.head, style);
    }

    function create_fragment(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "ripple svelte-po4fcb");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[4](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[4](null);
    		}
    	};
    }

    function isTouchEvent(e) {
    	return e.constructor.name === "TouchEvent";
    }

    function transform(el, value) {
    	el.style["transform"] = value;
    	el.style["webkitTransform"] = value;
    }

    function opacity(el, value) {
    	el.style["opacity"] = value.toString();
    }

    const calculate = (e, el) => {
    	const offset = el.getBoundingClientRect();
    	const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
    	const localX = target.clientX - offset.left;
    	const localY = target.clientY - offset.top;
    	let radius = 0;
    	let scale = 0.3;

    	// Get ripple position
    	const center = el.dataset.center;

    	const circle = el.dataset.circle;

    	if (circle) {
    		scale = 0.15;
    		radius = el.clientWidth / 2;

    		radius = center
    		? radius
    		: radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
    	} else {
    		radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
    	}

    	const centerX = `${(el.clientWidth - radius * 2) / 2}px`;
    	const centerY = `${(el.clientHeight - radius * 2) / 2}px`;
    	const x = center ? centerX : `${localX - radius}px`;
    	const y = center ? centerY : `${localY - radius}px`;
    	return { radius, scale, x, y, centerX, centerY };
    };

    const startRipple = function (eventType, event) {
    	const hideEvents = ["touchcancel", "mouseleave", "dragstart"];
    	let container = event.currentTarget || event.target;

    	if (container && !container.classList.contains("ripple")) {
    		container = container.querySelector(".ripple");
    	}

    	if (!container) {
    		return;
    	}

    	const prev = container.dataset.event;

    	if (prev && prev !== eventType) {
    		return;
    	}

    	container.dataset.event = eventType;

    	// Create the ripple
    	const wave = document.createElement("span");

    	const { radius, scale, x, y, centerX, centerY } = calculate(event, container);
    	const color = container.dataset.color;
    	const size = `${radius * 2}px`;
    	wave.className = "animation";
    	wave.style.width = size;
    	wave.style.height = size;
    	wave.style.background = color;
    	wave.classList.add("animation--enter");
    	wave.classList.add("animation--visible");
    	transform(wave, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
    	opacity(wave, 0);
    	wave.dataset.activated = String(performance.now());
    	container.appendChild(wave);

    	setTimeout(
    		() => {
    			wave.classList.remove("animation--enter");
    			wave.classList.add("animation--in");
    			transform(wave, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
    			opacity(wave, 0.25);
    		},
    		0
    	);

    	const releaseEvent = eventType === "mousedown" ? "mouseup" : "touchend";

    	const onRelease = function () {
    		document.removeEventListener(releaseEvent, onRelease);

    		hideEvents.forEach(name => {
    			document.removeEventListener(name, onRelease);
    		});

    		const diff = performance.now() - Number(wave.dataset.activated);
    		const delay = Math.max(250 - diff, 0);

    		setTimeout(
    			() => {
    				wave.classList.remove("animation--in");
    				wave.classList.add("animation--out");
    				opacity(wave, 0);

    				setTimeout(
    					() => {
    						wave && container.removeChild(wave);

    						if (container.children.length === 0) {
    							delete container.dataset.event;
    						}
    					},
    					300
    				);
    			},
    			delay
    		);
    	};

    	document.addEventListener(releaseEvent, onRelease);

    	hideEvents.forEach(name => {
    		document.addEventListener(name, onRelease, { passive: true });
    	});
    };

    const onMouseDown = function (e) {
    	// Trigger on left click only
    	if (e.button === 0) {
    		startRipple(e.type, e);
    	}
    };

    const onTouchStart = function (e) {
    	if (e.changedTouches) {
    		for (let i = 0; i < e.changedTouches.length; ++i) {
    			startRipple(e.type, e.changedTouches[i]);
    		}
    	}
    };

    function instance($$self, $$props, $$invalidate) {
    	let { center = false } = $$props;
    	let { circle = false } = $$props;
    	let { color = "currentColor" } = $$props;
    	let el;
    	let trigEl;

    	onMount(async () => {
    		await tick();

    		try {
    			if (center) {
    				$$invalidate(0, el.dataset.center = "true", el);
    			}

    			if (circle) {
    				$$invalidate(0, el.dataset.circle = "true", el);
    			}

    			$$invalidate(0, el.dataset.color = color, el);
    			trigEl = el.parentElement;
    		} catch(err) {
    			
    		} // eslint-disable-line

    		if (!trigEl) {
    			console.error("Ripple: Trigger element not found.");
    			return;
    		}

    		let style = window.getComputedStyle(trigEl);

    		if (style.position.length === 0 || style.position === "static") {
    			trigEl.style.position = "relative";
    		}

    		trigEl.addEventListener("touchstart", onTouchStart, { passive: true });
    		trigEl.addEventListener("mousedown", onMouseDown, { passive: true });
    	});

    	onDestroy(() => {
    		if (!trigEl) {
    			return;
    		}

    		trigEl.removeEventListener("mousedown", onMouseDown);
    		trigEl.removeEventListener("touchstart", onTouchStart);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("center" in $$props) $$invalidate(1, center = $$props.center);
    		if ("circle" in $$props) $$invalidate(2, circle = $$props.circle);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    	};

    	return [el, center, circle, color, div_binding];
    }

    class Ripple extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1.getElementById("svelte-po4fcb-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { center: 1, circle: 2, color: 3 });
    	}
    }

    /* node_modules\svelte-mui\src\Button.svelte generated by Svelte v3.29.0 */

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-6bcb3a-style";
    	style.textContent = "button.svelte-6bcb3a:disabled{cursor:default}button.svelte-6bcb3a{cursor:pointer;font-family:Roboto, Helvetica, sans-serif;font-family:var(--button-font-family, Roboto, Helvetica, sans-serif);font-size:0.875rem;font-weight:500;letter-spacing:0.75px;text-decoration:none;text-transform:uppercase;will-change:transform, opacity;margin:0;padding:0 16px;display:-ms-inline-flexbox;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;height:36px;border:none;outline:none;line-height:inherit;user-select:none;overflow:hidden;vertical-align:middle;border-radius:4px}button.svelte-6bcb3a::-moz-focus-inner{border:0}button.svelte-6bcb3a:-moz-focusring{outline:none}button.svelte-6bcb3a:before{box-sizing:inherit;border-radius:inherit;color:inherit;bottom:0;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.2s cubic-bezier(0.25, 0.8, 0.5, 1);will-change:background-color, opacity}.toggle.svelte-6bcb3a:before{box-sizing:content-box}.active.svelte-6bcb3a:before{background-color:currentColor;opacity:0.3}.raised.svelte-6bcb3a{box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 5px 0 rgba(0, 0, 0, 0.12)}.outlined.svelte-6bcb3a{padding:0 14px;border-style:solid;border-width:2px}.shaped.svelte-6bcb3a{border-radius:18px}.dense.svelte-6bcb3a{height:32px}.icon-button.svelte-6bcb3a{line-height:0.5;border-radius:50%;padding:8px;width:40px;height:40px;vertical-align:middle}.icon-button.outlined.svelte-6bcb3a{padding:6px}.icon-button.fab.svelte-6bcb3a{border:none;width:56px;height:56px;box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 18px 0 rgba(0, 0, 0, 0.12)}.icon-button.dense.svelte-6bcb3a{width:36px;height:36px}.icon-button.fab.dense.svelte-6bcb3a{width:40px;height:40px}.outlined.svelte-6bcb3a:not(.shaped) .ripple{border-radius:0 !important}.full-width.svelte-6bcb3a{width:100%}@media(hover: hover){button.svelte-6bcb3a:hover:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}button.focus-visible.svelte-6bcb3a:focus:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.3}button.focus-visible.toggle.svelte-6bcb3a:focus:not(.active):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}}";
    	append(document.head, style);
    }

    // (20:1) {#if ripple}
    function create_if_block(ctx) {
    	let ripple_1;
    	let current;

    	ripple_1 = new Ripple({
    			props: {
    				center: /*icon*/ ctx[3],
    				circle: /*icon*/ ctx[3]
    			}
    		});

    	return {
    		c() {
    			create_component(ripple_1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(ripple_1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const ripple_1_changes = {};
    			if (dirty & /*icon*/ 8) ripple_1_changes.center = /*icon*/ ctx[3];
    			if (dirty & /*icon*/ 8) ripple_1_changes.circle = /*icon*/ ctx[3];
    			ripple_1.$set(ripple_1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(ripple_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(ripple_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(ripple_1, detaching);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let button;
    	let t;
    	let events_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	let if_block = /*ripple*/ ctx[10] && create_if_block(ctx);

    	let button_levels = [
    		{ class: /*className*/ ctx[1] },
    		{ style: /*style*/ ctx[2] },
    		/*attrs*/ ctx[14]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	return {
    		c() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "raised", /*raised*/ ctx[6]);
    			toggle_class(button, "outlined", /*outlined*/ ctx[8] && !(/*raised*/ ctx[6] || /*unelevated*/ ctx[7]));
    			toggle_class(button, "shaped", /*shaped*/ ctx[9] && !/*icon*/ ctx[3]);
    			toggle_class(button, "dense", /*dense*/ ctx[5]);
    			toggle_class(button, "fab", /*fab*/ ctx[4] && /*icon*/ ctx[3]);
    			toggle_class(button, "icon-button", /*icon*/ ctx[3]);
    			toggle_class(button, "toggle", /*toggle*/ ctx[11]);
    			toggle_class(button, "active", /*toggle*/ ctx[11] && /*active*/ ctx[0]);
    			toggle_class(button, "full-width", /*fullWidth*/ ctx[12] && !/*icon*/ ctx[3]);
    			toggle_class(button, "svelte-6bcb3a", true);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			append(button, t);
    			if (if_block) if_block.m(button, null);
    			/*button_binding*/ ctx[20](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button, "click", /*onclick*/ ctx[16]),
    					action_destroyer(events_action = /*events*/ ctx[15].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
    				}
    			}

    			if (/*ripple*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*ripple*/ 1024) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty & /*className*/ 2) && { class: /*className*/ ctx[1] },
    				(!current || dirty & /*style*/ 4) && { style: /*style*/ ctx[2] },
    				dirty & /*attrs*/ 16384 && /*attrs*/ ctx[14]
    			]));

    			toggle_class(button, "raised", /*raised*/ ctx[6]);
    			toggle_class(button, "outlined", /*outlined*/ ctx[8] && !(/*raised*/ ctx[6] || /*unelevated*/ ctx[7]));
    			toggle_class(button, "shaped", /*shaped*/ ctx[9] && !/*icon*/ ctx[3]);
    			toggle_class(button, "dense", /*dense*/ ctx[5]);
    			toggle_class(button, "fab", /*fab*/ ctx[4] && /*icon*/ ctx[3]);
    			toggle_class(button, "icon-button", /*icon*/ ctx[3]);
    			toggle_class(button, "toggle", /*toggle*/ ctx[11]);
    			toggle_class(button, "active", /*toggle*/ ctx[11] && /*active*/ ctx[0]);
    			toggle_class(button, "full-width", /*fullWidth*/ ctx[12] && !/*icon*/ ctx[3]);
    			toggle_class(button, "svelte-6bcb3a", true);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*button_binding*/ ctx[20](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher();
    	const events = getEventsAction(current_component);
    	let { class: className = "" } = $$props;
    	let { style = null } = $$props;
    	let { icon = false } = $$props;
    	let { fab = false } = $$props;
    	let { dense = false } = $$props;
    	let { raised = false } = $$props;
    	let { unelevated = false } = $$props;
    	let { outlined = false } = $$props;
    	let { shaped = false } = $$props;
    	let { color = null } = $$props;
    	let { ripple = true } = $$props;
    	let { toggle = false } = $$props;
    	let { active = false } = $$props;
    	let { fullWidth = false } = $$props;
    	let elm;
    	let attrs = {};

    	beforeUpdate(() => {
    		if (!elm) return;
    		let svgs = elm.getElementsByTagName("svg");
    		let len = svgs.length;

    		for (let i = 0; i < len; i++) {
    			svgs[i].setAttribute("width", iconSize + (toggle && !icon ? 2 : 0));
    			svgs[i].setAttribute("height", iconSize + (toggle && !icon ? 2 : 0));
    		}

    		$$invalidate(13, elm.style.backgroundColor = raised || unelevated ? color : "transparent", elm);
    		let bg = getComputedStyle(elm).getPropertyValue("background-color");

    		$$invalidate(
    			13,
    			elm.style.color = raised || unelevated
    			? luminance(bg) > 0.5 ? "#000" : "#fff"
    			: color,
    			elm
    		);
    	});

    	function onclick(e) {
    		if (toggle) {
    			$$invalidate(0, active = !active);
    			dispatch("change", active);
    		}
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			elm = $$value;
    			$$invalidate(13, elm);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("style" in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ("fab" in $$new_props) $$invalidate(4, fab = $$new_props.fab);
    		if ("dense" in $$new_props) $$invalidate(5, dense = $$new_props.dense);
    		if ("raised" in $$new_props) $$invalidate(6, raised = $$new_props.raised);
    		if ("unelevated" in $$new_props) $$invalidate(7, unelevated = $$new_props.unelevated);
    		if ("outlined" in $$new_props) $$invalidate(8, outlined = $$new_props.outlined);
    		if ("shaped" in $$new_props) $$invalidate(9, shaped = $$new_props.shaped);
    		if ("color" in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ("ripple" in $$new_props) $$invalidate(10, ripple = $$new_props.ripple);
    		if ("toggle" in $$new_props) $$invalidate(11, toggle = $$new_props.toggle);
    		if ("active" in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ("fullWidth" in $$new_props) $$invalidate(12, fullWidth = $$new_props.fullWidth);
    		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	let iconSize;

    	$$self.$$.update = () => {
    		 {
    			/* eslint-disable no-unused-vars */
    			const { style, icon, fab, dense, raised, unelevated, outlined, shaped, color, ripple, toggle, active, fullWidth, ...other } = $$props;

    			!other.disabled && delete other.disabled;
    			delete other.class;
    			$$invalidate(14, attrs = other);
    		}

    		if ($$self.$$.dirty & /*icon, fab, dense*/ 56) {
    			 iconSize = icon ? fab ? 24 : dense ? 20 : 24 : dense ? 16 : 18;
    		}

    		if ($$self.$$.dirty & /*color, elm*/ 139264) {
    			 if (color === "primary") {
    				$$invalidate(17, color = islegacy() ? "#1976d2" : "var(--primary, #1976d2)");
    			} else if (color == "accent") {
    				$$invalidate(17, color = islegacy() ? "#f50057" : "var(--accent, #f50057)");
    			} else if (!color && elm) {
    				$$invalidate(17, color = elm.style.color || elm.parentElement.style.color || (islegacy() ? "#333" : "var(--color, #333)"));
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		active,
    		className,
    		style,
    		icon,
    		fab,
    		dense,
    		raised,
    		unelevated,
    		outlined,
    		shaped,
    		ripple,
    		toggle,
    		fullWidth,
    		elm,
    		attrs,
    		events,
    		onclick,
    		color,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-6bcb3a-style")) add_css$1();

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			class: 1,
    			style: 2,
    			icon: 3,
    			fab: 4,
    			dense: 5,
    			raised: 6,
    			unelevated: 7,
    			outlined: 8,
    			shaped: 9,
    			color: 17,
    			ripple: 10,
    			toggle: 11,
    			active: 0,
    			fullWidth: 12
    		});
    	}
    }

    /* node_modules\svelte-mui\src\Icon.svelte generated by Svelte v3.29.0 */

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-h2unzw-style";
    	style.textContent = ".icon.svelte-h2unzw.svelte-h2unzw{display:inline-block;position:relative;vertical-align:middle;line-height:0.5}.icon.svelte-h2unzw>svg.svelte-h2unzw{display:inline-block}.flip.svelte-h2unzw.svelte-h2unzw{transform:scale(-1, -1)}.flip-h.svelte-h2unzw.svelte-h2unzw{transform:scale(-1, 1)}.flip-v.svelte-h2unzw.svelte-h2unzw{transform:scale(1, -1)}.spin.svelte-h2unzw.svelte-h2unzw{animation:svelte-h2unzw-spin 1s 0s infinite linear}.pulse.svelte-h2unzw.svelte-h2unzw{animation:svelte-h2unzw-spin 1s infinite steps(8)}@keyframes svelte-h2unzw-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
    	append(document.head, style);
    }

    // (16:1) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (12:1) {#if typeof path === 'string'}
    function create_if_block$1(ctx) {
    	let svg;
    	let path_1;

    	return {
    		c() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			attr(path_1, "d", /*path*/ ctx[1]);
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", /*viewBox*/ ctx[2]);
    			attr(svg, "class", "svelte-h2unzw");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path_1);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*path*/ 2) {
    				attr(path_1, "d", /*path*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 4) {
    				attr(svg, "viewBox", /*viewBox*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let i;
    	let current_block_type_index;
    	let if_block;
    	let i_class_value;
    	let events_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*path*/ ctx[1] === "string") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let i_levels = [
    		{
    			class: i_class_value = "icon " + /*className*/ ctx[0]
    		},
    		/*attrs*/ ctx[7]
    	];

    	let i_data = {};

    	for (let i = 0; i < i_levels.length; i += 1) {
    		i_data = assign(i_data, i_levels[i]);
    	}

    	return {
    		c() {
    			i = element("i");
    			if_block.c();
    			set_attributes(i, i_data);
    			toggle_class(i, "flip", /*flip*/ ctx[3] && typeof /*flip*/ ctx[3] === "boolean");
    			toggle_class(i, "flip-h", /*flip*/ ctx[3] === "h");
    			toggle_class(i, "flip-v", /*flip*/ ctx[3] === "v");
    			toggle_class(i, "spin", /*spin*/ ctx[4]);
    			toggle_class(i, "pulse", /*pulse*/ ctx[5] && !/*spin*/ ctx[4]);
    			toggle_class(i, "svelte-h2unzw", true);
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    			if_blocks[current_block_type_index].m(i, null);
    			/*i_binding*/ ctx[13](i);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(events_action = /*events*/ ctx[8].call(null, i));
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(i, null);
    			}

    			set_attributes(i, i_data = get_spread_update(i_levels, [
    				(!current || dirty & /*className*/ 1 && i_class_value !== (i_class_value = "icon " + /*className*/ ctx[0])) && { class: i_class_value },
    				dirty & /*attrs*/ 128 && /*attrs*/ ctx[7]
    			]));

    			toggle_class(i, "flip", /*flip*/ ctx[3] && typeof /*flip*/ ctx[3] === "boolean");
    			toggle_class(i, "flip-h", /*flip*/ ctx[3] === "h");
    			toggle_class(i, "flip-v", /*flip*/ ctx[3] === "v");
    			toggle_class(i, "spin", /*spin*/ ctx[4]);
    			toggle_class(i, "pulse", /*pulse*/ ctx[5] && !/*spin*/ ctx[4]);
    			toggle_class(i, "svelte-h2unzw", true);
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
    			if (detaching) detach(i);
    			if_blocks[current_block_type_index].d();
    			/*i_binding*/ ctx[13](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const events = getEventsAction(current_component);
    	let { class: className = "" } = $$props;
    	let { path = null } = $$props;
    	let { size = 24 } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { flip = false } = $$props;
    	let { spin = false } = $$props;
    	let { pulse = false } = $$props;
    	let elm;
    	let attrs = {};

    	function i_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			elm = $$value;
    			$$invalidate(6, elm);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(14, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("path" in $$new_props) $$invalidate(1, path = $$new_props.path);
    		if ("size" in $$new_props) $$invalidate(9, size = $$new_props.size);
    		if ("viewBox" in $$new_props) $$invalidate(2, viewBox = $$new_props.viewBox);
    		if ("color" in $$new_props) $$invalidate(10, color = $$new_props.color);
    		if ("flip" in $$new_props) $$invalidate(3, flip = $$new_props.flip);
    		if ("spin" in $$new_props) $$invalidate(4, spin = $$new_props.spin);
    		if ("pulse" in $$new_props) $$invalidate(5, pulse = $$new_props.pulse);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		 {
    			/* eslint-disable no-unused-vars */
    			const { path, size, viewBox, color, flip, spin, pulse, ...other } = $$props;

    			delete other.class;
    			$$invalidate(7, attrs = other);
    		}

    		if ($$self.$$.dirty & /*elm, size, color*/ 1600) {
    			 if (elm) {
    				elm.firstChild.setAttribute("width", size);
    				elm.firstChild.setAttribute("height", size);
    				color && elm.firstChild.setAttribute("fill", color);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		path,
    		viewBox,
    		flip,
    		spin,
    		pulse,
    		elm,
    		attrs,
    		events,
    		size,
    		color,
    		$$scope,
    		slots,
    		i_binding
    	];
    }

    class Icon extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-h2unzw-style")) add_css$2();

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			class: 0,
    			path: 1,
    			size: 9,
    			viewBox: 2,
    			color: 10,
    			flip: 3,
    			spin: 4,
    			pulse: 5
    		});
    	}
    }

    /* node_modules\svelte-mui\src\Checkbox.svelte generated by Svelte v3.29.0 */

    function add_css$3() {
    	var style = element("style");
    	style.id = "svelte-1idh7xl-style";
    	style.textContent = "label.svelte-1idh7xl.svelte-1idh7xl{width:100%;align-items:center;display:flex;margin:0;position:relative;cursor:pointer;line-height:40px;user-select:none}input.svelte-1idh7xl.svelte-1idh7xl{cursor:inherit;width:100%;height:100%;position:absolute;top:0;left:0;margin:0;padding:0;opacity:0 !important}.mark.svelte-1idh7xl.svelte-1idh7xl{display:flex;position:relative;justify-content:center;align-items:center;border-radius:50%;width:40px;height:40px}.mark.svelte-1idh7xl.svelte-1idh7xl:before{background-color:currentColor;border-radius:inherit;bottom:0;color:inherit;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.3s cubic-bezier(0.25, 0.8, 0.5, 1)}@media not all and (min-resolution: 0.001dpcm){@supports (-webkit-appearance: none) and (stroke-color: transparent){.mark.svelte-1idh7xl.svelte-1idh7xl:before{transition:none}}}.label-text.svelte-1idh7xl.svelte-1idh7xl{margin-left:4px;white-space:nowrap;overflow:hidden}.right.svelte-1idh7xl .label-text.svelte-1idh7xl{margin-left:0;margin-right:auto;order:-1}@media(hover: hover){label.svelte-1idh7xl:hover:not([disabled]):not(.disabled) .mark.svelte-1idh7xl:before{opacity:0.15}.svelte-1idh7xl.focus-visible:focus:not([disabled]):not(.disabled)~.mark.svelte-1idh7xl:before{opacity:0.3}}";
    	append(document.head, style);
    }

    // (13:2) {#if ripple}
    function create_if_block$2(ctx) {
    	let ripple_1;
    	let current;
    	ripple_1 = new Ripple({ props: { center: true, circle: true } });

    	return {
    		c() {
    			create_component(ripple_1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(ripple_1, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(ripple_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(ripple_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(ripple_1, detaching);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let label;
    	let input;
    	let events_action;
    	let t0;
    	let div0;
    	let icon;
    	let t1;
    	let div0_style_value;
    	let t2;
    	let div1;
    	let label_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "checkbox" }, { __value: /*value*/ ctx[9] }, /*attrs*/ ctx[10]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	icon = new Icon({
    			props: {
    				path: /*indeterminate*/ ctx[2]
    				? checkboxIndeterminate
    				: /*checked*/ ctx[0] ? checkbox : checkboxOutline
    			}
    		});

    	let if_block = /*ripple*/ ctx[7] && create_if_block$2();
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	return {
    		c() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(input, input_data);
    			if (/*checked*/ ctx[0] === void 0 || /*indeterminate*/ ctx[2] === void 0) add_render_callback(() => /*input_change_handler*/ ctx[16].call(input));
    			toggle_class(input, "svelte-1idh7xl", true);
    			attr(div0, "class", "mark svelte-1idh7xl");

    			attr(div0, "style", div0_style_value = `color: ${/*indeterminate*/ ctx[2] || /*checked*/ ctx[0]
			? /*color*/ ctx[1]
			: "#9a9a9a"}`);

    			attr(div1, "class", "label-text svelte-1idh7xl");
    			attr(label, "class", label_class_value = "" + (null_to_empty(/*className*/ ctx[3]) + " svelte-1idh7xl"));
    			attr(label, "style", /*style*/ ctx[4]);
    			attr(label, "title", /*title*/ ctx[8]);
    			toggle_class(label, "right", /*right*/ ctx[6]);
    			toggle_class(label, "disabled", /*disabled*/ ctx[5]);
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);
    			append(label, input);
    			input.checked = /*checked*/ ctx[0];
    			input.indeterminate = /*indeterminate*/ ctx[2];
    			append(label, t0);
    			append(label, div0);
    			mount_component(icon, div0, null);
    			append(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append(label, t2);
    			append(label, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(input, "change", /*input_change_handler*/ ctx[16]),
    					listen(input, "change", /*groupUpdate*/ ctx[12]),
    					action_destroyer(events_action = /*events*/ ctx[11].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "checkbox" },
    				(!current || dirty & /*value*/ 512) && { __value: /*value*/ ctx[9] },
    				dirty & /*attrs*/ 1024 && /*attrs*/ ctx[10]
    			]));

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty & /*indeterminate*/ 4) {
    				input.indeterminate = /*indeterminate*/ ctx[2];
    			}

    			toggle_class(input, "svelte-1idh7xl", true);
    			const icon_changes = {};

    			if (dirty & /*indeterminate, checked*/ 5) icon_changes.path = /*indeterminate*/ ctx[2]
    			? checkboxIndeterminate
    			: /*checked*/ ctx[0] ? checkbox : checkboxOutline;

    			icon.$set(icon_changes);

    			if (/*ripple*/ ctx[7]) {
    				if (if_block) {
    					if (dirty & /*ripple*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2();
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*indeterminate, checked, color*/ 7 && div0_style_value !== (div0_style_value = `color: ${/*indeterminate*/ ctx[2] || /*checked*/ ctx[0]
			? /*color*/ ctx[1]
			: "#9a9a9a"}`)) {
    				attr(div0, "style", div0_style_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16384) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[14], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*className*/ 8 && label_class_value !== (label_class_value = "" + (null_to_empty(/*className*/ ctx[3]) + " svelte-1idh7xl"))) {
    				attr(label, "class", label_class_value);
    			}

    			if (!current || dirty & /*style*/ 16) {
    				attr(label, "style", /*style*/ ctx[4]);
    			}

    			if (!current || dirty & /*title*/ 256) {
    				attr(label, "title", /*title*/ ctx[8]);
    			}

    			if (dirty & /*className, right*/ 72) {
    				toggle_class(label, "right", /*right*/ ctx[6]);
    			}

    			if (dirty & /*className, disabled*/ 40) {
    				toggle_class(label, "disabled", /*disabled*/ ctx[5]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    let checkbox = "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
    let checkboxOutline = "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z";
    let checkboxIndeterminate = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z";

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const events = getEventsAction(current_component);
    	let { checked = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { style = null } = $$props;
    	let { color = "primary" } = $$props; // primary, accent, currentColor, inherit
    	let { disabled = false } = $$props;
    	let { group = null } = $$props;
    	let { indeterminate = false } = $$props;
    	let { right = false } = $$props;
    	let { ripple = true } = $$props;
    	let { title = null } = $$props;
    	let { value = "on" } = $$props;
    	let attrs = {};

    	function groupCheck() {
    		setTimeout(
    			() => {
    				$$invalidate(0, checked = group.indexOf(value) >= 0);
    			},
    			0
    		);
    	}

    	function groupUpdate() /*e*/ {
    		if (group !== null) {
    			let i = group.indexOf(value);

    			if (checked) {
    				if (i < 0) {
    					group.push(value);
    				}
    			} else if (i >= 0) {
    				group.splice(i, 1);
    			}

    			$$invalidate(13, group);
    		}
    	}

    	function input_change_handler() {
    		checked = this.checked;
    		indeterminate = this.indeterminate;
    		$$invalidate(0, checked);
    		$$invalidate(2, indeterminate);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("style" in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ("color" in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("group" in $$new_props) $$invalidate(13, group = $$new_props.group);
    		if ("indeterminate" in $$new_props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ("right" in $$new_props) $$invalidate(6, right = $$new_props.right);
    		if ("ripple" in $$new_props) $$invalidate(7, ripple = $$new_props.ripple);
    		if ("title" in $$new_props) $$invalidate(8, title = $$new_props.title);
    		if ("value" in $$new_props) $$invalidate(9, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		 {
    			/* eslint-disable no-unused-vars */
    			const { checked, style, color, group, indeterminate, right, ripple, title, value, ...other } = $$props;

    			!other.disabled && delete other.disabled;
    			delete other.class;
    			$$invalidate(10, attrs = other);
    		}

    		if ($$self.$$.dirty & /*group*/ 8192) {
    			 if (group !== null) {
    				groupCheck();
    			}
    		}

    		if ($$self.$$.dirty & /*color*/ 2) {
    			 if (color === "primary" || !color) {
    				$$invalidate(1, color = islegacy() ? "#1976d2" : "var(--primary, #1976d2)");
    			} else if (color === "accent") {
    				$$invalidate(1, color = islegacy() ? "#f50057" : "var(--accent, #f50057)");
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		checked,
    		color,
    		indeterminate,
    		className,
    		style,
    		disabled,
    		right,
    		ripple,
    		title,
    		value,
    		attrs,
    		events,
    		groupUpdate,
    		group,
    		$$scope,
    		slots,
    		input_change_handler
    	];
    }

    class Checkbox extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-1idh7xl-style")) add_css$3();

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			checked: 0,
    			class: 3,
    			style: 4,
    			color: 1,
    			disabled: 5,
    			group: 13,
    			indeterminate: 2,
    			right: 6,
    			ripple: 7,
    			title: 8,
    			value: 9
    		});
    	}
    }

    function getFocusable(context = document) {
    	const focusable = Array.prototype.slice
    		.call(
    			context.querySelectorAll(
    				'button, [href], select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'
    			)
    		)
    		.filter(function(item) {
    			const style = window.getComputedStyle(item);

    			return (
    				!item.disabled &&
    				!item.getAttribute('disabled') &&
    				!item.classList.contains('disabled') &&
    				style.display !== 'none' &&
    				style.visibility !== 'hidden' &&
    				style.opacity > 0
    			);
    		});

    	return focusable;
    }

    function trapTabKey(e, context) {
    	if (e.key !== 'Tab' && e.keyCode !== 9) {
    		return;
    	}

    	let focusableItems = getFocusable(context);

    	if (focusableItems.length === 0) {
    		e.preventDefault();
    		return;
    	}

    	let focusedItem = document.activeElement;

    	let focusedItemIndex = focusableItems.indexOf(focusedItem);

    	if (e.shiftKey) {
    		if (focusedItemIndex <= 0) {
    			focusableItems[focusableItems.length - 1].focus();
    			e.preventDefault();
    		}
    	} else {
    		if (focusedItemIndex >= focusableItems.length - 1) {
    			focusableItems[0].focus();
    			e.preventDefault();
    		}
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    function enableScroll(enable) {
    	let isHidden = document.body.style.overflow === 'hidden';

    	if (enable && isHidden) {
    		let top = Math.abs(parseInt(document.body.style.top));

    		document.body.style.cssText = null;
    		document.body.removeAttribute('style');
    		window.scrollTo(0, top);
    	} else if (!enable && !isHidden) {
    		document.body.style.top =
    			'-' +
    			Math.max(
    				document.body.scrollTop,
    				(document.documentElement && document.documentElement.scrollTop) || 0
    			) +
    			'px';
    		document.body.style.position = 'fixed';
    		document.body.style.width = '100%';
    		document.body.style.overflow = 'hidden';
    	}
    }

    /* node_modules\svelte-mui\src\Dialog.svelte generated by Svelte v3.29.0 */

    function add_css$4() {
    	var style = element("style");
    	style.id = "svelte-1pkw9hl-style";
    	style.textContent = ".overlay.svelte-1pkw9hl{background-color:rgba(0, 0, 0, 0.5);cursor:pointer;position:fixed;left:0;top:0;right:0;bottom:0;z-index:30;display:flex;justify-content:center;align-items:center}.dialog.svelte-1pkw9hl{position:relative;font-size:1rem;background:#eee;background:var(--bg-panel, #eee);border-radius:4px;cursor:auto;box-shadow:0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),\n\t\t\t0 9px 46px 8px rgba(0, 0, 0, 0.12);z-index:40;max-height:80%;overflow-x:hidden;overflow-y:auto}.dialog.svelte-1pkw9hl:focus{outline:none}.dialog.svelte-1pkw9hl::-moz-focus-inner{border:0}.dialog.svelte-1pkw9hl:-moz-focusring{outline:none}div.svelte-1pkw9hl .actions{min-height:48px;padding:8px;display:flex;align-items:center}div.svelte-1pkw9hl .center{justify-content:center}div.svelte-1pkw9hl .left{justify-content:flex-start}div.svelte-1pkw9hl .right{justify-content:flex-end}.title.svelte-1pkw9hl{padding:16px 16px 12px;font-size:24px;line-height:36px;background:rgba(0, 0, 0, 0.1);background:var(--divider, rgba(0, 0, 0, 0.1))}.content.svelte-1pkw9hl{margin:16px}";
    	append(document.head, style);
    }

    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_actions_slot_changes = dirty => ({});
    const get_actions_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (3:0) {#if visible}
    function create_if_block$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let div2_class_value;
    	let div2_style_value;
    	let events_action;
    	let div2_intro;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const title_slot_template = /*#slots*/ ctx[15].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[14], get_title_slot_context);
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);
    	const actions_slot_template = /*#slots*/ ctx[15].actions;
    	const actions_slot = create_slot(actions_slot_template, ctx, /*$$scope*/ ctx[14], get_actions_slot_context);
    	const footer_slot_template = /*#slots*/ ctx[15].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[14], get_footer_slot_context);

    	let div2_levels = [
    		{
    			class: div2_class_value = "dialog " + /*className*/ ctx[1]
    		},
    		{
    			style: div2_style_value = `width: ${/*width*/ ctx[3]}px;${/*style*/ ctx[2]}`
    		},
    		{ tabindex: "-1" },
    		/*attrs*/ ctx[6]
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (title_slot) title_slot.c();
    			t0 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (actions_slot) actions_slot.c();
    			t2 = space();
    			if (footer_slot) footer_slot.c();
    			attr(div0, "class", "title svelte-1pkw9hl");
    			attr(div1, "class", "content svelte-1pkw9hl");
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "svelte-1pkw9hl", true);
    			attr(div3, "class", "overlay svelte-1pkw9hl");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);

    			if (title_slot) {
    				title_slot.m(div0, null);
    			}

    			append(div2, t0);
    			append(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append(div2, t1);

    			if (actions_slot) {
    				actions_slot.m(div2, null);
    			}

    			append(div2, t2);

    			if (footer_slot) {
    				footer_slot.m(div2, null);
    			}

    			/*div2_binding*/ ctx[17](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(events_action = /*events*/ ctx[8].call(null, div2)),
    					listen(div2, "mousedown", stop_propagation(/*mousedown_handler*/ ctx[16])),
    					listen(div2, "mouseenter", /*mouseenter_handler*/ ctx[18]),
    					listen(div3, "mousedown", /*mousedown_handler_1*/ ctx[19]),
    					listen(div3, "mouseup", /*mouseup_handler*/ ctx[20])
    				];

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (title_slot) {
    				if (title_slot.p && dirty & /*$$scope*/ 16384) {
    					update_slot(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[14], dirty, get_title_slot_changes, get_title_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16384) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[14], dirty, null, null);
    				}
    			}

    			if (actions_slot) {
    				if (actions_slot.p && dirty & /*$$scope*/ 16384) {
    					update_slot(actions_slot, actions_slot_template, ctx, /*$$scope*/ ctx[14], dirty, get_actions_slot_changes, get_actions_slot_context);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && dirty & /*$$scope*/ 16384) {
    					update_slot(footer_slot, footer_slot_template, ctx, /*$$scope*/ ctx[14], dirty, get_footer_slot_changes, get_footer_slot_context);
    				}
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty & /*className*/ 2 && div2_class_value !== (div2_class_value = "dialog " + /*className*/ ctx[1])) && { class: div2_class_value },
    				(!current || dirty & /*width, style*/ 12 && div2_style_value !== (div2_style_value = `width: ${/*width*/ ctx[3]}px;${/*style*/ ctx[2]}`)) && { style: div2_style_value },
    				{ tabindex: "-1" },
    				dirty & /*attrs*/ 64 && /*attrs*/ ctx[6]
    			]));

    			toggle_class(div2, "svelte-1pkw9hl", true);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			transition_in(default_slot, local);
    			transition_in(actions_slot, local);
    			transition_in(footer_slot, local);

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, scale, {
    						duration: 180,
    						opacity: 0.5,
    						start: 0.75,
    						easing: quintOut
    					});

    					div2_intro.start();
    				});
    			}

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 180 }, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o(local) {
    			transition_out(title_slot, local);
    			transition_out(default_slot, local);
    			transition_out(actions_slot, local);
    			transition_out(footer_slot, local);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 180 }, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    			if (title_slot) title_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (actions_slot) actions_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    			/*div2_binding*/ ctx[17](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[0] && create_if_block$3(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(window, "keydown", /*onKey*/ ctx[10]),
    					listen(window, "popstate", /*onPopstate*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visible*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher();
    	const events = getEventsAction(current_component);
    	let { class: className = "" } = $$props;
    	let { style = "" } = $$props;
    	let { visible = false } = $$props;
    	let { width = 320 } = $$props;
    	let { modal = false } = $$props;
    	let { closeByEsc = true } = $$props;
    	let { beforeClose = () => true } = $$props;
    	let mouseDownOutside = false;
    	let attrs = {};
    	let mounted = false;
    	let elm;

    	onMount(async () => {
    		await tick();
    		$$invalidate(21, mounted = true);
    	});

    	onDestroy(() => {
    		mounted && enableScroll(true);
    	});

    	function close(params) {
    		if (beforeClose()) {
    			dispatch("close", params);
    			$$invalidate(0, visible = false);
    		}
    	}

    	async function onVisible() {
    		if (!elm) return;
    		await tick();
    		let inputs = elm.querySelectorAll("input:not([type=\"hidden\"])");
    		let length = inputs.length;
    		let i = 0;

    		for (; i < length; i++) {
    			if (inputs[i].getAttribute("autofocus")) {
    				break;
    			}
    		}

    		i < length
    		? inputs[i].focus()
    		: length > 0 ? inputs[0].focus() : elm.focus();

    		dispatch("open");
    	}

    	function onKey(e) {
    		const esc = "Escape";

    		if (e.keyCode === 27 || e.key === esc || e.code === esc) {
    			closeByEsc && close(esc);
    		}

    		if (visible) {
    			trapTabKey(e, elm);
    		}
    	}

    	function onPopstate() {
    		$$invalidate(0, visible = false);
    	}

    	function mousedown_handler(event) {
    		bubble($$self, event);
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			elm = $$value;
    			$$invalidate(7, elm);
    		});
    	}

    	const mouseenter_handler = () => {
    		$$invalidate(5, mouseDownOutside = false);
    	};

    	const mousedown_handler_1 = () => {
    		$$invalidate(5, mouseDownOutside = true);
    	};

    	const mouseup_handler = () => {
    		mouseDownOutside && !modal && close("clickOutside");
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("style" in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ("visible" in $$new_props) $$invalidate(0, visible = $$new_props.visible);
    		if ("width" in $$new_props) $$invalidate(3, width = $$new_props.width);
    		if ("modal" in $$new_props) $$invalidate(4, modal = $$new_props.modal);
    		if ("closeByEsc" in $$new_props) $$invalidate(12, closeByEsc = $$new_props.closeByEsc);
    		if ("beforeClose" in $$new_props) $$invalidate(13, beforeClose = $$new_props.beforeClose);
    		if ("$$scope" in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		 {
    			/* eslint-disable no-unused-vars */
    			const { style, visible, width, modal, closeByEsc, beforeClose, ...other } = $$props;

    			$$invalidate(6, attrs = other);
    		}

    		if ($$self.$$.dirty & /*visible, mounted*/ 2097153) {
    			 if (visible) {
    				mounted && enableScroll(false);
    				onVisible();
    			} else {
    				$$invalidate(5, mouseDownOutside = false);
    				mounted && enableScroll(true);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		visible,
    		className,
    		style,
    		width,
    		modal,
    		mouseDownOutside,
    		attrs,
    		elm,
    		events,
    		close,
    		onKey,
    		onPopstate,
    		closeByEsc,
    		beforeClose,
    		$$scope,
    		slots,
    		mousedown_handler,
    		div2_binding,
    		mouseenter_handler,
    		mousedown_handler_1,
    		mouseup_handler
    	];
    }

    class Dialog extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-1pkw9hl-style")) add_css$4();

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			class: 1,
    			style: 2,
    			visible: 0,
    			width: 3,
    			modal: 4,
    			closeByEsc: 12,
    			beforeClose: 13
    		});
    	}
    }

    /* helper\Loader.svelte generated by Svelte v3.29.0 */

    function add_css$5() {
    	var style = element("style");
    	style.id = "svelte-to8rmr-style";
    	style.textContent = ".loader.svelte-to8rmr{border:2px solid #f3f3f3;border-radius:50%;border-top:2px solid #3498db;-webkit-animation:svelte-to8rmr-spin 2s linear infinite;animation:svelte-to8rmr-spin 2s linear infinite;margin:0 auto}.loader_msg.svelte-to8rmr{text-align:center;padding:15px}@-webkit-keyframes svelte-to8rmr-spin{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes svelte-to8rmr-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
    	append(document.head, style);
    }

    // (7:0) {#if msg}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	return {
    		c() {
    			div = element("div");
    			t = text(/*msg*/ ctx[1]);
    			attr(div, "class", "loader_msg svelte-to8rmr");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*msg*/ 2) set_data(t, /*msg*/ ctx[1]);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let if_block = /*msg*/ ctx[1] && create_if_block$4(ctx);

    	return {
    		c() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr(div, "class", "loader svelte-to8rmr");
    			set_style(div, "height", /*size*/ ctx[0] + "px");
    			set_style(div, "width", /*size*/ ctx[0] + "px");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			insert(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0] + "px");
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0] + "px");
    			}

    			if (/*msg*/ ctx[1]) {
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
    		d(detaching) {
    			if (detaching) detach(div);
    			if (detaching) detach(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { size = 100 } = $$props;
    	let { msg = false } = $$props;

    	$$self.$$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("msg" in $$props) $$invalidate(1, msg = $$props.msg);
    	};

    	return [size, msg];
    }

    class Loader extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-to8rmr-style")) add_css$5();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, msg: 1 });
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
        decimal_position: "please enter the decimal position between 1 to ",
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
            this.extraSelectors = ['hidden', 'visible', 'selected', 'checked', 'enabled', 'children', 'childNodes'];
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
                Array.prototype.forEach.call(current, (item)=> {
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
                Array.prototype.forEach.call(attrArray, (attr)=> {
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

        // serialize nodes into array
        serializeArray(nodeArr, filter) {
            let result = [];
            nodeArr.forEach((item)=> {
                if (!filter || item.matches(filter)) {
                    console.log(item.attributes.length);
                    if (item.attributes.length > 0) {
                        let tempData = {};
                        for (let _attr of item.attributes) {
                            tempData[_attr.name] = _attr.value;
                        }
                        result.push(tempData);
                    }
                }
            });
            return result;
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
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action, actionData}));
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
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action: 'removeClass', actionData: name}));
            }
            return selected || {};
        }
        // add class for node
        addClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action: 'addClass', actionData: name}));
            }
            return selected || {};
        }

        // dom visibility handle
        toggleDom(dom, action="toggleDisplay") {
            let selected =  typeof dom == "object" ? dom : document.querySelectorAll(dom);
            if (selected && selected.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action}) );
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

        // Set dataset on element
        getData(selector, attr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            return selected?.dataset[attr] || {};
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
                Array.prototype.forEach.call(selected, (elm)=> elm.remove() );
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
                return -1;
            }
        }

        // compare selector in base node
        match(baseSelector, mathStr) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let matched = [];
            if (base && base.length > 0 ) {
                Array.prototype.forEach.call(base, (elm)=> {
                    if (elm.matches(mathStr)) matched.push(elm);
                });
            } else {
                return base && base.matches(mathStr);
            }
            return matched;
        }

        // check selector in base node
        contains(selector, text) {
            let elements = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
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
            let extended = {};
            let deep = false;
            let i = 0;
            let length = arguments.length;
            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }
            // Merge the object into the extended object
            const merge = function (obj) {
                for ( let prop in obj ) {
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
                let obj = arguments[i];
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
                default : return "<div>Nothing</div>";
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
                case 'children': return document.querySelector(selector).children;
                case 'childNodes': return document.querySelector(selector).childNodes;
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
                break;
                case 'getData': this.getData(selected, data.actionData);
                break;
            }
        }
    } 

    const JS = new JUI();

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

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

    const AH = new JUI();
    const SSD = new JStore();

    /* clsSMWeb\WebPreview.svelte generated by Svelte v3.29.0 */

    const { document: document_1$1 } = globals;

    function add_css$6() {
    	var style = element("style");
    	style.id = "svelte-1553786-style";
    	style.textContent = ".height44{height:44px}";
    	append(document_1$1.head, style);
    }

    // (1825:8) {#if window.isIE || window.isIEEleven}
    function create_if_block_1(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.textContent = "You are using Internet Explorer, ES6 functionality of javascript will not work!";
    			attr(div, "class", "alert alert-danger");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (1904:20) {:else}
    function create_else_block$1(ctx) {
    	let div21;
    	let div20;
    	let div3;
    	let div0;
    	let span0;
    	let span1;
    	let t1;
    	let div1;
    	let button0;
    	let t2;
    	let ul;
    	let li;
    	let label;
    	let input;
    	let input_checked_value;
    	let t3;
    	let span3;
    	let t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "";
    	let t4;
    	let t5;
    	let div2;
    	let button1;
    	let t7;
    	let div19;
    	let div14;
    	let div13;
    	let div6;
    	let div4;
    	let span4;
    	let t9;
    	let div5;
    	let div5_style_value;
    	let t10;
    	let div9;
    	let div7;
    	let span5;
    	let t12;
    	let div8;
    	let div8_style_value;
    	let t13;
    	let div12;
    	let div10;
    	let span6;
    	let t15;
    	let div11;
    	let div11_style_value;
    	let t16;
    	let div18;
    	let div17;
    	let div15;
    	let span7;
    	let t18;
    	let div16;
    	let div16_style_value;
    	let div18_style_value;
    	let div19_style_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div21 = element("div");
    			div20 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span1 = element("span");
    			span1.textContent = `${language.html_css_js}`;
    			t1 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.innerHTML = `<span class="icomoon-menu-2 s3 text-secondary pt-s d-block" id="dropdownMenuButton1"></span>`;
    			t2 = space();
    			ul = element("ul");
    			li = element("li");
    			label = element("label");
    			input = element("input");
    			t3 = space();
    			span3 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = `${language.run}`;
    			t7 = space();
    			div19 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			span4 = element("span");
    			span4.textContent = `${language.html}`;
    			t9 = space();
    			div5 = element("div");
    			div5.innerHTML = `<textarea name="html" id="html_editor"></textarea>`;
    			t10 = space();
    			div9 = element("div");
    			div7 = element("div");
    			span5 = element("span");
    			span5.textContent = `${language.css}`;
    			t12 = space();
    			div8 = element("div");
    			div8.innerHTML = `<textarea name="css" id="css_editor"></textarea>`;
    			t13 = space();
    			div12 = element("div");
    			div10 = element("div");
    			span6 = element("span");
    			span6.textContent = `${language.js}`;
    			t15 = space();
    			div11 = element("div");
    			div11.innerHTML = `<textarea name="js" id="js_editor"></textarea>`;
    			t16 = space();
    			div18 = element("div");
    			div17 = element("div");
    			div15 = element("div");
    			span7 = element("span");
    			span7.textContent = `${language.result}`;
    			t18 = space();
    			div16 = element("div");
    			attr(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
    			attr(span1, "class", "align-middle");
    			attr(div0, "class", "mt-2 pt-1 pl-2 float-left");
    			attr(button0, "class", "btn border-0 px-0 ml-2 mr-2");
    			attr(button0, "type", "button");
    			attr(button0, "data-bs-toggle", "dropdown");
    			attr(input, "type", "checkbox");
    			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
    			attr(input, "id", "goDark");
    			attr(input, "class", "transparent h");
    			attr(label, "for", "goDark");
    			attr(label, "class", "dropdown-item mb-0 pointer");
    			attr(ul, "class", "dropdown-menu dropdown-menu-right");
    			attr(ul, "x-placement", "bottom-end");
    			attr(ul, "aria-labelledby", "dropdownMenuButton1");
    			attr(div1, "class", "float-right mt-2");
    			attr(button1, "type", "button");
    			attr(button1, "class", "btn btn-primary runcode_btn ml mt-1");
    			attr(div2, "class", "inline-block pull-right");
    			attr(div3, "id", "web_toolbar");
    			attr(div3, "class", "bg-light w-100 height44 web_toolbar text-dark");
    			attr(div4, "class", "card-header rounded-0");
    			attr(div5, "id", "html");
    			attr(div5, "class", "card-body code_box content-div m-0 p-0");
    			attr(div5, "style", div5_style_value = "height: 347px ");
    			attr(div6, "id", "html_panel");
    			attr(div6, "class", "card m-0 p-0 rounded-0");
    			attr(div7, "class", "card-header rounded-0");
    			attr(div8, "id", "css");
    			attr(div8, "class", "card-body code_box content-div m-0 p-0");
    			attr(div8, "style", div8_style_value = "height: 347px");
    			attr(div9, "id", "css_panel");
    			attr(div9, "class", "card m-0 p-0 rounded-0");
    			attr(div10, "class", "card-header rounded-0");
    			attr(div11, "id", "js");
    			attr(div11, "class", "card-body code_box content-div m-0 p-0");
    			attr(div11, "style", div11_style_value = "height: 347px ");
    			attr(div12, "id", "js_panel");
    			attr(div12, "class", "card m-0 p-0 rounded-0");
    			attr(div13, "id", "firstEditorDiv");
    			set_style(div13, "display", "flex");
    			attr(div14, "id", "top_content");
    			attr(div15, "class", "card-header rounded-0");
    			attr(div16, "id", "result_div");
    			attr(div16, "style", div16_style_value = "height: 347px");
    			attr(div16, "class", "card-body content-div m-0 p-0 rounded-0");
    			attr(div17, "class", "card rounded-0 nm");
    			attr(div18, "id", "bottom_content");
    			attr(div18, "style", div18_style_value = "overflow: hidden");
    			attr(div19, "id", "accordion");
    			attr(div19, "style", div19_style_value = "width:100%; background:white; padding:0px;");
    			attr(div20, "class", "row");
    			attr(div21, "class", "container-fluid");
    		},
    		m(target, anchor) {
    			insert(target, div21, anchor);
    			append(div21, div20);
    			append(div20, div3);
    			append(div3, div0);
    			append(div0, span0);
    			append(div0, span1);
    			append(div3, t1);
    			append(div3, div1);
    			append(div1, button0);
    			append(div1, t2);
    			append(div1, ul);
    			append(ul, li);
    			append(li, label);
    			append(label, input);
    			append(label, t3);
    			append(label, span3);
    			append(span3, t4);
    			append(div3, t5);
    			append(div3, div2);
    			append(div2, button1);
    			append(div20, t7);
    			append(div20, div19);
    			append(div19, div14);
    			append(div14, div13);
    			append(div13, div6);
    			append(div6, div4);
    			append(div4, span4);
    			append(div6, t9);
    			append(div6, div5);
    			append(div13, t10);
    			append(div13, div9);
    			append(div9, div7);
    			append(div7, span5);
    			append(div9, t12);
    			append(div9, div8);
    			append(div13, t13);
    			append(div13, div12);
    			append(div12, div10);
    			append(div10, span6);
    			append(div12, t15);
    			append(div12, div11);
    			append(div19, t16);
    			append(div19, div18);
    			append(div18, div17);
    			append(div17, div15);
    			append(div15, span7);
    			append(div17, t18);
    			append(div17, div16);

    			if (!mounted) {
    				dispose = [
    					listen(input, "click", /*changeTheme*/ ctx[3]),
    					listen(button1, "click", /*runCode*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0].goDark)) {
    				input.checked = input_checked_value;
    			}

    			if (dirty[0] & /*state*/ 1 && t4_value !== (t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "")) set_data(t4, t4_value);
    		},
    		d(detaching) {
    			if (detaching) detach(div21);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (1834:16) {#if window.inNative }
    function create_if_block$5(ctx) {
    	let div19;
    	let div18;
    	let div3;
    	let div0;
    	let span0;
    	let span1;
    	let t1;
    	let div1;
    	let button0;
    	let t2;
    	let ul0;
    	let li0;
    	let label;
    	let input;
    	let input_checked_value;
    	let t3;
    	let span3;
    	let t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6;
    	let button1;
    	let t8;
    	let div17;
    	let ul1;
    	let li1;
    	let a0;
    	let t10;
    	let li2;
    	let a1;
    	let t12;
    	let li3;
    	let a2;
    	let t14;
    	let div12;
    	let t17;
    	let div16;
    	let div15;
    	let div13;
    	let span4;
    	let t19;
    	let div14;
    	let div14_style_value;
    	let div17_style_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div19 = element("div");
    			div18 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span1 = element("span");
    			span1.textContent = `${language.html_css_js}`;
    			t1 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.innerHTML = `<span class="icomoon-menu-2 s3 text-secondary pt-s d-block"></span>`;
    			t2 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			label = element("label");
    			input = element("input");
    			t3 = space();
    			span3 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			t6 = text("x`\r\n                                    ");
    			button1 = element("button");
    			button1.textContent = `${language.run}`;
    			t8 = space();
    			div17 = element("div");
    			ul1 = element("ul");
    			li1 = element("li");
    			a0 = element("a");
    			a0.textContent = `${language.html}`;
    			t10 = space();
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = `${language.css}`;
    			t12 = space();
    			li3 = element("li");
    			a2 = element("a");
    			a2.textContent = `${language.js}`;
    			t14 = space();
    			div12 = element("div");

    			div12.innerHTML = `<div id="firstEditorDiv"><div id="html_panel" class="m-0 p-0 rounded-0 tab-pane fade show active" role="tabpanel"><div id="html" class="card-body code_box content-div m-0 p-0" style="${"height: 347px"}"><textarea name="html" id="html_editor"></textarea></div></div> 
                                        <div id="css_panel" class="m-0 p-0 rounded-0 tab-pane fade show" role="tabpanel"><div id="css" class="card-body code_box content-div m-0 p-0" style="${"height: 347px"}"><textarea name="css" class="css_text" id="css_editor"></textarea></div></div></div> 
                                    <div id="jsEditorDiv"><div id="js_panel" class="m-0 p-0 rounded-0 tab-pane fade show" role="tabpanel"><div id="js" class="card-body code_box content-div m-0 p-0" style="${"height: 347px"}"><textarea name="js" id="js_editor"></textarea></div></div></div>`;

    			t17 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div13 = element("div");
    			span4 = element("span");
    			span4.textContent = `${language.result}`;
    			t19 = space();
    			div14 = element("div");
    			attr(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
    			attr(span1, "class", "align-middle");
    			attr(div0, "class", "mt-2 pt pl-3 float-left");
    			attr(button0, "class", "btn border-0 px-0 ml-2 mr-2");
    			attr(button0, "type", "button");
    			attr(button0, "data-toggle", "dropdown");
    			attr(button0, "id", "dropdownMenuButton1");
    			attr(input, "type", "checkbox");
    			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
    			attr(input, "id", "goDark");
    			attr(input, "class", "position-absolute bg-transparent");
    			attr(label, "for", "goDark");
    			attr(label, "class", "dropdown-item mb-0 pointer");
    			attr(ul0, "class", "dropdown-menu dropdown-menu-right");
    			attr(ul0, "x-placement", "bottom-end");
    			attr(ul0, "aria-labelledby", "dropdownMenuButton1");
    			attr(div1, "class", "float-right mt-2 mr-2");
    			attr(button1, "type", "button");
    			attr(button1, "class", "btn btn-primary runcode_btn ml");
    			attr(div2, "class", "inline-block pull-right");
    			attr(div3, "id", "web_toolbar");
    			attr(div3, "class", "bg-gray height44 web_toolbar text-dark");
    			attr(a0, "class", "nav-link active text-white");
    			attr(a0, "href", "#html_panel");
    			attr(a0, "role", "tab");
    			attr(a0, "data-toggle", "tab");
    			attr(li1, "class", "nav-item");
    			attr(li1, "id", "html_pane");
    			attr(a1, "class", "nav-link text-white");
    			attr(a1, "href", "#css_panel");
    			attr(a1, "role", "tab");
    			attr(a1, "data-toggle", "tab");
    			attr(li2, "class", "nav-item");
    			attr(li2, "id", "css_pane");
    			attr(a2, "class", "nav-link text-white");
    			attr(a2, "href", "#js_panel");
    			attr(a2, "role", "tab");
    			attr(a2, "data-toggle", "tab");
    			attr(li3, "class", "nav-item");
    			attr(li3, "id", "js_pane");
    			attr(ul1, "class", "nav nav-pills nav-fill");
    			attr(ul1, "role", "tablist");
    			attr(div12, "id", "top_content");
    			attr(div12, "class", "tab-content");
    			attr(div13, "class", "card-header rounded-0");
    			attr(div14, "id", "result_div");
    			attr(div14, "style", div14_style_value = "min-height: 347px");
    			attr(div14, "class", "card-body content-div m-0 p-0 rounded-0");
    			attr(div15, "class", "card rounded-0 nm");
    			attr(div16, "id", "bottom_content");
    			attr(div17, "style", div17_style_value = "width: 100%;background: white;");
    			attr(div17, "class", "content_parent");
    			attr(div18, "class", "row");
    			attr(div19, "class", "container-fluid");
    			attr(div19, "id", "mainContainer");
    		},
    		m(target, anchor) {
    			insert(target, div19, anchor);
    			append(div19, div18);
    			append(div18, div3);
    			append(div3, div0);
    			append(div0, span0);
    			append(div0, span1);
    			append(div3, t1);
    			append(div3, div1);
    			append(div1, button0);
    			append(div1, t2);
    			append(div1, ul0);
    			append(ul0, li0);
    			append(li0, label);
    			append(label, input);
    			append(label, t3);
    			append(label, span3);
    			append(span3, t4);
    			append(div3, t5);
    			append(div3, div2);
    			append(div2, t6);
    			append(div2, button1);
    			append(div18, t8);
    			append(div18, div17);
    			append(div17, ul1);
    			append(ul1, li1);
    			append(li1, a0);
    			append(ul1, t10);
    			append(ul1, li2);
    			append(li2, a1);
    			append(ul1, t12);
    			append(ul1, li3);
    			append(li3, a2);
    			append(div17, t14);
    			append(div17, div12);
    			append(div17, t17);
    			append(div17, div16);
    			append(div16, div15);
    			append(div15, div13);
    			append(div13, span4);
    			append(div15, t19);
    			append(div15, div14);

    			if (!mounted) {
    				dispose = [
    					listen(input, "click", /*changeTheme*/ ctx[3]),
    					listen(button1, "click", /*runCode*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0].goDark)) {
    				input.checked = input_checked_value;
    			}

    			if (dirty[0] & /*state*/ 1 && t4_value !== (t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "")) set_data(t4, t4_value);
    		},
    		d(detaching) {
    			if (detaching) detach(div19);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (2007:1) <div slot="title" style="text-align: left;">
    function create_title_slot(ctx) {
    	let div0;
    	let div1;

    	return {
    		c() {
    			div0 = element("div");
    			div1 = element("div");
    			div1.textContent = `${language.remediation}`;
    			attr(div0, "slot", "title");
    			set_style(div0, "text-align", "left");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			append(div0, div1);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div0);
    		}
    	};
    }

    // (2019:2) <Button key="cancel_btn" class="cancel_btn_pop" style={'float:right;margin:10px;background-color:gray;'} variant="contained" on:click={() => state.remediationToggle = false }>
    function create_default_slot_1(ctx) {
    	let t_value = language.cancel + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (2018:1) <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
    function create_footer_slot(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				key: "cancel_btn",
    				class: "cancel_btn_pop",
    				style: "float:right;margin:10px;background-color:gray;",
    				variant: "contained",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	button.$on("click", /*click_handler_2*/ ctx[12]);

    	return {
    		c() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr(div, "slot", "footer");
    			attr(div, "class", "footer");
    			set_style(div, "border-top", "1px solid var(--divider, rgba(0, 0, 0, 0.1))");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 4194304) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(button);
    		}
    	};
    }

    // (2002:12) <Dialog               bind:visible={state.remediationToggle}   width="650"      on:close={() => state.remediationToggle = false}  >
    function create_default_slot(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let center;
    	let loader;
    	let t1;
    	let h4;
    	let t2_value = language.calculate_answer + "";
    	let t2;
    	let br;
    	let t3;
    	let t4_value = language.please_wait + "";
    	let t4;
    	let t5;
    	let current;
    	loader = new Loader({ props: { size: 70 } });

    	return {
    		c() {
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			center = element("center");
    			create_component(loader.$$.fragment);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text(t2_value);
    			br = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			attr(div0, "id", "remediationModel");
    		},
    		m(target, anchor) {
    			insert(target, t0, anchor);
    			insert(target, div1, anchor);
    			append(div1, div0);
    			append(div0, center);
    			mount_component(loader, center, null);
    			append(center, t1);
    			append(center, h4);
    			append(h4, t2);
    			append(h4, br);
    			append(h4, t3);
    			append(h4, t4);
    			insert(target, t5, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(t0);
    			if (detaching) detach(div1);
    			destroy_component(loader);
    			if (detaching) detach(t5);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div1;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let div0;
    	let t5;
    	let dialog;
    	let updating_visible;
    	let t6;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (window.isIE || window.isIEEleven) && create_if_block_1();

    	function select_block_type(ctx, dirty) {
    		if (window.inNative) return create_if_block$5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type();
    	let if_block1 = current_block_type(ctx);

    	function dialog_visible_binding(value) {
    		/*dialog_visible_binding*/ ctx[13].call(null, value);
    	}

    	let dialog_props = {
    		width: "650",
    		$$slots: {
    			default: [create_default_slot],
    			footer: [create_footer_slot],
    			title: [create_title_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*state*/ ctx[0].remediationToggle !== void 0) {
    		dialog_props.visible = /*state*/ ctx[0].remediationToggle;
    	}

    	dialog = new Dialog({ props: dialog_props });
    	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));
    	dialog.$on("close", /*close_handler*/ ctx[14]);

    	return {
    		c() {
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "set review";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "unset review";
    			t4 = space();
    			div0 = element("div");
    			if_block1.c();
    			t5 = space();
    			create_component(dialog.$$.fragment);
    			t6 = space();
    			input = element("input");
    			attr(button0, "type", "button");
    			attr(button0, "class", "h h-imp");
    			attr(button0, "id", "set-review");
    			attr(button1, "type", "button");
    			attr(button1, "class", "h h-imp");
    			attr(button1, "id", "unset-review");
    			attr(input, "type", "hidden");
    			attr(input, "id", "ansModeAnswer");
    			input.value = "";
    			attr(div1, "id", "authoringArea");
    			attr(div1, "class", "font14");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append(div1, t0);
    			append(div1, button0);
    			append(div1, t2);
    			append(div1, button1);
    			append(div1, t4);
    			append(div1, div0);
    			if_block1.m(div0, null);
    			append(div1, t5);
    			mount_component(dialog, div1, null);
    			append(div1, t6);
    			append(div1, input);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*click_handler*/ ctx[10]),
    					listen(button1, "click", /*click_handler_1*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if_block1.p(ctx, dirty);
    			const dialog_changes = {};

    			if (dirty[0] & /*state*/ 1 | dirty[1] & /*$$scope*/ 4194304) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible && dirty[0] & /*state*/ 1) {
    				updating_visible = true;
    				dialog_changes.visible = /*state*/ ctx[0].remediationToggle;
    				add_flush_callback(() => updating_visible = false);
    			}

    			dialog.$set(dialog_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div2);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			destroy_component(dialog);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // returns '0' or '1' according to the match status of the testcase in html editor
    function checkNewTestCase(min, counter, outp) {
    	// used for define the testcase result status 
    	let result = 1;

    	if (min) {
    		// holds '0' if number of matched occurence is less than min value
    		if (counter < outp) {
    			result = 0;
    		}
    	} else {
    		// holds '0' if number of matched occurence is greater than max value
    		if (counter > outp) {
    			result = 0;
    		}
    	}

    	// holds '0' too if counter value is 0
    	if (counter == 0) {
    		result = 0;
    	}

    	// returns the result value
    	return result;
    }

    // returns the text defined between opening and closing tag that is passed at the time of function call in string passed at first argument at the time of function call (basically in xml)
    function stringBetween(data, str_1, str_2) {
    	// contains RegExp pattern for match in string
    	let regEx;

    	if (str_2) {
    		// creates the pattern if opening and closing both tag provided at the time of function calling
    		regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
    	} else {
    		// creates the pattern if opening and closing both tag not provided at the time of function calling
    		regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
    	}

    	// contains the text according to the match data in xml string
    	let matchedStr = regEx.exec(data);

    	if (matchedStr) {
    		// returns the text between given opening and closing tag if it exist
    		return matchedStr[1];
    	} else {
    		// returns the null if text not found between given opening and closing tag
    		return null;
    	}
    }

    // returns the value of attribute defined in second argument from tag defined in 3rd argument in xml string defined in argument 1
    function findAttribute(XML, attr, tag = "") {
    	// creates new RegExp object for match the value of attribute of any tag
    	let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w.*?)\".*?>", "gm");

    	// contains the matched text in 'XML' string if it matched otherwise null value holds
    	let matchedStr = regEx.exec(XML);

    	if (matchedStr) {
    		// returns the value of attribute defined in argument variable 'attr' of tag defined in argument variable 'tag' of XML
    		return matchedStr[1];
    	} else {
    		// returns null if no matched data found
    		return null;
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let themeUrl = window.baseThemeURL
    	? window.baseThemeURL
    	: window.baseUrlTheme;

    	let { inQuizPlayer } = $$props;
    	let { editorState } = $$props;
    	let { xml } = $$props;
    	let { uaXML } = $$props;
    	let { isReview } = $$props;
    	xml = uaXML && !(/smans/gi).test(uaXML) ? uaXML : xml;

    	// defines that editor is not initialized
    	let rendered = 0;

    	// contains the xml
    	let mode = document.querySelector(".switch-input.switch-input");

    	let htmlEditor;
    	let cssEditor;
    	let jsEditor;
    	let showHTML = 1;
    	let readHTML = 1;
    	let showCSS = 1;
    	let readCSS = 1;
    	let showJS = 1;
    	let readJS = 1;
    	let userAnswer = "";
    	let isOldTestcase = false;
    	let resultSaving;
    	let state = {};

    	let stateData = writable({
    		xml: "",
    		uxml: "",
    		module: "",
    		toggle: false,
    		snackback: false,
    		lang_type: "php",
    		xmlArr: [],
    		remediationToggle: false,
    		qxml: "",
    		titleData: "",
    		stemData: "",
    		remediationData: "",
    		goDark: window.sessionStorage.goDark && window.sessionStorage.goDark == "true"
    		? true
    		: false
    	});

    	let unsubscribe = stateData.subscribe(items => {
    		$$invalidate(0, state = items);
    	});

    	// called every time when any props or state gets changed
    	beforeUpdate(() => {
    		if (xml != state.xml) {
    			$$invalidate(0, state.xml = xml, state);

    			if (isReview) {
    				let timer = setTimeout(
    					(function () {
    						// checks the answer and not allowed user to perform the task
    						setReview();

    						// clear the timeout 'timer'
    						clearTimeout(timer);
    					}).bind(this),
    					1000
    				);
    			} else {
    				let timer_next = setTimeout(
    					(function () {
    						// allowed user to perform the task in that editor which was not made readonly at the time of question creation
    						unsetReview();

    						// clear the timeout 'timer_next'
    						clearTimeout(timer_next);
    					}).bind(this),
    					200
    				);
    			}
    		}
    	});

    	function loadLibs() {
    		if (!editorState) {
    			AH.createLink(baseUrlTheme + "clsSMWeb/libs/codemirror.min.css");
    			AH.createLink(baseUrlTheme + "clsSMWeb/libs/monokai.css");
    			AH.createLink(baseUrlTheme + "clsSMWeb/libs/simplescrollbars.css");
    			AH.createLink(baseUrlTheme + "clsSMWeb/libs/webitem.min.css");
    		}
    	}

    	onMount(() => {
    		loadLibs();

    		// used for mobile team
    		if (window.inNative) {
    			window.getHeight && window.getHeight();

    			/*   jQuery('#html_pane').on('click', function () {
           jQuery(this).find('a').removeClass('active');
           jQuery('#css_panel,#js_panel').css('display', 'none');
           jQuery('#html_panel').css('display', 'block').find('a').addClass('active');
           let html_tags = htmlEditor.getValue();
           htmlEditor.setValue(html_tags);
       }); //Replaced*/
    			document.querySelector("#html_pane").addEventListener("click", function (_this) {
    				AI.select(_this).querySelector("a").classList.remove("active");

    				//document.getElementById('css_panel').style.display = 'none';
    				AH.select("#css_panel", "css", { display: "none" });

    				//document.getElementById('js_panel').style.display = 'none';
    				AH.select("#js_panel", "css", { display: "none" });

    				//document.getElementById('html_panel').style.display = 'block';
    				AH.select("#html_panel", "css", { display: "block" });

    				let container = document.querySelect("#html_panel");
    				container.querySelector("a").classList.add("active");
    				let html_tags = htmlEditor.getValue();
    				htmlEditor.setValue(html_tags);
    			});

    			/*jQuery('#css_pane').on('click', function () {
        jQuery(this).find('a').removeClass('active');
        jQuery('#html_panel,#js_panel').css('display', 'none');
        jQuery('#css_panel').css('display', 'block').find('a').addClass('active');
        let css_data = cssEditor.getValue();    
        cssEditor.setValue(css_data);
    });*/ // Replaced
    			document.querySelector("#html_pane").addEventListener("click", function (_this) {
    				let contain = AI.select(_this);
    				contain.querySelect("a").classList.remove("active");

    				//document.getElementById('html_panel').style.display = 'none';
    				AH.select("#html_panel", "css", { display: "none" });

    				//document.getElementById('js_panel').style.display = 'none';
    				AH.select("#js_panel", "css", { display: none });

    				let container = document.getElementById("css_panel");
    				container.style.display = "block";
    				container.querySelector("a").classList.add("active");
    				let css_data = cssEditor.getValue();
    				cssEditor.setValue(css_data);
    			});

    			/*    jQuery('#js_pane').on('click', function () {
            jQuery(this).find('a').removeClass('active');
            jQuery('#css_panel,#html_panel').css('display', 'none');
            jQuery('#js_panel').css('display', 'block').find('a').addClass('active');
            let js_data = jsEditor.getValue();
            jsEditor.setValue(js_data);
        });  */
    			document.querySelector("#js_pane").addEventListener("click", function (_this) {
    				let js_Pane = AI.select(_this);
    				js_Pane.querySelector("a").classList.remove("active");

    				//document.getElementById('css_panel').style.display = 'none';
    				AH.select("#css_panel", "css", { display: "none" });

    				//document.getElementById('html_panel').style.display = 'none';
    				AH.select("#html_panel", "css", { display: "none" });

    				let js_panel_container = AH.select("#js_panel");
    				js_panel_container.style.display = "block";
    				js_panel_container.querySelect("a").classlist.add("active");
    				let js_data = jsEditor.getValue();
    				jsEditor.setValue(js_data);
    			});

    			// conditon can be removed as its defined above
    			if (window.inNative) {
    				setTimeout(
    					function () {
    						window.postMessage(`height___${document.getElementById("#mainContainer").offsetHeight}`, "*");
    					},
    					500
    				);
    			}
    		}

    		setTimeout(
    			function () {
    				if (typeof CodeMirror == "function") {
    					// initialize the html, css and js editor by converting textareas having id 'html_editor', 'css_editor', 'js_editor' in html, css and js editor
    					renderCodeMirror(); //});
    				} else {
    					//jQuery(function () {
    					AI.ajax({
    						// Specifies the type of request
    						//type: "GET",
    						// Specifies the URL to send the request to
    						url: themeUrl + "src/libs/codemirror.js"
    					}).// Denotes data type expected of the server response
    					//dataType: "script",
    					// Denotes that browser will cache the requested pages
    					//cache: true,
    					// Runs the function when the request succeeds
    					// success: function (data) {
    					//     let sc = document.createElement("script");
    					// // sets the data received from 'codemirror.js' file inside the script tag
    					//     sc.innerHTML = data;
    					// // appends this created script tag in body element of the document
    					//     document.body.appendChild(sc);   
    					// renderCodeMirror();
    					// }
    					then(function (data) {
    						let sc = document.createElement("script"); // Denotes that request will not be handled asynchronously
    						//async: false,

    						// sets the data received from 'codemirror.js' file inside the script tag
    						sc.innerHTML = data;

    						// appends this created script tag in body element of the document
    						document.body.appendChild(sc);

    						renderCodeMirror();
    					}); // Fixed codemirror alignments
    					// document.querySelectorAll('.CodeMirror').forEach(function(el,i){
    					//     el.CodeMirror.refresh();
    					// })
    				} //});

    				//jQuery(function () {
    				AI.ajax({
    					// Specifies the type of request
    					// type: "GET",
    					// Specifies the URL to send the request to
    					url: themeUrl + "src/libs/split.js"
    				}).// // Denotes data type expected of the server response
    				// dataType: "script",
    				// Denotes that browser will cache the requested pages
    				// cache: true,
    				// Runs the function when the request succeeds
    				/*    success: function (data) {
            if (document.querySelector("#splitterWeb")) {
                // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                splitter();
                // returns from the function to prevent from re-appened the code if it was already defined
                return true;
            }
            // creates script element
            let script_data = document.createElement("script");
            // sets the data received from 'splitter.js' file inside the script tag
            script_data.innerHTML = data;
            // appends this created script tag in body element of the document
            document.body.appendChild(script_data);
            if (!inQuizPlayer) {
                // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
                splitter();
            } else {
                // sets the width and floating property of the js, html, css and result editor
                changeStyle();
            }
        }   */
    				then(function (data) {
    					if (document.querySelector("#splitterWeb")) {
    						// used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    						splitter(); // Denotes that request will not be handled asynchronously
    						//async: false, 

    						// returns from the function to prevent from re-appened the code if it was already defined
    						return true;
    					}

    					// creates script element
    					let script_data = document.createElement("script");

    					// sets the data received from 'splitter.js' file inside the script tag
    					script_data.innerHTML = data;

    					// appends this created script tag in body element of the document
    					document.body.appendChild(script_data);

    					if (!inQuizPlayer) {
    						// used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    						splitter();
    					} else {
    						// sets the width and floating property of the js, html, css and result editor
    						changeStyle();
    					}
    				});
    			},
    			500
    		); //});

    		/*jQuery(document).off('click', '#answerCheck').on('click', '#answerCheck', function () {
            // shows the output of the code written on the editors and sets the value of state 'remediationToggle' to true for identify that remediation mode is on
            remediationMode();
        });  // Replaced*/
    		AI.listen(document, "click", "#answerCheck", function () {
    			remediationMode();
    		});

    		/*jQuery("#set-review").on('click', function () {
            // checks the answer and not allowed user to perform the task
            setReview();
        });  //Replaced (Fixed with XML Part)
    */
    		// jQuery("#unset-review").on('click', function () {
    		//     // allowed user to perform the task in that editor which was not made readonly at the time of question creation
    		//     unsetReview(); //Replaced (Fixed with XML Part)
    		// });
    		window.save_data = function () {
    			if (typeof CodeMirror == "function") {
    				// shows the output of the code in 'Result' editor
    				//self.runCode();
    				answerCheckWeb();
    			}
    		};
    	}); // it is used only re-render purpose as its value first changes but callback function again reset it its initial value
    	//state.goDark =!state.goDark;

    	function setReview() {
    		// checks the answer
    		answerCheckWeb();

    		htmlEditor && htmlEditor.setOption("readOnly", true);
    		cssEditor && cssEditor.setOption("readOnly", true);
    		jsEditor && jsEditor.setOption("readOnly", true);
    	}

    	function unsetReview() {
    		if (typeof CodeMirror == "function") {
    			htmlEditor && htmlEditor.setOption("readOnly", readHTML ? false : true);
    			cssEditor && cssEditor.setOption("readOnly", readCSS ? false : true);
    			jsEditor && jsEditor.setOption("readOnly", readJS ? false : true);
    		}
    	}

    	function splitter() {
    		// This code will running on mobile
    		if (window.inNative) {
    			return true;
    		} else {
    			// in case when js editor is visible and either html or css or both editor visible
    			if (showJS && (showHTML || showCSS)) {
    				// it is used to styled the splitter bar that exists on the left edge of the js editor
    				// splitter1 = jQuery('#top_content').height(394).split({
    				//     // Add a vertical splitter bar
    				//     orientation: 'vertical',
    				//     // Specify how many pixels where you can't move the splitter bar on the edge
    				//     limit: 160,
    				//     // Set the position of the splitter bar
    				//     position: '68%'
    				// });
    				let splitter1 = Split(["#top_content"], { sizes: [50], direction: "vertical" });
    			}

    			// in case when html and css both editor is visible
    			if (showHTML && showCSS) {
    				// it is used to styled the splitter bar that exists on the left edge of the css editor
    				// splitter2 = jQuery('#firstEditorDiv').height(394).split({
    				//     // Add a vertical splitter bar
    				//     orientation: 'vertical',
    				//     // Specify how many pixels where you can't move the splitter bar on the edge
    				//     limit: 80,
    				//     // Set the position of the splitter bar
    				//     position: '50%'
    				// });
    				let splitter2 = Split(["#firstEditorDiv"], { sizes: [100], direction: "vertical" }); //direction: "vertical",

    				Split(["#html_panel", "#css_panel", "#js_panel"], { sizes: [50, 50, 50] });
    			}

    			// in case when only one editor visible
    			if (showHTML + showCSS + showJS == 1) {
    				// it is used to styled the splitter bar that exists on the left edge of the result editor in case when only one html, js or css editor is visible
    				// splitter3 = jQuery('#accordion').height(394).split({
    				//     // Add a vertical splitter bar
    				//     orientation: 'vertical',
    				//     // Specify how many pixels where you can't move the splitter bar on the edge
    				//     limit: 80,
    				//     // Set the position of the splitter bar
    				//     position: '60%'
    				// });
    				let Splitter3 = Split(["#accordion"], { sizes: [100], direction: "vertical" }); //direction: "vertical",
    			}
    		}
    	}

    	// sets the width and floating property of the js, html, css and result editor
    	function changeStyle() {
    		// used for mobile team
    		if (window.inNative) {
    			return;
    		}

    		if (showJS && (showHTML || showCSS)) {
    			// sets the width 50% of html/css editor if only one exist otherwise sets width 50% of parent element which contains both editor that have id 'firstEditorDiv' and float left
    			// jQuery("#firstEditorDiv")[0].style.cssText = "float:left;width:50%"; // Replaced
    			document.getElementById("firstEditorDiv").style.cssText = "float:left;width:50%";

    			// sets the width 50% of js editor and float left
    			//jQuery("#jsEditorDiv")[0].style.cssText = "float:left;width:50%"; // Replaced
    			document.getElementById("jsEditorDiv").style.cssText = "float:left;width:50%";

    			// it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
    			//jQuery("#top_content")[0].style.cssText = "clear:both;overflow:auto"; // Replaced
    			document.getElementById("top_content").style.cssText = "clear:both;overflow:auto";
    		}

    		if (showHTML && showCSS) {
    			// it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
    			//jQuery("#top_content")[0].style.cssText = "clear:both;overflow:auto"; // Replaced
    			document.querySelector("#top_content").style.cssText = "clear:both;overflow:auto";

    			// sets html editor's width 50% and float left
    			// jQuery("#html_panel")[0].style.cssText = "float:left;width:50%"; // Replaced
    			document.querySelector("#html_panel").style.cssText = "float:left;width:50%";

    			// sets css editor's width 50% and float left
    			// jQuery("#css_panel")[0].style.cssText = "float:left;width:50%"; // Replaced
    			document.querySelector("#css_panel").style.cssText = "float:left;width:50%";
    		}

    		if (showHTML + showCSS + showJS == 1) {
    			// sets css property  width 50% and float left of parent element that contains html, css and js editor 
    			//jQuery("#top_content")[0].style.cssText = "float:left;width:60%";
    			document.querySelector("#top_content").style.cssText = "float:left;width:60%";

    			// sets css property  width 40% and float left of element that contains result editor 
    			document.querySelector("#bottom_content").style.cssText = "float:left;width:40%";
    		} //jQuery("#bottom_content")[0].style.cssText = "float:left;width:40%";
    	}

    	// changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
    	function changeTheme() {
    		console.log();

    		// contains the checked status of the 'Dark Mode' checkbox
    		let check = document.querySelector("#goDark").checked;

    		// updates the value of state 'goDark' according to the value of variable 'check'
    		$$invalidate(0, state.goDark = check, state);

    		// stores the value of variable 'check' in 'goDark' variable of sessionStorage object
    		window.sessionStorage.goDark = check;

    		if (check) {
    			htmlEditor.setOption("theme", "monokai");
    			cssEditor.setOption("theme", "monokai");
    			jsEditor.setOption("theme", "monokai");
    		} else {
    			htmlEditor.setOption("theme", "default");
    			cssEditor.setOption("theme", "default");
    			jsEditor.setOption("theme", "default");
    		}
    	}

    	// updates the value of 'src' attribute of 'img', 'audio' and 'video' tag if any of these tags exist otherwise returns as it is
    	function newSource() {
    		let htmlData = htmlEditor.getValue();
    		let video_and_audio_data = ["mp4", "ogg", "webm", "mp3", "wav"];
    		let img_data = ["gif", "tif", "png", "jpg", "js"];

    		htmlData = htmlData.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function (fullMatch, src) {
    			if (src) {
    				for (let i = 0; i < video_and_audio_data.length; i++) {
    					if (src.indexOf(video_and_audio_data[i]) > -1) {
    						// returns the data after updating the src value of audio and video tag to access it globally
    						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_stream/" + src);
    					}
    				}

    				for (let i = 0; i < img_data.length; i++) {
    					if (src.indexOf(img_data[i]) > -1) {
    						// retuns the data after updating the src value of 'img' tag o globally access it
    						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_static/" + src);
    					}
    				}
    			}

    			// returns the html data after updating the 'src' value of 'img', 'video' and 'audio' tag
    			return fullMatch;
    		});

    		// returns the html data if 'img', 'video' and 'audio' tag not exist
    		//console.log({'data':htmlData})
    		return htmlData;
    	}

    	// returns the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag and hides the 'Loading...' containing after load
    	function prepareSource() {
    		try {
    			// contains the html editor value after updating the src value of img, video and audio tag
    			let htmlData = "<div id='loader' style='position: fixed;width: 100%;height: 100vh;z-index: 9999;background-color:#fff;'>Loading...</div>" + newSource();

    			let cssData = cssEditor.getValue();
    			let jsData = jsEditor.getValue();
    			cssData = cssData.replace(/url\(['"](.*?)['"]\)/g, "url(\"https://s3.amazonaws.com/jigyaasa_content_static/$1\")");
    			jsData = jsData.replace(/src.*?["'](.*?)["']/gi, "src = \"https://s3.amazonaws.com/jigyaasa_content_static/$1\"");

    			jsData = `window.addEventListener("load", function(ev) {
                document.getElementById('loader').style.display = 'none';
            });${jsData}`;

    			// contains the combined data of html, css and js editor
    			let fullData = htmlData + "<style>" + cssData + "</style><script>" + jsData + "</script>";

    			return fullData;
    		} catch(e) {
    			console.log({ e, func: "prepareSource@393" });
    			return "";
    		}
    	}

    	// initialize the html, css and js editor by converting textareas having id 'html_editor', 'css_editor', 'js_editor' in html, css and js editor
    	function renderCodeMirror() {
    		if (rendered) {
    			// returns true to prevent from re-initialize the editors if it was already initialized
    			return true;
    		}

    		// initialize the css editor
    		cssEditor = CodeMirror.fromTextArea(document.getElementById("css_editor"), {
    			lineNumbers: true,
    			mode: "css",
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			lineWrapping: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		// initialize the html editor
    		htmlEditor = CodeMirror.fromTextArea(document.getElementById("html_editor"), {
    			lineNumbers: true,
    			mode: "text/html",
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			lineWrapping: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		// initialize the js editor
    		jsEditor = CodeMirror.fromTextArea(document.getElementById("js_editor"), {
    			lineNumbers: true,
    			mode: "text/javascript",
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			lineWrapping: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		// used for set the value of html, css, js editors, makes editor readonly which was made disabled at the time of question creation, hide the editors which was made hidden at the time of questio creation and change the theme of html, css and js editors according to the check status of 'Dark Theme' checkbox
    		parseXML();

    		// used for mobile team
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		if (typeof htmlEditor == "object" && !window.isReviewMode) {
    			htmlEditor.on("change", function () {
    				// used for update the user answer xml value when value of html editor gets changed and review mode is off
    				saveWebAnswer(htmlEditor.getValue(), "html");
    			});
    		}

    		if (typeof cssEditor == "object" && !window.isReviewMode) {
    			cssEditor.on("change", function () {
    				// used for update the user answer xml value when value of css editor gets changed and review mode is off
    				saveWebAnswer(cssEditor.getValue(), "css");
    			});
    		}

    		if (typeof jsEditor == "object" && !window.isReviewMode) {
    			jsEditor.on("change", function () {
    				// used for update the user answer xml value when value of js editor gets changed and review mode is off
    				saveWebAnswer(jsEditor.getValue(), "js");
    			});
    		}

    		// not sure why it is used as this id does not exist here
    		if (document.getElementById("aXml")) {
    			let xmlEditor = CodeMirror.fromTextArea(document.getElementById("aXml"), {
    				lineNumbers: false,
    				mode: "application/xml",
    				autoCloseBrackets: true,
    				lineWrapping: true,
    				matchBrackets: true
    			});
    		}

    		htmlEditor.setOption("extraKeys", {
    			// Changing Tabs into 4 spaces 
    			Tab(cm) {
    				let spaces = Array(cm.getOption("indentUnit") + 3).join(" ");
    				cm.replaceSelection(spaces);
    			},
    			// used for toggle between fullScreen but it not worked for me
    			F11(cm) {
    				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    			},
    			// used for remove the fullScreen mode but it not worked for me
    			Esc(cm) {
    				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    			}
    		});

    		// defines that editor is initialized
    		rendered = 1;
    	}

    	// shows the output of the code written on the editors and sets the value of state 'remediationToggle' to true for identify that remediation mode is on
    	function remediationMode() {
    		// sets the value of state 'remediationToggle' to true that indicates that remediation mode is on
    		$$invalidate(0, state.remediationToggle = true, state);

    		// shows the output of the code in 'Result' editor
    		runCode();
    	}

    	// used for show the result of testcases
    	function answerCheckWeb(isRun = true) {
    		let resNew = {};
    		resNew.u = resultSaving;

    		// contains rows of Remediation dialog box in each row 2 columns exist in first column testcase number defined and in second column their result status defined
    		let case_result = [];

    		// shows the output of the code in 'Result' editor according to the value of argument variable 'isRun'
    		isRun ? runCode() : "";

    		// contains the string defined in 'Testcases' field of 'Autograde' dialog box
    		let get_test_cases = stringBetween(state.xml, "<autograde type=\"testcase\">", "</autograde>");

    		// enters in this block if any testcase defined in 'Testcases' of 'Autograde' dialog box
    		if (get_test_cases) {
    			// contains the string if exist in variable 'get_test_cases' otherwise blank value contains
    			get_test_cases = get_test_cases ? get_test_cases.trim() : "";

    			// replaces string starts from '</case>' and ends at '<case>' with ';' and replaces single '</case>' or '<case>' with blank 
    			get_test_cases = get_test_cases.replace(/<\/case>[\s\S]*?<case>/gm, ";").replace(/<\/case>|<case>/g, "");

    			// contains array of defined testcses which exist in 'Testcases' field of 'Autograde' dialog box
    			get_test_cases = get_test_cases.split(";");

    			// loops through the each testcase
    			for (let i in get_test_cases) {
    				// enters in this block if testcase is defined in 'Testcases' field of 'Autograde' dialog box
    				if (testcaseCheck(get_test_cases[i])) {
    					// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Test Case' and result status as Passed if value returned by method testcaseCheck is true
    					case_result.push("<tr>" + "<td>Test Case" + (parseInt(i) + 1) + "</td>" + "<td>Passed</td>" + "</tr>");
    				} else {
    					// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Test Case' and result status as Failed if value returned by method testcaseCheck is false
    					case_result.push("<tr>" + "<td>Test Case" + (parseInt(i) + 1) + "</td>" + "<td>Failed</td>" + "</tr>");
    				}
    			}
    		}

    		// contains the testcases defined in 'Internal Script' field of 'Autograde' dialog box
    		let get_internal_cases = stringBetween(state.xml, "<autograde type=\"internal\">", "</autograde>");

    		// enters in this block if any testcase defined in 'Internal Script' of 'Autograde' dialog box
    		if (get_internal_cases) {
    			// contains string if exist in 'Internal Script' otherwise contains blank value
    			get_internal_cases = get_internal_cases ? get_internal_cases.trim() : "";

    			// replaces string starts from '</case>' and ends at '<case>' with ';' and replaces single '</case>' or '<case>' with blank 
    			get_internal_cases = get_internal_cases.replace(/<\/case>[\s\S]*?<case>/gm, ";").replace(/<\/case>|<case>/g, "");

    			// contains array of defined testcses which exist in 'Internal Script' field of 'Autograde' dialog box
    			get_internal_cases = get_internal_cases.split(";");

    			for (let i in get_internal_cases) {
    				// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Passed if value returned by method internalCheck is true
    				if (internalCheck(get_internal_cases[i])) {
    					case_result.push("<tr>" + "<td>Internal Case" + (parseInt(i) + 1) + "</td>" + "<td>Passed</td>" + "</tr>");
    				} else {
    					case_result.push("<tr>" + "<td>Internal Case" + (parseInt(i) + 1) + "</td>" + "<td>Failed</td>" + "</tr>");
    				}
    			}
    		}

    		// contains the testcases defined in 'External Script' field of 'Autograde' dialog box
    		let get_external_cases = stringBetween(state.xml, "<autograde type=\"custom\">", "</autograde>");

    		// enters in this block if any testcase defined in 'External Script' of 'Autograde' dialog box
    		if (get_external_cases) {
    			// contains the value of 'Extenal Script' field 
    			let get_case = get_external_cases.replace(/<case>|<\/case>/gm, "");

    			// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Failed  if value returned by method externalCheck is true
    			if (externalCheck(get_case)) {
    				case_result.push("<tr>" + "<td>External Case</td>" + "<td>Passed</td>" + "</tr>");
    			} else {
    				// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Failed  if value returned by method externalCheck is false
    				case_result.push("<tr>" + "<td>External Case</td>" + "<td>Failed</td>" + "</tr>");
    			}
    		}

    		// joins the array 'case_result' in string 
    		let case_str = case_result.join("");

    		// used for show the answer correct of incorrect in mobile
    		let inNativeIsCorrect = null;

    		if ((/Failed/gi).test(case_str)) {
    			// uncheck the element have id 'answer' if 'Failed' string exist in result string
    			//jQuery("#answer").prop("checked", false);
    			resNew.a = false;

    			AI.select("#answer").checked = false;

    			// sets the value 'false' of variable 'inNativeIsCorrect' to show incorrect answer in mobile
    			inNativeIsCorrect = false;
    		} else {
    			//jQuery("#answer").prop("checked", true);
    			resNew.a = true;

    			AI.select("#answer").checked = true;

    			// sets the value 'true' of variable 'inNativeIsCorrect' to show correct answer in mobile
    			inNativeIsCorrect = true;
    		}

    		// used for mobile team
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		// used for mobile team
    		if (window.inNative) {
    			// replaced #special_module_user_xml
    			window.postMessage(JSON.stringify({
    				userAnswers: document.getElementById("special_module_user_xml").value,
    				inNativeIsCorrect
    			}));
    		}

    		// defines the table containing the field 'Test Case' and 'Result' in table head and value stored in variable 'case_str' as body part of the table
    		let reviewLayout = "<table style=\"width:500px;\" class=\"table\"><thead class=\"thead-inverse\"><tr style='background-color:#4285F4'><th style='background-color:#4285F4'>Test Case</th><th>Result</th></tr></thead>" + case_str + "</table>";

    		// enters in this block if remediation mode is on
    		if (state.remediationToggle) {
    			// sets the table in element have id 'remediationModel' means in remediation dialog box
    			//jQuery("#remediationModel").html(reviewLayout); // Replaced
    			document.getElementById("remediationModel").innerHTML = reviewLayout;
    		}

    		onUserAnsChange({ uXml: resNew.u, ans: resNew.a });

    		// returns the defined table
    		return reviewLayout;
    	}

    	// returns true or false according to the matched value of testcase defined in 'Testcases' field of 'Autograde' dialog box
    	function testcaseCheck(get_cases) {
    		// contains the array after spliting by symbol '|'
    		let caseArr = get_cases.split("|");

    		// denotes that array argument passed
    		let fInp = 0;

    		// contains the name of the function defined in testcase
    		let test_func = caseArr[0];

    		// contains the arguments of the function defined in testcase
    		let test_inp = caseArr[1];

    		// contains return value of the function defined in testcase
    		let test_oup = caseArr[2];

    		// used for hold the error message
    		let error = {};

    		// used for contain the value of js editor
    		let js_data = "";

    		try {
    			if (typeof caseArr[1] == "string" && caseArr[1].indexOf("{arr") < 0) {
    				// contains an array after replacing '{pip}' with '|' and spliting with comma
    				test_inp = caseArr[1].replace("{pip}", "|").split(",");
    			} else if (caseArr[1].indexOf("{arr") > -1) {
    				// contains an array after replacing '{arr' or '}' with blank value and spliting with comma
    				test_inp = caseArr[1].replace(/\{arr|\}/g, "").split(",");

    				// updates value '1' to denote that array argument passed
    				fInp = 1;
    			} else {
    				// contains the arguments of the function defined in testcase
    				test_inp = caseArr[1];
    			}

    			// contains the value of js editor after removing white space from start and end of the string
    			js_data = jsEditor.getValue().trim();

    			// removes all the text that exist in same line starting from 'document.write' string of js editor value 
    			js_data = js_data.replace(/document\.write.*/gm, "");

    			// if function name, argument of the function or value of function return is not declaired in testcase then without checking answer it returns from function by returning value 'false'
    			if (!test_func || !test_inp || !test_oup) {
    				// sets the error message
    				error["validation"] = "Invalid Test Cases";

    				// returns value false
    				return false;
    			}

    			// if type of the function is undefined then also returns from function without checking the answer after setting error message
    			if (typeof test_func == undefined) {
    				error["func_check"] = "Function case is undefined";
    				return false;
    			}

    			// pattern for contain the 
    			let re = new RegExp("function " + test_func + ".*?\\)", "g");

    			// array for hold the matched text return by the 'exec' method
    			let params = [];

    			// contains the text that matches in js editor value for pattern defined in variable 're'
    			params = re.exec(js_data);

    			// converts array 'params' into string
    			params = params.join();
    		} catch(err) {
    			// holdes error mesaage in case of any error occurred
    			error["function_exist"] = "Given Function doesn't exist";
    		}

    		// used for contains the js editor value and function call string with arguments
    		let eval_str = "";

    		try {
    			if (typeof inp == "array" || typeof inp == "object" && !fInp) {
    				// contains js editor value and calls function with argument defined in testcase after joining the argument in string and wrapping in parenthesis if it is object
    				eval_str = js_data + "\n" + test_func + "(" + test_inp.join() + ");";
    			} else if (fInp) {
    				// contains js editor value and calls function with argument defined in testcase after wrapping the argument in square bracket then in parenthesis if value of variable 'fInp' holds 1
    				eval_str = js_data + "\n" + test_func + "([" + test_inp + "]);";
    			} else {
    				// contains js editor value and calls function with argument defined in testcase after wrapping argument in parenthesis 
    				eval_str = js_data + "\n" + test_func + "(" + test_inp + ");";
    			}

    			// evalute the string hold in variable 'eval_str' and contains its output
    			let actual_outp = eval(eval_str);

    			// returns true/false if evaluated value mathches with function return value defined in testcase
    			if (actual_outp == test_oup) {
    				return true;
    			} else {
    				return false;
    			}
    		} catch(err) {
    			// sets the error message in case of error 
    			error["output_error"] = err;

    			// returns from function by returning value 'false'
    			return false;
    		}
    	}

    	// splite the testcase and returns the array according to the value of old or new testcase format for match html or css
    	function splitCase(caseData, type) {
    		if (type == "style") {
    			if (caseData.includes("$")) {
    				// indicates the it is new testcase format for css match
    				isOldTestcase = false;

    				// splite from symbol '$' and returns the array
    				return caseData.split("$");
    			} else {
    				// indicates the it is old testcase format for css match
    				isOldTestcase = true;

    				// splite from symbol '{' and returns the array
    				return caseData.split("{");
    			}
    		} else {
    			if (caseData.includes("?")) {
    				// indicates the it is new testcase format for html match
    				isOldTestcase = false;

    				// splite from symbol '?' and returns the array
    				return caseData.split("?");
    			} else {
    				// indicates the it is old testcase format for html match
    				isOldTestcase = true;

    				// splite from symbol '|' and returns the array
    				return caseData.split("|");
    			}
    		}
    	}

    	// returns '0' or '1' according to the match status of the testcase in html editor
    	function checkOldAttrTestCase(pattern, outp, min, part) {
    		// array containing all the matched string in html editor defined in matching pattern
    		let matchHtml = htmlEditor.getValue().match(pattern);

    		// used for define the testcase result status 
    		let result = 0;

    		if (matchHtml) {
    			if (part) {
    				// creates temporary array for hold the matched data
    				let tempMatch = [];

    				matchHtml.map(value => {
    					if (value.replace(/\s/g, "").includes(part.replace(/\s/g, ""))) {
    						tempMatch.push(value);
    					} else {
    						console.log(value, part);
    					}
    				});

    				// updates the value of variable 'matchHtml'
    				matchHtml = tempMatch;
    			}

    			if (min) {
    				// holds '0' if number of matched occurence is less than min value otherwise holds 1
    				result = matchHtml.length < outp ? 0 : 1;
    			} else {
    				// holds '0' if number of occurence is greater than max value otherwise holds 1
    				result = matchHtml.length > outp ? 0 : 1;
    			}
    		}

    		// returns the value of variable result
    		return result;
    	}

    	// used for call the 'attr_match', 'style_match' or 'str_match' method with required arguments and returns the value according to the return value of these methods
    	function internalCheck(get_cases) {
    		// splite the testcase and returns the array according to the value of old or new testcase format for match html or css
    		let caseArr = splitCase(get_cases);

    		let str = "", i;

    		if (caseArr[0].indexOf("style_match") > -1) {
    			// returns true or false according to the return value of method 'style_match'
    			return style_match(caseArr[1], caseArr[2], caseArr[3]);
    		} else if (caseArr[0].indexOf("attr_match") > -1) {
    			// enters in this block in case of string matched in defined tag and that tag contains character '?'
    			if (caseArr.length > 4) {
    				for (i = 2; i < caseArr.length - 1; i++) {
    					if (i == 2) {
    						// adds the string defined in array 'caseArr' at index '2' in string defined in variable 'str'
    						str = str + caseArr[i];
    					} else {
    						// adds the character '?' and string defined in array 'caseArr' at index equals to the value of variable 'i' in string defined in variable 'str'
    						str = str + "?" + caseArr[i];
    					}
    				}

    				// returns true of false according to the return value of method 'attr_match'
    				return attr_match(caseArr[1], str, caseArr[caseArr.length - 1]);
    			} else {
    				// returns true of false according to the return value of method 'attr_match'
    				return attr_match(caseArr[1], caseArr[2], caseArr[3]);
    			}
    		} else {
    			// enters in this block in case of string matched anywhere in whole html or js editor and that editor contains character '?'
    			if (caseArr.length > 4) {
    				for (i = 2; i < caseArr.length - 1; i++) {
    					if (i == 2) {
    						// adds the string defined in array 'caseArr' at index '2' in string defined in variable 'str'
    						str = str + caseArr[i];
    					} else {
    						// adds the character '?' and string defined in array 'caseArr' at index equals to the value of variable 'i' in string defined in variable 'str'
    						str = str + "?" + caseArr[i];
    					}
    				}

    				// returns true of false according to the return value of method 'str_match'
    				return str_match(caseArr[1], str, caseArr[caseArr.length - 1]);
    			} else {
    				// returns true of false according to the return value of method 'str_match'
    				return str_match(caseArr[1], caseArr[2], caseArr[3]);
    			}
    		}
    	}

    	// returns true or false according to the match property value of defined css selector
    	function style_match(src, selector, inp) {
    		// denotes the status of the testcase according to the matched value
    		let flag_check = 1;

    		// Window object that allows to access the iframe's document and its internal DOM
    		let frameDoc = document.getElementsByClassName("result_frame")[0].contentWindow.document;

    		// enters in this block if pseudo selector used
    		if (selector.indexOf("::") > -1) {
    			// array of pseudo selector
    			let pseudo_elm = selector.split("::");

    			// string containing pseudo class with prefix ':'
    			let str = ":" + pseudo_elm[1];

    			// selects element on which pseudo selection applied
    			let pseudo_elm_selector = pseudo_elm[0];
    		}

    		let indx, new_class, new_selector, new_tag_name;

    		// enters in this block if hover, active or visited pseudo class applied
    		if (selector.indexOf(":hover") > -1 || selector.indexOf(":visited") > -1 || selector.indexOf(":active") > -1) {
    			// contains the last index of colon in pseudo selector
    			indx = selector.lastIndexOf(":");

    			// selects the element on which pseudo classes applied
    			new_selector = selector.substring(0, indx);

    			// contains the value of pseudo class
    			let class_name = selector.substring(indx + 1, selector.length);

    			// contains the value of pseudo class with prefix '.'
    			new_class = "." + class_name;

    			if (frameDoc.querySelector(new_selector)) {
    				// contains the name of the tag on which pseudo selection applied
    				new_tag_name = frameDoc.querySelector(new_selector).nodeName.toLowerCase();

    				// creates the element defined in variable 'new_tag_name'
    				let create_elm = document.createElement(new_tag_name);

    				// sets the class attribute with value of pseudo class
    				create_elm.setAttribute("class", class_name);

    				// append the created element in body tag that exist in iframe of result field
    				frameDoc.querySelector("body").appendChild(create_elm);
    			} else {
    				// if element not found on which pseudo selection applied then returns false
    				return false;
    			}

    			// pattern for matching the value of starts with defined pseudo selector and any number of space between pseudo selector and opening curly brace and any value containing in curly brace including braces
    			let patt = new RegExp(selector + "[ ]*{([\\s\\S]*?)}", "");

    			// contains the text matched in style tag defined in variable 'patt' after removing new line character
    			let is_matched = frameDoc.querySelector("style").innerHTML.replace(/\\n/, "").match(patt);

    			// enters in this block if matching found
    			if (is_matched) {
    				// containing the value defined with pseudo selector in curly brace excluding braces
    				let prop_and_val = frameDoc.querySelector("style").innerHTML.replace(/\\n/, "").match(patt)[0].replace(patt, function (fullmatch, propsNval) {
    					// returns value exist inside curly brace
    					return propsNval;
    				});

    				// creates textNode containing value of variable 'new_class' and value of variable 'prop_and_val' after wraping it in curly brace
    				let txt = document.createTextNode(new_class + "{" + prop_and_val + "}");

    				// append this text to style tag
    				frameDoc.querySelector("style").appendChild(txt);
    			} else {
    				// return false if defined pattern not matched in style tag
    				return false;
    			}
    		}

    		// used for select the element
    		let data;

    		if (new_class && frameDoc.querySelector("style").innerHTML.replace(/\\n/, "").match(new_class)) {
    			// selects element have class attribute that is equals to the value of variable 'new_class'
    			data = frameDoc.querySelector(new_class);
    		} else if (pseudo_elm_selector) {
    			// selects element with tag name that is equals to the value of variable 'pseudo_elm_selector'
    			data = frameDoc.querySelector(pseudo_elm_selector);
    		} else {
    			// selects element with css selector defined in variable 'selector'
    			data = frameDoc.querySelector(selector);
    		}

    		// splite the testcase and returns the array according to the value of old or new testcase format for match css
    		let input = splitCase(inp, "style");

    		// contains the value of css property that exist in array 'input' at index '0'
    		let outp = input[1];

    		// for contain the value of css property of defined css selector
    		let checkStyle;

    		// enters in this block if pseudo class defined
    		if (str) {
    			// enters in this block if selector element defined
    			if (data) {
    				// contains the value of css property defined in array 'input' at index '0' of element that is stored in variable 'data' and have pseudo class which is equals to the value of variable 'str'
    				checkStyle = window.getComputedStyle(data, str).getPropertyValue(input[0]);
    			}
    		} else {
    			// enters in this block if selector element defined
    			if (data) {
    				// contains the value of css property defined in array 'input' at index '0' of element that is stored in variable 'data'
    				checkStyle = window.getComputedStyle(data).getPropertyValue(input[0]);
    			}
    		}

    		// enters in this block if pseudo class exist
    		if (selector.indexOf(":hover") > -1 || selector.indexOf(":visited") > -1 || selector.indexOf(":active") > -1) {
    			// selects the element that have class which is previously defined using pesudo class
    			let delete_elm = frameDoc.getElementsByClassName(class_name)[0];

    			// removes the element have class which is equals to the value of variable 'delete_elm'
    			delete_elm.parentNode.removeChild(delete_elm);

    			// removes the textNode from style tag that was previously added
    			frameDoc.querySelector("style").innerHTML = frameDoc.querySelector("style").innerHTML.replace(/\\n/gm, "").replace(txt.textContent, "");
    		}

    		// sets the value '0' of variable 'flag_check' if defined value of testcase css property is not equals to the matched value of css property for defined css selector
    		if (checkStyle != outp) {
    			flag_check = 0;
    		}

    		// returns true of false according to the value of variable 'flag_check'
    		if (flag_check) {
    			return true;
    		} else {
    			return false;
    		}
    	}

    	// used for return the result status of the testcases defined for match in html editor  
    	function attr_match(src, inp, outp) {
    		let flag_check = 1,
    			// denotes that tag matching is required
    			singular = 0,
    			// denotes that string matching is required in defined tag 
    			justString = 0,
    			// denotes that attribute matching is required of defined tag 
    			hasTagsAttribute = 0,
    			// denotes that attribute and their value matching is required of defined tag 
    			hasTagsAttributeValue = 0,
    			// denotes that 'max' flag is not enabled
    			max = false,
    			// denotes that 'min' flag is not enabled
    			min = false; // by default sets the value 1 that indicates that matching is ok

    		let i;

    		try {
    			if (inp.indexOf("{1}") > -1) {
    				// denotes that testcase is defined for match tag in html editor
    				singular = 1;

    				// removes the flag '{1}' from testcase string
    				inp = inp.replace("{1}", "");
    			}

    			if (inp.indexOf("{2}") > -1) {
    				// denotes that testcase is defined for match string in defined tag in html editor
    				justString = 1;

    				// removes the flag '{2}' from testcase string
    				inp = inp.replace("{2}", "");
    			}

    			if (inp.indexOf("{3}") > -1) {
    				// denotes that testcase is defined for match only attribute not their value of defined tag in html editor
    				hasTagsAttribute = 1;

    				// removes the flag '{3}' from testcase string
    				inp = inp.replace("{3}", "");
    			}

    			if (inp.indexOf("{4}") > -1) {
    				//if check value of attribute only
    				// denotes that testcase is defined for match attribute and their value of defined tag in html editor
    				hasTagsAttributeValue = 1;

    				// removes the flag '{4}' from testcase string
    				inp = inp.replace("{4}", "");
    			}

    			if (outp.indexOf("min") > -1) {
    				// denotes that 'min' flag is enabled
    				min = true;

    				// removes the 'min' text from defined flag and contains the numeric value only
    				outp = parseInt(outp.replace("min", ""));
    			} else if (outp.indexOf("max") > -1) {
    				// denotes that 'max' flag is enabled
    				max = true;

    				// removes the 'max' text from defined flag and contains the numeric value only
    				outp = parseInt(outp.replace("max", ""));
    			}

    			if (src == "HTML") {
    				// Window object that allows to access the iframe's document and its internal DOM
    				let frameDoc = document.getElementsByClassName("result_frame")[0].contentWindow.document;

    				// in case of tag match enters in this block
    				if (singular) {
    					// contains number of matching tag exist
    					let lengthCheck = frameDoc.getElementsByTagName(inp).length;

    					// enters in this block in case of min flag is enabled
    					if (min) {
    						// sets the value of variable flag_check '0' in case of defined min value is greater than number of matching tag
    						if (lengthCheck < outp) {
    							flag_check = 0;
    						}
    					} else {
    						// sets the value of variable flag_check '0' in case of defined max value is less than number of matching tag
    						if (lengthCheck > outp) {
    							flag_check = 0;
    						}
    					}
    				} else {
    					let tag_name, allCheck, counter = 0, str_data = "", match_str = "";

    					// enters in this block in case of testcase defined for match string in perticular tag
    					if (justString) {
    						// contains an array after spliting testcase value with '{'
    						tag_name = inp.split("{");

    						if (tag_name.length > 2) {
    							for (i = 1; i < tag_name.length; i++) {
    								if (i == 1) {
    									// adds the string defined in array tag_name at index '1' in string 'str_data'
    									str_data = str_data + tag_name[i];
    								} else {
    									// adds the string '{' and string defined in array tag_name at index equals to the value of variable 'i' in string 'str_data'
    									str_data = str_data + "{" + tag_name[i];
    								}
    							}

    							// adds the string 'str_data' in string 'match_str'
    							match_str = match_str + str_data;
    						} else {
    							// adds the string defined in array tag_name at index '1' in string 'match_str'
    							match_str = match_str + tag_name[1];
    						}

    						// enters in this block if testcase is defined in old format
    						if (isOldTestcase) {
    							// creates pattern to match the string inside any tag
    							let checkHtml = new RegExp(`<.*?>(${tag_name[0]})<\/.*?>`, "gi");

    							// contains '0' or '1' according to the match status of the testcase in html editor
    							flag_check = checkOldAttrTestCase(checkHtml, outp, min);
    						} else {
    							// selects all tag in which string existing have to check
    							allCheck = frameDoc.querySelectorAll(tag_name[0]);

    							// loops through the available tags in which string existing have to check
    							for (i = 0; i < allCheck.length; i++) {
    								if (allCheck[i].innerHTML.toLowerCase().replace(/\s+/gm, "").trim().indexOf(match_str.toLowerCase().replace(/\s+/gm, "").trim()) > -1) {
    									// increases the value of variable counter by 1 if string exist in defined tag
    									counter++;
    								}
    							}

    							// contains '0' or '1' according to the match status of the testcase in html editor
    							flag_check = checkNewTestCase(min, counter, outp);
    						}
    					} else if (hasTagsAttribute) {
    						// contains the array of testcase
    						tag_name = inp.split("{");

    						if (isOldTestcase) {
    							// pattern for match the desize attribute containing any value
    							let attrReg = new RegExp(`${tag_name[0]}(\\s*=\\s*)["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?`, "gi");

    							// contains '0' or '1' according to the match status of the testcase in html editor
    							flag_check = checkOldAttrTestCase(attrReg, outp, min);

    							if (!flag_check) {
    								// pattern for match the whole value starts from character '<' and ends at '>'
    								let nextTry = new RegExp(`<(\\w+)(.*?)>`, "gi");

    								// array containing matched string in html editor
    								let matchText = htmlEditor.getValue().match(nextTry);

    								// sets true of false according to the value of array matchText at index 0 and it contains the name of the attribute defined in array tag_name at index 0
    								flag_check = matchText[0] && matchText[0].includes(tag_name[0])
    								? true
    								: false;
    							}
    						} else {
    							// selects all tags in iframe that is defined in testcase 
    							allCheck = frameDoc.querySelectorAll(tag_name[0]);

    							for (i = 0; i < allCheck.length; i++) {
    								if (allCheck[i].hasAttribute(tag_name[1])) {
    									// increases the value of counter if attribute matched in any tag defined in testcase
    									counter++;
    								}
    							}

    							// contains '0' or '1' according to the match status of the testcase in html editor
    							flag_check = checkNewTestCase(min, counter, outp);
    						}
    					} else if (hasTagsAttributeValue) {
    						// contains the array of testcase
    						tag_name = inp.split("{");

    						if (isOldTestcase) {
    							// array contains attribute at index '0' and its value at index '1'
    							tag_name = inp.split("$");

    							// pattern for match the desize attribute containing any value
    							let attrValueReg = new RegExp(`${tag_name[0]}(\\s*=\\s*)["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?`, "gi");

    							// contains '0' or '1' according to the match status of the testcase in html editor
    							flag_check = checkOldAttrTestCase(attrValueReg, outp, min, tag_name[1]);
    						} else {
    							// selects all tags in iframe that is defined in testcase 
    							allCheck = frameDoc.querySelectorAll(tag_name[0]);

    							for (i = 0; i < allCheck.length; i++) {
    								// contains the value of defined attribute 
    								let a = allCheck[i].getAttribute(tag_name[1])
    								? allCheck[i].getAttribute(tag_name[1])
    								: "";

    								// removes the semicolon from value of defined attribute
    								a = a.replace(/;/g, "");

    								if (a.replace(/\s+/g, "").trim() == tag_name[2].replace(/\s+/g, "").trim()) {
    									// increases the value of counter by 1 if matched value of defined attribute is equals to the value of defined value in testcase
    									counter++;
    								}
    							}

    							// contains '0' or '1' according to the match status of the testcase in html editor
    							flag_check = checkNewTestCase(min, counter, outp);
    						}
    					}
    				}
    			}

    			// returns true or false according to the value of variable flag_check
    			return flag_check ? true : false;
    		} catch(error) {
    			// message the log on console in case of any error occured
    			console.log({
    				error,
    				func: "attr_match",
    				"Cause": "Old Case, need to convert like attr_match?HTML?TAG{ATTR{Value{MatchType}?MAX/MIN"
    			});

    			// returns false in case of any error occured
    			return false;
    		}
    	}

    	// used for match testcase string in whole html/js editor in case of html/js and in case of css it matches the media query, css selector and css property defined together in whole css editor 
    	function str_match(src, inp, outp) {
    		// indicates that string is matched in html/js editor according to the value of argument variable 'src'
    		let flag_check = 1,
    			singular = 0,
    			justString = 0,
    			complexTags = 0,
    			tag_data = "",
    			max = false,
    			min = false;

    		let input_data = inp;

    		if (inp.indexOf("{1}") > -1) {
    			// it is not in use for this function
    			singular = 1;

    			// removes the flag '{1}' from testcase string
    			inp = inp.replace("{1}", "");
    		}

    		if (inp.indexOf("{2}") > -1) {
    			// it is not in use for this function
    			justString = 1;

    			// removes the flag '{2}' from testcase string
    			inp = inp.replace("{2}", "");
    		}

    		if (inp.indexOf("{3}") > -1) {
    			// it is not in use for this function
    			complexTags = 1;

    			// removes the flag '{3}' from testcase string
    			inp = inp.replace("{3}", "");
    		}

    		if (outp.indexOf("min") > -1) {
    			// indicates that 'min' flag is enable
    			min = true;

    			// removes the 'min' text from defined flag and contains the numeric value
    			outp = parseInt(outp.replace("min", ""));
    		} else if (outp.indexOf("max") > -1) {
    			// indicates that 'max' flag is enable
    			max = true;

    			// removes the 'max' text from defined flag and contains the numeric value
    			outp = parseInt(outp.replace("max", ""));
    		}

    		// contains array of each character
    		let word_arr = inp.split("");

    		for (let i = 0; i < word_arr.length; i++) {
    			if (word_arr[i].match(/\W/g)) {
    				// adds flag '\\' before non word character 
    				word_arr[i] = "\\" + word_arr[i];
    			}
    		}

    		// converts array 'word_arr' into string after applying flag '\\' before non word character
    		inp = word_arr.join("");

    		// in case of 'str_match' in html, string matched in whole html part so no need of this block
    		if (src == "HTML") {
    			// contains the testcase data that have to be match
    			tag_data = inp;

    			// contains string data that have to be match
    			inp = justString
    			? inp
    			: complexTags
    				? "<" + inp + ".*?>.*?</" + inp + ">"
    				: singular
    					? "<" + inp.replace("[", " ").replace("]", "") + "(| |/| /)>"
    					: "<" + inp.replace("[", " ").replace("]", "") + ">" + ".*?</" + tag_data + ">";
    		}

    		// contains pattern to be match defined testcase in 
    		let re = "",
    			// container for hold the html editor value
    			html_tags = "",
    			// container for hold the css editor value
    			css_data = "",
    			// container for hold the js editor value
    			js_data = "";

    		try {
    			// contains new RegExp object for match defined string globally
    			re = new RegExp(inp, "g");

    			html_tags = htmlEditor.getValue().trim();
    			css_data = cssEditor.getValue().trim();
    			js_data = jsEditor.getValue().trim();
    			css_data = css_data.replace(/\n/gm, "");
    			js_data = js_data.replace(/\ /g, "");
    		} catch(e) {
    			// returns back in case of any error
    			return false;
    		}

    		if (src == "HTML") {
    			if (html_tags.match(re)) {
    				if (html_tags.match(re).length == outp && html_tags) {
    					flag_check = 1;
    				} else if (html_tags.match(re).length <= outp && html_tags && html_tags.match(re).length && max) {
    					flag_check = 1;
    				} else if (html_tags.match(re).length >= outp && html_tags && html_tags.match(re).length && min) {
    					flag_check = 1;
    				} else {
    					flag_check = 0;
    				}
    			} else {
    				flag_check = 0;
    			}
    		} else if (src == "CSS") {
    			// contains the array of matching data
    			input_data = input_data.split("{");

    			// creates an array for contain the defined media queries
    			let media_arr = [];

    			// initialize the counter
    			let counter = 0;

    			// removes space from the value of css editor that exist inside parenthesis
    			css_data = css_data.replace(/\(.*?\)/gm, function (match_data) {
    				return match_data.replace(/[ ]/gm, "");
    			});

    			// replaces '@' with '\n@'
    			css_data = css_data.replace(/@/gm, "\n@");

    			// contains the media data that starts from character '@' and ends before first curly brace 
    			css_data = css_data.replace(/@([\s\S]*?){([\s\S]*?){([\s\S]*?)}([\s\S]*?)}/gm, function (match_data, media_data) {
    				// contains meida query data that starts from character '@' and ends before first curly brace 
    				let find_media_data = media_data;

    				// contains an array of string defined in variable 'find_media_data' after spliting it with white space character
    				find_media_data = find_media_data.split(" ");

    				// array for store media data that are stored in array 'find_media_data' after removing blank values
    				let store_data = [];

    				for (let i = 0; i < find_media_data.length; i++) {
    					if (find_media_data[i] != "") {
    						// pushes data into array 'store_data' which is defined in array 'find_media_data' at index equals to the value of variable 'i'
    						store_data.push(find_media_data[i]);
    					}
    				}

    				// contains string after joining array 'store_data 'with' white space
    				store_data = store_data.join(" ");

    				// replaces old media data with new one after removing unnecessary more that one white space that comes together
    				match_data = match_data.replace(media_data, store_data);

    				// pushes the matched media query data into array 'media_arr'
    				media_arr.push(match_data);

    				// returns updated defined media queries data
    				return match_data;
    			});

    			// loops through number of defined media query in css editor
    			for (let j = 0; j < media_arr.length; j++) {
    				// checks for match the media data defined in testcase with media data exist in array 'media_arr' at index equals to the value of variable 'j'
    				let media_match = media_arr[j].indexOf(input_data[0].trim());

    				// enters in this block if media query matched with the data defined in array 'media_arr' at index equals to the value of variable 'j'
    				if (media_match > -1) {
    					// contains the css selector
    					let selector_match;

    					// goes inside this block if multiple selector defined in testcase
    					if (input_data[1].indexOf(",") > -1) {
    						// contains array of all selector that defined in testcase
    						let sub_input = input_data[1].split(",");

    						for (let i = 0; i < sub_input.length; i++) {
    							// contains index of css selector, defined in array 'sub_input' at index equlas to the value of variable 'i', in array 'media_arr' at index equals to the value of variable 'j'
    							selector_match = media_arr[j].indexOf(sub_input[i].trim());

    							// exist from loop if variable 'selector_match' contains value less than '0' means if any css selector does not exist in array 'media_arr' at index equals to the value of variable 'j' 
    							if (selector_match < 0) {
    								break;
    							}
    						}
    					} else {
    						// contains index of css selector in array 'media_arr' at index equals to the value of variable 'j' in case of single css selector defined
    						selector_match = media_arr[j].indexOf(input_data[1].trim());
    					}

    					// enters in this block if selector matches in media query's string defined in array 'media_arr' at index equals to the value of variable 'j'
    					if (selector_match > -1) {
    						// contains the index of property string defined in media query that exist in array 'media_arr' at index equals to the value of variable 'j'
    						let find_str = media_arr[j].indexOf(input_data[2].trim());

    						// identify that property matched or not, initially defined that it is not matched
    						let prop_match = false;

    						// enters in this block if property string exist in array 'media_arr' at index equals to the value of variable 'j'
    						if (find_str > -1) {
    							// instead of this only variable 'find_str' can be used as contains the same value
    							let find_str_index = media_arr[j].indexOf(input_data[2].trim());

    							// contains the character exist at index equals to the value of variable 'find_str_index' by reducing 1
    							let prop_data = media_arr[j].charAt(find_str_index - 1);

    							// enters in this block for indicate that property matched if property is not combined with any other word such as in case of 'color' property then it will ignore 'background-color' property
    							if (prop_data !== "-") {
    								prop_match = true;
    							}
    						}

    						// enters in this block if property matched in array 'media_arr' at index equals to the value of variable 'j'
    						if (prop_match) {
    							// increments value of variable 'counter' by 1
    							counter = counter + 1;
    						}
    					}
    				}
    			}

    			if (counter == outp) {
    				return true;
    			} else {
    				return false;
    			}
    		} else {
    			if (js_data.match(re)) {
    				if (js_data.match(re).length == outp) {
    					flag_check = 1;
    				} else if (js_data.match(re).length <= outp && js_data && js_data.match(re).length && max) {
    					flag_check = 1;
    				} else if (js_data.match(re).length >= outp && js_data && js_data.match(re).length && min) {
    					flag_check = 1;
    				} else {
    					flag_check = 0;
    				}
    			} else {
    				flag_check = 0;
    			}
    		}

    		if (flag_check) {
    			return true;
    		} else {
    			return false;
    		}
    	}

    	// used for check the result status of 'External Script' defined in 'Autograde' dialog box
    	function externalCheck(get_cases) {
    		try {
    			// contains RegExp pattern for match the string 'var flagONN'
    			let re = /var flagONN/gm;

    			// contains the value of js editor
    			let js_data = jsEditor.getValue().trim();

    			js_data = js_data.replace(/^.*?body.*?\\n/gm, "");

    			// removes all the text that exist in same line starting from 'document.write' string of js editor value 
    			js_data = js_data.replace(/document\.write.*/gm, "");

    			// contains the value after evaluate the script
    			let result;

    			if (!re.test(get_cases)) {
    				// contains the value return by the script defined in js editor and in 'External Script' field of 'Autograde' dialog box
    				result = eval(js_data + "\n" + get_cases);
    			} else {
    				// contains the value return by the script defined in 'External Script' field of 'Autograde
    				result = eval(get_cases);
    			}

    			// returns the value stored in variable 'result'
    			return result;
    		} catch(err) {
    			// shows log message in case of any error occurred
    			console.log({ msg: err, func: "externalCheck@1108" });

    			// returns false in case of any error occurred
    			return false;
    		}
    	}

    	// shows the output of the code in 'Result' editor
    	function runCode() {
    		// jQuery('html, body').animate({ scrollTop: jQuery('#result_div').offset().top }, 'slow'); // Replaced
    		window.scroll({ top: 500, behavior: "smooth" });

    		let date = new Date();
    		date = date.getTime();
    		let iframeId = "uC" + date;

    		//   jQuery('#result_div').html('<iframe class="result_frame w-100 border-0" style="height:347px" id="' + iframeId + '"></iframe>'); //Replaced
    		AH.select("#result_div").innerHTML = "<iframe class=\"result_frame w-100 border-0\" style=\"height:347px\" id=\"" + iframeId + "\"></iframe>";

    		// returns the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag and hides the 'Loading...' containing after load
    		let source = prepareSource();

    		let iframe = document.querySelector("#uC" + date);
    		iframe.onload = answerCheckWeb.bind(this, false);
    		let iframe_doc = iframe.contentDocument;
    		iframe_doc.open();
    		iframe_doc.write(source);
    		iframe_doc.close();
    	}

    	// used for set the value of html, css, js editors, makes editor readonly which was made disabled at the time of question creation, hide the editors which was made hidden at the time of questio creation and change the theme of html, css and js editors according to the check status of 'Dark Theme' checkbox
    	function parseXML(xml) {
    		console.log("checking");

    		// contains the xml 
    		xml = xml ? xml : state.xml;

    		// contains the html editor value from xml
    		let htmlData = stringBetween(xml, "tag");

    		// sets the value of html editor
    		htmlEditor.setValue(htmlData ? htmlData.trim() : "");

    		// contains the css editor value from xml
    		let cssData = stringBetween(xml, "css");

    		// sets the value of css editor
    		cssEditor.setValue(cssData ? cssData.trim() : "");

    		// contains the js editor value from xml
    		let jsData = stringBetween(xml, "js");

    		// sets the value of js editor
    		jsEditor.setValue(jsData ? jsData.trim() : "");

    		// contains the value of 'disable' attribute of web tag from xml
    		let disableData = findAttribute(xml, "disable", "web");

    		if ((/html/g).test(disableData)) {
    			// sets the value '0' of variable 'readHTML' to indicate that html editor is 'readonly' and no any operation can be performed on this editor
    			readHTML = 0;

    			// makes the html editor as 'readonly'
    			htmlEditor.setOption("readOnly", true);
    		}

    		if ((/js/g).test(disableData)) {
    			// sets the value '0' of variable 'readJS' to indicate that js editor is 'readonly' and no any operation can be performed on this editor
    			readJS = 0;

    			jsEditor.setOption("readOnly", true);
    		}

    		if ((/css/g).test(disableData)) {
    			// sets the value '0' of variable 'readCSS' to indicate that css editor is 'readonly' and no any operation can be performed on this editor
    			readCSS = 0;

    			cssEditor.setOption("readOnly", true);
    		}

    		// contains the value of 'hide' attribute of 'web' tag from xml
    		let hideData = findAttribute(xml, "hide", "web");

    		// updates the value of variable 'hideData' according to its value
    		hideData = hideData ? hideData : ",,";

    		// converts 'hideData' into array and 
    		hideData = hideData.split(",");

    		// used for hide the html, css or js editor according to the value of array 'hideData' defined at index '0', '1', '2'
    		hideEditors(parseInt(hideData[0]), parseInt(hideData[1]), parseInt(hideData[2]));

    		// changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
    		setTimeout(
    			function () {
    				changeTheme();
    			},
    			100
    		);
    	}

    	// used for hide the html, css or js editor according to the value of argument variable 'html', 'css', 'js'
    	function hideEditors(html = 1, css = 1, js = 1) {
    		// contains the value 1 or 0 that determines that html editor will be visible or not
    		showHTML = isNaN(html) ? 1 : html;

    		// contains the value 1 or 0 that determines that css editor will be visible or not
    		showCSS = isNaN(css) ? 1 : css;

    		// contains the value 1 or 0 that determine that js editor will be visible or not
    		showJS = isNaN(js) ? 1 : js;

    		// used for mobile team
    		if (window.inNative) {
    			if (!showHTML) {
    				//    jQuery("#html_panel, #html_pane, #css_panel").hide(); // Replaced
    				// document.getElementById('html_panel').style.display = 'none';
    				// document.getElementById('html_pane').style.display = 'none';
    				// document.getElementById('css_panel').style.display = 'none';
    				AH.selectAll("#html_panel,#html_pane,#css_panel", "hide");
    			}

    			if (!showCSS) {
    				//    jQuery("#css_panel,#css_pane,#js_panel").hide(); // Replaced
    				// document.getElementById('css_panel').style.display = 'none';
    				// document.getElementById('css_pane').style.display = 'none';
    				// document.getElementById('js_panel').style.display = 'none';
    				AH.selectAll("#css_panel,#css_pane,#js_panel", "hide");
    			}

    			if (!showJS) {
    				//    jQuery("#js_panel,#js_pane,#css_panel").hide(); // Replaced
    				// document.getElementById('js_panel').style.display = 'none';
    				// document.getElementById('js_pane').style.display = 'none';
    				// document.getElementById('css_panel').style.display = 'none';
    				AH.selectAll("#js_panel,#js_pane,#css_panel", "hide");
    			}

    			if (showHTML && showCSS && showJS) {
    				//    jQuery("#css_panel,#js_panel").hide(); // Replaced
    				// document.getElementById('css_panel').style.display = 'none';
    				// document.getElementById('js_panel').style.display = 'none';
    				AH.selectAll("#css_panel,#js_panel", "hide");
    			}

    			return;
    		}

    		if (!showHTML) {
    			// hides the html editor if the value of variable 'showHTML' is 0
    			//jQuery("#html_panel").hide(); // Replaced
    			//document.getElementById('html_panel').style.display = 'none';
    			AH.select("#html_panel", "hide");

    			Split(["#css_panel", "#js_panel"], { sizes: [50, 50] });
    		}

    		if (!showCSS) {
    			//  hides the css editor if the value of variable 'showCSS' is 0
    			//jQuery("#css_panel").hide(); // Replaced
    			//document.getElementById('css_panel').style.display = 'none';
    			AH.select("#css_panel", "hide");

    			Split(["#html_panel", "#js_panel"], { sizes: [50, 50] });
    		}

    		if (!showJS) {
    			//  hides the js editor if the value of variable 'showJS' is 0
    			//jQuery("#js_panel").hide(); // Replaced
    			//document.getElementById('js_panel').style.display = 'none';
    			AH.selectAll("#js_panel", "hide");

    			Split(["#css_panel", "#html_panel"], { sizes: [50, 50] });
    		}

    		if (!showCSS && !showJS) {
    			console.log("checking splitter");
    			AH.selectAll("#css_panel,#js_panel", "hide");
    			Split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
    			AH.select("#accordion", "css", { display: "flex" });
    			Split(["#html_panel"], { sizes: [100] });
    			AH.select("#firstEditorDiv", "removeAttr", "display");
    		}

    		if (!showCSS && !showHTML) {
    			AH.selectAll("#css_panel,#html_panel", "hide");
    			Split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
    			AH.select("#accordion", "css", { display: "flex" });
    			Split(["#js_panel"], { sizes: [100] });
    			AH.select("#firstEditorDiv", "removeAttr", "display");
    		}

    		if (!showHTML && !showJS) {
    			AH.select("#firstEditorDiv", "removeAttr", "display");
    			AH.selectAll("#js_panel,#html_panel", "hide");
    			Split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
    			AH.select("#accordion", "css", { display: "flex" });
    			Split(["#css_panel"], { sizes: [100] });
    			AH.select("#firstEditorDiv", "removeAttr", "display");
    		}
    	}

    	// used for update the user answer xml value
    	function saveWebAnswer(code, code_lang) {
    		// contains the user answer xml of question xml
    		let qxml = !(/smans/g).test(uaXML) && uaXML ? uaXML : xml;

    		// variable for hold the html, css and js editor value in xml format way
    		let uXml = "";

    		if (code_lang == "html") {
    			// replace the old code of html editor with new one
    			uXml = qxml.replace(/<tag>[\s\S]*?<\/tag>/g, "<tag>" + code + "</tag>");
    		} else if (code_lang == "css") {
    			// replace the old code of css editor with new one
    			uXml = qxml.replace(/<css>[\s\S]*?<\/css>/g, "<css>" + code + "</css>");
    		} else {
    			// replace the old code of js editor with new one
    			uXml = qxml.replace(/<js>[\s\S]*?<\/js>/g, "<js>" + code + "</js>");
    		}

    		// this block is used for mobile team
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		// defines that user answer xml is changed
    		ISSPECIALMODULEUSERXMLCHANGE = 1;

    		// save the user answer xml
    		//jQuery("#special_module_user_xml").val(uXml); // Replaced
    		AH.select("#special_module_user_xml").value = uXml;

    		// assign the user answer xml in variable 'userAnswers'
    		//let userAnswers = userAnswer = jQuery("#special_module_user_xml").val(); // Replaced
    		let userAnswers;

    		userAnswers = userAnswer = AH.select("#special_module_user_xml").value;

    		// used for mobile team
    		if (window.inNative) {
    			window.postMessage("height___" + document.getElementsByClassName("container-fluid")[0].offsetHeight, "*");
    			window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect: false }), "*");
    		}

    		// assign the user answer xml value in 'uaXML' variable of window object
    		$$invalidate(6, uaXML = uXml);

    		resultSaving = uXml;
    	}

    	const click_handler = () => {
    		setReview();
    	};

    	const click_handler_1 = () => {
    		unsetReview();
    	};

    	const click_handler_2 = () => $$invalidate(0, state.remediationToggle = false, state);

    	function dialog_visible_binding(value) {
    		state.remediationToggle = value;
    		$$invalidate(0, state);
    	}

    	const close_handler = () => $$invalidate(0, state.remediationToggle = false, state);

    	$$self.$$set = $$props => {
    		if ("inQuizPlayer" in $$props) $$invalidate(7, inQuizPlayer = $$props.inQuizPlayer);
    		if ("editorState" in $$props) $$invalidate(8, editorState = $$props.editorState);
    		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
    		if ("uaXML" in $$props) $$invalidate(6, uaXML = $$props.uaXML);
    		if ("isReview" in $$props) $$invalidate(9, isReview = $$props.isReview);
    	};

    	return [
    		state,
    		setReview,
    		unsetReview,
    		changeTheme,
    		runCode,
    		xml,
    		uaXML,
    		inQuizPlayer,
    		editorState,
    		isReview,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		dialog_visible_binding,
    		close_handler
    	];
    }

    class WebPreview extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1$1.getElementById("svelte-1553786-style")) add_css$6();

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				inQuizPlayer: 7,
    				editorState: 8,
    				xml: 5,
    				uaXML: 6,
    				isReview: 9
    			},
    			[-1, -1]
    		);
    	}
    }

    /* clsSMWeb\WebAuthoring.svelte generated by Svelte v3.29.0 */

    function create_default_slot$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Dark Theme");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let div53;
    	let div24;
    	let div23;
    	let div22;
    	let div5;
    	let div0;
    	let button0;
    	let t1;
    	let div1;
    	let button1;
    	let t3;
    	let div2;
    	let input0;
    	let t4;
    	let div3;
    	let span0;
    	let checkbox;
    	let t5;
    	let div4;
    	let button2;
    	let i;
    	let t6;
    	let t7_value = language.run + "";
    	let t7;
    	let t8;
    	let div21;
    	let div16;
    	let div15;
    	let div8;
    	let div6;
    	let span1;
    	let t10;
    	let div7;
    	let t11;
    	let div11;
    	let div9;
    	let span2;
    	let t13;
    	let div10;
    	let t14;
    	let div14;
    	let div12;
    	let span3;
    	let t16;
    	let div13;
    	let t17;
    	let div20;
    	let div19;
    	let div17;
    	let span4;
    	let t19;
    	let div18;
    	let t20;
    	let div43;
    	let div42;
    	let div41;
    	let div25;
    	let h40;
    	let label0;
    	let t22;
    	let input1;
    	let t23;
    	let button3;
    	let t25;
    	let div39;
    	let div38;
    	let div29;
    	let div26;
    	let h41;
    	let a0;
    	let t27;
    	let span5;
    	let t28;
    	let div28;
    	let div27;
    	let textarea3;
    	let t29;
    	let div33;
    	let div30;
    	let h42;
    	let a1;
    	let t31;
    	let span6;
    	let t32;
    	let div32;
    	let div31;
    	let textarea4;
    	let t33;
    	let div37;
    	let div34;
    	let h43;
    	let a2;
    	let t35;
    	let span7;
    	let t36;
    	let div36;
    	let div35;
    	let textarea5;
    	let t37;
    	let div40;
    	let t39;
    	let div52;
    	let div51;
    	let div50;
    	let div44;
    	let h44;
    	let t41;
    	let button5;
    	let t43;
    	let div49;
    	let div45;
    	let label1;
    	let t46;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let t50;
    	let div46;
    	let label2;
    	let t53;
    	let select1;
    	let option3;
    	let option4;
    	let option5;
    	let t57;
    	let div47;
    	let label3;
    	let t60;
    	let select2;
    	let option6;
    	let option7;
    	let option8;
    	let t64;
    	let div48;
    	let button6;
    	let t66;
    	let input2;
    	let current;
    	let mounted;
    	let dispose;

    	checkbox = new Checkbox({
    			props: {
    				checked: /*state*/ ctx[0].goDark,
    				id: "goDark",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			}
    		});

    	checkbox.$on("click", /*changeTheme*/ ctx[1]);

    	return {
    		c() {
    			div53 = element("div");
    			div24 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = `${language.autograde}`;
    			t1 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = `${language.disable}`;
    			t3 = space();
    			div2 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div3 = element("div");
    			span0 = element("span");
    			create_component(checkbox.$$.fragment);
    			t5 = space();
    			div4 = element("div");
    			button2 = element("button");
    			i = element("i");
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			div21 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			div8 = element("div");
    			div6 = element("div");
    			span1 = element("span");
    			span1.textContent = `${language.html}`;
    			t10 = space();
    			div7 = element("div");
    			div7.innerHTML = `<textarea name="html" id="html_editor"></textarea>`;
    			t11 = space();
    			div11 = element("div");
    			div9 = element("div");
    			span2 = element("span");
    			span2.textContent = `${language.css}`;
    			t13 = space();
    			div10 = element("div");
    			div10.innerHTML = `<textarea name="css" id="css_editor"></textarea>`;
    			t14 = space();
    			div14 = element("div");
    			div12 = element("div");
    			span3 = element("span");
    			span3.textContent = `${language.js}`;
    			t16 = space();
    			div13 = element("div");
    			div13.innerHTML = `<textarea name="js" id="js_editor"></textarea>`;
    			t17 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div17 = element("div");
    			span4 = element("span");
    			span4.textContent = `${language.result}`;
    			t19 = space();
    			div18 = element("div");
    			t20 = space();
    			div43 = element("div");
    			div42 = element("div");
    			div41 = element("div");
    			div25 = element("div");
    			h40 = element("h4");
    			label0 = element("label");
    			label0.textContent = `${language.autograde}`;
    			t22 = space();
    			input1 = element("input");
    			t23 = space();
    			button3 = element("button");
    			button3.textContent = "×";
    			t25 = space();
    			div39 = element("div");
    			div38 = element("div");
    			div29 = element("div");
    			div26 = element("div");
    			h41 = element("h4");
    			a0 = element("a");
    			a0.textContent = `${language.testcases}`;
    			t27 = space();
    			span5 = element("span");
    			t28 = space();
    			div28 = element("div");
    			div27 = element("div");
    			textarea3 = element("textarea");
    			t29 = space();
    			div33 = element("div");
    			div30 = element("div");
    			h42 = element("h4");
    			a1 = element("a");
    			a1.textContent = `${language.internalScript}`;
    			t31 = space();
    			span6 = element("span");
    			t32 = space();
    			div32 = element("div");
    			div31 = element("div");
    			textarea4 = element("textarea");
    			t33 = space();
    			div37 = element("div");
    			div34 = element("div");
    			h43 = element("h4");
    			a2 = element("a");
    			a2.textContent = `${language.externalScript}`;
    			t35 = space();
    			span7 = element("span");
    			t36 = space();
    			div36 = element("div");
    			div35 = element("div");
    			textarea5 = element("textarea");
    			t37 = space();
    			div40 = element("div");
    			div40.innerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" name="done_grading_btn" id="done_grading_btn">Done</button>`;
    			t39 = space();
    			div52 = element("div");
    			div51 = element("div");
    			div50 = element("div");
    			div44 = element("div");
    			h44 = element("h4");
    			h44.textContent = `${language.disable}`;
    			t41 = space();
    			button5 = element("button");
    			button5.textContent = "×";
    			t43 = space();
    			div49 = element("div");
    			div45 = element("div");
    			label1 = element("label");
    			label1.textContent = `${language.html}:`;
    			t46 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = `${language.editable}`;
    			option1 = element("option");
    			option1.textContent = `${language.hidden}`;
    			option2 = element("option");
    			option2.textContent = `${language.disabled}`;
    			t50 = space();
    			div46 = element("div");
    			label2 = element("label");
    			label2.textContent = `${language.css}:`;
    			t53 = space();
    			select1 = element("select");
    			option3 = element("option");
    			option3.textContent = `${language.editable}`;
    			option4 = element("option");
    			option4.textContent = `${language.hidden}`;
    			option5 = element("option");
    			option5.textContent = `${language.disabled}`;
    			t57 = space();
    			div47 = element("div");
    			label3 = element("label");
    			label3.textContent = `${language.js}:`;
    			t60 = space();
    			select2 = element("select");
    			option6 = element("option");
    			option6.textContent = `${language.editable}`;
    			option7 = element("option");
    			option7.textContent = `${language.hidden}`;
    			option8 = element("option");
    			option8.textContent = `${language.disabled}`;
    			t64 = space();
    			div48 = element("div");
    			button6 = element("button");
    			button6.textContent = `${language.done}`;
    			t66 = space();
    			input2 = element("input");
    			attr(button0, "type", "button");
    			attr(button0, "data-bs-toggle", "modal");
    			attr(button0, "data-bs-target", "#autograde_modal");
    			attr(button0, "class", "btn btn-primary mr-2");
    			attr(div0, "class", "inline-block pull-left");
    			attr(button1, "type", "button");
    			attr(button1, "data-bs-toggle", "modal");
    			attr(button1, "data-bs-target", "#disable_modal");
    			attr(button1, "class", "btn btn-primary mr-2");
    			attr(div1, "class", "inline-block pull-left");
    			attr(input0, "type", "text");
    			attr(input0, "id", "launch_caption");
    			attr(input0, "class", "form-control");
    			attr(input0, "placeholder", "Caption");
    			attr(div2, "class", "inline-block pull-left width150");
    			attr(span0, "class", "themeStyle form-check form-check-inline");
    			attr(div3, "class", "inline-block width150 relative bottom6 pull-left ml-lg");
    			attr(i, "class", "fa fa-code");
    			attr(button2, "type", "button");
    			attr(button2, "class", "btn btn-primary ml");
    			attr(div4, "class", "inline-block pull-right");
    			attr(div5, "id", "web_toolbar");
    			set_style(div5, "height", "50px");
    			attr(div5, "class", "bg-light w-100 p-2");
    			attr(div6, "class", "card-header rounded-0");
    			attr(div7, "id", "html");
    			attr(div7, "class", "card-body code_box content-div m-0 p-0");
    			set_style(div7, "height", "347px");
    			attr(div8, "id", "html_panel");
    			attr(div8, "class", "card m-0 p-0 rounded-0");
    			attr(div9, "class", "card-header rounded-0");
    			attr(div10, "id", "css");
    			attr(div10, "class", "card-body code_box content-div m-0 p-0");
    			set_style(div10, "height", "347px");
    			attr(div11, "id", "css_panel");
    			attr(div11, "class", "card m-0 p-0 rounded-0");
    			attr(div12, "class", "card-header rounded-0");
    			attr(div13, "id", "js");
    			attr(div13, "class", "card-body code_box content-div m-0 p-0");
    			set_style(div13, "height", "347px");
    			attr(div14, "id", "js_panel");
    			attr(div14, "class", "card m-0 p-0 rounded-0");
    			attr(div15, "id", "firstEditorDiv");
    			set_style(div15, "display", "flex");
    			attr(div16, "id", "top_content");
    			attr(div17, "class", "card-header rounded-0");
    			attr(div18, "id", "result_div");
    			set_style(div18, "min-height", "351px");
    			attr(div18, "class", "card-body content-div m-0 p-0 rounded-0");
    			attr(div19, "class", "card rounded-0 nm");
    			attr(div20, "id", "bottom_content");
    			attr(div21, "id", "wrap");
    			set_style(div21, "width", "100%");
    			set_style(div21, "background", "white");
    			set_style(div21, "padding", "0px");
    			attr(div22, "class", "row");
    			attr(div23, "class", "container-fluid");
    			attr(label0, "for", "autograde_cb");
    			attr(label0, "class", "form-check-label pr-2");
    			attr(input1, "type", "checkbox");
    			attr(input1, "name", "autograde_cb");
    			attr(input1, "id", "autograde_cb");
    			attr(input1, "class", "form-check-input");
    			attr(h40, "class", "modal-title form-check form-check-inline");
    			attr(button3, "type", "button");
    			attr(button3, "class", "close");
    			attr(button3, "data-bs-dismiss", "modal");
    			attr(button3, "aria-hidden", "true");
    			attr(button3, "id", "close_dialog_btn");
    			attr(button3, "auto:focus", "autofocus");
    			attr(div25, "class", "modal-header");
    			attr(a0, "class", "text-dark");
    			attr(a0, "data-bs-toggle", "collapse");
    			attr(a0, "data-bs-parent", "#grade_accordion");
    			attr(a0, "href", "#test_case_collapse");
    			attr(span5, "class", "icomoon-help float-right s4");
    			attr(span5, "data-bs-toggle", "tooltip");
    			attr(span5, "title", "custom function name|input1,input2,..inputN|Output");
    			attr(span5, "data-bs-placement", "left");
    			attr(h41, "class", "panel-title");
    			attr(div26, "class", "card-header");
    			attr(div26, "data-bs-toggle", "collapse");
    			attr(div26, "data-bs-target", "#test_case_collapse");
    			attr(textarea3, "id", "test_case_text");
    			attr(textarea3, "class", "form-control");
    			set_style(textarea3, "maxHeight", "150px");
    			set_style(textarea3, "minHeight", "80px");
    			attr(textarea3, "placeholder", "custom function name|input1,input2,..inputN|Output");
    			textarea3.disabled = "disabled";
    			attr(div27, "class", "card-body p-md");
    			attr(div28, "id", "test_case_collapse");
    			attr(div28, "class", "collapse in");
    			attr(div29, "class", "card mb-2");
    			attr(a1, "class", "text-dark");
    			attr(a1, "data-bs-toggle", "collapse");
    			attr(a1, "data-bs-parent", "#grade_accordion");
    			attr(a1, "href", "#internal_script_collapse");
    			attr(span6, "class", "icomoon-help float-right s4");
    			attr(span6, "data-bs-toggle", "tooltip");
    			attr(span6, "title", "1. attr_match?HTML?tag name{1}?occurance.(for tag match)  2. attr_match?HTML?tag name");
    			attr(span6, "data-bs-placement", "left");
    			attr(h42, "class", "panel-title");
    			attr(div30, "class", "card-header");
    			attr(div30, "data-bs-toggle", "collapse");
    			attr(div30, "data-bs-target", "#internal_script_collapse");
    			attr(textarea4, "id", "occurence_text");
    			attr(textarea4, "class", "form-control");
    			set_style(textarea4, "max-height", "150px");
    			set_style(textarea4, "min-height", "80px");
    			attr(textarea4, "placeholder", "function as suggested in help block?Lang?keyword?occurance");
    			textarea4.disabled = "disabled";
    			attr(div31, "class", "card-body p-md");
    			attr(div32, "id", "internal_script_collapse");
    			attr(div32, "class", "panel-collapse collapse");
    			attr(div33, "class", "card mb-2");
    			attr(a2, "class", "text-dark");
    			attr(a2, "data-bs-toggle", "collapse");
    			attr(a2, "data-bs-parent", "#grade_accordion");
    			attr(a2, "href", "#external_script_collapse");
    			attr(span7, "class", "icomoon-help float-right s4");
    			attr(span7, "data-bs-toggle", "tooltip");
    			attr(span7, "title", "Write your own script");
    			attr(span7, "data-bs-placement", "left");
    			attr(h43, "class", "panel-title");
    			attr(div34, "class", "card-header");
    			attr(div34, "data-bs-toggle", "collapse");
    			attr(div34, "data-bs-target", "#external_script_collapse");
    			attr(textarea5, "id", "exscript_text");
    			attr(textarea5, "class", "form-control");
    			set_style(textarea5, "max-height", "150px");
    			set_style(textarea5, "min-height", "80px");
    			attr(textarea5, "placeholder", "Write your own script");
    			textarea5.disabled = "disabled";
    			textarea5.value = "\r\n                                    ";
    			attr(div35, "class", "card-body p-md");
    			attr(div36, "id", "external_script_collapse");
    			attr(div36, "class", "panel-collapse collapse");
    			attr(div37, "class", "card mb-2");
    			attr(div38, "class", "panel-group");
    			attr(div38, "id", "grade_accordion");
    			attr(div39, "class", "modal-body overflow-auto");
    			attr(div40, "class", "modal-footer");
    			attr(div41, "class", "modal-content");
    			attr(div42, "class", "modal-dialog modal-lg modal-dialog-centered");
    			attr(div43, "id", "autograde_modal");
    			attr(div43, "class", "modal fade");
    			attr(div43, "role", "dialog");
    			attr(h44, "class", "modal-title");
    			attr(button5, "type", "button");
    			attr(button5, "class", "close");
    			attr(button5, "data-bs-dismiss", "modal");
    			attr(button5, "aria-hidden", "true");
    			attr(div44, "class", "modal-header");
    			attr(label1, "for", "html_disable");
    			option0.__value = "";
    			option0.value = option0.__value;
    			option1.__value = "0";
    			option1.value = option1.__value;
    			option2.__value = "1";
    			option2.value = option2.__value;
    			attr(select0, "class", "form-control");
    			attr(select0, "id", "html_disable");
    			attr(select0, "auto:focus", "autofocus");
    			attr(div45, "class", "form-group");
    			attr(label2, "for", "css_disable");
    			option3.__value = "";
    			option3.value = option3.__value;
    			option4.__value = "0";
    			option4.value = option4.__value;
    			option5.__value = "1";
    			option5.value = option5.__value;
    			attr(select1, "class", "form-control");
    			attr(select1, "id", "css_disable");
    			attr(div46, "class", "form-group");
    			attr(label3, "for", "js_disable");
    			option6.__value = "";
    			option6.value = option6.__value;
    			option7.__value = "0";
    			option7.value = option7.__value;
    			option8.__value = "1";
    			option8.value = option8.__value;
    			attr(select2, "class", "form-control");
    			attr(select2, "id", "js_disable");
    			attr(div47, "class", "form-group");
    			attr(button6, "type", "button");
    			attr(button6, "class", "btn btn-primary");
    			attr(button6, "data-bs-dismiss", "modal");
    			attr(div48, "class", "float-right");
    			attr(div49, "class", "modal-body");
    			attr(div50, "class", "modal-content");
    			attr(div51, "class", "modal-dialog modal-sm modal-dialog-centered");
    			attr(div52, "id", "disable_modal");
    			attr(div52, "class", "modal fade");
    			attr(div52, "role", "dialog");
    			attr(input2, "type", "hidden");
    			attr(input2, "id", "ansModeAnswer");
    			input2.value = "";
    			attr(div53, "id", "authoringArea");
    			set_style(div53, "line-height", "20px");
    			set_style(div53, "font-size", "14px");
    		},
    		m(target, anchor) {
    			insert(target, div53, anchor);
    			append(div53, div24);
    			append(div24, div23);
    			append(div23, div22);
    			append(div22, div5);
    			append(div5, div0);
    			append(div0, button0);
    			append(div5, t1);
    			append(div5, div1);
    			append(div1, button1);
    			append(div5, t3);
    			append(div5, div2);
    			append(div2, input0);
    			append(div5, t4);
    			append(div5, div3);
    			append(div3, span0);
    			mount_component(checkbox, span0, null);
    			append(div5, t5);
    			append(div5, div4);
    			append(div4, button2);
    			append(button2, i);
    			append(button2, t6);
    			append(button2, t7);
    			append(div22, t8);
    			append(div22, div21);
    			append(div21, div16);
    			append(div16, div15);
    			append(div15, div8);
    			append(div8, div6);
    			append(div6, span1);
    			append(div8, t10);
    			append(div8, div7);
    			append(div15, t11);
    			append(div15, div11);
    			append(div11, div9);
    			append(div9, span2);
    			append(div11, t13);
    			append(div11, div10);
    			append(div15, t14);
    			append(div15, div14);
    			append(div14, div12);
    			append(div12, span3);
    			append(div14, t16);
    			append(div14, div13);
    			append(div21, t17);
    			append(div21, div20);
    			append(div20, div19);
    			append(div19, div17);
    			append(div17, span4);
    			append(div19, t19);
    			append(div19, div18);
    			append(div53, t20);
    			append(div53, div43);
    			append(div43, div42);
    			append(div42, div41);
    			append(div41, div25);
    			append(div25, h40);
    			append(h40, label0);
    			append(h40, t22);
    			append(h40, input1);
    			append(div25, t23);
    			append(div25, button3);
    			append(div41, t25);
    			append(div41, div39);
    			append(div39, div38);
    			append(div38, div29);
    			append(div29, div26);
    			append(div26, h41);
    			append(h41, a0);
    			append(h41, t27);
    			append(h41, span5);
    			append(div29, t28);
    			append(div29, div28);
    			append(div28, div27);
    			append(div27, textarea3);
    			append(div38, t29);
    			append(div38, div33);
    			append(div33, div30);
    			append(div30, h42);
    			append(h42, a1);
    			append(h42, t31);
    			append(h42, span6);
    			append(div33, t32);
    			append(div33, div32);
    			append(div32, div31);
    			append(div31, textarea4);
    			append(div38, t33);
    			append(div38, div37);
    			append(div37, div34);
    			append(div34, h43);
    			append(h43, a2);
    			append(h43, t35);
    			append(h43, span7);
    			append(div37, t36);
    			append(div37, div36);
    			append(div36, div35);
    			append(div35, textarea5);
    			append(div41, t37);
    			append(div41, div40);
    			append(div53, t39);
    			append(div53, div52);
    			append(div52, div51);
    			append(div51, div50);
    			append(div50, div44);
    			append(div44, h44);
    			append(div44, t41);
    			append(div44, button5);
    			append(div50, t43);
    			append(div50, div49);
    			append(div49, div45);
    			append(div45, label1);
    			append(div45, t46);
    			append(div45, select0);
    			append(select0, option0);
    			append(select0, option1);
    			append(select0, option2);
    			append(div49, t50);
    			append(div49, div46);
    			append(div46, label2);
    			append(div46, t53);
    			append(div46, select1);
    			append(select1, option3);
    			append(select1, option4);
    			append(select1, option5);
    			append(div49, t57);
    			append(div49, div47);
    			append(div47, label3);
    			append(div47, t60);
    			append(div47, select2);
    			append(select2, option6);
    			append(select2, option7);
    			append(select2, option8);
    			append(div49, t64);
    			append(div49, div48);
    			append(div48, button6);
    			append(div53, t66);
    			append(div53, input2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(input0, "keyup", /*generateXml*/ ctx[2]),
    					listen(button2, "click", /*runCode*/ ctx[3]),
    					listen(input1, "click", /*enableAutograde*/ ctx[4]),
    					listen(textarea3, "keyup", /*generateXml*/ ctx[2]),
    					listen(textarea4, "keyup", /*generateXml*/ ctx[2]),
    					listen(textarea5, "keyup", /*generateXml*/ ctx[2]),
    					listen(select0, "blur", /*generateXml*/ ctx[2]),
    					listen(select1, "blur", /*generateXml*/ ctx[2]),
    					listen(select2, "blur", /*generateXml*/ ctx[2])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			const checkbox_changes = {};
    			if (dirty & /*state*/ 1) checkbox_changes.checked = /*state*/ ctx[0].goDark;

    			if (dirty & /*$$scope*/ 536870912) {
    				checkbox_changes.$$scope = { dirty, ctx };
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div53);
    			destroy_component(checkbox);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // used for set the value of attribute 'disable' and 'hide' of web tag in xml
    function handleDisable() {
    	let html = parseInt(document.querySelector("#html_disable").value);
    	let css = parseInt(document.querySelector("#css_disable").value);
    	let js = parseInt(document.querySelector("#js_disable").value);
    	let disableStr = (html ? "html " : "") + (css ? "css " : "") + (js ? "js" : "");
    	disableStr = disableStr.trim();

    	disableStr = disableStr
    	? "disable=\"" + disableStr.split(" ").join() + "\""
    	: "";

    	let hiddenStr = (html == 0 ? "0 " : "1 ") + (css == 0 ? "0 " : "1 ") + (js == 0 ? "0 " : "1 ");
    	hiddenStr = hiddenStr.trim();

    	hiddenStr = hiddenStr
    	? "hide=\"" + hiddenStr.split(" ").join() + "\""
    	: "";

    	let finalStr = disableStr + " " + hiddenStr;
    	return finalStr;
    }

    // used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    function splitter() {
    	// in case when js editor is visible and either html or css or both editor visible
    	{
    		// it is used to styled the splitter bar that exists on the left edge of the js editor
    		// let splitter1 = jQuery('#top_content').height(394).split({
    		//     // Add a vertical splitter bar
    		//     orientation: 'vertical',
    		//     // Specify how many pixels where you can't move the splitter bar on the edge
    		//     limit: 160,
    		//     // Set the position of the splitter bar
    		//     position: '68%'
    		// });
    		let splitter1 = Split(["#top_content"], { sizes: [50], direction: "vertical" });
    	}

    	// in case when html and css both editor is visible
    	{
    		// it is used to styled the splitter bar that exists on the left edge of the css editor
    		// let splitter2 = jQuery('#firstEditorDiv').height(394).split({
    		//     // Add a vertical splitter bar
    		//     orientation: 'vertical',
    		//     // Specify how many pixels where you can't move the splitter bar on the edge
    		//     limit: 80,
    		//     // Set the position of the splitter bar
    		//     position: '50%'
    		// });
    		let splitter2 = Split(["#firstEditorDiv"], { sizes: [100], direction: "vertical" }); //direction: "vertical",

    		Split(["#html_panel", "#css_panel", "#js_panel"], { sizes: [50, 50, 50] });
    	}
    }

    function stringBetween$1(data, str_1, str_2) {
    	// contains RegExp pattern for match in string
    	let regEx;

    	if (str_2) {
    		// creates the pattern if opening and closing both tag provided at the time of function calling
    		regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
    	} else {
    		// creates the pattern if opening and closing both tag not provided at the time of function calling
    		regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
    	}

    	// contains the text according to the match data in xml string
    	let matchedStr = regEx.exec(data);

    	if (matchedStr) {
    		// returns the text between given opening and closing tag if it exist
    		return matchedStr[1];
    	} else {
    		// returns the null if text not found between given opening and closing tag
    		return null;
    	}
    }

    // returns the value of attribute defined in second argument from tag defined in 3rd argument in xml string defined in argument 1
    function findAttribute$1(XML, attr, tag = "") {
    	// creates new RegExp object for match the value of attribute of any tag
    	let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w.*?)\".*?>", "gm");

    	// contains the matched text in 'XML' string if it matched otherwise null value holds
    	let matchedStr = regEx.exec(XML);

    	if (matchedStr) {
    		// returns the value of attribute defined in argument variable 'attr' of tag defined in argument variable 'tag' of XML
    		return matchedStr[1];
    	} else {
    		// returns null if no matched data found
    		return null;
    	}
    }

    // used for contain the actual text value from formatted xml text
    function getCase(str) {
    	// replaces the string '</case><case>' with semicolon (;) and '</case>','<case>' or '\n' with blank value
    	str = str.replace(/\n/gm, "").replace(/<\/case><case>/gm, ";").replace(/<\/case>|<case>/g, "");

    	// returns the formatted string
    	return str;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { xml } = $$props;
    	let { getChildXml } = $$props;
    	let { toggleMode } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let defaultStartXml = "<smxml type=\"22\" addhtml=\"0\" name=\"Web\">";
    	let isCaption = "";
    	let isAutograde = "";
    	let themeUrl = window.baseThemeURL || window.baseUrlTheme;
    	let mode = document.querySelector(".switch-input.switch-input");
    	let htmlEditor;
    	let cssEditor;
    	let jsEditor;
    	let state = {};

    	let stateData = writable({
    		xml: "",
    		uxml: "",
    		module: "",
    		toggle: false,
    		snackback: false,
    		lang_type: "php",
    		xmlArr: [],
    		remediationToggle: false,
    		// used for check or uncheck the 'Dark Theme' checkbox
    		goDark: window.sessionStorage.goDark && window.sessionStorage.goDark == "true"
    		? true
    		: false
    	});

    	let unsubscribe = stateData.subscribe(items => {
    		$$invalidate(0, state = items);
    	});

    	function changeTheme() {
    		console.log("chacking theme");
    		let check = document.querySelector("#goDark").checked;
    		$$invalidate(0, state.goDark = check, state);

    		stateData.update(item => {
    			item.goDark = check;
    			return item;
    		});

    		window.sessionStorage.goDark = check;

    		if (check) {
    			htmlEditor && htmlEditor.setOption("theme", "monokai");
    			cssEditor && cssEditor.setOption("theme", "monokai");
    			jsEditor && jsEditor.setOption("theme", "monokai");
    		} else {
    			htmlEditor && htmlEditor.setOption("theme", "default");
    			cssEditor && cssEditor.setOption("theme", "default");
    			jsEditor && jsEditor.setOption("theme", "default");
    		}
    	}

    	// used for update the xml and returns updated xml
    	function generateXml(isFormatted) {
    		// used for contain the updated xml
    		let aXml = "";

    		// contains the value of caption field
    		if (document.querySelector("#launch_caption") != null) isCaption = AH.select("#launch_caption").value;

    		if (isCaption) {
    			// sets the caption field value in 'launch_caption' attribute of 'smxml' tag
    			defaultStartXml = `<smxml type="22" addhtml="0" name="Web" launch_caption="${isCaption}">`;
    		}

    		// contains the all editors value, all answer matching cases defined in Autograde dialog box and status of the editors as hidden, disabled or Editable 
    		aXml = defaultStartXml + testCasesXml() + `\n<web libs="" files=",," ${handleDisable()}>\n<![CDATA[\n${getCode()}\n]]>\n</web>\n</SMXML>`;

    		// this block will not execute as argument is not passed from any where at the time of function calling 
    		if (isFormatted === true) {
    			return aXml;
    		}

    		// updates the xml
    		getChildXml(aXml);

    		// returns the updated xml
    		return aXml;
    	}

    	// used for show the output of written code
    	function runCode() {
    		//jQuery('html, body').animate({ scrollTop: jQuery('#result_div').offset().top }, 'slow'); // replaced
    		window.scroll({ top: 500, behavior: "smooth" });

    		// creates the date object
    		let date = new Date();

    		// gets the time in milliseconds
    		date = date.getTime();

    		// sets the iframe inside the result field 
    		//   jQuery('#result_div').html('<iframe class="result_frame w-100 border-0" style="height:344px" id="uC' + date + '"></iframe>');
    		AH.selectAll("#result_div", "html", "<iframe class=\"result_frame w-100 border-0\" style=\"height:344px\" id=\"uC" + date + "\"></iframe>");

    		// contains the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag
    		let source = prepareSource();

    		// selects the iframe element
    		let iframe = AH.select("#uC" + date);

    		//  returns the Document object generated by a frame or iframe element. Allow to access the Document object that belongs to a frame or iframe element
    		let iframe_doc = iframe.contentDocument;

    		// opens a new browser window, or a new tab, depending on browser settings and the parameter values
    		iframe_doc.open();

    		// writes the combiled html, css and js data in iframe after wrapping css data in style tag and js data in script tag
    		iframe_doc.write(source);

    		// closes the current window
    		iframe_doc.close();
    	}

    	function enableAutograde(e) {
    		if (e.target.checked) {
    			isAutograde = "active=\"1\"";

    			AH.selectAll("#test_case_text, #occurence_text, #exscript_text").forEach(_elm => {
    				_elm.disabled = false;
    			});
    		} else {
    			isAutograde = "";

    			AH.selectAll("#test_case_text, #occurence_text, #exscript_text").forEach(_elm => {
    				_elm.disabled = true;
    			});
    		}

    		// used for update the xml and returns updated xml
    		generateXml();
    	}

    	beforeUpdate(() => {
    		// if(!is_visible) {
    		//     createLink('pe-items/svelte/clsSMWeb/libs/codemirror.min.css');
    		//     createLink('pe-items/svelte/clsSMWeb/libs/monokai.css');
    		//     createLink('pe-items/svelte/clsSMWeb/libs/simplescrollbars.css');
    		//     createLink('pe-items/svelte/clsSMWeb/libs/webitem.min.css');
    		//     is_visible = 1;
    		// }
    		// contains the xml
    		$$invalidate(5, xml = xml ? xml : state.xml);
    	});

    	// afterUpdate(()=>{
    	//     document.querySelectorAll('.CodeMirror').forEach(function(el,i){ el.CodeMirror.refresh(); });
    	// })
    	// called once throught the program execution just after render method
    	onMount(() => {
    		AH.enableBsAll("[data-bs-toggle='tooltip']", "Tooltip", { container: "body" });

    		AH.bind(".modal", "show.bs.modal", () => {
    			setTimeout(
    				function () {
    					if (AH.select("#disable_modal", "visible").length > 0) {
    						AH.select("#html_disable").focus();
    					} else {
    						AH.select("#close_dialog_btn").focus();
    					}
    				},
    				500
    			);
    		});

    		AH.listen(document, "keydown", "body", (_this, event) => {
    			if (event.ctrlkey && event.altkey && (event.which == 85 || event.keyCode == 85)) {
    				if (AH.select("#disable_modal", "visible").length > 0) {
    					AH.selectAll("#html_disable").focus();
    				} else {
    					AH.selectAll("#close_dialog_btn").focus();
    				}
    			}
    		});

    		AH.listen(document, "click", "#grade_accordion .card", (_this, event) => {
    			let card_len = document.getElementsByClassName("card");

    			for (let i = 0; i < card_len.length; i++) {
    				AH.select(card_len[i], "css", { border: "none" });
    			}

    			AH.select(_this, "css", { border: "1px solid #000" });
    		});

    		// for remove the border from card element if focus is on checkbox, close button and on textarea
    		// jQuery(document).on('focus', '#autograde_cb, #close_dialog_btn, #done_grading_btn', function () {
    		//     jQuery('.card').css('border', 'none');
    		// });  // Replaced
    		AH.listen(document, "click", "#autograde_cb, #close_dialog_btn, #done_grading_btn", () => {
    			let card_len = document.getElementsByClassName("card");

    			for (let i = 0; i < card_len.length; i++) {
    				AH.select(card_len[i], "css", { border: "none" });
    			}
    		});

    		// used for show the tooltip
    		//AH.enableBsAll("[data-toggle='tooltip']", 'Tooltip');
    		AH.select("#preview", "hide");

    		// setTimeout(function () {
    		if (typeof CodeMirror == "function") {
    			// initialize the html, css and js editor if the type of 'CodeMirror' is function
    			renderCodeMirror();

    			parseXML();
    		} else {
    			//jQuery(function () {
    			AI.ajax({
    				type: "GET",
    				url: themeUrl + "src/libs/codemirror.js",
    				dataType: "script"
    			}).then(function (data) {
    				//  AI.activate(0);
    				let sc = document.createElement("script");

    				// sets the data received from 'codemirror.js' file inside the script tag
    				sc.innerHTML = data;

    				// appends this created script tag in body element of the document
    				document.body.appendChild(sc);

    				// initialize the html, css and js editor
    				renderCodeMirror(); //Fixed with codemirror

    				parseXML();
    			});
    		} //   })

    		AI.ajax({
    			type: "GET",
    			url: themeUrl + "src/libs/split.js",
    			async: true,
    			dataType: "script"
    		}).then(data => {
    			AH.activate(0);

    			if (document.querySelector("#splitterWeb")) {
    				// sets the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    				splitter();

    				// returns from the function to prevent from re-appened the code if it was already defined
    				return true;
    			}

    			// creates script element
    			let sc = document.createElement("script");

    			// defines the 'id' of the created script tag
    			sc.id = "splitterWeb";

    			// sets the data received from 'splitter.js' file inside the script tag
    			sc.innerHTML = data;

    			// appends this created script tag in body element of the document
    			document.body.appendChild(sc);

    			// sets the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    			splitter();
    		});

    		// }, 200);
    		// setTimeout(()=> {
    		// for manage the extra white space between last editor splitter
    		// jQuery('#authoringDiv').css({ 'width': '99%', 'margin-left': '7px' }); // Replace
    		AH.select("#authoringDiv", "css", { marginLeft: "7px", width: "99%" });
    	}); // }, 1300);

    	// used to create the xml of autograding conditions defined in 'Autograde' dialog box
    	function testCasesXml() {
    		if (!isAutograde) {
    			// returns blank value if value of variable 'isAutograde' is blank 
    			return "";
    		}

    		// contains the value of 'Testcases' field of 'Autograde' modal box
    		let test_cases = document.querySelector("#test_case_text").value;

    		// contains the value of 'Internal Script' field of 'Autograde' modal box
    		let internal_cases = document.querySelector("#occurence_text").value;

    		// contains the value of 'External Script' field of 'Autograde' modal box
    		let external_case = document.querySelector("#exscript_text").value;

    		// defines that the value of 'Testcases' field of 'Autograde' modal box is blank
    		let flag_test = 0;

    		// defines that the value of 'Internal Script' field of 'Autograde' modal box is blank
    		let flag_internal = 0;

    		// defines that the value of 'External Script' field of 'Autograde' modal box is blank
    		let flag_external = 0;

    		if (test_cases) {
    			// defines that the value of 'External Script' field of 'Autograde' modal box is not blank
    			flag_test = 1;

    			// wraps the each defined conditions value of 'Testcases' field separated by semicolon (;) of 'Autograde' modal box in 'case' tag
    			test_cases = "<case>" + test_cases.split(";").join("</case><case>") + "</case>";

    			test_cases = "\n<autograde type=\"testcase\">" + test_cases + "</autograde>";
    		}

    		if (internal_cases) {
    			flag_internal = 1;
    			internal_cases = "<case>" + internal_cases.split(";").join("</case><case>") + "</case>";
    			internal_cases = "\n<autograde type=\"internal\">" + internal_cases + "</autograde>";
    		}

    		if (external_case) {
    			// defines that the value of 'External Script' field of 'Autograde' modal box is not blank
    			flag_external = 1;

    			external_case = "\n<autograde type=\"custom\">" + external_case + "</autograde>";
    		}

    		let testStr = "<webautograde active=\"1\" testcase=\"" + flag_test + "\" internal=\"" + flag_internal + "\" custom=\"" + flag_external + "\">" + test_cases + internal_cases + external_case + "\n</webautograde>";

    		// returns the value of variable 'testStr'
    		return testStr;
    	}

    	function newSource() {
    		let htmlData = htmlEditor.getValue();
    		let video_and_audio_data = ["mp4", "ogg", "webm", "mp3", "wav"];
    		let img_data = ["gif", "tif", "png", "jpg"];

    		htmlData = htmlData.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function (fullMatch, src) {
    			if (src) {
    				for (let i = 0; i < video_and_audio_data.length; i++) {
    					if (src.indexOf(video_and_audio_data[i]) > -1) {
    						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_stream/" + src);
    					}
    				}

    				for (let i = 0; i < img_data.length; i++) {
    					if (src.indexOf(img_data[i]) > -1) {
    						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_static/" + src);
    					}
    				}
    			}
    		});

    		return htmlData;
    	}

    	function getCode() {
    		try {
    			let htmlData = htmlEditor.getValue();
    			let cssData = cssEditor.getValue();
    			let jsData = jsEditor.getValue();
    			let fullData = "<tag>" + htmlData + "</tag>\n<css>" + cssData + "</css>\n<js>" + jsData + "</js>";

    			// returns the string stored in variable 'fullData'
    			return fullData;
    		} catch(e) {
    			// returns blank value when any error occurred
    			return "";
    		}
    	}

    	function prepareSource() {
    		try {
    			let htmlData = htmlEditor.getValue();
    			let cssData = cssEditor.getValue();
    			let jsData = jsEditor.getValue();
    			htmlData = newSource();
    			cssData = cssData.replace(/url\(['"](.*?)['"]\)/g, "url('https://s3.amazonaws.com/jigyaasa_content_static/$1')");
    			jsData = jsData.replace(/src.*?["'](.*?)["']/gi, "src = 'https://s3.amazonaws.com/jigyaasa_content_static/$1'");

    			/// Need to fix
    			let fullData = htmlData + "<style>" + cssData + "</style><script>" + jsData + "</script>";

    			// returns the data after combining html, css and js data
    			return fullData;
    		} catch(e) {
    			return "";
    		}
    	}

    	function renderCodeMirror() {
    		if (AI.get("renderCodeMirror")) {
    			return true;
    		}

    		cssEditor = CodeMirror.fromTextArea(document.getElementById("css_editor"), {
    			lineNumbers: true,
    			mode: "css",
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			lineWrapping: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		// initialize the html editor
    		htmlEditor = CodeMirror.fromTextArea(document.getElementById("html_editor"), {
    			lineNumbers: true,
    			mode: "text/html",
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			lineWrapping: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		// initialize the js editor
    		jsEditor = CodeMirror.fromTextArea(document.getElementById("js_editor"), {
    			lineNumbers: true,
    			mode: "text/javascript",
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			lineWrapping: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		if (typeof htmlEditor == "object" && !isReview) {
    			htmlEditor.on("change", function () {
    				generateXml();
    			});
    		}

    		if (typeof cssEditor == "object" && !isReview) {
    			cssEditor.on("change", function () {
    				generateXml();
    			});
    		} // AI.listen(cssEditor,'change',function(){
    		//     generateXml();

    		// })
    		if (typeof jsEditor == "object" && !isReview) {
    			jsEditor.on("change", function () {
    				generateXml();
    			});
    		} // AI.listen(cssEditor,'change',function(){
    		//     generateXml();

    		// })
    		htmlEditor.setOption("extraKeys", {
    			// Changing Tabs into 4 spaces  
    			Tab(cm) {
    				let spaces = Array(cm.getOption("indentUnit") + 3).join(" ");
    				cm.replaceSelection(spaces);
    			},
    			F11(cm) {
    				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    			},
    			Esc(cm) {
    				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    			}
    		});

    		// calls for set the editors value if it was defined 
    		parseXML();

    		// defines that editor is initialized
    		AI.set("renderCodeMirror", true);
    	}

    	function parseXML() {
    		let htmlData = stringBetween$1(xml, "tag");
    		if (htmlData != null) htmlEditor.setValue(htmlData ? htmlData.trim() : "");
    		let cssData = stringBetween$1(xml, "css");
    		if (cssData != null) cssEditor.setValue(cssData ? cssData.trim() : "");
    		let jsData = stringBetween$1(xml, "js");
    		if (jsData != null) jsEditor.setValue(jsData ? jsData.trim() : "");
    		let disableData = findAttribute$1(xml, "disable", "web");
    		let html_disable = document.querySelector("#html_disable");
    		let css_disable = document.querySelector("#css_disable");
    		let js_disable = document.querySelector("#js_disable");

    		if ((/html/g).test(disableData)) {
    			html_disable.value = 1;
    		}

    		if ((/js/g).test(disableData)) {
    			js_disable.value = 1;
    		}

    		if ((/css/g).test(disableData)) {
    			// sets value '1' of 'CSS' field to show 'Disabled' option seleced of CSS field in 'Disable/Hide' dialog box
    			css_disable.value = 1;
    		}

    		// contains the caption field value
    		let caption = findAttribute$1(xml, "launch_caption", "smxml");

    		// sets the caption field value
    		AH.select("#launch_caption", "value", caption);

    		// contains the 'hide' attribute value of 'web' tag of xml
    		let hideData = findAttribute$1(xml, "hide", "web");

    		// if hide attribute value exist then it contains that value otherwise contains value ",,"
    		hideData = hideData ? hideData : ",,";

    		// creates and array containing the value of variable 'hideData' by spliting it comma (,)
    		hideData = hideData.split(",");

    		if (parseInt(hideData[0]) == 0) {
    			// sets value '0' of 'HTML' field to show 'Hidden' option seleced of CSS field in 'Disable/Hide' dialog box
    			html_disable.value = 0;
    		}

    		if (parseInt(hideData[1]) == 0) {
    			// sets value '0' of 'CSS' field to show 'Hidden' option seleced of CSS field in 'Disable/Hide' dialog box
    			css_disable.value = 0;
    		}

    		if (parseInt(hideData[2]) == 0) {
    			// sets value '0' of 'JS' field to show 'Hidden' option seleced of JS field in 'Disable/Hide' dialog box
    			js_disable.value = 0;
    		}

    		let test_cases = stringBetween$1(xml, "<autograde type=\"testcase\">", "</autograde>");
    		let internal_cases = stringBetween$1(xml, "<autograde type=\"internal\">", "</autograde>");
    		let external_cases = stringBetween$1(xml, "<autograde type=\"custom\">", "</autograde>");
    		test_cases = test_cases ? getCase(test_cases) : "";
    		internal_cases = internal_cases ? getCase(internal_cases) : "";

    		external_cases = external_cases
    		? external_cases.replace(/<\/case>|<case>/g, "")
    		: "";

    		if (document.querySelector("#test_case_text")) {
    			document.querySelector("#test_case_text").value = test_cases;
    			document.querySelector("#occurence_text").value = internal_cases;
    			document.querySelector("#exscript_text").value = external_cases.replace(/<\/case>|<case>/g, "");
    		}

    		if (test_cases || internal_cases || external_cases) {
    			// sets the value 1 of variable 'isAutograde'
    			isAutograde = 1;

    			// enables 'Testcases' field of 'Autograde' dialog box
    			document.querySelector("#test_case_text").disabled = false;

    			// enables 'Internal Script' field of 'Autograde' dialog box
    			document.querySelector("#occurence_text").disabled = false;

    			// enables 'External Script' field of 'Autograde' dialog box
    			document.querySelector("#exscript_text").disabled = false;

    			// checked the 'Autograde' checkbox
    			document.querySelector("#autograde_cb").checked = true;
    		}

    		// sets the theme of html, css and js editors according to the checked status of 'Dark Theme' checkbox
    		changeTheme();
    	}

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
    		if ("getChildXml" in $$props) $$invalidate(6, getChildXml = $$props.getChildXml);
    		if ("toggleMode" in $$props) $$invalidate(7, toggleMode = $$props.toggleMode);
    		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(9, showAns = $$props.showAns);
    	};

    	return [
    		state,
    		changeTheme,
    		generateXml,
    		runCode,
    		enableAutograde,
    		xml,
    		getChildXml,
    		toggleMode,
    		isReview,
    		showAns
    	];
    }

    class WebAuthoring extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			xml: 5,
    			getChildXml: 6,
    			toggleMode: 7,
    			isReview: 8,
    			showAns: 9
    		});
    	}
    }

    /** 

     *  Filename    : Lang.js
     *  @Author     : Saquib Ajaz <saquib.ajaz@ucertify.com>
     *  @Version    : 1.0
     *  Last updated : 15 July 2020
     *  Last updated by: Dharmendra Mishra
     */
    var Lang = {
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
        check_net_update_ids: 'Something went wrong. Please check your network connection and update the IDs again.'
    };

    /* clsSMWeb\Web.svelte generated by Svelte v3.29.0 */

    function create_if_block_2(ctx) {
    	let webauthoring;
    	let current;

    	webauthoring = new WebAuthoring({
    			props: {
    				key: "2",
    				xml: /*xml*/ ctx[0],
    				toggleMode: /*toggleMode*/ ctx[3],
    				getChildXml: /*getChildXml*/ ctx[4],
    				showAns: /*showAns*/ ctx[5],
    				editorState: /*editorState*/ ctx[2],
    				isReview: /*isReview*/ ctx[6]
    			}
    		});

    	return {
    		c() {
    			create_component(webauthoring.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(webauthoring, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const webauthoring_changes = {};
    			if (dirty & /*xml*/ 1) webauthoring_changes.xml = /*xml*/ ctx[0];
    			if (dirty & /*toggleMode*/ 8) webauthoring_changes.toggleMode = /*toggleMode*/ ctx[3];
    			if (dirty & /*getChildXml*/ 16) webauthoring_changes.getChildXml = /*getChildXml*/ ctx[4];
    			if (dirty & /*showAns*/ 32) webauthoring_changes.showAns = /*showAns*/ ctx[5];
    			if (dirty & /*editorState*/ 4) webauthoring_changes.editorState = /*editorState*/ ctx[2];
    			if (dirty & /*isReview*/ 64) webauthoring_changes.isReview = /*isReview*/ ctx[6];
    			webauthoring.$set(webauthoring_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(webauthoring.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(webauthoring.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(webauthoring, detaching);
    		}
    	};
    }

    // (228:40) 
    function create_if_block_1$1(ctx) {
    	let webpreview;
    	let current;

    	webpreview = new WebPreview({
    			props: {
    				key: "1",
    				xml: /*xml*/ ctx[0],
    				inQuizPlayer: /*editorState*/ ctx[2] ? 0 : 1,
    				editorState: /*editorState*/ ctx[2],
    				uaXML: /*uaXML*/ ctx[1]
    			}
    		});

    	return {
    		c() {
    			create_component(webpreview.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(webpreview, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const webpreview_changes = {};
    			if (dirty & /*xml*/ 1) webpreview_changes.xml = /*xml*/ ctx[0];
    			if (dirty & /*editorState*/ 4) webpreview_changes.inQuizPlayer = /*editorState*/ ctx[2] ? 0 : 1;
    			if (dirty & /*editorState*/ 4) webpreview_changes.editorState = /*editorState*/ ctx[2];
    			if (dirty & /*uaXML*/ 2) webpreview_changes.uaXML = /*uaXML*/ ctx[1];
    			webpreview.$set(webpreview_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(webpreview.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(webpreview.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(webpreview, detaching);
    		}
    	};
    }

    // (226:2) {#if state.currentComponent == 2}
    function create_if_block$6(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Loading...");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	let main;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_if_block_1$1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[7].currentComponent == 2) return 0;
    		if (/*state*/ ctx[7].currentComponent == 1) return 1;
    		if (/*state*/ ctx[7].currentComponent == 0) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	return {
    		c() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr(div, "id", "webModule");
    		},
    		m(target, anchor) {
    			insert(target, main, anchor);
    			append(main, div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { xml } = $$props;
    	let { uaXML } = $$props;
    	let { inEditor } = $$props;
    	let { editorState } = $$props;
    	let { toggleMode } = $$props;
    	let { getChildXml } = $$props;
    	let { showAns } = $$props;
    	let { setInlineEditor } = $$props;
    	let { isReview } = $$props;
    	let isPreview = 0;
    	let state = {};

    	let DataState = writable({
    		currentComponent: 2,
    		titleData: "",
    		stemData: "",
    		remediationData: "",
    		toggle: toggleMode
    	});

    	let unsubscribe = DataState.subscribe(items => {
    		$$invalidate(7, state = items);
    	});

    	// called every time when any props or state gets changed and update the xml
    	beforeUpdate(() => {
    		if (editorState) {
    			// contains the xml
    			//window.QXML = xml;
    			if (toggleMode != state.toggle) {
    				console.log({ toggleMode });
    				$$invalidate(7, state.toggle = toggleMode, state);

    				if (toggleMode == true) {
    					AI.set("renderCodeMirror", false);

    					// assign the value '1' to variable 'isPreview' to load the 'WebPreview' conponent
    					isPreview = 1;

    					renderPlayer();

    					// sets the content 'Preview' of header title that can be seen on the top of the 'Title' label
    					AH.select("#headerTitle", "html", Lang.preview);

    					// shows the label 'Check Answer' in inline way
    					AH.select("#answerCheck", "css", {
    						visibility: "visible",
    						display: "inline-block"
    					});

    					// used for show the tooltip
    					AH.enableBsAll("[data-toggle=\"tooltip\"]", "Tooltip");

    					// contains the 'Title' field value of 'Authoring' area // Replaced
    					let titleData = AH.select("#title").innerHTML;

    					// contains the 'Stem' field value of 'Authoring' area // Replaced
    					let stemData = AH.select("#stem").innerHTML;

    					// contains the 'Remediation' field value of 'Authoring' area
    					let remediationData = AH.select("#remediation").innerHTML;

    					// stes the value of state 'titleData' with value of 'Title' field of 'Authoring' area
    					$$invalidate(7, state.titleData = titleData, state);

    					// stes the value of state 'stemData' with value of 'Stem' field of 'Authoring' area
    					$$invalidate(7, state.stemData = stemData, state);

    					// stes the value of state 'remediationData' with value of 'Remediation' field of 'Authoring' area
    					$$invalidate(7, state.remediationData = remediationData, state);

    					// hides the 'Title' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'titleShow' and text stored in variable 'titleData'
    					//jQuery('#title').empty().hide().after('<div id="tilteShow">' + titleData + '</div>');  // Replaced
    					AH.empty("#title");

    					AH.select("#title", "hide");
    					AH.select("#title", "html", `<div id="tilteShow">${titleData}</div>`);

    					// hides the 'Stem' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'stemShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'stemData'
    					//	jQuery('#stem').empty().hide().after('<div id="stemShow">' + get_ucsyntax(stemData) + '</div>'); // Replaced
    					AH.empty("#stem");

    					AH.select("#stem", "hide");
    					AH.select("#stem", "html", `<div id="stemShow">${get_ucsyntax(stemData)}</div>`);

    					// hides the 'Remediation' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'remediationShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'remediationData'
    					//jQuery('#remediation').hide().empty().after('<div id="remediationShow">' + get_ucsyntax(remediationData) + '</div>'); Replaced
    					AH.empty("#remediation");

    					AH.select("#remediation", "hide");
    					AH.select("#remediation", "html", `<div id="remediationShow">${get_ucsyntax(remediationData)}</div>`);
    					AH.selectAll("#externalInputs, #authoringActions, #addTestCase", "hide");

    					// loads preview component
    					$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={xml} inQuizPlayer={0} key={1} />;
    				} else // ajaxContentUpdate({imgAltText:1,container:['#stemShow']});
    				{
    					// sets the value of variable isPreview 0 that means loads the authoring component
    					isPreview = 0; // ajaxContentUpdate({imgAltText:1,container:['#tilteShow']});

    					// makes user answer value blank
    					//window.uaXML = '';
    					// hidess the label 'Check Answer'
    					AH.select("#answerCheck", "css", { visibility: "hidden", display: "none" });

    					// sets the content 'Authoring' of header title that can be seen on the top of the 'Title' label
    					AH.select("#headerTitle", "html", Lang.authoring);

    					// removes the form element from 'Authoring area
    					AH.find("#authoringArea", "form", { action: "remove" });

    					// append the html 'stored' in variable 'windowHtml' in authoring area
    					//jQuery('#authoringArea').append(windowHtml);
    					// removes the element that was added on preview area at the place of 'Title', 'Stem' and 'Remediation' field
    					AH.selectAll("#tilteShow, #stemShow, #remediationShow", "remove");

    					// sets the content of the 'Title' field of Authoring area
    					AH.select("#title", "html", state.titleData);

    					// sets the content of the 'Stem' field of Authoring area
    					AH.select("#stem", "html", state.stemData);

    					// sets the content of the 'Remediation' field of Authoring area
    					AH.select("#remediation", "html", state.remediationData);

    					AH.selectAll("#title, #stem, #remediation, #externalInputs, #authoringActions, #addTestCase", "show", "block"); // Replaced;
    					unRenderPlayer();

    					// loads authoring component
    					$$invalidate(7, state.currentComponent = 0, state);

    					// stes the value '0' of margin-bottom of 'ol' tag that exist in 'Authoring' area
    					//jQuery("#authoringSection ol").attr("style","margin-bottom:0!important");
    					//AH.select('#authoringSection ol').setAttribute("style","margin-bottom:0!important");
    					try {
    						// removes the id of all elements that comes under 'Stem' label and un-initialize the tinymce editor
    						setInlineEditor("#stem");

    						// removes the id of all elements that comes under Remediation' label and un-initialize the tinymce editor
    						setInlineEditor("#remediation");
    					} catch(e) {
    						console.log(e);
    					}
    				}
    			}
    		} else {
    			getComp();
    		}
    	});

    	function loadLibs() {
    		let config = {
    			preload: true,
    			type: "stylesheet",
    			as: "style"
    		};

    		AH.createLink(baseUrlTheme + "clsSMWeb/libs/codemirror.min.css", config);
    		AH.createLink(baseUrlTheme + "clsSMWeb/libs/monokai.css", config);
    		AH.createLink(baseUrlTheme + "clsSMWeb/libs/simplescrollbars.css", config);
    		AH.createLink(baseUrlTheme + "clsSMWeb/libs/webitem.min.css", config);
    	}

    	// called once throughtout the program execution just after render method
    	onMount(async () => {
    		loadLibs();
    		await tick();

    		if (editorState) {
    			//AI.set('web',this);
    			getComp();

    			// logs the message on console if module loaded in editor
    			console.log("Web in editormode");
    		} else {
    			AH.listen(document, "mouseover", "#webModule", () => {
    				if (isHover == 0) {
    					isHover = 1;

    					//state.currentComponent = "<h1>uCertify</h1>";
    					$$invalidate(7, state.currentComponent = 1, state);
    				}
    			});

    			// sets the value of state 'currentComponent' and loads 'WebPreview' component by setting the value of property 'inQuizPlayer' as '1' and property 'key' as '2'
    			$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={window.QXML} inQuizPlayer={1} key={2} />;
    		}

    		await tick();
    	});

    	function getComp() {
    		if (editorState) {
    			// in case of Editor loads preview or authoring component according to the value of variable 'isPreview'
    			setTimeout(
    				() => {
    					$$invalidate(7, state.currentComponent = isPreview == 1 ? 1 : 0, state);
    				},
    				1000
    			);
    		} else {
    			// render preview component in case other than Editor such as book, quiz etc
    			$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={window.QXML} inQuizPlayer={0} key={1} />; 
    		}
    	}

    	// used for unrender the player tag
    	function unRenderPlayer() {
    		// makes player tag empty that exist inside element have id: authoringDiv
    		//jQuery('#authoringDiv player').empty(); // Replaced 
    		AH.empty("#authoringDiv player");

    		// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
    		AH.find("#authoringDiv", "player", {
    			action: "removeClass",
    			actionData: "hidecontent"
    		});

    		AH.selectAll("#editor img").forEach(_this => {
    			if (!_this.getAttribute("header-logo") && !_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    				_this.setAttribute("src", _this.getAttribute("src"));
    			}
    		});
    	}

    	// render the player tag
    	function renderPlayer() {
    		// makes player tag empty that exist inside element have id: authoringDiv
    		//jQuery('#authoringDiv player').empty(); // Replaced
    		AH.empty("#authoringDiv player");

    		// used for set the data of player tag
    		//tag_player(AH.select('#authoringDiv')); // Need to fix it
    		// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
    		AH.find("#authoringDiv", "player", {
    			action: "addClass",
    			actionData: "hidecontent"
    		});

    		AH.selectAll("#editor img").forEach(_this => {
    			if (!_this.getAttribute("header-logo") && !_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    				_this.setAttribute("src", "//s3.amazonaws.com/jigyaasa_content_static/" + _this.getAttribute("src"));
    			}
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(0, xml = $$props.xml);
    		if ("uaXML" in $$props) $$invalidate(1, uaXML = $$props.uaXML);
    		if ("inEditor" in $$props) $$invalidate(8, inEditor = $$props.inEditor);
    		if ("editorState" in $$props) $$invalidate(2, editorState = $$props.editorState);
    		if ("toggleMode" in $$props) $$invalidate(3, toggleMode = $$props.toggleMode);
    		if ("getChildXml" in $$props) $$invalidate(4, getChildXml = $$props.getChildXml);
    		if ("showAns" in $$props) $$invalidate(5, showAns = $$props.showAns);
    		if ("setInlineEditor" in $$props) $$invalidate(9, setInlineEditor = $$props.setInlineEditor);
    		if ("isReview" in $$props) $$invalidate(6, isReview = $$props.isReview);
    	};

    	return [
    		xml,
    		uaXML,
    		editorState,
    		toggleMode,
    		getChildXml,
    		showAns,
    		isReview,
    		state,
    		inEditor,
    		setInlineEditor
    	];
    }

    class Web extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			xml: 0,
    			uaXML: 1,
    			inEditor: 8,
    			editorState: 2,
    			toggleMode: 3,
    			getChildXml: 4,
    			showAns: 5,
    			setInlineEditor: 9,
    			isReview: 6
    		});
    	}
    }

    const defXMl = '';

    const app = new Web({
    	target: document.getElementById(window.moduleContainer) || document.body,
    	props: {
    		xml: window.QXML || defXMl,
    		uaXML: window.uaXML,
    		ansStatus: 0,
    		isReview: window.isReviewMode || false,
    		smqCounter : window.idCounter,
    		CM : window.idCounter
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle_q22.js.map
