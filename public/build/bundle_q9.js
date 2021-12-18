
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
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
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
        enableBsAll(selector, comp, options = {}) {
            options = {
                ...options,
                trigger: 'hover'
            };
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

        jsonFormEncode(formData, prop, jsonArray) {try {
            if (Array.isArray(jsonArray)) {
                for(let i = 0; i< jsonArray.length; i++){
                    this.jsonFormEncode(formData, `${prop}[${i}]`, jsonArray[i]);
                }
            } else if (typeof jsonArray == "object") {
                for(let key in jsonArray){
                    this.jsonFormEncode(formData, `${prop}[${key}]`, jsonArray[key]);
                }
            } else {
                formData.append(prop, jsonArray);
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

    const JS$1 = new JUI();

    let previous_droped_item = {};
    class fillJS {
    	constructor(options) {
    		//super();
    		this.userAnsXML = "";
    		this.sInfo = true;
    		this.labBinded = true;
    		this.delPreSpaces = {};
    		this.init();
    		this.iscorrect = '-2';
    		
    	}
    	init() {
    		this.delPreSpaces = {
    			loopGaurd : 0,
    			withLines : ( fillid )=> {
    				if (this.delPreSpaces.loopGaurd > 0) { 
    					if (typeof activate == "function") activate(1);
    					JS$1.selectAll(fillid, 'hide');
    				}
    				var ln = JS$1.selectAll('.linenums li').length, li_arr = [];
    	
    				if (ln == 0 && this.delPreSpaces.loopGaurd <= 4) {
    					this.delPreSpaces.loopGaurd ++;
    					setTimeout(()=> {this.delPreSpaces.withLines(fillid);}, 1000);
    					return false;
    				} else {
    					this.showFillModule( fillid );
    				}
    	
    				JS$1.selectAll('.linenums li').forEach((_this, i)=> {
    					if (JS$1.find(_this, 'span').innerHTML == "&nbsp;" || JS$1.find(_this, 'span').innerHTML == "") {
    						_this.remove();
    					} else {
    						li_arr.push(_this);
    					}
    				});
    	
    				li_arr.forEach((val, i)=> {
    					if (val.children.classList.contains('fillelement') || val.children.classList.contains('dropable')) {
    						let ht;
    						val.children.forEach((_this)=> {
    							(_this.innerHTML == "") ? _this.remove() : ht = _this;
    						});
    						JS$1.prevElm(val).append(ht);
    						JS$1.insert(JS$1.prevElm(val), JS$1.nextElm(val).innerHTML, 'beforeend');
    						JS$1.nextElm(val).remove();
    						val.remove();
    					}
    				});	
    			},
    			withoutLines : (fillid)=> {
    				//var _this = this;
    				var fill_pre = JS$1.find(fillid, '.fillelement,.dropable', 'all');
    				fill_pre.forEach((_this)=> {
    					var pre_prv  = JS$1.prevElm(_this).innerHTML.trim();
    					var pre_nxt  = JS$1.nextElm(_this).innerHTML.trim();
    					if ( delPreSpaces.loopGaurd > 0 ) { 
    						if (typeof activate == "function") activate(1);
    						JS$1.selectAll(fillid, 'hide');
    					}
    	
    					var ln  = JS$1.find(fillid, '.kwd', 'all').length;
    		
    					if ( ln == 0 && delPreSpaces.loopGaurd <= 4 ) {
    						delPreSpaces.loopGaurd ++;
    						setTimeout(()=> { delPreSpaces.withoutLines(fillid); }, 1000);
    						return false;
    					} else {
    						this.showFillModule( fillid );
    					}
    					
    					if ( pre_prv == "") {
    						JS$1.prevElm(_this).remove();
    					} else {
    						JS$1.prevElm(_this).innerHTML = pre_prv;
    					}
    		
    					if ( pre_nxt == "" ) {
    						JS$1.nextElm(_this).remove();
    					} else {
    						JS$1.nextElm(_this).innerHTML = pre_nxt;
    					}
    				});
    	
    			},
    	
    			showFillModule : (fillid)=> {
    				if (typeof activate == "function") activate(0);
    				if (typeof quizPlayerStatic != "undefined") {
    					if (typeof QuizPlayer != "undefined") {
    						QuizPlayer.setNewHeight( quizPlayerStatic );
    					}
    				}
    				JS$1.selectAll(fillid, 'show');
    			}
    		};
    	}

    	setUpdate(func) {
    		this.updateModule = func;
    	}

    	readyFill(fillid) {
    		let drag_id = "";
    		let drop_target = "";
    		JS$1.bind(fillid +' select', 'change',()=> {
    			JS$1.trigger(fillid, 'click');
    		});
    		this.dragOptionFill = {
    			appendTo: "body",
    			zIndex:100,
    			revert: (is_valid_drop)=> {
    				if (!is_valid_drop) {
    					if (this.sInfo) {
    						this.sInfo = false;
    						setTimeout(function() {
    							this.sInfo = true;
    						}, 60*1000);
    						JS$1.showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 100);
    					}
    					/*if (!!$("#error")[0].play) {
    						try{ $("#error")[0].currentTime = 0; }catch(err) {}
    						$("#error")[0].play();
    					}*/
    					return true;
    				}
    			},
    			helper: (e)=> {
    				var target = e.target;
    				try {
    					if (target.classList.contains("dropable")) {
    						target = JS$1.find(fillid, '#'+ e.target.getAttribute('droped'));
    					}
    					this.img = {
    						"width": JS$1.select(target).clientWidth,
    						"height": 'auto'
    					};
    					e.target.draggable("option", "cursorAt", {
    						left: Math.floor(this.img.width / 2),
    						top: -10,
    					});
    					var cl = e.target.cloneNode(true).css({
    						width: this.img.width+"px",
    						height: this.img.height+"px",
    						"position":"absolute",
    						"text-align":"center"
    					});
    					return cl;
    				} catch(err) {
    					console.warn("Helper:",err);
    				}
    			},
    			onDragStart: (e)=> {
    				e.target.dataset["drag_enable"] = true;
    			},
    			onDragEnter: (e)=> {
    				e.target.classList.add("drop-hover");
    			},
    			onDragLeave: (e)=> {
    				e.target.classList.remove('drop-hover');
    			},
    			onDrop: ( event, dragElm )=> {
    				const _this = event.target;
    				const drop_id = dragElm.getAttribute('droped') ? dragElm.getAttribute('droped') : dragElm.getAttribute('id');
    				
    				if (_this.getAttribute("droped").trim() != "") ;

    				_this.innerHTML = dragElm.innerHTML;
    				JS$1.select(_this, 'attr', {userans: drop_id, droped: drop_id, path: dragElm.getAttribute('path')});
    				JS$1.select(_this, 'css', {backgroundColor: dragElm.style.backgroundColor});
    				// .draggable($.extend(ucFill.dragOptionFill,{revert:false}))
    				drop_target = _this.id;
    				//ucFill.checkAns("#previewArea");
    				this.checkAns(fillid);
    				_this.classList.remove("drop-hover");
    			},
    			onDragEnd: (e, dragElm)=> {
    				let _this = e.target;
    				if (_this.classList.contains('dropable')) {
    					if (_this.dataset["drag_enable"]) ;
    					JS$1.select(_this, 'css',{ backgroundColor: _this.getAttribute('bgcolor')});
    					_this.textContent = _this.getAttribute('caption');
    					JS$1.selectAll(_this, 'attr', {droped: "", userans: ""});
    				}
    				drag_id = _this.id;
    				
    				if (_this.classList.contains('dropable')) {	
    					const rel_id = JS$1.select('#' + drop_target).getAttribute('droped');
    					if (rel_id && JS$1.select('#' + rel_id).getAttribute('drag-single') == 1) {
    						this.dnd.disableDrag('#' + rel_id);
    					}
    				} else {
    					if (drag_id && JS$1.select('#' + drag_id).getAttribute('drag-single') == 1 && drop_target != "") {
    						this.dnd.disableDrag('#' + drag_id);
    						// Remove the dragable disabled from previous
    						if (previous_droped_item && Object.entries(previous_droped_item) && previous_droped_item[drop_target]) {
    							previous_droped_item[drop_target].setAttribute('draggable','true');
    							previous_droped_item[drop_target].setAttribute('aria-disabled','false');
    							previous_droped_item[drop_target].classList.remove('ui-draggable-disabled', 'ui-state-disabled');
    						}
    						
    						// Add the diabled features to current droped item
    						let selected = document.querySelector('#' + drag_id);
    						selected.setAttribute('draggable','false');
    						selected.setAttribute('aria-disabled','true');
    						selected.classList.add('ui-draggable-disabled', 'ui-state-disabled');
    						previous_droped_item[drop_target] = selected;
    					}
    				}
    				this.checkAns(fillid);
    				drop_target="";
    				
    			},
    			scroll: 'true',
    			refreshPositions: true,
    			cursor: "default",
    			//copy: true,
    		};
    		window.fillid = fillid;
    		if (!this.dnd) {
    			this.dnd = new Draggable(this.dragOptionFill);
    		}
    		// Set Drag area
    		JS$1.find(fillid, '.dragable', 'all').forEach((elm)=> this.dnd.setDrag(elm));
    		//$(fillid).find('.dragable').draggable();
    		
    		JS$1.find(fillid, '.dropable', 'all').forEach((_elm)=> {
    			const pre_id = _elm.getAttribute('droped');
    			if (pre_id && JS$1.select('#' + pre_id).getAttribute('drag-single') == 1) {
    				this.dnd.disableDrag( JS$1.select('#'+ pre_id) );
    			}
    		});
    		
    		//$(fillid).find('.dragable').draggable(ucFill.dragOptionFill);
    		
    		JS$1.find(fillid, '[droped*=ID]', 'all').forEach((_this, i)=> {
    			if (JS$1.find(fillid, '#'+ _this.getAttribute('droped')).getAttribute('multi_drag') == "0") {
    				this.dnd.disableDrag(JS$1.find(fillid, '#'+_this.getAttribute('droped')));
    			}
    		});

    		JS$1.find(fillid, '.dropable', 'all').forEach((elm)=> this.dnd.setDrop(elm));
    		//$(fillid).find('.dropable');
    	}

    	bindKeyup(fillid) {
    		//Add keyboard Support class
    		JS$1.find(fillid, ".fillelement", 'all').forEach((_this)=> { JS$1.selectAll(Array.from(_this.children), 'addClass', "ks"); });
    		JS$1.find(fillid, ".dragable", 'all').forEach((_this)=> { _this.classList.add("ks"); });
    		JS$1.find(fillid, ".dropable", 'all').forEach((_this)=> { _this.classList.add("ks"); });
    		let copied_id = "";
    		let drag_id = "";
    		let drop_target = "";

    		JS$1.listen(document, "click", fillid, (_this, event)=> {
    			
    			if (!window.isReview && !this.checkFocus("ks")) {
    				JS$1.selectAll(JS$1.find(fillid, ".copiedclr", 'all'), 'removeClass', "copiedclr");
    				copied_id = "";
    			}
    		});

    		// JS.bind(JS.find(fillid, "input"), "keypress", (e)=> {
    		// 	if (e.which == 13) {
    		// 		e.preventDefault();
    		// 		return false;
    		// 	}
    		// });


    		function copyDraggable() {
    			var copy_drag = JS$1.select(fillid+" .ks:focus");
    			if(copy_drag.classList.contains('dragable') && !copy_drag.classList.contains('ui-state-disabled')) {
    				JS$1.selectAll(fillid + ' .dragable').forEach(function(_this){
    					if(_this.classList.contains('copiedclr')) {
    						_this.classList.remove("copiedclr");
    					}
    				});
    				//const drop_id = dragElm.getAttribute('droped') ? dragElm.getAttribute('droped') : dragElm.getAttribute('id');
    				copied_id = copy_drag.id;
    				copy_drag.classList.add('copiedclr');
    			} else {
    				showmsg('You cannot drop this, as it is already dropped', 3);
    			}
    		}


    		function pasteDraggable() {
    			//var paste_drag = $(fillid).find(".ks:focus");
    			var paste_drag = JS$1.select(fillid+" .ks:focus");
    			//if (copied_id != "" && paste_drag.hasClass('dropable')) {
    			if (copied_id != "" && paste_drag.classList.contains('dropable')) {
    				//var _this_drag = $(".footerstr").find("#"+copied_id+"");
    				var _this_drag = JS$1.select('.footerStr '+"#"+copied_id);

    				//_this_drag.removeClass("copiedclr");
    				_this_drag.classList.remove("copiedclr");
    				//$(_this_drag).data("drag_enable",true);
    				_this_drag.setAttribute("drag_enable",true);
    	
    				//var drop_id = $(_this_drag).attr('droped')?$(_this_drag).attr('droped'):$(_this_drag).attr('id');
    				var drop_id = _this_drag.getAttribute('droped') ? _this_drag.getAttribute('droped') : _this_drag.getAttribute('id');
    				
    				// if ($.trim($(paste_drag).attr("droped")) != "") {
    				// 	$(fillid).find('#'+$(paste_drag).attr("droped")).draggable('enable');
    				// }
    				if(paste_drag.getAttribute("droped").trim() != "" ) ;
    				// if ($.browser.msie && $(fillid).find('#'+drop_id).text() == "") {
    				// 	$(_this_drag).css("background-color","transparent");
    				// }

    				if (JS$1.find(fillid,'#'+drop_id).innerText == "") {
    					_this_drag.style.backgroundColor ="transparent";
    				}


    				//$(paste_drag).html($(_this_drag).html()).attr('userans',drop_id).css({"background-color":$(_this_drag).css("background-color")})

    				paste_drag.innerHTML = _this_drag.innerHTML;
    				paste_drag.setAttribute('userans',drop_id);
    				let _this_drag_style = window.getComputedStyle(_this_drag);
    				paste_drag.style.backgroundColor = _this_drag_style.getPropertyValue('background-color');
    				paste_drag.setAttribute('droped',drop_id);
    				paste_drag.setAttribute('path',_this_drag.getAttribute('path'));





    				// .draggable($.extend(ucFill.dragOptionFill,{revert:false}))
    				// .attr({'droped':drop_id,'path':$(_this_drag).attr('path')});
    				drop_target = paste_drag.getAttribute("id");
    				ucFill.checkAns(fillid);
    	
    				dragStop(_this_drag);
    				copied_id = "";
    			}
    		}

    		function disableDrag(target) {
    			let selected = (typeof target == 'object') ? target : document.querySelector(target);
    			if (selected) {
    				selected.removeAttribute(['dragable','draggable']);
    				selected.classList.remove('dragable');
    			}
    		}


    		function dragStop(_this_drag) {
    			let drop_id = _this_drag.getAttribute('userans');
    			if(_this_drag.classList.contains('dropable')) {
    				if (_this_drag.getAttribute("drag_enable")) {
    					//$(fillid).find('#'+$(_this_drag).attr('droped')).draggable('enable');
    					_this_drag.getAttribute('droped');
    				}

    				_this_drag.style.backgroundColor = _this_drag.getAttribute('bgcolor');
    				_this_drag.innerText = _this_drag.getAttribute('caption');
    				_this_drag.setAttribute('droped','');
    				_this_drag.setAttribute('userans','');


    			}
    			//drag_id = $(_this_drag).attr("id");
    			drag_id = _this_drag.getAttribute("id");
    			
    			if(JS$1.select("#"+drag_id).classList.contains('dropable')) {
    				var rel_id = drop_target && JS$1.select('#' + drop_target).getAttribute('droped');
    				if (rel_id && JS$1('#' + rel_id).getAttribute('drag-single') == 1) ; 
    				else {
    					
    					// if (JS.select('#' + drag_id).getAttribute('drag-single') == 1 && drop_target != "") {
    						//disableDrag('#' + drag_id);
    						if (JS$1.select('#'+drop_id)) { //&& previous_droped_item[copied_id]
    							JS$1.select('#'+drop_id).setAttribute('draggable','true');
    							JS$1.select('#'+drop_id).setAttribute('aria-disabled','false');
    							JS$1.select('#'+drop_id).classList.remove('ui-draggable-disabled', 'ui-state-disabled');
    						}
    						
    						// // Add the diabled features to current droped item
    						//let selected = document.querySelector('#' + drag_id);
    						// selected.setAttribute('draggable','false');
    						// selected.setAttribute('aria-disabled','true');
    						// selected.classList.add('ui-draggable-disabled', 'ui-state-disabled');
    						// previous_droped_item[drop_target] = selected;
    	
    						
    					//}
    				}
    			} else {
    				if (JS$1.select('#' + drag_id).getAttribute('drag-single') == 1 && drop_target != "") {
    					disableDrag('#' + drag_id);
    					if (Object.entries(previous_droped_item) && previous_droped_item[drop_target]) {
    						previous_droped_item[drop_target].setAttribute('draggable','true');
    						previous_droped_item[drop_target].setAttribute('aria-disabled','false');
    						previous_droped_item[drop_target].classList.remove('ui-draggable-disabled', 'ui-state-disabled');
    					}
    					
    					// // Add the diabled features to current droped item
    					let selected = document.querySelector('#' + drag_id);
    					selected.setAttribute('draggable','false');
    					selected.setAttribute('aria-disabled','true');
    					selected.classList.add('ui-draggable-disabled', 'ui-state-disabled');
    					previous_droped_item[drop_target] = selected;

    					
    				}
    			}
    			setTimeout(function() {ucFill.checkAns(fillid);},100);
    			drop_target="";
    		}

    		function removeDraggable() {
    			//var remove_id = $(fillid).find(".ks:focus");
    			var remove_id = JS$1.select(fillid+" .ks:focus");
    			if (remove_id.getAttribute("droped")) {
    				//$(remove_id).data("drag_enable",true);
    				remove_id.setAttribute("drag_enable",true);
    				dragStop(remove_id);
    			}
    		}

    		JS$1.listen(document,'keydown','.dragable',function(data,e){
    			if(e.which === 13) {
    				//debugger;
    				if (!window.isReview) {
    					copyDraggable();
    				}
    			}
    		});

    		JS$1.listen(document,'keydown','.dropable',function(data,e){
    			if(e.which === 13) {
    				if (!window.isReview) {
    					pasteDraggable();
    				}
    			} else if(e.which === 8) {
    				if (!window.isReview) {
    					removeDraggable();
    				}
    			}			
    		});

    		// JS.listen(document,'keydown','.dropable',function(data,e){
    		// 	if(e.which === 8) {
    		// 		removeDraggable();
    		// 	}
    		// })

    		



    		
    		// if (typeof hotkeys == 'function') {
    		// 	hotkeys.unbind('alt+down,enter,delete,esc','fillintheblank');
    		// 	hotkeys("alt+down,enter,delete,esc",'fillintheblank', (event, handler)=> {
    		// 		switch (handler.key) {
    		// 			case 'alt+down' :
    		// 				activateKs();
    		// 			break;
    		// 			case 'enter' :
    		// 				if ($("#sm_controller").css("display") == "none") {
    		// 					if (checkFocus("dragable")) {
    		// 						copyDraggable();
    		// 					} else if (checkFocus("dropable")) {
    		// 						pasteDraggable();
    		// 					}
    		// 				}
    		// 			break;
    		// 			case 'delete' :
    		// 				if ($("#sm_controller").css("display") == "none") {
    		// 					if (checkFocus("dropable")) {
    		// 						removeDraggable();
    		// 					}
    		// 				}
    		// 			break;
    		// 			case 'esc' :
    		// 				if ($("#sm_controller").css("display") == "none") {
    		// 					if (checkFocus("ks")) {
    		// 						$(fillid).find(".copiedclr").removeClass("copiedclr");
    		// 						count = 0;
    		// 						count_prev = 0;
    		// 						copied_id = "";
    		// 						ks_activated = false;
    		// 						$('.ks').last().focus();
    		// 						$('.ks').last().blur();
    		// 					}	
    		// 				}
    		// 			break;
    		// 		}
    		// 	});
    		// 	hotkeys.setScope('fillintheblank');
    		// 	hotkeys.filter = function(event) {
    		// 		return true;
    		// 	}
    		// }
    		
    	}

    	

    	checkFocus(list) {
    		this.checkAns && this.checkAns(ajax_eId);
    		var is_focus = false;
    		JS$1.find(ajax_eId, "."+list, 'all').forEach((_this)=> {
    			if (JS$1.isFocus(_this)) {
    				is_focus = true;
    				return false;
    			}
    		});
    		return is_focus;
    	}

    	showdragans(fillid, ansType, review) {
    		if (typeof review === "undefined") review = 0;
    		JS$1.find(fillid, 'select,input,textarea,.dropable,span.edit_step', 'all').forEach((_this)=> {
    			this.showchilddragans(fillid, _this, ansType, review);
    		});
    	}

    	
    	
    	showchilddragans(fillid, pElem, ansType, review) {
    		let is_correct = -2;
    		if (pElem.classList.contains('dropable')) {
    			pElem.innerHTML = pElem.getAttribute('caption').replace(/\#doublequote#/gmi,'"');
    			JS$1.setCss(pElem, {"background-color": pElem.getAttribute("bgcolor")} );
    			if (ansType == 'c') {
    				var ansKey = pElem.getAttribute('anskey').split(',');
    				ansKey.forEach((value, index)=> {
    					if (value.trim() != "") {
    						const $anskey = JS$1.find(fillid, '#'+value);
    						if ($anskey) {
    							pElem.innerHTML = $anskey.getAttribute('caption').replace(/\#doublequote#/gmi,'"');
    							JS$1.setCss(pElem, {backgroundColor: $anskey.getAttribute("bgcolor")});
    						}
    						return false;
    					}
    				});
    			} else if (ansType == 'u') {
    				is_correct = -1;
    				if (pElem.getAttribute('userans').trim() != "") {
    					this.userans = JS$1.find(fillid, '#'+ pElem.getAttribute('userans'));
    					if (this.userans) {
    						pElem.innerHTML = this.userans.getAttribute('caption').replace(/\#doublequote#/gmi,'"');
    						JS$1.setCss(pElem, {backgroundColor: this.userans.getAttribute("bgcolor")});
    					}
    				}
    				const cans = pElem.getAttribute('anskey');
    				const uans = pElem.getAttribute('userans');
    				if (uans != "" && cans.indexOf(uans) > -1) { is_correct = 1; } 
    			}
    		}

    		if (pElem.classList.contains('edit_step')) {
    			if (review == 1) {
    				if (ansType=='c') {
    					JS$1.selectAll('.edit_step', 'css', {
    						'border' : 'none',
    						'display' : 'none',
    					});
    				} else if (ansType=='u') {
    					JS$1.selectAll('.edit_step', 'css', {
    						'cursor' : 'none',
    						'display': 'block',
    					});

    					is_correct = this.fillTestText(fillid, pElem);
    				}
    			}
    		}

    		if (pElem.parentElement.classList.contains('fillelement')) {
    			if (pElem.nodeName == "SELECT") {
    				is_correct = -1;
    				this.totalcorrect = JS$1.find(pElem, "[correctans='1']", 'all').length;
    				this.a = 0;
    				JS$1.find(pElem, "option", 'all').forEach((_this, i)=> {
    					_this.removeAttribute("selected");
    					_this.selected = false;
    					if (ansType=='c') {
    						if (_this.getAttribute("correctans") > 0) _this.selected = true;
    					} else if (ansType=='u') {
    						if (_this.getAttribute("userans") > 0) _this.selected = true;
    						if (_this.selected && _this.getAttribute('correctans') == 1) { this.a++; }
    					}
    				});
    				if (this.totalcorrect == this.a) is_correct = 1;
    			} else if (pElem.nodeName == "INPUT" || pElem.nodeName == "TEXTAREA") {
    				if (typeof(pElem.type) == "undefined") {this.type = 'text';}
    				if (ansType=='c') {  //correct answer
    					var anskey = pElem.getAttribute("anskey").split(',');
    					if (anskey.length > 1) {
    						var tooltip = "<p style='text-align:left;'>All of the answers are correct!<br>";
    						anskey.forEach((value, index)=> {
    							tooltip += "(" + (index + 1) + ") " + value.replace(/#cm/g,',')  + "<br>";
    						});
    						setTimeout(function(){
    							JS$1.select(pElem,'attr', {'rel': 'multiple_answers', 'title' : tooltip + '</p>' , 'data-original-title' : tooltip + '</p>' , 'data-placement':'top','data-toggle':'tooltip',});
    							//$('[rel="multiple_answers"]').tooltip();
    							//JS.enableBsAll("[data-toggle='tooltip']", 'Tooltip', {container: 'body'});
    						},300);
    						
    						
    					}
    					pElem.value = pElem.getAttribute("anskey").replace(/#cm/g,',');
    				} else if (ansType=='u') {  //user answer
    					pElem.removeAttribute(['rel', 'title', 'data-html']);
    					//$('[rel=multiple_answers]').tooltip('dispose');
    					if (pElem.getAttribute("userans") == "" && pElem.getAttribute("defaultAns") !== "") {
    						pElem.value = pElem.getAttribute("defaultAns");
    					} else {
    						var __ans = pElem.getAttribute("userans");
    						if (pElem.nodeName == "TEXTAREA") {
    							__ans = __ans.replace(/#singlequote#/g, "'");
    							__ans = __ans.replace(/#dblquote#/g, '"');
    						}
    						pElem.value = __ans;
    					}
    					is_correct = this.fillTestText(fillid, pElem);
    				}
    			}
    		}
    		if (ansType == 'u' && review==1) {
    			if (is_correct != -2 && parseInt(JS$1.select(fillid).getAttribute("manual_grade")) != 1) {
    				const correct_incorrect_mark = this.markUserAnswer(is_correct);
    				if (pElem.classList.contains('dropable')) {
    					JS$1.insert(pElem, correct_incorrect_mark, 'beforeend');
    					pElem.setAttribute('as', is_correct);
    				} else if (pElem.classList.contains('edit_step')) {
    					if (is_correct == 1) {
    						JS$1.selectAll("#"+ pElem.getAttribute('id'), 'css', { 'border': '2px solid green'});
    					} else {
    						JS$1.selectAll("#"+ pElem.getAttribute('id'),'css', {'border': '2px solid red'});
    					}

    					pElem.setAttribute('as', is_correct);
    				} else {
    					JS$1.insert(pElem.parentElement, correct_incorrect_mark, 'beforeend');
    					pElem.parentElement.setAttribute('as', is_correct);
    				}
    			}
    			pElem.setAttribute('title', is_correct == 1 ? 'is marked as Correct' : 'is marked as incorrect');
    		} else {
    			JS$1.find(fillid, '.correct_incorrect_icon_fill', {action:'remove'});
    			pElem.setAttribute('title','');
    		}
    		this.iscorrect = is_correct;
    	}

    	fillTestText(fillid, pElem) {
    		var is_correct = -1, 
    		anskey = pElem.getAttribute("anskey").trim(), 
    		userans = pElem.value ? pElem.value.trim() : "",
    		haskey = pElem.getAttribute('haskeywords'),
    		hasnkey = pElem.getAttribute('hasnotkeywords'),
    		codetype = pElem.getAttribute("codetype"),
    		mathtype = pElem.getAttribute("mathtype");
    		if (pElem.nodeName != "TEXTAREA") {
    			//userans = pElem.value.trim();
    			if (/\d,\d/.test(userans)) { // TRUE when comma is used any numerical value like 500,000
    				userans = pElem.value.trim().replace(/,/g,"#cm");
    			} 
    			// @uc-abk added for one Custoumer Bug "answer,anotherAnswer" getting incorrect.
    			let temp = userans.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g);
    			if (userans.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g)) {
    				temp = temp.toString().replace(/,/g, "#cm");
    			}
    			userans = userans.replace(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g, temp);
    		}
    		if (codetype == 1) {
    			var regex_code = [/\s+/g,/\;$/,/"/g];
    			var regex_replace = ["", "", "'"];
    			for (let l=0; l < regex_code.length; l++) {
    				userans = userans.replace(regex_code[l],regex_replace[l]);
    				anskey = anskey.replace(regex_code[l],regex_replace[l]);
    			}
    		}

    		if (mathtype == 1) {
    			userans = pElem.getAttribute("userans").trim();
    			//userans = userans;
    		}
    		
    		if (JS$1.select(fillid).getAttribute('matchtype') == 1) {
    			anskey = anskey.toLowerCase();
    			userans = userans.toLowerCase();
    		}

    		if (JS$1.select(fillid).getAttribute('ignoretype') == 1) {
    			if (JS$1.select(fillid).getAttribute('multi') != 0) {
    				var ans = [];
    				anskey.split(',').forEach((val, index)=> {
    					ans.push(val.replace(/[^a-zA-Z0-9]/gi, ""));
    				});
    				anskey = ans.join(',');
    			} else {
    				anskey = anskey.replace(/[^a-zA-Z0-9]/gi, "");
    			}
    			userans = userans.replace(/[^a-zA-Z0-9]/gi, "");
    		}

    		if (pElem.getAttribute('keywordtype') == 1 && haskey.length > 0 && hasnkey.length > 0) {
    			var valid = 0 ,valid_is = 0;
    			haskey.split(',').forEach((val, index)=> {
    				if (userans.indexOf(val) != -1) valid++;
    			});
    			hasnkey.split(',').forEach((val, index)=> {
    				if (userans.indexOf(val) != -1) valid_is++;
    			});
    			if (haskey.split(',').length == valid && valid_is == 0) userans = anskey;
    		}
    		if (JS$1.select(fillid).getAttribute('multi') != 0) {
    			userans = userans.replace(/,/gm, "#cm");
    			if (userans != "" && this.checkInArray(anskey.split(","),userans.split(',')) ) {
    				is_correct = 1;
    				userans = userans.replace(/#cm/gm, ",");
    			}
    		} else {
    			if (userans == anskey) {
    				is_correct = 1;
    			}
    		}
    		return is_correct;
    	}

    	markUserAnswer(is_correct) {
    		const droped_value_indicator_html = '<span class="'+((is_correct == 1) ? "icomoon-new-24px-checkmark-circle-1 font-weight-bold" : "icomoon-new-24px-cancel-circle-1 font-weight-bold")+'" style="color:'+((is_correct == 1) ? "green" : "red" )+';">';
    		let correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="background:white;border-radius:15px 12px 12px;"> '  + droped_value_indicator_html + '</span></span>';
    		if (JS$1.find(ajax_eId, '.prettyprint', 'all').length > 0) {
    			correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="bottom:22px;background:none;border-radius:12px;"> '  + droped_value_indicator_html + '</span></span>';
    		}
    		return correct_incorrect_mark;
    	}

    	checkAns(fillid) {
    		
    		this.userAnsXML = "<smans type='9'>\n";
    		this.result = true;
    		this.temp = 0;
    		JS$1.find(fillid, 'select,input,textarea,.dropable,span.edit_step.mathquill', 'all').forEach((_this)=> {
    			this.userAnsXML = this.checkChildAnswer(fillid, _this, this.userAnsXML);
    		});
    		this.userAnsXML += "</smans>";
    		window.ISSPECIALMODULEUSERXMLCHANGE = 1;
    		JS$1.select("#special_module_user_xml").value = this.userAnsXML;
    	//	updateModule('uxml', this.userAnsXML);

    		if (parseInt(JS$1.select(fillid).nodeName && JS$1.select(fillid).getAttribute('manual_grade') || '1') != 1) {
    			JS$1.select("#answer").checked = ((this.result) ? true : false);
    			if (this.result) {
    				JS$1.select("#answer").checked = true;
    				if (typeof(is_sm) != "undefined") JS$1.showmsg("Correct", 3);
    				return "Correct";
    			} else {
    				JS$1.select("#answer").checked = false;
    				if (typeof(is_sm) != "undefined") JS$1.showmsg("Incorrect", 3);
    				return "Incorrect";
    				
    			}
    		}
    	}

    	checkInArray(tree, branch) {
    		let matchedBranch = [];
    		for (let i = 0; i < tree.length; i++) {
    			for (let j = 0; j < branch.length; j++) {
    				if (!matchedBranch.includes(branch[j]) && (branch[j].trim() == tree[i].trim())) {
    					matchedBranch.push(branch[j]);
    					continue;
    				}
    			}
    		}
    		let result = (branch.length - matchedBranch.length);
    		return result == 0 ? true : false;
    	}

    	checkChildAnswer(fillid, pElem, userAnsXML) {
    		
    		if (pElem.classList.contains('dropable')) {
    			var ansKey = pElem.getAttribute('anskey').split(',');
    			if (JS$1.findInArray(pElem.getAttribute('userans'), ansKey) == undefined || JS$1.findInArray(pElem.getAttribute('userans'), ansKey) == false) {
    				this.result = false;
    			} else {
    				this.temp++;
    			}
    			if (typeof calculatePoint != "undefined") {
    				calculatePoint(JS$1.select(fillid).getAttribute('totalcorrectans'), this.temp);
    			}
    			userAnsXML += `<div id='${pElem.getAttribute("id")}' userAns='${pElem.getAttribute('userans')}'></div>\n`;
    			//@simran - start
    		} else if (pElem.classList.contains('mathquill')) {
    			var innerfield = [];
    			var mathItemId = pElem.getAttribute('id');
    			var anskey = pElem.getAttribute("anskey").trim();
    			var originalLatex = pElem.getAttribute("userans").trim();
    			
    			var MQ = MathQuill.getInterface(2);
    			var mathItem = MQ.StaticMath(document.getElementById(mathItemId));
    			
    			for (var i = 0; i <= mathItem.innerFields.length - 1; i++) {
    				innerfield[i] = mathItem.innerFields[i].latex();
    			}

    			let newMathField = originalLatex;
    			let mathField = originalLatex.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);

    			if (innerfield.indexOf("")<0) {
    				for (i in mathField) {
    					const createFeild = '\\MathQuillMathField{'+innerfield[i]+'}';
    					const newMf = mathField[i].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g , createFeild);
    					const regex = mathField[i];
    					newMathField = newMathField.replace(regex , newMf);
    				}
    			}

    			originalLatex = newMathField;
    		
    			let userans = originalLatex;

    			if (anskey != userans) {
    				this.result = false;
    			} else {
    				this.temp++;
    			}
    			
    			pElem.setAttribute("userans", userans);
    		
    			userAnsXML += `<div id='${pElem.getAttribute("id")}' userAns='${userans}' anskey='${anskey}' userAnsSeq='${pElem.getAttribute("userAnsSeq")}'></div>\n`;

    		//@simran - end
    		} else if (pElem.parentElement.classList.contains('fillelement')) {
    			if (pElem.nodeName == "SELECT") {
    				this.uAnsSel = "";
    				this.a = 0;
    				this.totalcorrect = JS$1.find(pElem, "[correctans='1']", 'all').length;
    				JS$1.find(pElem, "option", 'all').forEach((_value, index)=> {
    					_value.setAttribute('userans', '');
    					if (_value.selected) {
    						this.a++;
    						if (_value.getAttribute("correctans") != 1) {
    							this.result = false;
    						} else {
    							this.temp++;
    						}
    						this.uAnsSel = this.uAnsSel+(index)+",";
    						_value.setAttribute('userans', index);
    					}
    				});
    				if (this.a != this.totalcorrect) this.result = false;
    				if (typeof calculatePoint != "undefined") {
    					calculatePoint(JS$1.select(fillid).getAttribute('totalcorrectans'), this.temp);
    				}
    				userAnsXML += `<div id='${pElem.parentElement.getAttribute("id")}' userAns='${this.uAnsSel}'></div>\n`;
    			} else if (pElem.nodeName == "INPUT" || pElem.nodeName == "TEXTAREA") {
    				var anskey = pElem.getAttribute("anskey").trim(), 
    				userans = pElem.value.trim(),
    				codetype = pElem.getAttribute("codetype");
    				pElem.setAttribute('userans', userans);
    				if (codetype == 1) {
    					var regex_code = [/\s+/g,/\;$/,/"/g];
    					var regex_replace = ["","","'"];
    					for (let l=0; l<regex_code.length; l++)  {
    						userans = userans.replace(regex_code[l],regex_replace[l]);
    						anskey = anskey.replace(regex_code[l],regex_replace[l]);
    					}
    				}
    				if (JS$1.select(fillid).getAttribute('matchtype') == 1) {
    					anskey = anskey.toLowerCase();
    					userans = userans.toLowerCase();
    				}
    				if (JS$1.select(fillid).getAttribute('ignoretype') == 1) {
    					if (JS$1.select(fillid).getAttribute('multi') != 0) {
    						let ans = [];
    						anskey.split(',').forEach((val, index)=> {
    							ans.push(val.replace(/[^a-zA-Z0-9]/gi, ""));
    						});
    						anskey = ans.join(',');
    					} else {
    						anskey = anskey.replace(/[^a-zA-Z0-9]/gi, "");
    					}
    					userans = userans.replace(/[^a-zA-Z0-9]/gi, "");
    				}
    				//Multiple in textBox
    				if (JS$1.select(fillid).getAttribute('multi') != 0 || anskey.includes("#cm")) {
    					//if (anskey.substr(0, 1) != ",") {anskey = ","+anskey;}
    					//if (anskey.substr(-1, 1) != ",") {anskey += ",";}
    					userans = userans.replace(/,/g,"#cm");
    					if (userans == "" || !this.checkInArray(anskey.split(','),userans.split(','))) {
    						this.result = false;
    					} else {
    						this.temp++;
    					}
    				} else {
    					var haskey = pElem.getAttribute('haskeywords'), 
    					hasnkey	   = pElem.getAttribute('hasnotkeywords');
    					if (pElem.getAttribute('keywordtype') == 1 && haskey.length > 0 && hasnkey.length > 0) {
    						var valid = 0 ,valid_is = 0;
    						haskey.split(',').forEach((val, index)=> {
    							if (userans.indexOf(val) != -1) valid++;
    						});
    						hasnkey.split(',').forEach((val, index)=> {
    							if (userans.indexOf(val) != -1) valid_is++;
    						});
    						if (haskey.split(',').length != valid || valid_is != 0) {
    							this.result = false;
    						} else {
    							this.temp++;
    						}
    					} else {
    						if (anskey != userans) {
    							this.result = false;
    						} else {
    							this.temp++;
    						}
    					}
    				}
    				if (typeof calculatePoint != "undefined") {
    					calculatePoint(JS$1.select(fillid).getAttribute('totalcorrectans'), this.temp);
    				}
    				var __ans = pElem.value;
    				if (pElem.nodeName == "TEXTAREA") {
    					__ans = __ans.replace(/'/g, "#singlequote#");
    					__ans = __ans.replace(/"/g, "#dblquote#");
    				}
    				if (pElem.nodeName == "INPUT") ;
    				userAnsXML += `<div id='${pElem.parentElement.getAttribute("id")}' userAns='${__ans}'></div>\n`;
    			}
    		}
    		return userAnsXML;
    		
    	}

    	modeOn(modeType, isReview) {
    		JS$1.selectAll('.test, .review', 'addClass', 'h');
    		if (modeType) {
    			if (typeof hotkeys == 'function') {
    				hotkeys.unbind('alt+down,enter,delete','fillintheblank');
    				hotkeys.deleteScope('fillintheblank');
    			}
    			JS$1.selectAll('.review', 'removeClass', 'h');
    			//try{
    				this.unBindLab();
    			//} catch(e) {
    			//}
    			this.showdragans(ajax_eId, 'u',1);
    			
    		} else {
    			this.bindKeyup(ajax_eId);
    			JS$1.selectAll('.test', 'removeClass', 'h');
    			this.bindLab();
    			this.showdragans(ajax_eId, 'u');
    		}
    	}

    	bindLab() {
    		this.labBinded = true;
    		JS$1.find(ajax_eId, 'select,input,textarea', {action: 'removeAttr', actionData: 'disabled'});
    		try {
    			this.readyFill(ajax_eId);
    		} catch(e) {
    			console.log("catch");
    		}
    	}	

    	unBindLab() {
    		this.labBinded = false;
    		JS$1.find(ajax_eId, 'input,select,textarea', 'all').forEach((_this)=> {
    			if (this.nodeName == "INPUT" || this.nodeName == "TEXTAREA") { 
    				_this.getAttribute('userans', _this.value); 
    			} else if (this.nodeName == "SELECT") {
    				_this.querySelectorAll("option").forEach((elm, index)=> {
    					elm.selected ? elm.setAttribute('userans', 1) : elm.setAttribute('userans', '');
    				});
    			}
    		});
    		// @pradeep -  remove disabled due to ada read.
    		//$(ajax_eId).find('select,input,textarea').prop('disabled','disabled');
    		
    		//JS.find(ajax_eId, '.dragable .dropable').off('click dragenter mouseenter mouseleave touchstart keyup');
    		//JS.find(ajax_eId, '.dragable').draggable("destroy");
    		// JS.find(ajax_eId, '.dropable').each(function() {
    		// 	if ($(this).hasClass('ui-draggable')) $(this).draggable("destroy");
    		// });
    		
    	}

    	pre_fill(fillid) {
    		var fill_pre = JS$1.find(fillid, '.fillelement,.dropable', 'all');
    		if (JS$1.find(fillid, '.prettyprint', 'all').length > 0) {
    			if (typeof activate == "function") activate(1);
    			JS$1.selectAll(fillid, 'hide');
    			if (JS$1.find(fillid, 'pre').classList.contains('lg')) JS$1.selectAll(fillid, 'css', {'width': 930+'px'});
    			setTimeout(()=> {
    				if (JS$1.find(fillid, 'pre').classList.contains('linenums')) {
    					this.delPreSpaces.withLines(fillid);
    				} else {
    					this.delPreSpaces.withoutLines(fillid);
    				}
    				this.delPreSpaces.showFillModule( fillid );
    			},1000);
    		}
    	}
    }

    const ucFill = new fillJS();

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
    	if (result.debug == true) {
    		console.log("result", result);
    		console.trace();
    	}

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
        itemtype_56 : "In this type of question, you have to select or input the correct option in the given grid. The shortcut keys to perform this task are: Press Tab for navigation. Type values directly or press the Enter key to select the grid.",
        itemtype_13 : "Here, this type of question contains the terminal. You have to write command to perform this task.",
        itemtype_22 : "In this type of question, you have to write command to perform the task. Press Tab key to navigate.",
        es6_warining: "You are using Internet Explorer, ES6 functionality of javascript will not work!",
        embed_content: "Embed Content",
        plus_minus_option: "Please select the plus and minus option",
        slash_option: 'Please select the slash option',
        decimal_option: 'Please select the decimal option',
    };

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

    /* src/libs/FillInTheBlanksToolbar.svelte generated by Svelte v3.34.0 */
    const file$1 = "src/libs/FillInTheBlanksToolbar.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-1qn0my1-style";
    	style.textContent = ".toolbar_container_one.svelte-1qn0my1{max-height:359px;max-width:641px;margin:0 auto;border:1px solid #91653E;border-width:0 1px 1px 1px;z-index:1;font-size:17px !important}.draggable_area.svelte-1qn0my1{display:inline-flex;height:24px;width:100%;background-color:#654320}.dots_container.svelte-1qn0my1{margin:auto;text-align:center}.dots.svelte-1qn0my1{width:4px;height:4px;border-radius:50%;display:inline-block;background-color:#888}.toolbar_types_area.svelte-1qn0my1{max-height:35px;display:inline-flex;width:-webkit-fill-available;width:100%;background-color:#F0F0F0}.select_area.svelte-1qn0my1{width:162px;margin:4px 0}.option_selectbox.svelte-1qn0my1{width:155px;padding:4px 2px;border:none;margin-left:2px;border:1px solid}.show_text_area.svelte-1qn0my1{width:605px}.lower_part_toolbar.svelte-1qn0my1{border:1px solid #91653E;border-width:1px 0}.orange_container.svelte-1qn0my1{background-color:#FCFCD3}.column_four.svelte-1qn0my1{background-color:#DDDDDD}.blue_container.svelte-1qn0my1{background-color:#E6F2FC}.light_purpl_container.svelte-1qn0my1{background-color:#F0F0F0}.blank_color.svelte-1qn0my1{background-color:#D7E7DA}.blank_color.svelte-1qn0my1:hover{outline:none}.font_changer.svelte-1qn0my1{font-weight:bold;font-size:17px !important}.first_btn.svelte-1qn0my1,.scnd_btn.svelte-1qn0my1,.thrd_btn.svelte-1qn0my1,.fourth_btn.svelte-1qn0my1,.fifth_btn.svelte-1qn0my1{text-align:center;width:80px;height:58px;padding:12px;border-right:0px solid #91653E}.first_btn.svelte-1qn0my1:hover,.scnd_btn.svelte-1qn0my1:hover,.thrd_btn.svelte-1qn0my1:hover,.fourth_btn.svelte-1qn0my1:hover,.fifth_btn.svelte-1qn0my1:hover{outline:1px solid;outline-offset:-6px}.button_designs.svelte-1qn0my1,.lower_part_toolbar.svelte-1qn0my1{display:inline-flex}.scnd_btn.svelte-1qn0my1,.fourth_btn.svelte-1qn0my1{border-top:1px solid #91653E;border-bottom:0px solid #91653E}.columns_design.svelte-1qn0my1{width:80px}.padder_btn.svelte-1qn0my1{padding-top:2px}.remove_border.svelte-1qn0my1{border:none}.xvariable.svelte-1qn0my1{width:20px;margin:auto;height:19px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -32px -487px}.yvariable.svelte-1qn0my1{width:22px;margin:auto;height:22px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -30px -714px}.xfraction.svelte-1qn0my1{width:21px;margin:auto;height:49px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -23px -922px;;}.modulus.svelte-1qn0my1{width:25px;margin:auto;height:30px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -27px -848px}.padder_less.svelte-1qn0my1{padding-top:15px}.padder_remover.svelte-1qn0my1{padding-top:10px}.padder_field.svelte-1qn0my1{padding-top:12px}.sigma.svelte-1qn0my1{width:16px;margin:auto;height:48px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -36px -381px}.h-bar.svelte-1qn0my1{width:17px;margin:auto;height:34px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -32px -507px}.x-power-y.svelte-1qn0my1{width:21px;margin:auto;height:38px;background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -899px}.long-division.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -79px;width:45px;height:32px;margin:auto}.square-root-two.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -183px;width:38px;height:39px;margin:auto}.x-times-fraction.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -223px;margin:auto;width:37px;height:50px}.square-root.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -274px;width:36px;height:34px;margin:auto}.brackets.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -309px;width:35px;height:34px;margin:auto}.h-power.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -344px;width:35px;height:36px;margin:auto}.curly-brackets.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -408px;width:33px;margin:auto;height:27px}.xsquare.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -461px;width:31px;height:25px;margin:auto}.integrtion.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -487px;width:30px;height:40px;margin:auto}.opp-recbrackets.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -528px;width:30px;height:27px;margin:auto}.square-brackets.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -556px;width:30px;height:34px;margin:auto}.xsubscript.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -591px;width:30px;height:31px;margin:auto}.dollar.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -623px;width:29px;height:31px;margin:auto}.h-sub.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -655px;margin:auto;width:29px;height:30px}.rec-brackets.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -686px;width:28px;height:31px;margin:auto}.xpower.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -718px;width:28px;height:30px;margin:auto}.bar-block.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -749px;width:26px;height:34px;margin:auto}.infinity.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -784px;width:26px;height:20px;margin:auto}.topbar-arrow.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -1px -805px;width:26px;height:42px;margin:auto}.h-sup.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png)-1px -848px;width:25px;height:26px;margin:auto}.colon.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -28px -749px;width:24px;height:31px;margin:auto}.not-lesser.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -28px -781px;width:24px;height:23px;margin:auto}.h-sup-sub.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -28px -805px;width:23px;height:36px;margin:auto}.not-greater.svelte-1qn0my1{background:url(https://s3.amazonaws.com/jigyaasa_assets/items/toolbar_images.png) -30px -686px;width:22px;margin:auto;height:27px}.rborder_remover.svelte-1qn0my1{border-right:0}.dec_widther.svelte-1qn0my1{width:78px}.bborder_remover.svelte-1qn0my1{border-bottom:0}.blank_color.svelte-1qn0my1:hover{outline:0}.bborder_adder.svelte-1qn0my1{border-bottom:1px solid #91653E}@media(max-width: 556px){.first_btn.svelte-1qn0my1,.scnd_btn.svelte-1qn0my1,.thrd_btn.svelte-1qn0my1,.fourth_btn.svelte-1qn0my1,.fifth_btn.svelte-1qn0my1,.columns_design.svelte-1qn0my1{width:30px}}@media(max-width: 768px){.first_btn.svelte-1qn0my1,.scnd_btn.svelte-1qn0my1,.thrd_btn.svelte-1qn0my1,.fourth_btn.svelte-1qn0my1,.fifth_btn.svelte-1qn0my1,.columns_design.svelte-1qn0my1{width:50px}}@media(max-width: 992px){.first_btn.svelte-1qn0my1,.scnd_btn.svelte-1qn0my1,.thrd_btn.svelte-1qn0my1,.fourth_btn.svelte-1qn0my1,.fifth_btn.svelte-1qn0my1,.columns_design.svelte-1qn0my1{width:80px}}.height_modifier.svelte-1qn0my1{max-height:290px;overflow-y:scroll}.tborder_remover.svelte-1qn0my1{border-top:0}.close_toolbar.svelte-1qn0my1{padding:5px;color:#888;border:none;background-color:#654320}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbEluVGhlQmxhbmtzVG9vbGJhci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBaTRCSSxzQkFBc0IsZUFBQyxDQUFBLEFBQ25CLFVBQVUsQ0FBRSxLQUFLLENBQ2pCLFNBQVMsQ0FBRSxLQUFLLENBQ2hCLE1BQU0sQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUNkLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDekIsWUFBWSxDQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FDM0IsT0FBTyxDQUFFLENBQUMsQ0FDVixTQUFTLENBQUUsSUFBSSxDQUFDLFVBQVUsQUFDMUIsQ0FBQSxBQUVKLGVBQWUsZUFBQyxDQUFBLEFBQ1osT0FBTyxDQUFFLFdBQVcsQ0FDcEIsTUFBTSxDQUFFLElBQUksQ0FDWixLQUFLLENBQUUsSUFBSSxDQUNYLGdCQUFnQixDQUFFLE9BQU8sQUFDN0IsQ0FBQSxBQUVBLGVBQWUsZUFBQyxDQUFBLEFBQ1osTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFBLEFBRUEsS0FBSyxlQUFDLENBQUEsQUFDRixLQUFLLENBQUUsR0FBRyxDQUNWLE1BQU0sQ0FBRSxHQUFHLENBQ1gsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsT0FBTyxDQUFFLFlBQVksQ0FDckIsZ0JBQWdCLENBQUUsSUFBSSxBQUMxQixDQUFBLEFBRUEsbUJBQW1CLGVBQUMsQ0FBQSxBQUNoQixVQUFVLENBQUUsSUFBSSxDQUNoQixPQUFPLENBQUUsV0FBVyxDQUNwQixLQUFLLENBQUUsc0JBQXNCLENBQzdCLEtBQUssQ0FBRSxJQUFJLENBQ1gsZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFBLEFBRUEsWUFBWSxlQUFDLENBQUEsQUFDVCxLQUFLLENBQUUsS0FBSyxDQUNaLE1BQU0sQ0FBRSxHQUFHLENBQUMsQ0FBQyxBQUNqQixDQUFBLEFBRUEsaUJBQWlCLGVBQUMsQ0FBQSxBQUNkLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FBQyxHQUFHLENBQ2hCLE1BQU0sQ0FBRSxJQUFJLENBQ1osV0FBVyxDQUFFLEdBQUcsQ0FDaEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLEFBQ3JCLENBQUEsQUFFQSxlQUFlLGVBQUMsQ0FBQSxBQUNaLEtBQUssQ0FBRSxLQUFLLEFBQ2hCLENBQUEsQUFFQSxtQkFBbUIsZUFBQyxDQUFBLEFBQ2hCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDekIsWUFBWSxDQUFFLEdBQUcsQ0FBQyxDQUFDLEFBQ3ZCLENBQUEsQUFFQSxpQkFBaUIsZUFBQyxDQUFBLEFBQ2QsZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFBLEFBRUEsWUFBWSxlQUFDLENBQUEsQUFDVCxnQkFBZ0IsQ0FBRSxPQUFPLEFBQzdCLENBQUEsQUFFQSxlQUFlLGVBQUMsQ0FBQSxBQUNaLGlCQUFpQixPQUFPLEFBQzVCLENBQUEsQUFFQSxzQkFBc0IsZUFBQyxDQUFBLEFBQ25CLGdCQUFnQixDQUFFLE9BQU8sQUFDN0IsQ0FBQSxBQUVBLFlBQVksZUFBQyxDQUFBLEFBQ1QsZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFBLEFBRUEsMkJBQVksTUFBTSxBQUFDLENBQUEsQUFDZixPQUFPLENBQUUsSUFBSSxBQUNqQixDQUFBLEFBRUEsYUFBYSxlQUFDLENBQUEsQUFDVixXQUFXLENBQUUsSUFBSSxDQUNqQixTQUFTLENBQUUsSUFBSSxDQUFDLFVBQVUsQUFDOUIsQ0FBQSxBQUVBLHlCQUFVLENBQ1Ysd0JBQVMsQ0FDVCx3QkFBUyxDQUNULDBCQUFXLENBQ1gsVUFBVSxlQUFDLENBQUEsQUFDUCxVQUFVLENBQUUsTUFBTSxDQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLElBQUksQ0FDYixZQUFZLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQ25DLENBQUEsQUFFQSx5QkFBVSxNQUFNLENBQ2hCLHdCQUFTLE1BQU0sQ0FDZix3QkFBUyxNQUFNLENBQ2YsMEJBQVcsTUFBTSxDQUNqQix5QkFBVSxNQUFNLEFBQUMsQ0FBQSxBQUNiLE9BQU8sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUNsQixjQUFjLENBQUUsSUFBSSxBQUN4QixDQUFBLEFBRUEsOEJBQWUsQ0FDZixtQkFBbUIsZUFBQyxDQUFBLEFBQ2hCLE9BQU8sQ0FBRSxXQUFXLEFBQ3hCLENBQUEsQUFFQSx3QkFBUyxDQUNULFdBQVcsZUFBQyxDQUFBLEFBQ1IsVUFBVSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUM3QixhQUFhLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQ3BDLENBQUEsQUFFQSxlQUFlLGVBQUMsQ0FBQSxBQUNaLEtBQUssQ0FBRSxJQUFJLEFBQ2YsQ0FBQSxBQUVBLFdBQVcsZUFBQyxDQUFBLEFBQ1IsV0FBVyxDQUFFLEdBQUcsQUFDcEIsQ0FBQSxBQW9CQSxjQUFjLGVBQUMsQ0FBQSxBQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFvQkEsVUFBVSxlQUFDLENBQUEsQUFDUCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQ25HLENBQUEsQUFFQSxVQUFVLGVBQUMsQ0FBQSxBQUNQLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFDbkcsQ0FBQSxBQUVBLFVBQVUsZUFBQyxDQUFBLEFBQ1AsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUEsQUFDcEcsQ0FBQSxBQUVBLFFBQVEsZUFBQyxDQUFBLEFBQ0wsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUNuRyxDQUFBLEFBRUEsWUFBWSxlQUFDLENBQUEsQUFDVCxXQUFXLENBQUUsSUFBSSxBQUNyQixDQUFBLEFBRUEsZUFBZSxlQUFDLENBQUEsQUFDWixXQUFXLENBQUUsSUFBSSxBQUNyQixDQUFBLEFBRUEsYUFBYSxlQUFDLENBQUEsQUFDVixXQUFXLENBQUUsSUFBSSxBQUNyQixDQUFBLEFBRUEsTUFBTSxlQUFDLENBQUEsQUFDSCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQ25HLENBQUEsQUFFQSxNQUFNLGVBQUMsQ0FBQSxBQUNILEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFDbkcsQ0FBQSxBQVNBLFVBQVUsZUFBQyxDQUFBLEFBQ1AsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxBQUNsRyxDQUFBLEFBY0EsY0FBYyxlQUFDLENBQUMsQUFDWixVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQzdGLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBYUEsZ0JBQWdCLGVBQUMsQ0FBQyxBQUNkLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxpQkFBaUIsZUFBQyxDQUFDLEFBQ2YsVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM5RixNQUFNLENBQUUsSUFBSSxDQUNaLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQUNBLFlBQVksZUFBQyxDQUFDLEFBQ1YsVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM5RixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQUNBLFNBQVMsZUFBQyxDQUFDLEFBQ1AsVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM5RixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQUNBLFFBQVEsZUFBQyxDQUFDLEFBQ04sVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM5RixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQU9BLGVBQWUsZUFBQyxDQUFDLEFBQUMsVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM1RyxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQU9BLFFBQVEsZUFBQyxDQUFDLEFBQ04sVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM5RixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQUNBLFdBQVcsZUFBQyxDQUFDLEFBQ1QsVUFBVSxDQUFFLElBQUksaUVBQWlFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM5RixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQSxBQUNBLGdCQUFnQixlQUFDLENBQUMsQUFDZCxVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQzlGLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ0EsZ0JBQWdCLGVBQUMsQ0FBQyxBQUNkLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxXQUFXLGVBQUMsQ0FBQyxBQUNULFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxPQUFPLGVBQUMsQ0FBQyxBQUNMLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxNQUFNLGVBQUMsQ0FBQyxBQUNKLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsTUFBTSxDQUFFLElBQUksQ0FDWixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxhQUFhLGVBQUMsQ0FBQyxBQUNYLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxPQUFPLGVBQUMsQ0FBQyxBQUNMLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxVQUFVLGVBQUMsQ0FBQyxBQUNSLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxTQUFTLGVBQUMsQ0FBQyxBQUNQLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxhQUFhLGVBQUMsQ0FBQyxBQUNYLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDOUYsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDQSxNQUFNLGVBQUMsQ0FBQyxBQUNKLFVBQVUsQ0FBRSxJQUFJLGlFQUFpRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQzdGLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ0EsTUFBTSxlQUFDLENBQUMsQUFDSixVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQy9GLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ0EsV0FBVyxlQUFDLENBQUMsQUFDVCxVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQy9GLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ0EsVUFBVSxlQUFDLENBQUMsQUFDUixVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQy9GLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBT0EsWUFBWSxlQUFDLENBQUMsQUFDVixVQUFVLENBQUUsSUFBSSxpRUFBaUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQy9GLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBZUEsZ0JBQWdCLGVBQUMsQ0FBQSxBQUNiLFlBQVksQ0FBRSxDQUFDLEFBQ25CLENBQUEsQUFFQSxZQUFZLGVBQUMsQ0FBQSxBQUNULEtBQUssQ0FBRSxJQUFJLEFBQ2YsQ0FBQSxBQUVBLGdCQUFnQixlQUFDLENBQUEsQUFDYixhQUFhLENBQUUsQ0FBQyxBQUNwQixDQUFBLEFBRUEsMkJBQVksTUFBTSxBQUFDLENBQUEsQUFDZixPQUFPLENBQUUsQ0FBQyxBQUNkLENBQUEsQUFFQSxjQUFjLGVBQUMsQ0FBQSxBQUNYLGFBQWEsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFDcEMsQ0FBQSxBQWtCQSxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFBLEFBQ3RCLHlCQUFVLENBQ1Ysd0JBQVMsQ0FDVCx3QkFBUyxDQUNULDBCQUFXLENBQ1gseUJBQVUsQ0FDViw4QkFBZSxDQUFBLEFBQ1gsS0FBSyxDQUFFLElBQUksQUFDZixDQUFBLEFBQ0osQ0FBQSxBQUVDLE1BQU0sQUFBQyxZQUFZLEtBQUssQ0FBQyxBQUFDLENBQUEsQUFDdkIseUJBQVUsQ0FDVix3QkFBUyxDQUNULHdCQUFTLENBQ1QsMEJBQVcsQ0FDWCx5QkFBVSxDQUNWLGVBQWUsZUFBQyxDQUFBLEFBQ1osS0FBSyxDQUFFLElBQUksQUFDZixDQUFBLEFBQ0osQ0FBQSxBQUVBLE1BQU0sQUFBQyxZQUFZLEtBQUssQ0FBQyxBQUFDLENBQUEsQUFDdEIseUJBQVUsQ0FDVix3QkFBUyxDQUNULHdCQUFTLENBQ1QsMEJBQVcsQ0FDWCx5QkFBVSxDQUNWLGVBQWUsZUFBQyxDQUFBLEFBQ1osS0FBSyxDQUFFLElBQUksQUFDZixDQUFBLEFBQ0osQ0FBQSxBQUVBLGdCQUFnQixlQUFDLENBQUEsQUFDYixVQUFVLENBQUUsS0FBSyxDQUNqQixVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFBLEFBRUEsZ0JBQWdCLGVBQUMsQ0FBQSxBQUNiLFVBQVUsQ0FBRSxDQUFDLEFBQ2pCLENBQUEsQUFFQSxjQUFjLGVBQUMsQ0FBQSxBQUNYLE9BQU8sQ0FBRSxHQUFHLENBQ1osS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGdCQUFnQixDQUFFLE9BQU8sQUFDN0IsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJGaWxsSW5UaGVCbGFua3NUb29sYmFyLnN2ZWx0ZSJdfQ== */";
    	append_dev(document.head, style);
    }

    // (140:8) {#if type == "1"}
    function create_if_block_14(ctx) {
    	let div76;
    	let div34;
    	let div1;
    	let div0;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let button4;
    	let t10;
    	let button5;
    	let t12;
    	let div3;
    	let div2;
    	let t13;
    	let div5;
    	let div4;
    	let t14;
    	let div7;
    	let div6;
    	let t15;
    	let div9;
    	let div8;
    	let t16;
    	let button6;
    	let t18;
    	let button7;
    	let t20;
    	let div11;
    	let div10;
    	let t21;
    	let div13;
    	let div12;
    	let t22;
    	let button8;
    	let t24;
    	let div15;
    	let div14;
    	let t25;
    	let div17;
    	let div16;
    	let t26;
    	let div19;
    	let div18;
    	let t27;
    	let button9;
    	let t29;
    	let div21;
    	let div20;
    	let t30;
    	let div23;
    	let div22;
    	let t31;
    	let div25;
    	let div24;
    	let t32;
    	let div27;
    	let div26;
    	let t33;
    	let div29;
    	let div28;
    	let t34;
    	let button10;
    	let t36;
    	let button11;
    	let t38;
    	let button12;
    	let t40;
    	let button13;
    	let t42;
    	let button14;
    	let t44;
    	let button15;
    	let t46;
    	let button16;
    	let t48;
    	let button17;
    	let t50;
    	let div31;
    	let div30;
    	let t51;
    	let button18;
    	let t53;
    	let div33;
    	let div32;
    	let t54;
    	let button19;
    	let t56;
    	let button20;
    	let t58;
    	let button21;
    	let t60;
    	let div47;
    	let div36;
    	let div35;
    	let t61;
    	let div38;
    	let div37;
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
    	let button27;
    	let t74;
    	let div40;
    	let div39;
    	let t75;
    	let button28;
    	let t77;
    	let button29;
    	let t79;
    	let button30;
    	let t81;
    	let div42;
    	let div41;
    	let t82;
    	let button31;
    	let t84;
    	let button32;
    	let t86;
    	let button33;
    	let t88;
    	let button34;
    	let t90;
    	let div44;
    	let div43;
    	let t91;
    	let button35;
    	let t93;
    	let button36;
    	let t95;
    	let button37;
    	let t97;
    	let button38;
    	let t99;
    	let div46;
    	let div45;
    	let t100;
    	let button39;
    	let t102;
    	let button40;
    	let t104;
    	let button41;
    	let t106;
    	let button42;
    	let t108;
    	let button43;
    	let t110;
    	let button44;
    	let t112;
    	let button45;
    	let t114;
    	let button46;
    	let t116;
    	let button47;
    	let t118;
    	let button48;
    	let t120;
    	let button49;
    	let t122;
    	let button50;
    	let t124;
    	let button51;
    	let t126;
    	let button52;
    	let t128;
    	let button53;
    	let t130;
    	let button54;
    	let t132;
    	let div66;
    	let div49;
    	let div48;
    	let t133;
    	let div51;
    	let div50;
    	let t134;
    	let button55;
    	let t136;
    	let div53;
    	let div52;
    	let t137;
    	let div55;
    	let div54;
    	let t138;
    	let button56;
    	let t140;
    	let button57;
    	let t142;
    	let button58;
    	let t144;
    	let button59;
    	let t146;
    	let div57;
    	let div56;
    	let t147;
    	let button60;
    	let t149;
    	let button61;
    	let t151;
    	let button62;
    	let t153;
    	let button63;
    	let t155;
    	let div59;
    	let div58;
    	let t156;
    	let button64;
    	let t158;
    	let button65;
    	let t160;
    	let button66;
    	let t162;
    	let button67;
    	let t164;
    	let div61;
    	let div60;
    	let t165;
    	let button68;
    	let t166;
    	let sup0;
    	let t168;
    	let button69;
    	let t169;
    	let sup1;
    	let t171;
    	let button70;
    	let t172;
    	let sup2;
    	let t174;
    	let button71;
    	let t176;
    	let button72;
    	let t178;
    	let button73;
    	let t180;
    	let button74;
    	let t181;
    	let sup3;
    	let t183;
    	let button75;
    	let t184;
    	let sup4;
    	let t186;
    	let button76;
    	let t187;
    	let sup5;
    	let t189;
    	let button77;
    	let t191;
    	let button78;
    	let t193;
    	let button79;
    	let t195;
    	let button80;
    	let t197;
    	let button81;
    	let t199;
    	let div63;
    	let div62;
    	let t200;
    	let button82;
    	let t202;
    	let div65;
    	let div64;
    	let t203;
    	let button83;
    	let t204;
    	let sup6;
    	let t206;
    	let button84;
    	let t208;
    	let div75;
    	let div68;
    	let div67;
    	let t209;
    	let div70;
    	let div69;
    	let t210;
    	let div72;
    	let div71;
    	let t211;
    	let div74;
    	let div73;
    	let t212;
    	let button85;
    	let t214;
    	let button86;
    	let t216;
    	let button87;
    	let t218;
    	let button88;
    	let t219;
    	let sup7;
    	let t221;
    	let button89;
    	let t222;
    	let sup8;
    	let t224;
    	let button90;
    	let t225;
    	let sup9;
    	let t227;
    	let button91;
    	let t229;
    	let button92;
    	let t231;
    	let button93;
    	let t233;
    	let button94;
    	let t235;
    	let button95;
    	let t237;
    	let button96;
    	let t239;
    	let button97;
    	let t241;
    	let button98;
    	let t243;
    	let button99;
    	let t245;
    	let button100;
    	let t247;
    	let button101;
    	let t249;
    	let button102;
    	let t251;
    	let button103;
    	let t253;
    	let button104;
    	let t255;
    	let button105;
    	let t257;
    	let button106;
    	let t259;
    	let button107;
    	let t261;
    	let button108;
    	let t263;
    	let button109;
    	let t265;
    	let button110;
    	let t267;
    	let button111;
    	let t269;
    	let button112;
    	let t271;
    	let button113;
    	let t273;
    	let button114;
    	let t275;
    	let button115;
    	let t277;
    	let button116;
    	let t279;
    	let button117;
    	let t281;
    	let button118;
    	let t283;
    	let button119;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div76 = element("div");
    			div34 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "b";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "abc";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "$";
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "÷";
    			t8 = space();
    			button4 = element("button");
    			button4.textContent = "≥";
    			t10 = space();
    			button5 = element("button");
    			button5.textContent = "⊥";
    			t12 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t13 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t14 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t15 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t16 = space();
    			button6 = element("button");
    			button6.textContent = "<";
    			t18 = space();
    			button7 = element("button");
    			button7.textContent = "π";
    			t20 = space();
    			div11 = element("div");
    			div10 = element("div");
    			t21 = space();
    			div13 = element("div");
    			div12 = element("div");
    			t22 = space();
    			button8 = element("button");
    			button8.textContent = ">";
    			t24 = space();
    			div15 = element("div");
    			div14 = element("div");
    			t25 = space();
    			div17 = element("div");
    			div16 = element("div");
    			t26 = space();
    			div19 = element("div");
    			div18 = element("div");
    			t27 = space();
    			button9 = element("button");
    			button9.textContent = "±";
    			t29 = space();
    			div21 = element("div");
    			div20 = element("div");
    			t30 = space();
    			div23 = element("div");
    			div22 = element("div");
    			t31 = space();
    			div25 = element("div");
    			div24 = element("div");
    			t32 = space();
    			div27 = element("div");
    			div26 = element("div");
    			t33 = space();
    			div29 = element("div");
    			div28 = element("div");
    			t34 = space();
    			button10 = element("button");
    			button10.textContent = "a";
    			t36 = space();
    			button11 = element("button");
    			button11.textContent = "|";
    			t38 = space();
    			button12 = element("button");
    			button12.textContent = "⌈";
    			t40 = space();
    			button13 = element("button");
    			button13.textContent = "∧";
    			t42 = space();
    			button14 = element("button");
    			button14.textContent = "∀";
    			t44 = space();
    			button15 = element("button");
    			button15.textContent = "mi";
    			t46 = space();
    			button16 = element("button");
    			button16.textContent = "gal";
    			t48 = space();
    			button17 = element("button");
    			button17.textContent = "f";
    			t50 = space();
    			div31 = element("div");
    			div30 = element("div");
    			t51 = space();
    			button18 = element("button");
    			button18.textContent = "Δ";
    			t53 = space();
    			div33 = element("div");
    			div32 = element("div");
    			t54 = space();
    			button19 = element("button");
    			button19.textContent = "⇌";
    			t56 = space();
    			button20 = element("button");
    			button20.textContent = "'";
    			t58 = space();
    			button21 = element("button");
    			button21.textContent = "µg";
    			t60 = space();
    			div47 = element("div");
    			div36 = element("div");
    			div35 = element("div");
    			t61 = space();
    			div38 = element("div");
    			div37 = element("div");
    			t62 = space();
    			button22 = element("button");
    			button22.textContent = ">";
    			t64 = space();
    			button23 = element("button");
    			button23.textContent = "°";
    			t66 = space();
    			button24 = element("button");
    			button24.textContent = "π";
    			t68 = space();
    			button25 = element("button");
    			button25.textContent = "≠";
    			t70 = space();
    			button26 = element("button");
    			button26.textContent = "<";
    			t72 = space();
    			button27 = element("button");
    			button27.textContent = "≤";
    			t74 = space();
    			div40 = element("div");
    			div39 = element("div");
    			t75 = space();
    			button28 = element("button");
    			button28.textContent = "≈";
    			t77 = space();
    			button29 = element("button");
    			button29.textContent = ">";
    			t79 = space();
    			button30 = element("button");
    			button30.textContent = "≥";
    			t81 = space();
    			div42 = element("div");
    			div41 = element("div");
    			t82 = space();
    			button31 = element("button");
    			button31.textContent = "⊥";
    			t84 = space();
    			button32 = element("button");
    			button32.textContent = "∠";
    			t86 = space();
    			button33 = element("button");
    			button33.textContent = "Δ";
    			t88 = space();
    			button34 = element("button");
    			button34.textContent = "°";
    			t90 = space();
    			div44 = element("div");
    			div43 = element("div");
    			t91 = space();
    			button35 = element("button");
    			button35.textContent = "∥";
    			t93 = space();
    			button36 = element("button");
    			button36.textContent = "m∠";
    			t95 = space();
    			button37 = element("button");
    			button37.textContent = "⊙";
    			t97 = space();
    			button38 = element("button");
    			button38.textContent = "′";
    			t99 = space();
    			div46 = element("div");
    			div45 = element("div");
    			t100 = space();
    			button39 = element("button");
    			button39.textContent = "∦";
    			t102 = space();
    			button40 = element("button");
    			button40.textContent = "∼";
    			t104 = space();
    			button41 = element("button");
    			button41.textContent = "▱";
    			t106 = space();
    			button42 = element("button");
    			button42.textContent = "″";
    			t108 = space();
    			button43 = element("button");
    			button43.textContent = "⋯";
    			t110 = space();
    			button44 = element("button");
    			button44.textContent = "⋱";
    			t112 = space();
    			button45 = element("button");
    			button45.textContent = "≅";
    			t114 = space();
    			button46 = element("button");
    			button46.textContent = "⋮";
    			t116 = space();
    			button47 = element("button");
    			button47.textContent = "π";
    			t118 = space();
    			button48 = element("button");
    			button48.textContent = "□";
    			t120 = space();
    			button49 = element("button");
    			button49.textContent = "∝";
    			t122 = space();
    			button50 = element("button");
    			button50.textContent = "⌋";
    			t124 = space();
    			button51 = element("button");
    			button51.textContent = "≡";
    			t126 = space();
    			button52 = element("button");
    			button52.textContent = "∃";
    			t128 = space();
    			button53 = element("button");
    			button53.textContent = "mg";
    			t130 = space();
    			button54 = element("button");
    			button54.textContent = "cm";
    			t132 = space();
    			div66 = element("div");
    			div49 = element("div");
    			div48 = element("div");
    			t133 = space();
    			div51 = element("div");
    			div50 = element("div");
    			t134 = space();
    			button55 = element("button");
    			button55.textContent = "±";
    			t136 = space();
    			div53 = element("div");
    			div52 = element("div");
    			t137 = space();
    			div55 = element("div");
    			div54 = element("div");
    			t138 = space();
    			button56 = element("button");
    			button56.textContent = "⊂";
    			t140 = space();
    			button57 = element("button");
    			button57.textContent = "∊";
    			t142 = space();
    			button58 = element("button");
    			button58.textContent = "∪";
    			t144 = space();
    			button59 = element("button");
    			button59.textContent = ",";
    			t146 = space();
    			div57 = element("div");
    			div56 = element("div");
    			t147 = space();
    			button60 = element("button");
    			button60.textContent = "⊃";
    			t149 = space();
    			button61 = element("button");
    			button61.textContent = "∉";
    			t151 = space();
    			button62 = element("button");
    			button62.textContent = "∩";
    			t153 = space();
    			button63 = element("button");
    			button63.textContent = ":";
    			t155 = space();
    			div59 = element("div");
    			div58 = element("div");
    			t156 = space();
    			button64 = element("button");
    			button64.textContent = "⊆";
    			t158 = space();
    			button65 = element("button");
    			button65.textContent = "∍";
    			t160 = space();
    			button66 = element("button");
    			button66.textContent = "∅";
    			t162 = space();
    			button67 = element("button");
    			button67.textContent = "!";
    			t164 = space();
    			div61 = element("div");
    			div60 = element("div");
    			t165 = space();
    			button68 = element("button");
    			t166 = text("sec");
    			sup0 = element("sup");
    			sup0.textContent = "-1";
    			t168 = space();
    			button69 = element("button");
    			t169 = text("csc");
    			sup1 = element("sup");
    			sup1.textContent = "-1";
    			t171 = space();
    			button70 = element("button");
    			t172 = text("cot");
    			sup2 = element("sup");
    			sup2.textContent = "-1";
    			t174 = space();
    			button71 = element("button");
    			button71.textContent = "sin";
    			t176 = space();
    			button72 = element("button");
    			button72.textContent = "cos";
    			t178 = space();
    			button73 = element("button");
    			button73.textContent = "tan";
    			t180 = space();
    			button74 = element("button");
    			t181 = text("sec");
    			sup3 = element("sup");
    			sup3.textContent = "-1";
    			t183 = space();
    			button75 = element("button");
    			t184 = text("csc");
    			sup4 = element("sup");
    			sup4.textContent = "-1";
    			t186 = space();
    			button76 = element("button");
    			t187 = text("cot");
    			sup5 = element("sup");
    			sup5.textContent = "-1";
    			t189 = space();
    			button77 = element("button");
    			button77.textContent = "b";
    			t191 = space();
    			button78 = element("button");
    			button78.textContent = ".";
    			t193 = space();
    			button79 = element("button");
    			button79.textContent = "lb";
    			t195 = space();
    			button80 = element("button");
    			button80.textContent = "ft";
    			t197 = space();
    			button81 = element("button");
    			button81.textContent = "pt";
    			t199 = space();
    			div63 = element("div");
    			div62 = element("div");
    			t200 = space();
    			button82 = element("button");
    			button82.textContent = "→";
    			t202 = space();
    			div65 = element("div");
    			div64 = element("div");
    			t203 = space();
    			button83 = element("button");
    			t204 = text("g mol");
    			sup6 = element("sup");
    			sup6.textContent = "-1";
    			t206 = space();
    			button84 = element("button");
    			button84.textContent = "∂";
    			t208 = space();
    			div75 = element("div");
    			div68 = element("div");
    			div67 = element("div");
    			t209 = space();
    			div70 = element("div");
    			div69 = element("div");
    			t210 = space();
    			div72 = element("div");
    			div71 = element("div");
    			t211 = space();
    			div74 = element("div");
    			div73 = element("div");
    			t212 = space();
    			button85 = element("button");
    			button85.textContent = "sec";
    			t214 = space();
    			button86 = element("button");
    			button86.textContent = "csc";
    			t216 = space();
    			button87 = element("button");
    			button87.textContent = "cot";
    			t218 = space();
    			button88 = element("button");
    			t219 = text("sin");
    			sup7 = element("sup");
    			sup7.textContent = "-1";
    			t221 = space();
    			button89 = element("button");
    			t222 = text("cos");
    			sup8 = element("sup");
    			sup8.textContent = "-1";
    			t224 = space();
    			button90 = element("button");
    			t225 = text("tan");
    			sup9 = element("sup");
    			sup9.textContent = "-1";
    			t227 = space();
    			button91 = element("button");
    			button91.textContent = "α";
    			t229 = space();
    			button92 = element("button");
    			button92.textContent = "θ";
    			t231 = space();
    			button93 = element("button");
    			button93.textContent = "Θ";
    			t233 = space();
    			button94 = element("button");
    			button94.textContent = "ζ";
    			t235 = space();
    			button95 = element("button");
    			button95.textContent = "γ";
    			t237 = space();
    			button96 = element("button");
    			button96.textContent = "σ";
    			t239 = space();
    			button97 = element("button");
    			button97.textContent = "Σ";
    			t241 = space();
    			button98 = element("button");
    			button98.textContent = "ε";
    			t243 = space();
    			button99 = element("button");
    			button99.textContent = "δ";
    			t245 = space();
    			button100 = element("button");
    			button100.textContent = "Δ";
    			t247 = space();
    			button101 = element("button");
    			button101.textContent = "λ";
    			t249 = space();
    			button102 = element("button");
    			button102.textContent = "β";
    			t251 = space();
    			button103 = element("button");
    			button103.textContent = "π";
    			t253 = space();
    			button104 = element("button");
    			button104.textContent = "Π";
    			t255 = space();
    			button105 = element("button");
    			button105.textContent = "∅";
    			t257 = space();
    			button106 = element("button");
    			button106.textContent = "⌊";
    			t259 = space();
    			button107 = element("button");
    			button107.textContent = "↑";
    			t261 = space();
    			button108 = element("button");
    			button108.textContent = "¬";
    			t263 = space();
    			button109 = element("button");
    			button109.textContent = "oz";
    			t265 = space();
    			button110 = element("button");
    			button110.textContent = "in";
    			t267 = space();
    			button111 = element("button");
    			button111.textContent = "fl oz";
    			t269 = space();
    			button112 = element("button");
    			button112.textContent = "g";
    			t271 = space();
    			button113 = element("button");
    			button113.textContent = "m";
    			t273 = space();
    			button114 = element("button");
    			button114.textContent = "L";
    			t275 = space();
    			button115 = element("button");
    			button115.textContent = "s";
    			t277 = space();
    			button116 = element("button");
    			button116.textContent = "kg";
    			t279 = space();
    			button117 = element("button");
    			button117.textContent = "km";
    			t281 = space();
    			button118 = element("button");
    			button118.textContent = "mL";
    			t283 = space();
    			button119 = element("button");
    			button119.textContent = "ms";
    			attr_dev(div0, "class", "xvariable svelte-1qn0my1");
    			add_location(div0, file$1, 143, 24, 7095);
    			attr_dev(div1, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div1, file$1, 142, 20, 6967);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button0, file$1, 145, 24, 7176);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "thrd_btn bborder_remover dec_widther bborder_adder blue_container svelte-1qn0my1");
    			add_location(button1, file$1, 146, 24, 7309);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button2, file$1, 147, 24, 7489);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button3, file$1, 148, 24, 7645);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button4, file$1, 149, 24, 7789);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button5, file$1, 150, 24, 7945);
    			attr_dev(div2, "class", "not-lesser svelte-1qn0my1");
    			add_location(div2, file$1, 152, 24, 8225);
    			attr_dev(div3, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div3, file$1, 151, 20, 8091);
    			attr_dev(div4, "class", "rec-brackets svelte-1qn0my1");
    			add_location(div4, file$1, 155, 24, 8430);
    			attr_dev(div5, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(div5, file$1, 154, 20, 8303);
    			attr_dev(div6, "class", "xvariable svelte-1qn0my1");
    			add_location(div6, file$1, 158, 24, 8633);
    			attr_dev(div7, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div7, file$1, 157, 20, 8510);
    			attr_dev(div8, "class", "xfraction svelte-1qn0my1");
    			add_location(div8, file$1, 161, 24, 8827);
    			attr_dev(div9, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1qn0my1");
    			add_location(div9, file$1, 160, 20, 8710);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button6, file$1, 163, 24, 8908);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button7, file$1, 164, 24, 9062);
    			attr_dev(div10, "class", "yvariable svelte-1qn0my1");
    			add_location(div10, file$1, 166, 24, 9321);
    			attr_dev(div11, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div11, file$1, 165, 20, 9198);
    			attr_dev(div12, "class", "x-times-fraction svelte-1qn0my1");
    			add_location(div12, file$1, 169, 24, 9515);
    			attr_dev(div13, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1qn0my1");
    			add_location(div13, file$1, 168, 20, 9398);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button8, file$1, 171, 24, 9603);
    			attr_dev(div14, "class", "infinity svelte-1qn0my1");
    			add_location(div14, file$1, 173, 24, 9863);
    			attr_dev(div15, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(div15, file$1, 172, 20, 9750);
    			attr_dev(div16, "class", "xsquare svelte-1qn0my1");
    			add_location(div16, file$1, 176, 24, 10084);
    			attr_dev(div17, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div17, file$1, 175, 20, 9939);
    			attr_dev(div18, "class", "xpower svelte-1qn0my1");
    			add_location(div18, file$1, 179, 24, 10286);
    			attr_dev(div19, "class", "scnd_btn dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div19, file$1, 178, 20, 10159);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button9, file$1, 181, 24, 10364);
    			attr_dev(div20, "class", "brackets svelte-1qn0my1");
    			add_location(div20, file$1, 183, 24, 10643);
    			attr_dev(div21, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(div21, file$1, 182, 20, 10516);
    			attr_dev(div22, "class", "square-root svelte-1qn0my1");
    			add_location(div22, file$1, 186, 24, 10847);
    			attr_dev(div23, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div23, file$1, 185, 20, 10719);
    			attr_dev(div24, "class", "square-root-two svelte-1qn0my1");
    			add_location(div24, file$1, 189, 24, 11060);
    			attr_dev(div25, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div25, file$1, 188, 20, 10926);
    			attr_dev(div26, "class", "modulus svelte-1qn0my1");
    			add_location(div26, file$1, 192, 24, 11266);
    			attr_dev(div27, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div27, file$1, 191, 20, 11143);
    			attr_dev(div28, "class", "square-brackets svelte-1qn0my1");
    			add_location(div28, file$1, 195, 24, 11468);
    			attr_dev(div29, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(div29, file$1, 194, 20, 11341);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button10, file$1, 197, 24, 11555);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button11, file$1, 198, 24, 11705);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button12, file$1, 199, 24, 11843);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button13, file$1, 200, 24, 12010);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button14, file$1, 201, 24, 12158);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 202, 24, 12321);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button16, file$1, 203, 24, 12469);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button17, file$1, 204, 24, 12635);
    			attr_dev(div30, "class", "integrtion svelte-1qn0my1");
    			add_location(div30, file$1, 206, 24, 12924);
    			attr_dev(div31, "class", "first_btn bborder_remover dec_widther padder_remover blue_container svelte-1qn0my1");
    			add_location(div31, file$1, 205, 20, 12769);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button18, file$1, 208, 24, 13006);
    			attr_dev(div32, "class", "sigma svelte-1qn0my1");
    			add_location(div32, file$1, 210, 24, 13303);
    			attr_dev(div33, "class", "first_btn bborder_remover dec_widther blue_container padder_btn svelte-1qn0my1");
    			add_location(div33, file$1, 209, 20, 13152);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button19, file$1, 212, 24, 13380);
    			attr_dev(button20, "type", "button");
    			attr_dev(button20, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button20, file$1, 213, 24, 13542);
    			attr_dev(button21, "type", "button");
    			attr_dev(button21, "class", "scnd_btn dec_widther bborder_remover blue_container svelte-1qn0my1");
    			add_location(button21, file$1, 214, 24, 13697);
    			attr_dev(div34, "class", "column_five dec_widther blue_container columns_design svelte-1qn0my1");
    			add_location(div34, file$1, 141, 16, 6879);
    			attr_dev(div35, "class", "yvariable svelte-1qn0my1");
    			add_location(div35, file$1, 218, 24, 14103);
    			attr_dev(div36, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div36, file$1, 217, 20, 13975);
    			attr_dev(div37, "class", "x-times-fraction svelte-1qn0my1");
    			add_location(div37, file$1, 221, 24, 14297);
    			attr_dev(div38, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1qn0my1");
    			add_location(div38, file$1, 220, 20, 14180);
    			attr_dev(button22, "type", "button");
    			attr_dev(button22, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button22, file$1, 223, 24, 14385);
    			attr_dev(button23, "type", "button");
    			attr_dev(button23, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button23, file$1, 224, 24, 14536);
    			attr_dev(button24, "type", "button");
    			attr_dev(button24, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button24, file$1, 225, 24, 14687);
    			attr_dev(button25, "type", "button");
    			attr_dev(button25, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button25, file$1, 226, 24, 14842);
    			attr_dev(button26, "type", "button");
    			attr_dev(button26, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button26, file$1, 227, 24, 14981);
    			attr_dev(button27, "type", "button");
    			attr_dev(button27, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button27, file$1, 228, 24, 15135);
    			attr_dev(div39, "class", "not-greater svelte-1qn0my1");
    			add_location(div39, file$1, 230, 24, 15405);
    			attr_dev(div40, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div40, file$1, 229, 20, 15272);
    			attr_dev(button28, "type", "button");
    			attr_dev(button28, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button28, file$1, 232, 24, 15488);
    			attr_dev(button29, "type", "button");
    			attr_dev(button29, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button29, file$1, 233, 24, 15633);
    			attr_dev(button30, "type", "button");
    			attr_dev(button30, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button30, file$1, 234, 24, 15784);
    			attr_dev(div41, "class", "not-lesser svelte-1qn0my1");
    			add_location(div41, file$1, 236, 24, 16055);
    			attr_dev(div42, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div42, file$1, 235, 20, 15921);
    			attr_dev(button31, "type", "button");
    			attr_dev(button31, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button31, file$1, 238, 24, 16137);
    			attr_dev(button32, "type", "button");
    			attr_dev(button32, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button32, file$1, 239, 24, 16285);
    			attr_dev(button33, "type", "button");
    			attr_dev(button33, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button33, file$1, 240, 24, 16449);
    			attr_dev(button34, "type", "button");
    			attr_dev(button34, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button34, file$1, 241, 24, 16604);
    			attr_dev(div43, "class", "bar-block svelte-1qn0my1");
    			add_location(div43, file$1, 243, 24, 16904);
    			attr_dev(div44, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div44, file$1, 242, 20, 16766);
    			attr_dev(button35, "type", "button");
    			attr_dev(button35, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button35, file$1, 245, 24, 16985);
    			attr_dev(button36, "type", "button");
    			attr_dev(button36, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button36, file$1, 246, 24, 17149);
    			attr_dev(button37, "type", "button");
    			attr_dev(button37, "class", "thrd_btn bborder_remover dec_widther blue_container bborder_adder svelte-1qn0my1");
    			add_location(button37, file$1, 247, 24, 17306);
    			attr_dev(button38, "type", "button");
    			attr_dev(button38, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button38, file$1, 248, 24, 17484);
    			attr_dev(div45, "class", "topbar-arrow svelte-1qn0my1");
    			add_location(div45, file$1, 250, 24, 17789);
    			attr_dev(div46, "class", "fourth_btn dec_widther padder_remover blue_container svelte-1qn0my1");
    			add_location(div46, file$1, 249, 20, 17642);
    			attr_dev(button39, "type", "button");
    			attr_dev(button39, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button39, file$1, 252, 24, 17873);
    			attr_dev(button40, "type", "button");
    			attr_dev(button40, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button40, file$1, 253, 24, 18039);
    			attr_dev(button41, "type", "button");
    			attr_dev(button41, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button41, file$1, 254, 24, 18180);
    			attr_dev(button42, "type", "button");
    			attr_dev(button42, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button42, file$1, 255, 24, 18349);
    			attr_dev(button43, "type", "button");
    			attr_dev(button43, "class", "first_btn bborder_remover dec_widther padder_remover blue_container svelte-1qn0my1");
    			add_location(button43, file$1, 256, 24, 18496);
    			attr_dev(button44, "type", "button");
    			attr_dev(button44, "class", "scnd_btn dec_widther blue_container blue_container padder_less svelte-1qn0my1");
    			add_location(button44, file$1, 257, 24, 18678);
    			attr_dev(button45, "type", "button");
    			attr_dev(button45, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button45, file$1, 258, 24, 18855);
    			attr_dev(button46, "type", "button");
    			attr_dev(button46, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button46, file$1, 259, 24, 19014);
    			attr_dev(button47, "type", "button");
    			attr_dev(button47, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button47, file$1, 260, 24, 19166);
    			attr_dev(button48, "type", "button");
    			attr_dev(button48, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button48, file$1, 261, 24, 19322);
    			attr_dev(button49, "type", "button");
    			attr_dev(button49, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button49, file$1, 262, 24, 19470);
    			attr_dev(button50, "type", "button");
    			attr_dev(button50, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button50, file$1, 263, 24, 19637);
    			attr_dev(button51, "type", "button");
    			attr_dev(button51, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button51, file$1, 264, 24, 19789);
    			attr_dev(button52, "type", "button");
    			attr_dev(button52, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button52, file$1, 265, 24, 19950);
    			attr_dev(button53, "type", "button");
    			attr_dev(button53, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button53, file$1, 266, 24, 20096);
    			attr_dev(button54, "type", "button");
    			attr_dev(button54, "class", "scnd_btn dec_widther bborder_remover blue_container svelte-1qn0my1");
    			add_location(button54, file$1, 267, 24, 20261);
    			attr_dev(div47, "class", "column_six dec_widther blue_container columns_design svelte-1qn0my1");
    			add_location(div47, file$1, 216, 16, 13888);
    			attr_dev(div48, "class", "xsquare svelte-1qn0my1");
    			add_location(div48, file$1, 271, 24, 20674);
    			attr_dev(div49, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div49, file$1, 270, 20, 20529);
    			attr_dev(div50, "class", "xpower svelte-1qn0my1");
    			add_location(div50, file$1, 274, 24, 20879);
    			attr_dev(div51, "class", "scnd_btn dec_widther blue_container padder_remover svelte-1qn0my1");
    			add_location(div51, file$1, 273, 20, 20749);
    			attr_dev(button55, "type", "button");
    			attr_dev(button55, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button55, file$1, 276, 24, 20957);
    			attr_dev(div52, "class", "colon svelte-1qn0my1");
    			add_location(div52, file$1, 278, 24, 21229);
    			attr_dev(div53, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div53, file$1, 277, 20, 21109);
    			attr_dev(div54, "class", "infinity svelte-1qn0my1");
    			add_location(div54, file$1, 281, 24, 21430);
    			attr_dev(div55, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(div55, file$1, 280, 20, 21302);
    			attr_dev(button56, "type", "button");
    			attr_dev(button56, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button56, file$1, 283, 24, 21510);
    			attr_dev(button57, "type", "button");
    			attr_dev(button57, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button57, file$1, 284, 24, 21659);
    			attr_dev(button58, "type", "button");
    			attr_dev(button58, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button58, file$1, 285, 24, 21817);
    			attr_dev(button59, "type", "button");
    			attr_dev(button59, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button59, file$1, 286, 24, 21960);
    			attr_dev(div56, "class", "brackets svelte-1qn0my1");
    			add_location(div56, file$1, 288, 24, 22245);
    			attr_dev(div57, "class", "fourth_btn dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div57, file$1, 287, 20, 22106);
    			attr_dev(button60, "type", "button");
    			attr_dev(button60, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button60, file$1, 290, 24, 22325);
    			attr_dev(button61, "type", "button");
    			attr_dev(button61, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button61, file$1, 291, 24, 22491);
    			attr_dev(button62, "type", "button");
    			attr_dev(button62, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button62, file$1, 292, 24, 22636);
    			attr_dev(button63, "type", "button");
    			attr_dev(button63, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button63, file$1, 293, 24, 22793);
    			attr_dev(div58, "class", "curly-brackets svelte-1qn0my1");
    			add_location(div58, file$1, 295, 24, 23087);
    			attr_dev(div59, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div59, file$1, 294, 20, 22929);
    			attr_dev(button64, "type", "button");
    			attr_dev(button64, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button64, file$1, 297, 24, 23173);
    			attr_dev(button65, "type", "button");
    			attr_dev(button65, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button65, file$1, 298, 24, 23325);
    			attr_dev(button66, "type", "button");
    			attr_dev(button66, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button66, file$1, 299, 24, 23488);
    			attr_dev(button67, "type", "button");
    			attr_dev(button67, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button67, file$1, 300, 24, 23640);
    			attr_dev(div60, "class", "rec-brackets svelte-1qn0my1");
    			add_location(div60, file$1, 302, 24, 23925);
    			attr_dev(div61, "class", "fourth_btn dec_widther padder_less blue_container svelte-1qn0my1");
    			add_location(div61, file$1, 301, 20, 23786);
    			add_location(sup0, file$1, 304, 156, 24141);
    			attr_dev(button68, "type", "button");
    			attr_dev(button68, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button68, file$1, 304, 24, 24009);
    			add_location(sup1, file$1, 305, 139, 24303);
    			attr_dev(button69, "type", "button");
    			attr_dev(button69, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button69, file$1, 305, 24, 24188);
    			add_location(sup2, file$1, 306, 155, 24481);
    			attr_dev(button70, "type", "button");
    			attr_dev(button70, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button70, file$1, 306, 24, 24350);
    			attr_dev(button71, "type", "button");
    			attr_dev(button71, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button71, file$1, 307, 24, 24528);
    			attr_dev(button72, "type", "button");
    			attr_dev(button72, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button72, file$1, 308, 24, 24671);
    			attr_dev(button73, "type", "button");
    			attr_dev(button73, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button73, file$1, 309, 24, 24825);
    			add_location(sup3, file$1, 310, 156, 25101);
    			attr_dev(button74, "type", "button");
    			attr_dev(button74, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button74, file$1, 310, 24, 24969);
    			add_location(sup4, file$1, 311, 139, 25263);
    			attr_dev(button75, "type", "button");
    			attr_dev(button75, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button75, file$1, 311, 24, 25148);
    			add_location(sup5, file$1, 312, 155, 25441);
    			attr_dev(button76, "type", "button");
    			attr_dev(button76, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button76, file$1, 312, 24, 25310);
    			attr_dev(button77, "type", "button");
    			attr_dev(button77, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button77, file$1, 313, 24, 25489);
    			attr_dev(button78, "type", "button");
    			attr_dev(button78, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button78, file$1, 314, 24, 25622);
    			attr_dev(button79, "type", "button");
    			attr_dev(button79, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button79, file$1, 315, 24, 25782);
    			attr_dev(button80, "type", "button");
    			attr_dev(button80, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button80, file$1, 316, 24, 25930);
    			attr_dev(button81, "type", "button");
    			attr_dev(button81, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button81, file$1, 317, 24, 26094);
    			attr_dev(div62, "class", "h-sup svelte-1qn0my1");
    			add_location(div62, file$1, 319, 24, 26381);
    			attr_dev(div63, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div63, file$1, 318, 20, 26238);
    			attr_dev(button82, "type", "button");
    			attr_dev(button82, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button82, file$1, 321, 24, 26458);
    			attr_dev(div64, "class", "x-power-y svelte-1qn0my1");
    			add_location(div64, file$1, 323, 24, 26760);
    			attr_dev(div65, "class", "thrd_btn bborder_remover dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div65, file$1, 322, 20, 26603);
    			add_location(sup6, file$1, 325, 160, 26977);
    			attr_dev(button83, "type", "button");
    			attr_dev(button83, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button83, file$1, 325, 24, 26841);
    			attr_dev(button84, "type", "button");
    			attr_dev(button84, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button84, file$1, 326, 24, 27024);
    			attr_dev(div66, "class", "column_seven dec_widther blue_container columns_design svelte-1qn0my1");
    			add_location(div66, file$1, 269, 16, 20440);
    			attr_dev(div67, "class", "square-root svelte-1qn0my1");
    			add_location(div67, file$1, 330, 24, 27436);
    			attr_dev(div68, "class", "first_btn bborder_remover dec_widther blue_container padder_field svelte-1qn0my1");
    			add_location(div68, file$1, 329, 20, 27295);
    			attr_dev(div69, "class", "xsubscript svelte-1qn0my1");
    			add_location(div69, file$1, 333, 24, 27642);
    			attr_dev(div70, "class", "scnd_btn dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div70, file$1, 332, 20, 27515);
    			attr_dev(div71, "class", "dollar svelte-1qn0my1");
    			add_location(div71, file$1, 336, 24, 27859);
    			attr_dev(div72, "class", "thrd_btn bborder_remover dec_widther blue_container padder_less svelte-1qn0my1");
    			add_location(div72, file$1, 335, 20, 27720);
    			attr_dev(div73, "class", "brackets svelte-1qn0my1");
    			add_location(div73, file$1, 339, 24, 28073);
    			attr_dev(div74, "class", "fourth_btn dec_widther blue_container padder_field svelte-1qn0my1");
    			add_location(div74, file$1, 338, 20, 27933);
    			attr_dev(button85, "type", "button");
    			attr_dev(button85, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button85, file$1, 341, 24, 28153);
    			attr_dev(button86, "type", "button");
    			attr_dev(button86, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button86, file$1, 342, 24, 28313);
    			attr_dev(button87, "type", "button");
    			attr_dev(button87, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button87, file$1, 343, 24, 28456);
    			add_location(sup7, file$1, 344, 139, 28725);
    			attr_dev(button88, "type", "button");
    			attr_dev(button88, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button88, file$1, 344, 24, 28610);
    			add_location(sup8, file$1, 345, 155, 28903);
    			attr_dev(button89, "type", "button");
    			attr_dev(button89, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button89, file$1, 345, 24, 28772);
    			add_location(sup9, file$1, 346, 139, 29065);
    			attr_dev(button90, "type", "button");
    			attr_dev(button90, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button90, file$1, 346, 24, 28950);
    			attr_dev(button91, "type", "button");
    			attr_dev(button91, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button91, file$1, 347, 24, 29112);
    			attr_dev(button92, "type", "button");
    			attr_dev(button92, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button92, file$1, 348, 24, 29279);
    			attr_dev(button93, "type", "button");
    			attr_dev(button93, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button93, file$1, 349, 24, 29424);
    			attr_dev(button94, "type", "button");
    			attr_dev(button94, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button94, file$1, 350, 24, 29584);
    			attr_dev(button95, "type", "button");
    			attr_dev(button95, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button95, file$1, 351, 24, 29728);
    			attr_dev(button96, "type", "button");
    			attr_dev(button96, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button96, file$1, 352, 24, 29895);
    			attr_dev(button97, "type", "button");
    			attr_dev(button97, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button97, file$1, 353, 24, 30040);
    			attr_dev(button98, "type", "button");
    			attr_dev(button98, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button98, file$1, 354, 24, 30200);
    			attr_dev(button99, "type", "button");
    			attr_dev(button99, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button99, file$1, 355, 24, 30359);
    			attr_dev(button100, "type", "button");
    			attr_dev(button100, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button100, file$1, 356, 24, 30526);
    			attr_dev(button101, "type", "button");
    			attr_dev(button101, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button101, file$1, 357, 24, 30676);
    			attr_dev(button102, "type", "button");
    			attr_dev(button102, "class", "fourth_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button102, file$1, 358, 24, 30839);
    			attr_dev(button103, "type", "button");
    			attr_dev(button103, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button103, file$1, 359, 24, 30984);
    			attr_dev(button104, "type", "button");
    			attr_dev(button104, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button104, file$1, 360, 24, 31140);
    			attr_dev(button105, "type", "button");
    			attr_dev(button105, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button105, file$1, 361, 24, 31284);
    			attr_dev(button106, "type", "button");
    			attr_dev(button106, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button106, file$1, 362, 24, 31448);
    			attr_dev(button107, "type", "button");
    			attr_dev(button107, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button107, file$1, 363, 24, 31600);
    			attr_dev(button108, "type", "button");
    			attr_dev(button108, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button108, file$1, 364, 24, 31762);
    			attr_dev(button109, "type", "button");
    			attr_dev(button109, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button109, file$1, 365, 24, 31903);
    			attr_dev(button110, "type", "button");
    			attr_dev(button110, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button110, file$1, 366, 24, 32068);
    			attr_dev(button111, "type", "button");
    			attr_dev(button111, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button111, file$1, 367, 24, 32216);
    			attr_dev(button112, "type", "button");
    			attr_dev(button112, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button112, file$1, 368, 24, 32387);
    			attr_dev(button113, "type", "button");
    			attr_dev(button113, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button113, file$1, 369, 24, 32533);
    			attr_dev(button114, "type", "button");
    			attr_dev(button114, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button114, file$1, 370, 24, 32696);
    			attr_dev(button115, "type", "button");
    			attr_dev(button115, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button115, file$1, 371, 24, 32842);
    			attr_dev(button116, "type", "button");
    			attr_dev(button116, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button116, file$1, 372, 24, 33005);
    			attr_dev(button117, "type", "button");
    			attr_dev(button117, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button117, file$1, 373, 24, 33153);
    			attr_dev(button118, "type", "button");
    			attr_dev(button118, "class", "scnd_btn dec_widther blue_container svelte-1qn0my1");
    			add_location(button118, file$1, 374, 24, 33318);
    			attr_dev(button119, "type", "button");
    			attr_dev(button119, "class", "first_btn bborder_remover dec_widther blue_container svelte-1qn0my1");
    			add_location(button119, file$1, 375, 24, 33466);
    			attr_dev(div75, "class", "column_eight dec_widther columns_design blue_container svelte-1qn0my1");
    			add_location(div75, file$1, 328, 16, 27206);
    			attr_dev(div76, "class", "button_designs select_changer height_modifier svelte-1qn0my1");
    			attr_dev(div76, "id", "select_butns_1");
    			add_location(div76, file$1, 140, 12, 6783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div76, anchor);
    			append_dev(div76, div34);
    			append_dev(div34, div1);
    			append_dev(div1, div0);
    			append_dev(div34, t0);
    			append_dev(div34, button0);
    			append_dev(div34, t2);
    			append_dev(div34, button1);
    			append_dev(div34, t4);
    			append_dev(div34, button2);
    			append_dev(div34, t6);
    			append_dev(div34, button3);
    			append_dev(div34, t8);
    			append_dev(div34, button4);
    			append_dev(div34, t10);
    			append_dev(div34, button5);
    			append_dev(div34, t12);
    			append_dev(div34, div3);
    			append_dev(div3, div2);
    			append_dev(div34, t13);
    			append_dev(div34, div5);
    			append_dev(div5, div4);
    			append_dev(div34, t14);
    			append_dev(div34, div7);
    			append_dev(div7, div6);
    			append_dev(div34, t15);
    			append_dev(div34, div9);
    			append_dev(div9, div8);
    			append_dev(div34, t16);
    			append_dev(div34, button6);
    			append_dev(div34, t18);
    			append_dev(div34, button7);
    			append_dev(div34, t20);
    			append_dev(div34, div11);
    			append_dev(div11, div10);
    			append_dev(div34, t21);
    			append_dev(div34, div13);
    			append_dev(div13, div12);
    			append_dev(div34, t22);
    			append_dev(div34, button8);
    			append_dev(div34, t24);
    			append_dev(div34, div15);
    			append_dev(div15, div14);
    			append_dev(div34, t25);
    			append_dev(div34, div17);
    			append_dev(div17, div16);
    			append_dev(div34, t26);
    			append_dev(div34, div19);
    			append_dev(div19, div18);
    			append_dev(div34, t27);
    			append_dev(div34, button9);
    			append_dev(div34, t29);
    			append_dev(div34, div21);
    			append_dev(div21, div20);
    			append_dev(div34, t30);
    			append_dev(div34, div23);
    			append_dev(div23, div22);
    			append_dev(div34, t31);
    			append_dev(div34, div25);
    			append_dev(div25, div24);
    			append_dev(div34, t32);
    			append_dev(div34, div27);
    			append_dev(div27, div26);
    			append_dev(div34, t33);
    			append_dev(div34, div29);
    			append_dev(div29, div28);
    			append_dev(div34, t34);
    			append_dev(div34, button10);
    			append_dev(div34, t36);
    			append_dev(div34, button11);
    			append_dev(div34, t38);
    			append_dev(div34, button12);
    			append_dev(div34, t40);
    			append_dev(div34, button13);
    			append_dev(div34, t42);
    			append_dev(div34, button14);
    			append_dev(div34, t44);
    			append_dev(div34, button15);
    			append_dev(div34, t46);
    			append_dev(div34, button16);
    			append_dev(div34, t48);
    			append_dev(div34, button17);
    			append_dev(div34, t50);
    			append_dev(div34, div31);
    			append_dev(div31, div30);
    			append_dev(div34, t51);
    			append_dev(div34, button18);
    			append_dev(div34, t53);
    			append_dev(div34, div33);
    			append_dev(div33, div32);
    			append_dev(div34, t54);
    			append_dev(div34, button19);
    			append_dev(div34, t56);
    			append_dev(div34, button20);
    			append_dev(div34, t58);
    			append_dev(div34, button21);
    			append_dev(div76, t60);
    			append_dev(div76, div47);
    			append_dev(div47, div36);
    			append_dev(div36, div35);
    			append_dev(div47, t61);
    			append_dev(div47, div38);
    			append_dev(div38, div37);
    			append_dev(div47, t62);
    			append_dev(div47, button22);
    			append_dev(div47, t64);
    			append_dev(div47, button23);
    			append_dev(div47, t66);
    			append_dev(div47, button24);
    			append_dev(div47, t68);
    			append_dev(div47, button25);
    			append_dev(div47, t70);
    			append_dev(div47, button26);
    			append_dev(div47, t72);
    			append_dev(div47, button27);
    			append_dev(div47, t74);
    			append_dev(div47, div40);
    			append_dev(div40, div39);
    			append_dev(div47, t75);
    			append_dev(div47, button28);
    			append_dev(div47, t77);
    			append_dev(div47, button29);
    			append_dev(div47, t79);
    			append_dev(div47, button30);
    			append_dev(div47, t81);
    			append_dev(div47, div42);
    			append_dev(div42, div41);
    			append_dev(div47, t82);
    			append_dev(div47, button31);
    			append_dev(div47, t84);
    			append_dev(div47, button32);
    			append_dev(div47, t86);
    			append_dev(div47, button33);
    			append_dev(div47, t88);
    			append_dev(div47, button34);
    			append_dev(div47, t90);
    			append_dev(div47, div44);
    			append_dev(div44, div43);
    			append_dev(div47, t91);
    			append_dev(div47, button35);
    			append_dev(div47, t93);
    			append_dev(div47, button36);
    			append_dev(div47, t95);
    			append_dev(div47, button37);
    			append_dev(div47, t97);
    			append_dev(div47, button38);
    			append_dev(div47, t99);
    			append_dev(div47, div46);
    			append_dev(div46, div45);
    			append_dev(div47, t100);
    			append_dev(div47, button39);
    			append_dev(div47, t102);
    			append_dev(div47, button40);
    			append_dev(div47, t104);
    			append_dev(div47, button41);
    			append_dev(div47, t106);
    			append_dev(div47, button42);
    			append_dev(div47, t108);
    			append_dev(div47, button43);
    			append_dev(div47, t110);
    			append_dev(div47, button44);
    			append_dev(div47, t112);
    			append_dev(div47, button45);
    			append_dev(div47, t114);
    			append_dev(div47, button46);
    			append_dev(div47, t116);
    			append_dev(div47, button47);
    			append_dev(div47, t118);
    			append_dev(div47, button48);
    			append_dev(div47, t120);
    			append_dev(div47, button49);
    			append_dev(div47, t122);
    			append_dev(div47, button50);
    			append_dev(div47, t124);
    			append_dev(div47, button51);
    			append_dev(div47, t126);
    			append_dev(div47, button52);
    			append_dev(div47, t128);
    			append_dev(div47, button53);
    			append_dev(div47, t130);
    			append_dev(div47, button54);
    			append_dev(div76, t132);
    			append_dev(div76, div66);
    			append_dev(div66, div49);
    			append_dev(div49, div48);
    			append_dev(div66, t133);
    			append_dev(div66, div51);
    			append_dev(div51, div50);
    			append_dev(div66, t134);
    			append_dev(div66, button55);
    			append_dev(div66, t136);
    			append_dev(div66, div53);
    			append_dev(div53, div52);
    			append_dev(div66, t137);
    			append_dev(div66, div55);
    			append_dev(div55, div54);
    			append_dev(div66, t138);
    			append_dev(div66, button56);
    			append_dev(div66, t140);
    			append_dev(div66, button57);
    			append_dev(div66, t142);
    			append_dev(div66, button58);
    			append_dev(div66, t144);
    			append_dev(div66, button59);
    			append_dev(div66, t146);
    			append_dev(div66, div57);
    			append_dev(div57, div56);
    			append_dev(div66, t147);
    			append_dev(div66, button60);
    			append_dev(div66, t149);
    			append_dev(div66, button61);
    			append_dev(div66, t151);
    			append_dev(div66, button62);
    			append_dev(div66, t153);
    			append_dev(div66, button63);
    			append_dev(div66, t155);
    			append_dev(div66, div59);
    			append_dev(div59, div58);
    			append_dev(div66, t156);
    			append_dev(div66, button64);
    			append_dev(div66, t158);
    			append_dev(div66, button65);
    			append_dev(div66, t160);
    			append_dev(div66, button66);
    			append_dev(div66, t162);
    			append_dev(div66, button67);
    			append_dev(div66, t164);
    			append_dev(div66, div61);
    			append_dev(div61, div60);
    			append_dev(div66, t165);
    			append_dev(div66, button68);
    			append_dev(button68, t166);
    			append_dev(button68, sup0);
    			append_dev(div66, t168);
    			append_dev(div66, button69);
    			append_dev(button69, t169);
    			append_dev(button69, sup1);
    			append_dev(div66, t171);
    			append_dev(div66, button70);
    			append_dev(button70, t172);
    			append_dev(button70, sup2);
    			append_dev(div66, t174);
    			append_dev(div66, button71);
    			append_dev(div66, t176);
    			append_dev(div66, button72);
    			append_dev(div66, t178);
    			append_dev(div66, button73);
    			append_dev(div66, t180);
    			append_dev(div66, button74);
    			append_dev(button74, t181);
    			append_dev(button74, sup3);
    			append_dev(div66, t183);
    			append_dev(div66, button75);
    			append_dev(button75, t184);
    			append_dev(button75, sup4);
    			append_dev(div66, t186);
    			append_dev(div66, button76);
    			append_dev(button76, t187);
    			append_dev(button76, sup5);
    			append_dev(div66, t189);
    			append_dev(div66, button77);
    			append_dev(div66, t191);
    			append_dev(div66, button78);
    			append_dev(div66, t193);
    			append_dev(div66, button79);
    			append_dev(div66, t195);
    			append_dev(div66, button80);
    			append_dev(div66, t197);
    			append_dev(div66, button81);
    			append_dev(div66, t199);
    			append_dev(div66, div63);
    			append_dev(div63, div62);
    			append_dev(div66, t200);
    			append_dev(div66, button82);
    			append_dev(div66, t202);
    			append_dev(div66, div65);
    			append_dev(div65, div64);
    			append_dev(div66, t203);
    			append_dev(div66, button83);
    			append_dev(button83, t204);
    			append_dev(button83, sup6);
    			append_dev(div66, t206);
    			append_dev(div66, button84);
    			append_dev(div76, t208);
    			append_dev(div76, div75);
    			append_dev(div75, div68);
    			append_dev(div68, div67);
    			append_dev(div75, t209);
    			append_dev(div75, div70);
    			append_dev(div70, div69);
    			append_dev(div75, t210);
    			append_dev(div75, div72);
    			append_dev(div72, div71);
    			append_dev(div75, t211);
    			append_dev(div75, div74);
    			append_dev(div74, div73);
    			append_dev(div75, t212);
    			append_dev(div75, button85);
    			append_dev(div75, t214);
    			append_dev(div75, button86);
    			append_dev(div75, t216);
    			append_dev(div75, button87);
    			append_dev(div75, t218);
    			append_dev(div75, button88);
    			append_dev(button88, t219);
    			append_dev(button88, sup7);
    			append_dev(div75, t221);
    			append_dev(div75, button89);
    			append_dev(button89, t222);
    			append_dev(button89, sup8);
    			append_dev(div75, t224);
    			append_dev(div75, button90);
    			append_dev(button90, t225);
    			append_dev(button90, sup9);
    			append_dev(div75, t227);
    			append_dev(div75, button91);
    			append_dev(div75, t229);
    			append_dev(div75, button92);
    			append_dev(div75, t231);
    			append_dev(div75, button93);
    			append_dev(div75, t233);
    			append_dev(div75, button94);
    			append_dev(div75, t235);
    			append_dev(div75, button95);
    			append_dev(div75, t237);
    			append_dev(div75, button96);
    			append_dev(div75, t239);
    			append_dev(div75, button97);
    			append_dev(div75, t241);
    			append_dev(div75, button98);
    			append_dev(div75, t243);
    			append_dev(div75, button99);
    			append_dev(div75, t245);
    			append_dev(div75, button100);
    			append_dev(div75, t247);
    			append_dev(div75, button101);
    			append_dev(div75, t249);
    			append_dev(div75, button102);
    			append_dev(div75, t251);
    			append_dev(div75, button103);
    			append_dev(div75, t253);
    			append_dev(div75, button104);
    			append_dev(div75, t255);
    			append_dev(div75, button105);
    			append_dev(div75, t257);
    			append_dev(div75, button106);
    			append_dev(div75, t259);
    			append_dev(div75, button107);
    			append_dev(div75, t261);
    			append_dev(div75, button108);
    			append_dev(div75, t263);
    			append_dev(div75, button109);
    			append_dev(div75, t265);
    			append_dev(div75, button110);
    			append_dev(div75, t267);
    			append_dev(div75, button111);
    			append_dev(div75, t269);
    			append_dev(div75, button112);
    			append_dev(div75, t271);
    			append_dev(div75, button113);
    			append_dev(div75, t273);
    			append_dev(div75, button114);
    			append_dev(div75, t275);
    			append_dev(div75, button115);
    			append_dev(div75, t277);
    			append_dev(div75, button116);
    			append_dev(div75, t279);
    			append_dev(div75, button117);
    			append_dev(div75, t281);
    			append_dev(div75, button118);
    			append_dev(div75, t283);
    			append_dev(div75, button119);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "x"), false, false, false),
    					listen_dev(button0, "click", /*input*/ ctx[3].bind(this, "b"), false, false, false),
    					listen_dev(button1, "click", /*latexInput*/ ctx[2].bind(this, "\\text{abc}"), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[2].bind(this, "$"), false, false, false),
    					listen_dev(button3, "click", /*input*/ ctx[3].bind(this, "\\div"), false, false, false),
    					listen_dev(button4, "click", /*input*/ ctx[3].bind(this, "&ge;"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "\\perp"), false, false, false),
    					listen_dev(div3, "click", /*latexInput*/ ctx[2].bind(this, "\\nless"), false, false, false),
    					listen_dev(div5, "click", /*latexInput*/ ctx[2].bind(this, "\\left[\\right)"), false, false, false),
    					listen_dev(div7, "click", /*input*/ ctx[3].bind(this, "x"), false, false, false),
    					listen_dev(div9, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button6, "click", /*input*/ ctx[3].bind(this, "lt"), false, false, false),
    					listen_dev(button7, "click", /*input*/ ctx[3].bind(this, "pi"), false, false, false),
    					listen_dev(div11, "click", /*input*/ ctx[3].bind(this, "y"), false, false, false),
    					listen_dev(div13, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button8, "click", /*input*/ ctx[3].bind(this, "gt"), false, false, false),
    					listen_dev(div15, "click", /*input*/ ctx[3].bind(this, "infin"), false, false, false),
    					listen_dev(div17, "click", /*latexInput*/ ctx[2].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div19, "click", /*latexInput*/ ctx[2].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button9, "click", /*input*/ ctx[3].bind(this, "±"), false, false, false),
    					listen_dev(div21, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div23, "click", /*input*/ ctx[3].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div25, "click", /*latexInput*/ ctx[2].bind(this, "\\sqrt[]{}"), false, false, false),
    					listen_dev(div27, "click", /*input*/ ctx[3].bind(this, "|"), false, false, false),
    					listen_dev(div29, "click", /*latexInput*/ ctx[2].bind(this, "\\left[\\right]"), false, false, false),
    					listen_dev(button10, "click", /*input*/ ctx[3].bind(this, "a"), false, false, false),
    					listen_dev(button11, "click", /*input*/ ctx[3].bind(this, "\\vert"), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[2].bind(this, "\\lceil"), false, false, false),
    					listen_dev(button13, "click", /*latexInput*/ ctx[2].bind(this, "\\wedge"), false, false, false),
    					listen_dev(button14, "click", /*input*/ ctx[3].bind(this, "\\forall"), false, false, false),
    					listen_dev(button15, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mi}"), false, false, false),
    					listen_dev(button16, "click", /*latexInput*/ ctx[2].bind(this, "\\text{gal}"), false, false, false),
    					listen_dev(button17, "click", /*latexInput*/ ctx[2].bind(this, "f"), false, false, false),
    					listen_dev(div31, "click", /*latexInput*/ ctx[2].bind(this, "\\int_{ }^{ }"), false, false, false),
    					listen_dev(button18, "click", /*latexInput*/ ctx[2].bind(this, "\\Delta"), false, false, false),
    					listen_dev(div33, "click", /*latexInput*/ ctx[2].bind(this, "\\sum_{ }^{ }"), false, false, false),
    					listen_dev(button19, "click", /*latexInput*/ ctx[2].bind(this, "\\rightleftharpoons"), false, false, false),
    					listen_dev(button20, "click", /*input*/ ctx[3].bind(this, "\\prime"), false, false, false),
    					listen_dev(button21, "click", /*latexInput*/ ctx[2].bind(this, "\\text{&micro;g}"), false, false, false),
    					listen_dev(div36, "click", /*latexInput*/ ctx[2].bind(this, "y"), false, false, false),
    					listen_dev(div38, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button22, "click", /*input*/ ctx[3].bind(this, "gt"), false, false, false),
    					listen_dev(button23, "click", /*latexInput*/ ctx[2].bind(this, "\\degree"), false, false, false),
    					listen_dev(button24, "click", /*input*/ ctx[3].bind(this, "pi"), false, false, false),
    					listen_dev(button25, "click", /*input*/ ctx[3].bind(this, "&ne;"), false, false, false),
    					listen_dev(button26, "click", /*input*/ ctx[3].bind(this, "lt"), false, false, false),
    					listen_dev(button27, "click", /*input*/ ctx[3].bind(this, "&le;"), false, false, false),
    					listen_dev(div40, "click", /*latexInput*/ ctx[2].bind(this, "\\ngtr"), false, false, false),
    					listen_dev(button28, "click", /*input*/ ctx[3].bind(this, "&asymp;"), false, false, false),
    					listen_dev(button29, "click", /*input*/ ctx[3].bind(this, "gt"), false, false, false),
    					listen_dev(button30, "click", /*input*/ ctx[3].bind(this, "&ge;"), false, false, false),
    					listen_dev(div42, "click", /*latexInput*/ ctx[2].bind(this, "\\nless"), false, false, false),
    					listen_dev(button31, "click", /*latexInput*/ ctx[2].bind(this, "\\perp"), false, false, false),
    					listen_dev(button32, "click", /*latexInput*/ ctx[2].bind(this, "\\angle"), false, false, false),
    					listen_dev(button33, "click", /*latexInput*/ ctx[2].bind(this, "\\triangle"), false, false, false),
    					listen_dev(button34, "click", /*latexInput*/ ctx[2].bind(this, "\\degree"), false, false, false),
    					listen_dev(div44, "click", /*latexInput*/ ctx[2].bind(this, "\\overline{ }"), false, false, false),
    					listen_dev(button35, "click", /*input*/ ctx[3].bind(this, "parallel"), false, false, false),
    					listen_dev(button36, "click", /*latexInput*/ ctx[2].bind(this, "\\measuredangle"), false, false, false),
    					listen_dev(button37, "click", /*input*/ ctx[3].bind(this, "circledot"), false, false, false),
    					listen_dev(button38, "click", /*input*/ ctx[3].bind(this, "&prime;"), false, false, false),
    					listen_dev(div46, "click", /*latexInput*/ ctx[2].bind(this, "\\overrightarrow{ }"), false, false, false),
    					listen_dev(button39, "click", /*input*/ ctx[3].bind(this, "\\nparallel"), false, false, false),
    					listen_dev(button40, "click", /*input*/ ctx[3].bind(this, "\\sim"), false, false, false),
    					listen_dev(button41, "click", /*input*/ ctx[3].bind(this, "\\parallelogram"), false, false, false),
    					listen_dev(button42, "click", /*input*/ ctx[3].bind(this, "&prime;"), false, false, false),
    					listen_dev(button43, "click", /*latexInput*/ ctx[2].bind(this, "\\ldots"), false, false, false),
    					listen_dev(button44, "click", /*latexInput*/ ctx[2].bind(this, "\\ddots"), false, false, false),
    					listen_dev(button45, "click", /*input*/ ctx[3].bind(this, "\\cong"), false, false, false),
    					listen_dev(button46, "click", /*latexInput*/ ctx[2].bind(this, "\\vdots"), false, false, false),
    					listen_dev(button47, "click", /*input*/ ctx[3].bind(this, "&pi;"), false, false, false),
    					listen_dev(button48, "click", /*input*/ ctx[3].bind(this, "\\square"), false, false, false),
    					listen_dev(button49, "click", /*latexInput*/ ctx[2].bind(this, "\\propto"), false, false, false),
    					listen_dev(button50, "click", /*latexInput*/ ctx[2].bind(this, "\\rfloor"), false, false, false),
    					listen_dev(button51, "click", /*input*/ ctx[3].bind(this, "\\equiv"), false, false, false),
    					listen_dev(button52, "click", /*input*/ ctx[3].bind(this, "\\exists"), false, false, false),
    					listen_dev(button53, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mg}"), false, false, false),
    					listen_dev(button54, "click", /*latexInput*/ ctx[2].bind(this, "\\text{cm}"), false, false, false),
    					listen_dev(div49, "click", /*latexInput*/ ctx[2].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div51, "click", /*latexInput*/ ctx[2].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button55, "click", /*input*/ ctx[3].bind(this, "±"), false, false, false),
    					listen_dev(div53, "click", /*input*/ ctx[3].bind(this, ":"), false, false, false),
    					listen_dev(div55, "click", /*input*/ ctx[3].bind(this, "infin"), false, false, false),
    					listen_dev(button56, "click", /*latexInput*/ ctx[2].bind(this, "\\subset"), false, false, false),
    					listen_dev(button57, "click", /*input*/ ctx[3].bind(this, "\\in"), false, false, false),
    					listen_dev(button58, "click", /*input*/ ctx[3].bind(this, "\\cup"), false, false, false),
    					listen_dev(button59, "click", /*input*/ ctx[3].bind(this, ","), false, false, false),
    					listen_dev(div57, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button60, "click", /*latexInput*/ ctx[2].bind(this, "\\supset"), false, false, false),
    					listen_dev(button61, "click", /*input*/ ctx[3].bind(this, "\\notin"), false, false, false),
    					listen_dev(button62, "click", /*input*/ ctx[3].bind(this, "\\cap"), false, false, false),
    					listen_dev(button63, "click", /*latexInput*/ ctx[2].bind(this, ":"), false, false, false),
    					listen_dev(div59, "click", /*latexInput*/ ctx[2].bind(this, "\\left\\{\\right\\}"), false, false, false),
    					listen_dev(button64, "click", /*latexInput*/ ctx[2].bind(this, "\\subseteq"), false, false, false),
    					listen_dev(button65, "click", /*latexInput*/ ctx[2].bind(this, "\\ni"), false, false, false),
    					listen_dev(button66, "click", /*input*/ ctx[3].bind(this, "\\varnothing"), false, false, false),
    					listen_dev(button67, "click", /*input*/ ctx[3].bind(this, "!"), false, false, false),
    					listen_dev(div61, "click", /*latexInput*/ ctx[2].bind(this, "\\left[\\right)"), false, false, false),
    					listen_dev(button68, "click", /*latexInput*/ ctx[2].bind(this, "\\sec^{-1}"), false, false, false),
    					listen_dev(button69, "click", /*latexInput*/ ctx[2].bind(this, "\\csc^{-1}"), false, false, false),
    					listen_dev(button70, "click", /*latexInput*/ ctx[2].bind(this, "\\cot^{-1}"), false, false, false),
    					listen_dev(button71, "click", /*latexInput*/ ctx[2].bind(this, "sin"), false, false, false),
    					listen_dev(button72, "click", /*input*/ ctx[3].bind(this, "cos"), false, false, false),
    					listen_dev(button73, "click", /*latexInput*/ ctx[2].bind(this, "\\tan"), false, false, false),
    					listen_dev(button74, "click", /*latexInput*/ ctx[2].bind(this, "\\sec^{-1}"), false, false, false),
    					listen_dev(button75, "click", /*latexInput*/ ctx[2].bind(this, "\\csc^{-1}"), false, false, false),
    					listen_dev(button76, "click", /*latexInput*/ ctx[2].bind(this, "\\cot^{-1}"), false, false, false),
    					listen_dev(button77, "click", /*input*/ ctx[3].bind(this, "b"), false, false, false),
    					listen_dev(button78, "click", /*latexInput*/ ctx[2].bind(this, "\\cdot"), false, false, false),
    					listen_dev(button79, "click", /*latexInput*/ ctx[2].bind(this, "\\text{lb}"), false, false, false),
    					listen_dev(button80, "click", /*latexInput*/ ctx[2].bind(this, "\\text{ft}"), false, false, false),
    					listen_dev(button81, "click", /*latexInput*/ ctx[2].bind(this, "\\text{pt}"), false, false, false),
    					listen_dev(div63, "click", /*latexInput*/ ctx[2].bind(this, "^{}"), false, false, false),
    					listen_dev(button82, "click", /*input*/ ctx[3].bind(this, "\\rightarrow"), false, false, false),
    					listen_dev(div65, "click", /*latexInput*/ ctx[2].bind(this, "\\xrightarrow[]\\{}"), false, false, false),
    					listen_dev(button83, "click", /*latexInput*/ ctx[2].bind(this, "\\text{g} \\text{mol}^{-1}"), false, false, false),
    					listen_dev(button84, "click", /*latexInput*/ ctx[2].bind(this, "\\partial"), false, false, false),
    					listen_dev(div68, "click", /*input*/ ctx[3].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div70, "click", /*latexInput*/ ctx[2].bind(this, "\\_{}"), false, false, false),
    					listen_dev(div72, "click", /*latexInput*/ ctx[2].bind(this, "$"), false, false, false),
    					listen_dev(div74, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button85, "click", /*latexInput*/ ctx[2].bind(this, "sec"), false, false, false),
    					listen_dev(button86, "click", /*latexInput*/ ctx[2].bind(this, "csc"), false, false, false),
    					listen_dev(button87, "click", /*input*/ ctx[3].bind(this, "cot"), false, false, false),
    					listen_dev(button88, "click", /*latexInput*/ ctx[2].bind(this, "\\sin^{-1}"), false, false, false),
    					listen_dev(button89, "click", /*latexInput*/ ctx[2].bind(this, "\\cos^{-1}"), false, false, false),
    					listen_dev(button90, "click", /*latexInput*/ ctx[2].bind(this, "\\tan^{-1}"), false, false, false),
    					listen_dev(button91, "click", /*latexInput*/ ctx[2].bind(this, "\\alpha"), false, false, false),
    					listen_dev(button92, "click", /*input*/ ctx[3].bind(this, "\\theta"), false, false, false),
    					listen_dev(button93, "click", /*input*/ ctx[3].bind(this, "Theta"), false, false, false),
    					listen_dev(button94, "click", /*input*/ ctx[3].bind(this, "\\tau"), false, false, false),
    					listen_dev(button95, "click", /*latexInput*/ ctx[2].bind(this, "\\gamma"), false, false, false),
    					listen_dev(button96, "click", /*input*/ ctx[3].bind(this, "\\sigma"), false, false, false),
    					listen_dev(button97, "click", /*input*/ ctx[3].bind(this, "Sigma"), false, false, false),
    					listen_dev(button98, "click", /*latexInput*/ ctx[2].bind(this, "\\varepsilon"), false, false, false),
    					listen_dev(button99, "click", /*latexInput*/ ctx[2].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button100, "click", /*latexInput*/ ctx[2].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button101, "click", /*input*/ ctx[3].bind(this, "\\lambda"), false, false, false),
    					listen_dev(button102, "click", /*input*/ ctx[3].bind(this, "\\beta"), false, false, false),
    					listen_dev(button103, "click", /*input*/ ctx[3].bind(this, "\\pi"), false, false, false),
    					listen_dev(button104, "click", /*latexInput*/ ctx[2].bind(this, "\\Pi"), false, false, false),
    					listen_dev(button105, "click", /*latexInput*/ ctx[2].bind(this, "\\phi"), false, false, false),
    					listen_dev(button106, "click", /*latexInput*/ ctx[2].bind(this, "\\lfloor"), false, false, false),
    					listen_dev(button107, "click", /*input*/ ctx[3].bind(this, "\\uparrow"), false, false, false),
    					listen_dev(button108, "click", /*input*/ ctx[3].bind(this, "\\neg"), false, false, false),
    					listen_dev(button109, "click", /*latexInput*/ ctx[2].bind(this, "\\text{oz}"), false, false, false),
    					listen_dev(button110, "click", /*latexInput*/ ctx[2].bind(this, "\\text{in}"), false, false, false),
    					listen_dev(button111, "click", /*latexInput*/ ctx[2].bind(this, "\\text{fl oz}"), false, false, false),
    					listen_dev(button112, "click", /*latexInput*/ ctx[2].bind(this, "\\text{g}"), false, false, false),
    					listen_dev(button113, "click", /*latexInput*/ ctx[2].bind(this, "\\text{m}"), false, false, false),
    					listen_dev(button114, "click", /*latexInput*/ ctx[2].bind(this, "\\text{L}"), false, false, false),
    					listen_dev(button115, "click", /*latexInput*/ ctx[2].bind(this, "\\text{s}"), false, false, false),
    					listen_dev(button116, "click", /*latexInput*/ ctx[2].bind(this, "\\text{kg}"), false, false, false),
    					listen_dev(button117, "click", /*latexInput*/ ctx[2].bind(this, "\\text{km}"), false, false, false),
    					listen_dev(button118, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mL}"), false, false, false),
    					listen_dev(button119, "click", /*latexInput*/ ctx[2].bind(this, "\\text{ms}"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div76);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(140:8) {#if type == \\\"1\\\"}",
    		ctx
    	});

    	return block;
    }

    // (380:8) {#if type == "2"}
    function create_if_block_13(ctx) {
    	let div30;
    	let div6;
    	let div1;
    	let div0;
    	let t0;
    	let div3;
    	let div2;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let div5;
    	let div4;
    	let t6;
    	let div11;
    	let div8;
    	let div7;
    	let t7;
    	let div10;
    	let div9;
    	let t8;
    	let button2;
    	let t10;
    	let button3;
    	let t12;
    	let button4;
    	let t14;
    	let div20;
    	let div13;
    	let div12;
    	let t15;
    	let div15;
    	let div14;
    	let t16;
    	let button5;
    	let t18;
    	let div17;
    	let div16;
    	let t19;
    	let div19;
    	let div18;
    	let t20;
    	let div29;
    	let div22;
    	let div21;
    	let t21;
    	let div24;
    	let div23;
    	let t22;
    	let div26;
    	let div25;
    	let t23;
    	let div28;
    	let div27;
    	let t24;
    	let button6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div30 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "<";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "%";
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t6 = space();
    			div11 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			t7 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = ">";
    			t10 = space();
    			button3 = element("button");
    			button3.textContent = "°";
    			t12 = space();
    			button4 = element("button");
    			button4.textContent = "π";
    			t14 = space();
    			div20 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			t15 = space();
    			div15 = element("div");
    			div14 = element("div");
    			t16 = space();
    			button5 = element("button");
    			button5.textContent = "±";
    			t18 = space();
    			div17 = element("div");
    			div16 = element("div");
    			t19 = space();
    			div19 = element("div");
    			div18 = element("div");
    			t20 = space();
    			div29 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			t21 = space();
    			div24 = element("div");
    			div23 = element("div");
    			t22 = space();
    			div26 = element("div");
    			div25 = element("div");
    			t23 = space();
    			div28 = element("div");
    			div27 = element("div");
    			t24 = space();
    			button6 = element("button");
    			attr_dev(div0, "class", "xvariable svelte-1qn0my1");
    			add_location(div0, file$1, 383, 20, 33957);
    			attr_dev(div1, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(div1, file$1, 382, 16, 33845);
    			attr_dev(div2, "class", "xfraction svelte-1qn0my1");
    			add_location(div2, file$1, 386, 20, 34127);
    			attr_dev(div3, "class", "blue_container scnd_btn padder_btn svelte-1qn0my1");
    			add_location(div3, file$1, 385, 16, 34026);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 388, 20, 34200);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button1, file$1, 389, 20, 34338);
    			attr_dev(div4, "class", "modulus svelte-1qn0my1");
    			add_location(div4, file$1, 391, 20, 34572);
    			attr_dev(div5, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div5, file$1, 390, 16, 34453);
    			attr_dev(div6, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div6, file$1, 381, 12, 33773);
    			attr_dev(div7, "class", "yvariable svelte-1qn0my1");
    			add_location(div7, file$1, 396, 20, 34837);
    			attr_dev(div8, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(div8, file$1, 395, 16, 34725);
    			attr_dev(div9, "class", "x-times-fraction svelte-1qn0my1");
    			add_location(div9, file$1, 399, 20, 35007);
    			attr_dev(div10, "class", "scnd_btn padder_btn blue_container svelte-1qn0my1");
    			add_location(div10, file$1, 398, 16, 34906);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "thrd_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button2, file$1, 401, 20, 35087);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fourth_btn blue_container svelte-1qn0my1");
    			add_location(button3, file$1, 402, 20, 35225);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button4, file$1, 403, 20, 35360);
    			attr_dev(div11, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div11, file$1, 394, 12, 34654);
    			attr_dev(div12, "class", "xsquare svelte-1qn0my1");
    			add_location(div12, file$1, 407, 20, 35712);
    			attr_dev(div13, "class", "blue_container first_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div13, file$1, 406, 16, 35583);
    			attr_dev(div14, "class", "xpower svelte-1qn0my1");
    			add_location(div14, file$1, 410, 20, 35893);
    			attr_dev(div15, "class", "blue_container scnd_btn padder_remover svelte-1qn0my1");
    			add_location(div15, file$1, 409, 16, 35779);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 412, 20, 35963);
    			attr_dev(div16, "class", "colon svelte-1qn0my1");
    			add_location(div16, file$1, 414, 20, 36203);
    			attr_dev(div17, "class", "blue_container fourth_btn padder_less svelte-1qn0my1");
    			add_location(div17, file$1, 413, 16, 36099);
    			attr_dev(div18, "class", "infinity svelte-1qn0my1");
    			add_location(div18, file$1, 417, 20, 36380);
    			attr_dev(div19, "class", "blue_container fifth_btn bborder_remover svelte-1qn0my1");
    			add_location(div19, file$1, 416, 16, 36268);
    			attr_dev(div20, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div20, file$1, 405, 12, 35510);
    			attr_dev(div21, "class", "square-root svelte-1qn0my1");
    			add_location(div21, file$1, 422, 20, 36661);
    			attr_dev(div22, "class", "blue_container first_btn bborder_remover blue_container padder_field svelte-1qn0my1");
    			add_location(div22, file$1, 421, 16, 36521);
    			attr_dev(div23, "class", "xsubscript svelte-1qn0my1");
    			add_location(div23, file$1, 425, 20, 36858);
    			attr_dev(div24, "class", "blue_container scnd_btn blue_container padder_less svelte-1qn0my1");
    			add_location(div24, file$1, 424, 16, 36732);
    			attr_dev(div25, "class", "dollar svelte-1qn0my1");
    			add_location(div25, file$1, 428, 20, 37066);
    			attr_dev(div26, "class", "blue_container thrd_btn bborder_remover blue_container padder_less svelte-1qn0my1");
    			add_location(div26, file$1, 427, 16, 36928);
    			attr_dev(div27, "class", "brackets svelte-1qn0my1");
    			add_location(div27, file$1, 431, 20, 37271);
    			attr_dev(div28, "class", "blue_container fourth_btn blue_container padder_field svelte-1qn0my1");
    			add_location(div28, file$1, 430, 16, 37132);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button6, file$1, 433, 20, 37343);
    			attr_dev(div29, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div29, file$1, 420, 12, 36463);
    			attr_dev(div30, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div30, "id", "select_butns_2");
    			add_location(div30, file$1, 380, 8, 33697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div30, anchor);
    			append_dev(div30, div6);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div6, t0);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div6, t1);
    			append_dev(div6, button0);
    			append_dev(div6, t3);
    			append_dev(div6, button1);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div30, t6);
    			append_dev(div30, div11);
    			append_dev(div11, div8);
    			append_dev(div8, div7);
    			append_dev(div11, t7);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div11, t8);
    			append_dev(div11, button2);
    			append_dev(div11, t10);
    			append_dev(div11, button3);
    			append_dev(div11, t12);
    			append_dev(div11, button4);
    			append_dev(div30, t14);
    			append_dev(div30, div20);
    			append_dev(div20, div13);
    			append_dev(div13, div12);
    			append_dev(div20, t15);
    			append_dev(div20, div15);
    			append_dev(div15, div14);
    			append_dev(div20, t16);
    			append_dev(div20, button5);
    			append_dev(div20, t18);
    			append_dev(div20, div17);
    			append_dev(div17, div16);
    			append_dev(div20, t19);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div30, t20);
    			append_dev(div30, div29);
    			append_dev(div29, div22);
    			append_dev(div22, div21);
    			append_dev(div29, t21);
    			append_dev(div29, div24);
    			append_dev(div24, div23);
    			append_dev(div29, t22);
    			append_dev(div29, div26);
    			append_dev(div26, div25);
    			append_dev(div29, t23);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div29, t24);
    			append_dev(div29, button6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "x"), false, false, false),
    					listen_dev(div3, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button0, "click", /*input*/ ctx[3].bind(this, "lt"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "%"), false, false, false),
    					listen_dev(div5, "click", /*input*/ ctx[3].bind(this, "|"), false, false, false),
    					listen_dev(div8, "click", /*latexInput*/ ctx[2].bind(this, "y"), false, false, false),
    					listen_dev(div10, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button2, "click", /*input*/ ctx[3].bind(this, "gt"), false, false, false),
    					listen_dev(button3, "click", /*latexInput*/ ctx[2].bind(this, "\\degree"), false, false, false),
    					listen_dev(button4, "click", /*input*/ ctx[3].bind(this, "pi"), false, false, false),
    					listen_dev(div13, "click", /*latexInput*/ ctx[2].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div15, "click", /*latexInput*/ ctx[2].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button5, "click", /*input*/ ctx[3].bind(this, "±"), false, false, false),
    					listen_dev(div17, "click", /*input*/ ctx[3].bind(this, ":"), false, false, false),
    					listen_dev(div19, "click", /*input*/ ctx[3].bind(this, "infin"), false, false, false),
    					listen_dev(div22, "click", /*input*/ ctx[3].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div24, "click", /*latexInput*/ ctx[2].bind(this, "\\_{}"), false, false, false),
    					listen_dev(div26, "click", /*latexInput*/ ctx[2].bind(this, "$"), false, false, false),
    					listen_dev(div28, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div30);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(380:8) {#if type == \\\"2\\\"}",
    		ctx
    	});

    	return block;
    }

    // (438:8) {#if type == "3"}
    function create_if_block_12(ctx) {
    	let div31;
    	let div4;
    	let div1;
    	let div0;
    	let t0;
    	let div3;
    	let div2;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let t6;
    	let div12;
    	let div6;
    	let div5;
    	let t7;
    	let div8;
    	let div7;
    	let t8;
    	let button3;
    	let t10;
    	let div10;
    	let div9;
    	let t11;
    	let div11;
    	let t12;
    	let div20;
    	let div14;
    	let div13;
    	let t13;
    	let div16;
    	let div15;
    	let t14;
    	let button4;
    	let t16;
    	let div18;
    	let div17;
    	let t17;
    	let div19;
    	let t18;
    	let div30;
    	let div22;
    	let div21;
    	let t19;
    	let div24;
    	let div23;
    	let t20;
    	let div26;
    	let div25;
    	let t21;
    	let div28;
    	let div27;
    	let t22;
    	let div29;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div31 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "<";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "π";
    			t5 = space();
    			button2 = element("button");
    			t6 = space();
    			div12 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			t7 = space();
    			div8 = element("div");
    			div7 = element("div");
    			t8 = space();
    			button3 = element("button");
    			button3.textContent = ">";
    			t10 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t11 = space();
    			div11 = element("div");
    			t12 = space();
    			div20 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			t13 = space();
    			div16 = element("div");
    			div15 = element("div");
    			t14 = space();
    			button4 = element("button");
    			button4.textContent = "±";
    			t16 = space();
    			div18 = element("div");
    			div17 = element("div");
    			t17 = space();
    			div19 = element("div");
    			t18 = space();
    			div30 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			t19 = space();
    			div24 = element("div");
    			div23 = element("div");
    			t20 = space();
    			div26 = element("div");
    			div25 = element("div");
    			t21 = space();
    			div28 = element("div");
    			div27 = element("div");
    			t22 = space();
    			div29 = element("div");
    			attr_dev(div0, "class", "xvariable svelte-1qn0my1");
    			add_location(div0, file$1, 441, 20, 37768);
    			attr_dev(div1, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(div1, file$1, 440, 16, 37661);
    			attr_dev(div2, "class", "xfraction svelte-1qn0my1");
    			add_location(div2, file$1, 444, 20, 37938);
    			attr_dev(div3, "class", "blue_container scnd_btn padder_btn svelte-1qn0my1");
    			add_location(div3, file$1, 443, 16, 37837);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 446, 20, 38011);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button1, file$1, 447, 20, 38149);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 448, 20, 38273);
    			attr_dev(div4, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div4, file$1, 439, 12, 37589);
    			attr_dev(div5, "class", "yvariable svelte-1qn0my1");
    			add_location(div5, file$1, 452, 20, 38576);
    			attr_dev(div6, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(div6, file$1, 451, 16, 38469);
    			attr_dev(div7, "class", "x-times-fraction svelte-1qn0my1");
    			add_location(div7, file$1, 455, 20, 38746);
    			attr_dev(div8, "class", "blue_container scnd_btn padder_btn svelte-1qn0my1");
    			add_location(div8, file$1, 454, 16, 38645);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button3, file$1, 457, 20, 38826);
    			attr_dev(div9, "class", "infinity svelte-1qn0my1");
    			add_location(div9, file$1, 459, 20, 39057);
    			attr_dev(div10, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(div10, file$1, 458, 16, 38960);
    			attr_dev(div11, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(div11, file$1, 461, 16, 39125);
    			attr_dev(div12, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div12, file$1, 450, 12, 38398);
    			attr_dev(div13, "class", "xsquare svelte-1qn0my1");
    			add_location(div13, file$1, 465, 20, 39432);
    			attr_dev(div14, "class", "blue_container first_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div14, file$1, 464, 16, 39303);
    			attr_dev(div15, "class", "xpower svelte-1qn0my1");
    			add_location(div15, file$1, 468, 20, 39610);
    			attr_dev(div16, "class", "blue_container scnd_btn padder_less svelte-1qn0my1");
    			add_location(div16, file$1, 467, 16, 39499);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 470, 20, 39680);
    			attr_dev(div17, "class", "brackets svelte-1qn0my1");
    			add_location(div17, file$1, 472, 20, 39939);
    			attr_dev(div18, "class", "blue_container fourth_btn padder_less svelte-1qn0my1");
    			add_location(div18, file$1, 471, 16, 39816);
    			attr_dev(div19, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(div19, file$1, 474, 16, 40007);
    			attr_dev(div20, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div20, file$1, 463, 12, 39230);
    			attr_dev(div21, "class", "square-root svelte-1qn0my1");
    			add_location(div21, file$1, 478, 20, 40295);
    			attr_dev(div22, "class", "first_btn bborder_remover blue_container padder_field svelte-1qn0my1");
    			add_location(div22, file$1, 477, 16, 40170);
    			attr_dev(div23, "class", "square-root-two svelte-1qn0my1");
    			add_location(div23, file$1, 481, 20, 40485);
    			attr_dev(div24, "class", "scnd_btn blue_container padder_remover svelte-1qn0my1");
    			add_location(div24, file$1, 480, 16, 40366);
    			attr_dev(div25, "class", "modulus svelte-1qn0my1");
    			add_location(div25, file$1, 484, 20, 40678);
    			attr_dev(div26, "class", "thrd_btn bborder_remover blue_container padder_less svelte-1qn0my1");
    			add_location(div26, file$1, 483, 16, 40560);
    			attr_dev(div27, "class", "square-brackets svelte-1qn0my1");
    			add_location(div27, file$1, 487, 20, 40868);
    			attr_dev(div28, "class", "fourth_btn blue_container padder_less svelte-1qn0my1");
    			add_location(div28, file$1, 486, 16, 40745);
    			attr_dev(div29, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(div29, file$1, 489, 16, 40943);
    			attr_dev(div30, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div30, file$1, 476, 12, 40112);
    			attr_dev(div31, "class", "btn-group button_designs select_changer svelte-1qn0my1");
    			attr_dev(div31, "id", "select_butns_3");
    			add_location(div31, file$1, 438, 8, 37503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div31, anchor);
    			append_dev(div31, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div4, t1);
    			append_dev(div4, button0);
    			append_dev(div4, t3);
    			append_dev(div4, button1);
    			append_dev(div4, t5);
    			append_dev(div4, button2);
    			append_dev(div31, t6);
    			append_dev(div31, div12);
    			append_dev(div12, div6);
    			append_dev(div6, div5);
    			append_dev(div12, t7);
    			append_dev(div12, div8);
    			append_dev(div8, div7);
    			append_dev(div12, t8);
    			append_dev(div12, button3);
    			append_dev(div12, t10);
    			append_dev(div12, div10);
    			append_dev(div10, div9);
    			append_dev(div12, t11);
    			append_dev(div12, div11);
    			append_dev(div31, t12);
    			append_dev(div31, div20);
    			append_dev(div20, div14);
    			append_dev(div14, div13);
    			append_dev(div20, t13);
    			append_dev(div20, div16);
    			append_dev(div16, div15);
    			append_dev(div20, t14);
    			append_dev(div20, button4);
    			append_dev(div20, t16);
    			append_dev(div20, div18);
    			append_dev(div18, div17);
    			append_dev(div20, t17);
    			append_dev(div20, div19);
    			append_dev(div31, t18);
    			append_dev(div31, div30);
    			append_dev(div30, div22);
    			append_dev(div22, div21);
    			append_dev(div30, t19);
    			append_dev(div30, div24);
    			append_dev(div24, div23);
    			append_dev(div30, t20);
    			append_dev(div30, div26);
    			append_dev(div26, div25);
    			append_dev(div30, t21);
    			append_dev(div30, div28);
    			append_dev(div28, div27);
    			append_dev(div30, t22);
    			append_dev(div30, div29);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*input*/ ctx[3].bind(this, "x"), false, false, false),
    					listen_dev(div3, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button0, "click", /*input*/ ctx[3].bind(this, "lt"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "pi"), false, false, false),
    					listen_dev(div6, "click", /*input*/ ctx[3].bind(this, "y"), false, false, false),
    					listen_dev(div8, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button3, "click", /*input*/ ctx[3].bind(this, "gt"), false, false, false),
    					listen_dev(div10, "click", /*input*/ ctx[3].bind(this, "infin"), false, false, false),
    					listen_dev(div14, "click", /*latexInput*/ ctx[2].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div16, "click", /*latexInput*/ ctx[2].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button4, "click", /*input*/ ctx[3].bind(this, "±"), false, false, false),
    					listen_dev(div18, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div22, "click", /*input*/ ctx[3].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div24, "click", /*latexInput*/ ctx[2].bind(this, "\\sqrt[]{}"), false, false, false),
    					listen_dev(div26, "click", /*input*/ ctx[3].bind(this, "|"), false, false, false),
    					listen_dev(div28, "click", /*latexInput*/ ctx[2].bind(this, "\\left[\\right]"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div31);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(438:8) {#if type == \\\"3\\\"}",
    		ctx
    	});

    	return block;
    }

    // (494:8) {#if type == "4"}
    function create_if_block_11(ctx) {
    	let div9;
    	let div3;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let div1;
    	let div0;
    	let t6;
    	let div2;
    	let t7;
    	let div7;
    	let button3;
    	let t9;
    	let button4;
    	let t11;
    	let button5;
    	let t13;
    	let div5;
    	let div4;
    	let t14;
    	let div6;
    	let t15;
    	let div8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "≠";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "<";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "≤";
    			t5 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t6 = space();
    			div2 = element("div");
    			t7 = space();
    			div7 = element("div");
    			button3 = element("button");
    			button3.textContent = "≈";
    			t9 = space();
    			button4 = element("button");
    			button4.textContent = ">";
    			t11 = space();
    			button5 = element("button");
    			button5.textContent = "≥";
    			t13 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t14 = space();
    			div6 = element("div");
    			t15 = space();
    			div8 = element("div");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 496, 20, 41245);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 497, 20, 41385);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 498, 20, 41507);
    			attr_dev(div0, "class", "not-greater svelte-1qn0my1");
    			add_location(div0, file$1, 500, 20, 41744);
    			attr_dev(div1, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(div1, file$1, 499, 16, 41642);
    			attr_dev(div2, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(div2, file$1, 502, 16, 41815);
    			attr_dev(div3, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div3, file$1, 495, 12, 41169);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button3, file$1, 505, 20, 41995);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button4, file$1, 506, 20, 42141);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 507, 20, 42263);
    			attr_dev(div4, "class", "not-lesser svelte-1qn0my1");
    			add_location(div4, file$1, 509, 20, 42501);
    			attr_dev(div5, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(div5, file$1, 508, 16, 42398);
    			attr_dev(div6, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(div6, file$1, 511, 16, 42571);
    			attr_dev(div7, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div7, file$1, 504, 12, 41920);
    			attr_dev(div8, "class", "remove_border svelte-1qn0my1");
    			add_location(div8, file$1, 513, 12, 42660);
    			attr_dev(div9, "class", "btn-group button_designs select_changer svelte-1qn0my1");
    			attr_dev(div9, "id", "select_butns_4");
    			add_location(div9, file$1, 494, 8, 41083);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t1);
    			append_dev(div3, button1);
    			append_dev(div3, t3);
    			append_dev(div3, button2);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div9, t7);
    			append_dev(div9, div7);
    			append_dev(div7, button3);
    			append_dev(div7, t9);
    			append_dev(div7, button4);
    			append_dev(div7, t11);
    			append_dev(div7, button5);
    			append_dev(div7, t13);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div9, t15);
    			append_dev(div9, div8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*input*/ ctx[3].bind(this, "&ne;"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "lt"), false, false, false),
    					listen_dev(button2, "click", /*input*/ ctx[3].bind(this, "&le;"), false, false, false),
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "\\ngtr"), false, false, false),
    					listen_dev(button3, "click", /*input*/ ctx[3].bind(this, "&asymp;"), false, false, false),
    					listen_dev(button4, "click", /*input*/ ctx[3].bind(this, "gt"), false, false, false),
    					listen_dev(button5, "click", /*input*/ ctx[3].bind(this, "&ge;"), false, false, false),
    					listen_dev(div5, "click", /*latexInput*/ ctx[2].bind(this, "\\nless"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(494:8) {#if type == \\\"4\\\"}",
    		ctx
    	});

    	return block;
    }

    // (517:8) {#if type == "5"}
    function create_if_block_10(ctx) {
    	let div8;
    	let div2;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let div1;
    	let div0;
    	let t8;
    	let div5;
    	let button4;
    	let t10;
    	let button5;
    	let t12;
    	let button6;
    	let t14;
    	let button7;
    	let t16;
    	let div4;
    	let div3;
    	let t17;
    	let div6;
    	let button8;
    	let t19;
    	let button9;
    	let t21;
    	let button10;
    	let t23;
    	let button11;
    	let t25;
    	let button12;
    	let t27;
    	let div7;
    	let button13;
    	let t29;
    	let button14;
    	let t31;
    	let button15;
    	let t33;
    	let button16;
    	let t35;
    	let button17;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "⊥";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "∠";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Δ";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "°";
    			t7 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t8 = space();
    			div5 = element("div");
    			button4 = element("button");
    			button4.textContent = "∥";
    			t10 = space();
    			button5 = element("button");
    			button5.textContent = "m∠";
    			t12 = space();
    			button6 = element("button");
    			button6.textContent = "⊙";
    			t14 = space();
    			button7 = element("button");
    			button7.textContent = "′";
    			t16 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t17 = space();
    			div6 = element("div");
    			button8 = element("button");
    			button8.textContent = "∦";
    			t19 = space();
    			button9 = element("button");
    			button9.textContent = "∼";
    			t21 = space();
    			button10 = element("button");
    			button10.textContent = "▱";
    			t23 = space();
    			button11 = element("button");
    			button11.textContent = "″";
    			t25 = space();
    			button12 = element("button");
    			button12.textContent = "⋯";
    			t27 = space();
    			div7 = element("div");
    			button13 = element("button");
    			button13.textContent = "⋱";
    			t29 = space();
    			button14 = element("button");
    			button14.textContent = "≅";
    			t31 = space();
    			button15 = element("button");
    			button15.textContent = "⋮";
    			t33 = space();
    			button16 = element("button");
    			button16.textContent = "π";
    			t35 = space();
    			button17 = element("button");
    			button17.textContent = "□";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 519, 16, 42915);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 520, 16, 43060);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 521, 16, 43188);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button3, file$1, 522, 16, 43337);
    			attr_dev(div0, "class", "bar-block svelte-1qn0my1");
    			add_location(div0, file$1, 524, 20, 43605);
    			attr_dev(div1, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div1, file$1, 523, 16, 43468);
    			attr_dev(div2, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 518, 12, 42843);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 528, 16, 43760);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button5, file$1, 529, 16, 43904);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button6, file$1, 530, 16, 44041);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button7, file$1, 531, 16, 44185);
    			attr_dev(div3, "class", "topbar-arrow svelte-1qn0my1");
    			add_location(div3, file$1, 533, 20, 44458);
    			attr_dev(div4, "class", "blue_container fifth_btn bborder_remover padder_remover svelte-1qn0my1");
    			add_location(div4, file$1, 532, 16, 44312);
    			attr_dev(div5, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div5, file$1, 527, 12, 43689);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button8, file$1, 537, 16, 44618);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button9, file$1, 538, 16, 44764);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 539, 16, 44885);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button11, file$1, 540, 16, 45034);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "blue_container fifth_btn bborder_remover padder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 541, 16, 45161);
    			attr_dev(div6, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div6, file$1, 536, 12, 44545);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "first_btn bborder_remover blue_container padder_less svelte-1qn0my1");
    			add_location(button13, file$1, 544, 16, 45396);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button14, file$1, 545, 16, 45555);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "thrd_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 546, 16, 45678);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "fourth_btn blue_container svelte-1qn0my1");
    			add_location(button16, file$1, 547, 16, 45824);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "fifth_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button17, file$1, 548, 16, 45945);
    			attr_dev(div7, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div7, file$1, 543, 12, 45338);
    			attr_dev(div8, "class", "btn-group button_designs select_changer svelte-1qn0my1");
    			attr_dev(div8, "id", "select_butns_5");
    			add_location(div8, file$1, 517, 8, 42757);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t1);
    			append_dev(div2, button1);
    			append_dev(div2, t3);
    			append_dev(div2, button2);
    			append_dev(div2, t5);
    			append_dev(div2, button3);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div8, t8);
    			append_dev(div8, div5);
    			append_dev(div5, button4);
    			append_dev(div5, t10);
    			append_dev(div5, button5);
    			append_dev(div5, t12);
    			append_dev(div5, button6);
    			append_dev(div5, t14);
    			append_dev(div5, button7);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div8, t17);
    			append_dev(div8, div6);
    			append_dev(div6, button8);
    			append_dev(div6, t19);
    			append_dev(div6, button9);
    			append_dev(div6, t21);
    			append_dev(div6, button10);
    			append_dev(div6, t23);
    			append_dev(div6, button11);
    			append_dev(div6, t25);
    			append_dev(div6, button12);
    			append_dev(div8, t27);
    			append_dev(div8, div7);
    			append_dev(div7, button13);
    			append_dev(div7, t29);
    			append_dev(div7, button14);
    			append_dev(div7, t31);
    			append_dev(div7, button15);
    			append_dev(div7, t33);
    			append_dev(div7, button16);
    			append_dev(div7, t35);
    			append_dev(div7, button17);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "\\perp"), false, false, false),
    					listen_dev(button1, "click", /*latexInput*/ ctx[2].bind(this, "\\angle"), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[2].bind(this, "\\triangle"), false, false, false),
    					listen_dev(button3, "click", /*latexInput*/ ctx[2].bind(this, "\\degree"), false, false, false),
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "\\overline{ }"), false, false, false),
    					listen_dev(button4, "click", /*input*/ ctx[3].bind(this, "parallel"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "\\measuredangle"), false, false, false),
    					listen_dev(button6, "click", /*input*/ ctx[3].bind(this, "circledot"), false, false, false),
    					listen_dev(button7, "click", /*input*/ ctx[3].bind(this, "&prime;"), false, false, false),
    					listen_dev(div4, "click", /*latexInput*/ ctx[2].bind(this, "\\overrightarrow{ }"), false, false, false),
    					listen_dev(button8, "click", /*input*/ ctx[3].bind(this, "\\nparallel"), false, false, false),
    					listen_dev(button9, "click", /*input*/ ctx[3].bind(this, "\\sim"), false, false, false),
    					listen_dev(button10, "click", /*input*/ ctx[3].bind(this, "\\parallelogram"), false, false, false),
    					listen_dev(button11, "click", /*input*/ ctx[3].bind(this, "&prime;"), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[2].bind(this, "\\ldots"), false, false, false),
    					listen_dev(button13, "click", /*latexInput*/ ctx[2].bind(this, "\\ddots"), false, false, false),
    					listen_dev(button14, "click", /*input*/ ctx[3].bind(this, "\\cong"), false, false, false),
    					listen_dev(button15, "click", /*latexInput*/ ctx[2].bind(this, "\\vdots"), false, false, false),
    					listen_dev(button16, "click", /*input*/ ctx[3].bind(this, "&pi;"), false, false, false),
    					listen_dev(button17, "click", /*input*/ ctx[3].bind(this, "\\square"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(517:8) {#if type == \\\"5\\\"}",
    		ctx
    	});

    	return block;
    }

    // (553:8) {#if type == "6"}
    function create_if_block_9(ctx) {
    	let div12;
    	let div2;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let div1;
    	let div0;
    	let t8;
    	let div5;
    	let button4;
    	let t10;
    	let button5;
    	let t12;
    	let button6;
    	let t14;
    	let button7;
    	let t16;
    	let div4;
    	let div3;
    	let t17;
    	let div8;
    	let button8;
    	let t19;
    	let button9;
    	let t21;
    	let button10;
    	let t23;
    	let button11;
    	let t25;
    	let div7;
    	let div6;
    	let t26;
    	let div11;
    	let button12;
    	let t28;
    	let button13;
    	let t30;
    	let button14;
    	let t31;
    	let button15;
    	let t33;
    	let div10;
    	let div9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "⊂";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "∊";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "∪";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = ",";
    			t7 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t8 = space();
    			div5 = element("div");
    			button4 = element("button");
    			button4.textContent = "⊃";
    			t10 = space();
    			button5 = element("button");
    			button5.textContent = "∉";
    			t12 = space();
    			button6 = element("button");
    			button6.textContent = "∩";
    			t14 = space();
    			button7 = element("button");
    			button7.textContent = ":";
    			t16 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t17 = space();
    			div8 = element("div");
    			button8 = element("button");
    			button8.textContent = "⊆";
    			t19 = space();
    			button9 = element("button");
    			button9.textContent = "∍";
    			t21 = space();
    			button10 = element("button");
    			button10.textContent = "∅";
    			t23 = space();
    			button11 = element("button");
    			button11.textContent = "!";
    			t25 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t26 = space();
    			div11 = element("div");
    			button12 = element("button");
    			button12.textContent = "⊇";
    			t28 = space();
    			button13 = element("button");
    			button13.textContent = "⊄";
    			t30 = space();
    			button14 = element("button");
    			t31 = space();
    			button15 = element("button");
    			button15.textContent = "\\";
    			t33 = space();
    			div10 = element("div");
    			div9 = element("div");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 555, 20, 46306);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 556, 20, 46456);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 557, 20, 46582);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button3, file$1, 558, 20, 46723);
    			attr_dev(div0, "class", "brackets svelte-1qn0my1");
    			add_location(div0, file$1, 560, 20, 46976);
    			attr_dev(div1, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div1, file$1, 559, 16, 46838);
    			attr_dev(div2, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 554, 12, 46230);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 564, 20, 47134);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button5, file$1, 565, 20, 47284);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button6, file$1, 566, 20, 47413);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button7, file$1, 567, 20, 47554);
    			attr_dev(div3, "class", "curly-brackets svelte-1qn0my1");
    			add_location(div3, file$1, 569, 20, 47816);
    			attr_dev(div4, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div4, file$1, 568, 16, 47674);
    			attr_dev(div5, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div5, file$1, 563, 12, 47059);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button8, file$1, 573, 20, 47982);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button9, file$1, 574, 20, 48135);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 575, 20, 48266);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button11, file$1, 576, 20, 48416);
    			attr_dev(div6, "class", "rec-brackets svelte-1qn0my1");
    			add_location(div6, file$1, 578, 20, 48669);
    			attr_dev(div7, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div7, file$1, 577, 16, 48531);
    			attr_dev(div8, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div8, file$1, 572, 12, 47905);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button12, file$1, 582, 20, 48818);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button13, file$1, 583, 20, 48966);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button14, file$1, 584, 20, 49104);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "fourth_btn blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 585, 20, 49202);
    			attr_dev(div9, "class", "opp-recbrackets svelte-1qn0my1");
    			add_location(div9, file$1, 587, 20, 49469);
    			attr_dev(div10, "class", "thrd_btn bborder_remover blue_container padder_less svelte-1qn0my1");
    			add_location(div10, file$1, 586, 16, 49332);
    			attr_dev(div11, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div11, file$1, 581, 12, 48756);
    			attr_dev(div12, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div12, "id", "select_butns_6");
    			add_location(div12, file$1, 553, 8, 46154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t1);
    			append_dev(div2, button1);
    			append_dev(div2, t3);
    			append_dev(div2, button2);
    			append_dev(div2, t5);
    			append_dev(div2, button3);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div12, t8);
    			append_dev(div12, div5);
    			append_dev(div5, button4);
    			append_dev(div5, t10);
    			append_dev(div5, button5);
    			append_dev(div5, t12);
    			append_dev(div5, button6);
    			append_dev(div5, t14);
    			append_dev(div5, button7);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div12, t17);
    			append_dev(div12, div8);
    			append_dev(div8, button8);
    			append_dev(div8, t19);
    			append_dev(div8, button9);
    			append_dev(div8, t21);
    			append_dev(div8, button10);
    			append_dev(div8, t23);
    			append_dev(div8, button11);
    			append_dev(div8, t25);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div12, t26);
    			append_dev(div12, div11);
    			append_dev(div11, button12);
    			append_dev(div11, t28);
    			append_dev(div11, button13);
    			append_dev(div11, t30);
    			append_dev(div11, button14);
    			append_dev(div11, t31);
    			append_dev(div11, button15);
    			append_dev(div11, t33);
    			append_dev(div11, div10);
    			append_dev(div10, div9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "\\subset"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "\\in"), false, false, false),
    					listen_dev(button2, "click", /*input*/ ctx[3].bind(this, "\\cup"), false, false, false),
    					listen_dev(button3, "click", /*input*/ ctx[3].bind(this, ","), false, false, false),
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button4, "click", /*latexInput*/ ctx[2].bind(this, "\\supset"), false, false, false),
    					listen_dev(button5, "click", /*input*/ ctx[3].bind(this, "\\notin"), false, false, false),
    					listen_dev(button6, "click", /*input*/ ctx[3].bind(this, "\\cap"), false, false, false),
    					listen_dev(button7, "click", /*latexInput*/ ctx[2].bind(this, ":"), false, false, false),
    					listen_dev(div4, "click", /*latexInput*/ ctx[2].bind(this, "\\left\\{\\right\\}"), false, false, false),
    					listen_dev(button8, "click", /*latexInput*/ ctx[2].bind(this, "\\subseteq"), false, false, false),
    					listen_dev(button9, "click", /*latexInput*/ ctx[2].bind(this, "\\ni"), false, false, false),
    					listen_dev(button10, "click", /*input*/ ctx[3].bind(this, "\\varnothing"), false, false, false),
    					listen_dev(button11, "click", /*input*/ ctx[3].bind(this, "!"), false, false, false),
    					listen_dev(div7, "click", /*latexInput*/ ctx[2].bind(this, "\\left[\\right)"), false, false, false),
    					listen_dev(button12, "click", /*input*/ ctx[3].bind(this, "\\supseteq"), false, false, false),
    					listen_dev(button13, "click", /*latexInput*/ ctx[2].bind(this, "\\notsubset"), false, false, false),
    					listen_dev(button15, "click", /*latexInput*/ ctx[2].bind(this, "\\backslash"), false, false, false),
    					listen_dev(div10, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right]"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(553:8) {#if type == \\\"6\\\"}",
    		ctx
    	});

    	return block;
    }

    // (593:8) {#if type == "7"}
    function create_if_block_8(ctx) {
    	let div4;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t6;
    	let button4;
    	let t7;
    	let div1;
    	let button5;
    	let t9;
    	let button6;
    	let t11;
    	let button7;
    	let t13;
    	let button8;
    	let t14;
    	let button9;
    	let t15;
    	let div2;
    	let button10;
    	let t16;
    	let sup0;
    	let t18;
    	let button11;
    	let t19;
    	let sup1;
    	let t21;
    	let button12;
    	let t22;
    	let sup2;
    	let t24;
    	let button13;
    	let t25;
    	let button14;
    	let t26;
    	let div3;
    	let button15;
    	let t27;
    	let sup3;
    	let t29;
    	let button16;
    	let t30;
    	let sup4;
    	let t32;
    	let button17;
    	let t33;
    	let sup5;
    	let t35;
    	let button18;
    	let t36;
    	let button19;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "sin";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "cos";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "tan";
    			t5 = space();
    			button3 = element("button");
    			t6 = space();
    			button4 = element("button");
    			t7 = space();
    			div1 = element("div");
    			button5 = element("button");
    			button5.textContent = "sec";
    			t9 = space();
    			button6 = element("button");
    			button6.textContent = "csc";
    			t11 = space();
    			button7 = element("button");
    			button7.textContent = "cot";
    			t13 = space();
    			button8 = element("button");
    			t14 = space();
    			button9 = element("button");
    			t15 = space();
    			div2 = element("div");
    			button10 = element("button");
    			t16 = text("sin");
    			sup0 = element("sup");
    			sup0.textContent = "-1";
    			t18 = space();
    			button11 = element("button");
    			t19 = text("cos");
    			sup1 = element("sup");
    			sup1.textContent = "-1";
    			t21 = space();
    			button12 = element("button");
    			t22 = text("tan");
    			sup2 = element("sup");
    			sup2.textContent = "-1";
    			t24 = space();
    			button13 = element("button");
    			t25 = space();
    			button14 = element("button");
    			t26 = space();
    			div3 = element("div");
    			button15 = element("button");
    			t27 = text("sec");
    			sup3 = element("sup");
    			sup3.textContent = "-1";
    			t29 = space();
    			button16 = element("button");
    			t30 = text("csc");
    			sup4 = element("sup");
    			sup4.textContent = "-1";
    			t32 = space();
    			button17 = element("button");
    			t33 = text("cot");
    			sup5 = element("sup");
    			sup5.textContent = "-1";
    			t35 = space();
    			button18 = element("button");
    			t36 = space();
    			button19 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 595, 20, 49762);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 596, 20, 49906);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 597, 20, 50028);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button3, file$1, 598, 20, 50172);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 599, 20, 50287);
    			attr_dev(div0, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div0, file$1, 594, 12, 49686);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 602, 20, 50487);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button6, file$1, 603, 20, 50631);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 604, 20, 50758);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button8, file$1, 605, 20, 50896);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button9, file$1, 606, 20, 51011);
    			attr_dev(div1, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div1, file$1, 601, 12, 50412);
    			add_location(sup0, file$1, 609, 140, 51333);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 609, 20, 51213);
    			add_location(sup1, file$1, 610, 123, 51479);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button11, file$1, 610, 20, 51376);
    			add_location(sup2, file$1, 611, 139, 51641);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 611, 20, 51522);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button13, file$1, 612, 20, 51684);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button14, file$1, 613, 20, 51799);
    			attr_dev(div2, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 608, 12, 51136);
    			add_location(sup3, file$1, 616, 140, 52106);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 616, 20, 51986);
    			add_location(sup4, file$1, 617, 123, 52252);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button16, file$1, 617, 20, 52149);
    			add_location(sup5, file$1, 618, 139, 52414);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "thrd_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button17, file$1, 618, 20, 52295);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "fourth_btn blue_container bborder_remover blank_color svelte-1qn0my1");
    			add_location(button18, file$1, 619, 20, 52457);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button19, file$1, 620, 20, 52571);
    			attr_dev(div3, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div3, file$1, 615, 12, 51924);
    			attr_dev(div4, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div4, "id", "select_butns_7");
    			add_location(div4, file$1, 593, 8, 49610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(div0, t6);
    			append_dev(div0, button4);
    			append_dev(div4, t7);
    			append_dev(div4, div1);
    			append_dev(div1, button5);
    			append_dev(div1, t9);
    			append_dev(div1, button6);
    			append_dev(div1, t11);
    			append_dev(div1, button7);
    			append_dev(div1, t13);
    			append_dev(div1, button8);
    			append_dev(div1, t14);
    			append_dev(div1, button9);
    			append_dev(div4, t15);
    			append_dev(div4, div2);
    			append_dev(div2, button10);
    			append_dev(button10, t16);
    			append_dev(button10, sup0);
    			append_dev(div2, t18);
    			append_dev(div2, button11);
    			append_dev(button11, t19);
    			append_dev(button11, sup1);
    			append_dev(div2, t21);
    			append_dev(div2, button12);
    			append_dev(button12, t22);
    			append_dev(button12, sup2);
    			append_dev(div2, t24);
    			append_dev(div2, button13);
    			append_dev(div2, t25);
    			append_dev(div2, button14);
    			append_dev(div4, t26);
    			append_dev(div4, div3);
    			append_dev(div3, button15);
    			append_dev(button15, t27);
    			append_dev(button15, sup3);
    			append_dev(div3, t29);
    			append_dev(div3, button16);
    			append_dev(button16, t30);
    			append_dev(button16, sup4);
    			append_dev(div3, t32);
    			append_dev(div3, button17);
    			append_dev(button17, t33);
    			append_dev(button17, sup5);
    			append_dev(div3, t35);
    			append_dev(div3, button18);
    			append_dev(div3, t36);
    			append_dev(div3, button19);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "sin"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "cos"), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[2].bind(this, "\\tan"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "sec"), false, false, false),
    					listen_dev(button6, "click", /*latexInput*/ ctx[2].bind(this, "csc"), false, false, false),
    					listen_dev(button7, "click", /*input*/ ctx[3].bind(this, "cot"), false, false, false),
    					listen_dev(button10, "click", /*latexInput*/ ctx[2].bind(this, "\\sin^{-1}"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, "\\cos^{-1}"), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[2].bind(this, "\\tan^{-1}"), false, false, false),
    					listen_dev(button15, "click", /*latexInput*/ ctx[2].bind(this, "\\sec^{-1}"), false, false, false),
    					listen_dev(button16, "click", /*latexInput*/ ctx[2].bind(this, "\\csc^{-1}"), false, false, false),
    					listen_dev(button17, "click", /*latexInput*/ ctx[2].bind(this, "\\cot^{-1}"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(593:8) {#if type == \\\"7\\\"}",
    		ctx
    	});

    	return block;
    }

    // (625:8) {#if type == "8"}
    function create_if_block_7(ctx) {
    	let div4;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let button4;
    	let t8;
    	let div1;
    	let button5;
    	let t10;
    	let button6;
    	let t12;
    	let button7;
    	let t14;
    	let button8;
    	let t16;
    	let button9;
    	let t17;
    	let div2;
    	let button10;
    	let t19;
    	let button11;
    	let t21;
    	let button12;
    	let t23;
    	let button13;
    	let t25;
    	let button14;
    	let t26;
    	let div3;
    	let button15;
    	let t28;
    	let button16;
    	let t30;
    	let button17;
    	let t32;
    	let button18;
    	let t33;
    	let button19;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "α";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "θ";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Θ";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "ζ";
    			t7 = space();
    			button4 = element("button");
    			t8 = space();
    			div1 = element("div");
    			button5 = element("button");
    			button5.textContent = "γ";
    			t10 = space();
    			button6 = element("button");
    			button6.textContent = "σ";
    			t12 = space();
    			button7 = element("button");
    			button7.textContent = "Σ";
    			t14 = space();
    			button8 = element("button");
    			button8.textContent = "ε";
    			t16 = space();
    			button9 = element("button");
    			t17 = space();
    			div2 = element("div");
    			button10 = element("button");
    			button10.textContent = "δ";
    			t19 = space();
    			button11 = element("button");
    			button11.textContent = "Δ";
    			t21 = space();
    			button12 = element("button");
    			button12.textContent = "λ";
    			t23 = space();
    			button13 = element("button");
    			button13.textContent = "β";
    			t25 = space();
    			button14 = element("button");
    			t26 = space();
    			div3 = element("div");
    			button15 = element("button");
    			button15.textContent = "π";
    			t28 = space();
    			button16 = element("button");
    			button16.textContent = "Π";
    			t30 = space();
    			button17 = element("button");
    			button17.textContent = "∅";
    			t32 = space();
    			button18 = element("button");
    			t33 = space();
    			button19 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 627, 20, 52883);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 628, 20, 53034);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 629, 20, 53163);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button3, file$1, 630, 20, 53307);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 631, 20, 53435);
    			attr_dev(div0, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div0, file$1, 626, 12, 52807);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 634, 20, 53635);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button6, file$1, 635, 20, 53786);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 636, 20, 53915);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button8, file$1, 637, 20, 54059);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button9, file$1, 638, 20, 54202);
    			attr_dev(div1, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div1, file$1, 633, 12, 53560);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 641, 20, 54404);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button11, file$1, 642, 20, 54555);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 643, 20, 54689);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button13, file$1, 644, 20, 54836);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button14, file$1, 645, 20, 54965);
    			attr_dev(div2, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 640, 12, 54327);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "blue_container first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 648, 20, 55152);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "blue_container scnd_btn blue_container svelte-1qn0my1");
    			add_location(button16, file$1, 649, 20, 55307);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "blue_container thrd_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button17, file$1, 650, 20, 55450);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "blue_container fourth_btn blue_container bborder_remover blank_color svelte-1qn0my1");
    			add_location(button18, file$1, 651, 20, 55613);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button19, file$1, 652, 20, 55742);
    			attr_dev(div3, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div3, file$1, 647, 12, 55090);
    			attr_dev(div4, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div4, "id", "select_butns_8");
    			add_location(div4, file$1, 625, 8, 52731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(div0, t7);
    			append_dev(div0, button4);
    			append_dev(div4, t8);
    			append_dev(div4, div1);
    			append_dev(div1, button5);
    			append_dev(div1, t10);
    			append_dev(div1, button6);
    			append_dev(div1, t12);
    			append_dev(div1, button7);
    			append_dev(div1, t14);
    			append_dev(div1, button8);
    			append_dev(div1, t16);
    			append_dev(div1, button9);
    			append_dev(div4, t17);
    			append_dev(div4, div2);
    			append_dev(div2, button10);
    			append_dev(div2, t19);
    			append_dev(div2, button11);
    			append_dev(div2, t21);
    			append_dev(div2, button12);
    			append_dev(div2, t23);
    			append_dev(div2, button13);
    			append_dev(div2, t25);
    			append_dev(div2, button14);
    			append_dev(div4, t26);
    			append_dev(div4, div3);
    			append_dev(div3, button15);
    			append_dev(div3, t28);
    			append_dev(div3, button16);
    			append_dev(div3, t30);
    			append_dev(div3, button17);
    			append_dev(div3, t32);
    			append_dev(div3, button18);
    			append_dev(div3, t33);
    			append_dev(div3, button19);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "\\alpha"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "\\theta"), false, false, false),
    					listen_dev(button2, "click", /*input*/ ctx[3].bind(this, "Theta"), false, false, false),
    					listen_dev(button3, "click", /*input*/ ctx[3].bind(this, "\\tau"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "\\gamma"), false, false, false),
    					listen_dev(button6, "click", /*input*/ ctx[3].bind(this, "\\sigma"), false, false, false),
    					listen_dev(button7, "click", /*input*/ ctx[3].bind(this, "Sigma"), false, false, false),
    					listen_dev(button8, "click", /*latexInput*/ ctx[2].bind(this, "\\varepsilon"), false, false, false),
    					listen_dev(button10, "click", /*latexInput*/ ctx[2].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button12, "click", /*input*/ ctx[3].bind(this, "\\lambda"), false, false, false),
    					listen_dev(button13, "click", /*input*/ ctx[3].bind(this, "\\beta"), false, false, false),
    					listen_dev(button15, "click", /*input*/ ctx[3].bind(this, "\\pi"), false, false, false),
    					listen_dev(button16, "click", /*latexInput*/ ctx[2].bind(this, "\\Pi"), false, false, false),
    					listen_dev(button17, "click", /*latexInput*/ ctx[2].bind(this, "\\phi"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(625:8) {#if type == \\\"8\\\"}",
    		ctx
    	});

    	return block;
    }

    // (657:8) {#if type == "9"}
    function create_if_block_6(ctx) {
    	let div6;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let button3;
    	let t5;
    	let button4;
    	let t6;
    	let div1;
    	let button5;
    	let t8;
    	let button6;
    	let t10;
    	let button7;
    	let t11;
    	let button8;
    	let t12;
    	let button9;
    	let t13;
    	let div4;
    	let button10;
    	let t15;
    	let div3;
    	let div2;
    	let t16;
    	let button11;
    	let t17;
    	let button12;
    	let t18;
    	let button13;
    	let t19;
    	let div5;
    	let button14;
    	let t21;
    	let button15;
    	let t23;
    	let button16;
    	let t24;
    	let button17;
    	let t25;
    	let button18;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "a";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "|";
    			t3 = space();
    			button2 = element("button");
    			t4 = space();
    			button3 = element("button");
    			t5 = space();
    			button4 = element("button");
    			t6 = space();
    			div1 = element("div");
    			button5 = element("button");
    			button5.textContent = "b";
    			t8 = space();
    			button6 = element("button");
    			button6.textContent = ".";
    			t10 = space();
    			button7 = element("button");
    			t11 = space();
    			button8 = element("button");
    			t12 = space();
    			button9 = element("button");
    			t13 = space();
    			div4 = element("div");
    			button10 = element("button");
    			button10.textContent = "∝";
    			t15 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t16 = space();
    			button11 = element("button");
    			t17 = space();
    			button12 = element("button");
    			t18 = space();
    			button13 = element("button");
    			t19 = space();
    			div5 = element("div");
    			button14 = element("button");
    			button14.textContent = "abc";
    			t21 = space();
    			button15 = element("button");
    			button15.textContent = "ℝ";
    			t23 = space();
    			button16 = element("button");
    			t24 = space();
    			button17 = element("button");
    			t25 = space();
    			button18 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 659, 20, 56054);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 660, 20, 56188);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 661, 20, 56310);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button3, file$1, 662, 20, 56439);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 663, 20, 56570);
    			attr_dev(div0, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div0, file$1, 658, 12, 55978);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 666, 20, 56770);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button6, file$1, 667, 20, 56904);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 668, 20, 57031);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button8, file$1, 669, 20, 57160);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button9, file$1, 670, 20, 57291);
    			attr_dev(div1, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div1, file$1, 665, 12, 56695);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 673, 20, 57493);
    			attr_dev(div2, "class", "long-division svelte-1qn0my1");
    			add_location(div2, file$1, 675, 20, 57746);
    			attr_dev(div3, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(div3, file$1, 674, 16, 57640);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button11, file$1, 677, 20, 57823);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 678, 20, 57952);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button13, file$1, 679, 20, 58083);
    			attr_dev(div4, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div4, file$1, 672, 12, 57416);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button14, file$1, 682, 20, 58270);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 683, 20, 58421);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "thrd_btn bborder_remover blue_container bborder_remover blank_color svelte-1qn0my1");
    			add_location(button16, file$1, 684, 20, 58559);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "fourth_btn blue_container tborder_remover bborder_remover blank_color svelte-1qn0my1");
    			add_location(button17, file$1, 685, 20, 58687);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button18, file$1, 686, 20, 58817);
    			attr_dev(div5, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div5, file$1, 681, 12, 58208);
    			attr_dev(div6, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div6, "id", "select_butns_9");
    			add_location(div6, file$1, 657, 8, 55902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div0, t4);
    			append_dev(div0, button3);
    			append_dev(div0, t5);
    			append_dev(div0, button4);
    			append_dev(div6, t6);
    			append_dev(div6, div1);
    			append_dev(div1, button5);
    			append_dev(div1, t8);
    			append_dev(div1, button6);
    			append_dev(div1, t10);
    			append_dev(div1, button7);
    			append_dev(div1, t11);
    			append_dev(div1, button8);
    			append_dev(div1, t12);
    			append_dev(div1, button9);
    			append_dev(div6, t13);
    			append_dev(div6, div4);
    			append_dev(div4, button10);
    			append_dev(div4, t15);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div4, t16);
    			append_dev(div4, button11);
    			append_dev(div4, t17);
    			append_dev(div4, button12);
    			append_dev(div4, t18);
    			append_dev(div4, button13);
    			append_dev(div6, t19);
    			append_dev(div6, div5);
    			append_dev(div5, button14);
    			append_dev(div5, t21);
    			append_dev(div5, button15);
    			append_dev(div5, t23);
    			append_dev(div5, button16);
    			append_dev(div5, t24);
    			append_dev(div5, button17);
    			append_dev(div5, t25);
    			append_dev(div5, button18);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*input*/ ctx[3].bind(this, "a"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "\\vert"), false, false, false),
    					listen_dev(button5, "click", /*input*/ ctx[3].bind(this, "b"), false, false, false),
    					listen_dev(button6, "click", /*latexInput*/ ctx[2].bind(this, "\\cdot"), false, false, false),
    					listen_dev(button10, "click", /*latexInput*/ ctx[2].bind(this, "\\propto"), false, false, false),
    					listen_dev(div3, "click", /*latexInput*/ ctx[2].bind(this, "\\longdiv{ }"), false, false, false),
    					listen_dev(button14, "click", /*latexInput*/ ctx[2].bind(this, "\\text{abc}"), false, false, false),
    					listen_dev(button15, "click", /*latexInput*/ ctx[2].bind(this, "\\mathbb{R}"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(657:8) {#if type == \\\"9\\\"}",
    		ctx
    	});

    	return block;
    }

    // (691:8) {#if type == "10"}
    function create_if_block_5(ctx) {
    	let div4;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t6;
    	let button4;
    	let t7;
    	let div1;
    	let button5;
    	let t9;
    	let button6;
    	let t11;
    	let button7;
    	let t13;
    	let button8;
    	let t14;
    	let button9;
    	let t15;
    	let div2;
    	let button10;
    	let t17;
    	let button11;
    	let t19;
    	let button12;
    	let t21;
    	let button13;
    	let t22;
    	let button14;
    	let t23;
    	let div3;
    	let button15;
    	let t25;
    	let button16;
    	let t27;
    	let button17;
    	let t29;
    	let button18;
    	let t30;
    	let button19;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "⌊";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "↑";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "¬";
    			t5 = space();
    			button3 = element("button");
    			t6 = space();
    			button4 = element("button");
    			t7 = space();
    			div1 = element("div");
    			button5 = element("button");
    			button5.textContent = "⌋";
    			t9 = space();
    			button6 = element("button");
    			button6.textContent = "≡";
    			t11 = space();
    			button7 = element("button");
    			button7.textContent = "∃";
    			t13 = space();
    			button8 = element("button");
    			t14 = space();
    			button9 = element("button");
    			t15 = space();
    			div2 = element("div");
    			button10 = element("button");
    			button10.textContent = "⌈";
    			t17 = space();
    			button11 = element("button");
    			button11.textContent = "∧";
    			t19 = space();
    			button12 = element("button");
    			button12.textContent = "∀";
    			t21 = space();
    			button13 = element("button");
    			t22 = space();
    			button14 = element("button");
    			t23 = space();
    			div3 = element("div");
    			button15 = element("button");
    			button15.textContent = "⌉";
    			t25 = space();
    			button16 = element("button");
    			button16.textContent = "∨";
    			t27 = space();
    			button17 = element("button");
    			button17.textContent = "⊕";
    			t29 = space();
    			button18 = element("button");
    			t30 = space();
    			button19 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 693, 20, 59131);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 694, 20, 59284);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 695, 20, 59414);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1qn0my1");
    			add_location(button3, file$1, 696, 20, 59555);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button4, file$1, 697, 20, 59670);
    			attr_dev(div0, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div0, file$1, 692, 12, 59055);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 700, 20, 59870);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button6, file$1, 701, 20, 60023);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 702, 20, 60152);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1qn0my1");
    			add_location(button8, file$1, 703, 20, 60298);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button9, file$1, 704, 20, 60413);
    			attr_dev(div1, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div1, file$1, 699, 12, 59795);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 707, 20, 60615);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button11, file$1, 708, 20, 60766);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 709, 20, 60898);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1qn0my1");
    			add_location(button13, file$1, 710, 20, 61045);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button14, file$1, 711, 20, 61160);
    			attr_dev(div2, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 706, 12, 60538);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 714, 20, 61347);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button16, file$1, 715, 20, 61493);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "thrd_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button17, file$1, 716, 20, 61622);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "fourth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button18, file$1, 717, 20, 61772);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button19, file$1, 718, 20, 61871);
    			attr_dev(div3, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div3, file$1, 713, 12, 61285);
    			attr_dev(div4, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div4, "id", "select_butns_10");
    			add_location(div4, file$1, 691, 8, 58978);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(div0, t6);
    			append_dev(div0, button4);
    			append_dev(div4, t7);
    			append_dev(div4, div1);
    			append_dev(div1, button5);
    			append_dev(div1, t9);
    			append_dev(div1, button6);
    			append_dev(div1, t11);
    			append_dev(div1, button7);
    			append_dev(div1, t13);
    			append_dev(div1, button8);
    			append_dev(div1, t14);
    			append_dev(div1, button9);
    			append_dev(div4, t15);
    			append_dev(div4, div2);
    			append_dev(div2, button10);
    			append_dev(div2, t17);
    			append_dev(div2, button11);
    			append_dev(div2, t19);
    			append_dev(div2, button12);
    			append_dev(div2, t21);
    			append_dev(div2, button13);
    			append_dev(div2, t22);
    			append_dev(div2, button14);
    			append_dev(div4, t23);
    			append_dev(div4, div3);
    			append_dev(div3, button15);
    			append_dev(div3, t25);
    			append_dev(div3, button16);
    			append_dev(div3, t27);
    			append_dev(div3, button17);
    			append_dev(div3, t29);
    			append_dev(div3, button18);
    			append_dev(div3, t30);
    			append_dev(div3, button19);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "\\lfloor"), false, false, false),
    					listen_dev(button1, "click", /*input*/ ctx[3].bind(this, "\\uparrow"), false, false, false),
    					listen_dev(button2, "click", /*input*/ ctx[3].bind(this, "\\neg"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "\\rfloor"), false, false, false),
    					listen_dev(button6, "click", /*input*/ ctx[3].bind(this, "\\equiv"), false, false, false),
    					listen_dev(button7, "click", /*input*/ ctx[3].bind(this, "\\exists"), false, false, false),
    					listen_dev(button10, "click", /*latexInput*/ ctx[2].bind(this, "\\lceil"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, "\\wedge"), false, false, false),
    					listen_dev(button12, "click", /*input*/ ctx[3].bind(this, "\\forall"), false, false, false),
    					listen_dev(button15, "click", /*input*/ ctx[3].bind(this, "\\rceil"), false, false, false),
    					listen_dev(button16, "click", /*latexInput*/ ctx[2].bind(this, "\\vee"), false, false, false),
    					listen_dev(button17, "click", /*latexInput*/ ctx[2].bind(this, "\\oplus"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(691:8) {#if type == \\\"10\\\"}",
    		ctx
    	});

    	return block;
    }

    // (723:8) {#if type == "11"}
    function create_if_block_4(ctx) {
    	let div4;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let button4;
    	let t8;
    	let div1;
    	let button5;
    	let t10;
    	let button6;
    	let t12;
    	let button7;
    	let t14;
    	let button8;
    	let t16;
    	let button9;
    	let t17;
    	let div2;
    	let button10;
    	let t19;
    	let button11;
    	let t21;
    	let button12;
    	let t22;
    	let button13;
    	let t23;
    	let button14;
    	let t24;
    	let div3;
    	let button15;
    	let t26;
    	let button16;
    	let t28;
    	let button17;
    	let t29;
    	let button18;
    	let t30;
    	let button19;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "g";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "m";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "L";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "s";
    			t7 = space();
    			button4 = element("button");
    			t8 = space();
    			div1 = element("div");
    			button5 = element("button");
    			button5.textContent = "kg";
    			t10 = space();
    			button6 = element("button");
    			button6.textContent = "km";
    			t12 = space();
    			button7 = element("button");
    			button7.textContent = "mL";
    			t14 = space();
    			button8 = element("button");
    			button8.textContent = "ms";
    			t16 = space();
    			button9 = element("button");
    			t17 = space();
    			div2 = element("div");
    			button10 = element("button");
    			button10.textContent = "mg";
    			t19 = space();
    			button11 = element("button");
    			button11.textContent = "cm";
    			t21 = space();
    			button12 = element("button");
    			t22 = space();
    			button13 = element("button");
    			t23 = space();
    			button14 = element("button");
    			t24 = space();
    			div3 = element("div");
    			button15 = element("button");
    			button15.textContent = "µg";
    			t26 = space();
    			button16 = element("button");
    			button16.textContent = "mm";
    			t28 = space();
    			button17 = element("button");
    			t29 = space();
    			button18 = element("button");
    			t30 = space();
    			button19 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 725, 20, 62195);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 726, 20, 62342);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 727, 20, 62472);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button3, file$1, 728, 20, 62618);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 729, 20, 62750);
    			attr_dev(div0, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div0, file$1, 724, 12, 62119);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 732, 20, 62950);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button6, file$1, 733, 20, 63099);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 734, 20, 63231);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "blue_container fourth_btn svelte-1qn0my1");
    			add_location(button8, file$1, 735, 20, 63379);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button9, file$1, 736, 20, 63513);
    			attr_dev(div1, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div1, file$1, 731, 12, 62875);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 739, 20, 63715);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button11, file$1, 740, 20, 63864);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 741, 20, 63996);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button13, file$1, 742, 20, 64125);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1qn0my1");
    			add_location(button14, file$1, 743, 20, 64256);
    			attr_dev(div2, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 738, 12, 63638);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "first_btn bborder_remover blue_container svelte-1qn0my1");
    			add_location(button15, file$1, 746, 20, 64459);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button16, file$1, 747, 20, 64620);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "thrd_btn bborder_remover bborder_remover blank_color svelte-1qn0my1");
    			add_location(button17, file$1, 748, 20, 64752);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "fourth_btn bborder_remover tborder_remover blank_color svelte-1qn0my1");
    			add_location(button18, file$1, 749, 20, 64865);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button19, file$1, 750, 20, 64980);
    			attr_dev(div3, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div3, file$1, 745, 12, 64397);
    			attr_dev(div4, "class", "btn-group button_designs select_changer svelte-1qn0my1");
    			attr_dev(div4, "id", "select_butns_11");
    			add_location(div4, file$1, 723, 8, 62032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(div0, t7);
    			append_dev(div0, button4);
    			append_dev(div4, t8);
    			append_dev(div4, div1);
    			append_dev(div1, button5);
    			append_dev(div1, t10);
    			append_dev(div1, button6);
    			append_dev(div1, t12);
    			append_dev(div1, button7);
    			append_dev(div1, t14);
    			append_dev(div1, button8);
    			append_dev(div1, t16);
    			append_dev(div1, button9);
    			append_dev(div4, t17);
    			append_dev(div4, div2);
    			append_dev(div2, button10);
    			append_dev(div2, t19);
    			append_dev(div2, button11);
    			append_dev(div2, t21);
    			append_dev(div2, button12);
    			append_dev(div2, t22);
    			append_dev(div2, button13);
    			append_dev(div2, t23);
    			append_dev(div2, button14);
    			append_dev(div4, t24);
    			append_dev(div4, div3);
    			append_dev(div3, button15);
    			append_dev(div3, t26);
    			append_dev(div3, button16);
    			append_dev(div3, t28);
    			append_dev(div3, button17);
    			append_dev(div3, t29);
    			append_dev(div3, button18);
    			append_dev(div3, t30);
    			append_dev(div3, button19);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "\\text{g}"), false, false, false),
    					listen_dev(button1, "click", /*latexInput*/ ctx[2].bind(this, "\\text{m}"), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[2].bind(this, "\\text{L}"), false, false, false),
    					listen_dev(button3, "click", /*latexInput*/ ctx[2].bind(this, "\\text{s}"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "\\text{kg}"), false, false, false),
    					listen_dev(button6, "click", /*latexInput*/ ctx[2].bind(this, "\\text{km}"), false, false, false),
    					listen_dev(button7, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mL}"), false, false, false),
    					listen_dev(button8, "click", /*latexInput*/ ctx[2].bind(this, "\\text{ms}"), false, false, false),
    					listen_dev(button10, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mg}"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, "\\text{cm}"), false, false, false),
    					listen_dev(button15, "click", /*latexInput*/ ctx[2].bind(this, "\\text{&micro;g}"), false, false, false),
    					listen_dev(button16, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mm}"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(723:8) {#if type == \\\"11\\\"}",
    		ctx
    	});

    	return block;
    }

    // (755:8) {#if type == "12"}
    function create_if_block_3(ctx) {
    	let div3;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t6;
    	let button4;
    	let t7;
    	let div1;
    	let button5;
    	let t9;
    	let button6;
    	let t11;
    	let button7;
    	let t13;
    	let button8;
    	let t14;
    	let button9;
    	let t15;
    	let div2;
    	let button10;
    	let t16;
    	let button11;
    	let t18;
    	let button12;
    	let t20;
    	let button13;
    	let t21;
    	let button14;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "oz";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "in";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "fl oz";
    			t5 = space();
    			button3 = element("button");
    			t6 = space();
    			button4 = element("button");
    			t7 = space();
    			div1 = element("div");
    			button5 = element("button");
    			button5.textContent = "lb";
    			t9 = space();
    			button6 = element("button");
    			button6.textContent = "ft";
    			t11 = space();
    			button7 = element("button");
    			button7.textContent = "pt";
    			t13 = space();
    			button8 = element("button");
    			t14 = space();
    			button9 = element("button");
    			t15 = space();
    			div2 = element("div");
    			button10 = element("button");
    			t16 = space();
    			button11 = element("button");
    			button11.textContent = "mi";
    			t18 = space();
    			button12 = element("button");
    			button12.textContent = "gal";
    			t20 = space();
    			button13 = element("button");
    			t21 = space();
    			button14 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 757, 20, 65294);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button1, file$1, 758, 20, 65443);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "blue_container thrd_btn bborder_remover  svelte-1qn0my1");
    			add_location(button2, file$1, 759, 20, 65575);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fourth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button3, file$1, 760, 20, 65730);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button4, file$1, 761, 20, 65845);
    			attr_dev(div0, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div0, file$1, 756, 12, 65218);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 764, 20, 66061);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button6, file$1, 765, 20, 66210);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 766, 20, 66342);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "fourth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button8, file$1, 767, 20, 66490);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button9, file$1, 768, 20, 66605);
    			attr_dev(div1, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div1, file$1, 763, 12, 65986);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "first_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button10, file$1, 771, 20, 66823);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button11, file$1, 772, 20, 66921);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "blue_container thrd_btn bborder_remover svelte-1qn0my1");
    			add_location(button12, file$1, 773, 20, 67053);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fourth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button13, file$1, 774, 20, 67203);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button14, file$1, 775, 20, 67302);
    			attr_dev(div2, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 770, 12, 66746);
    			attr_dev(div3, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div3, "id", "select_butns_12");
    			add_location(div3, file$1, 755, 8, 65141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(div0, t6);
    			append_dev(div0, button4);
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, button5);
    			append_dev(div1, t9);
    			append_dev(div1, button6);
    			append_dev(div1, t11);
    			append_dev(div1, button7);
    			append_dev(div1, t13);
    			append_dev(div1, button8);
    			append_dev(div1, t14);
    			append_dev(div1, button9);
    			append_dev(div3, t15);
    			append_dev(div3, div2);
    			append_dev(div2, button10);
    			append_dev(div2, t16);
    			append_dev(div2, button11);
    			append_dev(div2, t18);
    			append_dev(div2, button12);
    			append_dev(div2, t20);
    			append_dev(div2, button13);
    			append_dev(div2, t21);
    			append_dev(div2, button14);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "\\text{oz}"), false, false, false),
    					listen_dev(button1, "click", /*latexInput*/ ctx[2].bind(this, "\\text{in}"), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[2].bind(this, "\\text{fl oz}"), false, false, false),
    					listen_dev(button5, "click", /*latexInput*/ ctx[2].bind(this, "\\text{lb}"), false, false, false),
    					listen_dev(button6, "click", /*latexInput*/ ctx[2].bind(this, "\\text{ft}"), false, false, false),
    					listen_dev(button7, "click", /*latexInput*/ ctx[2].bind(this, "\\text{pt}"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mi}"), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[2].bind(this, "\\text{gal}"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(755:8) {#if type == \\\"12\\\"}",
    		ctx
    	});

    	return block;
    }

    // (780:8) {#if type == "13"}
    function create_if_block_2(ctx) {
    	let div9;
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let button0;
    	let t1;
    	let button1;
    	let t2;
    	let button2;
    	let t3;
    	let button3;
    	let t4;
    	let div5;
    	let div4;
    	let div3;
    	let t5;
    	let button4;
    	let t6;
    	let button5;
    	let t7;
    	let button6;
    	let t8;
    	let button7;
    	let t9;
    	let div8;
    	let div7;
    	let div6;
    	let t10;
    	let button8;
    	let t11;
    	let button9;
    	let t12;
    	let button10;
    	let t13;
    	let button11;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			button0 = element("button");
    			t1 = space();
    			button1 = element("button");
    			t2 = space();
    			button2 = element("button");
    			t3 = space();
    			button3 = element("button");
    			t4 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			t5 = space();
    			button4 = element("button");
    			t6 = space();
    			button5 = element("button");
    			t7 = space();
    			button6 = element("button");
    			t8 = space();
    			button7 = element("button");
    			t9 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			t10 = space();
    			button8 = element("button");
    			t11 = space();
    			button9 = element("button");
    			t12 = space();
    			button10 = element("button");
    			t13 = space();
    			button11 = element("button");
    			attr_dev(div0, "class", "brackets svelte-1qn0my1");
    			add_location(div0, file$1, 783, 20, 67764);
    			attr_dev(div1, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1qn0my1");
    			add_location(div1, file$1, 782, 16, 67612);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button0, file$1, 785, 20, 67836);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button1, file$1, 786, 20, 67950);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button2, file$1, 787, 20, 68064);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button3, file$1, 788, 20, 68178);
    			attr_dev(div2, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 781, 12, 67540);
    			attr_dev(div3, "class", "square-brackets svelte-1qn0my1");
    			add_location(div3, file$1, 792, 20, 68526);
    			attr_dev(div4, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1qn0my1");
    			add_location(div4, file$1, 791, 16, 68374);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button4, file$1, 794, 20, 68605);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button5, file$1, 795, 20, 68719);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button6, file$1, 796, 20, 68833);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button7, file$1, 797, 20, 68947);
    			attr_dev(div5, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div5, file$1, 790, 12, 68303);
    			attr_dev(div6, "class", "curly-brackets svelte-1qn0my1");
    			add_location(div6, file$1, 801, 20, 69301);
    			attr_dev(div7, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1qn0my1");
    			add_location(div7, file$1, 800, 16, 69145);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button8, file$1, 803, 20, 69379);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button9, file$1, 804, 20, 69477);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button10, file$1, 805, 20, 69575);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button11, file$1, 806, 20, 69673);
    			attr_dev(div8, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div8, file$1, 799, 12, 69072);
    			attr_dev(div9, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div9, "id", "select_butns_13");
    			add_location(div9, file$1, 780, 8, 67463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t0);
    			append_dev(div2, button0);
    			append_dev(div2, t1);
    			append_dev(div2, button1);
    			append_dev(div2, t2);
    			append_dev(div2, button2);
    			append_dev(div2, t3);
    			append_dev(div2, button3);
    			append_dev(div9, t4);
    			append_dev(div9, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div5, t5);
    			append_dev(div5, button4);
    			append_dev(div5, t6);
    			append_dev(div5, button5);
    			append_dev(div5, t7);
    			append_dev(div5, button6);
    			append_dev(div5, t8);
    			append_dev(div5, button7);
    			append_dev(div9, t9);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div8, t10);
    			append_dev(div8, button8);
    			append_dev(div8, t11);
    			append_dev(div8, button9);
    			append_dev(div8, t12);
    			append_dev(div8, button10);
    			append_dev(div8, t13);
    			append_dev(div8, button11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div4, "click", /*latexInput*/ ctx[2].bind(this, "\\left[\\right]"), false, false, false),
    					listen_dev(div7, "click", /*latexInput*/ ctx[2].bind(this, "\\left\\{\\right\\}"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(780:8) {#if type == \\\"13\\\"}",
    		ctx
    	});

    	return block;
    }

    // (811:8) {#if type == "14"}
    function create_if_block_1(ctx) {
    	let div12;
    	let div2;
    	let button0;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let button3;
    	let t5;
    	let div5;
    	let button4;
    	let t7;
    	let div4;
    	let div3;
    	let t8;
    	let button5;
    	let t9;
    	let button6;
    	let t10;
    	let button7;
    	let t11;
    	let div8;
    	let button8;
    	let t13;
    	let div7;
    	let div6;
    	let t14;
    	let button9;
    	let t15;
    	let button10;
    	let t16;
    	let button11;
    	let t17;
    	let div11;
    	let div10;
    	let div9;
    	let t18;
    	let button12;
    	let t20;
    	let button13;
    	let t21;
    	let button14;
    	let t22;
    	let button15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "d";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			button1 = element("button");
    			t3 = space();
    			button2 = element("button");
    			t4 = space();
    			button3 = element("button");
    			t5 = space();
    			div5 = element("div");
    			button4 = element("button");
    			button4.textContent = "f";
    			t7 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t8 = space();
    			button5 = element("button");
    			t9 = space();
    			button6 = element("button");
    			t10 = space();
    			button7 = element("button");
    			t11 = space();
    			div8 = element("div");
    			button8 = element("button");
    			button8.textContent = "Δ";
    			t13 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t14 = space();
    			button9 = element("button");
    			t15 = space();
    			button10 = element("button");
    			t16 = space();
    			button11 = element("button");
    			t17 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			t18 = space();
    			button12 = element("button");
    			button12.textContent = "∂";
    			t20 = space();
    			button13 = element("button");
    			t21 = space();
    			button14 = element("button");
    			t22 = space();
    			button15 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "first_btn blue_container bborder_remover svelte-1qn0my1");
    			add_location(button0, file$1, 813, 20, 69987);
    			attr_dev(div0, "class", "brackets svelte-1qn0my1");
    			add_location(div0, file$1, 815, 20, 70246);
    			attr_dev(div1, "class", "scnd_btn blue_container padder_remover svelte-1qn0my1");
    			add_location(div1, file$1, 814, 16, 70122);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button1, file$1, 817, 20, 70318);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button2, file$1, 818, 20, 70432);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button3, file$1, 819, 20, 70546);
    			attr_dev(div2, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div2, file$1, 812, 12, 69911);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "first_btn blue_container bborder_remover svelte-1qn0my1");
    			add_location(button4, file$1, 822, 20, 70746);
    			attr_dev(div3, "class", "integrtion svelte-1qn0my1");
    			add_location(div3, file$1, 824, 20, 71003);
    			attr_dev(div4, "class", "scnd_btn blue_container padder_remover svelte-1qn0my1");
    			add_location(div4, file$1, 823, 16, 70881);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button5, file$1, 826, 20, 71077);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button6, file$1, 827, 20, 71191);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button7, file$1, 828, 20, 71305);
    			attr_dev(div5, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div5, file$1, 821, 12, 70671);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "first_btn blue_container bborder_remover svelte-1qn0my1");
    			add_location(button8, file$1, 831, 20, 71507);
    			attr_dev(div6, "class", "sigma svelte-1qn0my1");
    			add_location(div6, file$1, 833, 20, 71772);
    			attr_dev(div7, "class", "scnd_btn blue_container padder_btn svelte-1qn0my1");
    			add_location(div7, file$1, 832, 16, 71654);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button9, file$1, 835, 20, 71841);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button10, file$1, 836, 20, 71955);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1qn0my1");
    			add_location(button11, file$1, 837, 20, 72069);
    			attr_dev(div8, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div8, file$1, 830, 12, 71430);
    			attr_dev(div9, "class", "x-button");
    			add_location(div9, file$1, 841, 20, 72374);
    			attr_dev(div10, "class", "first_btn bborder_remover padder_remover blue_container svelte-1qn0my1");
    			add_location(div10, file$1, 840, 16, 72252);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button12, file$1, 843, 20, 72446);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button13, file$1, 844, 20, 72581);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button14, file$1, 845, 20, 72679);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button15, file$1, 846, 20, 72777);
    			attr_dev(div11, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div11, file$1, 839, 12, 72194);
    			attr_dev(div12, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div12, "id", "select_butns_14");
    			add_location(div12, file$1, 811, 8, 69834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t2);
    			append_dev(div2, button1);
    			append_dev(div2, t3);
    			append_dev(div2, button2);
    			append_dev(div2, t4);
    			append_dev(div2, button3);
    			append_dev(div12, t5);
    			append_dev(div12, div5);
    			append_dev(div5, button4);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div5, t8);
    			append_dev(div5, button5);
    			append_dev(div5, t9);
    			append_dev(div5, button6);
    			append_dev(div5, t10);
    			append_dev(div5, button7);
    			append_dev(div12, t11);
    			append_dev(div12, div8);
    			append_dev(div8, button8);
    			append_dev(div8, t13);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div8, t14);
    			append_dev(div8, button9);
    			append_dev(div8, t15);
    			append_dev(div8, button10);
    			append_dev(div8, t16);
    			append_dev(div8, button11);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div11, t18);
    			append_dev(div11, button12);
    			append_dev(div11, t20);
    			append_dev(div11, button13);
    			append_dev(div11, t21);
    			append_dev(div11, button14);
    			append_dev(div11, t22);
    			append_dev(div11, button15);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*latexInput*/ ctx[2].bind(this, "d"), false, false, false),
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button4, "click", /*latexInput*/ ctx[2].bind(this, "f"), false, false, false),
    					listen_dev(div4, "click", /*latexInput*/ ctx[2].bind(this, "\\int_{ }^{ }"), false, false, false),
    					listen_dev(button8, "click", /*latexInput*/ ctx[2].bind(this, "\\Delta"), false, false, false),
    					listen_dev(div7, "click", /*latexInput*/ ctx[2].bind(this, "\\sum_{ }^{ }"), false, false, false),
    					listen_dev(div10, "click", /*input*/ ctx[3].bind(this, "/"), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[2].bind(this, "\\partial"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(811:8) {#if type == \\\"14\\\"}",
    		ctx
    	});

    	return block;
    }

    // (851:8) {#if type == "15"}
    function create_if_block$1(ctx) {
    	let div16;
    	let div4;
    	let div1;
    	let div0;
    	let t0;
    	let button0;
    	let t2;
    	let div3;
    	let div2;
    	let t3;
    	let button1;
    	let t4;
    	let button2;
    	let t5;
    	let div7;
    	let div6;
    	let div5;
    	let t6;
    	let button3;
    	let t8;
    	let button4;
    	let t10;
    	let button5;
    	let t11;
    	let button6;
    	let t12;
    	let div10;
    	let div9;
    	let div8;
    	let t13;
    	let button7;
    	let t15;
    	let button8;
    	let t17;
    	let button9;
    	let t18;
    	let button10;
    	let t19;
    	let div15;
    	let div12;
    	let div11;
    	let t20;
    	let button11;
    	let t22;
    	let div14;
    	let div13;
    	let t23;
    	let button12;
    	let t24;
    	let button13;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "→";
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t3 = space();
    			button1 = element("button");
    			t4 = space();
    			button2 = element("button");
    			t5 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "←";
    			t8 = space();
    			button4 = element("button");
    			button4.textContent = "mol";
    			t10 = space();
    			button5 = element("button");
    			t11 = space();
    			button6 = element("button");
    			t12 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			t13 = space();
    			button7 = element("button");
    			button7.textContent = "⇌";
    			t15 = space();
    			button8 = element("button");
    			button8.textContent = "'";
    			t17 = space();
    			button9 = element("button");
    			t18 = space();
    			button10 = element("button");
    			t19 = space();
    			div15 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			t20 = space();
    			button11 = element("button");
    			button11.textContent = "↔";
    			t22 = space();
    			div14 = element("div");
    			div13 = element("div");
    			t23 = space();
    			button12 = element("button");
    			t24 = space();
    			button13 = element("button");
    			attr_dev(div0, "class", "h-sup svelte-1qn0my1");
    			add_location(div0, file$1, 854, 20, 73214);
    			attr_dev(div1, "class", "blue_container first_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div1, file$1, 853, 16, 73087);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button0, file$1, 856, 20, 73283);
    			attr_dev(div2, "class", "x-power-y svelte-1qn0my1");
    			add_location(div2, file$1, 858, 20, 73567);
    			attr_dev(div3, "class", "thrd_btn bborder_remover blue_container bborder_adder padder_less svelte-1qn0my1");
    			add_location(div3, file$1, 857, 16, 73412);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button1, file$1, 860, 20, 73640);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button2, file$1, 861, 20, 73754);
    			attr_dev(div4, "class", "column_five blue_container columns_design svelte-1qn0my1");
    			add_location(div4, file$1, 852, 12, 73015);
    			attr_dev(div5, "class", "h-sub svelte-1qn0my1");
    			add_location(div5, file$1, 865, 20, 74065);
    			attr_dev(div6, "class", "blue_container first_btn bborder_remover svelte-1qn0my1");
    			add_location(div6, file$1, 864, 16, 73950);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button3, file$1, 867, 20, 74134);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "blue_container thrd_btn bborder_remover bborder_adder svelte-1qn0my1");
    			add_location(button4, file$1, 868, 20, 74266);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button5, file$1, 869, 20, 74430);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button6, file$1, 870, 20, 74544);
    			attr_dev(div7, "class", "column_six blue_container columns_design svelte-1qn0my1");
    			add_location(div7, file$1, 863, 12, 73879);
    			attr_dev(div8, "class", "h-sup-sub svelte-1qn0my1");
    			add_location(div8, file$1, 874, 20, 74875);
    			attr_dev(div9, "class", "blue_container first_btn bborder_remover padder_less svelte-1qn0my1");
    			add_location(div9, file$1, 873, 16, 74742);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "blue_container scnd_btn svelte-1qn0my1");
    			add_location(button7, file$1, 876, 20, 74948);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "thrd_btn bborder_remover blue_container bborder_adder svelte-1qn0my1");
    			add_location(button8, file$1, 877, 20, 75094);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button9, file$1, 878, 20, 75247);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1qn0my1");
    			add_location(button10, file$1, 879, 20, 75361);
    			attr_dev(div10, "class", "column_seven blue_container columns_design svelte-1qn0my1");
    			add_location(div10, file$1, 872, 12, 74669);
    			attr_dev(div11, "class", "h-power svelte-1qn0my1");
    			add_location(div11, file$1, 883, 20, 75681);
    			attr_dev(div12, "class", "first_btn bborder_remover padder_less blue_container svelte-1qn0my1");
    			add_location(div12, file$1, 882, 16, 75544);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "scnd_btn blue_container svelte-1qn0my1");
    			add_location(button11, file$1, 885, 20, 75752);
    			attr_dev(div13, "class", "h-bar svelte-1qn0my1");
    			add_location(div13, file$1, 887, 20, 76047);
    			attr_dev(div14, "class", "thrd_btn bborder_remover padder_less bborder_adder blue_container svelte-1qn0my1");
    			add_location(div14, file$1, 886, 16, 75894);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button12, file$1, 889, 20, 76116);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "fifth_btn bborder_remover blank_color svelte-1qn0my1");
    			add_location(button13, file$1, 890, 20, 76214);
    			attr_dev(div15, "class", "column_eight columns_design svelte-1qn0my1");
    			add_location(div15, file$1, 881, 12, 75486);
    			attr_dev(div16, "class", "button_designs select_changer svelte-1qn0my1");
    			attr_dev(div16, "id", "select_butns_15");
    			add_location(div16, file$1, 851, 8, 72938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div4, t0);
    			append_dev(div4, button0);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div4, t3);
    			append_dev(div4, button1);
    			append_dev(div4, t4);
    			append_dev(div4, button2);
    			append_dev(div16, t5);
    			append_dev(div16, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div7, t6);
    			append_dev(div7, button3);
    			append_dev(div7, t8);
    			append_dev(div7, button4);
    			append_dev(div7, t10);
    			append_dev(div7, button5);
    			append_dev(div7, t11);
    			append_dev(div7, button6);
    			append_dev(div16, t12);
    			append_dev(div16, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div10, t13);
    			append_dev(div10, button7);
    			append_dev(div10, t15);
    			append_dev(div10, button8);
    			append_dev(div10, t17);
    			append_dev(div10, button9);
    			append_dev(div10, t18);
    			append_dev(div10, button10);
    			append_dev(div16, t19);
    			append_dev(div16, div15);
    			append_dev(div15, div12);
    			append_dev(div12, div11);
    			append_dev(div15, t20);
    			append_dev(div15, button11);
    			append_dev(div15, t22);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div15, t23);
    			append_dev(div15, button12);
    			append_dev(div15, t24);
    			append_dev(div15, button13);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*latexInput*/ ctx[2].bind(this, "^{}"), false, false, false),
    					listen_dev(button0, "click", /*input*/ ctx[3].bind(this, "\\rightarrow"), false, false, false),
    					listen_dev(div3, "click", /*latexInput*/ ctx[2].bind(this, "\\xrightarrow[]\\{}"), false, false, false),
    					listen_dev(div6, "click", /*latexInput*/ ctx[2].bind(this, "_{}"), false, false, false),
    					listen_dev(button3, "click", /*input*/ ctx[3].bind(this, "\\leftarrow"), false, false, false),
    					listen_dev(button4, "click", /*latexInput*/ ctx[2].bind(this, "\\text{mol}"), false, false, false),
    					listen_dev(div9, "click", /*latexInput*/ ctx[2].bind(this, "\\_{ }^{ }"), false, false, false),
    					listen_dev(button7, "click", /*latexInput*/ ctx[2].bind(this, "\\rightleftharpoons"), false, false, false),
    					listen_dev(button8, "click", /*input*/ ctx[3].bind(this, "\\prime"), false, false, false),
    					listen_dev(div12, "click", /*latexInput*/ ctx[2].bind(this, "\\_{ }{}\\^{ }"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, "\\longleftrightarrow"), false, false, false),
    					listen_dev(div14, "click", /*latexInput*/ ctx[2].bind(this, "\\overset{ }\\{ }"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(851:8) {#if type == \\\"15\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div12;
    	let div2;
    	let div1;
    	let div0;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let t2;
    	let span3;
    	let t3;
    	let button0;
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
    	let t20;
    	let div4;
    	let t21;
    	let div11;
    	let div10;
    	let div6;
    	let button1;
    	let t23;
    	let button2;
    	let t25;
    	let button3;
    	let t27;
    	let button4;
    	let t29;
    	let button5;
    	let span4;
    	let i0;
    	let t30;
    	let div7;
    	let button6;
    	let t32;
    	let button7;
    	let t34;
    	let button8;
    	let t36;
    	let button9;
    	let t38;
    	let button10;
    	let span5;
    	let i1;
    	let t39;
    	let div8;
    	let button11;
    	let t41;
    	let button12;
    	let t43;
    	let button13;
    	let t45;
    	let button14;
    	let t47;
    	let button15;
    	let span6;
    	let i2;
    	let t48;
    	let div9;
    	let button16;
    	let t50;
    	let button17;
    	let t52;
    	let button18;
    	let t54;
    	let button19;
    	let t56;
    	let button20;
    	let t58;
    	let t59;
    	let t60;
    	let t61;
    	let t62;
    	let t63;
    	let t64;
    	let t65;
    	let t66;
    	let t67;
    	let t68;
    	let t69;
    	let t70;
    	let t71;
    	let t72;
    	let mounted;
    	let dispose;
    	let if_block0 = /*type*/ ctx[1] == "1" && create_if_block_14(ctx);
    	let if_block1 = /*type*/ ctx[1] == "2" && create_if_block_13(ctx);
    	let if_block2 = /*type*/ ctx[1] == "3" && create_if_block_12(ctx);
    	let if_block3 = /*type*/ ctx[1] == "4" && create_if_block_11(ctx);
    	let if_block4 = /*type*/ ctx[1] == "5" && create_if_block_10(ctx);
    	let if_block5 = /*type*/ ctx[1] == "6" && create_if_block_9(ctx);
    	let if_block6 = /*type*/ ctx[1] == "7" && create_if_block_8(ctx);
    	let if_block7 = /*type*/ ctx[1] == "8" && create_if_block_7(ctx);
    	let if_block8 = /*type*/ ctx[1] == "9" && create_if_block_6(ctx);
    	let if_block9 = /*type*/ ctx[1] == "10" && create_if_block_5(ctx);
    	let if_block10 = /*type*/ ctx[1] == "11" && create_if_block_4(ctx);
    	let if_block11 = /*type*/ ctx[1] == "12" && create_if_block_3(ctx);
    	let if_block12 = /*type*/ ctx[1] == "13" && create_if_block_2(ctx);
    	let if_block13 = /*type*/ ctx[1] == "14" && create_if_block_1(ctx);
    	let if_block14 = /*type*/ ctx[1] == "15" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			t2 = space();
    			span3 = element("span");
    			t3 = space();
    			button0 = element("button");
    			t4 = space();
    			div5 = element("div");
    			div3 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = `${l.Allsymbols}`;
    			option1 = element("option");
    			option1.textContent = `${l.Basic}`;
    			option2 = element("option");
    			option2.textContent = `${l.xvariables}`;
    			option3 = element("option");
    			option3.textContent = "<";
    			option4 = element("option");
    			option4.textContent = "∠";
    			option5 = element("option");
    			option5.textContent = "⋂";
    			option6 = element("option");
    			option6.textContent = `${l.sin}`;
    			option7 = element("option");
    			option7.textContent = "α";
    			option8 = element("option");
    			option8.textContent = `${l.Misc}`;
    			option9 = element("option");
    			option9.textContent = `${l.Discrete}`;
    			option10 = element("option");
    			option10.textContent = `${l.kg}`;
    			option11 = element("option");
    			option11.textContent = `${l.lb}`;
    			option12 = element("option");
    			option12.textContent = `${l.brackets}`;
    			option13 = element("option");
    			option13.textContent = "Δ";
    			option14 = element("option");
    			option14.textContent = `${l.chem}`;
    			t20 = space();
    			div4 = element("div");
    			t21 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "7";
    			t23 = space();
    			button2 = element("button");
    			button2.textContent = "4";
    			t25 = space();
    			button3 = element("button");
    			button3.textContent = "1";
    			t27 = space();
    			button4 = element("button");
    			button4.textContent = "0";
    			t29 = space();
    			button5 = element("button");
    			span4 = element("span");
    			i0 = element("i");
    			t30 = space();
    			div7 = element("div");
    			button6 = element("button");
    			button6.textContent = "8";
    			t32 = space();
    			button7 = element("button");
    			button7.textContent = "5";
    			t34 = space();
    			button8 = element("button");
    			button8.textContent = "2";
    			t36 = space();
    			button9 = element("button");
    			button9.textContent = ".";
    			t38 = space();
    			button10 = element("button");
    			span5 = element("span");
    			i1 = element("i");
    			t39 = space();
    			div8 = element("div");
    			button11 = element("button");
    			button11.textContent = "9";
    			t41 = space();
    			button12 = element("button");
    			button12.textContent = "6";
    			t43 = space();
    			button13 = element("button");
    			button13.textContent = "3";
    			t45 = space();
    			button14 = element("button");
    			button14.textContent = ",";
    			t47 = space();
    			button15 = element("button");
    			span6 = element("span");
    			i2 = element("i");
    			t48 = space();
    			div9 = element("div");
    			button16 = element("button");
    			button16.textContent = "÷";
    			t50 = space();
    			button17 = element("button");
    			button17.textContent = "×";
    			t52 = space();
    			button18 = element("button");
    			button18.textContent = "-";
    			t54 = space();
    			button19 = element("button");
    			button19.textContent = "+";
    			t56 = space();
    			button20 = element("button");
    			button20.textContent = "=";
    			t58 = space();
    			if (if_block0) if_block0.c();
    			t59 = space();
    			if (if_block1) if_block1.c();
    			t60 = space();
    			if (if_block2) if_block2.c();
    			t61 = space();
    			if (if_block3) if_block3.c();
    			t62 = space();
    			if (if_block4) if_block4.c();
    			t63 = space();
    			if (if_block5) if_block5.c();
    			t64 = space();
    			if (if_block6) if_block6.c();
    			t65 = space();
    			if (if_block7) if_block7.c();
    			t66 = space();
    			if (if_block8) if_block8.c();
    			t67 = space();
    			if (if_block9) if_block9.c();
    			t68 = space();
    			if (if_block10) if_block10.c();
    			t69 = space();
    			if (if_block11) if_block11.c();
    			t70 = space();
    			if (if_block12) if_block12.c();
    			t71 = space();
    			if (if_block13) if_block13.c();
    			t72 = space();
    			if (if_block14) if_block14.c();
    			attr_dev(span0, "class", "dots svelte-1qn0my1");
    			add_location(span0, file$1, 72, 16, 2053);
    			attr_dev(span1, "class", "dots svelte-1qn0my1");
    			add_location(span1, file$1, 73, 16, 2096);
    			attr_dev(span2, "class", "dots svelte-1qn0my1");
    			add_location(span2, file$1, 74, 16, 2139);
    			attr_dev(span3, "class", "dots svelte-1qn0my1");
    			add_location(span3, file$1, 75, 16, 2182);
    			attr_dev(div0, "class", "dots_container svelte-1qn0my1");
    			add_location(div0, file$1, 71, 12, 2008);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "icomoon-24px-incorrect-2 close_toolbar svelte-1qn0my1");
    			add_location(button0, file$1, 77, 16, 2244);
    			attr_dev(div1, "class", "draggable_area svelte-1qn0my1");
    			add_location(div1, file$1, 70, 8, 1943);
    			attr_dev(div2, "class", "upper_part_toolbar");
    			add_location(div2, file$1, 69, 4, 1902);
    			option0.__value = "1";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 83, 16, 2535);
    			option1.__value = "2";
    			option1.value = option1.__value;
    			option1.selected = "selected";
    			add_location(option1, file$1, 84, 16, 2593);
    			option2.__value = "3";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 85, 16, 2666);
    			option3.__value = "4";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 86, 16, 2724);
    			option4.__value = "5";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 87, 16, 2772);
    			option5.__value = "6";
    			option5.value = option5.__value;
    			add_location(option5, file$1, 88, 16, 2821);
    			option6.__value = "7";
    			option6.value = option6.__value;
    			add_location(option6, file$1, 89, 16, 2872);
    			option7.__value = "8";
    			option7.value = option7.__value;
    			add_location(option7, file$1, 90, 16, 2923);
    			option8.__value = "9";
    			option8.value = option8.__value;
    			add_location(option8, file$1, 91, 16, 2974);
    			option9.__value = "10";
    			option9.value = option9.__value;
    			add_location(option9, file$1, 92, 16, 3026);
    			option10.__value = "11";
    			option10.value = option10.__value;
    			add_location(option10, file$1, 93, 16, 3083);
    			option11.__value = "12";
    			option11.value = option11.__value;
    			add_location(option11, file$1, 94, 16, 3134);
    			option12.__value = "13";
    			option12.value = option12.__value;
    			add_location(option12, file$1, 95, 16, 3185);
    			option13.__value = "14";
    			option13.value = option13.__value;
    			add_location(option13, file$1, 96, 16, 3242);
    			option14.__value = "15";
    			option14.value = option14.__value;
    			add_location(option14, file$1, 97, 16, 3294);
    			attr_dev(select, "name", "basic_select");
    			attr_dev(select, "id", "selectbox");
    			attr_dev(select, "class", "option_selectbox svelte-1qn0my1");
    			if (/*type*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[10].call(select));
    			add_location(select, file$1, 82, 12, 2432);
    			attr_dev(div3, "class", "select_area svelte-1qn0my1");
    			add_location(div3, file$1, 81, 8, 2394);
    			attr_dev(div4, "class", "show_text_area svelte-1qn0my1");
    			add_location(div4, file$1, 100, 8, 3376);
    			attr_dev(div5, "class", "toolbar_types_area svelte-1qn0my1");
    			add_location(div5, file$1, 80, 4, 2353);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "first_btn bborder_remover orange_container svelte-1qn0my1");
    			add_location(button1, file$1, 105, 20, 3591);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "scnd_btn orange_container svelte-1qn0my1");
    			add_location(button2, file$1, 106, 20, 3731);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "thrd_btn bborder_remover orange_container svelte-1qn0my1");
    			add_location(button3, file$1, 107, 20, 3854);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fourth_btn orange_container svelte-1qn0my1");
    			add_location(button4, file$1, 108, 20, 3993);
    			attr_dev(i0, "class", "icomoon-arrow-left");
    			add_location(i0, file$1, 110, 26, 4271);
    			add_location(span4, file$1, 110, 20, 4265);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "fifth_btn bborder_remover light_purpl_container svelte-1qn0my1");
    			add_location(button5, file$1, 109, 20, 4118);
    			attr_dev(div6, "class", "column_one columns_design svelte-1qn0my1");
    			add_location(div6, file$1, 104, 12, 3531);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "first_btn bborder_remover orange_container svelte-1qn0my1");
    			add_location(button6, file$1, 114, 20, 4430);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "scnd_btn orange_container svelte-1qn0my1");
    			add_location(button7, file$1, 115, 20, 4570);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "thrd_btn bborder_remover orange_container svelte-1qn0my1");
    			add_location(button8, file$1, 116, 20, 4693);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fourth_btn orange_container svelte-1qn0my1");
    			add_location(button9, file$1, 117, 20, 4832);
    			attr_dev(i1, "class", "icomoon-arrow-right-2");
    			add_location(i1, file$1, 119, 26, 5106);
    			add_location(span5, file$1, 119, 20, 5100);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "fifth_btn bborder_remover light_purpl_container svelte-1qn0my1");
    			add_location(button10, file$1, 118, 20, 4954);
    			attr_dev(div7, "class", "column_two columns_design svelte-1qn0my1");
    			add_location(div7, file$1, 113, 12, 4370);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "first_btn bborder_remover orange_container svelte-1qn0my1");
    			add_location(button11, file$1, 123, 20, 5270);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "scnd_btn orange_container svelte-1qn0my1");
    			add_location(button12, file$1, 124, 20, 5409);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "thrd_btn bborder_remover orange_container svelte-1qn0my1");
    			add_location(button13, file$1, 125, 20, 5532);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fourth_btn orange_container svelte-1qn0my1");
    			add_location(button14, file$1, 126, 20, 5671);
    			attr_dev(i2, "class", " icomoon-backspace-2");
    			add_location(i2, file$1, 128, 26, 5945);
    			add_location(span6, file$1, 128, 20, 5939);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "fifth_btn bborder_remover light_purpl_container svelte-1qn0my1");
    			add_location(button15, file$1, 127, 20, 5793);
    			attr_dev(div8, "class", "column_three columns_design svelte-1qn0my1");
    			add_location(div8, file$1, 122, 12, 5208);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "first_btn bborder_remover hovr_btn svelte-1qn0my1");
    			add_location(button16, file$1, 132, 20, 6107);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "scnd_btn hovr_btn svelte-1qn0my1");
    			add_location(button17, file$1, 133, 20, 6245);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "thrd_btn bborder_remover hovr_btn svelte-1qn0my1");
    			add_location(button18, file$1, 134, 20, 6363);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "fourth_btn hovr_btn svelte-1qn0my1");
    			add_location(button19, file$1, 135, 20, 6490);
    			attr_dev(button20, "type", "button");
    			attr_dev(button20, "class", "fifth_btn bborder_remover hovr_btn svelte-1qn0my1");
    			add_location(button20, file$1, 136, 20, 6603);
    			attr_dev(div9, "class", "column_four columns_design svelte-1qn0my1");
    			add_location(div9, file$1, 131, 12, 6046);
    			attr_dev(div10, "class", "btn-group button_designs font_changer svelte-1qn0my1");
    			add_location(div10, file$1, 103, 8, 3467);
    			attr_dev(div11, "class", "lower_part_toolbar svelte-1qn0my1");
    			add_location(div11, file$1, 102, 4, 3426);
    			attr_dev(div12, "class", "toolbar_container_one svelte-1qn0my1");
    			attr_dev(div12, "id", "toolbar_container_one");
    			toggle_class(div12, "d-none", !/*display*/ ctx[0]);
    			add_location(div12, file$1, 68, 0, 1811);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t0);
    			append_dev(div0, span1);
    			append_dev(div0, t1);
    			append_dev(div0, span2);
    			append_dev(div0, t2);
    			append_dev(div0, span3);
    			append_dev(div1, t3);
    			append_dev(div1, button0);
    			append_dev(div12, t4);
    			append_dev(div12, div5);
    			append_dev(div5, div3);
    			append_dev(div3, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			append_dev(select, option8);
    			append_dev(select, option9);
    			append_dev(select, option10);
    			append_dev(select, option11);
    			append_dev(select, option12);
    			append_dev(select, option13);
    			append_dev(select, option14);
    			select_option(select, /*type*/ ctx[1]);
    			append_dev(div5, t20);
    			append_dev(div5, div4);
    			append_dev(div12, t21);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div6);
    			append_dev(div6, button1);
    			append_dev(div6, t23);
    			append_dev(div6, button2);
    			append_dev(div6, t25);
    			append_dev(div6, button3);
    			append_dev(div6, t27);
    			append_dev(div6, button4);
    			append_dev(div6, t29);
    			append_dev(div6, button5);
    			append_dev(button5, span4);
    			append_dev(span4, i0);
    			append_dev(div10, t30);
    			append_dev(div10, div7);
    			append_dev(div7, button6);
    			append_dev(div7, t32);
    			append_dev(div7, button7);
    			append_dev(div7, t34);
    			append_dev(div7, button8);
    			append_dev(div7, t36);
    			append_dev(div7, button9);
    			append_dev(div7, t38);
    			append_dev(div7, button10);
    			append_dev(button10, span5);
    			append_dev(span5, i1);
    			append_dev(div10, t39);
    			append_dev(div10, div8);
    			append_dev(div8, button11);
    			append_dev(div8, t41);
    			append_dev(div8, button12);
    			append_dev(div8, t43);
    			append_dev(div8, button13);
    			append_dev(div8, t45);
    			append_dev(div8, button14);
    			append_dev(div8, t47);
    			append_dev(div8, button15);
    			append_dev(button15, span6);
    			append_dev(span6, i2);
    			append_dev(div10, t48);
    			append_dev(div10, div9);
    			append_dev(div9, button16);
    			append_dev(div9, t50);
    			append_dev(div9, button17);
    			append_dev(div9, t52);
    			append_dev(div9, button18);
    			append_dev(div9, t54);
    			append_dev(div9, button19);
    			append_dev(div9, t56);
    			append_dev(div9, button20);
    			append_dev(div11, t58);
    			if (if_block0) if_block0.m(div11, null);
    			append_dev(div11, t59);
    			if (if_block1) if_block1.m(div11, null);
    			append_dev(div11, t60);
    			if (if_block2) if_block2.m(div11, null);
    			append_dev(div11, t61);
    			if (if_block3) if_block3.m(div11, null);
    			append_dev(div11, t62);
    			if (if_block4) if_block4.m(div11, null);
    			append_dev(div11, t63);
    			if (if_block5) if_block5.m(div11, null);
    			append_dev(div11, t64);
    			if (if_block6) if_block6.m(div11, null);
    			append_dev(div11, t65);
    			if (if_block7) if_block7.m(div11, null);
    			append_dev(div11, t66);
    			if (if_block8) if_block8.m(div11, null);
    			append_dev(div11, t67);
    			if (if_block9) if_block9.m(div11, null);
    			append_dev(div11, t68);
    			if (if_block10) if_block10.m(div11, null);
    			append_dev(div11, t69);
    			if (if_block11) if_block11.m(div11, null);
    			append_dev(div11, t70);
    			if (if_block12) if_block12.m(div11, null);
    			append_dev(div11, t71);
    			if (if_block13) if_block13.m(div11, null);
    			append_dev(div11, t72);
    			if (if_block14) if_block14.m(div11, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*closeToolbar*/ ctx[5], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[10]),
    					listen_dev(button1, "click", /*latexInput*/ ctx[2].bind(this, 7), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[2].bind(this, 4), false, false, false),
    					listen_dev(button3, "click", /*latexInput*/ ctx[2].bind(this, 1), false, false, false),
    					listen_dev(button4, "click", /*latexInput*/ ctx[2].bind(this, 0), false, false, false),
    					listen_dev(button5, "click", /*cursorEvent*/ ctx[4].bind(this, "cursorBack"), false, false, false),
    					listen_dev(button6, "click", /*latexInput*/ ctx[2].bind(this, 8), false, false, false),
    					listen_dev(button7, "click", /*latexInput*/ ctx[2].bind(this, 5), false, false, false),
    					listen_dev(button8, "click", /*latexInput*/ ctx[2].bind(this, 2), false, false, false),
    					listen_dev(button9, "click", /*input*/ ctx[3].bind(this, "."), false, false, false),
    					listen_dev(button10, "click", /*cursorEvent*/ ctx[4].bind(this, "cursorFor"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[2].bind(this, 9), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[2].bind(this, 6), false, false, false),
    					listen_dev(button13, "click", /*latexInput*/ ctx[2].bind(this, 3), false, false, false),
    					listen_dev(button14, "click", /*input*/ ctx[3].bind(this, ","), false, false, false),
    					listen_dev(button15, "click", /*cursorEvent*/ ctx[4].bind(this, "backspace"), false, false, false),
    					listen_dev(button16, "click", /*input*/ ctx[3].bind(this, "\\div"), false, false, false),
    					listen_dev(button17, "click", /*input*/ ctx[3].bind(this, "×"), false, false, false),
    					listen_dev(button18, "click", /*input*/ ctx[3].bind(this, "-"), false, false, false),
    					listen_dev(button19, "click", /*input*/ ctx[3].bind(this, "+"), false, false, false),
    					listen_dev(button20, "click", /*input*/ ctx[3].bind(this, "="), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*type*/ 2) {
    				select_option(select, /*type*/ ctx[1]);
    			}

    			if (/*type*/ ctx[1] == "1") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_14(ctx);
    					if_block0.c();
    					if_block0.m(div11, t59);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*type*/ ctx[1] == "2") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_13(ctx);
    					if_block1.c();
    					if_block1.m(div11, t60);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*type*/ ctx[1] == "3") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_12(ctx);
    					if_block2.c();
    					if_block2.m(div11, t61);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*type*/ ctx[1] == "4") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_11(ctx);
    					if_block3.c();
    					if_block3.m(div11, t62);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*type*/ ctx[1] == "5") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_10(ctx);
    					if_block4.c();
    					if_block4.m(div11, t63);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*type*/ ctx[1] == "6") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_9(ctx);
    					if_block5.c();
    					if_block5.m(div11, t64);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*type*/ ctx[1] == "7") {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_8(ctx);
    					if_block6.c();
    					if_block6.m(div11, t65);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*type*/ ctx[1] == "8") {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_7(ctx);
    					if_block7.c();
    					if_block7.m(div11, t66);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*type*/ ctx[1] == "9") {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_6(ctx);
    					if_block8.c();
    					if_block8.m(div11, t67);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*type*/ ctx[1] == "10") {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_5(ctx);
    					if_block9.c();
    					if_block9.m(div11, t68);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*type*/ ctx[1] == "11") {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_4(ctx);
    					if_block10.c();
    					if_block10.m(div11, t69);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*type*/ ctx[1] == "12") {
    				if (if_block11) {
    					if_block11.p(ctx, dirty);
    				} else {
    					if_block11 = create_if_block_3(ctx);
    					if_block11.c();
    					if_block11.m(div11, t70);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*type*/ ctx[1] == "13") {
    				if (if_block12) {
    					if_block12.p(ctx, dirty);
    				} else {
    					if_block12 = create_if_block_2(ctx);
    					if_block12.c();
    					if_block12.m(div11, t71);
    				}
    			} else if (if_block12) {
    				if_block12.d(1);
    				if_block12 = null;
    			}

    			if (/*type*/ ctx[1] == "14") {
    				if (if_block13) {
    					if_block13.p(ctx, dirty);
    				} else {
    					if_block13 = create_if_block_1(ctx);
    					if_block13.c();
    					if_block13.m(div11, t72);
    				}
    			} else if (if_block13) {
    				if_block13.d(1);
    				if_block13 = null;
    			}

    			if (/*type*/ ctx[1] == "15") {
    				if (if_block14) {
    					if_block14.p(ctx, dirty);
    				} else {
    					if_block14 = create_if_block$1(ctx);
    					if_block14.c();
    					if_block14.m(div11, null);
    				}
    			} else if (if_block14) {
    				if_block14.d(1);
    				if_block14 = null;
    			}

    			if (dirty & /*display*/ 1) {
    				toggle_class(div12, "d-none", !/*display*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();
    			if (if_block13) if_block13.d();
    			if (if_block14) if_block14.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FillInTheBlanksToolbar", slots, []);
    	let { spanId } = $$props;
    	let { divId } = $$props;
    	let { action } = $$props;
    	let { show } = $$props;
    	let { display = true } = $$props;
    	let state = {};
    	let type;
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
    		let customKeyDownEvent = new Event("keydown");
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

    	const writable_props = ["spanId", "divId", "action", "show", "display"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FillInTheBlanksToolbar> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		type = select_value(this);
    		$$invalidate(1, type);
    	}

    	$$self.$$set = $$props => {
    		if ("spanId" in $$props) $$invalidate(6, spanId = $$props.spanId);
    		if ("divId" in $$props) $$invalidate(7, divId = $$props.divId);
    		if ("action" in $$props) $$invalidate(8, action = $$props.action);
    		if ("show" in $$props) $$invalidate(9, show = $$props.show);
    		if ("display" in $$props) $$invalidate(0, display = $$props.display);
    	};

    	$$self.$capture_state = () => ({
    		l,
    		beforeUpdate,
    		onMount,
    		writable,
    		AH,
    		spanId,
    		divId,
    		action,
    		show,
    		display,
    		state,
    		type,
    		hdd,
    		unsubscribe,
    		latexInput,
    		input,
    		cursorEvent,
    		closeToolbar
    	});

    	$$self.$inject_state = $$props => {
    		if ("spanId" in $$props) $$invalidate(6, spanId = $$props.spanId);
    		if ("divId" in $$props) $$invalidate(7, divId = $$props.divId);
    		if ("action" in $$props) $$invalidate(8, action = $$props.action);
    		if ("show" in $$props) $$invalidate(9, show = $$props.show);
    		if ("display" in $$props) $$invalidate(0, display = $$props.display);
    		if ("state" in $$props) state = $$props.state;
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("hdd" in $$props) hdd = $$props.hdd;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(1, type = "1");

    	return [
    		display,
    		type,
    		latexInput,
    		input,
    		cursorEvent,
    		closeToolbar,
    		spanId,
    		divId,
    		action,
    		show,
    		select_change_handler
    	];
    }

    class FillInTheBlanksToolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1qn0my1-style")) add_css$1();

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			spanId: 6,
    			divId: 7,
    			action: 8,
    			show: 9,
    			display: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FillInTheBlanksToolbar",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*spanId*/ ctx[6] === undefined && !("spanId" in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'spanId'");
    		}

    		if (/*divId*/ ctx[7] === undefined && !("divId" in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'divId'");
    		}

    		if (/*action*/ ctx[8] === undefined && !("action" in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'action'");
    		}

    		if (/*show*/ ctx[9] === undefined && !("show" in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'show'");
    		}
    	}

    	get spanId() {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanId(value) {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get divId() {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set divId(value) {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get display() {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display(value) {
    		throw new Error("<FillInTheBlanksToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    var css_248z = "/*\r\n * MathQuill master                http://mathquill.com\r\n * by Han, Jeanine, and Mary  maintainers@mathquill.com\r\n *\r\n * This Source Code Form is subject to the terms of the\r\n * Mozilla Public License, v. 2.0. If a copy of the MPL\r\n * was not distributed with this file, You can obtain\r\n * one at http://mozilla.org/MPL/2.0/.\r\n */\r\n@font-face {\r\n  font-family: Symbola;\r\n  src: url(font/Symbola.eot);\r\n  src: local(\"Symbola Regular\"), local(\"Symbola\"), url(font/Symbola.woff2) format(\"woff2\"), url(font/Symbola.woff) format(\"woff\"), url(font/Symbola.ttf) format(\"truetype\"), url(font/Symbola.otf) format(\"opentype\"), url(font/Symbola.svg#Symbola) format(\"svg\");\r\n}\r\n.mq-editable-field {\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-editable-field .mq-cursor {\r\n  border-left: 1px solid black;\r\n  margin-left: -1px;\r\n  position: relative;\r\n  z-index: 1;\r\n  padding: 0;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-editable-field .mq-cursor.mq-blink {\r\n  visibility: hidden;\r\n}\r\n.mq-editable-field,\r\n.mq-math-mode .mq-editable-field {\r\n  border: 1px solid gray;\r\n}\r\n.mq-editable-field.mq-focused,\r\n.mq-math-mode .mq-editable-field.mq-focused {\r\n  -webkit-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\r\n  -moz-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\r\n  box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\r\n  border-color: #709AC0;\r\n  border-radius: 1px;\r\n}\r\n.mq-math-mode .mq-editable-field {\r\n  margin: 2px;\r\n}\r\n.mq-editable-field .mq-latex-command-input {\r\n  color: inherit;\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n  border: 1px solid gray;\r\n  padding-right: 1px;\r\n  margin-right: 1px;\r\n  margin-left: 2px;\r\n}\r\n.mq-editable-field .mq-latex-command-input.mq-empty {\r\n  background: transparent;\r\n}\r\n.mq-editable-field .mq-latex-command-input.mq-hasCursor {\r\n  border-color: ActiveBorder;\r\n}\r\n.mq-editable-field.mq-empty:after,\r\n.mq-editable-field.mq-text-mode:after,\r\n.mq-math-mode .mq-empty:after {\r\n  visibility: hidden;\r\n  content: 'c';\r\n}\r\n.mq-editable-field .mq-cursor:only-child:after,\r\n.mq-editable-field .mq-textarea + .mq-cursor:last-child:after {\r\n  visibility: hidden;\r\n  content: 'c';\r\n}\r\n.mq-editable-field .mq-text-mode .mq-cursor:only-child:after {\r\n  content: '';\r\n}\r\n.mq-editable-field.mq-text-mode {\r\n  overflow-x: auto;\r\n  overflow-y: hidden;\r\n}\r\n.mq-root-block,\r\n.mq-math-mode .mq-root-block {\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n  width: 100%;\r\n  padding: 2px;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  vertical-align: middle;\r\n}\r\n.mq-math-mode {\r\n  font-variant: normal;\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 115%;\r\n  line-height: 1.4;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n  vertical-align: bottom;\r\n  background-image: none;\r\n  \r\n  height: 49px;\r\n  position: relative!important;\r\n  width: 127px;\r\n  \r\n}\r\n.mq-math-mode .mq-non-leaf,\r\n.mq-math-mode .mq-scaled:not(.mq-sqrt-prefix) {\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-math-mode var,\r\n.mq-math-mode .mq-text-mode,\r\n.mq-math-mode .mq-nonSymbola {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n  line-height: .9;\r\n}\r\n.mq-math-mode * {\r\n  font-size: inherit;\r\n  line-height: inherit;\r\n  margin: 0;\r\n  padding: 0;\r\n  border-color: black;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  user-select: none;\r\n  box-sizing: border-box;\r\n}\r\n.mq-math-mode .mq-empty {\r\n  background: transparent;\r\n  /*border: 1px dotted;*/\r\n  padding: 0 3px;\r\n}\r\n.mq-math-mode .mq-empty.mq-root-block {\r\n  background: transparent;\r\n}\r\n.mq-math-mode.mq-empty {\r\n  background: transparent;\r\n}\r\n.mq-math-mode .mq-text-mode {\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-text-mode.mq-hasCursor {\r\n  box-shadow: inset darkgray 0 .1em .2em;\r\n  padding: 0 .1em;\r\n  margin: 0 -0.1em;\r\n  min-width: 1ex;\r\n}\r\n.mq-math-mode .mq-font {\r\n  font: 1em \"Times New Roman\", Symbola, serif;\r\n}\r\n.mq-math-mode .mq-font * {\r\n  font-family: inherit;\r\n  font-style: inherit;\r\n}\r\n.mq-math-mode b,\r\n.mq-math-mode b.mq-font {\r\n  font-weight: bolder;\r\n}\r\n.mq-math-mode var,\r\n.mq-math-mode i,\r\n.mq-math-mode i.mq-font {\r\n  font-style: normal;\r\n}\r\n.mq-math-mode var.mq-f {\r\n  margin-right: 0.2em;\r\n  margin-left: 0.1em;\r\n}\r\n.mq-math-mode .mq-roman var.mq-f {\r\n  margin: 0;\r\n}\r\n.mq-math-mode big {\r\n  font-size: 125%;\r\n}\r\n.mq-math-mode .mq-roman {\r\n  font-style: normal;\r\n}\r\n.mq-math-mode .mq-sans-serif {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n}\r\n.mq-math-mode .mq-monospace {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n}\r\n.mq-math-mode .mq-overline {\r\n  border-top: 1px solid black;\r\n  margin-top: 1px;\r\n}\r\n.mq-math-mode .mq-underline {\r\n  border-bottom: 1px solid black;\r\n  margin-bottom: 1px;\r\n}\r\n.mq-math-mode .mq-binary-operator {\r\n  padding: 0 0.2em;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-supsub {\r\n  font-size: 90%;\r\n  vertical-align: -0.5em;\r\n}\r\n.mq-math-mode .mq-supsub.mq-limit {\r\n  font-size: 80%;\r\n  vertical-align: -0.4em;\r\n}\r\n.mq-math-mode .mq-supsub.mq-sup-only {\r\n  vertical-align: .5em;\r\n}\r\n.mq-math-mode .mq-supsub.mq-sup-only .mq-sup {\r\n  display: inline-block;\r\n  vertical-align: text-bottom;\r\n}\r\n.mq-math-mode .mq-supsub .mq-sup {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-supsub .mq-sub {\r\n  display: block;\r\n  float: left;\r\n}\r\n.mq-math-mode .mq-supsub.mq-limit .mq-sub {\r\n  margin-left: -0.25em;\r\n}\r\n.mq-math-mode .mq-supsub .mq-binary-operator {\r\n  padding: 0 .1em;\r\n}\r\n.mq-math-mode .mq-supsub .mq-fraction {\r\n  font-size: 70%;\r\n}\r\n.mq-math-mode sup.mq-nthroot {\r\n  font-size: 80%;\r\n  vertical-align: 0.8em;\r\n  margin-right: -0.6em;\r\n  margin-left: .2em;\r\n  margin-top: 2px;\r\n  min-width: .5em;\r\n}\r\n.mq-math-mode .mq-paren {\r\n  padding: 0.2px; /* 0 .1em; changes*/\r\n  /* vertical-align: top; */\r\n  font-size: 28px;\r\n  vertical-align: middle;\r\n  display: initial;\r\n  -webkit-transform-origin: center .06em;\r\n  -moz-transform-origin: center .06em;\r\n  -ms-transform-origin: center .06em;\r\n  -o-transform-origin: center .06em;\r\n  transform-origin: center .06em;\r\n}\r\n.mq-math-mode .mq-paren.mq-ghost {\r\n  color: silver;\r\n}\r\n.mq-math-mode .mq-paren + span {\r\n  margin-top: .1em;\r\n  margin-bottom: .1em;\r\n}\r\n.mq-paren {\r\n  display: inline!important;\r\n}\r\n.mq-math-mode .mq-array {\r\n  vertical-align: middle;\r\n  text-align: center;\r\n}\r\n.mq-math-mode .mq-array > span {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-operator-name {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n  line-height: .9;\r\n  font-style: normal;\r\n}\r\n.mq-math-mode var.mq-operator-name.mq-first {\r\n  padding-left: .2em;\r\n}\r\n.mq-math-mode var.mq-operator-name.mq-last {\r\n  padding-right: .2em;\r\n}\r\n.mq-math-mode .mq-fraction {\r\n  font-size: 90%;\r\n  text-align: center;\r\n  vertical-align: -0.4em;\r\n  padding: 0 .2em;\r\n}\r\n.mq-math-mode .mq-fraction,\r\n.mq-math-mode .mq-large-operator,\r\n.mq-math-mode x:-moz-any-link {\r\n  display: -moz-groupbox;\r\n}\r\n.mq-math-mode .mq-fraction,\r\n.mq-math-mode .mq-large-operator,\r\n.mq-math-mode x:-moz-any-link,\r\n.mq-math-mode x:default {\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-numerator,\r\n.mq-math-mode .mq-denominator {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-numerator {\r\n  padding: 0 0.1em;\r\n}\r\n.mq-math-mode .mq-denominator {\r\n  border-top: 1px solid;\r\n  float: right;\r\n  width: 100%;\r\n  padding: 0.1em;\r\n}\r\n.mq-math-mode .mq-sqrt-prefix {\r\n  padding-top: 0;\r\n  position: relative;\r\n  top: 0.1em;\r\n  vertical-align: top;\r\n  -webkit-transform-origin: top;\r\n  -moz-transform-origin: top;\r\n  -ms-transform-origin: top;\r\n  -o-transform-origin: top;\r\n  transform-origin: top;\r\n}\r\n.mq-math-mode .mq-sqrt-stem {\r\n  border-top: 1px solid;\r\n  margin-top: 1px;\r\n  padding-left: .15em;\r\n  padding-right: .2em;\r\n  margin-right: .1em;\r\n  padding-top: 1px;\r\n}\r\n.mq-math-mode .mq-vector-prefix {\r\n  display: block;\r\n  text-align: center;\r\n  line-height: .25em;\r\n  margin-bottom: -0.1em;\r\n  font-size: 0.75em;\r\n}\r\n.mq-math-mode .mq-vector-stem {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-large-operator {\r\n  text-align: center;\r\n}\r\n.mq-math-mode .mq-large-operator .mq-from,\r\n.mq-math-mode .mq-large-operator big,\r\n.mq-math-mode .mq-large-operator .mq-to {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-large-operator .mq-from,\r\n.mq-math-mode .mq-large-operator .mq-to {\r\n  font-size: 80%;\r\n}\r\n.mq-math-mode .mq-large-operator .mq-from {\r\n  float: right;\r\n  /* take out of normal flow to manipulate baseline */\r\n  width: 100%;\r\n}\r\n.mq-math-mode,\r\n.mq-math-mode .mq-editable-field {\r\n  cursor: text;\r\n  padding: 0 4px;\r\n  position: relative;\r\n  top: 2px;\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n}\r\n.mq-math-mode .mq-overarrow {\r\n  border-top: 1px solid black;\r\n  margin-top: 1px;\r\n  padding-top: 0.2em;\r\n}\r\n.mq-math-mode .mq-overarrow:before {\r\n  display: block;\r\n  position: relative;\r\n  top: -0.34em;\r\n  font-size: 0.5em;\r\n  line-height: 0em;\r\n  content: '\\27A4';\r\n  text-align: right;\r\n}\r\n.mq-math-mode .mq-overarrow.mq-arrow-left:before {\r\n  -moz-transform: scaleX(-1);\r\n  -o-transform: scaleX(-1);\r\n  -webkit-transform: scaleX(-1);\r\n  transform: scaleX(-1);\r\n  filter: FlipH;\r\n  -ms-filter: \"FlipH\";\r\n}\r\n.mq-math-mode .mq-selection,\r\n.mq-editable-field .mq-selection,\r\n.mq-math-mode .mq-selection .mq-non-leaf,\r\n.mq-editable-field .mq-selection .mq-non-leaf,\r\n.mq-math-mode .mq-selection .mq-scaled,\r\n.mq-editable-field .mq-selection .mq-scaled {\r\n  background: #B4D5FE !important;\r\n  background: Highlight !important;\r\n  color: HighlightText;\r\n  border-color: HighlightText;\r\n}\r\n.mq-math-mode .mq-selection .mq-matrixed,\r\n.mq-editable-field .mq-selection .mq-matrixed {\r\n  background: #39F !important;\r\n}\r\n.mq-math-mode .mq-selection .mq-matrixed-container,\r\n.mq-editable-field .mq-selection .mq-matrixed-container {\r\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#3399FF') !important;\r\n}\r\n.mq-math-mode .mq-selection.mq-blur,\r\n.mq-editable-field .mq-selection.mq-blur,\r\n.mq-math-mode .mq-selection.mq-blur .mq-non-leaf,\r\n.mq-editable-field .mq-selection.mq-blur .mq-non-leaf,\r\n.mq-math-mode .mq-selection.mq-blur .mq-scaled,\r\n.mq-editable-field .mq-selection.mq-blur .mq-scaled,\r\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed,\r\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed {\r\n  background: #D4D4D4 !important;\r\n  color: black;\r\n  border-color: black;\r\n}\r\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed-container,\r\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed-container {\r\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#D4D4D4') !important;\r\n}\r\n.mq-editable-field .mq-textarea,\r\n.mq-math-mode .mq-textarea {\r\n  position: relative;\r\n  -webkit-user-select: text;\r\n  -moz-user-select: text;\r\n  user-select: text;\r\n}\r\n.mq-editable-field .mq-textarea *,\r\n.mq-math-mode .mq-textarea *,\r\n.mq-editable-field .mq-selectable,\r\n.mq-math-mode .mq-selectable {\r\n  -webkit-user-select: text;\r\n  -moz-user-select: text;\r\n  user-select: text;\r\n  position: absolute;\r\n  clip: rect(1em 1em 1em 1em);\r\n  -webkit-transform: scale(0);\r\n  -moz-transform: scale(0);\r\n  -ms-transform: scale(0);\r\n  -o-transform: scale(0);\r\n  transform: scale(0);\r\n  resize: none;\r\n  width: 1px;\r\n  height: 1px;\r\n}\r\n.mq-math-mode .mq-matrixed {\r\n  background: white;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-matrixed-container {\r\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='white');\r\n  margin-top: -0.1em;\r\n}\r\n";
    styleInject(css_248z);

    /* clsSMFill/FillInTheBlanksPreview.svelte generated by Svelte v3.34.0 */

    const { console: console_1, document: document_1$1 } = globals;

    const file$2 = "clsSMFill/FillInTheBlanksPreview.svelte";

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-wzxnx0-style";
    	style.textContent = "xmp{display:inline}#fillmain{overflow:hidden;max-width:1024px;text-align:left}#fillmain pre{background:none;border:none;font-size:14px!important}#fillmain .string{min-height:50px;margin-top:10px;margin-right:10px}#fillmain .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}#fillmain .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}#fillmain .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}#fillmain input[type=\"text\"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}#fillmain .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}#fillmain .drag-resize.dragable{cursor:move}#fillmain .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}#fillmain .fillcheck ul{width:220px}#fillmain .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}#fillmain .select{font-size:15px}#fillmain .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}#fillmain .dragable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}#fillmain .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}#fillmain select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#171718;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Roboto, sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.auto_width{width:auto}.prettyprint{display:-ms-grid!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbEluVGhlQmxhbmtzUHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBdzdCUyxHQUFHLEFBQUUsQ0FBQSxBQUNaLE9BQU8sQ0FBRSxNQUFNLEFBQ2hCLENBQUEsQUFDUSxTQUFTLEFBQUUsQ0FBQSxBQUNsQixTQUFTLE1BQU0sQ0FDZixVQUFVLE1BQU0sQ0FDaEIsV0FBVyxJQUFJLEFBQ2hCLENBQUEsQUFDUSxhQUFhLEFBQUUsQ0FBQSxBQUN0QixVQUFVLENBQUUsSUFBSSxDQUNoQixNQUFNLENBQUUsSUFBSSxDQUNaLFNBQVMsQ0FBRSxJQUFJLFVBQVUsQUFDMUIsQ0FBQSxBQUNRLGlCQUFpQixBQUFFLENBQUEsQUFDMUIsV0FBVyxJQUFJLENBQ2YsV0FBVyxJQUFJLENBQ2YsYUFBYSxJQUFJLEFBQ2xCLENBQUEsQUFDUSxvQkFBb0IsQUFBRSxDQUFBLEFBQzdCLFNBQVMsUUFBUSxDQUNqQixVQUFVLENBQUUsSUFBSSxDQUNoQixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsVUFBVSxDQUFFLElBQUksQUFDakIsQ0FBQSxBQUNRLDhCQUE4QixBQUFFLENBQUEsQUFDdkMsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLEtBQUssQ0FDVixLQUFLLENBQUUsR0FBRyxDQUNWLEtBQUssQ0FBRSxDQUFDLENBQ1IsTUFBTSxDQUFFLENBQUMsQ0FDVCxXQUFXLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQ25DLFlBQVksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FDcEMsYUFBYSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUMvQixDQUFBLEFBQ1EsbUJBQW1CLEFBQUUsQ0FBQSxBQUM1QixRQUFRLEdBQUcsQUFDWixDQUFBLEFBQ1Esc0JBQXNCLEFBQUMsQ0FBQSxBQUM5QixPQUFPLElBQUksQ0FDWCxRQUFRLFlBQVksQ0FDcEIsU0FBUyxRQUFRLENBQ2pCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLE1BQU0sQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ25CLEdBQUcsQ0FBRSxJQUFJLEFBQ1YsQ0FBQSxBQUNRLHNCQUFzQixBQUFFLENBQUEsQUFDL0IsT0FBTyxJQUFJLENBQ1gsUUFBUSxZQUFZLENBQ3BCLFNBQVMsUUFBUSxDQUNqQixVQUFVLENBQUUsSUFBSSxDQUNoQixNQUFNLENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNuQixHQUFHLENBQUUsSUFBSSxBQUNWLENBQUEsQUFDUSxlQUFlLEFBQUUsQ0FBQSxBQUN4QixHQUFHLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDbEIsQ0FBQSxBQUNRLGVBQWUsQUFBRSxDQUFBLEFBQ3hCLEdBQUcsQ0FBRSxHQUFHLENBQUMsVUFBVSxBQUNwQixDQUFBLEFBUVEsNEJBQTRCLEFBQUUsQ0FBQyxBQUN0QyxPQUFPLEdBQUcsVUFBVSxDQUNwQixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsSUFBSSxDQUNkLEtBQUssQ0FBRSxJQUFJLENBQ1gsU0FBUyxDQUFFLEtBQUssQUFDakIsQ0FBQSxBQUNRLHNCQUFzQixBQUFFLENBQUEsQUFDL0IsZUFBZSxNQUFNLENBQ3JCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3hCLFdBQVcsTUFBTSxDQUNqQixRQUFRLEdBQUcsQ0FDWCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ1EsK0JBQStCLEFBQUcsQ0FBQSxBQUN6QyxPQUFPLElBQUksQUFDWixDQUFBLEFBQ1EscUJBQXFCLEFBQUcsQ0FBQSxBQUMvQixNQUFNLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FDaEMsVUFBVSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNsQyxPQUFPLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQ3hCLENBQUEsQUFDUSx1QkFBdUIsQUFBRSxDQUFBLEFBQ2hDLE1BQU0sS0FBSyxBQUNaLENBQUEsQUFDUSxnQ0FBZ0MsQUFBRSxDQUFBLEFBQ3pDLGdCQUFnQixDQUFFLE9BQU8sQUFDMUIsQ0FBQSxBQUNRLGdEQUFnRCxBQUFFLENBQUEsQUFDekQsS0FBSyxDQUFFLElBQUksQ0FDWCxLQUFLLENBQUUsSUFBSSxDQUNYLE9BQU8sQ0FBRSxHQUFHLENBQ1osUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQUFDWixDQUFBLEFBQ1Esa0NBQWtDLEFBQUUsQ0FBQSxBQUMzQyxLQUFLLENBQUUsSUFBSSxDQUNYLEtBQUssQ0FBRSxJQUFJLENBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFBLEFBQ1EsZ0JBQWdCLEFBQUUsQ0FBQSxBQUN4QixPQUFPLENBQUcsTUFBTSxVQUFVLEFBQzVCLENBQUEsQUFDUSxpQkFBaUIsQUFBRSxDQUFBLEFBQzFCLFNBQVMsQ0FBRSxJQUFJLEFBQ2hCLENBQUEsQUFDUSxtQkFBbUIsQUFBRSxDQUFBLEFBQzVCLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGNBQWMsR0FBRyxDQUNqQixXQUFXLElBQUksQ0FDZixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRCxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEFBQzlDLENBQUEsQUFDUSxzQkFBc0IsQUFBRSxDQUFBLEFBQy9CLE1BQU0sQ0FBRSxPQUFPLFVBQVUsQ0FDekIsT0FBTyxDQUFFLEdBQUcsVUFBVSxBQUN2QixDQUFBLEFBQ1EsSUFBSSxBQUFFLENBQUEsQUFDYixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQVUsQUFDcEMsQ0FBQSxBQUNRLHlCQUF5QixBQUFFLENBQUEsQUFDbEMsVUFBVSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDdEYsT0FBTyxDQUFFLElBQUksQUFDZCxDQUFBLEFBRVEseUJBQXlCLEFBQUUsQ0FBQSxBQUNsQyxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUN0RixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUEsQUFDUSxlQUFlLEFBQUUsQ0FBQSxBQUN4QixNQUFNLENBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEFBQ3pCLENBQUEsQUFFUSxVQUFVLEFBQUUsQ0FBQSxBQUNuQixnQkFBZ0IsQ0FBRSxJQUFJLFVBQVUsQUFDakMsQ0FBQSxBQUVRLDRCQUE0QixBQUFFLENBQUEsQUFDckMsV0FBVyxDQUFFLEdBQUcsQUFDakIsQ0FBQSxBQUNRLGVBQWUsQUFBRSxDQUFBLEFBQ3hCLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQ2pCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsY0FBYyxHQUFHLENBQ2pCLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLHFCQUFxQixDQUFFLEdBQUcsQ0FDMUIsa0JBQWtCLENBQUUsR0FBRyxDQUN2QixhQUFhLENBQUUsR0FBRyxDQUNsQixLQUFLLENBQUUsT0FBTyxDQUNkLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsZ0JBQWdCLENBQUUsSUFBSSxDQUN0QixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLFdBQVcsQ0FBRSxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQy9CLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRCxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQzdDLGtCQUFrQixDQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUM3RSxVQUFVLENBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEFBQ3RFLENBQUEsQUFFUSxxQkFBcUIsQUFBRSxDQUFBLEFBQzlCLFlBQVksQ0FBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNsQyxPQUFPLENBQUUsQ0FBQyxDQUNWLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQ2xGLGVBQWUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUMvRSxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQUFDM0UsQ0FBQSxBQUNRLDRCQUE0QixBQUFFLENBQUEsQUFDckMsU0FBUyxRQUFRLENBQ2pCLE1BQU0sSUFBSSxDQUNWLE9BQU8sSUFBSSxDQUNYLE1BQU0sSUFBSSxDQUNWLElBQUksSUFBSSxDQUNSLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLE1BQU0sQ0FBQyxVQUFVLENBQzlCLE9BQU8sQ0FBRSxDQUFDLENBQUMsVUFBVSxBQUN0QixDQUFBLEFBQ1EsU0FBUyxBQUFFLENBQUEsQUFDbEIsT0FBTyxDQUFFLElBQUksQ0FDYixRQUFRLENBQUUsUUFBUSxDQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osZ0JBQWdCLENBQUUsT0FBTyxDQUN6QixLQUFLLENBQUUsT0FBTyxDQUNkLEdBQUcsQ0FBRSxFQUFFLENBQ1AsV0FBVyxDQUFFLEdBQUcsQ0FDaEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLElBQUksQ0FBQyxVQUFVLEFBQ3hCLENBQUEsQUFDUSxZQUFZLEFBQUUsQ0FBQSxBQUNyQixPQUFPLElBQUksVUFBVSxBQUN0QixDQUFBLEFBQ1EsV0FBVyxBQUFFLENBQUEsQUFDcEIsTUFBTSxJQUFJLEFBQ1gsQ0FBQSxBQUNRLFlBQVksQUFBRSxDQUFBLEFBQ3JCLE9BQU8sQ0FBRSxRQUFRLFVBQVUsQUFDNUIsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJGaWxsSW5UaGVCbGFua3NQcmV2aWV3LnN2ZWx0ZSJdfQ== */";
    	append_dev(document_1$1.head, style);
    }

    // (930:4) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("*Matching is not case sensitive.");
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(930:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (928:4) {#if state.matchtype == "0"}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("*Exact matching is required.");
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(928:4) {#if state.matchtype == \\\"0\\\"}",
    		ctx
    	});

    	return block;
    }

    // (938:3) {#if state.showToolbar}
    function create_if_block$2(ctx) {
    	let fillintheblankstoolbar;
    	let current;

    	fillintheblankstoolbar = new FillInTheBlanksToolbar({
    			props: {
    				spanId: /*state*/ ctx[6].spanId,
    				divId: /*state*/ ctx[6].divId,
    				action: /*ucFill*/ ctx[3].fillMath[/*fillId*/ ctx[5]],
    				show: /*toggleToolbar*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fillintheblankstoolbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fillintheblankstoolbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fillintheblankstoolbar_changes = {};
    			if (dirty[0] & /*state*/ 64) fillintheblankstoolbar_changes.spanId = /*state*/ ctx[6].spanId;
    			if (dirty[0] & /*state*/ 64) fillintheblankstoolbar_changes.divId = /*state*/ ctx[6].divId;
    			if (dirty[0] & /*ucFill, fillId*/ 40) fillintheblankstoolbar_changes.action = /*ucFill*/ ctx[3].fillMath[/*fillId*/ ctx[5]];
    			fillintheblankstoolbar.$set(fillintheblankstoolbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fillintheblankstoolbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fillintheblankstoolbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fillintheblankstoolbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(938:3) {#if state.showToolbar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div5;
    	let center1;
    	let itemhelper;
    	let t0;
    	let div4;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div3;
    	let div2;
    	let t3;
    	let center0;
    	let t4;
    	let div4_class_value;
    	let div4_matchtype_value;
    	let div4_multi_value;
    	let div4_ignoretype_value;
    	let div4_manual_grade_value;
    	let div4_totalcorrectans_value;
    	let div5_class_value;
    	let current;

    	let itemhelper_props = {
    		handleReviewClick: /*handleReview*/ ctx[12],
    		reviewMode: /*isReview*/ ctx[0],
    		customReviewMode: /*customIsReview*/ ctx[7]
    	};

    	itemhelper = new ItemHelper({ props: itemhelper_props, $$inline: true });
    	/*itemhelper_binding*/ ctx[18](itemhelper);
    	itemhelper.$on("setReview", /*setReview*/ ctx[9]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[10]);

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[6].matchtype == "0") return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*state*/ ctx[6].showToolbar && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			center1 = element("center");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			if_block0.c();
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t3 = space();
    			center0 = element("center");
    			t4 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "string");
    			attr_dev(div0, "id", "previewArea");
    			add_location(div0, file$2, 925, 2, 31388);
    			set_style(div1, "color", "#b94a48");
    			set_style(div1, "margin-top", "5px");
    			attr_dev(div1, "class", "smnotes");
    			add_location(div1, file$2, 926, 3, 31435);
    			attr_dev(div2, "class", "arrow-up");
    			add_location(div2, file$2, 934, 4, 31719);
    			attr_dev(center0, "class", "dragArea");
    			add_location(center0, file$2, 935, 4, 31752);
    			attr_dev(div3, "class", "footerStr");
    			set_style(div3, "display", /*state*/ ctx[6].footerStr ? "block" : "none");
    			add_location(div3, file$2, 933, 3, 31637);
    			attr_dev(div4, "id", /*containerID*/ ctx[8]);
    			attr_dev(div4, "class", div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? "pe-none" : null));
    			attr_dev(div4, "matchtype", div4_matchtype_value = /*state*/ ctx[6].matchtype);
    			attr_dev(div4, "tabindex", "0");
    			attr_dev(div4, "multi", div4_multi_value = /*state*/ ctx[6].multi);
    			attr_dev(div4, "ignoretype", div4_ignoretype_value = /*state*/ ctx[6].ignoretype);
    			attr_dev(div4, "manual_grade", div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0);
    			attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value = /*state*/ ctx[6].totalcorrectans);
    			set_style(div4, "font-family", "Roboto, sans-serif");
    			set_style(div4, "font-size", "1em");
    			add_location(div4, file$2, 913, 2, 31063);
    			add_location(center1, file$2, 902, 1, 30828);
    			attr_dev(div5, "class", div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "");
    			add_location(div5, file$2, 901, 0, 30783);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, center1);
    			mount_component(itemhelper, center1, null);
    			append_dev(center1, t0);
    			append_dev(center1, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			if_block0.m(div1, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t3);
    			append_dev(div3, center0);
    			append_dev(div4, t4);
    			if (if_block1) if_block1.m(div4, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 64) {
    				set_style(div3, "display", /*state*/ ctx[6].footerStr ? "block" : "none");
    			}

    			if (/*state*/ ctx[6].showToolbar) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*isReview*/ 1 && div4_class_value !== (div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? "pe-none" : null))) {
    				attr_dev(div4, "class", div4_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 64 && div4_matchtype_value !== (div4_matchtype_value = /*state*/ ctx[6].matchtype)) {
    				attr_dev(div4, "matchtype", div4_matchtype_value);
    			}

    			if (!current || dirty[0] & /*state*/ 64 && div4_multi_value !== (div4_multi_value = /*state*/ ctx[6].multi)) {
    				attr_dev(div4, "multi", div4_multi_value);
    			}

    			if (!current || dirty[0] & /*state*/ 64 && div4_ignoretype_value !== (div4_ignoretype_value = /*state*/ ctx[6].ignoretype)) {
    				attr_dev(div4, "ignoretype", div4_ignoretype_value);
    			}

    			if (!current || dirty[0] & /*manual_grade*/ 2 && div4_manual_grade_value !== (div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0)) {
    				attr_dev(div4, "manual_grade", div4_manual_grade_value);
    			}

    			if (!current || dirty[0] & /*state*/ 64 && div4_totalcorrectans_value !== (div4_totalcorrectans_value = /*state*/ ctx[6].totalcorrectans)) {
    				attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value);
    			}

    			if (!current || dirty[0] & /*xml*/ 4 && div5_class_value !== (div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "")) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			/*itemhelper_binding*/ ctx[18](null);
    			destroy_component(itemhelper);
    			if_block0.d();
    			if (if_block1) if_block1.d();
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

    function autoresize(flag) {
    	let ftb_textarea = document.querySelectorAll(".textarea.ks");

    	for (let i = 0; i < ftb_textarea.length; i++) {
    		let e = ftb_textarea[i];

    		var timer = setTimeout(
    			function () {
    				e.style.cssText = "height:auto;overflow: auto;";
    				if (flag) if (window.isIE) e.style.cssText = "height:" + (e.scrollHeight + 10) + "px;overflow: hidden"; else e.style.cssText = "height:" + e.scrollHeight + "px;overflow: hidden";
    				clearTimeout(timer);
    			},
    			100
    		);
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FillInTheBlanksPreview", slots, []);
    	let { manual_grade } = $$props;
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	let { editorState } = $$props;
    	let { smValidate } = $$props;
    	let { showAns } = $$props;

    	// variable declaration
    	let anserDisable = false;

    	let customIsReview = isReview;
    	let smControllerCallback;
    	let cdata = "";
    	let dragData = "";
    	let CheckDuplicate = [];
    	let dragID = 0;
    	let errorCatchFlag = 1;
    	let fillMath = [];
    	let fillId;
    	let parsedXml = {};
    	let parsedUxml = {};
    	let containerID = "fillmain";
    	globalThis.ajax_eId = "#fillmain";
    	let state = {};
    	let preReview = !isReview;

    	let hdd = writable({
    		matchtype: "0",
    		ignoretype: "",
    		multi: "",
    		totalcorrectans: 0,
    		showToolbar: false,
    		isMathquill: false,
    		fillMath: [],
    		footerStr: false
    	});

    	const unsubscribe = hdd.subscribe(items => {
    		$$invalidate(6, state = items);
    	});

    	onMount(async () => {
    		if (in_editor) {
    			AH.addScript("", "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js");
    		}

    		AH.addScript("", window.itemUrl + "src/libs/mathQuill_new.js");

    		//AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body'});
    		ucFill.setUpdate(updateModule.bind(this));

    		let mathItem = document.getElementById(containerID);

    		mathItem = mathItem
    		? mathItem.getElementsByClassName("mathquill")
    		: mathItem;

    		if (state.isMathquill) {
    			AH.selectAll("div" + ajax_eId, "css", { "overflow": "auto" });
    		}

    		// Binding the events 
    		AH.bind(ajax_eId, "click", displayAns);

    		AH.bind(ajax_eId, "keyup", displayAns);
    		AH.bind(ajax_eId, "change", displayAns);
    		AH.bind(ajax_eId, "dragend", displayAns);
    		AH.listen(document, "click", "span.mq-editable-field.mq-focused", oneditoFocused);
    		AH.listen(document, "change", "span.mq-editable-field.mq-focused", oneditoFocused);

    		// for loading the module on the basis of the updated the xml
    		loadModule();
    	});

    	/*
    ** This function will call when compent recieving new prop in other words whenever 
    ** any thing changes in xml this function will call automatically
    */
    	beforeUpdate(() => {
    		// for checking that there is change in the xml
    		if (xml != state.xml) {
    			if (editorState && editorState.stopPreviewUpdate == true) {
    				return false;
    			}

    			// for loading the module on the basis of the updated the xml
    			loadModule();

    			// for adding the tabindex
    			setTimeout(
    				function () {
    					let node = document.getElementById("previewArea");

    					if (node.childNodes[0] && node.childNodes[0].nodeName == "TABLE") {
    						node = document.querySelectorAll("#previewArea td");

    						for (let item in node) {
    							if (!node[item].firstElementChild && node[item].nodeName == "TD") {
    								node[item].setAttribute("tabindex", "0");
    							}
    						}
    					} else {
    						for (let item in node.childNodes) {
    							if (node.childNodes[item].nodeType == 3) {
    								let txt = document.createElement("span");
    								txt.setAttribute("tabindex", "0");
    								txt.innerHTML = node.childNodes[item].textContent;
    								node.childNodes[item].replaceWith(txt);
    							}
    						}
    					}
    				},
    				1000
    			);
    		}
    	});

    	// for loading the module initially 	
    	function loadModule() {
    		$$invalidate(6, state.xml = xml, state);

    		// converting the xml to json using XMLToJSON function
    		parsedXml = XMLToJSON(xml);

    		// checking for user ans
    		if (uxml) {
    			if (!window.isResetMath) {
    				parsedUxml = XMLToJSON(uxml);
    				$$invalidate(6, state.uxml = uxml, state);
    			} else {
    				window.isResetMath = false;
    			}
    		}

    		// parsing the authoring xml
    		parseXmlAuthoring(parsedXml, parsedUxml);

    		//ucFill.showdragans(ajax_eId, 'u'); //@prabhat: Its creating issue when we check the answer from editor for the drop down.
    		if (!xml) {
    			let errMsg = smVal.validate(editorState.content_type, editorState.subtype, editorState.content_icon);
    			smValidate(errMsg);
    		}
    	}

    	function updateUserAns(parsedUans) {
    		let uaXMLNew = "";

    		// finding the correct ans
    		let answerKey = parsedXml.smxml.text.__cdata.match(/%{[\s\S]*?}%/gm);

    		let answerType = "";

    		// if correct answer is found traverseing each correct ans
    		if (answerKey) {
    			answerKey.forEach((currentAns, i) => {
    				// checking for the user ans
    				if (parsedUans) {
    					if (parsedUans.smans) {
    						let uans = parsedUans.smans.div;

    						if (Array.isArray(uans) == false) {
    							uans = [];
    							uans[0] = parsedUans.smans.div;
    						}

    						if (uans) {
    							uaXMLNew = uans[i];
    						}
    					}
    				}

    				// finding the type by finding the match with string containing | in the start and end with }%
    				answerType = currentAns.match(/\|(.*?)}%$/gm);

    				// removing the | symbol and }% and save the remaining thing in answerType if match is found otherwise kept the answerType balnk
    				answerType = answerType ? answerType[0].replace(/\||}%/gm, "") : "";

    				answerType = answerType.trim();

    				if (uaXMLNew && uaXMLNew._userAns) {
    					// storing the userans attribute value in useranswer
    					let id = "";

    					if (answerType == "" || answerType == "c") {
    						// For textbox
    						id = `#elem${i} .fillintheblank`;
    					} else if (answerType == "n") {
    						// if the type is numeric
    						id = `#elem${i} .fillintheblank`;
    					} else if (answerType == "d" || answerType == "ds") {
    						// checking for the user ans
    						id = `#elem${i}`;
    					} else if (answerType == "s") ; else if (answerType == "e") {
    						id = `#elem${i}`; // checking createSelectBox for the user ans
    					} else if (answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
    						// For multiline 
    						id = `#elem${i} .textarea`;
    					}

    					if (AH.isValid(id) && document.querySelector(id)) {
    						document.querySelector(id).setAttribute("userans", uaXMLNew._userAns);
    					}
    				}
    			});
    		}
    	}

    	// this function responsible for parsing the xml 
    	function parseXmlAuthoring(MYXML, uaXML = false) {
    		// fetching the cdata
    		cdata = MYXML.smxml.text.__cdata;

    		dragData = "";
    		CheckDuplicate = [];
    		dragID = 0;
    		$$invalidate(6, state.footerStr = false, state);
    		AH.selectAll(".smnotes", "hide");

    		// converting the matchType to matchtype
    		if (MYXML.smxml.text._matchType) {
    			MYXML.smxml.text._matchtype = MYXML.smxml.text._matchType;
    			delete MYXML.smxml.text._matchType;
    		}

    		// converting the ignoreType to ignoretype
    		if (MYXML.smxml.text._ignoreType) {
    			MYXML.smxml.text._ignoretype = MYXML.smxml.text._ignoreType;
    			delete MYXML.smxml.text._ignoreType;
    		}

    		// setting state 
    		$$invalidate(6, state.matchtype = MYXML.smxml.text._matchtype, state);

    		$$invalidate(6, state.ignoretype = MYXML.smxml.text._ignoretype, state);
    		$$invalidate(6, state.multi = MYXML.smxml.text._multiple == "multiple" ? "1" : "", state);

    		// finding the correct ans
    		let answerKey = cdata.match(/%{[\s\S]*?}%/gm);

    		let answerType = "";
    		let uaXMLNew = "";
    		let totalMarks = 0;

    		// if correct answer is found traverseing each correct ans
    		if (answerKey) {
    			answerKey.forEach((v, i) => {
    				totalMarks++;

    				// checking for the user ans
    				if (uaXML) {
    					if (uaXML.smans) {
    						let uans = uaXML.smans.div;

    						if (Array.isArray(uans) == false) {
    							uans = [];
    							uans[0] = uaXML.smans.div;
    						}

    						if (uans) {
    							uaXMLNew = uans[i];
    						}
    					}
    				}

    				let originalKey = answerKey[i];

    				// finding the type by finding the match with string containing | in the start and end with }%
    				answerType = answerKey[i].match(/\|(.*?)}%$/gm);

    				// removing the | symbol and }% and save the remaining thing in answerType if match is found otherwise kept the answerType balnk
    				answerType = answerType ? answerType[0].replace(/\||}%/gm, "") : "";

    				answerType = answerType.trim();

    				// in case of textbox or codetype
    				if (answerType == "" || answerType == "c") {
    					AH.selectAll(".smnotes", "show");

    					// checking for the user ans
    					if (uaXMLNew) {
    						// create the textbox in the preview area with user ans
    						createTextbox(originalKey, i, uaXMLNew);
    					} else {
    						// create the textbox in the preview area
    						createTextbox(originalKey, i);
    					}
    				} else if (answerType == "n") {
    					// if the type is numeric
    					// checking for the user ans
    					if (uaXMLNew) {
    						// create the numeric textbox in the preview area with user ans
    						createNumericbox(originalKey, i, uaXMLNew);
    					} else {
    						// create the numeric textbox in the preview area
    						createNumericbox(originalKey, i);
    					}
    				} else if (answerType == "d" || answerType == "ds") {
    					// checking for the user ans
    					if (uaXMLNew) {
    						// create the drag & drop textbox in the preview area with user ans
    						createDragDrop(originalKey, i, uaXMLNew);
    					} else {
    						// create the drag & drop textbox in the preview area
    						createDragDrop(originalKey, i);
    					}
    				} else if (answerType == "s") {
    					// checking for the user ans
    					if (uaXMLNew) {
    						// create the select box in the preview area with user ans
    						createSelectBox(originalKey, i, uaXMLNew);
    					} else {
    						// create the select box in the preview area
    						createSelectBox(originalKey, i);
    					}
    				} else if (answerType == "e") {
    					$$invalidate(6, state.isMathquill = true, state);

    					// checking for the user ans
    					if (uaXMLNew) {
    						// creating textbox with user ans in preview area
    						createMathDiv(originalKey, i, uaXMLNew);
    					} else {
    						// creating textbox in preview area
    						createMathDiv(originalKey, i);
    					}
    				} else if (answerType.indexOf("{" == 0) || answerType.indexOf("{" == 1)) {
    					AH.selectAll(".smnotes", "show");

    					// checking for the user ans
    					if (uaXMLNew) {
    						// create the textarea in the preview area with user ans
    						createMultilineBox(originalKey, i, uaXMLNew);
    					} else {
    						// create the textarea in the preview area
    						createMultilineBox(originalKey, i);
    					}
    				}

    				let innerKey = originalKey.replace("%{", "").replace("}%", "");
    			});
    		}

    		AH.selectAll("#" + containerID, "attr", { "totalcorrectans": totalMarks });

    		// Resolve html entity
    		cdata = AH.ignoreEnity(cdata);

    		// put the cdata in the previewarea
    		AH.find("#" + containerID, "#previewArea", { action: "html", actionData: cdata });

    		// put the dragData in the dragarea
    		AH.find("#" + containerID, ".dragArea", { action: "html", actionData: dragData });

    		let parent = AH.find("#" + containerID, ".dragArea");
    		let divs = (parent?.children) ? Array.from(parent.children) : [];

    		while (divs.length) {
    			parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    		}

    		// set the max width of the textbox
    		setMaxWidth();

    		setSMNotes();
    		runModule();

    		var timer = setTimeout(
    			function () {
    				if (AH.find(ajax_eId, ".prettyprint", "all").length >= 1) {
    					if (AH.find(ajax_eId, ".prettyprint .L0", "all").length == 0) {
    						if (typeof prettyPrint == "function") {
    							/*code to prevent pretty print existing pretified code 04/02/2018*/
    							AH.selectAll(".prettyprint").forEach(_this => {
    								_this.classList.add("prettyprintReplica");
    								_this.classList.remove("prettyprint");
    							});

    							AH.selectAll(".linenums").forEach(_this => {
    								_this.classList.add("linenumsReplica");
    								_this.classList.remove("linenums");
    							});

    							AH.find(ajax_eId, ".prettyprintReplica").forEach(_this => {
    								_this.classList.add("prettyprint");
    							});

    							AH.find(ajax_eId, ".linenumsReplica").forEach(_this => {
    								_this.classList.add("linenums");
    							});

    							/********/
    							prettyPrint();

    							/*code to prevent pretty print existing pretified code 04/02/2018*/
    							AH.selectAll(".prettyprintReplica").forEach(_this => {
    								_this.classList.add("prettyprint");
    								_this.classList.remove("prettyprintReplica");
    							});

    							AH.selectAll(".linenumsReplica").forEach(_this => {
    								_this.classList.add("linenums");
    								_this.classList.remove("linenumsReplica");
    							});
    						} /*******/
    					}
    				}

    				clearTimeout(timer);
    			},
    			2000
    		);

    		if (AH.find(ajax_eId, "table.uc-table", "all").length > 0) {
    			AH.find(ajax_eId, "table.uc-table", { action: "addClass", actionData: "font14" });

    			try {
    				// for removing br
    				if (AH.find(ajax_eId, "table.uc-table").previousElementSibling?.nodeName == "BR") {
    					AH.find(ajax_eId, "table.uc-table").previousElementSibling.remove();
    				}
    			} catch(e) {
    				console.warn(e);
    			}
    		}
    	}

    	// function calls when remediation mode is on
    	function setReview() {
    		$$invalidate(0, isReview = true);
    		window.isReview = true;

    		// For mathqul based 
    		if (xml.includes("user Response{")) window.isResetMath = true;

    		$$invalidate(6, state.showToolbar = false, state);

    		// show the answer and also bind the keys event for ada
    		setTimeout(
    			function () {
    				ucFill.modeOn("on");
    				ucFill.showdragans(ajax_eId, "u", 1);
    				AH.selectAll(".remed_disable", "show");
    				autoresize(1);

    				//ucFill.modeOn("on");
    				let mathItem = document.getElementById(containerID);

    				mathItem = mathItem
    				? mathItem.getElementsByClassName("mathquill")
    				: mathItem;

    				if (mathItem) {
    					AH.selectAll(".fillintheblank", "attr", { "disabled": true });
    				} // AH.setCss(ajax_eId, {"position": "relative"});
    				// AH.insert(ajax_eId, "<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>", 'afterbegin');

    				displayAns();
    			},
    			100
    		);
    	}

    	// function calls when remediation mode is off
    	function unsetReview() {
    		AH.selectAll(".fillintheblank", "attr", { "disabled": false });
    		$$invalidate(0, isReview = false);
    		AH.selectAll(".mathquill", "css", { "border": "none" });
    		ucFill.modeOn();
    		AH.selectAll(".remed_disable, .corr_div", "hide");

    		setTimeout(
    			function () {
    				ucFill.showdragans(ajax_eId, "u", 0);
    			},
    			300
    		);

    		let mathItem = document.getElementById(containerID);

    		mathItem = mathItem
    		? mathItem.getElementsByClassName("mathquill")
    		: mathItem;

    		autoresize();

    		if (mathItem) {
    			AH.selectAll(ajax_eId, "css", { "position": "unset" });
    			AH.selectAll(".spinner-wrapper", "remove");
    		}
    	}

    	// for displaying the answer
    	function displayAns(e) {
    		//check the ans and create user ans
    		let ans = !anserDisable && ucFill.checkAns(ajax_eId) || "Incorrect";

    		// To save the user answer
    		let answer = {
    			ans: ucFill.result,
    			uXml: ucFill.userAnsXML
    		};

    		onUserAnsChange(answer);

    		if (editorState) {
    			showAns(ans);
    		}
    	}

    	// for toggling the toolbar in case of math module
    	function toggleToolbar(value) {
    		$$invalidate(6, state.showToolbar = value, state);
    	}

    	function oneditoFocused(x, event) {
    		let isFillId = true;

    		//let fillId;
    		while (isFillId) {
    			x = x.parentElement;

    			if (x.getAttribute("id")) {
    				isFillId = false;
    				$$invalidate(5, fillId = x.getAttribute("id"));
    			}
    		}

    		let latexArray = [];

    		AH.selectAll("#" + fillId + " span.mq-editable-field").forEach(element => {
    			let commandId = x.getAttribute("mathquill-command-id");
    			latexArray.push(commandId);
    		});

    		let mathId = x.getAttribute("mathquill-command-id");
    		let indexId = latexArray.indexOf(mathId);
    		$$invalidate(6, state.spanId = indexId, state);
    		$$invalidate(6, state.divId = fillId, state);
    		$$invalidate(6, state.showToolbar = true, state);
    	}

    	function updateModule(key, value) {
    		$$invalidate(6, state[key] = value, state);

    		if (key == "uxml") {
    			parsedUxml = XMLToJSON(state.uxml);

    			// parsing the authoring xml
    			updateUserAns(parsedUxml);
    		}
    	}

    	// for giving the uc-table style
    	function setSMNotes() {
    		if (AH.find(ajax_eId, "table.uc-table", "all").length > 0) {
    			let tableWidth = AH.find(ajax_eId, "table.uc-table").clientWidth + 9;

    			AH.setCss(AH.find(ajax_eId, ".smnotes"), {
    				"width": tableWidth + "px",
    				"margin": "auto",
    				"padding-top": "21px",
    				"padding-left": "65px"
    			});
    		}
    	}

    	// for adding the event to select and add drag and drop functionality to element
    	function runModule() {
    		try {
    			// for adding the event to select and add drag and drop functionality to element
    			ucFill.readyFill(ajax_eId);
    		} catch(e) {
    			if (errorCatchFlag <= 100) {
    				var timer = setTimeout(
    					() => {
    						runModule();
    						clearTimeout(timer);
    					},
    					50
    				);
    			} else {
    				console.warn("Error at runModule function");
    			}

    			errorCatchFlag++;
    		}
    	}

    	// for setting maximum width of the drag area
    	function setMaxWidth() {
    		let maxDragDropWidth = [];

    		AH.selectAll(".dragArea div").forEach((_this, i) => {
    			maxDragDropWidth.push(_this.innerHTML.length * 10 + 30);
    		});

    		AH.selectAll("#previewArea [id^=elem]").forEach(_this => {
    			if (_this.classList.contains("drag-resize")) {
    				AH.setCss(_this, {
    					"max-width": Math.max(...maxDragDropWidth)
    				});
    			}
    		});
    	}

    	/**
     * This six function responsible for creating the input area in the
     * Preview section on the basis of the authoring xml
    */
    	function createMathDiv(data, i, uaXML = false) {
    		let originalData = data;

    		// removing the %{ , }% symbol from the data  
    		data = data.replace(/%{|}%/g, "");

    		// splitting it with |
    		data = data.split("|");

    		// replacing the user Response in MathQuillMathField
    		let addMathquill = data[0].replace(/user Response/g, "\\MathQuillMathField");

    		// then spliting with ##
    		let splitData = addMathquill.split("##");

    		let randomKey = Math.floor(Math.random() * splitData.length);

    		// taking random option
    		let randomOption = splitData[randomKey];

    		// storing the randomOption in userasn by replacing the MathQuillMathField{(any value)} to MathQuillMathField{}
    		let userans = randomOption.replace(/MathQuillMathField{(.*?)}/g, "MathQuillMathField{}");

    		let defaultans = 0;
    		let anskey = randomOption;

    		// checking for the user ans
    		if (uaXML) {
    			if (uaXML._userAns) {
    				// storing the userans attribute value in useranswer
    				userans = uaXML._userAns;

    				// check for the _userAnsSeq
    				if (uaXML._userAnsSeq) {
    					// storing the anskey and userAnsSeq
    					anskey = uaXML._anskey;

    					randomKey = uaXML._userAnsSeq;
    				}
    			}
    		} else if (randomOption.indexOf("MathQuillMathField") > -1) {
    			anskey = randomOption;
    			defaultans = 1;
    		}

    		AH.select("#elem" + i, "css", { display: "none" });
    		let matheq = `<span id="elem${i}" class="auto_height auto_width edit_step fillmathelement mathquill" userAnsSeq="${randomKey}" userans="${userans}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1"></span>`;

    		let tag = `<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div>
			<span  id="m${i}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${randomKey}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1">
				${anskey}
			</span>
			${matheq}
		</div>`;

    		// rplacing the cdata
    		cdata = cdata.replace(originalData, tag);

    		let mqInterval = setInterval(
    			() => {
    				// checking the MathQuill function is defined or not
    				if (typeof MathQuill == "function") {
    					// if found clear the interval
    					clearInterval(mqInterval);

    					AH.selectAll("#elem" + i, "show");

    					// According to API DOC: By default, MathQuill overwrites the global MathQuill variable when loaded. If you do not want this behavior, you can use this 
    					let MQ = MathQuill.getInterface(2);

    					AH.selectAll(".mathquill").forEach(_this => {
    						let mathItemId = _this.getAttribute("id");
    						let defaultans = _this.getAttribute("defaultans");

    						// adding the userans in the mathItemid
    						if (defaultans == 1) {
    							var latex = _this.getAttribute("userans");
    							if (latex != undefined) AH.select("#" + mathItemId, "text", latex);
    						} else {
    							let usans = _this.getAttribute("userans");

    							if (usans != null) {
    								AH.select("#" + mathItemId, "text", usans);
    							}
    						}

    						/**
     * According to Api doc
     * MQ.StaticMath(html_element) Creates a non-editable MathQuill initialized with the contents of the HTML element and returns a StaticMath object.
     * If the given element is already a static math instance,
     					 * this will return a new StaticMath object with the same .id. If the element is a different type of MathQuill, this will return null.
    **/
    						fillMath[mathItemId] = MQ.StaticMath(document.getElementById(mathItemId));
    					});

    					$$invalidate(3, ucFill.fillMath = fillMath, ucFill);
    				}
    			},
    			100
    		);
    	}

    	function createTextbox(data, i, uaXML = false) {
    		var userAnswer = "";

    		// checking for the user ans
    		if (uaXML) {
    			if (uaXML._userAns) {
    				// storing the userans attribute value in useranswer
    				userAnswer = uaXML._userAns;
    			}
    		}

    		let originalData = data;
    		let csStyle = "";

    		// removing the %{ , }% symbol from the data  
    		data = data.replace(/%{|}%/g, "");

    		// splitting it with |
    		data = data.split("|");

    		// if the type is codetype then make its value 1 else blank
    		let codetype = data[1] && data[1].trim() == "c" ? "1" : "";

    		let anskey = data[0].trim();

    		// check for if any styling is given or not
    		if (anskey.indexOf("#style#") != -1) {
    			let customStyle = anskey.split("#style#");

    			// store the correct ans
    			anskey = customStyle[0];

    			// store the custom style
    			csStyle = customStyle[1];
    		}

    		let txtWidth = [];

    		// split the anskey with ,
    		let anslen = anskey.split(",");

    		// findiing width of the textbox
    		AH.selectAll(anslen).forEach((val, j) => {
    			txtWidth[j] = anslen[j].length * 10 + 30;
    		});

    		// adding information of the tag and textbox
    		let textbox = `<input type="text" class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...txtWidth)}px;${csStyle}"  />`;

    		let tag = `<div id="elem${i}" class="fillelement">${textbox}</div>`;

    		// replace the cdata
    		cdata = cdata.replace(originalData, tag);
    	}

    	function createNumericbox(data, i, uaXML = false) {
    		var userAnswer = "";

    		// checking for the user ans
    		if (uaXML) {
    			if (uaXML._userAns) {
    				// storing the userans attribute value in useranswer
    				userAnswer = uaXML._userAns;
    			}
    		}

    		let originalData = data;
    		let csStyle = "";

    		// removing the %{ , }% symbol from the data  
    		data = data.replace(/%{|}%/g, "");

    		// splitting it with |
    		data = data.split("|");

    		// if the type is codetype then make its value 1 else blank
    		let codetype = data[1] && data[1].trim() == "c" ? "1" : "";

    		let anskey = data[0].trim();

    		// check for if any styling is given or not
    		if (anskey.indexOf("#style#") != -1) {
    			let customStyle = anskey.split("#style#");

    			// store the correct ans
    			anskey = customStyle[0];

    			// store the custom style
    			csStyle = customStyle[1];
    		}

    		let txtWidth = [];

    		// split the anskey with ,
    		let anslen = anskey.split(",");

    		// findiing width of the textbox
    		AH.selectAll(anslen).forEach((elm, j) => {
    			txtWidth[j] = anslen[j].length * 10 + 30;
    		});

    		// adding information of the tag and textbox
    		let textbox = `<input type="number" onKeyDown="if(isNaN(event.key)){var key_arr = [13, 37, 38, 39, 40, 8, 69, 101, 46, 16, 9];if(!key_arr.includes(event.keyCode)) event.preventDefault()} "class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width: ${Math.max(...txtWidth) + 20}px;${csStyle}" />`;

    		let tag = `<div id="elem${i}" class="fillelement">${textbox}</div>`;

    		// replace the cdata
    		cdata = cdata.replace(originalData, tag);
    	}

    	function createSelectBox(data, i, uaXML = false) {
    		let originalData = data;

    		// removing the %{ , }% symbol from the data  
    		data = data.replace(/%{|}%/g, "");

    		// splitting it with |
    		data = data.split("|");

    		let optionsValue = data[0].trim();

    		// splitting with , to extract all the option
    		optionsValue = optionsValue.split(",").map(item => item.trim());

    		let options = "<option value=\"\">&nbsp;Please Select</option>";

    		// iterating through each options
    		AH.selectAll(optionsValue).forEach((_this, j) => {
    			// checking correct
    			let isCorrect = optionsValue[j].indexOf("*") == 0 ? "1" : "0";

    			// checking default selected value
    			let selected = optionsValue[j].indexOf("+") == 0
    			? "selected=\"selected\""
    			: "";

    			// extracting value of the option
    			let innerVal = optionsValue[j].indexOf("*") == 0 || optionsValue[j].indexOf("+") == 0
    			? optionsValue[j].slice(1)
    			: optionsValue[j];

    			let userAnswer = "";

    			// checking for the user asn
    			if (uaXML) {
    				if (uaXML._userAns) {
    					selected = "";

    					// spliiting with , 
    					let sel = uaXML._userAns.split(",");

    					// checkimg for the option which is selected by the user
    					if (j == sel[0].trim() - 1) {
    						selected = "selected=\"selected\"";
    						userAnswer = "1";
    					}
    				}
    			}

    			// replacing #cm with , & #pl with + in option text
    			innerVal = innerVal.replace(/\#cm/gmi, ",").replace(/\#pl/gmi, "+");

    			// creating options
    			options += `<option value="${j}" correctans="${isCorrect}" userans="${userAnswer}" ${selected}>&nbsp;${innerVal}</option>`;
    		});

    		// creating selectbox
    		let selectbox = `<select class="fillintheblank ks" data-role="none">${options}</select>`;

    		let tag = `<div id="elem${i}" class="fillelement" tabindex ="0">${selectbox}</div>`;

    		// replace the cdata
    		cdata = cdata.replace(originalData, tag);
    	}

    	function createMultilineBox(data, i, uaXML = false) {
    		let userAnswerM = "";

    		// checking for the user ans
    		if (uaXML) {
    			if (uaXML._userAns) {
    				// storing the userans attribute value in useranswer
    				userAnswerM = uaXML._userAns;
    			}
    		}

    		let originalData = data;

    		// removing the %{ , }% symbol from the data  
    		data = data.replace(/%{|}%/g, "");

    		// splitting it with |
    		data = data.split("|");

    		let anskey = data[0].trim();

    		// parse the attr in json
    		let attrs = JSON.parse(data[1]);

    		// creating textarea
    		let multilineBox = `<textarea class="textarea ks" rows="${attrs.rows}" cols="${attrs.cols}" anskey="${anskey}" value="${userAnswerM}" defaultans="${attrs.defaultAns ? attrs.defaultAns : ""}" userans="${userAnswerM}" haskeywords="" hasnotkeywords="" keywordtype="1" autocomplete="off" data-role="none">${userAnswerM}</textarea>`;

    		let tag = `<span id="elem${i}" class="fillelement" style="height:auto">${multilineBox}</span>`;

    		// replace the cdata
    		cdata = cdata.replace(originalData, tag);
    	}

    	function createDragDrop(data, i, uaXML = false) {
    		let originalData = data;

    		// removing the %{ , }% symbol from the data  
    		data = data.replace(/%{|}%/g, "");

    		// splitting it with |
    		data = data.split("|");

    		let anskey = data[0].trim();

    		// if the type is ds then make dragSingle value 1 else 0
    		let dragSingle = data[1].trim() == "ds" ? "1" : "0";

    		// split the anskey with ,
    		let totalDrag = anskey.split(",");

    		let dropAns = "";

    		// traversing through each option
    		AH.selectAll(totalDrag).forEach((elm, j) => {
    			let isDuplicate = false;
    			let maxWidth = totalDrag[j].length * 10 + 30;
    			let dragAns = totalDrag[j];

    			// storing the incorrect values
    			let ignore = totalDrag[j].match(/i~|~i/g);

    			let tempAns = "";

    			if (ignore) {
    				// removing ~i,i~ from the dragans
    				dragAns = totalDrag[j].replace(/i~|~i/g, "");
    			} else {
    				dropAns += "ID" + dragID + ",";
    				tempAns = "ID" + dragID + ",";
    			}

    			// function for checking duplicate values
    			AH.selectAll(CheckDuplicate).forEach((elm, z) => {
    				if (CheckDuplicate[z].ans == dragAns) {
    					isDuplicate = true;

    					if (!ignore) {
    						dropAns = dropAns.replace(tempAns, "");
    						dropAns += CheckDuplicate[z].id + ",";
    					}
    				}
    			});

    			// if value is not duplicate
    			if (isDuplicate == false) {
    				CheckDuplicate.push({ "ans": dragAns, "id": "ID" + dragID });
    			}

    			if (isDuplicate == false) dragData += `<div id="ID${dragID}" dragable="true" tabindex="0" class="drag-resize dragable ks" caption="${dragAns.replace(/\#cm/gmi, ",").replace(/\"/gmi, "#doublequote#")}" path="//s3.amazonaws.com/jigyaasa_content_static/" drag-single="${dragSingle}" bgcolor="#CCFFCC" style="background-color:#CCFFCC;height:auto;max-width:${maxWidth}px;padding:3px 10px 3px 10px; margin: 2px 2px;" aria-disabled="false">${dragAns.replace(/\#cm/gmi, ",")}</div>`;
    			if (isDuplicate == false) dragID++;
    		});

    		let userAnswer = "";

    		// checking for the user ans
    		if (uaXML) {
    			if (uaXML._userAns) {
    				// storing the userans attribute value in useranswer
    				userAnswer = uaXML._userAns;
    			}
    		}

    		// adding information in html
    		let drop = "<div id=\"elem" + i + "\" tabindex=\"0\" dropzone=\"1\" class=\"drag-resize dropable ks\" path=\"//s3.amazonaws.com/jigyaasa_content_static/\" anskey=\"" + dropAns.slice(0, -1) + "\" caption=\"\" userans=\"" + userAnswer + "\" droped=\"" + userAnswer + "\" bgcolor=\"#FFFFCC\" style=\"background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;\">" + userAnswer + "</div>";

    		// replace the cdata
    		cdata = cdata.replace(originalData, drop);

    		$$invalidate(6, state.footerStr = true, state);
    	}

    	/*----------------------------------------------------------------- */
    	// for showing correct answer.
    	function correctAnswer() {
    		ucFill.showdragans(ajax_eId, "c", 1);
    		AH.selectAll(".corr_div", "css", { display: "block" });
    		AH.selectAll(".remed_disable", "css", { display: "block" });
    		autoresize(1);
    	}

    	// for showing user answer.
    	function yourAnswer() {
    		ucFill.showdragans(ajax_eId, "u", 1);
    		AH.selectAll(".corr_div", "hide");
    		autoresize(1);
    	}

    	//To handle review toggle
    	function handleReview(mode, event) {
    		if (mode == "c") {
    			anserDisable = true;
    			correctAnswer();
    		} else {
    			anserDisable = false;
    			yourAnswer();
    		}
    	}

    	const writable_props = [
    		"manual_grade",
    		"xml",
    		"uxml",
    		"isReview",
    		"editorState",
    		"smValidate",
    		"showAns"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<FillInTheBlanksPreview> was created with unknown prop '${key}'`);
    	});

    	function itemhelper_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			smControllerCallback = $$value;
    			$$invalidate(4, smControllerCallback);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("manual_grade" in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
    		if ("xml" in $$props) $$invalidate(2, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(13, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("editorState" in $$props) $$invalidate(14, editorState = $$props.editorState);
    		if ("smValidate" in $$props) $$invalidate(15, smValidate = $$props.smValidate);
    		if ("showAns" in $$props) $$invalidate(16, showAns = $$props.showAns);
    	};

    	$$self.$capture_state = () => ({
    		ucFill,
    		ItemHelper,
    		FillInTheBlanksToolbar,
    		writable,
    		beforeUpdate,
    		onMount,
    		afterUpdate,
    		AH,
    		onUserAnsChange,
    		XMLToJSON,
    		manual_grade,
    		xml,
    		uxml,
    		isReview,
    		editorState,
    		smValidate,
    		showAns,
    		anserDisable,
    		customIsReview,
    		smControllerCallback,
    		cdata,
    		dragData,
    		CheckDuplicate,
    		dragID,
    		errorCatchFlag,
    		fillMath,
    		fillId,
    		parsedXml,
    		parsedUxml,
    		containerID,
    		state,
    		preReview,
    		hdd,
    		unsubscribe,
    		loadModule,
    		updateUserAns,
    		parseXmlAuthoring,
    		setReview,
    		unsetReview,
    		autoresize,
    		displayAns,
    		toggleToolbar,
    		oneditoFocused,
    		updateModule,
    		setSMNotes,
    		runModule,
    		setMaxWidth,
    		createMathDiv,
    		createTextbox,
    		createNumericbox,
    		createSelectBox,
    		createMultilineBox,
    		createDragDrop,
    		correctAnswer,
    		yourAnswer,
    		handleReview
    	});

    	$$self.$inject_state = $$props => {
    		if ("manual_grade" in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
    		if ("xml" in $$props) $$invalidate(2, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(13, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("editorState" in $$props) $$invalidate(14, editorState = $$props.editorState);
    		if ("smValidate" in $$props) $$invalidate(15, smValidate = $$props.smValidate);
    		if ("showAns" in $$props) $$invalidate(16, showAns = $$props.showAns);
    		if ("anserDisable" in $$props) anserDisable = $$props.anserDisable;
    		if ("customIsReview" in $$props) $$invalidate(7, customIsReview = $$props.customIsReview);
    		if ("smControllerCallback" in $$props) $$invalidate(4, smControllerCallback = $$props.smControllerCallback);
    		if ("cdata" in $$props) cdata = $$props.cdata;
    		if ("dragData" in $$props) dragData = $$props.dragData;
    		if ("CheckDuplicate" in $$props) CheckDuplicate = $$props.CheckDuplicate;
    		if ("dragID" in $$props) dragID = $$props.dragID;
    		if ("errorCatchFlag" in $$props) errorCatchFlag = $$props.errorCatchFlag;
    		if ("fillMath" in $$props) fillMath = $$props.fillMath;
    		if ("fillId" in $$props) $$invalidate(5, fillId = $$props.fillId);
    		if ("parsedXml" in $$props) parsedXml = $$props.parsedXml;
    		if ("parsedUxml" in $$props) parsedUxml = $$props.parsedUxml;
    		if ("containerID" in $$props) $$invalidate(8, containerID = $$props.containerID);
    		if ("state" in $$props) $$invalidate(6, state = $$props.state);
    		if ("preReview" in $$props) $$invalidate(17, preReview = $$props.preReview);
    		if ("hdd" in $$props) hdd = $$props.hdd;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isReview, preReview*/ 131073) {
    			 {
    				if (isReview != preReview) {
    					if (isReview) {
    						setReview();
    					} else {
    						unsetReview();
    					}

    					$$invalidate(17, preReview = isReview);
    				}
    			}
    		}
    	};

    	return [
    		isReview,
    		manual_grade,
    		xml,
    		ucFill,
    		smControllerCallback,
    		fillId,
    		state,
    		customIsReview,
    		containerID,
    		setReview,
    		unsetReview,
    		toggleToolbar,
    		handleReview,
    		uxml,
    		editorState,
    		smValidate,
    		showAns,
    		preReview,
    		itemhelper_binding
    	];
    }

    class FillInTheBlanksPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1$1.getElementById("svelte-wzxnx0-style")) add_css$2();

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				manual_grade: 1,
    				xml: 2,
    				uxml: 13,
    				isReview: 0,
    				editorState: 14,
    				smValidate: 15,
    				showAns: 16
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FillInTheBlanksPreview",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*manual_grade*/ ctx[1] === undefined && !("manual_grade" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'manual_grade'");
    		}

    		if (/*xml*/ ctx[2] === undefined && !("xml" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[13] === undefined && !("uxml" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'uxml'");
    		}

    		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'isReview'");
    		}

    		if (/*editorState*/ ctx[14] === undefined && !("editorState" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'editorState'");
    		}

    		if (/*smValidate*/ ctx[15] === undefined && !("smValidate" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'smValidate'");
    		}

    		if (/*showAns*/ ctx[16] === undefined && !("showAns" in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'showAns'");
    		}
    	}

    	get manual_grade() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set manual_grade(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xml() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get smValidate() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set smValidate(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<FillInTheBlanksPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const defXMl = '';
    const app = new FillInTheBlanksPreview({
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
//# sourceMappingURL=bundle_q9.js.map
