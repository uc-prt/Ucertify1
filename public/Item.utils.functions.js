/**
 *  File Name   : Items.utils.function.js
 *  Author      : Pradeep Yadav
 *  Function    : Item Helper
 *  Version     : 1.0
 *  Packege     : pe-items.lib
 *  Last update : 28 May 2019
 *  Dependency  : No any dependency ( Core javascript library )
 */
var trackInf = {};
var logInf = [];
var filterData = false;
var isTrack = false;
var temp = 0;
var siteUrl = "";
var uploadFieldId = "";
var _this = null;
var listener = {};
var buffer = {};
var bsCat1 = ['Modal', 'Tooltip', 'Collapse', 'Popover', 'ScrollSpy', 'Tab'];
var extraSelectors = ['hidden', 'visible', 'selected', 'checked', 'enabled'];
function helper() {
    window.AI = {};
    var local = this;
    return({
        test:function(status) {
            isTrack = status;
        },
        param2Url: function(params) {
            let url = [];
            for (var i in params) {
                var uri = i + '=' + params[i];
                url.push(uri);
            }
            return url.join('&');
        },
        unique: function(myArray) {
            return myArray.filter((v, i, a) => a.indexOf(v) === i);
        },
        parseJSON: function(obj, showErr_data) {
            let showErr = showErr_data || false;
            try {
                return JSON.parse(obj);
            } catch (e) {
                if (showErr) {
                    console.warn(e);
                }
                return {}; //Return blank object
            }
        },
        parseDom: function(str) {
            let parser = new DOMParser();
            let html = parser.parseFromString(str, 'text/html');
            return html;
        },
        addScript: function(data, isUrl) {
            let sc = document.createElement("script");
            if (isUrl) {
                sc.src = url;
                sc.async = true;
            } else {
                sc.innerHTML = data;
            }
            document.head.append(sc);
            return sc;
        },
        parseHtml: templateHtml,
        hasInall: function(selector, target) {
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
        },
        removeDomAttr: function (selector, attrArray) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (current) {
                attrArray.forEach((attr)=> {
                    current.removeAttribute(attr);
                });
            }

            return current || {};
        },
        trigger: function(selector, evName, options) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (current) {
                options ? current.dispatchEvent(new Event(evName, options)) : current.dispatchEvent(new Event(evName));
            } else {
                console.log("Selector not found.", selector);
            }
        },
        findChild: function(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let list = current.children || [];
            let found;
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
        },
        parent: function(selector, search) {
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
        },
        siblings: function(selector, search) {
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
        },
        nextAll: function(selector) {
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
        },
        nextElm: function(selector, search) {
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
        },
        prevElm: function(selector, search) {
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
        },
        onReady: function(func) {
            document.addEventListener('DOMContentLoaded', function(event) {
                func.call(event);
            })
        },
        create: function(tagName, html) {
            let elem = document.createElement(tagName);
            if (html) {
                elem.innerHTML = html;
            }
            return elem;
            
        },
        clone: function(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return selected.cloneNode(true);
            }
            return null;
        },
        serialize: function(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return new URLSearchParams(new FormData(selected)).toString();
            }
            return null;
        },
        empty: function(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                while(selected.firstChild) selected.removeChild(selected.firstChild)
            }
        },
        getBS: function(target, comp, options) {
            let selected = (typeof target == "object") ? target : document.querySelector(target);
            if (selected && bsCat1.includes(comp)) {
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
        },
        enableBsAll: function(selector, comp) {
            if (bsCat1.includes(comp)) {
                let triggerList = [].slice.call(document.querySelectorAll(selector));
                let fireList = triggerList.map(function (triggerElm) {
                    return new bootstrap[comp](triggerElm)
                })
                return fireList;
            } else {
                console.error("Bootstrap can't enable for this component name");
                return [];
            }
        },
        hideBsAll: function(fireList, comp) {
            if (bsCat1.includes(comp)) {
                fireList.forEach(function (elm) {
                    elm.hide();
                })
            } else {
                console.error("Bootstrap can't disable for this component name");
            }
        },
        ajax: function(sendData) {
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
                request.send(longData);
            });
        },
        getJSON: function(url) {
            var scr = document.createElement('script')
            scr.src = url;
            document.body.appendChild(scr);
        },
        offset: function(container) {
            let rect = (typeof container == "object") ? container : document.querySelector(container);
            let offset = {rect};
            if (rect) {
                rect = ClientRect.getBoundingClientRect();
                offset = { 
                    rect,
                    top: rect.top + window.scrollY, 
                    left: rect.left + window.scrollX, 
                };
            }
            
            return offset;
        },
        inArray: function(baseArray, compareArray) {
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
        },
        find: function(baseSelector, target, data ) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let typeAction = (typeof data == "object") ? "action" : data;
            if (base) {
                switch (typeAction) {
                    case 'all' : return base.querySelectorAll(target);
                    case 'child' : return base.querySelector(target).childNodes;
                    case 'hidden': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.hidden);
                    case 'visible': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> !elm.hidden);
                    case 'checked': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.checked);
                    case 'selected': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.selected);
                    case 'action': {
                        let found = base.querySelectorAll(target);
                        if (found && found.length > 0 && data.action) {
                            found.forEach((_elm)=> jsAction(_elm, {action: data.action, actionData: data.actionData}));
                        }
                        return found;
                    }
                    break;
                    default: return base.querySelector(target);  
                }
            }
            return [];
        },
        selectAll: function(selector, action, actionData) {
            let selected = extraSelectors.includes(action) ?  selectAction(selector, action) : document.querySelectorAll(selector);
            if (selected && selected.length > 0 && action) {
                selected.forEach((elm)=> jsAction(elm, {action, actionData}));
            }
            return selected;
        },
        select(selector, action, actionData) {
            if (extraSelectors.includes(action) ) {
                return selectAction(selector, action);
            } else {
                selector = document.querySelector(selector);
                if (selector) {
                    jsAction(selector, {action, actionData});
                }
                return  selector || {};
            }
        },
        getElm: function(selector, type) {
            if (type) {
                return new Promise((resolve, reject)=> {
                    let target = document.getElementById(selector);
                    if (target) {
                        resolve(target);
                    } else {
                        reject(null);
                    }
                });
            } else {
                return document.getElementById(selector) || {};
            }
        },
        listenAll: function(target, eventName, func) {
            let selected = (typeof target == "object") ? target : document.querySelectorAll(target);
            if (selected && selected.length > 0) {
                for (let i = 0; i < selected.length; i++) {
                    selected[i].addEventListener(eventName, func, false);
                }
            }
        },
        bind: function(selector, eventName, handler) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                selected.addEventListener(eventName, handler);
            }
        },
        listen: function(baseSelector, eventName, selector, handler) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            if (listener[selector]) {
                base.removeEventListener(eventName, listener[selector]);
            }
            listener[selector] = onListen.bind(this, selector, handler, base);
            base.addEventListener(eventName, listener[selector]);
        },
        removeClass: function(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> jsAction(elm, {action: 'removeClass', actionData: name}) );
            }
            return selected || {};
        },
        addClass: function(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> jsAction(elm, {action: 'addClass', actionData: name}) );
            }
            return selected || {};
        },
        toggleDom: function(dom, action="toggleDisplay") {
            let selected =  typeof dom == "object" ? dom : document.querySelectorAll(dom);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> jsAction(elm, {action}));
            }
            return selected || {};
        },
        select2: function(selecor) {
            let found = document.querySelector(`${selecor} + span > .selection > span`);
            if (found) {
                found.click();
            }
        },
        setAttr: function(selector, attrs) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in attrs) {
                    selected.setAttribute(property, attrs[property]);
                }
            }
            return selected || {};
        },
        setCss: function(selector, cssList) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in cssList) {
                    selected.style && (selected.style[property] = cssList[property]);
                }
            }
            return selected || {};
        },
        remove: function(dom) {
            let selected =  document.querySelectorAll(dom);
            if (selected.length > 0) {
                selected.forEach((elm)=> elm.remove());
            }
        },
        innerChild,
        replaceWith: function(selector, domStr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                let createdNode = templateHtml(domStr);
                selected.replaceWith(createdNode);
                return createdNode;
            }
            return selected;

        },
        wrap: function(selector, domStr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                let createdNode = templateHtml(domStr);
                let innerNode = innerChild(createdNode);
                innerNode.innerHTML = selected.outerHTML;
                selected.parentNode.replaceChild(createdNode, selected);
                return innerNode.firstChild;
            }
            return selected;
        },
        unwrap: function (selector) {
            let nodeToRemove = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (nodeToRemove && nodeToRemove.length > 0) {
                nodeToRemove.forEach((item)=> {
                    item.outerHTML = item.innerHTML;
                })
            }
        },
        insertAfter: function(newNode, existingNode) {
            newNode = (typeof newNode == "object") ? newNode : document.querySelector(newNode);
            existingNode = (typeof existingNode == "object") ? existingNode : document.querySelector(existingNode);
            if (newNode && existingNode) {
                existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
            }

            return newNode;
        },
        insert: function(selector, domStr, position) {
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
        },
        domIndex: function(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return Array.from( selected.parentNode.children ).indexOf( selected );
            } else {
                retunr -1;
            }
        },
        match: function(baseSelector, mathStr) {
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
        },
        contains: function (selector, text) {
            var elements = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                return [].filter.call(elements, function(element) {
                    return RegExp(text).test(element.textContent);
                  });
            } else {
                return [];
            }
        },
        extend: function () {
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
        
        },
        url: function(url = window.location.href) {
            return new URLSearchParams(url);
        },
        updateEditorUrl: function(data) {
            var newUrl = `?action=new&content_subtype=${data.subtype}&content_type=${data.type}&content_icon=${data.content_icon}&react_content=1`;
            window.history.replaceState(null, '', newUrl);
        },
        loadUrl: function() {
        },
        watchDom: function(target, func) {
            var observer = new MutationObserver(function (mutationRecords) {
                    //if (mutationRecords[0].addedNodes[0].nodeName === "SPAN")
                    func && func(mutationRecords);
                });
            observer.observe(target, { attributes: true, childList: true, subtree: true });
            return observer;
        },
        ignoreEnity: function(html) {
            return html.replace(/&amp;/g,'&');
        },
        ref: function(ref) {
            if (ref) {
                _this = ref;
            } else {
                return _this;
            }
        },
        validateAjaxData: function(ajaxData, type) {
            if (type == 0 || type == 8) {
                if (ajaxData && !AI.get('is_proposed')) {
                    if (ajaxData.content_text) {
                        try {
                            ajaxData.content_text.answers.forEach(function(item,index) {
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
            
        },
        cache: function(func) {
            var chacheData = new Map();
            return function(input) {
                if(chacheData.has(input)) {
                    return chacheData.get(input);
                }

                var newResult = func(input);
                chacheData.set(input,newResult);

                return newResult;
            }
        },
        set:function(key, value) {
            window.AI[key] = value;
        },
        get: function(key) {
            return window.AI[key];
        },
        caller:function() {
            console.log("called from " + arguments.callee.caller.toString());
        },
        showmsg: function(msg, time = 10000) {
            let errorAlert = document.querySelector("#errmsg");
            if (buffer['showmsg']) clearTimeout(buffer['showmsg']);
            if (msg != "") {
                errorAlert.classList.remove('h');
                errorAlert.classList.add('show');
                errorAlert.innerHTML = msg;
                buffer['showmsg'] = setTimeout(function() { 
                    errorAlert.classList.remove('show');
                    errorAlert.classList.add('h');
                }, time);  
            } else {
                errorAlert.classList.remove('show');
                errorAlert.classList.add('h');
            }
        },
        trackError:function(site) {
            siteUrl = site;
            window.onerror = function(msg, url, line, col, error) {
                // Note that col & error are new to the HTML 5 spec and may not be 
                // supported in every browser.  It worked for me in Chrome.
                var extra = !col ? '' : '\ncolumn: ' + col;
                extra += !error ? '' : '\nerror: ' + error;
                var storeData = {msg,url,line,extra,user_guid, guid: window.content_guid || ""};
                // You can view the information in console to see things working like this:
                console.log(storeData);
            
                // TODO: Report this error via ajax so you can keep track
                //       of what pages have JS issues
                if (siteUrl && siteUrl !== undefined) {
                	var target = siteUrl + "pe-setdata.php?";
                    store(target,storeData);
                }
            
                var suppressErrorAlert = true;
                // If you return true, then error alerts (like in older versions of 
                // Internet Explorer) will be suppressed.
                return suppressErrorAlert;
            };
        },
        override:function() {
            // define a new console
            var _log = console.log;
            console.log = function(logMessage) {
                // Do something with the log message
                if(logMessage && !logMessage.off) {
                    trackInf[temp] = logMessage;
                    temp++;
                }
                //Then pass the console
                _log.apply(console,arguments);
                //console.trace();
            }
        },
        profile: function(tag) {
            if (isDev == "1") {
                tag != "end" ? console.profile(tag) : console.profileEnd();
            }
        },
        trace: function(inf,id) {
            if(isTrack && id) {
                trackInf[id] = inf;
            }
        },
        getTrace: function() {
            return trackInf;
        },
        isValid: function(data, filter = false) {
            if (data && data != undefined && data != "" && data != "undefined" && data != null) {
                return true;
            } else {
                if (filter && data != filter) return true;
                return false;
            }
        },
        logFilter:function(data) {
            filterData = data;
        },
        createLink: function(path) {
            let link = document.createElement('link')
            link.href = path;
            link.rel = "stylesheet";
            document.head.append(link);
        },
        log:function(block,data) {
            if( filterData != false && filterData.indexof(block) == -1) return false;
            if(block == 0) {
                logInf = [];
            } else if(block && data) {
                logInf.push({block,data});
            } else if(block) {
                logInf.push(block);
            } else {
                console.log(logInf);
            }
        },
        activate,

    });
}
function store(target,data) {
    var request = new XMLHttpRequest();
    var url = target + query(data);
    console.log({Status:"Ajax Opended",off:true});
    request.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function(event) {
        if (request.readyState == 4 && request.status === 200) {
            console.log({store:request.responseText,func:"ajax@reactItems",off:true});
        } 
    };

    request.onerror = function(e) {
        console.log({error:"Error did not stored",log:e});
    };
    request.send();
}
function query(data) {
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

function activate(loader) {
    document.querySelector('#activateLoaderContainer') && document.querySelector('#activateLoaderContainer').remove(); 
    if (loader > 0) {
        AI.insert(document.body, `<div id="activateLoaderContainer" class="activateOverlay" style="z-index:9999999;"><center><div class="activator" style="height:100px; width: 100px;"></div></center></div>`, 'afterend');
    }
}

function onListen(selector, handler, base, event) {
    let closest = event.target.closest && event.target.closest(selector);
    if (closest && base.contains(closest)) {
        // passes the event to the handler and sets `this`
        // in the handler as the closest parent matching the
        // selector from the target element of the event
        handler.call(this, closest, event);
    }
}

function innerChild(node) {
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

function templateHtml(html) {
    let t = document.createElement('template');
    t.innerHTML = html;
    return t.content.firstElementChild.cloneNode(true);
}

function selectAction(selector, type) {
    switch (type) {
        case 'hidden': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.hidden);
        case 'visible': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> !elm.hidden);
        case 'selected': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.selected);
        case 'checked': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.checked);
        case 'enabled': return document.querySelectorAll(selector + ':not([disabled]');
        default: return document.querySelector(selector);  
    }
}

function jsAction(selected, data) {
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
        case 'checked':  selected.checked = data.actionData;
        break;
        case 'remove': selected.remove();
        break;
        case 'removeAttr': selected.removeAttribute(data.actionData);
        break;
        case 'css' : css(selected, data.actionData);
        break;
        case 'attr': attr(selected, data.actionData);
        break;

    }
}
function attr(selector, attrs) {
    let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
    if (selected) {
        for (let property in attrs) {
            selected.setAttribute(property, attrs[property]);
        }
    }
    return selected || {};
}
function css(selector, cssList) {
    let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
    if (selected) {
        for (let property in cssList) {
            selected.style && (selected.style[property] = cssList[property]);
        }
    }
    return selected || {};
}