
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
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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

    function XMLToJSON(myXml) {
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
    		AH$1.select("#answer", "checked", result.ans ? true : false);
    		AH$1.select("#special_module_user_xml", "value", result.uXml);

    		if (typeof window == "object") {
    			window.ISSPECIALMODULEUSERXMLCHANGE = 1;

    			if (typeof calculatePoint != "undefined") {
    				calculatePoint(result.correctPoints || 1, result.ansPoint || result.ans);
    			}
    		}

    		globalThis.saveUserAnswerInSapper?.(result);
    	}
    }

    const AH$1 = new JUI();
    const SSD = new JStore();

    /* helper/ItemHelper.svelte generated by Svelte v3.34.0 */

    const { document: document_1 } = globals;
    const file = "helper/ItemHelper.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-ri6gyf-style";
    	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUhlbHBlci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBNENZLGdFQUFnRSxBQUFFLENBQUEsQUFDdEUsS0FBSyxDQUFFLElBQUksVUFBVSxDQUNyQixrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQ25ELFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQzNDLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxDQUNuQyxZQUFZLENBQUUsT0FBTyxVQUFVLENBQy9CLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxBQUN2QyxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkl0ZW1IZWxwZXIuc3ZlbHRlIl19 */";
    	append_dev(document_1.head, style);
    }

    // (37:0) {#if reviewMode || customReviewMode}
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
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "mode", "c");
    			attr_dev(button0, "class", "btn btn-light correct-ans svelte_items_test");
    			add_location(button0, file, 38, 8, 1459);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "mode", "u");
    			attr_dev(button1, "class", "btn btn-light your-ans active svelte_items_test");
    			add_location(button1, file, 39, 8, 1601);
    			attr_dev(div, "class", "smControlerBtn btn-group mb-3");
    			attr_dev(div, "aria-label", "Answer buttons");
    			add_location(div, file, 37, 4, 1379);
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
    		source: "(37:0) {#if reviewMode || customReviewMode}",
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
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "h h-imp svelte_items_test");
    			attr_dev(button0, "id", "set-review");
    			add_location(button0, file, 34, 0, 1092);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp svelte_items_test");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file, 35, 0, 1213);
    			add_location(center, file, 33, 0, 1083);
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

    	AH$1.listen("body", "keydown", ".smControlerBtn .correct-ans", function (_this, e) {
    		if (e.which === 13) {
    			_this.click();
    		}
    	});

    	AH$1.listen("body", "keydown", ".smControlerBtn .your-ans", function (_this, e) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ItemHelper> was created with unknown prop '${key}'`);
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
    		AH: AH$1,
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
    			console.warn("<ItemHelper> was created without expected prop 'handleReviewClick'");
    		}

    		if (/*customReviewMode*/ ctx[1] === undefined && !("customReviewMode" in props)) {
    			console.warn("<ItemHelper> was created without expected prop 'customReviewMode'");
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

    //window.isDraggableAdded = (window.isDraggableAdded) ? window.isDraggableAdded : false;
    //window.isDraggable = (window.isDraggable) ? window.isDraggable :false;

    class Draggable {
        /* 
            DragNDrop class fire following events 
                onDragStart(event, element) // when dragging is just started
                onDrag(event, ui) // when element is dragging
                onDrop(source, target) // when element is dropped
                onRemove(source, target) // whene drop element is removed
                onOver(element) // when draggable is over the doppable area
                onOut(element) // when draggble leave the droppable area
                isRevert() // when element is started dragging but not droppped at proper place
                changeContainment(element) // if defined set the return element as container

            Dragging:
                onDragStart(event, element) // when dragging is just started
                onDrag(event, ui)  // when element is dragging
                onDragStop(event, position , ui) // when element is dropped
                changeContainment(element) // if defined set the return element as container


        */
        constructor(container, drag, drop, draglist) {
            if (typeof (container) == 'object') {
                this.container = container.containment;
                this.drag =  container.classes;
                this.ignore = container.ignore;
                this.initDraggable();
            } else {
                this.drag = drag;
                this.drop = drop;
                this.container = container;
                this.initDnd();
            }
            this.lastPosition = [0, 0];
            window.draglist = draglist;
            this.isStart = false;
            this.isMoving = false;
            this.node = null;
            this.target = null;
            this.prenode = null;
        }

        checkPosition(event, node) {
            let boundry = document.querySelector(this.container).getBoundingClientRect();
            let x = event.clientX - boundry.left;
            let y = event.clientY - boundry.top;
            let dimension = {
                width : node.offsetWidth / 2,
                height: node.offsetHeight / 2,
            };
            if (x < dimension.width) {
                x = dimension.width;
            } else if (x > (boundry.width -  dimension.width) ) {
                x = (boundry.width -  dimension.width);
            } 

            if (y < dimension.height) {
                y = dimension.height;
            } else if (y > (boundry.height -  dimension.height)) {
                y = (boundry.height -  dimension.height);
            }

            if (x < 0) {
                x = dimension.width + 10;
            } 
            if (y < 0) {
                y = dimension.height + 10;
            }

            return [x, y];
        };

        binddndEvents(drag, drop) {
            if (drag) {
                AI.listen('body', 'mousedown', drag, (current, event) => {
                    if (this.changeContainment) {
                        this.container = this.changeContainment(current);
                    }
                    if (!(current.classList.contains('uc_drag_disable') || current.classList.contains('lab_disable') )) {
                        if (drop) {
                            AI.selectAll(drop).forEach(element => {
                                if (element.getAttribute('droping') == '2') {
                                    element.style.zIndex = 5;
                                } else {
                                    element.style.zIndex = 2;
                                }
                            });
                        }

                        this.prenode = current;
                        this.isStart = false;
                        this.node = null;

                        if (this.onDragStart) {
                            let clone_node = this.onDragStart(event, this.prenode);
                            clone_node.style.zIndex= 100;
                            this.node = clone_node;
                            this.lastPosition = this.checkPosition(event, this.prenode);
                            clone_node.style.top = this.lastPosition[1] + this.prenode.offsetHeight / 2 + 'px';
                            clone_node.style.left = this.lastPosition[0]  - this.prenode.offsetWidth / 2 + 'px';
                            document.querySelector(this.container).appendChild(clone_node);
                            this.isStart = true;
                        }
                    }
                });

                AI.listen('body', 'dragstart', drag, (current, event) => {
                    event.preventDefault();
                });

                AI.listenAll('body', 'mousemove', (event) => {
                    if (this.isStart && this.node) {
                        this.isMoving = true;
                        this.lastPosition = this.checkPosition(event, this.node);
                        this.node.style.top = this.lastPosition[1] + this.node.offsetHeight / 2 + 'px';
                        this.node.style.left = this.lastPosition[0]  - this.node.offsetWidth / 2 + 'px';
                        this.onDrag && this.onDrag(event, {node: this.node, top: (this.lastPosition[1] + this.node.offsetHeight / 2), left : (this.lastPosition[0]  - this.node.offsetWidth / 2 )});
                    }
                });

                AI.listenAll('body', 'mouseup', () => {
                    if (this.isStart && this.node && this.isMoving) {
                        this.isMoving = false;
                        this.isStart = false;
                        if (this.target) {
                            if (this.target.getAttribute('droping') == '1' && this.prenode.getAttribute('droping') == '2') {
                                this.onDropChange(this.prenode, this.target, window.draglist[this.prenode.id][0]);
                                this.saveDetail(window.draglist[this.prenode.id][0], this.target);
                                delete window.draglist[this.prenode.id];
                            } else if (this.target.getAttribute('droping') == '2' && this.prenode.getAttribute('droping') == '2') {
                                this.onDropInterchange(this.prenode, this.target, window.draglist[this.prenode.id][0], window.draglist[this.target.id][0]);
                                let clone_draglist = Object.assign({}, window.draglist);
                                this.saveDetail(clone_draglist[this.prenode.id][0], this.target);
                                this.saveDetail(clone_draglist[this.target.id][0], this.prenode);
                            } else if (this.target.getAttribute('droping') == '2' && this.prenode.getAttribute('draging') == '1') {
                                this.onDragInterchange(this.prenode, this.target, window.draglist[this.target.id][0]);
                                this.saveDetail(this.prenode, this.target);
                            } else if (this.prenode.id != this.target.id) { //  if data is drop from source to target
                                this.saveDetail(this.prenode, this.target);
                                this.onDrop(this.prenode, this.target);
                            } else if (this.prenode.id == this.target.id) { // if both the drop and drag are same target
                                this.target.classList.remove('drop-hover');
                                this.target.style.opacity = '';
                            }
                        } else if (this.node.getAttribute('draging') == '2') { // when element is remove from target -> source 
                            let target =  window.draglist[this.prenode.id];
                            this.onRemove(this.prenode, target[0]);
                            delete window.draglist[this.prenode.id];
                        } else {
                            this.isRevert && this.isRevert();
                        }
                        if(this.node)
                            this.node.remove();
                    } else if (!this.isMoving && this.node) {
                        this.node.remove();
                    }
            
                    if (drop) {
                        AI.selectAll(drop).forEach(element => {
                            element.style.zIndex = '';
                            // element.style.position = '';
                        });
                    }
            
                    this.node = null;
                    this.target = null;
                    this.prenode = null;
                });
            }
            if (drop) {
                AI.listen('body', 'mousemove', drop, (current) => {
                    if (this.isStart && this.node && this.isMoving) {
                        this.target = current;
                        AI.selectAll('.dropable','removeClass','drop-hover');
                        this.target.classList.add('drop-hover');
                        this.target.style.opacity = '1';
                        this.onOver && this.onOver(current);
                    }
                });
                
                AI.listen('body', 'mouseover', drop, (current) => {
                    this.target = current;
                    this.target.classList.add('drop-hover');
                });

                AI.listen('body','mouseout', drop, () => {
                    if (this.isStart && this.node && this.isMoving && this.target) {
                        this.onOut && this.onOut(this.target);
                        this.target.style.opacity = '1';
                        this.target = null;
                    } 
                    if (this.target != null || this.target != undefined) {
                        this.target.classList.remove('drop-hover');
                    }
                });
            }
        };

        bindDraggable(drag) {
            AI.listen('body', 'mousedown', drag, (current, event) => {
                if(event.which == 3){
                    return;
                }
                if (this.changeContainment) {
                    this.container = this.changeContainment(current);
                }

                if (this.ignore && Array.isArray(this.ignore) && event.target) {
                    let revert = false;
                    for (let index = 0; index < this.ignore.length; index++) {
                        if (event.target.closest(this.ignore[index]) || event.target.classList.contains(this.ignore[index])) {
                            revert = true;
                            break;
                        }
                    }
                    if (revert) {
                        return false;
                    }
                }
                this.isStart = true;
                this.node = current;
                this.lastPosition = this.checkPosition(event, current);
                current.style.top = this.lastPosition[1] - current.offsetHeight / 2 + 'px';
                current.style.left = this.lastPosition[0]  - current.offsetWidth / 2 + 'px';
                this.onDragStart && this.onDragStart(event, current);
            });

            AI.listen('body', 'dragstart', drag, (current, event) => {
                event.preventDefault();
            });

            AI.listenAll('body', 'mousemove', (event) => {
                if (this.isStart && this.node) {
                    this.isMoving = true;
                    this.lastPosition = this.checkPosition(event, this.node);
                    this.node.style.top = this.lastPosition[1] - this.node.offsetHeight / 2 + 'px';
                    this.node.style.left = this.lastPosition[0]  - this.node.offsetWidth / 2 + 'px';
                    this.node.style.zIndex = 100;
                    this.onDrag && this.onDrag(event, {top: (this.lastPosition[1] - this.node.offsetHeight / 2), left : (this.lastPosition[0]  - this.node.offsetWidth / 2 )});
                }
            });

            AI.listenAll('body', 'mouseup', (event) => {
                if (this.isStart && this.node && this.isMoving) {
                    this.isMoving = false;
                    this.isStart = false;
                    this.lastPosition = this.checkPosition(event, this.node);
                    this.node.style.top = this.lastPosition[1] - this.node.offsetHeight / 2 + 'px';
                    this.node.style.left = this.lastPosition[0]  - this.node.offsetWidth / 2 + 'px';
                    this.node.style.zIndex = '100';
                    this.onDragStop && this.onDragStop(event, {top: (this.lastPosition[1] - this.node.offsetHeight / 2), left : (this.lastPosition[0]  - this.node.offsetWidth / 2 )}, this.node);
                }
                this.node = null;
            });
        }

        initDnd() {
            if (!window.isDraggableAdded) {
                this.binddndEvents(this.drag, this.drop);
                window.isDraggableAdded = true;
            }
        };

        initDraggable() {
            if (!window.isDraggable) {
                this.bindDraggable(this.drag);
                window.isDraggable = true;
            }
        };

        saveDetail(source, target) {
            window.draglist[target.id] = [source, target];
            window.draglist = window.draglist;
        };

        onDrop(source, target) {
            let copied = source.cloneNode(true);
            target.style.backgroundColor = copied.getAttribute('data-bgcolor');
            target.setAttribute('draging', 2);
            target.setAttribute('droping', 2); 
        
            // for disabling the dragable
            if (! (source.getAttribute("data-multi_drag") == "1") ) {
                source.classList.add('uc_drag_disable');
                source.style.setProperty("cursor", "no-drop", "important");
                source.style.setProperty("opacity", "0.5", "important");
            }
        
            target.classList.remove('drop-hover');
            target.style.opacity = '1';
            AI.find(target, 'p').innerText = AI.find(copied, 'p').innerText;
        } 
        
        onRemove(source, target) {
            source.removeAttribute('draging');
            source.style.backgroundColor = source.getAttribute('data-bgcolor');
            source.setAttribute('droping', 1);
        
            // for disabling the dragable
            if (target) {
                target.classList.remove('uc_drag_disable');
                target.style.cursor = '';
                target.style.opacity = '';
            }
        
            source.classList.remove('drop-hover');
            source.style.opacity = '1';
            AI.find(source, 'p').innerText = source.getAttribute('data-caption');
        } 
        
        onDropChange(source, target, originalSource) {
            this.onDrop(originalSource, target);
            this.onRemove(source);
        }
        
        onDropInterchange(source, target, originalSource, originalTarget) {
            this.onDrop(originalSource, target);
            this.onDrop(originalTarget, source);
        }
        
        onDragInterchange(source, target, originalSource) {
            this.onRemove(target, originalSource);
            this.onDrop(source, target);
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var sweetalert_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,function(){return function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o});},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=8)}([function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o="swal-button";e.CLASS_NAMES={MODAL:"swal-modal",OVERLAY:"swal-overlay",SHOW_MODAL:"swal-overlay--show-modal",MODAL_TITLE:"swal-title",MODAL_TEXT:"swal-text",ICON:"swal-icon",ICON_CUSTOM:"swal-icon--custom",CONTENT:"swal-content",FOOTER:"swal-footer",BUTTON_CONTAINER:"swal-button-container",BUTTON:o,CONFIRM_BUTTON:o+"--confirm",CANCEL_BUTTON:o+"--cancel",DANGER_BUTTON:o+"--danger",BUTTON_LOADING:o+"--loading",BUTTON_LOADER:o+"__loader"},e.default=e.CLASS_NAMES;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.getNode=function(t){var e="."+t;return document.querySelector(e)},e.stringToNode=function(t){var e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild},e.insertAfter=function(t,e){var n=e.nextSibling;e.parentNode.insertBefore(t,n);},e.removeNode=function(t){t.parentElement.removeChild(t);},e.throwErr=function(t){throw t=t.replace(/ +(?= )/g,""),"SweetAlert: "+(t=t.trim())},e.isPlainObject=function(t){if("[object Object]"!==Object.prototype.toString.call(t))return !1;var e=Object.getPrototypeOf(t);return null===e||e===Object.prototype},e.ordinalSuffixOf=function(t){var e=t%10,n=t%100;return 1===e&&11!==n?t+"st":2===e&&12!==n?t+"nd":3===e&&13!==n?t+"rd":t+"th"};},function(t,e,n){function o(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n]);}Object.defineProperty(e,"__esModule",{value:!0}),o(n(25));var r=n(26);e.overlayMarkup=r.default,o(n(27)),o(n(28)),o(n(29));var i=n(0),a=i.default.MODAL_TITLE,s=i.default.MODAL_TEXT,c=i.default.ICON,l=i.default.FOOTER;e.iconMarkup='\n  <div class="'+c+'"></div>',e.titleMarkup='\n  <div class="'+a+'"></div>\n',e.textMarkup='\n  <div class="'+s+'"></div>',e.footerMarkup='\n  <div class="'+l+'"></div>\n';},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1);e.CONFIRM_KEY="confirm",e.CANCEL_KEY="cancel";var r={visible:!0,text:null,value:null,className:"",closeModal:!0},i=Object.assign({},r,{visible:!1,text:"Cancel",value:null}),a=Object.assign({},r,{text:"OK",value:!0});e.defaultButtonList={cancel:i,confirm:a};var s=function(t){switch(t){case e.CONFIRM_KEY:return a;case e.CANCEL_KEY:return i;default:var n=t.charAt(0).toUpperCase()+t.slice(1);return Object.assign({},r,{text:n,value:t})}},c=function(t,e){var n=s(t);return !0===e?Object.assign({},n,{visible:!0}):"string"==typeof e?Object.assign({},n,{visible:!0,text:e}):o.isPlainObject(e)?Object.assign({visible:!0},n,e):Object.assign({},n,{visible:!1})},l=function(t){for(var e={},n=0,o=Object.keys(t);n<o.length;n++){var r=o[n],a=t[r],s=c(r,a);e[r]=s;}return e.cancel||(e.cancel=i),e},u=function(t){var n={};switch(t.length){case 1:n[e.CANCEL_KEY]=Object.assign({},i,{visible:!1});break;case 2:n[e.CANCEL_KEY]=c(e.CANCEL_KEY,t[0]),n[e.CONFIRM_KEY]=c(e.CONFIRM_KEY,t[1]);break;default:o.throwErr("Invalid number of 'buttons' in array ("+t.length+").\n      If you want more than 2 buttons, you need to use an object!");}return n};e.getButtonListOpts=function(t){var n=e.defaultButtonList;return "string"==typeof t?n[e.CONFIRM_KEY]=c(e.CONFIRM_KEY,t):Array.isArray(t)?n=u(t):o.isPlainObject(t)?n=l(t):!0===t?n=u([!0,!0]):!1===t?n=u([!1,!1]):void 0===t&&(n=e.defaultButtonList),n};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(2),i=n(0),a=i.default.MODAL,s=i.default.OVERLAY,c=n(30),l=n(31),u=n(32),f=n(33);e.injectElIntoModal=function(t){var e=o.getNode(a),n=o.stringToNode(t);return e.appendChild(n),n};var d=function(t){t.className=a,t.textContent="";},p=function(t,e){d(t);var n=e.className;n&&t.classList.add(n);};e.initModalContent=function(t){var e=o.getNode(a);p(e,t),c.default(t.icon),l.initTitle(t.title),l.initText(t.text),f.default(t.content),u.default(t.buttons,t.dangerMode);};var m=function(){var t=o.getNode(s),e=o.stringToNode(r.modalMarkup);t.appendChild(e);};e.default=m;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r={isOpen:!1,promise:null,actions:{},timer:null},i=Object.assign({},r);e.resetState=function(){i=Object.assign({},r);},e.setActionValue=function(t){if("string"==typeof t)return a(o.CONFIRM_KEY,t);for(var e in t)a(e,t[e]);};var a=function(t,e){i.actions[t]||(i.actions[t]={}),Object.assign(i.actions[t],{value:e});};e.setActionOptionsFor=function(t,e){var n=(void 0===e?{}:e).closeModal,o=void 0===n||n;Object.assign(i.actions[t],{closeModal:o});},e.default=i;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(0),a=i.default.OVERLAY,s=i.default.SHOW_MODAL,c=i.default.BUTTON,l=i.default.BUTTON_LOADING,u=n(5);e.openModal=function(){o.getNode(a).classList.add(s),u.default.isOpen=!0;};var f=function(){o.getNode(a).classList.remove(s),u.default.isOpen=!1;};e.onAction=function(t){void 0===t&&(t=r.CANCEL_KEY);var e=u.default.actions[t],n=e.value;if(!1===e.closeModal){var i=c+"--"+t;o.getNode(i).classList.add(l);}else f();u.default.promise.resolve(n);},e.getState=function(){var t=Object.assign({},u.default);return delete t.promise,delete t.timer,t},e.stopLoading=function(){for(var t=document.querySelectorAll("."+c),e=0;e<t.length;e++){t[e].classList.remove(l);}};},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this");}catch(t){"object"==typeof window&&(n=window);}t.exports=n;},function(t,e,n){(function(e){t.exports=e.sweetAlert=n(9);}).call(e,n(7));},function(t,e,n){(function(e){t.exports=e.swal=n(10);}).call(e,n(7));},function(t,e,n){"undefined"!=typeof window&&n(11),n(16);var o=n(23).default;t.exports=o;},function(t,e,n){var o=n(12);"string"==typeof o&&(o=[[t.i,o,""]]);var r={insertAt:"top"};r.transform=void 0;n(14)(o,r);o.locals&&(t.exports=o.locals);},function(t,e,n){e=t.exports=n(13)(void 0),e.push([t.i,'.swal-icon--error{border-color:#f27474;-webkit-animation:animateErrorIcon .5s;animation:animateErrorIcon .5s}.swal-icon--error__x-mark{position:relative;display:block;-webkit-animation:animateXMark .5s;animation:animateXMark .5s}.swal-icon--error__line{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.swal-icon--error__line--left{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.swal-icon--error__line--right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}@-webkit-keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@-webkit-keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}@keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}.swal-icon--warning{border-color:#f8bb86;-webkit-animation:pulseWarning .75s infinite alternate;animation:pulseWarning .75s infinite alternate}.swal-icon--warning__body{width:5px;height:47px;top:10px;border-radius:2px;margin-left:-2px}.swal-icon--warning__body,.swal-icon--warning__dot{position:absolute;left:50%;background-color:#f8bb86}.swal-icon--warning__dot{width:7px;height:7px;border-radius:50%;margin-left:-4px;bottom:-11px}@-webkit-keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}@keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}.swal-icon--success{border-color:#a5dc86}.swal-icon--success:after,.swal-icon--success:before{content:"";border-radius:50%;position:absolute;width:60px;height:120px;background:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal-icon--success:before{border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.swal-icon--success:after{border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px;-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}.swal-icon--success__ring{width:80px;height:80px;border:4px solid hsla(98,55%,69%,.2);border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.swal-icon--success__hide-corners{width:5px;height:90px;background-color:#fff;padding:1px;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal-icon--success__line{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.swal-icon--success__line--tip{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-animation:animateSuccessTip .75s;animation:animateSuccessTip .75s}.swal-icon--success__line--long{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-animation:animateSuccessLong .75s;animation:animateSuccessLong .75s}@-webkit-keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@-webkit-keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}.swal-icon--info{border-color:#c9dae1}.swal-icon--info:before{width:5px;height:29px;bottom:17px;border-radius:2px;margin-left:-2px}.swal-icon--info:after,.swal-icon--info:before{content:"";position:absolute;left:50%;background-color:#c9dae1}.swal-icon--info:after{width:7px;height:7px;border-radius:50%;margin-left:-3px;top:19px}.swal-icon{width:80px;height:80px;border-width:4px;border-style:solid;border-radius:50%;padding:0;position:relative;box-sizing:content-box;margin:20px auto}.swal-icon:first-child{margin-top:32px}.swal-icon--custom{width:auto;height:auto;max-width:100%;border:none;border-radius:0}.swal-icon img{max-width:100%;max-height:100%}.swal-title{color:rgba(0,0,0,.65);font-weight:600;text-transform:none;position:relative;display:block;padding:13px 16px;font-size:27px;line-height:normal;text-align:center;margin-bottom:0}.swal-title:first-child{margin-top:26px}.swal-title:not(:first-child){padding-bottom:0}.swal-title:not(:last-child){margin-bottom:13px}.swal-text{font-size:16px;position:relative;float:none;line-height:normal;vertical-align:top;text-align:left;display:inline-block;margin:0;padding:0 10px;font-weight:400;color:rgba(0,0,0,.64);max-width:calc(100% - 20px);overflow-wrap:break-word;box-sizing:border-box}.swal-text:first-child{margin-top:45px}.swal-text:last-child{margin-bottom:45px}.swal-footer{text-align:right;padding-top:13px;margin-top:13px;padding:13px 16px;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0}.swal-button-container{margin:5px;display:inline-block;position:relative}.swal-button{background-color:#7cd1f9;color:#fff;border:none;box-shadow:none;border-radius:5px;font-weight:600;font-size:14px;padding:10px 24px;margin:0;cursor:pointer}.swal-button:not([disabled]):hover{background-color:#78cbf2}.swal-button:active{background-color:#70bce0}.swal-button:focus{outline:none;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(43,114,165,.29)}.swal-button[disabled]{opacity:.5;cursor:default}.swal-button::-moz-focus-inner{border:0}.swal-button--cancel{color:#555;background-color:#efefef}.swal-button--cancel:not([disabled]):hover{background-color:#e8e8e8}.swal-button--cancel:active{background-color:#d7d7d7}.swal-button--cancel:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(116,136,150,.29)}.swal-button--danger{background-color:#e64942}.swal-button--danger:not([disabled]):hover{background-color:#df4740}.swal-button--danger:active{background-color:#cf423b}.swal-button--danger:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(165,43,43,.29)}.swal-content{padding:0 20px;margin-top:20px;font-size:medium}.swal-content:last-child{margin-bottom:20px}.swal-content__input,.swal-content__textarea{-webkit-appearance:none;background-color:#fff;border:none;font-size:14px;display:block;box-sizing:border-box;width:100%;border:1px solid rgba(0,0,0,.14);padding:10px 13px;border-radius:2px;transition:border-color .2s}.swal-content__input:focus,.swal-content__textarea:focus{outline:none;border-color:#6db8ff}.swal-content__textarea{resize:vertical}.swal-button--loading{color:transparent}.swal-button--loading~.swal-button__loader{opacity:1}.swal-button__loader{position:absolute;height:auto;width:43px;z-index:2;left:50%;top:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);text-align:center;pointer-events:none;opacity:0}.swal-button__loader div{display:inline-block;float:none;vertical-align:baseline;width:9px;height:9px;padding:0;border:none;margin:2px;opacity:.4;border-radius:7px;background-color:hsla(0,0%,100%,.9);transition:background .2s;-webkit-animation:swal-loading-anim 1s infinite;animation:swal-loading-anim 1s infinite}.swal-button__loader div:nth-child(3n+2){-webkit-animation-delay:.15s;animation-delay:.15s}.swal-button__loader div:nth-child(3n+3){-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}@keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}.swal-overlay{position:fixed;top:0;bottom:0;left:0;right:0;text-align:center;font-size:0;overflow-y:auto;background-color:rgba(0,0,0,.4);z-index:10000;pointer-events:none;opacity:0;transition:opacity .3s}.swal-overlay:before{content:" ";display:inline-block;vertical-align:middle;height:100%}.swal-overlay--show-modal{opacity:1;pointer-events:auto}.swal-overlay--show-modal .swal-modal{opacity:1;pointer-events:auto;box-sizing:border-box;-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s;will-change:transform}.swal-modal{width:478px;opacity:0;pointer-events:none;background-color:#fff;text-align:center;border-radius:5px;position:static;margin:20px auto;display:inline-block;vertical-align:middle;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;z-index:10001;transition:opacity .2s,-webkit-transform .3s;transition:transform .3s,opacity .2s;transition:transform .3s,opacity .2s,-webkit-transform .3s}@media (max-width:500px){.swal-modal{width:calc(100% - 20px)}}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}',""]);},function(t,e){function n(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=o(r);return [n].concat(r.sources.map(function(t){return "/*# sourceURL="+r.sourceRoot+t+" */"})).concat([i]).join("\n")}return [n].join("\n")}function o(t){return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var o=n(e,t);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0);}for(r=0;r<t.length;r++){var a=t[r];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a));}},e};},function(t,e,n){function o(t,e){for(var n=0;n<t.length;n++){var o=t[n],r=m[o.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](o.parts[i]);for(;i<o.parts.length;i++)r.parts.push(u(o.parts[i],e));}else {for(var a=[],i=0;i<o.parts.length;i++)a.push(u(o.parts[i],e));m[o.id]={id:o.id,refs:1,parts:a};}}}function r(t,e){for(var n=[],o={},r=0;r<t.length;r++){var i=t[r],a=e.base?i[0]+e.base:i[0],s=i[1],c=i[2],l=i[3],u={css:s,media:c,sourceMap:l};o[a]?o[a].parts.push(u):n.push(o[a]={id:a,parts:[u]});}return n}function i(t,e){var n=v(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=w[w.length-1];if("top"===t.insertAt)o?o.nextSibling?n.insertBefore(e,o.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),w.push(e);else {if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e);}}function a(t){if(null===t.parentNode)return !1;t.parentNode.removeChild(t);var e=w.indexOf(t);e>=0&&w.splice(e,1);}function s(t){var e=document.createElement("style");return t.attrs.type="text/css",l(e,t.attrs),i(t,e),e}function c(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",l(e,t.attrs),i(t,e),e}function l(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n]);});}function u(t,e){var n,o,r,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i;}if(e.singleton){var l=h++;n=g||(g=s(e)),o=f.bind(null,n,l,!1),r=f.bind(null,n,l,!0);}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(e),o=p.bind(null,n,e),r=function(){a(n),n.href&&URL.revokeObjectURL(n.href);}):(n=s(e),o=d.bind(null,n),r=function(){a(n);});return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e);}else r();}}function f(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=x(e,r);else {var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i);}}function d(t,e){var n=e.css,o=e.media;if(o&&t.setAttribute("media",o),t.styleSheet)t.styleSheet.cssText=n;else {for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n));}}function p(t,e,n){var o=n.css,r=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&r;(e.convertToAbsoluteUrls||i)&&(o=y(o)),r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([o],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s);}var m={},b=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(t){var e={};return function(n){return void 0===e[n]&&(e[n]=t.call(this,n)),e[n]}}(function(t){return document.querySelector(t)}),g=null,h=0,w=[],y=n(15);t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||(e.singleton=b()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=r(t,e);return o(n,e),function(t){for(var i=[],a=0;a<n.length;a++){var s=n[a],c=m[s.id];c.refs--,i.push(c);}if(t){o(r(t,e),e);}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete m[c.id];}}}};var x=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}();},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,o=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var r=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r))return t;var i;return i=0===r.indexOf("//")?r:0===r.indexOf("/")?n+r:o+r.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})};},function(t,e,n){var o=n(17);"undefined"==typeof window||window.Promise||(window.Promise=o),n(21),String.prototype.includes||(String.prototype.includes=function(t,e){return "number"!=typeof e&&(e=0),!(e+t.length>this.length)&&-1!==this.indexOf(t,e)}),Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(t,e){if(null==this)throw new TypeError('"this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return !1;for(var r=0|e,i=Math.max(r>=0?r:o-Math.abs(r),0);i<o;){if(function(t,e){return t===e||"number"==typeof t&&"number"==typeof e&&isNaN(t)&&isNaN(e)}(n[i],t))return !0;i++;}return !1}}),"undefined"!=typeof window&&function(t){t.forEach(function(t){t.hasOwnProperty("remove")||Object.defineProperty(t,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){this.parentNode.removeChild(this);}});});}([Element.prototype,CharacterData.prototype,DocumentType.prototype]);},function(t,e,n){(function(e){!function(n){function o(){}function r(t,e){return function(){t.apply(e,arguments);}}function i(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],f(t,this);}function a(t,e){for(;3===t._state;)t=t._value;if(0===t._state)return void t._deferreds.push(e);t._handled=!0,i._immediateFn(function(){var n=1===t._state?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._state?s:c)(e.promise,t._value);var o;try{o=n(t._value);}catch(t){return void c(e.promise,t)}s(e.promise,o);});}function s(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if(e instanceof i)return t._state=3,t._value=e,void l(t);if("function"==typeof n)return void f(r(n,e),t)}t._state=1,t._value=e,l(t);}catch(e){c(t,e);}}function c(t,e){t._state=2,t._value=e,l(t);}function l(t){2===t._state&&0===t._deferreds.length&&i._immediateFn(function(){t._handled||i._unhandledRejectionFn(t._value);});for(var e=0,n=t._deferreds.length;e<n;e++)a(t,t._deferreds[e]);t._deferreds=null;}function u(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n;}function f(t,e){var n=!1;try{t(function(t){n||(n=!0,s(e,t));},function(t){n||(n=!0,c(e,t));});}catch(t){if(n)return;n=!0,c(e,t);}}var d=setTimeout;i.prototype.catch=function(t){return this.then(null,t)},i.prototype.then=function(t,e){var n=new this.constructor(o);return a(this,new u(t,e,n)),n},i.all=function(t){var e=Array.prototype.slice.call(t);return new i(function(t,n){function o(i,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(t){o(i,t);},n)}e[i]=a,0==--r&&t(e);}catch(t){n(t);}}if(0===e.length)return t([]);for(var r=e.length,i=0;i<e.length;i++)o(i,e[i]);})},i.resolve=function(t){return t&&"object"==typeof t&&t.constructor===i?t:new i(function(e){e(t);})},i.reject=function(t){return new i(function(e,n){n(t);})},i.race=function(t){return new i(function(e,n){for(var o=0,r=t.length;o<r;o++)t[o].then(e,n);})},i._immediateFn="function"==typeof e&&function(t){e(t);}||function(t){d(t,0);},i._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t);},i._setImmediateFn=function(t){i._immediateFn=t;},i._setUnhandledRejectionFn=function(t){i._unhandledRejectionFn=t;},void 0!==t&&t.exports?t.exports=i:n.Promise||(n.Promise=i);}(this);}).call(e,n(18).setImmediate);},function(t,e,n){function o(t,e){this._id=t,this._clearFn=e;}var r=Function.prototype.apply;e.setTimeout=function(){return new o(r.call(setTimeout,window,arguments),clearTimeout)},e.setInterval=function(){return new o(r.call(setInterval,window,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close();},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(window,this._id);},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e;},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1;},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));},n(19),e.setImmediate=setImmediate,e.clearImmediate=clearImmediate;},function(t,e,n){(function(t,e){!function(t,n){function o(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var o={callback:t,args:e};return l[c]=o,s(c),c++}function r(t){delete l[t];}function i(t){var e=t.callback,o=t.args;switch(o.length){case 0:e();break;case 1:e(o[0]);break;case 2:e(o[0],o[1]);break;case 3:e(o[0],o[1],o[2]);break;default:e.apply(n,o);}}function a(t){if(u)setTimeout(a,0,t);else {var e=l[t];if(e){u=!0;try{i(e);}finally{r(t),u=!1;}}}}if(!t.setImmediate){var s,c=1,l={},u=!1,f=t.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(t);d=d&&d.setTimeout?d:t,"[object process]"==={}.toString.call(t.process)?function(){s=function(t){e.nextTick(function(){a(t);});};}():function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1;},t.postMessage("","*"),t.onmessage=n,e}}()?function(){var e="setImmediate$"+Math.random()+"$",n=function(n){n.source===t&&"string"==typeof n.data&&0===n.data.indexOf(e)&&a(+n.data.slice(e.length));};t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("onmessage",n),s=function(n){t.postMessage(e+n,"*");};}():t.MessageChannel?function(){var t=new MessageChannel;t.port1.onmessage=function(t){a(t.data);},s=function(e){t.port2.postMessage(e);};}():f&&"onreadystatechange"in f.createElement("script")?function(){var t=f.documentElement;s=function(e){var n=f.createElement("script");n.onreadystatechange=function(){a(e),n.onreadystatechange=null,t.removeChild(n),n=null;},t.appendChild(n);};}():function(){s=function(t){setTimeout(a,0,t);};}(),d.setImmediate=o,d.clearImmediate=r;}}("undefined"==typeof self?void 0===t?this:t:self);}).call(e,n(7),n(20));},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(t){if(u===setTimeout)return setTimeout(t,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(t,0);try{return u(t,0)}catch(e){try{return u.call(null,t,0)}catch(e){return u.call(this,t,0)}}}function i(t){if(f===clearTimeout)return clearTimeout(t);if((f===o||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(t);try{return f(t)}catch(e){try{return f.call(null,t)}catch(e){return f.call(this,t)}}}function a(){b&&p&&(b=!1,p.length?m=p.concat(m):v=-1,m.length&&s());}function s(){if(!b){var t=r(a);b=!0;for(var e=m.length;e;){for(p=m,m=[];++v<e;)p&&p[v].run();v=-1,e=m.length;}p=null,b=!1,i(t);}}function c(t,e){this.fun=t,this.array=e;}function l(){}var u,f,d=t.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n;}catch(t){u=n;}try{f="function"==typeof clearTimeout?clearTimeout:o;}catch(t){f=o;}}();var p,m=[],b=!1,v=-1;d.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];m.push(new c(t,e)),1!==m.length||b||r(s);},c.prototype.run=function(){this.fun.apply(null,this.array);},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=l,d.addListener=l,d.once=l,d.off=l,d.removeListener=l,d.removeAllListeners=l,d.emit=l,d.prependListener=l,d.prependOnceListener=l,d.listeners=function(t){return []},d.binding=function(t){throw new Error("process.binding is not supported")},d.cwd=function(){return "/"},d.chdir=function(t){throw new Error("process.chdir is not supported")},d.umask=function(){return 0};},function(t,e,n){n(22).polyfill();},function(t,e,n){function o(t,e){if(void 0===t||null===t)throw new TypeError("Cannot convert first argument to object");for(var n=Object(t),o=1;o<arguments.length;o++){var r=arguments[o];if(void 0!==r&&null!==r)for(var i=Object.keys(Object(r)),a=0,s=i.length;a<s;a++){var c=i[a],l=Object.getOwnPropertyDescriptor(r,c);void 0!==l&&l.enumerable&&(n[c]=r[c]);}}return n}function r(){Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:o});}t.exports={assign:o,polyfill:r};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(24),r=n(6),i=n(5),a=n(36),s=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if("undefined"!=typeof window){var n=a.getOpts.apply(void 0,t);return new Promise(function(t,e){i.default.promise={resolve:t,reject:e},o.default(n),setTimeout(function(){r.openModal();});})}};s.close=r.onAction,s.getState=r.getState,s.setActionValue=i.setActionValue,s.stopLoading=r.stopLoading,s.setDefaults=a.setDefaults,e.default=s;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(0),i=r.default.MODAL,a=n(4),s=n(34),c=n(35),l=n(1);e.init=function(t){o.getNode(i)||(document.body||l.throwErr("You can only use SweetAlert AFTER the DOM has loaded!"),s.default(),a.default()),a.initModalContent(t),c.default(t);},e.default=e.init;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.MODAL;e.modalMarkup='\n  <div class="'+r+'" role="dialog" aria-modal="true"></div>',e.default=e.modalMarkup;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.OVERLAY,i='<div \n    class="'+r+'"\n    tabIndex="-1">\n  </div>';e.default=i;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.ICON;e.errorIconMarkup=function(){var t=r+"--error",e=t+"__line";return '\n    <div class="'+t+'__x-mark">\n      <span class="'+e+" "+e+'--left"></span>\n      <span class="'+e+" "+e+'--right"></span>\n    </div>\n  '},e.warningIconMarkup=function(){var t=r+"--warning";return '\n    <span class="'+t+'__body">\n      <span class="'+t+'__dot"></span>\n    </span>\n  '},e.successIconMarkup=function(){var t=r+"--success";return '\n    <span class="'+t+"__line "+t+'__line--long"></span>\n    <span class="'+t+"__line "+t+'__line--tip"></span>\n\n    <div class="'+t+'__ring"></div>\n    <div class="'+t+'__hide-corners"></div>\n  '};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.CONTENT;e.contentMarkup='\n  <div class="'+r+'">\n\n  </div>\n';},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.BUTTON_CONTAINER,i=o.default.BUTTON,a=o.default.BUTTON_LOADER;e.buttonMarkup='\n  <div class="'+r+'">\n\n    <button\n      class="'+i+'"\n    ></button>\n\n    <div class="'+a+'">\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n\n  </div>\n';},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(4),r=n(2),i=n(0),a=i.default.ICON,s=i.default.ICON_CUSTOM,c=["error","warning","success","info"],l={error:r.errorIconMarkup(),warning:r.warningIconMarkup(),success:r.successIconMarkup()},u=function(t,e){var n=a+"--"+t;e.classList.add(n);var o=l[t];o&&(e.innerHTML=o);},f=function(t,e){e.classList.add(s);var n=document.createElement("img");n.src=t,e.appendChild(n);},d=function(t){if(t){var e=o.injectElIntoModal(r.iconMarkup);c.includes(t)?u(t,e):f(t,e);}};e.default=d;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(2),r=n(4),i=function(t){navigator.userAgent.includes("AppleWebKit")&&(t.style.display="none",t.offsetHeight,t.style.display="");};e.initTitle=function(t){if(t){var e=r.injectElIntoModal(o.titleMarkup);e.textContent=t,i(e);}},e.initText=function(t){if(t){var e=document.createDocumentFragment();t.split("\n").forEach(function(t,n,o){e.appendChild(document.createTextNode(t)),n<o.length-1&&e.appendChild(document.createElement("br"));});var n=r.injectElIntoModal(o.textMarkup);n.appendChild(e),i(n);}};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(4),i=n(0),a=i.default.BUTTON,s=i.default.DANGER_BUTTON,c=n(3),l=n(2),u=n(6),f=n(5),d=function(t,e,n){var r=e.text,i=e.value,d=e.className,p=e.closeModal,m=o.stringToNode(l.buttonMarkup),b=m.querySelector("."+a),v=a+"--"+t;if(b.classList.add(v),d){(Array.isArray(d)?d:d.split(" ")).filter(function(t){return t.length>0}).forEach(function(t){b.classList.add(t);});}n&&t===c.CONFIRM_KEY&&b.classList.add(s),b.textContent=r;var g={};return g[t]=i,f.setActionValue(g),f.setActionOptionsFor(t,{closeModal:p}),b.addEventListener("click",function(){return u.onAction(t)}),m},p=function(t,e){var n=r.injectElIntoModal(l.footerMarkup);for(var o in t){var i=t[o],a=d(o,i,e);i.visible&&n.appendChild(a);}0===n.children.length&&n.remove();};e.default=p;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r=n(4),i=n(2),a=n(5),s=n(6),c=n(0),l=c.default.CONTENT,u=function(t){t.addEventListener("input",function(t){var e=t.target,n=e.value;a.setActionValue(n);}),t.addEventListener("keyup",function(t){if("Enter"===t.key)return s.onAction(o.CONFIRM_KEY)}),setTimeout(function(){t.focus(),a.setActionValue("");},0);},f=function(t,e,n){var o=document.createElement(e),r=l+"__"+e;o.classList.add(r);for(var i in n){var a=n[i];o[i]=a;}"input"===e&&u(o),t.appendChild(o);},d=function(t){if(t){var e=r.injectElIntoModal(i.contentMarkup),n=t.element,o=t.attributes;"string"==typeof n?f(e,n,o):e.appendChild(n);}};e.default=d;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(2),i=function(){var t=o.stringToNode(r.overlayMarkup);document.body.appendChild(t);};e.default=i;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(5),r=n(6),i=n(1),a=n(3),s=n(0),c=s.default.MODAL,l=s.default.BUTTON,u=s.default.OVERLAY,f=function(t){t.preventDefault(),v();},d=function(t){t.preventDefault(),g();},p=function(t){if(o.default.isOpen)switch(t.key){case"Escape":return r.onAction(a.CANCEL_KEY)}},m=function(t){if(o.default.isOpen)switch(t.key){case"Tab":return f(t)}},b=function(t){if(o.default.isOpen)return "Tab"===t.key&&t.shiftKey?d(t):void 0},v=function(){var t=i.getNode(l);t&&(t.tabIndex=0,t.focus());},g=function(){var t=i.getNode(c),e=t.querySelectorAll("."+l),n=e.length-1,o=e[n];o&&o.focus();},h=function(t){t[t.length-1].addEventListener("keydown",m);},w=function(t){t[0].addEventListener("keydown",b);},y=function(){var t=i.getNode(c),e=t.querySelectorAll("."+l);e.length&&(h(e),w(e));},x=function(t){if(i.getNode(u)===t.target)return r.onAction(a.CANCEL_KEY)},_=function(t){var e=i.getNode(u);e.removeEventListener("click",x),t&&e.addEventListener("click",x);},k=function(t){o.default.timer&&clearTimeout(o.default.timer),t&&(o.default.timer=window.setTimeout(function(){return r.onAction(a.CANCEL_KEY)},t));},O=function(t){t.closeOnEsc?document.addEventListener("keyup",p):document.removeEventListener("keyup",p),t.dangerMode?v():g(),y(),_(t.closeOnClickOutside),k(t.timer);};e.default=O;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(37),a=n(38),s={title:null,text:null,icon:null,buttons:r.defaultButtonList,content:null,className:null,closeOnClickOutside:!0,closeOnEsc:!0,dangerMode:!1,timer:null},c=Object.assign({},s);e.setDefaults=function(t){c=Object.assign({},s,t);};var l=function(t){var e=t&&t.button,n=t&&t.buttons;return void 0!==e&&void 0!==n&&o.throwErr("Cannot set both 'button' and 'buttons' options!"),void 0!==e?{confirm:e}:n},u=function(t){return o.ordinalSuffixOf(t+1)},f=function(t,e){o.throwErr(u(e)+" argument ('"+t+"') is invalid");},d=function(t,e){var n=t+1,r=e[n];o.isPlainObject(r)||void 0===r||o.throwErr("Expected "+u(n)+" argument ('"+r+"') to be a plain object");},p=function(t,e){var n=t+1,r=e[n];void 0!==r&&o.throwErr("Unexpected "+u(n)+" argument ("+r+")");},m=function(t,e,n,r){var i=typeof e,a="string"===i,s=e instanceof Element;if(a){if(0===n)return {text:e};if(1===n)return {text:e,title:r[0]};if(2===n)return d(n,r),{icon:e};f(e,n);}else {if(s&&0===n)return d(n,r),{content:e};if(o.isPlainObject(e))return p(n,r),e;f(e,n);}};e.getOpts=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n={};t.forEach(function(e,o){var r=m(0,e,o,t);Object.assign(n,r);});var o=l(n);n.buttons=r.getButtonListOpts(o),delete n.button,n.content=i.getContentOpts(n.content);var u=Object.assign({},s,c,n);return Object.keys(u).forEach(function(t){a.DEPRECATED_OPTS[t]&&a.logDeprecation(t);}),u};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r={element:"input",attributes:{placeholder:""}};e.getContentOpts=function(t){var e={};return o.isPlainObject(t)?Object.assign(e,t):t instanceof Element?{element:t}:"input"===t?r:null};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.logDeprecation=function(t){var n=e.DEPRECATED_OPTS[t],o=n.onlyRename,r=n.replacement,i=n.subOption,a=n.link,s=o?"renamed":"deprecated",c='SweetAlert warning: "'+t+'" option has been '+s+".";if(r){c+=" Please use"+(i?' "'+i+'" in ':" ")+'"'+r+'" instead.';}var l="https://sweetalert.js.org";c+=a?" More details: "+l+a:" More details: "+l+"/guides/#upgrading-from-1x",console.warn(c);},e.DEPRECATED_OPTS={type:{replacement:"icon",link:"/docs/#icon"},imageUrl:{replacement:"icon",link:"/docs/#icon"},customClass:{replacement:"className",onlyRename:!0,link:"/docs/#classname"},imageSize:{},showCancelButton:{replacement:"buttons",link:"/docs/#buttons"},showConfirmButton:{replacement:"button",link:"/docs/#button"},confirmButtonText:{replacement:"button",link:"/docs/#button"},confirmButtonColor:{},cancelButtonText:{replacement:"buttons",link:"/docs/#buttons"},closeOnConfirm:{replacement:"button",subOption:"closeModal",link:"/docs/#button"},closeOnCancel:{replacement:"buttons",subOption:"closeModal",link:"/docs/#buttons"},showLoaderOnConfirm:{replacement:"buttons"},animation:{},inputType:{replacement:"content",link:"/docs/#content"},inputValue:{replacement:"content",link:"/docs/#content"},inputPlaceholder:{replacement:"content",link:"/docs/#content"},html:{replacement:"content",link:"/docs/#content"},allowEscapeKey:{replacement:"closeOnEsc",onlyRename:!0,link:"/docs/#closeonesc"},allowClickOutside:{replacement:"closeOnClickOutside",onlyRename:!0,link:"/docs/#closeonclickoutside"}};}])});
    });

    var swal = /*@__PURE__*/getDefaultExportFromCjs(sweetalert_min);

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
          if (_modifier[k] === key) hotkeys[k] = false;
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


    function dispatch(event) {
      var asterisk = _handlers['*'];
      var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

      if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
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
          if (_modifier[k] === key) hotkeys[k] = true;
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

    function hotkeys(key, option, method) {
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
          dispatch(e);
        });
        addEvent(window, 'focus', function () {
          _downKeys = [];
        });
        addEvent(element, 'keyup', function (e) {
          dispatch(e);
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
        hotkeys[a] = _api[a];
      }
    }

    if (typeof window !== 'undefined') {
      var _hotkeys = window.hotkeys;

      hotkeys.noConflict = function (deep) {
        if (deep && window.hotkeys === hotkeys) {
          window.hotkeys = _hotkeys;
        }

        return hotkeys;
      };

      window.hotkeys = hotkeys;
    }

    /**
     *  File Name   : dndString.js
     *  Author      : Ayush Srivastava
     *  Function    : DND
     *  Version     : 1.0
     *  Packege     : Drag and Drop (prev)
     *  Last update : 19 Jan 2021
     *  Dependency  : Draggable, Sweetalert, Hotkeys-js
     */
    let jsSwal = swal;

    // declaring gloabl variable for use
    let elemId = "#dndmainPreview";
    let result = true;
    let stepsPreview = null;
    let dragstore = {};
    let user_points = 0;
    const DND = {};
    let is_all_correct = true;

    // for storing to prevent dialog
    DND.prevent_dialog = false;
    //window.DND = DND;
    // for storing the storage data
    DND.storage = {
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
        remove: function(obj) {
            if (this.state[obj]) {
                delete this.state[obj];
            }
        },
        state: {}
    };

    // for setting the browser version
    DND.browser = {};
    DND.browser.msie = false;
    DND.browser.version = 0;
    if (typeof navigator !== 'undefined' && navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        DND.browser.msie = true;
        DND.browser.version = RegExp.$1;
    }


    // function responsible for parsing the sql queries
    DND.sqlparser = function(sql, type) {
        if (typeof(type) !== "boolean") {
            type = false;
        }
        let ret = [];
        if (type) {
            ret['optional'] = [], ret['mustbeone'] = [];
            let matches = sql.match(/{.*?}/g);
            if (matches != null) {
                for (let i = 0; i < matches.length; i++) {
                    sql = sql.replace(matches[i], "");
                    opt = matches[i].trim();
                    let opt = opt.substr(1, (opt.length - 2));
                    if (opt.indexOf('|') != -1) {
                        opt = opt.split('|');
                        ret['mustbeone'].push(opt);
                    } else {
                        ret['optional'].push(opt);
                    }
                }
            }
        }
        ret['sql'] = sql.toLowerCase().replace(/([?~!@#$%^&*()_+\-=\[\]{};':",\./\<>%])/g, ' $1 ').replace(/[;]/g, ' ').trim().replace(/(,|`|\n)/g, " ").replace(/\s{2,}/g, " ").split(' ');
        return ret;
    };

    // modifying string prototype
    String.prototype.sqlparser = function(type) {
        return DND.sqlparser(this.toString(), type);
    };

    // function responsible for setting/changing the steps
    DND.setStep = function(tabname) {
        tabname = tabname.match(/dnd/g) || (tabname == "base") ? tabname : "dnd" + tabname;
        if (tabname && tabname.trim() != '') {
            let dndid;
            let tabname_element = document.querySelector('#' + tabname);
            let tabname_closest = (tabname_element) ? tabname_element.closest('[id^="dndmainPreview"]') : false;
            if (tabname_closest) {
                dndid = '#' + tabname_closest.getAttribute('id');
            }
            if (dndid) {
                let element = document.querySelector(elemId);
                if (element) {
                    let new_element = AI.find(element, "[type='step']", 'all');
                    for (let index = 0; index < new_element.length; index++) {
                        AI.setCss(new_element[index], {
                            display: "none",
                        });
                    }
                }
                let dnd_element = AI.select(dndid);

                if (tabname == "base") {
                    let dnd_find_element = AI.find(dnd_element, '#base');
                    AI.selectAll(dnd_find_element, 'checked', true);
                } else {
                    AI.select("#step_" + tabname, 'checked', true);
                    let element_list = AI.find(dnd_element, "#" + tabname);
                    AI.setCss(element_list.parentElement, {
                        display: 'block',
                    });
                    AI.setCss(element_list, {
                        display: 'block',
                    });
                }
            }
        }
    };

    // making this global as it is used outside the code
    if (typeof window !== 'undefined') {
        window.setStep = DND.setStep;
    }

    // function for wrapping the element into other element
    DND.wrapInner = function(parent, wrapper, attribute, attributevalue) {
        try {
            if (typeof wrapper === "string") {
                wrapper = document.createElement(wrapper);
            }
            parent.appendChild(wrapper).setAttribute(attribute, attributevalue);
            while (parent.firstChild !== wrapper) {
                wrapper.appendChild(parent.firstChild);
            }
        } catch (error) {
            console.warn(error);
        }
    };

    // function for activator in preview side
    DND.activate = function(type = 0) {
        if (type != 0 && document.querySelectorAll('.spinner').length == 0) {
            let spinner = document.createElement("div");
            spinner.className = "spinner";
            let loading = document.createElement("div");
            loading.className = "loading";
            spinner.appendChild(loading);
            if (document.body != null) {
                document.body.appendChild(spinner);
            }
        } else {
            !!document.getElementsByClassName('spinner')[0] && document.getElementsByClassName('spinner')[0].remove();
        }
    };

    // function responsible for binding all the events to the elments
    DND.readyThis = function(dndid) {
        let dndid_element = AI.select(dndid);
        let elements_list = AI.find(dndid, '[zoom="1"]', 'all');
        if (elements_list.length > 0) {
            elements_list.forEach(function(value) {
                DND.wrapInner(value, 'div', 'class', 'zoom_wrap');
                DND.wrapInner(value, 'div', 'class', 'zoom_container');

                let div = document.createElement("div");
                div.class = 'c_zoom';
                let input = document.createElement("input");
                input.type = 'range';
                input.id = 'c_zoom';
                input.min = "1";
                input.max = "7";
                div.append(input);
                value.appendChild(div);
                value.insertBefore(div, value.firstChild);
            });
        }

        // nee to check I think we have to use listen all
        AI.listen('body', 'change', '.c_zoom', function(element) {
            let zoom_element = AI.find(element.parentElement.parentElement, '.zoom_wrap');
            if (zoom_element) {
                switch (element.value) {
                    case "1": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom2");
                        break;
                    }
                    case "2": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom2");
                        break;
                    }
                    case "3": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom3");
                        break;
                    }
                    case "4": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom4");
                        break;
                    }
                    case "5": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom5");
                        break;
                    }
                    case "6": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom6");
                        break;
                    }
                    case "7": {
                        zoom_element.setAttribute("class", "zoom_wrap zoom7");
                        break;
                    }
                }
            }
        });

        AI.listen('body', 'click', '.hotspot_test', function(element, event) {
            if (element.classList.contains('lab_disable')) {
                return;
            }
            let targetimg_element = AI.find(dndid_element, '.targetImg');
            if (!event.target.classList.contains('tmpTarget') && AI.find(element, '.hs_item', 'all').length > AI.find(element, '.tmpTarget', 'all').length) {
                let top = Math.round(event.pageY - DND.offset(element).top - ((targetimg_element) ? (targetimg_element.offsetHeight ? targetimg_element.offsetHeight : 32) : 0) / 2) - window.pageYOffset;
                let left = Math.round(event.pageX - DND.offset(element).left - ((targetimg_element) ? (targetimg_element.offsetHeight ? targetimg_element.offsetHeight : 32) : 0) / 2) - window.pageXOffset;
                if (event.target.getAttribute('id') != "c_zoom") {
                    if (event.target.classList.contains('hs_item')) {
                        event.target.setAttribute("data-correctans", "1");
                    }

                    let clone_element = AI.clone(targetimg_element);
                    clone_element.classList.remove('targetImg');
                    clone_element.classList.add('tmpTarget');
                    clone_element.id = element.id + "_" + (AI.find(element, '.tmpTarget', 'all').length + 1);
                    AI.setCss(clone_element, {
                        position: 'absolute',
                        top: top + 'px',
                        left: left + 'px',
                        display: 'block',
                    });
                    DND.storage.store(clone_element.id, 'tgElem', event.target.id);
                    AI.insertAfter(clone_element, AI.find(element, '.hs_item', 'all')[AI.find(element, '.hs_item', 'all').length - 1]);
                }
            } else if (event.target.classList.contains('tmpTarget')) {
                let last_id = event.target.id.split('_')[1];
                let tgElem = DND.storage.store(event.target.id, 'tgElem');
                event.target.remove();

                if (last_id) {
                    for (let index = (last_id - 1); index < AI.find(element, '.tmpTarget', 'all').length; index++) {
                        let current_id = element.id + "_" + (index + 1);
                        let next_elem_id = element.id + "_" + (index + 2);
                        let next_elem_store = DND.storage.store(next_elem_id, 'tgElem');
                        DND.storage.store(current_id, 'tgElem', next_elem_store);
                        DND.storage.remove(next_elem_id);
                        AI.select('#' + next_elem_id).id = current_id;
                    }
                }

                if (typeof(tgElem) !== "undefined") {
                    let rmTg = true;
                    let tmp_target = AI.find(dndid_element, '.tmpTarget', 'all');

                    for (let index = 0; index < tmp_target.length; index++) {
                        if (DND.storage.store(tmp_target[index].id, 'tgElem') == tgElem) {
                            rmTg = false;
                            break;
                        }
                    }
                    if (rmTg) {
                        AI.select('#dndmainPreview #' + tgElem).setAttribute("data-correctans", "0");
                    }
                }
            }

            let hustr = "";
            let hId = 1;

            let tmp_target = AI.find(dndid_element, '.tmpTarget', 'all');

            for (let index = 0; index < tmp_target.length; index++) {
                hustr += '"' + hId + '":[' + tmp_target[index].offsetTop + ',' + tmp_target[index].offsetLeft + ',' + tmp_target[index].offsetWidth + ',' + tmp_target[index].offsetHeight + '],';
                hId++;
            }
            element.setAttribute("data-userans", "{" + hustr.substr(0, hustr.length - 1) + "}");
            DND.checkAns(dndid);
        });

        let drop_image = AI.find(dndid_element, '[data-dragimage]', 'all');

        for (let index = 0; index < drop_image.length; index++) {
            if (drop_image[index].getAttribute('data-dragimage') != 'undefined' && drop_image[index].getAttribute('data-dragimage') != '') {
                let bgimage = drop_image[index].getAttribute("data-path") + drop_image[index].getAttribute("data-dragimage");
                AI.insert('body', '<img src="' + bgimage + '" style="display:none"/>', 'beforeend');
            }
        }

        let droppable = AI.selectAll('.dropable');
        for (let index = 0; index < droppable.length; index++) {
            let target = droppable[index].id;
            let source = droppable[index].dataset.droped;
            if (target && source) {
                dragstore[target] = [AI.select('#' + source), AI.select('#' + target)];
            }
        }

        let draggable = new Draggable('#dndmainPreview', '[draging]', '[droping]', dragstore);
        let distance = 80, step = 5;
        draggable.onDrag = function(event) {
            if (event.clientY <= distance) {
                window.scrollTo(0, window.scrollY - step);
            } else if (event.clientY >= (window.innerHeight + 20)) {
                window.scrollTo(0, window.scrollY + step);
            }
            if (AI.selectAll('#external_lab').length == 1) {
                AI.select('#external_lab').scrollTo(event.clientX, event.clientY);
            }
            if (AI.selectAll('#user_answer').length == 1) {
                AI.select('#user_answer').scrollTo(event.clientX, event.clientY);
            }
        };

        draggable.onDragStart = function(event, element) {
            let target = element;
            let img, bgimage;
            if (element.classList.contains('dropable') && target.getAttribute('data-droped') && target.getAttribute('data-droped').trim() != '') {
                target = AI.find(dndid, '#' + target.getAttribute('data-droped'));
            }

            if (typeof(target.getAttribute('data-dragimage')) != 'undefined' && target.getAttribute('data-dragimage') != '') {
                bgimage = "url(" + target.getAttribute("data-path") + target.getAttribute("data-dragimage") + ")";
            } else {
                bgimage = target.style.backgroundImage;
            }
            if (bgimage == "none" || bgimage == "") {
                img = {
                    "width": target.offsetWidth,
                    "height": target.offsetHeight,
                };
            } else {
                img = new Image();
                img.src = bgimage.substr(4, (bgimage.length - 5));
            }

            let copied_node = element.cloneNode(true);
            copied_node.removeAttribute('droping');
            copied_node.style.position = 'absolute';
            copied_node.style.zIndex = 0;
            copied_node.backgroundImage = bgimage;
            copied_node.style.width = img.width + "px";
            copied_node.style.height = img.height + "px";
            return copied_node;
        };

        draggable.onDrop = function(source, target) {
            let copied = source.cloneNode(true);
            target.style.backgroundColor = copied.getAttribute('data-bgcolor');
            target.setAttribute('draging', 2);
            target.setAttribute('droping', 2);

            // for disabling the dragable
            if (source.getAttribute("data-multi_drag") == "0") {
                source.classList.add('uc_drag_disable');
                source.style.setProperty("cursor", "no-drop", "important");
                source.style.setProperty("opacity", "0.5", "important");
            }

            target.classList.remove('drop-hover');
            target.style.opacity = '1';

            let drop_id = source.getAttribute('data-droped') ? source.getAttribute('data-droped') : source.getAttribute('id');
            let bgimage = '';
            if (source.getAttribute('data-dropimage') && source.getAttribute('data-dropimage') != '') {
                bgimage = "url(" + source.getAttribute('data-path') + source.getAttribute('data-dropimage') + ")";
            } else {
                bgimage = source.style.backgroundImage;
            }

            if (DND.browser.msie && drop_id && AI.find(AI.select(dndid), '#' + drop_id).innerText.trim() == "") {
                source.style.backgroundColor = "transparent";
            }

            target.setAttribute('data-userans', drop_id);
            target.setAttribute('data-droped', drop_id);
            target.setAttribute('data-path', source.getAttribute('data-path'));
            target.setAttribute('data-dropimage', source.getAttribute('data-dropimage'));
            target.setAttribute('data-dragimage', source.getAttribute('data-dragimage'));

            AI.setCss(target, {
                backgroundColor: source.style.backgroundColor,
                backgroundImage: bgimage
            });
            // changes for php
            if(AI.select(copied) != undefined) { 
                AI.find(target, 'p').innerText = AI.select(copied).innerText.trim();
            } else {
                AI.find(target, 'p').innerText = copied.innerText.trim();
            }
           

            setTimeout(function() {
                DND.checkAns(dndid);
            }, 500);

        };

        draggable.isRevert = function() {
            if (DND.prevent_dialog) {
                return false;
            }
            AI.showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 3000);
            let img = document.createElement('img');
            img.src = '//s3.amazonaws.com/jigyaasa_content_static/how-to-drop-final_000BeI.gif';
            img.alt = 'How to Drop?';
            let div = document.createElement('div');
            let content = document.createElement('div');
            let input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'prevent_dialog';
            //AI.select('#prevent_dialog').parentElement.classList.add('check');
            input.classList.add('mr-1');
            input.onchange = function() {
                DND.prevent_dialog = this.checked;
                if (this.checked) {
                    jsSwal.close();
                }

            };
            let label = document.createElement('label');
            label.setAttribute('for', 'prevent_dialog');
            label.innerText = "Don't show me message again!";

            content.append(img);
            div.append(input);
            div.append(label);
            content.append(div);
            // Added the close button (X) at the top right side in sweetalert modal.
            jsSwal = function() {
                swal(arguments[0]);
                if (arguments[0].showCloseButton) {
                    let closeButton = document.createElement('button');
                    closeButton.className = 'swal2-close close';
                    closeButton.onclick = function() { swal.close(); };
                    closeButton.textContent = '×';
                    closeButton.classList.add('position-relative');
                    closeButton.style.bottom = '220px';
                    closeButton.style.right = '10px';
                    let modal = document.querySelector('.swal-modal');
                    AI.select('.swal-text').style.marginTop='23px';
                    AI.select('.swal-text').style.marginBottom='10px';
                    AI.select('.swal-text').style.float = 'left';
                    modal.appendChild(closeButton);
                }
            };

            jsSwal({
                text: "How to Drop?",
                content: content,
                //timer: 10000,
                buttons: false,
                showCloseButton: true
            });

        };

        draggable.onRemove = function(source, target) {
            source.removeAttribute('draging');
            source.setAttribute('droping', 1);

            // for disabling the dragable
            if (target) {
                target.classList.remove('uc_drag_disable');
                target.style.cursor = '';
                target.style.opacity = '';
            }

            source.classList.remove('drop-hover');
            source.style.opacity = '1';

            source.setAttribute('data-userans', '');
            source.setAttribute('data-droped', '');
            source.style.backgroundColor = source.getAttribute('data-bgcolor');
            source.style.backgroundImage = source.getAttribute('data-bgimage');
            AI.find(source, 'p').innerText = source.getAttribute('data-caption');
            setTimeout(function() {
                DND.checkAns(dndid);
            }, 500);
        };

        draggable.onOver = function(element) {
            try {
                let hoverImg = "";
                if (element.getAttribute("hoverimage")) {
                    hoverImg = element.getAttribute("data-path") + element.getAttribute("hoverimage");
                }
                if (element.style.backgroundImage.match(/undefined/) || element.style.backgroundImage.match(/none/)) {
                    element.style.backgroundImage = "url(" + hoverImg + ")";
                }
            } catch (e) {
                console.warn(e);
            }
        };

        draggable.onOut = function(element) {
            try {
                let hoverImg = "none";
                if (element.getAttribute("hoverimage")) {
                    hoverImg = element.getAttribute("hoverimage");
                }
                if (element.style.backgroundImage.search(hoverImg) != -1) {
                    element.style.backgroundImage = "";
                }
            } catch (e) {
                console.warn(e);
            }
        };

        AI.listen('body', 'dblclick', dndid + ' [detail]', function(element, event) {
            try {
                if (element.closest(dndid)) {
                    if (element.getAttribute('data-detail').length == 5) {
                        DND.activate(1);
                        AI.ajax({
                            url: baseUrl + 'index.php',
                            data: {
                                "lab_detail": element.getAttribute('data-detail'),
                                "ajax": "1"
                            },
                            longUrl: true
                        }).then(function(response) {
                            DND.activate(0);
                            if (AI.selectAll('.detail-modal').length < 1) {
                                AI.insert('#main-page', '<div id="modal-from-detail" class="detail-modal modal fade" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content no-padding"><span class="close-icon" data-dismiss="modal" aria-hidden="true"></span><div class="detail_data">' + response + '</div></div></div></div>', 'beforeend');
                            } else {
                                AI.select('.detail-modal .detail_data').innerHTML = response;
                            }
                            AI.getBS('#modal-from-detail', 'Modal').show();
                        });
                    } else if (element.getAttribute('data-detail') != '') {
                        if (AI.select('.detail').length < 1) {
                            AI.insert('body', '<div class="detail"><span class="close_detail">&times;</span><div class="detail_data">' + element.getAttribute('data-detail') + '</div></div>', 'beforeend');
                            AI.setCss(AI.select('.detail'), {
                                "top": event.pageY + "px",
                                "left": event.pageX + "px",
                                'display': 'block',
                            });
                        } else {
                            AI.select('.detail .detail_data').innerText = element.getAttribute('data-detail');
                            AI.setCss(AI.select('.detail .detail_data'), {
                                "top": event.pageY + "px",
                                "left": event.pageX + "px",
                                'display': 'block',
                            });
                        }
                    }
                }
            } catch (error) {
                console.warn(error);
            }
        });

        AI.listen('body', 'click', '.close_detail', function() {
            AI.select('.detail').nodeName && AI.select('.detail').remove();
        });

        let index = 1;

        AI.listen('body', 'click', dndid + ' [image]', function(element) {
            try {
                let toggleImg = element.getAttribute('image').split(',');
                element.style.backgroundImage = "url(" + element.getAttribute('data-path') + toggleImg[index] + ")";
                index++;
                if (toggleImg.length == index) index = 0;
            } catch (error) {
                console.warn(error);
            }
        });
    };

    // for changing the draggable state
    DND.draggable = function(element, enable) {
        if (enable) {
            element.classList.remove('uc_drag_disable');
            element.style.cursor = '';
            element.style.opacity = 1;
        } else {
            element.classList.add('uc_drag_disable');
            element.style.setProperty("cursor", "no-drop", "important");
            element.style.setProperty("opacity", "0.7", "important");
        }
    };

    // function for moving the focus to the next or previous elements
    DND.tabMove = function(element, type = 1) {
        if (element.id) {
            let ks_element = AI.selectAll('.ks');
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
    };

    // fucntion for checking the containment of hotspot area, it runs in case of keyboard
    DND.checkContainment = function(element, extra_top = 0, extra_left = 0) {
        let top = parseInt(element.style.top.replace("px", "")) + extra_top;
        let left = parseInt(element.style.left.replace("px", "")) + extra_left;
        let width = parseInt(element.parentElement.style.width.replace("px", ""));
        let height = parseInt(element.parentElement.style.height.replace("px", ""));

        if (left > (width - element.offsetWidth)) {
            left = width - element.offsetWidth;
        } else if (left < 0) {
            left = 0;
        }

        if (top > (height - element.offsetHeight)) {
            top = height - element.offsetHeight;
        } else if (top < 0) {
            top = 0;
        }
        return {
            top: top,
            left: left
        };
    };

    // function reponisble for binding the key up events (keyboard related events)
    DND.bindKeyUp = function(dndid) {
        let dndid_elements = AI.find(dndid, "[id^=dndID]", 'all');
        for (let index = 0; index < dndid_elements.length; index++) {
            if (dndid_elements[index].getAttribute('type') != 'tab' && !(dndid_elements[index].classList.contains("dndlabel"))) {
                dndid_elements[index].classList.add('ks');
            }
        }

        let count = 0;
        let copied_id = "";
        let ee = {
            clientX: 16,
            clientY: 16
        };

        AI.find(dndid, ".selmatch", {
            action: 'removeClass',
            actionData: 'selmatch'
        });

        let elements = AI.selectAll('.ks');


        function sortBy(prop, prop2) {
            return function(a, b) {
                let filter_a = parseInt(a.style[prop]);
                let filter_b = parseInt(b.style[prop]);
                if (filter_a == filter_b) {
                    let filter_c = parseInt(a.style[prop2]);
                    let filter_d = parseInt(b.style[prop2]);
                    return filter_c < filter_d ? -1 : (filter_c > filter_d ? 1 : 0);
                }
                return filter_a < filter_b ? -1 : (filter_a > filter_b ? 1 : 0);
            }
        }

        function sortDom(filter, second_filter) {
            //Transform our nodeList into array and apply sort function
            return [].map.call(elements, function(elm) {
                return elm;
            }).sort(sortBy(filter, second_filter))
        }
        
        //Sort by top style property
        let byTop = sortDom('top', "left");

        for (let index = 0; index < byTop.length; index++) {
            let id = byTop[index].getAttribute('id');
            let parent = byTop[index].parentElement;
            if (id) {
                AI.find(dndid, "#" + id, {
                    action: 'remove'
                });
            }
            if (parent) {
                parent.append(byTop[index]);
            }
        }

        // function for focusing first element
        function focusFirst() {
            let ks_element = AI.selectAll('.ks');
            if (ks_element.length > 0) {
                let elem = AI.select('.ks');
                let first_child = elem.children[0];
                if (first_child && (first_child.classList.contains("dnd_textbox") || first_child.classList.contains("dndcheckbox") || first_child.classList.contains("dnd_select"))) {
                    first_child.focus();
                } else if (AI.find(elem, ".customRad", 'all').length != 0) {
                    AI.find(elem, ".customRad").focus();
                } else {
                    elem.focus();
                }
            }
        }

        // function for focusing last element
        function focusLast() {
            let ks_element = AI.selectAll('.ks');
            if (ks_element.length > 0) {
                let elem = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];
                let last_child = elem.children[0];
                if (last_child && (last_child.classList.contains("dnd_textbox") || last_child.classList.contains("dndcheckbox") || last_child.classList.contains("dnd_select"))) {
                    last_child.focus();
                } else if (AI.find(elem, ".customRad", 'all').length != 0) {
                    AI.find(elem, ".customRad").focus();
                } else {
                    elem.focus();
                }
            }
        }

        // function for checking the focus
        function checkFocus(list, img = 0) {
            let is_focus = false;
            let elements = AI.find(dndid, "." + list, 'all');
            let focus_el = (img) ? AI.select('.tmpTarget:focus') : AI.select('.ks:focus');
            if (focus_el.nodeName) {
                let focus_id = focus_el.getAttribute('id');
                for (let index = 0; index < elements.length; index++) {
                    if (focus_id == elements[index].getAttribute('id')) {
                        is_focus = true;
                        break;
                    }
                }
            }
            return is_focus;
        }

        // function for removing the draggable using keyboard
        function removeDraggable(event) {
            let removethis = event.target;
            let dropedNode = removethis.getAttribute('data-droped');
            if (removethis.classList.contains('dropable') && dropedNode != "") {
                AI.setCss(removethis, {
                    backgroundColor: removethis.getAttribute('data-bgcolor'),
                    backgroundImage: removethis.getAttribute('data-bgimage'),
                });

                removethis.setAttribute('data-droped', "");
                removethis.setAttribute('data-userans', "");
                removethis.setAttribute('droping', "1");
                removethis.removeAttribute('draging');

                if (AI.select('#' + dropedNode).getAttribute('data-multi_drag') == '0') {
                    DND.draggable(AI.select('#' + dropedNode), 1);
                }

                if (dragstore && dragstore[removethis.id]) {
                    delete dragstore[removethis.id];
                }

                AI.find(removethis, 'p').innerText = removethis.getAttribute('data-caption');
            }
            let check_ans_timer = setTimeout(function() {
                DND.checkAns(dndid);
                clearTimeout(check_ans_timer);
            }, 100);
        }

        // function for navigating down
        function navigateDown() {
            AI.find(dndid, ".selmatch", {
                action: 'removeClass',
                actionData: 'selmatch'
            });
            let ks_element = AI.selectAll(".ks");
            let ks_length = ks_element.length;

            let ks_fill = ks_element[count];

            if (ks_fill) {
                if (ks_fill.children[0] && (ks_fill.children[0].classList.contains("dnd_textbox") || ks_fill.children[0].classList.contains("dndcheckbox") || ks_fill.children[0].classList.contains("dnd_select"))) {
                    ks_fill.children[0].focus();
                } else if (AI.find(ks_fill, '.customRad', 'all').length != 0) {
                    AI.find(ks_fill, '.customRad').focus();
                } else {
                    ks_fill.focus();
                }
            }


            if (count == (ks_length - 1)) {
                count = 0;
            } else {
                count++;
            }
        }


        // function for enabling the hotspot using keyboard
        function hotSpotKeyboard() {
            let ks = AI.selectAll('.ks');
            for (let index = 0; index < ks.length; index++) {
                if (ks[index].classList.contains('hotspot_test')) {
                    let hotspot_this = ks[index];
                    let child = hotspot_this.children;
                    for (let sub_index = 0; sub_index < child.length; sub_index++) {
                        if (child[sub_index].classList.contains("drag-resize") && (AI.find(hotspot_this, '.hs_item', 'all').length > AI.find(hotspot_this, '.tmpTarget', 'all').length)) {
                            let top = Math.round(ee.clientY - (AI.find(dndid, '.targetImg').offsetHeight / 2));
                            let left = Math.round(ee.clientX - (AI.find(dndid, '.targetImg').offsetWidth / 2));
                            if (hotspot_this.getAttribute('id') != 'c_zoom') {
                                if (AI.find(dndid, '.targetImg')) {
                                    let clonenode = AI.find(dndid, '.targetImg').cloneNode(true);
                                    clonenode.classList.remove('targetImg');
                                    clonenode.classList.add('tmpTarget');
                                    clonenode.id = hotspot_this.id + "_" + (AI.find(hotspot_this, '.tmpTarget', 'all').length + 1);

                                    AI.setCss(clonenode, {
                                        position: 'absolute',
                                        top: top + "px",
                                        left: left + "px",
                                        display: 'block'
                                    });

                                    // need to check here
                                    DND.storage.store(clonenode.id, 'tgElem', hotspot_this.id);
                                    AI.insertAfter(clonenode, AI.find(hotspot_this, '.hs_item', 'all')[AI.find(hotspot_this, '.hs_item', 'all').length - 1]);
                                }
                            }
                            let tmp_target = AI.find(dndid, '.tmpTarget', 'all');

                            let hustr = "";
                            let hId = 1;
                            for (let tmp_index = 0; tmp_index < tmp_target.length; tmp_index++) {
                                hustr += '"' + hId + '":[' + tmp_target[tmp_index].offsetTop + ',' + tmp_target[tmp_index].offsetLeft + ',' + tmp_target[tmp_index].offsetWidth + ',' + tmp_target[tmp_index].offsetHeight + '],';
                                hId++;
                            }
                            hotspot_this.setAttribute("data-userans", "{" + hustr.substr(0, hustr.length - 1) + "}");
                            DND.checkAns(dndid);
                            ee.clientX += 35;
                        }
                    }
                    DND.setHotspotans(hotspot_this);
                }
            }
        }

        // function for moving the hotspot image
        function moveTargetImg(top, left) {
            let hotspot_test = AI.select(".hotspot_test");

            if (hotspot_test.getAttribute('id') != "c_zoom") {
                AI.setCss(AI.find(dndid, '.tmpTarget:focus'), {
                    position: "absolute",
                    top: top + "px",
                    left: left + "px"
                });
            }

            let tmp_target = AI.find(dndid, '.tmpTarget', 'all');
            let hustr = "";
            let hId = 1;
            for (let tmp_index = 0; tmp_index < tmp_target.length; tmp_index++) {
                hustr += '"' + hId + '":[' + tmp_target[tmp_index].offsetTop + ',' + tmp_target[tmp_index].offsetLeft + ',' + tmp_target[tmp_index].offsetWidth + ',' + tmp_target[tmp_index].offsetHeight + '],';
                hId++;
            }
            hotspot_test.setAttribute("data-userans", "{" + hustr.substr(0, hustr.length - 1) + "}");
            DND.setHotspotans(hotspot_test);
            DND.checkAns(dndid);
        }

        // function for activating keyboard activity
        function activateKs() {
            hotSpotKeyboard();
            count = 0;
            navigateDown();
        }

        // function responsible for copy Draggable using keyboard
        function copyDraggable() {
            let copy_drag = AI.select(".ks:focus");
            if (copy_drag) {
                if (copy_drag.classList.contains('ui-draggable') && !copy_drag.classList.contains('uc_drag_disable')) {
                    AI.find(dndid, '.dragable', {
                        action: 'removeClass',
                        actionData: 'copiedclr'
                    });
                    copied_id = copy_drag.id;
                    copy_drag.classList.add('copiedclr');
                } else {
                    AH.showmsg('You cannot drag this');
                }
            }
        }

        // function responsible for pasteDraggable using keyboard
        function pasteDraggable() {
            let dropthis = AI.select(".ks:focus");
            if (dropthis && copied_id != "" && dropthis.classList.contains('ui-droppable')) {
                let ui_drag = AI.find(dndid, "#" + copied_id);
                ui_drag.classList.remove('copiedclr');
                let bgimage = '';
                let drop_id = ui_drag.getAttribute('data-droped') ? ui_drag.getAttribute('data-droped') : ui_drag.getAttribute('id');
                if (ui_drag.getAttribute('data-dropimage') && ui_drag.getAttribute('data-dropimage') != '') {
                    bgimage = "url(" + ui_drag.getAttribute('data-path') + ui_drag.getAttribute('data-dropimage') + ")";
                } else {
                    bgimage = ui_drag.style.backgroundImage;
                }

                if (dropthis.getAttribute('data-droped') && dropthis.getAttribute('data-droped').trim() != '') {
                    DND.draggable(AI.find(dndid, '#' + dropthis.getAttribute("data-droped")), 1);
                }

                if (DND.browser.msie && AI.find(dndid, '#' + drop_id) && AI.find(dndid, '#' + drop_id).innerText.trim() == '') {
                    ui_drag.style.backgroundColor = 'transparent';
                }

                AI.setAttr(dropthis, {
                    'userans': drop_id,
                    'data-droped': drop_id,
                    'data-userans': drop_id,
                    'data-path': ui_drag.getAttribute('path'),
                    'data-dropimage': ui_drag.getAttribute('dropimage'),
                    'data-dragimage': ui_drag.getAttribute('dragimage'),
                    'draging': '2',
                    'droping': '2'
                });

                dragstore[dropthis.id] = [ui_drag, dropthis];

                AI.find(dropthis, 'p').innerText = ui_drag.innerText.trim();

                AI.setCss(dropthis, {
                    backgroundColor: ui_drag.style.backgroundColor,
                    backgroundImage: bgimage
                });

                if (AI.find(dndid, "#" + drop_id).getAttribute('data-multi_drag') == "0") {
                    if (!(ui_drag.classList.contains('dropable'))) {
                        DND.draggable(ui_drag, 0);
                    } else {
                        DND.draggable(AI.find(dndid, '#' + drop_id), 0);
                    }
                }
                DND.checkAns(dndid);
                copied_id = "";
            }
        }

        // function for the key events
        if (typeof(hotkeys) == 'function') {
            hotkeys.unbind('alt+down,down,up,left,right,enter,delete', 'dragndrop');
            hotkeys("alt+down,down,up,left,right,enter,delete", 'dragndrop', function(event, handler) {
                switch (handler.key) {
                    case 'alt+down':
                        activateKs();
                        break;
                    case 'down':
                        if (AI.select("#sm_controller").offsetHeight == 0) {
                            if (checkFocus("tmpTarget", 1)) {
                                event.preventDefault();
                                let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 4, 0);
                                moveTargetImg(position.top, position.left);
                            } else if (checkFocus('dragable') || checkFocus('dropable')) {
                                let focus_element = AI.select('.ks:focus');
                                let ks_last_element = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];

                                if (focus_element && ((focus_element.id == ks_last_element.id) || (ks_last_element.children[0] && (ks_last_element.children[0].id == focus_element.id)) || (AI.find(ks_last_element, '.customRad') && (AI.find(ks_last_element, '.customRad').id == focus_element.id)))) {
                                    focusFirst();
                                } else {
                                    DND.tabMove(focus_element, 1);
                                }
                                event.preventDefault();
                            }
                        }
                        break;
                    case 'up':
                        if (AI.select("#sm_controller").offsetHeight == 0) {
                            if (checkFocus("tmpTarget", 1)) {
                                event.preventDefault();
                                let position = DND.checkContainment(AI.select(".tmpTarget:focus"), -4, 0);
                                moveTargetImg(position.top, position.left);
                            } else if (checkFocus('dragable') || checkFocus('dropable')) {
                                let focus_element = AI.select('.ks:focus');
                                let ks_element = AI.selectAll('.ks')[0];

                                if (focus_element && ((focus_element.id == ks_element.id) || (ks_element.children[0] && (ks_element.children[0].id == focus_element.id)) || (AI.find(ks_element, '.customRad') && (AI.find(ks_element, '.customRad').id == focus_element.id)))) {
                                    focusLast();
                                } else {
                                    DND.tabMove(focus_element, 0);
                                }
                                event.preventDefault();
                            }
                        }
                        break;
                    case 'left':
                        if (AI.select("#sm_controller").offsetHeight == 0) {
                            if (checkFocus("tmpTarget", 1)) {
                                event.preventDefault();
                                let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 0, -4);
                                moveTargetImg(position.top, position.left);
                            } else if (checkFocus('dragable') || checkFocus('dropable')) {
                                let focus_element = AI.select('.ks:focus');
                                let ks_element = AI.selectAll('.ks')[0];

                                if (focus_element && ((focus_element.id == ks_element.id) || (ks_element.children[0] && (ks_element.children[0].id == focus_element.id)) || (AI.find(ks_element, '.customRad') && (AI.find(ks_element, '.customRad').id == focus_element.id)))) {
                                    focusLast();
                                } else {
                                    DND.tabMove(focus_element, 0);
                                }
                            }
                        }
                        break;
                    case 'right':
                        if (AI.select("#sm_controller").offsetHeight == 0) {
                            if (checkFocus("tmpTarget", 1)) {
                                event.preventDefault();
                                let position = DND.checkContainment(AI.select(".tmpTarget:focus"), 0, 4);
                                moveTargetImg(position.top, position.left);
                            } else if (checkFocus('dragable') || checkFocus('dropable')) {
                                let focus_element = AI.select('.ks:focus');
                                let ks_last_element = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];

                                if (focus_element && ((focus_element.id == ks_last_element.id) || (ks_last_element.children[0] && (ks_last_element.children[0].id == focus_element.id)) || (AI.find(ks_last_element, '.customRad') && (AI.find(ks_last_element, '.customRad').id == focus_element.id)))) {
                                    focusFirst();
                                } else {
                                    DND.tabMove(focus_element, 1);
                                }
                            }
                        }
                        break;
                    case 'enter':
                        if (AI.select("#sm_controller").offsetHeight == 0) {
                            if (checkFocus("dragable")) {
                                copyDraggable();
                            } else if (checkFocus("dropable")) {
                                pasteDraggable();
                            }
                        }
                        break;
                    case 'delete':
                        if (AI.select("#sm_controller").offsetHeight == 0) {
                            if (checkFocus("dropable")) {
                                removeDraggable(event);
                            }
                        }
                        break;
                }
            });
            hotkeys.setScope('dragndrop');
            hotkeys.filter = function() {
                return true;
            };
        }

        /* events for keyboard binding */
        AI.listen('body', 'keyup', '.ks', function(current, event) {
            if (event.keyCode == 13 && !current.classList.contains('lab_disable')) {
                current.focus();
                if (current.classList.contains('dragable')) {
                    copyDraggable();
                } else if (current.classList.contains('dropable')) {
                    pasteDraggable();
                }
            }
        });

        AI.listen('body', 'keydown', '#dndmainPreview', function(current, event) {
            let last_element = AI.selectAll('.ks')[AI.selectAll('.ks').length - 1];
            let first_element = AI.select('.ks');
            if (AI.select('.ks:focus').nodeName) {
                if (((AI.select('.ks:focus').getAttribute('id') == last_element.getAttribute('id')) || (last_element.children[0] && AI.find(last_element.children[0], '.customRad') && (AI.select('.ks:focus').getAttribute('id') == AI.find(last_element.children[0], '.customRad').getAttribute('id')))) && (event.which || event.keyCode) == 9 && (event.shiftKey == false)) {
                    event.preventDefault();
                    focusFirst();
                }

                if (((AI.select('.ks:focus').getAttribute('id') == first_element.getAttribute('id')) || (first_element.children[0] && AI.find(first_element.children[0], '.customRad') && (AI.select('.ks:focus').getAttribute('id') == AI.find(first_element.children[0], '.customRad')))) && event.shiftKey == true && (event.which || event.keyCode) == 9) {
                    event.preventDefault();
                    focusLast();
                }
            }

            if (event.which == 27) {
                AI.find(dndid, '.copiedclr', {
                    action: 'removeClass',
                    actionData: 'copiedclr'
                });
                count = 0;
                copied_id = "";

                if (last_element.children[0] && (last_element.children[0].classList.contains("dnd_textbox") || last_element.children[0].classList.contains("dndcheckbox") || last_element.children[0].classList.contains("dnd_select"))) {
                    last_element.children[0].focus();
                    last_element.children[0].blur();
                } else if (AI.find(last_element, ".customRad", 'all').length != 0) {
                    AI.find(last_element, ".customRad").focus();
                    AI.find(last_element, ".customRad").blur();
                } else {
                    last_element.focus();
                    last_element.blur();
                }
            }
        });

        AI.listenAll('body', 'click', function() {
            if (!checkFocus("dragable") && !checkFocus("dropable")) {
                AI.find(dndid, '.copiedclr', {
                    action: 'removeClass',
                    actionData: 'copiedclr'
                });
                copied_id = "";
            }
        });

        AI.listen('body', 'keypress', '#dndmainPreview input', function(current, event) {
            if (event.which == 13) {
                event.preventDefault();
                return false;
            }
        });
        /* end of events for keyboard binding */

    };


    // function responsible for calculating the area
    DND.calcArea = function(coords) {
        let i = 0,
            maxX = 0,
            minX = Infinity,
            maxY = 0,
            minY = Infinity;

        while (i < coords.length) {
            let x = parseInt(coords[i++], 10),
                y = parseInt(coords[i++], 10);

            if (x < minX) minX = x;
            else if (x > maxX) maxX = x;

            if (y < minY) minY = y;
            else if (y > maxY) maxY = y;
        }
        return {
            top: minY,
            left: minX,
            width: (maxX - minX),
            height: (maxY - minY)
        }
    };

    // function for responsible the correct data
    DND.getCorrect = function(pElem) {
        let is_correct = -1;
        let cans = pElem.getAttribute('data-anskey');
        let uans = pElem.getAttribute('data-userans');

        if ((cans == uans) || (uans != "" && cans.split(",").includes(uans))) {
            is_correct = 1;
        }
        if (cans == "" && uans == "") {
            is_correct = -2;
        }
        return is_correct;
    };

    // function reponsible for showing the drag & drop module answers
    DND.showansdrag = function(dndid, ansType, review) {

        let element = AI.select(dndid);
        let tab_pane_div = AI.find(dndid, '.tab-pane', 'all');
        if (DND.browser.msie && tab_pane_div.length > 0) {
            for (let index = 0; index < tab_pane_div.length; index++) {
                let cur_element = tab_pane_div[index];

                if (cur_element.offsetHeight <= 0 && AI.selectAll(dndid + '>.tab-content,' + dndid + '>img').length < 1) {
                    let top = 0,
                        height = 0;
                    let drag_resize = AI.find(cur_element, '.drag-resize', 'all');
                    for (let drag_index = 0; drag_index < drag_resize.length; drag_index++) {
                        let drag_element = drag_resize[index];
                        if (drag_element.offsetHeight > height) {
                            height = drag_element.offsetHeight;
                        }
                        if (DND.offset(drag_element).top > top) {
                            height = DND.offset(drag_element).top;
                        }

                        if (drag_element.classList.contains('dragable') > -1 && drag_element.style.backgroundColor == "transparent" && drag_element.style.backgroundImage == "none" && drag_element.innerText.trim() == "") {
                            AI.setCss(drag_element, {
                                backgroundColor: 'white',
                                opacity: '0',
                                filter: 'alpha(opacity=0)'
                            });
                        }
                    }

                    cur_element.style.height = (height + top) + 'px';
                    AI.setCss(cur_element, {
                        height: (height + top) + 'px',
                        overflow: 'hidden',
                    });

                    AI.setCss(drag_element.parentElement, {
                        overflow: 'hidden',
                    });
                }
            }
        }

        if (typeof review === "undefined") review = 0;

        let dnd_test = AI.find(element, '.dndTest', 'all');
        for (let test_index = 0; test_index < dnd_test.length; test_index++) {
            DND.showchildansdrag(dndid, dnd_test[test_index], ansType, review);
        }

        let dropables = document.querySelectorAll(".dropable.ui-droppable");
        for (let i = 0; i < dropables.length; i++) {
            let droppedElem = dropables[i];
            if (droppedElem.getAttribute("data-droped") || ansType == "c") {
                droppedElem.innerHTML = (droppedElem.innerHTML).replace("Drop Here", "").replace("Place Here", "");
            }
        }
    };

    // for getting the offset
    DND.offset = function(element) {
        let rect = element.getBoundingClientRect();
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }
    };
    // for getting the position
    DND.position = function(element) {
        return {
            left: element.offsetLeft,
            top: element.offsetTop
        }
    };

    // for setting the hotspot ans in case of keyboard
    DND.setHotspotans = function(element) {
        let userans = element.getAttribute('data-userans');
        if (userans) {
            userans = JSON.parse(userans);
            let hs_item = AI.find(element, '.hs_item', 'all');
            for (let index = 0; index < hs_item.length; index++) {
                let cur_element = hs_item[index];
                let position = DND.position(cur_element);
                position.width = cur_element.offsetWidth;
                position.height = cur_element.offsetHeight;
                for (let sub_index = 0; sub_index < Object.keys(userans).length; sub_index++) {
                    let user_ans_index = Object.keys(userans)[sub_index];
                    if (position.top <= (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) && (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) <= (position.top + position.height)) {
                        if (position.left <= (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) && (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) <= (position.left + position.width)) {
                            cur_element.setAttribute("data-correctans", "1");
                            break;
                        }
                    } else {
                        cur_element.setAttribute("data-correctans", "0");
                    }
                }
            }

        }
    };

    // function responsible for showing the dnd ans by traversing each element passing for DND.showansdrag
    DND.showchildansdrag = function(dndid, pElem, ansType, review) {
        let is_correct = -2;
        let dnd_element = AI.select(dndid);
        if (pElem.classList.contains('hotspot') || pElem.classList.contains('hotspot_test')) {
            let selected = AI.find(pElem, '.tmpTarget:not([showtarget])', 'all');
            if (selected.length > 0) {
                selected.forEach((elm) => elm.remove());
            }
            let hs_item = AI.find(pElem, '.hs_item', 'all');
            if (ansType == 'c') {
                let targetimg = {
                    height: (AI.find(dnd_element, '.targetImg').offsetHeight) ? AI.find(dnd_element, '.targetImg').offsetHeight : 32,
                    width: (AI.find(dnd_element, '.targetImg').offsetWidth) ? AI.find(dnd_element, '.targetImg').offsetWidth : 32,
                };
                for (let index = 0; index < hs_item.length; index++) {
                    let hcpos = DND.position(hs_item[index]);
                    let top = hcpos.top + hs_item[index].offsetHeight / 2 - targetimg.height / 2;
                    let left = hcpos.left + hs_item[index].offsetWidth / 2 - targetimg.width / 2;
                    if (hs_item[index].nodeName.toLowerCase() == 'area') {
                        let height = DND.calcArea(hs_item[index].getAttribute('coords').split(','));
                        top = height.top + height.height / 2 - targetimg.height / 2;
                        left = height.left + height.width / 2 - targetimg.width / 2;
                    }
                    let clone_element = AI.clone(AI.find(dnd_element, '.targetImg'));
                    clone_element.classList.remove('targetImg');
                    clone_element.classList.add('tmpTarget');
                    clone_element.id = pElem.id + "_" + (index + 1);
                    AI.setCss(clone_element, {
                        position: 'absolute',
                        top: top + 'px',
                        left: left + 'px',
                        display: 'block'
                    });
                    pElem.append(clone_element);
                }
            } else if (ansType == 'u') {
                let ans_attr = pElem.getAttribute('data-userans');
                let userans = null;
                if (ans_attr) {
                    userans = JSON.parse(ans_attr);
                }
                if (userans != null && Object.keys(userans).length > 0) {
                    let already_filled_ans = [];
                    let matched_ans = [];
                    for (let index = 0; index < hs_item.length; index++) {
                        let cur_element = hs_item[index];
                        let position = DND.position(cur_element);
                        let tgElem = "";
                        Object.keys(userans).forEach(function(user_ans_index) {
                            if (typeof(tgElem) == 'string' && !already_filled_ans.includes(user_ans_index)) {
                                position.width = cur_element.offsetWidth;
                                position.height = cur_element.offsetHeight;
                                if (cur_element.nodeName.toLowerCase() == "area") {
                                    position = DND.calcArea(cur_element.getAttribute('coords').split(','));
                                }
                                if (position.top <= (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) && (userans[user_ans_index][0] + userans[user_ans_index][3] / 2) <= (position.top + position.height)) {
                                    if (position.left <= (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) && (userans[user_ans_index][1] + userans[user_ans_index][2] / 2) <= (position.left + position.width)) {
                                        tgElem = cur_element;
                                        already_filled_ans.push(user_ans_index);
                                        matched_ans[user_ans_index] = {
                                            tgElem: tgElem.id,
                                            userans: userans[user_ans_index],
                                        };
                                    }
                                }
                            }
                        });

                        if (tgElem != '') {
                            cur_element.setAttribute("data-correctans", "1");
                            is_correct = true;
                        }else {
                            is_correct = false;
                            break;
                        }
                    }

                    Object.keys(matched_ans).forEach(function(index) {
                        let clone_element = AI.clone(AI.find(dnd_element, '.targetImg'));
                        clone_element.classList.remove('targetImg');
                        clone_element.classList.add('tmpTarget');
                        clone_element.id = pElem.id + "_" + index;
                        AI.setCss(clone_element, {
                            position: 'absolute',
                            top: matched_ans[index]['userans'][0] + 'px',
                            left: matched_ans[index]['userans'][1] + 'px',
                            display: 'block',
                        });
                        DND.storage.store(clone_element.id, 'tgElem', matched_ans[index]['tgElem']);
                        pElem.append(clone_element);
                    });

                    Object.keys(userans).forEach(function(index) {
                        if (!already_filled_ans.includes(index)) {
                            let clone_element = AI.clone(AI.find(dnd_element, '.targetImg'));
                            clone_element.classList.remove('targetImg');
                            clone_element.classList.add('tmpTarget');
                            clone_element.id = pElem.id + "_" + index;
                            AI.setCss(clone_element, {
                                position: 'absolute',
                                top: userans[index][0] + 'px',
                                left: userans[index][1] + 'px',
                                display: 'block',
                            });
                            DND.storage.store(clone_element.id, 'tgElem', pElem.id);
                            pElem.append(clone_element);
                        }
                    });
                }
            }
        }

        if (pElem.classList.contains('dropable')) {
            let user_pointsBgDropUrl = "none";
            if (pElem.getAttribute('data-bgimage')) {
                user_pointsBgDropUrl = "url(" + (pElem.getAttribute('data-path') + pElem.getAttribute('data-bgimage')) + ")";
            }

            AI.setCss(pElem, {
                backgroundColor: pElem.getAttribute("data-bgcolor"),
                backgroundImage: user_pointsBgDropUrl
            });

            AI.find(pElem, 'p').innerHTML = pElem.getAttribute('data-caption');
            if (ansType == 'c') {
                let anskey = pElem.getAttribute('data-anskey').split(',');
                if (anskey.length) {
                    anskey.forEach(function(value, index) {
                        if (value.trim() != "") {
                            let anskey_element = AI.find(dnd_element, '#' + value);

                            let selector;
                            if (anskey.length > 1) {
                                selector = AI.selectAll('.dropable[data-anskey="' + pElem.getAttribute("data-anskey") + '"]')[index];
                            } else {
                                selector = pElem;
                            }

                            if (anskey_element) {
                                AI.setCss(selector, {
                                    backgroundColor: anskey_element.getAttribute("data-bgcolor"),
                                    backgroundImage: (anskey_element.getAttribute('data-dropimage') || anskey_element.getAttribute('data-bgimage')) ? "url(" + (anskey_element.getAttribute('data-path') + (anskey_element.getAttribute('data-dropimage') ? anskey_element.getAttribute('data-dropimage') : anskey_element.getAttribute('data-bgimage'))) + ")" : 'none'
                                });

                                AI.find(selector, 'p').innerHTML = anskey_element.getAttribute('data-caption');
                            }
                        }
                    });
                }
            } else if (ansType == 'u') {
                if (pElem.getAttribute('data-userans').trim() != '') {
                    try {
                        let user_ans = AI.find(dnd_element, '#' + pElem.getAttribute('data-userans'));
                        if (user_ans) {
                            AI.setCss(pElem, {
                                backgroundColor: user_ans.getAttribute("data-bgcolor"),
                                backgroundImage: (user_ans.getAttribute('data-dropimage') ||  user_ans.getAttribute('data-bgimage')) ? "url(" + (user_ans.getAttribute('data-path') + (user_ans.getAttribute('data-dropimage') ? user_ans.getAttribute('data-dropimage') : user_ans.getAttribute('data-bgimage'))) + ")" : ''
                            });

                            AI.find(pElem, 'p').innerHTML = user_ans.getAttribute('data-caption');
                            pElem.setAttribute('droping', 2);
                            pElem.setAttribute('draging', 2);
                            if (user_ans.getAttribute("data-multi_drag") == "0") {
                                user_ans.classList.add('uc_drag_disable');
                                user_ans.style.setProperty("cursor", "no-drop", "important");
                                user_ans.style.setProperty("opacity", "0.5", "important");
                            }
                        } else {
                            pElem.setAttribute('droping', 1);
                            pElem.removeAttribute('draging');
                        }
                    } catch (error) {
                        console.warn('User ans xml destroyed', pElem.getAttribute('data-userans'));
                    }
                }
                if (typeof(pElem.getAttribute("name")) !== "undefined" && pElem.getAttribute("name") != "") {
                    let ansKey = pElem.getAttribute('data-anskey').split(',');
                    let userans = [];

                    let droppable_element = AI.find(dnd_element, '.dropable[name="' + pElem.getAttribute("name") + '"]', 'all');

                    for (let index = 0; index < droppable_element.length; index++) {
                        if (typeof(droppable_element[index].getAttribute('data-userans')) != 'undefined' && droppable_element[index].getAttribute('data-userans') != '' || AI.find(droppable_element[index], '.correct_incorrect_icon', 'all').length > 0) {
                            userans.push(droppable_element[index].getAttribute('data-userans'));
                        }
                    }

                    if (typeof(pElem.getAttribute('data-userans')) != 'undefined' && pElem.getAttribute('data-userans') != '') {
                        is_correct = DND.getCorrect(pElem);
                    } else if ((ansKey.length - userans.length) > 0) {
                        is_correct = -1;
                    }
                } else {
                    is_correct = DND.getCorrect(pElem);
                }
            }
        }

        if (pElem.getAttribute('type') == 'step') {
            if (typeof(pElem.getAttribute('data-udisplay')) != 'undefined') {
                if ((stepsPreview == null) || pElem.getAttribute('id').match(stepsPreview + '_0')) {
                    stepsPreview = pElem.getAttribute('id');
                }

                let step_display = true;

                if (ansType == 'c') {
                    step_display = (pElem.getAttribute('data-cdisplay')) ? true : false;
                } else if (ansType == 'u') {
                    step_display = (pElem.getAttribute('data-udisplay')) ? true : false;
                }

                if (step_display) {
                    DND.setStep(pElem.getAttribute('id'));
                } else {
                    DND.setStep(stepsPreview);
                }
            }
        }

        if (pElem.nodeName == 'SPAN') {
            if (pElem.classList.contains('menu')) {
                if (pElem.getAttribute('data-correctans') > 0) {
                    is_correct = -1;
                    if (pElem.getAttribute('data-userans') > 0) {
                        pElem.setAttribute('clicked', '1');
                        is_correct = 1;
                    }
                }
            } else {
                AI.setAttr(pElem, {
                    sel: '0',
                    class: 'off'
                });

                if (ansType == 'c' && Nmuber(pElem.getAttribute('data-correctans')) > 0) {
                    AI.setAttr(pElem, {
                        sel: '1',
                        class: 'on'
                    });
                }

                if (ansType == 'u') {
                    is_correct = -1;
                    if (Number(pElem.getAttribute('data-userans')) > 0) {
                        AI.setAttr(pElem, {
                            sel: '1',
                            class: 'on'
                        });
                    }

                    if (review == 1) {
                        if (Number(pElem.getAttribute('data-userans')) > 0 && Number(pElem.getAttribute('data-correctans')) > 0) {
                            is_correct = 1;
                        } else {
                            if (Number(pElem.getAttribute('data-userans')) < 1 && Number(pElem.getAttribute('data-correctans')) > 0) {
                                pElem.classList.remove('off');
                                pElem.classList.add('off');
                            }
                            if (Number(pElem.getAttribute('data-correctans')) < 1 && Number(pElem.getAttribute('data-defaultans')) < 1 && Number(pElem.getAttribute('data-userans')) < 1) {
                                is_correct = -2;
                            }
                        }
                    }
                }
            }
        }

        if (AI.find(pElem, '[class*="dnd_"],.dndradio,.dndcheckbox,.dropable,.hotspot,.hotspot_test,[type="step"],[type="tab"]', 'all').length > 0) {
            let childrens = pElem.children;
            if (childrens.length > 0) {
                for (let index = 0; index < childrens.length; index++) {
                    let element = childrens[index];
                    if (typeof(pElem.getAttribute("type")) !== "undefined" && ["step", "tab"].includes(pElem.getAttribute("type"))) {
                        DND.showchildansdrag(dndid, element, ansType, review);
                    }
                    if (element.getAttribute("data-correctans") == null) element.setAttribute("data-correctans", "");
                    if (element.getAttribute("data-userans") == null) element.setAttribute("data-userans", "");
                    if (element.getAttribute("data-defaultans") == null) element.setAttribute("data-defaultans", "");

                    // SELECT ANS SHOWING IS STARTED FROM HERE //
                    if (element.nodeName == 'SELECT') {
                        is_correct = -1;
                        let total_correct = AI.find(element, "[data-correctans='1']", 'all').length;
                        let compare_index = 0;
                        let options = AI.find(element, 'option', 'all');
                        let default_value = '0';
                        element.value = '';
                        for (let sub_index = 0; sub_index < options.length; sub_index++) {
                            if (ansType == 'c') {
                                if (Number(options[sub_index].getAttribute('data-correctans')) > 0) {
                                    options[sub_index].parentElement.value = options[sub_index].value;
                                }
                            } else if (ansType == 'u') {
                                if (Number(options[sub_index].getAttribute('data-userans')) > 0) {
                                    options[sub_index].parentElement.value = options[sub_index].value;
                                }
                                if (options[sub_index].selected && Number(options[sub_index].getAttribute('data-correctans')) == 1) {
                                    compare_index++;
                                }

                                if (Number(options[sub_index].getAttribute('data-defaultans')) > 0) {
                                    default_value = options[sub_index].value;
                                }
                            }
                        }
                        if (total_correct == compare_index) {
                            is_correct = 1;
                        }
                        if (element.value.trim() == '' && AI.find(element, 'option')) {
                            element.value = default_value;
                        }
                    }
                    if (element.nodeName == "INPUT") {
                        is_correct = -1;
                        if (element.getAttribute('data-correctans') == "") {
                            element.getAttribute('data-correctans', "0");
                        }
                        if (element.getAttribute("type") == "radio" || element.getAttribute("type") == "checkbox") {
                            element.checked = false;
                            if (ansType == 'c') {
                                if (Number(element.getAttribute("data-correctans")) > 0) {
                                    element.checked = true;
                                }
                            } else if (ansType == 'u') {
                                if (Number(element.getAttribute("data-userans")) > 0) {
                                    element.checked = true;
                                }
                                if (Number(element.getAttribute('data-userans')) == Number(element.getAttribute('data-correctans'))) {
                                    is_correct = 1;
                                }
                            }
                        }
                        if (element.getAttribute("type") == "text" || element.getAttribute("type") == "password") {

                            // I don't think this is needed here , NEED TO REVEIW
                            if (typeof(element.type) == "undefined") {
                                element.type = 'text';
                            }
                            if (ansType == 'c') {
                                element.value = element.getAttribute("data-correctans");
                            } else if (ansType == 'u') {
                                element.value = element.getAttribute("data-userans");
                                is_correct = DND.testText(element);
                            }
                        }
                    } else if (element.nodeName == "TEXTAREA") {
                        is_correct = -1;
                        if (ansType == 'c') {
                            element.value = element.getAttribute("data-correctans");
                        } else if (ansType == 'u') {
                            element.value = element.getAttribute("data-userans");
                            is_correct = DND.testText(element);
                        }
                    }
                }
            }
        }

        let anstest = false;
        if (AI.find(pElem, '.choicematrixradio', 'all').length) {
            anstest = AI.find(pElem, '.choicematrixradio').checked;
        } else if (AI.find(pElem, '.custRad', 'all').length) {
            anstest = AI.find(pElem, '.custRad').checked;
        }

        if (ansType == 'u' && review == 1) {
            if (is_correct != -2) {
                let correct_incorrect_mark = '';
                if (AI.find(pElem, '.custRad', 'all').length || AI.find(pElem, '.choicematrixradio', 'all').length) {
                    if (AI.find(pElem, '.choicematrixradio')) {
                        AI.find(pElem, '.choicematrixradio').disabled = true;
                    }
                    if (AI.find(pElem, '.custRad')) {
                        AI.find(pElem, '.custRad').disabled = true;
                    }
                    correct_incorrect_mark = DND.markUserAnswerChoiceMatrix(is_correct, anstest);
                } else {
                    correct_incorrect_mark = DND.markUserAnswer(is_correct);
                }
                pElem.setAttribute('as', is_correct);
                pElem.insertAdjacentHTML('beforeend', correct_incorrect_mark);
            }
        } else if (ansType == 'u' && review == 0) {
            if (AI.find(pElem, '.custRad', 'all').length || AI.find(pElem, '.choicematrixradio', 'all').length) {
                if (AI.find(pElem, '.choicematrixradio')) {
                    AI.find(pElem, '.choicematrixradio').disabled = false;
                }
                if (AI.find(pElem, '.custRad')) {
                    AI.find(pElem, '.custRad').disabled = false;
                }
            }
            AI.remove('.correct_incorrect_icon');
        } else {
            AI.remove('.correct_incorrect_icon');
        }
    };

    // function for marking correct incorrect
    DND.markUserAnswer = function(is_correct) {
        let droped_value_indicator_html = '';
        if (is_correct == 1) {
            if (window.inNative) {
                droped_value_indicator_html = '<span class="icomoon-checkmark-circles" style="color:green;">';
            } else {
                droped_value_indicator_html = '<span class="icomoon-checkmark-circle" style="color:green;">';
            }
        } else {
            if (window.inNative) {
                droped_value_indicator_html = '<span class="icomoon-cancel-circles" style="color:red;">';
            } else {
                droped_value_indicator_html = '<span class="icomoon-cancel-circle" style="color:red;">';
            }
        }
        let correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:18px;height:18px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size:21px;"> ' + droped_value_indicator_html + '</span></span>';
        return correct_incorrect_mark;
    };

    // function for marking choice matrix answers
    DND.markUserAnswerChoiceMatrix = function(is_correct, anstest) {
        let correct_incorrect_mark = '', droped_value_indicator_html = '';
        if (is_correct == 1 && anstest == true) {
            if (window.inNative) {
                droped_value_indicator_html = '<span class="icomoon-checkmark-circles" style="color:green;">';
            } else {
                droped_value_indicator_html = '<span class="icomoon-checkmark-circle" style="color:green;">';
            }

            correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:15px;height:20px;right:-9px;top:-42px;background:white;border-radius:15px 12px 12px;font-size:17px;"> ' + droped_value_indicator_html + '</span></span>';
        } else if (is_correct != 1 && anstest == true) {
            if (window.inNative) {
                droped_value_indicator_html = '<span class="icomoon-cancel-circles" style="color:red;">';
            } else {
                droped_value_indicator_html = '<span class="icomoon-cancel-circle style="color:red;">';
            }

            correct_incorrect_mark = '<span class="correct_incorrect_icon" style="position:absolute;width:15px;height:15px;right:-9px;top:-42px;background:white;border-radius:15px 12px 12px;font-size:17px;"> ' + droped_value_indicator_html + '</span></span>';
        }
        return correct_incorrect_mark;
    };
    // function for cheking module answers
    DND.checkAns = function(dndid) {
        let userAnsXML = "<smans type='15'>\n";
        result = true;
        user_points = 0;
        is_all_correct = true;
        let dnd_element = AI.select(dndid);
        let dnd_test = AI.find(dnd_element, '.dndTest', 'all');

        for (let index = 0; index < dnd_test.length; index++) {
            userAnsXML = DND.checkChildAnswer(dndid, dnd_test[index], userAnsXML);
        }
        userAnsXML += "</smans>";

        result = is_all_correct;
        if (window.inNative) {
            if (typeof window.getHeight == "function") {
                window.getHeight();
            }
        }
        DND.calculatePoint(dnd_element.getAttribute('totalcorrectans'), user_points);

        if (window.inNative) {
            window.postMessage(JSON.stringify({
                userAnswers: userAnsXML,
                inNativeIsCorrect: result
            }), '*');
        }
        return {uXml: userAnsXML, ans: result};
    };

    // function for changing the user and ans points
    DND.calculatePoint = function(answer_points, user_points) {
        //changes for php
        AI.selectAll('#answer_points', 'value', answer_points);
        AI.selectAll('#user_points', 'value', user_points);
    };

    // function for cheking module by traversing the child
    DND.checkChildAnswer = function(dndid, pElem, userAnsXML) {
        let dnd_element = AI.select(dndid);

        if (pElem.classList.contains('hotspot_test')) {
            let hs_item = AI.find(pElem, '.hs_item', 'all');
            let result_array = [];
            for (let index = 0; index < hs_item.length; index++) {
                if (hs_item[index].getAttribute('data-correctans') == '0') {
                    result_array.push(0);
                } else {
                    result_array.push(1);
                    user_points++;
                }
            }
            result = !(result_array.includes(0));
            userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute('data-userans') + "'></div>\n";
        } else if (pElem.classList.contains('dropable')) {
            let ansKey = pElem.getAttribute('data-anskey').split(',');

            if (pElem.getAttribute("name") == '' && !ansKey.includes(pElem.getAttribute("data-userans"))) {
                result = false;
            } else if (typeof(pElem.getAttribute("name")) !== "undefined" && pElem.getAttribute("name") != "") {
                let userans = [];
                let dnd_element_dropable = AI.find(dnd_element, '.dropable[name="' + pElem.getAttribute("name") + '"]', 'all');
                for (let index = 0; index < dnd_element_dropable.length; index++) {
                    if (typeof(dnd_element_dropable[index].getAttribute('data-userans')) != "undefined" && dnd_element_dropable[index].getAttribute('data-userans') != "") {
                        userans.push(dnd_element_dropable[index].getAttribute('data-userans'));
                    }
                }
                if (DND.compareArray(ansKey, userans) != 0) {
                    result = false;
                } else {
                    user_points++;
                }
            } else {
                user_points++;
            }
            userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute('data-userans') + "'></div>\n";
        } else if (pElem.classList.contains('menulist') && !pElem.classList.contains("menu")) {
            if (pElem.getAttribute('data-correctans') != pElem.getAttribute('sel')) {
                result = false;
            } else {
                user_points++;
            }
            userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute("sel") + "'></div>\n";
        } else if (pElem.classList.contains("record")) {
            if (pElem.getAttribute("clicked") == null || pElem.getAttribute("clicked") == '') {
                pElem.setAttribute("clicked", "0");
            }
            if (Number(pElem.getAttribute('clicked')) != 1) {
                result = false;
            } else {
                user_points++;
            }
            userAnsXML += "<div id='" + pElem.getAttribute("id") + "' userAns='" + pElem.getAttribute("clicked") + "'></div>\n";
        } else if (AI.find(pElem, '[class*="dnd_"],.dndradio,.dndcheckbox,.dropable,.record,.hotspot_test,[type="step"],[type="tab"]', 'all').length > 0) {
            let disabledstring = "";
            let childrens = pElem.children;
            for (let index = 0; index < childrens.length; index++) {
                let current_element = childrens[index];
                if (typeof(pElem.getAttribute('type')) != 'undefined' && ['step', 'tab'].includes(pElem.getAttribute('type'))) {
                    userAnsXML = DND.checkChildAnswer(dndid, current_element, userAnsXML);
                }
                if (current_element.getAttribute("data-correctans") == null) current_element.setAttribute("data-correctans", "");
                if (current_element.getAttribute("data-userans") == null) current_element.setAttribute("data-userans", "");
                if (current_element.getAttribute("data-defaultans") == null) current_element.setAttribute("data-defaultans", "");
                if (current_element.disabled) disabledstring = " udisabled='1'";

                if (current_element.nodeName == "SELECT") {
                    let uAnsSel = "";
                    let compare_index = 0;
                    let totalcorrect = AI.find(current_element, "[data-correctans='1']", 'all').length;
                    let options = AI.find(current_element, 'option', 'all');
                    for (let sub_index = 0; sub_index < options.length; sub_index++) {
                        if (options[sub_index].selected) {
                            compare_index++;
                            if (Number(options[sub_index].getAttribute("data-correctans")) != 1) {
                                result = false;
                            } else {
                                user_points++;
                            }
                            uAnsSel = uAnsSel + (sub_index + 1) + ",";
                        }
                    }
                    if (compare_index != totalcorrect) result = false;
                    userAnsXML += '<div id="' + current_element.parentElement.getAttribute("id") + '" userAns="' + uAnsSel + '" ' + disabledstring + '></div>\n';
                } else if (current_element.nodeName == 'INPUT') {
                    if (current_element.getAttribute('type') == 'radio' || current_element.getAttribute('type') == 'checkbox') {
                        if ((Number(current_element.getAttribute("data-correctans")) == 1 && !current_element.checked) || ((Number(current_element.getAttribute("data-correctans")) != 1 && current_element.checked))) {
                            result = false;
                        } else {
                            user_points++;
                        }

                        if (current_element.checked) {
                            userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='1' " + disabledstring + "></div>\n";
                        } else {
                            userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='0' " + disabledstring + "></div>\n";
                        }
                    } else if (current_element.getAttribute('type') == 'text' || current_element.getAttribute('type') == 'password') {
                        let correctansarray = [];
                        let givenanswer;
                        if (Number(current_element.getAttribute("data-ismultipleanswer")) == 1) {
                            correctansarray = current_element.getAttribute("data-correctans").split(",");
                        }
                        correctansarray.push(current_element.getAttribute("data-correctans"));

                        if (Number(current_element.getAttribute('data-nocase')) == 1) {
                            correctansarray = correctansarray.map(function(values) {
                                return values.toLowerCase();
                            });
                            givenanswer = current_element.value.toLowerCase();
                        } else {
                            givenanswer = current_element.value;
                        }

                        if (correctansarray.indexOf(givenanswer) < 0) {
                            result = false;
                        } else {
                            user_points++;
                        }
                        userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='" + current_element.value + "' " + disabledstring + "></div>\n";
                    }
                } else if (current_element.nodeName == 'BUTTON') {
                    if (typeof(current_element.getAttribute("data-userans")) !== "undefined") {
                        userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='" + current_element.getAttribute("data-userans") + "' " + disabledstring + "></div>\n";
                    }
                } else if (current_element.nodeName == 'TEXTAREA') {
                    let parser = ((current_element.getAttribute('data-parser')) ? current_element.getAttribute('data-parser').trim() : "");
                    if (parser != '') {
                        let correct_val = current_element.getAttribute("data-correctans").sqlparser(true);
                        let text_val = current_element.value.replace(/"/g, "'");
                        text_val = text_val.sqlparser();
                        if (DND.compareArray(correct_val['sql'], text_val['sql']) == 0) {
                            if (correct_val['mustbeone'].length > 0) {
                                for (let sub_index = 0; sub_index < correct_val['mustbeone'].length; sub_index++) {
                                    if (DND.compareArray(correct_val['mustbeone'][sub_index], text_val['sql']).length >= correct_val['mustbeone'][sub_index].length) {
                                        result = false;
                                    }
                                }
                            }
                        } else {
                            result = false;
                        }
                    } else {
                        let correctansarray = [];
                        let givenanswer;
                        if (Number(current_element.getAttribute("data-ismultipleanswer")) == 1) {
                            correctansarray = current_element.getAttribute("data-correctans").split(",");
                        }
                        correctansarray.push(current_element.getAttribute("data-correctans"));
                        if (Number(current_element.getAttribute('data-nocase')) == 1) {
                            correctansarray = correctansarray.map(function(values) {
                                return values.toLowerCase();
                            });
                            givenanswer = current_element.value.toLowerCase();
                        } else {
                            givenanswer = current_element.value;
                        }
                        if (correctansarray.indexOf(givenanswer) < 0) {
                            result = false;
                        } else {
                            user_points++;
                        }
                    }
                    userAnsXML += "<div id='" + current_element.parentElement.getAttribute("id") + "' userAns='" + current_element.value + "' " + disabledstring + "></div>\n";
                }
            }
        }

        if (result == false) {
            is_all_correct = false;
        }
        return userAnsXML;
    };

    // function for areaToggle
    DND.areaToggle = function(obj) {
        if (obj.classList.contains('off')) {
            AI.setAttr(AI.select(obj), {
                "sel": "1",
                "class": "on"
            });
        } else {
            AI.setAttr(AI.select(obj), {
                "sel": "0",
                "class": "off"
            });
        }
    };

    // function for checking the sql text
    DND.testText = function(element) {
        let is_correct = -1,
            parser = ((element.getAttribute('data-parser')) ? element.getAttribute('data-parser').trim() : ""),
            correct_val = element.getAttribute("data-correctans"),
            text_val = element.value.replace(/"/g, "'").trim();
        let correctansarray = [];
        let givenanswer;
        if (parser != "") {
            correct_val = correct_val.sqlparser(true);
            text_val = text_val.sqlparser();
            if (DND.compareArray(correct_val['sql'], text_val['sql']) == 0) {
                is_correct = 1;
            }
        } else {
            if (Number(element.getAttribute("data-ismultipleanswer")) == 1) {
                correctansarray = element.getAttribute("data-correctans").split(",");
            }
            correctansarray.push(element.getAttribute("data-correctans"));

            if (Number(element.getAttribute('data-nocase')) == 1) {
                correctansarray = correctansarray.map(function(v) {
                    return v.toLowerCase();
                });
                givenanswer = element.value.toLowerCase();
            } else {
                givenanswer = element.value;
            }
            if (correctansarray.indexOf(givenanswer) > -1) {
                is_correct = 1;
            }
        }
        return is_correct;
    };

    // function for comparing the array and return if the parent one is not in child one
    DND.compareArray = function(tree, branch) {
        let matchedBranch = [];
        for (let i = 0; i < tree.length; i++) {
            for (let j = 0; j < branch.length; j++) {
                if (branch[j] == tree[i]) {
                    matchedBranch.push(branch[j]);
                    continue;
                }
            }
        }
        let result = (tree.length - matchedBranch.length);
        return result < 0 ? 0 : result;
    };

    // function call whenever the the review mode is changes
    DND.modeOn = function(modeType) {
        AI.selectAll('.test', 'addClass', 'h');
        AI.selectAll('.review', 'addClass', 'h');

        if (modeType) {
            AI.selectAll('.review', 'removeClass', 'h');

            if (typeof(hotkeys) == 'function') {
                hotkeys.unbind('alt+down,down,up,left,right,enter,delete', 'dragndrop');
            }

            DND.unBindLab();
            DND.showansdrag(elemId, 'u', 1);
            AI.setCss('#sm_controller', {
                display: 'block',
            });
            AI.selectAll('#sm_controller button', 'removeClass', 'active');
            AI.addClass('#sm_controller .your-ans', 'active');
        } else {
            AI.selectAll('.test', 'removeClass', 'h');
            DND.bindKeyUp(elemId);
            AI.setCss('#sm_controller', {
                display: 'none',
            });
            DND.bindLab();
            DND.showansdrag(elemId, 'u');
        }
    };

    // function for unbinding the events
    DND.unBindLab = function() {
        let element = AI.select(elemId);
        let select_elements = AI.find(element, 'select,input,textarea', 'all');

        for (let index = 0; index < select_elements.length; index++) {
            if (select_elements[index].nodeName == 'INPUT') {
                let input_type = select_elements[index].getAttribute('type');
                if (input_type == 'text' || input_type == 'password') {
                    select_elements[index].setAttribute('data-userans', select_elements[index].value);
                } else if (input_type == 'radio' || input_type == 'checkbox') {
                    select_elements[index].setAttribute('data-userans', (select_elements[index].checked) ? 1 : 0);
                }
            } else if (select_elements[index].nodeName == 'SELECT') {
                let options = AI.find(select_elements[index], 'option', 'all');
                for (let opt_index = 0; opt_index < options.length; opt_index++) {
                    options[opt_index].setAttribute('data-userans', (options[opt_index].selected) ? 1 : 0);
                }
            } else if (select_elements[index].nodeName == 'TEXTAREA') {
                select_elements[index].setAttribute('data-userans', select_elements[index].value);
            }
            select_elements[index].style.pointerEvents = 'none';
        }
        AI.find(elemId, '.dragable, .dropable, .hotspot_test, .tmpTarget, .record,  [data-droped*=dndID]', {
            action: 'addClass',
            actionData: 'lab_disable'
        });

        AI.find(element, '.hs_item', {
            action: 'addClass',
            actionData: 'ajax_hs_item'
        });

    };

    // function for binding the events
    DND.bindLab = function() {
        let element = AI.select(elemId);
        let select_items = AI.find(element, 'select,input,textarea', 'all');

        AI.find(element, '.hs_item', {
            action: 'removeClass',
            actionData: 'ajax_hs_item'
        });

        AI.find(elemId, '.dragable, .dropable, .hotspot_test, .tmpTarget, .record,  [data-droped*=dndID]', {
            action: 'removeClass',
            actionData: 'lab_disable'
        });

        if (select_items) {
            for (let index = 0; index < select_items.length; index++) {
                select_items[index].style.pointerEvents = 'all';
            }
        }

        DND.readyThis(elemId);
    };

    // function for textbox alingment setting
    DND.textBoxAlignment = function(element) {
        element.style.textAlign = (!isNaN(element.value)) ? 'center' : 'left';
    };

    // funciton for cleartext
    DND.clearText = function(id) {
        try {
            let element = AI.select(elemId);
            let find_element = AI.find(element, '.dnd' + id, 'all');

            if (find_element) {
                for (let index = 0; index < find_element.length; index++) {
                    find_element[index].value = '';
                }
            }
        } catch (err) {
            console.warn("ID does not exist for clearing text ", err);
        }
    };


    // function calling on the window load
    if (typeof document !== 'undefined') {
        document.addEventListener("DOMContentLoaded", function() {
            let dnd_textbox = AI.selectAll('.dnd_textbox');
            for (let index = 0; index < dnd_textbox.length; index++) {
                DND.textBoxAlignment(dnd_textbox[index]);
            }
            AI.listen('body', 'change', '.dnd_textbox', function(_this) {
                DND.textBoxAlignment(_this);
            });
        });
    }

    /* clsSMDragNDrop/libs/preview/TextboxPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1 } = globals;
    const file$1 = "clsSMDragNDrop/libs/preview/TextboxPreview.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (85:4) {#if textbox_data && textbox_data.length > 0}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*textbox_data*/ ctx[0];
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
    			if (dirty & /*textbox_data*/ 1) {
    				each_value = /*textbox_data*/ ctx[0];
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(85:4) {#if textbox_data && textbox_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (86:8) {#each textbox_data as data, index}
    function create_each_block(ctx) {
    	let div;
    	let input;
    	let input_type_value;
    	let input_class_value;
    	let input_data_correctans_value;
    	let input_data_userans_value;
    	let input_data_defaultans_value;
    	let input_placeholder_value;
    	let input_data_nocase_value;
    	let input_data_ismultipleanswer_value;
    	let t;
    	let div_key_value;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			attr_dev(input, "type", input_type_value = /*data*/ ctx[5]._type);
    			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5]._id + " dnd_textbox " + /*data*/ ctx[5]._custom_class);
    			attr_dev(input, "name", "");

    			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5]._correctans
    			? /*data*/ ctx[5]._correctans
    			: "");

    			attr_dev(input, "data-userans", input_data_userans_value = /*data*/ ctx[5]._userans ? /*data*/ ctx[5]._userans : "");
    			attr_dev(input, "data-udisplay", "");
    			attr_dev(input, "data-udisabled", "");

    			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5]._defaultans
    			? /*data*/ ctx[5]._defaultans
    			: "");

    			attr_dev(input, "placeholder", input_placeholder_value = /*data*/ ctx[5]._placeholder
    			? /*data*/ ctx[5]._placeholder
    			: "");

    			attr_dev(input, "data-nocase", input_data_nocase_value = /*data*/ ctx[5]._nocase ? /*data*/ ctx[5]._nocase : "");

    			attr_dev(input, "data-ismultipleanswer", input_data_ismultipleanswer_value = /*data*/ ctx[5]._ismultipleanswer
    			? /*data*/ ctx[5]._ismultipleanswer
    			: "");

    			add_location(input, file$1, 99, 20, 3646);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5]._id);
    			attr_dev(div, "class", "drag-resize dndTest");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[5]._top + "px");
    			set_style(div, "left", /*data*/ ctx[5]._left + "px");
    			set_style(div, "height", /*data*/ ctx[5]._height + "px");
    			set_style(div, "width", /*data*/ ctx[5]._width + "px");
    			set_style(div, "z-index", "1");
    			add_location(div, file$1, 86, 16, 3160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*textbox_data*/ 1 && input_type_value !== (input_type_value = /*data*/ ctx[5]._type)) {
    				attr_dev(input, "type", input_type_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5]._id + " dnd_textbox " + /*data*/ ctx[5]._custom_class)) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5]._correctans
    			? /*data*/ ctx[5]._correctans
    			: "")) {
    				attr_dev(input, "data-correctans", input_data_correctans_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_data_userans_value !== (input_data_userans_value = /*data*/ ctx[5]._userans ? /*data*/ ctx[5]._userans : "")) {
    				attr_dev(input, "data-userans", input_data_userans_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5]._defaultans
    			? /*data*/ ctx[5]._defaultans
    			: "")) {
    				attr_dev(input, "data-defaultans", input_data_defaultans_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_placeholder_value !== (input_placeholder_value = /*data*/ ctx[5]._placeholder
    			? /*data*/ ctx[5]._placeholder
    			: "")) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_data_nocase_value !== (input_data_nocase_value = /*data*/ ctx[5]._nocase ? /*data*/ ctx[5]._nocase : "")) {
    				attr_dev(input, "data-nocase", input_data_nocase_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && input_data_ismultipleanswer_value !== (input_data_ismultipleanswer_value = /*data*/ ctx[5]._ismultipleanswer
    			? /*data*/ ctx[5]._ismultipleanswer
    			: "")) {
    				attr_dev(input, "data-ismultipleanswer", input_data_ismultipleanswer_value);
    			}

    			if (dirty & /*textbox_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5]._id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*textbox_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[5]._top + "px");
    			}

    			if (dirty & /*textbox_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[5]._left + "px");
    			}

    			if (dirty & /*textbox_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[5]._height + "px");
    			}

    			if (dirty & /*textbox_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[5]._width + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(86:8) {#each textbox_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let if_block = /*textbox_data*/ ctx[0] && /*textbox_data*/ ctx[0].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$1, 83, 0, 3044);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*textbox_data*/ ctx[0] && /*textbox_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextboxPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let { uxml = "" } = $$props;
    	let textbox_data = [];
    	let textbox = modules;

    	afterUpdate(() => {
    		if (textbox_data.length > 0 && containerID != "") {
    			textbox.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID", "uxml"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextboxPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		XMLToJSON,
    		afterUpdate,
    		modules,
    		containerID,
    		uxml,
    		textbox_data,
    		textbox
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("textbox_data" in $$props) $$invalidate(0, textbox_data = $$props.textbox_data);
    		if ("textbox" in $$props) $$invalidate(4, textbox = $$props.textbox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, textbox, uxml, textbox_data*/ 27) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(4, textbox = []);
    					$$invalidate(4, textbox[0] = modules, textbox);
    				} else {
    					$$invalidate(4, textbox = modules);
    				}

    				$$invalidate(0, textbox_data = []);

    				textbox.map(function (data) {
    					if (uxml != "") {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					$$invalidate(0, textbox_data = [...textbox_data, data]);
    				});
    			} else {
    				$$invalidate(0, textbox_data = []);
    			}
    		}
    	};

    	return [textbox_data, modules, containerID, uxml, textbox];
    }

    class TextboxPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextboxPreview",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<TextboxPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<TextboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<TextboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<TextboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<TextboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<TextboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<TextboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/DragPreview.svelte generated by Svelte v3.34.0 */

    const file$2 = "clsSMDragNDrop/libs/preview/DragPreview.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (80:4) {#if drag_value && drag_value.length > 0}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*drag_value*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
    			if (dirty & /*drag_value, window*/ 1) {
    				each_value = /*drag_value*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(80:4) {#if drag_value && drag_value.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (109:16) {#if data.value}
    function create_if_block_1(ctx) {
    	let p;
    	let raw_value = /*data*/ ctx[4].value + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			add_location(p, file$2, 108, 32, 3519);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*drag_value*/ 1 && raw_value !== (raw_value = /*data*/ ctx[4].value + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(109:16) {#if data.value}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {#each drag_value as data, index}
    function create_each_block$1(ctx) {
    	let div;
    	let t;
    	let div_key_value;
    	let div_id_value;
    	let div_data_caption_value;
    	let div_data_bgcolor_value;
    	let div_data_multi_drag_value;
    	let div_data_dragimage_value;
    	let div_data_dropimage_value;
    	let div_data_bgimage_value;
    	let div_data_path_value;
    	let if_block = /*data*/ ctx[4].value && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
    			attr_dev(div, "id", div_id_value = /*data*/ ctx[4].id);
    			attr_dev(div, "draging", "1");
    			attr_dev(div, "name", "");
    			attr_dev(div, "class", "drag-resize dragable ui-draggable dndTest");
    			attr_dev(div, "data-caption", div_data_caption_value = /*data*/ ctx[4].caption);
    			attr_dev(div, "data-bgcolor", div_data_bgcolor_value = /*data*/ ctx[4].bgcolor);
    			attr_dev(div, "data-multi_drag", div_data_multi_drag_value = /*data*/ ctx[4].multi_drag);
    			attr_dev(div, "data-dragimage", div_data_dragimage_value = /*data*/ ctx[4].dragimage);
    			attr_dev(div, "data-dropimage", div_data_dropimage_value = /*data*/ ctx[4].dropimage);
    			attr_dev(div, "data-bgimage", div_data_bgimage_value = /*data*/ ctx[4].bgimage);
    			attr_dev(div, "data-detail", "");
    			attr_dev(div, "tabindex", "0");

    			attr_dev(div, "data-path", div_data_path_value = window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/");

    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[4].top);
    			set_style(div, "left", /*data*/ ctx[4].left);
    			set_style(div, "height", /*data*/ ctx[4].height);
    			set_style(div, "width", /*data*/ ctx[4].width);
    			set_style(div, "border", /*data*/ ctx[4].border);
    			set_style(div, "background-color", /*data*/ ctx[4].backgroundColor);
    			set_style(div, "background-image", /*data*/ ctx[4].backgroundImage);
    			attr_dev(div, "aria-disabled", "false");
    			add_location(div, file$2, 81, 12, 2353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[4].value) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*drag_value*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[4].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*drag_value*/ 1 && div_data_caption_value !== (div_data_caption_value = /*data*/ ctx[4].caption)) {
    				attr_dev(div, "data-caption", div_data_caption_value);
    			}

    			if (dirty & /*drag_value*/ 1 && div_data_bgcolor_value !== (div_data_bgcolor_value = /*data*/ ctx[4].bgcolor)) {
    				attr_dev(div, "data-bgcolor", div_data_bgcolor_value);
    			}

    			if (dirty & /*drag_value*/ 1 && div_data_multi_drag_value !== (div_data_multi_drag_value = /*data*/ ctx[4].multi_drag)) {
    				attr_dev(div, "data-multi_drag", div_data_multi_drag_value);
    			}

    			if (dirty & /*drag_value*/ 1 && div_data_dragimage_value !== (div_data_dragimage_value = /*data*/ ctx[4].dragimage)) {
    				attr_dev(div, "data-dragimage", div_data_dragimage_value);
    			}

    			if (dirty & /*drag_value*/ 1 && div_data_dropimage_value !== (div_data_dropimage_value = /*data*/ ctx[4].dropimage)) {
    				attr_dev(div, "data-dropimage", div_data_dropimage_value);
    			}

    			if (dirty & /*drag_value*/ 1 && div_data_bgimage_value !== (div_data_bgimage_value = /*data*/ ctx[4].bgimage)) {
    				attr_dev(div, "data-bgimage", div_data_bgimage_value);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "top", /*data*/ ctx[4].top);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "left", /*data*/ ctx[4].left);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "height", /*data*/ ctx[4].height);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "width", /*data*/ ctx[4].width);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "border", /*data*/ ctx[4].border);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "background-color", /*data*/ ctx[4].backgroundColor);
    			}

    			if (dirty & /*drag_value*/ 1) {
    				set_style(div, "background-image", /*data*/ ctx[4].backgroundImage);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(81:8) {#each drag_value as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let if_block = /*drag_value*/ ctx[0] && /*drag_value*/ ctx[0].length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$2, 78, 0, 2247);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*drag_value*/ ctx[0] && /*drag_value*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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

    function validColor(_bgcolor, _invisible) {
    	if (_invisible == "1") {
    		return "";
    	} else if (_bgcolor) {
    		return _bgcolor;
    	} else {
    		return "#CCFFCC";
    	}
    }

    function validBorderColor(_bordercolor) {
    	if (_bordercolor) {
    		return "1px solid " + _bordercolor;
    	} else {
    		return "";
    	}
    }

    function bgImage(img) {
    	if (img) {
    		let str = img.split(",")[0];

    		return (window.inNative
    		? "https://s3.amazonaws.com/jigyaasa_content_static/"
    		: "https://s3.amazonaws.com/jigyaasa_content_static/") + str;
    	} else {
    		return "";
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DragPreview", slots, []);
    	let { modules } = $$props;
    	let drag = modules;
    	let drag_value = [];

    	// for initializing the drag
    	function init() {
    		if (Array.isArray(modules) == false) {
    			drag = [];
    			drag[0] = modules;
    		} else {
    			drag = modules;
    		}

    		$$invalidate(0, drag_value = []);

    		drag.map(function (data) {
    			$$invalidate(0, drag_value = [
    				...drag_value,
    				{
    					id: "dnd" + data._id,
    					caption: data._value,
    					bgcolor: validColor(data._bgcolor, data._invisible),
    					multi_drag: data._multi_drag,
    					dragimage: data._image ? data._image.split(",")[1] : "",
    					dropimage: data._image ? data._image.split(",")[2] : "",
    					bgimage: data._image ? data._image.split(",")[0] : "",
    					top: data._top + "px",
    					left: data._left + "px",
    					height: data._height + "px",
    					width: data._width + "px",
    					border: validBorderColor(data._border_color),
    					backgroundColor: validColor(data._bgcolor, data._invisible),
    					backgroundImage: data._image
    					? "url('" + bgImage(data._image) + "')"
    					: "none",
    					value: data._value
    				}
    			]);
    		});
    	}

    	const writable_props = ["modules"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DragPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    	};

    	$$self.$capture_state = () => ({
    		modules,
    		drag,
    		drag_value,
    		init,
    		validColor,
    		validBorderColor,
    		bgImage
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("drag" in $$props) drag = $$props.drag;
    		if ("drag_value" in $$props) $$invalidate(0, drag_value = $$props.drag_value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules*/ 2) {
    			 if (modules) {
    				init();
    			} else {
    				$$invalidate(0, drag_value = []);
    			}
    		}
    	};

    	return [drag_value, modules];
    }

    class DragPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { modules: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DragPreview",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<DragPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<DragPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<DragPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/DropPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$1 } = globals;
    const file$3 = "clsSMDragNDrop/libs/preview/DropPreview.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (135:4) {#if drop_data && drop_data.length > 0}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*drop_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    			if (dirty & /*drop_data, window*/ 1) {
    				each_value = /*drop_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(135:4) {#if drop_data && drop_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (136:8) {#each drop_data as data, index}
    function create_each_block$2(ctx) {
    	let div;
    	let p;
    	let t;
    	let div_key_value;
    	let div_id_value;
    	let div_data_anskey_value;
    	let div_data_caption_value;
    	let div_data_userans_value;
    	let div_data_droped_value;
    	let div_data_bgcolor_value;
    	let div_data_path_value;
    	let div_droping_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t = space();
    			add_location(p, file$3, 162, 16, 5652);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
    			attr_dev(div, "id", div_id_value = /*data*/ ctx[5].id);
    			attr_dev(div, "name", "");
    			attr_dev(div, "tabindex", "0");
    			attr_dev(div, "data-anskey", div_data_anskey_value = /*data*/ ctx[5].anskey);
    			attr_dev(div, "data-caption", div_data_caption_value = /*data*/ ctx[5].caption);
    			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[5].userans);
    			attr_dev(div, "data-droped", div_data_droped_value = /*data*/ ctx[5].droped);
    			attr_dev(div, "data-bgcolor", div_data_bgcolor_value = /*data*/ ctx[5].bgcolor);

    			attr_dev(div, "data-path", div_data_path_value = window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/");

    			attr_dev(div, "data-dragimage", "");
    			attr_dev(div, "data-dropimage", "");
    			attr_dev(div, "data-bgimage", "");
    			attr_dev(div, "class", "drag-resize dropable ui-droppable dndTest");
    			attr_dev(div, "droping", div_droping_value = /*data*/ ctx[5].userans ? "2" : "1");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[5].top);
    			set_style(div, "left", /*data*/ ctx[5].left);
    			set_style(div, "height", /*data*/ ctx[5].height);
    			set_style(div, "width", /*data*/ ctx[5].width);
    			set_style(div, "border", /*data*/ ctx[5].border);
    			set_style(div, "z-index", "1 \n                ");
    			add_location(div, file$3, 136, 12, 4601);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*drop_data*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[5].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*drop_data*/ 1 && div_data_anskey_value !== (div_data_anskey_value = /*data*/ ctx[5].anskey)) {
    				attr_dev(div, "data-anskey", div_data_anskey_value);
    			}

    			if (dirty & /*drop_data*/ 1 && div_data_caption_value !== (div_data_caption_value = /*data*/ ctx[5].caption)) {
    				attr_dev(div, "data-caption", div_data_caption_value);
    			}

    			if (dirty & /*drop_data*/ 1 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[5].userans)) {
    				attr_dev(div, "data-userans", div_data_userans_value);
    			}

    			if (dirty & /*drop_data*/ 1 && div_data_droped_value !== (div_data_droped_value = /*data*/ ctx[5].droped)) {
    				attr_dev(div, "data-droped", div_data_droped_value);
    			}

    			if (dirty & /*drop_data*/ 1 && div_data_bgcolor_value !== (div_data_bgcolor_value = /*data*/ ctx[5].bgcolor)) {
    				attr_dev(div, "data-bgcolor", div_data_bgcolor_value);
    			}

    			if (dirty & /*drop_data*/ 1 && div_droping_value !== (div_droping_value = /*data*/ ctx[5].userans ? "2" : "1")) {
    				attr_dev(div, "droping", div_droping_value);
    			}

    			if (dirty & /*drop_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[5].top);
    			}

    			if (dirty & /*drop_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[5].left);
    			}

    			if (dirty & /*drop_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[5].height);
    			}

    			if (dirty & /*drop_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[5].width);
    			}

    			if (dirty & /*drop_data*/ 1) {
    				set_style(div, "border", /*data*/ ctx[5].border);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(136:8) {#each drop_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let if_block = /*drop_data*/ ctx[0] && /*drop_data*/ ctx[0].length > 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$3, 133, 0, 4498);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*drop_data*/ ctx[0] && /*drop_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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

    function validColor$1(_bgcolor, _invisible) {
    	if (_invisible == "1") {
    		return "";
    	} else if (_bgcolor) {
    		return _bgcolor;
    	} else {
    		return "#FFFFCC";
    	}
    }

    function validBorderColor$1(_bordercolor) {
    	if (_bordercolor) {
    		return "1px solid " + _bordercolor;
    	} else {
    		return "";
    	}
    }

    function setUserAns(uans, defaultans) {
    	if (uans) {
    		return uans;
    	} else if (defaultans) {
    		return defaultans;
    	} else {
    		return "";
    	}
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DropPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let { uxml = "" } = $$props;
    	let dropPreview = modules;
    	let drop_data = [];

    	afterUpdate(() => {
    		if (dropPreview && drop_data.length > 0 && containerID != "") {
    			dropPreview.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll("#dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll("#dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID", "uxml"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DropPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		XMLToJSON,
    		afterUpdate,
    		modules,
    		containerID,
    		uxml,
    		dropPreview,
    		drop_data,
    		validColor: validColor$1,
    		validBorderColor: validBorderColor$1,
    		setUserAns
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("dropPreview" in $$props) $$invalidate(4, dropPreview = $$props.dropPreview);
    		if ("drop_data" in $$props) $$invalidate(0, drop_data = $$props.drop_data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, dropPreview, uxml, drop_data*/ 27) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(4, dropPreview = []);
    					$$invalidate(4, dropPreview[0] = modules, dropPreview);
    				} else {
    					$$invalidate(4, dropPreview = modules);
    				}

    				$$invalidate(0, drop_data = []);

    				dropPreview.map(function (data) {
    					let ansKey = "";

    					if (data._anskey) {
    						let allAnsKey = data._anskey.split(",");

    						allAnsKey.forEach(function (value) {
    							ansKey += "dnd" + value + ",";
    						});

    						ansKey = ansKey.slice(0, -1);
    					}

    					if (uxml != "") {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					$$invalidate(0, drop_data = [
    						...drop_data,
    						{
    							id: "dnd" + data._id,
    							anskey: data._anskey ? ansKey : "",
    							caption: data._value,
    							userans: setUserAns(data._userans, data._defaultans),
    							droped: setUserAns(data._userans, data._defaultans),
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
    				$$invalidate(4, dropPreview = []);
    				$$invalidate(0, drop_data = []);
    			}
    		}
    	};

    	return [drop_data, modules, containerID, uxml, dropPreview];
    }

    class DropPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropPreview",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<DropPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<DropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<DropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<DropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<DropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<DropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<DropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/SelectPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$2 } = globals;
    const file$4 = "clsSMDragNDrop/libs/preview/SelectPreview.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (129:4) {#if select_data && select_data.length > 0}
    function create_if_block$4(ctx) {
    	let each_1_anchor;
    	let each_value = /*select_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    			if (dirty & /*select_data*/ 1) {
    				each_value = /*select_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(129:4) {#if select_data && select_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (167:20) {:else}
    function create_else_block_1(ctx) {
    	let option;

    	const block = {
    		c: function create() {
    			option = element("option");
    			option.textContent = "Please Select";
    			option.__value = "Please Select";
    			option.value = option.__value;
    			add_location(option, file$4, 167, 24, 6499);
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
    		source: "(167:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (155:20) {#if data.select.length}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*data*/ ctx[6].select;
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
    			if (dirty & /*select_data*/ 1) {
    				each_value_1 = /*data*/ ctx[6].select;
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(155:20) {#if data.select.length}",
    		ctx
    	});

    	return block;
    }

    // (162:32) {:else}
    function create_else_block(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[9].text + "";
    	let t;
    	let option_key_value;
    	let option_data_correctans_value;
    	let option_data_defaultans_value;
    	let option_data_userans_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*option*/ ctx[9].key);
    			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[9].correctans);
    			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[9].defaultans);
    			attr_dev(option, "data-userans", option_data_userans_value = /*option*/ ctx[9].userans);
    			option.__value = option_value_value = /*option*/ ctx[9].key + 1;
    			option.value = option.__value;
    			add_location(option, file$4, 162, 36, 6170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*select_data*/ 1 && t_value !== (t_value = /*option*/ ctx[9].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*select_data*/ 1 && option_key_value !== (option_key_value = /*option*/ ctx[9].key)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[9].correctans)) {
    				attr_dev(option, "data-correctans", option_data_correctans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[9].defaultans)) {
    				attr_dev(option, "data-defaultans", option_data_defaultans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_userans_value !== (option_data_userans_value = /*option*/ ctx[9].userans)) {
    				attr_dev(option, "data-userans", option_data_userans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[9].key + 1)) {
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
    		source: "(162:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (160:32) {#if option.text == "Please Select"}
    function create_if_block_3(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[9].text + "";
    	let t;
    	let option_key_value;
    	let option_data_correctans_value;
    	let option_data_defaultans_value;
    	let option_data_userans_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*option*/ ctx[9].key);
    			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[9].correctans);
    			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[9].defaultans);
    			attr_dev(option, "data-userans", option_data_userans_value = /*option*/ ctx[9].userans);
    			option.__value = option_value_value = /*option*/ ctx[9].key;
    			option.value = option.__value;
    			add_location(option, file$4, 160, 36, 5925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*select_data*/ 1 && t_value !== (t_value = /*option*/ ctx[9].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*select_data*/ 1 && option_key_value !== (option_key_value = /*option*/ ctx[9].key)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[9].correctans)) {
    				attr_dev(option, "data-correctans", option_data_correctans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[9].defaultans)) {
    				attr_dev(option, "data-defaultans", option_data_defaultans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_userans_value !== (option_data_userans_value = /*option*/ ctx[9].userans)) {
    				attr_dev(option, "data-userans", option_data_userans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[9].key)) {
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(160:32) {#if option.text == \\\"Please Select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (157:28) {#if option.selected == 1}
    function create_if_block_2(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[9].text + "";
    	let t;
    	let option_key_value;
    	let option_data_correctans_value;
    	let option_data_defaultans_value;
    	let option_data_userans_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			attr_dev(option, "key", option_key_value = /*option*/ ctx[9].key);
    			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[9].correctans);
    			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[9].defaultans);
    			attr_dev(option, "data-userans", option_data_userans_value = /*option*/ ctx[9].userans);
    			option.__value = option_value_value = /*option*/ ctx[9].key + 1;
    			option.value = option.__value;
    			add_location(option, file$4, 157, 32, 5591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*select_data*/ 1 && t_value !== (t_value = /*option*/ ctx[9].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*select_data*/ 1 && option_key_value !== (option_key_value = /*option*/ ctx[9].key)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[9].correctans)) {
    				attr_dev(option, "data-correctans", option_data_correctans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[9].defaultans)) {
    				attr_dev(option, "data-defaultans", option_data_defaultans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_data_userans_value !== (option_data_userans_value = /*option*/ ctx[9].userans)) {
    				attr_dev(option, "data-userans", option_data_userans_value);
    			}

    			if (dirty & /*select_data*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[9].key + 1)) {
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
    		source: "(157:28) {#if option.selected == 1}",
    		ctx
    	});

    	return block;
    }

    // (156:24) {#each data.select as option}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*option*/ ctx[9].selected == 1) return create_if_block_2;
    		if (/*option*/ ctx[9].text == "Please Select") return create_if_block_3;
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
    		source: "(156:24) {#each data.select as option}",
    		ctx
    	});

    	return block;
    }

    // (130:8) {#each select_data as data, index}
    function create_each_block$3(ctx) {
    	let div;
    	let select_1;
    	let select_1_class_value;
    	let select_1_data_userans_value;
    	let t;
    	let div_key_value;
    	let div_id_value;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[6].select.length) return create_if_block_1$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			select_1 = element("select");
    			if_block.c();
    			t = space();
    			attr_dev(select_1, "class", select_1_class_value = /*data*/ ctx[6].id + " dnd_select align_baseline_middle");
    			attr_dev(select_1, "name", "");
    			attr_dev(select_1, "size", "0");
    			attr_dev(select_1, "data-userans", select_1_data_userans_value = /*data*/ ctx[6].userans);
    			attr_dev(select_1, "data-udisplay", "");
    			attr_dev(select_1, "data-udisabled", "");
    			attr_dev(select_1, "data-correctans", "");
    			attr_dev(select_1, "data-defaultans", "");
    			add_location(select_1, file$4, 144, 16, 5044);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[8]);
    			attr_dev(div, "as", "-1");
    			attr_dev(div, "id", div_id_value = /*data*/ ctx[6].id);
    			attr_dev(div, "class", "drag-resize dndTest");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[6].top);
    			set_style(div, "left", /*data*/ ctx[6].left);
    			set_style(div, "height", /*data*/ ctx[6].height);
    			set_style(div, "width", /*data*/ ctx[6].width);
    			set_style(div, "z-index", "1");
    			add_location(div, file$4, 130, 12, 4609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select_1);
    			if_block.m(select_1, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
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

    			if (dirty & /*select_data*/ 1 && select_1_class_value !== (select_1_class_value = /*data*/ ctx[6].id + " dnd_select align_baseline_middle")) {
    				attr_dev(select_1, "class", select_1_class_value);
    			}

    			if (dirty & /*select_data*/ 1 && select_1_data_userans_value !== (select_1_data_userans_value = /*data*/ ctx[6].userans)) {
    				attr_dev(select_1, "data-userans", select_1_data_userans_value);
    			}

    			if (dirty & /*select_data*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[6].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*select_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[6].top);
    			}

    			if (dirty & /*select_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[6].left);
    			}

    			if (dirty & /*select_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[6].height);
    			}

    			if (dirty & /*select_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[6].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(130:8) {#each select_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let if_block = /*select_data*/ ctx[0] && /*select_data*/ ctx[0].length > 0 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$4, 127, 0, 4500);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*select_data*/ ctx[0] && /*select_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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
    	validate_slots("SelectPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let { uxml = "" } = $$props;
    	let user_ans = 0;
    	let select_data = [];
    	let select = modules;

    	afterUpdate(() => {
    		if (select_data.length > 0 && containerID != "") {
    			select.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID", "uxml"];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		XMLToJSON,
    		modules,
    		containerID,
    		uxml,
    		user_ans,
    		select_data,
    		select
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("user_ans" in $$props) $$invalidate(4, user_ans = $$props.user_ans);
    		if ("select_data" in $$props) $$invalidate(0, select_data = $$props.select_data);
    		if ("select" in $$props) $$invalidate(5, select = $$props.select);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, select, uxml, user_ans, select_data*/ 59) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(5, select = []);
    					$$invalidate(5, select[0] = modules, select);
    				} else {
    					$$invalidate(5, select = modules);
    				}

    				$$invalidate(0, select_data = []);

    				select.map(function (data) {
    					if (uxml != "") {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					let option = [];

    					if (data.__text) {
    						data.__text.split("\n").map(function (option_data, index) {
    							if (data._userans == index + 1 + ",") {
    								$$invalidate(4, user_ans = 1);
    							} else {
    								$$invalidate(4, user_ans = 0);
    							}

    							if (option_data.trim().charAt(0) == "+") {
    								option.push({
    									key: index,
    									correctans: 0,
    									defaultans: 1,
    									userans: user_ans ? user_ans : "",
    									text: option_data.trim().slice(1),
    									selected: 1
    								});
    							} else if (option_data.trim().charAt(0) == "*") {
    								option.push({
    									key: index,
    									correctans: 1,
    									defaultans: 0,
    									userans: user_ans ? user_ans : "",
    									text: option_data.trim().slice(1)
    								});
    							} else {
    								option.push({
    									key: index,
    									correctans: 0,
    									defaultans: 0,
    									userans: user_ans ? user_ans : "",
    									text: option_data.trim()
    								});
    							}
    						});
    					}

    					$$invalidate(0, select_data = [
    						...select_data,
    						{
    							id: "dnd" + data._id,
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							userans: data._userans ? data._userans : "",
    							select: option
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, select_data = []);
    			}
    		}
    	};

    	return [select_data, modules, containerID, uxml, user_ans, select];
    }

    class SelectPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectPreview",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<SelectPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<SelectPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<SelectPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<SelectPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<SelectPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<SelectPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<SelectPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/RadioPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$3 } = globals;
    const file$5 = "clsSMDragNDrop/libs/preview/RadioPreview.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (98:4) {#if radio_data && radio_data.length > 0}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let each_value = /*radio_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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
    			if (dirty & /*radio_data, window*/ 1) {
    				each_value = /*radio_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(98:4) {#if radio_data && radio_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (130:16) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let input_id_value;
    	let input_class_value;
    	let input_data_title_value;
    	let input_data_correctans_value;
    	let input_data_defaultans_value;
    	let input_data_userans_value;
    	let input_data_checktype_value;
    	let input_name_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "id", input_id_value = "rad" + /*data*/ ctx[5].id);
    			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio");
    			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[5].id);
    			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
    			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
    			attr_dev(input, "data-userans", input_data_userans_value = /*data*/ ctx[5].userans);
    			attr_dev(input, "data-udisplay", "");
    			attr_dev(input, "data-udisabled", "");
    			attr_dev(input, "data-checktype", input_data_checktype_value = /*data*/ ctx[5].checktype);
    			attr_dev(input, "name", input_name_value = /*data*/ ctx[5].name);
    			input.value = "0";
    			add_location(input, file$5, 130, 20, 4842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*radio_data*/ 1 && input_id_value !== (input_id_value = "rad" + /*data*/ ctx[5].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio")) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[5].id)) {
    				attr_dev(input, "data-title", input_data_title_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
    				attr_dev(input, "data-correctans", input_data_correctans_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
    				attr_dev(input, "data-defaultans", input_data_defaultans_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_userans_value !== (input_data_userans_value = /*data*/ ctx[5].userans)) {
    				attr_dev(input, "data-userans", input_data_userans_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_checktype_value !== (input_data_checktype_value = /*data*/ ctx[5].checktype)) {
    				attr_dev(input, "data-checktype", input_data_checktype_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_name_value !== (input_name_value = /*data*/ ctx[5].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(130:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (114:16) {#if data.defaultans == "1" && data.userans == ''}
    function create_if_block_1$2(ctx) {
    	let input;
    	let input_id_value;
    	let input_class_value;
    	let input_data_title_value;
    	let input_data_correctans_value;
    	let input_data_defaultans_value;
    	let input_data_userans_value;
    	let input_data_checktype_value;
    	let input_name_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "id", input_id_value = "rad" + /*data*/ ctx[5].id);
    			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio");
    			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[5].id);
    			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
    			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
    			attr_dev(input, "data-userans", input_data_userans_value = 1);
    			input.checked = "checked";
    			attr_dev(input, "data-udisplay", "");
    			attr_dev(input, "data-udisabled", "");
    			attr_dev(input, "data-checktype", input_data_checktype_value = /*data*/ ctx[5].checktype);
    			attr_dev(input, "name", input_name_value = /*data*/ ctx[5].name);
    			input.value = "1";
    			add_location(input, file$5, 114, 20, 4155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*radio_data*/ 1 && input_id_value !== (input_id_value = "rad" + /*data*/ ctx[5].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " custRad dndradio")) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[5].id)) {
    				attr_dev(input, "data-title", input_data_title_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
    				attr_dev(input, "data-correctans", input_data_correctans_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
    				attr_dev(input, "data-defaultans", input_data_defaultans_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_data_checktype_value !== (input_data_checktype_value = /*data*/ ctx[5].checktype)) {
    				attr_dev(input, "data-checktype", input_data_checktype_value);
    			}

    			if (dirty & /*radio_data*/ 1 && input_name_value !== (input_name_value = /*data*/ ctx[5].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(114:16) {#if data.defaultans == \\\"1\\\" && data.userans == ''}",
    		ctx
    	});

    	return block;
    }

    // (99:8) {#each radio_data as data, index}
    function create_each_block$4(ctx) {
    	let div;
    	let t0;
    	let label;
    	let label_for_value;
    	let label_class_value;
    	let t1;
    	let div_key_value;
    	let div_id_value;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[5].defaultans == "1" && /*data*/ ctx[5].userans == "") return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			label = element("label");
    			t1 = space();
    			attr_dev(label, "for", label_for_value = "rad" + /*data*/ ctx[5].id);

    			attr_dev(label, "class", label_class_value = (/*data*/ ctx[5].checktype == "true"
    			? "tureitemColor"
    			: "falseitemColor") + " customRad radio_sim " + (window.inNative ? "native" : ""));

    			attr_dev(label, "data-correctans", "");
    			attr_dev(label, "data-userans", "");
    			attr_dev(label, "data-defaultans", "");
    			add_location(label, file$5, 145, 16, 5492);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
    			attr_dev(div, "as", "-1");
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5].id);
    			attr_dev(div, "class", "only-dragable dndTest");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[5].top);
    			set_style(div, "left", /*data*/ ctx[5].left);
    			set_style(div, "height", /*data*/ ctx[5].height);
    			set_style(div, "width", /*data*/ ctx[5].width);
    			set_style(div, "z-index", "1");
    			add_location(div, file$5, 99, 12, 3639);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}

    			if (dirty & /*radio_data*/ 1 && label_for_value !== (label_for_value = "rad" + /*data*/ ctx[5].id)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*radio_data*/ 1 && label_class_value !== (label_class_value = (/*data*/ ctx[5].checktype == "true"
    			? "tureitemColor"
    			: "falseitemColor") + " customRad radio_sim " + (window.inNative ? "native" : ""))) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (dirty & /*radio_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*radio_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[5].top);
    			}

    			if (dirty & /*radio_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[5].left);
    			}

    			if (dirty & /*radio_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[5].height);
    			}

    			if (dirty & /*radio_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[5].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(99:8) {#each radio_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let if_block = /*radio_data*/ ctx[0] && /*radio_data*/ ctx[0].length > 0 && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$5, 96, 0, 3533);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*radio_data*/ ctx[0] && /*radio_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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
    	validate_slots("RadioPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let { uxml = "" } = $$props;
    	let radio_data = [];
    	let radio = modules;

    	afterUpdate(() => {
    		if (radio_data.length > 0 && containerID != "") {
    			radio.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID", "uxml"];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RadioPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		XMLToJSON,
    		modules,
    		containerID,
    		uxml,
    		radio_data,
    		radio
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("radio_data" in $$props) $$invalidate(0, radio_data = $$props.radio_data);
    		if ("radio" in $$props) $$invalidate(4, radio = $$props.radio);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, radio, uxml, radio_data*/ 27) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(4, radio = []);
    					$$invalidate(4, radio[0] = modules, radio);
    				} else {
    					$$invalidate(4, radio = modules);
    				}

    				$$invalidate(0, radio_data = []);

    				radio.map(function (data) {
    					if (uxml != "") {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					$$invalidate(0, radio_data = [
    						...radio_data,
    						{
    							id: data._id,
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							userans: data._userans ? data._userans : "",
    							correctans: data._correctans,
    							defaultans: data._defaultans,
    							checktype: data._checktype,
    							name: data._name
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, radio_data = []);
    			}
    		}
    	};

    	return [radio_data, modules, containerID, uxml, radio];
    }

    class RadioPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioPreview",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<RadioPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<RadioPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<RadioPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<RadioPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<RadioPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<RadioPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<RadioPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/MultilineboxPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$4 } = globals;
    const file$6 = "clsSMDragNDrop/libs/preview/MultilineboxPreview.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (117:4) {#if multilinebox_data && multilinebox_data.length > 0}
    function create_if_block$6(ctx) {
    	let each_1_anchor;
    	let each_value = /*multilinebox_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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
    			if (dirty & /*multilinebox_data*/ 1) {
    				each_value = /*multilinebox_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(117:4) {#if multilinebox_data && multilinebox_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (118:8) {#each multilinebox_data as data, index}
    function create_each_block$5(ctx) {
    	let div;
    	let textarea;
    	let textarea_class_value;
    	let textarea_data_title_value;
    	let textarea_data_correctans_value;
    	let textarea_data_defaultans_value;
    	let textarea_data_parser_value;
    	let textarea_placeholder_value;
    	let textarea_data_nocase_value;
    	let textarea_data_userans_value;
    	let t;
    	let div_key_value;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			textarea = element("textarea");
    			t = space();
    			attr_dev(textarea, "class", textarea_class_value = /*data*/ ctx[5].classes);
    			attr_dev(textarea, "data-title", textarea_data_title_value = /*data*/ ctx[5].id);
    			attr_dev(textarea, "data-correctans", textarea_data_correctans_value = /*data*/ ctx[5].correctans);

    			attr_dev(textarea, "data-defaultans", textarea_data_defaultans_value = /*data*/ ctx[5].defaultans
    			? /*data*/ ctx[5].defaultans.__cdata
    			: "");

    			attr_dev(textarea, "data-parser", textarea_data_parser_value = /*data*/ ctx[5].parser);
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*data*/ ctx[5].placeholder);
    			attr_dev(textarea, "data-nocase", textarea_data_nocase_value = /*data*/ ctx[5].nocase);
    			attr_dev(textarea, "data-userans", textarea_data_userans_value = /*data*/ ctx[5].userans);
    			add_location(textarea, file$6, 131, 16, 4948);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5].id);
    			attr_dev(div, "class", "drag-resize dndTest");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[5].top);
    			set_style(div, "left", /*data*/ ctx[5].left);
    			set_style(div, "height", /*data*/ ctx[5].height);
    			set_style(div, "width", /*data*/ ctx[5].width);
    			set_style(div, "z-index", "1");
    			add_location(div, file$6, 118, 16, 4516);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, textarea);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*multilinebox_data*/ 1 && textarea_class_value !== (textarea_class_value = /*data*/ ctx[5].classes)) {
    				attr_dev(textarea, "class", textarea_class_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_data_title_value !== (textarea_data_title_value = /*data*/ ctx[5].id)) {
    				attr_dev(textarea, "data-title", textarea_data_title_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_data_correctans_value !== (textarea_data_correctans_value = /*data*/ ctx[5].correctans)) {
    				attr_dev(textarea, "data-correctans", textarea_data_correctans_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_data_defaultans_value !== (textarea_data_defaultans_value = /*data*/ ctx[5].defaultans
    			? /*data*/ ctx[5].defaultans.__cdata
    			: "")) {
    				attr_dev(textarea, "data-defaultans", textarea_data_defaultans_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_data_parser_value !== (textarea_data_parser_value = /*data*/ ctx[5].parser)) {
    				attr_dev(textarea, "data-parser", textarea_data_parser_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_placeholder_value !== (textarea_placeholder_value = /*data*/ ctx[5].placeholder)) {
    				attr_dev(textarea, "placeholder", textarea_placeholder_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_data_nocase_value !== (textarea_data_nocase_value = /*data*/ ctx[5].nocase)) {
    				attr_dev(textarea, "data-nocase", textarea_data_nocase_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && textarea_data_userans_value !== (textarea_data_userans_value = /*data*/ ctx[5].userans)) {
    				attr_dev(textarea, "data-userans", textarea_data_userans_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*multilinebox_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[5].top);
    			}

    			if (dirty & /*multilinebox_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[5].left);
    			}

    			if (dirty & /*multilinebox_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[5].height);
    			}

    			if (dirty & /*multilinebox_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[5].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(118:8) {#each multilinebox_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let if_block = /*multilinebox_data*/ ctx[0] && /*multilinebox_data*/ ctx[0].length > 0 && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$6, 115, 0, 4385);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*multilinebox_data*/ ctx[0] && /*multilinebox_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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

    function setCorrect(crt) {
    	if (crt.__cdata) {
    		return crt.__cdata;
    	} else if (typeof crt == "object" && crt[0]) {
    		return crt[0].__cdata ? crt[0].__cdata : crt[0];
    	} else if (typeof crt == "string" && crt.length > 1) {
    		return crt;
    	} else {
    		return "";
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MultilineboxPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let { uxml = "" } = $$props;
    	let multilinebox_data = [];
    	let multilinebox_preview = modules;

    	// was created in js unused function for now but keeping it fot future reference
    	// function changeStep(data) {
    	// 	let id = data.match(/('.*?')/gm);
    	// 	id = id[0].replace(/'|"/gm,'');
    	// 	setStep(id);
    	// }
    	afterUpdate(() => {
    		if (multilinebox_data.length > 0 && containerID != "") {
    			multilinebox_preview.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID", "uxml"];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MultilineboxPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		XMLToJSON,
    		modules,
    		containerID,
    		uxml,
    		multilinebox_data,
    		multilinebox_preview,
    		setCorrect
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("multilinebox_data" in $$props) $$invalidate(0, multilinebox_data = $$props.multilinebox_data);
    		if ("multilinebox_preview" in $$props) $$invalidate(4, multilinebox_preview = $$props.multilinebox_preview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, multilinebox_preview, uxml, multilinebox_data*/ 27) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(4, multilinebox_preview = []);
    					$$invalidate(4, multilinebox_preview[0] = modules, multilinebox_preview);
    				} else {
    					$$invalidate(4, multilinebox_preview = modules);
    				}

    				$$invalidate(0, multilinebox_data = []);

    				multilinebox_preview.map(function (data) {
    					if (uxml != "") {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					$$invalidate(0, multilinebox_data = [
    						...multilinebox_data,
    						{
    							id: data._id,
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							correctans: data.correctans ? setCorrect(data.correctans) : "",
    							defaultans: data.defaultans ? data.defaultans.__cdata : "",
    							parser: data._parser ? data._parser : "",
    							placeholder: data._placeholder ? data._placeholder : "",
    							nocase: data._nocase,
    							userans: data._userans ? data._userans : "",
    							classes: "dnd" + data._id + " dnd_textarea " + data._custom_class
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, multilinebox_data = []);
    			}
    		}
    	};

    	return [multilinebox_data, modules, containerID, uxml, multilinebox_preview];
    }

    class MultilineboxPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultilineboxPreview",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<MultilineboxPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<MultilineboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<MultilineboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<MultilineboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<MultilineboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<MultilineboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<MultilineboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/CheckboxPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$5 } = globals;
    const file$7 = "clsSMDragNDrop/libs/preview/CheckboxPreview.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (97:4) {#if checkbox_data.length > 0}
    function create_if_block$7(ctx) {
    	let each_1_anchor;
    	let each_value = /*checkbox_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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
    			if (dirty & /*checkbox_data*/ 1) {
    				each_value = /*checkbox_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(97:4) {#if checkbox_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (124:16) {:else}
    function create_else_block$2(ctx) {
    	let input;
    	let input_class_value;
    	let input_data_correctans_value;
    	let input_data_defaultans_value;
    	let input_data_userans_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox");
    			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
    			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
    			attr_dev(input, "data-userans", input_data_userans_value = /*data*/ ctx[5].userans);
    			attr_dev(input, "data-udisplay", "");
    			attr_dev(input, "data-udisabled", "");
    			attr_dev(input, "name", "");
    			input.value = "";
    			add_location(input, file$7, 124, 20, 4649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkbox_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox")) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*checkbox_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
    				attr_dev(input, "data-correctans", input_data_correctans_value);
    			}

    			if (dirty & /*checkbox_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
    				attr_dev(input, "data-defaultans", input_data_defaultans_value);
    			}

    			if (dirty & /*checkbox_data*/ 1 && input_data_userans_value !== (input_data_userans_value = /*data*/ ctx[5].userans)) {
    				attr_dev(input, "data-userans", input_data_userans_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(124:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (111:16) {#if data.defaultans == "1" && data.userans == ''}
    function create_if_block_1$3(ctx) {
    	let input;
    	let input_class_value;
    	let input_data_correctans_value;
    	let input_data_defaultans_value;
    	let input_checked_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox");
    			attr_dev(input, "data-correctans", input_data_correctans_value = /*data*/ ctx[5].correctans);
    			attr_dev(input, "data-defaultans", input_data_defaultans_value = /*data*/ ctx[5].defaultans);
    			attr_dev(input, "data-userans", "1");
    			attr_dev(input, "data-udisplay", "");
    			attr_dev(input, "data-udisabled", "");
    			attr_dev(input, "name", "");
    			input.value = "";
    			input.checked = input_checked_value = true;
    			add_location(input, file$7, 111, 20, 4122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkbox_data*/ 1 && input_class_value !== (input_class_value = "dnd" + /*data*/ ctx[5].id + " dndcheckbox")) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*checkbox_data*/ 1 && input_data_correctans_value !== (input_data_correctans_value = /*data*/ ctx[5].correctans)) {
    				attr_dev(input, "data-correctans", input_data_correctans_value);
    			}

    			if (dirty & /*checkbox_data*/ 1 && input_data_defaultans_value !== (input_data_defaultans_value = /*data*/ ctx[5].defaultans)) {
    				attr_dev(input, "data-defaultans", input_data_defaultans_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(111:16) {#if data.defaultans == \\\"1\\\" && data.userans == ''}",
    		ctx
    	});

    	return block;
    }

    // (98:8) {#each checkbox_data as data, index}
    function create_each_block$6(ctx) {
    	let div;
    	let t;
    	let div_key_value;
    	let div_id_value;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[5].defaultans == "1" && /*data*/ ctx[5].userans == "") return create_if_block_1$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[7]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5].id);
    			attr_dev(div, "class", "only-dragable dndTest");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[5].top);
    			set_style(div, "left", /*data*/ ctx[5].left);
    			set_style(div, "height", /*data*/ ctx[5].height);
    			set_style(div, "width", /*data*/ ctx[5].width);
    			add_location(div, file$7, 98, 12, 3664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}

    			if (dirty & /*checkbox_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*checkbox_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[5].top);
    			}

    			if (dirty & /*checkbox_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[5].left);
    			}

    			if (dirty & /*checkbox_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[5].height);
    			}

    			if (dirty & /*checkbox_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[5].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(98:8) {#each checkbox_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let if_block = /*checkbox_data*/ ctx[0].length > 0 && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$7, 95, 0, 3566);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*checkbox_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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
    	validate_slots("CheckboxPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let { uxml = "" } = $$props;
    	let checkbox_data = [];
    	let checkbox = modules;

    	afterUpdate(() => {
    		if (checkbox_data && checkbox_data.length > 0 && containerID != "") {
    			checkbox.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID", "uxml"];

    	Object_1$5.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CheckboxPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    	};

    	$$self.$capture_state = () => ({
    		XMLToJSON,
    		afterUpdate,
    		modules,
    		containerID,
    		uxml,
    		checkbox_data,
    		checkbox
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("checkbox_data" in $$props) $$invalidate(0, checkbox_data = $$props.checkbox_data);
    		if ("checkbox" in $$props) $$invalidate(4, checkbox = $$props.checkbox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, checkbox, uxml, checkbox_data*/ 27) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(4, checkbox = []);
    					$$invalidate(4, checkbox[0] = modules, checkbox);
    				} else {
    					$$invalidate(4, checkbox = modules);
    				}

    				$$invalidate(0, checkbox_data = []);

    				checkbox.map(function (data) {
    					if (uxml != "") {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					$$invalidate(0, checkbox_data = [
    						...checkbox_data,
    						{
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							id: data._id,
    							userans: data._userans ? data._userans : "",
    							correctans: data._correctans ? data._correctans : "",
    							defaultans: data._defaultans ? data._defaultans : ""
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, checkbox_data = []);
    			}
    		}
    	};

    	return [checkbox_data, modules, containerID, uxml, checkbox];
    }

    class CheckboxPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { modules: 1, containerID: 2, uxml: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckboxPreview",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<CheckboxPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<CheckboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<CheckboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<CheckboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<CheckboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<CheckboxPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<CheckboxPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/TabheadPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$6, console: console_1 } = globals;
    const file$8 = "clsSMDragNDrop/libs/preview/TabheadPreview.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (111:4) {#if tabhead_data && tabhead_data.length > 0}
    function create_if_block$8(ctx) {
    	let each_1_anchor;
    	let each_value = /*tabhead_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
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
    			if (dirty & /*tabhead_data*/ 1) {
    				each_value = /*tabhead_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(111:4) {#if tabhead_data && tabhead_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (112:8) {#each tabhead_data as data, index}
    function create_each_block$7(ctx) {
    	let div;
    	let div_key_value;
    	let div_id_value;
    	let div_class_value;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[4].id);
    			attr_dev(div, "data-type", "tabhead");
    			attr_dev(div, "class", div_class_value = /*data*/ ctx[4].classes);
    			attr_dev(div, "style", div_style_value = /*data*/ ctx[4].styles);
    			attr_dev(div, "name", "");
    			attr_dev(div, "data-userans", "");
    			attr_dev(div, "data-udisplay", "");
    			attr_dev(div, "data-udisabled", "");
    			add_location(div, file$8, 112, 12, 3794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tabhead_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[4].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*tabhead_data*/ 1 && div_class_value !== (div_class_value = /*data*/ ctx[4].classes)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*tabhead_data*/ 1 && div_style_value !== (div_style_value = /*data*/ ctx[4].styles)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(112:8) {#each tabhead_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let if_block = /*tabhead_data*/ ctx[0] && /*tabhead_data*/ ctx[0].length > 0 && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$8, 109, 0, 3682);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*tabhead_data*/ ctx[0] && /*tabhead_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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

    function changeStyletoString(data) {
    	let style = "";

    	for (let key in data) {
    		style += key.replace(/_/g, "-") + ":" + data[key] + ";";
    	}

    	return style;
    }

    // function for adding inline style from the object
    function addInlineStyle(stylesheet) {
    	if (typeof stylesheet != "undefined") {
    		let style = {};
    		let inlineStyle = stylesheet.split(";");

    		inlineStyle.map(function (value) {
    			try {
    				let new_property = value.split(":");
    				style[new_property[0]] = new_property[1];
    			} catch(err) {
    				console.warn(err);
    			}
    		});

    		return style;
    	}
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabheadPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let tabhead_data = [];
    	let tabhead = modules;

    	afterUpdate(() => {
    		if (tabhead_data.length > 0 && containerID != "") {
    			tabhead.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll("#dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll("#dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID"];

    	Object_1$6.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<TabheadPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		modules,
    		containerID,
    		tabhead_data,
    		tabhead,
    		changeStyletoString,
    		addInlineStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("tabhead_data" in $$props) $$invalidate(0, tabhead_data = $$props.tabhead_data);
    		if ("tabhead" in $$props) $$invalidate(3, tabhead = $$props.tabhead);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, tabhead, tabhead_data*/ 11) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(3, tabhead = []);
    					$$invalidate(3, tabhead[0] = modules, tabhead);
    				} else {
    					$$invalidate(3, tabhead = modules);
    				}

    				$$invalidate(0, tabhead_data = []);

    				tabhead.map(function (data) {
    					let styling = changeStyletoString(Object.assign(
    						{
    							position: "absolute",
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px"
    						},
    						addInlineStyle(data._style)
    					));

    					$$invalidate(0, tabhead_data = [
    						...tabhead_data,
    						{
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							styles: styling,
    							id: data._id,
    							classes: "drag-resize dndtabhead dndTest " + data._class
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, tabhead_data = []);
    			}
    		}
    	};

    	return [tabhead_data, modules, containerID, tabhead];
    }

    class TabheadPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { modules: 1, containerID: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabheadPreview",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console_1.warn("<TabheadPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<TabheadPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<TabheadPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<TabheadPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<TabheadPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/LabelPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$7, console: console_1$1 } = globals;
    const file$9 = "clsSMDragNDrop/libs/preview/LabelPreview.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (124:4) {#if label_preview_data && label_preview_data.length}
    function create_if_block$9(ctx) {
    	let each_1_anchor;
    	let each_value = /*label_preview_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
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
    			if (dirty & /*label_preview_data*/ 1) {
    				each_value = /*label_preview_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(124:4) {#if label_preview_data && label_preview_data.length}",
    		ctx
    	});

    	return block;
    }

    // (125:8) {#each label_preview_data as data, index}
    function create_each_block$8(ctx) {
    	let div;
    	let p;
    	let t0_value = /*data*/ ctx[4].parahtml + "";
    	let t0;
    	let p_style_value;
    	let t1;
    	let div_key_value;
    	let div_id_value;
    	let div_class_value;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "pl_7");
    			attr_dev(p, "style", p_style_value = /*data*/ ctx[4].paraStyle);
    			add_location(p, file$9, 133, 16, 4778);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[4].id);
    			attr_dev(div, "class", div_class_value = /*data*/ ctx[4].classes);
    			attr_dev(div, "tabindex", "1");
    			attr_dev(div, "style", div_style_value = /*data*/ ctx[4].style);
    			add_location(div, file$9, 126, 12, 4579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label_preview_data*/ 1 && t0_value !== (t0_value = /*data*/ ctx[4].parahtml + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*label_preview_data*/ 1 && p_style_value !== (p_style_value = /*data*/ ctx[4].paraStyle)) {
    				attr_dev(p, "style", p_style_value);
    			}

    			if (dirty & /*label_preview_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[4].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*label_preview_data*/ 1 && div_class_value !== (div_class_value = /*data*/ ctx[4].classes)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*label_preview_data*/ 1 && div_style_value !== (div_style_value = /*data*/ ctx[4].style)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(125:8) {#each label_preview_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let if_block = /*label_preview_data*/ ctx[0] && /*label_preview_data*/ ctx[0].length && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$9, 122, 0, 4395);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*label_preview_data*/ ctx[0] && /*label_preview_data*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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

    function changeStyletoString$1(data) {
    	let style = "";

    	for (let key in data) {
    		style += key.replace(/_/g, "-") + ":" + data[key] + ";";
    	}

    	return style;
    }

    // for adding inline paragraph style
    function addParaStyle(data) {
    	if (typeof data._label_class != "undefined") {
    		return addInlineStyle$1(data._style);
    	}
    }

    // function for setting inner html
    function setInnerHtml(htmlEnt) {
    	return htmlEnt
    	? htmlEnt.replace(/&#(\d+);/g, function (match, dec) {
    			return String.fromCharCode(dec);
    		})
    	: "";
    }

    // function for adding inline style from the object
    function addInlineStyle$1(stylesheet) {
    	if (typeof stylesheet != "undefined") {
    		let style = {};
    		let inlineStyle = stylesheet.split(",");

    		inlineStyle.map(function (value) {
    			try {
    				let new_property = value.split(":");
    				style[new_property[0]] = new_property[1];
    			} catch(err) {
    				console.warn(err);
    			}
    		});

    		return style;
    	}
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LabelPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let label_preview_data = [];
    	let labelPreview = modules;

    	afterUpdate(() => {
    		if (label_preview_data.length > 0 && containerID != "") {
    			labelPreview.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll("#dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll("#dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID"];

    	Object_1$7.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<LabelPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		AH: AH$1,
    		modules,
    		containerID,
    		label_preview_data,
    		labelPreview,
    		changeStyletoString: changeStyletoString$1,
    		addParaStyle,
    		setInnerHtml,
    		addInlineStyle: addInlineStyle$1
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("label_preview_data" in $$props) $$invalidate(0, label_preview_data = $$props.label_preview_data);
    		if ("labelPreview" in $$props) $$invalidate(3, labelPreview = $$props.labelPreview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, labelPreview, label_preview_data*/ 11) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(3, labelPreview = []);
    					$$invalidate(3, labelPreview[0] = modules, labelPreview);
    				} else {
    					$$invalidate(3, labelPreview = modules);
    				}

    				$$invalidate(0, label_preview_data = []);

    				labelPreview.map(function (data) {
    					let styling = changeStyletoString$1(Object.assign(
    						{
    							position: "absolute",
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							border: data._border_size + "px solid " + data._border_color,
    							background_color: data._background_color
    						},
    						addInlineStyle$1(data._style)
    					));

    					let para_styling = changeStyletoString$1(addParaStyle(data));

    					$$invalidate(0, label_preview_data = [
    						...label_preview_data,
    						{
    							id: data._id,
    							style: styling,
    							classes: "dndlabel dndTest " + (data._label_class ? data._label_class : ""),
    							paraStyle: para_styling,
    							parahtml: setInnerHtml(data._richtext
    							? data.__cdata
    							: data._title != undefined
    								? AH$1.ignoreEnity(data._title)
    								: "")
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, label_preview_data = []);
    			}
    		}
    	};

    	return [label_preview_data, modules, containerID, labelPreview];
    }

    class LabelPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { modules: 1, containerID: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LabelPreview",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console_1$1.warn("<LabelPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<LabelPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<LabelPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<LabelPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<LabelPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/HotspotPreview.svelte generated by Svelte v3.34.0 */
    const file$a = "clsSMDragNDrop/libs/preview/HotspotPreview.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (99:8) {#if hotspot_data && hotspot_data.length > 0}
    function create_if_block$a(ctx) {
    	let each_1_anchor;
    	let each_value = /*hotspot_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
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
    			if (dirty & /*hotspot_data, window, Date*/ 1) {
    				each_value = /*hotspot_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(99:8) {#if hotspot_data && hotspot_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (117:20) {#if data.bgimg}
    function create_if_block_2$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			set_style(img, "display", "none");
    			attr_dev(img, "alt", "hotspot");

    			if (img.src !== (img_src_value = (window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[7].bgimg + "?" + Date.now())) attr_dev(img, "src", img_src_value);

    			add_location(img, file$a, 118, 28, 3936);
    			add_location(div, file$a, 117, 24, 3902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hotspot_data*/ 1 && img.src !== (img_src_value = (window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[7].bgimg + "?" + Date.now())) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(117:20) {#if data.bgimg}",
    		ctx
    	});

    	return block;
    }

    // (123:20) {#if data.child.length > 0}
    function create_if_block_1$4(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*data*/ ctx[7].child;
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
    			if (dirty & /*hotspot_data*/ 1) {
    				each_value_1 = /*data*/ ctx[7].child;
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(123:20) {#if data.child.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (124:24) {#each data.child as child_data, child_index}
    function create_each_block_1$1(ctx) {
    	let div;
    	let div_key_value;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "key", div_key_value = /*child_index*/ ctx[12]);
    			attr_dev(div, "id", div_id_value = /*data*/ ctx[7].id + "_" + (/*child_index*/ ctx[12] + 1));
    			attr_dev(div, "data-correctans", "0");
    			attr_dev(div, "class", "drag-resize hs_item ui-droppable");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*child_data*/ ctx[10].top);
    			set_style(div, "left", /*child_data*/ ctx[10].left);
    			set_style(div, "height", /*child_data*/ ctx[10].height);
    			set_style(div, "width", /*child_data*/ ctx[10].width);
    			add_location(div, file$a, 124, 28, 4352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hotspot_data*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[7].id + "_" + (/*child_index*/ ctx[12] + 1))) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "top", /*child_data*/ ctx[10].top);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "left", /*child_data*/ ctx[10].left);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "height", /*child_data*/ ctx[10].height);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "width", /*child_data*/ ctx[10].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(124:24) {#each data.child as child_data, child_index}",
    		ctx
    	});

    	return block;
    }

    // (100:12) {#each hotspot_data as data, index}
    function create_each_block$9(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_key_value;
    	let div_id_value;
    	let div_data_userans_value;
    	let if_block0 = /*data*/ ctx[7].bgimg && create_if_block_2$1(ctx);
    	let if_block1 = /*data*/ ctx[7].child.length > 0 && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[9]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[7].id);
    			attr_dev(div, "class", "drag-resize hotspot_test dndTest");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[7].top);
    			set_style(div, "left", /*data*/ ctx[7].left);
    			set_style(div, "height", /*data*/ ctx[7].height);
    			set_style(div, "width", /*data*/ ctx[7].width);
    			set_style(div, "border", /*data*/ ctx[7].border);
    			set_style(div, "background-image", /*data*/ ctx[7].backgroundImage + "\n                        z-index: 1\n                    ");
    			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[7].userans);
    			add_location(div, file$a, 100, 16, 3218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[7].bgimg) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*data*/ ctx[7].child.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*hotspot_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[7].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[7].top);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[7].left);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[7].height);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[7].width);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "border", /*data*/ ctx[7].border);
    			}

    			if (dirty & /*hotspot_data*/ 1) {
    				set_style(div, "background-image", /*data*/ ctx[7].backgroundImage + "\n                        z-index: 1\n                    ");
    			}

    			if (dirty & /*hotspot_data*/ 1 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[7].userans)) {
    				attr_dev(div, "data-userans", div_data_userans_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(100:12) {#each hotspot_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let div0_style_value;
    	let if_block = /*hotspot_data*/ ctx[0] && /*hotspot_data*/ ctx[0].length > 0 && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "hotspotContainer");
    			attr_dev(div0, "style", div0_style_value = "height:" + /*div_height*/ ctx[1]);
    			add_location(div0, file$a, 97, 4, 3035);
    			add_location(div1, file$a, 96, 0, 3025);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*hotspot_data*/ ctx[0] && /*hotspot_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*div_height*/ 2 && div0_style_value !== (div0_style_value = "height:" + /*div_height*/ ctx[1])) {
    				attr_dev(div0, "style", div0_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
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

    function bgImage$1(img) {
    	if (img) {
    		return (window.inNative
    		? "https://s3.amazonaws.com/jigyaasa_content_static/"
    		: "https://s3.amazonaws.com/jigyaasa_content_static/") + img;
    	} else {
    		return "";
    	}
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HotspotPreview", slots, []);
    	let { modules } = $$props;
    	let { uxml } = $$props;
    	let { module_type } = $$props;
    	let hotspot_data = [];
    	let hotspot = modules;
    	let module_height = 0;
    	let div_height = "auto";
    	const writable_props = ["modules", "uxml", "module_type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HotspotPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(2, modules = $$props.modules);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("module_type" in $$props) $$invalidate(4, module_type = $$props.module_type);
    	};

    	$$self.$capture_state = () => ({
    		XMLToJSON,
    		modules,
    		uxml,
    		module_type,
    		hotspot_data,
    		hotspot,
    		module_height,
    		div_height,
    		bgImage: bgImage$1
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(2, modules = $$props.modules);
    		if ("uxml" in $$props) $$invalidate(3, uxml = $$props.uxml);
    		if ("module_type" in $$props) $$invalidate(4, module_type = $$props.module_type);
    		if ("hotspot_data" in $$props) $$invalidate(0, hotspot_data = $$props.hotspot_data);
    		if ("hotspot" in $$props) $$invalidate(5, hotspot = $$props.hotspot);
    		if ("module_height" in $$props) $$invalidate(6, module_height = $$props.module_height);
    		if ("div_height" in $$props) $$invalidate(1, div_height = $$props.div_height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, module_type, hotspot, module_height, uxml, hotspot_data*/ 125) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(5, hotspot = []);
    					$$invalidate(5, hotspot[0] = modules, hotspot);
    				} else {
    					$$invalidate(5, hotspot = modules);
    				}

    				$$invalidate(0, hotspot_data = []);

    				if (module_type == "15") {
    					try {
    						hotspot.map(data => {
    							$$invalidate(6, module_height = data._height);

    							if (module_height < data._height) {
    								$$invalidate(6, module_height = data._height);
    							}
    						});
    					} catch(e) {
    						$$invalidate(6, module_height = 350);
    					}
    				}

    				$$invalidate(1, div_height = module_height == 0 ? "auto" : module_height + 100 + "px");

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

    					if (uxml) {
    						let uaXML = XMLToJSON(uxml);

    						if (uaXML && uaXML.smans) {
    							if (uaXML.smans.div) {
    								let uans = uaXML.smans.div;

    								if (Array.isArray(uans) == false) {
    									uans = [];
    									uans[0] = uaXML.smans.div;
    								}

    								for (let j in uans) {
    									if (uans[j]._id == "dnd" + data._id) {
    										data._userans = uans[j]._userAns;
    									}
    								}
    							}
    						}
    					}

    					$$invalidate(0, hotspot_data = [
    						...hotspot_data,
    						{
    							id: data._id,
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							backgroundImage: "url('" + bgImage$1(data._bgimg) + "')",
    							userans: data._userans ? data._userans : "",
    							bgimg: data._bgimg,
    							child: inner_component
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, hotspot_data = []);
    			}
    		}
    	};

    	return [hotspot_data, div_height, modules, uxml, module_type, hotspot, module_height];
    }

    class HotspotPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { modules: 2, uxml: 3, module_type: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HotspotPreview",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[2] === undefined && !("modules" in props)) {
    			console.warn("<HotspotPreview> was created without expected prop 'modules'");
    		}

    		if (/*uxml*/ ctx[3] === undefined && !("uxml" in props)) {
    			console.warn("<HotspotPreview> was created without expected prop 'uxml'");
    		}

    		if (/*module_type*/ ctx[4] === undefined && !("module_type" in props)) {
    			console.warn("<HotspotPreview> was created without expected prop 'module_type'");
    		}
    	}

    	get modules() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get module_type() {
    		throw new Error("<HotspotPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set module_type(value) {
    		throw new Error("<HotspotPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/MenulistPreview.svelte generated by Svelte v3.34.0 */

    const file$b = "clsSMDragNDrop/libs/preview/MenulistPreview.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (129:4) {#if menulist_data && menulist_data.length > 0}
    function create_if_block$b(ctx) {
    	let each_1_anchor;
    	let each_value = /*menulist_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
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
    			if (dirty & /*menulist_data, window*/ 1) {
    				each_value = /*menulist_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
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
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(129:4) {#if menulist_data && menulist_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (146:16) {#if data.menulist_item.length > 0}
    function create_if_block_1$5(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*data*/ ctx[8].menulist_item;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
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
    			if (dirty & /*menulist_data, window*/ 1) {
    				each_value_1 = /*data*/ ctx[8].menulist_item;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(146:16) {#if data.menulist_item.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (147:20) {#each data.menulist_item as menu_data, subindex}
    function create_each_block_1$2(ctx) {
    	let span;
    	let span_key_value;
    	let span_id_value;
    	let span_class_value;
    	let span_data_correctans_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*menu_data*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "key", span_key_value = "menu_" + /*subindex*/ ctx[13]);
    			attr_dev(span, "id", span_id_value = /*menu_data*/ ctx[11].id);
    			attr_dev(span, "class", span_class_value = /*menu_data*/ ctx[11].classes);
    			attr_dev(span, "data-correctans", span_data_correctans_value = /*menu_data*/ ctx[11].correctans);
    			attr_dev(span, "data-defaultans", "");
    			attr_dev(span, "data-userans", "");
    			set_style(span, "position", "absolute");
    			set_style(span, "top", /*menu_data*/ ctx[11].top);
    			set_style(span, "left", /*menu_data*/ ctx[11].left);
    			set_style(span, "height", /*menu_data*/ ctx[11].height);
    			set_style(span, "width", /*menu_data*/ ctx[11].width);
    			add_location(span, file$b, 147, 24, 4853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*menulist_data*/ 1 && span_id_value !== (span_id_value = /*menu_data*/ ctx[11].id)) {
    				attr_dev(span, "id", span_id_value);
    			}

    			if (dirty & /*menulist_data*/ 1 && span_class_value !== (span_class_value = /*menu_data*/ ctx[11].classes)) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*menulist_data*/ 1 && span_data_correctans_value !== (span_data_correctans_value = /*menu_data*/ ctx[11].correctans)) {
    				attr_dev(span, "data-correctans", span_data_correctans_value);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(span, "top", /*menu_data*/ ctx[11].top);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(span, "left", /*menu_data*/ ctx[11].left);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(span, "height", /*menu_data*/ ctx[11].height);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(span, "width", /*menu_data*/ ctx[11].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(147:20) {#each data.menulist_item as menu_data, subindex}",
    		ctx
    	});

    	return block;
    }

    // (130:8) {#each menulist_data as data, index}
    function create_each_block$a(ctx) {
    	let div;
    	let t;
    	let div_key_value;
    	let if_block = /*data*/ ctx[8].menulist_item.length > 0 && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[10]);
    			attr_dev(div, "class", "drag-resize");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[8].top);
    			set_style(div, "left", /*data*/ ctx[8].left);
    			set_style(div, "height", /*data*/ ctx[8].height);
    			set_style(div, "width", /*data*/ ctx[8].width);
    			set_style(div, "z-index", "1");
    			attr_dev(div, "data-correctans", "");
    			attr_dev(div, "data-userans", "");
    			attr_dev(div, "data-defaultans", "");
    			add_location(div, file$b, 130, 12, 4252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[8].menulist_item.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[8].top);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[8].left);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[8].height);
    			}

    			if (dirty & /*menulist_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[8].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(130:8) {#each menulist_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let if_block = /*menulist_data*/ ctx[0] && /*menulist_data*/ ctx[0].length > 0 && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$b, 127, 0, 4137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menulist_data*/ ctx[0] && /*menulist_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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

    function getTop(rowCount, row, list) {
    	let top = (parseFloat(list._height) / parseFloat(row) - 0) * (parseFloat(rowCount) - 1) + (parseFloat(rowCount) - 1) * 0 + 0 / 2;
    	return top;
    }

    function getLeft(colCount, col, list) {
    	let left = (parseFloat(list._width) / parseFloat(col) - 0) * (parseFloat(colCount) - 1) + (parseFloat(colCount) - 1) * 0 + 0 / 2;
    	return left;
    }

    function getHeight(row, list) {
    	let height = parseFloat(list._height) / parseFloat(row) - 0;
    	return height;
    }

    function getWidth(col, list) {
    	let width = parseFloat(list._width) / parseFloat(col) - 0;
    	return width;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MenulistPreview", slots, []);
    	let { modules } = $$props;
    	let menulist_data = [];
    	let menulist_preview = modules;
    	let menuEvent = [];
    	let correctSelect = "";

    	function getClick(text) {
    		let data = text.split("|");

    		for (let i = 0; i < data.length; i++) {
    			let clck = data[i].match(/\(.*?\)/gi);

    			if (clck) {
    				$$invalidate(3, menuEvent[i] = clck[0].replace("(", "").replace(")", "").replace(/"/g, "").replace(/'/g, ""), menuEvent);
    			} else {
    				$$invalidate(3, menuEvent[i] = "", menuEvent);
    			}
    		}
    	}

    	// @ayush : I don't find the function used for now will look it later on it
    	function getCorrect(r, c, row, col, data) {
    		correctSelect = "," + (data._correctans
    		? data._correctans.replace(" ", "")
    		: "") + ",";

    		let cans = "menu off dndTest menulist";

    		if (row > 1 && col <= 1) {
    			let srch1 = "," + r + ",";

    			if (correctSelect.indexOf(srch1) !== false) {
    				cans = "menu off menulist dndTest record";
    			}
    		} else if (row <= 1 && col > 1) {
    			let srch2 = "," + c + ",";

    			if (correctSelect.indexOf(srch2) !== false) {
    				cans = "menu off menulist dndTest record";
    			}
    		} else if (row > 1 && col > 1) {
    			let srch3 = r + "x" + c + ",";

    			if (correctSelect.indexOf(srch3) !== false) {
    				cans = "menu off menulist dndTest record";
    			}
    		} else {
    			let srch4 = "," + r + ",";

    			if (correctSelect.indexOf(srch4) !== false) {
    				cans = "menu off menulist dndTest record";
    			}
    		}

    		return cans;
    	}

    	const writable_props = ["modules"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MenulistPreview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = menu_data => window.setStep(menu_data.click_event);

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    	};

    	$$self.$capture_state = () => ({
    		modules,
    		menulist_data,
    		menulist_preview,
    		menuEvent,
    		correctSelect,
    		getTop,
    		getLeft,
    		getHeight,
    		getWidth,
    		getClick,
    		getCorrect
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("menulist_data" in $$props) $$invalidate(0, menulist_data = $$props.menulist_data);
    		if ("menulist_preview" in $$props) $$invalidate(2, menulist_preview = $$props.menulist_preview);
    		if ("menuEvent" in $$props) $$invalidate(3, menuEvent = $$props.menuEvent);
    		if ("correctSelect" in $$props) correctSelect = $$props.correctSelect;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, menulist_preview, menuEvent, menulist_data*/ 15) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(2, menulist_preview = []);
    					$$invalidate(2, menulist_preview[0] = modules, menulist_preview);
    				} else {
    					$$invalidate(2, menulist_preview = modules);
    				}

    				$$invalidate(0, menulist_data = []);

    				menulist_preview.map(function (data) {
    					let row, col, matrix;
    					let count = 0;
    					let menulist_item = [];
    					$$invalidate(3, menuEvent = []);

    					if (data.__text) {
    						getClick(data.__text);
    					}

    					matrix = data._matrix ? data._matrix.split("x") : [];
    					row = matrix[0];
    					col = matrix[1];

    					for (let row_loop = 1; row_loop <= row; row_loop++) {
    						for (let col_loop = 1; col_loop <= col; col_loop++) {
    							menulist_item.push({
    								id: data._id + "_" + row_loop + "_" + col_loop,
    								classes: data._correctans && menuEvent[count]
    								? "menu off menulist dndTest record"
    								: "menu off menulist dndTest",
    								correctans: menuEvent[count] ? "1" : "0",
    								top: getTop(row_loop, row, data) + "px",
    								left: getLeft(col_loop, col, data) + "px",
    								height: getHeight(row, data) + "px",
    								width: getWidth(col, data) + "px",
    								click_event: menuEvent[count] ? menuEvent[count] : ""
    							});

    							count++;
    						}
    					}

    					$$invalidate(0, menulist_data = [
    						...menulist_data,
    						{
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							menulist_item
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, menulist_data = []);
    			}
    		}
    	};

    	return [menulist_data, modules, menulist_preview, menuEvent, click_handler];
    }

    class MenulistPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { modules: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenulistPreview",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<MenulistPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<MenulistPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<MenulistPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/ButtonPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$8 } = globals;
    const file$c = "clsSMDragNDrop/libs/preview/ButtonPreview.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (76:4) {#if button_preview_data && button_preview_data.length > 0}
    function create_if_block$c(ctx) {
    	let each_1_anchor;
    	let each_value = /*button_preview_data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
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
    			if (dirty & /*button_preview_data*/ 1) {
    				each_value = /*button_preview_data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
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
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(76:4) {#if button_preview_data && button_preview_data.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (77:8) {#each button_preview_data as data, index}
    function create_each_block$b(ctx) {
    	let div;
    	let button;
    	let t0_value = (/*data*/ ctx[4].value ? /*data*/ ctx[4].value : "") + "";
    	let t0;
    	let button_class_value;
    	let button_value_value;
    	let t1;
    	let div_key_value;
    	let div_id_value;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", button_class_value = "dnd" + /*data*/ ctx[4].id + " dnd_button");
    			attr_dev(button, "name", "");
    			attr_dev(button, "tabindex", "-1");
    			button.value = button_value_value = /*data*/ ctx[4].value ? /*data*/ ctx[4].value : "";
    			attr_dev(button, "data-correctans", "");
    			attr_dev(button, "data-defaultans", "");
    			attr_dev(button, "data-userans", "");
    			add_location(button, file$c, 93, 16, 3365);
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[6]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[4].id);
    			attr_dev(div, "class", div_class_value = /*data*/ ctx[4].classes);
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*data*/ ctx[4].top);
    			set_style(div, "left", /*data*/ ctx[4].left);
    			set_style(div, "height", /*data*/ ctx[4].height);
    			set_style(div, "width", /*data*/ ctx[4].width);
    			attr_dev(div, "data-correctans", "");
    			attr_dev(div, "data-defaultans", "");
    			attr_dev(div, "data-userans", "");
    			attr_dev(div, "tabindex", "0");
    			add_location(div, file$c, 77, 12, 2857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*button_preview_data*/ 1 && t0_value !== (t0_value = (/*data*/ ctx[4].value ? /*data*/ ctx[4].value : "") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*button_preview_data*/ 1 && button_class_value !== (button_class_value = "dnd" + /*data*/ ctx[4].id + " dnd_button")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*button_preview_data*/ 1 && button_value_value !== (button_value_value = /*data*/ ctx[4].value ? /*data*/ ctx[4].value : "")) {
    				prop_dev(button, "value", button_value_value);
    			}

    			if (dirty & /*button_preview_data*/ 1 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[4].id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*button_preview_data*/ 1 && div_class_value !== (div_class_value = /*data*/ ctx[4].classes)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*button_preview_data*/ 1) {
    				set_style(div, "top", /*data*/ ctx[4].top);
    			}

    			if (dirty & /*button_preview_data*/ 1) {
    				set_style(div, "left", /*data*/ ctx[4].left);
    			}

    			if (dirty & /*button_preview_data*/ 1) {
    				set_style(div, "height", /*data*/ ctx[4].height);
    			}

    			if (dirty & /*button_preview_data*/ 1) {
    				set_style(div, "width", /*data*/ ctx[4].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(77:8) {#each button_preview_data as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let if_block = /*button_preview_data*/ ctx[0] && /*button_preview_data*/ ctx[0].length > 0 && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$c, 74, 0, 2724);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*button_preview_data*/ ctx[0] && /*button_preview_data*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    			if (if_block) if_block.d();
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
    	validate_slots("ButtonPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID = "" } = $$props;
    	let button_preview_data = [];
    	let button_preview = modules;

    	afterUpdate(() => {
    		if (button_preview_data.length > 0 && containerID != "") {
    			button_preview.map(function (data) {
    				let eventArr = [
    					"onclick",
    					"ondblclick",
    					"oncontextmenu",
    					"ondragstart",
    					"ondrag",
    					"ondragend",
    					"ondrop",
    					"onmouseover",
    					"onmouseup",
    					"onmousedown",
    					"onchange",
    					"onfocus",
    					"onblur",
    					"onkeyup",
    					"onkeypress",
    					"onkeydown"
    				];

    				let container = document.querySelector("#" + containerID);

    				eventArr.forEach(function (value, index) {
    					if (!!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.removeAttribute(eventArr[index]);
    							});
    						}
    					}
    				});

    				Object.keys(data).forEach(function (key) {
    					let evt = key.replace("_", "").trim();

    					if (eventArr.includes(evt) && !!container) {
    						let new_container = container.querySelectorAll(".dnd" + data._id);

    						if (!!new_container) {
    							new_container.forEach(function (element) {
    								element.setAttribute(evt, data[key]);
    							});
    						}
    					}
    				});
    			});
    		}
    	});

    	const writable_props = ["modules", "containerID"];

    	Object_1$8.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ButtonPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		modules,
    		containerID,
    		button_preview_data,
    		button_preview
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(1, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(2, containerID = $$props.containerID);
    		if ("button_preview_data" in $$props) $$invalidate(0, button_preview_data = $$props.button_preview_data);
    		if ("button_preview" in $$props) $$invalidate(3, button_preview = $$props.button_preview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules, button_preview, button_preview_data*/ 11) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(3, button_preview = []);
    					$$invalidate(3, button_preview[0] = modules, button_preview);
    				} else {
    					$$invalidate(3, button_preview = modules);
    				}

    				$$invalidate(0, button_preview_data = []);

    				button_preview.map(function (data) {
    					$$invalidate(0, button_preview_data = [
    						...button_preview_data,
    						{
    							top: data._top + "px",
    							left: data._left + "px",
    							height: data._height + "px",
    							width: data._width + "px",
    							id: data._id,
    							classes: "drag-resize dndTest " + data._class,
    							value: data._value
    						}
    					]);
    				});
    			} else {
    				$$invalidate(0, button_preview_data = []);
    			}
    		}
    	};

    	return [button_preview_data, modules, containerID, button_preview];
    }

    class ButtonPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { modules: 1, containerID: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonPreview",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[1] === undefined && !("modules" in props)) {
    			console.warn("<ButtonPreview> was created without expected prop 'modules'");
    		}
    	}

    	get modules() {
    		throw new Error("<ButtonPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<ButtonPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<ButtonPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<ButtonPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/TabPillsPreview.svelte generated by Svelte v3.34.0 */
    const file$d = "clsSMDragNDrop/libs/preview/TabPillsPreview.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (38:4) {#if tab_pills_preview && tab_pills_preview.length > 0}
    function create_if_block$d(ctx) {
    	let ul;
    	let t;
    	let div;
    	let current;
    	let each_value_1 = /*tab_pills_preview*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*tab_pills_preview*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
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

    			attr_dev(ul, "class", "nav nav-pills margin-bottom dndTest");
    			attr_dev(ul, "data-correctans", "");
    			attr_dev(ul, "data-userans", "");
    			attr_dev(ul, "data-defaultans", "");
    			attr_dev(ul, "role", "tablist");
    			add_location(ul, file$d, 38, 8, 1234);
    			attr_dev(div, "class", "tab-content dndTest");
    			attr_dev(div, "type", "tab");
    			set_style(div, "position", "relative");
    			add_location(div, file$d, 45, 8, 1771);
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
    			if (dirty & /*tab_pills_preview*/ 4) {
    				each_value_1 = /*tab_pills_preview*/ ctx[2];
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

    			if (dirty & /*tab_pills_preview, uxml, window, checkImages*/ 7) {
    				each_value = /*tab_pills_preview*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
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
    		source: "(38:4) {#if tab_pills_preview && tab_pills_preview.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (40:12) {#each tab_pills_preview as data, index}
    function create_each_block_1$3(ctx) {
    	let li;
    	let a;
    	let t0_value = /*data*/ ctx[5]._value + "";
    	let t0;
    	let a_class_value;
    	let a_href_value;
    	let a_data_bs_target_value;
    	let a_data_target_value;
    	let t1;
    	let li_key_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "class", a_class_value = "nav-link" + (/*data*/ ctx[5]._display == "1" ? " active" : ""));
    			attr_dev(a, "href", a_href_value = "#dnd" + /*data*/ ctx[5]._id);
    			attr_dev(a, "data-bs-toggle", "pill");
    			attr_dev(a, "data-toggle", "pill");
    			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#dnd" + /*data*/ ctx[5]._id);
    			attr_dev(a, "data-target", a_data_target_value = "#dnd" + /*data*/ ctx[5]._id);
    			add_location(a, file$d, 41, 20, 1495);
    			attr_dev(li, "key", li_key_value = "tab_pills_list_" + /*index*/ ctx[7]);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$d, 40, 16, 1421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tab_pills_preview*/ 4 && t0_value !== (t0_value = /*data*/ ctx[5]._value + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*tab_pills_preview*/ 4 && a_class_value !== (a_class_value = "nav-link" + (/*data*/ ctx[5]._display == "1" ? " active" : ""))) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*tab_pills_preview*/ 4 && a_href_value !== (a_href_value = "#dnd" + /*data*/ ctx[5]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tab_pills_preview*/ 4 && a_data_bs_target_value !== (a_data_bs_target_value = "#dnd" + /*data*/ ctx[5]._id)) {
    				attr_dev(a, "data-bs-target", a_data_bs_target_value);
    			}

    			if (dirty & /*tab_pills_preview*/ 4 && a_data_target_value !== (a_data_target_value = "#dnd" + /*data*/ ctx[5]._id)) {
    				attr_dev(a, "data-target", a_data_target_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(40:12) {#each tab_pills_preview as data, index}",
    		ctx
    	});

    	return block;
    }

    // (58:20) {#if data._bgimg}
    function create_if_block_1$6(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");

    			if (img.src !== (img_src_value = (window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[5]._bgimg)) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[5]._alt);
    			add_location(img, file$d, 58, 24, 2357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "load", /*load_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tab_pills_preview*/ 4 && img.src !== (img_src_value = (window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[5]._bgimg)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*tab_pills_preview*/ 4 && img_alt_value !== (img_alt_value = /*data*/ ctx[5]._alt)) {
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
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(58:20) {#if data._bgimg}",
    		ctx
    	});

    	return block;
    }

    // (47:12) {#each tab_pills_preview as data, index}
    function create_each_block$c(ctx) {
    	let div;
    	let t0;
    	let dragpreview;
    	let t1;
    	let droppreview;
    	let t2;
    	let radiopreview;
    	let t3;
    	let selectpreview;
    	let t4;
    	let textboxpreview;
    	let t5;
    	let checkboxpreview;
    	let t6;
    	let tabheadpreview;
    	let t7;
    	let hotspotpreview;
    	let t8;
    	let menulistpreview;
    	let t9;
    	let div_key_value;
    	let div_id_value;
    	let div_class_value;
    	let current;
    	let if_block = /*data*/ ctx[5]._bgimg && create_if_block_1$6(ctx);

    	dragpreview = new DragPreview({
    			props: {
    				modules: /*data*/ ctx[5].drag ? /*data*/ ctx[5].drag : []
    			},
    			$$inline: true
    		});

    	droppreview = new DropPreview({
    			props: {
    				modules: /*data*/ ctx[5].drop ? /*data*/ ctx[5].drop : [],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	radiopreview = new RadioPreview({
    			props: {
    				modules: /*data*/ ctx[5].radio ? /*data*/ ctx[5].radio : [],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	selectpreview = new SelectPreview({
    			props: {
    				modules: /*data*/ ctx[5].select ? /*data*/ ctx[5].select : [],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	textboxpreview = new TextboxPreview({
    			props: {
    				modules: /*data*/ ctx[5].textbox ? /*data*/ ctx[5].textbox : [],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	checkboxpreview = new CheckboxPreview({
    			props: {
    				modules: /*data*/ ctx[5].checkbox ? /*data*/ ctx[5].checkbox : [],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tabheadpreview = new TabheadPreview({
    			props: {
    				modules: /*data*/ ctx[5].tabhead ? /*data*/ ctx[5].tabhead : []
    			},
    			$$inline: true
    		});

    	hotspotpreview = new HotspotPreview({
    			props: {
    				modules: /*data*/ ctx[5].hotspot ? /*data*/ ctx[5].hotspot : [],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	menulistpreview = new MenulistPreview({
    			props: {
    				modules: /*data*/ ctx[5].menulist ? /*data*/ ctx[5].menulist : []
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(dragpreview.$$.fragment);
    			t1 = space();
    			create_component(droppreview.$$.fragment);
    			t2 = space();
    			create_component(radiopreview.$$.fragment);
    			t3 = space();
    			create_component(selectpreview.$$.fragment);
    			t4 = space();
    			create_component(textboxpreview.$$.fragment);
    			t5 = space();
    			create_component(checkboxpreview.$$.fragment);
    			t6 = space();
    			create_component(tabheadpreview.$$.fragment);
    			t7 = space();
    			create_component(hotspotpreview.$$.fragment);
    			t8 = space();
    			create_component(menulistpreview.$$.fragment);
    			t9 = space();
    			attr_dev(div, "key", div_key_value = "tab_pills_preview_" + /*index*/ ctx[7]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[5]._id);
    			attr_dev(div, "type", "tab");
    			attr_dev(div, "role", "tabpanel");
    			attr_dev(div, "class", div_class_value = "tab-pane " + (/*data*/ ctx[5]._display == "1" ? "active" : ""));
    			attr_dev(div, "data-correctans", "");
    			attr_dev(div, "data-userans", "");
    			attr_dev(div, "data-defaultans", "");
    			add_location(div, file$d, 47, 16, 1911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(dragpreview, div, null);
    			append_dev(div, t1);
    			mount_component(droppreview, div, null);
    			append_dev(div, t2);
    			mount_component(radiopreview, div, null);
    			append_dev(div, t3);
    			mount_component(selectpreview, div, null);
    			append_dev(div, t4);
    			mount_component(textboxpreview, div, null);
    			append_dev(div, t5);
    			mount_component(checkboxpreview, div, null);
    			append_dev(div, t6);
    			mount_component(tabheadpreview, div, null);
    			append_dev(div, t7);
    			mount_component(hotspotpreview, div, null);
    			append_dev(div, t8);
    			mount_component(menulistpreview, div, null);
    			append_dev(div, t9);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[5]._bgimg) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const dragpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) dragpreview_changes.modules = /*data*/ ctx[5].drag ? /*data*/ ctx[5].drag : [];
    			dragpreview.$set(dragpreview_changes);
    			const droppreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) droppreview_changes.modules = /*data*/ ctx[5].drop ? /*data*/ ctx[5].drop : [];
    			if (dirty & /*uxml*/ 1) droppreview_changes.uxml = /*uxml*/ ctx[0];
    			droppreview.$set(droppreview_changes);
    			const radiopreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) radiopreview_changes.modules = /*data*/ ctx[5].radio ? /*data*/ ctx[5].radio : [];
    			if (dirty & /*uxml*/ 1) radiopreview_changes.uxml = /*uxml*/ ctx[0];
    			radiopreview.$set(radiopreview_changes);
    			const selectpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) selectpreview_changes.modules = /*data*/ ctx[5].select ? /*data*/ ctx[5].select : [];
    			if (dirty & /*uxml*/ 1) selectpreview_changes.uxml = /*uxml*/ ctx[0];
    			selectpreview.$set(selectpreview_changes);
    			const textboxpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) textboxpreview_changes.modules = /*data*/ ctx[5].textbox ? /*data*/ ctx[5].textbox : [];
    			if (dirty & /*uxml*/ 1) textboxpreview_changes.uxml = /*uxml*/ ctx[0];
    			textboxpreview.$set(textboxpreview_changes);
    			const checkboxpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) checkboxpreview_changes.modules = /*data*/ ctx[5].checkbox ? /*data*/ ctx[5].checkbox : [];
    			if (dirty & /*uxml*/ 1) checkboxpreview_changes.uxml = /*uxml*/ ctx[0];
    			checkboxpreview.$set(checkboxpreview_changes);
    			const tabheadpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) tabheadpreview_changes.modules = /*data*/ ctx[5].tabhead ? /*data*/ ctx[5].tabhead : [];
    			tabheadpreview.$set(tabheadpreview_changes);
    			const hotspotpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) hotspotpreview_changes.modules = /*data*/ ctx[5].hotspot ? /*data*/ ctx[5].hotspot : [];
    			if (dirty & /*uxml*/ 1) hotspotpreview_changes.uxml = /*uxml*/ ctx[0];
    			hotspotpreview.$set(hotspotpreview_changes);
    			const menulistpreview_changes = {};
    			if (dirty & /*tab_pills_preview*/ 4) menulistpreview_changes.modules = /*data*/ ctx[5].menulist ? /*data*/ ctx[5].menulist : [];
    			menulistpreview.$set(menulistpreview_changes);

    			if (!current || dirty & /*tab_pills_preview*/ 4 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[5]._id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (!current || dirty & /*tab_pills_preview*/ 4 && div_class_value !== (div_class_value = "tab-pane " + (/*data*/ ctx[5]._display == "1" ? "active" : ""))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dragpreview.$$.fragment, local);
    			transition_in(droppreview.$$.fragment, local);
    			transition_in(radiopreview.$$.fragment, local);
    			transition_in(selectpreview.$$.fragment, local);
    			transition_in(textboxpreview.$$.fragment, local);
    			transition_in(checkboxpreview.$$.fragment, local);
    			transition_in(tabheadpreview.$$.fragment, local);
    			transition_in(hotspotpreview.$$.fragment, local);
    			transition_in(menulistpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dragpreview.$$.fragment, local);
    			transition_out(droppreview.$$.fragment, local);
    			transition_out(radiopreview.$$.fragment, local);
    			transition_out(selectpreview.$$.fragment, local);
    			transition_out(textboxpreview.$$.fragment, local);
    			transition_out(checkboxpreview.$$.fragment, local);
    			transition_out(tabheadpreview.$$.fragment, local);
    			transition_out(hotspotpreview.$$.fragment, local);
    			transition_out(menulistpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(dragpreview);
    			destroy_component(droppreview);
    			destroy_component(radiopreview);
    			destroy_component(selectpreview);
    			destroy_component(textboxpreview);
    			destroy_component(checkboxpreview);
    			destroy_component(tabheadpreview);
    			destroy_component(hotspotpreview);
    			destroy_component(menulistpreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(47:12) {#each tab_pills_preview as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let current;
    	let if_block = /*tab_pills_preview*/ ctx[2] && /*tab_pills_preview*/ ctx[2].length > 0 && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$d, 36, 0, 1160);
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
    			if (/*tab_pills_preview*/ ctx[2] && /*tab_pills_preview*/ ctx[2].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*tab_pills_preview*/ 4) {
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
    	validate_slots("TabPillsPreview", slots, []);
    	let { modules } = $$props;
    	let { uxml = "" } = $$props;
    	let { checkImages } = $$props;
    	let tab_pills_preview = modules;
    	const writable_props = ["modules", "uxml", "checkImages"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TabPillsPreview> was created with unknown prop '${key}'`);
    	});

    	const load_handler = () => {
    		checkImages(2);
    	};

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(3, modules = $$props.modules);
    		if ("uxml" in $$props) $$invalidate(0, uxml = $$props.uxml);
    		if ("checkImages" in $$props) $$invalidate(1, checkImages = $$props.checkImages);
    	};

    	$$self.$capture_state = () => ({
    		DragPreview,
    		DropPreview,
    		RadioPreview,
    		SelectPreview,
    		TextboxPreview,
    		CheckboxPreview,
    		TabheadPreview,
    		HotspotPreview,
    		MenulistPreview,
    		modules,
    		uxml,
    		checkImages,
    		tab_pills_preview
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(3, modules = $$props.modules);
    		if ("uxml" in $$props) $$invalidate(0, uxml = $$props.uxml);
    		if ("checkImages" in $$props) $$invalidate(1, checkImages = $$props.checkImages);
    		if ("tab_pills_preview" in $$props) $$invalidate(2, tab_pills_preview = $$props.tab_pills_preview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules*/ 8) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(2, tab_pills_preview = []);
    					$$invalidate(2, tab_pills_preview[0] = modules, tab_pills_preview);
    				} else {
    					$$invalidate(2, tab_pills_preview = modules);
    				}
    			} else {
    				$$invalidate(2, tab_pills_preview = []);
    			}
    		}
    	};

    	return [uxml, checkImages, tab_pills_preview, modules, load_handler];
    }

    class TabPillsPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { modules: 3, uxml: 0, checkImages: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPillsPreview",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[3] === undefined && !("modules" in props)) {
    			console.warn("<TabPillsPreview> was created without expected prop 'modules'");
    		}

    		if (/*checkImages*/ ctx[1] === undefined && !("checkImages" in props)) {
    			console.warn("<TabPillsPreview> was created without expected prop 'checkImages'");
    		}
    	}

    	get modules() {
    		throw new Error("<TabPillsPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<TabPillsPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<TabPillsPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<TabPillsPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checkImages() {
    		throw new Error("<TabPillsPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkImages(value) {
    		throw new Error("<TabPillsPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/TabPreview.svelte generated by Svelte v3.34.0 */
    const file$e = "clsSMDragNDrop/libs/preview/TabPreview.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (40:4) {#if tab_preview && tab_preview.length > 0}
    function create_if_block$e(ctx) {
    	let ul;
    	let t;
    	let div;
    	let current;
    	let each_value_1 = /*tab_preview*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	let each_value = /*tab_preview*/ ctx[3];
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

    			attr_dev(ul, "class", "nav nav-tabs margin-bottom dndTest mt-3");
    			attr_dev(ul, "data-correctans", "");
    			attr_dev(ul, "data-userans", "");
    			attr_dev(ul, "data-defaultans", "");
    			add_location(ul, file$e, 40, 8, 1271);
    			attr_dev(div, "class", "tab-content dndTest");
    			attr_dev(div, "type", "tab");
    			set_style(div, "position", "relative");
    			add_location(div, file$e, 47, 8, 1737);
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
    			if (dirty & /*tab_preview*/ 8) {
    				each_value_1 = /*tab_preview*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*tab_preview, checkImages, uxml, containerID, window*/ 15) {
    				each_value = /*tab_preview*/ ctx[3];
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
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(40:4) {#if tab_preview && tab_preview.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (42:12) {#each tab_preview as data, index}
    function create_each_block_1$4(ctx) {
    	let li;
    	let a;
    	let t0_value = /*data*/ ctx[6]._value + "";
    	let t0;
    	let a_href_value;
    	let a_data_bs_target_value;
    	let a_class_value;
    	let t1;
    	let li_key_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = "#dnd" + /*data*/ ctx[6]._id);
    			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#dnd" + /*data*/ ctx[6]._id);
    			attr_dev(a, "data-bs-toggle", "tab");

    			attr_dev(a, "class", a_class_value = /*data*/ ctx[6]._display == "1"
    			? " active nav-link"
    			: " nav-link");

    			add_location(a, file$e, 43, 20, 1509);
    			attr_dev(li, "key", li_key_value = "tab_list_" + /*index*/ ctx[8]);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$e, 42, 16, 1441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tab_preview*/ 8 && t0_value !== (t0_value = /*data*/ ctx[6]._value + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*tab_preview*/ 8 && a_href_value !== (a_href_value = "#dnd" + /*data*/ ctx[6]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tab_preview*/ 8 && a_data_bs_target_value !== (a_data_bs_target_value = "#dnd" + /*data*/ ctx[6]._id)) {
    				attr_dev(a, "data-bs-target", a_data_bs_target_value);
    			}

    			if (dirty & /*tab_preview*/ 8 && a_class_value !== (a_class_value = /*data*/ ctx[6]._display == "1"
    			? " active nav-link"
    			: " nav-link")) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(42:12) {#each tab_preview as data, index}",
    		ctx
    	});

    	return block;
    }

    // (60:20) {#if data._bgimg}
    function create_if_block_1$7(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");

    			if (img.src !== (img_src_value = (window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[6]._bgimg)) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[6]._alt);
    			add_location(img, file$e, 60, 24, 2311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "load", /*load_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tab_preview*/ 8 && img.src !== (img_src_value = (window.inNative
    			? "https://s3.amazonaws.com/jigyaasa_content_static/"
    			: "https://s3.amazonaws.com/jigyaasa_content_static/") + /*data*/ ctx[6]._bgimg)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*tab_preview*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[6]._alt)) {
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
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(60:20) {#if data._bgimg}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#each tab_preview as data, index}
    function create_each_block$d(ctx) {
    	let div;
    	let t0;
    	let dragpreview;
    	let t1;
    	let droppreview;
    	let t2;
    	let radiopreview;
    	let t3;
    	let selectpreview;
    	let t4;
    	let textboxpreview;
    	let t5;
    	let checkboxpreview;
    	let t6;
    	let tabheadpreview;
    	let t7;
    	let hotspotpreview;
    	let t8;
    	let menulistpreview;
    	let t9;
    	let tabpillspreview;
    	let t10;
    	let div_key_value;
    	let div_id_value;
    	let div_class_value;
    	let current;
    	let if_block = /*data*/ ctx[6]._bgimg && create_if_block_1$7(ctx);

    	dragpreview = new DragPreview({
    			props: {
    				modules: /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	droppreview = new DropPreview({
    			props: {
    				modules: /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	radiopreview = new RadioPreview({
    			props: {
    				modules: /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	selectpreview = new SelectPreview({
    			props: {
    				modules: /*data*/ ctx[6].select ? /*data*/ ctx[6].select : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	textboxpreview = new TextboxPreview({
    			props: {
    				modules: /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	checkboxpreview = new CheckboxPreview({
    			props: {
    				modules: /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	tabheadpreview = new TabheadPreview({
    			props: {
    				modules: /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	hotspotpreview = new HotspotPreview({
    			props: {
    				modules: /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	menulistpreview = new MenulistPreview({
    			props: {
    				modules: /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tabpillspreview = new TabPillsPreview({
    			props: {
    				modules: /*data*/ ctx[6].tab ? /*data*/ ctx[6].tab : [],
    				checkImages: /*checkImages*/ ctx[2],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(dragpreview.$$.fragment);
    			t1 = space();
    			create_component(droppreview.$$.fragment);
    			t2 = space();
    			create_component(radiopreview.$$.fragment);
    			t3 = space();
    			create_component(selectpreview.$$.fragment);
    			t4 = space();
    			create_component(textboxpreview.$$.fragment);
    			t5 = space();
    			create_component(checkboxpreview.$$.fragment);
    			t6 = space();
    			create_component(tabheadpreview.$$.fragment);
    			t7 = space();
    			create_component(hotspotpreview.$$.fragment);
    			t8 = space();
    			create_component(menulistpreview.$$.fragment);
    			t9 = space();
    			create_component(tabpillspreview.$$.fragment);
    			t10 = space();
    			attr_dev(div, "key", div_key_value = "tab_preview_" + /*index*/ ctx[8]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[6]._id);
    			attr_dev(div, "role", "tabpanel");
    			attr_dev(div, "type", "tab");
    			attr_dev(div, "class", div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""));
    			attr_dev(div, "data-correctans", "");
    			attr_dev(div, "data-userans", "");
    			attr_dev(div, "data-defaultans", "");
    			add_location(div, file$e, 49, 16, 1871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(dragpreview, div, null);
    			append_dev(div, t1);
    			mount_component(droppreview, div, null);
    			append_dev(div, t2);
    			mount_component(radiopreview, div, null);
    			append_dev(div, t3);
    			mount_component(selectpreview, div, null);
    			append_dev(div, t4);
    			mount_component(textboxpreview, div, null);
    			append_dev(div, t5);
    			mount_component(checkboxpreview, div, null);
    			append_dev(div, t6);
    			mount_component(tabheadpreview, div, null);
    			append_dev(div, t7);
    			mount_component(hotspotpreview, div, null);
    			append_dev(div, t8);
    			mount_component(menulistpreview, div, null);
    			append_dev(div, t9);
    			mount_component(tabpillspreview, div, null);
    			append_dev(div, t10);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[6]._bgimg) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const dragpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) dragpreview_changes.modules = /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : [];
    			if (dirty & /*containerID*/ 1) dragpreview_changes.containerID = /*containerID*/ ctx[0];
    			dragpreview.$set(dragpreview_changes);
    			const droppreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) droppreview_changes.modules = /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : [];
    			if (dirty & /*containerID*/ 1) droppreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) droppreview_changes.uxml = /*uxml*/ ctx[1];
    			droppreview.$set(droppreview_changes);
    			const radiopreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) radiopreview_changes.modules = /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : [];
    			if (dirty & /*containerID*/ 1) radiopreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) radiopreview_changes.uxml = /*uxml*/ ctx[1];
    			radiopreview.$set(radiopreview_changes);
    			const selectpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) selectpreview_changes.modules = /*data*/ ctx[6].select ? /*data*/ ctx[6].select : [];
    			if (dirty & /*containerID*/ 1) selectpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) selectpreview_changes.uxml = /*uxml*/ ctx[1];
    			selectpreview.$set(selectpreview_changes);
    			const textboxpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) textboxpreview_changes.modules = /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : [];
    			if (dirty & /*containerID*/ 1) textboxpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) textboxpreview_changes.uxml = /*uxml*/ ctx[1];
    			textboxpreview.$set(textboxpreview_changes);
    			const checkboxpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) checkboxpreview_changes.modules = /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : [];
    			if (dirty & /*containerID*/ 1) checkboxpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) checkboxpreview_changes.uxml = /*uxml*/ ctx[1];
    			checkboxpreview.$set(checkboxpreview_changes);
    			const tabheadpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) tabheadpreview_changes.modules = /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : [];
    			if (dirty & /*containerID*/ 1) tabheadpreview_changes.containerID = /*containerID*/ ctx[0];
    			tabheadpreview.$set(tabheadpreview_changes);
    			const hotspotpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) hotspotpreview_changes.modules = /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : [];
    			if (dirty & /*containerID*/ 1) hotspotpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) hotspotpreview_changes.uxml = /*uxml*/ ctx[1];
    			hotspotpreview.$set(hotspotpreview_changes);
    			const menulistpreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) menulistpreview_changes.modules = /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : [];
    			if (dirty & /*containerID*/ 1) menulistpreview_changes.containerID = /*containerID*/ ctx[0];
    			menulistpreview.$set(menulistpreview_changes);
    			const tabpillspreview_changes = {};
    			if (dirty & /*tab_preview*/ 8) tabpillspreview_changes.modules = /*data*/ ctx[6].tab ? /*data*/ ctx[6].tab : [];
    			if (dirty & /*checkImages*/ 4) tabpillspreview_changes.checkImages = /*checkImages*/ ctx[2];
    			if (dirty & /*uxml*/ 2) tabpillspreview_changes.uxml = /*uxml*/ ctx[1];
    			tabpillspreview.$set(tabpillspreview_changes);

    			if (!current || dirty & /*tab_preview*/ 8 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[6]._id)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (!current || dirty & /*tab_preview*/ 8 && div_class_value !== (div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dragpreview.$$.fragment, local);
    			transition_in(droppreview.$$.fragment, local);
    			transition_in(radiopreview.$$.fragment, local);
    			transition_in(selectpreview.$$.fragment, local);
    			transition_in(textboxpreview.$$.fragment, local);
    			transition_in(checkboxpreview.$$.fragment, local);
    			transition_in(tabheadpreview.$$.fragment, local);
    			transition_in(hotspotpreview.$$.fragment, local);
    			transition_in(menulistpreview.$$.fragment, local);
    			transition_in(tabpillspreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dragpreview.$$.fragment, local);
    			transition_out(droppreview.$$.fragment, local);
    			transition_out(radiopreview.$$.fragment, local);
    			transition_out(selectpreview.$$.fragment, local);
    			transition_out(textboxpreview.$$.fragment, local);
    			transition_out(checkboxpreview.$$.fragment, local);
    			transition_out(tabheadpreview.$$.fragment, local);
    			transition_out(hotspotpreview.$$.fragment, local);
    			transition_out(menulistpreview.$$.fragment, local);
    			transition_out(tabpillspreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(dragpreview);
    			destroy_component(droppreview);
    			destroy_component(radiopreview);
    			destroy_component(selectpreview);
    			destroy_component(textboxpreview);
    			destroy_component(checkboxpreview);
    			destroy_component(tabheadpreview);
    			destroy_component(hotspotpreview);
    			destroy_component(menulistpreview);
    			destroy_component(tabpillspreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(49:12) {#each tab_preview as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let current;
    	let if_block = /*tab_preview*/ ctx[3] && /*tab_preview*/ ctx[3].length > 0 && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$e, 38, 0, 1209);
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
    			if (/*tab_preview*/ ctx[3] && /*tab_preview*/ ctx[3].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*tab_preview*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID } = $$props;
    	let { uxml = "" } = $$props;
    	let { checkImages } = $$props;
    	let tab_preview = modules;
    	const writable_props = ["modules", "containerID", "uxml", "checkImages"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TabPreview> was created with unknown prop '${key}'`);
    	});

    	const load_handler = () => {
    		checkImages(2);
    	};

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(0, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(1, uxml = $$props.uxml);
    		if ("checkImages" in $$props) $$invalidate(2, checkImages = $$props.checkImages);
    	};

    	$$self.$capture_state = () => ({
    		DragPreview,
    		DropPreview,
    		RadioPreview,
    		SelectPreview,
    		TextboxPreview,
    		CheckboxPreview,
    		TabheadPreview,
    		HotspotPreview,
    		MenulistPreview,
    		TabPillsPreview,
    		modules,
    		containerID,
    		uxml,
    		checkImages,
    		tab_preview
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(0, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(1, uxml = $$props.uxml);
    		if ("checkImages" in $$props) $$invalidate(2, checkImages = $$props.checkImages);
    		if ("tab_preview" in $$props) $$invalidate(3, tab_preview = $$props.tab_preview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules*/ 16) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(3, tab_preview = []);
    					$$invalidate(3, tab_preview[0] = modules, tab_preview);
    				} else {
    					$$invalidate(3, tab_preview = modules);
    				}
    			} else {
    				$$invalidate(3, tab_preview = []);
    			}
    		}
    	};

    	return [containerID, uxml, checkImages, tab_preview, modules, load_handler];
    }

    class TabPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			modules: 4,
    			containerID: 0,
    			uxml: 1,
    			checkImages: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPreview",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
    			console.warn("<TabPreview> was created without expected prop 'modules'");
    		}

    		if (/*containerID*/ ctx[0] === undefined && !("containerID" in props)) {
    			console.warn("<TabPreview> was created without expected prop 'containerID'");
    		}

    		if (/*checkImages*/ ctx[2] === undefined && !("checkImages" in props)) {
    			console.warn("<TabPreview> was created without expected prop 'checkImages'");
    		}
    	}

    	get modules() {
    		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checkImages() {
    		throw new Error("<TabPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkImages(value) {
    		throw new Error("<TabPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* clsSMDragNDrop/libs/preview/StepPreview.svelte generated by Svelte v3.34.0 */
    const file$f = "clsSMDragNDrop/libs/preview/StepPreview.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (42:4) {#if step && step.length > 0}
    function create_if_block$f(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*step*/ ctx[3];
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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*step, containerID, checkImages, uxml, window*/ 15) {
    				each_value = /*step*/ ctx[3];
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
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(42:4) {#if step && step.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (54:16) {#if data._bgimg}
    function create_if_block_1$8(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	function error_handler(...args) {
    		return /*error_handler*/ ctx[6](/*data*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");

    			if (img.src !== (img_src_value = window.inNative
    			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*data*/ ctx[7]._bgimg
    			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[7]._bgimg)) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[7]._alt);
    			add_location(img, file$f, 54, 5, 1765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "load", /*load_handler*/ ctx[5], false, false, false),
    					listen_dev(img, "error", error_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*step*/ 8 && img.src !== (img_src_value = window.inNative
    			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*data*/ ctx[7]._bgimg
    			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[7]._bgimg)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*step*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[7]._alt)) {
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
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(54:16) {#if data._bgimg}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {#each step as data, index}
    function create_each_block$e(ctx) {
    	let div;
    	let t0;
    	let dragpreview;
    	let t1;
    	let droppreview;
    	let t2;
    	let radiopreview;
    	let t3;
    	let selectpreview;
    	let t4;
    	let textboxpreview;
    	let t5;
    	let checkboxpreview;
    	let t6;
    	let tabheadpreview;
    	let t7;
    	let hotspotpreview;
    	let t8;
    	let menulistpreview;
    	let t9;
    	let multilineboxpreview;
    	let t10;
    	let tabpreview;
    	let t11;
    	let buttonpreview;
    	let t12;
    	let labelpreview;
    	let t13;
    	let div_key_value;
    	let div_id_value;
    	let current;
    	let if_block = /*data*/ ctx[7]._bgimg && create_if_block_1$8(ctx);

    	dragpreview = new DragPreview({
    			props: {
    				modules: /*data*/ ctx[7].drag ? /*data*/ ctx[7].drag : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	droppreview = new DropPreview({
    			props: {
    				modules: /*data*/ ctx[7].drop ? /*data*/ ctx[7].drop : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	radiopreview = new RadioPreview({
    			props: {
    				modules: /*data*/ ctx[7].radio ? /*data*/ ctx[7].radio : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	selectpreview = new SelectPreview({
    			props: {
    				modules: /*data*/ ctx[7].select ? /*data*/ ctx[7].select : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	textboxpreview = new TextboxPreview({
    			props: {
    				modules: /*data*/ ctx[7].textbox ? /*data*/ ctx[7].textbox : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	checkboxpreview = new CheckboxPreview({
    			props: {
    				modules: /*data*/ ctx[7].checkbox ? /*data*/ ctx[7].checkbox : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	tabheadpreview = new TabheadPreview({
    			props: {
    				modules: /*data*/ ctx[7].tabhead ? /*data*/ ctx[7].tabhead : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	hotspotpreview = new HotspotPreview({
    			props: {
    				modules: /*data*/ ctx[7].hotspot ? /*data*/ ctx[7].hotspot : [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	menulistpreview = new MenulistPreview({
    			props: {
    				modules: /*data*/ ctx[7].menulist ? /*data*/ ctx[7].menulist : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	multilineboxpreview = new MultilineboxPreview({
    			props: {
    				modules: /*data*/ ctx[7].multilinebox
    				? /*data*/ ctx[7].multilinebox
    				: [],
    				containerID: /*containerID*/ ctx[0],
    				uxml: /*uxml*/ ctx[1]
    			},
    			$$inline: true
    		});

    	tabpreview = new TabPreview({
    			props: {
    				checkImages: /*checkImages*/ ctx[2],
    				modules: /*data*/ ctx[7].tab ? /*data*/ ctx[7].tab : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	buttonpreview = new ButtonPreview({
    			props: {
    				modules: /*data*/ ctx[7].button ? /*data*/ ctx[7].button : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	labelpreview = new LabelPreview({
    			props: {
    				modules: /*data*/ ctx[7].label ? /*data*/ ctx[7].label : [],
    				containerID: /*containerID*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(dragpreview.$$.fragment);
    			t1 = space();
    			create_component(droppreview.$$.fragment);
    			t2 = space();
    			create_component(radiopreview.$$.fragment);
    			t3 = space();
    			create_component(selectpreview.$$.fragment);
    			t4 = space();
    			create_component(textboxpreview.$$.fragment);
    			t5 = space();
    			create_component(checkboxpreview.$$.fragment);
    			t6 = space();
    			create_component(tabheadpreview.$$.fragment);
    			t7 = space();
    			create_component(hotspotpreview.$$.fragment);
    			t8 = space();
    			create_component(menulistpreview.$$.fragment);
    			t9 = space();
    			create_component(multilineboxpreview.$$.fragment);
    			t10 = space();
    			create_component(tabpreview.$$.fragment);
    			t11 = space();
    			create_component(buttonpreview.$$.fragment);
    			t12 = space();
    			create_component(labelpreview.$$.fragment);
    			t13 = space();
    			attr_dev(div, "key", div_key_value = /*index*/ ctx[9]);
    			attr_dev(div, "id", div_id_value = "dnd" + /*data*/ ctx[7]._id);
    			attr_dev(div, "type", "step");
    			attr_dev(div, "class", "step dndTest");
    			set_style(div, "position", "relative");
    			attr_dev(div, "data-ddisplay", "");
    			attr_dev(div, "data-udisplay", "");
    			attr_dev(div, "data-cdisplay", "");
    			add_location(div, file$f, 43, 12, 1434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(dragpreview, div, null);
    			append_dev(div, t1);
    			mount_component(droppreview, div, null);
    			append_dev(div, t2);
    			mount_component(radiopreview, div, null);
    			append_dev(div, t3);
    			mount_component(selectpreview, div, null);
    			append_dev(div, t4);
    			mount_component(textboxpreview, div, null);
    			append_dev(div, t5);
    			mount_component(checkboxpreview, div, null);
    			append_dev(div, t6);
    			mount_component(tabheadpreview, div, null);
    			append_dev(div, t7);
    			mount_component(hotspotpreview, div, null);
    			append_dev(div, t8);
    			mount_component(menulistpreview, div, null);
    			append_dev(div, t9);
    			mount_component(multilineboxpreview, div, null);
    			append_dev(div, t10);
    			mount_component(tabpreview, div, null);
    			append_dev(div, t11);
    			mount_component(buttonpreview, div, null);
    			append_dev(div, t12);
    			mount_component(labelpreview, div, null);
    			append_dev(div, t13);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[7]._bgimg) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$8(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const dragpreview_changes = {};
    			if (dirty & /*step*/ 8) dragpreview_changes.modules = /*data*/ ctx[7].drag ? /*data*/ ctx[7].drag : [];
    			if (dirty & /*containerID*/ 1) dragpreview_changes.containerID = /*containerID*/ ctx[0];
    			dragpreview.$set(dragpreview_changes);
    			const droppreview_changes = {};
    			if (dirty & /*step*/ 8) droppreview_changes.modules = /*data*/ ctx[7].drop ? /*data*/ ctx[7].drop : [];
    			if (dirty & /*containerID*/ 1) droppreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) droppreview_changes.uxml = /*uxml*/ ctx[1];
    			droppreview.$set(droppreview_changes);
    			const radiopreview_changes = {};
    			if (dirty & /*step*/ 8) radiopreview_changes.modules = /*data*/ ctx[7].radio ? /*data*/ ctx[7].radio : [];
    			if (dirty & /*containerID*/ 1) radiopreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) radiopreview_changes.uxml = /*uxml*/ ctx[1];
    			radiopreview.$set(radiopreview_changes);
    			const selectpreview_changes = {};
    			if (dirty & /*step*/ 8) selectpreview_changes.modules = /*data*/ ctx[7].select ? /*data*/ ctx[7].select : [];
    			if (dirty & /*containerID*/ 1) selectpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) selectpreview_changes.uxml = /*uxml*/ ctx[1];
    			selectpreview.$set(selectpreview_changes);
    			const textboxpreview_changes = {};
    			if (dirty & /*step*/ 8) textboxpreview_changes.modules = /*data*/ ctx[7].textbox ? /*data*/ ctx[7].textbox : [];
    			if (dirty & /*containerID*/ 1) textboxpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) textboxpreview_changes.uxml = /*uxml*/ ctx[1];
    			textboxpreview.$set(textboxpreview_changes);
    			const checkboxpreview_changes = {};
    			if (dirty & /*step*/ 8) checkboxpreview_changes.modules = /*data*/ ctx[7].checkbox ? /*data*/ ctx[7].checkbox : [];
    			if (dirty & /*containerID*/ 1) checkboxpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) checkboxpreview_changes.uxml = /*uxml*/ ctx[1];
    			checkboxpreview.$set(checkboxpreview_changes);
    			const tabheadpreview_changes = {};
    			if (dirty & /*step*/ 8) tabheadpreview_changes.modules = /*data*/ ctx[7].tabhead ? /*data*/ ctx[7].tabhead : [];
    			if (dirty & /*containerID*/ 1) tabheadpreview_changes.containerID = /*containerID*/ ctx[0];
    			tabheadpreview.$set(tabheadpreview_changes);
    			const hotspotpreview_changes = {};
    			if (dirty & /*step*/ 8) hotspotpreview_changes.modules = /*data*/ ctx[7].hotspot ? /*data*/ ctx[7].hotspot : [];
    			if (dirty & /*containerID*/ 1) hotspotpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) hotspotpreview_changes.uxml = /*uxml*/ ctx[1];
    			hotspotpreview.$set(hotspotpreview_changes);
    			const menulistpreview_changes = {};
    			if (dirty & /*step*/ 8) menulistpreview_changes.modules = /*data*/ ctx[7].menulist ? /*data*/ ctx[7].menulist : [];
    			if (dirty & /*containerID*/ 1) menulistpreview_changes.containerID = /*containerID*/ ctx[0];
    			menulistpreview.$set(menulistpreview_changes);
    			const multilineboxpreview_changes = {};

    			if (dirty & /*step*/ 8) multilineboxpreview_changes.modules = /*data*/ ctx[7].multilinebox
    			? /*data*/ ctx[7].multilinebox
    			: [];

    			if (dirty & /*containerID*/ 1) multilineboxpreview_changes.containerID = /*containerID*/ ctx[0];
    			if (dirty & /*uxml*/ 2) multilineboxpreview_changes.uxml = /*uxml*/ ctx[1];
    			multilineboxpreview.$set(multilineboxpreview_changes);
    			const tabpreview_changes = {};
    			if (dirty & /*checkImages*/ 4) tabpreview_changes.checkImages = /*checkImages*/ ctx[2];
    			if (dirty & /*step*/ 8) tabpreview_changes.modules = /*data*/ ctx[7].tab ? /*data*/ ctx[7].tab : [];
    			if (dirty & /*containerID*/ 1) tabpreview_changes.containerID = /*containerID*/ ctx[0];
    			tabpreview.$set(tabpreview_changes);
    			const buttonpreview_changes = {};
    			if (dirty & /*step*/ 8) buttonpreview_changes.modules = /*data*/ ctx[7].button ? /*data*/ ctx[7].button : [];
    			if (dirty & /*containerID*/ 1) buttonpreview_changes.containerID = /*containerID*/ ctx[0];
    			buttonpreview.$set(buttonpreview_changes);
    			const labelpreview_changes = {};
    			if (dirty & /*step*/ 8) labelpreview_changes.modules = /*data*/ ctx[7].label ? /*data*/ ctx[7].label : [];
    			if (dirty & /*containerID*/ 1) labelpreview_changes.containerID = /*containerID*/ ctx[0];
    			labelpreview.$set(labelpreview_changes);

    			if (!current || dirty & /*step*/ 8 && div_id_value !== (div_id_value = "dnd" + /*data*/ ctx[7]._id)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dragpreview.$$.fragment, local);
    			transition_in(droppreview.$$.fragment, local);
    			transition_in(radiopreview.$$.fragment, local);
    			transition_in(selectpreview.$$.fragment, local);
    			transition_in(textboxpreview.$$.fragment, local);
    			transition_in(checkboxpreview.$$.fragment, local);
    			transition_in(tabheadpreview.$$.fragment, local);
    			transition_in(hotspotpreview.$$.fragment, local);
    			transition_in(menulistpreview.$$.fragment, local);
    			transition_in(multilineboxpreview.$$.fragment, local);
    			transition_in(tabpreview.$$.fragment, local);
    			transition_in(buttonpreview.$$.fragment, local);
    			transition_in(labelpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dragpreview.$$.fragment, local);
    			transition_out(droppreview.$$.fragment, local);
    			transition_out(radiopreview.$$.fragment, local);
    			transition_out(selectpreview.$$.fragment, local);
    			transition_out(textboxpreview.$$.fragment, local);
    			transition_out(checkboxpreview.$$.fragment, local);
    			transition_out(tabheadpreview.$$.fragment, local);
    			transition_out(hotspotpreview.$$.fragment, local);
    			transition_out(menulistpreview.$$.fragment, local);
    			transition_out(multilineboxpreview.$$.fragment, local);
    			transition_out(tabpreview.$$.fragment, local);
    			transition_out(buttonpreview.$$.fragment, local);
    			transition_out(labelpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(dragpreview);
    			destroy_component(droppreview);
    			destroy_component(radiopreview);
    			destroy_component(selectpreview);
    			destroy_component(textboxpreview);
    			destroy_component(checkboxpreview);
    			destroy_component(tabheadpreview);
    			destroy_component(hotspotpreview);
    			destroy_component(menulistpreview);
    			destroy_component(multilineboxpreview);
    			destroy_component(tabpreview);
    			destroy_component(buttonpreview);
    			destroy_component(labelpreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(43:8) {#each step as data, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	let if_block = /*step*/ ctx[3] && /*step*/ ctx[3].length > 0 && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$f, 40, 0, 1346);
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
    			if (/*step*/ ctx[3] && /*step*/ ctx[3].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*step*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$f(ctx);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StepPreview", slots, []);
    	let { modules } = $$props;
    	let { containerID } = $$props;
    	let { uxml = "" } = $$props;
    	let { checkImages } = $$props;
    	let step = modules;
    	const writable_props = ["modules", "containerID", "uxml", "checkImages"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StepPreview> was created with unknown prop '${key}'`);
    	});

    	const load_handler = () => {
    		checkImages(2);
    	};

    	const error_handler = (data, e) => {
    		e.target.onerror = null;
    		e.target.src = "https://s3.amazonaws.com/jigyaasa_content_static/" + data._bgimg;
    	};

    	$$self.$$set = $$props => {
    		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(0, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(1, uxml = $$props.uxml);
    		if ("checkImages" in $$props) $$invalidate(2, checkImages = $$props.checkImages);
    	};

    	$$self.$capture_state = () => ({
    		DragPreview,
    		DropPreview,
    		RadioPreview,
    		SelectPreview,
    		TextboxPreview,
    		CheckboxPreview,
    		TabheadPreview,
    		HotspotPreview,
    		MenulistPreview,
    		MultilineboxPreview,
    		TabPreview,
    		ButtonPreview,
    		LabelPreview,
    		modules,
    		containerID,
    		uxml,
    		checkImages,
    		step
    	});

    	$$self.$inject_state = $$props => {
    		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
    		if ("containerID" in $$props) $$invalidate(0, containerID = $$props.containerID);
    		if ("uxml" in $$props) $$invalidate(1, uxml = $$props.uxml);
    		if ("checkImages" in $$props) $$invalidate(2, checkImages = $$props.checkImages);
    		if ("step" in $$props) $$invalidate(3, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modules*/ 16) {
    			 if (modules) {
    				if (Array.isArray(modules) == false) {
    					$$invalidate(3, step = []);
    					$$invalidate(3, step[0] = modules, step);
    				} else {
    					$$invalidate(3, step = modules);
    				}
    			} else {
    				$$invalidate(3, step = []);
    			}
    		}
    	};

    	return [containerID, uxml, checkImages, step, modules, load_handler, error_handler];
    }

    class StepPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			modules: 4,
    			containerID: 0,
    			uxml: 1,
    			checkImages: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepPreview",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
    			console.warn("<StepPreview> was created without expected prop 'modules'");
    		}

    		if (/*containerID*/ ctx[0] === undefined && !("containerID" in props)) {
    			console.warn("<StepPreview> was created without expected prop 'containerID'");
    		}

    		if (/*checkImages*/ ctx[2] === undefined && !("checkImages" in props)) {
    			console.warn("<StepPreview> was created without expected prop 'checkImages'");
    		}
    	}

    	get modules() {
    		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerID() {
    		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerID(value) {
    		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checkImages() {
    		throw new Error("<StepPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkImages(value) {
    		throw new Error("<StepPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
        itemtype_22 : "In this type of question, you have to write command to perform the task. Press Tab key to navigate.",
        es6_warining: "You are using Internet Explorer, ES6 functionality of javascript will not work!",
        embed_content: "Embed Content",
        plus_minus_option: "Please select the plus and minus option",
        slash_option: 'Please select the slash option',
        decimal_option: 'Please select the decimal option',
    };

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

    var css_248z = "@-webkit-keyframes rotate{to{-webkit-transform:rotate(360deg)}}[id^=dndmain]{position:relative;margin:0;padding:0;min-height:30px;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;border-radius:2px;font-family:Arial,\"Helvetica Neue\",Helvetica,sans-serif;font-size:14px;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[id^=dndmain]:after,[id^=dndmain]:before{display:table;line-height:0;content:\"\"}[id^=dndmain] .nav-pills{margin-top:10px}[id^=dndmain]:after{clear:both}[id^=dndmain] :after,[id^=dndmain] :before,[id^=dndmain] :not(.ttsimg_container):not(.tts_img){-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#steps{text-align:center;border:1px solid #999;background-color:#ddd;width:100%;margin-bottom:5px}[id^=dndmain]>img{max-width:none;width:auto!important;height:auto!important}[id^=dndmain] .drag-resize,[id^=dndmain] .only-dragable{position:absolute;left:90px;top:50px;text-align:center;line-height:20px;background-size:100% 100%;padding:0}.dragable,.dropable{padding:2px;display:inline-table}.dndlabel p,.dragable p,.dropable p{display:table-cell;vertical-align:middle;text-align:center}[id^=dndmain] .dragable{cursor:move}[id^=dndmain] .clone{z-index:0!important;border:0!important}[class*=dnd_]{height:99%!important;width:96%!important;resize:none;font-size:12px;color:#000}.dndarea.cursor_move,.dndtabhead.cursor_move,.hotspot_auth,.hotspot_auth .hs_item{opacity:1;background-color:rgba(250,250,250,.6);box-shadow:0 0 1px #000 inset}.cursor_move:hover{background-color:rgba(240,240,240,.6);box-shadow:0 0 1px #000 inset;cursor:move}.cursor_move:hover .elem{display:none}.elemActive{background-color:rgba(173,216,230,.6)!important;opacity:1!important}.detail{position:absolute;display:block;z-index:1001;max-width:150px;border:1px solid #b2b2b2;border-radius:3px;padding:5px;background-color:#c3c3c3;top:0;left:0;color:#fff}.detail .close_detail{position:absolute;cursor:pointer;top:-10px;right:-10px;font-size:25px;font-weight:bolder;background-color:rgba(0,0,0,.6);border:4px double;border-radius:15px;height:22px;width:22px;text-align:center}.dndlabel{font-size:18px;color:#000;text-align:center;background-size:100% 100%;display:inline-table;line-height:20px}.hotspot .hs_item{border:2px solid red}.dndcheckbox,.dndradio{width:14px!important;height:14px!important;margin-bottom:5px!important}.dnd_select{margin:0!important;padding:0!important}.dnd_img,.dnd_select{overflow:hidden}.dnd_textarea,.dnd_textbox{margin:0!important;padding:0!important}.dnd_textbox{overflow:hidden}.dnd_textarea{border:1px solid gray!important;-webkit-border-radius:3px!important;-moz-border-radius:3px!important;border-radius:3px!important;padding: 2px!important;}.dnd_button{-webkit-border-radius:2px!important;-moz-border-radius:2px!important;-ms-border-radius:2px!important;border-radius:2px!important;outline:0;background:#f5f5f5;background:-moz-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#f5f5f5),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:-o-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:-ms-linear-gradient(top,#f5f5f5 0,#ddd 100%);background:linear-gradient(to bottom,#f5f5f5 0,#ddd 100%);border:1px solid #a4a4a4;padding:0!important;overflow:hidden}.dnd_button:hover{background:#ddd;background:-moz-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#ddd),color-stop(72%,#f5f5f5));background:-webkit-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:-o-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:-ms-linear-gradient(top,#ddd 0,#f5f5f5 72%);background:linear-gradient(to bottom,#ddd 0,#f5f5f5 72%)}.dnd_button:disabled,.dnd_button:disabled:hover{background:#efefef;color:#816d95;border:1px solid #d9d9d9;cursor:not-allowed}[id^=dndmain] .off,[id^=dndmain] .on{z-index:1000;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;border-radius:2px}.dndtabhead,[id^=dndmain] .off{background:0 0;background:#000;opacity:0;cursor:pointer}[id^=dndmain] .off:hover{background-color:rgba(173,222,252,.3);border:1px solid #addefc;opacity:1!important}[id^=dndmain] .on{background-color:rgba(113,183,250,.6);border:1px solid #71b7fa}.zoom1{-webkit-transform:scale(.25);-moz-transform:scale(.25);-o-transform:scale(.25);transform:scale(.25)}.zoom1,.zoom2,.zoom3,.zoom4,.zoom5,.zoom6,.zoom7{-webkit-transform-origin:top left;-moz-transform-origin:top left;-o-transform-origin:top left;transform-origin:top left}.zoom2{-webkit-transform:scale(.5);-moz-transform:scale(.5);-o-transform:scale(.5);transform:scale(.5)}.zoom3{-webkit-transform:scale(.75);-moz-transform:scale(.75);-o-transform:scale(.75);transform:scale(.75)}.zoom4{-webkit-transform:scale(1);-moz-transform:scale(1);-o-transform:scale(1);transform:scale(1)}.zoom5{-webkit-transform:scale(2);-moz-transform:scale(2);-o-transform:scale(2);transform:scale(2)}.zoom6{-webkit-transform:scale(3);-moz-transform:scale(3);-o-transform:scale(3);transform:scale(3)}.zoom7{-webkit-transform:scale(4);-moz-transform:scale(4);-o-transform:scale(4);transform:scale(4)}.c_zoom,.c_zoom input{width:70px}.c_zoom{position:absolute;top:0;right:0;z-index:1001}.zoom_container{position:relative;overflow:auto;height:100%;width:100%}.record{cursor:pointer}.tools{position:absolute;right:1px;top:2px;z-index:25}.tools .labs-btn{padding:2px 5px}.cursor_move .tools{top:-28px;right:0}.events{height:200px;overflow-x:hidden;border:1px solid #a9a9a9;-ms-border-bottom-left-radius:10px;-ms-border-top-left-radius:10px;-moz-border-bottom-left-radius:10px;-moz-border-top-left-radius:10px;border-bottom-left-radius:10px;border-top-left-radius:10px}.event-input input{position:relative;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;z-index:1;width:90%}.event-input select{position:relative;top:-34px;z-index:0;width:265px}.drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px #ff0 inset;outline:1px solid #00f}.custRad{display:none}.customRad{width:20px;height:20px;display:block;line-height:22px;text-align:center;color:#000;font-size:40pt;cursor:pointer;position:relative}.custRad:checked+.customRad:before{opacity:1}.customRad:before{position:absolute;top:1px;left:1px;height:18px;width:18px;content:'';opacity:0}.dndCenter .dnd_textbox{text-align:center}.falseitemColor:before,.tureitemColor:before{content:'\\2713';color:#fff;font-size:15px;line-height:18px}.tureitemColor:before{background:green}.falseitemColor:before{background:red}.tureitemColor{background:#aeeca7}.falseitemColor{background:#e28e96}.tureitemColor:hover{background:#6fcf64}.falseitemColor:hover{background:#f44a37}input.dnd_textbox::-webkit-input-placeholder{text-align:center}input.dnd_textbox:-moz-placeholder{text-align:center}input.dnd_textbox::-moz-placeholder{text-align:center}input.dnd_textbox:-ms-input-placeholder{text-align:center}.selmatch{border:solid 2px red!important;border-radius:2px!important}.copiedclr{background-color:#ccc!important}.bla [id^=dndmain] .dragable:focus,.bla [id^=dndmain] .dropable:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #fff;outline:0}.dndtabhead:focus,.menu:focus{outline:-webkit-focus-ring-color auto 5px;opacity:1;background:0 0}.heading_arial,.heading_calibri,.heading_cambria,.heading_georgia,.heading_roman,.heading_verdana{text-align:center;font-size:21px;font-weight:700}.content_arial,.content_calibri,.content_cambria,.content_georgia,.content_roman,.content_verdana{text-align:left;font-size:16px;line-height:1.2!important}.content_arial p,.content_calibri p,.content_cambria p,.content_georgia p,.content_roman p,.content_verdana p{text-align:left}.content_arial,.heading_arial{font-family:Arial}.content_georgia,.heading_georgia{font-family:Georgia}.content_cambria,.heading_cambria{font-family:Cambria}.content_calibri,.heading_calibri{font-family:Calibri}.content_verdana,.heading_verdana{font-family:Verdana}.content_roman,.heading_roman{font-family:\"Times New Roman\"}.ui-radio.ui-state-disabled{opacity:1}.sql_terminal{background-color:#000;border:0!important;color:silver;box-shadow:none;font-family:Courier;font-size:13px;font-weight:800;outline:0}[id^=dndmain]>.img-bordered{margin-top:1px}.container_div{position:relative;display:block}.baseradio{vertical-align:middle;margin-bottom:3px!important;margin:0 2px}.icomoon-cancel-circles,.icomoon-checkmark-circles{display:inline-block;position:relative;background-size:100%!important}.icomoon-checkmark-circles{height:16px!important;width:17px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAVCAYAAABc6S4mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEVSURBVEhL1ZWvDoJQFId/mozMN9DNYLdAlCbN6qNoMOBD8ALwBBqpBHwCC9WEBIOzIAcPyB+vXlCD38bYvYzv2zgMOnECfkiXzz/je4Ernyt8J3ANYFtD6I6HC29lfB5I5RoWYQD3MIdRiXwWyOVH3jjWIu0DNXnGANPRGD1ePQ8IBpYjlKswjR2WE4XXtcAFnqNjaNkIRJEGcqIQILmB+cFFEC6gPYs0lBMceMjzcVUjLeQEB3oYj6bJeMrkkXM7OVH6FkX7DWbbFTxev+a9nCgNWZkssTPM5NZ3yMmJylskE5GXE7UAIY40k6fQDEScfDNW14iRHmps+ie+Is/LAHGPtJMTUn+0KIyg9Bs8lgL//ssEblMER6y4OqEyAAAAAElFTkSuQmCC) no-repeat 80%}.icomoon-cancel-circles{height:14px!important;width:18px;right:2px!important;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEoSURBVEhLtZXBbQIxEEUHlANIW0BaSAfLMS2QErjSQJQjlEALySEpAZEjJeQYSiBSrpHMt/ZbDOvx2Jc8abT2zPC/zI61kwDkH5nymfOxFtl8clPjB71P+M2Je0U8Qcb7Kh5riOcDkyXO6Fmw/z6Et2/mB3IDLV410eIpbk2Q0XyF0OtmFZmJJc7od+zBls8rv8cGE098Cw22AWQMXJPXZvEIsgU8EysM8QgqDq0mBfEIqhVqJo54pHzREt2DyOOCG4NY67i2oFEBZ1p0OJcR1RKN4ikKJqhYeHO+LL8TwwTZMQ2XqOkyDiCjab+hrSajKZqJzLnU9FuR/cvttHSYnv0RNe41cyVCI8XoFJU5z07i/0UJmtTEE8nEeMn+J/MPcTcsq5i9IheZ7IOr0kv1ugAAAABJRU5ErkJggg==) no-repeat}.dnd_select{width:100%!important}.native.falseitemColor:before,.native.tureitemColor:before{content:'\\\\25CF'!important}.native.customRad:before{top:0!important}.native.radio_sim{border-radius:50%!important;left:2.5px;position:relative}#errmsg.show{display:block!important}.loading{height:0;width:0;padding:15px;border:6px solid #ccc;border-right-color:#888;border-radius:22px;-webkit-animation:rotate 1s infinite linear;position:absolute;left:50%;top:50%}.spinner{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.26);z-index:99}.tabTools{position:relative!important;top:-68px!important}.p-sm{padding:3px}.context{position:absolute;top:0;left:0;min-width:180px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#000;background:#f5f5f5;font-size:9pt;border:1px solid #333;box-shadow:4px 4px 3px -1px rgba(0,0,0,.5);padding:3px 0;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1061}.context .item{padding:4px 19px;cursor:default;color:inherit;text-align:left}.context .item:hover{background:#e3e3e3!important}.context .item:hover .hotkey{color:#000!important}.context .disabled,.context .disabled:hover .hotkey{color:#878b90!important}.context .disabled:hover{background:inherit!important}.context .separator{margin:4px 0;height:0;padding:0;border-top:1px solid #b3b3b3}.hotkey{color:#878b90;float:right}.resizer{width:15px;height:15px;position:absolute;right:0;bottom:0;cursor:se-resize}.img-bordered{border:4px solid #fff;outline:1px solid #ddd;box-shadow:2px 3px 5px #939393;-webkit-box-shadow:2px 3px 5px #939393;-moz-box-shadow:2px 3px 5px #939393;-ms-box-shadow:2px 3px 5px #939393}";
    styleInject(css_248z);

    /* clsSMDragNDrop/DragNDropPreview.svelte generated by Svelte v3.34.0 */

    const { Object: Object_1$9, console: console_1$2, document: document_1$1 } = globals;
    const file$g = "clsSMDragNDrop/DragNDropPreview.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-1n3xdnr-style";
    	style.textContent = "#dndsteps.svelte-1n3xdnr{text-align:center;border:1px solid #999999;background-color:#DDDDDD;width:100%}#sm_controller{margin-top:20px;display:none}.correct_incorrect_icon{z-index:9 !important}input.dnd_textbox{text-align:center;border-radius:4px;background-color:#fff;border:1px solid #ccc;border-radius:4px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhZ05Ecm9wUHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBZ2RDLFNBQVMsZUFBQyxDQUFBLEFBQ1QsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUN6QixnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLEtBQUssQ0FBRSxJQUFJLEFBQ1osQ0FBQSxBQUNRLGNBQWMsQUFBRSxDQUFBLEFBQ2pCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLE9BQU8sQ0FBRSxJQUFJLEFBQ2pCLENBQUEsQUFDSyx1QkFBdUIsQUFBRSxDQUFBLEFBQ2hDLE9BQU8sQ0FBRSxDQUFDLENBQUMsVUFBVSxBQUN0QixDQUFBLEFBQ1EsaUJBQWlCLEFBQUUsQ0FBQSxBQUMxQixVQUFVLENBQUUsTUFBTSxDQUNsQixhQUFhLENBQUUsR0FBRyxDQUNsQixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDdEIsYUFBYSxDQUFFLEdBQUcsQUFDbkIsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJEcmFnTkRyb3BQcmV2aWV3LnN2ZWx0ZSJdfQ== */";
    	append_dev(document_1$1.head, style);
    }

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	child_ctx[36] = i;
    	return child_ctx;
    }

    // (395:2) {#if step && step.length}
    function create_if_block_3$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*step*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
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
    			if (dirty[0] & /*step*/ 32) {
    				each_value = /*step*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(395:2) {#if step && step.length}",
    		ctx
    	});

    	return block;
    }

    // (396:3) {#each step as data, index}
    function create_each_block$f(ctx) {
    	let span;
    	let input;
    	let input_id_value;
    	let t0;
    	let t1_value = "dnd" + /*data*/ ctx[34]._id + "";
    	let t1;
    	let t2;
    	let span_key_value;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[21](/*data*/ ctx[34]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "id", input_id_value = "step_dnd" + /*data*/ ctx[34]._id);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "defaultvalue", "1");
    			attr_dev(input, "name", "rbs");
    			attr_dev(input, "class", "baseradio dndradio svelte-1n3xdnr");
    			add_location(input, file$g, 397, 5, 11302);
    			attr_dev(span, "key", span_key_value = /*index*/ ctx[36]);
    			add_location(span, file$g, 396, 4, 11278);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, input);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*step*/ 32 && input_id_value !== (input_id_value = "step_dnd" + /*data*/ ctx[34]._id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*step*/ 32 && t1_value !== (t1_value = "dnd" + /*data*/ ctx[34]._id + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(396:3) {#each step as data, index}",
    		ctx
    	});

    	return block;
    }

    // (436:3) {:else}
    function create_else_block$3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "id", "pre_sample_image");
    			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/bg_000PLn.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = l.sample_img);
    			add_location(img, file$g, 436, 16, 12602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "load", /*changeLoadState*/ ctx[15], false, false, false);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(436:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (434:3) {#if bgImg}
    function create_if_block_2$2(ctx) {
    	let img;
    	let img_height_value;
    	let img_width_value;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "height", img_height_value = /*imgHeight*/ ctx[3] + "px");
    			attr_dev(img, "width", img_width_value = /*imgWidth*/ ctx[4] + "px");

    			if (img.src !== (img_src_value = window.inNative
    			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*bgImg*/ ctx[2].replace(/\//g, "__")
    			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[2])) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "class", /*borderclass*/ ctx[8]);
    			attr_dev(img, "alt", img_alt_value = /*alt*/ ctx[6] ? /*alt*/ ctx[6] : l.sample_img);
    			add_location(img, file$g, 434, 4, 12162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "error", /*error_handler*/ ctx[22], false, false, false),
    					listen_dev(img, "load", /*load_handler*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*imgHeight*/ 8 && img_height_value !== (img_height_value = /*imgHeight*/ ctx[3] + "px")) {
    				attr_dev(img, "height", img_height_value);
    			}

    			if (dirty[0] & /*imgWidth*/ 16 && img_width_value !== (img_width_value = /*imgWidth*/ ctx[4] + "px")) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (dirty[0] & /*bgImg*/ 4 && img.src !== (img_src_value = window.inNative
    			? "____s3.amazonaws.com__jigyaasa_content_static__" + /*bgImg*/ ctx[2].replace(/\//g, "__")
    			: "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*borderclass*/ 256) {
    				attr_dev(img, "class", /*borderclass*/ ctx[8]);
    			}

    			if (dirty[0] & /*alt*/ 64 && img_alt_value !== (img_alt_value = /*alt*/ ctx[6] ? /*alt*/ ctx[6] : l.sample_img)) {
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(434:3) {#if bgImg}",
    		ctx
    	});

    	return block;
    }

    // (439:3) {#if state.data && image_loaded}
    function create_if_block$g(ctx) {
    	let dragpreview0;
    	let t0;
    	let dragpreview1;
    	let t1;
    	let droppreview0;
    	let t2;
    	let droppreview1;
    	let t3;
    	let selectpreview;
    	let t4;
    	let textboxpreview;
    	let t5;
    	let radiopreview;
    	let t6;
    	let multilineboxpreview;
    	let t7;
    	let checkboxpreview;
    	let t8;
    	let tabheadpreview;
    	let t9;
    	let labelpreview;
    	let t10;
    	let hotspotpreview;
    	let t11;
    	let menulistpreview;
    	let t12;
    	let buttonpreview;
    	let t13;
    	let steppreview;
    	let t14;
    	let tabpreview;
    	let t15;
    	let if_block_anchor;
    	let current;

    	dragpreview0 = new DragPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].drag,
    				containerID: /*container_id*/ ctx[11]
    			},
    			$$inline: true
    		});

    	dragpreview1 = new DragPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[1],
    				containerID: /*container_id*/ ctx[11]
    			},
    			$$inline: true
    		});

    	droppreview0 = new DropPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].drop,
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	droppreview1 = new DropPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[2],
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	selectpreview = new SelectPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].select,
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	textboxpreview = new TextboxPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].textbox,
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	radiopreview = new RadioPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].radio,
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	multilineboxpreview = new MultilineboxPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].multilinebox,
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	checkboxpreview = new CheckboxPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].checkbox,
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tabheadpreview = new TabheadPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].tabhead,
    				containerID: /*container_id*/ ctx[11]
    			},
    			$$inline: true
    		});

    	labelpreview = new LabelPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].label,
    				containerID: /*container_id*/ ctx[11]
    			},
    			$$inline: true
    		});

    	hotspotpreview = new HotspotPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].hotspot,
    				module_type: /*moduleType*/ ctx[9],
    				containerID: /*container_id*/ ctx[11],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	menulistpreview = new MenulistPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].menulist,
    				containerID: /*container_id*/ ctx[11]
    			},
    			$$inline: true
    		});

    	buttonpreview = new ButtonPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].button,
    				containerID: /*container_id*/ ctx[11]
    			},
    			$$inline: true
    		});

    	steppreview = new StepPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].step,
    				containerID: /*container_id*/ ctx[11],
    				checkImages: /*checkImages*/ ctx[12],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tabpreview = new TabPreview({
    			props: {
    				modules: /*state*/ ctx[10].data[0].tab,
    				containerID: /*container_id*/ ctx[11],
    				checkImages: /*checkImages*/ ctx[12],
    				uxml: /*uxml*/ ctx[0]
    			},
    			$$inline: true
    		});

    	let if_block = /*state*/ ctx[10].data[0].hotspot && create_if_block_1$9(ctx);

    	const block = {
    		c: function create() {
    			create_component(dragpreview0.$$.fragment);
    			t0 = space();
    			create_component(dragpreview1.$$.fragment);
    			t1 = space();
    			create_component(droppreview0.$$.fragment);
    			t2 = space();
    			create_component(droppreview1.$$.fragment);
    			t3 = space();
    			create_component(selectpreview.$$.fragment);
    			t4 = space();
    			create_component(textboxpreview.$$.fragment);
    			t5 = space();
    			create_component(radiopreview.$$.fragment);
    			t6 = space();
    			create_component(multilineboxpreview.$$.fragment);
    			t7 = space();
    			create_component(checkboxpreview.$$.fragment);
    			t8 = space();
    			create_component(tabheadpreview.$$.fragment);
    			t9 = space();
    			create_component(labelpreview.$$.fragment);
    			t10 = space();
    			create_component(hotspotpreview.$$.fragment);
    			t11 = space();
    			create_component(menulistpreview.$$.fragment);
    			t12 = space();
    			create_component(buttonpreview.$$.fragment);
    			t13 = space();
    			create_component(steppreview.$$.fragment);
    			t14 = space();
    			create_component(tabpreview.$$.fragment);
    			t15 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(dragpreview0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dragpreview1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(droppreview0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(droppreview1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(selectpreview, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(textboxpreview, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(radiopreview, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(multilineboxpreview, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(checkboxpreview, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(tabheadpreview, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(labelpreview, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(hotspotpreview, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(menulistpreview, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(buttonpreview, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(steppreview, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(tabpreview, target, anchor);
    			insert_dev(target, t15, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dragpreview0_changes = {};
    			if (dirty[0] & /*state*/ 1024) dragpreview0_changes.modules = /*state*/ ctx[10].data[0].drag;
    			dragpreview0.$set(dragpreview0_changes);
    			const dragpreview1_changes = {};
    			if (dirty[0] & /*state*/ 1024) dragpreview1_changes.modules = /*state*/ ctx[10].data[1];
    			dragpreview1.$set(dragpreview1_changes);
    			const droppreview0_changes = {};
    			if (dirty[0] & /*state*/ 1024) droppreview0_changes.modules = /*state*/ ctx[10].data[0].drop;
    			if (dirty[0] & /*uxml*/ 1) droppreview0_changes.uxml = /*uxml*/ ctx[0];
    			droppreview0.$set(droppreview0_changes);
    			const droppreview1_changes = {};
    			if (dirty[0] & /*state*/ 1024) droppreview1_changes.modules = /*state*/ ctx[10].data[2];
    			if (dirty[0] & /*uxml*/ 1) droppreview1_changes.uxml = /*uxml*/ ctx[0];
    			droppreview1.$set(droppreview1_changes);
    			const selectpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) selectpreview_changes.modules = /*state*/ ctx[10].data[0].select;
    			if (dirty[0] & /*uxml*/ 1) selectpreview_changes.uxml = /*uxml*/ ctx[0];
    			selectpreview.$set(selectpreview_changes);
    			const textboxpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) textboxpreview_changes.modules = /*state*/ ctx[10].data[0].textbox;
    			if (dirty[0] & /*uxml*/ 1) textboxpreview_changes.uxml = /*uxml*/ ctx[0];
    			textboxpreview.$set(textboxpreview_changes);
    			const radiopreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) radiopreview_changes.modules = /*state*/ ctx[10].data[0].radio;
    			if (dirty[0] & /*uxml*/ 1) radiopreview_changes.uxml = /*uxml*/ ctx[0];
    			radiopreview.$set(radiopreview_changes);
    			const multilineboxpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) multilineboxpreview_changes.modules = /*state*/ ctx[10].data[0].multilinebox;
    			if (dirty[0] & /*uxml*/ 1) multilineboxpreview_changes.uxml = /*uxml*/ ctx[0];
    			multilineboxpreview.$set(multilineboxpreview_changes);
    			const checkboxpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) checkboxpreview_changes.modules = /*state*/ ctx[10].data[0].checkbox;
    			if (dirty[0] & /*uxml*/ 1) checkboxpreview_changes.uxml = /*uxml*/ ctx[0];
    			checkboxpreview.$set(checkboxpreview_changes);
    			const tabheadpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) tabheadpreview_changes.modules = /*state*/ ctx[10].data[0].tabhead;
    			tabheadpreview.$set(tabheadpreview_changes);
    			const labelpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) labelpreview_changes.modules = /*state*/ ctx[10].data[0].label;
    			labelpreview.$set(labelpreview_changes);
    			const hotspotpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) hotspotpreview_changes.modules = /*state*/ ctx[10].data[0].hotspot;
    			if (dirty[0] & /*moduleType*/ 512) hotspotpreview_changes.module_type = /*moduleType*/ ctx[9];
    			if (dirty[0] & /*uxml*/ 1) hotspotpreview_changes.uxml = /*uxml*/ ctx[0];
    			hotspotpreview.$set(hotspotpreview_changes);
    			const menulistpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) menulistpreview_changes.modules = /*state*/ ctx[10].data[0].menulist;
    			menulistpreview.$set(menulistpreview_changes);
    			const buttonpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) buttonpreview_changes.modules = /*state*/ ctx[10].data[0].button;
    			buttonpreview.$set(buttonpreview_changes);
    			const steppreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) steppreview_changes.modules = /*state*/ ctx[10].data[0].step;
    			if (dirty[0] & /*uxml*/ 1) steppreview_changes.uxml = /*uxml*/ ctx[0];
    			steppreview.$set(steppreview_changes);
    			const tabpreview_changes = {};
    			if (dirty[0] & /*state*/ 1024) tabpreview_changes.modules = /*state*/ ctx[10].data[0].tab;
    			if (dirty[0] & /*uxml*/ 1) tabpreview_changes.uxml = /*uxml*/ ctx[0];
    			tabpreview.$set(tabpreview_changes);

    			if (/*state*/ ctx[10].data[0].hotspot) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dragpreview0.$$.fragment, local);
    			transition_in(dragpreview1.$$.fragment, local);
    			transition_in(droppreview0.$$.fragment, local);
    			transition_in(droppreview1.$$.fragment, local);
    			transition_in(selectpreview.$$.fragment, local);
    			transition_in(textboxpreview.$$.fragment, local);
    			transition_in(radiopreview.$$.fragment, local);
    			transition_in(multilineboxpreview.$$.fragment, local);
    			transition_in(checkboxpreview.$$.fragment, local);
    			transition_in(tabheadpreview.$$.fragment, local);
    			transition_in(labelpreview.$$.fragment, local);
    			transition_in(hotspotpreview.$$.fragment, local);
    			transition_in(menulistpreview.$$.fragment, local);
    			transition_in(buttonpreview.$$.fragment, local);
    			transition_in(steppreview.$$.fragment, local);
    			transition_in(tabpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dragpreview0.$$.fragment, local);
    			transition_out(dragpreview1.$$.fragment, local);
    			transition_out(droppreview0.$$.fragment, local);
    			transition_out(droppreview1.$$.fragment, local);
    			transition_out(selectpreview.$$.fragment, local);
    			transition_out(textboxpreview.$$.fragment, local);
    			transition_out(radiopreview.$$.fragment, local);
    			transition_out(multilineboxpreview.$$.fragment, local);
    			transition_out(checkboxpreview.$$.fragment, local);
    			transition_out(tabheadpreview.$$.fragment, local);
    			transition_out(labelpreview.$$.fragment, local);
    			transition_out(hotspotpreview.$$.fragment, local);
    			transition_out(menulistpreview.$$.fragment, local);
    			transition_out(buttonpreview.$$.fragment, local);
    			transition_out(steppreview.$$.fragment, local);
    			transition_out(tabpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dragpreview0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dragpreview1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(droppreview0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(droppreview1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(selectpreview, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(textboxpreview, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(radiopreview, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(multilineboxpreview, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(checkboxpreview, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(tabheadpreview, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(labelpreview, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(hotspotpreview, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(menulistpreview, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(buttonpreview, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(steppreview, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(tabpreview, detaching);
    			if (detaching) detach_dev(t15);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(439:3) {#if state.data && image_loaded}",
    		ctx
    	});

    	return block;
    }

    // (457:4) {#if state.data[0].hotspot}
    function create_if_block_1$9(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "targetImg");
    			attr_dev(img, "tabindex", "0");
    			attr_dev(img, "alt", "target_img");
    			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_assets/items/target.png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "display", "none");
    			add_location(img, file$g, 457, 5, 14276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(457:4) {#if state.data[0].hotspot}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div3;
    	let itemhelper;
    	let t0;
    	let div0;
    	let input;
    	let t1;
    	let t2_value = l.base_steps + "";
    	let t2;
    	let t3;
    	let t4;
    	let center;
    	let div1;
    	let button0;
    	let t6;
    	let button1;
    	let t8;
    	let div2;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	itemhelper = new ItemHelper({ $$inline: true });
    	itemhelper.$on("setReview", /*setReview*/ ctx[13]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[14]);
    	let if_block0 = /*step*/ ctx[5] && /*step*/ ctx[5].length && create_if_block_3$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*bgImg*/ ctx[2]) return create_if_block_2$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = /*state*/ ctx[10].data && /*image_loaded*/ ctx[1] && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			input = element("input");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			center = element("center");
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = `${l.correct_answer}`;
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = `${l.your_answer}`;
    			t8 = space();
    			div2 = element("div");
    			if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(input, "id", "base");
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "defaultvalue", "1");
    			attr_dev(input, "defaultchecked", "");
    			attr_dev(input, "name", "rbs");
    			attr_dev(input, "class", "baseradio dndradio");
    			add_location(input, file$g, 392, 2, 11057);
    			attr_dev(div0, "id", "dndsteps");
    			attr_dev(div0, "class", "h svelte-1n3xdnr");
    			add_location(div0, file$g, 391, 1, 11024);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-light correct-ans svelte_items_testing");
    			attr_dev(button0, "id", "reviewCorrectAns");
    			add_location(button0, file$g, 412, 3, 11653);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn active your-ans btn-light svelte_items_testing");
    			attr_dev(button1, "id", "reviewUserAns");
    			set_style(button1, "margin-left", "-4px");
    			add_location(button1, file$g, 417, 3, 11803);
    			attr_dev(div1, "class", "btn-group mb-xl clearfix review h mb-3");
    			attr_dev(div1, "id", "sm_controller");
    			add_location(div1, file$g, 411, 2, 11578);
    			attr_dev(div2, "id", /*container_id*/ ctx[11]);
    			attr_dev(div2, "zoom", "");
    			attr_dev(div2, "totalcorrectans", /*totalcorrectans*/ ctx[7]);
    			attr_dev(div2, "class", "container_div svelte-1n3xdnr");
    			attr_dev(div2, "data-item", "svelte_items_testing");
    			add_location(div2, file$g, 426, 2, 12002);
    			add_location(center, file$g, 410, 1, 11567);
    			add_location(div3, file$g, 386, 0, 10937);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(itemhelper, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div0, input);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div3, t4);
    			append_dev(div3, center);
    			append_dev(center, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t6);
    			append_dev(div1, button1);
    			append_dev(center, t8);
    			append_dev(center, div2);
    			if_block1.m(div2, null);
    			append_dev(div2, t9);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*step*/ ctx[5] && /*step*/ ctx[5].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
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
    					if_block1.m(div2, t9);
    				}
    			}

    			if (/*state*/ ctx[10].data && /*image_loaded*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*state, image_loaded*/ 1026) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$g(ctx);
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

    			if (!current || dirty[0] & /*totalcorrectans*/ 128) {
    				attr_dev(div2, "totalcorrectans", /*totalcorrectans*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(itemhelper);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			dispose();
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

    function setTotalCorrectAns(qXml) {
    	var item = qXml ? qXml.smxml : null;
    	var count = 0;

    	// if there is xml
    	if (item) {
    		// iterating throgh the xml and store the elements in item 
    		for (let i in item) {
    			if (Array.isArray(item[i]) == false) {
    				let arr = [];
    				arr.push(item[i]);
    				item[i] = arr;
    			}
    		}

    		/** Counting the total length of the element **/
    		if (item["drop"]) {
    			count = count + item["drop"].length;
    		}

    		if (item["select"]) {
    			count = count + item["select"].length;
    		}

    		if (item["textbox"]) {
    			count = count + item["textbox"].length;
    		}

    		if (item["checkbox"]) {
    			count = count + item["checkbox"].length;
    		}

    		if (item["radio"]) {
    			item["radio"].map(function (data) {
    				if (parseInt(data._correctans) == 1) {
    					count = count + 1;
    				}
    			});
    		}

    		if (item["hotspot"]) {
    			item["hotspot"].map(function (data) {
    				let innerText = JSON.parse(data.__text ? data.__text : data.__cdata);
    				count = count + Object.keys(innerText).length;
    			});
    		}

    		if (item["jscript"]) {
    			try {
    				eval.call(window, item["jscript"][0]);
    			} catch(e) {
    				console.warn(e);
    			}
    		}

    		return count;
    	}
    }

    // convert object to lower case
    function objToLower(obj) {
    	let newX = {};

    	for (let index in obj) {
    		newX[index.toLowerCase()] = obj[index];
    	}

    	return newX;
    }

    // return the data of the nested module according to the xml
    function loadNestedModule(qXml) {
    	var smxml = qXml ? qXml.smxml : null;
    	var customDrag = [], customDrop = [];

    	if (smxml) {
    		if (smxml.div) {
    			smxml.div.map(function (data, i) {
    				data = objToLower(data);

    				if (data._anskey == "" || data._anskey == undefined) {
    					/*added this condition because key was diffrent with id*/
    					if (data._key.indexOf("key") <= -1) {
    						data._id = "ID" + data._key;
    						data._key = "key" + data._key;
    					}

    					/********/
    					customDrag.push(data);
    				} else {
    					let id = data._id.split("ID");

    					/*added this condition because key was diffrent with id*/
    					if (data._key.indexOf("key") <= -1) {
    						data._id = "ID" + data._key;
    						data._key = "key" + data._key;
    						data._anskey = "ID" + data._anskey;
    					} else {
    						let key = data._key.split("key"); /********/

    						if (id[1] == key[1]) {
    							let k = data._anskey.split("key");
    							let k2 = k[1];
    							if (k2) data._anskey = "ID" + k2;
    						} else if (parseInt(id[1]) != parseInt(key[1])) {
    							if (data._anskey.indexOf("ID") <= -1) {
    								data._anskey = "ID" + key[1];
    							}
    						}
    					}

    					customDrop.push(data);
    				}
    			});
    		}

    		return [smxml, customDrag, customDrop];
    	}
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DragNDropPreview", slots, []);
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let { editorState } = $$props;

    	// initializing the variable
    	let QXML = "";

    	let image_loaded = 0;
    	let bgImg = "";
    	let imgHeight = "";
    	let imgWidth = "";
    	let step = [];
    	let alt = "";
    	let totalcorrectans = 0;
    	let borderclass = "";
    	let borderclassname = "img-bordered";
    	let container_id = "dndmainPreview";
    	let moduleType = 1;
    	let state = {};

    	// writable for preview
    	let preview_store = writable({
    		xml: "",
    		check: "checked",
    		totalcorrectans: "",
    		review: false,
    		data: []
    	});

    	// subscribing to the store
    	const unsubscribe = preview_store.subscribe(value => {
    		$$invalidate(10, state = value);
    	});

    	// this is called for the first time use for binding the events
    	onMount(async function () {
    		if (window.inNative) {
    			if (typeof window.getHeight == "function") {
    				window.getHeight && window.getHeight();
    			}
    		}

    		if (xml) {
    			AH$1.setCss(document.getElementById("dndsteps"), { display: "none" });
    		}

    		AH$1.listen(document, "click", ".record", function (current_element) {
    			if (!current_element.classList.contains("lab_disable")) current_element.setAttribute("clicked", 1);
    		});

    		AH$1.listen("body", "click", "#reviewUserAns", function () {
    			// for your ans
    			AH$1.selectAll("#sm_controller button", "removeClass", "active");

    			AH$1.addClass("#sm_controller .your-ans", "active");
    			yourAnswer();
    		});

    		AH$1.listen("body", "click", "#reviewCorrectAns", function () {
    			// for correct ans
    			AH$1.selectAll("#sm_controller button", "removeClass", "active");

    			AH$1.addClass("#sm_controller .correct-ans", "active");
    			correctAnswer();
    		});

    		AH$1.listen(document, "click", "#" + container_id, function () {
    			displayAns();
    		});

    		AH$1.listen(document, "keyup", "#" + container_id, function () {
    			displayAns();
    		});

    		AH$1.listen(document, "change", "#" + container_id, function () {
    			displayAns();
    		});

    		AH$1.listen(document, "mouseup", "#" + container_id, function () {
    			displayAns();
    		});

    		// prevent to open context menu
    		AH$1.bind("body", "contextmenu", function (event) {
    			event.preventDefault();
    		});
    	});

    	// call everytime when updating will happen
    	afterUpdate(async () => {
    		// if there is change in xml
    		if (state.xml != xml) {
    			loadModule(xml);
    		}

    		// run only in case of editor no need to run it in case of preview
    		// if (state.review != isReview && editorState ) { // Its creating issue in student area
    		if (state.review != isReview) {
    			preview_store.update(item => {
    				item.review = isReview;
    				return item;
    			});

    			if (isReview) {
    				displayAns();
    				DND.modeOn(1);
    				DND.showansdrag("#" + container_id, "u", 1);
    				AH$1.selectAll("#sm_controller button", "removeClass", "active");
    				AH$1.addClass("#sm_controller .your-ans", "active");
    			} else {
    				DND.modeOn(0);
    			}
    		}
    	});

    	// for checking the answer and creating the user ans
    	function displayAns() {
    		//@Prabhat: Answer checking and attibute value updating happening at the same time so here we need to add the setTimeout for time laps in answer checking. 
    		setTimeout(
    			function () {
    				let result = DND.checkAns("#" + container_id);
    				if (typeof is_sm != "undefined") AH$1.showmsg(result.ans ? "Correct" : "Incorrect", 3000);

    				if (editorState) {
    					showAns(result.ans ? "Correct" : "Incorrect");
    				}

    				onUserAnsChange(result);
    			},
    			100
    		);
    	}

    	// call whenever there is change in xml and changes the module accordingly
    	function loadModule(loadXml) {
    		let newXml = XMLToJSON(loadXml);
    		parseXMLPreview(newXml);
    		$$invalidate(7, totalcorrectans = setTotalCorrectAns(newXml));

    		preview_store.update(item => {
    			item.xml = loadXml;
    			item.totalcorrectans = totalcorrectans;
    			item.data = loadNestedModule(newXml);
    			return item;
    		});

    		checkImages();
    		refreshModule();
    	}

    	// whenever the module will refresh means there is change in xml it will called 
    	function refreshModule() {
    		let dnd_timeout = setTimeout(
    			function () {
    				DND.readyThis("#" + container_id);
    				DND.showansdrag("#" + container_id, "u");

    				if (isReview) {
    					// if review mode is on
    					displayAns(); // display the answe

    					DND.modeOn(1); // for showing correct answer and your answer tab
    					DND.showansdrag("#" + container_id, "u", 1);
    					AH$1.selectAll("#sm_controller button", "removeClass", "active");
    					AH$1.addClass("#sm_controller .your-ans", "active");
    				} else {
    					try {
    						DND.modeOn(0);

    						if (typeof showAns == "undefined") {
    							displayAns();
    						}
    					} catch(err) {
    						console.warn({ err });
    					}
    				}

    				clearTimeout(dnd_timeout);
    			},
    			500
    		);
    	}

    	// parse the xml for preview
    	function parseXMLPreview(MYXML) {
    		try {
    			// getting he required data
    			QXML = MYXML;

    			$$invalidate(2, bgImg = MYXML.smxml._bgimg);
    			$$invalidate(9, moduleType = MYXML.smxml._type || 1);
    			$$invalidate(6, alt = MYXML.smxml._alt ? MYXML.smxml._alt : "");
    			$$invalidate(3, imgHeight = MYXML.smxml._height);
    			$$invalidate(4, imgWidth = MYXML.smxml._width);
    			$$invalidate(8, borderclass = MYXML.smxml._borderrequired == 1 ? borderclassname : "");
    			$$invalidate(5, step = MYXML.smxml.step);

    			if (Array.isArray(step) == false && step) {
    				$$invalidate(5, step = []);
    				$$invalidate(5, step[0] = QXML.smxml.step, step);
    			}
    		} catch(error) {
    			console.warn({
    				error,
    				fun: "parseXMLPreview",
    				file: "DragNDropPreview.svelte"
    			});
    		}
    	}

    	// setting the container height and width on the basis of image height and width
    	function checkImages(is_image_load) {
    		let container = document.querySelectorAll("#" + container_id + " img");

    		if (container.length > 0) {
    			container.forEach(function (value) {
    				if (value.complete) {
    					let originalHeight = value.clientHeight > value.naturalHeight
    					? value.clientHeight
    					: value.naturalHeight;

    					let originalWidth = value.clientWidth > value.naturalWidth
    					? value.clientWidth
    					: value.naturalWidth;

    					if (Number(originalWidth) != 0 || Number(originalHeight) != 0 || typeof from_myproject != "undefined" && from_myproject == 1) {
    						AH$1.setCss("#" + container_id, {
    							height: parseInt(imgHeight && imgHeight >= originalHeight
    							? imgHeight
    							: originalHeight) + 8 + "px", // 8px increas for border.
    							width: (imgWidth && imgWidth >= originalWidth
    							? imgWidth
    							: originalWidth) + "px"
    						});
    					}
    				}
    			});
    		}

    		if (is_image_load == 1 || is_image_load == 2) {
    			$$invalidate(1, image_loaded = 1);

    			if (window.inNative) {
    				window.postMessage(`height___${AH$1.select("#" + container_id + ">img").naturalHeight}`);
    			}

    			refreshModule();
    		}
    	}

    	// for the correct answer
    	function correctAnswer() {
    		DND.showansdrag("#" + container_id, "c", 1);
    	}

    	// for showing the user ans
    	function yourAnswer() {
    		DND.showansdrag("#" + container_id, "u", 1);
    	}

    	// call on the setreview function
    	function setReview() {
    		displayAns();
    		$$invalidate(16, isReview = true);
    		DND.modeOn(1);
    	}

    	// unset review function
    	function unsetReview() {
    		$$invalidate(16, isReview = false);
    		DND.modeOn(0);
    	}

    	// for changing the load stte
    	function changeLoadState() {
    		AH$1.select("#pre_sample_image").remove();
    		$$invalidate(1, image_loaded = 1);
    	}

    	const writable_props = ["xml", "uxml", "isReview", "showAns", "editorState"];

    	Object_1$9.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<DragNDropPreview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => DND.setStep("base");
    	const click_handler_1 = data => DND.setStep("dnd" + data._id);

    	const error_handler = e => {
    		e.target.onerror = null;
    		e.target.src = "https://s3.amazonaws.com/jigyaasa_content_static/" + bgImg;
    	};

    	const load_handler = () => {
    		checkImages(1);
    	};

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(17, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(0, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(16, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(18, showAns = $$props.showAns);
    		if ("editorState" in $$props) $$invalidate(19, editorState = $$props.editorState);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		ItemHelper,
    		AH: AH$1,
    		onUserAnsChange,
    		XMLToJSON,
    		writable,
    		DND,
    		TextboxPreview,
    		DragPreview,
    		DropPreview,
    		SelectPreview,
    		RadioPreview,
    		MultilineboxPreview,
    		CheckboxPreview,
    		TabheadPreview,
    		LabelPreview,
    		HotspotPreview,
    		MenulistPreview,
    		ButtonPreview,
    		StepPreview,
    		TabPreview,
    		l,
    		xml,
    		uxml,
    		isReview,
    		showAns,
    		editorState,
    		QXML,
    		image_loaded,
    		bgImg,
    		imgHeight,
    		imgWidth,
    		step,
    		alt,
    		totalcorrectans,
    		borderclass,
    		borderclassname,
    		container_id,
    		moduleType,
    		state,
    		preview_store,
    		unsubscribe,
    		displayAns,
    		loadModule,
    		refreshModule,
    		parseXMLPreview,
    		checkImages,
    		setTotalCorrectAns,
    		objToLower,
    		loadNestedModule,
    		correctAnswer,
    		yourAnswer,
    		setReview,
    		unsetReview,
    		changeLoadState
    	});

    	$$self.$inject_state = $$props => {
    		if ("xml" in $$props) $$invalidate(17, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(0, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(16, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(18, showAns = $$props.showAns);
    		if ("editorState" in $$props) $$invalidate(19, editorState = $$props.editorState);
    		if ("QXML" in $$props) QXML = $$props.QXML;
    		if ("image_loaded" in $$props) $$invalidate(1, image_loaded = $$props.image_loaded);
    		if ("bgImg" in $$props) $$invalidate(2, bgImg = $$props.bgImg);
    		if ("imgHeight" in $$props) $$invalidate(3, imgHeight = $$props.imgHeight);
    		if ("imgWidth" in $$props) $$invalidate(4, imgWidth = $$props.imgWidth);
    		if ("step" in $$props) $$invalidate(5, step = $$props.step);
    		if ("alt" in $$props) $$invalidate(6, alt = $$props.alt);
    		if ("totalcorrectans" in $$props) $$invalidate(7, totalcorrectans = $$props.totalcorrectans);
    		if ("borderclass" in $$props) $$invalidate(8, borderclass = $$props.borderclass);
    		if ("borderclassname" in $$props) borderclassname = $$props.borderclassname;
    		if ("container_id" in $$props) $$invalidate(11, container_id = $$props.container_id);
    		if ("moduleType" in $$props) $$invalidate(9, moduleType = $$props.moduleType);
    		if ("state" in $$props) $$invalidate(10, state = $$props.state);
    		if ("preview_store" in $$props) preview_store = $$props.preview_store;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		uxml,
    		image_loaded,
    		bgImg,
    		imgHeight,
    		imgWidth,
    		step,
    		alt,
    		totalcorrectans,
    		borderclass,
    		moduleType,
    		state,
    		container_id,
    		checkImages,
    		setReview,
    		unsetReview,
    		changeLoadState,
    		isReview,
    		xml,
    		showAns,
    		editorState,
    		click_handler,
    		click_handler_1,
    		error_handler,
    		load_handler
    	];
    }

    class DragNDropPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1$1.getElementById("svelte-1n3xdnr-style")) add_css$1();

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				xml: 17,
    				uxml: 0,
    				isReview: 16,
    				showAns: 18,
    				editorState: 19
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DragNDropPreview",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[17] === undefined && !("xml" in props)) {
    			console_1$2.warn("<DragNDropPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[0] === undefined && !("uxml" in props)) {
    			console_1$2.warn("<DragNDropPreview> was created without expected prop 'uxml'");
    		}

    		if (/*isReview*/ ctx[16] === undefined && !("isReview" in props)) {
    			console_1$2.warn("<DragNDropPreview> was created without expected prop 'isReview'");
    		}

    		if (/*showAns*/ ctx[18] === undefined && !("showAns" in props)) {
    			console_1$2.warn("<DragNDropPreview> was created without expected prop 'showAns'");
    		}

    		if (/*editorState*/ ctx[19] === undefined && !("editorState" in props)) {
    			console_1$2.warn("<DragNDropPreview> was created without expected prop 'editorState'");
    		}
    	}

    	get xml() {
    		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<DragNDropPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<DragNDropPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     *  File Name   : main.js
     *  Author      : Ayush Srivastava
     *  Function    : DND
     *  Version     : 1.0
     *  Packege     : Drag and Drop (prev)
     *  Last update : 19 Jan 2021
     */

    const defXMl = `<smxml type="1" name="DragNDrop" bgimg="lab-26_0007C9_000CsS.png" height="495" width="607"><drag id="ID0" top="442" left="307" width="120" height="25" value="Port operational"></drag><drag id="ID1" top="442" left="454" width="120" height="25" value="Layer 2 problem"></drag><drag id="ID2" top="442" left="10" width="120" height="25" value="Layer 1 problem"></drag><drag id="ID3" top="442" left="160" width="120" height="25" value="Port disabled"></drag><drop id="ID4" top="76" left="414" width="120" height="25" anskey="ID0" value="Drop Here"></drop><drop id="ID5" top="173" left="414" width="120" height="25" anskey="ID1" value="Drop Here"></drop><drop id="ID6" top="272" left="414" width="120" height="25" anskey="ID2" value="Drop Here"></drop><drop id="ID7" top="366" left="414" width="120" height="25" anskey="ID3" value="Drop Here"></drop></smxml>`;

    // creating app
    const app = new DragNDropPreview({
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
//# sourceMappingURL=bundle_q1.js.map
