
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
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

    var tagViewCss = {style: `.tagin{display:none}.tagin-wrapper{display:flex;flex-wrap:wrap;height:auto;padding:calc(.375rem - 2px) calc(.75rem - 2px);position:relative;overflow:hidden;cursor:text}.tagin-wrapper.focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.tagin.is-valid+.tagin-wrapper,.was-validated .tagin:valid+.tagin-wrapper{border-color:#28a745}.tagin.is-invalid+.tagin-wrapper,.was-validated .tagin:invalid+.tagin-wrapper{border-color:#dc3545}.tagin-tag{border-radius:.25rem;color:#fff;border:0;padding:0 4px;display:inline-flex;align-items:center;height:24px;margin:2px;font-weight:300;background-color:#6c757d;transition:transform .1s}.tagin-tag-remove{margin-left:2px;width:18px;height:18px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-tag-remove:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-input{margin-left:2px;border-color:transparent;outline:0;border-width:1px 0;padding:0 2px 0 0;height:28px;color:#495057}.tagin-input:not(.tagin-input-hidden){width:4px;min-width:4px}.tagin-input-hidden{position:absolute;top:0;left:-9999px;overflow:hidden;visibility:hidden;white-space:nowrap`};

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
            window.JUITemp = {};
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
                    request.setRequestHeader("old-access-token", window.apiAccessToken);
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
                request.setRequestHeader("access-token", window.apiAccessToken);
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
                window.apiAccessToken = api.access_token;
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
            window.eventTracker = window.eventTracker || {};
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
        addScript(data, url, callback) {
            let sc = document.createElement("script");
            if (url) {
                sc.src = url;
                sc.async = true;
                sc.onload = function() { 
                    callback && callback();
                };
            } else {
                sc.innerHTML = data;
            }
            document.head.append(sc);
            return sc;
        }

        // used to genrate css links
        createLink(path) {
            let link = document.createElement('link');
            link.href = path;
            link.rel = "stylesheet";
            document.head.append(link);
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
            let elm = current.parentElement;
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
            let elm = current.parentElement;
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
        enableBsAll(selector, comp) {
            if (this.bsCat1.includes(comp)) {
                let triggerList = [].slice.call(document.querySelectorAll(selector));
                let fireList = triggerList.map(function (triggerElm) {
                    return new bootstrap[comp](triggerElm)
                });
                return fireList;
            } else {
                console.error("Bootstrap can't enable for this component name");
                return [];
            }
        }

        // Hide enabled bootstrap5 compoenents
        hideBsAll(fireList, comp) {
            if (this.bsCat1.includes(comp)) {
                fireList.forEach(function (elm) {
                    elm.hide();
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
                        if (typeof sendData.data[prop] != 'object') {
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
            let selected = this.extraSelectors.includes(action) ?  this.selectAction(selector, action) : (typeof selector == 'object' ? selector : document.querySelectorAll(selector));
            if (selected && selected.length > 0 && action) {
                selected.forEach((elm)=> this.jsAction(elm, {action, actionData}));
            }
            return selected;
        }

        // Select and enhance selector like jquery
        select(selector, action, actionData) {
            if (this.extraSelectors.includes(action) ) {
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
            if (window.eventTracker[selector]) {
                base.removeEventListener(eventName, window.eventTracker[selector]);
            }
            window.eventTracker[selector] = this.onListen.bind(this, selector, handler, base);
            base.addEventListener(eventName, window.eventTracker[selector]);
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

        // added the stylesheet in head
        createLink (path) {
            let link = document.createElement('link');
            link.href = path;
            link.rel = "stylesheet";
            document.head.append(link);
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
        url(url = window.location.href) {
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
            window.apiAccessToken = token;
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
            window.JUITemp[key] = value;
        }

        // get data from store
        get(key) {
            return window.JUITemp[key];
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
                case 'show': selected.style.display = "block";
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

    function onUserAnsChange(result) {
    	if (result) {
    		AH.select("#answer", "checked", result.ans ? true : false);
    		AH.select("#special_module_user_xml", "value", result.uXml);

    		if (typeof window == "object") {
    			ISSPECIALMODULEUSERXMLCHANGE = 1;

    			if (typeof calculatePoint != "undefined") {
    				calculatePoint(1, result.ans);
    			}
    		}
    	}
    }

    const AH = new JUI();
    const SSD = new JStore();

    /* helper\ItemHelper.svelte generated by Svelte v3.29.0 */

    const { document: document_1 } = globals;

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-ri6gyf-style";
    	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}";
    	append(document_1.head, style);
    }

    // (22:4) {#if reviewMode}
    function create_if_block(ctx) {
    	let center;
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			center = element("center");
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
    			attr(div, "class", "smControlerBtn");
    			attr(center, "class", "pb-2");
    		},
    		m(target, anchor) {
    			insert(target, center, anchor);
    			append(center, div);
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
    			if (detaching) detach(center);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let div;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*reviewMode*/ ctx[0] && create_if_block(ctx);

    	return {
    		c() {
    			div = element("div");
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
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, button0);
    			append(div, t0);
    			append(div, button1);
    			append(div, t1);
    			if (if_block) if_block.m(div, null);

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
    					if_block.m(div, null);
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
    		document.querySelectorAll(".smControlerBtn button").forEach(el => el.classList.toggle("active"));
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

    /* clsSMAlignMatch\showAnswer.svelte generated by Svelte v3.29.0 */

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (9:0) {#if jsondataCategory}
    function create_if_block$1(ctx) {
    	let table;
    	let tbody;
    	let tr;
    	let t;
    	let each_value_2 = /*jsondataCategory*/ ctx[0].categories;
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*objValues*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			table = element("table");
    			tbody = element("tbody");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(tr, "class", "remedcolumn height50");
    			attr(table, "class", "table");
    			attr(table, "id", "alignmatch-table");
    		},
    		m(target, anchor) {
    			insert(target, table, anchor);
    			append(table, tbody);
    			append(tbody, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append(tbody, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*jsondataCategory*/ 1) {
    				each_value_2 = /*jsondataCategory*/ ctx[0].categories;
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*correct_ans_bg, objValues, your_ans_class, state, user_ans_table*/ 62) {
    				each_value = /*objValues*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(table);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (13:16) {#each jsondataCategory.categories as obj}
    function create_each_block_2(ctx) {
    	let td;
    	let h3;
    	let t0_value = /*obj*/ ctx[12].text + "";
    	let t0;
    	let t1;
    	let td_key_value;

    	return {
    		c() {
    			td = element("td");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			attr(h3, "tabindex", "0");
    			attr(h3, "class", "m-0 font-italic");
    			attr(td, "key", td_key_value = /*obj*/ ctx[12].text + "_" + /*obj*/ ctx[12].id);
    			attr(td, "class", "steel-bg");
    		},
    		m(target, anchor) {
    			insert(target, td, anchor);
    			append(td, h3);
    			append(h3, t0);
    			append(td, t1);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*jsondataCategory*/ 1 && t0_value !== (t0_value = /*obj*/ ctx[12].text + "")) set_data(t0, t0_value);

    			if (dirty & /*jsondataCategory*/ 1 && td_key_value !== (td_key_value = /*obj*/ ctx[12].text + "_" + /*obj*/ ctx[12].id)) {
    				attr(td, "key", td_key_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(td);
    		}
    	};
    }

    // (21:20) {#if rowTagWise }
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*rowTagWise*/ ctx[6];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*objValues, your_ans_class, state, user_ans_table*/ 54) {
    				each_value_1 = /*rowTagWise*/ ctx[6];
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
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (51:62) 
    function create_if_block_6(ctx) {
    	let div;
    	let raw_value = /*col*/ ctx[9].label + "";
    	let div_title_value;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "elementText");
    			attr(div, "tabindex", "0");
    			attr(div, "title", div_title_value = /*col*/ ctx[9].label);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*objValues*/ 2 && raw_value !== (raw_value = /*col*/ ctx[9].label + "")) div.innerHTML = raw_value;
    			if (dirty & /*objValues*/ 2 && div_title_value !== (div_title_value = /*col*/ ctx[9].label)) {
    				attr(div, "title", div_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (41:36) {#if col.imagealt && col.imageurl && col.imageurl != ''}
    function create_if_block_5(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;

    	return {
    		c() {
    			div = element("div");
    			img = element("img");
    			attr(img, "class", "imagData");
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static//" + /*col*/ ctx[9].imageurl)) attr(img, "src", img_src_value);
    			attr(img, "tabindex", "0");
    			attr(img, "alt", img_alt_value = /*col*/ ctx[9].imagealt);
    			attr(img, "title", img_title_value = /*col*/ ctx[9].imagealt);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, img);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*objValues*/ 2 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static//" + /*col*/ ctx[9].imageurl)) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*objValues*/ 2 && img_alt_value !== (img_alt_value = /*col*/ ctx[9].imagealt)) {
    				attr(img, "alt", img_alt_value);
    			}

    			if (dirty & /*objValues*/ 2 && img_title_value !== (img_title_value = /*col*/ ctx[9].imagealt)) {
    				attr(img, "title", img_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (24:32) {#if user_ans_table == 1}
    function create_if_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*col*/ ctx[9].imagealt && /*col*/ ctx[9].imageurl && /*state*/ ctx[2].userAnswerArr[/*col*/ ctx[9].tags][/*ind*/ ctx[11]].imageurl != "") return create_if_block_3;
    		if (/*col*/ ctx[9].label != "") return create_if_block_4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (33:62) 
    function create_if_block_4(ctx) {
    	let div;
    	let raw_value = /*state*/ ctx[2].userAnswerArr[/*col*/ ctx[9].tags][/*ind*/ ctx[11]].label + "";
    	let div_title_value;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "elementText");
    			attr(div, "tabindex", "0");
    			attr(div, "title", div_title_value = /*col*/ ctx[9].label);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*state, objValues*/ 6 && raw_value !== (raw_value = /*state*/ ctx[2].userAnswerArr[/*col*/ ctx[9].tags][/*ind*/ ctx[11]].label + "")) div.innerHTML = raw_value;
    			if (dirty & /*objValues*/ 2 && div_title_value !== (div_title_value = /*col*/ ctx[9].label)) {
    				attr(div, "title", div_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (25:36) {#if col.imagealt && col.imageurl && state.userAnswerArr[col.tags][ind].imageurl != ''}
    function create_if_block_3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "class", "imagData");
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static//" + /*state*/ ctx[2].userAnswerArr[/*col*/ ctx[9].tags][/*ind*/ ctx[11]].imageurl)) attr(img, "src", img_src_value);
    			attr(img, "tabindex", "0");
    			attr(img, "alt", img_alt_value = /*col*/ ctx[9].imagealt);
    			attr(img, "title", img_title_value = /*col*/ ctx[9].imagealt);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*state, objValues*/ 6 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static//" + /*state*/ ctx[2].userAnswerArr[/*col*/ ctx[9].tags][/*ind*/ ctx[11]].imageurl)) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*objValues*/ 2 && img_alt_value !== (img_alt_value = /*col*/ ctx[9].imagealt)) {
    				attr(img, "alt", img_alt_value);
    			}

    			if (dirty & /*objValues*/ 2 && img_title_value !== (img_title_value = /*col*/ ctx[9].imagealt)) {
    				attr(img, "title", img_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (22:24) {#each rowTagWise as col, ind}
    function create_each_block_1(ctx) {
    	let td;
    	let t;
    	let td_key_value;
    	let td_col_value;
    	let td_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*user_ans_table*/ ctx[5] == 1) return create_if_block_2;
    		if (/*col*/ ctx[9].imagealt && /*col*/ ctx[9].imageurl && /*col*/ ctx[9].imageurl != "") return create_if_block_5;
    		if (/*col*/ ctx[9].label != "") return create_if_block_6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	return {
    		c() {
    			td = element("td");
    			if (if_block) if_block.c();
    			t = space();
    			attr(td, "key", td_key_value = /*ind*/ ctx[11]);
    			attr(td, "col", td_col_value = /*col*/ ctx[9].id);
    			attr(td, "class", td_class_value = "position-relative " + /*your_ans_class*/ ctx[4] + " align-middle column_" + (/*ind*/ ctx[11] + 1));
    		},
    		m(target, anchor) {
    			insert(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			append(td, t);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td, t);
    				}
    			}

    			if (dirty & /*objValues*/ 2 && td_col_value !== (td_col_value = /*col*/ ctx[9].id)) {
    				attr(td, "col", td_col_value);
    			}

    			if (dirty & /*your_ans_class*/ 16 && td_class_value !== (td_class_value = "position-relative " + /*your_ans_class*/ ctx[4] + " align-middle column_" + (/*ind*/ ctx[11] + 1))) {
    				attr(td, "class", td_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(td);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};
    }

    // (19:12) {#each objValues as rowTagWise, i}
    function create_each_block(ctx) {
    	let tr;
    	let t;
    	let tr_key_value;
    	let tr_class_value;
    	let if_block = /*rowTagWise*/ ctx[6] && create_if_block_1(ctx);

    	return {
    		c() {
    			tr = element("tr");
    			if (if_block) if_block.c();
    			t = space();
    			attr(tr, "key", tr_key_value = /*i*/ ctx[8]);
    			attr(tr, "class", tr_class_value = "" + (/*correct_ans_bg*/ ctx[3] + " remedcolumn row_" + (/*i*/ ctx[8] + 1)));
    		},
    		m(target, anchor) {
    			insert(target, tr, anchor);
    			if (if_block) if_block.m(tr, null);
    			append(tr, t);
    		},
    		p(ctx, dirty) {
    			if (/*rowTagWise*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(tr, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*correct_ans_bg*/ 8 && tr_class_value !== (tr_class_value = "" + (/*correct_ans_bg*/ ctx[3] + " remedcolumn row_" + (/*i*/ ctx[8] + 1)))) {
    				attr(tr, "class", tr_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(tr);
    			if (if_block) if_block.d();
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*jsondataCategory*/ ctx[0] && create_if_block$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*jsondataCategory*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { jsondataCategory } = $$props;
    	let { objValues } = $$props;
    	let { state } = $$props;
    	let { correct_ans_bg = "" } = $$props;
    	let { your_ans_class = "" } = $$props;
    	let { user_ans_table } = $$props;

    	$$self.$$set = $$props => {
    		if ("jsondataCategory" in $$props) $$invalidate(0, jsondataCategory = $$props.jsondataCategory);
    		if ("objValues" in $$props) $$invalidate(1, objValues = $$props.objValues);
    		if ("state" in $$props) $$invalidate(2, state = $$props.state);
    		if ("correct_ans_bg" in $$props) $$invalidate(3, correct_ans_bg = $$props.correct_ans_bg);
    		if ("your_ans_class" in $$props) $$invalidate(4, your_ans_class = $$props.your_ans_class);
    		if ("user_ans_table" in $$props) $$invalidate(5, user_ans_table = $$props.user_ans_table);
    	};

    	return [
    		jsondataCategory,
    		objValues,
    		state,
    		correct_ans_bg,
    		your_ans_class,
    		user_ans_table
    	];
    }

    class ShowAnswer extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			jsondataCategory: 0,
    			objValues: 1,
    			state: 2,
    			correct_ans_bg: 3,
    			your_ans_class: 4,
    			user_ans_table: 5
    		});
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

    };
    window.LANG = l;
    var language = l;

    /* clsSMAlignMatch\AlignMatchPreview.svelte generated by Svelte v3.29.0 */

    const { window: window_1 } = globals;

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	child_ctx[38] = i;
    	return child_ctx;
    }

    // (668:12) {#if state.xml}
    function create_if_block_3$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*state*/ ctx[2].xml.category.categories;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*nextbutton, state, onImgLoad, ignoreItemIds, prevbutton*/ 964) {
    				each_value = /*state*/ ctx[2].xml.category.categories;
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
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (682:44) {#if datai.id == dataj.category && (ignoreItemIds.indexOf(dataj.id) == -1)}
    function create_if_block_4$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*state*/ ctx[2].correct_match["category_" + /*dataj*/ ctx[39].sequence] == false && create_if_block_5$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (/*state*/ ctx[2].correct_match["category_" + /*dataj*/ ctx[39].sequence] == false) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (683:48) {#if state.correct_match['category_'+ dataj.sequence] == false}
    function create_if_block_5$1(ctx) {
    	let div;
    	let t;
    	let div_seq_no_value;
    	let div_key_value;
    	let div_data_tags_value;

    	function select_block_type(ctx, dirty) {
    		if (/*dataj*/ ctx[39].imageurl != "") return create_if_block_6$1;
    		if (/*dataj*/ ctx[39].label != "") return create_if_block_7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr(div, "class", "element bg-white m-0");
    			attr(div, "seq_no", div_seq_no_value = "category_" + /*dataj*/ ctx[39].sequence);
    			attr(div, "key", div_key_value = /*dataj*/ ctx[39].id);
    			attr(div, "data-tags", div_data_tags_value = /*dataj*/ ctx[39].tags);
    			set_style(div, "display", "none");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append(div, t);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}

    			if (dirty[0] & /*state*/ 4 && div_seq_no_value !== (div_seq_no_value = "category_" + /*dataj*/ ctx[39].sequence)) {
    				attr(div, "seq_no", div_seq_no_value);
    			}

    			if (dirty[0] & /*state*/ 4 && div_key_value !== (div_key_value = /*dataj*/ ctx[39].id)) {
    				attr(div, "key", div_key_value);
    			}

    			if (dirty[0] & /*state*/ 4 && div_data_tags_value !== (div_data_tags_value = /*dataj*/ ctx[39].tags)) {
    				attr(div, "data-tags", div_data_tags_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};
    }

    // (687:84) 
    function create_if_block_7(ctx) {
    	let div;
    	let raw_value = /*dataj*/ ctx[39].label + "";
    	let div_title_value;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "elementText");
    			attr(div, "tabindex", "0");
    			attr(div, "title", div_title_value = /*dataj*/ ctx[39].label);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && raw_value !== (raw_value = /*dataj*/ ctx[39].label + "")) div.innerHTML = raw_value;
    			if (dirty[0] & /*state*/ 4 && div_title_value !== (div_title_value = /*dataj*/ ctx[39].label)) {
    				attr(div, "title", div_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (685:56) {#if dataj.imageurl != ''}
    function create_if_block_6$1(ctx) {
    	let img;
    	let img_data_check_value;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "data-check", img_data_check_value = /*index*/ ctx[38]);
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static//" + /*dataj*/ ctx[39].imageurl)) attr(img, "src", img_src_value);
    			attr(img, "class", "img-fluid");
    			attr(img, "tabindex", "0");

    			attr(img, "alt", img_alt_value = /*dataj*/ ctx[39].imagealt
    			? /*dataj*/ ctx[39].imagealt
    			: "No alt of image");

    			attr(img, "title", img_title_value = /*dataj*/ ctx[39].imagealt
    			? /*dataj*/ ctx[39].imagealt
    			: "No alt of image");
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);

    			if (!mounted) {
    				dispose = listen(img, "load", /*onImgLoad*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static//" + /*dataj*/ ctx[39].imageurl)) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*state*/ 4 && img_alt_value !== (img_alt_value = /*dataj*/ ctx[39].imagealt
    			? /*dataj*/ ctx[39].imagealt
    			: "No alt of image")) {
    				attr(img, "alt", img_alt_value);
    			}

    			if (dirty[0] & /*state*/ 4 && img_title_value !== (img_title_value = /*dataj*/ ctx[39].imagealt
    			? /*dataj*/ ctx[39].imagealt
    			: "No alt of image")) {
    				attr(img, "title", img_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (681:40) {#each state.xml.item.items as dataj}
    function create_each_block_1$1(ctx) {
    	let show_if = /*datai*/ ctx[36].id == /*dataj*/ ctx[39].category && /*ignoreItemIds*/ ctx[6].indexOf(/*dataj*/ ctx[39].id) == -1;
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_4$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4) show_if = /*datai*/ ctx[36].id == /*dataj*/ ctx[39].category && /*ignoreItemIds*/ ctx[6].indexOf(/*dataj*/ ctx[39].id) == -1;

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (669:16) {#each state.xml.category.categories as datai, index}
    function create_each_block$1(ctx) {
    	let div8;
    	let div0;
    	let div0_class_value;
    	let t0;
    	let div6;
    	let div2;
    	let div1;
    	let raw_value = /*datai*/ ctx[36].text + "";
    	let div1_title_value;
    	let t1;
    	let div5;
    	let div4;
    	let div3;
    	let div5_class_value;
    	let t2;
    	let div7;
    	let div7_class_value;
    	let t3;
    	let div8_key_value;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*state*/ ctx[2].xml.item.items;
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	return {
    		c() {
    			div8 = element("div");
    			div0 = element("div");
    			div0.innerHTML = `<span class="icomoon-arrow-left font26 btnGrp"></span>`;
    			t0 = space();
    			div6 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div7 = element("div");
    			div7.innerHTML = `<span class="icomoon-arrow-right-2 font26 btnGrp"></span>`;
    			t3 = space();
    			attr(div0, "class", div0_class_value = "prevbutton col-lg-1 col-md-1 col-sm-2 col-2 px-sm-3 px-0 prevbutton_" + /*index*/ ctx[38]);
    			attr(div0, "tabindex", "0");
    			attr(div0, "title", "previous");
    			attr(div1, "class", "font20 text-center text-dark");
    			attr(div1, "tabindex", "0");
    			attr(div1, "title", div1_title_value = /*datai*/ ctx[36].text);
    			attr(div2, "class", "categorytitle card_border");
    			attr(div3, "class", "elementContainer w-100 h-100 d-table");
    			attr(div4, "class", "categoryiteminnercontainer w-100 h-100 text-center");
    			attr(div5, "class", div5_class_value = "categoryitemcontainer p-1 categoryitemcontainer_" + /*index*/ ctx[38]);
    			attr(div6, "class", "categoryinnercontainer p-0 r-lg col-lg-10 col-md-10 col-sm-8 col-8");
    			attr(div7, "class", div7_class_value = "nextbutton col-md-1 col-lg-1 col-sm-2 col-2 px-sm-3 px-0 nextbutton_" + /*index*/ ctx[38]);
    			attr(div7, "tabindex", "0");
    			attr(div7, "title", "next");
    			attr(div8, "class", "row np mb-3");
    			attr(div8, "key", div8_key_value = /*index*/ ctx[38]);
    		},
    		m(target, anchor) {
    			insert(target, div8, anchor);
    			append(div8, div0);
    			append(div8, t0);
    			append(div8, div6);
    			append(div6, div2);
    			append(div2, div1);
    			div1.innerHTML = raw_value;
    			append(div6, t1);
    			append(div6, div5);
    			append(div5, div4);
    			append(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append(div8, t2);
    			append(div8, div7);
    			append(div8, t3);

    			if (!mounted) {
    				dispose = [
    					listen(div0, "click", prevent_default(/*prevbutton*/ ctx[8])),
    					listen(div0, "keydown", keydownAda),
    					listen(div7, "click", /*nextbutton*/ ctx[9]),
    					listen(div7, "keydown", keydownAda)
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && raw_value !== (raw_value = /*datai*/ ctx[36].text + "")) div1.innerHTML = raw_value;
    			if (dirty[0] & /*state*/ 4 && div1_title_value !== (div1_title_value = /*datai*/ ctx[36].text)) {
    				attr(div1, "title", div1_title_value);
    			}

    			if (dirty[0] & /*state, onImgLoad, ignoreItemIds*/ 196) {
    				each_value_1 = /*state*/ ctx[2].xml.item.items;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div8);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (706:12) {#if AH.get('alignMatchReset') == true}
    function create_if_block_2$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			button.textContent = `${language.reset}`;
    			attr(button, "type", "button");
    			attr(button, "id", "reset_btn");
    			attr(button, "class", "btn btn-primary me-sm-2 me-0 mb-2 reset_btn");
    			button.disabled = "disabled";
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (!mounted) {
    				dispose = listen(button, "click", /*resetButton*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (709:12) {#if state.xml}
    function create_if_block_1$1(ctx) {
    	let button;
    	let t_value = /*state*/ ctx[2].xml.settings.matchButtonText + "";
    	let t;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			t = text(t_value);
    			attr(button, "type", "button");
    			attr(button, "class", "matchbutton btn btn-primary mb-2");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, t);

    			if (!mounted) {
    				dispose = listen(button, "click", /*matchButton*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && t_value !== (t_value = /*state*/ ctx[2].xml.settings.matchButtonText + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (714:4) {#if targetView == 'block'}
    function create_if_block$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let showanswer0;
    	let t;
    	let div1;
    	let showanswer1;
    	let current;

    	showanswer0 = new ShowAnswer({
    			props: {
    				jsondataCategory: /*jsonData*/ ctx[1].category,
    				objValues: objectValues(/*correctAnswerArray*/ ctx[5]),
    				state: /*state*/ ctx[2],
    				correct_ans_bg: "typeCorrect"
    			}
    		});

    	showanswer1 = new ShowAnswer({
    			props: {
    				user_ans_table: "1",
    				jsondataCategory: /*jsonData*/ ctx[1].category,
    				objValues: objectValues(/*correctAnswerArray*/ ctx[5]),
    				state: /*state*/ ctx[2],
    				your_ans_class: "your_ans_td"
    			}
    		});

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(showanswer0.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(showanswer1.$$.fragment);
    			attr(div0, "class", "correctAnswer h");
    			attr(div1, "class", "yourAnswer");
    			attr(div2, "class", "scoreDiv");
    			attr(div3, "class", "finalResult");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			mount_component(showanswer0, div0, null);
    			append(div2, t);
    			append(div2, div1);
    			mount_component(showanswer1, div1, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const showanswer0_changes = {};
    			if (dirty[0] & /*jsonData*/ 2) showanswer0_changes.jsondataCategory = /*jsonData*/ ctx[1].category;
    			if (dirty[0] & /*correctAnswerArray*/ 32) showanswer0_changes.objValues = objectValues(/*correctAnswerArray*/ ctx[5]);
    			if (dirty[0] & /*state*/ 4) showanswer0_changes.state = /*state*/ ctx[2];
    			showanswer0.$set(showanswer0_changes);
    			const showanswer1_changes = {};
    			if (dirty[0] & /*jsonData*/ 2) showanswer1_changes.jsondataCategory = /*jsonData*/ ctx[1].category;
    			if (dirty[0] & /*correctAnswerArray*/ 32) showanswer1_changes.objValues = objectValues(/*correctAnswerArray*/ ctx[5]);
    			if (dirty[0] & /*state*/ 4) showanswer1_changes.state = /*state*/ ctx[2];
    			showanswer1.$set(showanswer1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(showanswer0.$$.fragment, local);
    			transition_in(showanswer1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(showanswer0.$$.fragment, local);
    			transition_out(showanswer1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    			destroy_component(showanswer0);
    			destroy_component(showanswer1);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let div4;
    	let div0;
    	let itemhelper;
    	let t0;
    	let link;
    	let link_href_value;
    	let t1;
    	let div3;
    	let div1;
    	let div1_class_value;
    	let t2;
    	let div2;
    	let show_if = AH.get("alignMatchReset") == true;
    	let t3;
    	let div3_class_value;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[20]);

    	itemhelper = new ItemHelper({
    			props: {
    				reviewMode: /*isReview*/ ctx[0],
    				handleReviewClick: /*handleReviewMode*/ ctx[14]
    			}
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[10]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[11]);
    	let if_block0 = /*state*/ ctx[2].xml && create_if_block_3$1(ctx);
    	let if_block1 = show_if && create_if_block_2$1(ctx);
    	let if_block2 = /*state*/ ctx[2].xml && create_if_block_1$1(ctx);
    	let if_block3 = /*targetView*/ ctx[4] == "block" && create_if_block$2(ctx);

    	return {
    		c() {
    			div4 = element("div");
    			div0 = element("div");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			link = element("link");
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			attr(div0, "class", "switchbutton");
    			attr(link, "onload", "this.rel='stylesheet'");
    			attr(link, "rel", "preload");
    			attr(link, "as", "style");
    			attr(link, "href", link_href_value = editor.baseUrlTheme + "pe-items/svelte/clsSMAlignMatch/css/alignmatch.min.css");
    			attr(div1, "class", div1_class_value = "categorycontainer center-block " + (/*windowwidth*/ ctx[3] > 1200 ? "span9" : ""));
    			attr(div2, "class", "text-center");
    			attr(div3, "class", div3_class_value = "alignTestarea px-3 mx-auto mt-3 " + (/*targetView*/ ctx[4] == "block" ? "h" : ""));
    			set_style(div3, "max-width", /*state*/ ctx[2].maxWidth);
    		},
    		m(target, anchor) {
    			insert(target, div4, anchor);
    			append(div4, div0);
    			mount_component(itemhelper, div0, null);
    			append(div4, t0);
    			append(div4, link);
    			append(div4, t1);
    			append(div4, div3);
    			append(div3, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append(div3, t2);
    			append(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append(div4, t4);
    			if (if_block3) if_block3.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen(window_1, "resize", /*onwindowresize*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);

    			if (/*state*/ ctx[2].xml) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*windowwidth*/ 8 && div1_class_value !== (div1_class_value = "categorycontainer center-block " + (/*windowwidth*/ ctx[3] > 1200 ? "span9" : ""))) {
    				attr(div1, "class", div1_class_value);
    			}

    			if (show_if) if_block1.p(ctx, dirty);

    			if (/*state*/ ctx[2].xml) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$1(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!current || dirty[0] & /*targetView*/ 16 && div3_class_value !== (div3_class_value = "alignTestarea px-3 mx-auto mt-3 " + (/*targetView*/ ctx[4] == "block" ? "h" : ""))) {
    				attr(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 4) {
    				set_style(div3, "max-width", /*state*/ ctx[2].maxWidth);
    			}

    			if (/*targetView*/ ctx[4] == "block") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*targetView*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div4, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div4);
    			destroy_component(itemhelper);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    const CORRECT = 2, INCORRECT = 0;

    // return an array that contains the value of that properties which are the own properties of object not inherited properties which is passed in argument at the time of function calling 
    function objectValues(obj) {
    	let res = [];

    	for (let index in obj) {
    		if (obj.hasOwnProperty(index)) {
    			// pushes the value of key that is equals to the value of variable 'index' of object 'obj'
    			res.push(obj[index]);
    		}
    	}

    	// not clear what does it work
    	window.ajaxContentUpdate && ajaxContentUpdate({
    		imgAltText: 1,
    		container: ["#alignmatch-table"]
    	});

    	// returns the array res
    	return res;
    }

    // For ADA
    function keydownAda(event) {
    	if (event.which === 13) {
    		// click the textarea element or image upload icon on which keydown
    		this.click();
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { showAns } = $$props;
    	let { isReview } = $$props;
    	let { updateCSV } = $$props;
    	let { editorState } = $$props;

    	let jsonData = {},
    		state = {
    			// contains xml
    			xml: "",
    			// not used
    			content: "",
    			// not used
    			settings: "",
    			// shows the remediation status
    			remediationState: false,
    			// allowed to perform the task
    			gameStatus: false,
    			// used for set the match container width
    			maxWidth: "",
    			// contains user answer performed
    			userAnswerArr: [],
    			// used to set the height of the categories item container
    			imgHeight: "",
    			// not used
    			idCheck: 0,
    			correct_match: []
    		};

    	// contains userXML
    	let userXML = {};

    	let windowwidth;
    	let targetView = "none";
    	let isAnswerCorrect = []; //used for coloring of individual row(true: green row, false: red row)
    	let blnAllAttempted = false; //used to check if all the questions are attempted and correct atleast once, if firstTime correct then accidently incorrect, it doesn't matter. At least once correct.
    	let correctAnswerArray = []; //stores correct Answer tagWise
    	let obj = [], tmpArr = [], noOfQuestions;

    	// contains correct attemped by user
    	let ignoreItemIdKeys = [];

    	// contains the items id which not exist in 'correctAnswerArray' array
    	let ignoreItemIds = [];

    	onMount(() => {
    		$$invalidate(2, state.xml = xml, state);
    		$$invalidate(2, state.uxml = uxml, state);

    		if (state.uxml == "<smans type=\"35\"></smans>" || state.uxml == "<SMANS></SMANS>") {
    			// sets the user answer xml value blank if task not performed by user
    			$$invalidate(2, state.uxml = "", state);
    		}

    		/* @saquib:Added this condition due to usexml break*/
    		if (state.uxml && state.uxml.includes("&useransxml=")) {
    			// replaces the string '&useransxml=' to blank of user answer xml 
    			let replacedVal = state.uxml.replace("&useransxml=", "");

    			// re-set the value of user answer xml after remove the string '&useransxml='
    			$$invalidate(2, state.uxml = replacedVal, state);
    		}

    		loadModule(xml);

    		if (editorState && editorState.isCSV) {
    			// updates the value of props isCSV
    			updateElements("csv"); // update elements
    		}
    	});

    	afterUpdate(() => {
    		if (ignoreItemIdKeys.length > 0) {
    			if (!blnAllAttempted) {
    				ignoreItemIdKeys.forEach((i, id) => {
    					// contains the value of key 'tags' of item have id equals to the value of variable 'id'
    					let tag = obj[id].tags;

    					correctAnswerArray[tag].slice(1).forEach((i, val) => {
    						// contains the items id which not exist in 'correctAnswerArray' array
    						ignoreItemIds.push(val.id);
    					});
    				});
    			}
    		}
    	});

    	// loads the module according to the value of question xml and user xml
    	function loadModule(loadXml) {
    		reverseToInitial();

    		// contains json data of xml
    		loadXml = XMLToJSON(loadXml);

    		// updates the xml after parsing the xml and shows answer
    		parseXMLPreview(loadXml);

    		// update the image after trigger the loaded event
    		updateImage();
    	}

    	// update the image after trigger the loaded event
    	function updateImage() {
    		AH.selectAll(".elementContainer").forEach(function () {
    			// it is category selector
    			let element_id = this;

    			AH.find(element_id, "img", "all").forEach(function (j, val) {
    				// contains index of the category
    				let id = AH.select(val).getAttribute("data-check");

    				// removes the value of height from item container that exist inside current category
    				AH.select(".categoryitemcontainer_" + id).height = "";

    				// removes the value of height from previous button that exist inside current category
    				AH.select(".prevbutton_" + id).height = "";

    				// removes the value of height from next button that exist inside current category
    				AH.select(".nextbutton_" + id).height = "";

    				// fired the load event to the element equals the value of variable 'val'
    				AH.select(val).trigger("load");
    			});
    		});
    	}

    	// updates the xml after parsing the xml and shows answer
    	function parseXMLPreview(MYXML) {
    		// sets the value of state maxWidth
    		$$invalidate(2, state.maxWidth = MYXML.smxml._maxwidth ? MYXML.smxml._maxwidth : 800, state);

    		// contains the value of cdata
    		$$invalidate(1, jsonData = JSON.parse(MYXML.smxml.__cdata));

    		// creates temporary array obj & temporary array tmpArr
    		jsonData.item.items.forEach(function (item) {
    			// contains data of array key 'items' defined at index equals to the value of variable 'key' 
    			obj[item.id] = item;
    		});

    		// contains no of question exist
    		noOfQuestions = jsonData.item.items.length / jsonData.category.categories.length;

    		$$invalidate(5, correctAnswerArray = []);
    		$$invalidate(2, state.correct_match = [], state);

    		jsonData.item.items.forEach(function (value, seq) {
    			if (correctAnswerArray[value.tags] == null) {
    				// makes value blank at index equals to the value of key 'tags' of object defined in variable 'value' of array correctAnswerArray
    				$$invalidate(5, correctAnswerArray[value.tags] = [], correctAnswerArray);

    				// makes value blank at index equals to the value of key 'tags' of object defined in variable 'value' of array tmpArr
    				tmpArr[value.tags] = [];
    			}

    			correctAnswerArray[value.tags].push(value);

    			// pushes the object defined in variable 'value' into array defined at index equals to the value of key 'tags' of object defined in variable 'value'
    			tmpArr[value.tags].push(value);

    			$$invalidate(2, state.correct_match["category_" + seq] = false, state);
    			value.sequence = seq;
    		});

    		// used to check that user answer value is defined in array tmpArr or not
    		let tmpArrDone = false;

    		if (xml != undefined && (state.uxml != "" && state.uxml != undefined)) {
    			// contains json data of user answer xml
    			userXML = JSON.parse(state.uxml);

    			// shows the answer (Correct/Incorrect)
    			displayAnswer();

    			// destruct the array have value equals to the value of key 'correct_attempt' of userXML object
    			Object.keys(userXML.items).forEach(itemArr => {
    				if (userXML.items[itemArr].slice(-1)[0] == 2) {
    					// sets the value 'true' at index equals to the value of variable 'itemKey' of array isAnswerCorrect
    					isAnswerCorrect[itemArr] = true;
    				}
    			});

    			// contains true if attemped question equals to the no of exist question otherwise contains false
    			blnAllAttempted = userXML.correct_attempt.length === noOfQuestions;

    			if (blnAllAttempted) {
    				// apply the opacity '0.7' and cursor style 'not-allowed' and adds class complete to the Match container
    				AH.selectAll(".alignTestarea", "addClass", "complete");

    				AH.setCss(".categorycontainer", {
    					"opacity": "0.7",
    					"cursor": "not-allowed"
    				});

    				// disabled the 'Match' button
    				AH.select(".matchbutton").disabled = true;
    			}

    			// returns enumerable properties of a simple array.
    			let firstRowIds = Object.keys(userXML.items);

    			// checks for blank question exist or not
    			let blnQueExists;

    			for (let i in tmpArr) {
    				for (let j in tmpArr[i]) {
    					if (j == 0) {
    						// defines the value true or false according to the matched condition
    						blnQueExists = firstRowIds.indexOf(tmpArr[i][j].id) > -1;
    					} else if (!blnQueExists) {
    						// sets the value of multi-dimention array tmpArr at row equals to the value of variable 'i' and column equals to the value of variable 'j'
    						tmpArr[i][j] = {
    							// defines the value blank of key 'imageurl'
    							imageurl: "",
    							// defines the value 'Unattempted' of key 'label' 
    							label: "Unattempted"
    						};
    					} else if (blnQueExists) {
    						// contains value of item id from the value of 'id' key defined at row equals to the value of variable 'i' and column 0 of multi-dimention array 'tmpArr' 
    						let queId = tmpArr[i][0].id;

    						// contains the value defined at row equals to the value of variable 'queId' and column equals to the value of variable 'j' - 1
    						let _uXmlAnsItem = userXML.items[queId][j - 1];

    						// sets the value of multi-dimention array tmpArr at row equals to the value of variable 'i' and column equals to the value of 'j' to the value of key equals to the value of variable '_uXmlAnsItem' of object obj
    						tmpArr[i][j] = obj[_uXmlAnsItem];
    					}
    				}
    			}

    			// sets the value 'true' of variable 'tmpArrDone'  to show that user answer value is defined in tmpArr array
    			tmpArrDone = true;
    		}

    		if (!tmpArrDone) {
    			for (let i in tmpArr) {
    				for (let j in tmpArr[i]) {
    					if (j > 0) {
    						// sets the value of multi-dimention array tmpArr at row equals to the value of variable 'i' and column equals to the value of variable 'j'
    						tmpArr[i][j] = {
    							imageurl: "",
    							imagealt: "",
    							label: "Unattempted"
    						};
    					}
    				}
    			}
    		}

    		// sets the value of state userAnswerArr
    		$$invalidate(2, state.userAnswerArr = tmpArr, state);

    		// sets the value of state xml
    		$$invalidate(2, state.xml = jsonData, state);

    		// allow to start the game
    		beginGame();
    	}

    	// shows the answer (Correct/Incorrect)
    	function displayAnswer() {
    		// contains true or false according to match the condition
    		let blnAllCorrect = userXML.answer && userXML.answer == CORRECT;

    		// shows correct or incorrect according to the value of variable 'blnAllCorrect'
    		if (editorState) {
    			showAns(blnAllCorrect ? "Correct" : "Incorrect");
    		} else {
    			AH.select("#answer").checked = blnAllCorrect;

    			if (!editorState && state.uxml && state.uxml != "") {
    				let blnAllCorrectStatus = blnAllCorrect ? true : false;

    				onUserAnsChange({
    					uXml: state.uxml,
    					ans: blnAllCorrectStatus
    				});
    			}
    		}
    	}

    	// sets the height of next, previous buttons and also of category item container
    	function onImgLoad(event) {
    		// contains the index of the category in which this image lies
    		let id = event.target.getAttribute("data-check");

    		// contains the height of the item container including keyword 'px'
    		let containerHeight = AH.select(".categoryitemcontainer_" + id).style.height;

    		// contains the value after reducing 11 from the value of height 
    		let elementContainerHeight = containerHeight.substr(0, containerHeight.indexOf("p")) - 11;

    		// contains real height of the image
    		let height = event.target.naturalHeight;

    		if (elementContainerHeight != "" && elementContainerHeight != null && !isNaN(elementContainerHeight)) {
    			if (elementContainerHeight <= height) {
    				// sets the value of state 'height'
    				$$invalidate(2, state.imgHeight = height, state);

    				// used to set the height of item container and of next, previous buttons
    				updateColumnHeight(state.imgHeight, id);
    			}
    		} else {
    			// sets the value of state 'height'
    			$$invalidate(2, state.imgHeight = height, state);

    			// used to set the height of item container and of next, previous buttons
    			updateColumnHeight(state.imgHeight, id);
    		}
    	}

    	// used to set the height of item container and of next, previous buttons
    	function updateColumnHeight(height, index) {
    		// sets the height of item container of category have index defined in variable 'index'
    		AH.select(".categoryitemcontainer_" + index).style.height = height + 11 + "px";

    		// sets the height of item previous button of category have index defined in variable 'index'
    		AH.select(".prevbutton_" + index).style.height = height + 50 + "px";

    		// sets the height of item next button of category have index defined in variable 'index'
    		AH.select(".nextbutton_" + index).style.height = height + 50 + "px";
    	}

    	// shows the item randomly after click on next or previous button and in case of csv it updates the value of props isCSV
    	function updateElements(action) {
    		setTimeout(
    			function () {
    				AH.selectAll(".categoryinnercontainer ", "all").forEach(function (container, i) {
    					AH.find(container, ".element", "all").forEach(function (val, k) {
    						// sets unique id attribute of each items lies in same category
    						val.setAttribute("id", "element_" + (k + 1));

    						val.style.display = "none";
    					});

    					// contains number of questions exist
    					let eleLen = AH.find(container, ".element", "all").length;

    					// contains the random number that cab be 1 to value of variable 'eleLen'
    					let toShow = Math.floor(Math.random() * eleLen) + 1;

    					// shows the item have id 'element_' + value of the variable 'toShow' inside the category at index equals to the value of variable 'key'
    					AH.select(".categoryitemcontainer_" + i + " #element_" + toShow).style.display = "";
    				});
    			},
    			200
    		);

    		if (action == "csv") {
    			setTimeout(
    				function () {
    					// sets the value 'false' of prop isCSV 
    					updateCSV("csv", false);

    					console.log("csv Updated");
    				},
    				1200
    			);
    		}
    	}

    	// allow to start the game
    	function beginGame() {
    		setTimeout(
    			function () {
    				if (!blnAllAttempted) {
    					// sets the value 'true' of state gameStatus that allow to perform the task
    					$$invalidate(2, state.gameStatus = true, state);
    				}
    			},
    			200
    		);
    	}

    	// sets the value 'false' of state gameStatus
    	function reverseToInitial() {
    		$$invalidate(2, state.gameStatus = false, state);
    	}

    	function prevbutton() {
    		if (!blnAllAttempted) {
    			// selects next sibling item that have class 'categoryinnercontainer'
    			let categoryinnercontainer = AH.nextElm(this, ".categoryinnercontainer");

    			// selects items that is visible in that category which previous button clicked
    			let catInnerImg;

    			AH.find(categoryinnercontainer, ".categoryitemcontainer .categoryiteminnercontainer .element", "all").forEach(function (i) {
    				if (getComputedStyle(i, null).display == "table-cell") {
    					catInnerImg = i;
    				}
    			});

    			if (catInnerImg && AH.prevElm(catInnerImg)) {
    				// shows previous sibling item and hides current item of that category whicn previous button clicked 
    				AH.prevElm(catInnerImg).style.display = "";

    				AH.nextElm(AH.prevElm(catInnerImg)).style.display = "none";
    			} else {
    				// hides the currently visible item that exist in that category which previous button clicked
    				if (catInnerImg) {
    					catInnerImg.style.display = "none";
    				}

    				// hides all items inside that category which previous button clicked and shows the last item
    				AH.find(categoryinnercontainer, ".categoryitemcontainer .categoryiteminnercontainer .element").style.display = "none";

    				AH.find(categoryinnercontainer, ".categoryitemcontainer .categoryiteminnercontainer .element:last-child").style.display = "";
    			}

    			return false;
    		}
    	}

    	function nextbutton() {
    		if (!blnAllAttempted) {
    			// selects previous sibling item that have class 'categoryinnercontainer'
    			let categoryinnercontainer = AH.prevElm(this, ".categoryinnercontainer");

    			let catInnerImg;

    			// selects items that is visible in that category which next button clicked
    			AH.find(categoryinnercontainer, ".categoryitemcontainer .categoryiteminnercontainer .element", "all").forEach(function (i) {
    				if (getComputedStyle(i, null).display == "table-cell") {
    					catInnerImg = i;
    				}
    			});

    			if (catInnerImg && AH.nextElm(catInnerImg)) {
    				// shows next sibling item and hides current item of that category whicn next button clicked 
    				AH.nextElm(catInnerImg).style.display = "";

    				AH.prevElm(AH.nextElm(catInnerImg)).style.display = "none";
    			} else {
    				// hides the currently visible item that exist in that category which next button clicked
    				if (catInnerImg) {
    					catInnerImg.style.display = "none";
    				}

    				// hides all items inside that category which next button clicked and shows the first item
    				AH.find(categoryinnercontainer, ".categoryitemcontainer .categoryiteminnercontainer .element").style.display = "none";

    				AH.find(categoryinnercontainer, ".categoryitemcontainer .categoryiteminnercontainer .element:first-child").style.display = "";
    			}

    			return false;
    		}
    	}

    	function setReview() {
    		$$invalidate(0, isReview = true);
    		$$invalidate(4, targetView = "block");

    		setTimeout(function () {
    			AH.selectAll(".your_ans_td:first-child").forEach(
    				tdval => {
    					let td_id = tdval.getAttribute("col");

    					if (isAnswerCorrect[td_id]) {
    						AH.parent(tdval).classList.add("typeCorrect");
    					} else {
    						AH.parent(tdval).classList.add("typeIncorrect");
    					}
    				},
    				100
    			);
    		});

    		// shows the answer (Correct/Incorrect)
    		displayAnswer();
    	}

    	function unsetReview() {
    		$$invalidate(4, targetView = "none");
    		$$invalidate(0, isReview = false);
    	}

    	function matchButton() {
    		if (!blnAllAttempted) {
    			// selects the closest element that have class 'alignTestarea' when click on match button
    			let alignTestarea = this.closest(".alignTestarea");

    			// selects the visible items inside container category
    			let visibleEle = [];

    			AH.find(alignTestarea, ".categorycontainer .categoryinnercontainer .categoryitemcontainer .categoryiteminnercontainer .element", "all").forEach(function (val) {
    				if (getComputedStyle(val, null).display == "table-cell") {
    					visibleEle = [...visibleEle, val];
    				}
    			});

    			let tagName, firstTagName;
    			let blnCorrect = null;
    			let currentItem = null;
    			let mainKey = null;

    			visibleEle.forEach(function (value, key) {
    				// contains the value of 'data-tags' attribute of element defined in variable 'value'
    				tagName = value.getAttribute("data-tags");

    				// used for contain the item value
    				let itemValue;

    				if (key == 0) {
    					// sets the value of variable 'tagName' to variable 'firstTagName'
    					firstTagName = tagName;
    				}

    				if (AH.find(value, "img")) {
    					// contains value of src attribute of img tag exist inside the element defined in variable 'value'
    					itemValue = AH.find(value, "img").getAttribute("src");
    				} else {
    					// contains text of div element exist inside the element defined in variable 'value'
    					itemValue = AH.find(value, "div").textContent;
    				}

    				/**userXML generation start*/
    				// contains all the items available
    				let items = state.xml.item.items;

    				//changed to for in loop
    				for (let i in items) {
    					// contains value exist at index 'i' of array 'items'
    					let qxmlItem = items[i];

    					if (qxmlItem.tags == tagName) {
    						// contains image src or text according to the value of key 'imageurl' of object qxmlItem
    						let valueOfItem = qxmlItem.imageurl
    						? "//s3.amazonaws.com/jigyaasa_content_static//" + qxmlItem.imageurl
    						: qxmlItem.label;

    						if (valueOfItem == itemValue) {
    							// contains object qxmlItem
    							currentItem = qxmlItem;

    							break;
    						}
    					}
    				}

    				if (userXML.items == null) {
    					// defines empty object into the value of items key of object userXML
    					userXML.items = {};
    				}

    				if (key == 0) {
    					// sets value equals to the value of variable tagName of variable 'blnCorrect'
    					blnCorrect = tagName;

    					// contains the value of key 'id' of object 'currentItem'
    					mainKey = currentItem.id;

    					// assign blank array at the key have value equals to the value of variable 'mainKey' of key 'items' of object userXML
    					userXML.items[mainKey] = [];
    				} else {
    					if (tagName != blnCorrect) {
    						// sets value 'null' of variable 'blnCorrect'
    						blnCorrect = null;
    					}

    					// pushes the value 'id' key of object currentItem into array defined at key equals to the value of variable 'mainKey'
    					userXML.items[mainKey].push(currentItem.id);

    					// defines the object that have key 'imageurl' and 'label' into state object userAnswerArr where array key is equals to the value of variable 'firstTagName' and index is equals to the value of variable 'key' image url and
    					$$invalidate(
    						2,
    						state.userAnswerArr[firstTagName][key] = {
    							imageurl: currentItem.imageurl,
    							label: currentItem.label
    						},
    						state
    					);
    				}
    			}); /**userXML generation end */

    			// defines the value of variable 'wrongAnswer'
    			let wrongAnswer = blnCorrect == null;

    			// pushes the value 'CORRECT/INCORRECT' according to the value of variable 'wrongAnswer' into array key 'items' of object userXML
    			userXML.items[mainKey].push(wrongAnswer ? INCORRECT : CORRECT);

    			/**storing only the ids of questions that are attempted and correct as least once.
        ***SECTION START */
    			userXML.correct_attempt = userXML.correct_attempt || [];

    			if (!wrongAnswer && userXML.correct_attempt.indexOf(mainKey) == -1) {
    				// pushes the value of variable 'mainKey' into array key 'correct_attempt' of object userXML
    				userXML.correct_attempt.push(mainKey);
    			}

    			/**SECTION END */
    			// update the value of array isAnswerCorrect have key equals to the value of variable 'mainKey'
    			isAnswerCorrect[mainKey] = !wrongAnswer;

    			// sets the value of state 'userAnswerArr'
    			$$invalidate(2, state);

    			// defines the variable 'correctCount'
    			let correctCount = 0;

    			for (let item in userXML.items) {
    				// contains array defined at key equals to the value of variable 'item' in array key 'items' of object userXML
    				let itemArr = userXML.items[item];

    				if (itemArr.slice(-1)[0] === CORRECT) {
    					// increases the value of variable 'correctCount' by 1
    					correctCount += 1;
    				}
    			}

    			// finds total no of question exist
    			let totalcount = AH.selectAll(".categoryiteminnercontainer:first-child .elementContainer .element").length;

    			if (typeof calculatePoint != "undefined") {
    				// sets the value of variable 'totalcount' to the input element have id 'answer_points' and type hidden and value of the variable 'correctCount' to the input element have id 'user_points' and type hidden
    				calculatePoint(totalcount, correctCount);
    			}

    			// by default sets INCORRECT value of the key 'answer' of userXML object
    			userXML.answer = INCORRECT;

    			if (noOfQuestions === correctCount) {
    				// sets CORRECT value of the key 'answer' of userXML object
    				userXML.answer = CORRECT;
    			}

    			// contains true if attemped question equals to the no of exist question otherwise contains false
    			blnAllAttempted = userXML.correct_attempt.length === noOfQuestions;

    			if (!wrongAnswer) {
    				// enables reset button if any matching made correct
    				AH.select("#reset_btn").disabled = false;

    				AH.selectAll(".categoryinnercontainer ", "all").forEach(function (container, i) {
    					if (AH.find(container, ".element", "all").length > 1) {
    						AH.find(container, ".element", "all").forEach(function (val) {
    							// removes the visible element have class 'element' inside the category defined at index equals to the value of variable 'key'
    							if (getComputedStyle(val, null).display == "table-cell") {
    								if (i != 0) {
    									$$invalidate(2, state.correct_match[val.getAttribute("seq_no")] = true, state);
    								}
    							}
    						});

    						setTimeout(
    							function () {
    								AH.find(container, ".element", "all").forEach(function (val, k) {
    									// sets unique id attribute of each items lies in same category
    									val.setAttribute("id", "element_" + (k + 1));

    									val.style.display = "none";
    								});

    								// contains number of questions exist
    								let eleLen = AH.find(container, ".element", "all").length;

    								// contains the random number that cab be 1 to value of variable 'eleLen'
    								let toShow = Math.floor(Math.random() * eleLen) + 1;

    								// shows the item have id 'element_' + value of the variable 'toShow' inside the category at index equals to the value of variable 'key'
    								AH.select(".categoryitemcontainer_" + i + " #element_" + toShow).style.display = "";
    							},
    							100
    						);
    					} else {
    						// apply the opacity '0.7' and cursor style 'not-allowed' and adds class complete to the Match container
    						AH.setCss(".categorycontainer", {
    							"opacity": "0.7",
    							"cursor": "not-allowed"
    						});

    						AH.selectAll(".categorycontainer", "addClass", "complete");

    						// not allowed click on previous and next button 
    						AH.setCss(".nextbutton", { "pointer-events": "none" });

    						AH.setCss(".prevbutton", { "pointer-events": "none" });

    						// disabled the 'Match' button
    						AH.select(".matchbutton").disabled = true;

    						// shows game completion message
    						AH.alert("Game Completed!!");

    						// shows the answer (Correct/Incorrect)
    						displayAnswer();
    					}
    				});
    			} else {
    				// apply shake effect for transition just like as slide
    				if (AH.select(".categorycontainer ").classList.contains("wrong_ans")) {
    					AH.selectAll(".categorycontainer", "removeClass", "wrong_ans");
    				}

    				setTimeout(
    					function () {
    						AH.selectAll(".categorycontainer", "addClass", "wrong_ans");
    					},
    					100
    				);

    				// shows the warning message
    				AH.alert("Please match all the items correctly.", 4);
    			}

    			// allow to start the game
    			beginGame();

    			// tells that user xml changed
    			ISSPECIALMODULEUSERXMLCHANGE = 1;

    			// update the user answer xml
    			$$invalidate(2, state.uxml = JSON.stringify(userXML), state);

    			AH.select("#special_module_user_xml").value = JSON.stringify(userXML);
    		} //AH.selectAll('.yourAnswer .remedcolumn td:first-child')
    	}

    	function resetButton() {
    		// makes user answer xml value blank
    		userXML = {};

    		isAnswerCorrect = []; //used for coloring of individual row(true: green row, false: red row)
    		blnAllAttempted = false; //used to check if all the questions are attempted and correct atleast once, if firstTime correct then accidently incorrect, it doesn't matter. At least once correct.
    		$$invalidate(5, correctAnswerArray = []); //stores correct Answer tagWise
    		AH.selectAll(".categorycontainer", "removeClass", "complete");
    		AH.setCss(".categorycontainer", { "opacity": "1", "cursor": "pointer" });

    		// allows click on next and previous button
    		AH.setCss(".nextbutton", { "pointer-events": "auto" });

    		AH.setCss(".prevbutton", { "pointer-events": "auto" });

    		// enabled the 'Match' button
    		AH.select(".matchbutton").disabled = false;

    		// removes performed useranswer
    		$$invalidate(2, state.uxml = "", state);

    		// makes value blank of state 'xml'
    		$$invalidate(2, state.xml = "", state);

    		$$invalidate(2, state.correct_match = [], state);

    		// reload the module after removing user answer that was performed previously
    		loadModule(xml);

    		// shows the first item of each row
    		AH.select(".categoryitemcontainer .categoryiteminnercontainer .elementContainer .element:first-child").style.display = "";

    		// disabled the reset button
    		AH.select("#reset_btn").disabled = true;
    	}

    	function handleReviewMode(mode) {
    		if (mode == "c") {
    			AH.select(".correctAnswer").style.display = "block";
    			AH.select(".yourAnswer").style.display = "none";
    		} else if (mode == "u") {
    			AH.select(".yourAnswer").style.display = "block";
    			AH.select(".correctAnswer").style.display = "none";
    		}
    	}

    	function onwindowresize() {
    		$$invalidate(3, windowwidth = window_1.innerWidth);
    	}

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(15, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(16, uxml = $$props.uxml);
    		if ("showAns" in $$props) $$invalidate(17, showAns = $$props.showAns);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("updateCSV" in $$props) $$invalidate(18, updateCSV = $$props.updateCSV);
    		if ("editorState" in $$props) $$invalidate(19, editorState = $$props.editorState);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*xml, isReview*/ 32769) {
    			 {
    				loadModule(xml);

    				if (isReview) {
    					$$invalidate(4, targetView = "block");
    					setReview();
    				} else {
    					$$invalidate(4, targetView = "none");
    					unsetReview();
    					updateElements();
    				}
    			}
    		}
    	};

    	return [
    		isReview,
    		jsonData,
    		state,
    		windowwidth,
    		targetView,
    		correctAnswerArray,
    		ignoreItemIds,
    		onImgLoad,
    		prevbutton,
    		nextbutton,
    		setReview,
    		unsetReview,
    		matchButton,
    		resetButton,
    		handleReviewMode,
    		xml,
    		uxml,
    		showAns,
    		updateCSV,
    		editorState,
    		onwindowresize
    	];
    }

    class AlignMatchPreview extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				xml: 15,
    				uxml: 16,
    				showAns: 17,
    				isReview: 0,
    				updateCSV: 18,
    				editorState: 19
    			},
    			[-1, -1]
    		);
    	}
    }

    const defXMl = `<smxml type="35" name="AlignMatch" maxwidth="500">
				<!--[CDATA[{
					"category":{
						"categories":[
							{
								"id":"category_1",
								"text":"State"								
							},
							{
								"id":"category_2",
								"text":"Capital"								
							}
						]
					},
					"item":{
						"items":[
							{
								"imageurl":"",
								"imagealt":"",
								"id":"item_1",
								"label":"Uttar Pradesh",
								"category":"category_1",
								"tags":"Tags 1"
							},
							{
								"imageurl":"1492581789/1_1492581789.jpg",
								"imagealt":"Lucknow",
								"id":"item_2",
								"label":"Lucknow",
								"category":"category_2",
								"tags":"Tags 1"
							},
							{
								"imageurl":"1492581901/1_1492581901.jpg",
								"imagealt":"Maharashtra",
								"id":"item_4",
								"label":"Maharashtra",
								"category":"category_1",
								"tags":"Tags 2"
							},
							{
								"imageurl":"1492581951/1_1492581951.jpg",
								"imagealt":"Mumbai",
								"id":"item_5",
								"label":"Mumbai",
								"category":"category_2",
								"tags":"Tags 2"
							},
							{
								"imageurl":"1492582059/1_1492582059.jpg",
								"imagealt":"Madhya Pradesh",
								"id":"item_7",
								"label":"Madhya Pradesh",
								"category":"category_1",
								"tags":"Tags 3"	
							},
							{
								"imageurl":"",
								"imagealt":"",
								"id":"item_8",
								"label":"Bhopal",
								"category":"category_2",
								"tags":"Tags 3"
							}																						
						]
					},
					"settings": {
						"assignmentTitle":"State Info Challenge",
						"assignmentSubtitle":"How well do you know the Indian states?",
						"introText":"In this challenge, you will put your knowledge of Indian state to the ultimate test. ",
						"beginButtonText":"begin",
						"howToPlayTitle":"Game: Align",
						"howToPlayText":"Match each State with their Capital and Monuments.",
						"resultsTitle":"Results",
						"outroTitle":"Good job!",
						"outroText":"You did it! \\n\\n Now result time.",
						"outroImage":"1491889706/1_1491889706.jpg",
						"outroImageDescription":"",
						"requiredMatches":4,
						"matchButtonText":"Match",
						"showPoints":true,
						"showAccuracy":true,
						"showMatches":true,
						"timeLimit":0,
						"correctValue":50,
						"incorrectValue":-25
					}
				}
				]]-->
				</smxml>`;

    const app = new AlignMatchPreview({
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
//# sourceMappingURL=bundle_q35.js.map
