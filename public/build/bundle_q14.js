
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
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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

    /*!
     * hotkeys-js v3.8.1
     * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies.
     * 
     * Copyright (c) 2020 kenny wong <wowohoo@qq.com>
     * http://jaywcjlove.github.io/hotkeys
     * 
     * Licensed under the MIT license.
     */

    var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

    function addEvent(object, event, method) {
      if (object.addEventListener) {
        object.addEventListener(event, method, false);
      } else if (object.attachEvent) {
        object.attachEvent("on".concat(event), function () {
          method(window.event);
        });
      }
    } // 修饰键转换成对应的键码


    function getMods(modifier, key) {
      var mods = key.slice(0, key.length - 1);

      for (var i = 0; i < mods.length; i++) {
        mods[i] = modifier[mods[i].toLowerCase()];
      }

      return mods;
    } // 处理传的key字符串转换成数组


    function getKeys(key) {
      if (typeof key !== 'string') key = '';
      key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

      var keys = key.split(','); // 同时设置多个快捷键，以','分割

      var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

      for (; index >= 0;) {
        keys[index - 1] += ',';
        keys.splice(index, 1);
        index = keys.lastIndexOf('');
      }

      return keys;
    } // 比较修饰键的数组


    function compareArray(a1, a2) {
      var arr1 = a1.length >= a2.length ? a1 : a2;
      var arr2 = a1.length >= a2.length ? a2 : a1;
      var isIndex = true;

      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
      }

      return isIndex;
    }

    var _keyMap = {
      backspace: 8,
      tab: 9,
      clear: 12,
      enter: 13,
      return: 13,
      esc: 27,
      escape: 27,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      del: 46,
      delete: 46,
      ins: 45,
      insert: 45,
      home: 36,
      end: 35,
      pageup: 33,
      pagedown: 34,
      capslock: 20,
      '⇪': 20,
      ',': 188,
      '.': 190,
      '/': 191,
      '`': 192,
      '-': isff ? 173 : 189,
      '=': isff ? 61 : 187,
      ';': isff ? 59 : 186,
      '\'': 222,
      '[': 219,
      ']': 221,
      '\\': 220
    }; // Modifier Keys

    var _modifier = {
      // shiftKey
      '⇧': 16,
      shift: 16,
      // altKey
      '⌥': 18,
      alt: 18,
      option: 18,
      // ctrlKey
      '⌃': 17,
      ctrl: 17,
      control: 17,
      // metaKey
      '⌘': 91,
      cmd: 91,
      command: 91
    };
    var modifierMap = {
      16: 'shiftKey',
      18: 'altKey',
      17: 'ctrlKey',
      91: 'metaKey',
      shiftKey: 16,
      ctrlKey: 17,
      altKey: 18,
      metaKey: 91
    };
    var _mods = {
      16: false,
      18: false,
      17: false,
      91: false
    };
    var _handlers = {}; // F1~F12 special key

    for (var k = 1; k < 20; k++) {
      _keyMap["f".concat(k)] = 111 + k;
    }

    var _downKeys = []; // 记录摁下的绑定键

    var _scope = 'all'; // 默认热键范围

    var elementHasBindEvent = []; // 已绑定事件的节点记录
    // 返回键码

    var code = function code(x) {
      return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
    }; // 设置获取当前范围（默认为'所有'）


    function setScope(scope) {
      _scope = scope || 'all';
    } // 获取当前范围


    function getScope() {
      return _scope || 'all';
    } // 获取摁下绑定键的键值


    function getPressedKeyCodes() {
      return _downKeys.slice(0);
    } // 表单控件控件判断 返回 Boolean
    // hotkey is effective only when filter return true


    function filter(event) {
      var target = event.target || event.srcElement;
      var tagName = target.tagName;
      var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

      if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
        flag = false;
      }

      return flag;
    } // 判断摁下的键是否为某个键，返回true或者false


    function isPressed(keyCode) {
      if (typeof keyCode === 'string') {
        keyCode = code(keyCode); // 转换成键码
      }

      return _downKeys.indexOf(keyCode) !== -1;
    } // 循环删除handlers中的所有 scope(范围)


    function deleteScope(scope, newScope) {
      var handlers;
      var i; // 没有指定scope，获取scope

      if (!scope) scope = getScope();

      for (var key in _handlers) {
        if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
          handlers = _handlers[key];

          for (i = 0; i < handlers.length;) {
            if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
          }
        }
      } // 如果scope被删除，将scope重置为all


      if (getScope() === scope) setScope(newScope || 'all');
    } // 清除修饰键


    function clearModifier(event) {
      var key = event.keyCode || event.which || event.charCode;

      var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


      if (i >= 0) {
        _downKeys.splice(i, 1);
      } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


      if (event.key && event.key.toLowerCase() === 'meta') {
        _downKeys.splice(0, _downKeys.length);
      } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


      if (key === 93 || key === 224) key = 91;

      if (key in _mods) {
        _mods[key] = false; // 将修饰键重置为false

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys$1[k] = false;
        }
      }
    }

    function unbind(keysInfo) {
      // unbind(), unbind all keys
      if (!keysInfo) {
        Object.keys(_handlers).forEach(function (key) {
          return delete _handlers[key];
        });
      } else if (Array.isArray(keysInfo)) {
        // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
        keysInfo.forEach(function (info) {
          if (info.key) eachUnbind(info);
        });
      } else if (typeof keysInfo === 'object') {
        // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
        if (keysInfo.key) eachUnbind(keysInfo);
      } else if (typeof keysInfo === 'string') {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        // support old method
        // eslint-disable-line
        var scope = args[0],
            method = args[1];

        if (typeof scope === 'function') {
          method = scope;
          scope = '';
        }

        eachUnbind({
          key: keysInfo,
          scope: scope,
          method: method,
          splitKey: '+'
        });
      }
    } // 解除绑定某个范围的快捷键


    var eachUnbind = function eachUnbind(_ref) {
      var key = _ref.key,
          scope = _ref.scope,
          method = _ref.method,
          _ref$splitKey = _ref.splitKey,
          splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
      var multipleKeys = getKeys(key);
      multipleKeys.forEach(function (originKey) {
        var unbindKeys = originKey.split(splitKey);
        var len = unbindKeys.length;
        var lastKey = unbindKeys[len - 1];
        var keyCode = lastKey === '*' ? '*' : code(lastKey);
        if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

        if (!scope) scope = getScope();
        var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
        _handlers[keyCode] = _handlers[keyCode].map(function (record) {
          // 通过函数判断，是否解除绑定，函数相等直接返回
          var isMatchingMethod = method ? record.method === method : true;

          if (isMatchingMethod && record.scope === scope && compareArray(record.mods, mods)) {
            return {};
          }

          return record;
        });
      });
    }; // 对监听对应快捷键的回调函数进行处理


    function eventHandler(event, handler, scope) {
      var modifiersMatch; // 看它是否在当前范围

      if (handler.scope === scope || handler.scope === 'all') {
        // 检查是否匹配修饰符（如果有返回true）
        modifiersMatch = handler.mods.length > 0;

        for (var y in _mods) {
          if (Object.prototype.hasOwnProperty.call(_mods, y)) {
            if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
              modifiersMatch = false;
            }
          }
        } // 调用处理程序，如果是修饰键不做处理


        if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
          if (handler.method(event, handler) === false) {
            if (event.preventDefault) event.preventDefault();else event.returnValue = false;
            if (event.stopPropagation) event.stopPropagation();
            if (event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    } // 处理keydown事件


    function dispatch$1(event) {
      var asterisk = _handlers['*'];
      var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

      if (!hotkeys$1.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
      // Webkit左右 command 键值不一样

      if (key === 93 || key === 224) key = 91;
      /**
       * Collect bound keys
       * If an Input Method Editor is processing key input and the event is keydown, return 229.
       * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
       * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
       */

      if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
      /**
       * Jest test cases are required.
       * ===============================
       */

      ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
        var keyNum = modifierMap[keyName];

        if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
          _downKeys.push(keyNum);
        } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
          _downKeys.splice(_downKeys.indexOf(keyNum), 1);
        } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
          /**
           * Fix if Command is pressed:
           * ===============================
           */
          if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
            _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
          }
        }
      });
      /**
       * -------------------------------
       */

      if (key in _mods) {
        _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys$1[k] = true;
        }

        if (!asterisk) return;
      } // 将 modifierMap 里面的修饰键绑定到 event 中


      for (var e in _mods) {
        if (Object.prototype.hasOwnProperty.call(_mods, e)) {
          _mods[e] = event[modifierMap[e]];
        }
      }
      /**
       * https://github.com/jaywcjlove/hotkeys/pull/129
       * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
       * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
       * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
       */


      if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
        if (_downKeys.indexOf(17) === -1) {
          _downKeys.push(17);
        }

        if (_downKeys.indexOf(18) === -1) {
          _downKeys.push(18);
        }

        _mods[17] = true;
        _mods[18] = true;
      } // 获取范围 默认为 `all`


      var scope = getScope(); // 对任何快捷键都需要做的处理

      if (asterisk) {
        for (var i = 0; i < asterisk.length; i++) {
          if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
            eventHandler(event, asterisk[i], scope);
          }
        }
      } // key 不在 _handlers 中返回


      if (!(key in _handlers)) return;

      for (var _i = 0; _i < _handlers[key].length; _i++) {
        if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
          if (_handlers[key][_i].key) {
            var record = _handlers[key][_i];
            var splitKey = record.splitKey;
            var keyShortcut = record.key.split(splitKey);
            var _downKeysCurrent = []; // 记录当前按键键值

            for (var a = 0; a < keyShortcut.length; a++) {
              _downKeysCurrent.push(code(keyShortcut[a]));
            }

            if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
              // 找到处理内容
              eventHandler(event, record, scope);
            }
          }
        }
      }
    } // 判断 element 是否已经绑定事件


    function isElementBind(element) {
      return elementHasBindEvent.indexOf(element) > -1;
    }

    function hotkeys$1(key, option, method) {
      _downKeys = [];
      var keys = getKeys(key); // 需要处理的快捷键列表

      var mods = [];
      var scope = 'all'; // scope默认为all，所有范围都有效

      var element = document; // 快捷键事件绑定节点

      var i = 0;
      var keyup = false;
      var keydown = true;
      var splitKey = '+'; // 对为设定范围的判断

      if (method === undefined && typeof option === 'function') {
        method = option;
      }

      if (Object.prototype.toString.call(option) === '[object Object]') {
        if (option.scope) scope = option.scope; // eslint-disable-line

        if (option.element) element = option.element; // eslint-disable-line

        if (option.keyup) keyup = option.keyup; // eslint-disable-line

        if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

        if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
      }

      if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

      for (; i < keys.length; i++) {
        key = keys[i].split(splitKey); // 按键列表

        mods = []; // 如果是组合快捷键取得组合快捷键

        if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

        key = key[key.length - 1];
        key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
        // 判断key是否在_handlers中，不在就赋一个空数组

        if (!(key in _handlers)) _handlers[key] = [];

        _handlers[key].push({
          keyup: keyup,
          keydown: keydown,
          scope: scope,
          mods: mods,
          shortcut: keys[i],
          method: method,
          key: keys[i],
          splitKey: splitKey
        });
      } // 在全局document上设置快捷键


      if (typeof element !== 'undefined' && !isElementBind(element) && window) {
        elementHasBindEvent.push(element);
        addEvent(element, 'keydown', function (e) {
          dispatch$1(e);
        });
        addEvent(window, 'focus', function () {
          _downKeys = [];
        });
        addEvent(element, 'keyup', function (e) {
          dispatch$1(e);
          clearModifier(e);
        });
      }
    }

    var _api = {
      setScope: setScope,
      getScope: getScope,
      deleteScope: deleteScope,
      getPressedKeyCodes: getPressedKeyCodes,
      isPressed: isPressed,
      filter: filter,
      unbind: unbind
    };

    for (var a in _api) {
      if (Object.prototype.hasOwnProperty.call(_api, a)) {
        hotkeys$1[a] = _api[a];
      }
    }

    if (typeof window !== 'undefined') {
      var _hotkeys = window.hotkeys;

      hotkeys$1.noConflict = function (deep) {
        if (deep && window.hotkeys === hotkeys$1) {
          window.hotkeys = _hotkeys;
        }

        return hotkeys$1;
      };

      window.hotkeys = hotkeys$1;
    }

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
    class Draggable extends JUI {
        constructor(options) {
            super();
            this.options = options || {};
            this.events = {
                "drag" : this.onDrag.bind(this), 
                "dragend": this.onDragEnd.bind(this), 
                "dragenter": this.onDragEnter.bind(this), 
                "dragexit": this.onDragExit.bind(this), 
                "dragleave": this.onDragLeave.bind(this), 
                "dragover": this.onDragOver.bind(this), 
                "dragstart": this.onDragStart.bind(this), 
                "drop": this.onDrop.bind(this),
            };
            this.init();
            this.currentDrag = "";
            this.dragState = true;
        }

        init() {
           for (let name in this.events) {
               if (this.events[name]) {
                    document.removeEventListener(name, this.events[name], true);
                    document.addEventListener(name, this.events[name], true);
               }
           }
        }

        setDrag(target) {
            let selected = (typeof target == 'object') ? target : document.querySelector(target);
            //selected.setAttribute('dragable', 1);
            selected.setAttribute('draggable', true);
        }

        setDrop(target) {
            let selected = (typeof target == 'object') ? target : document.querySelector(target);
            selected.setAttribute('dropzone', 1);
        }

        disableDrag(target) {
            let selected = (typeof target == 'object') ? target : document.querySelector(target);
            if (selected) {
                selected.removeAttribute(['dragable','draggable']);
                selected.classList.remove('dragable');
            }
        }

        enableDrag(target) {
            let selected = (typeof target == 'object') ? target : document.querySelector(target);
            if (selected) {
                selected.setAttribute('dragable', 1);
                selected.setAttribute('draggable', true);
                selected.classList.add('dragable');
            }
        }

        //This event is fired when an element or text selection is being dragged.
        onDrag(event) {
            // calling user defined function
            if (this.options.onDrag) this.options.onDrag(event);
        }
            
        //This event is fired when an element is no longer the drag operation's immediate selection target
        onDragExit(event) {
            if (this.dragState) {
                // calling user defined function
                if (this.options.onDragExit) this.options.onDragExit(event);
            }
        }

        //This event is fired when a dragged element or text selection enters a valid drop target.
        onDragEnter(event) {
            // highlight potential drop target when the draggable element enters it
            if ( this.dragState && this.isValidDrop(event) ) {
                // calling user defined function
                if (this.options.onDragEnter) this.options.onDragEnter(event);
            }

        }

        //This event is fired when the user starts dragging an element or text selection.
        onDragStart(event) {
            if (this.isValidDrag(event)) {
                this.dragState = true;
                // store a ref. on the dragged elem
                this.currentDrag = event.target;
                
                // make it half transparent
                event.target.style.opacity = .2;

                // calling user defined function
                if (this.options.onDragStart) this.options.onDragStart(event);
            } else {
                this.dragState = false;
                //event.dataTrasfer.dropEffect = 'none'
            }
        }

        //This event is fired when a dragged element or text selection leaves a valid drop target.
        onDragLeave(event) {
            // reset background of potential drop target when the draggable element leaves it
            if ( this.dragState && this.isValidDrop(event) ) {
                // calling user defined function
                if (this.options.onDragLeave) this.options.onDragLeave(event, this.currentDrag);
            }
        }

        //This event is fired continuously when an element or text selection is being dragged and 
        //the mouse pointer is over a valid drop target (every 50 ms WHEN mouse is not moving 
        //ELSE much faster between 5 ms (slow movement) and 1ms (fast movement) approximately
        onDragOver(event) {
            // prevent default to allow drop
            event.preventDefault();

            // calling user defined function
            if (this.options.onDragOver) this.options.onDragOver(event, this.currentDrag);
        }

        //This event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key)
        onDragEnd(event) {
            // reset the transparency
            event.target.style.opacity = "";

            // calling user defined function
            if (this.options.onDragEnd) this.options.onDragEnd(event, this.currentDrag);
        }

        //This event is fired when an element or text selection is dropped on a valid drop target.
        onDrop(event) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            // move dragged elem to the selected drop target
            if (this.dragState && this.isValidDrop(event) ) {
                //event.target.style.background = "";
                if (this.options.remove) this.currentDrag.parentNode.removeChild( this.currentDrag );
                if (this.options.copy) event.target.appendChild( this.currentDrag.cloneNode(true) );
                // calling user defined function
                if (this.options.onDrop) this.options.onDrop(event, this.currentDrag);
                //.draggable('destroy');
            }
        }

        isValidDrop(event) {
            if (event.target.getAttribute('dropzone') || event.target.classList.contains('dropable') || this.parent(event.target, "[dropzone]") || this.parent(event.target, ".dropable") ) {
                return true;
            } else {
                return false;
            }
        }

        isValidDrag(event) {
            if (event.target.getAttribute('dragable') || event.target.getAttribute('draggable') || this.parent(event.target, "[dragable]")) {
                return true;
            } else {
                return false;
            }
        }

    }

    const JS = new JUI();

    const AH = new JUI();
    const ucMlid = {};
    ucMlid.sinfo = true;
    ucMlid.multimatch = 0;
    ucMlid.ajax_eId = "#matchmain";
    ucMlid.is_valid_drop = false;
    let match_lines = [];
    let dragable;


    ucMlid.removeUserAns = function() {
        AH.find("#matchmain","#lines, .matchlist-delete",{ action:'remove'});
        AH.selectAll("#matchmain div[data-userans]").forEach((_this)=> {
            _this.setAttribute("data-userans", "");
        });
    };



    ucMlid.update_XMLValue = function() {
        ucMlid.xmlDom = AH.select("#special_module_xml").value;
        ucMlid.multimatch = AH.select("#matchType").value;
        if(AH.select("#multimatch").checked) {
            ucMlid.multimatch = 1;
        }
        
        let ucMlidXMLDom = AH.findChild(ucMlid.xmlDom, 'matchlist');
        AH.setAttr(ucMlidXMLDom, {
            "listheading1": AH.select("#list1").value,
            "listheading2": AH.select("#list2").value,
            "multimatch": ucMlid.multimatch
        });
        ucMlidXMLDom.innerHTML = "<![CDATA[\n" + AH.select("#matchList").value + "\n]]>";
        AH.select("#special_module_xml", 'value', formatXml(ucMlid.xmlDom.xml ? ucMlid.xmlDom.xml : (new XMLSerializer()).serializeToString(ucMlid.xmlDom[0])) );
    };



    ucMlid.remove_lines = function(mlid) {
        AH.select(mlid+' #remMatchLine','remove');
        AH.listen('body', 'click','.matchlist-delete', (element)=> {
            let rem = {
                path : element.getAttribute('d'),
                base : element.getAttribute('base').split('_'),
            };
            rem.userans = AH.find("#matchmain", `[id="${rem.base[0]}"]`).getAttribute('data-userans').split(',');
            if (rem.userans.includes(rem.base[1]) != false) { 
                rem.userans.splice(rem.userans.indexOf(rem.base[1]), 1); 
            }
            rem.userans = rem.userans.join(',');
            if (rem.userans.substr(0, 1) == ',') { 
                rem.userans = rem.userans.substr(1, rem.userans.length); 
            }
            AH.select(`[id="${rem.base[0]}"]`, 'attr', {"data-userans" : rem.userans});
            rem.path = (rem.path.substr(1, rem.path.length)).split('C');
            rem.l1 = rem.path[0].trim().replace(/ /g, ',').split(',');
            rem.l2 = rem.path[1].trim().replace(/ /g, ',').split(',');
            rem.index = parseInt(rem.l1[rem.l1.length - 1]) + "_" + (parseInt(rem.l1[rem.l1.length - 2]) - 20) + "," + parseInt(rem.l2[rem.l2.length - 1]) + "_" + (parseInt(rem.l2[rem.l2.length - 2]) + 10) + "," + element.getAttribute('base');
            match_lines.splice(match_lines.indexOf(rem.index), 1);
            AH.remove(`[base='${element.getAttribute('base')}']`);
            ucMlid.checkAns(match_lines);
            setTimeout(function() { ucMlid.checkAns(mlid); }, 200);
        });
    };


    // jQuery(document).on('click','.donotshowdialog', function() {
    //     var action = (jQuery(this).prop('checked') == true) ? 'store' : 'remove';
    //     ucMlid.storeDoNotShow(user_guid, action);
    // });

    AH.listen(document,'click','.donotshowdialo',(_this) => {
        ucMlid.storeDoNotShow(user_guid, (_this.checked == true) ? 'store' : 'remove');
    }); //will change

    ucMlid.storeDoNotShow = function(user_guid, action) {
        let localdata = JSON.parse(localStorage.getItem('dontshowdialog'));
        if (action == 'store') {
            if (localdata == null) {
                localdata = {};        //@Fixed eslint issues 
            }
            localdata[user_guid] = 1;  
            localStorage.setItem('dontshowdialog', JSON.stringify(localdata));       
        } else if (action == 'remove') {
            if (localdata != null) {
                delete localdata[user_guid]; 
                localStorage.setItem('dontshowdialog', JSON.stringify(localdata));  
            }       
        }    
    }; // No Need to fix
    ucMlid.chkDoNotShow = function(user_guid) {
        const localdata = JSON.parse(localStorage.getItem('dontshowdialog'));
        if (localdata != null && user_guid in localdata) {
            return true;
        }
        return false;
    }; // No need to fix

    ucMlid.showUserAns = function(mlid) {
        let top1 = 0;
        match_lines = [];
        ucMlid.multimatch = AH.select(mlid).getAttribute("multimatch"); // Replaced
        //const draggable_ele = ucMlid.multimatch == 2 ? ".list4" : ".list1";
        ucMlid.showAns(mlid);
        ucMlid.dragOptionMatchlist = {
            zIndex: 100,
            cursorAt: { top: -10, left: -10 },
            cursor: "default",
            // revert(is_valid_drop) {
            //     if (!is_valid_drop) {
            //         if (ucMlid.sinfo) {
            //             ucMlid.sinfo = false;
            //             setTimeout(function() {
            //                 ucMlid.sinfo = true;
            //             }, 60 * 1000);
            //             if (!UCINFO.isIphone) {
            //                 if (typeof(showmsg) == 'function') showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 3);
            //                 if(ucMlid.chkDoNotShow(user_guid) != true) {
            //                     if (typeof(bindDialog) == 'function') bindDialog({ click: this, wd: 450, ht: 236, data: '<div title="How to drop?"><img src="' + jQuery(mlid).attr('path') + 'match_drop_000BOG.gif" /><br/><span><label><input type="checkbox" style="top:2px;" class="relative donotshowdialog"> Do not show this dialog again</label></span></div>' });
            //                 }
            //             }
            //         }
            //         return true;
            //     }
            // },
            // start() {
            //     const _this = jQuery(this);
            //     console.log(_this);
            //     top = parseInt(_this.position().top + _this.height() / 2) + "_" + parseInt(_this.position().left + _this.width());
            //     _this.after(_this.clone().addClass("clone").css({
            //         "position": "absolute",
            //         "top": _this.position().top,
            //         "left": _this.position().left,
            //         "width": _this.width() + 20,
            //         "height": _this.height() + 15
            //     }));
            //    // console.log(top)
            // },
            // stop() {
            //     const _this = jQuery(this);
            //     _this.removeAttr('style').css("position", "relative");
            //     jQuery('.clone').remove();
            //     if (_this.hasClass("ui-droppable")) {
            //         _this.removeClass("dropped").text("Place Here").attr("data-userans", "").draggable("destroy");
            //     }
            // }
        };
        window.mlid = mlid;

        function drop1(event,ui) {
            //console.log('drop1', ui);
            ucMlid.is_valid_drop = true;
            let _this = event.target;
            let list;
            let clr = "black";
            if(AH.select('#main-page').length > 0 && AH.select('#main-page').getAttribute('mode') == "bla" ) clr = "white";
            _this.style.position = "relative";
            
            list = top1 + "," + parseInt(_this.offsetTop + _this.clientHeight / 2) + "_" + parseInt(_this.offsetLeft) + "," + ui.getAttribute('id') + "_" + _this.getAttribute('id'); // need to discuss
            if (match_lines.includes(list) == false) { 
                match_lines.push(list); 
            }
            let userans = ui.getAttribute?.("data-userans") ? ui.getAttribute("data-userans").split(',') : [];
            if (userans.includes(_this.getAttribute("id")) == false) { 
                userans.push(_this.getAttribute("id")); 
            }
            userans = userans.join(',');
            if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
            ui.setAttribute("data-userans", userans);
            
            //jQuery(mlid).find("#lines").remove();
            // AH.find(mlid,"#lines",{
            //     action:'remove'
            // })
            let circle;
            //let str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" stroke-width = "2" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
            let str = '<svg id="lines">';
            var base;
            match_lines.forEach(function(value,index) {
                index = value.split(",");
                value = index[1].split("_");
                base = index[2];
                index = index[0].split("_");
                circle = '<div class="matchlist-delete center-block" d="M'  + (parseInt(index[1]) ) + ',' + index[0] + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '" base="' + base + '" style="left:' + (parseInt(index[1]) ) + 'px;top:' + (parseInt(index[0]) - 9) + 'px">&times</div>';
                str += '<path fill="none" d="M' + (parseInt(index[1]) + 20) + ',' + (parseInt(index[0]) - 4) + 'C' + (parseInt(index[1]) + 88) + ' ,' + (parseInt(index[0]) - 4) + ',' + (parseInt(index[1]) + 88) + ',' + (parseInt(value[0]) - 4) + ',' + (parseInt(value[1]) - 10) + ',' + (parseInt(value[0]) - 3) + '"  base="' + base + '" stroke-width = "2" stroke="' + clr + '"></path>';
                str += '<g transform="translate(' + (parseInt(value[1]) - 11) + ',' + (parseInt(value[0]) - 9) + ') rotate(0) scale(4) translate(0,0) scale(.3)" base="' + base + '"><g fill="' + clr + '" stroke="none" ><path d="M 0 0 L 10 5 L 0 10 z" /></g></g>';
            });
            str += '</svg>';
            AH.insert(mlid, circle, 'afterbegin');
            AH.insert(mlid, str, 'afterbegin');
            ucMlid.remove_lines(mlid);
            
        }

        function drop2(event1,ui1) {
            ucMlid.is_valid_drop = true;
            const _this = event1.target;
            _this.style.position = "relative";
            var drop_id = ui1.getAttribute('data-droped') ? ui1.getAttriburte('data-droped') : ui1.getAttribute('id');

            // _this.attr('data-droped', drop_id);
                _this.setAttribute('data-droped', drop_id);

            
            //	_this.html(jQuery(ui.draggable).html()).attr('data-userans', drop_id);
            _this.innerHTML = ui1.innerHTML;
            _this.setAttribute('data-userans', drop_id);
            // _this.css({ "background-color": jQuery(ui.draggable).css("background-color") });
            let ui_style = window.getComputedStyle(ui1);
            _this.style.backgroundColor = ui_style.getPropertyValue('background-color');
            // _this.draggable(jQuery.extend(ucMlid.dragOptionMatchlist, { revert: false }))
            // 	.attr({
            // 		'path': jQuery(ui.draggable).attr('path'),
            // 		'dropimage': jQuery(ui.draggable).attr('dropimage'),
            // 		'dragimage': jQuery(ui.draggable).attr('dragimage')
            // 	});

            var userans = [];
            userans = ui1.getAttribute("data-userans").split(',');
            if (userans.includes(_this.getAttribute("id")) == false) { userans.push(drop_id); }

            userans = userans.join(',');
            if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
            ui1.setAttribute("data-userans", userans);
            ucMlid.checkAns(mlid);
        }

        dragable = new Draggable({
            onDragStart: ((event)=>{
                ucMlid.is_valid_drop = false;
                let _this = event.target;
                top1 = parseInt(_this.offsetTop + _this.clientHeight / 2) + "_" + parseInt(_this.offsetLeft + _this.offsetWidth);
                //AH.clone(_this);
                
            }),
            onDrop: ((event,ui)=> {
                if (document.querySelectorAll(".list2").length > 0) {
                    drop1(event,ui);

                } else if (document.querySelectorAll(".list3").length > 0) {
                    drop2(event,ui);
                }
            }),
            isValidDrag:((event)=>{
                console.log('isValidDrag'+event);
            }),

            // onDragEnd:((event)=>{
               
            // })
            
            
        });
        //jQuery(mlid).find(draggable_ele).draggable(ucMlid.dragOptionMatchlist);

    };

    ucMlid.bindKeyup = function(mlid) {
        mlid = mlid || ucMlid.ajax_eId;
        //var top1 = 0; //@eslint issues fixed
        //jQuery(".row-fluid").find(".selmatch").removeClass("selmatch");

        AH.find(".row-fluid", ".selmatch", {action: 'removeClass', actionData: 'selmatch'});
        
        //hotkeys.unbind('down,up,left,right,alt+down,enter,delete,esc','matchlist');

        let count = 0;
        //var count_prev = 0; @eslint issues solved
        let copied_id = "";
        //var ks_activated = false; @eslint issues solved
        //const is_multimatch = jQuery(mlid).attr("multimatch");
         const is_multimatch = AH.select(mlid).getAttribute("multimatch"); // Replaced

        if (is_multimatch != "2") {
            activateClass("list1");
            activateClass("list2");
        } else {
            activateClass("list3");
            activateClass("list4");
        }

        document.addEventListener("click", ()=> {
            if (!checkFocus("list1") && !checkFocus("list2") && !checkFocus("list3") && !checkFocus("list4")) {
                loseFocus();
            }
        }); // @eslint issues solved

        document.querySelector(mlid).addEventListener("keydown", ()=> {
            if (typeof hotkeys$1 == "function") {
                hotkeys$1.setScope('matchlist');
            }
        }); // Replaced @eslint issues solved

        function loseFocus() {
            AH.find(mlid, ".copiedclr", 'all').forEach((_elm)=> {
                _elm.classList.remove("copiedclr");
            });
            copied_id = "";
            count = 0;
            //count_prev = 0; @eslint issues solved
            //ks_activated = false; @eslint issues solved
        } // Replaced

        

        function activateClass(cls) {
            AH.find(mlid, "." + cls, 'all').forEach((_elm)=> {
                _elm.classList.add("ks");
            });
        } // Replaced

        

        function navigateDown() {
            const a = AH.selectAll("#matchmain .ks").length;
            //count_prev = ((count == 0) ? (a - 1) : (count - 1)); @eslint issues solved
            const ks_fill = AH.find(mlidVar,".ks:nth(" + count + ")");
            //var prev_ks = AH.find(mlidVar,".ks:nth(" + (count - 1) + ")"); @eslint issues solved
            ks_fill.focus();
            if (count == (a - 1)) { count = 0; } else { count++; }
        }

        // function navigateUp() {
        //     const b = jQuery(mlid).find(".ks").length;
        //     count = ((count_prev == (b - 1)) ? 0 : (count_prev + 1));
        //     const ks_fill_left = jQuery(mlid).find(".ks:nth(" + count_prev + ")");
        //     ks_fill_left.focus();
        //     if (count_prev == 0) { count_prev = (b - 1) } else { count_prev--; }
        // }

        // function navidateUp() { 
           
        //     const b = AH.selectAll(mlid +" .ks").length;
        //     count = ((count_prev == (b - 1)) ? 0 : (count_prev + 1));
        //     const ks_fill_left = AH.selectAll(mlid," .ks:nth(" + count_prev + ")");
        //     ks_fill_left.focus();
        //     if (count_prev == 0) { count_prev = (b - 1) } else { count_prev--; }
        // } @eslint issues solved

        // function copyDraggable() {
        //     var copy_drag = jQuery(mlid).find(".ks:focus");
        //     jQuery(mlid).find(".list1").each(function() {
        //         jQuery(this).removeClass("copiedclr");
        //     });
        //     jQuery(mlid).find(".list4").each(function() {
        //         jQuery(this).removeClass("copiedclr");
        //     });
        //     copied_id = copy_drag[0].id;
        //     copy_drag.addClass('copiedclr');
        // } //  Replaced

        function copyDraggable() {
            let copy_drag = AH.selectAll(mlid+" .ks:focus");
            AH.find(mlid,".list1",'all').forEach((_this)=> {
                _this.classList.remove("copiedclr");
            });
            AH.find(mlid,".list4",'all').forEach((_this)=> {
                _this.classList.remove("copiedclr");
            });
            copied_id = copy_drag[0].id;
            copy_drag.className = "copiedclr";
        }

        ucMlid.cleanTitle = function(){
            AH.find(ucMlid.ajax_eId, '.list1', 'all').forEach((_this) => {
                _this.removeAttribute("aria-label");
            });
        }; 

        ucMlid.getTitle = function(target, title, index, isCheck, preFix) {
            if (target) {
                if (index == 0) title += preFix ? (preFix + " and Attached to ") : ("Attached to ");
                if (index > 0) title += ' and ';
                if (isCheck) {
                    title += target.textContent;
                    title += ((target.getAttribute('as') == '1') ? ' is marked as correct' : ' is marked as incorrect');
                } else {
                    title += target.textContent;
                }
            }
            return title
        }; // No Need to fix

        function pasteDraggable() {
            //var _dropthis = jQuery(mlid).find(".ks:focus");
            let _dropthis = AH.find(mlid,".ks:focus");
            if (copied_id != "" /*&& _dropthis.hasClass('ui-droppable')*/ ) {
                //var _ui_drag = jQuery(mlid).find("#" + copied_id + "");
                let _ui_drag = AH.find(mlid, '[id="'+copied_id+'"]');
                let top = 0;
                //top = parseInt(_ui_drag.position().top + _ui_drag.height() / 2) + "_" + parseInt(_ui_drag.position().left + _ui_drag.width());
                top = parseInt(_ui_drag.offsetTop + _ui_drag.clientHeight / 2) + "_" + parseInt(_ui_drag.offsetLeft + _ui_drag.offsetWidth);
            /*    _ui_drag.after(_ui_drag.clone().addClass("clone").css({ "position": "absolute", "top": _ui_drag.position().top, "left": _ui_drag.position().left, "width": _ui_drag.width() + 20, "height": _ui_drag.height() + 15 })); // Need to fixed it */

                let _ui_drag_cloned = AH.clone(_ui_drag);
                _ui_drag_cloned.classList.add("clone");

                AH.setCss(_ui_drag_cloned,{
                    "position": "absolute",
                    "top": _ui_drag.offsetTop,
                    "left": _ui_drag.offsetLeft,
                    "width": _ui_drag.offsetWidth + 20,
                    "height": _ui_drag.clientHeight + 15
                });

                //AH.insert( _ui_drag,_ui_drag_cloned,'afterend');

                let clr = "black";
                //if (jQuery('#main-page').length > 0 && jQuery('#main-page').attr('mode') == "bla") clr = "white";
                if (AH.selectAll('#main-page').length > 0 && AH.selectAll('#main-page').getAttribute("mode") == "bla") clr = "white";
                //jQuery(_dropthis).css("position", "relative");
                _dropthis.style.position = "relative";
                // var list = top + "," + parseInt(jQuery(_dropthis).position().top + jQuery(_dropthis).height() / 2) + "_" + parseInt(jQuery(_dropthis).position().left) + "," + _ui_drag.attr('id') + "_" + jQuery(_dropthis).attr('id');
               
                let list = top + "," + parseInt(_dropthis.offsetTop + _dropthis.clientHeight / 2) + "_" + parseInt(_dropthis.offsetLeft) + "," + _ui_drag.getAttribute('id') + "_" + _dropthis.getAttribute('id');

                //if (jQuery.inArray(list, match_lines) == -1)
                if (match_lines.includes(list) == false) 
                    match_lines.push(list);

                let userans = [];
                userans = _ui_drag.getAttribute("data-userans").split(',');
                //if (jQuery.inArray(jQuery(_dropthis).attr("id"), userans) == -1)
                if (userans.includes(_dropthis.getAttribute("id")) == false)
                    userans.push(_dropthis.getAttribute("id"));

                userans = userans.join(',');
                if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
                
                _ui_drag.setAttribute("data-userans", userans);

                // get attached label
                if (userans.length > 0){
                    let tempUdata = userans.split(',');
                    let attachedText = "";
                    tempUdata.map((id,index)=> {
                        attachedText = ucMlid.getTitle(AH.select("#"+id), attachedText, index);
                    });
                    _ui_drag.setAttribute("aria-label",attachedText);
                }
                //-------------------------------

                //jQuery(mlid).find("#lines").remove();
                AH.find(mlid,"#lines", {action:'remove'});
                let circle;
                //var str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" stroke-width = "2" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>'; @eslint issues solved
                let str = '<svg id="lines">';
                let base;
               // jQuery.each(match_lines, function(index, value) {
                match_lines.forEach((value, index)=> {
                    index = value.split(",");
                    value = index[1].split("_");
                    base = index[2];
                    index = index[0].split("_");
                    circle = '<div class="matchlist-delete center-block" d="M' + (parseInt(index[1]) + 20) + ',' + index[0] + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '" base="' + base + '" style="left:' + (parseInt(index[1]) ) + 'px;top:' + (parseInt(index[0]) - 9) + 'px">&times</div>';
                    str += '<path fill="none" d="M' + (parseInt(index[1]) + 20) + ',' + (parseInt(index[0]) -5) + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '"  base="' + base + '" stroke-width = "2" stroke="' + clr + '"></path>';
                    str += '<path fill="none" d="M' + (parseInt(index[1])+20) + ',' + index[0] + 'C' + (parseInt(index[1]) + 88) + ' ,' + index[0] + ',' + (parseInt(index[1]) + 88) + ',' + value[0] + ',' + (parseInt(value[1]) - 10) + ',' + value[0] + '" marker-end="url(#triangle)" class="line" base="'+base+'" stroke-width = "50"></path>';
                    str += '<g transform="translate(' + (parseInt(value[1]) - 11) + ',' + (parseInt(value[0]) - 6) + ') rotate(0) scale(4) translate(0,0) scale(.3)" base="' + base + '"><g fill="' + clr + '" stroke="none" ><path d="M 0 0 L 10 5 L 0 10 z" /></g></g>';
                });
                str += '</svg>';
                //jQuery(mlid).prepend(circle);
                AH.insert(mlid, circle, "afterbegin");
                
                //jQuery(mlid).prepend(str);
                AH.insert(mlid, str, "afterbegin");
                ucMlid.remove_lines(mlid);

                //_ui_drag.removeAttr('style').css("position", "relative");
                _ui_drag.removeAttribute('style');
                _ui_drag.style.position = "relative";
                //jQuery('.clone').remove();
                AH.remove(".clone");
                //if (_ui_drag.hasClass("ui-droppable")) {
                if (_ui_drag.classList.contains("ui-droppable")) ;
                ucMlid.checkAns(mlid);
                //_ui_drag.removeClass('copiedclr');
                _ui_drag.classList.remove('copiedclr');
                copied_id = "";
            }
        }    

        function pasteDraggableList3() {
          
            var _dropthis = AH.find(mlid,".ks:focus");
            if (copied_id != "") {

                var _ui_drag = AH.find(mlid,"#" + '[id="'+copied_id+'"]' + "");
                _ui_drag.classList.remove('copiedclr');
                _dropthis.style.position="relative";
                var drop_id = _ui_drag.getAttribute('data-droped') ? _ui_drag.getAttribute('data-droped') : _ui_drag.getAttribute('id');
                _dropthis.setAttribute('data-droped', drop_id);
                _dropthis.innerHtml = AH.select(_ui_drag).innerHtml;
                _dropthis.setAttribute('data-userans', drop_id);
                let ui_drag_style = window.getComputedStyle(_ui_drag);
    			_dropthis.style.backgroundColor = ui_drag_style.getPropertyValue('background-color');

                // _dropthis.draggable(jQuery.extend(ucMlid.dragOptionMatchlist, { revert: false }))
                //     .attr({ 'path': jQuery(_ui_drag).attr('path'), 'dropimage': jQuery(_ui_drag).attr('dropimage'), 'dragimage': jQuery(_ui_drag).attr('dragimage') });

                var userans = [];
                userans =  _ui_drag.getAttribute("data-userans").split(',');
                if(userans.includes(_dropthis.getAttribute("id")) == false)
                    userans.push(drop_id);
                userans = userans.join(',');
                if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
                _ui_drag.setAttribute("data-userans", userans);
                ucMlid.checkAns(mlid);
                _ui_drag.classList.remove('copiedclr');
                copied_id = "";
            }
        }

        function removeDraggable() {
            var _removethis = AH.find(mlid,".ks:focus");
            if(_removethis.classList.contains('ui-draggable') && _removethis.getAttribute("data-userans") != "") {    
                var rem_element = _removethis.getAttribute("id") + "_" + _removethis.getAttribute("data-userans").split(",")[0];
                var element = "";
                AH.find(mlid,".matchlist-delete","all").forEach((_this)=>{
                    if (_this.getAttribute("base") == rem_element) {    
                        element = _this;
                        return false; // Need to fix foreach never return false;
                    }
                });
                // alert(element);
                var path = document.querySelector(element).getAttribute('d');
                var base = document.querySelector(element).getAttribute('base').split('_');
                var userans = AH.find(mlid,'[id="'+rem.base[0]+'"]').getAttribute('data-userans').split(',');
                if(userans.includes(base[1])  != false)
                    userans.splice(userans.indexOf(base[1]), 1);
                userans = userans.join(',');
                if (userans.substr(0, 1) == ',') userans = userans.substr(1, userans.length);
                document.querySelector('#' + base[0]).setAttribute("data-userans", userans);
                // removing title when answer removed
                document.querySelector('#' + base[0]).setAttribute('aria-label','');
                //-------------------------------------
                path = (path.substr(1, path.length)).split('C');
                var l1 = path[0].trim().replace(/ /g, ',').split(',');
                var l2 = path[1].trim().replace(/ /g, ',').split(',');
                var index = parseInt(l1[l1.length - 1]) + "_" + (parseInt(l1[l1.length - 2]) - 20) + "," + parseInt(l2[l2.length - 1]) + "_" + 
                (parseInt(l2[l2.length - 2]) + 10) + "," + AH.select(element).getAttribute('base');
                //const main_id = "#" + AH.select(mlid).getAttribute("id"); @eslint issues fixed
                match_lines.splice(match_lines.indexOf(index), 1);
                var base_el = document.querySelector(element).getAttribute('base');
                AH.remove("[base='" + base_el + "']");
                ucMlid.checkAns(mlid);
            }
        }

        function removeDraggableList3() {
            let top = 0;
            var _removethis = AH.find(mlid,".ks:focus");
            top = parseInt(_removethis.offsetTop + _removethis.clientHeight / 2) + "_" + parseInt(_removethis.offsetLeft + _removethis.offsetWidth);
            AH.clone(_removethis);
            _removethis.classList.add("clone");
            AH.setCss(_removethis,{
                "position": "absolute",
                "top":  _removethis.offsetTop,
                "left": _removethis.offsetLeft,
                "width": _removethis.offsetWidth + 20,
                "height": _removethis.clientHeight + 15
            });
            _removethis.removeAttribute("style");
            _removethis.style.position = "relative";
            AH.remove(".clone");
            if(_removethis.classList.contains("ui-droppable")) {
                _removethis.classList.remove("dropped");
                _removethis.innerHTML = "Place Here";
                _removethis.setAttribute("data-userans", "");
            }
        }

        function activateKs() {
            //count = 0; @eslint issues solved
            //count_prev = 0; @eslint issues solved
            //ks_activated = true; @eslint issues solved
            navigateDown();
        } // No Need to fix

        function checkFocus(list) {
            var is_focus = false;
            let elements = AH.find(mlid, "." + list, 'all');
            let focus_ele = AH.select(":focus");

            if(focus_ele.nodeName) {
                let focus_id = focus_ele.getAttribute('id');
                for (let index = 0; index < elements.length; index++) {
                    if (focus_id == elements[index].getAttribute('id')) {
                        is_focus = true;
                        break;
                    }
                }
            }
            // jQuery(mlid).find("." + list).each(function() {
            //     if (jQuery(this).is(":focus")) {
            //         is_focus = true;
            //         return false;
            //     }
            // });
            return is_focus;
        }

        function tabMove(element, type = 1) {
            if (element.id) {
                let ks_element = AH.selectAll('.ks');
                let focus_index = -1;
                for (let index = 0; index < ks_element.length; index++) {
                    if (element.id == ks_element[index].id) {
                        if (type) {
                            if (index == (ks_element.length - 1)) {
                                focus_index = 0;
                            } else {
                                focus_index = index + 1;
                            }
                        } else {
                            if (index == 0) {
                                focus_index = ks_element.length - 1;
                            } else {
                                focus_index = index - 1;
                            }
                        }
                        break;
                    }
                }
        
                if (focus_index != -1) {
                    ks_element[focus_index].focus();
                }
            }
        }

        if (typeof hotkeys$1 == "function") {
            hotkeys$1.unbind('down,up,left,right,alt+down,enter,delete,esc', 'matchlist');
            hotkeys$1("down,up,left,right,alt+down,enter,delete,esc", 'matchlist', function(event, handler) {
                switch (handler.key) {
                    case 'down':
                    case 'right':
                        if (checkFocus("ks")) {
                            let focus_ele = AH.select(".ks:focus");
                            let ks_last = AH.selectAll(".ks")[AH.selectAll(".ks").length-1];
                            if(focus_ele.id == ks_last.id) {
                                AH.selectAll(".ks")[0].focus();
                            } else {
                                tabMove(focus_ele,1);
                            }
                            event.preventDefault();
                        }
                        break;
                    case 'up':
                    case 'left':
                        if (checkFocus("ks")) {
                            let focus_ele = AH.select('.ks:focus');
                            let ks_element = AH.selectAll('.ks')[0];
                            if (focus_ele.id == ks_element.id) {
                                AH.selectAll(".ks")[AH.selectAll(".ks").length].focus();
                            } else {
                                tabMove(focus_element, 0);
                            }
                            event.preventDefault();
                        }
                        break;
                    case 'alt+down':
                        activateKs();
                        break;
                    case 'enter':
                        event.preventDefault();
                        if (checkFocus("list1") || checkFocus("list4")) {
                            copyDraggable();
                        } else if (checkFocus("list2")) {
                            pasteDraggable();
                        } else if (checkFocus("list3")) {
                            pasteDraggableList3();
                        }
                        break;
                    case 'delete':
                        event.preventDefault();
                        if (checkFocus("list1")) {
                            removeDraggable();
                        } else if (checkFocus("list3")) {
                            removeDraggableList3();
                        }
                        break;
                    case 'esc':
                        if (checkFocus("ks")) {
                            event.preventDefault();
                            loseFocus();
                            //jQuery('.ks').last().focus();
                            focusLast();
                            //jQuery('.ks').last().blur();
                            AH.selectAll(".ks")[AH.selectAll(".ks").length -1].blur();
                        }
                        break;
                }
            });
            hotkeys$1.setScope('matchlist');
        } 
    };

    ucMlid.pollFunc = function(fn, timeout, interval) {
        var startTime = (new Date()).getTime();
        interval = interval || 1000;
        canPoll = true;

        (function p() {
            canPoll = ((new Date).getTime() - startTime) <= timeout;
            if (!fn() && canPoll) { // ensures the function exucutes
                setTimeout(p, interval);
            }
        })();
    }; // No Need to fix



    ucMlid.showAns = function(mlid) {
        ucMlid.multimatch = document.querySelector(mlid).getAttribute("multimatch");
        //var answer_ele = ".list1"; @eslint issues solved
        if (ucMlid.multimatch < 2) {
            var str = '<svg id="lines">';
            ucMlid.f = 0;
            AH.selectAll(mlid +' .list1').forEach((_this)=> {
                
                if (_this.getAttribute("data-userans") != '') {
                    ucMlid.f = 1;
                    const top1 = parseInt(_this.offsetTop + _this.clientHeight / 2);
                    const right = parseInt(_this.offsetLeft + _this.offsetWidth);
                    const index = top + "_" + right;
                    str += '<marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
                
                    const userAns = _this.getAttribute("data-userans").split(',');
                    for (let i = 0; i < userAns.length; i++) {
                        if (userAns[i] != '') {
                            const top2 = parseInt(AH.find(mlid ,'#' + userAns[i]).offsetTop + AH.find(mlid,'#' + userAns[i]).clientHeight / 2);
                            const left = parseInt(AH.find(mlid,'#' + userAns[i]).offsetLeft);
                            const userans = top2 + "_" + left;
                            const circle = '<div class="matchlist-delete center-block" d="M' + (parseInt(right) + 20) + ',' + top1 + 'C' + (parseInt(right) + 88) + ',' + top1 + ',' + (parseInt(right) + 88) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" base="' + _this.getAttribute('id') + '_' + AH.find(mlid,'#' + userAns[i]).getAttribute('id') + '" style="left:' + (parseInt(right) ) + 'px;top:' + (top1  - 9)+ 'px">&times</div>';
                            str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (top1 - 5) + 'C' + (parseInt(right) + 88) + ',' + (parseInt(top1) - 4) + ',' + (parseInt(right) + 88) + ',' + (parseInt(top2) - 4) + ',' + (parseInt(left) - 10) + ',' + (parseInt(top2) - 4) + '" marker-end="url(#triangle)" class="line" base="' + _this.getAttribute('id') + '_' + document.querySelector(mlid +' #' + userAns[i]).getAttribute('id') + '"></path>';
                            const list = index + "," + userans + "," + _this.getAttribute('id') + "_" + AH.select(mlid +' #' + userAns[i]).getAttribute('id');
                            if (list.includes(match_lines) == -1) match_lines.push(list);
                            //jQuery(mlid).prepend(circle);
                            AH.insert(mlid,circle,'afterbegin');
                        }
                    }
                }
            });
            str += '</svg>';
            
            if (ucMlid.f == 1) AH.insert(mlid,str,'afterbegin');
        } else {
            ucMlid.showMultimatchAnswer(mlid, 1);
        }
    };

    ucMlid.checkAns = function(mlid) {
        let result = true,
            smans = '',
            list1seq = '',
            list2seq = '',
            temp = 0,
            originalseq1 = '',
            originalseq2 = '';
        let answer_ele = ".list1",
            answer_placeholder = ".list2";
        if (ucMlid.multimatch == 2) {
            answer_ele = ".list3";
            answer_placeholder = ".list4";
        }

        if (mlid == "#matchmain") {
            AH.selectAll(mlid+" "+answer_ele).forEach((_this)=> {
                //var correctAns = jQuery(this).attr('data-correctans').split(',').sort().join(',');
                let correctAns = _this.getAttribute('data-correctans').split(',').sort().join(',');
                //var userAns = jQuery(this).attr('data-userans').split(',').sort().join(',');
                let userAns = _this.getAttribute('data-userans').split(',').sort().join(",");
                if (correctAns.substr(0, 1) == ',') correctAns = correctAns.substr(1, correctAns.length);
                if (userAns.substr(0, 1) == ',') userAns = userAns.substr(1, userAns.length);

                if (correctAns != userAns) result = false;
                else temp++;

                list1seq += _this.getAttribute('id') + ",";
                if (typeof calculatePoint != "undefined") {
                    calculatePoint(AH.select("#matchmain").getAttribute("totalcorrectans"), temp);
                }
                originalseq1 += _this.getAttribute('data-originalseq') + ",";
            });
            list1seq = list1seq.split(',');
            let uniqueArray = list1seq.filter((item, i, self) => {
                return self.lastIndexOf(item) == i;
            });
            list1seq = uniqueArray.join(',');
            list1seq = list1seq.substr(0, list1seq.length - 1);
            originalseq1 = originalseq1.substr(0, originalseq1.length - 1);
            //jQuery(mlid).find(answer_placeholder).each(function() {
            AH.find(mlid, answer_placeholder, 'all').forEach((_this)=> {
                var ans = '';
                //jQuery(mlid).find(answer_ele + '[data-userans*="' + _this.attr('id') + '"]').each(function() {
                AH.find(mlid, answer_ele + `[data-userans*="${_this.getAttribute('id')}"]`, 'all').forEach((_this2)=> {
                    if (_this2.getAttribute('data-userans') != "") ans += _this2.getAttribute('id') + "|";
                });
                ans = ans.substr(0, ans.length - 1);
                if (ans != "") smans += _this.getAttribute('id') + "[" + ans + "],";
                list2seq += _this.getAttribute('id') + ",";
                originalseq2 += _this.getAttribute('data-originalseq') + ",";
            });
            list2seq = list2seq.substr(0, list2seq.length - 1);
            originalseq2 = originalseq2.substr(0, originalseq2.length - 1);
            smans = smans.substr(0, smans.length - 1);
            const userAnsXML = "<smans type='14'>\n\t<matchlist list1seq='" + list1seq + "' list2seq='" + list2seq + "' userans='" + smans + "' originalseq1='" + originalseq1 + "' originalseq2='" + originalseq2 + "'></matchlist>\n</smans>";
            window.ISSPECIALMODULEUSERXMLCHANGE = 1;
            //jQuery("#special_module_user_xml").val(userAnsXML);
        
            AH.select("#special_module_user_xml").value = userAnsXML;

            if (result) {
                AH.select("#answer").checked = true;
                if (typeof(is_sm) != "undefined") AH.showmsg("Correct");
                return "Correct";
            } else {
                AH.select("#answer").checked = false;
                if (typeof(is_sm) != "undefined") AH.showmsg("Incorrect");
                return "Incorrect";
            }
           
        }
    };
    /**/
    ucMlid.insertAtCaret = function(element, text) {
        if (document.selection) {
            element.focus();
            let sel = document.selection.createRange();
            sel.text = text;
        } else if (element.selectionStart || element.selectionStart === 0) {
            let startPos = element.selectionStart;
            let endPos = element.selectionEnd;
            let scrollTop = element.scrollTop;
            element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
            element.selectionStart = startPos + text.length;
            element.selectionEnd = startPos + text.length;
            element.scrollTop = scrollTop;
        } else {
            element.value += text;
            
        }
        element.focus();
    }; // No need to change



    ucMlid.showMultimatchAnswer = function(mlid, is_not_review) {
       // var top1 = 0; @eslint issues solved
        // const dragOption_multi = {
        //     zIndex: 100,
        //     cursorAt: { top: -10, left: -10 },
        //     cursor: "default",
        //     start() {
        //         const _this = jQuery(this);
        //         const _top_position = _this.offsetTop;
        //         const _left_position = _this.offsetLeft;
        //         const _ht = _this.clientHeight;
        //         const _wt = _this.offsetWidth;
        //         top1 = parseInt(_top_position + _ht / 2) + "_" + parseInt(_left_position + _wt);
        //         AH.clone(".clone");
        //         AH.setCss(_this,{
        //             "position": "absolute",
        //             "top": _top_position,
        //             "left": _left_position,
        //             "width": _wt + 20,
        //             "height": _ht + 15
        //         })
        //         // _this.after(_this.clone().addClass("clone").css({
        //         //     "position": "absolute",
        //         //     "top": _top_position,
        //         //     "left": _left_position,
        //         //     "width": _wt + 20,
        //         //     "height": _ht + 15
        //         // }));
        //     },
        //     stop() {
        //         const _this = jQuery(this);
        //         _this.removeAttr('style').css("position", "relative");
        //         //jQuery('.clone').remove();
        //         AH.remove(".clone");
        //         AH.removeClass(_this,'dropzone'); // dropped convert into dropzone

        //         _this.innerText = "Place Here"
        //         _this.setAttribute("data-userans", "");


        //         // _this.removeClass("dropped")
        //         //     .text("Place Here")
        //         //     .attr("data-userans", "")
        //         //     .draggable("destroy");
        //     }
        // };

        //jQuery(mlid).find(".list3").removeClass("dropped").text("Place here"); //@Deepika: we needs to clear shown answers first

        AH.find(mlid, ' .list3', 'all').forEach((_this)=> {
            AH.select(_this,'removeClass','dropped');
            _this.innerHTML = "Place here";
        });
        // let mlidlist3 = AH.selectAll(mlid+' .list3','removeClass','dropped');
        // // //AH.removeClass(mlidlist3,'dropped');
        //  mlidlist3.innerText = "Place here";

        //jQuery(mlid).find('.list3').each(function() {
        AH.find(mlid, '.list3', 'all').forEach((_this)=> {
            // const _this = jQuery(this);
            if (_this.getAttribute("data-userans").length > 0) {
                const userAns = _this.getAttribute("data-userans").split(',');
                for (let i = 0; i < userAns.length; i++) {
                    if (userAns[i] != '') {
                        const str = AH.find(mlid,'#' + userAns[i]).innerHTML;
                        _this.innerHTML = str;
                        _this.classList.add('dropped'); //dropped class convert into dropzone
                    }
                }
            }
        });

    };




    ucMlid.checkAnswerStatus = function(isCorrect, ele, _idn) {
        let _id = _idn || ""; //@eslint issues solved
        
        let correctAns = ele.getAttribute('data-correctans').split(',').sort().join(',');// will Change
        let userAns    =   ele.getAttribute('data-userans').split(',').sort().join(','); //Will Replaced
        if (correctAns.substr(0, 1) == ',') correctAns = correctAns.substr(1, correctAns.length);
        if (userAns.substr(0, 1) == ',') userAns = userAns.substr(1, userAns.length);
        if (_id != "") {
            const _c = correctAns.split(',');
            const _u = userAns.split(',');
            if (!(_c.includes(_id) == false) && (_u.includes(_id) == false)) isCorrect = -1; // We have to change
        } else {
            if (correctAns != userAns) isCorrect = -1;
        }
        return isCorrect;
    };



    ucMlid.showAllCorrectAns = function(mlid) {
        AH.selectAll(mlid+' .list3').forEach((_this) => {
            const correctAns = _this.getAttribute("data-correctans").split(',');
            for (let i = 0; i < correctAns.length; i++) {
                if (correctAns[i] != '') {
                    const str = AH.find(mlid,'#' + correctAns[i]).innerHTML;
                    _this.innerHTML = str;
                    AH.select(_this,'addClass','dropped');
                }
            }
        });
    };


    ucMlid.showAllAns = function(mlid) {
        console.table('showAns');
        AH.remove("#lines");
        AH.remove('.correct_incorrect_icon');
        
        ucMlid.multimatch = document.querySelector(mlid).getAttribute("multimatch");
        if (ucMlid.multimatch < 2) {
            var str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
            str += '<marker id="trngle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#83C883"/></marker>';

            
            AH.find(mlid ,".list1","all").forEach((_this)=>{
                const top1 = _this.offsetTop + _this.clientHeight  / 2;
                var right = _this.offsetLeft  + _this.offsetWidth;
                var correctAns = _this.getAttribute("data-correctans").split(',');
                for (let i = 0; i < correctAns.length; i++) {
                    if (correctAns[i] != '') {
                        const top2 = AH.find(mlid,'#' + correctAns[i]).offsetTop + AH.find(mlid,'#' + correctAns[i]).clientHeight / 2 - 5;
                        const left = AH.find(mlid,'#' + correctAns[i]).offsetLeft;
                        str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) - 5) + 'C' + (parseInt(right) + 83) + ',' + (parseInt(top1) - 5) + ',' + (parseInt(right) + 83) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#trngle)" class="correct"></path>';
                    }
                }
                if(_this.getAttribute("data-userans").length > 0) {
                    const userAns = _this.getAttribute("data-userans").split(',');
                    var matchedTitle = "";
                    for (let i = 0; i < userAns.length; i++) {
                        if (userAns[i] != '') {
                            const top2 = AH.find(mlid,'#' + userAns[i]).offsetTop + AH.find(mlid,'#' + userAns[i]).clientHeight / 2 + 5;
                            const left = AH.find(mlid,'#' + userAns[i]).offsetLeft;
                            str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) + 5) + 'C' + (parseInt(right) + 93) + ',' + (parseInt(top1) + 5) + ',' + (parseInt(right) + 93) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#triangle)" class="line"></path>';
                            //---- adding ans feedback in title ----
                            matchedTitle = ucMlid.getTitle(AH.select('#' + userAns[i]), matchedTitle, i, true, _this.textContent);
                        }
                    }
                    _this.setAttribute('aria-label',matchedTitle);
                }
            });
            str += '</svg>';
            //jQuery(mlid).prepend(str);
            AH.insert(mlid,str,'afterbegin');
            var answer_ele = ".list2";
        } else {
            ucMlid.showMultimatchAnswer(mlid);
            answer_ele = ".list3";
        }
        
        //jQuery(mlid).find(answer_ele).each(function() {
        AH.selectAll(mlid +" "+ answer_ele).forEach((_this)=>{
            const self_id = _this.getAttribute('id');
            var isCorrect = 1;
            if (ucMlid.multimatch == 2) {
                isCorrect = ucMlid.checkAnswerStatus(isCorrect, _this);
            } else {
                AH.selectAll(mlid + ' .list1[data-correctans*="' + _this.getAttribute('id') + '"]').forEach((_this)=>{
                    isCorrect = ucMlid.checkAnswerStatus(isCorrect, _this, self_id);
                });
            }
            const droped_value_indicator_html = ((isCorrect == 1) ? '<span class="icomoon-checkmark-circle" style="color:green;">' : '<span class="icomoon-cancel-circle" style="color:red;">');
            _this.setAttribute('mrel', _this.getAttribute('id'));
            _this.setAttribute('as', isCorrect);
            AH.insert(_this,'<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span>','beforeend');
        });
    };




    ucMlid.resetMatch = function(){
        AH.remove("#lines");
        AH.remove(".correct_incorrect_icon");
        let str = '<svg id="lines"><marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';
        str += '<marker id="trngle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#83C883"/></marker>';
        return str;
    };




    ucMlid.showCorrect = function(mlid) {
        let str = ucMlid.resetMatch();
        ucMlid.cleanTitle();
        AH.selectAll(mlid +' .list1').forEach((_this)=> {
            //const self = jQuery(this);
            const top1 = _this.offsetTop + _this.clientHeight / 2;
            let right =  _this.offsetLeft + _this.offsetWidth;

            let correctAns = _this.getAttribute("data-correctans").split(',');
            let matchedTitle = "";
            for (let i = 0; i < correctAns.length; i++) {
                if (correctAns[i] != '') {
                    const top2 = AH.find(mlid,'#' + correctAns[i]).offsetTop + AH.find(mlid,'#' + correctAns[i]).clientHeight / 2 - 5;
                    const left = AH.find(mlid,'#' + correctAns[i]).offsetLeft;
                    str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) - 5) + 'C' + (parseInt(right) + 83) + ',' + (parseInt(top1) - 5) + ',' + (parseInt(right) + 83) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#trngle)" class="correct"></path>';
                    matchedTitle = ucMlid.getTitle(AH.select('#' + correctAns[i]), matchedTitle, i, _this.textContent);
                }
            }
            //self.attr("aria-label",matchedTitle);
            _this.setAttribute("aria-label",matchedTitle);
        });
        str += '</svg>';
        //jQuery(mlid).prepend(str);
        AH.insert(mlid,str,"afterbegin");
    };



    ucMlid.showYour = function(mlid) {
        
        ucMlid.cleanTitle();
        let str = ucMlid.resetMatch();
        
        AH.find(mlid,'.list1',"all").forEach((_this) =>{
            //const self = jQuery(this);
            const top1 = _this.offsetTop + _this.clientHeight / 2;
            let right =  _this.offsetLeft + _this.offsetWidth;

            if (_this.getAttribute("data-userans").length > 0) {
                const userAns = _this.getAttribute("data-userans").split(',');
                let matchedTitle = "";
                for (let i = 0; i < userAns.length; i++) {
                    if (userAns[i] != '') {
                        const top2 = AH.find(mlid,'#' + userAns[i]).offsetTop + AH.find(mlid,'#' + userAns[i]).clientHeight / 2 + 5;
                        //const left = jQuery(mlid).find('#' + userAns[i]).position().left;
                        const left = AH.find(mlid,'#' + userAns[i]).offsetLeft;
                        str += '<path fill="none" d="M' + (parseInt(right) ) + ',' + (parseInt(top1) + 5) + 'C' + (parseInt(right) + 93) + ',' + (parseInt(top1) + 5) + ',' + (parseInt(right) + 93) + ',' + top2 + ',' + (parseInt(left) - 10) + ',' + top2 + '" marker-end="url(#triangle)" class="line"></path>';
                        //---- adding ans feedback in title ----
                        matchedTitle = ucMlid.getTitle(AH.select('#' + userAns[i]), matchedTitle, i, true, _this.textContent);
                    }
                }
                //self.attr('aria-label',matchedTitle);
                _this.setAttribute('aria-label',matchedTitle);
            }
        });
        str += '</svg>';
        //jQuery(mlid).prepend(str);
        AH.insert(mlid,str,"afterbegin");
        let answer_ele = ".list2";
        AH.find(mlid,answer_ele,"all").forEach((_this)=> {
            //const self = jQuery(this);
            const self_id = _this.getAttribute('id');

            let isCorrect = 1;
            AH.find(mlid,'.list1[data-correctans*="' + _this.getAttribute('id') + '"]','all').forEach((_this)=> {
                isCorrect = ucMlid.checkAnswerStatus(isCorrect, _this, self_id);
            });

            const droped_value_indicator_html = ((isCorrect == 1) ? '<span class="icomoon-checkmark-circle" style="color:green;">' : '<span class="icomoon-cancel-circle" style="color:red;">');
            _this.setAttribute('mrel', _this.getAttribute('id'));
            _this.setAttribute('as', isCorrect);
            //self.append('<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span></span>');
            AH.insert(_this,'<span class="correct_incorrect_icon" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span>',"afterbegin");
        });
    };

    /*ajax based code*/
    ucMlid.showAll = function() { //@eslint issues solved
        ucMlid.showAllAns(ucMlid.ajax_eId);
    };

    ucMlid.labBinded = true;


    ucMlid.modeOn = function(modeType) {
        //jQuery('.test').addClass('h');
        AH.selectAll('.test','addClass','h');
        //jQuery(ucMlid.ajax_eId).find('.review_2, .review_default').addClass('h');
       
        AH.find(ucMlid.ajax_eId,'.review_2, .review_default',{
            action:'addClass',
            actionData:'h'
        });
        if (modeType) {
            //jQuery('.review').removeClass('h');
            AH.selectAll('.review','removeClass','h');
            setTimeout(function() {
                if (typeof hotkeys$1 == "function") {
                    hotkeys$1.unbind('down,up,left,right,alt+down,enter,delete,esc', 'matchlist');
                }
                //jQuery(ucMlid.ajax_eId).find(".selmatch").removeClass("selmatch");
                AH.selectAll(ucMlid.ajax_eId+"  .selmatch",'removeClass','selmatch');
                ucMlid.unBindLab();
                ucMlid.showAllAns(ucMlid.ajax_eId);
                // jQuery(ucMlid.ajax_eId).find('#sm_controller button').each(function() {
                //     if (jQuery(this).hasClass('your-ans btn-primary')) { ucMlid.showAllAns(ucMlid.ajax_eId); } else if (jQuery(this).hasClass('correct-ans btn-primary')) { ucMlid.showAllCorrectAns(ucMlid.ajax_eId); }
                // });
                AH.selectAll(ucMlid.ajax_eId+' #sm_controller button').forEach((_this) => {
                    if (_this.classList.contains('your-ans btn-primary')) { 
                        ucMlid.showAllAns(ucMlid.ajax_eId); 
                    } else if (_this.classList.contains('correct-ans btn-primary')) { 
                        ucMlid.showAllCorrectAns(ucMlid.ajax_eId); 
                    }
                });
                // jQuery(ucMlid.ajax_eId).find('#sm_controller_default button').each(function() {
                //     if (jQuery(this).hasClass('your-ans btn-primary')) { ucMlid.showYour(ucMlid.ajax_eId); } else if (jQuery(this).hasClass('correct-ans btn-primary')) { ucMlid.showCorrect(ucMlid.ajax_eId); } else if (jQuery(this).hasClass('both-ans btn-primary')) { ucMlid.showAll(ucMlid.ajax_eId); }
                // });

                AH.find(ucMlid.ajax_eId,'#sm_controller_default button','all').forEach((_this)=> {
                    if (_this.classList.contains('your-ans btn-primary')) { ucMlid.showYour(ucMlid.ajax_eId); } else if (_this.classList.contains('correct-ans btn-primary')) { ucMlid.showCorrect(ucMlid.ajax_eId); } else if (_this.classList.contains('both-ans btn-primary')) { ucMlid.showAll(ucMlid.ajax_eId); }
                });
            }, 50);
        } else {
            //jQuery('.review').addClass('h');
            AH.selectAll('.review','addClass','h');
            //jQuery('.test').removeClass('h');
            AH.selectAll('.test','removeClass','h');
            setTimeout(function() {
                ucMlid.bindLab();
                ucMlid.bindKeyup(ucMlid.ajax_eId);
                ucMlid.showUserAns(ucMlid.ajax_eId);
                ucMlid.remove_lines(ucMlid.ajax_eId);
                ucMlid.cleanTitle();
            }, 50);
        }
    }; 


    ucMlid.unBindLab = function() {
        ucMlid.labBinded = false;
        //jQuery(ucMlid.ajax_eId).find('#lines, .matchlist-delete').remove();
        AH.find(ucMlid.ajax_eId,'#lines, .matchlist-delete',{
            action: 'remove'
        });
        //const draggable_ele = ucMlid.multimatch == 2 ? ".list4" : ".list1"; @eslint issues solved
        //jQuery(ucMlid.ajax_eId).find(draggable_ele).draggable('destroy');
        // AH.find(ucMlid.ajax_eId,'.list3, .list2','all').forEach((_this)=> {
        //     if (_this.classList.contains('ui-draggable')) {
        //     // _this.draggable('destroy'); // dicuss with sir
        //     }
        // }); @eslint issues solved
        //jQuery(ucMlid.ajax_eId).find('#sm_controller button, #sm_controller_default button').unbind('click'); need to fix
        

        // jQuery(ucMlid.ajax_eId).find('#sm_controller button, #sm_controller_default button').keyup(function(e) { 
        //     if(e.keyCode == 13) {
        //         ucMlid.modifyClass(this, 'keyup') ;
        //     }   
        // }).click(function(){            
        //     ucMlid.modifyClass(this) ;
        // });  /// Need to fix it.
    };




    ucMlid.modifyClass = function(self, type) { //  Not catched when call
        //jQuery(ucMlid.ajax_eId).find("#sm_controller button, #sm_controller_default button");
        AH.find(ucMlid.ajax_eId,"#sm_controller button, #sm_controller_default button","all"); // Will Replaced
        if(type){
            //jQuery(self).addClass('btn-primary').removeClass('btn-light');  
                self.classList.add('btn-primary');
                self.classList.remove('btn-light');
             //Will Replaced
            //jQuery(self).siblings().removeClass("btn-primary").addClass('btn-light'); // Need to fix it
            
        } else {
            //jQuery(self).addClass('btn-primary').removeClass('btn-light'); 
                self.classList.add('btn-primary');
                self.classList.remove('btn-light');
            
           // jQuery(self).siblings().removeClass("btn-primary").addClass('btn-light'); // Need to fix it
        }  
    };



    ucMlid.bindLab = function() {
        
        ucMlid.labBinded = true;
        //jQuery(ucMlid.ajax_eId).find('#lines,.correct,.lines,.correct_incorrect_icon').remove();
        AH.find(ucMlid.ajax_eId,'#lines,.correct,.lines,.correct_incorrect_icon',{
            action:'remove'
        });
        // let ucMlidAjax = AH.select(ucMlid.ajax_eId);
        // AH.find(ucMlidAjax,'#lines,.correct,.lines,.correct_incorrect_icon').remove; // Replaced
    };
    /*ajax based code*/



    ucMlid.editor_validtion = function(editing_type) {
        if (editing_type == 1 || editing_type == 2 || editing_type == 3) {
            const $list1 = document.getElementById("#list1").value;
            const $list2 = document.getElementById("#list2").value;
            const $matchList = document.getElementById("#matchList").value;
            if ($list1 == "" || $list2 == "" || $matchList == "") {
                AH.showmsg("Please Fill The Heading of Lists and Question", 1);
                return false;
            }
            return true;
        }
    };

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
        title: "Title",
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
        delete : "Delete",
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
        ada_graph_msg: 'Press enter key on this button to open modalbox to set the point for draw the graph without clicking on the graph board',
        ada_chart_msg: 'Press any key on this button to open modalbox to set the point for draw the chart without click on the chart board',
        add_chart_msg: 'Click on this button to add the point on the chart',
        edit_graph: 'Click on this button to open modalbox for changing the graph view',
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
        add_column: 'Add Column',
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
        one_option_correct: 'Only one option can be select or correct.',
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
    };

    /* helper\ItemHelper.svelte generated by Svelte v3.29.0 */

    const { document: document_1 } = globals;

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-ri6gyf-style";
    	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}";
    	append(document_1.head, style);
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

    function create_fragment(ctx) {
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

    function instance($$self, $$props, $$invalidate) {
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
    		if (!document_1.getElementById("svelte-ri6gyf-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 });
    	}
    }

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

    function XMLToJSON(myXml) {
    	//var myXml = xml;
    	myXml = myXml.replace(/<\!--\[CDATA\[/g, "<![CDATA[").replace(/\]\]-->/g, "]]>");

    	let x2js = new xml2json({ useDoubleQuotes: true });
    	let newXml = JSON.stringify(x2js.xml_str2json(myXml));
    	newXml = newXml.replace("SMXML", "smxml");
    	newXml = JSON.parse(newXml);
    	return newXml;
    }

    const AH$1 = new JUI();
    const SSD = new JStore();

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

    const { document: document_1$1 } = globals;

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-po4fcb-style";
    	style.textContent = ".ripple.svelte-po4fcb{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;border-radius:inherit;color:inherit;pointer-events:none;z-index:0;contain:strict}.ripple.svelte-po4fcb .animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;opacity:0;pointer-events:none;overflow:hidden;will-change:transform, opacity}.ripple.svelte-po4fcb .animation--enter{transition:none}.ripple.svelte-po4fcb .animation--in{transition:opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n\t\t\topacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)}.ripple.svelte-po4fcb .animation--out{transition:opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)}";
    	append(document_1$1.head, style);
    }

    function create_fragment$1(ctx) {
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

    function instance$1($$self, $$props, $$invalidate) {
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
    		if (!document_1$1.getElementById("svelte-po4fcb-style")) add_css$1();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { center: 1, circle: 2, color: 3 });
    	}
    }

    /* node_modules\svelte-mui\src\Button.svelte generated by Svelte v3.29.0 */

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-6bcb3a-style";
    	style.textContent = "button.svelte-6bcb3a:disabled{cursor:default}button.svelte-6bcb3a{cursor:pointer;font-family:Roboto, Helvetica, sans-serif;font-family:var(--button-font-family, Roboto, Helvetica, sans-serif);font-size:0.875rem;font-weight:500;letter-spacing:0.75px;text-decoration:none;text-transform:uppercase;will-change:transform, opacity;margin:0;padding:0 16px;display:-ms-inline-flexbox;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;height:36px;border:none;outline:none;line-height:inherit;user-select:none;overflow:hidden;vertical-align:middle;border-radius:4px}button.svelte-6bcb3a::-moz-focus-inner{border:0}button.svelte-6bcb3a:-moz-focusring{outline:none}button.svelte-6bcb3a:before{box-sizing:inherit;border-radius:inherit;color:inherit;bottom:0;content:'';left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:0.2s cubic-bezier(0.25, 0.8, 0.5, 1);will-change:background-color, opacity}.toggle.svelte-6bcb3a:before{box-sizing:content-box}.active.svelte-6bcb3a:before{background-color:currentColor;opacity:0.3}.raised.svelte-6bcb3a{box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 5px 0 rgba(0, 0, 0, 0.12)}.outlined.svelte-6bcb3a{padding:0 14px;border-style:solid;border-width:2px}.shaped.svelte-6bcb3a{border-radius:18px}.dense.svelte-6bcb3a{height:32px}.icon-button.svelte-6bcb3a{line-height:0.5;border-radius:50%;padding:8px;width:40px;height:40px;vertical-align:middle}.icon-button.outlined.svelte-6bcb3a{padding:6px}.icon-button.fab.svelte-6bcb3a{border:none;width:56px;height:56px;box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14),\n\t\t\t0 1px 18px 0 rgba(0, 0, 0, 0.12)}.icon-button.dense.svelte-6bcb3a{width:36px;height:36px}.icon-button.fab.dense.svelte-6bcb3a{width:40px;height:40px}.outlined.svelte-6bcb3a:not(.shaped) .ripple{border-radius:0 !important}.full-width.svelte-6bcb3a{width:100%}@media(hover: hover){button.svelte-6bcb3a:hover:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}button.focus-visible.svelte-6bcb3a:focus:not(.toggle):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.3}button.focus-visible.toggle.svelte-6bcb3a:focus:not(.active):not([disabled]):not(.disabled):before{background-color:currentColor;opacity:0.15}}";
    	append(document.head, style);
    }

    // (20:1) {#if ripple}
    function create_if_block$1(ctx) {
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

    function create_fragment$2(ctx) {
    	let button;
    	let t;
    	let events_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	let if_block = /*ripple*/ ctx[10] && create_if_block$1(ctx);

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
    					if_block = create_if_block$1(ctx);
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

    function instance$2($$self, $$props, $$invalidate) {
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
    		if (!document.getElementById("svelte-6bcb3a-style")) add_css$2();

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
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

    function add_css$3() {
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
    function create_if_block$2(ctx) {
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

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[0] && create_if_block$2(ctx);

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
    					if_block = create_if_block$2(ctx);
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

    function instance$3($$self, $$props, $$invalidate) {
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
    		if (!document.getElementById("svelte-1pkw9hl-style")) add_css$3();

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
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

    /* clsSMMatchList\MatchListPreview.svelte generated by Svelte v3.29.0 */

    const { document: document_1$2 } = globals;

    function add_css$4() {
    	var style = element("style");
    	style.id = "svelte-bi3u6x-style";
    	style.textContent = ".u-sr-only.svelte-bi3u6x{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:500px){.shuffle.svelte-bi3u6x{text-align:center}}";
    	append(document_1$2.head, style);
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    // (686:3) {#if editorState}
    function create_if_block_1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div = element("div");
    			div.textContent = `${Lang.shuffle}`;
    			attr(div, "id", "shuffleArea");
    			attr(div, "class", "shuffle text-center svelte-bi3u6x");
    			set_style(div, "font-size", "17px");
    			set_style(div, "cursor", "pointer");
    			set_style(div, "display", "none");
    			set_style(div, "color", "#aaa");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (!mounted) {
    				dispose = listen(div, "click", /*shuffleItems*/ ctx[14]);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (768:4) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let each_value_3 = /*list1*/ ctx[6];
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*list2*/ ctx[7];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	return {
    		c() {
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(div0, "class", "row-fluid match_options shuffleList2");
    			attr(div1, "class", "row-fluid shuffleList1");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append(div1, t);
    			append(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*list1, setList1Html*/ 32832) {
    				each_value_3 = /*list1*/ ctx[6];
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div1, t);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_3.length;
    			}

    			if (dirty[0] & /*list2, setList2Html, alphabet*/ 67712) {
    				each_value_2 = /*list2*/ ctx[7];
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (729:4) {#if (multimatch == 0 || multimatch == 1)}
    function create_if_block$3(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let each_value_1 = /*list1*/ ctx[6];
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*list2*/ ctx[7];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			div3 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(div0, "class", "span4 shuffleList1");
    			attr(div0, "dragable", "1");
    			attr(div1, "class", "span3");
    			attr(div2, "class", "span4 shuffleList2");
    			attr(div3, "class", "row-fluid");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append(div3, t0);
    			append(div3, div1);
    			append(div3, t1);
    			append(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*list1, setList1Html*/ 32832) {
    				each_value_1 = /*list1*/ ctx[6];
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

    			if (dirty[0] & /*list2, setList2Html, alphabet*/ 67712) {
    				each_value = /*list2*/ ctx[7];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (770:6) {#each list1 as data,i}
    function create_each_block_3(ctx) {
    	let div3;
    	let span0;
    	let div0;
    	let raw_value = /*setList1Html*/ ctx[15](/*data*/ ctx[50], /*i*/ ctx[52]) + "";
    	let div0_id_value;
    	let div0_data_correctans_value;
    	let div0_data_userans_value;
    	let div0_data_originalseq_value;
    	let t0;
    	let span1;
    	let div1;
    	let div1_id_value;
    	let t1;
    	let span2;
    	let div2;
    	let t2;
    	let div2_id_value;
    	let div2_data_correctans_value;
    	let div2_data_userans_value;
    	let div2_mrel_value;
    	let div2_aria_label_value;
    	let div2_data_originalseq_value;
    	let div3_key_value;

    	return {
    		c() {
    			div3 = element("div");
    			span0 = element("span");
    			div0 = element("div");
    			t0 = space();
    			span1 = element("span");
    			div1 = element("div");
    			t1 = space();
    			span2 = element("span");
    			div2 = element("div");
    			t2 = text("Place Here");
    			attr(div0, "id", div0_id_value = /*data*/ ctx[50].id);
    			attr(div0, "class", "list1");
    			attr(div0, "tabindex", "0");
    			attr(div0, "data-correctans", div0_data_correctans_value = /*data*/ ctx[50].correctans);
    			attr(div0, "data-userans", div0_data_userans_value = /*data*/ ctx[50].userans);

    			attr(div0, "data-originalseq", div0_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0");

    			attr(span0, "class", "span4");
    			attr(div1, "id", div1_id_value = /*data*/ ctx[50].id);
    			attr(div1, "class", "arrow");
    			attr(span1, "class", "span3");
    			attr(div2, "id", div2_id_value = /*data*/ ctx[50].id);
    			attr(div2, "class", "list3 ui-droppable");
    			attr(div2, "data-droped", "");
    			attr(div2, "data-correctans", div2_data_correctans_value = /*data*/ ctx[50].correctans);
    			attr(div2, "data-userans", div2_data_userans_value = /*data*/ ctx[50].userans);
    			attr(div2, "mrel", div2_mrel_value = /*data*/ ctx[50].id);
    			attr(div2, "dropzone", "1");
    			attr(div2, "draggable", "true");
    			attr(div2, "tabindex", "0");
    			attr(div2, "aria-label", div2_aria_label_value = `Droped`);

    			attr(div2, "data-originalseq", div2_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0");

    			attr(span2, "class", "span4");
    			attr(div3, "key", div3_key_value = /*i*/ ctx[52]);
    			attr(div3, "class", "row-fluid");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, span0);
    			append(span0, div0);
    			div0.innerHTML = raw_value;
    			append(div3, t0);
    			append(div3, span1);
    			append(span1, div1);
    			append(div3, t1);
    			append(div3, span2);
    			append(span2, div2);
    			append(div2, t2);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*list1*/ 64 && raw_value !== (raw_value = /*setList1Html*/ ctx[15](/*data*/ ctx[50], /*i*/ ctx[52]) + "")) div0.innerHTML = raw_value;
    			if (dirty[0] & /*list1*/ 64 && div0_id_value !== (div0_id_value = /*data*/ ctx[50].id)) {
    				attr(div0, "id", div0_id_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div0_data_correctans_value !== (div0_data_correctans_value = /*data*/ ctx[50].correctans)) {
    				attr(div0, "data-correctans", div0_data_correctans_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div0_data_userans_value !== (div0_data_userans_value = /*data*/ ctx[50].userans)) {
    				attr(div0, "data-userans", div0_data_userans_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div0_data_originalseq_value !== (div0_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0")) {
    				attr(div0, "data-originalseq", div0_data_originalseq_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div1_id_value !== (div1_id_value = /*data*/ ctx[50].id)) {
    				attr(div1, "id", div1_id_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div2_id_value !== (div2_id_value = /*data*/ ctx[50].id)) {
    				attr(div2, "id", div2_id_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div2_data_correctans_value !== (div2_data_correctans_value = /*data*/ ctx[50].correctans)) {
    				attr(div2, "data-correctans", div2_data_correctans_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div2_data_userans_value !== (div2_data_userans_value = /*data*/ ctx[50].userans)) {
    				attr(div2, "data-userans", div2_data_userans_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div2_mrel_value !== (div2_mrel_value = /*data*/ ctx[50].id)) {
    				attr(div2, "mrel", div2_mrel_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div2_data_originalseq_value !== (div2_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0")) {
    				attr(div2, "data-originalseq", div2_data_originalseq_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    		}
    	};
    }

    // (806:7) {#each list2 as data,i}
    function create_each_block_2(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = /*setList2Html*/ ctx[16](/*data*/ ctx[50], /*alphabet*/ ctx[11][/*i*/ ctx[52]]) + "";
    	let t;
    	let div_key_value;
    	let div_id_value;
    	let div_data_originalseq_value;

    	return {
    		c() {
    			div = element("div");
    			t = space();
    			html_tag = new HtmlTag(t);
    			attr(div, "key", div_key_value = /*i*/ ctx[52]);
    			attr(div, "id", div_id_value = /*data*/ ctx[50].id);
    			attr(div, "class", "list4 ui-draggable");
    			attr(div, "data-correctans", "");
    			attr(div, "dragable", "1");
    			attr(div, "draggable", "true");
    			attr(div, "data-userans", "");
    			attr(div, "tabindex", "0");

    			attr(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append(div, t);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*list2*/ 128 && raw_value !== (raw_value = /*setList2Html*/ ctx[16](/*data*/ ctx[50], /*alphabet*/ ctx[11][/*i*/ ctx[52]]) + "")) html_tag.p(raw_value);

    			if (dirty[0] & /*list2*/ 128 && div_id_value !== (div_id_value = /*data*/ ctx[50].id)) {
    				attr(div, "id", div_id_value);
    			}

    			if (dirty[0] & /*list2*/ 128 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0")) {
    				attr(div, "data-originalseq", div_data_originalseq_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (732:6) {#each list1 as data,i}
    function create_each_block_1(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = /*setList1Html*/ ctx[15](/*data*/ ctx[50], /*i*/ ctx[52]) + "";
    	let t;
    	let div_key_value;
    	let div_id_value;
    	let div_data_correctans_value;
    	let div_data_userans_value;
    	let div_style_value;
    	let div_data_originalseq_value;

    	return {
    		c() {
    			div = element("div");
    			t = space();
    			html_tag = new HtmlTag(t);
    			attr(div, "key", div_key_value = /*i*/ ctx[52]);
    			attr(div, "id", div_id_value = /*data*/ ctx[50].id);
    			attr(div, "class", "list1 ui-draggable");
    			attr(div, "data-correctans", div_data_correctans_value = /*data*/ ctx[50].correctans);
    			attr(div, "data-userans", div_data_userans_value = /*data*/ ctx[50].userans);
    			attr(div, "style", div_style_value = "position:relative;");
    			attr(div, "tabindex", "0");
    			attr(div, "draggable", "true");

    			attr(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append(div, t);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*list1*/ 64 && raw_value !== (raw_value = /*setList1Html*/ ctx[15](/*data*/ ctx[50], /*i*/ ctx[52]) + "")) html_tag.p(raw_value);

    			if (dirty[0] & /*list1*/ 64 && div_id_value !== (div_id_value = /*data*/ ctx[50].id)) {
    				attr(div, "id", div_id_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div_data_correctans_value !== (div_data_correctans_value = /*data*/ ctx[50].correctans)) {
    				attr(div, "data-correctans", div_data_correctans_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[50].userans)) {
    				attr(div, "data-userans", div_data_userans_value);
    			}

    			if (dirty[0] & /*list1*/ 64 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0")) {
    				attr(div, "data-originalseq", div_data_originalseq_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (751:5) {#each list2 as data,i}
    function create_each_block(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = /*setList2Html*/ ctx[16](/*data*/ ctx[50], /*alphabet*/ ctx[11][/*i*/ ctx[52]]) + "";
    	let t;
    	let div_key_value;
    	let div_id_value;
    	let div_style_value;
    	let div_data_originalseq_value;

    	return {
    		c() {
    			div = element("div");
    			t = space();
    			html_tag = new HtmlTag(t);
    			attr(div, "key", div_key_value = /*i*/ ctx[52]);
    			attr(div, "id", div_id_value = /*data*/ ctx[50].id);
    			attr(div, "class", "list2 ui-droppable");
    			attr(div, "data-correctans", "");
    			attr(div, "data-userans", "");
    			attr(div, "dropzone", "1");
    			attr(div, "style", div_style_value = "position:relative;");
    			attr(div, "tabindex", "0");

    			attr(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append(div, t);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*list2*/ 128 && raw_value !== (raw_value = /*setList2Html*/ ctx[16](/*data*/ ctx[50], /*alphabet*/ ctx[11][/*i*/ ctx[52]]) + "")) html_tag.p(raw_value);

    			if (dirty[0] & /*list2*/ 128 && div_id_value !== (div_id_value = /*data*/ ctx[50].id)) {
    				attr(div, "id", div_id_value);
    			}

    			if (dirty[0] & /*list2*/ 128 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[50].originalseq
    			? /*data*/ ctx[50].originalseq
    			: "0")) {
    				attr(div, "data-originalseq", div_data_originalseq_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (835:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>
    function create_default_slot_1(ctx) {
    	let i_1;

    	return {
    		c() {
    			i_1 = element("i");
    			i_1.innerHTML = `<span class="u-sr-only svelte-bi3u6x">close</span>`;
    			attr(i_1, "class", "mi mi-close");
    		},
    		m(target, anchor) {
    			insert(target, i_1, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(i_1);
    		}
    	};
    }

    // (828:1) <Dialog     bind:visible={state.dropDialog}     style={'width:450px;height:254px;'}    >
    function create_default_slot(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let button;
    	let t2;
    	let div4;
    	let div3;
    	let img;
    	let img_src_value;
    	let t3;
    	let br;
    	let t4;
    	let span;
    	let current;

    	button = new Button({
    			props: {
    				style: "position:relative;left:21px;bottom:6px;",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	button.$on("click", /*click_handler_3*/ ctx[28]);

    	return {
    		c() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "How to drop?";
    			t1 = space();
    			div1 = element("div");
    			create_component(button.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			div3 = element("div");
    			img = element("img");
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			span = element("span");

    			span.innerHTML = `<input type="checkbox" style="top:2px;" class="relative donotshowdialog" id="dropId"/> 
						<label for="dropId">Do not show this dialog again</label>`;

    			attr(div0, "title", "How to drop?");
    			attr(div0, "class", "float-start");
    			attr(div1, "class", "float-end");
    			set_style(div2, "font-weight", "bold");
    			attr(div2, "class", "clearfix");
    			attr(img, "alt", "gif file");
    			if (img.src !== (img_src_value = AH$1.select("#matchmain").getAttribute("path") + "match_drop_000BOG.gif")) attr(img, "src", img_src_value);
    			attr(span, "class", "mt-2");
    			attr(div3, "class", "row");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div2, t1);
    			append(div2, div1);
    			mount_component(button, div1, null);
    			insert(target, t2, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, img);
    			append(div3, t3);
    			append(div3, br);
    			append(div3, t4);
    			append(div3, span);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 33554432) {
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
    			if (detaching) detach(div2);
    			destroy_component(button);
    			if (detaching) detach(t2);
    			if (detaching) detach(div4);
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div10;
    	let center;
    	let t0;
    	let div9;
    	let div0;
    	let itemhelper;
    	let t1;
    	let div2;
    	let div1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let div2_class_value;
    	let t7;
    	let div8;
    	let div4;
    	let div3;
    	let t8;
    	let t9;
    	let div5;
    	let t10;
    	let div7;
    	let div6;
    	let t11;
    	let t12;
    	let t13;
    	let dialog;
    	let updating_visible;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*editorState*/ ctx[1] && create_if_block_1(ctx);

    	itemhelper = new ItemHelper({
    			props: {
    				handleReviewClick: /*handleReview*/ ctx[17],
    				reviewMode: /*isReview*/ ctx[0]
    			}
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[12]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[13]);

    	function select_block_type(ctx, dirty) {
    		if (/*multimatch*/ ctx[5] == 0 || /*multimatch*/ ctx[5] == 1) return create_if_block$3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	function dialog_visible_binding(value) {
    		/*dialog_visible_binding*/ ctx[29].call(null, value);
    	}

    	let dialog_props = {
    		style: "width:450px;height:254px;",
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*state*/ ctx[10].dropDialog !== void 0) {
    		dialog_props.visible = /*state*/ ctx[10].dropDialog;
    	}

    	dialog = new Dialog({ props: dialog_props });
    	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));

    	return {
    		c() {
    			main = element("main");
    			div10 = element("div");
    			center = element("center");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div9 = element("div");
    			div0 = element("div");
    			create_component(itemhelper.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Correct Answer";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Compare";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "Your Answer";
    			t7 = space();
    			div8 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			t8 = text(/*listheading1*/ ctx[3]);
    			t9 = space();
    			div5 = element("div");
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t11 = text(/*listheading2*/ ctx[4]);
    			t12 = space();
    			if_block1.c();
    			t13 = space();
    			create_component(dialog.$$.fragment);
    			attr(div0, "class", "btn-group clearfix review_2 h");
    			attr(div0, "id", "sm_controller");
    			attr(button0, "type", "button");
    			attr(button0, "tabindex", "0");
    			attr(button0, "class", "btn btn-light correct-ans");
    			attr(button1, "type", "button");
    			attr(button1, "tabindex", "0");
    			attr(button1, "class", "btn btn-primary both-ans");
    			attr(button2, "type", "button");
    			attr(button2, "tabindex", "0");
    			attr(button2, "class", "btn btn-light your-answer");
    			attr(div1, "class", "btn-group clearfix review_default h");
    			attr(div1, "id", "sm_controller_default");
    			attr(div2, "class", div2_class_value =  "");
    			attr(div3, "class", "heading");
    			attr(div4, "class", "span4");
    			attr(div5, "class", "span3");
    			attr(div6, "class", "heading");
    			attr(div7, "class", "span4");
    			attr(div8, "class", "row-fluid");
    			attr(div9, "id", /*containerID*/ ctx[9]);
    			attr(div9, "path", "//s3.amazonaws.com/jigyaasa_content_static/");
    			attr(div9, "multimatch", /*multimatch*/ ctx[5]);
    			attr(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[8]);
    			set_style(div9, "font-family", "Roboto, sans-serif");
    			set_style(div9, "font-size", "1em");
    			attr(div10, "id", "previewSection");
    			attr(div10, "class", "px-2");
    		},
    		m(target, anchor) {
    			insert(target, main, anchor);
    			append(main, div10);
    			append(div10, center);
    			if (if_block0) if_block0.m(center, null);
    			append(center, t0);
    			append(center, div9);
    			append(div9, div0);
    			mount_component(itemhelper, div0, null);
    			append(div9, t1);
    			append(div9, div2);
    			append(div2, div1);
    			append(div1, button0);
    			append(div1, t3);
    			append(div1, button1);
    			append(div1, t5);
    			append(div1, button2);
    			append(div9, t7);
    			append(div9, div8);
    			append(div8, div4);
    			append(div4, div3);
    			append(div3, t8);
    			append(div8, t9);
    			append(div8, div5);
    			append(div8, t10);
    			append(div8, div7);
    			append(div7, div6);
    			append(div6, t11);
    			append(div9, t12);
    			if_block1.m(div9, null);
    			append(main, t13);
    			mount_component(dialog, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*click_handler*/ ctx[22]),
    					listen(button0, "keyup", /*keyup_handler*/ ctx[23]),
    					listen(button1, "click", /*click_handler_1*/ ctx[24]),
    					listen(button1, "keyup", /*keyup_handler_1*/ ctx[25]),
    					listen(button2, "click", /*click_handler_2*/ ctx[26]),
    					listen(button2, "keyup", /*keyup_handler_2*/ ctx[27])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*editorState*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(center, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);
    			if (!current || dirty[0] & /*listheading1*/ 8) set_data(t8, /*listheading1*/ ctx[3]);
    			if (!current || dirty[0] & /*listheading2*/ 16) set_data(t11, /*listheading2*/ ctx[4]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div9, null);
    				}
    			}

    			if (!current || dirty[0] & /*containerID*/ 512) {
    				attr(div9, "id", /*containerID*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*multimatch*/ 32) {
    				attr(div9, "multimatch", /*multimatch*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*totalCorrectAns*/ 256) {
    				attr(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[8]);
    			}

    			const dialog_changes = {};

    			if (dirty[0] & /*state*/ 1024 | dirty[1] & /*$$scope*/ 33554432) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible && dirty[0] & /*state*/ 1024) {
    				updating_visible = true;
    				dialog_changes.visible = /*state*/ ctx[10].dropDialog;
    				add_flush_callback(() => updating_visible = false);
    			}

    			dialog.$set(dialog_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(main);
    			if (if_block0) if_block0.d();
    			destroy_component(itemhelper);
    			if_block1.d();
    			destroy_component(dialog);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // shuffle the array
    function shuffleArray(array) {
    	for (let i = array.length - 1; i > 0; i--) {
    		let j = Math.floor(Math.random() * (i + 1));
    		let temp = array[i];
    		array[i] = array[j];
    		array[j] = temp;
    	}

    	return array;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { showAns } = $$props;
    	let { cmed } = $$props;
    	let { xml } = $$props;
    	let { isReview } = $$props;
    	let { uxml } = $$props;
    	let { editorState } = $$props;
    	let listheading1 = "";
    	let listheading2 = "";
    	let multimatch = "";
    	let list1 = [];
    	let list2 = [];
    	let cdata = "";
    	let isShuffeled = false;
    	let totalCorrectAns = 0;

    	let alphabet = [
    		"A",
    		"B",
    		"C",
    		"D",
    		"E",
    		"F",
    		"G",
    		"H",
    		"I",
    		"J",
    		"K",
    		"L",
    		"M",
    		"N",
    		"O",
    		"P",
    		"Q",
    		"R",
    		"S",
    		"T",
    		"U",
    		"V",
    		"W",
    		"X",
    		"Y",
    		"Z"
    	];

    	let is_algo = false;
    	let max_node = 0;
    	let is_remediation = false;
    	let errorCatchFlag = 1;
    	let originalseq1 = "";
    	let originalseq2 = "";
    	ucMlid.sinfo = true;
    	let listenCall = 0;
    	let containerID = cmed ? "matchmain" + cmed : "matchmain";
    	let dragable;

    	let state = {
    		xml: "",
    		remedStatus: "",
    		dropDialog: "",
    		isReview: false
    	};

    	// for displaying the answer
    	function displayAns() {
    		let ans = ucMlid.checkAns("#" + containerID);

    		if (!window.QXML) {
    			showAns(ans);
    		}
    	}

    	function loadLibs() {
    		let config = {
    			preload: true,
    			type: "stylesheet",
    			as: "style"
    		};

    		AH$1.createLink(themeUrl + "clsSMMatchList/css/matchList.min.css", config);
    		AH$1.createLink("https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css", config);
    	}

    	onMount(() => {
    		loadLibs();

    		dragable = new Draggable({
    				onDragEnd: event => {
    					displayAns();
    					console.log("onDragEnd");

    					if (!ucMlid.is_valid_drop) {
    						if (ucMlid.sinfo) {
    							$$invalidate(2, ucMlid.sinfo = false, ucMlid);

    							setTimeout(
    								function () {
    									$$invalidate(2, ucMlid.sinfo = true, ucMlid);
    								},
    								60 * 1000
    							);

    							// if (!UCINFO.isIphone) {
    							if (typeof AH$1.alert == "function") AH$1.showmsg("While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.");

    							console.log("checking box");

    							if (ucMlid.chkDoNotShow(user_guid) != true) {
    								$$invalidate(10, state.dropDialog = true, state);
    							} // if (typeof(bindDialog) == 'function') 
    							// bindDialog({ click: this, wd: 450, ht: 236, data: '<div title="How to drop?"><img src="' + jQuery(mlid).attr('path') + 'match_drop_000BOG.gif" /><br/><span><label><input type="checkbox" style="top:2px;" class="relative donotshowdialog"> Do not show this dialog again</label></span></div>' });
    						} //}
    					} // return true;
    				}
    			});

    		// AH.listen(document,'mouseup','.shuffleList1',function(){
    		// 	console.log('shuffleList1');
    		// 	setTimeout(function(){
    		// 		displayAns();
    		// 	},200)
    		// }) // Replaced
    		// AH.listen(document,'mouseup','.shuffleList2',function(){
    		// 	console.log('shuffleList2');
    		// 	setTimeout(function(){
    		// 		displayAns();
    		// 	},200)
    		// })
    		AH$1.listen(document, "click", "#set-review", function () {
    			setReview();
    		});

    		// binding up the unsetreview function 
    		// jQuery("#unset-review").on('click',function(){
    		// 	unsetReview();
    		// });// Will Replaced
    		AH$1.listen(document, "click", "#unset-review", function () {
    			unsetReview();
    		});

    		setTimeout(
    			(function () {
    				//jQuery("#"+containerID+" img").on('load', function() {
    				let imgContainerId = AH$1.select("#" + containerID + " img");

    				AH$1.listen(document, "load", imgContainerId, () => {
    					// if review mode is on
    					if (isReview) {
    						// if multimatch is normal or swap list
    						if (multimatch == 1 || multimatch == 0) {
    							AH$1.select("#" + containerID + " #sm_controller", "addClass", "h");
    							AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
    						} else {
    							AH$1.select("#" + containerID + " #sm_controller_default", "addClass", "h");
    							AH$1.select("#" + containerID + " #sm_controller", "removeClass", "h");
    						}

    						unsetReview();
    						setReview();
    					} else {
    						setReview();
    						unsetReview();
    					}
    				});
    			}).bind(this),
    			500
    		);

    		setTimeout(
    			function () {
    				listen();
    			},
    			1500
    		);
    	});

    	// function for binding keyup using hotkeys function which is defined in prepengine-footer.js
    	function listen() {
    		if (listenCall > 3) return false;

    		if (typeof hotkeys == "function") {
    			setTimeout(
    				function () {
    					console.log("hotkey function is ", typeof hotkeys == "function");
    					ucMlid.bindKeyup();
    				},
    				1000
    			);
    		} else {
    			console.log("Hotkey try = ", listenCall);
    			listenCall++;
    			listen();
    		}
    	}

    	// function calls when remediation mode is on it basically display the ans
    	function setReview() {
    		$$invalidate(0, isReview = true);
    		is_remediation = true;

    		// check the answer
    		displayAns();

    		//jQuery("#shuffleArea").hide();
    		if (document.querySelector("#shuffleAre") != null) document.querySelector("#shuffleAre").style.display = "none"; //WIll Replaced

    		// for showing the answer
    		ucMlid.modeOn("on");

    		// if mode is normal mode or swap list
    		if (multimatch == 1 || multimatch == 0) {
    			AH$1.find("#" + containerID, "#sm_controller").classList.add("h");
    			AH$1.find("#" + containerID, "#sm_controller").style.display = "none";
    			AH$1.find("#" + containerID, "#sm_controller_default").style.display = "inline-block";

    			var timer = setTimeout(
    				function () {
    					//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
    					AH$1.find("#" + containerID, "#sm_controller_default .both-ans").click();

    					clearTimeout(timer);
    				},
    				50
    			);
    		} else {
    			// if drag & drop
    			AH$1.select("#" + containerID + " " + "#sm_controller_default").classList.add("h");

    			AH$1.find("#" + containerID, "#sm_controller_default").style.display = "none";
    			AH$1.selectAll("#" + containerID + " " + "#sm_controller").style.display = "inline-block";

    			//containerId.querySelector('#ssm_controller').style.display = "inline-block";
    			var timer_next = setTimeout(
    				function () {
    					//jQuery("#"+containerID).find('#sm_controller_default .your-ans').click();
    					AI.find("#" + containerID, "#sm_controller_default .your-ans").click();

    					clearTimeout(timer_next);
    				},
    				200
    			);
    		}
    	}

    	// function calls when remediation mode is off after on.
    	function unsetReview() {
    		$$invalidate(0, isReview = false);

    		//jQuery('.review_2, .review_default').addClass('h');
    		AH$1.addClass(".review_2, .review_default", "h");

    		//jQuery('.review_2, .review_default').hide();
    		let removeclass = document.querySelectorAll(".review_2, .review_default");

    		for (let i = 0; i < removeclass.length; i++) {
    			removeclass[i].style.display = "none";
    		}

    		// review_default2.style.display = "none";
    		is_remediation = false;

    		// if shuffled
    		if (isShuffeled == true) {
    			AH$1.select("#shuffleArea", "css", { display: "none" });
    		} else {
    			AH$1.select("#shuffleArea", "css", { display: "block" });
    		}

    		// set the user ans in the module 
    		ucMlid.modeOn();
    	}

    	beforeUpdate(() => {
    		// checking for the change in the new xml
    		if (state.xml != xml) {
    			$$invalidate(10, state.xml = xml, state);

    			if (cmed) {
    				$$invalidate(9, containerID = "matchmain" + cmed);
    				$$invalidate(2, ucMlid.ajax_eId = "#matchmain" + cmed, ucMlid);
    			}

    			$$invalidate(31, isShuffeled = false);
    			AH$1.select("#shuffleArea", "css", { display: "block" });

    			// convert the xml into the json
    			var newXml = XMLToJSON(xml);

    			// parse the xml for the preview mode
    			parseXMLPreview(newXml);

    			//forceUpdate();  Only react uses
    			runModule();
    		} /*For Shuffling */ /*if(!window.QXML) {
    	var err  = smVal.validate(this.props.content_type, this.props.subtype , this.props.content_icon);
    	this.props.smValidate(err);
    }*/
    	});

    	// calls whenever xml is updated and update the module accordingly
    	function runModule() {
    		try {
    			showModule();
    		} catch(e) {
    			if (errorCatchFlag <= 100) {
    				var timer = setTimeout(
    					function () {
    						runModule();
    						clearTimeout(timer);
    					},
    					50
    				);
    			} else {
    				console.log("runModule14:Error");
    				console.log(e);
    			}

    			errorCatchFlag++;
    		}
    	}

    	// it basically parse the user answer and calls only one time in test area 
    	function parseUserAnswer() {
    		let matchUa = XMLToJSON(uxml);

    		if (uxml && matchUa.smans && matchUa.smans.matchlist && matchUa.smans.matchlist._userans) {
    			let matchUa = XMLToJSON(uxml);
    			let listseq1 = matchUa.smans.matchlist._list1seq.split(",");
    			let listseq2 = matchUa.smans.matchlist._list2seq.split(",");

    			originalseq1 = matchUa.smans.matchlist._originalseq1
    			? matchUa.smans.matchlist._originalseq1.split(",")
    			: "";

    			originalseq2 = matchUa.smans.matchlist._originalseq2
    			? matchUa.smans.matchlist._originalseq2.split(",")
    			: "";

    			/* Preserve List Sequence1*/
    			let newArr = [];

    			for (let i of listseq1) {
    				for (let j in list1) {
    					if (list1[j]["id"] == i) {
    						newArr.push(list1[j]);
    					}
    				}
    			}

    			$$invalidate(6, list1 = newArr);

    			/*****/
    			/* Preserve List Sequence2*/
    			let newArr2 = [];

    			for (let i of listseq2) {
    				for (let j in list2) {
    					if (list2[j]["id"] == i) {
    						newArr2.push(list2[j]);
    					}
    				}
    			}

    			$$invalidate(7, list2 = newArr2);

    			/*****/
    			if (matchUa.smans.matchlist._userans) {
    				const userAns = matchUa.smans.matchlist._userans.split(",");

    				for (let k in userAns) {
    					for (let m in list1) {
    						let uans = userAns[k].split(/\[|\]/g)[1];
    						uans = uans.split("|");

    						for (let n in uans) {
    							if (list1[m]["id"] == uans[n]) {
    								$$invalidate(6, list1[m]["userans"] += userAns[k].split(/\[|\]/g)[0] + ",", list1);
    							}
    						}
    					}
    				}
    			}
    		} else {
    			// shuffle list 1
    			shuffleArray(list1); // self.forceUpdate(); it works only in react

    			// shuffle list 2
    			shuffleArray(list2);

    			// remove the user ans
    			ucMlid.removeUserAns();
    		} //forceUpdate();

    		ucMlid.showUserAns("#" + containerID);
    		ucMlid.remove_lines("#" + containerID);

    		// set the user ans in the module 
    		ucMlid.modeOn();
    	}

    	// it is called whenever xml is updated 
    	function showModule() {
    		// for checking user ans
    		if (!uxml) {
    			// remove the user ans if there is no user ans
    			ucMlid.removeUserAns();
    		}

    		// adding draggable and drop events
    		ucMlid.showUserAns("#" + containerID);

    		ucMlid.remove_lines("#" + containerID);
    		ucMlid.modeOn();

    		if (window.QXML) {
    			// if it is open in test area parse the user answer
    			parseUserAnswer();
    		}

    		// checking for the reviewMode
    		if (isReview) {
    			//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
    			AH$1.find("#" + containerID, "#sm_controller_default .both-ans").click();

    			var timer = setTimeout(
    				function () {
    					is_remediation = true;
    					displayAns();
    					AH$1.select("#shuffleArea", "css", { display: "none" });
    					ucMlid.modeOn("on");

    					if (multimatch == 1 || multimatch == 0) {
    						AH$1.select("#" + containerID + " #sm_controller", "addClass", "h");
    						AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
    					} else {
    						AH$1.select("#" + containerID + " #sm_controller_default", "addClass", "h");
    						AH$1.select("#" + containerID + " #sm_controller", "removeClass", "h");
    					}

    					clearTimeout(timer);
    				},
    				100
    			);
    		} else {
    			//jQuery('.review_2, .review_default').addClass('h');
    			let review = document.querySelectorAll(".review_2, .review_default");

    			for (let i = 0; i < review.length; i++) {
    				review[i].classList.add("h");
    			}
    		}
    	}

    	// it is called whenever xml is updated  and parse the xml for preview
    	function parseXMLPreview(QXML) {
    		try {
    			$$invalidate(6, list1 = []);
    			$$invalidate(7, list2 = []);

    			// fetching value from the xml
    			$$invalidate(3, listheading1 = QXML.smxml.matchlist._listheading1);

    			$$invalidate(4, listheading2 = QXML.smxml.matchlist._listheading2);
    			$$invalidate(5, multimatch = QXML.smxml.matchlist._multimatch);
    			cdata = QXML.smxml.matchlist.__cdata;

    			// if is_algo is in xml, if is_algo is equal to true then set its value true otherwise set the valur to false
    			if (QXML.smxml.matchlist._is_algo) {
    				is_algo = QXML.smxml.matchlist._is_algo == "true" ? true : false;
    			} else {
    				is_algo = false;
    			}

    			// checking for the max_node (max no of node)
    			if (QXML.smxml.matchlist._max_node) {
    				var num = Number(QXML.smxml.matchlist._max_node);
    				max_node = num > 0 ? num : 0;
    			} else {
    				max_node = 0;
    			}

    			// splitting the cdata with the new line
    			cdata = cdata.split("\n");

    			var count = 0;
    			var countList1 = 1;
    			var multipleValue = false;
    			var multipleValueList2 = false;
    			var tempAns = "";

    			// traversing through the cdata
    			cdata.forEach(function (data, i) {
    				if (cdata[i].trim() != "") {
    					$$invalidate(8, totalCorrectAns++, totalCorrectAns);
    					var correctAns = "";

    					// finding the text which start with [ and end with ]
    					if (cdata[i].match(/\[(.*?)\]/g)) {
    						// storing the value in ans then removing the brackets and spliting it with | symbol
    						var ans = cdata[i].match(/\[(.*?)\]/g)[0];

    						ans = ans.replace("[", "").replace("]", "");
    						ans = ans.split("|");
    					}

    					// traversing through list 2 
    					list2.forEach(function (data, l) {
    						if (list2[l].value == cdata[i].replace(cdata[i].match(/\[(.*?)\]/g), "").trim()) {
    							tempAns = list2[l].id;
    							multipleValueList2 = true;
    						}
    					});

    					if (multipleValueList2 != true) {
    						list2.push({
    							id: alphabet[count],
    							correctans: "",
    							value: cdata[i].replace(cdata[i].match(/\[(.*?)\]/g), "").trim()
    						});

    						correctAns = list2[count].id;
    					} else {
    						correctAns = tempAns;
    					}

    					// traversing through list one
    					list1.forEach(function (data1, k) {
    						if (list1[k].value == ans) {
    							// value will never true as here string is comparing with array
    							multipleValue = true;

    							if (multipleValueList2 != true) {
    								$$invalidate(6, list1[k].correctans = list1[k].correctans + "," + list2[count].id, list1);
    							} else {
    								$$invalidate(6, list1[k].correctans = list1[k].correctans + "," + tempAns, list1);
    							}
    						}
    					});

    					if (multipleValue != true) {
    						ans.forEach(function (data, i) {
    							list1.push({
    								id: countList1,
    								correctans: correctAns,
    								userans: "",
    								value: ans[i]
    							});

    							countList1++;
    						});
    					}

    					multipleValue = false;
    					multipleValueList2 == false ? count++ : "";
    					multipleValueList2 = false;
    				}
    			});

    			// for the max node
    			if (max_node > 0 && max_node <= list1.length) {
    				//  shuffling the list
    				$$invalidate(6, list1 = shuffleArray(list1));

    				var temparr = [];

    				for (var i = 0; i < max_node; i++) {
    					temparr.push(list1[i]);
    				}

    				$$invalidate(6, list1 = temparr);
    				temparr = [];
    				temparr.length = 0;
    				var f = 0;

    				for (var i = 0; i < list1.length; i++) {
    					var correctarr = list1[i].correctans.split(",");

    					for (var j = 0; j < correctarr.length; j++) {
    						for (var k = 0; k < list2.length; k++) {
    							f = 0;

    							if (correctarr[j] == list2[k].id) {
    								if (temparr.length <= 0) {
    									temparr.push(list2[k]);
    								} else {
    									for (var l = 0; l < temparr.length; l++) {
    										if (correctarr[j] == temparr[l].id) {
    											f = 1;
    											break;
    										}
    									}

    									if (f != 1) {
    										temparr.push(list2[k]);
    									}
    								}
    							}
    						}
    					}
    				}

    				$$invalidate(7, list2 = temparr);
    			}
    		} catch(error) {
    			console.log({
    				error,
    				fun: "ParseXMLPreview",
    				file: "MatchlistPreview.js"
    			});
    		}
    	}

    	// shuffle the option
    	function shuffleItems() {
    		console.log("Shuffled");
    		$$invalidate(31, isShuffeled = true);
    		ucMlid.removeUserAns();
    		ucMlid.showUserAns("#" + containerID);
    		ucMlid.remove_lines("#" + containerID);
    		ucMlid.modeOn();
    		$$invalidate(6, list1 = shuffleArray(list1));
    		$$invalidate(7, list2 = shuffleArray(list2));
    		AH$1.select("#shuffleArea", "css", { display: "none" });
    	}

    	let setList1;
    	let setList2;

    	// function randomChoice (arr) {
    	// 	console.log("arr arr");
    	// 	let randIndex = Math.floor(Math.random() * arr.length);
    	// 	item.originalseq = randIndex; // change
    	// 	return arr[randIndex];
    	// }
    	function setList1Html(item, count) {
    		function randomChoice(arr) {
    			console.log("arr arr");
    			let randIndex = Math.floor(Math.random() * arr.length);
    			item.originalseq = randIndex; // change
    			return arr[randIndex];
    		}

    		if (is_algo == true && is_remediation != true) {
    			if (originalseq1) {
    				var seq = originalseq1[i];
    				item.originalseq = seq; // change
    				item.value = item.value.split("%%")[seq];
    			} else {
    				item.value = randomChoice(item.value.split("%%"));
    			}
    		}

    		let img_src = item.value.substr(1).split("##")[0].split("%%")[0]; // For alt implementating with ##

    		let img_alt = item.value.substr(1).split("##")[1]
    		? item.value.substr(1).split("##")[1]
    		: "";

    		setList1 = `<span class="serial">${count + 1}.</span>` + (item.value.charAt(0) == "*"
    		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
    		: is_algo == true ? item.value : item.value);

    		return setList1;
    	}

    	function setList2Html(item, count) {
    		function randomChoice(arr) {
    			var randIndex = Math.floor(Math.random() * arr.length);

    			//data.originalseq = randIndex;
    			item.originalseq = randIndex;

    			return arr[randIndex];
    		}

    		if (is_algo == true && is_remediation != true) {
    			if (originalseq2) {
    				var seq = originalseq2[i];
    				data.originalseq = seq;
    				item.value = item.value.split("%%")[seq];
    			} else {
    				item.value = randomChoice(item.value.split("%%"));
    			}
    		}

    		let img_src = item.value.substr(1).split("##")[0].split("%%")[0]; // For alt implementating with ##

    		let img_alt = item.value.substr(1).split("##")[1]
    		? item.value.substr(1).split("##")[1]
    		: "";

    		setList2 = `<span class="serial">${count}.</span>` + (item.value.charAt(0) == "*"
    		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
    		: is_algo == true ? item.value : item.value);

    		return setList2;
    	}

    	function handleReview(mode) {
    		if (mode == "c") {
    			ucMlid.showAllCorrectAns("#" + containerID);
    		} else {
    			ucMlid.showAllAns("#" + containerID);
    		}
    	}

    	const click_handler = () => ucMlid.showCorrect("#" + containerID);

    	const keyup_handler = e => {
    		if (e.keyCode == 13) ucMlid.showCorrect("#" + containerID);
    	};

    	const click_handler_1 = () => ucMlid.showAll("#" + containerID);

    	const keyup_handler_1 = e => {
    		if (e.keyCode == 13) ucMlid.showAll("#" + containerID);
    	};

    	const click_handler_2 = () => ucMlid.showYour("#" + containerID);

    	const keyup_handler_2 = e => {
    		if (e.keyCode == 13) ucMlid.showYour("#" + containerID);
    	};

    	const click_handler_3 = () => {
    		$$invalidate(10, state.dropDialog = false, state);
    	};

    	function dialog_visible_binding(value) {
    		state.dropDialog = value;
    		$$invalidate(10, state);
    	}

    	$$self.$$set = $$props => {
    		if ("showAns" in $$props) $$invalidate(18, showAns = $$props.showAns);
    		if ("cmed" in $$props) $$invalidate(19, cmed = $$props.cmed);
    		if ("xml" in $$props) $$invalidate(20, xml = $$props.xml);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("uxml" in $$props) $$invalidate(21, uxml = $$props.uxml);
    		if ("editorState" in $$props) $$invalidate(1, editorState = $$props.editorState);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isReview, ucMlid, multimatch, containerID*/ 549 | $$self.$$.dirty[1] & /*isShuffeled*/ 1) {
    			 {
    				if (isReview == true) {
    					console.log("review mode");

    					// for displaying the ans
    					displayAns();

    					AH$1.select("#shuffleArea", "hide");
    					ucMlid.modeOn("on");

    					// if mode is normal or swap list
    					if (multimatch == 1 || multimatch == 0) {
    						AH$1.select(".both-ans").click();

    						//AH.find("#"+containerID , "#sm_controller", {action: "addClass", actionData: "h"});
    						AH$1.select("#" + containerID + " #sm_controller", "addClass", "h");

    						//AH.find("#"+containerID, "#sm_controller_default", {action: 'removeClass', actionData: 'h'});
    						AH$1.select("#" + containerID + " #sm_controller_default", "removeClass", "h");

    						//AH.find("#"+containerID, "#sm_controller_default", "css", {display:'inline-block'});
    						AH$1.select("#" + containerID + " #sm_controller_default", "css", { display: "inline-block" });
    					} else {
    						// if mode is drag & drop
    						//jQuery("#"+containerID).find("#sm_controller_default").addClass("h");
    						AH$1.select("#" + containerID + " " + "#sm_controller_default", "addClass", "h");

    						//jQuery("#"+containerID).find("#sm_controller").removeClass("h");
    						AH$1.select("#" + containerID + " " + "#sm_controller", "removeClass", "h");

    						setTimeout(
    							function () {
    								document.getElementsByClassName("your-ans")[0].click();
    							},
    							500
    						);
    					}
    				} else {
    					// if remdiation mode is off
    					$$invalidate(0, isReview = false);

    					//jQuery("#"+containerID).find("#sm_controller_default").css("display", "none");
    					AH$1.select("#" + containerID + " " + "#sm_controller_default", "css", { display: "none" });

    					if (isShuffeled == true) {
    						AH$1.select("#shuffleArea", "css", { display: "none" });
    					} else {
    						AH$1.select("#shuffleArea", "css", { display: "block" });
    					}

    					// set the user ans in the module 
    					ucMlid.modeOn();
    				}
    			}
    		}
    	};

    	return [
    		isReview,
    		editorState,
    		ucMlid,
    		listheading1,
    		listheading2,
    		multimatch,
    		list1,
    		list2,
    		totalCorrectAns,
    		containerID,
    		state,
    		alphabet,
    		setReview,
    		unsetReview,
    		shuffleItems,
    		setList1Html,
    		setList2Html,
    		handleReview,
    		showAns,
    		cmed,
    		xml,
    		uxml,
    		click_handler,
    		keyup_handler,
    		click_handler_1,
    		keyup_handler_1,
    		click_handler_2,
    		keyup_handler_2,
    		click_handler_3,
    		dialog_visible_binding
    	];
    }

    class MatchListPreview extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1$2.getElementById("svelte-bi3u6x-style")) add_css$4();

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				showAns: 18,
    				cmed: 19,
    				xml: 20,
    				isReview: 0,
    				uxml: 21,
    				editorState: 1
    			},
    			[-1, -1]
    		);
    	}
    }

    const defXMl = '';

    const app = new MatchListPreview({
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
//# sourceMappingURL=bundle_q14.js.map
