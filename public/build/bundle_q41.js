
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    /* helper\HelperAI.svelte generated by Svelte v3.40.2 */

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

    var css_248z = "body, html{     \r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;  \r\n}\r\n\r\n[tabindex=\"0\"]:focus {\r\n    box-shadow: 0 0 0 .09rem #89ace4!important;\r\n    outline: 0;\r\n}\r\n\r\n.compass_route {\r\n    stroke: #979797;\r\n    fill: transparent;\r\n    stroke-width: 2;\r\n    stroke-linecap: round;\r\n    stroke-dasharray: 0,9;\r\n}\r\n\r\n.compass_radius {\r\n    stroke: #979797;\r\n    stroke-width: 2;\r\n}\r\n\r\n.compass_center {\r\n    cursor: move;\r\n    stroke: #979797;\r\n    stroke-width: 2;\r\n}\r\n\r\n.compass_radius_icon {\r\n    stroke: #979797;\r\n    stroke-width: 2;\r\n}\r\n\r\n.compass_center:hover,\r\n.compass_center:focus,\r\n.compass_radius:focus,\r\n.compass_radius:hover,\r\n.compass_radius_icon:focus,\r\n.compass_radius_icon:hover {\r\n    stroke: #666666;\r\n}\r\n\r\n.compass_rotation:hover,\r\n.compass_radius_icon:hover,\r\n.compass_center:hover,\r\n.compass_rotation:focus,\r\n.compass_radius_icon:focus,\r\n.compass_center:focus {\r\n    opacity: 1;\r\n}\r\n\r\n.compass_rotation,\r\n.compassRotationBar,\r\n.compass_radius_icon {\r\n    cursor: pointer;\r\n    opacity: 0.6;\r\n}\r\n\r\n.centerImg svg {\r\n    position: absolute;\r\n    top: 0; \r\n    left: 0;\r\n    cursor: crosshair;\r\n}\r\n\r\n.eraserHover:hover,\r\n.eraserHover:focus {\r\n    opacity: 0.5;\r\n}\r\n\r\n.drawing-compass-pointer-border {\r\n    opacity: 0.6;\r\n    stroke-width: 2;\r\n    stroke: #979797;\r\n    fill: #f8f8ff;\r\n}\r\n\r\n#svgImgPreview,\r\n#svgImg {\r\n    max-width: none;\r\n}\r\n\r\n.lastCircle_hover {\r\n    stroke: #000;\r\n    fill: #aaa;\r\n    cursor: grab;\r\n}\r\n\r\n.resize {\r\n    z-index: 20!important;\r\n    cursor: move;\r\n    background-color: rgba(240,240,240,.6)!important;\r\n    box-shadow: 0 0 1px #000 inset;\r\n    position:absolute;\r\n    top: 35px;\r\n    left: 57px;\r\n    height: 66px;\r\n    width: 66px;\r\n    -webkit-border-radius: 100%;\r\n    -moz-border-radius: 100%;\r\n    border-radius: 100%;\r\n}\r\n#moveDrawIcon {\r\n    top: 50px;\r\n    left: 50px;\r\n    z-index: 500;\r\n    margin-top: -7px;\r\n    margin-left: -7px;\r\n}\r\n.drawing_module_container .btn-light {\r\n    background-color: #ebebeb !important;\r\n}\r\n.previewDrawingPaths path:focus {\r\n    opacity: 0.5;\r\n    outline: none;\r\n}\r\n\r\n.drawing_module_container .btn-light:not(:disabled):not(.disabled):active:focus,\r\n.drawing_module_container .btn-light:not(:disabled):not(.disabled).active:focus {\r\n    box-shadow: 0 0 0 0.2rem #aaa9!important;\r\n}\r\n\r\n.currentFocusPoint {\r\n    stroke: #027f02!important;\r\n}\r\n\r\n.centerImg svg:focus {\r\n    -webkit-box-shadow: inset 1px 1px 12px #ccc !important;\r\n    -moz-box-shadow: inset 1px 1px 12px #ccc !important;\r\n    box-shadow: inset 1px 1px 12px #ccc !important;\r\n    outline: 0;\r\n}\r\n\r\npath.answer_mark:focus {\r\n    opacity: 0.5;\r\n}\r\n\r\n.resizer {\r\n    width: 15px;\r\n    height: 15px;\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    cursor: se-resize\r\n}\r\n\r\n#drawing-modal .modal-body,\r\n#drawing_shortcut_modal .modal-body {\r\n    max-height: 350px;\r\n}\r\n\r\n.shortcutTable [tabindex=\"0\"]:focus {\r\n    outline: -webkit-focus-ring-color auto 1px;\r\n}\r\n\r\n#drawingPreviewMain .h {\r\n    display: none !important;\r\n}\r\n\r\n.drawing_bgimg {\r\n    margin-right: 32px;\r\n    pointer-events: none;\r\n    opacity: 0.4;\r\n}\r\n\r\n#upload_media {\r\n    margin-top: 28px;\r\n}\r\n\r\n.setting_btn {\r\n    right: 1px;\r\n    top: 1px;\r\n    z-index: 1;\r\n}\r\n\r\n.drawing_module_container button:disabled {\r\n    pointer-events: auto !important;\r\n}\r\n\r\n#centerImg {\r\n    position: relative;\r\n}\r\n.mr-2 {\r\n    margin-right: 0.5em !important;\r\n}\r\n#previewSvg { \r\n    width: 600px;\r\n    height: 520px;\r\n    position: absolute;\r\n}";
    styleInject(css_248z);

    /* clsSMDrawing\DrawingPreview.svelte generated by Svelte v3.40.2 */

    const { console: console_1 } = globals;
    const file = "clsSMDrawing\\DrawingPreview.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div17;
    	let div16;
    	let div15;
    	let div0;
    	let h4;
    	let t1;
    	let button0;
    	let t3;
    	let div13;
    	let table;
    	let tbody;
    	let tr0;
    	let td0;
    	let td1;
    	let div1;
    	let span0;
    	let t6;
    	let tr1;
    	let td2;
    	let td3;
    	let div2;
    	let span1;
    	let t9;
    	let tr2;
    	let td4;
    	let td5;
    	let div3;
    	let span2;
    	let t12;
    	let tr3;
    	let td6;
    	let td7;
    	let div4;
    	let span3;
    	let t15;
    	let tr4;
    	let td8;
    	let td9;
    	let div5;
    	let span4;
    	let t18;
    	let tr5;
    	let td10;
    	let td11;
    	let div6;
    	let span5;
    	let t21;
    	let tr6;
    	let td12;
    	let td13;
    	let div7;
    	let span6;
    	let t24;
    	let tr7;
    	let td14;
    	let td15;
    	let div8;
    	let span7;
    	let t27;
    	let tr8;
    	let td16;
    	let td17;
    	let div9;
    	let span8;
    	let t30;
    	let tr9;
    	let td18;
    	let td19;
    	let div10;
    	let span9;
    	let t33;
    	let tr10;
    	let td20;
    	let td21;
    	let div11;
    	let span10;
    	let t36;
    	let tr11;
    	let td22;
    	let td23;
    	let div12;
    	let span11;
    	let t39;
    	let div14;
    	let button1;
    	let t41;
    	let div28;
    	let button2;
    	let t42;
    	let button3;
    	let t43;
    	let center;
    	let div24;
    	let div23;
    	let div18;
    	let button4;
    	let i0;
    	let button4_aria_label_value;
    	let button4_title_value;
    	let t44;
    	let button5;
    	let t45;
    	let button5_aria_label_value;
    	let button5_title_value;
    	let t46;
    	let button6;
    	let i1;
    	let button6_aria_label_value;
    	let button6_title_value;
    	let div18_aria_label_value;
    	let t47;
    	let div19;
    	let button7;
    	let i2;
    	let button7_aria_label_value;
    	let button7_title_value;
    	let t48;
    	let button8;
    	let i3;
    	let button8_title_value;
    	let button8_aria_label_value;
    	let t49;
    	let button9;
    	let i4;
    	let button9_title_value;
    	let button9_aria_label_value;
    	let t50;
    	let button10;
    	let i5;
    	let button10_title_value;
    	let button10_aria_label_value;
    	let div19_aria_label_value;
    	let t51;
    	let div20;
    	let button11;
    	let t52_value = l.mark_pnt + "";
    	let t52;
    	let button11_title_value;
    	let button11_aria_label_value;
    	let div20_aria_label_value;
    	let t53;
    	let div21;
    	let button12;
    	let i6;
    	let button12_title_value;
    	let button12_aria_label_value;
    	let div21_aria_label_value;
    	let t54;
    	let div22;
    	let button13;
    	let t55_value = l.shortcuts + "";
    	let t55;
    	let button13_title_value;
    	let button13_aria_label_value;
    	let div22_aria_label_value;
    	let div23_aria_label_value;
    	let t56;
    	let div27;
    	let div26;
    	let img;
    	let img_src_value;
    	let t57;
    	let div25;
    	let span12;
    	let t58;
    	let svg6;
    	let title0;
    	let t59_value = /*state*/ ctx[2].alt + "";
    	let t59;
    	let g0;
    	let g1;
    	let g2;
    	let g3;
    	let g4;
    	let svg5;
    	let svg4;
    	let g21;
    	let circle0;
    	let g5;
    	let line;
    	let g6;
    	let circle1;
    	let title1;
    	let t60_value = l.compass_center + "";
    	let t60;
    	let desc0;
    	let t61_value = l.shift_arrow_use + "";
    	let t61;
    	let defs0;
    	let pattern0;
    	let svg0;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let circle2;
    	let g13;
    	let circle3;
    	let title2;
    	let t62_value = l.compass_radius + (/*previewCompassRadius*/ ctx[0] * 0.02649).toFixed(2) + "";
    	let t62;
    	let desc1;
    	let t63_value = l.shift_arrow_radius + "";
    	let t63;
    	let defs1;
    	let pattern1;
    	let svg1;
    	let g9;
    	let g7;
    	let rect0;
    	let g8;
    	let rect1;
    	let g12;
    	let g10;
    	let path4;
    	let g11;
    	let path5;
    	let g14;
    	let circle4;
    	let title3;
    	let t64_value = l.compass_angle + /*previewCompassAngle*/ ctx[1] + l.degree + "";
    	let t64;
    	let desc2;
    	let t65_value = l.shift_arrow_angle + "";
    	let t65;
    	let defs2;
    	let pattern2;
    	let svg2;
    	let path6;
    	let g15;
    	let circle5;
    	let circle5_fill_value;
    	let circle6;
    	let title4;
    	let t66_value = l.compass_draw + "";
    	let t66;
    	let desc3;
    	let t67_value = l.shift_arrow_draw + "";
    	let t67;
    	let g20;
    	let circle7;
    	let defs3;
    	let pattern3;
    	let svg3;
    	let g19;
    	let g18;
    	let g17;
    	let g16;
    	let path7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = `${l.shortcuts}`;
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "×";
    			t3 = space();
    			div13 = element("div");
    			table = element("table");
    			tbody = element("tbody");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = `${l.keys}`;
    			td1 = element("td");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = `${l.des_txt}`;
    			t6 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = `${l.ctrl_z}`;
    			td3 = element("td");
    			div2 = element("div");
    			span1 = element("span");
    			span1.textContent = `${l.undo}`;
    			t9 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = `${l.ctrl_x}`;
    			td5 = element("td");
    			div3 = element("div");
    			span2 = element("span");
    			span2.textContent = `${l.cut}`;
    			t12 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = `${l.ctrl_y}`;
    			td7 = element("td");
    			div4 = element("div");
    			span3 = element("span");
    			span3.textContent = `${l.redo}`;
    			t15 = space();
    			tr4 = element("tr");
    			td8 = element("td");
    			td8.textContent = `${l.enter}`;
    			td9 = element("td");
    			div5 = element("div");
    			span4 = element("span");
    			span4.textContent = `${l.enable_tool}`;
    			t18 = space();
    			tr5 = element("tr");
    			td10 = element("td");
    			td10.textContent = `${l.shift_enter}`;
    			td11 = element("td");
    			div6 = element("div");
    			span5 = element("span");
    			span5.textContent = `${l.start_stop_tool}`;
    			t21 = space();
    			tr6 = element("tr");
    			td12 = element("td");
    			td12.textContent = `${l.shift_arrow}`;
    			td13 = element("td");
    			div7 = element("div");
    			span6 = element("span");
    			span6.textContent = `${l.compass_tools}`;
    			t24 = space();
    			tr7 = element("tr");
    			td14 = element("td");
    			td14.textContent = `${l.locking}`;
    			td15 = element("td");
    			div8 = element("div");
    			span7 = element("span");
    			span7.textContent = `${l.locking_txt}`;
    			t27 = space();
    			tr8 = element("tr");
    			td16 = element("td");
    			td16.textContent = `${l.draw_key}`;
    			td17 = element("td");
    			div9 = element("div");
    			span8 = element("span");
    			span8.textContent = `${l.draw_txt}`;
    			t30 = space();
    			tr9 = element("tr");
    			td18 = element("td");
    			td18.textContent = `${l.tab}`;
    			td19 = element("td");
    			div10 = element("div");
    			span9 = element("span");
    			span9.textContent = `${l.focus_next}`;
    			t33 = space();
    			tr10 = element("tr");
    			td20 = element("td");
    			td20.textContent = `${l.shift_tab}`;
    			td21 = element("td");
    			div11 = element("div");
    			span10 = element("span");
    			span10.textContent = `${l.focus_prev}`;
    			t36 = space();
    			tr11 = element("tr");
    			td22 = element("td");
    			td22.textContent = `${l.esc}`;
    			td23 = element("td");
    			div12 = element("div");
    			span11 = element("span");
    			span11.textContent = `${l.exit_txt}`;
    			t39 = space();
    			div14 = element("div");
    			button1 = element("button");
    			button1.textContent = `${l.close}`;
    			t41 = space();
    			div28 = element("div");
    			button2 = element("button");
    			t42 = space();
    			button3 = element("button");
    			t43 = space();
    			center = element("center");
    			div24 = element("div");
    			div23 = element("div");
    			div18 = element("div");
    			button4 = element("button");
    			i0 = element("i");
    			t44 = space();
    			button5 = element("button");
    			t45 = text("/");
    			t46 = space();
    			button6 = element("button");
    			i1 = element("i");
    			t47 = space();
    			div19 = element("div");
    			button7 = element("button");
    			i2 = element("i");
    			t48 = space();
    			button8 = element("button");
    			i3 = element("i");
    			t49 = space();
    			button9 = element("button");
    			i4 = element("i");
    			t50 = space();
    			button10 = element("button");
    			i5 = element("i");
    			t51 = space();
    			div20 = element("div");
    			button11 = element("button");
    			t52 = text(t52_value);
    			t53 = space();
    			div21 = element("div");
    			button12 = element("button");
    			i6 = element("i");
    			t54 = space();
    			div22 = element("div");
    			button13 = element("button");
    			t55 = text(t55_value);
    			t56 = space();
    			div27 = element("div");
    			div26 = element("div");
    			img = element("img");
    			t57 = space();
    			div25 = element("div");
    			span12 = element("span");
    			t58 = space();
    			svg6 = svg_element("svg");
    			title0 = svg_element("title");
    			t59 = text(t59_value);
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			g3 = svg_element("g");
    			g4 = svg_element("g");
    			svg5 = svg_element("svg");
    			svg4 = svg_element("svg");
    			g21 = svg_element("g");
    			circle0 = svg_element("circle");
    			g5 = svg_element("g");
    			line = svg_element("line");
    			g6 = svg_element("g");
    			circle1 = svg_element("circle");
    			title1 = svg_element("title");
    			t60 = text(t60_value);
    			desc0 = svg_element("desc");
    			t61 = text(t61_value);
    			defs0 = svg_element("defs");
    			pattern0 = svg_element("pattern");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			circle2 = svg_element("circle");
    			g13 = svg_element("g");
    			circle3 = svg_element("circle");
    			title2 = svg_element("title");
    			t62 = text(t62_value);
    			desc1 = svg_element("desc");
    			t63 = text(t63_value);
    			defs1 = svg_element("defs");
    			pattern1 = svg_element("pattern");
    			svg1 = svg_element("svg");
    			g9 = svg_element("g");
    			g7 = svg_element("g");
    			rect0 = svg_element("rect");
    			g8 = svg_element("g");
    			rect1 = svg_element("rect");
    			g12 = svg_element("g");
    			g10 = svg_element("g");
    			path4 = svg_element("path");
    			g11 = svg_element("g");
    			path5 = svg_element("path");
    			g14 = svg_element("g");
    			circle4 = svg_element("circle");
    			title3 = svg_element("title");
    			t64 = text(t64_value);
    			desc2 = svg_element("desc");
    			t65 = text(t65_value);
    			defs2 = svg_element("defs");
    			pattern2 = svg_element("pattern");
    			svg2 = svg_element("svg");
    			path6 = svg_element("path");
    			g15 = svg_element("g");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			title4 = svg_element("title");
    			t66 = text(t66_value);
    			desc3 = svg_element("desc");
    			t67 = text(t67_value);
    			g20 = svg_element("g");
    			circle7 = svg_element("circle");
    			defs3 = svg_element("defs");
    			pattern3 = svg_element("pattern");
    			svg3 = svg_element("svg");
    			g19 = svg_element("g");
    			g18 = svg_element("g");
    			g17 = svg_element("g");
    			g16 = svg_element("g");
    			path7 = svg_element("path");
    			attr_dev(h4, "class", "modal-title");
    			add_location(h4, file, 2243, 20, 133295);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-bs-dismiss", "modal");
    			add_location(button0, file, 2244, 20, 133359);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file, 2242, 16, 133247);
    			attr_dev(td0, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td0, file, 2251, 61, 133828);
    			attr_dev(span0, "class", "pl-3 font-weight-bold");
    			add_location(span0, file, 2251, 155, 133922);
    			attr_dev(div1, "class", "d-flex");
    			add_location(div1, file, 2251, 135, 133902);
    			attr_dev(td1, "class", "py-1");
    			add_location(td1, file, 2251, 118, 133885);
    			attr_dev(tr0, "tabindex", "0");
    			attr_dev(tr0, "role", "shortcut");
    			add_location(tr0, file, 2251, 28, 133795);
    			attr_dev(td2, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td2, file, 2252, 61, 134055);
    			attr_dev(span1, "class", "pl-3");
    			add_location(span1, file, 2252, 157, 134151);
    			attr_dev(div2, "class", "d-flex");
    			add_location(div2, file, 2252, 137, 134131);
    			attr_dev(td3, "class", "py-1");
    			add_location(td3, file, 2252, 120, 134114);
    			attr_dev(tr1, "tabindex", "0");
    			attr_dev(tr1, "role", "shortcut");
    			add_location(tr1, file, 2252, 28, 134022);
    			attr_dev(td4, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td4, file, 2253, 62, 134265);
    			attr_dev(span2, "class", "pl-3");
    			add_location(span2, file, 2253, 158, 134361);
    			attr_dev(div3, "class", "d-flex");
    			add_location(div3, file, 2253, 138, 134341);
    			attr_dev(td5, "class", "py-1");
    			add_location(td5, file, 2253, 121, 134324);
    			attr_dev(tr2, "tabindex", "0");
    			attr_dev(tr2, "role", "shortcut");
    			add_location(tr2, file, 2253, 28, 134231);
    			attr_dev(td6, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td6, file, 2254, 62, 134474);
    			attr_dev(span3, "class", "pl-3");
    			add_location(span3, file, 2254, 158, 134570);
    			attr_dev(div4, "class", "d-flex");
    			add_location(div4, file, 2254, 138, 134550);
    			attr_dev(td7, "class", "py-1");
    			add_location(td7, file, 2254, 121, 134533);
    			attr_dev(tr3, "tabindex", "0");
    			attr_dev(tr3, "role", "shortcut");
    			add_location(tr3, file, 2254, 28, 134440);
    			attr_dev(td8, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td8, file, 2255, 62, 134684);
    			attr_dev(span4, "class", "pl-3");
    			add_location(span4, file, 2255, 157, 134779);
    			attr_dev(div5, "class", "d-flex");
    			add_location(div5, file, 2255, 137, 134759);
    			attr_dev(td9, "class", "py-1");
    			add_location(td9, file, 2255, 120, 134742);
    			attr_dev(tr4, "tabindex", "0");
    			attr_dev(tr4, "role", "shortcut");
    			add_location(tr4, file, 2255, 28, 134650);
    			attr_dev(td10, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td10, file, 2256, 62, 134900);
    			attr_dev(span5, "class", "pl-3");
    			add_location(span5, file, 2256, 163, 135001);
    			attr_dev(div6, "class", "d-flex");
    			add_location(div6, file, 2256, 143, 134981);
    			attr_dev(td11, "class", "py-1");
    			add_location(td11, file, 2256, 126, 134964);
    			attr_dev(tr5, "tabindex", "0");
    			attr_dev(tr5, "role", "shortcut");
    			add_location(tr5, file, 2256, 28, 134866);
    			attr_dev(td12, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td12, file, 2257, 62, 135126);
    			attr_dev(span6, "class", "pl-3");
    			add_location(span6, file, 2257, 163, 135227);
    			attr_dev(div7, "class", "d-flex");
    			add_location(div7, file, 2257, 143, 135207);
    			attr_dev(td13, "class", "py-1");
    			add_location(td13, file, 2257, 126, 135190);
    			attr_dev(tr6, "tabindex", "0");
    			attr_dev(tr6, "role", "shortcut");
    			add_location(tr6, file, 2257, 28, 135092);
    			attr_dev(td14, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td14, file, 2258, 62, 135350);
    			attr_dev(span7, "class", "pl-3");
    			add_location(span7, file, 2258, 159, 135447);
    			attr_dev(div8, "class", "d-flex");
    			add_location(div8, file, 2258, 139, 135427);
    			attr_dev(td15, "class", "py-1");
    			add_location(td15, file, 2258, 122, 135410);
    			attr_dev(tr7, "tabindex", "0");
    			attr_dev(tr7, "role", "shortcut");
    			add_location(tr7, file, 2258, 28, 135316);
    			attr_dev(td16, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td16, file, 2259, 62, 135568);
    			attr_dev(span8, "class", "pl-3");
    			add_location(span8, file, 2259, 160, 135666);
    			attr_dev(div9, "class", "d-flex");
    			add_location(div9, file, 2259, 140, 135646);
    			attr_dev(td17, "class", "py-1");
    			add_location(td17, file, 2259, 123, 135629);
    			attr_dev(tr8, "tabindex", "0");
    			attr_dev(tr8, "role", "shortcut");
    			add_location(tr8, file, 2259, 28, 135534);
    			attr_dev(td18, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td18, file, 2260, 62, 135784);
    			attr_dev(span9, "class", "pl-3");
    			add_location(span9, file, 2260, 155, 135877);
    			attr_dev(div10, "class", "d-flex");
    			add_location(div10, file, 2260, 135, 135857);
    			attr_dev(td19, "class", "py-1");
    			add_location(td19, file, 2260, 118, 135840);
    			attr_dev(tr9, "tabindex", "0");
    			attr_dev(tr9, "role", "shortcut");
    			add_location(tr9, file, 2260, 28, 135750);
    			attr_dev(td20, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td20, file, 2261, 62, 135997);
    			attr_dev(span10, "class", "pl-3");
    			add_location(span10, file, 2261, 161, 136096);
    			attr_dev(div11, "class", "d-flex");
    			add_location(div11, file, 2261, 141, 136076);
    			attr_dev(td21, "class", "py-1");
    			add_location(td21, file, 2261, 124, 136059);
    			attr_dev(tr10, "tabindex", "0");
    			attr_dev(tr10, "role", "shortcut");
    			add_location(tr10, file, 2261, 28, 135963);
    			attr_dev(td22, "class", "py-1 font-weight-bold w-50 pr-0");
    			add_location(td22, file, 2262, 62, 136216);
    			attr_dev(span11, "class", "pl-3");
    			add_location(span11, file, 2262, 155, 136309);
    			attr_dev(div12, "class", "d-flex");
    			add_location(div12, file, 2262, 135, 136289);
    			attr_dev(td23, "class", "py-1");
    			add_location(td23, file, 2262, 118, 136272);
    			attr_dev(tr11, "tabindex", "0");
    			attr_dev(tr11, "role", "shortcut");
    			add_location(tr11, file, 2262, 28, 136182);
    			attr_dev(tbody, "tabindex", "0");
    			attr_dev(tbody, "role", "shortcut");
    			add_location(tbody, file, 2250, 24, 133729);
    			attr_dev(table, "role", "shortcut");
    			attr_dev(table, "class", "shortcutTable m-0 p-2 border-0 common-shortcut-table table-striped font15");
    			add_location(table, file, 2249, 20, 133598);
    			attr_dev(div13, "class", "modal-body overflow-y");
    			add_location(div13, file, 2246, 16, 133477);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-light");
    			attr_dev(button1, "data-bs-dismiss", "modal");
    			add_location(button1, file, 2267, 20, 136517);
    			attr_dev(div14, "class", "modal-footer");
    			add_location(div14, file, 2266, 16, 136469);
    			attr_dev(div15, "class", "modal-content");
    			add_location(div15, file, 2241, 12, 133202);
    			attr_dev(div16, "class", "modal-dialog modal-dialog-centered");
    			add_location(div16, file, 2240, 8, 133140);
    			attr_dev(div17, "id", "drawing_shortcut_modal");
    			attr_dev(div17, "class", "modal fade");
    			attr_dev(div17, "tabindex", "-1");
    			add_location(div17, file, 2239, 4, 133064);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "h h-imp");
    			attr_dev(button2, "id", "set-review");
    			add_location(button2, file, 2273, 8, 136729);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "h h-imp");
    			attr_dev(button3, "id", "unset-review");
    			add_location(button3, file, 2274, 8, 136802);
    			attr_dev(i0, "class", "icomoon-pencil");
    			add_location(i0, file, 2279, 257, 137442);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "data-title", "scribble");
    			attr_dev(button4, "tabindex", "0");
    			attr_dev(button4, "aria-label", button4_aria_label_value = l.scribble_tool);
    			attr_dev(button4, "title", button4_title_value = l.scribble);
    			attr_dev(button4, "name", "preview_scribble");
    			attr_dev(button4, "id", "preview_scribble");
    			attr_dev(button4, "class", "geometryToolPreview tooltip_btn btn btn-light preview_toolbar preview_btn");
    			add_location(button4, file, 2279, 24, 137209);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "data-title", "line");
    			attr_dev(button5, "tabindex", "0");
    			attr_dev(button5, "aria-label", button5_aria_label_value = l.line_tool);
    			attr_dev(button5, "title", button5_title_value = l.line);
    			attr_dev(button5, "name", "preview_line");
    			attr_dev(button5, "id", "preview_line");
    			attr_dev(button5, "class", "geometryToolPreview btn btn-light tooltip_btn preview_toolbar preview_btn");
    			add_location(button5, file, 2280, 24, 137507);
    			attr_dev(i1, "class", "icomoon-compass1");
    			add_location(i1, file, 2281, 252, 137984);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "data-title", "compass");
    			attr_dev(button6, "tabindex", "0");
    			attr_dev(button6, "aria-label", button6_aria_label_value = l.compass_tool);
    			attr_dev(button6, "title", button6_title_value = l.compass);
    			attr_dev(button6, "name", "preview_compass");
    			attr_dev(button6, "id", "preview_compass");
    			attr_dev(button6, "class", "geometryToolPreview tooltip_btn btn btn-light preview_toolbar preview_btn");
    			add_location(button6, file, 2281, 24, 137756);
    			attr_dev(div18, "class", "btn-group mr-2");
    			attr_dev(div18, "role", "group");
    			attr_dev(div18, "tabindex", "0");
    			attr_dev(div18, "aria-label", div18_aria_label_value = l.draw_tools);
    			add_location(div18, file, 2278, 20, 137103);
    			attr_dev(i2, "class", "icomoon-delete-sm");
    			add_location(i2, file, 2284, 224, 138385);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "data-title", "eraser");
    			attr_dev(button7, "tabindex", "0");
    			attr_dev(button7, "aria-label", button7_aria_label_value = l.delete_tool);
    			attr_dev(button7, "title", button7_title_value = l.delete_tool);
    			attr_dev(button7, "name", "eraser");
    			attr_dev(button7, "id", "preview_eraser");
    			attr_dev(button7, "class", "btn btn-light tooltip_btn preview_toolbar preview_btn");
    			add_location(button7, file, 2284, 24, 138185);
    			attr_dev(i3, "class", "icomoon-close-2");
    			add_location(i3, file, 2285, 209, 138638);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "title", button8_title_value = l.clear_screen);
    			attr_dev(button8, "tabindex", "0");
    			attr_dev(button8, "aria-label", button8_aria_label_value = l.clear_screen);
    			attr_dev(button8, "name", "clearScreen");
    			attr_dev(button8, "id", "preview_clearScreen");
    			button8.disabled = "disabled";
    			attr_dev(button8, "class", "btn btn-light tooltip_btn");
    			add_location(button8, file, 2285, 24, 138453);
    			attr_dev(i4, "class", "icomoon-redo-2");
    			add_location(i4, file, 2286, 178, 138858);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "title", button9_title_value = l.redo);
    			attr_dev(button9, "name", "redo");
    			attr_dev(button9, "tabindex", "0");
    			attr_dev(button9, "aria-label", button9_aria_label_value = l.redo);
    			attr_dev(button9, "id", "preview_redo");
    			button9.disabled = "disabled";
    			attr_dev(button9, "class", "btn btn-light tooltip_btn");
    			add_location(button9, file, 2286, 24, 138704);
    			attr_dev(i5, "class", "icomoon-undo-2");
    			add_location(i5, file, 2287, 178, 139077);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "title", button10_title_value = l.undo);
    			attr_dev(button10, "name", "undo");
    			attr_dev(button10, "tabindex", "0");
    			attr_dev(button10, "aria-label", button10_aria_label_value = l.undo);
    			attr_dev(button10, "id", "preview_undo");
    			button10.disabled = "disabled";
    			attr_dev(button10, "class", "btn btn-light tooltip_btn");
    			add_location(button10, file, 2287, 24, 138923);
    			attr_dev(div19, "class", "btn-group mr-2");
    			attr_dev(div19, "role", "group");
    			attr_dev(div19, "tabindex", "0");
    			attr_dev(div19, "aria-label", div19_aria_label_value = l.removing_tools);
    			add_location(div19, file, 2283, 20, 138075);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "title", button11_title_value = l.mark_finish_point);
    			attr_dev(button11, "name", "mark_points");
    			attr_dev(button11, "tabindex", "0");
    			attr_dev(button11, "aria-label", button11_aria_label_value = l.mark_ans_point);
    			attr_dev(button11, "id", "mark_points");
    			attr_dev(button11, "class", "btn tooltip_btn btn-light");
    			add_location(button11, file, 2290, 24, 139276);
    			attr_dev(div20, "class", "btn-group mr-2 marking_group");
    			attr_dev(div20, "role", "group");
    			attr_dev(div20, "aria-label", div20_aria_label_value = l.marking_tools);
    			add_location(div20, file, 2289, 20, 139166);
    			attr_dev(i6, "class", "icomoon-new-24px-reset-1");
    			add_location(i6, file, 2293, 182, 139768);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "title", button12_title_value = l.reset);
    			attr_dev(button12, "name", "preview_reset_btn");
    			attr_dev(button12, "tabindex", "0");
    			attr_dev(button12, "aria-label", button12_aria_label_value = l.reset_btn);
    			attr_dev(button12, "id", "preview_reset_btn");
    			attr_dev(button12, "class", "btn tooltip_btn btn-light");
    			add_location(button12, file, 2293, 24, 139610);
    			attr_dev(div21, "class", "btn-group mr-2 reset_group");
    			attr_dev(div21, "role", "group");
    			attr_dev(div21, "aria-label", div21_aria_label_value = l.reset);
    			add_location(div21, file, 2292, 20, 139510);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "title", button13_title_value = l.shortcuts);
    			attr_dev(button13, "name", "shortcut_modal_btn");
    			attr_dev(button13, "aria-label", button13_aria_label_value = l.shortcuts);
    			attr_dev(button13, "tabindex", "0");
    			attr_dev(button13, "id", "shortcut_modal_btn");
    			attr_dev(button13, "class", "tooltip_btn btn btn-primary");
    			add_location(button13, file, 2296, 24, 139959);
    			attr_dev(div22, "class", "btn-group mr-2");
    			attr_dev(div22, "role", "group");
    			attr_dev(div22, "aria-label", div22_aria_label_value = l.shortcuts);
    			add_location(div22, file, 2295, 20, 139867);
    			attr_dev(div23, "class", "btn-toolbar preview_drawing_toolbar");
    			attr_dev(div23, "role", "toolbar");
    			attr_dev(div23, "aria-label", div23_aria_label_value = l.drawing_tools);
    			add_location(div23, file, 2277, 16, 136988);
    			attr_dev(div24, "class", "mt-2 mb-3 previewBtnGrp");
    			add_location(div24, file, 2276, 12, 136933);
    			attr_dev(img, "class", "border");
    			attr_dev(img, "alt", "");
    			if (!src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[3] + /*state*/ ctx[2].bgImg)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "id", "svgImgPreview");
    			add_location(img, file, 2302, 20, 140379);
    			attr_dev(span12, "class", "icomoon-plus s2 move_icon position-absolute h");
    			attr_dev(span12, "id", "moveDrawIcon");
    			add_location(span12, file, 2304, 24, 140510);
    			add_location(div25, file, 2303, 20, 140479);
    			attr_dev(title0, "id", "previewSvgTitle");
    			add_location(title0, file, 2307, 24, 140788);
    			attr_dev(g0, "class", "backgroundFocusPathPreview");
    			add_location(g0, file, 2308, 24, 140861);
    			attr_dev(g1, "class", "previewDrawingPaths");
    			add_location(g1, file, 2309, 24, 140929);
    			attr_dev(g2, "class", "correct_answer_container");
    			add_location(g2, file, 2310, 24, 140990);
    			attr_dev(g3, "class", "backgroundFocusPointPreview");
    			add_location(g3, file, 2311, 24, 141056);
    			attr_dev(g4, "class", "previewMarkingPaths");
    			add_location(g4, file, 2312, 24, 141125);
    			attr_dev(circle0, "class", "drawingCompassRoute compass_route");
    			attr_dev(circle0, "cx", "267.984375");
    			attr_dev(circle0, "cy", "173");
    			attr_dev(circle0, "r", "80");
    			attr_dev(circle0, "fill-opacity", "0");
    			attr_dev(circle0, "stroke", "#C9C9C9");
    			attr_dev(circle0, "stroke-dasharray", "2,10");
    			attr_dev(circle0, "stroke-width", "2");
    			add_location(circle0, file, 2316, 36, 141347);
    			attr_dev(line, "class", "compassRotationBar compass_radius");
    			attr_dev(line, "x1", "267.984375");
    			attr_dev(line, "y1", "173");
    			attr_dev(line, "x2", "267.984375");
    			attr_dev(line, "y2", "253");
    			attr_dev(line, "stroke", "#C9C9C9");
    			attr_dev(line, "stroke-width", "2");
    			add_location(line, file, 2318, 40, 141596);
    			add_location(g5, file, 2317, 36, 141551);
    			attr_dev(circle1, "tabindex", "0");
    			attr_dev(circle1, "class", "drawingCompassCenter compass_center");
    			attr_dev(circle1, "cx", "267.984375");
    			attr_dev(circle1, "cy", "173");
    			attr_dev(circle1, "r", "17");
    			attr_dev(circle1, "aria-labelledby", "compassCenterTitle compassCenterDesc");
    			attr_dev(circle1, "focusable", "true");
    			attr_dev(circle1, "fill", "url(#previewDrawingCenter)");
    			attr_dev(circle1, "stroke", "#C9C9C9");
    			add_location(circle1, file, 2321, 40, 141861);
    			attr_dev(title1, "id", "compassCenterTitle");
    			add_location(title1, file, 2322, 40, 142132);
    			attr_dev(desc0, "id", "compassCenterDesc");
    			add_location(desc0, file, 2323, 40, 142231);
    			attr_dev(path0, "fill", "#808080");
    			attr_dev(path0, "class", "st0");
    			attr_dev(path0, "d", "M3.22,15.1L1,12l2.22-3.1C3.22,10.97,3.22,13.03,3.22,15.1z");
    			add_location(path0, file, 2327, 52, 142618);
    			attr_dev(path1, "fill", "#808080");
    			attr_dev(path1, "class", "st0");
    			attr_dev(path1, "d", "M8.9,3.22L12,1l3.1,2.22C13.03,3.22,10.97,3.22,8.9,3.22z");
    			add_location(path1, file, 2328, 52, 142769);
    			attr_dev(path2, "fill", "#808080");
    			attr_dev(path2, "class", "st0");
    			attr_dev(path2, "d", "M15.1,20.78L12,23l-3.1-2.22C10.97,20.78,13.03,20.78,15.1,20.78z");
    			add_location(path2, file, 2329, 52, 142918);
    			attr_dev(path3, "fill", "#808080");
    			attr_dev(path3, "class", "st0");
    			attr_dev(path3, "d", "M20.78,8.9L23,12l-2.22,3.1C20.78,13.03,20.78,10.97,20.78,8.9z");
    			add_location(path3, file, 2330, 52, 143075);
    			attr_dev(circle2, "cx", "12");
    			attr_dev(circle2, "cy", "12");
    			attr_dev(circle2, "r", "2");
    			attr_dev(circle2, "fill", "#333333");
    			add_location(circle2, file, 2331, 52, 143230);
    			attr_dev(svg0, "x", "0px");
    			attr_dev(svg0, "y", "0px");
    			attr_dev(svg0, "viewBox", "1 -3 21 35");
    			attr_dev(svg0, "width", "33");
    			attr_dev(svg0, "height", "41");
    			add_location(svg0, file, 2326, 48, 142499);
    			attr_dev(pattern0, "id", "previewDrawingCenter");
    			attr_dev(pattern0, "width", "20");
    			attr_dev(pattern0, "height", "20");
    			attr_dev(pattern0, "fill", "red");
    			add_location(pattern0, file, 2325, 44, 142380);
    			add_location(defs0, file, 2324, 40, 142328);
    			add_location(g6, file, 2320, 36, 141815);
    			attr_dev(circle3, "class", "compass_radius_icon mid_circle");
    			attr_dev(circle3, "cx", "267.984375");
    			attr_dev(circle3, "cy", "213");
    			attr_dev(circle3, "r", "17");
    			attr_dev(circle3, "fill", "url(#previewDrawingRadius)");
    			attr_dev(circle3, "transform", "rotate(90,160,168)");
    			attr_dev(circle3, "aria-labelledby", "compassRadiusTitle compassRadiusDesc");
    			attr_dev(circle3, "tabindex", "0");
    			attr_dev(circle3, "focusable", "true");
    			attr_dev(circle3, "stroke", "#C9C9C9");
    			add_location(circle3, file, 2337, 40, 143563);
    			attr_dev(title2, "id", "compassRadiusTitle");
    			add_location(title2, file, 2338, 40, 143860);
    			attr_dev(desc1, "id", "compassRadiusDesc");
    			add_location(desc1, file, 2339, 40, 144005);
    			attr_dev(rect0, "x", "8.53");
    			attr_dev(rect0, "y", "1.11");
    			attr_dev(rect0, "width", "1.5");
    			attr_dev(rect0, "height", "21.79");
    			add_location(rect0, file, 2345, 60, 144510);
    			add_location(g7, file, 2344, 56, 144445);
    			attr_dev(rect1, "x", "13.97");
    			attr_dev(rect1, "y", "1.11");
    			attr_dev(rect1, "width", "1.5");
    			attr_dev(rect1, "height", "21.79");
    			add_location(rect1, file, 2348, 60, 144748);
    			add_location(g8, file, 2347, 56, 144683);
    			add_location(g9, file, 2343, 52, 144384);
    			attr_dev(path4, "d", "M5.87,16.87L1,12l4.87-4.87C5.87,10.38,5.87,13.62,5.87,16.87z");
    			add_location(path4, file, 2353, 60, 145102);
    			add_location(g10, file, 2352, 56, 145037);
    			attr_dev(path5, "d", "M18.13,16.87L23,12l-4.87-4.87C18.13,10.38,18.13,13.62,18.13,16.87z");
    			add_location(path5, file, 2356, 60, 145360);
    			add_location(g11, file, 2355, 56, 145295);
    			add_location(g12, file, 2351, 52, 144976);
    			attr_dev(svg1, "x", "0px");
    			attr_dev(svg1, "y", "0px");
    			attr_dev(svg1, "viewBox", "1 -5 21 34");
    			attr_dev(svg1, "width", "33");
    			attr_dev(svg1, "height", "33");
    			add_location(svg1, file, 2342, 48, 144265);
    			attr_dev(pattern1, "id", "previewDrawingRadius");
    			attr_dev(pattern1, "width", "20");
    			attr_dev(pattern1, "height", "20");
    			add_location(pattern1, file, 2341, 44, 144157);
    			add_location(defs1, file, 2340, 40, 144105);
    			add_location(g13, file, 2336, 36, 143518);
    			attr_dev(circle4, "class", "compass_rotation midSmallCircle");
    			attr_dev(circle4, "cx", "267.984375");
    			attr_dev(circle4, "cy", "233");
    			attr_dev(circle4, "r", "8");
    			attr_dev(circle4, "fill", "url(#previewMidSmallCircle_icon)");
    			attr_dev(circle4, "area-label", "Compass Angle Use Shift and arrow keys to increase or decrease the radius");
    			attr_dev(circle4, "aria-labelledby", "compassRotationTitle compassRotationDesc");
    			attr_dev(circle4, "tabindex", "0");
    			attr_dev(circle4, "focusable", "true");
    			attr_dev(circle4, "transform", "rotate(90,160,193)");
    			add_location(circle4, file, 2364, 40, 145845);
    			attr_dev(title3, "id", "compassRotationTitle");
    			add_location(title3, file, 2365, 40, 146222);
    			attr_dev(desc2, "id", "compassRotationDesc");
    			add_location(desc2, file, 2366, 40, 146355);
    			attr_dev(path6, "fill", "#000");
    			attr_dev(path6, "opacity", "0.8");
    			attr_dev(path6, "d", "M7,14 C3.13400675,14 0,10.8659932 0,7 C0,3.13400675 3.13400675,0 7, 0 C10.8659932,0 14,3.13400675 14,7 C14,10.8659932 10.8659932,14 7, 14 Z M4.66666667,8.16666667 L7,11.6666667 L9.33333333,8.16666667 L4.66666667,8.16666667 Z M4.66666667,5.83333333 L9.33333333,5.83333333 L7,2.33333333 L4.66666667,5.83333333 Z");
    			add_location(path6, file, 2370, 52, 146742);
    			attr_dev(svg2, "width", "16px");
    			attr_dev(svg2, "height", "16px");
    			attr_dev(svg2, "viewBox", "0 0 14 14");
    			attr_dev(svg2, "version", "1.1");
    			add_location(svg2, file, 2369, 48, 146622);
    			attr_dev(pattern2, "id", "previewMidSmallCircle_icon");
    			attr_dev(pattern2, "width", "20");
    			attr_dev(pattern2, "height", "20");
    			add_location(pattern2, file, 2368, 44, 146508);
    			add_location(defs2, file, 2367, 40, 146456);
    			add_location(g14, file, 2363, 36, 145800);
    			attr_dev(circle5, "class", "drawing-compass-pointer lastCircle");
    			attr_dev(circle5, "cx", "267.984375");
    			attr_dev(circle5, "cy", "253");
    			attr_dev(circle5, "r", "3");
    			attr_dev(circle5, "fill", circle5_fill_value = /*state*/ ctx[2].lineColor);
    			add_location(circle5, file, 2376, 40, 147381);
    			attr_dev(circle6, "class", "drawing-compass-pointer-border lastCircle lastbigcircle");
    			attr_dev(circle6, "aria-labelledby", "compassAngleTitle compassAngleDesc");
    			attr_dev(circle6, "cx", "267.984375");
    			attr_dev(circle6, "cy", "253");
    			attr_dev(circle6, "r", "17");
    			attr_dev(circle6, "tabindex", "0");
    			attr_dev(circle6, "focusable", "true");
    			attr_dev(circle6, "fill-opacity", "0");
    			attr_dev(circle6, "stroke", "#C9C9C9");
    			add_location(circle6, file, 2377, 40, 147537);
    			attr_dev(title4, "id", "compassAngleTitle");
    			add_location(title4, file, 2378, 40, 147809);
    			attr_dev(desc3, "id", "compassAngleDesc");
    			add_location(desc3, file, 2379, 40, 147905);
    			add_location(g15, file, 2375, 36, 147336);
    			attr_dev(circle7, "class", "lastCircleMid");
    			attr_dev(circle7, "fill", "url(#previewLastCircleMid_icon)");
    			attr_dev(circle7, "transform", "rotate(90,160,243)");
    			attr_dev(circle7, "cx", "267.984375");
    			attr_dev(circle7, "cy", "293");
    			attr_dev(circle7, "r", "12");
    			attr_dev(circle7, "opacity", "0");
    			add_location(circle7, file, 2382, 40, 148085);
    			attr_dev(path7, "d", "M3.76491276,22.4309727 C5.88207272,19.902578 7.10843487, 16.447736 7.10843487,12.7446281 C7.10843487,9.90533039 6.38974128, 7.20188959 5.07542401,4.93464319 L1.71316547,5.67221801 L4.9100909, 0.48305188 L10.1719173,3.81663137 L7.11351005,4.48755064 C8.4088902, 6.93966677 9.10843487,9.78181395 9.10843487,12.7446281 C9.10843487, 16.6677555 7.87827881,20.3638018 5.71250857,23.1972812 L8.63385425, 24.3467251 L2.93165771,26.8255625 L0.595287046,21.1838396 L3.76491276, 22.4309727 Z");
    			attr_dev(path7, "class", "");
    			add_location(path7, file, 2390, 68, 149198);
    			attr_dev(g16, "transform", "translate(313.742737, 140.576561) rotate(-2.000000) translate(-313.742737, -140.576561) translate(308.242737, 127.076561)");
    			add_location(g16, file, 2389, 64, 148991);
    			attr_dev(g17, "transform", "translate(207.000000, 318.000000)");
    			add_location(g17, file, 2388, 60, 148876);
    			attr_dev(g18, "transform", "translate(-516.000000, -445.000000)");
    			attr_dev(g18, "fill", "#333333");
    			attr_dev(g18, "fillrule", "nonzero");
    			add_location(g18, file, 2387, 56, 148729);
    			attr_dev(g19, "stroke", "none");
    			attr_dev(g19, "strokewidth", "1");
    			attr_dev(g19, "fill", "none");
    			attr_dev(g19, "fillrule", "evenodd");
    			attr_dev(g19, "opacity", "0.5");
    			add_location(g19, file, 2386, 52, 148593);
    			attr_dev(svg3, "width", "24");
    			attr_dev(svg3, "height", "23");
    			attr_dev(svg3, "viewBox", "0 0 11 27");
    			attr_dev(svg3, "version", "1.1");
    			attr_dev(svg3, "enablebackground", "new 0 0 8 24");
    			add_location(svg3, file, 2385, 48, 148445);
    			attr_dev(pattern3, "id", "previewLastCircleMid_icon");
    			attr_dev(pattern3, "width", "20");
    			attr_dev(pattern3, "height", "20");
    			add_location(pattern3, file, 2384, 44, 148332);
    			add_location(defs3, file, 2383, 40, 148280);
    			add_location(g20, file, 2381, 36, 148040);
    			add_location(g21, file, 2315, 32, 141306);
    			add_location(svg4, file, 2314, 28, 141267);
    			attr_dev(svg5, "class", "drawingCompassSvg h");
    			attr_dev(svg5, "focusable", "false");
    			add_location(svg5, file, 2313, 24, 141186);
    			attr_dev(svg6, "width", "100%");
    			attr_dev(svg6, "height", "100%");
    			attr_dev(svg6, "id", "previewSvg");
    			attr_dev(svg6, "class", "previewKeySvg");
    			attr_dev(svg6, "tabindex", "0");
    			attr_dev(svg6, "aria-labelledby", "previewSvgTitle");
    			add_location(svg6, file, 2306, 20, 140645);
    			attr_dev(div26, "id", "centerImg");
    			attr_dev(div26, "class", "centerImg centerImgPreview my-auto relative ml-0");
    			add_location(div26, file, 2301, 16, 140280);
    			add_location(div27, file, 2300, 12, 140257);
    			attr_dev(center, "class", "preview_drawing_container");
    			add_location(center, file, 2275, 8, 136877);
    			attr_dev(div28, "class", "drawing_module_container");
    			add_location(div28, file, 2272, 4, 136681);
    			attr_dev(main, "id", "drawingPreviewMain");
    			add_location(main, file, 2238, 0, 133028);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div0);
    			append_dev(div0, h4);
    			append_dev(div0, t1);
    			append_dev(div0, button0);
    			append_dev(div15, t3);
    			append_dev(div15, div13);
    			append_dev(div13, table);
    			append_dev(table, tbody);
    			append_dev(tbody, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, td1);
    			append_dev(td1, div1);
    			append_dev(div1, span0);
    			append_dev(tbody, t6);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, td3);
    			append_dev(td3, div2);
    			append_dev(div2, span1);
    			append_dev(tbody, t9);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, td5);
    			append_dev(td5, div3);
    			append_dev(div3, span2);
    			append_dev(tbody, t12);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, td7);
    			append_dev(td7, div4);
    			append_dev(div4, span3);
    			append_dev(tbody, t15);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td8);
    			append_dev(tr4, td9);
    			append_dev(td9, div5);
    			append_dev(div5, span4);
    			append_dev(tbody, t18);
    			append_dev(tbody, tr5);
    			append_dev(tr5, td10);
    			append_dev(tr5, td11);
    			append_dev(td11, div6);
    			append_dev(div6, span5);
    			append_dev(tbody, t21);
    			append_dev(tbody, tr6);
    			append_dev(tr6, td12);
    			append_dev(tr6, td13);
    			append_dev(td13, div7);
    			append_dev(div7, span6);
    			append_dev(tbody, t24);
    			append_dev(tbody, tr7);
    			append_dev(tr7, td14);
    			append_dev(tr7, td15);
    			append_dev(td15, div8);
    			append_dev(div8, span7);
    			append_dev(tbody, t27);
    			append_dev(tbody, tr8);
    			append_dev(tr8, td16);
    			append_dev(tr8, td17);
    			append_dev(td17, div9);
    			append_dev(div9, span8);
    			append_dev(tbody, t30);
    			append_dev(tbody, tr9);
    			append_dev(tr9, td18);
    			append_dev(tr9, td19);
    			append_dev(td19, div10);
    			append_dev(div10, span9);
    			append_dev(tbody, t33);
    			append_dev(tbody, tr10);
    			append_dev(tr10, td20);
    			append_dev(tr10, td21);
    			append_dev(td21, div11);
    			append_dev(div11, span10);
    			append_dev(tbody, t36);
    			append_dev(tbody, tr11);
    			append_dev(tr11, td22);
    			append_dev(tr11, td23);
    			append_dev(td23, div12);
    			append_dev(div12, span11);
    			append_dev(div15, t39);
    			append_dev(div15, div14);
    			append_dev(div14, button1);
    			append_dev(main, t41);
    			append_dev(main, div28);
    			append_dev(div28, button2);
    			append_dev(div28, t42);
    			append_dev(div28, button3);
    			append_dev(div28, t43);
    			append_dev(div28, center);
    			append_dev(center, div24);
    			append_dev(div24, div23);
    			append_dev(div23, div18);
    			append_dev(div18, button4);
    			append_dev(button4, i0);
    			append_dev(div18, t44);
    			append_dev(div18, button5);
    			append_dev(button5, t45);
    			append_dev(div18, t46);
    			append_dev(div18, button6);
    			append_dev(button6, i1);
    			append_dev(div23, t47);
    			append_dev(div23, div19);
    			append_dev(div19, button7);
    			append_dev(button7, i2);
    			append_dev(div19, t48);
    			append_dev(div19, button8);
    			append_dev(button8, i3);
    			append_dev(div19, t49);
    			append_dev(div19, button9);
    			append_dev(button9, i4);
    			append_dev(div19, t50);
    			append_dev(div19, button10);
    			append_dev(button10, i5);
    			append_dev(div23, t51);
    			append_dev(div23, div20);
    			append_dev(div20, button11);
    			append_dev(button11, t52);
    			append_dev(div23, t53);
    			append_dev(div23, div21);
    			append_dev(div21, button12);
    			append_dev(button12, i6);
    			append_dev(div23, t54);
    			append_dev(div23, div22);
    			append_dev(div22, button13);
    			append_dev(button13, t55);
    			append_dev(center, t56);
    			append_dev(center, div27);
    			append_dev(div27, div26);
    			append_dev(div26, img);
    			append_dev(div26, t57);
    			append_dev(div26, div25);
    			append_dev(div25, span12);
    			append_dev(div26, t58);
    			append_dev(div26, svg6);
    			append_dev(svg6, title0);
    			append_dev(title0, t59);
    			append_dev(svg6, g0);
    			append_dev(svg6, g1);
    			append_dev(svg6, g2);
    			append_dev(svg6, g3);
    			append_dev(svg6, g4);
    			append_dev(svg6, svg5);
    			append_dev(svg5, svg4);
    			append_dev(svg4, g21);
    			append_dev(g21, circle0);
    			append_dev(g21, g5);
    			append_dev(g5, line);
    			append_dev(g21, g6);
    			append_dev(g6, circle1);
    			append_dev(g6, title1);
    			append_dev(title1, t60);
    			append_dev(g6, desc0);
    			append_dev(desc0, t61);
    			append_dev(g6, defs0);
    			append_dev(defs0, pattern0);
    			append_dev(pattern0, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(svg0, path2);
    			append_dev(svg0, path3);
    			append_dev(svg0, circle2);
    			append_dev(g21, g13);
    			append_dev(g13, circle3);
    			append_dev(g13, title2);
    			append_dev(title2, t62);
    			append_dev(g13, desc1);
    			append_dev(desc1, t63);
    			append_dev(g13, defs1);
    			append_dev(defs1, pattern1);
    			append_dev(pattern1, svg1);
    			append_dev(svg1, g9);
    			append_dev(g9, g7);
    			append_dev(g7, rect0);
    			append_dev(g9, g8);
    			append_dev(g8, rect1);
    			append_dev(svg1, g12);
    			append_dev(g12, g10);
    			append_dev(g10, path4);
    			append_dev(g12, g11);
    			append_dev(g11, path5);
    			append_dev(g21, g14);
    			append_dev(g14, circle4);
    			append_dev(g14, title3);
    			append_dev(title3, t64);
    			append_dev(g14, desc2);
    			append_dev(desc2, t65);
    			append_dev(g14, defs2);
    			append_dev(defs2, pattern2);
    			append_dev(pattern2, svg2);
    			append_dev(svg2, path6);
    			append_dev(g21, g15);
    			append_dev(g15, circle5);
    			append_dev(g15, circle6);
    			append_dev(g15, title4);
    			append_dev(title4, t66);
    			append_dev(g15, desc3);
    			append_dev(desc3, t67);
    			append_dev(g21, g20);
    			append_dev(g20, circle7);
    			append_dev(g20, defs3);
    			append_dev(defs3, pattern3);
    			append_dev(pattern3, svg3);
    			append_dev(svg3, g19);
    			append_dev(g19, g18);
    			append_dev(g18, g17);
    			append_dev(g17, g16);
    			append_dev(g16, path7);

    			if (!mounted) {
    				dispose = listen_dev(button13, "click", /*openShortcut*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && !src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[3] + /*state*/ ctx[2].bgImg)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*state*/ 4 && t59_value !== (t59_value = /*state*/ ctx[2].alt + "")) set_data_dev(t59, t59_value);
    			if (dirty[0] & /*previewCompassRadius*/ 1 && t62_value !== (t62_value = l.compass_radius + (/*previewCompassRadius*/ ctx[0] * 0.02649).toFixed(2) + "")) set_data_dev(t62, t62_value);
    			if (dirty[0] & /*previewCompassAngle*/ 2 && t64_value !== (t64_value = l.compass_angle + /*previewCompassAngle*/ ctx[1] + l.degree + "")) set_data_dev(t64, t64_value);

    			if (dirty[0] & /*state*/ 4 && circle5_fill_value !== (circle5_fill_value = /*state*/ ctx[2].lineColor)) {
    				attr_dev(circle5, "fill", circle5_fill_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
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

    function arrayCopy(array) {
    	// creates a temporary array
    	let tempArray = [];

    	for (let index = 0; index < array.length; index++) {
    		// pushes default initialized object into array tempArray
    		tempArray.push({
    			mode: "mode",
    			order: 2,
    			type: "scribble_0",
    			index: 0,
    			d: "path"
    		});

    		// update the value of mode key of array tempArray at index specified in variable 'index' with the value of mode key of array passed in argument at index specified in variable 'index'
    		tempArray[index].mode = array[index].mode;

    		// update the value of order key of array tempArray at index specified in variable 'index' with the value of order key of array passed in argument at index specified in variable 'index'
    		tempArray[index].order = array[index].order;

    		// update the value of type key of array tempArray at index specified in variable 'index' with the value of type key of array passed in argument at index specified in variable 'index'
    		tempArray[index].type = array[index].type;

    		// update the value of index key of array tempArray at index specified in variable 'index' with the value of index key of array passed in argument at index specified in variable 'index'
    		tempArray[index].index = array[index].index;

    		// update the value of d key of array tempArray at index specified in variable 'index' with the value of d key of array passed in argument at index specified in variable 'index'
    		tempArray[index].d = array[index].d;
    	}

    	// retuns array after copied data from array passed in arguments
    	return tempArray;
    }

    // Center of the circle (cx, cy)
    // Radius of circle: r
    // First Point (ax,ay) and second Point (bx,by)
    function checkIntersection(ax, ay, bx, by, cx, cy, r) {
    	ax -= cx;
    	ay -= cy;
    	bx -= cx;
    	by -= cy;
    	let a = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    	let b = 2 * (ax * (bx - ax) + ay * (by - ay));
    	let c = ax * ax + ay * ay - r * r;

    	// Applying Shri Dharacharya method by comparing the quadratic values a, b, c
    	let disc = b * b - 4 * a * c;

    	if (disc <= 0) {
    		return false;
    	}

    	let t1 = (-b + Math.sqrt(disc)) / (2 * a);
    	let t2 = (-b - Math.sqrt(disc)) / (2 * a);

    	if (0 < t1 && t1 < 1 || 0 < t2 && t2 < 1) {
    		return true;
    	}

    	return false;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DrawingPreview', slots, []);
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let { editorState } = $$props;
    	let bgImgPath = 'https://s3.amazonaws.com/jigyaasa_content_static/';
    	let xmlns = "http://www.w3.org/2000/svg";

    	// denotes that drawing is not sketching
    	let isDrawingPreview = false;

    	// allow to draw the drawing using compass
    	let isDrawCompassPreview = true;

    	// indicates that starting position should be store when perform using keyboard and compass
    	let isStoreStart = false;

    	// indicates that drawing is not started
    	let isDrawStop = 0;

    	// shows that is drawing started by keyboard
    	let startDrawingByKey = 0;

    	// used to creates an element wiloadth the specified namespace URI and qualified name
    	let scribble;

    	// denotes mouse co-ordinates
    	let preview_mouseX, preview_mouseY;

    	// scribble drawing tool is enable
    	let previewMode = 'scribble';

    	// strike color of drawing
    	let previewColor = '#00BCD4';

    	// stroke width of the drawing
    	let previewThickness = 5;

    	// contains object that have key type, index, mode, order and d
    	let previewScribblePath = [];

    	// shows number of drawing sketched with the help of drawing tools
    	let previewScribbleCount = 0;

    	// contains current mouse x position
    	let checkCurrentPositionX;

    	// contains current mouse y position
    	let checkCurrentPositionY;

    	// denoes no of undo done
    	let previewUndoCount = 0;

    	// contains undo data
    	let previewUndoList = [];

    	// contains redo data
    	let previewRedoList = [];

    	// contains the focusPoints
    	let accessibilityPointsPreview = [];

    	// number of focus point exist
    	let focusPointCountPreview = 1;

    	// used for not focus on perticular point
    	let lockFocus = 0;

    	// denotes that scribble drawing is not sketching
    	let isScribble = 0;

    	// for compass variable
    	// denotes x co-ordinate of the center
    	let cx;

    	// denotes y co-ordinate of the center
    	let cy;

    	// denotes x co-ordinate of the center of middle circle lies on rotationbar
    	let midCircle_cx;

    	// denotes y co-ordinate of the center of middle circle lies on rotationbar
    	let midCircle_cy;

    	// denotes x co-ordinate of the center of small middle circle lies on rotationbar
    	let midSmallCircle_cx;

    	// denotes y co-ordinate of the center of small middle circle lies on rotationbar
    	let midSmallCircle_cy;

    	// denotes x co-ordinate of the center of last circle lies on rotationbar
    	let lastCircle_cx;

    	// denotes y co-ordinate of the center of last circle lies on rotationbar
    	let lastCircle_cy;

    	// denotes x co-ordinate of the center of rotation indicator that can be seen after last circle on rotationbar
    	let lastSmallCircle_cx;

    	// denotes y co-ordinate of the center of rotation indicator that can be seen after last circle on rotationbar
    	let lastSmallCircle_cy;

    	// defines the compass radius
    	let previewCompassRadius = 100;

    	// denotes that compass is not moved
    	let isPreviewCompassMove = false;

    	// sets the default angle of compass
    	let previewCompassAngle = 90;

    	// denotes that compass radius not increased
    	let isPreviewRadiusIncrease = 0;

    	// denotes initial points co-ordinate
    	let initialPoint = { x: null, y: null };

    	// denotes final points co-ordinate
    	let finalPoint = { x: null, y: null };

    	// denotes no angle displaced
    	let compassAngleDisplacement = { start: null, end: null };

    	// denotes that is radius rotated
    	let isPreviewRadiusRotate = 0;

    	// y co-ordinate of the marked point
    	let cursorTop = 50;

    	// x co-ordinate of the marked point
    	let cursorLeft = 50;

    	// used for answer recording
    	let defaultXML = '';

    	let cdata = '';

    	// denotes that answer is incorrect
    	let isAnswerCorrect = false;

    	// for marking
    	let isMarking = 1;

    	// contains the co-ordinates of marked point
    	let markPoints = [];

    	// denotes array of drawing tools
    	let selectedToolsArray = ["_scribble", "_line", "_compass"];

    	// for user answer
    	let userAnsPath = [];

    	// initial layout of user answer xml
    	let userAnsXML = '<smans type="41"></smans>';

    	// contains the x and y co-ordinate of the points marked by user
    	let userMarkingPoint = [];

    	// contains drawing sketched by user by the help of drawing tools
    	let userDrawPath = [];

    	// denotes that answer is incorrect
    	let userAnsCorrect = false;

    	// contains the co-ordinates of marked point
    	let markPointsData = [];

    	// for browsers
    	let is_mac = false;

    	let prev_store = writable({
    		// contains status of the answer
    		correctAnswer: false,
    		// contains the xml of the props
    		xml: '',
    		uxml: '',
    		// not used any where
    		openImg: false,
    		// not used any where
    		openDrag: false,
    		// denotes background image
    		bgImg: 'useraccount_000ANv.png',
    		// not used any where 
    		cdata: '',
    		// contains cdata value of backgroundPoint of smxml 
    		focusDATA: '',
    		// not used any where 
    		userXML: '',
    		// stroke color of the drawing sketch by the help of drawing tools
    		lineColor: '#00BCD4',
    		// contains drawing tools array
    		selectedTools: selectedToolsArray,
    		// denotes remediation mode is off
    		remediationMode: 'off',
    		// width of the background image
    		imgWidth: "600",
    		// alt message of background image
    		alt: "Triangle image",
    		// sets color of the mark points
    		markPointColor: '#00ff00'
    	});

    	// subscribing the store in the state variable
    	let state = {};

    	const unsubscribe = prev_store.subscribe(value => {
    		$$invalidate(2, state = value);
    	});

    	// for adding all the necessary events and the css files
    	onMount(async () => {
    		$$invalidate(2, state.uxml = uxml, state);

    		// checked for mac device
    		is_mac = navigator.userAgent.indexOf("Mac") != -1;

    		// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    		updatePreviewCompassCalculation(160, 118, 100, 90);

    		AH.listen('body', 'click', '#set-review', function () {
    			setReview();
    		});

    		AH.listen('body', 'click', '#unset-review', function () {
    			unsetReview();
    		});

    		AH.listen('body', 'click', '#preview_reset_btn', function () {
    			swal({
    				text: l.reset_module,
    				icon: "warning",
    				buttons: true
    			}).then(value => {
    				if (value) {
    					// reset all the activity and makes it in initial condition as it looks like just after load
    					parseXMLForGettingData();

    					reinitializeFoucsEvent();
    				}
    			});
    		});

    		/** Start of key events **/
    		// to stop scrolling of page by space and arrow keys
    		AH.bind('body', 'keydown', function (event) {
    			if (!editorState && (event.keyCode == 32 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)) {
    				return false;
    			}
    		});

    		AH.listen('body', 'keyup', '.previewKeySvg .previewDrawingPaths path', function (current, event) {
    			if (event.keyCode == 46 || event.keyCode == 8 && is_mac) {
    				// removes drawing on which keyup event triggered and update the user answer xml
    				eraser(current, previewScribblePath);
    			}
    		});

    		AH.listen('body', 'keyup', '.previewKeySvg', function (current, event) {
    			if (event.keyCode == 90 && event.ctrlKey && !AH.select('#preview_undo').disabled) {
    				if (startDrawingByKey && isDrawStop) {
    					// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    					stopDraw();
    				}

    				// click the undo button
    				AH.select('#preview_undo').click();
    			}

    			if (event.keyCode == 89 && event.ctrlKey && !AH.select('#preview_redo').disabled) {
    				if (startDrawingByKey && isDrawStop) {
    					// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    					stopDraw();
    				}

    				// click the redo button
    				AH.select('#preview_redo').click();
    			}

    			if (event.keyCode == 88 && event.ctrlKey) {
    				// click the clear screen (x) button
    				AH.select('#preview_clearScreen').click();
    			}

    			if ((event.keyCode == 13 || event.keyCode == 32) && previewMode != 'compass' && previewMode != 'eraser') {
    				// hides the icon (+) used to sketch the drawing using keyboard
    				AH.select('#moveDrawIcon', 'removeClass', 'h');

    				// sets the cursor style to auto
    				AH.select('.previewKeySvg', 'css', { 'cursor': 'auto' });
    			}

    			if (event.shiftKey && (event.keyCode == 13 || event.keyCode == 32) && AH.select('#moveDrawIcon').offsetHeight != 0) {
    				if (previewMode == 'markPoints') {
    					// Creates an element with the specified namespace URI and qualified name.
    					scribble = document.createElementNS(xmlns, 'circle');

    					// sets the stroke color and width
    					setPreviewColor(state.markPointColor, previewThickness);

    					// adds a new attribute 'class' (with a namespace null)
    					scribble.setAttributeNS(null, 'class', 'answer_mark');

    					// adds a new attribute 'cx' (with a namespace null)
    					scribble.setAttributeNS(null, 'cx', cursorLeft);

    					// adds a new attribute 'cy' (with a namespace null)
    					scribble.setAttributeNS(null, 'cy', cursorTop);

    					// adds a new attribute 'r' (with a namespace null)
    					scribble.setAttributeNS(null, 'r', '2px');

    					// pushes the x and y co-ordinate of the mouse into markPoints array
    					markPoints.push({ x: cursorLeft, y: cursorTop });

    					// prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
    					AH.select('.previewMarkingPaths').prepend(scribble);

    					// checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
    					parseXMLForAnswer(false);

    					// updates user answer xml
    					createUXML();
    				} else {
    					if (isDrawStop) {
    						// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    						stopDraw();
    					} else {
    						startDrawingByKey = 1;

    						// removes the all mark points and sets the value of the variable 'isMArking' to 1
    						clearMarking();

    						// Creates an element with the value of variable xmlns namespace URI and 'path' name
    						scribble = document.createElementNS(xmlns, 'path');

    						// sets the stroke color and width
    						setPreviewColor(previewColor, previewThickness);

    						// adds a new attribute 'data-type' (with a namespace null)
    						scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);

    						// adds a new attribute 'data-order' (with a namespace null)
    						scribble.setAttributeNS(null, 'data-order', previewScribbleCount);

    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', 'M' + cursorLeft + ' ' + cursorTop);

    						// adds a new attribute 'tabindex' (with a namespace null)
    						scribble.setAttributeNS(null, 'tabindex', '0');

    						// contains the cursor left position
    						checkCurrentPositionX = cursorLeft;

    						// contains the cursor top position
    						checkCurrentPositionY = cursorTop;

    						// pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
    						previewScribblePath.push({
    							// define that perticular sequence element will be removed or added on drawing board
    							mode: 'add',
    							// defines what is the sequence of perticular drawing on drawing board means when it is drawn then how many drawing already done and it starts with 0
    							order: previewScribbleCount,
    							// defines which drawing tool is used for sketch the drawing with its sequence on drawing board combind with underscore (_)
    							type: previewMode + '_' + previewScribbleCount,
    							// not used as its requirement completed by order key
    							index: previewScribbleCount,
    							// specify the position from where drawing will start
    							d: 'M' + cursorLeft + ' ' + cursorTop
    						});

    						// indicates that drawing is sketched
    						isDrawStop = 1;
    					}
    				}
    			}
    		});

    		AH.listen('body', 'keydown', '.previewKeySvg', function (current, event) {
    			if (AH.select('#moveDrawIcon').offsetHeight) {
    				// contains width of the background image
    				let imageWidth = AH.select('#svgImgPreview').clientWidth;

    				// contains width of the background image 
    				let imageHeight = AH.select('#svgImgPreview').clientHeight;

    				if (event.shiftKey && (event.keyCode == 38 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 40) && !lockFocus) {
    					switch (event.keyCode) {
    						case 38:
    							// decreases the value of variable cursorTop by 1 after down the up arrow key
    							cursorTop--;
    							break;
    						case 40:
    							// increases the value of variable cursorTop by 1 after down the down arrow key
    							cursorTop++;
    							break;
    						case 39:
    							// increases the value of variable cursorLeft by 1 after down the right arrow key
    							cursorLeft++;
    							break;
    						case 37:
    							// decreases the value of variable cursorLeft by 1 after down the left arrow key
    							cursorLeft--;
    							break;
    					}

    					if (cursorTop < 0 || cursorLeft > imageWidth || cursorLeft < 0 || cursorTop > imageHeight) {
    						return;
    					}

    					// sets the top and left position of the icon (+) used for sketch the drawing
    					AH.select('#moveDrawIcon', 'css', {
    						"top": cursorTop + 'px',
    						"left": cursorLeft + 'px'
    					});

    					if (startDrawingByKey) {
    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop);

    						if (previewMode != 'line') {
    							// adds value of variables cursorLeft and cursorTop separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    							previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop;
    						}

    						// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    						AH.select('.previewDrawingPaths').prepend(scribble);

    						// sets the value of the variable isDrawStop by 1 to indicate that sketching of the drawing is stopped
    						isDrawStop = 1;
    					}
    				}

    				if (event.shiftKey && event.keyCode == 76) {
    					if (!lockFocus) {
    						// fixed the mark point from where drawing will be start when performed via keyboard
    						lockFocus = 1;

    						startDrawingByKey = 1;

    						// removes the all mark points and sets the value of the variable 'isMArking' to 1
    						clearMarking();

    						// contains the x co-ordinate of the mark point circle after converting it into number from string
    						cursorLeft = Number(AH.select('.currentFocusPoint').getAttribute('cx'));

    						// contains the y co-ordinate of the mark point circle after converting it into number from string
    						cursorTop = Number(AH.select('.currentFocusPoint').getAttribute('cy'));

    						// Creates an element with the value of variable xmlns namespace URI and 'path' name
    						scribble = document.createElementNS(xmlns, 'path');

    						// sets the stroke color and width
    						setPreviewColor(previewColor, previewThickness);

    						// adds a new attribute 'data-type' (with a namespace null)
    						scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);

    						// adds a new attribute 'data-order' (with a namespace null)
    						scribble.setAttributeNS(null, 'data-order', previewScribbleCount);

    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', 'M' + cursorLeft + ' ' + cursorTop);

    						// adds a new attribute 'tabindex' (with a namespace null)
    						scribble.setAttributeNS(null, 'tabindex', '0');

    						// assign the value of current x position
    						checkCurrentPositionX = cursorLeft;

    						// assign the value of current y position
    						checkCurrentPositionY = cursorTop;

    						// pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
    						previewScribblePath.push({
    							mode: 'add',
    							order: previewScribbleCount,
    							type: previewMode + '_' + previewScribbleCount,
    							index: previewScribbleCount,
    							d: 'M' + cursorLeft + ' ' + cursorTop
    						});
    					} else {
    						// unlock the focus point
    						lockFocus = 0;

    						// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    						stopDraw();
    					}
    				}

    				if (event.keyCode == 9 && lockFocus && (previewMode == 'line' || previewMode == 'scribble')) {
    					let drawLine = setTimeout(
    						function () {
    							if (!AH.select('.currentFocusPoint').nodeName) {
    								return;
    							}

    							// contains the x co-ordinate of the mark point circle after converting it into number from string
    							cursorLeft = Number(AH.select('.currentFocusPoint').getAttribute('cx'));

    							// contains the y co-ordinate of the mark point circle after converting it into number from string
    							cursorTop = Number(AH.select('.currentFocusPoint').getAttribute('cy'));

    							if (isNaN(cursorLeft) && isNaN(cursorTop)) {
    								return;
    							}

    							if (previewMode == 'scribble' || previewMode == 'line') {
    								// indicates that scribble drawing is sketching
    								isScribble = 1;
    							}

    							// adds a new attribute 'd' (with a namespace null)
    							scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop);

    							// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    							AH.select('.previewDrawingPaths').prepend(scribble);

    							clearTimeout(drawLine);
    						},
    						10
    					);
    				}

    				if (event.keyCode == 68 && lockFocus && isScribble) {
    					let draw_scribble = setTimeout(
    						function () {
    							if (isNaN(cursorLeft) && isNaN(cursorTop)) {
    								return;
    							}

    							// adds value of variables cursorLeft and cursorTop separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    							previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop;

    							// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    							AH.select('.previewDrawingPaths').prepend(scribble);

    							clearTimeout(draw_scribble);

    							// indicates that scribble drawing is not sketching
    							isScribble = 0;
    						},
    						10
    					);
    				}
    			}
    		});

    		AH.listen('body', 'keydown', '.previewKeySvg .drawingCompassCenter', function (current, event) {
    			// change the center position of the compass element
    			compassKeyEvent('move', event);
    		});

    		AH.listen('body', 'keydown', '.previewKeySvg .mid_circle', function (current, event) {
    			// change the radius of the compass element
    			compassKeyEvent('radius', event);
    		});

    		AH.listen('body', 'keydown', '.previewKeySvg .midSmallCircle', function (current, event) {
    			// change the angle of the compass element when focus is on small middle circle
    			compassKeyEvent('rotate', event);
    		});

    		AH.listen('body', 'keydown', '.previewKeySvg .lastCircle', function (current, event) {
    			// change the angle of the compass element when focus is on last circle
    			compassKeyEvent('draw', event);
    		});

    		AH.listen('body', 'keydown', '.focusPoints', function (current, event) {
    			if (event.shiftKey && event.keyCode == 13) {
    				return false;
    			}

    			if ((event.keyCode == 13 || event.keyCode == 32) && previewMode != 'markPoints' && previewMode != 'eraser') {
    				// contains the x co-ordinate of the mark point circle after converting it into number from string
    				cursorLeft = Number(AH.select('.currentFocusPoint').getAttribute('cx'));

    				// contains the y co-ordinate of the mark point circle after converting it into number from string
    				cursorTop = Number(AH.select('.currentFocusPoint').getAttribute('cy'));

    				if (previewMode != 'compass') {
    					// sets the position of the icon (+) used to sketch the drawing by the help of keyboard
    					AH.select('#moveDrawIcon', 'css', {
    						"top": cursorTop + 'px',
    						"left": cursorLeft + 'px'
    					});
    				} else {
    					// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    					updatePreviewCompassCalculation(cursorLeft, cursorTop, previewCompassRadius, previewCompassAngle);
    				}
    			}
    		});

    		AH.listen('body', 'keyup', '.previewKeySvg .lastCircle', function (current, event) {
    			if (!isDrawCompassPreview && isStoreStart && event.keyCode == 16) {
    				// stores the drawing sketched by user using keyboard and sets the user answer xml
    				storeCompassPathByKey();
    			}
    		});

    		/** End of key events **/
    		AH.bind('.previewKeySvg .lastCircle', 'blur', function () {
    			if (!isDrawCompassPreview && isStoreStart) {
    				// stores the drawing sketched by user using keyboard and sets the user answer xml
    				storeCompassPathByKey();
    			}
    		});

    		AH.listen('body', 'mousedown', '#previewSvg .midSmallCircle', function () {
    			if (previewMode == "compass") {
    				// indicates that radius rotated
    				isPreviewRadiusRotate = 1;

    				// updates the value of compass radius and angle
    				checkPreviewRadiusAndAngle();

    				// contains the value of start angle
    				compassAngleDisplacement.start = previewCompassAngle;
    			}
    		});

    		AH.listen('body', 'mousedown', '#previewSvg .drawingCompassCenter', function () {
    			if (previewMode == "compass") {
    				// sets the x and y co-ordinate of the mouse position
    				setPreviewMouseCoordinates(event);

    				// contains x co-ordinate of the mouse
    				cx = preview_mouseX;

    				// contains y co-ordinate of the mouse
    				cy = preview_mouseY;

    				// contains radius of the compass
    				$$invalidate(0, previewCompassRadius = AH.select('.drawingCompassRoute').getAttribute('r'));

    				// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    				updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle);

    				// indicates that compass is moved
    				isPreviewCompassMove = true;
    			}
    		});

    		AH.listen('body', 'mousedown', '#previewSvg .mid_circle', function () {
    			if (previewMode == "compass") {
    				// allows to change the value of radius of the compass
    				isPreviewRadiusIncrease = 1;
    			}
    		});

    		AH.listen('body', 'mousedown', '#previewSvg .lastCircle', function (current, event) {
    			compassLastcircleEvent(event);
    		});

    		AH.listen('body', 'keydown', '#previewSvg .lastCircle', function (current, event) {
    			compassLastcircleEvent(event);
    		});

    		// Mouse down event
    		AH.listen('body', 'mousedown', '#previewSvg', function (current, event) {
    			// sets the cursor style as crosshair (+)
    			AH.select('#previewSvg', 'css', { 'cursor': 'crosshair' });

    			// hides the icon used to sketch the drawing by the help of keyboard
    			AH.select('#moveDrawIcon', 'addClass', 'h');

    			if (startDrawingByKey && isDrawStop || lockFocus) {
    				// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    				stopDraw();
    			}

    			switch (previewMode) {
    				case 'line':
    				case 'scribble':
    					// removes the all mark points and sets the value of the variable 'isMArking' to 1
    					clearMarking();
    					// denotes that drawing is on going
    					isDrawingPreview = true;
    					// sets the x and y co-ordinate of the mouse position
    					setPreviewMouseCoordinates(event);
    					// Creates an element with the value of variable xmlns namespace URI and 'path' name
    					scribble = document.createElementNS(xmlns, 'path');
    					// sets the stroke color and width
    					setPreviewColor(previewColor, previewThickness);
    					// adds a new attribute 'data-type' (with a namespace null)
    					scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);
    					// adds a new attribute 'data-order' (with a namespace null)
    					scribble.setAttributeNS(null, 'data-order', previewScribbleCount);
    					// adds a new attribute 'd' (with a namespace null)
    					scribble.setAttributeNS(null, 'd', 'M' + preview_mouseX + ' ' + preview_mouseY);
    					// adds a new attribute 'tabindex' (with a namespace null)
    					scribble.setAttributeNS(null, 'tabindex', '0');
    					// contains the x co-ordinate of the mouse
    					checkCurrentPositionX = preview_mouseX;
    					// contains the y co-ordinate of the mouse
    					checkCurrentPositionY = preview_mouseY;
    					// pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
    					previewScribblePath.push({
    						mode: 'add',
    						order: previewScribbleCount,
    						type: previewMode + '_' + previewScribbleCount,
    						index: previewScribbleCount,
    						d: 'M' + preview_mouseX + ' ' + preview_mouseY
    					});
    					break;
    				case 'eraser':
    					// removes drawing on which keyup event triggered and update the user answer xml
    					eraser('.currentSvg', previewScribblePath);
    					break;
    				case 'markPoints':
    					if (!isMarking) {
    						// sets the x and y co-ordinate of the mouse position
    						setPreviewMouseCoordinates(event);

    						// Creates an element with the specified namespace URI and qualified name.
    						scribble = document.createElementNS(xmlns, 'circle');

    						// sets the stroke color and width
    						setPreviewColor(state.markPointColor, previewThickness);

    						// adds a new attribute 'class' (with a namespace null)
    						scribble.setAttributeNS(null, 'class', 'answer_mark');

    						// adds a new attribute 'cx' (with a namespace null)
    						scribble.setAttributeNS(null, 'cx', preview_mouseX);

    						// adds a new attribute 'cy' (with a namespace null)
    						scribble.setAttributeNS(null, 'cy', preview_mouseY);

    						// adds a new attribute 'r' (with a namespace null)
    						scribble.setAttributeNS(null, 'r', '2px');

    						// pushes the x and y co-ordinate of mouse into markPoints array
    						markPoints.push({ x: preview_mouseX, y: preview_mouseY });

    						// prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
    						AH.select('.previewMarkingPaths').prepend(scribble);

    						// checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
    						parseXMLForAnswer(false);

    						// updates user answer xml
    						createUXML();
    					}
    					break;
    			}
    		});

    		// Mouse Move event
    		AH.listen('body', 'mousemove', '#previewSvg', function (current, event) {
    			switch (previewMode) {
    				case 'line':
    					if (isDrawingPreview) {
    						// sets the x and y co-ordinate of the mouse position
    						setPreviewMouseCoordinates(event);

    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY);

    						if (!(checkCurrentPositionX == preview_mouseX && checkCurrentPositionY == preview_mouseY)) {
    							// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    							AH.select('.previewDrawingPaths').prepend(scribble);
    						}
    					}
    					break;
    				case 'scribble':
    					if (isDrawingPreview) {
    						// sets the x and y co-ordinate of the mouse position
    						setPreviewMouseCoordinates(event);

    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY);

    						// adds value of variables preview_mouseX and preview_mouseY separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    						previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY;

    						if (!(previewScribblePath[previewScribbleCount].d.split('L').length - 1 < 3)) {
    							// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    							AH.select('.previewDrawingPaths').prepend(scribble);
    						}
    					}
    					break;
    				case 'compass':
    					// sets the x and y co-ordinate of the mouse position
    					setPreviewMouseCoordinates(event);
    					if (isPreviewCompassMove) {
    						// contains the x co-ordinate of the mouse 
    						cx = preview_mouseX;

    						// contains the y co-ordinate of the mouse 
    						cy = preview_mouseY;

    						// contains radius of the compass
    						$$invalidate(0, previewCompassRadius = AH.select('.drawingCompassRoute').getAttribute('r'));

    						// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    						updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle);
    					}
    					if (isPreviewRadiusIncrease) {
    						// updates the value of compass radius and angle
    						checkPreviewRadiusAndAngle();

    						// calculates the radius by the help of start and end points co-ordinate of the rotation bar
    						$$invalidate(0, previewCompassRadius = 2 * Math.sqrt(Math.pow(preview_mouseX - initialPoint.x, 2) + Math.pow(preview_mouseY - initialPoint.y, 2)));

    						if (previewCompassRadius < 80) {
    							// sets the value 80 of the variable previewCompassRadius
    							$$invalidate(0, previewCompassRadius = 80);
    						}

    						if (previewCompassRadius > 360) {
    							// sets the value 360 of the variable previewCompassRadius
    							$$invalidate(0, previewCompassRadius = 360);
    						}

    						// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    						updatePreviewCompassCalculation(initialPoint.x, initialPoint.y, previewCompassRadius, previewCompassAngle);
    					}
    					if (isPreviewRadiusRotate) {
    						// updates the value of compass radius and angle
    						checkPreviewRadiusAndAngle();

    						// calculates the angle by the help of start and end points co-ordinate of the rotation bar
    						$$invalidate(1, previewCompassAngle = Math.atan2(preview_mouseY - initialPoint.y, preview_mouseX - initialPoint.x) * 180 / Math.PI);

    						if (previewCompassAngle < 0) {
    							// adds 360 into the value of the variable previewCompassAngle
    							$$invalidate(1, previewCompassAngle = 360 + previewCompassAngle);
    						}

    						// contains the value of end angle
    						compassAngleDisplacement.end = previewCompassAngle;

    						// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    						updatePreviewCompassCalculation(initialPoint.x, initialPoint.y, previewCompassRadius, previewCompassAngle);
    					}
    					if (isDrawingPreview) {
    						if (!(AH.select('#previewSvg .lastCircle').classList.contains('lastCircle_hover') || AH.select('#previewSvg .lastbigcircle').classList.contains('lastCircle_hover'))) {
    							// trigger the event mouseleave on the element have id previewSvg
    							previewMouseLeave(event);
    						} else {
    							// adds a new attribute 'd' (with a namespace null)
    							scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);

    							// adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    							previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;

    							if (!(previewScribblePath[previewScribbleCount].d.split('L').length - 1 < 4)) {
    								// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    								AH.select('.previewDrawingPaths').prepend(scribble);
    							}
    						}
    					}
    					break;
    			}
    		});

    		// Mouse Up Event
    		AH.listen('body', 'mouseup', '#previewSvg', function (current, event) {
    			previewMouseLeave(event);
    		});

    		// Mouse leave Event
    		AH.bind('#previewSvg', 'mouseleave', function (event) {
    			previewMouseLeave(event);
    		});

    		// For toolbar
    		AH.listen('body', 'click', '.preview_toolbar', function (current, event) {
    			toolbarAction(current, event);
    		});

    		AH.listen('body', 'keyup', '.preview_toolbar', function (current, event) {
    			toolbarAction(current, event);
    		});

    		AH.listen('body', 'mouseover', '.previewDrawingPaths path', function (current) {
    			if (previewMode == 'eraser') {
    				// removes the class currentSvg from the element 'path' inside the element have class 'previewDrawingPaths'
    				AH.selectAll('.previewDrawingPaths path', 'removeClass', 'currentSvg');

    				// adds the class 'currentSvg' to the element 'path' inside the element have class 'previewDrawingPaths' on which mouseover
    				current.classList.add('currentSvg');
    			}
    		});

    		AH.listen('body', 'mouseout', '.previewDrawingPaths path', function (current) {
    			if (previewMode == 'eraser') {
    				// removes the class 'currentSvg' to the element 'path' inside the element have class 'previewDrawingPaths' on which mouseout
    				current.classList.remove('currentSvg');
    			}
    		});

    		// last circle events
    		AH.listen('body', 'mousemove', '#previewSvg .lastCircle', function (current) {
    			// adds the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
    			current.classList.add("lastCircle_hover");

    			// shows the rotational indicator
    			AH.selectAll('#previewSvg .lastCircleMid', 'attr', { 'opacity': 1 });
    		});

    		AH.listen('body', 'mouseout', '#previewSvg .lastCircle', function (current) {
    			// removes the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
    			current.classList.remove("lastCircle_hover");

    			// hides the rotational indicator
    			AH.selectAll('#previewSvg .lastCircleMid', 'attr', { 'opacity': 0 });
    		});

    		AH.listenAll('#previewSvg .lastCircle', 'focus', function (current) {
    			// adds the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
    			current.target.classList.add("lastCircle_hover");

    			// shows the rotational indicator
    			AH.selectAll('#previewSvg .lastCircleMid', 'attr', { 'opacity': 1 });
    		});

    		AH.listenAll('#previewSvg .lastCircle', 'blur', function (current) {
    			// removes the class 'lastCircle_hover' to the last circle on compass rotation bar lies on route of the compass
    			current.target.classList.remove("lastCircle_hover");

    			// hides the rotational indicator
    			AH.selectAll('#previewSvg .lastCircleMid', 'attr', { 'opacity': 0 });
    		});

    		// for changing the active buttons
    		AH.listen('body', 'click', '.preview_btn', function (current) {
    			// removes the class active from drawing tools, delete and  'Mark Points' buttons
    			AH.selectAll('.preview_btn, #mark_points', 'removeClass', 'active');

    			// adds the class active which is clicked
    			current.classList.add('active');
    		});

    		// for clearing the screen
    		AH.listen('body', 'click', '#preview_clearScreen', function () {
    			// makes drawing container empty in which drawing is done by using drawing tools
    			AH.selectAll('.previewDrawingPaths path', 'remove');

    			// sets the value of variable 'previewUndoCount' to  0
    			previewUndoCount = 0;

    			// sets the value of variable 'previewScribbleCount' to  0
    			previewScribbleCount = 0;

    			// makes array 'previewScribblePath' empty to denote that no drawing is sketched
    			previewScribblePath = [];

    			// contains copy of array previewScribblePath
    			let tempArrayContainer = arrayCopy(previewScribblePath);

    			// stores the drawing sketched by user and sets the user answer xml
    			storeUserPaths(tempArrayContainer);

    			// disabled the undo, redo, cross (x) buttons
    			AH.select('#preview_undo').disabled = true;

    			AH.select('#preview_redo').disabled = true;
    			AH.select('#preview_clearScreen').disabled = true;
    		});

    		// for undo
    		AH.listen('body', 'click', '#preview_undo', function (current) {
    			if (previewUndoCount == 1) {
    				// disabled the undo button
    				current.disabled = true;
    			}

    			// enabled the redo button
    			AH.select('#preview_redo').disabled = false;

    			if (previewScribblePath[previewScribblePath.length - 1].mode == 'add') {
    				// removes the element that have data-order attribute and value of this attribute is equals to subtacting 1 from the value of length of the array previewScribblePath, means removes the last drawing sketched by the help of drawing tools
    				AH.selectAll('#previewSvg [data-order="' + (previewScribblePath.length - 1) + '"]', 'remove');
    			} else if (previewScribblePath[previewScribblePath.length - 1].mode == 'remove') {
    				// Creates an element with the value of variable xmlns namespace URI and 'path' name
    				scribble = document.createElementNS(xmlns, 'path');

    				// sets the stroke color and width
    				setPreviewColor(previewColor, previewThickness);

    				// adds a new attribute 'data-type' (with a namespace null)
    				scribble.setAttributeNS(null, 'data-type', previewScribblePath[previewScribblePath.length - 1].type);

    				// adds a new attribute 'data-order' (with a namespace null)
    				scribble.setAttributeNS(null, 'data-order', previewScribblePath[previewScribblePath.length - 1].order);

    				// adds a new attribute 'd' (with a namespace null)
    				scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribblePath.length - 1].d);

    				// adds a new attribute 'tabindex' (with a namespace null)
    				scribble.setAttributeNS(null, 'tabindex', '0');

    				if (previewMode == 'eraser') {
    					// adds a new attribute 'class' (with a namespace null)
    					scribble.setAttributeNS(null, 'class', 'eraserHover');
    				}

    				// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    				AH.select('.previewDrawingPaths').prepend(scribble);
    			}

    			// pushes the last data of array previewScribblePath into array previewUndoList
    			previewUndoList.push(previewScribblePath.pop());

    			// contains copy of array previewScribblePath
    			let tempArrayContainer = arrayCopy(previewScribblePath);

    			// stores the drawing sketched by user and sets the user answer xml
    			storeUserPaths(tempArrayContainer);

    			// decreases the value of the variable previewScribbleCount by 1
    			previewScribbleCount--;

    			// decreases the value of the variable previewUndoCount by 1
    			previewUndoCount--;

    			AH.select('#preview_clearScreen').disabled = AH.selectAll('.previewDrawingPaths path').length == 0;

    			if (previewScribblePath.length == 0) {
    				// disabled the undo button
    				current.disabled = true;
    			}
    		});

    		// for redo
    		AH.listen('body', 'click', '#preview_redo', function (current) {
    			// increases the value of the variable previewScribbleCount by 1
    			previewScribbleCount++;

    			if (previewUndoList.length > 0) {
    				// pushes the last data of array previewUndoList into array previewRedoList
    				previewRedoList.push(previewUndoList.pop());
    			}

    			if (previewRedoList[previewRedoList.length - 1].mode == 'add') {
    				// Creates an element with the value of variable xmlns namespace URI and 'path' name
    				scribble = document.createElementNS(xmlns, 'path');

    				// sets the stroke color and width
    				setPreviewColor(previewColor, previewThickness);

    				// adds a new attribute 'data-type' (with a namespace null)
    				scribble.setAttributeNS(null, 'data-type', previewRedoList[previewRedoList.length - 1].type);

    				// adds a new attribute 'data-order' (with a namespace null)
    				scribble.setAttributeNS(null, 'data-order', previewRedoList[previewRedoList.length - 1].order);

    				// adds a new attribute 'd' (with a namespace null)
    				scribble.setAttributeNS(null, 'd', previewRedoList[previewRedoList.length - 1].d);

    				// adds a new attribute 'tabindex' (with a namespace null)
    				scribble.setAttributeNS(null, 'tabindex', '0');

    				if (previewMode == 'eraser') {
    					// adds a new attribute 'class' (with a namespace null)
    					scribble.setAttributeNS(null, 'class', 'eraserHover');
    				}

    				// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    				AH.select('.previewDrawingPaths').prepend(scribble);
    			} else if (previewRedoList[previewRedoList.length - 1].mode == 'remove') {
    				// removes the element that have data-order attribute and value of this attribute is equals to the value of order key of the last index value of array previewRedoList, means removes the last drawing stored in array previewRedoList
    				AH.selectAll('#previewSvg [data-order="' + previewRedoList[previewRedoList.length - 1].order + '"]', 'remove');
    			}

    			// increases the value of the variable previewUndoCount by 1
    			previewUndoCount++;

    			// pushes the last data of array previewRedoList into array previewScribblePath
    			previewScribblePath.push(previewRedoList.pop());

    			// contains copy of array previewScribblePath
    			let tempArrayContainer = arrayCopy(previewScribblePath);

    			// stores the drawing sketched by user and sets the user answer xml
    			storeUserPaths(tempArrayContainer);

    			AH.select('#preview_clearScreen').disabled = AH.selectAll('.previewDrawingPaths path').length == 0;

    			if (previewUndoList.length == 0) {
    				// disabled the redo button
    				current.disabled = true;
    			}

    			// enabled the undo button
    			AH.select('#preview_undo').disabled = false;
    		});

    		AH.listen('body', 'click', '#mark_points', function (current, event) {
    			markPointEvent(event);
    		});

    		AH.listen('body', 'keyup', '#mark_points', function (current, event) {
    			markPointEvent(event);
    		});
    	});

    	// call the function after update in the store/state
    	afterUpdate(async () => {
    		// for changing the xml and loading the module according to the xml
    		if (state.xml != xml) {
    			parseXMLForGettingData();
    			$$invalidate(2, state.xml = xml, state);
    			reinitializeFoucsEvent();
    			checkUserAns();
    		}

    		// for calling the setreview and unsetreview function on change of review mode
    		if (state.review != isReview && editorState) {
    			prev_store.update(item => {
    				item.review = isReview;
    				return item;
    			});

    			if (isReview) {
    				setReview();
    			} else {
    				unsetReview();
    			}
    		}
    	});

    	// function responsible for the compass lastcircle keyevent
    	function compassLastcircleEvent(event) {
    		if (isScribble) {
    			stopDraw();
    		}

    		if (event.shiftKey) {
    			if (!isDrawCompassPreview) return;

    			// sets the value  false of the variable isDrawCompassPreview
    			isDrawCompassPreview = false;

    			// sets the value true of the variable isStoreStart to store the starting position
    			isStoreStart = true;

    			// adds class lastCircle_hover to the last circle on the rotation bar
    			AH.selectAll('#previewSvg .lastCircle', 'addClass', 'lastCircle_hover');
    		}

    		if (previewMode == "compass" && event.type == "mousedown" || event.shiftKey) {
    			// removes the all mark points and sets the value of the variable 'isMArking' to 1
    			clearMarking();

    			// sets the cursor style to grabbing when mouse reached inside last circle on the rotation bar
    			AH.selectAll('#previewSvg .lastCircle', 'css', { 'cursor': 'grabbing' });

    			if (isDrawCompassPreview || event.type == "mousedown") {
    				// indicates that drawing is sketching
    				isDrawingPreview = true;

    				// indicates that radius is rotating
    				isPreviewRadiusRotate = 1;
    			}

    			// updates the value of compass radius and angle
    			checkPreviewRadiusAndAngle();

    			// contains the value of start angle
    			compassAngleDisplacement.start = previewCompassAngle;

    			// Creates an element with the value of variable xmlns namespace URI and 'path' name
    			scribble = document.createElementNS(xmlns, 'path');

    			// sets the stroke color and width
    			setPreviewColor(previewColor, previewThickness);

    			// adds a new attribute 'data-type' (with a namespace null)
    			scribble.setAttributeNS(null, 'data-type', previewMode + '_' + previewScribbleCount);

    			// adds a new attribute 'data-order' (with a namespace null)
    			scribble.setAttributeNS(null, 'data-order', previewScribbleCount);

    			// adds a new attribute 'd' (with a namespace null)
    			scribble.setAttributeNS(null, 'd', 'M' + lastCircle_cx + ' ' + lastCircle_cy);

    			// adds a new attribute 'tabindex' (with a namespace null)
    			scribble.setAttributeNS(null, 'tabindex', '0');

    			// contains current x position
    			checkCurrentPositionX = lastCircle_cx;

    			// contains current y position
    			checkCurrentPositionY = lastCircle_cy;

    			// pushes object having keys mode, order, type, index and d with their values into  array previewScribblePath
    			previewScribblePath.push({
    				mode: 'add',
    				order: previewScribbleCount,
    				type: previewMode + '_' + previewScribbleCount,
    				index: previewScribbleCount,
    				d: 'M' + lastCircle_cx + ' ' + lastCircle_cy
    			});
    		}
    	}

    	// for adding the focus and blur event
    	function reinitializeFoucsEvent() {
    		AH.listenAll('.focusPoints', 'focus', function (event) {
    			// removes the class currentFocusPoint from the elements have class focusPoints
    			AH.selectAll('.focusPoints', 'removeClass', 'currentFocusPoint');

    			// adds the class currentFocusPoint to the element which got the focus and have class focusPoints 
    			event.target.classList.add('currentFocusPoint');
    		});

    		AH.listenAll('.focusPoints', 'blur', function () {
    			// removes the class currentFocusPoint from the elements have class focusPoints
    			AH.selectAll('.focusPoints', 'removeClass', 'currentFocusPoint');
    		});
    	}

    	// for adding the mark point from the key event
    	function markPointEvent(event) {
    		if (event.screenX == undefined) {
    			return;
    		}

    		if (startDrawingByKey && isDrawStop) {
    			// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    			stopDraw();
    		}

    		if (event.keyCode == 13 || event.keyCode == 32 || event.screenX === 0) {
    			// stops the events from being bubbled
    			event.preventDefault();

    			// joins the marked points by the help of line that starts with first mark point and ends at last masked point by moving in sequencial order
    			markFinalPoints();

    			if (isMarking) {
    				// hides plus icon (+) that is used for sketch the graph via keyboard
    				AH.select('#moveDrawIcon', 'addClass', 'h');

    				// sets the cursor style to crosshair (+)
    				AH.select('#previewSvg', 'css', { 'cursor': 'crosshair' });
    			} else {
    				// shows plus icon (+) that is used for sketch the graph via keyboard
    				AH.select('#moveDrawIcon', 'removeClass', 'h');

    				// sets the cursor style to auto
    				AH.select('#previewSvg', 'css', { 'cursor': 'auto' });
    			}
    		} else if (event.type == 'click' && event.screenX !== 0) {
    			// joins the marked points by the help of line that starts with first mark point and ends at last masked point by moving in sequencial order
    			markFinalPoints();
    		}
    	}

    	// this function calls whenever there is click on toolbar buttons
    	function toolbarAction(current, event) {
    		if (isScribble) {
    			stopDraw();
    		}

    		if (event.type == 'click' || (event.keyCode == 13 || event.keyCode == 32)) {
    			// assign the value of the data-title attribute of the drawing tool buttons or of delete button on which is clicked or on which keyuped
    			previewMode = current.getAttribute('data-title');

    			// sets the style of the cursor to crosshair (+)
    			AH.select('#previewSvg', 'css', { 'cursor': 'crosshair' });

    			// hides the icon (+) that is used for sketch the drawing by the help of keyboard
    			AH.select('#moveDrawIcon', 'addClass', 'h');

    			// sets the value 0 of variable startDrawingByKey to indicate that drawing is not started by the keyboard
    			startDrawingByKey = 0;

    			// sets the value of the variable isDrawStop by 0 to indicate that sketching of the drawing either not started or in progress
    			isDrawStop = 0;

    			if (previewMode == 'eraser') {
    				// adds the class eraserHover to the element path that contains the drawing sketched by the help of drawing tools
    				AH.selectAll('.previewDrawingPaths path', 'addClass', 'eraserHover');
    			} else {
    				// removes the class eraserHover to the element path that contains the drawing sketched by the help of drawing tools
    				AH.selectAll('.previewDrawingPaths path', 'removeClass', 'eraserHover');
    			}

    			// hides the compass element
    			AH.selectAll('.drawingCompassSvg', 'addClass', 'h');

    			if (previewMode == 'compass') {
    				// shows the compass tool
    				AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
    			}

    			// removes the all mark points and sets the value of the variable 'isMArking' to 1
    			clearMarking();
    		}

    		if ((event.keyCode == 13 || event.keyCode == 32) && previewMode != 'eraser' && previewMode != 'compass') {
    			// hides the icon (+), which is used to sketch the drawing using keyboard
    			AH.select('#moveDrawIcon', 'removeClass', 'h');

    			// sets the cursor style auto
    			AH.select('#previewSvg', 'css', { 'cursor': 'auto' });
    		}

    		if (startDrawingByKey && isDrawStop) {
    			// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    			stopDraw();
    		}
    	}

    	// this function calls when we are leaving the drawable area or on mouseup
    	function previewMouseLeave(event) {
    		switch (previewMode) {
    			case 'line':
    			case 'scribble':
    				if (isDrawingPreview) {
    					// sets the x and y co-ordinate of the mouse position
    					setPreviewMouseCoordinates(event);

    					if (lockFocus && (checkCurrentPositionX == preview_mouseX && checkCurrentPositionY == preview_mouseY && previewMode == 'line' || previewMode == 'scribble' && previewScribblePath[previewScribbleCount].d.split('L').length - 1 < 3)) {
    						// removes the last element from the array previewScribblePath
    						previewScribblePath.pop();
    					}

    					if (checkCurrentPositionX == preview_mouseX && checkCurrentPositionY == preview_mouseY && previewMode == 'line' || previewMode == 'scribble' && previewScribblePath[previewScribbleCount].d.split('L').length - 1 < 3) {
    						// removes the last element from the array previewScribblePath
    						previewScribblePath.pop();
    					} else {
    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY);

    						// adds value of variables preview_mouseX and preview_mouseY separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    						previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + preview_mouseX + ' ' + preview_mouseY;

    						// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    						AH.select('.previewDrawingPaths').prepend(scribble);

    						// increases the value of the variable previewScribbleCount by 1 
    						previewScribbleCount++;

    						// increases the value of the variable previewUndoCount by 1 
    						previewUndoCount++;

    						// makes array previewUndoList blank
    						previewUndoList = [];

    						// enabled clear screen and undo button
    						AH.select('#preview_clearScreen').disabled = false;

    						AH.select('#preview_undo').disabled = false;

    						// disabled redo button
    						AH.select('#preview_redo').disabled = true;
    					}
    				}
    				// sets the value false of the variable isDrawingPreview 
    				isDrawingPreview = false;
    				break;
    			case 'compass':
    				// indicates that radius is not increased
    				isPreviewRadiusIncrease = 0;
    				// indicates that radius is not rotated
    				isPreviewRadiusRotate = 0;
    				if (isPreviewCompassMove) {
    					// sets the x and y co-ordinate of the mouse position
    					setPreviewMouseCoordinates(event);

    					// contains the x co-ordinate of the mouse position
    					cx = preview_mouseX;

    					// contains the y co-ordinate of the mouse position
    					cy = preview_mouseY;

    					// contains radius of the compass
    					$$invalidate(0, previewCompassRadius = AH.select('.drawingCompassRoute').getAttribute('r'));

    					// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    					updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle);

    					// indicates that compass is not moved
    					isPreviewCompassMove = false;
    				}
    				if (isDrawingPreview) {
    					if (previewScribblePath[previewScribbleCount].d.split('L').length - 1 < 4) {
    						// removes the last element from the array previewScribblePath
    						previewScribblePath.pop();
    					} else {
    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);

    						// adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    						previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;

    						// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    						AH.select('.previewDrawingPaths').prepend(scribble);

    						// increases the value of the variable previewScribbleCount by 1
    						previewScribbleCount++;

    						// increases the value of the variable previewUndoCount by 1
    						previewUndoCount++;

    						// makes array previewUndoList blank
    						previewUndoList = [];

    						// enabled clear screen (x) and undo button
    						AH.select('#preview_clearScreen').disabled = false;

    						AH.select('#preview_undo').disabled = false;

    						// disabled the redo button
    						AH.select('#preview_redo').disabled = true;
    					}

    					// sets value false of variable isDrawingPreview
    					isDrawingPreview = false;
    				}
    				// sets the cursor style to grab when it lies on last circle on the rotation bar
    				AH.selectAll('#previewSvg .lastCircle', 'css', { 'cursor': 'grab' });
    				break;
    		}

    		// contains copy of array previewScribblePath
    		let tempArrayContainer = arrayCopy(previewScribblePath);

    		// stores the drawing sketched by user and sets the user answer xml
    		storeUserPaths(tempArrayContainer);
    	}

    	// checks the answer and shows the status of the answer
    	function setReview() {
    		$$invalidate(5, isReview = true);

    		if (startDrawingByKey && isDrawStop || lockFocus) {
    			// stop the drawing and store the drawing sketched by the user and sets the user answer xml
    			stopDraw();
    		}

    		if (!isDrawCompassPreview && isStoreStart) {
    			// stores the drawing sketched by user using keyboard and sets the user answer xml
    			storeCompassPathByKey();
    		}

    		// checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
    		parseXMLForAnswer(true);

    		// contains the value of state array selectedTools at index 0 after removing the first character 
    		previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));

    		// removes the class active from drawing tools, delete, and 'Mark Points' or 'Finish Marking' buttons
    		AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');

    		// adds the class active to the drawing tool button which exist at index 0 in state array selectedTools
    		AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');

    		if (previewMode == 'compass') {
    			// shows the compass tool
    			AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
    		} else {
    			// hides the compass tool
    			AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
    		}

    		$$invalidate(2, state.remediationMode = 'on', state);
    		AH.selectAll('.previewBtnGrp', 'addClass', 'h');

    		// sets the value 'none' of the variable previewMode
    		previewMode = 'none';

    		// not allowed user to perform the task
    		AH.selectAll('.preview_drawing_container', 'css', { pointerEvents: "none" });

    		// removes the class previewKeySvg from the svg element have id previewSvg
    		AH.select('#previewSvg', 'removeClass', 'previewKeySvg');

    		// removes the marked points and also the path that is sketched by the help of mark points
    		AH.selectAll('.previewMarkingPaths .answer_mark', 'remove');

    		// updates user answer xml
    		createUXML();

    		// draw the marked points and the lines connecting to these points
    		addMarkPointOnLoad(JSON.parse(markPointsData));

    		// sets the tabindex and aria-label to the elements have class 'answer_mark' and tag name is path
    		AH.selectAll('path.answer_mark', 'attr', {
    			'tabindex': '0',
    			'aria-labelledby': 'answerLine'
    		});

    		if (state.correctAnswer) {
    			// append the title element inside the element previewMarkingPaths with correct message
    			AH.insert('.previewMarkingPaths', '<title id="answerLine">' + l.ans_correct + '</title>', 'beforeend');

    			// sets the stroke color of the mark points to #0F9D58
    			AH.selectAll('.answer_mark', 'css', { 'stroke': '#0F9D58' });
    		} else {
    			// append the title element inside the element previewMarkingPaths with incorrect message
    			AH.insert('.previewMarkingPaths', '<title id="answerLine">' + l.ans_incorrect + '</title>', 'beforeend');

    			// sets the stroke color of the mark points to red
    			AH.selectAll('.answer_mark', 'css', { 'stroke': '#FF0000' });

    			// sets the stroke color of the answer point to #0F9D58
    			AH.selectAll('.answer_circle', 'css', { 'stroke': '#0F9D58' });
    		}
    	}

    	// allowed user to perform the task and changes the stroke color of mark points 
    	function unsetReview() {
    		$$invalidate(5, isReview = false);

    		// allowed user to perform the task
    		AH.selectAll('.preview_drawing_container', 'css', { pointerEvents: "" });

    		// shows all buttons
    		AH.selectAll('.previewBtnGrp', 'removeClass', 'h');

    		// adds the class previewKeySvg to the svg element have id previewSvg
    		AH.select('#previewSvg', 'addClass', 'previewKeySvg');

    		// contains the value of state array selectedTools at index 0 after removing the first character
    		previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));

    		// it's also used below in this function so it can be removed
    		AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');

    		// it's also used below in this function so it can be removed
    		AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');

    		if (previewMode == 'compass') {
    			// shows compass tool
    			AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');

    			// sets the style of the cursor to crosshair (+)
    			AH.select('#previewSvg', 'css', { 'cursor': 'crosshair' });

    			// hides the icon (+) which is used to sketch the drawing using keyboard
    			AH.select('#moveDrawIcon', 'addClass', 'h');
    		} else {
    			// hides compass tool
    			AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
    		}

    		// removes the class active from drawing tools, delete, and 'Mark Points' or 'Finish Marking' buttons
    		AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');

    		// adds the class active to the drawing tool button which exist at index 0 in state array selectedTools
    		AH.selectAll('#preview' + state.selectedTools[0], 'addClass', 'active');

    		// removes the correct answer circle that can be seen on remediation mode in green stroke color
    		AH.selectAll('.correct_answer_container .answer_mark', 'remove');

    		// enables the element have id mark_points and updates its text as 'Mark Points'
    		AH.select('#mark_points').innerText = 'Mark Points';

    		AH.select('#mark_points').disabled = false;

    		// sets the value of the variable 'isMarking' to 1
    		isMarking = 1;

    		$$invalidate(2, state.remediationMode = 'off', state);

    		// removes the title element inside the element have class previewMarkingPaths
    		AH.selectAll('.previewMarkingPaths title', 'remove');

    		// sets the value state markPointColor into the value of attribute stroke of the element have class answer_mark and removes attribute tabindex
    		AH.selectAll('.answer_mark', 'css', { 'stroke': state.markPointColor });

    		AH.selectAll('.answer_mark', 'removeAttr', 'tabindex');
    	}

    	// parses the xml and updates the values of variables and states and width, src, alt of the background image, shows the enabled drawing tools and sets the mark point position and draw the lines using mark points
    	function parseXMLForGettingData() {
    		try {
    			// contains json data of the xml
    			defaultXML = XMLToJSON(xml);

    			if (defaultXML.smxml._markPointColor == undefined) {
    				// sets the value of the key markPointColor to #00ff00 of json defaultXML
    				defaultXML.smxml._markPointColor = '#00ff00';
    			}

    			if (defaultXML.smxml._color == undefined) {
    				// sets the value of the key color to rgb(0, 188, 212) of json defaultXML
    				defaultXML.smxml._color = 'rgb(0, 188, 212)';
    			}

    			prev_store.update(item => {
    				// sets the value of state bgImg to the value of key bgimg of json defaultXML
    				item.bgImg = defaultXML.smxml._bgimg;

    				// sets the value of state alt to the value of key imgAlt of json defaultXML
    				item.alt = defaultXML.smxml._imgAlt;

    				// sets the value of state imgWidth to the value of key width of json defaultXML
    				item.imgWidth = defaultXML.smxml._width;

    				// sets the value of state lineColor to the value of key color of json defaultXML
    				item.lineColor = defaultXML.smxml._color;

    				// sets the value of state focusDATA to the value of subkey cdata of key backgroundPoint of json defaultXML
    				item.focusDATA = defaultXML.smxml.backgroundPoint.__cdata;

    				// sets the value of state markPointColor to the value of key markPointColor of json defaultXML
    				item.markPointColor = defaultXML.smxml._markPointColor;

    				// sets the value of state selectedTools to the value of key 'selectedDrawingType' after joining it with commam of json defaultXML
    				item.selectedTools = defaultXML.smxml.div._selectedDrawingType.split(',');

    				return item;
    			});

    			// makes array 'accessibilityPoints' to empty
    			accessibilityPointsPreview = [];

    			// assign the value 1 to the variable focusPointCountPreview
    			focusPointCountPreview = 1;

    			// assign the value of state focusDATA into variable updatedFocusCDATA
    			let updatedFocusCDATA = state.focusDATA;

    			// replaces the character '!' to ',' and wraps the value into square bracket
    			updatedFocusCDATA = '[' + updatedFocusCDATA.replace(/!/g, ',') + ']';

    			// contains javascript object 
    			updatedFocusCDATA = JSON.parse(updatedFocusCDATA);

    			// removes the element circle, path and title from element have class 'backgroundFocusPathPreview' and 'backgroundFocusPointPreview'
    			AH.selectAll('.backgroundFocusPointPreview circle,.backgroundFocusPathPreview path, .backgroundFocusPointPreview title', 'remove');

    			for (let index = 0; index < updatedFocusCDATA.length; index++) {
    				// pushes data of multi dimesion array updatedFocusCDATA specified at perticular row and column where value of row and column is equals to the value of variable 'index' into array previewScribblePath
    				accessibilityPointsPreview.push(updatedFocusCDATA[index][index]);
    			}

    			for (let index = 0; index < updatedFocusCDATA.length; index++) {
    				for (let subPoints = 0; subPoints < updatedFocusCDATA[index][index].length; subPoints++) {
    					// updates the value of key x of multi dimention array object 'accessibilityPointsPreview' where row and column values are value of variable 'index' and 'subPoints' with the value of key x of multi dimention array updatedFocusCDATA object where row and column values are the value of variables 'index' and 'subPoints'
    					accessibilityPointsPreview[index][subPoints].x = updatedFocusCDATA[index][index][subPoints].x;

    					// updates the value of key y of multi dimention array object 'accessibilityPointsPreview' where row and column values are value of variable 'index' and 'subPoints' with the value of key y of multi dimention array object updatedFocusCDATA where row and column values are the value of variables 'index' and 'subPoints'
    					accessibilityPointsPreview[index][subPoints].y = updatedFocusCDATA[index][index][subPoints].y;

    					// Creates an element with the specified namespace URI and qualified name.
    					scribble = document.createElementNS(xmlns, 'circle');

    					// sets the stroke color and width
    					setPreviewColor('#808080', previewThickness);

    					// adds a new attribute 'aria-labelledby' (with a namespace null)
    					scribble.setAttributeNS(null, 'aria-labelledby', 'focusPoint_' + focusPointCountPreview + '_title focusPoint_' + focusPointCountPreview + '_desc');

    					// adds a new attribute 'tabindex' (with a namespace null)
    					scribble.setAttributeNS(null, 'tabindex', '0');

    					// adds a new attribute 'class' (with a namespace null)
    					scribble.setAttributeNS(null, 'class', 'focusPoints');

    					// adds a new attribute 'data-focusOrder' (with a namespace null)
    					scribble.setAttributeNS(null, 'data-focusOrder', focusPointCountPreview);

    					// adds a new attribute 'cx' (with a namespace null)
    					scribble.setAttributeNS(null, 'cx', accessibilityPointsPreview[index][subPoints].x);

    					// adds a new attribute 'cy' (with a namespace null)
    					scribble.setAttributeNS(null, 'cy', accessibilityPointsPreview[index][subPoints].y);

    					// adds a new attribute 'r' (with a namespace null)
    					scribble.setAttributeNS(null, 'r', '2px');

    					// place the scribble element before very first element inside the element have class 'backgroundFocusPointPreview'
    					AH.select('.backgroundFocusPointPreview').append(scribble);

    					// adds title and description of focus point for screen reader
    					AH.insert('.backgroundFocusPointPreview', '<title id="focusPoint_' + focusPointCountPreview + '_title">You are on the ' + focusPointCountPreview + ' Point </title><desc id="focusPoint_' + focusPointCountPreview + '_desc">Press shift + tab to move towards the previous point or tab to move towards the next points</desc>', 'beforeend');

    					// increases the value of variable 'focusPointCountPreview' by 1
    					focusPointCountPreview++;
    				}

    				// join the marked points and sets the color and width of the stroke 
    				joinMarkedPoint(accessibilityPointsPreview[index], 1);
    			}

    			// contains the stroke color
    			previewColor = state.lineColor;

    			// makes array previewScribblePath blank for remove the drawing sketched by the help of drawing tools
    			previewScribblePath = [];

    			// sets the value true of the variable isDrawCompassPreview
    			isDrawCompassPreview = true;

    			// sets the value false of the variable isStoreStart
    			isStoreStart = false;

    			// sets the value 0 of the variable isDrawStop
    			isDrawStop = 0;

    			// shows that drawing is not start via keyboard
    			startDrawingByKey = 0;

    			// shows number of drawing sketched with the help of drawing tools
    			previewScribbleCount = 0;

    			// counts the number of undo can be done
    			previewUndoCount = 0;

    			// makes array previewUndoList blank to remove the all undo done
    			previewUndoList = [];

    			// makes array previewRedoList blank to remove the all redo done
    			previewRedoList = [];

    			// sets the value of the variable 'isMarking' to 1
    			isMarking = 1;

    			// makes array markPoints blank to remove the mark point
    			markPoints = [];

    			// removes the first character from the string exist in state array selectedTools at index 0
    			previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));

    			if (editorState) {
    				// removes drawing sketched by the help of drawing tools and marked points and also lines that is drawn automatically using mark points
    				AH.selectAll('.previewMarkingPaths .answer_mark,.previewDrawingPaths path', 'remove');
    			}

    			if (previewMode == 'compass') {
    				// shows the compass tool
    				AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');

    				// sets the cursor style to crosshair (+)
    				AH.select('#previewSvg', 'css', { 'cursor': 'crosshair' });

    				// hides icon (+) used for sketch the drawing using keyboard
    				AH.select('#moveDrawIcon', 'addClass', 'h');
    			} else {
    				// hides the compass element
    				AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
    			}

    			// enabled the button have id mark_points and update its text to 'Mark Points' 
    			AH.select('#mark_points').disabled = false;

    			AH.select('#mark_points').innerText = "Mark Points";

    			// disabled the undo, redo and clear screen (x) buttons
    			AH.select('#preview_undo').disabled = true;

    			AH.select('#preview_redo').disabled = true;
    			AH.select('#preview_clearScreen').disabled = true;

    			// removes the drawing tool buttons
    			AH.selectAll('.geometryToolPreview', 'addClass', 'h');

    			for (let toolsIndex = 0; toolsIndex < state.selectedTools.length; toolsIndex++) {
    				// shows the drawing tools buttons that exist in state array selectedTools
    				AH.select('#preview' + state.selectedTools[toolsIndex], 'removeClass', 'h');
    			}

    			// removes the class active from drawing tools, delete and 'Mark Points' buttons
    			AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');

    			// adds the class active to scribble drawing tool button
    			AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');

    			// sets the width of the background image container
    			AH.selectAll('.preview_drawing_toolbar, .centerImgPreview', 'attr', {
    				'style': 'width:' + (Number(state.imgWidth) + 2) + 'px'
    			});

    			// sets the width, src and alt message of the background image
    			AH.select('.centerImg #svgImgPreview', 'attr', {
    				'src': bgImgPath + '' + state.bgImg,
    				'alt': state.alt,
    				'width': state.imgWidth
    			});

    			AH.enableBsAll('.tooltip_btn', 'Tooltip', { container: 'body' });
    		} catch(error) {
    			console.warn({
    				error,
    				func: 'parseXMLForGettingData @271'
    			});
    		}
    	}

    	// joins the marked points by the help of line that starts with first mark point and ends at last masked point by moving in sequencial order
    	function markFinalPoints() {
    		// hides the compass container
    		AH.selectAll('.drawingCompassSvg', 'addClass', 'h');

    		// removes the class 'eraserHover' from the element 'path' inside the element have id 'previewSvg'
    		AH.selectAll('#previewSvg path', 'removeClass', 'eraserHover');

    		if (isMarking) {
    			// removes the class active from the drawing tools and delete buttons
    			AH.selectAll('.preview_btn', 'removeClass', 'active');

    			// sets the text of the button 'Mark Points' to 'Finish MArking' and adds class active to it
    			AH.select('#mark_points').innerText = "Finish Marking";

    			AH.select('#mark_points', 'addClass', 'active');

    			// sets the value of the variable 'isMarking' to 0
    			isMarking = 0;

    			// removes the mark points and lines
    			AH.selectAll('.previewMarkingPaths .answer_mark', 'remove');

    			// makes array userMarkingPoint to empty
    			userMarkingPoint = [];

    			// makes array markPoints to empty
    			markPoints = [];

    			if (!editorState) {
    				// removes the correct answer circle that can be seen on remediation mode in green stroke color
    				AH.selectAll('.correct_answer_container .answer_mark', 'remove');
    			}

    			// sets value of variable 'previewMode' to 'markPoints'
    			previewMode = 'markPoints';
    		} else {
    			// stes the test of the button 'Finish Marking' to 'Mark Points' and adds class active to it
    			AH.select('#mark_points').innerText = "Mark Points";

    			AH.select('#mark_points', 'removeClass', 'active');

    			if (markPoints.length >= 1) {
    				// join the marked points and sets the color and width of the stroke 
    				joinMarkedPoint(markPoints);

    				if (state.remediationMode == 'on') {
    					// checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
    					parseXMLForAnswer();
    				}
    			}

    			// contains the value of index 0 of state array selectedTools after removing the first character
    			previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));

    			// hides the icon (+) used to sketch the drawing by the help of keyboard
    			AH.select('#moveDrawIcon', 'addClass', 'h');

    			// styles the cursor to crosshair (+)
    			AH.select('#previewSvg', 'css', { 'cursor': 'crosshair' });

    			// adds the active class to the drawing tool exist at index 0 in state array selectedTools
    			AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');

    			if (previewMode == 'compass') {
    				// shows the compass tool
    				AH.selectAll('.drawingCompassSvg', 'removeClass', 'h');
    			} else {
    				// hides the compass tool
    				AH.selectAll('.drawingCompassSvg', 'addClass', 'h');
    			}

    			// sets the value of the variable 'isMarking' to 1
    			isMarking = 1;
    		}
    	}

    	// draw the marked points and the lines connecting to these points
    	function addMarkPointOnLoad(array) {
    		for (let index = 0; index < array.length; index++) {
    			// Creates an element with the specified namespace URI and qualified name.
    			scribble = document.createElementNS(xmlns, 'circle');

    			// sets the stroke color and width
    			setPreviewColor(state.markPointColor, previewThickness);

    			// adds a new attribute 'class' (with a namespace null)
    			scribble.setAttributeNS(null, 'class', 'answer_mark');

    			// adds a new attribute 'cx' (with a namespace null)
    			scribble.setAttributeNS(null, 'cx', array[index].x);

    			// adds a new attribute 'cy' (with a namespace null)
    			scribble.setAttributeNS(null, 'cy', array[index].y);

    			// adds a new attribute 'r' (with a namespace null)
    			scribble.setAttributeNS(null, 'r', '2px');

    			// prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
    			AH.select('.previewMarkingPaths').prepend(scribble);
    		}

    		// join the marked points and sets the color and width of the stroke 
    		joinMarkedPoint(array);
    	}

    	function checkAns(uaXML) {
    		uaXML = XMLToJSON(uaXML);

    		// contains the json data of user answer xml
    		if (uaXML.smans.userDrawPath == undefined) {
    			// sets the value of userDataPath to blank that indicates that no drawing is sketched
    			uaXML.smans.userDrawPath = '';
    		}

    		// contains drawing data sketched by the help of drawing tools in the form of javascript object 
    		userDrawPath = JSON.parse(uaXML.smans.userDrawPath);

    		// defines the value true or false of the variable userAnsCorrect according to the value of ansCorrect of user answer xml
    		userAnsCorrect = uaXML.smans.ansCorrect.toLowerCase() == 'true'
    		? true
    		: false;

    		return userAnsCorrect;
    	}

    	// used to load the module according to the data of smxml and smans xml
    	function loadModule(uaXML, drawMark) {
    		// contains the x and y co-ordinate of the points marked by user
    		userAnsCorrect = checkAns(uaXML);

    		uaXML = XMLToJSON(uaXML);
    		userMarkingPoint = JSON.parse(uaXML.smans.markpoints);

    		// contains json data of xml props
    		defaultXML = XMLToJSON(xml);

    		// contains cdata of drawing of smxml that have to be performed by the help of drawing tools for correct answer
    		cdata = defaultXML.smxml.div.__cdata;

    		// replace the character '!' with ',' from cdata and wrap it in square bracket
    		cdata = '[' + cdata.replace(/!/g, ',') + ']';

    		// converts cdata string into javascript object
    		cdata = JSON.parse(cdata);

    		// draw the marked points and the lines connecting to these points
    		addMarkPointOnLoad(userMarkingPoint);

    		// creates the drawing sketched by user
    		createUserPath();

    		// checks the answer is correct or incorrect
    		checkCorrectAnswer(userMarkingPoint, drawMark);

    		// sets the status of the answer ( correct or incorrect message with showing the UI that indicates correct or incorrect)
    		setStatusOfAns(userAnsCorrect, userMarkingPoint, drawMark);
    	}

    	// removes drawing on which keyup event triggered and update the user answer xml
    	function eraser(curClass, curArray) {
    		if (AH.select(curClass).getAttribute("data-order") != undefined) {
    			// makes array previewUndoList blank
    			previewUndoList = [];

    			// a temporary variable used of 
    			let tempArrayContainer = '';

    			// find the index of the drawing on which keyup event fired exist in array curArray
    			let currentIndex = curArray.indexOf(curArray[AH.select(curClass).getAttribute("data-order")]);

    			// contains current element from array curArray after converting it into string and wraping in square bracket
    			let convertJSONtoArray = '[' + JSON.stringify(curArray[currentIndex]) + ']';

    			// contains copy of array convertJSONtoArray
    			tempArrayContainer = arrayCopy(JSON.parse(convertJSONtoArray));

    			// adds the value remove of mode key exist at index 0 in array tempArrayContainer
    			tempArrayContainer[0].mode = "remove";

    			// pushes the data of array 'tempArrayContainer' exist on index 0 into array curArray
    			curArray.push(tempArrayContainer[0]);

    			// contains copy of array curArray
    			let eraserArrayContainer = arrayCopy(curArray);

    			// stores the drawing sketched by user and sets the user answer xml
    			storeUserPaths(eraserArrayContainer);

    			// increases the value of the variable previewScribbleCount by 1
    			previewScribbleCount++;

    			// increases the value of the variable previewUndoCount by 1
    			previewUndoCount++;

    			// removes the current drawing on which keyup event fired
    			AH.select(curClass, 'remove');

    			// disabled the redo button
    			AH.select('#preview_redo').disabled = true;

    			// enables undo button
    			AH.select('#preview_undo').disabled = false;

    			if (AH.selectAll('.previewDrawingPaths path').length == 0) {
    				// disabled the clear screen button (x)
    				AH.select('#preview_clearScreen').disabled = true;
    			}
    		}
    	}

    	// stores the drawing sketched by user and sets the user answer xml
    	function storeUserPaths(drawPathArray) {
    		// makes array userAnsPath blank
    		userAnsPath = [];

    		// creates the variable subindex and assign the value 0
    		let subindex = 0;

    		for (let index = 0; index < drawPathArray.length; index++) {
    			subindex = index + 1;

    			while (subindex < drawPathArray.length) {
    				if (drawPathArray[index].type == drawPathArray[subindex].type) {
    					if (drawPathArray[index].mode == "add" && drawPathArray[subindex].mode == "remove") {
    						// sets the value null of mode key of array drawPathArray have index defined in variable 'index'
    						drawPathArray[index].mode = null;

    						// sets the value null of mode key of array drawPathArray have index defined in variable 'subindex'
    						drawPathArray[subindex].mode = null;
    					}
    				}

    				// increases the value of the variable subindex by 1
    				subindex++;
    			}
    		}

    		for (let index = 0; index < drawPathArray.length; index++) {
    			// Return an array of all the values in the drawPathArray array whose value of mode key is not null
    			drawPathArray = drawPathArray.filter(function (element) {
    				return element.mode != null;
    			});
    		}

    		// pushes data of array drawPathArray into array userAnsPath
    		userAnsPath.push(drawPathArray);

    		// updates user answer xml
    		createUXML();
    	}

    	// creates user answer xml
    	function createUXML() {
    		// makes array markPointsData empty
    		markPointsData = [];

    		if (markPoints.length == 0) {
    			// contains the x and y co-ordinate of the points marked by user
    			markPointsData = JSON.stringify(userMarkingPoint);
    		} else {
    			// contains the x and y co-ordinate of the points marked by user
    			markPointsData = JSON.stringify(markPoints);
    		}

    		// contains proforma of user answer xml with points marked by user, drawing sketched by user and state of answer  
    		userAnsXML = '<smans type="41"><markpoints>' + markPointsData + '</markpoints><userDrawPath>' + JSON.stringify(userAnsPath[0]) + '</userDrawPath><ansCorrect>' + isAnswerCorrect + '</ansCorrect></smans>';

    		// defined that user answer xml changed
    		window.ISSPECIALMODULEUSERXMLCHANGE = 1;

    		// sets the user answer xml
    		$$invalidate(2, state.uxml = userAnsXML, state);

    		var ans = checkAns(userAnsXML);
    		onUserAnsChange({ uXml: userAnsXML, ans });
    	}

    	// creates the drawing sketched by user
    	function createUserPath() {
    		if (userDrawPath.length) {
    			// enables the cross and undo buttons 
    			AH.select('#preview_undo').disabled = false;

    			AH.select('#preview_undo').disabled = false;
    		}

    		for (let index = 0; index < userDrawPath.length; index++) {
    			// sets the type key value of the object exist at index defined in variable 'index' of array userDrawPath by adding the value of variable 'index' in its previous value
    			userDrawPath[index].type = userDrawPath[index].type.substr(0, userDrawPath[index].type.indexOf('_')) + '_' + index;

    			// sets the order key value of the object exist at index defined in variable 'index' of array userDrawPath by adding the value of variable 'index'
    			userDrawPath[index].order = index;

    			// Creates an element with the value of variable xmlns namespace URI and 'path' name
    			scribble = document.createElementNS(xmlns, 'path');

    			// sets the stroke color and width
    			setPreviewColor(previewColor, previewThickness);

    			// adds a new attribute 'data-type' (with a namespace null)
    			scribble.setAttributeNS(null, 'data-type', userDrawPath[index].type);

    			// adds a new attribute 'data-order' (with a namespace null)
    			scribble.setAttributeNS(null, 'data-order', userDrawPath[index].order);

    			// adds a new attribute 'd' (with a namespace null)
    			scribble.setAttributeNS(null, 'd', userDrawPath[index].d);

    			// adds a new attribute 'tabindex' (with a namespace null)
    			scribble.setAttributeNS(null, 'tabindex', '0');

    			// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    			AH.select('.previewDrawingPaths').prepend(scribble);
    		}

    		// sets the value of the variable 'previewScribbleCount' to  the value of length of the array 'userDrawPath'
    		previewScribbleCount = userDrawPath.length;

    		// contains copy of array userDrawPath
    		previewScribblePath = arrayCopy(userDrawPath);
    	}

    	// join the marked points and sets the color and width of the stroke 
    	function joinMarkedPoint(markArray, focusPoint) {
    		if (markArray.length == 0) {
    			return;
    		}

    		// Creates an element with the value of variable xmlns namespace URI and 'path' name
    		scribble = document.createElementNS(xmlns, 'path');

    		// sets the starting position of the drawing
    		let pointStartValues = 'M ' + markArray[0].x + ' ' + markArray[0].y;

    		// variable for end point
    		let pointEndValues = '';

    		for (let index = 1; index < markArray.length; index++) {
    			// adds the value of x and y into previous value of the variable pointEndValues from the array 'markArray' at index defined in variable 'index'
    			pointEndValues += ' L ' + markArray[index].x + ' ' + markArray[index].y;
    		}

    		// adds a new attribute 'd' (with a namespace null)
    		scribble.setAttributeNS(null, 'd', pointStartValues + '' + pointEndValues);

    		if (focusPoint) {
    			// sets the stroke color and width
    			setPreviewColor('rgb(128, 128, 128)', previewThickness);

    			// prepend the element assigned into variable 'scribble' in background focus container element
    			AH.select('.backgroundFocusPathPreview').prepend(scribble);
    		} else {
    			// sets the stroke color and width
    			setPreviewColor(state.markPointColor, previewThickness);

    			// adds a new attribute 'class' (with a namespace null)
    			scribble.setAttributeNS(null, 'class', 'answer_mark');

    			// prepend the element stored into variable scribble in mark point container in which drawings are stored done by the help of 'Mark Poin' And 'Finish Marking' buttons
    			AH.select('.previewMarkingPaths').prepend(scribble);
    		}
    	}

    	// checks the answer and updates the status and enables 'Mark Points' button and also updates its text as 'Mark Points' 
    	function parseXMLForAnswer(drawMark) {
    		// contains the json data of the xml of props
    		defaultXML = XMLToJSON(state.xml);

    		// contains the value of cdata inside div of smxml
    		cdata = defaultXML.smxml.div.__cdata;

    		// replaces the character '!' with ',' and wraps in square bracket of the value of cdata variable
    		cdata = '[' + cdata.replace(/!/g, ',') + ']';

    		// parses the cdata string value into javascript object
    		cdata = JSON.parse(cdata);

    		// creates an array markPointsAnsData
    		let markPointsAnsData = [];

    		// assign the value of array markPoints into array markPointsAnsData
    		markPointsAnsData = markPoints;

    		if (!editorState) {
    			if (uxml) {
    				if (markPoints.length == 0) {
    					// contains the x and y co-ordinate of the points marked by user
    					markPointsAnsData = userMarkingPoint;
    				}
    			}
    		}

    		// checks the answer is correct or incorrect
    		checkCorrectAnswer(markPointsAnsData, drawMark);

    		// sets the status of the answer ( correct or incorrect message with showing the UI that indicates correct or incorrect)
    		setStatusOfAns(isAnswerCorrect, markPointsAnsData, drawMark);

    		if (drawMark) {
    			// enables the element have id mark_points and updates its text as 'Mark Points'
    			AH.select('#mark_points').innerText = 'Mark Points';

    			AH.select('#mark_points').disabled = false;

    			// sets the value of the variable 'isMarking' to 1
    			isMarking = 1;
    		}
    	}

    	// stores the drawing sketched by user using keyboard and sets the user answer xml
    	function storeCompassPathByKey() {
    		// removes the class lastCircle_hover from the last circle that exist on rotation bar of the compass
    		AH.selectAll('#previewSvg .lastCircle', 'removeClass', 'lastCircle_hover');

    		// sets the style of the cursor to grab when cursor lies inside last circle
    		AH.selectAll('#previewSvg .lastCircle', 'css', { 'cursor': 'grab' });

    		// sets the value true of variable isDrawCompassPreview
    		isDrawCompassPreview = true;

    		if (previewScribblePath[previewScribbleCount].d.indexOf('L') == -1) {
    			// removes the last element from the array previewScribblePath
    			previewScribblePath.pop();
    		} else {
    			// adds a new attribute 'd' (with a namespace null)
    			scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);

    			// adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    			previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;

    			// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools 
    			AH.select('.previewDrawingPaths').prepend(scribble);

    			// increases the value of variable previewScribbleCount by 1
    			previewScribbleCount++;

    			// increases the value of variable previewUndoCount by 1
    			previewUndoCount++;

    			// makes array previewUndoList blank 
    			previewUndoList = [];

    			// enables the cross (x) and undo button
    			AH.select('#preview_undo').disabled = false;

    			AH.select('#preview_clearScreen').disabled = false;

    			// disabled the redo button
    			AH.select('#preview_redo').disabled = true;
    		}

    		// contains copy of array previewScribblePath
    		let tempArrayContainer = arrayCopy(previewScribblePath);

    		// stores the drawing sketched by user and sets the user answer xml
    		storeUserPaths(tempArrayContainer);
    	}

    	// removes the all mark points and sets the value of the variable 'isMArking' to 1
    	function clearMarking() {
    		// removes the mark points and lines 
    		AH.selectAll('.previewMarkingPaths .answer_mark', 'remove');

    		if (!editorState) {
    			// removes the correct answer circle that can be seen on remediation mode in green stroke color
    			AH.selectAll('.correct_answer_container .answer_mark', 'remove');
    		}

    		// makes array markPoints empty
    		markPoints = [];

    		// sets the text 'Mark Points' of the element having id 'mark_points' and enabled that element
    		AH.select('#mark_points').innerText = 'Mark Points';

    		AH.select('#mark_points').disabled = false;

    		// sets the value of variable isMArking to 1 that indicates that mark can be draw
    		isMarking = 1;
    	}

    	// checks the answer is correct or incorrect
    	function checkCorrectAnswer(markArray, drawMark) {
    		// creates correctAnswer array
    		let correctAnswer = [];

    		if (drawMark) {
    			for (let index = 0; index < cdata.length; index++) {
    				// Creates an element with the specified namespace URI and qualified name.
    				scribble = document.createElementNS(xmlns, 'circle');

    				// sets the stroke color and width
    				setPreviewColor('#0F9D58', '2');

    				// adds a new attribute 'class' (with a namespace null)
    				scribble.setAttributeNS(null, 'class', 'answer_mark answer_circle');

    				// adds a new attribute 'cx' (with a namespace null)
    				scribble.setAttributeNS(null, 'cx', cdata[index].x);

    				// adds a new attribute 'cy' (with a namespace null)
    				scribble.setAttributeNS(null, 'cy', cdata[index].y);

    				// adds a new attribute 'r' (with a namespace null)
    				scribble.setAttributeNS(null, 'r', cdata[index].r);

    				// prepend the created element with the value of variable 'xmlns' namespace URI and circle name in element have class 'correct_answer_container'
    				AH.select('.correct_answer_container').prepend(scribble);
    			}
    		}

    		if (cdata.length == 0 || markArray.length == 0) {
    			// sets the value of variable 'isAnswerCorrect' to false
    			isAnswerCorrect = false;

    			return;
    		}

    		// sets the value of the variable 'lineCount' according to the length of the array markArray
    		let lineCount = markArray.length == 1
    		? markArray.length
    		: markArray.length - 1;

    		for (let cdataIndex = 0; cdataIndex < cdata.length; cdataIndex++) {
    			for (let index = 0; index < lineCount; index++) {
    				if (lineCount == 1 && markArray.length == 1 && checkIntersection(markArray[index].x, markArray[index].y, 0, 0, cdata[cdataIndex].x, cdata[cdataIndex].y, cdata[cdataIndex].r)) {
    					// push data 'Match' into array correctAnswer
    					correctAnswer.push("Match");

    					break;
    				}

    				if (lineCount >= 1 && markArray.length > 1 && checkIntersection(markArray[index].x, markArray[index].y, markArray[index + 1].x, markArray[index + 1].y, cdata[cdataIndex].x, cdata[cdataIndex].y, cdata[cdataIndex].r)) {
    					// push data 'Match' into array correctAnswer
    					correctAnswer.push("Match");

    					break;
    				}
    			}
    		}

    		if (correctAnswer.length == cdata.length) {
    			// sets the value of variable 'isAnswerCorrect' to true
    			isAnswerCorrect = true;
    		} else {
    			// sets the value of variable 'isAnswerCorrect' to false
    			isAnswerCorrect = false;
    		}

    		// makes correctAnswer array empty
    		correctAnswer = [];
    	}

    	// sets the status of the answer ( correct or incorrect message with showing the UI that indicates correct or incorrect)
    	function setStatusOfAns(isAnswerCorrect, markArray, drawMark) {
    		if (isAnswerCorrect) {
    			// stes the value of the state correctAnswer to true
    			$$invalidate(2, state.correctAnswer = true, state);

    			if (drawMark) {
    				if (cdata.length && markArray.length) {
    					// join the marked points and sets the color and width of the stroke 
    					joinMarkedPoint(markArray);
    				}

    				// sets the stroke color of element have class 'answer_mark' to #0F9D58
    				AH.selectAll('.answer_mark', 'css', { 'stroke': '#0F9D58' });

    				// sets the value of the message variable to correct
    				if (editorState) {
    					// shows correct
    					showAns(l.correct);
    				}
    			}
    		} else {
    			$$invalidate(2, state.correctAnswer = false, state);

    			if (drawMark) {
    				if (cdata.length && markArray.length) {
    					// join the marked points and sets the color and width of the stroke 
    					joinMarkedPoint(markArray);
    				}

    				// sets the stroke color of the mark points and lines that are draw using mark points to #ff0000
    				AH.selectAll('.answer_mark', 'css', { 'stroke': '#ff0000' });

    				AH.selectAll('.answer_circle', 'css', { 'stroke': '#0F9D58' });

    				if (editorState) {
    					// shows answer incorrect
    					showAns(l.incorrect);
    				}
    			}
    		}

    		// check or uncheck the element have id 'answer' according to the value of variable isAnswerCorrect
    		// AH.select("#answer").checked = state.correctAnswer;
    		onUserAnsChange({
    			uXml: userAnsXML,
    			ans: state.correctAnswer
    		});
    	}

    	// updates the value of compass radius and angle
    	function checkPreviewRadiusAndAngle() {
    		// contains the value of initial x co-ordinate of compass rotation bar 
    		initialPoint.x = Number(AH.select('.compassRotationBar').getAttribute('x1'));

    		// contains the value of initial y co-ordinate of compass rotation bar
    		initialPoint.y = Number(AH.select('.compassRotationBar').getAttribute('y1'));

    		// contains the value of final x co-ordinate of compass rotation bar
    		finalPoint.x = Number(AH.select('.compassRotationBar').getAttribute('x2'));

    		// contains the value of final y co-ordinate of compass rotation bar
    		finalPoint.y = Number(AH.select('.compassRotationBar').getAttribute('y2'));

    		// // contains the length of compass rotation bar
    		$$invalidate(0, previewCompassRadius = Number(AH.select('.drawingCompassRoute').getAttribute('r')));

    		// contains the value of compass angle using the co-ordinates of the initial and final points
    		$$invalidate(1, previewCompassAngle = Math.atan2(finalPoint.y - initialPoint.y, finalPoint.x - initialPoint.x) * 180 / Math.PI);
    	}

    	// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    	function updatePreviewCompassCalculation(cx, cy, previewCompassRadius, previewCompassAngle) {
    		// sets the center of x of middle circle lies on compass rotationbar
    		midCircle_cx = cx + previewCompassRadius / 2 * Math.cos(previewCompassAngle * (Math.PI / 180));

    		// sets the center of y of middle circle lies on compass rotationbar
    		midCircle_cy = cy + previewCompassRadius / 2 * Math.sin(previewCompassAngle * (Math.PI / 180));

    		// sets the center of x of small middle circle lies on compass rotationbar
    		midSmallCircle_cx = cx + 3 * previewCompassRadius / 4 * Math.cos(previewCompassAngle * (Math.PI / 180));

    		// sets the center of y of small middle circle lies on compass rotationbar
    		midSmallCircle_cy = cy + 3 * previewCompassRadius / 4 * Math.sin(previewCompassAngle * (Math.PI / 180));

    		// sets the center of x of last circle lies on compass rotationbar
    		lastCircle_cx = cx + previewCompassRadius * Math.cos(previewCompassAngle * (Math.PI / 180));

    		// sets the center of y of last circle lies on compass rotationbar
    		lastCircle_cy = cy + previewCompassRadius * Math.sin(previewCompassAngle * (Math.PI / 180));

    		// sets the center of x of rotation icon that can be seen just in front of the last circle to indication that move the rotationbar in these directions to draw the circular curve
    		lastSmallCircle_cx = cx + 5 * previewCompassRadius / 4 * Math.cos(previewCompassAngle * (Math.PI / 180));

    		// sets the center of x of rotation icon that can be seen just in front of the last circle to indication that move the rotationbar in these directions to draw the circular curve
    		lastSmallCircle_cy = cy + 5 * previewCompassRadius / 4 * Math.sin(previewCompassAngle * (Math.PI / 180));

    		// sets the center co-ordinate of the compass and of its route
    		AH.selectAll('.drawingCompassRoute,.drawingCompassCenter', 'attr', { cx, cy });

    		// sets the radius of the compass or length of the rotationbar
    		AH.selectAll('.drawingCompassRoute', 'attr', { 'r': previewCompassRadius });

    		// sets the co-ordinates of start and end points of the compass rotation bar
    		AH.selectAll('.compassRotationBar', 'attr', {
    			'x1': cx,
    			'y1': cy,
    			'x2': lastCircle_cx,
    			'y2': lastCircle_cy
    		});

    		// sets the values of the center of the rotation indicator and rotate it in 3D dimention for defined variables value that can be seen after hover on the last circle lies on rotation bar
    		AH.selectAll('#previewSvg .lastCircleMid', 'attr', {
    			'cx': lastSmallCircle_cx,
    			'cy': lastSmallCircle_cy,
    			"transform": "rotate(" + previewCompassAngle + "," + lastSmallCircle_cx + "," + lastSmallCircle_cy + ")"
    		});

    		// sets the center of the last circle lies on rotation bar
    		AH.selectAll('#previewSvg .lastCircle', 'attr', { 'cx': lastCircle_cx, 'cy': lastCircle_cy });

    		// sets the values of the center of small middle circle and rotate it in 3D dimention for defined variables value
    		AH.selectAll('#previewSvg .midSmallCircle', 'attr', {
    			'cx': midSmallCircle_cx,
    			'cy': midSmallCircle_cy,
    			"transform": "rotate(" + previewCompassAngle + "," + midSmallCircle_cx + "," + midSmallCircle_cy + ")"
    		});

    		// sets the values of the center of middle circle and rotate it in 3D dimention for defined variables value
    		AH.selectAll('#previewSvg .mid_circle', 'attr', {
    			'cx': midCircle_cx,
    			'cy': midCircle_cy,
    			"transform": "rotate(" + previewCompassAngle + "," + midCircle_cx + "," + midCircle_cy + ")"
    		});

    		// assign the value of variable previewCompassAngle into variable curAngle
    		let curAngle = previewCompassAngle;

    		if (curAngle < 0) {
    			// adds 360 degree value in it's previous value of variable curAngle
    			curAngle = 360 + curAngle;
    		}

    		// sets the message about angle for screen reader
    		AH.select('#compassRotationTitle').innerText = "Compass Angle, Your Current Angle is " + curAngle.toFixed(0) + " degree";

    		// sets the message about radius for screen reader
    		AH.select('#compassRadiusTitle').innerText = "Compass Radius, Your Current Radius is " + (previewCompassRadius * 0.02649).toFixed(1) + "cm";
    	}

    	// sets the x and y co-ordinate of the mouse position
    	function setPreviewMouseCoordinates(event) {
    		// contains the size of element having id 'authoringSvg' and its position relative to the viewport
    		let boundary = document.getElementById('previewSvg').getBoundingClientRect();

    		// sets the x position of the mouse co-ordinate
    		preview_mouseX = event.clientX - boundary.left;

    		// sets the y position of the mouse co-ordinate
    		preview_mouseY = event.clientY - boundary.top;
    	}

    	// sets the stroke color and width
    	function setPreviewColor(previewColor, previewThickness) {
    		// sets the stroke color of the drawing
    		scribble.style.stroke = previewColor;

    		// sets the stroke width of the drawing
    		scribble.style.strokeWidth = previewThickness;

    		scribble.style.fill = 'none';
    	}

    	// changes the value of radius, angle, and center of the compass when it is performed via keyboard
    	function compassKeyEvent(mode, event) {
    		if (!AH.select('.drawingCompassSvg').classList.contains('h') && previewMode == "compass") {
    			// contains width of the background image
    			let imageWidth = AH.select('#svgImgPreview').clientWidth;

    			// contains width of the background image 
    			let imageHeight = AH.select('#svgImgPreview').clientHeight;

    			// updates the value of compass radius and angle
    			checkPreviewRadiusAndAngle();

    			if (event.shiftKey && (event.keyCode == 38 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 40)) {
    				if (mode == 'radius') {
    					switch (event.keyCode) {
    						case 38:
    							// increases the radius value by 1 after down the key shift and up arrow
    							$$invalidate(0, previewCompassRadius++, previewCompassRadius);
    							break;
    						case 37:
    							// decreases the radius value by 1 after down the key shift and left arrow
    							$$invalidate(0, previewCompassRadius--, previewCompassRadius);
    							break;
    						case 39:
    							// increases the radius value by 1 after down the key shift and right arrow
    							$$invalidate(0, previewCompassRadius++, previewCompassRadius);
    							break;
    						case 40:
    							// decreases the radius value by 1 after down the key shift and down arrow
    							$$invalidate(0, previewCompassRadius--, previewCompassRadius);
    							break;
    					}
    				}

    				if (mode == 'move') {
    					switch (event.keyCode) {
    						case 38:
    							// decreases the value of y co-ordinate of compass center by 1 after down the key shift and up arrow
    							initialPoint.y--;
    							break;
    						case 37:
    							// decreases the value of x co-ordinate of compass center by 1 after down the key shift and left arrow
    							initialPoint.x--;
    							break;
    						case 39:
    							// increases the value of x co-ordinate of compass center by 1 after down the key shift and right arrow
    							initialPoint.x++;
    							break;
    						case 40:
    							// increases the value of y co-ordinate of compass center by 1 after down the key shift and down arrow
    							initialPoint.y++;
    							break;
    					}
    				}

    				if (mode == 'rotate' || mode == 'draw') {
    					switch (event.keyCode) {
    						case 38:
    							// increases the value of compass angle by 1 after down the key shift and up arrow
    							$$invalidate(1, previewCompassAngle++, previewCompassAngle);
    							break;
    						case 39:
    							// decreases the value of compass angle by 1 after down the key shift and right arrow
    							$$invalidate(1, previewCompassAngle--, previewCompassAngle);
    							break;
    						case 37:
    							// increases the value of compass angle by 1 after down the key shift and left arrow
    							$$invalidate(1, previewCompassAngle++, previewCompassAngle);
    							break;
    						case 40:
    							// decreases the value of compass angle by 1 after down the key shift and down arrow
    							$$invalidate(1, previewCompassAngle--, previewCompassAngle);
    							break;
    					}
    				}

    				if (mode == 'draw') {
    					if (AH.select('#previewSvg .lastCircle').classList.contains('lastCircle_hover') || AH.select('#previewSvg .lastbigcircle').classList.contains('lastCircle_hover')) {
    						// adds a new attribute 'd' (with a namespace null)
    						scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy);

    						// adds value of variables lastCircle_cx and lastCircle_cy separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    						previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + lastCircle_cx + ' ' + lastCircle_cy;

    						// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    						AH.select('.previewDrawingPaths').prepend(scribble);
    					}
    				}

    				if (initialPoint.x < 10 || previewCompassRadius < 80 || previewCompassRadius > 360 || initialPoint.x > imageWidth || initialPoint.y < 10 || initialPoint.y > imageHeight) {
    					return;
    				}

    				// updates the position of rotationbar and change the center position of the circles that lies on rotationbar
    				updatePreviewCompassCalculation(initialPoint.x, initialPoint.y, previewCompassRadius, previewCompassAngle);
    			}
    		}
    	}

    	// stop the drawing and store the drawing sketched by the user and sets the user answer xml 
    	function stopDraw() {
    		if (checkCurrentPositionX == cursorLeft && checkCurrentPositionY == cursorTop && previewMode == 'line' || previewMode == 'scribble' && previewScribblePath[previewScribbleCount].d.indexOf('L') == -1) {
    			// removes the last element from the array previewScribblePath
    			previewScribblePath.pop();
    		} else {
    			if (!(isNaN(cursorLeft) && isNaN(cursorTop))) {
    				// adds a new attribute 'd' (with a namespace null)
    				scribble.setAttributeNS(null, 'd', previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop);

    				// adds value of variables cursorLeft and cursorTop separated by space with prefix 'L' in the previous value of the key 'd' at index specified in the variable previewScribbleCount of array previewScribblePath
    				previewScribblePath[previewScribbleCount].d = previewScribblePath[previewScribbleCount].d + ' L' + cursorLeft + ' ' + cursorTop;

    				// prepend the element stored into variable scribble in drawing container in which drawings are stored sketched by the help of drawing tools
    				AH.select('.previewDrawingPaths').prepend(scribble);
    			}

    			// increases the value of the variable previewScribbleCount by 1
    			previewScribbleCount++;

    			// increases the value of the variable previewUndoCount by 1
    			previewUndoCount++;

    			// makes array previewUndoList blank
    			previewUndoList = [];

    			// enables undo and cross (x) buttons
    			AH.select('#preview_undo').disabled = false;

    			AH.select('#preview_clearScreen').disabled = false;

    			// disabled redo button
    			AH.select('#preview_redo').disabled = true;
    		}

    		// indicates that scribble drawing is not sketching
    		isScribble = 0;

    		// sets the value of variable startDrawingByKey to 0
    		startDrawingByKey = 0;

    		// sets the value of variable isDrawStop to 0
    		isDrawStop = 0;

    		// sets the value of variable lockFocus to 0
    		lockFocus = 0;

    		// contains copy of array previewScribblePath
    		let tempArrayContainer = arrayCopy(previewScribblePath);

    		// stores the drawing sketched by user and sets the user answer xml
    		storeUserPaths(tempArrayContainer);
    	}

    	// function for opening the shortcut modal
    	function openShortcut() {
    		AH.getBS('#drawing_shortcut_modal', 'Modal').show();
    	}

    	// function for checking the user ans and loading the module on the basis of it
    	function checkUserAns() {
    		if (typeof editorState == 'undefined') {
    			// removes the reset button
    			AH.selectAll('.reset_group', 'remove');

    			if (uxml) {
    				if (uxml.search('<smans type="41">') == -1 || uxml.search('<smans type="41"></smans>') == 0 || uxml.search('undefined') != -1) {
    					// blanks the user answer xml
    					$$invalidate(2, state.uxml = '', state);
    				} else {
    					if (isReview) {
    						AH.selectAll('.previewBtnGrp', 'addClass', 'h'); // AH.select("#special_module_user_xml", 'value', "");

    						// sets the value 'none' of the variable previewMode
    						previewMode = 'none';

    						// not allowed user to perform the task
    						AH.selectAll('.preview_drawing_container', 'css', { pointerEvents: "none" });

    						// removes the class previewKeySvg from the svg element have id previewSvg
    						AH.select('#previewSvg', 'removeClass', 'previewKeySvg');
    					} else {
    						// allowed user to perform the task
    						AH.selectAll('.preview_drawing_container', 'css', { pointerEvents: "" });

    						// shows all buttons
    						AH.selectAll('.previewBtnGrp', 'removeClass', 'h');

    						// adds the class previewKeySvg to the svg element have id previewSvg
    						AH.select('#previewSvg', 'addClass', 'previewKeySvg');

    						// contains the value of state array selectedTools at index 0 after removing the first character
    						previewMode = state.selectedTools[0].substr(-(state.selectedTools[0].length - 1));

    						// it's also used below in this function so it can be removed
    						AH.selectAll('.preview_btn,#mark_points', 'removeClass', 'active');

    						// it's also used below in this function so it can be removed
    						AH.select('#preview' + state.selectedTools[0], 'addClass', 'active');
    					}

    					loadModule(state.uxml, isReview);
    				}
    			}
    		}
    	}

    	const writable_props = ['xml', 'uxml', 'isReview', 'showAns', 'editorState'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<DrawingPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('xml' in $$props) $$invalidate(6, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(7, uxml = $$props.uxml);
    		if ('isReview' in $$props) $$invalidate(5, isReview = $$props.isReview);
    		if ('showAns' in $$props) $$invalidate(8, showAns = $$props.showAns);
    		if ('editorState' in $$props) $$invalidate(9, editorState = $$props.editorState);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		onMount,
    		AH,
    		onUserAnsChange,
    		XMLToJSON,
    		l,
    		swal,
    		writable,
    		xml,
    		uxml,
    		isReview,
    		showAns,
    		editorState,
    		bgImgPath,
    		xmlns,
    		isDrawingPreview,
    		isDrawCompassPreview,
    		isStoreStart,
    		isDrawStop,
    		startDrawingByKey,
    		scribble,
    		preview_mouseX,
    		preview_mouseY,
    		previewMode,
    		previewColor,
    		previewThickness,
    		previewScribblePath,
    		previewScribbleCount,
    		checkCurrentPositionX,
    		checkCurrentPositionY,
    		previewUndoCount,
    		previewUndoList,
    		previewRedoList,
    		accessibilityPointsPreview,
    		focusPointCountPreview,
    		lockFocus,
    		isScribble,
    		cx,
    		cy,
    		midCircle_cx,
    		midCircle_cy,
    		midSmallCircle_cx,
    		midSmallCircle_cy,
    		lastCircle_cx,
    		lastCircle_cy,
    		lastSmallCircle_cx,
    		lastSmallCircle_cy,
    		previewCompassRadius,
    		isPreviewCompassMove,
    		previewCompassAngle,
    		isPreviewRadiusIncrease,
    		initialPoint,
    		finalPoint,
    		compassAngleDisplacement,
    		isPreviewRadiusRotate,
    		cursorTop,
    		cursorLeft,
    		defaultXML,
    		cdata,
    		isAnswerCorrect,
    		isMarking,
    		markPoints,
    		selectedToolsArray,
    		userAnsPath,
    		userAnsXML,
    		userMarkingPoint,
    		userDrawPath,
    		userAnsCorrect,
    		markPointsData,
    		is_mac,
    		prev_store,
    		state,
    		unsubscribe,
    		compassLastcircleEvent,
    		reinitializeFoucsEvent,
    		markPointEvent,
    		toolbarAction,
    		previewMouseLeave,
    		setReview,
    		unsetReview,
    		parseXMLForGettingData,
    		markFinalPoints,
    		addMarkPointOnLoad,
    		checkAns,
    		loadModule,
    		arrayCopy,
    		eraser,
    		storeUserPaths,
    		createUXML,
    		createUserPath,
    		joinMarkedPoint,
    		parseXMLForAnswer,
    		storeCompassPathByKey,
    		clearMarking,
    		checkCorrectAnswer,
    		setStatusOfAns,
    		checkIntersection,
    		checkPreviewRadiusAndAngle,
    		updatePreviewCompassCalculation,
    		setPreviewMouseCoordinates,
    		setPreviewColor,
    		compassKeyEvent,
    		stopDraw,
    		openShortcut,
    		checkUserAns
    	});

    	$$self.$inject_state = $$props => {
    		if ('xml' in $$props) $$invalidate(6, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(7, uxml = $$props.uxml);
    		if ('isReview' in $$props) $$invalidate(5, isReview = $$props.isReview);
    		if ('showAns' in $$props) $$invalidate(8, showAns = $$props.showAns);
    		if ('editorState' in $$props) $$invalidate(9, editorState = $$props.editorState);
    		if ('bgImgPath' in $$props) $$invalidate(3, bgImgPath = $$props.bgImgPath);
    		if ('xmlns' in $$props) xmlns = $$props.xmlns;
    		if ('isDrawingPreview' in $$props) isDrawingPreview = $$props.isDrawingPreview;
    		if ('isDrawCompassPreview' in $$props) isDrawCompassPreview = $$props.isDrawCompassPreview;
    		if ('isStoreStart' in $$props) isStoreStart = $$props.isStoreStart;
    		if ('isDrawStop' in $$props) isDrawStop = $$props.isDrawStop;
    		if ('startDrawingByKey' in $$props) startDrawingByKey = $$props.startDrawingByKey;
    		if ('scribble' in $$props) scribble = $$props.scribble;
    		if ('preview_mouseX' in $$props) preview_mouseX = $$props.preview_mouseX;
    		if ('preview_mouseY' in $$props) preview_mouseY = $$props.preview_mouseY;
    		if ('previewMode' in $$props) previewMode = $$props.previewMode;
    		if ('previewColor' in $$props) previewColor = $$props.previewColor;
    		if ('previewThickness' in $$props) previewThickness = $$props.previewThickness;
    		if ('previewScribblePath' in $$props) previewScribblePath = $$props.previewScribblePath;
    		if ('previewScribbleCount' in $$props) previewScribbleCount = $$props.previewScribbleCount;
    		if ('checkCurrentPositionX' in $$props) checkCurrentPositionX = $$props.checkCurrentPositionX;
    		if ('checkCurrentPositionY' in $$props) checkCurrentPositionY = $$props.checkCurrentPositionY;
    		if ('previewUndoCount' in $$props) previewUndoCount = $$props.previewUndoCount;
    		if ('previewUndoList' in $$props) previewUndoList = $$props.previewUndoList;
    		if ('previewRedoList' in $$props) previewRedoList = $$props.previewRedoList;
    		if ('accessibilityPointsPreview' in $$props) accessibilityPointsPreview = $$props.accessibilityPointsPreview;
    		if ('focusPointCountPreview' in $$props) focusPointCountPreview = $$props.focusPointCountPreview;
    		if ('lockFocus' in $$props) lockFocus = $$props.lockFocus;
    		if ('isScribble' in $$props) isScribble = $$props.isScribble;
    		if ('cx' in $$props) cx = $$props.cx;
    		if ('cy' in $$props) cy = $$props.cy;
    		if ('midCircle_cx' in $$props) midCircle_cx = $$props.midCircle_cx;
    		if ('midCircle_cy' in $$props) midCircle_cy = $$props.midCircle_cy;
    		if ('midSmallCircle_cx' in $$props) midSmallCircle_cx = $$props.midSmallCircle_cx;
    		if ('midSmallCircle_cy' in $$props) midSmallCircle_cy = $$props.midSmallCircle_cy;
    		if ('lastCircle_cx' in $$props) lastCircle_cx = $$props.lastCircle_cx;
    		if ('lastCircle_cy' in $$props) lastCircle_cy = $$props.lastCircle_cy;
    		if ('lastSmallCircle_cx' in $$props) lastSmallCircle_cx = $$props.lastSmallCircle_cx;
    		if ('lastSmallCircle_cy' in $$props) lastSmallCircle_cy = $$props.lastSmallCircle_cy;
    		if ('previewCompassRadius' in $$props) $$invalidate(0, previewCompassRadius = $$props.previewCompassRadius);
    		if ('isPreviewCompassMove' in $$props) isPreviewCompassMove = $$props.isPreviewCompassMove;
    		if ('previewCompassAngle' in $$props) $$invalidate(1, previewCompassAngle = $$props.previewCompassAngle);
    		if ('isPreviewRadiusIncrease' in $$props) isPreviewRadiusIncrease = $$props.isPreviewRadiusIncrease;
    		if ('initialPoint' in $$props) initialPoint = $$props.initialPoint;
    		if ('finalPoint' in $$props) finalPoint = $$props.finalPoint;
    		if ('compassAngleDisplacement' in $$props) compassAngleDisplacement = $$props.compassAngleDisplacement;
    		if ('isPreviewRadiusRotate' in $$props) isPreviewRadiusRotate = $$props.isPreviewRadiusRotate;
    		if ('cursorTop' in $$props) cursorTop = $$props.cursorTop;
    		if ('cursorLeft' in $$props) cursorLeft = $$props.cursorLeft;
    		if ('defaultXML' in $$props) defaultXML = $$props.defaultXML;
    		if ('cdata' in $$props) cdata = $$props.cdata;
    		if ('isAnswerCorrect' in $$props) isAnswerCorrect = $$props.isAnswerCorrect;
    		if ('isMarking' in $$props) isMarking = $$props.isMarking;
    		if ('markPoints' in $$props) markPoints = $$props.markPoints;
    		if ('selectedToolsArray' in $$props) selectedToolsArray = $$props.selectedToolsArray;
    		if ('userAnsPath' in $$props) userAnsPath = $$props.userAnsPath;
    		if ('userAnsXML' in $$props) userAnsXML = $$props.userAnsXML;
    		if ('userMarkingPoint' in $$props) userMarkingPoint = $$props.userMarkingPoint;
    		if ('userDrawPath' in $$props) userDrawPath = $$props.userDrawPath;
    		if ('userAnsCorrect' in $$props) userAnsCorrect = $$props.userAnsCorrect;
    		if ('markPointsData' in $$props) markPointsData = $$props.markPointsData;
    		if ('is_mac' in $$props) is_mac = $$props.is_mac;
    		if ('prev_store' in $$props) prev_store = $$props.prev_store;
    		if ('state' in $$props) $$invalidate(2, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		previewCompassRadius,
    		previewCompassAngle,
    		state,
    		bgImgPath,
    		openShortcut,
    		isReview,
    		xml,
    		uxml,
    		showAns,
    		editorState
    	];
    }

    class DrawingPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{
    				xml: 6,
    				uxml: 7,
    				isReview: 5,
    				showAns: 8,
    				editorState: 9
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DrawingPreview",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[6] === undefined && !('xml' in props)) {
    			console_1.warn("<DrawingPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[7] === undefined && !('uxml' in props)) {
    			console_1.warn("<DrawingPreview> was created without expected prop 'uxml'");
    		}

    		if (/*isReview*/ ctx[5] === undefined && !('isReview' in props)) {
    			console_1.warn("<DrawingPreview> was created without expected prop 'isReview'");
    		}

    		if (/*showAns*/ ctx[8] === undefined && !('showAns' in props)) {
    			console_1.warn("<DrawingPreview> was created without expected prop 'showAns'");
    		}

    		if (/*editorState*/ ctx[9] === undefined && !('editorState' in props)) {
    			console_1.warn("<DrawingPreview> was created without expected prop 'editorState'");
    		}
    	}

    	get xml() {
    		throw new Error("<DrawingPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<DrawingPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<DrawingPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<DrawingPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<DrawingPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<DrawingPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<DrawingPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<DrawingPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<DrawingPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<DrawingPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     *  File Name   : main.js
     *  Author      : Ayush Srivastava
     *  Function    : Graph
     *  Version     : 1.0
     *  Packege     : clsSMGRAPH (preview)
     *  Last update : 02-MAR-2021
     */

    const defXMl = `<smxml xmlns="http://www.w3.org/1999/xhtml" type="41" name="Drawing" bgimg="useraccount_000ANv.png" imgAlt="Triangle image" width="600" markPointColor="#00FF00" color="#00BCD4"><div selectedDrawingType="_scribble,_line,_compass"><!--[CDATA[]]--></div><backgroundPoint type="backgroundPoints"><!--[CDATA[]]--></backgroundPoint></smxml>`;

    const app = new DrawingPreview({
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
//# sourceMappingURL=bundle_q41.js.map
