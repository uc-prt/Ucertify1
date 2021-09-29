
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
    class fillJS {
    	constructor(options) {
    		//super();
    		this.userAnsXML = "";
    		this.sInfo = true;
    		this.labBinded = true;
    		this.delPreSpaces = {};
    		this.init();
    		this.iscorrect = '-2';
    		this.previous_droped_item = {};
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
    						if (Object.entries(this.previous_droped_item) && this.previous_droped_item[drop_target]) {
    							this.previous_droped_item[drop_target].setAttribute('draggable','true');
    							this.previous_droped_item[drop_target].setAttribute('aria-disabled','false');
    							this.previous_droped_item[drop_target].classList.remove('ui-draggable-disabled', 'ui-state-disabled');
    						}
    						
    						// Add the diabled features to current droped item
    						let selected = document.querySelector('#' + drag_id);
    						selected.setAttribute('draggable','false');
    						selected.setAttribute('aria-disabled','true');
    						selected.classList.add('ui-draggable-disabled', 'ui-state-disabled');
    						this.previous_droped_item[drop_target] = selected;
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

    		JS$1.listen(document, "click", fillid, (_this, event)=> {
    			if (!this.checkFocus("ks")) {
    				JS$1.selectAll(JS$1.find(fillid, ".copiedclr", 'all'), 'removeClass', "copiedclr");
    			}
    		});

    		// JS.bind(JS.find(fillid, "input"), "keypress", (e)=> {
    		// 	if (e.which == 13) {
    		// 		e.preventDefault();
    		// 		return false;
    		// 	}
    		// });

    		/*
    		if (typeof hotkeys == 'function') {
    			hotkeys.unbind('alt+down,enter,delete,esc','fillintheblank');
    			hotkeys("alt+down,enter,delete,esc",'fillintheblank', (event, handler)=> {
    				switch (handler.key) {
    					case 'alt+down' :
    						activateKs();
    					break;
    					case 'enter' :
    						if ($("#sm_controller").css("display") == "none") {
    							if (checkFocus("dragable")) {
    								copyDraggable();
    							} else if (checkFocus("dropable")) {
    								pasteDraggable();
    							}
    						}
    					break;
    					case 'delete' :
    						if ($("#sm_controller").css("display") == "none") {
    							if (checkFocus("dropable")) {
    								removeDraggable();
    							}
    						}
    					break;
    					case 'esc' :
    						if ($("#sm_controller").css("display") == "none") {
    							if (checkFocus("ks")) {
    								$(fillid).find(".copiedclr").removeClass("copiedclr");
    								count = 0;
    								count_prev = 0;
    								copied_id = "";
    								ks_activated = false;
    								$('.ks').last().focus();
    								$('.ks').last().blur();
    							}	
    						}
    					break;
    				}
    			});
    			hotkeys.setScope('fillintheblank');
    			hotkeys.filter = function(event) {
    				return true;
    			}
    		}
    		*/
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
    						JS$1.setAttr(pElem, {'rel': 'multiple_answers', 'title' : tooltip + '</p>' , 'data-html': 'true'});
    						//$('[rel="multiple_answers"]').tooltip();
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
    		this.updateModule('uxml', this.userAnsXML);

    		if (parseInt(JS$1.select(fillid).getAttribute('manual_grade')) != 1) {
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
    		//console.log({branch,tree,matchedBranch,result});
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
    			
    			pElem.getAttribute("userans", userans);
    		
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
    				console.log(this.result);
    				console.log('userans', userans);
    				console.log('test', JS$1.select(fillid).getAttribute('multi'));
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

    /* helper\ItemHelper.svelte generated by Svelte v3.40.2 */
    const file = "helper\\ItemHelper.svelte";

    function add_css(target) {
    	append_styles(target, "svelte-ri6gyf", ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUhlbHBlci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBOEJZLGdFQUFnRSxBQUFFLENBQUMsQUFDdkUsS0FBSyxDQUFFLElBQUksVUFBVSxDQUNyQixrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQ25ELFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQzNDLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxDQUNuQyxZQUFZLENBQUUsT0FBTyxVQUFVLENBQy9CLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxBQUN2QyxDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkl0ZW1IZWxwZXIuc3ZlbHRlIl19 */");
    }

    // (23:0) {#if reviewMode}
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
    			attr_dev(button0, "class", "btn btn-light correct-ans");
    			add_location(button0, file, 24, 8, 1076);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "mode", "u");
    			attr_dev(button1, "class", "btn btn-light your-ans active");
    			add_location(button1, file, 25, 8, 1214);
    			attr_dev(div, "class", "smControlerBtn btn-group mb-3");
    			attr_dev(div, "role", "group");
    			attr_dev(div, "aria-label", "Answer buttons");
    			add_location(div, file, 23, 4, 982);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:0) {#if reviewMode}",
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
    	let if_block = /*reviewMode*/ ctx[0] && create_if_block(ctx);

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
    			add_location(button0, file, 20, 0, 722);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file, 21, 0, 839);
    			add_location(center, file, 19, 0, 712);
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
    		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 }, add_css);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemHelper",
    			options,
    			id: create_fragment.name
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

    /* src\libs\FillInTheBlanksToolbar.svelte generated by Svelte v3.40.2 */
    const file$1 = "src\\libs\\FillInTheBlanksToolbar.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-1rpbtbi", ".toolbar_container_one.svelte-1rpbtbi{max-height:359px;max-width:641px;margin:0 auto;border:1px solid #91653E;border-width:0 1px 1px 1px;z-index:1;font-size:17px !important}.draggable_area.svelte-1rpbtbi{display:inline-flex;height:24px;width:100%;background-color:#654320}.dots_container.svelte-1rpbtbi{margin:auto;text-align:center}.dots.svelte-1rpbtbi{width:4px;height:4px;border-radius:50%;display:inline-block;background-color:#888}.toolbar_types_area.svelte-1rpbtbi{max-height:35px;display:inline-flex;width:-webkit-fill-available;width:100%;background-color:#F0F0F0}.select_area.svelte-1rpbtbi{width:162px;margin:4px 0}.option_selectbox.svelte-1rpbtbi{width:155px;padding:4px 2px;border:none;margin-left:2px;border:1px solid}.show_text_area.svelte-1rpbtbi{width:605px}.lower_part_toolbar.svelte-1rpbtbi{border:1px solid #91653E;border-width:1px 0}.orange_container.svelte-1rpbtbi{background-color:#FCFCD3}.column_four.svelte-1rpbtbi{background-color:#DDDDDD}.blue_container.svelte-1rpbtbi{background-color:#E6F2FC}.light_purpl_container.svelte-1rpbtbi{background-color:#F0F0F0}.blank_color.svelte-1rpbtbi{background-color:#D7E7DA}.blank_color.svelte-1rpbtbi:hover{outline:none}.font_changer.svelte-1rpbtbi{font-weight:bold;font-size:17px !important}.first_btn.svelte-1rpbtbi,.scnd_btn.svelte-1rpbtbi,.thrd_btn.svelte-1rpbtbi,.fourth_btn.svelte-1rpbtbi,.fifth_btn.svelte-1rpbtbi{text-align:center;width:80px;height:58px;padding:20px;border-right:1px solid #91653E}.first_btn.svelte-1rpbtbi:hover,.scnd_btn.svelte-1rpbtbi:hover,.thrd_btn.svelte-1rpbtbi:hover,.fourth_btn.svelte-1rpbtbi:hover,.fifth_btn.svelte-1rpbtbi:hover{outline:1px solid;outline-offset:-6px}.button_designs.svelte-1rpbtbi,.lower_part_toolbar.svelte-1rpbtbi{display:inline-flex}.scnd_btn.svelte-1rpbtbi,.fourth_btn.svelte-1rpbtbi{border-top:1px solid #91653E;border-bottom:1px solid #91653E}.columns_design.svelte-1rpbtbi{width:80px}.padder_btn.svelte-1rpbtbi{padding-top:2px}.remove_border.svelte-1rpbtbi{border:none}.xvariable.svelte-1rpbtbi{width:20px;margin:auto;height:19px;background:url(../images/toolbar_images.png) -32px -487px}.yvariable.svelte-1rpbtbi{width:22px;margin:auto;height:22px;background:url(../images/toolbar_images.png) -30px -714px}.xfraction.svelte-1rpbtbi{width:21px;margin:auto;height:49px;background:url(../images/toolbar_images.png) -23px -922px;;}.modulus.svelte-1rpbtbi{width:25px;margin:auto;height:30px;background:url(../images/toolbar_images.png) -27px -848px}.padder_less.svelte-1rpbtbi{padding-top:15px}.padder_remover.svelte-1rpbtbi{padding-top:10px}.padder_field.svelte-1rpbtbi{padding-top:12px}.sigma.svelte-1rpbtbi{width:16px;margin:auto;height:48px;background:url(../images/toolbar_images.png) -36px -381px}.h-bar.svelte-1rpbtbi{width:17px;margin:auto;height:34px;background:url(../images/toolbar_images.png) -32px -507px}.x-power-y.svelte-1rpbtbi{width:21px;margin:auto;height:38px;background:url(../images/toolbar_images.png) -1px -899px}.long-division.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -79px;width:45px;height:32px;margin:auto}.square-root-two.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -183px;width:38px;height:39px;margin:auto}.x-times-fraction.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -223px;margin:auto;width:37px;height:50px}.square-root.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -274px;width:36px;height:34px;margin:auto}.brackets.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -309px;width:35px;height:34px;margin:auto}.h-power.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -344px;width:35px;height:36px;margin:auto}.curly-brackets.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -408px;width:33px;margin:auto;height:27px}.xsquare.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -461px;width:31px;height:25px;margin:auto}.integrtion.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -487px;width:30px;height:40px;margin:auto}.opp-recbrackets.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -528px;width:30px;height:27px;margin:auto}.square-brackets.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -556px;width:30px;height:34px;margin:auto}.xsubscript.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -591px;width:30px;height:31px;margin:auto}.dollar.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -623px;width:29px;height:31px;margin:auto}.h-sub.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -655px;margin:auto;width:29px;height:30px}.rec-brackets.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -686px;width:28px;height:31px;margin:auto}.xpower.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -718px;width:28px;height:30px;margin:auto}.bar-block.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -749px;width:26px;height:34px;margin:auto}.infinity.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -784px;width:26px;height:20px;margin:auto}.topbar-arrow.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -1px -805px;width:26px;height:42px;margin:auto}.h-sup.svelte-1rpbtbi{background:url(../images/toolbar_images.png)-1px -848px;width:25px;height:26px;margin:auto}.colon.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -28px -749px;width:24px;height:31px;margin:auto}.not-lesser.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -28px -781px;width:24px;height:23px;margin:auto}.h-sup-sub.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -28px -805px;width:23px;height:36px;margin:auto}.not-greater.svelte-1rpbtbi{background:url(../images/toolbar_images.png) -30px -686px;width:22px;margin:auto;height:27px}.rborder_remover.svelte-1rpbtbi{border-right:0}.dec_widther.svelte-1rpbtbi{width:78px}.bborder_remover.svelte-1rpbtbi{border-bottom:0}.blank_color.svelte-1rpbtbi:hover{outline:0}.bborder_adder.svelte-1rpbtbi{border-bottom:1px solid #91653E}@media(max-width: 556px){.first_btn.svelte-1rpbtbi,.scnd_btn.svelte-1rpbtbi,.thrd_btn.svelte-1rpbtbi,.fourth_btn.svelte-1rpbtbi,.fifth_btn.svelte-1rpbtbi,.columns_design.svelte-1rpbtbi{width:30px}}@media(max-width: 768px){.first_btn.svelte-1rpbtbi,.scnd_btn.svelte-1rpbtbi,.thrd_btn.svelte-1rpbtbi,.fourth_btn.svelte-1rpbtbi,.fifth_btn.svelte-1rpbtbi,.columns_design.svelte-1rpbtbi{width:50px}}@media(max-width: 992px){.first_btn.svelte-1rpbtbi,.scnd_btn.svelte-1rpbtbi,.thrd_btn.svelte-1rpbtbi,.fourth_btn.svelte-1rpbtbi,.fifth_btn.svelte-1rpbtbi,.columns_design.svelte-1rpbtbi{width:80px}}.height_modifier.svelte-1rpbtbi{max-height:290px;overflow-y:scroll}.tborder_remover.svelte-1rpbtbi{border-top:0}.close_toolbar.svelte-1rpbtbi{padding:5px;color:#888;border:none;background-color:#654320}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbEluVGhlQmxhbmtzVG9vbGJhci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBeTNCSSxzQkFBc0IsZUFBQyxDQUFDLEFBQ3BCLFVBQVUsQ0FBRSxLQUFLLENBQ2pCLFNBQVMsQ0FBRSxLQUFLLENBQ2hCLE1BQU0sQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUNkLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDekIsWUFBWSxDQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FDM0IsT0FBTyxDQUFFLENBQUMsQ0FDVixTQUFTLENBQUUsSUFBSSxDQUFDLFVBQVUsQUFDMUIsQ0FBQyxBQUVMLGVBQWUsZUFBQyxDQUFDLEFBQ2IsT0FBTyxDQUFFLFdBQVcsQ0FDcEIsTUFBTSxDQUFFLElBQUksQ0FDWixLQUFLLENBQUUsSUFBSSxDQUNYLGdCQUFnQixDQUFFLE9BQU8sQUFDN0IsQ0FBQyxBQUVELGVBQWUsZUFBQyxDQUFDLEFBQ2IsTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFDLEFBRUQsS0FBSyxlQUFDLENBQUMsQUFDSCxLQUFLLENBQUUsR0FBRyxDQUNWLE1BQU0sQ0FBRSxHQUFHLENBQ1gsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsT0FBTyxDQUFFLFlBQVksQ0FDckIsZ0JBQWdCLENBQUUsSUFBSSxBQUMxQixDQUFDLEFBRUQsbUJBQW1CLGVBQUMsQ0FBQyxBQUNqQixVQUFVLENBQUUsSUFBSSxDQUNoQixPQUFPLENBQUUsV0FBVyxDQUNwQixLQUFLLENBQUUsc0JBQXNCLENBQzdCLEtBQUssQ0FBRSxJQUFJLENBQ1gsZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFDLEFBRUQsWUFBWSxlQUFDLENBQUMsQUFDVixLQUFLLENBQUUsS0FBSyxDQUNaLE1BQU0sQ0FBRSxHQUFHLENBQUMsQ0FBQyxBQUNqQixDQUFDLEFBRUQsaUJBQWlCLGVBQUMsQ0FBQyxBQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FBQyxHQUFHLENBQ2hCLE1BQU0sQ0FBRSxJQUFJLENBQ1osV0FBVyxDQUFFLEdBQUcsQ0FDaEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLEFBQ3JCLENBQUMsQUFFRCxlQUFlLGVBQUMsQ0FBQyxBQUNiLEtBQUssQ0FBRSxLQUFLLEFBQ2hCLENBQUMsQUFFRCxtQkFBbUIsZUFBQyxDQUFDLEFBQ2pCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDekIsWUFBWSxDQUFFLEdBQUcsQ0FBQyxDQUFDLEFBQ3ZCLENBQUMsQUFFRCxpQkFBaUIsZUFBQyxDQUFDLEFBQ2YsZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFDLEFBRUQsWUFBWSxlQUFDLENBQUMsQUFDVixnQkFBZ0IsQ0FBRSxPQUFPLEFBQzdCLENBQUMsQUFFRCxlQUFlLGVBQUMsQ0FBQyxBQUNiLGlCQUFpQixPQUFPLEFBQzVCLENBQUMsQUFFRCxzQkFBc0IsZUFBQyxDQUFDLEFBQ3BCLGdCQUFnQixDQUFFLE9BQU8sQUFDN0IsQ0FBQyxBQUVELFlBQVksZUFBQyxDQUFDLEFBQ1YsZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFDLEFBRUQsMkJBQVksTUFBTSxBQUFDLENBQUMsQUFDaEIsT0FBTyxDQUFFLElBQUksQUFDakIsQ0FBQyxBQUVELGFBQWEsZUFBQyxDQUFDLEFBQ1gsV0FBVyxDQUFFLElBQUksQ0FDakIsU0FBUyxDQUFFLElBQUksQ0FBQyxVQUFVLEFBQzlCLENBQUMsQUFFRCx5QkFBVSxDQUNWLHdCQUFTLENBQ1Qsd0JBQVMsQ0FDVCwwQkFBVyxDQUNYLFVBQVUsZUFBQyxDQUFDLEFBQ1IsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE9BQU8sQ0FBRSxJQUFJLENBQ2IsWUFBWSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUNuQyxDQUFDLEFBRUQseUJBQVUsTUFBTSxDQUNoQix3QkFBUyxNQUFNLENBQ2Ysd0JBQVMsTUFBTSxDQUNmLDBCQUFXLE1BQU0sQ0FDakIseUJBQVUsTUFBTSxBQUFDLENBQUMsQUFDZCxPQUFPLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FDbEIsY0FBYyxDQUFFLElBQUksQUFDeEIsQ0FBQyxBQUVELDhCQUFlLENBQ2YsbUJBQW1CLGVBQUMsQ0FBQyxBQUNqQixPQUFPLENBQUUsV0FBVyxBQUN4QixDQUFDLEFBRUQsd0JBQVMsQ0FDVCxXQUFXLGVBQUMsQ0FBQyxBQUNULFVBQVUsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDN0IsYUFBYSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUNwQyxDQUFDLEFBRUQsZUFBZSxlQUFDLENBQUMsQUFDYixLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFFRCxXQUFXLGVBQUMsQ0FBQyxBQUNULFdBQVcsQ0FBRSxHQUFHLEFBQ3BCLENBQUMsQUFvQkQsY0FBYyxlQUFDLENBQUMsQUFDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBb0JELFVBQVUsZUFBQyxDQUFDLEFBQ1IsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUM5RCxDQUFDLEFBRUQsVUFBVSxlQUFDLENBQUMsQUFDUixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQzlELENBQUMsQUFFRCxVQUFVLGVBQUMsQ0FBQyxBQUNSLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEFBQ2hFLENBQUMsQUFFRCxRQUFRLGVBQUMsQ0FBQyxBQUNOLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFDOUQsQ0FBQyxBQUVELFlBQVksZUFBQyxDQUFDLEFBQ1YsV0FBVyxDQUFFLElBQUksQUFDckIsQ0FBQyxBQUVELGVBQWUsZUFBQyxDQUFDLEFBQ2IsV0FBVyxDQUFFLElBQUksQUFDckIsQ0FBQyxBQUVELGFBQWEsZUFBQyxDQUFDLEFBQ1gsV0FBVyxDQUFFLElBQUksQUFDckIsQ0FBQyxBQUVELE1BQU0sZUFBQyxDQUFDLEFBQ0osS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUM5RCxDQUFDLEFBRUQsTUFBTSxlQUFDLENBQUMsQUFDSixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQzlELENBQUMsQUFTRCxVQUFVLGVBQUMsQ0FBQyxBQUNSLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQUFDN0QsQ0FBQyxBQWNELGNBQWMsZUFBQyxDQUFDLEFBQ1osVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUN4RCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQWFELGdCQUFnQixlQUFDLENBQUMsQUFDZCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsaUJBQWlCLGVBQUMsQ0FBQyxBQUNmLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDekQsTUFBTSxDQUFFLElBQUksQ0FDWixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxZQUFZLGVBQUMsQ0FBQyxBQUNWLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDekQsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxTQUFTLGVBQUMsQ0FBQyxBQUNQLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDekQsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxRQUFRLGVBQUMsQ0FBQyxBQUNOLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDekQsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFPRCxlQUFlLGVBQUMsQ0FBQyxBQUFDLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDdkUsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFPRCxRQUFRLGVBQUMsQ0FBQyxBQUNOLFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDekQsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxXQUFXLGVBQUMsQ0FBQyxBQUNULFVBQVUsQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDekQsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxnQkFBZ0IsZUFBQyxDQUFDLEFBQ2QsVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUN6RCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUNELGdCQUFnQixlQUFDLENBQUMsQUFDZCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsV0FBVyxlQUFDLENBQUMsQUFDVCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsT0FBTyxlQUFDLENBQUMsQUFDTCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsTUFBTSxlQUFDLENBQUMsQUFDSixVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELE1BQU0sQ0FBRSxJQUFJLENBQ1osS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsYUFBYSxlQUFDLENBQUMsQUFDWCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsT0FBTyxlQUFDLENBQUMsQUFDTCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsVUFBVSxlQUFDLENBQUMsQUFDUixVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsU0FBUyxlQUFDLENBQUMsQUFDUCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsYUFBYSxlQUFDLENBQUMsQUFDWCxVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pELEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ0QsTUFBTSxlQUFDLENBQUMsQUFDSixVQUFVLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUN4RCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUNELE1BQU0sZUFBQyxDQUFDLEFBQ0osVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUMxRCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUNELFdBQVcsZUFBQyxDQUFDLEFBQ1QsVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUMxRCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQUNELFVBQVUsZUFBQyxDQUFDLEFBQ1IsVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUMxRCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQU9ELFlBQVksZUFBQyxDQUFDLEFBQ1YsVUFBVSxDQUFFLElBQUksNEJBQTRCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUMxRCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyxBQWVELGdCQUFnQixlQUFDLENBQUMsQUFDZCxZQUFZLENBQUUsQ0FBQyxBQUNuQixDQUFDLEFBRUQsWUFBWSxlQUFDLENBQUMsQUFDVixLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFFRCxnQkFBZ0IsZUFBQyxDQUFDLEFBQ2QsYUFBYSxDQUFFLENBQUMsQUFDcEIsQ0FBQyxBQUVELDJCQUFZLE1BQU0sQUFBQyxDQUFDLEFBQ2hCLE9BQU8sQ0FBRSxDQUFDLEFBQ2QsQ0FBQyxBQUVELGNBQWMsZUFBQyxDQUFDLEFBQ1osYUFBYSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUNwQyxDQUFDLEFBa0JELE1BQU0sQUFBQyxZQUFZLEtBQUssQ0FBQyxBQUFDLENBQUMsQUFDdkIseUJBQVUsQ0FDVix3QkFBUyxDQUNULHdCQUFTLENBQ1QsMEJBQVcsQ0FDWCx5QkFBVSxDQUNWLDhCQUFlLENBQUMsQUFDWixLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFDTCxDQUFDLEFBRUEsTUFBTSxBQUFDLFlBQVksS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUN4Qix5QkFBVSxDQUNWLHdCQUFTLENBQ1Qsd0JBQVMsQ0FDVCwwQkFBVyxDQUNYLHlCQUFVLENBQ1YsZUFBZSxlQUFDLENBQUMsQUFDYixLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFDTCxDQUFDLEFBRUQsTUFBTSxBQUFDLFlBQVksS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUN2Qix5QkFBVSxDQUNWLHdCQUFTLENBQ1Qsd0JBQVMsQ0FDVCwwQkFBVyxDQUNYLHlCQUFVLENBQ1YsZUFBZSxlQUFDLENBQUMsQUFDYixLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFDTCxDQUFDLEFBRUQsZ0JBQWdCLGVBQUMsQ0FBQyxBQUNkLFVBQVUsQ0FBRSxLQUFLLENBQ2pCLFVBQVUsQ0FBRSxNQUFNLEFBQ3RCLENBQUMsQUFFRCxnQkFBZ0IsZUFBQyxDQUFDLEFBQ2QsVUFBVSxDQUFFLENBQUMsQUFDakIsQ0FBQyxBQUVELGNBQWMsZUFBQyxDQUFDLEFBQ1osT0FBTyxDQUFFLEdBQUcsQ0FDWixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osZ0JBQWdCLENBQUUsT0FBTyxBQUM3QixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkZpbGxJblRoZUJsYW5rc1Rvb2xiYXIuc3ZlbHRlIl19 */");
    }

    function create_fragment$1(ctx) {
    	let div255;
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
    	let span4;
    	let i0;
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
    	let span5;
    	let i1;
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
    	let span6;
    	let i2;
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
    	let div11;
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
    	let div13;
    	let t73;
    	let div16;
    	let div15;
    	let t74;
    	let div18;
    	let div17;
    	let t75;
    	let div20;
    	let div19;
    	let t76;
    	let button27;
    	let t78;
    	let button28;
    	let t80;
    	let div22;
    	let div21;
    	let t81;
    	let div24;
    	let div23;
    	let t82;
    	let button29;
    	let t84;
    	let div26;
    	let div25;
    	let t85;
    	let div28;
    	let div27;
    	let t86;
    	let div30;
    	let div29;
    	let t87;
    	let button30;
    	let t89;
    	let div32;
    	let div31;
    	let t90;
    	let div34;
    	let div33;
    	let t91;
    	let div36;
    	let div35;
    	let t92;
    	let div38;
    	let div37;
    	let t93;
    	let div40;
    	let div39;
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
    	let div41;
    	let t111;
    	let button39;
    	let t113;
    	let div44;
    	let div43;
    	let t114;
    	let button40;
    	let t116;
    	let button41;
    	let t118;
    	let button42;
    	let t120;
    	let div58;
    	let div47;
    	let div46;
    	let t121;
    	let div49;
    	let div48;
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
    	let div50;
    	let t135;
    	let button49;
    	let t137;
    	let button50;
    	let t139;
    	let button51;
    	let t141;
    	let div53;
    	let div52;
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
    	let div54;
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
    	let div56;
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
    	let div59;
    	let t193;
    	let div62;
    	let div61;
    	let t194;
    	let button76;
    	let t196;
    	let div64;
    	let div63;
    	let t197;
    	let div66;
    	let div65;
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
    	let div67;
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
    	let div69;
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
    	let div71;
    	let t225;
    	let button89;
    	let t226;
    	let sup0;
    	let t228;
    	let button90;
    	let t229;
    	let sup1;
    	let t231;
    	let button91;
    	let t232;
    	let sup2;
    	let t234;
    	let button92;
    	let t236;
    	let button93;
    	let t238;
    	let button94;
    	let t240;
    	let button95;
    	let t241;
    	let sup3;
    	let t243;
    	let button96;
    	let t244;
    	let sup4;
    	let t246;
    	let button97;
    	let t247;
    	let sup5;
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
    	let div73;
    	let t260;
    	let button103;
    	let t262;
    	let div76;
    	let div75;
    	let t263;
    	let button104;
    	let t264;
    	let sup6;
    	let t266;
    	let button105;
    	let t268;
    	let div86;
    	let div79;
    	let div78;
    	let t269;
    	let div81;
    	let div80;
    	let t270;
    	let div83;
    	let div82;
    	let t271;
    	let div85;
    	let div84;
    	let t272;
    	let button106;
    	let t274;
    	let button107;
    	let t276;
    	let button108;
    	let t278;
    	let button109;
    	let t279;
    	let sup7;
    	let t281;
    	let button110;
    	let t282;
    	let sup8;
    	let t284;
    	let button111;
    	let t285;
    	let sup9;
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
    	let div88;
    	let t346;
    	let div91;
    	let div90;
    	let t347;
    	let button141;
    	let t349;
    	let button142;
    	let t351;
    	let div93;
    	let div92;
    	let t352;
    	let div99;
    	let div96;
    	let div95;
    	let t353;
    	let div98;
    	let div97;
    	let t354;
    	let button143;
    	let t356;
    	let button144;
    	let t358;
    	let button145;
    	let t360;
    	let div108;
    	let div101;
    	let div100;
    	let t361;
    	let div103;
    	let div102;
    	let t362;
    	let button146;
    	let t364;
    	let div105;
    	let div104;
    	let t365;
    	let div107;
    	let div106;
    	let t366;
    	let div117;
    	let div110;
    	let div109;
    	let t367;
    	let div112;
    	let div111;
    	let t368;
    	let div114;
    	let div113;
    	let t369;
    	let div116;
    	let div115;
    	let t370;
    	let button147;
    	let t371;
    	let div150;
    	let div123;
    	let div120;
    	let div119;
    	let t372;
    	let div122;
    	let div121;
    	let t373;
    	let button148;
    	let t375;
    	let button149;
    	let t377;
    	let button150;
    	let t378;
    	let div131;
    	let div125;
    	let div124;
    	let t379;
    	let div127;
    	let div126;
    	let t380;
    	let button151;
    	let t382;
    	let div129;
    	let div128;
    	let t383;
    	let div130;
    	let t384;
    	let div139;
    	let div133;
    	let div132;
    	let t385;
    	let div135;
    	let div134;
    	let t386;
    	let button152;
    	let t388;
    	let div137;
    	let div136;
    	let t389;
    	let div138;
    	let t390;
    	let div149;
    	let div141;
    	let div140;
    	let t391;
    	let div143;
    	let div142;
    	let t392;
    	let div145;
    	let div144;
    	let t393;
    	let div147;
    	let div146;
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
    	let div151;
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
    	let div155;
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
    	let div161;
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
    	let div164;
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
    	let div170;
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
    	let div173;
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
    	let div176;
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
    	let div179;
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
    	let t502;
    	let sup10;
    	let t504;
    	let button204;
    	let t505;
    	let sup11;
    	let t507;
    	let button205;
    	let t508;
    	let sup12;
    	let t510;
    	let button206;
    	let t511;
    	let button207;
    	let t512;
    	let div186;
    	let button208;
    	let t513;
    	let sup13;
    	let t515;
    	let button209;
    	let t516;
    	let sup14;
    	let t518;
    	let button210;
    	let t519;
    	let sup15;
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
    	let div195;
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
    	let div214;
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
    	let div217;
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
    	let div220;
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
    	let div224;
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
    	let div227;
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
    	let div230;
    	let t702;
    	let button328;
    	let t703;
    	let button329;
    	let t704;
    	let button330;
    	let t705;
    	let div235;
    	let div234;
    	let div233;
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
    	let div237;
    	let t712;
    	let button335;
    	let t714;
    	let div240;
    	let div239;
    	let t715;
    	let button336;
    	let t716;
    	let button337;
    	let t717;
    	let div244;
    	let div243;
    	let div242;
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
    	let div245;
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
    	let div248;
    	let t732;
    	let button346;
    	let t734;
    	let div251;
    	let div250;
    	let t735;
    	let button347;
    	let t736;
    	let button348;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div255 = element("div");
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
    			option8.textContent = `${l.Mis}c`;
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
    			span4 = element("span");
    			i0 = element("i");
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
    			span5 = element("span");
    			i1 = element("i");
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
    			span6 = element("span");
    			i2 = element("i");
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
    			div11 = element("div");
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
    			div13 = element("div");
    			t73 = space();
    			div16 = element("div");
    			div15 = element("div");
    			t74 = space();
    			div18 = element("div");
    			div17 = element("div");
    			t75 = space();
    			div20 = element("div");
    			div19 = element("div");
    			t76 = space();
    			button27 = element("button");
    			button27.textContent = "<";
    			t78 = space();
    			button28 = element("button");
    			button28.textContent = "π";
    			t80 = space();
    			div22 = element("div");
    			div21 = element("div");
    			t81 = space();
    			div24 = element("div");
    			div23 = element("div");
    			t82 = space();
    			button29 = element("button");
    			button29.textContent = ">";
    			t84 = space();
    			div26 = element("div");
    			div25 = element("div");
    			t85 = space();
    			div28 = element("div");
    			div27 = element("div");
    			t86 = space();
    			div30 = element("div");
    			div29 = element("div");
    			t87 = space();
    			button30 = element("button");
    			button30.textContent = "±";
    			t89 = space();
    			div32 = element("div");
    			div31 = element("div");
    			t90 = space();
    			div34 = element("div");
    			div33 = element("div");
    			t91 = space();
    			div36 = element("div");
    			div35 = element("div");
    			t92 = space();
    			div38 = element("div");
    			div37 = element("div");
    			t93 = space();
    			div40 = element("div");
    			div39 = element("div");
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
    			div41 = element("div");
    			t111 = space();
    			button39 = element("button");
    			button39.textContent = "Δ";
    			t113 = space();
    			div44 = element("div");
    			div43 = element("div");
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
    			div46 = element("div");
    			t121 = space();
    			div49 = element("div");
    			div48 = element("div");
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
    			div50 = element("div");
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
    			div52 = element("div");
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
    			div54 = element("div");
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
    			div56 = element("div");
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
    			div59 = element("div");
    			t193 = space();
    			div62 = element("div");
    			div61 = element("div");
    			t194 = space();
    			button76 = element("button");
    			button76.textContent = "±";
    			t196 = space();
    			div64 = element("div");
    			div63 = element("div");
    			t197 = space();
    			div66 = element("div");
    			div65 = element("div");
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
    			div67 = element("div");
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
    			div69 = element("div");
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
    			div71 = element("div");
    			t225 = space();
    			button89 = element("button");
    			t226 = text("sec");
    			sup0 = element("sup");
    			sup0.textContent = "-1";
    			t228 = space();
    			button90 = element("button");
    			t229 = text("csc");
    			sup1 = element("sup");
    			sup1.textContent = "-1";
    			t231 = space();
    			button91 = element("button");
    			t232 = text("cot");
    			sup2 = element("sup");
    			sup2.textContent = "-1";
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
    			t241 = text("sec");
    			sup3 = element("sup");
    			sup3.textContent = "-1";
    			t243 = space();
    			button96 = element("button");
    			t244 = text("csc");
    			sup4 = element("sup");
    			sup4.textContent = "-1";
    			t246 = space();
    			button97 = element("button");
    			t247 = text("cot");
    			sup5 = element("sup");
    			sup5.textContent = "-1";
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
    			div73 = element("div");
    			t260 = space();
    			button103 = element("button");
    			button103.textContent = "→";
    			t262 = space();
    			div76 = element("div");
    			div75 = element("div");
    			t263 = space();
    			button104 = element("button");
    			t264 = text("g mol");
    			sup6 = element("sup");
    			sup6.textContent = "-1";
    			t266 = space();
    			button105 = element("button");
    			button105.textContent = "∂";
    			t268 = space();
    			div86 = element("div");
    			div79 = element("div");
    			div78 = element("div");
    			t269 = space();
    			div81 = element("div");
    			div80 = element("div");
    			t270 = space();
    			div83 = element("div");
    			div82 = element("div");
    			t271 = space();
    			div85 = element("div");
    			div84 = element("div");
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
    			t279 = text("sin");
    			sup7 = element("sup");
    			sup7.textContent = "-1";
    			t281 = space();
    			button110 = element("button");
    			t282 = text("cos");
    			sup8 = element("sup");
    			sup8.textContent = "-1";
    			t284 = space();
    			button111 = element("button");
    			t285 = text("tan");
    			sup9 = element("sup");
    			sup9.textContent = "-1";
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
    			div88 = element("div");
    			t346 = space();
    			div91 = element("div");
    			div90 = element("div");
    			t347 = space();
    			button141 = element("button");
    			button141.textContent = "<";
    			t349 = space();
    			button142 = element("button");
    			button142.textContent = "%";
    			t351 = space();
    			div93 = element("div");
    			div92 = element("div");
    			t352 = space();
    			div99 = element("div");
    			div96 = element("div");
    			div95 = element("div");
    			t353 = space();
    			div98 = element("div");
    			div97 = element("div");
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
    			div100 = element("div");
    			t361 = space();
    			div103 = element("div");
    			div102 = element("div");
    			t362 = space();
    			button146 = element("button");
    			button146.textContent = "±";
    			t364 = space();
    			div105 = element("div");
    			div104 = element("div");
    			t365 = space();
    			div107 = element("div");
    			div106 = element("div");
    			t366 = space();
    			div117 = element("div");
    			div110 = element("div");
    			div109 = element("div");
    			t367 = space();
    			div112 = element("div");
    			div111 = element("div");
    			t368 = space();
    			div114 = element("div");
    			div113 = element("div");
    			t369 = space();
    			div116 = element("div");
    			div115 = element("div");
    			t370 = space();
    			button147 = element("button");
    			t371 = space();
    			div150 = element("div");
    			div123 = element("div");
    			div120 = element("div");
    			div119 = element("div");
    			t372 = space();
    			div122 = element("div");
    			div121 = element("div");
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
    			div124 = element("div");
    			t379 = space();
    			div127 = element("div");
    			div126 = element("div");
    			t380 = space();
    			button151 = element("button");
    			button151.textContent = ">";
    			t382 = space();
    			div129 = element("div");
    			div128 = element("div");
    			t383 = space();
    			div130 = element("div");
    			t384 = space();
    			div139 = element("div");
    			div133 = element("div");
    			div132 = element("div");
    			t385 = space();
    			div135 = element("div");
    			div134 = element("div");
    			t386 = space();
    			button152 = element("button");
    			button152.textContent = "±";
    			t388 = space();
    			div137 = element("div");
    			div136 = element("div");
    			t389 = space();
    			div138 = element("div");
    			t390 = space();
    			div149 = element("div");
    			div141 = element("div");
    			div140 = element("div");
    			t391 = space();
    			div143 = element("div");
    			div142 = element("div");
    			t392 = space();
    			div145 = element("div");
    			div144 = element("div");
    			t393 = space();
    			div147 = element("div");
    			div146 = element("div");
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
    			div151 = element("div");
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
    			div155 = element("div");
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
    			div161 = element("div");
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
    			div164 = element("div");
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
    			div170 = element("div");
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
    			div173 = element("div");
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
    			div176 = element("div");
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
    			div179 = element("div");
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
    			t502 = text("sin");
    			sup10 = element("sup");
    			sup10.textContent = "-1";
    			t504 = space();
    			button204 = element("button");
    			t505 = text("cos");
    			sup11 = element("sup");
    			sup11.textContent = "-1";
    			t507 = space();
    			button205 = element("button");
    			t508 = text("tan");
    			sup12 = element("sup");
    			sup12.textContent = "-1";
    			t510 = space();
    			button206 = element("button");
    			t511 = space();
    			button207 = element("button");
    			t512 = space();
    			div186 = element("div");
    			button208 = element("button");
    			t513 = text("sec");
    			sup13 = element("sup");
    			sup13.textContent = "-1";
    			t515 = space();
    			button209 = element("button");
    			t516 = text("csc");
    			sup14 = element("sup");
    			sup14.textContent = "-1";
    			t518 = space();
    			button210 = element("button");
    			t519 = text("cot");
    			sup15 = element("sup");
    			sup15.textContent = "-1";
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
    			div195 = element("div");
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
    			div214 = element("div");
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
    			div217 = element("div");
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
    			div220 = element("div");
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
    			div224 = element("div");
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
    			div227 = element("div");
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
    			div230 = element("div");
    			t702 = space();
    			button328 = element("button");
    			t703 = space();
    			button329 = element("button");
    			t704 = space();
    			button330 = element("button");
    			t705 = space();
    			div235 = element("div");
    			div234 = element("div");
    			div233 = element("div");
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
    			div237 = element("div");
    			t712 = space();
    			button335 = element("button");
    			button335.textContent = "→";
    			t714 = space();
    			div240 = element("div");
    			div239 = element("div");
    			t715 = space();
    			button336 = element("button");
    			t716 = space();
    			button337 = element("button");
    			t717 = space();
    			div244 = element("div");
    			div243 = element("div");
    			div242 = element("div");
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
    			div245 = element("div");
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
    			div248 = element("div");
    			t732 = space();
    			button346 = element("button");
    			button346.textContent = "↔";
    			t734 = space();
    			div251 = element("div");
    			div250 = element("div");
    			t735 = space();
    			button347 = element("button");
    			t736 = space();
    			button348 = element("button");
    			attr_dev(span0, "class", "dots svelte-1rpbtbi");
    			add_location(span0, file$1, 94, 16, 3153);
    			attr_dev(span1, "class", "dots svelte-1rpbtbi");
    			add_location(span1, file$1, 95, 16, 3197);
    			attr_dev(span2, "class", "dots svelte-1rpbtbi");
    			add_location(span2, file$1, 96, 16, 3241);
    			attr_dev(span3, "class", "dots svelte-1rpbtbi");
    			add_location(span3, file$1, 97, 16, 3285);
    			attr_dev(div0, "class", "dots_container svelte-1rpbtbi");
    			add_location(div0, file$1, 93, 12, 3107);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "icomoon-24px-incorrect-2 close_toolbar svelte-1rpbtbi");
    			add_location(button0, file$1, 99, 16, 3349);
    			attr_dev(div1, "class", "draggable_area svelte-1rpbtbi");
    			add_location(div1, file$1, 92, 8, 3041);
    			attr_dev(div2, "class", "upper_part_toolbar");
    			add_location(div2, file$1, 91, 4, 2999);
    			option0.__value = "1";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 105, 16, 3628);
    			option1.__value = "2";
    			option1.value = option1.__value;
    			option1.selected = "selected";
    			add_location(option1, file$1, 106, 16, 3687);
    			option2.__value = "3";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 107, 16, 3761);
    			option3.__value = "4";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 108, 16, 3820);
    			option4.__value = "5";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 109, 16, 3869);
    			option5.__value = "6";
    			option5.value = option5.__value;
    			add_location(option5, file$1, 110, 16, 3919);
    			option6.__value = "7";
    			option6.value = option6.__value;
    			add_location(option6, file$1, 111, 16, 3971);
    			option7.__value = "8";
    			option7.value = option7.__value;
    			add_location(option7, file$1, 112, 16, 4023);
    			option8.__value = "9";
    			option8.value = option8.__value;
    			add_location(option8, file$1, 113, 16, 4075);
    			option9.__value = "10";
    			option9.value = option9.__value;
    			add_location(option9, file$1, 114, 16, 4128);
    			option10.__value = "11";
    			option10.value = option10.__value;
    			add_location(option10, file$1, 115, 16, 4186);
    			option11.__value = "12";
    			option11.value = option11.__value;
    			add_location(option11, file$1, 116, 16, 4238);
    			option12.__value = "13";
    			option12.value = option12.__value;
    			add_location(option12, file$1, 117, 16, 4290);
    			option13.__value = "14";
    			option13.value = option13.__value;
    			add_location(option13, file$1, 118, 16, 4348);
    			option14.__value = "15";
    			option14.value = option14.__value;
    			add_location(option14, file$1, 119, 16, 4401);
    			attr_dev(select, "name", "basic_select");
    			attr_dev(select, "id", "selectbox");
    			attr_dev(select, "class", "option_selectbox svelte-1rpbtbi");
    			add_location(select, file$1, 104, 12, 3542);
    			attr_dev(div3, "class", "select_area svelte-1rpbtbi");
    			add_location(div3, file$1, 103, 8, 3503);
    			attr_dev(div4, "class", "show_text_area svelte-1rpbtbi");
    			add_location(div4, file$1, 122, 8, 4486);
    			attr_dev(div5, "class", "toolbar_types_area svelte-1rpbtbi");
    			add_location(div5, file$1, 102, 4, 3461);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "first_btn bborder_remover orange_container svelte-1rpbtbi");
    			add_location(button1, file$1, 127, 20, 4706);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "scnd_btn orange_container svelte-1rpbtbi");
    			add_location(button2, file$1, 128, 20, 4847);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "thrd_btn bborder_remover orange_container svelte-1rpbtbi");
    			add_location(button3, file$1, 129, 20, 4971);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "fourth_btn orange_container svelte-1rpbtbi");
    			add_location(button4, file$1, 130, 20, 5111);
    			attr_dev(i0, "class", "icomoon-arrow-left");
    			add_location(i0, file$1, 132, 26, 5391);
    			add_location(span4, file$1, 132, 20, 5385);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "fifth_btn bborder_remover light_purpl_container svelte-1rpbtbi");
    			add_location(button5, file$1, 131, 20, 5237);
    			attr_dev(div6, "class", "column_one columns_design svelte-1rpbtbi");
    			add_location(div6, file$1, 126, 12, 4645);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "first_btn bborder_remover orange_container svelte-1rpbtbi");
    			add_location(button6, file$1, 136, 20, 5554);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "scnd_btn orange_container svelte-1rpbtbi");
    			add_location(button7, file$1, 137, 20, 5695);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "thrd_btn bborder_remover orange_container svelte-1rpbtbi");
    			add_location(button8, file$1, 138, 20, 5819);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "fourth_btn orange_container svelte-1rpbtbi");
    			add_location(button9, file$1, 139, 20, 5959);
    			attr_dev(i1, "class", "icomoon-arrow-right-2");
    			add_location(i1, file$1, 141, 26, 6235);
    			add_location(span5, file$1, 141, 20, 6229);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "fifth_btn bborder_remover light_purpl_container svelte-1rpbtbi");
    			add_location(button10, file$1, 140, 20, 6082);
    			attr_dev(div7, "class", "column_two columns_design svelte-1rpbtbi");
    			add_location(div7, file$1, 135, 12, 5493);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "first_btn bborder_remover orange_container svelte-1rpbtbi");
    			add_location(button11, file$1, 145, 20, 6403);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "scnd_btn orange_container svelte-1rpbtbi");
    			add_location(button12, file$1, 146, 20, 6543);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "thrd_btn bborder_remover orange_container svelte-1rpbtbi");
    			add_location(button13, file$1, 147, 20, 6667);
    			attr_dev(button14, "type", "button");
    			attr_dev(button14, "class", "fourth_btn orange_container svelte-1rpbtbi");
    			add_location(button14, file$1, 148, 20, 6807);
    			attr_dev(i2, "class", " icomoon-backspace-2");
    			add_location(i2, file$1, 150, 26, 7083);
    			add_location(span6, file$1, 150, 20, 7077);
    			attr_dev(button15, "type", "button");
    			attr_dev(button15, "class", "fifth_btn bborder_remover light_purpl_container svelte-1rpbtbi");
    			add_location(button15, file$1, 149, 20, 6930);
    			attr_dev(div8, "class", "column_three columns_design svelte-1rpbtbi");
    			add_location(div8, file$1, 144, 12, 6340);
    			attr_dev(button16, "type", "button");
    			attr_dev(button16, "class", "first_btn bborder_remover hovr_btn svelte-1rpbtbi");
    			add_location(button16, file$1, 154, 20, 7249);
    			attr_dev(button17, "type", "button");
    			attr_dev(button17, "class", "scnd_btn hovr_btn svelte-1rpbtbi");
    			add_location(button17, file$1, 155, 20, 7388);
    			attr_dev(button18, "type", "button");
    			attr_dev(button18, "class", "thrd_btn bborder_remover hovr_btn svelte-1rpbtbi");
    			add_location(button18, file$1, 156, 20, 7507);
    			attr_dev(button19, "type", "button");
    			attr_dev(button19, "class", "fourth_btn hovr_btn svelte-1rpbtbi");
    			add_location(button19, file$1, 157, 20, 7635);
    			attr_dev(button20, "type", "button");
    			attr_dev(button20, "class", "fifth_btn bborder_remover hovr_btn svelte-1rpbtbi");
    			add_location(button20, file$1, 158, 20, 7749);
    			attr_dev(div9, "class", "column_four columns_design svelte-1rpbtbi");
    			add_location(div9, file$1, 153, 12, 7187);
    			attr_dev(div10, "class", "btn-group button_designs font_changer svelte-1rpbtbi");
    			add_location(div10, file$1, 125, 8, 4580);
    			attr_dev(div11, "class", "xvariable svelte-1rpbtbi");
    			add_location(div11, file$1, 164, 20, 8205);
    			attr_dev(div12, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div12, file$1, 163, 16, 8080);
    			attr_dev(button21, "type", "button");
    			attr_dev(button21, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button21, file$1, 166, 20, 8280);
    			attr_dev(button22, "type", "button");
    			attr_dev(button22, "class", "thrd_btn bborder_remover dec_widther bborder_adder blue_container svelte-1rpbtbi");
    			add_location(button22, file$1, 167, 20, 8410);
    			attr_dev(button23, "type", "button");
    			attr_dev(button23, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button23, file$1, 168, 20, 8587);
    			attr_dev(button24, "type", "button");
    			attr_dev(button24, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button24, file$1, 169, 20, 8740);
    			attr_dev(button25, "type", "button");
    			attr_dev(button25, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button25, file$1, 170, 20, 8881);
    			attr_dev(button26, "type", "button");
    			attr_dev(button26, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button26, file$1, 171, 20, 9034);
    			attr_dev(div13, "class", "not-lesser svelte-1rpbtbi");
    			add_location(div13, file$1, 173, 20, 9308);
    			attr_dev(div14, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div14, file$1, 172, 16, 9177);
    			attr_dev(div15, "class", "rec-brackets svelte-1rpbtbi");
    			add_location(div15, file$1, 176, 20, 9504);
    			attr_dev(div16, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(div16, file$1, 175, 16, 9380);
    			attr_dev(div17, "class", "xvariable svelte-1rpbtbi");
    			add_location(div17, file$1, 179, 20, 9698);
    			attr_dev(div18, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div18, file$1, 178, 16, 9578);
    			attr_dev(div19, "class", "xfraction svelte-1rpbtbi");
    			add_location(div19, file$1, 182, 20, 9883);
    			attr_dev(div20, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1rpbtbi");
    			add_location(div20, file$1, 181, 16, 9769);
    			attr_dev(button27, "type", "button");
    			attr_dev(button27, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button27, file$1, 184, 20, 9958);
    			attr_dev(button28, "type", "button");
    			attr_dev(button28, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button28, file$1, 185, 20, 10109);
    			attr_dev(div21, "class", "yvariable svelte-1rpbtbi");
    			add_location(div21, file$1, 187, 20, 10362);
    			attr_dev(div22, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div22, file$1, 186, 16, 10242);
    			attr_dev(div23, "class", "x-times-fraction svelte-1rpbtbi");
    			add_location(div23, file$1, 190, 20, 10547);
    			attr_dev(div24, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1rpbtbi");
    			add_location(div24, file$1, 189, 16, 10433);
    			attr_dev(button29, "type", "button");
    			attr_dev(button29, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button29, file$1, 192, 20, 10629);
    			attr_dev(div25, "class", "infinity svelte-1rpbtbi");
    			add_location(div25, file$1, 194, 20, 10883);
    			attr_dev(div26, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(div26, file$1, 193, 16, 10773);
    			attr_dev(div27, "class", "xsquare svelte-1rpbtbi");
    			add_location(div27, file$1, 197, 20, 11095);
    			attr_dev(div28, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div28, file$1, 196, 16, 10953);
    			attr_dev(div29, "class", "xpower svelte-1rpbtbi");
    			add_location(div29, file$1, 200, 20, 11288);
    			attr_dev(div30, "class", "scnd_btn dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div30, file$1, 199, 16, 11164);
    			attr_dev(button30, "type", "button");
    			attr_dev(button30, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button30, file$1, 202, 20, 11360);
    			attr_dev(div31, "class", "brackets svelte-1rpbtbi");
    			add_location(div31, file$1, 204, 20, 11633);
    			attr_dev(div32, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(div32, file$1, 203, 16, 11509);
    			attr_dev(div33, "class", "square-root svelte-1rpbtbi");
    			add_location(div33, file$1, 207, 20, 11828);
    			attr_dev(div34, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div34, file$1, 206, 16, 11703);
    			attr_dev(div35, "class", "square-root-two svelte-1rpbtbi");
    			add_location(div35, file$1, 210, 20, 12032);
    			attr_dev(div36, "class", "fourth_btn dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div36, file$1, 209, 16, 11901);
    			attr_dev(div37, "class", "modulus svelte-1rpbtbi");
    			add_location(div37, file$1, 213, 20, 12229);
    			attr_dev(div38, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div38, file$1, 212, 16, 12109);
    			attr_dev(div39, "class", "square-brackets svelte-1rpbtbi");
    			add_location(div39, file$1, 216, 20, 12422);
    			attr_dev(div40, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(div40, file$1, 215, 16, 12298);
    			attr_dev(button31, "type", "button");
    			attr_dev(button31, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button31, file$1, 218, 20, 12503);
    			attr_dev(button32, "type", "button");
    			attr_dev(button32, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button32, file$1, 219, 20, 12650);
    			attr_dev(button33, "type", "button");
    			attr_dev(button33, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button33, file$1, 220, 20, 12785);
    			attr_dev(button34, "type", "button");
    			attr_dev(button34, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button34, file$1, 221, 20, 12949);
    			attr_dev(button35, "type", "button");
    			attr_dev(button35, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button35, file$1, 222, 20, 13094);
    			attr_dev(button36, "type", "button");
    			attr_dev(button36, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button36, file$1, 223, 20, 13254);
    			attr_dev(button37, "type", "button");
    			attr_dev(button37, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button37, file$1, 224, 20, 13399);
    			attr_dev(button38, "type", "button");
    			attr_dev(button38, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button38, file$1, 225, 20, 13562);
    			attr_dev(div41, "class", "integrtion svelte-1rpbtbi");
    			add_location(div41, file$1, 227, 20, 13845);
    			attr_dev(div42, "class", "first_btn bborder_remover dec_widther padder_remover blue_container svelte-1rpbtbi");
    			add_location(div42, file$1, 226, 16, 13693);
    			attr_dev(button39, "type", "button");
    			attr_dev(button39, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button39, file$1, 229, 20, 13921);
    			attr_dev(div43, "class", "sigma svelte-1rpbtbi");
    			add_location(div43, file$1, 231, 20, 14212);
    			attr_dev(div44, "class", "first_btn bborder_remover dec_widther blue_container padder_btn svelte-1rpbtbi");
    			add_location(div44, file$1, 230, 16, 14064);
    			attr_dev(button40, "type", "button");
    			attr_dev(button40, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button40, file$1, 233, 20, 14283);
    			attr_dev(button41, "type", "button");
    			attr_dev(button41, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button41, file$1, 234, 20, 14442);
    			attr_dev(button42, "type", "button");
    			attr_dev(button42, "class", "scnd_btn dec_widther bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button42, file$1, 235, 20, 14594);
    			attr_dev(div45, "class", "column_five dec_widther blue_container columns_design svelte-1rpbtbi");
    			add_location(div45, file$1, 162, 12, 7995);
    			attr_dev(div46, "class", "yvariable svelte-1rpbtbi");
    			add_location(div46, file$1, 239, 20, 14988);
    			attr_dev(div47, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div47, file$1, 238, 16, 14863);
    			attr_dev(div48, "class", "x-times-fraction svelte-1rpbtbi");
    			add_location(div48, file$1, 242, 20, 15173);
    			attr_dev(div49, "class", "scnd_btn dec_widther blue_container padder_btn svelte-1rpbtbi");
    			add_location(div49, file$1, 241, 16, 15059);
    			attr_dev(button43, "type", "button");
    			attr_dev(button43, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button43, file$1, 244, 20, 15255);
    			attr_dev(button44, "type", "button");
    			attr_dev(button44, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button44, file$1, 245, 20, 15403);
    			attr_dev(button45, "type", "button");
    			attr_dev(button45, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button45, file$1, 246, 20, 15551);
    			attr_dev(button46, "type", "button");
    			attr_dev(button46, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button46, file$1, 247, 20, 15703);
    			attr_dev(button47, "type", "button");
    			attr_dev(button47, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button47, file$1, 248, 20, 15839);
    			attr_dev(button48, "type", "button");
    			attr_dev(button48, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button48, file$1, 249, 20, 15990);
    			attr_dev(div50, "class", "not-greater svelte-1rpbtbi");
    			add_location(div50, file$1, 251, 20, 16254);
    			attr_dev(div51, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div51, file$1, 250, 16, 16124);
    			attr_dev(button49, "type", "button");
    			attr_dev(button49, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button49, file$1, 253, 20, 16331);
    			attr_dev(button50, "type", "button");
    			attr_dev(button50, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button50, file$1, 254, 20, 16473);
    			attr_dev(button51, "type", "button");
    			attr_dev(button51, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button51, file$1, 255, 20, 16621);
    			attr_dev(div52, "class", "not-lesser svelte-1rpbtbi");
    			add_location(div52, file$1, 257, 20, 16886);
    			attr_dev(div53, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div53, file$1, 256, 16, 16755);
    			attr_dev(button52, "type", "button");
    			attr_dev(button52, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button52, file$1, 259, 20, 16962);
    			attr_dev(button53, "type", "button");
    			attr_dev(button53, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button53, file$1, 260, 20, 17107);
    			attr_dev(button54, "type", "button");
    			attr_dev(button54, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button54, file$1, 261, 20, 17268);
    			attr_dev(button55, "type", "button");
    			attr_dev(button55, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button55, file$1, 262, 20, 17420);
    			attr_dev(div54, "class", "bar-block svelte-1rpbtbi");
    			add_location(div54, file$1, 264, 20, 17714);
    			attr_dev(div55, "class", "fourth_btn dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div55, file$1, 263, 16, 17579);
    			attr_dev(button56, "type", "button");
    			attr_dev(button56, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button56, file$1, 266, 20, 17789);
    			attr_dev(button57, "type", "button");
    			attr_dev(button57, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button57, file$1, 267, 20, 17950);
    			attr_dev(button58, "type", "button");
    			attr_dev(button58, "class", "thrd_btn bborder_remover dec_widther blue_container bborder_adder svelte-1rpbtbi");
    			add_location(button58, file$1, 268, 20, 18104);
    			attr_dev(button59, "type", "button");
    			attr_dev(button59, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button59, file$1, 269, 20, 18279);
    			attr_dev(div56, "class", "topbar-arrow svelte-1rpbtbi");
    			add_location(div56, file$1, 271, 20, 18578);
    			attr_dev(div57, "class", "fourth_btn dec_widther padder_remover blue_container svelte-1rpbtbi");
    			add_location(div57, file$1, 270, 16, 18434);
    			attr_dev(button60, "type", "button");
    			attr_dev(button60, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button60, file$1, 273, 20, 18656);
    			attr_dev(button61, "type", "button");
    			attr_dev(button61, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button61, file$1, 274, 20, 18819);
    			attr_dev(button62, "type", "button");
    			attr_dev(button62, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button62, file$1, 275, 20, 18957);
    			attr_dev(button63, "type", "button");
    			attr_dev(button63, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button63, file$1, 276, 20, 19123);
    			attr_dev(button64, "type", "button");
    			attr_dev(button64, "class", "first_btn bborder_remover dec_widther padder_remover blue_container svelte-1rpbtbi");
    			add_location(button64, file$1, 277, 20, 19267);
    			attr_dev(button65, "type", "button");
    			attr_dev(button65, "class", "scnd_btn dec_widther blue_container blue_container padder_less svelte-1rpbtbi");
    			add_location(button65, file$1, 278, 20, 19446);
    			attr_dev(button66, "type", "button");
    			attr_dev(button66, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button66, file$1, 279, 20, 19620);
    			attr_dev(button67, "type", "button");
    			attr_dev(button67, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button67, file$1, 280, 20, 19776);
    			attr_dev(button68, "type", "button");
    			attr_dev(button68, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button68, file$1, 281, 20, 19925);
    			attr_dev(button69, "type", "button");
    			attr_dev(button69, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button69, file$1, 282, 20, 20078);
    			attr_dev(button70, "type", "button");
    			attr_dev(button70, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button70, file$1, 283, 20, 20223);
    			attr_dev(button71, "type", "button");
    			attr_dev(button71, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button71, file$1, 284, 20, 20387);
    			attr_dev(button72, "type", "button");
    			attr_dev(button72, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button72, file$1, 285, 20, 20536);
    			attr_dev(button73, "type", "button");
    			attr_dev(button73, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button73, file$1, 286, 20, 20694);
    			attr_dev(button74, "type", "button");
    			attr_dev(button74, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button74, file$1, 287, 20, 20837);
    			attr_dev(button75, "type", "button");
    			attr_dev(button75, "class", "scnd_btn dec_widther bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button75, file$1, 288, 20, 20999);
    			attr_dev(div58, "class", "column_six dec_widther blue_container columns_design svelte-1rpbtbi");
    			add_location(div58, file$1, 237, 12, 14779);
    			attr_dev(div59, "class", "xsquare svelte-1rpbtbi");
    			add_location(div59, file$1, 292, 20, 21400);
    			attr_dev(div60, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div60, file$1, 291, 16, 21258);
    			attr_dev(div61, "class", "xpower svelte-1rpbtbi");
    			add_location(div61, file$1, 295, 20, 21596);
    			attr_dev(div62, "class", "scnd_btn dec_widther blue_container padder_remover svelte-1rpbtbi");
    			add_location(div62, file$1, 294, 16, 21469);
    			attr_dev(button76, "type", "button");
    			attr_dev(button76, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button76, file$1, 297, 20, 21668);
    			attr_dev(div63, "class", "colon svelte-1rpbtbi");
    			add_location(div63, file$1, 299, 20, 21934);
    			attr_dev(div64, "class", "fourth_btn dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div64, file$1, 298, 16, 21817);
    			attr_dev(div65, "class", "infinity svelte-1rpbtbi");
    			add_location(div65, file$1, 302, 20, 22126);
    			attr_dev(div66, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(div66, file$1, 301, 16, 22001);
    			attr_dev(button77, "type", "button");
    			attr_dev(button77, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button77, file$1, 304, 20, 22200);
    			attr_dev(button78, "type", "button");
    			attr_dev(button78, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button78, file$1, 305, 20, 22346);
    			attr_dev(button79, "type", "button");
    			attr_dev(button79, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button79, file$1, 306, 20, 22501);
    			attr_dev(button80, "type", "button");
    			attr_dev(button80, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button80, file$1, 307, 20, 22641);
    			attr_dev(div67, "class", "brackets svelte-1rpbtbi");
    			add_location(div67, file$1, 309, 20, 22920);
    			attr_dev(div68, "class", "fourth_btn dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div68, file$1, 308, 16, 22784);
    			attr_dev(button81, "type", "button");
    			attr_dev(button81, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button81, file$1, 311, 20, 22994);
    			attr_dev(button82, "type", "button");
    			attr_dev(button82, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button82, file$1, 312, 20, 23157);
    			attr_dev(button83, "type", "button");
    			attr_dev(button83, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button83, file$1, 313, 20, 23299);
    			attr_dev(button84, "type", "button");
    			attr_dev(button84, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button84, file$1, 314, 20, 23453);
    			attr_dev(div69, "class", "curly-brackets svelte-1rpbtbi");
    			add_location(div69, file$1, 316, 20, 23741);
    			attr_dev(div70, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div70, file$1, 315, 16, 23586);
    			attr_dev(button85, "type", "button");
    			attr_dev(button85, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button85, file$1, 318, 20, 23821);
    			attr_dev(button86, "type", "button");
    			attr_dev(button86, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button86, file$1, 319, 20, 23970);
    			attr_dev(button87, "type", "button");
    			attr_dev(button87, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button87, file$1, 320, 20, 24130);
    			attr_dev(button88, "type", "button");
    			attr_dev(button88, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button88, file$1, 321, 20, 24279);
    			attr_dev(div71, "class", "rec-brackets svelte-1rpbtbi");
    			add_location(div71, file$1, 323, 20, 24558);
    			attr_dev(div72, "class", "fourth_btn dec_widther padder_less blue_container svelte-1rpbtbi");
    			add_location(div72, file$1, 322, 16, 24422);
    			add_location(sup0, file$1, 325, 152, 24768);
    			attr_dev(button89, "type", "button");
    			attr_dev(button89, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button89, file$1, 325, 20, 24636);
    			add_location(sup1, file$1, 326, 135, 24927);
    			attr_dev(button90, "type", "button");
    			attr_dev(button90, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button90, file$1, 326, 20, 24812);
    			add_location(sup2, file$1, 327, 151, 25102);
    			attr_dev(button91, "type", "button");
    			attr_dev(button91, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button91, file$1, 327, 20, 24971);
    			attr_dev(button92, "type", "button");
    			attr_dev(button92, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button92, file$1, 328, 20, 25146);
    			attr_dev(button93, "type", "button");
    			attr_dev(button93, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button93, file$1, 329, 20, 25286);
    			attr_dev(button94, "type", "button");
    			attr_dev(button94, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button94, file$1, 330, 20, 25437);
    			add_location(sup3, file$1, 331, 152, 25710);
    			attr_dev(button95, "type", "button");
    			attr_dev(button95, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button95, file$1, 331, 20, 25578);
    			add_location(sup4, file$1, 332, 135, 25869);
    			attr_dev(button96, "type", "button");
    			attr_dev(button96, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button96, file$1, 332, 20, 25754);
    			add_location(sup5, file$1, 333, 151, 26044);
    			attr_dev(button97, "type", "button");
    			attr_dev(button97, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button97, file$1, 333, 20, 25913);
    			attr_dev(button98, "type", "button");
    			attr_dev(button98, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button98, file$1, 334, 20, 26089);
    			attr_dev(button99, "type", "button");
    			attr_dev(button99, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button99, file$1, 335, 20, 26219);
    			attr_dev(button100, "type", "button");
    			attr_dev(button100, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button100, file$1, 336, 20, 26376);
    			attr_dev(button101, "type", "button");
    			attr_dev(button101, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button101, file$1, 337, 20, 26521);
    			attr_dev(button102, "type", "button");
    			attr_dev(button102, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button102, file$1, 338, 20, 26682);
    			attr_dev(div73, "class", "h-sup svelte-1rpbtbi");
    			add_location(div73, file$1, 340, 20, 26963);
    			attr_dev(div74, "class", "first_btn bborder_remover dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div74, file$1, 339, 16, 26823);
    			attr_dev(button103, "type", "button");
    			attr_dev(button103, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button103, file$1, 342, 20, 27034);
    			attr_dev(div75, "class", "x-power-y svelte-1rpbtbi");
    			add_location(div75, file$1, 344, 20, 27330);
    			attr_dev(div76, "class", "thrd_btn bborder_remover dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div76, file$1, 343, 16, 27176);
    			add_location(sup6, file$1, 346, 156, 27541);
    			attr_dev(button104, "type", "button");
    			attr_dev(button104, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button104, file$1, 346, 20, 27405);
    			attr_dev(button105, "type", "button");
    			attr_dev(button105, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button105, file$1, 347, 20, 27585);
    			attr_dev(div77, "class", "column_seven dec_widther blue_container columns_design svelte-1rpbtbi");
    			add_location(div77, file$1, 290, 12, 21172);
    			attr_dev(div78, "class", "square-root svelte-1rpbtbi");
    			add_location(div78, file$1, 351, 20, 27985);
    			attr_dev(div79, "class", "first_btn bborder_remover dec_widther blue_container padder_field svelte-1rpbtbi");
    			add_location(div79, file$1, 350, 16, 27847);
    			attr_dev(div80, "class", "xsubscript svelte-1rpbtbi");
    			add_location(div80, file$1, 354, 20, 28182);
    			attr_dev(div81, "class", "scnd_btn dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div81, file$1, 353, 16, 28058);
    			attr_dev(div82, "class", "dollar svelte-1rpbtbi");
    			add_location(div82, file$1, 357, 20, 28390);
    			attr_dev(div83, "class", "thrd_btn bborder_remover dec_widther blue_container padder_less svelte-1rpbtbi");
    			add_location(div83, file$1, 356, 16, 28254);
    			attr_dev(div84, "class", "brackets svelte-1rpbtbi");
    			add_location(div84, file$1, 360, 20, 28595);
    			attr_dev(div85, "class", "fourth_btn dec_widther blue_container padder_field svelte-1rpbtbi");
    			add_location(div85, file$1, 359, 16, 28458);
    			attr_dev(button106, "type", "button");
    			attr_dev(button106, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button106, file$1, 362, 20, 28669);
    			attr_dev(button107, "type", "button");
    			attr_dev(button107, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button107, file$1, 363, 20, 28826);
    			attr_dev(button108, "type", "button");
    			attr_dev(button108, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button108, file$1, 364, 20, 28966);
    			add_location(sup7, file$1, 365, 135, 29232);
    			attr_dev(button109, "type", "button");
    			attr_dev(button109, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button109, file$1, 365, 20, 29117);
    			add_location(sup8, file$1, 366, 151, 29407);
    			attr_dev(button110, "type", "button");
    			attr_dev(button110, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button110, file$1, 366, 20, 29276);
    			add_location(sup9, file$1, 367, 135, 29566);
    			attr_dev(button111, "type", "button");
    			attr_dev(button111, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button111, file$1, 367, 20, 29451);
    			attr_dev(button112, "type", "button");
    			attr_dev(button112, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button112, file$1, 368, 20, 29610);
    			attr_dev(button113, "type", "button");
    			attr_dev(button113, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button113, file$1, 369, 20, 29774);
    			attr_dev(button114, "type", "button");
    			attr_dev(button114, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button114, file$1, 370, 20, 29916);
    			attr_dev(button115, "type", "button");
    			attr_dev(button115, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button115, file$1, 371, 20, 30073);
    			attr_dev(button116, "type", "button");
    			attr_dev(button116, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button116, file$1, 372, 20, 30214);
    			attr_dev(button117, "type", "button");
    			attr_dev(button117, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button117, file$1, 373, 20, 30378);
    			attr_dev(button118, "type", "button");
    			attr_dev(button118, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button118, file$1, 374, 20, 30520);
    			attr_dev(button119, "type", "button");
    			attr_dev(button119, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button119, file$1, 375, 20, 30677);
    			attr_dev(button120, "type", "button");
    			attr_dev(button120, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button120, file$1, 376, 20, 30833);
    			attr_dev(button121, "type", "button");
    			attr_dev(button121, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button121, file$1, 377, 20, 30997);
    			attr_dev(button122, "type", "button");
    			attr_dev(button122, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button122, file$1, 378, 20, 31144);
    			attr_dev(button123, "type", "button");
    			attr_dev(button123, "class", "fourth_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button123, file$1, 379, 20, 31304);
    			attr_dev(button124, "type", "button");
    			attr_dev(button124, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button124, file$1, 380, 20, 31446);
    			attr_dev(button125, "type", "button");
    			attr_dev(button125, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button125, file$1, 381, 20, 31599);
    			attr_dev(button126, "type", "button");
    			attr_dev(button126, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button126, file$1, 382, 20, 31740);
    			attr_dev(button127, "type", "button");
    			attr_dev(button127, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button127, file$1, 383, 20, 31901);
    			attr_dev(button128, "type", "button");
    			attr_dev(button128, "class", "thrd_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button128, file$1, 384, 20, 32050);
    			attr_dev(button129, "type", "button");
    			attr_dev(button129, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button129, file$1, 385, 20, 32209);
    			attr_dev(button130, "type", "button");
    			attr_dev(button130, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button130, file$1, 386, 20, 32347);
    			attr_dev(button131, "type", "button");
    			attr_dev(button131, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button131, file$1, 387, 20, 32509);
    			attr_dev(button132, "type", "button");
    			attr_dev(button132, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button132, file$1, 388, 20, 32654);
    			attr_dev(button133, "type", "button");
    			attr_dev(button133, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button133, file$1, 389, 20, 32822);
    			attr_dev(button134, "type", "button");
    			attr_dev(button134, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button134, file$1, 390, 20, 32965);
    			attr_dev(button135, "type", "button");
    			attr_dev(button135, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button135, file$1, 391, 20, 33125);
    			attr_dev(button136, "type", "button");
    			attr_dev(button136, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button136, file$1, 392, 20, 33268);
    			attr_dev(button137, "type", "button");
    			attr_dev(button137, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button137, file$1, 393, 20, 33428);
    			attr_dev(button138, "type", "button");
    			attr_dev(button138, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button138, file$1, 394, 20, 33573);
    			attr_dev(button139, "type", "button");
    			attr_dev(button139, "class", "scnd_btn dec_widther blue_container svelte-1rpbtbi");
    			add_location(button139, file$1, 395, 20, 33735);
    			attr_dev(button140, "type", "button");
    			attr_dev(button140, "class", "first_btn bborder_remover dec_widther blue_container svelte-1rpbtbi");
    			add_location(button140, file$1, 396, 20, 33880);
    			attr_dev(div86, "class", "column_eight dec_widther columns_design blue_container svelte-1rpbtbi");
    			add_location(div86, file$1, 349, 12, 27761);
    			attr_dev(div87, "class", "button_designs select_changer height_modifier svelte-1rpbtbi");
    			attr_dev(div87, "id", "select_butns_1");
    			add_location(div87, file$1, 161, 8, 7902);
    			attr_dev(div88, "class", "xvariable svelte-1rpbtbi");
    			add_location(div88, file$1, 402, 20, 34329);
    			attr_dev(div89, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(div89, file$1, 401, 16, 34216);
    			attr_dev(div90, "class", "xfraction svelte-1rpbtbi");
    			add_location(div90, file$1, 405, 20, 34502);
    			attr_dev(div91, "class", "blue_container scnd_btn padder_btn svelte-1rpbtbi");
    			add_location(div91, file$1, 404, 16, 34400);
    			attr_dev(button141, "type", "button");
    			attr_dev(button141, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button141, file$1, 407, 20, 34577);
    			attr_dev(button142, "type", "button");
    			attr_dev(button142, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button142, file$1, 408, 20, 34716);
    			attr_dev(div92, "class", "modulus svelte-1rpbtbi");
    			add_location(div92, file$1, 410, 20, 34952);
    			attr_dev(div93, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div93, file$1, 409, 16, 34832);
    			attr_dev(div94, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div94, file$1, 400, 12, 34143);
    			attr_dev(div95, "class", "yvariable svelte-1rpbtbi");
    			add_location(div95, file$1, 415, 20, 35222);
    			attr_dev(div96, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(div96, file$1, 414, 16, 35109);
    			attr_dev(div97, "class", "x-times-fraction svelte-1rpbtbi");
    			add_location(div97, file$1, 418, 20, 35395);
    			attr_dev(div98, "class", "scnd_btn padder_btn blue_container svelte-1rpbtbi");
    			add_location(div98, file$1, 417, 16, 35293);
    			attr_dev(button143, "type", "button");
    			attr_dev(button143, "class", "thrd_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button143, file$1, 420, 20, 35477);
    			attr_dev(button144, "type", "button");
    			attr_dev(button144, "class", "fourth_btn blue_container svelte-1rpbtbi");
    			add_location(button144, file$1, 421, 20, 35616);
    			attr_dev(button145, "type", "button");
    			attr_dev(button145, "class", "fifth_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button145, file$1, 422, 20, 35752);
    			attr_dev(div99, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div99, file$1, 413, 12, 35037);
    			attr_dev(div100, "class", "xsquare svelte-1rpbtbi");
    			add_location(div100, file$1, 426, 20, 36108);
    			attr_dev(div101, "class", "blue_container first_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div101, file$1, 425, 16, 35978);
    			attr_dev(div102, "class", "xpower svelte-1rpbtbi");
    			add_location(div102, file$1, 429, 20, 36292);
    			attr_dev(div103, "class", "blue_container scnd_btn padder_remover svelte-1rpbtbi");
    			add_location(div103, file$1, 428, 16, 36177);
    			attr_dev(button146, "type", "button");
    			attr_dev(button146, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button146, file$1, 431, 20, 36364);
    			attr_dev(div104, "class", "colon svelte-1rpbtbi");
    			add_location(div104, file$1, 433, 20, 36606);
    			attr_dev(div105, "class", "blue_container fourth_btn padder_less svelte-1rpbtbi");
    			add_location(div105, file$1, 432, 16, 36501);
    			attr_dev(div106, "class", "infinity svelte-1rpbtbi");
    			add_location(div106, file$1, 436, 20, 36786);
    			attr_dev(div107, "class", "blue_container fifth_btn bborder_remover svelte-1rpbtbi");
    			add_location(div107, file$1, 435, 16, 36673);
    			attr_dev(div108, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div108, file$1, 424, 12, 35904);
    			attr_dev(div109, "class", "square-root svelte-1rpbtbi");
    			add_location(div109, file$1, 441, 20, 37072);
    			attr_dev(div110, "class", "blue_container first_btn bborder_remover blue_container padder_field svelte-1rpbtbi");
    			add_location(div110, file$1, 440, 16, 36931);
    			attr_dev(div111, "class", "xsubscript svelte-1rpbtbi");
    			add_location(div111, file$1, 444, 20, 37272);
    			attr_dev(div112, "class", "blue_container scnd_btn blue_container padder_less svelte-1rpbtbi");
    			add_location(div112, file$1, 443, 16, 37145);
    			attr_dev(div113, "class", "dollar svelte-1rpbtbi");
    			add_location(div113, file$1, 447, 20, 37483);
    			attr_dev(div114, "class", "blue_container thrd_btn bborder_remover blue_container padder_less svelte-1rpbtbi");
    			add_location(div114, file$1, 446, 16, 37344);
    			attr_dev(div115, "class", "brackets svelte-1rpbtbi");
    			add_location(div115, file$1, 450, 20, 37691);
    			attr_dev(div116, "class", "blue_container fourth_btn blue_container padder_field svelte-1rpbtbi");
    			add_location(div116, file$1, 449, 16, 37551);
    			attr_dev(button147, "type", "button");
    			attr_dev(button147, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button147, file$1, 452, 20, 37765);
    			attr_dev(div117, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div117, file$1, 439, 12, 36872);
    			attr_dev(div118, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div118, "id", "select_butns_2");
    			add_location(div118, file$1, 399, 8, 34066);
    			attr_dev(div119, "class", "xvariable svelte-1rpbtbi");
    			add_location(div119, file$1, 458, 20, 38156);
    			attr_dev(div120, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(div120, file$1, 457, 16, 38048);
    			attr_dev(div121, "class", "xfraction svelte-1rpbtbi");
    			add_location(div121, file$1, 461, 20, 38329);
    			attr_dev(div122, "class", "blue_container scnd_btn padder_btn svelte-1rpbtbi");
    			add_location(div122, file$1, 460, 16, 38227);
    			attr_dev(button148, "type", "button");
    			attr_dev(button148, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button148, file$1, 463, 20, 38404);
    			attr_dev(button149, "type", "button");
    			attr_dev(button149, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button149, file$1, 464, 20, 38543);
    			attr_dev(button150, "type", "button");
    			attr_dev(button150, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button150, file$1, 465, 20, 38668);
    			attr_dev(div123, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div123, file$1, 456, 12, 37975);
    			attr_dev(div124, "class", "yvariable svelte-1rpbtbi");
    			add_location(div124, file$1, 469, 20, 38975);
    			attr_dev(div125, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(div125, file$1, 468, 16, 38867);
    			attr_dev(div126, "class", "x-times-fraction svelte-1rpbtbi");
    			add_location(div126, file$1, 472, 20, 39148);
    			attr_dev(div127, "class", "blue_container scnd_btn padder_btn svelte-1rpbtbi");
    			add_location(div127, file$1, 471, 16, 39046);
    			attr_dev(button151, "type", "button");
    			attr_dev(button151, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button151, file$1, 474, 20, 39230);
    			attr_dev(div128, "class", "infinity svelte-1rpbtbi");
    			add_location(div128, file$1, 476, 20, 39463);
    			attr_dev(div129, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(div129, file$1, 475, 16, 39365);
    			attr_dev(div130, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(div130, file$1, 478, 16, 39533);
    			attr_dev(div131, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div131, file$1, 467, 12, 38795);
    			attr_dev(div132, "class", "xsquare svelte-1rpbtbi");
    			add_location(div132, file$1, 482, 20, 39844);
    			attr_dev(div133, "class", "blue_container first_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div133, file$1, 481, 16, 39714);
    			attr_dev(div134, "class", "xpower svelte-1rpbtbi");
    			add_location(div134, file$1, 485, 20, 40025);
    			attr_dev(div135, "class", "blue_container scnd_btn padder_less svelte-1rpbtbi");
    			add_location(div135, file$1, 484, 16, 39913);
    			attr_dev(button152, "type", "button");
    			attr_dev(button152, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button152, file$1, 487, 20, 40097);
    			attr_dev(div136, "class", "brackets svelte-1rpbtbi");
    			add_location(div136, file$1, 489, 20, 40358);
    			attr_dev(div137, "class", "blue_container fourth_btn padder_less svelte-1rpbtbi");
    			add_location(div137, file$1, 488, 16, 40234);
    			attr_dev(div138, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(div138, file$1, 491, 16, 40428);
    			attr_dev(div139, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div139, file$1, 480, 12, 39640);
    			attr_dev(div140, "class", "square-root svelte-1rpbtbi");
    			add_location(div140, file$1, 495, 20, 40720);
    			attr_dev(div141, "class", "first_btn bborder_remover blue_container padder_field svelte-1rpbtbi");
    			add_location(div141, file$1, 494, 16, 40594);
    			attr_dev(div142, "class", "square-root-two svelte-1rpbtbi");
    			add_location(div142, file$1, 498, 20, 40913);
    			attr_dev(div143, "class", "scnd_btn blue_container padder_remover svelte-1rpbtbi");
    			add_location(div143, file$1, 497, 16, 40793);
    			attr_dev(div144, "class", "modulus svelte-1rpbtbi");
    			add_location(div144, file$1, 501, 20, 41109);
    			attr_dev(div145, "class", "thrd_btn bborder_remover blue_container padder_less svelte-1rpbtbi");
    			add_location(div145, file$1, 500, 16, 40990);
    			attr_dev(div146, "class", "square-brackets svelte-1rpbtbi");
    			add_location(div146, file$1, 504, 20, 41302);
    			attr_dev(div147, "class", "fourth_btn blue_container padder_less svelte-1rpbtbi");
    			add_location(div147, file$1, 503, 16, 41178);
    			attr_dev(div148, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(div148, file$1, 506, 16, 41379);
    			attr_dev(div149, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div149, file$1, 493, 12, 40535);
    			attr_dev(div150, "class", "btn-group button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div150, "id", "select_butns_3");
    			add_location(div150, file$1, 455, 8, 37888);
    			attr_dev(button153, "type", "button");
    			attr_dev(button153, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button153, file$1, 511, 20, 41646);
    			attr_dev(button154, "type", "button");
    			attr_dev(button154, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button154, file$1, 512, 20, 41787);
    			attr_dev(button155, "type", "button");
    			attr_dev(button155, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button155, file$1, 513, 20, 41910);
    			attr_dev(div151, "class", "not-greater svelte-1rpbtbi");
    			add_location(div151, file$1, 515, 20, 42149);
    			attr_dev(div152, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(div152, file$1, 514, 16, 42046);
    			attr_dev(div153, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(div153, file$1, 517, 16, 42222);
    			attr_dev(div154, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div154, file$1, 510, 12, 41569);
    			attr_dev(button156, "type", "button");
    			attr_dev(button156, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button156, file$1, 520, 20, 42405);
    			attr_dev(button157, "type", "button");
    			attr_dev(button157, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button157, file$1, 521, 20, 42552);
    			attr_dev(button158, "type", "button");
    			attr_dev(button158, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button158, file$1, 522, 20, 42675);
    			attr_dev(div155, "class", "not-lesser svelte-1rpbtbi");
    			add_location(div155, file$1, 524, 20, 42915);
    			attr_dev(div156, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(div156, file$1, 523, 16, 42811);
    			attr_dev(div157, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(div157, file$1, 526, 16, 42987);
    			attr_dev(div158, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div158, file$1, 519, 12, 42329);
    			attr_dev(div159, "class", "remove_border svelte-1rpbtbi");
    			add_location(div159, file$1, 528, 12, 43078);
    			attr_dev(div160, "class", "btn-group button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div160, "id", "select_butns_4");
    			add_location(div160, file$1, 509, 8, 41482);
    			attr_dev(button159, "type", "button");
    			attr_dev(button159, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button159, file$1, 532, 16, 43297);
    			attr_dev(button160, "type", "button");
    			attr_dev(button160, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button160, file$1, 533, 16, 43443);
    			attr_dev(button161, "type", "button");
    			attr_dev(button161, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button161, file$1, 534, 16, 43572);
    			attr_dev(button162, "type", "button");
    			attr_dev(button162, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button162, file$1, 535, 16, 43722);
    			attr_dev(div161, "class", "bar-block svelte-1rpbtbi");
    			add_location(div161, file$1, 537, 20, 43992);
    			attr_dev(div162, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div162, file$1, 536, 16, 43854);
    			attr_dev(div163, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div163, file$1, 531, 12, 43224);
    			attr_dev(button163, "type", "button");
    			attr_dev(button163, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button163, file$1, 541, 16, 44151);
    			attr_dev(button164, "type", "button");
    			attr_dev(button164, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button164, file$1, 542, 16, 44296);
    			attr_dev(button165, "type", "button");
    			attr_dev(button165, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button165, file$1, 543, 16, 44434);
    			attr_dev(button166, "type", "button");
    			attr_dev(button166, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button166, file$1, 544, 16, 44579);
    			attr_dev(div164, "class", "topbar-arrow svelte-1rpbtbi");
    			add_location(div164, file$1, 546, 20, 44854);
    			attr_dev(div165, "class", "blue_container fifth_btn bborder_remover padder_remover svelte-1rpbtbi");
    			add_location(div165, file$1, 545, 16, 44707);
    			attr_dev(div166, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div166, file$1, 540, 12, 44079);
    			attr_dev(button167, "type", "button");
    			attr_dev(button167, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button167, file$1, 550, 16, 45018);
    			attr_dev(button168, "type", "button");
    			attr_dev(button168, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button168, file$1, 551, 16, 45165);
    			attr_dev(button169, "type", "button");
    			attr_dev(button169, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button169, file$1, 552, 16, 45287);
    			attr_dev(button170, "type", "button");
    			attr_dev(button170, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button170, file$1, 553, 16, 45437);
    			attr_dev(button171, "type", "button");
    			attr_dev(button171, "class", "blue_container fifth_btn bborder_remover padder_remover svelte-1rpbtbi");
    			add_location(button171, file$1, 554, 16, 45565);
    			attr_dev(div167, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div167, file$1, 549, 12, 44944);
    			attr_dev(button172, "type", "button");
    			attr_dev(button172, "class", "first_btn bborder_remover blue_container padder_less svelte-1rpbtbi");
    			add_location(button172, file$1, 557, 16, 45803);
    			attr_dev(button173, "type", "button");
    			attr_dev(button173, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button173, file$1, 558, 16, 45963);
    			attr_dev(button174, "type", "button");
    			attr_dev(button174, "class", "thrd_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button174, file$1, 559, 16, 46087);
    			attr_dev(button175, "type", "button");
    			attr_dev(button175, "class", "fourth_btn blue_container svelte-1rpbtbi");
    			add_location(button175, file$1, 560, 16, 46234);
    			attr_dev(button176, "type", "button");
    			attr_dev(button176, "class", "fifth_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button176, file$1, 561, 16, 46356);
    			attr_dev(div168, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div168, file$1, 556, 12, 45744);
    			attr_dev(div169, "class", "btn-group button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div169, "id", "select_butns_5");
    			add_location(div169, file$1, 530, 8, 43137);
    			attr_dev(button177, "type", "button");
    			attr_dev(button177, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button177, file$1, 566, 20, 46682);
    			attr_dev(button178, "type", "button");
    			attr_dev(button178, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button178, file$1, 567, 20, 46833);
    			attr_dev(button179, "type", "button");
    			attr_dev(button179, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button179, file$1, 568, 20, 46960);
    			attr_dev(button180, "type", "button");
    			attr_dev(button180, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button180, file$1, 569, 20, 47102);
    			attr_dev(div170, "class", "brackets svelte-1rpbtbi");
    			add_location(div170, file$1, 571, 20, 47357);
    			attr_dev(div171, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div171, file$1, 570, 16, 47218);
    			attr_dev(div172, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div172, file$1, 565, 12, 46605);
    			attr_dev(button181, "type", "button");
    			attr_dev(button181, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button181, file$1, 575, 20, 47519);
    			attr_dev(button182, "type", "button");
    			attr_dev(button182, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button182, file$1, 576, 20, 47670);
    			attr_dev(button183, "type", "button");
    			attr_dev(button183, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button183, file$1, 577, 20, 47800);
    			attr_dev(button184, "type", "button");
    			attr_dev(button184, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button184, file$1, 578, 20, 47942);
    			attr_dev(div173, "class", "curly-brackets svelte-1rpbtbi");
    			add_location(div173, file$1, 580, 20, 48206);
    			attr_dev(div174, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div174, file$1, 579, 16, 48063);
    			attr_dev(div175, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div175, file$1, 574, 12, 47443);
    			attr_dev(button185, "type", "button");
    			attr_dev(button185, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button185, file$1, 584, 20, 48376);
    			attr_dev(button186, "type", "button");
    			attr_dev(button186, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button186, file$1, 585, 20, 48530);
    			attr_dev(button187, "type", "button");
    			attr_dev(button187, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button187, file$1, 586, 20, 48662);
    			attr_dev(button188, "type", "button");
    			attr_dev(button188, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button188, file$1, 587, 20, 48813);
    			attr_dev(div176, "class", "rec-brackets svelte-1rpbtbi");
    			add_location(div176, file$1, 589, 20, 49068);
    			attr_dev(div177, "class", "blue_container fifth_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div177, file$1, 588, 16, 48929);
    			attr_dev(div178, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div178, file$1, 583, 12, 48298);
    			attr_dev(button189, "type", "button");
    			attr_dev(button189, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button189, file$1, 593, 20, 49221);
    			attr_dev(button190, "type", "button");
    			attr_dev(button190, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button190, file$1, 594, 20, 49370);
    			attr_dev(button191, "type", "button");
    			attr_dev(button191, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button191, file$1, 595, 20, 49509);
    			attr_dev(button192, "type", "button");
    			attr_dev(button192, "class", "fourth_btn blue_container svelte-1rpbtbi");
    			add_location(button192, file$1, 596, 20, 49608);
    			attr_dev(div179, "class", "opp-recbrackets svelte-1rpbtbi");
    			add_location(div179, file$1, 598, 20, 49877);
    			attr_dev(div180, "class", "thrd_btn bborder_remover blue_container padder_less svelte-1rpbtbi");
    			add_location(div180, file$1, 597, 16, 49739);
    			attr_dev(div181, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div181, file$1, 592, 12, 49158);
    			attr_dev(div182, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div182, "id", "select_butns_6");
    			add_location(div182, file$1, 564, 8, 46528);
    			attr_dev(button193, "type", "button");
    			attr_dev(button193, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button193, file$1, 604, 20, 50136);
    			attr_dev(button194, "type", "button");
    			attr_dev(button194, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button194, file$1, 605, 20, 50281);
    			attr_dev(button195, "type", "button");
    			attr_dev(button195, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button195, file$1, 606, 20, 50404);
    			attr_dev(button196, "type", "button");
    			attr_dev(button196, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button196, file$1, 607, 20, 50549);
    			attr_dev(button197, "type", "button");
    			attr_dev(button197, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button197, file$1, 608, 20, 50665);
    			attr_dev(div183, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div183, file$1, 603, 12, 50059);
    			attr_dev(button198, "type", "button");
    			attr_dev(button198, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button198, file$1, 611, 20, 50868);
    			attr_dev(button199, "type", "button");
    			attr_dev(button199, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button199, file$1, 612, 20, 51013);
    			attr_dev(button200, "type", "button");
    			attr_dev(button200, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button200, file$1, 613, 20, 51141);
    			attr_dev(button201, "type", "button");
    			attr_dev(button201, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button201, file$1, 614, 20, 51280);
    			attr_dev(button202, "type", "button");
    			attr_dev(button202, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button202, file$1, 615, 20, 51396);
    			attr_dev(div184, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div184, file$1, 610, 12, 50792);
    			add_location(sup10, file$1, 618, 140, 51721);
    			attr_dev(button203, "type", "button");
    			attr_dev(button203, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button203, file$1, 618, 20, 51601);
    			add_location(sup11, file$1, 619, 123, 51868);
    			attr_dev(button204, "type", "button");
    			attr_dev(button204, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button204, file$1, 619, 20, 51765);
    			add_location(sup12, file$1, 620, 139, 52031);
    			attr_dev(button205, "type", "button");
    			attr_dev(button205, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button205, file$1, 620, 20, 51912);
    			attr_dev(button206, "type", "button");
    			attr_dev(button206, "class", "fourth_btn blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button206, file$1, 621, 20, 52075);
    			attr_dev(button207, "type", "button");
    			attr_dev(button207, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button207, file$1, 622, 20, 52191);
    			attr_dev(div185, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div185, file$1, 617, 12, 51523);
    			add_location(sup13, file$1, 625, 140, 52501);
    			attr_dev(button208, "type", "button");
    			attr_dev(button208, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button208, file$1, 625, 20, 52381);
    			add_location(sup14, file$1, 626, 123, 52648);
    			attr_dev(button209, "type", "button");
    			attr_dev(button209, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button209, file$1, 626, 20, 52545);
    			add_location(sup15, file$1, 627, 139, 52811);
    			attr_dev(button210, "type", "button");
    			attr_dev(button210, "class", "thrd_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button210, file$1, 627, 20, 52692);
    			attr_dev(button211, "type", "button");
    			attr_dev(button211, "class", "fourth_btn blue_container bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button211, file$1, 628, 20, 52855);
    			attr_dev(button212, "type", "button");
    			attr_dev(button212, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button212, file$1, 629, 20, 52970);
    			attr_dev(div186, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div186, file$1, 624, 12, 52318);
    			attr_dev(div187, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div187, "id", "select_butns_7");
    			add_location(div187, file$1, 602, 8, 49982);
    			attr_dev(button213, "type", "button");
    			attr_dev(button213, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button213, file$1, 634, 20, 53247);
    			attr_dev(button214, "type", "button");
    			attr_dev(button214, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button214, file$1, 635, 20, 53399);
    			attr_dev(button215, "type", "button");
    			attr_dev(button215, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button215, file$1, 636, 20, 53529);
    			attr_dev(button216, "type", "button");
    			attr_dev(button216, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button216, file$1, 637, 20, 53674);
    			attr_dev(button217, "type", "button");
    			attr_dev(button217, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button217, file$1, 638, 20, 53803);
    			attr_dev(div188, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div188, file$1, 633, 12, 53170);
    			attr_dev(button218, "type", "button");
    			attr_dev(button218, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button218, file$1, 641, 20, 54006);
    			attr_dev(button219, "type", "button");
    			attr_dev(button219, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button219, file$1, 642, 20, 54158);
    			attr_dev(button220, "type", "button");
    			attr_dev(button220, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button220, file$1, 643, 20, 54288);
    			attr_dev(button221, "type", "button");
    			attr_dev(button221, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button221, file$1, 644, 20, 54433);
    			attr_dev(button222, "type", "button");
    			attr_dev(button222, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button222, file$1, 645, 20, 54577);
    			attr_dev(div189, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div189, file$1, 640, 12, 53930);
    			attr_dev(button223, "type", "button");
    			attr_dev(button223, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button223, file$1, 648, 20, 54782);
    			attr_dev(button224, "type", "button");
    			attr_dev(button224, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button224, file$1, 649, 20, 54934);
    			attr_dev(button225, "type", "button");
    			attr_dev(button225, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button225, file$1, 650, 20, 55069);
    			attr_dev(button226, "type", "button");
    			attr_dev(button226, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button226, file$1, 651, 20, 55217);
    			attr_dev(button227, "type", "button");
    			attr_dev(button227, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button227, file$1, 652, 20, 55347);
    			attr_dev(div190, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div190, file$1, 647, 12, 54704);
    			attr_dev(button228, "type", "button");
    			attr_dev(button228, "class", "blue_container first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button228, file$1, 655, 20, 55537);
    			attr_dev(button229, "type", "button");
    			attr_dev(button229, "class", "blue_container scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button229, file$1, 656, 20, 55693);
    			attr_dev(button230, "type", "button");
    			attr_dev(button230, "class", "blue_container thrd_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button230, file$1, 657, 20, 55837);
    			attr_dev(button231, "type", "button");
    			attr_dev(button231, "class", "blue_container fourth_btn blue_container bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button231, file$1, 658, 20, 56001);
    			attr_dev(button232, "type", "button");
    			attr_dev(button232, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button232, file$1, 659, 20, 56131);
    			attr_dev(div191, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div191, file$1, 654, 12, 55474);
    			attr_dev(div192, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div192, "id", "select_butns_8");
    			add_location(div192, file$1, 632, 8, 53093);
    			attr_dev(button233, "type", "button");
    			attr_dev(button233, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button233, file$1, 664, 20, 56408);
    			attr_dev(button234, "type", "button");
    			attr_dev(button234, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button234, file$1, 665, 20, 56543);
    			attr_dev(button235, "type", "button");
    			attr_dev(button235, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button235, file$1, 666, 20, 56666);
    			attr_dev(button236, "type", "button");
    			attr_dev(button236, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button236, file$1, 667, 20, 56796);
    			attr_dev(button237, "type", "button");
    			attr_dev(button237, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button237, file$1, 668, 20, 56928);
    			attr_dev(div193, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div193, file$1, 663, 12, 56331);
    			attr_dev(button238, "type", "button");
    			attr_dev(button238, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button238, file$1, 671, 20, 57131);
    			attr_dev(button239, "type", "button");
    			attr_dev(button239, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button239, file$1, 672, 20, 57266);
    			attr_dev(button240, "type", "button");
    			attr_dev(button240, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button240, file$1, 673, 20, 57394);
    			attr_dev(button241, "type", "button");
    			attr_dev(button241, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button241, file$1, 674, 20, 57524);
    			attr_dev(button242, "type", "button");
    			attr_dev(button242, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button242, file$1, 675, 20, 57656);
    			attr_dev(div194, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div194, file$1, 670, 12, 57055);
    			attr_dev(button243, "type", "button");
    			attr_dev(button243, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button243, file$1, 678, 20, 57861);
    			attr_dev(div195, "class", "long-division svelte-1rpbtbi");
    			add_location(div195, file$1, 680, 20, 58116);
    			attr_dev(div196, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(div196, file$1, 679, 16, 58009);
    			attr_dev(button244, "type", "button");
    			attr_dev(button244, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button244, file$1, 682, 20, 58195);
    			attr_dev(button245, "type", "button");
    			attr_dev(button245, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button245, file$1, 683, 20, 58325);
    			attr_dev(button246, "type", "button");
    			attr_dev(button246, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button246, file$1, 684, 20, 58457);
    			attr_dev(div197, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div197, file$1, 677, 12, 57783);
    			attr_dev(button247, "type", "button");
    			attr_dev(button247, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button247, file$1, 687, 20, 58647);
    			attr_dev(button248, "type", "button");
    			attr_dev(button248, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button248, file$1, 688, 20, 58799);
    			attr_dev(button249, "type", "button");
    			attr_dev(button249, "class", "thrd_btn bborder_remover blue_container bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button249, file$1, 689, 20, 58938);
    			attr_dev(button250, "type", "button");
    			attr_dev(button250, "class", "fourth_btn blue_container tborder_remover bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button250, file$1, 690, 20, 59067);
    			attr_dev(button251, "type", "button");
    			attr_dev(button251, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button251, file$1, 691, 20, 59198);
    			attr_dev(div198, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div198, file$1, 686, 12, 58584);
    			attr_dev(div199, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div199, "id", "select_butns_9");
    			add_location(div199, file$1, 662, 8, 56254);
    			attr_dev(button252, "type", "button");
    			attr_dev(button252, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button252, file$1, 696, 20, 59476);
    			attr_dev(button253, "type", "button");
    			attr_dev(button253, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button253, file$1, 697, 20, 59630);
    			attr_dev(button254, "type", "button");
    			attr_dev(button254, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button254, file$1, 698, 20, 59761);
    			attr_dev(button255, "type", "button");
    			attr_dev(button255, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button255, file$1, 699, 20, 59903);
    			attr_dev(button256, "type", "button");
    			attr_dev(button256, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button256, file$1, 700, 20, 60019);
    			attr_dev(div200, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div200, file$1, 695, 12, 59399);
    			attr_dev(button257, "type", "button");
    			attr_dev(button257, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button257, file$1, 703, 20, 60222);
    			attr_dev(button258, "type", "button");
    			attr_dev(button258, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button258, file$1, 704, 20, 60376);
    			attr_dev(button259, "type", "button");
    			attr_dev(button259, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button259, file$1, 705, 20, 60506);
    			attr_dev(button260, "type", "button");
    			attr_dev(button260, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button260, file$1, 706, 20, 60653);
    			attr_dev(button261, "type", "button");
    			attr_dev(button261, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button261, file$1, 707, 20, 60769);
    			attr_dev(div201, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div201, file$1, 702, 12, 60146);
    			attr_dev(button262, "type", "button");
    			attr_dev(button262, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button262, file$1, 710, 20, 60974);
    			attr_dev(button263, "type", "button");
    			attr_dev(button263, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button263, file$1, 711, 20, 61126);
    			attr_dev(button264, "type", "button");
    			attr_dev(button264, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button264, file$1, 712, 20, 61259);
    			attr_dev(button265, "type", "button");
    			attr_dev(button265, "class", "fourth_btn rborder_remover bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button265, file$1, 713, 20, 61407);
    			attr_dev(button266, "type", "button");
    			attr_dev(button266, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button266, file$1, 714, 20, 61523);
    			attr_dev(div202, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div202, file$1, 709, 12, 60896);
    			attr_dev(button267, "type", "button");
    			attr_dev(button267, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button267, file$1, 717, 20, 61713);
    			attr_dev(button268, "type", "button");
    			attr_dev(button268, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button268, file$1, 718, 20, 61860);
    			attr_dev(button269, "type", "button");
    			attr_dev(button269, "class", "thrd_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button269, file$1, 719, 20, 61990);
    			attr_dev(button270, "type", "button");
    			attr_dev(button270, "class", "fourth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button270, file$1, 720, 20, 62141);
    			attr_dev(button271, "type", "button");
    			attr_dev(button271, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button271, file$1, 721, 20, 62241);
    			attr_dev(div203, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div203, file$1, 716, 12, 61650);
    			attr_dev(div204, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div204, "id", "select_butns_10");
    			add_location(div204, file$1, 694, 8, 59321);
    			attr_dev(button272, "type", "button");
    			attr_dev(button272, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button272, file$1, 726, 20, 62529);
    			attr_dev(button273, "type", "button");
    			attr_dev(button273, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button273, file$1, 727, 20, 62677);
    			attr_dev(button274, "type", "button");
    			attr_dev(button274, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button274, file$1, 728, 20, 62808);
    			attr_dev(button275, "type", "button");
    			attr_dev(button275, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button275, file$1, 729, 20, 62955);
    			attr_dev(button276, "type", "button");
    			attr_dev(button276, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button276, file$1, 730, 20, 63088);
    			attr_dev(div205, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div205, file$1, 725, 12, 62452);
    			attr_dev(button277, "type", "button");
    			attr_dev(button277, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button277, file$1, 733, 20, 63291);
    			attr_dev(button278, "type", "button");
    			attr_dev(button278, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button278, file$1, 734, 20, 63441);
    			attr_dev(button279, "type", "button");
    			attr_dev(button279, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button279, file$1, 735, 20, 63574);
    			attr_dev(button280, "type", "button");
    			attr_dev(button280, "class", "blue_container fourth_btn svelte-1rpbtbi");
    			add_location(button280, file$1, 736, 20, 63723);
    			attr_dev(button281, "type", "button");
    			attr_dev(button281, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button281, file$1, 737, 20, 63858);
    			attr_dev(div206, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div206, file$1, 732, 12, 63215);
    			attr_dev(button282, "type", "button");
    			attr_dev(button282, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button282, file$1, 740, 20, 64063);
    			attr_dev(button283, "type", "button");
    			attr_dev(button283, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button283, file$1, 741, 20, 64213);
    			attr_dev(button284, "type", "button");
    			attr_dev(button284, "class", "thrd_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button284, file$1, 742, 20, 64346);
    			attr_dev(button285, "type", "button");
    			attr_dev(button285, "class", "fourth_btn blank_color tborder_remover bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button285, file$1, 743, 20, 64476);
    			attr_dev(button286, "type", "button");
    			attr_dev(button286, "class", "fifth_btn bborder_remover blank_color bborder_remover rborder_remover svelte-1rpbtbi");
    			add_location(button286, file$1, 744, 20, 64608);
    			attr_dev(div207, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div207, file$1, 739, 12, 63985);
    			attr_dev(button287, "type", "button");
    			attr_dev(button287, "class", "first_btn bborder_remover blue_container svelte-1rpbtbi");
    			add_location(button287, file$1, 747, 20, 64814);
    			attr_dev(button288, "type", "button");
    			attr_dev(button288, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button288, file$1, 748, 20, 64976);
    			attr_dev(button289, "type", "button");
    			attr_dev(button289, "class", "thrd_btn bborder_remover bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button289, file$1, 749, 20, 65109);
    			attr_dev(button290, "type", "button");
    			attr_dev(button290, "class", "fourth_btn bborder_remover tborder_remover blank_color svelte-1rpbtbi");
    			add_location(button290, file$1, 750, 20, 65223);
    			attr_dev(button291, "type", "button");
    			attr_dev(button291, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button291, file$1, 751, 20, 65339);
    			attr_dev(div208, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div208, file$1, 746, 12, 64751);
    			attr_dev(div209, "class", "btn-group button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div209, "id", "select_butns_11");
    			add_location(div209, file$1, 724, 8, 62364);
    			attr_dev(button292, "type", "button");
    			attr_dev(button292, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button292, file$1, 756, 20, 65617);
    			attr_dev(button293, "type", "button");
    			attr_dev(button293, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button293, file$1, 757, 20, 65767);
    			attr_dev(button294, "type", "button");
    			attr_dev(button294, "class", "blue_container thrd_btn bborder_remover  svelte-1rpbtbi");
    			add_location(button294, file$1, 758, 20, 65900);
    			attr_dev(button295, "type", "button");
    			attr_dev(button295, "class", "fourth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button295, file$1, 759, 20, 66056);
    			attr_dev(button296, "type", "button");
    			attr_dev(button296, "class", "fifth_btn bborder_remover bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button296, file$1, 760, 20, 66172);
    			attr_dev(div210, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div210, file$1, 755, 12, 65540);
    			attr_dev(button297, "type", "button");
    			attr_dev(button297, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(button297, file$1, 763, 20, 66391);
    			attr_dev(button298, "type", "button");
    			attr_dev(button298, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button298, file$1, 764, 20, 66541);
    			attr_dev(button299, "type", "button");
    			attr_dev(button299, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button299, file$1, 765, 20, 66674);
    			attr_dev(button300, "type", "button");
    			attr_dev(button300, "class", "fourth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button300, file$1, 766, 20, 66823);
    			attr_dev(button301, "type", "button");
    			attr_dev(button301, "class", "fifth_btn bborder_remover bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button301, file$1, 767, 20, 66939);
    			attr_dev(div211, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div211, file$1, 762, 12, 66315);
    			attr_dev(button302, "type", "button");
    			attr_dev(button302, "class", "first_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button302, file$1, 770, 20, 67160);
    			attr_dev(button303, "type", "button");
    			attr_dev(button303, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button303, file$1, 771, 20, 67259);
    			attr_dev(button304, "type", "button");
    			attr_dev(button304, "class", "blue_container thrd_btn bborder_remover svelte-1rpbtbi");
    			add_location(button304, file$1, 772, 20, 67392);
    			attr_dev(button305, "type", "button");
    			attr_dev(button305, "class", "fourth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button305, file$1, 773, 20, 67543);
    			attr_dev(button306, "type", "button");
    			attr_dev(button306, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button306, file$1, 774, 20, 67643);
    			attr_dev(div212, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div212, file$1, 769, 12, 67082);
    			attr_dev(div213, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div213, "id", "select_butns_12");
    			add_location(div213, file$1, 754, 8, 65462);
    			attr_dev(div214, "class", "brackets svelte-1rpbtbi");
    			add_location(div214, file$1, 780, 20, 68070);
    			attr_dev(div215, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1rpbtbi");
    			add_location(div215, file$1, 779, 16, 67917);
    			attr_dev(button307, "type", "button");
    			attr_dev(button307, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button307, file$1, 782, 20, 68144);
    			attr_dev(button308, "type", "button");
    			attr_dev(button308, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button308, file$1, 783, 20, 68259);
    			attr_dev(button309, "type", "button");
    			attr_dev(button309, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button309, file$1, 784, 20, 68374);
    			attr_dev(button310, "type", "button");
    			attr_dev(button310, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button310, file$1, 785, 20, 68489);
    			attr_dev(div216, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div216, file$1, 778, 12, 67844);
    			attr_dev(div217, "class", "square-brackets svelte-1rpbtbi");
    			add_location(div217, file$1, 789, 20, 68841);
    			attr_dev(div218, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1rpbtbi");
    			add_location(div218, file$1, 788, 16, 68688);
    			attr_dev(button311, "type", "button");
    			attr_dev(button311, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button311, file$1, 791, 20, 68922);
    			attr_dev(button312, "type", "button");
    			attr_dev(button312, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button312, file$1, 792, 20, 69037);
    			attr_dev(button313, "type", "button");
    			attr_dev(button313, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button313, file$1, 793, 20, 69152);
    			attr_dev(button314, "type", "button");
    			attr_dev(button314, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button314, file$1, 794, 20, 69267);
    			attr_dev(div219, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div219, file$1, 787, 12, 68616);
    			attr_dev(div220, "class", "curly-brackets svelte-1rpbtbi");
    			add_location(div220, file$1, 798, 20, 69625);
    			attr_dev(div221, "class", "blue_container first_btn bborder_remover bborder_adder padder_less svelte-1rpbtbi");
    			add_location(div221, file$1, 797, 16, 69468);
    			attr_dev(button315, "type", "button");
    			attr_dev(button315, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button315, file$1, 800, 20, 69705);
    			attr_dev(button316, "type", "button");
    			attr_dev(button316, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button316, file$1, 801, 20, 69804);
    			attr_dev(button317, "type", "button");
    			attr_dev(button317, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button317, file$1, 802, 20, 69903);
    			attr_dev(button318, "type", "button");
    			attr_dev(button318, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button318, file$1, 803, 20, 70002);
    			attr_dev(div222, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div222, file$1, 796, 12, 69394);
    			attr_dev(div223, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div223, "id", "select_butns_13");
    			add_location(div223, file$1, 777, 8, 67766);
    			attr_dev(button319, "type", "button");
    			attr_dev(button319, "class", "first_btn blue_container bborder_remover svelte-1rpbtbi");
    			add_location(button319, file$1, 808, 20, 70280);
    			attr_dev(div224, "class", "brackets svelte-1rpbtbi");
    			add_location(div224, file$1, 810, 20, 70541);
    			attr_dev(div225, "class", "scnd_btn blue_container padder_remover svelte-1rpbtbi");
    			add_location(div225, file$1, 809, 16, 70416);
    			attr_dev(button320, "type", "button");
    			attr_dev(button320, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button320, file$1, 812, 20, 70615);
    			attr_dev(button321, "type", "button");
    			attr_dev(button321, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button321, file$1, 813, 20, 70730);
    			attr_dev(button322, "type", "button");
    			attr_dev(button322, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button322, file$1, 814, 20, 70845);
    			attr_dev(div226, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div226, file$1, 807, 12, 70203);
    			attr_dev(button323, "type", "button");
    			attr_dev(button323, "class", "first_btn blue_container bborder_remover svelte-1rpbtbi");
    			add_location(button323, file$1, 817, 20, 71048);
    			attr_dev(div227, "class", "integrtion svelte-1rpbtbi");
    			add_location(div227, file$1, 819, 20, 71307);
    			attr_dev(div228, "class", "scnd_btn blue_container padder_remover svelte-1rpbtbi");
    			add_location(div228, file$1, 818, 16, 71184);
    			attr_dev(button324, "type", "button");
    			attr_dev(button324, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button324, file$1, 821, 20, 71383);
    			attr_dev(button325, "type", "button");
    			attr_dev(button325, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button325, file$1, 822, 20, 71498);
    			attr_dev(button326, "type", "button");
    			attr_dev(button326, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button326, file$1, 823, 20, 71613);
    			attr_dev(div229, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div229, file$1, 816, 12, 70972);
    			attr_dev(button327, "type", "button");
    			attr_dev(button327, "class", "first_btn blue_container bborder_remover svelte-1rpbtbi");
    			add_location(button327, file$1, 826, 20, 71818);
    			attr_dev(div230, "class", "sigma svelte-1rpbtbi");
    			add_location(div230, file$1, 828, 20, 72085);
    			attr_dev(div231, "class", "scnd_btn blue_container padder_btn svelte-1rpbtbi");
    			add_location(div231, file$1, 827, 16, 71966);
    			attr_dev(button328, "type", "button");
    			attr_dev(button328, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button328, file$1, 830, 20, 72156);
    			attr_dev(button329, "type", "button");
    			attr_dev(button329, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button329, file$1, 831, 20, 72271);
    			attr_dev(button330, "type", "button");
    			attr_dev(button330, "class", "fifth_btn bborder_remover blank_color rborder_remover svelte-1rpbtbi");
    			add_location(button330, file$1, 832, 20, 72386);
    			attr_dev(div232, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div232, file$1, 825, 12, 71740);
    			attr_dev(div233, "class", "x-button");
    			add_location(div233, file$1, 836, 20, 72695);
    			attr_dev(div234, "class", "first_btn bborder_remover padder_remover blue_container svelte-1rpbtbi");
    			add_location(div234, file$1, 835, 16, 72572);
    			attr_dev(button331, "type", "button");
    			attr_dev(button331, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button331, file$1, 838, 20, 72769);
    			attr_dev(button332, "type", "button");
    			attr_dev(button332, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button332, file$1, 839, 20, 72905);
    			attr_dev(button333, "type", "button");
    			attr_dev(button333, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button333, file$1, 840, 20, 73004);
    			attr_dev(button334, "type", "button");
    			attr_dev(button334, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button334, file$1, 841, 20, 73103);
    			attr_dev(div235, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div235, file$1, 834, 12, 72513);
    			attr_dev(div236, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div236, "id", "select_butns_14");
    			add_location(div236, file$1, 806, 8, 70125);
    			attr_dev(div237, "class", "h-sup svelte-1rpbtbi");
    			add_location(div237, file$1, 847, 20, 73505);
    			attr_dev(div238, "class", "blue_container first_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div238, file$1, 846, 16, 73377);
    			attr_dev(button335, "type", "button");
    			attr_dev(button335, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button335, file$1, 849, 20, 73576);
    			attr_dev(div239, "class", "x-power-y svelte-1rpbtbi");
    			add_location(div239, file$1, 851, 20, 73862);
    			attr_dev(div240, "class", "thrd_btn bborder_remover blue_container bborder_adder padder_less svelte-1rpbtbi");
    			add_location(div240, file$1, 850, 16, 73706);
    			attr_dev(button336, "type", "button");
    			attr_dev(button336, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button336, file$1, 853, 20, 73937);
    			attr_dev(button337, "type", "button");
    			attr_dev(button337, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button337, file$1, 854, 20, 74052);
    			attr_dev(div241, "class", "column_five blue_container columns_design svelte-1rpbtbi");
    			add_location(div241, file$1, 845, 12, 73304);
    			attr_dev(div242, "class", "h-sub svelte-1rpbtbi");
    			add_location(div242, file$1, 858, 20, 74367);
    			attr_dev(div243, "class", "blue_container first_btn bborder_remover svelte-1rpbtbi");
    			add_location(div243, file$1, 857, 16, 74251);
    			attr_dev(button338, "type", "button");
    			attr_dev(button338, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button338, file$1, 860, 20, 74438);
    			attr_dev(button339, "type", "button");
    			attr_dev(button339, "class", "blue_container thrd_btn bborder_remover bborder_adder svelte-1rpbtbi");
    			add_location(button339, file$1, 861, 20, 74571);
    			attr_dev(button340, "type", "button");
    			attr_dev(button340, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button340, file$1, 862, 20, 74736);
    			attr_dev(button341, "type", "button");
    			attr_dev(button341, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button341, file$1, 863, 20, 74851);
    			attr_dev(div244, "class", "column_six blue_container columns_design svelte-1rpbtbi");
    			add_location(div244, file$1, 856, 12, 74179);
    			attr_dev(div245, "class", "h-sup-sub svelte-1rpbtbi");
    			add_location(div245, file$1, 867, 20, 75186);
    			attr_dev(div246, "class", "blue_container first_btn bborder_remover padder_less svelte-1rpbtbi");
    			add_location(div246, file$1, 866, 16, 75052);
    			attr_dev(button342, "type", "button");
    			attr_dev(button342, "class", "blue_container scnd_btn svelte-1rpbtbi");
    			add_location(button342, file$1, 869, 20, 75261);
    			attr_dev(button343, "type", "button");
    			attr_dev(button343, "class", "thrd_btn bborder_remover blue_container bborder_adder svelte-1rpbtbi");
    			add_location(button343, file$1, 870, 20, 75408);
    			attr_dev(button344, "type", "button");
    			attr_dev(button344, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button344, file$1, 871, 20, 75562);
    			attr_dev(button345, "type", "button");
    			attr_dev(button345, "class", "fifth_btn bborder_remover rborder_remover blank_color svelte-1rpbtbi");
    			add_location(button345, file$1, 872, 20, 75677);
    			attr_dev(div247, "class", "column_seven blue_container columns_design svelte-1rpbtbi");
    			add_location(div247, file$1, 865, 12, 74978);
    			attr_dev(div248, "class", "h-power svelte-1rpbtbi");
    			add_location(div248, file$1, 876, 20, 76001);
    			attr_dev(div249, "class", "first_btn bborder_remover padder_less blue_container svelte-1rpbtbi");
    			add_location(div249, file$1, 875, 16, 75863);
    			attr_dev(button346, "type", "button");
    			attr_dev(button346, "class", "scnd_btn blue_container svelte-1rpbtbi");
    			add_location(button346, file$1, 878, 20, 76074);
    			attr_dev(div250, "class", "h-bar svelte-1rpbtbi");
    			add_location(div250, file$1, 880, 20, 76371);
    			attr_dev(div251, "class", "thrd_btn bborder_remover padder_less bborder_adder blue_container svelte-1rpbtbi");
    			add_location(div251, file$1, 879, 16, 76217);
    			attr_dev(button347, "type", "button");
    			attr_dev(button347, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button347, file$1, 882, 20, 76442);
    			attr_dev(button348, "type", "button");
    			attr_dev(button348, "class", "fifth_btn bborder_remover blank_color svelte-1rpbtbi");
    			add_location(button348, file$1, 883, 20, 76541);
    			attr_dev(div252, "class", "column_eight columns_design svelte-1rpbtbi");
    			add_location(div252, file$1, 874, 12, 75804);
    			attr_dev(div253, "class", "button_designs select_changer svelte-1rpbtbi");
    			attr_dev(div253, "id", "select_butns_15");
    			add_location(div253, file$1, 844, 8, 73226);
    			attr_dev(div254, "class", "lower_part_toolbar svelte-1rpbtbi");
    			add_location(div254, file$1, 124, 4, 4538);
    			attr_dev(div255, "class", "toolbar_container_one svelte-1rpbtbi");
    			attr_dev(div255, "id", "toolbar_container_one");
    			add_location(div255, file$1, 90, 0, 2931);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div255, anchor);
    			append_dev(div255, div2);
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
    			append_dev(div255, t4);
    			append_dev(div255, div5);
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
    			append_dev(div5, t21);
    			append_dev(div5, div4);
    			append_dev(div255, t22);
    			append_dev(div255, div254);
    			append_dev(div254, div10);
    			append_dev(div10, div6);
    			append_dev(div6, button1);
    			append_dev(div6, t24);
    			append_dev(div6, button2);
    			append_dev(div6, t26);
    			append_dev(div6, button3);
    			append_dev(div6, t28);
    			append_dev(div6, button4);
    			append_dev(div6, t30);
    			append_dev(div6, button5);
    			append_dev(button5, span4);
    			append_dev(span4, i0);
    			append_dev(div10, t31);
    			append_dev(div10, div7);
    			append_dev(div7, button6);
    			append_dev(div7, t33);
    			append_dev(div7, button7);
    			append_dev(div7, t35);
    			append_dev(div7, button8);
    			append_dev(div7, t37);
    			append_dev(div7, button9);
    			append_dev(div7, t39);
    			append_dev(div7, button10);
    			append_dev(button10, span5);
    			append_dev(span5, i1);
    			append_dev(div10, t40);
    			append_dev(div10, div8);
    			append_dev(div8, button11);
    			append_dev(div8, t42);
    			append_dev(div8, button12);
    			append_dev(div8, t44);
    			append_dev(div8, button13);
    			append_dev(div8, t46);
    			append_dev(div8, button14);
    			append_dev(div8, t48);
    			append_dev(div8, button15);
    			append_dev(button15, span6);
    			append_dev(span6, i2);
    			append_dev(div10, t49);
    			append_dev(div10, div9);
    			append_dev(div9, button16);
    			append_dev(div9, t51);
    			append_dev(div9, button17);
    			append_dev(div9, t53);
    			append_dev(div9, button18);
    			append_dev(div9, t55);
    			append_dev(div9, button19);
    			append_dev(div9, t57);
    			append_dev(div9, button20);
    			append_dev(div254, t59);
    			append_dev(div254, div87);
    			append_dev(div87, div45);
    			append_dev(div45, div12);
    			append_dev(div12, div11);
    			append_dev(div45, t60);
    			append_dev(div45, button21);
    			append_dev(div45, t62);
    			append_dev(div45, button22);
    			append_dev(div45, t64);
    			append_dev(div45, button23);
    			append_dev(div45, t66);
    			append_dev(div45, button24);
    			append_dev(div45, t68);
    			append_dev(div45, button25);
    			append_dev(div45, t70);
    			append_dev(div45, button26);
    			append_dev(div45, t72);
    			append_dev(div45, div14);
    			append_dev(div14, div13);
    			append_dev(div45, t73);
    			append_dev(div45, div16);
    			append_dev(div16, div15);
    			append_dev(div45, t74);
    			append_dev(div45, div18);
    			append_dev(div18, div17);
    			append_dev(div45, t75);
    			append_dev(div45, div20);
    			append_dev(div20, div19);
    			append_dev(div45, t76);
    			append_dev(div45, button27);
    			append_dev(div45, t78);
    			append_dev(div45, button28);
    			append_dev(div45, t80);
    			append_dev(div45, div22);
    			append_dev(div22, div21);
    			append_dev(div45, t81);
    			append_dev(div45, div24);
    			append_dev(div24, div23);
    			append_dev(div45, t82);
    			append_dev(div45, button29);
    			append_dev(div45, t84);
    			append_dev(div45, div26);
    			append_dev(div26, div25);
    			append_dev(div45, t85);
    			append_dev(div45, div28);
    			append_dev(div28, div27);
    			append_dev(div45, t86);
    			append_dev(div45, div30);
    			append_dev(div30, div29);
    			append_dev(div45, t87);
    			append_dev(div45, button30);
    			append_dev(div45, t89);
    			append_dev(div45, div32);
    			append_dev(div32, div31);
    			append_dev(div45, t90);
    			append_dev(div45, div34);
    			append_dev(div34, div33);
    			append_dev(div45, t91);
    			append_dev(div45, div36);
    			append_dev(div36, div35);
    			append_dev(div45, t92);
    			append_dev(div45, div38);
    			append_dev(div38, div37);
    			append_dev(div45, t93);
    			append_dev(div45, div40);
    			append_dev(div40, div39);
    			append_dev(div45, t94);
    			append_dev(div45, button31);
    			append_dev(div45, t96);
    			append_dev(div45, button32);
    			append_dev(div45, t98);
    			append_dev(div45, button33);
    			append_dev(div45, t100);
    			append_dev(div45, button34);
    			append_dev(div45, t102);
    			append_dev(div45, button35);
    			append_dev(div45, t104);
    			append_dev(div45, button36);
    			append_dev(div45, t106);
    			append_dev(div45, button37);
    			append_dev(div45, t108);
    			append_dev(div45, button38);
    			append_dev(div45, t110);
    			append_dev(div45, div42);
    			append_dev(div42, div41);
    			append_dev(div45, t111);
    			append_dev(div45, button39);
    			append_dev(div45, t113);
    			append_dev(div45, div44);
    			append_dev(div44, div43);
    			append_dev(div45, t114);
    			append_dev(div45, button40);
    			append_dev(div45, t116);
    			append_dev(div45, button41);
    			append_dev(div45, t118);
    			append_dev(div45, button42);
    			append_dev(div87, t120);
    			append_dev(div87, div58);
    			append_dev(div58, div47);
    			append_dev(div47, div46);
    			append_dev(div58, t121);
    			append_dev(div58, div49);
    			append_dev(div49, div48);
    			append_dev(div58, t122);
    			append_dev(div58, button43);
    			append_dev(div58, t124);
    			append_dev(div58, button44);
    			append_dev(div58, t126);
    			append_dev(div58, button45);
    			append_dev(div58, t128);
    			append_dev(div58, button46);
    			append_dev(div58, t130);
    			append_dev(div58, button47);
    			append_dev(div58, t132);
    			append_dev(div58, button48);
    			append_dev(div58, t134);
    			append_dev(div58, div51);
    			append_dev(div51, div50);
    			append_dev(div58, t135);
    			append_dev(div58, button49);
    			append_dev(div58, t137);
    			append_dev(div58, button50);
    			append_dev(div58, t139);
    			append_dev(div58, button51);
    			append_dev(div58, t141);
    			append_dev(div58, div53);
    			append_dev(div53, div52);
    			append_dev(div58, t142);
    			append_dev(div58, button52);
    			append_dev(div58, t144);
    			append_dev(div58, button53);
    			append_dev(div58, t146);
    			append_dev(div58, button54);
    			append_dev(div58, t148);
    			append_dev(div58, button55);
    			append_dev(div58, t150);
    			append_dev(div58, div55);
    			append_dev(div55, div54);
    			append_dev(div58, t151);
    			append_dev(div58, button56);
    			append_dev(div58, t153);
    			append_dev(div58, button57);
    			append_dev(div58, t155);
    			append_dev(div58, button58);
    			append_dev(div58, t157);
    			append_dev(div58, button59);
    			append_dev(div58, t159);
    			append_dev(div58, div57);
    			append_dev(div57, div56);
    			append_dev(div58, t160);
    			append_dev(div58, button60);
    			append_dev(div58, t162);
    			append_dev(div58, button61);
    			append_dev(div58, t164);
    			append_dev(div58, button62);
    			append_dev(div58, t166);
    			append_dev(div58, button63);
    			append_dev(div58, t168);
    			append_dev(div58, button64);
    			append_dev(div58, t170);
    			append_dev(div58, button65);
    			append_dev(div58, t172);
    			append_dev(div58, button66);
    			append_dev(div58, t174);
    			append_dev(div58, button67);
    			append_dev(div58, t176);
    			append_dev(div58, button68);
    			append_dev(div58, t178);
    			append_dev(div58, button69);
    			append_dev(div58, t180);
    			append_dev(div58, button70);
    			append_dev(div58, t182);
    			append_dev(div58, button71);
    			append_dev(div58, t184);
    			append_dev(div58, button72);
    			append_dev(div58, t186);
    			append_dev(div58, button73);
    			append_dev(div58, t188);
    			append_dev(div58, button74);
    			append_dev(div58, t190);
    			append_dev(div58, button75);
    			append_dev(div87, t192);
    			append_dev(div87, div77);
    			append_dev(div77, div60);
    			append_dev(div60, div59);
    			append_dev(div77, t193);
    			append_dev(div77, div62);
    			append_dev(div62, div61);
    			append_dev(div77, t194);
    			append_dev(div77, button76);
    			append_dev(div77, t196);
    			append_dev(div77, div64);
    			append_dev(div64, div63);
    			append_dev(div77, t197);
    			append_dev(div77, div66);
    			append_dev(div66, div65);
    			append_dev(div77, t198);
    			append_dev(div77, button77);
    			append_dev(div77, t200);
    			append_dev(div77, button78);
    			append_dev(div77, t202);
    			append_dev(div77, button79);
    			append_dev(div77, t204);
    			append_dev(div77, button80);
    			append_dev(div77, t206);
    			append_dev(div77, div68);
    			append_dev(div68, div67);
    			append_dev(div77, t207);
    			append_dev(div77, button81);
    			append_dev(div77, t209);
    			append_dev(div77, button82);
    			append_dev(div77, t211);
    			append_dev(div77, button83);
    			append_dev(div77, t213);
    			append_dev(div77, button84);
    			append_dev(div77, t215);
    			append_dev(div77, div70);
    			append_dev(div70, div69);
    			append_dev(div77, t216);
    			append_dev(div77, button85);
    			append_dev(div77, t218);
    			append_dev(div77, button86);
    			append_dev(div77, t220);
    			append_dev(div77, button87);
    			append_dev(div77, t222);
    			append_dev(div77, button88);
    			append_dev(div77, t224);
    			append_dev(div77, div72);
    			append_dev(div72, div71);
    			append_dev(div77, t225);
    			append_dev(div77, button89);
    			append_dev(button89, t226);
    			append_dev(button89, sup0);
    			append_dev(div77, t228);
    			append_dev(div77, button90);
    			append_dev(button90, t229);
    			append_dev(button90, sup1);
    			append_dev(div77, t231);
    			append_dev(div77, button91);
    			append_dev(button91, t232);
    			append_dev(button91, sup2);
    			append_dev(div77, t234);
    			append_dev(div77, button92);
    			append_dev(div77, t236);
    			append_dev(div77, button93);
    			append_dev(div77, t238);
    			append_dev(div77, button94);
    			append_dev(div77, t240);
    			append_dev(div77, button95);
    			append_dev(button95, t241);
    			append_dev(button95, sup3);
    			append_dev(div77, t243);
    			append_dev(div77, button96);
    			append_dev(button96, t244);
    			append_dev(button96, sup4);
    			append_dev(div77, t246);
    			append_dev(div77, button97);
    			append_dev(button97, t247);
    			append_dev(button97, sup5);
    			append_dev(div77, t249);
    			append_dev(div77, button98);
    			append_dev(div77, t251);
    			append_dev(div77, button99);
    			append_dev(div77, t253);
    			append_dev(div77, button100);
    			append_dev(div77, t255);
    			append_dev(div77, button101);
    			append_dev(div77, t257);
    			append_dev(div77, button102);
    			append_dev(div77, t259);
    			append_dev(div77, div74);
    			append_dev(div74, div73);
    			append_dev(div77, t260);
    			append_dev(div77, button103);
    			append_dev(div77, t262);
    			append_dev(div77, div76);
    			append_dev(div76, div75);
    			append_dev(div77, t263);
    			append_dev(div77, button104);
    			append_dev(button104, t264);
    			append_dev(button104, sup6);
    			append_dev(div77, t266);
    			append_dev(div77, button105);
    			append_dev(div87, t268);
    			append_dev(div87, div86);
    			append_dev(div86, div79);
    			append_dev(div79, div78);
    			append_dev(div86, t269);
    			append_dev(div86, div81);
    			append_dev(div81, div80);
    			append_dev(div86, t270);
    			append_dev(div86, div83);
    			append_dev(div83, div82);
    			append_dev(div86, t271);
    			append_dev(div86, div85);
    			append_dev(div85, div84);
    			append_dev(div86, t272);
    			append_dev(div86, button106);
    			append_dev(div86, t274);
    			append_dev(div86, button107);
    			append_dev(div86, t276);
    			append_dev(div86, button108);
    			append_dev(div86, t278);
    			append_dev(div86, button109);
    			append_dev(button109, t279);
    			append_dev(button109, sup7);
    			append_dev(div86, t281);
    			append_dev(div86, button110);
    			append_dev(button110, t282);
    			append_dev(button110, sup8);
    			append_dev(div86, t284);
    			append_dev(div86, button111);
    			append_dev(button111, t285);
    			append_dev(button111, sup9);
    			append_dev(div86, t287);
    			append_dev(div86, button112);
    			append_dev(div86, t289);
    			append_dev(div86, button113);
    			append_dev(div86, t291);
    			append_dev(div86, button114);
    			append_dev(div86, t293);
    			append_dev(div86, button115);
    			append_dev(div86, t295);
    			append_dev(div86, button116);
    			append_dev(div86, t297);
    			append_dev(div86, button117);
    			append_dev(div86, t299);
    			append_dev(div86, button118);
    			append_dev(div86, t301);
    			append_dev(div86, button119);
    			append_dev(div86, t303);
    			append_dev(div86, button120);
    			append_dev(div86, t305);
    			append_dev(div86, button121);
    			append_dev(div86, t307);
    			append_dev(div86, button122);
    			append_dev(div86, t309);
    			append_dev(div86, button123);
    			append_dev(div86, t311);
    			append_dev(div86, button124);
    			append_dev(div86, t313);
    			append_dev(div86, button125);
    			append_dev(div86, t315);
    			append_dev(div86, button126);
    			append_dev(div86, t317);
    			append_dev(div86, button127);
    			append_dev(div86, t319);
    			append_dev(div86, button128);
    			append_dev(div86, t321);
    			append_dev(div86, button129);
    			append_dev(div86, t323);
    			append_dev(div86, button130);
    			append_dev(div86, t325);
    			append_dev(div86, button131);
    			append_dev(div86, t327);
    			append_dev(div86, button132);
    			append_dev(div86, t329);
    			append_dev(div86, button133);
    			append_dev(div86, t331);
    			append_dev(div86, button134);
    			append_dev(div86, t333);
    			append_dev(div86, button135);
    			append_dev(div86, t335);
    			append_dev(div86, button136);
    			append_dev(div86, t337);
    			append_dev(div86, button137);
    			append_dev(div86, t339);
    			append_dev(div86, button138);
    			append_dev(div86, t341);
    			append_dev(div86, button139);
    			append_dev(div86, t343);
    			append_dev(div86, button140);
    			append_dev(div254, t345);
    			append_dev(div254, div118);
    			append_dev(div118, div94);
    			append_dev(div94, div89);
    			append_dev(div89, div88);
    			append_dev(div94, t346);
    			append_dev(div94, div91);
    			append_dev(div91, div90);
    			append_dev(div94, t347);
    			append_dev(div94, button141);
    			append_dev(div94, t349);
    			append_dev(div94, button142);
    			append_dev(div94, t351);
    			append_dev(div94, div93);
    			append_dev(div93, div92);
    			append_dev(div118, t352);
    			append_dev(div118, div99);
    			append_dev(div99, div96);
    			append_dev(div96, div95);
    			append_dev(div99, t353);
    			append_dev(div99, div98);
    			append_dev(div98, div97);
    			append_dev(div99, t354);
    			append_dev(div99, button143);
    			append_dev(div99, t356);
    			append_dev(div99, button144);
    			append_dev(div99, t358);
    			append_dev(div99, button145);
    			append_dev(div118, t360);
    			append_dev(div118, div108);
    			append_dev(div108, div101);
    			append_dev(div101, div100);
    			append_dev(div108, t361);
    			append_dev(div108, div103);
    			append_dev(div103, div102);
    			append_dev(div108, t362);
    			append_dev(div108, button146);
    			append_dev(div108, t364);
    			append_dev(div108, div105);
    			append_dev(div105, div104);
    			append_dev(div108, t365);
    			append_dev(div108, div107);
    			append_dev(div107, div106);
    			append_dev(div118, t366);
    			append_dev(div118, div117);
    			append_dev(div117, div110);
    			append_dev(div110, div109);
    			append_dev(div117, t367);
    			append_dev(div117, div112);
    			append_dev(div112, div111);
    			append_dev(div117, t368);
    			append_dev(div117, div114);
    			append_dev(div114, div113);
    			append_dev(div117, t369);
    			append_dev(div117, div116);
    			append_dev(div116, div115);
    			append_dev(div117, t370);
    			append_dev(div117, button147);
    			append_dev(div254, t371);
    			append_dev(div254, div150);
    			append_dev(div150, div123);
    			append_dev(div123, div120);
    			append_dev(div120, div119);
    			append_dev(div123, t372);
    			append_dev(div123, div122);
    			append_dev(div122, div121);
    			append_dev(div123, t373);
    			append_dev(div123, button148);
    			append_dev(div123, t375);
    			append_dev(div123, button149);
    			append_dev(div123, t377);
    			append_dev(div123, button150);
    			append_dev(div150, t378);
    			append_dev(div150, div131);
    			append_dev(div131, div125);
    			append_dev(div125, div124);
    			append_dev(div131, t379);
    			append_dev(div131, div127);
    			append_dev(div127, div126);
    			append_dev(div131, t380);
    			append_dev(div131, button151);
    			append_dev(div131, t382);
    			append_dev(div131, div129);
    			append_dev(div129, div128);
    			append_dev(div131, t383);
    			append_dev(div131, div130);
    			append_dev(div150, t384);
    			append_dev(div150, div139);
    			append_dev(div139, div133);
    			append_dev(div133, div132);
    			append_dev(div139, t385);
    			append_dev(div139, div135);
    			append_dev(div135, div134);
    			append_dev(div139, t386);
    			append_dev(div139, button152);
    			append_dev(div139, t388);
    			append_dev(div139, div137);
    			append_dev(div137, div136);
    			append_dev(div139, t389);
    			append_dev(div139, div138);
    			append_dev(div150, t390);
    			append_dev(div150, div149);
    			append_dev(div149, div141);
    			append_dev(div141, div140);
    			append_dev(div149, t391);
    			append_dev(div149, div143);
    			append_dev(div143, div142);
    			append_dev(div149, t392);
    			append_dev(div149, div145);
    			append_dev(div145, div144);
    			append_dev(div149, t393);
    			append_dev(div149, div147);
    			append_dev(div147, div146);
    			append_dev(div149, t394);
    			append_dev(div149, div148);
    			append_dev(div254, t395);
    			append_dev(div254, div160);
    			append_dev(div160, div154);
    			append_dev(div154, button153);
    			append_dev(div154, t397);
    			append_dev(div154, button154);
    			append_dev(div154, t399);
    			append_dev(div154, button155);
    			append_dev(div154, t401);
    			append_dev(div154, div152);
    			append_dev(div152, div151);
    			append_dev(div154, t402);
    			append_dev(div154, div153);
    			append_dev(div160, t403);
    			append_dev(div160, div158);
    			append_dev(div158, button156);
    			append_dev(div158, t405);
    			append_dev(div158, button157);
    			append_dev(div158, t407);
    			append_dev(div158, button158);
    			append_dev(div158, t409);
    			append_dev(div158, div156);
    			append_dev(div156, div155);
    			append_dev(div158, t410);
    			append_dev(div158, div157);
    			append_dev(div160, t411);
    			append_dev(div160, div159);
    			append_dev(div254, t412);
    			append_dev(div254, div169);
    			append_dev(div169, div163);
    			append_dev(div163, button159);
    			append_dev(div163, t414);
    			append_dev(div163, button160);
    			append_dev(div163, t416);
    			append_dev(div163, button161);
    			append_dev(div163, t418);
    			append_dev(div163, button162);
    			append_dev(div163, t420);
    			append_dev(div163, div162);
    			append_dev(div162, div161);
    			append_dev(div169, t421);
    			append_dev(div169, div166);
    			append_dev(div166, button163);
    			append_dev(div166, t423);
    			append_dev(div166, button164);
    			append_dev(div166, t425);
    			append_dev(div166, button165);
    			append_dev(div166, t427);
    			append_dev(div166, button166);
    			append_dev(div166, t429);
    			append_dev(div166, div165);
    			append_dev(div165, div164);
    			append_dev(div169, t430);
    			append_dev(div169, div167);
    			append_dev(div167, button167);
    			append_dev(div167, t432);
    			append_dev(div167, button168);
    			append_dev(div167, t434);
    			append_dev(div167, button169);
    			append_dev(div167, t436);
    			append_dev(div167, button170);
    			append_dev(div167, t438);
    			append_dev(div167, button171);
    			append_dev(div169, t440);
    			append_dev(div169, div168);
    			append_dev(div168, button172);
    			append_dev(div168, t442);
    			append_dev(div168, button173);
    			append_dev(div168, t444);
    			append_dev(div168, button174);
    			append_dev(div168, t446);
    			append_dev(div168, button175);
    			append_dev(div168, t448);
    			append_dev(div168, button176);
    			append_dev(div254, t450);
    			append_dev(div254, div182);
    			append_dev(div182, div172);
    			append_dev(div172, button177);
    			append_dev(div172, t452);
    			append_dev(div172, button178);
    			append_dev(div172, t454);
    			append_dev(div172, button179);
    			append_dev(div172, t456);
    			append_dev(div172, button180);
    			append_dev(div172, t458);
    			append_dev(div172, div171);
    			append_dev(div171, div170);
    			append_dev(div182, t459);
    			append_dev(div182, div175);
    			append_dev(div175, button181);
    			append_dev(div175, t461);
    			append_dev(div175, button182);
    			append_dev(div175, t463);
    			append_dev(div175, button183);
    			append_dev(div175, t465);
    			append_dev(div175, button184);
    			append_dev(div175, t467);
    			append_dev(div175, div174);
    			append_dev(div174, div173);
    			append_dev(div182, t468);
    			append_dev(div182, div178);
    			append_dev(div178, button185);
    			append_dev(div178, t470);
    			append_dev(div178, button186);
    			append_dev(div178, t472);
    			append_dev(div178, button187);
    			append_dev(div178, t474);
    			append_dev(div178, button188);
    			append_dev(div178, t476);
    			append_dev(div178, div177);
    			append_dev(div177, div176);
    			append_dev(div182, t477);
    			append_dev(div182, div181);
    			append_dev(div181, button189);
    			append_dev(div181, t479);
    			append_dev(div181, button190);
    			append_dev(div181, t481);
    			append_dev(div181, button191);
    			append_dev(div181, t482);
    			append_dev(div181, button192);
    			append_dev(div181, t484);
    			append_dev(div181, div180);
    			append_dev(div180, div179);
    			append_dev(div254, t485);
    			append_dev(div254, div187);
    			append_dev(div187, div183);
    			append_dev(div183, button193);
    			append_dev(div183, t487);
    			append_dev(div183, button194);
    			append_dev(div183, t489);
    			append_dev(div183, button195);
    			append_dev(div183, t491);
    			append_dev(div183, button196);
    			append_dev(div183, t492);
    			append_dev(div183, button197);
    			append_dev(div187, t493);
    			append_dev(div187, div184);
    			append_dev(div184, button198);
    			append_dev(div184, t495);
    			append_dev(div184, button199);
    			append_dev(div184, t497);
    			append_dev(div184, button200);
    			append_dev(div184, t499);
    			append_dev(div184, button201);
    			append_dev(div184, t500);
    			append_dev(div184, button202);
    			append_dev(div187, t501);
    			append_dev(div187, div185);
    			append_dev(div185, button203);
    			append_dev(button203, t502);
    			append_dev(button203, sup10);
    			append_dev(div185, t504);
    			append_dev(div185, button204);
    			append_dev(button204, t505);
    			append_dev(button204, sup11);
    			append_dev(div185, t507);
    			append_dev(div185, button205);
    			append_dev(button205, t508);
    			append_dev(button205, sup12);
    			append_dev(div185, t510);
    			append_dev(div185, button206);
    			append_dev(div185, t511);
    			append_dev(div185, button207);
    			append_dev(div187, t512);
    			append_dev(div187, div186);
    			append_dev(div186, button208);
    			append_dev(button208, t513);
    			append_dev(button208, sup13);
    			append_dev(div186, t515);
    			append_dev(div186, button209);
    			append_dev(button209, t516);
    			append_dev(button209, sup14);
    			append_dev(div186, t518);
    			append_dev(div186, button210);
    			append_dev(button210, t519);
    			append_dev(button210, sup15);
    			append_dev(div186, t521);
    			append_dev(div186, button211);
    			append_dev(div186, t522);
    			append_dev(div186, button212);
    			append_dev(div254, t523);
    			append_dev(div254, div192);
    			append_dev(div192, div188);
    			append_dev(div188, button213);
    			append_dev(div188, t525);
    			append_dev(div188, button214);
    			append_dev(div188, t527);
    			append_dev(div188, button215);
    			append_dev(div188, t529);
    			append_dev(div188, button216);
    			append_dev(div188, t531);
    			append_dev(div188, button217);
    			append_dev(div192, t532);
    			append_dev(div192, div189);
    			append_dev(div189, button218);
    			append_dev(div189, t534);
    			append_dev(div189, button219);
    			append_dev(div189, t536);
    			append_dev(div189, button220);
    			append_dev(div189, t538);
    			append_dev(div189, button221);
    			append_dev(div189, t540);
    			append_dev(div189, button222);
    			append_dev(div192, t541);
    			append_dev(div192, div190);
    			append_dev(div190, button223);
    			append_dev(div190, t543);
    			append_dev(div190, button224);
    			append_dev(div190, t545);
    			append_dev(div190, button225);
    			append_dev(div190, t547);
    			append_dev(div190, button226);
    			append_dev(div190, t549);
    			append_dev(div190, button227);
    			append_dev(div192, t550);
    			append_dev(div192, div191);
    			append_dev(div191, button228);
    			append_dev(div191, t552);
    			append_dev(div191, button229);
    			append_dev(div191, t554);
    			append_dev(div191, button230);
    			append_dev(div191, t556);
    			append_dev(div191, button231);
    			append_dev(div191, t557);
    			append_dev(div191, button232);
    			append_dev(div254, t558);
    			append_dev(div254, div199);
    			append_dev(div199, div193);
    			append_dev(div193, button233);
    			append_dev(div193, t560);
    			append_dev(div193, button234);
    			append_dev(div193, t562);
    			append_dev(div193, button235);
    			append_dev(div193, t563);
    			append_dev(div193, button236);
    			append_dev(div193, t564);
    			append_dev(div193, button237);
    			append_dev(div199, t565);
    			append_dev(div199, div194);
    			append_dev(div194, button238);
    			append_dev(div194, t567);
    			append_dev(div194, button239);
    			append_dev(div194, t569);
    			append_dev(div194, button240);
    			append_dev(div194, t570);
    			append_dev(div194, button241);
    			append_dev(div194, t571);
    			append_dev(div194, button242);
    			append_dev(div199, t572);
    			append_dev(div199, div197);
    			append_dev(div197, button243);
    			append_dev(div197, t574);
    			append_dev(div197, div196);
    			append_dev(div196, div195);
    			append_dev(div197, t575);
    			append_dev(div197, button244);
    			append_dev(div197, t576);
    			append_dev(div197, button245);
    			append_dev(div197, t577);
    			append_dev(div197, button246);
    			append_dev(div199, t578);
    			append_dev(div199, div198);
    			append_dev(div198, button247);
    			append_dev(div198, t580);
    			append_dev(div198, button248);
    			append_dev(div198, t582);
    			append_dev(div198, button249);
    			append_dev(div198, t583);
    			append_dev(div198, button250);
    			append_dev(div198, t584);
    			append_dev(div198, button251);
    			append_dev(div254, t585);
    			append_dev(div254, div204);
    			append_dev(div204, div200);
    			append_dev(div200, button252);
    			append_dev(div200, t587);
    			append_dev(div200, button253);
    			append_dev(div200, t589);
    			append_dev(div200, button254);
    			append_dev(div200, t591);
    			append_dev(div200, button255);
    			append_dev(div200, t592);
    			append_dev(div200, button256);
    			append_dev(div204, t593);
    			append_dev(div204, div201);
    			append_dev(div201, button257);
    			append_dev(div201, t595);
    			append_dev(div201, button258);
    			append_dev(div201, t597);
    			append_dev(div201, button259);
    			append_dev(div201, t599);
    			append_dev(div201, button260);
    			append_dev(div201, t600);
    			append_dev(div201, button261);
    			append_dev(div204, t601);
    			append_dev(div204, div202);
    			append_dev(div202, button262);
    			append_dev(div202, t603);
    			append_dev(div202, button263);
    			append_dev(div202, t605);
    			append_dev(div202, button264);
    			append_dev(div202, t607);
    			append_dev(div202, button265);
    			append_dev(div202, t608);
    			append_dev(div202, button266);
    			append_dev(div204, t609);
    			append_dev(div204, div203);
    			append_dev(div203, button267);
    			append_dev(div203, t611);
    			append_dev(div203, button268);
    			append_dev(div203, t613);
    			append_dev(div203, button269);
    			append_dev(div203, t615);
    			append_dev(div203, button270);
    			append_dev(div203, t616);
    			append_dev(div203, button271);
    			append_dev(div254, t617);
    			append_dev(div254, div209);
    			append_dev(div209, div205);
    			append_dev(div205, button272);
    			append_dev(div205, t619);
    			append_dev(div205, button273);
    			append_dev(div205, t621);
    			append_dev(div205, button274);
    			append_dev(div205, t623);
    			append_dev(div205, button275);
    			append_dev(div205, t625);
    			append_dev(div205, button276);
    			append_dev(div209, t626);
    			append_dev(div209, div206);
    			append_dev(div206, button277);
    			append_dev(div206, t628);
    			append_dev(div206, button278);
    			append_dev(div206, t630);
    			append_dev(div206, button279);
    			append_dev(div206, t632);
    			append_dev(div206, button280);
    			append_dev(div206, t634);
    			append_dev(div206, button281);
    			append_dev(div209, t635);
    			append_dev(div209, div207);
    			append_dev(div207, button282);
    			append_dev(div207, t637);
    			append_dev(div207, button283);
    			append_dev(div207, t639);
    			append_dev(div207, button284);
    			append_dev(div207, t640);
    			append_dev(div207, button285);
    			append_dev(div207, t641);
    			append_dev(div207, button286);
    			append_dev(div209, t642);
    			append_dev(div209, div208);
    			append_dev(div208, button287);
    			append_dev(div208, t644);
    			append_dev(div208, button288);
    			append_dev(div208, t646);
    			append_dev(div208, button289);
    			append_dev(div208, t647);
    			append_dev(div208, button290);
    			append_dev(div208, t648);
    			append_dev(div208, button291);
    			append_dev(div254, t649);
    			append_dev(div254, div213);
    			append_dev(div213, div210);
    			append_dev(div210, button292);
    			append_dev(div210, t651);
    			append_dev(div210, button293);
    			append_dev(div210, t653);
    			append_dev(div210, button294);
    			append_dev(div210, t655);
    			append_dev(div210, button295);
    			append_dev(div210, t656);
    			append_dev(div210, button296);
    			append_dev(div213, t657);
    			append_dev(div213, div211);
    			append_dev(div211, button297);
    			append_dev(div211, t659);
    			append_dev(div211, button298);
    			append_dev(div211, t661);
    			append_dev(div211, button299);
    			append_dev(div211, t663);
    			append_dev(div211, button300);
    			append_dev(div211, t664);
    			append_dev(div211, button301);
    			append_dev(div213, t665);
    			append_dev(div213, div212);
    			append_dev(div212, button302);
    			append_dev(div212, t666);
    			append_dev(div212, button303);
    			append_dev(div212, t668);
    			append_dev(div212, button304);
    			append_dev(div212, t670);
    			append_dev(div212, button305);
    			append_dev(div212, t671);
    			append_dev(div212, button306);
    			append_dev(div254, t672);
    			append_dev(div254, div223);
    			append_dev(div223, div216);
    			append_dev(div216, div215);
    			append_dev(div215, div214);
    			append_dev(div216, t673);
    			append_dev(div216, button307);
    			append_dev(div216, t674);
    			append_dev(div216, button308);
    			append_dev(div216, t675);
    			append_dev(div216, button309);
    			append_dev(div216, t676);
    			append_dev(div216, button310);
    			append_dev(div223, t677);
    			append_dev(div223, div219);
    			append_dev(div219, div218);
    			append_dev(div218, div217);
    			append_dev(div219, t678);
    			append_dev(div219, button311);
    			append_dev(div219, t679);
    			append_dev(div219, button312);
    			append_dev(div219, t680);
    			append_dev(div219, button313);
    			append_dev(div219, t681);
    			append_dev(div219, button314);
    			append_dev(div223, t682);
    			append_dev(div223, div222);
    			append_dev(div222, div221);
    			append_dev(div221, div220);
    			append_dev(div222, t683);
    			append_dev(div222, button315);
    			append_dev(div222, t684);
    			append_dev(div222, button316);
    			append_dev(div222, t685);
    			append_dev(div222, button317);
    			append_dev(div222, t686);
    			append_dev(div222, button318);
    			append_dev(div254, t687);
    			append_dev(div254, div236);
    			append_dev(div236, div226);
    			append_dev(div226, button319);
    			append_dev(div226, t689);
    			append_dev(div226, div225);
    			append_dev(div225, div224);
    			append_dev(div226, t690);
    			append_dev(div226, button320);
    			append_dev(div226, t691);
    			append_dev(div226, button321);
    			append_dev(div226, t692);
    			append_dev(div226, button322);
    			append_dev(div236, t693);
    			append_dev(div236, div229);
    			append_dev(div229, button323);
    			append_dev(div229, t695);
    			append_dev(div229, div228);
    			append_dev(div228, div227);
    			append_dev(div229, t696);
    			append_dev(div229, button324);
    			append_dev(div229, t697);
    			append_dev(div229, button325);
    			append_dev(div229, t698);
    			append_dev(div229, button326);
    			append_dev(div236, t699);
    			append_dev(div236, div232);
    			append_dev(div232, button327);
    			append_dev(div232, t701);
    			append_dev(div232, div231);
    			append_dev(div231, div230);
    			append_dev(div232, t702);
    			append_dev(div232, button328);
    			append_dev(div232, t703);
    			append_dev(div232, button329);
    			append_dev(div232, t704);
    			append_dev(div232, button330);
    			append_dev(div236, t705);
    			append_dev(div236, div235);
    			append_dev(div235, div234);
    			append_dev(div234, div233);
    			append_dev(div235, t706);
    			append_dev(div235, button331);
    			append_dev(div235, t708);
    			append_dev(div235, button332);
    			append_dev(div235, t709);
    			append_dev(div235, button333);
    			append_dev(div235, t710);
    			append_dev(div235, button334);
    			append_dev(div254, t711);
    			append_dev(div254, div253);
    			append_dev(div253, div241);
    			append_dev(div241, div238);
    			append_dev(div238, div237);
    			append_dev(div241, t712);
    			append_dev(div241, button335);
    			append_dev(div241, t714);
    			append_dev(div241, div240);
    			append_dev(div240, div239);
    			append_dev(div241, t715);
    			append_dev(div241, button336);
    			append_dev(div241, t716);
    			append_dev(div241, button337);
    			append_dev(div253, t717);
    			append_dev(div253, div244);
    			append_dev(div244, div243);
    			append_dev(div243, div242);
    			append_dev(div244, t718);
    			append_dev(div244, button338);
    			append_dev(div244, t720);
    			append_dev(div244, button339);
    			append_dev(div244, t722);
    			append_dev(div244, button340);
    			append_dev(div244, t723);
    			append_dev(div244, button341);
    			append_dev(div253, t724);
    			append_dev(div253, div247);
    			append_dev(div247, div246);
    			append_dev(div246, div245);
    			append_dev(div247, t725);
    			append_dev(div247, button342);
    			append_dev(div247, t727);
    			append_dev(div247, button343);
    			append_dev(div247, t729);
    			append_dev(div247, button344);
    			append_dev(div247, t730);
    			append_dev(div247, button345);
    			append_dev(div253, t731);
    			append_dev(div253, div252);
    			append_dev(div252, div249);
    			append_dev(div249, div248);
    			append_dev(div252, t732);
    			append_dev(div252, button346);
    			append_dev(div252, t734);
    			append_dev(div252, div251);
    			append_dev(div251, div250);
    			append_dev(div252, t735);
    			append_dev(div252, button347);
    			append_dev(div252, t736);
    			append_dev(div252, button348);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*closeToolbar*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*latexInput*/ ctx[0].bind(this, 7), false, false, false),
    					listen_dev(button2, "click", /*latexInput*/ ctx[0].bind(this, 4), false, false, false),
    					listen_dev(button3, "click", /*latexInput*/ ctx[0].bind(this, 1), false, false, false),
    					listen_dev(button4, "click", /*latexInput*/ ctx[0].bind(this, 0), false, false, false),
    					listen_dev(button5, "click", /*cursorEvent*/ ctx[2].bind(this, "cursorBack"), false, false, false),
    					listen_dev(button6, "click", /*latexInput*/ ctx[0].bind(this, 8), false, false, false),
    					listen_dev(button7, "click", /*latexInput*/ ctx[0].bind(this, 5), false, false, false),
    					listen_dev(button8, "click", /*latexInput*/ ctx[0].bind(this, 2), false, false, false),
    					listen_dev(button9, "click", /*input*/ ctx[1].bind(this, "."), false, false, false),
    					listen_dev(button10, "click", /*cursorEvent*/ ctx[2].bind(this, "cursorFor"), false, false, false),
    					listen_dev(button11, "click", /*latexInput*/ ctx[0].bind(this, 9), false, false, false),
    					listen_dev(button12, "click", /*latexInput*/ ctx[0].bind(this, 6), false, false, false),
    					listen_dev(button13, "click", /*latexInput*/ ctx[0].bind(this, 3), false, false, false),
    					listen_dev(button14, "click", /*input*/ ctx[1].bind(this, ","), false, false, false),
    					listen_dev(button15, "click", /*cursorEvent*/ ctx[2].bind(this, "backspace"), false, false, false),
    					listen_dev(button16, "click", /*input*/ ctx[1].bind(this, "\\div"), false, false, false),
    					listen_dev(button17, "click", /*input*/ ctx[1].bind(this, "×"), false, false, false),
    					listen_dev(button18, "click", /*input*/ ctx[1].bind(this, "-"), false, false, false),
    					listen_dev(button19, "click", /*input*/ ctx[1].bind(this, "+"), false, false, false),
    					listen_dev(button20, "click", /*input*/ ctx[1].bind(this, "="), false, false, false),
    					listen_dev(div12, "click", /*latexInput*/ ctx[0].bind(this, "x"), false, false, false),
    					listen_dev(button21, "click", /*input*/ ctx[1].bind(this, "b"), false, false, false),
    					listen_dev(button22, "click", /*latexInput*/ ctx[0].bind(this, "\\text{abc}"), false, false, false),
    					listen_dev(button23, "click", /*latexInput*/ ctx[0].bind(this, "$"), false, false, false),
    					listen_dev(button24, "click", /*input*/ ctx[1].bind(this, "\\div"), false, false, false),
    					listen_dev(button25, "click", /*input*/ ctx[1].bind(this, "&ge;"), false, false, false),
    					listen_dev(button26, "click", /*latexInput*/ ctx[0].bind(this, "\\perp"), false, false, false),
    					listen_dev(div14, "click", /*latexInput*/ ctx[0].bind(this, "\\nless"), false, false, false),
    					listen_dev(div16, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right)"), false, false, false),
    					listen_dev(div18, "click", /*input*/ ctx[1].bind(this, "x"), false, false, false),
    					listen_dev(div20, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button27, "click", /*input*/ ctx[1].bind(this, "\lt"), false, false, false),
    					listen_dev(button28, "click", /*input*/ ctx[1].bind(this, "\pi"), false, false, false),
    					listen_dev(div22, "click", /*input*/ ctx[1].bind(this, "y"), false, false, false),
    					listen_dev(div24, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button29, "click", /*input*/ ctx[1].bind(this, "\gt"), false, false, false),
    					listen_dev(div26, "click", /*input*/ ctx[1].bind(this, "\infin"), false, false, false),
    					listen_dev(div28, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div30, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button30, "click", /*input*/ ctx[1].bind(this, "±"), false, false, false),
    					listen_dev(div32, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div34, "click", /*input*/ ctx[1].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div36, "click", /*latexInput*/ ctx[0].bind(this, "\\sqrt[]{}"), false, false, false),
    					listen_dev(div38, "click", /*input*/ ctx[1].bind(this, "|"), false, false, false),
    					listen_dev(div40, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right]"), false, false, false),
    					listen_dev(button31, "click", /*input*/ ctx[1].bind(this, "a"), false, false, false),
    					listen_dev(button32, "click", /*input*/ ctx[1].bind(this, "\\vert"), false, false, false),
    					listen_dev(button33, "click", /*latexInput*/ ctx[0].bind(this, "\\lceil"), false, false, false),
    					listen_dev(button34, "click", /*latexInput*/ ctx[0].bind(this, "\\wedge"), false, false, false),
    					listen_dev(button35, "click", /*input*/ ctx[1].bind(this, "\\forall"), false, false, false),
    					listen_dev(button36, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mi}"), false, false, false),
    					listen_dev(button37, "click", /*latexInput*/ ctx[0].bind(this, "\\text{gal}"), false, false, false),
    					listen_dev(button38, "click", /*latexInput*/ ctx[0].bind(this, "f"), false, false, false),
    					listen_dev(div42, "click", /*latexInput*/ ctx[0].bind(this, "\\int_{ }^{ }"), false, false, false),
    					listen_dev(button39, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta"), false, false, false),
    					listen_dev(div44, "click", /*latexInput*/ ctx[0].bind(this, "\\sum_{ }^{ }"), false, false, false),
    					listen_dev(button40, "click", /*latexInput*/ ctx[0].bind(this, "\\rightleftharpoons"), false, false, false),
    					listen_dev(button41, "click", /*input*/ ctx[1].bind(this, "\\prime"), false, false, false),
    					listen_dev(button42, "click", /*latexInput*/ ctx[0].bind(this, "\\text{&micro;g}"), false, false, false),
    					listen_dev(div47, "click", /*latexInput*/ ctx[0].bind(this, "y"), false, false, false),
    					listen_dev(div49, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button43, "click", /*input*/ ctx[1].bind(this, "\gt"), false, false, false),
    					listen_dev(button44, "click", /*latexInput*/ ctx[0].bind(this, "\\degree"), false, false, false),
    					listen_dev(button45, "click", /*input*/ ctx[1].bind(this, "\pi"), false, false, false),
    					listen_dev(button46, "click", /*input*/ ctx[1].bind(this, "&ne;"), false, false, false),
    					listen_dev(button47, "click", /*input*/ ctx[1].bind(this, "\lt"), false, false, false),
    					listen_dev(button48, "click", /*input*/ ctx[1].bind(this, "&le;"), false, false, false),
    					listen_dev(div51, "click", /*latexInput*/ ctx[0].bind(this, "\\ngtr"), false, false, false),
    					listen_dev(button49, "click", /*input*/ ctx[1].bind(this, "&asymp;"), false, false, false),
    					listen_dev(button50, "click", /*input*/ ctx[1].bind(this, "\gt"), false, false, false),
    					listen_dev(button51, "click", /*input*/ ctx[1].bind(this, "&ge;"), false, false, false),
    					listen_dev(div53, "click", /*latexInput*/ ctx[0].bind(this, "\\nless"), false, false, false),
    					listen_dev(button52, "click", /*latexInput*/ ctx[0].bind(this, "\\perp"), false, false, false),
    					listen_dev(button53, "click", /*latexInput*/ ctx[0].bind(this, "\\angle"), false, false, false),
    					listen_dev(button54, "click", /*latexInput*/ ctx[0].bind(this, "\\triangle"), false, false, false),
    					listen_dev(button55, "click", /*latexInput*/ ctx[0].bind(this, "\\degree"), false, false, false),
    					listen_dev(div55, "click", /*latexInput*/ ctx[0].bind(this, "\\\overline{ }"), false, false, false),
    					listen_dev(button56, "click", /*input*/ ctx[1].bind(this, "\parallel"), false, false, false),
    					listen_dev(button57, "click", /*latexInput*/ ctx[0].bind(this, "\\measuredangle"), false, false, false),
    					listen_dev(button58, "click", /*input*/ ctx[1].bind(this, "\circledot"), false, false, false),
    					listen_dev(button59, "click", /*input*/ ctx[1].bind(this, "&prime;"), false, false, false),
    					listen_dev(div57, "click", /*latexInput*/ ctx[0].bind(this, "\\\overrightarrow{ }"), false, false, false),
    					listen_dev(button60, "click", /*input*/ ctx[1].bind(this, "\\nparallel"), false, false, false),
    					listen_dev(button61, "click", /*input*/ ctx[1].bind(this, "\\sim"), false, false, false),
    					listen_dev(button62, "click", /*input*/ ctx[1].bind(this, "\\parallelogram"), false, false, false),
    					listen_dev(button63, "click", /*input*/ ctx[1].bind(this, "&prime;"), false, false, false),
    					listen_dev(button64, "click", /*latexInput*/ ctx[0].bind(this, "\\ldots"), false, false, false),
    					listen_dev(button65, "click", /*latexInput*/ ctx[0].bind(this, "\\ddots"), false, false, false),
    					listen_dev(button66, "click", /*input*/ ctx[1].bind(this, "\\cong"), false, false, false),
    					listen_dev(button67, "click", /*latexInput*/ ctx[0].bind(this, "\\vdots"), false, false, false),
    					listen_dev(button68, "click", /*input*/ ctx[1].bind(this, "&pi;"), false, false, false),
    					listen_dev(button69, "click", /*input*/ ctx[1].bind(this, "\\square"), false, false, false),
    					listen_dev(button70, "click", /*latexInput*/ ctx[0].bind(this, "\\propto"), false, false, false),
    					listen_dev(button71, "click", /*latexInput*/ ctx[0].bind(this, "\\rfloor"), false, false, false),
    					listen_dev(button72, "click", /*input*/ ctx[1].bind(this, "\\equiv"), false, false, false),
    					listen_dev(button73, "click", /*input*/ ctx[1].bind(this, "\\exists"), false, false, false),
    					listen_dev(button74, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mg}"), false, false, false),
    					listen_dev(button75, "click", /*latexInput*/ ctx[0].bind(this, "\\text{cm}"), false, false, false),
    					listen_dev(div60, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div62, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button76, "click", /*input*/ ctx[1].bind(this, "±"), false, false, false),
    					listen_dev(div64, "click", /*input*/ ctx[1].bind(this, ":"), false, false, false),
    					listen_dev(div66, "click", /*input*/ ctx[1].bind(this, "\infin"), false, false, false),
    					listen_dev(button77, "click", /*latexInput*/ ctx[0].bind(this, "\\subset"), false, false, false),
    					listen_dev(button78, "click", /*input*/ ctx[1].bind(this, "\\in"), false, false, false),
    					listen_dev(button79, "click", /*input*/ ctx[1].bind(this, "\\cup"), false, false, false),
    					listen_dev(button80, "click", /*input*/ ctx[1].bind(this, ","), false, false, false),
    					listen_dev(div68, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button81, "click", /*latexInput*/ ctx[0].bind(this, "\\supset"), false, false, false),
    					listen_dev(button82, "click", /*input*/ ctx[1].bind(this, "\\notin"), false, false, false),
    					listen_dev(button83, "click", /*input*/ ctx[1].bind(this, "\\cap"), false, false, false),
    					listen_dev(button84, "click", /*latexInput*/ ctx[0].bind(this, ":"), false, false, false),
    					listen_dev(div70, "click", /*latexInput*/ ctx[0].bind(this, "\\left\\{\\right\\}"), false, false, false),
    					listen_dev(button85, "click", /*latexInput*/ ctx[0].bind(this, "\\subseteq"), false, false, false),
    					listen_dev(button86, "click", /*latexInput*/ ctx[0].bind(this, "\\ni"), false, false, false),
    					listen_dev(button87, "click", /*input*/ ctx[1].bind(this, "\\varnothing"), false, false, false),
    					listen_dev(button88, "click", /*input*/ ctx[1].bind(this, "!"), false, false, false),
    					listen_dev(div72, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right)"), false, false, false),
    					listen_dev(button89, "click", /*latexInput*/ ctx[0].bind(this, "\\sec^{-1}"), false, false, false),
    					listen_dev(button90, "click", /*latexInput*/ ctx[0].bind(this, "\\csc^{-1}"), false, false, false),
    					listen_dev(button91, "click", /*latexInput*/ ctx[0].bind(this, "\\cot^{-1}"), false, false, false),
    					listen_dev(button92, "click", /*latexInput*/ ctx[0].bind(this, "\sin"), false, false, false),
    					listen_dev(button93, "click", /*input*/ ctx[1].bind(this, "\cos"), false, false, false),
    					listen_dev(button94, "click", /*latexInput*/ ctx[0].bind(this, "\\tan"), false, false, false),
    					listen_dev(button95, "click", /*latexInput*/ ctx[0].bind(this, "\\sec^{-1}"), false, false, false),
    					listen_dev(button96, "click", /*latexInput*/ ctx[0].bind(this, "\\csc^{-1}"), false, false, false),
    					listen_dev(button97, "click", /*latexInput*/ ctx[0].bind(this, "\\cot^{-1}"), false, false, false),
    					listen_dev(button98, "click", /*input*/ ctx[1].bind(this, "b"), false, false, false),
    					listen_dev(button99, "click", /*latexInput*/ ctx[0].bind(this, "\\cdot"), false, false, false),
    					listen_dev(button100, "click", /*latexInput*/ ctx[0].bind(this, "\\text{lb}"), false, false, false),
    					listen_dev(button101, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ft}"), false, false, false),
    					listen_dev(button102, "click", /*latexInput*/ ctx[0].bind(this, "\\text{pt}"), false, false, false),
    					listen_dev(div74, "click", /*latexInput*/ ctx[0].bind(this, "\^{}"), false, false, false),
    					listen_dev(button103, "click", /*input*/ ctx[1].bind(this, "\\rightarrow"), false, false, false),
    					listen_dev(div76, "click", /*latexInput*/ ctx[0].bind(this, "\\xrightarrow[]\\{}"), false, false, false),
    					listen_dev(button104, "click", /*latexInput*/ ctx[0].bind(this, "\\text{g}\ \\text{mol}^{-1}"), false, false, false),
    					listen_dev(button105, "click", /*latexInput*/ ctx[0].bind(this, "\\partial"), false, false, false),
    					listen_dev(div79, "click", /*input*/ ctx[1].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div81, "click", /*latexInput*/ ctx[0].bind(this, "\\_{}"), false, false, false),
    					listen_dev(div83, "click", /*latexInput*/ ctx[0].bind(this, "$"), false, false, false),
    					listen_dev(div85, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button106, "click", /*latexInput*/ ctx[0].bind(this, "\sec"), false, false, false),
    					listen_dev(button107, "click", /*latexInput*/ ctx[0].bind(this, "\csc"), false, false, false),
    					listen_dev(button108, "click", /*input*/ ctx[1].bind(this, "\cot"), false, false, false),
    					listen_dev(button109, "click", /*latexInput*/ ctx[0].bind(this, "\\sin^{-1}"), false, false, false),
    					listen_dev(button110, "click", /*latexInput*/ ctx[0].bind(this, "\\cos^{-1}"), false, false, false),
    					listen_dev(button111, "click", /*latexInput*/ ctx[0].bind(this, "\\tan^{-1}"), false, false, false),
    					listen_dev(button112, "click", /*latexInput*/ ctx[0].bind(this, "\\alpha"), false, false, false),
    					listen_dev(button113, "click", /*input*/ ctx[1].bind(this, "\\theta"), false, false, false),
    					listen_dev(button114, "click", /*input*/ ctx[1].bind(this, "\Theta"), false, false, false),
    					listen_dev(button115, "click", /*input*/ ctx[1].bind(this, "\\tau"), false, false, false),
    					listen_dev(button116, "click", /*latexInput*/ ctx[0].bind(this, "\\gamma"), false, false, false),
    					listen_dev(button117, "click", /*input*/ ctx[1].bind(this, "\\sigma"), false, false, false),
    					listen_dev(button118, "click", /*input*/ ctx[1].bind(this, "\Sigma"), false, false, false),
    					listen_dev(button119, "click", /*latexInput*/ ctx[0].bind(this, "\\varepsilon"), false, false, false),
    					listen_dev(button120, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button121, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button122, "click", /*input*/ ctx[1].bind(this, "\\lambda"), false, false, false),
    					listen_dev(button123, "click", /*input*/ ctx[1].bind(this, "\\beta"), false, false, false),
    					listen_dev(button124, "click", /*input*/ ctx[1].bind(this, "\\pi"), false, false, false),
    					listen_dev(button125, "click", /*latexInput*/ ctx[0].bind(this, "\\Pi"), false, false, false),
    					listen_dev(button126, "click", /*latexInput*/ ctx[0].bind(this, "\\phi"), false, false, false),
    					listen_dev(button127, "click", /*latexInput*/ ctx[0].bind(this, "\\lfloor"), false, false, false),
    					listen_dev(button128, "click", /*input*/ ctx[1].bind(this, "\\uparrow"), false, false, false),
    					listen_dev(button129, "click", /*input*/ ctx[1].bind(this, "\\neg"), false, false, false),
    					listen_dev(button130, "click", /*latexInput*/ ctx[0].bind(this, "\\text{oz}"), false, false, false),
    					listen_dev(button131, "click", /*latexInput*/ ctx[0].bind(this, "\\text{in}"), false, false, false),
    					listen_dev(button132, "click", /*latexInput*/ ctx[0].bind(this, "\\text{fl oz}"), false, false, false),
    					listen_dev(button133, "click", /*latexInput*/ ctx[0].bind(this, "\\text{g}"), false, false, false),
    					listen_dev(button134, "click", /*latexInput*/ ctx[0].bind(this, "\\text{m}"), false, false, false),
    					listen_dev(button135, "click", /*latexInput*/ ctx[0].bind(this, "\\text{L}"), false, false, false),
    					listen_dev(button136, "click", /*latexInput*/ ctx[0].bind(this, "\\text{s}"), false, false, false),
    					listen_dev(button137, "click", /*latexInput*/ ctx[0].bind(this, "\\text{kg}"), false, false, false),
    					listen_dev(button138, "click", /*latexInput*/ ctx[0].bind(this, "\\text{km}"), false, false, false),
    					listen_dev(button139, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mL}"), false, false, false),
    					listen_dev(button140, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ms}"), false, false, false),
    					listen_dev(div89, "click", /*latexInput*/ ctx[0].bind(this, "x"), false, false, false),
    					listen_dev(div91, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button141, "click", /*input*/ ctx[1].bind(this, "\lt"), false, false, false),
    					listen_dev(button142, "click", /*input*/ ctx[1].bind(this, "%"), false, false, false),
    					listen_dev(div93, "click", /*input*/ ctx[1].bind(this, "|"), false, false, false),
    					listen_dev(div96, "click", /*latexInput*/ ctx[0].bind(this, "y"), false, false, false),
    					listen_dev(div98, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button143, "click", /*input*/ ctx[1].bind(this, "\gt"), false, false, false),
    					listen_dev(button144, "click", /*latexInput*/ ctx[0].bind(this, "\\degree"), false, false, false),
    					listen_dev(button145, "click", /*input*/ ctx[1].bind(this, "\pi"), false, false, false),
    					listen_dev(div101, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div103, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button146, "click", /*input*/ ctx[1].bind(this, "±"), false, false, false),
    					listen_dev(div105, "click", /*input*/ ctx[1].bind(this, ":"), false, false, false),
    					listen_dev(div107, "click", /*input*/ ctx[1].bind(this, "\infin"), false, false, false),
    					listen_dev(div110, "click", /*input*/ ctx[1].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div112, "click", /*latexInput*/ ctx[0].bind(this, "\\_{}"), false, false, false),
    					listen_dev(div114, "click", /*latexInput*/ ctx[0].bind(this, "$"), false, false, false),
    					listen_dev(div116, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div120, "click", /*input*/ ctx[1].bind(this, "x"), false, false, false),
    					listen_dev(div122, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button148, "click", /*input*/ ctx[1].bind(this, "\lt"), false, false, false),
    					listen_dev(button149, "click", /*input*/ ctx[1].bind(this, "\pi"), false, false, false),
    					listen_dev(div125, "click", /*input*/ ctx[1].bind(this, "y"), false, false, false),
    					listen_dev(div127, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button151, "click", /*input*/ ctx[1].bind(this, "\gt"), false, false, false),
    					listen_dev(div129, "click", /*input*/ ctx[1].bind(this, "\infin"), false, false, false),
    					listen_dev(div133, "click", /*latexInput*/ ctx[0].bind(this, "\\^{2}"), false, false, false),
    					listen_dev(div135, "click", /*latexInput*/ ctx[0].bind(this, "\\^{}"), false, false, false),
    					listen_dev(button152, "click", /*input*/ ctx[1].bind(this, "±"), false, false, false),
    					listen_dev(div137, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div141, "click", /*input*/ ctx[1].bind(this, "\\sqrt"), false, false, false),
    					listen_dev(div143, "click", /*latexInput*/ ctx[0].bind(this, "\\sqrt[]{}"), false, false, false),
    					listen_dev(div145, "click", /*input*/ ctx[1].bind(this, "|"), false, false, false),
    					listen_dev(div147, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right]"), false, false, false),
    					listen_dev(button153, "click", /*input*/ ctx[1].bind(this, "&ne;"), false, false, false),
    					listen_dev(button154, "click", /*input*/ ctx[1].bind(this, "\lt"), false, false, false),
    					listen_dev(button155, "click", /*input*/ ctx[1].bind(this, "&le;"), false, false, false),
    					listen_dev(div152, "click", /*latexInput*/ ctx[0].bind(this, "\\ngtr"), false, false, false),
    					listen_dev(button156, "click", /*input*/ ctx[1].bind(this, "&asymp;"), false, false, false),
    					listen_dev(button157, "click", /*input*/ ctx[1].bind(this, "\gt"), false, false, false),
    					listen_dev(button158, "click", /*input*/ ctx[1].bind(this, "&ge;"), false, false, false),
    					listen_dev(div156, "click", /*latexInput*/ ctx[0].bind(this, "\\nless"), false, false, false),
    					listen_dev(button159, "click", /*latexInput*/ ctx[0].bind(this, "\\perp"), false, false, false),
    					listen_dev(button160, "click", /*latexInput*/ ctx[0].bind(this, "\\angle"), false, false, false),
    					listen_dev(button161, "click", /*latexInput*/ ctx[0].bind(this, "\\triangle"), false, false, false),
    					listen_dev(button162, "click", /*latexInput*/ ctx[0].bind(this, "\\degree"), false, false, false),
    					listen_dev(div162, "click", /*latexInput*/ ctx[0].bind(this, "\\\overline{ }"), false, false, false),
    					listen_dev(button163, "click", /*input*/ ctx[1].bind(this, "\parallel"), false, false, false),
    					listen_dev(button164, "click", /*latexInput*/ ctx[0].bind(this, "\\measuredangle"), false, false, false),
    					listen_dev(button165, "click", /*input*/ ctx[1].bind(this, "\circledot"), false, false, false),
    					listen_dev(button166, "click", /*input*/ ctx[1].bind(this, "&prime;"), false, false, false),
    					listen_dev(div165, "click", /*latexInput*/ ctx[0].bind(this, "\\\overrightarrow{ }"), false, false, false),
    					listen_dev(button167, "click", /*input*/ ctx[1].bind(this, "\\nparallel"), false, false, false),
    					listen_dev(button168, "click", /*input*/ ctx[1].bind(this, "\\sim"), false, false, false),
    					listen_dev(button169, "click", /*input*/ ctx[1].bind(this, "\\parallelogram"), false, false, false),
    					listen_dev(button170, "click", /*input*/ ctx[1].bind(this, "&prime;"), false, false, false),
    					listen_dev(button171, "click", /*latexInput*/ ctx[0].bind(this, "\\ldots"), false, false, false),
    					listen_dev(button172, "click", /*latexInput*/ ctx[0].bind(this, "\\ddots"), false, false, false),
    					listen_dev(button173, "click", /*input*/ ctx[1].bind(this, "\\cong"), false, false, false),
    					listen_dev(button174, "click", /*latexInput*/ ctx[0].bind(this, "\\vdots"), false, false, false),
    					listen_dev(button175, "click", /*input*/ ctx[1].bind(this, "&pi;"), false, false, false),
    					listen_dev(button176, "click", /*input*/ ctx[1].bind(this, "\\square"), false, false, false),
    					listen_dev(button177, "click", /*latexInput*/ ctx[0].bind(this, "\\subset"), false, false, false),
    					listen_dev(button178, "click", /*input*/ ctx[1].bind(this, "\\in"), false, false, false),
    					listen_dev(button179, "click", /*input*/ ctx[1].bind(this, "\\cup"), false, false, false),
    					listen_dev(button180, "click", /*input*/ ctx[1].bind(this, ","), false, false, false),
    					listen_dev(div171, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button181, "click", /*latexInput*/ ctx[0].bind(this, "\\supset"), false, false, false),
    					listen_dev(button182, "click", /*input*/ ctx[1].bind(this, "\\notin"), false, false, false),
    					listen_dev(button183, "click", /*input*/ ctx[1].bind(this, "\\cap"), false, false, false),
    					listen_dev(button184, "click", /*latexInput*/ ctx[0].bind(this, ":"), false, false, false),
    					listen_dev(div174, "click", /*latexInput*/ ctx[0].bind(this, "\\left\\{\\right\\}"), false, false, false),
    					listen_dev(button185, "click", /*latexInput*/ ctx[0].bind(this, "\\subseteq"), false, false, false),
    					listen_dev(button186, "click", /*latexInput*/ ctx[0].bind(this, "\\ni"), false, false, false),
    					listen_dev(button187, "click", /*input*/ ctx[1].bind(this, "\\varnothing"), false, false, false),
    					listen_dev(button188, "click", /*input*/ ctx[1].bind(this, "!"), false, false, false),
    					listen_dev(div177, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right)"), false, false, false),
    					listen_dev(button189, "click", /*input*/ ctx[1].bind(this, "\\supseteq"), false, false, false),
    					listen_dev(button190, "click", /*latexInput*/ ctx[0].bind(this, "\\not\subset"), false, false, false),
    					listen_dev(button192, "click", /*latexInput*/ ctx[0].bind(this, "\\backslash"), false, false, false),
    					listen_dev(div180, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right]"), false, false, false),
    					listen_dev(button193, "click", /*latexInput*/ ctx[0].bind(this, "\sin"), false, false, false),
    					listen_dev(button194, "click", /*input*/ ctx[1].bind(this, "\cos"), false, false, false),
    					listen_dev(button195, "click", /*latexInput*/ ctx[0].bind(this, "\\tan"), false, false, false),
    					listen_dev(button198, "click", /*latexInput*/ ctx[0].bind(this, "\sec"), false, false, false),
    					listen_dev(button199, "click", /*latexInput*/ ctx[0].bind(this, "\csc"), false, false, false),
    					listen_dev(button200, "click", /*input*/ ctx[1].bind(this, "\cot"), false, false, false),
    					listen_dev(button203, "click", /*latexInput*/ ctx[0].bind(this, "\\sin^{-1}"), false, false, false),
    					listen_dev(button204, "click", /*latexInput*/ ctx[0].bind(this, "\\cos^{-1}"), false, false, false),
    					listen_dev(button205, "click", /*latexInput*/ ctx[0].bind(this, "\\tan^{-1}"), false, false, false),
    					listen_dev(button208, "click", /*latexInput*/ ctx[0].bind(this, "\\sec^{-1}"), false, false, false),
    					listen_dev(button209, "click", /*latexInput*/ ctx[0].bind(this, "\\csc^{-1}"), false, false, false),
    					listen_dev(button210, "click", /*latexInput*/ ctx[0].bind(this, "\\cot^{-1}"), false, false, false),
    					listen_dev(button213, "click", /*latexInput*/ ctx[0].bind(this, "\\alpha"), false, false, false),
    					listen_dev(button214, "click", /*input*/ ctx[1].bind(this, "\\theta"), false, false, false),
    					listen_dev(button215, "click", /*input*/ ctx[1].bind(this, "\Theta"), false, false, false),
    					listen_dev(button216, "click", /*input*/ ctx[1].bind(this, "\\tau"), false, false, false),
    					listen_dev(button218, "click", /*latexInput*/ ctx[0].bind(this, "\\gamma"), false, false, false),
    					listen_dev(button219, "click", /*input*/ ctx[1].bind(this, "\\sigma"), false, false, false),
    					listen_dev(button220, "click", /*input*/ ctx[1].bind(this, "\Sigma"), false, false, false),
    					listen_dev(button221, "click", /*latexInput*/ ctx[0].bind(this, "\\varepsilon"), false, false, false),
    					listen_dev(button223, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button224, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta"), false, false, false),
    					listen_dev(button225, "click", /*input*/ ctx[1].bind(this, "\\lambda"), false, false, false),
    					listen_dev(button226, "click", /*input*/ ctx[1].bind(this, "\\beta"), false, false, false),
    					listen_dev(button228, "click", /*input*/ ctx[1].bind(this, "\\pi"), false, false, false),
    					listen_dev(button229, "click", /*latexInput*/ ctx[0].bind(this, "\\Pi"), false, false, false),
    					listen_dev(button230, "click", /*latexInput*/ ctx[0].bind(this, "\\phi"), false, false, false),
    					listen_dev(button233, "click", /*input*/ ctx[1].bind(this, "a"), false, false, false),
    					listen_dev(button234, "click", /*input*/ ctx[1].bind(this, "\\vert"), false, false, false),
    					listen_dev(button238, "click", /*input*/ ctx[1].bind(this, "b"), false, false, false),
    					listen_dev(button239, "click", /*latexInput*/ ctx[0].bind(this, "\\cdot"), false, false, false),
    					listen_dev(button243, "click", /*latexInput*/ ctx[0].bind(this, "\\propto"), false, false, false),
    					listen_dev(div196, "click", /*latexInput*/ ctx[0].bind(this, "\\longdiv{ }"), false, false, false),
    					listen_dev(button247, "click", /*latexInput*/ ctx[0].bind(this, "\\text{abc}"), false, false, false),
    					listen_dev(button248, "click", /*latexInput*/ ctx[0].bind(this, "\\mathbb{R}"), false, false, false),
    					listen_dev(button252, "click", /*latexInput*/ ctx[0].bind(this, "\\lfloor"), false, false, false),
    					listen_dev(button253, "click", /*input*/ ctx[1].bind(this, "\\uparrow"), false, false, false),
    					listen_dev(button254, "click", /*input*/ ctx[1].bind(this, "\\neg"), false, false, false),
    					listen_dev(button257, "click", /*latexInput*/ ctx[0].bind(this, "\\rfloor"), false, false, false),
    					listen_dev(button258, "click", /*input*/ ctx[1].bind(this, "\\equiv"), false, false, false),
    					listen_dev(button259, "click", /*input*/ ctx[1].bind(this, "\\exists"), false, false, false),
    					listen_dev(button262, "click", /*latexInput*/ ctx[0].bind(this, "\\lceil"), false, false, false),
    					listen_dev(button263, "click", /*latexInput*/ ctx[0].bind(this, "\\wedge"), false, false, false),
    					listen_dev(button264, "click", /*input*/ ctx[1].bind(this, "\\forall"), false, false, false),
    					listen_dev(button267, "click", /*input*/ ctx[1].bind(this, "\\rceil"), false, false, false),
    					listen_dev(button268, "click", /*latexInput*/ ctx[0].bind(this, "\\vee"), false, false, false),
    					listen_dev(button269, "click", /*latexInput*/ ctx[0].bind(this, "\\oplus"), false, false, false),
    					listen_dev(button272, "click", /*latexInput*/ ctx[0].bind(this, "\\text{g}"), false, false, false),
    					listen_dev(button273, "click", /*latexInput*/ ctx[0].bind(this, "\\text{m}"), false, false, false),
    					listen_dev(button274, "click", /*latexInput*/ ctx[0].bind(this, "\\text{L}"), false, false, false),
    					listen_dev(button275, "click", /*latexInput*/ ctx[0].bind(this, "\\text{s}"), false, false, false),
    					listen_dev(button277, "click", /*latexInput*/ ctx[0].bind(this, "\\text{kg}"), false, false, false),
    					listen_dev(button278, "click", /*latexInput*/ ctx[0].bind(this, "\\text{km}"), false, false, false),
    					listen_dev(button279, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mL}"), false, false, false),
    					listen_dev(button280, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ms}"), false, false, false),
    					listen_dev(button282, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mg}"), false, false, false),
    					listen_dev(button283, "click", /*latexInput*/ ctx[0].bind(this, "\\text{cm}"), false, false, false),
    					listen_dev(button287, "click", /*latexInput*/ ctx[0].bind(this, "\\text{&micro;g}"), false, false, false),
    					listen_dev(button288, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mm}"), false, false, false),
    					listen_dev(button292, "click", /*latexInput*/ ctx[0].bind(this, "\\text{oz}"), false, false, false),
    					listen_dev(button293, "click", /*latexInput*/ ctx[0].bind(this, "\\text{in}"), false, false, false),
    					listen_dev(button294, "click", /*latexInput*/ ctx[0].bind(this, "\\text{fl oz}"), false, false, false),
    					listen_dev(button297, "click", /*latexInput*/ ctx[0].bind(this, "\\text{lb}"), false, false, false),
    					listen_dev(button298, "click", /*latexInput*/ ctx[0].bind(this, "\\text{ft}"), false, false, false),
    					listen_dev(button299, "click", /*latexInput*/ ctx[0].bind(this, "\\text{pt}"), false, false, false),
    					listen_dev(button303, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mi}"), false, false, false),
    					listen_dev(button304, "click", /*latexInput*/ ctx[0].bind(this, "\\text{gal}"), false, false, false),
    					listen_dev(div215, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(div218, "click", /*latexInput*/ ctx[0].bind(this, "\\left[\\right]"), false, false, false),
    					listen_dev(div221, "click", /*latexInput*/ ctx[0].bind(this, "\\left\\{\\right\\}"), false, false, false),
    					listen_dev(button319, "click", /*latexInput*/ ctx[0].bind(this, "d"), false, false, false),
    					listen_dev(div225, "click", /*latexInput*/ ctx[0].bind(this, "\\left(\\right)"), false, false, false),
    					listen_dev(button323, "click", /*latexInput*/ ctx[0].bind(this, "f"), false, false, false),
    					listen_dev(div228, "click", /*latexInput*/ ctx[0].bind(this, "\\int_{ }^{ }"), false, false, false),
    					listen_dev(button327, "click", /*latexInput*/ ctx[0].bind(this, "\\Delta"), false, false, false),
    					listen_dev(div231, "click", /*latexInput*/ ctx[0].bind(this, "\\sum_{ }^{ }"), false, false, false),
    					listen_dev(div234, "click", /*input*/ ctx[1].bind(this, "/"), false, false, false),
    					listen_dev(button331, "click", /*latexInput*/ ctx[0].bind(this, "\\partial"), false, false, false),
    					listen_dev(div238, "click", /*latexInput*/ ctx[0].bind(this, "\^{}"), false, false, false),
    					listen_dev(button335, "click", /*input*/ ctx[1].bind(this, "\\rightarrow"), false, false, false),
    					listen_dev(div240, "click", /*latexInput*/ ctx[0].bind(this, "\\xrightarrow[]\\{}"), false, false, false),
    					listen_dev(div243, "click", /*latexInput*/ ctx[0].bind(this, "\_{}"), false, false, false),
    					listen_dev(button338, "click", /*input*/ ctx[1].bind(this, "\\leftarrow"), false, false, false),
    					listen_dev(button339, "click", /*latexInput*/ ctx[0].bind(this, "\\text{mol}"), false, false, false),
    					listen_dev(div246, "click", /*latexInput*/ ctx[0].bind(this, "\\_{ }^{ }"), false, false, false),
    					listen_dev(button342, "click", /*latexInput*/ ctx[0].bind(this, "\\rightleftharpoons"), false, false, false),
    					listen_dev(button343, "click", /*input*/ ctx[1].bind(this, "\\prime"), false, false, false),
    					listen_dev(div249, "click", /*latexInput*/ ctx[0].bind(this, "\\_{ }{}\\^{ }"), false, false, false),
    					listen_dev(button346, "click", /*latexInput*/ ctx[0].bind(this, "\\longleftrightarrow"), false, false, false),
    					listen_dev(div251, "click", /*latexInput*/ ctx[0].bind(this, "\\overset{ }\\{ }"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div255);
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
    	validate_slots('FillInTheBlanksToolbar', slots, []);
    	let { spanId } = $$props;
    	let { divId } = $$props;
    	let { action } = $$props;
    	let { show } = $$props;
    	let state = {};
    	let hdd = writable({ spanId: 0, divId: 'elem0' });

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
    		AH.trigger("#fillmain", 'change');
    	}

    	function input(valueOne) {
    		let fill = action;
    		fill.innerFields[spanId].cmd(valueOne);
    		fill.innerFields[spanId].focus();
    		AH.trigger("#fillmain", 'change');
    	}

    	function cursorEvent(eventTriger) {
    		// let customKeyDownEvent = $.Event('keydown');
    		let customeKeyDownEvent = new Event('keydown');

    		customKeyDownEvent.bubbles = true;
    		customKeyDownEvent.cancelable = true;

    		if (eventTriger == 'cursorFor') {
    			customKeyDownEvent.which = 39;
    		} else if (eventTriger == 'cursorBack') {
    			customKeyDownEvent.which = 37;
    		} else if (eventTriger == 'backspace') {
    			customKeyDownEvent.which = 8;
    		}

    		AH.selectAll('#' + divId + ' .mq-editable-field')[spanId].dispatchEvent(customKeyDownEvent);
    		AH.trigger("#fillmain", 'change');
    	}

    	function componentDidMount() {
    		window.addEventListener('click', e => {
    			let mathToolbar = document.getElementById('toolbar_container_one');

    			if (mathToolbar && !mathToolbar.contains(e.target)) {
    				//console.log(mathToolbar.contains(e.target));
    				closeToolbar();
    			}
    		});

    		AH.selectAll('.select_changer', 'hide');
    		AH.selectAll('#select_butns_2', 'show');

    		AH.bind('#selectbox', "change", event => {
    			let _this = event.target;
    			AH.selectAll('.select_changer', 'hide');
    			AH.selectAll('#select_butns_' + _this.value, 'show');

    			if (_this.value == "4") {
    				AH.setCss(".toolbar_container_one", { 'width': '481px' });
    			} else if (_this.value == "12" || _this.value == "13") {
    				AH.setCss(".toolbar_container_one", { 'width': '561px' });
    			} else {
    				AH.setCss(".toolbar_container_one", { 'width': '641px' });
    			}
    		});
    	}

    	function closeToolbar() {
    		show(false);
    	}

    	const writable_props = ['spanId', 'divId', 'action', 'show'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FillInTheBlanksToolbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('spanId' in $$props) $$invalidate(4, spanId = $$props.spanId);
    		if ('divId' in $$props) $$invalidate(5, divId = $$props.divId);
    		if ('action' in $$props) $$invalidate(6, action = $$props.action);
    		if ('show' in $$props) $$invalidate(7, show = $$props.show);
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
    		state,
    		hdd,
    		unsubscribe,
    		latexInput,
    		input,
    		cursorEvent,
    		componentDidMount,
    		closeToolbar
    	});

    	$$self.$inject_state = $$props => {
    		if ('spanId' in $$props) $$invalidate(4, spanId = $$props.spanId);
    		if ('divId' in $$props) $$invalidate(5, divId = $$props.divId);
    		if ('action' in $$props) $$invalidate(6, action = $$props.action);
    		if ('show' in $$props) $$invalidate(7, show = $$props.show);
    		if ('state' in $$props) state = $$props.state;
    		if ('hdd' in $$props) hdd = $$props.hdd;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [latexInput, input, cursorEvent, closeToolbar, spanId, divId, action, show];
    }

    class FillInTheBlanksToolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { spanId: 4, divId: 5, action: 6, show: 7 }, add_css$1);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FillInTheBlanksToolbar",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*spanId*/ ctx[4] === undefined && !('spanId' in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'spanId'");
    		}

    		if (/*divId*/ ctx[5] === undefined && !('divId' in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'divId'");
    		}

    		if (/*action*/ ctx[6] === undefined && !('action' in props)) {
    			console.warn("<FillInTheBlanksToolbar> was created without expected prop 'action'");
    		}

    		if (/*show*/ ctx[7] === undefined && !('show' in props)) {
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

    var css_248z = "/*\r\n * MathQuill master                http://mathquill.com\r\n * by Han, Jeanine, and Mary  maintainers@mathquill.com\r\n *\r\n * This Source Code Form is subject to the terms of the\r\n * Mozilla Public License, v. 2.0. If a copy of the MPL\r\n * was not distributed with this file, You can obtain\r\n * one at http://mozilla.org/MPL/2.0/.\r\n */\r\n@font-face {\r\n  font-family: Symbola;\r\n  src: url(font/Symbola.eot);\r\n  src: local(\"Symbola Regular\"), local(\"Symbola\"), url(font/Symbola.woff2) format(\"woff2\"), url(font/Symbola.woff) format(\"woff\"), url(font/Symbola.ttf) format(\"truetype\"), url(font/Symbola.otf) format(\"opentype\"), url(font/Symbola.svg#Symbola) format(\"svg\");\r\n}\r\n.mq-editable-field {\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-editable-field .mq-cursor {\r\n  border-left: 1px solid black;\r\n  margin-left: -1px;\r\n  position: relative;\r\n  z-index: 1;\r\n  padding: 0;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-editable-field .mq-cursor.mq-blink {\r\n  visibility: hidden;\r\n}\r\n.mq-editable-field,\r\n.mq-math-mode .mq-editable-field {\r\n  border: 1px solid gray;\r\n}\r\n.mq-editable-field.mq-focused,\r\n.mq-math-mode .mq-editable-field.mq-focused {\r\n  -webkit-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\r\n  -moz-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\r\n  box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\r\n  border-color: #709AC0;\r\n  border-radius: 1px;\r\n}\r\n.mq-math-mode .mq-editable-field {\r\n  margin: 2px;\r\n}\r\n.mq-editable-field .mq-latex-command-input {\r\n  color: inherit;\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n  border: 1px solid gray;\r\n  padding-right: 1px;\r\n  margin-right: 1px;\r\n  margin-left: 2px;\r\n}\r\n.mq-editable-field .mq-latex-command-input.mq-empty {\r\n  background: transparent;\r\n}\r\n.mq-editable-field .mq-latex-command-input.mq-hasCursor {\r\n  border-color: ActiveBorder;\r\n}\r\n.mq-editable-field.mq-empty:after,\r\n.mq-editable-field.mq-text-mode:after,\r\n.mq-math-mode .mq-empty:after {\r\n  visibility: hidden;\r\n  content: 'c';\r\n}\r\n.mq-editable-field .mq-cursor:only-child:after,\r\n.mq-editable-field .mq-textarea + .mq-cursor:last-child:after {\r\n  visibility: hidden;\r\n  content: 'c';\r\n}\r\n.mq-editable-field .mq-text-mode .mq-cursor:only-child:after {\r\n  content: '';\r\n}\r\n.mq-editable-field.mq-text-mode {\r\n  overflow-x: auto;\r\n  overflow-y: hidden;\r\n}\r\n.mq-root-block,\r\n.mq-math-mode .mq-root-block {\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n  width: 100%;\r\n  padding: 2px;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  vertical-align: middle;\r\n}\r\n.mq-math-mode {\r\n  font-variant: normal;\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 115%;\r\n  line-height: 1.4;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n  vertical-align: bottom;\r\n  background-image: none;\r\n  height: 99%;\r\n}\r\n.mq-math-mode .mq-non-leaf,\r\n.mq-math-mode .mq-scaled:not(.mq-sqrt-prefix) {\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-math-mode var,\r\n.mq-math-mode .mq-text-mode,\r\n.mq-math-mode .mq-nonSymbola {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n  line-height: .9;\r\n}\r\n.mq-math-mode * {\r\n  font-size: inherit;\r\n  line-height: inherit;\r\n  margin: 0;\r\n  padding: 0;\r\n  border-color: black;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  user-select: none;\r\n  box-sizing: border-box;\r\n}\r\n.mq-math-mode .mq-empty {\r\n  background: transparent;\r\n  /*border: 1px dotted;*/\r\n  padding: 0 3px;\r\n}\r\n.mq-math-mode .mq-empty.mq-root-block {\r\n  background: transparent;\r\n}\r\n.mq-math-mode.mq-empty {\r\n  background: transparent;\r\n}\r\n.mq-math-mode .mq-text-mode {\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-text-mode.mq-hasCursor {\r\n  box-shadow: inset darkgray 0 .1em .2em;\r\n  padding: 0 .1em;\r\n  margin: 0 -0.1em;\r\n  min-width: 1ex;\r\n}\r\n.mq-math-mode .mq-font {\r\n  font: 1em \"Times New Roman\", Symbola, serif;\r\n}\r\n.mq-math-mode .mq-font * {\r\n  font-family: inherit;\r\n  font-style: inherit;\r\n}\r\n.mq-math-mode b,\r\n.mq-math-mode b.mq-font {\r\n  font-weight: bolder;\r\n}\r\n.mq-math-mode var,\r\n.mq-math-mode i,\r\n.mq-math-mode i.mq-font {\r\n  font-style: normal;\r\n}\r\n.mq-math-mode var.mq-f {\r\n  margin-right: 0.2em;\r\n  margin-left: 0.1em;\r\n}\r\n.mq-math-mode .mq-roman var.mq-f {\r\n  margin: 0;\r\n}\r\n.mq-math-mode big {\r\n  font-size: 125%;\r\n}\r\n.mq-math-mode .mq-roman {\r\n  font-style: normal;\r\n}\r\n.mq-math-mode .mq-sans-serif {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n}\r\n.mq-math-mode .mq-monospace {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n}\r\n.mq-math-mode .mq-overline {\r\n  border-top: 1px solid black;\r\n  margin-top: 1px;\r\n}\r\n.mq-math-mode .mq-underline {\r\n  border-bottom: 1px solid black;\r\n  margin-bottom: 1px;\r\n}\r\n.mq-math-mode .mq-binary-operator {\r\n  padding: 0 0.2em;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-supsub {\r\n  font-size: 90%;\r\n  vertical-align: -0.5em;\r\n}\r\n.mq-math-mode .mq-supsub.mq-limit {\r\n  font-size: 80%;\r\n  vertical-align: -0.4em;\r\n}\r\n.mq-math-mode .mq-supsub.mq-sup-only {\r\n  vertical-align: .5em;\r\n}\r\n.mq-math-mode .mq-supsub.mq-sup-only .mq-sup {\r\n  display: inline-block;\r\n  vertical-align: text-bottom;\r\n}\r\n.mq-math-mode .mq-supsub .mq-sup {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-supsub .mq-sub {\r\n  display: block;\r\n  float: left;\r\n}\r\n.mq-math-mode .mq-supsub.mq-limit .mq-sub {\r\n  margin-left: -0.25em;\r\n}\r\n.mq-math-mode .mq-supsub .mq-binary-operator {\r\n  padding: 0 .1em;\r\n}\r\n.mq-math-mode .mq-supsub .mq-fraction {\r\n  font-size: 70%;\r\n}\r\n.mq-math-mode sup.mq-nthroot {\r\n  font-size: 80%;\r\n  vertical-align: 0.8em;\r\n  margin-right: -0.6em;\r\n  margin-left: .2em;\r\n  margin-top: 2px;\r\n  min-width: .5em;\r\n}\r\n.mq-math-mode .mq-paren {\r\n  padding: 0.2px; /* 0 .1em; changes*/\r\n  /* vertical-align: top; */\r\n  font-size: 28px;\r\n  vertical-align: middle;\r\n  display: initial;\r\n  -webkit-transform-origin: center .06em;\r\n  -moz-transform-origin: center .06em;\r\n  -ms-transform-origin: center .06em;\r\n  -o-transform-origin: center .06em;\r\n  transform-origin: center .06em;\r\n}\r\n.mq-math-mode .mq-paren.mq-ghost {\r\n  color: silver;\r\n}\r\n.mq-math-mode .mq-paren + span {\r\n  margin-top: .1em;\r\n  margin-bottom: .1em;\r\n}\r\n.mq-paren {\r\n  display: inline!important;\r\n}\r\n.mq-math-mode .mq-array {\r\n  vertical-align: middle;\r\n  text-align: center;\r\n}\r\n.mq-math-mode .mq-array > span {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-operator-name {\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n  line-height: .9;\r\n  font-style: normal;\r\n}\r\n.mq-math-mode var.mq-operator-name.mq-first {\r\n  padding-left: .2em;\r\n}\r\n.mq-math-mode var.mq-operator-name.mq-last {\r\n  padding-right: .2em;\r\n}\r\n.mq-math-mode .mq-fraction {\r\n  font-size: 90%;\r\n  text-align: center;\r\n  vertical-align: -0.4em;\r\n  padding: 0 .2em;\r\n}\r\n.mq-math-mode .mq-fraction,\r\n.mq-math-mode .mq-large-operator,\r\n.mq-math-mode x:-moz-any-link {\r\n  display: -moz-groupbox;\r\n}\r\n.mq-math-mode .mq-fraction,\r\n.mq-math-mode .mq-large-operator,\r\n.mq-math-mode x:-moz-any-link,\r\n.mq-math-mode x:default {\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-numerator,\r\n.mq-math-mode .mq-denominator {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-numerator {\r\n  padding: 0 0.1em;\r\n}\r\n.mq-math-mode .mq-denominator {\r\n  border-top: 1px solid;\r\n  float: right;\r\n  width: 100%;\r\n  padding: 0.1em;\r\n}\r\n.mq-math-mode .mq-sqrt-prefix {\r\n  padding-top: 0;\r\n  position: relative;\r\n  top: 0.1em;\r\n  vertical-align: top;\r\n  -webkit-transform-origin: top;\r\n  -moz-transform-origin: top;\r\n  -ms-transform-origin: top;\r\n  -o-transform-origin: top;\r\n  transform-origin: top;\r\n}\r\n.mq-math-mode .mq-sqrt-stem {\r\n  border-top: 1px solid;\r\n  margin-top: 1px;\r\n  padding-left: .15em;\r\n  padding-right: .2em;\r\n  margin-right: .1em;\r\n  padding-top: 1px;\r\n}\r\n.mq-math-mode .mq-vector-prefix {\r\n  display: block;\r\n  text-align: center;\r\n  line-height: .25em;\r\n  margin-bottom: -0.1em;\r\n  font-size: 0.75em;\r\n}\r\n.mq-math-mode .mq-vector-stem {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-large-operator {\r\n  text-align: center;\r\n}\r\n.mq-math-mode .mq-large-operator .mq-from,\r\n.mq-math-mode .mq-large-operator big,\r\n.mq-math-mode .mq-large-operator .mq-to {\r\n  display: block;\r\n}\r\n.mq-math-mode .mq-large-operator .mq-from,\r\n.mq-math-mode .mq-large-operator .mq-to {\r\n  font-size: 80%;\r\n}\r\n.mq-math-mode .mq-large-operator .mq-from {\r\n  float: right;\r\n  /* take out of normal flow to manipulate baseline */\r\n  width: 100%;\r\n}\r\n.mq-math-mode,\r\n.mq-math-mode .mq-editable-field {\r\n  cursor: text;\r\n  padding: 0 4px;\r\n  position: relative;\r\n  top: 2px;\r\n  font-family: Helvetica,Arial,'Times New Roman',Verdana,sans-serif;;\r\n}\r\n.mq-math-mode .mq-overarrow {\r\n  border-top: 1px solid black;\r\n  margin-top: 1px;\r\n  padding-top: 0.2em;\r\n}\r\n.mq-math-mode .mq-overarrow:before {\r\n  display: block;\r\n  position: relative;\r\n  top: -0.34em;\r\n  font-size: 0.5em;\r\n  line-height: 0em;\r\n  content: '\\27A4';\r\n  text-align: right;\r\n}\r\n.mq-math-mode .mq-overarrow.mq-arrow-left:before {\r\n  -moz-transform: scaleX(-1);\r\n  -o-transform: scaleX(-1);\r\n  -webkit-transform: scaleX(-1);\r\n  transform: scaleX(-1);\r\n  filter: FlipH;\r\n  -ms-filter: \"FlipH\";\r\n}\r\n.mq-math-mode .mq-selection,\r\n.mq-editable-field .mq-selection,\r\n.mq-math-mode .mq-selection .mq-non-leaf,\r\n.mq-editable-field .mq-selection .mq-non-leaf,\r\n.mq-math-mode .mq-selection .mq-scaled,\r\n.mq-editable-field .mq-selection .mq-scaled {\r\n  background: #B4D5FE !important;\r\n  background: Highlight !important;\r\n  color: HighlightText;\r\n  border-color: HighlightText;\r\n}\r\n.mq-math-mode .mq-selection .mq-matrixed,\r\n.mq-editable-field .mq-selection .mq-matrixed {\r\n  background: #39F !important;\r\n}\r\n.mq-math-mode .mq-selection .mq-matrixed-container,\r\n.mq-editable-field .mq-selection .mq-matrixed-container {\r\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#3399FF') !important;\r\n}\r\n.mq-math-mode .mq-selection.mq-blur,\r\n.mq-editable-field .mq-selection.mq-blur,\r\n.mq-math-mode .mq-selection.mq-blur .mq-non-leaf,\r\n.mq-editable-field .mq-selection.mq-blur .mq-non-leaf,\r\n.mq-math-mode .mq-selection.mq-blur .mq-scaled,\r\n.mq-editable-field .mq-selection.mq-blur .mq-scaled,\r\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed,\r\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed {\r\n  background: #D4D4D4 !important;\r\n  color: black;\r\n  border-color: black;\r\n}\r\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed-container,\r\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed-container {\r\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#D4D4D4') !important;\r\n}\r\n.mq-editable-field .mq-textarea,\r\n.mq-math-mode .mq-textarea {\r\n  position: relative;\r\n  -webkit-user-select: text;\r\n  -moz-user-select: text;\r\n  user-select: text;\r\n}\r\n.mq-editable-field .mq-textarea *,\r\n.mq-math-mode .mq-textarea *,\r\n.mq-editable-field .mq-selectable,\r\n.mq-math-mode .mq-selectable {\r\n  -webkit-user-select: text;\r\n  -moz-user-select: text;\r\n  user-select: text;\r\n  position: absolute;\r\n  clip: rect(1em 1em 1em 1em);\r\n  -webkit-transform: scale(0);\r\n  -moz-transform: scale(0);\r\n  -ms-transform: scale(0);\r\n  -o-transform: scale(0);\r\n  transform: scale(0);\r\n  resize: none;\r\n  width: 1px;\r\n  height: 1px;\r\n}\r\n.mq-math-mode .mq-matrixed {\r\n  background: white;\r\n  display: -moz-inline-box;\r\n  display: inline-block;\r\n}\r\n.mq-math-mode .mq-matrixed-container {\r\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='white');\r\n  margin-top: -0.1em;\r\n}\r\n";
    styleInject(css_248z);

    /* clsSMFill\FillInTheBlanksPreview.svelte generated by Svelte v3.40.2 */

    const { console: console_1 } = globals;

    const file$2 = "clsSMFill\\FillInTheBlanksPreview.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-1nxwwqo", "xmp{display:inline}#fillmain{overflow:hidden;max-width:1024px;text-align:left}#fillmain pre{background:none;border:none;font-size:14px!important}#fillmain .string{min-height:50px;margin-top:10px;margin-right:10px}#fillmain .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}#fillmain .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}#fillmain .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}#fillmain input[type=\"text\"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}#fillmain .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}#fillmain .drag-resize.dragable{cursor:move}#fillmain .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}#fillmain .fillcheck ul{width:220px}#fillmain .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}#fillmain .select{font-size:15px}#fillmain .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}#fillmain .dragable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}#fillmain .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}#fillmain select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#555;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Helvetica,Arial,'Times New Roman',Verdana,sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.prettyprint{display:-ms-grid!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbEluVGhlQmxhbmtzUHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBbzRCUyxHQUFHLEFBQUUsQ0FBQyxBQUNiLE9BQU8sQ0FBRSxNQUFNLEFBQ2hCLENBQUMsQUFDTyxTQUFTLEFBQUUsQ0FBQyxBQUNuQixTQUFTLE1BQU0sQ0FDZixVQUFVLE1BQU0sQ0FDaEIsV0FBVyxJQUFJLEFBQ2hCLENBQUMsQUFDTyxhQUFhLEFBQUUsQ0FBQyxBQUN2QixVQUFVLENBQUUsSUFBSSxDQUNoQixNQUFNLENBQUUsSUFBSSxDQUNaLFNBQVMsQ0FBRSxJQUFJLFVBQVUsQUFDMUIsQ0FBQyxBQUNPLGlCQUFpQixBQUFFLENBQUMsQUFDM0IsV0FBVyxJQUFJLENBQ2YsV0FBVyxJQUFJLENBQ2YsYUFBYSxJQUFJLEFBQ2xCLENBQUMsQUFDTyxvQkFBb0IsQUFBRSxDQUFDLEFBQzlCLFNBQVMsUUFBUSxDQUNqQixVQUFVLENBQUUsSUFBSSxDQUNoQixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsVUFBVSxDQUFFLElBQUksQUFDakIsQ0FBQyxBQUNPLDhCQUE4QixBQUFFLENBQUMsQUFDeEMsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLEtBQUssQ0FDVixLQUFLLENBQUUsR0FBRyxDQUNWLEtBQUssQ0FBRSxDQUFDLENBQ1IsTUFBTSxDQUFFLENBQUMsQ0FDVCxXQUFXLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQ25DLFlBQVksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FDcEMsYUFBYSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUMvQixDQUFDLEFBQ08sbUJBQW1CLEFBQUUsQ0FBQyxBQUM3QixRQUFRLEdBQUcsQUFDWixDQUFDLEFBQ08sc0JBQXNCLEFBQUMsQ0FBQyxBQUMvQixPQUFPLElBQUksQ0FDWCxRQUFRLFlBQVksQ0FDcEIsU0FBUyxRQUFRLENBQ2pCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLE1BQU0sQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ25CLEdBQUcsQ0FBRSxJQUFJLEFBQ1YsQ0FBQyxBQUNPLHNCQUFzQixBQUFFLENBQUMsQUFDaEMsT0FBTyxJQUFJLENBQ1gsUUFBUSxZQUFZLENBQ3BCLFNBQVMsUUFBUSxDQUNqQixVQUFVLENBQUUsSUFBSSxDQUNoQixNQUFNLENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNuQixHQUFHLENBQUUsSUFBSSxBQUNWLENBQUMsQUFDTyxlQUFlLEFBQUUsQ0FBQyxBQUN6QixHQUFHLENBQUUsQ0FBQyxDQUFDLFVBQVUsQUFDbEIsQ0FBQyxBQUNPLGVBQWUsQUFBRSxDQUFDLEFBQ3pCLEdBQUcsQ0FBRSxHQUFHLENBQUMsVUFBVSxBQUNwQixDQUFDLEFBQ08sNEJBQTRCLEFBQVUsQ0FBQyxBQUM5QyxPQUFPLEdBQUcsVUFBVSxDQUNwQixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsSUFBSSxDQUNkLEtBQUssQ0FBRSxJQUFJLENBQ1gsU0FBUyxDQUFFLEtBQUssQUFDakIsQ0FBQyxBQUNPLHNCQUFzQixBQUFFLENBQUMsQUFDaEMsZUFBZSxNQUFNLENBQ3JCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3hCLFdBQVcsTUFBTSxDQUNqQixRQUFRLEdBQUcsQ0FDWCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ08sK0JBQStCLEFBQUcsQ0FBQyxBQUMxQyxPQUFPLElBQUksQUFDWixDQUFDLEFBQ08scUJBQXFCLEFBQUcsQ0FBQyxBQUNoQyxNQUFNLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FDaEMsVUFBVSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNsQyxPQUFPLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQ3hCLENBQUMsQUFDTyx1QkFBdUIsQUFBRSxDQUFDLEFBQ2pDLE1BQU0sS0FBSyxBQUNaLENBQUMsQUFDTyxnQ0FBZ0MsQUFBRSxDQUFDLEFBQzFDLGdCQUFnQixDQUFFLE9BQU8sQUFDMUIsQ0FBQyxBQUNPLGdEQUFnRCxBQUFFLENBQUMsQUFDMUQsS0FBSyxDQUFFLElBQUksQ0FDWCxLQUFLLENBQUUsSUFBSSxDQUNYLE9BQU8sQ0FBRSxHQUFHLENBQ1osUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQUFDWixDQUFDLEFBQ08sa0NBQWtDLEFBQUUsQ0FBQyxBQUM1QyxLQUFLLENBQUUsSUFBSSxDQUNYLEtBQUssQ0FBRSxJQUFJLENBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxTQUFTLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ08sZ0JBQWdCLEFBQUUsQ0FBQyxBQUN6QixPQUFPLENBQUcsTUFBTSxVQUFVLEFBQzVCLENBQUMsQUFDTyxpQkFBaUIsQUFBRSxDQUFDLEFBQzNCLFNBQVMsQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDTyxtQkFBbUIsQUFBRSxDQUFDLEFBQzdCLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGNBQWMsR0FBRyxDQUNqQixXQUFXLElBQUksQ0FDZixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRCxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEFBQzlDLENBQUMsQUFDTyxzQkFBc0IsQUFBRSxDQUFDLEFBQ2hDLE1BQU0sQ0FBRSxPQUFPLFVBQVUsQ0FDekIsT0FBTyxDQUFFLEdBQUcsVUFBVSxBQUN2QixDQUFDLEFBQ08sSUFBSSxBQUFFLENBQUMsQUFDZCxNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQVUsQUFDcEMsQ0FBQyxBQUNPLHlCQUF5QixBQUFFLENBQUMsQUFDbkMsVUFBVSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDdEYsT0FBTyxDQUFFLElBQUksQUFDZCxDQUFDLEFBRU8seUJBQXlCLEFBQUUsQ0FBQyxBQUNuQyxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUN0RixPQUFPLENBQUUsSUFBSSxBQUNkLENBQUMsQUFDTyxlQUFlLEFBQUUsQ0FBQyxBQUN6QixNQUFNLENBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEFBQ3pCLENBQUMsQUFFTyxVQUFVLEFBQUUsQ0FBQyxBQUNwQixnQkFBZ0IsQ0FBRSxJQUFJLFVBQVUsQUFDakMsQ0FBQyxBQUVPLDRCQUE0QixBQUFFLENBQUMsQUFDdEMsV0FBVyxDQUFFLEdBQUcsQUFDakIsQ0FBQyxBQUNPLGVBQWUsQUFBRSxDQUFDLEFBQ3pCLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQ2pCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsY0FBYyxHQUFHLENBQ2pCLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLHFCQUFxQixDQUFFLEdBQUcsQ0FDMUIsa0JBQWtCLENBQUUsR0FBRyxDQUN2QixhQUFhLENBQUUsR0FBRyxDQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsZ0JBQWdCLENBQUUsSUFBSSxDQUN0QixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLFdBQVcsQ0FBRSxTQUFTLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQ2pFLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRCxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQzdDLGtCQUFrQixDQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUM3RSxVQUFVLENBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEFBQ3RFLENBQUMsQUFFTyxxQkFBcUIsQUFBRSxDQUFDLEFBQy9CLFlBQVksQ0FBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNsQyxPQUFPLENBQUUsQ0FBQyxDQUNWLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQ2xGLGVBQWUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUMvRSxVQUFVLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQUFDM0UsQ0FBQyxBQUNPLDRCQUE0QixBQUFFLENBQUMsQUFDdEMsU0FBUyxRQUFRLENBQ2pCLE1BQU0sSUFBSSxDQUNWLE9BQU8sSUFBSSxDQUNYLE1BQU0sSUFBSSxDQUNWLElBQUksSUFBSSxDQUNSLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLE1BQU0sQ0FBQyxVQUFVLENBQzlCLE9BQU8sQ0FBRSxDQUFDLENBQUMsVUFBVSxBQUN0QixDQUFDLEFBQ08sU0FBUyxBQUFFLENBQUMsQUFDbkIsT0FBTyxDQUFFLElBQUksQ0FDYixRQUFRLENBQUUsUUFBUSxDQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osZ0JBQWdCLENBQUUsT0FBTyxDQUN6QixLQUFLLENBQUUsT0FBTyxDQUNkLEdBQUcsQ0FBRSxFQUFFLENBQ1AsV0FBVyxDQUFFLEdBQUcsQ0FDaEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLElBQUksQ0FBQyxVQUFVLEFBQ3hCLENBQUMsQUFDTyxZQUFZLEFBQUUsQ0FBQyxBQUN0QixPQUFPLElBQUksVUFBVSxBQUN0QixDQUFDLEFBQ08sWUFBWSxBQUFFLENBQUMsQUFDdEIsT0FBTyxDQUFFLFFBQVEsVUFBVSxBQUM1QixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkZpbGxJblRoZUJsYW5rc1ByZXZpZXcuc3ZlbHRlIl19 */");
    }

    // (875:3) {#if state.showToolbar}
    function create_if_block_1(ctx) {
    	let fillintheblankstoolbar;
    	let current;

    	fillintheblankstoolbar = new FillInTheBlanksToolbar({
    			props: {
    				spanId: /*state*/ ctx[6].spanId,
    				divId: /*state*/ ctx[6].divId,
    				action: /*ucFill*/ ctx[3].fillMath[/*fillId*/ ctx[5]],
    				show: /*toggleToolbar*/ ctx[10]
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(875:3) {#if state.showToolbar}",
    		ctx
    	});

    	return block;
    }

    // (886:4) {:else}
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
    		source: "(886:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (884:4) {#if state.matchtype == "0"}
    function create_if_block$1(ctx) {
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(884:4) {#if state.matchtype == \\\"0\\\"}",
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
    	let t2;
    	let div1;
    	let t3;
    	let div3;
    	let div2;
    	let t4;
    	let center0;
    	let div4_class_value;
    	let div4_matchtype_value;
    	let div4_multi_value;
    	let div4_ignoretype_value;
    	let div4_manual_grade_value;
    	let div4_totalcorrectans_value;
    	let div5_class_value;
    	let t5;
    	let textarea;
    	let current;

    	let itemhelper_props = {
    		handleReviewClick: /*handleReview*/ ctx[11],
    		reviewMode: /*isReview*/ ctx[0]
    	};

    	itemhelper = new ItemHelper({ props: itemhelper_props, $$inline: true });
    	/*itemhelper_binding*/ ctx[16](itemhelper);
    	itemhelper.$on("setReview", /*setReview*/ ctx[8]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[9]);
    	let if_block0 = /*state*/ ctx[6].showToolbar && create_if_block_1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[6].matchtype == "0") return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			center1 = element("center");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div1 = element("div");
    			if_block1.c();
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t4 = space();
    			center0 = element("center");
    			t5 = space();
    			textarea = element("textarea");
    			attr_dev(div0, "class", "string");
    			attr_dev(div0, "id", "previewArea");
    			add_location(div0, file$2, 873, 2, 31415);
    			set_style(div1, "color", "#b94a48");
    			set_style(div1, "margin-top", "5px");
    			attr_dev(div1, "class", "smnotes");
    			add_location(div1, file$2, 882, 3, 31664);
    			attr_dev(div2, "class", "arrow-up");
    			add_location(div2, file$2, 890, 4, 31956);
    			attr_dev(center0, "class", "dragArea");
    			add_location(center0, file$2, 891, 4, 31990);
    			attr_dev(div3, "class", "footerStr");
    			set_style(div3, "display", /*state*/ ctx[6].footerStr ? 'block' : 'none');
    			add_location(div3, file$2, 889, 3, 31873);
    			attr_dev(div4, "id", /*containerID*/ ctx[7]);
    			attr_dev(div4, "class", div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? 'pe-none' : null));
    			attr_dev(div4, "matchtype", div4_matchtype_value = /*state*/ ctx[6].matchtype);
    			attr_dev(div4, "multi", div4_multi_value = /*state*/ ctx[6].multi);
    			attr_dev(div4, "ignoretype", div4_ignoretype_value = /*state*/ ctx[6].ignoretype);
    			attr_dev(div4, "manual_grade", div4_manual_grade_value = /*manual_grade*/ ctx[1] || 0);
    			attr_dev(div4, "totalcorrectans", div4_totalcorrectans_value = /*state*/ ctx[6].totalcorrectans);
    			set_style(div4, "font-family", "\"Open Sans\",sans-serif");
    			set_style(div4, "font-size", "16px");
    			add_location(div4, file$2, 862, 2, 31091);
    			add_location(center1, file$2, 854, 1, 30891);
    			attr_dev(div5, "class", div5_class_value = /*xml*/ ctx[2] ? "mx-4 pl-2 pl-md-0" : "");
    			add_location(div5, file$2, 853, 0, 30845);
    			attr_dev(textarea, "class", "h");
    			attr_dev(textarea, "id", "special_module_user_xml");
    			add_location(textarea, file$2, 896, 0, 32067);
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
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t2);
    			append_dev(div4, div1);
    			if_block1.m(div1, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t4);
    			append_dev(div3, center0);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, textarea, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);

    			if (/*state*/ ctx[6].showToolbar) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div4, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 64) {
    				set_style(div3, "display", /*state*/ ctx[6].footerStr ? 'block' : 'none');
    			}

    			if (!current || dirty[0] & /*isReview*/ 1 && div4_class_value !== (div4_class_value = "fillmain " + (/*isReview*/ ctx[0] ? 'pe-none' : null))) {
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
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			/*itemhelper_binding*/ ctx[16](null);
    			destroy_component(itemhelper);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(textarea);
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
    				e.style.cssText = 'height:auto;overflow: auto;';
    				if (flag) if (window.isIE) e.style.cssText = 'height:' + (e.scrollHeight + 10) + 'px;overflow: hidden'; else e.style.cssText = 'height:' + e.scrollHeight + 'px;overflow: hidden';
    				clearTimeout(timer);
    			},
    			100
    		);
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FillInTheBlanksPreview', slots, []);
    	let { manual_grade } = $$props;
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	let { editorState } = $$props;
    	let { smValidate } = $$props;
    	let { showAns } = $$props;

    	// variable declaration
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
    		ucFill.setUpdate(updateModule.bind(this));
    		let mathItem = document.getElementById(containerID);

    		mathItem = mathItem
    		? mathItem.getElementsByClassName('mathquill')
    		: mathItem;

    		if (state.isMathquill) {
    			AH.selectAll("div" + ajax_eId, 'css', { 'overflow': 'auto' });
    		}

    		// Binding the events 
    		AH.bind(ajax_eId, 'click', displayAns);

    		AH.bind(ajax_eId, 'keyup', displayAns);
    		AH.bind(ajax_eId, 'change', displayAns);
    		AH.bind(ajax_eId, 'dragend', displayAns);
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
    			if (editorState && editorState.stopPreviewUpdate == true) return false;

    			// for loading the module on the basis of the updated the xml
    			loadModule();

    			// for adding the tabindex
    			setTimeout(
    				function () {
    					let node = document.getElementById('previewArea');

    					if (node.childNodes[0] && node.childNodes[0].nodeName == 'TABLE') {
    						node = document.querySelectorAll('#previewArea td');

    						for (let item in node) {
    							if (!node[item].firstElementChild && node[item].nodeName == 'TD') {
    								node[item].setAttribute('tabindex', '0');
    							}
    						}
    					} else {
    						for (let item in node.childNodes) {
    							if (node.childNodes[item].nodeType == 3) {
    								let txt = document.createElement("span");
    								txt.setAttribute('tabindex', '0');
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
    				answerType = answerType ? answerType[0].replace(/\||}%/gm, '') : '';

    				answerType = answerType.trim();

    				if (uaXMLNew && uaXMLNew._userAns) {
    					// storing the userans attribute value in useranswer
    					let id = "";

    					if (answerType == '' || answerType == 'c') {
    						// For textbox
    						id = `#elem${i} .fillintheblank`;
    					} else if (answerType == 'n') {
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
    						document.querySelector(id).setAttribute('userans', uaXMLNew._userAns);
    					}
    				}
    			});
    		}
    	}

    	// this function responsible for parsing the xml 
    	function parseXmlAuthoring(MYXML, uaXML = false) {
    		// fetching the cdata
    		console.log(MYXML);

    		cdata = MYXML.smxml.text.__cdata;
    		dragData = "";
    		CheckDuplicate = [];
    		dragID = 0;
    		$$invalidate(6, state.footerStr = false, state);
    		AH.selectAll(".smnotes", 'hide');

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

    		let answerType = '';
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
    				answerType = answerType ? answerType[0].replace(/\||}%/gm, '') : '';

    				answerType = answerType.trim();

    				// in case of textbox or codetype
    				if (answerType == '' || answerType == 'c') {
    					AH.selectAll(".smnotes", 'show');

    					// checking for the user ans
    					if (uaXMLNew) {
    						// create the textbox in the preview area with user ans
    						createTextbox(originalKey, i, uaXMLNew);
    					} else {
    						// create the textbox in the preview area
    						createTextbox(originalKey, i);
    					}
    				} else if (answerType == 'n') {
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
    					AH.selectAll(".smnotes", 'show');

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

    		AH.selectAll("#" + containerID, 'attr', { "totalcorrectans": totalMarks });

    		// Resolve html entity
    		cdata = AH.ignoreEnity(cdata);

    		// put the cdata in the previewarea
    		AH.find("#" + containerID, "#previewArea", { action: 'html', actionData: cdata });

    		// put the dragData in the dragarea
    		AH.find("#" + containerID, ".dragArea", { action: 'html', actionData: dragData });

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
    				if (AH.find(ajax_eId, ".prettyprint", 'all').length >= 1) {
    					if (AH.find(ajax_eId, ".prettyprint .L0", 'all').length == 0) {
    						if (typeof prettyPrint == 'function') {
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

    		if (AH.find(ajax_eId, "table.uc-table", 'all').length > 0) {
    			AH.find(ajax_eId, "table.uc-table", { action: 'addClass', actionData: 'font14' });

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

    		// For mathqul based 
    		if (xml.includes("user Response{")) window.isResetMath = true;

    		$$invalidate(6, state.showToolbar = false, state);

    		// show the answer and also bind the keys event for ada
    		ucFill.modeOn("on");

    		ucFill.showdragans(ajax_eId, 'u', 1);
    		AH.selectAll('.remed_disable', 'show');
    		autoresize(1);
    		let mathItem = document.getElementById(containerID);

    		mathItem = mathItem
    		? mathItem.getElementsByClassName('mathquill')
    		: mathItem;

    		if (mathItem) {
    			AH.setCss(ajax_eId, { "position": "relative" });
    			AH.insert(ajax_eId, "<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>", 'afterbegin');
    		}

    		displayAns();
    	}

    	// function calls when remediation mode is off
    	function unsetReview() {
    		$$invalidate(0, isReview = false);
    		AH.selectAll('.mathquill', 'css', { 'border': 'none' });
    		ucFill.modeOn();
    		AH.selectAll('.remed_disable, .corr_div', 'hide');
    		ucFill.showdragans(ajax_eId, 'u', 0);
    		let mathItem = document.getElementById(containerID);

    		mathItem = mathItem
    		? mathItem.getElementsByClassName('mathquill')
    		: mathItem;

    		autoresize();

    		if (mathItem) {
    			AH.selectAll(ajax_eId, 'css', { "position": "unset" });
    			AH.selectAll(".spinner-wrapper", 'remove');
    		}
    	}

    	// for displaying the answer
    	function displayAns() {
    		// check the ans and create user ans
    		let ans = ucFill.checkAns(ajax_eId);

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

    			if (x.getAttribute('id')) {
    				isFillId = false;
    				$$invalidate(5, fillId = x.getAttribute('id'));
    			}
    		}

    		let latexArray = [];

    		AH.selectAll("#" + fillId + " span.mq-editable-field").forEach(element => {
    			let commandId = x.getAttribute('mathquill-command-id');
    			latexArray.push(commandId);
    		});

    		let mathId = x.getAttribute('mathquill-command-id');
    		let indexId = latexArray.indexOf(mathId);
    		$$invalidate(6, state.spanId = indexId, state);
    		$$invalidate(6, state.divId = fillId, state);
    		$$invalidate(6, state.showToolbar = true, state);
    	}

    	function updateModule(key, value) {
    		$$invalidate(6, state[key] = value, state);

    		if (key == 'uxml') {
    			parsedUxml = XMLToJSON(state.uxml);

    			// parsing the authoring xml
    			updateUserAns(parsedUxml);
    		}
    	}

    	// for giving the uc-table style
    	function setSMNotes() {
    		if (AH.find(ajax_eId, "table.uc-table", 'all').length > 0) {
    			let tableWidth = AH.find(ajax_eId, "table.uc-table").clientWidth + 9;

    			AH.setCss(AH.find(ajax_eId, ".smnotes"), {
    				'width': tableWidth + "px",
    				'margin': "auto",
    				'padding-top': "5px"
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
    			if (_this.classList.contains('drag-resize')) {
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
    		let addMathquill = data[0].replace(/user Response/g, '\\MathQuillMathField');

    		// then spliting with ##
    		let splitData = addMathquill.split("##");

    		let randomKey = Math.floor(Math.random() * splitData.length);

    		// taking random option
    		let randomOption = splitData[randomKey];

    		// storing the randomOption in userasn by replacing the MathQuillMathField{(any value)} to MathQuillMathField{}
    		let userans = randomOption.replace(/MathQuillMathField{(.*?)}/g, 'MathQuillMathField{}');

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
    		} else if (randomOption.indexOf("\MathQuillMathField") > -1) {
    			anskey = randomOption;
    			defaultans = 1;
    		}

    		AH.selectAll('#elem' + i, 'hide');
    		let matheq = `<span id="elem${i}" class="auto_height edit_step fillmathelement mathquill" userAnsSeq="${randomKey}" userans="${userans}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1"></span>`;
    		let tag = `<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div><span  id="m${i}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${randomKey}" anskey="${anskey}" defaultans="${defaultans}" mathtype="1">${anskey}</span>${matheq}</div>`;

    		// rplacing the cdata
    		cdata = cdata.replace(originalData, tag);

    		let mqInterval = setInterval(
    			() => {
    				// checking the MathQuill function is defined or not
    				if (typeof MathQuill == "function") {
    					// if found clear the interval
    					clearInterval(mqInterval);

    					AH.selectAll('#elem' + i, 'show');

    					// According to API DOC: By default, MathQuill overwrites the global MathQuill variable when loaded. If you do not want this behavior, you can use this 
    					let MQ = MathQuill.getInterface(2);

    					AH.selectAll(".mathquill").forEach(_this => {
    						let mathItemId = _this.getAttribute('id');
    						let defaultans = _this.getAttribute('defaultans');

    						// adding the userans in the mathItemid
    						if (defaultans == 1) {
    							var latex = _this.getAttribute('userans');
    							AH.selectAll('#' + mathItemId, 'text', latex);
    						} else {
    							AH.selectAll('#' + mathItemId, 'text', _this.getAttribute('userans'));
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
    		let textbox = `<input type="text" class="fillintheblank ks" anskey="${anskey.trim()}" value="${userAnswer}" userans="${userAnswer}" defaultans="" haskeywords="" codetype="${codetype}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...txtWidth)}px;${csStyle}" />`;

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

    		let options = '<option value="">&nbsp;Please Select</option>';

    		// iterating through each options
    		AH.selectAll(optionsValue).forEach((_this, j) => {
    			// checking correct
    			let isCorrect = optionsValue[j].indexOf('*') == 0 ? "1" : "0";

    			// checking default selected value
    			let selected = optionsValue[j].indexOf('+') == 0
    			? 'selected="selected"'
    			: "";

    			// extracting value of the option
    			let innerVal = optionsValue[j].indexOf('*') == 0 || optionsValue[j].indexOf('+') == 0
    			? optionsValue[j].slice(1)
    			: optionsValue[j];

    			let userAnswer = "";

    			// checking for the user asn
    			if (uaXML) {
    				if (uaXML._userAns) {
    					selected = '';

    					// spliiting with , 
    					let sel = uaXML._userAns.split(",");

    					// checkimg for the option which is selected by the user
    					if (j == sel[0].trim() - 1) {
    						selected = 'selected="selected"';
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

    		let tag = `<div id="elem${i}" class="fillelement">${selectbox}</div>`;

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

    		let dropAns = '';

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
    		let drop = '<div id="elem' + i + '" tabindex="0" dropzone="1" class="drag-resize dropable ks" path="//s3.amazonaws.com/jigyaasa_content_static/" anskey="' + dropAns.slice(0, -1) + '" caption="" userans="' + userAnswer + '" droped="' + userAnswer + '" bgcolor="#FFFFCC" style="background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;">' + userAnswer + '</div>';

    		// replace the cdata
    		cdata = cdata.replace(originalData, drop);

    		$$invalidate(6, state.footerStr = true, state);
    	}

    	/*----------------------------------------------------------------- */
    	// for showing correct answer.
    	function correctAnswer() {
    		ucFill.showdragans(ajax_eId, 'c', 1);
    		AH.selectAll('.corr_div', 'show');
    		AH.selectAll('.remed_disable', 'show');
    		autoresize(1);
    	}

    	// for showing user answer.
    	function yourAnswer() {
    		ucFill.showdragans(ajax_eId, 'u', 1);
    		AH.selectAll('.corr_div', 'hide');
    		autoresize(1);
    	}

    	//To handle review toggle
    	function handleReview(mode, event) {
    		if (mode == 'c') {
    			correctAnswer();
    		} else {
    			yourAnswer();
    		}
    	}

    	const writable_props = [
    		'manual_grade',
    		'xml',
    		'uxml',
    		'isReview',
    		'editorState',
    		'smValidate',
    		'showAns'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<FillInTheBlanksPreview> was created with unknown prop '${key}'`);
    	});

    	function itemhelper_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			smControllerCallback = $$value;
    			$$invalidate(4, smControllerCallback);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('manual_grade' in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
    		if ('xml' in $$props) $$invalidate(2, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(12, uxml = $$props.uxml);
    		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ('editorState' in $$props) $$invalidate(13, editorState = $$props.editorState);
    		if ('smValidate' in $$props) $$invalidate(14, smValidate = $$props.smValidate);
    		if ('showAns' in $$props) $$invalidate(15, showAns = $$props.showAns);
    	};

    	$$self.$capture_state = () => ({
    		ucFill,
    		ItemHelper,
    		FillInTheBlanksToolbar,
    		writable,
    		beforeUpdate,
    		onMount,
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
    		if ('manual_grade' in $$props) $$invalidate(1, manual_grade = $$props.manual_grade);
    		if ('xml' in $$props) $$invalidate(2, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(12, uxml = $$props.uxml);
    		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ('editorState' in $$props) $$invalidate(13, editorState = $$props.editorState);
    		if ('smValidate' in $$props) $$invalidate(14, smValidate = $$props.smValidate);
    		if ('showAns' in $$props) $$invalidate(15, showAns = $$props.showAns);
    		if ('smControllerCallback' in $$props) $$invalidate(4, smControllerCallback = $$props.smControllerCallback);
    		if ('cdata' in $$props) cdata = $$props.cdata;
    		if ('dragData' in $$props) dragData = $$props.dragData;
    		if ('CheckDuplicate' in $$props) CheckDuplicate = $$props.CheckDuplicate;
    		if ('dragID' in $$props) dragID = $$props.dragID;
    		if ('errorCatchFlag' in $$props) errorCatchFlag = $$props.errorCatchFlag;
    		if ('fillMath' in $$props) fillMath = $$props.fillMath;
    		if ('fillId' in $$props) $$invalidate(5, fillId = $$props.fillId);
    		if ('parsedXml' in $$props) parsedXml = $$props.parsedXml;
    		if ('parsedUxml' in $$props) parsedUxml = $$props.parsedUxml;
    		if ('containerID' in $$props) $$invalidate(7, containerID = $$props.containerID);
    		if ('state' in $$props) $$invalidate(6, state = $$props.state);
    		if ('hdd' in $$props) hdd = $$props.hdd;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isReview*/ 1) {
    			 isReview ? setReview() : unsetReview();
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
    		containerID,
    		setReview,
    		unsetReview,
    		toggleToolbar,
    		handleReview,
    		uxml,
    		editorState,
    		smValidate,
    		showAns,
    		itemhelper_binding
    	];
    }

    class FillInTheBlanksPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				manual_grade: 1,
    				xml: 2,
    				uxml: 12,
    				isReview: 0,
    				editorState: 13,
    				smValidate: 14,
    				showAns: 15
    			},
    			add_css$2,
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

    		if (/*manual_grade*/ ctx[1] === undefined && !('manual_grade' in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'manual_grade'");
    		}

    		if (/*xml*/ ctx[2] === undefined && !('xml' in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[12] === undefined && !('uxml' in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'uxml'");
    		}

    		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'isReview'");
    		}

    		if (/*editorState*/ ctx[13] === undefined && !('editorState' in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'editorState'");
    		}

    		if (/*smValidate*/ ctx[14] === undefined && !('smValidate' in props)) {
    			console_1.warn("<FillInTheBlanksPreview> was created without expected prop 'smValidate'");
    		}

    		if (/*showAns*/ ctx[15] === undefined && !('showAns' in props)) {
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
