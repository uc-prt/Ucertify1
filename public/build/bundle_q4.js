
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
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
    function tick() {
        schedule_update();
        return resolved_promise;
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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
                        <button type="button" class="btn-close close" style="margin-top: -3px;" data-bs-dismiss="alert" data-dismiss="alert"  aria-label="Close"></button>
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

    const JS$1 = new JUI();
    class hotspotScript {
        constructor() {
            this.userAnsXML="<SMANS></SMANS>";
            this.xaxis=[];
            this.yaxis=[];
            this.count=0;
            this.drawstr = ""; 
            this.elemId = '#hptmain0';
            this.labBinded = true;
            this.result = false;
            this.temp = 0;
        }
        // for initiallization the module
        readyThis(hid, review, type, correctans) {
            hid = '#'+hid;
            if (!review) {
                this.labBinded = true;
                const textClickListen = function(event){
                    if (this.labBinded) {
                        let _this  = event, getVal = '';
                        if (_this.classList.contains('selected')) {	
                            _this.setAttribute('data-userans', 0);
                            _this.classList.remove('selected');
                        } else {
                            _this.setAttribute('data-userans',1);
                            _this.classList.add('selected');
                        }
                        JS$1.find(hid, '[type] .textClick.selected', 'all').forEach(function(v,i) {
                            if (i==0)
                                getVal = v.textContent;
                            else
                                getVal = getVal + '|' + v.textContent;
                        });
                        JS$1.find(hid, '[type]', {action: 'attr', actionData: {"data-userans": getVal} });
                    }
                }; 
                const textSeelctListen = function(e) {
                    if (this.labBinded) {
                        let getVal='';
                        if (e.target?.nodeName == "SPAN") {
                            JS$1.select(e.target, 'removeClass',['selecttext', 'selected']);
                            this.removespan(e.target,hid,0);
                        } else {
                            this.highlightText(hid);				
                        }
                        JS$1.find(hid, '[type] .selecttext.selected', 'all').forEach(function(v,i) {
                            if (i == 0) getVal = v.textContent;
                            else getVal = getVal + '|' + v.textContent;
                        });
                        let found = JS$1.find(hid, '[type]');
                        JS$1.select(found, 'attr', {"data-userhtml": found.innerHTML, "data-userans": getVal});
                    } 
                };
                JS$1.listen(hid, 'touchstart', '.textClick', textClickListen.bind(this));
                JS$1.listen(hid, 'touchend', '.textClick', textClickListen.bind(this));
                JS$1.listen(hid, 'click', '.textClick', textClickListen.bind(this));
                JS$1.listen(hid, 'touchstart', '[type="textselect"]', textSeelctListen.bind(this));	
                JS$1.listen(hid, 'touchend', '[type="textselect"]', textSeelctListen.bind(this));
                JS$1.listen(hid, 'click', '[type="textselect"]', textSeelctListen.bind(this));
            }

        }

        // for checking answer in case of textclick and textselect and also create the user ans on the basis of it and return true if answer is correct
        check_Ans(hid) {
            let userAnswers = "";
            let inNativeIsCorrect = false;
            let sendDataToNative = {
                inNativeIsCorrect: inNativeIsCorrect,
                userAnswers: userAnswers,
            }; 
            this.userAnsXML = "<smans type='4'>\\n";
            this.result = true;
            this.temp = 0;
            let selector = JS$1.select(hid).children;
            for (let i = 0; i < selector.length; i++) {
                this.userAnsXML = this.checkChildAnswer(hid, selector[i], this.userAnsXML);
            }
            // JS.select(hid).children.forEach((_elm)=>{
            //     this.userAnsXML = this.checkChildAnswer(hid, _elm, this.userAnsXML);
            // });
            this.userAnsXML += "</smans>";
            window.ISSPECIALMODULEUSERXMLCHANGE = 1;
           // JS.select("#special_module_user_xml").value = (userAnsXML);
            sendDataToNative.userAnswers = JS$1.select("#special_module_user_xml").value;
            if(typeof calculatePoint != "undefined")
            {
                calculatePoint(JS$1.select(hid).getAttribute('totalcorrectans'), temp);
            }
            if (window.inNative) {
                window.getHeight?.();
                sendDataToNative.inNativeIsCorrect = this.result;
                window.postMessage(JSON.stringify(sendDataToNative), '*');
            }
            return {uXml: this.userAnsXML, status: this.result};
        }

        // checking child answer and return useransxml
        checkChildAnswer(hid, pElem, userAnsXML) {
            let _this = pElem.getAttribute('type');
            switch(_this) {
                case "textclick"  :
                case "textselect" : {
                    var ansKey  = pElem.getAttribute('data-correctans').split('|').sort().join('|');
                    var userKey = pElem.getAttribute('data-userans').split('|').sort();
                    userKey 	= userKey.filter(function(e){ return e });
                    userKey     = userKey.join('|');
                    if (ansKey != userKey) {
                        this.result = false;
                    }
                    if (typeof calculatePoint != "undefined") {
                        // let data = JSON.parse(pElem.children);
                        
                        // let data = Object.values(pElem.children);
                        // console.log(data); 
                        JS$1.find(pElem,'p','all').forEach((_elm)=> {
                            if (_elm.classList.contains('selected') && _elm.getAttribute("data-userans") == _elm.getAttribute("data-correctans")) {
                                this.temp++;
                            }
                        });
                    }
                    if (_this =='textselect') {
                        this.userAnsXML += `<div id="${pElem.getAttribute('id')}" data-userHtml="${escape(pElem.getAttribute('data-userhtml'))}" data-userAns="${escape(pElem.getAttribute('data-userans'))}"></div>\\n`;
                    } else {
                        this.userAnsXML += `<div id="${pElem.getAttribute('id')}" data-userAns="${escape(pElem.getAttribute('data-userans'))}"></div>\\n`;
                    }
                    break;
                }
            }
            return this.userAnsXML;
        }

        // for showing the answer
        showansdrag(hid, ansType, review) {
            if (typeof review === "undefined") review = 0;
            let selector = JS$1.select(hid).children;
            if (selector) {
                for (let i = 0; i < selector.length; i++) {
                    this.showchilddragans(hid, selector[i], ansType, review);
                }
            }
            // JS.select(hid).children?.forEach?.((_elm)=> {
            //     this.showchilddragans(hid, _elm, ansType, review);
            // });
        }

        // for showing the answer of child element
        showchilddragans(hid, pElem, ansType, review) {
            let hidNode = JS$1.select(pElem);
            let typ = hidNode.getAttribute('type');
            switch (typ) {
                case "textclick": {
                    if (ansType == 'c') {	
                        if (JS$1.find(hidNode, '.show_correct,.show_incorrect', 'all').length > 0) {
                            JS$1.find(hidNode, '.show_correct,.show_incorrect', {action: 'removeClass', actionData: ['show_correct', 'show_incorrect'] });
                            JS$1.find(hidNode, '.correct_incorrect_icon', {action: 'remove'});
                            JS$1.find(hidNode, '.correct_incorrect_icon', {action: 'removeAttr', actionData: 'style'});
                        }
                        let ansKey = pElem.getAttribute('data-correctans').split('|');
                        var type   = pElem.getAttribute('type');
                        ansKey.forEach((value)=> {			
                            this.selectText(hid, value, ansType, 'selected');
                        });
                    } else if (ansType == 'u') {	
                        let type = pElem.getAttribute('type');
                        try {
                            var userans = decodeURIComponent(pElem.getAttribute('data-userans'));
                        } catch(err) {
                            var userans = decodeURIComponent(unescape(pElem.getAttribute('data-userans')));
                        }
                        userans = userans.split('|');
                        userans = userans.filter(function(e){return e});
                        if ((typeof review != "undefined" && review == 1)) {
                            JS$1.find(hid, '.selected', {action: 'removeClass', actionData: 'selected'});
                            var ansKey  = pElem.getAttribute('data-correctans').split('|');
                            userans.forEach((value)=> {
                                let classname='show_incorrect';
                                if (JS$1.findInArray(value, ansKey)) {
                                    classname = 'show_correct';					
                                    this.selectText(hid, value, ansType, classname);				
                                } else {
                                    this.selectText(hid, value, ansType, classname);
                                }
                            });
                        } else {
                            userans.forEach((value)=> {			
                                this.selectText(hid,value,'c','selected');
                                if (JS$1.select(hid+" p span").length) {
                                    JS$1.select(hid+" p span").remove();
                                }
                                JS$1.select(".textClick", 'removeClass',['show_incorrect', 'show_correct']);
                            });		
                        }
                    }
                }
                break;
                case "textselect"  : {
                    if (ansType == 'c') {
                        if (JS$1.find(hidNode, '.show_correct,.show_incorrect').length > 0) {
                            JS$1.find(hidNode, '.show_correct,.show_incorrect', {action: 'removeClass', actionData: ['show_correct', 'show_incorrect']});
                            JS$1.find(hidNode, '.correct_incorrect_icon', {action: 'removeAttr', actionData: 'style'});
                        }
                        var ansKey = pElem.getAttribute('data-correctans').split('|');
                        var type = pElem.getAttribute('type');
                        JS$1.select(pElem, 'html', pElem.getAttribute('data-correcthtml').replace(/<span>/g,"</span>") );
                    } else if (ansType == 'u') {	
                        var type = pElem.getAttribute('type');
                        try {
                            var userans = decodeURIComponent(pElem.getAttribute('data-userans'));
                        } catch(err) {
                            var userans = decodeURIComponent(unescape(pElem.getAttribute('data-userans')));
                        }
                        userans = userans.split('|');
                        userans = userans.filter(function(e){return e});
                        if (pElem.getAttribute('data-userhtml') != "" || pElem.getAttribute('data-userhtml') == "undefined") {
                            var _htmlContent = pElem.getAttribute('data-userhtml');
                            try {
                                _htmlContent = decodeURIComponent(_htmlContent );
                                var decodedHtmlContent = decodeURIComponent(_htmlContent );
                            } catch(err) {
                                console.log(err); 
                            } 
                            JS$1.select(pElem, 'html', decodedHtmlContent);

                        }
                        if ((typeof review != "undefined" && review == 1)) {
                            let text_indicator_html = '<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;vertical-align:super;">';
                            let text_indicator_html1 = '<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold red" style="vertical-align: super;">';
                            JS$1.insert(pElem.querySelector('span[userans="1"]span[correctans="1"]'), '<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:17px;background:white;border-radius:12px;font-size: 18px;"> '  + text_indicator_html + '</span></span>', 'beforeend');
                            JS$1.insert(pElem.querySelector('span[userans="1"]span[correctans="0"]'), '<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:17px;background:white;border-radius:12px;font-size: 18px;"> '  + text_indicator_html1 + '</span></span>', 'beforeend');	
                        }
                    }
                    break;
                }
                case "imagehighlight": {
                    let el = JS$1.find(hid, 'canvas');
                    let getAns = JS$1.select('#special_module_parse').value;
                    let cans = getAns.substring(getAns.indexOf('{'),getAns.lastIndexOf('}')+1);
                    if ( cans != '') cans = JSON.parse(cans); 
                    this.drawOnCanvas(el, cans, window.color);
                    if (ansType == 'c') { 
                        let pts = el.getAttribute('correctans');
                        if ( pts != '') pts = JSON.parse(pts);
                        this.drawOnCanvas(el, pts, 'green');
                    }
                    break;
                } 
            } 
        }

        calculateArea(hid, xaxis, yaxis) {
            let hotareaTop    = Math.min.apply(Math, yaxis),
                hotareaLeft   = Math.min.apply(Math, xaxis),
                hotareaWidth  = Math.max.apply(Math, xaxis) - Math.min.apply(Math, xaxis),
                hotareaHeight = Math.max.apply(Math, yaxis) - Math.min.apply(Math, yaxis);
            return {
                top: hotareaTop,
                left: hotareaLeft,
                width: hotareaWidth,
                height: hotareaHeight
            }
        }

        // function is responsible for getting the value and create the user ans on the basis of it in case of imagehighlight
        getCoordinate(hid, xaxis, yaxis, count){
            if (count == 0){
                this.drawstr = "{\"" + (++count) + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
            } else {
                this.drawstr = JS$1.select('#special_module_parse').value;
                this.drawstr = this.drawstr.substring(this.drawstr.indexOf('{'), this.drawstr.lastIndexOf('}')+1);
                this.drawstr = this.drawstr.slice(0, -1);
                //for adding the next draw point
                this.drawstr += ",\"" + (++count) + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
            }
            JS$1.selectAll(JS$1.select(hid).children, 'attr', {'userans': this.drawstr });
            // for user ans
            this.createUserAnsXMLDraw(this.drawstr);
            return this.userAnsXML;
        }

        update_HTMLValue(){
            let xmlDom 		= JS$1.parseHtml(JS$1.select("#special_module_xml").value);
            let bgimg = "", path = "";
            if( xmlDom) {
                for (let _attr of xmlDom.attributes) {
                    switch(na_attr.nameme){
                        case "bgimg":
                            bgimg = _attr.value;
                            break;
                        case "path":
                            path  = _attr.value;
                            break;
                    }
                }
            }
            let element = JS$1.children(xmlDom, 'div');
            let top1 	= element.getAttribute("top");
            let left 	= element.getAttribute("left");
            let width 	= element.getAttribute("width");
            let height 	= element.getAttribute("height");
            JS$1.select('#area', 'css', {height: height, top: top1, width: width, left: left});
            if (bgimg && path) JS$1.select('#im', 'attr', {src: path + "/" + bgimg});
        }

        // runs in cas of spot an image and create the user ans xml
        movetarget(tObj, hObj, e) {
            let scoreFlag;
            //let targettop,targetleft;
            tObj.style.display = '';
            if ((!window.event) && (e.layerX)) {
                tObj.style.top = e.layerY - (tObj.height /2) + "px";
                tObj.style.left = e.layerX - (tObj.width /2) + "px" ;
            } else {
                tObj.style.top = e.offsetY - (tObj.height /2) + "px" ;
                tObj.style.left = e.offsetX - (tObj.width /2) + "px" ;
            }
            // checking answer
            scoreFlag = this.checkmodule(tObj, hObj);

            // creating user ans xml
            this.createUserAnsXML(tObj.style.top, tObj.style.left);
            let obj = document.getElementById("special_module_user_xml");
            obj.value = this.userAnsXML;
            obj = document.getElementById("answer");
            if (scoreFlag>0) {
                obj.checked=true;
            } else {
                obj.checked=false;
            }
            if (typeof calculatePoint != "undefined") {
                this.temp = (scoreFlag == 1) ? true : false;
                calculatePoint(1, scoreFlag);
            }
        }

        // user ans xml in case of imagehighlight
        createUserAnsXMLDraw(userAns) {
            this.userAnsXML = '<SMANS type="4"><div userans="'+userAns+'"></div></SMANS>';
        }

        createUserAnsXML(targetTop,targetLeft) {
            this.userAnsXML = '<SMANS type="4"><div targetTop="'+parseInt(targetTop)+'" targetLeft="'+parseInt(targetLeft)+'" /></SMANS>';
        }

        // functions runs in case of the spot an image  module it check the user point is in between the correct answer or not and return 1 if userans is correct
        checkmodule(tObj,hObj) {
            let yourScore=0;
            if (((parseInt(tObj.style.top) + (tObj.height /2) ) >= (parseInt(hObj.style.top))) && ((parseInt(tObj.style.top)  + (tObj.height /2) ) <= (parseInt(hObj.style.top) + parseInt(hObj.style.height)))) {
                if (((parseInt(tObj.style.left) + (tObj.width /2)) >= (parseInt(hObj.style.left))) && ((parseInt(tObj.style.left) + (tObj.width /2) ) <= (parseInt(hObj.style.left) + parseInt(hObj.style.width)))) {
                    yourScore=1;
                }
            }
            return yourScore;
        }

        // for drawing n the canvas on the basis of the coordinates
        drawOnCanvas(el,cord,color) {   // checking for if elemnt is exist or not 
            if (el) {
                // getting the element reference
                let c = (el.toString().indexOf('d') != 0) ? document.getElementById(el.getAttribute('id')) : document.getElementById(el);
                // initilaising the getContext Method if c is not null
                let ctx = (c != null) ? c.getContext("2d") : '';

                // getting length of the keys available in the object
                let len = Object.keys(cord).length;

                // drawing on the canvas
                if (cord!='' && ctx!='') {
                    //let cal = [];
                    for (let i = 1; i <= len ; i++) {
                        for (let j = 0; j <= cord[i]['x'].length; j++) {
                            ctx.beginPath();              
                            ctx.lineWidth   = "4";
                            ctx.strokeStyle = color;
                            ctx.moveTo(cord[i]['x'][j], cord[i]['y'][j]);
                            ctx.lineTo(cord[i]['x'][j+1], cord[i]['y'][j+1]);
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        // for comparing answer in case of draw highlight
        compareDrawing(uans,cans,hid) {
            let scoreFlag=0;
            let uval  = this.getAreaVal(uans),
                cval  = this.getAreaVal(cans),
                cflag = 0, temp  = 0,
                clen  = Object.keys(cval).length,
                ulen  = Object.keys(uval).length;
            for (let i = 1; i <= clen; i++) {
               // msg = 'INCorrect Drawn';
                for(let j = 1; j <= ulen; j++) {
                    if(uval[j]['height'] <= cval[i]['height'] && uval[j]['width'] <= cval[i]['width'] ) {
                        if(uval[j]['top'] >= cval[i]['top'] && (cval[i]['left'] + cval[i]['width']) - (uval[j]['left'] + uval[j]['width']) >=0) {
                            if(uval[j]['left'] >= cval[i]['left'] && (cval[i]['top'] + cval[i]['height']) - (uval[j]['top'] + uval[j]['height']) >=0) {
                                cflag++;
                                break;
                            }
                        }
                    }
                }
                if (typeof calculatePoint != "undefined") {
                    if (i == cflag) temp++;
                    calculatePoint(JS$1.select(hid).getAttribute('totalcorrectans'), temp);
                }
            }
            if (clen == cflag && clen==ulen) {
                //msg ='Correct Drawn';
                scoreFlag =1;	
            } 
            return scoreFlag;
        }

        // for getting area val
        getAreaVal(coordinate) {
            let len = Object.keys(coordinate).length;
            if (coordinate!='') {
                let cordval = [];
                for (let i = 1; i <= len ; i++) {
                    cordval[i]= this.calculateArea('',coordinate[i]['x'],coordinate[i]['y']);
                }
                return cordval;
            }
        }

        // for the selection of text
        selectText(hid, value, ansType, classname) {
            let selector = JS$1.selectAll(hid+' p');
            for (var i=0; i < selector.length; i++ ) {
                let _elm = selector[i];
                if (_elm.textContent.trim() == value) {
                    _elm.classList.add(classname);
                    if(ansType=='u') {
                        let text_indicator_html;
                        if (classname=='show_correct'){
                            text_indicator_html = '<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;vertical-align:7px">';					
                        } else {
                            text_indicator_html = '<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold red" style="vertical-align:7px">';					
                        }
                        JS$1.insert(_elm, '<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:16px;background:white;border-radius:12px;font-size: 18px;"> '  + text_indicator_html + '</span></span>');
                    }
                }	
            }
        }

        // for highlighting the text
        highlightText(hid) {
            if (this.getSelected().getRangeAt(0).endOffset != 0) {
                this.snapSelectionToWord();
                let selectionRange = this.getSelected().getRangeAt(0),
                    start = selectionRange.startOffset,
                    ans   = JS$1.find(hid, '[type]').getAttribute('data-correctans').split('|');
                    var selection = selectionRange.toString();
                    selection = selection.trim();
                if (selection) {
                    let cans   = JS$1.findInArray(selection,ans) ? 1 : 0 ;
                    this.pasteHtmlAtCaret("<span class='selecttext selected' correctans="+cans+" userans='1'>"+selection+"</span> ");   
                }
            }
        }

        // for getting selection text
        snapSelectionToWord() {
            let sel;
            // Check for existence of window.getSelection() and that it has a
            // modify() method. IE 9 has both selection APIs but no modify() method.
            if (window.getSelection && (sel == window.getSelection()).modify) {
                sel = window.getSelection();
                if (sel != '' && !sel.isCollapsed) {
                    // Detect if selection is backwards
                    var range = document.createRange();
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    var backwards = range.collapsed;
                    range.detach();

                    // modify() works on the focus of the selection
                    var endNode = sel.focusNode, endOffset = sel.focusOffset;
                    sel.collapse(sel.anchorNode, sel.anchorOffset);
                    if (backwards) {
                        if(JS$1.findInArray(sel.anchorNode.textContent.charAt(sel.anchorOffset-1),[",",".","!","?",";",")","}"])) { 
                            sel.modify("move", "backward", "character");
                            sel.modify("move", "forward", "word");
                        }
                        sel.extend(endNode, endOffset);
                        sel.modify("extend", "forward", "character");
                        sel.modify("extend", "backward", "word");
                    } else {
                        sel.modify("move", "forward", "character");
                        sel.modify("move", "backward", "word");
                        sel.extend(endNode, endOffset);
                        if(JS$1.findInArray(sel.anchorNode.textContent.charAt(endOffset-1),[",",".","!","?",";",")","}"])) { 
                            sel.modify("extend", "backward", "character");
                            sel.modify("extend", "forward", "word");
                        }
                    } 
                }
            } else if ( (sel == document.selection) && sel.type != "Control") {
                let textRange = sel.createRange();
                if (textRange.text) {
                    textRange.expand("word");
                    // Move the end back to not include the word's trailing space(s), if neccessary
                    while (/\s$/.test(textRange.text)) {
                        textRange.moveEnd("character", -1);
                    }
                    textRange.select();
                } 
            }
        }

        // for pasting the html at caret position
        pasteHtmlAtCaret(html) {
            let sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    // Range.createContextualFragment() would be useful here but is
                    // only relatively recently standardized and is not supported in
                    // some browsers (IE9, for one)
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } 
                }
            } else if (document.selection && document.selection.type != "Control") {
                // IE < 9
                document.selection.createRange().pasteHTML(html);
            }
        }

        // for getting seletion
        getSelected() {
            if (window.getSelection) {
                return window.getSelection();
            } else if(document.getSelection) {
                return document.getSelection();
            } else {
                var selection = document.selection && document.selection.createRange();
                if (selection.text) { return selection.text; }
                return false;
            }
        }

        // for removing span element
        removespan(span, hid, review) {
            let span_contents = span.innerHTML;
            let regex = new RegExp('<\\/?span[^>]*>', 'g');
            span_contents = span_contents.replace(regex, "");
            span.parentNode.replaceChild(document.createTextNode(span_contents), span);
            if (!review) JS$1.find(hid, '[type]', {action: 'html', actionData: JS$1.find(hid, '[type]').innerHTML });
        }

        /* ajax based code */
        modeOnHot(modeType) {
            JS$1.selectAll('.test, .review', 'addClass', 'h');
            if (modeType) {
                JS$1.selectAll('.review', 'removeClass', 'h');
                this.unBindLab();
                this.showansdrag(this.elemId, 'u', 1);
            } else {
                JS$1.selectAll('.test', 'removeClass', 'h');
                JS$1.selectAll('.review', 'addClass', 'h');
                this.bindLab();
                this.showansdrag(this.elemId, 'u', 0);
            }
        }

        // for unbinding lab
        unBindLab() {
            this.labBinded = false;
            JS$1.find(this.elemId, '.hotArea0.hotArea', {action: 'css', actionData: {display: 'block'} });
            JS$1.find(this.elemId, '.hotSpotImg', {action: 'css', actionData: {pointerEvents: 'none'} });
        }

        // for binding the lab
        bindLab() {
            this.labBinded = true;
            JS$1.find(this.elemId, '.hotArea0.hotArea', {action: 'css', actionData: {display: 'none'} });
            JS$1.find(this.elemId, '.hotSpotImg', {action: 'css', actionData: {pointerEvents: 'auto'} });
        }

        /* ajax based code */
    }

    function Point(a, b) {
        if (true === isNaN(Number(a))) {
            this.x = 0;
        } else {
            this.x = a;
        }
        if (true === isNaN(Number(b))) {
            this.y = 0;
        } else {
            this.y = b;
        }
        return {
            "X": this.x,
            "Y": this.y
        };
    }
    const JS$2 = new JUI();
    class DooScribPlugin {
    	constructor(options) {
    		this.prevPoint = undefined;
    		this.defaultOptions = {
    			target: "",
    			penSize:1,
    			width: options.width,
    			height: options.height,
    			cssClass: '',
    			onClick: (e)=> {},
    			onMove: (e)=> {},
    			onPaint: (e)=> {},
    			onRelease: (e)=> {}
    		};
    		this.penWidth = 2;
    		this.drawing = false;
    		this.cap = 'round';
    		this.ID = 'dooScribCanvas' + Math.floor((Math.random()*100) + 1);
    		this.drawingSurface = "";
    		if (options) this.Settings = {...this.defaultOptions, ...options};
    		if (true === isNaN(this.Settings.height)) {
    			this.Settings.height = 100;
    		}
    		if (true === isNaN(this.Settings.width)){
    			this.Settings.width = 100;
    		}

    		this.init();
    	}

    	init() {
    		let _this = this.Settings.target;
    		if (_this) {
    			if (_this.getAttribute('id') == "hptmain0")  JS$2.empty(_this);
    			JS$2.insert(_this, `<canvas id='${this.ID}' tabindex='0' class='relative ${this.Settings.cssClass}' type='${this.Settings.type}' correctans='${this.Settings.correctans}' userans=''  height='${this.Settings.height}' width='${this.Settings.width}'></canvas>`, 'beforeend');
    		    this.penSize(this.Settings.penSize);
    		    this.drawingSurface = document.getElementById(this.ID).getContext('2d');
    		    this.drawingSurface.lineWidth = this.penSize();
    		    this.drawingSurface.lineCap = this.cap;
    		    if (false === this.hasTouch()) {
    		        document.getElementById(this.ID).addEventListener('mousedown', this.clickDown.bind(this), true);
    		        document.getElementById(this.ID).addEventListener('mousemove', this.moved.bind(this), true);
    		        document.getElementById(this.ID).addEventListener('mouseup', this.clickUp.bind(this), true);
    		    }
    		    else {
    		        document.getElementById(this.ID).addEventListener('touchstart', this.clickDown.bind(this), true);
    		        document.getElementById(this.ID).addEventListener('touchmove', this.moved.bind(this), true);
    		        document.getElementById(this.ID).addEventListener('touchend', this.clickUp.bind(this), true);
    		    }
    		} else {
    			console.error("Target not defined");
    		}
    	}

    	normalizeTouch(e) {
    		if (true === this.hasTouch()) {
    			let st = window.scrollY;
    			if (['touchstart', 'touchmove'].indexOf(e.type) > -1) {
    				e.clientX = e.targetTouches[0].pageX;
    				e.clientY = e.targetTouches[0].pageY - st;
    			}
    			if (['touchend'].indexOf(e.type) > -1) {
    				e.clientX = e.changedTouches[0].pageX;
    				e.clientY = e.changedTouches[0].pageY - st;
    			   }
    		}
    		return e;
    	}

    	clickDown(e) {
    		if (true === this.isDrawing()) {
    			return;
    		}
    		if (!e) {
    			e = window.event;
    		}
    		if (true === this.hasTouch()) {
    			e.preventDefault();
    			e = this.normalizeTouch(e);
    		}
    		let offset = JS$2.offset(this.Settings.target);
    		let st = window.scrollY;
    		let pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
    		this.prevPoint = pt;
    		this.drawing = true;
    		this.Settings.onClick(pt);
    		return false;
    	}
    	
    	moved(e) {
    		if (!e) {
    			e = window.event;
    		}
    		if (true === this.hasTouch()) {
    			e.preventDefault();
    			e = this.normalizeTouch(e);
    		}
    		var offset = JS$2.offset(this.Settings.target);
    		var st = window.scrollY;
    		var pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
    		if (true === this.isDrawing()) {
    			this.drawLine(this.prevPoint.X, this.prevPoint.Y, pt.X, pt.Y);
    			this.prevPoint = pt;
    			this.Settings.onPaint(pt);
    		}
    		else {
    			this.Settings.onMove(pt);
    		}
    		return false;
    	}
    	
    	clickUp(e) {
    		if (false === this.isDrawing()) {
    			return;
    		}
    		if (true === this.hasTouch()) {
    			e.preventDefault();
    			e = this.normalizeTouch(e);
    		}
    		let offset = JS$2.offset(this.Settings.target);
    		let st = window.scrollY;
    		let pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
    		this.Settings.onRelease(pt);		    
    		this.drawing = false;

    		return false;			
    	}

    	hasTouch() {
    		return 'ontouchstart' in window;
    	}

    	penSize (e) {
    		if (undefined !== e){
    			if (false === isNaN(Number(e))) {
    				this.penWidth = e;
    			}
    		}
    		return this.penWidth;
    	}

    	isDrawing () {
    		if (this.Settings.editable)
    			return this.drawing;
    	}

    	lineCap(e) {
    		if (undefined !== e) {
    			switch(e){
    				case 'butt':
    				case 'round':
    				case 'square':
    					this.cap = e;
    					break; 
    			}
    		}
    		return this.cap;
    	}

    	//window.color = "#000000";
    	lineColor(e) {
    		if(undefined !== e) {
    			let a = JS$2.parseHtml("<div id='stub' style='backgroundColor:white'></div>");
    			a.style.backgroundColor = e;
    			let b = a.style.backgroundColor;
    			if ((undefined !== b) && ('' !== b)) {
    				window.color = e;
    			}
    		}
    		return window.color;
    	}

    	context() {
    		return this.drawingSurface;
    	}

    	clearSurface() {
    		let width = JS$2.find(document, 'canvas').getAttribute('width').replace('px','');
    		let height = JS$2.find(document, 'canvas').getAttribute('height').replace('px','');
    		this.drawingSurface.clearRect(0, 0,width,height);
    	}
    	
    	drawLine(fromX, fromY, toX, toY) {
    		if ((undefined !== fromX) && (undefined !== fromY) && (undefined !== toX) && (undefined !== toY)) {
    			if((false === isNaN(Number(fromX))) && (false === isNaN(Number(fromY))) && (false === isNaN(Number(toX))) && (false === isNaN(Number(toY)))) {
    				this.drawingSurface.lineCap = this.cap;	    
    				this.drawingSurface.strokeStyle = window.color;		
    				this.drawingSurface.lineWidth = this.penWidth;
    				this.drawingSurface.beginPath();				    
    				this.drawingSurface.moveTo(fromX, fromY);					
    				this.drawingSurface.lineTo(toX, toY);
    				this.drawingSurface.stroke();
    			}
    		}
    	}
    }

    class X2JS {
    	config = {};
    	VERSION = "1.2.0";

    	DOMNodeTypes = {
    		ELEMENT_NODE 	   : 1,
    		TEXT_NODE    	   : 3,
    		CDATA_SECTION_NODE : 4,
    		COMMENT_NODE	   : 8,
    		DOCUMENT_NODE 	   : 9
    	}
    	constructor() {
    		this.initConfigDefaults();
    		this.initRequiredPolyfills();
    	}
    	initConfigDefaults() {
    		if(this.config.escapeMode === undefined) {
    			this.config.escapeMode = true;
    		}
    		
    		this.config.attributePrefix = this.config.attributePrefix || "_";
    		this.config.arrayAccessForm = this.config.arrayAccessForm || "none";
    		this.config.emptyNodeForm = this.config.emptyNodeForm || "text";		
    		
    		if(this.config.enableToStringFunc === undefined) {
    			this.config.enableToStringFunc = true; 
    		}
    		this.config.arrayAccessFormPaths = this.config.arrayAccessFormPaths || []; 
    		if(this.config.skipEmptyTextNodesForObj === undefined) {
    			this.config.skipEmptyTextNodesForObj = true;
    		}
    		if(this.config.stripWhitespaces === undefined) {
    			this.config.stripWhitespaces = true;
    		}
    		this.config.datetimeAccessFormPaths = this.config.datetimeAccessFormPaths || [];

    		if(this.config.useDoubleQuotes === undefined) {
    			this.config.useDoubleQuotes = false;
    		}
    		
    		this.config.xmlElementsFilter = this.config.xmlElementsFilter || [];
    		this.config.jsonPropertiesFilter = this.config.jsonPropertiesFilter || [];
    		
    		if(this.config.keepCData === undefined) {
    			this.config.keepCData = false;
    		}
    	}

        initRequiredPolyfills() {		
    	}

    	getNodeLocalName( node ) {
    		var nodeLocalName = node.localName;			
    		if(nodeLocalName == null) // Yeah, this is IE!! 
    			nodeLocalName = node.baseName;
    		if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
    			nodeLocalName = node.nodeName;
    		return nodeLocalName;
    	}
    	
    	getNodePrefix(node) {
    		return node.prefix;
    	}
    		
    	escapeXmlChars(str) {
    		if(typeof(str) == "string")
    			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    		else
    			return str;
    	}

    	unescapeXmlChars(str) {
    		return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    	}
    	
    	checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
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
    	
    	toArrayAccessForm(obj, childName, path) {
    		switch(this.config.arrayAccessForm) {
    			case "property":
    				if(!(obj[childName] instanceof Array))
    					obj[childName+"_asArray"] = [obj[childName]];
    				else
    					obj[childName+"_asArray"] = obj[childName];
    				break;
    			/*case "none":
    				break;*/
    		}
    		
    		if(!(obj[childName] instanceof Array) && this.config.arrayAccessFormPaths.length > 0) {
    			if(this.checkInStdFiltersArrayForm(this.config.arrayAccessFormPaths, obj, childName, path)) {
    				obj[childName] = [obj[childName]];
    			}			
    		}
    	}
    	
    	fromXmlDateTime(prop) {
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
    	
    	checkFromXmlDateTimePaths(value, childName, fullPath) {
    		if(this.config.datetimeAccessFormPaths.length > 0) {
    			var path = fullPath.split("\.#")[0];
    			if(this.checkInStdFiltersArrayForm(this.config.datetimeAccessFormPaths, value, childName, path)) {
    				return this.fromXmlDateTime(value);
    			}
    			else
    				return value;			
    		}
    		else
    			return value;
    	}
    	
    	checkXmlElementsFilter(obj, childType, childName, childPath) {
    		if( childType == this.DOMNodeTypes.ELEMENT_NODE && this.config.xmlElementsFilter.length > 0) {
    			return this.checkInStdFiltersArrayForm(this.config.xmlElementsFilter, obj, childName, childPath);	
    		}
    		else
    			return true;
    	}	

    	parseDOMChildren( node, path ) {
    		if(node.nodeType == this.DOMNodeTypes.DOCUMENT_NODE) {
    			var result = new Object;
    			var nodeChildren = node.childNodes;
    			// Alternative for firstElementChild which is not supported in some environments
    			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    				var child = nodeChildren.item(cidx);
    				if(child.nodeType == this.DOMNodeTypes.ELEMENT_NODE) {
    					var childName = this.getNodeLocalName(child);
    					result[childName] = this.parseDOMChildren(child, childName);
    				}
    			}
    			return result;
    		}
    		else
    		if(node.nodeType == this.DOMNodeTypes.ELEMENT_NODE) {
    			var result = new Object;
    			result.__cnt=0;
    			
    			var nodeChildren = node.childNodes;
    			
    			// Children nodes
    			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    				var child = nodeChildren.item(cidx); // nodeChildren[cidx];
    				var childName = this.getNodeLocalName(child);
    				
    				if(child.nodeType!= this.DOMNodeTypes.COMMENT_NODE) {
    					var childPath = path+"."+childName;
    					if (this.checkXmlElementsFilter(result,child.nodeType,childName,childPath)) {
    						result.__cnt++;
    						if(result[childName] == null) {
    							result[childName] = this.parseDOMChildren(child, childPath);
    							this.toArrayAccessForm(result, childName, childPath);					
    						}
    						else {
    							if(result[childName] != null) {
    								if( !(result[childName] instanceof Array)) {
    									result[childName] = [result[childName]];
    									this.toArrayAccessForm(result, childName, childPath);
    								}
    							}
    							(result[childName])[result[childName].length] = this.parseDOMChildren(child, childPath);
    						}
    					}
    				}								
    			}
    			
    			// Attributes
    			for(var aidx=0; aidx <node.attributes.length; aidx++) {
    				var attr = node.attributes.item(aidx); // [aidx];
    				result.__cnt++;
    				result[this.config.attributePrefix+attr.name]=attr.value;
    			}
    			
    			// Node namespace prefix
    			var nodePrefix = this.getNodePrefix(node);
    			if(nodePrefix!=null && nodePrefix!="") {
    				result.__cnt++;
    				result.__prefix=nodePrefix;
    			}
    			
    			if(result["#text"]!=null) {				
    				result.__text = result["#text"];
    				if(result.__text instanceof Array) {
    					result.__text = result.__text.join("\n");
    				}
    				//if(this.config.escapeMode)
    				//	result.__text = this.unescapeXmlChars(result.__text);
    				if(this.config.stripWhitespaces)
    					result.__text = result.__text.trim();
    				delete result["#text"];
    				if(this.config.arrayAccessForm=="property")
    					delete result["#text_asArray"];
    				result.__text = this.checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
    			}
    			if(result["#cdata-section"]!=null) {
    				result.__cdata = result["#cdata-section"];
    				delete result["#cdata-section"];
    				if(this.config.arrayAccessForm=="property")
    					delete result["#cdata-section_asArray"];
    			}
    			
    			if( result.__cnt == 0 && this.config.emptyNodeForm=="text" ) {
    				result = '';
    			}
    			else
    			if( result.__cnt == 1 && result.__text!=null  ) {
    				result = result.__text;
    			}
    			else
    			if( result.__cnt == 1 && result.__cdata!=null && !this.config.keepCData  ) {
    				result = result.__cdata;
    			}			
    			else			
    			if ( result.__cnt > 1 && result.__text!=null && this.config.skipEmptyTextNodesForObj) {
    				if( (this.config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
    					delete result.__text;
    				}
    			}
    			delete result.__cnt;			
    			
    			if( this.config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
    				result.toString = function() {
    					return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
    				};
    			}
    			
    			return result;
    		}
    		else
    		if(node.nodeType == this.DOMNodeTypes.TEXT_NODE || node.nodeType == this.DOMNodeTypes.CDATA_SECTION_NODE) {
    			return node.nodeValue;
    		}	
    	}
    	
    	startTag(jsonObj, element, attrList, closed) {
    		var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
    		if(attrList!=null) {
    			for(var aidx = 0; aidx < attrList.length; aidx++) {
    				var attrName = attrList[aidx];
    				var attrVal = jsonObj[attrName];
    				if(this.config.escapeMode)
    					attrVal=this.escapeXmlChars(attrVal);
    				resultStr+=" "+attrName.substr(this.config.attributePrefix.length)+"=";
    				if(this.config.useDoubleQuotes)
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
    	
    	endTag(jsonObj,elementName) {
    		return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
    	}
    	
    	endsWith(str, suffix) {
    		return str.indexOf(suffix, str.length - suffix.length) !== -1;
    	}
    	
    	jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
    		if((this.config.arrayAccessForm=="property" && this.endsWith(jsonObjField.toString(),("_asArray"))) 
    				|| jsonObjField.toString().indexOf(this.config.attributePrefix)==0 
    				|| jsonObjField.toString().indexOf("__")==0
    				|| (jsonObj[jsonObjField] instanceof Function) )
    			return true;
    		else
    			return false;
    	}
    	
    	jsonXmlElemCount ( jsonObj ) {
    		var elementsCnt = 0;
    		if(jsonObj instanceof Object ) {
    			for( var it in jsonObj  ) {
    				if(this.jsonXmlSpecialElem ( jsonObj, it) )
    					continue;			
    				elementsCnt++;
    			}
    		}
    		return elementsCnt;
    	}
    	
    	checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
    		return this.config.jsonPropertiesFilter.length == 0
    			|| jsonObjPath==""
    			|| this.checkInStdFiltersArrayForm(this.config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);	
    	}
    	
    	parseJSONAttributes ( jsonObj ) {
    		var attrList = [];
    		if(jsonObj instanceof Object ) {
    			for( var ait in jsonObj  ) {
    				if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(this.config.attributePrefix)==0) {
    					attrList.push(ait);
    				}
    			}
    		}
    		return attrList;
    	}
    	
    	parseJSONTextAttrs ( jsonTxtObj ) {
    		var result ="";
    		
    		if(jsonTxtObj.__cdata!=null) {										
    			result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
    		}
    		
    		if(jsonTxtObj.__text!=null) {			
    			if(this.config.escapeMode)
    				result+=this.escapeXmlChars(jsonTxtObj.__text);
    			else
    				result+=jsonTxtObj.__text;
    		}
    		return result;
    	}
    	
    	parseJSONTextObject ( jsonTxtObj ) {
    		var result ="";

    		if( jsonTxtObj instanceof Object ) {
    			result+=this.parseJSONTextAttrs ( jsonTxtObj );
    		}
    		else
    			if(jsonTxtObj!=null) {
    				if(this.config.escapeMode)
    					result+=this.escapeXmlChars(jsonTxtObj);
    				else
    					result+=jsonTxtObj;
    			}
    		
    		return result;
    	}
    	
    	getJsonPropertyPath(jsonObjPath, jsonPropName) {
    		if (jsonObjPath==="") {
    			return jsonPropName;
    		}
    		else
    			return jsonObjPath+"."+jsonPropName;
    	}
    	
    	parseJSONArray ( jsonArrRoot, jsonArrObj, attrList, jsonObjPath ) {
    		var result = ""; 
    		if(jsonArrRoot.length == 0) {
    			result+=this.startTag(jsonArrRoot, jsonArrObj, attrList, true);
    		}
    		else {
    			for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
    				result+=this.startTag(jsonArrRoot[arIdx], jsonArrObj, this.parseJSONAttributes(jsonArrRoot[arIdx]), false);
    				result+=this.parseJSONObject(jsonArrRoot[arIdx], this.getJsonPropertyPath(jsonObjPath,jsonArrObj));
    				result+=this.endTag(jsonArrRoot[arIdx],jsonArrObj);
    			}
    		}
    		return result;
    	}
    	
    	parseJSONObject ( jsonObj, jsonObjPath ) {
    		var result = "";	

    		var elementsCnt = this.jsonXmlElemCount ( jsonObj );
    		
    		if(elementsCnt > 0) {
    			for( var it in jsonObj ) {
    				
    				if(this.jsonXmlSpecialElem ( jsonObj, it) || (jsonObjPath!="" && !this.checkJsonObjPropertiesFilter(jsonObj, it, this.getJsonPropertyPath(jsonObjPath,it))) )
    					continue;			
    				
    				var subObj = jsonObj[it];						
    				
    				var attrList = this.parseJSONAttributes( subObj );
    				
    				if(subObj == null || subObj == undefined) {
    					result+=this.startTag(subObj, it, attrList, true);
    				}
    				else
    				if(subObj instanceof Object) {
    					
    					if(subObj instanceof Array) {					
    						result+=this.parseJSONArray( subObj, it, attrList, jsonObjPath );					
    					}
    					else if(subObj instanceof Date) {
    						result+=this.startTag(subObj, it, attrList, false);
    						result+=subObj.toISOString();
    						result+=this.endTag(subObj,it);
    					}
    					else {
    						var subObjElementsCnt = this.jsonXmlElemCount ( subObj );
    						if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
    							result+=this.startTag(subObj, it, attrList, false);
    							result+=this.parseJSONObject(subObj, this.getJsonPropertyPath(jsonObjPath,it));
    							result+=this.endTag(subObj,it);
    						}
    						else {
    							result+=this.startTag(subObj, it, attrList, true);
    						}
    					}
    				}
    				else {
    					result+=this.startTag(subObj, it, attrList, false);
    					result+=this.parseJSONTextObject(subObj);
    					result+=this.endTag(subObj,it);
    				}
    			}
    		}
    		result+=this.parseJSONTextObject(jsonObj);
    		
    		return result;
    	}
    	
    	parseXmlString (xmlDocStr) {
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
    	
    	asArray (prop) {
    		if (prop === undefined || prop == null)
    			return [];
    		else
    		if(prop instanceof Array)
    			return prop;
    		else
    			return [prop];
    	};
    	
    	toXmlDateTime (dt) {
    		if(dt instanceof Date)
    			return dt.toISOString();
    		else
    		if(typeof(dt) === 'number' )
    			return new Date(dt).toISOString();
    		else	
    			return null;
    	};
    	
    	asDateTime (prop) {
    		if(typeof(prop) == "string") {
    			return this.fromXmlDateTime(prop);
    		}
    		else
    			return prop;
    	};

    	xml2json (xmlDoc) {
    		return this.parseDOMChildren ( xmlDoc );
    	};
    	
    	xml_str2json (xmlDocStr) {
    		var xmlDoc = this.parseXmlString(xmlDocStr);
    		if(xmlDoc!=null)
    			return this.xml2json(xmlDoc);
    		else
    			return null;
    	};

    	json2xml_str (jsonObj) {
    		return this.parseJSONObject ( jsonObj, "" );
    	};

    	json2xml (jsonObj) {
    		var xmlDocStr = this.json2xml_str (jsonObj);
    		return this.parseXmlString(xmlDocStr);
    	};
    	
    	getVersion () {
    		return this.VERSION;
    	}
    }

    /* helper/HelperAI.svelte generated by Svelte v3.34.0 */

    function XMLToJSON$1(myXml) {
    	//var myXml = xml;
    	myXml = myXml.replace(/<\!--\[CDATA\[/g, "<![CDATA[").replace(/\]\]-->/g, "]]>");

    	let x2js = new X2JS({ useDoubleQuotes: true });
    	let newXml = JSON.stringify(x2js.xml_str2json(myXml));
    	newXml = newXml.replace("SMXML", "smxml");
    	newXml = JSON.parse(newXml);
    	return newXml;
    }

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

    /* helper/ItemHelper.svelte generated by Svelte v3.34.0 */

    const { console: console_1, document: document_1 } = globals;
    const file = "helper/ItemHelper.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-ri6gyf-style";
    	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUhlbHBlci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBOENZLGdFQUFnRSxBQUFFLENBQUEsQUFDdEUsS0FBSyxDQUFFLElBQUksVUFBVSxDQUNyQixrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQ25ELFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQzNDLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxDQUNuQyxZQUFZLENBQUUsT0FBTyxVQUFVLENBQy9CLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxBQUN2QyxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkl0ZW1IZWxwZXIuc3ZlbHRlIl19 */";
    	append_dev(document_1.head, style);
    }

    // (39:0) {#if reviewMode || customReviewMode}
    function create_if_block(ctx) {
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
    			attr_dev(button0, "class", "btn btn-light correct-ans svelte_items_test");
    			add_location(button0, file, 40, 8, 1550);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "mode", "u");
    			attr_dev(button1, "class", "btn btn-light your-ans active svelte_items_test");
    			add_location(button1, file, 41, 8, 1705);
    			attr_dev(div, "class", "smControlerBtn btn-group mb-3");
    			attr_dev(div, "role", "group");
    			attr_dev(div, "aria-label", "Answer buttons");
    			add_location(div, file, 39, 4, 1457);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleSmClick*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*handleSmClick*/ ctx[3], false, false, false)
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(39:0) {#if reviewMode || customReviewMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let center;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = (/*reviewMode*/ ctx[0] || /*customReviewMode*/ ctx[1]) && create_if_block(ctx);

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
    			attr_dev(button0, "class", "h h-imp svelte_items_test");
    			attr_dev(button0, "id", "set-review");
    			add_location(button0, file, 36, 0, 1144);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp svelte_items_test");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file, 37, 0, 1278);
    			add_location(center, file, 35, 0, 1135);
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
    					listen_dev(button0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*reviewMode*/ ctx[0] || /*customReviewMode*/ ctx[1]) {
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			if (if_block) if_block.d();
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
    	validate_slots("ItemHelper", slots, []);
    	let { reviewMode = false } = $$props;
    	let { handleReviewClick } = $$props;
    	let { customReviewMode } = $$props;
    	console.log("customReviewMode", customReviewMode);

    	AH.listen("body", "keydown", ".smControlerBtn .correct-ans", function (_this, e) {
    		if (e.which === 13) {
    			_this.click();
    		}
    	});

    	AH.listen("body", "keydown", ".smControlerBtn .your-ans", function (_this, e) {
    		if (e.which === 13) {
    			_this.click();
    		}
    	});

    	const dispatch = createEventDispatcher();

    	function handleSmClick(event) {
    		document.querySelectorAll(".smControlerBtn button").forEach(el => el.classList.remove("active"));
    		event.target.classList.add("active");
    		if (handleReviewClick) handleReviewClick(event.target.getAttribute("mode"), event);
    	}

    	const writable_props = ["reviewMode", "handleReviewClick", "customReviewMode"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ItemHelper> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("setReview");
    	const click_handler_1 = () => dispatch("unsetReview");

    	$$self.$$set = $$props => {
    		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ("handleReviewClick" in $$props) $$invalidate(4, handleReviewClick = $$props.handleReviewClick);
    		if ("customReviewMode" in $$props) $$invalidate(1, customReviewMode = $$props.customReviewMode);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		AH,
    		reviewMode,
    		handleReviewClick,
    		customReviewMode,
    		dispatch,
    		handleSmClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ("handleReviewClick" in $$props) $$invalidate(4, handleReviewClick = $$props.handleReviewClick);
    		if ("customReviewMode" in $$props) $$invalidate(1, customReviewMode = $$props.customReviewMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		reviewMode,
    		customReviewMode,
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
    		if (!document_1.getElementById("svelte-ri6gyf-style")) add_css();

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			reviewMode: 0,
    			handleReviewClick: 4,
    			customReviewMode: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemHelper",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleReviewClick*/ ctx[4] === undefined && !("handleReviewClick" in props)) {
    			console_1.warn("<ItemHelper> was created without expected prop 'handleReviewClick'");
    		}

    		if (/*customReviewMode*/ ctx[1] === undefined && !("customReviewMode" in props)) {
    			console_1.warn("<ItemHelper> was created without expected prop 'customReviewMode'");
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

    	get customReviewMode() {
    		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customReviewMode(value) {
    		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMHotspot/libs/util.svelte generated by Svelte v3.34.0 */

    function checkmodule(targetData, pointer_size) {
    	let yourScore = 0;
    	let ansDivHeight = targetData.ans_top + targetData.ans_h;
    	let ansDivWidth = targetData.ans_left + targetData.ans_w;

    	if (targetData.top + pointer_size > targetData.ans_top && targetData.top + parseInt(pointer_size / 2) < ansDivHeight && targetData.left + pointer_size > targetData.ans_left && targetData.left + parseInt(pointer_size / 2) < ansDivWidth) {
    		yourScore = 1;
    	}

    	return yourScore;
    }

    function createUserAnsXML(targetTop, targetLeft) {
    	return "<SMANS type=\"4\"><div targetTop=\"" + parseInt(targetTop) + "\" targetLeft=\"" + parseInt(targetLeft) + "\" /></SMANS>";
    }

    function movetarget(e, ans_h, ans_w, ans_left, ans_top) {
    	// let tObj = document.getElementById('target')[0];
    	// let hObj = document.getElementById('hotArea')[0];
    	let pointer_size = 13;

    	let scoreFlag;

    	//let targetData;
    	let targetData = {
    		x: e.layerX,
    		y: e.layerY,
    		top: 0,
    		left: 0,
    		uXml: "",
    		ans: false,
    		ans_h,
    		ans_w,
    		ans_left,
    		ans_top
    	};

    	if (e.which != 13) {
    		if (e.layerX && e.layerY) {
    			targetData.top = e.layerY - pointer_size;
    			targetData.left = e.layerX - pointer_size;
    		} else {
    			targetData.top = e.offsetY - pointer_size;
    			targetData.left = e.offsetX - pointer_size;
    		}
    	} else {
    		targetData.top = 20 - pointer_size;
    		targetData.left = 20 - pointer_size;
    	}

    	// checking answer
    	scoreFlag = checkmodule(targetData, pointer_size);

    	// creating user ans xml
    	targetData.uXml = createUserAnsXML(targetData.top, targetData.left);

    	if (typeof calculatePoint != "undefined") {
    		temp = scoreFlag == 1 ? 1 : 0;
    		calculatePoint(1, temp);
    	}

    	if (scoreFlag > 0) {
    		targetData.ans = true;
    	} else {
    		targetData.ans = false;
    	}

    	return targetData;
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

    var css_248z = "#hptmain .drag-resize{position:absolute;left:90px;top:50px;border:none;z-index:8;text-align:center;font-size:0;line-height:20px;background-color:rgba(244,255,71,.6)!important;box-shadow:0 0 1px #000 inset;cursor:move}.tools{position:absolute;right:5px;z-index:101}.tools .labs-btn{padding:2px 5px}.drag-resize .tools{top:-28px;right:-3px}.elemActive{background:rgba(244,255,71,.6)!important;opacity:1!important}#option-toolbar{margin-bottom:0}.controls{list-style:none;margin:0;padding:0}.controls li{display:inline;padding:11px;float:left;font-size:13px}.controls li:hover,.selected-option{cursor:pointer;background-color:#ccc!important}#hotspot{width:700px;padding:4px;border-top-right-radius:10px;border-top-left-radius:10px;text-align:left;background-color:#ccc}.hotspotTxt{background:#fff;word-wrap:break-word;padding:1em;min-height:180px;text-align:left;overflow-y:scroll;border:1px solid #ccc;font-family:\"open sans\",Helvetica,Arial,\"Times New Roman\",sans-serif;font-size:14px}.hotspotTxt p{float:left;margin-bottom:3px}.textClick{border:1px solid transparent;padding:2px 0;margin-right:2px;cursor:pointer;border-radius:2px;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none}.selecttext.selected,.textClick.selected,.textClick.selected:hover{background-color:#ff9;border:1px solid #8a7300;border-radius:2px}.textClick:hover{background-color:#fcfcd3;border-color:#8a7300}.show_correct{background-color:#e7f4e1!important;border-color:#62ae41!important}.show_incorrect{border-color:#da1919!important;background-color:#fbdddd!important}.selecttext{border:1px solid transparent;padding:3px 0;margin-right:2px;position:relative;margin-left:-1px;margin-right:-1px;border-radius:2px}.drawSurface{cursor:crosshair}.h{display:none}.textClick.selected:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #000;outline:0}.red{color:red}#hptmain0 tr td{border:0!important}";
    styleInject(css_248z);

    /* clsSMHotspot/HotspotPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1, console: console_1$1, document: document_1$1 } = globals;
    const file$1 = "clsSMHotspot/HotspotPreview.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-11usv4u-style";
    	style.textContent = "main.svelte-11usv4u{text-align:center !important;padding:1em;max-width:240px;margin:0 auto;font-size:26px}.targetImg.svelte-11usv4u{display:none;position:absolute;z-index:10;width:17px;height:15px;border-radius:50%;background:#fff;color:#1c3ad4}.showBlock.svelte-11usv4u{display:block}@media(min-width: 640px){main.svelte-11usv4u{max-width:none}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFByZXZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQWdzQkMsSUFBSSxlQUFDLENBQUEsQUFDSixVQUFVLENBQUUsTUFBTSxDQUFDLFVBQVUsQ0FDN0IsT0FBTyxDQUFFLEdBQUcsQ0FDWixTQUFTLENBQUUsS0FBSyxDQUNoQixNQUFNLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FDZCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ0EsVUFBVSxlQUFDLENBQUEsQUFDVixPQUFPLENBQUcsSUFBSSxDQUNkLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxFQUFFLENBQ1gsS0FBSyxDQUFFLElBQUksQ0FDWCxPQUFPLElBQUksQ0FDWCxhQUFhLENBQUUsR0FBRyxDQUNsQixVQUFVLENBQUUsSUFBSSxDQUNoQixLQUFLLENBQUUsT0FBTyxBQUNmLENBQUMsQUFFRCxVQUFVLGVBQUMsQ0FBQSxBQUNWLE9BQU8sQ0FBRyxLQUFLLEFBQ2hCLENBQUEsQUFFQSxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFBLEFBQ3pCLElBQUksZUFBQyxDQUFBLEFBQ0osU0FBUyxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQUNELENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiSG90c3BvdFByZXZpZXcuc3ZlbHRlIl19 */";
    	append_dev(document_1$1.head, style);
    }

    // (689:3) {:else}
    function create_else_block(ctx) {
    	let html_tag;
    	let raw_value = /*loadModule*/ ctx[24](/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*item_type*/ 32768 && raw_value !== (raw_value = /*loadModule*/ ctx[24](/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]]) + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(689:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (681:42) 
    function create_if_block_3(ctx) {
    	let itemhelper;
    	let t;
    	let html_tag;
    	let raw_value = /*loadModule*/ ctx[24](/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]]) + "";
    	let html_anchor;
    	let current;

    	itemhelper = new ItemHelper({
    			props: {
    				handleReviewClick: /*handleReview*/ ctx[25],
    				reviewMode: /*isReview*/ ctx[0]
    			},
    			$$inline: true
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[22]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[23]);

    	const block = {
    		c: function create() {
    			create_component(itemhelper.$$.fragment);
    			t = space();
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemhelper, target, anchor);
    			insert_dev(target, t, anchor);
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);
    			if ((!current || dirty[0] & /*item_type*/ 32768) && raw_value !== (raw_value = /*loadModule*/ ctx[24](/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]]) + "")) html_tag.p(raw_value);
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
    			destroy_component(itemhelper, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(681:42) ",
    		ctx
    	});

    	return block;
    }

    // (643:41) 
    function create_if_block_1(ctx) {
    	let center;
    	let div1;
    	let div0;
    	let span0;
    	let t0;
    	let span1;
    	let t2;
    	let div2;
    	let div2_dd_value;
    	let t3;
    	let if_block = /*scrollEnabled*/ ctx[17] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			center = element("center");
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			span1.textContent = "Reset";
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "icomoon-new-24px-reset-1 s3");
    			set_style(span0, "vertical-align", "text-top");
    			add_location(span0, file$1, 656, 7, 21090);
    			attr_dev(span1, "class", "position-relative bottom1");
    			add_location(span1, file$1, 657, 7, 21181);
    			attr_dev(div0, "id", "reset");
    			set_style(div0, "height", "27px");
    			set_style(div0, "width", "90px");
    			set_style(div0, "top", "2px");
    			attr_dev(div0, "class", "reset btn btn-outline-primary position-relative btn-sm mt-sm2 mr-sm2 float-end");
    			add_location(div0, file$1, 652, 6, 20912);
    			set_style(div1, "height", "34px");

    			set_style(div1, "width", window.inNative
    			? window.innerWidth
    			: /*state*/ ctx[3].imgwidth);

    			set_style(div1, "background", "#d9e7fd");
    			set_style(div1, "border-top", "2px solid #96bbf6");
    			add_location(div1, file$1, 644, 5, 20711);
    			attr_dev(div2, "id", "hptmain0");
    			attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[1]);
    			attr_dev(div2, "dd", div2_dd_value = /*state*/ ctx[3].imgwidth);
    			set_style(div2, "width", /*state*/ ctx[3].imgwidth || "250px");
    			set_style(div2, "height", /*state*/ ctx[3].imgheight || "600px");
    			set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[19] + /*img_url*/ ctx[14]) + "')");
    			set_style(div2, "background-repeat", "no-repeat");
    			set_style(div2, "position", "relative");
    			set_style(div2, "border", "2px solid #d9e7fd");
    			add_location(div2, file$1, 660, 5, 21264);
    			attr_dev(center, "key", "imageHeight_3");
    			add_location(center, file$1, 643, 4, 20677);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t0);
    			append_dev(div0, span1);
    			append_dev(center, t2);
    			append_dev(center, div2);
    			append_dev(center, t3);
    			if (if_block) if_block.m(center, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 8) {
    				set_style(div1, "width", window.inNative
    				? window.innerWidth
    				: /*state*/ ctx[3].imgwidth);
    			}

    			if (dirty[0] & /*totalCorrectAns*/ 2) {
    				attr_dev(div2, "totalcorrectans", /*totalCorrectAns*/ ctx[1]);
    			}

    			if (dirty[0] & /*state*/ 8 && div2_dd_value !== (div2_dd_value = /*state*/ ctx[3].imgwidth)) {
    				attr_dev(div2, "dd", div2_dd_value);
    			}

    			if (dirty[0] & /*state*/ 8) {
    				set_style(div2, "width", /*state*/ ctx[3].imgwidth || "250px");
    			}

    			if (dirty[0] & /*state*/ 8) {
    				set_style(div2, "height", /*state*/ ctx[3].imgheight || "600px");
    			}

    			if (dirty[0] & /*img_url*/ 16384) {
    				set_style(div2, "background-image", "url('" + (/*bgImgPath*/ ctx[19] + /*img_url*/ ctx[14]) + "')");
    			}

    			if (/*scrollEnabled*/ ctx[17]) {
    				if (if_block) ; else {
    					if_block = create_if_block_2(ctx);
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(643:41) ",
    		ctx
    	});

    	return block;
    }

    // (586:3) {#if moduleArr[item_type] == "4"}
    function create_if_block$1(ctx) {
    	let table;
    	let tbody;
    	let tr;
    	let td;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let div0_style_value;
    	let t2;
    	let span;
    	let span_style_value;
    	let div1_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tbody = element("tbody");
    			tr = element("tr");
    			td = element("td");
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(" ");
    			t2 = space();
    			span = element("span");
    			attr_dev(img, "id", "im0");
    			attr_dev(img, "tabindex", "0");
    			set_style(img, "max-width", "none");
    			set_style(img, "width", /*state*/ ctx[3].imgwidth);
    			set_style(img, "height", /*state*/ ctx[3].imgheight);
    			attr_dev(img, "class", "hotSpotImg");
    			if (img.src !== (img_src_value = /*bgImgPath*/ ctx[19] + /*img_url*/ ctx[14])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			add_location(img, file$1, 604, 10, 19653);
    			attr_dev(div0, "id", "hotArea");
    			attr_dev(div0, "class", "hotArea hotArea hotAreaPreview");

    			attr_dev(div0, "style", div0_style_value = `
												display: ${/*targetView*/ ctx[11]};
												left:${/*itemAreaLeft*/ ctx[10]};
												top:${/*itemAreaTop*/ ctx[7]};
												height:${/*itemAreaHeight*/ ctx[8]};
												width:${/*itemAreaWidth*/ ctx[9]};
											`);

    			add_location(div0, file$1, 613, 10, 19939);
    			attr_dev(span, "id", "target");
    			attr_dev(span, "class", "target targetImg icomoon-plus-circle-2 svelte-11usv4u");

    			attr_dev(span, "style", span_style_value = `
												left:${/*ans_x*/ ctx[12]}px;
												top:${/*ans_y*/ ctx[13]}px;
											`);

    			toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[6]);
    			add_location(span, file$1, 626, 10, 20290);
    			attr_dev(div1, "id", "SM0");
    			attr_dev(div1, "class", "SM position-relative m-0 p-0");

    			attr_dev(div1, "style", div1_style_value = `
											position: relative;
											margin: 0px;
											padding: 0px;
											width: 100%;
											height: 100%;
											border: ${/*itemBorder*/ ctx[4]
			? /*itemBorder*/ ctx[4] + "px solid"
			: ""};
											border-color: ${/*itemBorderColor*/ ctx[5]};
										`);

    			add_location(div1, file$1, 591, 9, 19283);
    			attr_dev(div2, "id", "SM0");
    			attr_dev(div2, "class", "relative");
    			add_location(div2, file$1, 590, 8, 19242);
    			attr_dev(td, "class", "border");
    			add_location(td, file$1, 589, 7, 19214);
    			add_location(tr, file$1, 588, 6, 19202);
    			add_location(tbody, file$1, 587, 5, 19188);
    			attr_dev(table, "id", "hptmain0");
    			attr_dev(table, "class", "smbase smhotspot border-0 h-auto w-auto uc-table");
    			add_location(table, file$1, 586, 4, 19104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);
    			append_dev(tbody, tr);
    			append_dev(tr, td);
    			append_dev(td, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, span);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*checkAnswer*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 8) {
    				set_style(img, "width", /*state*/ ctx[3].imgwidth);
    			}

    			if (dirty[0] & /*state*/ 8) {
    				set_style(img, "height", /*state*/ ctx[3].imgheight);
    			}

    			if (dirty[0] & /*img_url*/ 16384 && img.src !== (img_src_value = /*bgImgPath*/ ctx[19] + /*img_url*/ ctx[14])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*alt*/ 4) {
    				attr_dev(img, "alt", /*alt*/ ctx[2]);
    			}

    			if (dirty[0] & /*targetView, itemAreaLeft, itemAreaTop, itemAreaHeight, itemAreaWidth*/ 3968 && div0_style_value !== (div0_style_value = `
												display: ${/*targetView*/ ctx[11]};
												left:${/*itemAreaLeft*/ ctx[10]};
												top:${/*itemAreaTop*/ ctx[7]};
												height:${/*itemAreaHeight*/ ctx[8]};
												width:${/*itemAreaWidth*/ ctx[9]};
											`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty[0] & /*ans_x, ans_y*/ 12288 && span_style_value !== (span_style_value = `
												left:${/*ans_x*/ ctx[12]}px;
												top:${/*ans_y*/ ctx[13]}px;
											`)) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (dirty[0] & /*isUxmlTarget*/ 64) {
    				toggle_class(span, "showBlock", /*isUxmlTarget*/ ctx[6]);
    			}

    			if (dirty[0] & /*itemBorder, itemBorderColor*/ 48 && div1_style_value !== (div1_style_value = `
											position: relative;
											margin: 0px;
											padding: 0px;
											width: 100%;
											height: 100%;
											border: ${/*itemBorder*/ ctx[4]
			? /*itemBorder*/ ctx[4] + "px solid"
			: ""};
											border-color: ${/*itemBorderColor*/ ctx[5]};
										`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(586:3) {#if moduleArr[item_type] == \\\"4\\\"}",
    		ctx
    	});

    	return block;
    }

    // (674:5) {#if scrollEnabled}
    function create_if_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "position-fixed index0");
    			set_style(div, "right", "0");
    			set_style(div, "top", "0");
    			set_style(div, "left", "0");
    			set_style(div, "bottom", "0");
    			set_style(div, "background", "rgba(0,0,0,0.4)");
    			add_location(div, file$1, 674, 6, 21666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(674:5) {#if scrollEnabled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let center;
    	let itemhelper;
    	let t0;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let input;
    	let current;

    	itemhelper = new ItemHelper({
    			props: {
    				customReviewMode: /*customIsReview*/ ctx[18]
    			},
    			$$inline: true
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[22]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[23]);
    	const if_block_creators = [create_if_block$1, create_if_block_1, create_if_block_3, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]] == "4") return 0;
    		if (/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]] == "3") return 1;
    		if (/*moduleArr*/ ctx[20][/*item_type*/ ctx[15]] == "1") return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			center = element("center");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			div = element("div");
    			if_block.c();
    			t1 = space();
    			input = element("input");
    			attr_dev(div, "id", "previewArea");
    			attr_dev(div, "class", "relative");
    			add_location(div, file$1, 583, 2, 18970);
    			add_location(center, file$1, 577, 1, 18838);
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "id", "special_module_parse");
    			attr_dev(input, "name", "special_module_parse");
    			attr_dev(input, "userans", "");
    			input.value = /*userCorrect*/ ctx[16];
    			add_location(input, file$1, 693, 1, 22155);
    			attr_dev(main, "class", "svelte-11usv4u");
    			add_location(main, file$1, 576, 0, 18830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, center);
    			mount_component(itemhelper, center, null);
    			append_dev(center, t0);
    			append_dev(center, div);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(main, t1);
    			append_dev(main, input);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    				if_block.m(div, null);
    			}

    			if (!current || dirty[0] & /*userCorrect*/ 65536) {
    				prop_dev(input, "value", /*userCorrect*/ ctx[16]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(itemhelper);
    			if_blocks[current_block_type_index].d();
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

    function onModalTouch(event) {
    	console.log(event);
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HotspotPreview", slots, []);
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { ansStatus } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let { editorState } = $$props;
    	let customIsReview = isReview;
    	const HotJS = new hotspotScript();
    	let parseXml = "";
    	let answerStatus;
    	let ansDisable = 0;
    	let bgImgPath = "//s3.amazonaws.com/jigyaasa_content_static/";
    	let alt = "";

    	let moduleArr = {
    		textclick: "1",
    		textselect: "2",
    		imagehighlight: "3",
    		hotspot: "4"
    	};

    	let state = {};
    	let hdd = writable({ imgwidth: "auto", imgheight: "auto" });
    	let itemBorder = 0;
    	let itemBorderColor = "gray";
    	let isUxmlTarget = false;
    	let itemAreaTop = "";
    	let itemAreaHeight = "";
    	let itemAreaWidth = "";
    	let itemAreaLeft = "";
    	let targetLeft = 100;
    	let targetTop = 100;
    	let targetView = "none";
    	let ans_x = 0;
    	let ans_y = 0;
    	let ans_h = 0;
    	let ans_w = 0;
    	let type = "";
    	let img_url = "";
    	let manual_grade = 0;
    	let onError = null;
    	let item_type = "";
    	let xmlHeight = 0;
    	let xmlWidth = 0;
    	let userCorrect = "";
    	let correctans = "";
    	let totalCorrectAns;
    	let scrollEnabled = false;
    	let linecolor = "black";
    	let drawstr = "";
    	let count = 0;
    	let xaxis = [];
    	let yaxis = [];
    	let divHeight = 0;
    	let divWidth = 0;
    	var typeName = "textclick";
    	var correctAnsStr = "";
    	var correctHtml = "";

    	const unsubscribe = items => {
    		$$invalidate(3, state = items);
    	};

    	onMount(async () => {
    		parseXml = XMLToJSON$1(xml);
    		xmlParser();
    		preRender();
    		HotJS.readyThis("hptmain0", isReview);

    		if (isReview) {
    			HotJS.modeOnHot(1);
    		} else {
    			HotJS.modeOnHot();
    		}

    		AH.listen("#previewArea", "keydown", "#im0", function (_this, e) {
    			console.log("click....");

    			if (e.which === 13) {
    				//movetarget(e,document.getElementById('hptmain0').getElementsByClassName('target')[0],document.getElementById('hptmain0').getElementsByClassName('hotArea')[0]);	
    				//movetarget(e, ans_h, ans_w, parseInt(itemAreaLeft), parseInt(itemAreaTop));
    				checkAnswer(e);
    			}

    			switch (e.which) {
    				case 37:
    					//left arrow key
    					// $(".target0").finish().animate({
    					// 	left: "-=2"
    					// });
    					window.scroll({ left: "-=2", behavior: "smooth" });
    					break;
    				case 38:
    					//up arrow key
    					// $(".target0").finish().animate({
    					// 	top: "-=2"
    					// });
    					window.scroll({ top: "-=2", behavior: "smooth" });
    					break;
    				case 39:
    					//right arrow key
    					// $(".target0").finish().animate({
    					// 	left: "+=2"
    					// });
    					window.scroll({ left: "+=2", behavior: "smooth" });
    					break;
    				case 40:
    					//bottom arrow key
    					// $(".target0").finish().animate({
    					// 	top: "+=2"
    					// });
    					window.scroll({ top: "+=2", behavior: "smooth" });
    					break;
    				case 13:
    					//Press Enter key Set Answer
    					checkAnswer();
    					break;
    			}
    		});

    		AH.listen("#previewArea", "click", ".textClick", function () {
    			checkAnswer();
    		});

    		AH.listen("#previewArea", "click", "[type=\"textselect\"]", function () {
    			checkAnswer();
    		});
    	});

    	function xmlParser() {
    		$$invalidate(15, item_type = parseXml["smxml"]["div"]["_type"]);
    		xmlHeight = parseXml["smxml"]["_height"];
    		xmlWidth = parseXml["smxml"]["_width"];

    		if (item_type == undefined || item_type == "") {
    			$$invalidate(15, item_type = parseXml["smxml"]["_name"].toLowerCase());
    		}

    		typeName = item_type;
    		$$invalidate(14, img_url = parseXml["smxml"]["_bgimg"]);

    		switch (moduleArr[item_type]) {
    			case "1":
    				//getting the width and height
    				divHeight = parseXml.smxml._height + "px";
    				divWidth = parseXml.smxml._width + "px";
    				// for parsing the xml
    				parseTextClick(parseXml.smxml.div.__cdata);
    				AH.select(AH.parent("#textID0"), "show", "block");
    				AH.selectAll("#drawPreview,table[id=\"hptmain2\"]", "hide");
    				break;
    			case "2":
    				// in case of text select module
    				if (!isNaN(parseXml.smxml._height)) {
    					parseXml.smxml._height = parseXml.smxml._height + "px";
    				}
    				divHeight = parseXml.smxml._height;
    				divWidth = parseXml.smxml._width + "px";
    				// for parsing the xml
    				parseTextSelect(parseXml.smxml.div.__cdata);
    				AH.select(AH.parent("#textID0"), "show", "block");
    				AH.selectAll("#drawPreview,table[id=\"hptmain2\"]", "hide");
    				break;
    			case "3":
    				{
    					// In case of image highlight 
    					//bgImg = parseXml.smxml._bgimg;
    					//var image = document.getElementById('hiddenImage');
    					let image = new Image();

    					image.addEventListener(
    						"load",
    						function (event) {
    							$$invalidate(
    								3,
    								state.imgheight = parseXml.smxml._height > this.height
    								? parseXml.smxml._height + "px"
    								: this.height + "px",
    								state
    							);

    							$$invalidate(
    								3,
    								state.imgwidth = parseXml.smxml._width > this.width
    								? parseXml.smxml._width + "px"
    								: this.width + "px",
    								state
    							);

    							AH.find("#hptdraw0", "canvas", {
    								action: "attr",
    								actionData: {
    									height: state.imgheight,
    									width: state.imgwidth
    								}
    							});

    							AH.empty("#textID0");
    							unsetReview();
    						},
    						false
    					);

    					image.setAttribute("src", bgImgPath + parseXml.smxml._bgimg);
    				}
    				//imgUrl = "url('https:" + bgImgPath + parseXml.smxml._bgimg + "')";
    				//this.flagUpdate = false;
    				break;
    			case "4":
    				{
    					// in case of hotspot (spot an image)
    					// setting backgroundImage , alt, width, height, left , top ,border, bordercolor on the basis of xml
    					$$invalidate(14, img_url = parseXml.smxml._bgimg); // used for set the background image of the Draw highlighted module

    					$$invalidate(2, alt = parseXml.smxml._alt);
    					$$invalidate(13, ans_y = parseFloat(parseXml["smxml"]["div"]["_top"]));
    					$$invalidate(12, ans_x = parseFloat(parseXml["smxml"]["div"]["_left"]) + 13);
    					ans_h = parseFloat(parseXml["smxml"]["div"]["_height"]);
    					ans_w = parseFloat(parseXml["smxml"]["div"]["_width"]);
    					$$invalidate(2, alt = parseXml["smxml"]["div"]["_alt"]);
    					type = parseXml["smxml"]["div"]["type"];
    					$$invalidate(4, itemBorder = parseXml.smxml.div._border);
    					$$invalidate(5, itemBorderColor = parseXml.smxml.div._bordercolor);
    					$$invalidate(9, itemAreaWidth = parseXml.smxml.div._width + "px");
    					$$invalidate(8, itemAreaHeight = parseXml.smxml.div._height + "px");
    					$$invalidate(10, itemAreaLeft = parseInt(parseXml.smxml.div._left) + 4 + "px");
    					$$invalidate(7, itemAreaTop = parseInt(parseXml.smxml.div._top) + 2 + "px");
    					let image = new Image();

    					image.onload = function () {
    						let bgImgHeight = this.height + "px";
    						let bgImgWidth = this.width + "px";

    						$$invalidate(
    							3,
    							state.imgheight = parseXml.smxml.div._imgheight
    							? parseXml.smxml.div._imgheight + "px"
    							: "auto !important",
    							state
    						);

    						$$invalidate(
    							3,
    							state.imgwidth = parseXml.smxml.div._imgwidth
    							? parseXml.smxml.div._imgwidth + "px"
    							: "auto !important",
    							state
    						);

    						AH.select("#hptmain0", "css", { height: bgImgHeight, width: bgImgWidth });
    					};

    					image.src = bgImgPath + parseXml.smxml._bgimg;
    				}
    				break;
    		}
    	}

    	function preRender() {
    		if (isReview) {
    			$$invalidate(11, targetView = "block");
    		}

    		var image = new Image();

    		image.onload = function () {
    			if (moduleArr[item_type] == "3") {
    				$$invalidate(
    					3,
    					state.imgheight = parseXml.smxml._height > this.height
    					? parseXml.smxml._height + "px"
    					: this.height + "px",
    					state
    				);

    				$$invalidate(
    					3,
    					state.imgwidth = parseXml.smxml._width > this.width
    					? parseXml.smxml._width + "px"
    					: this.width + "px",
    					state
    				);
    			} else {
    				$$invalidate(
    					3,
    					state.imgheight = parseXml.smxml.div._imgheight
    					? parseXml.smxml.div._imgheight + "px"
    					: "auto !important",
    					state
    				);

    				$$invalidate(
    					3,
    					state.imgwidth = parseXml.smxml.div._imgwidth
    					? parseXml.smxml.div._imgwidth + "px"
    					: "auto !important",
    					state
    				);
    			}
    		};

    		if (img_url) image.src = bgImgPath + img_url;

    		if (uxml) {
    			$$invalidate(16, userCorrect = uxml);
    			let parseUxml = XMLToJSON$1(uxml);

    			if (parseUxml.SMANS && parseUxml.SMANS.div) {
    				$$invalidate(6, isUxmlTarget = true);
    				$$invalidate(12, ans_x = parseUxml.SMANS.div._targetLeft);
    				$$invalidate(13, ans_y = parseUxml.SMANS.div._targetTop);
    			}
    		}
    	}

    	function checkAnswer(event) {
    		let result = {};

    		if (typeName == "textclick" || typeName == "textselect") {
    			result = HotJS.check_Ans("#previewArea #hptmain0");
    		} else {
    			result = movetarget(event, ans_h, ans_w, parseInt(itemAreaLeft), parseInt(itemAreaTop));
    			$$invalidate(6, isUxmlTarget = true);
    			$$invalidate(12, ans_x = result.left);
    			$$invalidate(13, ans_y = result.top);
    			$$invalidate(26, ansStatus = result.ans);
    			$$invalidate(31, answerStatus = ansStatus);
    			if (editorState) showAns(ansStatus ? "Correct" : "Incorrect");
    		}

    		onUserAnsChange(result);
    	}

    	// used in native for toggle
    	function toggleSelectArea() {
    		$$invalidate(17, scrollEnabled = scrollEnabled ? false : true);
    	}

    	// when remediation mode is on
    	function setReview() {
    		$$invalidate(11, targetView = "block");

    		//isDotCreate = false;
    		// if the module is imagehighlight then it draw the correct answer on the module using the function drawOnCanvas
    		if (moduleArr[item_type] == "3") {
    			let el = AH.find("#previewArea", "canvas");
    			let pts = el.getAttribute("correctans");
    			if (pts != "") pts = JSON.parse(pts);
    			HotJS.drawOnCanvas(el, pts, "green");
    		}

    		// called the function unbind lab which basically show the draggable element in preview area if found which is found in case of spot an image
    		HotJS.modeOnHot(1);

    		// check the answer wether the answer is correct or not
    		//checkAnswer();
    		AH.select("#hptmain0", "css", { pointerEvents: "none" });
    	}

    	// when remediation mode is off
    	function unsetReview() {
    		$$invalidate(11, targetView = "none");

    		// if the module is imagehighlight then it hide the correct answer ans show user ans on the module using the function drawOnCanvas
    		if (moduleArr[item_type] == "3") {
    			AH.find("#previewArea", "canvas", { action: "remove" });

    			//imageDraw('#previewArea', 0);
    			var timer = setTimeout(
    				function () {
    					imageDraw("#previewArea", 0);
    					let el = AH.find("#previewArea", "canvas");

    					// getting the value of the user ans
    					let getAns = AH.select("#special_module_parse").value,
    						// getting the user answer coordinates
    						cans = getAns.substring(getAns.indexOf("{"), getAns.lastIndexOf("}") + 1);

    					// parsing it into the JSON element
    					if (cans != "") cans = JSON.parse(cans);

    					// passed the points in the canvas
    					HotJS.drawOnCanvas(el, cans, linecolor);

    					clearTimeout(timer);
    				},
    				500
    			);
    		}

    		// called the function bind lab which basically hide the draggable element in preview area if found which is found in case of spot an image
    		HotJS.modeOnHot();

    		AH.select("#hptmain0", "css", { pointerEvents: "auto" });
    	}

    	// for image draw
    	function imageDraw(hid, review) {
    		let imgObj = AH.find(hid, "#hptmain0");
    		hid = imgObj;

    		// let imgWidth  = imgObj.clientWidth;
    		// let imgHeight = imgObj.clientHeight;
    		let surface = new DooScribPlugin({
    				target: imgObj,
    				width: +state.imgwidth.replace("px", ""),
    				height: +state.imgheight.replace("px", ""),
    				correctans,
    				cssClass: "drawSurface",
    				penSize: 4,
    				type: "imagehighlight",
    				editable: !review ? true : false,
    				onMove() {
    					
    				},
    				onClick() {
    					
    				},
    				onPaint(e) {
    					// storeing the X and Y values
    					xaxis.push(e.X);

    					yaxis.push(e.Y);
    				},
    				onRelease(e) {
    					onReleaseFunc(e, hid, review);
    				}
    			});

    		linecolor = String(xml.match(/linecolor=\"([^\"]+)\"/gm));
    		linecolor = linecolor.substring("11", linecolor.length - 1);

    		//var res = AH.siblings(hid).find((_elm)=> _elm.matches('div') ).getAttribute('id');
    		if (!review) {
    			AH.listen("#previewArea", "click", "#reset", () => {
    				surface.clearSurface();
    				drawstr = "";
    				count = 0;
    				$$invalidate(16, userCorrect = "");
    				AH.selectAll(AH.select(hid).children, "attr", { userans: "" });
    				$$invalidate(31, answerStatus = false);
    			});
    		}

    		window.surface = surface;
    	}

    	// calls in key up / onrelase of mouse
    	function onReleaseFunc(e, hid, review) {
    		let userAnswers = "";
    		let inNativeIsCorrect = false;

    		// check for the review mode is on or off
    		if (!review) {
    			// if review mode is off
    			drawstr = "";

    			// getting the  value of the point 
    			var coor = document.querySelector("#special_module_parse").value;

    			coor = coor.substring(coor.indexOf("{"), coor.lastIndexOf("}") + 1);

    			// getting the coordinates using the getCoordinate function
    			if (coor != "") {
    				coor = Object.keys(JSON.parse(coor)).length;
    				drawstr = HotJS.getCoordinate(hid, xaxis, yaxis, coor);
    			} else {
    				drawstr = HotJS.getCoordinate(hid, xaxis, yaxis, count);
    			}

    			// for getting window height in case of native
    			if (window.inNative) {
    				window.getHeight && window.getHeight();
    			}

    			// for autograding
    			window.ISSPECIALMODULEUSERXMLCHANGE = 1;

    			// puuting the value in the textarea for saving the user ans
    			AH.select("#special_module_user_xml").value = drawstr;

    			$$invalidate(16, userCorrect = drawstr);
    			xaxis = [];
    			yaxis = [];

    			// for getting the correctans
    			let pts = AH.find(hid, "canvas").getAttribute("correctans");

    			// for getting the user ans
    			let cans = AH.find(hid, "canvas").getAttribute("userans");

    			// parsing both the json if they are not empty
    			if (cans != "") cans = JSON.parse(cans);

    			if (pts != "") pts = JSON.parse(pts);

    			// comparing them with the function , it will return 1 if the answer is correct
    			let flag = HotJS.compareDrawing(cans, pts, hid);

    			let message = "Incorrect";

    			// for setting the answer correct if flag > 0
    			if (flag > 0) {
    				inNativeIsCorrect = true;
    				message = "Correct";
    				$$invalidate(3, state.answerType3 = true, state);
    				if (editorState) showAns("Correct");
    			} else {
    				inNativeIsCorrect = false;
    				message = "Incorrect";
    				$$invalidate(3, state.answerType3 = false, state);
    			}

    			if (editorState) showAns(message);
    			userAnswers = AH.select("#special_module_user_xml").value;
    			flag = flag > 0 ? true : false;
    			$$invalidate(31, answerStatus = flag);
    			var result = { "ans": flag, "uXml": userAnswers };
    			onUserAnsChange(result);

    			// @uc-abk: When user drawed canvas within the correct area : flag will 1
    			flag > 0
    			? AH.select("#answer").checked = true
    			: AH.select("#answer").checked = false;

    			if (window.inNative) window.postMessage(JSON.stringify({ inNativeIsCorrect, userAnswers }), "*");
    		}
    	}

    	function parseTextClick(cdata) {
    		var cdataStr = "";

    		// get the correct answer in correctans
    		var correctans = cdata.match(/%{(.*?)}%/gm);

    		if (correctans) {
    			$$invalidate(1, totalCorrectAns = correctans.length);

    			for (var i = 0; i < correctans.length; i++) {
    				// replacing the space with <uc:space> and then replacing the correctans with it
    				correctAnsStr = correctans[i].replace(/\s+/gm, "<uc:space>");

    				cdata = cdata.replace(correctans[i], correctAnsStr);
    			}
    		}

    		correctAnsStr = "";
    		cdata = cdata.split(" ");

    		for (var i = 0; i < cdata.length; i++) {
    			//if the data is correct answer
    			if (cdata[i].match(/%{|%}/gm)) {
    				// for setting the data-correctans 1 if that value is correct
    				cdata[i] = cdata[i].replace(/<uc:space>/gm, " ").replace(/%{|}%/gm, "");

    				cdataStr += "<p class=\"textClick\" data-index=\"" + i + "\" data-userans=\"0\" data-correctans=\"1\">" + cdata[i] + "</p>";
    				correctAnsStr += cdata[i] + "|";
    			} else {
    				// for setting the data-correctans 0 if that value is correct
    				cdataStr += "<p class=\"textClick\" data-index=\"" + i + "\" data-userans=\"0\" data-correctans=\"0\">" + cdata[i] + "</p>";
    			}
    		}

    		correctAnsStr = correctAnsStr.replace(/\|$/gm, "");

    		// showing the text in the preview area 	
    		AH.select(" #previewArea  #textID0").innerHTML = cdataStr;
    	}

    	function parseTextSelect(cdata) {
    		correctAnsStr = "";

    		// store the correct answer in correct ans 
    		var correctans = cdata.match(/%{(.*?)}%/gm);

    		// if exists
    		if (correctans) {
    			// storing it the correct ans in correctAnsStr seperted by | 
    			for (var index_no = 0; index_no < correctans.length; index_no += 1) {
    				correctAnsStr += correctans[index_no].replace(/%{|}%/gm, "") + "|";
    			}

    			// replace the symbol with the span
    			correctHtml = cdata.replace(/%{/gm, "<span class=\"selecttext selected\">").replace(/}%/gm, "<span>");

    			$$invalidate(1, totalCorrectAns = correctans.length);

    			// removing last pipe symbol in the correctAnsStr
    			correctAnsStr = correctAnsStr.replace(/\|$/gm, "");
    		}

    		// removing the symbol from the cdata
    		var showdata = cdata.replace(/%{|}%/gm, "");

    		var timer = setTimeout(
    			(function () {
    				// show the text in the html
    				AH.select(" #previewArea  #textID0").innerHTML = showdata;

    				clearTimeout(timer);
    			}).bind(self),
    			100
    		);
    	}

    	function loadModule(_type) {
    		switch (_type) {
    			case "1":
    			case "2":
    				{
    					let data_userans = "";
    					let data_userhtml = "";

    					if (uxml) {
    						let _uxml = XMLToJSON$1(uxml);
    						window.test = uxml;

    						// extract the userans and userhtml
    						if (_uxml?.smans?.div) {
    							data_userans = _uxml.smans.div["_data-userAns"];
    							data_userhtml = _uxml.smans.div["_data-userHtml"];
    						}
    					}

    					// return the div
    					return `
						<div is id="hptmain0" totalCorrectAns=${totalCorrectAns}>
							<div 
								id="textID0" 
								type="${typeName}" 
								data-correcthtml="${correctHtml}" 
								data-correctans="${correctAnsStr}"
								data-userans="${data_userans}" 
								data-userhtml="${data_userhtml}" 
								class="drag-resize hotspotTxt" 
								style="max-width:${divWidth}; height:${divHeight}; line-height: 1.4; font-size:17px!important;"
							>
							</div>
						</div>
					`;
    				}
    			default:
    				return "<div>Incorrect question type</div>";
    		}
    	}

    	//To handle review toggle
    	function handleReview(mode, event) {
    		if (mode == "c") {
    			HotJS.showansdrag("#hptmain0", "c", 1);
    		} else {
    			HotJS.showansdrag("#hptmain0", "u", 1);
    		}
    	}

    	const writable_props = ["xml", "uxml", "ansStatus", "isReview", "showAns", "editorState"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<HotspotPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(27, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(28, uxml = $$props.uxml);
    		if ("ansStatus" in $$props) $$invalidate(26, ansStatus = $$props.ansStatus);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(29, showAns = $$props.showAns);
    		if ("editorState" in $$props) $$invalidate(30, editorState = $$props.editorState);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		beforeUpdate,
    		hotspotScript,
    		DooScribPlugin,
    		XMLToJSON: XMLToJSON$1,
    		onUserAnsChange,
    		AH,
    		ItemHelper,
    		movetarget,
    		writable,
    		xml,
    		uxml,
    		ansStatus,
    		isReview,
    		showAns,
    		editorState,
    		customIsReview,
    		HotJS,
    		parseXml,
    		answerStatus,
    		ansDisable,
    		bgImgPath,
    		alt,
    		moduleArr,
    		state,
    		hdd,
    		itemBorder,
    		itemBorderColor,
    		isUxmlTarget,
    		itemAreaTop,
    		itemAreaHeight,
    		itemAreaWidth,
    		itemAreaLeft,
    		targetLeft,
    		targetTop,
    		targetView,
    		ans_x,
    		ans_y,
    		ans_h,
    		ans_w,
    		type,
    		img_url,
    		manual_grade,
    		onError,
    		item_type,
    		xmlHeight,
    		xmlWidth,
    		userCorrect,
    		correctans,
    		totalCorrectAns,
    		scrollEnabled,
    		linecolor,
    		drawstr,
    		count,
    		xaxis,
    		yaxis,
    		divHeight,
    		divWidth,
    		typeName,
    		correctAnsStr,
    		correctHtml,
    		unsubscribe,
    		xmlParser,
    		preRender,
    		checkAnswer,
    		onModalTouch,
    		toggleSelectArea,
    		setReview,
    		unsetReview,
    		imageDraw,
    		onReleaseFunc,
    		parseTextClick,
    		parseTextSelect,
    		loadModule,
    		handleReview
    	});

    	$$self.$inject_state = $$props => {
    		if ("xml" in $$props) $$invalidate(27, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(28, uxml = $$props.uxml);
    		if ("ansStatus" in $$props) $$invalidate(26, ansStatus = $$props.ansStatus);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(29, showAns = $$props.showAns);
    		if ("editorState" in $$props) $$invalidate(30, editorState = $$props.editorState);
    		if ("customIsReview" in $$props) $$invalidate(18, customIsReview = $$props.customIsReview);
    		if ("parseXml" in $$props) parseXml = $$props.parseXml;
    		if ("answerStatus" in $$props) $$invalidate(31, answerStatus = $$props.answerStatus);
    		if ("ansDisable" in $$props) $$invalidate(32, ansDisable = $$props.ansDisable);
    		if ("bgImgPath" in $$props) $$invalidate(19, bgImgPath = $$props.bgImgPath);
    		if ("alt" in $$props) $$invalidate(2, alt = $$props.alt);
    		if ("moduleArr" in $$props) $$invalidate(20, moduleArr = $$props.moduleArr);
    		if ("state" in $$props) $$invalidate(3, state = $$props.state);
    		if ("hdd" in $$props) hdd = $$props.hdd;
    		if ("itemBorder" in $$props) $$invalidate(4, itemBorder = $$props.itemBorder);
    		if ("itemBorderColor" in $$props) $$invalidate(5, itemBorderColor = $$props.itemBorderColor);
    		if ("isUxmlTarget" in $$props) $$invalidate(6, isUxmlTarget = $$props.isUxmlTarget);
    		if ("itemAreaTop" in $$props) $$invalidate(7, itemAreaTop = $$props.itemAreaTop);
    		if ("itemAreaHeight" in $$props) $$invalidate(8, itemAreaHeight = $$props.itemAreaHeight);
    		if ("itemAreaWidth" in $$props) $$invalidate(9, itemAreaWidth = $$props.itemAreaWidth);
    		if ("itemAreaLeft" in $$props) $$invalidate(10, itemAreaLeft = $$props.itemAreaLeft);
    		if ("targetLeft" in $$props) targetLeft = $$props.targetLeft;
    		if ("targetTop" in $$props) targetTop = $$props.targetTop;
    		if ("targetView" in $$props) $$invalidate(11, targetView = $$props.targetView);
    		if ("ans_x" in $$props) $$invalidate(12, ans_x = $$props.ans_x);
    		if ("ans_y" in $$props) $$invalidate(13, ans_y = $$props.ans_y);
    		if ("ans_h" in $$props) ans_h = $$props.ans_h;
    		if ("ans_w" in $$props) ans_w = $$props.ans_w;
    		if ("type" in $$props) type = $$props.type;
    		if ("img_url" in $$props) $$invalidate(14, img_url = $$props.img_url);
    		if ("manual_grade" in $$props) manual_grade = $$props.manual_grade;
    		if ("onError" in $$props) onError = $$props.onError;
    		if ("item_type" in $$props) $$invalidate(15, item_type = $$props.item_type);
    		if ("xmlHeight" in $$props) xmlHeight = $$props.xmlHeight;
    		if ("xmlWidth" in $$props) xmlWidth = $$props.xmlWidth;
    		if ("userCorrect" in $$props) $$invalidate(16, userCorrect = $$props.userCorrect);
    		if ("correctans" in $$props) $$invalidate(33, correctans = $$props.correctans);
    		if ("totalCorrectAns" in $$props) $$invalidate(1, totalCorrectAns = $$props.totalCorrectAns);
    		if ("scrollEnabled" in $$props) $$invalidate(17, scrollEnabled = $$props.scrollEnabled);
    		if ("linecolor" in $$props) linecolor = $$props.linecolor;
    		if ("drawstr" in $$props) drawstr = $$props.drawstr;
    		if ("count" in $$props) count = $$props.count;
    		if ("xaxis" in $$props) xaxis = $$props.xaxis;
    		if ("yaxis" in $$props) yaxis = $$props.yaxis;
    		if ("divHeight" in $$props) divHeight = $$props.divHeight;
    		if ("divWidth" in $$props) divWidth = $$props.divWidth;
    		if ("typeName" in $$props) typeName = $$props.typeName;
    		if ("correctAnsStr" in $$props) correctAnsStr = $$props.correctAnsStr;
    		if ("correctHtml" in $$props) correctHtml = $$props.correctHtml;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isReview, editorState, showAns*/ 1610612737 | $$self.$$.dirty[1] & /*ansDisable, answerStatus*/ 3) {
    			 {
    				if (isReview) {
    					//targetView = "block";
    					setReview();

    					if (editorState && ansDisable == 0) {
    						showAns(answerStatus ? "Correct" : "Incorrect");
    						$$invalidate(32, ansDisable = 1);
    					}
    				} else {
    					//targetView = "none";
    					$$invalidate(32, ansDisable = 0);

    					unsetReview();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*xml, totalCorrectAns*/ 134217730 | $$self.$$.dirty[1] & /*correctans*/ 4) {
    			 if (xml) {
    				// Here replacing the not standard cdata into the valid cdata format
    				let myXml = xml.replace("<!--[CDATA[", "<![CDATA[").replace("]]-->", "]]>");

    				// checking xml for if cdata is found or not 
    				if (myXml.match(/<\!\[CDATA\[{|<\!--\[CDATA\[{/gm)) {
    					// saving value b/w the {, } symbol
    					$$invalidate(33, correctans = myXml.toString().match(/{(.*)}/gmi));

    					$$invalidate(1, totalCorrectAns = correctans.toString().match(/},"\d+"/gm));
    					$$invalidate(1, totalCorrectAns = totalCorrectAns ? totalCorrectAns.pop() : null);

    					$$invalidate(1, totalCorrectAns = totalCorrectAns
    					? totalCorrectAns.replace(/"|}|,/gm, "")
    					: 1);

    					myXml = myXml.replace(correctans, "");
    					$$invalidate(33, correctans = correctans[0]);
    				}

    				parseXml = XMLToJSON$1(xml);
    				xmlParser();
    				preRender();
    			}
    		}
    	};

    	return [
    		isReview,
    		totalCorrectAns,
    		alt,
    		state,
    		itemBorder,
    		itemBorderColor,
    		isUxmlTarget,
    		itemAreaTop,
    		itemAreaHeight,
    		itemAreaWidth,
    		itemAreaLeft,
    		targetView,
    		ans_x,
    		ans_y,
    		img_url,
    		item_type,
    		userCorrect,
    		scrollEnabled,
    		customIsReview,
    		bgImgPath,
    		moduleArr,
    		checkAnswer,
    		setReview,
    		unsetReview,
    		loadModule,
    		handleReview,
    		ansStatus,
    		xml,
    		uxml,
    		showAns,
    		editorState,
    		answerStatus,
    		ansDisable,
    		correctans
    	];
    }

    class HotspotPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1$1.getElementById("svelte-11usv4u-style")) add_css$1();

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				xml: 27,
    				uxml: 28,
    				ansStatus: 26,
    				isReview: 0,
    				showAns: 29,
    				editorState: 30
    			},
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HotspotPreview",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[27] === undefined && !("xml" in props)) {
    			console_1$1.warn("<HotspotPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[28] === undefined && !("uxml" in props)) {
    			console_1$1.warn("<HotspotPreview> was created without expected prop 'uxml'");
    		}

    		if (/*ansStatus*/ ctx[26] === undefined && !("ansStatus" in props)) {
    			console_1$1.warn("<HotspotPreview> was created without expected prop 'ansStatus'");
    		}

    		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
    			console_1$1.warn("<HotspotPreview> was created without expected prop 'isReview'");
    		}

    		if (/*showAns*/ ctx[29] === undefined && !("showAns" in props)) {
    			console_1$1.warn("<HotspotPreview> was created without expected prop 'showAns'");
    		}

    		if (/*editorState*/ ctx[30] === undefined && !("editorState" in props)) {
    			console_1$1.warn("<HotspotPreview> was created without expected prop 'editorState'");
    		}
    	}

    	get xml() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ansStatus() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ansStatus(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
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

    /* clsSMHotspot/HotspotTokenPreview.svelte generated by Svelte v3.34.0 */

    const { console: console_1$2 } = globals;
    const file$2 = "clsSMHotspot/HotspotTokenPreview.svelte";

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-4djjpi-style";
    	style.textContent = ".token.svelte-4djjpi.svelte-4djjpi:hover{border:1px solid #000!important}.bla .token:hover{border:1px solid #fff!important}.token_selected.svelte-4djjpi.svelte-4djjpi{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000!important}.hotspot-token-preview.svelte-4djjpi br.svelte-4djjpi{clear:both}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFRva2VuUHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBd2NJLGtDQUFNLE1BQU0sQUFBQyxDQUFBLEFBQ1QsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLEFBQ3BDLENBQUEsQUFFUSxpQkFBaUIsQUFBQyxDQUFBLEFBQ3RCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksVUFBVSxBQUNwQyxDQUFBLEFBRUEsZUFBZSw0QkFBQyxDQUFBLEFBQ1osZ0JBQWdCLENBQUUsT0FBTyxDQUN6QixLQUFLLENBQUUsSUFBSSxBQUNmLENBQUEsQUFFUSw2QkFBNkIsQUFBRSxDQUFBLEFBQ25DLEtBQUssQ0FBRSxJQUFJLFVBQVUsQUFDekIsQ0FBQSxBQUVBLG9DQUFzQixDQUFDLEVBQUUsY0FBQyxDQUFBLEFBQ3RCLEtBQUssQ0FBRSxJQUFJLEFBQ2YsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJIb3RzcG90VG9rZW5QcmV2aWV3LnN2ZWx0ZSJdfQ== */";
    	append_dev(document.head, style);
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (359:0) {:else}
    function create_else_block$1(ctx) {
    	let div2;
    	let center;
    	let itemhelper;
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let current;

    	itemhelper = new ItemHelper({
    			props: {
    				handleReviewClick: /*handleReviewClick*/ ctx[5],
    				reviewMode: /*state*/ ctx[0].isReview
    			},
    			$$inline: true
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[2]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[3]);
    	let if_block = /*state*/ ctx[0].itemLayout && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			center = element("center");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = `${l.token_highlight}`;
    			t2 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "token_highlight_heading font17 p-2 text-left");
    			set_style(div0, "max-width", "600px");
    			set_style(div0, "border-top", "2px solid #96bbf6");
    			set_style(div0, "background-color", "#d9e7fd");
    			add_location(div0, file$2, 367, 8, 13107);
    			attr_dev(div1, "class", "p-2");
    			set_style(div1, "max-width", "600px");
    			set_style(div1, "border", "2px solid #d9e7fd");
    			set_style(div1, "display", "flow-root");
    			set_style(div1, "text-align", "left");
    			set_style(div1, "justify-content", "left");
    			add_location(div1, file$2, 377, 8, 13401);
    			add_location(center, file$2, 360, 8, 12890);
    			attr_dev(div2, "class", "hotspot-token-preview svelte-4djjpi");
    			attr_dev(div2, "tabindex", "0");
    			add_location(div2, file$2, 359, 4, 12833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, center);
    			mount_component(itemhelper, center, null);
    			append_dev(center, t0);
    			append_dev(center, div0);
    			append_dev(center, t2);
    			append_dev(center, div1);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty & /*state*/ 1) itemhelper_changes.reviewMode = /*state*/ ctx[0].isReview;
    			itemhelper.$set(itemhelper_changes);

    			if (/*state*/ ctx[0].itemLayout) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (detaching) detach_dev(div2);
    			destroy_component(itemhelper);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(359:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (355:0) {#if onError != ""}
    function create_if_block$2(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Oops Something went wrong please check your ParseXML Function";
    			add_location(span, file$2, 356, 8, 12734);
    			attr_dev(div, "class", "alert alert-danger font-weight-bold");
    			add_location(div, file$2, 355, 4, 12676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(355:0) {#if onError != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (388:12) {#if state.itemLayout}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*state*/ ctx[0].itemLayout;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			if (dirty & /*state, AH, setSelected*/ 17) {
    				each_value = /*state*/ ctx[0].itemLayout;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(388:12) {#if state.itemLayout}",
    		ctx
    	});

    	return block;
    }

    // (391:24) {#if data.value.indexOf('##pt') > -1 }
    function create_if_block_5(ctx) {
    	let t_value = (/*data*/ ctx[25].value = /*data*/ ctx[25].value.replace(/##pt/g, ".")) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t_value !== (t_value = (/*data*/ ctx[25].value = /*data*/ ctx[25].value.replace(/##pt/g, ".")) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(391:24) {#if data.value.indexOf('##pt') > -1 }",
    		ctx
    	});

    	return block;
    }

    // (394:24) {#if data.value.indexOf('#cm') > -1 }
    function create_if_block_4(ctx) {
    	let t_value = (/*data*/ ctx[25].value = /*data*/ ctx[25].value.replace(/#cm/g, ",")) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t_value !== (t_value = (/*data*/ ctx[25].value = /*data*/ ctx[25].value.replace(/#cm/g, ",")) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(394:24) {#if data.value.indexOf('#cm') > -1 }",
    		ctx
    	});

    	return block;
    }

    // (407:20) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let span0;
    	let raw_value = /*data*/ ctx[25].value + "";
    	let span0_data_id_value;
    	let span0_data_correct_value;
    	let span0_data_selected_value;
    	let span0_tabindex_value;
    	let span0_class_value;
    	let t0;
    	let span2;
    	let span1;
    	let span1_class_value;
    	let span1_aria_label_value;
    	let span2_class_value;
    	let t1;
    	let div_key_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = space();
    			span2 = element("span");
    			span1 = element("span");
    			t1 = space();
    			attr_dev(span0, "data-id", span0_data_id_value = "ID" + /*i*/ ctx[27]);
    			attr_dev(span0, "data-correct", span0_data_correct_value = AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns));
    			attr_dev(span0, "data-selected", span0_data_selected_value = /*data*/ ctx[25].selected);
    			attr_dev(span0, "tabindex", span0_tabindex_value = /*state*/ ctx[0].pointerEvents == "auto" ? "0" : "1");
    			attr_dev(span0, "class", span0_class_value = "pointer float-left text-left font14 token " + (/*data*/ ctx[25].selected ? "token_selected" : "") + " svelte-4djjpi");
    			set_style(span0, "margin", "2px");
    			set_style(span0, "user-select", "none");
    			set_style(span0, "border", "1px solid transparent");
    			set_style(span0, "padding", "1px 3px");
    			set_style(span0, "border-radius", "3px");
    			set_style(span0, "pointer-events", /*state*/ ctx[0].pointerEvents + "\n                                ");
    			add_location(span0, file$2, 408, 28, 14811);

    			attr_dev(span1, "class", span1_class_value = "position-relative " + (AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns)
    			? "icomoon-new-24px-checkmark-circle-1"
    			: "icomoon-new-24px-cancel-circle-1"));

    			set_style(span1, "color", AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns)
    			? "green"
    			: "red");

    			set_style(span1, "bottom", "3px");
    			set_style(span1, "left", "0");

    			attr_dev(span1, "aria-label", span1_aria_label_value = AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns)
    			? "marked as correct"
    			: "marked as incorrect");

    			add_location(span1, file$2, 441, 32, 16654);
    			attr_dev(span2, "class", span2_class_value = "" + (null_to_empty(/*state*/ ctx[0].iconVisible) + " svelte-4djjpi"));
    			set_style(span2, "position", "absolute");
    			set_style(span2, "width", "17px");
    			set_style(span2, "height", "17px");
    			set_style(span2, "right", "-8px");
    			set_style(span2, "top", "-9px");
    			set_style(span2, "background", "white");
    			set_style(span2, "border-radius", "15px 12px 12px");
    			set_style(span2, "font-size", "18px");
    			set_style(span2, "z-index", "1");

    			set_style(span2, "display", (/*state*/ ctx[0].iconVisible == "" && /*data*/ ctx[25].selected
    			? "block"
    			: "none") + "\n                                ");

    			add_location(span2, file$2, 426, 28, 15870);
    			attr_dev(div, "key", div_key_value = /*i*/ ctx[27]);
    			attr_dev(div, "class", "tokenHeader position-relative float-left d-inline");
    			add_location(div, file$2, 407, 24, 14711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			span0.innerHTML = raw_value;
    			append_dev(div, t0);
    			append_dev(div, span2);
    			append_dev(span2, span1);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(span0, "click", /*setSelected*/ ctx[4].bind(this, /*i*/ ctx[27]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*state*/ 1 && raw_value !== (raw_value = /*data*/ ctx[25].value + "")) span0.innerHTML = raw_value;
    			if (dirty & /*state*/ 1 && span0_data_correct_value !== (span0_data_correct_value = AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns))) {
    				attr_dev(span0, "data-correct", span0_data_correct_value);
    			}

    			if (dirty & /*state*/ 1 && span0_data_selected_value !== (span0_data_selected_value = /*data*/ ctx[25].selected)) {
    				attr_dev(span0, "data-selected", span0_data_selected_value);
    			}

    			if (dirty & /*state*/ 1 && span0_tabindex_value !== (span0_tabindex_value = /*state*/ ctx[0].pointerEvents == "auto" ? "0" : "1")) {
    				attr_dev(span0, "tabindex", span0_tabindex_value);
    			}

    			if (dirty & /*state*/ 1 && span0_class_value !== (span0_class_value = "pointer float-left text-left font14 token " + (/*data*/ ctx[25].selected ? "token_selected" : "") + " svelte-4djjpi")) {
    				attr_dev(span0, "class", span0_class_value);
    			}

    			if (dirty & /*state*/ 1) {
    				set_style(span0, "pointer-events", /*state*/ ctx[0].pointerEvents + "\n                                ");
    			}

    			if (dirty & /*state*/ 1 && span1_class_value !== (span1_class_value = "position-relative " + (AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns)
    			? "icomoon-new-24px-checkmark-circle-1"
    			: "icomoon-new-24px-cancel-circle-1"))) {
    				attr_dev(span1, "class", span1_class_value);
    			}

    			if (dirty & /*state*/ 1) {
    				set_style(span1, "color", AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns)
    				? "green"
    				: "red");
    			}

    			if (dirty & /*state*/ 1 && span1_aria_label_value !== (span1_aria_label_value = AH.findInArray("ID" + /*i*/ ctx[27], /*state*/ ctx[0].correctAns)
    			? "marked as correct"
    			: "marked as incorrect")) {
    				attr_dev(span1, "aria-label", span1_aria_label_value);
    			}

    			if (dirty & /*state*/ 1 && span2_class_value !== (span2_class_value = "" + (null_to_empty(/*state*/ ctx[0].iconVisible) + " svelte-4djjpi"))) {
    				attr_dev(span2, "class", span2_class_value);
    			}

    			if (dirty & /*state*/ 1) {
    				set_style(span2, "display", (/*state*/ ctx[0].iconVisible == "" && /*data*/ ctx[25].selected
    				? "block"
    				: "none") + "\n                                ");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(407:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (405:56) 
    function create_if_block_3$1(ctx) {
    	let br;

    	const block = {
    		c: function create() {
    			br = element("br");
    			attr_dev(br, "class", "svelte-4djjpi");
    			add_location(br, file$2, 405, 24, 14653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(405:56) ",
    		ctx
    	});

    	return block;
    }

    // (398:20) {#if data.value == "," || data.value == "."}
    function create_if_block_2$1(ctx) {
    	let div;
    	let span;
    	let t0_value = /*data*/ ctx[25].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "float-left position-absolute");
    			set_style(span, "left", "-2.5px");
    			set_style(span, "top", "2px");
    			add_location(span, file$2, 399, 28, 14353);
    			attr_dev(div, "class", "float-left position-relative d-inline");
    			set_style(div, "width", "1.5px");
    			set_style(div, "height", "1px");
    			add_location(div, file$2, 398, 24, 14239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && t0_value !== (t0_value = /*data*/ ctx[25].value + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(398:20) {#if data.value == \\\",\\\" || data.value == \\\".\\\"}",
    		ctx
    	});

    	return block;
    }

    // (389:16) {#each state.itemLayout as data, i }
    function create_each_block(ctx) {
    	let div;
    	let show_if_1 = /*data*/ ctx[25].value.indexOf("##pt") > -1;
    	let t0;
    	let show_if = /*data*/ ctx[25].value.indexOf("#cm") > -1;
    	let t1;
    	let if_block2_anchor;
    	let if_block0 = show_if_1 && create_if_block_5(ctx);
    	let if_block1 = show_if && create_if_block_4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*data*/ ctx[25].value == "," || /*data*/ ctx[25].value == ".") return create_if_block_2$1;
    		if (/*data*/ ctx[25].value == "#newline#") return create_if_block_3$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block2 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div, "class", "h");
    			add_location(div, file$2, 389, 20, 13771);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			insert_dev(target, t1, anchor);
    			if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1) show_if_1 = /*data*/ ctx[25].value.indexOf("##pt") > -1;

    			if (show_if_1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*state*/ 1) show_if = /*data*/ ctx[25].value.indexOf("#cm") > -1;

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t1);
    			if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(389:16) {#each state.itemLayout as data, i }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*onError*/ ctx[1] != "") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
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
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
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
    	validate_slots("HotspotTokenPreview", slots, []);
    	let { xml } = $$props;
    	let { editorState } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let { uxml } = $$props;
    	let ansSwitch = 0;
    	let state = {};

    	let hdd = writable({
    		xml: "",
    		itemType: "",
    		cdata: "",
    		correctAns: "",
    		userAns: [],
    		itemLayout: [],
    		smController: "h",
    		pointerEvents: "auto",
    		iconVisible: "h",
    		isReview: false
    	});

    	let onError = "";

    	const unsubs = hdd.subscribe(items => {
    		$$invalidate(0, state = items);
    	});

    	// calls whenever there is change in props or state
    	beforeUpdate(() => {
    		// go in block if there is change in xml
    		if (xml != state.xml) {
    			// set the state of xml to the current(changed) xml
    			$$invalidate(0, state.xml = xml, state);

    			// reset the correct and user ans
    			resetValue();

    			// load the module
    			loadModule(xml);
    		}
    	}); // go in block if there is change in remediation mode
    	// if (isReview) {
    	//     // check tha answer
    	//     checkAns();

    	//     setReview(); 
    	// } else {
    	//     // if review mode is off
    	//     if (editorState) unsetReview();
    	// }
    	// run just after rendering
    	onMount(() => {
    		// select token press the Enter Key ADA
    		AH.listen("body", "keydown", ".token", (_this, e) => {
    			if (e.which === 13) {
    				_this.click();
    			}
    		});

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}
    	}); // //Toggle Button Color
    	// AH.bind('#sm_controller button').click(function() {
    	//     $('#sm_controller button').removeClass("active btn-primary text-white bg-primary");
    	//     $(this).addClass('active btn-primary text-white bg-primary');

    	// });
    	// Binding set-review and unset-review with the click event
    	//For modeOn functions in prepkit
    	// $("#set-review").on('click', function() {
    	//     setReview();
    	// });
    	// $("#unset-review").on('click', function() {
    	//     unsetReview();
    	// });
    	// binding token with enter key in case of IE
    	// if (isIE) {
    	//     AH.listen(document, "keyup", ".hotspot-token-preview .token", (_this, event)=> {
    	//         if (event.which == 13) {
    	//             _this.click();
    	//         }
    	//     });
    	// }
    	// when review mode is on
    	function setReview() {
    		$$invalidate(0, state.isReview = true, state);
    		$$invalidate(0, state.smController = "", state);
    		$$invalidate(0, state.pointerEvents = "none", state);
    		showAnswer("yans", "showIcon");

    		//$('#sm_controller .your-ans').addClass("btn-light active"); 
    		AH.select(".tokenHeader", "attr", { tabIndex: "0" });
    	}

    	// when review mode is off
    	function unsetReview() {
    		$$invalidate(0, state.isReview = false, state);
    		$$invalidate(0, state.smController = "h", state);
    		$$invalidate(0, state.pointerEvents = "auto", state);
    		showAnswer("yans", "hideIcon");
    		AH.select(".tokenHeader", "removeAttr", "tabindex");
    	} //$('#sm_controller button').removeClass("active btn-primary text-white bg-primary");

    	// for resetting the value
    	function resetValue() {
    		$$invalidate(0, state.correctAns = [], state);
    		$$invalidate(0, state.userAns = [], state);
    	}

    	// load the module
    	function loadModule(loadXml) {
    		// Here xml is converted into the json and pass into the parseXMLAuthoring for xml parsing
    		loadXml = XMLToJSON$1(loadXml);

    		parseXMLPreview(loadXml);
    	}

    	// parse function for the preview
    	async function parseXMLPreview(MYXML) {
    		try {
    			// split the correctAns by , & stored it in the current state 
    			$$invalidate(0, state.correctAns = MYXML.smxml.div._correctAns.split(","), state);

    			// set the type of module wether it is w,p or s
    			$$invalidate(0, state.itemType = MYXML.smxml.div._type, state);

    			// set the state of cdata on the basis of xml and after that parse the xml according to its type
    			$$invalidate(0, state.cdata = MYXML.smxml.div.__cdata, state);

    			await tick();

    			switch (MYXML.smxml.div._type) {
    				case "w":
    					// if the type is word
    					// function for parse word
    					parseWord(state.cdata);
    					break;
    				case "s":
    					// if the type is sentence
    					// function for parse sentence
    					parseSentance(state.cdata);
    					break;
    				case "p":
    					// if the type is paragraph
    					// function for parse paragraph
    					parseParagraph(state.cdata);
    					break;
    				default:
    					console.warn("No type found to parse");
    					break;
    			}

    			if (uxml) {
    				// parse the user ans
    				parseUserAns(uxml);
    			}
    		} catch(error) {
    			$$invalidate(1, onError = error);

    			console.warn({
    				"error": error.message,
    				"function name": "parseXMLPreview",
    				"File name": "HotspotTokenPreview.js"
    			});
    		}
    	}

    	// in case of word 
    	function parseWord(str) {
    		// replace the newline with " #newline# "
    		str = str.replace(/\n/g, " #newline# ");

    		//Split the string with space and remove array which contain null value
    		let word = str.split(" ").map(item => {
    			return item.trim();
    		}).filter(arr => {
    			return arr != "";
    		});

    		let wordArray = [];
    		let tempWord = [];

    		/* split punctuation mark in word and store in the tempWord array */
    		word.map((data, i) => {
    			let special_symbol = data.match(/[.,]/g);

    			if (special_symbol) {
    				let splitText = data.split(special_symbol[0]);
    				tempWord.push(splitText[0]);
    				tempWord.push(special_symbol[0]);

    				if (splitText[1].trim()) {
    					tempWord.push(splitText[1]);
    				}
    			} else {
    				tempWord.push(data);
    			}
    		});

    		/*end*/
    		// store id, value and selected in wordArray
    		// Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
    		tempWord.map((data, i) => {
    			wordArray.push({
    				id: "ID" + i,
    				value: data,
    				selected: false
    			});
    		});

    		$$invalidate(0, state.itemLayout = wordArray, state);
    	}

    	// in case of sentence
    	function parseSentance(str) {
    		//Split the string with fullstop and remove array which contain null value
    		let sentance = str.split(".").map(item => {
    			return item.trim();
    		}).filter(arr => {
    			return arr != "";
    		});

    		let sentanceArray = [];

    		// store id, value and selected in sentanceArray
    		// Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
    		sentance.map((data, i) => {
    			sentanceArray.push({
    				id: "ID" + i,
    				value: data + ".",
    				selected: false
    			});
    		});

    		$$invalidate(0, state.itemLayout = sentanceArray, state);
    	}

    	// in case of paragraph
    	function parseParagraph(str) {
    		//Split the string with paragraph and remove array which contain null value
    		let paragraph = str.split("\n").map(item => {
    			return item.trim();
    		}).filter(arr => {
    			return arr != "";
    		});

    		let paragraphArray = [];

    		// store id, value and selected in paragraphArray
    		// Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
    		paragraph.map((data, i) => {
    			paragraphArray.push({
    				id: "ID" + i,
    				value: data,
    				selected: false
    			});
    		});

    		$$invalidate(0, state.itemLayout = paragraphArray, state);
    	}

    	function getCorrect(id) {
    		//Return true if this id is correct answer
    		return AH.findInArray(id, state.correctAns) ? true : false;
    	}

    	// for checking the answer
    	function checkAns() {
    		// used for switch on next question in prepengine if current question is attempted
    		ISSPECIALMODULEUSERXMLCHANGE = 1;

    		let resultLength = 0;
    		const correctLength = state.correctAns.length;

    		//Check if correct answer is equal to user answer
    		state.correctAns.map((data, i) => {
    			state.userAns.map((data2, j) => {
    				if (data == data2) {
    					resultLength = resultLength + 1;
    				}
    			});
    		});

    		let ans = correctLength == resultLength && resultLength == state.userAns.length
    		? true
    		: false;

    		onUserAnsChange({ ans, uXml: uxml });
    		showAns && showAns(ans ? "Correct" : "Incorrect");
    	}

    	// for stting the user answer for selected one
    	function setSelected(pos) {
    		$$invalidate(0, state.itemLayout[pos].selected = !state.itemLayout[pos].selected, state);
    		setUserAns(pos, state.itemLayout[pos].selected);
    	}

    	function setUserAns(id, selected) {
    		let tempUserAns = state.userAns;

    		//Push the index in user answer array if clicked first time
    		//and delete the index from user answer if it is already selected
    		if (selected == true) {
    			// push in the userAns if it is selected
    			tempUserAns.push("ID" + id);

    			$$invalidate(0, state.userAns = tempUserAns, state);
    		} else if (selected == false) {
    			let deleteValue = tempUserAns.indexOf("ID" + id);

    			if (deleteValue > -1) {
    				// delete from the user ans if it is deselected
    				tempUserAns.splice(deleteValue, 1);
    			}

    			$$invalidate(0, state.userAns = tempUserAns, state);
    		}

    		// getting height in native
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		// updating the uaXml
    		$$invalidate(6, uxml = "<smans><div userAns='" + state.userAns.join() + "'></div></smans>");

    		// AH.select("#special_module_user_xml", 'value', "<smans><div userAns='"+state.userAns.join()+"'></div></smans>")
    		// check for correct answer
    		checkAns();
    	}

    	// for showing answer
    	function showAnswer(val, iconState) {
    		//show correct incorrect icon with respect to iconState
    		$$invalidate(0, state.iconVisible = iconState == "showIcon" ? "" : "h", state);

    		//change token highlight with respect to val
    		//either to show correct answer or user answer
    		let ans = [];

    		if (val == "cans") {
    			// if correct ans tab
    			ans = state.correctAns;
    		} else if (val == "yans") {
    			// if user answer tab
    			ans = state.userAns;
    		}

    		state.itemLayout.map((data, j) => {
    			data.selected = AH.findInArray(data.id, ans) ? true : false;
    		}); //return data;
    	}

    	// for parsing the user ans function
    	function parseUserAns(uans) {
    		// converting the xml into the json and stored in userAnswer
    		let userAnswer = XMLToJSON$1(uans);

    		// cheking for the 2 elements smans,div, and one attribute of div i.e, userAns
    		if (userAnswer.smans && userAnswer.smans.div && userAnswer.smans.div._userAns) {
    			// splitting the userAns with ,
    			$$invalidate(0, state.userAns = userAnswer.smans.div._userAns.split(","), state);

    			// get the selection on the basis of the user answer
    			state.itemLayout.map((data, j) => {
    				data.selected = AH.findInArray(data.id, state.userAns) ? true : false;
    			});
    		}
    	}

    	function handleReviewClick(mode, event) {
    		if (mode == "c") {
    			showAnswer("cans", "hideIcon");
    		} else {
    			showAnswer("yans", "showIcon");
    		}
    	}

    	const writable_props = ["xml", "editorState", "isReview", "showAns", "uxml"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<HotspotTokenPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(7, xml = $$props.xml);
    		if ("editorState" in $$props) $$invalidate(8, editorState = $$props.editorState);
    		if ("isReview" in $$props) $$invalidate(9, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(10, showAns = $$props.showAns);
    		if ("uxml" in $$props) $$invalidate(6, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		onMount,
    		tick,
    		writable,
    		ItemHelper,
    		AH,
    		onUserAnsChange,
    		XMLToJSON: XMLToJSON$1,
    		l,
    		xml,
    		editorState,
    		isReview,
    		showAns,
    		uxml,
    		ansSwitch,
    		state,
    		hdd,
    		onError,
    		unsubs,
    		setReview,
    		unsetReview,
    		resetValue,
    		loadModule,
    		parseXMLPreview,
    		parseWord,
    		parseSentance,
    		parseParagraph,
    		getCorrect,
    		checkAns,
    		setSelected,
    		setUserAns,
    		showAnswer,
    		parseUserAns,
    		handleReviewClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("xml" in $$props) $$invalidate(7, xml = $$props.xml);
    		if ("editorState" in $$props) $$invalidate(8, editorState = $$props.editorState);
    		if ("isReview" in $$props) $$invalidate(9, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(10, showAns = $$props.showAns);
    		if ("uxml" in $$props) $$invalidate(6, uxml = $$props.uxml);
    		if ("ansSwitch" in $$props) $$invalidate(11, ansSwitch = $$props.ansSwitch);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("hdd" in $$props) hdd = $$props.hdd;
    		if ("onError" in $$props) $$invalidate(1, onError = $$props.onError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isReview, editorState, ansSwitch*/ 2816) {
    			// go in block if there is change in remediation mode
    			 {
    				if (isReview) {
    					setReview();

    					if (editorState && ansSwitch == 0) {
    						// check tha answer
    						$$invalidate(11, ansSwitch = 1);

    						checkAns();
    					}
    				} else {
    					// if review mode is off
    					$$invalidate(11, ansSwitch = 0);

    					if (editorState) unsetReview();
    				}
    			}
    		}
    	};

    	return [
    		state,
    		onError,
    		setReview,
    		unsetReview,
    		setSelected,
    		handleReviewClick,
    		uxml,
    		xml,
    		editorState,
    		isReview,
    		showAns,
    		ansSwitch
    	];
    }

    class HotspotTokenPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-4djjpi-style")) add_css$2();

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			xml: 7,
    			editorState: 8,
    			isReview: 9,
    			showAns: 10,
    			uxml: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HotspotTokenPreview",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[7] === undefined && !("xml" in props)) {
    			console_1$2.warn("<HotspotTokenPreview> was created without expected prop 'xml'");
    		}

    		if (/*editorState*/ ctx[8] === undefined && !("editorState" in props)) {
    			console_1$2.warn("<HotspotTokenPreview> was created without expected prop 'editorState'");
    		}

    		if (/*isReview*/ ctx[9] === undefined && !("isReview" in props)) {
    			console_1$2.warn("<HotspotTokenPreview> was created without expected prop 'isReview'");
    		}

    		if (/*showAns*/ ctx[10] === undefined && !("showAns" in props)) {
    			console_1$2.warn("<HotspotTokenPreview> was created without expected prop 'showAns'");
    		}

    		if (/*uxml*/ ctx[6] === undefined && !("uxml" in props)) {
    			console_1$2.warn("<HotspotTokenPreview> was created without expected prop 'uxml'");
    		}
    	}

    	get xml() {
    		throw new Error("<HotspotTokenPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<HotspotTokenPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<HotspotTokenPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<HotspotTokenPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<HotspotTokenPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<HotspotTokenPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<HotspotTokenPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<HotspotTokenPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<HotspotTokenPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<HotspotTokenPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const defXMl = `<smxml type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" alt="" width="600" height="250">
<div id="ID0" type="hotspot" top="172" left="220" width="112" height="80"  imgheight="" imgwidth="">
	<!--[CDATA[]]-->
</div>
</smxml>`;
    let app;
    let newXML = XMLToJSON(window.QXML);
    if(['w', 's', 'p'].includes(newXML.smxml.div._type)) {
    	app = new HotspotTokenPreview({
    		target: document.getElementById(window.moduleContainer) || document.body,
    		props: {
    			xml: window.QXML || defXMl,
    			uxml: window.uaXML,
    			ansStatus: 0,
    			isReview: window.isReviewMode || false,
    		}
    	});
    } else {
    	app = new HotspotPreview({
    		target: document.getElementById(window.moduleContainer) || document.body,
    		props: {
    			xml: window.QXML || defXMl,
    			uxml: window.uaXML,
    			ansStatus: 0,
    			isReview: window.isReviewMode || false,
    		}
    	});
    }


    var app$1 = app;

    return app$1;

}());
//# sourceMappingURL=bundle_q4.js.map
