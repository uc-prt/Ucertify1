
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
            this.listener = {};
            this.buffer = {};
            this.bsCat1 = ['Modal', 'Tooltip', 'Collapse', 'Popover', 'ScrollSpy', 'Tab', 'Alert'];
            this.extraSelectors = ['hidden', 'visible', 'selected', 'checked', 'enabled'];
            this.parseHtml = this.templateHtml.bind(this);
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
        addScript(data, url) {
            let sc = document.createElement("script");
            if (url) {
                sc.src = url;
                sc.async = true;
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
        findChild(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let list = current.children || [];
            let found = {};
            if (search && list.length > 0) {
                let index = 0;
                while (list[index]) {
                    if (list[index].matches(search)) {
                        found = list[index];
                        break;
                    }
                    index++;
                }
                return found;
            } else {
                return list;
            }
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
            if (this.listener[selector]) {
                base.removeEventListener(eventName, this.listener[selector]);
            }
            this.listener[selector] = this.onListen.bind(this, selector, handler, base);
            base.addEventListener(eventName, this.listener[selector]);
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
        watchDom(target, func) {
            var observer = new MutationObserver(function (mutationRecords) {
                    //if (mutationRecords[0].addedNodes[0].nodeName === "SPAN")
                    func && func(mutationRecords);
                });
            observer.observe(target, { attributes: true, childList: true, subtree: true });
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
            let closest = event.target.closest && event.target.closest(selector);
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
    		ISSPECIALMODULEUSERXMLCHANGE = 1;
    		document.getElementById("answer").checked = result.ans ? true : false;
    		document.getElementById("special_module_user_xml").value = result.uXml;

    		if (typeof calculatePoint != "undefined") {
    			calculatePoint(1, result.ans);
    		}
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

    /* helper\ItemHelper.svelte generated by Svelte v3.29.0 */

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
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*reviewMode*/ ctx[0] && create_if_block(ctx);

    	return {
    		c() {
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr(button0, "type", "button");
    			attr(button0, "class", "h h-imp");
    			attr(button0, "id", "set-review");
    			attr(button1, "type", "button");
    			attr(button1, "class", "h h-imp");
    			attr(button1, "id", "unset-review");
    		},
    		m(target, anchor) {
    			insert(target, button0, anchor);
    			insert(target, t0, anchor);
    			insert(target, button1, anchor);
    			insert(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);

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
    			if (detaching) detach(button0);
    			if (detaching) detach(t0);
    			if (detaching) detach(button1);
    			if (detaching) detach(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
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
    		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 });
    	}
    }

    /* clsSMShadedGrid\ShadingPreview.svelte generated by Svelte v3.29.0 */

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    // (368:12) {#if total_row_count && total_row_count.length > 0}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*total_row_count*/ ctx[4];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			if (dirty[0] & /*preview_table, isReview, userTab, gridClick, adaKeyupGridClick, state, total_row_count*/ 635) {
    				each_value = /*total_row_count*/ ctx[4];
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
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (371:24) {#if preview_table && preview_table.length > 0}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*preview_table*/ ctx[3];
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
    			if (dirty[0] & /*preview_table, isReview, userTab, gridClick, adaKeyupGridClick, state*/ 619) {
    				each_value_1 = /*preview_table*/ ctx[3];
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

    // (373:32) {#if i == data.rowno}
    function create_if_block_2(ctx) {
    	let td;
    	let t;
    	let td_id_value;
    	let td_tabindex_value;
    	let td_aria_label_value;
    	let td_pevdata_id_value;
    	let td_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*isReview*/ ctx[0] && create_if_block_3(ctx);

    	return {
    		c() {
    			td = element("td");
    			if (if_block) if_block.c();
    			t = space();
    			attr(td, "id", td_id_value = /*data*/ ctx[38].id);
    			attr(td, "tabindex", td_tabindex_value = /*data*/ ctx[38].tabindex);
    			attr(td, "aria-label", td_aria_label_value = /*data*/ ctx[38].arialabel);
    			attr(td, "data-grid", "no");
    			attr(td, "pevdata-id", td_pevdata_id_value = /*data*/ ctx[38].pevdata);

    			attr(td, "class", td_class_value = `${/*isReview*/ ctx[0] && /*userTab*/ ctx[1] == false
			? ""
			: /*data*/ ctx[38].class} uhkj ${/*data*/ ctx[38].classDetails} kl ${/*isReview*/ ctx[0] && /*userTab*/ ctx[1] == false
			? /*data*/ ctx[38].spanclass == "icomoon-24px-correct"
				? "gridCorrect"
				: ""
			: /*data*/ ctx[38].correctAnswerColor} gridColor pointer border-dark text-center`);

    			set_style(td, "width", /*data*/ ctx[38].width);
    			set_style(td, "height", /*data*/ ctx[38].height);
    			set_style(td, "pointerEvents", "pointerEvents");
    		},
    		m(target, anchor) {
    			insert(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			append(td, t);

    			if (!mounted) {
    				dispose = [
    					listen(td, "click", /*gridClick*/ ctx[6]),
    					listen(td, "keyup", /*adaKeyupGridClick*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*isReview*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(td, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*preview_table*/ 8 && td_id_value !== (td_id_value = /*data*/ ctx[38].id)) {
    				attr(td, "id", td_id_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8 && td_tabindex_value !== (td_tabindex_value = /*data*/ ctx[38].tabindex)) {
    				attr(td, "tabindex", td_tabindex_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8 && td_aria_label_value !== (td_aria_label_value = /*data*/ ctx[38].arialabel)) {
    				attr(td, "aria-label", td_aria_label_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8 && td_pevdata_id_value !== (td_pevdata_id_value = /*data*/ ctx[38].pevdata)) {
    				attr(td, "pevdata-id", td_pevdata_id_value);
    			}

    			if (dirty[0] & /*isReview, userTab, preview_table*/ 11 && td_class_value !== (td_class_value = `${/*isReview*/ ctx[0] && /*userTab*/ ctx[1] == false
			? ""
			: /*data*/ ctx[38].class} uhkj ${/*data*/ ctx[38].classDetails} kl ${/*isReview*/ ctx[0] && /*userTab*/ ctx[1] == false
			? /*data*/ ctx[38].spanclass == "icomoon-24px-correct"
				? "gridCorrect"
				: ""
			: /*data*/ ctx[38].correctAnswerColor} gridColor pointer border-dark text-center`)) {
    				attr(td, "class", td_class_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8) {
    				set_style(td, "width", /*data*/ ctx[38].width);
    			}

    			if (dirty[0] & /*preview_table*/ 8) {
    				set_style(td, "height", /*data*/ ctx[38].height);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(td);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (385:40) {#if isReview}
    function create_if_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*userTab*/ ctx[1] == true) return create_if_block_4;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
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
    		d(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (390:44) {:else}
    function create_else_block(ctx) {
    	let span1;
    	let span0;
    	let span0_class_value;
    	let span0_aria_label_value;

    	return {
    		c() {
    			span1 = element("span");
    			span0 = element("span");
    			attr(span0, "class", span0_class_value = /*data*/ ctx[38].corrspanclass);
    			attr(span0, "aria-label", span0_aria_label_value = /*data*/ ctx[38].spanarialabel);
    			set_style(span0, "color", /*data*/ ctx[38].corrspanstyle);
    		},
    		m(target, anchor) {
    			insert(target, span1, anchor);
    			append(span1, span0);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*preview_table*/ 8 && span0_class_value !== (span0_class_value = /*data*/ ctx[38].corrspanclass)) {
    				attr(span0, "class", span0_class_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8 && span0_aria_label_value !== (span0_aria_label_value = /*data*/ ctx[38].spanarialabel)) {
    				attr(span0, "aria-label", span0_aria_label_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8) {
    				set_style(span0, "color", /*data*/ ctx[38].corrspanstyle);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(span1);
    		}
    	};
    }

    // (386:44) {#if userTab == true}
    function create_if_block_4(ctx) {
    	let span1;
    	let span0;
    	let span0_class_value;
    	let span0_aria_label_value;
    	let span1_class_value;

    	return {
    		c() {
    			span1 = element("span");
    			span0 = element("span");
    			attr(span0, "class", span0_class_value = /*data*/ ctx[38].spanclass);
    			attr(span0, "aria-label", span0_aria_label_value = /*data*/ ctx[38].spanarialabel);
    			set_style(span0, "color", /*data*/ ctx[38].spanstyle);
    			attr(span1, "class", span1_class_value = /*state*/ ctx[5].iconVisible);
    			set_style(span1, "display", /*data*/ ctx[38].spandisplay);
    		},
    		m(target, anchor) {
    			insert(target, span1, anchor);
    			append(span1, span0);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*preview_table*/ 8 && span0_class_value !== (span0_class_value = /*data*/ ctx[38].spanclass)) {
    				attr(span0, "class", span0_class_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8 && span0_aria_label_value !== (span0_aria_label_value = /*data*/ ctx[38].spanarialabel)) {
    				attr(span0, "aria-label", span0_aria_label_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8) {
    				set_style(span0, "color", /*data*/ ctx[38].spanstyle);
    			}

    			if (dirty[0] & /*state*/ 32 && span1_class_value !== (span1_class_value = /*state*/ ctx[5].iconVisible)) {
    				attr(span1, "class", span1_class_value);
    			}

    			if (dirty[0] & /*preview_table*/ 8) {
    				set_style(span1, "display", /*data*/ ctx[38].spandisplay);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(span1);
    		}
    	};
    }

    // (372:28) {#each preview_table as data}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[37] == /*data*/ ctx[38].rowno && create_if_block_2(ctx);

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
    			if (/*i*/ ctx[37] == /*data*/ ctx[38].rowno) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
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

    // (369:16) {#each total_row_count as val, i}
    function create_each_block(ctx) {
    	let tr;
    	let t;
    	let if_block = /*preview_table*/ ctx[3] && /*preview_table*/ ctx[3].length > 0 && create_if_block_1(ctx);

    	return {
    		c() {
    			tr = element("tr");
    			if (if_block) if_block.c();
    			t = space();
    		},
    		m(target, anchor) {
    			insert(target, tr, anchor);
    			if (if_block) if_block.m(tr, null);
    			append(tr, t);
    		},
    		p(ctx, dirty) {
    			if (/*preview_table*/ ctx[3] && /*preview_table*/ ctx[3].length > 0) {
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
    		},
    		d(detaching) {
    			if (detaching) detach(tr);
    			if (if_block) if_block.d();
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let link;
    	let link_href_value;
    	let t0;
    	let div1;
    	let itemhelper;
    	let t1;
    	let table;
    	let tbody;
    	let t2;
    	let div0;
    	let t3_value = language.you_were_req_to_select + "";
    	let t3;
    	let t4;
    	let t5_value = /*state*/ ctx[5].correctCount + "";
    	let t5;
    	let t6;
    	let t7_value = language.grid_mark_ans_correct + "";
    	let t7;
    	let current;

    	itemhelper = new ItemHelper({
    			props: {
    				reviewMode: /*isReview*/ ctx[0],
    				handleReviewClick: /*handleReviewMode*/ ctx[10]
    			}
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[8]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[7]);
    	let if_block = /*total_row_count*/ ctx[4] && /*total_row_count*/ ctx[4].length > 0 && create_if_block$1(ctx);

    	return {
    		c() {
    			link = element("link");
    			t0 = space();
    			div1 = element("div");
    			create_component(itemhelper.$$.fragment);
    			t1 = space();
    			table = element("table");
    			tbody = element("tbody");
    			if (if_block) if_block.c();
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			attr(link, "onload", "this.rel='stylesheet'");
    			attr(link, "rel", "preload");
    			attr(link, "as", "style");
    			attr(link, "href", link_href_value = editor.baseUrlTheme + "pe-items/svelte/clsSMShadedGrid/css/ShadingStyle.min.css");
    			attr(table, "id", "table");
    			attr(table, "class", "table-bordered shadingTable");
    			set_style(table, "pointer-events", /*isReview*/ ctx[0] ? "none" : "");
    			attr(div0, "class", "h mt-5 text-center");
    			attr(div0, "id", "correctCountStatus");
    			set_style(div0, "color", /*incorrectCls*/ ctx[2]);
    			attr(div1, "class", "shadingPreview");
    		},
    		m(target, anchor) {
    			insert(target, link, anchor);
    			insert(target, t0, anchor);
    			insert(target, div1, anchor);
    			mount_component(itemhelper, div1, null);
    			append(div1, t1);
    			append(div1, table);
    			append(table, tbody);
    			if (if_block) if_block.m(tbody, null);
    			append(div1, t2);
    			append(div1, div0);
    			append(div0, t3);
    			append(div0, t4);
    			append(div0, t5);
    			append(div0, t6);
    			append(div0, t7);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);

    			if (/*total_row_count*/ ctx[4] && /*total_row_count*/ ctx[4].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(tbody, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty[0] & /*isReview*/ 1) {
    				set_style(table, "pointer-events", /*isReview*/ ctx[0] ? "none" : "");
    			}

    			if ((!current || dirty[0] & /*state*/ 32) && t5_value !== (t5_value = /*state*/ ctx[5].correctCount + "")) set_data(t5, t5_value);

    			if (!current || dirty[0] & /*incorrectCls*/ 4) {
    				set_style(div0, "color", /*incorrectCls*/ ctx[2]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(link);
    			if (detaching) detach(t0);
    			if (detaching) detach(div1);
    			destroy_component(itemhelper);
    			if (if_block) if_block.d();
    		}
    	};
    }
    let sizeMultipleIndex = 40;

    function instance$1($$self, $$props, $$invalidate) {
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let { editorState } = $$props;
    	let showSelectedAns = "";
    	let ans = [];
    	let ansCheck, userTab = true;
    	let ansNotPerformed;
    	let incorrectCls = "";
    	let class_val = 1;

    	let cellIndex,
    		showAnsIndex,
    		locked_cell_values,
    		shaded_cell_values,
    		preview_table,
    		total_row_count;

    	let state = {
    		rowCount: 1,
    		colCount: 4,
    		gridWidth: 80,
    		gridHeight: 80,
    		correctAns: [],
    		correctCount: "",
    		userAns: [],
    		shadedCell: [],
    		cellLocked: false,
    		hiddenCell: [],
    		smController: "h",
    		itemLayout: [],
    		iconVisible: "h",
    		pointerEvents: "auto",
    		checkLockCell: "",
    		lockedCellValue: "",
    		pointerEvents: ""
    	};

    	onMount(() => {
    		$$invalidate(5, state.xml = xml, state);
    		resetValue();

    		if (!uxml) {
    			$$invalidate(5, state.userAns = [], state);
    		}

    		loadModule(xml);
    	}); //for future use
    	//let timer = setTimeout(function() {
    	//AH.select("#special_module_user_xml").innerText = "<smans userAns='" + state.userAns.join() + "'></smans>";
    	//new_uxml = "<smans userAns='" + state.userAns.join() + "'></smans>";

    	// Set correct answer color
    	function setCorrectAnswerColor(id) {
    		// Return grid Color green for correct answer, red for incorrect answer and grey for not performed
    		ansCheck = state.iconVisible == "" && state.userAns.includes(id)
    		? getCorrect(id) ? " gridCorrect" : " gridIncorrect"
    		: "";

    		ansNotPerformed = state.iconVisible == "" && !state.userAns.includes(id)
    		? getNotPerformed(id) ? " gridNotPerformed" : ""
    		: "";

    		ansCheck = ansCheck + ansNotPerformed;
    		return ansCheck;
    	}

    	//to show shaded grid according to uxml
    	function parseUserAns(uans) {
    		let userAnswer = XMLToJSON(uans);
    		$$invalidate(5, state.userAns = userAnswer.smans._userAns.split(","), state);

    		if (userAnswer.smans._userAns) {
    			let user_ans_cell = "#p" + userAnswer.smans._userAns.split(",").join(",#p");
    			AH.selectAll(".shadingPreview .shadingTable td", "removeClass", "gridSelected");

    			AH.selectAll(".shadingPreview .shadingTable td").forEach(function (table_td) {
    				table_td.dataset.grid = "no";
    			});

    			AH.selectAll(user_ans_cell, "addClass", "gridSelected");

    			AH.selectAll(user_ans_cell).forEach(function (table_td) {
    				table_td.dataset.grid = "selected";
    			});
    		}
    	}

    	// loads the module according to the value of question xml and user xml
    	function loadModule(loadXml) {
    		loadXml = XMLToJSON(loadXml);
    		parseXMLPreview(loadXml);
    	}

    	// updates the xml after parsing the xml and shows answer
    	function parseXMLPreview(MYXML) {
    		try {
    			$$invalidate(5, state.rowCount = MYXML.smxml._rowCount, state);
    			$$invalidate(5, state.colCount = MYXML.smxml._colCount, state);
    			$$invalidate(5, state.gridWidth = parseInt(MYXML.smxml._cellWidth) * sizeMultipleIndex, state);
    			$$invalidate(5, state.gridHeight = parseInt(MYXML.smxml._cellHeight) * sizeMultipleIndex, state);
    			$$invalidate(5, state.correctAns = MYXML.smxml._correctAns.split(","), state);
    			$$invalidate(5, state.correctCount = MYXML.smxml._correctCount, state);
    			$$invalidate(5, state.cellLocked = MYXML.smxml._lockedCell, state);
    			$$invalidate(5, state.hiddenCell = MYXML.smxml._hiddenCell, state);
    			$$invalidate(5, state.shadedCell = MYXML.smxml._shadedCell, state);
    			$$invalidate(5, state.lockedCellValue = MYXML.smxml._lockedCellValue, state);
    			setDefaultValues();

    			if (uxml) {
    				parseUserAns(uxml);
    			}
    		} catch(error) {
    			console.warn({
    				"error": error.message,
    				"function name": "parseXMLPreview",
    				"File name": "ShadingPreview.js"
    			});
    		}
    	}

    	//reset the shaded grid and correct grid
    	function resetValue() {
    		$$invalidate(5, state.correctAns = [], state);
    		$$invalidate(5, state.correctCount = [], state);
    		$$invalidate(5, state.shadedCell = [], state);
    	}

    	//to check if the shaded grid is correct or not
    	function getCorrect(id) {
    		//Return true if this id is correct answer
    		if (state.correctAns != 0) {
    			if (state.correctAns.includes(id)) {
    				return true;
    			} else {
    				return false;
    			}
    		} else {
    			if (state.userAns.length == state.correctCount) {
    				$$invalidate(2, incorrectCls = "#136d13");
    				return true;
    			} else {
    				$$invalidate(2, incorrectCls = "#c30f0f");
    				return false;
    			}
    		}
    	}

    	//to check if the correct ans grid is checked or not
    	function getNotPerformed(id) {
    		let result;

    		if (state.correctAns != 0) {
    			result = state.correctAns.includes(id) && !state.userAns.includes(id)
    			? true
    			: false;
    		}

    		return result;
    	}

    	// Set lock to author shaded cells
    	function getClassDetail(cellIndex, locked_cell_values, shaded_cell_values) {
    		let classDetail = "";

    		if (locked_cell_values.indexOf(cellIndex) != -1) {
    			classDetail += "lockedGrid ";
    		}

    		if (shaded_cell_values.indexOf(cellIndex) != -1 && class_val == 1) {
    			classDetail += "gridSelected";
    		}

    		return classDetail;
    	}

    	//set default values after loading 
    	function setDefaultValues() {
    		let shadedCell = state.shadedCell != ""
    		? "#p" + state.shadedCell.split(",").join(",#p")
    		: "";

    		AH.selectAll(".shadingPreview .shadingTable td", "removeClass", "gridSelected");
    		AH.selectAll(".shadingPreview .shadingTable td", "removeClass", "lockedGrid");

    		AH.selectAll(".shadingPreview .shadingTable td").forEach(function (table_td) {
    			table_td.dataset.grid = "no";
    		});

    		if (shadedCell != "") {
    			AH.selectAll(shadedCell, "addClass", "gridSelected");

    			AH.selectAll(shadedCell).forEach(function (table_td) {
    				table_td.dataset.grid = "selected";
    			});
    		}
    	}

    	//function to execute when the grid is clicked
    	function gridClick(e) {
    		let targetId = e.target.id;
    		class_val--;

    		if (!AH.select(".shadingPreview [id='" + targetId + "']").classList.contains("lockedGrid")) {
    			if (!AH.select(".shadingPreview [id='" + targetId + "']").classList.contains("gridSelected")) {
    				AH.select(".shadingPreview [id='" + targetId + "']").setAttribute("data-grid", "selected");
    				AH.selectAll(".shadingPreview [id='" + targetId + "']", "addClass", "gridSelected");
    			} else {
    				AH.select(".shadingPreview [id='" + targetId + "']").setAttribute("data-grid", "no");
    				AH.selectAll(".shadingPreview [id='" + targetId + "']", "removeClass", "gridSelected");
    			}
    		}

    		//state.userAns = userAns;
    		let u_answer = checkAns();

    		if (!editorState) {
    			onUserAnsChange({ uXml: state.userxml, ans: u_answer });
    		}
    	}

    	//to show correct and user answer 
    	function showAnswer(val, iconState) {
    		//show correct incorrect icon with respect to iconState
    		if (iconState == "showIcon") {
    			$$invalidate(5, state.iconVisible = "", state);
    		} else {
    			$$invalidate(5, state.iconVisible = "h", state);
    		}

    		//show correct answer and user answer
    		if (val == "cans") {
    			$$invalidate(16, ans = state.correctAns);
    		} else if (val == "yans") {
    			$$invalidate(16, ans = state.userAns);
    		}
    	}

    	//to check answer
    	function checkAns() {
    		const correctLength = state.correctAns.length;
    		let resultLength = 0;
    		let ans_val = "", ans_status = "";
    		$$invalidate(5, state.userAns = [], state);

    		AH.selectAll(".shadingPreview .shadingTable .gridSelected").forEach(function (value) {
    			state.userAns.push(value.getAttribute("pevdata-id"));
    		});

    		AH.select("#special_module_user_xml").innerText = "<smans userAns='" + state.userAns.join() + "'></smans>";
    		$$invalidate(5, state.userxml = "<smans userAns='" + state.userAns.join() + "'></smans>", state);

    		if (state.correctAns != "") {
    			state.correctAns.map(function (data, i) {
    				state.userAns.map(function (data2, j) {
    					if (data == data2) {
    						resultLength = resultLength + 1;
    					}
    				});
    			});

    			//Check if total no. of user answer is equal to correct answer
    			if (correctLength == resultLength && resultLength == state.userAns.length) {
    				ans_val = language.correct;
    			} else {
    				ans_val = language.incorrect;
    			}

    			if (typeof calculatePoint != "undefined") {
    				calculatePoint(state.correctAns.length, resultLength);
    			}

    			if (ans_val == "Incorrect") {
    				ans_status = false;
    			} else {
    				ans_status = true;
    			}

    			if (editorState) {
    				showAns(ans_val);
    			}
    		}

    		if (!editorState) {
    			onUserAnsChange({ uXml: state.userxml, ans: ans_status });
    		}

    		return ans_status;
    	}

    	//if review mode is OFF
    	function unsetReview() {
    		showAnswer("yans", "hideIcon");
    		$$invalidate(0, isReview = false);

    		state.correctCount != "" && state.correctAns == ""
    		? AH.selectAll("#correctCountStatus", "addClass", "h")
    		: "";
    	}

    	//if review mode is ON
    	function setReview() {
    		showAnswer("yans", "showIcon");
    		$$invalidate(0, isReview = true);

    		state.correctCount != "" && state.correctAns == ""
    		? AH.selectAll("#correctCountStatus", "removeClass", "h")
    		: "";
    	}

    	//ada
    	function adaKeyupGridClick(e) {
    		if (e.keyCode == 13) {
    			gridClick(e);
    		}
    	}

    	//to switch correct ans and your ans tab
    	function handleReviewMode(mode) {
    		if (mode == "c") {
    			$$invalidate(1, userTab = false);
    		} else if (mode == "u") {
    			$$invalidate(1, userTab = true);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(11, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(12, uxml = $$props.uxml);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("showAns" in $$props) $$invalidate(13, showAns = $$props.showAns);
    		if ("editorState" in $$props) $$invalidate(14, editorState = $$props.editorState);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isReview, xml, state, cellIndex, showAnsIndex, total_row_count, ans, preview_table, showSelectedAns, locked_cell_values, shaded_cell_values*/ 15829049) {
    			//clearTimeout(timer);
    			//}, 500);
    			 {
    				if (isReview) {
    					setReview();
    				} else {
    					unsetReview();
    				}

    				if (xml != state.xml) {
    					$$invalidate(5, state.xml = xml, state);
    					loadModule(xml);

    					setTimeout(
    						function () {
    							checkAns();
    						},
    						300
    					);
    				}

    				($$invalidate(4, total_row_count = []), $$invalidate(3, preview_table = []));

    				$$invalidate(22, locked_cell_values = state.lockedCellValue != undefined && state.lockedCellValue != ""
    				? state.lockedCellValue.split(",")
    				: "");

    				$$invalidate(23, shaded_cell_values = state.shadedCell != ""
    				? state.shadedCell.split(",")
    				: "");

    				//to create grid
    				for (let i = 0; i < state.rowCount; i++) {
    					$$invalidate(4, total_row_count = [...total_row_count, { id: "gridRow_" + i }]);

    					for (let j = 0; j < state.colCount; j++) {
    						$$invalidate(20, cellIndex = i + "_" + j);

    						if (ans != "") {
    							$$invalidate(21, showAnsIndex = ans.indexOf(cellIndex));
    							$$invalidate(15, showSelectedAns = showAnsIndex != -1 ? "gridSelected" : "");
    						} else {
    							$$invalidate(15, showSelectedAns = "");
    						}

    						$$invalidate(3, preview_table = [
    							...preview_table,
    							{
    								id: "p" + cellIndex,
    								tabindex: state.pointerEvents == "auto" ? "0" : "",
    								arialabel: "Grids row " + (i + 1) + " and column " + (j + 1) + " is selected",
    								pevdata: cellIndex,
    								class: showSelectedAns,
    								width: parseInt(state.gridWidth) + "px",
    								height: parseInt(state.gridHeight) + "px",
    								classDetails: getClassDetail(cellIndex, locked_cell_values, shaded_cell_values),
    								correctAnswerColor: setCorrectAnswerColor(cellIndex),
    								spanclass: getCorrect(cellIndex)
    								? "icomoon-24px-correct"
    								: "icomoon-24px-close",
    								spanarialabel: getCorrect(cellIndex)
    								? getNotPerformed(cellIndex)
    									? "marked as unattempted"
    									: "marked as correct"
    								: "marked as incorrect",
    								spanstyle: !state.userAns.includes(cellIndex)
    								? getNotPerformed(cellIndex) ? "#222" : ""
    								: getCorrect(cellIndex) ? "#136d13" : "#c30f0f",
    								spandisplay: state.iconVisible == "" && state.userAns.includes(cellIndex) || state.iconVisible == "" && !state.userAns.includes(cellIndex) && getNotPerformed(cellIndex)
    								? "block"
    								: "none",
    								rowno: i,
    								corrspanclass: getCorrect(cellIndex) ? "icomoon-24px-correct" : "",
    								corrspanstyle: getCorrect(cellIndex) ? "#136d13" : ""
    							}
    						]);
    					}
    				}
    			}
    		}
    	};

    	return [
    		isReview,
    		userTab,
    		incorrectCls,
    		preview_table,
    		total_row_count,
    		state,
    		gridClick,
    		unsetReview,
    		setReview,
    		adaKeyupGridClick,
    		handleReviewMode,
    		xml,
    		uxml,
    		showAns,
    		editorState
    	];
    }

    class ShadingPreview extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				xml: 11,
    				uxml: 12,
    				isReview: 0,
    				showAns: 13,
    				editorState: 14
    			},
    			[-1, -1]
    		);
    	}
    }

    const defXMl = `<smxml type="44" name="Shading" rowCount="1" colCount="4" cellWidth="2" cellHeight="2" correctAns="" correctCount="" shadedCell="" lockedCell="false" HiddenCell="" lockedCellValue=""><!--[CDATA[]]--></smxml>`;

    const app = new ShadingPreview({
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
//# sourceMappingURL=bundle_q44.js.map
