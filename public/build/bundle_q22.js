
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
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
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
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
            on_disconnect: [],
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
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.34.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
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

    /* node_modules/svelte-mui/src/Ripple.svelte generated by Svelte v3.34.0 */

    const { console: console_1, document: document_1 } = globals;
    const file = "node_modules/svelte-mui/src/Ripple.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-po4fcb-style";
    	style.textContent = ".ripple.svelte-po4fcb{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;border-radius:inherit;color:inherit;pointer-events:none;z-index:0;contain:strict}.ripple.svelte-po4fcb .animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;opacity:0;pointer-events:none;overflow:hidden;will-change:transform, opacity}.ripple.svelte-po4fcb .animation--enter{transition:none}.ripple.svelte-po4fcb .animation--in{transition:opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n\t\t\topacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)}.ripple.svelte-po4fcb .animation--out{transition:opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmlwcGxlLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUF5TEMsT0FBTyxjQUFDLENBQUEsQUFDUCxPQUFPLENBQUUsS0FBSyxDQUNkLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxDQUFDLENBQ04sSUFBSSxDQUFFLENBQUMsQ0FDUCxLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxDQUFDLENBQ1QsUUFBUSxDQUFFLE1BQU0sQ0FDaEIsYUFBYSxDQUFFLE9BQU8sQ0FDdEIsS0FBSyxDQUFFLE9BQU8sQ0FDZCxjQUFjLENBQUUsSUFBSSxDQUNwQixPQUFPLENBQUUsQ0FBQyxDQUNWLE9BQU8sQ0FBRSxNQUFNLEFBQ2hCLENBQUEsQUFDQSxxQkFBTyxDQUFDLEFBQVEsVUFBVSxBQUFFLENBQUEsQUFDM0IsS0FBSyxDQUFFLE9BQU8sQ0FDZCxRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsQ0FBQyxDQUNOLElBQUksQ0FBRSxDQUFDLENBQ1AsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsT0FBTyxDQUFFLENBQUMsQ0FDVixjQUFjLENBQUUsSUFBSSxDQUNwQixRQUFRLENBQUUsTUFBTSxDQUNoQixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxBQUNoQyxDQUFBLEFBQ0EscUJBQU8sQ0FBQyxBQUFRLGlCQUFpQixBQUFFLENBQUEsQUFDbEMsVUFBVSxDQUFFLElBQUksQUFDakIsQ0FBQSxBQUNBLHFCQUFPLENBQUMsQUFBUSxjQUFjLEFBQUUsQ0FBQSxBQUMvQixVQUFVLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNyRCxVQUFVLENBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFDM0MsQ0FBQSxBQUNBLHFCQUFPLENBQUMsQUFBUSxlQUFlLEFBQUUsQ0FBQSxBQUNoQyxVQUFVLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUN0RCxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlJpcHBsZS5zdmVsdGUiXX0= */";
    	append_dev(document_1.head, style);
    }

    function create_fragment(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ripple svelte-po4fcb");
    			add_location(div, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[4](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[4](null);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Ripple", slots, []);
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

    	const writable_props = ["center", "circle", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Ripple> was created with unknown prop '${key}'`);
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

    	$$self.$capture_state = () => ({
    		isTouchEvent,
    		transform,
    		opacity,
    		calculate,
    		startRipple,
    		onMouseDown,
    		onTouchStart,
    		center,
    		circle,
    		color,
    		tick,
    		onMount,
    		onDestroy,
    		el,
    		trigEl
    	});

    	$$self.$inject_state = $$props => {
    		if ("center" in $$props) $$invalidate(1, center = $$props.center);
    		if ("circle" in $$props) $$invalidate(2, circle = $$props.circle);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("el" in $$props) $$invalidate(0, el = $$props.el);
    		if ("trigEl" in $$props) trigEl = $$props.trigEl;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [el, center, circle, color, div_binding];
    }

    class Ripple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1.getElementById("svelte-po4fcb-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { center: 1, circle: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ripple",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get center() {
    		throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get circle() {
    		throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set circle(value) {
    		throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-mui/src/Button.svelte generated by Svelte v3.34.0 */
    const file$1 = "node_modules/svelte-mui/src/Button.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-6bcb3a-style";
    	style.textContent = "button.svelte-6bcb3a:disabled{cursor:default}button.svelte-6bcb3a{cursor:pointer;font-family:Roboto, Helvetica, sans-serif;font-family:var(--button-font-family, Roboto, Helvetica, sans-serif);font-size:0.875rem;font-weight:500;letter-spacing:0.75px;text-decoration:none;text-transform:uppercase;will-change:transform, opacity;margin:0;padding:0 16px;display:-ms-inline-flexbox;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;height:36px;border:none;outline:none;line-height:inherit;user-select:none;overflow:hidden;vertical-align:middle;border-radius:4px}button.svelte-6bcb3a::-moz-focus-inner{border:0}button.svelte-6bcb3a:-moz-focusring{outline:none}button.svelte-6bcb3a:before{box-sizing:inherit;border-radius:inherit;color:inherit;bottom:0;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.2s cubic-bezier(0.25, 0.8, 0.5, 1);will-change:background-color, opacity}.toggle.svelte-6bcb3a:before{box-sizing:content-box}.active.svelte-6bcb3a:before{background-color:currentColor;opacity:0.3}.raised.svelte-6bcb3a{box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 5px 0 rgba(0, 0, 0, 0.12)}.outlined.svelte-6bcb3a{padding:0 14px;border-style:solid;border-width:2px}.shaped.svelte-6bcb3a{border-radius:18px}.dense.svelte-6bcb3a{height:32px}.icon-button.svelte-6bcb3a{line-height:0.5;border-radius:50%;padding:8px;width:40px;height:40px;vertical-align:middle}.icon-button.outlined.svelte-6bcb3a{padding:6px}.icon-button.fab.svelte-6bcb3a{border:none;width:56px;height:56px;box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 18px 0 rgba(0, 0, 0, 0.12)}.icon-button.dense.svelte-6bcb3a{width:36px;height:36px}.icon-button.fab.dense.svelte-6bcb3a{width:40px;height:40px}.outlined.svelte-6bcb3a:not(.shaped) .ripple{border-radius:0 !important}.full-width.svelte-6bcb3a{width:100%}@media(hover: hover){button.svelte-6bcb3a:hover:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}button.focus-visible.svelte-6bcb3a:focus:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.3}button.focus-visible.toggle.svelte-6bcb3a:focus:not(.active):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUF1SUMsb0JBQU0sU0FBUyxBQUFDLENBQUEsQUFDZixNQUFNLENBQUUsT0FBTyxBQUNoQixDQUFBLEFBQ0EsTUFBTSxjQUFDLENBQUEsQUFDTixNQUFNLENBQUUsT0FBTyxDQUNmLFdBQVcsQ0FBRSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBRTFDLFdBQVcsQ0FBRSxJQUFJLG9CQUFvQixDQUFDLDhCQUE4QixDQUFDLENBQ3JFLFNBQVMsQ0FBRSxRQUFRLENBQ25CLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGVBQWUsQ0FBRSxJQUFJLENBQ3JCLGNBQWMsQ0FBRSxTQUFTLENBQ3pCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQy9CLE1BQU0sQ0FBRSxDQUFDLENBQ1QsT0FBTyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2YsT0FBTyxDQUFFLGtCQUFrQixDQUMzQixPQUFPLENBQUUsV0FBVyxDQUNwQixRQUFRLENBQUUsUUFBUSxDQUNsQixXQUFXLENBQUUsTUFBTSxDQUNuQixlQUFlLENBQUUsTUFBTSxDQUN2QixVQUFVLENBQUUsVUFBVSxDQUN0QixNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLElBQUksQ0FDYixXQUFXLENBQUUsT0FBTyxDQUNwQixXQUFXLENBQUUsSUFBSSxDQUNqQixRQUFRLENBQUUsTUFBTSxDQUNoQixjQUFjLENBQUUsTUFBTSxDQUN0QixhQUFhLENBQUUsR0FBRyxBQUNuQixDQUFBLEFBQ0Esb0JBQU0sa0JBQWtCLEFBQUMsQ0FBQSxBQUN4QixNQUFNLENBQUUsQ0FBQyxBQUNWLENBQUEsQUFDQSxvQkFBTSxlQUFlLEFBQUMsQ0FBQSxBQUNyQixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDQSxvQkFBTSxPQUFPLEFBQUMsQ0FBQSxBQUNiLFVBQVUsQ0FBRSxPQUFPLENBQ25CLGFBQWEsQ0FBRSxPQUFPLENBQ3RCLEtBQUssQ0FBRSxPQUFPLENBQ2QsTUFBTSxDQUFFLENBQUMsQ0FDVCxPQUFPLENBQUUsRUFBRSxDQUNYLElBQUksQ0FBRSxDQUFDLENBQ1AsT0FBTyxDQUFFLENBQUMsQ0FDVixjQUFjLENBQUUsSUFBSSxDQUNwQixRQUFRLENBQUUsUUFBUSxDQUNsQixLQUFLLENBQUUsQ0FBQyxDQUNSLEdBQUcsQ0FBRSxDQUFDLENBQ04sVUFBVSxDQUFFLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNoRCxXQUFXLENBQUUsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLEFBQ3ZDLENBQUEsQUFDQSxxQkFBTyxPQUFPLEFBQUMsQ0FBQSxBQUNkLFVBQVUsQ0FBRSxXQUFXLEFBQ3hCLENBQUEsQUFDQSxxQkFBTyxPQUFPLEFBQUMsQ0FBQSxBQUNkLGdCQUFnQixDQUFFLFlBQVksQ0FDOUIsT0FBTyxDQUFFLEdBQUcsQUFDYixDQUFBLEFBRUEsT0FBTyxjQUFDLENBQUEsQUFDUCxVQUFVLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUM3RSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQUFDakMsQ0FBQSxBQUNBLFNBQVMsY0FBQyxDQUFBLEFBQ1QsT0FBTyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2YsWUFBWSxDQUFFLEtBQUssQ0FDbkIsWUFBWSxDQUFFLEdBQUcsQUFDbEIsQ0FBQSxBQUNBLE9BQU8sY0FBQyxDQUFBLEFBQ1AsYUFBYSxDQUFFLElBQUksQUFDcEIsQ0FBQSxBQUNBLE1BQU0sY0FBQyxDQUFBLEFBQ04sTUFBTSxDQUFFLElBQUksQUFDYixDQUFBLEFBRUEsWUFBWSxjQUFDLENBQUEsQUFDWixXQUFXLENBQUUsR0FBRyxDQUNoQixhQUFhLENBQUUsR0FBRyxDQUNsQixPQUFPLENBQUUsR0FBRyxDQUNaLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixjQUFjLENBQUUsTUFBTSxBQUN2QixDQUFBLEFBQ0EsWUFBWSxTQUFTLGNBQUMsQ0FBQSxBQUNyQixPQUFPLENBQUUsR0FBRyxBQUNiLENBQUEsQUFDQSxZQUFZLElBQUksY0FBQyxDQUFBLEFBQ2hCLE1BQU0sQ0FBRSxJQUFJLENBQ1osS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzlFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxBQUNsQyxDQUFBLEFBQ0EsWUFBWSxNQUFNLGNBQUMsQ0FBQSxBQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2IsQ0FBQSxBQUVBLFlBQVksSUFBSSxNQUFNLGNBQUMsQ0FBQSxBQUN0QixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2IsQ0FBQSxBQUVBLHVCQUFTLEtBQUssT0FBTyxDQUFDLENBQUMsQUFBUSxPQUFPLEFBQUUsQ0FBQSxBQUN2QyxhQUFhLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDNUIsQ0FBQSxBQUVBLFdBQVcsY0FBQyxDQUFBLEFBQ1gsS0FBSyxDQUFFLElBQUksQUFDWixDQUFBLEFBRUEsTUFBTSxBQUFDLFFBQVEsS0FBSyxDQUFDLEFBQUMsQ0FBQSxBQUNyQixvQkFBTSxNQUFNLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxPQUFPLEFBQUMsQ0FBQSxBQUMvRCxnQkFBZ0IsQ0FBRSxZQUFZLENBQzlCLE9BQU8sQ0FBRSxJQUFJLEFBQ2QsQ0FBQSxBQUNBLE1BQU0sNEJBQWMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsT0FBTyxBQUFDLENBQUEsQUFDN0UsZ0JBQWdCLENBQUUsWUFBWSxDQUM5QixPQUFPLENBQUUsR0FBRyxBQUNiLENBQUEsQUFDQSxNQUFNLGNBQWMscUJBQU8sTUFBTSxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsT0FBTyxBQUFDLENBQUEsQUFDcEYsZ0JBQWdCLENBQUUsWUFBWSxDQUM5QixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDRCxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkJ1dHRvbi5zdmVsdGUiXX0= */";
    	append_dev(document.head, style);
    }

    // (20:1) {#if ripple}
    function create_if_block(ctx) {
    	let ripple_1;
    	let current;

    	ripple_1 = new Ripple({
    			props: {
    				center: /*icon*/ ctx[3],
    				circle: /*icon*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ripple_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ripple_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ripple_1_changes = {};
    			if (dirty & /*icon*/ 8) ripple_1_changes.center = /*icon*/ ctx[3];
    			if (dirty & /*icon*/ 8) ripple_1_changes.circle = /*icon*/ ctx[3];
    			ripple_1.$set(ripple_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ripple_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ripple_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ripple_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(20:1) {#if ripple}",
    		ctx
    	});

    	return block;
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

    	const block = {
    		c: function create() {
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
    			add_location(button, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			append_dev(button, t);
    			if (if_block) if_block.m(button, null);
    			/*button_binding*/ ctx[20](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*onclick*/ ctx[16], false, false, false),
    					action_destroyer(events_action = /*events*/ ctx[15].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*button_binding*/ ctx[20](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let iconSize;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
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

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		createEventDispatcher,
    		current_component,
    		getEventsAction,
    		islegacy,
    		luminance,
    		Ripple,
    		dispatch,
    		events,
    		className,
    		style,
    		icon,
    		fab,
    		dense,
    		raised,
    		unelevated,
    		outlined,
    		shaped,
    		color,
    		ripple,
    		toggle,
    		active,
    		fullWidth,
    		elm,
    		attrs,
    		onclick,
    		iconSize
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("style" in $$props) $$invalidate(2, style = $$new_props.style);
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("fab" in $$props) $$invalidate(4, fab = $$new_props.fab);
    		if ("dense" in $$props) $$invalidate(5, dense = $$new_props.dense);
    		if ("raised" in $$props) $$invalidate(6, raised = $$new_props.raised);
    		if ("unelevated" in $$props) $$invalidate(7, unelevated = $$new_props.unelevated);
    		if ("outlined" in $$props) $$invalidate(8, outlined = $$new_props.outlined);
    		if ("shaped" in $$props) $$invalidate(9, shaped = $$new_props.shaped);
    		if ("color" in $$props) $$invalidate(17, color = $$new_props.color);
    		if ("ripple" in $$props) $$invalidate(10, ripple = $$new_props.ripple);
    		if ("toggle" in $$props) $$invalidate(11, toggle = $$new_props.toggle);
    		if ("active" in $$props) $$invalidate(0, active = $$new_props.active);
    		if ("fullWidth" in $$props) $$invalidate(12, fullWidth = $$new_props.fullWidth);
    		if ("elm" in $$props) $$invalidate(13, elm = $$new_props.elm);
    		if ("attrs" in $$props) $$invalidate(14, attrs = $$new_props.attrs);
    		if ("iconSize" in $$props) iconSize = $$new_props.iconSize;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raised() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raised(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unelevated() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unelevated(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shaped() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shaped(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullWidth() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullWidth(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-mui/src/Icon.svelte generated by Svelte v3.34.0 */
    const file$2 = "node_modules/svelte-mui/src/Icon.svelte";

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-h2unzw-style";
    	style.textContent = ".icon.svelte-h2unzw.svelte-h2unzw{display:inline-block;position:relative;vertical-align:middle;line-height:0.5}.icon.svelte-h2unzw>svg.svelte-h2unzw{display:inline-block}.flip.svelte-h2unzw.svelte-h2unzw{transform:scale(-1, -1)}.flip-h.svelte-h2unzw.svelte-h2unzw{transform:scale(-1, 1)}.flip-v.svelte-h2unzw.svelte-h2unzw{transform:scale(1, -1)}.spin.svelte-h2unzw.svelte-h2unzw{animation:svelte-h2unzw-spin 1s 0s infinite linear}.pulse.svelte-h2unzw.svelte-h2unzw{animation:svelte-h2unzw-spin 1s infinite steps(8)}@keyframes svelte-h2unzw-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBd0RDLEtBQUssNEJBQUMsQ0FBQSxBQUNMLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLFdBQVcsQ0FBRSxHQUFHLEFBQ2pCLENBQUEsQUFDQSxtQkFBSyxDQUFHLEdBQUcsY0FBQyxDQUFBLEFBQ1gsT0FBTyxDQUFFLFlBQVksQUFDdEIsQ0FBQSxBQUNBLEtBQUssNEJBQUMsQ0FBQSxBQUNMLFNBQVMsQ0FBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxBQUN6QixDQUFBLEFBQ0EsT0FBTyw0QkFBQyxDQUFBLEFBQ1AsU0FBUyxDQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQ3hCLENBQUEsQUFDQSxPQUFPLDRCQUFDLENBQUEsQUFDUCxTQUFTLENBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQUFDeEIsQ0FBQSxBQUNBLEtBQUssNEJBQUMsQ0FBQSxBQUNMLFNBQVMsQ0FBRSxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQUFDdEMsQ0FBQSxBQUNBLE1BQU0sNEJBQUMsQ0FBQSxBQUNOLFNBQVMsQ0FBRSxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQUFDckMsQ0FBQSxBQUNBLFdBQVcsa0JBQUssQ0FBQSxBQUNmLEVBQUUsQUFBQyxDQUFBLEFBQ0YsU0FBUyxDQUFFLE9BQU8sSUFBSSxDQUFDLEFBQ3hCLENBQUEsQUFDQSxJQUFJLEFBQUMsQ0FBQSxBQUNKLFNBQVMsQ0FBRSxPQUFPLE1BQU0sQ0FBQyxBQUMxQixDQUFBLEFBQ0QsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJJY29uLnN2ZWx0ZSJdfQ== */";
    	append_dev(document.head, style);
    }

    // (16:1) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(16:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:1) {#if typeof path === 'string'}
    function create_if_block$1(ctx) {
    	let svg;
    	let path_1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			attr_dev(path_1, "d", /*path*/ ctx[1]);
    			add_location(path_1, file$2, 13, 3, 311);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[2]);
    			attr_dev(svg, "class", "svelte-h2unzw");
    			add_location(svg, file$2, 12, 2, 257);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*path*/ 2) {
    				attr_dev(path_1, "d", /*path*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 4) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(12:1) {#if typeof path === 'string'}",
    		ctx
    	});

    	return block;
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

    	const block = {
    		c: function create() {
    			i = element("i");
    			if_block.c();
    			set_attributes(i, i_data);
    			toggle_class(i, "flip", /*flip*/ ctx[3] && typeof /*flip*/ ctx[3] === "boolean");
    			toggle_class(i, "flip-h", /*flip*/ ctx[3] === "h");
    			toggle_class(i, "flip-v", /*flip*/ ctx[3] === "v");
    			toggle_class(i, "spin", /*spin*/ ctx[4]);
    			toggle_class(i, "pulse", /*pulse*/ ctx[5] && !/*spin*/ ctx[4]);
    			toggle_class(i, "svelte-h2unzw", true);
    			add_location(i, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			if_blocks[current_block_type_index].m(i, null);
    			/*i_binding*/ ctx[13](i);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(events_action = /*events*/ ctx[8].call(null, i));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    				} else {
    					if_block.p(ctx, dirty);
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
    			if (detaching) detach_dev(i);
    			if_blocks[current_block_type_index].d();
    			/*i_binding*/ ctx[13](null);
    			mounted = false;
    			dispose();
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
    	validate_slots("Icon", slots, ['default']);
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

    	$$self.$capture_state = () => ({
    		current_component,
    		getEventsAction,
    		events,
    		className,
    		path,
    		size,
    		viewBox,
    		color,
    		flip,
    		spin,
    		pulse,
    		elm,
    		attrs
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(14, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("path" in $$props) $$invalidate(1, path = $$new_props.path);
    		if ("size" in $$props) $$invalidate(9, size = $$new_props.size);
    		if ("viewBox" in $$props) $$invalidate(2, viewBox = $$new_props.viewBox);
    		if ("color" in $$props) $$invalidate(10, color = $$new_props.color);
    		if ("flip" in $$props) $$invalidate(3, flip = $$new_props.flip);
    		if ("spin" in $$props) $$invalidate(4, spin = $$new_props.spin);
    		if ("pulse" in $$props) $$invalidate(5, pulse = $$new_props.pulse);
    		if ("elm" in $$props) $$invalidate(6, elm = $$new_props.elm);
    		if ("attrs" in $$props) $$invalidate(7, attrs = $$new_props.attrs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-mui/src/Checkbox.svelte generated by Svelte v3.34.0 */
    const file$3 = "node_modules/svelte-mui/src/Checkbox.svelte";

    function add_css$3() {
    	var style = element("style");
    	style.id = "svelte-1idh7xl-style";
    	style.textContent = "label.svelte-1idh7xl.svelte-1idh7xl{width:100%;align-items:center;display:flex;margin:0;position:relative;cursor:pointer;line-height:40px;user-select:none}input.svelte-1idh7xl.svelte-1idh7xl{cursor:inherit;width:100%;height:100%;position:absolute;top:0;left:0;margin:0;padding:0;opacity:0 !important}.mark.svelte-1idh7xl.svelte-1idh7xl{display:flex;position:relative;justify-content:center;align-items:center;border-radius:50%;width:40px;height:40px}.mark.svelte-1idh7xl.svelte-1idh7xl:before{background-color:currentColor;border-radius:inherit;bottom:0;color:inherit;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.3s cubic-bezier(0.25, 0.8, 0.5, 1)}@media not all and (min-resolution: 0.001dpcm){@supports (-webkit-appearance: none) and (stroke-color: transparent){.mark.svelte-1idh7xl.svelte-1idh7xl:before{transition:none}}}.label-text.svelte-1idh7xl.svelte-1idh7xl{margin-left:4px;white-space:nowrap;overflow:hidden}.right.svelte-1idh7xl .label-text.svelte-1idh7xl{margin-left:0;margin-right:auto;order:-1}@media(hover: hover){label.svelte-1idh7xl:hover:not([disabled]):not(.disabled) .mark.svelte-1idh7xl:before{opacity:0.15}.focus-visible:focus:not([disabled]):not(.disabled)~.mark.svelte-1idh7xl.svelte-1idh7xl:before{opacity:0.3}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hlY2tib3guc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXNIQyxLQUFLLDhCQUFDLENBQUEsQUFDTCxLQUFLLENBQUUsSUFBSSxDQUNYLFdBQVcsQ0FBRSxNQUFNLENBQ25CLE9BQU8sQ0FBRSxJQUFJLENBQ2IsTUFBTSxDQUFFLENBQUMsQ0FDVCxRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLFdBQVcsQ0FBRSxJQUFJLEFBQ2xCLENBQUEsQUFDQSxLQUFLLDhCQUFDLENBQUEsQUFDTCxNQUFNLENBQUUsT0FBTyxDQUNmLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsQ0FBQyxDQUNOLElBQUksQ0FBRSxDQUFDLENBQ1AsTUFBTSxDQUFFLENBQUMsQ0FDVCxPQUFPLENBQUUsQ0FBQyxDQUNWLE9BQU8sQ0FBRSxDQUFDLENBQUMsVUFBVSxBQUN0QixDQUFBLEFBQ0EsS0FBSyw4QkFBQyxDQUFBLEFBQ0wsT0FBTyxDQUFFLElBQUksQ0FDYixRQUFRLENBQUUsUUFBUSxDQUVsQixlQUFlLENBQUUsTUFBTSxDQUN2QixXQUFXLENBQUUsTUFBTSxDQUNuQixhQUFhLENBQUUsR0FBRyxDQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2IsQ0FBQSxBQUNBLG1DQUFLLE9BQU8sQUFBQyxDQUFBLEFBQ1osZ0JBQWdCLENBQUUsWUFBWSxDQUM5QixhQUFhLENBQUUsT0FBTyxDQUN0QixNQUFNLENBQUUsQ0FBQyxDQUNULEtBQUssQ0FBRSxPQUFPLENBQ2QsT0FBTyxDQUFFLEVBQUUsQ0FDWCxJQUFJLENBQUUsQ0FBQyxDQUNQLE9BQU8sQ0FBRSxDQUFDLENBQ1YsY0FBYyxDQUFFLElBQUksQ0FDcEIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLENBQUMsQ0FDUixHQUFHLENBQUUsQ0FBQyxDQUNOLFVBQVUsQ0FBRSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFDakQsQ0FBQSxBQUdBLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLFNBQVMsQ0FBQyxBQUFDLENBQUEsQUFDOUMsVUFBVSxDQUFDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLFdBQVcsQ0FBQyxBQUFDLENBQUEsQUFDcEUsbUNBQUssT0FBTyxBQUFDLENBQUEsQUFDWixVQUFVLENBQUUsSUFBSSxBQUNqQixDQUFBLEFBQ0QsQ0FBQSxBQUNELENBQUEsQUFDQSxXQUFXLDhCQUFDLENBQUEsQUFDWCxXQUFXLENBQUUsR0FBRyxDQUNoQixXQUFXLENBQUUsTUFBTSxDQUNuQixRQUFRLENBQUUsTUFBTSxBQUNqQixDQUFBLEFBQ0EscUJBQU0sQ0FBQyxXQUFXLGVBQUMsQ0FBQSxBQUNsQixXQUFXLENBQUUsQ0FBQyxDQUNkLFlBQVksQ0FBRSxJQUFJLENBQ2xCLEtBQUssQ0FBRSxFQUFFLEFBQ1YsQ0FBQSxBQUNBLE1BQU0sQUFBQyxRQUFRLEtBQUssQ0FBQyxBQUFDLENBQUEsQUFDckIsb0JBQUssTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxvQkFBSyxPQUFPLEFBQUMsQ0FBQSxBQUN2RCxPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDUSxjQUFjLEFBQUMsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBRyxtQ0FBSyxPQUFPLEFBQUMsQ0FBQSxBQUMzRSxPQUFPLENBQUUsR0FBRyxBQUNiLENBQUEsQUFDRCxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkNoZWNrYm94LnN2ZWx0ZSJdfQ== */";
    	append_dev(document.head, style);
    }

    // (13:2) {#if ripple}
    function create_if_block$2(ctx) {
    	let ripple_1;
    	let current;

    	ripple_1 = new Ripple({
    			props: { center: true, circle: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ripple_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ripple_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ripple_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ripple_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ripple_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(13:2) {#if ripple}",
    		ctx
    	});

    	return block;
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
    				? /*checkboxIndeterminate*/ ctx[14]
    				: /*checked*/ ctx[0]
    					? /*checkbox*/ ctx[12]
    					: /*checkboxOutline*/ ctx[13]
    			},
    			$$inline: true
    		});

    	let if_block = /*ripple*/ ctx[7] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	const block = {
    		c: function create() {
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
    			if (/*checked*/ ctx[0] === void 0 || /*indeterminate*/ ctx[2] === void 0) add_render_callback(() => /*input_change_handler*/ ctx[19].call(input));
    			toggle_class(input, "svelte-1idh7xl", true);
    			add_location(input, file$3, 1, 1, 70);
    			attr_dev(div0, "class", "mark svelte-1idh7xl");

    			attr_dev(div0, "style", div0_style_value = `color: ${/*indeterminate*/ ctx[2] || /*checked*/ ctx[0]
			? /*color*/ ctx[1]
			: "#9a9a9a"}`);

    			add_location(div0, file$3, 10, 1, 198);
    			attr_dev(div1, "class", "label-text svelte-1idh7xl");
    			add_location(div1, file$3, 17, 1, 438);
    			attr_dev(label, "class", label_class_value = "" + (null_to_empty(/*className*/ ctx[3]) + " svelte-1idh7xl"));
    			attr_dev(label, "style", /*style*/ ctx[4]);
    			attr_dev(label, "title", /*title*/ ctx[8]);
    			toggle_class(label, "right", /*right*/ ctx[6]);
    			toggle_class(label, "disabled", /*disabled*/ ctx[5]);
    			add_location(label, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*checked*/ ctx[0];
    			input.indeterminate = /*indeterminate*/ ctx[2];
    			append_dev(label, t0);
    			append_dev(label, div0);
    			mount_component(icon, div0, null);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(label, t2);
    			append_dev(label, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[19]),
    					listen_dev(input, "change", /*groupUpdate*/ ctx[15], false, false, false),
    					action_destroyer(events_action = /*events*/ ctx[11].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    			? /*checkboxIndeterminate*/ ctx[14]
    			: /*checked*/ ctx[0]
    				? /*checkbox*/ ctx[12]
    				: /*checkboxOutline*/ ctx[13];

    			icon.$set(icon_changes);

    			if (/*ripple*/ ctx[7]) {
    				if (if_block) {
    					if (dirty & /*ripple*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
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
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 131072) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*className*/ 8 && label_class_value !== (label_class_value = "" + (null_to_empty(/*className*/ ctx[3]) + " svelte-1idh7xl"))) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (!current || dirty & /*style*/ 16) {
    				attr_dev(label, "style", /*style*/ ctx[4]);
    			}

    			if (!current || dirty & /*title*/ 256) {
    				attr_dev(label, "title", /*title*/ ctx[8]);
    			}

    			if (dirty & /*className, right*/ 72) {
    				toggle_class(label, "right", /*right*/ ctx[6]);
    			}

    			if (dirty & /*className, disabled*/ 40) {
    				toggle_class(label, "disabled", /*disabled*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("Checkbox", slots, ['default']);
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
    	let checkbox = "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
    	let checkboxOutline = "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z";
    	let checkboxIndeterminate = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z";

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

    			$$invalidate(16, group);
    		}
    	}

    	function input_change_handler() {
    		checked = this.checked;
    		indeterminate = this.indeterminate;
    		$$invalidate(0, checked);
    		$$invalidate(2, indeterminate);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("style" in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ("color" in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("group" in $$new_props) $$invalidate(16, group = $$new_props.group);
    		if ("indeterminate" in $$new_props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ("right" in $$new_props) $$invalidate(6, right = $$new_props.right);
    		if ("ripple" in $$new_props) $$invalidate(7, ripple = $$new_props.ripple);
    		if ("title" in $$new_props) $$invalidate(8, title = $$new_props.title);
    		if ("value" in $$new_props) $$invalidate(9, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		current_component,
    		getEventsAction,
    		islegacy,
    		Icon,
    		Ripple,
    		events,
    		checked,
    		className,
    		style,
    		color,
    		disabled,
    		group,
    		indeterminate,
    		right,
    		ripple,
    		title,
    		value,
    		attrs,
    		checkbox,
    		checkboxOutline,
    		checkboxIndeterminate,
    		groupCheck,
    		groupUpdate
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("style" in $$props) $$invalidate(4, style = $$new_props.style);
    		if ("color" in $$props) $$invalidate(1, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("group" in $$props) $$invalidate(16, group = $$new_props.group);
    		if ("indeterminate" in $$props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ("right" in $$props) $$invalidate(6, right = $$new_props.right);
    		if ("ripple" in $$props) $$invalidate(7, ripple = $$new_props.ripple);
    		if ("title" in $$props) $$invalidate(8, title = $$new_props.title);
    		if ("value" in $$props) $$invalidate(9, value = $$new_props.value);
    		if ("attrs" in $$props) $$invalidate(10, attrs = $$new_props.attrs);
    		if ("checkbox" in $$props) $$invalidate(12, checkbox = $$new_props.checkbox);
    		if ("checkboxOutline" in $$props) $$invalidate(13, checkboxOutline = $$new_props.checkboxOutline);
    		if ("checkboxIndeterminate" in $$props) $$invalidate(14, checkboxIndeterminate = $$new_props.checkboxIndeterminate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		 {
    			/* eslint-disable no-unused-vars */
    			const { checked, style, color, group, indeterminate, right, ripple, title, value, ...other } = $$props;

    			!other.disabled && delete other.disabled;
    			delete other.class;
    			$$invalidate(10, attrs = other);
    		}

    		if ($$self.$$.dirty & /*group*/ 65536) {
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
    		checkbox,
    		checkboxOutline,
    		checkboxIndeterminate,
    		groupUpdate,
    		group,
    		$$scope,
    		slots,
    		input_change_handler
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1idh7xl-style")) add_css$3();

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			checked: 0,
    			class: 3,
    			style: 4,
    			color: 1,
    			disabled: 5,
    			group: 16,
    			indeterminate: 2,
    			right: 6,
    			ripple: 7,
    			title: 8,
    			value: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
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

    /* node_modules/svelte-mui/src/Dialog.svelte generated by Svelte v3.34.0 */
    const file$4 = "node_modules/svelte-mui/src/Dialog.svelte";

    function add_css$4() {
    	var style = element("style");
    	style.id = "svelte-1pkw9hl-style";
    	style.textContent = ".overlay.svelte-1pkw9hl{background-color:rgba(0, 0, 0, 0.5);cursor:pointer;position:fixed;left:0;top:0;right:0;bottom:0;z-index:30;display:flex;justify-content:center;align-items:center}.dialog.svelte-1pkw9hl{position:relative;font-size:1rem;background:#eee;background:var(--bg-panel, #eee);border-radius:4px;cursor:auto;box-shadow:0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),\n\t\t\t0 9px 46px 8px rgba(0, 0, 0, 0.12);z-index:40;max-height:80%;overflow-x:hidden;overflow-y:auto}.dialog.svelte-1pkw9hl:focus{outline:none}.dialog.svelte-1pkw9hl::-moz-focus-inner{border:0}.dialog.svelte-1pkw9hl:-moz-focusring{outline:none}div.svelte-1pkw9hl .actions{min-height:48px;padding:8px;display:flex;align-items:center}div.svelte-1pkw9hl .center{justify-content:center}div.svelte-1pkw9hl .left{justify-content:flex-start}div.svelte-1pkw9hl .right{justify-content:flex-end}.title.svelte-1pkw9hl{padding:16px 16px 12px;font-size:24px;line-height:36px;background:rgba(0, 0, 0, 0.1);background:var(--divider, rgba(0, 0, 0, 0.1))}.content.svelte-1pkw9hl{margin:16px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFzSUMsUUFBUSxlQUFDLENBQUEsQUFDUixnQkFBZ0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxNQUFNLENBQUUsT0FBTyxDQUNmLFFBQVEsQ0FBRSxLQUFLLENBQ2YsSUFBSSxDQUFFLENBQUMsQ0FDUCxHQUFHLENBQUUsQ0FBQyxDQUNOLEtBQUssQ0FBRSxDQUFDLENBQ1IsTUFBTSxDQUFFLENBQUMsQ0FDVCxPQUFPLENBQUUsRUFBRSxDQUVYLE9BQU8sQ0FBRSxJQUFJLENBQ2IsZUFBZSxDQUFFLE1BQU0sQ0FDdkIsV0FBVyxDQUFFLE1BQU0sQUFDcEIsQ0FBQSxBQUVBLE9BQU8sZUFBQyxDQUFBLEFBQ1AsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixVQUFVLENBQUUsSUFBSSxDQUVoQixVQUFVLENBQUUsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQ2pDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDbkYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ25DLE9BQU8sQ0FBRSxFQUFFLENBQ1gsVUFBVSxDQUFFLEdBQUcsQ0FDZixVQUFVLENBQUUsTUFBTSxDQUNsQixVQUFVLENBQUUsSUFBSSxBQUNqQixDQUFBLEFBQ0Esc0JBQU8sTUFBTSxBQUFDLENBQUEsQUFDYixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDQSxzQkFBTyxrQkFBa0IsQUFBQyxDQUFBLEFBQ3pCLE1BQU0sQ0FBRSxDQUFDLEFBQ1YsQ0FBQSxBQUNBLHNCQUFPLGVBQWUsQUFBQyxDQUFBLEFBQ3RCLE9BQU8sQ0FBRSxJQUFJLEFBQ2QsQ0FBQSxBQUNBLGtCQUFHLENBQUMsQUFBUSxRQUFRLEFBQUUsQ0FBQSxBQUNyQixVQUFVLENBQUUsSUFBSSxDQUNoQixPQUFPLENBQUUsR0FBRyxDQUNaLE9BQU8sQ0FBRSxJQUFJLENBQ2IsV0FBVyxDQUFFLE1BQU0sQUFDcEIsQ0FBQSxBQUNBLGtCQUFHLENBQUMsQUFBUSxPQUFPLEFBQUUsQ0FBQSxBQUNwQixlQUFlLENBQUUsTUFBTSxBQUN4QixDQUFBLEFBQ0Esa0JBQUcsQ0FBQyxBQUFRLEtBQUssQUFBRSxDQUFBLEFBQ2xCLGVBQWUsQ0FBRSxVQUFVLEFBQzVCLENBQUEsQUFDQSxrQkFBRyxDQUFDLEFBQVEsTUFBTSxBQUFFLENBQUEsQUFDbkIsZUFBZSxDQUFFLFFBQVEsQUFDMUIsQ0FBQSxBQUVBLE1BQU0sZUFBQyxDQUFBLEFBQ04sT0FBTyxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUN2QixTQUFTLENBQUUsSUFBSSxDQUNmLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUU5QixVQUFVLENBQUUsSUFBSSxTQUFTLENBQUMsbUJBQW1CLENBQUMsQUFDL0MsQ0FBQSxBQUNBLFFBQVEsZUFBQyxDQUFBLEFBQ1IsTUFBTSxDQUFFLElBQUksQUFDYixDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkRpYWxvZy5zdmVsdGUiXX0= */";
    	append_dev(document.head, style);
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
    	const title_slot_template = /*#slots*/ ctx[16].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[15], get_title_slot_context);
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const actions_slot_template = /*#slots*/ ctx[16].actions;
    	const actions_slot = create_slot(actions_slot_template, ctx, /*$$scope*/ ctx[15], get_actions_slot_context);
    	const footer_slot_template = /*#slots*/ ctx[16].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[15], get_footer_slot_context);

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

    	const block = {
    		c: function create() {
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
    			attr_dev(div0, "class", "title svelte-1pkw9hl");
    			add_location(div0, file$4, 26, 3, 604);
    			attr_dev(div1, "class", "content svelte-1pkw9hl");
    			add_location(div1, file$4, 30, 3, 664);
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "svelte-1pkw9hl", true);
    			add_location(div2, file$4, 13, 2, 284);
    			attr_dev(div3, "class", "overlay svelte-1pkw9hl");
    			add_location(div3, file$4, 3, 1, 78);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);

    			if (title_slot) {
    				title_slot.m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t1);

    			if (actions_slot) {
    				actions_slot.m(div2, null);
    			}

    			append_dev(div2, t2);

    			if (footer_slot) {
    				footer_slot.m(div2, null);
    			}

    			/*div2_binding*/ ctx[18](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(events_action = /*events*/ ctx[8].call(null, div2)),
    					listen_dev(div2, "mousedown", stop_propagation(/*mousedown_handler*/ ctx[17]), false, false, true),
    					listen_dev(div2, "mouseenter", /*mouseenter_handler*/ ctx[19], false, false, false),
    					listen_dev(div3, "mousedown", /*mousedown_handler_1*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*mouseup_handler*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (title_slot) {
    				if (title_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[15], dirty, get_title_slot_changes, get_title_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			if (actions_slot) {
    				if (actions_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(actions_slot, actions_slot_template, ctx, /*$$scope*/ ctx[15], dirty, get_actions_slot_changes, get_actions_slot_context);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(footer_slot, footer_slot_template, ctx, /*$$scope*/ ctx[15], dirty, get_footer_slot_changes, get_footer_slot_context);
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
    		i: function intro(local) {
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
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			transition_out(default_slot, local);
    			transition_out(actions_slot, local);
    			transition_out(footer_slot, local);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 180 }, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (title_slot) title_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (actions_slot) actions_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    			/*div2_binding*/ ctx[18](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(3:0) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[0] && create_if_block$3(ctx);

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

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*onKey*/ ctx[10], false, false, false),
    					listen_dev(window, "popstate", /*onPopstate*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("Dialog", slots, ['title','default','actions','footer']);
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
    		$$invalidate(14, mounted = true);
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
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		fade,
    		scale,
    		quintOut,
    		current_component,
    		getEventsAction,
    		trapTabKey,
    		enableScroll,
    		dispatch,
    		events,
    		className,
    		style,
    		visible,
    		width,
    		modal,
    		closeByEsc,
    		beforeClose,
    		mouseDownOutside,
    		attrs,
    		mounted,
    		elm,
    		close,
    		onVisible,
    		onKey,
    		onPopstate
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("style" in $$props) $$invalidate(2, style = $$new_props.style);
    		if ("visible" in $$props) $$invalidate(0, visible = $$new_props.visible);
    		if ("width" in $$props) $$invalidate(3, width = $$new_props.width);
    		if ("modal" in $$props) $$invalidate(4, modal = $$new_props.modal);
    		if ("closeByEsc" in $$props) $$invalidate(12, closeByEsc = $$new_props.closeByEsc);
    		if ("beforeClose" in $$props) $$invalidate(13, beforeClose = $$new_props.beforeClose);
    		if ("mouseDownOutside" in $$props) $$invalidate(5, mouseDownOutside = $$new_props.mouseDownOutside);
    		if ("attrs" in $$props) $$invalidate(6, attrs = $$new_props.attrs);
    		if ("mounted" in $$props) $$invalidate(14, mounted = $$new_props.mounted);
    		if ("elm" in $$props) $$invalidate(7, elm = $$new_props.elm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		 {
    			/* eslint-disable no-unused-vars */
    			const { style, visible, width, modal, closeByEsc, beforeClose, ...other } = $$props;

    			$$invalidate(6, attrs = other);
    		}

    		if ($$self.$$.dirty & /*visible, mounted*/ 16385) {
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
    		mounted,
    		$$scope,
    		slots,
    		mousedown_handler,
    		div2_binding,
    		mouseenter_handler,
    		mousedown_handler_1,
    		mouseup_handler
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get class() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modal() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modal(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeByEsc() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeByEsc(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get beforeClose() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set beforeClose(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* helper/Loader.svelte generated by Svelte v3.34.0 */

    const file$5 = "helper/Loader.svelte";

    function add_css$5() {
    	var style = element("style");
    	style.id = "svelte-to8rmr-style";
    	style.textContent = ".loader.svelte-to8rmr{border:2px solid #f3f3f3;border-radius:50%;border-top:2px solid #3498db;-webkit-animation:svelte-to8rmr-spin 2s linear infinite;animation:svelte-to8rmr-spin 2s linear infinite;margin:0 auto}.loader_msg.svelte-to8rmr{text-align:center;padding:15px}@-webkit-keyframes svelte-to8rmr-spin{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes svelte-to8rmr-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGVyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFVQSxPQUFPLGNBQUMsQ0FBQSxBQUNOLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDekIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsVUFBVSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUM3QixpQkFBaUIsQ0FBRSxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUMxQyxTQUFTLENBQUUsa0JBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FDbEMsTUFBTSxDQUFFLENBQUMsQ0FBQyxJQUFJLEFBQ2hCLENBQUEsQUFFQSxXQUFXLGNBQUMsQ0FBQSxBQUNWLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLE9BQU8sQ0FBRSxJQUFJLEFBQ2YsQ0FBQSxBQUdBLG1CQUFtQixrQkFBSyxDQUFBLEFBQ3RCLEVBQUUsQUFBQyxDQUFDLEFBQUMsaUJBQWlCLENBQUUsT0FBTyxJQUFJLENBQUMsQUFBRSxDQUFBLEFBQ3RDLElBQUksQUFBQyxDQUFDLEFBQUMsaUJBQWlCLENBQUUsT0FBTyxNQUFNLENBQUMsQUFBRSxDQUFBLEFBQzVDLENBQUEsQUFFQSxXQUFXLGtCQUFLLENBQUEsQUFDZCxFQUFFLEFBQUMsQ0FBQyxBQUFDLFNBQVMsQ0FBRSxPQUFPLElBQUksQ0FBQyxBQUFFLENBQUEsQUFDOUIsSUFBSSxBQUFDLENBQUMsQUFBQyxTQUFTLENBQUUsT0FBTyxNQUFNLENBQUMsQUFBRSxDQUFBLEFBQ3BDLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiTG9hZGVyLnN2ZWx0ZSJdfQ== */";
    	append_dev(document.head, style);
    }

    // (7:0) {#if msg}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*msg*/ ctx[1]);
    			attr_dev(div, "class", "loader_msg svelte-to8rmr");
    			add_location(div, file$5, 7, 2, 155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msg*/ 2) set_data_dev(t, /*msg*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(7:0) {#if msg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let if_block = /*msg*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "loader svelte-to8rmr");
    			set_style(div, "height", /*size*/ ctx[0] + "px");
    			set_style(div, "width", /*size*/ ctx[0] + "px");
    			add_location(div, file$5, 5, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
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
    	validate_slots("Loader", slots, []);
    	let { size = 100 } = $$props;
    	let { msg = false } = $$props;
    	const writable_props = ["size", "msg"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("msg" in $$props) $$invalidate(1, msg = $$props.msg);
    	};

    	$$self.$capture_state = () => ({ size, msg });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("msg" in $$props) $$invalidate(1, msg = $$props.msg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, msg];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-to8rmr-style")) add_css$5();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, msg: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get size() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get msg() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
        bits: "bold",
        italics: "italic",
        underlines: "underline",
        strikethrough: "Strikethrough",
        strikethroughs: "strikethrough",
        superscripts: "superscript",
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
        strptab: "Striped Table",
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
        math_eq         : 'Mathematical Equation',
        fill_text_placeholder : "Write correct answer here",
        fill_text_help1 : "1. To include multiple correct answers, type the answers and separate them with a comma (,).",
        fill_text_help2 : "2. Please do not include any space. Now, go back to the Settings and select Multiple Correct Answers from the drop-down.",
        fill_text_help3 : "3. Use #cm for comma (e.g., 5,000 as 5#cm000, function(a,b) as function(a#cmb)).",
        fill_math_help1 : "1. To make math equation initially, Click f(x) and then insert the equation.",
        fill_math_help2 : "2. To add user Response, place cursor before{*} and Click Add Response.",
        fill_math_help3 : "3. To edit the existing equation, Click Edit.",
        fill_help1_help2: "1. To include multiple correct answers, type the answers and separate them with a comma (,). Please do not include any space. Now, go back to the Settings and select Multiple Correct Answers from the drop-down",
        fill_text_help2 : "2. Use #cm for comma (e.g., 5,000 as 5#cm000, function(a,b) as function(a#cmb)).",
        star_note : '* Note:',
        do_not_include_space : '2. Please do not include space.',
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
        is_graph : "Is Graph",
        ignore_error: "Ignore Error",
        ignore_formatting: "Ignore Formatting",
        ignore_reset_db: 'Ignore Reset DB',
        pre_tag: "Pre Tag",
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
        superscript: "Superscript",
        subscript: "Subscript",
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
        number_from: "Insert number between 0 to ",
        another_option: "Select another option",
        layout_options: "Layout Options",
        row_count: "Row Count",
        col_count: "Column Count",
        empty_field: "Field value can not be empty",
        lock_author_cell: "To lock author shaded cells, it should be part of correct answer",
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
        drag_drop_set_seq_msg: 'Drag and Drop to set sequence.',
        please_enter_reply_comment : 'Please enter the reply comment',
        embed_player: 'This player tag is used to embed a content.',
        icon_not_blank: 'Icons name should not be blank!',	
        heading_info: "Here, # is the parent (root) element of the tree and it will not be dragged, ## is the child of the parent element and it will also not be dragged, ### is the child of the parent's child element and it can be dragged and dropped.",	
        key_info: "Key|Option text|Icon (Put comma after each line) Where  option text is the label for option of contextmenu list and icon is icon for that label and key is numeric value that helps to create the list option.",	
        note_text: "*Note:",	
        icons_list: "Icons List",	
        hase_icon_3: "### icon",	
        hase_icon_2: "## icon",	
        hase_icon_1: "# icon",	
        no_icons: 'No icons found!',	
        search_icons: 'Search Icons',	
        loading_icons: 'Please wait, Loading Icons...',	
        select_icon: "You can get the icon name by clicking on the Icon list button!",
        light_blue: "Light Blue",
        dark_blue: "Dark Blue",
        peach: "Peach",
        green: "Green",
        purple: "Purple",
        table_width: "Table width",
        themes: "Themes",
        add_row: "Add row",
        add_column: 'Add column',
        upload_data: 'Upload Data',
        hour: 'Hour',
        day: 'Day',
        week: 'Week',
        month: 'Month',
        graph: 'Graph :',
        users: 'Users',
        course_code: 'Course Code',
        iot_graph: 'IOT Graphs',
        from: 'From',
        to: 'To',
        star: '*',
        apply: 'Apply',
        colon: ':',
        both_field_necessary: 'Both Date Field is necessary!',
        load_efficiency: 'Load Efficiency',
        avg_max_speed: 'Average load & max speed',
        recent_fuel: 'Recent Fuel Reading',
        truck_list: 'Truck List',
        show_graph: 'Show Graph',
        get_truck_list: 'Get Truck List',
        no_data_found : 'No data Found!',
        total_users: 'Total Users',
        time_interval : 'Time Interval',
        total_unique_users: 'Total Unique Users',
        total_unique_users_per_day: 'Total Unique Users Per Day',
        load_efficiency_for_truck: 'Load efficiency for Truck id',
        max_speed: 'Max Speed',
        avg_load : 'Average Load',
        fuel_reading: 'Fuel Reading',
        truck_id : 'Truck ID',
        comment_choiceMatrix : 'Use #cm for comma.',
        // dndAuthString.js
        draggable: 'Draggable',
        placeholder: 'Place Holder',
        input_box: 'Input Box',
        checkbox_input: 'Check Box Input',
        multiline_text_box: 'Multiline Text Box',
        radio_inout: 'Radio input',
        select: 'Select',
        select_dropdown: 'Select Dropdown',
        new_menu: 'New Menu',
        clickable: 'Clickable',
        new_label: 'New Label',
        hotspot : 'Hotspot',
        new_steps: 'New Step',
        insert_script: 'Insert Script',
        select_list: 'Select List',
        label: 'Label',
        area_matrix: 'Area Matrix',
        new_pills: 'New Pills',
        base: 'Base',
        choice_matrix: 'Choice Matrix',
        delete_txt: 'Do you want to delete it?',
        select_style: '-- Select Style --',
        heading_arial: 'Heading Arial',
        heading_georgia: 'Heading Georgia',
        heading_cambria: 'Heading Cambria',
        heading_calibri: 'Heading Calibri',
        heading_verdana: 'Heading Verdana',
        heading_roman: 'Heading Times New Roman',
        content_arial: 'Content Arial',
        content_georgia: 'Content Georgia',
        content_cambria: 'Content Camabria',
        content_calibri: 'Content Calibri',
        content_verdana: 'Content Verdana',
        content_roman: 'Content Times New Roman',
        select_class: '-- Select Class --',
        sql_terminal: 'SQL Terminal',
        width_of_draggable: 'Width of Draggable',
        height_of_drggable: 'Height of Draggable',
        top_of_draggable: 'Top of Draggable',
        top: 'Top',
        left_of_drggable: 'Left of Draggable',
        title_of_drggable: 'Title of draggable',
        name_of_draggable: 'Name of draggable',
        border_color: 'Border Color',
        none: 'None',
        black: 'Black',
        gray: 'Gray',
        grp_name: 'Group Name',
        background_image: 'Background Image',
        bg_of_draggble: 'Background image of draggable',
        multiple_drag: 'Multiple Drag',
        invisible: 'Invisible',
        css_style: 'CSS Style',
        css_style_of_txt: 'CSS style of Textbox',
        detail_of_drag: 'Detail of draggable (guid or text)',
        width_of_placeholder: 'Width of Place holder',
        height_of_placeholder: 'Height of Place holder',
        top_of_ph: 'Top of Place holder',
        left_of_ph: 'Left of Place holder',
        tilte_of_ph: 'Title of Place holder',
        name_of_ph : 'Name of Place holder',
        correct_answer_of_ph: 'Correct answer of Place holder',
        default_answer_of_ph: 'Default answer of Place holder',
        css_style_of_ph: 'CSS style of Place holder',
        width_of_input : 'Width of Input box',
        height_of_input: 'Height of Input box',
        top_of_input: 'Top of Input box',
        left_of_input: 'Left of Input box',
        correct_answer_of_input: 'Correct answer of Input box',
        default_ans_of_input: 'Default answer of Input box',
        placeholder_of_ib: 'Place holder of Input box',
        text_box: 'Text box',
        password: 'Password',
        parser: 'Parser',
        parser_of_txt: 'Parser of Textbox',
        sql: 'SQL',
        multi_crct_answer: 'Multiple Correct Answers',
        css_of_input: 'CSS style of Input box',
        font_style: 'Font Style',
        height_of_multiline: 'Height of Multiline',
        width_of_multiline: 'Width of Multiline',
        top_of_multiline: 'Top of Multiline',
        left_of_multiline: 'Left of Multiline',
        crct_ans_multiline: 'Correct answer of Multiline',
        def_ans_multiline: 'Default answer of Multiline',
        placeholder_multiline: 'Place holder of Multiline',
        parser_of_multiline: 'Parser of Multiline',
        css_class: 'CSS Class',
        width_of_checkbox: 'Width of Checkbox',
        height_of_checkbox: 'Height of Checkbox',
        top_of_checkbox: 'Top of Checkbox',
        left_of_checkbox: 'Left of Checkbox',
        crct_of_chk: 'Correct answer of Checkbox',
        def_of_chk : 'Default answer of checkbox',
        css_of_chk: 'CSS style of checkbox',
        width_of_radio: 'Width of Radio',
        height_of_radio: 'Height of Radio',
        top_of_radio: 'Top of Radio',
        left_of_radio: 'Left of Radio',
        crct_of_radio: 'Correct answer of Radio',
        def_of_radio : 'Default answer of Radio',
        chktype_of_radio: 'Check Type of Radio',
        chk_type: 'Check Type',
        css_style_radio: 'CSS style of Radio',
        width_of_button: 'Width of button',
        height_of_button: 'Height of button',
        top_of_button: 'Top of button',
        left_of_button: 'Left of button',
        value_of_button: 'Value of button',
        class_of_button: 'Class of button',
        value: 'Value',
        class: 'Class',
        css_style_btn: 'CSS style of Button',
        width_of_dropdown: 'Width of dropdown',
        height_of_dropdown: 'Height of dropdown',
        top_of_dropdown: 'Top of dropdown',
        left_of_dropdown: 'Left of dropdown',
        value_of_dropdown: 'Value of dropdown',
        class_of_dropdown: 'Class of dropdown',
        option_of_dropdown: 'Option of dropdown',
        css_style_of_drpdwn: 'CSS style of Dropdown',
        options: 'Options',
        width_of_listbox: 'Width of listbox',
        height_of_listbox: 'Height of listbox',
        top_of_listbox: 'Top of listbox',
        left_of_listbox: 'Left of listbox',
        option_of_listbox: 'Option of listbox',
        select_multiple: 'Select Multiple',
        css_style_of_listbox: 'CSS style of listbox',
        width_of_tabhead: 'Width of tabhead',
        height_of_tabhead: 'Height of tabhead',
        top_of_tabhead: 'Top of tabhead',
        left_of_tabhead: 'Left of tabhead',
        title_of_tabhead: 'Title of tabhead',
        class_of_tabhead: 'Class of tabhead',
        css_style_of_tabhead: 'CSS style of tabhead',
        width_of_image: 'Width of image',
        height_of_image: 'Height of image',
        top_of_image: 'Top of image',
        left_of_image: 'Left of image',
        title_of_image: 'Title of image',
        css_style_of_image: 'CSS style of image',
        bg_of_img: 'Background image of Image',
        width_of_label: 'Width of label',
        height_of_label: 'Height of label',
        top_of_label: 'Top of label',
        left_of_label: 'Left of label',
        title_of_label: 'Title of label',
        border_size: 'Border Size',
        blue: 'Blue',
        red: 'Red',
        bg_color: 'Background Color',
        rich_text: 'Rich Textbox',
        matrix: 'Matrix',
        width_of_area: 'Width of area',
        height_of_area: 'Height of area',
        top_of_area: 'Top of area',
        left_of_area: 'Left of area',
        matrix_of_area: 'Matrix of area',
        crt_of_area: 'Correct Answer of area',
        def_of_area: 'Default Answer of area',
        width_of_menulist: 'Width of menulist',
        height_of_menulist: 'Height of menulist',
        top_of_menulist: 'Top of menulist',
        left_of_menulist: 'Left of menulist',
        matrix_of_menulist: 'Matrix of menulist',
        crt_of_menulist: 'Correct Answer of menulist',
        event_value: 'Events value',
        event_val_menulist: 'Events value of Menulist',
        width_of_hotspot: 'Width of hotspot',
        height_of_hotspot: 'Height of hotspot',
        top_of_hotspot: 'Top of hotspot',
        left_of_hotspot: 'Left of hotspot',
        title_of_hotspot: 'Title of hotspot',
        name_of_hotspot: 'Title of hotspot',
        target_img: 'Target Image',
        hide_target: 'Hide Target',
        target_img_hpt: 'Target Image of Hotspot',
        width_of_click: 'Width of click',
        height_of_click: 'Height of click',
        top_of_click: 'Top of click',
        left_of_click: 'Left of click',
        title_of_tab: 'Title of tab',
        alt_of_image: 'Alt of image',
        bg_of_tab: 'Background image of tab',
        bg_of_step: 'Background image of Step',
        alt_text: 'Alt',
        display: 'Display',
        width_of_base: 'Width of base',
        height_of_base: 'Height of base',
        bg_alt_text: 'Background Alt Text',
        alt_text_base: 'Alt text of Base',
        bg_of_base: 'Background image of Base',
        add_border: 'Add Border',
        width_of_cm: 'Width of Choice Matrix',
        height_of_cm: 'Height of Choice Matrix',
        top_of_cm: 'Top of Choice Matrix',
        left_of_cm: 'Left of Choice Matrix',
        name_of_cm: 'Name of Choice Matrix',
        crt_of_cm: 'Correct Answer of Choice Matrix',
        def_of_cm: 'Default Answer of Choice Matrix',
        css_of_cm: 'CSS style of Choice Matrix',
        on_dbl_click: 'On Double Click',
        on_context: 'On Right Click',
        on_drag_start: 'On Drag Start',
        on_drag: 'On Drag',
        on_drag_end: 'On Drag End',
        on_drop: 'On Drop',
        on_mouse_over: 'On Mouse over',
        on_mouse_up : 'On Mouse Up',
        on_mouse_down: 'On Mouse Down',
        on_change: 'On Change',
        on_focus: 'On Focus',
        on_blur: 'On Blur',
        on_key_up: 'On Key Up',
        on_key_press: 'On Key Press',
        on_key_down: 'On Key Down',
        func_for: 'Function for ',
        old_xml: 'This is old version of XML<br/>If you edit this item it might not work in the Prepkit<br/>For further assistance, please contact New Editor Team.',
        base_steps: 'Base||Steps:',
        timestream: 'Timestream',
        edit_base: 'Base Settings',
        sample_img: 'Sample Image',
        module: 'Module',
        select_instruction: 'Select Module & Click List Contents button for finding all the guid. To select any guid click on the guid.',
        scene: 'Scene',
        intro: 'Intro',
        characters: 'Characters',
        assets: 'Assets',
        chat_windows: 'Chat Windows',
        mission: 'Mission',
        mission_name: 'Mission Name',
        communication: 'Communication',
        animation: 'Animation',
        click_to_select: 'Click to select the ',
        test: "Test",
        learn: "Learn",
        character_voice: 'Character Voice',
        male_one: 'Male 1',
        male_two: 'Male 2',
        male_three: 'Male 3',
        male_four: 'Male 4',
        male: 'Male',
        female: 'Female',
        female_one: 'Female 1',
        female_two: 'Female 2',
        female_three: 'Female 3',
        female_four: 'Female 4',
        female_five: 'Female 5',
        female_six: 'Female 6',
        visibility: 'Visibility',
        asset_visibility: 'Asset Visibility.',
        asset_animation: 'Asset animation.',
        tooltip: 'Tooltip',
        tooltip_txt: 'Tooltip Text',
        onclick_step: 'Onclick Step',
        points: 'Points',
        points_text: 'Provide points for the mission.',
        add_mission: 'Add Mission',
        choose_character: 'Choose character',
        not_visible: 'Not visible',
        voice: 'Voice',
        narrater_voice: 'Narrator Voice',
        conversion_type: 'Conversation Type',
        statement: 'Statement',
        choice: 'Choice',
        multichoice: 'Multi Choice',
        alert: 'Alert',
        autocomplete: 'Auto Complete',
        autocomplete_txt: 'After enabling this it will automatically switch to next step when the statement of this step will end.',
        image_size_txt: 'Select image size more then 256KB and in png format.',
        result_bg: 'Upload Background Image For Result',
        result_info: 'Image displayed on game result screen.',

        image_link: 'Image Link',
        score: 'Score',
        score_value: 'Score Value',
        speech: 'Speech',
        speech_txt: 'Enable speech convertor.',
        speech_input: "After enabling this user will be able to answer by speaking. This feature will work on ucertify.com only.",
        branch_condition: 'Branching Condition',
        no_anim_avail: 'No animation available',
        enter_choice_text: 'Enter Choice Text',
        choice_text: 'Choice Text',
        enter_choice_feedback: 'Enter Choice Feedback',
        feedback_text: 'Feedback text',
        fb_char_name: "Select the feedback character's name.",
        fb_char: 'Feedback Character',
        true: 'True',
        false: 'False',
        step_index: "Step Index",
        step_index_txt: 'Provide the step index to go to that step.',
        new_mission: 'Click to add a new mission.',
        add_choice: 'Add Choice',
        new_step: 'Click to add a new step.',
        add_anim : 'Add Animation',
        animation_play: 'Animation Play',
        dialog: 'Dialog',
        enter_result_title: 'Enter result title',
        result_title: 'Result title',
        result_btn_info: 'If you want to write the result title of your choice, write another title, otherwise skip this step.',
        one_option_correct: 'Only one option can be selected or marked as correct.',
        one_option_require: 'Please set one option as correct answer.',
        delete_textbox: 'Do you want to delete the text box?',
        delete_msg: 'Click the plotted points to delete them.',
        last_delete_msg: 'Click the last plotted point of the item to delete the item!',
        fill_field: 'Please fill out this field.',
        value_gt_zero: 'Value must be greater than 0.',
        enter_number: 'Please enter only number.',
        graph_width: 'Width of graph',
        graph_height: 'Height of graph',
        xaxis_value: 'X-axis value',
        yaxis_value: 'Y-axis value',
        anskey: 'anskey',
        reflection: 'reflection',
        curve_start_point: 'This is the start point of the curve so you cannot delete this point',
        warning_this_for: 'In this case this.for gets undefined and curve does not remove but xml of user answer updated. So prevented xml for being update.',
        last_point: 'You are trying to delete a polygon but either the polygon is not drawn completely or you are trying to delete the polygon by clicking the point, which is not the last point',
        insert_numeric_data: 'Insert numeric data',
        pointy2: 'Point Y2',
        pointx2: 'Point X2',
        pointx1: 'Point X1',
        pointy1: 'Point Y1',
        pointx: 'Point X ',
        pointy: 'Point Y ',
        select_choics: 'Select true or false to indicate if the choice correct or not.',
        select_game_mode: 'Select the game mode.',
        start_button: 'Start Button.',
        set_chr_visiblity: 'Set character visibility.',
        add_chr_nm: 'Provide a character name.',
        chr_voice: "Select the character's voice.",
        type_of_step: 'Select the type of this step',
        guid_value: 'Guid Value',
        value_gt_one: 'Value must be greater than or equals to 1',
        value_gt_interval: 'Value must be greater than interval',
        value_gt_min: 'Value must be greater than min',
        deprecated: 'Association Module is deprecated and will not work!',
        exhibit_err: 'Exhibit player does not support this format',
        open_modal: 'ADA button click to open modal box',
        val_gt_limit: 'Value must be greater than 599!',
        select_one_tool: 'Please select at least one tool.',
        delete_point_msg: '* To delete the points, right click on the points.',
        reset_module: 'Do you want reset the module?',
        ans_correct: "Your's answer is correct!",
        ans_incorrect: "Your's answer is incorrect!",
        shortcuts: 'Shortcuts',
        keys: 'Keys',
        ctrl_z: 'Ctrl + Z or Ctrl + fn + Z',
        undo: 'Undo',
        ctrl_x: 'Ctrl + X or Ctrl + fn + X',
        cut: 'Cut',
        ctrl_y: 'Ctrl + Y or Ctrl + fn + Y',
        redo: 'Redo',
        enter : 'Enter',
        enable_tool: 'Enable the Draw Tool',
        shift_enter: 'Shift + Enter',
        shift_arrow: 'Shift + arrow keys',
        start_stop_tool: 'Start/Stop Drawing by Drawing tool',
        compass_tools: 'Move the Compass components like Radius,center or its Angle / Move the Drawing point',
        locking: 'Shift + L',
        locking_txt: 'Lock the current Point when user is already pressed Enter on current Point',
        draw_key: 'D',
        draw_txt: 'When drawing by scribble tool by key events then fixed the path',
        tab: 'Tab',
        shift_tab: 'Shift + Tab',
        esc: 'Esc',
        focus_next: 'To move towards the next focus points',
        focus_prev: 'To move towards the previous focus points',
        exit_txt: 'To Exit this shortcut window',
        compass_center: 'Compass Center',
        shift_arrow_use : 'Use Shift and arrow keys to move the compass',
        compass_radius: 'Compass Radius, Your Current Radius is ',
        shift_arrow_radius: 'Use Shift and arrow keys to increase or decrease the radius.',
        compass_angle: 'Compass Angle, Your Current Angle is ',
        degree: ' degree',
        compass_draw: 'Compass Draw',
        shift_arrow_draw: ' Use Shift and arrow keys to draw throughout the circumference',
        shift_arrow_angle: 'Use Shift and arrow keys to increase or decrease the radius angle',
        reset_btn: 'Reset Button',
        marking_tools: 'Marking tools',
        removing_tools: 'Removing tools',
        drawing_tools: 'Drawing Tools Container',
        draw_tools: 'Draw tools',
        scribble_tool: 'Scribble tool', 
        line_tool: 'line tool',
        compass_tool: 'compass tool',
        line: 'Line',
        compass: 'Compass',
        scribble: 'Scribble',
        delete_tool: 'Delete tool',
        clear_screen: 'Clear Screen',
        mark_finish_point: 'Mark/Finish Points',
        mark_ans_point: 'Mark/Finish Answer Points',
        mark_pnt: 'Mark Points',
        delete_points: 'Do you want to delete the points?',
        answer_point: 'Answer Points',
        add_show_point: 'Add/Show Point',
        add_finish_point: 'Add/Finish Focus Point',
        add_focus_pnt: 'Add Focus Point',
        def_mode: 'Default Mode',
        access_mode: 'Accessibility Mode',
        configuration: 'Configuration',
        alt_txt_image: 'Alt Text of Image',
        draw_color: 'Drawing Color',
        itemtype_0 : "This task contains the radio buttons and checkboxes for options. The shortcut keys to perform this task are A to H and alt+1 to alt+9.",
        itemtype_1 : "To perform the given task, you have to select an item from one side and place it in front of its correct item on the other side. The shortcut keys to perform this task are Press the Alt+down arrow key to activate. Press the arrow key to navigate through all the items. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove any navigated item, then selected that item and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_4 : "In this type of question, you have to point out the specific area asked in the question. The shortcut keys to perform this task are. The Alt+down arrow key to activate the target. The arrow key to move the target.",
        itemtype_6 : "Here, you have to select the options given in the list. The shortcut keys to perform this task are. The Alt+down arrow key to activate the answer area.  Use the arrow key for navigation. Press the Enter key to select the item. Again, press the Enter key to deselect the item.",
        itemtype_7 : "Here, you have to arrange the options given in the list into their correct order. The shortcut keys to perform this task are. Press the Alt+down arrow key to activate the answer area. Navigate to the item using the arrow key. Press the Enter key to copy the item. Navigate the copied item to the desired position using the arrow keys. Press the Enter key to paste the item. If the item is at its correct position, just press the Enter key to keep that item in sequence. If you want to remove the item from its position, press the Delete key for Windows and the Fn+Delete key for Mac.",
        itemtype_9 : "Here, this type of question contains the select box, text box, and drag and drop boxes. The shortcut keys to perform this task are. Press the Alt+down arrow key to activate the target. Press the arrow key to navigate through all the items. If the selected item is a text box or a select box, it will automatically get focused. If you want to drop the item in the droppable field, navigate to any of the draggable using the Tab key, and press the Enter key to copy the draggable, Now, navigate to any of the droppable field and press the Enter key to drop the copied item. If you want to remove the item from the droppable field, navigate to the droppable field and press the Delete key for Windows and the Fn+Delete key to remove the item.",
        itemtype_14 : "Here, in this type of question, you have to match the item on the left with the correct item on the right by selecting and placing the item to its correct answer. Shortcut key to perform this task are. Press the Alt+down arrow key to activate the target. Press the arrow key to navigate through all the item. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove the item, navigate to any of the left side items and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_26 : "To perform the given task, you have to select and place it in correct item on the. The shortcut keys to perform this task are Press the Alt+down arrow key to activate. Press the arrow key to navigate through all the items. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove any navigated item, then selected that item and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_30 : "Here, in this type of questions, you have to access the range. you can use left arrow key for decreasing the value and right for increasing the value.",
        itemtype_17 : "Here, you have to select the options given in the list. The shortcut keys to perform this task are: Press the tab for navigation. Press the Enter key to select the item and move using the tab key. Again, press the Enter key to deselect the item and place it on the correct option.",
        itemtype_27 : "Here, in this type of questions, you have to identify the correct and incorrect statements by checking the True or False check boxes. The shortcut key to perform the task are. Press Tab for navigation. Press the Enter key for selecting the check box.",
        itemtype_15 : "To perform the given task, you have to select an item from one side and place it in front of its correct item on the other side. The shortcut keys to perform this task are Press the Alt+down arrow key to activate. Press the arrow key to navigate through all the items. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove any navigated item, then selected that item and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_13 : "Here, this type of question contains the terminal. You have to write command to perform this task.",
        itemtype_22 : "Here, this type of question contains the cisco terminal. You have to write command to perform this task.",
        es6_warining: "You are using Internet Explorer, ES6 functionality of javascript will not work!",
        embed_content: "Embed Content",
        plus_minus_option: "Please select the plus and minus option",
        slash_option: 'Please select the slash option',
        decimal_option: 'Please select the decimal option',
    };

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
        const transform = (0, eval)(el.dataset.transform) || option.transform || defaultTransform;
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

    var tagViewCss = { style: `.tagin{display:none}.tagin-wrapper{border: 1px solid #ccc;display:flex;flex-wrap:wrap;height:auto;padding:calc(.375rem - 2px) calc(.75rem - 2px);position:relative;overflow:hidden;cursor:text}.tagin-wrapper.focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.tagin.is-valid+.tagin-wrapper,.was-validated .tagin:valid+.tagin-wrapper{border-color:#28a745}.tagin.is-invalid+.tagin-wrapper,.was-validated .tagin:invalid+.tagin-wrapper{border-color:#dc3545}.tagin-tag{border-radius:.25rem;color:#fff;border:0;padding:0 4px;display:inline-flex;align-items:center;height:24px;margin:2px;font-weight:300;background-color:#6c757d;transition:transform .1s}.tagin-tag-remove{margin-left:2px;width:18px;height:18px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-tag-remove:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-input{margin-left:2px;border-color:transparent;outline:0;border-width:1px 0;padding:0 2px 0 0;height:28px;color:#495057}.tagin-input:not(.tagin-input-hidden){width:4px;min-width:4px}.tagin-input-hidden{position:absolute;top:0;left:-9999px;overflow:hidden;visibility:hidden;white-space:nowrap` };

    class API {
        constructor(options) {
            this._servers = [
                'http://localhost/pe-gold3/', 
                'https://www.ucertify.com/', 
                'https://www.jigyaasa.info/',
                'http://172.10.195.203/pe-gold3/',
            ];
            this._REMOTE_API_URL = this._servers[1] + 'pe-api/1/index.php';
            //@Prabhat: Why is this here. Need to remove this.
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
            this.bsCat1 = ['Modal', 'Tooltip', 'Collapse', 'Popover', 'ScrollSpy', 'Tab', 'Alert', 'Dropdown'];
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
                options ? TagView(el, options) : TagView(el);
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
                let isIns = bootstrap[comp].getInstance && bootstrap[comp].getInstance(selected); // changes for php.
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
                        return new bootstrap[comp](triggerElm);
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
        initDropdown() { // Hide the dropdown click outside, when dropdown is appended in dom using ajax call.
            let _this= this;
            _this.enableBsAll('[data-toggle="dropdown"]', 'Dropdown');
            _this.bind('body', 'click', function(event) {
                if (!event.target.closest('[data-toggle="dropdown"]')) {
                    _this.selectAll('[data-toggle="dropdown"]').forEach(function(currElem) {
                        currElem.classList.remove('show');
                    });
                    _this.selectAll('.dropdown-menu').forEach(function(currElem) {
                        currElem.classList.remove('show');
                    });
                }
            });
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
                if (Array.isArray(jsonArray)) {
                    for (let i = 0; i < jsonArray.length; i++) {
                        for (let key in jsonArray[i]) {
                            formData.append(`${prop}[${i}][${key}]`, jsonArray[i][key]);
                        }
                    }
                } else {
                    for (var key in jsonArray) {
                        formData.append(`${prop}[${key}]`, jsonArray[key]);
                    }
                }
            } catch(error) {
                console.warn("Please provide valid JSON Object in ajax data."+ error);
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
                    case 'all' : return base?.querySelectorAll(target);
                    case 'child' : return base?.querySelector(target).childNodes;
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
            let selected = this.isExtraSelectors(action, actionData) ? this.selectAction(selector, action) : (typeof selector == 'object' ? selector : document.querySelectorAll(selector));
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
            let base = (typeof baseSelector == "object") ? baseSelector : (typeof document !== 'undefined' ? document.querySelector(baseSelector) : false);
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
            if (selected && selected?.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action: 'removeClass', actionData: name}));
            } else if (typeof selected == 'object') {
                this.jsAction(selected, {action: 'removeClass', actionData: name});
            }
            return selected || {};
        }
        // add class for node
        addClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected?.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action: 'addClass', actionData: name}));
            } else if (typeof selected == 'object') {
                this.jsAction(selected, {action: 'addClass', actionData: name});
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
            if (key == 'save_item') {
                this.addInLocalstorage(key, value);
            }
            if (typeof globalThis == 'object') globalThis.JUITemp[key] = value;
        }
        
        addInLocalstorage(key, value) {
            window.localStorage.setItem(key, value);
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
                this.insert(document.body, this.getModalHtml(msg, 'Alert'), 'beforebegin');
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

        formatXml(xml, cdata_format) {
            let cdata = cdata_format || false;
            let reg = /(>)(<)(\/*)/g;
            let wsexp = / *(.*) +\n/g;
            let contexp = /(<.+>)(.+\n)/g;
            let old_cdata = cdata ? xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim) : "";
            xml = xml.replace(/\t/g, '').replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
            if (cdata) {
                let new_cdata = xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim);
                xml = xml.replace(new_cdata, old_cdata);
            }
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
                    if (fromTo == 'opening->closing')
                        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
                    else
                        formatted += padding + ln + '\n';
                }
            }
            return formatted;
        }

        getModalHtml(data, type) {
            switch(type) {
                case 'Alert' : 
                    return (`
                    <div id="showMsgAlert" class="alert alert-warning alert-dismissible text-center fade show" role="alert" style="z-index:99999;min-height:50px;position:fixed;width:100%;">
                        <span id="showMsgBody">${data}</span>
                        <button type="button" class="btn-close" style="margin-top: -3px;" data-bs-dismiss="alert" data-dismiss="alert"  aria-label="Close"></button>
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
                                    <button type="button" class="btn bg-light m-auto text-dark border border-secondary" data-bs-dismiss="modal" data-dismiss="modal">OK</button>
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
            if (selected instanceof HTMLElement || selected instanceof Node) {
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
        
        slideUp (target, duration = 500) {
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.boxSizing = 'border-box';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout( () => {
                target.style.display = 'none';
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
            }, duration);
        }

        slideDown (target, duration = 500) {
            target.style.removeProperty('display');
            let display = window.getComputedStyle(target).display;
            if (display === 'none') display = 'block';
            target.style.display = display;
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.boxSizing = 'border-box';
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout( () => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
            }, duration);
        }

        slideToggle (target, duration = 500) {
            if (window.getComputedStyle(target).display === 'none') {
                return this.slideDown(target, duration);
            } else {
                return this.slideUp(target, duration);
            }
        }

        setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    } 

    const JS = new JUI();

    /* helper/HelperAI.svelte generated by Svelte v3.34.0 */

    function onUserAnsChange(result) {
    	if (result) {
    		AH.select("#answer", "checked", result.ans ? true : false);
    		AH.select("#special_module_user_xml", "value", result.uXml);

    		if (typeof window == "object") {
    			window.ISSPECIALMODULEUSERXMLCHANGE = 1;

    			if (typeof calculatePoint != "undefined") {
    				calculatePoint(result.correctPoints || 1, result.ansPoint || result.ans);
    			}
    		}

    		globalThis.saveUserAnswerInSapper?.(result);
    	}
    }

    const AH = new JUI();
    const SSD = new JStore();

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ".CodeMirror{font-family:\"Courier New\", Courier, monospace;font-size: 17px;height:100%;color:#000;direction:ltr}.CodeMirror-lines{padding:4px 0}.CodeMirror pre{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #fff;background-color:#fff;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;white-space:nowrap}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror-cursor{border-left:1px solid #000;border-right:none;width:0}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.cm-fat-cursor .CodeMirror-cursor{width:auto;border:0!important;background:#7e7}.cm-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-fat-cursor-mark{background-color:rgba(20,255,20,.5);-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite}.cm-animate-fat-cursor{width:auto;border:0;-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite;background-color:#7e7}@-moz-keyframes blink{50%{background-color:transparent}}@-webkit-keyframes blink{50%{background-color:transparent}}@keyframes blink{50%{background-color:transparent}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-rulers{position:absolute;left:0;right:0;top:-50px;bottom:-20px;overflow:hidden}.CodeMirror-ruler{border-left:1px solid #ccc;top:0;bottom:0;position:absolute}.cm-s-default .cm-header{color:#00f}.cm-s-default .cm-quote{color:#090}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-type,.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:rgb(76, 136, 107)}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-invalidchar,.cm-s-default .cm-error{color:red}.CodeMirror-composing{border-bottom:2px solid}div.CodeMirror span.CodeMirror-matchingbracket{color:#0b0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#a22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#ebf4f7}.CodeMirror{position:relative;overflow:hidden;background:#fff}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:0;position:relative}.CodeMirror-sizer{position:relative;border-right:30px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-30px}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:0 0!important;border:none!important}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-gutter-wrapper ::selection{background-color:transparent}.CodeMirror-gutter-wrapper ::-moz-selection{background-color:transparent}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre{-moz-border-radius:0;-webkit-border-radius:0;border-radius:0;border-width:0;background:0 0;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:inherit;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;-webkit-font-variant-ligatures:contextual;font-variant-ligatures:contextual}.CodeMirror-wrap pre{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;padding:.1px}.CodeMirror-rtl pre{direction:rtl}.CodeMirror-code{outline:0}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors,div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:#d7d4f0}.CodeMirror-line::-moz-selection,.CodeMirror-line>span::-moz-selection,.CodeMirror-line>span>span::-moz-selection{background:#d7d4f0}.cm-searching{background-color:#ffa;background-color:rgba(255,255,0,.4)}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:''}span.CodeMirror-selectedtext{background:0 0}\n#sampleInput,.output_div .compilerPre {font-family:\"Courier New\", Courier, monospace;font-size: 17px!important;}\n.EvalbgBlue {\n  height: 200px;\n}\n.Evalloader {\n  color: #4684ee;\n  text-align: center;\n  font-family: Consolas, Menlo, Monaco, monospace;\n  font-weight: bold;\n  font-size: 10vh;\n  opacity: 0.8;\n}\n.Evalloader span {\n  display: inline-block;\n  animation: pulse 0.4s alternate infinite ease-in-out;\n}\n.Evalloader span:nth-child(odd) {\n  animation-delay: 0.4s;\n}\n.v-bottom {\n  vertical-align: bottom;\n}\n@keyframes pulse {\n  to {\n    transform: scale(0.8);\n    opacity: 0.5;\n  }\n}\n\n.vsplitter {\n  background: linear-gradient(90deg, rgb(246, 236, 236), rgb(229, 223, 223), rgb(180, 180, 180));\n}\n.CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\n  background: #d5eaef;\n}\n.bg-light .CodeMirror-activeline-background {\n  background: #ebebeb !important;\n}\n.bg-light .CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\n  background: #fff !important;\n}\n.bg-light .CodeMirror-line {\n  cursor: not-allowed;\n}\n.cm-s-monokai .CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\n  background: #5c5d5b !important;\n}\n.cm-s-monokai .bg-light,\n.cm-s-monokai .bg-light .CodeMirror-activeline-background {\n  background: #5f5b5b !important;\n}\n.cm-s-monokai .bg-light .CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\n  background: #272822 !important;\n}\n.evalpro_module .CodeMirror {\n  border: none;\n}";
    styleInject(css_248z);

    var css_248z$1 = "/* Based on Sublime Text's Monokai theme */\n\n.cm-s-monokai.CodeMirror { \n  background: #272822; \n  color: #f8f8f2; \n}\n.cm-s-monokai div.CodeMirror-selected { \n  background: #49483E; \n}\n.cm-s-monokai .CodeMirror-line::selection, .cm-s-monokai .CodeMirror-line > span::selection, .cm-s-monokai .CodeMirror-line > span > span::selection { background: rgba(73, 72, 62, .99); }\n.cm-s-monokai .CodeMirror-line::-moz-selection, .cm-s-monokai .CodeMirror-line > span::-moz-selection, .cm-s-monokai .CodeMirror-line > span > span::-moz-selection { background: rgba(73, 72, 62, .99); }\n.cm-s-monokai .CodeMirror-gutters { background: #272822; border-right: 0px; }\n.cm-s-monokai .CodeMirror-guttermarker { color: white; }\n.cm-s-monokai .CodeMirror-guttermarker-subtle { color: #d0d0d0; }\n.cm-s-monokai .CodeMirror-linenumber { color: #d0d0d0; }\n.cm-s-monokai .CodeMirror-cursor { border-left: 1px solid #f8f8f0; }\n\n.cm-s-monokai span.cm-comment { color: #dedcd5; }\n.cm-s-monokai span.cm-atom { color: #ae81ff; }\n.cm-s-monokai span.cm-number { color: #ae81ff; }\n\n.cm-s-monokai span.cm-property, .cm-s-monokai span.cm-attribute { color: #a6e22e; }\n.cm-s-monokai span.cm-keyword { color: #f92672; }\n.cm-s-monokai span.cm-builtin { color: #66d9ef; }\n.cm-s-monokai span.cm-string { color: #e6db74; }\n\n.cm-s-monokai span.cm-variable { color: #f8f8f2; }\n.cm-s-monokai span.cm-variable-2 { color: #9effff; }\n.cm-s-monokai span.cm-variable-3, .cm-s-monokai span.cm-type { color: #66d9ef; }\n.cm-s-monokai span.cm-def { color: #fd971f; }\n.cm-s-monokai span.cm-bracket { color: #f8f8f2; }\n.cm-s-monokai span.cm-tag { color: #f92672; }\n.cm-s-monokai span.cm-header { color: #ae81ff; }\n.cm-s-monokai span.cm-link { color: #ae81ff; }\n.cm-s-monokai span.cm-error { background: #f92672; color: #f8f8f0; }\n\n.cm-s-monokai .CodeMirror-activeline-background { background: #373831; }\n.cm-s-monokai .CodeMirror-matchingbracket {\n  text-decoration: underline;\n  color: white !important;\n}\n";
    styleInject(css_248z$1);

    var css_248z$2 = ".CodeMirror-simplescroll-horizontal div,.CodeMirror-simplescroll-vertical div {\n  position: absolute;\n  background: #ccc;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  border: 1px solid #bbb;\n  border-radius: 2px;\n}\n\n.CodeMirror-simplescroll-horizontal, .CodeMirror-simplescroll-vertical {\n  position: absolute;\n  z-index: 6;\n  background: #eee;\n}\n\n.CodeMirror-simplescroll-horizontal {\n  bottom: 0; left: 0;\n  height: 8px;\n}\n.CodeMirror-simplescroll-horizontal div {\n  bottom: 0;\n  height: 100%;\n}\n\n.CodeMirror-simplescroll-vertical {\n  right: 0; top: 0;\n  width: 8px;\n}\n.CodeMirror-simplescroll-vertical div {\n  right: 0;\n  width: 100%;\n}\n\n\n.CodeMirror-overlayscroll .CodeMirror-scrollbar-filler, .CodeMirror-overlayscroll .CodeMirror-gutter-filler {\n  display: none;\n}\n\n.CodeMirror-overlayscroll-horizontal div, .CodeMirror-overlayscroll-vertical div {\n  position: absolute;\n  background: #bcd;\n  border-radius: 3px;\n}\n\n.CodeMirror-overlayscroll-horizontal, .CodeMirror-overlayscroll-vertical {\n  position: absolute;\n  z-index: 6;\n}\n\n.CodeMirror-overlayscroll-horizontal {\n  bottom: 0; left: 0;\n  height: 6px;\n}\n.CodeMirror-overlayscroll-horizontal div {\n  bottom: 0;\n  height: 100%;\n}\n\n.CodeMirror-overlayscroll-vertical {\n  right: 0; top: 0;\n  width: 6px;\n}\n.CodeMirror-overlayscroll-vertical div {\n  right: 0;\n  width: 100%;\n}";
    styleInject(css_248z$2);

    var css_248z$3 = ".splitter_panel {\n  position: relative;\n}\n.splitter_panel .vsplitter {\n    background-color: grey;\n    cursor: col-resize;\n    z-index: 10;\n    width: 7px;\n}\n\n.splitter_panel .hsplitter {\n    background-color: #5F5F5F;\n    cursor: row-resize;\n    z-index: 98;\n    height: 7px;\n}\n.splitter_panel .vsplitter.splitter-invisible,\n.splitter_panel .hsplitter.splitter-invisible {\n    background: none;\n}\n.splitter_panel .vsplitter, .splitter_panel .left_panel, .splitter_panel .right_panel,\n.splitter_panel .hsplitter, .splitter_panel .top_panel, .splitter_panel .bottom_panel {\n    position: absolute;\n    overflow: auto;\n}\n.splitter_panel .vsplitter, .splitter_panel .left_panel, .splitter_panel .right_panel {\n  height: 100%;\n}\n.splitter_panel .hsplitter, .splitter_panel .top_panel, .splitter_panel .bottom_panel {\n  width: 100%;\n}\n.splitter_panel .top_panel, .splitter_panel .left_panel, .splitter_panel .vsplitter {\n   top: 0;\n}\n.splitter_panel .top_panel, .splitter_panel .bottom_panel, .splitter_panel .left_panel, .splitter_panel .hsplitter {\n   left: 0;\n}\n.splitter_panel .bottom_panel {\n   bottom: 0;\n}\n.splitter_panel .right_panel {\n   right: 0;\n}\n.splitterMask {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 1000;\n}";
    styleInject(css_248z$3);

    /* clsSMWeb/WebPreview.svelte generated by Svelte v3.34.0 */

    const { console: console_1$1, document: document_1$1 } = globals;
    const file$6 = "clsSMWeb/WebPreview.svelte";

    function add_css$6() {
    	var style = element("style");
    	style.id = "svelte-gqd0n6-style";
    	style.textContent = ".height44{height:44px}.cancel_btn_pop{background-color:lightgray!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViUHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBMHdEWSxTQUFTLEFBQUcsQ0FBQSxBQUNoQixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ1EsZUFBZSxBQUFFLENBQUEsQUFDckIsZ0JBQWdCLENBQUUsU0FBUyxVQUFVLEFBQ3pDLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiV2ViUHJldmlldy5zdmVsdGUiXX0= */";
    	append_dev(document_1$1.head, style);
    }

    // (1628:4) {#if window.isIE || window.isIEEleven}
    function create_if_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${l.es6_warining}`;
    			attr_dev(div, "class", "alert alert-danger");
    			add_location(div, file$6, 1628, 8, 85571);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1628:4) {#if window.isIE || window.isIEEleven}",
    		ctx
    	});

    	return block;
    }

    // (1705:8) {:else}
    function create_else_block$1(ctx) {
    	let div22;
    	let div21;
    	let div4;
    	let div0;
    	let span0;
    	let span1;
    	let t1;
    	let div3;
    	let div1;
    	let button0;
    	let t3;
    	let div2;
    	let button1;
    	let span2;
    	let t4;
    	let ul;
    	let li;
    	let label;
    	let input;
    	let input_checked_value;
    	let t5;
    	let span3;
    	let t6_value = (/*state*/ ctx[0].goDark ? l.normal_mode : l.dark_mode) + "";
    	let t6;
    	let t7;
    	let div20;
    	let div15;
    	let div14;
    	let div7;
    	let div5;
    	let span4;
    	let t9;
    	let div6;
    	let textarea0;
    	let div6_style_value;
    	let t10;
    	let div10;
    	let div8;
    	let span5;
    	let t12;
    	let div9;
    	let textarea1;
    	let div9_style_value;
    	let t13;
    	let div13;
    	let div11;
    	let span6;
    	let t15;
    	let div12;
    	let textarea2;
    	let div12_style_value;
    	let t16;
    	let div19;
    	let div18;
    	let div16;
    	let span7;
    	let t18;
    	let div17;
    	let div17_style_value;
    	let div19_style_value;
    	let div20_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div22 = element("div");
    			div21 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span1 = element("span");
    			span1.textContent = `${l.html_css_js}`;
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = `${l.run}`;
    			t3 = space();
    			div2 = element("div");
    			button1 = element("button");
    			span2 = element("span");
    			t4 = space();
    			ul = element("ul");
    			li = element("li");
    			label = element("label");
    			input = element("input");
    			t5 = space();
    			span3 = element("span");
    			t6 = text(t6_value);
    			t7 = space();
    			div20 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			span4 = element("span");
    			span4.textContent = `${l.html}`;
    			t9 = space();
    			div6 = element("div");
    			textarea0 = element("textarea");
    			t10 = space();
    			div10 = element("div");
    			div8 = element("div");
    			span5 = element("span");
    			span5.textContent = `${l.css}`;
    			t12 = space();
    			div9 = element("div");
    			textarea1 = element("textarea");
    			t13 = space();
    			div13 = element("div");
    			div11 = element("div");
    			span6 = element("span");
    			span6.textContent = `${l.js}`;
    			t15 = space();
    			div12 = element("div");
    			textarea2 = element("textarea");
    			t16 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div16 = element("div");
    			span7 = element("span");
    			span7.textContent = `${l.result}`;
    			t18 = space();
    			div17 = element("div");
    			attr_dev(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
    			add_location(span0, file$6, 1709, 24, 90526);
    			attr_dev(span1, "class", "align-middle");
    			add_location(span1, file$6, 1709, 86, 90588);
    			attr_dev(div0, "class", "mt-2 pt-1 pl-2 float-left");
    			add_location(div0, file$6, 1708, 20, 90462);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary runcode_btn ml mt-1");
    			add_location(button0, file$6, 1713, 28, 90796);
    			attr_dev(div1, "class", "inline-block pull-right");
    			add_location(div1, file$6, 1712, 24, 90730);
    			attr_dev(span2, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
    			attr_dev(span2, "id", "dropdownMenuButton1");
    			add_location(span2, file$6, 1716, 131, 91111);
    			attr_dev(button1, "class", "btn border-0 px-0 ml-2 mr-2");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-bs-toggle", "dropdown");
    			attr_dev(button1, "data-toggle", "dropdown");
    			add_location(button1, file$6, 1716, 24, 91004);
    			attr_dev(input, "type", "checkbox");
    			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
    			attr_dev(input, "id", "goDark");
    			attr_dev(input, "class", "transparent h");
    			add_location(input, file$6, 1720, 36, 91504);
    			add_location(span3, file$6, 1721, 36, 91646);
    			attr_dev(label, "for", "goDark");
    			attr_dev(label, "class", "dropdown-item mb-0 pointer");
    			add_location(label, file$6, 1719, 32, 91412);
    			add_location(li, file$6, 1718, 28, 91375);
    			attr_dev(ul, "class", "dropdown-menu dropdown-menu-right");
    			attr_dev(ul, "x-placement", "bottom-end");
    			attr_dev(ul, "aria-labelledby", "dropdownMenuButton1");
    			add_location(ul, file$6, 1717, 24, 91237);
    			attr_dev(div2, "class", "float-right mt-2");
    			add_location(div2, file$6, 1715, 20, 90949);
    			attr_dev(div3, "class", "d-flex");
    			add_location(div3, file$6, 1711, 20, 90685);
    			attr_dev(div4, "id", "web_toolbar");
    			attr_dev(div4, "class", "bg-light w-100 height44 web_toolbar text-dark d-flex justify-content-between");
    			add_location(div4, file$6, 1707, 16, 90334);
    			add_location(span4, file$6, 1733, 36, 92274);
    			attr_dev(div5, "class", "card-header rounded-0");
    			add_location(div5, file$6, 1732, 32, 92202);
    			attr_dev(textarea0, "name", "html");
    			attr_dev(textarea0, "id", "html_editor");
    			add_location(textarea0, file$6, 1736, 36, 92491);
    			attr_dev(div6, "id", "html");
    			attr_dev(div6, "class", "card-body code_box content-div m-0 p-0");
    			attr_dev(div6, "style", div6_style_value = "height: 347px ");
    			add_location(div6, file$6, 1735, 32, 92367);
    			attr_dev(div7, "id", "html_panel");
    			attr_dev(div7, "class", "card m-0 p-0 rounded-0");
    			add_location(div7, file$6, 1731, 28, 92117);
    			add_location(span5, file$6, 1741, 36, 92800);
    			attr_dev(div8, "class", "card-header rounded-0");
    			add_location(div8, file$6, 1740, 32, 92728);
    			attr_dev(textarea1, "name", "css");
    			attr_dev(textarea1, "id", "css_editor");
    			add_location(textarea1, file$6, 1744, 36, 93015);
    			attr_dev(div9, "id", "css");
    			attr_dev(div9, "class", "card-body code_box content-div m-0 p-0");
    			attr_dev(div9, "style", div9_style_value = "height: 347px");
    			add_location(div9, file$6, 1743, 32, 92892);
    			attr_dev(div10, "id", "css_panel");
    			attr_dev(div10, "class", "card m-0 p-0 rounded-0");
    			add_location(div10, file$6, 1739, 28, 92644);
    			add_location(span6, file$6, 1749, 36, 93321);
    			attr_dev(div11, "class", "card-header rounded-0");
    			add_location(div11, file$6, 1748, 32, 93249);
    			attr_dev(textarea2, "name", "js");
    			attr_dev(textarea2, "id", "js_editor");
    			add_location(textarea2, file$6, 1752, 36, 93534);
    			attr_dev(div12, "id", "js");
    			attr_dev(div12, "class", "card-body code_box content-div m-0 p-0");
    			attr_dev(div12, "style", div12_style_value = "height: 347px ");
    			add_location(div12, file$6, 1751, 32, 93412);
    			attr_dev(div13, "id", "js_panel");
    			attr_dev(div13, "class", "card m-0 p-0 rounded-0");
    			add_location(div13, file$6, 1747, 28, 93166);
    			attr_dev(div14, "id", "firstEditorDiv");
    			set_style(div14, "display", "flex");
    			add_location(div14, file$6, 1730, 24, 92041);
    			attr_dev(div15, "id", "top_content");
    			add_location(div15, file$6, 1729, 20, 91994);
    			add_location(span7, file$6, 1760, 32, 93938);
    			attr_dev(div16, "class", "card-header rounded-0");
    			add_location(div16, file$6, 1759, 28, 93870);
    			attr_dev(div17, "id", "result_div");
    			attr_dev(div17, "style", div17_style_value = "height: 347px");
    			attr_dev(div17, "class", "card-body content-div m-0 p-0 rounded-0");
    			add_location(div17, file$6, 1762, 28, 94025);
    			attr_dev(div18, "class", "card rounded-0 nm");
    			add_location(div18, file$6, 1758, 24, 93810);
    			attr_dev(div19, "id", "bottom_content");
    			attr_dev(div19, "style", div19_style_value = "overflow: hidden");
    			add_location(div19, file$6, 1757, 20, 93733);
    			attr_dev(div20, "id", "accordion");
    			attr_dev(div20, "style", div20_style_value = "width:100%; background:white; padding:0px;");
    			add_location(div20, file$6, 1728, 16, 91900);
    			attr_dev(div21, "class", "row");
    			add_location(div21, file$6, 1706, 12, 90300);
    			attr_dev(div22, "class", "container-fluid");
    			add_location(div22, file$6, 1705, 8, 90258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div22, anchor);
    			append_dev(div22, div21);
    			append_dev(div21, div4);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div0, span1);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			append_dev(button1, span2);
    			append_dev(div2, t4);
    			append_dev(div2, ul);
    			append_dev(ul, li);
    			append_dev(li, label);
    			append_dev(label, input);
    			append_dev(label, t5);
    			append_dev(label, span3);
    			append_dev(span3, t6);
    			append_dev(div21, t7);
    			append_dev(div21, div20);
    			append_dev(div20, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div7);
    			append_dev(div7, div5);
    			append_dev(div5, span4);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, textarea0);
    			append_dev(div14, t10);
    			append_dev(div14, div10);
    			append_dev(div10, div8);
    			append_dev(div8, span5);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div9, textarea1);
    			append_dev(div14, t13);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div11, span6);
    			append_dev(div13, t15);
    			append_dev(div13, div12);
    			append_dev(div12, textarea2);
    			append_dev(div20, t16);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div16);
    			append_dev(div16, span7);
    			append_dev(div18, t18);
    			append_dev(div18, div17);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*runCode*/ ctx[4], false, false, false),
    					listen_dev(input, "click", /*changeTheme*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0].goDark)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty[0] & /*state*/ 1 && t6_value !== (t6_value = (/*state*/ ctx[0].goDark ? l.normal_mode : l.dark_mode) + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div22);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(1705:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1636:4) {#if window.inNative }
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
    	let span2;
    	let t2;
    	let ul0;
    	let li0;
    	let label;
    	let input;
    	let input_checked_value;
    	let t3;
    	let span3;
    	let t4_value = (/*state*/ ctx[0].goDark ? l.normal_mode : l.dark_mode) + "";
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
    	let div8;
    	let div5;
    	let div4;
    	let textarea0;
    	let div4_style_value;
    	let t15;
    	let div7;
    	let div6;
    	let textarea1;
    	let div6_style_value;
    	let t16;
    	let div11;
    	let div10;
    	let div9;
    	let textarea2;
    	let div9_style_value;
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

    	const block = {
    		c: function create() {
    			div19 = element("div");
    			div18 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span1 = element("span");
    			span1.textContent = `${l.html_css_js}`;
    			t1 = space();
    			div1 = element("div");
    			button0 = element("button");
    			span2 = element("span");
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
    			t6 = text("x`\n                        ");
    			button1 = element("button");
    			button1.textContent = `${l.run}`;
    			t8 = space();
    			div17 = element("div");
    			ul1 = element("ul");
    			li1 = element("li");
    			a0 = element("a");
    			a0.textContent = `${l.html}`;
    			t10 = space();
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = `${l.css}`;
    			t12 = space();
    			li3 = element("li");
    			a2 = element("a");
    			a2.textContent = `${l.js}`;
    			t14 = space();
    			div12 = element("div");
    			div8 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			textarea0 = element("textarea");
    			t15 = space();
    			div7 = element("div");
    			div6 = element("div");
    			textarea1 = element("textarea");
    			t16 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			textarea2 = element("textarea");
    			t17 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div13 = element("div");
    			span4 = element("span");
    			span4.textContent = `${l.result}`;
    			t19 = space();
    			div14 = element("div");
    			attr_dev(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
    			add_location(span0, file$6, 1640, 24, 86170);
    			attr_dev(span1, "class", "align-middle");
    			add_location(span1, file$6, 1640, 86, 86232);
    			attr_dev(div0, "class", "mt-2 pt pl-3 float-left");
    			add_location(div0, file$6, 1639, 20, 86108);
    			attr_dev(span2, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
    			add_location(span2, file$6, 1643, 130, 86495);
    			attr_dev(button0, "class", "btn border-0 px-0 ml-2 mr-2");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-toggle", "dropdown");
    			attr_dev(button0, "id", "dropdownMenuButton1");
    			add_location(button0, file$6, 1643, 24, 86389);
    			attr_dev(input, "type", "checkbox");
    			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
    			attr_dev(input, "id", "goDark");
    			attr_dev(input, "class", "position-absolute bg-transparent");
    			add_location(input, file$6, 1647, 36, 86863);
    			add_location(span3, file$6, 1648, 36, 87024);
    			attr_dev(label, "for", "goDark");
    			attr_dev(label, "class", "dropdown-item mb-0 pointer");
    			add_location(label, file$6, 1646, 32, 86771);
    			add_location(li0, file$6, 1645, 28, 86734);
    			attr_dev(ul0, "class", "dropdown-menu dropdown-menu-right");
    			attr_dev(ul0, "x-placement", "bottom-end");
    			attr_dev(ul0, "aria-labelledby", "dropdownMenuButton1");
    			add_location(ul0, file$6, 1644, 24, 86596);
    			attr_dev(div1, "class", "float-right mt-2 mr-2");
    			add_location(div1, file$6, 1642, 20, 86329);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary runcode_btn ml");
    			add_location(button1, file$6, 1654, 24, 87300);
    			attr_dev(div2, "class", "inline-block pull-right");
    			add_location(div2, file$6, 1653, 20, 87236);
    			attr_dev(div3, "id", "web_toolbar");
    			attr_dev(div3, "class", "bg-gray height44 web_toolbar text-dark");
    			add_location(div3, file$6, 1638, 16, 86018);
    			attr_dev(a0, "class", "nav-link active text-white");
    			attr_dev(a0, "href", "#html_panel");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "data-toggle", "tab");
    			add_location(a0, file$6, 1660, 28, 87693);
    			attr_dev(li1, "class", "nav-item");
    			attr_dev(li1, "id", "html_pane");
    			add_location(li1, file$6, 1659, 24, 87628);
    			attr_dev(a1, "class", "nav-link text-white");
    			attr_dev(a1, "href", "#css_panel");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "data-toggle", "tab");
    			add_location(a1, file$6, 1663, 28, 87910);
    			attr_dev(li2, "class", "nav-item");
    			attr_dev(li2, "id", "css_pane");
    			add_location(li2, file$6, 1662, 24, 87846);
    			attr_dev(a2, "class", "nav-link text-white");
    			attr_dev(a2, "href", "#js_panel");
    			attr_dev(a2, "role", "tab");
    			attr_dev(a2, "data-toggle", "tab");
    			add_location(a2, file$6, 1666, 28, 88117);
    			attr_dev(li3, "class", "nav-item");
    			attr_dev(li3, "id", "js_pane");
    			add_location(li3, file$6, 1665, 24, 88054);
    			attr_dev(ul1, "class", "nav nav-pills nav-fill");
    			attr_dev(ul1, "role", "tablist");
    			add_location(ul1, file$6, 1658, 20, 87553);
    			attr_dev(textarea0, "name", "html");
    			attr_dev(textarea0, "id", "html_editor");
    			add_location(textarea0, file$6, 1673, 36, 88648);
    			attr_dev(div4, "id", "html");
    			attr_dev(div4, "class", "card-body code_box content-div m-0 p-0");
    			attr_dev(div4, "style", div4_style_value = "height: 347px");
    			add_location(div4, file$6, 1672, 32, 88525);
    			attr_dev(div5, "id", "html_panel");
    			attr_dev(div5, "class", "m-0 p-0 rounded-0 tab-pane fade show active");
    			attr_dev(div5, "role", "tabpanel");
    			add_location(div5, file$6, 1671, 28, 88402);
    			attr_dev(textarea1, "name", "css");
    			attr_dev(textarea1, "class", "css_text");
    			attr_dev(textarea1, "id", "css_editor");
    			add_location(textarea1, file$6, 1678, 36, 89038);
    			attr_dev(div6, "id", "css");
    			attr_dev(div6, "class", "card-body code_box content-div m-0 p-0");
    			attr_dev(div6, "style", div6_style_value = "height: 347px");
    			add_location(div6, file$6, 1677, 32, 88915);
    			attr_dev(div7, "id", "css_panel");
    			attr_dev(div7, "class", "m-0 p-0 rounded-0 tab-pane fade show");
    			attr_dev(div7, "role", "tabpanel");
    			add_location(div7, file$6, 1676, 28, 88801);
    			attr_dev(div8, "id", "firstEditorDiv");
    			add_location(div8, file$6, 1670, 24, 88348);
    			attr_dev(textarea2, "name", "js");
    			attr_dev(textarea2, "id", "js_editor");
    			add_location(textarea2, file$6, 1685, 36, 89519);
    			attr_dev(div9, "id", "js");
    			attr_dev(div9, "class", "card-body code_box content-div m-0 p-0");
    			attr_dev(div9, "style", div9_style_value = "height: 347px");
    			add_location(div9, file$6, 1684, 32, 89397);
    			attr_dev(div10, "id", "js_panel");
    			attr_dev(div10, "class", "m-0 p-0 rounded-0 tab-pane fade show");
    			attr_dev(div10, "role", "tabpanel");
    			add_location(div10, file$6, 1683, 28, 89284);
    			attr_dev(div11, "id", "jsEditorDiv");
    			add_location(div11, file$6, 1682, 24, 89233);
    			attr_dev(div12, "id", "top_content");
    			attr_dev(div12, "class", "tab-content");
    			add_location(div12, file$6, 1669, 20, 88281);
    			add_location(span4, file$6, 1693, 32, 89896);
    			attr_dev(div13, "class", "card-header rounded-0");
    			add_location(div13, file$6, 1692, 28, 89828);
    			attr_dev(div14, "id", "result_div");
    			attr_dev(div14, "style", div14_style_value = "min-height: 347px");
    			attr_dev(div14, "class", "card-body content-div m-0 p-0 rounded-0");
    			add_location(div14, file$6, 1695, 28, 89983);
    			attr_dev(div15, "class", "card rounded-0 nm");
    			add_location(div15, file$6, 1691, 24, 89768);
    			attr_dev(div16, "id", "bottom_content");
    			add_location(div16, file$6, 1690, 20, 89718);
    			attr_dev(div17, "style", div17_style_value = "width: 100%;background: white;");
    			attr_dev(div17, "class", "content_parent");
    			add_location(div17, file$6, 1657, 16, 87463);
    			attr_dev(div18, "class", "row");
    			add_location(div18, file$6, 1637, 12, 85984);
    			attr_dev(div19, "class", "container-fluid");
    			attr_dev(div19, "id", "mainContainer");
    			add_location(div19, file$6, 1636, 8, 85923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div18);
    			append_dev(div18, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(div0, span1);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(button0, span2);
    			append_dev(div1, t2);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, label);
    			append_dev(label, input);
    			append_dev(label, t3);
    			append_dev(label, span3);
    			append_dev(span3, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, t6);
    			append_dev(div2, button1);
    			append_dev(div18, t8);
    			append_dev(div18, div17);
    			append_dev(div17, ul1);
    			append_dev(ul1, li1);
    			append_dev(li1, a0);
    			append_dev(ul1, t10);
    			append_dev(ul1, li2);
    			append_dev(li2, a1);
    			append_dev(ul1, t12);
    			append_dev(ul1, li3);
    			append_dev(li3, a2);
    			append_dev(div17, t14);
    			append_dev(div17, div12);
    			append_dev(div12, div8);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, textarea0);
    			append_dev(div8, t15);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, textarea1);
    			append_dev(div12, t16);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, textarea2);
    			append_dev(div17, t17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div13);
    			append_dev(div13, span4);
    			append_dev(div15, t19);
    			append_dev(div15, div14);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "click", /*changeTheme*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*runCode*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0].goDark)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty[0] & /*state*/ 1 && t4_value !== (t4_value = (/*state*/ ctx[0].goDark ? l.normal_mode : l.dark_mode) + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div19);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(1636:4) {#if window.inNative }",
    		ctx
    	});

    	return block;
    }

    // (1793:12) <Button key="cancel_btn"  style={'float:right;margin:10px;b;'} class="cancel_btn_pop" variant="contained" on:click={() => state.remediationToggle = false }>
    function create_default_slot_1(ctx) {
    	let t_value = l.cancel + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(1793:12) <Button key=\\\"cancel_btn\\\"  style={'float:right;margin:10px;b;'} class=\\\"cancel_btn_pop\\\" variant=\\\"contained\\\" on:click={() => state.remediationToggle = false }>",
    		ctx
    	});

    	return block;
    }

    // (1792:8) <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
    function create_footer_slot(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				key: "cancel_btn",
    				style: "float:right;margin:10px;b;",
    				class: "cancel_btn_pop",
    				variant: "contained",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_2*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			attr_dev(div, "class", "footer");
    			set_style(div, "border-top", "1px solid var(--divider, rgba(0, 0, 0, 0.1))");
    			add_location(div, file$6, 1791, 8, 94960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8388608) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(1792:8) <div slot=\\\"footer\\\" class=\\\"footer\\\" style=\\\"border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));\\\">",
    		ctx
    	});

    	return block;
    }

    // (1773:4) <Dialog                     bind:visible={state.remediationToggle}         width="650"         on:close={() => state.remediationToggle = false}         style="background: #fff; border-radius: 5px;"     >
    function create_default_slot(ctx) {
    	let h40;
    	let div1;
    	let div0;
    	let t1;
    	let div3;
    	let div2;
    	let center;
    	let loader;
    	let t2;
    	let h41;
    	let t3_value = l.calculate_answer + "";
    	let t3;
    	let br;
    	let t4;
    	let t5_value = l.please_wait + "";
    	let t5;
    	let t6;
    	let current;
    	loader = new Loader({ props: { size: 70 }, $$inline: true });

    	const block = {
    		c: function create() {
    			h40 = element("h4");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `${l.remediation}`;
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			center = element("center");
    			create_component(loader.$$.fragment);
    			t2 = space();
    			h41 = element("h4");
    			t3 = text(t3_value);
    			br = element("br");
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			add_location(div0, file$6, 1780, 16, 94615);
    			attr_dev(div1, "class", "d-flex justify-content-between");
    			add_location(div1, file$6, 1779, 12, 94554);
    			attr_dev(h40, "class", "mt-1 font21 mb-4");
    			add_location(h40, file$6, 1778, 8, 94512);
    			add_location(br, file$6, 1787, 44, 94865);
    			add_location(h41, file$6, 1787, 20, 94841);
    			add_location(center, file$6, 1785, 16, 94771);
    			attr_dev(div2, "id", "remediationModel");
    			add_location(div2, file$6, 1784, 12, 94727);
    			set_style(div3, "overflow-y", "auto");
    			add_location(div3, file$6, 1783, 8, 94683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h40, anchor);
    			append_dev(h40, div1);
    			append_dev(div1, div0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, center);
    			mount_component(loader, center, null);
    			append_dev(center, t2);
    			append_dev(center, h41);
    			append_dev(h41, t3);
    			append_dev(h41, br);
    			append_dev(h41, t4);
    			append_dev(h41, t5);
    			insert_dev(target, t6, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			destroy_component(loader);
    			if (detaching) detach_dev(t6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1773:4) <Dialog                     bind:visible={state.remediationToggle}         width=\\\"650\\\"         on:close={() => state.remediationToggle = false}         style=\\\"background: #fff; border-radius: 5px;\\\"     >",
    		ctx
    	});

    	return block;
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
    	let if_block0 = (window.isIE || window.isIEEleven) && create_if_block_1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (window.inNative) return create_if_block$5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type();
    	let if_block1 = current_block_type(ctx);

    	function dialog_visible_binding(value) {
    		/*dialog_visible_binding*/ ctx[12](value);
    	}

    	let dialog_props = {
    		width: "650",
    		style: "background: #fff; border-radius: 5px;",
    		$$slots: {
    			default: [create_default_slot],
    			footer: [create_footer_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*state*/ ctx[0].remediationToggle !== void 0) {
    		dialog_props.visible = /*state*/ ctx[0].remediationToggle;
    	}

    	dialog = new Dialog({ props: dialog_props, $$inline: true });
    	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));
    	dialog.$on("close", /*close_handler*/ ctx[13]);

    	const block = {
    		c: function create() {
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
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "h h-imp");
    			attr_dev(button0, "id", "set-review");
    			add_location(button0, file$6, 1632, 4, 85662);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file$6, 1633, 4, 85769);
    			add_location(div0, file$6, 1634, 4, 85882);
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "id", "ansModeAnswer");
    			input.value = "";
    			add_location(input, file$6, 1797, 4, 95312);
    			attr_dev(div1, "id", "authoringArea");
    			attr_dev(div1, "class", "font14");
    			add_location(div1, file$6, 1626, 0, 85478);
    			add_location(div2, file$6, 1625, 0, 85472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, button0);
    			append_dev(div1, t2);
    			append_dev(div1, button1);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			if_block1.m(div0, null);
    			append_dev(div1, t5);
    			mount_component(dialog, div1, null);
    			append_dev(div1, t6);
    			append_dev(div1, input);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (window.isIE || window.isIEEleven) if_block0.p(ctx, dirty);
    			if_block1.p(ctx, dirty);
    			const dialog_changes = {};

    			if (dirty[0] & /*state*/ 1 | dirty[1] & /*$$scope*/ 8388608) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible && dirty[0] & /*state*/ 1) {
    				updating_visible = true;
    				dialog_changes.visible = /*state*/ ctx[0].remediationToggle;
    				add_flush_callback(() => updating_visible = false);
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			destroy_component(dialog);
    			mounted = false;
    			run_all(dispose);
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

    function getChildXml(xml) {
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

    // used for unrender the player tag
    function unRenderPlayer() {
    	// makes player tag empty that exist inside element have id: authoringDiv
    	AI.empty("#authoringDiv player");

    	// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
    	AI.select("#authoringDiv").querySelector("player").classList.remove("hidecontent");

    	document.querySelector("#editor img").forEach(function (_this, i) {
    		if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    			_this.setAttribute("src", _this.getAttribute("src"));
    		}
    	});
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WebPreview", slots, []);
    	let { inQuizPlayer } = $$props;
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	xml = uxml && !(/smans/gi).test(uxml) ? uxml : xml;
    	let isPreview = "";

    	// defines that editor is not initialized
    	let rendered = 0;

    	let mode = "";
    	let htmlEditor;
    	let cssEditor;
    	let jsEditor;
    	let showHTML = 1;
    	let readHTML = 1;
    	let showCSS = 1;
    	let readCSS = 1;
    	let showJS = 1;
    	let readJS = 1;
    	let splitter1 = "";
    	let splitter2 = "";
    	let splitter3 = "";
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
    		console.log("checking");

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

    	onMount(() => {
    		mode = document.querySelector(".switch-input.switch-input");

    		// used for mobile team
    		if (window.inNative) {
    			window.getHeight && window.getHeight();

    			document.querySelector("#html_pane").addEventListener("click", function (_this) {
    				AI.select(_this).querySelector("a").classList.remove("active");
    				AH.select("#css_panel", "css", { display: "none" });
    				AH.select("#js_panel", "css", { display: "none" });
    				AH.select("#html_panel", "css", { display: "block" });
    				let container = document.querySelect("#html_panel");
    				container.querySelector("a").classList.add("active");
    				let html_tags = htmlEditor.getValue();
    				htmlEditor.setValue(html_tags);
    			});

    			document.querySelector("#html_pane").addEventListener("click", function (_this) {
    				let contain = AI.select(_this);
    				contain.querySelect("a").classList.remove("active");
    				AH.select("#html_panel", "css", { display: "none" });
    				AH.select("#js_panel", "css", { display: none });
    				let container = document.getElementById("css_panel");
    				container.style.display = "block";
    				container.querySelector("a").classList.add("active");
    				let css_data = cssEditor.getValue();
    				cssEditor.setValue(css_data);
    			});

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

    		// codemirror.js adding in body
    		if (typeof CodeMirror == "function") {
    			// initialize the html, css and js editor by converting textareas having id 'html_editor', 'css_editor', 'js_editor' in html, css and js editor
    			renderCodeMirror();
    		} else {
    			AI.ajax({ url: itemUrl + "src/libs/codemirror.js" }).then(function (data) {
    				let sc = document.createElement("script");

    				// sets the data received from 'codemirror.js' file inside the script tag
    				sc.innerHTML = data;

    				// appends this created script tag in body element of the document
    				document.body.appendChild(sc);

    				renderCodeMirror();
    			});
    		}

    		AI.ajax({ url: itemUrl + "src/libs/split.js" }).then(function (data) {
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
    		});

    		AI.listen(document, "click", "#answerCheck", function () {
    			remediationMode();
    		});

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
    				let splitter1 = Split(["#top_content"], { sizes: [50], direction: "vertical" });
    			}

    			// in case when html and css both editor is visible
    			if (showHTML && showCSS) {
    				// it is used to styled the splitter bar that exists on the left edge of the css editor
    				let splitter2 = Split(["#firstEditorDiv"], { sizes: [100], direction: "vertical" }); //direction: "vertical",

    				Split(["#html_panel", "#css_panel", "#js_panel"], { sizes: [50, 50, 50] });
    			}

    			// in case when only one editor visible
    			if (showHTML + showCSS + showJS == 1) {
    				// it is used to styled the splitter bar that exists on the left edge of the result editor in case when only one html, js or css editor is visible
    				let Splitter3 = Split(["#accordion"], { sizes: [100], direction: "vertical" }); //direction: "vertical",
    			}
    		}
    	}

    	// sets the width and floating property of the js, html, css and result editor
    	function changeStyle() {
    		// used for mobile team
    		// if (window.inNative) {
    		//     return;
    		// }
    		// if (showJS && (showHTML || showCSS)) {
    		//     // sets the width 50% of html/css editor if only one exist otherwise sets width 50% of parent element which contains both editor that have id 'firstEditorDiv' and float left
    		//     AH.select("#firstEditorDiv").style.cssText = 'float:left;width:50%';
    		//     // sets the width 50% of js editor and float left
    		//     AH.select("#jsEditorDiv").style.cssText = 'float:left;width:50%';
    		//     // it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
    		//     AH.select("top_content").style.cssText = "clear:both;overflow:auto"
    		// }
    		// if (showHTML && showCSS) {
    		//     // it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
    		//     AH.select("#top_content").style.cssText = 'clear:both;overflow:auto';
    		//     // sets html editor's width 50% and float left
    		//     AH.select("#html_panel").style.cssText = "float:left;width:50%";
    		//     // sets css editor's width 50% and float left
    		//     AH.select("#css_panel").style.cssText = "float:left;width:50%";
    		// }
    		// if ((showHTML + showCSS + showJS) == 1) {
    		//     // sets css property  width 50% and float left of parent element that contains html, css and js editor 
    		//     AH.select("#top_content").style.cssText = "float:left;width:60%";
    		//     // sets css property  width 40% and float left of element that contains result editor 
    		//     AH.select("#bottom_content").style.cssText = "float:left;width:40%";
    		// }
    		if (window.inNative) {
    			return true;
    		} else {
    			// in case when js editor is visible and either html or css or both editor visible
    			if (showJS && (showHTML || showCSS)) {
    				// it is used to styled the splitter bar that exists on the left edge of the js editor
    				let splitter1 = Split(["#top_content"], { sizes: [50], direction: "vertical" });
    			}

    			// in case when html and css both editor is visible
    			if (showHTML && showCSS) {
    				// it is used to styled the splitter bar that exists on the left edge of the css editor
    				let splitter2 = Split(["#firstEditorDiv"], { sizes: [100], direction: "vertical" }); //direction: "vertical",

    				Split(["#html_panel", "#css_panel", "#js_panel"], { sizes: [50, 50, 50] });
    			}

    			// in case when only one editor visible
    			if (showHTML + showCSS + showJS == 1) {
    				// it is used to styled the splitter bar that exists on the left edge of the result editor in case when only one html, js or css editor is visible
    				let Splitter3 = Split(["#accordion"], { sizes: [100], direction: "vertical" }); //direction: "vertical",
    			}
    		}
    	}

    	// changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
    	function changeTheme() {
    		console.warn("Loading...");

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
    			resNew.a = false;

    			AI.select("#answer").checked = false;

    			// sets the value 'false' of variable 'inNativeIsCorrect' to show incorrect answer in mobile
    			inNativeIsCorrect = false;
    		} else {
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
    			let actual_outp = (0, eval)(eval_str);

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
    		{
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
    				result = (0, eval)(js_data + "\n" + get_cases);
    			} else {
    				// contains the value return by the script defined in 'External Script' field of 'Autograde
    				result = (0, eval)(get_cases);
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

    	// used for render the player tag
    	function renderPlayer() {
    		// makes player tag empty that exist inside element have id: authoringDiv
    		AI.empty("#authoringDiv player");

    		// used for set the data of player tag
    		tag_player(AH.select("#authoringDiv"));

    		// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
    		AI.select("#authoringDiv").querySelector("player").classList.add("hidecontent");

    		document.querySelector("#editor img").forEach(function (_this, i) {
    			if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    				_this.getAttribute("src", "//s3.amazonaws.com/jigyaasa_content_static/" + _this.getAttribute("src"));
    			}
    		});
    	}

    	// shows the output of the code in 'Result' editor
    	function runCode() {
    		window.scroll({ top: 500, behavior: "smooth" });
    		let date = new Date();
    		date = date.getTime();
    		let iframeId = "uC" + date;
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

    	// makes blank the value of user answer xml and also of html,css and js editors but this method is not called from any where within the component
    	function reset() {
    		// makes blank the value of html editor
    		htmlEditor.setValue("");

    		// makes blank the value of css editor
    		cssEditor.setValue("");

    		// makes blank the value of js editor
    		jsEditor.setValue("");

    		// makes blank value of user answer xml
    		AH.select("#special_module_user_xml").value = "";

    		// makes blank the value of 'uaXML' of window object
    		window.uxml = "";
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
    				AH.selectAll("#html_panel,#html_pane,#css_panel", "hide");
    			}

    			if (!showCSS) {
    				AH.selectAll("#css_panel,#css_pane,#js_panel", "hide");
    			}

    			if (!showJS) {
    				AH.selectAll("#js_panel,#js_pane,#css_panel", "hide");
    			}

    			if (showHTML && showCSS && showJS) {
    				AH.selectAll("#css_panel,#js_panel", "hide");
    			}

    			return;
    		}

    		if (!showHTML) {
    			// hides the html editor if the value of variable 'showHTML' is 0
    			AH.select("#html_panel", "hide");

    			Split(["#css_panel", "#js_panel"], { sizes: [50, 50] });
    		}

    		if (!showCSS) {
    			//  hides the css editor if the value of variable 'showCSS' is 0
    			AH.select("#css_panel", "hide");

    			Split(["#html_panel", "#js_panel"], { sizes: [50, 50] });
    		}

    		if (!showJS) {
    			//  hides the js editor if the value of variable 'showJS' is 0
    			AH.selectAll("#js_panel", "hide");

    			Split(["#css_panel", "#html_panel"], { sizes: [50, 50] });
    		}

    		if (!showCSS && !showJS) {
    			AH.selectAll("#css_panel,#js_panel", "hide");
    			Split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
    			AH.select("#accordion", "css", { display: "flex" });
    			Split(["#html_panel"], { sizes: [100] });
    			AH.select("#top_content", "css", { height: "100%" });
    			AH.select("#firstEditorDiv").style.removeProperty("display");
    		}

    		if (!showCSS && !showHTML) {
    			AH.selectAll("#css_panel,#html_panel", "hide");
    			Split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
    			AH.select("#accordion", "css", { display: "flex" });
    			Split(["#js_panel"], { sizes: [100] });
    			AH.select("#top_content", "css", { height: "100%" });
    			AH.select("#firstEditorDiv").style.removeProperty("display");
    		}

    		if (!showHTML && !showJS) {
    			AH.select("#firstEditorDiv", "removeAttr", "display");
    			AH.selectAll("#js_panel,#html_panel", "hide");
    			Split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
    			AH.select("#accordion", "css", { display: "flex" });
    			Split(["#css_panel"], { sizes: [100] });
    			AH.select("#top_content", "css", { height: "100%" });
    			AH.select("#firstEditorDiv").style.removeProperty("display");
    		}
    	}

    	// used for update the user answer xml value
    	function saveWebAnswer(code, code_lang) {
    		// contains the user answer xml of question xml
    		let qxml = !(/smans/g).test(uxml) && uxml ? uxml : xml;

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
    		AH.select("#special_module_user_xml").value = uXml;

    		// assign the user answer xml in variable 'userAnswers'
    		let userAnswers;

    		userAnswers = userAnswer = AH.select("#special_module_user_xml").value;

    		// used for mobile team
    		if (window.inNative) {
    			window.postMessage("height___" + document.getElementsByClassName("container-fluid")[0].offsetHeight, "*");
    			window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect: false }), "*");
    		}

    		// assign the user answer xml value in 'uaXML' variable of window object
    		$$invalidate(6, uxml = uXml);

    		resultSaving = uXml;
    	}

    	const writable_props = ["inQuizPlayer", "xml", "uxml", "isReview"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<WebPreview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		setReview();
    	};

    	const click_handler_1 = () => {
    		unsetReview();
    	};

    	const click_handler_2 = () => $$invalidate(0, state.remediationToggle = false, state);

    	function dialog_visible_binding(value) {
    		if ($$self.$$.not_equal(state.remediationToggle, value)) {
    			state.remediationToggle = value;
    			$$invalidate(0, state);
    		}
    	}

    	const close_handler = () => $$invalidate(0, state.remediationToggle = false, state);

    	$$self.$$set = $$props => {
    		if ("inQuizPlayer" in $$props) $$invalidate(7, inQuizPlayer = $$props.inQuizPlayer);
    		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(6, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		onMount,
    		beforeUpdate,
    		Button,
    		Dialog,
    		Loader,
    		writable,
    		l,
    		AH,
    		onUserAnsChange,
    		inQuizPlayer,
    		xml,
    		uxml,
    		isReview,
    		isPreview,
    		rendered,
    		mode,
    		htmlEditor,
    		cssEditor,
    		jsEditor,
    		showHTML,
    		readHTML,
    		showCSS,
    		readCSS,
    		showJS,
    		readJS,
    		splitter1,
    		splitter2,
    		splitter3,
    		userAnswer,
    		isOldTestcase,
    		resultSaving,
    		state,
    		stateData,
    		unsubscribe,
    		setReview,
    		unsetReview,
    		getChildXml,
    		splitter,
    		changeStyle,
    		changeTheme,
    		newSource,
    		prepareSource,
    		renderCodeMirror,
    		remediationMode,
    		answerCheckWeb,
    		testcaseCheck,
    		splitCase,
    		checkOldAttrTestCase,
    		checkNewTestCase,
    		internalCheck,
    		style_match,
    		attr_match,
    		str_match,
    		externalCheck,
    		stringBetween,
    		findAttribute,
    		unRenderPlayer,
    		renderPlayer,
    		runCode,
    		reset,
    		parseXML,
    		hideEditors,
    		saveWebAnswer
    	});

    	$$self.$inject_state = $$props => {
    		if ("inQuizPlayer" in $$props) $$invalidate(7, inQuizPlayer = $$props.inQuizPlayer);
    		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(6, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
    		if ("isPreview" in $$props) isPreview = $$props.isPreview;
    		if ("rendered" in $$props) rendered = $$props.rendered;
    		if ("mode" in $$props) mode = $$props.mode;
    		if ("htmlEditor" in $$props) htmlEditor = $$props.htmlEditor;
    		if ("cssEditor" in $$props) cssEditor = $$props.cssEditor;
    		if ("jsEditor" in $$props) jsEditor = $$props.jsEditor;
    		if ("showHTML" in $$props) showHTML = $$props.showHTML;
    		if ("readHTML" in $$props) readHTML = $$props.readHTML;
    		if ("showCSS" in $$props) showCSS = $$props.showCSS;
    		if ("readCSS" in $$props) readCSS = $$props.readCSS;
    		if ("showJS" in $$props) showJS = $$props.showJS;
    		if ("readJS" in $$props) readJS = $$props.readJS;
    		if ("splitter1" in $$props) splitter1 = $$props.splitter1;
    		if ("splitter2" in $$props) splitter2 = $$props.splitter2;
    		if ("splitter3" in $$props) splitter3 = $$props.splitter3;
    		if ("userAnswer" in $$props) userAnswer = $$props.userAnswer;
    		if ("isOldTestcase" in $$props) isOldTestcase = $$props.isOldTestcase;
    		if ("resultSaving" in $$props) resultSaving = $$props.resultSaving;
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("stateData" in $$props) stateData = $$props.stateData;
    		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		state,
    		setReview,
    		unsetReview,
    		changeTheme,
    		runCode,
    		xml,
    		uxml,
    		inQuizPlayer,
    		isReview,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		dialog_visible_binding,
    		close_handler
    	];
    }

    class WebPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1$1.getElementById("svelte-gqd0n6-style")) add_css$6();

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				inQuizPlayer: 7,
    				xml: 5,
    				uxml: 6,
    				isReview: 8
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WebPreview",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inQuizPlayer*/ ctx[7] === undefined && !("inQuizPlayer" in props)) {
    			console_1$1.warn("<WebPreview> was created without expected prop 'inQuizPlayer'");
    		}

    		if (/*xml*/ ctx[5] === undefined && !("xml" in props)) {
    			console_1$1.warn("<WebPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[6] === undefined && !("uxml" in props)) {
    			console_1$1.warn("<WebPreview> was created without expected prop 'uxml'");
    		}

    		if (/*isReview*/ ctx[8] === undefined && !("isReview" in props)) {
    			console_1$1.warn("<WebPreview> was created without expected prop 'isReview'");
    		}
    	}

    	get inQuizPlayer() {
    		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inQuizPlayer(value) {
    		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xml() {
    		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMWeb/WebAuthoring.svelte generated by Svelte v3.34.0 */
    const file$7 = "clsSMWeb/WebAuthoring.svelte";

    // (781:28) <Checkbox                                   checked={state.goDark}                                  on:click={changeTheme}                                  id="goDark"                                                              >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Dark Theme");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(781:28) <Checkbox                                   checked={state.goDark}                                  on:click={changeTheme}                                  id=\\\"goDark\\\"                                                              >",
    		ctx
    	});

    	return block;
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
    	let t7_value = l.run + "";
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
    	let textarea0;
    	let t11;
    	let div11;
    	let div9;
    	let span2;
    	let t13;
    	let div10;
    	let textarea1;
    	let t14;
    	let div14;
    	let div12;
    	let span3;
    	let t16;
    	let div13;
    	let textarea2;
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
    	let button4;
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
    			},
    			$$inline: true
    		});

    	checkbox.$on("click", /*changeTheme*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div53 = element("div");
    			div24 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = `${l.autograde}`;
    			t1 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = `${l.disable}`;
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
    			span1.textContent = `${l.html}`;
    			t10 = space();
    			div7 = element("div");
    			textarea0 = element("textarea");
    			t11 = space();
    			div11 = element("div");
    			div9 = element("div");
    			span2 = element("span");
    			span2.textContent = `${l.css}`;
    			t13 = space();
    			div10 = element("div");
    			textarea1 = element("textarea");
    			t14 = space();
    			div14 = element("div");
    			div12 = element("div");
    			span3 = element("span");
    			span3.textContent = `${l.js}`;
    			t16 = space();
    			div13 = element("div");
    			textarea2 = element("textarea");
    			t17 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div17 = element("div");
    			span4 = element("span");
    			span4.textContent = `${l.result}`;
    			t19 = space();
    			div18 = element("div");
    			t20 = space();
    			div43 = element("div");
    			div42 = element("div");
    			div41 = element("div");
    			div25 = element("div");
    			h40 = element("h4");
    			label0 = element("label");
    			label0.textContent = `${l.autograde}`;
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
    			a0.textContent = `${l.testcases}`;
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
    			a1.textContent = `${l.internalScript}`;
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
    			a2.textContent = `${l.externalScript}`;
    			t35 = space();
    			span7 = element("span");
    			t36 = space();
    			div36 = element("div");
    			div35 = element("div");
    			textarea5 = element("textarea");
    			t37 = space();
    			div40 = element("div");
    			button4 = element("button");
    			button4.textContent = "Done";
    			t39 = space();
    			div52 = element("div");
    			div51 = element("div");
    			div50 = element("div");
    			div44 = element("div");
    			h44 = element("h4");
    			h44.textContent = `${l.disable}`;
    			t41 = space();
    			button5 = element("button");
    			button5.textContent = "×";
    			t43 = space();
    			div49 = element("div");
    			div45 = element("div");
    			label1 = element("label");
    			label1.textContent = `${l.html}:`;
    			t46 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = `${l.editable}`;
    			option1 = element("option");
    			option1.textContent = `${l.hidden}`;
    			option2 = element("option");
    			option2.textContent = `${l.disabled}`;
    			t50 = space();
    			div46 = element("div");
    			label2 = element("label");
    			label2.textContent = `${l.css}:`;
    			t53 = space();
    			select1 = element("select");
    			option3 = element("option");
    			option3.textContent = `${l.editable}`;
    			option4 = element("option");
    			option4.textContent = `${l.hidden}`;
    			option5 = element("option");
    			option5.textContent = `${l.disabled}`;
    			t57 = space();
    			div47 = element("div");
    			label3 = element("label");
    			label3.textContent = `${l.js}:`;
    			t60 = space();
    			select2 = element("select");
    			option6 = element("option");
    			option6.textContent = `${l.editable}`;
    			option7 = element("option");
    			option7.textContent = `${l.hidden}`;
    			option8 = element("option");
    			option8.textContent = `${l.disabled}`;
    			t64 = space();
    			div48 = element("div");
    			button6 = element("button");
    			button6.textContent = `${l.done}`;
    			t66 = space();
    			input2 = element("input");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-toggle", "modal");
    			attr_dev(button0, "data-bs-target", "#autograde_modal");
    			attr_dev(button0, "data-cy", "autograde_modal");
    			attr_dev(button0, "class", "btn btn-primary mr-2");
    			add_location(button0, file$7, 752, 24, 32759);
    			attr_dev(div0, "class", "inline-block pull-left");
    			add_location(div0, file$7, 751, 20, 32697);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-bs-toggle", "modal");
    			attr_dev(button1, "data-bs-target", "#disable_modal");
    			attr_dev(button1, "data-cy", "disable_modal");
    			attr_dev(button1, "class", "btn btn-primary mr-2");
    			add_location(button1, file$7, 761, 24, 33193);
    			attr_dev(div1, "class", "inline-block pull-left");
    			add_location(div1, file$7, 760, 20, 33132);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "launch_caption");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", "Caption");
    			add_location(input0, file$7, 770, 24, 33630);
    			attr_dev(div2, "class", "inline-block pull-left width150");
    			add_location(div2, file$7, 769, 20, 33560);
    			attr_dev(span0, "class", "themeStyle form-check form-check-inline");
    			add_location(span0, file$7, 779, 24, 34065);
    			attr_dev(div3, "class", "inline-block width150 relative bottom6 pull-left ml-lg");
    			attr_dev(div3, "data-cy", "goDark");
    			add_location(div3, file$7, 778, 20, 33955);
    			attr_dev(i, "class", "fa fa-code");
    			add_location(i, file$7, 796, 28, 34814);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-primary ml");
    			add_location(button2, file$7, 791, 24, 34605);
    			attr_dev(div4, "class", "inline-block pull-right");
    			add_location(div4, file$7, 790, 20, 34543);
    			attr_dev(div5, "id", "web_toolbar");
    			set_style(div5, "height", "50px");
    			attr_dev(div5, "class", "bg-light w-100 p-2");
    			add_location(div5, file$7, 750, 16, 32605);
    			add_location(span1, file$7, 805, 36, 35315);
    			attr_dev(div6, "class", "card-header rounded-0");
    			add_location(div6, file$7, 804, 32, 35243);
    			attr_dev(textarea0, "name", "html");
    			attr_dev(textarea0, "id", "html_editor");
    			add_location(textarea0, file$7, 808, 36, 35529);
    			attr_dev(div7, "id", "html");
    			attr_dev(div7, "class", "card-body code_box content-div m-0 p-0");
    			set_style(div7, "height", "347px");
    			add_location(div7, file$7, 807, 32, 35408);
    			attr_dev(div8, "id", "html_panel");
    			attr_dev(div8, "class", "card m-0 p-0 rounded-0");
    			add_location(div8, file$7, 803, 28, 35158);
    			add_location(span2, file$7, 813, 36, 35838);
    			attr_dev(div9, "class", "card-header rounded-0");
    			add_location(div9, file$7, 812, 32, 35766);
    			attr_dev(textarea1, "name", "css");
    			attr_dev(textarea1, "id", "css_editor");
    			add_location(textarea1, file$7, 816, 36, 36050);
    			attr_dev(div10, "id", "css");
    			attr_dev(div10, "class", "card-body code_box content-div m-0 p-0");
    			set_style(div10, "height", "347px");
    			add_location(div10, file$7, 815, 32, 35930);
    			attr_dev(div11, "id", "css_panel");
    			attr_dev(div11, "class", "card m-0 p-0 rounded-0");
    			add_location(div11, file$7, 811, 28, 35682);
    			add_location(span3, file$7, 821, 36, 36356);
    			attr_dev(div12, "class", "card-header rounded-0");
    			add_location(div12, file$7, 820, 32, 36284);
    			attr_dev(textarea2, "name", "js");
    			attr_dev(textarea2, "id", "js_editor");
    			add_location(textarea2, file$7, 824, 36, 36566);
    			attr_dev(div13, "id", "js");
    			attr_dev(div13, "class", "card-body code_box content-div m-0 p-0");
    			set_style(div13, "height", "347px");
    			add_location(div13, file$7, 823, 32, 36447);
    			attr_dev(div14, "id", "js_panel");
    			attr_dev(div14, "class", "card m-0 p-0 rounded-0");
    			add_location(div14, file$7, 819, 28, 36201);
    			attr_dev(div15, "id", "firstEditorDiv");
    			set_style(div15, "display", "flex");
    			add_location(div15, file$7, 802, 24, 35082);
    			attr_dev(div16, "id", "top_content");
    			add_location(div16, file$7, 801, 20, 35035);
    			add_location(span4, file$7, 842, 32, 37546);
    			attr_dev(div17, "class", "card-header rounded-0");
    			add_location(div17, file$7, 841, 28, 37478);
    			attr_dev(div18, "id", "result_div");
    			set_style(div18, "min-height", "351px");
    			attr_dev(div18, "class", "card-body content-div m-0 p-0 rounded-0");
    			add_location(div18, file$7, 844, 28, 37633);
    			attr_dev(div19, "class", "card rounded-0 nm");
    			add_location(div19, file$7, 840, 24, 37418);
    			attr_dev(div20, "id", "bottom_content");
    			add_location(div20, file$7, 839, 20, 37368);
    			attr_dev(div21, "id", "wrap");
    			set_style(div21, "width", "100%");
    			set_style(div21, "background", "white");
    			set_style(div21, "padding", "0px");
    			add_location(div21, file$7, 800, 16, 34949);
    			attr_dev(div22, "class", "row");
    			add_location(div22, file$7, 749, 12, 32571);
    			attr_dev(div23, "class", "container-fluid");
    			add_location(div23, file$7, 748, 8, 32529);
    			add_location(div24, file$7, 747, 4, 32515);
    			attr_dev(label0, "for", "autograde_cb");
    			attr_dev(label0, "class", "form-check-label pr-2");
    			add_location(label0, file$7, 862, 24, 38331);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "autograde_cb");
    			attr_dev(input1, "id", "autograde_cb");
    			attr_dev(input1, "class", "form-check-input");
    			add_location(input1, file$7, 863, 24, 38434);
    			attr_dev(h40, "class", "modal-title form-check form-check-inline");
    			add_location(h40, file$7, 861, 20, 38253);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-bs-dismiss", "modal");
    			attr_dev(button3, "aria-hidden", "true");
    			attr_dev(button3, "id", "close_dialog_btn");
    			attr_dev(button3, "auto:focus", "autofocus");
    			add_location(button3, file$7, 871, 20, 38766);
    			attr_dev(div25, "class", "modal-header");
    			add_location(div25, file$7, 860, 16, 38206);
    			attr_dev(a0, "class", "text-dark");
    			attr_dev(a0, "data-bs-toggle", "collapse");
    			attr_dev(a0, "data-bs-parent", "#grade_accordion");
    			attr_dev(a0, "href", "#test_case_collapse");
    			add_location(a0, file$7, 885, 36, 39475);
    			attr_dev(span5, "class", "icomoon-help float-right s4");
    			attr_dev(span5, "data-bs-toggle", "tooltip");
    			attr_dev(span5, "title", "custom function name|input1,input2,..inputN|Output");
    			attr_dev(span5, "data-bs-placement", "left");
    			add_location(span5, file$7, 894, 36, 39953);
    			attr_dev(h41, "class", "panel-title");
    			add_location(h41, file$7, 884, 32, 39414);
    			attr_dev(div26, "class", "card-header");
    			attr_dev(div26, "data-bs-toggle", "collapse");
    			attr_dev(div26, "data-bs-target", "#test_case_collapse");
    			add_location(div26, file$7, 883, 28, 39293);
    			attr_dev(textarea3, "id", "test_case_text");
    			attr_dev(textarea3, "class", "form-control");
    			set_style(textarea3, "maxHeight", "150px");
    			set_style(textarea3, "minHeight", "80px");
    			attr_dev(textarea3, "placeholder", "custom function name|input1,input2,..inputN|Output");
    			textarea3.disabled = "disabled";
    			add_location(textarea3, file$7, 904, 36, 40562);
    			attr_dev(div27, "class", "card-body p-md");
    			add_location(div27, file$7, 903, 32, 40497);
    			attr_dev(div28, "id", "test_case_collapse");
    			attr_dev(div28, "class", "collapse in");
    			add_location(div28, file$7, 902, 28, 40415);
    			attr_dev(div29, "class", "card mb-2");
    			add_location(div29, file$7, 882, 24, 39241);
    			attr_dev(a1, "class", "text-dark");
    			attr_dev(a1, "data-bs-toggle", "collapse");
    			attr_dev(a1, "data-bs-parent", "#grade_accordion");
    			attr_dev(a1, "href", "#internal_script_collapse");
    			add_location(a1, file$7, 918, 36, 41425);
    			attr_dev(span6, "class", "icomoon-help float-right s4");
    			attr_dev(span6, "data-bs-toggle", "tooltip");
    			attr_dev(span6, "title", "1. attr_match?HTML?tag name{1}?occurance.(for tag match)\r2. attr_match?HTML?tag name{string that has to be check inside tag's innerHTML{2}?occurance.(for string match inside perticular tag) \r3. attr_match?HTML?tag name{attribute{3}?occurance.(for attribute match of perticular tag) \r4. attr_match?HTML?tag name{attribute{value{4}?occurance.(for match attribute with value of particular tag) \r5. str_match?HTML?string to be match in hole html part{2}?occurence.(for string match in hole HTML document)\r6. str_match?CSS?media query's string{selector{property?occurence.(for string match in hole css document only for media query) \r7. style_match?CSS?selector?property{value.(match property with value for CSS of perticular CSS selector) \r8. str_match?JS?string to be match in hole JS part?occurance.(for string match in hole js part) \rNote: occurance => \r (i) For HTML it should be 'min+number' or 'max+number' such as 'min1' or 'max1' and so on. \r(ii) For CSS it should be number such as 1 or 2 or .... \r(iii) For JS it should be 'min+number', 'max+number' or 'only number' according to condition for match. \r(iv) Here {1}  is flag for check tag, {2} is flag for check string but with attr_match it checks string inside given tag's innerHTML but with str_match it checks in hole document, flag {3} is for check attribute, flag {4} is for check attribute with value For match in HTML document.");
    			attr_dev(span6, "data-bs-placement", "left");
    			add_location(span6, file$7, 926, 40, 41881);
    			attr_dev(h42, "class", "panel-title");
    			add_location(h42, file$7, 917, 32, 41364);
    			attr_dev(div30, "class", "card-header");
    			attr_dev(div30, "data-bs-toggle", "collapse");
    			attr_dev(div30, "data-bs-target", "#internal_script_collapse");
    			add_location(div30, file$7, 916, 28, 41237);
    			attr_dev(textarea4, "id", "occurence_text");
    			attr_dev(textarea4, "class", "form-control");
    			set_style(textarea4, "max-height", "150px");
    			set_style(textarea4, "min-height", "80px");
    			attr_dev(textarea4, "placeholder", "function as suggested in help block?Lang?keyword?occurance");
    			textarea4.disabled = "disabled";
    			add_location(textarea4, file$7, 940, 36, 44259);
    			attr_dev(div31, "class", "card-body p-md");
    			add_location(div31, file$7, 939, 32, 44194);
    			attr_dev(div32, "id", "internal_script_collapse");
    			attr_dev(div32, "class", "panel-collapse collapse");
    			add_location(div32, file$7, 938, 28, 44094);
    			attr_dev(div33, "class", "card mb-2");
    			add_location(div33, file$7, 915, 24, 41185);
    			attr_dev(a2, "class", "text-dark");
    			attr_dev(a2, "data-bs-toggle", "collapse");
    			attr_dev(a2, "data-bs-parent", "#grade_accordion");
    			attr_dev(a2, "href", "#external_script_collapse");
    			add_location(a2, file$7, 954, 36, 45132);
    			attr_dev(span7, "class", "icomoon-help float-right s4");
    			attr_dev(span7, "data-bs-toggle", "tooltip");
    			attr_dev(span7, "title", "Write your own script");
    			attr_dev(span7, "data-bs-placement", "left");
    			add_location(span7, file$7, 962, 36, 45584);
    			attr_dev(h43, "class", "panel-title");
    			add_location(h43, file$7, 953, 32, 45071);
    			attr_dev(div34, "class", "card-header");
    			attr_dev(div34, "data-bs-toggle", "collapse");
    			attr_dev(div34, "data-bs-target", "#external_script_collapse");
    			add_location(div34, file$7, 952, 28, 44944);
    			attr_dev(textarea5, "id", "exscript_text");
    			attr_dev(textarea5, "class", "form-control");
    			set_style(textarea5, "max-height", "150px");
    			set_style(textarea5, "min-height", "80px");
    			attr_dev(textarea5, "placeholder", "Write your own script");
    			textarea5.disabled = "disabled";
    			textarea5.value = "\n                                    ";
    			add_location(textarea5, file$7, 978, 36, 46449);
    			attr_dev(div35, "class", "card-body p-md");
    			add_location(div35, file$7, 977, 32, 46384);
    			attr_dev(div36, "id", "external_script_collapse");
    			attr_dev(div36, "class", "panel-collapse collapse");
    			add_location(div36, file$7, 976, 28, 46284);
    			attr_dev(div37, "class", "card mb-2");
    			add_location(div37, file$7, 951, 24, 44892);
    			attr_dev(div38, "class", "panel-group");
    			attr_dev(div38, "id", "grade_accordion");
    			add_location(div38, file$7, 881, 20, 39170);
    			attr_dev(div39, "class", "modal-body overflow-auto");
    			add_location(div39, file$7, 880, 16, 39111);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-primary");
    			attr_dev(button4, "data-bs-dismiss", "modal");
    			attr_dev(button4, "name", "done_grading_btn");
    			attr_dev(button4, "id", "done_grading_btn");
    			add_location(button4, file$7, 993, 20, 47171);
    			attr_dev(div40, "class", "modal-footer");
    			add_location(div40, file$7, 992, 16, 47124);
    			attr_dev(div41, "class", "modal-content");
    			add_location(div41, file$7, 859, 12, 38162);
    			attr_dev(div42, "class", "modal-dialog modal-lg modal-dialog-centered");
    			add_location(div42, file$7, 858, 8, 38092);
    			attr_dev(div43, "id", "autograde_modal");
    			attr_dev(div43, "class", "modal fade");
    			attr_dev(div43, "role", "dialog");
    			add_location(div43, file$7, 857, 4, 38024);
    			attr_dev(h44, "class", "modal-title");
    			add_location(h44, file$7, 1010, 20, 47792);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "close");
    			attr_dev(button5, "data-bs-dismiss", "modal");
    			attr_dev(button5, "aria-hidden", "true");
    			add_location(button5, file$7, 1011, 20, 47853);
    			attr_dev(div44, "class", "modal-header");
    			add_location(div44, file$7, 1009, 16, 47745);
    			attr_dev(label1, "for", "html_disable");
    			add_location(label1, file$7, 1015, 24, 48076);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$7, 1017, 28, 48288);
    			option1.__value = "0";
    			option1.value = option1.__value;
    			add_location(option1, file$7, 1018, 28, 48355);
    			option2.__value = "1";
    			option2.value = option2.__value;
    			add_location(option2, file$7, 1019, 28, 48421);
    			attr_dev(select0, "class", "form-control");
    			attr_dev(select0, "id", "html_disable");
    			attr_dev(select0, "data-cy", "html_disable");
    			attr_dev(select0, "auto:focus", "autofocus");
    			add_location(select0, file$7, 1016, 24, 48144);
    			attr_dev(div45, "class", "form-group");
    			add_location(div45, file$7, 1014, 20, 48027);
    			attr_dev(label2, "for", "css_disable");
    			add_location(label2, file$7, 1023, 24, 48591);
    			option3.__value = "";
    			option3.value = option3.__value;
    			add_location(option3, file$7, 1025, 28, 48776);
    			option4.__value = "0";
    			option4.value = option4.__value;
    			add_location(option4, file$7, 1026, 28, 48843);
    			option5.__value = "1";
    			option5.value = option5.__value;
    			add_location(option5, file$7, 1027, 28, 48909);
    			attr_dev(select1, "class", "form-control");
    			attr_dev(select1, "id", "css_disable");
    			attr_dev(select1, "data-cy", "css_disable");
    			add_location(select1, file$7, 1024, 24, 48657);
    			attr_dev(div46, "class", "form-group");
    			add_location(div46, file$7, 1022, 20, 48542);
    			attr_dev(label3, "for", "js_disable");
    			add_location(label3, file$7, 1031, 24, 49079);
    			option6.__value = "";
    			option6.value = option6.__value;
    			add_location(option6, file$7, 1033, 28, 49260);
    			option7.__value = "0";
    			option7.value = option7.__value;
    			add_location(option7, file$7, 1034, 28, 49327);
    			option8.__value = "1";
    			option8.value = option8.__value;
    			add_location(option8, file$7, 1035, 28, 49393);
    			attr_dev(select2, "class", "form-control");
    			attr_dev(select2, "id", "js_disable");
    			attr_dev(select2, "data-cy", "js_disable");
    			add_location(select2, file$7, 1032, 24, 49143);
    			attr_dev(div47, "class", "form-group");
    			add_location(div47, file$7, 1030, 20, 49030);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "data-cy", "close_modal");
    			attr_dev(button6, "data-bs-dismiss", "modal");
    			add_location(button6, file$7, 1039, 24, 49564);
    			attr_dev(div48, "class", "float-right");
    			add_location(div48, file$7, 1038, 20, 49514);
    			attr_dev(div49, "class", "modal-body");
    			add_location(div49, file$7, 1013, 16, 47982);
    			attr_dev(div50, "class", "modal-content");
    			add_location(div50, file$7, 1008, 12, 47701);
    			attr_dev(div51, "class", "modal-dialog modal-sm modal-dialog-centered");
    			add_location(div51, file$7, 1007, 8, 47631);
    			attr_dev(div52, "id", "disable_modal");
    			attr_dev(div52, "class", "modal fade");
    			attr_dev(div52, "role", "dialog");
    			add_location(div52, file$7, 1006, 4, 47565);
    			attr_dev(input2, "type", "hidden");
    			attr_dev(input2, "id", "ansModeAnswer");
    			input2.value = "";
    			add_location(input2, file$7, 1045, 4, 49773);
    			attr_dev(div53, "id", "authoringArea");
    			set_style(div53, "line-height", "20px");
    			set_style(div53, "font-size", "14px");
    			add_location(div53, file$7, 746, 0, 32445);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div53, anchor);
    			append_dev(div53, div24);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div5);
    			append_dev(div5, div0);
    			append_dev(div0, button0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div1, button1);
    			append_dev(div5, t3);
    			append_dev(div5, div2);
    			append_dev(div2, input0);
    			append_dev(div5, t4);
    			append_dev(div5, div3);
    			append_dev(div3, span0);
    			mount_component(checkbox, span0, null);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, button2);
    			append_dev(button2, i);
    			append_dev(button2, t6);
    			append_dev(button2, t7);
    			append_dev(div22, t8);
    			append_dev(div22, div21);
    			append_dev(div21, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div8);
    			append_dev(div8, div6);
    			append_dev(div6, span1);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, textarea0);
    			append_dev(div15, t11);
    			append_dev(div15, div11);
    			append_dev(div11, div9);
    			append_dev(div9, span2);
    			append_dev(div11, t13);
    			append_dev(div11, div10);
    			append_dev(div10, textarea1);
    			append_dev(div15, t14);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div12, span3);
    			append_dev(div14, t16);
    			append_dev(div14, div13);
    			append_dev(div13, textarea2);
    			append_dev(div21, t17);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div17);
    			append_dev(div17, span4);
    			append_dev(div19, t19);
    			append_dev(div19, div18);
    			append_dev(div53, t20);
    			append_dev(div53, div43);
    			append_dev(div43, div42);
    			append_dev(div42, div41);
    			append_dev(div41, div25);
    			append_dev(div25, h40);
    			append_dev(h40, label0);
    			append_dev(h40, t22);
    			append_dev(h40, input1);
    			append_dev(div25, t23);
    			append_dev(div25, button3);
    			append_dev(div41, t25);
    			append_dev(div41, div39);
    			append_dev(div39, div38);
    			append_dev(div38, div29);
    			append_dev(div29, div26);
    			append_dev(div26, h41);
    			append_dev(h41, a0);
    			append_dev(h41, t27);
    			append_dev(h41, span5);
    			append_dev(div29, t28);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, textarea3);
    			append_dev(div38, t29);
    			append_dev(div38, div33);
    			append_dev(div33, div30);
    			append_dev(div30, h42);
    			append_dev(h42, a1);
    			append_dev(h42, t31);
    			append_dev(h42, span6);
    			append_dev(div33, t32);
    			append_dev(div33, div32);
    			append_dev(div32, div31);
    			append_dev(div31, textarea4);
    			append_dev(div38, t33);
    			append_dev(div38, div37);
    			append_dev(div37, div34);
    			append_dev(div34, h43);
    			append_dev(h43, a2);
    			append_dev(h43, t35);
    			append_dev(h43, span7);
    			append_dev(div37, t36);
    			append_dev(div37, div36);
    			append_dev(div36, div35);
    			append_dev(div35, textarea5);
    			append_dev(div41, t37);
    			append_dev(div41, div40);
    			append_dev(div40, button4);
    			append_dev(div53, t39);
    			append_dev(div53, div52);
    			append_dev(div52, div51);
    			append_dev(div51, div50);
    			append_dev(div50, div44);
    			append_dev(div44, h44);
    			append_dev(div44, t41);
    			append_dev(div44, button5);
    			append_dev(div50, t43);
    			append_dev(div50, div49);
    			append_dev(div49, div45);
    			append_dev(div45, label1);
    			append_dev(div45, t46);
    			append_dev(div45, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(div49, t50);
    			append_dev(div49, div46);
    			append_dev(div46, label2);
    			append_dev(div46, t53);
    			append_dev(div46, select1);
    			append_dev(select1, option3);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			append_dev(div49, t57);
    			append_dev(div49, div47);
    			append_dev(div47, label3);
    			append_dev(div47, t60);
    			append_dev(div47, select2);
    			append_dev(select2, option6);
    			append_dev(select2, option7);
    			append_dev(select2, option8);
    			append_dev(div49, t64);
    			append_dev(div49, div48);
    			append_dev(div48, button6);
    			append_dev(div53, t66);
    			append_dev(div53, input2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "keyup", /*generateXml*/ ctx[2], false, false, false),
    					listen_dev(button2, "click", /*runCode*/ ctx[3], false, false, false),
    					listen_dev(input1, "click", /*enableAutograde*/ ctx[4], false, false, false),
    					listen_dev(textarea3, "keyup", /*generateXml*/ ctx[2], false, false, false),
    					listen_dev(textarea4, "keyup", /*generateXml*/ ctx[2], false, false, false),
    					listen_dev(textarea5, "keyup", /*generateXml*/ ctx[2], false, false, false),
    					listen_dev(select0, "blur", /*generateXml*/ ctx[2], false, false, false),
    					listen_dev(select1, "blur", /*generateXml*/ ctx[2], false, false, false),
    					listen_dev(select2, "blur", /*generateXml*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const checkbox_changes = {};
    			if (dirty[0] & /*state*/ 1) checkbox_changes.checked = /*state*/ ctx[0].goDark;

    			if (dirty[1] & /*$$scope*/ 8) {
    				checkbox_changes.$$scope = { dirty, ctx };
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div53);
    			destroy_component(checkbox);
    			mounted = false;
    			run_all(dispose);
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

    // used for unrender the player tag
    function unRenderPlayer$1() {
    	// makes player tag empty that exist inside element have id: authoringDiv
    	//jQuery('#authoringDiv player').empty();
    	AI.empty("#authoringDiv player");

    	// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
    	//jQuery('#authoringDiv').find('player').removeClass('hidecontent'); // Replaced
    	document.querySelector("#authoringDiv").querySelector("player").classList.remove("hidecontent");

    	// jQuery('#editor img').each(function () { // Replaced
    	//     if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    	//         // sets the value of 'src' attribute of img tag that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static' 
    	//         jQuery(self).attr('src', jQuery(self).attr('src'));
    	//     }
    	// }); 
    	document.querySelector("#editor img").forEach(function (_this, i) {
    		if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    			_this.getAttribute("src", _this.getAttribute("src"));
    		}
    	});
    }

    // used for render the player tag
    function renderPlayer() {
    	// makes player tag empty that exist inside element have id: authoringDiv
    	//jQuery('#authoringDiv player').empty(); // Replaced
    	AI.empty("#authoringDiv player");

    	// used for set the data of player tag
    	//   tag_player(jQuery('#authoringDiv')); // Replaced
    	//tag_player(document.querySelector('#authoringDiv'));
    	// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
    	//jQuery('#authoringDiv').find('player').addClass('hidecontent'); // Replaced
    	setTimeout(
    		function () {
    			document.querySelector("#authoringDiv").querySelector("player").classList.add("hidecontent");
    		},
    		200
    	);

    	document.querySelector("#editor img").forEach(function (_this, i) {
    		if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    			_this.getAttribute("src", "//s3.amazonaws.com/jigyaasa_content_static/" + _this.getAttribute("src"));
    		}
    	});
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WebAuthoring", slots, []);
    	let { xml } = $$props;
    	let { getChildXml } = $$props;
    	let { toggleMode } = $$props;
    	let { isReview } = $$props;

    	//export let showAns;
    	let isPreview = 0;

    	let defaultStartXml = "<smxml type=\"22\" addhtml=\"0\" name=\"Web\">";
    	let isCaption = "";
    	let isAutograde = "";
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
    	let state = {};
    	let disabled_hide = ["Editable", "Hidden", "Disabled"];

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
    		//     createLink('pe-items/svelte_items/clsSMWeb/libs/codemirror.min.css');
    		//     createLink('pe-items/svelte_items/clsSMWeb/libs/monokai.css');
    		//     createLink('pe-items/svelte_items/clsSMWeb/libs/simplescrollbars.css');
    		//     createLink('pe-items/svelte_items/clsSMWeb/libs/webitem.min.css');
    		//     is_visible = 1;
    		// }
    		// contains the xml
    		$$invalidate(5, xml = xml ? xml : state.xml);

    		if (toggleMode) {
    			// defined in 'Web.js' it loads Preview or Authoring component according to the value of this variable but in this file it is not in use
    			isPreview = 0;
    		}
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
    				url: itemUrl + "src/libs/codemirror.js",
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
    			url: itemUrl + "src/libs/split.js",
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

    	// used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
    	function splitter() {
    		// in case when js editor is visible and either html or css or both editor visible
    		if (showJS && (showHTML || showCSS)) {
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
    		if (showHTML && showCSS) {
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

    		// in case when only one editor visible
    		if (showHTML + showCSS + showJS == 1) {
    			// it is used to styled the splitter bar that exists on the left edge of the result editor
    			// let splitter3 = jQuery('#wrap').height(394).split({
    			//     // Add a vertical splitter bar
    			//     orientation: 'vertical',
    			//     // Specify how many pixels where you can't move the splitter bar on the edge
    			//     limit: 80,
    			//     // Set the position of the splitter bar
    			//     position: '60%'
    			// });
    			// let Splitter3 = Split(['#wrap'],{
    			//     minSize: [60],
    			//     direction: "vertical",
    			// })
    			let Splitter3 = Split(["#wrap"], { sizes: [100], direction: "vertical" }); //direction: "vertical",
    		}
    	}

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

    	// makes blank the value of user answer xml and also of html,css and js editors
    	function reset() {
    		// makes blank the value of html editor
    		htmlEditor.setValue("");

    		// makes blank the value of css editor
    		cssEditor.setValue("");

    		// makes blank the value of js editor
    		jsEditor.setValue("");

    		// makes blank value of user answer xml
    		//jQuery("#special_module_user_xml").val(""); // Replaced
    		document.getElementById("special_module_user_xml").value = "";

    		// makes blank the value of 'uaXML' of window object
    		window.uaXML = "";
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

    	const writable_props = ["xml", "getChildXml", "toggleMode", "isReview"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WebAuthoring> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
    		if ("getChildXml" in $$props) $$invalidate(6, getChildXml = $$props.getChildXml);
    		if ("toggleMode" in $$props) $$invalidate(7, toggleMode = $$props.toggleMode);
    		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
    	};

    	$$self.$capture_state = () => ({
    		l,
    		onMount,
    		beforeUpdate,
    		Checkbox,
    		writable,
    		AH,
    		xml,
    		getChildXml,
    		toggleMode,
    		isReview,
    		isPreview,
    		defaultStartXml,
    		isCaption,
    		isAutograde,
    		mode,
    		htmlEditor,
    		cssEditor,
    		jsEditor,
    		showHTML,
    		readHTML,
    		showCSS,
    		readCSS,
    		showJS,
    		readJS,
    		state,
    		disabled_hide,
    		stateData,
    		unsubscribe,
    		changeTheme,
    		generateXml,
    		runCode,
    		enableAutograde,
    		handleDisable,
    		splitter,
    		testCasesXml,
    		newSource,
    		getCode,
    		prepareSource,
    		renderCodeMirror,
    		stringBetween: stringBetween$1,
    		findAttribute: findAttribute$1,
    		getCase,
    		unRenderPlayer: unRenderPlayer$1,
    		renderPlayer,
    		reset,
    		parseXML
    	});

    	$$self.$inject_state = $$props => {
    		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
    		if ("getChildXml" in $$props) $$invalidate(6, getChildXml = $$props.getChildXml);
    		if ("toggleMode" in $$props) $$invalidate(7, toggleMode = $$props.toggleMode);
    		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
    		if ("isPreview" in $$props) isPreview = $$props.isPreview;
    		if ("defaultStartXml" in $$props) defaultStartXml = $$props.defaultStartXml;
    		if ("isCaption" in $$props) isCaption = $$props.isCaption;
    		if ("isAutograde" in $$props) isAutograde = $$props.isAutograde;
    		if ("mode" in $$props) mode = $$props.mode;
    		if ("htmlEditor" in $$props) htmlEditor = $$props.htmlEditor;
    		if ("cssEditor" in $$props) cssEditor = $$props.cssEditor;
    		if ("jsEditor" in $$props) jsEditor = $$props.jsEditor;
    		if ("showHTML" in $$props) showHTML = $$props.showHTML;
    		if ("readHTML" in $$props) readHTML = $$props.readHTML;
    		if ("showCSS" in $$props) showCSS = $$props.showCSS;
    		if ("readCSS" in $$props) readCSS = $$props.readCSS;
    		if ("showJS" in $$props) showJS = $$props.showJS;
    		if ("readJS" in $$props) readJS = $$props.readJS;
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("disabled_hide" in $$props) disabled_hide = $$props.disabled_hide;
    		if ("stateData" in $$props) stateData = $$props.stateData;
    		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		state,
    		changeTheme,
    		generateXml,
    		runCode,
    		enableAutograde,
    		xml,
    		getChildXml,
    		toggleMode,
    		isReview
    	];
    }

    class WebAuthoring extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				xml: 5,
    				getChildXml: 6,
    				toggleMode: 7,
    				isReview: 8
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WebAuthoring",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[5] === undefined && !("xml" in props)) {
    			console.warn("<WebAuthoring> was created without expected prop 'xml'");
    		}

    		if (/*getChildXml*/ ctx[6] === undefined && !("getChildXml" in props)) {
    			console.warn("<WebAuthoring> was created without expected prop 'getChildXml'");
    		}

    		if (/*toggleMode*/ ctx[7] === undefined && !("toggleMode" in props)) {
    			console.warn("<WebAuthoring> was created without expected prop 'toggleMode'");
    		}

    		if (/*isReview*/ ctx[8] === undefined && !("isReview" in props)) {
    			console.warn("<WebAuthoring> was created without expected prop 'isReview'");
    		}
    	}

    	get xml() {
    		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getChildXml() {
    		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getChildXml(value) {
    		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggleMode() {
    		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggleMode(value) {
    		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMWeb/Web.svelte generated by Svelte v3.34.0 */

    const { console: console_1$2 } = globals;
    const file$8 = "clsSMWeb/Web.svelte";

    // (236:40) 
    function create_if_block_2(ctx) {
    	let webauthoring;
    	let current;

    	webauthoring = new WebAuthoring({
    			props: {
    				key: "2",
    				xml: /*xml*/ ctx[1],
    				toggleMode: /*toggleMode*/ ctx[3],
    				getChildXml: /*getChildXml*/ ctx[4],
    				showAns: /*showAns*/ ctx[5],
    				editorState: /*editorState*/ ctx[2],
    				isReview: /*isReview*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(webauthoring.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(webauthoring, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const webauthoring_changes = {};
    			if (dirty & /*xml*/ 2) webauthoring_changes.xml = /*xml*/ ctx[1];
    			if (dirty & /*toggleMode*/ 8) webauthoring_changes.toggleMode = /*toggleMode*/ ctx[3];
    			if (dirty & /*getChildXml*/ 16) webauthoring_changes.getChildXml = /*getChildXml*/ ctx[4];
    			if (dirty & /*showAns*/ 32) webauthoring_changes.showAns = /*showAns*/ ctx[5];
    			if (dirty & /*editorState*/ 4) webauthoring_changes.editorState = /*editorState*/ ctx[2];
    			if (dirty & /*isReview*/ 64) webauthoring_changes.isReview = /*isReview*/ ctx[6];
    			webauthoring.$set(webauthoring_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(webauthoring.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(webauthoring.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(webauthoring, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(236:40) ",
    		ctx
    	});

    	return block;
    }

    // (228:40) 
    function create_if_block_1$1(ctx) {
    	let webpreview;
    	let current;

    	webpreview = new WebPreview({
    			props: {
    				key: "1",
    				xml: /*xml*/ ctx[1],
    				inQuizPlayer: /*editorState*/ ctx[2] ? 0 : 1,
    				editorState: /*editorState*/ ctx[2],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(webpreview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(webpreview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const webpreview_changes = {};
    			if (dirty & /*xml*/ 2) webpreview_changes.xml = /*xml*/ ctx[1];
    			if (dirty & /*editorState*/ 4) webpreview_changes.inQuizPlayer = /*editorState*/ ctx[2] ? 0 : 1;
    			if (dirty & /*editorState*/ 4) webpreview_changes.editorState = /*editorState*/ ctx[2];
    			if (dirty & /*uxml*/ 1) webpreview_changes.uxml = /*uxml*/ ctx[0];
    			webpreview.$set(webpreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(webpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(webpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(webpreview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(228:40) ",
    		ctx
    	});

    	return block;
    }

    // (226:2) {#if state.currentComponent == 2}
    function create_if_block$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(226:2) {#if state.currentComponent == 2}",
    		ctx
    	});

    	return block;
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

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "id", "webModule");
    			add_location(div, file$8, 224, 1, 9622);
    			add_location(main, file$8, 223, 0, 9614);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
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
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
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
    	validate_slots("Web", slots, []);
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { uaXML } = $$props;
    	uxml = uxml ? uxml : uaXML;
    	let { inEditor } = $$props;
    	let { editorState } = $$props;
    	let { toggleMode } = $$props;
    	let { getChildXml } = $$props;
    	let { showAns } = $$props;
    	let { setInlineEditor } = $$props;
    	let { isReview } = $$props;
    	let isHover;
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
    					AH.select("#headerTitle", "html", l.preview);

    					// shows the label 'Check Answer' in inline way
    					AH.select("#answerCheck", "css", {
    						visibility: "visible",
    						display: "inline-block"
    					});

    					// used for show the tooltip
    					AH.enableBsAll("[data-bs-toggle=\"tooltip\"]", "Tooltip");

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

    					AH.selectAll("#title", "css", { position: "relative", top: "5px" });

    					//	AH.select("#title", "css", {display:'none'});
    					AH.select("#title", "html", `<div id="tilteShow">${titleData}</div>`);

    					// hides the 'Stem' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'stemShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'stemData'
    					//	jQuery('#stem').empty().hide().after('<div id="stemShow">' + get_ucsyntax(stemData) + '</div>'); // Replaced
    					AH.empty("#stem");

    					//AH.select("#stem", 'css',{display:'none'});
    					AH.selectAll("#stem", "css", { position: "relative", top: "5px" });

    					AH.select("#stem", "html", `<div id="stemShow">${get_ucsyntax(stemData)}</div>`);

    					// hides the 'Remediation' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'remediationShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'remediationData'
    					//jQuery('#remediation').hide().empty().after('<div id="remediationShow">' + get_ucsyntax(remediationData) + '</div>'); Replaced
    					AH.empty("#remediation");

    					AH.selectAll("#remediation", "css", { position: "relative", top: "5px" });

    					//AH.select("#remediation","css",{display:'none'});
    					AH.select("#remediation", "html", `<div id="remediationShow">${get_ucsyntax(remediationData)}</div>`);

    					AH.selectAll("#externalInputs, #authoringActions, #addTestCase", "hide");

    					// loads preview component
    					$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={xml} inQuizPlayer={0} key={1} />;
    				} else {
    					// sets the value of variable isPreview 0 that means loads the authoring component
    					isPreview = 0;

    					// makes user answer value blank
    					//window.uaXML = '';
    					// hidess the label 'Check Answer'
    					AH.select("#answerCheck", "css", { visibility: "hidden", display: "none" });

    					// sets the content 'Authoring' of header title that can be seen on the top of the 'Title' label
    					AH.select("#headerTitle", "html", l.authoring);

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

    	// called once throughtout the program execution just after render method
    	onMount(async () => {
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

    	const writable_props = [
    		"xml",
    		"uxml",
    		"uaXML",
    		"inEditor",
    		"editorState",
    		"toggleMode",
    		"getChildXml",
    		"showAns",
    		"setInlineEditor",
    		"isReview"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Web> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(1, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(0, uxml = $$props.uxml);
    		if ("uaXML" in $$props) $$invalidate(8, uaXML = $$props.uaXML);
    		if ("inEditor" in $$props) $$invalidate(9, inEditor = $$props.inEditor);
    		if ("editorState" in $$props) $$invalidate(2, editorState = $$props.editorState);
    		if ("toggleMode" in $$props) $$invalidate(3, toggleMode = $$props.toggleMode);
    		if ("getChildXml" in $$props) $$invalidate(4, getChildXml = $$props.getChildXml);
    		if ("showAns" in $$props) $$invalidate(5, showAns = $$props.showAns);
    		if ("setInlineEditor" in $$props) $$invalidate(10, setInlineEditor = $$props.setInlineEditor);
    		if ("isReview" in $$props) $$invalidate(6, isReview = $$props.isReview);
    	};

    	$$self.$capture_state = () => ({
    		WebPreview,
    		WebAuthoring,
    		l,
    		beforeUpdate,
    		onMount,
    		tick,
    		writable,
    		AH,
    		xml,
    		uxml,
    		uaXML,
    		inEditor,
    		editorState,
    		toggleMode,
    		getChildXml,
    		showAns,
    		setInlineEditor,
    		isReview,
    		isHover,
    		isPreview,
    		state,
    		DataState,
    		unsubscribe,
    		getComp,
    		unRenderPlayer,
    		renderPlayer
    	});

    	$$self.$inject_state = $$props => {
    		if ("xml" in $$props) $$invalidate(1, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(0, uxml = $$props.uxml);
    		if ("uaXML" in $$props) $$invalidate(8, uaXML = $$props.uaXML);
    		if ("inEditor" in $$props) $$invalidate(9, inEditor = $$props.inEditor);
    		if ("editorState" in $$props) $$invalidate(2, editorState = $$props.editorState);
    		if ("toggleMode" in $$props) $$invalidate(3, toggleMode = $$props.toggleMode);
    		if ("getChildXml" in $$props) $$invalidate(4, getChildXml = $$props.getChildXml);
    		if ("showAns" in $$props) $$invalidate(5, showAns = $$props.showAns);
    		if ("setInlineEditor" in $$props) $$invalidate(10, setInlineEditor = $$props.setInlineEditor);
    		if ("isReview" in $$props) $$invalidate(6, isReview = $$props.isReview);
    		if ("isHover" in $$props) isHover = $$props.isHover;
    		if ("isPreview" in $$props) isPreview = $$props.isPreview;
    		if ("state" in $$props) $$invalidate(7, state = $$props.state);
    		if ("DataState" in $$props) DataState = $$props.DataState;
    		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		uxml,
    		xml,
    		editorState,
    		toggleMode,
    		getChildXml,
    		showAns,
    		isReview,
    		state,
    		uaXML,
    		inEditor,
    		setInlineEditor
    	];
    }

    class Web extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			xml: 1,
    			uxml: 0,
    			uaXML: 8,
    			inEditor: 9,
    			editorState: 2,
    			toggleMode: 3,
    			getChildXml: 4,
    			showAns: 5,
    			setInlineEditor: 10,
    			isReview: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Web",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[1] === undefined && !("xml" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[0] === undefined && !("uxml" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'uxml'");
    		}

    		if (/*uaXML*/ ctx[8] === undefined && !("uaXML" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'uaXML'");
    		}

    		if (/*inEditor*/ ctx[9] === undefined && !("inEditor" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'inEditor'");
    		}

    		if (/*editorState*/ ctx[2] === undefined && !("editorState" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'editorState'");
    		}

    		if (/*toggleMode*/ ctx[3] === undefined && !("toggleMode" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'toggleMode'");
    		}

    		if (/*getChildXml*/ ctx[4] === undefined && !("getChildXml" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'getChildXml'");
    		}

    		if (/*showAns*/ ctx[5] === undefined && !("showAns" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'showAns'");
    		}

    		if (/*setInlineEditor*/ ctx[10] === undefined && !("setInlineEditor" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'setInlineEditor'");
    		}

    		if (/*isReview*/ ctx[6] === undefined && !("isReview" in props)) {
    			console_1$2.warn("<Web> was created without expected prop 'isReview'");
    		}
    	}

    	get xml() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uaXML() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uaXML(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inEditor() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inEditor(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggleMode() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggleMode(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getChildXml() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getChildXml(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setInlineEditor() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setInlineEditor(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const defXMl = '';

    const app = new Web({
    	target: document.getElementById(window.moduleContainer) || document.body,
    	props: {
    		xml: window.QXML || defXMl,
    		uxml: window.uaXML,
    		ansStatus: 0,
    		isReview: window.isReviewMode || false,
    		smqCounter : window.idCounter,
    		CM : window.idCounter
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle_q22.js.map
