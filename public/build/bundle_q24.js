
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
    function append_styles(target, style_sheet_id, styles) {
        var _a;
        const append_styles_to = get_root_for_styles(target);
        if (!((_a = append_styles_to) === null || _a === void 0 ? void 0 : _a.getElementById(style_sheet_id))) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_node(node) {
        if (!node)
            return document;
        return (node.getRootNode ? node.getRootNode() : node.ownerDocument); // check for getRootNode because IE is still supported
    }
    function get_root_for_styles(node) {
        const root = get_root_for_node(node);
        return root.host ? root : root;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_styles(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
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
        const doc = get_root_for_node(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
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
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
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
                started = true;
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
            const d = (program.b - t);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
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
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.40.2' }, detail), true));
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

    /* node_modules\svelte-mui\src\Ripple.svelte generated by Svelte v3.40.2 */

    const { console: console_1 } = globals;
    const file = "node_modules\\svelte-mui\\src\\Ripple.svelte";

    function add_css(target) {
    	append_styles(target, "svelte-po4fcb", ".ripple.svelte-po4fcb{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;border-radius:inherit;color:inherit;pointer-events:none;z-index:0;contain:strict}.ripple.svelte-po4fcb .animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;opacity:0;pointer-events:none;overflow:hidden;will-change:transform, opacity}.ripple.svelte-po4fcb .animation--enter{transition:none}.ripple.svelte-po4fcb .animation--in{transition:opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n\t\t\topacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)}.ripple.svelte-po4fcb .animation--out{transition:opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmlwcGxlLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUF5TEMsT0FBTyxjQUFDLENBQUEsQUFDUCxPQUFPLENBQUUsS0FBSyxDQUNkLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxDQUFDLENBQ04sSUFBSSxDQUFFLENBQUMsQ0FDUCxLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxDQUFDLENBQ1QsUUFBUSxDQUFFLE1BQU0sQ0FDaEIsYUFBYSxDQUFFLE9BQU8sQ0FDdEIsS0FBSyxDQUFFLE9BQU8sQ0FDZCxjQUFjLENBQUUsSUFBSSxDQUNwQixPQUFPLENBQUUsQ0FBQyxDQUNWLE9BQU8sQ0FBRSxNQUFNLEFBQ2hCLENBQUEsQUFDQSxxQkFBTyxDQUFDLEFBQVEsVUFBVSxBQUFFLENBQUEsQUFDM0IsS0FBSyxDQUFFLE9BQU8sQ0FDZCxRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsQ0FBQyxDQUNOLElBQUksQ0FBRSxDQUFDLENBQ1AsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsT0FBTyxDQUFFLENBQUMsQ0FDVixjQUFjLENBQUUsSUFBSSxDQUNwQixRQUFRLENBQUUsTUFBTSxDQUNoQixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxBQUNoQyxDQUFBLEFBQ0EscUJBQU8sQ0FBQyxBQUFRLGlCQUFpQixBQUFFLENBQUEsQUFDbEMsVUFBVSxDQUFFLElBQUksQUFDakIsQ0FBQSxBQUNBLHFCQUFPLENBQUMsQUFBUSxjQUFjLEFBQUUsQ0FBQSxBQUMvQixVQUFVLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNyRCxVQUFVLENBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFDM0MsQ0FBQSxBQUNBLHFCQUFPLENBQUMsQUFBUSxlQUFlLEFBQUUsQ0FBQSxBQUNoQyxVQUFVLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUN0RCxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlJpcHBsZS5zdmVsdGUiXX0= */");
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
    	return e.constructor.name === 'TouchEvent';
    }

    function transform(el, value) {
    	el.style['transform'] = value;
    	el.style['webkitTransform'] = value;
    }

    function opacity(el, value) {
    	el.style['opacity'] = value.toString();
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
    	const hideEvents = ['touchcancel', 'mouseleave', 'dragstart'];
    	let container = event.currentTarget || event.target;

    	if (container && !container.classList.contains('ripple')) {
    		container = container.querySelector('.ripple');
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
    	const wave = document.createElement('span');

    	const { radius, scale, x, y, centerX, centerY } = calculate(event, container);
    	const color = container.dataset.color;
    	const size = `${radius * 2}px`;
    	wave.className = 'animation';
    	wave.style.width = size;
    	wave.style.height = size;
    	wave.style.background = color;
    	wave.classList.add('animation--enter');
    	wave.classList.add('animation--visible');
    	transform(wave, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
    	opacity(wave, 0);
    	wave.dataset.activated = String(performance.now());
    	container.appendChild(wave);

    	setTimeout(
    		() => {
    			wave.classList.remove('animation--enter');
    			wave.classList.add('animation--in');
    			transform(wave, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
    			opacity(wave, 0.25);
    		},
    		0
    	);

    	const releaseEvent = eventType === 'mousedown' ? 'mouseup' : 'touchend';

    	const onRelease = function () {
    		document.removeEventListener(releaseEvent, onRelease);

    		hideEvents.forEach(name => {
    			document.removeEventListener(name, onRelease);
    		});

    		const diff = performance.now() - Number(wave.dataset.activated);
    		const delay = Math.max(250 - diff, 0);

    		setTimeout(
    			() => {
    				wave.classList.remove('animation--in');
    				wave.classList.add('animation--out');
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
    	validate_slots('Ripple', slots, []);
    	let { center = false } = $$props;
    	let { circle = false } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let el;
    	let trigEl;

    	onMount(async () => {
    		await tick();

    		try {
    			if (center) {
    				$$invalidate(0, el.dataset.center = 'true', el);
    			}

    			if (circle) {
    				$$invalidate(0, el.dataset.circle = 'true', el);
    			}

    			$$invalidate(0, el.dataset.color = color, el);
    			trigEl = el.parentElement;
    		} catch(err) {
    			
    		} // eslint-disable-line

    		if (!trigEl) {
    			console.error('Ripple: Trigger element not found.');
    			return;
    		}

    		let style = window.getComputedStyle(trigEl);

    		if (style.position.length === 0 || style.position === 'static') {
    			trigEl.style.position = 'relative';
    		}

    		trigEl.addEventListener('touchstart', onTouchStart, { passive: true });
    		trigEl.addEventListener('mousedown', onMouseDown, { passive: true });
    	});

    	onDestroy(() => {
    		if (!trigEl) {
    			return;
    		}

    		trigEl.removeEventListener('mousedown', onMouseDown);
    		trigEl.removeEventListener('touchstart', onTouchStart);
    	});

    	const writable_props = ['center', 'circle', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Ripple> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('circle' in $$props) $$invalidate(2, circle = $$props.circle);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
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
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('circle' in $$props) $$invalidate(2, circle = $$props.circle);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('trigEl' in $$props) trigEl = $$props.trigEl;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [el, center, circle, color, div_binding];
    }

    class Ripple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { center: 1, circle: 2, color: 3 }, add_css);

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

    /* node_modules\svelte-mui\src\Button.svelte generated by Svelte v3.40.2 */
    const file$1 = "node_modules\\svelte-mui\\src\\Button.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-6bcb3a", "button.svelte-6bcb3a:disabled{cursor:default}button.svelte-6bcb3a{cursor:pointer;font-family:Roboto, Helvetica, sans-serif;font-family:var(--button-font-family, Roboto, Helvetica, sans-serif);font-size:0.875rem;font-weight:500;letter-spacing:0.75px;text-decoration:none;text-transform:uppercase;will-change:transform, opacity;margin:0;padding:0 16px;display:-ms-inline-flexbox;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;height:36px;border:none;outline:none;line-height:inherit;user-select:none;overflow:hidden;vertical-align:middle;border-radius:4px}button.svelte-6bcb3a::-moz-focus-inner{border:0}button.svelte-6bcb3a:-moz-focusring{outline:none}button.svelte-6bcb3a:before{box-sizing:inherit;border-radius:inherit;color:inherit;bottom:0;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.2s cubic-bezier(0.25, 0.8, 0.5, 1);will-change:background-color, opacity}.toggle.svelte-6bcb3a:before{box-sizing:content-box}.active.svelte-6bcb3a:before{background-color:currentColor;opacity:0.3}.raised.svelte-6bcb3a{box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 5px 0 rgba(0, 0, 0, 0.12)}.outlined.svelte-6bcb3a{padding:0 14px;border-style:solid;border-width:2px}.shaped.svelte-6bcb3a{border-radius:18px}.dense.svelte-6bcb3a{height:32px}.icon-button.svelte-6bcb3a{line-height:0.5;border-radius:50%;padding:8px;width:40px;height:40px;vertical-align:middle}.icon-button.outlined.svelte-6bcb3a{padding:6px}.icon-button.fab.svelte-6bcb3a{border:none;width:56px;height:56px;box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 18px 0 rgba(0, 0, 0, 0.12)}.icon-button.dense.svelte-6bcb3a{width:36px;height:36px}.icon-button.fab.dense.svelte-6bcb3a{width:40px;height:40px}.outlined.svelte-6bcb3a:not(.shaped) .ripple{border-radius:0 !important}.full-width.svelte-6bcb3a{width:100%}@media(hover: hover){button.svelte-6bcb3a:hover:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}button.focus-visible.svelte-6bcb3a:focus:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.3}button.focus-visible.toggle.svelte-6bcb3a:focus:not(.active):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUF1SUMsb0JBQU0sU0FBUyxBQUFDLENBQUEsQUFDZixNQUFNLENBQUUsT0FBTyxBQUNoQixDQUFBLEFBQ0EsTUFBTSxjQUFDLENBQUEsQUFDTixNQUFNLENBQUUsT0FBTyxDQUNmLFdBQVcsQ0FBRSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBRTFDLFdBQVcsQ0FBRSxJQUFJLG9CQUFvQixDQUFDLDhCQUE4QixDQUFDLENBQ3JFLFNBQVMsQ0FBRSxRQUFRLENBQ25CLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGVBQWUsQ0FBRSxJQUFJLENBQ3JCLGNBQWMsQ0FBRSxTQUFTLENBQ3pCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQy9CLE1BQU0sQ0FBRSxDQUFDLENBQ1QsT0FBTyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2YsT0FBTyxDQUFFLGtCQUFrQixDQUMzQixPQUFPLENBQUUsV0FBVyxDQUNwQixRQUFRLENBQUUsUUFBUSxDQUNsQixXQUFXLENBQUUsTUFBTSxDQUNuQixlQUFlLENBQUUsTUFBTSxDQUN2QixVQUFVLENBQUUsVUFBVSxDQUN0QixNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLElBQUksQ0FDYixXQUFXLENBQUUsT0FBTyxDQUNwQixXQUFXLENBQUUsSUFBSSxDQUNqQixRQUFRLENBQUUsTUFBTSxDQUNoQixjQUFjLENBQUUsTUFBTSxDQUN0QixhQUFhLENBQUUsR0FBRyxBQUNuQixDQUFBLEFBQ0Esb0JBQU0sa0JBQWtCLEFBQUMsQ0FBQSxBQUN4QixNQUFNLENBQUUsQ0FBQyxBQUNWLENBQUEsQUFDQSxvQkFBTSxlQUFlLEFBQUMsQ0FBQSxBQUNyQixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDQSxvQkFBTSxPQUFPLEFBQUMsQ0FBQSxBQUNiLFVBQVUsQ0FBRSxPQUFPLENBQ25CLGFBQWEsQ0FBRSxPQUFPLENBQ3RCLEtBQUssQ0FBRSxPQUFPLENBQ2QsTUFBTSxDQUFFLENBQUMsQ0FDVCxPQUFPLENBQUUsRUFBRSxDQUNYLElBQUksQ0FBRSxDQUFDLENBQ1AsT0FBTyxDQUFFLENBQUMsQ0FDVixjQUFjLENBQUUsSUFBSSxDQUNwQixRQUFRLENBQUUsUUFBUSxDQUNsQixLQUFLLENBQUUsQ0FBQyxDQUNSLEdBQUcsQ0FBRSxDQUFDLENBQ04sVUFBVSxDQUFFLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNoRCxXQUFXLENBQUUsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLEFBQ3ZDLENBQUEsQUFDQSxxQkFBTyxPQUFPLEFBQUMsQ0FBQSxBQUNkLFVBQVUsQ0FBRSxXQUFXLEFBQ3hCLENBQUEsQUFDQSxxQkFBTyxPQUFPLEFBQUMsQ0FBQSxBQUNkLGdCQUFnQixDQUFFLFlBQVksQ0FDOUIsT0FBTyxDQUFFLEdBQUcsQUFDYixDQUFBLEFBRUEsT0FBTyxjQUFDLENBQUEsQUFDUCxVQUFVLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUM3RSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQUFDakMsQ0FBQSxBQUNBLFNBQVMsY0FBQyxDQUFBLEFBQ1QsT0FBTyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2YsWUFBWSxDQUFFLEtBQUssQ0FDbkIsWUFBWSxDQUFFLEdBQUcsQUFDbEIsQ0FBQSxBQUNBLE9BQU8sY0FBQyxDQUFBLEFBQ1AsYUFBYSxDQUFFLElBQUksQUFDcEIsQ0FBQSxBQUNBLE1BQU0sY0FBQyxDQUFBLEFBQ04sTUFBTSxDQUFFLElBQUksQUFDYixDQUFBLEFBRUEsWUFBWSxjQUFDLENBQUEsQUFDWixXQUFXLENBQUUsR0FBRyxDQUNoQixhQUFhLENBQUUsR0FBRyxDQUNsQixPQUFPLENBQUUsR0FBRyxDQUNaLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixjQUFjLENBQUUsTUFBTSxBQUN2QixDQUFBLEFBQ0EsWUFBWSxTQUFTLGNBQUMsQ0FBQSxBQUNyQixPQUFPLENBQUUsR0FBRyxBQUNiLENBQUEsQUFDQSxZQUFZLElBQUksY0FBQyxDQUFBLEFBQ2hCLE1BQU0sQ0FBRSxJQUFJLENBQ1osS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzlFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxBQUNsQyxDQUFBLEFBQ0EsWUFBWSxNQUFNLGNBQUMsQ0FBQSxBQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2IsQ0FBQSxBQUVBLFlBQVksSUFBSSxNQUFNLGNBQUMsQ0FBQSxBQUN0QixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2IsQ0FBQSxBQUVBLHVCQUFTLEtBQUssT0FBTyxDQUFDLENBQUMsQUFBUSxPQUFPLEFBQUUsQ0FBQSxBQUN2QyxhQUFhLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDNUIsQ0FBQSxBQUVBLFdBQVcsY0FBQyxDQUFBLEFBQ1gsS0FBSyxDQUFFLElBQUksQUFDWixDQUFBLEFBRUEsTUFBTSxBQUFDLFFBQVEsS0FBSyxDQUFDLEFBQUMsQ0FBQSxBQUNyQixvQkFBTSxNQUFNLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxPQUFPLEFBQUMsQ0FBQSxBQUMvRCxnQkFBZ0IsQ0FBRSxZQUFZLENBQzlCLE9BQU8sQ0FBRSxJQUFJLEFBQ2QsQ0FBQSxBQUNBLE1BQU0sNEJBQWMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsT0FBTyxBQUFDLENBQUEsQUFDN0UsZ0JBQWdCLENBQUUsWUFBWSxDQUM5QixPQUFPLENBQUUsR0FBRyxBQUNiLENBQUEsQUFDQSxNQUFNLGNBQWMscUJBQU8sTUFBTSxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsT0FBTyxBQUFDLENBQUEsQUFDcEYsZ0JBQWdCLENBQUUsWUFBWSxDQUM5QixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDRCxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkJ1dHRvbi5zdmVsdGUiXX0= */");
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
    			if (button.autofocus) button.focus();
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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], !current ? -1 : dirty, null, null);
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
    	validate_slots('Button', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const events = getEventsAction(current_component);
    	let { class: className = '' } = $$props;
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
    		let svgs = elm.getElementsByTagName('svg');
    		let len = svgs.length;

    		for (let i = 0; i < len; i++) {
    			svgs[i].setAttribute('width', iconSize + (toggle && !icon ? 2 : 0));
    			svgs[i].setAttribute('height', iconSize + (toggle && !icon ? 2 : 0));
    		}

    		$$invalidate(13, elm.style.backgroundColor = raised || unelevated ? color : 'transparent', elm);
    		let bg = getComputedStyle(elm).getPropertyValue('background-color');

    		$$invalidate(
    			13,
    			elm.style.color = raised || unelevated
    			? luminance(bg) > 0.5 ? '#000' : '#fff'
    			: color,
    			elm
    		);
    	});

    	function onclick(e) {
    		if (toggle) {
    			$$invalidate(0, active = !active);
    			dispatch('change', active);
    		}
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			elm = $$value;
    			$$invalidate(13, elm);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ('fab' in $$new_props) $$invalidate(4, fab = $$new_props.fab);
    		if ('dense' in $$new_props) $$invalidate(5, dense = $$new_props.dense);
    		if ('raised' in $$new_props) $$invalidate(6, raised = $$new_props.raised);
    		if ('unelevated' in $$new_props) $$invalidate(7, unelevated = $$new_props.unelevated);
    		if ('outlined' in $$new_props) $$invalidate(8, outlined = $$new_props.outlined);
    		if ('shaped' in $$new_props) $$invalidate(9, shaped = $$new_props.shaped);
    		if ('color' in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ('ripple' in $$new_props) $$invalidate(10, ripple = $$new_props.ripple);
    		if ('toggle' in $$new_props) $$invalidate(11, toggle = $$new_props.toggle);
    		if ('active' in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ('fullWidth' in $$new_props) $$invalidate(12, fullWidth = $$new_props.fullWidth);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
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
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ('fab' in $$props) $$invalidate(4, fab = $$new_props.fab);
    		if ('dense' in $$props) $$invalidate(5, dense = $$new_props.dense);
    		if ('raised' in $$props) $$invalidate(6, raised = $$new_props.raised);
    		if ('unelevated' in $$props) $$invalidate(7, unelevated = $$new_props.unelevated);
    		if ('outlined' in $$props) $$invalidate(8, outlined = $$new_props.outlined);
    		if ('shaped' in $$props) $$invalidate(9, shaped = $$new_props.shaped);
    		if ('color' in $$props) $$invalidate(17, color = $$new_props.color);
    		if ('ripple' in $$props) $$invalidate(10, ripple = $$new_props.ripple);
    		if ('toggle' in $$props) $$invalidate(11, toggle = $$new_props.toggle);
    		if ('active' in $$props) $$invalidate(0, active = $$new_props.active);
    		if ('fullWidth' in $$props) $$invalidate(12, fullWidth = $$new_props.fullWidth);
    		if ('elm' in $$props) $$invalidate(13, elm = $$new_props.elm);
    		if ('attrs' in $$props) $$invalidate(14, attrs = $$new_props.attrs);
    		if ('iconSize' in $$props) iconSize = $$new_props.iconSize;
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
    			 if (color === 'primary') {
    				$$invalidate(17, color = islegacy() ? '#1976d2' : 'var(--primary, #1976d2)');
    			} else if (color == 'accent') {
    				$$invalidate(17, color = islegacy() ? '#f50057' : 'var(--accent, #f50057)');
    			} else if (!color && elm) {
    				$$invalidate(17, color = elm.style.color || elm.parentElement.style.color || (islegacy() ? '#333' : 'var(--color, #333)'));
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

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
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
    			},
    			add_css$1
    		);

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

    /* node_modules\svelte-mui\src\Dialog.svelte generated by Svelte v3.40.2 */
    const file$2 = "node_modules\\svelte-mui\\src\\Dialog.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-1pkw9hl", ".overlay.svelte-1pkw9hl{background-color:rgba(0, 0, 0, 0.5);cursor:pointer;position:fixed;left:0;top:0;right:0;bottom:0;z-index:30;display:flex;justify-content:center;align-items:center}.dialog.svelte-1pkw9hl{position:relative;font-size:1rem;background:#eee;background:var(--bg-panel, #eee);border-radius:4px;cursor:auto;box-shadow:0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),\n\t\t\t0 9px 46px 8px rgba(0, 0, 0, 0.12);z-index:40;max-height:80%;overflow-x:hidden;overflow-y:auto}.dialog.svelte-1pkw9hl:focus{outline:none}.dialog.svelte-1pkw9hl::-moz-focus-inner{border:0}.dialog.svelte-1pkw9hl:-moz-focusring{outline:none}div.svelte-1pkw9hl .actions{min-height:48px;padding:8px;display:flex;align-items:center}div.svelte-1pkw9hl .center{justify-content:center}div.svelte-1pkw9hl .left{justify-content:flex-start}div.svelte-1pkw9hl .right{justify-content:flex-end}.title.svelte-1pkw9hl{padding:16px 16px 12px;font-size:24px;line-height:36px;background:rgba(0, 0, 0, 0.1);background:var(--divider, rgba(0, 0, 0, 0.1))}.content.svelte-1pkw9hl{margin:16px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFzSUMsUUFBUSxlQUFDLENBQUEsQUFDUixnQkFBZ0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxNQUFNLENBQUUsT0FBTyxDQUNmLFFBQVEsQ0FBRSxLQUFLLENBQ2YsSUFBSSxDQUFFLENBQUMsQ0FDUCxHQUFHLENBQUUsQ0FBQyxDQUNOLEtBQUssQ0FBRSxDQUFDLENBQ1IsTUFBTSxDQUFFLENBQUMsQ0FDVCxPQUFPLENBQUUsRUFBRSxDQUVYLE9BQU8sQ0FBRSxJQUFJLENBQ2IsZUFBZSxDQUFFLE1BQU0sQ0FDdkIsV0FBVyxDQUFFLE1BQU0sQUFDcEIsQ0FBQSxBQUVBLE9BQU8sZUFBQyxDQUFBLEFBQ1AsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixVQUFVLENBQUUsSUFBSSxDQUVoQixVQUFVLENBQUUsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQ2pDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDbkYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ25DLE9BQU8sQ0FBRSxFQUFFLENBQ1gsVUFBVSxDQUFFLEdBQUcsQ0FDZixVQUFVLENBQUUsTUFBTSxDQUNsQixVQUFVLENBQUUsSUFBSSxBQUNqQixDQUFBLEFBQ0Esc0JBQU8sTUFBTSxBQUFDLENBQUEsQUFDYixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDQSxzQkFBTyxrQkFBa0IsQUFBQyxDQUFBLEFBQ3pCLE1BQU0sQ0FBRSxDQUFDLEFBQ1YsQ0FBQSxBQUNBLHNCQUFPLGVBQWUsQUFBQyxDQUFBLEFBQ3RCLE9BQU8sQ0FBRSxJQUFJLEFBQ2QsQ0FBQSxBQUNBLGtCQUFHLENBQUMsQUFBUSxRQUFRLEFBQUUsQ0FBQSxBQUNyQixVQUFVLENBQUUsSUFBSSxDQUNoQixPQUFPLENBQUUsR0FBRyxDQUNaLE9BQU8sQ0FBRSxJQUFJLENBQ2IsV0FBVyxDQUFFLE1BQU0sQUFDcEIsQ0FBQSxBQUNBLGtCQUFHLENBQUMsQUFBUSxPQUFPLEFBQUUsQ0FBQSxBQUNwQixlQUFlLENBQUUsTUFBTSxBQUN4QixDQUFBLEFBQ0Esa0JBQUcsQ0FBQyxBQUFRLEtBQUssQUFBRSxDQUFBLEFBQ2xCLGVBQWUsQ0FBRSxVQUFVLEFBQzVCLENBQUEsQUFDQSxrQkFBRyxDQUFDLEFBQVEsTUFBTSxBQUFFLENBQUEsQUFDbkIsZUFBZSxDQUFFLFFBQVEsQUFDMUIsQ0FBQSxBQUVBLE1BQU0sZUFBQyxDQUFBLEFBQ04sT0FBTyxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUN2QixTQUFTLENBQUUsSUFBSSxDQUNmLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUU5QixVQUFVLENBQUUsSUFBSSxTQUFTLENBQUMsbUJBQW1CLENBQUMsQUFDL0MsQ0FBQSxBQUNBLFFBQVEsZUFBQyxDQUFBLEFBQ1IsTUFBTSxDQUFFLElBQUksQUFDYixDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkRpYWxvZy5zdmVsdGUiXX0= */");
    }

    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_actions_slot_changes = dirty => ({});
    const get_actions_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (3:0) {#if visible}
    function create_if_block$1(ctx) {
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
    			class: div2_class_value = 'dialog ' + /*className*/ ctx[1]
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
    			add_location(div0, file$2, 26, 3, 604);
    			attr_dev(div1, "class", "content svelte-1pkw9hl");
    			add_location(div1, file$2, 30, 3, 664);
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "svelte-1pkw9hl", true);
    			add_location(div2, file$2, 13, 2, 284);
    			attr_dev(div3, "class", "overlay svelte-1pkw9hl");
    			add_location(div3, file$2, 3, 1, 78);
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
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[15], !current ? -1 : dirty, get_title_slot_changes, get_title_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], !current ? -1 : dirty, null, null);
    				}
    			}

    			if (actions_slot) {
    				if (actions_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot(actions_slot, actions_slot_template, ctx, /*$$scope*/ ctx[15], !current ? -1 : dirty, get_actions_slot_changes, get_actions_slot_context);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot(footer_slot, footer_slot_template, ctx, /*$$scope*/ ctx[15], !current ? -1 : dirty, get_footer_slot_changes, get_footer_slot_context);
    				}
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty & /*className*/ 2 && div2_class_value !== (div2_class_value = 'dialog ' + /*className*/ ctx[1])) && { class: div2_class_value },
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(3:0) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[0] && create_if_block$1(ctx);

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
    					if_block = create_if_block$1(ctx);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, ['title','default','actions','footer']);
    	const dispatch = createEventDispatcher();
    	const events = getEventsAction(current_component);
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
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
    			dispatch('close', params);
    			$$invalidate(0, visible = false);
    		}
    	}

    	async function onVisible() {
    		if (!elm) return;
    		await tick();
    		let inputs = elm.querySelectorAll('input:not([type="hidden"])');
    		let length = inputs.length;
    		let i = 0;

    		for (; i < length; i++) {
    			if (inputs[i].getAttribute('autofocus')) {
    				break;
    			}
    		}

    		i < length
    		? inputs[i].focus()
    		: length > 0 ? inputs[0].focus() : elm.focus();

    		dispatch('open');
    	}

    	function onKey(e) {
    		const esc = 'Escape';

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
    		bubble.call(this, $$self, event);
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
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
    		mouseDownOutside && !modal && close('clickOutside');
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('visible' in $$new_props) $$invalidate(0, visible = $$new_props.visible);
    		if ('width' in $$new_props) $$invalidate(3, width = $$new_props.width);
    		if ('modal' in $$new_props) $$invalidate(4, modal = $$new_props.modal);
    		if ('closeByEsc' in $$new_props) $$invalidate(12, closeByEsc = $$new_props.closeByEsc);
    		if ('beforeClose' in $$new_props) $$invalidate(13, beforeClose = $$new_props.beforeClose);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
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
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('visible' in $$props) $$invalidate(0, visible = $$new_props.visible);
    		if ('width' in $$props) $$invalidate(3, width = $$new_props.width);
    		if ('modal' in $$props) $$invalidate(4, modal = $$new_props.modal);
    		if ('closeByEsc' in $$props) $$invalidate(12, closeByEsc = $$new_props.closeByEsc);
    		if ('beforeClose' in $$props) $$invalidate(13, beforeClose = $$new_props.beforeClose);
    		if ('mouseDownOutside' in $$props) $$invalidate(5, mouseDownOutside = $$new_props.mouseDownOutside);
    		if ('attrs' in $$props) $$invalidate(6, attrs = $$new_props.attrs);
    		if ('mounted' in $$props) $$invalidate(14, mounted = $$new_props.mounted);
    		if ('elm' in $$props) $$invalidate(7, elm = $$new_props.elm);
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

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				class: 1,
    				style: 2,
    				visible: 0,
    				width: 3,
    				modal: 4,
    				closeByEsc: 12,
    				beforeClose: 13
    			},
    			add_css$2
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$2.name
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

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
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
        drag_drop_set_seq_msg: 'Drag and Drop to set sequence.',
        please_enter_reply_comment : 'Please enter the reply comment',
        exhibit_err: 'Exhibit player does not support this format',	
        embed_player: 'This player tag is used to embed a content.',
        icon_not_blank: 'Icons name should not be blank!',	
        check_net_update_ids: 'Something went wrong. Please check your network connection and update the IDs again.',
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
        left: 'Left',
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
        case_insensitive: 'Case-insensitive',
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
        on_click: 'On Click',
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
        item: 'Item',
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
        last_delete_msg: '"Click the last plotted point of the item to delete the item!',
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
            if (selected instanceof HTMLElement) {
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
    } 

    const JS = new JUI();

    /* helper\HelperAI.svelte generated by Svelte v3.40.2 */

    function onUserAnsChange(result) {
    	if (result) {
    		AH.select("#answer", 'checked', result.ans ? true : false);
    		AH.select("#special_module_user_xml", 'value', result.uXml);

    		if (typeof window == 'object') {
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

    /* helper\ItemHelper.svelte generated by Svelte v3.40.2 */
    const file$3 = "helper\\ItemHelper.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-ri6gyf", ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUhlbHBlci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBOEJZLGdFQUFnRSxBQUFFLENBQUMsQUFDdkUsS0FBSyxDQUFFLElBQUksVUFBVSxDQUNyQixrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQ25ELFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQzNDLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxDQUNuQyxZQUFZLENBQUUsT0FBTyxVQUFVLENBQy9CLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxBQUN2QyxDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkl0ZW1IZWxwZXIuc3ZlbHRlIl19 */");
    }

    // (23:0) {#if reviewMode}
    function create_if_block$2(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Correct Answer";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Your Answer";
    			attr_dev(button0, "tabindex", "0");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "mode", "c");
    			attr_dev(button0, "class", "btn btn-light correct-ans");
    			add_location(button0, file$3, 24, 8, 1076);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "mode", "u");
    			attr_dev(button1, "class", "btn btn-light your-ans active");
    			add_location(button1, file$3, 25, 8, 1214);
    			attr_dev(div, "class", "smControlerBtn btn-group mb-3");
    			attr_dev(div, "role", "group");
    			attr_dev(div, "aria-label", "Answer buttons");
    			add_location(div, file$3, 23, 4, 982);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleSmClick*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*handleSmClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:0) {#if reviewMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let center;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*reviewMode*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			center = element("center");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(button0, "tabindex", "0");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "h h-imp");
    			attr_dev(button0, "id", "set-review");
    			add_location(button0, file$3, 20, 0, 722);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file$3, 21, 0, 839);
    			add_location(center, file$3, 19, 0, 712);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, button0);
    			append_dev(center, t0);
    			append_dev(center, button1);
    			append_dev(center, t1);
    			if (if_block) if_block.m(center, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*reviewMode*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			if (if_block) if_block.d();
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
    	validate_slots('ItemHelper', slots, []);
    	let { reviewMode = false } = $$props;
    	let { handleReviewClick } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleSmClick(event) {
    		document.querySelectorAll('.smControlerBtn button').forEach(el => el.classList.remove('active'));
    		event.target.classList.add('active');
    		if (handleReviewClick) handleReviewClick(event.target.getAttribute('mode'), event);
    	}

    	const writable_props = ['reviewMode', 'handleReviewClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemHelper> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('setReview');
    	const click_handler_1 = () => dispatch('unsetReview');

    	$$self.$$set = $$props => {
    		if ('reviewMode' in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ('handleReviewClick' in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		reviewMode,
    		handleReviewClick,
    		dispatch,
    		handleSmClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('reviewMode' in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ('handleReviewClick' in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		reviewMode,
    		dispatch,
    		handleSmClick,
    		handleReviewClick,
    		click_handler,
    		click_handler_1
    	];
    }

    class ItemHelper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 }, add_css$3);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemHelper",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleReviewClick*/ ctx[3] === undefined && !('handleReviewClick' in props)) {
    			console.warn("<ItemHelper> was created without expected prop 'handleReviewClick'");
    		}
    	}

    	get reviewMode() {
    		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reviewMode(value) {
    		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleReviewClick() {
    		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleReviewClick(value) {
    		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

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

    var css_248z = ".CodeMirror{font-family:\"Courier New\", Courier, monospace;font-size: 17px;height:100%;color:#000;direction:ltr}.CodeMirror-lines{padding:4px 0}.CodeMirror pre{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #fff;background-color:#fff;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;white-space:nowrap}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror-cursor{border-left:1px solid #000;border-right:none;width:0}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.cm-fat-cursor .CodeMirror-cursor{width:auto;border:0!important;background:#7e7}.cm-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-fat-cursor-mark{background-color:rgba(20,255,20,.5);-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite}.cm-animate-fat-cursor{width:auto;border:0;-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite;background-color:#7e7}@-moz-keyframes blink{50%{background-color:transparent}}@-webkit-keyframes blink{50%{background-color:transparent}}@keyframes blink{50%{background-color:transparent}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-rulers{position:absolute;left:0;right:0;top:-50px;bottom:-20px;overflow:hidden}.CodeMirror-ruler{border-left:1px solid #ccc;top:0;bottom:0;position:absolute}.cm-s-default .cm-header{color:#00f}.cm-s-default .cm-quote{color:#090}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-type,.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:rgb(76, 136, 107)}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-invalidchar,.cm-s-default .cm-error{color:red}.CodeMirror-composing{border-bottom:2px solid}div.CodeMirror span.CodeMirror-matchingbracket{color:#0b0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#a22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#ebf4f7}.CodeMirror{position:relative;overflow:hidden;background:#fff}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:0;position:relative}.CodeMirror-sizer{position:relative;border-right:30px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-30px}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:0 0!important;border:none!important}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-gutter-wrapper ::selection{background-color:transparent}.CodeMirror-gutter-wrapper ::-moz-selection{background-color:transparent}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre{-moz-border-radius:0;-webkit-border-radius:0;border-radius:0;border-width:0;background:0 0;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:inherit;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;-webkit-font-variant-ligatures:contextual;font-variant-ligatures:contextual}.CodeMirror-wrap pre{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;padding:.1px}.CodeMirror-rtl pre{direction:rtl}.CodeMirror-code{outline:0}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors,div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:#d7d4f0}.CodeMirror-line::-moz-selection,.CodeMirror-line>span::-moz-selection,.CodeMirror-line>span>span::-moz-selection{background:#d7d4f0}.cm-searching{background-color:#ffa;background-color:rgba(255,255,0,.4)}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:''}span.CodeMirror-selectedtext{background:0 0}\r\n#sampleInput,.output_div .compilerPre {font-family:\"Courier New\", Courier, monospace;font-size: 17px!important;}\r\n.EvalbgBlue {\r\n  height: 200px;\r\n}\r\n.Evalloader {\r\n  color: #4684ee;\r\n  text-align: center;\r\n  font-family: Consolas, Menlo, Monaco, monospace;\r\n  font-weight: bold;\r\n  font-size: 10vh;\r\n  opacity: 0.8;\r\n}\r\n.Evalloader span {\r\n  display: inline-block;\r\n  animation: pulse 0.4s alternate infinite ease-in-out;\r\n}\r\n.Evalloader span:nth-child(odd) {\r\n  animation-delay: 0.4s;\r\n}\r\n.v-bottom {\r\n  vertical-align: bottom;\r\n}\r\n@keyframes pulse {\r\n  to {\r\n    transform: scale(0.8);\r\n    opacity: 0.5;\r\n  }\r\n}\r\n\r\n.vsplitter {\r\n  background: linear-gradient(90deg, rgb(246, 236, 236), rgb(229, 223, 223), rgb(180, 180, 180));\r\n}\r\n.CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\r\n  background: #d5eaef;\r\n}\r\n.bg-light .CodeMirror-activeline-background {\r\n  background: #ebebeb !important;\r\n}\r\n.bg-light .CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\r\n  background: #fff !important;\r\n}\r\n.bg-light .CodeMirror-line {\r\n  cursor: not-allowed;\r\n}\r\n.cm-s-monokai .CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\r\n  background: #5c5d5b !important;\r\n}\r\n.cm-s-monokai .bg-light,\r\n.cm-s-monokai .bg-light .CodeMirror-activeline-background {\r\n  background: #5f5b5b !important;\r\n}\r\n.cm-s-monokai .bg-light .CodeMirror-activeline-background + .CodeMirror-gutter-wrapper > div {\r\n  background: #272822 !important;\r\n}\r\n.evalpro_module .CodeMirror {\r\n  border: none;\r\n}";
    styleInject(css_248z);

    var css_248z$1 = "/* Based on Sublime Text's Monokai theme */\r\n\r\n.cm-s-monokai.CodeMirror { \r\n  background: #272822; \r\n  color: #f8f8f2; \r\n}\r\n.cm-s-monokai div.CodeMirror-selected { \r\n  background: #49483E; \r\n}\r\n.cm-s-monokai .CodeMirror-line::selection, .cm-s-monokai .CodeMirror-line > span::selection, .cm-s-monokai .CodeMirror-line > span > span::selection { background: rgba(73, 72, 62, .99); }\r\n.cm-s-monokai .CodeMirror-line::-moz-selection, .cm-s-monokai .CodeMirror-line > span::-moz-selection, .cm-s-monokai .CodeMirror-line > span > span::-moz-selection { background: rgba(73, 72, 62, .99); }\r\n.cm-s-monokai .CodeMirror-gutters { background: #272822; border-right: 0px; }\r\n.cm-s-monokai .CodeMirror-guttermarker { color: white; }\r\n.cm-s-monokai .CodeMirror-guttermarker-subtle { color: #d0d0d0; }\r\n.cm-s-monokai .CodeMirror-linenumber { color: #d0d0d0; }\r\n.cm-s-monokai .CodeMirror-cursor { border-left: 1px solid #f8f8f0; }\r\n\r\n.cm-s-monokai span.cm-comment { color: #dedcd5; }\r\n.cm-s-monokai span.cm-atom { color: #ae81ff; }\r\n.cm-s-monokai span.cm-number { color: #ae81ff; }\r\n\r\n.cm-s-monokai span.cm-property, .cm-s-monokai span.cm-attribute { color: #a6e22e; }\r\n.cm-s-monokai span.cm-keyword { color: #f92672; }\r\n.cm-s-monokai span.cm-builtin { color: #66d9ef; }\r\n.cm-s-monokai span.cm-string { color: #e6db74; }\r\n\r\n.cm-s-monokai span.cm-variable { color: #f8f8f2; }\r\n.cm-s-monokai span.cm-variable-2 { color: #9effff; }\r\n.cm-s-monokai span.cm-variable-3, .cm-s-monokai span.cm-type { color: #66d9ef; }\r\n.cm-s-monokai span.cm-def { color: #fd971f; }\r\n.cm-s-monokai span.cm-bracket { color: #f8f8f2; }\r\n.cm-s-monokai span.cm-tag { color: #f92672; }\r\n.cm-s-monokai span.cm-header { color: #ae81ff; }\r\n.cm-s-monokai span.cm-link { color: #ae81ff; }\r\n.cm-s-monokai span.cm-error { background: #f92672; color: #f8f8f0; }\r\n\r\n.cm-s-monokai .CodeMirror-activeline-background { background: #373831; }\r\n.cm-s-monokai .CodeMirror-matchingbracket {\r\n  text-decoration: underline;\r\n  color: white !important;\r\n}\r\n";
    styleInject(css_248z$1);

    var css_248z$2 = ".CodeMirror-simplescroll-horizontal div,.CodeMirror-simplescroll-vertical div {\r\n  position: absolute;\r\n  background: #ccc;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  border: 1px solid #bbb;\r\n  border-radius: 2px;\r\n}\r\n\r\n.CodeMirror-simplescroll-horizontal, .CodeMirror-simplescroll-vertical {\r\n  position: absolute;\r\n  z-index: 6;\r\n  background: #eee;\r\n}\r\n\r\n.CodeMirror-simplescroll-horizontal {\r\n  bottom: 0; left: 0;\r\n  height: 8px;\r\n}\r\n.CodeMirror-simplescroll-horizontal div {\r\n  bottom: 0;\r\n  height: 100%;\r\n}\r\n\r\n.CodeMirror-simplescroll-vertical {\r\n  right: 0; top: 0;\r\n  width: 8px;\r\n}\r\n.CodeMirror-simplescroll-vertical div {\r\n  right: 0;\r\n  width: 100%;\r\n}\r\n\r\n\r\n.CodeMirror-overlayscroll .CodeMirror-scrollbar-filler, .CodeMirror-overlayscroll .CodeMirror-gutter-filler {\r\n  display: none;\r\n}\r\n\r\n.CodeMirror-overlayscroll-horizontal div, .CodeMirror-overlayscroll-vertical div {\r\n  position: absolute;\r\n  background: #bcd;\r\n  border-radius: 3px;\r\n}\r\n\r\n.CodeMirror-overlayscroll-horizontal, .CodeMirror-overlayscroll-vertical {\r\n  position: absolute;\r\n  z-index: 6;\r\n}\r\n\r\n.CodeMirror-overlayscroll-horizontal {\r\n  bottom: 0; left: 0;\r\n  height: 6px;\r\n}\r\n.CodeMirror-overlayscroll-horizontal div {\r\n  bottom: 0;\r\n  height: 100%;\r\n}\r\n\r\n.CodeMirror-overlayscroll-vertical {\r\n  right: 0; top: 0;\r\n  width: 6px;\r\n}\r\n.CodeMirror-overlayscroll-vertical div {\r\n  right: 0;\r\n  width: 100%;\r\n}";
    styleInject(css_248z$2);

    /* clsSMEval\EvalPreview.svelte generated by Svelte v3.40.2 */

    const { console: console_1$1 } = globals;
    const file$4 = "clsSMEval\\EvalPreview.svelte";

    function add_css$4(target) {
    	append_styles(target, "svelte-1oaoggn", "body{overflow:hidden!important;position:fixed;width:100%}.split_container :global(.left_pane){padding:0!important}.split_container :global(.panel){padding:0!important}.pb-5{padding-bottom:3rem!important}.py-5{padding-bottom:3rem!important}.CodeMirror{font-family:Monaco, monospace, \"Courier New\", Courier, Arial !important;word-spacing:3px !important}.compilerPre{background:0 0;font-size:15px!important;border:none;color:red;white-space:pre-wrap;word-break:break-word}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhbFByZXZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiIiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiY2xzU01FdmFsXFxFdmFsUHJldmlldy5zdmVsdGUiXX0= */");
    }

    // (1259:8) {#if state.lang_type == 'sql' || state.lang_type == 'psql'}
    function create_if_block$3(ctx) {
    	let button;
    	let t_value = l.resetDB + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "id", "reset_button");
    			attr_dev(button, "onclick", /*resetDB*/ ctx[5]);
    			attr_dev(button, "class", "btn btn-outline-primary mr-2");
    			add_location(button, file$4, 1259, 9, 43666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(1259:8) {#if state.lang_type == 'sql' || state.lang_type == 'psql'}",
    		ctx
    	});

    	return block;
    }

    // (1363:1) <Dialog bind:visible={state.confirmBoxOpen} width={545}>
    function create_default_slot_1(ctx) {
    	let div;
    	let t0_value = l.eval_ada1_msg + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = l.eval_ada2_msg + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(br, file$4, 1367, 21, 48283);
    			set_style(div, "padding-top", "20px");
    			add_location(div, file$4, 1366, 2, 48229);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(1363:1) <Dialog bind:visible={state.confirmBoxOpen} width={545}>",
    		ctx
    	});

    	return block;
    }

    // (1364:2) 
    function create_title_slot(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `${l.eval_ada_info}`;
    			attr_dev(div0, "style", "");
    			add_location(div0, file$4, 1364, 3, 48178);
    			attr_dev(div1, "slot", "title");
    			set_style(div1, "text-align", "left");
    			add_location(div1, file$4, 1363, 2, 48129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(1364:2) ",
    		ctx
    	});

    	return block;
    }

    // (1372:3) <Button      unelevated={true}      color="primary"      on:click={() => { state.confirmBoxOpen = false }}     >
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("OK");
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1372:3) <Button      unelevated={true}      color=\\\"primary\\\"      on:click={() => { state.confirmBoxOpen = false }}     >",
    		ctx
    	});

    	return block;
    }

    // (1371:2) 
    function create_footer_slot(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				unelevated: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_1*/ ctx[14]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			attr_dev(div, "class", "svelteFooter");
    			add_location(div, file$4, 1370, 2, 48325);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1073741824) {
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
    		source: "(1371:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div25;
    	let div24;
    	let center;
    	let itemhelper;
    	let t0;
    	let button0;
    	let t1;
    	let div23;
    	let div11;
    	let div10;
    	let div9;
    	let div2;
    	let div0;
    	let span0;
    	let t2;
    	let span1;
    	let t4;
    	let span2;

    	let t5_value = (/*state*/ ctx[0].lang_type == "php"
    	? "PHP"
    	: toTitleCase(/*state*/ ctx[0].lang_type)) + "";

    	let t5;
    	let t6;
    	let div1;
    	let t7;
    	let button1;
    	let t9;
    	let button2;
    	let span3;
    	let t10;
    	let ul;
    	let li;
    	let label;
    	let input0;
    	let t11;
    	let span4;
    	let t13;
    	let div8;
    	let div4;
    	let textarea0;
    	let t14;
    	let div3;
    	let t16;
    	let div5;
    	let textarea1;
    	let t17;
    	let div7;
    	let div6;
    	let t19;
    	let textarea2;
    	let t20;
    	let div22;
    	let div21;
    	let div14;
    	let div12;
    	let t22;
    	let div13;
    	let textarea3;
    	let t23;
    	let div17;
    	let div15;
    	let t25;
    	let div16;
    	let span5;
    	let t26;
    	let div20;
    	let div18;
    	let a;
    	let t28;
    	let div19;
    	let t29;
    	let textarea4;
    	let textarea4_value_value;
    	let t30;
    	let textarea5;
    	let t31;
    	let input1;
    	let t32;
    	let dialog;
    	let updating_visible;
    	let current;
    	let mounted;
    	let dispose;
    	itemhelper = new ItemHelper({ $$inline: true });
    	itemhelper.$on("setReview", /*setReview*/ ctx[1]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[2]);
    	let if_block = (/*state*/ ctx[0].lang_type == 'sql' || /*state*/ ctx[0].lang_type == 'psql') && create_if_block$3(ctx);

    	function dialog_visible_binding(value) {
    		/*dialog_visible_binding*/ ctx[15](value);
    	}

    	let dialog_props = {
    		width: 545,
    		$$slots: {
    			footer: [create_footer_slot],
    			title: [create_title_slot],
    			default: [create_default_slot_1]
    		},
    		$$scope: { ctx }
    	};

    	if (/*state*/ ctx[0].confirmBoxOpen !== void 0) {
    		dialog_props.visible = /*state*/ ctx[0].confirmBoxOpen;
    	}

    	dialog = new Dialog({ props: dialog_props, $$inline: true });
    	binding_callbacks.push(() => bind(dialog, 'visible', dialog_visible_binding));

    	const block = {
    		c: function create() {
    			div25 = element("div");
    			div24 = element("div");
    			center = element("center");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			button0 = element("button");
    			t1 = space();
    			div23 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "Editor |";
    			t4 = space();
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t7 = space();
    			button1 = element("button");
    			button1.textContent = `${l.run_code}`;
    			t9 = space();
    			button2 = element("button");
    			span3 = element("span");
    			t10 = space();
    			ul = element("ul");
    			li = element("li");
    			label = element("label");
    			input0 = element("input");
    			t11 = space();
    			span4 = element("span");
    			span4.textContent = "Dark Mode";
    			t13 = space();
    			div8 = element("div");
    			div4 = element("div");
    			textarea0 = element("textarea");
    			t14 = space();
    			div3 = element("div");
    			div3.textContent = "Section above is non-editable. Write your code below.";
    			t16 = space();
    			div5 = element("div");
    			textarea1 = element("textarea");
    			t17 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "Section below is non-editable. Write your code above.";
    			t19 = space();
    			textarea2 = element("textarea");
    			t20 = space();
    			div22 = element("div");
    			div21 = element("div");
    			div14 = element("div");
    			div12 = element("div");
    			div12.textContent = `${l.input}`;
    			t22 = space();
    			div13 = element("div");
    			textarea3 = element("textarea");
    			t23 = space();
    			div17 = element("div");
    			div15 = element("div");
    			div15.textContent = `${l.output}`;
    			t25 = space();
    			div16 = element("div");
    			span5 = element("span");
    			t26 = space();
    			div20 = element("div");
    			div18 = element("div");
    			a = element("a");
    			a.textContent = `${l.testcases}`;
    			t28 = space();
    			div19 = element("div");
    			t29 = space();
    			textarea4 = element("textarea");
    			t30 = space();
    			textarea5 = element("textarea");
    			t31 = space();
    			input1 = element("input");
    			t32 = space();
    			create_component(dialog.$$.fragment);
    			add_location(center, file$4, 1229, 2, 42197);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "h h-imp");
    			attr_dev(button0, "id", "evalRerender");
    			attr_dev(button0, "onclick", /*reRender*/ ctx[4]);
    			add_location(button0, file$4, 1235, 2, 42314);
    			attr_dev(span0, "tabindex", "0");
    			attr_dev(span0, "class", "icomoon-code s3 mr d-inline-block float-left");
    			attr_dev(span0, "data-bs-toggle", "tooltip");
    			attr_dev(span0, "data-placement", "top");
    			attr_dev(span0, "title", "ADA Info");
    			add_location(span0, file$4, 1246, 8, 43060);
    			attr_dev(span1, "class", "d-inline-block m-t-n-xxs float-left mr");
    			add_location(span1, file$4, 1254, 8, 43336);
    			attr_dev(span2, "tabindex", "0");
    			attr_dev(span2, "class", "d-inline-block m-t-n-xxs float-left mr");
    			add_location(span2, file$4, 1255, 8, 43415);
    			add_location(div0, file$4, 1245, 7, 43045);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "evalProRunCode btn btn-primary m-l-xxs");
    			attr_dev(button1, "href", "#output");
    			attr_dev(button1, "id", "evalProRunCode");
    			attr_dev(button1, "name", "submitcode");
    			add_location(button1, file$4, 1261, 8, 43806);
    			attr_dev(span3, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
    			attr_dev(span3, "aria-label", "Three dots dropdown");
    			add_location(span3, file$4, 1270, 9, 44128);
    			attr_dev(button2, "class", "btn border-0 px-0 ml-2");
    			attr_dev(button2, "data-toggle", "dropdown");
    			add_location(button2, file$4, 1269, 8, 44054);
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "id", "goDark");
    			attr_dev(input0, "class", "position-absolute transparent");
    			add_location(input0, file$4, 1275, 11, 44398);
    			add_location(span4, file$4, 1281, 11, 44576);
    			attr_dev(label, "for", "goDark");
    			attr_dev(label, "class", "dropdown-item mb-0 pointer");
    			add_location(label, file$4, 1274, 10, 44330);
    			add_location(li, file$4, 1273, 9, 44314);
    			attr_dev(ul, "class", "dropdown-menu dropdown-menu-right");
    			add_location(ul, file$4, 1272, 8, 44257);
    			add_location(div1, file$4, 1257, 7, 43581);
    			attr_dev(div2, "class", "card-header px-2 height44 editor-heading d-flex justify-content-between align-items-center py-1");
    			set_style(div2, "padding-top", "11px");
    			add_location(div2, file$4, 1244, 6, 42900);
    			attr_dev(textarea0, "id", "pre-editor");
    			attr_dev(textarea0, "class", "d-none");
    			attr_dev(textarea0, "placeholder", "pre code");
    			attr_dev(textarea0, "name", "pre-editor");
    			add_location(textarea0, file$4, 1293, 8, 44950);
    			attr_dev(div3, "class", "pre_msg text-center w-100 text-danger font-weight-bold bg-light-danger position-absolute d-none");
    			set_style(div3, "bottom", "0");
    			set_style(div3, "font", "12px");
    			add_location(div3, file$4, 1294, 8, 45053);
    			attr_dev(div4, "class", "pre-div position-relative");
    			attr_dev(div4, "id", "pre_div");
    			add_location(div4, file$4, 1292, 7, 44888);
    			attr_dev(textarea1, "id", "repl-editor");
    			attr_dev(textarea1, "placeholder", "Write your function here...");
    			attr_dev(textarea1, "name", "repl-editor");
    			add_location(textarea1, file$4, 1302, 8, 45363);
    			attr_dev(div5, "class", "replEditor");
    			add_location(div5, file$4, 1301, 7, 45329);
    			attr_dev(div6, "class", "post_msg text-center w-100 text-danger font-weight-bold bg-light-danger position-absolute d-none");
    			set_style(div6, "top", "0");
    			set_style(div6, "font-size", "12px");
    			add_location(div6, file$4, 1305, 8, 45550);
    			attr_dev(textarea2, "id", "post-editor");
    			attr_dev(textarea2, "class", "d-none");
    			attr_dev(textarea2, "placeholder", "post code");
    			attr_dev(textarea2, "name", "post-editor");
    			add_location(textarea2, file$4, 1311, 8, 45813);
    			attr_dev(div7, "class", "pre-div position-relative");
    			attr_dev(div7, "id", "post_div");
    			add_location(div7, file$4, 1304, 7, 45487);
    			attr_dev(div8, "class", "card-body");
    			attr_dev(div8, "id", "code-editor");
    			set_style(div8, "overflow", "none");
    			set_style(div8, "border-bottom", "1px solid #dddddd");
    			set_style(div8, "padding", "0px");
    			set_style(div8, "min-height", "315px");
    			set_style(div8, "height", "calc(100vh - 45px)");
    			add_location(div8, file$4, 1287, 6, 44686);
    			attr_dev(div9, "class", "card card-default rounded-0 ");
    			attr_dev(div9, "id", "resizeable-editor");
    			set_style(div9, "margin", "0, border-radius: 4px 4px 0 0");
    			set_style(div9, "border-bottom", "0");
    			set_style(div9, "border-right", "0");
    			set_style(div9, "font", "17px");
    			add_location(div9, file$4, 1239, 5, 42705);
    			attr_dev(div10, "class", "full-editor");
    			set_style(div10, "min-height", "inherit");
    			add_location(div10, file$4, 1238, 4, 42644);
    			attr_dev(div11, "id", "editor-top");
    			set_style(div11, "width", "60%");
    			set_style(div11, "height", "calc(100vh - 45px)");
    			set_style(div11, "min-width", "300px");
    			set_style(div11, "padding-right", "0", 1);
    			attr_dev(div11, "class", "float-left px-0");
    			add_location(div11, file$4, 1237, 3, 42498);
    			attr_dev(div12, "tabindex", "0");
    			attr_dev(div12, "class", "card-header px-2");
    			set_style(div12, "height", "47px");
    			add_location(div12, file$4, 1321, 6, 46398);
    			attr_dev(textarea3, "tabindex", "0");
    			attr_dev(textarea3, "name", "sampleInput");
    			attr_dev(textarea3, "class", "sampleInput");
    			attr_dev(textarea3, "id", "sampleInput");
    			attr_dev(textarea3, "placeholder", "Separate input by 'enter' key");
    			set_style(textarea3, "margin", "0px");
    			set_style(textarea3, "width", "100%");
    			set_style(textarea3, "height", "100%");
    			set_style(textarea3, "padding", "10px");
    			set_style(textarea3, "resize", "none");
    			set_style(textarea3, "outline", "none");
    			set_style(textarea3, "border", "0px");
    			add_location(textarea3, file$4, 1325, 7, 46548);
    			attr_dev(div13, "id", "input");
    			attr_dev(div13, "class", "card-body p-0");
    			add_location(div13, file$4, 1324, 6, 46501);
    			attr_dev(div14, "class", "card card-default rounded-0 border-right-0 font17 inNativeStyleInput input_div overflow-hidden");
    			set_style(div14, "height", "131.5px");
    			add_location(div14, file$4, 1320, 5, 46257);
    			attr_dev(div15, "tabindex", "0");
    			attr_dev(div15, "class", "card-header px-2");
    			set_style(div15, "height", "47px");
    			add_location(div15, file$4, 1336, 6, 47036);
    			attr_dev(span5, "tabindex", "0");
    			add_location(span5, file$4, 1345, 7, 47345);
    			attr_dev(div16, "tabindex", "0");
    			attr_dev(div16, "id", "output");
    			attr_dev(div16, "class", "card-body output overflow-auto pb-5 text-dark");
    			set_style(div16, "padding", "10px 10px 25px 10px");
    			set_style(div16, "height", "calc(100vh - 221px)");
    			add_location(div16, file$4, 1339, 6, 47141);
    			attr_dev(div17, "class", "card card-default rounded-0 border-right-0 font17 inNativeStyleInput output_div overflow-hidden");
    			set_style(div17, "margin-bottom", "0px");
    			add_location(div17, file$4, 1335, 5, 46888);
    			attr_dev(a, "data-toggle", "tab");
    			attr_dev(a, "id", "testcase-tab");
    			attr_dev(a, "class", "inputOutput");
    			attr_dev(a, "href", "#testcase");
    			add_location(a, file$4, 1350, 7, 47561);
    			attr_dev(div18, "class", "card-header px-2 height44");
    			add_location(div18, file$4, 1349, 6, 47513);
    			attr_dev(div19, "id", "testcase");
    			attr_dev(div19, "class", "card-body in");
    			set_style(div19, "resize", "none");
    			set_style(div19, "overflow", "auto");
    			set_style(div19, "padding", "10px");
    			set_style(div19, "height", "180px");
    			add_location(div19, file$4, 1352, 6, 47676);
    			attr_dev(div20, "class", "card card-default rounded-0 border-right-0 font17");
    			attr_dev(div20, "id", "test_card");
    			set_style(div20, "display", "none");
    			add_location(div20, file$4, 1348, 5, 47405);
    			attr_dev(div21, "class", "editor-footer-div relative");
    			set_style(div21, "height", "calc(100vh - 45px)", 1);
    			add_location(div21, file$4, 1319, 4, 46164);
    			attr_dev(div22, "tabindex", "0");
    			attr_dev(div22, "id", "editor-footer");
    			attr_dev(div22, "class", "float-right px-0");
    			set_style(div22, "width", "40%");
    			set_style(div22, "min-height", "120px");
    			set_style(div22, "height", "585px");
    			set_style(div22, "padding-left", "0", 1);
    			set_style(div22, "padding-right", "0", 1);
    			add_location(div22, file$4, 1318, 3, 45985);
    			attr_dev(div23, "class", "row mx-0 evalpro_module position-relative");
    			set_style(div23, "height", "calc(100vh - 45px)");
    			add_location(div23, file$4, 1236, 2, 42402);
    			attr_dev(textarea4, "class", "h");
    			attr_dev(textarea4, "id", "qxml_inp");
    			attr_dev(textarea4, "name", "qxml_inp");
    			textarea4.value = textarea4_value_value = window.QXML;
    			textarea4.readOnly = true;
    			add_location(textarea4, file$4, 1358, 2, 47848);
    			attr_dev(textarea5, "class", "h");
    			attr_dev(textarea5, "id", "special_module_user_xml");
    			add_location(textarea5, file$4, 1359, 2, 47942);
    			attr_dev(input1, "type", "hidden");
    			attr_dev(input1, "id", "ansModeAnswer");
    			input1.value = "";
    			add_location(input1, file$4, 1360, 2, 48006);
    			attr_dev(div24, "id", "authoringArea");
    			attr_dev(div24, "class", "");
    			set_style(div24, "line-height", "20px");
    			add_location(div24, file$4, 1228, 1, 42133);
    			add_location(div25, file$4, 1227, 0, 42125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div25, anchor);
    			append_dev(div25, div24);
    			append_dev(div24, center);
    			mount_component(itemhelper, center, null);
    			append_dev(div24, t0);
    			append_dev(div24, button0);
    			append_dev(div24, t1);
    			append_dev(div24, div23);
    			append_dev(div23, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(div0, t4);
    			append_dev(div0, span2);
    			append_dev(span2, t5);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, button1);
    			append_dev(div1, t9);
    			append_dev(div1, button2);
    			append_dev(button2, span3);
    			append_dev(div1, t10);
    			append_dev(div1, ul);
    			append_dev(ul, li);
    			append_dev(li, label);
    			append_dev(label, input0);
    			append_dev(label, t11);
    			append_dev(label, span4);
    			append_dev(div9, t13);
    			append_dev(div9, div8);
    			append_dev(div8, div4);
    			append_dev(div4, textarea0);
    			append_dev(div4, t14);
    			append_dev(div4, div3);
    			append_dev(div8, t16);
    			append_dev(div8, div5);
    			append_dev(div5, textarea1);
    			append_dev(div8, t17);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t19);
    			append_dev(div7, textarea2);
    			append_dev(div23, t20);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div14);
    			append_dev(div14, div12);
    			append_dev(div14, t22);
    			append_dev(div14, div13);
    			append_dev(div13, textarea3);
    			append_dev(div21, t23);
    			append_dev(div21, div17);
    			append_dev(div17, div15);
    			append_dev(div17, t25);
    			append_dev(div17, div16);
    			append_dev(div16, span5);
    			append_dev(div21, t26);
    			append_dev(div21, div20);
    			append_dev(div20, div18);
    			append_dev(div18, a);
    			append_dev(div20, t28);
    			append_dev(div20, div19);
    			append_dev(div24, t29);
    			append_dev(div24, textarea4);
    			append_dev(div24, t30);
    			append_dev(div24, textarea5);
    			append_dev(div24, t31);
    			append_dev(div24, input1);
    			append_dev(div25, t32);
    			mount_component(dialog, div25, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*runCode*/ ctx[6], false, false, false),
    					listen_dev(input0, "click", /*changeTheme*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*state*/ 1) && t5_value !== (t5_value = (/*state*/ ctx[0].lang_type == "php"
    			? "PHP"
    			: toTitleCase(/*state*/ ctx[0].lang_type)) + "")) set_data_dev(t5, t5_value);

    			if (/*state*/ ctx[0].lang_type == 'sql' || /*state*/ ctx[0].lang_type == 'psql') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div1, t7);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const dialog_changes = {};

    			if (dirty[0] & /*state*/ 1 | dirty[1] & /*$$scope*/ 1073741824) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible && dirty[0] & /*state*/ 1) {
    				updating_visible = true;
    				dialog_changes.visible = /*state*/ ctx[0].confirmBoxOpen;
    				add_flush_callback(() => updating_visible = false);
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div25);
    			destroy_component(itemhelper);
    			if (if_block) if_block.d();
    			destroy_component(dialog);
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

    function toTitleCase(str) {
    	return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function stringBetween(data, str_1, str_2) {
    	let regEx;

    	if (str_2) {
    		regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
    	} else {
    		regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
    	}

    	let matchedStr = regEx.exec(data);

    	if (matchedStr) {
    		return matchedStr[1];
    	} else {
    		return null;
    	}
    }

    function findAttribute(XML, attr, tag = "") {
    	let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w+)\".*?>", "gm");
    	let matchedStr = regEx.exec(XML);

    	if (matchedStr) {
    		return matchedStr[1];
    	} else {
    		return null;
    	}
    }

    function updateNativeHeight() {
    	if (window.inNative) {
    		window.getHeight && window.getHeight();
    	}
    }

    function getSectionLine(lineNo, section) {
    	if (lineNo <= section.pre) {
    		//No need here.
    		console.log({ section: 'pre', lineNo });
    	} else if (lineNo <= section.pre + section.editor) {
    		lineNo = lineNo - section.pre;
    		console.log({ section: 'editor', lineNo });
    	} else if (lineNo <= section.pre + section.editor + section.post) {
    		lineNo = lineNo - (section.pre + section.editor);
    		console.log({ section: 'post', lineNo });
    	}

    	return lineNo;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EvalPreview', slots, []);
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { ansStatus } = $$props;
    	let { isReview } = $$props;
    	let { content_guid } = $$props;
    	let { sample_input = '' } = $$props;
    	let evalpro_url = 'https://www.jigyaasa.info/layout/themes/bootstrap4/svelte_items/evalPro/index.php';
    	let user_guid = '05kmr'; // I will change it later
    	let tempGuid;
    	let client = {};
    	let markerFlag = false;
    	let language = "PHP";
    	let isPreview = "";
    	let xmlArr = [];
    	let langArr = [];
    	let lang_type = [];
    	xml = !(/<SMXML/gi).test(uxml) || !uxml ? xml : uxml;
    	let showPre = "";
    	let showPost = "";
    	let showEditor = 2;

    	//let defaultStartXml = '<SMXML type="24" name="evalpro" language="php">';
    	let direction = "";

    	//let editorFlag = 1;
    	let resetProp = { 'psql': 3 };

    	let editor;
    	let preEditor;
    	let postEditor;
    	let UXML;
    	let db_name = "myDBs";
    	let is_graph = 0;
    	let ignore_error = 0;
    	let ignore_formatting = 0;
    	let ignore_reset_db = 0;
    	let is_pre_tag = 0;
    	let marker = [];
    	let state = {};

    	let hdd = writable({
    		xml: '',
    		uxml: '',
    		module: '',
    		toggle: false,
    		snackback: false,
    		lang_type: 'php',
    		xmlArr: [],
    		remediationToggle: false,
    		qxml: '',
    		titleData: "",
    		stemData: "",
    		remediationData: "",
    		perspective: "Right",
    		confirmBoxOpen: false,
    		submitCliked: false,
    		isSubmit: false,
    		goDark: window.sessionStorage.goDark && window.sessionStorage.goDark == "true"
    		? true
    		: false
    	});

    	const unsubs = hdd.subscribe(items => {
    		$$invalidate(0, state = items);
    	});

    	onMount(() => {
    		window.QXML = xml;
    		window.uaXML = uxml;

    		lang_type = [
    			"c",
    			"c#",
    			"c++",
    			"java",
    			"javascript",
    			"mssql",
    			"node.js",
    			"php",
    			"psql",
    			"python",
    			"r",
    			"ruby",
    			"sql"
    		];

    		db_name = findAttribute(window.QXML, 'db_name');
    		is_graph = findAttribute(window.QXML, 'is_graph');
    		ignore_error = findAttribute(window.QXML, 'ignore_error');
    		ignore_formatting = findAttribute(window.QXML, 'ignore_formatting');
    		ignore_reset_db = findAttribute(window.QXML, 'ignore_reset_db');
    		is_pre_tag = findAttribute(window.QXML, 'is_pre_tag');
    		let smxml = xml.match(/<smxml(.*?)>/gim);
    		let type = smxml.toString().match(/type="(.*?)"|type='(.*?)'/gim);
    		type = type[0].replace(/type=|"/gim, '');
    		$$invalidate(0, state.module = type, state);

    		//@Sneh: Added for ADA
    		AH.bind(document, 'keyup', e => {
    			if (e.ctrlKey && e.shiftKey && e.keyCode == 13) {
    				//ctrl+shift+Enter key
    				AH.select(".evalProRunCode").focus();

    				AH.select(".evalProRunCode").click();
    			} else if (e.ctrlKey && e.shiftKey && e.keyCode == 32) {
    				//ctrl+shift+space key
    				AH.select("#editor-footer").focus();

    				AH.select("#editor-footer").click();
    			}
    		});

    		didMount();
    		AH.initDropdown();
    	});

    	beforeUpdate(() => {
    		AH.select("#item_answer", 'addClass', ["mb-xl", "multiItem"]);
    		AH.select('#answerCheck', 'css', { visibility: "hidden", display: "none" });
    		AH.select('#headerTitle', 'html', l.authoring);
    		AH.find('#authoringArea', 'form', { action: 'remove' });
    		AH.find(document, '#tilteShow,#stemShow,#remediationShow', { action: 'remove' });
    		AH.select('#title', 'html', state.titleData);
    		AH.select('#stem', 'html', state.stemData);
    		AH.select('#remediation', 'html', state.remediationData);
    		unRenderPlayer();
    		isPreview = 1;
    		state.module == "24" && AH.select('#selectLanguage', 'show');
    		showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
    		showPost = parseInt(findAttribute(xml, "showpost", "SMXML"));
    		showPre = parseInt(findAttribute(xml, "showpre", "SMXML"));
    		showEditor = parseInt(findAttribute(xml, "showeditor", "SMXML"));
    		showEditor = Number.isNaN(showEditor) ? 2 : showEditor;

    		if (window.QXML) {
    			if (isReview) {
    				setReview();
    			} else {
    				unsetReview();
    			}
    		}

    		if (!isReview && editor) {
    			//re-rendering codeMirror
    			window.uaXML = window.uaXML ? window.uaXML : window.QXML;

    			UXML = window.uaXML;
    			editor.toTextArea();

    			if (preEditor) {
    				preEditor.toTextArea();
    			}

    			if (postEditor) {
    				postEditor.toTextArea();
    			}

    			let privXML = stringBetween(UXML, "editor");
    			renderCodeMirror();
    			editor.setValue(privXML.trim());
    		}

    		destructor();
    	});

    	function didMount() {
    		// Update the lineSection for first time if lineSection is not available in uxml
    		let qxml = !(/<SMXML/gi).test(uxml) || !uxml ? xml : uxml;

    		//To add the lineSection 
    		if (qxml.indexOf('lineSection=') === -1) {
    			let uXml = qxml.split("<SMXML");
    			uXml = "<SMXML " + 'lineSection="0,0,0"' + uXml[1];
    			AH.select("#special_module_user_xml").value = uXml;
    			window.uaXML = uXml;
    		}

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		xml.match(/<SMXML[\s\S]*?<\/SMXML>/gim);
    		langArr = xml.match(/<SMXML[\s\S]*?<\/SMXML>/gim);

    		if (langArr.length == 1) {
    			language = langArr.toString().match(/language="(.*?)"/gim);
    			language = language.toString().replace(/language=|"/gi, '');
    			xmlArr[language] = xml;
    			$$invalidate(0, state.lang_type = language, state);
    			$$invalidate(0, state.xmlArr = xmlArr, state);
    		} else {
    			for (let i = 0; i < langArr.length; i++) {
    				language = langArr[i].match(/language="(.*?)"/gim);
    				language = language.toString().replace(/language=|"/gi, '');
    				xmlArr[language] = langArr[i];
    			}

    			$$invalidate(0, state.xmlArr = xmlArr, state);
    		}

    		getChildXml(xmlArr[state.lang_type]); //important
    		AH.select('#preview', 'hide');
    		$$invalidate(0, state.xml = xml, state);

    		if (typeof CodeMirror == "function") {
    			renderCodeMirror();
    		} else {
    			AH.ajax({
    				type: "GET",
    				url: itemUrl + "src/libs/codemirror.js",
    				dataType: "script"
    			}).then(data => {
    				AH.addScript(data, "", { target: "body" });
    				renderCodeMirror();
    			});
    		}

    		AH.listen(document, 'click', '#answerCheck', remediationMode.bind(this));
    	} //state.goDark = !state.goDark;
    	/*
    AH.ajax({
    	type: "GET",
    	url: themeUrl+"svelte_items/lib/splitter.js",
    	async:false,
    	dataType: "script",
    	cache: true,
    }).then((data)=> {
    		AH.addScript(data, {target: 'body'})
    		if (window.frameElement) {
    			AH.bind(window, 'resize', function() {
    				if (window.innerWidth > 0) {
    					//AH.select('#uc-item-test-template').width('100vw').split({orientation:'vertical', limit:300, position:'70%'}, $(".left-test-template"), $(".right-test-template"));
    					//AH.select('.evalpro_module').height('100vh').split({orientation:'vertical', limit:300, position:'60%'}, $("#editor-top"), $("#editor-footer"));
    				}
    			});
    		} else {
    			//AH.select('#uc-item-test-template').width('100vw').split({orientation:'vertical', limit:300, position:'70%'}, AH.selectAll(".left-test-template"), AH.selectAll(".right-test-template"));
    			//AH.select('.evalpro_module').height('100vh').split({orientation:'vertical', limit:300, position:'60%'}, AH.selectAll("#editor-top"), AH.selectAll("#editor-footer"));
    		}
    		AH.selectAll('.right-test-template', 'removeClass', 'border-left');
    		AH.selectAll('#uc-item-test-template .test-layout, .left-test-template', 'addClass','border-bottom');
    });

    */

    	function setReview() {
    		if (typeof CodeMirror == 'function') {
    			editor.setOption("readOnly", true);

    			if (showPost > 1) {
    				postEditor.setOption("readOnly", true);
    			}

    			if (showPre > 1) {
    				preEditor.setOption("readOnly", true);
    			}

    			if (showEditor > 1) {
    				editor.setOption("readOnly", true);
    			}
    		}

    		//@prabhat: removed the extra ajax call from submit click
    		// answerCheckEvalpro();
    		submitEvalAns();
    	}

    	function unsetReview() {
    		try {
    			if (typeof CodeMirror == 'function') {
    				editor.setOption("readOnly", false);

    				if (showPost > 1) {
    					postEditor.setOption("readOnly", false);
    				}

    				if (showPre > 1) {
    					preEditor.setOption("readOnly", false);
    				}

    				if (showEditor > 1) {
    					editor.setOption("readOnly", false);
    				}
    			}
    		} catch(e) {
    			console.warn({ error: e, func: 'unsetReview' });
    		}
    	}

    	//this code is to enable/disable lines
    	function disableLine() {
    		let mode = {}, $usedLine = "", language = "", disableline = "";

    		try {
    			$usedLine = editor.lineCount();
    			language = state.lang_type;
    			disableline = !isReview ? stringBetween(xml, "enableline") : 0;
    			var max_enable_line = disableline.split(",");
    			max_enable_line = parseInt(max_enable_line[max_enable_line.length - 1]);

    			if ($usedLine > max_enable_line) {
    				for (var i = max_enable_line + 1; i <= $usedLine + 1; i++) {
    					disableline += "," + i;
    				}
    			}
    		} catch(e) {
    			console.log({ e, func: 'disableLine' });
    		}

    		if (typeof mode.review == "undefined") {
    			mode.review = 0;
    		}

    		if (( mode.review || 1) && parseInt(disableline)) {
    			let $lineEnable = disableline;

    			if ($lineEnable) {
    				$lineEnable = $lineEnable.split(",");

    				$lineEnable.sort(function (a, b) {
    					return a - b;
    				});

    				let $line = [];

    				for (let j = 0; j < $lineEnable.length; j++) {
    					if (!$line[j]) {
    						$line[j] = [];
    					}

    					if (j == 0) {
    						$line[j][0] = j;
    						$line[j][1] = $lineEnable[j];
    					} else {
    						$line[j][0] = $line[j - 1][1];
    						$line[j][1] = $lineEnable[j];
    					}
    				}

    				let _i = 0;

    				for (_i = 0; _i < $lineEnable.length; _i++) {
    					for (let $k = $line[_i][0]; $k <= $line[_i][1] - 2; $k++) {
    						$k = parseInt($k);
    						editor.addLineClass($k, 'wrap', 'bg-light');
    					}

    					marker.push(editor.markText({ line: $line[_i][0], ch: 0 }, { line: $line[_i][1] - 2 }, {
    						inclusiveRight: true,
    						inclusiveLeft: true,
    						readOnly: true
    					}));
    				}

    				for (let $l = $line[_i - 1][1]; $l < $usedLine; $l++) {
    					$l = parseInt($l);
    					editor.addLineClass($l, 'wrap', 'bg-light');
    				}

    				// hide all bottom codes after enable line
    				if (language == 'python' || disableline == 1) {
    					editor.markText({ line: $line[_i - 1][1], ch: 0 }, { line: $usedLine }, {
    						inclusiveRight: true,
    						inclusiveLeft: true,
    						collapsed: true
    					});

    					editor.markText({ line: $line[_i - 1][1], ch: 0 }, { line: $line[_i - 1][1] + $usedLine }, {
    						inclusiveRight: true,
    						inclusiveLeft: true,
    						readOnly: true
    					});
    				}

    				if (language != 'python') {
    					editor.markText(
    						{
    							line: parseInt($line[_i - 1][1]) - 1,
    							ch: 0
    						},
    						{ line: $usedLine },
    						{
    							inclusiveRight: true,
    							inclusiveLeft: true,
    							collapsed: true
    						}
    					);

    					editor.markText({ line: $line[_i - 1][1], ch: 0 }, { line: $line[_i - 1][1] + $usedLine }, {
    						inclusiveRight: true,
    						inclusiveLeft: true,
    						readOnly: true
    					});
    				}
    			}
    		}

    		markerFlag = false;
    	}

    	function getChildXml(newXml) {
    		$$invalidate(7, xml = newXml);
    	}

    	function checkLine(line) {
    		if (line) {
    			markerFlag ? disableLine() : null;
    		} else {
    			markerFlag = true;

    			marker.forEach(marker => {
    				marker.clear();
    			});
    		}
    	}

    	function updateOuput() {
    		let currentUxml = AH.select("#special_module_user_xml").value;
    		AH.select("#output", 'css', { background: "rgb(255, 255, 255)" });

    		if (currentUxml) {
    			let submit_output = stringBetween(currentUxml, "submitoutput");

    			if (submit_output != null) {
    				submit_output = submit_output.split("||");

    				// Remove this line of code later
    				if (submit_output[4] == undefined) {
    					submit_output[4] = submit_output[2];
    				}

    				if (submit_output[0] == "1") {
    					AH.select("#output", 'html', '<pre class="compilerPre px-1">' + submit_output[4] + "</pre>");
    					AH.select("#output", 'css', { background: "rgb(255, 240, 240)" });
    				} else if (submit_output[4] != "" && submit_output[4] != undefined) {
    					if (submit_output[4].includes("image_data:")) {
    						let image_url = submit_output[4].split("image_data:");
    						AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
    					} else if (submit_output[1] == "2") {
    						let formating_class = submit_output['3'] == '1'
    						? ''
    						: 'd-flex overflow-x-scroll overflow-y-scroll';

    						AH.select("#output", 'html', "<pre class=" + formating_class + ">" + submit_output[4] + "</pre>");
    					} else if (submit_output[1] == "1") {
    						AH.select("#output", 'html', "<pre>" + submit_output[4] + "</pre>");
    					} else {
    						AH.select("#output", 'html', submit_output[4]);
    					}

    					AH.select("#output", 'css', { background: "rgb(255, 255, 255)" });
    				} else {
    					AH.select("#output", 'html', 'Your code didn\'t print anything.');
    				}
    			}
    		}
    	}

    	function renderCodeMirror() {
    		if (showPre > 0) {
    			preEditor = CodeMirror.fromTextArea(document.getElementById("pre-editor"), {
    				lineNumbers: true,
    				mode: 'text/x-' + state.lang_type,
    				styleActiveLine: true,
    				autoCloseBrackets: true,
    				lineWrapping: true,
    				scrollbarStyle: "simple",
    				readOnly: showPre > 1 ? false : true,
    				matchBrackets: true,
    				tabSize: 2,
    				gutters: ["CodeMirror-linenumbers", "breakpoints"]
    			});
    		}

    		editor = CodeMirror.fromTextArea(document.getElementById("repl-editor"), {
    			lineNumbers: true,
    			mode: 'text/x-' + state.lang_type,
    			lineWrapping: true,
    			styleActiveLine: true,
    			autoCloseBrackets: true,
    			scrollbarStyle: "simple",
    			matchBrackets: true,
    			tabSize: 2,
    			gutters: ["CodeMirror-linenumbers", "breakpoints"]
    		});

    		if (showPost > 0) {
    			postEditor = CodeMirror.fromTextArea(document.getElementById("post-editor"), {
    				lineNumbers: true,
    				mode: 'text/x-' + state.lang_type,
    				styleActiveLine: true,
    				autoCloseBrackets: true,
    				lineWrapping: true,
    				scrollbarStyle: "simple",
    				readOnly: showPost > 1 ? false : true,
    				matchBrackets: true,
    				tabSize: 2,
    				gutters: ["CodeMirror-linenumbers", "breakpoints"]
    			});
    		}

    		parseXML();
    		disableLine();

    		editor.on("change", function (event, changes) {
    			saveEvalProAnswer(editor.getValue(), 'editor');
    			checkLine(changes);
    		});

    		editor.on("keyup", function (cm, event) {
    			var currentCurrsor = cm.getCursor();
    			var isDisabled = cm.findMarksAt(currentCurrsor);

    			if (event.keyCode == 13 && isDisabled.length > 0) {
    				console.log("Keyup", isDisabled);
    				checkLine();

    				setTimeout(
    					() => {
    						CodeMirror.commands.newlineAndIndent(cm, null);
    					},
    					100
    				);
    			}
    		});

    		if (typeof preEditor == "object") {
    			preEditor.on("change", function () {
    				saveEvalProAnswer(preEditor.getValue(), 'pre');
    			});
    		}

    		if (typeof postEditor == "object") {
    			postEditor.on("change", function () {
    				saveEvalProAnswer(postEditor.getValue(), 'post');
    			});
    		}

    		if (document.getElementById("aXml")) {
    			CodeMirror.fromTextArea(document.getElementById("aXml"), {
    				lineNumbers: false,
    				mode: "application/xml",
    				autoCloseBrackets: true,
    				lineWrapping: true,
    				matchBrackets: true
    			});
    		}

    		editor.setOption("extraKeys", {
    			//Changing Tabs into 4 spaces 
    			Tab(cm) {
    				let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
    				cm.replaceSelection(spaces);
    			},
    			F11(cm) {
    				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    			},
    			Esc(cm) {
    				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    			},
    			'Ctrl-Enter'(cm) {
    				//@pradeep: To add New when curros is on Disable Line.
    				checkLine();

    				setTimeout(
    					() => {
    						CodeMirror.commands.newlineAndIndent(cm, null);
    					},
    					500
    				);
    			}
    		});

    		if (isReview) {
    			//@prabhat: removed the extra ajax call from submit click
    			// answerCheckEvalpro();
    			editor.setOption("readOnly", true);

    			if (showPost > 1) {
    				postEditor.setOption("readOnly", true);
    			}

    			if (showPre > 1) {
    				preEditor.setOption("readOnly", true);
    			}

    			if (showEditor > 1) {
    				editor.setOption("readOnly", true);
    			}
    		}

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		if (client['updateOuput']) {
    			clearTimeout(client['updateOuput']);
    		}

    		client['updateOuput'] = setTimeout(
    			() => {
    				updateOuput();
    				let check = window.sessionStorage.goDark;

    				if (check == 'true') {
    					AH.select("#goDark").checked = true;
    					changeTheme();
    				}
    			},
    			500
    		);
    	}

    	function changeTheme() {
    		let check = document.querySelector("#goDark").checked;

    		//state.goDark = check;
    		window.sessionStorage.goDark = check;

    		if (check) {
    			if (showPre > 0) {
    				preEditor.setOption("theme", "monokai");
    			}

    			if (showPost > 0) {
    				postEditor.setOption("theme", "monokai");
    			}

    			editor.setOption("theme", "monokai");
    			AH.find(AH.parent('#goDark'), 'span', { action: 'text', actionData: 'Light Mode' });
    		} else {
    			if (showPre > 0) {
    				preEditor.setOption("theme", "default");
    			}

    			if (showPost > 0) {
    				postEditor.setOption("theme", "default");
    			}

    			editor.setOption("theme", "default");
    			AH.find(AH.parent('#goDark'), 'span', { action: 'text', actionData: 'Dark Mode' });
    		}
    	}

    	function reRender() {
    		try {
    			editor.toTextArea();
    			preEditor && preEditor.toTextArea();
    			postEditor && postEditor.toTextArea();
    		} catch(error) {
    			console.log({
    				error,
    				func: 'reRender',
    				pre: showPre,
    				post: showPost
    			});
    		}

    		renderCodeMirror();
    	}

    	// Function to reset the db 
    	function resetDB() {
    		AH.selectAll("#reset_button, #evalProRunCode", 'attr', { disabled: "disabled" });
    		AH.select("#output", 'html', '<div class="EvalbgBlue relative" style="top:40%"><div class="Evalloader"><span>{</span><span>}</span></div></div>');

    		AH.ajax({
    			url: evalpro_url,
    			type: 'POST',
    			data: {
    				'ajax': 1,
    				'in_editor': 0,
    				'is_svelte': 1,
    				user_guid,
    				db_name,
    				language,
    				'resetDB': resetProp[language] || 1
    			}
    		}).then(data => {
    			AH.selectAll("#reset_button, #evalProRunCode", 'attr', { disabled: false });
    			AH.select('#output', 'html', "Database reset complete!");

    			//$("#evalProRunCode").attr("disabled", false);
    			if (window.inNative) {
    				window.postMessage("EvalUserXml__");
    			}
    		}).catch((rqst, err) => {
    			AH.selectAll("#reset_button, #evalProRunCode", 'attr', { disabled: false });
    			AH.select("#output", 'html', "Database reset complete!");

    			if (window.inNative) {
    				window.postMessage("EvalUserXml__");
    			}
    		});
    	}

    	function remediationMode() {
    		$$invalidate(0, state.remediationToggle = true, state);
    		answerCheckEvalpro();
    	}

    	function submitEvalAns() {
    		let _uxml = AH.select("#special_module_user_xml").value;
    		_uxml = _uxml || window.QXML;

    		if (_uxml == undefined || _uxml == 'undefined' || _uxml == '') {
    			return;
    		}

    		AH.ajax({
    			url: evalpro_url,
    			data: {
    				'func': 'check_answer',
    				'is_svelte': 1,
    				'special_module_user_xml': _uxml,
    				user_guid,
    				content_guid
    			}
    		}).then(response => {
    			var result = JSON.parse(response);
    			var save_result = {};
    			save_result.ans = result?.answer;
    			save_result.uXml = result?.new_xml;
    			onUserAnsChange(save_result); // To save the answer

    			// Need to move this code in DE 
    			result = result?.extAnswerStr;

    			if (result.indexOf("<submit_output>") != -1) {
    				result = result.split("<submit_output>");
    				var error_detail = result[1].split("||");

    				if (error_detail[0] == "1") {
    					AH.select("#output", 'html', '<pre class="compilerPre d-flex overflow-x-scroll overflow-y-scroll">' + error_detail[4] + "</pre>");
    					AH.select("#output", 'css', { background: "rgb(255, 240, 240)" });
    				} else if (error_detail[4] != "") {
    					if (error_detail[4].includes("image_data:")) {
    						var image_url = error_detail[4].split("image_data:");
    						AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
    					} else if (error_detail[1] == "2") {
    						var formating_class = error_detail['3'] == '1'
    						? ''
    						: 'd-flex overflow-x-scroll overflow-y-scroll';

    						AH.select("#output", 'html', "<pre class=" + formating_class + ">" + error_detail[4] + "</pre>");
    					} else if (error_detail[1] == "1") {
    						AH.select("#output", 'html', "<pre>" + error_detail[4] + "</pre>");
    					} else {
    						AH.select("#output", 'html', error_detail[4]);
    					}

    					AH.select("#output", 'css', { background: "rgb(255, 255, 255)" });
    				} else {
    					AH.select("#output", 'html', "Your code didn\'t print anything.");
    				}
    			} // result = result[0];
    		});
    	}

    	function answerCheckEvalpro() {
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		let _uxml = AH.select("#special_module_user_xml").value;
    		_uxml = _uxml || window.QXML;

    		AH.ajax({
    			url: evalpro_url,
    			data: {
    				"uxml": _uxml,
    				"ajax": 1,
    				'is_svelte': 1,
    				'in_editor': 1,
    				user_guid
    			}
    		}).then(response => {
    			response = JSON.parse(response);

    			if (response['ajaxRes'] == 1) {
    				AH.select('#remediationModel', 'html', response['html']);
    				setUserAns(response['answer'] == "0" ? false : true);
    				$$invalidate(0, state.snackback = true, state);
    			}
    		});
    	}

    	function setUserAns(status) {
    		(AH.select("#answer"), checked = status);
    	}

    	function unRenderPlayer() {
    		AH.empty('#authoringDiv player');

    		AH.find('#authoringDiv', 'player', {
    			action: 'removeClass',
    			actionData: 'hidecontent'
    		});

    		AH.selectAll('#editor img').forEach(_elm => {
    			if (!_elm.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    				_elm.setAttribute('src', _elm.getAttribute('src'));
    			}
    		});
    	}

    	function renderPlayer() {
    		AH.empty('#authoringDiv player');
    		tag_player(AH.select('#authoringDiv'));

    		AH.find('#authoringDiv', 'player', {
    			action: 'addClass',
    			actionData: 'hidecontent'
    		});

    		AH.selectAll('#editor img').forEach(_elm => {
    			if (!_elm.getAttribute('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
    				_elm.setAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/' + _elm.getAttribute('src'));
    			}
    		});
    	}

    	function runCode(e) {
    		if (!state.isSubmit) {
    			e.target.disabled = true;
    		}

    		AH.select("#reset_button", 'attr', { disabled: true });
    		let uXML = AH.select("#special_module_user_xml").value;
    		AH.select("#output", 'css', { background: "rgb(255, 255, 255)" });
    		AH.select("#output", 'html', '<div class="EvalbgBlue relative" style="position: relative; top:50%; transform: translateY(-50%);"><div class="Evalloader"><span>{</span><span>}</span></div></div>');
    		let preCode = stringBetween(window.uaXML, "pre");
    		let postCode = stringBetween(window.uaXML, "post");
    		let code = "";

    		if (state.lang_type != 'sql' && state.lang_type != 'psql') {
    			code = preCode ? preCode : "";
    			code += editor.getValue();
    			code += postCode ? postCode : "";
    		} else {
    			code = preCode ? preCode : "";
    			code += editor.getValue();

    			if (showPost > 0) {
    				code += postCode ? postCode : "";
    			}
    		}

    		//@Pradeep - for native ajax
    		var codeData = {
    			code,
    			repltype: state.lang_type,
    			stdin: AH.select("#sampleInput").value,
    			'run_code': 1,
    			'is_svelte': 1,
    			user_guid,
    			// 'test_session_unique_id': window.test_session_uid,
    			content_guid,
    			db_name,
    			is_graph,
    			ignore_error,
    			ignore_reset_db,
    			is_pre_tag
    		};

    		if (window.inNative) {
    			codeData.in_native = 1;
    			codeData.native_user = 'demo@ucertify.com';
    			codeData.native_pwd = 'demo123';
    			codeData.isBySocial = "false";
    		}

    		AH.ajax({
    			type: "POST",
    			url: evalpro_url,
    			data: codeData,
    			dataType: 'json'
    		}).then(res => {
    			res = typeof res != "object" ? JSON.parse(res) : res;
    			AH.select("#reset_button", 'attr', { disabled: false });

    			AH.select('#output', 'css', {
    				color: "black",
    				background: "transparent"
    			});

    			//AH.select("#evalProRunCode").removeAttribute('disabled');
    			e.target.disabled = false;

    			if (res.status_message == "Successful") {
    				if (res.output) {
    					let oup = res.output;

    					if (state.lang_type == 'sql' || state.lang_type == 'psql' || state.lang_type == 'c++' || is_pre_tag == '1') {
    						AH.select('#output', 'html', '<pre>' + oup + '</pre>');
    					} else {
    						if (oup.includes("image_data:")) {
    							let image_url = oup.split("image_data:");
    							AH.select("#output", 'html', '<img src="data:image/jpg;base64, ' + image_url[1] + '" />');
    						} else if (state.lang_type == "r" || is_graph == '1') {
    							let formating_class = ignore_formatting == '1'
    							? ''
    							: 'd-flex overflow-x-scroll overflow-y-scroll';

    							AH.select("#output", 'html', "<pre class=" + formating_class + ">" + oup + "</pre>");
    						} else {
    							AH.select('#output', 'html', oup);
    						}
    					}

    					ISSPECIALMODULEUSERXMLCHANGE = 1;
    					AH.select("#special_module_user_xml", 'value', uXML);
    					window.uaXML = uXML;
    					updateNativeHeight();

    					if (window.inNative) {
    						window.postMessage("EvalUserXml__" + uXML);
    					}
    				} else {
    					AH.select('#output', 'html', "Your code didn't print anything.");
    				}
    			} else {
    				var errorOut = res.output == null
    				? "There are some issues to execute the code. Please try after a few seconds."
    				: parseLineNumber(res.stderr || res);

    				AH.select('#output', 'html', "<pre class='compilerPre'>" + errorOut.trim() + "</pre>");
    				AH.select('#output', 'css', { color: "#EB3941", background: "#FFF0F0" });

    				if (window.inNative) {
    					window.postMessage("EvalUserXml__");
    				}
    			}
    		});
    	} //@pradeep: check answer status.
    	//answerCheckEvalpro();

    	function parseLineNumber(errorMsg) {
    		let section = {
    			pre: typeof preEditor == "object" && preEditor.getValue() != ""
    			? preEditor.lineCount()
    			: 0,
    			editor: typeof editor == "object" && editor.getValue() != ""
    			? editor.lineCount()
    			: 0,
    			post: typeof postEditor == "object" && postEditor.getValue() != ""
    			? postEditor.lineCount()
    			: 0
    		};

    		let showpre = showPre;
    		let showpost = showPost;
    		let showeditor = showEditor;

    		switch (state.lang_type) {
    			case 'sql':
    				let line = errorMsg.split('at line');
    				if (line[1]) {
    					let lineNo = line[1].trim().substring(0, 2);
    					lineNo = lineNo.replace(":", "");

    					if (!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && lineNo <= section.pre || showpost && lineNo >= section.pre + section.editor || showeditor && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && showeditor && showpost) {
    						lineNo = getSectionLine(+lineNo, section);

    						if (isNaN(lineNo)) {
    							errorMsg = `${line[0]}${line[1].substr(2, line[1].length)}`;
    						} else {
    							errorMsg = `${line[0]} at line ${lineNo} ${line[1].substr(2, line[1].length)}`;
    						}
    					} else {
    						errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
    					}
    				}
    				break;
    			case 'java':
    				{
    					let line = errorMsg.split('Solution.java:');

    					if (line[1]) {
    						let lineNo = line[1].substr(0, 2);
    						lineNo = getSectionLine(lineNo, section);
    						lineNo = isNaN(lineNo) ? lineNo.replace(":", "") : lineNo;

    						if (!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && lineNo <= section.pre || showpost && lineNo >= section.pre + section.editor || showeditor && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && showeditor && showpost) {
    							errorMsg = errorMsg.replace(/ Line \d*/, ` Line ${lineNo}`);
    						} else {
    							errorMsg = "Unable to execute test cases, there are issues with your code. Please fix."; // errorMsg = `Line ${lineNo}: ` + line[1].substr(2,line[1].length);
    						}
    					}
    				}
    				break;
    			case 'python':
    				{
    					// In case of exception error <module> tag is coming so remove this from code
    					let is_module = errorMsg.indexOf("<module>");

    					let is_multiple_line = errorMsg.indexOf("line ", is_module);

    					if (is_module > -1 && is_multiple_line > -1) {
    						errorMsg = errorMsg.substring(is_module + ("<module>").length);
    					}

    					let line = errorMsg.split('line');

    					if (line[1]) {
    						line[1] = line[1].trim();
    						let lineNo = line[1].match(/\d+/);

    						if (!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && lineNo <= section.pre || showpost && lineNo >= section.pre + section.editor || showeditor && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && showeditor && showpost) {
    							lineNo = getSectionLine(lineNo, section);

    							// previous_line = (previous_line == "") ? line[0] : previous_line;
    							errorMsg = errorMsg.replace(/ line \d*/, ` line ${lineNo}`);
    						} else // errorMsg = previous_line + ` Line ${lineNo} ` + line[1].substr(1, line[1].length);
    						{
    							errorMsg = "Unable to execute test cases, there are issues with your code. Please fix."; // previous_line =  previous_line.replace(/ line \d*,/, "");
    						}
    					}
    				}
    				break;
    			case 'php':
    				{
    					let line = errorMsg.split('in /home/ucertify');

    					if (line[1]) {
    						let lineNo = line[1].split("line");
    						lineNo = getSectionLine(+lineNo[1], section);

    						if (!showpre && !showeditor && !showpost && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && lineNo <= section.pre || showpost && lineNo >= section.pre + section.editor || showeditor && lineNo > section.pre && lineNo <= section.pre + section.editor || showpre && showeditor && showpost) {
    							errorMsg = line[0] + "on line " + lineNo;
    						} else {
    							errorMsg = "Unable to execute test cases, there are issues with your code. Please fix.";
    						}
    					}
    				}
    				break;
    		}

    		return errorMsg;
    	}

    	// function reset() {
    	// 	editor.setValue("");
    	// }
    	function parseXML(xml) {
    		xml = xml ? xml : xml;
    		let editorData = stringBetween(xml, "editor");
    		editor.setValue(editorData ? editorData.trim() : "");
    		let preData = stringBetween(xml, "pre");

    		typeof preEditor == "object"
    		? preEditor.setValue(preData ? preData.trim() : "")
    		: true;

    		let postData = stringBetween(xml, "post");

    		typeof postEditor == "object"
    		? postEditor.setValue(postData ? postData.trim() : "")
    		: true;

    		changeDirection(null, null, "Right");
    		let sample = sample_input.replace(/\|.*/g, "");
    		let submit_output = stringBetween(xml, "submitoutput");

    		if (submit_output != "" && submit_output != null && submit_output != 'undefined') {
    			submit_output = submit_output.split("||");
    			sample = submit_output[2];
    		}

    		sample = (/\{|\[|\(/g).test(sample)
    		? sample.replace(/\|.+/g, "")
    		: sample.replace(/\|.+/g, "").replace(/\,/g, "\n");

    		if (sample.indexOf('__sep__')) {
    			sample = sample.replace(/__sep__/g, "\n");
    		}

    		document.querySelector("#sampleInput").value = sample;

    		if (state.lang_type == 'sql' || state.lang_type == 'psql') {
    			document.querySelector("#sampleInput").value = "";
    		}

    		return editorData;
    	}

    	function changeDirection(event, index, value) {
    		direction = value ? value : "Right";
    		$$invalidate(0, state.perspective = direction, state);
    		let code = document.querySelector("#editor-top");
    		let run = document.querySelector("#editor-footer");
    		let editor_div = document.querySelector("#code-editor");
    		run.style.cssText = "width:39.74%;min-height:120px;height:585px; padding-left: 0; padding-right: 0;";
    		AH.select('#output', 'css', { minHeight: "160px" });
    		AH.select('#testcase', 'css', { height: "180px" });
    		AH.select('#sampleInput', 'css', { height: "100%" });

    		//AH.select('#container', 'removeClass', 'px-2').classList.add(['border-left', 'border-right'])
    		AH.find('#container', '#no-main', { action: 'addClass', actionData: 'px-0' });

    		AH.selectAll('.test_card', 'css', { minWidth: "94%" });
    		code.style.cssText = "width:60%;height:calc(100vh - 45px); padding-left: 0; padding-right: 0;";

    		if (showPre && showPost && showEditor) {
    			AH.selectAll(".pre-div", 'css', {
    				maxHeight: "calc(25vh - 23px)",
    				height: "calc(25vh - 23px)",
    				display: "block",
    				overflow: "auto"
    			}); //manage pre post here

    			AH.selectAll(".replEditor", 'css', {
    				minHeight: "calc(50vh - 45px)",
    				height: "calc(50vh - 45px)"
    			});
    		} else if (showPre && showPost) {
    			AH.selectAll(".pre-div", 'css', {
    				maxHeight: "calc(50vh - 45px)",
    				overflow: "auto",
    				height: "auto",
    				display: "block"
    			}); //manage pre post here

    			AH.selectAll(".replEditor", 'css', { "display": "none" });
    		} else if (showPre && showEditor) {
    			let pre_visible_height = showPre == 1 ? 'auto' : '250px';
    			let editor_visible_height = AH.select(".full-editor").clientHeight - AH.select("#pre_div").clientHeight - 106;
    			AH.select("#pre_div").style.cssText = `height:${pre_visible_height}; max-height: calc(50vh - 45px);overflow:auto;display:block`; //manage pre post here

    			AH.selectAll(".replEditor", 'css', {
    				minHeight: "100px",
    				height: `${editor_visible_height}`
    			});
    		} else if (showPost && showEditor) {
    			AH.select("#post_div").style.cssText = "min-height:calc(50vh - 45px);height:calc(50vh - 45px);display:block"; //manage pre post here

    			AH.select(".replEditor", 'css', {
    				minHeight: "calc(50vh - 45px)",
    				height: "calc(50vh - 45px)"
    			});
    		} else if (showPre) {
    			AH.select("#pre_div").style.cssText = "min-height:calc(100vh - 90px);height:calc(100vh - 90px);display:block"; //manage pre post here
    			AH.selectAll(".replEditor", 'css', { display: "none" });
    		} else if (showPost) {
    			AH.select("#post_div").style.cssText = "min-height:calc(100vh - 90px);height:calc(100vh - 90px);display:block"; //manage pre post here
    			AH.selectAll(".replEditor", 'css', { display: "none" });
    		} else {
    			AH.selectAll(".replEditor", 'css', { display: "block" });

    			AH.selectAll(".replEditor", 'css', {
    				minHeight: "350px",
    				height: "calc(100vh - 90px)"
    			});
    		}

    		if (showPre < 2 && showPre > 0) {
    			preEditor.setOption("readOnly", true);
    			AH.select("#pre_div .CodeMirror-scroll").className = "CodeMirror-scroll bg-light";
    			AH.selectAll("#pre_div .pre_msg", 'addClass', 'd-block');
    			AH.selectAll("#pre_div .pre_msg", 'removeClass', 'd-none');
    			AH.select("#pre_div", 'css', { paddingBottom: '20px' });
    		} else if (showPre) {
    			preEditor.setOption("readOnly", false);
    			AH.select("#pre_div .CodeMirror-scroll").className = "CodeMirror-scroll";
    			AH.selectAll("#pre_div .pre_msg", 'removeClass', 'd-block');
    			AH.selectAll("#pre_div .pre_msg", 'addClass', 'd-none');
    		}

    		if (showPost < 2 && showPost > 0) {
    			postEditor.setOption("readOnly", true);
    			AH.select("#post_div .CodeMirror-scroll").className = "CodeMirror-scroll bg-light";
    			AH.select("#post_div .post_msg", 'addClass', 'd-block');
    			AH.select("#post_div .post_msg", 'removeClass', 'd-none');
    			AH.select("#post_div", 'css', { paddingTop: '20px' });
    		} else if (showPost) {
    			postEditor.setOption("readOnly", false);
    			AH.select("#post_div .CodeMirror-scroll").className = "CodeMirror-scroll";
    			AH.selectAll("#post_div .post_msg", 'removeClass', 'd-block');
    			AH.selectAll("#post_div .post_msg", 'addClass', 'd-none');
    		}

    		

    		switch (value) {
    			case 'Left':
    				{
    					run.className = "float-left";
    					code.className = "float-right";
    					break;
    				}
    			case 'Right':
    				{
    					run.className = "float-right";
    					code.className = "float-left";
    					break;
    				}
    			default:
    				{
    					setTimeout(
    						function () {
    							AH.select('#output', 'css', { height: '125px' });
    						},
    						301
    					);

    					code.style.cssText = "margin-bottom: 5px; overflow: auto";
    					code.className = null;
    					editor_div.style.minHeight = "auto";
    					AH.selectAll("#output, #testcase", 'css', { minHeight: "125px" });
    					AH.select("#sampleInput", 'css', { height: "100%" });
    					run.style.cssText = "";
    					run.className = null;
    					AH.selectAll('.test_card', 'css', { minWidth: "350px" });
    				}
    		}

    		//Responsive for mobile devices
    		if (window.inNative) return true;

    		if (window.screen.availWidth < 768) {
    			code.style.cssText = "margin-bottom:20px;width:100%";
    			run.style.cssText = "width:100%";
    			code.className = "";
    			run.className = "";
    			editor_div.style.minHeight = "199px";
    			editor_div.style.maxHeight = "200px";
    			AH.select('#output', 'css', { minHeight: "60px" });
    			AH.select('#output', 'css', { height: "160px" });
    		}

    		if (state.lang_type == "sql" || state.lang_type == "psql") {
    			document.querySelector("#input").parentElement.style.display = 'none';
    			document.querySelector("#output").style.height = 'calc(100vh - 46px)';
    		} else {
    			AH.selectAll('.output_div', 'addClass', 'border-top-0');
    			AH.selectAll('.input_div', 'addClass', 'border-bottom-0');
    		} //$('.editor-footer-div').height('100vh').split({orientation:'horizontal', limit:130, position:'21%'}, $(".input_div"), $(".output_div"));
    	} //AH.parent(AH.select('.uc-item-test-template:not(.not_in_quizplayer)'), 'body').style.overflow =  'hidden';

    	function saveEvalProAnswer(code, type) {
    		let qxml = !(/<SMXML/gi).test(window.uaXML) || !window.uaXML
    		? window.QXML
    		: window.uaXML;

    		let prefix = qxml.split(`<${type}>`); // getting part of before tag
    		let suffix = qxml.split(`</${type}>`); // getting part og after tag

    		//@pradeep: Combining with new code for that tag
    		let uXml = prefix[0] + `<${type}>` + code + `</${type}>` + suffix[1];

    		//To add the lineSection 
    		var lineSection = [
    			typeof preEditor == "object" && preEditor.getValue() != ""
    			? preEditor.lineCount()
    			: 0,
    			typeof editor == "object" && editor.getValue() != ""
    			? editor.lineCount()
    			: 0,
    			typeof postEditor == "object" && postEditor.getValue() != ""
    			? postEditor.lineCount()
    			: 0
    		];

    		lineSection = lineSection.join(",");
    		uXml = uXml.replace(/lineSection="[\s\S]*?"/g, 'lineSection="' + lineSection + '"');

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		ISSPECIALMODULEUSERXMLCHANGE = 1;
    		AH.select("#special_module_user_xml", 'value', uXml);
    		window.uaXML = uXml;
    	}

    	//Pradeep -
    	function destructor() {
    		if (tempGuid != window.content_guid) {
    			tempGuid = window.content_guid;
    			
    			db_name = findAttribute(window.QXML, 'db_name');
    		}
    	}

    	const writable_props = ['xml', 'uxml', 'ansStatus', 'isReview', 'content_guid', 'sample_input'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<EvalPreview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, state.confirmBoxOpen = true, state);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, state.confirmBoxOpen = false, state);
    	};

    	function dialog_visible_binding(value) {
    		if ($$self.$$.not_equal(state.confirmBoxOpen, value)) {
    			state.confirmBoxOpen = value;
    			$$invalidate(0, state);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('xml' in $$props) $$invalidate(7, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(8, uxml = $$props.uxml);
    		if ('ansStatus' in $$props) $$invalidate(9, ansStatus = $$props.ansStatus);
    		if ('isReview' in $$props) $$invalidate(10, isReview = $$props.isReview);
    		if ('content_guid' in $$props) $$invalidate(11, content_guid = $$props.content_guid);
    		if ('sample_input' in $$props) $$invalidate(12, sample_input = $$props.sample_input);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		beforeUpdate,
    		Button,
    		Dialog,
    		writable,
    		l,
    		AH,
    		onUserAnsChange,
    		ItemHelper,
    		xml,
    		uxml,
    		ansStatus,
    		isReview,
    		content_guid,
    		sample_input,
    		evalpro_url,
    		user_guid,
    		tempGuid,
    		client,
    		markerFlag,
    		language,
    		isPreview,
    		xmlArr,
    		langArr,
    		lang_type,
    		showPre,
    		showPost,
    		showEditor,
    		direction,
    		resetProp,
    		editor,
    		preEditor,
    		postEditor,
    		UXML,
    		db_name,
    		is_graph,
    		ignore_error,
    		ignore_formatting,
    		ignore_reset_db,
    		is_pre_tag,
    		marker,
    		state,
    		hdd,
    		unsubs,
    		didMount,
    		setReview,
    		unsetReview,
    		disableLine,
    		getChildXml,
    		toTitleCase,
    		checkLine,
    		updateOuput,
    		renderCodeMirror,
    		changeTheme,
    		reRender,
    		resetDB,
    		remediationMode,
    		submitEvalAns,
    		answerCheckEvalpro,
    		setUserAns,
    		stringBetween,
    		findAttribute,
    		unRenderPlayer,
    		renderPlayer,
    		updateNativeHeight,
    		runCode,
    		parseLineNumber,
    		getSectionLine,
    		parseXML,
    		changeDirection,
    		saveEvalProAnswer,
    		destructor
    	});

    	$$self.$inject_state = $$props => {
    		if ('xml' in $$props) $$invalidate(7, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(8, uxml = $$props.uxml);
    		if ('ansStatus' in $$props) $$invalidate(9, ansStatus = $$props.ansStatus);
    		if ('isReview' in $$props) $$invalidate(10, isReview = $$props.isReview);
    		if ('content_guid' in $$props) $$invalidate(11, content_guid = $$props.content_guid);
    		if ('sample_input' in $$props) $$invalidate(12, sample_input = $$props.sample_input);
    		if ('evalpro_url' in $$props) evalpro_url = $$props.evalpro_url;
    		if ('user_guid' in $$props) user_guid = $$props.user_guid;
    		if ('tempGuid' in $$props) tempGuid = $$props.tempGuid;
    		if ('client' in $$props) client = $$props.client;
    		if ('markerFlag' in $$props) markerFlag = $$props.markerFlag;
    		if ('language' in $$props) language = $$props.language;
    		if ('isPreview' in $$props) isPreview = $$props.isPreview;
    		if ('xmlArr' in $$props) xmlArr = $$props.xmlArr;
    		if ('langArr' in $$props) langArr = $$props.langArr;
    		if ('lang_type' in $$props) lang_type = $$props.lang_type;
    		if ('showPre' in $$props) showPre = $$props.showPre;
    		if ('showPost' in $$props) showPost = $$props.showPost;
    		if ('showEditor' in $$props) showEditor = $$props.showEditor;
    		if ('direction' in $$props) direction = $$props.direction;
    		if ('resetProp' in $$props) resetProp = $$props.resetProp;
    		if ('editor' in $$props) editor = $$props.editor;
    		if ('preEditor' in $$props) preEditor = $$props.preEditor;
    		if ('postEditor' in $$props) postEditor = $$props.postEditor;
    		if ('UXML' in $$props) UXML = $$props.UXML;
    		if ('db_name' in $$props) db_name = $$props.db_name;
    		if ('is_graph' in $$props) is_graph = $$props.is_graph;
    		if ('ignore_error' in $$props) ignore_error = $$props.ignore_error;
    		if ('ignore_formatting' in $$props) ignore_formatting = $$props.ignore_formatting;
    		if ('ignore_reset_db' in $$props) ignore_reset_db = $$props.ignore_reset_db;
    		if ('is_pre_tag' in $$props) is_pre_tag = $$props.is_pre_tag;
    		if ('marker' in $$props) marker = $$props.marker;
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('hdd' in $$props) hdd = $$props.hdd;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		state,
    		setReview,
    		unsetReview,
    		changeTheme,
    		reRender,
    		resetDB,
    		runCode,
    		xml,
    		uxml,
    		ansStatus,
    		isReview,
    		content_guid,
    		sample_input,
    		click_handler,
    		click_handler_1,
    		dialog_visible_binding
    	];
    }

    class EvalPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				xml: 7,
    				uxml: 8,
    				ansStatus: 9,
    				isReview: 10,
    				content_guid: 11,
    				sample_input: 12
    			},
    			add_css$4,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EvalPreview",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[7] === undefined && !('xml' in props)) {
    			console_1$1.warn("<EvalPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[8] === undefined && !('uxml' in props)) {
    			console_1$1.warn("<EvalPreview> was created without expected prop 'uxml'");
    		}

    		if (/*ansStatus*/ ctx[9] === undefined && !('ansStatus' in props)) {
    			console_1$1.warn("<EvalPreview> was created without expected prop 'ansStatus'");
    		}

    		if (/*isReview*/ ctx[10] === undefined && !('isReview' in props)) {
    			console_1$1.warn("<EvalPreview> was created without expected prop 'isReview'");
    		}

    		if (/*content_guid*/ ctx[11] === undefined && !('content_guid' in props)) {
    			console_1$1.warn("<EvalPreview> was created without expected prop 'content_guid'");
    		}
    	}

    	get xml() {
    		throw new Error("<EvalPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<EvalPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<EvalPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<EvalPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ansStatus() {
    		throw new Error("<EvalPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ansStatus(value) {
    		throw new Error("<EvalPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<EvalPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<EvalPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content_guid() {
    		throw new Error("<EvalPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content_guid(value) {
    		throw new Error("<EvalPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sample_input() {
    		throw new Error("<EvalPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sample_input(value) {
    		throw new Error("<EvalPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const defXMl = '';

    const app = new EvalPreview({
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
//# sourceMappingURL=bundle_q24.js.map
